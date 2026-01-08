import { Schema } from 'electron-store';
import type { ValSettings } from '../types';

// establish settings schema; must literally be named 'schema'
export const schema: Schema<ValSettings> = {
  randOrder: {
    type: 'boolean',
    default: false,
  },
  randStart: {
    type: 'boolean',
    default: false,
  },
  autoStart: {
    type: 'boolean',
    default: false,
  },
  mute: {
    type: 'boolean',
    default: false,
  },
  vWidth: {
    type: 'number',
    default: 720,
  },
  vWidthArray: {
    type: 'array',
    items: { type: 'number' },
    default: [240, 352, 480, 720, 960, 1280, 1440, 1920, 2880, 3840],
  },
  aspRatio: {
    type: 'array',
    items: { type: 'number' },
    minItems: 2,
    maxItems: 2,
    default: [16, 9],
  },
  lastPath: {
    type: 'string',
    default: '',
  },
};
