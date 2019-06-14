import { StackNavigator } from 'react-navigation';

import Contacts from './screens/Contacts';
import Profile from './screens/Profile';
import Favorites from './screens/Favorites';

import colors from './utils/colors';

export default StackNavigator(
	{
		Profile: {
			screen: Profile,
		},
		Contacts: {
			screen: Contacts,
		},
		Favorites: {
			screen: Favorites,
		}
	}, 
	{ 
		initialRouteName: 'Favorites',
	},
);