import React from "react";
import { PageRankGraph } from "./PageRankGraph";

export const GraphWrapper = ({ links = [], nodes = [] }) => {
  const [totalNodes, setTotalNodes] = React.useState(0);
  const [formattedNodes, setFormattedNodes] = React.useState([]);
  const [formattedLinks, setFormattedLinks] = React.useState([]);
  const [speedVal, setSpeedVal] = React.useState(1);

  React.useEffect(() => {
    setTotalNodes(nodes.length);
    setFormattedNodes(nodes.map((d) => ({ ...d, pageRank: 0 })));
    setFormattedLinks(links.map((d) => d));
  }, [links, nodes]);

  return (
    <PageRankGraph
      links={formattedLinks}
      nodes={formattedNodes}
      totalNodes={totalNodes}
    />
  );
};
