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
			cropperSettings: {
				// Find all setting oh cropit website
				smallImage: 'allow'
			},
		}, params);
		me.id = me.settings.id || IT.Utils.id();
		me.imagebox = `
			<div class="it-imagebox">
				<input type="file" class="cropit-image-input hide-this">
				<div class="cropit-preview"></div>
				<div class="hide-this">
					<div class="image-size-label">Zoom</div>
					<input type="range" class="cropit-image-zoom-input">
				</div>
			</div>
		`;
		me.reloadObject();	
	}

	reloadObject() {
		var me = this;	
		me.content = $(me.imagebox);	

		if(me.isCropper()) {
			me.content.find('.hide-this').removeClass('it-hide');
			me.content.cropit($.extend(true, me.settings.cropperSettings));
			me.content.cropit('imageSrc', me.settings.src);
		} else {
			me.content.find('.hide-this').addClass('it-hide');
			me.content.find('.cropit-preview').append($('<img/>', {
				class: "it-imagebox-picture",
				src: me.settings.src
			}));
		}
	}

	renderTo(obj, rerender = false) {
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

	getExport() {
		let result = "This is not cropper.";
		if(this.isCropper()) {
			result = this.content.cropit('export');
		}
		return result;
	}

}