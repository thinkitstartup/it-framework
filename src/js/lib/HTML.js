/**
 * HTML Class. Standar dom class.
 * @type IT.HTML
 * @extends IT.Component
 */
IT.HTML = class extends IT.Component{
	/** @param {object} settings */
	constructor(settings){
		super(settings);
		let me = this;

		/** 
		 * Setting for class
		 * @member {Object}
		 * @name IT.HTML#settings
		 * @property {string} id id the classs
		 * @property {string} url if url given, HTML will load data from url then append it content to this content
		 * @property {string} content content to be shown
		 * @property {object} css style for this item
		 * @property {string} class append this string to attribute class
		 */
		me.settings = $.extend(true,{
			id: '',
			url: '',
			content: '',
			css: {},
			data: {}, 
			class: ''
		},settings);
		
		me.id = me.settings.id || IT.Utils.id();
		me.content = $('<div/>', {id: me.id});
		if(me.settings.class)
			me.content.addClass(me.settings.class);
		me.content.css(me.settings.css);
		
		if(me.settings.url)
			me.content.load(me.settings.url);
		else {
			var length = Object.keys(me.settings.data).length;
			if(length) {
				me.settings.content = me.templateReplacer(me.settings.content, me.settings.data);
			}
			me.content.html(me.settings.content);
		}
	}

	/**
	 * set the desire content to HTML
	 * @param {string|selector}  html    the content that'll be replaced to
	 * @param {Boolean} replace replace mode, if set true, before appending, this content will be empty before
	 */
	setContent(html, replace = false){
		if (replace) this.content.empty();
		if (typeof html === 'string') {
			if(Object.keys(this.settings.data).length) {
				html = me.templateReplacer(this.settings.content, this.settings.data);
			}
			this.content.append(html);
		}
		else html.appendTo(this.content);
	}

	/**
	 * simple template replacer
	 * @param {string|selector} 
	 * @param {Object} 
	 */
	templateReplacer(template, data) {
		return template.trim().replace(/\{\{([\w\.]*)\}\}/g, function(str, key) {
		    var keys = key.split("."), v = data[keys.shift()];
		    for (var i = 0, l = keys.length; i < l; i++) v = v[keys[i]];
		    return (typeof v !== "undefined" && v !== null) ? v : "";
		});
	}

}