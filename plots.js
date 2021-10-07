// Use D3 fetch to read the JSON file
// The data from the JSON file is arbitrarily named importedData as the argument

//metadata and demographic info
function buildMetadata(id_num){
  d3.json("data/samples.json").then((data) => {
    var metadatas = data.metadata;
    demoInfo = d3.select("#sample-metadata");
    demoInfo.html("");
    var selectedMetadata = metadatas.filter(sample => sample.id == id_num)[0];
    for (i = 0; i<Object.entries(selectedMetadata).length;i++){
      demoInfo.append("div").text(Object.keys(selectedMetadata)[i] + ": " + Object.values(selectedMetadata)[i] + '\n');
    }
  });
}

//sample and plotly
function buildCharts(id_num){
  d3.json("data/samples.json").then((data) => {
    var samples = data.samples;
    var selectedData = samples.filter(sample => sample.id == id_num);
    //bar
    //sort data by sample values
    var sortedData = selectedData.sort((a,b) => b.sample_values - a.sample_values)[0];
    //Use sample_values as the values for the bar chart.
    //Use otu_ids as the labels for the bar chart.
    //Use otu_labels as the hovertext for the chart.
    var values_bar = sortedData.sample_values.slice(0,10).reverse();
    var labels_bar = sortedData.otu_ids.slice(0,10).reverse();
    labels_bar = labels_bar.map(l => `OTU ${l}`);
    var text_bar = sortedData.otu_labels.slice(0,10).reverse();
    var bar_trace = {
      x: values_bar,
      y: labels_bar,
      text: text_bar,
      type:"bar",
      orientation:"h"
    }
    var bar_data = [bar_trace];
    var bar_layout = {
      title:`Top 10 Bacteria Culture Found in ID ${id_num}`,
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
  });
}

//initialize a plot with the first id
function init() {

  d3.json("data/samples.json").then((data) => {
    //dropdown menu
    // use the data.names as test_id to build the dropdown menu
    // assign text and value to be the id
    var id = data.names;
    var select = d3.select("select");
    var options;
    for (var i=0; i<id.length; i++) {
      options = select.append("option");
      options.text(id[i]);
      options.attr("value",id[i]);
    }
    const first = id[0];
      buildCharts(first);
      buildMetadata(first);
  });
}

// On change to the DOM, call optionChanged()
var dropdownMenu = d3.select("#selDataset");
var id_num = dropdownMenu.property("value");
d3.selectAll("#selDataset").on("change", optionChanged(id_num));

// Function called by DOM changes
function optionChanged(id_num) {
  buildCharts(id_num);
  buildMetadata(id_num);
}

init();

  