IT.Toolbar = class extends IT.Component {
	constructor(params){
		super();
		let me =this,cls;
		me.settings = $.extend(true,{ // Object.assign in deep
			id: '',
			position: 'top',
			items:[]
		},params);
		me.id = me.settings.id||makeid();
		me.content = $(`
			<div id="${me.id}" class="it-toolbar toolbar-${me.settings.position} clearfix">
				<ul class="it-toolbar-left"></ul>
				<ul class="it-toolbar-right"></ul>
			</div>
		`);
		me.ids=[];
		me.items={};
		$.each(me.settings.items, function(k, el) {
			if(el) {
				let li = $('<li/>');
				if(!el.isClass)
					el=createObject(el);
				el.renderTo(li);
				me.content.find(`.it-toolbar-${el.getSetting().align||'left'}`).append(li);
				me.ids.push(el.getId());
				me.items[el.getId()] = el;
			}
		});
	}
	getItemCount(){
		return this.ids.length;
	}
	getItem(id){
		if(id)return this.items[id]||null;
		return this.items;
	}
}