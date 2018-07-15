export default function singleton (target) {
	let instance = undefined;

	target.getInstance = (...args) => {
		instance = new target(...args);
		target.getInstance = () => instance;
	};

	return target;
};
