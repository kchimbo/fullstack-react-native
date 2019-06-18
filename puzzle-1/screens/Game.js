import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import React from 'react';

import { move, movableSquares, isSolved } from '../utils/puzzle';
import Board from '../components/Board';
import Button from '../components/Button';
import PuzzlePropType from '../validators/PuzzlePropType';
import Preview from '../components/Preview';
import Stats from '../components/Stats';
import configureTransition from '../utils/configureTransition';

const State = {
  LoadingImage: 'LoadingImage',
  WillTransitionIn: 'WillTransitionIn',
  RequestTransitionOut: 'RequestTransitionOut',
  WillTransitionOut: 'WillTransitionOut',
};

export default class Game extends React.Component {
  static propTypes = {
    puzzle: PuzzlePropType.isRequired,
    image: Image.propTypes.source,
    onChange: PropTypes.func.isRequired,
    onQuit: PropTypes.func.isRequired,
  };

  static defaultProps = {
    image: null,
  };

  constructor(props) {
    super(props);

    const { image } = props;

    this.state = {
      transitionState: image ? State.WillTransitionIn : State.LoadingImage,
      moves: 0,
      elapsed: 0,
      previousMove: null,
      image: null,
    };

    configureTransition();
  }

  componentWillReceiveProps(nextProps) {
    const { image } = nextProps;
    const { transitionState } = this.state;

    if (image && transitionState === State.LoadingImage) {
      configureTransitionW(() => {
        this.setState({ transitionState: State.WillTransitionIn });
      });
    }
  }

  handlePressSquare = square => {
    const { puzzle, onChange } = this.props;
    const { moves } = this.state;

    if (!movableSquares(puzzle).includes(square)) return;

    const updated = move(puzzle, square);

    this.setState({ moves: moves + 1, previousMove: square });

    onChange(updated);

    if (isSolved(updated)) {
      this.requestTransitionOut();
    }
  };

  render() {
    const { puzzle, puzzle: { size }, image } = this.props;
    const { 
      transitionState,
      moves,
      elapsed,
      previousMove,
    } = this.state;
    
    return (
      <View style={styles.container}>
        {transitionState === State.LoadingImage && (
          <ActivityIndicator
            size={'large'}
            color={'rgba(255, 255, 255, 0.5)'}
          />
        )}
        {transitionState !== State.LoadingImage && (
          <View style={styles.centered}>
            <View style={styles.header}>
              <Preview image={image} boardSize={size} />
              <Stats moves={moves} time={elapsed} />
            </View>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 16,
    alignSelf: 'stretch',
  },
});
