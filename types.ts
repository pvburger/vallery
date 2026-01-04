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
  val: T;
  set(inp: T): void;
};

export type MenuProps = {
  randOrder: boolean;
  randOrderSet: () => void;
  randStart: boolean;
  randStartSet: () => void;
  autoStart: boolean;
  autoStartSet: () => void;
  mute: boolean;
  muteSet: () => void;
  vWidth: number;
  vWidthSet: (inp: number) => void;
  aspRatio: [number, number];
  aspRatioSet: (inp: [number, number]) => void;
};

export type VideoItemProps = {
  path: string;
  vWidth: number;
  aspRatio: [number, number];
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
  aspRatio: [number, number];
  lastPath: string;
};

export type SliderProps = {
  vWidth: number;
  vWidthSet: (inp: number) => void;
  step: number;
  valArray: number[];
  aspRatio: [number, number];
};
