// rollup.config.js
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';

export default {
    input: 'libs/index.ts',
    output: [{
        file: 'build/mobius-sim.module.es.js',
        format: 'es'
      },
      {
        file: 'build/mobius-sim.module.js',
        format: 'iife',
        name: 'mobius_sim',
        globals: {
          lodash: '_',
          three: 'THREE',
          mathjs: 'math',
          proj4: 'proj4'
        }
      }
    ],
    external: ['three', 'lodash', 'mathjs', 'proj4'],
    plugins: [typescript(), nodeResolve(), commonjs()]
  };
  