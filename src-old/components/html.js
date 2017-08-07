IT.HTML = class extends IT.Component{
	constructor(params){
		super();
		let me = this;
		me.settings = $.extend(true, { // Object.assign in deep
			id: '',
			url: '',
			content: '', 
			css: {},
			class:""
		},params);
		
		me.id = me.settings.id||makeid();
		me.content = $('<div/>', {id: me.id});
		if(me.settings.class)
			me.content.addClass(me.settings.class);
		me.content.css(me.settings.css);
		
		if(me.settings.url)
			me.content.load(me.settings.url);
		else 
			me.content.html(me.settings.content);
	}
	setContent(html, replace = false){
		if (replace) this.content.empty();
		if (typeof html=="string") this.content.append(html);
		else html.appendTo(this.content);
	}
}