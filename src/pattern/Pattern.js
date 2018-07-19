import chain from "../decorators/chain";


class Pattern {
	constructor(game, entity) {
		this.game = game;
		this.entity = entity;
		this.tick = 0;
		this.innerTick = 0;
		this.preActivateTick = 60;
		this.activateFlyMode = true;
	}

	update() {
		this.innerTick++;

		if(this.innerTick === this.preActivateTick) this.onActivate();
		if(this.innerTick >= this.preActivateTick) {
			this.doUpdate();
			this.tick++;
		}

		if(this.tick >= this.duration) {
			this.deactivate();
		}
	}

	@chain
	activate() {
		this.tick = 0;
		this.game.patterns.push(this);

		if (this.activateFlyMode && !this.entity.flyMode)
			this.entity.setFlyable(true);

		else if (!this.activateFlyMode && this.entity.flyMode)
			this.entity.setFlyable(false);

		this.onPreActivate();
	}

	@chain
	deactivate() {
		this.onDeactivate();
		this.game.patterns.splice(this.game.patterns.indexOf(this), 1);
		this.game.finishPattern();
	}

	onPreActivate() {}

	onActivate() {}

	onDeactivate() {}

	doUpdate() {}

	get duration() {
		return 0;
	}
}

export default Pattern;
