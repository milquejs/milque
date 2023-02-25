const fs = require('fs/promises');
const { context } = require('esbuild');

main(process.argv.slice(2));

async function main(args) {
    const watchMode = args.includes('--watch');
    const minify = args.includes('--minify');

    await fs.rm('./out', { recursive: true, force: true });
    await fs.rm('./media', { recursive: true, force: true });
    await fs.mkdir('./out', { recursive: true });
    await fs.mkdir('./media', { recursive: true });
    await fs.copyFile('./src/webview/WebView.css', './media/SceneEditor.css');

    let extensionContext = await context({
        entryPoints: ['src/extension.ts'],
        bundle: true,
        outfile: 'out/extension.js',
        external: ['vscode'],
        format: 'cjs',
        platform: 'node',
        minify,
    });
    let webViewContext = await context({
        entryPoints: ['src/webview/webview.js'],
        bundle: true,
        outfile: 'media/SceneEditor.js',
        format: 'iife',
        platform: 'browser',
        minify,
    });

    if (watchMode) {
        await extensionContext.watch();
        await webViewContext.watch();
        console.log('watching...');
    } else {
        console.log('building...');
        await extensionContext.rebuild();
        await webViewContext.rebuild();
        extensionContext.dispose();
        webViewContext.dispose();
        console.log('done!');
    }
}
