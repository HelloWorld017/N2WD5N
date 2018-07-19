export default function chain (target, name, descriptor) {
	const func = descriptor.value;
	descriptor.value = function() {
		func.apply(this, arguments);
		return this;
	};

	return descriptor;
};
