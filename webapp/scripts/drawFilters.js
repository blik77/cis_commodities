function showFiltersWin(typeFilter,text,fieldID,filterPanel,gridID){
    var panelE=new Object();
    switch(typeFilter){
        case "Date":            showFiltersWinDate(text,fieldID,filterPanel,panelE,gridID);break;
        case "ID":              showFiltersWinNumStr("digit",text,fieldID,filterPanel,panelE,gridID,typeFilter);break;
        case "ID Dictionary":   showFiltersWinNumStr("digit",text,fieldID,filterPanel,panelE,gridID,typeFilter);break;
        case "Month":           showFiltersWinNumStr("digit",text,fieldID,filterPanel,panelE,gridID,typeFilter);break;
        case "MonthYear":       showFiltersWinDateMY(text,fieldID,filterPanel,panelE,gridID);break;
        case "Name Dictionary": showFiltersWinNumStr("str",text,fieldID,filterPanel,panelE,gridID,typeFilter);break;
        case "Number":          showFiltersWinNumStr("digit",text,fieldID,filterPanel,panelE,gridID,typeFilter);break;
        case "Price data":      showFiltersWinNumStr("digit",text,fieldID,filterPanel,panelE,gridID,typeFilter);break;
        case "Quarter":         showFiltersWinNumStr("digit",text,fieldID,filterPanel,panelE,gridID,typeFilter);break;
        case "Text":            showFiltersWinNumStr("str",text,fieldID,filterPanel,panelE,gridID,typeFilter);break;
        case "Volume data":     showFiltersWinNumStr("digit",text,fieldID,filterPanel,panelE,gridID,typeFilter);break;
        case "Year":            showFiltersWinNumStr("digit",text,fieldID,filterPanel,panelE,gridID,typeFilter);break;
        case "fact_field":      showFiltersWinForPivot(typeFilter,text,fieldID,filterPanel,gridID);break;
        case "MemoShort":       showFiltersWinNumStr("memo",text,fieldID,filterPanel,panelE,gridID,typeFilter);break;
        default: Ext.create('eikonDialog').alert(vcbl[lang]["statusTitle"],typeFilter+" - "+vcbl[lang]["errorSelectTypeFilter"]);
    }
}
function showFiltersWinForPivot(typeFilter,text,fieldID,filterPanel,gridID){
    var tempAr=Ext.getCmp(gridID).findParentByType('multiPanel').settings.settings;
    typeFilter=tempAr[findIndexByKeyValue(tempAr,"fieldID",fieldID)].typeFilter;
    text=tempAr[findIndexByKeyValue(tempAr,"fieldID",fieldID)].text;
    showFiltersWin(tempAr[findIndexByKeyValue(tempAr,"fieldID",fieldID)].typeFilter,text,fieldID,filterPanel,gridID);
}
function showStaticFiltersWin(rec,gridID){
    switch(rec.get("typeFilter")){
        case "Date":            showStaticFiltersWinDate(rec);break;
        case "ID":              showStaticFiltersWinNumStr("digit",rec,rec.get("typeFilter"));break;
        case "ID Dictionary":   showStaticFiltersWinNumStr("digit",rec,rec.get("typeFilter"));break;
        case "Month":           showStaticFiltersWinNumStr("digit",rec,rec.get("typeFilter"));break;
        case "MonthYear":       showStaticFiltersWinDateMY(rec);break;
        case "Name Dictionary": showStaticFiltersWinNumStr("str",rec,rec.get("typeFilter"));break;
        case "Number":          showStaticFiltersWinNumStr("digit",rec,rec.get("typeFilter"));break;
        case "Price data":      showStaticFiltersWinNumStr("digit",rec,rec.get("typeFilter"));break;
        case "Quarter":         showStaticFiltersWinNumStr("digit",rec,rec.get("typeFilter"));break;
        case "Text":            showStaticFiltersWinNumStr("str",rec,rec.get("typeFilter"));break;
        case "Volume data":     showStaticFiltersWinNumStr("digit",rec,rec.get("typeFilter"));break;
        case "Year":            showStaticFiltersWinNumStr("digit",rec,rec.get("typeFilter"));break;
        case "fact_field":      break;
        case "MemoShort":       showStaticFiltersWinNumStr("memo",rec,rec.get("typeFilter"));break;
        default: Ext.create('eikonDialog').alert(vcbl[lang]["statusTitle"],vcbl[lang]["errorSelectTypeFilter"]);
    }
}

function createFilterItem(filterID,fieldID,condition,value,valueText,typeFilter,isNew,isEdit,filterPanel,nameField,fromJET){
    var conditionAr=[{"name":">","id":"better"},{"name":"<","id":"less"},{"name":"=","id":"equally"},
                    {"name":"<>","id":"notequally"},{"name":vcbl[lang]["inText"],"id":"in"},{"name":vcbl[lang]["betweenText"],"id":"between"},
                    {"name":vcbl[lang]["likeText"],"id":"like"},{"name":vcbl[lang]["sprText"],"id":"spr"},
                    {"name":vcbl[lang]["fromStartYear"],"id":"sy"},{"name":vcbl[lang]["fromStartHalfYear"],"id":"shy"},
                    {"name":vcbl[lang]["fromStartQuarter"],"id":"sq"},{"name":vcbl[lang]["fromStartMonth"],"id":"sm"}
                ];
    if(typeFilter==="MonthYear"){
        if(condition==="between"){
            var tempVal=value.split(',');
            valueText=tempVal[0].substr(3)+' '+vcbl[lang]["dateToLabel"]+' '+tempVal[1].substr(3);
        }
        else valueText=!!valueText?(value+'').substr(3):valueText.substr(3);
    } else if(typeFilter==="date"){
        if(condition==="between"){
            var tempVal=value.split(',');
            valueText=tempVal[0]+' '+vcbl[lang]["dateToLabel"]+' '+tempVal[1];
        }
    }
    var textFilter=nameField+": ["+conditionAr[findIndexByKeyValue(conditionAr,"id",condition)].name+'] '+(valueText===null?value:valueText);
    if(condition==="sy" || condition==="shy" || condition==="sq" || condition==="sm")
        textFilter=nameField+": ["+conditionAr[findIndexByKeyValue(conditionAr,"id",condition)].name+']';
    var filterItem=Ext.create('Ext.panel.Panel', {
        border: false,
        filterID: filterID,
        fieldID: fieldID,
        condition: condition,
        value: value,
        valueText: valueText,
        typeFilter: typeFilter,
        isNew: isNew,
        isEdit: isEdit,
        nameField: nameField,
        items: [
            {xtype: 'button',iconCls:'del_but',handler: function(but){ deleteFilter(but); }},
            {xtype: 'button',iconCls: 'edit_but',handler: function(){
                    if(typeFilter==="date") showFiltersWinDate(nameField,fieldID,filterPanel,filterItem);
                    else if (typeFilter==="MonthYear") showFiltersWinDateMY(nameField,fieldID,filterPanel,filterItem);
                    else showFiltersWinNumStr(typeFilter,nameField,fieldID,filterPanel,filterItem,undefined,getBasicTypeFilter(fieldID));
                }
            },
            {xtype: 'label',text: textFilter,cls: 'eikonLabelFilter'}],
        listeners: {'afterrender': function(){if(!fromJET)saveInJET('create filter item');}},
        changeFilterSet: function(t,c,v,vT){
            this.getComponent(2).setText(t);
            this.condition=c;
            this.value=v;
            this.valueText=vT;
            this.isEdit=true;
            var arFilters=centerPanel.filters;
            var itemFilterAr=arFilters[findIndexByKeyValue(arFilters,"filterID",this.filterID)];
            itemFilterAr.condition=c;
            itemFilterAr.value=v;
            reloadGridWithFilter(this.filterID,undefined,undefined,this.fieldID);
            reloadChartWithFilter(this.filterID,undefined,undefined,this.fieldID);
        }
    });
    centerPanel.filters.push({filterID: filterID,text: nameField,fieldID: fieldID,condition: condition,typeFilter: typeFilter,value: value});
    if(centerPanel.getComponent(0).getComponent(0).isLabelEmpty!==undefined) centerPanel.getComponent(0).removeAll();
    return filterItem;
}

