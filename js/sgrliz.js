	var GlobalMapPathData = [];  //Used to store wards path data, coordinate data, area change indicators
	//Function to init data and html svg and basic function
	function init() {
		var ToolTips = d3.tip().attr("class","SvgTipBlock").html(function(d) {var area_value = HcWebData.find(function (data) {return d.properties.name === data["area label"];})[TipIndex];var html = "<div>" + d.properties.name + "</div>" + "<div><span>" + TipIndex + ":  " + area_value + "</span></div>";return html});  //set tip obj for the detailed info tip by d3, citation: https://stackoverflow.com/questions/58277723/show-tooltip-on-hover-using-d3-tip-js, https://schuelerzahlen-zuerich.opendata.iwi.unibe.ch/App2/d3geo-2/ch_var/map.js
		var HcSvg = d3.select('#HaringeyMapId').append('svg').attr('height', 600).attr('width', 1000).call(ToolTips);  //SVG containers initialization (square canvas 1000*600) and call tooltips object, citation: https://zhuanlan.zhihu.com/p/364966767 and another tooltip same as above
		d3.csv("hcdata.csv", function(data) { //Read and save Haringey csv data line by line
			HcWebData = data;
			HcWebData.forEach(function(item) {
			  for (var key in item) {
				if (key !== "area label" && key !== "Category") { //Filtering out character data
				  item[key] = Number(item[key]).toFixed(1);}}  //keep only one digit after the decimal point.
			});
			SVG();
		});

		// Function to get introduction content based on selected index's ID, for consistency with Echarts.js choose id instead of value.
		function getIntroContentById(id) {
		  var introHTML = {
			"toppop": "The map represents population's weight of 21 wards in Haringey (By ONS census)",
			"topden": "The map represents population density per square's weight of 21 wards in Haringey",
			"topedu": "The map shows the number of people who have been educated in 21 wards in Haringey (who have Level 1 and entry level qualifications)",
			"topheal": "The maps shows the percentage weight of the population in 21 wards that is very healthy (calculated by ONS)",
			"topreg": "The maps shows the percentage weight of the population who have a religion (calculated by census)",
			"topage": "The maps shows the percentage weight of the population average in 21 wards",
			"toplang": "The maps shows the people's number who do not use the English",
			"tophouse": "The map shows the House ownership in 21 wards",
			"topTrans": "The map shows the percentage of people who need have more than 2 km work distance in each wards",
			"topgreen": "The map shows the green space availability in 21 wards,calculated by the percentage of house (which is easier for people to get in touch with green space) in each wards",
			"topcrime": "The map shows the crime density (km2) in 2022 in 21 wards",
			"topinc": "The map shows the average income score in 21 wards",
			"topempo": "The map shows the number people who are employed in 21 wards"};
		  return introHTML[id] || ""; //return intro text
		}

		//Function to draw svg map and clean the origin SVG data
		function SVG() {  //make the svg map, citation: http://t.csdn.cn/KYiOa and https://blog.csdn.net/qq_29814417/article/details/105519889
			var hcproj = d3.geoNaturalEarth1().scale(400000).translate([1050, 362700])  //Projection method of d3.geoNaturalEarth1 and set enlargement ratio and translations in the x and y directions,citation: https://vimsky.com/examples/usage/d3-js-geonaturalearth1-function.html
		    HcSvg.append("g").selectAll("path").data(HaringeyGeoJson.features).enter().append("path")  //bind geojson data to path and bind it as group 'g' and so that it is easy to change the SVG map, citation: same as above
				.attr("d", d3.geoPath().projection(hcproj))  //geoPath Generator, use geoNaturalEarth1() method to change geojson to SVG paths(M+L+Z) and bind it as an attribute 'd'
				.attr("id", (d) => "_" + d.properties.id)  //set the path element id and make sure the id is a valid number so add '_'
				.attr("origindata", function(d) {  //in order to have the fisheye change(fisheye effect need a point, not a line) converting SVG paths (strings) to arrays and remove SVG path's M(moveto) and L(lineto) and Z(closepath), citation: https://blog.csdn.net/weixin_42484974/article/details/106024715
					 var OriginData = svgToDataArray(d3.select(this).attr("d"));
					 GlobalMapPathData.push({  //store all data in an array GlobalMapPathData for SVG change
						  id: "_" + d.properties.id,wards: d.properties.name, OriginSVG: OriginData, transformedSVG: [],});  // arrays for storing origin path and changed map data path
				})
				.on("mouseover",ToolTips.show)  //use of tooltip obj's show, citation: https://stackoverflow.com/questions/58277723/show-tooltip-on-hover-using-d3-tip-js
				.on("mouseout",ToolTips.hide)
				.style("stroke", "#fff");  //set the area borders to white
				var mapXYS = [{X:364,Y:255,size:153},{X:379,Y:219,size:122},{X:643,Y:240,size:104},{X:378,Y:387,size:137},{X:251,Y:293,size:163},{X:500,Y:399,size:172},{X:576,Y:397,size:97},{X:246,Y:399,size:200},{X:416,Y:345,size:146},{X:303,Y:336,size:101},{X:761,Y:240,size:141},{X:634,Y:382,size:73},{X:717,Y:366,size:105},{X:582,Y:360,size:113},{X:460,Y:428,size:118},{X:637,Y:316,size:92},{X:727,Y:301,size:96},{X:569,Y:301,size:130},{X:580,Y:224,size:129},{X:481,Y:232,size:116},{X:483,Y:290,size:133}];//Wards key coordinates and size, created by uk.js feature's cp, citation: http://t.csdn.cn/ZfbcU
				GlobalMapPathData.forEach((item, i) => Object.assign(item, mapXYS[i]));  //bind the center location and size to 21 wards SVG obj
				shadeChange(); //initially fill color, origin value is 3 regions(East/Center/West)
		}

		//Function to change the SVG path to array
	    function svgToDataArray(svgPathString) {
		  return svgPathString.substring(1).split("L").map(item => { //split L and use map function iterated all sub-data
		    item = item.split(",");
		    if (item.length > 1) { item[1] = item[1].slice(0, -1);} //take off last character Z
		    return item;});
	    }

		//Function to fresh the SVG path(changed)
		function PathChange(transformedSVGProp, dProp) { //the variable is the different attribute of GlobalMapPathData
		  for (var i = 0; i < GlobalMapPathData.length; i++) { //citation:https://juejin.cn/post/7002827433011314702, re-bind d to the path attribute of the map, ending in Z, and thanks zeng
			var transformedSvg = "M" + GlobalMapPathData[i][transformedSVGProp][0][0] + "," + GlobalMapPathData[i][transformedSVGProp][0][1];
			for (var j = 1; j < GlobalMapPathData[i][transformedSVGProp].length; j++) {
			  transformedSvg += "L" + GlobalMapPathData[i][transformedSVGProp][j][0] + "," + GlobalMapPathData[i][transformedSVGProp][j][1];}
			d3.select("#" + GlobalMapPathData[i].id).transition().duration(800).attr("d", transformedSvg + "Z");} //re-bind the origin path to each wards SVG d by id and iterate until all wards size changed, with 800ms caton and end with 'Z'
		}

		//For users' click to fresh the changed map, ps: echats's click is in html script for coding convenience
		d3.select(".shell div img")//Map change binded to user's click's on fresh button
		.on("click",function(){
			d3.selectAll(".shell div span").attr("class","").style("color","#555");//reset text color
			PathChange('OriginSVG', 'transformedSVG') //re-bind original SVG path to svg path
		});

		//For user's click on indexes
		d3.selectAll(".shell div span")
		.on("click",function(){
			  d3.selectAll(".shell div span").attr("class","").style("color","#555"); //clean the style of all indexes when the index is selected, and thanks for my friend Zeng's inspiration in this part
			  d3.select(this).style("color","#fff").attr("class","shellsel");  //and re-set selected index colour and set the background color
			  var key = TipIndex = d3.select(this).text(); //get user's click object's value
			  document.getElementById("introduction").innerHTML = getIntroContentById(d3.select(this).attr("id")); //Because of echarts, so don't use the key value but use the id
			  GlobalMapPathData.forEach(function(item) {item.transformedSVG = item.OriginSVG.map(function(coords) {return coords.slice();});});  //copy original path data first for not overlap the effect
			  for(var n=0;n<GlobalMapPathData.length;n++){  //Normalisation of data to reflect variability for each wards, normalised click index's values by dividing max value(that can change the value between [0,1])
			  	var matchData = HcWebData.find(function(data) {return data["area label"] === GlobalMapPathData[n].wards;}); // find wards data
			  	var normalised_value = matchData[key] / d3.max(HcWebData, (item) => Number(item[key])); //make normalised value
			  	var fisheye = d3.fisheye.circular().distortion(4).focus([GlobalMapPathData[n].X,GlobalMapPathData[n].Y]).radius(matchData.Area*normalised_value*100)  //define fisheye focus wards' center  and the change degree 4 and radius, citation: https://github.com/duaneatat/d3-fisheye and https://wangshiru.gitlab.io/2021/11/28/%E4%B8%AD%E5%9B%BD%E5%9C%B0%E5%9B%BE%E7%9A%84%E9%B1%BC%E7%9C%BC%E8%A7%86%E5%9B%BE/#%E5%B7%A5%E5%85%B7
				for(var i=0;i<GlobalMapPathData.length;i++){  //Coordinate transformation, citation same as above
					for(var j=0;j<GlobalMapPathData[i].transformedSVG.length;j++){
						var obj = {x:GlobalMapPathData[i].transformedSVG[j][0],y:GlobalMapPathData[i].transformedSVG[j][1]};  //bind original coordinates
						GlobalMapPathData[i].transformedSVG[j][0] = fisheye(obj).x;  //transformation of the fisheye effect of X and Y on the original coordinates, citation: http://panometer.org/instruments/teletherms/?window=25&var=maxT&year=1914&city=BURLINGTON%20WSO%20AP,%20VT
						GlobalMapPathData[i].transformedSVG[j][1] = fisheye(obj).y;}}
			  }
				PathChange('transformedSVG', 'OriginSVG');  //re-bind new SVG path to svg path and wards boundary will change respectively
		})
	}//END of initialization function

	//Function to fill shade color
	function shadeChange(){
			var ShadeColor = ["#5470c6","#91cd77","#f9c956","#487eb0", "#5352ed", "#c23616"];  //For shade color change
			var selected_color = document.getElementById("shadeSelect").value;
			HcWebData.sort((a, b) => a[selected_color] - b[selected_color]); //Sort the ward to a increase rank,citation: https://blog.csdn.net/qq_42376617/article/details/106398432
			for (let i = 0; i < HcWebData.length; i++) {
			  if(selected_color=='Category'){var shade_color = i < 7 ? ShadeColor[0] : i < 15 ? ShadeColor[1] : ShadeColor[2]; }//classify the sorted wards' color, 21 wards total, divided by 7-15-21, totally 3 groups
			  else{var shade_color = i < 7 ? ShadeColor[3] : i < 15 ? ShadeColor[4] : ShadeColor[5]; } //for other attributes
			  var mapPath = GlobalMapPathData.find(path => path.wards === HcWebData[i]["area label"]); //find matching ward
			  d3.select("#" + mapPath.id).transition().duration(800).attr("fill", shade_color); //fill the color based on there assigned color, citation: https://www.coder.work/article/3863344
			}
			if(selected_color=="Category"){var listHTML = "<p>"+"<span style='background:"+ShadeColor[0]+";'></span>"+"<span>West Borough</span>"+"</p>"+"<p>"+"<span style='background:"+ShadeColor[1]+";'></span>"+"<span>Central Borough</span>"+"</p>"+"<p>"+"<span style='background:"+ShadeColor[2]+";'></span>"+"<span>East Borough</span>"+"</p>";}  //initialise the shade area color explain
			else{var listHTML = "<p>"+"<span style='background:"+ShadeColor[0]+";'></span>"+"<span>Smaller than "+HcWebData[7][selected_color]+"</span>"+"</p>"+"<p>"+"<span style='background:"+ShadeColor[1]+";'></span>"+"<span>Between"+HcWebData[7][selected_color]+" and "+HcWebData[15][selected_color]+"</span>"+"</p>"+"<p>"+"<span style='background:"+ShadeColor[2]+";'></span>"+"<span>More than"+HcWebData[15][selected_color]+"</p>";}
			document.getElementById("shadecolor_explain").innerHTML = listHTML;
			switch (selected_color) { //The shade index explain text
			  case "Category":shadeHTML = "The Haringey can be divided into 3 regions (west/center/east) based on the railway line. The shade color of the map shows the region of the wards in Haringey.";break;
			  case "Emission":shadeHTML = "The shaded ShadeColor on the map show the percentage of households in each ward that do not have a car at home.";break;
			  case "Average IMD index":shadeHTML = "The shade color of the map shows the IMD index (whole UK) of the wards.";break;
			  case "Population change":shadeHTML = "The shade color of the map shows the population changes (%) of the ward.";break;
			}
			document.getElementById("shade_explain").innerHTML = shadeHTML; //return it to html by id
	}