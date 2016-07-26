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

	onSelect(item, index, event) {
		event.preventDefault();
		this.props.onSelect(item, index);
	}

	renderRow(result, index) {
		return <tr
			key={index}
			style={{ background: (this.props.selectedIndex === index) ? 'grey' : undefined }}
			onMouseEnter={R.partial(this.onHover, [result])}
			onClick={R.partial(this.onSelect, [result, index])}
		>
			<td>{result.utility}</td>
		</tr>;
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
					{sorted.map(this.renderRow)}
				</tbody>
			</table>
		</div>;
	}
}

ATAnalyzerResults.propTypes = {
	attacktrees: React.PropTypes.array.isRequired,
	onHover: React.PropTypes.func,
	onSelect: React.PropTypes.func,
	selectedIndex: React.PropTypes.number,
};

ATAnalyzerResults.defaultProps = {
	attacktrees: [],
	onHover: () => {},
	onSelect: () => {},
};
