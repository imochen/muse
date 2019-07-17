const win32 = process.platform === 'win32';
const spawn = win32 ? require('win-spawn') : require('child_process').spawn;

module.exports = spawn;
