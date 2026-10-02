import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { build } from 'esbuild';

const { outputFiles } = await build({
  entryPoints: ['lib/umami.ts'],
  bundle: true,
  write: false,
  platform: 'node',
  format: 'cjs',
});
function setup() {
  const events = [];
  const timers = new Map();
  let time = 1000;
  let id = 0;
  const window = { location: { pathname: '/vi/quick-ring/' } };
  const context = {
    window,
    document: { documentElement: { lang: 'vi' } },
    module: { exports: {} },
    Promise,
    Date: { now: () => time },
    setTimeout: (fn) => {
      timers.set(++id, fn);
      return id;
    },
    clearTimeout: (key) => timers.delete(key),
  };
  vm.runInNewContext(outputFiles[0].text, context);
  const api = context.module.exports;
  return {
    api,
    events,
    window,
    timers,
    ready: () => {
      window.umami = { track: (event, data) => events.push({ event, data }) };
    },
    advance: (duration) => {
      time += duration;
    },
  };
}
test('queued views retain original context and flush exactly once after late loading', () => {
  const state = setup();
  assert.equal(state.api.trackUmamiEvent('demo_view', { demo: 'demo.quickring.title' }), true);
  state.window.location.pathname = '/pricing/';
  state.ready();
  state.api.flushUmamiEvents();
  state.api.flushUmamiEvents();
  assert.equal(state.events.length, 1);
  assert.equal(state.events[0].data.path, '/vi/quick-ring/');
  assert.equal(state.events[0].data.locale, 'vi');
  assert.equal(state.timers.size, 0);
});
test('blocked tracker queue is capped and expires without leaking timers', () => {
  const state = setup();
  for (let i = 0; i < 100; i++) assert.equal(state.api.trackUmamiEvent('demo_view'), true);
  assert.equal(state.api.trackUmamiEvent('extra'), false);
  assert.equal(state.timers.size, 1);
  state.advance(30_001);
  state.api.flushUmamiEvents();
  state.ready();
  state.api.flushUmamiEvents();
  assert.equal(state.events.length, 0);
  assert.equal(state.timers.size, 0);
});
test('throwing analytics never breaks the action and can recover', () => {
  const state = setup();
  state.window.umami = {
    track: () => {
      throw new Error('blocked');
    },
  };
  assert.equal(state.api.trackUmamiEvent('download', { placement: 'header' }), true);
  state.ready();
  state.api.flushUmamiEvents();
  assert.equal(state.events[0].event, 'download');
});
