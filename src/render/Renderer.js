import chain from "../decorators/chain";
import Vector2 from "../geometry/Vector2"

const WHITE = "#fff";
const BLACK = "#000";
const DEFAULT_FONT = "KoPubDotum";


class Renderer {
	constructor(canvas) {
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d');
	}

	@chain
	writeText(x, y, text, {font, color, size}) {
		font = font || DEFAULT_FONT;
		color = color || WHITE;
		size = size || 32;

		this.ctx.font=`${size}px '${font}'`;
		this.ctx.fillStyle = color;
		this.ctx.textAlign = 'center';
		this.ctx.textBaseline = 'middle';
		this.ctx.fillText(text, x, y);
	}

	@chain
	drawImage(image, x, y, degree=0) {
		this.ctx.drawImage(image, x - image.width / 2, y - image.height / 2);
	}

	@chain
	fill(color=BLACK) {
		this.ctx.fillStyle = color;
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
	}

	@chain
	rect(boundBox, {color, fill}) {
		this.polygon(boundBox.polygon, {color, fill});
	}

	@chain
	circle(vector, radius, {color, fill, width}) {
		color = color || WHITE;
		fill = fill === undefined ? true : fill;
		width = width === undefined ? 0 : width;


	}

	@chain
	polygon(posList, {color, fill, width}) {
		color = color || WHITE;
		fill = fill === undefined ? true : fill;
		width = width === undefined ? 0 : width;

		if(posList.length <= 0) return;

		if(posList[0] instanceof Vector2) {
			posList = posList.map(v => v.pos);
		}

		this.ctx.beginPath();
		this.ctx.moveTo(...posList[posList.length - 1]);
		posList.forEach(pos => this.ctx.lineTo(...pos));

		if(fill) {
			this.ctx.fillStyle = color;
			this.ctx.fill();
		}

		if(width > 0) {
			this.ctx.strokeStyle = color;
			this.ctx.stroke();
		}
	}
}
