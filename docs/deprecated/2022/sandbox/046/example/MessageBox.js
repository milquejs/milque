import { drawBMText, drawNineBox } from './Render.js';

export class MessageBox {
  constructor() {
    this.messages = [];
    this.progress = 0;
    this.speed = 1;
  }

  step(dt = 1) {
    this.progress += this.speed * dt;
  }

  isWaitingForNext() {
    let currentMessage = this.peekMessage();
    if (!currentMessage) {
      return false;
    }
    if (this.progress > currentMessage.text.length) {
      return true;
    }
    return false;
  }

  nextMessage() {
    if (this.messages.length > 0) {
      this.messages.shift();
      this.progress = 0;
    }
  }

  pushMessage(text, tags = {}) {
    this.messages.push({
      text,
      tags,
    });
  }

  peekMessage() {
    return this.messages[0];
  }

  draw(renderer, left, top, right, bottom) {
    let currentMessage = this.peekMessage();
    // Draw text
    if ('color' in currentMessage.tags) {
      renderer.color(currentMessage.tags.color);
    } else {
      renderer.color(0xffffff);
    }
    let x = left + 20;
    let y = top + 30;
    if (this.progress >= currentMessage.text.length) {
      drawBMText(renderer, currentMessage.text, x, y);
    } else {
      let currentText = currentMessage.text.substring(0, this.progress);
      drawBMText(renderer, currentText, x, y);
    }
    // Draw background
    renderer.color(0xffffff);
    drawNineBox(renderer, left, top, right, bottom);
  }
}

class FormattedMessagePart {
  constructor(text) {
    this.text = text;
    this.bold = false;
    this.italic = false;
    this.color = 0xffffff;
    this.tags = {};
  }
}

const LINK_PATTERN = /([])|\[(.*?)\]\(.*?\)/g;
const BOLD_PATTERN = /__\S.*?\S__/g;
const ITALIC_PATTERN = /_\S.*?\S_/g;

function parse(string) {}

// This is [rainbow text](:color=0xFFFFFF wiggle=true). **Hello** World! This'll be fun { wait } fun [...] fun.
