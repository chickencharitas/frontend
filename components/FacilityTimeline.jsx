import React from 'react';
import { Timeline, TimelineItem, TimelineSeparator, TimelineDot, TimelineContent, TimelineConnector } from '@mui/lab';
import { Typography } from '@mui/material';

export default function FacilityTimeline({ events }) {
  return (
    <Timeline>
      {events.map((e, i) => (
        <TimelineItem key={i}>
          <TimelineSeparator>
            <TimelineDot color={e.critical ? "error" : "primary"} />
            {i < events.length - 1 && <TimelineConnector />}
          </TimelineSeparator>
          <TimelineContent>
            <Typography variant="body2">{e.description}</Typography>
            <Typography variant="caption">{new Date(e.date).toLocaleString()}</Typography>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
}