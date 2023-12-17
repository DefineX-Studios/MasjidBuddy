export type Masjid = {
  uuid: string;
  name: string;
  address: Address;
  mobile_no: string;
  longitude: number;
  latitude: number;
  namaz_timings: NamazTimings;
};

type Address = {
  line1: string;
  line2: string;
  pin: string;
};

type NamazTimings = {
  fajar: string;
  zohar: string;
  jummah: string;
  asr: string;
  magrib: string;
  isha: string;
};

export const AddressString = (a: Address) =>
  [a.line1, a.line2, a.pin].join(',\n');
