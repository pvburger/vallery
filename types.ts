import { ParsedQs } from 'qs';


export type ButtonProp = {
  label: string;
  runFun: () => void;
};

export type QueryRequest = (string | ParsedQs) | (string | ParsedQs)[] | undefined;