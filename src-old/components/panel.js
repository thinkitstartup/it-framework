IT.Panel = class extends IT.Component {
	constructor(params){
		super();
		let me =this,cls;
		me.settings = $.extend(true,{ // Object.assign in deep
			id: '',
			iconCls: '',
			title: '',
			height: 0,
			items:[]
		}, params);
		me.id = me.settings.id||makeid();
		me.content = $('<article/>', { id:me.id });
		if(me.settings.title) {
			let icon =  $('<span/>', { class: 'fa fa-'+me.settings.iconCls })
			let title = $('<div/>', { 
				class: 'it-title', 
				html: me.settings.title
			});
			title.prepend(icon);
			me.content.append(title);
		}
		$.each(me.settings.items, function(k, el) {
			if(el){
				if(typeof el.renderTo !== 'function')
					el=createObject(el);
				el.renderTo(me.content);
			}
		});
	}
}