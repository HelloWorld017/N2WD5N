export default function timeline (propertyName='entityInnerTick') {
	return (target) => {
		target.prototype.updateTimeline = function updateTimeline() {
			const prop = this[propertyName];
			if(this.timeline[prop]) {
				this.timeline[prop].forEach(event => event());
				delete this.timeline[prop];
			}
		};

		target.prototype.registerEvent = function registerEvent(delta, callback) {
			tick = this[propertyName] + delta;

			if(!this.timeline[tick]) {
				this.timeline[tick] = [];
			}

			this.timeline[tick].push(callback);
		};

		target.prototype.timeline = {};
	};
};
