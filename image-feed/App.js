import React from 'react';
import { Constants } from 'expo';
import { Modal, Platform, StyleSheet, Text, View } from 'react-native';
import CardList from './components/CardList';
import Feed from './screens/Feed';
import Comments from './screens/Comments';

export default class App extends React.Component {
  state = {
    commentsForItem: {},
    showModal: false,
    selectedItemId: null,
  };

  openCommentScreen = id => {
    this.setState({
      showModal: true,
      selectedItemId: id,
    });
  };

  closeCommentScreen = () => {
    this.setState({
      showModal: false,
      selectedItemId: null,
    });
  };

  onSubmitComment = (text) => {
    const { selectedItemId, commentsForItem } = this.state;
    const comments = commentsForItem[selectedItemId] || [];

    // Computed property names
    // ex: 
    // const name = 'foo';
    // const obj = { [name]: 'bar' };
    //
    // This is rougly equivalent to:
    // const name = 'foo';
    // const obj = {}
    // obj[name] = 'bar';
    const updated = {
      ...commentsForItem,
      [selectedItemId]: [...comments, text],
    };

    this.setState({ commentsForItem: updated });
  }
  
  render() {
    const { commentsForItem, showModal, selectedItemId } = this.state;
    return (
      <View style={styles.container}>
        <Feed 
          style={styles.feed} 
          commentsForItem={commentsForItem}
          onPressComments={this.openCommentScreen}
        />
        <Modal
          visible={showModal}
          animationType="slide"
          onRequestClose={this.closeCommentScreen}
        >
          <Comments
            style={styles.container}
            comments={commentsForItem[selectedItemId] || [] }
            onClose={this.closeCommentScreen}
            onSubmitComment={this.onSubmitComment}
          />
        </Modal>
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
  },
  comments: {
    flex: 1,
    marginTop: 
      Platform.OS === 'ios' && platformVersion < 11 ?
        Constants.statusBarHeight : 0,
  },
});
