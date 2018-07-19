import BoundBox from "../geometry/BoundBox";
import {EntityTrap} from "./EntityTrap";
import Vector2 from "../geometry/Vector2";


class EntityBullet extends EntityTrap {
	constructor(game, x, y, autoVanish=true) {
		const RADIUS = game.width / 100;

		super(game, new BoundBox(
			new Vector2(x - RADIUS / 2, y - RADIUS / 2),
			new Vector2(x + RADIUS / 2, y + RADIUS / 2)
		));

		this.radius = RADIUS;
		this.color = "rgb(176, 224, 230)";
		this.friction = 0;
		this.boundModelAccuracy = 5;
	}

	update(events) {
		super.update(events);

		if(
			this.autoVanish && (
			!(-this.radius < this.x && this.x < this.game.width + this.radius) ||
			!(-this.radius < this.y && this.y < this.game.height + this.radius))
		) {
			this.setDead();
		}
	}

	render(renderer) {
		renderer.circle(this, this.radius, {color: this.color});
	}

	get boundModel() {
		return [...Array(this.boundModelAccuracy)].map((_, k) => [
			this.x + Math.cos((k - 1 / 2) * Math.PI * 2 / this.boundModelAccuracy) * this.radius,
			this.y + Math.sin((k - 1 / 2) * Math.PI * 2 / this.boundModelAccuracy) * this.radius
		]);
	}
}

export default EntityBullet;
