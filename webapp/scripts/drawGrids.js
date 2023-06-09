function showTableSetWin(panel,gridID){
    var changeDS=false;
    var oldSettings=JSON.stringify(panel.settings);
    var filtersArray=centerPanel.filters;
    var storeRemote=Ext.create('Ext.data.Store', {
        fields: ["show","dataIndex","fieldID","text","viewMode","aggregation","dinamicFilter","staticFilter"],
        proxy: {
            actionMethods: {read: 'GET'},
            extraParams: {itemID: panel.itemID!=-1?panel.itemID:0, lang: lang, userID: userID, dsID: 0},
            type: 'ajax',
            timeout: timeoutAjax,
            url: '/kortes/service/mainsource/fields/',
            reader: {
                type: 'json',
                transform: {
                    fn: function(data) {
                        data.forEach(function(el){
                            if(el["viewMode"]===undefined || el["viewMode"]==="")el["viewMode"]="vertical";
                            if(el["viewMode"]==="vertical")el["viewModeText"]=vcbl[lang]["viewModeEditorVert"];
                            else if(el["viewMode"]==="horizontal")el["viewModeText"]=vcbl[lang]["viewModeEditorHor"];
                            else if(el["viewMode"]==="fact")el["viewModeText"]=vcbl[lang]["viewModeEditorFact"];
                            if(el["showDefault"]!==undefined && el["showDefault"]!=="")el["show"]=el["showDefault"];
                            if(el["dinamicFilter"]===undefined)el["dinamicFilter"]="";
                            if(el["dinamicFilter"]!=="")
                                el["dinamicFilterText"]=filtersArray[findIndexByKeyValue(filtersArray,"filterID",el["dinamicFilter"]*1)].text;
                            else el["dinamicFilterText"]="";
                            if(el["staticFilter"]===undefined)el["staticFilter"]=null;
                        });
                        return data;
                    }
                }
            }
        },
        listeners: {'load': function(store,recs,suc){
            if(!suc)Ext.create('eikonDialog').alert(vcbl[lang]["statusTitle"],vcbl[lang]["errorLoadTableSettings"]);
            else topPanel.checkForAgr();
        }}
    });
    if(panel.settings.settings!==undefined && panel.settings.settings.length!==0){
        panel.settings.settings.forEach(function(el){
            if(el["viewMode"]===undefined || el["viewMode"]==="")el["viewMode"]="vertical";
            var dinamicFilter=((el["dinamicFilter"]+'').indexOf("new_")!==-1)?el["dinamicFilter"]:el["dinamicFilter"]*1;
            if(el["dinamicFilter"]!=="" && findIndexByKeyValue(filtersArray,"filterID",dinamicFilter)!==null){
                el["dinamicFilterText"]=filtersArray[findIndexByKeyValue(filtersArray,"filterID",dinamicFilter)].text;
            } else {
                el["dinamicFilterText"]=el["dinamicFilter"];
            }
            if(el["viewMode"]==="vertical")el["viewModeText"]=vcbl[lang]["viewModeEditorVert"];
            else if(el["viewMode"]==="horizontal")el["viewModeText"]=vcbl[lang]["viewModeEditorHor"];
            else if(el["viewMode"]==="fact")el["viewModeText"]=vcbl[lang]["viewModeEditorFact"];
        });
    }
    var storeLocal=Ext.create('Ext.data.JsonStore', {
        fields: ["show","dataIndex","fieldID","text","viewMode","aggregation","dinamicFilter","staticFilter"],
        data: panel.settings.settings
    });
    var topPanel=Ext.create('Ext.panel.Panel',{
        layout: {type: 'vbox',pack: 'start',align: 'stretch'},
        featureName: '',
        items: [{xtype: 'combobox',
            fieldLabel: vcbl[lang]["labelDS"],
            labelWidth: 125,
            store: Ext.create('Ext.data.JsonStore',{
                autoLoad: true,
                proxy: {
                    extraParams: {lang: lang, userID: userID},
                    type: 'ajax',
                    timeout: timeoutAjax,
                    url: '/kortes/service/datasources/'
                },
                fields: ['dataIndex','text'],
                listeners: { 'load': function(store,recs,suc){
                        if(!suc){Ext.create('eikonDialog').alert(vcbl[lang]["statusTitle"],vcbl[lang]["errorLoadDS"]);return false;}
                        if(panel.settings.dsID!==undefined){
                            topPanel.getComponent(0).setValue(panel.settings.dsID);
                            var featureNameRec=store.findRecord('dataIndex',panel.settings.dsID);
                            if(!!featureNameRec){ topPanel.featureName=featureNameRec.get('desc'); }
                            if(panel.settings.settings.length===0){
                                var curStore=grid.getStore();
                                curStore.getProxy().extraParams.dsID=panel.settings.dsID;
                                curStore.reload();
                            }
                        }
                        if(panel.settings.aggregate!==undefined)topPanel.getComponent(1).setValue(panel.settings.aggregate);
                    }
                }
            }),
            displayField: 'text',
            valueField: 'dataIndex',
            queryMode: 'local',
            editable: false,
            listeners: {
                'select': function(combo,rec){
                    if(rec.get('dataIndex')===0)return false;
                    grid.setStore(storeRemote);
                    storeRemote.getProxy().extraParams.dsID=rec.get('dataIndex');
                    storeRemote.load();
                    changeDS=true;
                    panel.settings.chartSettings={};
                    topPanel.featureName=rec.get('desc');
                }
            }
        },{xtype: 'checkbox',boxLabel: vcbl[lang]["labelAggregate"]},{xtype: 'checkbox',boxLabel: vcbl[lang]["selectAll"],listeners: {
            'change': function(check,nV){
                if(nV){
                    var countVert=0;
                    var countHor=0;
                    var countFact=0;
                    var tempAr=grid.getStore().getRange();
                    tempAr.forEach(function(el){
                        if(el.get("viewMode")==="horizontal"){ countHor++; }
                        else if(el.get("viewMode")==="vertical"){ countVert++; }
                        else if(el.get("viewMode")==="fact"){ countFact++; }
                    });
                    var countHorTemp=countHor;
                    var countFactTemp=countFact;
                    if(countHorTemp>maxDeepPivot){ countHorTemp=maxDeepPivot; }
                    if(countFactTemp>1){ countFactTemp=1; }
                    grid.getStore().each(function(rec){
                        if(rec.get('viewMode')==="horizontal" && countHorTemp>0 && countVert>0){
                            countHorTemp--;
                            rec.set('show',true);
                        } else if(rec.get('viewMode')==="fact" && countFactTemp>0 && countHor>0 && countVert>0){
                            countFactTemp--;
                            rec.set('show',true);
                        } else if(rec.get('viewMode')==="vertical"){ rec.set('show',true); }
                    });
                }
                else{ grid.getStore().each(function(rec){rec.set('show',false);}); }
                topPanel.checkForAgr();
            }
        }}],
        checkForAgr: function(){
            this.getComponent(1).enable();
            var allRec=grid.getStore().getRange();
            for(var key in allRec)
                if(allRec[key].get("show") && allRec[key].get("typeFilter")==="MemoShort"){
                    this.getComponent(1).setValue(false);
                    this.getComponent(1).disable();
                }
        }
    });
    if(panel.settings.settings!==undefined && panel.settings.settings.length!==0){
        for(var key in panel.settings.settings)
            if(panel.settings.settings[key].show && panel.settings.settings[key].typeFilter==="MemoShort")
                topPanel.getComponent(1).disable();
        panel.settings.settings.forEach(function(el){
            if(el.id!==undefined || el.id!=="") delete el.id;
        });
    }
    var viewModeEditor=Ext.create('Ext.form.field.ComboBox',{store: Ext.create('Ext.data.ArrayStore', {
            fields: ['index','name'],
            data : [['vertical',vcbl[lang]["viewModeEditorVert"]],['horizontal',vcbl[lang]["viewModeEditorHor"]],['fact',vcbl[lang]["viewModeEditorFact"]]]
        }),
        displayField: 'name',
        valueField: 'index',
        queryMode: 'local',
        editable: false,
        value: "vertical"
    });
    var funcAgrEditor=Ext.create('Ext.form.field.ComboBox',{
        xtype: 'combobox',
        store: Ext.create('Ext.data.ArrayStore', {
            fields: ['index','name'],
            data : [['','none'],['max','max'],['min','min'],['sum','sum'],['avg','avg']]
        }),
        displayField: 'name',
        valueField: 'index',
        queryMode: 'local',
        editable: false,
        setEmptyData: function(){this.getStore().setData([['','none']]);},
        setFullData: function(){this.getStore().setData([['','none'],['max','max'],['min','min'],['sum','sum'],['avg','avg']]);}
    });
    var dinamicFilterEditor=Ext.create('Ext.form.field.ComboBox',{store: Ext.create('Ext.data.JsonStore',{
            fields: ['filterID','text','fieldID','condition','typeFilter','value'],
            data: [{'filterID':null,'text':"none",'fieldID':null,'condition':null,'typeFilter':null,'value':null}].concat(filtersArray)
        }),
        displayField: 'text',
        valueField: 'filterID',
        queryMode: 'local',
        editable: false,
        value: ""
    });
    var grid=Ext.create('Ext.grid.Panel', {
        flex: 1,
        columnLines: true,
        border: false,
        store: (panel.settings.settings!==undefined && panel.settings.settings.length===0)?storeRemote:storeLocal,
        plugins: {ptype: 'cellediting', clicksToEdit: 1, listeners: {
            'validateedit': function(editor,e){
                if(e.field==="aggregation"){
                    e.cancel=true;
                    var tempAr=e.grid.getStore().getRange();
                    var flagMemoShort=false;
                    var nameMemoShort='';
                    tempAr.forEach(function(el){
                        if(el.get("show") && el.get("typeFilter")==="MemoShort"){ flagMemoShort=true; nameMemoShort=el.get("text"); }
                    });
                    if(flagMemoShort && funcAgrEditor.getValue()!==''){
                        e.record.set(e.field,'');
                        Ext.create('eikonDialog').alert(vcbl[lang]["statusTitle"],vcbl[lang]["warningFuncAgr"]+"\""+nameMemoShort+"\".");
                    } else {
                        e.record.set(e.field,funcAgrEditor.getValue());
                    }
                } else if(e.field==="dinamicFilterText"){
                    e.cancel=true;
                    e.record.set(e.field,dinamicFilterEditor.getRawValue()==="none"?"":dinamicFilterEditor.getRawValue());
                    e.record.set("dinamicFilter",dinamicFilterEditor.getValue()===null?"":dinamicFilterEditor.getValue());
                } else if(e.field==="viewModeText") {
                    e.cancel=true;
                    var countVert=0;
                    var countHor=0;
                    var countFact=0;
                    var tempAr=e.grid.getStore().getRange();
                    tempAr.forEach(function(el){
                        if(el.get("show") && el.get("fieldID")!==e.record.get("fieldID")){
                            if(el.get("viewMode")==="horizontal"){ countHor++; }
                            else if(el.get("viewMode")==="vertical"){ countVert++; }
                            else if(el.get("viewMode")==="fact"){ countFact++; }
                        }
                    });
                    if(e.record.get("show") && e.value==="horizontal"){
                        if(countVert===0){
                            e.record.set(e.field,viewModeEditor.getStore().findRecord("index",e.originalValue).get("name"));
                            e.record.set("viewMode",e.originalValue);
                            Ext.create('eikonDialog').alert(vcbl[lang]["statusTitle"],vcbl[lang]["errorNeedVertField"]);
                        } else if(countHor>=maxDeepPivot) {
                            e.record.set(e.field,viewModeEditor.getStore().findRecord("index",e.originalValue).get("name"));
                            e.record.set("viewMode",e.originalValue);
                            Ext.create('eikonDialog').alert(vcbl[lang]["statusTitle"],vcbl[lang]["errorMaxDeepPivot"]+" "+maxDeepPivot);
                        } else {
                            e.record.set(e.field,viewModeEditor.getRawValue());
                            e.record.set("viewMode",viewModeEditor.getValue()===null?"":viewModeEditor.getValue());
                        }
                    } else if(e.record.get("show") && e.value==="fact"){
                        if(countVert===0){
                            e.record.set(e.field,viewModeEditor.getStore().findRecord("index",e.originalValue).get("name"));
                            e.record.set("viewMode",e.originalValue);
                            Ext.create('eikonDialog').alert(vcbl[lang]["statusTitle"],vcbl[lang]["errorNeedVertField"]);
                        } else if(countHor===0){
                            e.record.set(e.field,viewModeEditor.getStore().findRecord("index",e.originalValue).get("name"));
                            e.record.set("viewMode",e.originalValue);
                            Ext.create('eikonDialog').alert(vcbl[lang]["statusTitle"],vcbl[lang]["errorNeedHorField"]);
                        } else if(countFact>=1){
                            e.record.set(e.field,viewModeEditor.getStore().findRecord("index",e.originalValue).get("name"));
                            e.record.set("viewMode",e.originalValue);
                            Ext.create('eikonDialog').alert(vcbl[lang]["statusTitle"],vcbl[lang]["errorMoreOneFactFiled"]);
                        } else {
                            e.record.set(e.field,viewModeEditor.getRawValue());
                            e.record.set("viewMode",viewModeEditor.getValue()===null?"":viewModeEditor.getValue());
                        }
                    } else {
                        e.record.set(e.field,viewModeEditor.getRawValue());
                        e.record.set("viewMode",viewModeEditor.getValue()===null?"":viewModeEditor.getValue());
                    }
                }
            },
            'beforeedit': function(editor,e){
                if(filtersArray.length>0){ dinamicFilterEditor.enable(); }
                else { dinamicFilterEditor.disable(); }
                if(e.record.get("typeFilter")==="MemoShort") {
                    viewModeEditor.getStore().setData([['vertical',vcbl[lang]["viewModeEditorVert"]]]);
                    funcAgrEditor.setEmptyData();
                }
                else if(e.record.get("typeFilter")==="ID" || e.record.get("typeFilter")==="ID Dictionary" || e.record.get("typeFilter")==="Month" ||
                        e.record.get("typeFilter")==="Year" || e.record.get("typeFilter")==="Quarter" || e.record.get("typeFilter")==="Volume data"
                         || e.record.get("typeFilter")==="Price data" || e.record.get("typeFilter")==="Number"){
                    viewModeEditor.getStore().setData([['vertical',vcbl[lang]["viewModeEditorVert"]],['horizontal',vcbl[lang]["viewModeEditorHor"]],['fact',vcbl[lang]["viewModeEditorFact"]]]);
                    funcAgrEditor.setFullData();
                } else {
                    viewModeEditor.getStore().setData([['vertical',vcbl[lang]["viewModeEditorVert"]],['horizontal',vcbl[lang]["viewModeEditorHor"]]]);
                    funcAgrEditor.setEmptyData();
                }
            }
        }},
        listeners: {
            'cellclick': function(view,td,cellIndex,record){
                if(cellIndex===5)record.set("dinamicFilterText",record.get("dinamicFilter"));
                else if(cellIndex===3)record.set("viewModeText",record.get("viewMode"));
            }
        },
        viewConfig: {
            plugins: { ptype: 'gridviewdragdrop', dragText: 'Drag and drop to reorganize' }
        },
        columns: {
            defaults: {menuDisabled: true},
            items:[{xtype: 'checkcolumn',dataIndex: 'show',width: 27,listeners: {'checkchange':function(col,rI,checked){
                        if(checked){
                            var countVert=0;
                            var countHor=0;
                            var countFact=0;
                            var tempStore=grid.getStore();
                            var tempAr=tempStore.getRange();
                            var haveFuncAgr=false;
                            var nameFieldFuncAgr=false;
                            tempAr.forEach(function(el){
                                if(!!el.get("aggregation")){ haveFuncAgr=true; nameFieldFuncAgr=el.get("text"); }
                                if(el.get("show")){
                                    if(el.get("viewMode")==="horizontal"){ countHor++; }
                                    else if(el.get("viewMode")==="vertical"){ countVert++; }
                                    else if(el.get("viewMode")==="fact"){ countFact++; }
                                }
                            });
                            var curRec=tempStore.getAt(rI);
                            if(curRec.get("typeFilter")==="MemoShort" && haveFuncAgr){
                                Ext.create('eikonDialog').alert(vcbl[lang]["statusTitle"],vcbl[lang]["warningFuncAgr2"]+"\""+nameFieldFuncAgr+"\".");
                                curRec.set("show",false);
                            }
                            if(curRec.get("viewMode")==="horizontal"){
                                if(countVert===0){
                                    Ext.create('eikonDialog').alert(vcbl[lang]["statusTitle"],vcbl[lang]["errorNeedVertField"]);
                                    curRec.set("show",false);
                                } else if(countHor>maxDeepPivot){
                                    Ext.create('eikonDialog').alert(vcbl[lang]["statusTitle"],vcbl[lang]["errorMaxDeepPivot"]+" "+maxDeepPivot);
                                    curRec.set("show",false);
                                }
                            } else if(curRec.get("viewMode")==="fact"){
                                if(countVert===0){
                                    Ext.create('eikonDialog').alert(vcbl[lang]["statusTitle"],vcbl[lang]["errorNeedVertField"]);
                                    curRec.set("show",false);
                                } else if(countHor===0){
                                    Ext.create('eikonDialog').alert(vcbl[lang]["statusTitle"],vcbl[lang]["errorNeedHorField"]);
                                    curRec.set("show",false);
                                } else if(countFact>1){
                                    Ext.create('eikonDialog').alert(vcbl[lang]["statusTitle"],vcbl[lang]["errorMoreOneFactFiled"]);
                                    curRec.set("show",false);
                                }
                            }
                        }
                        topPanel.checkForAgr();
                    }}},
                {xtype: 'actioncolumn',width: 25,align: 'center',
                    items: [{
                        getClass: function(v,meta,rec){
                            if(rec.get('desc')!==null && rec.get('desc')!==" ") return 'info_but';
                            else return false;
                        },
                        getTip: function(v,meta,rec){
                            if(rec.get('desc')!==null && rec.get('desc')!==" ") return rec.get('desc');
                            else return false;
                        }
                    }]
                },
                {text: vcbl[lang]["nameField"],flex: 1,dataIndex: 'text'},
                {text: vcbl[lang]["viewMode"],width: 140,dataIndex: 'viewModeText', editor: viewModeEditor},
                {text: vcbl[lang]["funcAgr"],width: 150,dataIndex: 'aggregation', editor: funcAgrEditor},
                {text: vcbl[lang]["dinamicFilter"],width: 140,dataIndex: 'dinamicFilterText', editor: dinamicFilterEditor},
                {text: vcbl[lang]["staticFilter"],width: 140,xtype: 'actioncolumn',align: 'center',
                    items: [{
                        getClass: function(v,meta,rec){
                            if(rec.get("staticFilter")===null) return 'add_but';
                            else return 'del_but';
                        },
                        handler: function(grid,rI,cI,item,e,rec){
                            if(rec.get("staticFilter")===null) showStaticFiltersWin(rec,gridID);
                            else rec.set("staticFilter",null);
                        }
                    },{
                        getClass: function(v,meta,rec){
                            if(rec.get("staticFilter")!==null) return 'edit_but';
                        },
                        getTip: function(v,meta,rec){
                            if(rec.get("staticFilter")!==null) return rec.get("staticFilter").valueText.replace(/\"/g,"\'");
                        },
                        isDisabled: function(view,rowIndex,colIndex,item,rec){
                            if(rec.get("staticFilter")===null) return false;
                        },
                        handler: function(grid,rI,cI,item,e,rec){
                            if(rec.get("staticFilter")!==null) showStaticFiltersWin(rec,gridID);
                        }
                    }]
                }]
        }
    });
    var win=Ext.create('eikonWin', {
        title: vcbl[lang]["titleSettingsTableWin"],
        height: sizeSetWin.height,
        width: sizeSetWin.width,
        bodyPadding: 10,
        bodyCls: 'forFlexGridWin',
        items: [topPanel,grid],
        buttons: [{cls: 'cta',text: vcbl[lang]["applyBut"],handler: function(){
            if(!topPanel.getComponent(0).getValue()){ return false; }
            else {
                var countShow=0;
                grid.getStore().getRange().forEach(function(el){ if(el.get("show")){ countShow++; } });
                if(countShow===0){
                    Ext.create('eikonDialog').alert(vcbl[lang]["statusTitle"],vcbl[lang]["errorNeedSelectFiled"]);
                    return false;
                }
            }
            if(changeDS)checkPanelForDelFilter(panel);
            var ans=new Array();
            var items=grid.getStore().getData().items;
            var arFilters=new Array();
            for(var key in items){
                var attr=items[key].data;
                if(attr.show===undefined)attr.show=false;
                if(attr.viewMode===undefined)attr.viewMode="";
                if(attr.viewModeText!==undefined)delete attr.viewModeText;
                if(attr.aggregation===undefined)attr.aggregation="";
                if(attr.dinamicFilter===undefined)attr.dinamicFilter="";
                else if(attr.dinamicFilter!=="") arFilters.push(attr.dinamicFilter);
                if(attr.dinamicFilterText!==undefined)delete attr.dinamicFilterText;
                if(attr.staticFilter===undefined)attr.staticFilter=null;
                if(attr.width===undefined)attr.width=100;
                delete attr.id;
                ans.push(attr);
            }
            var filters=new Array();
            if(arFilters.length>0){
                filtersArray.forEach(function(el){
                    for(var key in arFilters){
                        if(arFilters[key]==el.filterID)
                            filters.push({fieldID:el.fieldID,condition:el.condition,typeFilter:el.typeFilter,value:el.value});
                    }
                });
            }
            var sorters=new Array();
            if(panel.settings.sorters!==undefined) sorters=panel.settings.sorters;
            var chartSettings=!!panel.settings.chartSettings?panel.settings.chartSettings:{}
            var settings={xtype: "grid",dsID: topPanel.getComponent(0).getValue(), settings: ans,
                filters: filters, aggregate: topPanel.getComponent(1).getValue(), sorters: sorters, chartSettings: chartSettings};
            panel.settings=settings;
            panel.isEdit=true;
            saveInJET('apply table set win');
            if(panel.itemID===-1)panel.itemID=0;
            if(panel.itemIDAs===-1)panel.itemIDAs=0;
            panel.unregInnerComp();
            panel.removeAll();
            if(findIndexByKeyValue(arDS,'dataIndex',panel.settings.dsID)!==null)
                panel.changeMPTitle(arDS[findIndexByKeyValue(arDS,'dataIndex',panel.settings.dsID)].text);
            loadGridPanel(panel);
            fullInfoPanel.clearFI();
            sendHit(topPanel.featureName);
            win.close();
        }},{text: vcbl[lang]["cancelBut"],handler: function(){panel.settings=JSON.parse(oldSettings);win.close();}}],
        listeners: {
            'close': function(){
                var items=grid.getStore().getData().items;
                for(var key in items){
                    var attr=items[key].data;
                    if(attr.viewModeText!==undefined)delete attr.viewModeText;
                    if(attr.dinamicFilterText!==undefined)delete attr.dinamicFilterText;
                }
            },
            'resize': function(win,w,h){sizeSetWin.height=h; sizeSetWin.width=w;}
        }
    }).show();
}

function loadGridPanel(panel,sendHitFlag){
    var urlColumns='/kortes/service/mainsource/fieldsbyid/';
    var urlData='/kortes/service/mainsource/';
    var method='GET';
    if(panel.settings!==-1){
        urlColumns='/kortes/service/fieldsBySettings/';
        urlData='/kortes/service/mainsource/';
        method='POST';
    }
    var sorters=(panel.settings.sorters!==undefined && panel.settings.sorters!==null)?panel.settings.sorters:[];
    if(sorters.length>0){
        var tempDelSort=[];
        for(var key in sorters){
            for(var key2 in panel.settings.settings){
                if(sorters[key].property===panel.settings.settings[key2].dataIndex && panel.settings.settings[key2].viewMode!=="vertical"){
                    tempDelSort.push(sorters[key].property);
                }
            }
        }
        if(tempDelSort.length>0){
            for(var key in tempDelSort){
                sorters.splice(findIndexByKeyValue(sorters,"property",tempDelSort[key]),1);
            }
        }
        panel.settings.sorters=sorters;
    }
    panel.multiSortLength=sorters.length;
    if(!!sendHitFlag) sendHit(arDS[findIndexByKeyValue(arDS,"dataIndex",panel.settings.dsID)].desc);
    if(typeof isFirst["el_"+panel.itemID]==='undefined'){ isFirst["el_"+panel.itemID]=isFirst.main; isFirst.el++; }
    Ext.Ajax.request({
        method: 'GET',
        url: '/kortes/service/getMaxCount/',
        params: {lang: lang, userID: userID, dsID: panel.settings.dsID},
        success: function(response){
            panel.maxLengthLoadRec=response.responseText*1;
            Ext.Ajax.request({
                method: 'POST',
                url: '/kortes/service/count/',
                params: {lang: lang, userID: userID, itemID: panel.itemID, setting: JSON.stringify(panel.settings), isFirst: isFirst["el_"+panel.itemID]},
                success: function(response){
                    var totalCount=response.responseText*1;
                    panel.totalCountRec=totalCount;
                    var indexDsID=findIndexByKeyValue(arDS,'dataIndex',panel.settings.dsID);
                    if(indexDsID!==null) panel.changeMPTitle(arDS[indexDsID].text);
                    else panel.changeMPTitle(labelHeader.text);
                    Ext.Ajax.request({
                        method: method,
                        url: urlColumns,
                        params: {lang: lang, userID: userID, itemID: panel.itemID, setting: JSON.stringify(panel.settings), isFirst: isFirst["el_"+panel.itemID]},
                        success: function(response){
                            var ans=JSON.parse(response.responseText);
                            setColumnsFilteredCls(ans,panel,false);
                            panel.settings.xtype="grid";
                            if(ans.length>0){
                                panel.removeAll();
                                panel.changeMPDownloadBut();
                                var gridPanel=Ext.create('Ext.grid.Panel', {
                                    region: 'center',
                                    border: false,
                                    cls: 'gridMP',
                                    viewConfig: {loadMask: false},
                                    loadMask: null,
                                    multiColumnSort: true,
                                    store: Ext.create('Ext.data.BufferedStore', {
                                        fields: [],
                                        remoteGroup: true,
                                        leadingBufferZone: 100,
                                        pageSize: 100,
                                        multiSortLimit: 1,
                                        sorters: sorters,
                                        proxy: {
                                            actionMethods: {read: 'POST'},
                                            extraParams: {lang: lang, userID: userID, itemID: panel.itemID, setting: JSON.stringify(panel.settings), isFirst: isFirst["el_"+panel.itemID]},
                                            type: 'ajax',
                                            timeout: timeoutAjax,
                                            url: urlData,
                                            reader: {
                                                type: 'json',
                                                rootProperty: 'data',
                                                totalProperty: 'totalCount',
                                                transform: {
                                                    fn: function(data){
                                                        isFirst["el_"+panel.itemID]=false;
                                                        isFirst.el--;
                                                        if(isFirst.el<=0){ isFirst.main=false; }
                                                        gridPanel.getStore().getProxy().extraParams.isFirst=isFirst["el_"+panel.itemID];
                                                        for(var key in data)
                                                            if(!!data[key] && !!data[key].SDATE) data[key].SDATE=data[key].SDATE.substr(3);
                                                        return {"totalCount":totalCount,"data":data};
                                                    },
                                                    scope: this
                                                }
                                            }
                                        },
                                        autoLoad: true,
                                        listeners: {
                                            'load': function(store,recs,suc){
                                                if(!suc){Ext.create('eikonDialog').alert(vcbl[lang]["statusTitle"],vcbl[lang]["errorLoadTableData"]);}
                                            },
                                            'prefetch': function(store,rec,suc,op){
                                                gridPanel.viewLoadMask(false);
                                                if(!suc){Ext.create('eikonDialog').alert(vcbl[lang]["statusTitle"],vcbl[lang]["errorLoadTableData"]);}
                                            },
                                            'beforeload': function(store,op){ },
                                            'beforeprefetch': function(store,op){ gridPanel.viewLoadMask(true); }
                                        }
                                    }),
                                    viewLoadMask: function(flag){
                                        var me=this;

                                        if(flag && me.loadMask===null) me.loadMask=new Ext.LoadMask({
                                            target: me, count: 1,
                                            listeners: {
                                                show: function(){ },
                                                hide: function(){ }
                                            }
                                        });
                                        else if(flag && !!me.loadMask) me.loadMask.count++;
                                        else if(!flag && !!me.loadMask) me.loadMask.count--;
                                        else return false;

                                        if(flag && me.loadMask.count>0)
                                            new Ext.util.DelayedTask(function(){
                                                if(me.loadMask.count>0) me.loadMask.show();
                                                else if(me.loadMask.count<=0) me.loadMask.hide();
                                            }).delay(delayLoadMask);
                                        else if(me.loadMask.count<=0) me.loadMask.hide();
                                    },
                                    columns: {
                                        defaults: {menuDisabled: true,dsID: panel.settings.dsID,typeFilter: "str",listeners: {
                                            'resize': function(cmp,w,h,oldW,oldH){
                                                if(oldW!==undefined && oldH!==undefined){
                                                    var settings=cmp.findParentByType('multiPanel').settings.settings;
                                                    settings[findIndexByKeyValue(settings,'fieldID',cmp.fieldID)].width=w;
                                                    cmp.findParentByType('multiPanel').isEdit=true;
                                                    saveInJET('resize column');
                                                }
                                            }
                                        },cls: 'filteredField'},
                                        items: ans
                                    },
                                    listeners: {
                                        afterrender: function(grid) {
                                            var ddPanel=centerPanel.getComponent(0);
                                            var headerCt=grid.child("headercontainer");
                                            headerCt.on({
                                                'sortchange': {fn: function(ct,column,dir){
                                                    if(panel.multiSortLength===0){
                                                        var sortSingle=[];
                                                        if(ct.lastSortCol!==undefined && (ct.lastSortCol!==column.dataIndex)){
                                                            for(var key in ct.columnManager.columns) ct.columnManager.columns[key].flagSort=false;
                                                        }
                                                        ct.lastSortCol=column.dataIndex;
                                                        if(dir==="ASC"){
                                                            if(column.flagSort){
                                                                ct.findParentByType('grid').getStore().sorters.clear();
                                                                column.flagSort=false;
                                                            } else {
                                                                column.flagSort=true;
                                                                sortSingle=[{property:column.dataIndex,direction:dir}];
                                                            }
                                                        } else sortSingle=[{property:column.dataIndex,direction:dir}];
                                                        panel.isEdit=true;
                                                        panel.settings.sorters=sortSingle;
                                                        saveInJET('change sort column');
                                                    } else panel.multiSortLength--;
                                                }}
                                            });
                                            Ext.create('Ext.dd.DropTarget', ddPanel.getEl(), {
                                                ddGroup: 'header-dd-zone-' + this.headerCt.up('[scrollerOwner]').id,
                                                notifyDrop: function(dragsource, event, data) {
                                                    var panelFilter=centerPanel.getComponent(0);
                                                    for(var i=0;i<panelFilter.items.length;i++){
                                                        if(panelFilter.getComponent(i).fieldID===data.header.fieldID){
                                                            panelFilter.getComponent(i).getComponent(1).handler(panelFilter.getComponent(i).getComponent(1));
                                                            return;
                                                        } else {
                                                            var settingsPanel=data.header.findParentByType('grid').findParentByType('multiPanel').settings.settings;
                                                            if(settingsPanel[findIndexByKeyValue(settingsPanel,'fieldID',data.header.fieldID)].dinamicFilter===panelFilter.getComponent(i).filterID)
                                                            {
                                                                panelFilter.getComponent(i).getComponent(1).handler(panelFilter.getComponent(i).getComponent(1));
                                                                return;
                                                            }
                                                        }
                                                    }
                                                    var text=data.header.text.replace(/\sstaticFiltered/g,"").replace(/<span class=\"filteredField\">/g,"").replace(/<span class=\"noFilteredField\">/g,"").replace(/<\/span>/g,"");
                                                    showFiltersWin(data.header.typeFilter,text,data.header.fieldID,ddPanel,data.header.findParentByType('grid').getItemId());
                                                }
                                            });
                                        },
                                        'celldblclick': function(grid,td,cellIndex,record,tr,rowIndex){
                                            loadFullInfoCell(grid,rowIndex,cellIndex,record);
                                        },
                                        'columnmove': function(ct,column,fromIdx,toIdx){
                                            if(column.ownerCt.fieldID===undefined){
                                                panel.settings.settings;
                                                var arView=new Array();
                                                var arNotView=new Array();
                                                var tempAr=new Array();
                                                for(var i=0;i<panel.settings.settings.length;i++){
                                                    if(panel.settings.settings[i].show)arView.push(panel.settings.settings[i]);
                                                    else arNotView.push(panel.settings.settings[i]);
                                                }
                                                if(fromIdx<toIdx){
                                                    tempAr=arView.splice(fromIdx,1);
                                                    arView.splice(toIdx-1,0,tempAr[0]);
                                                } else {
                                                    tempAr=arView.splice(fromIdx,1);
                                                    arView.splice(toIdx,0,tempAr[0]);
                                                }
                                                panel.isEdit=true;
                                                panel.settings.settings=arView.concat(arNotView);
                                            }
                                        }
                                    }
                                });
                                panel.add(gridPanel);
                                centerPanel.grids.push(gridPanel.getItemId());
                                panel.prevSettings=panel.settings;
                                panel.countPrevLoad=0;
                                centerPanel.updateMainBut();
                            }
                        },
                        failure: function(){Ext.create('eikonDialog').alert(vcbl[lang]["statusTitle"],vcbl[lang]["errorLoadColumns"]);loadPrevVerGrid(panel)}
                    });
                },
                failure: function(){Ext.create('eikonDialog').alert(vcbl[lang]["statusTitle"],vcbl[lang]["errorLoadCount"]);loadPrevVerGrid(panel);}
            });
        },
        failure: function(){Ext.create('eikonDialog').alert(vcbl[lang]["statusTitle"],vcbl[lang]["errorLoadMaxCount"]);loadPrevVerGrid(panel);}
    });
}
function loadPrevVerGrid(panel){
    if(panel.prevSettings===0 || panel.countPrevLoad>3)return;
    panel.settings=panel.prevSettings;
    panel.countPrevLoad++;
    loadGridPanel(panel);
}
function loadFullInfoCell(grid,rowIndex,cellIndex){
    var settings=grid.findParentByType('multiPanel').settings;
    fullInfoPanel.setFI("");
    var sort=null;
    if(grid.getStore().getSorters().items.length!==0){
        sort=grid.getStore().getSorters().items[0];
        sort=[{property:sort._property,direction:sort._direction}];
    }
    Ext.Ajax.request({
        method: 'POST',
        url: '/kortes/service/getFullInfo/',
        params: {lang: lang, userID: userID, settings: JSON.stringify(settings), rowIndex: rowIndex, cellIndex: cellIndex, sort: JSON.stringify(sort)},
        success: function(response){
            fullInfoPanel.show();
            fullInfoPanel.setFI(response.responseText);
        },
        failure: function(){Ext.create('eikonDialog').alert(vcbl[lang]["statusTitle"],vcbl[lang]["errorLoadFullInfoCell"]);}
    });
}
function setColumnsFilteredCls(columns,panel,isChild){
    columns.forEach(function(el){
        el.tooltip=el.text;
        if(el.typeFilter==="ID" || el.typeFilter==="ID Dictionary" || el.typeFilter==="Month" ||
            el.typeFilter==="Number" || el.typeFilter==="Price data" || el.typeFilter==="Quarter" ||
            el.typeFilter==="Year") el.align="right";
        else if(el.typeFilter==="Volume data" || el.typeFilter==="fact_field") {el.align="right";el.renderer=Ext.util.Format.numberRenderer('0.000');}
        //else if(el.typeFilter==="MemoShort") el.align="center";
        if(el.fieldID!==null){
            var tempVar=panel.settings.settings[findIndexByKeyValue(panel.settings.settings,'fieldID',el.fieldID)];
            var dinamicFilter=!!tempVar && !!tempVar.dinamicFilter;
            var staticFilter=!!tempVar && !!tempVar.staticFilter;
            var clsStaticFilter='';
            if(staticFilter) clsStaticFilter=' staticFiltered';
            if(dinamicFilter) el.text='<span class="filteredField'+clsStaticFilter+'">'+el.text+'</span>';
            else el.text='<span class="noFilteredField'+clsStaticFilter+'">'+el.text+'</span>';
            if(isChild)el.sortable=false;
            if(el.columns!==undefined && el.columns!==null){el.columns=setColumnsFilteredCls(el.columns,panel,true);}
        }
        else el.text='<span class="noFilteredField">'+el.text+'</span>';
    });
    return columns;
}

function showSortWin(but){
    var panel=but.findParentByType('panel');
    if(panel.getComponent(0)!==undefined && panel.getComponent(0).getXType()!=="grid") return false;
    var gridSorters=panel.getComponent(0).getStore().getSorters().items;
    var sorters=panel.settings.sorters || [];
    if(gridSorters.length!==sorters.length){
        sorters=[];
        for(var i=0;i<gridSorters.length;i++){
            sorters.push({property: gridSorters[i].config.property, direction: gridSorters[i].config.direction});
        }
    }
    var listColumns=[];
    for(var key in panel.settings.settings){
        if(panel.settings.settings[key].show && panel.settings.settings[key].viewMode==="vertical")
            listColumns.push({
                xtype: 'menucheckitem',
                text: panel.settings.settings[key].text,
                dataIndex: panel.settings.settings[key].dataIndex,
                listeners: {
                    'checkchange': function(item,checked){
                        if(checked)sortGrid.getStore().add([[item.dataIndex,item.text,'ASC']]);
                        else sortGrid.getStore().remove(sortGrid.getStore().findRecord('dataIndex',item.dataIndex));
                    }
                },
                scope: this
            });
    }
    var addSortBut=Ext.create('Ext.button.Button', {
        text: vcbl[lang]["addSortLevelBut"],
        iconCls: "add_but",
        destroyMenu: true,
        menu: Ext.create('Ext.menu.Menu', {
            iconAlign: 'right',
            cls: 'splitBodyMod',
            defaults: {height: 24, cls: 'splitButModIcon'},
            items: listColumns
        })
    });
    var sortGrid=Ext.create('Ext.grid.Panel', {
        border: false,
        flex: 1,
        viewConfig: { plugins: { ptype: 'gridviewdragdrop', dragText: 'Drag and drop to reorganize' } },
        plugins: {ptype: 'cellediting', clicksToEdit: 1},
        store: Ext.create('Ext.data.ArrayStore', { fields:['dataIndex','column','direction'], data: [] }),
        columns: {
            defaults: {menuDisabled: true, sortable: false, resizable: false},
            items: [
                {text: vcbl[lang]["nameSortColumn"],  dataIndex: 'column', flex: 1},
                {xtype: 'actioncolumn', text: vcbl[lang]["nameDirColumn"], align: 'center', items: [{
                    getClass: function(v,meta,rec){
                        if(rec.get("direction")==="DESC") return 'order-list';
                        else return 'order-list-up';
                    },
                    getTip: function(v,meta,rec){
                        if(rec.get("direction")==="DESC") return 'DESC';
                        else return 'ASC';
                    },
                    handler: function(grid,rowIndex){
                        var rec=grid.getStore().getAt(rowIndex);
                        if(rec.get('direction')==="ASC") rec.set('direction',"DESC");
                        else rec.set('direction',"ASC");
                    }}
                ]},
                {xtype: 'actioncolumn', width: 25, align: 'center', items: [{
                    iconCls: "del_but",tooltip: vcbl[lang]["delSortLevelBut"],
                    handler: function(grid,rowIndex){
                        var dataIndex=grid.getStore().getAt(rowIndex).get('dataIndex');
                        var menu=addSortBut.getMenu();
                        for(var i=0;i<menu.items.length;i++){
                            var item=menu.getComponent(i);
                            if(dataIndex===item.dataIndex)item.setChecked(false);
                        }
                    }}
                ]}
        ]},
        listeners: {
            'afterrender': function(){
                var menu=addSortBut.getMenu();
                for(var key in sorters){
                    for(var i=0;i<menu.items.length;i++){
                        if(sorters[key].property===menu.getComponent(i).dataIndex){
                            menu.getComponent(i).setChecked(true);
                            sortGrid.getStore().findRecord('dataIndex',sorters[key].property).set("direction",sorters[key].direction);
                        }
                    }
                }
            }
        }
    });
    var win=Ext.create('eikonWin',{
        title: vcbl[lang]["sortWinTitle"],
        tbar: ['->',addSortBut],
        height: 300,
        width: 500,
        bodyPadding: 0,
        resizable: false,
        items: [sortGrid],
        buttons: [{
            cls: 'cta',
            text: vcbl[lang]["applyBut"],handler: function(){
                var records=sortGrid.getStore().getRange();
                var sortersNew=new Array();
                for(var key in records) sortersNew.push({property: records[key].get('dataIndex'), direction: records[key].get('direction')});
                panel.settings.sorters=sortersNew;
                panel.multiSortLength=sortersNew.length;
                panel.isEdit=true;
                panel.getComponent(0).getStore().sorters.clear();
                loadGridPanel(panel);
                saveInJET('apply sort win');
                win.close();
            }
        },{ text: vcbl[lang]["cancelBut"],handler: function(){win.close();} }]
    }).show();
}