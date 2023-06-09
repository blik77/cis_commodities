function drawLineChart(idChart,w,h,data,set,arColor){
    var fontSize=(!!set.chartSettings.addSet.fontSize?set.chartSettings.addSet.fontSize:12)+"px";
    $('#'+idChart).highcharts({
        chart: { type: 'line', width: w, height: h },
        title: { text: '', x: -20, margin: 50, style:{ fontSize:fontSize } },
        subtitle: { style:{ fontSize:fontSize } },
        xAxis: {
            type: 'datetime',
            title: { text: getNameAxis(set.chartSettings.axisX,set), style:{ fontSize:fontSize } },
            labels:{ style:{ fontSize:fontSize } }
        },
        yAxis: {
            title: { text: getNameAxis(set.chartSettings.axisY,set), style:{ fontSize:fontSize } },
            labels:{ style:{ fontSize:fontSize } }
        },
        legend: legengSet(set.chartSettings.addSet,true),
        series: prepareData('line',data,set,arColor)
    });
}
function drawBarChart(idChart,w,h,data,set,arColor){
    var fontSize=(!!set.chartSettings.addSet.fontSize?set.chartSettings.addSet.fontSize:12)+"px";
    $('#'+idChart).highcharts({
        chart: { type: 'column', width: w, height: h },
        title: { text: '', style:{ fontSize:fontSize } },
        subtitle: { style:{ fontSize:fontSize } },
        xAxis: {
            type: 'datetime',
            title: { text: getNameAxis(set.chartSettings.axisX,set), style:{ fontSize:fontSize } },
            labels:{ style:{ fontSize:fontSize } }
        },
        yAxis: {
            title: { text: getNameAxis(set.chartSettings.axisY,set), style:{ fontSize:fontSize } },
            labels:{ style:{ fontSize:fontSize } }
        },
        legend: legengSet(set.chartSettings.addSet,true),
        series: prepareData('bar',data,set,arColor),
        plotOptions: { column: { pointPadding: 0.2 } }
    });
}
function drawBarHorChart(idChart,w,h,data,set,arColor){
    var modData=prepareData('barhor',data,set,arColor);
    var fontSize=(!!set.chartSettings.addSet.fontSize?set.chartSettings.addSet.fontSize:12)+"px";
    $('#'+idChart).highcharts({
        chart: { type: 'bar', width: w, height: h },
        title: { text: '', style:{ fontSize:fontSize } },
        subtitle: { style:{ fontSize:fontSize } },
        xAxis: {
            categories: modData.name,
            title: { text: getNameAxis(set.chartSettings.series,set), style:{ fontSize:fontSize } },
            labels:{ style:{ fontSize:fontSize } }
        },
        yAxis: {
            min: 0,
            title: { text: getNameAxis(set.chartSettings.axisY,set), style:{ fontSize:fontSize }, y: 2 },
            labels:{ style:{ fontSize:fontSize } }
        },
        legend: legengSet(set.chartSettings.addSet,true),
        series: modData.data,
        plotOptions: { column: { pointPadding: 0.2 } }
    });
}
function drawBubbleChart(idChart,w,h,data,set,arColor){
    var fontSize=(!!set.chartSettings.addSet.fontSize?set.chartSettings.addSet.fontSize:12)+"px";
    $('#'+idChart).highcharts({
        chart: { type: 'bubble', zoomType: 'xy', width: w, height: h },
        title: { text: '', style:{ fontSize:fontSize } },
        subtitle: { style:{ fontSize:fontSize } },
        legend: legengSet(set.chartSettings.addSet,true),
        series: [
            { data: [[97, 36, 79], [94, 74, 60], [68, 76, 58], [64, 87, 56], [68, 27, 73], [74, 99, 42], [7, 93, 87], [51, 69, 40], [38, 23, 33], [57, 86, 31]] },
            { data: [[25, 10, 87], [2, 75, 59], [11, 54, 8], [86, 55, 93], [5, 3, 58], [90, 63, 44], [91, 33, 17], [97, 3, 56], [15, 67, 48], [54, 25, 81]] },
            { data: [[47, 47, 21], [20, 12, 4], [6, 76, 91], [38, 30, 60], [57, 98, 64], [61, 17, 80], [83, 60, 13], [67, 78, 75], [64, 12, 10], [30, 77, 82]] }
        ]
    });
}
function drawSankeyChart(idChart,w,h,data,set,arColor){
    sankey(idChart,w,h,data,set);
}
function drawPieChart(idChart,w,h,data,set,arColor){
    var fontSize=(!!set.chartSettings.addSet.fontSize?set.chartSettings.addSet.fontSize:12)+"px";
    $('#'+idChart).highcharts({
        chart: { type: 'pie', width: w, height: h, marginTop: 10, plotBorderWidth: null },
        title: { text: '', style:{ fontSize:fontSize } },
        subtitle: { style:{ fontSize:fontSize } },
        legend: legengSet(set.chartSettings.addSet,true),
        series: [{
            name: ' ',
            colorByPoint: true,
            data: prepareData('pie',data,set,arColor)
        }],
        tooltip: {
            shared:false,
            headerFormat:'<span style="color:#ccc;font:12px ProximaNova, EikonFont, Arial, Helvetica, sans-serif;">{point.key}</span>',
            pointFormat: '{series.name}: {point.percentage:.1f}%'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: set.chartSettings.addSet.showLabels,
                    format: '{point.name}: {point.percentage:.2f} %',
                    style: { color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black', "fontSize": fontSize, "fontWeight": "normal" },
                    //connectorWidth: 2,
                    distance: 30
                },
                showInLegend: true
            }
        }
    });
}
function drawTreemapChart(idChart,w,h,data,set,arColor){
    var fontSize=(!!set.chartSettings.addSet.fontSize?set.chartSettings.addSet.fontSize:12);
    Highcharts.chart(idChart,{
        chart: { zoomType: 'none', width: w, height: h, marginTop: 10,
            events: {
                load: function(){
                    setTimeout(function(){
                        var chart=$('#'+idChart).highcharts();
                        if (!ongoing && !!boxes[idChart] && boxes[idChart].data.length>0){
                            ongoing=true;
                            chart.setSize(chart.chartWidth,chart.chartHeight);
                            ongoing=false;
                        }
                    },0);
                },
                redraw: function(){
                    var chart=$('#'+idChart).highcharts();
                    if(!ongoing && !!boxes[idChart] && boxes[idChart].data.length>0){
                        setTimeout(function(){
                            ongoing=true;
                            chart.setSize(chart.chartWidth,chart.chartHeight);
                            ongoing=false;
                        },0);
                    }
                }
            }
        },
        title: { text: '', style:{ fontSize:fontSize+"px" } },
        subtitle: { style:{ fontSize:fontSize+"px" } },
        series: [{
            type: 'treemap',
            layoutAlgorithm: 'squarified',
            allowDrillToNode: true,
            animation: false,
            dataLabels: {
                allowOverlap: false,
                enabled: false
            },
            levelIsConstant: false,
            levels: [{
                level: 1,
                dataLabels: {
                    enabled: true
                },
                borderWidth: 3
            }],
            data: prepareData('treemap',data,set,arColor)
        }],
        tooltip: {
            shared:false,
            formatter: function(){
                return '<span style="color:#ccc;font:12px ProximaNova, EikonFont, Arial, Helvetica, sans-serif;">'+this.key+'</span>: '+numberWithCommas(this.point.value.toFixed(2))+" ("+(this.point.value/this.series.nodeMap[this.point.node.parent].childrenTotal*100).toFixed(2)+"%)"
            }
        },
        plotOptions: {
            treemap: {
                borderColor: "#242424",
                color: "",
                dataLabels: {
                    align: 'left',
                    verticalAlign: "top",
                    enabled: true,
                    formatter: function(){
                        var point=this.point;
                        if(!ongoing){
                            setTimeout(function(){
                                if(!!!point.graphic){ return false; }
                                var box=point.graphic.getBBox();
                                if(!!!boxes[idChart]){ boxes[idChart]={data: []}; }
                                boxes[idChart].data[point.index]=[box.width, box.height];
                            },0);
                        }
                        var addText=[numberWithCommas(this.point.value.toFixed(2)),(this.point.value/this.series.nodeMap[this.point.node.parent].childrenTotal*100).toFixed(2)+"%"];
                        var newName="";
                        if(!!boxes[idChart] && !!boxes[idChart].data[point.index]){
                            newName=buildBetterLabel(this.key, boxes[idChart].data[point.index][0], boxes[idChart].data[point.index][1],fontSize,addText,2);
                        } else {
                            newName=this.key+"<br>"+addText.join('<br>');
                        }
                        return newName;
                    },
                    x: -1,
                    y: -5,
                    style:  {"fontSize": fontSize+"px", "fontWeight": "normal", color: "#eee", "textOutline": "none" }
                },
                drillUpButton: {
                    position: {
                        align: 'right',
                        x: -10,
                        y: 8
                    },
                    theme: {
                        fill: '#3c3c42',
                        stroke: '#0a0a0a',
                        "stroke-width": 1,
                        height: 12,
                        style: { color: '#c2c2c2', font:"12px ProximaNova, EikonFont, Arial, Helvetica, sans-serif" },
                        r: 0,
                        states: {
                            hover: {
                                fill: '#4f4f57',
                                stroke: '#0a0a0a',
                                "stroke-width": 1,
                                style: { color: '#f2f2f2' }
                            }
                        }
                    }
                }
            }
        }
    });
}
function drawXRangeChart(idChart,w,h,data,set,arColor){
    getXRangeData(idChart,w,h,data,set,arColor);
}

