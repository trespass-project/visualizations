import React from 'react';
import autobind from 'class-autobind';
import * as actionCreators from './action-creators.js';
import { Link } from 'react-router';


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
		const props = this.props;

		return <div>
			<span>hi</span>
			<img src='images/test.png' />
			<br />
			<button
				onClick={this.clickHandler}
			>
				{this.props.counter} times clicked
			</button>
			<hr />
			<div>
				<Link to='/test'>open subview</Link>
			</div>
			<div>subbiew:</div>
			{props.children}

			<hr />
			<div>
				<Link to='/query/asdf'>url params</Link>
			</div>
		</div>;
	}
}

App.propTypes = {
	dispatch: React.PropTypes.func,
	counter: React.PropTypes.number.isRequired,
};

App.defaultProps = {};
