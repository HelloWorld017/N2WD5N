import blend from "../render/blend";
import chain from "../decorators/chain";

import Element from "./Element";

class FadedElement extends Element {
	constructor(game, x, y, width, height) {
		super(game, x, y, width, height);
		this.maxFadeTick = 30;
		this.fadeTick = 0;
		this.fadePhase = 'pause';
	}

	@chain
	hide() {
		if(this.isHidden) return;

		this.isHidden = true;
		this.fadePhase = 'hide';
		//this.fadeTick = this.maxFadeTick;
	}

	doHide() {
		this.fadePhase = 'pause';

		if(this.isPre) this.game.preUi.splice(this.game.preUi.indexOf(this), 1);
		else this.game.ui.splice(this.game.ui.indexOf(this), 1);
	}

	@chain
	show() {
		if(!this.isHidden) return;

		this.isHidden = false;

		if(this.isPre) this.game.preUi.push(this);
		else this.game.ui.push(this);

		//this.fadeTick = 0;
		this.fadePhase = 'show';
	}

	render(renderer) {
		if(this.tick === 0) this.initRender(renderer);

		this.tick++;

		if(this.fadePhase === 'show') {
			this.fadeTick++;

			if(this.fadeTick >= this.maxFadeTick) {
				this.fadeTick = this.maxFadeTick;
				this.fadePhase = 'pause';
			}
		}

		if(this.fadePhase === 'hide') {
			this.fadeTick--;

			if(this.fadeTick <= 0) {
				this.doHide();
				return;
			}
		}

		this.doRender(renderer);
	}

	blendColor(color) {
		return blend(this.fadeTick / 30, color);
	}
}

export default FadedElement;
