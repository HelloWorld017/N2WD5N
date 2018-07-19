const Keys = {
	KEY_JUMP: " ",
	KEY_LEFT: "ArrowLeft",
	KEY_RIGHT: "ArrowRight",
	KEY_AIM_LEFT: "q",
	KEY_AIM_RIGHT: "e",
	KEY_FIRE: "Control",
	KEY_SKILL_UI_TOGGLE: "s",

	listKeys() {
		return Object.keys(Keys).filter(k => k.startsWith('KEY_')).map(k => Keys[k]);
	}
};

export default Keys;