function prepareData(typeChart,data,set,arColor){
    data=JSON.parse(data);
    var tempAns=[];
    if(typeChart==='line' || typeChart==='bar'){
        for(var key in data){
            var tempData=[];
            for(var key2 in data[key].values){
                var tempDate=data[key].values[key2].X.split('-');
                tempData.push([Date.UTC(tempDate[2],tempDate[1]-1,tempDate[0]),data[key].values[key2].Y*1]);
            }
            var tempColor='#FF9933';
            if(!!set.chartSettings.series.allFields && !!arColor && arColor.length>0){
                arColor.forEach(function(el){
                    if(el.id===data[key].SeriesID)tempColor="#"+el.color;
                });
            } else {
                for(var key2 in set.chartSettings.series.data){
                    if(set.chartSettings.series.data[key2].id===data[key].SeriesID) tempColor="#"+set.chartSettings.series.data[key2].color;
                }
            }
            tempAns.push({name: data[key].SeriesName,data: tempData,color: tempColor,idName: data[key].SeriesID});
        }
    } else if(typeChart==='barhor'){
        var minYear=0,maxYear=0,allData=[],listYear=[];
        data.forEach(function(el){
            var dataYear=[];
            el.values.forEach(function(val){
                var year=val.X.split("-")[2]*1;
                listYear[year]=1;
                if(minYear===0 || minYear>year){ minYear=year; }
                if(maxYear===0 || maxYear<year){ maxYear=year; }
                if(!!dataYear[year]){ dataYear[year]+=val.Y*1; }
                else { dataYear[year]=val.Y*1; }
            });
            allData.push({name: el.SeriesName, data: dataYear});
        });
        for(var year in listYear){
            allData.forEach(function(el){
                if(!!!el.data[year]) el.data[year]=0;
            });
        }
        allData.sort(function(a,b){
            if(a.data[minYear]<b.data[minYear]) return 1;
            if(a.data[minYear]>b.data[minYear]) return -1;
        });
        var listName=[],ansData=[];
        allData.forEach(function(el){ listName.push(el.name); });
        for(var year in listYear){
            var tempX=[];
            allData.forEach(function(el,i){ tempX[i]=el.data[year].toFixed(3)*1; });
            ansData.push({name: year*1, data: tempX});
        }
        return {name: listName, data: ansData};
    } else if(typeChart==='pie'){
        for(var key in data){
            var tempData=0;
            for(var key2 in data[key].values) tempData+=(data[key].values[key2].Y*1);
            var tempColor='#FF9933';
            if(set.chartSettings.series.data.length===0 && !!arColor && arColor.length>0){
                arColor.forEach(function(el){
                    if(el.id===data[key].SeriesID){ console.log(el.id+" - "+data[key].SeriesID); tempColor="#"+el.color; }
                });
            } else {
                for(var key2 in set.chartSettings.series.data){
                    if(set.chartSettings.series.data[key2].id===data[key].SeriesID) tempColor="#"+set.chartSettings.series.data[key2].color;
                }
            }
            tempAns.push({name: data[key].SeriesName,y: tempData,color: tempColor,idName: data[key].SeriesID,id: "pie_"+data[key].SeriesID});
        }
        tempAns.sort(function(a,b){return b.y-a.y;});
    } else if(typeChart==='sankey'){
        
    } else if(typeChart==='treemap'){
        tempAns=getTreemapData(data);
    }
    if(set.chartSettings.addSet.enable && typeChart==='pie'){
        if(set.chartSettings.addSet.set1.enable){
            var other=0;
            if(set.chartSettings.addSet.set1.cond===1){
                for(var i=set.chartSettings.addSet.set1.val;i<tempAns.length;i++){ other+=tempAns[i].y; }
                if(other>0){
                    tempAns=tempAns.slice(0,set.chartSettings.addSet.set1.val);
                    tempAns.push({name: vcbl[lang]["otherText"],y: other,color: "A0A0A0",id: "pie_other"});
                }
            } else {
                var sumAll=0;
                for(var i=0;i<tempAns.length;i++){ sumAll+=tempAns[i].y; }
                var indLimit=0;
                for(var i=0;i<tempAns.length;i++) if(tempAns[i].y/sumAll*100<set.chartSettings.addSet.set1.val) {indLimit=i;break;}
                if(set.chartSettings.addSet.set1.cond===2){
                    for(var i=indLimit;i>=0;i--){ other+=tempAns[i].y; }
                    tempAns=tempAns.slice(indLimit);
                    tempAns=[{name: vcbl[lang]["otherText"],y: other,color: "A0A0A0",id: "pie_other"}].concat(tempAns);
                } else if(set.chartSettings.addSet.set1.cond===3){
                    for(var i=indLimit;i<tempAns.length;i++){ other+=tempAns[i].y; }
                    tempAns=tempAns.slice(0,indLimit);
                    tempAns.push({name: vcbl[lang]["otherText"],y: other,color: "A0A0A0",id: "pie_other"});
                }
            }
        } else if(set.chartSettings.addSet.set2.enable){
            var other={name: vcbl[lang]["otherText"],y: 0,color: "A0A0A0",id: "pie_other"};
            var noOther=[];
            for(var i=0;i<tempAns.length;i++){
                var flag=false;
                for(var key in set.chartSettings.addSet.set2.val){
                    if(set.chartSettings.addSet.set2.val[key]*1===tempAns[i].idName*1) flag=true;
                }
                if(flag) noOther.push({name: tempAns[i].name, y: tempAns[i].y, color: tempAns[i].color,id: "pie_"+i});
                if(!flag) other.y+=tempAns[i].y;
            }
            noOther.push(other);
            tempAns=noOther;
        }
    }
    return tempAns;
}
function getNameAxis(axis,set){
    var nameAxis="";
    if(!!axis.addSet && axis.addSet.name!=="") nameAxis=axis.addSet.name;
    else {
        for(var key in set.settings){
            if(set.settings[key].fieldID*1===axis.fieldID*1) nameAxis=set.settings[key].text;
        }
    }
    return nameAxis;
}
function getTreemapDataVal(data,idParent){
    var points=[],i=0;
    for(var key in data){
        if(typeof data[key]!=="object" && typeof (data[key]*1)==="number"){
            points.push({id: idParent+'_'+i, name: key, parent: idParent, value: data[key]*1});
        } else {
            points.push({id: idParent+'_'+i, name: key, parent: idParent});
            points=points.concat(getTreemapDataVal(data[key],idParent+'_'+i));
        }
        i++;
    }
    return points;
}
function getTreemapData(data){
    var points=[],i=0;
    for(var key in data){
        points.push({id: 'id_'+i, name: key, color: Highcharts.getOptions().colors[i-Math.floor(i/12)*12]});
        points=points.concat(getTreemapDataVal(data[key],'id_'+i));
        i++;
    }
    return points;
}

