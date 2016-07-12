import React from 'react';
import ReactDOM from 'react-dom';
import autobind from 'class-autobind';


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
		props.visualization.init(elem, props);
	}

	updateVisualization() {
		const props = this.props;
		const elem = ReactDOM.findDOMNode(this);
		props.visualization.update(elem, props, props.data);
	}

	render() {
		return this.props.children;
	}
}

Visualization.propTypes = {
	children: React.PropTypes.any,
	visualization: React.PropTypes.object.isRequired,
};

Visualization.defaultProps = {
	children: <svg></svg>,
};
