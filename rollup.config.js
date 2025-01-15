import html from 'rollup-plugin-html';
import scss from 'rollup-plugin-scss';
import serve from 'rollup-plugin-serve';
import pug from 'rollup-plugin-pug';  // Убедитесь, что это импортировано
import svgstore from 'svgstore';
import fs from 'fs';
import path from 'path';
import livereload from 'rollup-plugin-livereload';
import copy from 'rollup-plugin-copy';

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

export default {
  input: './src/main.js',
  output: {
    file: './build/bundle.js',
    format: 'es',
    sourcemap: true,
  },
  plugins: [
    pug({
      compileOptions: {
        pretty: true,
      },
    }),
    scss({
      output: './build/bundle.css',
    }),
    {
      name: 'generate-svg-sprite',
      buildStart() {
        generateSvgSprite();
      },
    },
    html({
      inject: {
        injectBody: '<script type="module" src="./bundle.js"></script>',
        injectHead: '<link rel="stylesheet" href="./bundle.css">',
      }
    }),
    copy({
      targets: [
        { src: 'src/icons/*', dest: './build/icons' },
        { src: 'src/images/*', dest: './build/images' },
        { src: 'src/fonts/*', dest: './build/fonts' },
        { src: 'src/scripts/*', dest: './build/scripts' },
      ],
    }),
    serve({
      open: true,
      contentBase: 'build',
      port: 3000,
    }),
    livereload({
      watch: 'build',
    }),
  ],
};
