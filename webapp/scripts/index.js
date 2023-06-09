var saveBut=Ext.create('Ext.button.Split',{
    tooltip: vcbl[lang]["saveBut"],
    iconCls: 'icon-save',
    cls: 'eikonSplitBut',
    width: '',
    menu: Ext.create('Ext.menu.Menu', {
        iconAlign: 'right',
        cls: 'splitBodyMod',
        defaults: {height: 24},
        items: [{ xtype: "button", textAlign: "left", text:vcbl[lang]["saveBut"], handler: function(){ saveBut.handler(); } },
            { xtype: "button", textAlign: "left", text:vcbl[lang]["saveAsBut"], handler: function(){centerPanel.saveAsReport();} }]
    }),
    handler: function(){centerPanel.saveAsReport();}
});
var showPanelMenuBut=Ext.create('Ext.Button',{
    tooltip: vcbl[lang]["showMultiPanelMenu"], iconCls: 'icon-menu', enableToggle: true, pressed: defaultEnablePanelMenu,
    listeners: {'toggle': function(but,pressed){
        if(pressed)but.setTooltip(vcbl[lang]["hideMultiPanelMenu"]);
        else but.setTooltip(vcbl[lang]["showMultiPanelMenu"]);
        showMultiPanelMenu(centerPanel.getComponent(2),pressed);
    }}
});
var filtersBut=Ext.create('Ext.Button',{
    tooltip: vcbl[lang]["filterPanelTitle"], iconCls: 'icon-filter', enableToggle: true, pressed: false,
    listeners: {'toggle': function(but,pressed){
        if(centerPanel.flagMP==='startpanel')return;
        var filterPanel=centerPanel.getComponent(0);
        if(pressed)filterPanel.show();
        else filterPanel.hide();
        saveInJET('filters but');
    }}
});
var labelHeader=Ext.create('Ext.form.Label',{ text: "",cls: 'eikonLabelHeader',width: 'auto' });
var showListReportsBut=Ext.create('Ext.Button',{ tooltip: vcbl[lang]["listReports"], iconCls: 'icon-text',
    handler: function(){ showListReports(); }
});
var createNewReport=Ext.create('Ext.Button',{ tooltip: vcbl[lang]["createNewReport"], iconCls: 'icon-add-to-file',
    handler: function(){ centerPanel.callback=function(){centerPanel.clearReport(true);}; centerPanel.warningUnsaved(); }
});
var alertBut=Ext.create('Ext.Button',{ tooltip: vcbl[lang]["tooltipAlert"], iconCls: 'icon-set-alert', hidden: true,
    handler: function(){ this.setFlagAnim(false); }
});

