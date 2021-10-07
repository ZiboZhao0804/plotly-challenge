// Use D3 fetch to read the JSON file
// The data from the JSON file is arbitrarily named importedData as the argument
d3.json("data/samples.json").then((importedData) => {
  var data = importedData;
  var samples = data.samples;
  // console.log(samples);
  // use the data.names as test_id to build the dropdown menu
  // assign text and value to be the id
  var test_id = data.names;
  function buildDropdownMenu(id) {
    var select = d3.select("select");
    var options;
    for (var i=0; i<test_id.length; i++) {
      options = select.append("option");
      options.text(id[i]);
      options.attr("value",id[i]);
    }
  }
  buildDropdownMenu(test_id);

  //// Display the default plot
function init() {
  // select data by id
  var id_num = "940";
  function selectId(data){
    return data.id == id_num;
  }
  var selectedData = samples.filter(selectId);

  //bar
  //sort data by sample values
  var sortedData = selectedData.sort((a,b) => b.sample_values - a.sample_values);
  //Use sample_values as the values for the bar chart.
  //Use otu_ids as the labels for the bar chart.
  //Use otu_labels as the hovertext for the chart.
  var values_bar = sortedData[0].sample_values.slice(0,10).reverse();
  var labels_bar = sortedData[0].otu_ids.slice(0,10).reverse();
  labels_bar = labels_bar.map(l => `OTU ${l}`);
  var text_bar = sortedData[0].otu_labels.slice(0,10).reverse();
  var bar_trace = {
    x: values_bar,
    y: labels_bar,
    text: text_bar,
    type:"bar",
    orientation:"h"
  }
  var bar_data = [bar_trace];
  var bar_layout = {
    title:`top10 bacteria culture found in id ${id_num}`,
    margin: {
      l:100,r:100,t:100,b:100
    }
  };
  Plotly.newPlot("bar", bar_data, bar_layout);

  //bubble
  //Use otu_ids for the x values.
  x_bubble = selectedData[0].otu_ids;
  //Use sample_values for the y values.
  y_bubble = selectedData[0].sample_values;
  //Use sample_values for the marker size.
  marker_size = y_bubble;
  //Use otu_ids for the marker colors.
  marker_color = x_bubble;
  //Use otu_labels for the text values.
  text_bubble = selectedData[0].otu_labels;
  var bubble_trace = {
    x: x_bubble,
    y: y_bubble,
    mode: 'markers',
    text: text_bubble,
    marker: {
      size: marker_size,
      color: marker_color
    }
  };
  
  var bubble_data = [bubble_trace];
  
  var bubble_layout = {
    title: "Bacteria Culture Per Sample",
    xaxis: {title: "OTU ID"},
    showlegend: false,
    height: 600,
    width: 1200
  };
  
  Plotly.newPlot('bubble', bubble_data, bubble_layout);
}

// On change to the DOM, call getData()
d3.selectAll("#selDataset").on("change", optionChanged);

// Function called by DOM changes
function optionChanged() {
  var dropdownMenu = d3.select("#selDataset");
  // Assign the value of the dropdown menu option to a variable
  var dataset = dropdownMenu.property("value");
  // Initialize an empty array for the country's data
  var data = [];

  if (dataset == 'us') {
      data = us;
  }
  else if (dataset == 'uk') {
      data = uk;
  }
  else if (dataset == 'canada') {
      data = canada;
  }
  // Call function to update the chart
  updatePlotly(data);
}

// Update the restyled plot's values
function updatePlotly(newdata) {
  Plotly.restyle("pie", "values", [newdata]);
}

init();
});
  