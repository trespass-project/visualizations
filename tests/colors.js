import test from 'ava';
const color = require('../').color;
import { rgb } from 'd3-color';
import { /*interpolateLab,*/ interpolateRgb } from 'd3-interpolate';


test('scale should work', (t) => {
	const values = [
		rgb(0, 0, 0),
		rgb(255, 255, 255),
	];
	const ts = [0, 1];
	const scale = color.createColorScale(values, ts, interpolateRgb, [0, 100]);
	t.true(scale(0) === 'rgb(0, 0, 0)');
	t.true(scale(50) === 'rgb(128, 128, 128)');
	t.true(scale(100) === 'rgb(255, 255, 255)');
});