var headerPanel=Ext.create('Ext.panel.Panel', {
    region: 'north',
    dockedItems: [{
        xtype: 'toolbar',
        cls: 'level1',
        height: 30,
        dock: 'bottom',
        defaults: {width: 23},
        items: [labelHeader,'->',saveBut,'-',createNewReport,showListReportsBut,showPanelMenuBut,filtersBut,
            {iconCls: 'icon-settings',tooltip: vcbl[lang]["globalSettings"],handler: function(){globalSetWin();}},
            {iconCls: 'icon-support',tooltip: vcbl[lang]["helpFAQText"],handler: function(){
                JET.navigate({url: "http://emea1.apps.cp.thomsonreuters.com/cms/?pageid=kortes-app-manual"});
            }},alertBut]
    }],
    /*html: '<div class="colorBlock-betabar">'+
'<span class="colorBlock-header-span">Preview</span>'+vcbl[lang]["inDevelopment"]+"["+version+"]"+
//'<span><a class="links-alt-color">'+vcbl[lang]["seeWhatsChanging"]+'</a></span>'+
'<span class="page-title-item-right"><a class="links-alt-color" href="mailto:support.kortes@thomsonreuters.com?subject=CIS COMMODITIES FUNDAMENTALS feedback"><span class="icon-feedback"></span> '+vcbl[lang]["sendFeedback"]+'</a></span>'+
'<span id="for_test"></span>'+
'</div>',*/
    hideBut: function(){ this.getDockedItems('toolbar[dock="bottom"]')[0].hide(); },
    showBut: function(){ this.getDockedItems('toolbar[dock="bottom"]')[0].show(); }
});
var centerPanel=Ext.create('Ext.panel.Panel', {
    title: "",
    region: 'center',
    layout: 'border',
    grids: [],
    charts: [],
    filters: [],
    ifOneEl: true,
    startType: "gridpanel",
    items: [Ext.create('Ext.panel.Panel', {
        hidden: !filtersBut.pressed,
        region: 'north',
        split: true,
        minHeight: 70,
        maxHeight: 250,
        items: []
    }),Ext.create('Ext.panel.Panel', {
        region: 'center',
        flagMP: 'mainpanel',
        layout: 'border',
        items: [Ext.create('multiPanel', { split: true, isEdit: true, region: 'center' })]
    })],
    callback: function(){},
    warningUnsaved: function(){
        findUnsavedItem(this.getComponent(2),(this.startType!=='multiPanel'),false);
        findUnsavedFilters(this.getComponent(2),(this.startType!=='multiPanel'),false);
        var unsavedFlag=false;
        for(var key in newItems) if(newItems[key])      unsavedFlag=true;
        for(var key in editItems) if(editItems[key])    unsavedFlag=true;
        for(var key in delItems) if(delItems[key])      unsavedFlag=true;
        for(var key in newFilters) if(newFilters[key])  unsavedFlag=true;
        for(var key in editFilters) if(editFilters[key])unsavedFlag=true;
        for(var key in delFilters) if(delFilters[key])  unsavedFlag=true;
        if(unsavedFlag){
            var unsavedWin=Ext.create('eikonDialog').show({
                title: vcbl[lang]["statusTitle"],
                message: vcbl[lang]["unsavedReportMes"],
                buttons: Ext.Msg.YESNOCANCEL,
                fn: function(btn){
                    if(btn==='yes'){ saveBut.handler(); }
                    else if(btn==='no'){ centerPanel.callback(); }
                    else if(btn==='cancel'){ centerPanel.callback=function(){}; }
                }
            });
        } else centerPanel.callback();
    },
    saveReport: function(){preSaveMultiPanel(this.getComponent(2),false);},
    saveAsReport: function(){saveAsMultiPanel(this.getComponent(2));},
    resetUnsavedAr: function(){
        newFilters=new Object();
        editFilters=new Object();
        delFilters=new Object();
        newItems=new Object();
        editItems=new Object();
        delItems=new Object();
    },
    clearFilters: function(){
        this.getComponent(0).removeAll();
        this.filters=new Array();
        this.getComponent(0).add({xtype:'panel',isLabelEmpty: true,border: false,
            layout: { type: 'vbox', align: 'center', pack: 'center' },
            items: [{ xtype: 'label',cls: 'eikonLabel',width: 350,
html: '<div style="text-align: center;"><br><span class="icon-filter-big"></span><br>'+vcbl[lang]["emptyTextFilter"]+'</div>'
            }]
        });
    },
    viewReport: function(rec){
        this.clearFilters();
        this.callback=function(){};
        this.reportID=rec.get('reportID');
        this.startType=rec.get('startType');
        labelHeader.setText(rec.get('text'));
        this.grids=[];
        this.charts=[];
        if(rec.get('startType')==="multiPanel")saveBut.setHandler(function(){centerPanel.saveReport();});
        else saveBut.setHandler(function(){centerPanel.saveAsReport();});
        loadFilterPanel(this.getComponent(0),this.getComponent(2));
        this.updateMainBut();
    },
    clearReport: function(forJET){
        if(forJET===undefined)forJET=false;
        centerPanel.ifOneEl=true;
        this.resetUnsavedAr();
        this.clearFilters();
        this.callback=function(){};
        this.getComponent(2).removeAll();
        this.getComponent(2).add(Ext.create('multiPanel', { split: true, isEdit: true }));
        labelHeader.setText("");
        this.reportID=0;
        this.startType="gridpanel";
        this.nameAs=null;
        this.grids=[];
        this.charts=[];
        this.forJET=false;
        saveBut.setHandler(function(){centerPanel.saveAsReport();});
        showPanelMenuBut.toggle(defaultEnablePanelMenu);
        fullInfoPanel.clearFI();
        this.updateMainBut();
        if(forJET){ saveInJET('clear report'); clearJET(); }
    },
    updateMainBut: function(){
        var flag=false;
        if(!!this.grids && this.grids.length>0) flag=true;
        else if(!!this.charts && this.charts.length>0) flag=true;
        if(flag){
            saveBut.show();
            createNewReport.show();
            showPanelMenuBut.show();
            filtersBut.show();
        } else {
            saveBut.hide();
            createNewReport.hide();
            showPanelMenuBut.hide();
            filtersBut.hide();
            filtersBut.toggle(false);
        }
    }
});
var fullInfoPanel=Ext.create('Ext.panel.Panel', {
    region: 'south',
    dockedItems: [{
        xtype: 'toolbar',
        cls: 'level2',
        height: 30,
        dock: 'top',
        defaults: {width: 23},
        items: [{xtype: 'tbtext', html: vcbl[lang]["fullInfo"]},'->',
            {xtype: 'button', iconCls: "icon-cross-2", handler: function(){fullInfoPanel.clearFI();}}]
    }],
    hidden: true,
    split: true,
    layout: 'fit',
    bodyPadding: 10,
    height: 110,
    items: [{ xtype: 'textareafield' }],
    setFI: function(text){ this.getComponent(0).setValue(text); },
    clearFI: function(){ this.getComponent(0).setValue("");this.hide(); }
});

if (navigator.userAgent.indexOf('EikonViewer') < 0) { EikonNow.init(); }
//Ext.onReady(function(){ getDS(); });JET.getUserInfo().then(function(info){console.dir(info)});
JET.onLoad(function(){
    JET.getUserInfo().then(function(info){
        userID=JSON.stringify(info);
        getUserID();
    });
});

