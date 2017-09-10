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
		
		let a = class {
			constructor(){
				this.onReady = false;
				this.doSomething();
			}
			doSomething(){
				let me=this;
				if(me.onReady){
					console.info("ekskusi");
				}else{
					setTimeout(()=>{
						console.info("hold");
						me.doSomething.call(me, arguments);
					},1000)
				}
			}
		}

		let instance = new a();
		$(document).click(function(){
			console.info("clicked");
			instance.onReady = true;
		});
	});
</script>	
</body>
</html>