import React from 'react';
import { Constants } from 'expo';
import { 
	NetInfo,
	Platform,
	StatusBar,
	StyleSheet,
	Text,
	View
} from 'react-native'

const statusHeight = 
	(Platform.OS === 'ios') ? Constants.statusBarHeight : 0;

export default class Status extends React.Component {
	state = {
		isConnected: null,
	};

	render() {
		const { isConnected } = this.state;
		const backgroundColor = isConnected ? 'white' : 'red';
		const statusBar = (
			<StatusBar
				backgroundColor={backgroundColor}
				barStyle={isConnected ? 'dark-content' : 'light-content'}
				animated={false}
			/>
		);

		const messageContainer = (
			<View style={styles.messageContainer} pointerEvents={'none'}>
				{statusBar}
				{!isConnected && (
					<View style={styles.buble}>
						<Text style={styles.text}>No network connection</Text>
					</View>
				)}
			</View>
		);

		if (Platform.OS === 'ios') {
			return (
				<View style={[styles.status, { backgroundColor } ]}>
					{messageContainer}
				</View>
			)
		}

		return messageContainer; // temporary
	}
}

const styles = StyleSheet.create({
	status: {
		zIndex: 1, // component should be draw on top of other content
		height: statusHeight
	},
	messageContainer: {
		zIndex: 1,
		position: 'absolute',
		top: statusHeight + 20,
		right: 0,
		left: 0,
		height: 80,
		alignItems: 'center',
	},
	bubble: {
		paddingHorizontal: 20,
		paddingVertical: 10,
		borderRadius: 20,
		backgroundColor: 'red',
	},
	text: {
		color: 'white',
	}
})