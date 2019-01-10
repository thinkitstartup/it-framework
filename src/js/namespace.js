var IT= IT || {};
var transitionEnd = 'webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend';
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