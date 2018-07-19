import chain from "../../decorators/chain";
import FadedElement from "../FadedElement";

const SIDE = 50;

class AimIndicator extends FadedElement {
	constructor(game, player) {
		super(game, player.aim, 0, SIDE, SIDE / 2 * Math.sqrt(3));
		this.color = 'rgb(220, 200, 80)';
	    this.side = SIDE;
		this.player = player;
	}

	doRender(renderer) {
		super.doRender(renderer);
		this.x = this.player.aim;

		renderer.polygon((
			(this.x - this.width / 2, this.y),
			(this.x + this.width / 2, this.y),
			(this.x, this.y + this.height)
		), {color: this.blendColor(this.color)});
	}
};

export default AimIndicator;
