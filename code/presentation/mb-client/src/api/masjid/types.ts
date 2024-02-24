export type Masjid = {
  id: string;
  name: string;
  address: Address;
  mobile_no: string;
  longitude: number;
  latitude: number;
  namaz_timings: NamazTimings;
};

export type MasjidWithDistance = {
  masjid: Masjid;
  distance: number;
};

export type Address = {
  line1: string;
  line2: string;
  pin: string;
};

export type NamazTimings = {
  fajar: string;
  zohar: string;
  jummah: string;
  asr: string;
  magrib: string;
  isha: string;
};
