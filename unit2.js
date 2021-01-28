// Global fills
var selectedArea;
var selectedFill = '#05713a', normalFill = '#b6af9d', activeFill = 'rgb(5, 113, 58, 0.6)',
    boundaryFill = '#eeeeee';
var selectedTsp;

function moveTspCursor(isTownship) {
  if (isTownship == false) {
    d3.selectAll(".tspCursor").remove();
    return;
  } else {
    d3.selectAll(".tspCursor").remove();
    var mapSvg = d3.select('.mapSelector').select('svg');
    var areas = mapSvg.append('g').attr('class', 'tspCursor');
    var mercProjection = d3.geo.mercator()
      .scale(1200)
      .center([96.0785, 19.7633])
      .translate([220/2, 500/2]);
    var geoPath = d3.geo.path().projection(mercProjection);

    var tafTspName = areaNameFromDropdown('#subnationalDropdown');
    var mimuPcode;

    for (var i in tspData) {
      if (tspData[i]['township_name:taf'] == tafTspName) {
        mimuPcode = tspData[i]['township_pcode'];
      }
    }

    var coords;
    for (var j in tspCentroids['features']) {
      if (tspCentroids['features'][j]['properties']['TS_PCODE'] == mimuPcode) {
        coords = tspCentroids['features'][j]['geometry']['coordinates'];
      }
    }
    areas.append("circle")
      .attr("cx", mercProjection(coords)[0])
      .attr("cy", mercProjection(coords)[1])
      .attr("r", '0.4em')
      .attr("fill", "#05713a");
  }
}
function changeSelected(id) {
  // A bit hacky BUT pass id=False if id comes from dropdown
  if (id == false & unit2Township == false) {
    id = '#' + d3.select('#subnationalDropdown').property('value').split(' ')[0]; //.replace(/ /g, "");
    if (id == '#Nay') { id = '#NayPyiTaw'; }
  }

  if (selectedArea != undefined) {
    d3.select(selectedArea)
      .attr('fill', normalFill);
  }
  d3.select(id)
    .attr('fill', selectedFill);
  selectedArea = id;
}
function switchMap() {
  d3.select(selectedArea)
    .attr('fill', normalFill);
}
function drawMap(township) {
  var mapWidth = 220, mapHeight = 500;
  d3.select('.mapSelector').selectAll('svg').remove();
  var mapSvg = d3.select('.mapSelector')
    .append('svg')
    .attr('width', mapWidth)
    .attr('height', mapHeight);

  var areas = mapSvg.append('g');
  var mercProjection = d3.geo.mercator()
    .scale(1200)
    .center([96.0785, 19.7633])
    .translate([mapWidth/2, mapHeight/2]);
  var geoPath = d3.geo.path().projection(mercProjection);

  // Draw the map
  //drawMap(mapStateRegion.features, areas, geoPath, 1);
  var accessorForAreaName = 'ST';
  var accessorForPcode = 'ST_PCODE';
  areas.selectAll('path')
    .data([])
    .exit()
    .remove();

  var scrollOffset = -45;
areas.selectAll('path')
    .data(mapStateRegion.features)
    .enter()
    .append('path')
    .attr('id', (d) => (d.properties[accessorForAreaName].replace(/ /g, "")))
    .attr('fill', normalFill)
    .attr('stroke', boundaryFill)
    .attr('onclick', function(d) {
      var tafName=pcodeToTAF(d.properties[accessorForPcode]);
      var onClickFunc =
        `if (unit2Township == true) { return;}  drawSubNationChart("${tafName}", false, '.unit2RadarChart');
        d3.select('#subnationalDropdown').property('value', '${tafName}');
        drawSubnationBar("${tafName}", false, '.unit2BarChart');
        hideMedianInfo();
        changeSelected('#${d3.select(this).attr('id')}');`;

      return onClickFunc;
    })
    .on('mouseover', function(d,i) {
      if (selectedArea != '#'+d3.select(this).attr('id')) {
        d3.select(this).attr('fill', activeFill);
      }
    })
    .on('mouseout', function(d,i) {
      if (selectedArea != '#'+d3.select(this).attr('id')) {
        d3.select(this).attr('fill', normalFill);
      }
    })
    .attr('d', geoPath);
}

