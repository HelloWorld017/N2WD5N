import alive from "../decorators/alive";
import blend from "../render/blend";
import chain from "../decorators/chain";
import Entity from "./Entity";

const createEntityFadable(SuperClass = Entity) {
	return class EntityFadable(SuperClass) {
		constructor(game, boundBox) {
			super(game, boundBox);

			this.isDeadAnimInProgress = false;
			this.fadeTick = 0;
			this.fadeDirection = 1;
			this.onFadeEnd = () => {};
		}

		update(events) {
			super.update(events);

			if(30 > this.fadeTick && this.fadeTick > 0) {
				this.fadeTick += this.fadeDirection;

				if(this.fadeTick === 0 || this.fadeTick === 30) {
					this.fadeDirection = 0;
					this.onFadeEnd();
				}
			}
		}

		@chain
		spawn() {
			this.fade_spawn();
		}

		@chain
		fadeSpawn(animate=true) {
			super.spawn();

			if(animate) {
				this.fadeTick = 29;
				this.fadeDirection = -1;
			}
		}

		@alive
		@chain
		setDead() {
			this.fadeSetDead();
		}

		@alive
		@chain
		fadeSetDead(animate=true) {
			if(this.isDeadAnimInProgress) return;

			this.isDeadAnimInProgress = true;

			if(!animate) {
				super.setDead();
				return;
			}

			this.fadeTick = 1;
			this.fadeDirection = 1;

			this.onFadeEnd = () => super.setDead();
		}

		blendColor(color) {
			return blend(1 - this.fadeTick / 30, color);
		}
	}
}
