import React from 'react';
import { StackNavigator, TabNavigator, DrawerNavigator } from 'react-navigation';
// react-native-vector-icons wrapper. 
// Creating icons is done by using JSX to define icons components. So, we
// imported React as well.
import { MaterialIcons } from '@expo/vector-icons'

import Contacts from './screens/Contacts';
import Profile from './screens/Profile';
import Favorites from './screens/Favorites';
import User from './screens/User'
import Options from './screens/Options';

import colors from './utils/colors';

// getTabBarIcon takes an icon string as a paremeter and returns a functions 
// that takes the correct parameters expected by tabBarIcon.
const getTabBarIcon = icon => ({ tintColor }) => (
	<MaterialIcons name={icon} size={26} style={{ color: tintColor }} />
);

const ContactsScreens = StackNavigator({
	Contacts: {
		screen: Contacts
	},
	Profile: {
		screen: Profile
	},
}, {
	initialRouteName: 'Contacts',
	// tabBarIcon expects a function. It will call that function will a single
	// object that has the properties focused and tintColor
	navigationOptions: {
		drawerIcon: getTabBarIcon('list') // tabBarIcon with StackNavigator
	}
})

const FavoritesScreen = StackNavigator({
	Favorites: {
		screen: Favorites,
	},
	Profile: {
		screen: Profile,
	},
}, {
	initialRouteName: 'Favorites',
	navigationOptions: {
		drawerIcon: getTabBarIcon('star') // tabBarIcon with StackNavigator
	}
});

const UserScreens = StackNavigator({
	User: {
		screen: User,
	},
	Options: {
		screen: Options,
	}
}, {
	mode: 'modal',
	initialRouteName: 'User',
	navigationOptions: {
		drawerIcon: getTabBarIcon('person') // tabBarIcon with StackNavigator
	}
})

export default DrawerNavigator( // was TabNavigator
	{
		Contacts: {
			screen: ContactsScreens,
		},
		Favorites: {
			screen: FavoritesScreen,
		},
		User: {
			screen: UserScreens,
		}
	}, 
	{ 
		initialRouteName: 'Contacts',
		tabBarPosition: 'bottom',
		tabBarOptions: {
			style: {
				backgroundColor: colors.greyLight
			},
			showLabel: false,
			showIcon: true,
			activeTintColor: colors.blue,
			inactiveTintColor: colors.greyDark,
			renderIndicator: () => null,
		}
	},
);