import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import PropTypes from 'prop-types';

export default class SearchInput extends React.Component {
	// Initialize component-specific data. 
	// The constructor fires before our component is mounted and rendered.
	constructor(props) {
		// super() is required in derived classes in order to reference this 
		// within the constructor.
		// props are immutable and are always "owned" by a component's parent 
		// while state can be mutated and is "owned" by the component itself
		super(props);
		this.state = {
			text: ''
		};
	}

	// We need to call _this.handleChangeText.bind(this) 
	_handleChangeText(newLocation) {
		// ...
	}
	// Using property initializer. We need to call this.handleChangeText
	// Property initializer are still in the proposal phase
	handleChangeText = (text) => {
		this.setState({ text });
		// Also: this.setState({ text: text });
	}
	handleSubmitEditing = () => {
		const { onSubmit } = this.props;
		const { text } = this.state;
		if (!text) return;
		onSubmit(text);
		this.setState({ text: '' });
	}
	render() {
		// Do some destructuring
		const { placeholder } = this.props;
		const { text } = this.state;
		return (
			<View style={styles.container}>
				<TextInput
	          		autoCorrect={false}
	          		value={text}
	          		placeholder={placeholder}
		          	placeholderTextColor="white"
		          	underlineColorAndroid="transparent"
		          	style={styles.textInput}
		          	clearButtonMode="always"
		          	onChangeText={this.handleChangeText}
		          	onSubmitEditing={this.handleSubmitEditing}
	        	/>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
	height: 40,
	width: 300,
	marginTop: 20,
	backgroundColor: '#666',
	marginHorizontal: 40,
	paddingHorizontal: 10,
	borderRadius: 5,
	},
	textInput: {
		flex: 1,
		color: 'white',
	},
});

SearchInput.propTypes = {
	onSubmit: PropTypes.func.isRequired,
	placeholder: PropTypes.string
};
SearchInput.defaultProps = {
	placeholder: '',
};