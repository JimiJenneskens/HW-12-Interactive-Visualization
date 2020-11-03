// Get the names to the dropdown 
d3.json("data/samples.json").then((data)=>{
    var names = data.names;
    console.log(data.metadata);

    var select = d3.selectAll("#selDataset");
    Object.entries(names).forEach(([i,v]) => {
        select.append("option").text(v);
    })
})

function makePlot(nameID){
    d3.json("data/samples.json").then((data) => {
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
        Plotly.newPlot("bar",[trace]);

    })
})