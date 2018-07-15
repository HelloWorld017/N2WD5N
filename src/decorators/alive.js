export default function alive (target, name, descriptor) {
	const func = descriptor.value;
	descriptor.value = function() {
		if(!target.isDead) {
			return func.apply(this, arguments);
		}

		return false;
	};

	return descriptor;
};
