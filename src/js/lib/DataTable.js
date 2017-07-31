/**
 * DataTable element
 * @extends IT.DataTable
 * @type IT.DataTable
 * @param {Object} opt setting for class
 * @see IT.Component#settings
 */
IT.DataTable = class extends IT.Component {
	/** @param  {object} opt  */
	constructor(opt){
		super(opt);
		let me = this;	
		


		/** 
		 * Setting for class
		 * @member {Object}
		 * @name IT.DataTable#settings
		 * @property {string} id ID of element
		 */
		me.settings = $.extend(true,{
			id:"",
			cls: 'it-grid',
			width: '100%',
			height: 'auto',
			top: 0,
			bottom: 0,
			cellEditing: true,
			sort: "local",
			wrap: false,
			paging:true,
			store: {
				type: 'json',
				params:{
					start: 0,
					limit: 20,
					orderBy: '',
					sortBy: ''
				}
			},
			columns: [{}]
		}, opt);

		/** 
		 * ID of class or element
		 * @member {boolean}
		 * @name IT.DataTable#id
		 */
		me.id = me.settings.id || IT.Utils.id();


		/**
		 * listeners
		 * @type {object}
		 */
		me.listener = new IT.Listener(me, me.settings, [
			"onItemClick",
			"onItemDblClick",
			"onLoad",
			"onChangePage"
		]);

		/**
		 * store data
		 * @member {boolean}
		 * @name IT.DataTable#store
		 * @see IT.Store
		 */
		if(!me.settings.store.isClass){
			me.store = new IT.Store($.extend(true, {
				onLoad:function(store,storeData,params){
					me.assignData(storeData);
					me.listener.fire("onLoad",[me,store]);
				}
			}, me.settings.store));
		}


		me.page = 1;
		me.pageCount = 1;
		me.params = me.store.params;
		me.selectedRecord = null;
		me.selectedColumn = null;

		me.createComponent();
		me.store.getData();



	}

	createComponent(){
		let me =this;
		let spaceimg='data:image/gif;base64,R0lGODlhAQABAJEAAAAAAP///////wAAACH5BAEHAAIALAAAAAABAAEAAAICVAEAOw==';
		me.content = $('<div />', {
			id: me.id,
			class: me.settings.cls
		})
		.width(me.settings.width)
		.height(me.settings.height);

		let col,headers = $("<thead>");
		for (let i = 0; i < me.settings.columns.length; i++){
			col =me.settings.columns[i];
			// var col_width = "";
			// var width = "";
			// var current_col = settings.columns[i];
			// var sort = typeof current_col.sort != 'undefined' ? current_col.sort : true;
			// if (typeof current_col.width != 'undefined'){
			// 	col_width = "<img src='spaceimg' width='" + (current_col.width-24) + "' height='1'>";
			// 	width = "width='" + current_col.width + "'";
			// }
			
			//text_header = col.header;
			//headers+=`<th ></th>`;
			headers.append(`<th></th>`);
			//$header += "<th " + width + ">" + col_width + col.header + "</th>";
		}
		me.content.append(headers);
		//grid.height(settings.height);

		//if (typeof me.settings.customHeader !== 'undefined'){
		//	$header = me.settings.customHeader;
		//}

		//grid.append("<div class='it-grid-wrapper'><table border='1' width='"+me.settings.width+"'><thead>" + $header + $tr + "</thead><tbody></tbody></table></div>");
		//grid.append("<div class='it-grid-fixed-header'><table border='1' width='"+me.settings.width+"'><thead>" + $header + $tr + "</thead></table></div>");
		
	}
	assignData(storeData){
		let me =this;
		if (storeData && storeData.rows) {
			me.content.find("tbody").empty();

		}
	}
}