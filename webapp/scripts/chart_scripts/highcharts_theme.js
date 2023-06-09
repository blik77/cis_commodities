Highcharts.theme={
    colors:["#dc8736","#89a54e","#eb9696","#715891","#9e3241","#3f99b1","#73b697","#3b3f96","#135e84","#bf8bd8","#ca5791","#bbbb44"],
    chart:{
        marginTop: 32,
        backgroundColor:"#242424",
        borderWidth:0,
        borderColor:"#000",
        borderRadius:3,
        plotBackgroundColor:null,
        plotShadow:!1,
        plotBorderWidth:1,
        plotBorderColor:"#000",
        zoomType:"x",
        style:{
            color:"#ccc",
            fontFamily:"ProximaNova, EikonFont, Arial, Helvetica, sans-serif",
            fontSize:"12px"
        },
        resetZoomButton: {
            relativeTo: 'chart',
            position: {
                x: -10,
                y: 1
            },
            theme: {
                fill: '#3c3c42',
                stroke: '#0a0a0a',
                "stroke-width": 1,
                height: 12,
                style: { color: '#c2c2c2', font:"11px ProximaNova, EikonFont, Arial, Helvetica, sans-serif" },
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
    },
    title:{
        style:{
            color:"#ccc",
            fontFamily:"ProximaNova, EikonFont, Arial, Helvetica, sans-serif",
            fontSize:"12px"
        }
    },
    subtitle:{
        style:{
            color:"#DDD",
            fontFamily:"ProximaNova, EikonFont, Arial, Helvetica, sans-serif",
            fontSize:"12px"
        }
    },
    xAxis:{
        gridLineColor:"#2d2d2d",
        gridLineWidth:1,
        minorGridLineColor:"#2d2d2d",
        alternateGridColor:"#1f1f1f",
        lineWidth:1,
        lineColor:"#1f1f1f",
        tickWidth:1,
        tickColor:"#2d2d2d",
        labels:{
            style:{
                color:"#999999",
                fontFamily:"ProximaNova, EikonFont, Arial, Helvetica, sans-serif",
                fontSize:"12px"
            }
        },
        title:{
            style:{
                color:"#AAA",
                fontFamily:"ProximaNova, EikonFont, Arial, Helvetica, sans-serif",
                fontSize:"12px"
            }
        }
    },
    yAxis:{
        gridLineColor:"#2d2d2d",
        gridLineWidth:1,
        minorGridLineColor:"#2d2d2d",
        minorTickLength:1,
        showFirstLabel:!1,
        showLastLabel:!1,
        alternateGridColor:null,
        minorTickInterval:null,
        lineWidth:0,
        tickWidth:0,
        labels:{
            style:{
                color:"#ccc",
                fontFamily:"ProximaNova, EikonFont, Arial, Helvetica, sans-serif",
                fontSize:"12px"
            }
        },
        title:{
            align:"high",
            offset:0,
            rotation:0,
            floating:!0,
            y:-6,
            x:0,
            style:{
                color:"#ccc",
                fontFamily:"ProximaNova, EikonFont, Arial, Helvetica, sans-serif",
                fontSize:"12px"
            }
        }
    },
    legend:{
        borderWidth:0,
        itemDistance:16,
        symbolHeight:10,
        symbolWidth:10,
        symbolRadius:2,
        lineHeight:14,
        itemStyle:{color:"#CCC","font-weight":"normal"},
        itemHoverStyle:{color:"#FFF"},
        itemHiddenStyle:{color:"#333"}
    },
    labels:{
        style:{color:"#CCC"}
    },
    tooltip:{
        backgroundColor:"#2d2c2c",
        borderColor:"#1f1f1f",
        crosshairs:[
            {width:1,color:"#2d2c2c"}
        ],
        style:{
            color:"#ccc",
            fontSize:"12px",
            padding:"8px"
        },
        useHTML:true,
        shared:true,
        headerFormat:'<span style="color:#ccc;font:12px ProximaNova, EikonFont, Arial, Helvetica, sans-serif;">{point.key}</span>',
        pointFormat:'<div><span style="font:12px ProximaNova, EikonFont, Arial, Helvetica, sans-serif;color: {series.color}">{series.name}: </span><span style="text-align: right;color:#ccc;font:12px ProximaNova, EikonFont, Arial, Helvetica, sans-serif;">{point.y}</span></div>',
        footerFormat:''
    },
    plotOptions:{
        line:{
            dataLabels:{color:"#CCC"},
            marker:{lineColor:"#333"}
        },
        spline:{
            marker:{lineColor:"#333"}
        },
        scatter:{
            marker:{lineColor:"#333"}
        },
        candlestick:{lineColor:"white"},
        pie:{
            dataLabels:{
                enabled:!0,
                color:"#fff",
                connectorColor:"#fff"
            }
        },
        series:{
            animation: false,
            fillOpacity:.1,
            turboThreshold: 0,
            marker:{enabled:!1}
        },
        column:{borderWidth:0},
        bar:{borderWidth:0}
    },
    toolbar:{
        itemStyle:{color:"#CCC"}
    },
    navigation:{
        buttonOptions:{
            enabled: false,
            symbolStroke:"#DDDDDD",
            hoverSymbolStroke:"#FFFFFF",
            theme:{
                fill:{
                    linearGradient:{x1:0,y1:0,x2:0,y2:1},
                    stops:[[.4,"#606060"],[.6,"#333333"]]
                },
                stroke:"#000000",
                r:0,
                states:{
                    hover:{fill:"#333333"},
                    select:{fill:"#333333"}
                }
            }
        }
    },
    exporting:{
        url:"/ImageExport/TranslateSvg",
        width:1200
    },
    credits:{
        href:"https://www.refinitiv.com/",
        text:vcbl[lang]['sourceTextForChart']
    },
    rangeSelector:{
        buttonTheme:{
            fill:{
                linearGradient:{x1:0,y1:0,x2:0,y2:1},
                stops:[[.4,"#888"],[.6,"#555"]]
            },
            stroke:"#000000",
            style:{
                color:"#CCC",
                fontWeight:"bold"
            },
            states:{
                hover:{
                    fill:{
                        linearGradient:{x1:0,y1:0,x2:0,y2:1},
                        stops:[[.4,"#BBB"],[.6,"#888"]]
                    },
                    stroke:"#000000",
                    style:{color:"white"}
                },
                select:{
                    fill:{
                        linearGradient:{x1:0,y1:0,x2:0,y2:1},
                        stops:[[.1,"#000"],[.3,"#333"]]
                    },
                    stroke:"#000000",
                    style:{color:"yellow"}
                }
            }
        },
        inputStyle:{
            backgroundColor:"#333",
            color:"silver"
        },
        labelStyle:{color:"silver"},
        inputPosition:{x:-100,y:20},
        inputDateFormat:"%Y-%m-%d",
        inputEditDateFormat:"%Y-%m-%d",
        inputEnabled:!0
    },
    navigator:{
        handles:{
            backgroundColor:"#666",
            borderColor:"#AAA"
        },
        outlineColor:"#CCC",
        maskFill:"rgba(16, 16, 16, 0.5)",
        series:{
            color:"#7798BF",
            lineColor:"#A6C7ED"
        }
    },
    scrollbar:{
        barBackgroundColor:{
            linearGradient:{x1:0,y1:0,x2:0,y2:1},
            stops:[[.4,"#888"],[.6,"#555"]]
        },
        barBorderColor:"#CCC",
        buttonArrowColor:"#CCC",
        buttonBackgroundColor:{
            linearGradient:{x1:0,y1:0,x2:0,y2:1},
            stops:[[.4,"#888"],[.6,"#555"]]
        },
        buttonBorderColor:"#CCC",
        rifleColor:"#FFF",
        trackBackgroundColor:{
            linearGradient:{x1:0,y1:0,x2:0,y2:1},
            stops:[[0,"#000"],[1,"#333"]]
        },
        trackBorderColor:"#666"
    },
    legendBackgroundColor:"rgba(48, 48, 48, 0.8)",
    legendBackgroundColorSolid:"rgb(70, 70, 70)",
    dataLabelsColor:"#444",
    textColor:"#E0E0E0",
    maskColor:"rgba(255,255,255,0.3)"
};
var highchartsOptions=Highcharts.setOptions(Highcharts.theme);