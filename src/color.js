/**
 * @module visualizations/color
 */

const R = require('ramda');
const chroma = require('chroma-js');
import { rgb, lab } from 'd3-color';
import { scaleLinear } from 'd3-scale';
import { interpolateLab } from 'd3-interpolate';


const createColorScale =
/**
 * creates a new d3 color scale.
 *
 * @param {Array} colors - list of colors to interpolate between
 * @param {Array} ts - list of `t`s [0..1]. can be used to shift colors left / right.
 * @param {Function} interpolationMethod - d3 interpolation method
 * @param {Array} domain - the domain (input range) of the scale
 * @returns {Function} color scale function
 */
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
/**
 * converts photoshop hsb values to rgb
 *
 * @param {Number} h - hue
 * @param {Number} s - saturation
 * @param {Number} b - brightness
 * @returns {Array} rgb values
 */
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
/**
 * color scales by category:
 * - `physical`
 * - `virtual`
 *
 * @type {Object}
 */
module.exports.colorScales = R.toPairs(_colorScales)
	.reduce((acc, s) => {
		const name = s[0];
		const data = s[1];
		acc[name] = R.partial(createColorScale, [data.values, data.ts, interpolateLab]);
		return acc;
	}, _colorScales);
