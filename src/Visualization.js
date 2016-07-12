import React from 'react';
import ReactDOM from 'react-dom';
import autobind from 'class-autobind';
const R = require('ramda');

const omitProps = [
	'visualization',
	'children',
];


export default class Visualization extends React.Component {
	constructor(props) {
		super(props);
		autobind(this);
	}

	componentDidMount() {
		setTimeout(() => {
			this.initVisualization();
			this.updateVisualization();
		}, 0);
	}

	componentDidUpdate(prevProps, prevState) {
		this.updateVisualization();
	}

	initVisualization() {
		const props = this.props;
		const elem = ReactDOM.findDOMNode(this);
		props.visualization.init(
			elem,
			R.omit(omitProps, props)
		);
	}

	updateVisualization() {
		const props = this.props;
		const elem = ReactDOM.findDOMNode(this);
		props.visualization.update(
			elem,
			R.omit(omitProps, props),
			props.data
		);
	}

	render() {
		return this.props.children;
	}
}

Visualization.propTypes = {
	children: React.PropTypes.any,
	visualization: React.PropTypes.object.isRequired,
	data: React.PropTypes.any,
};

Visualization.defaultProps = {
	data: null,
	children: <svg></svg>,
};
