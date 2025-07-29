import React, { useEffect, useState, useRef } from "react";
import { Paper, CircularProgress, Typography } from "@mui/material";
import Tree from "react-d3-tree";
import { getPedigreeTree } from "../services/breedingService";
// import { getChicken } from "../services/chickenService"; // Uncomment if using recursive build

// Option 1: Use API tree structure
function toTreeData(node, labelKey = "label") {
  if (!node) return null;
  const children = [];
  if (node.father) children.push(toTreeData(node.father, labelKey));
  if (node.mother) children.push(toTreeData(node.mother, labelKey));
  return {
    name: node[labelKey],
    attributes: { Sex: node.sex },
    children: children.length ? children : undefined,
  };
}

// Option 2: Recursively build pedigree tree from chickenId (uncomment if needed)
/*
import { getPedigree } from "../services/breedingService";
async function buildPedigreeTree(chickenId, depth = 3) {
  if (!chickenId || depth === 0) return null;
  const chicken = await getChicken(chickenId);
  if (!chicken) return null;
  const pedigree = await getPedigree(chickenId);
  const fatherNode = pedigree?.father_id ? await buildPedigreeTree(pedigree.father_id, depth - 1) : null;
  const motherNode = pedigree?.mother_id ? await buildPedigreeTree(pedigree.mother_id, depth - 1) : null;
  const children = [fatherNode, motherNode].filter(Boolean);
  return {
    name: chicken.name || chicken.unique_tag,
    attributes: { Sex: chicken.sex, Breed: chicken.breed_name },
    children: children.length > 0 ? children : undefined
  };
}
*/

export default function PedigreeTreeChart({ chickenId }) {
  const [treeData, setTreeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const treeContainer = useRef();

  useEffect(() => {
    setLoading(true);
    // Option 1: Use API tree
    getPedigreeTree(chickenId).then(tree => {
      setTreeData(tree ? [toTreeData(tree)] : []);
      setLoading(false);
    });

    // Option 2: Recursively build (uncomment if needed)
    /*
    buildPedigreeTree(chickenId, 3).then(tree => {
      setTreeData(tree ? [tree] : []);
      setLoading(false);
    });
    */
  }, [chickenId]);

  if (loading) return <CircularProgress />;
  if (!treeData || treeData.length === 0) return <Typography>No pedigree data available.</Typography>;

  return (
    <Paper sx={{ height: 400, p: 1, overflow: "auto" }} ref={treeContainer}>
      <Tree
        data={treeData}
        orientation="vertical"
        translate={{ x: 300, y: 60 }}
        collapsible={false}
        zoomable
        nodeSize={{ x: 200, y: 80 }}
        styles={{
          nodes: { node: { circle: { fill: "#1976d2" } }, leafNode: { circle: { fill: "#90caf9" } } },
        }}
      />
    </Paper>
  );
}