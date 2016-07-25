import React, { Component } from 'react';
const R = require('ramda');
const _ = require('lodash');
const { createColorScale } = require('./colors.js');
import { interpolateLab } from 'd3-interpolate';


class ColorScale extends Component {
	render() {
		const props = this.props;

		const domain = _.range(0, props.values.length);
		const max = R.last(domain);
		const numSteps = Math.trunc(props.numSteps);
		const step = max / (numSteps - 1);

		const scale = createColorScale(
			props.values,
			props.ts,
			domain,
			props.method
		);

		return (
			<div>
				{_.range(0, numSteps)
					.map((index) => index * step)
					.map((t, index) => {
						return <div
							key={index}
							style={{
								display: 'inline-block',
								background: scale(t),
								width: 600 / numSteps,
								height: 50
							}}
						/>;
					})
				}
			</div>
		);
	}
}

ColorScale.propTypes = {
	method: React.PropTypes.func, // d3 interpolation function
	values: React.PropTypes.array.isRequired, // list of d3-color instances
	ts: React.PropTypes.array,
	numSteps: React.PropTypes.number,
};

ColorScale.defaultProps = {
	numSteps: 5,
	method: interpolateLab, // d3 interpolation function
};

module.exports = ColorScale;
