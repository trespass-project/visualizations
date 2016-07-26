/**
 * attack tree analyzer results
 *
 * @module visualizations/components/ATAnalyzerResults
 */

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
		const { attrKey } = trespass.attacktree;

		const attacktrees = props.attacktrees
			.map((attacktree) => {
				const { utility } = attacktree[attrKey];
				return {
					attacktree,
					utility,
				};
			});

		const sorted = R.sort(
			(a, b) => (b.utility - a.utility),
			attacktrees
		);

		return <div className='ataVisualization'>
			<table>
				<thead>
					<tr>
						<td>Utility</td>
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
