import AnalysisResults from './AnalysisResults.js';
import AttacktreeVisualization from './AttacktreeVisualization.js';
import ATAnalyzerResults from './ATAnalyzerResults.js';
import ATEvaluatorResults from './ATEvaluatorResults.js';
const ColorScale = require('./ColorScale.js');
const color = require('./color.js');


module.exports = {
	components: {
		// visualization components
		AttacktreeVisualization,
		ATAnalyzerResults,
		ATEvaluatorResults,

		// higher level compositions
		AnalysisResults,

		// for testing
		ColorScale,
	},

	color,
};
