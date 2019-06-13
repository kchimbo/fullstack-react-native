import {
	StyleSheet,
	Text,
	TouchableOpacity,
	View
} from 'react-native';
import PropTypes from 'prop-types';
import React from 'react';

import Avatar from './Avatar';
import getAvatarColor from '../utils/getAvatarColor';
import getInitials from '../utils/getInitials';

export default function AuthorRow({
	fullname,
	linkText,
	onPressLinkText
}) {
	// Double negation with !! lets us make sure we're dealing with a boolean value
	return (
		<View style={styles.container}>
			<Avatar
				size={35}
				initials={getInitials(fullname)}
				backgroundColor={getAvatarColor(fullname)}
			/>
			<Text style={styles.text} numberOfLines={1}>
				{fullname}
			</Text>
			{!!linkText && (
				<TouchableOpacity onPress={onPressLinkText}>
					<Text numberOfLines={1}>{linkText}</Text>
				</TouchableOpacity>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		height: 50,
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 10,
	},
	// flex: 1 so Text will expand to fill any remaining space in the View.
	// It will push TouchableOpacity to the right side.
	text: {
		flex: 1,
		marginHorizontal: 6,
	}
});

AuthorRow.propTypes = {
	fullname: PropTypes.string.isRequired,
	linkText: PropTypes.string.isRequired,
	onPressLinkText: PropTypes.func.isRequired
}