IT.SimpleEditable =class extends IT.BaseClass{
	constructor(c){
		super();
		let me=this;
		Object.assign(me, c);
		me.createComponent();
	}
	setBreadcums(){
		$("#breadcumbs ul").empty();
		for(let i of this.breadcums)$("#breadcumbs ul").append('<li>'+i+'</li');
	} 
	createColumn(){
		let cols = [];
		this.columns.forEach(([h,di,w,d,e]) => cols.push({
			header: h, 
			dataIndex:di, 
			width: w,
			data:d,
			editor:e
		}));
		return cols;
	}
	createComponent(){
		let me = this;
		me.bar = new IT.ToolBar({
			position:'top',
			items:[(me.allowAdd||false?{
				id:'add',
				text:'Tambah',
				iconCls:'plus',
				xtype:'button',
				handler:function(){me.onAdd();}
			}:null),(me.allowEdit||false?{
				id:'save',
				text:'Simpan',
				iconCls:'save',
				xtype:'button',
				handler:function(){me.onSave();}
			}:null),(me.allowDelete||false? {
				id:'del',
				text:'Hapus',
				iconCls:'trash-o',
				xtype:'button',
				handler:function(){
					//me.onDelete();
					me.onCreateDialog();
				}
			}:null),{ 
                xtype:'select', 
                dataIndex:'id_golongan',
                defaultValue: '01',
                datasource: { 
                    type: 'array', 
                    data:  [
                        {key:'01', value:'Januari'},
                        {key:'02', value:'Februari'},
                        {key:'03', value:'Maret'},
                        {key:'04', value:'April'},
                        {key:'05', value:'Mei'},
                        {key:'06', value:'Juni'},
                        {key:'07', value:'Juli'},
                        {key:'08', value:'Agustus'},
                        {key:'09', value:'September'},
                        {key:'10', value:'Oktober'},
                        {key:'11', value:'November'},
                        {key:'12', value:'Desember'}
                    ],
                }, 
                emptyText:'- Pilih Berdasarkan Golongan - ', 
                onChange:function(){
                    me.onLoadData();
                }
            }]
		});

		me.datatable = new IT.DataTable({
			top: me.bar.getItemCount() ? 62:30,
			paging: me.paging||false,
			columns: me.rawColumns||me.createColumn(),
			store: {
				type: 'json',
				url: me.url.get,
				params:{start:0,limit:20}
			}
		});

		me.panel = new IT.Panel({
			title: me.title,
			iconCls:'gears',
			items: [me.bar, me.datatable]
		});
	}
	getData(){
		this.datatable.store.load();
	}
	onAdd(){
		let row = {},me=this;
		me.columns.forEach(([h,di,w,d,e]) => (di!="")?row[di]="":"");
		me.datatable.store.storeData.rows.push(row);
		me.datatable.addRow();
	}
	onSave(){
		let me = this;
		if (me.datatable.store.dataChanged.length > 0){
			$.ajax({type: 'POST',dataType: 'json',
				url:me.url.save,
				data:{mode: 'update',data: JSON.stringify(me.datatable.store.dataChanged)},
				success: function(a){
					if (a.success){
						new IT.MessageBox({type:'success', width: 400,title:'Informasi',message:a.msg});
						me.getData();
						me.datatable.store.dataChanged = [];
					}else{
						new IT.MessageBox({type:'warning', width: 400,title:'Peringatan',message:a.msg});
						me.datatable.showError(a.error);
					}
				}
			});
		}else new IT.MessageBox({type:'info', width: 400,title:'Peringatan',message:'Maaf, tidak ada data yang di ubah !!'});
	}
	onDelete(){
		let me = this,rec=me.datatable.getRecord(me.datatable.getSelectedRow());
		if (typeof rec != 'undefined'){
			let msg = new IT.MessageBox({
				type:'question',
				title:'Konfirmasi',
				width: 400,
				message:'Yakin akan menghapus data tersebut ?',
				buttons:[{
					text:'Ya',
					handler:function(){
						$.ajax({dataType: 'json',type: 'POST',
							url:me.url.delete,
							data:{ id:rec[me.primary] },
							success: function(a){
								if (a.success == true){
									new IT.MessageBox({type:'success',width:400,title:'Informasi',message:a.msg});
									me.getData();
								} else new IT.MessageBox({type:'critical',width:400,title:'Peringatan',message:a.msg});
							}
						});
						msg.hide();
					}
				}, {
					text:'Tidak',
					handler:function(){msg.hide()}
				}]
			});
		}else new IT.MessageBox({type:'waw',width:400,title:'Peringatan',message:'Silahkan pilih salah satu data ..'});
	}
	show(){
		let me=this;
		$('#adm-content').empty();
		me.panel.renderTo('#adm-content');
		me.setBreadcums();
		me.getData();
	}
	onCreateDialog() {
		var dialog = new IT.Dialog({
			title: 'Ini Dialog Box',
			width: 500,
			css: {
				padding: 10
			},
			items:[{
				xtype: 'grid',
				rowContainer: 'fluid',
				items: [{
					xtype: 'grid',
					type: 'column',
					columnRule: 'col-md-4',
					items:[{
						xtype: 'html',
						content: 'Nama',
					}]
				},{
					xtype: 'grid',
					type: 'column',
					columnRule: 'col-md-8',
					items:[{
						xtype:'textbox'
					}]	
				}]
			}, {
				xtype: 'grid',
				rowContainer: 'fluid',
				items: [{
					xtype: 'grid',
					type: 'column',
					columnRule: 'col-md-4',
					items:[{
						xtype: 'html',
						content: 'Nama',
					}]
				},{
					xtype: 'grid',
					type: 'column',
					columnRule: 'col-md-8',
					items:[{
						xtype:'textbox'
					}]	
				}]
			}, {
				xtype: 'grid',
				rowContainer: 'fluid',
				items: [{
					xtype: 'grid',
					type: 'column',
					columnRule: 'col-md-6',
					items:[{
						xtype: 'grid',
						items:[{
							xtype: 'grid',
							type: 'column',
							columnRule: 'col-md-4',
							items:[{
								xtype: 'html',
								content: 'A',
							}]
						},{
							xtype: 'grid',
							type: 'column',
							columnRule: 'col-md-8',
							items:[{
								xtype: 'textbox',
							}]	
						}]
					}]	
				}, {
					xtype: 'grid',
					type: 'column',
					columnRule: 'col-md-6',
					items:[{
						xtype: 'grid',
						items:[{
							xtype: 'grid',
							type: 'column',
							columnRule: 'col-md-4',
							items:[{
								xtype: 'html',
								content: 'C',
							}]
						},{
							xtype: 'grid',
							type: 'column',
							columnRule: 'col-md-8',
							items:[{
								xtype: 'textbox',
								width: 100
							}]	
						}]
					}]	
				}]
			}]	
		});
	}
}