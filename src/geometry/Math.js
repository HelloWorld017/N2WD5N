Math.clamp = function clamp(min, val, max) {
	return Math.max(min, Math.min(val, max));
};

Math.rotate = function(polygon, theta, origin) {
	const newPolygon = [];
	polygon.forEach(point => {
		newPolygon.push([
			(point[0] - origin.x) * Math.cos(theta) + (point[1] - origin.y) * Math.sin(theta) + origin.x,
			(point[0] - origin.x) * Math.sin(theta) - (point[1] - origin.y) * Math.cos(theta) + origin.y
		]);
	});

	return newPolygon;
};
