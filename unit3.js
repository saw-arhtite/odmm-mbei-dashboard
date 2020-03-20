/* Allows toggling between state/region and Townships
based on the given dataset */
function setAreaLevel(targetDataset, unitSelector, township) {
  // Empty out the old dropdown options
  var nameVar, textVar;
  d3.select(unitSelector)
    .select("#areaSelector")
    .selectAll("select")
    .selectAll('option').remove();

  d3.select(unitSelector)
    .select('#areaSelector')
    .selectAll('select')
    .selectAll('optgroup').remove();

  if (township == true) {
    nameVar = 'township_name:taf';
    textVar = nameVar;
    if (lang=='MM') { textVar = 'township_name:mm';}
    for (var i in srData) {
      var pcode = srData[i]['state_pcode'];
      d3.select('#areaSelector')
        .selectAll('select')
        .append('optgroup')
        .attr('label', pcodeTranslate[pcode][lang])
        .attr('id', `optgroup2${pcodeTranslate[pcode][lang].replace(/ /g, "")}`);
    }

    for (var j in tspData) {
        var statePcode = tspData[j]['township_pcode'];
        statePcode = statePcode.slice(0,6);
        d3.selectAll(`#optgroup2${pcodeTranslate[statePcode][lang].replace(/ /g, "")}`)
          .append('option')
          .attr('value', tspData[j][nameVar])
          .text(tspData[j][textVar]);
    }
    return;
  } else {
    nameVar = 'state_name:taf';
    textVar = nameVar;
    if (lang == 'MM') { textVar = 'state_name:mm';}
  }



  // Populate the dropdown options with new data
  d3.select(unitSelector)
    .select("#areaSelector")
    .selectAll("select")
    .selectAll("option")
    .data(targetDataset)
    .enter()
    .append("option")
    .attr("value", function(d) { return d[nameVar]; } )
    .text(function(d) { return d[textVar]; });
}

/* Call this func whenever the data changes to update RadarChart */
function changeRadar(selectorOne, selectorTwo, township) {
  var nameVar = "";
  var data = {};
  if (township == true) {
    nameVar = 'township_name:taf';
    data = tspData;
  } else {
    nameVar = 'state_name:taf';
    data = srData;
  }
  // Subset original data based on selection
  var newArea = d3.select(selectorOne).property("value");
  var otherArea = d3.select(selectorTwo).property("value");
  var newData = subsetSummaryByArea([newArea, otherArea], data, nameVar);

  // Reshape subset to fit to radarChart.js input
  var radarData = reshapeForRadar(newData);

  // Prepare chart
  var radarChartOptions = {
    maxValue: 10,
    levels: 5,
    roundStrokes: false,
    spider: true
  };
  RadarChart.draw(".radarChart", radarData, radarChartOptions);

}

/* Note that each row in the dataset represents a single area.
@Given a list of areas and the original dataset,
@Returns only the rows specified by the list of areas */
function subsetSummaryByArea(areaList, data, nameVar) {
  var returnData = [];
  for (var i in areaList) {
    for (var j in data) {
      if (areaList[i] == data[j][nameVar]) {
        returnData.push(data[j]);
      }
    }
  }
  return returnData;
}

/* @Given a list of rows,
@Returns a list of list of dicts as required by RadarChart.js*/
function reshapeForRadar(origData) {

  var radarData = [];
  if (origData.length == undefined) {
    origData = [origData];
  }
  var keys = Object.keys(origData[0]);

  // We don't need to use all data fields for radarChart,
  // so we remove some columns
  keys.splice(0,subDataSpliceIndex);

  for (i in origData) {
    radarData.push([]);
    // TODO: Get rid of non axes
    for (j in keys) {
      var value = +origData[i][keys[j]];
      radarData[i].push({"axis": starburstLegend[lang][keys[j]],
        "value": value});
    }
  }
  return radarData;
}
