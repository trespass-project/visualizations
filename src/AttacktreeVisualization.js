/**
 * attack tree visualization
 *
 * @module visualizations/components/AttacktreeVisualization
 */

import React from 'react';
import ReactDOM from 'react-dom';
import autobind from 'class-autobind';
import {
	hierarchy as d3Hierarchy,
	tree as d3Tree
	// cluster as d3Tree
} from 'd3-hierarchy';
import { zoom as d3Zoom } from 'd3-zoom';
import {
	event as d3Event,
	select as d3Select
} from 'd3-selection';
const $ = require('jquery');
const R = require('ramda');
const trespass = require('trespass.js');

import theme from './theme.js';


const trespassAttacktree = trespass.attacktree;
const { childElemName, getRootNode } = trespassAttacktree;


function pathifyBezier(p1, c1, c2, p2) {
	return [
		'M', `${p1.x}, ${p1.y}`,
		'C', `${c1.x}, ${c1.y}`,
		`${c2.x}, ${c2.y}`,
		`${p2.x}, ${p2.y}`
	].join(' ');
}

function diagonalBezier(p1, p2, dir) {
	const distX = (p2.x - p1.x);
	const distY = (p2.y - p1.y);
	if (dir === 'vertical'
		|| (Math.abs(distX) <= Math.abs(distY))) {
		const m = p1.y + (distY / 2);
		const c1 = { x: p1.x, y: m };
		const c2 = { x: p2.x, y: m };
		return { p1, c1, c2, p2 };
	} else if (dir === 'horizontal'
		|| (Math.abs(distX) >= Math.abs(distY))) {
		const m = p1.x + (distX / 2);
		const c1 = { x: m, y: p1.y };
		const c2 = { x: m, y: p2.y };
		return { p1, c1, c2, p2 };
	}
}


// TODO: these could be separate modules
const layouts = {
	regular: {
		projection: (x, y) => {
			return {
				x,
				y,
			};
		},
		edgePath: (x1, y1, x2, y2) => {
			const { p1, c1, c2, p2 } = diagonalBezier(
				{ x: x1, y: y1 },
				{ x: x2, y: y2 },
				'vertical'
			);
			return pathifyBezier(p1, c1, c2, p2);
		},
	},

	ltr: {
		projection: (x, y) => {
			return {
				x: y,
				y: x,
			};
		},
		// edgePath: (x1, y1, x2, y2) => {
		// 	return line([
		// 		{ x: x1, y: y1 },
		// 		{ x: x2, y: y2 },
		// 	]);
		// },
		edgePath: (x1, y1, x2, y2) => {
			const { p1, c1, c2, p2 } = diagonalBezier(
				{ x: x1, y: y1 },
				{ x: x2, y: y2 },
				'horizontal'
			);
			return pathifyBezier(p1, c1, c2, p2);
		},
	},
};


function makeZoomBehavior(rootGroup, rootSelection) {
	const zoomThreshold = 0.6;
	const zoom = d3Zoom()
		.scaleExtent([0.1, 10])
		.on('zoom', () => {
			// https://github.com/d3/d3-zoom#zoomTransform
			const scaleFactor = d3Event.transform.k;

			if (scaleFactor >= zoomThreshold) {
				rootSelection.selectAll('.node text')
					.style('visibility', 'visible');
			} else {
				rootSelection.selectAll('.node text')
					.style('visibility', 'hidden');
			}

			const transformation = [
				`translate(${d3Event.transform.x}, ${d3Event.transform.y})`,
				`scale(${d3Event.transform.k})`,
			].join(' ');
			rootGroup.attr('transform', transformation);
		});
	return zoom;
}


function expandCollapse(d) {
	/* eslint no-param-reassign: 0 */
	if (d.children) {
		d._children = d.children;
		d.children = null;
	} else {
		d.children = d._children;
		d._children = null;
	}
}


export default class AttacktreeVisualization extends React.Component {
	constructor(props) {
		super(props);
		autobind(this);

		this.state = {
			hierarchy: null,
			w: undefined,
			h: undefined,
		};
	}

	componentDidMount() {
		setTimeout(() => {
			const $elem = $(ReactDOM.findDOMNode(this));
			this.setState({
				w: $elem.width(),
				h: $elem.height(),
			});

			this.updateHierarchy(this.props.attacktree);

			this.initZoom();
		}, 0);
	}

	componentWillReceiveProps(nextProps) {
		this.updateHierarchy(nextProps.attacktree);
	}

	componentDidUpdate(prevProps, prevState) {
		this.initZoom();
	}

	updateHierarchy(attacktree) {
		if (!attacktree) {
			return;
		}
		const hierarchy = d3Hierarchy(
			getRootNode(attacktree),
			R.prop(childElemName)
		);
		this.setState({ hierarchy });
	}

	initZoom() {
		const elem = ReactDOM.findDOMNode(this);
		const rootSelection = d3Select(elem);
		const rootGroup = rootSelection.select('g.root');
		rootSelection
			.on('.zoom', null) // just to be sure
			.call(makeZoomBehavior(rootGroup, rootSelection))
			.on('dblclick.zoom', null); // prevent double-click zoom
	}

	renderEdge(d, index, layout) {
		return <path
			key={index}
			className='link'
			d={layout.edgePath(d.x, d.y, d.parent.x, d.parent.y)}
			fill={'none'}
			stroke={theme.edge.stroke}
			strokeWidth={theme.edge.strokeWidth}
		/>;
	}

	renderNode(d, index) {
		const fill = d.children
			? theme.node.fill
			: d._children
				? theme.node.fillCollapsed
				: 'white';
		const stroke = d.children
			? 'none'
			: theme.node.fill;

		const labelX = (d.children ? -1 : 1) * (theme.node.radius + 5);
		const labelTextAnchor = d.children
			? 'end'
			: 'start';

		return <g
			key={index}
			className='node'
			transform={`translate(${d.x}, ${d.y})`}
		>
			<circle
				r={theme.node.radius}
				fill={fill}
				stroke={stroke}
				strokeWidth={3}
				onClick={(event) => {
					event.preventDefault();
					expandCollapse(d);
					this.setState({
						hierarchy: this.state.hierarchy
					});
				}}
			/>
			<text
				dy={theme.node.labelFontSize / 2}
				x={labelX}
				fontSize={theme.node.labelFontSize}
				textAnchor={labelTextAnchor}
				transform={`rotate(${theme.node.labelRotation})`}
			>
				{d.data.label}
			</text>
		</g>;
	}

	render() {
		const props = this.props;
		const state = this.state;

		const { hierarchy } = state;
		if (!hierarchy) {
			return <svg></svg>;
		}

		const tree = d3Tree()
			.nodeSize([75, 100])
			.separation((a, b) => 1);
		tree(hierarchy);
		const descendants = hierarchy.descendants();

		const layout = layouts[props.layout];
		descendants.forEach((d) => {
			// adjust node position, based on selected layout

			const pr = layout.projection(d.x, d.y);
			d.x = pr.x;
			d.y = pr.y;

			if (props.layout === 'regular') {
				// horizontally center root node
				d.x += state.w / 2;
			}
			if (props.layout === 'ltr') {
				// vertically center root node
				d.y += state.h / 2;
			}

			// store original position
			d.x0 = d.x;
			d.y0 = d.y;
		});

		return <svg>
			<g className='root' transform={`translate(${theme.padding}, ${theme.padding})`}>
				<g className='edges'>
					{R.tail(descendants).map((d, index) => this.renderEdge(d, index, layout))}
				</g>
				<g className='nodes'>
					{descendants.map(this.renderNode)}
				</g>
			</g>
		</svg>;
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
