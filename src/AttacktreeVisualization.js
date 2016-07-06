import React from 'react';
import autobind from 'class-autobind';
import { hierarchy as d3Hierarchy } from 'd3-hierarchy';

import Visualization from './Visualization.js';
import attacktreeVis from './visualizations/attacktree.js';


export default class AttacktreeVisualization extends React.Component {
	constructor(props) {
		super(props);
		autobind(this);

		this.state = {
			data: null,
		};
	}

	componentWillMount() {
		this.updateVisualizationData();
	}

	componentDidUpdate() {
		this.updateVisualizationData();
	}

	updateVisualizationData() {
		const props = this.props;
		const { attacktree } = props;
		this.setState({
			data: d3Hierarchy(attacktree.node, (d) => d.node),
		});
	}

	render() {
		const state = this.state;
		return <Visualization vis={attacktreeVis} data={state.data} />;
	}
}

AttacktreeVisualization.propTypes = {
	attacktree: React.PropTypes.any.isRequired,
};

// AttacktreeVisualization.defaultProps = {};
