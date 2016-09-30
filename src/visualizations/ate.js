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

// TODO: theme
// import theme from '../theme.js';
const paddingHorizontal = 50;
const paddingVertical = 25;


// TODO: implement tooltips
const visualization = {};


function styleNode(node) {
	return node
		.attr('r', 5)
		.style('fill', (d) => ((d.profitable) ? 'green' : 'black'))
		.style('stroke', 'none');
}


function styleLine(line) {
	return line
		.style('fill', 'none')
		.style('stroke', 'gray')
		.style('stroke-dasharray', '3, 3');
}


visualization.init = (elem, props) => {
	const rootSelection = d3Select(elem);

	const rootGroup = rootSelection
		.append('g')
			.attr('class', 'root')
			.attr('transform', `translate(${paddingHorizontal}, ${paddingVertical})`);

	const axesGroup = rootGroup
		.append('g')
			.attr('class', 'axes');

	axesGroup
		.append('g')
			.attr('class', 'yAxis')
			.append('text')
				.attr('class', 'yAxisLabel')
				.style('fill', 'black')
				.style('text-anchor', 'end')
				.attr('dy', '-5')
				.text('cost');

	axesGroup
		.append('g')
			.attr('class', 'xAxis')
			.append('text')
				.attr('class', 'xAxisLabel')
				.style('fill', 'black')
				.style('text-anchor', 'end')
				.attr('dy', '28')
				.text('probability');
};


visualization.update = (elem, props, _data) => {
	const data = _data || props.data;
	if (!data) { return; }

	const { results, profit } = data;

	const rootSelection = d3Select(elem);
	const $rootSelection = $(elem);
	const rootGroup = rootSelection.select('g.root');

	const rootWidth = $rootSelection.width();
	const rootHeight = $rootSelection.height();

	const _w = (!props.width)
		? rootWidth
		: props.width;
	const _h = (!props.height)
		? rootHeight
		: props.height;
	// rootSelection
	// 	.style('width', _w)
	// 	.style('height', _h);

	const w = _w - (2 * paddingHorizontal);
	const h = _h - (2 * paddingVertical + 10);

	d3Select('.xAxisLabel')
		.attr('x', w);

	const maxCost = results.reduce(
		(acc, item) => Math.max(acc, item.cost),
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


	// profitability threshold line
	if (profit) {
		rootGroup.select('.profitThreshold').remove();
		rootGroup.append('line')
			.attr('class', 'profitThreshold')
			.attr('x1', xScale(0))
			.attr('y1', yScale(profit))
			.attr('x2', xScale(1))
			.attr('y2', yScale(profit))
			.style('stroke', 'green')
			.style('stroke-width', 1);
	}


	const connectionData = R.zip(
		R.init(results),
		R.tail(results)
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
			.call(styleLine);


	const node = rootGroup.selectAll('.node')
		.data(results);

	node.enter()
		.append('circle')
			.attr('class', 'node')
			.attr('cx', (d) => xScale(d.probability))
			.attr('cy', (d) => yScale(d.cost))
			.on('click', (d, i) => {
				(props.onSelect || (() => {}))(d, i);
			})
			.call(styleNode);
};


export default visualization;
