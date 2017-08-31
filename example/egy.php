<!DOCTYPE html>
<html lang="en">
<head>
	<title>IT Framework Play</title>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />

	<!-- Dependecies -->
	<link rel="stylesheet" href="bower_components/font-awesome/css/font-awesome.min.css" />
	<script type="text/javascript" src="bower_components/jquery/dist/jquery.min.js"></script>
	<script type="text/javascript" src="bower_components/inputmask/dist/min/jquery.inputmask.bundle.min.js"></script>
	<script type="text/javascript" src="bower_components/selectize/dist/js/standalone/selectize.min.js"></script>

	<!-- ThinkIT -->
	<link rel="stylesheet" href="../dist/it-framework.min.css?dc=<?php echo time();?>" />
	<script type="text/javascript" src="../src/js/it-framework-all.js?dc=<?php echo time();?>"></script>
    <script type="text/javascript" src="http://localhost:8080/livereload.js"></script>
</head>

<body>

<script type="text/javascript">
	$(function(){
		

		IT.ComponentB = class extends IT.Component {
			constructor(settings){
				super(settings);
				this.listeners = ["onLoad"];
				//Object.assign(this,settings);
			}
			addEvents(option,listen_enable=[]){
				let me=this;
				listen_enable.forEach((a) => me[a]=option[a]||function(){console.info("Function "+ a+" is Empty")});
			}
			doEvents(listener,params,scope=null){
				var me=this;
				if(typeof me[listener]=="function"){
					return me[listener].apply(scope||me,params);
				}
			}
			test(){
				console.info("this is test");
			}
			/*
			onLoad(){
				console.info("ini On Load dari definisi");
			}
			*/
		}
		
		
		IT.Div = class extends IT.ComponentB{
			constructor(settings){
				super(settings);
				let me = this;
				me.addEvents(me.settings,["onLoad"]);
				me.settings = $.extend(true,{
					id: '',
					iconCls: '',
					cancelable: false,
					css:{}
				}, settings);
				me.doEvents("onLoad",[me,"b","c"],window);
			}
		}
		
		let a = new IT.Div({
			onLoad(a,b,c){
				console.info("From a euy on load");
				console.info(a,b,c);
				console.info("this",this);
			}
		});

		console.info(a);
		//a.onLoad();
	});
</script>	
</body>
</html>