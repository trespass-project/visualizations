import {
	event as d3Event,
	select as d3Select
} from 'd3-selection';
import { zoom as d3Zoom } from 'd3-zoom';
import { transition as d3Transition } from 'd3-transition';
import { easeLinear, easeSinInOut } from 'd3-ease';
import {
	tree as d3Tree,
	hierarchy as d3Hierarchy
} from 'd3-hierarchy';
const R = require('ramda');
const $ = require('jquery');

import theme from '../theme.js';


const transition = d3Transition()
	.duration(1000)
	.ease(easeSinInOut);


const visualization = {};
export default visualization;


visualization.init = function(rootElem) {
	const rootSelection = d3Select(rootElem);
	const $rootSelection = $(rootSelection.node());

	const rootGroup = rootSelection
		.append('g')
			.attr('class', 'rootGroup')
			.attr('transform', `translate(${theme.padding}, ${theme.padding})`);

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
		// prevent double-click zoom
		.on('dblclick.zoom', null);

	return rootSelection;
};


visualization.update = function(rootSelection, data) {
	const $rootSelection = $(rootSelection.node());
	const rootGroup = rootSelection.select('.rootGroup');

	// prepare data
	// create hierarchy
	const h = (!data.data)
		// make hierarchy from original attacktree
		? d3Hierarchy(data, (d) => d.node)
		: data;
	const tree = d3Tree()
		.size([
			$rootSelection.width() - (2 * theme.padding),
			$rootSelection.height() - (2 * theme.padding),
		]);
	tree(h);
	const descendants = h.descendants();


	// edges
	const link = rootGroup.selectAll('.link')
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
			.style('opacity', 0)
			.remove();

	// nodes
	const node = rootGroup.selectAll('.node')
		.data(descendants);

	// node: update
	node.selectAll('circle')
		.call(styleNode, theme);
	node.selectAll('text')
		.call(styleLabel, theme);

	// node: exit
	node.exit()
		.transition(transition)
			.style('opacity', 0)
			.remove();

	// node: enter
	const nodeEnter = node.enter()
		.append('g')
			.attr('class', 'node')
			.attr('transform', (d) => `translate(${d.x}, ${d.y})`);

	// toggle children on click
	const onClick = (d) => {
		// console.log(d);
		/* eslint no-param-reassign: 0 */
		if (d.children) {
			d._children = d.children;
			d.children = null;
		} else {
			d.children = d._children;
			d._children = null;
		}
		this.update(rootSelection, h);
	};
	nodeEnter
		.append('circle')
			.call(styleNode, theme)
			.on('click', onClick);

	nodeEnter
		.append('text')
			.call(styleLabel, theme);
};


function styleNode(node, theme) {
	return node
		.attr('r', theme.node.radius)
		.style('fill', (d) => {
			return d.children
				? theme.node.fill
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


function edgePath(d) {
	return [
		`M${d.x}, ${d.y}`,
		`C${d.x}, ${(d.y + d.parent.y) / 2}`,
		`${d.parent.x}, ${(d.y + d.parent.y) / 2}`,
		`${d.parent.x}, ${d.parent.y}`,
	].join(' ');
}
