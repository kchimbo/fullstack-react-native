import { StackNavigator } from 'react-navigation';

import Contacts from './screens/Contacts';
import Profile from './screens/Profile';

import colors from './utils/colors';

export default StackNavigator({
	Contacts: {
		screen: Contacts,
		// We can pass an object to navigationOptions
		navigationOptions: {
			title: 'Contacts'
		}
	},
	Profile: {
		screen: Profile,
		// We can also pass a function.
		// A function gives us access to the navigation props.
		// This is useful when we want our options to be derived from the 
		// navigation parameters.
		// 
		// on iOS: Control the text of the back button with headerBackTitle
		navigationOptions: ({ navigation: { state: { params } } }) => {
			const { contact: { name } } = params;
			return {
				title: name.split(' ')[0],
				headerTintColor: 'white',
				headerStyle: {
					backgroundColor: colors.blue
				},
			};
		},
	},
	}, { 
		// Set default navigation for multiple screens by defining
		// navigationOptions at the level of the navigator.
		navigationOptions: {
			headerStyle: {
				backgroundColor: colors.blue
			}
	}
});