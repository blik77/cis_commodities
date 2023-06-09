function newChart(idChart,w,h,data,set,arColor){
    function CSVToArray(strData, strDelimiter){
        strDelimiter=(strDelimiter || ",");
        // Create a regular expression to parse the CSV values.
        var objPattern = new RegExp(
            (
                // Delimiters.
                "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
                // Quoted fields.
                "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
                // Standard fields.
                "([^\"\\" + strDelimiter + "\\r\\n]*))"
            ),
            "gi"
        );
        // Create an array to hold our data. Give the array
        // a default empty first row.
        var arrData=[[]];
        // Create an array to hold our individual pattern
        // matching groups.
        var arrMatches=null;
        // Keep looping over the regular expression matches
        // until we can no longer find a match.
        while(arrMatches=objPattern.exec(strData)){
            // Get the delimiter that was found.
            var strMatchedDelimiter=arrMatches[1];
            // Check to see if the given delimiter has a length
            // (is not the start of string) and if it matches
            // field delimiter. If id does not, then we know
            // that this delimiter is a row delimiter.
            if(strMatchedDelimiter.length && strMatchedDelimiter!==strDelimiter){
                // Since we have reached a new row of data,
                // add an empty row to our data array.
                arrData.push([]);
            }
            var strMatchedValue;
            // Now that we have our delimiter out of the way,
            // let's check to see which kind of value we
            // captured (quoted or unquoted).
            if(arrMatches[2]){
                // We found a quoted value. When we capture
                // this value, unescape any double quotes.
                strMatchedValue=arrMatches[2].replace(new RegExp( "\"\"", "g" ),"\"");
            } else {
                // We found a non-quoted value.
                strMatchedValue=arrMatches[3];
            }
            // Now that we have our value string, let's add
            // it to the data array.
            arrData[arrData.length-1].push(strMatchedValue);
        }
        // Return the parsed data.
        return(arrData);
    }
    //reads file content out
    function FileHelper(){}
    FileHelper.readStringFromFileAtPath=function(pathOfFileToReadFrom){
        var request=new XMLHttpRequest();
        request.open("GET", pathOfFileToReadFrom, false);
        request.send(null);
        var returnValue=request.responseText;

        return returnValue;
    };
    function avg(arr){
        var arrLen=arr.length;
        var result=0;
        for(var i=0;i<arrLen;i++){
          result += arr[i];
        }
        var division=result/arrLen;
        return division;
    }
    function getnum(){}
    getnum.getwidth=function(itog){
        var maintmass=[];
        for(i=0;i<itog.length-stringstart-1;i++){
            if(itog[i+stringstart][zagruzka][0]>="0"&&itog[i+stringstart][zagruzka][0]<="9"){
                maintmass.push(parseFloat(itog[i+stringstart][zagruzka]));
            }
        }
        var midmaint=avg(maintmass);
        var losses=[];
        for(i=0;i<itog.length-stringstart-1;i++){
            var dayst=0;
            if(itog[i+stringstart][startzavod][0]>="0"&&itog[i+stringstart][startzavod][0]<="9"){
                dayst=getnum.daynumb(itog[i+stringstart][startzavod]);
            }
            var dayfin=365;
            if(itog[i+stringstart][finishzavod][0]>="0"&&itog[i+stringstart][finishzavod][0]<="9"){
                dayfin=getnum.daynumb(itog[i+stringstart][finishzavod]);
            }
            var tmp=0;
            if(dayst>start){
                if(dayfin<finish){ tmp=dayfin-dayst; }
                else { tmp=finish-dayst; };
            } else {
                if(dayfin<finish){ tmp=dayfin-start; }
                else { tmp=finish-start; }
            }
            var maint=midmaint;
            if(itog[i+stringstart][zagruzka][0]>="0"&&itog[i+stringstart][zagruzka][0]<="9"){
                maint=parseInt(itog[i+stringstart][zagruzka]);
            }
            losses.push(tmp*maint);
        } 
        var widthScale=d3.scale.sqrt()
            .domain([d3.min(losses, function(d) { return d; }), d3.max(losses, function(d) { return d; })])
            .range([1, maxrating]);
        var rating=[];
        for(i=0;i<losses.length;i++){ rating[i]=widthScale(losses[i]); };
        return rating;
    };
    //getting final objects array for chart building
    getnum.shuf=function(itog){
        var answer=[];
        var spravochnik=getnum.getprocessid(itog);
        var newwidth=getnum.getwidth(itog);
        for (i=0;i<itog.length-stringstart-1;i++){
            var dayst=0;
            if (itog[i+stringstart][startzavod][0]>="0"&&itog[i+stringstart][startzavod][0]<="9"){
                dayst=getnum.daynumb(itog[i+stringstart][startzavod]);
            }
            var dayfin=365;
            if (itog[i+stringstart][finishzavod][0]>="0"&&itog[i+stringstart][finishzavod][0]<="9"){
                dayfin=getnum.daynumb(itog[i+stringstart][finishzavod]);
            }
            var data={
                width:newwidth[i],
                day:dayst,
                longer:dayfin,
                name:itog[i+stringstart][zavod],
                unit:itog[i+stringstart][unitzavod],
                company: itog[i+stringstart][companyzavod],
                process:spravochnik[i][0],
                id:spravochnik[i][1],
                colour:spravochnik[i][2]};
            if((data.longer>start)&&(data.day<finish)){ answer.push(data); }
        }
        return answer;
    };
    //getting colours and ids for processes
    getnum.getprocessid=function(itog){
        //var colourbase=["(181,5,58)","(2,204,137)","(157,80,230)","(113,168,111)","(56,79,143)","(245,131,10)","(112,77,40)","(255,255,0)","(120,120,120)","(140,186,120)","(63,109,245)","(153,5,255)","(255,186,89)","(217,175,224)","(255,0,0)","(36,145,4)","(181,70,58)","(83,58,77)","(194,194,195)","(56,220,242)","(19,39,133)","(123,19,13)","(201,235,252)","(80,135,119)"];
        var colourbase=["(249,147,67)","(64,177,177)","(189,22,32)",
                "(129,104,123)","(169,178,119)","(94,99,195)","(221,147,24)",
                "(255,220,34)","(110,83,53)","(155,155,155)","(135,191,120)",
                "(105,34,130)","(59,140,205)","(219,86,34)","(202,102,140)",
                "(29,147,63)","(200,21,24)","(155,33,80)","(205,15,111)",
                "(194,194,195)","(56,220,242)","(19,39,133)","(123,19,13)",
                "(201,235,252)","(80,135,119)"];
        var spravochnik=[];
        var k=1;
        spravochnik[0]=[itog[stringstart][processzavod],k,colourbase[0]];
        for (i=1;i<itog.length-stringstart-1;i++){
             if(itog[i+stringstart][processzavod]!=itog[i+stringstart-1][processzavod]){ k++; }
             spravochnik[i]=[itog[i+stringstart][processzavod],k,colourbase[(k-1)%colourbase.length]];
        }
        return spravochnik;
    };
    //getting day number from date (e.g. 20.02.2015 = 51)
    getnum.daynumb=function(date){
        var fag=[parseInt(date[0]+date[1]),parseInt(date[3]+date[4]),parseInt(date[6]+date[7]+date[8]+date[9])];
        var day=365*(fag[2]-curyear);
        day=day+month[fag[1]-1][1];
        day=day+fag[0];
        return day;
    };
    //and next we have some magical functions from Yura's code: they are writing smth like copyrights etc.
    function draw2(){
        drawtext(20,20, "start", "fill: #CCC; stroke: none; font-size: "+set.chartSettings.addSet.fontSize+"px; font-family: knowledge,arial; font-weight: normal;", "RUSSIA'S OIL REFINERY MANTENANCE IN 2015");
        //drawbox(10,1215 ,210,110,"url(#grd_orange)");
        drawtext(60, "86%","start","fill: #CCC; stroke: none; font-size: "+set.chartSettings.addSet.fontSize+"px; font-family: knowledge,arial; font-weight: normal;","CIS Commodities Insight.");
        drawtext(60, "88%","start","fill: #CCC; stroke: none; font-size: "+set.chartSettings.addSet.fontSize+"px; font-family: knowledge,arial; font-weight: normal;","©Thomson Reuters. All rights reserved. Any copying, republication or redistribution of Thomson Reuters, including by caching");
        drawtext(60, "90%","start","fill: #CCC; stroke: none; font-size: "+set.chartSettings.addSet.fontSize+"px; font-family: knowledge,arial; font-weight: normal;","framing or similar means, is expressly prohibited without the prior written consent of Thomson Reuters. Title «Thomson Reuters» and");
        drawtext(60, "92%","start","fill: #CCC; stroke: none; font-size: "+set.chartSettings.addSet.fontSize+"px; font-family: knowledge,arial; font-weight: normal;","Thomson Reuters logo are registered trademarks of Thomson Reuters and its affilated companies.");
    }
    function drawbox(h,w,x,y,fill){
        var svg=document.getElementsByTagName('svg')[0]; //Get svg element
        var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
        //<rect height="10" width="830"  x="600" y="220" fill="url(#grd_orange)"/>
        newElement.setAttribute("height",h); //Set path's data
        newElement.setAttribute("width",w); //Set path's data
        newElement.setAttribute("x",x); //Set path's data
        newElement.setAttribute("y",y); //Set path's data
        newElement.style.fill=fill;
        svg.appendChild(newElement);
    }
    function drawtext(x,y, anchor, style, text){
        var svg=document.getElementsByTagName('svg')[0]; //Get svg element

        var newElement=document.createElementNS("http://www.w3.org/2000/svg", 'text');
        newElement.setAttribute("text-anchor", anchor); //Set path's data
        newElement.setAttribute("x", x); //Set path's data
        newElement.setAttribute("y", y); //Set path's data
        newElement.setAttribute("style", style);
        var textNode=document.createTextNode(text);
        newElement.appendChild(textNode);
        svg.appendChild(newElement);
        //<text text-anchor="end" x="95%" y="7%" style="fill: #777; stroke: none; font-size: 40pt; font-family: knowledge,arial; font-weight: normal;">RUSSIAN URALS CRUDE PRIMARY</text>
    }

    var month=[
        ["January",0,31],
        ['February',31,28],
        ['March',59,31],
        ['April',90,30],
        ['May',120,31],
        ['June',151,30],
        ['July',181,31],
        ['August',212,31],
        ['September',243,30],
        ['October',273,31],
        ['November',304,30],
        ['December',334,31]
    ];
    //curmonth
    var shouldwedoit=true;
    var cms=8;
    var start=month[(cms-1+12)%12][1];
    var finish=month[(cms+1+12)%12][1]+month[(cms+1+12)%12][2];
    var seasonlength=month[(cms-1+12)%12][2]+month[(cms)%12][2]+month[(cms+1)%12][2];
    var stringstart=1;
    var curyear=2015;
    var zavod=0;
    var companyzavod=1;
    var unitzavod=2;
    var processzavod=3;
    var startzavod=4;
    var finishzavod=5;
    var zagruzka=6;
    var maxrating=10;

    var txtFile="http://localhost:8080/kortes/static/secondprocmarch.csv";
    var str=FileHelper.readStringFromFileAtPath(txtFile);

    var itog=CSVToArray(str, ';');
    var dataset=getnum.shuf(itog);

    var wdelta=200;
    //var w=1500;
    //var h=1000;
    var hdelta=h/20;
    //переменная начала прорисовки баров
    var wst=1.4*wdelta;
    if(!shouldwedoit){ wst=1.1*wdelta; }
    //начало отбивки по вертикали
    var badumst=65+2*hdelta;
    var moveaxis=30;
    var movexax=-10;
    //длина отбивки

    //КОЛИЧЕСТВО ЦВЕТОВ
    var amcol=dataset[dataset.length-1].id;
    //длина шкалы по вертикали
    var verlen=h-6.6*hdelta;

    var hst=verlen-moveaxis-8;

    var padik=(h-4*hdelta)/(amcol*10+dataset.length*(maxrating+2));
    var runamcol=0;
    var datahead=[];
    var lastidid=0;
    var smth=[dataset[0].process, lastidid, dataset[0].colour];
    datahead.push(smth); 

    //Create shortcut var to svg element
    //var svg=d3.select("svg");
    var svg=d3.select("#"+idChart).append("svg")
        .attr("width",w)
        .attr("height",h)
        .attr("id","svgNewChart"+idChart);

    if(shouldwedoit){
        var longerScale=d3.scale.linear()
        .domain([0, seasonlength])
        .range([0, w-wdelta*2]);
    } else {
        var longerScale = d3.scale.linear()
        .domain([0, seasonlength])
        .range([0, w-wdelta*1.4]);
    }
    var yScale=d3.scale.ordinal()
        .domain(d3.range(dataset.length+amcol))
        .rangeRoundBands([0, verlen], 1/(dataset.length+amcol));
    var yScale2=d3.scale.linear()
        .domain([0,(dataset.length*(maxrating+2))])
        .range([0,verlen]);
    //прорисовка оси-шкалы //drawing an axe
    var lentsymb=122/9;
    var x=wdelta;
    var datamonth=[month[cms-1],month[cms],month[(cms+1)%12]];

    svg.selectAll("rect"+x)
        .data(datamonth)
        .enter()
        .append("rect")
        .attr("x",function(d){return wst+longerScale(d[1]-start);})
        .attr("y",function(d){return moveaxis+badumst-20})
        .attr("width",function(d){return longerScale(d[2]);})
        .attr("height","20")
        .attr("fill",function(d,i){return "rgb("+(255-100)+","+(255-100)+","+(255-100)+")"});
    //прорисовка названий месяцов //drawing a month names
    svg.selectAll("texts"+x+'1')
        .data(datamonth)
        .enter()
        .append("text")
        .text(function(d){ return d[0]; })
        .attr("x",function(d){ return wst+longerScale(d[1]-start)+longerScale(d[2])/2-lentsymb*d[0].length/2; })
        .attr("y",function(d,i){ return moveaxis+badumst-30; })
        .attr("font-family", "arial")
        .attr("font-size", set.chartSettings.addSet.fontSize+"px")
        .attr("fill", "#CCC");

        var end=[month[cms-1][2],month[cms][2],month[cms+1][2]];
        var firstthird=[Math.round((end[0])/3),Math.round((end[1])/3),Math.round((end[2])/3)];
        var secthird=[Math.round((2*end[0])/3),Math.round((2*end[1])/3),Math.round((2*end[2])/3)];
        var dataday2=[[1, start],[firstthird[0], start+firstthird[0]],[secthird[0], start+secthird[0]],[end[0], start+end[0]-1.5],
            [1, start+0.5+end[0]],[firstthird[1], start+end[0]+firstthird[1]],[secthird[1], start+end[0]+secthird[1]],[end[1], start+end[0]+end[1]-1.5],
            [1, start+0.5+end[0]+end[1]],[firstthird[2], start+end[0]+end[1]+firstthird[2]],[secthird[2], start+end[0]+end[1]+secthird[2]],[end[2], start+end[0]+end[1]+end[2]-1.3]];

    //прорисовка квадратиков, в которых хранятся месяца //drawing date squares
    svg.selectAll("squares")
        .data(dataday2)
        .enter()
        .append("rect")
        .attr("x", function(d){ return -2+wst+longerScale(d[1]-start); })
        .attr("y", function(d,i){ return moveaxis+badumst-20; })
        .attr("width","20")
        .attr("height","20")
        .attr("rx","3")
        .attr("ry","3")
        .attr("fill","#000000");					  
    //цифр дней месяца прорисовка //day numbers drawing
    svg.selectAll("texts"+x+'2')
       .data(dataday2)
       .enter()
       .append("text")
       .text(function(d){ return d[0]; })
       .attr("x", function(d){ var tmp=wst+longerScale(d[1]-start);   
            if (d[0]<10) {tmp=tmp+3;}
            return tmp;})
       .attr("y", function(d,i){ return moveaxis+badumst-5; })
       .attr("font-family", "arial")
       .attr("font-size", set.chartSettings.addSet.fontSize+"px")
       .attr("fill", "#CCC");
    //Горизонтальных линий прорисовка //Create lines of rows
    svg.selectAll("asrow")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("y",function(d,i){ return 20+yScale(i+d.id)+badumst; })
        .attr("x",function(d){ return wdelta/2-30; })
        .attr("width",function(d){ return w-wdelta-movexax; })
        .attr("height","1")
        .attr("fill","rgb(50,50,50)");
    //вертикальных линий прорисовка //create lines of days(columns)
    databred=[start];
    for (met=start+1;met<=finish;met++){ databred.push(met); }
    svg.selectAll("ascol")
        .data(databred)
        .enter()
        .append("rect")
        .attr("y",function(d){ return moveaxis+badumst; })
        .attr("x",function(d){ return wst+longerScale(d-start); })
        .attr("width",function(d){ return 1; })
        .attr("height",function(d){ return hst; })
        .attr("fill",function(d){ return "rgb(50,50,50)"; });				
    //САМИХ СОБСНО ГРАФИЧКОВ ПРОРИСОВКА //create bars
    svg.selectAll("comprect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("y", function(d,i){
            var tmp=i+d.id;
            if(tmp-lastidid>1){ datahead.push([d.process,tmp-1,d.colour]); }
            lastidid=tmp;
            return yScale(tmp)+badumst+(maxrating-d.width)*padik/2+3;
        })
        .attr("x", function(d){ return wst+longerScale(Math.max(d.day-start,0)); })
        .attr("width", function(d){
            var width=0;
            if(d.day>=start){
                if(d.longer<=finish){ width=longerScale(d.longer-d.day); }
                else { width=longerScale(finish-d.day); }
            } else {
                if(d.longer<=finish){ width=(longerScale(d.longer-start)); }
                else { width=longerScale(seasonlength); }
            }
            return width;
        })
        .attr("height", function(d){ return d.width*padik; })
        .attr("fill", function(d,i){ return "rgb"+d.colour; })
        .attr("rx",function(d){return d.width}).attr("ry",function(d){return d.width});
    //ПРОЦЕССОВ ТИПОВ ПРОРИСОВКА //create types writings
    svg.selectAll('procname')
        .data(datahead)
        .enter()
        .append("text")
        .text(function(d) {return d[0];})
        .attr("x", function(d){return wdelta/4;})
        .attr("y", function(d){return maxrating*padik+badumst+yScale(d[1]);})
        .attr("font-family", "arial")
        .attr("font-size", set.chartSettings.addSet.fontSize+"px")
        .attr("fill", "#FFFFFF");
    //ЗАВОДОВ И КОМПАНИЙ ПРОРИСОВКА //creates company and factory writings
    svg.selectAll("compname")
        .data(dataset)
        .enter()
        .append("text")
        .text(function(d){ return d.name+" ("+d.company+")"; })
        .attr("x", function(d){ return wdelta/4+10; })
        .attr("y", function(d,i){ return maxrating*padik+badumst+yScale(i+d.id); })
        .attr("font-family", "arial")
        .attr("font-size", set.chartSettings.addSet.fontSize+"px")
        .attr("fill", "#CCC");
    //ЮНИТОВ ПРОРИСОВКА ДОБАВИМ В ЦИКЛ БУЛЕВОЙ ФУНКЦИИ //creates unit writings
    if(shouldwedoit){
        svg.selectAll("unitname")
            .data(dataset)
            .enter()
            .append("text")
            .text(function(d){ return d.unit; })
            .attr("x", function(d){ return wdelta*1.1; })
            .attr("y", function(d,i){ return maxrating*padik+badumst+yScale(i+d.id); })
            .attr("font-family", "arial")
            .attr("font-size", set.chartSettings.addSet.fontSize+"px")
            .attr("fill", "#CCC");
    }
    //ОТБИВОК МЕСЯЦЕЙ ПРОРИСОВКА //because Yura called this lines "breakers" или "отбивки", like "ba-dum-tss" in scrubs-types-jokes
    datamonth2=[month[cms-1],month[cms]];
    svg.selectAll("ascolbold")
        .data(datamonth2)
        .enter()
        .append("rect")
        .attr("y",function(d){ return moveaxis+badumst; })
        .attr("x",function(d){ return wst+longerScale(d[1]+d[2]-start)-1; })
        .attr("width",function(d){ return 3; })
        .attr("height",function(d){ return hst; })
        .attr("fill",function(d){ return "rgb(155,155,155)"; });
    draw2();
}