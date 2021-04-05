!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e((t="undefined"!=typeof globalThis?globalThis:t||self).Display={})}(this,(function(t){"use strict";const e="noscale",i="pixelfit";class s extends HTMLElement{static get[Symbol.for("cuttleTemplate")](){let t=document.createElement("template");return t.innerHTML='<div class="container">\r\n    <label class="hidden" id="title">display-port</label>\r\n    <label class="hidden" id="fps">00</label>\r\n    <label class="hidden" id="dimension">0x0</label>\r\n    <div class="content">\r\n        <canvas>\r\n            Oh no! Your browser does not support canvas.\r\n        </canvas>\r\n        <slot id="inner"></slot>\r\n    </div>\r\n    <slot name="frame"></slot>\r\n</div>',Object.defineProperty(this,Symbol.for("cuttleTemplate"),{value:t}),t}static get[Symbol.for("cuttleStyle")](){let t=document.createElement("style");return t.innerHTML=":host{display:inline-block;color:#555}.container{display:flex;position:relative;width:100%;height:100%}.content{position:relative;margin:auto}.content>*{width:100%;height:100%}canvas{background:#000;-ms-interpolation-mode:nearest-neighbor;image-rendering:-moz-crisp-edges;image-rendering:pixelated}label{font-family:monospace;color:currentColor}#inner,label{position:absolute}#inner{display:flex;flex-direction:column;align-items:center;justify-content:center;top:0;left:0;pointer-events:none}#title{left:.5rem;top:.5rem}#fps{right:.5rem;top:.5rem}#dimension{left:.5rem;bottom:.5rem}.hidden{display:none}:host([debug]) .container{outline:6px dashed rgba(0,0,0,.1);outline-offset:-4px;background-color:rgba(0,0,0,.1)}:host([mode=noscale]) canvas{margin:0;top:0;left:0}:host([mode=center]),:host([mode=fit]),:host([mode=pixelfit]),:host([mode=stretch]){width:100%;height:100%}:host([full]){width:100vw!important;height:100vh!important}:host([disabled]){display:none}slot{display:flex;flex-direction:column;align-items:center;justify-content:center;position:absolute;width:100%;height:100%;top:0;left:0;pointer-events:none}::slotted(*){pointer-events:auto}",Object.defineProperty(this,Symbol.for("cuttleStyle"),{value:t}),t}static get observedAttributes(){return["onframe","width","height","disabled","debug","id","class"]}static get properties(){return{width:Number,height:Number,disabled:Boolean,debug:Boolean,mode:{type:String,value:"fit",observed:!1}}}get mode(){return this.getAttribute("mode")}set mode(t){this.setAttribute("mode",t)}get debug(){return this._debug}set debug(t){this.toggleAttribute("debug",t)}get disabled(){return this._disabled}set disabled(t){this.toggleAttribute("disabled",t)}get height(){return this._height}set height(t){this.setAttribute("height",String(t))}get width(){return this._width}set width(t){this.setAttribute("width",String(t))}static get customEvents(){return["frame"]}get onframe(){return this._onframe}set onframe(t){this._onframe&&this.removeEventListener("frame",this._onframe),this._onframe=t,this._onframe&&this.addEventListener("frame",t)}constructor(){super(),this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(this.constructor[Symbol.for("cuttleTemplate")].content.cloneNode(!0)),this.shadowRoot.appendChild(this.constructor[Symbol.for("cuttleStyle")].cloneNode(!0)),this._canvasElement=this.shadowRoot.querySelector("canvas"),this._contentElement=this.shadowRoot.querySelector(".content"),this._innerElement=this.shadowRoot.querySelector("#inner"),this._titleElement=this.shadowRoot.querySelector("#title"),this._fpsElement=this.shadowRoot.querySelector("#fps"),this._dimensionElement=this.shadowRoot.querySelector("#dimension"),this._animationRequestHandle=0,this._prevAnimationFrameTime=0,this._width=300,this._height=150,this.update=this.update.bind(this)}get canvas(){return this._canvasElement}connectedCallback(){if(Object.prototype.hasOwnProperty.call(this,"onframe")){let t=this.onframe;delete this.onframe,this.onframe=t}if(Object.prototype.hasOwnProperty.call(this,"width")){let t=this.width;delete this.width,this.width=t}if(Object.prototype.hasOwnProperty.call(this,"height")){let t=this.height;delete this.height,this.height=t}if(Object.prototype.hasOwnProperty.call(this,"disabled")){let t=this.disabled;delete this.disabled,this.disabled=t}if(Object.prototype.hasOwnProperty.call(this,"debug")){let t=this.debug;delete this.debug,this.debug=t}if(Object.prototype.hasOwnProperty.call(this,"mode")){let t=this.mode;delete this.mode,this.mode=t}this.hasAttribute("mode")||this.setAttribute("mode","fit"),this.hasAttribute("tabindex")||this.setAttribute("tabindex","0"),this.updateCanvasSize(),this.resume()}disconnectedCallback(){this.pause()}attributeChangedCallback(t,e,i){switch(t){case"width":this._width=Number(i);break;case"height":this._height=Number(i);break;case"disabled":this._disabled=null!==i;break;case"debug":this._debug=null!==i;break;case"onframe":this.onframe=new Function("event","with(document){with(this){"+i+"}}").bind(this)}((t,e,i)=>{switch(t){case"disabled":i?(this.update(0),this.pause()):this.resume();break;case"id":case"class":this._titleElement.innerHTML=`display-port${this.className?"."+this.className:""}${this.hasAttribute("id")?"#"+this.getAttribute("id"):""}`;break;case"debug":this._titleElement.classList.toggle("hidden",i),this._fpsElement.classList.toggle("hidden",i),this._dimensionElement.classList.toggle("hidden",i)}})(t,0,i)}pause(){cancelAnimationFrame(this._animationRequestHandle)}resume(){this._animationRequestHandle=requestAnimationFrame(this.update)}update(t){this._animationRequestHandle=requestAnimationFrame(this.update),this.updateCanvasSize();const i=t-this._prevAnimationFrameTime;if(this._prevAnimationFrameTime=t,this.debug){const t=i<=0?"--":String(Math.round(1e3/i)).padStart(2,"0");if(this._fpsElement.textContent!==t&&(this._fpsElement.textContent=t),this.mode===e){let t=`${this._width}x${this._height}`;this._dimensionElement.textContent!==t&&(this._dimensionElement.textContent=t)}else{let t=`${this._width}x${this._height}|${this.shadowRoot.host.clientWidth}x${this.shadowRoot.host.clientHeight}`;this._dimensionElement.textContent!==t&&(this._dimensionElement.textContent=t)}}this.dispatchEvent(new CustomEvent("frame",{detail:{now:t,prevTime:this._prevAnimationFrameTime,deltaTime:i,canvas:this._canvasElement},bubbles:!1,composed:!0}))}updateCanvasSize(){let t=this.shadowRoot.host.getBoundingClientRect();const s=t.width,n=t.height;let o=this._canvasElement,h=this._width,a=this._height;const l=this.mode;if("stretch"===l)h=s,a=n;else if(l!==e){if(s<h||n<a||"fit"===l||l==i){let t=s/h,e=n/a;t<e?(h=s,a*=t):(h*=e,a=n)}}h=Math.floor(h),a=Math.floor(a);let r=.5*Math.min(h/this._width,a/this._height);this._innerElement.style=`font-size: ${r}em`,o.clientWidth===h&&o.clientHeight===a||(l===i?(o.width=this._width,o.height=this._height):(o.width=h,o.height=a),this._contentElement.style=`width: ${h}px; height: ${a}px`,this.dispatchEvent(new CustomEvent("resize",{detail:{width:h,height:a},bubbles:!1,composed:!0})))}}window.customElements.define("display-port",s),t.DisplayPort=s,Object.defineProperty(t,"__esModule",{value:!0})}));
