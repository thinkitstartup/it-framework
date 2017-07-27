IT.TextBox = class extends IT.FormItem {
	constructor(opt){
		super(opt);
		let me=this,s;
		me.opt = $.extend(true, {
			x:"textbox",

			type:'text', // available : [textarea, text, mask] 
			//for mask see https://github.com/RobinHerbots/Inputmask/blob/4.x/dist/jquery.inputmask.bundle.js
			cols:19, // only used for type textarea
			rows:5, // only used for type textarea,
			maskSettings:{}, // only used for type mask,
			
			id:"", // id the classs
			label:"", // set label description
			name:"", // name for the input
			allowBlank: true, // set the input can be leave blank or not
			value:"", // value for input
			placeholder: '', // value for input

			readonly:false, // set readonly of the input 
			enabled:true, // set enabled of the input 

			// min max for the char length
			length:{
				min:0, 
				max:-1,
			},

			// size for label and field, use the 12 grid system bootstrap
			size:{
				field:"col-sm-8",
				label:"col-sm-4"
			},

			// extra div info for the input
			info: {
				prepend: '',
				append: ''
			}
		}, opt);
		s= me.opt;

		// set id
		me.id = s.id||IT.Utils.id();

		//if label empty, field size is 12
		if(s.label=="")
			s.size.field = "col-sm-12";

		//create input
		switch(s.type){
			case 'textarea':
				me.input = $(`<textarea style='resize: none;' id="${me.id}-item" `+
					`class='it-edit-input' `+
					`${s.allowBlank==false?`required`:""} `+
					`cols='${s.cols}' `+
					`rows='${s.rows}' `+
					`${s.readonly?` readonly `:""} `+
					`${s.enabled==false?` disabled `:""} `+
					`name='${me.opt.name||IT.Utils.id()}' `+
					`${s.length.min>0?`minlength='${s.length.min}'`:""} `+
					`${s.length.max>0?`maxlength='${s.length.max}'`:""} `+
				`>${s.value?`${s.value}`:""}</textarea>`);
			break;
			case 'text':
			case 'mask':
				me.input = $(`<input id="${me.id}-item" `+
					`type='text' `+
					`class='it-edit-input' `+
					`name='${me.opt.name||IT.Utils.id()}' `+
					`${s.length.min>0?`minlength='${s.length.min}'`:""} `+
					`${s.length.max>0?`maxlength='${s.length.max}'`:""} `+
					`${s.allowBlank==false?`required`:""} `+
					`${s.readonly?` readonly `:""} `+
					`${s.enabled==false?` disabled `:""} `+
					`${s.placeholder?`placeholder='${s.placeholder}'`:""} `+
					`${s.value?`value='${s.value}'`:""} `+
				`>`);
				if (s.type =="mask") //input type mask
					me.input.inputmask(s.maskSettings||{});
			break;
			default:console.error("input type unknown : "+ s.type); break;
		}

		// event
		me.input.on("focus change blur",function(e){
			me.setInvalid(!me.validate());
		});

		//wrapper
		let wraper = $("<div class='it-edit' />").append(me.input);

		//info
		s.info.prepend && wraper.prepend($('<div />', {
			class: 'it-edit-item',
			html: s.info.prepend
		}));
		s.info.append && wraper.append($('<div />', {
			class: 'it-edit-item',
			html: s.info.append
		}));

		//content
		me.content=$(((s.label) ? `<div class="${s.size.label}">`+
			`<label for="${me.id}-item" class='it-input-label it-input-label-${s.labelAlign||'left'}'>${s.label}</label>`+
		`</div>`:"") + `<div class="${s.size.field}"></div>`);
		me.content.last().append(wraper);
	}
}