import { Image, StyleSheet, View, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import React from 'react';

import AuthorRow from './AuthorRow';

export default class Card extends React.Component {
	static propTypes = {
		fullname: PropTypes.string.isRequired,
		image: Image.propTypes.source.isRequired,
		linkText: PropTypes.string,
		onPressLinkText: PropTypes.func
	};

	static defaultProps = {
		linkText: '',
		onPressLinkText: () => {},
	};

	state = {
		loading: true
	};

	handleLoad = () => {
		this.setState({ loading: false })
	};

	// FlatList re-renders our cards while we scroll.
	// Most of the time, card's data doesn't change so we don't need to update
	// the component after the initial render.
	// The only time the data might change is if the number of comments to 
	// display changes.
	shouldComponentUpdate(nextProps) {
		return this.props.linkText !== nextProps.linkText
	}

	render() {
		const { fullname, image, linkText, onPressLinkText } = this.props;
		const { loading } = this.state;

		return (
			<View>
				<AuthorRow
					fullname={fullname}
					linkText={linkText}
					onPressLinkText={onPressLinkText}
				/>
				<View style={styles.image}>
					{loading && (
						<ActivityIndicator 
							style={StyleSheet.absoluteFill}
							size={'large'}
						/>
					)}
					<Image 
						style={StyleSheet.absoluteFill} 
						source={image} 
						onLoad={this.handleLoad}
					/>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	image: {
		aspectRatio: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.02)',
	},
});