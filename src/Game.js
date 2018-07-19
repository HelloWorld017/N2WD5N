import Keys from "./keyboard/Keys";
import BackgroundRenderer from "./render/BackgroundRenderer";
import ImageLoader from "./render/ImageLoader";
import PatternCircular from "./pattern/PatternCircular";
import Player from "./Player";
import Renderer from "./render/Renderer";
import Score from "./ui/components/Score";
import SkillPage from "./ui/components/SkillPage";
import Title from "./ui/components/Title";

const FPS = 60;

class Game {
	constructor() {
		this.tick = 0;
		this.entities = new Map;
		this.players = [];
		this.mobs = [];
		this.deathNote = [];
		this.lifeNote = [];
		this.lastEntityId = 0;

		this.events = [];
		this.keyMaps = Keys.listKeys().reduce((prev, curr) => {
			prev[curr] = false;
			return prev;
		}, {});

		this.imageLoader = new ImageLoader;

		this.width = window.innerWidth;
		this.height = window.innerHeight;
		this.background = 'transparent';

		this.patterns = [];

		this.preUi = [];
		this.preUiElement = document.querySelector('#pre-ui');

		this.ui = [];
		this.uiElement = document.querySelector('#ui');

		this.canvas = document.querySelector('canvas');
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;

		this.renderer = new Renderer(this.canvas);
		this.bgRenderer = new BackgroundRenderer(this);
	}

	async init() {
		await this.imageLoader.loadImages();

		this.attachListener();
		this.title = (new Title(this)).show();

		setInterval(() => {
			this.update();
			this.render();
		}, 1000 / FPS);
	}

	handleEvent(event) {
		this.ui.forEach(elem => {
			if(elem.uiEvent) elem.updateEvent(event);
		});

		if(event.type === 'KEYDOWN') {
			if(this.keyMaps[event.key] !== undefined) {
				this.keyMaps[event.key] = true;
			}

			if(event.key === Keys.KEY_SKILL_UI_TOGGLE) {
				this.toggleSkillWindow();
			}

			if(event.key === '1') {
				(new PatternCircular(this, this.players[0])).activate();
			}
		} else if (event.type === 'KEYUP') {
			if(this.keyMaps[event.key] !== undefined) {
				this.keyMaps[event.key] = false;
			}
		}
	}

	attachListener() {
		const handleKeyEvent = name => {
			document.addEventListener(name, ev => {
				if(document.activeElement.classList.contains('native-keybinding'))
					return undefined;

				this.events.push({
					type: name.toUpperCase(),
					key: ev.key
				});

				ev.preventDefault();
			});
		};

		handleKeyEvent('keydown');
		handleKeyEvent('keyup');
	}

	update() {
		this.tick++;

		this.events.forEach(event => {
			this.handleEvent(event);
		});

		this.entities.forEach(e => e.update(this.events));
		this.patterns.forEach(pattern => pattern.update());
		this.deathNote.forEach(death => {
			if(this.entities.get(death)) {
				this.entities.delete(death);

				const mobId = this.mobs.findIndex(v => v.entityId === death);
				if(mobId >= 0) {
					this.mobs.splice(mobId, 1);
				}
			}
		});

		this.lifeNote.forEach(life => {
			life.entityId = this.lastEntityId;
			this.lastEntityId++;
			this.entities.set(life.entityId, life);
		});

		this.deathNote = [];
		this.lifeNote = [];
		this.events = [];

		if(this.tick > 60 && !this.title.isHidden) {
			this.title.hide();

			const player = new Player(this);
			player.spawn();

			this.skillUi = new SkillPage(this);
			(new Score(this, player)).show();

			this.bgRenderer.initBackground();
		}
	}

	render() {
		this.renderBackground();

		this.preUi.forEach(element => element.render(this.renderer));
		this.entities.forEach(entity => entity.render(this.renderer));
		this.ui.forEach(element => element.render(this.renderer));
	}

	renderBackground() {
		this.bgRenderer.render();
	}

	toggleSkillWindow() {
		if(this.skillUi === undefined) return;
		if(this.skillUi.isHidden) {
			this.skillUi.show();
		} else {
			this.skillUi.hide();
		}
	}

	finishPattern() {
		if(this.players.length < 1) return;

		this.players.forEach(p => p.score += 100);
	}
}

export default Game;
