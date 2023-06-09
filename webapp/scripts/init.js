//for vcbl.js
var reportIDGet=defReportIDGet=0,
    lang=defLang="ENG",
    dockToolbar=defDockToolbar="top",
    get=location.search.toString();
    
if(get!==''){
    var tmp=[],tmp2=[];
    tmp=(get.substr(1)).split('&');
    for(var i=0;i<tmp.length;i++) {
        tmp2=tmp[i].split('=');
        if(tmp2[0]==="lang") lang=tmp2[1];
        else if(tmp2[0]==="reportID"){ reportIDGet=tmp2[1]*1; }
        else if(tmp2[0]==="dockToolbar"){ dockToolbar=tmp2[1]; }
    }
}

//for filtersWin.js
var newFilters={};
var editFilters={};
var delFilters={};

Ext.define('Override.form.field.VTypes', {
    override: 'Ext.form.field.VTypes',
    year: function(value){ return this.yearRe.test(value); },
    yearRe: /^\d{4}$/i,
    yearText: vcbl[lang]["regexpYear"],
    yearMask: /[\d]/i,
    
    yearList: function(value){ return this.yearListRe.test(value); },
    yearListRe: /^(\d{4})(,\d{4})*$/i,
    yearListText: vcbl[lang]["regexpYearList"],
    yearListMask: /[\d,]/i,
    
    quarter: function(value){ return this.quarterRe.test(value); },
    quarterRe: /^[1234]{1}$/i,
    quarterText: vcbl[lang]["regexpQuarter"],
    quarterMask: /[1234]/i,
    
    quarterList: function(value){ return this.quarterListRe.test(value); },
    quarterListRe: /^([1234]{1})(,[1234]{1})*$/i,
    quarterListText: vcbl[lang]["regexpQuarterList"],
    quarterListMask: /[1234,]/i,
    
    month: function(value){ return this.monthRe.test(value); },
    monthRe: /^1?\d{1}$/i,
    monthText: vcbl[lang]["regexpMonth"],
    monthMask: /[\d]/i,
    
    monthList: function(value){ return this.monthListRe.test(value); },
    monthListRe: /^(1?\d{1})(,1?\d{1})*$/i,
    monthListText: vcbl[lang]["regexpMonthList"],
    monthListMask: /[\d,]/i,
    
    digit: function(value){ return this.digitRe.test(value); },
    digitRe: /^\d+$/i,
    digitText: vcbl[lang]["regexpDigit"],
    digitMask: /[\d\.]/i,
    
    digitList: function(value){ return this.digitListRe.test(value); },
    digitListRe: /^(\d+)(,\d+)*$/i,
    digitListText: vcbl[lang]["regexpDigitList"],
    digitListMask: /[\d\.,]/i
});

//for index.js
var userID=1;
var isFirst={main: false, el: 0};
var version="0.122.4";//первое число - общее,2-е Дмитрий, 3-е Андрей
var newItems={};
var editItems={};
var delItems={};
var arDS=[];
var basicReport=[];
var sizeSetWin={height: 600,width: 800};
var maxDeepPivot=3;
var minSize=295;
var enSankey=true;
var enBubble=false;
var enTreemap=true;
var enDownloadAllRecords=false;
var timeoutAjax=180000;
var delayLoadMask=1000;
var maxLengthLoadRec=10000;
var defaultEnablePanelMenu=false;
var task=null;
var defaultFont="12px ProximaNova, EikonFont, Arial, Helvetica, sans-serif";

var mainPanel;

