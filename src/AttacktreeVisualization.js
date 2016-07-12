import React from 'react';
import autobind from 'class-autobind';
import { hierarchy as d3Hierarchy } from 'd3-hierarchy';
const R = require('ramda');
const trespass = require('trespass.js');
import Visualization from './Visualization.js';
import attacktreeVis from './visualizations/attacktree.js';


const trespassAttacktree = trespass.attacktree;
const { childElemName, getRootNode } = trespassAttacktree;

export default class AttacktreeVisualization extends React.Component {
	constructor(props) {
		super(props);
		autobind(this);
	}

	render() {
		const props = this.props;
		const { attacktree } = props;
		if (!attacktree) {
			return <svg></svg>;
		}

		const hierarchy = d3Hierarchy(
			getRootNode(attacktree),
			R.prop(childElemName)
		);

		return <Visualization
			visualization={attacktreeVis}
			data={hierarchy}
			layout={props.layout}
		/>;
	}
}

AttacktreeVisualization.propTypes = {
	attacktree: React.PropTypes.object/*.isRequired*/,
	layout: React.PropTypes.string/*.isRequired*/,
};

AttacktreeVisualization.defaultProps = {
	// attacktree: null,
	layout: 'regular',
};
