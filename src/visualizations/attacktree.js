import { select } from 'd3-selection';
import {
	tree as d3Tree,
	hierarchy as d3Hierarchy
} from 'd3-hierarchy';


function styleNode(node) {
	return node
		.attr('r', 5);
}


function styleLink(link) {
	return link
		.style('fill', 'none')
		.style('stroke', 'black')
		.style('stroke-width', 2);
}


export default {
	init(rootElem) {
		const rootSelection = select(rootElem)
			.append('g');
		return rootSelection;
	},

	update(rootSelection, attacktree) {
		const h = d3Hierarchy(attacktree.node, (d) => d.node);
		const tree = d3Tree()
			.size([600, 300]);
		tree(h);

		const node = rootSelection.selectAll('.node')
			.data(h.descendants())
				.enter()
					.append('g')
						.attr('class', (d) => {
							return 'node';
						})
						.attr('transform', (d) => {
							return 'translate(' + d.x + ',' + d.y + ')';
						});

		const link = rootSelection.selectAll('.link')
			.data(h.descendants().slice(1))
			.enter()
				.append('path')
					.attr('class', 'link')
					.attr('d', (d) => {
						return 'M' + [d.x, d.y]
							+ 'C' + [d.x, (d.y + d.parent.y) / 2]
							+ ' ' + [d.parent.x, (d.y + d.parent.y) / 2]
							+ ' ' + [d.parent.x, d.parent.y];
					})
				.call(styleLink);

		node.append('circle')
			.call(styleNode);

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
