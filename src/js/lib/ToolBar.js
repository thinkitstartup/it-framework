import Component from "./Component";
import Utils from "./Utils";

export default class Toolbar extends Component{
	constructor(settings){
		super();
		let me =this,cls;
		me.settings = $.extend(true,{
			id: '',
			position: 'top',
			items:[]
		},settings);
		me.id = me.settings.id||Utils.id();
		me.content = $(`
			<div id="${me.id}" class="it-toolbar toolbar-${me.settings.position}">
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
					el=Utils.createObject(el);
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
		if(typeof id==="number")id = this.ids[id];
		if(id)return this.items[id]||null;
		return this.items;
	}
}