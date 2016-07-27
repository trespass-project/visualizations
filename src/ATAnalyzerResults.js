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
		if (event) { event.preventDefault(); }
		this.props.onSelect(item, index);
	}

	renderRow(result, index, maxUtility) {
		const rowStyle = {
			background: (this.props.selectedIndex === index)
				? 'grey'
				: undefined,
			display: 'flex',
			flexDirection: 'row',
			borderTop: 'solid 1px black'
		};
		const utilityCellStyle = {
			flex: 0,
			borderRight: 'solid 1px black',
			paddingRight: '0.2em',
		};
		const barCellStyle = {
			flex: 1,
		};
		const barStyle = {
			background: 'darkgrey',
			width: `${((result.utility / maxUtility) * 100)}%`,
			height: '100%',
		};
		return <div
			key={index}
			style={rowStyle}
			onMouseEnter={R.partial(this.onHover, [result])}
			onClick={R.partial(this.onSelect, [result, index])}
		>
			<div style={utilityCellStyle}>{result.utility}</div>
			<div style={barCellStyle}>
				<div style={barStyle}></div>
			</div>
		</div>;
	}

	render() {
		const props = this.props;
		const { attrKey } = trespass.attacktree;

		const results = props.attacktrees
			.map((attacktree) => {
				const { utility } = attacktree[attrKey];
				return { attacktree, utility, };
			});

		const maxUtility = R.reduce(
			Math.max,
			0,
			results.map(R.prop('utility'))
		);

		const sortedResults = R.sort(
			(a, b) => (b.utility - a.utility),
			results
		);

		return <div className='ataVisualization'>
			<div>
				<div>Utility</div>
				{sortedResults.map((result, index) => this.renderRow(result, index, maxUtility))}
			</div>
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