function showChartSetWin(but){
    var panel=but.findParentByType('multiPanel');
    var oldSettings=JSON.stringify(panel.settings);
    if(panel.getComponent(0)!==undefined && panel.getComponent(0).getXType()!=="grid" && !panel.getComponent(0).isChart) return false;
    var step1=step1Win(panel),step2=step2Win(panel),step3=step3Win(panel),step4=step4Win(panel),step5=step5Win(panel);
    var infoNumStep=Ext.create({xtype: 'tbtext',html: vcbl[lang]['stepText']+' 1 '+vcbl[lang]['fromText']+' 5'});
    var backBut=Ext.create({
        xtype: 'button',
        iconCls: 'icon-back',
        text: vcbl[lang]['backText'],
        disabled: true,
        handler: function(){
            var numberStep=tab.getActiveTab().numberStep;
            if(!!tab.arMinMax[numberStep-3])
                if(tab.arMinMax[numberStep-3][1]>0) tab.setActiveTab(numberStep-2);
                else tab.setActiveTab(numberStep-3);
            else tab.setActiveTab(numberStep-2);
        }
    });
    var forwardBut=Ext.create({
        xtype: 'button',
        iconCls: 'icon-forward',
        iconAlign: 'right',
        text: vcbl[lang]['forwardText'],
        disabled: true,
        handler: function(){
            var numberStep=tab.getActiveTab().numberStep;
            if(!!tab.arMinMax[numberStep-1])
                if(tab.arMinMax[numberStep-1][1]>0) tab.setActiveTab(numberStep);
                else tab.setActiveTab(numberStep+1);
            else tab.setActiveTab(numberStep);
        }
    });
    var exportBut=Ext.create({
        xtype: 'button',
        cls: 'cta',
        iconCls: 'icon-export-chart',
        iconAlign: 'right',
        text: vcbl[lang]['displayText'],
        disabled: true,
        handler: function(){tab.prepareToLoadChartData();}
    });
    var tab=Ext.create('Ext.tab.Panel', {
        minTabWidth: 125,
        defaults: {disabled: true},
        items: [step1,step2,step3,step4,step5],
        arMinMax: [[0,0],[0,0],[0,0]],
        listeners: { 'tabchange': function(tabPanel,newCard){
            infoNumStep.setText(vcbl[lang]['stepText']+' '+newCard.numberStep+' '+vcbl[lang]['fromText']+' 5');
            tabPanel.enForward().enExport();
            if(newCard.numberStep===2){ newCard.forFilter(step3.axis.concat(step4.axis)); }
            else if(newCard.numberStep===3){ newCard.forFilter(step2.axis.concat(step4.axis)); }
            else if(newCard.numberStep===4){ newCard.forFilter(step2.axis.concat(step3.axis)); }
        } },
        enForward:  function(){
            var numTab=this.getActiveTab().numberStep;
            if(numTab===1) backBut.disable(); else backBut.enable();
            var flagForwardBut=false;
            switch(numTab){
                case 1: if(step1.typeChart!=='') {flagForwardBut=true;} break;
                case 2: if(step2.axis.length>=this.arMinMax[0][0] && step2.axis.length<=this.arMinMax[0][1]) {flagForwardBut=true;}
                        break;
                case 3: if(step3.axis.length>=this.arMinMax[1][0] && step3.axis.length<=this.arMinMax[1][1]) {flagForwardBut=true;}
                        break;
                case 4: if(step4.axis.length>=this.arMinMax[2][0] && step4.axis.length<=this.arMinMax[2][1] && !this.getTabBar().getComponent(4).isHidden()){
                            if(this.arMinMax[2][1]>0 && step4.axis.length>0){
                                var arSer=step4.setGrid.getStore().getRange();
                                var flag=false;
                                for(var key in arSer) if(arSer[key].get('check')) flag=true;
                                if(flag) flagForwardBut=true;
                            } else if(this.arMinMax[2][1]===0 && step4.axis.length===0) flagForwardBut=true;
                        }
                        break;
                default: break;
            }
            if(flagForwardBut) forwardBut.enable(); else forwardBut.disable();
            return this;
        },
        enExport: function(){
            var checkStep1=!!step1.typeChart;
            var checkStep2=(step2.axis.length>=this.arMinMax[0][0] && step2.axis.length<=this.arMinMax[0][1]);
            var checkStep3=(step3.axis.length>=this.arMinMax[1][0] && step3.axis.length<=this.arMinMax[1][1]);
            var checkStep4=false;
            var checkStep5=true;
            if(step4.axis.length>=this.arMinMax[2][0] && step4.axis.length<=this.arMinMax[2][1]){
                if(this.arMinMax[2][1]>0 && step4.axis.length>0){
                    var arSer=step4.setGrid.getStore().getRange();
                    var flag=false;
                    for(var key in arSer)if(arSer[key].get('check'))flag=true;
                    if(flag) checkStep4=true;
                } else if(this.arMinMax[2][1]===0 && step4.axis.length===0) checkStep4=true;
            }
            
            if(checkStep1 && this.arMinMax[0][1]>0)
                step2.enable(); else step2.disable();
            if(checkStep1 && (checkStep2 || this.arMinMax[0][1]===0) && this.arMinMax[1][1]>0)
                step3.enable(); else step3.disable();
            if(checkStep1 && (checkStep2 || this.arMinMax[0][1]===0) && (checkStep3 || this.arMinMax[1][1]===0) && this.arMinMax[2][1]>0)
                step4.enable(); else step4.disable();
            if(checkStep1 && (checkStep2 || this.arMinMax[0][1]===0) &&
                    (checkStep3 || this.arMinMax[1][1]===0) && (checkStep4 || this.arMinMax[2][1]===0))
                step5.enable(); else step5.disable();
            if(checkStep1 && checkStep2 && checkStep3 && checkStep4 && checkStep5) exportBut.enable();
            else exportBut.disable();
            return this;
        },
        prepareToLoadChartData: function(){
            win.forDraw=true;
            var typeChart=step1.typeChart;
            var axisX={fieldID:step2.axis,addSet:{name:step2.axisXName.getValue()}};
            var axisY={fieldID:step3.axis,addSet:{name:step3.axisYName.getValue()}};
            var arSer=step4.setGrid.getStore().getRange();
            var data=[];
            for(var key in arSer)if(arSer[key].get('check'))data.push({id:arSer[key].get('id'),color:arSer[key].get('color'), name:arSer[key].get('text')});
            var series={allFields:step4.allFields,fieldID:step4.axis,data:data};
            var chartSettings={typeChart: typeChart, axisX: axisX, axisY: axisY, series: series, addSet: step5.addSet};
            panel.settings.chartSettings=chartSettings;
            panel.isEdit=true;
            sendHit(arDS[findIndexByKeyValue(arDS,"dataIndex",panel.settings.dsID)].desc);
            loadChartData(panel);
            win.close();
        },
        reloadTagField: function(){
            var data=[];
            step4.setGrid.getStore().getRange().forEach(function(e,i,a){if(e.get('check'))data.push({id:e.get('id'),text:e.get('text')});});
            step5.tagField.setStore(Ext.create('Ext.data.Store', {
                fields: ['id','text'],
                data: data
            }));
            step5.tagField.setValue(step5.addSet.set2.val);
        },
        resetTagField: function(){ step5.resetStep(); this.reloadTagField(); },
        setMaxSelections: function(arMinMax){
            this.arMinMax=arMinMax;
            step2.getComponent(0).minSelections=arMinMax[0][0];
            step2.getComponent(0).maxSelections=arMinMax[0][1];
            step3.getComponent(0).minSelections=arMinMax[1][0];
            step3.getComponent(0).maxSelections=arMinMax[1][1];
            step4.getComponent(0).minSelections=arMinMax[2][0];
            step4.getComponent(0).maxSelections=arMinMax[2][1];
            return this;
        },
        setTitle: function(arTitle){
            var tB=this.getTabBar();
            if(arTitle[0]==="") { tB.getComponent(step2.numberStep-1).hide(); step2.setTitle(arTitle[0]); }
            else { tB.getComponent(step2.numberStep-1).show(); step2.setTitle(arTitle[0]); }
            if(arTitle[1]==="") { tB.getComponent(step3.numberStep-1).hide(); step3.setTitle(arTitle[1]); }
            else { tB.getComponent(step3.numberStep-1).show(); step3.setTitle(arTitle[1]); }
            if(arTitle[2]==="") { tB.getComponent(step4.numberStep-1).hide(); step4.setTitle(arTitle[2]); }
            else { tB.getComponent(step4.numberStep-1).show(); step4.setTitle(arTitle[2]); }
            if(arTitle[3]==="") { tB.getComponent(step5.numberStep-1).hide(); step5.setTitle(arTitle[3]); }
            else { tB.getComponent(step5.numberStep-1).show(); step5.setTitle(arTitle[3]); }
            return this;
        },
        resetAllStep: function(){
            step5.resetStep();
            step4.resetStep();
            step3.resetStep();
            step2.resetStep();
            return this;
        },
        resetStep4: function(){
            step4.resetStep();
            return this;
        },
        updateStep5: function(addSet1){
            if(!addSet1) return false;
            step5.addSet.set1=addSet1;
            step5.updateStep();
        },
        step2ItemSel: function(type){
            step2.setItemSel(type);
        }
    });
    var win=new Ext.create('eikonWin',{
        forDraw: false,
        title: vcbl[lang]["titleSettingsChartWin"],
        oldSettings: oldSettings,
        height: 600,
        width: 750,
        numberStep: 1,
        layout: 'fit',
        bodyPadding: 0,
        items: [tab],
        buttons: [infoNumStep,{ xtype: 'tbfill' },backBut,forwardBut,exportBut,
            {text: vcbl[lang]["cancelBut"],handler: function(){win.close();}}
        ],
        listeners: { 'close': function(w){ if(!win.forDraw) panel.settings=JSON.parse(w.oldSettings); } }
    }).show();
}
function step1Win(panel){
    var barChartBut=Ext.create({xtype: 'button',iconCls: 'icon-chart-bar-large', tooltip: 'Bar chart', typeChart: 'bar'});
    var barHorChartBut=Ext.create({xtype: 'button',iconCls: 'icon-chart-barhor-large', tooltip: 'Horizontal bar chart', typeChart: 'barhor'});
    var lineChartBut=Ext.create({xtype: 'button',iconCls: 'icon-chart-line-large', tooltip: 'Line chart', typeChart: 'line'});
    var pieChartBut=Ext.create({xtype: 'button',iconCls: 'icon-chart-pie-large', tooltip: 'Pie chart', typeChart: 'pie'});
    var XRangeChartBut=Ext.create({xtype: 'button',iconCls: 'icon-analytics-align-center-large', tooltip: 'Gantt chart', typeChart: 'xrange'});
    var arBut=[barChartBut,barHorChartBut,lineChartBut,pieChartBut];
    if(enSankey){
        var sankeyChartBut=Ext.create({xtype: 'button',iconCls: 'icon-chart-sankey-large', tooltip: 'Sankey chart', typeChart: 'sankey'});
        arBut.push(sankeyChartBut);
    }
    if(enBubble){
        var bubbleChartBut=Ext.create({xtype: 'button',iconCls: 'icon-chart-bubble-large', tooltip: 'Bubble chart', typeChart: 'bubble'});
        arBut.push(bubbleChartBut);
    }
    if(enTreemap){
        var treemapChartBut=Ext.create({xtype: 'button',iconCls: 'icon-chart-heatmap-large', tooltip: 'Tree Map chart', typeChart: 'treemap'});
        arBut.push(treemapChartBut);
    }
    arBut.push(XRangeChartBut);
    var butContainer=Ext.create({
        xtype: 'container',
        layout: { type: 'table', columns: 3, tdAttrs: { style: 'padding: 10px 10px;' } },
        defaults: { enableToggle: true, xtype: 'button', scale: 'large', toggleGroup: 'step1',
            listeners: {
                'toggle': function(but,pressed){
                    var tabpanel=this.findParentByType('tabpanel');
                    var alreadyPressed=true;
                    if(pressed){
                        if(!!!tab.typeChart || panel.settings.chartSettings.typeChart!==but.typeChart){ alreadyPressed=false; }
                        tab.typeChart=but.typeChart;
                        panel.settings.chartSettings.typeChart=but.typeChart;
                        if(tab.initToggle) tabpanel.resetAllStep();
                        if(tab.typeChart==="bar")
                            tabpanel.setMaxSelections([[1,1],[1,1],[1,1]]).setTitle([
                                vcbl[lang]['step2TitleText'],vcbl[lang]['step3TitleText'],vcbl[lang]['step4TitleText'],vcbl[lang]['step5TitleText']
                            ]);
                        else if(tab.typeChart==="barhor")
                            tabpanel.setMaxSelections([[1,1],[1,1],[1,1]]).setTitle([
                                vcbl[lang]['step2TitleText'],vcbl[lang]['step3TitleText'],vcbl[lang]['step4TitleText'],vcbl[lang]['step5TitleText']
                            ]);
                        else if(tab.typeChart==="sankey")
                            tabpanel.setMaxSelections([[2,5],[1,1],[0,0]]).setTitle([
                                vcbl[lang]['step2TitleTextSankey'],vcbl[lang]['step3TitleTextSankey'],"",vcbl[lang]['step5TitleText']
                            ]).resetStep4().updateStep5(tab.initToggle?{enable: true, cond: 1,val: 10}:false);
                        else if(tab.typeChart==="line")
                            tabpanel.setMaxSelections([[1,1],[1,1],[1,1]]).setTitle([
                                vcbl[lang]['step2TitleText'],vcbl[lang]['step3TitleText'],vcbl[lang]['step4TitleText'],vcbl[lang]['step5TitleText']
                            ]);
                        else if(tab.typeChart==="pie")
                            tabpanel.setMaxSelections([[0,0],[1,1],[1,1]]).setTitle([
                                "",vcbl[lang]['step3TitleTextPie'],vcbl[lang]['step4TitleTextPie'],vcbl[lang]['step5TitleText']
                            ]).updateStep5(tab.initToggle?{enable: true, cond: 1,val: 3}:false);
                        else if(tab.typeChart==="treemap"){
                            /*var checkYear=false;
                            centerPanel.filters.forEach(function(el){
                                var elTypeFilter=getBasicTypeFilter(el.fieldID);
                                if(elTypeFilter==="Year" || elTypeFilter==="MonthYear" || elTypeFilter==="Date") checkYear=true;
                            });*/
                            var checkYear=true;
                            if(checkYear){
                                tabpanel.setMaxSelections([[2,5],[1,1],[0,0]]).setTitle([
                                    vcbl[lang]['step2TitleTextSankey'],vcbl[lang]['step3TitleTextSankey'],"",vcbl[lang]['step5TitleText']
                                ]).resetStep4().updateStep5(tab.initToggle?{enable: true, cond: 1,val: 3}:false);
                            } else {
                                var arYearField=[];
                                panel.settings.settings.forEach(function(el){
                                    if(el.typeFilter==="Year" || el.typeFilter==="MonthYear" || el.typeFilter==="Date"){ arYearField.push(el.text); }
                                });
                                Ext.create('eikonDialog').alert(vcbl[lang]["statusTitle"],vcbl[lang]["warningTreeMapUse"]+"<br>\""+arYearField.join("\", \"")+"\"");
                                but.toggle(false);
                            }
                        }
                        else if(tab.typeChart==="xrange"){
                            if(!alreadyPressed){ Ext.create('eikonDialog').alert(vcbl[lang]["statusTitle"],vcbl[lang]["warningXRangeUse"]); }
                            tabpanel.setMaxSelections([[1,5],[1,1],[0,0]]).setTitle([
                                vcbl[lang]['step2TitleTextSankey'],vcbl[lang]['step3TitleTextSankey'],"",vcbl[lang]['step5TitleText']
                            ]);
                        }
                        if(!tab.initToggle) tab.initToggle=true;
                        tabpanel.step2ItemSel(tab.typeChart);
                    } else if(tab.typeChart===but.typeChart) tab.typeChart='';
                    tabpanel.enForward().enExport();
                }
            }
        },
        items: arBut
    });
    var tab=Ext.create({
        xtype: 'panel',
        title: vcbl[lang]['step1TitleText'],
        numberStep: 1,
        initToggle: !(!!panel.settings.chartSettings.typeChart),
        typeChart: !!panel.settings.chartSettings.typeChart?panel.settings.chartSettings.typeChart:'',
        disabled: false,
        layout: 'center',
        items: [butContainer],
        listeners: {
            'afterrender': function(t){
                if(!!panel.settings.chartSettings.typeChart)
                    switch(panel.settings.chartSettings.typeChart){
                        case 'bar':     barChartBut.toggle(true);break;
                        case 'barhor':  barHorChartBut.toggle(true);break;
                        case 'sankey':  sankeyChartBut.toggle(true);break;
                        case 'line':    lineChartBut.toggle(true);break;
                        case 'pie':     pieChartBut.toggle(true);break;
                        case 'treemap': treemapChartBut.toggle(true);break;
                        case 'xrange':  XRangeChartBut.toggle(true);break;
                        default: break;
                    }
            }
        }
    });
    return tab;
}
function step2Win(panel){
    var typeChart=panel.settings.chartSettings && panel.settings.chartSettings.typeChart;
    var axisX=panel.settings.chartSettings && panel.settings.chartSettings.axisX;
    var axisXName=Ext.create({xtype:'textfield',fieldLabel:vcbl[lang]["axisXName"],value:!!axisX?axisX.addSet.name:''});
    var itemSel=Ext.create('Ext.ux.form.ItemSelector',{
        store: Ext.create('Ext.data.JsonStore',{
            data: dataItemSel(panel.settings.settings,(typeChart==="sankey" || typeChart==="treemap" || typeChart==="xrange")?"str":"date"),
            fields: ['fieldID','dataIndex','text']
        }),
        buttons: ['add','remove'],
        maxSelections: typeChart==="sankey"?5:1,
        flex: 1,
        queryMode: 'local',
        displayField: 'text',
        valueField: 'fieldID',
        fromTitle: vcbl[lang]["availableFilterWin"],
        toTitle: vcbl[lang]["selectedFilterWin"],
        value: !!axisX?axisX.fieldID:[],
        listeners: { 'change': function(itemSel,nV,oV){
            if(nV.length>itemSel.maxSelections){
                itemSel.setValue(oV);
            } else {
                tab.axis=nV;
                if(nV.length>0)
                    if(axisXName.getValue()==='') axisXName.setValue(itemSel.toField.getStore().getRange()[0].get('text'));
                else
                    axisXName.setValue('');
                this.findParentByType('tabpanel').enForward().enExport();
            }
        } }
    });
    var tab=Ext.create({
        xtype: 'panel',
        title: vcbl[lang]['step2TitleText'],
        numberStep: 2,
        axis: !!axisX?axisX.fieldID:[],
        axisXName: axisXName,
        layout: { type: 'vbox', pack: 'start', align: 'stretch' },
        bodyPadding: '10 10 5 10',
        items: [itemSel,axisXName],
        listeners: { 'enable': function(){ if(itemSel.getValue().length>0) this.findParentByType('tabpanel').enExport(); } },
        forFilter: function(ar){
            var toStore=itemSel.fromField.getStore();
            toStore.clearFilter();
            if(ar.length!==0)
                toStore.filterBy(function(rec){
                    var ans=true;
                    ar.forEach(function(el){if(el===rec.get('fieldID'))ans=false;});
                    return ans;
                });
        },
        resetStep: function(){
            this.axis=[];
            this.axisXName.setValue("");
            itemSel.setValue([]);
        },
        setItemSel: function(type){
            if(this.axis.length>0) return;
            if(type==="sankey" || type==="treemap" || type==="xrange"){
                itemSel.getStore().loadData(dataItemSel(panel.settings.settings,'str'));
                itemSel.fromField.store.loadData(dataItemSel(panel.settings.settings,'str'));
            } else {
                itemSel.getStore().loadData(dataItemSel(panel.settings.settings,'date'));
                itemSel.fromField.store.loadData(dataItemSel(panel.settings.settings,'date'));
            }
        }
    });
    return tab;
}
function step3Win(panel){
    var axisY=panel.settings.chartSettings && panel.settings.chartSettings.axisY;
    var axisYName=Ext.create({xtype:'textfield',fieldLabel:vcbl[lang]["axisYName"],value:!!axisY?axisY.addSet.name:''});
    var itemSel=Ext.create('Ext.ux.form.ItemSelector',{
        store: Ext.create('Ext.data.JsonStore',{
            data: dataItemSel(panel.settings.settings,'digit'),
            fields: ['fieldID','dataIndex','text']
        }),
        buttons: ['add','remove'],
        maxSelections: 1,
        flex: 1,
        queryMode: 'local',
        displayField: 'text',
        valueField: 'fieldID',
        fromTitle: vcbl[lang]["availableFilterWin"],
        toTitle: vcbl[lang]["selectedFilterWin"],
        value: !!axisY?axisY.fieldID:[],
        listeners: { 'change': function(itemSel,nV,oV){
            if(nV.length>itemSel.maxSelections) itemSel.setValue(oV);
            else {
                tab.axis=nV;
                if(nV.length>0)
                    if(axisYName.getValue()==='') axisYName.setValue(itemSel.toField.getStore().getRange()[0].get('text'));
                else
                    axisYName.setValue('');
                this.findParentByType('tabpanel').enForward().enExport();
            }
        } }
    });
    var tab=Ext.create({
        xtype: 'panel',
        title: vcbl[lang]['step3TitleText'],
        numberStep: 3,
        axis: !!axisY?axisY.fieldID:[],
        axisYName: axisYName,
        layout: { type: 'vbox', pack: 'start', align: 'stretch' },
        bodyPadding: '10 10 5 10',
        items: [itemSel,axisYName],
        listeners: { 'enable': function(){ if(itemSel.getValue().length>0) this.findParentByType('tabpanel').enExport(); } },
        forFilter: function(ar){
            var toStore=itemSel.fromField.getStore();
            toStore.clearFilter();
            if(ar.length!==0)
                toStore.filterBy(function(rec){
                    var ans=true;
                    ar.forEach(function(el){if(el===rec.get('fieldID'))ans=false;});
                    return ans;
                });
        },
        resetStep: function(){
            this.axis=[];
            this.axisYName.setValue("");
            itemSel.setValue([]);
        }
    });
    return tab;
}
function step4Win(panel){
    var series=panel.settings.chartSettings && panel.settings.chartSettings.series;
    var typeChart=panel.settings.chartSettings && panel.settings.chartSettings.typeChart;
    var colorColHide=false;
    if(!!typeChart && typeChart==='barhor'){ colorColHide=true; }
    var filters=new Array();
    centerPanel.filters.forEach(function(el){
        filters.push({fieldID: el.fieldID,condition: el.condition,typeFilter: el.typeFilter,value: el.value});
    });
    filters=JSON.stringify(filters);
    var grid=Ext.create('Ext.grid.Panel', {
        columnLines: true,
        border: false,
        flex: 1,
        store: Ext.create('Ext.data.JsonStore',{
            proxy: {
                extraParams: {lang: lang,userID: userID,fieldID: !!series?series.fieldID[0]:"",filters: filters},
                type: 'ajax',
                timeout: timeoutAjax,
                url: "/kortes/service/getSubFilter/",
                reader: {
                    type: 'json',
                    transform: {
                        fn: function(data) {
                            var arColor=[];
                            if(data.length>0){
                                data.forEach(function(el){
                                    if(!!series){
                                        if(!!series.allFields){ el["check"]=true; }
                                        else for(var key in series.data)
                                            if(el["id"]===series.data[key].id){
                                                el["check"]=true;
                                                el["color"]=series.data[key].color;
                                                arColor.push(el["color"]);
                                            }
                                    }
                                });
                                data.forEach(function(el){
                                    var flag=false;
                                    if(!!series) for(var key in series.data) if(el["id"]===series.data[key].id) flag=true;
                                    if(!flag && el["color"]!==null){ arColor.push(el["color"]); }
                                });
                            }
                            return data;
                        }
                    }
                }
            },
            autoLoad: !!series,
            fields: ['check','id','text','color'],
            listeners: {'load': function(jS,rec){
                grid.findParentByType('tabpanel').enForward().enExport().reloadTagField();
            }}
        }),
        plugins: {ptype: 'cellediting', clicksToEdit: 1},
        columns: {
            defaults: {menuDisabled: true},
            items:[
                {xtype: 'checkcolumn',width: 25,dataIndex: 'check',sortable: false,
                    listeners: {'checkchange': function(checkcol,rI,checked){
                        this.findParentByType('tabpanel').enForward().enExport().reloadTagField();
                        selAll.checkOnlyEl=true;
                        selAll.setValue(false);
                        tab.updateStep5();
                    } }
                },
                {text: vcbl[lang]["nameLong"],width: 150,dataIndex: 'text'},
                {xtype: 'widgetcolumn',text: vcbl[lang]["colorText"],width: 84,dataIndex: 'color',hidden: colorColHide,widget: {
                    xtype: 'eikonColorField',
                    value: 'ff9933',
                    listeners: {'change': function(picker){
                        if (picker.getWidgetRecord){
                            var rec=picker.getWidgetRecord();
                            if(rec)rec.set('color',picker.getValue());
                        }
                    }}
                } }
            ]
        },
        listeners: { 'cellcontextmenu': function(view,td,cI,rec,tr,rI,e){ saveColor(rec,e,tab.axis[0]); } }
    });
    var itemSel=Ext.create('Ext.ux.form.ItemSelector',{
        store: Ext.create('Ext.data.JsonStore',{
            data: dataItemSel(panel.settings.settings,'str'),
            fields: ['fieldID','dataIndex','text']
        }),
        buttons: ['add','remove'],
        maxSelections: 1,
        height: 300,
        queryMode: 'local',
        displayField: 'text',
        valueField: 'fieldID',
        fromTitle: vcbl[lang]["availableFilterWin"],
        toTitle: vcbl[lang]["selectedFilterWin"],
        value: !!series?series.fieldID:[],
        listeners: { 'change': function(itemSel,nV,oV){
            if(nV.length>itemSel.maxSelections) itemSel.setValue(oV);
            else {
                tab.axis=nV;
                if(nV.length===0){
                    tab.axis=[];
                    grid.getStore().getProxy().extraParams.fieldID="";
                    grid.getStore().removeAll();
                } else if(grid.getStore().getProxy().extraParams.fieldID!==nV[0]){
                    grid.getStore().getProxy().extraParams.fieldID=nV[0];
                    grid.getStore().load();
                }
                this.findParentByType('tabpanel').enForward().enExport().reloadTagField();
            }
        } }
    });
    var selAll=Ext.create({xtype: 'checkbox',checked: (!!series && !!series.allFields)?series.allFields:false,
        boxLabel: vcbl[lang]["chooseAllText"],checkOnlyEl: false,
        listeners: {'change': function(checkbox,nV,oV){
            tab.setAllFields();
            if(checkbox.checkOnlyEl){checkbox.checkOnlyEl=false;return;}
            if(nV) {
                grid.getStore().getRange().forEach(function(el,i,ar){el.set("check",true);});
                tab.updateStep5();
            }
            else grid.getStore().getRange().forEach(function(el,i,ar){el.set("check",false);});
            grid.findParentByType('tabpanel').enForward().enExport().reloadTagField();
    }}});
    var tab=Ext.create({
        xtype: 'panel',
        title: vcbl[lang]['step4TitleText'],
        numberStep: 4,
        axis: !!series?series.fieldID:[],
        setGrid: grid,
        allFields: (!!series && !!series.allFields)?series.allFields:false,
        layout: { type: 'vbox', pack: 'start', align: 'stretch' },
        bodyPadding: '10 10 7 10',
        items: [itemSel,selAll,grid],
        listeners: { 'enable': function(){ if(itemSel.getValue().length>0) this.findParentByType('tabpanel').enExport(); } },
        forFilter: function(ar){
            var toStore=itemSel.fromField.getStore();
            toStore.clearFilter();
            if(ar.length!==0)
                toStore.filterBy(function(rec){
                    var ans=true;
                    ar.forEach(function(el){if(el===rec.get('fieldID'))ans=false;});
                    return ans;
                });
        },
        resetStep: function(){
            this.axis=[];
            selAll.setValue(false);
            itemSel.setValue([]);
            grid.getStore().getProxy().extraParams.fieldID="";
            grid.getStore().removeAll();
            series={fieldID:[],data:[]};
        },
        updateStep5: function(){
            if(panel.settings.chartSettings.typeChart==='pie'){
                var arSer=grid.getStore().getRange();
                var data=[];
                for(var key in arSer)if(arSer[key].get('check'))data.push(key);
                this.findParentByType('tabpanel').updateStep5({enable: true, cond: 1,val: data.length>3?Math.round(data.length/3):1});
            }
        },
        setAllFields: function(){
            this.allFields=selAll.getValue();
        }
    });
    return tab;
}
function step5Win(panel){
    var emptyAddSet={enable: false, showLabels: false, showLegend: true, locationLegend: 'b',fontSize: 12,
        maxItemsCount: 20, indent: 5, coloring: 'left', unit: '1',
        set1: {enable: false, cond: 1,val: 3},
        set2: {enable: false, cond: 1,val: []}
    };
    var addSet=panel.settings.chartSettings && panel.settings.chartSettings.addSet;
    if(!(!!addSet) || (!!addSet && addSet.enable===undefined)) addSet=emptyAddSet;
    else addSet=JSON.parse(JSON.stringify(addSet));
    var label1=Ext.create({xtype: 'label', text: addSet.set1.cond===1?"-х частей.":"%", margin: '3 0 0 5'});
    var tagField=Ext.create({
        xtype: 'tagfield',
        cls: 'tagfieldMod',
        store: Ext.create('Ext.data.Store', { fields: ['id','text'], data: [] }),
        height: 25,
        flex: 1,
        margin: '0 0 0 5',
        displayField: 'text',
        valueField: 'id',
        filterPickList: true,
        queryMode: 'local',
        value: addSet.set2.val,
        disabled: true,
        listeners: {'change': function(tF,nV,oV){ tab.addSet.set2.val=nV; }}
    });
    var addSet0=Ext.create({ xtype: 'fieldcontainer',
        layout: 'hbox',
        items: [{
            xtype: 'radio', boxLabel: vcbl[lang]["byDefaultText"], name: "step5", idSet: "set0",width: 175,
            checked: !addSet.enable,
            listeners: {'change': function(rb,nV,oV){ tab.addSet.enable=!nV; }}
        }],
        resetSet: function(){ this.getComponent(0).setValue(!emptyAddSet.enable); }
    });
    var addSet1=Ext.create({ xtype: 'fieldcontainer',
        layout: 'hbox',
        items: [{
            xtype: 'radio', boxLabel: vcbl[lang]["groupedInOtherText"], name: "step5", idSet: "set1", width: 175,
            checked: addSet.set1.enable,
            listeners: {'change': function(rb,nV,oV){ tab.addSet[rb.idSet].enable=nV; addSet1.enableChange(nV); } }
        },{
            xtype: 'combobox',
            store: Ext.create('Ext.data.Store', {
                fields: ['id','text'],
                data: [{"id": 1, "text":vcbl[lang]["allButFirstText"]},{"id": 2, "text":">"},{"id": 3, "text":"<"}]
            }),
            editable: false,
            margin: '0 0 0 5',
            queryMode: 'local',
            displayField: 'text',
            valueField: 'id',
            value: addSet.set1.cond,
            listeners: {'change': function(combo,nV,oV){
                tab.addSet.set1.cond=nV;
                if(nV===1) label1.setText(vcbl[lang]["partsText"]); else label1.setText("%");
            }}
        },{
            xtype: 'textfield',
            margin: '0 0 0 5',
            allowBlank: false,
            width: 30,
            value: addSet.set1.val,
            listeners: {'change': function(textfield,nV,oV){tab.addSet.set1.val=nV.replace(",",".")*1;}}
        },label1],
        resetSet: function(){
            this.getComponent(0).setValue(emptyAddSet.set1.enable);
            this.getComponent(1).setValue(emptyAddSet.set1.cond);
            this.getComponent(2).setValue(emptyAddSet.set1.val);
            label1.setText(vcbl[lang]["partsText"]);
        },
        enableChange: function(flag){
            if(flag) { this.getComponent(1).enable(); this.getComponent(2).enable(); label1.enable(); }
            else { this.getComponent(1).disable(); this.getComponent(2).disable(); label1.disable(); }
        },
        listeners: {'afterrender': function(fc){fc.enableChange(addSet.set1.enable);}}
    });
    var addSet2=Ext.create({ xtype: 'fieldcontainer',
        layout: 'hbox',
        items: [{
            xtype: 'radio', boxLabel: vcbl[lang]["pickOutText"], name: "step5", idSet: "set2",width: 175,
            checked: addSet.set2.enable,
            listeners: {'change': function(rb,nV,oV){ tab.addSet[rb.idSet].enable=nV; addSet2.enableChange(nV); }}
        },tagField],
        resetSet: function(){ this.getComponent(0).setValue(emptyAddSet.set2.enable); tagField.setValue(emptyAddSet.set2.val); },
        enableChange: function(flag){ if(flag) tagField.enable(); else tagField.disable(); },
        listeners: {'afterrender': function(fc){fc.enableChange(addSet.set2.enable);}}
    });
    var addSet3=Ext.create({ xtype: 'fieldcontainer',
        layout: 'hbox',
        items: [{xtype: 'checkbox', boxLabel: vcbl[lang]["showLabelsTitle"], checked: addSet.showLabels,
                handler: function(cb,val){ panel.isEdit=true; tab.addSet.showLabels=val; }
        }],
        resetSet: function(){ this.getComponent(0).setValue(emptyAddSet.showLabels); }
    });
    var addSet4=Ext.create({ xtype: 'fieldcontainer',
        layout: 'hbox',
        items: [{ xtype: 'checkbox', width: 240, boxLabel: vcbl[lang]["showLegendTitle"], checked: addSet.showLegend,
            handler: function(cb,val){ panel.isEdit=true; tab.addSet.showLegend=val; }
        },Ext.create('Ext.form.ComboBox', {
            editable: false,
            width: 80,
            store: Ext.create('Ext.data.Store', {
                fields: ['id','name'],
                data: [ {id: "l", name: vcbl[lang]["leftTitle"]}, {id: "r", name: vcbl[lang]["rightTitle"]}, {id: "t", name: vcbl[lang]["topTitle"]}, {id: "b", name: vcbl[lang]["bottomTitle"]} ]
            }),
            queryMode: 'local',
            displayField: 'name',
            valueField: 'id',
            value: addSet.locationLegend,
            listeners: { 'change': function(combo,nV,oV){ panel.isEdit=true; tab.addSet.locationLegend=nV; } }
        })],
        resetSet: function(){ this.getComponent(0).setValue(emptyAddSet.showLegend); this.getComponent(1).setValue(emptyAddSet.locationLegend); }
    });
    var addSet5=Ext.create({ xtype: 'fieldcontainer',
        layout: 'hbox',
        items: [Ext.create('Ext.form.ComboBox', {
            fieldLabel: vcbl[lang]["fontSizeTitle"],
            labelWidth: 235,
            editable: false,
            width: 320,
            store: Ext.create('Ext.data.Store', {
                fields: ['id','text'],
                data: function(){var a=[];for(var i=8;i<=20;i++){a.push({id:i,text:i+"px"})}return a;}()
            }),
            queryMode: 'local',
            displayField: 'text',
            valueField: 'id',
            value: addSet.fontSize,
            listeners: { 'change': function(combo,nV,oV){ panel.isEdit=true; tab.addSet.fontSize=nV; } }
        })],
        resetSet: function(){ this.getComponent(0).setValue(emptyAddSet.fontSize); }
    });
    var addSet6=Ext.create({ xtype: 'fieldcontainer',
        layout: 'hbox',
        items: [Ext.create('Ext.form.ComboBox', {
            fieldLabel: vcbl[lang]["maxSankeyItemsCount"],
            labelWidth: 235,
            editable: false,
            width: 320,
            store: Ext.create('Ext.data.Store', {
                fields: ['id','text'],
                data: function(){var a=[];for(var i=2;i<=20;i++){a.push({id:i,text:i})}return a;}()
            }),
            queryMode: 'local',
            displayField: 'text',
            valueField: 'id',
            value: addSet.maxItemsCount,
            listeners: { 'change': function(combo,nV,oV){ panel.isEdit=true; tab.addSet.maxItemsCount=nV; } }
        })],
        resetSet: function(){ this.getComponent(0).setValue(emptyAddSet.maxItemsCount); }
    });
    var addSet7=Ext.create({ xtype: 'fieldcontainer',
        layout: 'hbox',
        items: [Ext.create('Ext.form.ComboBox', {
            fieldLabel: vcbl[lang]["sankeyPaddingBetweenElements"],
            labelWidth: 235,
            editable: false,
            width: 320,
            store: Ext.create('Ext.data.Store', {
                fields: ['id','text'],
                data: function(){var a=[];for(var i=1;i<=20;i++){a.push({id:i,text:i+"px"})}return a;}()
            }),
            queryMode: 'local',
            displayField: 'text',
            valueField: 'id',
            value: addSet.indent,
            listeners: { 'change': function(combo,nV,oV){ panel.isEdit=true; tab.addSet.indent=nV; } }
        })],
        resetSet: function(){ this.getComponent(0).setValue(emptyAddSet.indent); }
    });
    var addSet8=Ext.create({ xtype: 'fieldcontainer',
        layout: 'hbox',
        items: [Ext.create('Ext.form.ComboBox', {
            fieldLabel: vcbl[lang]["sankeyColoring"],
            labelWidth: 235,
            editable: false,
            width: 320,
            store: Ext.create('Ext.data.Store', {
                fields: ['id','text'],
                data: [{id: 'left',text: vcbl[lang]["sankeyColoringOnLeft"]},{id: 'right',text: vcbl[lang]["sankeyColoringOnRight"]}]
            }),
            queryMode: 'local',
            displayField: 'text',
            valueField: 'id',
            value: addSet.coloring,
            listeners: { 'change': function(combo,nV,oV){ panel.isEdit=true; tab.addSet.coloring=nV; } }
        })],
        resetSet: function(){ this.getComponent(0).setValue(emptyAddSet.coloring); }
    });
    var addSet9=Ext.create({ xtype: 'fieldcontainer',
        layout: 'hbox',
        items: [Ext.create('Ext.form.ComboBox', {
            fieldLabel: vcbl[lang]["sankeyUnit"],
            labelWidth: 235,
            editable: false,
            width: 320,
            store: Ext.create('Ext.data.Store', {
                fields: ['id','text'],
                data: [{id: '1',text: 'x10'},{id: '2',text: 'x100'},{id: '3',text: 'x1000'},{id: '4',text: 'x1000000'}]
            }),
            queryMode: 'local',
            displayField: 'text',
            valueField: 'id',
            value: addSet.unit,
            listeners: { 'change': function(combo,nV,oV){ panel.isEdit=true; tab.addSet.unit=nV; } }
        })],
        resetSet: function(){ this.getComponent(0).setValue(emptyAddSet.unit); }
    });
    var addSet10=Ext.create({ xtype: 'fieldcontainer',
        layout: 'hbox',
        items: [{xtype: 'checkbox', boxLabel: vcbl[lang]["showLineColor"], checked: addSet.showLabels,
                handler: function(cb,val){ panel.isEdit=true; tab.addSet.showLabels=val; }
        }],
        resetSet: function(){ this.getComponent(0).setValue(emptyAddSet.showLabels); }
    });
    var tab=Ext.create({
        xtype: 'panel',
        title: vcbl[lang]['step5TitleText'],
        numberStep: 5,
        tagField: tagField,
        addSet: addSet,
        layout: {type: 'vbox', pack: 'start', align: 'stretch'},
        bodyPadding: '10 10 8 10',
        items: [addSet0,addSet1,addSet2,addSet3,addSet4,addSet5,addSet6,addSet7,addSet8,addSet9,addSet10],
        resetStep: function(){
            for(var i=0;i<this.items.length;i++) this.getComponent(i).resetSet();
            addSet1.enableChange(emptyAddSet.set1.enable);
            addSet2.enableChange(emptyAddSet.set2.enable);
            this.chViewForTypeChart();
        },
        chViewForTypeChart: function(){
            switch(panel.settings.chartSettings.typeChart){
                case 'bar':
                    addSet0.hide(); addSet1.hide(); addSet2.hide(); addSet3.hide(); addSet4.show(); addSet5.show();
                    addSet6.hide(); addSet7.hide(); addSet8.hide(); addSet9.hide();addSet10.hide();
                    break;
                case 'sankey':
                    addSet0.hide(); addSet1.hide(); addSet2.hide(); addSet3.hide(); addSet4.hide(); addSet5.show();
                    addSet6.show(); addSet7.show(); addSet8.hide(); addSet9.show();addSet10.show();
                    break;
                case 'line':
                    addSet0.hide(); addSet1.hide(); addSet2.hide(); addSet3.hide(); addSet4.show(); addSet5.show();
                    addSet6.hide(); addSet7.hide(); addSet8.hide(); addSet9.hide();addSet10.hide();
                    break;
                case 'pie':
                    addSet0.show(); addSet1.show(); addSet2.show(); addSet3.show(); addSet4.show(); addSet5.show();
                    addSet6.hide(); addSet7.hide(); addSet8.hide(); addSet9.hide();addSet10.hide();
                    break;
                case 'barhor':
                    addSet0.hide(); addSet1.hide(); addSet2.hide(); addSet3.hide(); addSet4.show(); addSet5.show();
                    addSet6.hide(); addSet7.hide(); addSet8.hide(); addSet9.hide();addSet10.hide();
                    break;
                case 'treemap':
                    addSet0.hide(); addSet1.hide(); addSet2.hide(); addSet3.hide(); addSet4.hide(); addSet5.show();
                    addSet6.hide(); addSet7.hide(); addSet8.hide(); addSet9.hide();addSet10.hide();
                    break;
                case 'xrange':
                    addSet0.hide(); addSet1.hide(); addSet2.hide(); addSet3.hide(); addSet4.hide(); addSet5.show();
                    addSet6.hide(); addSet7.hide(); addSet8.hide(); addSet9.hide();addSet10.hide();
                    break;
                default:
                    addSet0.hide(); addSet1.hide(); addSet2.hide(); addSet3.hide(); addSet4.hide(); addSet5.hide();
                    addSet6.hide(); addSet7.hide(); addSet8.hide(); addSet9.hide();addSet10.hide();
                    break;
            }
        },
        updateStep: function(){
            if(this.addSet.set1.enable){
                addSet1.getComponent(0).setValue(this.addSet.set1.enable);
                addSet1.getComponent(1).setValue(this.addSet.set1.cond);
                addSet1.getComponent(2).setValue(this.addSet.set1.val);
            }
        }
    });
    tab.chViewForTypeChart();
    return tab;
}

