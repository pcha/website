const { readFileSync } = require('node:fs');
const { dirname, join } = require('node:path');
const stackoverflow = require('jsonresume-theme-stackoverflow');

const fontAwesome = dirname(require.resolve('@fortawesome/fontawesome-free/package.json'));
const iconStyles = ['fontawesome', 'brands', 'solid', 'regular'].map((name) =>
  readFileSync(join(fontAwesome, 'css', name + '.min.css'), 'utf8')
).join('\n').replace(
  /url\(\.\.\/webfonts\/([\w-]+\.woff2)\) format\("woff2"\),url\(\.\.\/webfonts\/[\w-]+\.ttf\) format\("truetype"\)/g,
  (_, file) => {
    const font = readFileSync(join(fontAwesome, 'webfonts', file)).toString('base64');
    return 'url(data:font/woff2;base64,' + font + ') format("woff2")';
  },
);
const printIcons = ['linkedin', 'github'].map((network) => {
  const icon = readFileSync(join(fontAwesome, 'svgs', 'brands', network + '.svg')).toString('base64');
  return '--' + network + '-icon: url(data:image/svg+xml;base64,' + icon + ');';
});
const overrides = ':root { ' + printIcons.join(' ') + ' }\n'
  + readFileSync(join(__dirname, 'override.css'), 'utf8');

exports.pdfRenderOptions = {
  ...stackoverflow.pdfRenderOptions,
  format: 'A4',
  mediaType: 'print',
};

exports.render = (resume) => stackoverflow.render(resume)
  // Inline the theme's own icon assets and CSS override for the CLI's data URL.
  .replace(/<link rel="stylesheet" href="https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/font-awesome\/[^>]+>/, () => '<style>' + iconStyles + '</style>')
  .replace('<link rel="stylesheet" href="./override.css">', '')
  .replace('</head>', () => '<style>' + overrides + '</style></head>')
  .replace(', user-scalable=no', '')
  .replace('</header>', '<p class="pdf-download"><a href="/cv.pdf" download>Download résumé (PDF)</a></p></header>')
  // Keep the address readable in the HTML served through Cloudflare.
  .replace(/<a\b[^>]*href="mailto:[^"]+"[^>]*>[\s\S]*?<\/a>/g, (link) => '<!--email_off-->' + link + '<!--/email_off-->');
