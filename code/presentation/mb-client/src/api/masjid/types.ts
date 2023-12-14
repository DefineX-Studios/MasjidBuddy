export type Masjid = {
  uuid: string;
  name: string;
  address: Address;
  mobile_no: string;
  plus_code: string;
};

type Address = {
  line1: string;
  line2: string;
  pin: string;
};

export const AddressString = (a: Address) =>
  [a.line1, a.line2, a.pin].join(',\n');
