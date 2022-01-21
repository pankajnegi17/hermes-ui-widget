import babel from '@rollup/plugin-babel';
import external from 'rollup-plugin-peer-deps-external';
import del from 'rollup-plugin-delete';
import pkg from './package.json';
import json from '@rollup/plugin-json'; 
import image from '@rollup/plugin-image'; 
import scss from 'rollup-plugin-scss'  
import autoprefixer from 'autoprefixer';
import postcss from 'rollup-plugin-postcss';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { terser } from "rollup-plugin-terser";
import commonjs from '@rollup/plugin-commonjs';
export default {
    
    // preserveModules: true,
    input: pkg.source,
    output: [
        { file: pkg.main, format: 'cjs' },
        { file: pkg.module, format: 'esm' }
    ],
    plugins: [
        del({ targets: ['dist/*'] }),
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
       
        commonjs( ),
        nodeResolve( ),
        terser()
    ],
    external: Object.keys(pkg.peerDependencies || {}),
}; 