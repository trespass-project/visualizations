import test from 'ava';
// import React from 'react';
// import { mount } from 'enzyme';
// import jsdom from 'jsdom';
// const doc = jsdom.jsdom('<!doctype html><html><body></body></html>');
// global.document = doc;
// global.window = doc.defaultView;
// const $ = require('jquery');

// import Visualization from '../src/Visualization.js';
// const testVis = require('../src/visualizations/test.js').default;


test('', (t) => t.pass());


// test('should render properly', (t) => {
// 	const data = [
// 		{ x: 10, y: 11 },
// 		{ x: 20, y: 21 },
// 		{ x: 30, y: 31 },
// 	];
// 	const $wrapper = mount(
// 		<Visualization data={data} vis={testVis} />
// 	);

// 	// enzyme does not support svg, because jsdom doesn't
// 	// jquery however does:
// 	let $html = $($wrapper.html());
// 	let $circle = $html.find('circle');
// 	t.true($circle.length === 3);

// 	$wrapper.setProps({
// 		data: [...data, { x: 40, y: 41 }]
// 	});
// 	$html = $($wrapper.html());
// 	$circle = $html.find('circle');
// 	t.true($circle.length === 4);
// });
