//metadata and demographic info
function buildMetadata(id_num){
  // Use D3 fetch to read the JSON file
  d3.json("data/samples.json").then((data) => {
    var metadatas = data.metadata;
    demoInfo = d3.select("#sample-metadata");
    demoInfo.html("");
    var selectedMetadata = metadatas.filter(sample => sample.id == id_num)[0];
    for (i = 0; i<Object.entries(selectedMetadata).length;i++){
      demoInfo.append("div").text(Object.keys(selectedMetadata)[i] + ": " + Object.values(selectedMetadata)[i] + '\n');
    };
  }); 
}

//sample and plotly
function buildCharts(id_num){
  d3.json("data/samples.json").then((data) => {
    var samples = data.samples;
    var selectedData = samples.filter(sample => sample.id == id_num);
    var metadatas = data.metadata;
    var selectedMetadata = metadatas.filter(sample => sample.id == id_num)[0];
    //bar
    //sort data by sample values
    var sortedData = selectedData.sort((a,b) => b.sample_values - a.sample_values)[0];
    //Use sample_values as the values for the bar chart.
    var values_bar = sortedData.sample_values.slice(0,10).reverse();
    //Use otu_ids as the labels for the bar chart.
    var labels_bar = sortedData.otu_ids.slice(0,10).reverse();
    labels_bar = labels_bar.map(l => `OTU ${l}`);
    //Use otu_labels as the hovertext for the chart.
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
        color: marker_color,
        colorscale: "Portland"
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

    //gauge
    var gauge_value = selectedMetadata.wfreq;
    var gauge_trace = {
        domain: { x: [0, 1], y: [0, 1] },
        value: gauge_value,
        title: { text: "Belly Button Washing Frequency<br><sup>Scrubs per Week</sup>" },
        type: "indicator",
        mode: "gauge",
        gauge: {
          axis: { range: [null, 9] },
          steps: [
            { range: [0, 1], color: "#FFF0E6"},
            { range: [1, 2], color: "#FFE1CC"},
            { range: [2, 3], color: "#FFD1B3"},
            { range: [3, 4], color: "#FFC299"},
            { range: [4, 5], color: "#FFB380"},
            { range: [5, 6], color: "#FFA466"},
            { range: [6, 7], color: "#FF954D"},
            { range: [7, 8], color: "#FF8533"},
            { range: [8, 9], color: "#FF7619"},
          ],
          threshold: {
            line: { color: "purple", width: 4 },
            thickness: 0.75,
            value: gauge_value
          }
        }
      };
    var gauge_data = [gauge_trace];
    var gauge_layout = { width: 600, height: 450, margin: { t: 0, b: 0 } };
    Plotly.newPlot('gauge', gauge_data, gauge_layout);
    
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
  if(id_num)
  {
    buildCharts(id_num);
    buildMetadata(id_num);
  }
}

init();

  