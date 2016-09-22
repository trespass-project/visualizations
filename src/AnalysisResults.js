/**
 * a dashboard to display analysis results from different tools
 *
 * @module visualizations/components/AnalysisResults
 */

import React from 'react';
import autobind from 'class-autobind';
const trespass = require('trespass.js');
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

	selectATAResult(result, index) {
		this.setState({
			attacktree: result.attacktree,
			selectedTool: 'ata',
			selectedIndex: index,
		});
	}

	selectATEResult(result, index) {
		const props = this.props;

		this.setState({
			selectedTool: 'ate',
			selectedIndex: index,
		});

		if (props.aplAttacktree) {
			const subtree = trespass.attacktree.subtreeFromLeafLabels(
				trespass.attacktree.getRootNode(props.aplAttacktree),
				result.labels
			);
			this.setState({
				attacktree: subtree,
			});
		}
	}

	render() {
		const props = this.props;
		const state = this.state;

		return <div className='AnalysisResults'>
			<div className='visualization'>
				<AttacktreeVisualization
					attacktree={state.attacktree}
					layout={undefined}
				/>
			</div>

			<div className='tools'>
				<div>
					<h2>attack tree analyzer</h2>
					<ATAnalyzerResults
						attacktrees={props.parsedATAResults}
						profit={props.profit}
						onSelect={this.selectATAResult}
						selectedIndex={(state.selectedTool === 'ata')
							? state.selectedIndex
							: undefined
						}
					/>
					{/*onHover*/}
				</div>

				<hr />

				<div>
					<h2>attack tree evaluator</h2>
					<ATEvaluatorResults
						data={props.parsedATEResults}
						profit={props.profit}
						onSelect={this.selectATEResult}
						selectedIndex={(state.selectedTool === 'ate')
							? state.selectedIndex
							: undefined
						}
					/>
				</div>
			</div>
		</div>;
	}
}

AnalysisResults.propTypes = {
	parsedATAResults: React.PropTypes.array,
	parsedATEResults: React.PropTypes.array,
	aplAttacktree: React.PropTypes.object,
	profit: React.PropTypes.number, // attacker gain
};

AnalysisResults.defaultProps = {
	parsedATAResults: [],
	parsedATEResults: [],
};
