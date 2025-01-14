import scss from 'rollup-plugin-scss'
import serve from 'rollup-plugin-serve'

export default [
    {
      input: './src/main.js',
      output: {
        file: './build/bundle.js',
        format: 'es'
      },
      plugins: [
        scss(),
        serve({
          open: true,
          host: 'localhost',
          port: 10002,          
        }),
      ]
    }
  ];