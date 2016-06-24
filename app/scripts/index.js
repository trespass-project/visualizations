require('../styles/main.css');
require('../styles/main.styl');

const R = require('ramda');
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider, connect } from 'react-redux';
import ReduxThunk from 'redux-thunk';

import { Router, Route, browserHistory } from 'react-router';
import { syncHistoryWithStore, routerReducer } from 'react-router-redux';

import reducer from './reducer.js';
import App from './App.js';
import SubView from './SubView.js';
import ParamView from './ParamView.js';


function configureStore(initialState) {
	const combinedReducers = combineReducers({
		interface: reducer,
		routing: routerReducer,
	});

	const store = createStore(
		combinedReducers,
		initialState,
		applyMiddleware(ReduxThunk)
	);

	return store;
}

const store = configureStore();

// create an enhanced history that syncs navigation events with the store
const history = syncHistoryWithStore(browserHistory, store);

const mapStateToProps = (state) => {
	return Object.assign(
		{},
		{ router: R.omit(['interface'], state) },
		state.interface
	);
};

ReactDOM.render(
	<Provider store={store}>
		<Router history={history}>
			<Route path='/' component={connect(mapStateToProps)(App)}>
				<Route path='test' component={SubView} />
			</Route>
			<Route path='/query/:param' component={connect(mapStateToProps)(ParamView)} />
		</Router>
	</Provider>,
	document.querySelector('#mount')
);
