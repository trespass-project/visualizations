import React from 'react';
import autobind from 'class-autobind';
const R = require('ramda');

import Visualization from './Visualization.js';
import ateVis from './visualizations/ate.js';

const sortByProbability = R.sortBy(R.prop('probability'));


export default class ATEVisualization extends React.Component {
	constructor(props) {
		super(props);
		autobind(this);
	}

	onHover(item, event) {
		event.preventDefault();
		this.props.onHover(item);
	}

	onSelect(item, event) {
		event.preventDefault();
		this.props.onSelect(item);
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
				{data
					.map((item, index) => {
						return <tr
							key={index}
							onMouseEnter={R.partial(this.onHover, [item])}
							onClick={R.partial(this.onSelect, [item])}
						>
							<td>{item.probability}</td>
							<td>{item.cost}</td>
						</tr>;
					})
				}
			</tbody>
		</table>;
	}

	render() {
		const props = this.props;

		// TODO: can we say something about profitability here, too?

		const sorted = sortByProbability(props.data)
			.reverse();

		return <div>
			<div style={{ height: props.height }}>
				<Visualization
					visualization={ateVis}
					data={sorted}
					width={props.width}
					height={props.height}
				/>
			</div>
			{(props.showTable)
				? <div>{this.renderTable(sorted)}</div>
				: null
			}
		</div>;
	}
}

ATEVisualization.propTypes = {
	data: React.PropTypes.array.isRequired,
	height: React.PropTypes.number,
	width: React.PropTypes.number,
	showTable: React.PropTypes.bool.isRequired,
	onHover: React.PropTypes.func,
	onSelect: React.PropTypes.func,
};

ATEVisualization.defaultProps = {
	data: [],
	height: 400,
	width: 0,
	showTable: false,
	onHover: () => {},
	onSelect: () => {},
};
