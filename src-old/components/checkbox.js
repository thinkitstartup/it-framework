IT.CheckBox = class extends IT.FormItem {
	constructor(opt){
		super(opt);
		let me=this,s;
		me.opt = $.extend(true, {
			x:"textbox",
			id:"", // id the classs
			label:"", // set label description
			name:"", // name for the input
			allowBlank: true, // set the input can be leave blank or not
			value:0, // value for input
			readonly:false, // set readonly of the input 
			enabled:true, // set enabled of the input 

			// size for label and field, use the 12 grid system bootstrap
			size:{
				field:"col-sm-8",
				label:"col-sm-4"
			}
		}, opt);
		s= me.opt;

		// set id
		me.id = s.id||IT.Utils.id();

		//if label empty, field size is 12
		if(s.label=="")
			s.size.field = "col-sm-12";

		me.input = $(`<input id="${me.id}-item" `+
			`type='checkbox' `+
			`class='it-edit-input' `+
			`name='${me.opt.name||IT.Utils.id()}' `+
			`${s.allowBlank==false?`required`:""} `+
			`${s.readonly?` readonly `:""} `+
			`${s.enabled==false?` disabled `:""} `+
			`${s.value?`value='${s.value}'`:""} `+
		`>`);

		//wrapper
		me.content= $("<div class='it-edit' />")
			.append(me.input)
			.append(`<label for="${me.id}-item" class='it-input-label it-input-label-${s.labelAlign||'left'}'>${s.label}</label>`);
	}
}