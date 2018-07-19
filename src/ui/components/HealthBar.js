import FadedElement from "../FadedElement";


class HealthBar extends FadedElement {
	constructor(game, x, y, player) {
		super(game, x, y, 400, 50);
		this.player = player;
		this.skew = Math.PI / 3;
		this.ratio = 1 / 3;
		this.color = 'rgb(0, 188, 212)';
		this.skewX = 1 / Math.tan(this.skew) * this.height;
		this.realWidth = this.width - this.skewX;
		this.sectorWidth = this.realWidth / (this.player.maxHealth * (1 + this.ratio) - this.ratio);
	}

	doRender(renderer) {
		for(let i = 0; i < this.player.health; i++) {
			const previousWidth = this.sectorWidth * (1 + this.ratio) * i;

			renderer.polygon(
				[
					[this.x + previousWidth + this.skewX, this.y],
					[this.x + previousWidth + this.sectorWidth + this.skewX, this.y],
					[this.x + previousWidth + this.sectorWidth, this.y + this.height],
					[this.x + previousWidth, this.y + this.height]
				],

				{color: this.blendColor(this.color)}
			);
		}
	}
}

export default HealthBar;
