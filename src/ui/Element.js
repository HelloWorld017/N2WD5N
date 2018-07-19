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

	initRenderer(renderer) {}
	doRender(renderer) {}

	@chain
	hide() {
		if(this.isHidden) return;
		this.isHidden = true;

		if(this.isPre) this.game.preUi.remove(this);
		else this.game.ui.remove(this);
	}

	@chain
	show() {
		if(!this.isHidden) return;

		this.isHidden = false;

		if(this.isPre) this.game.preUi.append(this);
		else this.game.ui.append(this);
	}

	updateEvent(ev) {}
}

export default Element;
