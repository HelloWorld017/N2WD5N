import Element from "../Element";

class BlinkImage extends Element {
	constructor(game, x, y, image) {
		super(game, x, y, image.width, image.height);
		this.image = image;
		this.tick = 0;
		this.interval = 45;
		this.isShowPhase = true;
	}

	doRender(renderer) {
		if(this.tick % this.interval === 0) {
			this.isShowPhase = !this.isShowPhase;
		}

		if(this.isShowPhase) renderer.drawImage(this.image, this.x, this.y);
	}
}

export default BlinkImage;