Ext.define('toolbarMP', {
    extend: 'Ext.toolbar.Toolbar',
    xtype: 'toolbarMP',
    dock: dockToolbar,
    height: 30,
    hidden: true,
    cls: 'level2',
    defaults: { tooltipType: 'title', width: 23 },
    changeDownloadBut: function(type){
        if(type==="grid") this.getComponent(this.items.length-2).setForGrid();
        else if(type==="chart") this.getComponent(this.items.length-2).setForChart();
        return this;
    },
    changeVisibleBut: function(){
        var type='empty';
        var tempPanel=this.findParentByType('multiPanel');
        var set=tempPanel.settings;
        var arBut={};
        if(set!==0) type=set.xtype;
        for(var i=0;i<this.items.length;i++){
            var el=this.getComponent(i);
            arBut[el.idBut]=el;
        }
        arBut.paste.hide();
        arBut.copy.hide();
        arBut.tochart.hide();
        arBut.set.hide();
        arBut.sort.hide();
        arBut.save.hide();
        arBut.left.hide();
        arBut.right.hide();
        arBut.top.hide();
        arBut.bottom.hide();
        if(type==='empty'){
            arBut.paste.show();
        } else if(type==='grid'){
            arBut.paste.show();
            arBut.copy.show();
            arBut.tochart.show();
            arBut.set.show();
            arBut.sort.show();
            arBut.save.show();
            arBut.left.show();
            arBut.right.show();
            arBut.top.show();
            arBut.bottom.show();
        } else if(type==='chart'){
            arBut.paste.show();
            arBut.copy.show();
            arBut.tochart.show();
            arBut.set.show();
            arBut.save.show();
            arBut.left.show();
            arBut.right.show();
            arBut.top.show();
            arBut.bottom.show();
        }
    },
    changeTitle: function(html){ this.getComponent(0).update(html); },
    setTitleWidth: function(w){ this.getComponent(0).setWidth(w); },
    items: [
    (dockToolbar==='top'?
        {xtype: 'label',html: '',style: { 'white-space': 'nowrap','overflow': 'hidden','text-overflow': 'ellipsis','display': 'inline-block' } }:null),
    (dockToolbar==='top'||dockToolbar==='bottom'?'->':null),
    { iconCls: 'icon-paste', idBut: 'paste', tooltip: vcbl[lang]["pasteFromClipboard"], handler: function(but){ viewClipboard(but); } },
    { iconCls: 'icon-copy', idBut: 'copy', tooltip: vcbl[lang]["copyToClipboard"], handler: function(but){ copyToClipboard(but); } },
    { iconCls: 'icon-grid-to-chart', idBut: 'tochart', tooltip: vcbl[lang]["chartToGrid"], handler: function(but){ showChartSetWin(but); } },
    { iconCls: 'icon-settings', idBut: 'set', tooltip: vcbl[lang]["tooltipChangeSettings"], handler: function(but){selectionWin(but);} },
    { iconCls: 'icon-sort', idBut: 'sort', tooltip: vcbl[lang]["sortWinTitle"], handler: function(but){ showSortWin(but); } },
    { iconCls: 'icon-dockleft', idBut: 'left', tooltip: vcbl[lang]["tooltipSplitVerticallyL"], handler: function(but){separatePanel(but,'west');} },
    { iconCls: 'icon-dockright', idBut: 'right', tooltip: vcbl[lang]["tooltipSplitVerticallyR"], handler: function(but){separatePanel(but,'east');} },
    { iconCls: 'icon-docktop', idBut: 'top', tooltip: vcbl[lang]["tooltipSplitHorizontallyT"], handler: function(but){separatePanel(but,'north');} },
    { iconCls: 'icon-dockbottom', idBut: 'bottom', tooltip: vcbl[lang]["tooltipSplitHorizontallyB"], handler: function(but){separatePanel(but,'south');} },
    { iconCls: 'icon-excel', idBut: 'save', tooltip: vcbl[lang]["tooltipDownloadXLS"],
        xtype: 'splitbutton',
        setForChart: function(){
            var but=this;
            this.setHandler(function(){dowloadContent(but,'base64ToPNG');});//old flag 'png' is worked too!
            this.setMenu(Ext.create('Ext.menu.Menu', {
                items: [{ xtype: "button", textAlign: "left", text:"as SVG", tooltip: vcbl[lang]["tooltipDownloadSVG"], handler: function(){ dowloadContent(but,'svg');} },
                    { xtype: "button", textAlign: "left", text:"as PNG", tooltip: vcbl[lang]["tooltipDownloadPNG"], handler: function(){ dowloadContent(but,'base64ToPNG');} }]
            }));
            this.addCls('eikonSplitBut');
            this.setConfig({tooltip: vcbl[lang]["tooltipDownloadPNG"],arrowVisible: true,iconCls: 'icon-save',width: 54});
            this.findParentByType('toolbar').updateLayout();
        },
        setForGrid: function(){
            if(!!this.menu) this.menu.close();
            this.removeCls('eikonSplitBut');
            this.setConfig({tooltip: vcbl[lang]["tooltipDownloadXLS"],arrowVisible: false,iconCls: 'icon-excel',width: 23});
            this.setHandler(dowloadContent,this);
            this.findParentByType('toolbar').updateLayout();
        }
    },
    { iconCls: 'icon-cross-2', idBut: 'del', tooltip: vcbl[lang]["tooltipClose"], handler: function(but){delSeparatePanel(but);} }]
 });
