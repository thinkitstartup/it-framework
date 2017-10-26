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
			store: {},
			columns: [{}],
			customHeader:"",
			autoRowCount:true,
		}, settings);
		me.id 				= me.s.id || IT.Utils.id();
		me.selectedRow 		= null;
		me.selectedColumn 	= null;
		me.editors			= [];
		me.addEvents(me.s, [
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
		if(!me.s.store.isClass){
			me.store = new class extends IT.Store {
				load(opt){					
					let readyState = true, those = this;
					those.doEvent("beforeLoad");
					me.editors.forEach((e)=>{
						if(e && e.isClass) readyState = readyState && !!e.readyState;
					});
					if (!readyState)
						//looping every second to check 
						//every header's editor is in readyState
						setTimeout(()=>{
							those.load.call(those, opt)
						},1000);
					else super.load(opt);
				}
			}($.extend(true,{},me.s.store,{
				// when DataTable's autoRowCount is true, force Store's autoLoad to false. 
				// since store need to load AFTER DataTable's DOM rendered, so it can 
				// count the number of rows can be loaded
				autoLoad:me.s.autoRowCount ? false : me.s.store.autoLoad 
			}));
		}else me.store = me.s.store;
		me.store.addEvents({
			beforeLoad:function(){
				me.content.find(".it-datatable-wrapper").animate({ scrollTop: 0 }, "slow");
				me.content.find('.it-datatable-loading-overlay').addClass('loading-show');
			},
			afterLoad:function(event,store,storeData,params){
				me.content.find('.it-datatable-loading-overlay').removeClass('loading-show');
				me.assignData(store);
				me.doEvent("onLoad",[me,store]);
				me.selectedRow 		= null;
				me.selectedColumn 	= null;
			},
			onEmpty:function(event,store,storeData,params){
				me.assignData(store);
				me.doEvent("onLoad",[me,store]);
				me.content.find('.it-datatable-loading-overlay').removeClass('loading-show');
			}
		});
	}
	/**
	 * Create element content
	 */
	createComponent(){
		let me =this;

		//content .it-datatable
		me.content = $('<div />', {
			id: me.id,
			class: me.s.cls 
		}).width(me.s.width).height(me.s.height);

		// wrapper
		let wrapper 	= $(`<div class="it-datatable-wrapper"/>`);
		let fixHeader 	= $(`<div class="it-datatable-fixed-header"/>`);
		let table 		= $(`<table width='100%' />`);
		let thead 		= $(`<thead />`);
		let tbody 		= $(`<tbody />`);
		me.content.append(wrapper.append(table.append(thead)));

		//create header
		if (me.s.customHeader) thead.append($(me.s.customHeader));
		else {
			let col, tr=$(`<tr/>`);
			for (let i = 0; i < me.s.columns.length; i++){
				col =me.s.columns[i];
				tr.append($(`<th />`,{
					css:{
						// to precise width
						"min-width":col.width,
						"width":col.width,
					}
				}).append(col.header));

				// add editors
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
		if(me.s.enableFixedHeader) {
			me.content.append(fixHeader.append(table.clone()));
		}
		table.append(tbody);
		if(me.s.paging){
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
						message:'Perubahan data belum di simpan. Yakin akan berpindah halaman ?',
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
		let me =this,sd = store.getData();
			
		//update paging info
		me.content.find("tbody").empty();
		me.content.find('.it-datatable-pagination-show').html(store.detail.from+"/"+store.detail.to);
		me.content.find('.it-datatable-pagination-count').html(store.total_rows);
		me.content.find('.it-datatable-pagination-current').val(store.detail.currentPage);
		me.content.find('.it-datatable-pagination-page').html(store.detail.pageCount);
		
		//everyload scroll to top
		if(sd.length){
			me.content.find("table").animate({ scrollTop: 0 }, "slow");
			for (let indexRow=0;indexRow<sd.length;indexRow++){
				me.addRow(sd[indexRow]);
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
		setTimeout(function(){
			if(me.s.autoRowCount)
				me.store.params.limit = me.getAvailableRows();
			if(me.s.store.autoLoad)
				me.loadPage(1);
		},0);
		//use 0 timeout. https://stackoverflow.com/a/41893544
		//https://www.manning.com/books/secrets-of-the-javascript-ninja
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
		let me=this,detail=me.store.detail;
		if (me.store.getData().length){
			switch(to){
				case 'first':
					if (detail.currentPage != 1)
						me.loadPage(1);
				break;
				case 'last':
					if (detail.currentPage != detail.pageCount)
						me.loadPage(detail.pageCount);
				break;
				case 'next':
					if (detail.currentPage < detail.pageCount)
						me.loadPage(detail.currentPage+1);
				break;
				case 'back':
					if (detail.currentPage >1)
						me.loadPage(detail.currentPage-1);
				break;
				default:
					if(to>=1 && to<=detail.pageCount)
						me.loadPage(to);
					else {throw "Invalid page";}
				break;
			}
		}
	} 
	loadPage(page){
		let me=this;
		page=page<=0?1:page;
		me.store.load({	params:{start:((page - 1) * me.store.params.limit)}});
	}
	getSelectedRecords(){
		let me =this;		
		return me.selectedRow==null?null:me.store.data[me.selectedRow];
	}
	addRow(curRecord={}){
		let me=this;
		let row_element = $("<tr>");
		for (let indexCol = 0; indexCol < me.s.columns.length; indexCol++){
			let editor 		= me.editors[indexCol],
				current_col = me.s.columns[indexCol],
				field 		= current_col.dataIndex,
				value 		= curRecord.get(field);

			if(editor){
				editor = editor.isClass ? editor : IT.Utils.createObject(
					$.extend(true,{},current_col.editor,{
						width:current_col.width
					})
				);
			}

			let render 		= 	
				current_col.data 		|| 
				current_col.renderer 	|| 
				(editor	&& editor.store ?editor.store.getRawData():null) || [],
				html		= IT.Utils.findData(value,render),
				td = $("<td />",{
					html:$("<div />",{html:(html==""?value:html)}),
					valign:current_col.valign ||"top",
					align:current_col.align ||"left",
					class:"" + (me.s.wrap?"wrap":""),
				});
			if(editor && editor.className=="checkbox"){
				td.find("div").empty();
				editor.addEvents({
					onChange:function(){
						curRecord.update(field,editor.checked);
						td[curRecord.isChanged(field)?"addClass":"removeClass"]("it-datatable-changed"); 
					}
				});
				editor.checked = !!value;
				editor.renderTo(td.find("div"));
			}
			td.on('click',function(){
				me.selectedRow 		= td.parent().index();
				me.selectedColumn 	= td.index();
				me.content.find("tbody tr").removeClass('it-datatable-selected');
				td.parent().addClass('it-datatable-selected');
				if(	editor && editor.className!=="checkbox" && 
					current_col.editor.editable && !td.hasClass("it-datatable-editing") &&
					!curRecord.isLocked(field) )
				{
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
			row_element.append(td);
		}
		row_element.on('dblclick', function(e) {
			me.doEvent("onItemDblClick");
		})
		me.content.find("tbody").append(row_element);
	}
	removeRow(indexRow=-1){
		let me=this;
		indexRow = indexRow <0 ? me.selectedRow: indexRow;
		me.content.find("tbody>tr").eq(indexRow).remove();
		me.selectedRow 		= null;
		me.selectedColumn 	= null;
	}
	getAvailableRows(){
		let me=this, max = 27;//default row hight
		me.content.find(".it-datatable-wrapper tbody tr").each(()=>{
			max = Math.max($(this).outerHeight(), max);
		});
		return Math.abs(Math.floor(
			(
				me.content.find("div.it-datatable-wrapper").outerHeight()-
				me.content.find("div.it-datatable-fixed-header").outerHeight()-
				30//default browser scroll height
			)/max)
		);
	}
}