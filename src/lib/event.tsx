import { EventId } from '@wca/helpers';

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

export function getEventShortName(eventId: EventId): string {
  return allEvents[eventId].shortName;
}
