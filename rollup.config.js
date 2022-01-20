import babel from '@rollup/plugin-babel';
import external from 'rollup-plugin-peer-deps-external';
import del from 'rollup-plugin-delete';
import pkg from './package.json';
import json from '@rollup/plugin-json'; 
import image from '@rollup/plugin-image'; 
import scss from 'rollup-plugin-scss'  
import autoprefixer from 'autoprefixer';
import postcss from 'rollup-plugin-postcss';

import { terser } from "rollup-plugin-terser";
export default {
    
    // preserveModules: true,
    input: pkg.source,
    output: [
        { file: pkg.main, format: 'cjs' },
        { file: pkg.module, format: 'esm' }
    ],
    plugins: [
        json(), 
        scss(),
        image(),
        external(),
        babel({
            exclude: 'node_modules/**'
        }),
        postcss({
            plugins: [autoprefixer()],
            sourceMap: true,
            extract: true,
            minimize: true
        }),
        terser(),
        del({ targets: ['dist/*'] }),
    ],
    external: Object.keys(pkg.peerDependencies || {}),
}; 