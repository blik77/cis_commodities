var staticScale=20;
var deltaLine=4;
Date.prototype.dmy=function(sep){ if(!sep){sep="-";} return ("0"+this.getDate()).slice(-2)+sep+("0"+(this.getMonth()+1)).slice(-2)+sep+this.getFullYear(); };

function createParentAndChild(data,set){
    var arParent={},arChild={};
    var ansDataIndex=findDataIndex(data,set),d1=0,d2=0;
    var t=ansDataIndex.arDataByIndex,
        dataIndexDate=ansDataIndex.dataIndexDate,
        dataIndexVal=ansDataIndex.dataIndexVal,
        dataIndexValText=ansDataIndex.dataIndexValText,
        maxValue=ansDataIndex.maxValue;

    data.forEach(function(el){
        var indEl=[];
        //создание родительских элеметнов
        for(var i=0;i<t.length;i++){
            indEl.push("el"+i+"-"+t[i].arData.indexOf(el[t[i].dataIndex]));
            
            if(!arParent[indEl.join("_")] && i<t.length-1){
                arParent[indEl.join("_")]={
                    parent: indEl.slice(0,i).join("_"),
                    name: el[t[i].dataIndex],
                    //collapsed: true,
                    id: indEl.join("_"),
                    start: 0,
                    end: 0,
                    end2: 0
                };
            }
        }
        //id дочернего элемента
        indEl=indEl.join("_");
        //определение границ дат для графика
        var date_UTC=el[dataIndexDate].split("-");
        date_UTC=Date.UTC(date_UTC[2],date_UTC[1]-1,date_UTC[0]);
        if(date_UTC<d1 || d1===0){ d1=date_UTC; }
        if(date_UTC>d2 || d2===0){ d2=date_UTC; }
        //определение ширины линии
        var pointWidth=Math.round(el[dataIndexVal]/maxValue*(staticScale-deltaLine));
        //создание дочерних элементов
        if(!arChild[indEl]){
            var indParent=[];
            if(t.length>1){
                for(var i=0;i<t.length-1;i++){
                    indParent.push("el"+i+"-"+t[i].arData.indexOf(el[t[i].dataIndex]));
                }
                indParent=indParent.join("_");
            }
            arChild[indEl]={
                parent: t.length>1?indParent:"",
                name: el[t[t.length-1].dataIndex],
                start: date_UTC,
                start_str: el[dataIndexDate],
                end: date_UTC,
                end_str: el[dataIndexDate],
                capacity: el[dataIndexVal],
                offline_capacity: 0,
                capacityText: dataIndexValText,
                pointWidth: pointWidth>2?pointWidth:2,
                color: '#f57a14',
                dateAr: [date_UTC],
                capacityAr: [el[dataIndexVal]]
            };
        } else {
            arChild[indEl].dateAr.push(date_UTC);
            arChild[indEl].capacityAr.push(el[dataIndexVal]);
        }
    });
    //суммируем значения если дни одинаковые
    $.each(arChild,function(index,value){
        var tempCapacityAr=[],tempDateAr=[],tempCapacity=0;
        for(var i=0;i<value.dateAr.length-1;i++){
            tempCapacity=tempCapacity+value.capacityAr[i];
            if(value.dateAr[i]!==value.dateAr[i+1]){
                tempCapacityAr.push(tempCapacity);
                tempDateAr.push(value.dateAr[i]);
                tempCapacity=0;
            }
        }
        value.capacityAr=tempCapacityAr;
        value.dateAr=tempDateAr;
        //сортируем массивы от меньшей даты к большей
        var sortDateAr=JSON.parse(JSON.stringify(tempDateAr));
        sortDateAr.sort(function(a,b){ return a-b; });
        //переформатирование основных массивов с данными и датами согласно сортировке
        tempCapacityAr=[];tempDateAr=[];
        for(var i=0;i<sortDateAr.length;i++){
            var j=value.dateAr.indexOf(sortDateAr[i]);
            tempCapacityAr.push(value.capacityAr[j]);
            tempDateAr.push(value.dateAr[j]);
        }
        value.capacityAr=tempCapacityAr;
        value.dateAr=tempDateAr;
    });
    arChild=separateChild(arChild,maxValue);
    arParent=agregateParent(arParent,arChild,dataIndexValText,d1,d2);
    return [arParent,arChild,d1,d2];
}
function separateChild(arChild,maxValue){
    var ans=[];
    $.each(arChild,function(index,value){
        var tempAr=[],tDateAr=[],tCapacityAr=[];
        for(var i=0;i<value.dateAr.length-1;i++){
            if(i===0){
                value.start=value.dateAr[i];
                value.start_str=new Date(value.dateAr[i]).dmy();
                value.pointWidth=Math.round(value.capacity/maxValue*(staticScale-deltaLine));
                tDateAr=[value.dateAr[i]];
                tCapacityAr=[value.capacityAr[i]];
            }
            if(value.dateAr[i+1]-value.dateAr[i]>24*60*60*1000 || value.capacityAr[i]!==value.capacityAr[i+1]){
                if(tempAr.length>0){
                    tempAr[tempAr.length-1].end=value.dateAr[i]+24*60*60*1000;
                    tempAr[tempAr.length-1].end_str=new Date(value.dateAr[i]).dmy();
                } else {
                    value.end=value.dateAr[i]+24*60*60*1000;
                    value.end_str=new Date(value.dateAr[i]).dmy();
                }
                var tempEl=JSON.parse(JSON.stringify(value));
                tempEl.start=value.dateAr[i+1];
                tempEl.start_str=new Date(value.dateAr[i+1]).dmy();
                tempEl.end=value.dateAr[i+1]+24*60*60*1000;
                tempEl.end_str=new Date(value.dateAr[i+1]).dmy();
                tempEl.capacity=value.capacityAr[i+1];
                tempEl.pointWidth=Math.round(tempEl.capacity/maxValue*(staticScale-deltaLine));
                tempEl.dateAr=[value.dateAr[i+1]];
                tempEl.capacityAr=[value.capacityAr[i+1]];
                tempAr.push(tempEl);
            } else {
                if(tempAr.length>0){
                    tempAr[tempAr.length-1].end=value.dateAr[i+1]+24*60*60*1000;
                    tempAr[tempAr.length-1].end_str=new Date(value.dateAr[i+1]).dmy();
                    tempAr[tempAr.length-1].dateAr.push(value.dateAr[i+1]);
                    tempAr[tempAr.length-1].capacityAr.push(value.capacityAr[i+1]);
                } else {
                    value.end=value.dateAr[i+1]+24*60*60*1000;
                    value.end_str=new Date(value.dateAr[i+1]).dmy();
                    tDateAr.push(value.dateAr[i+1]);
                    tCapacityAr.push(value.capacityAr[i+1]);
                }
            }
        }
        value.dateAr=tDateAr;
        value.capacityAr=tCapacityAr;
        ans.push(value);
        ans=ans.concat(tempAr);
    });
    ans.forEach(function(el,i,ar){
        ar[i].offline_capacity=(((el.end-el.start)/(1000*60*60*24)+1)*el.capacity).toFixed(2)*1;
    });
    return ans;
}
function agregateParent(arParent,arChild,dataIndexValText,d1,d2){
    var tempParents={},ans=[];
    $.each(arParent,function(index,value){
        tempParents[value.id]={ name: value.name, parent: value.parent, data: [], maxCapacity: 0, maxPointWidth: 2, dateAr: [], capacityAr: [] };
        arChild.forEach(function(el,i,ar){
            if(el.parent===value.id){
                tempParents[value.id].data.push({ capacityAr: el.capacityAr, dateAr: el.dateAr, pointWidth: el.pointWidth });
            }
        });
    });
    for(var i=d1;i<=d2;i+=24*60*60*1000){
        $.each(tempParents,function(index,value){
            var sumCapacity=0,sumPointWidth=0;
            value.data.forEach(function(el,ind,ar){
                if(el.dateAr.indexOf(i)!==-1){
                    sumCapacity=sumCapacity+el.capacityAr[el.dateAr.indexOf(i)];
                }
                sumPointWidth=sumPointWidth+el.pointWidth;
            });
            if(value.maxCapacity<sumCapacity){ value.maxCapacity=sumCapacity.toFixed(2)*1; }
            if(value.maxPointWidth<sumPointWidth){ value.maxPointWidth=sumPointWidth>(staticScale-deltaLine)?(staticScale-deltaLine):sumPointWidth; }
            if(sumCapacity>0){
                value.dateAr.push(i);
                value.capacityAr.push(sumCapacity.toFixed(2)*1);
            }
        });
    }
    tempParents=findParentsParent(tempParents,d1,d2);
    $.each(tempParents,function(index,value){
        var tempEl={
            parent: value.parent,
            name: value.name,
            start: d1,
            start_str: "",
            end: d1,
            end2: d1,
            end_str: "",
            capacity: 0,
            offline_capacity: 0,
            capacityText: dataIndexValText,
            pointWidth: 2,
            color: '#54FF56'//'#f57a14'
        };
        for(var i=0;i<value.dateAr.length-1;i++){
            if(i===0){
                tempEl.capacity=value.capacityAr[i];
                tempEl.pointWidth=Math.round(tempEl.capacity/value.maxCapacity*value.maxPointWidth);
                tempEl.start=value.dateAr[i];
                tempEl.start_str=new Date(tempEl.start).dmy();
                tempEl.end=tempEl.start;
                tempEl.end2=value.dateAr[i]+24*60*60*1000;
                tempEl.end_str=new Date(value.dateAr[i]).dmy();
            }
            if(value.dateAr[i+1]-value.dateAr[i]>24*60*60*1000 || value.capacityAr[i]!==value.capacityAr[i+1]){
                tempEl.capacity=value.capacityAr[i];
                tempEl.pointWidth=Math.round(tempEl.capacity/value.maxCapacity*value.maxPointWidth);
                //tempEl.end=value.dateAr[i]+24*60*60*1000;
                tempEl.end2=value.dateAr[i]+24*60*60*1000;
                tempEl.end_str=new Date(value.dateAr[i]).dmy();
                ans.push(tempEl);
                tempEl=JSON.parse(JSON.stringify(tempEl));
                tempEl.start=value.dateAr[i+1];
                tempEl.start_str=new Date(tempEl.start).dmy();
                tempEl.end=tempEl.start;
                tempEl.end2=value.dateAr[i+1]+24*60*60*1000;
                tempEl.end_str=new Date(value.dateAr[i+1]).dmy();
                tempEl.capacity=value.capacityAr[i+1];
                tempEl.pointWidth=Math.round(value.capacityAr[i+1]/value.maxCapacity*value.maxPointWidth);
            } else {
                //tempEl.end=value.dateAr[i+1]+24*60*60*1000;
                tempEl.end2=value.dateAr[i+1]+24*60*60*1000;
                tempEl.end_str=new Date(value.dateAr[i+1]).dmy();
            }
        }
        ans.push(tempEl);
    });
    $.each(arParent,function(index,value){ ans.push(value); });
    return ans;
}
function findParentsParent(tempParents,d1,d2){
    var flagMultiParent=false;
    var copyTempParents=JSON.parse(JSON.stringify(tempParents));
    $.each(tempParents,function(index,value){
        if(value.dateAr.length===0){
            var flagCurParent=false;
            $.each(copyTempParents,function(index2,value2){
                if(value2.parent===index && value2.dateAr.length===0){
                    flagMultiParent=true;
                } else if(value2.parent===index && value2.dateAr.length>0){
                    flagCurParent=true;
                }
            });
            if(flagCurParent){
                for(var i=d1;i<=d2;i+=24*60*60*1000){
                    var sumCapacity=0,sumPointWidth=0;
                    $.each(copyTempParents,function(index2,value2){
                        if(value2.parent===index){
                            if(value2.dateAr.indexOf(i)!==-1){
                                sumCapacity=sumCapacity+value2.capacityAr[value2.dateAr.indexOf(i)];
                                sumPointWidth=sumPointWidth+value2.maxPointWidth;
                            }
                        }
                    });
                    if(value.maxCapacity<sumCapacity){ value.maxCapacity=sumCapacity.toFixed(2)*1; }
                    if(value.maxPointWidth<sumPointWidth){ value.maxPointWidth=sumPointWidth>(staticScale-deltaLine)?(staticScale-deltaLine):sumPointWidth; }
                    if(sumCapacity>0){
                        value.dateAr.push(i);
                        value.capacityAr.push(sumCapacity.toFixed(2)*1);
                    }
                }
            }
        }
    });
    if(flagMultiParent){
        tempParents=findParentsParent(tempParents,d1,d2);
    }
    return tempParents;
}
function findDataIndex(data,set){
    var ans={
        dataIndexDate: "",
        dataIndexVal: "",
        dataIndexValText: "",
        maxValue: 0,
        arDataByIndex: []
    };
    //находим индексы полей с нужными нам данными
    for(var i=0;i<set.chartSettings.axisX.fieldID.length;i++){
        var dataIndex="";
        set.settings.forEach(function(el){
            if(set.chartSettings.axisX.fieldID[i]===el.fieldID){ dataIndex=el.dataIndex; }
            if(set.chartSettings.axisY.fieldID[0]===el.fieldID && ans.dataIndexVal===""){ ans.dataIndexVal=el.dataIndex; ans.dataIndexValText=el.text; }
            if(ans.dataIndexDate==="" && (el.typeFilter==="date" || el.typeFilter==="Date")){ ans.dataIndexDate=el.dataIndex; }
        });
        ans.arDataByIndex.push({ dataIndex:dataIndex, arData:[] });
    }
    //сохраняем все возможные значения которые могут быть в поле
    data.forEach(function(el){
        ans.arDataByIndex.forEach(function(el2){
            if(el2.arData.indexOf(el[el2.dataIndex])===-1){
                el2.arData.push(el[el2.dataIndex]);
            }
        });
        if(el[ans.dataIndexVal]>ans.maxValue){ ans.maxValue=el[ans.dataIndexVal]; }
    });
    return ans;
}
function getXRangeData(idChart,w,h,data,set,arColor){
    var ans=createParentAndChild(data,set);
    var arParent=ans[0],arChild=ans[1],d1=ans[2],d2=ans[3];

    arChild=arChild.concat(arParent);
    
    XRangeChart(arChild,idChart,w,h,d1,d2);
}
function XRangeChart(data,idChart,w,h,d1,d2){
    $("#"+idChart).css({ 'height': h, 'width': w });
    Highcharts.setOptions({ xAxis:{ gridLineWidth: 0, lineColor: "#2d2d2d", alternateGridColor: null } });
    Highcharts.ganttChart(idChart, {
        chart: { marginTop: 79, width: w-7 },
        my_data: data,
        title: { /*text: 'RUSSIA\'S OIL REFINERY MAINTENANCE'*/ },
        xAxis: {
            gridLineWidth:1,
            labels: { },
            grid: { enabled: false },
            min: d1,
            max: d2
        },
        yAxis: { lineColor: "#2d2d2d", tickColor:"#2d2d2d", showFirstLabel: true, staticScale: staticScale, uniqueNames: true },
        tooltip: {
            crosshairs:[ {width:0,color:"#2d2c2c"} ],
            shared: false,
            headerFormat: '',
            pointFormat: '<span style="color:{point.color};">\u25CF</span> <span style="font-size: 14px;text-decoration: underline;">{point.name}</span>'+
'<br/>'+vcbl[lang]['xrangeStartDate']+'{point.start_str}<br/>'+vcbl[lang]['xrangeFinishDate']+'{point.end_str}<br/>{point.capacityText}: {point.capacity}'
        },
        series: [{
            name: 'REFINERY MAINTENANCE',
            borderRadius: 0,
            borderWidth: 0,
            data: data
        }]
    });
    $("#"+idChart).css({ 'overflow': 'auto' });
    Highcharts.setOptions({ xAxis:{ gridLineWidth: 1, lineColor: "#1f1f1f", alternateGridColor: "#1f1f1f" } });
}