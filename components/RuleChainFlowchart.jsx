import React, { useState } from "react";
import ReactFlow, { MiniMap, Controls, Background, addEdge } from "reactflow";
import 'reactflow/dist/style.css';

const initialNodes = [
  { id: '1', type: 'input', data: { label: 'Trigger: Low Inventory' }, position: { x: 50, y: 25 } },
  { id: '2', data: { label: 'Action: Send Email' }, position: { x: 250, y: 25 } }
];
const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true }
];

export default function RuleChainFlowchart({ value, onChange }) {
  const [nodes, setNodes] = useState(value?.nodes || initialNodes);
  const [edges, setEdges] = useState(value?.edges || initialEdges);

  const onConnect = (params) => setEdges(eds => addEdge(params, eds));

  // Optionally: save nodes/edges as rule chain JSON onChange
  return (
    <div style={{ height: 400 }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={setNodes}
        onEdgesChange={setEdges}
        onConnect={onConnect}
        fitView
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}