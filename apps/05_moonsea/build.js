import { BuildManager } from '@milque/toolkit';
import './munge.js';

async function main(args) {
  const devMode = args.includes('--dev');
  const outputDir = devMode ? 'out' : 'public';
  const watchMode = devMode;
  try {
    let fm = new BuildManager(outputDir, watchMode);
    await fm.clearOutput();
    await fm.copy('src/template.html', 'index.html');
    await fm.munge('res', 'res.pack');
    await fm.build(['src/main.js']);
    await fm.close();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

main(process.argv);
