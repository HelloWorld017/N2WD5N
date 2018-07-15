export default function propagate (target) {
	target.prototype.updateEvent = function updateEvent(event) {
		if(this.doUpdateEvent) {
			this.doUpdateEvent(event);
		}

		this.elements.forEach(elem => {
			if(elem.uiEvent) elem.updateEvent(ev);
		});
	};
};
