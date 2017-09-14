/**
 * DataTable element
 * @extends IT.Component
 * @depend IT.Store
 * @param {Object} opt setting for class
 * @see IT.DataTable#settings
 */
IT.DataTable = class extends IT.Component {
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


		me.id 				= me.settings.id || IT.Utils.id();
		me.params 			= {}
		me.selectedRow 		= null;
		me.selectedColumn 	= null;
		me.editors			= [];
		me.paging 			= { 
			page 		: 1,
			page_count	: 0,
			total_rows 	: 0
		}

		me.addEvents(me.settings, [
			"onItemClick",
			"onItemDblClick",
			"onLoad",
			"onChangePage"
		]);
		me.createComponent();



		/**
		 * store data
		 * @member {boolean}
		 * @name IT.DataTable#store
		 * @see IT.Store
		 */
		if(!me.settings.store.isClass){
			class cstmStore extends IT.Store {
				load(opt){
					let readyState = true;
					let thse = this;
					thse.doEvent("beforeLoad");
					me.editors.forEach((e)=>{
						if(e && e.isClass) readyState = readyState && !!e.readyState;
					});
					if (!readyState)
						setTimeout(()=>{
							thse.load.call(thse, opt)
						},1000);
					else super.load(opt);
				}
			}
			me.store = new cstmStore($.extend(true, {
				beforeLoad:function(){
					me.content.find(".it-datatable-wrapper").animate({ scrollTop: 0 }, "slow");
					me.content.find('.it-datatable-loading-overlay').addClass('loading-show');
				},
				afterLoad:function(event,store,storeData,params){
					me.content.find('.it-datatable-loading-overlay').removeClass('loading-show');
					me.assignData(store);
					me.doEvent("onLoad",[me,store]);
				},
				onEmpty:function(event,store,storeData,params){
					me.assignData(store);
					me.doEvent("onLoad",[me,store]);
					me.content.find('.it-datatable-loading-overlay').removeClass('loading-show');
				}
			}, me.settings.store));
			cstmStore = null;
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

		// wrapper
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
						// to precise width
						"min-width":col.width,
						"width":col.width,
					}
				}).append(col.header));
				
				if(col.editor && col.editor.store && 
					(col.editor.store.type=="ajax"||col.editor.store.type=="json")
				){	
					me.editors.push(IT.Utils.createObject(
						$.extend(true,{},col.editor,{
							width:col.width
						})
					));
				}
				else me.editors.push(col.editor);
			}
			thead.append(tr);
		}
		if(s.enableFixedHeader) {
			me.content.append(fixHeader.append(table.clone()));
		}
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

			// Loading Inline
			let loadingInline = $(`
				<div class="it-datatable-loading-overlay">
					<div class="it-loading-rolling"></div>
				</div>
			`);

			me.content.append(loadingInline);
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

		if (start == 0) {
			me.content.find('.it-datatable-pagination-current').val(1);
		}
		if (storeData.length) {
			for (let indexRow=0;indexRow<storeData.length;indexRow++){	
				let curRecord = storeData[indexRow];
				let row_element = $("<tr>");
				for (let indexCol = 0; indexCol < me.settings.columns.length; indexCol++){
					let current_col = me.settings.columns[indexCol],
						field 		= me.settings.columns[indexCol].dataIndex,
						value 		= curRecord.get(field),
						render 		= 	
						current_col.data 		|| 
						current_col.renderer 	|| 
						(me.editors[indexCol]	&& me.editors[indexCol].store
							?me.editors[indexCol].store.getRawData()
							:null) 				|| 
						[],
						html		= IT.Utils.findData(value,render),
						td = $("<td />",{
							html:$("<div />",{html:(html==""?value:html)}),
							valign:current_col.valign ||"top",
							align:current_col.align ||"left",
							class:"" + (me.settings.wrap?"wrap":""),
						});

					let editor = me.editors[indexCol];
					if (editor) {
						editor = editor.isClass ? editor : IT.Utils.createObject(
							$.extend(true,{},current_col.editor,{
								width:current_col.width
							})
						);
						td.on('click',function(){
							me.selectedRow 		= indexRow;
							me.selectedColumn 	= indexCol;
							me.content.find("tbody tr").removeClass('it-datatable-selected');
							td.parent().addClass('it-datatable-selected');
							if(current_col.editor.editable && !$(this).hasClass("it-datatable-editing")){
								td.find("div").empty();
						 		td.addClass("it-datatable-editing");
								editor.val(curRecord.getChanged(field)||curRecord.get(field));
								editor.input.on("blur",function(){
									if(editor.validate()){
										curRecord.update(field,editor.val());
										editor.input.off();
								 		editor.content.detach();	
										td.removeClass("it-datatable-editing");
										td.find("div").html(IT.Utils.findData(
											curRecord.getChanged(field)||
											curRecord.get(field),
										render));
										td[curRecord.isChanged(field)?"addClass":"removeClass"]("it-datatable-changed");
									}
								});
								editor.renderTo(td.find("div"));
								editor.input.focus();
						 	}
						});
						if(editor.className=="checkbox"){
							editor.renderTo(td.find("div"));
							editor.input.focus();
						}
					}
					row_element.append(td);
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