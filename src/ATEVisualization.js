import React from 'react';
import autobind from 'class-autobind';
const R = require('ramda');
// const trespass = require('trespass.js');

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

	render() {
		const props = this.props;
		const { data } = props;

		// TODO: can we say something about profitability here, too?

		const sorted = sortByProbability(data)
			.reverse();

		return <div>
			{(props.showTable)
				? <div>
					<table>
						<thead>
							<tr>
								<td>Probability</td>
								<td>Cost</td>
							</tr>
						</thead>
						<tbody>
							{sorted
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
					</table>
				</div>
				: null
			}
		</div>;
	}
}

ATEVisualization.propTypes = {
	data: React.PropTypes.array.isRequired,
	showTable: React.PropTypes.bool.isRequired,
	onHover: React.PropTypes.func,
	onSelect: React.PropTypes.func,
};

ATEVisualization.defaultProps = {
	data: [],
	showTable: false,
	onHover: () => {},
	onSelect: () => {},
};
