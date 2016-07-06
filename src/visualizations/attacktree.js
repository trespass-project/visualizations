import {
	event as d3Event,
	select as d3Select
} from 'd3-selection';
import { zoom as d3Zoom } from 'd3-zoom';
import { transition as d3Transition } from 'd3-transition';
import { easeSinInOut } from 'd3-ease';
import { tree as d3Tree } from 'd3-hierarchy';
const R = require('ramda');
const $ = require('jquery');

import theme from '../theme.js';


function projection(x, y) {
	return { x, y };
}


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


function _edgePath(x1, y1, x2, y2) {
	const y12 = (y1 + y2) / 2;
	return [
		`M${x1}, ${y1}`,
		`C${x1}, ${y12}`,
		`${x2}, ${y12}`,
		`${x2}, ${y2}`,
	].join(' ');
}


function edgePath(d) {
	return _edgePath(d.x, d.y, d.parent.x, d.parent.y);
}


const visualization = {};


visualization.init = function(rootElem) {
	const rootSelection = d3Select(rootElem);

	const $rootSelection = $(rootSelection.node());
	// console.log($rootSelection.width());

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
	const zoomThreshold = 0.6;
	const zoom = d3Zoom()
		.scaleExtent([0.1, 10])
		.on('zoom', () => {
			// https://github.com/d3/d3-zoom#zoomTransform
			const scaleFactor = d3Event.transform.k;
			// console.log(scaleFactor);

			if (scaleFactor >= zoomThreshold) {
				$rootSelection.find('.node text')
					.css('visibility', 'visible');
			} else {
				$rootSelection.find('.node text')
					.css('visibility', 'hidden');
			}

			const transformation = [
				`translate(${d3Event.transform.x}, ${d3Event.transform.y})`,
				`scale(${d3Event.transform.k})`,
			].join(' ');
			rootGroup.attr('transform', transformation);
		});
	rootSelection
		.call(zoom)
		.on('dblclick.zoom', null); // prevent double-click zoom
};


visualization.update = function(elem, hierarchy, source=undefined) {
	if (!hierarchy) {
		return;
	}

	const rootSelection = d3Select(elem);
	const $rootSelection = $(rootSelection.node());
	const rootGroup = rootSelection.select('g.root');
	const edgesGroup = rootGroup.select('g.edges');
	const nodesGroup = rootGroup.select('g.nodes');

	const transition = d3Transition()
		.duration(250)
		.ease(easeSinInOut);

	// prepare tree
	const paddingTimesTwo = (2 * theme.padding);
	const tree = d3Tree()
		// .size([
		// 	$rootSelection.width() - paddingTimesTwo,
		// 	$rootSelection.height() - paddingTimesTwo,
		// ])
		.nodeSize([100, 100]);
	tree(hierarchy);
	const descendants = hierarchy.descendants();
	const halfWidth = $rootSelection.width() / 2;
	descendants.forEach((d) => {
		// d.y = 100 * d.depth;
		d.x += halfWidth;
		const pr = projection(d.x, d.y);
		d.x = pr.x;
		d.y = pr.y;
	});

	// edges
	const link = edgesGroup.selectAll('.link')
		.data(R.tail(descendants));

	link
		.enter()
			.append('path')
				.attr('class', 'link')
				.attr('d', edgePath)
				.call(styleEdge, theme);

	// link: exit
	link.exit()
		.transition(transition)
			.attr('d', (d) => {
				const n = source || d;
				return _edgePath(n.x0, n.y0, n.x0, n.y0);
			})
			.style('opacity', 0)
			.remove();

	// nodes
	const node = nodesGroup.selectAll('.node')
		.data(descendants);

	// node: update
	node.selectAll('circle')
		.call(styleNode, theme);
	node.selectAll('text')
		.call(styleLabel, theme);

	// node: exit
	const nodeExit = node.exit();

	nodeExit.transition(transition)
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

	// const collapse = (d) => {
	// 	if (d.children) {
	// 		d._children = d.children;
	// 		d._children.forEach(collapse);
	// 		d.children = null;
	// 	}
	// };

	// toggle children on click
	const onClick = (d) => {
		/* eslint no-param-reassign: 0 */
		if (d.children) {
			d._children = d.children;
			d.children = null;
		} else {
			d.children = d._children;
			d._children = null;
		}
		this.update(elem, hierarchy, d);
	};

	// node: enter
	const nodeEnter = node.enter()
		.append('g')
			.attr('class', 'node')
			.attr('transform', (d) => {
				return `translate(${d.x}, ${d.y})`;
			});

	nodeEnter
		.append('circle')
			.call(styleNode, theme)
			.on('click', onClick);

	nodeEnter
		.append('text')
			.call(styleLabel, theme);

	// stash the old positions for transition
	nodeEnter.each((d) => {
		d.x0 = d.x;
		d.y0 = d.y;
	});
};


export default visualization;
