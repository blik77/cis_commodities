var hasJETHandlers = [];
window._hasJET = function () {
	hasJETHandlers.forEach(function (h) {
		h.call();
	});
};
window.hasJET = function (func) {
	if (window.JET) {
		func.call();
	}
	else {
		hasJETHandlers.push(func);
	}
};