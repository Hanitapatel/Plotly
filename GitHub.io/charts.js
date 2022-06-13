function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);

}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;

    // // 4. Create a variable that filters the samples for the object with the desired sample number.
    var sampleresultArray = samples.filter(samplesObj => samplesObj.id == sample);
    //console.log(sampleresultArray);


    // //  5. Create a variable that holds the first sample in the array.
    var sampleresult = sampleresultArray[0];
    // sampleresult.sort(function(obj1, obj2){
    //   return obj1.sample_values - obj2.sample_values;
    // });
    console.log("Sample result = ");
    console.log(sampleresult);
    // // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.

    var otuIds = sampleresult.otu_ids.map(id => id);
    var otuLables = sampleresult.otu_labels.map(row => row);
    var sampleValues = sampleresult.sample_values.map(row => row);

    //1) combine the arrays:
var list = [];
for (var j = 0; j < otuIds.length; j++) 
    list.push({'otuIds': otuIds[j], 'otuLables': otuLables[j],'sampleValues' : sampleValues[j]});

//2) sort:
list.sort(function(a, b) {
    return ((a.sampleValues < b.sampleValues) ? -1 : ((a.sampleValues == b.sampleValues) ? 0 : 1));
});

//3) separate them back out:
for (var k = 0; k < list.length; k++) {
  otuIds[k] = list[k].otuIds;
  otuLables[k] = list[k].otuLables;
  sampleValues[k] = list[k].sampleValues;
}
    // var otuLables = sampleresult.otu_labels;
    // var sampleValues = sampleresult.sample_values;
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    console.log(sampleValues);

    // Slice the first 10 objects for plotting
    // otuIds = otuIds.map(id=>id.otu_ids)
    otuIds = otuIds.reverse().slice(0, 10).reverse();
    otuLables = otuLables.reverse().slice(0, 10).reverse();
    sampleValues = sampleValues.reverse().slice(0, 10).reverse();

    // Reverse the array due to Plotly's defaults
    // otuIds = otuIds.reverse();
    // otuLables = otuLables.reverse();
    // sampleValues = sampleValues.reverse();

    console.log("Hanita out ids = ");
    console.log(otuIds);

    // 8. Create the trace for the bar chart. 
    var trace1 = {
      x: sampleValues,
      y: otuIds,
      text: otuLables,
      // name: "otuIds",
      type: "bar",
      orientation: "h"
    };

    var barData = [trace1];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      yaxis: {
        title: "OTU",
        ticktext:  otuIds,
        // tickvals:  otuIds,
        type : "category"
      },
      margin: {
        l: 50,
        r: 50,
        t: 50,
        b: 50
      }
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    // ************ Bubble Chart ****************//
    //1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);

    // 2. Create a variable that holds the first sample in the metadata array.
    var result = resultArray[0];
    console.log(resultArray);
    // Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIds_all = sampleresult.otu_ids.map(id => id);
    var otuLables_all = sampleresult.otu_labels.map(row=>row);
    var sampleValues_all = sampleresult.sample_values.map(row=>row);

    // Slice the first 10 objects for plotting
    // otuIds = otuIds.map(id=>id.otu_ids)
    // otuIds = otuIds.slice(0, 10).reverse();
    // otuLables = otuLables.slice(0, 10).reverse();
    // sampleValues = sampleValues.slice(0, 10).reverse();
    // Create the yticks for the bar chart.

    // 4. Create the trace for the bubble chart.
    var trace2 = {
      x: otuIds_all,
      y: sampleValues_all,
      text: otuLables_all,
      mode: 'markers',
      marker: {
        color: ['rgb(93, 164, 214)', 'rgb(255, 144, 14)', 'rgb(44, 160, 101)', 'rgb(255, 65, 54)', 'blue', 'brown', 'black', 'yellow', 'pink', 'orange'],
        size: [40, 60, 80, 100, 120, 140, 160, 180, 200, 210]
      }
      //type: "bar",
      //orientation: "h"
    };

    var bubbleData = [trace2];

    var bubblelayout = {

      title: 'Bacteria Cultures Per Sample',
      xaxis: {
        title: 'Otu Id',
        titlefont: {
          family: 'Courier New, monospace',
          size: 18,
          color: '#7f7f7f'
        }
      },

      showlegend: false
    };
    // Use Plotly to plot the bubble data and layout.
    Plotly.newPlot("bubble", bubbleData, bubblelayout);

    // ********** Guage Chart ***********//

    // 3. Create a variable that holds the washing frequency.
    // var wfreq = data.metadata.map(person => person.wfreq);
    var wfreq = resultArray.map(person => person.wfreq)

    // 4. Create the trace for the gauge chart.
    var gaugeData = [
      {
        domain: { x: [0, 1], y: [0, 1] },

        value: parseFloat(wfreq),

        title: { text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week" },

        type: "indicator",

        mode: "gauge+number",
        gauge: {
          bar: { color: "black" },

          axis: { range: [null, 10] },

          steps: [
            // {backgroundColor: ['green', 'yellow', 'orange', 'red']},
            { range: [0, 2], color: "red" },

            { range: [2, 4], color: "orange" },
            { range: [4, 6], color: "yellow" },
            { range: [6, 8], color: "goldenrod" },
            { range: [8, 10], color: "olive" }


          ]
        }

      }
    ];

    // 5. Create the layout for the gauge chart.
    var gaugeLayout = {
      width: 600, height: 450, margin: { t: 0, b: 0 }
    };
    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);

  });
}
