function barChart(data, id, options) {
  /* Configuring bar chart. Use defaults where caller has not supplied options. */
  var cfg = {
    mTop: 10,
    mRight: 30,
    mBottom: 130,
    mLeft: 40,
    baseWidth: 375,
    baseHeight: 350,
    circleRadius: 6,
    tiers: false,
    slider: false,
    tierColors: {1: 'rgba(89,57,108,1.0)', 2: 'rgba(89,57,108,0.75)',
      3: 'rgba(89,57,108,0.40)', 4: 'rgba(89,57,108,0.2)'}
  };

  if('undefined' !== typeof options){
    for(var i in options){
      if('undefined' !== typeof options[i]){
        cfg[i] = options[i];
      }
    }
  } // Note: From this point on, use config opendevelopmentmyanmar

  d3.select(id).select("svg").remove();

  cfg['width'] = cfg.baseWidth - cfg.mLeft - cfg.mRight;
  cfg['height'] = cfg.baseHeight - cfg.mTop - cfg.mBottom;

  /* Data manipulations and calculations */
  var maxValue = d3.max(data, function(d) {
    return d.value;
  });
  data.sort(function(a, b) {
    return b.value - a.value;
  });
  /* Build SVG */
  var parentSVG = d3.select(id)
    .append("svg")
      .attr("width", cfg.width + cfg.mLeft + cfg.mRight)
      .attr("height", cfg.height + cfg.mTop + cfg.mBottom)

  var svg = parentSVG.append("g")
      .attr("transform",
            `translate(${cfg.mLeft},${cfg.mTop})`);

  svg.append("g")
    .append("svg:rect")
    .attr("height", cfg.height)
    .attr("width", cfg.width)
    .attr("x", 0)
    .attr("y", 0)
    .attr("fill", "none");

  /* Build x axis */
  var yScale = d3.scale.linear()
    .domain([0, maxValue])
    .range([cfg.height, 0]);

  var xScale = d3.scaleBand()
    .range([0, cfg.width])
    .domain(data.map( function (d) {
      return d.label;
    }))
    .padding(1);

  var bottomLabels = svg.append('g')
    .attr('transform', `translate(0,${cfg.height})`)
    .call(d3.axisBottom(xScale))
    .selectAll("text") //not sure what this does
    .attr('transform', 'translate(-15,15)rotate(-90)')
    .attr('font-size', '1.2em')
    .style('text-anchor', 'end')
    .attr("class", "copy");

  /* Build y axis */


  svg.append('g')
    .call(d3.axisLeft(yScale))
    .selectAll("text")
    .attr('font-size', '1.25em');

  /* Build lines */
  var barWidth = cfg.width / data.length * 0.6;

  var yScalePositive = d3.scale.linear()
    .domain([0, maxValue])
    .range([0, cfg.height]);

  svg.selectAll('myBar')
    .data(data)
    .enter()
    .append("svg:rect")
    .attr('class', 'bar')
    .attr("x", "0")
    .attr("y", function(d) {
      return yScale(d.value);
    })
    .attr("width", barWidth)
    .attr("height", function(d) {
      return yScalePositive(d.value);
    })
    .attr("transform", function(d) {
      var xTranslate = xScale(d.label) - barWidth/2;
      return `translate(${xTranslate}, 0)`;
    })
    .attr("fill", function(d) {
      // Use tier colors if tiers exist
      if (cfg.tiers == true) {
        return cfg.tierColors[d.tier];
      } else {
      // Use only ONE color if tiers do not exist
        return cfg.tierColors[1];
      }
    });

  if (cfg.slider == true) {
    bottomLabels.remove();
    d3.select('.unit4Slider').select('input').remove();
    d3.select('.unit4Slider').select('#sliderInfo').remove();
    d3.select('.unit4Slider').select('h4').remove();

    parentSVG.attr("height", cfg.baseHeight - 0.7*cfg.mBottom);
    var Format = d3.format('.1f');
    var describe = d3.select('.unit4Slider').append('h4');
    var slider = d3.select('.unit4Slider')
      .append('input')
      .data([data])
      .attr('id', 'unit4Slider')
      .attr('type', 'range')
      .attr('step', 1)
      .style('width', '35em')
      .attr('min', 1)
      .attr('max', data.length)
      .attr('value', 1)
      .on('input', function(d) {
        var index = document.getElementById('unit4Slider').value -1;
        d3.select('#sliderInfo').style('color', 'white');
        svg.selectAll('.bar')
          .attr("fill", function(d,i) {
            if (i == index) {
              return '#f8bf42';
            } else {
              return cfg.tierColors[1];
            }
          });
        if (lang == 'EN') {
          describe.text(`${d[index].label} has a rank of ${index+1} with a score of ${Format(d[index].value)}`);
        } else if (lang == 'MM') {
          describe.text(`${d[index].label} သည် အဆင့် (${index+1}) ဖြစ်ပြီး ရမှတ် ${Format(d[index].value)} ရှိပါသည်`);
        }
      });

      d3.select('.unit4Slider')
        .append('p')
        .attr('id', 'sliderInfo')
        .text(copy.sliderInfo[lang])
        .style('opacity', '0.7');

    describe.text(function() {
      if (lang == 'EN') {
        return `${data[0].label} has a rank of 1 with a score of ${Format(data[0].value)}`;
      } else if (lang == 'MM') {
        return `${data[0].label} သည် အဆင့်(1) ဖြစ်ပြီး ရမှတ် ${Format(data[0].value)} ရှိပါသည်`;
      }
    });

    svg.select('.bar')
      .attr("fill", "#f58020");

  }
}
