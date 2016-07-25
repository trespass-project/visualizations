const chroma = require('chroma-js');
import { rgb, lab } from 'd3-color';
import { scaleLinear } from 'd3-scale';
import { interpolateLab } from 'd3-interpolate';


const createColorScale =
module.exports.createColorScale =
function createColorScale(colors, ts, domain, interpolationMethod=interpolateLab) {
	const domainScale = scaleLinear()
		.range([0, 1])
		.domain(domain);
	const d = ts.map(domainScale);
	return scaleLinear()
		.range(colors)
		.domain(d)
		.interpolate(interpolationMethod);
};


const photoshopHSBtoRGB =
module.exports.photoshopHSBtoRGB =
function photoshopHSBtoRGB(h, s, b) {
	return chroma
		.hsv(h, s / 100, b / 100)
		.rgb();
};


const colorScales =
module.exports.colorScales = {
	physical: {
		values: [
			lab(91, -1, 63),
			lab(63, 54, 36),
			rgb(255, 40, 0),
		],
		ts: [0, 0.6, 1],
	},

	virtual: {
		values: [
			rgb(...photoshopHSBtoRGB(144, 60, 90)),
			rgb(...photoshopHSBtoRGB(195, 82, 72)),
			rgb(...photoshopHSBtoRGB(225, 100, 60)),
		],
		ts: [0, 0.45, 1],
	},
};