function getUserID(){
    Ext.Ajax.request({
        method: 'GET',
        url: '/kortes/service/getUserID/',
        params: {lang: lang, userInfo: userID},
        success: function(response){
            if(response.responseText==="AD"){
                new Ext.create('eikonWin',{
                title: vcbl[lang]["errorAccessDenied"],
                html: "Commodities Fundamentals App  provides a single database of commodities data across Russia and the Commonwealth of Independent States (CIS) using pivot tables. The app brings out the fundamentals, supply, demand and other key elements that help shape commodities trading across the region. "+
"<br>Datasets included with the app cover:"+
"<br>•	Coal mining in Russia"+
"<br>•	Crude oil and gas production in Ukraine"+
"<br>•	Crude oil production in Kazakhstan"+
"<br>•	Petroleum products output by Kazakhstan and Ukraine refineries"+
"<br>•	Petroleum products output by Russian refineries"+
"<br>•	Russian oil refinery maintenance schedule and capacity outages"+
"<br>•	Russian railroad flows"+
"<br>•	Shipments of petroleum products to Russia"+
"<br>•	Shipping orders of freights by Russian railway"+
"<br>•	Statistic of foreign trade of the Russian Federation (metals)"+
"<br>•	Stocks of petroleum products at refineries  of Kazakhstan and Ukraine"+
"<br>•	Russian refinery process unit utilization"+
"<br>•	Volume of transshipments at Russian cargo ports"+
"<br>•	Volume of oil refining by Kazakhstan and Ukraine  refineries"+
"<br>•	Volume of oil refining by Russian refineries"+
"<br>•	Refinery maintenance<br><br>"+vcbl[lang]["errorAccessDenied"]+"<br><br><span style=\"font-weight: bold;\">To get the access, please contact:</span>"+
"<br>•	<a href=\"mailto:maria.vladimirova@refinitiv.com\">Maria Vladimirova</a> - <a href=\"mailto:maria.vladimirova@refinitiv.com\">maria.vladimirova@refinitiv.com</a>"+
"<br>•	<a href=\"mailto:evgenia.firsova@refinitiv.com\">Firsova Evgenia</a> - <a href=\"mailto:evgenia.firsova@refinitiv.com\">evgenia.firsova@refinitiv.com</a>"+
"<br>•	<a href=\"mailto:ivan.krasovskiy@refinitv.com\">Ivan Krasovskiy</a> - <a href=\"mailto:ivan.krasovskiy@refinitv.com\">ivan.krasovskiy@refinitv.com</a>",
                //height: 600,
                closable: false,
                draggable: false,
                width: 600,
                layout: 'fit',
                bodyPadding: '13 10 10 10',
            }).show();
            } else {
                userID=response.responseText*1;
                sendHit("STARTAPP");
                getDS();
            }
        },
        failure: function(){Ext.create('eikonDialog').alert(vcbl[lang]["statusTitle"],vcbl[lang]["errorLoadUserID"]);}
    });
}
function getDS(){
    Ext.Ajax.request({
        method: 'GET',
        url: '/kortes/service/datasources/',
        params: {lang: lang, userID: userID},
        success: function(response){
            arDS=JSON.parse(response.responseText);
            basicReport='<br><a href="javascript:showListReports(undefined,true,1);" class="links-alt-color">'+vcbl[lang]["myReportsText"]+
                '</a><br><a href="javascript:showListReports(undefined,true,2);" class="links-alt-color">'+vcbl[lang]["reportsText_2"]+'</a>';
            viewPage();
        },
        failure: function(){Ext.create('eikonDialog').alert(vcbl[lang]["statusTitle"],vcbl[lang]["errorLoadDS"]);}
    });
}
function viewPage(){
    mainPanel=Ext.create('Ext.container.Viewport', {
        layout: 'border',
        items: [headerPanel,centerPanel,fullInfoPanel]
    });
    centerPanel.clearReport();
    Ext.Ajax.on('beforerequest',function(conn,opt){
        if(opt.url.indexOf('mainsource')===-1 || opt.url.indexOf('mainsourceFull')) Ext.getBody().mask("",'loading');
    }, Ext.getBody());
    Ext.Ajax.on('requestcomplete',function(){Ext.getBody().unmask() } ,Ext.getBody());
    Ext.Ajax.on('requestexception',function(){Ext.getBody().unmask() }, Ext.getBody());
    if(reportIDGet!==0) showListReports(reportIDGet);
    else if(restoreFromJET()) loadFromJET();
    centerPanel.forJET=true;
}

