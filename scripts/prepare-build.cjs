const { copyFileSync, mkdirSync } = require('node:fs');

mkdirSync('dist', { recursive: true });
copyFileSync('index.html', 'dist/index.html');
