import {
	select as d3Select
} from 'd3-selection';
import {
	axisBottom as d3AxisBottom,
	axisLeft as d3AxisLeft
} from 'd3-axis';
import {
	scaleLinear as d3ScaleLinear,
} from 'd3-scale';
import {
	line as d3Line,
	curveStepBefore as d3CurveStepBefore
} from 'd3-shape';
const R = require('ramda');
const $ = require('jquery');

import theme from '../theme.js';


// TODO: implement tooltips
const visualization = {};


function styleNode(node, theme) {
	return node
		.attr('r', 5)
		.style('fill', (d) => {
			return 'black';
		})
		.style('stroke', (d) => {
			return 'none';
		});
}


function styleLine(line, theme) {
	line
		.style('fill', 'none')
		.style('stroke', 'gray')
		.style('stroke-dasharray', '4 ,4');
}


visualization.init = function(rootElem, props) {
	const rootSelection = d3Select(rootElem);

	const rootGroup = rootSelection
		.append('g')
			.attr('class', 'root')
			.attr('transform', `translate(${theme.padding}, ${theme.padding})`);

	rootGroup
		.append('g')
			.attr('class', 'yAxis');

	rootGroup
		.append('g')
			.attr('class', 'xAxis');
};


visualization.update = function(elem, data, source=undefined) {
	if (!data) {
		return;
	}

	const rootSelection = d3Select(elem);
	const rootGroup = rootSelection.select('g.root');

	const $rootSelection = $(rootSelection.node());
	const w = $rootSelection.width() - (2 * theme.padding);
	const h = /*props.height*/ 400 - (2 * theme.padding);

	const maxCost = data.reduce(
		(acc, item) => {
			return Math.max(acc, item.cost);
		},
		0
	);

	const yScale = d3ScaleLinear()
		.domain([maxCost, 0.0])
		.range([0, h]);
	const yAxis = d3AxisLeft(yScale)
		.ticks(10);

	const xScale = d3ScaleLinear()
		.domain([0.0, 1.0])
		.range([0, w]);
	const xAxis = d3AxisBottom(xScale)
		.ticks(10);

	rootGroup.select('.xAxis')
		.attr('transform', `translate(0, ${h})`)
		.call(xAxis);

	rootGroup.select('.yAxis')
		.call(yAxis);


	const connectionData = R.zip(
		R.init(data),
		R.tail(data)
	);

	const line = d3Line()
		.curve(d3CurveStepBefore)
		.x((d) => xScale(d.probability))
		.y((d) => yScale(d.cost));
	const connection = rootGroup.selectAll('.line')
		.data(connectionData);

	connection.enter()
		.append('path')
			.attr('d', (d) => line(d))
			.call(styleLine, theme);


	const node = rootGroup.selectAll('.node')
		.data(data);

	// node: enter
	node.enter()
		.append('circle')
			.attr('class', 'node')
			.attr('cx', (d) => xScale(d.probability))
			.attr('cy', (d) => yScale(d.cost))
			.call(styleNode, theme);
};


export default visualization;
