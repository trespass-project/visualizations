const R = require('ramda');
const d3Scale = require('d3-scale');


const radToDegFactor = 180 / Math.PI;
const radToDeg =
module.exports.radToDeg = R.multiply(radToDegFactor);


const degToRadFactor = Math.PI / 180;
const degToRad =
module.exports.degToRad = R.multiply(degToRadFactor);


const getVectorLength =
module.exports.getVectorLength =
function getVectorLength(x, y) {
	return Math.sqrt(
		Math.pow(x, 2) + Math.pow(y, 2)
	);
};


const angleFromCartesianCoords =
module.exports.angleFromCartesianCoords =
function angleFromCartesianCoords(x, y) {
	return Math.atan2(y, x);
};


const xToPolarAngle =
module.exports.xToPolarAngle =
function xToPolarAngle(minMaxAngle, minMaxX) {
	return d3Scale.scaleLinear()
		.domain([minMaxX.min, minMaxX.max])
		.range([minMaxAngle.min, minMaxAngle.max]);
};


// const cartesianToPolar =
// module.exports.cartesianToPolar =
// function cartesianToPolar(x, y) {
// 	return {
// 		radius: getVectorLength(x, y),
// 		angleRad: angleFromCartesianCoords(x, y),
// 	};
// };


const defaultMinMaxAngle =
module.exports.defaultMinMaxAngle = { min: 0, max: 2 * Math.PI };

const polarProjection =
module.exports.polarProjection =
function polarProjection(minMaxAngle=defaultMinMaxAngle, minMaxX, x, y) {
	const angleRad = xToPolarAngle(minMaxAngle, minMaxX)(x);
	const radius = y;
	return polarToCartesian(angleRad, radius);
};


const polarToCartesian =
module.exports.polarToCartesian =
function polarToCartesian(angleRad, radius) {
	return {
		x: Math.sin(angleRad) * radius,
		y: Math.cos(angleRad) * radius,
	};
};
