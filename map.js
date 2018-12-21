mapboxgl.accessToken = 'pk.eyJ1IjoibGl0dGxleHUiLCJhIjoiY2l3Yzl5dzE3MDAzNjJ5dW01cDQ3ajVocyJ9.ePXOQGL4SV7q6vxYv8mUBQ';

var map = new mapboxgl.Map({
	container: 'map',
    center: [-73.918435,40.702564],
    zoom: 11.5,
	style: 'mapbox://styles/littlexu/cjput8cjr0klv2sptxgwhpfts', 	
});

$("#about").on('click', function() {
    $("#screen").fadeToggle();
    $(".modal").fadeToggle();
});

$(".modal>.close-button").on('click', function() {
    $("#screen").fadeToggle();
    $(".modal").fadeToggle();
});

map.on('mousemove', function(e) {   // Event listener to do some code when the mouse moves, see https://www.mapbox.com/mapbox-gl-js/api/#events. 

        var wifinyc = map.queryRenderedFeatures(e.point, {    
            layers: ['hotspot']    // replace 'cville-parks' with the name of the layer you want to query (from your Mapbox Studio map, the name in the layers panel). For more info on queryRenderedFeatures, see the example at https://www.mapbox.com/mapbox-gl-js/example/queryrenderedfeatures/. Documentation at https://www.mapbox.com/mapbox-gl-js/api/#map#queryrenderedfeatures.
        });
        
        console.log(wifinyc);
        
        if (wifinyc.length > 0) {   // if statement to make sure the following code is only added to the info window if the mouse moves over a state

            $('#more-info').html('<h3><strong>' + "&lt;" + wifinyc[0].properties.Remarks + "&gt;" + '</strong></h3>' +  '<p>' + wifinyc[0].properties.Provider + '</p>' + '<p>' + wifinyc[0].properties.Type + '</p>' + '<p>' + wifinyc[0].properties.Location + '</p>');

        } else {    // what shows up in the info window if you are NOT hovering over a park

            $('#more-info').html('<p><br><br>Hover over a hotspot and find out more information.</p>');
            
        }

    });

// POPUPS CODE

    // Create a popup on click 
    map.on('click', function(e) {   // Event listener to do some code when user clicks on the map

      var f = map.queryRenderedFeatures(e.point, {  // Query the map at the clicked point. See https://www.mapbox.com/mapbox-gl-js/example/queryrenderedfeatures/ for an example on how queryRenderedFeatures works and https://www.mapbox.com/mapbox-gl-js/api/#map#queryrenderedfeatures for documentation
        layers: ['public bench']    // replace this with the name of the layer from the Mapbox Studio layers panel
    });

      // if the layer is empty, this if statement will exit the function (no popups created) -- this is a failsafe to avoid non-functioning popups
      if (f.length == 0) {
        return;
    }

    // Initiate the popup
    var popup = new mapboxgl.Popup({ 
        closeButton: true, // If true, a close button will appear in the top right corner of the popup. Default = true
        closeOnClick: true, // If true, the popup will automatically close if the user clicks anywhere on the map. Default = true
        anchor: 'bottom', // The popup's location relative to the feature. Options are 'top', 'bottom', 'left', 'right', 'top-left', 'top-right', 'bottom-left' and 'bottom-right'. If not set, the popup's location will be set dynamically to make sure it is always visible in the map container.
        offset: [0, -15], // A pixel offset from the centerpoint of the feature. Can be a single number, an [x,y] coordinate, or an object of [x,y] coordinates specifying an offset for each of the different anchor options (e.g. 'top' and 'bottom'). Negative numbers indicate left and up.
    });

      // Set the popup location based on each feature
      popup.setLngLat(f[0].geometry.coordinates);

      // Set the contents of the popup window
      popup.setHTML('<h3>Stop ID: ' + f[0].properties.name + '</h3><p>' + f[0].properties.name + '</p>');
            // stops[0].properties.stop_id will become the title of the popup (<h3> element)
            // stops[0].properties.stop_name will become the body of the popup


        // popup.setHTML('<p>' + stops[0].properties.stop_name + '</p>')
        

      // Add the popup to the map 
      popup.addTo(map);  // replace "map" with the name of the variable in line 4, if different
  });


// SHOW/HIDE LAYERS
// See example at https://www.mapbox.com/mapbox-gl-js/example/toggle-layers/
    
    var layers = [  // an array of the layers you want to include in the layers control (layers to turn off and on)

        // [layerMachineName, layerDisplayName]
        // layerMachineName is the layer name as written in your Mapbox Studio map layers panel
        // layerDisplayName is the way you want the layer's name to appear in the layers control on the website
        ['Cafe', 'Cafe'],   
        ['Public Space', 'Public Space'], 
        ['Outdoor Parks', 'Outdoor Parks'],
    ]; 

    // functions to perform when map loads
    map.on('load', function () {
        
        for (i=0; i<layers.length; i++) {

            // add a button for each layer
            $("#layers-control").append("<a href='#' class='active button-default' id='" + layers[i][0] + "'>" + layers[i][1] + "</a>");
        }

        // show/hide layers when button is clicked
        $("#layers-control>a").on('click', function(e) {

                var clickedLayer = e.target.id;
                e.preventDefault();
                e.stopPropagation();

                var visibility = map.getLayoutProperty(clickedLayer, 'visibility');  // see https://www.mapbox.com/mapbox-gl-js/api/#map#getlayoutproperty
                console.log(visibility);

                if (visibility === 'visible') {
                    map.setLayoutProperty(clickedLayer, 'visibility', 'none');  // see https://www.mapbox.com/mapbox-gl-js/api/#map#setlayoutproperty
                    $(e.target).removeClass('active');
                } else {
                    $(e.target).addClass('active');
                    map.setLayoutProperty(clickedLayer, 'visibility', 'visible'); // see https://www.mapbox.com/mapbox-gl-js/api/#map#setlayoutproperty
                }
        });
    });
    // CHANGE LAYER STYLE
