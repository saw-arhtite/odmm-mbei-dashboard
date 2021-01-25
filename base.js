// TODO unit4Township needs to be declared outside the function?

var unit2Township = false;
var unit3Township = false;
var unit4Township = false;

// Draw the Dashboard

function draw_charts() {
  
     //Unit 1
      var unit1BarData = reshapeForUnit1BarChart(srData);
      drawNationChart(false, ".unit1RadarChart");
      barChart(unit1BarData, ".unit1BarChart", { tiers: true });
      drawLegend();

      //Unit 2
      drawMap();
      //var unit2Township = false;
      populateSubnationalDropdown(unit2Township, "#subnationalDropdown");
      drawSubNationChart(
        areaNameFromDropdown("#subnationalDropdown"),
        unit2Township,
        ".unit2RadarChart"
      );
      drawSubnationBar(
        areaNameFromDropdown("#subnationalDropdown"),
        unit2Township,
        ".unit2BarChart"
      );
      showMedianInfo();

      // Unit 3
      var unit3Township = false;
      setAreaLevel(srData, ".unit3");
      changeRadar("#select1", "#select2", unit3Township);
      // Unit 4
      var currentSubindex = "sub1";
      var unit4Township = false;
      generateSubindexButtons(".unit4Buttons");
  
 // TODO Really strange chain function calls?        
  drawSubindexBar(
        ".unit4BarChart",
        buildBarData(unit4Township, "Overall Score")
      );
      changeSubindexTitle("Overall Score");

}


// Simple function to switch 2020-2019 datasets
      function switch_dataset(year) {
        if (year == "2019") {
          // Enable 2020 button and disable 2019 button
          d3.select("#button2020").attr("disabled", null);
          d3.select("#button2019").attr("disabled", true);
          srData = d3.csv.parse(mbei_stateregion_2019);
          tspData = d3.csv.parse(mbei_township_2019);
        } else {
          // Enable 2019 button and disable 2020 button
          d3.select("#button2019").attr("disabled", null);
          d3.select("#button2020").attr("disabled", true);
          srData = d3.csv.parse(mbei_stateregion);
          tspData = d3.csv.parse(mbei_township);
        }
     
       //TODO Force remove the previous svg. This needes to be handled with barChart function
        d3.select(".unit1RadarChart").select("svg").remove();
        d3.select(".unit1BarChart").select("svg").remove();
        d3.select(".unit2RadarChart").select("svg").remove();
        d3.select(".unit2BarChart").select("svg").remove();
        d3.select(".unit4BarChart").select("svg").remove()

        draw_charts();
      }