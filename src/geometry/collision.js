function getAxis(polygon) {
	const sides = [];

	polygon.reduce((p1, p2) => {
		const sideVector = p2.subtract(p1);
		angle = Math.atan2(p1.x - p2.x, p1.y - p2.y);
		sides.push(angle);
		sides.push(angle + Math.PI / 2);
	}, polygon[polygon.length - 1]);

	return sides;
}

function testCollision(o1, o2) {
	axes = getAxis(o1).concat(o2);

	return axes.every(axis => {
		const o1Points = o1.map(point => axis.dot(point));
		const o2Points = o2.map(point => axis.dot(point));

		return !(
			Math.min(...o1_points) < Math.max(...o2_points) &&
			Math.min(...o2_points) < Math.max(...o1_points)
		);
	});
}

export default testCollision;
