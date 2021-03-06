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


const noop = () => {};


// TODO: theme
// import theme from '../theme.js';
const paddingHorizontal = 50;
const paddingVertical = 25;


// TODO: implement tooltips
const visualization = {};


function styleNode(node) {
	return node
		.style('stroke', 'none')
		.style('cursor', 'pointer');
}


function styleLine(line) {
	return line
		.style('fill', 'none')
		.style('stroke', 'rgba(0, 0, 0, 0.7)')
		.attr('shape-rendering', 'crispEdges')
		// .style('stroke-dasharray', '2, 2')
		.style('pointer-events', 'none');
}


visualization.init = (elem, props) => {
	const rootSelection = d3Select(elem);

	const rootGroup = rootSelection
		.append('g')
			.attr('class', 'root')
			.attr('transform', `translate(${paddingHorizontal}, ${paddingVertical})`);

	const frontierGroup = rootGroup
		.append('g')
			.attr('class', 'frontier');

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
				.style('font-weight', 'bold')
				.text('cost');

	axesGroup
		.append('g')
			.attr('class', 'xAxis')
			.append('text')
				.attr('class', 'xAxisLabel')
				.style('fill', 'black')
				.style('text-anchor', 'end')
				.attr('dy', '28')
				.style('font-weight', 'bold')
				.text('probability');

	const tooltipGroup = rootGroup
		.append('g')
			.attr('class', 'tooltip')
			.style('pointer-events', 'none')
			.style('opacity', 0);
	tooltipGroup
		.append('text')
			.attr('class', 'cost')
			.attr('dy', '3')
			.style('fill', 'rgb(255, 40, 0)')
			.style('font-weight', 'bold')
			.text('');
	tooltipGroup
		.append('text')
			.attr('class', 'probability')
			.attr('dy', '16')
			.style('fill', 'rgb(255, 40, 0)')
			.style('font-weight', 'bold')
			.text('');
};


visualization.update = (elem, props, _data) => {
	const data = _data || props.data;
	if (!data) { return; }

	const { results, profit } = data;

	const rootSelection = d3Select(elem);
	const $rootSelection = $(elem);
	const rootGroup = rootSelection.select('g.root');
	const frontierGroup = rootSelection.select('g.frontier');
	const tooltipGroup = rootSelection.select('g.tooltip');

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
		.ticks(10)
		.tickPadding(7)
		.tickSize(-w);

	const xScale = d3ScaleLinear()
		.domain([0.0, 1.0])
		.range([0, w]);
	const xAxis = d3AxisBottom(xScale)
		.ticks(10)
		.tickPadding(7)
		.tickSize(-h);

	rootGroup.select('.xAxis')
		.attr('transform', `translate(0, ${h})`)
		.call(xAxis);

	rootGroup.select('.yAxis')
		.call(yAxis);

	rootGroup.selectAll('.tick line')
		.style('opacity', '0.15')
		.attr('shape-rendering', 'crispEdges');

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
	const connection = frontierGroup.selectAll('.line')
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
				(props.onSelect || noop)(d, i);
			})
			.on('mouseenter', (d, i) => {
				(props.onHover || noop)(d, i);
			})
			.on('mouseleave', (d, i) => {
				(props.onHoverOut || noop)(d, i);
			})
			.call(styleNode)
			.on('mouseover', (d) => {
				tooltipGroup.select('text.cost')
					.text(`cost: ${d.cost}`);
				tooltipGroup.select('text.probability')
					.text(`prob.: ${d.probability}`);
				tooltipGroup
					.attr('transform', `translate(${xScale(d.probability) + 15}, ${yScale(d.cost)})`)
					.style('opacity', 1);
			})
			.on('mouseout', (d) => {
				tooltipGroup.style('opacity', 0);
			});

	rootGroup.selectAll('.node')
		.attr('r', (d, i) => {
			return (i === props.selectedIndex)
				? 7
				: 5;
		})
		.style('fill', (d, i) => {
			return (i === props.selectedIndex)
				? 'rgb(255, 40, 0)'
				: 'black';
		});
};

export default visualization;