function showMultiPanelMenu(panel,flag){
    if(panel===undefined || panel.items===undefined)return;
    for(var i=0;i<panel.items.length;i++){
        var item=panel.getComponent(i);
        if(item.getXType()==="multiPanel"){
            var rbar=item.getDockedItems('toolbar[dock="'+dockToolbar+'"]')[0];
            if(!!rbar && !!item.items && item.items.length===1){
                if(flag) {rbar.show();}
                else {rbar.hide();}
            }
            showMultiPanelMenu(item,flag);
        }
    }
}
function separatePanel(but,region){
    centerPanel.ifOneEl=false;
    var panelM=but.findParentByType('panel').findParentByType('panel');
    var panel=but.findParentByType('panel');
    if((region==="west" || region==="east") && panel.getSize().width<minSize*2){
        Ext.create('eikonDialog').alert(vcbl[lang]["statusTitle"],vcbl[lang]["errorSepMinWidthPanel"]);
        return false;
    } /*else if((region==="north" || region==="south") && panel.getSize().height<minSize*2){
        Ext.create('eikonDialog').alert(vcbl[lang]["statusTitle"],vcbl[lang]["errorSepMinHeightPanel"]);
        return false;
    }*/
    if(panelM.items.length<=1){
        panelM.add(Ext.create('multiPanel', {
            region: region,
            split: true,
            isEdit: true,
            dockedItems: [{ xtype: 'toolbarMP', hidden: !showPanelMenuBut.pressed }]
        }));
        panelM.updateLayout({defer: true});
    } else {
        var rem=panel.remove(panel.getComponent(0),false);
        var html=panel.getMPTitle();
        panel.setLayout('border');
        panel.setBorder('0 0 0 0');
        panel.removeDocked(panel.getDockedItems('toolbar[dock="'+dockToolbar+'"]')[0]);
        var emptyPanel=Ext.create('multiPanel', {
            region: region,
            split: true,
            border: '0 1 0 0',
            isEdit: true,
            dockedItems: [{ xtype: 'toolbarMP', hidden: !showPanelMenuBut.pressed }]
        });
        var remPanel=Ext.create('multiPanel', {
            border: '0 0 0 1',
            itemID: panel.itemID,
            itemIDAs: panel.itemIDAs,
            settings: panel.settings,
            prevSettings: panel.settings,
            multiSortLength: panel.multiSortLength,
            isEdit: true,
            isSeparated: true,
            dockedItems: [{ xtype: 'toolbarMP', hidden: !showPanelMenuBut.pressed }]
        });
        remPanel.removeAll(true);
        remPanel.add(rem);
        remPanel.changeMPTitle(html);
        remPanel.changeMPDownloadBut();
        panel.add([emptyPanel,remPanel]);
        panel.resetMP();
    }
    saveInJET('separate panel');
}
function delSeparatePanel(but){
    var panel=but.findParentByType('panel');
    var panelM=panel.findParentByType('panel');
    if(!!panel.unregInnerComp) panel.unregInnerComp();
    checkPanelForDelFilter(panel);
    delItems[panel.itemID]=true;
    var haveRemoved=false;
    if(panelM.items.length-1>1){
        panel.removeAll(true);
        if(panel.region==='center'){
            var panel2;
            for(var i=0;i<panelM.items.length;i++)
                if(panelM.getComponent(i).getXType()!=='bordersplitter' && panelM.getComponent(i).getId()!==panel.getId())
                    panel2=panelM.getComponent(i);
            while(panel2.items.length>0) {
                if(panel2.getComponent(0).getXType()==='bordersplitter') panel2.getComponent(0).destroy();
                else panel.moveAfter(panel2.getComponent(0));
            }
            panel.itemID=panel2.itemID;
            panel.itemIDAs=panel2.itemIDAs;
            panel.settings=panel2.settings;
            panel.prevSettings=panel2.settings,
            panel.isEdit=panel2.isEdit;
            panel.multiSortLength=panel2.multiSortLength;
            panel.changeMPTitle(panel2.getMPTitle());
            panel.changeMPDownloadBut();
            panel2.close();
        } else {
            panel.close();
            panel=panelM.getComponent(0);
        }
        haveRemoved=true;
    }
    if(panelM.flagMP!=='mainpanel'){
        panelM.itemID=panel.itemID;
        panelM.itemIDAs=panel.itemIDAs;
        panelM.settings=panel.settings;
        panelM.prevSettings=panel.settings,
        panelM.isEdit=panel.isEdit;
        panelM.multiSortLength=panel.multiSortLength;
        if(panel.getComponent(0).getXType()==='buttonsMultiPanel' || panel.getComponent(0).getXType()==='grid' || panel.getComponent(0).isChart!==undefined){
            if(panelM.getDockedItems('toolbar').length<1)
                panelM.addDocked({ xtype: 'toolbarMP', dock: dockToolbar, hidden: !showPanelMenuBut.pressed });
            else
                panelM.getDockedItems('toolbar')[0].show();
            panelM.setBorder('1 1 1 1');
            panelM.setLayout('fit');
            panelM.changeMPTitle(panel.getMPTitle());
            
        }
        while(panel.items.length>0) panelM.moveAfter(panel.getComponent(0));
        panel.close();
        panelM.changeMPDownloadBut();
    } else {
        centerPanel.ifOneEl=true;
        if(panelM.getComponent(0).items.length===1 && !haveRemoved && (panelM.getComponent(0).getComponent(0).getXType()==='grid'||panelM.getComponent(0).getComponent(0).isChart!==undefined)){
            centerPanel.clearReport();
        } else if(panelM.getComponent(0).items.length>1) {
            while(panel.items.length>0){
                if(panel.getComponent(0).getXType()==='bordersplitter') panel.getComponent(0).destroy();
                else panelM.moveAfter(panel.getComponent(0));
            }
            panel.close();
            panelM.getComponent(0).changeMPDownloadBut();
        }
        if(!!panel.getComponent(0) && !!panel.getComponent(0).updateBut){ panel.getComponent(0).updateBut(); }
    }
    centerPanel.updateMainBut();
    saveInJET('del separate panel');
}

