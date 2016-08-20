/**
 * attack tree evaluator results
 *
 * @module visualizations/components/ATEvaluatorResults
 */

import React from 'react';
import autobind from 'class-autobind';
const R = require('ramda');

import Visualization from './Visualization.js';
import ateVis from './visualizations/ate.js';

const sortByProbability = R.sortBy(R.prop('probability'));


function isProfitable(profit, item) {
	return profit > item.cost;
}


export default class ATEvaluatorResults extends React.Component {
	constructor(props) {
		super(props);
		autobind(this);
	}

	onHover(item, event) {
		event.preventDefault();
		this.props.onHover(item);
	}

	onSelect(item, index, event) {
		if (event) { event.preventDefault(); }
		this.props.onSelect(item, index);
	}

	renderRow(item, index) {
		return <tr
			key={index}
			onMouseEnter={R.partial(this.onHover, [item])}
			onClick={R.partial(this.onSelect, [item, index])}
		>
			<td>{item.probability}</td>
			<td>{item.cost}</td>
		</tr>;
	}

	renderTable(data) {
		return <table>
			<thead>
				<tr>
					<td>Probability</td>
					<td>Cost</td>
				</tr>
			</thead>
			<tbody>
				{data.map(this.renderRow)}
			</tbody>
		</table>;
	}

	render() {
		const props = this.props;
		const sorted = sortByProbability(props.data)
			.map((item) => {
				if (props.profit) {
					return Object.assign(
						{},
						item,
						{ profitable: isProfitable(props.profit, item) }
					);
				}
				return item;
			})
			.reverse();
		const data = {
			results: sorted,
			profit: props.profit,
		};

		return <div className='ATEvaluatorResults'>
			<div
				style={{
					height: props.height || '100%',
					width: props.width || '100%'
				}}
			>
				<Visualization
					visualization={ateVis}
					data={data}
					width={props.width}
					height={props.height}
					onSelect={this.onSelect}
				/>
			</div>
			{(props.showTable)
				? <div>{this.renderTable(sorted)}</div>
				: null
			}
		</div>;
	}
}

ATEvaluatorResults.propTypes = {
	data: React.PropTypes.array,
	profit: React.PropTypes.number,
	height: React.PropTypes.number,
	width: React.PropTypes.number,
	showTable: React.PropTypes.bool,
	onHover: React.PropTypes.func,
	onSelect: React.PropTypes.func,
};

ATEvaluatorResults.defaultProps = {
	data: [],
	height: 400,
	width: 0,
	showTable: false,
	onHover: () => {},
	onSelect: () => {},
};
