import { Activity, EventId, Room, Schedule } from '@wca/helpers';

export interface ParsedActivityCode {
  eventId: EventId;
  roundNumber: number | null;
  groupNumber: number | null;
  attemptNumber: number | null;
}

// NOTE: using parseActivityCode from @wca/helpers leads to some compilation
// "errors" :(
export function parseActivityCode(activityCode: string): ParsedActivityCode {
  const [, e, r, g, a] = activityCode.match(
    /^(\w+)(?:-r(\d+))?(?:-g(\d+))?(?:-a(\d+))?$/
  ) as any[];
  return {
    eventId: e,
    roundNumber: r ? parseInt(r, 10) : null,
    groupNumber: g ? parseInt(g, 10) : null,
    attemptNumber: a ? parseInt(a, 10) : null,
  };
}

export interface ActivityWithRoom extends Activity {
  // FIXME: figure out if this does duplicate room data or if we get a ref
  // to the existing room.
  readonly room: Room;
};

export type ActivitiesById = {
  [key: number]: ActivityWithRoom;
};

export function computeActivitiesById(schedule: Schedule): ActivitiesById {
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
