!function(t){"use strict";const e="noscale",o=Symbol("template"),n=Symbol("style");class i extends HTMLElement{static get[o](){let t=document.createElement("template");return t.innerHTML='<div class="container">\r\n    <label class="hidden" id="title">display-port</label>\r\n    <label class="hidden" id="fps">00</label>\r\n    <label class="hidden" id="dimension">0x0</label>\r\n    <canvas></canvas>\r\n    <slot></slot>\r\n</div>',Object.defineProperty(this,o,{value:t}),t}static get[n](){let t=document.createElement("style");return t.innerHTML=":host{display:inline-block;color:#555}.container{display:flex;position:relative;width:100%;height:100%}canvas{background:#000;margin:auto;-ms-interpolation-mode:nearest-neighbor;image-rendering:-moz-crisp-edges;image-rendering:pixelated}label{font-family:monospace;color:currentColor;position:absolute}#title{left:.5rem;top:.5rem}#fps{right:.5rem;top:.5rem}#dimension{left:.5rem;bottom:.5rem}.hidden{display:none}:host([debug]) .container{outline:6px dashed rgba(0,0,0,.1);outline-offset:-4px;background-color:rgba(0,0,0,.1)}:host([mode=noscale]) canvas{margin:0;top:0;left:0}:host([mode=center]),:host([mode=fit]),:host([mode=stretch]){width:100%;height:100%}:host([full]){width:100vw!important;height:100vh!important}:host([disabled]){display:none}slot{display:flex;flex-direction:column;align-items:center;justify-content:center;position:absolute;width:100%;height:100%;top:0;left:0;pointer-events:none}::slotted(*){pointer-events:auto}",Object.defineProperty(this,n,{value:t}),t}static get observedAttributes(){return["width","height","disabled","onframe","debug","id","class"]}constructor(){super(),this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(this.constructor[o].content.cloneNode(!0)),this.shadowRoot.appendChild(this.constructor[n].cloneNode(!0)),this._canvasElement=this.shadowRoot.querySelector("canvas"),this._titleElement=this.shadowRoot.querySelector("#title"),this._fpsElement=this.shadowRoot.querySelector("#fps"),this._dimensionElement=this.shadowRoot.querySelector("#dimension"),this._animationRequestHandle=0,this._prevAnimationFrameTime=0,this._width=300,this._height=150,this._onframe=null,this.update=this.update.bind(this)}get canvas(){return this._canvasElement}connectedCallback(){this.hasAttribute("mode")||(this.mode="noscale"),this.hasAttribute("tabindex")||this.setAttribute("tabindex",0),this.updateCanvasSize(),this.resume()}disconnectedCallback(){this.pause()}attributeChangedCallback(t,e,o){switch(t){case"width":this._width=o;break;case"height":this._height=o;break;case"disabled":o?(this.update(0),this.pause()):this.resume();break;case"onframe":this.onframe=new Function("event",`with(document){with(this){${o}}}`).bind(this);break;case"id":case"class":this._titleElement.innerHTML=`display-port${this.className?"."+this.className:""}${this.hasAttribute("id")?"#"+this.getAttribute("id"):""}`;break;case"debug":this._titleElement.classList.toggle("hidden",o),this._fpsElement.classList.toggle("hidden",o),this._dimensionElement.classList.toggle("hidden",o)}}update(t){this._animationRequestHandle=requestAnimationFrame(this.update),this.updateCanvasSize();const o=t-this._prevAnimationFrameTime;if(this._prevAnimationFrameTime=t,this.debug){const t=o<=0?"--":String(Math.round(1e3/o)).padStart(2,"0");if(this._fpsElement.innerText!==t&&(this._fpsElement.innerText=t),this.mode===e){let t=`${this._width}x${this._height}`;this._dimensionElement.innerText!==t&&(this._dimensionElement.innerText=t)}else{let t=`${this._width}x${this._height}|${this.shadowRoot.host.clientWidth}x${this.shadowRoot.host.clientHeight}`;this._dimensionElement.innerText!==t&&(this._dimensionElement.innerText=t)}}this.dispatchEvent(new CustomEvent("frame",{detail:{now:t,prevTime:this._prevAnimationFrameTime,deltaTime:o,canvas:this._canvasElement,get context(){let t=this.canvas.getContext("2d");return t.imageSmoothingEnabled=!1,t}},bubbles:!1,composed:!0}))}pause(){cancelAnimationFrame(this._animationRequestHandle)}resume(){this._animationRequestHandle=requestAnimationFrame(this.update)}updateCanvasSize(){let t=this.shadowRoot.host.getBoundingClientRect();const o=t.width,n=t.height;let i=this._canvasElement,s=this._width,r=this._height;const a=this.mode;if("stretch"===a)s=o,r=n;else if(a!==e){if(o<s||n<r||"fit"===a){let t=o/s,e=n/r;t<e?(s=o,r*=t):(s*=e,r=n)}}s=Math.floor(s),r=Math.floor(r),i.clientWidth===s&&i.clientHeight===r||(i.width=this._width,i.height=this._height,i.style=`width: ${s}px; height: ${r}px`,this.dispatchEvent(new CustomEvent("resize",{detail:{width:s,height:r},bubbles:!1,composed:!0})))}get onframe(){return this._onframe}set onframe(t){this._onframe&&this.removeEventListener("frame",this._onframe),this._onframe=t,this._onframe&&this.addEventListener("frame",t)}get width(){return this._width}set width(t){this.setAttribute("width",t)}get height(){return this._height}set height(t){this.setAttribute("height",t)}get mode(){return this.getAttribute("mode")}set mode(t){this.setAttribute("mode",t)}get disabled(){return this.hasAttribute("disabled")}set disabled(t){t?this.setAttribute("disabled",""):this.removeAttribute("disabled")}get debug(){return this.hasAttribute("debug")}set debug(t){t?this.setAttribute("debug",""):this.removeAttribute("debug")}}window.customElements.define("display-port",i);class s{next(){return Math.random()}}let r;class a{constructor(t=new s){this.generator=t}static next(){return r.next()}next(){return this.generator.next()}static choose(t){return r.choose(t)}choose(t){return t[Math.floor(this.generator.next()*t.length)]}static range(t,e){return r.range(t,e)}range(t,e){return(e-t)*this.generator.next()+t}static sign(){return r.sign()}sign(){return this.generator.next()<.5?-1:1}}r=new a;function c(t,e){const o=document.createElement("a"),n=e.indexOf(";");e=e.substring(0,n+1)+"headers=Content-Disposition%3A%20attachment%3B%20filename="+t+";"+e.substring(n+1),o.setAttribute("href",e),o.setAttribute("download",t),o.style.display="none",document.body.appendChild(o),o.click(),document.body.removeChild(o)}const h=["svg","g"];function l(t,e=t.cloneNode(!0)){let o=t.childNodes,n=e.childNodes;for(var i=0;i<n.length;i++){let t=n[i],e=t.tagName;if(-1!=h.indexOf(e))l(o[i],t);else if(o[i]instanceof Element){const e=window.getComputedStyle(o[i]);let n=[];for(let t of Object.keys(e))n.push(`${t}:${e.getPropertyValue(t)};`);t.setAttribute("style",n.join(""))}}return e}var d=Object.freeze({__proto__:null,FILE_TYPE_PNG:"png",FILE_TYPE_SVG:"svg",downloadText:function(t,e){c(t,"data:text/plain; charset=utf-8,"+encodeURIComponent(e))},downloadImageFromSVG:function(t,e,o,n,i){const s=function(t){const e=l(t),o=(new XMLSerializer).serializeToString(e);return new Blob([o],{type:"image/svg+xml"})}(o);switch(e){case"png":{const o=URL.createObjectURL(s),r=document.createElement("canvas"),a=r.getContext("2d"),h=window.devicePixelRatio||1;r.width=n*h,r.height=i*h,r.style.width=n+"px",r.style.height=i+"px",a.setTransform(h,0,0,h,0,0);const l=new Image;l.onload=()=>{a.drawImage(l,0,0),URL.revokeObjectURL(o);const n=r.toDataURL("image/"+e).replace("image/"+e,"image/octet-stream");c(t,n)},l.src=o}break;case"svg":{const e=new FileReader;e.onload=()=>{c(t,e.result)},e.readAsDataURL(s)}break;default:throw new Error("Unknown file type '"+e+"'")}},downloadURL:c});var u=Object.freeze({__proto__:null,uploadFile:async function(t=[],e=!1){return new Promise(((o,n)=>{const i=document.createElement("input");i.addEventListener("change",(t=>{o(e?t.target.files:t.target.files[0])})),i.type="file",i.accept=t.join(","),i.style.display="none",i.toggleAttribute("multiple",e),document.body.appendChild(i),i.click(),document.body.removeChild(i)}))}});const m={on(t,e,o=e){let n;if(this.__events.has(t)?n=this.__events.get(t):(n=new Map,this.__events.set(t,n)),n.has(o))throw new Error(`Found callback for event '${t}' with the same handle '${o}'.`);return n.set(o,e),this},off(t,e){if(!this.__events.has(t))throw new Error(`Unable to find event '${t}'.`);{const o=this.__events.get(t);if(!o.has(e))throw new Error(`Unable to find callback for event '${t}' with handle '${e}'.`);o.delete(e)}return this},once(t,e,o=e){return this.on(t,((...n)=>{this.off(t,o),e.apply(this.__context||this,n)}),o)},emit(t,...e){if(this.__events.has(t)){let o=[];const n=Array.from(this.__events.get(t).values());for(const t of n){let n=t.apply(this.__context||this,e);n&&o.push(n)}return o}return this.__events.set(t,new Map),[]}};function g(t){const e=Object.create(m);return e.__events=new Map,e.__context=t,e}function f(t,e){const o=Object.assign(t,m);return o.__events=new Map,o.__context=e,o}function p(t,e){const o=t.prototype;return Object.assign(o,m),o.__events=new Map,o.__context=e,o}var k={create:g,assign:f,mixin:p},b=Object.freeze({__proto__:null,create:g,assign:f,mixin:p,default:k});function w(t,e,o){return t+(e-t)*o}const _=new AudioContext;!async function(t){document.addEventListener("click",(()=>{"suspended"===t.state&&t.resume()}))}(_);const C={gain:0,pitch:0,pan:0,loop:!1};class y{constructor(t,e,o=!1){this.context=t,this.buffer=e,this._source=null,this.playing=!1,this.loop=o,this.onAudioSourceEnded=this.onAudioSourceEnded.bind(this)}onAudioSourceEnded(){this._playing=!1}play(t=C){if(!this.buffer)return;this._source&&this.destroy();const e=this.context;let o=e.createBufferSource();o.addEventListener("ended",this.onAudioSourceEnded),o.buffer=this.buffer,o.loop=t.loop;let n=o;if(t.pitch&&(o.detune.value=100*t.pitch),t.gain){const o=e.createGain();o.gain.value=t.gain,n=n.connect(o)}if(t.pan){const o=e.createStereoPanner();o.pan.value=t.pan,n=n.connect(o)}n.connect(e.destination),o.start(),this._source=o,this._playing=!0}pause(){this._source.stop(),this._playing=!1}destroy(){this._source&&this._source.disconnect(),this._source=null}}var v=Object.freeze({__proto__:null,AUDIO_CONTEXT:_,AUDIO_ASSET_TAG:"audio",loadAudio:async function(t,e={}){const o=_;let n=await fetch(t),i=await n.arrayBuffer(),s=await o.decodeAudioData(i);return new y(o,s,Boolean(e.loop))}});t.vec3.fromValues(0,0,0),t.vec3.fromValues(1,0,0),t.vec3.fromValues(0,1,0),t.vec3.fromValues(0,0,1);class x{constructor(){this.prevTransformMatrix=null,this.domProjectionMatrix=new DOMMatrix,this.domViewMatrix=new DOMMatrix,this.ctx=null}begin(t,e,o){if(this.ctx)throw new Error("View already begun - maybe missing end() call?");e&&B(this.domViewMatrix,e),o&&B(this.domProjectionMatrix,o),this.prevTransformMatrix=t.getTransform(),t.setTransform(this.domProjectionMatrix);const{a:n,b:i,c:s,d:r,e:a,f:c}=this.domViewMatrix;t.transform(n,i,s,r,a,c),this.ctx=t}end(t){t.setTransform(this.prevTransformMatrix),this.ctx=null}}function B(t,e){return t.a=e[0],t.b=e[1],t.c=e[4],t.d=e[5],t.e=e[12],t.f=e[13],t}class M{static screenToWorld(e,o,n,i){let s=t.mat4.multiply(t.mat4.create(),i,n);t.mat4.invert(s,s);let r=t.vec3.fromValues(e,o,0);return t.vec3.transformMat4(r,r,s),r}constructor(e=-1,o=1,n=-1,i=1,s=0,r=1){this.position=t.vec3.create(),this.rotation=t.quat.create(),this.scale=t.vec3.fromValues(1,1,1),this.clippingPlane={left:e,right:o,top:n,bottom:i,near:s,far:r},this._viewMatrix=t.mat4.create(),this._projectionMatrix=t.mat4.create()}get x(){return this.position[0]}set x(t){this.position[0]=t}get y(){return this.position[1]}set y(t){this.position[1]=t}get z(){return this.position[2]}set z(t){this.position[2]=t}moveTo(e,o,n=0,i=1){let s=t.vec3.fromValues(e,o,n);t.vec3.lerp(this.position,this.position,s,Math.min(1,i))}getViewMatrix(e=this._viewMatrix){let o=-Math.round(this.x),n=-Math.round(this.y),i=0===this.z?1:1/this.z,s=t.vec3.fromValues(o,n,0),r=t.vec3.fromValues(this.scale[0]*i,this.scale[1]*i,1);return t.mat4.fromRotationTranslationScale(e,this.rotation,s,r),e}getProjectionMatrix(e=this._projectionMatrix){let{left:o,right:n,top:i,bottom:s,near:r,far:a}=this.clippingPlane;return t.mat4.ortho(e,o,n,i,s,r,a),e}}function I(t,e){return t+","+e}function X(t){let e=t.indexOf(",");return[Number(t.substring(0,e)),Number(t.substring(e+1))]}class Y{constructor(t,e,o,n,i){this.chunkManager=t,this.chunkId=e,this.chunkCoordX=o,this.chunkCoordY=n,this._data=i}get data(){return this._data}}class E{constructor(t,e){const o=t*e;this.block=new Uint8Array(o).fill(0),this.meta=new Uint8Array(o).fill(0),this.neighbor=new Uint8Array(o).fill(15)}}class A{constructor(t,e){this._chunkWidth=t,this._chunkHeight=e,this._x=0,this._y=0,this._blockCoordX=0,this._blockCoordY=0,this._index=0,this._chunkCoordX=0,this._chunkCoordY=0,this._chunkId=null}get x(){return this._x}get y(){return this._y}get blockCoordX(){return this._blockCoordX}get blockCoordY(){return this._blockCoordY}get index(){return this._index}get chunkCoordX(){return this._chunkCoordX}get chunkCoordY(){return this._chunkCoordY}get chunkId(){return this._chunkId}clone(){return new A(this._chunkWidth,this._chunkHeight)}set(t,e){this._x=t,this._y=e;const o=this._chunkWidth,n=this._chunkHeight;return this._blockCoordX=t<0?Math.abs(o+Math.floor(t))%o:Math.floor(t)%o,this._blockCoordY=e<0?Math.abs(n+Math.floor(e))%n:Math.floor(e)%n,this._index=this._blockCoordX+this._blockCoordY*o,this._chunkCoordX=Math.floor(t/o),this._chunkCoordY=Math.floor(e/n),this._chunkId=I(this._chunkCoordX,this._chunkCoordY),this}copy(t=this.clone()){return t._x=this.x,t._y=this.y,t._blockCoordX=this.blockCoordX,t._blockCoordY=this.blockCoordY,t._index=this.index,t._chunkCoordX=this.chunkCoordX,t._chunkCoordY=this.chunkCoordY,t._chunkId=this.chunkId,t}offset(t=this,e=0,o=0){return t.set(this.x+e,this.y+o)}down(t=this,e=1){return t.set(this.x,this.y+e)}up(t=this,e=1){return t.set(this.x,this.y-e)}right(t=this,e=1){return t.set(this.x+e,this.y)}left(t=this,e=1){return t.set(this.x-e,this.y)}reset(t=null){return t?t.copy(this):this.set(0,0)}equals(t){return Math.abs(this.x-t.x)<Number.EPSILON&&Math.abs(this.y-t.y)<Number.EPSILON}toString(t=!1){return`BlockPos(${this.x},${this.y})`+(t?`:Chunk[${this.chunkId}]@{${this.blockCoordX},${this.blockCoordY}}[${this.index}],`:"")}}class S extends class{constructor(t,e){this.chunkWidth=t,this.chunkHeight=e,this.chunks={}}clear(){this.chunks={}}getChunkById(t){if(t in this.chunks)return this.chunks[t];{const[e,o]=X(t);let n=new E(this.chunkWidth,this.chunkHeight),i=new Y(this,t,e,o,n);return this.chunks[t]=i,i}}getChunkByCoord(t,e){const o=I(t,e);return this.getChunkById(o)}getChunksWithinBounds(t,e){let o=[];const n=t.chunkCoordX,i=t.chunkCoordY,s=e.chunkCoordX,r=e.chunkCoordY;for(let t=i;t<=r;++t)for(let e=n;e<=s;++e){const n=I(e,t);o.push(this.getChunkById(n))}return o}getLoadedChunks(){let t=[];for(let e of Object.keys(this.chunks)){let o=this.chunks[e];t.push(o)}return t}}{constructor(t=-1/0,e=-1/0,o=1/0,n=1/0,i=(Number.isFinite(o-t)?o-t:16),s=(Number.isFinite(n-e)?n-e:16)){super(i,s),this.bounds={left:t,right:o,top:e,bottom:n}}isWithinBounds(t){if(!t)return!1;const{x:e,y:o}=t;return e<=this.bounds.right&&e>=this.bounds.left&&o<=this.bounds.bottom&&o>=this.bounds.top}isWithinLoaded(t){return t.chunkId in this.chunks}getChunk(t){return this.getChunkById(t.chunkId)}getBlockId(t){return this.getChunkById(t.chunkId).data.block[t.index]}getBlockMeta(t){return this.getChunkById(t.chunkId).data.meta[t.index]}getBlockNeighbor(t){return this.getChunkById(t.chunkId).data.neighbor[t.index]}setBlockId(t,e){return this.getChunkById(t.chunkId).data.block[t.index]=e,this}setBlockMeta(t,e){return this.getChunkById(t.chunkId).data.meta[t.index]=e,this}setBlockNeighbor(t,e){return this.getChunkById(t.chunkId).data.neighbor[t.index]=e,this}at(t,e){return new A(this.chunkWidth,this.chunkHeight).set(t,e)}}class T{constructor(t,e,o){this.blockRegistry=t,this.blockId=e,this.blockOpts=o;for(let[n,i]of o)this[n]=t.getComponent(n,e)}toString(){return`Block#${this.blockId}`}}const W=new class{constructor(){this.blocks={},this.components={}}register(t,...e){if(t in this.blocks)throw new Error(`BlockId '${t}' already registered.`);const o=e.map((t=>Array.isArray(t)?t:[t,!0]));for(let[e,n]of o){e in this.components||(this.components[e]={});let o,i=this.components[e];if(t in i)throw new Error(`Component '${e}' for block '${t}' already registered.`);o="object"==typeof n?Object.assign({},n):n,i[t]=o}let n=new T(this,t,o);return this.blocks[t]=n,n}getBlock(t){return t in this.blocks?this.blocks[t]:null}getBlocks(){return Object.values(this.blocks)}getBlockIds(){return Object.keys(this.blocks)}getBlockComponents(t){let e=[];for(let o of this.components)t in o&&e.push(o[t]);return e}hasComponent(t,e){return t in this.components&&e in this.components[t]}getComponent(t,e){if(t in this.components){let o=this.components[t];if(e in o)return o[e]}return null}getComponents(t){if(t in this.components){let e=this.components[t];return Object.values(e)}}getComponentNames(){return Object.keys(this.components)}},N=(W.register(0,"air"),W.register(1,"fluid",["color","dodgerblue"],["material","fluid"]),W.register(3,"solid","grassSoil",["color","saddlebrown"],["material","dirt"])),L=W.register(4,"solid",["color","gold"],["material","metal"]),O=W.register(5,"solid",["color","limegreen"],["material","dirt"]),R=(W.register(6,"solid",["color","slategray"],["material","stone"]),W.register(7,"solid",["color","salmon"],["material","stone"]),W.register(8,"solid",["color","powderblue"],["material","metal"]),W.register(9,"solid",["color","rebeccapurple"],["material","stone"]),W.register(10,"solid",["color","teal"],["material","stone"]),W.register(11,"solid",["color","mediumvioletred"],["material","stone"]),W.register(12,"solid",["color","navajowhite"],["material","dirt"]),"place");const j="worldUpdate",$="blockUpdate";function H(t,e){t.emit("chunkUpdate",t,e)}function P(t,e,o){t.emit($,t,e,o)}const U="air",V="fluid";function F(t,e,o){W.hasComponent(V,o)&&t.map.setBlockMeta(e,3)}function q(t){let e=t.map.getLoadedChunks().sort(((t,e)=>t.chunkCoordY<e.chunkCoordY?1:t.chunkCoordY>e.chunkCoordY?-1:t.chunkCoordX<e.chunkCoordX?1:t.chunkCoordX>e.chunkCoordX?-1:0));for(let o of e)z(t,o)}function z(t,e){const o=t.map,n=e.chunkCoordX*o.chunkWidth,i=e.chunkCoordY*o.chunkHeight;let s=o.at(0,0);for(let e=o.chunkHeight-1;e>=0;--e)for(let r=0;r<o.chunkWidth;++r){s.set(r+n,e+i);let a=o.getBlockId(s);W.hasComponent(V,a)&&D(t,s)}}function D(t,e){const o=t.map;!function(t,e){let o=e.copy().down();return G(t,e,o,3)}(o,e)&&function(t,e){let o=!1,n=t.getBlockMeta(e),i=e.copy();n<=1?(e.offset(i,1*a.sign(),0),o|=G(t,e,i,1,!1)):(e.offset(i,1*a.sign(),0),o|=G(t,e,i,1,!1),e.offset(i,1*a.sign(),0),o|=G(t,e,i,1,!1))}(o,e)}function G(t,e,o,n,i=!0){if(!t.isWithinBounds(o))return!1;if(!t.isWithinLoaded(o))return t.setBlockId(e,0),t.setBlockMeta(e,0),!0;let s=t.getBlockId(e),r=t.getBlockMeta(e),a=t.getBlockId(o),c=t.getBlockMeta(o);if(n>r&&(n=r),W.hasComponent(U,a)){let i=r-n;return i<=0?(t.setBlockId(o,s).setBlockMeta(o,r).setBlockId(e,0).setBlockMeta(e,0),!0):(t.setBlockId(o,s).setBlockMeta(o,n).setBlockMeta(e,i),!0)}if(W.hasComponent(V,a)&&c<3){if(!i&&r<=c)return!1;if(c+n<=3)return t.setBlockMeta(o,c+n),n>=r?t.setBlockId(e,0).setBlockMeta(e,0):t.setBlockMeta(e,r-n),!0;{t.setBlockMeta(o,3);let i=n-(3-c);return t.setBlockMeta(e,i),!0}}}function J(t,e,o,n){let i=e.map.getBlockId(o);W.hasComponent("air",i)||(W.hasComponent("fluid",i)?function(t,e,o,n,i){const s=e.map,r=s.getBlockMeta(o),a=r<=0?1:r/3,c=W.getComponent("color",i);t.fillStyle=c,t.fillRect(0,(1-a)*n,n,n*a);let h=Date.now()/2e3,l=o.x/s.chunkWidth,d=o.y/s.chunkHeight,u=o.blockCoordX%2==0,m=o.blockCoordY%2==0,g=Math.sin(h+l-d+(u?.3:0)+(m?.1:0));t.fillStyle=`rgba(0, 0, 100, ${(g+1)/2*.4})`,t.fillRect(0,(1-a)*n,n,n*a)}(t,e,o,n,i):W.hasComponent("solid",i)&&function(t,e,o,n,i){const s=e.map,r=W.getComponent("color",i);if(t.fillStyle=r,t.fillRect(0,0,n,n),i===L.blockId){let e=Date.now()/500,i=o.x/s.chunkWidth,r=o.y/s.chunkHeight,a=Math.sin(e+4*i+4*r);t.fillStyle=`rgba(255, 255, 255, ${Math.max(0,a-.6)})`,t.fillRect(0,0,n,n)}else if(i===N.blockId){let e=o.blockCoordX%2==0,i=o.blockCoordY%2==0;t.fillStyle=`rgba(0, 0, 0, ${e&&i?.1:0})`,t.fillRect(0,0,n,n);const r=s.getBlockNeighbor(o),a=Math.ceil(n/4);if(!((2&r)>>1>0)){let e=s.getBlockId(o.up());W.hasComponent(U,e)&&(t.fillStyle="limegreen",t.fillRect(0,0,n,a)),o.down()}}else if(i===O.blockId){let e=o.blockCoordX%2==0;t.fillStyle=`rgba(0, 0, 0, ${e?.1:0})`,t.fillRect(0,0,n,n)}}(t,e,o,n,i))}function K(t,e,o){const n=e.chunkWidth*o,i=e.chunkHeight*o;for(let s of e.getLoadedChunks()){const r=s.chunkCoordX*n,a=s.chunkCoordY*i;t.translate(r,a),Q(t,e,s,o),t.translate(-r,-a)}}function Q(t,e,o,n){const i=e.chunkWidth,s=e.chunkHeight,r=o.chunkCoordX*i,a=o.chunkCoordY*s;let c=e.at(r,a);for(let o=0;o<s;++o)for(let s=0;s<i;++s)c.set(s+r,o+a),t.translate(s*n,o*n),J(t,{map:e},c,n),t.translate(-s*n,-o*n)}function Z(t,e,o,n=0){const i=t.map.getBlockId(e),s=W.hasComponent(V,o);if(s){if(!W.hasComponent(U,i))return}else{!function(t,e,o){t.emit("break",t,e,o)}(t,e,i);W.hasComponent(V,i)||function(t,e,o){const n=t.map;let i=e.clone();n.isWithinBounds(e.right(i))&&n.getBlockId(i)===o&&n.setBlockNeighbor(i,11&n.getBlockNeighbor(i)),n.isWithinBounds(e.up(i))&&n.getBlockId(i)===o&&n.setBlockNeighbor(i,7&n.getBlockNeighbor(i)),n.isWithinBounds(e.left(i))&&n.getBlockId(i)===o&&n.setBlockNeighbor(i,14&n.getBlockNeighbor(i)),n.isWithinBounds(e.down(i))&&n.getBlockId(i)===o&&n.setBlockNeighbor(i,13&n.getBlockNeighbor(i)),n.setBlockNeighbor(e,0)}(t,e,i)}t.map.setBlockId(e,o),t.map.setBlockMeta(e,n),s||function(t,e,o){const n=t.map;let i=e.clone(),s=0;n.isWithinBounds(e.right(i))&&n.getBlockId(i)===o&&(s|=1,n.setBlockNeighbor(i,4|n.getBlockNeighbor(i))),n.isWithinBounds(e.up(i))&&n.getBlockId(i)===o&&(s|=2,n.setBlockNeighbor(i,8|n.getBlockNeighbor(i))),n.isWithinBounds(e.left(i))&&n.getBlockId(i)===o&&(s|=4,n.setBlockNeighbor(i,1|n.getBlockNeighbor(i))),n.isWithinBounds(e.down(i))&&n.getBlockId(i)===o&&(s|=8,n.setBlockNeighbor(i,2|n.getBlockNeighbor(i))),n.setBlockNeighbor(e,s)}(t,e,o),function(t,e,o){t.emit(R,t,e,o)}(t,e,o)}function tt(t,e,o){const n=t.map;let i=n.getBlockId(o);if(W.hasComponent("grassSoil",i)){let e=n.getBlockId(o.up());W.hasComponent(U,e)&&a.next()<.001&&Z(t,o,5)}}const et="material",ot={};function nt(t){switch(function(t){return W.hasComponent(et,t)?W.getComponent(et,t):"stone"}(t)){case"dirt":ot.dirt.play({pitch:a.range(-5,5)});break;case"fluid":ot.fluid.play({pitch:a.range(-5,5)});break;case"metal":ot.metal.play({gain:4,pitch:a.range(-5,5)});break;case"stone":default:ot.stone.play({gain:1.5,pitch:a.range(-5,5)})}}function it(t){let e=t.map.getLoadedChunks().sort(((t,e)=>t.chunkCoordY<e.chunkCoordY?1:t.chunkCoordY>e.chunkCoordY?-1:t.chunkCoordX<e.chunkCoordX?1:t.chunkCoordX>e.chunkCoordX?-1:0));for(let o of e)st(t,o)}function st(t,e){const o=t.map,n=e.chunkCoordX*o.chunkWidth,i=e.chunkCoordY*o.chunkHeight;let s=o.at(0,0);for(let e=o.chunkHeight-1;e>=0;--e)for(let r=0;r<o.chunkWidth;++r){s.set(r+n,e+i);let a=o.getBlockId(s);W.hasComponent("falling",a)&&rt(t,s)}}function rt(t,e){!function(t,e){let o=e.copy().down();(function(t,e,o){if(!t.isWithinBounds(o))return!1;if(!t.isWithinLoaded(o))return t.setBlockId(e,0),!0;let n=t.getBlockId(e),i=t.getBlockId(o);if(W.hasComponent("air",i))t.setBlockId(o,n).setBlockId(e,0)})(t,e,o)}(t.map,e)}const at=[[{w:1,h:4,m:[1,1,1,1]},{w:4,h:1,m:[1,1,1,1]}],[{w:2,h:2,m:[1,1,1,1]}],[{w:3,h:2,m:[0,1,0,1,1,1]},{w:2,h:3,m:[1,0,1,1,1,0]},{w:3,h:2,m:[1,1,1,0,1,0]},{w:2,h:3,m:[0,1,1,1,0,1]}],[{w:2,h:3,m:[0,1,0,1,1,1]},{w:3,h:2,m:[1,0,0,1,1,1]},{w:2,h:3,m:[1,1,1,0,1,0]},{w:3,h:2,m:[1,1,1,0,0,1]}],[{w:2,h:3,m:[1,0,1,0,1,1]},{w:3,h:2,m:[0,0,1,1,1,1]},{w:2,h:3,m:[1,1,0,1,0,1]},{w:3,h:2,m:[1,1,1,1,0,0]}],[{w:3,h:2,m:[0,1,1,1,1,0]},{w:2,h:3,m:[1,0,1,1,0,1]}],[{w:3,h:2,m:[1,1,0,0,1,1]},{w:2,h:3,m:[0,1,1,1,1,0]}]];let ct=1/0,ht=1/0,lt=1,dt=1;for(let t of at)for(let e of t)ct=Math.min(e.w,ct),ht=Math.min(e.h,ht),lt=Math.max(e.w,lt),dt=Math.max(e.h,dt);const ut=lt,mt=dt,gt=[1,3,4,6,7,8,9,10,11,12];function ft(t,e,o,n,i,s,r,c,h){const l=i.map;if(e.placing){const t=e.shape,o=Math.min(l.bounds.right-t.w,Math.max(l.bounds.left,s-Math.floor((t.w-1)/2))),n=Math.min(l.bounds.bottom-t.h,Math.max(l.bounds.top,r-Math.floor((t.h-1)/2)));if(e.floating){const i=Math.sign(o-e.placeX),s=Math.sign(n-e.placeY);pt(t,e.placeX+i,e.placeY+s,l)||(e.floating=!1),e.placeX+=i,e.placeY+=s,e.valid=!1}else{const i=e.placeX;i<o?pt(t,i+1,e.placeY,l)||(e.placeX+=1):i>o&&(pt(t,i-1,e.placeY,l)||(e.placeX-=1));const s=e.placeY;s<n?pt(t,e.placeX,s+1,l)||(e.placeY+=1):s>n&&(pt(t,e.placeX,s-1,l)||(e.placeY-=1)),e.valid=function(t,e,o,n,i){if(W.hasComponent(V,t))return!0;let s=i.at(o,n);const{w:r,h:a,m:c}=e;for(let t=0;t<a;++t)for(let e=0;e<r;++e){if(s.set(e+o,t+n),c[e+t*r]){if(!i.isWithinLoaded(s))continue;if(15!==i.getBlockNeighbor(s))return!0}}return!1}(e.value,t,e.placeX,e.placeY,l)}}e.placeTicks<=0?e.placing?(o.value&&e.valid&&(!function(t,e,o,n,i){const{w:s,h:r,m:a}=e;let c=i.map.at(0,0);for(let e=0;e<r;++e)for(let r=0;r<s;++r){a[r+e*s]&&(c.set(r+o,e+n),Z(i,c,t))}}(e.value,e.shape,e.placeX,e.placeY,i),e.placing=!1,e.placeTicks=30,c(e)),n.value&&(e.placing=!1)):(!function(t){const e=a.choose(at),o=Math.floor(a.range(0,e.length)),n=t.value;let i=!1;switch(n){case 0:i=!0;break;case 1:i=a.next()<1/4;break;case 3:i=a.next()<1/8;break;case 4:i=a.next()<1/4;break;case 6:i=a.next()<1/8;break;default:i=a.next()<1/6}const s=i?a.choose(gt):n;t.value=s,t.shapeType=e,t.shape=e[o],t.shapeMap.clear(),function(t,e,o,n,i){const{w:s,h:r,m:a}=e;let c=i.at(0,0);for(let e=0;e<r;++e)for(let r=0;r<s;++r){a[r+e*s]&&(c.set(r+o,e+n),i.setBlockId(c,t))}}(s,t.shape,0,0,t.shapeMap)}(e),e.placing=!0,e.floating=!0,e.valid=!1,h(e)):e.placeTicks-=t}function pt(t,e,o,n){const{w:i,h:s,m:r}=t;let a=n.at(0,0);for(let t=0;t<s;++t)for(let s=0;s<i;++s){if(r[s+t*i]){if(a.set(s+e,t+o),!n.isWithinLoaded(a))continue;let i=n.getBlockId(a);if(W.hasComponent(V,i)){if(n.getBlockMeta(a)>=3)return!0}else if(!W.hasComponent(U,i))return!0}}return!1}function kt(t,e){const o=t.map.chunkWidth,n=t.map.chunkHeight;if(o!==e.chunkWidth||n!==e.chunkHeight)return null;t.score=e.score||0,t.cameraX=e.cameraX||0,t.cameraY=e.cameraY||0;const i=o*n;for(let s of Object.keys(e.chunks)){const r=e.chunks[s],[a,c]=X(s);let h=new E(o,n);for(let t=0;t<i;++t)h.block[t]=r.block[t],h.meta[t]=r.meta[t],h.neighbor[t]=r.neighbor[t];let l=new Y(this,s,a,c,h);t.map.chunks[s]=l}return t}function bt(t,e){const o=t.map.chunkWidth,n=t.map.chunkHeight;e.score=t.score,e.cameraX=t.cameraX,e.cameraY=t.cameraY,e.chunkWidth=o,e.chunkHeight=n;let i={};const s=o*n;for(let e of t.map.getLoadedChunks()){const t=e.chunkId;let o={block:new Array(s),meta:new Array(s),neighbor:new Array(s)};for(let t=0;t<s;++t)o.block[t]=e.data.block[t],o.meta[t]=e.data.meta[t],o.neighbor[t]=e.data.neighbor[t];i[t]=o}return e.chunks=i,e}document.addEventListener("DOMContentLoaded",(async function(){const t=document.querySelector("display-port"),e=document.querySelector("input-context"),o=e.getInput("cursorX"),n=e.getInput("cursorY"),i=e.getInput("place"),s=e.getInput("rotate"),r=(e.getInput("debug"),e.getInput("reset")),c=e.getInput("save"),h=e.getInput("load"),l=t.canvas.getContext("2d");l.imageSmoothingEnabled=!1,await async function(t){const e="";wt.flick=await v.loadAudio(e+"arroyo/flick.wav"),wt.melt=await v.loadAudio(e+"arroyo/melt.mp3"),wt.reset=wt.flick,wt.background=wt.melt,await async function(){}()}(),await async function(t){ot.dirt=await v.loadAudio("arroyo/dirt.wav"),ot.stone=await v.loadAudio("arroyo/stone.wav"),ot.fluid=await v.loadAudio("arroyo/waterpop.wav"),ot.metal=await v.loadAudio("arroyo/ding.wav")}();const m=new x,g=new M,f={map:new S,score:0,cameraX:0,cameraY:0,time:0,firstPlace:!0};b.assign(f),function(t){t.on(R,F),t.on(j,q)}(f),function(t){t.on($,tt)}(f),function(t){t.on(j,it)}(f);let p=localStorage.getItem("worldData");p&&kt(f,JSON.parse(p))||_t(f,t);let k=0,_=0;g.moveTo(f.cameraX,f.cameraY);let C={placing:!1,floating:!0,shape:null,shapeType:null,shapeMap:new S(0,0,ut,mt),value:0,placeX:0,placeY:0,placeTicks:0};t.addEventListener("frame",(e=>{const p=e.detail.deltaTime/1e3*60;if(r.value)return localStorage.removeItem("worldData"),f.map.clear(),void _t(f,t);if(c.value){let t=bt(f,{});d.downloadText("worldData.json",JSON.stringify(t))}else h.value?u.uploadFile([".json"],!1).then((t=>t.text())).then((e=>{let o=JSON.parse(e);f.map.clear(),o&&kt(f,o)||_t(f,t)})):f.time+=p;{let e=t.width/t.height,i=e<=1?e:1,s=e<=1?1:1/e,r=o.value-.5,a=n.value-.5;const c=4;let h=Math.atan2(a,r),l=function(t,e,o,n){let i=o-t,s=n-e;return Math.sqrt(i*i+s*s)}(0,0,r,a),d=l<.3?0:l-.3,u=Math.cos(h)*d*4*f.map.chunkWidth*i*c,m=Math.sin(h)*d*4*f.map.chunkWidth*s*c;g.moveTo(w(g.x,f.cameraX+u,.1*p),w(g.y,f.cameraY+m,.1*p))}let b=g.getViewMatrix(),y=g.getProjectionMatrix();const[v,x]=M.screenToWorld(o.value*t.width,n.value*t.height,b,y),B=Math.floor(v/4),I=Math.floor(x/4);if(ft(p,C,i,s,f,B,I,(function(e){const[o,n]=M.screenToWorld(t.width/2,t.height/2,b,y),i=Math.floor(o/4),s=Math.floor(n/4);let r=Math.ceil((e.placeX-i)/4),a=Math.ceil((e.placeY-s)/4);f.cameraX+=4*r,f.cameraY+=4*a,f.score+=1,nt(e.value),f.firstPlace&&(f.firstPlace=!1,wt.background.play())}),(function(e){let[i,s]=function(t,e,o,n,i,s,r){let a=0,c=0;switch((t<=.5?0:2)+(e<=.5?0:1)){case 0:{let t=M.screenToWorld(0,0,s,r);a=t[0],c=t[1]}break;case 1:{let t=M.screenToWorld(0,i,s,r);a=t[0],c=t[1]}break;case 2:{let t=M.screenToWorld(n,0,s,r);a=t[0],c=t[1]}break;case 3:{let t=M.screenToWorld(n,i,s,r);a=t[0],c=t[1]}}return[Math.floor(a/o),Math.floor(c/o)]}(o.value,n.value,4,t.width,t.height,b,y);e.placeX=i,e.placeY=s,wt.reset.play({pitch:a.range(-5,5)})})),function(t){t.emit("update",t)}(f),k<=0){k=10;{!function(t){t.emit(j,t)}(f);const t=f.map.getLoadedChunks(),e=f.map.chunkWidth,o=f.map.chunkHeight;let n=f.map.at(0,0);for(let i of t){const t=i.chunkCoordX*e,s=i.chunkCoordY*o;H(f,i);for(let r=0;r<o;++r)for(let o=0;o<e;++o)n.set(o+t,r+s),P(f,i,n)}}}else k-=p;if(_<=0){_=100;let t=bt(f,{});localStorage.setItem("worldData",JSON.stringify(t))}else _-=p;l.clearRect(0,0,t.width,t.height),m.begin(l,b,y),K(l,f.map,4),C.placing&&(l.translate(4*C.placeX,4*C.placeY),function(t,e,o){K(t,e.shapeMap,o)}(l,C,4),l.translate(4*-C.placeX,4*-C.placeY)),m.end(l),f.time<300&&(l.fillStyle=`rgba(0, 0, 0, ${1-f.time/300})`,l.fillRect(0,0,t.width,t.height)),l.fillStyle="white",l.fillText(f.score,4,12)}))}));const wt={};function _t(t,e){t.score=0,t.time=0,t.firstPlace=!0;let o=t.map.at(0,0),n=o.clone();Z(t,o,L.blockId),Z(t,o.offset(n,-1,0),L.blockId),Z(t,o.offset(n,0,-1),L.blockId),Z(t,o.offset(n,-1,-1),L.blockId),t.cameraX=-e.width/2,t.cameraY=-e.height/2}}(glMatrix);
