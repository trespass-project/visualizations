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
import { path as d3Path } from 'd3-path';
import {
	event as d3Event,
	select as d3Select
} from 'd3-selection';
const $ = require('jquery');
const R = require('ramda');

const paletteGenerator = require('./libs/chroma.palette-gen.js');
import theme from './theme.js';
const utils = require('./utils.js');

const trespass = require('trespass.js');
const { childElemName, getRootNode } = trespass.attacktree;


const xSize = 75;
const ySize = 100;


// TODO: `d3-path` already has this functionality
function line(p1, p2) {
	return [
		'M', `${p1.x}, ${p1.y}`,
		'L', `${p2.x}, ${p2.y}`
	].join(' ');
}


// TODO: `d3-path` already has this functionality
function pathifyBezier(p1, c1, c2, p2) {
	return [
		'M', `${p1.x}, ${p1.y}`,
		'C', `${c1.x}, ${c1.y}`,
		`${c2.x}, ${c2.y}`,
		`${p2.x}, ${p2.y}`
	].join(' ');
}


function diagonalBezier(toPt, fromPt, dir) {
	const distX = (fromPt.x - toPt.x);
	const distY = (fromPt.y - toPt.y);

	if (dir === 'vertical'
		|| (Math.abs(distX) <= Math.abs(distY))) {
		const m = toPt.y + (distY / 2);
		const c1 = { x: toPt.x, y: m };
		const c2 = { x: fromPt.x, y: m };
		return { p1: toPt, c1, c2, p2: fromPt };
	}
	else if (dir === 'horizontal'
		|| (Math.abs(distX) >= Math.abs(distY))) {
		const m = toPt.x + (distX / 2);
		const c1 = { x: m, y: toPt.y };
		const c2 = { x: m, y: fromPt.y };
		return { p1: toPt, c1, c2, p2: fromPt };
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

		edgePath: (x1, y1, x2, y2) => {
			const { p1, c1, c2, p2 } = diagonalBezier(
				{ x: x1, y: y1 },
				{ x: x2, y: y2 },
				'horizontal'
			);
			return pathifyBezier(p1, c1, c2, p2);
		},
	},

	radial: {
		projection: (x, y, minMaxX) => {
			return utils.polarProjection(
				utils.defaultMinMaxAngle,
				Object.assign({}, minMaxX, { max: minMaxX.max + xSize }),
				x, y
			);
		},

		edgePath: (nodeX, nodeY, parentX, parentY, minMaxX) => {
			const nodeAngle = utils.angleFromCartesianCoords(nodeX, nodeY);
			const parentAngle = (parentX === 0 && parentY === 0)
				? nodeAngle
				: utils.angleFromCartesianCoords(parentX, parentY);

			const { counterClockwise } = utils.getAngleDifferenceAndClockwiseness(parentAngle, nodeAngle);

			const r1 = utils.getVectorLength(nodeX, nodeY);
			const r2 = utils.getVectorLength(parentX, parentY);
			const betweenRadius = Math.min(r1, r2) + (Math.abs(r1 - r2) / 2);

			const p = d3Path();

			// connection 1
			p.moveTo(nodeX, nodeY);
			// const p1 = utils.polarToCartesian(
			// 	nodeAngle,
			// 	betweenRadius
			// );
			// p.lineTo(p1.x, p1.y);

			// middle segment (only if needed)
			if (nodeAngle !== parentAngle) {
				p.arc(
					0, 0,
					betweenRadius,
					nodeAngle,
					parentAngle/* + (0.05 * angleDiff)*/,
					counterClockwise
				);
			}

			// connection 2
			p.lineTo(parentX, parentY);

			return p.toString();
		},
	},
};


