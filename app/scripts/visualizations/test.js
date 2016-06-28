const vis = {
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
