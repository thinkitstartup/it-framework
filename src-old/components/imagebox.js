function ImageBox(params){
	var settings = $.extend({
		URL : '',
		params : {},
		imageSize:[400, 400],
		boxImageSize:[100, 100],
		resultImageSize:[400, 400],
		src:''
	},params);
	
	var me=this;
	var parrent=null;

	me.events=new Event(me, settings);
	me.onComplete=function(act){me.events.add("onComplete",act);}

	var id = settings.id || makeid();
	var imageSrc = settings.src == '' ? base_url + 'resources/framework/css/images/no-photo.jpg' : settings.src;
	var disabled = settings.disabled > 0 ? ' disabled ' : '';
	var konten = `
		<div id="${id}" class="it-imagebox">
			<div class="it-imagebox-content"> <img src="${imageSrc}"/> </div>
			<a href="javascript:void(0);">
				<span class="fa fa-picture-o"></span> Sunting Foto <input type="file" name="img${id}" accept="image/*" size="2"/>
			</a>
		</div>
	`;

	var $konten=$(konten);
	$konten
		.width(settings.boxImageSize[0])
		.height(settings.boxImageSize[1]);

	settings.params = $.extend({ inputID: 'img' + id }, settings.params);
	$konten.find('input').ajaxFileUpload({
		action: settings.URL,
		params: settings.params,
		onComplete: function(response) {
			if(response.success) {	
				var cropper = `
					<div id="image-editor" class="image-editor">
						<div class="cropit-preview"></div>
						<div class="image-size-label"> Perbesar / Perkecil Gambar </div>
						<input type="range" class="cropit-image-zoom-input"/>
						<input type="hidden" name="image-data" class="hidden-image-data" />
					</div>
				`;
				$cropper = $(cropper);
				var dialog = new Dialog({
					iconCls:'crop',
					title:'Potong',
					width:settings.imageSize[0],
					height:settings.imageSize[1] + 130,
					padding:10,
					items:[{
						xtype:'html',
						konten:$cropper
					}, {
						xtype:'toolbar',
						position:'bottom',	
						items:[{
							xtype:'button',
							iconCls:'crop',
							text:'Crop',
							align:'kanan',
							handler:function(){	
								var image = $('.image-editor').cropit(
									'export', {
										type: 'image/png',
										quality: .9,
										originalSize: true
									}
								);

								$.ajax({
									type: 'POST',
									url: settings.URL,
									data: {
										image : image,
										imageOld: response.image_name,
										width:settings.resultImageSize[0],
										height:settings.resultImageSize[1]
									},
									success: function(data){
										$konten
											.find("img")
											.width(settings.boxImageSize[0])
											.height(settings.boxImageSize[1])
											.attr("src", data.img);
										me.events.fire("onComplete",[data.img]);
										dialog.close();
										dialog = null;
										
									},
									dataType: "json"
								});
							}
						}, {
							xtype:'button',
							iconCls:'times',
							text:'Tutup',
							align:'kanan',
							handler:function(){
								dialog.close();
								dialog = null;
							}
						}]
					}]
				});
				
				dialog.afterShow(function(){
					$('#image-editor').cropit({ 
						imageState:{src:response.image},
						width:settings.imageSize[0],
						height:settings.imageSize[1],
						smallImage:'allow',
						minZoom:'stretch',
						onImageError:function(e) {
							alert(e.message);
						}				
					});

					$('#image-editor').find('.cropit-preview')
						.width(settings.imageSize[0])
						.height(settings.imageSize[1]);
				});
			} else {
				new MessageBox({type:'critical',width:'400',title:'Peringatan',message:response.msg});
			}
		}
	});
	
	me.setImage=function(img){
		if (img != ''){
			$konten.find('img')
				.attr('src', img)
				.width(settings.boxImageSize[0])
				.height(settings.boxImageSize[1]);
		}else{
			$konten.find('img')
				.attr('src', base_url + 'resources/framework/css/images/no-photo.jpg')
				.width(settings.boxImageSize[0])
				.height(settings.boxImageSize[1]);
		}
	}

	me.getImage=function(){ return $konten.find('img').attr('src'); }
	me.renderTo=function(obj){
		$konten.appendTo(obj);
		parrent=obj;
	}
	
	me.getSetting=function(){ return settings; }
	me.getId=function(){ return id; }
	return me;
}