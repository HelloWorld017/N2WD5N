import FadedElement from "../FadedElement";

class WarningSquare extends FadedElement {
	constructor(game, boundBox) {
		super(game, boundBox.x, boundBox.y, boundBox.width, boundBox.height);

		this.isPre = true;
		this.warningColor = "rgb(255, 204, 128)";
		this.boundBox = boundBox;
	}

	doRender(renderer) {
		super.doRender(renderer);
		renderer.rect(this.boundBox, {color: this.blendColor(this.warningColor)});
	}
}

export default WarningSquare;
