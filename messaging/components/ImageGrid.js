import {
	CameraRoll,
	Image,
	StyleSheet,
	TouchableOpacity,
	View
} from 'react-native';
import { Permissions } from 'expo';
import PropTypes from 'prop-types';
import React from 'react';

import Grid from './Grid';

const keyExtractor = ({ uri }) => uri;

export default class ImageGrid extends React.Component {
	static propTypes = {
		onPressImage: PropTypes.func
	};

	static defaultProps = {
		onPressImage: () => {}
	};

	// Outside state because they don't affect component rendering.
	// We can also updatem synchronously which will make our implementation 
	// simpler

	// Only load one set of images at time
	loading = false;
	cursor = null;

	state = {
		images: [
			{ uri: 'https://picsum.photos/600/600?image=10' },
			{ uri: 'https://picsum.photos/600/600?image=20' },
			{ uri: 'https://picsum.photos/600/600?image=30' },
			{ uri: 'https://picsum.photos/600/600?image=40' },
		]
	};

	componentDidMount() {
		this.getImages();
	}

	getImages = async (after) => {

		if (this.loading) return;

		this.loading = true;

		const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

		if (status !== 'granted') {
			console.log('Camera roll permissions denied')
			return;
		}

		const results = await CameraRoll.getPhotos({
			first: 20,
			after
		});

		const { 
			edges, 
			page_info: { has_next_page, end_cursor } 
		} = results;

		const loadedImages = edges.map(item => item.node.image);

		this.setState({ 
			images: this.state.images.concat(loadedImages) 
		}, () => {
			this.loading = false;
			this.cursor = has_next_page ? end_cursor : null;
		});
	}

	getNextImages = async () => {
		if (!this.cursor) return;

		this.getImages(this.cursor);
		
	};

	renderItem = ({ item: { uri }, size, marginTop, marginLeft }) => {
		const { onPressImage } = this.props;

		const style = {
			width: size,
			height: size,
			marginLeft,
			marginTop
		};

		return (
			<TouchableOpacity
				key={uri}
				activeOpacity={0.75}
				onPress={() => onPressImage(uri)}
				style={style}
			>
				<Image source={{ uri }} style={style} />
			</TouchableOpacity>
		);
	}

	render() {
		const { images } = this.state;

		return (
			<Grid
				data={images}
				renderItem={this.renderItem}
				keyExtractor={keyExtractor}
				onEndReached={this.getNextImages}
			/>
		);
	}
}

const styles = StyleSheet.create({
	image: {
		flex: 1,
	},
});
