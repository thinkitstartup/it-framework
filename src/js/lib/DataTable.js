/**
 * DataTable element
 * @extends IT.DataTable
 * @type IT.DataTable
 * @param {Object} opt setting for class
 * @see IT.Component#settings
 */
IT.DataTable = class extends IT.Component {
	/** @param  {object} opt  */
	constructor(settings){
		super(settings);
		let me = this;

		/** 
		 * Setting for class
		 * @member {Object}
		 * @name IT.DataTable#settings
		 * @property {string} id ID of element
		 */
		me.settings = $.extend(true,{
			id:"",
			cls: 'it-datatable',
			width: '100%',
			height: '',
			cellEditing: true,
			enableFixedHeader: true,
			wrap: false,
			paging: true,
			store: {
				type: 'json',
				params:{
					start: 0,
					limit: 20
				}
			},
			columns: [{}],
			customHeader:""
		}, settings);

		/** 
		 * ID of class or element
		 * @member {boolean}
		 * @name IT.DataTable#id
		 */
		me.id = me.settings.id || IT.Utils.id();


		me.addEvents(me.settings, [
			"onItemClick",
			"onItemDblClick",
			"onLoad",
			"onChangePage"
		]);
		me.params 			= {}
		me.selectedRow 	= null;
		me.selectedColumn 	= null;
		me.paging 			= { 
			page:1,
			page_count	: 0,
			total_rows 	: 0
		}
		me.createComponent();


		/**
		 * store data
		 * @member {boolean}
		 * @name IT.DataTable#store
		 * @see IT.Store
		 */
		if(!me.settings.store.isClass){
			me.store = new IT.Store($.extend(true, {
				beforeLoad:function(){
					me.content.find(".it-datatable-wrapper").animate({ scrollTop: 0 }, "slow");
				},
				afterLoad:function(store,storeData,params){
					me.assignData(store);
					me.doEvent("onLoad",[me,store]);
				},
				onEmpty:function(store,storeData,params){
					me.assignData(store);
					me.doEvent("onLoad",[me,store]);
				}
			}, me.settings.store));
			me.params = me.store.params;
		}
	}

	/**
	 * Create element content
	 */
	createComponent(){
		let me =this,s = me.settings;
		
		//content .it-datatable
		me.content = $('<div />', {
			id: me.id,
			class: s.cls 
		}).width(s.width).height(s.height);

		//wrapper
		let wrapper 	= $(`<div class="it-datatable-wrapper"/>`);
		let fixHeader 	= $(`<div class="it-datatable-fixed-header"/>`);
		let table 		= $(`<table width='100%' />`);
		let thead 		= $(`<thead />`);
		let tbody 		= $(`<tbody />`);
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

		if(s.enableFixedHeader) 
			me.content.append(fixHeader.append(table.clone()));
		
		table.append(tbody);
		if(s.paging){
			me.content.append(`
				<div class="it-datatable-pagination" >
					<ul>
						<li><button class="it-datatable-icon" data-page="first"><span class="fa fa-step-backward"></span></button></li>
						<li><button class="it-datatable-icon" data-page="back"><span class="fa fa-chevron-left"></span></button></li>
						<li> 
							<input type="text" class="it-datatable-pagination-current" value="1"> /
						 	<span class="it-datatable-pagination-page">0</span>
						</li>
						<li><button class="it-datatable-icon" data-page="next"><span class="fa fa-chevron-right"></span></button></li>
						<li><button class="it-datatable-icon" data-page="last"><span class="fa fa-step-forward"></span></button></li>
						<li >
							Menampilkan
							<span class='it-datatable-pagination-show'>0</span> 
							dari
							<span class='it-datatable-pagination-count'>0</span> 
							Data
						</li>
					</ul>
					<div class='it-datatable-pagination-info'></div>
				</div>
			`);
			me.content.find(".it-datatable-pagination .it-datatable-icon").click(function(){
				if(me.getDataChanged().length){
					let msg = new IT.MessageBox({
						type:'question',
						title:'Konfirmasi',
						width: 400,
						message:'Yakin akan menghapus data tersebut ?',
						buttons:[{
							text:'Ya',
							handler:function(){
								me.setPage($(this).data("page"));
							}
						}, {
							text:'Tidak',
							handler:function(){
								msg.close();
							}
						}]
					});
				}else me.setPage($(this).data("page"));
			});
			me.content.find(".it-datatable-pagination .it-datatable-pagination-current").change(function(){
				me.setPage($(this).val());
			});
		}
	}

	/**
	 * Assign Data from store
	 * @param  {IT.Store} store 
	 */
	assignData(store){
		let me =this,
			storeData = store.getData();

		if(storeData.length){
			me.content.find("table").animate({ scrollTop: 0 }, "slow");
		}

		me.content.find("tbody").empty();
		let start		= me.params.start;
		let limit		= me.params.limit;
		let last_data	= (start + limit) < store.total_rows ? (start + limit) : store.total_rows;
		let data_show	= store.total_rows > 0 ? (start + 1) + "/" + last_data : "0";
		let page_count	= Math.ceil(store.total_rows / limit);
		me.paging		= Object.assign({},me.paging,{
			start, limit, page_count,
			total_rows 	: store.total_rows
		});
		me.content.find('.it-datatable-pagination-show').html(data_show);
		me.content.find('.it-datatable-pagination-count').html(store.total_rows);
		me.content.find('.it-datatable-pagination-page').html(page_count);

		if (start == 0) 
			me.content.find('.it-datatable-pagination-current').val(1);

		if (storeData.length) {
			for (let indexRow=0;indexRow<storeData.length;indexRow++){	
				let current_row = storeData[indexRow];
				let row_element = $("<tr>");
				for (let indexCol = 0; indexCol < me.settings.columns.length; indexCol++){
					let current_col = me.settings.columns[indexCol];
					let field = me.settings.columns[indexCol].dataIndex;
					let data = current_row.get(field);
					data = !data?"":data;
					let editor;
					let td = $("<td />",{
						html:$("<div />",{html:data}),
						valign:current_col.valign ||"top",
						align:current_col.align ||"left",
						class:"" + (me.settings.wrap?"wrap":""),
					});

					td.on('click',function(){

						me.selectedRow = indexRow;
						me.selectedColumn = indexCol;
						me.content.find("tbody tr").removeClass('it-datatable-selected');
						td.parent().addClass('it-datatable-selected');

					 	if(current_col.editor 
					 		&& current_col.editor.editable
					 		&& !td.hasClass("it-datatable-editing")
					 	){
					 		td.addClass("it-datatable-editing");
							td.attr("data-oldval",data);
							editor = IT.Utils.createObject(current_col.editor);
							editor.val(td.find("div").html());
							td.find("div").empty();
							editor.input.on("blur",function(){
								if(editor.validate()){
									current_row.update(field,editor.val());
									td.removeClass("it-datatable-editing");
									td.find("div").html(editor.val());
									editor.content.remove();
									td[editor.val()==td.data("oldval")?"removeClass":"addClass"]("it-datatable-changed");
								}
							});
							editor.renderTo(td.find("div"));
							editor.input.focus();
					 	}
					});
					row_element.append(td);
					/*
					var $img = typeof current_col.image != 'undefined' ? current_col.image : "";
					if ($img == true) $data = "<img src='" + $data + "' " + $cssTD + ">";
					$rows += "<td " + $cssTD + "><div"+ $value + $cssDiv +">" + $data + "</div></td>";
					*/
				}
				me.content.find("tbody").append(row_element);
			}
		}
	}

	/**
	 * Overide renderTo
	 * @override
	 * @param  {Element} parent Element to be placed
	 */
	renderTo(parent){
		super.renderTo(parent);
		let me = this;
		me.content.find('.it-datatable-wrapper').scroll(function(){
			me.content.find('.it-datatable-fixed-header').scrollLeft($(this).scrollLeft());
		});
	}

	/**
	 * [getDataChanged description]
	 * @return {array} array of object
	 */
	getDataChanged(){
		let me 	= this,
			r 	= [];
		for(let key in me.store.data){
			if(me.store.data[key].isChanged())
				r.push(me.store.data[key].getChanged());
		}
		return r;
	}

	setPage(to=1){
		let me=this;
		if (me.store.getData().length){
			switch(to){
				case 'first':
					if (me.paging.page != 1) {
						me.paging.page = 1;
						me.loadPage(1);
					}
				break;
				case 'last':
					if (me.paging.page != me.paging.page_count) {
						me.paging.page = me.paging.page_count;
						me.loadPage(me.paging.page_count);
					}
				break;
				case 'next':
					if (me.paging.page < me.paging.page_count) {
						me.paging.page++;
						me.loadPage(me.paging.page);
					}
				break;
				case 'back':
					if (me.paging.page >1) {
						me.paging.page--;
						me.loadPage(me.paging.page);
					}
				break;
				default:
					if(to>=1 && to<=me.paging.page_count){
						me.paging.page = to;
						me.loadPage(to);
					}else {
						alert("Invalid page");
						me.content.find(".it-datatable-pagination-current").val(me.paging.page);
						throw "Invalid page";
					}
				break;
			}
		}
	}
	loadPage(page){
		let me=this;
		let start = (page - 1) * me.paging.limit;
		me.content.find(".it-datatable-pagination .it-datatable-pagination-current").val(page);
		me.store.load({
			params:{start:start,limit:me.paging.limit}
		});
	}

	getSelectedRecords(){
		let me =this;
		return !me.selectedRow?null:me.store.data[me.selectedRow];
	}
}