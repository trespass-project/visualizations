import * as constants from './constants.js';

export function incrementCounter(/*data*/) {
	return (dispatch, getState) => {
		dispatch({
			type: constants.INC_COUNTER,
		});
	};
}
