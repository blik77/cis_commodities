JET.init({ ID: "CISFundamentals" });

function restoreFromJET(){
    if(!!JET.Archive && !!JET.Archive.get && !!JET.Archive.put){
        JET.Archive.put('check',true);
        return JET.Archive.get('unsaved') && JET.Archive.get('unsaved')[lang] && true;
    } else return false;
}
function saveInJET(flag){
    if(!!JET.Archive && !!JET.Archive.put){
        var unsaved={"RUS":false,"ENG":false};
        unsaved[lang]=true;
        JET.Archive.put('unsaved',unsaved);
        JET.Archive.put('reportID',centerPanel.reportID);
        JET.Archive.put('startType',centerPanel.startType);
        JET.Archive.put('ifOneEl',[centerPanel.ifOneEl]);
        JET.Archive.put('nameReport',labelHeader.text);
        JET.Archive.put('showFilters',filtersBut.pressed);
        JET.Archive.put('filters',filterForJET());
        JET.Archive.put('report',"["+parsePanelDOM(centerPanel.getComponent(2),true)+"]");
        JET.Archive.put('delFilters',JSON.stringify(delFilters));
    }
    else return false;
}
function loadFromJET(){
    centerPanel.reportID=JET.Archive.get('reportID');
    centerPanel.startType=JET.Archive.get('startType');
    centerPanel.ifOneEl=JET.Archive.get('ifOneEl')[0];
    delFilters=JET.Archive.get('delFilters');
    if(!!delFilters) delFilters=JSON.parse(delFilters);
    labelHeader.setText(JET.Archive.get('nameReport')!==undefined?JET.Archive.get('nameReport'):"");
    if(JET.Archive.get('startType')==="multiPanel")saveBut.setHandler(function(){centerPanel.saveReport();});
    else saveBut.setHandler(function(){centerPanel.saveAsReport();});
    
    var filterPanel=centerPanel.getComponent(0);
    JET.Archive.get('filters').forEach(function(el){
        filterPanel.add(createFilterItem(el.filterID,el.fieldID===undefined?null:el.fieldID,el.condition,el.value,
            el.valueText,el.typeFilter,el.isNew,el.isEdit,filterPanel,el.nameField,true));
    });
    var panel=centerPanel.getComponent(2);
    panel.removeAll();
    panel.setLayout({type: 'border'});
    panel.add(JSON.parse(JET.Archive.get('report')));
    filtersBut.toggle(JET.Archive.get('showFilters')!==undefined?JET.Archive.get('showFilters'):false);
}
function clearJET(){
    if(!!JET.Archive && JET.Archive.put!==undefined){
        JET.Archive.put('unsaved',{"RUS":false,"ENG":false});
    } else return false;
}
function copyToClipboard(but){
    if(!!JET.Archive && !!JET.Archive.put){
        var panel=but.findParentByType('multiPanel');
        if(panel.getComponent(0).getXType()!=='grid' && !(!!panel.getComponent(0).isChart)) return false;
        var set=JSON.parse(JSON.stringify(panel.settings));
        var name=panel.getMPTitle();
        var clipboard=JET.Archive.get('clipboard');
        var reportName=!!labelHeader.text?labelHeader.text:"empty report";
        var newRec={name: name, reportName: reportName, type: set.xtype, settings: set};
        if(!!clipboard) {
            clipboard=JSON.parse(clipboard);
            clipboard.push(newRec);
            JET.Archive.put('clipboard',JSON.stringify(clipboard));
        } else JET.Archive.put('clipboard',JSON.stringify([newRec]));
        Ext.create('eikonDialog').alert(vcbl[lang]["statusTitle"],vcbl[lang]["elementForClipboard"]+"\""+name+"\""+vcbl[lang]["fromForClipboard"]+"\""+reportName+"\""+vcbl[lang]["copyTextForClipboard"]);
    } else return false;
}
function pasteFromClipboard(panel,set){
    panel.itemID=0;
    panel.itemIDAs=0;
    panel.settings=set;
    panel.prevSettings=set;
    panel.countPrevLoad=0;
    panel.isEdit=true;
    panel.multiSortLength=0;
    panel.isSeparated=false;
    if(panel.settings.xtype==='grid') loadGridPanel(panel);
    else if(panel.settings.xtype==='chart') loadChartData(panel);
    saveInJET('paste from clipboard');
}
function viewClipboard(but){
    but.findParentByType('multiPanel').changeMPVisibleBut();
    if(!!JET.Archive && !!JET.Archive.put){
        var panel=but.findParentByType('multiPanel');
        var clipboard=JET.Archive.get('clipboard');
        if(!(!!clipboard)) clipboard='[]';
        var listClipboard=Ext.create('Ext.grid.Panel', {
            border: false,
            flex: 1,
            store: Ext.create('Ext.data.Store', {
                fields:['name','reportName','type','settings'],
                data: JSON.parse(clipboard)
            }),
            columns: {
                defaults: {menuDisabled: true},
                items:[
                    {text: vcbl[lang]["nameGridClipboard"],dataIndex: 'name',flex: 1},
                    {text: vcbl[lang]["nameReportGridClipboard"],dataIndex: 'reportName',flex: 1},
                    {text: vcbl[lang]["typeGridClipboard"],dataIndex: 'type',width: 75},
                    {xtype: 'actioncolumn',width: 50,align: 'center',items: [
                        {iconCls: 'del_but', tooltip: vcbl[lang]['remElGridClipboard'], handler: function(grid,rI,cI,item,e,rec){
                            win.delElClipboard(rI);
                        }}
                    ]}
                ]
            },
            listeners: {
                'select': function(grid,rec,ind){
                    win.updateButClipboard();
                },
                'rowdblclick': function(grid,rec,el,rI){
                    pasteFromClipboard(panel,rec.get('settings'));
                    win.close();
                }
            }
        });
        var butPaste=Ext.create('Ext.button.Button',{
            text: vcbl[lang]['pasteElGridClipboard'],
            cls: 'cta',
            disabled: true,
            handler: function(){
                if(listClipboard.getSelection().length>0){
                    pasteFromClipboard(panel,listClipboard.getSelection()[0].get('settings'));
                    win.close();
                }
            }
        });
        var butDel=Ext.create('Ext.button.Button',{
            text: vcbl[lang]["remElGridClipboard"],
            disabled: true,
            handler: function(){ win.delElClipboard(); }
        });
        var win=Ext.create('eikonWin', {
            title: vcbl[lang]["clipboardTitle"],
            height: 500,
            width: 750,
            bodyCls: 'forFlexGridWin',
            items: [listClipboard],
            updateButClipboard: function(){
                if(listClipboard.getSelection().length>0){ butPaste.enable(); butDel.enable(); }
                else { butPaste.disable(); butDel.disable(); }
            },
            delElClipboard: function(rI){
                if(listClipboard.getSelection().length>0 || rI===0 || !!rI){
                    if(rI===0 || !!rI) listClipboard.getStore().removeAt(rI);
                    else listClipboard.getStore().remove(listClipboard.getSelection()[0]);
                    var rec=listClipboard.getStore().getRange();
                    var clipboard=[];
                    rec.forEach(function(el){
                        clipboard.push({name: el.get('name'), reportName: el.get('reportName'), type: el.get('type'), settings: el.get('settings')});
                    });
                    JET.Archive.put('clipboard',JSON.stringify(clipboard));
                    win.updateButClipboard();
                }
            },
            buttons: [butPaste,butDel,{
                text: vcbl[lang]["clearClipboard"],
                handler: function(){
                    JET.Archive.put('clipboard',false);
                    listClipboard.getStore().removeAll();
                    win.updateButClipboard();
                }
            },{ text: vcbl[lang]["cancelBut"], handler: function(){ win.close(); } }]
        }).show();
    } else return false;
}
function sendHit(featureName){
    if(!!JET.appHit){
        featureName=featureName.split(" ");
        for(var i=0;i<featureName.length;i++){
            featureName[i]=featureName[i].charAt(0).toUpperCase()+featureName[i].slice(1);
        }
        featureName=featureName.join("").slice(0,40);
        //alert(featureName+" - "+featureName.length);
        JET.appHit("CISFundamentals", "dsk");
        JET.appHit("CISFundamentals", "dsk", featureName);
        //JET.appHit('CISFundamentals', 'app', 'test');
        //JET.appHit('CISFundamentals', 've', 'test');
    }
}