function getBasicTypeFilter(fieldID){
    var item={};
    var tempOb=[];
    var ans="";
    centerPanel.grids.concat(centerPanel.charts).forEach(function(el){
        item=Ext.getCmp(el);
        if(!!item && ans===""){
            tempOb=item.findParentByType('panel').settings;
            tempOb.filters.forEach(function(el2){
                if(el2.fieldID===fieldID){
                    ans=tempOb.settings[findIndexByKeyValue(tempOb.settings,"fieldID",fieldID)].typeFilter;
                }
            });
        }
    });
    return ans;
}

function showFiltersWinSpr(text,fieldID,panel){
    var combo2Store=Ext.create('Ext.data.JsonStore',{
        proxy: {extraParams: {id: 0,lang: lang,userID: userID},type: 'ajax',timeout: timeoutAjax,url: "/monitor/scripts/filters.json"},
        fields: ['id','text','checked'],
        listeners: {'load': function(store,recs,suc){
            if(!suc)Ext.create('eikonDialog').alert(vcbl[lang]["statusTitle"],vcbl[lang]["errorLoadFiltersCombo_2"]);
        }}
    });
    var filters=new Array();
    centerPanel.filters.forEach(function(el){
        if(fieldID!==el.fieldID)
            filters.push({fieldID: el.fieldID,condition: el.condition,typeFilter: el.typeFilter,value: el.value});
    });
    filters=JSON.stringify(filters);
    var usePrevFilters=Ext.create('Ext.form.field.Checkbox',{
        fieldLabel: "&nbsp;",labelSeparator: "",boxLabel: vcbl[lang]["userPrevFilters"],checked: true,
        listeners: {
            'change': function(check,nV){
                var filters=new Array();
                if(nV){
                    centerPanel.filters.forEach(function(el){
                        if(fieldID!==el.fieldID)
                            filters.push({fieldID: el.fieldID,condition: el.condition,typeFilter: el.typeFilter,value: el.value});
                    });
                    filters=JSON.stringify(filters);
                } else filters=null;
                itemSelector.fromField.getStore().removeAll();
                multiSelStore.getProxy().extraParams.filters=filters;
                multiSelStore.reload();
            }
        }
    });
    var multiSelStore=Ext.create('Ext.data.JsonStore',{
        proxy: {extraParams: {lang: lang,userID: userID,fieldID: fieldID,filters: filters},type: 'ajax',timeout: timeoutAjax,url: "/kortes/service/getSubFilter/"},
        autoLoad: true,
        fields: ['id','text'],
        listeners: {
            'load': function(store,recs,suc){
                if(!suc){Ext.create('eikonDialog').alert(vcbl[lang]["statusTitle"],vcbl[lang]["errorLoadSubfilter"]);return false;}
                itemSelector.changeFilter();
            }
        }
    });
    var combo1=Ext.create('Ext.form.field.Text', { fieldLabel: vcbl[lang]["chooseParentFilterWin"], value: text });
    var combo2=Ext.create('Ext.form.ComboBox', {
        fieldLabel: vcbl[lang]["chooseChildFilterWin"],
        store: combo2Store,
        queryMode: 'local',
        displayField: 'text',
        valueField: 'id',
        editable: false,
        disabled: true
    });
    var itemSelector=Ext.create('Ext.ux.form.ItemSelector',{
        store: multiSelStore,
        buttons: ['add','remove'],
        height: 450,
        queryMode: 'local',
        displayField: 'text',
        valueField: 'id',
        fromTitle: vcbl[lang]["availableFilterWin"],
        toTitle: vcbl[lang]["selectedFilterWin"],
        value: panel.value!==undefined?panel.value.split(','):[],
        listeners: {
            'change': function(){itemSelector.changeFilter();}
        },
        changeFilter: function(){
            var toStore=this.fromField.getStore();
            toStore.clearFilter();
            if(this.getValue().length!==0)
                this.fromField.getStore().filterBy(function(rec){
                    var ans=true;
                    itemSelector.getValue().forEach(function(el){if(el===rec.get('id'))ans=false;});
                    return ans;
                });
            if(keywordSearch.getRawValue()!=="")
                toStore.filterBy(function(rec){return rec.get('text').toLowerCase().search(new RegExp(keywordSearch.getRawValue().toLowerCase()))!==-1;});
        }
    });
    itemSelector.fromField.getStore().on({'write': function(){itemSelector.setValue(itemSelector.getValue());}});
    var keywordSearch=Ext.create('Ext.form.field.Text',{flex: 1,
        listeners: {
            'change': function(){ itemSelector.changeFilter(); }
        }
    });
    var win=Ext.create('eikonWin',{
        title: vcbl[lang]["filtersTitle"],
        height: 658,
        width: 800,
        resizable: false,
        defaults: {labelWidth: 140},
        items: [combo1,combo2,usePrevFilters,{
            xtype: 'fieldcontainer',
            fieldLabel: vcbl[lang]["chooseItemFilterWin"],
            layout: 'fit',
            items: [Ext.create('Ext.panel.Panel', {
                layout: {type: 'vbox',align: 'stretch'},
                dockedItems: [{
                    xtype: 'toolbar',
                    cls: 'level1 borderForItemSel',
                    height: 31,
                    dock: 'top',
                    defaults: {width: 23},
                    items: [keywordSearch,{iconCls: 'del_but',handler: function(){keywordSearch.reset();}}]
                }],
                items: [itemSelector]
            })]}
        ],
        buttons: [{
            cls: 'cta',
            text: vcbl[lang]["applyBut"],handler: function(){
                if(itemSelector.getValue().length===0)return false;
                var arName=new Array();
                itemSelector.getValue().forEach(function(el){ arName.push(multiSelStore.findRecord("id",el,0,false,false,true).get("text")); });
                panel.getComponent(0).setValue(arName.join());
                panel.value=itemSelector.getValue().join();
                panel.valueText=arName.join();
                win.close();
            }
        },{ text: vcbl[lang]["closeBut"],handler: function(){win.close();} }]
    }).show();
}
function showFiltersWinDate(text,fieldID,filterPanel,panelE,gridID){
    var filterName=Ext.create('Ext.form.field.Text', { fieldLabel: vcbl[lang]["chooseParentFilterWin"], value: text });
    var condition=Ext.create('Ext.form.ComboBox', {
        fieldLabel: vcbl[lang]["conditionLabel"],
        store: Ext.create('Ext.data.Store', {
            fields: ['abbr', 'name'],
            data: [{"name":">","id":"better"},{"name":"<","id":"less"},{"name":"=","id":"equally"},{"name":"<>","id":"notequally"},
                {"name":vcbl[lang]["betweenText"],"id":"between"},
                {"name":vcbl[lang]["fromStartYear"],"id":"sy"},{"name":vcbl[lang]["fromStartHalfYear"],"id":"shy"},
                {"name":vcbl[lang]["fromStartQuarter"],"id":"sq"},{"name":vcbl[lang]["fromStartMonth"],"id":"sm"}
            ]
        }),
        queryMode: 'local',
        displayField: 'name',
        valueField: 'id',
        value: 'equally',
        editable: false,
        listeners: {
            'change': function(combo,newVal){
                var panelFilter=combo.findParentByType('window').getComponent(2);
                panelFilter.getComponent(0).enable();
                panelFilter.getComponent(0).setValue(new Date());
                if(panelFilter.getComponent(1)!==undefined)panelFilter.getComponent(1).destroy();
                panelFilter.getComponent(0).setReadOnly(false);
                if(newVal==="between"){
                    var dateTo=Ext.create('Ext.form.field.Date', {
                        fieldLabel: vcbl[lang]["dateToLabel"],
                        padding: '0 0 0 25',
                        allowBlank: false,
                        editable: false,
                        format: 'd-m-Y',
                        flex: 1,
                        value: (panelE.value!==undefined)?(panelE.value.split(',')[1]!==undefined?panelE.value.split(',')[1]:new Date()):new Date()
                    });
                    panelFilter.add(dateTo);
                } else if(newVal==="sy" || newVal==="shy" || newVal==="sq" || newVal==="sm"){
                    panelFilter.getComponent(0).disable();
                }
            },
            'afterrender': function(combo){
                if(panelE.condition!==undefined){
                    combo.select(panelE.condition);
                }
            }
        }
    });
    var digitFrom=Ext.create('Ext.form.field.Date', {
        fieldLabel: vcbl[lang]["dateLabel"],
        padding: '0 0 0 145',
        allowBlank: false,
        editable: false,
        format: 'd-m-Y',
        flex: 1,
        itemId: 'digitFrom',
        value: (panelE.value!==undefined && panelE.value!=="sy" && panelE.value!=="shy" && panelE.value!=="sq" && panelE.value!=="sm")?panelE.value.split(',')[0]:new Date()
    });
    var win=Ext.create('eikonWin',{
        title: vcbl[lang]["filtersTitle"],
        height: 173,
        width: 800,
        resizable: false,
        defaultFocus: 'digitFrom',
        defaults: { labelWidth: 140 },
        items: [filterName,condition,{
            xtype: 'panel',
            border: false,
            layout: {type: 'hbox',align: 'stretch'},
            defaults: {labelWidth: 40},
            items: [digitFrom]
        }],
        buttons: [{
            cls: 'cta',
            text: vcbl[lang]["applyBut"],handler: function(){
                if(condition.getValue()!=="sy" || condition.getValue()!=="shy" || condition.getValue()!=="sq" || condition.getValue()!=="sm")
                if(digitFrom.getValue()===null || digitFrom.getValue()===undefined || digitFrom.getValue()==="")return false;
                var textFilter=text+": ["+condition.getRawValue()+'] '+digitFrom.getRawValue();
                var value=digitFrom.getRawValue();
                var valueText=digitFrom.getRawValue();
                if(condition.getValue()==="sy" || condition.getValue()==="shy" || condition.getValue()==="sq" || condition.getValue()==="sm"){
                    textFilter=text+": ["+condition.getRawValue()+']';
                    value=condition.getValue();
                    valueText=condition.getValue();
                }
                if(win.getComponent(2).getComponent(1)!==undefined){
                    var toCmp=win.getComponent(2).getComponent(1);
                    textFilter=textFilter+' '+vcbl[lang]["dateToLabel"]+' '+toCmp.getRawValue();
                    value=new Array(digitFrom.getRawValue(),toCmp.getRawValue()).join();
                    valueText=new Array(digitFrom.getRawValue(),toCmp.getRawValue()).join();
                }
                if(panelE.value!==undefined){
                    panelE.changeFilterSet(textFilter,condition.getValue(),value,valueText);
                } else {
                    filterPanel.add(createFilterItem("new_"+fieldID,fieldID,condition.getValue(),value,valueText,"date",true,false,
                        filterPanel,text,false));
                    reloadGridWithFilter("new_"+fieldID,"add",gridID,fieldID);
                    reloadChartWithFilter("new_"+fieldID,"add",gridID,fieldID);
                }
                win.close();
            }
        },{ text: vcbl[lang]["closeBut"],handler: function(){win.close();} }]
    }).show();
}
function showFiltersWinDateMY(text,fieldID,filterPanel,panelE,gridID){
    var filterName=Ext.create('Ext.form.field.Text', { fieldLabel: vcbl[lang]["chooseParentFilterWin"], value: text });
    var condition=Ext.create('Ext.form.ComboBox', {
        fieldLabel: vcbl[lang]["conditionLabel"],
        store: Ext.create('Ext.data.Store', {
            fields: ['abbr', 'name'],
            data: [{"name":">","id":"better"},{"name":"<","id":"less"},{"name":"=","id":"equally"},{"name":"<>","id":"notequally"},
                {"name":vcbl[lang]["betweenText"],"id":"between"}]
        }),
        queryMode: 'local',
        displayField: 'name',
        valueField: 'id',
        value: 'equally',
        editable: false,
        listeners: {
            'change': function(combo,newVal){
                var panelFilter=combo.findParentByType('window').getComponent(2);
                panelFilter.getComponent(0).setValue(new Date());
                if(panelFilter.getComponent(1)!==undefined)panelFilter.getComponent(1).destroy();
                panelFilter.getComponent(0).setReadOnly(false);
                if(newVal==="between"){
                    var dateTo=Ext.create('Ext.form.field.Month', {
                        fieldLabel: vcbl[lang]["dateToLabel"],
                        padding: '0 0 0 25',
                        allowBlank: false,
                        editable: false,
                        format: 'm-Y',
                        flex: 1,
                        value: (panelE.value!==undefined)?(panelE.value.split(',')[1]!==undefined?panelE.value.split(',')[1].substr(3):new Date()):new Date()
                    });
                    panelFilter.add(dateTo);
                }
            },
            'afterrender': function(combo){
                if(panelE.condition!==undefined){
                    combo.select(panelE.condition);
                }
            }
        }
    });
    var digitFrom=Ext.create('Ext.form.field.Month', {
        fieldLabel: vcbl[lang]["dateLabel"],
        padding: '0 0 0 145',
        allowBlank: false,
        editable: false,
        format: 'm-Y',
        flex: 1,
        itemId: 'digitFrom',
        value: panelE.value!==undefined?panelE.value.split(',')[0].substr(3):new Date(),
        listeners: {
            'collapse': function(){}
        }
    });
    var win=Ext.create('eikonWin',{
        title: vcbl[lang]["filtersTitle"],
        height: 173,
        width: 800,
        resizable: false,
        defaultFocus: 'digitFrom',
        defaults: { labelWidth: 140 },
        items: [filterName,condition,{
            xtype: 'panel',
            border: false,
            layout: {type: 'hbox',align: 'stretch'},
            defaults: {labelWidth: 40},
            items: [digitFrom]
        }],
        buttons: [{
            cls: 'cta',
            text: vcbl[lang]["applyBut"],handler: function(){
                if(digitFrom.getValue()===null || digitFrom.getValue()===undefined || digitFrom.getValue()==="")return false;
                var textFilter=text+": ["+condition.getRawValue()+'] '+digitFrom.getRawValue();
                var value="15-"+digitFrom.getRawValue();
                var valueText=digitFrom.getRawValue();
                if(win.getComponent(2).getComponent(1)!==undefined){
                    var toCmp=win.getComponent(2).getComponent(1);
                    textFilter=textFilter+' '+vcbl[lang]["dateToLabel"]+' '+toCmp.getRawValue();
                    value=new Array("15-"+digitFrom.getRawValue(),"15-"+toCmp.getRawValue()).join();
                    valueText=new Array(digitFrom.getRawValue(),toCmp.getRawValue()).join();
                }
                if(panelE.value!==undefined){
                    panelE.changeFilterSet(textFilter,condition.getValue(),value,valueText);
                } else {
                    filterPanel.add(createFilterItem("new_"+fieldID,fieldID,condition.getValue(),value,valueText,"MonthYear",true,false,
                        filterPanel,text,false));
                    reloadGridWithFilter("new_"+fieldID,"add",gridID,fieldID);
                    reloadChartWithFilter("new_"+fieldID,"add",gridID,fieldID);
                }
                win.close();
            }
        },{ text: vcbl[lang]["closeBut"],handler: function(){win.close();} }]
    }).show();
}
function showFiltersWinNumStr(typeFilter,text,fieldID,filterPanel,panelE,gridID,basicTypeFilter){
    var filterName=Ext.create('Ext.form.field.Text', { fieldLabel: vcbl[lang]["chooseParentFilterWin"], value: text });
    var listConditionDigit=[{"name":">","id":"better"},{"name":"<","id":"less"},{"name":"=","id":"equally"},
        {"name":"<>","id":"notequally"},{"name":vcbl[lang]["inText"],"id":"in"},{"name":vcbl[lang]["betweenText"],"id":"between"},
        {"name":vcbl[lang]["sprText"],"id":"spr"}];
    var listConditionStr=[{"name":vcbl[lang]["likeText"],"id":"like"},{"name":vcbl[lang]["sprText"],"id":"spr"}];
    var listConditionMemo=[{"name":vcbl[lang]["likeText"],"id":"like"}];
    var listCondition=listConditionDigit;
    var baseCondition="equally";
    var vtype="";
    switch(basicTypeFilter){
        case 'ID':              vtype="digit"; break;
        case 'ID Dictionary':   vtype="digit"; break;
        case 'Month':           vtype="month"; break;
        case 'Number':          vtype="digit"; break;
        case 'Price data':      vtype="digit"; break;
        case 'Quarter':         vtype="quarter"; break;
        case 'Volume data':     vtype="digit"; break;
        case 'Year':            vtype="year"; break;
        default:                vtype="";
    }
    if(!!basicTypeFilter)
        if(typeFilter==="str"){listCondition=listConditionStr;baseCondition="like";}
        else if(typeFilter==="memo"){listCondition=listConditionMemo;baseCondition="like";}
    var condition=Ext.create('Ext.form.ComboBox', {
        fieldLabel: vcbl[lang]["conditionLabel"],
        store: Ext.create('Ext.data.Store', {
            fields: ['abbr', 'name'],
            data: listCondition
        }),
        queryMode: 'local',
        displayField: 'name',
        valueField: 'id',
        value: baseCondition,
        editable: false,
        listeners: {
            'change': function(combo,newVal){
                var panelFilter=combo.findParentByType('window').getComponent(2);
                panelFilter.getComponent(0).setValue("");
                if(panelFilter.getComponent(1)!==undefined){
                    $("#"+panelFilter.getComponent(1).getId()).remove();
                    panelFilter.getComponent(1).destroy();
                }
                if(newVal!=="between"){
                    $("#"+panelFilter.getComponent(0).getId()).remove();
                    panelFilter.removeAll(true);
                } else { panelFilter.getComponent(0).setReadOnly(false); }
                var tempField={};
                if(newVal==="in"){
                    tempField=Ext.create('Ext.form.field.Text', {
                        fieldLabel: (typeFilter==="str" || typeFilter==="memo")?vcbl[lang]["strLabel"]:vcbl[lang]["digitLabel"],
                        padding: '0 0 0 145',
                        allowBlank: false,
                        flex: 1,
                        itemId: 'digitFrom',
                        vtype: vtype!==""?(vtype+"List"):vtype,
                        value: (panelE.value!==undefined && panelFilter.flagChange===0)?panelE.value:""
                    });
                    panelFilter.add(tempField);
                } else if(newVal==="spr"){
                    tempField=Ext.create('Ext.form.field.Text', {
                        fieldLabel: (typeFilter==="str" || typeFilter==="memo")?vcbl[lang]["strLabel"]:vcbl[lang]["digitLabel"],
                        padding: '0 0 0 145',
                        allowBlank: false,
                        readOnly: true,
                        flex: 1,
                        itemId: 'digitFrom',
                        vtype: vtype!==""?(vtype+"List"):vtype,
                        value: (panelE.value!==undefined && panelFilter.flagChange===0)?panelE.value:""
                    });
                    panelFilter.add(tempField);
                    
                    panelFilter.value=undefined;
                    panelFilter.valueText=undefined;
                    panelFilter.add({xtype: 'button',iconCls: 'edit_but',handler: function(){ showFiltersWinSpr(text,fieldID,panelFilter); }});
                    if(panelE.value!==undefined && panelFilter.flagChange===0){
                        panelFilter.getComponent(0).setValue(panelE.valueText!==undefined?panelE.valueText:panelE.value);
                        panelFilter.value=panelE.value;
                    } else showFiltersWinSpr(text,fieldID,panelFilter);
                } else if(newVal==="between"){
                    tempField=Ext.create('Ext.form.field.Text', {
                        fieldLabel: vcbl[lang]["dateToLabel"],
                        padding: '0 0 0 25',
                        allowBlank: false,
                        flex: 1,
                        vtype: vtype,
                        value: panelE.value!==undefined?panelE.value.split(",")[1]:""
                    });
                    panelFilter.add(tempField);
                } else {
                    tempField=Ext.create('Ext.form.field.Text', {
                        fieldLabel: (typeFilter==="str" || typeFilter==="memo")?vcbl[lang]["strLabel"]:vcbl[lang]["digitLabel"],
                        padding: '0 0 0 145',
                        allowBlank: false,
                        flex: 1,
                        itemId: 'digitFrom',
                        vtype: vtype,
                        value: (panelE.value!==undefined && panelFilter.flagChange===0)?panelE.value:""
                    });
                    panelFilter.add(tempField);
                }
                panelFilter.flagChange=1;
            },
            'afterrender': function(combo){
                if(panelE.condition!==undefined){
                    combo.select(panelE.condition);
                    combo.findParentByType('window').getComponent(2).flagChange=1;
                }
            }
        }
    });
    var digitFrom=Ext.create('Ext.form.field.Text', {
        fieldLabel: (typeFilter==="str" || typeFilter==="memo")?vcbl[lang]["strLabel"]:vcbl[lang]["digitLabel"],
        padding: '0 0 0 145',
        allowBlank: false,
        flex: 1,
        itemId: 'digitFrom',
        vtype: vtype,
        value: panelE.valueText!==null?(panelE.condition!=="between"?panelE.valueText:panelE.value.split(",")[0]):(panelE.condition!=="between"?panelE.value:panelE.value.split(",")[0])
    });
    var win=Ext.create('eikonWin',{
        title: vcbl[lang]["filtersTitle"],
        height: 173,
        width: 800,
        resizable: false,
        defaultFocus: 'digitFrom',
        defaults: { labelWidth: 140 },
        items: [filterName,condition,{
            margin: '0 0 3 0',
            xtype: 'panel',
            border: false,
            flagChange: 0,
            layout: {type: 'hbox',align: 'stretch'},
            defaults: {labelWidth: 40},
            items: [digitFrom]
        }],
        buttons: [{
            cls: 'cta',
            text: vcbl[lang]["applyBut"],handler: function(){
                var digitFrom=win.getComponent(2).getComponent(0);
                if(!(!!digitFrom.getValue()) || !digitFrom.validate()) return false;
                var textFilter=text+": "+condition.getRawValue()+' '+digitFrom.getRawValue();
                var value=digitFrom.getValue();
                var valueText=digitFrom.getValue();
                if(win.getComponent(2).getComponent(1)!==undefined){
                    if(win.getComponent(2).getComponent(1).getXType()==='textfield'){
                        var toCmp=win.getComponent(2).getComponent(1);
                        textFilter=textFilter+' '+vcbl[lang]["dateToLabel"]+' '+toCmp.getRawValue();
                        value=new Array(digitFrom.getValue(),toCmp.getValue()).join();
                        valueText=new Array(digitFrom.getRawValue(),toCmp.getRawValue()).join();
                    } else {
                        value=win.getComponent(2).value;
                        valueText=digitFrom.getRawValue();
                    }
                }
                if(panelE.value!==undefined){
                    panelE.changeFilterSet(textFilter,condition.getValue(),value,valueText);
                } else {
                    filterPanel.add(createFilterItem("new_"+fieldID,fieldID,condition.getValue(),value,valueText,typeFilter,true,false,
                        filterPanel,text,false));
                    reloadGridWithFilter("new_"+fieldID,"add",gridID,fieldID);
                    reloadChartWithFilter("new_"+fieldID,"add",gridID,fieldID);
                }
                win.close();
            }
        },{ text: vcbl[lang]["closeBut"],handler: function(){win.close();} }]
    }).show();
}

