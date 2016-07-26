import React, { Component } from 'react';
import autobind from 'class-autobind';
const _ = require('lodash');


class ColorScale extends Component {
	constructor(props) {
		super(props);
		autobind(this);
	}

	render() {
		const props = this.props;

		const numSteps = Math.trunc(props.numSteps);
		const domain = [0, (numSteps - 1)];
		const scale = props.scale(domain);

		function renderStep(i, index) {
			return <div
				key={index}
				style={{
					display: 'inline-block',
					background: scale(i),
					height: props.height,
					flex: 1,
				}}
			/>;
		}

		return <div
			style={{
				width: props.width,
				height: props.height,
				display: 'flex',
				flexDirection: 'row',
			}}
		>
			{_.range(0, numSteps).map(renderStep)}
		</div>;
	}
}

ColorScale.propTypes = {
	scale: React.PropTypes.func.isRequired,
	numSteps: React.PropTypes.number,
	width: React.PropTypes.number,
	height: React.PropTypes.number,
};

ColorScale.defaultProps = {
	numSteps: 5,
	width: 600,
	height: 50,
};

module.exports = ColorScale;
