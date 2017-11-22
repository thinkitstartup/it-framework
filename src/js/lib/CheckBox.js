/**
 * [CheckBox description]
 * @type {class}
 * @extends IT.FormItem
 * @depend IT.FormItem
 */

IT.CheckBox = class extends IT.FormItem {
	constructor(settings){
		super(settings);
		let me=this,s;
		me.settings = $.extend(true,{
			x:"checkbox",
			id:"", // id the classs
			label:"", // set label description
			name:"", // name for the input
			value:"", // value for the input
			readonly:false, // set readonly of the input 
			enabled:true, // set enabled of the input 
		}, settings);
		s = me.settings;
		me.addEvents(me.settings, ["onChange"]);

		// set id
		me.id = s.id||IT.Utils.id();
		me.input = $(`<input id="${me.id}-item" `+
			`type='checkbox' `+
			`class='it-edit-input' `+
			//`name='${s.name || IT.Utils.id()}[${s.value || IT.Utils.id()}]' `+
			`name='${s.name || IT.Utils.id()}' `+
			`${s.allowBlank==false?`required`:""} `+
			`${s.readonly?` readonly `:""} `+
			`${s.enabled==false?` disabled `:""} `+
			`value='${s.value || IT.Utils.id()}' `+
		`>`);
		me.input.on("change",function(){
			me.doEvent("onChange",[me, this.checked]);
		});

		//wrapper
		me.content= $("<div class='it-edit for-option' />")
			.append(me.input)
			.append(`<label for="${me.id}-item" `+
			`class='it-input-label it-input-label-${s.labelAlign||'left'}'`+
			`>${s.label}</label>`);
		me.readyState = true;
	}

	get checked(){
		return this.input.is(":checked");
	}

	set checked(v=true){
		this.input.prop('checked', v);
	}
}