function findUnsavedFilters(panel,as,save){
    var filterPanel=centerPanel.getComponent(0);
    for(var i=0;i<filterPanel.items.length;i++){
        var filter=filterPanel.getComponent(i);
        if(filter.isLabelEmpty===undefined){
            if(as){
                if(save) newFilters[filter.getItemId()]=true;
                else {
                    if(filter.isNew)newFilters[filter.getItemId()]=true;
                    else if(filter.isEdit)editFilters[filter.getItemId()]=true;
                }
            } else {
                if(filter.isNew)newFilters[filter.getItemId()]=true;
                else if(filter.isEdit)editFilters[filter.getItemId()]=true;
            }
        }
    }
    if(save){
        if(as) startTakeReportID(panel,as);
        else startTakeFilterID(panel,centerPanel.reportID);
    }
}

function startTakeFilterID(panel,reportID,as){
    for(var key in newFilters) if(newFilters[key]) sendToFilterID(panel,reportID,key,as); 
    for(var key in editFilters) if(editFilters[key]) changeToFilterID(panel,reportID,key,as);
    if(!!as) delFilters={};
    else for(var key in delFilters) if(delFilters[key]) deleteToFilterID(panel,reportID,key);
    endTakeFilterID(panel,as);
}
function endTakeFilterID(panel,as){
    for(var key in newFilters) if(newFilters[key]) return;
    for(var key in editFilters) if(editFilters[key]) return;
    for(var key in delFilters) if(delFilters[key]) return;
    startTakeItemID(panel,as);
}
function sendToFilterID(panel,reportID,key,as){
    var filterForSave=Ext.getCmp(key);
    Ext.Ajax.request({
        method: 'GET',
        url: '/kortes/service/setFilter/',
        params: {reportID: reportID,fieldID: filterForSave.fieldID,condition: filterForSave.condition,val: filterForSave.value,
            typeFilter: filterForSave.typeFilter,userID: userID,lang: lang},
        success: function(response){
            var newFilterID=response.responseText;
            var oldFilterID=filterForSave.filterID;
            filterForSave.filterID=newFilterID;
            centerPanel.filters.forEach(function(el){
                if(el.filterID+""===oldFilterID+"") el.filterID=newFilterID;
            });
            centerPanel.grids.forEach(function(el){
                var grid=Ext.getCmp(el);
                if(grid===undefined)return;
                grid.findParentByType('panel').settings.settings.forEach(function(el2){
                    if(el2.dinamicFilter+""===oldFilterID+"")el2.dinamicFilter=newFilterID;
                });
            });
            centerPanel.charts.forEach(function(el){
                var grid=Ext.getCmp(el);
                if(grid===undefined)return;
                grid.findParentByType('panel').settings.settings.forEach(function(el2){
                    if(el2.dinamicFilter+""===oldFilterID+"")el2.dinamicFilter=newFilterID;
                });
            });
            filterForSave.isNew=false;
            newFilters[key]=false;
            endTakeFilterID(panel,as);
        },
        failure: function(){Ext.create('eikonDialog').alert(vcbl[lang]["statusTitle"],vcbl[lang]["errorSendToFilterID"]);}
    });
}
function changeToFilterID(panel,reportID,key,as){
    var filterForSave=Ext.getCmp(key);
    if(filterForSave===undefined){
        editFilters[key]=false;
        endTakeFilterID(panel);
        return;
    }
    Ext.Ajax.request({
        method: 'GET',
        url: '/kortes/service/setFilter/',
        params: {filterID: filterForSave.filterID,reportID: reportID,fieldID: filterForSave.fieldID,condition: filterForSave.condition,
            val: filterForSave.value,typeFilter: filterForSave.typeFilter,userID: userID,lang: lang},
        success: function(){
            filterForSave.isEdit=false;
            editFilters[key]=false;
            endTakeFilterID(panel,as);
        },
        failure: function(){Ext.create('eikonDialog').alert(vcbl[lang]["statusTitle"],vcbl[lang]["errorChangeToFilterID"]);}
    });
}
function deleteToFilterID(panel,reportID,key){
    Ext.Ajax.request({
        method: 'GET',
        url: '/kortes/service/deleteFilter/',
        params: {filterID: key, userID: userID, lang: lang},
        success: function(){
            delFilters[key]=false;
            endTakeFilterID(panel);
        },
        failure: function(){Ext.create('eikonDialog').alert(vcbl[lang]["statusTitle"],vcbl[lang]["errorDeleteFilter"]);}
    });
}

