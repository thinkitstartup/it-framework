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
	<script type="text/javascript" src="bower_components/selectize/dist/js/standalone/selectize.js"></script>

	<!-- ThinkIT -->
	<link rel="stylesheet" href="../dist/it-framework.min.css?dc=<?php echo time();?>" />
	<script type="text/javascript" src="../src/js/it-framework-all.js?dc=<?php echo time();?>"></script>
    <script type="text/javascript" src="http://localhost:8080/livereload.js"></script>
</head>
<body>

	<div 
		id="mainRender"
		style="border: solid 1px black; width:100%; max-width: 800px; min-height: 200px; margin: 20px auto auto; padding: 20px"
	></div>
	<div>
		<center>
			<button id='render'>Render to HTML</button>
			<button id='dialog'>As item of dialog</button>
		</center>
	</div>
	<script type="text/javascript" defer>
		$(function(){
			var table = new IT.DataTable({
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
				}
			});

			var select = new IT.Select({
				emptyText:'- Pilih Data -',
				autoLoad:false,
				datasource: {
					type: 'ajax',
					url:"datajson/ref_agama.php"
					// data:[{
					// 	key: 'A',
					// 	value: 'ini A'
					// }, {
					// 	key: 'B',
					// 	value: 'ini B'
					// }, {
					// 	key: 'C`',
					// 	value: 'ini C`'
					// }]
				}
			});

			var container = {
				x:"tabs",
				height: 500,
				autoHeight: false,
				titles: {
					items:[
						"Select",
						"DataTable"
					]
				}, 
				items:[select,table]
			}

			//render to html
			$("#render").click(()=>{
				var obj = IT.Utils.createObject(container);
				obj.renderTo($("#mainRender"));
				obj.setActive(0);

				select.content.css({
					margin: 10
				})

				//table.store.load();
			});

			$('#render').click();

			//as item of dialog
			$("#dialog").click(()=>{
				var dialog = new IT.Dialog({
					title: 'TEST',
					width: 500,
					cancelable: true,
					css: {padding: 10},
					items:[container]
				});
			});

			setTimeout(function(){
				//select.val("A");
				//console.info(select.getSelect().setValue("B"));
				//console.info(select.getSelect().getValue());

				//select.listener.fire("onChange",["satu","dua"]);
				//select.onChange(); // 
				select.getDataSource();
				setTimeout(function(){
					select.getDataSource();
				},2000);
			},2000);
		});
	</script>
</body>
</html>