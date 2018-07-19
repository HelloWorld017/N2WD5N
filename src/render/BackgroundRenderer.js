import Color from "color";

const SPIN_LEFT = 0;
const SPIN_RIGHT = 1;

const YAW_N = 0;
const YAW_NE = -60 / 180 * Math.PI;
const YAW_NW = 60 / 180 * Math.PI;


const colorRandom = (color, amount = 5) => color.red(
		color.red() + Math.random() * amount * 2 - amount
	).green(
		color.green() + Math.random() * amount * 2 - amount
	).blue(
		color.blue() + Math.random() * amount * 2 - amount
	).string();

const colorRandomUnified = (color, amount = 5) => {
	const rand = Math.random() * amount * 2 - amount;
	return color.red(color.red() + rand)
		.green(color.green() + rand)
		.blue(color.blue() + rand)
		.string();
};

const getXY = (world, fragId) => {
	return {
		x: Math.floor(fragId / world.yCount),
		y: fragId % world.yCount
	};
};

const drawTriangle = (ctx, triangle, world) => {
	ctx.beginPath();
	ctx.moveTo(triangle[2].x, triangle[2].y);
	triangle.forEach(({xUnit, yUnit}) => ctx.lineTo(
		xUnit * world.xUnit, yUnit * world.yUnit
	));
};


class BackgroundRenderer {
	constructor(game) {
		this.world = new World({
			canvas: game.canvas,
			width: game.width,
			height: game.height,
			xUnit: game.width / 32,
			initialColor: '#f1f2f3'
		});
	}

	render() {
		this.world.render();
	}

	fillTo(color, position) {
		return new Promise(resolve => {
			if(!position) position = {
				x: Math.round(this.world.xCount / 2),
				y: Math.round(this.world.yCount / 2)
			};

			const propAmount = this.world.xCount * this.world.yCount - 1;

			this.world.propagateFragment(position, () => colorRandomUnified(Color(color)), propAmount, resolve);
		});
	}

	async initBackground() {
		await this.fillTo('#202020');
		await new Promise(resolve => {
			const position = {
				x: Math.round(this.world.xCount / 2),
				y: Math.round(this.world.yCount - 4)
			};

			this.world.propagateFragment(position, fragId => {
				if(getXY(this.world, fragId).y < this.world.yCount - 8) return;

				return colorRandomUnified(Color('#303030'));
			}, this.world.xCount * 8 - 1, resolve);
		});
	}
}

class World {
	constructor({canvas, width, height, xUnit, initialColor}){
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d');
		canvas.width = width;
		canvas.height = height;
		this.width = width;
		this.height = height;
		this.xUnit = xUnit;
		this.yUnit = xUnit / Math.sqrt(3);
		this.xCount = Math.ceil(window.innerWidth / this.xUnit);
		this.yCount = Math.ceil(window.innerHeight / this.yUnit) + 1;
		this.fragments = [];

		for(let x = 0; x < this.xCount; x++){
			for(let y = 0; y < this.yCount; y++){
				this.fragments.push(new Fragment(this, {
					x, y, color: initialColor
				}));
			}
		}
	}

	render() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.fragments.forEach((v) => {
			v.update();
			v.render(this.ctx)
		});
	}

	propagateFragment(start, checker, targetCount, cb) {
		const fragId = start.x * this.yCount + start.y;
		const startFrag = this.fragments[fragId];

		if(!startFrag){
			throw new Error(`No starting fragment exists: ${fragId}`);
		}

		const propagated = {};
		let propagateAmount = 0;
		let pureAmount = 0;
		const propagateToNear = (fragment) => {
			fragment.getNearFragments().forEach((v) => {
				const fragId = v.x * this.yCount + v.y;
				const targetFrag = this.fragments[fragId];
				if(v.x < 0 || v.y < 0) return;
				if(v.x >= this.xCount || v.y >= this.yCount) return;

				const color = checker(fragId);
				if(targetFrag && color && !propagated[fragId]) {
					propagated[fragId] = true;
					targetFrag.alternateTo(v.yaw, color, () => {
						propagateAmount++;
						pureAmount++;
						if(propagateAmount < 200)
							propagateToNear(targetFrag);
						else {
							propagateAmount = 0;
							setTimeout(() => propagateToNear(targetFrag), 0);
						}

						if(pureAmount >= targetCount) {
							cb();
						}
					});
				}
			});
		};

		propagateToNear(startFrag);
	}
}

