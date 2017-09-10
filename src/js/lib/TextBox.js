/**
 * TextBox Component
 * @type {Class}
 * @extends IT.FormItem
 */
IT.TextBox = class extends IT.FormItem {
	/** @param {object} opt */
	constructor(opt){
		super(opt);
		let me=this,s;

		/** 
		 * Setting for class
		 * @member {Object}
		 * @name IT.TextBox#settings
		 * @see https://github.com/RobinHerbots/Inputmask/blob/4.x/dist/jquery.inputmask.bundle.js
		 * 
		 * @property {enum} available : [textarea, text, mask]
		 * @property {int} cols how many coloms char, only used for type textarea
		 * @property {int} rows how many rows char,only used for type textarea
		 * @property {Object} maskSettings maskSettings:{}, // only used for type mask
		 * @property {String} id id the classs
		 * @property {String} label set label description
		 * @property {String} name name for the input, < input type='type' > name="xxx">
		 * @property {boolean} allowBlank set the input weather can be leave blank or not
		 * @property {String} value value for input
		 * @property {String} placeholder placeholder for input
		 * @property {boolean} readonly set wather this comp readonly or not
		 * @property {boolean} enabled set wather this comp enabled or not
		 * @property {object} length how many char can be accepted
		 * @property {int} length.min minimal char length 
		 * @property {int} length.max maximal char length 		 
		 * @property {object} size in column grid system by bootstrap
		 * @property {string} size.field size for field input
		 * @property {string} size.label size for label input		 
		 * @property {object} info extra div for estra input
		 * @property {string} info.prepend info before input
		 * @property {string} info.append info after input
		 * @example
		 * var a = new IT.TextBox({
		 *    info:{
		 *        prepend:"Rp. ",
		 *        append:"-,.",
		 *    }
		 * });
		 * a.renderTo($(body));
		 *
		 * @example
		 * 
		 * //input type mask, numeric
		 * {
		 * x:"textbox",
					type:"mask",
					label:"masukan nama",
					placeholder:"masukan nama",
					allowBlank:false,
					info:{
						prepend:"Rp. ",
						append:"-,."
					},
					maskSettings:{
						groupSeparator: ".",
						radixPoint: "",
						alias: "numeric",
						placeholder: "0",
						autoGroup: !0,
						digits: 2
					},

				}
		 */
		me.settings = $.extend(true,{
			x:"textbox",
			type:'text',
			cols:19, 
			rows:5, 
			maskSettings:{}, 
			id:"", 
			label:"", 
			name:"", 
			allowBlank: true, 
			value:"", 
			placeholder: '', 
			readonly:false, 
			enabled:true, 
			length:{
				min:0, 
				max:-1,
			},
			size:{
				field:"col-sm-8",
				label:"col-sm-4"
			},
			info: {
				prepend: '',
				append: ''
			}
		}, opt);
		s= me.settings;

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
					`name='${me.settings.name||IT.Utils.id()}' `+
					`${s.length.min>0?`minlength='${s.length.min}'`:""} `+
					`${s.length.max>0?`maxlength='${s.length.max}'`:""} `+
				`>${s.value?`${s.value}`:""}</textarea>`);
			break;
			case 'text':
			case 'mask':
				me.input = $(`<input id="${me.id}-item" `+
					`type='text' `+
					`class='it-edit-input' `+
					`name='${me.settings.name||IT.Utils.id()}' `+
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
			default:
				throw "input type unknown";
			break;
		}

		// event
		me.input.on("focus change blur",function(e){
			me.setInvalid(!me.validate());
		});
		me.input.on("keypress",function(e){
			if(e.which==13)$(this).blur();
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

		me.readyState = true;
	}
}