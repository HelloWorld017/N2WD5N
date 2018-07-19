import FadedElement from "../FadedElement";

class Title extends FadedElement {
	constructor(game) {
		super(game, game.width / 2, game.height / 2, game.width, game.height);

		this.image = game.imageLoader.images['Title'];
	}

	doRender(renderer) {
		super.doRender(renderer);

		renderer.drawImage(this.image, this.width / 2, this.height / 2, {opacity: this.fadeTick / 30});
	}
}

export default Title;