class Fragment{
	constructor(world, {x, y, color}){
		this.world = world;
		this.x = x;
		this.y = y;
		this.spin =
			(((x % 2 === 0) && (y % 2 === 0)) ||
			((x % 2 === 1) && (y % 2 === 1))) ?
			SPIN_LEFT :
			SPIN_RIGHT;

		this.color = color;

		this.units = (this.spin === SPIN_LEFT) ? [
			{xUnit: this.x + 1, yUnit: this.y - 1},
			{xUnit: this.x, yUnit: this.y},
			{xUnit: this.x + 1, yUnit: this.y + 1}
		] : [
			{xUnit: this.x, yUnit: this.y + 1},
			{xUnit: this.x + 1, yUnit: this.y},
			{xUnit: this.x, yUnit: this.y - 1}
		];

		this.alternating = undefined;
		this.altPitch = 0;
		this.altYaw = undefined;
		this.altCallback = undefined;
	}

	getNearFragments() {
		return [
			{
				x: this.x,
				y: this.y + 1,
				yaw: (!this.spin) ? YAW_NE : YAW_NW
			},
			{
				x: this.x,
				y: this.y - 1,
				yaw: (this.spin) ? YAW_NE : YAW_NW
			},
			{
				x: this.x + Math.sign(+!this.spin - 0.5),
				y: this.y,
				yaw: YAW_N
			}
		];
	}

	render(ctx) {
		//Original Fragment Rendering
		drawTriangle(ctx, this.units, this.world);
		ctx.fillStyle = this.color;
		ctx.fill();

		if(this.alternating) {
			//Shadow Rendering

			//Alternating Fragment Rendering
			const altScala = -Math.sign(this.spin - 0.5)
				* Math.cos(this.altPitch / 180 * Math.PI);

			const deltaX = Math.cos(this.altYaw) * -altScala;
			const deltaY = Math.sin(this.altYaw) * -altScala;

			//SPIN_LEFT: altScala < 0 when 0~90, altScala > 0 when 90~180
			//SPIN_RIGHT: altScala > 0 when 0~90, altScala < 0 when 90~180
			let triangle;

			if(this.altYaw === YAW_N) {
				triangle = [this.units[0], this.units[2]];
				triangle.push({
					xUnit: this.x + (+!this.spin) + altScala,
					yUnit: this.y + 1
				});
			} else {
				triangle = (this.altYaw === YAW_NW) ?
					[this.units[0], this.units[1]] :
					[this.units[1], this.units[2]];

				if(this.spin === SPIN_LEFT) {
					triangle.push({
						xUnit: this.x + 0.5 + deltaX,
						yUnit: this.y + 1 + deltaY
					});
				} else {
					triangle.push({
						xUnit: this.x + 0.5 + deltaX,
						yUnit: this.y + 1 + deltaY
					});
				}

			}

			drawTriangle(ctx, triangle, this.world);
			ctx.fillStyle = this.alternating;
			ctx.fill();
		}
	}

	alternateTo(yaw, color, cb = () => {}) {
		this.alternating = color;
		this.altPitch = 0;
		this.altYaw = yaw;
		this.altCallback = cb;
	}

	update() {
		if(this.alternating) {
			this.altPitch += 40;
		}

		if(this.altPitch >= 180) {
			this.color = this.alternating;
			this.alternating = undefined;
			this.altPitch = 0;
			if(this.altCallback) {
				this.altCallback();
			}
		}
	}
}

export default BackgroundRenderer;
export {Fragment, World};
