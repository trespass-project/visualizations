import * as constants from './constants.js';
// import { LOCATION_CHANGE } from 'react-router-redux';


const initialState = {
	counter: 0
};

export default function reducer(state=initialState, action) {
	switch (action.type) {
		// case LOCATION_CHANGE: {
		// 	console.log(action.payload.pathname);
		// 	return state;
		// }

		// case constants.INC_COUNTER: {
		// 	return Object.assign({}, state, {
		// 		counter: state.counter + 1,
		// 	});
		// }

		default: {
			return state;
		}
	}
}
