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
  vWidthArray: number[];
  vWidthArraySet: (inp: number[]) => void;
  aspRatio: [number, number];
  aspRatioSet: (inp: [number, number]) => void;
  reSetSet: () => void;
};

export type VideoItemProps = {
  path: string;
  vWidth: number;
  aspRatio: [number, number];
  mute: boolean;
  autoStart: boolean;
  randStart: boolean;
  maxVidId: null | string;
  maxVidIdSet: (inp: null | string) => void;
};

export type ToggleProps = {
  togBool: boolean;
  togFunction: () => void;
};

export class ValSettingsUI {
  randOrder: boolean;
  randStart: boolean;
  autoStart: boolean;
  mute: boolean;
  vWidth: number;
  vWidthArray: number[];
  aspRatio: [number, number];

  constructor() {
    this.randOrder = false;
    this.randStart = false;
    this.autoStart = false;
    this.mute = false;
    this.vWidth = 720;
    this.vWidthArray = [240, 352, 480, 720, 960, 1280, 1440, 1920, 2880, 3840];
    this.aspRatio = [16, 9];
  }
}

export class ValSettings extends ValSettingsUI {
  lastPath: string;

  constructor() {
    super();
    this.lastPath = '';
  }
}

export type SliderProps = {
  vWidth: number;
  vWidthSet: (inp: number) => void;
  vWidthArray: number[];
  step: number;
  aspRatio: [number, number];
};
