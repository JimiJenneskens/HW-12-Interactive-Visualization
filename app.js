// Get the names to the dropdown 
d3.json("data/samples.json").then((data) => {
    var names = data.names;
    console.log(data.metadata);

    var select = d3.selectAll("#selDataset");
    Object.entries(names).forEach(([i,v]) => {
        select.append("option").text(v);
    })
})

function makePlot(nameID){
    d3.json("data/samples.json").then((data) =>{
        var samples = data.samples;
        var samplesID = samples.map(row => row.id).indexOf(nameID);

        // Make the bar plot
        var sampleValues = samples.map(row => row.sample_values);
        var sampleValues = sampleValues[samplesID].slice(0,10).reverse();
        var otuIds = samples.map(row => row.otu_ids);
        var otuIds = otuIds[samplesID].slice(0,10);
        var otuLabels = samples.map(row => row.otu_labels); 
        var otuLabels = otuLabels[samplesID].slice(0,10); 
        var trace = {
            x: sampleValues,
            y: otuIds.map(r => `UTO ${r}`),
            text: otuLabels,
            type:"bar",
            orientation:"h"
        }
        Plotly.newPlot("bar", [trace]);

         // Make the bubble chart
         var sampleValue = samples.map(row => row.sample_values);
         var sampleValue = sampleValue[samplesID];
         var otuId = samples.map(row => row.otu_ids);
         var otuId = otuId[samplesID];
         var otuLabel = samples.map(row => row.otu_labels); 
         var otuLabel = otuLabel[samplesID];
         var minId = d3.min(otuId);
         var maxId = d3.max(otuId);
         var mapNr = d3.scaleLinear().domain([minId, maxId]).range([0, 1]);
         var colors = otuId.map(val => d3.interpolateRgbBasis(["royalblue", "greenyellow", "goldenrod"])(mapNr(val)));
         var trace1 = {
             x: otuId,
             y: sampleValue,
             text: otuLabel,
             mode: "markers",
             marker: {
                 color: colors,
                 size: sampleValue.map(x => x*10),
                 sizemode: "area"
             }
         };
         var bubbleLayout = {
             xaxis:{
                 autochange: true,
                 height: 600,
                 width: 1000,
                 title: {
                     text: "OTU ID"
                 }
             },
         };
         Plotly.newPlot("bubble", [trace1], bubbleLayout);
        
         // Make the gauge chart 
         var meta = data.metadata;
         var data1 = [
             {
                 domain: { x: [0, 1], y: [0, 1] },
                 value: meta[samplesID].wfreq,
                 title: { text: "Belly Button Washing Frequency" },
                 type: "indicator",
                 mode: "gauge+number",
                 gauge: { axis: { range: [null, 9] },
                 bar:{color: "orange"},
                    steps: [
                     { range: [0, 2], color: "rgba(255, 255, 255, 0)"},
                     { range: [2, 3], color: "rgba(232, 226, 202, .5)"},
                     { range: [3, 4], color: "rgba(210, 206, 145, .5)"},
                     { range: [4, 5], color: "rgba(202, 209, 95, .5)" },
                     { range: [5, 6], color: "rgba(170, 202, 42, .5)"},
                     { range: [6, 8], color: "rgba(110, 154, 22, .5)"},
                     { range: [8, 9], color: "rgba(14, 127, 0, .5)"}
                   ]}
             }
         ];
         
         var gaugeLayout = { width: 600, height: 500};
         Plotly.newPlot("gauge", data1, gaugeLayout);

         // Make the meta info
         var metadata=d3.select("#sample-metadata");
         metadata.html('');
         Object.entries(meta[samplesID]).forEach(([k,v]) => {
             metadata.append('p').text(`${k.toUpperCase()}:\n${v}`);
         })
     })
 }
 
 // Make new plots if ID changed
function optionChanged(newId) {
    makePlot(newId);
}