// const d3 = require('d3');
import { select } from 'd3-selection';


export default {
	init(rootElem) {
		const rootSelection = /*d3.*/select(rootElem)
			.append('g');
		return rootSelection;
	},

	update(rootSelection, data) {
		const circle = rootSelection.selectAll('circle')
			.data(data);

		// update
		circle
			.style('fill', 'blue');

		// exit
		circle
			.exit()
				.remove();

		// enter
		circle
			.enter()
				.append('circle')
					.style('fill', 'green')
					.attr('r', 50)
					.attr('cx', (d) => `${d.x}%`)
					.attr('cy', (d) => `${d.y}%`);
	}
};
