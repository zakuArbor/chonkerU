import React, { useState, useEffect } from "react";
import ELK from "elkjs/lib/elk.bundled";
import { path as d3Path } from "d3-path";
import ShapeNode from "@carbon/charts-react/diagrams/ShapeNode/ShapeNode";
import CardNode from "@carbon/charts-react/diagrams/CardNode";
import {
  CardNodeColumn,
  CardNodeTitle,
  CardNodeSubtitle
} from "@carbon/charts-react/diagrams/CardNode";
import Edge from "@carbon/charts-react/diagrams/Edge/Edge";
import { TeeMarker, CircleMarker } from "@carbon/charts-react/diagrams/Marker";
import { User, FunctionMath, QMatrix, Microscope, Chemistry, WatsonHealthDna, Pills, Flash, Screen, EarthFilled} from "@carbon/icons-react";
import "@carbon/charts/styles.css";

const height = 80;
const width = 250;

const iconType = {
    ALGEBRA: 0,
    MATH: 1,
    SCIENCE: 2,
    GEO: 3,
}

const getIcon = (key) => {
    const width = 32;
    switch(key) {
        case iconType.ALGEBRA:
            return <QMatrix size={width}/>;
            break;
        case iconType.MATH:
            return <FunctionMath size={width}/>
            break;
        case iconType.SCIENCE:
            return <Chemistry size={width}/>
            break;
        case iconType.GEO:
            return <EarthFilled size={width}/>
        default:
            return <FunctionMath size={width}/>
    }
}

const nodes = [
  { id: "MATH1052", height: height, width: width, icon_type: iconType.MATH},
  { id: "MATH2052", height: height, width: width, icon_type: iconType.MATH},
  { id: "MATH2107", height: height, width: width, icon_type: iconType.ALGEBRA},
  { id: "MATH1152", height: height, width: width, icon_type: iconType.ALGEBRA},
  { id: "PHYS1001", height: height, width: width, icon_type: iconType.SCIENCE},
  { id: "PHYS1004", height: height, width: width, icon_type: iconType.SCIENCE},
  { id: "CHEM1006", height: height, width: width, icon_type: iconType.SCIENCE},
  { id: "GEOG1020", height: height, width: width, icon_type: iconType.SCIENCE},
 
];

const links = [
  { id: "1", source: "MATH1052", target: "MATH2052", direction: "", },
  { id: "2", source: "MATH1152", target: "MATH2107", direction: "right"},
  { id: "3", source: "PHYS1001", target: "PHYS1004", direction: "", },
  // { id: "7", source: "gbshanaware", target: "App Server", direction: "" }
];
const Link = ({ link }) => {
  const sections = link.sections[0];
  const path = d3Path();

  path.moveTo(sections.startPoint.x, sections.startPoint.y);

  if (sections.bendPoints) {
    sections.bendPoints.forEach((b) => {
      path.lineTo(b.x, b.y);
    });
  }

  path.lineTo(sections.endPoint.x, sections.endPoint.y);

  return (
    <Edge
      path={path.toString()}
      markerStart="circle"
      markerEnd="tee"
      variant="dash-sm"
    />
  );
};

const Node = ({ name, x, y, height, width, icon_type}) => {
    console.log({x, y});
  return (
    <foreignObject
      transform={`translate(${x},${y})`}
      height={height}
      width={width}
      style={{ overflow: "visible" }}
    >
      <div style={{ height, width }}>
        <CardNode
          onClick={() => {
            alert(name);
          }}
        >
          <CardNodeColumn>
            {getIcon(icon_type)}
          </CardNodeColumn>
          <CardNodeColumn>
            <CardNodeTitle>{name}</CardNodeTitle>
            <CardNodeSubtitle>Description</CardNodeSubtitle>
          </CardNodeColumn>
        </CardNode>
      </div>
    </foreignObject>
  );
};

const Progression = ({ }) => {
  const elk = new ELK();

  const [positions, setPositions] = useState(null);

  const graph = {
    id: "root",
    layoutOptions: {
      "elk.direction": "",
      "elk.algorithm": "layered",
      "elk.padding": "[left=50, top=50, right=50, bottom=50]",
      separateConnectedComponents: false,
      "spacing.nodeNode": 100,
      "spacing.nodeNodeBetweenLayers": 100,
      "crossingMinimization.semiInteractive": true,
    },
    children: nodes,
    edges: links
  };

  useEffect(() => {
    elk
      .layout(graph)
      .then((g) => setPositions(g))
      .catch(console.error);
  }, []);

  if (!positions) return null;

  const buildNodes = () => {
    const { children } = positions;

    return children.map((node, i) => {
      return (
        <Node
          key={`node_${i}`}
          name={node.id}
          x={node.x}
          y={node.y}
          height={node.height}
          width={node.width}
          icon_type={node.icon_type}
        />
      );
    });
  };

  const buildLinks = () => {
    const { edges } = positions;

    return edges.map((edge, i) => {
      return <Link key={`link_${i}`} link={edge} />;
    });
  };

  const nodeElements = buildNodes();
  const linkElements = buildLinks();

  return (
    <div
      className={`force`}
      style={{
        position: `relative`,
        height: 2000,
        width: 2000,
        margin: 32
      }}
    >
      <svg style={{ height: "100%", width: "100%" }}>
        <defs>
          <TeeMarker id="tee" />
          <CircleMarker id="circle" position="start" />
        </defs>
        {linkElements}
        {nodeElements}
      </svg>
    </div>
  );
};
export default Progression;
