import {
	event as d3Event,
	select as d3Select
} from 'd3-selection';
// import { line as d3Line } from 'd3-shape';
import { zoom as d3Zoom } from 'd3-zoom';
import { transition as d3Transition } from 'd3-transition';
import { easeSinInOut } from 'd3-ease';
import { tree as d3Tree } from 'd3-hierarchy';
const R = require('ramda');
const $ = require('jquery');

import theme from '../theme.js';
const transitionDuration = 200;


function pathifyBezier(p1, c1, c2, p2) {
	return [
		'M', `${p1.x}, ${p1.y}`,
		'C', `${c1.x}, ${c1.y}`,
		`${c2.x}, ${c2.y}`,
		`${p2.x}, ${p2.y}`
	].join(' ');
}

function diagonalBezier(p1, p2) {
	const distX = (p2.x - p1.x);
	const distY = (p2.y - p1.y);
	if (Math.abs(distX) <= Math.abs(distY)) {
		const m = p1.y + (distY / 2);
		const c1 = { x: p1.x, y: m };
		const c2 = { x: p2.x, y: m };
		return { p1, c1, c2, p2 };
	} else {
		const m = p1.x + (distX / 2);
		const c1 = { x: m, y: p1.y };
		const c2 = { x: m, y: p2.y };
		return { p1, c1, c2, p2 };
	}
}

// const line = d3Line()
// 	.x(R.prop('x'))
// 	.y(R.prop('y'));

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
				{ x: x2, y: y2 }
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
				{ x: x2, y: y2 }
			);
			return pathifyBezier(p1, c1, c2, p2);
		},
	},
};


function styleNode(node, theme) {
	return node
		.attr('r', theme.node.radius)
		.style('fill', (d) => {
			return d.children
				? theme.node.fill
				: d._children
					? theme.node.fillCollapsed
					: 'white';
		})
		.style('stroke', (d) => {
			return d.children
				? 'none'
				: theme.node.fill;
		})
		.style('stroke-width', 3);
}


function positionNode(node, layout) {
	node.attr('transform', (d) => {
		return `translate(${d.x}, ${d.y})`;
	});
}


function styleLabel(label, theme) {
	return label
		.text((d) => d.data.label)
		.attr('dy', theme.node.labelFontSize / 2)
		.attr('x', (d) => {
			return (d.children ? -1 : 1) * (theme.node.radius + 5);
		})
		.style('font-size', theme.node.labelFontSize)
		.style('text-anchor', (d) => {
			return d.children
				? 'end'
				: 'start';
		})
		.attr('transform', `rotate(${theme.node.labelRotation})`);
}


function styleEdge(link, theme) {
	return link
		.style('fill', 'none')
		.style('stroke', theme.edge.stroke)
		.style('stroke-width', theme.edge.strokeWidth);
}


function positionEdge(edge, layout) {
	edge.attr('d', (d) => {
		return layout.edgePath(d.x, d.y, d.parent.x, d.parent.y);
	});
}


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


function onClick(d) {
	/* eslint no-param-reassign: 0 */
	if (d.children) {
		d._children = d.children;
		d.children = null;
	} else {
		d.children = d._children;
		d._children = null;
	}
}


const visualization = {};


visualization.init = (elem, props) => {
	const rootSelection = d3Select(elem);

	const rootGroup = rootSelection
		.append('g')
			.attr('class', 'root')
			.attr('transform', `translate(${theme.padding}, ${theme.padding})`);

	// group all edges
	rootGroup
		.append('g')
			.attr('class', 'edges');

	// group all nodes
	rootGroup
		.append('g')
			.attr('class', 'nodes');

	// zoom behavior
	rootSelection
		.call(makeZoomBehavior(rootGroup, rootSelection))
		.on('dblclick.zoom', null); // prevent double-click zoom
};


visualization.update = (elem, props, _data, source=null) => {
	const hierarchy = _data || props.data;
	if (!hierarchy) { return; }

	const rootSelection = d3Select(elem);
	const $rootSelection = $(elem);
	const rootGroup = rootSelection.select('g.root');
	const edgesGroup = rootGroup.select('g.edges');
	const nodesGroup = rootGroup.select('g.nodes');

	const transition = d3Transition()
		.duration(transitionDuration)
		.ease(easeSinInOut);

	// prepare tree
	// const paddingTimesTwo = (2 * theme.padding);
	const tree = d3Tree()
		// .size([
		// 	$rootSelection.width() - paddingTimesTwo,
		// 	$rootSelection.height() - paddingTimesTwo,
		// ])
		.nodeSize([100, 100]);
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
			d.x += $rootSelection.width() / 2;
		}
		if (props.layout === 'ltr') {
			// vertically center root node
			d.y += $rootSelection.height() / 2;
		}

		// store original position
		d.x0 = d.x;
		d.y0 = d.y;
	});

	// ———————————————————————
	// edges
	const link = edgesGroup.selectAll('.link')
		.data(R.tail(descendants));

	// edge: update
	link
		.transition(transition)
			.call(positionEdge, layout);

	// edge: enter
	link.enter()
		.append('path')
			.attr('class', 'link')
			.call(positionEdge, layout)
			.call(styleEdge, theme);

	// edge: exit
	link.exit()
		.transition(transition)
			.attr('d', (d) => {
				const n = source || d;
				return layout.edgePath(n.x0, n.y0, n.x0, n.y0);
			})
			.style('opacity', 0)
			.remove();

	// ———————————————————————
	// nodes
	const node = nodesGroup.selectAll('.node')
		.data(descendants);

	// node: enter
	const nodeEnter = node.enter()
		.append('g')
			.attr('class', 'node')
			.call(positionNode, layout);

	nodeEnter
		.append('circle')
			.on('click', null)
			.on('click', (d) => {
				onClick(d);
				visualization.update(elem, props, hierarchy, d);
			})
			.call(styleNode, theme);

	nodeEnter
		.append('text')
			.call(styleLabel, theme);

	// node: update
	node
		.transition(transition)
			.call(positionNode, layout);

	node.selectAll('circle')
		.on('click', null)
		.on('click', (d) => {
			onClick(d);
			visualization.update(elem, props, hierarchy, d);
		})
		.call(styleNode, theme);

	node.selectAll('text')
		.call(styleLabel, theme);

	// node: exit
	const nodeExit = node.exit();
	nodeExit
		.transition(transition)
			.attr('transform', (d) => {
				const n = source || d;
				return `translate(${n.x0}, ${n.y0})`;
			})
			.style('opacity', 0)
			.remove();

	nodeExit.selectAll('text')
		.transition(100)
			.style('opacity', 0)
			.remove();
};


export default visualization;
