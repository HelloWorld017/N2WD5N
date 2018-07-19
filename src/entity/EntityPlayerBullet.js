import alive from "../decorators/alive";
import chain from "../decorators/chain";
import testCollision from "../geometry/collision";

import BoundBox from "../geometry/BoundBox";
import Entity from "./Entity";
import Vector2 from "../geometry/Vector2";

const WIDTH = 10;
const HEIGHT = 50;

class EntityPlayerBullet extends Entity {
	constructor(game, x, y, color) {
		super(game, new BoundBox(
			new Vector2(x - WIDTH / 2, y - HEIGHT / 2),
			new Vector2(x + WIDTH / 2, y + HEIGHT / 2)
		));

		this.speed = 30;
		this.color = color;
		this.angleMap = this.getAngleMap();
	}

	getAngleMap() {
		return [
			[
				Math.cos(-this.rot + Math.PI / 2)		* this.width,
				Math.sin(-this.rot + Math.PI / 2)		* this.width
			],
			[
				Math.cos(-this.rot + Math.PI)			* this.height,
				Math.sin(-this.rot + Math.PI)			* this.height
			],
			[
				Math.cos(-this.rot + Math.PI * 3 / 2)	* this.width,
				Math.sin(-this.rot + Math.PI * 3 / 2)	* this.width
			],
			[
				Math.cos(-this.rot)						* this.height,
				Math.sin(-this.rot)						* this.height
			]
		];
	}

	@alive
	@chain
	rotate(rotation) {
		this.rot = (rotation + Math.PI / 2) % (2 * Math.PI);
		this.angleMap = this.getAngleMap();
	}

	update(events) {
		super.update(events);
		this.moveInvert(this.speed);

		this.game.mobs.forEach(target => {
			if(testCollision(target.boundModel, this.boundModel))
				target.hurt(1);
		});

		if(this.x < 0 || this.x > this.game.width || this.y < 0 || this.y > this.game.height)
			this.setDead();
	}

	render(renderer) {
		renderer.polygon(this.boundModel, {color: this.color});
	}

	get boundModel() {
		return this.angleMap.map(v => [v[0] + this.x, v[1] + this.y]);
	}
}

export default EntityPlayerBullet;
