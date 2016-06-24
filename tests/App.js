import test from 'ava';
import React from 'react';
import { mount } from 'enzyme';

import App from '../app/scripts/App.js';
import * as constants from '../app/scripts/constants.js';
import reducer from '../app/scripts/reducer.js';

import jsdom from 'jsdom';
const doc = jsdom.jsdom('<!doctype html><html><body></body></html>');
global.document = doc;
global.window = doc.defaultView;


test('should render properly', (t) => {
	const wrapper = mount(
		<App counter={0} />
	);

	const $span = wrapper.find('span');
	t.true($span.text() === 'hi');

	const $button = wrapper.find('button');
	t.true($button.text() === '0 times clicked');

	wrapper.setProps({ counter: 10 });
	t.true($button.text() === '10 times clicked');
});


test('reducer should work as expected', (t) => {
	const state = { counter: 10 };
	const action = {
		type: constants.INC_COUNTER,
	};
	const newState = reducer(state, action);
	t.true(newState.counter === 11);
});