Ext.define('buttonsMultiPanel', {
    extend: 'Ext.panel.Panel',
    xtype: 'buttonsMultiPanel',
    border: 0,
    innerBut: null,
    layout: { type: 'vbox', align: 'center', pack: 'center' },
    updateBut: function(){
        if(!!this.innerBut) this.innerBut.updateButHtml();
    },
    listeners: {
        'afterrender': function(p){
            p.innerBut=p.add({
                xtype:'panel',
                bodyCls: 'eikonLabel',
                border: false,
                html: "",
                updateButHtml: function(){
                    var butHtml='<div style="text-align: center;"><span class="icon-text-big"></span><br>'+vcbl[lang]["curReportIsEmpty"]+'</div>'
+'<div style="text-align: center;">'+vcbl[lang]["clickText"]+' <a href="'+'javascript:showTableSetWin(Ext.getCmp(\''+p.getItemId()+'\').findParentByType(\'multiPanel\'));'+'" class="links-alt-color">'+vcbl[lang]["hereText"]+'</a> '+vcbl[lang]["newTableText"]+'</div>'
/*+vcbl[lang]["clickText"]+' <a href="'+'javascript:showChartSetWin(Ext.getCmp(\''+p.getItemId()+'\').findParentByType(\'multiPanel\'));'+'" class="links-alt-color">'+vcbl[lang]["hereText"]+'</a> '+vcbl[lang]["newChartText"]*/
+'<div style="text-align: center;">'+basicReport+'</div>';
                    if(!centerPanel.ifOneEl || (centerPanel.grids.length>0 || centerPanel.charts.length>0)){
                        butHtml='<div style="text-align: center;"><span class="icon-text-big"></span></div>'
+'<div style="text-align: center;">'+vcbl[lang]["clickText"]+' <a href="'+'javascript:showTableSetWin(Ext.getCmp(\''+p.getItemId()+'\').findParentByType(\'multiPanel\'));'+'" class="links-alt-color">'+vcbl[lang]["hereText"]+'</a> '+vcbl[lang]["newTableText"]+'</div>';
                    }
                    this.update(butHtml);
                }
            });
            p.innerBut.updateButHtml();
        },
        'resize': function(p,w,h){
            if(!!p.innerBut){
                if(p.innerBut.getWidth()>w) p.innerBut.setWidth(w);
                else if(w>315) p.innerBut.setWidth(315);
                else if(w<=315) p.innerBut.setWidth(w);
                p.innerBut.updateButHtml();
            }
        }
    }
});
Ext.define('multiPanel', {
    extend: 'Ext.panel.Panel',
    xtype: 'multiPanel',
    layout: 'fit',
    region: 'center',
    title: '',
    titleMP: '',
    itemID: 0,
    itemIDAs: 0,
    settings: 0,
    prevSettings: 0,
    countPrevLoad: 0,
    isEdit: false,
    multiSortLength: 0,
    totalCountRec: 0,
    maxLengthLoadRec: maxLengthLoadRec,
    isSeparated: false,
    width: '50%', height: '50%',
    items: [{ xtype: 'buttonsMultiPanel' }],
    dockedItems: [{ xtype: 'toolbarMP' }],
    unregInnerComp: function(){
        if(!!this.getComponent(0)){
            if(this.getComponent(0).getXType()==="grid") centerPanel.grids.splice(centerPanel.grids.indexOf(this.getComponent(0).getItemId()),1);
            else if(!!this.getComponent(0).isChart) centerPanel.charts.splice(centerPanel.charts.indexOf(this.getComponent(0).getItemId()),1);
        }
    },
    resetMP: function(){
        this.title='';
        this.titleMP='';
        this.setTitle(null);
        this.itemID=0;
        this.itemIDAs=0;
        this.settings=0;
        this.prevSettings=0;
        this.countPrevLoad=0;
        this.isEdit=false;
        this.multiSortLength=0;
        this.totalCountRec=0,
        this.isSeparated=false;
        return this;
    },
    changeMPTitle: function(html){
        this.titleMP=html;
        if(dockToolbar!=='top') this.setTitle(this.titleMP);
        else {
            var toolbar=this.getDockedItems('toolbar[dock="'+dockToolbar+'"]')[0];
            toolbar.changeTitle(this.titleMP);
        }
        return this;
    },
    getMPTitle: function(){ return this.titleMP; },
    getToolbarSize: function(){
        var toolbar=this.getDockedItems('toolbar[dock="'+dockToolbar+'"]')[0];
        return toolbar.getSize();
    },
    changeMPDownloadBut: function(){
        var toolbar=this.getDockedItems('toolbar[dock="'+dockToolbar+'"]')[0];
        toolbar.changeDownloadBut(this.settings.xtype || 'grid');
        this.changeMPVisibleBut();
        return this;
    },
    changeMPVisibleBut: function(){
        var toolbar=this.getDockedItems('toolbar[dock="'+dockToolbar+'"]')[0];
        toolbar.changeVisibleBut(this.settings.xtype || 'empty');
        return this;
    },
    listeners: {
        'titlechange': function(p,nT,oT){
            var header=p.getHeader();
            if(!!header){ if(nT===null) header.hide(); else header.show(); }
        },
        'beforedestroy': function(panel){ panel.unregInnerComp(); },
        'beforerender': function(panel){
            if(panel.settings!==0){
                centerPanel.ifOneEl=false;
                if(panel.isSeparated) return true;
                if(panel.settings.xtype==='grid') loadGridPanel(panel,true);
                else if(panel.settings.xtype==='chart') loadChartData(panel,true);
            } else if(panel.itemID!==0){
                centerPanel.ifOneEl=false;
                if(showPanelMenuBut.pressed) panel.getDockedComponent(0).show();
                else panel.getDockedComponent(0).hide();
                Ext.Ajax.request({
                    method: 'POST',
                    url: '/kortes/service/object/',
                    params: {userID: userID, lang: lang, itemID: panel.itemID},
                    success: function(response){
                        var settings=JSON.parse(response.responseText);
                        panel.settings=settings;
                        if(settings.dsID!==undefined && arDS.length>0){
                            if(findIndexByKeyValue(arDS,'dataIndex',settings.dsID)!==null)
                                panel.changeMPTitle(arDS[findIndexByKeyValue(arDS,'dataIndex',settings.dsID)].text);
                        }
                        if(settings.xtype!==undefined){
                            if(panel.settings.settings===undefined || panel.settings.settings.length===0){
                                Ext.Ajax.request({
                                    method: 'GET',
                                    url: '/kortes/service/mainsource/fields/',
                                    params: {itemID: panel.itemID, lang: lang, userID: userID, dsID: panel.settings.dsID},
                                    success: function(response){
                                        var settingsInner=JSON.parse(response.responseText.replace(/^\"/,"").replace(/\"$/,"").replace(/\\\"/g,"\""));
                                        panel.settings.settings=settingsInner;
                                        panel.settings.settings.forEach(function(el){
                                            if(el.show===undefined)el.show=el.showDefault;
                                            if(el.viewMode===undefined)el.viewMode="vertical";
                                            if(el.aggregation===undefined)el.aggregation="";
                                            if(el.dinamicFilter===undefined)el.dinamicFilter="";
                                            if(el.staticFilter===undefined)el.staticFilter=null;
                                        });
                                        panel.settings.filters=panel.settings.filters!==undefined?panel.settings.filters:new Array();
                                        panel.settings.aggregate=false;
                                        panel.settings.chartSettings=(!!panel.settings.chartSettings && !!panel.settings.chartSettings.typeChart)?panel.settings.chartSettings:{};
                                        if(settings.xtype==="grid"){ loadGridPanel(panel,true); }
                                        else if (settings.xtype==="chart"){ loadChartData(panel,true); }
                                    },
                                    failure: function(){Ext.create('eikonDialog').alert(vcbl[lang]["statusTitle"],vcbl[lang]["errorTakeFields"]);}
                                });
                            } else {
                                panel.settings.chartSettings=(!!panel.settings.chartSettings && !!panel.settings.chartSettings.typeChart)?panel.settings.chartSettings:{};
                                if(settings.xtype==="grid"){ loadGridPanel(panel,true); }
                                else if (settings.xtype==="chart"){ loadChartData(panel,true); }
                            }
                        }
                    },
                    failure: function(){Ext.create('eikonDialog').alert(vcbl[lang]["statusTitle"],vcbl[lang]["errorTakeObject"]);}
                });
            }
        },
        'resize': function(p,w,h){
            if(dockToolbar==='top'){
                var tb=p.getDockedItems('toolbar[dock="'+dockToolbar+'"]');
                if(!!tb && !!tb[0] && !!tb[0].setTitleWidth)
                    tb[0].setTitleWidth(w-minSize);
            }
            if(centerPanel.forJET)saveInJET('resize panel');
        },
        'afterrender': function(p){p.changeMPDownloadBut();}
    }
 });
