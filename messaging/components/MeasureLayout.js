import { Constants } from 'expo';
import { Platform, StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import React from 'react';

export default class MeasureLayout extends React.Component {
	static propTypes = {
		children: PropTypes.func.isRequired
	};

	state = {
		layout: null
	}

	handleLayout = (event) => {
		const { nativeEvent: { layout } } = event;

		// In Android, status bar height isn't include in the layout data
		this.setState({
			layout: {
				...layout,
			},
			y: 
				layout.y +
				(Platform.OS === 'android' ? Constants.statusBarHeight : 0),
		});
	};

	render() { 
		const { children } = this.props;
		const { layout } = this.state;

		// Measure the available space with a placeholder view set to flex: 1
		if (!layout) {
			// The function is handleLayout is called every time the component
			// updates its dimensions
			// We need to be careful when calling setState within this function
			// since setState may cause the component to re-render, in which
			// onLayout will be called again.... and cause and infinite loop.
			return (
				<View onLayout={this.handleLayout} style={styles.container} />
			);
		}
		return children(layout);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
})