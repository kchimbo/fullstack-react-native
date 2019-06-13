import React from 'react';
import { Constants } from 'expo';
import { Platform, StyleSheet, Text, View } from 'react-native';
import CardList from './components/CardList';
import Feed from './screens/Feed';

const items = [
  { id: 0, author: 'Bob Ross' },
  { id: 1, author: 'Chuck Norris' },
];

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Feed style={styles.feed} />
      </View>
    );
  }
}

const platformVersion =
  Platform.OS === 'ios'
    ? parseInt(Platform.Version, 10)
    : Platform.Version

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
    flex: 1,
    backgroundColor: '#fff',
  },
  feed: {
    flex: 1,
    marginTop: 
      Platform.OS === 'android' || platformVersion < 11 ?
        Constants.statusBarHeight : 0
  }
});
