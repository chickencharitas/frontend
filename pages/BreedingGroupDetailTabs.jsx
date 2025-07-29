import React, { useState, useEffect } from "react";
import { Tabs, Tab, Box, Paper } from "@mui/material";
import BreedingGroupMembersTab from "./BreedingGroupMembersTab";
import BreedingMatingHistoryTab from "./BreedingMatingHistoryTab";
import BreedingEggRecordsTab from "./BreedingEggRecordsTab";
import BreedingGoalsTab from "./BreedingGoalsTab";
import BreedingAnalyticsTab from "./BreedingAnalyticsTab";
import BreedingPedigreeTab from "./BreedingPedigreeTab";

export default function BreedingGroupDetailTabs({ group }) {
  const [tab, setTab] = useState(0);

  return (
    <Paper sx={{ p: 2 }}>
      <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" scrollButtons="auto">
        <Tab label="Members" />
        <Tab label="Mating History" />
        <Tab label="Eggs" />
        <Tab label="Goals" />
        <Tab label="Pedigree" />
        <Tab label="Analytics" />
      </Tabs>
      <Box sx={{ mt: 2 }}>
        {tab === 0 && <BreedingGroupMembersTab group={group} />}
        {tab === 1 && <BreedingMatingHistoryTab group={group} />}
        {tab === 2 && <BreedingEggRecordsTab group={group} />}
        {tab === 3 && <BreedingGoalsTab group={group} />}
        {tab === 4 && <BreedingPedigreeTab group={group} />}
        {tab === 5 && <BreedingAnalyticsTab group={group} />}
      </Box>
    </Paper>
  );
}