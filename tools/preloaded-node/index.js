/**
 * Main executable
 */
const bin = require.resolve('./bin')

/**
 * Spawn preloaded-node asynchronously
 */
const spawn = (...args) =>
  require('child_process').spawn(bin, ...args)

/**
 * Spawn preloaded-node synchronously
 */
const spawnSync = (...args) =>
  require('child_process').spawnSync(bin, ...args)

Object.assign(exports, {
  bin,
  spawn,
  spawnSync
})

Object.defineProperty(exports, '__esModule', { value: true })
