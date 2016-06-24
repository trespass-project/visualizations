import React from 'react';
import autobind from 'class-autobind';


export default class App extends React.Component {
	constructor(props) {
		super(props);
		autobind(this);
	}

	render() {
		const props = this.props;
		console.log(props);

		return <div>
			param: {props.param}
		</div>;
	}
}

App.propTypes = {
	dispatch: React.PropTypes.func,
};

App.defaultProps = {};
