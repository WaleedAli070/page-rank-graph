import React from "react";
import * as d3 from "d3";

export const PageRankGraph = ({ links = [], nodes = [], totalNodes }) => {
  const svgRef = React.useRef(null);
  const svgWidth = 600;
  const svgHeight = 600;
  const speedVal = 1;

  const color = () => {
    const scale = d3.scaleOrdinal(d3.schemeCategory10);
    return (d) => scale(d.group);
  };

  const randomStart = () => {
    d3.selectAll("g.node").style("stroke-width", "0").style("fill", "#F5A9A9");
    d3.selectAll("g.line").style("stroke-width", "1px").style("stroke", "gray");

    const randomNodeIndex = Math.floor(Math.random() * totalNodes);
    const randomNodeId = nodes[randomNodeIndex].id;
    d3.select(`#${randomNodeId}`).style("fill", "green");
    // model.nextStep = stepTo;
    nextStep(randomNodeId);
    increasePageRank(randomNodeId);
  };
  const nextStep = (nodeId) => {
    const connectedEdges = links.filter((d) => d.source.id === nodeId);
    if (connectedEdges.length == 0) {
      return;
    }
    const randomEdge = Math.floor(Math.random() * connectedEdges.length);
    d3.select(".linkG")
      .selectAll("line")
      .filter(function (d) {
        return d == connectedEdges[randomEdge];
      })
      .transition()
      .duration(speedVal)
      .style("stroke-width", "4px")
      .style("stroke", "red")
      .each(function () {
        this.parentNode.appendChild(this);
      });
    const newNodeId =
      connectedEdges[randomEdge].target == nodeId
        ? connectedEdges[randomEdge].source.id
        : connectedEdges[randomEdge].target.id;
    increasePageRank(newNodeId);
  };
  const increasePageRank = (nodeId) => {
    d3.select(`#${nodeId}`)
      .style("stroke-width", "12px")
      .each((d) => (d.pageRank += 1));
    const maxPageRank = d3.max(nodes, (d) => d.pageRank);
    const totalPageRank = d3.sum(nodes, (d) => d.pageRank);
    const pageRankColoration = d3
      .scaleLinear()
      .domain([0, maxPageRank])
      .range(["black", "#F5A9A9"]);
    const pageRankSize = d3.scaleLinear().domain([0, maxPageRank]);
    // .range([2, 12]);
    d3.selectAll("g.node")
      .transition()
      .duration(speedVal)
      .attr("r", (d) => pageRankSize(d.pageRank));
  };

  const drawNodesOnGraph = () => {
    // // Create root container where we will append all other chart elements
    const d3Svg = d3
      .select(svgRef.current)
      .attr("viewBox", [0, 0, svgWidth, svgHeight]);

    d3Svg.selectAll("*").remove(); // Clear svg content before adding new elements

    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3.forceLink(links).id((d) => d.id)
      )
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(svgWidth / 2, svgHeight / 2));

    const link = d3Svg
      .append("g")
      .attr("class", "linkG")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("class", "line")
      .attr("stroke-width", (d) => Math.sqrt(d.value));

    const node = d3Svg
      .append("g")
      .attr("class", "nodeG")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("class", "node")
      .attr("r", 5)
      .attr("fill", color());

    node.append("title").text((d) => d.id);

    simulation.on("tick", () => {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      node
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y)
        .attr("id", (d) => d.id);
    });
  };

  React.useEffect(() => {
    if (nodes) {
      drawNodesOnGraph();
      setTimeout(randomStart, 5000);
    }
  }, [nodes]);

  return <svg ref={svgRef} width={svgWidth} height={svgHeight} />;
};
