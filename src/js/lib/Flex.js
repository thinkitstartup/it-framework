IT.Flex = class extends IT.Component {
	constructor(settings){
		super();
		let me =this;
		
		me.settings = $.extend(true,{ // Object.assign in deep
			id: '',
			title:"",
			iconTitle:"",
			direction: 'row',
			wrap: '',//nowrap | wrap | wrap-reverse
			justifyContent: '', 
			css: {},
			alignItems: '', //flex-start | flex-end | center | baseline | stretch. Default: stretch
			alignContent: '', //flex-start | flex-end | center | space-between | space-around | stretch. Default: stretch
			items:[]
		}, settings);
		
		me.id = me.settings.id || IT.Utils.id();
		me.content = $('<div />', { id: me.id, class: 'it-flex' });
		me.content.css(me.settings.css||{});
		me.content.addClass('it-flex-dir dir-' + me.settings.direction);
		me.content.addClass('it-flex-wrap wrap-' + me.settings.wrap);
		me.content.addClass('it-flex-jc jc-' + me.settings.justifyContent);
		me.content.addClass('it-flex-ai ai-' + me.settings.alignItems);
		me.content.addClass('it-flex-ac ac-' + me.settings.alignContent);
		if(me.settings.title) {
			let title = $('<div/>', { 
				class: 'it-title', 
				html: me.settings.title
			});
			title.prepend($('<span/>', { 
				class: 'fa'+ (me.settings.iconTitle?' fa-'+me.settings.iconTitle:"")
			}));
			me.content.append(title);
		}

		me.ids=[];
		me.items={};
		$.each(me.settings.items, function(k, el) {
			if(el) {
				if(!el.isClass) 
					el = IT.Utils.createObject(el);
				if(typeof el.settings.flex !== 'undefined') 	
					el.content.addClass('it-flex-item');
				el.renderTo(me.content);
				me.ids.push(el.getId());
				me.items[el.getId()] = el;
			}
		});
	}
	getItemCount(){
		return this.ids.length;
	}
	getItem(id){
		if(typeof id==="number")id = this.ids[id];
		if(id)return this.items[id]||null;
		return this.items;
	}
}