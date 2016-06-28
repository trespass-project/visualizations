import React from 'react';
import ReactDOM from 'react-dom';
import autobind from 'class-autobind';
const d3 = require('d3');


export default class Visualization extends React.Component {
	constructor(props) {
		super(props);
		autobind(this);
	}

	componentDidMount() {
		const props = this.props;
		this._d3Root = d3.select(ReactDOM.findDOMNode(this))
			.append('g');
		props.vis.update(this._d3Root, props.data);
	}

	shouldComponentUpdate(nextProps, nextState) {
		const props = this.props;
		props.vis.update(this._d3Root, nextProps.data);
		return false;
	}

	componentDidUpdate() {
		console.warn('this should never be called');
		// this.props.vis.update(this._d3Root, this.props.data);
	}

	render() {
		// const props = this.props;
		return <svg></svg>;
	}
}

Visualization.propTypes = {
	vis: React.PropTypes.object.isRequired,
	data: React.PropTypes.array,
	// dispatch: React.PropTypes.func,
};

Visualization.defaultProps = {
	data: [],
};
