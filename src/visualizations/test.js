// const d3 = require('d3');
import { select } from 'd3-selection';


const vis = {
	init(rootElem) {
		const rootSelection = /*d3.*/select(rootElem)
			.append('g');
		return rootSelection;
	},

	update(rootSelection, data) {
		const circle = rootSelection.selectAll('circle')
			.data(data);

		circle.enter()
			.append('circle')
				.attr('r', 50)
				.attr('cx', (d) => `${d.x}%`)
				.attr('cy', (d) => `${d.y}%`);
	}
};

export default vis;
