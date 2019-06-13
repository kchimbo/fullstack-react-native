import React from 'react';
import TimerForm from './TimerForm';
import Timer from './Timer';

// Think of functional components as components that only need to implement the
// render() method. They don't manage state and don't need any of React's 
// special lifecycle hooks.
// props are passed in as the first argument to the function

// Benefits:
// 1. Encourages developers to manage state in fewer locations. Make programs
// easier to reason about.
// 2. Great way to create reusable components.
export default function EditableTimer({
	id, title, project, elapsed, isRunning, editFormOpen
}) {
	if (editFormOpen) {
		return <TimerForm id={id} title={title} project={project} />;
	}
	return (
		<Timer 
			id={id} 
			title={title} 
			project={project} 
			elapsed={elapsed}
			isRunning={isRunning} />
		);
}