function drawSubNationChart(areaName, township, id) {
  var data, nameAccessor;
  if (township == true) {
    data = tspData;
    nameAccessor = 'township_name:taf';
  } else {
    data = srData;
    nameAccessor = 'state_name:taf';
  }
  // Find medians across all areas in level
  var medianData = {};
  var keys = Object.keys(data[0]);
  keys.splice(0, subDataSpliceIndex);
  for (var i in keys) {
    var medianValue = d3.median(data, function (d) {
       return d[keys[i]];
    });
    medianData[keys[i]] = medianValue;
  }
  // Find area-specific data
  for (var j in data) {
    if (data[j][nameAccessor] == areaName) {
      var areaData = data[j];
    }
  }
  var areaRadarData = reshapeForRadar(areaData);
  for (var k in areaRadarData[0]) {
    var subindexNum = +k+1;
    areaRadarData[0][k].median = medianData['sub'+subindexNum];
  }
  var radarChartOptions = {
    maxValue: 10,
    levels: 5,
    roundStrokes: false,
    median: true,
    spider: false
  };
  RadarChart.draw(id, areaRadarData, radarChartOptions);
}
function populateSubnationalDropdown(township, id) {
  d3.select(id)
    .selectAll('optgroup').remove();
  d3.select(id)
    .selectAll('option').remove();

  var data, nameAccessor, textAccessor;
  if (township == true) {
    data = tspData;
    nameAccessor = 'township_name:taf';
    textAccessor = nameAccessor;
    if (lang == 'MM') { textAccessor = 'township_name:mm'; }

    for (var i in srData) {
      var pcode = srData[i]['state_pcode'];
      d3.select(id)
        .append('optgroup')
        .attr('label', pcodeTranslate[pcode][lang])
        .attr('id', `optgroup${pcodeTranslate[pcode][lang].replace(/ /g, "")}`);
    }

    for (var j in tspData) {
        var statePcode = tspData[j]['township_pcode'];
        statePcode = statePcode.slice(0,6);
        d3.select(`#optgroup${pcodeTranslate[statePcode][lang].replace(/ /g, "")}`)
          .append('option')
          .attr('value', tspData[j][nameAccessor])
          .text(tspData[j][textAccessor]);
    }


    return;
  } else {
    data = srData;
    nameAccessor = 'state_name:taf';
    textAccessor = nameAccessor;
    if (lang == 'MM') { textAccessor = 'state_name:mm'; }
  }

  d3.select(id)
    .selectAll('option')
    .data(data)
    .enter()
    .append('option')
    .attr('value', function (d) {
      return d[nameAccessor];
    })
    .text(function (d) {
      return d[textAccessor];
    });
}


function areaNameFromDropdown(id) {
  return d3.select(id).property("value");
}

function pcodeToTAF(pcode, township) {
  var data, nameAccessor, pcodeAccessor;
  if (township == true) {
    data = tspData;
    pcodeAccessor = 'township_pcode';
    nameAccessor = 'township_name:taf';
  } else {
    data = srData;
    pcodeAccessor = 'state_pcode';
    nameAccessor = 'state_name:taf';
  }

  for (var i in data) {
    if (data[i][pcodeAccessor] == pcode) {
      return data[i][nameAccessor];
    }
  }
}

function drawSubnationBar(areaName, township, id) {
  var data, nameAccessor;
  if (township == true) {
    data = tspData;
    nameAccessor = 'township_name:taf';
  } else {
    data = srData;
    nameAccessor = 'state_name:taf';
  }

  // Reshape data
  var row;
  for (var i in data) {
    if (data[i][nameAccessor] == areaName) {
      row = data[i];
    }
  }

  var keys = Object.keys(row);
  keys.splice(0, subDataSpliceIndex);

  var barData = [];
  for (var j in keys) {
    var barRow = {};
    barRow.label = keyTranslations[lang][keys[j]];
    barRow.value = +row[keys[j]];
    barData.push(barRow);
  }

  barChart(barData, id, {});
}

function reshapeForUnit2BarChart(data, township) {
  var retData = [], nameAccessor;

  if (township == true) {
    nameAccessor = 'township_name:taf';
  } else {
    nameAccessor = 'state_name:taf';
  }

  for (var i in data) {
    var row = {};
    row.label = data[i][nameAccessor];
    row.value = data[i][valueAccessor];
    retData.push(row);
  }

  return retData;
}

function showMedianInfo() {
  d3.select('.unit2RadarChart').select('svg')
    .append('svg:text')
    .attr('id', 'medianInfo')
    .attr('x', (275+190) * 0.5)
    .attr('y', 360)
    .attr('text-anchor', 'middle')
    .attr('font-style', 'italic')
    .text(copy['medianInfo'][lang])
    .style('font-size', '0.8em')
    .style('display', 'inline')
    .style('opacity', '0.8');
}
function hideMedianInfo() {
  d3.select('#medianInfo').style('display','none');
}
