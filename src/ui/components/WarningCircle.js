import FadedElement from "../FadedElement";

class WarningCircle extends FadedElement {
	constructor(game, pos, radius) {
		super(game, pos.x, pos.y, radius * 2, radius * 2);
		this.isPre = true;
		this.warningColor = "rgb(255, 204, 128)";
		this.pos = pos.clone();
		this.radius = radius;
	}

	doRender(renderer) {
		super.doRender(renderer);

		renderer.circle(this.pos, this.radius, {color: this.blendColor(this.warningColor)});
	}
}

export default WarningCircle;
