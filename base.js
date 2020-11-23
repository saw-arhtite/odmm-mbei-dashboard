      /* @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ */
      /* @@@@           Initializing         @@@@ */
/* @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ */
      /*
      var srData = d3.csv.parse(mbei_stateregion);
      var tspData = d3.csv.parse(mbei_township);
      var subDataSpliceIndex = 5; // how many columns to skip to reach 'sub1'
      var lang = "EN";

      renderText(lang);
      if (lang == "MM") {
        d3.selectAll(".copy").style("font-family", "Pyidaungsu !important");
      } else if (lang == "EN") {
        d3.selectAll(".copy").style("font-family", "Montserrat");
      }

      var tspTextAccessor = "",
        srTextAccessor = "";
      if (lang == "MM") {
        tspTextAccessor = "township_name:mm";
        srTextAccessor = "state_name:mm";
      } else if (lang == "EN") {
        tspTextAccessor = "township_name:taf";
        srTextAccessor = "state_name:taf";
      }
      tspData.sort(function (a, b) {
        return a[tspTextAccessor].localeCompare(b[tspTextAccessor]);
      });
      srData.sort(function (a, b) {
        return a[srTextAccessor].localeCompare(b[srTextAccessor]);
      });

      //Unit 1
      drawNationChart(false, ".unit1RadarChart");
      var unit1BarData = reshapeForUnit1BarChart(srData);
      barChart(unit1BarData, ".unit1BarChart", { tiers: true });
      drawLegend();

      //Unit 2
      drawMap();
      var unit2Township = false;
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
      drawSubindexBar(
        ".unit4BarChart",
        buildBarData(unit4Township, "Overall Score")
      );
      changeSubindexTitle("Overall Score");

      */

      /* @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ */
      /* @@@@ General purpose functions here @@@@ */
      /* @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ */

      // Simple function to switch 2020-2019 datasets
      function switch_dataset(year) {
        if (year == "2019") {
          // Enable 2020 button and disable 2019 button
          d3.select("#button2020").attr("disabled", null);
          d3.select("#button2019").attr("disabled", true);
          var srData = d3.csv.parse(mbei_stateregion_2019);
          var tspData = d3.csv.parse(mbei_township_2019);
        } else {
          // Enable 2019 button and disable 2020 button
          d3.select("#button2019").attr("disabled", null);
          d3.select("#button2020").attr("disabled", true);
          var srData = d3.csv.parse(mbei_stateregion);
          var tspData = d3.csv.parse(mbei_township);
        }

        //Redraw unit1Radarhart and unit1BarChart
        drawNationChart(false, ".unit1RadarChart");
        var unit1BarData = reshapeForUnit1BarChart(srData);
        //TODO Force remove the previous svg. This needes to be handled with barChart function
        d3.select(".unit1BarChart").select("svg").remove();
        barChart(unit1BarData, ".unit1BarChart", { tiers: true });
        drawLegend();
      }
      // NOTE: Function will break if township or stateregion values are not unique
      function lookup(toFind, searchVar, returnVar, township) {
        var returnList = [];
        var data = {};
        if (township == true) {
          data = tspData;
        } else {
          data = srData;
        }
        for (var i in toFind) {
          returnList.push(0);
        }
        // Loop through the data table
        for (i in data) {
          var item = data[i][searchVar];
          // See if each line contains the items we want to find
          for (var j in toFind) {
            if (item == toFind[j]) {
              // When found, return a list of translated items
              returnList[j] = data[i][returnVar];
            }
          }
        }
        return returnList;
      }
    
