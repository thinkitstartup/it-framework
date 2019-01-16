import babel from 'rollup-plugin-babel';

export default [{
    input: './src/js/it-framework.js',
    plugins: [
        babel({ exclude: 'node_modules/**' })
    ],    
    output: {
        name: 'IT',
        file: './dist/it-framework.all.js',
        format: 'iife'
    }
}]