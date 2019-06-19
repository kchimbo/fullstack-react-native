import { PanResponder } from 'react-native';
import PropTypes from 'prop-types';
import React from 'react';

export default class Draggable extends React.Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    onTouchStart: PropTypes.func,
    onTouchMove: PropTypes.func,
    onTouchEnd: PropTypes.func,
    enabled: PropTypes.bool,
  };

  static defaultProps = {
    onTouchStart: () => {},
    onTouchMove: () => {},
    onTouchEnd: () => {},
    enabled: true,
  };

  constructor(props) {
    super(props);

    this.state = {
      dragging: false,
    }


    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: this.handleStartShouldSetPanResponder,
      onPanResponderGrant: this.handlePanResponderGrant, 
      onPanResponderMove: this.handlePanResponderMove, 
      onPanResponderRelease: this.handlePanResponderEnd, 
      onPanResponderTerminate: this.handlePanResponderEnd,
    })

  }

    // Should we become active when the user presses down on the square?
    handleStartShouldSetPanResponder = () => {
      const { enabled } = this.props;

      return enabled;
    }

    // When the component becomes the responder, we set dragging to true.
    handlePanResponderGrant = () => {
      const { onTouchStart } = this.props;

      this.setState({ dragging: true });

      // Allow the parent to animate the scale of the puzzle piece when a drag
      // begins.
      onTouchStart();
    }

    // Any time the user moves their finger, we'll call the onTouchMove prop
    // with the offset from the initial touch position.
    // This lets us animate the transform of the puzzle piece as it's dragged
    // from the Board.
    handlePanResponderMove = (e, gestureState) => {
      const { onTouchMove } = this.props;
      
      // Keep track of how far we've moved in total
      const offset = {
        top: gestureState.dy,
        left: gestureState.dx
      }

      onTouchMove(offset);
    }

    // When the user lift their finger, or if the operating system cancel the
    // gesture, we want to reset our state and call onTouchMove and onTouchEnd
    // with the final touch position.
    // NOTE: If the user receives a phone call, the drag gesturewill end as if 
    // the user had lifted their finger.
    // This is acceptable for our game, but in some scenearios it may be
    // desirable to handle the onPanResponderTerminate case differently from
    // an intentional touch event.
    handlePanResponderEnd = (e, gestureState) => {
      const { onTouchMove, onTouchEnd } = this.props;

      const offset = {
        top: gestureState.dy,
        left: gestureState.dx
      };

      this.setState({
        dragging: false,
      })

      onTouchMove(offset);
      onTouchEnd(offset);
    }

  render() {
    const { children } = this.props;
    const { dragging } = this.state;

    return children({
      handlers: this.panResponder.panHandlers,
      dragging,
    });
  }
}