function reloadGridWithFilter(filterID,action,gridID,fieldID){
    var arFilters=centerPanel.filters;
    centerPanel.grids.forEach(function(el){
        var grid=Ext.getCmp(el);
        if(grid===undefined)return;
        var reload=false;
        var filters=new Array();
        if(grid.findParentByType('panel').settings.settings!==undefined)
            grid.findParentByType('panel').settings.settings.forEach(function(el2){
                if(action!==undefined){
                    if(action==="del" && el2.dinamicFilter!==undefined && el2.dinamicFilter+''===filterID+''){
                        el2.dinamicFilter="";
                        delete el2.dinamicFilterText;
                        reload=true;
                    }
                    if(action==="add" && el===gridID && el2.fieldID===fieldID){
                        el2.dinamicFilter=filterID;
                        reload=true;
                    }
                } else {
                    if(el2.dinamicFilter==filterID){
                        reload=true;
                    }
                }
                if(el2.dinamicFilter!==""){
                    for(var key in arFilters){
                        if(arFilters[key].filterID==el2.dinamicFilter)
                            filters.push({fieldID:arFilters[key].fieldID,condition:arFilters[key].condition,
                                typeFilter:arFilters[key].typeFilter,value:arFilters[key].value});
                    }
                }
            });
        if(reload){
            var panel=grid.findParentByType('panel');
            panel.isEdit=true;
            panel.settings.filters=filters;
            loadGridPanel(panel);
            saveInJET('reload grid with filter');
        }
    });
}
function reloadChartWithFilter(filterID,action,gridID,fieldID){
    var arFilters=centerPanel.filters;
    centerPanel.charts.forEach(function(el){
        var chart=Ext.getCmp(el);
        if(chart===undefined)return;
        var reload=false;
        var filters=new Array();
        if(chart.findParentByType('panel').settings.settings!==undefined)
            chart.findParentByType('panel').settings.settings.forEach(function(el2){
                if(action!==undefined){
                    if(action==="del" && el2.dinamicFilter!==undefined && el2.dinamicFilter+''===filterID+''){
                        el2.dinamicFilter="";
                        delete el2.dinamicFilterText;
                        reload=true;
                    }
                    if(action==="add" && el===gridID && el2.fieldID===fieldID){
                        el2.dinamicFilter=filterID;
                        reload=true;
                    }
                } else {
                    if(el2.dinamicFilter==filterID){
                        reload=true;
                    }
                }
                if(el2.dinamicFilter!==""){
                    for(var key in arFilters){
                        if(arFilters[key].filterID==el2.dinamicFilter)
                            filters.push({fieldID:arFilters[key].fieldID,condition:arFilters[key].condition,
                                typeFilter:arFilters[key].typeFilter,value:arFilters[key].value});
                    }
                }
            });
        if(reload){
            var panel=chart.findParentByType('panel');
            panel.isEdit=true;
            panel.settings.filters=filters;
            loadChartData(panel);
            saveInJET('reload chart with filter');
        }
    });
}

