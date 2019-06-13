import React from 'react';
import { Constants } from 'expo';
import { StyleSheet, Text, View } from 'react-native';
import CardList from './components/CardList';

const items = [
  { id: 0, author: 'Bob Ross' },
  { id: 1, author: 'Chuck Norris' },
];

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <CardList items={items} />
      </View>
    );
  }
}

// flex: 1 - the component will expand to fill its parent entirely
// flex: 0 - the component will shrink to the minimum space possible

// flexDirection: {column, row, column-reverse, row-reverse }
// default: column
// Choose the primary axis.

// justifyContent: { flex-start, flex-center, flex-end, space-around, space-between }
// default: flex-start
// Distribute children along the primary axis

// alignItems: { flex-start, flex-center, flex-end, stretch }
// default: flex-start
// Align children along the secondary axis
const styles = StyleSheet.create({
  container: {
    marginTop: Constants.statusBarHeight,
    flex: 1,
    backgroundColor: '#fff',
  },
});
