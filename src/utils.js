const rad2DegFactor = 180 / Math.PI;
const rad2Deg =
module.exports.rad2Deg =
function rad2Deg(a) {
	return a * rad2DegFactor;
};


const deg2RadFactor = Math.PI / 180;
const deg2Rad =
module.exports.deg2Rad =
function deg2Rad(a) {
	return a * deg2RadFactor;
};


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


const cartesianToPolar =
module.exports.cartesianToPolar =
function cartesianToPolar(x, y) {
	return {
		radius: getVectorLength(x, y),
		angleRad: angleFromCartesianCoords(x, y),
	};
};


const polarToCartesian =
module.exports.polarToCartesian =
function polarToCartesian(angleRad, radius) {
	return {
		x: Math.sin(angleRad) * radius,
		y: Math.cos(angleRad) * radius,
	};
};
