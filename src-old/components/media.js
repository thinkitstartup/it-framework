function Media(params){
	var defaults = {
		title:'Kotak Media',
		items:[],
		addURL:'',
		deleteURL:'',
		btnInsert:true,
		hiddenAlt:false,
		hiddenAlign:false,
		hiddenWidth:true,
		hiddenFalse:true,
		imgWidth:'100px',
		imgHeight:'100px',
		params:{},
		store: {
			type: 'json',
			params:{
				start: 0,
				limit: 20,
				orderBy: '',
				sortBy: ''
			}
		},
		handler:null,
		modal:true
	};

	var me=this;
	var id=makeid();
	var settings=$.extend(defaults, params);

	me.store = null;
	me.params = settings.store.params;
	me.data = null;
	me.selectedImg = null;

	me.events=new Event(me, settings);
	me.onInsert=function(act){me.events.add("onInsert",act);}
	
	if (typeof settings.store == 'function'){
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


	var icon=settings.iconCls!=''?'<span class="fa fa-'+settings.iconCls+'"></span>':'';
	var $dialog=$('\
		<div id="it-media-wrapper">\
			<div id="it-media-head" class="it-title"><span class="fa fa-picture-o"></span> '+settings.title +'<span id="it-media-close" title="Klik Ini Untuk Menutup Kotak Media"><span class="fa fa-times"></span> </div>\
			<div id="it-media-konten"></div>\
			<div id="it-media-konten-preview">\
				<div id="it-media-konten-preview-toggle" >\
					<div id="it-media-info"> <center style="margin-top:100px;"> <div class="galeri-kosong"></div> <br> <span class="fa fa-info"></span> Klik Gambar Untuk Melihat Detail Gambar.</center></div>\
					<div id="it-media-konten-preview-toggle-info" style="display:none">\
						<h2>Detail Gambar</h2>\
						<table width="100%">\
							<tr>\
								<td align="center">\
									<img src="" id="it-prev-img-preview">\
								</td>\
							</tr>\
						</table>\
						<div style="padding-bottom:10px; border-top:1px solid #ddd; margin-top:10px; padding-top:10px;">\
							<table width="100%">\
								<tr>\
									<td width="70">Judul</td>\
									<td><textarea cols="20" class="it-textbox" rows="2" id="it-prev-img-judul"></textarea></td>\
								</tr>\
								<tr class="sub-alt">\
									<td>Alt Text</td>\
									<td><input class="it-textbox" type="text" id="it-prev-img-alt"></td>\
								</tr>\
								<tr>\
									<td valign="top">Deskripsi</td>\
									<td><textarea cols="20" class="it-textbox" rows="5" id="it-prev-img-desc"></textarea></td>\
								</tr>\
								<tr class="sub-align">\
									<td>Align</td>\
									<td><select id="it-prev-img-align"><option value="">None<option value="left">Left<option value="center">Center<option value="Right">Right</select></td>\
								</tr>\
								<tr class="sub-width">\
									<td>Width</td>\
									<td><input class="it-textbox" type="text" id="it-prev-width"> X <input class="it-textbox" type="text" id="it-prev-height"></td>\
								</tr>\
								<tr>\
									<td></td>\
									<td><a href="#" class="it-btn btnGreen" id="it-media-simpan">Simpan</a></td>\
								</tr>\
							</table>\
						</div>\
					</div>\
				</div>\
			</div>\
			<div class="it-toolbar clearfix" id="it-media-bottom">\
				<ul><li><a href="#" class="it-btn btnGreen" style="margin-left:5px;"><span class="fa fa-plus"></span> Tambah</a><input type="file" style="position:absolute; left:0; width:60px; opacity:0;" name="addMedia" id="addMedia"></li>\
				<li><a href="#" class="it-btn" id="it-media-delete"><span class="fa fa-trash-o"></span> Hapus</a></li>\
				' + (settings.btnInsert == true ? '<li><a href="#" class="it-btn" id="it-media-insert"><span class="fa fa-picture-o"></span> Masukan Gambar</a></li>' : '') + 
			'</ul>	</div>\
		</div>');

	var $modal=$('<div id="it-modal-media"></div>');

	if(settings.modal) $modal.fadeIn(200);
	

	me.load = function(){
		
		if(settings.hiddenAlt) $('.sub-alt').remove();
		if(settings.hiddenAlign) $('.sub-align').remove();
		if(settings.hiddenWidth) $('.sub-width').remove();
		if(settings.hiddenHeight) $('.sub-height').remove();
		
		if (typeof me.data.rows != 'undefined'){
			$dialog.find('#it-media-konten').html('');
			for (var i = 0; i < me.data.rows.length; i++){
				if (typeof me.data.rows[i].size != 'undefined'){
					size = me.data.rows[i].size;
					el = size[0] > size[1] ? 'height' : 'width';
				}else{
					el = 'width';
				}
				
				var $konten = $('<div class="it-media-img" style="width:'+settings.imgWidth+';height:'+settings.imgHeight+'"><img style="'+el+':100%" src="'+base_url+me.data.rows[i].url+'" data-id="'+me.data.rows[i].id_media+'" title="'+base_url+me.data.rows[i].url+'" data-description="'+me.data.rows[i].description+'" data-title="'+me.data.rows[i].title+'" data-alt="'+me.data.rows[i].alt+'" data-align="'+me.data.rows[i].align+'" ></div>');
				$dialog.find('#it-media-konten').append($konten);
			}

			$dialog.find('#it-media-konten div').click(function(){
				var idx = $(this).index();
				me.selectedImg = me.data.rows[idx];
				var im = $(this).find("img");
				$dialog.find('#it-media-info').html('');
				$dialog.find('#it-media-konten-preview-toggle-info').fadeIn(300);
				$dialog.find('#it-prev-img-preview').attr('src',im.attr('src'));
				$dialog.find('#it-prev-img-judul').val(im.data('title'));
				$dialog.find('#it-prev-img-desc').val(im.data('description'));
				$dialog.find('#it-prev-img-alt').val(im.data('alt'));	
				$dialog.find('#it-prev-img-align').val(im.data('align'));	
				$dialog.find('#it-media-konten img').parent().removeClass('active');
				im.parent().addClass('active');

			});
	
		}
	}
	
	me.getSetting=function(){ return settings; }
	me.getId=function(){ return id; }
	
	$dialog.find('input[type=file]').ajaxFileUpload({
		'action': settings.addURL,
		'params': settings.params,
		'onComplete': function(response) {
			me.store.load();
			console.info(response);
		}
	});
	
	$dialog.find('#it-media-close').click(function(){
		me.close();
	});

	$dialog.find('#it-media-simpan').click(function(){
		
		var id = $dialog.find('.it-media-img.active').children('img').data('id');
		
		$.ajax({
			type: 'POST',
			url: settings.addURL,
			data: {
				mode:'simpan',
				title:$dialog.find('#it-prev-img-judul').val(),
				alt:$dialog.find('#it-prev-img-alt').val(),
				description:$dialog.find('#it-prev-img-desc').val(),
				align:$dialog.find('#it-prev-img-align').val(),
				id_media:id,
				params:settings.params
			},
			success: function(data){
				me.store.load();
			},
			dataType: 'json'
		});
	});
	
	$dialog.find('#it-media-delete').click(function(){
		$.ajax({
			type: 'POST',
			url: settings.deleteURL,
			data: {
				id_media:me.selectedImg.id_media,
				media_file:me.selectedImg.url
			},
			success: function(data){
				me.store.load();
				$dialog.find('#it-prev-img-preview').attr('src','');
				$dialog.find('#it-prev-img-judul').val('');
				$dialog.find('#it-prev-img-desc').val('');
				$dialog.find('#it-prev-img-alt').val('');	
				$dialog.find('#it-prev-img-align').val('');
			},
			dataType: 'json'
		});
	});
	
	$dialog.find('#it-media-insert').click(function(){
		me.selectedImg.align = $dialog.find('#it-prev-img-align').val();
		me.events.fire("onInsert",[me.selectedImg]);

		me.close();
	});

	me.hide=function() {
		$('#it-media-wrapper').hide();
		$('#it-modal-media').hide();
	}
	me.show=function() {
		$('#it-media-wrapper').show();
		$('#it-modal-media').show();
	}
	me.close=function(){
		me.hide();
		$('#it-media-wrapper').remove();
		$('#it-modal-media').remove();
		me=null;
	}
	
	$('body').append($modal);
	$('body').append($dialog);
	$(window).resize();

	return me;
}		