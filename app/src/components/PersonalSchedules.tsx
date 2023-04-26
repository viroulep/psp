import React, { useMemo } from 'react';

import { Assignment, Competition, Schedule, Activity, Room, EventId } from '@wca/helpers';

import FullCalendar from '@fullcalendar/react';
import listPlugin from '@fullcalendar/list';

import './calendar.css';

const allEvents: { [key: string]: { name: string, shortName: string } } = {
  '333': { name: '3x3x3 Cube', shortName: '3x3' },
  '222': { name: '2x2x2 Cube', shortName: '2x2' },
  '444': { name: '4x4x4 Cube', shortName: '4x4' },
  '555': { name: '5x5x5 Cube', shortName: '5x5' },
  '666': { name: '6x6x6 Cube', shortName: '6x6' },
  '777': { name: '7x7x7 Cube', shortName: '7x7' },
  '333bf': { name: '3x3x3 Blindfolded', shortName: '3BLD' },
  '333fm': { name: '3x3x3 Fewest Moves', shortName: 'FMC' },
  '333oh': { name: '3x3x3 One-Handed', shortName: '3OH' },
  'minx': { name: 'Megaminx', shortName: 'Mega' },
  'pyram': { name: 'Pyraminx', shortName: 'Pyra' },
  'clock': { name: 'Clock', shortName: 'Clock' },
  'skewb': { name: 'Skewb', shortName: 'Skewb' },
  'sq1': { name: 'Square-1', shortName: 'Sq1' },
  '444bf': { name: '4x4x4 Blindfolded', shortName: '4BLD' },
  '555bf': { name: '5x5x5 Blindfolded', shortName: '5BLD' },
  '333mbf': { name: '3x3x3 Multi-Blind', shortName: 'MBLD' },
};


export interface ParsedActivityCode {
  eventId: EventId;
  roundNumber: number | null;
  groupNumber: number | null;
  attemptNumber: number | null;
}

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

type CalendarProps = {
  activitiesById: ActivitiesById;
  assignments: Assignment[];
  views: any;
};

const codeToShort: { [key: string]: string } = {
  "competitor": "Comp",
  "staff-scrambler": "Scr",
  "staff-judge": "Judge",
  "staff-runner": "Run",
};

function activityToEvent(assignment: Assignment,
  activitiesById: ActivitiesById) {
  const { activityId, assignmentCode } = assignment;
  const activity = activitiesById[activityId];
  const { eventId, groupNumber, roundNumber, attemptNumber } = parseActivityCode(activity.activityCode);
  const groupString = groupNumber ? ` - G${groupNumber}` : '';
  const attemptString = attemptNumber ? ` - A${attemptNumber}` : '';
  return {
    id: `${activity.id}`,
    title: `${allEvents[eventId].shortName}-R${roundNumber}${groupString}${attemptString} - ${codeToShort[assignmentCode] || assignmentCode}`,
    color: activity.room.color,
    start: activity.startTime,
    end: activity.endTime,
  };
}

function Cal({ activitiesById, views, assignments } : CalendarProps) {
  const events = assignments.map(a => activityToEvent(a, activitiesById));
  const eventsByDate: { [key: string]: any[] } = {
  };
  events.forEach(e => {
    // FIXME: something reliable that works in puppeteer.
    const date = e.start.slice(0, 10);
    eventsByDate[date] ||= [];
    eventsByDate[date].push(e);
  });

  const titi = Object.keys(eventsByDate);

  // FIXME: set timezone according to the room's WCIF
  return (
    <>
      {titi.map((d: string) => {
        return (
          <FullCalendar
            key={d}
            plugins={[listPlugin]}
            initialDate={d}
            initialView='compList'
            headerToolbar={false}
            displayEventEnd={false}
            contentHeight='auto'
            eventTimeFormat={{
              hour12: false,
              hour: '2-digit',
              minute: '2-digit',
            }}
            views={views}
            initialEvents={eventsByDate[d]}
          />
        );
      })}
    </>
  );
}

type PSProps = {
  wcif: Competition;
};

const COLUMNS = Array.from(Array(3).keys())

export default function PersonalSchedules({ wcif } : PSProps) {
  const sorted = wcif.persons.sort((a, b) => a.name.localeCompare(b.name));
  const chunkSize = wcif.persons.length / COLUMNS.length;
  const activitiesById: ActivitiesById = useMemo(
    () => computeActivitiesById(wcif.schedule),
    [wcif]
  );
  const views = {
    compList: {
      type: 'list',
      duration: { days: wcif.schedule.numberOfDays },
    },
  };
  return (
    <div className="row">
      {COLUMNS.map(i => {
        const start = i * chunkSize;
        const persons = sorted.slice(start, start + chunkSize);
        return (
          <div className="cal-column" key={i}>
            {persons.map(({ wcaId, wcaUserId, name, assignments }) => {
              return (
                <div key={wcaUserId} className="cal">
                  <p className="name">{name}</p>
                  <Cal
                    activitiesById={activitiesById}
                    assignments={assignments || []}
                    views={views}
                  />
                </div>
              );
            })}
          </div>
        )
      })}
    </div>
  );
}
