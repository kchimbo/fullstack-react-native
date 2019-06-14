import { StackNavigator } from 'react-navigation';

import Contacts from './screens/Contacts';
import Profile from './screens/Profile';

import colors from './utils/colors';

export default StackNavigator(
	{
		Profile: {
			screen: Profile,
		},
		Contacts: {
			screen: Contacts,
		},
	}, 
	{ 
		initialRouteName: 'Contacts',
	},
);