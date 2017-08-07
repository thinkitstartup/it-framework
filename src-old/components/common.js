var base_url = base_url || '';
var base_events = ["blur", "change", "click", "dblclick", "focus", "hover", "keydown", "keypress", "keyup", "show", "hide"];
var transitionEnd = 'webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend';
var animationEnd = 'webkitAnimationEnd oanimationend msAnimationEnd animationend';

Array.prototype.remove = function(name, value) {  
    var rest = $.grep(this, function(item){    
        return (item[name] !== value);
    });
    this.length = 0;
    this.push.apply(this, rest);
    return this;
};

Array.prototype.insert = function (index, item) {
	this.splice(index, 0, item);
};

$.fn.serializeObject = function(){
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

$.fn.ajaxFileUpload = function(options) {
	var settings = {
		params: {},
		action: '',
		onStart: function() {},
		onComplete: function(response) {},
		onCancel: function() {},
		valid_extensions : ['gif','png','jpg','jpeg'],
		submit_button : null
	};

	var uploading_file = false;

	if (options){ $.extend( settings, options ); }

	return this.each(function() {
		var $element = $(this);
		if($element.data('ajaxUploader-setup') === true) return;
		
		$element.change(function(){
			uploading_file = false;
			if (settings.submit_button == null) upload_file();
		});

		if (settings.submit_button == null) {}
		else {
			settings.submit_button.click(function(){
				if (!uploading_file){
					upload_file();
				}
			});
		}
	
		var upload_file = function(){
			if($element.val() == '') return settings.onCancel.apply($element, [settings.params]);
			
			var ext = $element.val().split('.').pop().toLowerCase();
			if($.inArray(ext, settings.valid_extensions) == -1){
				settings.onComplete.apply($element, [{status: false, message: 'The select file type is invalid. File must be ' + settings.valid_extensions.join(', ') + '.'}, settings.params]);
			} else { 
				uploading_file = true;
				wrapElement($element);
				var ret = settings.onStart.apply($element);

				if(ret !== false){
					$element.parent('form').submit(function(e) { e.stopPropagation(); }).submit();
				}
			}
		};

		$element.data('ajaxUploader-setup', true);
		var handleResponse = function(loadedFrame, element) {
			var response, responseStr = loadedFrame.contentWindow.document.body.innerHTML;
			try {
				response = JSON.parse(responseStr);
			} catch(e) {
				response = responseStr;
			}
			element.siblings().remove();
			element.unwrap();

			uploading_file = false;
			settings.onComplete.apply(element, [response, settings.params]);
		};

		var wrapElement = function(element) {
			var frame_id = 'ajaxUploader-iframe-' + Math.round(new Date().getTime() / 1000)
			$('body').after('<iframe width="0" height="0" style="display:none;" name="'+frame_id+'" id="'+frame_id+'"/>');
			$('#'+frame_id).load(function() {
				handleResponse(this, element);
			});

			element.wrap(function() {
				return '<form action="' + settings.action + '" method="POST" enctype="multipart/form-data" target="'+frame_id+'" />'
			}).after(function() {
				var key, html = '';
				for(key in settings.params) {
					html += '<input type="hidden" name="' + key + '" value="' + settings.params[key] + '" />';
				}
				return html;
			});
		}
	});
}

$.fn.setCenter=function(params) {
	var defaults={
		topBottom:true,
		leftRight:true
	};
	var params=$.extend(defaults, params);
	var $p=params;
	return this.each(function(){
		var me=$(this);
		if($p.leftRight)
			me.css('left', ($(window).width() - $(this).outerWidth()) /2);
		if($p.topBottom)
			me.css('top', ($(window).height() - $(this).outerHeight()) /2);
	});
};

function makeid() {
    var text="IT-";
    var possible="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for(var i=0; i<5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return "it-component-"+text;
}


