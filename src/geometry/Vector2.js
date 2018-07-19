import chain from "../decorators/chain";

class Vector2 {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	@chain
	multiply(scala) {
		this.x *= scala;
		this.y *= scala;
	}

	@chain
	divide(scala) {
		this.x /= scala;
		this.y /= scala;
	}

	@chain
	subtract(vector) {
		this.x -= vector.x;
		this.y -= vector.y;
	}

	@chain
	add(vector) {
		this.x += vector.x;
		this.y += vector.y;
	}

	@chain
	setX(x) {
		this.x = x;
	}

	@chain
	setY(y) {
		this.y = y;
	}

	dot(vector) {
		return this.x * vector.x + this.y * vector.y;
	}

	perp() {
		return new Vector2(this.y, -this.x);
	}

	distance(target) {
		return Math.hypot(this.x - target.x, this.y - target.y);
	}

	clone() {
		return new Vector2(this.x, this.y);
	}

	get pos() {
		return [this.x, this.y];
	}
}

export default Vector2;
