import path from 'path';
import chokidar from 'chokidar';

import {
  verifyFile,
  verifyDirectory,
  copyFile,
  deleteFile,
  deleteFiles,
} from './FileUtil.js';
import { createUnzip, createZip } from './Zipper.js';

export class FileManager {
  /**
   * @param {string} outputDir
   * @param {boolean} watch
   */
  constructor(outputDir, watch) {
    /**
     * @protected
     * @type {string}
     */
    this.outputDir = outputDir;
    /**
     * @protected
     * @type {boolean}
     */
    this.watching = watch;
    /**
     * @private
     * @type {Array<import('chokidar').FSWatcher>}
     */
    this.activeWatchers = [];
  }

  async clearOutput() {
    let outputDir = this.outputDir;
    if (await verifyDirectory(outputDir)) {
      await deleteFiles(outputDir);
    }
  }

  async copy(inputFile, outputPath) {
    outputPath = path.join(this.outputDir, outputPath);
    if (await verifyFile(inputFile)) {
      await copyFile(inputFile, outputPath);
    }
    if (this.watching) {
      let watcher = chokidar.watch(inputFile);
      watcher.on('all', async (event) => {
        switch (event) {
          case 'add':
          case 'change':
            if (await verifyFile(inputFile)) {
              await copyFile(inputFile, outputPath);
            }
            break;
          case 'unlink':
            if (await verifyFile(outputPath)) {
              await deleteFile(outputPath);
            }
            break;
          default:
            return;
        }
      });
      this.activeWatchers.push(watcher);
    }
  }

  async zip(inputDir, outputPath) {
    outputPath = path.join(this.outputDir, outputPath);
    if (await verifyDirectory(inputDir)) {
      await createZip(outputPath, inputDir);
    }
    if (this.watching) {
      let watcher = chokidar.watch(inputDir);
      watcher.on('all', async (event) => {
        switch (event) {
          case 'add':
          case 'change':
          case 'unlink':
            if (await verifyDirectory(inputDir)) {
              await createZip(outputPath, inputDir);
            }
            break;
          default:
            return;
        }
      });
      this.activeWatchers.push(watcher);
    }
  }

  async unzip(inputFile, outputPath) {
    outputPath = path.join(this.outputDir, outputPath);
    if (await verifyFile(inputFile)) {
      await createUnzip(inputFile, outputPath);
    }
    if (this.watching) {
      let watcher = chokidar.watch(inputFile);
      watcher.on('all', async (event) => {
        switch (event) {
          case 'add':
          case 'change':
          case 'unlink':
            if (await verifyFile(inputFile)) {
              await createUnzip(inputFile, outputPath);
            }
            break;
          default:
            return;
        }
      });
      this.activeWatchers.push(watcher);
    }
  }

  async close() {
    for (let watcher of this.activeWatchers) {
      await watcher.close();
    }
    this.activeWatchers.length = 0;
  }
}
