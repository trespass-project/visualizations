const trespassRed = 'rgb(255, 40, 0)';


export default {
	padding: 50,

	colors: {
		highlight: trespassRed,
	},

	node: {
		radius: 10,
		fill: trespassRed,
		fillCollapsed: 'rgb(255, 110, 100)',

		fillDefense: 'rgb(92, 230, 147)',
		fillDefenseCollapsed: 'rgb(180, 230, 195)',

		labelFontSize: 12,
		labelRotation: 15,
	},

	edge: {
		strokeWidth: 3,
		stroke: 'black',
	},
};
