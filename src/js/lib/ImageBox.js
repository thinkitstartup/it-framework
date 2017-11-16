/**
 * [ImageBox description]
 * Usage cropit jquery plugins http://scottcheng.github.io/cropit/
 * @type {class}
 * @extends IT.Component
 * @depend IT.Component
 */
IT.ImageBox = class extends IT.Component {
	constructor(params){
		super(params);

		let me = this;
		me.settings = $.extend(true,{
			id: '',
			src: '',
			size: {
				width: 300,
				height: 100
			},
			cropper: false,
			//name:"file", //we don't need input type, use getExport instead
			cropperSettings: {
				// Find all setting on cropit website
				smallImage: 'allow'
			},
		}, params);
		me.id = me.settings.id || IT.Utils.id();
		me.imagebox = `
			<div class="it-imagebox">
				<a href="javascript:void(0);" class="it-imagebox-chooser it-btn btn-primary">
					<span class="fa fa-picture-o"></span> &nbsp; Pilih Sumber Gambar
				</a>
				<input type="file" class="cropit-image-input">
				<div class="cropit-preview"></div>
				<div class="hide-this">
					<div class="image-size-label">Zoom</div>
					<input type="range" class="cropit-image-zoom-input" value="0">
				</div>
			</div>
		`;
		me.reloadObject();	
	}

	reloadObject() {
		var me = this;	
		me.content = $(me.imagebox);	
		me.content.find('.cropit-preview')
			.width(me.settings.size.width)
			.height(me.settings.size.height);

		if(me.isCropper()) {
			me.content.find('.hide-this').removeClass('it-hide');
			me.content.find('.it-imagebox-chooser').click(function(){
				me.content.find('.cropit-image-input').click();
			});
			me.content.cropit($.extend(true, me.settings.cropperSettings));
			if(me.settings.src != "")
				me.content.cropit('imageSrc', me.settings.src);
		} else {
			me.content.find('.it-imagebox-chooser').hide();
			me.content.find('.hide-this').addClass('it-hide');
			me.content.find('.cropit-preview').append($('<img/>', {
				class: "it-imagebox-picture",
				src: me.settings.src 
			}));
		}
	}

	renderTo(obj) {
		super.renderTo(obj);
		this._render = obj;	
	}

	isCropper() {
		return this.settings.cropper;
	}

	setIsCropper(set) {
		let me = this;
		let beforeState = me.settings.cropper;
		me.settings.cropper = set;
		
		if(beforeState != me.settings.cropper) {
			me.content.remove();
			me.reloadObject();
			me.renderTo(me._render);
		}
	}

	setImageSrc(picture) {
		let me = this;
		if(me.isCropper()) me.content.cropit('imageSrc', picture);
		else me.content.find('img').attr('src', picture);
	}
	clearImageSrc(){
		let me = this;
		me.content.find(".cropit-image-input").val();
		me.content.find('.cropit-preview-image').attr('src','');
	}

	/**
	 * Get cropped image
	 * @return {String} data:image/png;base64 string
	 */
	getExport() {
		let result = "This is not cropper.";
		if(this.isCropper()) {
			result = this.content.cropit('export');
		}
		return result;
	}

}