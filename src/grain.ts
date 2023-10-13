export type IListener = (value: any) => void;
export type IObservableObject = {
  subscribe: (cb: IListener) => void,
  get: () => Promise<any>,
}

export function makeGrain (value: any) {
  let internalValue = 0;
  const listeners: Function[] = [];
  const counter = {
    set: async (value: any) => {
      internalValue = value;
      listeners.forEach(cb => cb(value));
    },
    get: async () => {
      return internalValue;
    },
    subscribe: (cb: (value: any) => void) => {
      listeners.push(cb);
    }
  };
  return counter;
}