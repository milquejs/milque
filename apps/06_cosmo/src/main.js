import { DisplayPort } from '@milque/display';
import '@milque/input';
import '@milque/asset';
import './error.js';

import { main } from './asteroid/main.js';

DisplayPort.define();
window.addEventListener('DOMContentLoaded', main);
