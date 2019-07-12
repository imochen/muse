const config = require('./config/index');
const pkg = require('./package.json');

const xlog = require('./util/xlog');
const {
  requireIfExsit,
  requireMiddleware,
} = require('./util/index');

module.exports = function (options) {
  xlog.info(c => c.green('｡:.ﾟヽ(｡◕‿◕｡)ﾉﾟ.:｡+ﾟ'));

  requireMiddleware('before-run', { pkg, options });

  xlog.info('Using muse', c => c.magenta(config('ENV.root')));
  xlog.info('Muse version', c => c.magenta(config('ENV.version')));
  xlog.info('Current directory', c => c.magenta(config('ENV.cwd')));

  requireMiddleware('before-task', config());

  process.chdir(config('PROJECT.working_path'));

  xlog.info('Change working path to', c => c.magenta(config('PROJECT.working_path')));

  const processor = requireIfExsit(__dirname, `processor/${config('OPTIONS.action')}`);
  if (!processor) {
    xlog.error(`${config('OPTIONS.action')} processor not found! `);
    process.exit(-1);
  }

  processor().on('close', (CODE) => {
    requireMiddleware('after-task', Object.assign(config(), {
      CODE,
    }));
  });
};
