import Vector2 from "./Vector2";

function getAxis(polygon) {
	const sides = [];

	polygon.reduce((p1, p2) => {
		const sideVector = p2.clone().subtract(p1);

		sides.push(sideVector);
		sides.push(sideVector.perp());

		return p2;
	}, polygon[polygon.length - 1]);

	return sides;
}

function testCollision(o1, o2) {
	o1 = o1.map(v => new Vector2(...v));
	o2 = o2.map(v => new Vector2(...v));
	const axes = getAxis(o1).concat(getAxis(o2));

	return !axes.some(axis => {
		const o1Points = o1.map(point => axis.dot(point));
		const o2Points = o2.map(point => axis.dot(point));

		return !(
			Math.min(...o1Points) < Math.max(...o2Points) &&
			Math.min(...o2Points) < Math.max(...o1Points)
		);
	});
}

export default testCollision;
