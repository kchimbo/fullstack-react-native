import React from 'react';
import {
	StyleSheet,
	Text,
	View,
	FlatList,
	ActivityIndicator,
	Linking
} from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';
import ContactListItem from '../components/ContactListItem';
import { fetchContacts } from '../utils/api';
import getURLParams from '../utils/getURLParams';
import store from '../store'
import colors from '../utils/colors'

const keyExtractor = ({ phone }) => phone;

export default class Contacts extends React.Component {
	// We can define the navigations options inside each component.
	static navigationOptions = ({ navigation: { navigate } }) => ({
		title: 'Contacts',
		headerLeft: (
			<MaterialIcons
				name="menu"
				size={24}
				style={{color: colors.black, marginLeft: 10 }}
				onPress={() => navigate('DrawerToggle')}
			/>
		),
	});

	state = {
		contacts: store.getState().contacts,
		loading: store.getState().isFetchingContacts,
		error: store.getState().error,
	};

	handleOpenUrl = (event) => {
		const { navigation: { navigate } } = this.props;
		const { url } = event;
		const params = getURLParams(url);

		if (params.name) {
			console.log(`Received deep linking event with name: ${param.name}`);
			const queriedContact = store.getState().contacts.find(
				contact => 
					contact.name.split(' ')[0].toLowerCase() ===
						params.name.toLowerCase()
				);
			if (queriedContact) {
				navigate('Profile', { id: queriedContact.id } );
			}
		}
	}

	async componentDidMount() {
		try {
			this.unsubscribe = store.onChange(() => 
				this.setState({
					contacts: store.getState().contacts,
					loading: store.getState().isFetchingContacts,
					error: store.getState().error,
				}),
			);

			const contacts = await fetchContacts();

			store.setState({ contacts, isFetchingContacts: false })

			// For instance, when the app is running in the background, we can
			// listen to URL events and provide a callback to handle these 
			// situations.
			Linking.addEventListener('url', this.handleOpenUrl)

			// getInitialURL will fire when a URI asociated with the app is
			// accessed externally. This method allows a user to deep link
			// to a particular part of the application when the app is closed
			// and not running in the background.
			// IN here, we pass the url obtainer to a handleOpenUrl method.
			const url = await Linking.getInitialURL();
			this.handleOpenUrl({ url });

		} catch (e) {
			this.setState({
				loading: false,
				error: true
			});
		}
	}

	componentWillUnmount() {
		Linking.removeEventListener('url', this.handleOpenUrl);
		this.unsubscribe();
	}

	renderContact = ({ item }) => {
		const { navigation: { navigate } } = this.props;
		const { name, avatar, phone } = item;
		return (
			<ContactListItem 
				name={name} 
				avatar={avatar} 
				phone={phone} 
				onPress={() => navigate('Profile', { contact: item })}
			/>
		);
	}

	render() {
		const { loading, contacts, error } = this.state;

		const contactsSorted = contacts.sort((a, b) => 
			a.name.localeCompare(b.name)
		);

		return (
			<View style={styles.container}>
				{loading && <ActivityIndicator size="large" />}
				{error && <Text>Error...</Text>}
				{!loading && 
					!error && (
						<FlatList
							data={contactsSorted}
							keyExtractor={keyExtractor}
							renderItem={this.renderContact}
						/>
					)}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: 'white',
		justifyContent: 'center',
		flex: 1,
	},
});