Ext.define('eikonWin', {
    extend: 'Ext.window.Window',
    xtype: 'eikonWin',
    cls: 'winMod',
    layout: {type: 'vbox',pack: 'start',align: 'stretch'},
    bodyPadding: '13 10 10 10',
    header: {height: 28 ,cls: 'headerWinMod'},
    border: false,
    ghost: false,
    modal: true
 });
Ext.define('eikonDialog', {
    extend: 'Ext.window.MessageBox',
    xtype: 'eikonDialog',
    cls: 'winMod',
    bodyPadding: '13 10 10 10',
    header: {height: 28 ,cls: 'headerWinMod'},
    border: false,
    ghost: false,
    modal: true,
    listeners: {
        'afterrender': function(win){
            var tb=win.getDockedItems('toolbar[dock="bottom"]')[0];
            tb.addCls('buttonWinMod');
            tb.setLayout({type: 'hbox', pack: 'end', align: 'middle'});
        }
    }
 });
Ext.define('Ext.form.field.Month', {
    extend: 'Ext.form.field.Date',
    alias: 'widget.monthfield',
    requires: ['Ext.picker.Month'],
    alternateClassName: ['Ext.form.MonthField', 'Ext.form.Month'],
    selectMonth: null,
    createPicker: function(){
        var me=this, format=Ext.String.format;
        return Ext.create('Ext.picker.Month', {
            width: 229,
            pickerField: me,
            ownerCt: me.ownerCt,
            renderTo: document.body,
            floating: true,
            hidden: true,
            focusOnShow: true,
            minDate: me.minValue,
            maxDate: me.maxValue,
            disabledDatesRE: me.disabledDatesRE,
            disabledDatesText: me.disabledDatesText,
            disabledDays: me.disabledDays,
            disabledDaysText: me.disabledDaysText,
            format: me.format,
            showToday: false,
            startDay: me.startDay,
            minText: format(me.minText, me.formatDate(me.minValue)),
            maxText: format(me.maxText, me.formatDate(me.maxValue)),
            listeners: {
                afterrender: { scope: me, fn: function(c){ var me=c; me.el.on("mousedown", function(e){ e.preventDefault(); }, c); } },
                select: { scope: me, fn: me.onSelect },
                monthdblclick: { scope: me, fn: me.onOKClick },
                yeardblclick: { scope: me, fn: me.onOKClick },
                OkClick: { scope: me, fn: me.onOKClick },
                CancelClick: { scope: me, fn: me.onCancelClick }
            },
            keyNavConfig: { esc: function(){ me.collapse(); } }
        });
    },
    onCancelClick: function(){ var me=this; me.selectMonth=null; me.collapse(); },
    onOKClick: function(){
        var me=this;
        if(me.selectMonth){ me.setValue(me.selectMonth); me.fireEvent('select', me, me.selectMonth); }
        me.collapse();
    },
    onSelect: function(m, d){ var me=this; me.selectMonth=new Date((d[0] + 1) + '/1/' + d[1]); }
});
Ext.define('eikonColorSelector', {
    extend: 'Ext.ux.colorpick.Selector',
    xtype: 'eikonColorSelector',
    width: 224,
    height: 194,
    cls: 'colorSelectorMod',
    padding: '10 15 10 10',
    style: { borderWidth: '1px', borderColor: '#000000', borderStyle: 'solid', background: '#4a4a52 none repeat scroll 0 0' },
    getSliderAndSField: function(childViewModel){return null;},
    getSliderAndVField: function(childViewModel){return null;},
    getSliderAndAField: function(childViewModel){return null;},
    getSliderAndHField: function(childViewModel){ return null; },
    getPreviewAndButtons: function (childViewModel, config){ return null; },
    getMapAndHexRGBFields: function(childViewModel){
        var me=this, fieldWidth=me.fieldWidth;
        return {
            xtype: 'container',
            viewModel: childViewModel,
            cls: Ext.baseCSSPrefix + 'colorpicker-escape-overflow',
            layout: { type: 'vbox', align: 'stretch' },
            items: [{
                xtype: 'container',
                defaults: { style: { borderWidth: '1px', borderColor: '#72717D', borderStyle: 'solid' } },
                layout: { type: 'hbox' },
                items: [{
                    xtype: 'colorpickercolormap',
                    reference: 'colorMap',
                    height: 138,
                    width: 158,
                    bind: { position: { bindTo: '{selectedColor}', deep: true }, hue: '{selectedColor.h}' },
                    listeners: { handledrag: 'onColorMapHandleDrag' }
                },{
                    xtype: 'colorpickersliderhue',
                    reference: 'hueSlider',
                    margin: '0 0 0 19',
                    height: 140,
                    width: 20,
                    bind: { hue: '{selectedColor.h}' },
                    listeners: {  handledrag: 'onHueSliderHandleDrag' }
                }]
            },{
                xtype: 'container',
                items: [{
                    xtype: 'button',
                    text: 'Cancel',
                    margin: '9 6 0 0',
                    handler: 'onCancel'
                },{
                    xtype: 'button',
                    text: 'Choose',
                    margin: '9 0 0 0',
                    handler: 'onOK'
                }]
            }]
        };
    }
});
Ext.define('eikonColorField', {
    extend: 'Ext.ux.colorpick.Field',
    xtype: 'eikonColorField',
    width: 72,
    cls: 'colorFieldMod',
    beforeBodyEl: [
        '<div class="'+Ext.baseCSSPrefix+'colorpicker-field-swatch eikonColorField1">'+
            '<div id="{id}-swatchEl" data-ref="swatchEl" class="'+Ext.baseCSSPrefix+'colorpicker-field-swatch-inner eikonColorField2"></div>' +
        '</div>'
    ],
    config: {
        popup: {
            lazy: true,
            $value: {
                xtype: 'window',
                cls: 'colorSelectorWinMod',
                referenceHolder: true,
                minWidth: 0,
                minHeight: 0,
                layout: 'fit',
                header: false,
                resizable: false,
                items: {
                    xtype: 'eikonColorSelector',
                    reference: 'selector',
                    showPreviousColor: true,
                    showOkCancelButtons: true
                }
            }
        }
    }
});

