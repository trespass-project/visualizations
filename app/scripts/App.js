import React from 'react';
import autobind from 'class-autobind';
import * as actionCreators from './action-creators.js';
// import { Link } from 'react-router';

import vis from './visualizations/test.js';
import Visualization from './Visualization.js';


export default class App extends React.Component {
	constructor(props) {
		super(props);
		autobind(this);
	}

	clickHandler(event) {
		event.preventDefault();
		this.props.dispatch(
			actionCreators.incrementCounter()
		);
	}

	render() {
		// const props = this.props;
		const data = [
			{ x: 20, y: 54 },
			{ x: 70, y: 10 },
			{ x: 60, y: 60 },
		];

		return <div>
			<Visualization
				vis={vis}
				data={data}
			/>
		</div>;
	}
}

App.propTypes = {
	dispatch: React.PropTypes.func,
	counter: React.PropTypes.number.isRequired,
};

App.defaultProps = {};
