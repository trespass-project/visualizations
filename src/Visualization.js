import React from 'react';
import ReactDOM from 'react-dom';
import autobind from 'class-autobind';


export default class Visualization extends React.Component {
	constructor(props) {
		super(props);
		autobind(this);
	}

	componentDidMount() {
		const props = this.props;
		this._d3RootSelection = props.vis.init(ReactDOM.findDOMNode(this));
		this.updateD3(props);
	}

	shouldComponentUpdate(nextProps, nextState) {
		this.updateD3(nextProps);
		return false;
	}

	// not needed under normal circumstances,
	// but it enables live-updating with webpack
	componentDidUpdate() {
		const props = this.props;
		this.updateD3(props);
	}

	updateD3(props) {
		setTimeout(() => {
			props.vis.update(this._d3RootSelection, props.data);
		}, 0);
	}

	render() {
		// const props = this.props;
		return <svg></svg>;
	}
}

Visualization.propTypes = {
	vis: React.PropTypes.object.isRequired,
	data: React.PropTypes.any.isRequired,
};

Visualization.defaultProps = {
	// data: [],
};
