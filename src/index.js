import React from 'react';

import Visualization from './Visualization.js';
import attacktreeVis from './visualizations/attacktree.js';
import testVis from './visualizations/test.js';


module.exports = {
	Visualization,

	TestVisualization:
		(props) => <Visualization {...props} vis={testVis} />,

	AttackTreeVisualization:
		(props) => <Visualization {...props} vis={attacktreeVis} />,
};