function dataItemSel(set,type){
    var tempSet=JSON.parse(JSON.stringify(set));
    var ansAr=[];
    tempSet.forEach(function(el) {
        if(type==='digit' && (
            /*el.typeFilter==='ID' || el.typeFilter==='ID Dictionary' || el.typeFilter==='Month' ||
            el.typeFilter==='Number' || el.typeFilter==='Price data' || el.typeFilter==='Quarter' || el.typeFilter==='Year' ||*/
            el.typeFilter==='Price data' || el.typeFilter==='Volume data')
        ){
            ansAr.push({fieldID:el.fieldID,dataIndex:el.dataIndex,text:el.text});
        } else if(type==='str' && (el.typeFilter==='Name Dictionary' || el.typeFilter==='Text')){
            ansAr.push({fieldID:el.fieldID,dataIndex:el.dataIndex,text:el.text});
        } else if(type==='date' && (el.typeFilter==='Date' || el.typeFilter==='MonthYear')){
            ansAr.push({fieldID:el.fieldID,dataIndex:el.dataIndex,text:el.text});
        } else if(type==='all'){
            ansAr.push({fieldID:el.fieldID,dataIndex:el.dataIndex,text:el.text});
        }
    });
    return ansAr;
}

function loadChartData(panel,sendHitFlag){
    if(!!sendHitFlag) sendHit(arDS[findIndexByKeyValue(arDS,"dataIndex",panel.settings.dsID)].desc);
    panel.settings.chartSettings=rebuildChartSet(panel);
    if(panel.settings.chartSettings.typeChart==="sankey"){
        Ext.Ajax.request({
            method: 'POST',
            url: '/kortes/service/getSunkeyData/',
            params: {lang: lang, userID: userID,
                sourceID: panel.settings.chartSettings.axisX.fieldID[0],
                destinationID: panel.settings.chartSettings.axisY.fieldID[0],
                volumeID: 1150,
                year: 2014,//panel.settings.chartSettings.series.fieldID
                setting: JSON.stringify(panel.settings)
            },
            success: function(response){
                panel.settings.xtype="chart";
                loadChart(panel,response.responseText);
            },
            failure: function(){Ext.create('eikonDialog').alert(vcbl[lang]["statusTitle"],vcbl[lang]["errorLoadChartData"]);}
        });
    } else if(panel.settings.chartSettings.typeChart==="treemap"){
        Ext.Ajax.request({
            method: 'POST',
            url: '/kortes/service/getTreeMapData/',
            params: {lang: lang, userID: userID, setting: JSON.stringify(panel.settings)},
            success: function(response){
                panel.settings.xtype="chart";
                loadChart(panel,response.responseText.replace(/\" \"/g,"\""+vcbl[lang]["otherText"]+"\""));
            },
            failure: function(){Ext.create('eikonDialog').alert(vcbl[lang]["statusTitle"],vcbl[lang]["errorLoadChartData"]);}
        });
    } else if(panel.settings.chartSettings.typeChart==="xrange"){
        var set=JSON.parse(JSON.stringify(panel.settings));
        var flagDate=true;
        set.settings.forEach(function(el){
            var flag=false;
            set.chartSettings.axisX.fieldID.forEach(function(el2){
                if(el.fieldID===el2){ flag=true; }
            });
            set.chartSettings.axisY.fieldID.forEach(function(el2){
                if(el.fieldID===el2){ flag=true; }
            });
            if(el.typeFilter==="date" || el.typeFilter==="Date"){ el.show=true; }
            else { el.show=flag; }
        });
        Ext.Ajax.request({
            method: 'POST',
            url: '/kortes/service/mainsourceFull/',
            params: {lang: lang, itemID: panel.itemID, start: 0, limit: 100, page: 0, userID: userID, setting: JSON.stringify(set)},
            success: function(response){
                panel.settings.xtype="chart";
                loadChart(panel,JSON.parse(response.responseText));
            },
            failure: function(){Ext.create('eikonDialog').alert(vcbl[lang]["statusTitle"],vcbl[lang]["errorLoadChartData"]);}
        });
    } else {
        Ext.Ajax.request({
            method: 'POST',
            url: '/kortes/service/getChartData/',
            params: {lang: lang, userID: userID, setting: JSON.stringify(panel.settings)},
            success: function(response){
                panel.settings.xtype="chart";
                loadChart(panel,response.responseText);
            },
            failure: function(){Ext.create('eikonDialog').alert(vcbl[lang]["statusTitle"],vcbl[lang]["errorLoadChartData"]);}
        });
    }
}
function loadChart(panel,data){
    panel.unregInnerComp();
    panel.removeAll();
    var chartSet=panel.settings.chartSettings;
    var idChart="chart_"+panel.getItemId();
    var copySet=JSON.parse(JSON.stringify(panel.settings));
    var chartPanel=panel.add(Ext.create('Ext.panel.Panel', {
        border: false,
        isChart: true,
        html: '<div id="'+idChart+'">',
        idChart: idChart,
        typeChart: chartSet.typeChart,
        listeners: { 'resize': function(panel,w,h){
            if(panel.typeChart!=='sankey' && $('#'+idChart).highcharts()!==undefined && $('#'+idChart).highcharts().setSize!==undefined){
                if(panel.typeChart==='xrange'){ $("#"+idChart).css({ 'height': h, 'width': w }); w=w-7; }
                $('#'+idChart).highcharts().setSize(w,h);
            } else if(panel.typeChart==='sankey'){
                if(!!$('#'+panel.idChart+' > svg').attr('id')){
                    $('#'+panel.idChart).remove();
                    panel.update('<div id="'+panel.idChart+'">');
                    drawSankeyChart(panel.idChart,w,h,data,copySet);
                }
            } else if(panel.typeChart==='xrange'){
                if(!!$('#'+panel.idChart+' > svg').attr('id')){
                    $('#'+panel.idChart).remove();
                    panel.update('<div id="'+panel.idChart+'">');
                    drawXRangeChart(panel.idChart,w,h,data,copySet);
                }
            }
        } },
        loadChartSVG: function(panel,formatFile){ loadChartSVG(panel,data,formatFile); }
    }));
    centerPanel.charts.push(chartPanel.getItemId());
    var indexDsID=findIndexByKeyValue(arDS,'dataIndex',panel.settings.dsID);
    if(indexDsID!==null) panel.changeMPTitle(arDS[indexDsID].text);
    else panel.changeMPTitle(labelHeader.text);
    panel.changeMPDownloadBut();
    var w=chartPanel.getWidth();
    var h=chartPanel.getHeight();
    centerPanel.updateMainBut();
    saveInJET('load chart');
    drawChart(chartSet,idChart,w,h,data,copySet);
}
function drawChart(chartSet,idChart,w,h,data,copySet){
    if(!!chartSet.series.data && chartSet.series.data.length===0){
        Ext.Ajax.request({
            method: 'GET',
            url: "/kortes/service/getSubFilter/",
            params: {lang: lang,userID: userID,fieldID: !!chartSet.series?chartSet.series.fieldID[0]:"",filters: "[]"},
            success: function(response){
                switch(chartSet.typeChart){
                    case 'line':        drawLineChart(idChart,w,h,data,copySet,JSON.parse(response.responseText));    break;
                    case 'bar':         drawBarChart(idChart,w,h,data,copySet,JSON.parse(response.responseText));     break;
                    case 'barhor':      drawBarHorChart(idChart,w,h,data,copySet,JSON.parse(response.responseText));     break;
                    case 'sankey':      drawSankeyChart(idChart,w,h,data,copySet,JSON.parse(response.responseText));  break;
                    case 'pie':         drawPieChart(idChart,w,h,data,copySet,JSON.parse(response.responseText));     break;
                    case 'bubble':      drawBubbleChart(idChart,w,h,data,copySet,JSON.parse(response.responseText));  break;
                    case 'treemap':     drawTreemapChart(idChart,w,h,data,copySet,JSON.parse(response.responseText));  break;
                    case 'xrange':      drawXRangeChart(idChart,w,h,data,copySet,JSON.parse(response.responseText));  break;
                    default:            Ext.create('eikonDialog').alert(vcbl[lang]["statusTitle"],vcbl[lang]["errorSelectTypeChart"]);
                }
            },
            failure: function(){Ext.create('eikonDialog').alert(vcbl[lang]["statusTitle"],vcbl[lang]["errorLoadChartData"]);}
        });
    } else {
        switch(chartSet.typeChart){
            case 'line':        drawLineChart(idChart,w,h,data,copySet,[]);    break;
            case 'bar':         drawBarChart(idChart,w,h,data,copySet,[]);     break;
            case 'barhor':      drawBarHorChart(idChart,w,h,data,copySet,[]);     break;
            case 'sankey':      drawSankeyChart(idChart,w,h,data,copySet,[]);  break;
            case 'pie':         drawPieChart(idChart,w,h,data,copySet,[]);     break;
            case 'bubble':      drawBubbleChart(idChart,w,h,data,copySet,[]);  break;
            case 'treemap':     drawTreemapChart(idChart,w,h,data,copySet,[]);  break;
            case 'xrange':      drawXRangeChart(idChart,w,h,data,copySet,[]);  break;
            default:            Ext.create('eikonDialog').alert(vcbl[lang]["statusTitle"],vcbl[lang]["errorSelectTypeChart"]);
        }
    }
}

