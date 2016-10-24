/**
 * react visualization components
 *
 * @module visualizations/components
 */

import AnalysisResults from './AnalysisResults.js';
import AttacktreeVisualization from './AttacktreeVisualization.js';
import AttacktreeOptions from './AttacktreeOptions.js';
import ATAnalyzerResults from './ATAnalyzerResults.js';
import ATEvaluatorResults from './ATEvaluatorResults.js';
const ColorScale = require('./ColorScale.js');


module.exports = {
	// visualization components
	/** [AttacktreeVisualization]{@link module:visualizations/components/AttacktreeVisualization} */
	AttacktreeVisualization,

	AttacktreeOptions,

	/** [ATAnalyzerResults]{@link module:visualizations/components/ATAnalyzerResults} */
	ATAnalyzerResults,
	/** [ATEvaluatorResults]{@link module:visualizations/components/ATEvaluatorResults} */
	ATEvaluatorResults,

	// higher level compositions
	/** [AnalysisResults]{@link module:visualizations/components/AnalysisResults} */
	AnalysisResults,

	// for testing
	/** [ColorScale]{@link module:visualizations/components/ColorScale} */
	ColorScale,
};
