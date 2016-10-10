/**
 * attack tree analyzer results
 *
 * @module visualizations/components/ATAnalyzerResults
 */

import React from 'react';
import autobind from 'class-autobind';
const classnames = require('classnames');
const R = require('ramda');
const trespass = require('trespass.js');


export default class ATAnalyzerResults extends React.Component {
	constructor(props) {
		super(props);
		autobind(this);
	}

	onHover(item, index, event) {
		// event.preventDefault();
		this.props.onHover(item, index);
	}

	onHoverOut(/*item, index,*/ event) {
		// event.preventDefault();
		this.props.onHoverOut(/*item, index*/);
	}

	onSelect(item, index, event) {
		if (event) { event.preventDefault(); }
		this.props.onSelect(item, index);
	}

	renderRow(result, index, maxUtility) {
		const rowClasses = classnames(
			'row',
			{ selected: (this.props.selectedIndex === index) }
		);
		const barStyle = {
			width: `${((result.utility / maxUtility) * 100)}%`,
		};
		return <div
			key={index}
			className={rowClasses}
			onMouseEnter={R.partial(this.onHover, [result, index])}
			onMouseLeave={R.partial(this.onHoverOut, [/*result, index*/])}
			onClick={R.partial(this.onSelect, [result, index])}
		>
			<div className='utility-cell'>
				{result.utility}
			</div>
			<div className='bar-cell'>
				<div className='bar' style={barStyle} />
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

		return <div className='ATAnalyzerResults'>
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
	onHoverOut: React.PropTypes.func,
	onSelect: React.PropTypes.func,
	selectedIndex: React.PropTypes.number,
};

ATAnalyzerResults.defaultProps = {
	attacktrees: [],
	onHover: () => {},
	onHoverOut: () => {},
	onSelect: () => {},
};