function rebuildChartSet(panel){
    var tempSet=JSON.parse(JSON.stringify(panel.settings.chartSettings));
    var chartSet={
        typeChart:JSON.parse(JSON.stringify(tempSet.typeChart)),
	axisX:JSON.parse(JSON.stringify(tempSet.axisX)),
	axisY:JSON.parse(JSON.stringify(tempSet.axisY)),
	series:JSON.parse(JSON.stringify(tempSet.series)),
	addSet:JSON.parse(JSON.stringify(tempSet.addSet))
    };
    return chartSet;
}

function saveColor(rec,e,fieldID){
    var position=e.getXY();
    e.stopEvent();
    Ext.create('Ext.menu.Menu',{
        items:[{
                text: vcbl[lang]["saveColorText"],
                handler: function(){
                    Ext.Ajax.request({
                        method: 'GET',
                        url: '/kortes/service/setColor/',
                        params: {userID: userID, fieldID: fieldID, key: rec.get('id'), color: rec.get('color')},
                        success: function(response){ },
                        failure: function(){ }
                    });
                }
            }],
        listeners: { 'mouseleave': function(menu){ menu.hide(); } }
    }).showAt(position);
}

function loadChartSVG(panel,data,formatFile){
    var w=panel.getWidth();
    var h=panel.getHeight();
    var copySet=JSON.parse(JSON.stringify(panel.settings));
    var originalChart=$('#chart_'+panel.getItemId()).highcharts();
    var typeOrChart=panel.settings.chartSettings.typeChart;
    var win=Ext.create('eikonWin',{
        header: false,
        width: w,
        height: h,
        html: '<div id="chart_for_download">'
    });
    win.show();
    win.hide();
    Highcharts.setOptions({
        chart:{ animation: false, backgroundColor:"rgba(255,255,255,0)" },
        legend:{ itemStyle:{color:"#000"} },
        xAxis:{ gridLineColor: '#000',alternateGridColor:"rgba(255,255,255,0)",labels:{style:{color:"#000"}},title:{style:{color:"#000"}} },
        yAxis:{ lineColor: "#000",lineWidth:1,gridLineColor: '#000',labels:{style:{color:"#000"}},title:{style:{color:"#000"}} },
        plotOptions:{ pie:{dataLabels:{enabled:panel.settings.chartSettings.addSet.showLabels,color:"#000",connectorColor: "#000"}} }
    });
    switch(typeOrChart){
        case 'line':        drawLineChart("chart_for_download",w,h,data,copySet);    break;
        case 'bar':         drawBarChart("chart_for_download",w,h,data,copySet);     break;
        case 'barhor':      drawBarHorChart("chart_for_download",w,h,data,copySet);     break;
        case 'sankey':      drawSankeyChart("chart_for_download",w,h,data,copySet);  break;
        case 'pie':         drawPieChart("chart_for_download",w,h,data,copySet);     break;
        case 'bubble':      drawBubbleChart("chart_for_download",w,h,data,copySet);  break;
        case 'treemap':     drawTreemapChart("chart_for_download",w,h,data,copySet);  break;
        case 'xrange':      drawXRangeChart("chart_for_download",w,h,data,copySet);  break;
        default:            Ext.create('eikonDialog').alert(vcbl[lang]["statusTitle"],vcbl[lang]["errorSelectTypeChart"]); return;
    }
    Highcharts.setOptions({
        chart:{ animation: true, backgroundColor:"#242424" },
        legend:{ itemStyle:{color:"#CCC"} },
        xAxis: { gridLineColor:"#2d2d2d",alternateGridColor:"#1f1f1f",labels:{style:{color:"#999999"}},title:{style:{color:"#AAA"}} },
        yAxis: { lineWidth:0,gridLineColor:"#2d2d2d",labels:{style:{color:"#ccc"}},title:{style:{color:"#ccc"}} },
        plotOptions:{pie:{dataLabels:{enabled:!0,color:"#fff",connectorColor: "#fff"}}}
    });
    var chartForDownload=$('#chart_for_download').highcharts();
    if(!!!chartForDownload){ chartForDownload=$('#chart_for_download').sankey(); }
    if(!!chartForDownload){
        if(typeOrChart==="sankey"){
            switchSavedFormat(chartForDownload.getSVG(),formatFile,w,h,win,typeOrChart);
        } else {
            var fileBody;
            if(typeOrChart==="treemap"){
                if(!!originalChart.series[0].rootNode){ chartForDownload.series[0].drillToNode(originalChart.series[0].rootNode); }
                var task=new Ext.util.DelayedTask();
                task.delay(1200,function(){
                    win.show();
                    win.hide();
                    fileBody=$("#chart_for_download > div.highcharts-container > svg")[0].outerHTML;
                    switchSavedFormat(fileBody,formatFile,w,h,win,typeOrChart);
                });
                return;
            } else if(typeOrChart==="line" || typeOrChart==="bar" || typeOrChart==="barhor"){
                var extremes=originalChart.xAxis[0].getExtremes();
                if(extremes.min>extremes.dataMin || extremes.max<extremes.dataMax){
                    chartForDownload.xAxis[0].setExtremes(extremes.min,extremes.max);
                    fileBody=chartForDownload.getSVG();
                }
            } else if(typeOrChart==="pie"){
                var selectedPoints=originalChart.getSelectedPoints();
                if(selectedPoints.length>0){
                    chartForDownload.get(selectedPoints[0].id).select(true);
                    fileBody=chartForDownload.getSVG();
                }
            }
            if(!!!fileBody){ fileBody=chartForDownload.getSVG(); }
            switchSavedFormat(fileBody,formatFile,w,h,win,typeOrChart);
        }
    }
}
function switchSavedFormat(fileBody,formatFile,w,h,win,typeOrChart){
    if(formatFile==="base64ToPNG"){ preparePNG(fileBody,formatFile,w,h,win,typeOrChart); }
    else sendForLoadFile(fileBody,formatFile,win);
}
function preparePNG(fileBody,formatFile,w,h,win,typeOrChart){
    fileBody=(fileBody+"").replace(/&nbsp;/g," ");
    var divSVG=document.getElementById("divSVG");
    var canvas=document.createElement("canvas");
    var img=document.createElement("img");
    divSVG.appendChild(canvas);
    divSVG.appendChild(img);

    var context=canvas.getContext("2d");
    canvas.setAttribute('width',w);
    canvas.setAttribute('height',h);

    var DOMURL=window.URL||window.webkitURL||window;
    var svg=new Blob([fileBody],{type: 'image/svg+xml;charset=utf-8'});
    var url=DOMURL.createObjectURL(svg);
    img.src=url;
    var task=new Ext.util.DelayedTask();
    task.delay(1200,function(){
        if(typeOrChart==="xrange"){ canvas.setAttribute('height',img.height); }//img.naturalHeight
        context.drawImage(img, 0, 0);
        DOMURL.revokeObjectURL(url);
        fileBody=canvas.toDataURL("image/png").replace("data:image/png;base64,","");
        sendForLoadFile(fileBody,formatFile,win);
        divSVG.removeChild(canvas);
        divSVG.removeChild(img);
    });
}
function sendForLoadFile(fileBody,formatFile,win){
    if(fileBody!==""){
        fileBody=encodeURI(fileBody);
        var inputs='<input type="hidden" name="userID" value="'+userID+'" />';
        inputs+='<input type="hidden" name="lang" value="'+lang+'" />';
        inputs+='<input type="hidden" name="formatFile" value="'+formatFile+'" />';
        inputs+='<input type="hidden" name="fileBody" value="'+fileBody+'" />';
        jQuery('<form action="/kortes/service/getFile/" method="post">'+inputs+'</form>').appendTo('body').submit().remove();
        win.close();
    }
}

