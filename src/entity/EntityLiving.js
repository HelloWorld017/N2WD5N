import alive from "../decorators/alive";
import chain from "../decorators/chain";
import Entity from "./Entity";

const createEntityLiving = (SuperClass = Entity) => {
	return class EntityLiving extends SuperClass {
		constructor(game, boundBox) {
			super(game, boundBox);

			this.health = 10;
			this.maxHealth = 10;
			this.maxInvincibleTime = 15;
			this.invincibleTime = 0;
		}

		@alive
		@chain
		setHealth(health) {
			this.health = Math.max(0, Math.min(this.maxHealth, health));

			if(this.health === 0) {
				this.setDead();
			}
		}

		@chain
		setMaxHealth(maxHealth) {
			this.maxHealth = maxHealth;
		}

		@alive
		@chain
		heal(healAmount) {
			healAmount = Math.max(0, healAmount);
			this.setHealth(this.health + healAmount);
		}

		@alive
		@chain
		hurt(hurtAmount) {
			if(this.invincibleTime > 0) {
				return;
			}

			hurtAmount = Math.max(0, hurtAmount);
			this.setHealth(this.health - hurtAmount);
			this.invincibleTime = this.maxInvincibleTime;
		}

		@alive
		update(events) {
			super.update(events);

			if(this.invincibleTime > 0) {
				this.invincibleTime--;
			}
		}
	};
};

export default createEntityLiving;
export const EntityLiving = createEntityLiving();
