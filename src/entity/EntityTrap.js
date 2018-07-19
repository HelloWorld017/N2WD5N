import alive from "../decorators/alive";
import chain from "../decorators/chain";
import Entity from "./Entity";
import testCollision from "../geometry/collision";

const createEntityTrap = (SuperClass = Entity) => {
	return class EntityTrap extends SuperClass {
		@alive
		update(events) {
			super.update(events);

			this.game.players.forEach(player => {
				if(testCollision(this.boundModel, player.boundModel)) this.attack(player);
			});
		}

		@alive
		@chain
		attack(target) {
			this.setDead();
			target.hurt(1);
		}
	};
};

export default createEntityTrap;
export const EntityTrap = createEntityTrap();
