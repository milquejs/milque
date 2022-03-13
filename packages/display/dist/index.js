!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t(((e="undefined"!=typeof globalThis?globalThis:e||self).milque=e.milque||{},e.milque.display={}))}(this,(function(e){"use strict";const t="noscale",i="fit",n="scale",s="fill",a="stretch";class h extends HTMLElement{static get[Symbol.for("templateNode")](){let e=document.createElement("template");return e.innerHTML='<div class="container">\n  <label class="hidden" id="title">display-port</label>\n  <label class="hidden" id="fps">00</label>\n  <label class="hidden" id="dimension">0x0</label>\n  <div class="content">\n    <canvas> Oh no! Your browser does not support canvas. </canvas>\n    <slot id="inner"></slot>\n  </div>\n  <slot name="frame"></slot>\n</div>\n',Object.defineProperty(this,Symbol.for("templateNode"),{value:e}),e}static get[Symbol.for("styleNode")](){let e=document.createElement("style");return e.innerHTML=":host {\n  display: inline-block;\n  color: #555555;\n}\n\n.container {\n  display: flex;\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n\n.content {\n  position: relative;\n  margin: auto;\n}\n\n.content > *:not(canvas) {\n  width: 100%;\n  height: 100%;\n}\n\ncanvas {\n  background: #000000;\n  image-rendering: pixelated;\n}\n\nlabel {\n  position: absolute;\n  font-family: monospace;\n  color: currentColor;\n}\n\n#inner {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  position: absolute;\n  top: 0;\n  left: 0;\n  pointer-events: none;\n}\n\n#title {\n  left: 0.5rem;\n  top: 0.5rem;\n}\n\n#fps {\n  right: 0.5rem;\n  top: 0.5rem;\n}\n\n#dimension {\n  left: 0.5rem;\n  bottom: 0.5rem;\n}\n\n.hidden {\n  display: none;\n}\n\n:host([debug]) .container {\n  outline: 6px dashed rgba(0, 0, 0, 0.1);\n  outline-offset: -4px;\n  background-color: rgba(0, 0, 0, 0.1);\n}\n\n:host([mode='noscale']) canvas {\n  margin: 0;\n  top: 0;\n  left: 0;\n}\n\n:host([mode='stretch']) canvas,\n:host([mode='scale']) canvas {\n  width: 100%;\n  height: 100%;\n}\n\n:host([mode='fit']),\n:host([mode='scale']),\n:host([mode='center']),\n:host([mode='stretch']),\n:host([mode='fill']) {\n  width: 100%;\n  height: 100%;\n}\n\n:host([full]) {\n  width: 100vw !important;\n  height: 100vh !important;\n}\n\n:host([disabled]) {\n  display: none;\n}\n\nslot {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  top: 0;\n  left: 0;\n  pointer-events: none;\n}\n\n::slotted(*) {\n  pointer-events: auto;\n}\n",Object.defineProperty(this,Symbol.for("styleNode"),{value:e}),e}static define(e=window.customElements){e.define("display-port",this)}static get observedAttributes(){return["debug","disabled","width","height","onframe","id","class"]}get mode(){return this.getAttribute("mode")}set mode(e){this.setAttribute("mode",e)}get debug(){return this._debug}set debug(e){this.toggleAttribute("debug",e)}get disabled(){return this._disabled}set disabled(e){this.toggleAttribute("disabled",e)}get width(){return this._width}set width(e){this.setAttribute("width",String(e))}get height(){return this._height}set height(e){this.setAttribute("height",String(e))}get onframe(){return this._onframe}set onframe(e){this._onframe&&this.removeEventListener("frame",this._onframe),this._onframe=e,this._onframe&&this.addEventListener("frame",e)}constructor(){super();const e=this.attachShadow({mode:"open"});e.appendChild(this.constructor[Symbol.for("templateNode")].content.cloneNode(!0)),e.appendChild(this.constructor[Symbol.for("styleNode")].cloneNode(!0)),this._canvasElement=e.querySelector("canvas"),this._contentElement=e.querySelector(".content"),this._innerElement=e.querySelector("#inner"),this._titleElement=e.querySelector("#title"),this._fpsElement=e.querySelector("#fps"),this._dimensionElement=e.querySelector("#dimension"),this._debug=!1,this._disabled=!1,this._width=300,this._height=150,this._onframe=void 0,this._animationRequestHandle=0,this._prevAnimationFrameTime=0,this._resizeTimeoutHandle=0,this._resizeCanvasWidth=0,this._resizeCanvasHeight=0,this._frameEvent=new CustomEvent("frame",{composed:!0,bubbles:!1,detail:{now:0,prevTime:0,deltaTime:0,canvas:this._canvasElement}}),this._resizeEvent=new CustomEvent("resize",{composed:!0,bubbles:!1,detail:{width:0,height:0}}),this.update=this.update.bind(this),this.onDelayCanvasResize=this.onDelayCanvasResize.bind(this)}get canvas(){return this._canvasElement}connectedCallback(){o(this,"mode"),o(this,"debug"),o(this,"disabled"),o(this,"width"),o(this,"height"),o(this,"onframe"),this.hasAttribute("mode")||this.setAttribute("mode","fit"),this.hasAttribute("tabindex")||this.setAttribute("tabindex","0"),this.updateCanvasSize(!0),this.resume()}disconnectedCallback(){this.pause()}attributeChangedCallback(e,t,i){switch(e){case"debug":this._debug=null!==i;break;case"disabled":this._disabled=null!==i;break;case"width":this._width=Number(i);break;case"height":this._height=Number(i);break;case"onframe":this.onframe=new Function("event","with(document){with(this){"+i+"}}").bind(this)}switch(e){case"disabled":i?(this.update(0),this.pause()):this.resume();break;case"id":case"class":this._titleElement.innerHTML=`display-port${this.className?"."+this.className:""}${this.hasAttribute("id")?"#"+this.getAttribute("id"):""}`;break;case"debug":this._titleElement.classList.toggle("hidden",i),this._fpsElement.classList.toggle("hidden",i),this._dimensionElement.classList.toggle("hidden",i)}}getContext(e="2d",t){return this._canvasElement.getContext(e,t)}pause(){cancelAnimationFrame(this._animationRequestHandle)}resume(){this._animationRequestHandle=requestAnimationFrame(this.update)}update(e){this._animationRequestHandle=requestAnimationFrame(this.update),this.updateCanvasSize(!1);const i=e-this._prevAnimationFrameTime;if(this._prevAnimationFrameTime=e,this._debug){const e=i<=0?"--":String(Math.round(1e3/i)).padStart(2,"0");this._fpsElement.textContent!==e&&(this._fpsElement.textContent=e);if(this.mode===t){let e=`${this._width}x${this._height}`;this._dimensionElement.textContent!==e&&(this._dimensionElement.textContent=e)}else{let e=`${this._width}x${this._height}|${this.shadowRoot.host.clientWidth}x${this.shadowRoot.host.clientHeight}`;this._dimensionElement.textContent!==e&&(this._dimensionElement.textContent=e)}}let n=this._frameEvent.detail;n.now=e,n.prevTime=this._prevAnimationFrameTime,n.deltaTime=i,this.dispatchEvent(this._frameEvent)}onDelayCanvasResize(){this._resizeTimeoutHandle=0,this.updateCanvasSize(!0)}delayCanvasResize(e,t){e===this._resizeCanvasWidth&&t===this._resizeCanvasHeight||(this._resizeCanvasWidth=e,this._resizeCanvasHeight=t,this._resizeTimeoutHandle&&clearTimeout(this._resizeTimeoutHandle),this._resizeTimeoutHandle=setTimeout(this.onDelayCanvasResize,200))}updateCanvasSize(e=!0){const h=this.shadowRoot.host.getBoundingClientRect(),o=h.width,l=h.height;let d=this._canvasElement,r=this._width,m=this._height;const c=this.mode;if(c===a||c===s)r=o,m=l;else if(c!==t&&(o<r||l<m||c===i||c==n)){let e=o/r,t=l/m;e<t?(r=o,m*=e):(r*=t,m=l)}if(r=Math.floor(r),m=Math.floor(m),void 0===e&&(e=d.clientWidth!==r||d.clientHeight!==m),!e)return void this.delayCanvasResize(r,m);let u=.5*Math.min(r/this._width,m/this._height);if(this._innerElement.style.fontSize=`font-size: ${u}em`,e){c===n?(d.width=this._width,d.height=this._height):c!==a&&(d.width=r,d.height=m);let e=this._contentElement.style;e.width=`${r}px`,e.height=`${m}px`,c!==i&&c!==s||(this._width=r,this._height=m);let t=this._resizeEvent.detail;t.width=r,t.height=m,this.dispatchEvent(this._resizeEvent)}}}function o(e,t){if(Object.prototype.hasOwnProperty.call(e,t)){let i=e[t];delete e[t],e[t]=i}}h.define(),e.DisplayPort=h,Object.defineProperty(e,"__esModule",{value:!0})}));
