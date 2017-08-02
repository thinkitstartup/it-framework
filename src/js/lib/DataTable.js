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
			height: '',
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
			columns: [{}],
			customHeader:""
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


		me.params = me.store.params;
		me.selectedRecord = null;
		me.selectedColumn = null;


		me.paging = {
			total_rows:0
		}


		me.createComponent();
	}

	createComponent(){
		let me =this,s = me.settings;
		//spaceimg='data:image/gif;base64,R0lGODlhAQABAJEAAAAAAP///////wAAACH5BAEHAAIALAAAAAABAAEAAAICVAEAOw==';
		
		//content .it-grid
		me.content = $('<div />', {
			id: me.id,
			class: s.cls 
		}).width(s.width).height(s.height);

		//wrapper
		let wrapper 	= $(`<div class="it-grid-wrapper"/>`);
		let fixHeader 	= $(`<div class="it-grid-fixed-header"/>`);
		let table 		= $(`<table width='${s.width}' height='${s.height}'/>`);
		let thead 		= $(`<thead/>`);
		let tbody 		= $(`<tbody/>`);
		me.content.append(wrapper.append(table.append(thead)));

		//create header
		if (s.customHeader) thead.append($(s.customHeader));
		else {
			let col, tr=$(`<tr/>`);
			for (let i = 0; i < s.columns.length; i++){
				col =s.columns[i];
				tr.append($(`<th />`,{
					css:{
						"min-width":col.width, 	// to precise width
						"width":col.width,		// to precise width
					}
				}).append(col.header))
			}
			thead.append(tr);
		}
		me.content.append(fixHeader.append(table.clone()));
		table.append(tbody);

		if(s.paging)
			me.content.append(`
				<div class="it-grid-pagination" >
					<ul>
						<li><button class="it-grid-icon" rel="first"><span class="fa fa-step-backward"></span></button></li>
						<li><button class="it-grid-icon" rel="back"><span class="fa fa-chevron-left"></span></button></li>
						<li> 
							<input type="text" class="it-grid-pagination-current" value="1"> /
						 	<span class="it-grid-pagination-page"></span>
						</li>
						<li><button class="it-grid-icon" rel="next"><span class="fa fa-chevron-right"></span></button></li>
						<li><button class="it-grid-icon" rel="last"><span class="fa fa-step-forward"></span></button></li>
						<li >
							Menampilkan
							<span class='it-grid-pagination-show'></span> 
							dari
							<span class='it-grid-pagination-count'></span> 
							Data
						</li>
					</ul>
					<div class='it-grid-pagination-info'></div>
				</div>
			`);
	}
	assignData(storeData){
		let me =this;
		if (storeData && storeData.rows) {
			me.content.find("tbody").empty();
			
			let total_rows = storeData.total_rows;
			let start = me.params.start;
			let limit = me.params.limit;
			let last_data = (start + limit) < total_rows ? (start + limit) : total_rows;
			let data_show = total_rows > 0 ? (start + 1) + "/" + last_data : "0";
			let page_count = Math.ceil(total_rows / limit);

			me.paging = {
				total_rows:total_rows,
				pageCount:page_count
			}

			me.content.find('.it-grid-pagination-show').html(data_show);
			me.content.find('.it-grid-pagination-count').html(total_rows);
			me.content.find('.it-grid-pagination-page').html(page_count);

			if (start == 0) 
				me.content.find('.it-grid-pagination-current').val(1);

			for (let k=0;k<storeData.rows.length;k++){	
				let current_row = storeData.rows[k];
				/*
				error_highlight = typeof current_row.errorRow == 'object' && current_row.errorRow.length > 0 ? "style='background:#ffeeee;'" : "";
				error_highlight = typeof current_row.isError != 'undefined' && current_row.isError == true ? "style='background:#ffeeee;'" : error_highlight;
				
				var $rows = "<tr " + error_highlight + ">";
				 */
				let row_element = $("<tr>");
				for (let i = 0; i < me.settings.columns.length; i++){
					let current_col = me.settings.columns[i];
					let data = current_row[me.settings.columns[i].dataIndex];
					data = !data ? "" : data;
					row_element.append($("<td />",{
						html:data,
						valign:current_col.valign ||"top",
						align:current_col.align ||"left",
						class:"" + (me.settings.wrap?"wrap":""),
					}));
					// var comboData = null;
					// var $value = "";
					// var editor = typeof current_col.editor != 'undefined' ? current_col.editor : null;
					// var dataIndex = settings.columns[i].dataIndex;

					// if ((editor != null && editor.xtype == 'combo') || typeof current_col.data != 'undefined') {
					// 	$value = " value='" + $data + "'";
					// 	comboData = typeof current_col.data != 'undefined' ? current_col.data : settings.columns[i].editor.data;
					// 	arrayIndex = null;
					// 	for (z = 0; z < comboData.length; z++){
					// 		if (comboData[z]['key'] == $data){
					// 			arrayIndex = z;
					// 			break;
					// 		}
					// 	}
					// 	$data = arrayIndex != null ? comboData[arrayIndex]['value'] : "";
					// 	$data = $data != "" && editor != null && typeof editor.format != 'undefined' ? editor.format.format(comboData[arrayIndex].key, comboData[arrayIndex].value) : $data;
					// }

					// if (editor != null && editor.xtype == 'check') {
					// 	$value = " value='1' ";
					// 	$checked = $data == 1 || $data == "Y" ? "checked" : "";
					// 	$data = " <input name='" + dataIndex + "[]' class='" + dataIndex + "' type='checkbox' " + $value + $checked + ">";
					// }
					

					/*

					$cssTD += current_row.errorRow == 'object' && current_row.errorRow.length > 0 && jQuery.inArray(dataIndex, current_row.errorRow) >= 0 ? "class='it-grid-error'" : "";
					
					
					var $img = typeof current_col.image != 'undefined' ? current_col.image : "";
					if ($img == true) $data = "<img src='" + $data + "' " + $cssTD + ">";
					$rows += "<td " + $cssTD + "><div"+ $value + $cssDiv +">" + $data + "</div></td>";
					*/
				}
				me.content.find("tbody").append(row_element);
			}
		}
	}
}