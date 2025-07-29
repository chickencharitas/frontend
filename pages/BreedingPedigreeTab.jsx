import React, { useState, useEffect } from "react";
import { getGroupMembers, getPedigree } from "../services/breedingService";
import { Card, CardContent, Typography, Stack } from "@mui/material";

export default function BreedingPedigreeTab({ group }) {
  const [members, setMembers] = useState([]);
  const [pedigrees, setPedigrees] = useState({});

  useEffect(() => {
    getGroupMembers(group.id).then(mems => {
      setMembers(mems);
      mems.forEach(m => {
        getPedigree(m.id).then(ped => setPedigrees(prev => ({ ...prev, [m.id]: ped })));
      });
    });
  }, [group.id]);

  return (
    <Stack spacing={2}>
      {members.map(m => (
        <Card key={m.id}>
          <CardContent>
            <Typography variant="h6">{m.name || m.unique_tag}</Typography>
            <Typography variant="body2">Father: {pedigrees[m.id]?.father_id || "?"}, Mother: {pedigrees[m.id]?.mother_id || "?"}</Typography>
          </CardContent>
        </Card>
      ))}
      {/* Advanced: Visualize as tree using a library */}
    </Stack>
  );
}