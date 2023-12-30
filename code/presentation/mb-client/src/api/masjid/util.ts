import type { Address, NamazTimings } from './types';

const EARTH_RADIUS: number = 6371;

type NamazTime = {
  namaz: keyof NamazTimings;
  time: string;
};

type Location = {
  lat: number;
  lon: number;
};

export function getDistanceFromLocationInKm(a: Location, b: Location): number {
  const deltaLat: number = deg2rad(b.lat - a.lat); // deg2rad below
  const deltaLon: number = deg2rad(b.lon - a.lon);

  const angularDistance: number =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(deg2rad(a.lat)) *
      Math.cos(deg2rad(b.lat)) *
      Math.sin(deltaLon / 2) *
      Math.sin(deltaLon / 2);

  const centralAngle: number =
    2 * Math.atan2(Math.sqrt(angularDistance), Math.sqrt(1 - angularDistance));

  const distance: number = EARTH_RADIUS * centralAngle; // Distance in km
  return distance;
}

export function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

export const AddressString = (a: Address) =>
  [a.line1, a.line2, a.pin].join(',\n');

export const convertTimeToAMPM = (time: string): string => {
  const [hours, minutes] = time.split(':').map(Number);
  const amPm = hours >= 12 ? 'pm' : 'am';
  const formattedTime = `${hours}:${minutes < 10 ? '0' : ''}${minutes}${amPm}`;
  return formattedTime;
};

// todo this feels a bit unoptimized to me for now, think of ways to improve it
export const getNextNamaz = (
  currentTime: string,
  namazTimings: NamazTimings
): NamazTime => {
  const currentMinutes = convertTimeToMinutes(currentTime);
  const namazTimingsInMinutes = mapNamazTimingsToMinutes(namazTimings);

  const nextNamazTimings = Object.values(namazTimingsInMinutes).filter(
    (timing) => timing > currentMinutes
  );

  if (nextNamazTimings.length > 0) {
    const nextNamazInMinutes = nextNamazTimings[0];
    return findNamazByMinutes(namazTimings, nextNamazInMinutes);
  }

  const firstNamazInMinutes = namazTimingsInMinutes[0];
  return findNamazByMinutes(namazTimings, firstNamazInMinutes);
};

const convertTimeToMinutes = (time: string): number => {
  const [hours, minutes, seconds] = time.split(':').map(Number);
  return hours * 60 + minutes + seconds / 60;
};

const mapNamazTimingsToMinutes = (
  namazTimings: NamazTimings
): Record<string, number> => {
  const namazTimingsInMinutes: Record<string, number> = {};
  let totalMinutes = 0;

  for (const namaz in namazTimings) {
    const typedNamaz = namaz as keyof NamazTimings;
    const duration = convertTimeToMinutes(namazTimings[typedNamaz]);
    namazTimingsInMinutes[namaz] = totalMinutes;
    totalMinutes += duration;
  }

  return namazTimingsInMinutes;
};

const findNamazByMinutes = (
  namazTimings: NamazTimings,
  minutes: number
): NamazTime => {
  for (const namaz in namazTimings) {
    const typedNamaz = namaz as keyof NamazTimings;
    const duration = convertTimeToMinutes(namazTimings[typedNamaz]);
    if (minutes < duration) {
      return { namaz: typedNamaz, time: namazTimings[typedNamaz] };
    }
  }

  const namaz = Object.keys(namazTimings).reverse()[0] as keyof NamazTimings;

  return { namaz: namaz, time: namazTimings[namaz] };
};
