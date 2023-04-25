import React, { useMemo } from 'react';

import { Assignment, Competition, Schedule, Activity, Room } from '@wca/helpers';

import FullCalendar from '@fullcalendar/react';
import listPlugin from '@fullcalendar/list';

import './calendar.css';

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
  date: string;
};

const codeToShort: { [key: string]: string } = {
  "competitor": "C",
  "staff-scrambler": "S",
  "staff-judge": "J",
  "staff-runner": "R",
};

function activityToEvent(assignment: Assignment,
  activitiesById: ActivitiesById) {
  const { activityId, assignmentCode } = assignment;
  const activity = activitiesById[activityId];
  return {
    id: `${activity.id}`,
    title: `${activity.activityCode} - ${codeToShort[assignmentCode] || assignmentCode}`,
    color: activity.room.color,
    start: activity.startTime,
    end: activity.endTime,
  };
}

function Cal({ activitiesById, views, date, assignments } : CalendarProps) {
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

export default function PersonalSchedules({ wcif } : PSProps) {
  const sorted = wcif.persons.sort((a, b) => a.name.localeCompare(b.name));
  const persons = sorted.slice(0, 10);
  const persons1 = sorted.slice(10, 20);
  const persons2 = sorted.slice(20, 30);
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
      <div className="cal-column">
        {persons.map(({ wcaId, name, assignments }) => {
          return (
            <div key={wcaId} className="cal">
              <p className="name">{name}</p>
              <Cal
                activitiesById={activitiesById}
                assignments={assignments || []}
                views={views}
                date={wcif.schedule.startDate}
              />
            </div>
          );
        })}
      </div>
      <div className="cal-column">
        {persons1.map(({ wcaId, name, assignments }) => {
          return (
            <div key={wcaId} className="cal">
              <p className="name">{name}</p>
              <Cal
                activitiesById={activitiesById}
                assignments={assignments || []}
                views={views}
                date={wcif.schedule.startDate}
              />
            </div>
          );
        })}
      </div>
      <div className="cal-column">
        {persons2.map(({ wcaId, name, assignments }) => {
          return (
            <div key={wcaId} className="cal">
              <p className="name">{name}</p>
              <Cal
                activitiesById={activitiesById}
                assignments={assignments || []}
                views={views}
                date={wcif.schedule.startDate}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