function findUnsavedItem(panel,as,save){
    if(panel.items===undefined)return;
    for(var i=0;i<panel.items.length;i++){
        var item=panel.getComponent(i);
        if(as){
            if(item.getXType()==='grid' || !!item.isChart){
                if(save)newItems[panel.getItemId()]=true;
                else {
                    if(panel.itemID===0)newItems[panel.getItemId()]=true;
                    else if(panel.isEdit)editItems[panel.getItemId()]=true;
                }
            } else findUnsavedItem(item,as,save);
        } else {
            if(item.getXType()==='grid' || !!item.isChart){
                if(panel.itemID===0)newItems[panel.getItemId()]=true;
                else if(panel.isEdit)editItems[panel.getItemId()]=true;
            } else findUnsavedItem(item,as,save);
        }
    }
}

function startTakeReportID(panel,as){
    Ext.Ajax.request({
        method: 'POST',
        url: '/kortes/service/report/',
        params: {reportID: 0, panel: "", code: 'save', userID: userID, lang: lang},
        success: function(response){
            centerPanel.reportID=response.responseText;
            startTakeFilterID(panel,response.responseText,as);
        },
        failure: function(){Ext.create('eikonDialog').alert(vcbl[lang]["statusTitle"],vcbl[lang]["errorTakeReportID"]);}
    });
}
function deleteToReportID(rec,treePanel){
    if(treePanel.getStore().findNode('reportID',rec.get("reportID")).parentNode.get("reportID")!==272/*rec.get('startType')!=="multiPanel"*/){
        Ext.create('eikonDialog').alert(vcbl[lang]["statusTitle"],vcbl[lang]["cantDelete"]);
    } else {
        Ext.create('eikonDialog').show({
            title: vcbl[lang]["delReportTitle"],
            message: vcbl[lang]["wantToDelReport"]+": \""+rec.get('text')+"\"?",
            buttons: Ext.Msg.YESNO,
            fn: function(btn){
                if(btn==='yes'){
                    treePanel.getStore().remove(rec);
                    Ext.Ajax.request({
                        method: 'GET',
                        url: '/kortes/service/deleteReport/',
                        params: {reportID: rec.get('reportID'), userID: userID, lang: lang},
                        success: function(){
                            treePanel.getView().deselect(rec);
                            if(centerPanel.reportID+""===rec.get('reportID')+"") centerPanel.clearReport();
                        },
                        failure: function(){Ext.create('eikonDialog').alert(vcbl[lang]["statusTitle"],vcbl[lang]["errorDeleteReportID"]);}
                    });
                } else if(btn==='no'){ return false; }
            }
        });
    }
}

function startTakeItemID(panel,as){
    for(var key in newItems) if(newItems[key]) sendToItemID(panel,key);
    for(var key in editItems) if(editItems[key]) changeToItemID(panel,key);
    if(!!as) delItems={};
    else for(var key in delItems) if(delItems[key]) deleteToItemID(panel,key);
    endTakeItemID(panel);
}
function sendToItemID(panel,key){
    var panelNewItem=Ext.getCmp(key);
    var style=JSON.stringify(panelNewItem.settings);
    Ext.Ajax.request({
        method: 'POST',
        url: '/kortes/service/object/',
        params: {userID: userID, lang: lang, style: style, reportID: centerPanel.reportID},
        success: function(response){
            panelNewItem.itemID=response.responseText;
            panelNewItem.isEdit=false;
            newItems[key]=false;
            endTakeItemID(panel);
        },
        failure: function(){Ext.create('eikonDialog').alert(vcbl[lang]["statusTitle"],vcbl[lang]["errorSendToItemID"]);}
    });
}
function changeToItemID(panel,key){
    var panelNewItem=Ext.getCmp(key);
    var style=JSON.stringify(panelNewItem.settings);
    Ext.Ajax.request({
        method: 'POST',
        url: '/kortes/service/object/',
        params: {userID: userID, lang: lang, style: style, reportID: centerPanel.reportID,itemID: panelNewItem.itemID},
        success: function(){
            panelNewItem.isEdit=false;
            editItems[key]=false;
            endTakeItemID(panel);
        },
        failure: function(){Ext.create('eikonDialog').alert(vcbl[lang]["statusTitle"],vcbl[lang]["errorChangeToItemID"]);}
    });
}
function deleteToItemID(panel,key){
    Ext.Ajax.request({
        method: 'GET',
        url: '/kortes/service/deleteObject/',
        params: {userID: userID, lang: lang, itemID: key},
        success: function(){
            delItems[key]=false;
            endTakeItemID(panel);
        },
        failure: function(){Ext.create('eikonDialog').alert(vcbl[lang]["statusTitle"],vcbl[lang]["errorDeleteItemID"]);}
    });
}
function endTakeItemID(panel){
    for(var key in newItems) if(newItems[key])return;
    for(var key in editItems) if(editItems[key])return;
    for(var key in delItems) if(delItems[key])return;
    saveMultiPanel(panel);
}

