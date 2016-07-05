import { select } from 'd3-selection';
import {
	tree as d3Tree,
	hierarchy as d3Hierarchy
} from 'd3-hierarchy';
const R = require('ramda');
const $ = require('jquery');
import theme from '../theme.js';


function styleNode(node, theme) {
	return node
		.attr('fill', theme.node.fill)
		.attr('r', theme.node.radius);
}


function styleEdge(link, theme) {
	return link
		.style('fill', 'none')
		.style('stroke', theme.edge.stroke)
		.style('stroke-width', theme.edge.strokeWidth);
}


export default {
	init(rootElem) {
		const rootSelection = select(rootElem);
		rootSelection
			.append('g')
				.attr('class', 'rootGroup')
				.attr('transform', `translate(${theme.padding}, ${theme.padding})`);
		return rootSelection;
	},

	update(rootSelection, attacktree) {
		const rootGroup = rootSelection.select('.rootGroup');
		const $rootSelection = $(rootSelection.node());

		// prepare data
		const h = d3Hierarchy(attacktree.node, (d) => d.node);
		const descendants = h.descendants();
		const tree = d3Tree()
			.size([
				$rootSelection.width() - (2 * theme.padding),
				$rootSelection.height() - (2 * theme.padding),
			]);
		tree(h);

		// edges
		const link = rootGroup.selectAll('.link')
			.data(R.tail(descendants))
			.enter()
				.append('path')
					.attr('class', 'link')
					.attr('d', (d) => {
						return 'M' + [d.x, d.y]
							+ 'C' + [d.x, (d.y + d.parent.y) / 2]
							+ ' ' + [d.parent.x, (d.y + d.parent.y) / 2]
							+ ' ' + [d.parent.x, d.parent.y];
					})
				.call(styleEdge, theme);

		// nodes
		const node = rootGroup.selectAll('.node')
			.data(descendants)
				.enter()
					.append('g')
						.attr('class', (d) => {
							return 'node';
						})
						.attr('transform', (d) => {
							return 'translate(' + d.x + ',' + d.y + ')';
						});

		node.append('circle')
			.call(styleNode, theme);

		node.append('text')
			// .attr('dy', 3)
			// .attr('x', (d) => {
			// 	return d.children ? -8 : 8;
			// })
			.style('text-anchor', (d) => {
				return d.children
					? 'end'
					: 'start';
			})
			.text((d) => {
				return d.data.label;
			});
	}
};