function legengSet(addSet,flag){
    var legendOpt={};
    switch(addSet.locationLegend){
        case 'l': legendOpt={layout: 'vertical',align: 'left',verticalAlign: 'middle'}; break;
        case 'r': legendOpt={layout: 'vertical',align: 'right',verticalAlign: 'middle'}; break;
        case 't': legendOpt={layout: 'horizontal',align: 'center',verticalAlign: 'top'}; break;
        case 'b': legendOpt={layout: 'horizontal',align: 'center',verticalAlign: 'bottom'}; break;
        default: break;
    }
    if(flag) { legendOpt.enabled=addSet.showLegend; legendOpt.itemStyle={fontSize: addSet.fontSize}; }
    return legendOpt;
}
/*структура panel.settings
 * xtype - тип отображаемой таблицы (grid/pivot/chart)
 * dsID - номер источника данных
 * settings - настройки таблицы (массив объектов с нижеследующей структурой)
 *      fieldID - номер поля
 *      dataIndex - индекс для связывания значения с колонкой
 *      text - название поля
 *      desc - описание поля
 *      width - ширина поля
 *      typeFilter - тип фильтра для поля
 *      showDefault - отображать по умолчанию (true/false)
 *      columns - вложенные поля (только для pivot-таблиц, иначе null)
 *      menuDisabled - включение или отключение меню для поля (true/false)
 *      viewMode - отображение (по вертикали/по горизонтали/факт)
 *      show - отображать поле или нет (true/false)
 *      dinamicFilter - идентификатор динамического фильтра
 *      staticFilter - значение статического фильтра
 *      aggregation - агрегация для поля (none/max/min/sum/avg)
 * filters - описание динамических фильтров
 * aggregate - агрегирование всей таблицы (true/false)
 * sorters - описание сортировок для таблицы
 * chartSettings - настройка графика
 *      typeChart - тип графика (bar/sankey/line/pie)
 *      axisX - настройки оси X
 *          fieldID - номер поля для построения (массив значений)
 *          addSet - дополнительные настройки (в будущем будут дополняться)
 *              name - название оси
 *      axisY - настройки оси Y
 *          fieldID - номер поля для построения (массив значений)
 *          addSet - дополнительные настройки (в будущем будут дополняться)
 *              name - название оси
 *      series - настройки серии(-й)
 *          allFields - выбор всех полей независимо от их количества (true/false)
 *          fieldID - номер поля для сериии (на данный момент передаётся массив, но берется только первый элемент его!)
 *          data - данные для запроса значений  (массив объектов с нижеследующей структурой)
 *              id - номер выбранного значения из массива значений для series.fieldID
 *              color - номер цвета в формате "ff9933"
 *              name - наименование
 *      addSet - дополнительный настройки графика
 *          enable - статус включения доп настроек (true/false)
 *          showLabels - отображение подписей в графике (true/false)
 *          showLegend - отображение легенды графика (true/false)
 *          locationLegend - позиция легенды (l/r/t/b - лево/право/верх/низ)
 *          fontSize - размер шрифта (8-20)
 *          maxItemsCount - максимальное количество элементов в санкее (2-20)
 *          indent - отступ между элементами в санкее (1-20)
 *          coloring - раскраска в санкее
 *          unit - единица измерения в санкее
 *          set1 - доп настройка 1
 *              enable - статус включения доп настройки 1 (true/false)
 *              cond - условие (1-3)
 *              val - значение для условия
 *          set2 - доп настройка 1
 *              enable - статус включения доп настройки 2 (true/false)
 *              cond - условие (1-3)
 *              val - значение для условия
 */
