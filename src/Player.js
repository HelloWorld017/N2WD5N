import "./geometry/Math";

import alive from "./decorators/alive";
import chain from "./decorators/chain";
import timeline from "./decorators/timeline";

import AimIndicator from "./ui/components/AimIndicator";
import BlinkImage from "./ui/components/BlinkImage";
import BoundBox from "./geometry/BoundBox";
import {EntityLiving} from "./entity/EntityLiving";
import EntityPlayerBullet from "./entity/EntityPlayerBullet";
import HealthBar from "./ui/components/HealthBar";
import Keys from "./keyboard/Keys";
import Vector2 from "./geometry/Vector2";


@timeline()
class Player extends EntityLiving {
	constructor(game) {
		super(game, new BoundBox(
			new Vector2(game.width / 2 - 25, game.height - 50),
			new Vector2(game.width / 2 + 25, game.height)
		));

		this.friction = 0.7;
		this.images = {};

		// Jump
		this.flyMode = true;
		this.airJump = false;
		this.jumpStart = 0;
		this.jumpCount = 0;

		// Damage
		this.health = 5;
		this.maxHealth = 10;
		this.maxHurtAnimateTick = 60;
		this.maxInvincibleTime = 60;

		// Firing
		this.aim = 0;
		this.aimAuto = false;
		this.bulletMultiplier = 1.0;
		this.bulletCount = 1;
		this.bulletColor = "rgb(206, 147, 216)";
		this.fireTick = 10;
		this.lastFireTick = 0;

		// Evasion
		this.evasionPercentage = 0;

		this.hurtAnimateTick = 0;
		this.point = 0;
		this.score = 0;
	}

	spawn() {
		super.spawn();
		this.game.players.push(this);
		(new HealthBar(this.game, 50, 50, this)).show();
		(new AimIndicator(this.game, this)).show();
	}

	setDead() {
		super.setDead();
		this.game.players.remove(this);
	}

	render(renderer) {
		super.render(renderer);

		const hurtAmount = 1 - (
			Math.abs(this.hurtAnimateTick - this.maxHurtAnimateTick / 2) / (this.maxHurtAnimateTick / 2)
		);

		/* renderer.rect(this, {
			color: `rgb(${hurtAmount * 170 + 32}, ${hurtAmount * 90 + 32}, ${hurtAmount * 50 + 32})`
		}); */

		renderer.rect(this, {color: `rgb(220, ${200 - hurtAmount * 100}, 80)`});
	}

	doJump() {
		if(this.airJump && this.isGround) return;

		if(this.jumpCount >= 2) return;

		this.jumpStart = 10;
		this.jumpCount++;
	}

	get isGround() {
		return this.max.y >= this.game.height;
	}

	hurt(hurtAmount) {
		if(!this.invincibleTime > 0) {
			this.motion.y -= 50;
			this.hurtAnimateTick = this.maxHurtAnimateTick;
		}

		super.hurt(hurtAmount);
	}

	@alive
	@chain
	teleport(x, y, rotation = undefined) {
		const deltaX = x - this.x;
		this.aim += deltaX;

		super.teleport(x, y, rotation);
	}

	@chain
	setFlyable(flyable = true) {
		const image = this.game.imageLoader.images[flyable ? 'FlyEnabled' : 'FlyDisabled'];
		const blinkImage = (new BlinkImage(this.game, this.game.width / 2, this.game.height / 2, image)).show();

		this.flyMode = flyable;
		this.registerEvent(150, () => blinkImage.hide());
	}

	update(events) {
		super.update(events);
		this.updateTimeline();

		// Movement
		if(this.game.keyMaps[Keys.KEY_LEFT]) {
			this.rotate(Math.PI);
			this.move(15);
		}

		if(this.game.keyMaps[Keys.KEY_RIGHT]) {
			this.rotate(0);
			this.move(15);
		}

		// Aim Movement
		let bulletAngle = 0;

		if(this.game.keyMaps[Keys.KEY_AIM_LEFT]) {
			this.aim = this.x - (1 / Math.tan(Math.PI / 3)) * this.y;
			bulletAngle = Math.PI / 6;
		} else if(this.game.keyMaps[Keys.KEY_AIM_RIGHT]) {
			this.aim = this.x + (1 / Math.tan(Math.PI / 3)) * this.y;
			bulletAngle = -Math.PI / 6;
		} else {
			this.aim = this.x;
		}

		// Bullet Fire
		if(this.game.tick > this.lastFireTick + this.fireTick && this.game.keyMaps[Keys.KEY_FIRE]) {
			this.lastFireTick = this.game.tick;
			const bullet = (new EntityPlayerBullet(this.game, this.x, this.y, this.bulletColor)).spawn();
			bullet.rotate(bulletAngle);
		}

		if(this.flyMode) {
			if(this.game.keyMaps[Keys.KEY_JUMP]) {
				this.jumpStart = 5;
			}
		} else {
			events.forEach(({type, key}) => {
				if(type === 'KEYDOWN' && key === Keys.KEY_JUMP) this.doJump();
			});
		}

		if(this.jumpStart > 0) {
			this.jumpStart--;
			this.motion.y -= 3.5 * this.jumpStart;
		} else {
			if(this.isGround) {
				this.jumpCount = 0;
			}

			this.motion.y += 10;
		}

		this.x = Math.clamp(
			this.width / 2,
			this.x,
			this.game.width - this.width / 2
		);

		this.y = Math.clamp(
			this.height / 2,
			this.y,
			this.game.height - this.height / 2
		);

		if(this.hurtAnimateTick > 0) {
			this.hurtAnimateTick--;
		}
	}
}

export default Player;
