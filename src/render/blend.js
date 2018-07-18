import Color from "color";

export default function blend(alpha, color) {
	return Color(color).alpha(alpha).string();
};
