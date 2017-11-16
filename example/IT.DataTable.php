<!DOCTYPE html>
<html lang="en">
<head>
	<title>IT Framework</title>
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

    <style type="text/css">
    	body{
			line-height: 100%;
			font-family: Aller;
			font-size: 13px;
			font-weight: normal;
			-webkit-font-smoothing: antialiased;
    	}
    </style>
</head>
<body>
	<center>Render as HTML</center>
	<div 
		id="mainRender"
		style="border: solid 1px black;width: 800px;height: 500px;margin: 20px auto auto;padding: 20px"
	>
	</div>
	<center>
		<button id='test'>GetSelected</button>
	</center>
	<script type="text/javascript" defer>
		$(function(){
			var config = {
				x:"datatable",
				paging:true,
				height:450,
				//wrap:true,
				columns:[{
					header: "Nama Lengkap", 
					dataIndex:"nama", 
					width: 399,
					editor:{
						x:'text',
						editable:true,
						allowBlank:false
					}
				},{
					header: "b", 
					dataIndex:"sex", 
					width: 40,
					align:"center"
				},{	
					header: "", 
					dataIndex:""
				}],
				store: {
					type: 'json',
					url: "data.json",
					autoLoad:false,
					params:{
						start:0,
						limit:20
					}
				},
				// onItemDblClick:function(){
				// 	onedit()
				// }
			};


			//render to html
			var obj = new IT.DataTable(config);
			obj.renderTo($("#mainRender"));
			
			setTimeout(function(){
				obj.store.load();
				setTimeout(function(){
					console.info(obj.getSelectedRecords());
					setTimeout(function(){
						//obj.store.empty();
					},1000);
				},3000);
			},1000);

			

			//as item of dialog
			if(false)
			var dialog = new IT.Dialog({
				title: 'TEST',
				width: 800,
				autoHeight:true,
				height: 200,
				//css: {padding: 10},
				items:[{
					x:"toolbar",
					items:[{
						x:"button",
						align:"right",
						text:"Close",
						handler:function(){
							dialog.close();
						}
					}]
				},config]
			});
		});
	</script>
</body>
</html>