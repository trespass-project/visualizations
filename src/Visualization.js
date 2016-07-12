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
		const elem = ReactDOM.findDOMNode(this);
		setTimeout(() => {
			props.vis.init(elem, props);
			props.vis.update(elem, props.data);
		}, 0);
	}

	shouldComponentUpdate(nextProps, nextState) {
		const props = this.props;
		const elem = ReactDOM.findDOMNode(this);
		props.vis.update(elem, nextProps.data);
		return false;
	}

	render() {
		return this.props.children;
	}
}

Visualization.propTypes = {
	children: React.PropTypes.any,
	vis: React.PropTypes.object.isRequired,
};

Visualization.defaultProps = {
	children: <svg></svg>,
};
