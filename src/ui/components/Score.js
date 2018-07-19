import Label from "./Label";


class Score extends Label {
	constructor(game, player) {
		super(game, 150, 170, 400, 200, "점수: ", 32, "rgb(0, 150, 136)");
		this.player = player;
	}

	doRender(renderer) {
		this.text = `점수: ${this.player.score}`;
		super.doRender(renderer);
	}
}

export default Score;
