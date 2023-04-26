import React from 'react';

import FullCalendar from '@fullcalendar/react';
import listPlugin from '@fullcalendar/list';
import momentTimezonePlugin from '@fullcalendar/moment-timezone';
import { Assignment } from '@wca/helpers';

import { ActivitiesById } from '../lib/activity';
import { activityToEvent } from '../lib/calendar';

import './calendar.css';

type Props = {
  activitiesById: ActivitiesById;
  assignments: Assignment[];
  timezone: string;
};

export default function IndividualCalendar({ activitiesById, timezone, assignments } : Props) {
  const events = assignments.map(({ assignmentCode, activityId }) => activityToEvent(assignmentCode, activitiesById[activityId]));
  const eventsByDate: { [key: string]: any[] } = {
  };
  events.forEach(e => {
    // FIXME: in puppeteer it seems relying on Date printing doesn't quite work;
    // Slicing is not reliable but it works atm.
    const date = e.start.slice(0, 10);
    eventsByDate[date] ||= [];
    eventsByDate[date].push(e);
  });

  const days = Object.keys(eventsByDate);
  return (
    <>
      {days.map((d: string) => {
        return (
          <FullCalendar
            key={d}
            plugins={[listPlugin, momentTimezonePlugin]}
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
            timeZone={timezone}
            views={{
              'compList': {
                type: 'list',
                duration: { days: 1 },
              },
            }}
            initialEvents={eventsByDate[d]}
          />
        );
      })}
    </>
  );
}

