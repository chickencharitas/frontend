import React, { useEffect, useState } from "react";
import { Box, Typography, List, ListItem, ListItemText, Chip, Button } from "@mui/material";
import { getHealthEvents } from "../services/healthService";
import VetInspectionDialog from "./VetInspectionDialog";
import BulkVaccineTreatmentDialog from "./BulkVaccineTreatmentDialog";

export default function ChickenHealthHistoryTab({ chicken, flock }) {
  const [events, setEvents] = useState([]);
  const [vetDialog, setVetDialog] = useState(false);
  const [bulkDialog, setBulkDialog] = useState(false);

  useEffect(() => {
    if (chicken) getHealthEvents({ chicken_id: chicken.id }).then(setEvents);
  }, [chicken, vetDialog, bulkDialog]);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6">{chicken?.name || chicken?.unique_tag || `Chicken #${chicken?.id}`}</Typography>
      <Button variant="outlined" sx={{ mr: 2, mt: 1 }} onClick={() => setVetDialog(true)}>Vet Inspection</Button>
      <Button variant="outlined" sx={{ mt: 1 }} onClick={() => setBulkDialog(true)}>Bulk Vaccination/Treatment</Button>
      <List>
        {events.map(e => (
          <ListItem key={e.id} sx={{ borderBottom: "1px solid #eee" }}>
            <ListItemText
              primary={
                <>
                  <Chip label={e.event_type} size="small" sx={{ mr: 1 }} />
                  {e.details}
                </>
              }
              secondary={
                <>
                  <span>{e.event_date}</span>
                  {e.notes && <><br />{e.notes}</>}
                </>
              }
            />
          </ListItem>
        ))}
      </List>
      <VetInspectionDialog
        open={vetDialog}
        onClose={() => setVetDialog(false)}
        chicken={chicken}
        flock={flock}
        onDone={() => getHealthEvents({ chicken_id: chicken.id }).then(setEvents)}
      />
      <BulkVaccineTreatmentDialog
        open={bulkDialog}
        onClose={() => setBulkDialog(false)}
        flock={flock}
        onDone={() => getHealthEvents({ chicken_id: chicken.id }).then(setEvents)}
      />
    </Box>
  );
}