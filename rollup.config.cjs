const scss = require('rollup-plugin-scss');
const serve = require('rollup-plugin-serve');
const pug = require('rollup-plugin-pug');
const svgstore = require('svgstore');
const fs = require('fs');
const path = require('path');

function generateSvgSprite() {
  const iconsDir = path.resolve('src/icons');
  const outputDir = path.resolve('build');
  const sprites = svgstore();

  fs.readdirSync(iconsDir).forEach((file) => {
    if (path.extname(file) === '.svg') {
      const iconName = path.basename(file, '.svg');
      const filePath = path.join(iconsDir, file);
      sprites.add(iconName, fs.readFileSync(filePath, 'utf8'));
    }
  });

  fs.writeFileSync(path.join(outputDir, 'sprite.svg'), sprites.toString());
  console.log('SVG спрайт успешно создан: build/sprite.svg');
}

module.exports = {
  input: './src/main.js',
  output: {
    file: './build/bundle.js',
    format: 'es',
  },
  plugins: [
    pug({
      compileOptions: {
        pretty: true,
      },
    }),
    scss(),
    {
      name: 'generate-svg-sprite',
      buildStart() {
        generateSvgSprite();
      },
    },
    serve({
      open: true,
      host: 'localhost',
      port: 10002,
    }),
  ],
};
