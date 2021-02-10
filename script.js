// Global Variables
const canvasWidth = 860;
const canvasHeight = 450;
const margin = { top: 20, right: 20, bottom: 20, left: 50 };

d3.json(
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
).then((data) => {
    // Variables
    const dataSet = data.data;
    const allYearDates = dataSet.map((date) => {
        return new Date(date[0]);
    });

    const maxGDP = d3.max(dataSet.map((d) => d[1]));

    var tooltip = d3
        .select(".svg-container")
        .append("div")
        .attr("id", "tooltip")
        .style("opacity", `${0}`);

    var maximus = new Date(d3.max(allYearDates));
    maximus.setMonth(maximus.getMonth() + 3);

    // Scales X - Y
    const xScale = d3
        .scaleTime()
        .domain([d3.min(allYearDates), maximus])
        .range([0, canvasWidth - 20]);
    const yScale = d3.scaleLinear().domain([0, maxGDP]).range([canvasHeight, 20]);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    // Creating SVG
    d3.select(".svg-container")
        .append("svg")
        .attr("width", canvasWidth + margin.left + margin.right)
        .attr("height", canvasHeight + margin.bottom + margin.top)
        .attr("transform", `scale(${1.2})`);
    // Creating AXES X - Y
    d3.select("svg")
        .append("g")
        .call(yAxis)
        .attr("transform", `translate(${margin.left + 20}, 0)`)
        .attr("id", "y-axis");

    const tool = document.getElementById('tooltip')
    console.log(tool.getBoundingClientRect())


    d3.select("svg")
        .append("g")
        .call(xAxis)
        .attr(
            "transform",
            `translate(${margin.left + 20}, ${canvasHeight - margin.bottom + 20})`
        )
        .attr("id", "x-axis");

    // Creating Bars
    d3.select("svg")
        .append("g")
        .selectAll("rect")
        .data(dataSet)
        .enter()
        .append("rect")
        .attr("y", (d) => yScale(d[1]) + 20)
        .attr("x", (d, i) => i * ((canvasWidth - 20) / 275) + 40)
        .attr("width", canvasWidth / 275)
        .attr("height", (d) => canvasHeight - yScale(d[1]))
        .attr("transform", `translate(${31}, ${-20})`)
        .style("fill", "#75c3be")
        .attr("class", "bar")
        .attr("data-gdp", (d, i) => dataSet[i][1])
        .attr("data-date", (d, i) => dataSet[i][0])
        .on("mouseover", (d, i) => {
            tooltip
                .html(
                    `${dataSet[dataSet.indexOf(i)][0]} <br> $${dataSet[dataSet.indexOf(i)][1]
                    } Billion`
                )
                .attr("data-date", `${dataSet[dataSet.indexOf(i)][0]}`);
            onmousemove = function (e) {
                tooltip
                    .style("left", `${e.clientX + 35}px`)
                    .style("top", `${canvasHeight}px`)
            }
            
            ///
            tooltip
                .transition()
                .duration(200)
                .style('opacity', 0.76)
        })
        .on("mouseout", () => {
            tooltip
                .transition()
                .duration(200)
                .style("opacity", 0);
        });

    // Creating GDP Text on left side
    d3.select("svg")
        .append("text")
        .attr("x", -300)
        .attr("y", 100)
        .attr("class", "gdp-name")
        .text("Gross Domestic Product")
        .attr("transform", "rotate(-90)");

    // Creating Info Text on Bottom of the Screen
    d3.select("svg")
        .append("text")
        .attr("x", 683)
        .attr("y", 484)
        .text("http://www.bea.gov/national/pdf/nipaguid.pdf")
        .attr("class", "info");
});
