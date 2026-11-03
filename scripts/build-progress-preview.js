'use strict';

// The public preview is a static Test marketplace build. The normal Express build
// and transaction endpoints are preserved for the complete marketplace.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const root = path.resolve(__dirname, '..');
const config = require('./progress-preview.config.json');

execFileSync(process.execPath, ['scripts/build.js'], {
  cwd: root,
  stdio: 'inherit',
  env: {
    ...process.env,
    CI: 'true',
    GENERATE_SOURCEMAP: 'false',
    REACT_APP_PROGRESS_PREVIEW: 'true',
    REACT_APP_ENV: 'test',
    REACT_APP_SHARETRIBE_USING_SSL: 'true',
    REACT_APP_MARKETPLACE_ROOT_URL: config.url,
    REACT_APP_SHARETRIBE_SDK_CLIENT_ID: config.clientId,
    REACT_APP_MARKETPLACE_NAME: 'Straw & Pasture',
  },
});

const build = path.join(root, 'build');
const output = path.join(root, 'dist');
fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(output);
fs.cpSync(path.join(build, 'static'), path.join(output, 'static'), { recursive: true });
const { entrypoints } = JSON.parse(fs.readFileSync(path.join(build, 'asset-manifest.json')));
const styles = entrypoints
  .filter(p => p.endsWith('.css'))
  .map(p => `<link rel="stylesheet" href="/${p}">`)
  .join('');
const scripts = entrypoints
  .filter(p => p.endsWith('.js'))
  .map(p => `<script defer src="/${p}"></script>`)
  .join('');
const html = fs
  .readFileSync(path.join(build, 'index.html'), 'utf8')
  .replace(/<!--![\s\S]*?-->/g, '')
  .replace(
    '</head>',
    `<title>Straw &amp; Pasture — Progress Preview</title><meta name="robots" content="noindex,nofollow">${styles}${scripts}</head>`
  );
fs.writeFileSync(path.join(output, 'index.html'), html);
fs.writeFileSync(path.join(output, 'robots.txt'), 'User-agent: *\nDisallow: /\n');
// Sites serves unknown page paths through its SPA fallback. A wildcard rewrite
// would also intercept real JavaScript and CSS assets on the public host.
console.log('Packaged the Test marketplace preview in dist/.');
