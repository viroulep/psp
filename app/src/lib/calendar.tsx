import { ActivityWithRoom, parseActivityCode, ParsedActivityCode } from '../lib/activity';
import { getEventShortName } from '../lib/event';

const codeToShort: { [key: string]: string } = {
  "competitor": "Comp",
  "staff-scrambler": "Scr",
  "staff-judge": "Judge",
  "staff-runner": "Run",
};

function computeEventTitle(activityInfo: ParsedActivityCode,
                           assignmentCode: string): string {
  const { eventId, groupNumber, roundNumber, attemptNumber } = activityInfo;
  const roundString = `${getEventShortName(eventId)}-R${roundNumber}`;
  const groupString = groupNumber ? ` - G${groupNumber}` : '';
  const attemptString = attemptNumber ? ` - A${attemptNumber}` : '';
  const assignString = codeToShort[assignmentCode] || assignmentCode;
  return `${roundString}${groupString}${attemptString} - ${assignString}`;
}

export function activityToEvent(assignmentCode: string,
  activity: ActivityWithRoom) {
  const { id, activityCode, room, startTime, endTime }  = activity;
  const { color } = room;
  const title = computeEventTitle(parseActivityCode(activityCode), assignmentCode);
  return {
    id,
    color,
    title,
    start: startTime,
    end: endTime,
  };
}
