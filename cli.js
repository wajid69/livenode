#!/usr/bin/env node

const chokidar = require('chokidar');
const { spawn } = require('child_process');
const path = require('path');

function parseArgs(argv) {
  const args = { _: [] };
  let lastKey = null;
  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];
    if (arg.startsWith('--')) {
      lastKey = arg.replace(/^--/, '');
      if (['ext', 'ignore', 'exec', 'delay'].includes(lastKey)) {
        if (argv[i + 1] && !argv[i + 1].startsWith('--')) {
          args[lastKey] = argv[++i];
        } else {
          args[lastKey] = true;
        }
      } else {
        args[lastKey] = true;
      }
    } else {
      if (lastKey) {
        if (Array.isArray(args[lastKey])) {
          args[lastKey].push(arg);
        } else if (args[lastKey] !== undefined) {
          args[lastKey] = [args[lastKey], arg];
        } else {
          args[lastKey] = arg;
        }
      } else {
        args._.push(arg);
      }
    }
  }
  return args;
}

function log(msg) {
  console.log(`[livenode] ${msg}`);
}

function main() {
  const args = parseArgs(process.argv);
  const script = args._[0];
  if (!script) {
    console.error('Usage: livenode <script> [--ext js,ts] [--delay 500] [--ignore build] [--exec "ts-node"]');
    process.exit(1);
  }
  const exts = args.ext ? args.ext.split(',').map(e => e.trim()) : null;
  const delay = args.delay ? parseInt(args.delay, 10) : 200;
  const ignores = ['node_modules', '.git'];
  if (args.ignore) {
    if (Array.isArray(args.ignore)) {
      ignores.push(...args.ignore);
    } else {
      ignores.push(args.ignore);
    }
  }
  const execCmd = args.exec ? args.exec : 'node';
  let proc = null;
  let restartTimeout = null;

  function startProcess() {
    if (proc) proc.kill();
    proc = spawn(execCmd, [script, ...args._.slice(1)], { stdio: 'inherit', shell: true });
    proc.on('exit', (code, signal) => {
      if (signal !== 'SIGTERM') {
        process.exitCode = code;
      }
    });
  }

  function shouldWatch(file) {
    if (!exts) return true;
    return exts.some(ext => file.endsWith('.' + ext));
  }

  log('Watching for changes...');
  startProcess();

  const watcher = chokidar.watch('.', {
    ignored: (file) => {
      return ignores.some(ig => file.includes(path.sep + ig + path.sep) || file.endsWith(path.sep + ig) || file === ig);
    },
    ignoreInitial: true,
    persistent: true,
    awaitWriteFinish: true
  });

  watcher.on('all', (event, file) => {
    if (!shouldWatch(file)) return;
    log(`Change detected in: ${file}`);
    if (restartTimeout) clearTimeout(restartTimeout);
    restartTimeout = setTimeout(() => {
      log('Restarting...');
      startProcess();
    }, delay);
  });

  process.on('SIGINT', () => {
    watcher.close();
    if (proc) proc.kill();
    process.exit(0);
  });
}

main();
