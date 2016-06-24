import React from 'react';
import ReactDOM from 'react-dom';
import autobind from 'class-autobind';
const d3 = require('d3');
// const R = require('ramda');


const vis = {
	update(rootSelection, data) {
		const circle = rootSelection.selectAll('circle')
			.data(data);

		circle.enter()
			.append('circle')
				.attr('r', 50)
				.attr('cx', (d) => `${d.x}%`)
				.attr('cy', (d) => `${d.y}%`);
	}
};


export default class Visualization extends React.Component {
	constructor(props) {
		super(props);
		autobind(this);
	}

	componentDidMount() {
		this._d3Root = d3.select(ReactDOM.findDOMNode(this))
			.append('g');
		vis.update(this._d3Root, this.props.data);
	}

	shouldComponentUpdate(nextProps, nextState) {
		vis.update(this._d3Root, nextProps.data);
		return false;
	}

	componentDidUpdate() {
		console.warn('this should never be called');
		// vis.update(this._d3Root, this.props.data);
	}

	render() {
		const props = this.props;

		return <svg>
			{/*<g transform='translate(5, 15)'>
							<text>visualization</text>
						</g>*/}
		</svg>;
	}
}

Visualization.propTypes = {
	data: React.PropTypes.array,
	// dispatch: React.PropTypes.func,
};

Visualization.defaultProps = {
	data: [],
};
