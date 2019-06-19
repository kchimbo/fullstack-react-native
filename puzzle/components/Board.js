import {
  Animated,
  Image,
  StyleSheet,
  View,
  Dimensions,
  Easing,
} from 'react-native';
import PropTypes from 'prop-types';
import React from 'react';

import { availableMove, getIndex } from '../utils/puzzle';
import {
  calculateContainerSize,
  calculateItemSize,
  itemMargin,
  calculateItemPosition,
} from '../utils/grid';
import Draggable from './Draggable';
import PuzzlePropType from '../validators/PuzzlePropType';
import clamp from '../utils/clamp';

const State = {
  WillTransitionIn: 'WillTransitionIn',
  DidTransitionIn: 'DidTransitionIn',
  DidTransitionOut: 'DidTransitionOut',
};

export default class Board extends React.PureComponent {
  static propTypes = {
    puzzle: PuzzlePropType.isRequired,
    teardown: PropTypes.bool.isRequired,
    image: Image.propTypes.source,
    previousMove: PropTypes.number,
    onMoveSquare: PropTypes.func.isRequired,
    onTransitionIn: PropTypes.func.isRequired,
    onTransitionOut: PropTypes.func.isRequired,
  };

  static defaultProps = {
    image: null,
    previousMove: null,
  };

  constructor(props) {
    super(props);

    const { puzzle: { size, board } } = props;

    this.state = { transitionState: State.WillTransitionIn }
    this.animatedValues = [];

    // Pieces will initially render one screen-height below where we'll move
    // them
    const height = Dimensions.get('window').height;

    board.forEach( (square, index) => {

      const { top, left } = calculateItemPosition(size, index);

      this.animatedValues[square] = {
        scale: new Animated.Value(1),
        top: new Animated.Value(top + height), // was top
        left: new Animated.Value(left),
      }
    })
  }

  async componentDidMount() {

    await this.animateAllSquares(true);

    const { onTransitionIn } = this.props;

    this.setState({ transitionState: State.DidTransitionIn });

    onTransitionIn();

  }

  // We need to handle update to props in handleTouchEnd 
  // Whenever the puzzle object updates, we'll call updateSquarePosition to 
  // aniamte the piece that was last moved into its new position.
  async componentWillReceiveProps(nextProps) {
    const {
      previousMove,
      onTransitionOut,
      puzzle,
      teardown
    } = nextProps;

    const didMovePiece = this.props.puzzle !== puzzle && previousMove !== null;

    const shouldTeardown = !this.props.teardown && teardown;

    if (didMovePiece) {
      await this.updateSquarePosition(
        puzzle,
        previousMove,
        getIndex(puzzle, previousMove))
    }

    if (shouldTeardown) {
      await this.animateAllSquares(false);

      this.setState({ transitionState: State.DidTransitionOut });

      onTransitionOut();
    }
  } 

  animateAllSquares(visible) {
    const { puzzle: { board, size } } = this.props;

    const height = Dimensions.get('window').height;

    const animations = board.map( (square, index) => {
      const { top } = calculateItemPosition(size, index);

      return Animated.timing(this.animatedValues[square].top, {
        toValue: visible ? top : top + height,
        delay: 800 * (index / board.length),
        duration: 400,
        easing: visible ? Easing.out(Easing.ease) : Easing.in(Easing.ease),
        useNativeDriver: true
      });
    });

    return new Promise(resolve => 
      Animated.parallel(animations).start(resolve)
    );
  }

  handleTouchStart(square) {
    Animated.spring(this.animatedValues[square].scale, {
      toValue: 1.1,
      friction: 20,
      tension: 200,
      useNativeDriver: true
    }).start();
  }

  handleTouchMove(square, index, { top, left }) {
    const { puzzle, puzzle: { size } } = this.props;

    const itemSize = calculateItemSize(size);
    const move = availableMove(puzzle, square);

    const { 
      top: initialTop,
      left: initialLeft,
    } = calculateItemPosition(size, index);

    const distance = itemSize + itemMargin;

    const clampedTop = clamp(
      top,
      move === 'up' ? -distance : 0,
      move === 'down' ? distance : 0,
    );

    const clampedLeft = clamp(
      left,
      move === 'left' ? -distance : 0,
      move === 'right' ? distance : 0
    );

    this.animatedValues[square].left.setValue(
      initialLeft + clampedLeft
    );

    this.animatedValues[square].top.setValue(
      initialTop + clampedTop
    );
  }

