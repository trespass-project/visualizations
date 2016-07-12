import React from 'react';
import autobind from 'class-autobind';
import { hierarchy as d3Hierarchy } from 'd3-hierarchy';

import Visualization from './Visualization.js';
import attacktreeVis from './visualizations/attacktree.js';


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
			attacktree.node[0],
			(d) => d.node
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
