import Vector2 from "./Vector2";

class BoundBox extends Vector2 {
	constructor(min, max) {
		super((min.x + max.x) / 2, (min.y + max.y) / 2);

		this.min = min;
		this.max = max;
	}

	get x() {
		return (this.min.x + this.max.x) / 2;
	}

	set x(newX) {
		const width = this.width;

		this.min.x = newX - width / 2;
		this.max.x = newX + width / 2;
	}

	get y() {
		return (this.min.y + this.max.y) / 2;
	}

	set y(newY) {
		const height = this.height;

		this.min.y = newY - height / 2;
		this.max.y = newY + height / 2;
	}

	get width() {
		return this.max.x - this.min.x;
	}

	set width(newWidth) {
		const x = this.x;

		this.min.x = x - newWidth / 2;
		this.max.x = x + newWidth / 2;
	}

	get height() {
		return this.max.y - this.min.y;
	}

	set height(newHeight) {
		const y = this.y;

		this.min.y = y - newHeight / 2;
		this.max.y = y + newHeight / 2;
	}

	get rect() {
		return [this.min.x, this.min.y, this.width, this.height];
	}

	get polygon() {
		return [
			[this.min.x, this.min.y], [this.min.x, this.max.y],
			[this.max.x, this.max.y], [this.max.x, this.min.y]
		];
	}

	clone() {
		return new BoundBox(this.min.clone(), this.max.clone());
	}
}

export default BoundBox;
