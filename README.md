# livenode

A powerful, minimal alternative to nodemon for live-reloading Node.js apps. Instantly restart your script when files change, with zero fuss and blazing speed.

## Why livenode?

You want your Node.js app to reload instantly when you save a file, but you don’t want a heavy, slow, or overcomplicated tool. livenode is built for developers who want:

- **Speed**: Lightning-fast restarts using [chokidar](https://github.com/paulmillr/chokidar) for efficient file watching.
- **Simplicity**: One file, zero dependencies except chokidar, and a CLI that just works.
- **Control**: Watch only what you want, ignore what you don’t, and use custom commands.

## Installation

### Global (recommended)

```sh
npm install -g livenode
```

### Local (per project)

```sh
npm install --save-dev livenode
```

## Usage

```sh
livenode <script> [--ext js,ts] [--delay 500] [--ignore build] [--exec "ts-node"]
```

### Examples

**Basic usage:**

```sh
livenode index.js
```

**Watch only JS and TS files:**

```sh
livenode server.js --ext js,ts
```

**Debounce restarts by 1 second:**

```sh
livenode app.js --delay 1000
```

**Ignore the build folder:**

```sh
livenode index.js --ignore build
```

**Use a custom runner (like ts-node):**

```sh
livenode src/app.ts --exec "ts-node"
```

## Flags

- `--ext`   Comma-separated list of extensions to watch (e.g., `js,ts`).
- `--delay` Debounce restarts in milliseconds (default: 200).
- `--ignore` Folder or file to ignore (can be used multiple times).
- `--exec`  Custom command to run your script (default: `node`).

## How is this different from nodemon?

- **Minimal**: No config files, no magic, just works out of the box.
- **Faster**: Uses chokidar directly for best-in-class file watching.
- **Zero bloat**: Only one dependency, no legacy code.
- **No comments in code**: The codebase is as clean as it gets.

If you want a tool that’s easy to audit, hack, or extend, livenode is for you.

## Contributing

Found a bug or want a feature? Open an issue or PR on [GitHub](https://github.com/wajid69/livenode). Please:

- Keep code clean and modern (no comments, use ES6+).
- Write clear commit messages.
- Add tests if you’re fixing a bug or adding a feature.

## License

MIT. Use it, fork it, share it. Enjoy!
