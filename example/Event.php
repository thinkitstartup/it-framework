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
		IT.Div = class extends IT.BaseClass{
			constructor(settings){
				super(settings);
				let me = this;
				me.addEvents(me.settings,["onCreate"]);
				me.settings = $.extend(true,{
					id: ''
				}, settings);
				me.doEvent("onCreate",[me,"b","c"]);
			}
		}
		let b = new IT.Div({
			onCreate(){
				console.info("obj created");
			}
		});


		setTimeout(function(){
			//add event after create
			b.addEvents({
				changeState:function(a,b,c){
					console.info(a);//output event
					console.info(b);//output "one"
					console.info(c);//output "two"
					//console.info(d);//Reference error, d is not defined
				}
			});
			b.addEvents({
				changeState:function(){
					console.info("second handler");
				}
			},["changeState"]);


			//firing event
			b.doEvent("changeState",["one","two","three"]);

		},2000);


	});
</script>	
</body>
</html>