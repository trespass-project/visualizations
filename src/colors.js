const R = require('ramda');
const chroma = require('chroma-js');
import { rgb, lab } from 'd3-color';
import { scaleLinear } from 'd3-scale';
import { interpolateLab } from 'd3-interpolate';


const createColorScale =
module.exports.createColorScale =
function createColorScale(colors, ts, interpolationMethod=interpolateLab, domain) {
	const domainScale = scaleLinear()
		.domain([R.head(ts), R.last(ts)])
		.range(domain);
	const scaledDomain = ts.map(domainScale);
	return scaleLinear()
		.domain(scaledDomain)
		.range(colors)
		.interpolate(interpolationMethod);
};


const photoshopHSBtoRGB =
module.exports.photoshopHSBtoRGB =
function photoshopHSBtoRGB(h, s, b) {
	return chroma
		.hsv(h, s / 100, b / 100)
		.rgb();
};


const _colorScales = {
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

const colorScales =
module.exports.colorScales = R.toPairs(_colorScales)
	.reduce((acc, s) => {
		const name = s[0];
		const data = s[1];
		acc[name] = R.partial(createColorScale, [data.values, data.ts, interpolateLab]);
		return acc;
	}, _colorScales);
