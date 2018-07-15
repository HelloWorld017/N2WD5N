import alive from "../decorators/alive";
import chain from "../decorators/chain";

import BoundBox from "../geometry/BoundBox";
import Vector2 from "../geometry/Vector2";

class Entity extends BoundBox {
	constructor(game, boundBox) {
		super(boundBox.min, boundBox.max);

		this.game = game;
		this.rot = 0;
		this.motion = new Vector2(0, 0);
		this.entityId = null;
		this.entityInnerTick = 0;

		this.friction = 0.3;
		this.rotDifference = 0;
		this.isDead = false;
	}

	@alive
	@chain
	teleport(x, y, rotation=undefined) {
		this.x = x;
		this.y = y;

		if(rotation !== undefined) {
			this.rotate(rotation);
		}
	}

	@alive
	@chain
	rotate(rotation) {
		this.rot = rotation % (2 * Math.PI);
	}

	@chain
	move(amount) {
		this.teleport(
			this.x + Math.cos(this.rot + this.rotDifference) * amount,
			this.y + Math.sin(this.rot + this.rotDifference) * amount
		);
	}

	@chain
	moveInvert(amount) {
		this.teleport(
			this.x + Math.cos(this.rot + this.rotDifference) * amount,
			this.y - Math.sin(this.rot + this.rotDifference) * amount
		);
	}

	@chain
	turn(rotation) {
		this.rotate(this.rot + rotation);
	}

	@alive
	update(events) {
		this.entityInnerTick++;

		this.x += this.motion.x;
		this.y += this.motion.y;

		this.motion.x *= (1 - this.friction);
		this.motion.y *= (1 - this.friction);
	}

	@chain
	spawn() {
		this.game.lifeNote.append(this);
	}

	@chain
	setDead() {
		if(this.entityId === null) return;

		this.game.deathNote.append(this.entityId);
		this.isDead = true;
	}

	get boundModel() {
		return this.polygon;
	}

	@alive
	render(renderer) {}
}

export default Entity;
