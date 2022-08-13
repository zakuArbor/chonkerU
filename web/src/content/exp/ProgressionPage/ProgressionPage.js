import React, { useState, useEffect } from "react";
import ELK from "elkjs/lib/elk.bundled";
import { path as d3Path } from "d3-path";
import ShapeNode from "@carbon/charts-react/diagrams/ShapeNode/ShapeNode";
import CardNode from "@carbon/charts-react/diagrams/CardNode";
import {
  CardNodeColumn,
  CardNodeTitle,
  CardNodeSubtitle,
} from "@carbon/charts-react/diagrams/CardNode";
import Edge from "@carbon/charts-react/diagrams/Edge/Edge";
import { TeeMarker, CircleMarker } from "@carbon/charts-react/diagrams/Marker";
import {
  User,
  FunctionMath,
  QMatrix,
  Microscope,
  Chemistry,
  WatsonHealthDna,
  Pills,
  Flash,
  Screen,
  EarthFilled,
} from "@carbon/icons-react";
import "@carbon/charts/styles.css";

const height = 80;
const width = 250;
const spacing = 50;

const iconType = {
  ALGEBRA: 0,
  MATH: 1,
  SCIENCE: 2,
  GEO: 3,
};

const getIcon = (key) => {
  const width = 32;
  switch (key) {
    case iconType.ALGEBRA:
      return <QMatrix size={width} />;
      break;
    case iconType.MATH:
      return <FunctionMath size={width} />;
      break;
    case iconType.SCIENCE:
      return <Chemistry size={width} />;
      break;
    case iconType.GEO:
      return <EarthFilled size={width} />;
    default:
      return <FunctionMath size={width} />;
  }
};

const sem_nodes = [
  { id: "f1", name: "Fall", height: height, width: width },
  { id: "w1", name: "Winter", height: height, width: width },
  { id: "s1", name: "Summer", height: height, width: width },
  { id: "f2", name: "Fall", height: height, width: width },
  { id: "w2", name: "Winter", height: height, width: width },
];

const sem_links = [
  { id: "sem_fw1", source: "f1", target: "w1", direction: "right" },
  { id: "sem_ws1", source: "w1", target: "s1", direction: "right" },
  { id: "sem_s1f2", source: "s1", target: "f2", direction: "right" },
  { id: "sem_fw2", source: "f2", target: "w2", direction: "right" },
];

const nodes = [
  {
    id: "MATH1052",
    name: "MATH1052",
    height: height,
    width: width,
    icon_type: iconType.MATH,
  },
  {
    id: "MATH2052",
    name: "MATH2052",
    height: height,
    width: width,
    icon_type: iconType.MATH,
  },
  {
    id: "MATH2107",
    name: "MATH2107",
    height: height,
    width: width,
    icon_type: iconType.ALGEBRA,
  },
  {
    id: "MATH1152",
    name: "MATH1152",
    height: height,
    width: width,
    icon_type: iconType.ALGEBRA,
  },
  {
    id: "PHYS1001",
    name: "PHYS1001",
    height: height,
    width: width,
    icon_type: iconType.SCIENCE,
  },
  {
    id: "PHYS1004",
    name: "PHYS1004",
    height: height,
    width: width,
    icon_type: iconType.SCIENCE,
  },
  {
    id: "CHEM1006",
    name: "CHEM1006",
    height: height,
    width: width,
    icon_type: iconType.SCIENCE,
  },
  {
    id: "GEOG1020",
    name: "GEOG1020",
    height: height,
    width: width,
    icon_type: iconType.GEO,
  },
  {
    id: "MATH2000",
    name: "MATH2000",
    height: height,
    width: width * 2 + spacing,
    icon_type: iconType.MATH,
  },
];

const shift_courses = {
  MATH2000: 1,
  MATH2107: 1,
  PHYS1004: 1,
};

const links = [
  { id: "1", source: "MATH1052", target: "MATH2052", direction: "" },
  { id: "2", source: "MATH1152", target: "MATH2107", direction: "right" },
  { id: "3", source: "PHYS1001", target: "PHYS1004", direction: "" },
  { id: "4", source: "MATH2052", target: "MATH2000", direction: "right" },
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

const Node = ({ name, x, y, height, width, icon_type }) => {
  console.log({ x, y });
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
          <CardNodeColumn>{getIcon(icon_type)}</CardNodeColumn>
          <CardNodeColumn>
            <CardNodeTitle>{name}</CardNodeTitle>
            <CardNodeSubtitle>Description</CardNodeSubtitle>
          </CardNodeColumn>
        </CardNode>
      </div>
    </foreignObject>
  );
};

const ProgressionPage = ({}) => {
  const elk = new ELK();
  const [trm_positions, setTrmPositions] = useState(null);
  const [positions, setPositions] = useState(null);

  const graph2 = {
    id: "root",
    layoutOptions: {
      "elk.direction": "right",
      "elk.algorithm": "layered",
      "elk.padding": "[left=0, top=0, right=0, bottom=0]",
      separateConnectedComponents: false,
      "spacing.nodeNodeBetweenLayers": spacing,
      "crossingMinimization.semiInteractive": true,
    },
    children: sem_nodes,
    edges: sem_links,
  };

  const graph = {
    id: "root",
    layoutOptions: {
      "elk.direction": "right",
      "elk.algorithm": "layered",
      "elk.padding": "[left=0, top=0, right=0, bottom=0]",
      separateConnectedComponents: false,
      "spacing.nodeNodeBetweenLayers": spacing,
      "crossingMinimization.semiInteractive": true,
    },
    children: nodes,
    edges: links,
  };

  useEffect(() => {
    //create term labels
    elk
      .layout(graph2)
      .then((g) => setTrmPositions(g))
      .catch(console.error);

    elk
      .layout(graph)
      .then((g) => setPositions(g))
      .catch(console.error);
  }, []);

  if (!positions) return null;
  if (!trm_positions) return null;

  const buildNodes = (positions) => {
    const { children } = positions;
    console.log(children);

    //children[0].x = 800;

    return children.map((node, i) => {
      //node.y -= 10;
      if (node.id in shift_courses) {
        node.x +=
          spacing * shift_courses[node.id] + width * shift_courses[node.id];
      }
      return (
        <Node
          key={`node_${i}`}
          name={node.name}
          x={node.x}
          y={node.y}
          height={node.height}
          width={node.width}
          icon_type={node.icon_type}
        />
      );
    });
  };

  const buildLinks = (positions) => {
    const { edges } = positions;
    console.log(edges);

    return edges.map((edge, i) => {
      if (edge.sections[0].outgoingShape in shift_courses) {
        console.log(edge.sections[0])
        edge.sections[0].endPoint.x +=
          spacing * shift_courses[edge.sections[0].outgoingShape] +
          width * shift_courses[edge.sections[0].outgoingShape];
      }
      console.log(edge);
      return <Link key={`link_${i}`} link={edge} />;
    });
  };

  const nodeElements = buildNodes(positions);
  const linkElements = buildLinks(positions);

  return (
    <div
      className={`force`}
      style={{
        position: `relative`,
        height: 2000,
        width: 2000,
        margin: 32,
      }}
    >
      <svg style={{ height: "100px", width: "100%" }}>
        <defs>
          <TeeMarker id="tee" />
          <CircleMarker id="circle" position="start" />
        </defs>
        {buildNodes(trm_positions)}
        {buildLinks(trm_positions)}
      </svg>
      <hr className="hr" />
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
export default ProgressionPage;
