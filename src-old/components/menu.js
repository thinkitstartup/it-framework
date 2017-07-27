function Menu(params){
	var settings=$.extend({
		text:'',
		direction:'tengah',
		iconCls:'',
		disabled:false,
		items:[]
	},params);

	var me=this;
	var parrent=null;
	var id=makeid();
	var items=settings.items;
	
	var clsDisabled = settings.disabled ? "disabled" : "";
	var icon=settings.iconCls!=''?'<span class="fa fa-'+settings.iconCls+'"></span>':'';		
	var konten='<a href="#@" id="'+id+'" '+getStyle(settings)+' class="it-btn '+clsDisabled+'">'+icon+' '+settings.text+'</a><span class="tooDir" style="display:none"></span><ul data-arah="'+settings.direction+'"></ul>';
	var $konten=$(konten);
	for (var i=0;i<items.length;i++){
		if (items[i] === null)continue;
		var li='<li></li>';
		li=$(li);

		if (typeof items[i].renderTo == 'function'){
			items[i].renderTo(li);
		}else if(typeof items[i] == 'object'){
			item=createObject(items[i]);
			item.renderTo(li);
		}
		$konten.eq(2).append(li);
	}

	me.renderTo=function(obj){
		$konten.appendTo(obj);
		parrent=obj;

		parrent.click(function(e){
			var $this = $(this);
			var me_child=$this.children('ul');
			var me_data=(typeof me_child.data('arah') != 'undefined' ? me_child.data('arah') : 'tengah');
			var me_dir=$this.children('.tooDir');
				
			if(!me_child.is(':visible')) {
				$('.it-toolbar div ul').hide();
				$('.it-toolbar div a').removeClass('active');
				$('.it-toolbar div .tooDir').hide();			
			}		
			
			if(me_child.length > 0) {
				me_a=me_child.parent().children('a').outerWidth();
				me_b=me_child.outerWidth();
				me_c=me_dir.outerWidth();
				
				if(me_data == 'tengah') {
					me_child.css('left', (me_a - me_b) / 2);
				}else if(me_data == "kanan") {
					me_child.css({'left':'auto','right':'5px'});
				}
				
				me_dir.css('left', (me_a - me_c) / 2);
				me_child.toggle();
				me_dir.toggle();
				$(this).children('a').toggleClass('active');
			}
			e.stopPropagation();
		});	

		$(document).click(function(){
			$('.it-toolbar div ul').hide();
			$('.it-toolbar div a').removeClass('active');
			$('.it-toolbar div .tooDir').hide();
		});
	}
	me.getSetting=function(){ return settings; }
	me.getId=function(){ return id; }
	return me;
}