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
		this.updateVisualizationData(this.props);
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (nextProps.attacktree !== this.props.attacktree) {
			this.updateVisualizationData(nextProps);
		}
		return false;
	}

	updateVisualizationData(props) {
		const { attacktree } = props;
		if (!attacktree) {
			return;
		}
		const hierarchy = d3Hierarchy(attacktree.node, (d) => d.node);
		this.setState({ data: hierarchy }, () => {
			this.forceUpdate();
		});
	}

	render() {
		const state = this.state;
		return <Visualization vis={attacktreeVis} data={state.data} />;
	}
}

AttacktreeVisualization.propTypes = {
	attacktree: React.PropTypes.object/*.isRequired*/,
};

// AttacktreeVisualization.defaultProps = {};
