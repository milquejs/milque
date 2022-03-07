import esbuild from 'esbuild';
import open from 'open';
import path from 'path';

function logInfo(message) {
  /* eslint-disable no-console */
  console.log(message);
}

/**
 * @param {esbuild.BuildOptions} config
 * @param {string} [serveDir]
 * @param {string} [outputDir]
 * @param {object} [opts]
 * @param {boolean} [opts.open]
 */
export async function startDevServer(config, serveDir, outputDir, opts = {}) {
  const { open: startOpen = true } = opts;
  let server = await esbuild.serve(
    { servedir: serveDir },
    {
      ...config,
      outdir: path.join(serveDir, outputDir),
    }
  );
  if (startOpen) {
    let url = `http://${server.host}:${server.port}`;
    logInfo(`Launching browser at '${url}'`);
    await open(url, { wait: true });
    logInfo('Closed browser.');
  }
}
