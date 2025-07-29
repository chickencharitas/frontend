import React, { useState } from "react";
import { Stack, Button, TextField, MenuItem, Paper } from "@mui/material";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const ACTIONS = [
  { value: "send_email", label: "Send Email" },
  { value: "send_push", label: "Push Notification" },
  { value: "create_task", label: "Create Task" }
];

export default function RuleChainDnDBuilder({ value = [], onChange }) {
  const [chain, setChain] = useState(value);

  function onDragEnd(result) {
    if (!result.destination) return;
    const items = Array.from(chain);
    const [reordered] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reordered);
    setChain(items);
    onChange && onChange(items);
  }

  function addAction() {
    setChain([...chain, { type: "", params: {} }]);
  }

  function updateAction(i, key, val) {
    const newChain = [...chain];
    newChain[i][key] = val;
    setChain(newChain);
    onChange && onChange(newChain);
  }

  function removeAction(i) {
    const newChain = [...chain];
    newChain.splice(i, 1);
    setChain(newChain);
    onChange && onChange(newChain);
  }

  return (
    <Paper sx={{ p: 2 }}>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="actions">
          {(provided) => (
            <Stack ref={provided.innerRef} {...provided.droppableProps} spacing={2}>
              {chain.map((a, i) => (
                <Draggable key={i} draggableId={String(i)} index={i}>
                  {(provided) => (
                    <Stack
                      direction="row"
                      spacing={2}
                      alignItems="center"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <TextField
                        select
                        label="Action"
                        value={a.type}
                        onChange={e => updateAction(i, "type", e.target.value)}
                        sx={{ minWidth: 170 }}
                      >
                        {ACTIONS.map(act => <MenuItem key={act.value} value={act.value}>{act.label}</MenuItem>)}
                      </TextField>
                      {a.type === "send_email" && (
                        <TextField label="To" value={a.params?.to || ""} onChange={e => updateAction(i, "params", { ...a.params, to: e.target.value })} />
                      )}
                      <Button size="small" color="error" onClick={() => removeAction(i)}>Remove</Button>
                    </Stack>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Stack>
          )}
        </Droppable>
      </DragDropContext>
      <Button onClick={addAction} sx={{ mt: 2 }}>Add Action</Button>
    </Paper>
  );
}