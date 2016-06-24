import React from 'react';
import autobind from 'class-autobind';

export default class SubView extends React.Component {
	constructor(props) {
		super(props);
		autobind(this);
	}

	render() {
		return <div>subview!</div>;
	}
}

SubView.propTypes = {
	dispatch: React.PropTypes.func,
};

SubView.defaultProps = {};
