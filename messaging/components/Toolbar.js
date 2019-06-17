import { 
	StyleSheet, 
	Text,
	TextInput, 
	TouchableOpacity, 
	View,
} from 'react-native';
import PropTypes from 'prop-types'; 
import React from 'react';

const ToolbarButton = ({ title, onPress }) => (
	<TouchableOpacity onPress={onPress}>
		<Text style={styles.button}>{title}</Text>
	</TouchableOpacity>
);

ToolbarButton.propTypes = {
	title: PropTypes.string.isRequired,
	onPress: PropTypes.func.isRequired,
}

export default class Toolbar extends React.Component { 
	static propTypes = {
    	isFocused: PropTypes.bool.isRequired,
    	onChangeFocus: PropTypes.func,
    	onSubmit: PropTypes.func,
    	onPressCamera: PropTypes.func,
    	onPressLocation: PropTypes.func,
	};
	static defaultProps = { 
		onChangeFocus: () => {}, 
		onSubmit: () => {}, 
		onPressCamera: () => {}, 
		onPressLocation: () => {},
	};

	state = {
		text: ''
	}

	// Whenever the parent passes a different value for the isFocused prop, we
	// update the focus state of the TextInput by calling this.input.
	// {focus, blur}()
	componentWillReceiveProps(nextProps) {
		if (nextProps.isFocused !== this.props.isFocused) {
			if (nextProps.isFocused) {
				this.input.focus();
			} else {
				this.input.blur();
			}
		}
	}

	handleFocus = () => {
		const { onChangeFocus } = this.props;
		onChangeFocus(true);
	}

	handleBlur = () => {
		const { onChangeFocus } = this.props;
		onChangeFocus(false);
	}

	setInputRef = (ref) => {
		this.input = ref;
	}

	handleChangeText = (text) => {
		this.setState({ text });
	}

	handleSubmitEditing = () => {
		const { onSubmit } = this.props;
		const { text } = this.state;

		if (!text) return;

		onSubmit(text);
		this.setState({ text: '' });
	}
	render() { 
		const { onPressCamera, onPressLocation } = this.props;
		const { text } = this.state;
		// blurOnSubmit - keyboard isn't dismissed when the user presses the return key.
		//
		// onFocus will be called when the user taps within the input field
		// onBlur will be called when the user taps outside the input field
		// We use handle{Blur, Focus} to notify the parent of changes to the focus state.
		return (
			<View style={styles.toolbar}> 
				<ToolbarButton title={'📷'} onPress={onPressCamera} />
				<ToolbarButton title={'📍'} onPress={onPressLocation} />
				<View style={styles.inputContainer}>
					<TextInput
						style={styles.input}
						underlineColorAndroid={'transparent'}
						placeholder={'Type something!'}
						blurOnSubmit={false}
						value={text}
						onChangeText={this.handleChangeText}
						onSubmitEditing={this.handleSubmitEditing}
						ref={this.setInputRef}
						onFocus={this.handleFocus}
						onBlur={this.handleBlur}
					/>
			</View> 
		</View>
		);
	} 
}

const styles = StyleSheet.create({ 
	toolbar: {
	    flexDirection: 'row',
	    alignItems: 'center',
	    paddingVertical: 10,
	    paddingHorizontal: 10,
	    paddingLeft: 16,
	    backgroundColor: 'white',
	},
	button: {
		top: -2,
		marginRight: 12,
		fontSize: 20,
		color: 'grey',
	},
	inputContainer: {
		flex: 1,
		flexDirection: 'row',
		borderWidth: 1,
		borderColor: 'rgba(0, 0, 0, 0.04)',
		borderRadius: 16,
		paddingVertical: 4,
		paddingHorizontal: 12,
		backgroundColor: 'rgba(0, 0, 0, 0.02)'
	},
	input: {
		flex: 1,
		fontSize: 18,
	}
	
});