function sankey(idChart,w,h,data,set){
    var maxwidthL=0;
    var maxwidthR=0;
    var maxLevel=1;
    var minValue=1;
    var space=5;
    var isNodeColor=!set.chartSettings.addSet.showLabels;
    var defaultColor="#AAAAAA";
    var fontSize=set.chartSettings.addSet.fontSize;
    var nodeW=space+8;
    var nodePad=15;
    
    var delElZeroVal=function(ar){
        var flag=false;
        var index=0;
        ar.forEach(function(el,ind){
            if(el.value===0){
                if(!flag){ flag=true; index=ind; }
            }
        });
        if(flag){
            ar.splice(index,1);
            return delElZeroVal(ar);
        } else return ar;
    };

    d3.sankey=function(){
        var myscale=(d3.scale.pow().exponent(.7).range([1,5]));
        var sankey={},
            nodeWidth=24,
            nodePadding=8,
            size=[1,1],
            nodes=[],
            links=[];

        sankey.nodeWidth=function(_){
            if(!arguments.length) return nodeWidth;
            nodeWidth=+_;
            return sankey;
        };
        sankey.nodePadding=function(_){
            if (!arguments.length) return nodePadding;
            nodePadding=+_;
            return sankey;
        };
        sankey.nodes=function(_){
            if(!arguments.length) return nodes;
            nodes=_;
            return sankey;
        };
        sankey.links=function(_){
            if(!arguments.length) return links;
            links=_;
            return sankey;
        };
        sankey.size=function(_){
            if(!arguments.length) return size;
            size=_;
            return sankey;
        };
        sankey.layout=function(iterations){
            computeNodeLinks();
            computeNodeValues();
            computeNodeBreadths();
            computeNodeDepths(iterations);
            computeLinkDepths();
            return sankey;
        };
        sankey.relayout=function(){
            computeLinkDepths();
            return sankey;
        };
        sankey.link=function(){
            var curvature=.5;
            function link(d){
                var x0=d.source.x+d.source.dx,
                    x1=d.target.x,
                    xi=d3.interpolateNumber(x0,x1),
                    x2=xi(curvature),
                    x3=xi(1-curvature),
                    y0=d.source.y+d.sy+(d.dy)/2,
                    y1=d.target.y+d.ty+(d.dy)/2;
                return "M"+x0+","+y0+"C"+x2+","+y0+" "+x3+","+y1+" "+x1+","+y1;
            }
            link.curvature=function(_){
                if(!arguments.length) return curvature;
                curvature=+_;
                return link;
            };
            return link;
        };
        function selectNodeLink(id){
            for(var i=0;i<nodes.length;i++){ if(nodes[i].Id==id){ return nodes[i]; } }
        }
        function computeNodeLinks(){
            nodes.forEach(function(node){
                node.sourceLinks=[];
                node.targetLinks=[];
            });
            links.forEach(function(link){
                var source=link.source,target=link.target;
                if(typeof source==="number") source=link.source=selectNodeLink(link.source);
                if(typeof target==="number") target=link.target=selectNodeLink(link.target);
                source.sourceLinks.push(link);
                target.targetLinks.push(link);
            });
        }
        function computeNodeValues(){
            nodes.forEach(function(node){
                node.value=Math.max(
                    d3.sum(node.sourceLinks,function(d){ return d.value }),
                    d3.sum(node.targetLinks,function(d){ return d.value })
                );
            });
        }
        function computeNodeBreadths(){
            var remainingNodes=nodes,
                nextNodes,
                x=0;
            while(remainingNodes.length){
                nextNodes=[];
                remainingNodes.forEach(function(node){
                    node.x=x;
                    node.dx=nodeWidth;
                    node.sourceLinks.forEach(function(link){ nextNodes.push(link.target); });
                });
                remainingNodes=nextNodes;
                ++x;
            }
            moveSinksRight(x);
            scaleNodeBreadths((width-nodeWidth)/(x-1));
        }
        function moveSourcesRight(){
            nodes.forEach(function(node){
                if(!node.targetLinks.length){
                    node.x=d3.min(node.sourceLinks,function(d){ return d.target.x; })-1;
                }
            });
        }
        function moveSinksRight(x){
            nodes.forEach(function(node){
                if(!node.sourceLinks.length){ node.x=x-1; }
            });
        }
        function scaleNodeBreadths(kx){
            nodes.forEach(function(node){ node.x*=kx; });
        }
        function computeNodeDepths(iterations){
            var nodesByBreadth=d3.nest()
                .key(function(d){ return d.x; })
                .sortKeys(d3.ascending)
                .entries(nodes)
                .map(function(d){ return d.values; });
            initializeNodeDepth();
            resolveCollisions();
            for(var alpha=1; iterations>0; --iterations){
                relaxRightToLeft(alpha*=.99);
                resolveCollisions();
                relaxLeftToRight(alpha);
                resolveCollisions();
            }
            function initializeNodeDepth(){
                var ky=d3.min(nodesByBreadth,function(nodes){
                    return (size[1]-(nodes.length-1)*nodePadding)/d3.sum(nodes,value);
                });
                nodesByBreadth.forEach(function(nodes){
                    nodes.forEach(function(node,i){
                        node.y=i;
                        node.dy=node.value*ky;
                    });
                });
                links.forEach(function(link){
                    link.dy=link.value*ky;
                });
            }
            function relaxLeftToRight(alpha){
                nodesByBreadth.forEach(function(nodes,breadth){
                    nodes.forEach(function(node){
                        if(node.targetLinks.length){
                            var y=d3.sum(node.targetLinks,weightedSource)/d3.sum(node.targetLinks,value);
                            node.y+=(y-center(node))*alpha;
                        }
                    });
                });
                function weightedSource(link){
                    return center(link.source)*link.value;
                }
            }
            function relaxRightToLeft(alpha){
                nodesByBreadth.slice().reverse().forEach(function(nodes){
                    nodes.forEach(function(node){
                        if(node.sourceLinks.length){
                            var y=d3.sum(node.sourceLinks, weightedTarget)/d3.sum(node.sourceLinks, value);
                            node.y+=(y-center(node))*alpha;
                        }
                    });
                });
                function weightedTarget(link){
                    return center(link.target)*link.value;
                }
            }
            function resolveCollisions(){
                nodesByBreadth.forEach(function(nodes){
                    var node,dy,y0=0,n=nodes.length,i;
                    nodes.sort(descendingDepth);
                    for (i=0; i<n; ++i){
                        node=nodes[i];
                        dy=y0-node.y;
                        if(dy>0)node.y+=dy;
                        y0=node.y+node.dy+nodePadding;
                    }
                    dy=y0-nodePadding-size[1];
                    if(dy>0){
                        y0=node.y-=dy;
                        for(i=n-2; i>=0; --i){
                            node=nodes[i];
                            dy=node.y+node.dy+nodePadding-y0;
                            if(dy>0)node.y-=dy;
                            y0=node.y;
                        }
                    }
                });
            }
            function ascendingDepth(a,b){
                return a.y-b.y;
            }
        }
        function computeLinkDepths(){
            nodes.forEach(function(node){
                node.sourceLinks.sort(ascendingTargetDepth);
                node.targetLinks.sort(ascendingSourceDepth);
            });
            nodes.forEach(function(node){
                var sy=0,ty=0;
                node.sourceLinks.forEach(function(link){
                    link.sy=sy;
                    sy+=(link.dy);
                });
                node.targetLinks.forEach(function(link){
                    link.ty=ty;
                    ty+=(link.dy);
                });
            });
            function ascendingSourceDepth(a,b){ return a.source.y-b.source.y; }
            function ascendingTargetDepth(a,b){ return a.target.y-b.target.y; }
        }
        function center(node){ return node.y+node.dy/2; }
        function value(link){ return link.value; }
        function descendingDepth(a,b){
            if(a.Name.indexOf("Н/Д")>-1     || a.Name.indexOf("НД")>-1)         return -(a.dy/2000-b.dy);
            if(a.Name.indexOf("Прочие")>-1  && b.Name.indexOf("Прочие")==-1)    return -(a.dy/2000-b.dy);
            if(b.Name.indexOf("Н/Д")>-1     || b.Name.indexOf("НД")>-1)         return -(a.dy-b.dy/2000);
            if(b.Name.indexOf("Прочие")>-1  && a.Name.indexOf("Прочие")==-1)    return -(a.dy-b.dy/2000);
            if(a.Name.indexOf("НЕЗАВИСИМЫЕ")>-1)    return -(a.dy/2000-b.dy);
            if(b.Name.indexOf("НЕЗАВИСИМЫЕ")>-1)    return -(a.dy-b.dy/2000);
            if(b.Name==("Прочие ПОЛУЧАТЕЛИ"))       return -100-(a.dy-b.dy);
            if(a.Name==("Прочие ПОЛУЧАТЕЛИ"))       return 100-(a.dy-b.dy);
            if(b.Name.indexOf("Прочие")>-1  && a.Name.indexOf("Прочие")>-1)     return -(a.dy-b.dy);
            return -(a.dy-b.dy);
        }
        return sankey;
    };
    var links=[];
    links=JSON.parse(data);
    links=delElZeroVal(links);
    //Ext.create('eikonDialog').alert(vcbl[lang]["statusTitle"],JSON.stringify(links));
    links.forEach(function(dataitem){
        dataitem.source=dataitem.source.trim();
        dataitem.target=dataitem.target.trim();
        var thiswidth=0;
        if(dataitem.level===1){
            thiswidth=getTextWidth(dataitem.source,"bold "+fontSize+"px arial");
            if(thiswidth>maxwidthL){ maxwidthL=thiswidth; }
        }
        if(dataitem.level>maxLevel){ maxLevel=dataitem.level; maxwidthR=0; }
        if(dataitem.value<minValue){ minValue=dataitem.value; }
        if(dataitem.level===maxLevel){
            thiswidth=getTextWidth(dataitem.target,"bold "+fontSize+"px arial")
            if(thiswidth>maxwidthR){ maxwidthR=thiswidth; }
        }
    });
    /*var notLinkedNode=[];
    var arToAdd=[];
    links.forEach(function(dataitem){
        if(dataitem.level!==maxLevel){
            var tempflag=true;
            links.forEach(function(el){
                if(el.level!==maxLevel && el.level>dataitem.level){
                    if(el.source===dataitem.target) { tempflag=false; }
                } else if(el.level===maxLevel-1){
                    tempflag=false;
                }
            });
            if(tempflag){
                notLinkedNode.push({level: dataitem.level,target: dataitem.target,flag: true});
            }
        }
    });
    if(notLinkedNode.length>0){
        notLinkedNode.forEach(function(nlNode){
            links.forEach(function(el){
                if(el.level===nlNode.level+1){
                    if(nlNode.flag){
                        arToAdd.push({"value":minValue/1000,"level":el.level,"target":el.target,"source":nlNode.target});
                        nlNode.flag=false;
                    }
                }
            });
        });
    }
    if(arToAdd.length>0){ [].push.apply(links,arToAdd); }*/
    maxwidthL=maxwidthL+20;
    maxwidthR=maxwidthR+10;
    var margin={ top: 10,right: maxwidthR,bottom: 10,left: maxwidthL },
        width=w-maxwidthL-maxwidthR,
        height=h-margin.top-margin.bottom;
    var en_US={
        "decimal": ".",
        "thousands": "\u00A0",
        "grouping": [3],
        "currency": ["$", ""],
        "dateTime": "%a %b %e %X %Y",
        "date": "%m/%d/%Y",
        "time": "%H:%M:%S",
        "periods": ["AM", "PM"],
        "days": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        "shortDays": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        "months": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        "shortMonths": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    };
    var locale=d3.locale(en_US);
    var formatNumber=locale.numberFormat(",.d"),
        format=function(d){ return formatNumber(Math.round(d)); },
        color=d3.scale.category20();
    var svg=d3.select("#"+idChart).append("svg")
        .attr("width",width+margin.left+margin.right)
        .attr("height",height+margin.top+margin.bottom)
        .attr("id","svgsankey"+idChart);

    if(idChart==="chart_for_download"){
        svg.attr("xmlns:xlink","http://www.w3.org/1999/xlink").attr("xmlns", "http://www.w3.org/2000/svg").attr("version", "1.1");
        svg.append("style").text(".node rect { cursor: move; fill-opacity: 0.9; shape-rendering: crispEdges; }"+
".node text { pointer-events: none; }"+
".link { fill: none; stroke: #000000; stroke-opacity: 0.5; }"+
".link:hover { stroke-opacity: 1.0; }"+
"text { font-size: "+fontSize+"px; font-family: knowledge, arial; font-weight: bold;}");
    }

    svg=svg.append("g").attr("transform","translate("+margin.left+","+margin.top+")");
    var sankey=d3.sankey().nodeWidth(nodeW).nodePadding(nodePad).size([width, height]);
    var path=sankey.link();
    var nodes=[];
    var id=1;

    links.forEach(function(link){
        var exists=false;
        var tmpid=0;
        link.level_source+=1;
        link.level+=1;
        nodes.forEach(function(node){
            if(link.source.trim()===""){ link.source="N/A"; }
            if(node.Name===link.source && node.level===link.level_source){
                exists=true;
                tmpid=node.Id;
            }
        });
        if(exists===false){
            var mynode=new Object();
            mynode.Id=id;
            mynode.level=link.level_source;
            mynode.level_target=link.level;
            mynode.Name=link.source.trim();
            mynode.NameEng=link.source.trim();
            mynode.level_source=link.level_source;
            nodes.push(mynode);
            link.source=id;
            id=id+1;
        } else { link.source=tmpid; }
        exists=false;
        nodes.forEach(function(node){
            if(link.target.trim()==="") { link.target="N/A "; }
            if(node.Name===link.target && node.level===link.level){
                exists=true;
                tmpid=node.Id;
            }
        });
        if(exists===false){
            var mynode=new Object();
            mynode.Id=id;
            mynode.level=link.level;
            mynode.level_target=link.level;
            mynode.Name=link.target.trim();
            mynode.NameEng=link.target;
            mynode.level_source=link.level_source;
            nodes.push(mynode);
            link.target=id;
            id=id+1;
            if(mynode.level>maxLevel)maxLevel=mynode.level;
        } else { link.target=tmpid; }
    });
    //d3.json("http://bost.ocks.org/mike/sankey/energy.json", function(energy) {
    sankey.nodes(nodes).links(links).layout(2);
    var link=svg.append("g").selectAll(".link")
        .data(links)
        .enter().append("path")
        .attr("class","link")
        .attr("d",path)
        .style("display",function(d){return d.value<=0.000001?"none":"block";})
        .style("stroke",function(d){
            if(isNodeColor){ return d3.rgb(defaultColor); }
            if(d.source.targetLinks.length>0)
                return d.color=d3.rgb(color(d.source.Name.replace(/ /g, ""))).brighter(0.7);
            else if(d.target.sourceLinks.length>0)
                return d.color=d3.rgb(color(d.target.Name.replace(/ /g, ""))).brighter(0.7);
            else
                return d.color=d3.rgb(color(d.source.Name.replace(/ /g, ""))).brighter(0.7);
        })
        .style("stroke-width",function(d){ return Math.max(1,(d.dy)); })
        .sort(function(a,b){ return b.dy-a.dy; });
    if(idChart!=="chart_for_download"){
        link.append("title").text(function(d){ return d.source.Name+" → "+d.target.Name+"\n"+format(d.value); });
    }
    var node=svg.append("g").selectAll(".node")
        .data(nodes)
        .enter().append("g")
        .filter(function(d){ return d.level===1; })
        .attr("class","node")
        .attr("transform",function(d){ return "translate("+(d.x+space)+","+d.y+")"; })
        .call(d3.behavior.drag()
        .origin(function(d){ return d; })
        .on("dragstart",function(){ this.parentNode.appendChild(this); })
        .on("drag",dragmove));

    node.append("rect")
        .attr("height",function(d){ return d.dy; })
        .attr("width",sankey.nodeWidth()-space)
        .style("display",function(d){return d.value<=0.000001?"none":"block";})
        .style("fill",function(d){
            if(!isNodeColor){ return d.color=d3.rgb(defaultColor); }
            else{ return d.color=color(d.Name.replace(/ /g, "")); }
        })
        .style("stroke",function(d){
            if(!isNodeColor) return d3.rgb(defaultColor);
            return d3.rgb(d.color);
        });
    if(idChart!=="chart_for_download"){ node.append("title").text(function(d){ return d.Name+"\n"+format(d.value); }); }

    var nodemid=svg.append("g").selectAll(".node")
        .data(nodes)
        .enter().append("g")
        .filter(function(d){ return d.sourceLinks.length>0 && d.targetLinks.length>0 && 1>0 })
        .attr("class","node")
        .attr("transform",function(d){ return "translate("+(d.x+space)+","+d.y+")"; })
        .call(d3.behavior.drag()
        .origin(function(d){ return d; })
        .on("dragstart",function(){ this.parentNode.appendChild(this); })
        .on("drag",dragmove));

    nodemid.append("rect")
        .attr("height",function(d){ return d.dy; })
        .attr("width",sankey.nodeWidth()-space)
        .style("display",function(d){return d.value<=0.000001?"none":"block";})
        .style("fill",function(d){ return d.color=color(d.Name.replace(/ /g, "")); })
        .style("stroke",function(d){ return d3.rgb(d.color); });
    if(idChart!=="chart_for_download"){ nodemid.append("title").text(function(d){ return d.Name+"\n"+format(d.value); }); }

    var noderight=svg.append("g").selectAll(".node")
        .data(nodes)
        .enter().append("g")
        .filter(function(d){ return d.sourceLinks.length===0;/*d.level===maxLevel;*/ })
        .attr("class","node")
        .attr("transform",function(d){ return "translate("+(d.x+space)+","+d.y+")"; })
        .call(d3.behavior.drag()
        .origin(function(d){ return d; })
        .on("dragstart",function(){ this.parentNode.appendChild(this); })
        .on("drag",dragmove));

    noderight.append("rect")
        .attr("height",function(d){ return d.dy; })
        .attr("width",sankey.nodeWidth()-space)
        .style("display",function(d){return d.value<=0.000001?"none":"block";})
        .style("fill",function(d){
            if(!isNodeColor) return d.color=d3.rgb(defaultColor);
            return d.color=color(d.Name.replace(/ /g, ""));
        })
        .style("stroke",function(d){
            if(!isNodeColor) return d3.rgb(defaultColor);
            return d3.rgb(d.color);
        });
    if(idChart!=="chart_for_download"){ noderight.append("title").text(function(d){ return d.Name+"\n"+format(d.value); }); }

    if(idChart==="chart_for_download"){
        node.append("text")
            .attr("y",function(d){ return d.dy/2; })
            .attr("dy",".35em")
            .style("display",function(d){return d.value<=0.000001?"none":"block";})
            .text(function(d){ return replaceOther(d.Name); })
            .attr("x",-10-sankey.nodeWidth())
            .attr("text-anchor","end");
        node.append("text")
            .attr("y",function(d){ return d.dy/2; })
            .attr("dy",".35em")
            .style("display",function(d){return d.value<=0.000001?"none":"block";})
            .text(function(d){ return format(d.value); })
            .attr("x",10+sankey.nodeWidth())
            .attr("text-anchor", "start");
        nodemid.append("text")
            .attr("y",function(d){ return d.dy/2; })
            .attr("dy",".35em")
            .style("display",function(d){return d.value<=0.000001?"none":"block";})
            .attr("text-anchor", "start")
            .text(function(d){ return replaceOther(d.Name); })
            .attr("x",10+sankey.nodeWidth());
        nodemid.append("text")
            .attr("y",function(d){ return d.dy/2; })
            .attr("dy",".35em")
            .style("display",function(d){return d.value<=0.000001?"none":"block";})
            .attr("text-anchor","end")
            .text(function(d){ return format(d.value); })
            .attr("x",-30+sankey.nodeWidth());
        noderight.append("text")
            .attr("y",function(d){ return d.dy/2; })
            .attr("dy",".35em")
            .style("display",function(d){return d.value<=0.000001?"none":"block";})
            .attr("text-anchor","start")
            .text(function(d){ return replaceOther(d.Name); })
            .attr("x",10+sankey.nodeWidth());
        noderight.append("text")
            .attr("y",function(d){ return d.dy/2; })
            .attr("dy",".35em")
            .style("display",function(d){return d.value<=0.000001?"none":"block";})
            .attr("text-anchor","end")
            .text(function(d){ return format(d.value); })
            .attr("x",-30+sankey.nodeWidth());
    }
    else {
        node.append("text")
            .attr("y",function(d){ return d.dy/2; })
            .attr("dy",".35em")
            .style("display",function(d){return d.value<=0.000001?"none":"block";})
            .style("fill",function(d){ return d.color=d3.rgb("#CCCCCC"); })
            .style("font-size",fontSize+"px")
            .style("font-family","knowledge,arial")
            .style("font-weight","bold")
            .text(function(d){ return replaceOther(d.Name); })
            .attr("x",-10-sankey.nodeWidth())
            .attr("text-anchor","end");
        node.append("text")
            .attr("y",function(d){ return d.dy/2; })
            .attr("dy",".35em")
            .style("display",function(d){return d.value<=0.000001?"none":"block";})
            .style("fill",function(d){ return d.color=d3.rgb("#CCCCCC"); })
            .style("font-size", fontSize+"px")
            .style("font-family", "knowledge,arial")
            .style("font-weight", "bold")
            .text(function(d){ return format(d.value); })
            .attr("x",10+sankey.nodeWidth())
            .attr("text-anchor", "start");
        nodemid.append("text")
            .attr("y",function(d){ return d.dy/2; })
            .attr("dy",".35em")
            .attr("text-anchor","start")
            .style("display",function(d){return d.value<=0.000001?"none":"block";})
            .style("fill",function(d){ return d.color=d3.rgb("#CCCCCC"); })
            .style("font-size",fontSize+"px")
            .style("font-family","knowledge,arial")
            .style("font-weight","bold")
            .text(function(d){ return replaceOther(d.Name); })
            .attr("x",10+sankey.nodeWidth());
        nodemid.append("text")
            .attr("y",function(d){ return d.dy/2; })
            .attr("dy",".35em")
            .attr("text-anchor","end")
            .style("display",function(d){return d.value<=0.000001?"none":"block";})
            .style("fill",function(d){ return d.color=d3.rgb("#CCCCCC"); })
            .style("font-size",fontSize+"px")
            .style("font-family","knowledge,arial")
            .style("font-weight","bold")
            .text(function(d){ return format(d.value); })
            .attr("x",-30+sankey.nodeWidth());
        noderight.append("text")
            .attr("y",function(d){ return d.dy/2; })
            .attr("dy",".35em")
            .attr("text-anchor","start")
            .style("display",function(d){return d.value<=0.000001?"none":"block";})
            .style("fill",function(d){ return d.color=d3.rgb("#CCCCCC"); })
            .style("font-size",fontSize+"px")
            .style("font-family","knowledge,arial")
            .style("font-weight","bold")
            .text(function(d){ return replaceOther(d.Name); })
            .attr("x",10+sankey.nodeWidth());
        noderight.append("text")
            .attr("y",function(d){ return d.dy/2; })
            .attr("dy",".35em")
            .attr("text-anchor","end")
            .style("display",function(d){return d.value<=0.000001?"none":"block";})
            .style("fill",function(d){ return d.color=d3.rgb("#CCCCCC"); })
            .style("font-size",fontSize+"px")
            .style("font-family","knowledge,arial")
            .style("font-weight","bold")
            .text(function(d){ return format(d.value); })
            .attr("x",-30+sankey.nodeWidth());
    }
    Window.sankey=d3.select("#svgsankey"+idChart)
        .attr("xmlns", "http://www.w3.org/2000/svg")
        .node().parentNode.innerHTML;//svg[0][0].parentElement.outerHTML;//
    jQuery.fn.sankey=function(){
            return {
                getSVG: (function(){ return Window.sankey; })
                    };
            };
    function dragmove(d) {
        d3.select(this).attr("transform","translate("+(d.x+space)+","+(d.y=Math.max(0,Math.min(height-d.dy,d3.event.y)))+")");
        sankey.relayout();
        link.attr("d",path);
    }
}
function getTextWidth(text, font) {
    // re-use canvas object for better performance
    var canvas=getTextWidth.canvas || (getTextWidth.canvas=document.createElement("canvas"));
    var context=canvas.getContext("2d");
    context.font=font;
    var metrics=context.measureText(text);
    return metrics.width;
}
function replaceOther(text){
    if(lang==="ENG" && text==="Прочие"){ text=text.replace("Прочие","Other"); }
    else if(lang==="ENG" && text==="НЕЗАВИСИМЫЕ"){ text=text.replace("НЕЗАВИСИМЫЕ","INDEPENDENT"); }
    else if(lang==="ENG" && text==="Прочие ПОЛУЧАТЕЛИ"){ text=text.replace("Прочие ПОЛУЧАТЕЛИ","Other RECIPIENTS"); }
    else if(lang==="ENG" && text==="Н/Д"){ text=text.replace("Н/Д","N/A"); }
    return text;
}