// Refer to example at https://www.mapbox.com/mapbox-gl-js/example/color-switcher/
    
  // CHANGE LAYER STYLE
// Refer to example at https://www.mapbox.com/mapbox-gl-js/example/color-switcher/
    
    var swatches = $("#swatches");

    var colors = [  // an array of color options for the bus stop ponts
        '#ff4747',
        '#F06543',
        '#813C5F',
        '#443047'
    ]; 

    var layer = 'hotspot';

    colors.forEach(function(color) {
        var swatch = $("<button class='swatch'></button>").appendTo(swatches);

        $(swatch).css('background-color', color); 

        $(swatch).on('click', function() {
            map.setPaintProperty(layer, 'circle-color', color); // 'circle-color' is a property specific to a circle layer. Read more about what values to use for different style properties and different types of layers at https://www.mapbox.com/mapbox-gl-js/style-spec/#layers
        });

        $(swatches).append(swatch);
    });




var slider = document.getElementById('slider');
var sliderValue = document.getElementById('slider-value');

map.on('load', function() {

    slider.addEventListener('input', function(e) {
        // Adjust the layers opacity. layer here is arbitrary - this could
        // be another layer name found in your style or a custom layer
        // added on the fly using `addSource`.
        map.setPaintProperty('Public Seats Heatmap', 'heatmap-opacity', parseInt(e.target.value, 10) / 100);

        // Value indicator
        sliderValue.textContent = e.target.value + '%';
    });
});


    $("#reset").click(function() {
        map.setCenter(mapCenter);
        map.setZoom(mapZoom);
        map.setPitch(0);
        map.setBearing(0);
        map.setFilter("Public-Seats", null); // reset building permits filters
        
        // Reset all layers to visible
        for (i=0; i<layers.length; i++) {
            map.setLayoutProperty(layers[i][0], 'visibility', 'visible'); 
            $("#" + layers[i][0]).addClass('active');
        }                   

    });

// Timeline labels using d3

    var width = 500;
    var height = 25;
    var marginLeft = 15;
    var marginRight = 15;

    var data = [2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018];
    
    // Append SVG 
    var svg = d3.select("#timeline-labels")
                .append("svg")
                .attr("width", width)
                .attr("height", height);

    // Create scale
    var scale = d3.scaleLinear()
                  .domain([d3.min(data), d3.max(data)])
                  .range([marginLeft, width-marginRight]); 

    // Add scales to axis
    var x_axis = d3.axisBottom()
                   .scale(scale)
                   .tickFormat(d3.format("d"));  // Formats number as a date, e.g. 2008 instead of 2,008 

    //Append group and insert axis
    svg.append("g")
       .call(x_axis);

// Timeline map filter (timeline of building permit issue dates)
    
    // Create array of  dates from Mapbox layer (in this case, Charlottesville Building Permit application dates)
    map.on('load', function () {

        // Get all data from a layer using queryRenderedFeatures
        var Installati = map.queryRenderedFeatures(null, { // when you send "null" as the first argument, queryRenderedFeatures will return ALL of the features in the specified layers
            layers: ["Public Seats Heatmap"]
        });

        var InstallatiDatesArray = [];
        var InstallatiYearsArray = [];

        // push the values for a certain property to the variable declared above (e.g. push the permit dates to a permit date array)
        for (i=0; i<Installati.length; i++) {
            var InstallatiDate = Installati[i].properties.AppliedDat;
            // The format of the date in this layer is a long string in the format "2012-10-19T04:00:00.000Z", and we are just looking for the 4-digit year, so the following line will trim each value in the array to just the first 4 characters.
            var InstallatiYear = InstallatiDate.substring(0, 4);
            
            InstallatiDatesArray.push(InstallatiDate);    // Replace "AppliedDat" with the field you want to use for the timeline slider
            InstallatiYearsArray.push(InstallatiYear);
        }

        // Create event listener for when the slider with id="timeslider" is moved
        $("#timeslider").change(function(e) {
            var year = this.value; 
            var indices = [];

            // Find the indices in the permitDatesArray array where the year from the time slider matches the year of the permit application
            var matches = InstallatiDatesArray.filter(function(item, i){
                if (item.indexOf(year) >= 0) {
                    indices.push(i);
                }
            });

            // create filter 
            var newFilters = ["any"];
            
            for (i=0; i<indices.length; i++) {
                var filter = ["==","AppliedDat", InstallatiDatesArray[indices[i]]];
                newFilters.push(filter);
            }

            map.setFilter("Public Seats Heatmap", newFilters);
        });

    });


