IT.MessageBox = class extends IT.Component {
	constructor(settings){
		super(settings);
		let me = this;
		me.settings = $.extend(true,{
			id: '',
			type: 'info',
			title: 'Title Here !',
			message: 'Message Here !',
			width: 450,
			css: {},
			buttons: [],
			btnAlign: 'right',
			autoShow: true,
		}, settings);
		me.id = me.settings.id || IT.Utils.id();

		var html = `
			<div id="${me.id}" class="it-messagebox">
				<div class="it-messagebox-container">
					<div class="it-messagebox-title message-${me.settings.type}">${me.settings.title}</div>
					<div class="it-messagebox-content">
						<div class="it-messagebox-icon">
							<div class="message-icon message-icon-${me.settings.type}"></div>
						</div>
						<div class="it-messagebox-text">
							${me.settings.message}
						</div>
					</div>
					<div class="it-messagebox-btn ${me.settings.btnAlign}"></div>
				</div>
			</div>`;

		me.content = $(html);
		me.content
			.find('.it-messagebox-container')
			.css($.extend(me.settings.css, {
				'max-width': me.settings.width
			}));

		if (me.settings.buttons.length == 0) {
			let btn = new IT.Button({
				text: 'OK',
				handler: function() {
					me.hide();
				}
			});
			btn.renderTo(me.content.find('.it-messagebox-btn'));
		} else {
			$.each(me.settings.buttons, function(k, el) {
				el = $.extend({ xtype: 'button' }, el);
				if(typeof el.renderTo !== 'function')
					el = IT.Utils.createObject(el);
				el.renderTo(me.content.find('.it-messagebox-btn'));
			});
		}

		me.content.appendTo('body').hide();

		if(me.settings.autoShow) 
			me.show(); 
	}

	show() {
		let me = this;
		$('input, select, textarea').blur();
		
		me.content.show(0, function(){
			$(this).addClass('message-show');
			$(this).find('.it-messagebox-container')
				.addClass('message-show');
		});
	}

	hide() {
		let me = this;
		me.content
			.find('.it-messagebox-container')
			.removeClass('message-show')
			.one(transitionEnd, function(){
				me.content
					.removeClass('message-show')
					.one(transitionEnd, function(){
						setTimeout(() => {
							me.content.remove();	
						}, 300);
					});
		});
	}
	
	close(){
		this.hide();
	}
}