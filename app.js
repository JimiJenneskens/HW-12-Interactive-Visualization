// Get the names to the dropdown 
d3.json("data/samples.json").then((data)=>{
    var names = data.names;
    console.log(data.metadata);

    var select = d3.selectAll("#selDataset");
    Object.entries(names).forEach(([i,v]) => {
        select.append("option").text(v);
    })
})



