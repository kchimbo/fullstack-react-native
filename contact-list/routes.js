import { StackNavigator } from 'react-navigation';

import Contacts from './screens/Contacts';
import Profile from './screens/Profile';
import Favorites from './screens/Favorites';
import User from './screens/User'

import colors from './utils/colors';

export default StackNavigator(
	{
		Profile: {
			screen: Profile,
		},
		Contacts: {
			screen: Contacts,
		},
		User: {
			screen: User
		}
	}, 
	{ 
		initialRouteName: 'User',
	},
);