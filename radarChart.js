//Practically all this code comes from https://github.com/alangrafu/radar-chart-d3
//I only made some additions and aesthetic adjustments to make the chart look better
//(of course, that is only my point of view)
//Such as a better placement of the titles at each line end,
//adding numbers that reflect what each circular level stands for
//Not placing the last level and slight differences in color
//
//For a bit of extra information check the blog about it:
//http://nbremer.blogspot.nl/2013/09/making-d3-radar-chart-look-bit-better.html

var RadarChart = {
  draw: function(id, d, options){
  var cfg = {
	 radius: 5,
	 w: 275,
	 h: 275,
	 factor: 1,
	 factorLegend: 1.2,
	 levels: 10,
	 maxValue: 0,
	 radians: 2 * Math.PI,
	 opacityArea: 0.5,
	 ToRight: 5,
	 TranslateX: 97,
	 TranslateY: 30,
	 ExtraWidthX: 190,
	 ExtraWidthY: 100,
   median: false,
   spider: false,
	 color: [],
   labelFontSize: '80%',
   valueFontSize: '70%',
   fontFamily: 'Pyidaungsu',
   subExplain: false
	};

	if('undefined' !== typeof options){
	  for(var i in options){
		if('undefined' !== typeof options[i]){
		  cfg[i] = options[i];
		}
	  }
	}

  // OVERRIDE SOME CONFIG options
  cfg.levels = 10;
  cfg.color = ['#045971',
    '#b6af9d',
    '#d9212d',
    '#b9a431',
    '#81cfcc',
    '#b2222b',
    '#e9aa22',
    '#05713a',
    '#f58020',
    '#e43d4e' ];
  // END MANUAL OVERRIDE

	cfg.maxValue = Math.max(cfg.maxValue, d3.max(d, function(i){return d3.max(i.map(function(o){return o.value;}))}));
	var allAxis = (d[0].map(function(i, j){return i.axis}));
	var total = allAxis.length;
	var radius = cfg.factor*Math.min(cfg.w/2, cfg.h/2);
	var Format = d3.format('1f'); // can add % here, but I removed it
	d3.select(id).select("svg").remove();

	var g = d3.select(id)
			.append("svg")
			.attr("width", cfg.w+cfg.ExtraWidthX)
			.attr("height", cfg.h+cfg.ExtraWidthY)
			.append("g")
			.attr("transform", "translate(" + cfg.TranslateX + "," + cfg.TranslateY + ")");

	var tooltip;

  // Concentric circles
  var bigCircle;
	g.selectAll(".levels")
	   .data(allAxis)
	   .enter()
     .append("svg:circle")
     .attr('class', 'levels')
     .attr("cx", cfg.w/2)
     .attr("cy", cfg.h/2)
     .attr("r", function(d,i) {
       return cfg.factor*radius*((i+1)/cfg.levels);
     })
     .style("fill", "none")
     .style("stroke", "grey")
     .style("stroke-width", "1px")
     .style("stroke-opacity", "0.5");

	//Text indicating at what % each level is
	/*for(var j=0; j<cfg.levels; j++){
	  var levelFactor = cfg.factor*radius*((j+1)/cfg.levels);
	  g.selectAll(".levels")
	   .data([1]) //dummy data
	   .enter()
	   .append("svg:text")
	   .attr("x", function(d){return levelFactor*(1-cfg.factor*Math.sin(0));})
	   .attr("y", function(d){return levelFactor*(1-cfg.factor*Math.cos(0));})
	   .attr("class", "legend")
	   .style("font-family", "sans-serif")
	   .style("font-size", "10px")
	   .attr("transform", "translate(" + (cfg.w/2-levelFactor + cfg.ToRight) + ", " + (cfg.h/2-levelFactor) + ")")
	   .attr("fill", "#737373")
	   .text(Format((j+1)*cfg.maxValue/cfg.levels)); // percentage formatting
	}*/

	series = 0;

	var axis = g.selectAll(".axis")
			.data(allAxis)
			.enter()
			.append("g")
			.attr("class", "axis");

  var axisOffset = 0;
	axis.append("line")
		.attr("x1", cfg.w/2)
		.attr("y1", cfg.h/2)
		.attr("x2", function(d, i){return cfg.w/2*(1-cfg.factor*Math.sin((i+axisOffset)*cfg.radians/total));})
		.attr("y2", function(d, i){return cfg.h/2*(1-cfg.factor*Math.cos((i+axisOffset)*cfg.radians/total));})
		.attr("class", "line")
		.style("stroke", "grey")
    .style("stroke-opacity", "0.7")
		.style("stroke-width", "1px");

// Note that the width/height of svg:image is half the factor of radius on svg:circle
	/*axis.append("svg:circle")
		.attr("class", "legend")
		//.attr("transform", function(d, i){return "translate(0, -10)"})
    .attr("r", 0.05 * cfg.w)
		.attr("cx", function(d, i){return cfg.w/2*(1-cfg.factor*Math.sin(i*cfg.radians/total));})
		.attr("cy", function(d, i){return cfg.h/2*(1-cfg.factor*Math.cos(i*cfg.radians/total));})
    .attr("transform", function(d) {return `rotate(18,${cfg.w/2},${cfg.h/2})`})
    .attr("fill", "pink");*/
  var iconWidth = 0.1 * cfg.w;
  var iconHeight = 0.1 * cfg.h;
  var placementOffset = 0.5;

  var iconLoc =  g.selectAll(".icon")
    .data(Object.keys(starburstIcon))
    .enter()
    .append("g")
    .attr("class", "icon");

  var icons = iconLoc.append("svg:image")
    .attr("x", function(d, i){return cfg.w/2*(1-cfg.factor*Math.sin(-(i+placementOffset)*cfg.radians/total)) - 0.5*iconWidth;})
    .attr("y", function(d, i){return cfg.h/2*(1-cfg.factor*Math.cos(-(i+placementOffset)*cfg.radians/total)) - 0.5*iconHeight;})
  //  .attr("transform", function(d) {return `rotate(18,${cfg.w/2},${cfg.h/2})`})
    .attr("width", 0.12 * cfg.w)
    .attr("height", 0.12 * cfg.h)
    .attr("xlink:href", function(d) {
      return starburstIcon[d];
    });

  if (cfg.subExplain == true) {
    d3.select('.subindexExplanation')
      .text(copy['subindexExplanationTooltip'][lang])
      .style('font-style', 'italic')
      .style('font-size', '0.8em');
    var selectedIcon = 100;
    clicked = false;
    icons.on("mouseover", function(d,i) {
      d3.select(this).attr("width", 0.14 *cfg.w).attr("height", 0.14*cfg.h);
    })
    .on("click", function (d,i) {
      console.log(`${d}, ${i}`);
      if (clicked == true) {
      /*  iconLoc.selectAll("circle").remove();
        iconLoc.selectAll('text').remove();*/
        clicked = false;
        burst.style("display", "inline");
        label.style("display", "inline");
        d3.select('.subindexExplanation')
          .text(copy['subindexExplanationTooltip'][lang]);
        if (selectedIcon == i) {
          return;
        }
      }
      d3.select(this).attr("width", 0.14 *cfg.w).attr("height", 0.14*cfg.h);
      d3.select('.subindexExplanation')
        .text(starburstLegend[lang][d] + ' ⇒ ' + copy['subindexExplanation'][d][lang])
        .style('font-style', 'italic')
        .style('font-size', '0.8em')
        .style('word-wrap', 'break-word');      /*
      iconLoc.append("circle")
        .attr("cx", cfg.w/2)
        .attr("cy", cfg.h/2)
        .attr("r", cfg.factor * radius *0.75)
        .attr("fill", function(d) {
          return cfg.color[i];
        })
        .style('opacity', 0.7);
        burst.style("display", "none");
        label.style("display", "none"); */
      selectedIcon = i;
      clicked = true;

      /*iconLoc.append("text")
        .attr('x', cfg.w/2)
        .attr('y', cfg.h/2)
        .attr('text-anchor', 'middle')
        .style('color', 'white')
        .style('font-size', '0.5em')
        .text();*/
    })
    .on("mouseout", function(d,i) {
      d3.select(this).attr("width", 0.12*cfg.w).attr("height", 0.12*cfg.h);
    });
  }



  /* Note: Text placement can be a little tricky.
     cfg.factorLegend more or less controls placement along radius
     and transate(0, +/- y) adjusts for some off-kilterness*/
  var legendSliceIndex = 7;
  axis.append("svg:text")
  	.text((d)=>(d))
  	.style("font-family", cfg.fontFamily)
  	.style("font-size", cfg.labelFontSize)
  	.style("word-wrap", "normal")
  	.attr("text-anchor", function(d,i) {
      if (i<5) { return "middle";}
      else { return "middle";}
    })
  	.attr("transform", function(d, i){
      if (i==0 | i==1 | i==8 | i==9){
        if (i==0 | i==9) {
          return "translate(0,5)";
        }
        return "translate(0,0)";
      } else {
        if (i==4 | i==5) {
          return "translate(0,7)";
        }
        if (i==3 | i==6)  {
          return "translate(0,15)";
        }
        if (i==2) {
          return "translate(-10,30)";
        }
        if (i==7) {
          return "translate(10,30)";
        }
      }
    })
  	.attr("x", function(d, i){return cfg.w/2*(1-cfg.factorLegend*Math.sin(-(i+placementOffset)*cfg.radians/total));})
  	.attr("y", function(d, i){return cfg.h/2*(1-cfg.factorLegend*Math.cos(-(i+placementOffset)*cfg.radians/total));});

  if (cfg.spider == false) { // Draw bursts if not spider
    var burst = g.selectAll(".burst")
  	  .data(d[0])
  	  .enter()
  	  .append("g")
  	  .attr("class", "burst");

    var centroids = [];
    burst.append("svg:path")
      .attr("d", function(d,i) {
        var arc = d3.arc()
          .innerRadius(0)
          .outerRadius(d.value/cfg.maxValue * radius)
          .startAngle(i*0.2*Math.PI)
          .endAngle((i+1)*0.2*Math.PI);

        centroids.push(arc.centroid());
        return arc();
      })
      .attr("transform", `translate(${cfg.w/2},${cfg.h/2})`)
      .attr("opacity", "1")
      .attr("fill", function(d,i) {
        return cfg.color[i];
      }); //TODO: define color scale for MBEI subindices


    if (cfg.median == true) {
      var medianArc = g.selectAll(".medianArc")
        .data(d[0])
        .enter()
        .append("g")
        .attr("class", "medianArc")

      medianArc.append("svg:path")
        .attr("d", function(d,i) {
          var thickness = 1.5;
          var outerRadius = d.median/cfg.maxValue * radius;
          var innerRadius = outerRadius - thickness;

          var arc = d3.arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius)
            .startAngle(i*0.2*Math.PI)
            .endAngle((i+1)*0.2*Math.PI);

          if (i == 3) {
            var retArc = d3.arc().innerRadius(innerRadius)
              .outerRadius(outerRadius)
              .startAngle(i*0.2*Math.PI)
              .endAngle((i+1)*0.2*Math.PI);
          }

          return arc();
        })
        .attr("transform", `translate(${cfg.w/2},${cfg.h/2})`)
        .attr("opacity", "0.6")
        .attr("fill", "black");
    }

    var Format = d3.format('.1f');
    var labelSpread = 1.7; // Determines how far the labels are from the center
    var label = g.selectAll('.label')
      .data(d[0])
      .enter()
      .append('g')
      .attr('class', 'label');

    label.append("svg:text")
      .text(function(d) { return Format(d.value);})
      .attr("fill", "white")
      .attr("font-size", cfg.valueFontSize)
      .style('font-family', cfg.fontFamily)
      .attr("x", function(d,i) { return centroids[i][0]*labelSpread;})
      .attr("y", function(d,i) { return centroids[i][1]*labelSpread;})
      .attr("text-anchor", "middle")
      .attr("transform", `translate(${cfg.w/2},${cfg.h/2})`);
  } else { // Draw spider if not bursts



    //  .attr("transform", function(d) {return `rotate(36,${cfg.h},${cfg.w})`});

	d.forEach(function(y, x){
	  dataValues = [];
	  g.selectAll(".nodes")
		.data(y, function(j, i){
		  dataValues.push([
			cfg.w/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.sin(-(i+0.5)*cfg.radians/total)),
			cfg.h/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.cos(-(i+0.5)*cfg.radians/total))
		  ]);
		});
	  dataValues.push(dataValues[0]);
	  g.selectAll(".area")
					 .data([dataValues])
					 .enter()
					 .append("polygon")
					 .attr("class", "radar-chart-serie"+series)
					 .style("stroke-width", "2px")
					 .style("stroke", function(d,i) { if (series == 0) {return cfg.color[0]} else if (series == 1) {return cfg.color[9]} })
					 .attr("points",function(d) {
						 var str="";
						 for(var pti=0;pti<d.length;pti++){
							 str=str+d[pti][0]+","+d[pti][1]+" ";
						 }
						 return str;
					  })
					 .style("fill", function(d,i) { if (series == 0) {return cfg.color[0]} else if (series == 1) {return cfg.color[9]} })
					 .style("fill-opacity", cfg.opacityArea)
					 .on('mouseover', function (d){
										z = "polygon."+d3.select(this).attr("class");
										g.selectAll("polygon")
										 //.transition(200)
										 .style("fill-opacity", 0.1);
										g.selectAll(z)
										 //.transition(200)
										 .style("fill-opacity", .7);
									  })
					 .on('mouseout', function(){
										g.selectAll("polygon")
										 //.transition(200)
										 .style("fill-opacity", cfg.opacityArea);
					 });
	  series++;
	});
	series=0;


	d.forEach(function(y, x){
	  g.selectAll(".nodes")
		.data(y).enter()
		.append("svg:circle")
		.attr("class", "radar-chart-serie"+series)
		.attr('r', cfg.radius)
		.attr("alt", function(j){return Math.max(j.value, 0)})
		.attr("cx", function(j, i){
		  dataValues.push([
			cfg.w/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.sin(-(i+0.5)*cfg.radians/total)),
			cfg.h/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.cos(-(i+0.5)*cfg.radians/total))
		]);
		return cfg.w/2*(1-(Math.max(j.value, 0)/cfg.maxValue)*cfg.factor*Math.sin(-(i+0.5)*cfg.radians/total));
		})
		.attr("cy", function(j, i){
		  return cfg.h/2*(1-(Math.max(j.value, 0)/cfg.maxValue)*cfg.factor*Math.cos(-(i+0.5)*cfg.radians/total));
		})
		.attr("data-id", function(j){return j.axis})
		.style("fill", function(d,i) { if (series == 0) {return cfg.color[0]} else if (series == 1) {return cfg.color[9]} }).style("fill-opacity", .9)
		.on('mouseover', function (d){
					newX =  parseFloat(d3.select(this).attr('cx')) - 10;
					newY =  parseFloat(d3.select(this).attr('cy')) - 5;

					z = "polygon."+d3.select(this).attr("class");
					g.selectAll("polygon")
						//.transition(200)
						.style("fill-opacity", 0.1);
					g.selectAll(z)
						//.transition(200)
						.style("fill-opacity", .7);


				  })
		.on('mouseout', function(){
					g.selectAll("polygon")
						.style("fill-opacity", cfg.opacityArea);
				  })
		.append("svg:title")
		.text(function(j){return Math.max(j.value, 0)});

	  series++;
	});
    }
  }
};
