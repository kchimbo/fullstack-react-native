import React from 'react';

import { StyleSheet, View, ScrollView, Text } from 'react-native';
import uuidv4 from 'uuid/v4';

import EditableTimer from './components/EditableTimer';
import ToggleableTimerForm from './components/ToggleableTimerForm';
import { newTimer } from './utils/TimerUtils';

export default class App extends React.Component {
  state = {
    timers: [
      {
        title: 'Mow the lawn',
        project: 'House Chores',
        id: uuidv4(),
        elapsed: 556099,
        isRunning: true
      },
      {
        title: 'Bake squash',
        project: 'Kitchen Chores',
        id: uuidv4(),
        elapsed: 12373998,
        isRunning: false
      }
    ]
  }

  // After the component is mounted
  componentDidMount() {
    const TIME_INTERVAL = 1000;
    // We capture the return value of setInterval(fn, t) to allow us to stop
    // the interval at any point in the future using clearInterval().
    // We want to cancel (or "clear") if the timer is ever unmounted (deleted)
    // otherwise, it will run indefinetely and cause errors.
    this.intervalId = setInterval(() => {
      const { timers } = this.state;
      this.setState({
        timers: timers.map(timer => {
          const { elapsed, isRunning } = timer;
          return {
            ...timer,
            elapsed: isRunning ? elapsed + TIME_INTERVAL : elapsed,
          };
        })
      });
    }, TIME_INTERVAL);
  }

  // Fire before a component is unmounted or removed
  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  handleCreateFormSubmit = timer => {
    const { timers } = this.state;

    // Treat the state object (and the objects and arrays inside) as immutable.
    // We never want to mutate state outside of the this.setState() method
    this.setState({
      timers: [newTimer(timer), ...timers]
    })
  }

  handleFormSubmit = attrs => {
    const { timers} = this.state;
    this.setState({
      timers: timers.map(timer => {
        if (timer.id == attrs.id) {
          const { title, project } = attrs;
          return {
            ...timer,
            title,
            project,
          };
        }
        return timer;
      })
    })
  }

  handleRemovePress = id => {
    // Array.filter returns a new array with all elements that pass the test 
    // implemented by the provided function.
    this.setState({
      timers: this.state.timers.filter(t => t.id !== id)
    });
  }
  render() {
    const { timers } = this.state;

    return (
      <View style={styles.appContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Timers</Text>
        </View>
        <ScrollView style={styles.timerList}>
          <ToggleableTimerForm 
            onFormSubmit={this.handleCreateFormSubmit}
          />
          {timers.map(
            ({ title, project, id, elapsed, isRunning}) => (
              <EditableTimer
                key={id}
                id={id}
                title={title}
                project={project}
                elapsed={elapsed}
                isRunning={isRunning}
                onFormSubmit={this.handleFormSubmit}
                onRemovePress={this.handleRemovePress}
              />
            ),
          )}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
  },
  titleContainer: {
    paddingTop: 35,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#D6D7DA',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  timerList: {
    paddingBottom: 15,
  },
});