function deleteFilter(but){
    var delFilter=but.findParentByType('panel');
    var filterID=delFilter.filterID;
    if(!delFilter.isNew) delFilters[filterID]=true;
    delFilter.close();
    centerPanel.filters.forEach(function(el,index){
        if(el.filterID===filterID) centerPanel.filters.splice(index,1);
    });
    if(centerPanel.getComponent(0).items.length===0) centerPanel.clearFilters();
    saveInJET('delete filter');
    reloadGridWithFilter(filterID,"del");
    reloadChartWithFilter(filterID,"del");
}

function loadFilterPanel(filterPanel,contentPanel){
    Ext.Ajax.request({
        method: 'GET',
        url: '/kortes/service/getAllFilters/',
        params: {reportID: centerPanel.reportID, userID: userID, lang: lang, isFirst: isFirst.main},
        success: function(response){
            var ans=response.responseText;
            if(ans!==""){
                ans=JSON.parse(ans);
                if(ans.length>0){
                    ans.forEach(function(el){
                        filterPanel.add(createFilterItem(el.filterID,el.fieldID===undefined?null:el.fieldID,el.condition,el.value,
                            el.valueText,el.typeFilter,false,false,filterPanel,el.dataIndex,false));
                    });
                    filtersBut.toggle(true);
                }
            }
            loadReportPanel(contentPanel);
        },
        failure: function(){Ext.create('eikonDialog').alert(vcbl[lang]["statusTitle"],vcbl[lang]["errorLoadAllFilters"]);}
    });
}

