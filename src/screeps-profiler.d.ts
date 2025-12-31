declare module "screeps-profiler" {
  export const registerFN: <T extends Function>(f: T, n?: string) => T;
  export const registerObject: <T extends Object>(f: T, n?: string) => T;
  export const registerClass: <T extends Object>(f: T, n?: string) => T;
  export const enable: () => void;
  export const wrap: (f: () => void) => () => void;
};
