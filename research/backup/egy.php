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

	<!-- ThinkIT -->
	<link rel="stylesheet" href="../dist/it-framework.min.css?dc=<?php echo time();?>" />
	<script type="text/javascript" src="../dist/test.js?dc=<?php echo time();?>"></script>
</head>

<body>
<center>Render as HTML</center>
	<div 
		id="mainRender"
		style="border: solid 1px black;width: 800px;height: 500px;margin: 20px auto auto;padding: 20px"
	>
	</div>
	<center>
		<button id='AddNew'>AddNew</button>
		<button id='GetChanged'>GetChanged</button>
	</center>
<script type="text/javascript">
	$(function(){
		
			var DataTable = new IT.DataTable({
				x:"datatable",
				paging:true,
				height:450,
				wrap:true,
				flex:true,
				columns:[{
					header: "Cek", 
					dataIndex:"cek", 
					width: 50,
					editor:{
						xtype: "checkbox",
						editable:false,
					}
				},{
					header:'Kode',
					dataIndex:'kd_agama',
					width:120,
					editor:{
						x:'text',
						editable:true
					}
				},{
					header:'Isi',
					dataIndex:'nama',
					width:180,
					editor:{
						x:'text',
						editable:true
					}
				},{
					header:'Mapping',
					dataIndex:'map',
					width:80,
					editor:{
						x:'text',
						editable:true
					}
				},{
					header: "Aktif", 
					dataIndex:"aktif", 
					width: 100,
					editor:{
						x:'select',
						editable:true,
						store: {
							type:"array",
							data:[
								{key:"1",value:"Ya"},
								{key:"0",value:"Tidak"},
							]
						}
					}
				},{
					header:"",
					dataIndex:""
				}],
				store: {
					type: 'json',
					//url: "datajson/biodata_dynamis.php",
					url: "/simpeg/referensi-data/data-umum/agama/data",
					autoLoad:false,
					params:{
						start:0,
						limit:0
					},
					afterLoad:function(){
						if(DataTable.store.data.length>0)
						DataTable.store.data[0].locked.push("nama");
					}
				},
			});
			DataTable.renderTo($("#mainRender"));
			
			setTimeout(function(){
				DataTable.store.load({kola:"ss"});
			},2000);


			$("#GetChanged").click(function(){
				console.info(DataTable.getDataChanged());
			})
			$("#AddNew").click(function(){
				var newRec = new IT.RecordStore({
					cek:"",
					nm_pes:"",
					kd_agama:"",
					sex:""
				});
				DataTable.addRow(newRec);
				DataTable.store.data.push(newRec);
				console.info(DataTable.store);
			});
			
		/*
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
		});*/
	});
</script>	
</body>
</html>