import chain from "../../decorators/chain";
import FadedElement from "../FadedElement";


class Label extends FadedElement {
	constructor(game, x, y, width, height, text, size, color="rgb(20, 20, 20)") {
		super(game, x, y, width, height);

		this.text = txt;
		this.font = 'KoPubDotum';
		this.size = size;
		this.color = color;
	}

	doRender(renderer) {
		renderer.writeText(this.x, this.y, this.text, {font: this.font, color: this.color, size: this.size});
	}

	@chain
	setText(text) {
		this.text = text;
	}

	@chain
	setColor(color) {
		this.color = color;
	}
}

export default Label;
