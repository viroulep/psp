import React, { useMemo } from "react";

import { Competition } from "@wca/helpers";

import { computeActivitiesById, ActivitiesById } from "../lib/activity";
import IndividualCalendar from "./IndividualCalendar";

type Props = {
  wcif: Competition;
};

const COLUMNS = Array.from(Array(3).keys());

export default function PersonalSchedules({ wcif }: Props) {
  const sorted = wcif.persons.sort((a, b) => a.name.localeCompare(b.name));
  const chunkSize = wcif.persons.length / COLUMNS.length;
  const activitiesById: ActivitiesById = useMemo(
    () => computeActivitiesById(wcif.schedule),
    [wcif]
  );
  // This is approximate and will brake for multiple timezones competitions,
  // but I doubt this tool would be useful for FMC World-like competitions.
  const timezone = wcif.schedule.venues[0].timezone;
  return (
    <div className="row">
      {COLUMNS.map((i) => {
        const start = i * chunkSize;
        const persons = sorted.slice(start, start + chunkSize);
        return (
          <div className="cal-column" key={i}>
            {persons.map(({ wcaId, wcaUserId, name, assignments }) => {
              return (
                <div key={wcaUserId} className="cal">
                  <p className="name">{name}</p>
                  <IndividualCalendar
                    activitiesById={activitiesById}
                    assignments={assignments || []}
                    timezone={timezone}
                  />
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
