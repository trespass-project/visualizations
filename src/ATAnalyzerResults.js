import React from 'react';
import autobind from 'class-autobind';
const R = require('ramda');
const trespass = require('trespass.js');


export default class ATAnalyzerResults extends React.Component {
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
		const { parameterElemName, childElemName, attrKey } = trespass.attacktree;

		const attacktrees = props.attacktrees
			.map((attacktree) => {
				const { utility } = attacktree[attrKey];
				const leafNodes = trespass.attacktree.findLeafNodes(attacktree[childElemName]);

				// total cost is sum of all leaf node costs
				const totalCost = leafNodes
					.reduce((sum, node) => {
						return sum + node[parameterElemName].cost.value;
					}, 0);

				return {
					attacktree,
					utility,
					totalCost,
					isProfitable: (totalCost < utility),
					profit: (utility - totalCost)
				};
			});

		const sorted = R.sort(
			(a, b) => {
				if (a.isProfitable && !b.isProfitable) {
					return -1;
				} else if (!a.isProfitable && b.isProfitable) {
					return 1;
				} else {
					return b.profit - a.profit;
				}
			},
			attacktrees
		);

		return <div className='ataVisualization'>
			<table>
				<thead>
					<tr>
						<td>Utility</td>
						<td>Total cost</td>
						<td>Profit</td>
						<td>Profitable?</td>
					</tr>
				</thead>
				<tbody>
					{sorted
						.map((result, index) => {
							return <tr
								key={index}
								onMouseEnter={R.partial(this.onHover, [result])}
								onClick={R.partial(this.onSelect, [result])}
							>
								<td>{result.utility}</td>
								<td>{result.totalCost}</td>
								<td>{result.profit.toFixed(2)}</td>
								<td>{result.isProfitable ? 'yes' : 'no'}</td>
							</tr>;
						})
					}
				</tbody>
			</table>
		</div>;
	}
}

ATAnalyzerResults.propTypes = {
	attacktrees: React.PropTypes.array.isRequired,
	onHover: React.PropTypes.func,
	onSelect: React.PropTypes.func,
};

ATAnalyzerResults.defaultProps = {
	attacktrees: [],
	onHover: () => {},
	onSelect: () => {},
};
