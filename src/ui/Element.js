import chain from "../decorators/chain";

class Element {
	constructor(game, x, y, width, height) {
		this.isPre = false;
		this.uiEvent = false;
		this.game = game;
		this.x = Math.round(x);
		this.y = Math.round(y);
		this.width = width;
		this.height = height;
		this.isHidden = true;
		this.tick = 0;
	}

	render(renderer) {
		if(this.tick === 0) this.initRender(renderer);

		this.tick++;
		this.doRender(renderer);
	}

	initRender(renderer) {}
	doRender(renderer) {}

	@chain
	hide() {
		if(this.isHidden) return;
		this.isHidden = true;

		if(this.isPre) this.game.preUi.splice(this.game.preUi.indexOf(this), 1);
		else this.game.ui.splice(this.game.ui.indexOf(this), 1);
	}

	@chain
	show() {
		if(!this.isHidden) return;

		this.isHidden = false;

		if(this.isPre) this.game.preUi.push(this);
		else this.game.ui.push(this);
	}

	updateEvent(ev) {}
}

export default Element;
