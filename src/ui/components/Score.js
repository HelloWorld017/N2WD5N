from ui.components.label import Label


class Score extends Label {
	constructor(game, player) {
		super().__init__(game, 50, 120, 400, 200, "점수: ", 32, "rgb(0, 150, 136)");
		self.player = player;
	}

	doRender(renderer) {
		this.text = `점수: ${this.player.score}`;
		super.doRender(renderer);
	}
}

export default Score;