function preSaveMultiPanel(panel,as){
    findUnsavedItem(panel,as,true);
    findUnsavedFilters(panel,as,true);
}
function saveMultiPanel(panel){
    var panelSave="["+parsePanelDOM(panel)+"]";
    Ext.Ajax.request({
        method: 'POST',
        url: '/kortes/service/report/',
        params: {reportID: centerPanel.reportID, panel: panelSave, code: 'save',userID: userID, lang: lang},
        success: function(){
            centerPanel.resetUnsavedAr();
            centerPanel.startType="multiPanel";
            if(centerPanel.nameAs!==null)saveNewReportName();
            //clearJET();
            Ext.create('eikonDialog').alert(vcbl[lang]["statusTitle"],vcbl[lang]["reportSaved"]);
            centerPanel.callback();
            saveInJET('after save');
        },
        failure: function(){Ext.create('eikonDialog').alert(vcbl[lang]["statusTitle"],vcbl[lang]["errorSaveMultiPanel"]);}
    });
}
function saveNewReportName(){
    Ext.Ajax.request({
        method: 'GET',
        url: '/kortes/service/menuAdd',
        params: {reportID: centerPanel.reportID, userID: userID, lang: lang,name: centerPanel.nameAs},
        success: function(){
            labelHeader.setText(centerPanel.nameAs);
            centerPanel.nameAs=null;
            saveBut.setHandler(function(){centerPanel.saveReport();});
            saveInJET("save new name report");
        },
        failure: function(){Ext.create('eikonDialog').alert(vcbl[lang]["statusTitle"],vcbl[lang]["errorSaveNewReportName"]);}
    });
}
function saveAsMultiPanel(panel){
    var nameNewReport=Ext.create('Ext.form.field.Text', {
        fieldLabel: vcbl[lang]["nameLong"],
        minLength: 4,
        itemId: 'nameNewReport',
        allowBlank: false,
        enableKeyEvents: true,
        listeners: {
            'keypress': function(field,event){ if(event.getCharCode()===13) saveBut.handler(); }
        }
    });
    var saveBut=Ext.create('Ext.Button', {
        cls: 'cta',
        text: vcbl[lang]["saveBut"],
        handler: function() {
            nameNewReport.setValue(nameNewReport.getValue().trim());
            if(nameNewReport.isValid()){
                centerPanel.nameAs=nameNewReport.getValue();
                preSaveMultiPanel(panel,true);
                win.destroy();
            }
        }
    });
    var win=Ext.create('eikonWin', {
        title: vcbl[lang]["createTemplate"],
        height: 117,
        width: 750,
        defaultFocus: 'nameNewReport',
        items: [nameNewReport],
        buttons: [saveBut,{ text: vcbl[lang]["cancelBut"], handler: function() { win.close(); } }]
    }).show();
}

function parsePanelDOM(panel,forJET){
    if(forJET===undefined)forJET=false;
    var ans=new Array();
    var widthPanel=panel.getWidth();
    var heightPanel=panel.getHeight();
    for(var i=0;i<panel.items.length;i++){
        var item=panel.getComponent(i);
        if(item.getXType()==='multiPanel' || item.getXType()==='grid'){
            var widthItem=item.getWidth();
            var heightItem=item.getHeight();
            var w=Math.floor((widthItem/widthPanel).toFixed(2)*100)+"%";
            var h=Math.floor((heightItem/heightPanel).toFixed(2)*100)+"%";
            var border=', "border": 0';
            var items="";
            var dockedItems="";
            var region="";
            var itemID=', "itemID": '+(item.itemID!==""?item.itemID:0);
            var isEdit="";
            if(item.isEdit!==undefined)isEdit=', "isEdit": '+item.isEdit;
            var settings=forJET?', "settings": '+JSON.stringify(item.settings):"";
            if(item.region!==undefined)region=', "region": "'+item.region+'"';
            if(item.items!==undefined && item.getComponent(0)!==undefined){
                if(item.getComponent(0).getXType()!=='buttonsMultiPanel'){
                    if(item.getComponent(0).getXType()==='grid'){
                        items=', "items": []';
                        border=item.border!==undefined?(', "border": "' +item.border+'"'):"";
                    }
                    else items=', "items": ['+parsePanelDOM(item,forJET)+']';
                    //if(item.getComponent(0).getXType()!=='grid') dockedItems=', "dockedItems": []';
                } else border=item.border!==undefined?(', "border": "' +item.border+'"'):"";
            }
            ans.push('{"xtype": "'+item.getXType()+'"'+region+', "layout": "'+item.layout.initialConfig.type+'", "width": "'+w+'", "height": "'+h+'"'+border+itemID+', "split": true'+isEdit+items+dockedItems+settings+' }');
        }
    }
    return ans.join(",");
}

function loadReportPanel(panel){
    Ext.Ajax.request({
        method: 'POST',
        url: '/kortes/service/report/',
        params: {reportID: centerPanel.reportID, code: 'load', userID: userID, lang: lang},
        success: function(response){
            panel.removeAll();
            panel.setLayout({type: 'border'});
            panel.add(JSON.parse(response.responseText));
        },
        failure: function(){Ext.create('eikonDialog').alert(vcbl[lang]["statusTitle"],vcbl[lang]["errorLoadReportPanel"]);}
    });
}

function selectionWin(but){
    var panel=but.findParentByType('panel');
    if(panel.getComponent(0)!==undefined)
        if(panel.getComponent(0).getXType()==='grid' || panel.getComponent(0).isChart){
            showTableSetWin(panel,panel.getComponent(0).getItemId());
        }
}