function checkPanelForDelFilter(panel){
    if(panel.settings.settings!==undefined)panel.settings.settings.forEach(function(el){
        if(el.dinamicFilter!==""){
            var grids=centerPanel.grids;
            var flagDel=true;
            grids.forEach(function(el2){
                var grid=Ext.getCmp(el2);
                if(grid===undefined)return;
                var gridParent=grid.findParentByType("multiPanel");
                var setParent=gridParent.settings.settings;
                if(panel.getItemId()!==gridParent.getItemId())
                    setParent.forEach(function(el3){
                        if(el.dinamicFilter+''===el3.dinamicFilter+'')flagDel=false;
                    });
            });
            if(flagDel){
                var filterPanel=centerPanel.getComponent(0);
                for(var i=0;i<filterPanel.items.length;i++){
                    var filter=filterPanel.getComponent(i);
                    if(filter.filterID+''===el.dinamicFilter+''){
                        if(!filter.isNew) delFilters[filter.filterID]=true;
                        filter.destroy();
                        centerPanel.filters.forEach(function(el,index){
                            if(el.filterID===filter.filterID) centerPanel.filters.splice(index,1);
                        });
                    }
                }
            }
        }
    });
    if(centerPanel.filters.length===0){ centerPanel.clearFilters(); }
}

