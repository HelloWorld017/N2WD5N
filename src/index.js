import Game from "./Game";
import Player from "./Player";
import Score from "./ui/components/Score";
import SkillPage from "./ui/components/SkillPage";
import Title from "./ui/components/Title";

(async () => {
	const FPS = 60;

	const game = new Game;
	await game.imageLoader.loadImages();

	const title = Title(game).show();
	let player = undefined;

	setInterval(() => {
		game.update();
		game.render();

		if(game.tick > 60 && !title.isHidden) {
			title.hide();
			player = new Player(game);
			player.spawn();
			game.skillUi = new SkillPage(game);
			(new Score(game, player)).show();
			game.newPattern(end=false);
		}

		if(player !== undefined && player.isDead) {
			//TODO
		}
	}, 1000 / FPS);
})();