Ext.tip.QuickTipManager.init();
Ext.Ajax.setTimeout(timeoutAjax);

//for all func
function findIndexByKeyValue(arraytosearch,key,valuetosearch){
    for(var i=0;i<arraytosearch.length;i++){
        if(arraytosearch[i][key]===valuetosearch)return i;
    }
    return null;
}
function reloadOtherLink(newReportID,newLang,newDockToolbar){
    var tempAr=[];
    
    if(!(!!newReportID)) newReportID=reportIDGet;
    if(!(!!newLang)) newLang=lang;
    if(!(!!newDockToolbar)) newDockToolbar=dockToolbar;
    
    if(newReportID!==defReportIDGet) tempAr.push("reportID="+newReportID);
    if(newLang!==defLang) tempAr.push("lang="+newLang);
    if(newDockToolbar!==defDockToolbar) tempAr.push("dockToolbar="+newDockToolbar);
    
    return location.protocol+"//"+location.host+location.pathname+(tempAr.length>0?"?"+tempAr.join("&"):"");
}
function animate(target,opacityFrom,opacityTo,colorFrom,colorTo,interval){
    if(!!!target){ return false; }
    opacityFrom=opacityFrom || 1;
    opacityTo=opacityTo || 0.25;
    colorFrom=colorFrom || "#c2c2c2";
    colorTo=colorTo || "#c2c2c2";
    interval=interval || 1000;
    
    if(!!!target.getFlagAnim && !!!target.setFlagAnim && !!!target.resetAnim){
        target.startHidden=target.isHidden();
        target.flagAnim=true;
        target.getFlagAnim=function(){ return this.flagAnim; };
        target.setFlagAnim=function(val){ this.flagAnim=val; return this; };
        target.resetAnim=function(){
            Ext.create('Ext.fx.Anim',{
                target: this.getEl(),
                duration: interval,
                to: { opacity: 1, color: "#c2c2c2" }
            });
            target.flagAnim=false;
            target.getFlagAnim=false;
            target.setFlagAnim=false;
            target.resetAnim=false;
            if(target.startHidden) { target.hide(); }
        };
        target.show();
    }
    
    Ext.create('Ext.fx.Anim',{
        target: target.getEl(),
        duration: interval,
        from: { opacity: opacityFrom, color: colorFrom },
        to: { opacity: opacityTo, color: colorTo },
        listeners: {
            afteranimate: function(){
                if(target.getFlagAnim()) { animate(target,opacityTo,opacityFrom,colorTo,colorFrom,interval); }
                else { target.resetAnim(); }

            }
        }
    });
}
function numberWithCommas(x,sep){
    if(!!!sep)sep=" ";
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, sep);
}