function dowloadContent(but,formatFile){
    var panel=but.findParentByType('panel');
    if(!!panel.getComponent(0)){
        if(panel.getComponent(0).getXType()==="grid"){
            if(panel.totalCountRec>panel.maxLengthLoadRec){
                var listButton={ ok:'OK', cancel:'Cancel' };
                if(enDownloadAllRecords){
                    listButton={ ok:'OK', no:'Download all', cancel:'Cancel' };
                }
                Ext.create('eikonDialog').show({
                    title: vcbl[lang]["warningText"],
                    message: vcbl[lang]["warningExcelPart1"]+" "+panel.maxLengthLoadRec+" "+vcbl[lang]["warningExcelPart2"]+" "+panel.totalCountRec+""+vcbl[lang]["warningExcelPart3"],
                    buttonText: listButton,
                    fn: function(btn){
                        if(btn==='ok'){
                            loadExcelFile(panel);
                        } else if(btn==='no'){
                            checkingEvent('loadAll');
                        } 
                    }
                });
            } else { loadExcelFile(panel); }
        } else if(panel.getComponent(0).isChart) panel.getComponent(0).loadChartSVG(panel,formatFile);
    } else return false;
}
function loadExcelFile(panel){
    var indexDsID=findIndexByKeyValue(arDS,'dataIndex',panel.settings.dsID);
    var tableName="";
    if(indexDsID!==null) tableName=arDS[indexDsID].text;
    tableName=Date.now();
    var inputs='<input type="hidden" name="itemID" value="'+panel.itemID+'" />';
    inputs+='<input type="hidden" name="userID" value="'+userID+'" />';
    inputs+='<input type="hidden" name="reportName" value="'+labelHeader.text+'" />';
    inputs+='<input type="hidden" name="tableName" value="'+tableName+'" />';
    inputs+='<input type="hidden" name="lang" value="'+lang+'" />';
    inputs+="<input type='hidden' name='setting' value='"+JSON.stringify(panel.settings)+"' />";
    jQuery('<form action="/kortes/service/xlsdata/" method="post">'+inputs+'</form>').appendTo('body').submit().remove();
}

function addNewFolder(treePanel){
    var newNameFolder=Ext.create('Ext.form.field.Text',{
        fieldLabel: vcbl[lang]["nameLong"],
        minLength: 4,
        itemId: 'nameNewFolder',
        allowBlank: false
    });
    var win=Ext.create('eikonWin', {
        title: vcbl[lang]["addingFolders"],
        height: 117,
        width: 600,
        defaultFocus: 'nameNewFolder',
        items: [newNameFolder],
        buttons: [{
            text: vcbl[lang]["saveBut"],
            handler: function() {
                if(newNameFolder.isValid()){
                    Ext.Ajax.request({
                        method: 'GET',
                        url: '/kortes/service/menuFolderAdd/',
                        params: {ownerID: 272, userID: userID, lang: lang,name: newNameFolder.getValue()},
                        success: function(response){
                            var node=treePanel.getStore().findNode('reportID',272);
                            node=node.appendChild({text:newNameFolder.getValue(),expanded:false,children:[],leaf:false,tabAdd:false,reportID:response.responseText});
                            win.close();
                        },
                        failure: function(){win.close();Ext.create('eikonDialog').alert(vcbl[lang]["statusTitle"],vcbl[lang]["errorAddFolder"]);}
                    });
                }
            }
        }]
    }).show();
}
function showListReports(fromGet,collapseAll,numFolder){
    var treePanel=Ext.create('Ext.tree.Panel', {
        lines: false,
        cls: 'treeMod',
        //margin: '0 0 3 0',
        store: Ext.create('Ext.data.TreeStore', {
            proxy: {
                actionMethods: {read: 'GET'},
                extraParams: {userID: userID, lang: lang},
                type: 'ajax',
                timeout: timeoutAjax,
                url : '/kortes/service/menu/',
                reader: { type: 'json' }
            },
            listeners: {'load': function(store,recs,suc){
                if(!suc) Ext.create('eikonDialog').alert(vcbl[lang]["statusTitle"],vcbl[lang]["errorLoadListReports"]);
                else if(!!fromGet){
                    var fromRec=store.findNode('reportID',fromGet);
                    if(!!fromRec && !!fromRec.get('leaf')) centerPanel.viewReport(fromRec);
                    return false;
                }
                if(!!collapseAll){
                    if(numFolder===1){
                        var nodeTree=store.findRecord('text',vcbl[lang]["myReportsText"]);
                        treePanel.collapseAll();
                        treePanel.setSelection(nodeTree);
                        treePanel.expandNode(nodeTree);
                    }
                    else if(numFolder===2){
                        var nodeTree=store.findRecord('text',vcbl[lang]["reportsText"]);
                        treePanel.collapseAll();
                        treePanel.setSelection(nodeTree);
                        treePanel.expandNode(nodeTree);
                    }
                }
                if(centerPanel.reportID!==0){treePanel.setSelection(store.findRecord('reportID',centerPanel.reportID));}
            }}
        }),
        rootVisible: false,
        listeners: {
            'selectionchange': function(sm,selected,eOpts){
                if(!!selected[0] && selected[0].get('leaf')) applyBut.enable();
                else applyBut.disable();
            },
            'itemdblclick': function(view,rec){
                if(rec.get('leaf') && rec.get('reportID')!==centerPanel.reportID){
                    centerPanel.callback=function(){
                        if(rec.get('startType')==='gridpanel'){ isFirst.main=true; }
                        centerPanel.viewReport(rec);
                    };
                    centerPanel.warningUnsaved();
                    win.close();
                }
            },
            'itemcontextmenu': function(view,rec,item,index,e){
                var position=e.getXY();
                e.stopEvent();
                Ext.create('Ext.menu.Menu',{
                    items:[{
                            text: vcbl[lang]["inCurWin"],
                            handler: function(){
                                if(rec.get('leaf') && rec.get('reportID')!==centerPanel.reportID){
                                    centerPanel.callback=function(){
                                        if(rec.get('startType')==='gridpanel'){ isFirst.main=true; }
                                        centerPanel.viewReport(rec);
                                    };
                                    centerPanel.warningUnsaved();
                                    win.close();
                                }
                            }
                        },{
                            text: vcbl[lang]["inNewWin"],
                            handler: function(){ JET.navigate({url: reloadOtherLink(rec.get('reportID'))}); }
                        },{
                            text: vcbl[lang]["addFolderBut"],
                            handler: function(){ addNewFolder(treePanel); }
                        },{
                            text: vcbl[lang]["deleteReportBut"],
                            handler: function(){ deleteToReportID(rec,treePanel); }
                        }],
                    listeners: { 'mouseleave': function(menu){ menu.hide(); } }
                }).showAt(position);
            }
        }
    });
    var applyBut=new Ext.create('Ext.Button',{
        text: vcbl[lang]["openBut"],
        disabled: true,
        cls: 'cta',
        handler: function(){
            var selreport=treePanel.getSelectionModel().getSelection()[0];
            if(selreport!==undefined && selreport.get('leaf') && selreport.get('reportID')!==centerPanel.reportID){
                centerPanel.callback=function(){
                    if(selreport.get('startType')==='gridpanel'){ isFirst.main=true; }
                    centerPanel.viewReport(selreport);
                };
                centerPanel.warningUnsaved();
                win.close();
            }
        }
    });
    var win=Ext.create('eikonWin', {
        title: vcbl[lang]["listReports"],
        resizable: false,
        scrollable: false,
        height: 510,
        width: 400,
        bodyPadding: '13 10 7 10',
        layout: 'fit',
        items: [treePanel],
        buttons: [applyBut,{text: vcbl[lang]["cancelBut"],handler: function(){ win.close(); }}]
    });
    if(fromGet===undefined) win.show();
}

