import { ParsedQs } from 'qs';

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
