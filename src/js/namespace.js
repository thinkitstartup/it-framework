var IT= IT || {};

var base_url = base_url || '';
var base_events = ["blur", "change", "click", "dblclick", "focus", "hover", "keydown", "keypress", "keyup", "show", "hide"];
var transitionEnd = 'webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend';
var animationEnd = 'webkitAnimationEnd oanimationend msAnimationEnd animationend';
(function($){
	$.fn.serializeObject = function () {
		var result = {};
		var extend = function (i, element) {
			var node = result[element.name];
			if (typeof node !== 'undefined' && node !== null) {
				if ($.isArray(node)) node.push(element.value);
				else result[element.name] = [node, element.value];
			} else result[element.name] = element.value;
		};
		$.each(this.serializeArray(), extend);
		return result;
	};
})(jQuery);