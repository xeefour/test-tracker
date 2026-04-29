import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
global.setImmediate = global.setImmediate || ((fn: (...args: any[]) => void, ms?: number, ...args: any[]) => setTimeout(fn, ms, ...args));
