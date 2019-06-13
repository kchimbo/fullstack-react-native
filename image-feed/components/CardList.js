import { FlatList } from 'react-native';
import PropTypes from 'prop-types';
import React from 'react';

import { getImageFromId } from '../utils/api';
import Card from './Card';

// Function to uniquely identify items.
// Determine when it needs to re-render items as they go in and out of the 
// visible portion of the screen.
const keyExtractor = ({ id }) => id.toString();

export default class CardList extends React.Component {
	static propTypes = {
		items: PropTypes.arrayOf(
			PropTypes.shape({
				id: PropTypes.number.isRequired,
				author: PropTypes.string.isRequired,
			})
		).isRequired,
	};

	// renderItem = ({ item: { id, author } }) => {}
	// This is equivalent:
	// 		renderItem = (obj) => {
	//			const id = obj.item.id;
	// 			const author = obj.item.author
	// 		}
	renderItem = ({ item: { id, author } }) => (
		<Card
			fullname={author}
			image={{
				uri: getImageFromId(id)
			}}
		/>	
	);

	render() {
		const { items } = this.props;

		return (
			<FlatList
				data={items}
				renderItem={this.renderItem}
				keyExtractor={keyExtractor}
			/>
		);
	}
}