function globalSetWin(){
    var langSet=Ext.create('Ext.form.ComboBox',{
        fieldLabel: vcbl[lang]["lang"],
        store: Ext.create('Ext.data.Store', {
            fields: ['abbr', 'name'],
            data: [{"abbr":"RUS","name":"Русский"},
                {"abbr":"ENG","name":"English"}]
        }),
        editable: false,
        queryMode: 'local',
        displayField: 'name',
        valueField: 'abbr',
        value: lang
    });
    var toolbarDockSet=Ext.create('Ext.form.ComboBox',{
        fieldLabel: vcbl[lang]["toolbarDockSet"],
        store: Ext.create('Ext.data.Store', {
            fields: ['abbr', 'name'],
            data: [{"abbr":"top","name":vcbl[lang]["toolbarDockSetTop"]},
                {"abbr":"bottom","name":vcbl[lang]["toolbarDockSetBottom"]},
                {"abbr":"left","name":vcbl[lang]["toolbarDockSetLeft"]},
                {"abbr":"right","name":vcbl[lang]["toolbarDockSetRight"]}]
        }),
        editable: false,
        queryMode: 'local',
        displayField: 'name',
        valueField: 'abbr',
        value: dockToolbar
    });
    var win=Ext.create('eikonWin',{
        title: vcbl[lang]["globalSettings"],
        height: 145,
        width: 330,
        resizable: false,
        defaults: {labelWidth: 150},
        items: [langSet,toolbarDockSet],
        buttons: [{
            cls: 'cta',
            text: vcbl[lang]["applyBut"],handler: function(){
                window.location.assign(reloadOtherLink(null,langSet.getValue(),toolbarDockSet.getValue()));
                win.close();
            }
        },{ text: vcbl[lang]["cancelBut"],handler: function(){win.close();} }]
    }).show();
}

function checkingEvent(flag){
    var runner=new Ext.util.TaskRunner();
    var interval=1000;
    task=runner.newTask({
        run: function(){
            /*Ext.Ajax.request({
                method: 'GET',
                url: ' ',
                params: {userID: userID, lang: lang},
                success: function(response){ },
                failure: function(){ }
            });*/

            //test block start
            if(!!task.count) task.count++;
            else task.count=1;
            if(task.count!==3) return;
            //test block end
            
            task.stop();
            animate(alertBut,1,1,"#F5475B","white",interval);
        },
        interval: interval
    });
    task.start();
}