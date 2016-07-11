import React from 'react';
import autobind from 'class-autobind';
const R = require('ramda');
const trespass = require('trespass.js');


export default class ATAVisualization extends React.Component {
	constructor(props) {
		super(props);
		autobind(this);
	}

	render() {
		const props = this.props;
		const { parameterElemName, childElemName, attrKey } = trespass.attacktree;

		const attacktrees = props.attacktrees
			.map((tree) => {
				const { utility } = tree[attrKey];
				const leafNodes = trespass.attacktree.findLeafNodes(tree[childElemName]);

				// total cost is sum of all leaf node costs
				const totalCost = leafNodes
					.reduce((sum, node) => {
						return sum + node[parameterElemName].cost.value;
					}, 0);

				return {
					tree,
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

		return <div id='atanalyzer'>
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
						.map((at, index) => {
							return <tr key={index}>
								<td>{at.utility}</td>
								<td>{at.totalCost}</td>
								<td>{at.profit.toFixed(2)}</td>
								<td>{at.isProfitable ? 'yes' : 'no'}</td>
							</tr>;
						})
					}
				</tbody>
			</table>
		</div>;
	}
}

ATAVisualization.propTypes = {
	attacktrees: React.PropTypes.array.isRequired,
	// TODO: add hover / selection callbacks
};

ATAVisualization.defaultProps = {
	attacktrees: [],
};
