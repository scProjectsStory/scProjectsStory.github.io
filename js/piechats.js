//echart.js pie chart use, in order to reduce time this time manually entered the data values, but in fact can be calculated by former data
//imported into the excel table to assign values, to achieve changes
		// pie graph
		var PiechartContainer = document.getElementById('pie');
		var myPieChart = echarts.init(PiechartContainer);
		var data = [
		  {value: 12.353, name: 'West'},
		  {value: 10.0638, name: 'Center'},
		  {value: 7.1815, name: 'East'},
		];
		myPieChart.setOption({
		 title: {
                text: '		     	  Haringey area(km2) by region',
                  top: '91%',
            },
		     tooltip: {
                show: true,
                trigger: "item",
                backgroundColor: "#FFFFFF",
                formatter: "Proportion：{b}<br/>{c}({d}%)"
            },
		  series: [{
			type: 'pie',
			data: data,
 label: {
              show: true,
              position: 'inner',
              color:'#fff',
              fontSize: '15',
              formatter: '{d}%',
              fontWeight:'bold',
            },
		  }]
		});
		// fresh
		document.getElementById('fresh').addEventListener('click', function() {
		var newData = [		  {value: 12.353, name: 'West'},
		  {value: 10.0638, name: 'Center'},
		  {value: 7.1815, name: 'East'},];
		  myPieChart.setOption({title: {text:'		     	     Area of Haringey by regions'},series: [{data: newData}]});
		});
<!--		// toparea-->
<!--		document.getElementById('toparea').addEventListener('click', function() {-->
<!--		var newData = [		  {value: 12.353, name: 'West'},-->
<!--		  {value: 10.0638, name: 'Center'},-->
<!--		  {value: 7.1815, name: 'East'},];-->
<!--		  myPieChart.setOption({title: {text:'		            Area of Haringey by regions'},series: [{data: newData}]});-->
<!--		});-->
		// toppop
		document.getElementById('toppop').addEventListener('click', function() {
		var newData = [{value: 8111.444444, name: 'West'},
		  {value: 11247.7777777778, name: 'Center'},
		  {value: 9018.55555555555, name: 'East'},];
		  myPieChart.setOption({title: {text:'		     	Population of Haringey by regions'},series: [{data: newData}]});
		});
		// popden
		document.getElementById('topden').addEventListener('click', function() {
		var newData = [{value: 5722.88888888889, name: 'West'},{value: 9255, name: 'Center'},{value: 8041.22222222222, name: 'East'},];
		  myPieChart.setOption({title: {text:'		        	Population density by regions'},series: [{data: newData}]});
		});
		// topheal
		document.getElementById('topedu').addEventListener('click', function() {
		var newData = [
		{value: 39917, name: 'No qualifications'},
		{value: 13756, name: 'Level 1 and entry level qualifications'},
		{value: 17328, name: 'Level 2 qualifications'},
		{value: 6274, name: 'Apprenticeship'},
		{value: 23818, name: 'Level 3 qualifications'},
		{value: 99019, name: 'Level 4 qualifications or above'},
		{value: 39917, name: 'other qualifications '},
		];
		  myPieChart.setOption({title: {text:'		           	 Education info of Haringey'},series: [{data: newData}]});
		});
		// topheal
		document.getElementById('topheal').addEventListener('click', function() {
		var newData = [
		{value: 134941, name: 'Very good health'},
		{value: 81156, name: 'Good health'},
		{value: 26714, name: 'Fair health'},
		{value: 9565, name: 'Bad health'},
		{value: 3087, name: 'Very bad health'},
		];
		  myPieChart.setOption({title: {text:'		     	   Population Health by regions'},series: [{data: newData}]});
		});
		// topreg
		document.getElementById('topreg').addEventListener('click', function() {
		var newData = [
		{value: 103943, name: 'Christian'},
		{value: 2456, name: 'Buddhist'},
		{value: 3527, name: 'Hindu'},
		{value: 9396, name: 'Jewish'},
		{value: 33297, name: 'Muslim'},
		{value: 893, name: 'Sikh'},
		{value: 83542, name: 'No religion'},
		{value: 6158, name: 'Other religion'},
		{value: 21022, name: 'Religion not stated'},
		];
		  myPieChart.setOption({title: {text:'		     	Religions consititute in Haringey'},series: [{data: newData}]});
		});
		// topage
		document.getElementById('topage').addEventListener('click', function() {
		var newData = [
		{value: 29673, name: 'Aged 5 to 15'},
		{value: 11579, name: 'Aged 16 to 19 years'},
		{value: 16366, name: 'Aged 20 to 24 years'},
		{value: 49896, name: 'Aged 25 to 34 years'},
		{value: 63918, name: 'Aged 35 to 49 years'},
		{value: 46520, name: 'Aged 50 to 64 years'},
		{value: 15972, name: 'Aged 65 to 74 years'},
		{value: 11734, name: 'Aged 75 and over'},
		];
		  myPieChart.setOption({title: {text:'		          Age in Haringey by categorys'},series: [{data: newData}]});
		});
		// toplang
		document.getElementById('toplang').addEventListener('click', function() {
			var newData = [{value: 0.834, name: 'english speaker(English in England, or English or Welsh in Wales as a main language)'},{value: 0.166, name: 'no-english'},];
		  myPieChart.setOption({title: {text:'		   	English user in Household in Haringey'},series: [{data: newData}]});
		});
		// tophouse
		document.getElementById('tophouse').addEventListener('click', function() {
		var newData = [{value: 40487, name: 'Owned'},{value: 1737, name: 'shared ownership'},{value: 26476, name: 'Social rent'},{value: 36956, name: 'Private'}];
		  myPieChart.setOption({title: {text:'House ownership in Haringey by type'},series: [{data: newData}]});
		});
		// topgreen
		document.getElementById('topgreen').addEventListener('click', function() {
		var newData = [{value: 0.29, name: 'West'},{value: 0.33, name: 'Center'},{value: 0.44, name: 'East'},];
		  myPieChart.setOption({title: {text:'		        	Green space area by regions'},series: [{data: newData}]});
		});
		// topcrime
		document.getElementById('topcrime').addEventListener('click', function() {
		var newData = [{value:1274, name: 'West'},{value: 2449, name: 'Center'},{value: 2974, name: 'East'},];
		  myPieChart.setOption({title: {text:'		     	Crime density by km2 in Haringey'},series: [{data: newData}]});
		});
		// toptrans
		document.getElementById('topTrans').addEventListener('click', function() {
		var newData = [{value: 20374, name: 'Lees than 5 km to go to work'},{value: 32566, name: '5 to 20 km to go to work'},{value: 2547, name: '20 to 60 km to go to wrok'},{value: 922, name: 'Needs more than 60 km to go to work'},{value: 76803, name: 'work at home or no fixed place'}];
		  myPieChart.setOption({title: {text:'		     	      Transport index by regions'},series: [{data: newData}]});
		});
		// topinc
		document.getElementById('topinc').addEventListener('click', function() {
		var newData = [{value: 0.072, name: 'West'},{value: 0.146, name: 'Center'},{value: 0.153, name: 'East'},];
		  myPieChart.setOption({title: {text:'		          Avg-income index by regions'},series: [{data: newData}]});
		});
		// topemployment
		document.getElementById('topempo').addEventListener('click', function() {
		var newData = [{value: 0.454, name: 'West'},{value: 0.502, name: 'Center'},{value: 0.342, name: 'East'},];
		  myPieChart.setOption({title: {text:'		       Avg-employment index by regions'},series: [{data: newData}]});
		});