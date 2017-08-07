//*********************** Grid ************************************//
IT.DataTable = function(options){
	var settings = $.extend({
		id: makeid(),
		cls: 'it-grid',
		width: '100%',
		height: 'auto',
		top: 0,
		bottom: 0,
		cellEditing: true,
		sort: "local",
		wrap: false,
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
	}, options);
	
	var me = this;
	var parrent = null;
	var id = settings.id;
	var lastRow = null;

	me.events = new Event(me, settings);

	me.onItemClick=function(act){me.events.add("onItemClick",act);}
	me.onItemDblClick=function(act){me.events.add("onItemDblClick",act);}

	var grid = $('<div />', {
		id: id,
		class: settings.cls
	})
	.width(settings.width)
	.height(settings.height);

	me.data = null;
	me.page = 1;
	me.pageCount = 1;
	me.params = settings.store.params;
	me.selectedRecord = null;
	me.selectedColumn = null;
	me.store = null;

	if (typeof settings.store === 'function'){
		me.store = settings.store;
		me.data = me.store.getData();
	}else{
		me.store = new Store(settings.store);
	}	
	
	me.store.onLoad(function(data, params){
		me.data = data;
		me.params = params;
		me.load();
	});
	
	me.store.onError(function(err){
		alert(err.message);
	});
	
	me.load = function(opt) {
		if (me.data != null) {
			var opt = opt || {};
			grid.find("tbody").empty();

			var total_rows = me.data.total_rows;
			var start = me.params.start;
			var limit = me.params.limit;
			var last_data = (start + limit);
			var jml_data = me.data.rows.length;
			
			lastRow = null;
			last_data = last_data < total_rows ? last_data : total_rows;
			var data_show = total_rows > 0 ? (start + 1) + "/" + last_data : "0";
			var jml_page = Math.ceil(total_rows / limit);
			me.pageCount = jml_page;

			grid.find('.it-grid-pagination-show').html(data_show);
			grid.find('.it-grid-pagination-count').html(total_rows);
			grid.find('.it-grid-pagination-page').html(jml_page);

			if (start == 0) 
				grid.find('.it-grid-pagination-current').val(1);

			for (k=0;k<jml_data;k++){	
				var current_row = me.data.rows[k];
				error_highlight = typeof current_row.errorRow == 'object' && current_row.errorRow.length > 0 ? "style='background:#ffeeee;'" : "";
				error_highlight = typeof current_row.isError != 'undefined' && current_row.isError == true ? "style='background:#ffeeee;'" : error_highlight;
				
				var $rows = "<tr " + error_highlight + ">";
				for (i = 0; i < settings.columns.length; i++){
					$data = current_row[settings.columns[i].dataIndex];
					$data = typeof $data == 'undefined' ? "" : $data;
					$data = typeof $data == 'null' ? "" : $data;
					$data = $data == null ? "" : $data;
					
					var comboData = null;
					var $value = "";
					var current_col = settings.columns[i];
					var editor = typeof current_col.editor != 'undefined' ? current_col.editor : null;
					var dataIndex = settings.columns[i].dataIndex;

					if ((editor != null && editor.xtype == 'combo') || typeof current_col.data != 'undefined') {
						$value = " value='" + $data + "'";
						comboData = typeof current_col.data != 'undefined' ? current_col.data : settings.columns[i].editor.data;
						arrayIndex = null;
						for (z = 0; z < comboData.length; z++){
							if (comboData[z]['key'] == $data){
								arrayIndex = z;
								break;
							}
						}
						$data = arrayIndex != null ? comboData[arrayIndex]['value'] : "";
						$data = $data != "" && editor != null && typeof editor.format != 'undefined' ? editor.format.format(comboData[arrayIndex].key, comboData[arrayIndex].value) : $data;
					}

					if (editor != null && editor.xtype == 'check') {
						$value = " value='1' ";
						$checked = $data == 1 || $data == "Y" ? "checked" : "";
						$data = " <input name='" + dataIndex + "[]' class='" + dataIndex + "' type='checkbox' " + $value + $checked + ">";
					}

					var $cssDiv = "";
					var $cssTD = "";

					$cssTD += current_row.errorRow == 'object' && current_row.errorRow.length > 0 && jQuery.inArray(dataIndex, current_row.errorRow) >= 0 ? "class='it-grid-error'" : "";
					
					// Style TD
					var $width = typeof current_col.width != 'undefined' ? current_col.width : 0;
					if ($width > 0) $cssDiv += "width:"+$width+"px;";

					var $align = typeof current_col.align != 'undefined' ? current_col.align : "";
					if ($align != "") {
						$cssDiv += "text-align:"+$align+";";
						$cssTD += " align='" + $align + "' ";
					}

					$cssDiv = $cssDiv != "" ? " style='" + $cssDiv + "' " : "";
					if (settings.wrap) {
						$cssDiv = $cssDiv + " class='wrap' ";
						$data = ("" + $data).replace(/\n/g, "<br/>");
					}
					
					var $img = typeof current_col.image != 'undefined' ? current_col.image : "";
					if ($img == true) $data = "<img src='" + $data + "' " + $cssTD + ">";

					$valign = typeof current_col.valign != 'undefined' ? current_col.valign : "top";
					$rows += "<td valign='"+$valign +"' " + $cssTD + "><div"+ $value + $cssDiv +">" + $data + "</div></td>";
				}
				grid.find("tbody").append($rows + "</tr>");
			}

			grid.find("td").click(function(){
				var $rowIndex = $(this).parent().index();
				var $index = $(this).index();
				me.selectedRecord = $rowIndex;
				me.selectedColumn = $index;
				var editor=settings.columns[$index].editor||null;
				var locked=me.store.storeData.rows[$rowIndex].locked||false;
				if(editor && locked==false){
					editor.editable=(typeof editor.editable=='undefined')?true:editor.editable;
					if(editor.editable)setEditable(this);
				}
				grid.find("tr").removeClass('it-grid-selected');
				$(this).parent().addClass('it-grid-selected');

				if (me.getSelectedRow() != lastRow) {
					me.events.fire("onItemClick",[me.getRecord(me.getSelectedRow())]);
					lastRow = me.getSelectedRow();
				}
			});
			grid.find("td").dblclick(function(){
				me.events.fire("onItemDblClick",[me.getRecord(me.getSelectedRow())]);
			});
		}
	}
	
	me.showError = function(err){
		var arError = [];
		for (var er = 0; er < err.length; er++){
			grid.find("tbody tr:eq(" + err[er].indexRow + ")").css("background", "#ffcece");
			arError.push(err[er].indexRow);
		}

		for (var dc = 0; dc < me.store.dataChanged.length; dc++){
			if (arError.indexOf(me.store.dataChanged[dc].indexRow.toString()) == -1){
				grid.find("tbody tr:eq(" + me.store.dataChanged[dc].indexRow + ")").find("td").removeClass("it-grid-changed");
				me.store.dataChanged.slice(dc);
			}
		}
	}
	me.loadPage = function(page){
		if (me.data != null){	
			$start = (page - 1) * me.params.limit;
			grid.find('.it-grid-pagination-current').val(page);
			me.page = page;
			me.store.load({params:{start:$start, limit:me.params.limit}});
		}
	}
	
	var tabEdit = function(e, o){
		indexColumn = o.parent().parent().index();
		jmlColumn = o.parent().parent().parent().find("td").length;
		
		jmlRow = me.data.rows.length;
		idxRow = me.selectedRecord;
		if (e.keyCode == 9 && !e.shiftKey && indexColumn + 1 < jmlColumn){
			e.preventDefault();
			next = o.parent().parent().parent().find("td:eq(" + (indexColumn + 1) + ")");
			o.blur();
			next.click();
		}
		if(e.keyCode == 9 && e.shiftKey && indexColumn - 1 >= 0){
			e.preventDefault();
			next = o.parent().parent().parent().find("td:eq(" + (indexColumn - 1) + ")");
			o.blur();
			next.click();
		}

		if (e.keyCode == 38 && idxRow - 1 >= 0){
			e.preventDefault();
			next = o.parent().parent().parent().parent().find("tr:eq(" + (idxRow - 1) + ")").find("td:eq(" + (indexColumn) + ")");
			o.blur();
			next.click();
		}
		if (e.keyCode == 40 && idxRow + 1 < jmlRow){
			e.preventDefault();
			next = o.parent().parent().parent().parent().find("tr:eq(" + (idxRow + 1) + ")").find("td:eq(" + (indexColumn) + ")");
			o.blur();
			next.click();
		}	
	}

	var setEditable = function(Cell){
		if (!$(Cell).hasClass('it-grid-editing')){
			$(Cell).addClass('it-grid-editing');
			var $CellContent = $(Cell).find("div");
			if (typeof settings.columns[me.selectedColumn].editor == 'function'){
			}else{
				var $editor = settings.columns[me.selectedColumn].editor;
				var $width = typeof settings.columns[me.selectedColumn].width != 'undefined' ? settings.columns[me.selectedColumn].width : 0;
				var $editorType = typeof $editor.xtype != 'undefined' ? $editor.xtype : 'text';
				var $editorWrap = typeof $editor.wrap != 'undefined' ? $editor.wrap : false;
				
				if ($editorType == "check") $(Cell).removeClass('it-grid-editing');

				var $cssWidth = "";
				if ($width > 0) $cssWidth = " style='width:"+ ($width) +"px' ";
				
				$(Cell).removeClass('it-grid-changed');
				$xType = $editorType;
				$editorType = $editorType == "password" || $editorType == "file" ? "text" : $editorType;

				switch ($editorType){
					case "check":
						value = $CellContent.find("input").is(":checked") == true ? "1" : "0";
						changed = me.store.cekData(me.selectedRecord, settings.columns[me.selectedColumn].dataIndex, value);

						if (changed){
							$(Cell).addClass('it-grid-changed');
						}
					break;
					case "text":
						if ($editorWrap) {
							cHeight = $CellContent.outerHeight();
							var $html = ("" + $CellContent.html()).replace(/\n/g, "").replace(/<br\s*[\/]?>/gi, "\n");
							$CellContent.html("<textarea class='it-grid-form' "+$cssWidth+">" + $html + "</textarea>");
							$CellContent.find(".it-grid-form").autosize();
							$CellContent.find(".it-grid-form").height(cHeight);
						}else {
							$CellContent.html("<input class='it-grid-form' type='"+$xType+"' "+$cssWidth+" value=\"" + $CellContent.html().trim() + "\">");
						}
						
						if (typeof $editor.maxlength != 'undefined'){$CellContent.find("input").attr("maxlength", $editor.maxlength);}
						$CellContent.find(".it-grid-form").focus();
						$CellContent.find(".it-grid-form").val($CellContent.find(".it-grid-form").val());
						$CellContent.find(".it-grid-form").blur(function(){
							value = $(this).val();
							if ($editorWrap) value = ("" + value).replace(/\n/g, "<br/>");

							
							changed = me.store.cekData(me.selectedRecord, settings.columns[me.selectedColumn].dataIndex, value);
							if (changed){
								$(Cell).addClass('it-grid-changed');
							}
							$CellContent.html(value);
							if ($xType == "password") $CellContent.html("");
							$(Cell).removeClass('it-grid-editing');
						});
						$CellContent.find("input").keypress(function(e){
							if (e.which == 13){$(this).blur();}
							tabEdit(e, $(this));
						});

						if (typeof $editor.type != 'undefined' && $editor.type == 'numeric') {
							var tmpAngka = "";
							$CellContent.find(".it-grid-form").keyup(function(e){
								var cek = true;
								cek = typeof $editor.min != 'undefined' && $(this).val() < $editor.min ? false : cek;
								cek = typeof $editor.max != 'undefined' && $(this).val() > $editor.max ? false : cek;
								if (($.isNumeric($(this).val()) == false || !cek) && !empty($(this).val())){
									$(this).val(tmpAngka);
								}else{
									tmpAngka = $(this).val();
								}
							});
						}
					break;
					case "date":
						$CellContent.html("<input class='it-grid-form' "+$cssWidth+" type='text' value=\"" + $CellContent.html() + "\">");
						changeDate = false;
						$dateFormat = typeof $editor.format != 'undefined' ? $editor.format : 'dd-mm-yy';
						$CellContent.find("input").datepicker({
							dateFormat: $dateFormat,
							changeMonth: true,
							changeYear: true,
							onClose:function(a, b){
								$CellContent.find("input").focus();
								changeDate = true;
							}
						});
						$CellContent.find("input").focus();
						$CellContent.find("input").blur(function(){
							if (changeDate){
								value = $(this).val();
							
								changed = me.store.cekData(me.selectedRecord, settings.columns[me.selectedColumn].dataIndex, value);
								if (changed){
									$(Cell).addClass('it-grid-changed');
								}
								$CellContent.html(value);
								$(Cell).removeClass('it-grid-editing');
							}
						});
					break;
					case "combo":
						comboOpt = "<option value=''>";
						for (i = 0; i < $editor.data.length; i++)
						{
							$optValue = typeof $editor.format != 'undefined' ? $editor.format.format($editor.data[i].key, $editor.data[i].value) : $editor.data[i]["value"];
							comboOpt += "<option value='" + $editor.data[i]["key"] + "'>" + $optValue;
						}
						$CellContent.html("<select class='it-grid-form' "+$cssWidth+">" + comboOpt + "</select>");
						$CellContent.find("select").focus();
						$CellContent.find("select").val($CellContent.attr("value"));//make cursor at the end
						$CellContent.find("select").blur(function(){
							value = $(this).val();
							
							changed = me.store.cekData(me.selectedRecord, settings.columns[me.selectedColumn].dataIndex, value);
							if (changed){
								$(Cell).addClass('it-grid-changed');
								$CellContent.attr("value", value);
							}
							$CellContent.html($(this).find("option:selected").text());
							$(Cell).removeClass('it-grid-editing');
						});
						$CellContent.find("select").keypress(function(e){
							if (e.which == 13){$(this).blur();}
							tabEdit(e, $(this));
						});
					break;
				}
			}
		}
	}

	var setPage = function(act) {
		if (me.data != null){
			$lastPage = Math.ceil(me.data.total_rows / me.params.limit);
			
			switch(act){
				case 'first':
					if (me.page != 1) me.loadPage(1);
				break;
				case 'last':
					if (me.page != $lastPage) me.loadPage($lastPage);
				break;
				case 'next':
					if (me.page < $lastPage) me.loadPage(me.page + 1);
				break;
				case 'back':
					if (me.page > 1) me.loadPage(me.page - 1);
				break;
			}
			
		}
	}

	me.getSelectedRow = function(){
		return me.selectedRecord;
	}
	me.getRecord = function(rec){
		if (me.data != null){
			return me.data.rows[rec];
		}else{
			return null;
			alert('Data Tidak Ditemukan');
		}
	}

	me.addRow = function() {
		var newRows = $('<tr/>');
		$.each(settings.columns, function(k, v) {
			let value = me.store.storeData.rows[me.store.storeData.rows.length - 1][v.dataIndex];
			let editor = v.editor;
			let align = typeof v.align !== 'undefined' ? v.align : '';
			value = typeof value !== 'undefined' ? value : '';
			value = typeof editor !== 'undefined' && editor.xtype == 'check' ? " <input name='" + v.dataIndex + "[]' class='" + v.dataIndex + "' type='checkbox' value='1' checked>" : value;
			newRows.append($(`
				<td valign="top" align="${align}">
					<div `+(settings.wrap ? 'class="wrap"' : "")+`>
						${value}
					</div>
				</td>`)
			);
		});
		
		grid.find("tbody").append(newRows);
		grid.find("td").click(function() {
			var editable = true;
			var $rowIndex = $(this).parent().index();
			var $index = $(this).index();

			me.selectedRecord = $rowIndex;
			me.selectedColumn = $index;
			if (typeof settings.columns[$index].editor !== 'undefined' 
				&& settings.cellEditing && editable != false)
				setEditable(this);
			
			grid.find("tr").removeClass('it-grid-selected');
			$(this).parent().addClass('it-grid-selected');

			if (me.getSelectedRow() != lastRow) {
				me.events.add("onItemClick", [me.getRecord(me.getSelectedRow())]);
				lastRow = me.getSelectedRow();
			}
		});
		grid.find("tbody tr:last-child td:first-child").click();
	}

	var createGrid = function(){
		var $header = "";
		var $tr = "";
		for (i = 0; i < settings.columns.length; i++){
			var col_width = "";
			var width = "";
			var current_col = settings.columns[i];
			var sort = typeof current_col.sort != 'undefined' ? current_col.sort : true;
			if (typeof current_col.width != 'undefined'){
				col_width = "<img src='data:image/gif;base64,R0lGODlhAQABAJEAAAAAAP///////wAAACH5BAEHAAIALAAAAAABAAEAAAICVAEAOw==' width='" + (current_col.width-24) + "' height='1'>";
				width = "width='" + current_col.width + "'";
			}
			
			text_header = current_col.header;
			text_header = sort == true ? "<a href='javascript:void(0)' class='it-grid-sort' value='" + current_col.dataIndex + "' asc='Y'>" + text_header + "</a>" : text_header;
			
			$header += "<th " + width + ">" + col_width + current_col.header + "</th>";
		}
		//grid.height(settings.height);

		if (typeof settings.customHeader !== 'undefined'){
			$header = settings.customHeader;
		}

		grid.append("<div class='it-grid-wrapper'><table border='1' width='"+settings.width+"'><thead>" + $header + $tr + "</thead><tbody></tbody></table></div>");
		grid.append("<div class='it-grid-fixed-header'><table border='1' width='"+settings.width+"'><thead>" + $header + $tr + "</thead></table></div>");
		
		if (typeof settings.customHeader !== 'undefined'){
			grid.find('thead').find('th').each(function(){
				width = $(this).attr('width');
				width = typeof width == 'undefined' ? 40 : width;
				$(this).css('text-align', 'center');
				$(this).css('width', width);
				$(this).prepend("<img src='data:image/gif;base64,R0lGODlhAQABAJEAAAAAAP///////wAAACH5BAEHAAIALAAAAAABAAEAAAICVAEAOw=='  width='" + (width-24) + "' height='1'>");
			});
		}

		if (settings.paging) {
			grid.append(`
				<div class="it-grid-pagination">
					<ul>
						<li><button class="it-grid-icon" rel="first"><span class="fa fa-step-backward"></span></button></li>
						<li><button class="it-grid-icon" rel="back"><span class="fa fa-chevron-left"></span></button></li>
						<li> 
							<input type="text" class="it-grid-pagination-current" value="1"> 
						 	<span class="it-grid-pagination-page"></span>
						</li>
						<li><button class="it-grid-icon" rel="next"><span class="fa fa-chevron-right"></span></button></li>
						<li><button class="it-grid-icon" rel="last"><span class="fa fa-step-forward"></span></button></li>
						<li>
							<span>Menampilkan</span>
							<span class='it-grid-pagination-show'></span> 
							<span>dari</span> 
							<span class='it-grid-pagination-count'></span> 
							<span>Data</span>
						</li>
					</ul>
					<div class='it-grid-pagination-info'></div>
				</div>
			`);
		}
		
		grid.find('.it-grid-pagination a').click(function(){
			var aPage = this; 
			if (me.store.dataChanged.length > 0 && !me.store.isSaved){
				var msg = MessageBox({
					type:'tanya',
					width:'400',
					title:'Konfirmasi',
					message:'Data Berubah Belum di Save, Lanjutkan ?',
					buttons:[{
						text:'Ya',
						handler:function(){
							me.store.dataChanged = [];
							setPage($(aPage).attr('rel'));
						}
					}, {
						text:'Tidak',
						handler:function(){
							msg.hide();
						}
					}]
				});
			} else {
				setPage($(aPage).attr('rel'));
			}
		});
		
		grid.find('.it-grid-pagination-current').keypress(function(e){
			if (e.which == 13){
				var value = $(this).val().replace(/^\s\s*/, '').replace(/\s\s*$/, '');
				var intRegex = /^\d+$/;
				var isNumber = true;
				if(!intRegex.test(value)) {
					alert('Harus Angka');
					isNumber = false;
				}
				if (isNumber){
					me.loadPage($(this).val());
				}
			}
		});

		me.store.completeLoad(function(a){
			
			for (var ix = 0; ix < settings.columns.length; ix++){
				var sort = typeof settings.columns[ix].sort != 'undefined' ? settings.columns[ix].sort : true;

				if (sort == true){
					var $obj = grid.find('.it-grid-wrapper').find('thead').find('th:eq('+ix+')');
					var $obj2 = grid.find('.it-grid-fixed-header').find('thead').find('th:eq('+ix+')');

					checkHeader($obj);
					checkHeader($obj2);
				}
			}

			function checkHeader(obj){
				if(obj.find("a").length <= 0){
					var imgWidth = obj.find("img").attr("width");
					obj.find("img").remove();
					var textTH = obj.html();
					textTH = "<a href='javascript:void(0)' class='it-grid-sort' value='" + settings.columns[ix].dataIndex + "' asc='Y'>" + textTH + "</a>";
					obj.html("");
					obj.append("<img src='data:image/gif;base64,R0lGODlhAQABAJEAAAAAAP///////wAAACH5BAEHAAIALAAAAAABAAEAAAICVAEAOw=='  width='" + imgWidth + "' height='1'>");
					obj.append(textTH);
				}
			}
			
			grid.find('.it-grid-sort').unbind('click');
			grid.find('.it-grid-sort').click(function(){
				if (settings.sort == "local"){
					me.store.sort($(this).attr('value'), $(this).attr('asc'));
				}else{
					var params = $.extend(me.params, {sort:$(this).attr('value'), asc:($(this).attr('asc') == "Y" ? "ASC" : "DESC")});
					me.store.load({params: params});
				}
				
				var sorted = "it-sort-asc";
				
				if ($(this).attr("asc") == "Y"){
					$(this).attr("asc", "N");
				}else{
					var sorted = "it-sort-desc";
					$(this).attr("asc", "Y");
				}

				grid.find('.it-grid-sort').removeClass("it-sort-asc");
				grid.find('.it-grid-sort').removeClass("it-sort-desc");

				$(this).addClass(sorted);
			});
		});
	}
	
	me.getEditedRecords = function(){
		return me.store.dataChanged;
	}
	
	me.setInfo = function(info){
		grid.find('.it-grid-pagination-info').html(info);
	}

	me.getSetting = function() { 
		return settings; 
	}

	me.setEditorData = function(field, data) {
		$.each(settings.column, function(k, v) {
			if(v.dataIndex == field) {
				v.editor.data = data;
			}
		});
	}

	me.renderTo = function(obj) {
		createGrid();

		grid.css({
			top: settings.top,
			bottom: settings.bottom
		});

		grid.find('.it-grid-wrapper').scroll(function(){
			grid.find('.it-grid-fixed-header').scrollLeft($(this).scrollLeft());
		});

		grid.appendTo(obj);
		parrent = obj;
	}

	return me;
}