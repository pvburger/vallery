import type { ParsedQs } from 'qs';

export type ButtonProp = {
  label: string;
  runFun: () => void;
};

export type QueryRequest =
  | (string | ParsedQs)
  | (string | ParsedQs)[]
  | undefined;

export class VideoStats {
  start: number | null;
  end: number | null;
  duration: number | null;

  constructor() {
    this.start = null;
    this.end = null;
    this.duration = null;
  }
}

export type StateMod<T> = {
  get(): T;
  set(inp: T): void;
};

export type MenuProps = {
  randOrder: StateMod<boolean>;
  randStart: StateMod<boolean>;
  autoStart: StateMod<boolean>;
  mute: StateMod<boolean>;
  vWidth: StateMod<number>;
};

export type VideoItemProps = {
  path: string;
  vWidth: number;
  mute: boolean;
  autoStart: boolean;
  randStart: boolean;
};

export type ToggleProps = {
  togBool: boolean;
  togFunction: () => void;
};

export type ValSettings = {
  randOrder: boolean;
  randStart: boolean;
  autoStart: boolean;
  mute: boolean;
  vWidth: number;
  lastPath: string;
};

export type SliderProps = {
  stateMod: StateMod<number>;
};
