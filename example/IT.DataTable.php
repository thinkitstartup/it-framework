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
		<button id='GetChanged'>GetChanged</button>
		<button id='Test'>Test Render</button>
	</center>
	<script type="text/javascript" defer>
		$(function(){
			var config = {
				x:"datatable",
				paging:true,
				height:450,
				wrap:true,
				columns:[{
					header: "Cek", 
					dataIndex:"cek", 
					width: 50,
					editor:{
						xtype: "checkbox",
						editable:false,
						onChange:function(a,b,c,d){
							console.info(obj.getSelectedRecords());
							console.info(obj.selectedRow);
							console.info(obj.selectedColumn);
							console.info(obj.store.data[obj.selectedRow]);
							
						}
					}
				},{
					header: "Nama Lengkap", 
					dataIndex:"nm_pes", 
					width: 200,
					editor:{
						x:'text',
						editable:true,
						allowBlank:false
					}
				},{
					header: "Agama", 
					dataIndex:"kd_agama", 
					width: 100,
					editor:{
						x:'select',
						editable:true,
						store: {
							type: 'ajax',
							url:"datajson/ref_agama.php",
							autoLoad:true,
							// type:"array",
							// data:[
							// 	{key:"A",value:"A. Islam"},
							// 	{key:"B",value:"B. Kristen"},
							// 	{key:"C",value:"C. Protestan"},
							// 	{key:"D",value:"D. Hindu"},
							// 	{key:"E",value:"E. Buda"},
							// ]
						}
					}
				},{	
					header: "Jenis Kelamin", 
					dataIndex:"sex",
					width:100,
					data:[ // data added to column, not editor
						{key:"L",value:"Laki - laki"},
						{key:"P",value:"Perempuan"},
					]
				},{	
					header: "", 
					dataIndex:""
				}],
				store: {
					type: 'json',
					url: "datajson/biodata_dynamis.php",
					autoLoad:false,
					params:{
						start:0,
						limit:3
					}
				},
			};


			//render to html
			var obj = new IT.DataTable(config);
			obj.renderTo($("#mainRender"));
			
			setTimeout(function(){
				obj.store.load({kola:"ss"});
			},2000);


			$("#GetChanged").click(function(){
				console.info(obj.getDataChanged());
			})

			$("#Test").click(function(){
				var el = $(".it-datatable-wrapper table tbody tr:eq(1) td:eq(2)");
				el.find("div").html("");
				el.addClass("it-datatable-editing");
				var select = new IT.Select({
					width:95,
					emptyText:'- Pilih Data -',
					autoLoad:true,
					datasource: { 
						type: 'array',
						autoLoad:true,
						data:[
							{key:"L",value:"Laki-Laki"},
							{key:"P",value:"Perempuan"},
						],
					},
					onChange(e,a,val){
						if(val!=""){
							console.info(a.getDisplayValue());
						}
					}
				});
				select.renderTo(el.find("div"));
			});
			
			//console.info($(".it-datatable-wrapper table tbody tr:eq(1) td:eq(2)"));

		});
	</script>
</body>
</html>