function makeZoomBehavior(rootGroup, rootSelection) {
	const zoomThreshold = 0.6;
	const zoom = d3Zoom()
		.scaleExtent([0.01, 10])
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


function renderConjConnection(d, conjSibLeft, offset=0, layoutName) {
	if (!conjSibLeft) { return null; }

	const x = conjSibLeft._container.x - d.x;
	const y = conjSibLeft._container.y - d.y;
	const l = utils.getVectorLength(x, y);
	const factor = offset / l;
	const offsetVector = {
		x: x * factor,
		y: y * factor,
	};
	const x1 = offsetVector.x;
	const y1 = offsetVector.y;
	const x2 = x - offsetVector.x;
	const y2 = y - offsetVector.y;

	const style = {
		stroke: 'rgba(0, 0, 0, 0.3)',
		strokeWidth: 15,
		fill: 'none'
	};

	if (layoutName === 'radial') {
		const p = d3Path();
		const radius = utils.getVectorLength(d.x, d.y);
		const a1 = utils.angleFromCartesianCoords(d.x, d.y);
		const a2 = utils.angleFromCartesianCoords(
			conjSibLeft._container.x,
			conjSibLeft._container.y
		);
		const offsetAngle = Math.acos(
			((2 * radius * radius) - (offset * offset)) /
			(2 * radius * radius)
		);
		const fromAngle = a1 + offsetAngle;
		const toAngle = a2 - offsetAngle;
		const { counterClockwise } = utils.getAngleDifferenceAndClockwiseness(toAngle, fromAngle);
		p.arc(
			0, 0,
			radius,
			fromAngle,
			toAngle,
			counterClockwise
		);
		return <g transform={`translate(${-d.x}, ${-d.y})`}>
			<path
				style={style}
				d={p.toString()}
			/>
		</g>;
	}

	return <line style={style} x1={x1} y1={y1} x2={x2} y2={y2} />;
}


export default class AttacktreeVisualization extends React.Component {
	constructor(props) {
		super(props);
		autobind(this);

		this.state = {
			hierarchy: null,
			w: 0,
			h: 0,
		};
	}

	componentDidMount() {
		setTimeout(() => {
			const $elem = $(ReactDOM.findDOMNode(this));
			this.setState({
				w: $elem.width(),
				h: $elem.height(),
			});

			this.updateHierarchy(this.props);
			this.initZoom();
		}, 0);
	}

	componentWillReceiveProps(nextProps) {
		this.updateHierarchy(nextProps);
	}

	// don't remove
	componentDidUpdate(prevProps, prevState) {
		this.initZoom();
	}

	updateHierarchy({ attacktree, showSimilarity }) {
		if (!attacktree) {
			return;
		}

		// TODO: this is for testing only
		// limit depth
		// const nodes = trespass.attacktree.getAllNodes(
		// 	trespass.attacktree.getRootNode(attacktree)
		// );
		// nodes.forEach((node) => {
		// 	if (node.depth >= 4) {
		// 		node.node = [];
		// 	}
		// });

		const hierarchy = d3Hierarchy(
			getRootNode(attacktree),
			R.prop(childElemName)
		);

		if (showSimilarity) {
			const nodes = trespass.attacktree.getAllNodes(
				trespass.attacktree.getRootNode(attacktree)
			);
			const getUniqueLabels = R.pipe(
				R.map(R.prop('label')),
				R.map(R.toLower),
				R.uniq
			);
			// const groupLabelsByAction = R.pipe(
			// 	getUniqueLabels,
			// 	(label) => {
			// 		console.log(label);
			// 		return label;
			// 	},
			// 	R.map(trespass.attacktree.parseLabel),
			// 	R.groupBy(
			// 		R.pipe(
			// 			(parsedLabel) => {
			// 				console.log(parsedLabel[0]);
			// 				if (parsedLabel[0].action === 'attacker') {
			// 					if (!parsedLabel[1]) {
			// 						console.log(parsedLabel);
			// 					}
			// 					return parsedLabel[1];
			// 				} else {
			// 					return parsedLabel[0];
			// 				}
			// 			},
			// 			R.prop('action')
			// 		)
			// 	)
			// );
			// const groupedLabels = groupLabelsByAction(nodes);
			const uniqueLabels = R.sortBy(R.identity, getUniqueLabels(nodes));

			const colors = paletteGenerator.generate(
				uniqueLabels.length, // number of colors to generate
				(color) => { // this function filters valid colors...
					const hcl = color.hcl();
					return (hcl[0] >= 0)
						&& (hcl[0] <= 360)
						// ...for a specific range of hues
						// && (hcl[1] >= 0)
						// && (hcl[1] <= 3)
						// && (hcl[2] >= 0)
						// && (hcl[2] <= 1.5)
						;
				},
				false, // using force vector instead of k-means
				50 // steps (quality)
			);

			// sort colors by differentiation
			const sortedColors = paletteGenerator.diffSort(colors);
			const sortedColorsStr = sortedColors
				.map(R.prop('_rgb'))
				.map((rgba) => `rgba(${rgba.join(',')})`);
			const uniqueColorsMap = R.zipObj(
				uniqueLabels,
				sortedColorsStr
			);
			this.setState({
				uniqueColorsMap,
			});
		} else {
			this.setState({
				uniqueColorsMap: null
			});
		}

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

	renderEdge(d, index, layout, minMaxX) {
		const style = Object.assign(
			{},
			{
				fill: 'none',
				stroke: theme.edge.stroke,
				strokeWidth: theme.edge.strokeWidth,
			},
			this.props.overrideEdgeStyle(d, index, layout)
		);

		if (this.state.uniqueColorsMap) {
			style.stroke = this.state.uniqueColorsMap[
				R.toLower(d.data.label)
			];
		}

		return <path
			key={index}
			className='link'
			style={style}
			d={layout.edgePath(d.x, d.y, d.parent.x, d.parent.y, minMaxX)}
		/>;
	}

	renderNode(d, index, layoutName) {
		const attributes = d.data[trespass.attacktree.attrKey];
		const isDefenseNode = (
			attributes
			&& attributes.switchRole
			&& attributes.switchRole === 'yes'
		);

		const fillColor = (isDefenseNode)
			? theme.node.fillDefense
			: theme.node.fill;
		const collapsedColor = (isDefenseNode)
			? theme.node.fillDefenseCollapsed
			: theme.node.fillCollapsed;

		const fill = d.children
			? fillColor
			: d._children
				? collapsedColor
				: 'white';
		const stroke = d.children
			? 'none'
			: fillColor;

		const labelX = (d.children ? -1 : 1) * (theme.node.radius + 5);
		const labelTextAnchor = d.children
			? 'end'
			: 'start';

		const conjunctiveConnection = renderConjConnection(
			d,
			d.data.conjunctiveSiblingLeft,
			(theme.node.radius + 7),
			layoutName
		);

		const style = Object.assign(
			{},
			{
				fill,
				stroke,
				strokeWidth: 3,
			},
			this.props.overrideNodeStyle(d, index, layoutName)
		);

		return <g
			key={/*`${*/index/*}-${d.data.label}`*/}
			className='node'
			transform={`translate(${d.x}, ${d.y})`}
		>
			{conjunctiveConnection}
			<circle
				r={theme.node.radius}
				style={style}
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
			>{d.data.label}</text>
		</g>;
	}

	render() {
		const { props, state } = this;

		const { hierarchy } = state;
		if (!hierarchy) {
			return <svg></svg>;
		}

		const tree = d3Tree()
			.nodeSize([xSize, ySize])
			.separation((a, b) => 1);
		tree(hierarchy);
		const descendants = hierarchy.descendants();

		const layout = layouts[props.layout];

		const minMaxX = descendants
			.reduce((acc, d) => {
				acc.min = Math.min(acc.min, d.x);
				acc.max = Math.max(acc.max, d.x);
				return acc;
			}, { min: 0, max: 0 });

		descendants.forEach((d) => {
			// adjust node position, based on selected layout

			const projected = layout.projection(d.x, d.y, minMaxX);
			d.x = projected.x;
			d.y = projected.y;

			if (R.contains(props.layout, ['regular', 'circular'])) {
				// horizontally center root node
				d.x += state.w / 2;
			}
			if (R.contains(props.layout, ['ltr', 'circular'])) {
				// vertically center root node
				d.y += state.h / 2;
			}

			// store original position
			d.x0 = d.x;
			d.y0 = d.y;

			// store reference to container object
			d.data._container = d;
		});

		return <svg>
			<g
				className='root'
				transform={`translate(${theme.padding}, ${theme.padding})`}
			>
				<g className='edges'>
					{R.tail(descendants)
						.map((d, index) => this.renderEdge(
							d,
							index,
							layout,
							minMaxX
						))
					}
				</g>
				<g className='nodes'>
					{descendants
						.map((d, index) => this.renderNode(d, index, props.layout))
					}
				</g>
			</g>
		</svg>;
	}
}

AttacktreeVisualization.propTypes = {
	attacktree: React.PropTypes.object/*.isRequired*/,
	layout: React.PropTypes.string/*.isRequired*/,
	overrideEdgeStyle: React.PropTypes.func,
	overrideNodeStyle: React.PropTypes.func,
	showSimilarity: React.PropTypes.bool,
};

AttacktreeVisualization.defaultProps = {
	// attacktree: null,
	layout: 'regular',
	overrideEdgeStyle: (d, index, layout) => ({}),
	overrideNodeStyle: (d, index, layoutName) => ({}),
	showSimilarity: false,
};
