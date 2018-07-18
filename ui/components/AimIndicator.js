import chain from "../../decorators/chain";

const SIDE = 50;

class AimIndicator extends Element {
	constructor(game, player) {
		super(game, player.aim, 0, SIDE, SIDE / 2 * Math.sqrt(3));

		const width = Math.round(SIDE / 2);
		const height = Math.round(SIDE / 2 * Math.sqrt(3));

		this.element = document.createElement('div');
		this.element.style.width = '0';
		this.element.style.height = '0';
		this.element.style.borderLeft = `solid ${width}px transparent`;
		this.element.style.borderTop = `solid ${height}px rgb(220, 200, 80)`;
		this.element.style.borderRight = `solid ${width}px transparent`;
		this.element.style.borderBottom = `solid ${height}px transparent`;
		this.element.style.position = 'fixed';
		this.element.style.top = '0';
	}

	doRender() {
		this.x = this.player.aim;

		this.element.style.left = Math.round(this.x - SIDE / 2);
	}

	@chain
	hide() {
		super.hide();
		this.game.uiElement.removeChild(this.element);
	}

	@chain
	show() {
		super.show();
		this.game.uiElement.appendChild(this.element);
	}
};

export default AimIndicator;
