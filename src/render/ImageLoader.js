import FlyDisabled from "../resources/fly-disabled.png";
import FlyEnabled from "../resources/fly-enabled.png";
import HpAbsortion from "../resources/hp-absortion.png";
import Title from "../resources/title.png";

class ImageLoader {
	constructor() {
		this.images = {};
		this.imageHref = {FlyDisabled, FlyEnabled, HpAbsortion, Title};
	}

	async loadImages() {
		for(let imageKey of Object.keys(this.imageHref)) {
			const url = await fetch(this.imageHref[imageKey]).then(v => v.blob());
			const img = document.createElement('img');
			img.src = url;

			this.images[imageKey] = img;
		}
	}
}

export default ImageLoader;
