      //Main citation: these code main inspired by internet link below, the cartogram function is a JavaScript implementation of an algoritm to construct continuous area cartograms, by James A. Dougenik et al(https://github.com/emeeks/d3-cartogram).
      //And some functions implement function came from the link http://prag.ma/code/d3-cartogram/ (author: Shawn Allen https://stamen.com/alumni/) and some other important citations such as d3 gallery and other link are included below
      //http://andrewerrity.com/d3-project/ and https://limn.co.za/2013/10/making-a-cartogram/#more-297 and https://schuelerzahlen-zuerich.opendata.iwi.unibe.ch/App2/d3geo-2/ch_var/index.html#pop_female/1991
      //and http://dev.centrogeo.org.mx/viz_desaparecidos/lib/d3-cartogram/?segmentized#intlmig/2011

      //The former effect of this page used a fisheye obj to change the SVG edges(https://wangshiru.gitlab.io/2021/11/28/%E4%B8%AD%E5%9B%BD%E5%9C%B0%E5%9B%BE%E7%9A%84%E9%B1%BC%E7%9C%BC%E8%A7%86%E5%9B%BE/#index-html)
      //However, that only consider the value, didn't consider the wards' area, so based on this situation, I reuse the cartogram function to remake the effects.

      window.onload = function() {changeMapColor();refresh();};// Trigger the reset and colour change functions after the page be refreshed.
      window.onhashchange = function() {FreshAndDrawHcMap();}; // Call the url hash update function.
      d3.selectAll(".shell div span").on("click", function() { //Change the url and introduction text according to the user clicked object
        document.getElementById("introduction").innerHTML = getIntroContentById(d3.select(this).attr("id")); //Because of echarts, so don't use the key value but use the id
        location.hash = "#" + d3.select(this).attr("id"); //bind the id of the topkey to the window's url, citation link: http://andrewerrity.com/d3-project/
      });
      var colour_map = {"1": "#5470c6", "2": "#91cd77", "3": "#f9c956"}; //Defines the fill color for the region categories (East, Central, West)

      function getIntroContentById(id) { //Introductory text of the indexes
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
            "topgreen": "The map shows the green space availability rate in 21 wards,calculated by the percentage of house (which is easier for people to get in touch with green space) in each wards",
            "topcrime": "The map shows the crime density (km2) in 2022 in 21 wards, please hover the mouse to know more information about specific region",
            "topinc": "The map shows the income deprivation rate in 21 wards, please hover the mouse to know more information about specific region",
            "topempo": "The map shows the number people who are employed in 21 wards, please hover the mouse to know more information about specific region"};
            return introHTML[id] || ""; //return intro text
        }

      Indexes = [ //Contains indexes from web pages，citation link: http://prag.ma/code/d3-cartogram/
        {index: "(no scale)", id: "none"},
        {index: "population", id: "toppop", key: "Population"},
        {index: "population density(km2)", id: "topden", key: "PopulationDensity"},
        {index: "crime cases(per km2)", id: "topcrime", key: "Crime"},
        {index: "high education rate", id: "topedu", key: "EducationLevel"},
        {index: "health rate", id: "topheal", key: "Health"},
        {index: "religions rate", id: "topreg", key: "Religions"},
        {index: "average age", id: "topage", key: "Age"},
        {index: "language diversity rate", id: "toplang", key: "Language"},
        {index: "house ownership rate", id: "tophouse", key: "Housing"},
        {index: "long work distance rate", id: "topTrans", key: "WorkDistance"},
        {index: "green availability rate", id: "topgreen", key: "GreenAvail"},
        {index: "income deprivation rate", id: "topinc", key: "IncomeDeprivation"},
        {index: "employment rate", id: "topempo", key: "Employment"},
      ],

      IndexesById = d3.nest().key(function(d) { return d.id; }).rollup(function(d) { return d[0]; }).map(Indexes), //Convert Indexes array into obj with id
      SelectedIndex = Indexes[0]; //Initialize user selected object，id is null
      var map = d3.select("#map-hc"); //Map initialization。citation: https://stackoverflow.com/questions/27738692/cartogram-using-angularjs-and-d3-typeerror-undefined-is-not-a-function
      var proj = d3.geo.albers().origin([-0.158,51.6]).scale(570000).translate([400,250]); // create an albers projection obj, a geographic oblique angle projection function,convert geographic coordinates to screen coordinates.citation: https://vimsky.com/examples/usage/d3-js-geoalbers-function.html
      var path = d3.geo.path().projection(proj); //Create a geographic path generator that converts geographic data into SVG paths
      var wards_p = map.append("g").attr("id", "layer").append("g").attr("id", "wards_p").selectAll("path");
      var carto = d3.cartogram().projection(proj).properties(function(d) {return dataById[d.id];}).value(function(d) {return +d.properties[SelectedIndex];}); //Call the cartogram function to configure the obj, attribute extraction, and attribute value extraction functions respectively.
      d3.json("data/uk.topojson", function(topo) { // Process topojson files and bind data objects，citation: https://vimsky.com/examples/usage/d3-js-json-function.html
        HC_topo_json = topo;
        HCgeo = HC_topo_json.objects.wards_p.geometries; //geometries path
        d3.csv("data/HCdata.csv", function(data) { //Reading HC area actual business data, not work var formatValue = d3.format(".3f");
          dataById = d3.nest().key(function(d) { return d.NAME; }).rollup(function(d) { return d[0]; }).map(data);//Read and process csv data,group by wards name
          PageInitial();
        });
      });

      //init function for initialising the map elements.
      function PageInitial(){
        var features = carto.features(HC_topo_json, HCgeo),path = d3.geo.path().projection(proj);
        wards_p = wards_p.data(features).enter().append("path").attr("class", "county").attr("d", path) //bind the path and attributes, such as color
            .attr("id", function(d) {return d.properties.NAME;})
            .attr("fill", function (m) {return colour_map[m.properties.Category]});//Initial fill is Haringey's East, Central and West regional category colors
        wards_p.append("title"); //hover tip
        FreshAndDrawHcMap();
      }

      //Change fill colour
      function changeMapColor() {
        var selectBox = document.getElementById("shadeSelect");  // Get the value of the checkbox
        var selectedValue = selectBox.options[selectBox.selectedIndex].value;
        if (selectedValue === "Category"){ // Update map colours according to selected indicators
            var listHTML = "<p>"+"<span style='background:"+colour_map["1"]+";'></span>"+"<span>West Borough</span>"+"</p>"+"<p>"+"<span style='background:"+colour_map["2"]+";'></span>"+"<span>Central Borough</span>"+"</p>"+"<p>"+"<span style='background:"+colour_map["3"]+";'></span>"+"<span>East Borough</span>"+"</p>";  //initialise the shade area color explain
            document.getElementById("shadecolor_explain").innerHTML = listHTML;
            wards_p.transition().duration(700).attr("fill", function (e) {
            return colour_map[e.properties.Category];});
        }else{
            var dataArray = Object.values(dataById); //Because I wanna to sort the data, first convert the data to an object type.
            x = dataArray.sort((a, b) => a[selectedValue] - b[selectedValue]);
            console.log(x)
            var ShadeColor = ["#487eb0", "#5352ed", "#c23616"];
            wards_p.transition().duration(700).attr("fill", function (d, i) { //Sort the data into three groups and assign different colours to them.
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

      //reset element is responsible for the orientation of the page after it has been refreshed.
      function refresh() {
        var features = carto.features(HC_topo_json, HCgeo), path = d3.geo.path().projection(proj); // citation: https://limn.co.za/2013/10/making-a-cartogram/#more-297
        wards_p.data(features).transition().duration(700).attr("fill", function (e) {return colour_map[e.properties.Category]}).attr("d", path); //reset map effect
        document.getElementById("introduction").innerHTML = "The map shows the information in Haringey 21 wards, please click top indexes or hover the mouse to the map to get the information"; //shade color introduction
        wards_p.select("title").text(function(d) {return d.properties.NAME;});//reset hover tip
        window.location.hash = "#none/"; //reset url to none
        document.getElementById("shadeSelect").value = "Category"; //Reset map fill color
        var listHTML = "<p>"+"<span style='background:"+colour_map["1"]+";'></span>"+"<span>West Borough</span>"+"</p>"+"<p>"+"<span style='background:"+colour_map["2"]+";'></span>"+"<span>Central Borough</span>"+"</p>"+"<p>"+"<span style='background:"+colour_map["3"]+";'></span>"+"<span>East Borough</span>"+"</p>";  //initialise the shade area color explain
        document.getElementById("shadecolor_explain").innerHTML = listHTML;
      }

      function FreshAndDrawHcMap() { //fresh function change the map by url，citation link: http://prag.ma/code/d3-cartogram/
        var desiredSelectedIndexId = location.hash.substr(1).split("/")[0]; //Get the index selected by the user
        SelectedIndex = IndexesById[desiredSelectedIndexId] || Indexes[0];
        d3.selectAll(".shell div span").property("selectedIndex", Indexes.indexOf(SelectedIndex));
        if (SelectedIndex.id === "none") {refresh();} //If none, reset the map
        else {
          selecteddata = d => +d.properties[SelectedIndex.key]; //If none, reset the map
          temp = wards_p.data().map(selecteddata).filter(n => !isNaN(n)).sort(d3.ascending); //Arrange in ascending order to facilitate creation of scale bars
          scale = d3.scale.linear().domain([temp[0], temp[temp.length - 1]]).range([1, 100]); //Create a linear scale object for map effect transformation
          carto.value(d => scale(selecteddata(d)));//data mapping
          if(SelectedIndex.id !== 'toppop' && SelectedIndex.id !== 'topden' && SelectedIndex.id !== 'topcrime' && SelectedIndex.id !== 'topage'){ //hover tip, if the indicator is a percentage type, tip output +%
          wards_p.data(carto(HC_topo_json, HCgeo).features).select("title").text(d => [d.properties.NAME+" "+SelectedIndex.index+": "+selecteddata(d)+"%"]);}
          else{wards_p.data(carto(HC_topo_json, HCgeo).features).select("title").text(d => [d.properties.NAME+" "+SelectedIndex.index+": "+selecteddata(d)]);}
          wards_p.transition().duration(700).attr("d", carto.path); //Bind new path
        }
      }