//kostili start
Ext.define('EXTJS-15862.tab.Bar', {
    override: 'Ext.tab.Bar',
    initComponent: function() {
        var me = this,
            initialLayout = me.initialConfig.layout,
            initialAlign = initialLayout && initialLayout.align,
            initialOverflowHandler = initialLayout && initialLayout.overflowHandler,
            layout;
        if (me.plain) {
            me.addCls(me.baseCls + '-plain');
        }
        me.callParent();
        me.setLayout({
            align: initialAlign || (me.getTabStretchMax() ? 'stretchmax' :
                    me._layoutAlign[me.dock]),
            overflowHandler: initialOverflowHandler || 'scroller'
        });
        me.on({
            mousedown: me.onClick,
            element: 'el',
            scope: me
        });
    }
});
Ext.define('PrototypeApp.overrides.Store.Store', {
    override: 'Ext.data.BufferedStore',
    alias: 'component.storeoverride',
    createSortersCollection: function(){    
        var sorters = this.callParent();
        if(!Ext.isEmpty(this.multiSortLimit)) {
            sorters.getOptions().setMultiSortLimit(this.multiSortLimit);
        }
        return sorters;
    }
});
Ext.override(Ext.grid.plugin.BufferedRenderer,{
    onStoreClear: function() {
        var me = this,
            view = me.view;

        if (view.rendered && !me.store.isDestroyed) {
            me.bodyTop = me.scrollTop = me.position = me.scrollHeight = 0;
            if (me.scrollTop !== 0) {
                me.view.setScrollY(0);
            }
            me.lastScrollDirection = me.scrollOffset = null;


            if (!view.hasOwnProperty('rowHeight')) {
                delete me.rowHeight;
            }
        }
    }
});
Ext.override(Ext.grid.Panel,{ bodyCls: 'bodyGrid' });
Ext.override(Ext.form.ComboBox,{ height: 23, cls: 'comboMod', pickerOffset: [0,1] });
Ext.override(Ext.form.field.Text,{ height: 23, cls: 'modTextfield' });
Ext.override(Ext.picker.Date,{
    width: 229,
    cls: 'datePickerMod',
    showToday: false,
    getDayInitial: function(value) { return value.substr(0,2); }
});
Ext.override(Ext.form.field.Date,{
    height: 23,
    cls: 'modDatefield',
    createPicker: function() {
        var me=this, format=Ext.String.format;
        return new Ext.picker.Date({
            pickerField: me,
            floating: true,
            focusable: false,
            hidden: true,
            minDate: me.minValue,
            maxDate: me.maxValue,
            disabledDatesRE: me.disabledDatesRE,
            disabledDatesText: me.disabledDatesText,
            disabledDays: me.disabledDays,
            disabledDaysText: me.disabledDaysText,
            format: me.format,
            showToday: false,
            startDay: me.startDay,
            minText: format(me.minText, me.formatDate(me.minValue)),
            maxText: format(me.maxText, me.formatDate(me.maxValue)),
            listeners: { scope: me, select: me.onSelect },
            keyNavConfig: { esc: function() { me.collapse(); } }
        });
    }
});
Ext.override(Ext.ux.form.ItemSelector,{
    createButtons: function() {
        var me = this,
            buttons = [];

        if (!me.hideNavIcons) {
            Ext.Array.forEach(me.buttons, function(name) {
                buttons.push({
                    xtype: 'button',
                    height: 35,
                    tooltip: me.buttonsText[name],
                    handler: me['on' + Ext.String.capitalize(name) + 'BtnClick'],
                    cls: Ext.baseCSSPrefix + 'form-itemselector-btn',
                    iconCls: Ext.baseCSSPrefix + 'form-itemselector-' + name,
                    navBtn: true,
                    scope: me,
                    margin: '4 0 0 0'
                });
            });
        }
        return buttons;
    }
});
Ext.override(Ext.tab.Panel,{
    applyTabBar: function(tabBar) {
        var me = this, dock = (me.tabBarHeaderPosition != null) ? me.getHeaderPosition() : me.getTabPosition();
        return new Ext.tab.Bar(Ext.apply({
            ui: me.ui,
            dock: dock,
            height: 30,
            cls: 'level2',
            tabRotation: me.getTabRotation(),
            vertical: (dock === 'left' || dock === 'right'),
            plain: me.plain,
            tabStretchMax: me.getTabStretchMax(),
            tabPanel: me
        }, tabBar));
    }
});
Ext.override(Ext.panel.Panel,{
    bridgeToolbars: function() {
        var me=this,docked=[],minButtonWidth=me.minButtonWidth,fbar,fbarDefaults;
        function initToolbar (toolbar, pos, useButtonAlign) {
            if(Ext.isArray(toolbar)) { toolbar={ xtype: 'toolbar', items: toolbar }; }
            else if(!toolbar.xtype) { toolbar.xtype='toolbar'; }
            toolbar.dock=pos;
            if(useButtonAlign){
                toolbar.layout=Ext.applyIf(toolbar.layout || {}, {
                    pack: { left:'start', center:'center' }[me.buttonAlign] || 'end'
                });
            }
            return toolbar;
        }
        if(me.tbar) { docked.push(initToolbar(me.tbar, 'top')); me.tbar=null; }
        if(me.bbar) { docked.push(initToolbar(me.bbar, 'bottom')); me.bbar=null; }
        if(me.buttons) { me.fbar=me.buttons; me.buttons=null; }
        if(me.fbar) {
            fbar=initToolbar(me.fbar, 'bottom', true);
            fbar.ui='footer';
            fbar.cls='buttonWinMod';
            if(minButtonWidth) {
                fbarDefaults=fbar.defaults;
                fbar.defaults=function(config) {
                    var defaults=fbarDefaults || {},isButton = !config.xtype || config.isButton,cls;
                    if(!isButton) {
                        cls=Ext.ClassManager.getByAlias('widget.' + config.xtype);
                        if(cls) { isButton=cls.prototype.isButton; }
                    }
                    if(isButton && !('minWidth' in defaults)) { defaults=Ext.apply({minWidth: minButtonWidth}, defaults); }
                    return defaults;
                };
            }
            docked.push(fbar);
            me.fbar=null;
        }
        if(me.lbar) { docked.push(initToolbar(me.lbar, 'left')); me.lbar = null; }
        if(me.rbar) { docked.push(initToolbar(me.rbar, 'right')); me.rbar=null; }
        if(me.dockedItems) {
            if(me.dockedItems.isMixedCollection) { me.addDocked(docked); }
            else {
                if (!Ext.isArray(me.dockedItems)) { me.dockedItems=[me.dockedItems]; }
                me.dockedItems=me.dockedItems.concat(docked);
            }
        } else { me.dockedItems=docked; }
    }
});
Ext.override(Ext.data.Connection,{
    onComplete : function(request, xdrResult) {
        var me = this,
            options = request.options,
            xhr,
            result,
            success,
            response;
 
        try {
            xhr = request.xhr;
            result = me.parseStatus(xhr.status);
            if (result.success) {
                // This is quite difficult to reproduce, however if we abort a request just before 
                // it returns from the server, occasionally the status will be returned correctly 
                // but the request is still yet to be complete. 
                result.success = xhr.readyState === 4;
            }
        } catch (e) {
            // in some browsers we can't access the status if the readyState is not 4, so the request has failed 
            result = {
                success : false,
                isException : false
            };
 
        }
        success = me.getIsXdr() ? xdrResult : result.success;
 
        if (success) {
            response = me.createResponse(request);
            me.fireEvent('requestcomplete', me, response, options);
            Ext.callback(options.success, options.scope, [response, options]);
        } else {
            if (result.isException || request.aborted || request.timedout) {
                response = me.createException(request);
            } else {
                response = me.createResponse(request);
            }
            me.fireEvent('requestexception', me, response, options);
            if(!findError(response.responseText,"errorJDBCConnection")){
                Ext.callback(options.failure, options.scope, [response, options]);
            }
        }
        Ext.callback(options.callback, options.scope, [options, success, response]);
        delete me.requests[request.id];
        return response;
    }
});
var ongoing=false, boxes={};
function buildBetterLabel(name,width,height,fontSize,addArrText){
    var ans=[],numOfRows,numOfCols;
    numOfRows=Math.floor(height/(fontSize+3));
    numOfCols=Math.floor(width/(fontSize-5));
    if(numOfRows>=3 && numOfCols>6){
        if(numOfCols>=name.length) { ans.push(name); }
        else { ans.push(name.substr(0,numOfCols-3)+"..."); }
        return ans.concat(addArrText).join('<br>');
    } else { return ""; }
}
//kostili end