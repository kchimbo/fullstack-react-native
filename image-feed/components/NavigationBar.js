import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import PropTypes from 'prop-types';
import React from 'react';


export default function NavigationBar({
	title,
	leftText,
	onPressLeftText
}) {
	return (
		<View style={styles.container}>
			<TouchableOpacity
				style={styles.leftText}
				onPress={onPressLeftText}
			>
				<Text>{leftText}</Text>
			</TouchableOpacity>
			<Text style={styles.title}>{title}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		height: 40,
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderBottomColor: 'rgba(0, 0, 0, 0.1)',
		alignItems: 'center',
		justifyContent: 'center',
	},
	title: {
		fontWeight: '500', // font weight must be a string
	},
	leftText: {
		position: 'absolute',
		left: 20,
		top: 0,
		bottom: 0,
		justifyContent: 'center',
	},
});

// We won't use isRequired since this component would likely be used without 
// some of them (e.g leftText and onPressLeft), if we were to add more screens
// to this app.
NavigationBar.propTypes = {
	title: PropTypes.string,
	leftText: PropTypes.string,
	onPressLeftText: PropTypes.func,
};

NavigationBar.defaultProps = {
	title: '',
	leftText: '',
	onPressLeftText: () => {},
};