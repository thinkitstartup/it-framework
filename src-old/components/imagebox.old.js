function ImageBox(params){
		var settings=$.extend({
			URL : '',
			params : {},
			aspectRatio: true,
			scaleWidth:100,
			fotoBox:false, 
			src:''
		},params);
		
		var me=this;
		var parrent=null;

		me.events=new Event(me, settings);
		me.onComplete=function(act){me.events.add("onComplete",act);}

		var id=settings.id || makeid();
		var imageData = { x1:0, y1:0, x2:0, y2:0, img:'', imgWidth:0, imgHeight:0, divWidth:0, divHeight:0, w:0, h:0 }
		var clsFotoBox = settings.fotoBox == true ? "it-fotobox" : "";
		settings.src = settings.src == '' ? base_url + 'resources/framework/css/images/no-photo.jpg' : settings.src;
		disabled = settings.disabled > 0 ? ' disabled ' : '';
		var konten = '\
			<div id="'+id+'" class="it-imagebox '+clsFotoBox+'" '+getStyle(settings)+'>\
				<div><img src="'+settings.src+'" width="100" height="100" border="0" alt="Foto"></div>\
				<a href="#"><span class="fa fa-picture-o"></span> Sunting Foto<input type="file" name="img'+id+'" size="2"></a>\
			<div>';
			var $konten=$(konten);
		settings.params = $.extend({inputID: 'img' + id}, settings.params);
		$konten.find('input').ajaxFileUpload({
			'action': settings.URL,
			'params': settings.params,
			'onComplete': function(response) {
				var res = response;
				
				var cropHeight = settings.fotoBox == true ? Math.ceil((res.cropSize * 120) / 100) : res.cropSize;
				var cropper = "\
					<table width='100%'>\
					<tr>\
						<td valign='top'>\
						<div style='position:relative;width:"+res.divWidth+"px;height:"+res.divHeight+"px' id='croparea'>\
							<img src='"+res.Img+"' style='float: left; margin-right: 10px;max-width:400px;max-height:400px;' id='thumbnail' alt='Buat Thumbnail'/>\
							<div id='cropper' style='width:"+res.cropSize+"px;height:"+cropHeight+"px;border:1px solid black;background:#fff;opacity:0.3;'></div>\
						</div>\
						</td>\
					</tr>\
					</table>\
				";
				
				$cropper = $(cropper);

				imageData.imgWidth = res.imageWidth;
				imageData.imgHeight = res.imageHeight;
				imageData.divWidth = res.divWidth;
				imageData.divHeight = res.divHeight;
				imageData.img = res.Img;
				imageData.x2 = res.cropSize;
				imageData.y2 = cropHeight;
				imageData.w = res.cropSize;
				imageData.h = cropHeight;

				if (settings.aspectRatio){
					$cropper.find('#cropper').resizable({
						aspectRatio : res.cropSize/cropHeight,
						containment: "#croparea",
						resize: function (e, ui){
							set($(this));
						},
						stop: function (e, ui){
						}
					}); 
				}else{
					$cropper.find('#cropper').resizable({
						containment: "#croparea",
						resize: function (e, ui){
							set($(this));
						},
						stop: function (e, ui){
						}
					}); 
				}
				$cropper.find('#cropper').draggable({
					containment: "#croparea",
					drag: function (e, ui){
						set($(this));
					}
				}); 

				var  dialog = new Dialog({
					iconCls:'crop',
					title:'Potong',
					width:res.divWidth,
					height:res.divHeight + 65,
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
								scaleWidth = settings.scaleWidth == 0 ? imageData.w : settings.scaleWidth;
								imageData.scaleWidth = scaleWidth;
								$.ajax({
									type: 'POST',
									url: settings.URL,
									data: imageData,
									success: function(data){
										$konten.find("img").attr("src", data.Img);

										me.events.fire("onComplete",[data.Img]);
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
			}
		});
		
		var set = function(data){
			imageData.x1 = data.position().left;
			imageData.y1 = data.position().top;
			imageData.x2 = data.position().left + data.width();
			imageData.y2 = data.position().top + data.height();
			imageData.w  = data.width();
			imageData.h  = data.height();
		}
		me.setImage=function(img){
			if (img != ''){
				$konten.find('img').attr('src', img);
			}else{
				$konten.find('img').attr('src', base_url + 'resources/framework/css/images/no-photo.jpg');
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