  updateSquarePosition(puzzle, square, index) {
    const { size } = puzzle;

    const { top, left } = calculateItemPosition(size, index);

    // Since we're going to animate multiple values. We create an array
    // containing all animation objects.
    // We didn't call start start() on these animations. We need to know
    // when both animations have completed, which is hard to determine if we
    // start them independently.
    // For that case, React Native provides us Animated.parallel
    const animations = [
      Animated.spring(this.animatedValues[square].top, {
        toValue: top,
        friction: 20,
        tension: 200,
        useNativeDriver: true
      }),
      Animated.spring(this.animatedValues[square].left, {
        toValue: left,
        friction: 20,
        tension: 200,
        useNativeDriver: true
      })
    ]

    // The callback of start in Animated.parallel is called when every animation 
    // in the array is completed.
    // To make our updateSquarePostion slightly more convenient to use (using 
    // async/await), we'll return a Promise that resolve when the callback is 
    // called.
    return new Promise(resolve => 
      Animated.parallel(animations).start(resolve)
    );
  }

  // 1. We scale the piece back to its original size (a scale value of 1) using
  //    Animated.spring
  // 2. We need to detect whether the user dragged the piece far enough to move
  //    it or not.
  //    If the piece was moved more than halway into the empty square, then 
  //    we'll consider this a move, and we'll inform the Game of the move by 
  //    calling the onMoveSquare prop
  //    If the piece was moved less than halfway into the empty square, then
  //    we won't consider this a move and we'll instead animate the piece
  //    back to its original position
  handleTouchEnd(square, index, { top, left }) {
    const { puzzle, puzzle: { size }, onMoveSquare } = this.props;

    const itemSize = calculateItemSize(size);
    const move = availableMove(puzzle, square);

    // Reset the piece's scale.
    Animated.spring(this.animatedValues[square].scale, {
      toValue: 1,
      friction: 20,
      tension: 200,
      useNativeDriver: true
    }).start();

    // Based on the direction the piece has moved, we can determine if it was
    // moved more than halfway to its destination.
    if (
      (move === 'up' && top < -itemSize / 2) || 
      (move === 'down' && top > itemSize / 2) || 
      (move === 'left' && left < -itemSize / 2) || 
      (move === 'right' && left > itemSize / 2)
    ){ 
      // Inform the Game of a successful move
      onMoveSquare(square);
    } else {
      // Reset the piece's position
      this.updateSquarePosition(puzzle, square, index);
    }
  }

  renderSquare = (square, index) => {
    const { puzzle: { size, empty }, image } = this.props;
    const { transitionState } = this.state;

    if (square === empty) return null;

    const itemSize = calculateItemSize(size);

    return (
      <Draggable
        key={square}
        enabled={transitionState === State.DidTransitionIn}
        onTouchStart={() => this.handleTouchStart(square)}
        onTouchMove={offset =>
          this.handleTouchMove(square, index, offset)
        }
        onTouchEnd={offset => 
          this.handleTouchEnd(square, index, offset)
        }
      >
      {({ handlers, dragging }) => {
        const itemStyle = {
          position: 'absolute',
          width: itemSize,
          height: itemSize,
          overflow: 'hidden',
          transform: [
            { translateX: this.animatedValues[square].left },
            { translateY: this.animatedValues[square].top },
            { scale: this.animatedValues[square].scale }
          ],
          zIndex: dragging ? 1 : 0
        };
          const imageStyle = {
            position: 'absolute',
            width: itemSize * size + (itemMargin * size - 1),
            height: itemSize * size + (itemMargin * size - 1),
            transform: [
              {
                translateX: -Math.floor(square % size) * (itemSize + itemMargin)
              },
              {
                translateY: -Math.floor(square / size) * (itemSize + itemMargin)
              }
            ]
          }
          return (
            <Animated.View {...handlers} style={itemStyle}>
              <Image style={imageStyle} source={image} />
            </Animated.View>
          );
      }}
      </Draggable>
      
    );
  }

  render() {
    const { puzzle: { board } } = this.props;
    const { transitionState } = this.state;

    const containerSize = calculateContainerSize();
    const containerStyle = {
      width: containerSize,
      height: containerSize,
    };

    return (
      <View style={[styles.container, containerStyle]}>
        {transitionState !== State.DidTransitionOut &&
          board.map(this.renderSquare)
        }
      </View>
    );

  }
}

const styles = StyleSheet.create({
  container: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: '#1F1E2A',
  },
  title: {
    fontSize: 24,
    color: '#69B8FF',
  },
});
