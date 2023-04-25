import React, { useMemo } from 'react';

import { Competition, Schedule, Activity, Room } from '@wca/helpers';

interface ActivityWithRoom extends Activity {
  // FIXME: figure out if this does duplicate room data or if we get a ref
  // to the existing room.
  readonly room: Room;
};

type ActivitiesById = {
  [key: number]: ActivityWithRoom;
};

function computeActivitiesById(schedule: Schedule): ActivitiesById {
  const activitiesById: ActivitiesById = {};
  const fillActivities = (activities: Activity[], room: Room) => {
    activities.forEach(a => {
      activitiesById[a.id] = { ...a, room };
      fillActivities(a.childActivities, room);
    });
  };
  schedule.venues.forEach(v => {
    v.rooms.forEach(r => {
      fillActivities(r.activities, r);
    });
  });
  return activitiesById;
}

type PSProps = {
  wcif: Competition;
};

export default function PersonalSchedules({ wcif } : PSProps) {
  const { name } = wcif;
  const p = wcif.persons[0];
  p.assignments ||= [];
  const activitiesById: ActivitiesById = useMemo(
    () => computeActivitiesById(wcif.schedule),
    [wcif]
  );
  console.log(activitiesById);
  return (
    <>
      <div>Personal schedules for {name}.</div>
      <ul>
        {p.assignments.map(a => {
          const activity = activitiesById[a.activityId];
          console.log(a, activity);
          return (
            <li key={a.activityId}>
              {a.assignmentCode}: {activitiesById[a.activityId].startTime}
            </li>
          );
        })}
      </ul>
    </>
  );
}
