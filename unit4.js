function generateSubindexButtons(id) {
  var barChartId = '.unit4BarChart';
  var subIndices = ['Overall Score'];
  var keys = Object.keys(keyTranslations[lang]);
  for (var i in keys) {
    subIndices.push(keys[i]);
  }
  d3.select(id).selectAll('select').remove();

  d3.select(id)
    .append('select')
    .attr('id', 'subindexSelector')
    .attr('class', 'copy')
    .attr("oninput", function (d) {
      return `var barData = buildBarData(unit4Township, findCurrSubindex());
      drawSubindexBar('${barChartId}', barData);
      changeSubindexTitle(findCurrSubindex());`;
    })
    .selectAll('option')
    .data(subIndices)
    .enter()
    .append('option')
    .text(function(d) {
      if (d == 'Overall Score') {
        if (lang == 'MM') { return "မြန့်မာ့စီးပွားရေးဝန်းကျင် ညွန်းကိန်းရမှတ်"; }
        return d;
      } else {
      return keyTranslations[lang][d];
      }
    })
    .attr("value", (d)=>(d));
}
function findCurrSubindex() {
  return d3.select('#subindexSelector').property('value');
}
function changeSubindexTitle(subindex) {
  if (subindex == "Overall Score") {
    if (lang == 'EN') {
      d3.select('.subindexName').text("Overall Score");
    } else if (lang == 'MM') {
      d3.select('.subindexName').text("မြန့်မာ့စီးပွားရေးဝန်းကျင် ညွန်းကိန်းရမှတ်");
    }
  } else {
    d3.select('.subindexName').text(keyTranslations[lang][subindex]);
  }
}

function drawSubindexBar(id, data) {
  var options = { hover: true,
    tiers: false,
    slider: unit4Township };
  barChart(data, id, options);
}

function buildBarData(township, subindex) {
  if (subindex == "Overall Score") {
    subindex = 'score';
  }
  var data, nameAccessor, barData = [];
  if (township == true) {
    data = tspData;
    nameAccessor = 'township_name:taf';
    if (lang == 'MM') { nameAccessor = 'township_name:mm';}
  } else {
    data = srData;
    nameAccessor = 'state_name:taf';
    if (lang == 'MM') { nameAccessor = 'state_name:mm';}
  }

  for (var i in data) {
    var barDataRow = {};
    barDataRow.label = data[i][nameAccessor];
    barDataRow.value = data[i][subindex];
    barData.push(barDataRow);
  }

  return barData;
}

function hideSlider() {
  d3.select('.unit4Slider').select('input').remove();
  d3.select('.unit4Slider').select('h4').remove();

}
