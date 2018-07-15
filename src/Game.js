import delay from "./decorators/delay";
import registerAllSkills from "./skill/SkillLoader";

import Keys from "./keyboard/Keys";
import PatternCircular from "./pattern/PatternCircular";
import PatternDrop from "./pattern/PatternDrop";
import PatternFakey from "./pattern/PatternFakey";
import PatternLaser from "./pattern/PatternLaser";
import PatternRain from "./pattern/PatternRain";
import PatternThorn from "./pattern/PatternThorn";
import PatternTriangle from "./pattern/PatternTriangle";
import PatternTurret from "./pattern/PatternTurret";
import Renderer from "./render/Renderer";

class Game {
	constructor() {
		this.tick = 0;
		this.entities = {};
		this.players = [];
		this.mobs = [];
		this.deathNote = [];
		this.lifeNote = [];
		this.lastEntityId = 0;

		this.events = [];
		this.keyMaps = Keys.listKeys().reduce(([prev, curr) => {
			prev[curr] = false;
		}, {});

		this.width = window.innerWidth;
		this.height = window.innerHeight;
		this.background = 'transparent';

		this.passedPatterns = -;
		this.patterns = [];
		this.availPatternsEasy = [
			PatternThorn, PatternRain, PatternFakey
		];

		this.availPatternsNormal = [
			PatternCircular, PatternDrop, PatternLaser
		];

		this.availPatternsHard = [
			PatternTurret, PatternTriangle
		];

		this.preUi = [];
		this.ui = [];

		this.canvas = document.querySelector('canvas');
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;

		this.renderer = new Renderer(canvas);
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

				let keyString = '';

				if(ev.ctrlKey) keyString += 'ctrl-';
				if(ev.alt) keyString += 'alt-'
				if(ev.shiftKey) keyString += 'shift-';
				if(ev.metaKey) keyString += 'cmd-';

				keyString += ev.key.toLowerCase();

				this.events.push({
					type: name.toUpperCase(),
					key: keyString
				});
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
			if(this.entities[death]) {
				delete this.entities[death];

				const mobId = this.mobs.findIndex(v => v.entityId === death);
				if(mobId >= 0) {
					this.mobs.splice(mobId, 1);
				}
			}
		});

		this.lifeNote.forEach(life => {
			life.entityId = this.lastEntityId;
			this.lastEntityId++;
			this.entities[life.entityId] = life;
		});

		this.deathNote = [];
		this.lifeNote = [];
		this.events = [];
	}

	render() {
		this.renderBackground();

		this.preUi.forEach(element => element.render(this.renderer));
		Object.values(this.entities).forEach(entity => entity.render(this.renderer));
		this.ui.forEach(element => element.render(this.renderer));

		this.renderer.update();
	}

	renderBackground() {
		//TODO origami pattern
		this.renderer.fill(`rgb(220, 220, 220)`);
	}

	toggleSkillWindow() {
		if(this.skillUi === undefined) return;
		if(this.skillUi.isHidden) {
			this.skillUi.show();
		} else {
			this.skillUi.hide();
		}
	}

	newPattern(end=true) {
		if(this.players.length < 1) return;

		if(end) {
			this.players.forEach(p => p.score += 100);
			this.passedPatterns++;
		}

		setTimeout(() => {
			if(this.players.length < 1) return;

			let chosenPattern = undefined;

			if(this.passed_patterns < 4) {
				if(Math.floor(Math.random() * 11) >= 4)
					chosenPattern = this.availPatternsEasy[
						Math.floor(Math.random() * this.availPatternsEasy.length)
					];
				else
					chosenPattern = this.availPatternsNormal[
						Math.floor(Math.random() * this.availPatternsNormal.length)
					];

			} else if(this.passedPatterns < 7) {
				if(Math.floor(Math.random() * 11) >= 4)
					chosenPattern = this.availPatternsNormal[
						Math.floor(Math.random() * this.availPatternsNormal.length)
					];
				else
					chosenPattern = this.availPatternsEasy[
						Math.floor(Math.random() * this.availPatternsEasy.length)
					];

			} else {
				if(Math.floor(Math.random() * 11) >= 4)
					chosenPattern = this.availPatternsHard[
						Math.floor(Math.random() * this.availPatternsHard.length)
					];
				else if(Math.floor(Math.random() * 11) >= 8)
					chosenPattern = this.availPatternsEasy[
						Math.floor(Math.random() * this.availPatternsEasy.length)
					];
				else
					chosenPattern = this.availPatternsNormal[
						Math.floor(Math.random() * this.availPatternsNormal.length)
					];
			}

			(new chosenPattern(this, this.players[0])).activate()
		}, 1000);
	}
}

export default Game;
