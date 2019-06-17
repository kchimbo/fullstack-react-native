import { Keyboard, Platform } from 'react-native';
import PropTypes from 'prop-types';
import React from 'react';

const INITIAL_ANIMATION_DURATION = 250; // milliseconds

export default class KeyboardState extends React.Component {
	static propTypes = {
		layout: PropTypes.shape({
			x: PropTypes.number.isRequired,
			y: PropTypes.number.isRequired,
			width: PropTypes.number.isRequired,
			height: PropTypes.number.isRequired
		}).isRequired,
		children: PropTypes.func.isRequired,
	};

	constructor(props) {
		super(props);
		const { layout: { height } } = props;

		this.state = {
			// The height available for our messaging content
			contentHeight: height,
			// The height of the keyboard. We keep track of this so we set our
			// image picker to the same size as the keyboard
			keyboardHeight: 0,
			// Is the keyboard fully visible or hidden
			keyboardVisible: false,
			// IS the keyboard animating into view currently?
			// -- iOS Only --
			keyboardWillShow: false,
			// Is the keyboard animating out of view currently? 
			// -- iOS Only --
			keyboardWillHide: false,
			// When we animate our UI to avoid the keyboard, we'll want to use
			// the same animation duration as the keyboard.
			keyboardAnimationDuration: INITIAL_ANIMATION_DURATION,
		};
	}

	componentWillMount() {
		if (Platform.OS === 'ios') {
			this.subscriptions = [
				// Keyboard is going to appear
				Keyboard.addListener('keyboardWillShow', this.keyboardWillShow),
				// Keyboard is going to disappear
				Keyboard.addListener('keyboardWillHide', this.keyboardWillHide),
				Keyboard.addListener('keyboardDidShow', this.keyboardDidShow),
				Keyboard.addListener('keyboardDidHide', this.keyboardDidHide)
			]
		} else {
			this.subscriptions = [
				// Keyboard is fully visible
				Keyboard.addListener('keyboardDidShow', this.keyboardDidShow),
				// Keyboard is fully hidden
				Keyboard.addListener('keyboardDidHide', this.keyboardDidHide)
			]
		}
	}

	componentWillUnmount() {
		this.subscriptions.forEach(subscription => subscription.remove());
	}

	measure = (event) => {
		const { layout } = this.props;

		// contentHeight can be determine using screenY (top coordinate of the
		// keyboard) and layout.y (top coordinate of our messaging component)
		const {
			endCoordinates: { height, screenY },
			duration =	 INITIAL_ANIMATION_DURATION
		} = event;

		this.setState({
			contentHeight: screenY - layout.y,
			keyboardHeight: height,
			keyboardAnimationDuration: duration
		})

		// TBD - the height of a hardware keyboard will be 0 .
	}

	keyboardWillShow = (event) => {
		this.setState({ keyboardWillShow: true });
		// We can use the event object to measure the contentHeight and
		// keyboardHeight .
		// `event` will have the following properties
		// duration - duration of the keyboard animation. iOS only
		// easing - easing curve by the keyboard animation. iOS only
		// startCoordinates, endCoordinates - an object containing keys height,
		// 		width, screenX, screenY. These refer to the start and end 
		//		coordinates of the keyboard. 
		//		Normally height, width and screenX will stay the same.
		// 		We can use height to determine the height of the keyboard.
		// 		The screenY value refers to the top of the keyboard, which we 
		//		can use to determine the remaining height available to render 
		//		content
		this.measure(event);
	}

	keyboardDidShow = (event) => {
		this.setState({ 
			keyboardWillShow: false,
			keyboardVisible: true,
		});
		this.measure(event);
	}

	keyboardWillHide = (event) => {
		this.setState({ keyboardWillHide: true });
		this.measure(event);
	}

	keyboardDidHide = () => {
		this.setState({
			keybordWillHide: false,
			keyboardVisible: false
		});
	}

	render() {
		const { children, layout } = this.props;
		const {
			contentHeight,
			keyboardHeight,
			keyboardVisible,
			keyboardWillShow,
			keyboardWillHide,
			keyboardAnimationDuration,
		} = this.state;

		return children({ 
			containerHeight: layout.height,
			contentHeight,
			keyboardHeight,
			keyboardVisible,
			keyboardWillShow,
			keyboardWillHide,
			keyboardAnimationDuration
		});
	}
}