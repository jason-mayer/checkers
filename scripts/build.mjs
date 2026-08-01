//@ts-check
/**
 * Packs css+js into index.html, minifies it, and writes it to index.min.html
 */

import * as fs from 'fs/promises';
import { minify } from 'html-minifier-next';
import { build } from 'esbuild';
import { compileAsync } from 'sass';

let input = await Promise.all([
    build({
        entryPoints: ['src/ts/index.ts'],
        sourcemap: false,
        bundle: true,
        minify: true,
        write: false,
        target: "es6",
        loader: {
            ".svg": 'text'
        },
        // outfile: "out/index.min.js"
    }).then(res => res.outputFiles[0].text),
    compileAsync('src/scss/index.scss', {
        sourceMap: false,
        style: "compressed",
    }).then(res => res.css),
    fs.readFile("src/html/index.html", "utf-8"),
]);

let
    js = input[0],
    css = input[1],
    html = input[2],
    bundle = html.replace(
        `<script src="index.js"></script>`,
        `<script>${js}</script>`
    ).replace(
        `<link rel="stylesheet" href="index.css">`,
        `<style>${css}</style>`
    );

await fs.rm('out', { recursive: true }).catch(_ => null);
await fs.mkdir('out').catch(_ => null);


await Promise.all([
    minify(bundle).then(b =>
        fs.writeFile("out/bundle.min.html", b)),
    minify(html).then(b =>
        fs.writeFile("out/index.min.html", b)),
    fs.writeFile("out/index.min.js", js),
    fs.writeFile("out/index.min.css", css)
]);

process.exit(0);