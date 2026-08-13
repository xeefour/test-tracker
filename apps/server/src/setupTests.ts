// Server-side test setup. Server runs in node (no jsdom) so we don't load
// @testing-library/jest-dom. Kept for parity with the previous single-repo
// config; node 20+ has TextEncoder/TextDecoder globally.
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as unknown as typeof globalThis.TextDecoder;