function showStaticFiltersWinDate(rec){
    var text=rec.get("text"),
        fieldID=rec.get("fieldID"),
        value=(rec.get("staticFilter")===null)?undefined:rec.get("staticFilter").value,
        conditionSel=(rec.get("staticFilter")===null)?undefined:rec.get("staticFilter").condition;
    var filterName=Ext.create('Ext.form.field.Text', { fieldLabel: vcbl[lang]["chooseParentFilterWin"], value: text });
    var condition=Ext.create('Ext.form.ComboBox', {
        fieldLabel: vcbl[lang]["conditionLabel"],
        store: Ext.create('Ext.data.Store', {
            fields: ['abbr', 'name'],
            data: [{"name":">","id":"better"},{"name":"<","id":"less"},{"name":"=","id":"equally"},{"name":"<>","id":"notequally"},{"name":"between","id":"between"}]
        }),
        queryMode: 'local',
        displayField: 'name',
        valueField: 'id',
        value: 'equally',
        editable: false,
        listeners: {
            'change': function(combo,newVal){
                var panelFilter=combo.findParentByType('window').getComponent(2);
                panelFilter.getComponent(0).setValue(new Date());
                if(panelFilter.getComponent(1)!==undefined)panelFilter.getComponent(1).destroy();
                panelFilter.getComponent(0).setReadOnly(false);
                if(newVal==="between"){
                    var dateTo=Ext.create('Ext.form.field.Date', {
                        fieldLabel: vcbl[lang]["dateToLabel"],
                        padding: '0 0 0 25',
                        allowBlank: false,
                        editable: false,
                        format: 'd-m-Y',
                        flex: 1,
                        value: (value!==undefined)?value.split(',')[1]:new Date()
                    });
                    panelFilter.add(dateTo);
                }
            },
            'afterrender': function(combo){
                if(conditionSel!==undefined){
                    combo.select(conditionSel);
                }
            }
        }
    });
    var digitFrom=Ext.create('Ext.form.field.Date', {
        fieldLabel: vcbl[lang]["dateLabel"],
        padding: '0 0 0 145',
        allowBlank: false,
        editable: false,
        format: 'd-m-Y',
        flex: 1,
        itemId: 'digitFrom',
        value: value!==undefined?value.split(',')[0]:new Date()
    });
    var win=Ext.create('eikonWin',{
        title: vcbl[lang]["filtersTitle"],
        height: 173,
        width: 800,
        resizable: false,
        defaultFocus: 'digitFrom',
        defaults: { labelWidth: 140 },
        items: [filterName,condition,{
            xtype: 'panel',
            border: false,
            layout: {type: 'hbox',align: 'stretch'},
            defaults: {labelWidth: 40},
            items: [digitFrom]
        }],
        buttons: [{
            cls: 'cta',
            text: vcbl[lang]["applyBut"],handler: function(){
                if(digitFrom.getValue()===null || digitFrom.getValue()===undefined || digitFrom.getValue()==="")return false;
                var value=digitFrom.getRawValue();
                if(win.getComponent(2).getComponent(1)!==undefined){
                    var toCmp=win.getComponent(2).getComponent(1);
                    value=new Array(digitFrom.getRawValue(),toCmp.getRawValue()).join();
                }
                rec.set('staticFilter',{fieldID:fieldID,condition:condition.getValue(),typeFilter:"date",value:value,valueText:""});
                win.close();
            }
        },{ text: vcbl[lang]["closeBut"],handler: function(){win.close();} }]
    }).show();
}
function showStaticFiltersWinDateMY(rec){
    var text=rec.get("text"),
        fieldID=rec.get("fieldID"),
        value=(rec.get("staticFilter")===null)?undefined:rec.get("staticFilter").value,
        conditionSel=(rec.get("staticFilter")===null)?undefined:rec.get("staticFilter").condition;
    var filterName=Ext.create('Ext.form.field.Text', { fieldLabel: vcbl[lang]["chooseParentFilterWin"], value: text });
    var condition=Ext.create('Ext.form.ComboBox', {
        fieldLabel: vcbl[lang]["conditionLabel"],
        store: Ext.create('Ext.data.Store', {
            fields: ['abbr', 'name'],
            data: [{"name":">","id":"better"},{"name":"<","id":"less"},{"name":"=","id":"equally"},{"name":"<>","id":"notequally"},{"name":"between","id":"between"}]
        }),
        queryMode: 'local',
        displayField: 'name',
        valueField: 'id',
        value: 'equally',
        editable: false,
        listeners: {
            'change': function(combo,newVal){
                var panelFilter=combo.findParentByType('window').getComponent(2);
                panelFilter.getComponent(0).setValue(new Date());
                if(panelFilter.getComponent(1)!==undefined)panelFilter.getComponent(1).destroy();
                panelFilter.getComponent(0).setReadOnly(false);
                if(newVal==="between"){
                    var dateTo=Ext.create('Ext.form.field.Month', {
                        fieldLabel: vcbl[lang]["dateToLabel"],
                        padding: '0 0 0 25',
                        allowBlank: false,
                        editable: false,
                        format: 'm-Y',
                        flex: 1,
                        value: (value!==undefined)?value.split(',')[1].substr(3):new Date()
                    });
                    panelFilter.add(dateTo);
                }
            },
            'afterrender': function(combo){
                if(conditionSel!==undefined){
                    combo.select(conditionSel);
                }
            }
        }
    });
    var digitFrom=Ext.create('Ext.form.field.Month', {
        fieldLabel: vcbl[lang]["dateLabel"],
        padding: '0 0 0 145',
        allowBlank: false,
        editable: false,
        format: 'm-Y',
        flex: 1,
        itemId: 'digitFrom',
        value: value!==undefined?value.split(',')[0].substr(3):new Date()
    });
    var win=Ext.create('eikonWin',{
        title: vcbl[lang]["filtersTitle"],
        height: 173,
        width: 800,
        resizable: false,
        defaultFocus: 'digitFrom',
        defaults: { labelWidth: 140 },
        items: [filterName,condition,{
            xtype: 'panel',
            border: false,
            layout: {type: 'hbox',align: 'stretch'},
            defaults: {labelWidth: 40},
            items: [digitFrom]
        }],
        buttons: [{
            cls: 'cta',
            text: vcbl[lang]["applyBut"],handler: function(){
                if(digitFrom.getValue()===null || digitFrom.getValue()===undefined || digitFrom.getValue()==="")return false;
                var value=digitFrom.getRawValue();
                if(win.getComponent(2).getComponent(1)!==undefined){
                    var toCmp=win.getComponent(2).getComponent(1);
                    value=new Array(digitFrom.getRawValue(),toCmp.getRawValue()).join();
                }
                rec.set('staticFilter',{fieldID:fieldID,condition:condition.getValue(),typeFilter:"MonthYear",value:value,valueText:""});
                win.close();
            }
        },{ text: vcbl[lang]["closeBut"],handler: function(){win.close();} }]
    }).show();
}
function showStaticFiltersWinNumStr(typeFilter,rec,basicTypeFilter){
    var text=rec.get("text"),
        fieldID=rec.get("fieldID"),
        value=(rec.get("staticFilter")===null)?undefined:rec.get("staticFilter").value,
        valueText=(rec.get("staticFilter")===null)?undefined:rec.get("staticFilter").valueText,
        conditionSel=(rec.get("staticFilter")===null)?undefined:rec.get("staticFilter").condition;
    var filterName=Ext.create('Ext.form.field.Text', { fieldLabel: vcbl[lang]["chooseParentFilterWin"], value: text });
    var listConditionDigit=[{"name":">","id":"better"},{"name":"<","id":"less"},{"name":"=","id":"equally"},
        {"name":"<>","id":"notequally"},{"name":"in","id":"in"},{"name":"between","id":"between"},{"name":vcbl[lang]["sprText"],"id":"spr"}];
    var listConditionStr=[{"name":vcbl[lang]["likeText"],"id":"like"},{"name":vcbl[lang]["sprText"],"id":"spr"}];
    var listConditionMemo=[{"name":vcbl[lang]["likeText"],"id":"like"}];
    var listCondition=listConditionDigit;
    var baseCondition="equally";
    var vtype="";
    switch(basicTypeFilter){
        case 'ID':              vtype="digit"; break;
        case 'ID Dictionary':   vtype="digit"; break;
        case 'Month':           vtype="month"; break;
        case 'Number':          vtype="digit"; break;
        case 'Price data':      vtype="digit"; break;
        case 'Quarter':         vtype="quarter"; break;
        case 'Volume data':     vtype="digit"; break;
        case 'Year':            vtype="year"; break;
        default:                vtype="";
    }
    if(!!basicTypeFilter)
        if(typeFilter==="str"){listCondition=listConditionStr;baseCondition="like";}
        else if(typeFilter==="memo"){listCondition=listConditionMemo;baseCondition="like";}
    var condition=Ext.create('Ext.form.ComboBox', {
        fieldLabel: vcbl[lang]["conditionLabel"],
        store: Ext.create('Ext.data.Store', {
            fields: ['abbr', 'name'],
            data: listCondition
        }),
        queryMode: 'local',
        displayField: 'name',
        valueField: 'id',
        value: baseCondition,
        editable: false,
        listeners: {
            'change': function(combo,newVal){
                var panelFilter=combo.findParentByType('window').getComponent(2);
                panelFilter.getComponent(0).setValue("");
                
                if(panelFilter.getComponent(1)!==undefined){
                    $("#"+panelFilter.getComponent(1).getId()).remove();
                    panelFilter.getComponent(1).destroy();
                }
                if(newVal!=="between"){
                    $("#"+panelFilter.getComponent(0).getId()).remove();
                    panelFilter.removeAll(true);
                } else { panelFilter.getComponent(0).setReadOnly(false); }
                var tempField={};
                
                if(newVal==="in"){
                    tempField=Ext.create('Ext.form.field.Text', {
                        fieldLabel: (typeFilter==="str" || typeFilter==="memo")?vcbl[lang]["strLabel"]:vcbl[lang]["digitLabel"],
                        padding: '0 0 0 145',
                        allowBlank: false,
                        flex: 1,
                        itemId: 'digitFrom',
                        vtype: vtype!==""?(vtype+"List"):vtype,
                        value: (value!==undefined && panelFilter.flagChange===0)?value:""
                    });
                    panelFilter.add(tempField);
                } else if(newVal==="spr"){
                    tempField=Ext.create('Ext.form.field.Text', {
                        fieldLabel: (typeFilter==="str" || typeFilter==="memo")?vcbl[lang]["strLabel"]:vcbl[lang]["digitLabel"],
                        padding: '0 0 0 145',
                        allowBlank: false,
                        readOnly: true,
                        flex: 1,
                        itemId: 'digitFrom',
                        vtype: vtype!==""?(vtype+"List"):vtype,
                        value: (value!==undefined && panelFilter.flagChange===0)?value:""
                    });
                    panelFilter.add(tempField);
                    
                    panelFilter.value=undefined;
                    panelFilter.valueText=undefined;
                    panelFilter.add({xtype: 'button',iconCls: 'edit_but',handler: function(){ showFiltersWinSpr(text,fieldID,panelFilter); }});
                    if(value!==undefined && panelFilter.flagChange===0){
                        panelFilter.getComponent(0).setValue(!!valueText?valueText:value);
                        panelFilter.value=value;
                    } else showFiltersWinSpr(text,fieldID,panelFilter);
                } else if(newVal==="between"){
                    tempField=Ext.create('Ext.form.field.Text', {
                        fieldLabel: vcbl[lang]["dateToLabel"],
                        padding: '0 0 0 25',
                        allowBlank: false,
                        flex: 1,
                        vtype: vtype,
                        value: value!==undefined?value.split(",")[1]:""
                    });
                    panelFilter.add(tempField);
                } else {
                    tempField=Ext.create('Ext.form.field.Text', {
                        fieldLabel: (typeFilter==="str" || typeFilter==="memo")?vcbl[lang]["strLabel"]:vcbl[lang]["digitLabel"],
                        padding: '0 0 0 145',
                        allowBlank: false,
                        flex: 1,
                        itemId: 'digitFrom',
                        vtype: vtype,
                        value: (value!==undefined && panelFilter.flagChange===0)?value:""
                    });
                    panelFilter.add(tempField);
                }
                panelFilter.flagChange=1;
            },
            'afterrender': function(combo){
                if(conditionSel!==undefined){
                    combo.select(conditionSel);
                    combo.findParentByType('window').getComponent(2).flagChange=1;
                }
            }
        }
    });
    var digitFrom=Ext.create('Ext.form.field.Text', {
        fieldLabel: (typeFilter==="str" || typeFilter==="memo")?vcbl[lang]["strLabel"]:vcbl[lang]["digitLabel"],
        padding: '0 0 0 145',
        allowBlank: false,
        flex: 1,
        itemId: 'digitFrom',
        vtype: vtype,
        value: conditionSel!=="between"?(!!valueText?valueText:value):value.split(",")[0]
    });
    var win=Ext.create('eikonWin',{
        title: vcbl[lang]["filtersTitle"],
        height: 173,
        width: 800,
        resizable: false,
        defaultFocus: 'digitFrom',
        defaults: { labelWidth: 140 },
        items: [filterName,condition,{
            xtype: 'panel',
            border: false,
            flagChange: 0,
            layout: {type: 'hbox',align: 'stretch'},
            defaults: {labelWidth: 40},
            items: [digitFrom]
        }],
        buttons: [{
            cls: 'cta',
            text: vcbl[lang]["applyBut"],handler: function(){
                var digitFrom=win.getComponent(2).getComponent(0);
                if(!(!!digitFrom.getValue()) || !digitFrom.validate()) return false;
                var value=digitFrom.getValue();
                var valueText=digitFrom.getRawValue();
                if(win.getComponent(2).getComponent(1)!==undefined){
                    if(win.getComponent(2).getComponent(1).getXType()==='textfield')
                        value=new Array(digitFrom.getValue(),win.getComponent(2).getComponent(1).getValue()).join();
                    else value=win.getComponent(2).value;
                }
                rec.set('staticFilter',{fieldID:fieldID,condition:condition.getValue(),typeFilter:typeFilter,value:value,valueText:valueText});
                win.close();                
            }
        },{ text: vcbl[lang]["closeBut"],handler: function(){win.close();} }]
    }).show();
}

function filterForJET(){
    var filterPanel=centerPanel.getComponent(0);
    var ans=new Array();
    for(var i=0;i<filterPanel.items.length;i++){
        var filter=filterPanel.getComponent(i);
        if(filter.isLabelEmpty===undefined){
            ans.push({filterID: filter.filterID,fieldID: filter.fieldID,condition: filter.condition,value: filter.value,
                valueText: filter.valueText,typeFilter: filter.typeFilter,isNew: filter.isNew,isEdit: filter.isEdit,nameField: filter.nameField});
        }
    }
    return ans;
}