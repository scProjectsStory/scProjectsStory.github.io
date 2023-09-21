      //Main citation: these code main inspired by internet link below, some functions simulate these visualisations,main from the first link
      //https://limn.co.za/2013/10/making-a-cartogram/#:~:text=d3.cartogram%20uses%20d3.topojson%20to%20create%20the%20features%20data,like%20this%3A%20var%20features%20%3D%20carto.features%20%28topology%2C%20geometries%29
      //https://schuelerzahlen-zuerich.opendata.iwi.unibe.ch/App2/d3geo-2/ch_var/index.html#pop_female/1991
      //And the catogram function came from : https://github.com/emeeks/d3-cartogram

      window.onload = function() {changeMapColor();refresh();};// Trigger the reset and colour change functions after the page be refreshed.
      window.onhashchange = function() {DrawHcMap();}; // Call the url hash update function.
      var colour_map = {"1": "#5470c6", "2": "#91cd77", "3": "#f9c956"};

      function getIntroContentById(id) {
          var introHTML = {
            "toppop": "The map represents population's weight of 21 wards in Haringey (By ONS census), the data displayed by hovering the mouse over the map indicates the population number.",
            "topden": "The map represents population density per square's weight of 21 wards in Haringey, the data displayed by hovering the mouse over the map indicates the population density(km2).",
            "topedu": "The map shows the educated rate in 21 wards in Haringey, the data displayed by hovering the mouse over the map indicates the rate of people who have Level 1 and entry level qualifications",
            "topheal": "The maps shows the percentage weight of the population in 21 wards that is very healthy (calculated by ONS), the data displayed by hovering the mouse over the map indicates the rate",
            "topreg": "The maps shows the percentage weight of the population who have a religion (calculated by census), the data displayed by hovering the mouse over the map indicates the rate",
            "topage": "The maps shows the percentage weight of the population average in 21 wards, please hover the mouse to know more information about specific region",
            "toplang": "The maps shows the people's number who do not use the English, please hover the mouse to know more information about specific region",
            "tophouse": "The map shows the House ownership in 21 wards, please hover the mouse to know more information about specific region",
            "topTrans": "The map shows the percentage of people who need have more than 2 km work distance in each wards, please hover the mouse to know more information about specific region",
            "topgreen": "The map shows the green space availability in 21 wards,calculated by the percentage of house (which is easier for people to get in touch with green space) in each wards",
            "topcrime": "The map shows the crime density (km2) in 2022 in 21 wards, please hover the mouse to know more information about specific region",
            "topinc": "The map shows the average income score in 21 wards, please hover the mouse to know more information about specific region",
            "topempo": "The map shows the number people who are employed in 21 wards, please hover the mouse to know more information about specific region"};
            return introHTML[id] || ""; //return intro text
        }

      Indexes = [
        {name: "(no scale)", id: "none"},
        {name: "Population", id: "toppop", key: "Population"},
        {name: "PopulationDensity", id: "topden", key: "PopulationDensity"},
        {name: "Crime", id: "crime", key: "topcrime"},
        {name: "EducationLevel", id: "topedu", key: "EducationLevel"},
        {name: "Health", id: "topheal", key: "Health"},
        {name: "Religions", id: "topreg", key: "Religions"},
        {name: "Age", id: "topage", key: "Age"},
        {name: "Language", id: "toplang", key: "Language"},
        {name: "Housing", id: "tophouse", key: "Housing"},
        {name: "WorkDistance", id: "topTrans", key: "WorkDistance"},
        {name: "GreenAvail", id: "topgreen", key: "GreenAvail"},
        {name: "IncomeDeprivation", id: "topinc", key: "IncomeDeprivation"},
        {name: "Employment", id: "topempo", key: "Employment"},
      ],

      IndexesById = d3.nest().key(function(d) { return d.id; }).rollup(function(d) { return d[0]; }).map(Indexes), //Assignment data key-value pairs
      field = Indexes[0],
      colors = colorbrewer.RdYlBu[3].reverse().map(function(rgb) { return d3.hsl(rgb); });
      var body = d3.select("body");
      const Indexeselect = d3.selectAll(".shell div span"); //return the id of the topkey after selecting the data
      Indexeselect.on("click", function() {
        const clickedElement = d3.select(this);
        const elementId = clickedElement.attr("id");
        document.getElementById("introduction").innerHTML = getIntroContentById(d3.select(this).attr("id")); //Because of echarts, so don't use the key value but use the id
        location.hash = "#" + elementId; //bind the id of the topkey to the url
      });

      //Change fill colour
      function changeMapColor() {
        var selectBox = document.getElementById("shadeSelect");  // Get the value of the checkbox
        var selectedValue = selectBox.options[selectBox.selectedIndex].value;
        if (selectedValue === "Category") {    // Update map colours according to selected indicators
            var listHTML = "<p>"+"<span style='background:"+colour_map["1"]+";'></span>"+"<span>West Borough</span>"+"</p>"+"<p>"+"<span style='background:"+colour_map["2"]+";'></span>"+"<span>Central Borough</span>"+"</p>"+"<p>"+"<span style='background:"+colour_map["3"]+";'></span>"+"<span>East Borough</span>"+"</p>";  //initialise the shade area color explain
            document.getElementById("shadecolor_explain").innerHTML = listHTML;
            counties.transition().duration(700).attr("fill", function (e) {
            return colour_map[e.properties.Category];});
        }else{
            var dataArray = Object.values(dataById); //Because I wanna to sort the data, first convert the data to an object type.
            x = dataArray.sort((a, b) => a[selectedValue] - b[selectedValue]);
            console.log(x)
            var ShadeColor = ["#487eb0", "#5352ed", "#c23616"];
            counties.transition().duration(700).attr("fill", function (d, i) { //Sort the data into three groups and assign different colours to them.
                var dataIndex = x.indexOf(dataById[d.properties.NAME]);
                var colorIndex = Math.floor(dataIndex / 7); //A total of 21 wards in groups of 7
                return ShadeColor[colorIndex];});
        }
        var dataArray = Object.values(dataById); // because to sort the data first convert the data to an object type
        if(selectedValue=="Category"){var listHTML = "<p>"+"<span style='background:"+colour_map["1"]+";'></span>"+"<span>West Borough</span>"+"</p>"+"<p>"+"<span style='background:"+colour_map["2"]+";'></span>"+"<span>Central Borough</span>"+"</p>"+"<p>"+"<span style='background:"+colour_map["3"]+";'></span>"+"<span>East Borough</span>"+"</p>";}  //initialise the shade area color explain
        else{var listHTML = "<p>"+"<span style='background:"+ShadeColor[0]+";'></span>"+"<span>Smaller than "+dataArray[7][selectedValue]+"</span>"+"</p>"+"<p>"+"<span style='background:"+ShadeColor[1]+";'></span>"+"<span>Between"+dataArray[7][selectedValue]+" and "+dataArray[15][selectedValue]+"</span>"+"</p>"+"<p>"+"<span style='background:"+ShadeColor[2]+";'></span>"+"<span>More than"+dataArray[15][selectedValue]+"</p>";}
        document.getElementById("shadecolor_explain").innerHTML = listHTML;
            switch (selectedValue) { //The shade index explain text
              case "Category":shadeHTML = "The Haringey can be divided into 3 regions (west/center/east) based on the railway line. The shade color of the map shows the region of the wards in Haringey.";break;
              case "Emission":shadeHTML = "The shaded ShadeColor on the map show the percentage of households in each ward that do not have a car at home.";break;
              case "Average IMD index":shadeHTML = "The shade color of the map shows the IMD index (whole UK) of the wards.";break;
              case "Population change":shadeHTML = "The shade color of the map shows the population changes (%) of the ward.";break;
            }
        document.getElementById("shade_explain").innerHTML = shadeHTML; //return it to html by id

      }

      var map = d3.select("#map-hc");
      var proj = d3.geo.albers() .origin([-0.158,51.6]).scale(570000).translate([400,250]); //albers projection, geographic oblique angle projection function，citation: https://vimsky.com/examples/usage/d3-js-geoalbers-function.html
      var path = d3.geo.path().projection(proj);
      var layer = map.append("g").attr("id", "layer"), // Setting up the data binding layer
          counties = layer.append("g").attr("id", "counties").selectAll("path");
      var topology,geometries,rawData,dataById = {},
          carto = d3.cartogram().projection(proj).properties(function(d) {return dataById[d.id];}).value(function(d) {return +d.properties[field];});
      var segmentized = location.search === "?segmentized",
          url = ["data","uk.topojson"].join("/");
      d3.json(url, function(topo) { //Reading HC area actual business data
        topology = topo;
        geometries = topology.objects.counties.geometries;
        d3.csv("data/HCdata.csv", function(data) {
          rawData = data;
          dataById = d3.nest().key(function(d) { return d.NAME; }).rollup(function(d) { return d[0]; }).map(data);
          init();
        });
      });

      //init function is responsible for initialising the page elements.
      function init() {
        var features = carto.features(topology, geometries), // map built
            path = d3.geo.path().projection(proj);
        counties = counties.data(features).enter().append("path").attr("class", "county") //give it path and color
            .attr("id", function(d) {return d.properties.NAME;})
            .attr("fill", function (e) {return colour_map[e.properties.Category]})
            .attr("d", path);
        counties.append("title");
        DrawHcMap();
      }

      //reset element is responsible for the orientation of the page after it has been refreshed.
      function refresh() {
        var features = carto.features(topology, geometries),
            path = d3.geo.path().projection(proj);
        counties.data(features).transition().duration(700).attr("fill", function (e) { //Colouring the map with the area category after refreshing it
                return colour_map[e.properties.Category]
            })
            .attr("d", path);
        document.getElementById("introduction").innerHTML = "The map shows the information in Haringey 21 wards, please click top indexes or hover the mouse to the map to get the information"; //shade color introduction
        counties.select("title").text(function(d) {return d.properties.NAME;});
        window.location.hash = "#none/";
        var selectBox = document.getElementById("shadeSelect");  // Get the value of the select color
        selectBox.value = "Category";
        var listHTML = "<p>"+"<span style='background:"+colour_map["1"]+";'></span>"+"<span>West Borough</span>"+"</p>"+"<p>"+"<span style='background:"+colour_map["2"]+";'></span>"+"<span>Central Borough</span>"+"</p>"+"<p>"+"<span style='background:"+colour_map["3"]+";'></span>"+"<span>East Borough</span>"+"</p>";  //initialise the shade area color explain
        document.getElementById("shadecolor_explain").innerHTML = listHTML;
      }

      // The update function updates the map.
      function update() {
        body.classed("updating", true);
        var key = field.key.replace("%d",""),
            fmt = (typeof field.format === "function")? field.format: d3.format(field.format || ","),
            value = function(d) {return +d.properties[key];},
            values = counties.data().map(value).filter(function(n) {return !isNaN(n);}).sort(d3.ascending),
            LCI = values[0],
            HCI = values[values.length - 1];
        var scale = d3.scale.linear().domain([LCI, HCI]).range([1, 100]); //scale of change
        carto.value(function(d) {return scale(value(d));});
        var features = carto(topology, geometries).features;
        counties.data(features).select("title").text(function(d) {
              return [d.properties.NAME, fmt(value(d))].join(": ");
            });
        counties.transition().duration(700).attr("d", carto.path);
      }

      // The function, set delay time and use update function
      var DoUpdate = (function() {
          var timeout;
          return function() {
          var args = arguments;
          clearTimeout(timeout);
          return timeout = setTimeout(function() {update.apply(null, arguments);}, 10);
        };
      })();

      var hashish = d3.selectAll("a.hashish").datum(function() {return this.href;});

      // parse hash function to refresh URLs for overall map updates
      function DrawHcMap() {
        var parts = location.hash.substr(1).split("/"),
            desiredFieldId = parts[0];
        field = IndexesById[desiredFieldId] || Indexes[0];
        Indexeselect.property("selectedIndex", Indexes.indexOf(field));
        if (field.id === "none") {refresh(); }
        DoUpdate(); //do update
        hashish.attr("href", function(href) {return href + location.hash;});
      }