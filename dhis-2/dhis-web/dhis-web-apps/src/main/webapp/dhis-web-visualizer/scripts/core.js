Ext.onReady( function() {

	// ext config
	Ext.Ajax.method = 'GET';

    Ext.isIE = (/trident/.test(Ext.userAgent));

    Ext.isIE11 = Ext.isIE && (/rv:11.0/.test(Ext.userAgent));

    Ext.util.CSS.createStyleSheet = function(cssText, id) {
        var ss,
            head = document.getElementsByTagName("head")[0],
            styleEl = document.createElement("style");

        styleEl.setAttribute("type", "text/css");

        if (id) {
           styleEl.setAttribute("id", id);
        }

        if (Ext.isIE && !Ext.isIE11) {
           head.appendChild(styleEl);
           ss = styleEl.styleSheet;
           ss.cssText = cssText;
        }
        else {
            try {
                styleEl.appendChild(document.createTextNode(cssText));
            }
            catch(e) {
               styleEl.cssText = cssText;
            }
            head.appendChild(styleEl);
            ss = styleEl.styleSheet ? styleEl.styleSheet : (styleEl.sheet || document.styleSheets[document.styleSheets.length-1]);
        }
        this.cacheStyleSheet(ss);
        return ss;
    };

    // override
    Ext.override(Ext.chart.Chart, {
        insetPaddingObject: {},

        alignAxes: function() {
            var me = this,
                axes = me.axes,
                legend = me.legend,
                edges = ['top', 'right', 'bottom', 'left'],
                chartBBox,
                insetPadding = me.insetPadding,
                insetPaddingObject = me.insetPaddingObject,
                insets = {
                    top: insetPaddingObject.top || insetPadding,
                    right: insetPaddingObject.right || insetPadding,
                    bottom: insetPaddingObject.bottom || insetPadding,
                    left: insetPaddingObject.left || insetPadding
                };

            function getAxis(edge) {
                var i = axes.findIndex('position', edge);
                return (i < 0) ? null : axes.getAt(i);
            }


            Ext.each(edges, function(edge) {
                var isVertical = (edge === 'left' || edge === 'right'),
                    axis = getAxis(edge),
                    bbox;


                if (legend !== false) {
                    if (legend.position === edge) {
                        bbox = legend.getBBox();
                        insets[edge] += (isVertical ? bbox.width : bbox.height) + insets[edge];
                    }
                }



                if (axis && axis.bbox) {
                    bbox = axis.bbox;
                    insets[edge] += (isVertical ? bbox.width : bbox.height);
                }
            });

            chartBBox = {
                x: insets.left,
                y: insets.top,
                width: me.curWidth - insets.left - insets.right,
                height: me.curHeight - insets.top - insets.bottom
            };
            me.chartBBox = chartBBox;



            axes.each(function(axis) {
                var pos = axis.position,
                    isVertical = (pos === 'left' || pos === 'right');

                axis.x = (pos === 'right' ? chartBBox.x + chartBBox.width : chartBBox.x);
                axis.y = (pos === 'top' ? chartBBox.y : chartBBox.y + chartBBox.height);
                axis.width = (isVertical ? chartBBox.width : chartBBox.height);
                axis.length = (isVertical ? chartBBox.height : chartBBox.width);
            });
        }
    });

    Ext.override(Ext.chart.series.Line, {
        drawSeries: function() {
            var ak=this,au=ak.chart,S=au.axes,ao=au.getChartStore(),V=ao.getCount(),u=ak.chart.surface,am={},R=ak.group,K=ak.showMarkers,aA=ak.markerGroup,D=au.shadow,C=ak.shadowGroups,X=ak.shadowAttributes,O=ak.smooth,q=C.length,ar=["M"],T=["M"],d=["M"],b=["M"],J=au.markerIndex,ai=[].concat(ak.axis),ah,av=[],ag={},aa=[],v={},I=false,Q=[],az=ak.markerStyle,Z=ak.style,t=ak.colorArrayStyle,P=t&&t.length||0,L=Ext.isNumber,aw=ak.seriesIdx,g=ak.getAxesForXAndYFields(),l=g.xAxis,ay=g.yAxis,ac,h,ab,ad,A,c,ae,H,G,f,e,s,r,W,N,M,at,m,F,E,aB,n,p,B,a,Y,af,z,aq,w,ap,o,ax,an,al,U,k,aj;if(ak.fireEvent("beforedraw",ak)===false){return}if(!V||ak.seriesIsHidden){aj=this.items;if(aj){for(N=0,at=aj.length;N<at;++N){if(aj[N].sprite){aj[N].sprite.hide(true)}}}return}an=Ext.apply(az||{},ak.markerConfig);U=an.type;delete an.type;al=Z;if(!al["stroke-width"]){al["stroke-width"]=0.5}if(J&&aA&&aA.getCount()){for(N=0;N<J;N++){E=aA.getAt(N);aA.remove(E);aA.add(E);aB=aA.getAt(aA.getCount()-2);E.setAttributes({x:0,y:0,translate:{x:aB.attr.translation.x,y:aB.attr.translation.y}},true)}}ak.unHighlightItem();ak.cleanHighlights();ak.setBBox();am=ak.bbox;ak.clipRect=[am.x,am.y,am.width,am.height];for(N=0,at=ai.length;N<at;N++){m=S.get(ai[N]);if(m){F=m.calcEnds();if(m.position=="top"||m.position=="bottom"){z=F.from;aq=F.to}else{w=F.from;ap=F.to}}}if(ak.xField&&!L(z)&&(l=="bottom"||l=="top")&&!S.get(l)){m=Ext.create("Ext.chart.axis.Axis",{chart:au,fields:[].concat(ak.xField)}).calcEnds();z=m.from;aq=m.to}if(ak.yField&&!L(w)&&(ay=="right"||ay=="left")&&!S.get(ay)){m=Ext.create("Ext.chart.axis.Axis",{chart:au,fields:[].concat(ak.yField)}).calcEnds();w=m.from;ap=m.to}if(isNaN(z)){z=0;Y=am.width/((V-1)||1)}else{Y=am.width/((aq-z)||(V-1)||1)}if(isNaN(w)){w=0;af=am.height/((V-1)||1)}else{af=am.height/((ap-w)||(V-1)||1)}ak.eachRecord(function(j,x){p=j.get(ak.xField);if(typeof p=="string"||typeof p=="object"&&!Ext.isDate(p)||l&&S.get(l)&&S.get(l).type=="Category"){if(p in ag){p=ag[p]}else{p=ag[p]=x}}B=j.get(ak.yField);if(typeof B=="undefined"||(typeof B=="string"&&!B)){if(Ext.isDefined(Ext.global.console)){Ext.global.console.warn("[Ext.chart.series.Line]  Skipping a store element with an undefined value at ",j,p,B)}return}if(typeof B=="object"&&!Ext.isDate(B)||ay&&S.get(ay)&&S.get(ay).type=="Category"){B=x}Q.push(x);av.push(p);aa.push(B)});at=av.length;if(at>am.width){a=ak.shrink(av,aa,am.width);av=a.x;aa=a.y}ak.items=[];k=0;at=av.length;for(N=0;N<at;N++){p=av[N];B=aa[N];if(B===false){if(T.length==1){T=[]}I=true;ak.items.push(false);continue}else{H=(am.x+(p-z)*Y).toFixed(2);G=((am.y+am.height)-(B-w)*af).toFixed(2);if(I){I=false;T.push("M")}T=T.concat([H,G])}if((typeof r=="undefined")&&(typeof G!="undefined")){r=G;s=H}if(!ak.line||au.resizing){ar=ar.concat([H,am.y+am.height/2])}if(au.animate&&au.resizing&&ak.line){ak.line.setAttributes({path:ar},true);if(ak.fillPath){ak.fillPath.setAttributes({path:ar,opacity:0.2},true)}if(ak.line.shadows){ac=ak.line.shadows;for(M=0,q=ac.length;M<q;M++){h=ac[M];h.setAttributes({path:ar},true)}}}if(K){E=aA.getAt(k++);if(!E){E=Ext.chart.Shape[U](u,Ext.apply({group:[R,aA],x:0,y:0,translate:{x:+(f||H),y:e||(am.y+am.height/2)},value:'"'+p+", "+B+'"',zIndex:4000},an));E._to={translate:{x:+H,y:+G}}}else{E.setAttributes({value:'"'+p+", "+B+'"',x:0,y:0,hidden:false},true);E._to={translate:{x:+H,y:+G}}}}ak.items.push({series:ak,value:[p,B],point:[H,G],sprite:E,storeItem:ao.getAt(Q[N])});f=H;e=G}if(T.length<=1){return}if(ak.smooth){b=Ext.draw.Draw.smooth(T,L(O)?O:ak.defaultSmoothness)}d=O?b:T;if(au.markerIndex&&ak.previousPath){ad=ak.previousPath;if(!O){Ext.Array.erase(ad,1,2)}}else{ad=T}if(!ak.line){ak.line=u.add(Ext.apply({type:"path",group:R,path:ar,stroke:al.stroke||al.fill},al||{}));if(D){ak.line.setAttributes(Ext.apply({},ak.shadowOptions),true)}ak.line.setAttributes({fill:"none",zIndex:3000});if(!al.stroke&&P){ak.line.setAttributes({stroke:t[aw%P]},true)}if(D){ac=ak.line.shadows=[];for(ab=0;ab<q;ab++){ah=X[ab];ah=Ext.apply({},ah,{path:ar});h=u.add(Ext.apply({},{type:"path",group:C[ab]},ah));ac.push(h)}}}if(ak.fill){c=d.concat([["L",H,am.y+am.height],["L",s,am.y+am.height],["L",s,r]]);if(!ak.fillPath){ak.fillPath=u.add({group:R,type:"path",opacity:al.opacity||0.3,fill:al.fill||t[aw%P],path:ar})}}W=K&&aA.getCount();if(au.animate){A=ak.fill;o=ak.line;ae=ak.renderer(o,false,{path:d},N,ao);Ext.apply(ae,al||{},{stroke:al.stroke||al.fill});delete ae.fill;o.show(true);if(au.markerIndex&&ak.previousPath){ak.animation=ax=ak.onAnimate(o,{to:ae,from:{path:ad}})}else{ak.animation=ax=ak.onAnimate(o,{to:ae})}if(D){ac=o.shadows;for(M=0;M<q;M++){ac[M].show(true);if(au.markerIndex&&ak.previousPath){ak.onAnimate(ac[M],{to:{path:d},from:{path:ad}})}else{ak.onAnimate(ac[M],{to:{path:d}})}}}if(A){ak.fillPath.show(true);ak.onAnimate(ak.fillPath,{to:Ext.apply({},{path:c,fill:al.fill||t[aw%P],"stroke-width":0},al||{})})}if(K){k=0;for(N=0;N<at;N++){if(ak.items[N]){n=aA.getAt(k++);if(n){ae=ak.renderer(n,ao.getAt(N),n._to,N,ao);ak.onAnimate(n,{to:Ext.apply(ae,an||{})});n.show(true)}}}for(;k<W;k++){n=aA.getAt(k);n.hide(true)}}}else{ae=ak.renderer(ak.line,false,{path:d,hidden:false},N,ao);Ext.apply(ae,al||{},{stroke:al.stroke||al.fill});delete ae.fill;ak.line.setAttributes(ae,true);if(D){ac=ak.line.shadows;for(M=0;M<q;M++){ac[M].setAttributes({path:d,hidden:false},true)}}if(ak.fill){ak.fillPath.setAttributes({path:c,hidden:false},true)}if(K){k=0;for(N=0;N<at;N++){if(ak.items[N]){n=aA.getAt(k++);if(n){ae=ak.renderer(n,ao.getAt(N),n._to,N,ao);n.setAttributes(Ext.apply(an||{},ae||{}),true);n.show(true)}}}for(;k<W;k++){n=aA.getAt(k);n.hide(true)}}}if(au.markerIndex){if(ak.smooth){Ext.Array.erase(T,1,2)}else{Ext.Array.splice(T,1,0,T[1],T[2])}ak.previousPath=T}ak.renderLabels();ak.renderCallouts();ak.fireEvent("draw",ak);
        }
    });

    Ext.override(Ext.chart.Legend, {
        updatePosition: function() {
            var me = this,
                x, y,
                legendWidth = me.width,
                legendHeight = me.height,
                padding = me.padding,
                chart = me.chart,
                chartBBox = chart.chartBBox,
                insets = chart.insetPadding,
                chartWidth = chartBBox.width - (insets * 2),
                chartHeight = chartBBox.height - (insets * 2),
                chartX = chartBBox.x + insets,
                chartY = chartBBox.y + insets,
                surface = chart.surface,
                mfloor = Math.floor;

            if (me.isDisplayed()) {
                // Find the position based on the dimensions
                switch(me.position) {
                    case "left":
                        x = insets;
                        y = mfloor(chartY + chartHeight / 2 - legendHeight / 2);
                        break;
                    case "right":
                        x = mfloor(surface.width - legendWidth) - insets;
                        y = mfloor(chartY + chartHeight / 2 - legendHeight / 2);
                        break;
                    case "top":
                        x = mfloor((chartX + chartBBox.width) / 2 - legendWidth / 2) - 7;
                        y = insets;
                        break;
                    case "bottom":
                        x = mfloor(chartX + chartWidth / 2 - legendWidth / 2);
                        y = mfloor(surface.height - legendHeight) - insets;
                        break;
                    default:
                        x = mfloor(me.origX) + insets;
                        y = mfloor(me.origY) + insets;
                }
                me.x = x;
                me.y = y;

                // Update the position of each item
                Ext.each(me.items, function(item) {
                    item.updatePosition();
                });
                // Update the position of the outer box
                me.boxSprite.setAttributes(me.getBBox(), true);
            }
        }
    });

    Ext.override(Ext.chart.LegendItem, {
        createLegend: function(config) {
            var me = this,
                index = config.yFieldIndex,
                series = me.series,
                seriesType = series.type,
                idx = me.yFieldIndex,
                legend = me.legend,
                surface = me.surface,
                refX = legend.x + me.x,
                refY = legend.y + me.y,
                bbox, z = me.zIndex,
                markerConfig, label, mask,
                radius, toggle = false,
                seriesStyle = Ext.apply(series.seriesStyle, series.style),
                labelMarkerSize = legend.labelMarkerSize || 10;

            function getSeriesProp(name) {
                var val = series[name];
                return (Ext.isArray(val) ? val[idx] : val);
            }

            label = me.add('label', surface.add({
                type: 'text',
                x: 30,
                y: 0,
                zIndex: z || 0,
                font: legend.labelFont,
                fill: legend.labelColor || '#000',
                text: getSeriesProp('title') || getSeriesProp('yField')
            }));

            if (seriesType === 'line' || seriesType === 'scatter') {
                if (seriesType === 'line') {
                    me.add('line', surface.add({
                        type: 'path',
                        path: 'M0.5,0.5L16.5,0.5',
                        zIndex: z,
                        "stroke-width": series.lineWidth,
                        "stroke-linejoin": "round",
                        "stroke-dasharray": series.dash,
                        stroke: seriesStyle.stroke || '#000',
                        style: {
                            cursor: 'pointer'
                        }
                    }));
                }
                if (series.showMarkers || seriesType === 'scatter') {
                    markerConfig = Ext.apply(series.markerStyle, series.markerConfig || {});
                    me.add('marker', Ext.chart.Shape[markerConfig.type](surface, {
                        fill: markerConfig.fill,
                        x: 8.5,
                        y: 0.5,
                        zIndex: z,
                        radius: markerConfig.radius || markerConfig.size,
                        style: {
                            cursor: 'pointer'
                        }
                    }));
                }
            }
            else {
                me.add('box', surface.add({
                    type: 'rect',
                    zIndex: z,
                    x: 6,
                    y: 0,
                    width: labelMarkerSize,
                    height: labelMarkerSize,
                    fill: series.getLegendColor(index),
                    style: {
                        cursor: 'pointer'
                    }
                }));
            }

            me.setAttributes({
                hidden: false
            }, true);

            bbox = me.getBBox();

            mask = me.add('mask', surface.add({
                type: 'rect',
                x: bbox.x,
                y: bbox.y,
                width: bbox.width || 20,
                height: bbox.height || 20,
                zIndex: (z || 0) + 1000,
                fill: '#f00',
                opacity: 0,
                style: {
                    'cursor': 'pointer'
                }
            }));


            me.on('mouseover', function() {
                label.setStyle({
                    'font-weight': 'bold'
                });
                mask.setStyle({
                    'cursor': 'pointer'
                });
                series._index = index;
                series.highlightItem();
            }, me);

            me.on('mouseout', function() {
                label.setStyle({
                    'font-weight': 'normal'
                });
                series._index = index;
                series.unHighlightItem();
            }, me);

            if (!series.visibleInLegend(index)) {
                toggle = true;
                label.setAttributes({
                   opacity: 0.5
                }, true);
            }

            me.on('mousedown', function() {
                if (!toggle) {
                    series.hideAll();
                    label.setAttributes({
                        opacity: 0.5
                    }, true);
                } else {
                    series.showAll();
                    label.setAttributes({
                        opacity: 1
                    }, true);
                }
                toggle = !toggle;
            }, me);
            me.updatePosition({x:0, y:0});
        }
    });

    Ext.override(Ext.chart.axis.Axis, {
        drawHorizontalLabels: function() {
            var me = this,
                labelConf = me.label,
                floor = Math.floor,
                max = Math.max,
                axes = me.chart.axes,
                position = me.position,
                inflections = me.inflections,
                ln = inflections.length,
                labels = me.labels,
                labelGroup = me.labelGroup,
                maxHeight = 0,
                ratio,
                gutterY = me.chart.maxGutter[1],
                ubbox, bbox, point, prevX, prevLabel,
                projectedWidth = 0,
                textLabel, attr, textRight, text,
                label, last, x, y, i, firstLabel;

            last = ln - 1;
            // get a reference to the first text label dimensions
            point = inflections[0];
            firstLabel = me.getOrCreateLabel(0, me.label.renderer(labels[0]));
            ratio = Math.floor(Math.abs(Math.sin(labelConf.rotate && (labelConf.rotate.degrees * Math.PI / 180) || 0)));

            for (i = 0; i < ln; i++) {
                point = inflections[i];
                text = me.label.renderer(labels[i]) || '';
                textLabel = me.getOrCreateLabel(i, text);
                bbox = textLabel._bbox;
                maxHeight = max(maxHeight, bbox.height + me.dashSize + me.label.padding);
                x = floor(point[0] - (ratio? bbox.height : bbox.width) / 2);
                if (me.chart.maxGutter[0] == 0) {
                    if (i == 0 && axes.findIndex('position', 'left') == -1) {
                        x = point[0];
                    }
                    else if (i == last && axes.findIndex('position', 'right') == -1) {
                        x = point[0] - bbox.width;
                    }
                }
                if (position == 'top') {
                    y = point[1] - (me.dashSize * 2) - me.label.padding - (bbox.height / 2);
                }
                else {
                    y = point[1] + (me.dashSize * 2) + me.label.padding + (bbox.height / 2);
                }

                var moveLabels = labelConf.rotate && labelConf.rotate.degrees && !Ext.Array.contains([0,90,180,270,360], labelConf.rotate.degrees),
                    adjust = Math.floor((textLabel.text.length - 12) * -1 * 0.75),
                    newX = moveLabels ? point[0] - textLabel._bbox.width + adjust: x;

                textLabel.setAttributes({
                    hidden: false,
                    x: newX,
                    y: y
                }, true);

                // skip label if there isn't available minimum space
                if (i != 0 && (me.intersect(textLabel, prevLabel)
                    || me.intersect(textLabel, firstLabel))) {
                    textLabel.hide(true);
                    continue;
                }

                prevLabel = textLabel;
            }

            return maxHeight;
        }
    });

    Ext.override(Ext.chart.axis.Radial, {
        drawLabel: function() {
            var chart = this.chart,
                surface = chart.surface,
                bbox = chart.chartBBox,
                store = chart.store,
                centerX = bbox.x + (bbox.width / 2),
                centerY = bbox.y + (bbox.height / 2),
                rho = Math.min(bbox.width, bbox.height) /2,
                max = Math.max, round = Math.round,
                labelArray = [], label,
                fields = [], nfields,
                categories = [], xField,
                aggregate = !this.maximum,
                maxValue = this.maximum || 0,
                steps = this.steps, i = 0, j, dx, dy,
                pi2 = Math.PI * 2,
                cos = Math.cos, sin = Math.sin,
                display = this.label.display,
                draw = display !== 'none',
                margin = 10,

                labelColor = '#333',
                labelFont = 'normal 9px sans-serif',
                seriesStyle = chart.seriesStyle;

            labelColor = seriesStyle ? seriesStyle.labelColor : labelColor;
            labelFont = seriesStyle ? seriesStyle.labelFont : labelFont;

            if (!draw) {
                return;
            }

            //get all rendered fields
            chart.series.each(function(series) {
                fields.push(series.yField);
                xField = series.xField;
            });

            //get maxValue to interpolate
            store.each(function(record, i) {
                if (aggregate) {
                    for (i = 0, nfields = fields.length; i < nfields; i++) {
                        maxValue = max(+record.get(fields[i]), maxValue);
                    }
                }
                categories.push(record.get(xField));
            });
            if (!this.labelArray) {
                if (display != 'categories') {
                    //draw scale
                    for (i = 1; i <= steps; i++) {
                        label = surface.add({
                            type: 'text',
                            text: round(i / steps * maxValue),
                            x: centerX,
                            y: centerY - rho * i / steps,
                            'text-anchor': 'middle',
                            'stroke-width': 0.1,
                            stroke: '#333',
                            fill: labelColor,
                            font: labelFont
                        });
                        label.setAttributes({
                            hidden: false
                        }, true);
                        labelArray.push(label);
                    }
                }
                if (display != 'scale') {
                    //draw text
                    for (j = 0, steps = categories.length; j < steps; j++) {
                        dx = cos(j / steps * pi2) * (rho + margin);
                        dy = sin(j / steps * pi2) * (rho + margin);
                        label = surface.add({
                            type: 'text',
                            text: categories[j],
                            x: centerX + dx,
                            y: centerY + dy,
                            'text-anchor': dx * dx <= 0.001? 'middle' : (dx < 0? 'end' : 'start'),
                            fill: labelColor,
                            font: labelFont
                        });
                        label.setAttributes({
                            hidden: false
                        }, true);
                        labelArray.push(label);
                    }
                }
            }
            else {
                labelArray = this.labelArray;
                if (display != 'categories') {
                    //draw values
                    for (i = 0; i < steps; i++) {
                        labelArray[i].setAttributes({
                            text: round((i + 1) / steps * maxValue),
                            x: centerX,
                            y: centerY - rho * (i + 1) / steps,
                            'text-anchor': 'middle',
                            'stroke-width': 0.1,
                            stroke: '#333',
                            fill: labelColor,
                            font: labelFont
                        }, true);
                    }
                }
                if (display != 'scale') {
                    //draw text
                    for (j = 0, steps = categories.length; j < steps; j++) {
                        dx = cos(j / steps * pi2) * (rho + margin);
                        dy = sin(j / steps * pi2) * (rho + margin);
                        if (labelArray[i + j]) {
                            labelArray[i + j].setAttributes({
                                type: 'text',
                                text: categories[j],
                                x: centerX + dx,
                                y: centerY + dy,
                                'text-anchor': dx * dx <= 0.001? 'middle' : (dx < 0? 'end' : 'start'),
                                fill: labelColor,
                                font: labelFont
                            }, true);
                        }
                    }
                }
            }
            this.labelArray = labelArray;
        }
    });

	// namespace
	DV = {};

	DV.instances = [];
	DV.i18n = {};
	DV.isDebug = false;
	DV.isSessionStorage = ('sessionStorage' in window && window['sessionStorage'] !== null);

	DV.getCore = function(ns) {
        var init = ns.init,
            conf = {},
            api = {},
            support = {},
            service = {},
            web = {},
            dimConf;

		// conf
        (function() {
            conf.finals = {
                ajax: {
					path_module: '/dhis-web-visualizer/',
					path_api: '/api/',
					path_commons: '/dhis-web-commons-ajax-json/',
                    data_get: 'chartValues.json',
                    indicator_get: 'indicatorGroups/',
                    indicator_getall: 'indicators.json?paging=false&links=false',
                    indicatorgroup_get: 'indicatorGroups.json?paging=false&links=false',
                    dataelement_get: 'dataElementGroups/',
                    dataelement_getall: 'dataElements.json?domainType=aggregate&paging=false&links=false',
                    dataelementgroup_get: 'dataElementGroups.json?paging=false&links=false',
                    dataset_get: 'dataSets.json?paging=false&links=false'
                },
                dimension: {
                    data: {
                        value: 'data',
                        name: DV.i18n.data,
                        dimensionName: 'dx',
                        objectName: 'dx'
                    },
                    indicator: {
                        value: 'indicator',
                        name: DV.i18n.indicator,
                        dimensionName: 'dx',
                        objectName: 'in'
                    },
                    dataElement: {
                        value: 'dataelement',
                        name: DV.i18n.data_element,
                        dimensionName: 'dx',
                        objectName: 'de'
                    },
                    operand: {
                        value: 'operand',
                        name: 'Operand',
                        dimensionName: 'dx',
                        objectName: 'dc'
                    },
                    dataSet: {
                        value: 'dataset',
                        name: DV.i18n.dataset,
                        dimensionName: 'dx',
                        objectName: 'ds'
                    },
                    category: {
                        name: DV.i18n.assigned_categories,
                        dimensionName: 'co',
                        objectName: 'co',
                    },
                    period: {
                        value: 'period',
                        name: DV.i18n.period,
                        dimensionName: 'pe',
                        objectName: 'pe',
                    },
                    fixedPeriod: {
                        value: 'periods'
                    },
                    relativePeriod: {
                        value: 'relativePeriods'
                    },
                    organisationUnit: {
                        value: 'organisationUnits',
                        name: DV.i18n.organisation_units,
                        dimensionName: 'ou',
                        objectName: 'ou',
                    },
                    dimension: {
                        value: 'dimension'
                        //objectName: 'di'
                    },
                    value: {
                        value: 'value'
                    }
                },
                chart: {
                    series: 'series',
                    category: 'category',
                    filter: 'filter',
                    column: 'column',
                    stackedcolumn: 'stackedcolumn',
                    bar: 'bar',
                    stackedbar: 'stackedbar',
                    line: 'line',
                    area: 'area',
                    pie: 'pie',
                    radar: 'radar',
                    gauge: 'gauge'
                },
                data: {
                    domain: 'domain_',
                    targetLine: 'targetline_',
                    baseLine: 'baseline_',
                    trendLine: 'trendline_'
                },
                image: {
                    png: 'png',
                    pdf: 'pdf'
                },
                cmd: {
                    init: 'init_',
                    none: 'none_',
                    urlparam: 'id'
                },
                root: {
                    id: 'root'
                }
            };

            dimConf = conf.finals.dimension;

            dimConf.objectNameMap = {};
            dimConf.objectNameMap[dimConf.data.objectName] = dimConf.data;
            dimConf.objectNameMap[dimConf.indicator.objectName] = dimConf.indicator;
            dimConf.objectNameMap[dimConf.dataElement.objectName] = dimConf.dataElement;
            dimConf.objectNameMap[dimConf.operand.objectName] = dimConf.operand;
            dimConf.objectNameMap[dimConf.dataSet.objectName] = dimConf.dataSet;
            dimConf.objectNameMap[dimConf.category.objectName] = dimConf.category;
            dimConf.objectNameMap[dimConf.period.objectName] = dimConf.period;
            dimConf.objectNameMap[dimConf.organisationUnit.objectName] = dimConf.organisationUnit;
            dimConf.objectNameMap[dimConf.dimension.objectName] = dimConf.dimension;

			conf.period = {
				periodTypes: [
					{id: 'Daily', name: DV.i18n.daily},
					{id: 'Weekly', name: DV.i18n.weekly},
					{id: 'Monthly', name: DV.i18n.monthly},
					{id: 'BiMonthly', name: DV.i18n.bimonthly},
					{id: 'Quarterly', name: DV.i18n.quarterly},
					{id: 'SixMonthly', name: DV.i18n.sixmonthly},
					{id: 'SixMonthlyApril', name: DV.i18n.sixmonthly_april},
					{id: 'Yearly', name: DV.i18n.yearly},
					{id: 'FinancialOct', name: DV.i18n.financial_oct},
					{id: 'FinancialJuly', name: DV.i18n.financial_july},
					{id: 'FinancialApril', name: DV.i18n.financial_april}
				]
			};

            conf.layout = {
                west_width: 424,
                west_fieldset_width: 418,
                west_width_padding: 2,
                west_fill: 2,
                west_fill_accordion_indicator: 56,
                west_fill_accordion_dataelement: 59,
                west_fill_accordion_dataset: 31,
                west_fill_accordion_period: 303,
                west_fill_accordion_organisationunit: 58,
                west_maxheight_accordion_indicator: 350,
                west_maxheight_accordion_dataelement: 350,
                west_maxheight_accordion_dataset: 350,
                west_maxheight_accordion_period: 513,
                west_maxheight_accordion_organisationunit: 500,
                west_maxheight_accordion_group: 350,
                west_scrollbarheight_accordion_indicator: 300,
                west_scrollbarheight_accordion_dataelement: 300,
                west_scrollbarheight_accordion_dataset: 300,
                west_scrollbarheight_accordion_period: 450,
                west_scrollbarheight_accordion_organisationunit: 450,
                west_scrollbarheight_accordion_group: 300,
                east_tbar_height: 31,
                east_gridcolumn_height: 30,
                form_label_width: 55,
                window_favorite_ypos: 100,
                window_confirm_width: 250,
                window_share_width: 500,
                grid_favorite_width: 420,
                grid_row_height: 27,
                treepanel_minheight: 135,
                treepanel_maxheight: 400,
                treepanel_fill_default: 310,
                treepanel_toolbar_menu_width_group: 140,
                treepanel_toolbar_menu_width_level: 120,
                multiselect_minheight: 100,
                multiselect_maxheight: 250,
                multiselect_fill_default: 345,
                multiselect_fill_reportingrates: 315
            };

            conf.chart = {
                style: {
                    inset: 30,
                    fontFamily: 'Arial,Sans-serif,Roboto,Helvetica,Consolas'
                },
                theme: {
                    dv1: ['#94ae0a', '#1d5991', '#a61120', '#ff8809', '#7c7474', '#a61187', '#ffd13e', '#24ad9a', '#a66111', '#414141', '#4500c4', '#1d5700']
                }
            };

            conf.status = {
                icon: {
                    error: 'error_s.png',
                    warning: 'warning.png',
                    ok: 'ok.png'
                }
            };

			conf.report = {
				digitGroupSeparator: {
					'comma': ',',
					'space': ' '
				}
			};

            conf.url = {
                analysisFields: [
                    '*',
                    'program[id,name]',
                    'programStage[id,name]',
                    'columns[dimension,filter,items[id,' + init.namePropertyUrl + ']]',
                    'rows[dimension,filter,items[id,' + init.namePropertyUrl + ']]',
                    'filters[dimension,filter,items[id,' + init.namePropertyUrl + ']]',
                    '!lastUpdated',
                    '!href',
                    '!created',
                    '!publicAccess',
                    '!rewindRelativePeriods',
                    '!userOrganisationUnit',
                    '!userOrganisationUnitChildren',
                    '!userOrganisationUnitGrandChildren',
                    '!externalAccess',
                    '!access',
                    '!relativePeriods',
                    '!columnDimensions',
                    '!rowDimensions',
                    '!filterDimensions',
                    '!user',
                    '!organisationUnitGroups',
                    '!itemOrganisationUnitGroups',
                    '!userGroupAccesses',
                    '!indicators',
                    '!dataElements',
                    '!dataElementOperands',
                    '!dataElementGroups',
                    '!dataSets',
                    '!periods',
                    '!organisationUnitLevels',
                    '!organisationUnits'
                ]
            };
        }());

        // api
        (function() {
            api.layout = {};

			api.layout.Record = function(config) {
				var config = Ext.clone(config);

				// id: string

				return function() {
					if (!Ext.isObject(config)) {
						ns.alert('Record: config is not an object: ' + config, true);
						return;
					}

					if (!Ext.isString(config.id)) {
						ns.alert('Record: id is not text: ' + config, true);
						return;
					}

					config.id = config.id.replace('.', '#');

					return config;
				}();
			};

            api.layout.Dimension = function(config) {
				var config = Ext.clone(config);

				// dimension: string

				// items: [Record]

				return function() {
					if (!Ext.isObject(config)) {
						console.log('Dimension: config is not an object: ' + config);
						return;
					}

					if (!Ext.isString(config.dimension)) {
						console.log('Dimension: name is not a string: ' + config);
						return;
					}

					if (config.dimension !== conf.finals.dimension.category.objectName) {
						var records = [];

						if (!Ext.isArray(config.items)) {
							console.log('Dimension: items is not an array: ' + config);
							return;
						}

						for (var i = 0; i < config.items.length; i++) {
							records.push(api.layout.Record(config.items[i]));
						}

						config.items = Ext.Array.clean(records);

						if (!config.items.length) {
							console.log('Dimension: has no valid items: ' + config);
							return;
						}
					}

					return config;
				}();
			};

            api.layout.Layout = function(config, applyConfig) {
				var config = Ext.clone(config),
					layout = {},
					getValidatedDimensionArray,
					validateSpecialCases;

                // type: string ('column') - 'column', 'stackedcolumn', 'bar', 'stackedbar', 'line', 'area', 'pie'

                // columns: [Dimension]

                // rows: [Dimension]

                // filters: [Dimension]

                // showTrendLine: boolean (false)

                // targetLineValue: number

                // targetLineTitle: string

                // baseLineValue: number

                // baseLineTitle: string

                // sortOrder: number

                // aggregationType: string ('DEFAULT') - 'DEFAULT', 'COUNT', 'SUM', 'STDDEV', 'VARIANCE', 'MIN', 'MAX'

                // rangeAxisMaxValue: number

                // rangeAxisMinValue: number

                // rangeAxisSteps: number

                // rangeAxisDecimals: number

                // showValues: boolean (true)

                // hideEmptyRows: boolean (false)

                // hideLegend: boolean (false)

                // hideTitle: boolean (false)

                // domainAxisTitle: string

                // rangeAxisTitle: string

                // userOrganisationUnit: boolean (false)

                // userOrganisationUnitChildren: boolean (false)

                // parentGraphMap: object

                // displayProperty: string ('name') // 'name', 'shortname', null

                getValidatedDimensionArray = function(dimensionArray) {
					var dimensionArray = Ext.clone(dimensionArray);

					if (!(dimensionArray && Ext.isArray(dimensionArray) && dimensionArray.length)) {
						return;
					}

					for (var i = 0; i < dimensionArray.length; i++) {
						dimensionArray[i] = api.layout.Dimension(dimensionArray[i]);
					}

					dimensionArray = Ext.Array.clean(dimensionArray);

					return dimensionArray.length ? dimensionArray : null;
				};

				analytical2layout = function(analytical) {
					var layoutConfig = Ext.clone(analytical),
						co = dimConf.category.objectName;

					analytical = Ext.clone(analytical);

					layoutConfig.columns = [];
					layoutConfig.rows = [];
					layoutConfig.filters = layoutConfig.filters || [];

					// Series
					if (Ext.isArray(analytical.columns) && analytical.columns.length) {
						analytical.columns.reverse();

						for (var i = 0, dim; i < analytical.columns.length; i++) {
							dim = analytical.columns[i];

							if (dim.dimension === co) {
								continue;
							}

							if (!layoutConfig.columns.length) {
								layoutConfig.columns.push(dim);
							}
							else {

								// indicators cannot be set as filter
								if (dim.dimension === dimConf.indicator.objectName) {
									layoutConfig.filters.push(layoutConfig.columns.pop());
									layoutConfig.columns = [dim];
								}
								else {
									layoutConfig.filters.push(dim);
								}
							}
						}
					}

					// Rows
					if (Ext.isArray(analytical.rows) && analytical.rows.length) {
						analytical.rows.reverse();

						for (var i = 0, dim; i < analytical.rows.length; i++) {
							dim = analytical.rows[i];

							if (dim.dimension === co) {
								continue;
							}

							if (!layoutConfig.rows.length) {
								layoutConfig.rows.push(dim);
							}
							else {

								// indicators cannot be set as filter
								if (dim.dimension === dimConf.indicator.objectName) {
									layoutConfig.filters.push(layoutConfig.rows.pop());
									layoutConfig.rows = [dim];
								}
								else {
									layoutConfig.filters.push(dim);
								}
							}
						}
					}

					return layoutConfig;
				};

				validateSpecialCases = function() {
					var dimConf = conf.finals.dimension,
						dimensions,
						objectNameDimensionMap = {};

					if (!layout) {
						return;
					}

					dimensions = Ext.Array.clean([].concat(layout.columns || [], layout.rows || [], layout.filters || []));

					for (var i = 0; i < dimensions.length; i++) {
						objectNameDimensionMap[dimensions[i].dimension] = dimensions[i];
					}

					if (layout.filters && layout.filters.length) {
						for (var i = 0; i < layout.filters.length; i++) {

							// Indicators as filter
							if (layout.filters[i].dimension === dimConf.indicator.objectName) {
								ns.alert(DV.i18n.indicators_cannot_be_specified_as_filter || 'Indicators cannot be specified as filter', true);
								return;
							}

							// Categories as filter
							if (layout.filters[i].dimension === dimConf.category.objectName) {
								ns.alert(DV.i18n.categories_cannot_be_specified_as_filter || 'Categories cannot be specified as filter', true);
								return;
							}

							// Data sets as filter
							if (layout.filters[i].dimension === dimConf.dataSet.objectName) {
								ns.alert(DV.i18n.data_sets_cannot_be_specified_as_filter || 'Data sets cannot be specified as filter', true);
								return;
							}
						}
					}

					// dc and in
					if (objectNameDimensionMap[dimConf.operand.objectName] && objectNameDimensionMap[dimConf.indicator.objectName]) {
						ns.alert('Indicators and detailed data elements cannot be specified together', true);
						return;
					}

					// dc and de
					if (objectNameDimensionMap[dimConf.operand.objectName] && objectNameDimensionMap[dimConf.dataElement.objectName]) {
						ns.alert('Detailed data elements and totals cannot be specified together', true);
						return;
					}

					// dc and ds
					if (objectNameDimensionMap[dimConf.operand.objectName] && objectNameDimensionMap[dimConf.dataSet.objectName]) {
						ns.alert('Data sets and detailed data elements cannot be specified together', true);
						return;
					}

					// dc and co
					if (objectNameDimensionMap[dimConf.operand.objectName] && objectNameDimensionMap[dimConf.category.objectName]) {
						ns.alert('Categories and detailed data elements cannot be specified together', true);
						return;
					}

                    // in and aggregation type
                    if (objectNameDimensionMap[dimConf.indicator.objectName] && config.aggregationType !== 'DEFAULT') {
                        ns.alert('Indicators and aggregation types cannot be specified together', true);
                        return;
                    }

					return true;
				};

                return function() {
                    var objectNames = [],
						dimConf = conf.finals.dimension;

					// config must be an object
					if (!(config && Ext.isObject(config))) {
						ns.alert('Layout: config is not an object (' + init.el + ')', true);
						return;
					}

                    config.columns = getValidatedDimensionArray(config.columns);
                    config.rows = getValidatedDimensionArray(config.rows);
                    config.filters = getValidatedDimensionArray(config.filters);

					// at least one dimension specified as column and row
					if (!config.columns) {
						ns.alert('No series items selected');
						return;
					}

					if (!config.rows) {
						ns.alert('No category items selected');
						return;
					}

					// get object names
					for (var i = 0, dims = Ext.Array.clean([].concat(config.columns || [], config.rows || [], config.filters || [])); i < dims.length; i++) {

						// Object names
						if (api.layout.Dimension(dims[i])) {
							objectNames.push(dims[i].dimension);
						}
					}

					// at least one period
					if (!Ext.Array.contains(objectNames, dimConf.period.objectName)) {
						ns.alert('At least one period must be specified as series, category or filter');
						return;
					}

					// favorite
					if (config.id) {
						layout.id = config.id;
					}

					if (config.name) {
						layout.name = config.name;
					}

					// analytical2layout
					//config = analytical2layout(config);

                    // layout
                    layout.type = Ext.isString(config.type) ? config.type.toLowerCase() : conf.finals.chart.column;

                    layout.columns = config.columns;
                    layout.rows = config.rows;
                    layout.filters = config.filters;

                    // properties
                    layout.showValues = Ext.isBoolean(config.showData) ? config.showData : (Ext.isBoolean(config.showValues) ? config.showValues : true);
                    layout.hideEmptyRows = Ext.isBoolean(config.hideEmptyRows) ? config.hideEmptyRows : (Ext.isBoolean(config.hideEmptyRows) ? config.hideEmptyRows : true);
                    layout.showTrendLine = Ext.isBoolean(config.regression) ? config.regression : (Ext.isBoolean(config.showTrendLine) ? config.showTrendLine : false);
                    layout.targetLineValue = Ext.isNumber(config.targetLineValue) ? config.targetLineValue : null;
                    layout.targetLineTitle = Ext.isString(config.targetLineLabel) && !Ext.isEmpty(config.targetLineLabel) ? config.targetLineLabel :
                        (Ext.isString(config.targetLineTitle) && !Ext.isEmpty(config.targetLineTitle) ? config.targetLineTitle : null);
                    layout.baseLineValue = Ext.isNumber(config.baseLineValue) ? config.baseLineValue : null;
                    layout.baseLineTitle = Ext.isString(config.baseLineLabel) && !Ext.isEmpty(config.baseLineLabel) ? config.baseLineLabel :
                        (Ext.isString(config.baseLineTitle) && !Ext.isEmpty(config.baseLineTitle) ? config.baseLineTitle : null);
                    layout.sortOrder = Ext.isNumber(config.sortOrder) ? config.sortOrder : 0;
                    layout.aggregationType = Ext.isString(config.aggregationType) ? config.aggregationType : 'DEFAULT';

					layout.rangeAxisMaxValue = Ext.isNumber(config.rangeAxisMaxValue) ? config.rangeAxisMaxValue : null;
					layout.rangeAxisMinValue = Ext.isNumber(config.rangeAxisMinValue) ? config.rangeAxisMinValue : null;
					layout.rangeAxisSteps = Ext.isNumber(config.rangeAxisSteps) ? config.rangeAxisSteps : null;
					layout.rangeAxisDecimals = Ext.isNumber(config.rangeAxisDecimals) ? config.rangeAxisDecimals : null;
					layout.rangeAxisTitle = Ext.isString(config.rangeAxisLabel) && !Ext.isEmpty(config.rangeAxisLabel) ? config.rangeAxisLabel :
                        (Ext.isString(config.rangeAxisTitle) && !Ext.isEmpty(config.rangeAxisTitle) ? config.rangeAxisTitle : null);
					layout.domainAxisTitle = Ext.isString(config.domainAxisLabel) && !Ext.isEmpty(config.domainAxisLabel) ? config.domainAxisLabel :
                        (Ext.isString(config.domainAxisTitle) && !Ext.isEmpty(config.domainAxisTitle) ? config.domainAxisTitle : null);

                    layout.hideLegend = Ext.isBoolean(config.hideLegend) ? config.hideLegend : false;
                    layout.hideTitle = Ext.isBoolean(config.hideTitle) ? config.hideTitle : false;
                    layout.title = Ext.isString(config.title) &&  !Ext.isEmpty(config.title) ? config.title : null;

                    layout.parentGraphMap = Ext.isObject(config.parentGraphMap) ? config.parentGraphMap : null;

                    if (Ext.isString(config.displayProperty)) {
                        layout.displayProperty = config.displayProperty;
                    }

                    // style
                    if (Ext.isObject(config.domainAxisStyle)) {
                        layout.domainAxisStyle = config.domainAxisStyle;
                    }

                    if (Ext.isObject(config.rangeAxisStyle)) {
                        layout.rangeAxisStyle = config.rangeAxisStyle;
                    }

                    if (Ext.isObject(config.legendStyle)) {
                        layout.legendStyle = config.legendStyle;
                    }

                    if (Ext.isObject(config.seriesStyle)) {
                        layout.seriesStyle = config.seriesStyle;
                    }

					if (!validateSpecialCases()) {
						return;
					}

					return Ext.apply(layout, applyConfig);
                }();
            };

            api.response = {};

            api.response.Header = function(config) {
				var config = Ext.clone(config);

				// name: string

				// meta: boolean

				return function() {
					if (!Ext.isObject(config)) {
						console.log('Header: config is not an object: ' + config);
						return;
					}

					if (!Ext.isString(config.name)) {
						console.log('Header: name is not a string: ' + config);
						return;
					}

					if (!Ext.isBoolean(config.meta)) {
						console.log('Header: meta is not boolean: ' + config);
						return;
					}

					return config;
				}();
			};

            api.response.Response = function(config) {
				var config = Ext.clone(config);

				// headers: [Header]

				return function() {
					if (!(config && Ext.isObject(config))) {
						console.log('Response: config is not an object');
						return;
					}

					if (!(config.headers && Ext.isArray(config.headers))) {
						console.log('Response: headers is not an array');
						return;
					}

					for (var i = 0, header; i < config.headers.length; i++) {
						config.headers[i] = api.response.Header(config.headers[i]);
					}

					config.headers = Ext.Array.clean(config.headers);

					if (!config.headers.length) {
						console.log('Response: no valid headers');
						return;
					}

					if (!(Ext.isArray(config.rows) && config.rows.length > 0)) {
                        //console.log('No values found');
						//return;
					}

					if (config.rows.length && config.headers.length !== config.rows[0].length) {
						console.log('Response: headers.length !== rows[0].length');
					}

					return config;
				}();
			};
        }());

		// support
		(function() {

			// prototype
			support.prototype = {};

				// array
			support.prototype.array = {};

			support.prototype.array.getLength = function(array, suppressWarning) {
				if (!Ext.isArray(array)) {
					if (!suppressWarning) {
						console.log('support.prototype.array.getLength: not an array');
					}

					return null;
				}

				return array.length;
			};

            support.prototype.array.getMaxLength = function(array, suppressWarning) {
				if (!Ext.isArray(array)) {
					if (!suppressWarning) {
						console.log('support.prototype.array.getLength: not an array');
					}

					return null;
				}

                var maxLength = 0;

                for (var i = 0; i < array.length; i++) {
                    if (Ext.isString(array[i]) && array[i].length > maxLength) {
                        maxLength = array[i].length;
                    }
                }

                return maxLength;
            };

			support.prototype.array.sort = function(array, direction, key, emptyFirst) {
				// supports [number], [string], [{key: number}], [{key: string}], [[string]], [[number]]

				if (!support.prototype.array.getLength(array)) {
					return;
				}

				key = !!key || Ext.isNumber(key) ? key : 'name';

				array.sort( function(a, b) {

					// if object, get the property values
					if (Ext.isObject(a) && Ext.isObject(b)) {
						a = a[key];
						b = b[key];
					}

					// if array, get from the right index
					if (Ext.isArray(a) && Ext.isArray(b)) {
						a = a[key];
						b = b[key];
					}

					// string
					if (Ext.isString(a) && Ext.isString(b)) {
						a = a.toLowerCase();
						b = b.toLowerCase();

						if (direction === 'DESC') {
							return a < b ? 1 : (a > b ? -1 : 0);
						}
						else {
							return a < b ? -1 : (a > b ? 1 : 0);
						}
					}

					// number
					else if (Ext.isNumber(a) && Ext.isNumber(b)) {
						return direction === 'DESC' ? b - a : a - b;
					}

                    else if (a === undefined || a === null) {
                        return emptyFirst ? -1 : 1;
                    }

                    else if (b === undefined || b === null) {
                        return emptyFirst ? 1 : -1;
                    }

					return -1;
				});

				return array;
			};

				// object
			support.prototype.object = {};

			support.prototype.object.getLength = function(object, suppressWarning) {
				if (!Ext.isObject(object)) {
					if (!suppressWarning) {
						console.log('support.prototype.object.getLength: not an object');
					}

					return null;
				}

				var size = 0;

				for (var key in object) {
					if (object.hasOwnProperty(key)) {
						size++;
					}
				}

				return size;
			};

			support.prototype.object.hasObject = function(object, property, value) {
				if (!support.prototype.object.getLength(object)) {
					return null;
				}

				for (var key in object) {
					var record = object[key];

					if (object.hasOwnProperty(key) && record[property] === value) {
						return true;
					}
				}

				return null;
			};

                // number
			support.prototype.number = {};
                        
			support.prototype.number.prettyPrint = function(number, separator) {
				separator = separator || 'space';

                if (!(Ext.isNumber(number) || Ext.isString(number))) {
                    return;
                }

				if (separator === 'none') {
					return number;
				}

				return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, conf.report.digitGroupSeparator[separator]);
			};

				// str
			support.prototype.str = {};

			support.prototype.str.replaceAll = function(variable, find, replace) {
                if (Ext.isString(variable)) {
                    variable = variable.split(find).join(replace);
                }
                else if (Ext.isArray(variable)) {
                    for (var i = 0; i < variable.length; i++) {
                        variable[i] = variable[i].split(find).join(replace);
                    }
                }

                return variable;
			};
		}());

		// service
		(function() {

			// layout
			service.layout = {};

			service.layout.cleanDimensionArray = function(dimensionArray) {
				if (!support.prototype.array.getLength(dimensionArray)) {
					return null;
				}

				var array = [];

				for (var i = 0; i < dimensionArray.length; i++) {
					array.push(api.layout.Dimension(dimensionArray[i]));
				}

				array = Ext.Array.clean(array);

				return array.length ? array : null;
			};

			service.layout.sortDimensionArray = function(dimensionArray, key) {
				if (!support.prototype.array.getLength(dimensionArray, true)) {
					return null;
				}

				// Clean dimension array
				dimensionArray = service.layout.cleanDimensionArray(dimensionArray);

				if (!dimensionArray) {
					console.log('service.layout.sortDimensionArray: no valid dimensions');
					return null;
				}

				key = key || 'dimensionName';

				// Dimension order
				Ext.Array.sort(dimensionArray, function(a,b) {
					if (a[key] < b[key]) {
						return -1;
					}
					if (a[key] > b[key]) {
						return 1;
					}
					return 0;
				});

				// Sort object items, ids
				for (var i = 0, items; i < dimensionArray.length; i++) {
					support.prototype.array.sort(dimensionArray[i].items, 'ASC', 'id');

					if (support.prototype.array.getLength(dimensionArray[i].ids)) {
						support.prototype.array.sort(dimensionArray[i].ids);
					}
				}

				return dimensionArray;
			};

			service.layout.getObjectNameDimensionMapFromDimensionArray = function(dimensionArray) {
				var map = {};

				if (!support.prototype.array.getLength(dimensionArray)) {
					return null;
				}

				for (var i = 0, dimension; i < dimensionArray.length; i++) {
					dimension = api.layout.Dimension(dimensionArray[i]);

					if (dimension) {
						map[dimension.dimension] = dimension;
					}
				}

				return support.prototype.object.getLength(map) ? map : null;
			};

			service.layout.getObjectNameDimensionItemsMapFromDimensionArray = function(dimensionArray) {
				var map = {};

				if (!support.prototype.array.getLength(dimensionArray)) {
					return null;
				}

				for (var i = 0, dimension; i < dimensionArray.length; i++) {
					dimension = api.layout.Dimension(dimensionArray[i]);

					if (dimension) {
						map[dimension.dimension] = dimension.items;
					}
				}

				return support.prototype.object.getLength(map) ? map : null;
			};

			service.layout.getExtendedLayout = function(layout) {
				var layout = Ext.clone(layout),
					xLayout;

				xLayout = {
					columns: [],
					rows: [],
					filters: [],

					columnObjectNames: [],
					columnDimensionNames: [],
					rowObjectNames: [],
					rowDimensionNames: [],

					// axis
					axisDimensions: [],
					axisObjectNames: [],
					axisDimensionNames: [],

						// for param string
					sortedAxisDimensionNames: [],

					// Filter
					filterDimensions: [],
					filterObjectNames: [],
					filterDimensionNames: [],

						// for param string
					sortedFilterDimensions: [],

					// all
					dimensions: [],
					objectNames: [],
					dimensionNames: [],

					// oject name maps
					objectNameDimensionsMap: {},
					objectNameItemsMap: {},
					objectNameIdsMap: {},

					// dimension name maps
					dimensionNameDimensionsMap: {},
					dimensionNameItemsMap: {},
					dimensionNameIdsMap: {},

						// for param string
					dimensionNameSortedIdsMap: {},

					// sort table by column
					//sortableIdObjects: []

                    dimensionNameAxisMap: {}
				};

				Ext.applyIf(xLayout, layout);

				// columns, rows, filters
				if (layout.columns) {
					for (var i = 0, dim, items, xDim; i < layout.columns.length; i++) {
						dim = layout.columns[i];
						items = dim.items;
						xDim = {};

						xDim.dimension = dim.dimension;
						xDim.objectName = dim.dimension;
						xDim.dimensionName = dimConf.objectNameMap[dim.dimension].dimensionName;

						if (items) {
							xDim.items = items;
							xDim.ids = [];

							for (var j = 0; j < items.length; j++) {
								xDim.ids.push(items[j].id);
							}
						}

						xLayout.columns.push(xDim);

						xLayout.columnObjectNames.push(xDim.objectName);
						xLayout.columnDimensionNames.push(xDim.dimensionName);

						xLayout.axisDimensions.push(xDim);
						xLayout.axisObjectNames.push(xDim.objectName);
						xLayout.axisDimensionNames.push(dimConf.objectNameMap[xDim.objectName].dimensionName);

						xLayout.objectNameDimensionsMap[xDim.objectName] = xDim;
						xLayout.objectNameItemsMap[xDim.objectName] = xDim.items;
						xLayout.objectNameIdsMap[xDim.objectName] = xDim.ids;

                        xLayout.dimensionNameAxisMap[xDim.dimensionName] = xLayout.columns;
					}
				}

				if (layout.rows) {
					for (var i = 0, dim, items, xDim; i < layout.rows.length; i++) {
						dim = Ext.clone(layout.rows[i]);
						items = dim.items;
						xDim = {};

						xDim.dimension = dim.dimension;
						xDim.objectName = dim.dimension;
						xDim.dimensionName = dimConf.objectNameMap[dim.dimension].dimensionName;

						if (items) {
							xDim.items = items;
							xDim.ids = [];

							for (var j = 0; j < items.length; j++) {
								xDim.ids.push(items[j].id);
							}
						}

						xLayout.rows.push(xDim);

						xLayout.rowObjectNames.push(xDim.objectName);
						xLayout.rowDimensionNames.push(xDim.dimensionName);

						xLayout.axisDimensions.push(xDim);
						xLayout.axisObjectNames.push(xDim.objectName);
						xLayout.axisDimensionNames.push(dimConf.objectNameMap[xDim.objectName].dimensionName);

						xLayout.objectNameDimensionsMap[xDim.objectName] = xDim;
						xLayout.objectNameItemsMap[xDim.objectName] = xDim.items;
						xLayout.objectNameIdsMap[xDim.objectName] = xDim.ids;

                        xLayout.dimensionNameAxisMap[xDim.dimensionName] = xLayout.rows;
					}
				}

				if (layout.filters) {
					for (var i = 0, dim, items, xDim; i < layout.filters.length; i++) {
						dim = layout.filters[i];
						items = dim.items;
						xDim = {};

						xDim.dimension = dim.dimension;
						xDim.objectName = dim.dimension;
						xDim.dimensionName = dimConf.objectNameMap[dim.dimension].dimensionName;

						if (items) {
							xDim.items = items;
							xDim.ids = [];

							for (var j = 0; j < items.length; j++) {
								xDim.ids.push(items[j].id);
							}
						}

						xLayout.filters.push(xDim);

						xLayout.filterDimensions.push(xDim);
						xLayout.filterObjectNames.push(xDim.objectName);
						xLayout.filterDimensionNames.push(dimConf.objectNameMap[xDim.objectName].dimensionName);

						xLayout.objectNameDimensionsMap[xDim.objectName] = xDim;
						xLayout.objectNameItemsMap[xDim.objectName] = xDim.items;
						xLayout.objectNameIdsMap[xDim.objectName] = xDim.ids;

                        xLayout.dimensionNameAxisMap[xDim.dimensionName] = xLayout.filters;
					}
				}

				// legend set
				xLayout.legendSet = layout.legendSet ? init.idLegendSetMap[layout.legendSet.id] : null;

				if (layout.legendSet && layout.legendSet.legends) {
					xLayout.legendSet = init.idLegendSetMap[layout.legendSet.id];
					support.prototype.array.sort(xLayout.legendSet.legends, 'ASC', 'startValue');
				}

				// unique dimension names
				xLayout.axisDimensionNames = Ext.Array.unique(xLayout.axisDimensionNames);
				xLayout.filterDimensionNames = Ext.Array.unique(xLayout.filterDimensionNames);

				xLayout.columnDimensionNames = Ext.Array.unique(xLayout.columnDimensionNames);
				xLayout.rowDimensionNames = Ext.Array.unique(xLayout.rowDimensionNames);
				xLayout.filterDimensionNames = Ext.Array.unique(xLayout.filterDimensionNames);

					// for param string
				xLayout.sortedAxisDimensionNames = Ext.clone(xLayout.axisDimensionNames).sort();
				xLayout.sortedFilterDimensions = service.layout.sortDimensionArray(Ext.clone(xLayout.filterDimensions));

				// all
				xLayout.dimensions = [].concat(xLayout.axisDimensions, xLayout.filterDimensions);
				xLayout.objectNames = [].concat(xLayout.axisObjectNames, xLayout.filterObjectNames);
				xLayout.dimensionNames = [].concat(xLayout.axisDimensionNames, xLayout.filterDimensionNames);

				// dimension name maps
				for (var i = 0, dimName; i < xLayout.dimensionNames.length; i++) {
					dimName = xLayout.dimensionNames[i];

					xLayout.dimensionNameDimensionsMap[dimName] = [];
					xLayout.dimensionNameItemsMap[dimName] = [];
					xLayout.dimensionNameIdsMap[dimName] = [];
				}

				for (var i = 0, xDim; i < xLayout.dimensions.length; i++) {
					xDim = xLayout.dimensions[i];

					xLayout.dimensionNameDimensionsMap[xDim.dimensionName].push(xDim);
					xLayout.dimensionNameItemsMap[xDim.dimensionName] = xLayout.dimensionNameItemsMap[xDim.dimensionName].concat(xDim.items);
					xLayout.dimensionNameIdsMap[xDim.dimensionName] = xLayout.dimensionNameIdsMap[xDim.dimensionName].concat(xDim.ids);
				}

					// for param string
				for (var key in xLayout.dimensionNameIdsMap) {
					if (xLayout.dimensionNameIdsMap.hasOwnProperty(key)) {
						xLayout.dimensionNameSortedIdsMap[key] = Ext.clone(xLayout.dimensionNameIdsMap[key]).sort();
					}
				}

				// Uuid
				xLayout.tableUuid = init.el + '_' + Ext.data.IdGenerator.get('uuid').generate();

				return xLayout;
			};

			service.layout.getSyncronizedXLayout = function(xLayout, response) {
				var dimensions = Ext.Array.clean([].concat(xLayout.columns || [], xLayout.rows || [], xLayout.filters || [])),
					xOuDimension = xLayout.objectNameDimensionsMap[dimConf.organisationUnit.objectName],
					isUserOrgunit = xOuDimension && Ext.Array.contains(xOuDimension.ids, 'USER_ORGUNIT'),
					isUserOrgunitChildren = xOuDimension && Ext.Array.contains(xOuDimension.ids, 'USER_ORGUNIT_CHILDREN'),
					isUserOrgunitGrandChildren = xOuDimension && Ext.Array.contains(xOuDimension.ids, 'USER_ORGUNIT_GRANDCHILDREN'),
					isLevel = function() {
						if (xOuDimension && Ext.isArray(xOuDimension.ids)) {
							for (var i = 0; i < xOuDimension.ids.length; i++) {
								if (xOuDimension.ids[i].substr(0,5) === 'LEVEL') {
									return true;
								}
							}
						}

						return false;
					}(),
					isGroup = function() {
						if (xOuDimension && Ext.isArray(xOuDimension.ids)) {
							for (var i = 0; i < xOuDimension.ids.length; i++) {
								if (xOuDimension.ids[i].substr(0,8) === 'OU_GROUP') {
									return true;
								}
							}
						}

						return false;
					}(),
					ou = dimConf.organisationUnit.objectName,
					layout;

				// Set items from init/metaData/xLayout
				for (var i = 0, dim, metaDataDim, items; i < dimensions.length; i++) {
					dim = dimensions[i];
					dim.items = [];
					metaDataDim = response.metaData[dim.objectName];

					// If ou and children
					if (dim.dimensionName === ou) {
						if (isUserOrgunit || isUserOrgunitChildren || isUserOrgunitGrandChildren) {
							var userOu,
								userOuc,
								userOugc;

							if (init.user && isUserOrgunit) {
								userOu = [];

								for (var j = 0; j < init.user.ou.length; j++) {
									userOu.push({
										id: init.user.ou[j],
										name: response.metaData.names[init.user.ou[j]]
									});
								}
							}
							if (init.user && init.user.ouc && isUserOrgunitChildren) {
								userOuc = [];

								for (var j = 0; j < init.user.ouc.length; j++) {
									userOuc.push({
										id: init.user.ouc[j],
										name: response.metaData.names[init.user.ouc[j]]
									});
								}

								support.prototype.array.sort(userOuc);
							}
							if (init.user && init.user.ouc && isUserOrgunitGrandChildren) {
								var userOuOuc = [].concat(init.user.ou, init.user.ouc),
									responseOu = response.metaData[ou];

								userOugc = [];

								for (var j = 0, id; j < responseOu.length; j++) {
									id = responseOu[j];

									if (!Ext.Array.contains(userOuOuc, id)) {
										userOugc.push({
											id: id,
											name: response.metaData.names[id]
										});
									}
								}

								support.prototype.array.sort(userOugc);
							}

							dim.items = [].concat(userOu || [], userOuc || [], userOugc || []);
						}
						else if (isLevel || isGroup) {
								for (var j = 0, responseOu = response.metaData[ou], id; j < responseOu.length; j++) {
									id = responseOu[j];

									dim.items.push({
										id: id,
										name: response.metaData.names[id]
									});
								}

								support.prototype.array.sort(dim.items);
							}
							else {
								dim.items = Ext.clone(xLayout.dimensionNameItemsMap[dim.dimensionName]);
							}
					}
					else {
						// Items: get ids from metadata -> items
						if (Ext.isArray(metaDataDim) && metaDataDim.length) {
							var ids = Ext.clone(response.metaData[dim.dimensionName]);
							for (var j = 0; j < ids.length; j++) {
								dim.items.push({
									id: ids[j],
									name: response.metaData.names[ids[j]]
								});
							}
						}
						// Items: get items from xLayout
						else {
							dim.items = Ext.clone(xLayout.objectNameItemsMap[dim.objectName]);
						}
					}
				}

				// Re-layout
				layout = api.layout.Layout(xLayout);

				if (layout) {
					dimensions = Ext.Array.clean([].concat(layout.columns || [], layout.rows || [], layout.filters || []));

					for (var i = 0, idNameMap = response.metaData.names, dimItems; i < dimensions.length; i++) {
						dimItems = dimensions[i].items;

						if (Ext.isArray(dimItems) && dimItems.length) {
							for (var j = 0, item; j < dimItems.length; j++) {
								item = dimItems[j];

								if (Ext.isObject(item) && Ext.isString(idNameMap[item.id]) && !Ext.isString(item.name)) {
									item.name = idNameMap[item.id] || '';
								}
							}
						}
					}

					return service.layout.getExtendedLayout(layout);
				}

				return null;
			};

			service.layout.layout2plugin = function(layout, el) {
				var layout = Ext.clone(layout),
					dimensions = Ext.Array.clean([].concat(layout.columns || [], layout.rows || [], layout.filters || []));

				layout.url = init.contextPath;

				if (el) {
					layout.el = el;
				}

				if (Ext.isString(layout.id)) {
					return {id: layout.id};
				}

				for (var i = 0, dimension, item; i < dimensions.length; i++) {
					dimension = dimensions[i];

					delete dimension.id;
					delete dimension.ids;
					delete dimension.type;
					delete dimension.dimensionName;
					delete dimension.objectName;

					for (var j = 0, item; j < dimension.items.length; j++) {
						item = dimension.items[j];

						delete item.name;
						delete item.code;
						delete item.created;
						delete item.lastUpdated;
						delete item.value;
					}
				}

				if (!layout.hideEmptyRows) {
					delete layout.hideEmptyRows;
				}

				if (!layout.showTrendLine) {
					delete layout.showTrendLine;
				}

				if (!layout.targetLineValue) {
					delete layout.targetLineValue;
				}

				if (!layout.targetLineTitle) {
					delete layout.targetLineTitle;
				}

				if (!layout.baseLineValue) {
					delete layout.baseLineValue;
				}

				if (!layout.baseLineTitle) {
					delete layout.baseLineTitle;
				}

				if (!layout.hideLegend) {
					delete layout.hideLegend;
				}

				if (!layout.hideTitle) {
					delete layout.hideTitle;
				}

				if (!layout.title) {
					delete layout.title;
				}

				if (!layout.domainAxisTitle) {
					delete layout.domainAxisTitle;
				}

				if (!layout.rangeAxisTitle) {
					delete layout.rangeAxisTitle;
				}

				if (!layout.rangeAxisMaxValue) {
					delete layout.rangeAxisMaxValue;
				}

				if (!layout.rangeAxisMinValue) {
					delete layout.rangeAxisMinValue;
				}

				if (!layout.rangeAxisSteps) {
					delete layout.rangeAxisSteps;
				}

				if (!layout.rangeAxisDecimals) {
					delete layout.rangeAxisDecimals;
				}

                if (!layout.sorting) {
                    delete layout.sorting;
                }

				if (!layout.legend) {
					delete layout.legend;
				}

				if (layout.aggregationType === 'DEFAULT') {
					delete layout.aggregationType;
				}

                // default true

				if (layout.showValues) {
					delete layout.showValues;
				}

				delete layout.parentGraphMap;
				delete layout.reportingPeriod;
				delete layout.organisationUnit;
				delete layout.parentOrganisationUnit;
				delete layout.regression;
				delete layout.cumulative;
				delete layout.topLimit;

				return layout;
			};

			service.layout.analytical2layout = function(analytical) {
				var layoutConfig = Ext.clone(analytical),
					co = dimConf.category.objectName;

				analytical = Ext.clone(analytical);

				layoutConfig.columns = [];
				layoutConfig.rows = [];
				layoutConfig.filters = layoutConfig.filters || [];

				// Series
				if (Ext.isArray(analytical.columns) && analytical.columns.length) {
					analytical.columns.reverse();

					for (var i = 0, dim; i < analytical.columns.length; i++) {
						dim = analytical.columns[i];

						if (dim.dimension === co) {
							continue;
						}

						if (!layoutConfig.columns.length) {
							layoutConfig.columns.push(dim);
						}
						else {

							// indicators cannot be set as filter
							if (dim.dimension === dimConf.indicator.objectName) {
								layoutConfig.filters.push(layoutConfig.columns.pop());
								layoutConfig.columns = [dim];
							}
							else {
								layoutConfig.filters.push(dim);
							}
						}
					}
				}

				// Rows
				if (Ext.isArray(analytical.rows) && analytical.rows.length) {
					analytical.rows.reverse();

					for (var i = 0, dim; i < analytical.rows.length; i++) {
						dim = analytical.rows[i];

						if (dim.dimension === co) {
							continue;
						}

						if (!layoutConfig.rows.length) {
							layoutConfig.rows.push(dim);
						}
						else {

							// indicators cannot be set as filter
							if (dim.dimension === dimConf.indicator.objectName) {
								layoutConfig.filters.push(layoutConfig.rows.pop());
								layoutConfig.rows = [dim];
							}
							else {
								layoutConfig.filters.push(dim);
							}
						}
					}
				}

				return layoutConfig;
			};

			// response
			service.response = {};

			service.response.getExtendedResponse = function(xLayout, response) {
				var ids = [];

				response.nameHeaderMap = {};
				response.idValueMap = {};

				// extend headers
				(function() {

					// extend headers: index, ids, size
					for (var i = 0, header; i < response.headers.length; i++) {
						header = response.headers[i];

						// index
						header.index = i;

						if (header.meta) {

							// ids
							header.ids = Ext.clone(xLayout.dimensionNameIdsMap[header.name]) || [];

							// size
							header.size = header.ids.length;

							// collect ids, used by extendMetaData
							ids = ids.concat(header.ids);
						}
					}

					// nameHeaderMap (headerName: header)
					for (var i = 0, header; i < response.headers.length; i++) {
						header = response.headers[i];

						response.nameHeaderMap[header.name] = header;
					}
				}());

				// extend metadata
				(function() {
					for (var i = 0, id, splitId ; i < ids.length; i++) {
						id = ids[i];

						if (id.indexOf('#') !== -1) {
							splitId = id.split('#');
							response.metaData.names[id] = response.metaData.names[splitId[0]] + ' ' + response.metaData.names[splitId[1]];
						}
					}
				}());

				// create value id map
				(function() {
					var valueHeaderIndex = response.nameHeaderMap[conf.finals.dimension.value.value].index,
						coHeader = response.nameHeaderMap[conf.finals.dimension.category.dimensionName],
						dx = dimConf.data.dimensionName,
						co = dimConf.category.dimensionName,
						axisDimensionNames = xLayout.axisDimensionNames,
						idIndexOrder = [];

					// idIndexOrder
					for (var i = 0, dimName, index; i < axisDimensionNames.length; i++) {
                        dimName = axisDimensionNames[i];
                        //index = response.nameHeaderMap.hasOwnProperty(
						idIndexOrder.push(response.nameHeaderMap[axisDimensionNames[i]].index);

						// If co exists in response and is not added in layout, add co after dx
						if (coHeader && !Ext.Array.contains(axisDimensionNames, co) && axisDimensionNames[i] === dx) {
							idIndexOrder.push(coHeader.index);
						}
					}

					// idValueMap
					for (var i = 0, row, id; i < response.rows.length; i++) {
						row = response.rows[i];
						id = '';

						for (var j = 0; j < idIndexOrder.length; j++) {
							id += row[idIndexOrder[j]];
						}

						response.idValueMap[id] = row[valueHeaderIndex];
					}
				}());

				return response;
			};

            // legend set
            service.legend = {};

            service.legend.getColorByValue = function(legendSet, value) {
                var color;

                if (!(legendSet && value)) {
                    return;
                }

                for (var i = 0, legend; i < legendSet.legends.length; i++) {
                    legend = legendSet.legends[i];

                    if (value >= parseFloat(legend.startValue) && value < parseFloat(legend.endValue)) {
                        return legend.color;
                    }
                }

                return;
            };
		}());

		// web
		(function() {

			// mask
			web.mask = {};

			web.mask.show = function(component, message) {
                if (init.skipMask) {
                    return;
                }

				if (!Ext.isObject(component)) {
					console.log('support.gui.mask.show: component not an object');
					return null;
				}

				message = message || 'Loading..';

				if (component.mask) {
					component.mask.destroy();
					component.mask = null;
				}

				component.mask = new Ext.create('Ext.LoadMask', component, {
					shadow: false,
					message: message,
					style: 'box-shadow:0',
					bodyStyle: 'box-shadow:0'
				});

				component.mask.show();
			};

			web.mask.hide = function(component) {
                if (init.skipMask) {
                    return;
                }

				if (!Ext.isObject(component)) {
					console.log('support.gui.mask.hide: component not an object');
					return null;
				}

				if (component.mask) {
					component.mask.destroy();
					component.mask = null;
				}
			};

			// analytics
			web.analytics = {};

			web.analytics.getParamString = function(xLayout, isSorted) {
                var axisDimensionNames = isSorted ? xLayout.sortedAxisDimensionNames : xLayout.axisDimensionNames,
                    filterDimensions = isSorted ? xLayout.sortedFilterDimensions : xLayout.filterDimensions,
                    dimensionNameIdsMap = isSorted ? xLayout.dimensionNameSortedIdsMap : xLayout.dimensionNameIdsMap,
                    paramString = '?',
                    addCategoryDimension = false,
                    map = xLayout.dimensionNameItemsMap,
                    dx = dimConf.indicator.dimensionName,
                    aggTypes = ['COUNT', 'SUM', 'STDDEV', 'VARIANCE', 'MIN', 'MAX'],
                    displayProperty = xLayout.displayProperty || init.userAccount.settings.keyAnalysisDisplayProperty || 'name';

                for (var i = 0, dimName, items; i < axisDimensionNames.length; i++) {
                    dimName = axisDimensionNames[i];

                    paramString += 'dimension=' + dimName;

                    items = Ext.clone(dimensionNameIdsMap[dimName]);

                    if (dimName === dx) {
                        for (var j = 0, index; j < items.length; j++) {
                            index = items[j].indexOf('#');

                            if (index > 0) {
                                addCategoryDimension = true;
                                items[j] = items[j].substr(0, index);
                            }
                        }

                        items = Ext.Array.unique(items);
                    }

                    if (dimName !== dimConf.category.dimensionName) {
                        paramString += ':' + items.join(';');
                    }

                    if (i < (axisDimensionNames.length - 1)) {
                        paramString += '&';
                    }
                }

                if (addCategoryDimension) {
                    paramString += '&dimension=' + conf.finals.dimension.category.dimensionName;
                }

                if (Ext.isArray(filterDimensions) && filterDimensions.length) {
                    for (var i = 0, dim; i < filterDimensions.length; i++) {
                        dim = filterDimensions[i];

                        paramString += '&filter=' + dim.dimensionName + ':' + dim.ids.join(';');
                    }
                }

				// aggregation type
				if (Ext.Array.contains(aggTypes, xLayout.aggregationType)) {
					paramString += '&aggregationType=' + xLayout.aggregationType;
				}

                // display property
                paramString += '&displayProperty=' + displayProperty.toUpperCase();

                return paramString;
            };

			web.analytics.validateUrl = function(url) {
				var msg;

                if (Ext.isIE) {
                    msg = 'Too many items selected (url has ' + url.length + ' characters). Internet Explorer accepts maximum 2048 characters.';
                }
                else {
					var len = url.length > 8000 ? '8000' : (url.length > 4000 ? '4000' : '2000');
					msg = 'Too many items selected (url has ' + url.length + ' characters). Please reduce to less than ' + len + ' characters.';
                }

                msg += '\n\n' + 'Hint: A good way to reduce the number of items is to use relative periods and level/group organisation unit selection modes.';

                ns.alert(msg);
			};

			// chart
			web.chart = {};

			web.chart.createChart = function(ns, legendSet) {
                var xLayout = ns.app.xLayout,
                    xResponse = ns.app.xResponse,
                    columnIds = xLayout.columnDimensionNames[0] ? xLayout.dimensionNameIdsMap[xLayout.columnDimensionNames[0]] : [],
                    failSafeColumnIds = [],
                    failSafeColumnIdMap = {},
                    createFailSafeColumnIds = function() {
                        for (var i = 0, uuid; i < columnIds.length; i++) {
                            uuid = Ext.data.IdGenerator.get('uuid').generate();

                            failSafeColumnIds.push(uuid);
                            failSafeColumnIdMap[uuid] = columnIds[i];

                            xResponse.metaData.names[uuid] = xResponse.metaData.names[columnIds[i]];
                        }
                    }(),

                    // row ids
                    rowIds = xLayout.rowDimensionNames[0] ? xLayout.dimensionNameIdsMap[xLayout.rowDimensionNames[0]] : [],

                    // filter ids
                    filterIds = function() {
                        var ids = [];

                        if (xLayout.filters) {
                            for (var i = 0; i < xLayout.filters.length; i++) {
                                ids = ids.concat(xLayout.filters[i].ids || []);
                            }
                        }

                        return ids;
                    }(),

                    // totals
                    dataTotalKey = Ext.data.IdGenerator.get('uuid').generate(),
                    addDataTotals = function(data, ids) {
                        for (var i = 0, obj, total; i < data.length; i++) {
                            obj = data[i];
                            total = 0;

                            for (var j = 0; j < ids.length; j++) {
                                total += parseFloat(obj[ids[j]]);
                                obj[dataTotalKey] = total;
                            }
                        }
                    },

					getSyncronizedXLayout,
                    getExtendedResponse,
                    validateUrl,

                    getDefaultStore,
                    getDefaultNumericAxis,
                    getDefaultCategoryAxis,
                    getFormatedSeriesTitle,
                    getDefaultSeriesTitle,
                    getPieSeriesTitle,
                    getDefaultSeries,
                    getDefaultTrendLines,
                    getDefaultTargetLine,
                    getDefaultBaseLine,
                    getDefaultTips,
                    setDefaultTheme,
                    getDefaultLegend,
                    getDefaultChartTitle,
                    getDefaultChartSizeHandler,
                    getDefaultChartTitlePositionHandler,
                    getDefaultChart,

                    generator = {};

                getDefaultStore = function(isStacked) {
                    var data = [],
                        trendLineFields = [],
                        targetLineFields = [],
                        baseLineFields = [],
                        store;

                    // data
                    for (var i = 0, obj, category, rowValues, isEmpty; i < rowIds.length; i++) {
                        obj = {};
                        category = rowIds[i];
                        rowValues = [];
                        isEmpty = false;

                        obj[conf.finals.data.domain] = xResponse.metaData.names[category];

                        for (var j = 0, id, value; j < columnIds.length; j++) {
                            id = support.prototype.str.replaceAll(columnIds[j], '#', '') + support.prototype.str.replaceAll(rowIds[i], '#', '');
                            value = xResponse.idValueMap[id];
                            rowValues.push(value);

                            obj[failSafeColumnIds[j]] = value ? parseFloat(value) : '0.0';
                        }

                        isEmpty = !(Ext.Array.clean(rowValues).length);

                        if (!(isEmpty && xLayout.hideEmptyRows)) {
                            data.push(obj);
                        }
                    }

                    // stacked
                    if (isStacked) {
                        addDataTotals(data, failSafeColumnIds);
                    }

                    // sort order
                    if (xLayout.sortOrder) {
                        var sortingKey = isStacked ? dataTotalKey : failSafeColumnIds[0];

                        support.prototype.array.sort(data, xLayout.sortOrder === -1 ? 'ASC' : 'DESC', sortingKey);
                    }

                    // trend lines
                    if (xLayout.showTrendLine) {
                        var regression,
                            regressionKey;

                        if (isStacked) {
                            regression = new SimpleRegression();
                            regressionKey = conf.finals.data.trendLine + dataTotalKey;

                            for (var i = 0, value; i < data.length; i++) {
                                value = data[i][dataTotalKey];
                                regression.addData(i, parseFloat(value));
                            }

                            for (var i = 0; i < data.length; i++) {
                                data[i][regressionKey] = parseFloat(regression.predict(i).toFixed(1));
                            }

                            trendLineFields.push(regressionKey);
                            xResponse.metaData.names[regressionKey] = DV.i18n.trend + ' (Total)';
                        }
                        else {
                            for (var i = 0; i < failSafeColumnIds.length; i++) {
                                regression = new SimpleRegression();
                                regressionKey = conf.finals.data.trendLine + failSafeColumnIds[i];

                                for (var j = 0, value; j < data.length; j++) {
                                    value = data[j][failSafeColumnIds[i]];
                                    regression.addData(j, parseFloat(value));
                                }

                                for (var j = 0; j < data.length; j++) {
                                    data[j][regressionKey] = parseFloat(regression.predict(j).toFixed(1));
                                }

                                trendLineFields.push(regressionKey);
                                xResponse.metaData.names[regressionKey] = DV.i18n.trend + (ns.dashboard ? '' : ' (' + xResponse.metaData.names[failSafeColumnIds[i]] + ')');
                            }
                        }
                    }

                    // target line
                    if (Ext.isNumber(xLayout.targetLineValue) || Ext.isNumber(parseFloat(xLayout.targetLineValue))) {
                        for (var i = 0; i < data.length; i++) {
                            data[i][conf.finals.data.targetLine] = parseFloat(xLayout.targetLineValue);
                        }

                        targetLineFields.push(conf.finals.data.targetLine);
                    }

                    // base line
                    if (Ext.isNumber(xLayout.baseLineValue) || Ext.isNumber(parseFloat(xLayout.baseLineValue))) {
                        for (var i = 0; i < data.length; i++) {
                            data[i][conf.finals.data.baseLine] = parseFloat(xLayout.baseLineValue);
                        }

                        baseLineFields.push(conf.finals.data.baseLine);
                    }

                    store = Ext.create('Ext.data.Store', {
                        fields: function() {
                            var fields = Ext.clone(failSafeColumnIds);
                            fields.push(conf.finals.data.domain);
                            fields = fields.concat(trendLineFields, targetLineFields, baseLineFields);

                            return fields;
                        }(),
                        data: data
                    });

                    store.rangeFields = failSafeColumnIds;
                    store.domainFields = [conf.finals.data.domain];
                    store.trendLineFields = trendLineFields;
                    store.targetLineFields = targetLineFields;
                    store.baseLineFields = baseLineFields;
                    store.numericFields = [].concat(store.rangeFields, store.trendLineFields, store.targetLineFields, store.baseLineFields);

                    store.getMaximum = function() {
                        var maximums = [];

                        for (var i = 0; i < store.numericFields.length; i++) {
                            maximums.push(store.max(store.numericFields[i]));
                        }

                        return Ext.Array.max(maximums);
                    };

                    store.getMinimum = function() {
                        var minimums = [];

                        for (var i = 0; i < store.numericFields.length; i++) {
                            minimums.push(store.min(store.numericFields[i]));
                        }

                        return Ext.Array.min(minimums);
                    };

                    store.getMaximumSum = function() {
                        var sums = [],
                            recordSum = 0;

                        store.each(function(record) {
                            recordSum = 0;

                            for (var i = 0; i < store.rangeFields.length; i++) {
                                recordSum += record.data[store.rangeFields[i]];
                            }

                            sums.push(recordSum);
                        });

                        return Ext.Array.max(sums);
                    };

                    store.hasDecimals = function() {
                        var records = store.getRange();

                        for (var i = 0; i < records.length; i++) {
                            for (var j = 0, value; j < store.rangeFields.length; j++) {
                                value = records[i].data[store.rangeFields[j]];

                                if (Ext.isNumber(value) && (value % 1)) {
                                    return true;
                                }
                            }
                        }

                        return false;
                    };

                    store.getNumberOfDecimals = function() {
                        var records = store.getRange(),
                            values = [];

                        for (var i = 0; i < records.length; i++) {
                            for (var j = 0, value; j < store.rangeFields.length; j++) {
                                value = records[i].data[store.rangeFields[j]];

                                if (Ext.isNumber(value) && (value % 1)) {
                                    value = value.toString();

                                    values.push(value.length - value.indexOf('.') - 1);
                                }
                            }
                        }

                        return Ext.Array.max(values);
                    };

                    if (DV.isDebug) {
                        console.log("data", data);
                        console.log("rangeFields", store.rangeFields);
                        console.log("domainFields", store.domainFields);
                        console.log("trendLineFields", store.trendLineFields);
                        console.log("targetLineFields", store.targetLineFields);
                        console.log("baseLineFields", store.baseLineFields);
                    }

                    return store;
                };

                getDefaultNumericAxis = function(store) {
                    var labelFont = 'normal 11px ' + conf.chart.style.fontFamily,
                        labelColor = 'black',
                        labelRotation = 0,
                        titleFont = 'bold 12px ' + conf.chart.style.fontFamily,
                        titleColor = 'black',

                        typeConf = conf.finals.chart,
                        minimum = store.getMinimum(),
                        maximum,
                        numberOfDecimals,
                        axis;

                    getRenderer = function(numberOfDecimals) {
                        var renderer = '0.';

                        for (var i = 0; i < numberOfDecimals; i++) {
                            renderer += '0';
                        }

                        return renderer;
                    };

                    // set maximum if stacked + extra line
                    if ((xLayout.type === typeConf.stackedcolumn || xLayout.type === typeConf.stackedbar) &&
                        (xLayout.showTrendLine || xLayout.targetLineValue || xLayout.baseLineValue)) {
                        var a = [store.getMaximum(), store.getMaximumSum()];
                        maximum = Math.ceil(Ext.Array.max(a) * 1.1);
                        maximum = Math.floor(maximum / 10) * 10;
                    }

                    // renderer
                    numberOfDecimals = store.getNumberOfDecimals();
                    renderer = !!numberOfDecimals && (store.getMaximum() < 20) ? getRenderer(numberOfDecimals) : '0,0';

                    axis = {
                        type: 'Numeric',
                        position: 'left',
                        fields: store.numericFields,
                        minimum: minimum < 0 ? minimum : 0,
                        label: {
                            //renderer: Ext.util.Format.numberRenderer(renderer),
                            renderer: function(v) {
                                return support.prototype.number.prettyPrint(v);
                            },
                            style: {},
                            rotate: {}
                        },
                        labelTitle: {},
                        grid: {
                            odd: {
                                opacity: 1,
                                stroke: '#000',
                                'stroke-width': 0.03
                            },
                            even: {
                                opacity: 1,
                                stroke: '#000',
                                'stroke-width': 0.03
                            }
                        }
                    };

                    if (maximum) {
                        axis.maximum = maximum;
                    }

                    if (xLayout.rangeAxisMaxValue) {
						axis.maximum = xLayout.rangeAxisMaxValue;
					}

                    if (xLayout.rangeAxisMinValue) {
						axis.minimum = xLayout.rangeAxisMinValue;
					}

					if (xLayout.rangeAxisSteps) {
						axis.majorTickSteps = xLayout.rangeAxisSteps - 1;
					}

					if (xLayout.rangeAxisDecimals) {
						axis.label.renderer = Ext.util.Format.numberRenderer(getRenderer(xLayout.rangeAxisDecimals));
					}

                    if (xLayout.rangeAxisTitle) {
                        axis.title = xLayout.rangeAxisTitle;
                    }

                    // style
                    if (Ext.isObject(xLayout.rangeAxisStyle)) {
                        var style = xLayout.rangeAxisStyle;

                        // label
                        labelColor = style.labelColor || labelColor;

                        if (style.labelFont) {
                            labelFont = style.labelFont;
                        }
                        else {
                            labelFont = style.labelFontWeight ? style.labelFontWeight + ' ' : 'normal ';
                            labelFont += style.labelFontSize ? parseFloat(style.labelFontSize) + 'px ' : '11px ';
                            labelFont +=  style.labelFontFamily ? style.labelFontFamily : conf.chart.style.fontFamily;
                        }

                        // rotation
                        if (Ext.isNumber(parseFloat(style.labelRotation))) {
                            labelRotation = 360 - parseFloat(style.labelRotation);
                        }

                        // title
                        titleColor = style.titleColor || titleColor;

                        if (style.titleFont) {
                            titleFont = style.titleFont;
                        }
                        else {
                            titleFont = style.titleFontWeight ? style.titleFontWeight + ' ' : 'bold ';
                            titleFont += style.titleFontSize ? parseFloat(style.titleFontSize) + 'px ' : '12px ';
                            titleFont +=  style.titleFontFamily ? style.titleFontFamily : conf.chart.style.fontFamily;
                        }
                    }

                    axis.label.style.fill = labelColor;
                    axis.label.style.font = labelFont;
                    axis.label.rotate.degrees = labelRotation;

                    axis.labelTitle.fill = titleColor;
                    axis.labelTitle.font = titleFont;

                    return axis;
                };

                getDefaultCategoryAxis = function(store) {
                    var labelFont = 'normal 11px ' + conf.chart.style.fontFamily,
                        labelColor = 'black',
                        labelRotation = 315,
                        titleFont = 'bold 12px ' + conf.chart.style.fontFamily,
                        titleColor = 'black',

                        axis = {
                            type: 'Category',
                            position: 'bottom',
                            fields: store.domainFields,
                            label: {
                                rotate: {},
                                style: {}
                            },
                            labelTitle: {}
                        };

                    if (xLayout.domainAxisTitle) {
                        axis.title = xLayout.domainAxisTitle;
                    }

                    // style
                    if (Ext.isObject(xLayout.domainAxisStyle)) {
                        var style = xLayout.domainAxisStyle;

                        // label
                        labelColor = style.labelColor || labelColor;

                        if (style.labelFont) {
                            labelFont = style.labelFont;
                        }
                        else {
                            labelFont = style.labelFontWeight ? style.labelFontWeight + ' ' : 'normal ';
                            labelFont += style.labelFontSize ? parseFloat(style.labelFontSize) + 'px ' : '11px ';
                            labelFont +=  style.labelFontFamily ? style.labelFontFamily : conf.chart.style.fontFamily;
                        }

                        // rotation
                        if (Ext.isNumber(parseFloat(style.labelRotation))) {
                            labelRotation = 360 - parseFloat(style.labelRotation);
                        }

                        // title
                        titleColor = style.titleColor || titleColor;

                        if (style.titleFont) {
                            titleFont = style.titleFont;
                        }
                        else {
                            titleFont = style.titleFontWeight ? style.titleFontWeight + ' ' : 'bold ';
                            titleFont += style.titleFontSize ? parseFloat(style.titleFontSize) + 'px ' : '12px ';
                            titleFont +=  style.titleFontFamily ? style.titleFontFamily : conf.chart.style.fontFamily;
                        }
                    }

                    axis.label.style.fill = labelColor;
                    axis.label.style.font = labelFont;
                    axis.label.rotate.degrees = labelRotation;

                    axis.labelTitle.fill = titleColor;
                    axis.labelTitle.font = titleFont;

                    return axis;
                };

                getFormatedSeriesTitle = function(titles) {
                    var itemLength = ns.dashboard ? 23 : 30,
                        charLength = ns.dashboard ? 5 : 6,
                        numberOfItems = titles.length,
                        numberOfChars,
                        totalItemLength = numberOfItems * itemLength,
                        //minLength = 5,
                        maxLength = support.prototype.array.getMaxLength(titles),
                        fallbackLength = 10,
                        maxWidth = ns.app.centerRegion.getWidth(),
                        width,
                        validateTitles;

                    getValidatedTitles = function(titles, len) {
                        var numberOfItems = titles.length,
                            newTitles,
                            fallbackTitles;

                        fallbackLength = len < fallbackLength ? len : fallbackLength;

                        for (var i = len, width; i > 0; i--) {
                            newTitles = [];

                            for (var j = 0, title, numberOfChars, newTitle; j < titles.length; j++) {
                                title = titles[j];

                                newTitles.push(title.length > i ? (title.slice(0, i) + '..') : title);
                            }

                            numberOfChars = newTitles.join('').length;
                            width = totalItemLength + (numberOfChars * charLength);

                            if (i === fallbackLength) {
                                fallbackTitles = Ext.clone(newTitles);
                            }

                            if (width < maxWidth) {
                                return newTitles;
                            }
                        }

                        return fallbackTitles;
                    };

                    return getValidatedTitles(titles, maxLength);
                };

                getDefaultSeriesTitle = function(store) {
                    var a = [];

                    if (Ext.isObject(xLayout.legendStyle) && Ext.isArray(xLayout.legendStyle.labelNames)) {
                        return xLayout.legendStyle.labelNames;
                    }
                    else {
                        for (var i = 0, id, name, mxl, ids; i < store.rangeFields.length; i++) {
                            id = failSafeColumnIdMap[store.rangeFields[i]];
                            name = xResponse.metaData.names[id];

                            //if (Ext.isString(name) && Ext.isObject(xLayout.legendStyle) && Ext.isNumber(xLayout.legendStyle.labelMaxLength)) {
                                //var mxl = parseInt(xLayout.legendStyle.labelMaxLength);

                                //name = name.length > mxl ? name.substr(0, mxl) + '..' : name;
                            //}

                            a.push(name);
                        }
                    }

                    return getFormatedSeriesTitle(a);
				};

                getPieSeriesTitle = function(store) {
                    var a = [];

                    if (Ext.isObject(xLayout.legendStyle) && Ext.isArray(xLayout.legendStyle.labelNames)) {
                        return xLayout.legendStyle.labelNames;
                    }
                    else {
                        var id = store.domainFields[0];

                        store.each( function(r) {
                            a.push(r.data[id]);

                            //if (Ext.isString(name) && Ext.isObject(xLayout.legendStyle) && Ext.isNumber(xLayout.legendStyle.labelMaxLength)) {
                                //var mxl = parseInt(xLayout.legendStyle.labelMaxLength);

                                //name = name.length > mxl ? name.substr(0, mxl) + '..' : name;
                            //}
                        });
                    }

                    return getFormatedSeriesTitle(a);
				};

                getDefaultSeries = function(store) {
                    var main = {
                        type: 'column',
                        axis: 'left',
                        xField: store.domainFields,
                        yField: store.rangeFields,
                        style: {
                            opacity: 0.8,
                            lineWidth: 3
                        },
                        markerConfig: {
                            type: 'circle',
                            radius: 4
                        },
                        tips: getDefaultTips(),
                        title: getDefaultSeriesTitle(store)
                    };

                    if (xLayout.showValues) {
                        var labelFont = conf.chart.style.fontFamily,
                            labelColor = 'black';

                        if (Ext.isObject(xLayout.seriesStyle)) {
                            var style = xLayout.seriesStyle;

                            // label
                            labelColor = style.labelColor || labelColor;

                            if (style.labelFont) {
                                labelFont = style.labelFont;
                            }
                            else {
                                labelFont = style.labelFontWeight ? style.labelFontWeight + ' ' : 'normal ';
                                labelFont += style.labelFontSize ? parseFloat(style.labelFontSize) + 'px ' : '11px ';
                                labelFont +=  style.labelFontFamily ? style.labelFontFamily : conf.chart.style.fontFamily;
                            }
                        }

                        main.label = {
                            display: 'outside',
                            'text-anchor': 'middle',
                            field: store.rangeFields,
                            font: labelFont,
                            fill: labelColor,
                            renderer: function(n) {
                                n = n === '0.0' ? '' : n;
                                return support.prototype.number.prettyPrint(n);
                            }
                        };
                    }

                    return main;
                };

                getDefaultTrendLines = function(store, isStacked) {
                    var a = [];

                    for (var i = 0, strokeColor; i < store.trendLineFields.length; i++) {
                        strokeColor = isStacked ? '#000' : conf.chart.theme.dv1[i];

                        a.push({
                            type: 'line',
                            axis: 'left',
                            xField: store.domainFields,
                            yField: store.trendLineFields[i],
                            style: {
                                opacity: 0.8,
                                lineWidth: 2,
                                'stroke-dasharray': 14,
                                stroke: strokeColor
                            },
                            markerConfig: {
                                type: 'circle',
                                radius: 0,
                                fill: strokeColor
                            },
                            title: function() {
                                var title = xResponse.metaData.names[store.trendLineFields[i]],
                                    ls = xLayout.legendStyle;
                                return ls && Ext.isNumber(ls.labelMaxLength) ? title.substr(0, ls.labelMaxLength) + '..' : title;
                            }()
                        });
                    }

                    return a;
                };

                getDefaultTargetLine = function(store) {
                    return {
                        type: 'line',
                        axis: 'left',
                        xField: store.domainFields,
                        yField: store.targetLineFields,
                        style: {
                            opacity: 1,
                            lineWidth: 1,
                            'stroke-width': 1,
                            stroke: '#000'
                        },
                        showMarkers: false,
                        title: function() {
                            var title = (Ext.isString(xLayout.targetLineTitle) ? xLayout.targetLineTitle : DV.i18n.target) + ' (' + xLayout.targetLineValue + ')',
                                ls = xLayout.legendStyle;
                            return ls && Ext.isNumber(ls.labelMaxLength) ? title.substr(0, ls.labelMaxLength) + '..' : title;
                        }()
                    };
                };

                getDefaultBaseLine = function(store) {
                    return {
                        type: 'line',
                        axis: 'left',
                        xField: store.domainFields,
                        yField: store.baseLineFields,
                        style: {
                            opacity: 1,
                            lineWidth: 1,
                            'stroke-width': 1,
                            stroke: '#000'
                        },
                        showMarkers: false,
                        title: function() {
                            var title = (Ext.isString(xLayout.baseLineTitle) ? xLayout.baseLineTitle : DV.i18n.base) + ' (' + xLayout.baseLineValue + ')',
                                ls = xLayout.legendStyle;
                            return ls && Ext.isNumber(ls.labelMaxLength) ? title.substr(0, ls.labelMaxLength) + '..' : title;
                        }()
                    };
                };

                getDefaultTips = function() {
                    return {
                        trackMouse: true,
                        cls: 'dv-chart-tips',
                        renderer: function(si, item) {
                            if (item.value) {
                                var value = item.value[1] === '0.0' ? '-' : item.value[1];
                                this.update('<div style="font-size:17px; font-weight:bold">' + support.prototype.number.prettyPrint(value) + '</div><div style="font-size:10px">' + si.data[conf.finals.data.domain] + '</div>');
                            }
                        }
                    };
                };

                setDefaultTheme = function(store) {
                    var colors = conf.chart.theme.dv1.slice(0, store.rangeFields.length);

                    Ext.chart.theme.dv1 = Ext.extend(Ext.chart.theme.Base, {
                        constructor: function(config) {
                            Ext.chart.theme.Base.prototype.constructor.call(this, Ext.apply({
                                seriesThemes: colors,
                                colors: colors
                            }, config));
                        }
                    });
                };

                getDefaultLegend = function(store, chartConfig) {
                    var itemLength = ns.dashboard ? 24 : 30,
                        charLength = ns.dashboard ? 4 : 6,
                        numberOfItems = 0,
                        numberOfChars = 0,
                        width,
                        isVertical = false,
                        labelFont = '11px ' + conf.chart.style.fontFamily,
                        labelColor = 'black';
                        position = 'top',
                        padding = 0,
                        positions = ['top', 'right', 'bottom', 'left'],
                        series = chartConfig.series,
                        labelMarkerSize = xLayout.legendStyle && xLayout.legendStyle.labelMarkerSize ? xLayout.legendStyle.labelMarkerSize : null,
                        chartConfig;

                    for (var i = 0, title; i < series.length; i++) {
                        title = series[i].title;

                        if (Ext.isString(title)) {
                            numberOfItems += 1;
                            numberOfChars += title.length;
                        }
                        else if (Ext.isArray(title)) {
                            numberOfItems += title.length;
                            numberOfChars += title.toString().split(',').join('').length;
                        }
                    }

                    width = (numberOfItems * itemLength) + (numberOfChars * charLength);

                    if (width > ns.app.centerRegion.getWidth() - 6) {
                        position = 'right';
                    }

                    // style
                    if (Ext.isObject(xLayout.legendStyle)) {
                        var style = xLayout.legendStyle;

                        labelColor = style.labelColor || labelColor;

                        if (Ext.Array.contains(positions, style.position)) {
                            position = style.position;
                        }

                        if (style.labelFont) {
                            labelFont = style.labelFont;
                        }
                        else {
                            labelFont = style.labelFontWeight ? style.labelFontWeight + ' ' : 'normal ';
                            labelFont += style.labelFontSize ? parseFloat(style.labelFontSize) + 'px ' : '11px ';
                            labelFont += style.labelFontFamily ? style.labelFontFamily : conf.chart.style.fontFamily;
                        }
                    }

                    // padding
                    if (position === 'right') {
                        padding = 3;
                    }

                    // chart
                    chartConfig = {
                        position: position,
                        isVertical: isVertical,
                        boxStroke: '#ffffff',
                        boxStrokeWidth: 0,
                        padding: padding,
                        itemSpacing: 3,
                        labelFont: labelFont,
                        labelColor: labelColor
                    };

                    if (labelMarkerSize) {
                        chartConfig.labelMarkerSize = labelMarkerSize;
                    }

                    return Ext.create('Ext.chart.Legend', chartConfig);
                };

                getDefaultChartTitle = function(store) {
                    var ids = [],
                        text = '',
                        titleFont,
                        titleColor,
                        isPie = xLayout.type === conf.finals.chart.pie,
                        isGauge = xLayout.type === conf.finals.chart.gauge;

                    if (isPie) {
                        ids.push(columnIds[0]);
                    }
                    else if (isGauge) {
                        ids.push(columnIds[0], rowIds[0]);
                    }

                    ids = Ext.Array.clean(ids.concat(filterIds || []));

                    if (Ext.isArray(ids) && ids.length) {
                        for (var i = 0; i < ids.length; i++) {
                            text += xResponse.metaData.names[ids[i]];
                            text += i < ids.length - 1 ? ', ' : '';
                        }
                    }

                    if (xLayout.title) {
                        text = xLayout.title;
                    }

                    fontSize = (ns.app.centerRegion.getWidth() / text.length) < 11.6 ? 12 : 17;
                    titleFont = 'normal ' + fontSize + 'px ' + conf.chart.style.fontFamily;
                    titleColor = 'black';

                    // legend
                    if (Ext.isObject(xLayout.legendStyle)) {
                        var style = xLayout.legendStyle;

                        titleColor = style.titleColor || titleColor;

                        if (style.titleFont) {
                            titleFont = style.titleFont;
                        }
                        else {
                            titleFont = style.titleFontWeight ? style.titleFontWeight + ' ' : 'normal ';
                            titleFont += style.titleFontSize ? parseFloat(style.titleFontSize) + 'px ' : (fontSize + 'px ');
                            titleFont +=  style.titleFontFamily ? style.titleFontFamily : conf.chart.style.fontFamily;
                        }
                    }

                    return Ext.create('Ext.draw.Sprite', {
                        type: 'text',
                        text: text,
                        font: titleFont,
                        fill: titleColor,
                        height: 20,
                        y: ns.dashboard ? 7 : 20
                    });
                };

                getDefaultChartSizeHandler = function() {
                    var width = ns.app.centerRegion.getWidth(),
                        height = ns.app.centerRegion.getHeight();

                    return function() {
						this.animate = false;
                        this.setWidth(ns.dashboard ? width : width - 15);
                        this.setHeight(ns.dashboard ? height : height - 40);
                        this.animate = !ns.dashboard;
                    };
                };

                getDefaultChartTitlePositionHandler = function() {
                    return function() {
                        if (this.items) {
                            var title = this.items[0],
                                titleWidth = Ext.isIE ? title.el.dom.scrollWidth : title.el.getWidth(),
                                titleXFallback = 10,
                                legend = this.legend,
                                legendCenterX,
                                titleX;

                            if (this.legend.position === 'top') {
                                legendCenterX = legend.x + (legend.width / 2);
                                titleX = titleWidth ? legendCenterX - (titleWidth / 2) : titleXFallback;
                            }
                            else {
                                var legendWidth = legend ? legend.width : 0;
                                titleX = titleWidth ? (this.width / 2) - (titleWidth / 2) : titleXFallback;
                            }

                            title.setAttributes({
                                x: titleX
                            }, true);
                        }
                    };
                };

                getDefaultChart = function(config) {
                    var chart,
                        store = config.store || {},
                        width = ns.app.centerRegion.getWidth(),
                        height = ns.app.centerRegion.getHeight(),
                        isLineBased = Ext.Array.contains(['line', 'area'], xLayout.type),
                        defaultConfig = {
                            //animate: true,
                            animate: false,
                            shadow: false,
                            insetPadding: ns.dashboard ? 17 : 35,
                            insetPaddingObject: {
                                top: ns.dashboard ? 12 : 32,
                                right: ns.dashboard ? (isLineBased ? 5 : 3) : (isLineBased ? 25 : 15),
                                bottom: ns.dashboard ? 2 : 10,
                                left: ns.dashboard ? (isLineBased ? 15 : 7) : (isLineBased ? 70 : 50)
                            },
                            width: ns.dashboard ? width : width - 15,
                            height: ns.dashboard ? height : height - 40,
                            theme: 'dv1'
                        };
                        
                    // legend
                    if (!xLayout.hideLegend) {
                        defaultConfig.legend = getDefaultLegend(store, config);

                        if (defaultConfig.legend.position === 'right') {
                            defaultConfig.insetPaddingObject.top = ns.dashboard ? 22 : 40;
                            defaultConfig.insetPaddingObject.right = ns.dashboard ? 5 : 40;
                        }
                    }

                    // title
                    if (xLayout.hideTitle) {
                        defaultConfig.insetPadding = ns.dashboard ? 1 : 10;
                        defaultConfig.insetPaddingObject.top = ns.dashboard ? 3 : 10;
                    }
                    else {
                        defaultConfig.items = [getDefaultChartTitle(store)];
                    }

                    Ext.apply(defaultConfig, config);

                    // chart
                    chart = Ext.create('Ext.chart.Chart', defaultConfig);

                    chart.setChartSize = getDefaultChartSizeHandler();
                    chart.setTitlePosition = getDefaultChartTitlePositionHandler();

                    chart.onViewportResize = function() {
                        chart.setChartSize();
                        chart.redraw();
                        chart.setTitlePosition();
                    };

                    chart.on('resize', function() {
                        chart.setTitlePosition();
                    });

                    return chart;
                };

                generator.column = function(isStacked) {
                    var store = getDefaultStore(isStacked),
                        numericAxis = getDefaultNumericAxis(store),
                        categoryAxis = getDefaultCategoryAxis(store),
                        axes = [numericAxis, categoryAxis],
                        series = [getDefaultSeries(store)];

                    // options
                    if (xLayout.showTrendLine) {
                        series = series.concat(getDefaultTrendLines(store, isStacked));
                    }

                    if (xLayout.targetLineValue) {
                        series.push(getDefaultTargetLine(store));
                    }

                    if (xLayout.baseLineValue) {
                        series.push(getDefaultBaseLine(store));
                    }

                    // theme
                    setDefaultTheme(store, isStacked);

                    return getDefaultChart({
                        store: store,
                        axes: axes,
                        series: series
                    });
                };

                generator.stackedcolumn = function() {
                    var chart = this.column(true);

                    for (var i = 0, item; i < chart.series.items.length; i++) {
                        item = chart.series.items[i];

                        if (item.type === conf.finals.chart.column) {
                            item.stacked = true;
                        }
                    }

                    return chart;
                };

                generator.bar = function(isStacked) {
                    var store = getDefaultStore(isStacked),
                        numericAxis = getDefaultNumericAxis(store),
                        categoryAxis = getDefaultCategoryAxis(store),
                        axes,
                        series = getDefaultSeries(store),
                        trendLines,
                        targetLine,
                        baseLine,
                        chart;

                    // Axes
                    numericAxis.position = 'bottom';
                    categoryAxis.position = 'left';
                    categoryAxis.label.rotate.degrees = 360;
                    axes = [numericAxis, categoryAxis];

                    // Series
                    series.type = 'bar';
                    series.axis = 'bottom';

                    // Options
                    if (xLayout.showValues) {
                        series.label = {
                            display: 'outside',
                            'text-anchor': 'middle',
                            field: store.rangeFields
                        };
                    }

                    series = [series];

                    if (xLayout.showTrendLine) {
                        trendLines = getDefaultTrendLines(store, isStacked);

                        for (var i = 0; i < trendLines.length; i++) {
                            trendLines[i].axis = 'bottom';
                            trendLines[i].xField = store.trendLineFields[i];
                            trendLines[i].yField = store.domainFields;
                        }

                        series = series.concat(trendLines);
                    }

                    if (xLayout.targetLineValue) {
                        targetLine = getDefaultTargetLine(store);
                        targetLine.axis = 'bottom';
                        targetLine.xField = store.targetLineFields;
                        targetLine.yField = store.domainFields;

                        series.push(targetLine);
                    }

                    if (xLayout.baseLineValue) {
                        baseLine = getDefaultBaseLine(store);
                        baseLine.axis = 'bottom';
                        baseLine.xField = store.baseLineFields;
                        baseLine.yField = store.domainFields;

                        series.push(baseLine);
                    }

                    // Theme
                    setDefaultTheme(store);

                    return getDefaultChart({
                        store: store,
                        axes: axes,
                        series: series
                    });
                };

                generator.stackedbar = function() {
                    var chart = this.bar(true);

                    for (var i = 0, item; i < chart.series.items.length; i++) {
                        item = chart.series.items[i];

                        if (item.type === conf.finals.chart.bar) {
                            item.stacked = true;
                        }
                    }

                    return chart;
                };

                generator.line = function() {
                    var store = getDefaultStore(),
                        numericAxis = getDefaultNumericAxis(store),
                        categoryAxis = getDefaultCategoryAxis(store),
                        axes = [numericAxis, categoryAxis],
                        series = [],
                        colors = conf.chart.theme.dv1.slice(0, store.rangeFields.length),
                        seriesTitles = getDefaultSeriesTitle(store);

                    // Series
                    for (var i = 0, line; i < store.rangeFields.length; i++) {
                        line = {
                            type: 'line',
                            axis: 'left',
                            xField: store.domainFields,
                            yField: store.rangeFields[i],
                            style: {
                                opacity: 0.8,
                                lineWidth: 3
                            },
                            markerConfig: {
                                type: 'circle',
                                radius: ns.dashboard ? 3 : 4
                            },
                            tips: getDefaultTips(),
                            title: seriesTitles[i]
                        };

                        //if (xLayout.showValues) {
                            //line.label = {
                                //display: 'over',
                                //field: store.rangeFields[i]
                            //};
                        //}

                        series.push(line);
                    }

                    // options, theme colors
                    if (xLayout.showTrendLine) {
                        series = getDefaultTrendLines(store).concat(series);

                        colors = colors.concat(colors);
                    }

                    if (xLayout.targetLineValue) {
                        series.push(getDefaultTargetLine(store));

                        colors.push('#051a2e');
                    }

                    if (xLayout.baseLineValue) {
                        series.push(getDefaultBaseLine(store));

                        colors.push('#051a2e');
                    }

                    // theme
                    Ext.chart.theme.dv1 = Ext.extend(Ext.chart.theme.Base, {
                        constructor: function(config) {
                            Ext.chart.theme.Base.prototype.constructor.call(this, Ext.apply({
                                seriesThemes: colors,
                                colors: colors
                            }, config));
                        }
                    });

                    return getDefaultChart({
                        store: store,
                        axes: axes,
                        series: series
                    });
                };

                generator.area = function() {

                    // NB, always true for area charts as extjs area charts cannot handle nulls
                    xLayout.hideEmptyRows = true;

                    var store = getDefaultStore(true),
                        numericAxis = getDefaultNumericAxis(store),
                        categoryAxis = getDefaultCategoryAxis(store),
                        axes = [numericAxis, categoryAxis],
                        series = getDefaultSeries(store);

                    series.type = 'area';
                    series.style.opacity = 0.7;
                    series.style.lineWidth = 0;
                    delete series.label;
                    delete series.tips;
                    series = [series];

                    // Options
                    if (xLayout.showTrendLine) {
                        series = series.concat(getDefaultTrendLines(store, true));
                    }

                    if (xLayout.targetLineValue) {
                        series.push(getDefaultTargetLine(store));
                    }

                    if (xLayout.baseLineValue) {
                        series.push(getDefaultBaseLine(store));
                    }

                    // Theme
                    setDefaultTheme(store);

                    return getDefaultChart({
                        store: store,
                        axes: axes,
                        series: series
                    });
                };

                generator.pie = function() {
                    var store = getDefaultStore(),
                        series,
                        colors,
                        chart,
                        label = {
                            field: conf.finals.data.domain
                        };

                    // label
                    if (xLayout.showValues) {
                        var labelFont = conf.chart.style.fontFamily,
                            labelColor;

                        if (Ext.isObject(xLayout.seriesStyle)) {
                            var style = xLayout.seriesStyle;

                            // color
                            labelColor = style.labelColor || labelColor;

                            if (style.labelFont) {
                                labelFont = style.labelFont;
                            }
                            else {
                                labelFont = style.labelFontWeight ? style.labelFontWeight + ' ' : 'normal ';
                                labelFont += style.labelFontSize ? parseFloat(style.labelFontSize) + 'px ' : '11px ';
                                labelFont +=  style.labelFontFamily ? style.labelFontFamily : conf.chart.style.fontFamily;
                            }
                        }

                        label.display = 'middle';
                        label.contrast = !labelColor;
                        label.font = labelFont;
                        label.fill = labelColor;
                        label.renderer = function(value) {
                            var record = store.getAt(store.findExact(conf.finals.data.domain, value)),
                                v = record.data[store.rangeFields[0]];
                                
                            return support.prototype.number.prettyPrint(v);
                        };
                    }

                    // series
                    series = [{
                        type: 'pie',
                        field: store.rangeFields[0],
                        donut: 5,
                        showInLegend: true,
                        highlight: {
                            segment: {
                                margin: 5
                            }
                        },
                        label: label,
                        style: {
                            opacity: 0.8,
                            stroke: '#555'
                        },
                        tips: {
                            trackMouse: true,
                            cls: 'dv-chart-tips',
                            renderer: function(item) {
                                var value = support.prototype.number.prettyPrint(item.data[store.rangeFields[0]]),
                                    data = item.data[conf.finals.data.domain];
                                    
                                this.update('<div style="text-align:center"><div style="font-size:17px; font-weight:bold">' + value + '</div><div style="font-size:10px">' + data + '</div></div>');
                            }
                        },
                        shadowAttributes: false,
                        title: getPieSeriesTitle(store)
                    }];

                    // theme
                    colors = conf.chart.theme.dv1.slice(0, xResponse.nameHeaderMap[xLayout.rowDimensionNames[0]].ids.length);

                    Ext.chart.theme.dv1 = Ext.extend(Ext.chart.theme.Base, {
                        constructor: function(config) {
                            Ext.chart.theme.Base.prototype.constructor.call(this, Ext.apply({
                                seriesThemes: colors,
                                colors: colors
                            }, config));
                        }
                    });

                    // chart
                    chart = getDefaultChart({
                        store: store,
                        series: series,
                        insetPaddingObject: {
                            top: ns.dashboard ? 15 : 40,
                            right: ns.dashboard ? 2 : 30,
                            bottom: ns.dashboard ? 13: 30,
                            left: ns.dashboard ? 7 : 30
                        }
                    });

                    return chart;
                };

                generator.radar = function() {
                    var store = getDefaultStore(),
                        axes = [],
                        series = [],
                        seriesTitles = getDefaultSeriesTitle(store),
                        labelFont = 'normal 9px sans-serif',
                        labelColor = '#333',
                        chart;

                    // axes
                    axes.push({
                        type: 'Radial',
                        position: 'radial',
                        label: {
                            display: true
                        }
                    });

                    // series
                    for (var i = 0, obj; i < store.rangeFields.length; i++) {
                        obj = {
                            showInLegend: true,
                            type: 'radar',
                            xField: store.domainFields,
                            yField: store.rangeFields[i],
                            style: {
                                opacity: 0.5
                            },
                            tips: getDefaultTips(),
                            title: seriesTitles[i]
                        };

                        if (xLayout.showValues) {
                            obj.label = {
                                display: 'over',
                                field: store.rangeFields[i]
                            };
                        }

                        series.push(obj);
                    }

                    // style
                    if (Ext.isObject(xLayout.seriesStyle)) {
                        var style = xLayout.seriesStyle;

                        // label
                        labelColor = style.labelColor || labelColor;

                        if (style.labelFont) {
                            labelFont = style.labelFont;
                        }
                        else {
                            labelFont = style.labelFontWeight ? style.labelFontWeight + ' ' : 'normal ';
                            labelFont += style.labelFontSize ? parseFloat(style.labelFontSize) + 'px ' : '9px ';
                            labelFont +=  style.labelFontFamily ? style.labelFontFamily : conf.chart.style.fontFamily;
                        }
                    }

                    // chart
                    chart = getDefaultChart({
                        store: store,
                        axes: axes,
                        series: series,
                        theme: 'Category2',
                        insetPaddingObject: {
                            top: 20,
                            right: 2,
                            bottom: 15,
                            left: 7
                        },
                        seriesStyle: {
                            labelColor: labelColor,
                            labelFont: labelFont
                        }
                    });

                    return chart;
                };

                generator.gauge = function() {
                    var valueColor = '#aaa',
                        store,
                        axis,
                        series,
                        legend,
                        config,
                        chart;

                    // overwrite items
                    columnIds = [columnIds[0]];
                    failSafeColumnIds = [failSafeColumnIds[0]];
                    rowIds = [rowIds[0]];

                    // store
                    store = getDefaultStore();

                    // axis
                    axis = {
                        type: 'gauge',
                        position: 'gauge',
                        minimum: 0,
                        maximum: 100,
                        steps: 10,
                        margin: -7
                    };

                    // series, legendset
                    if (legendSet) {
                        valueColor = service.legend.getColorByValue(legendSet, store.getRange()[0].data[failSafeColumnIds[0]]) || valueColor;
                    }

                    series = {
                        type: 'gauge',
                        field: store.rangeFields[0],
                        //donut: 5,
                        colorSet: [valueColor, '#ddd']
                    };

                    chart = getDefaultChart({
                        axes: [axis],
                        series: [series],
                        width: ns.app.centerRegion.getWidth(),
                        height: ns.app.centerRegion.getHeight() * 0.6,
                        store: store,
                        insetPadding: ns.dashboard ? 50 : 100,
                        theme: null,
                        //animate: {
                            //easing: 'elasticIn',
                            //duration: 1000
                        //}
                        animate: false
                    });

                    if (xLayout.showValues) {
                        chart.items.push(Ext.create('Ext.draw.Sprite', {
                            type: 'text',
                            text: store.getRange()[0].data[failSafeColumnIds[0]],
                            font: 'normal 26px ' + conf.chart.style.fontFamily,
                            fill: '#111',
                            height: 40,
                            y: 	60
                        }));
                    }

                    chart.setChartSize = function() {
						//this.animate = false;
                        this.setWidth(ns.app.centerRegion.getWidth());
                        this.setHeight(ns.app.centerRegion.getHeight() * 0.6);
                        //this.animate = true;
                    };

                    chart.setTitlePosition = function() {
                        if (this.items) {
                            var title = this.items[0],
                                subTitle = this.items[1],
                                titleXFallback = 10;

                            if (title) {
                                var titleWidth = Ext.isIE ? title.el.dom.scrollWidth : title.el.getWidth(),
                                    titleX = titleWidth ? (ns.app.centerRegion.getWidth() / 2) - (titleWidth / 2) : titleXFallback;
                                title.setAttributes({
                                    x: titleX
                                }, true);
                            }

                            if (subTitle) {
                                var subTitleWidth = Ext.isIE ? subTitle.el.dom.scrollWidth : subTitle.el.getWidth(),
                                    subTitleX = subTitleWidth ? (ns.app.centerRegion.getWidth() / 2) - (subTitleWidth / 2) : titleXFallback;
                                subTitle.setAttributes({
                                    x: subTitleX
                                }, true);
                            }
                        }
                    };

                    return chart;
                };

                // initialize
                return generator[xLayout.type]();
            };

        }());

		// extend init
		(function() {

			// sort and extend dynamic dimensions
			if (Ext.isArray(init.dimensions)) {
				support.prototype.array.sort(init.dimensions);

				for (var i = 0, dim; i < init.dimensions.length; i++) {
					dim = init.dimensions[i];
					dim.dimensionName = dim.id;
					dim.objectName = conf.finals.dimension.dimension.objectName;
					conf.finals.dimension.objectNameMap[dim.id] = dim;
				}
			}

			// sort ouc
			if (init.user && init.user.ouc) {
				support.prototype.array.sort(init.user.ouc);
			}
		}());

		// instance
		return {
			conf: conf,
			api: api,
			support: support,
			service: service,
			web: web,
			init: init
		};
    };
});
