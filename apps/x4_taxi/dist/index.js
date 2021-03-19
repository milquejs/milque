!function(){"use strict";const e="noscale";class t extends HTMLElement{static get[Symbol.for("cuttleTemplate")](){let e=document.createElement("template");return e.innerHTML='<div class="container">\n    <label class="hidden" id="title">display-port</label>\n    <label class="hidden" id="fps">00</label>\n    <label class="hidden" id="dimension">0x0</label>\n    <div class="content">\n        <canvas></canvas>\n        <slot id="inner"></slot>\n    </div>\n    <slot name="frame"></slot>\n</div>',Object.defineProperty(this,Symbol.for("cuttleTemplate"),{value:e}),e}static get[Symbol.for("cuttleStyle")](){let e=document.createElement("style");return e.innerHTML=":host{display:inline-block;color:#555}.container{display:flex;position:relative;width:100%;height:100%}.content{position:relative;margin:auto}.content>*{width:100%;height:100%}canvas{background:#000;-ms-interpolation-mode:nearest-neighbor;image-rendering:-moz-crisp-edges;image-rendering:pixelated}label{font-family:monospace;color:currentColor}#inner,label{position:absolute}#inner{display:flex;flex-direction:column;align-items:center;justify-content:center;top:0;left:0;pointer-events:none}#title{left:.5rem;top:.5rem}#fps{right:.5rem;top:.5rem}#dimension{left:.5rem;bottom:.5rem}.hidden{display:none}:host([debug]) .container{outline:6px dashed rgba(0,0,0,.1);outline-offset:-4px;background-color:rgba(0,0,0,.1)}:host([mode=noscale]) canvas{margin:0;top:0;left:0}:host([mode=center]),:host([mode=fit]),:host([mode=stretch]){width:100%;height:100%}:host([full]){width:100vw!important;height:100vh!important}:host([disabled]){display:none}slot{display:flex;flex-direction:column;align-items:center;justify-content:center;position:absolute;width:100%;height:100%;top:0;left:0;pointer-events:none}::slotted(*){pointer-events:auto}",Object.defineProperty(this,Symbol.for("cuttleStyle"),{value:e}),e}static get observedAttributes(){return["onframe","width","height","disabled","debug","id","class"]}static get properties(){return{width:Number,height:Number,disabled:Boolean,debug:Boolean,mode:{type:String,value:"fit",observed:!1}}}get mode(){return this.getAttribute("mode")}set mode(e){this.setAttribute("mode",e)}get debug(){return this._debug}set debug(e){this.toggleAttribute("debug",e)}get disabled(){return this._disabled}set disabled(e){this.toggleAttribute("disabled",e)}get height(){return this._height}set height(e){this.setAttribute("height",String(e))}get width(){return this._width}set width(e){this.setAttribute("width",String(e))}static get customEvents(){return["frame"]}get onframe(){return this._onframe}set onframe(e){this._onframe&&this.removeEventListener("frame",this._onframe),this._onframe=e,this._onframe&&this.addEventListener("frame",e)}constructor(){super(),this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(this.constructor[Symbol.for("cuttleTemplate")].content.cloneNode(!0)),this.shadowRoot.appendChild(this.constructor[Symbol.for("cuttleStyle")].cloneNode(!0)),this._canvasElement=this.shadowRoot.querySelector("canvas"),this._contentElement=this.shadowRoot.querySelector(".content"),this._innerElement=this.shadowRoot.querySelector("#inner"),this._titleElement=this.shadowRoot.querySelector("#title"),this._fpsElement=this.shadowRoot.querySelector("#fps"),this._dimensionElement=this.shadowRoot.querySelector("#dimension"),this._animationRequestHandle=0,this._prevAnimationFrameTime=0,this._width=300,this._height=150,this.update=this.update.bind(this)}get canvas(){return this._canvasElement}connectedCallback(){if(Object.prototype.hasOwnProperty.call(this,"onframe")){let e=this.onframe;delete this.onframe,this.onframe=e}if(Object.prototype.hasOwnProperty.call(this,"width")){let e=this.width;delete this.width,this.width=e}if(Object.prototype.hasOwnProperty.call(this,"height")){let e=this.height;delete this.height,this.height=e}if(Object.prototype.hasOwnProperty.call(this,"disabled")){let e=this.disabled;delete this.disabled,this.disabled=e}if(Object.prototype.hasOwnProperty.call(this,"debug")){let e=this.debug;delete this.debug,this.debug=e}if(Object.prototype.hasOwnProperty.call(this,"mode")){let e=this.mode;delete this.mode,this.mode=e}this.hasAttribute("mode")||this.setAttribute("mode","fit"),this.hasAttribute("tabindex")||this.setAttribute("tabindex",0),this.updateCanvasSize(),this.resume()}disconnectedCallback(){this.pause()}attributeChangedCallback(e,t,i){switch(e){case"width":this._width=Number(i);break;case"height":this._height=Number(i);break;case"disabled":this._disabled=null!==i;break;case"debug":this._debug=null!==i;break;case"onframe":this.onframe=new Function("event","with(document){with(this){"+i+"}}").bind(this)}((e,t,i)=>{switch(e){case"disabled":i?(this.update(0),this.pause()):this.resume();break;case"id":case"class":this._titleElement.innerHTML=`display-port${this.className?"."+this.className:""}${this.hasAttribute("id")?"#"+this.getAttribute("id"):""}`;break;case"debug":this._titleElement.classList.toggle("hidden",i),this._fpsElement.classList.toggle("hidden",i),this._dimensionElement.classList.toggle("hidden",i)}})(e,0,i)}pause(){cancelAnimationFrame(this._animationRequestHandle)}resume(){this._animationRequestHandle=requestAnimationFrame(this.update)}update(t){this._animationRequestHandle=requestAnimationFrame(this.update),this.updateCanvasSize();const i=t-this._prevAnimationFrameTime;if(this._prevAnimationFrameTime=t,this.debug){const t=i<=0?"--":String(Math.round(1e3/i)).padStart(2,"0");if(this._fpsElement.innerText!==t&&(this._fpsElement.innerText=t),this.mode===e){let e=`${this._width}x${this._height}`;this._dimensionElement.innerText!==e&&(this._dimensionElement.innerText=e)}else{let e=`${this._width}x${this._height}|${this.shadowRoot.host.clientWidth}x${this.shadowRoot.host.clientHeight}`;this._dimensionElement.innerText!==e&&(this._dimensionElement.innerText=e)}}this.dispatchEvent(new CustomEvent("frame",{detail:{now:t,prevTime:this._prevAnimationFrameTime,deltaTime:i,canvas:this._canvasElement},bubbles:!1,composed:!0}))}updateCanvasSize(){let t=this.shadowRoot.host.getBoundingClientRect();const i=t.width,n=t.height;let s=this._canvasElement,a=this._width,o=this._height;const l=this.mode;if("stretch"===l)a=i,o=n;else if(l!==e){if(i<a||n<o||"fit"===l){let e=i/a,t=n/o;e<t?(a=i,o*=e):(a*=t,o=n)}}a=Math.floor(a),o=Math.floor(o);let r=.5*Math.min(a/this._width,o/this._height);this._innerElement.style=`font-size: ${r}em`,s.clientWidth===a&&s.clientHeight===o||(s.width=this._width,s.height=this._height,this._contentElement.style=`width: ${a}px; height: ${o}px`,this.dispatchEvent(new CustomEvent("resize",{detail:{width:a,height:o},bubbles:!1,composed:!0})))}}window.customElements.define("display-port",t);class i{next(){return Math.random()}}let n;class s{constructor(e=new i){this.generator=e}static next(){return n.next()}next(){return this.generator.next()}static choose(e){return n.choose(e)}choose(e){return e[Math.floor(this.generator.next()*e.length)]}static range(e,t){return n.range(e,t)}range(e,t){return(t-e)*this.generator.next()+e}static sign(){return n.sign()}sign(){return this.generator.next()<.5?-1:1}}n=new s;const a=["back","main","fore"],o={back:"#000000",main:"#333333",fore:"#888888"},l={back:.3,main:.5,fore:1},r={back:0,main:-8,fore:-16},h=["back","back","back","back","main","main","fore"],d=new s;function c(e){const t="main",i={x:0,width:36,height:16,layer:t};return e.background.buildings.push(i),e.background.buildingLayers.main.push(i),i}function m(e,t){var i;t.x=(i=e.display.width,Math.trunc(d.range(0,i))),t.width=Math.trunc(d.range(16,32)),t.height=Math.trunc(d.range(36,80));let n=t.layer,s=d.choose(h),a=e.background.buildingLayers;a[n].splice(a[n].indexOf(t),1),a[s].push(t),t.layer=s}function u(e,t){for(let t=0;t<5;++t){let i=16*t,n=i%3;e.translate(i,0),e.fillRect(0,2*-n,3,8+2*n),e.fillRect(8,0,3,8),e.fillRect(0,2+n,16,3),e.translate(-i,0)}}function g(e,t,i){let n=r[i.layer],s=Math.trunc(i.x),a=Math.trunc(t.display.height-64-i.height-n);e.translate(s,a),e.fillRect(0,0,i.width,i.height+n),e.translate(-s,-a)}const f=Symbol("animatedText"),p=/\s/,b=/[.!?]/,y=/[-,:;]/,w=/[.-]/;function v(e,t){if(p.test(t)||w.test(e)){if(b.test(e))return 800;if(y.test(e))return 250}else{if(b.test(e))return 200;if(y.test(e))return 100}return 30}class x{constructor(e,t=1){this.rootElement=e,this.targetNode=null,this.animatedNodes=new Set,this.nodeContents=new Map,this.deltaTime=0,this.prevTime=0,this.waitTime=300,this.targetText="",this.index=-1,this.disabled=!0,this.complete=!1,this.speed=t,this.callback=null,this.error=null,this.animationFrameHandle=null,this.onAnimationFrame=this.onAnimationFrame.bind(this)}toggle(e=!this.disabled){e?this.pause():this.resume()}pause(){this.disabled=!0,cancelAnimationFrame(this.animationFrameHandle),this.animationFrameHandle=null,this.deltaTime=this.waitTime}resume(){this.disabled=!1,this.canSafelyResumeWithTarget(this.targetNode)||(this.targetNode=null),this.prevTime=performance.now(),this.animationFrameHandle=requestAnimationFrame(this.onAnimationFrame)}reset(){this.targetNode=null,this.animatedNodes.clear()}skipAll(){this.targetNode&&(this.targetNode.nodeValue=this.targetText,this.targetNode=null),this.completeRemainingChildText()}onAnimationFrame(e){if(this.animationFrameHandle=requestAnimationFrame(this.onAnimationFrame),null==this.targetNode){let e=this.findNextChildText();if(!e)return this.complete=!0,void this.callback.call(void 0);{let t=e.previousSibling||"inline"===window.getComputedStyle(e.parentElement).display;this.targetNode=e,this.targetText=this.nodeContents.get(e),this.animatedNodes.add(e),this.index=-1,this.waitTime=t?30:300,this.deltaTime=0,this.complete=!1}}let t=e-this.prevTime;if(this.deltaTime+=t*this.speed,this.prevTime=e,t>1e6)return this.skipAll(),void this.error(new Error("Frame took too long; skipping animation."));const i=this.targetText;let n=!1;for(;!n&&this.deltaTime>=this.waitTime;){this.deltaTime-=this.waitTime;let e=++this.index;if(e<i.length){let t=i.charAt(e),n=i.charAt(e+1);this.waitTime=v(t,n)}else this.index=i.length,n=!0}if(n)this.targetNode.nodeValue=i,this.targetNode=null;else{let e=i.substring(0,this.index+1);this.targetNode.nodeValue=e}}canSafelyResumeWithTarget(e){if(!e)return!1;if(!e.isConnected)return!1;return e.nodeValue===this.targetText.substring(0,this.index+1)}completeRemainingChildText(e=this.rootElement){for(let t of e.childNodes)t instanceof Text?this.nodeContents.has(t)&&(this.animatedNodes.has(t)||(t.nodeValue=this.nodeContents.get(t),this.animatedNodes.add(t))):this.completeRemainingChildText(t)}findNextChildText(e=this.rootElement,t=null){for(let i of e.childNodes)if(i instanceof Text){let e=this.animatedNodes.has(i),n=i.nodeValue;n&&n.trim().length>0&&this.nodeContents.get(i)!==n&&(this.nodeContents.set(i,n),i.nodeValue="",e&&this.animatedNodes.delete(i)),t||e||!this.nodeContents.has(i)||(t=i)}else t=this.findNextChildText(i,t);return t}}const T={async play(e,t=1){if(!(e instanceof Element))throw new Error("Cannot animate text for non-element.");if(t<=0)throw new Error("Cannot animate text at non-positive speed.");let i=new x(e,t);return e[f]=i,new Promise(((t,n)=>{i.error=e=>{n(e)},i.callback=()=>{i.pause(),delete e[f],t()},i.resume()}))},pause(e){if(e&&f in e){e[f].pause()}},resume(e){if(e&&f in e){e[f].resume()}},skip(e){if(e&&f in e){e[f].skipAll()}},toggle(e,t){if(e&&f in e){e[f].toggle(t)}}};function _(e){e instanceof PromiseRejectionEvent?window.alert(e.reason.stack):e instanceof ErrorEvent?window.alert(e.error.stack):window.alert(JSON.stringify(e))}window.addEventListener("DOMContentLoaded",(async function(){const e=document.querySelector("#display"),t=e.canvas.getContext("2d"),i={display:e,ctx:t,frames:0};(function(e){e.background={buildingLayers:{fore:[],back:[],main:[]},buildings:[],progress:0};for(let t=0;t<80;++t)m(e,c(e))})(i),function(e){let t=document.createElement("div");t.style.position="absolute",t.style.bottom="0.8em",t.style.right="0.8em",t.innerHTML='\n        <style>\n            .container {\n                position: relative;\n                background-color: #091b3d;\n                color: #eeeeee;\n                padding: 0.5em;\n                width: 20em;\n                height: 5em;\n                overflow: auto;\n                font-family: monospace;\n            }\n        </style>\n        <div class="container">\n            <article>\n                There is something amiss in Marde. The stench of unrest is baked into every nook and alley and not a corner is left\n                untainted\n                by the foulness of its mindless residents. No windows unshattered. No doors unlocked.\n            </article>\n        </div>',e.display.appendChild(t);let i=t.querySelector("article");i.addEventListener("click",(()=>{T.skip(i)})),T.play(i),e.dialogue={text:"",element:t}}(i),function(e){let t=document.createElement("div"),i=document.createElement("button");i.textContent="VACANT",i.style.backgroundColor="#aa3333",i.style.color="#eeeeee",i.style.border="0.3em ridge #660000",i.style.fontSize="1.5em",i.style.padding="0.1em 0.5em",i.style.position="absolute",i.style.left="0.2em",i.style.bottom="0.2em",t.appendChild(i);let n=document.createElement("label");n.textContent="0000 fare",n.style.color="#eeeeee",n.style.fontSize="1.5em",n.style.position="absolute",n.style.bottom="0.2em",n.style.left="7em",t.appendChild(n),e.display.appendChild(t)}(i),e.addEventListener("frame",(e=>{const{deltaTime:n}=e.detail;!function(e,t){!function(e,t){t.background.progress+=e;for(let e of a)for(let i of t.background.buildingLayers[e])i.x>t.display.width?(m(t,i),i.x-=t.display.width+i.width):i.x+=l[e]}(e,t)}(n/60,i),function(e,t){e.fillStyle="#000000",e.fillRect(0,0,t.display.width,t.display.height),function(e,t){const i=t.display.width,n=t.display.height;e.fillStyle="#561435",e.fillRect(0,0,i,n),e.fillStyle="#8e3e13",e.fillRect(0,0,i,n/3),e.fillStyle="#a09340",e.fillRect(0,0,i,n/10),e.fillStyle="#e8d978",e.fillRect(0,0,i,n/30);for(let i of a){e.fillStyle=o[i];for(let n of t.background.buildingLayers[i])g(e,t,n)}const s=n-64;e.fillStyle="#000000";let l=s-8,r=t.background.progress%80*6;e.translate(r,l);for(let t=-480;t<i;t+=80)e.translate(t,0),u(e),e.translate(-t,0);e.translate(-r,-l),e.fillStyle="#000000",e.fillRect(0,s,i,64)}(e,t)}(t,i),i.frames+=1}))})),window.addEventListener("error",_,!0),window.addEventListener("unhandledrejection",_,!0)}();
