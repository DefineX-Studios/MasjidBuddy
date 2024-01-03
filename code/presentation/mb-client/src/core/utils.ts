import { Linking } from 'react-native';
import type { StoreApi, UseBoundStore } from 'zustand';

export function openLinkInBrowser(url: string) {
  Linking.canOpenURL(url).then((canOpen) => canOpen && Linking.openURL(url));
}

type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never;

export const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(
  _store: S
) => {
  let store = _store as WithSelectors<typeof _store>;
  store.use = {};
  for (let k of Object.keys(store.getState())) {
    (store.use as any)[k] = () => store((s) => s[k as keyof typeof s]);
  }

  return store;
};

export const entries = Object.entries as <T>(
  obj: T
) => Array<[keyof T, T[keyof T]]>;
export const keys = Object.keys as <T>(obj: T) => Array<keyof T>;
export const values = Object.values as <T>(obj: T) => Array<T[keyof T]>;

// credits goes to https://stackoverflow.com/questions/50374908/transform-union-type-to-intersection-type/50375286#50375286
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never;

// credits goes to https://stackoverflow.com/questions/53953814/typescript-check-if-a-type-is-a-union
type IsUnion<T> = [T] extends [UnionToIntersection<T>] ? false : true;

type IsValueValid<Obj> = Obj extends Record<infer _, infer Value>
  ? IsUnion<Value> extends true
    ? never
    : Obj
  : never;

export const typeValidate = <Key extends string, Value>(
  obj: IsValueValid<Record<Key, Value>>
) => obj;
