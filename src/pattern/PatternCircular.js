import BoundBox from "../geometry/BoundBox";
import EntityBullet from "../entity/EntityBullet";
import Vector2 from "../geometry/Vector2";
import Pattern from "./Pattern";
import WarningCircle from "../ui/components/WarningCircle";
import WarningSquare from "../ui/components/WarningSquare";


class BulletManager {
	constructor(bullet) {
		this.target = undefined;
		this.motion = new Vector2(0, 0);
		this.bullet = bullet;
		this.leftTime = 0;
		this.callback = () => {};
		this.callbackCalled = false;
	}

	calculateTarget(target, time, additionalTime) {
		this.leftTime = time + additionalTime;
		this.motion = target.clone().subtract(this.bullet).divide(time);
		this.callbackCalled = false;
	}

	update() {
		if(this.leftTime > 0) {
			this.bullet.add(this.motion);
			this.leftTime--;
		} else {
			this.motion = new Vector2(0, 0);

			if(!this.callbackCalled) {
				this.callback();
				this.callbackCalled = true;
			}
		}
	}
}

class PatternCircular extends Pattern {
	constructor(game, entity) {
		super(game, entity);

		this.bulletCount = 30;
		this.initialBulletTime = 120;
		this.initialRadius = 500;
		this.secondaryBulletTime = 15;
		this.thirdBulletTime = 120;
		this.fourthBulletTime = 10;
		this.finalBulletTime = 12;
		this.overBulletTime = 1;
		this.longOverBulletTime = 5;
		this.restTime = 32;

		this.phase = 'init';
		this.ui = undefined;

		this.bullets = [];
		this.posSave = undefined;
	}

	onPreActivate() {
		super.onPreActivate();
		this.ui = (new WarningCircle(this.game, new Vector2(this.game.width / 2, 0), this.initialRadius)).show();

		this.bullets = [...Array(this.bulletCount)].map(() => new BulletManager(
			(new EntityBullet(this.game, this.game.width / 2, 0, false)).spawn()
		));
	}

	onActivate() {
		super.onActivate();
		this.ui.hide();

		let angle = Math.PI;
		const step = Math.PI / this.bulletCount;
		this.phase = 'initial';

		this.bullets.forEach(bullet => {
			angle += step;
			bullet.calculateTarget(new Vector2(
				this.game.width / 2 + Math.cos(angle) * this.initialRadius,
				-Math.sin(angle) * this.initialRadius
			), this.initialBulletTime, 0);
		});
	}

	doUpdate() {
		super.doUpdate();

		this.bullets.forEach(bullet => {
			bullet.update();
		});

		let tick = this.initialBulletTime;
		if(this.tick <= tick) return;
		if(this.phase === 'initial') {
			this.phase = 'first_attack_warn';
			this.ui = (new WarningCircle(this.game, this.entity, this.entity.width)).show();
			this.posSave = this.entity.clone();
		}

		tick += this.restTime - 25;
		if(this.tick <= tick) return;
		if(this.phase === 'first_attack_warn') {
			this.phase = 'first_attack';
			this.ui.hide();

			this.bullets.forEach(bullet => {
				bullet.calculateTarget(this.posSave.clone().add(new Vector2(
					Math.floor(Math.random() * 101) - 50, Math.floor(Math.random() * 101) - 50
				)), this.secondaryBulletTime, this.overBulletTime);
			});
		}

		tick += this.secondaryBulletTime + this.overBulletTime;
		if(this.tick <= tick) return;
		if(this.phase === 'first_attack') {
			this.phase = 'second_attack_warn';
			this.ui = (new WarningSquare(this.game, new BoundBox(
				new Vector2(0, 0),
				new Vector2(this.game.width, this.game.height)
			))).show();
		}

		tick += this.restTime;
		if(this.tick <= tick) return;
		if(this.phase === 'second_attack_warn') {
			this.bullets.forEach(bullet => {
				bullet.calculateTarget(new Vector2(
					Math.floor(Math.random() * this.game.width),
					Math.floor(Math.random() * this.game.height)
				), this.thirdBulletTime, 0);
			});

			this.phase = 'second_attack';
			this.ui.hide();
		}

		tick += this.thirdBulletTime;
		if(this.tick <= tick) return;
		if(this.phase === 'second_attack') {
			this.phase = 'third_attack_warn';
			this.ui = (new WarningCircle(this.game, this.entity, this.entity.width)).show();
			this.posSave = this.entity.clone();
		}

		tick += this.restTime;
		if(this.tick <= tick) return;
		if(this.phase === 'third_attack_warn') {
			this.phase = 'third_attack';
			this.ui.hide();
			this.bullets.forEach(bullet => {
				bullet.calculateTarget(this.posSave, this.fourthBulletTime, this.longOverBulletTime);
			});
		}

		tick += this.fourthBulletTime;
		if(this.tick <= tick) return;
		if(this.phase === 'third_attack') {
			this.phase = 'fourth_attack_warn';
			this.ui = (new WarningCircle(this.game, this.entity, this.entity.width)).show();
			this.posSave = this.entity.clone();
		}

		tick += this.restTime - 10;
		if(this.tick <= tick) return;
		if(this.phase === 'fourth_attack_warn') {
			this.phase = 'fourth_attack';
			this.ui.hide();
			this.bullets.forEach(bullet => {
				bullet.calculateTarget(this.posSave, this.finalBulletTime, this.longOverBulletTime);
			});
		}
	}

	onDeactivate() {
		super.onDeactivate();
		this.bullets.forEach(bullet => bullet.bullet.setDead());
	}

	get duration() {
		return this.initialBulletTime + this.secondaryBulletTime + this.thirdBulletTime + this.fourthBulletTime +
			this.finalBulletTime + this.overBulletTime + this.longOverBulletTime * 2 + this.restTime * 4 - 35;
	}
}

export default PatternCircular;
