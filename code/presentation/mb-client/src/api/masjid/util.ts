import type { Address, NamazTimings } from './types';

type NamazTime = {
  namaz: keyof NamazTimings;
  time: string;
};

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
