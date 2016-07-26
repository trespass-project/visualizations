/**
 * a dashboard to display analysis results from different tools
 *
 * @module visualizations/components/AnalysisResults
 */

import React from 'react';
import autobind from 'class-autobind';

import AttacktreeVisualization from './AttacktreeVisualization.js';
import ATAnalyzerResults from './ATAnalyzerResults.js';
import ATEvaluatorResults from './ATEvaluatorResults.js';


export default class AnalysisResults extends React.Component {
	constructor(props) {
		super(props);
		autobind(this);

		this.state = {
			attacktree: null,
		};
	}

	selectATAResult(result) {
		this.setState({ attacktree: result.attacktree });
	}

	render() {
		const props = this.props;
		const state = this.state;

		return <div className='analysisResults'>
			<div className='tools'>
				<div className='ataContainer'>
					<div>attack tree analyzer</div>
					<ATAnalyzerResults
						attacktrees={props.parsedATAResults}
						onSelect={this.selectATAResult}
					/>
					{/*onHover*/}
				</div>

				<hr />

				<div className='ateContainer'>
					<div>attack tree evaluator</div>
					<ATEvaluatorResults
						data={props.parsedATEResults}
					/>
				</div>
			</div>

			<div className='visualization'>
				<AttacktreeVisualization
					attacktree={state.attacktree}
					layout={undefined}
				/>
			</div>
		</div>;
	}
}

AnalysisResults.propTypes = {
	parsedATAResults: React.PropTypes.array,
	parsedATEResults: React.PropTypes.array,
};

AnalysisResults.defaultProps = {
	parsedATAResults: [],
	parsedATEResults: [],
};
