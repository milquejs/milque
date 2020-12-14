!function(e){"use strict";const t="noscale",s=Symbol("template"),i=Symbol("style");class n extends HTMLElement{static get[s](){let e=document.createElement("template");return e.innerHTML='<div class="container">\r\n    <label class="hidden" id="title">display-port</label>\r\n    <label class="hidden" id="fps">00</label>\r\n    <label class="hidden" id="dimension">0x0</label>\r\n    <canvas></canvas>\r\n    <slot></slot>\r\n</div>',Object.defineProperty(this,s,{value:e}),e}static get[i](){let e=document.createElement("style");return e.innerHTML=":host{display:inline-block;color:#555}.container{display:flex;position:relative;width:100%;height:100%}canvas{background:#000;margin:auto;-ms-interpolation-mode:nearest-neighbor;image-rendering:-moz-crisp-edges;image-rendering:pixelated}label{font-family:monospace;color:currentColor;position:absolute}#title{left:.5rem;top:.5rem}#fps{right:.5rem;top:.5rem}#dimension{left:.5rem;bottom:.5rem}.hidden{display:none}:host([debug]) .container{outline:6px dashed rgba(0,0,0,.1);outline-offset:-4px;background-color:rgba(0,0,0,.1)}:host([mode=noscale]) canvas{margin:0;top:0;left:0}:host([mode=center]),:host([mode=fit]),:host([mode=stretch]){width:100%;height:100%}:host([full]){width:100vw!important;height:100vh!important}:host([disabled]){display:none}slot{display:flex;flex-direction:column;align-items:center;justify-content:center;position:absolute;width:100%;height:100%;top:0;left:0;pointer-events:none}::slotted(*){pointer-events:auto}",Object.defineProperty(this,i,{value:e}),e}static get observedAttributes(){return["width","height","disabled","onframe","debug","id","class"]}constructor(){super(),this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(this.constructor[s].content.cloneNode(!0)),this.shadowRoot.appendChild(this.constructor[i].cloneNode(!0)),this._canvasElement=this.shadowRoot.querySelector("canvas"),this._titleElement=this.shadowRoot.querySelector("#title"),this._fpsElement=this.shadowRoot.querySelector("#fps"),this._dimensionElement=this.shadowRoot.querySelector("#dimension"),this._animationRequestHandle=0,this._prevAnimationFrameTime=0,this._width=300,this._height=150,this._onframe=null,this.update=this.update.bind(this)}get canvas(){return this._canvasElement}connectedCallback(){this.hasAttribute("mode")||(this.mode="noscale"),this.hasAttribute("tabindex")||this.setAttribute("tabindex",0),this.updateCanvasSize(),this.resume()}disconnectedCallback(){this.pause()}attributeChangedCallback(e,t,s){switch(e){case"width":this._width=s;break;case"height":this._height=s;break;case"disabled":s?(this.update(0),this.pause()):this.resume();break;case"onframe":this.onframe=new Function("event",`with(document){with(this){${s}}}`).bind(this);break;case"id":case"class":this._titleElement.innerHTML=`display-port${this.className?"."+this.className:""}${this.hasAttribute("id")?"#"+this.getAttribute("id"):""}`;break;case"debug":this._titleElement.classList.toggle("hidden",s),this._fpsElement.classList.toggle("hidden",s),this._dimensionElement.classList.toggle("hidden",s)}}update(e){this._animationRequestHandle=requestAnimationFrame(this.update),this.updateCanvasSize();const s=e-this._prevAnimationFrameTime;if(this._prevAnimationFrameTime=e,this.debug){const e=s<=0?"--":String(Math.round(1e3/s)).padStart(2,"0");if(this._fpsElement.innerText!==e&&(this._fpsElement.innerText=e),this.mode===t){let e=`${this._width}x${this._height}`;this._dimensionElement.innerText!==e&&(this._dimensionElement.innerText=e)}else{let e=`${this._width}x${this._height}|${this.shadowRoot.host.clientWidth}x${this.shadowRoot.host.clientHeight}`;this._dimensionElement.innerText!==e&&(this._dimensionElement.innerText=e)}}this.dispatchEvent(new CustomEvent("frame",{detail:{now:e,prevTime:this._prevAnimationFrameTime,deltaTime:s,canvas:this._canvasElement,get context(){let e=this.canvas.getContext("2d");return e.imageSmoothingEnabled=!1,e}},bubbles:!1,composed:!0}))}pause(){cancelAnimationFrame(this._animationRequestHandle)}resume(){this._animationRequestHandle=requestAnimationFrame(this.update)}updateCanvasSize(){let e=this.shadowRoot.host.getBoundingClientRect();const s=e.width,i=e.height;let n=this._canvasElement,r=this._width,a=this._height;const o=this.mode;if("stretch"===o)r=s,a=i;else if(o!==t){if(s<r||i<a||"fit"===o){let e=s/r,t=i/a;e<t?(r=s,a*=e):(r*=t,a=i)}}r=Math.floor(r),a=Math.floor(a),n.clientWidth===r&&n.clientHeight===a||(n.width=this._width,n.height=this._height,n.style=`width: ${r}px; height: ${a}px`,this.dispatchEvent(new CustomEvent("resize",{detail:{width:r,height:a},bubbles:!1,composed:!0})))}get onframe(){return this._onframe}set onframe(e){this._onframe&&this.removeEventListener("frame",this._onframe),this._onframe=e,this._onframe&&this.addEventListener("frame",e)}get width(){return this._width}set width(e){this.setAttribute("width",e)}get height(){return this._height}set height(e){this.setAttribute("height",e)}get mode(){return this.getAttribute("mode")}set mode(e){this.setAttribute("mode",e)}get disabled(){return this.hasAttribute("disabled")}set disabled(e){e?this.setAttribute("disabled",""):this.removeAttribute("disabled")}get debug(){return this.hasAttribute("debug")}set debug(e){e?this.setAttribute("debug",""):this.removeAttribute("debug")}}window.customElements.define("display-port",n);const r={NULL:0,DOWN:1,UP:2,MOVE:3,parse(e){if("string"!=typeof e)return r.NULL;switch(e.toLowerCase()){case"down":return r.DOWN;case"up":return r.UP;case"move":return r.MOVE;default:return r.NULL}}};class a{static createAdapter(e,t,s,i,n,r){return{target:e,adapterId:t,deviceName:s,keyCode:i,scale:n,eventCode:r}}constructor(){this.adapters={"*":o()}}add(e){for(let t of e){const{deviceName:e,keyCode:s}=t;let i;e in this.adapters?i=this.adapters[e]:(i=o(),this.adapters[e]=i),s in i?i[s].push(t):i[s]=[t]}}delete(e){for(let t of e){const{deviceName:e,keyCode:s}=t;if(e in this.adapters){let i=this.adapters[e];if(s in i){let e=i[s],n=e.indexOf(t);n>=0&&e.splice(n,1)}}}}clear(){for(let e in this.adapters)this.adapters[e]=o()}poll(e,t,s){const i=this.findAdapters(e,t);for(let e of i){const t=e.eventCode;if(t===r.NULL){const{target:t,scale:i}=e,n=s.value*i;t.poll(n,e)}else{const{target:i,scale:n}=e,r=s.getEvent(t)*n;i.poll(r,e)}}return i.length>0}update(e,t,s){let i=!1;for(let n of this.findAdapters(e,t)){const e=n.eventCode;if(e!==r.NULL){const{target:t,scale:r}=n,a=s.getEvent(e)*r;t.update(a,n),i=!0}}return i}reset(e,t,s){let i=!1;for(let s of this.findAdapters(e,t))s.target.reset(),i=!0;return i}findAdapters(e,t){let s=[];if(e in this.adapters){let i=this.adapters[e];t in i&&s.push(...i[t]),s.push(...i["*"])}let i=this.adapters["*"];return t in i&&s.push(...i[t]),s.push(...i["*"]),s}}function o(){return{"*":[]}}class l extends class{constructor(){this.value=0}update(e){this.value=e}poll(){this.value=0}getEvent(e){return 0}getState(){return this.value}}{constructor(e){super(),this.update=this.update.bind(this),Array.isArray(e)||(e=[e]);let t=[],s=0;for(let i of e){"string"==typeof i&&(i={key:i});const{key:e,scale:n=1,event:o="null"}=i,{deviceName:l,keyCode:u}=h(e),d=r.parse(o),c=Number(n);let p=a.createAdapter(this,s,l,u,c,d);t.push(p),++s}this.adapters=t,this.values=new Array(t.length).fill(0),this.next={values:new Array(t.length).fill(0),value:0}}poll(e,t){const s=t.adapterId;let i=this.values[s];this.values[s]=e,this.value=this.value-i+e,this.next.values[s]=0,this.next.value+=e-i}update(e,t){const s=t.adapterId;let i=this.next.values[s];this.next.values[s]=e,this.next.value+=e-i}reset(){this.values.fill(0),this.value=0,this.next.values.fill(0),this.next.value=0}}function h(e){let t=e.indexOf(":");if(t>=0)return{deviceName:e.substring(0,t),keyCode:e.substring(t+1)};throw new Error("Invalid key string - missing device separator ':'.")}function u(e,t){return`${e}:${t}`}const d=1,c=2;const p=Symbol("inputRefCounts");function m(e,t,s){const i=u(t,s);let n=e[p],r=n[i]+1||1;return n[i]=r,r}function f(e,t,s){const i=u(t,s);let n=e[p],r=n[i]-1||0;return n[i]=Math.max(r,0),r}class g{next(){return Math.random()}}let b;class w{constructor(e=new g){this.generator=e}static next(){return b.next()}next(){return this.generator.next()}static choose(e){return b.choose(e)}choose(e){return e[Math.floor(this.generator.next()*e.length)]}static range(e,t){return b.range(e,t)}range(e,t){return(t-e)*this.generator.next()+e}static sign(){return b.sign()}sign(){return this.generator.next()<.5?-1:1}}function v(e,t,s){return Math.min(s,Math.max(t,e))}function N(e){const t=[],s=[],i=[],n=[],r=[],a=[],o=/v\s+(\S+)\s+(\S+)\s+(\S+)/g,l=/vn\s+(\S+)\s+(\S+)\s+(\S+)/g,h=/vt\s+(\S+)\s+(\S+)/g,u=/f\s+(([^/\s]*)\/([^/\s]*)\/?([^/\s]*))\s+(([^/\s]*)\/([^/\s]*)\/?([^/\s]*))\s+(([^/\s]*)\/([^/\s]*)\/?([^/\s]*))(\s+(([^/\s]*)\/([^/\s]*)\/?([^/\s]*)))?/g,d=/f\s+([^/\s]+)\s+([^/\s]+)\s+([^/\s]+)/g;let c,p,m,f,g,b,w=!1,v=null;for(e=e.replace(/^#.*/g,"");null!=(v=o.exec(e));)c=Number.parseFloat(v[1]),p=Number.parseFloat(v[2]),m=Number.parseFloat(v[3]),t.push(c),t.push(p),t.push(m);for(;null!=(v=l.exec(e));)c=Number.parseFloat(v[1]),p=Number.parseFloat(v[2]),m=Number.parseFloat(v[3]),i.push(c),i.push(p),i.push(m);for(;null!=(v=h.exec(e));)c=Number.parseFloat(v[1]),p=Number.parseFloat(v[2]),s.push(c),s.push(p);for(;null!=(v=u.exec(e));)c=Number.parseInt(v[2]),Number.isNaN(c)&&(c=1),p=Number.parseInt(v[6]),Number.isNaN(p)&&(p=1),m=Number.parseInt(v[10]),Number.isNaN(m)&&(m=1),n.push(c),n.push(p),n.push(m),c=Number.parseInt(v[4]),Number.isNaN(c)?(c=Number.parseInt(v[3]),p=Number.parseInt(v[7]),m=Number.parseInt(v[11]),a.push(c),a.push(p),a.push(m),r.push(1),r.push(1),r.push(1)):(p=Number.parseInt(v[8]),Number.isNaN(p)&&(p=1),m=Number.parseInt(v[12]),Number.isNaN(m)&&(m=1),a.push(c),a.push(p),a.push(m),c=Number.parseInt(v[3]),Number.isNaN(c)&&(c=1),p=Number.parseInt(v[7]),Number.isNaN(p)&&(p=1),m=Number.parseInt(v[11]),Number.isNaN(m)&&(m=1),r.push(c),r.push(p),r.push(m)),void 0!==v[13]&&(f=Number.parseInt(v[15]),Number.isNaN(f)&&(f=1),n.push(f),f=Number.parseInt(v[17]),Number.isNaN(f)?(f=Number.parseInt(v[16]),a.push(f),r.push(1)):(a.push(f),f=Number.parseInt(v[16]),r.push(f)),w=!0);for(;null!=(v=d.exec(e));)c=Number.parseInt(v[2]),p=Number.parseInt(v[6]),m=Number.parseInt(v[10]),n.push(c),n.push(p),n.push(m),r.push(1),r.push(1),r.push(1),a.push(1),a.push(1),a.push(1),void 0!==v[13]&&(f=Number.parseInt(v[14]),n.push(f),r.push(1),a.push(1),w=!0);b=n.length;const N=new Float32Array(3*b);for(let e=0;e<b;++e)g=n[e]-1,N[3*e+0]=t[3*g+0],N[3*e+1]=t[3*g+1],N[3*e+2]=t[3*g+2];b=r.length;const y=new Float32Array(2*b);for(let e=0;e<b;++e)g=r[e]-1,y[2*e+0]=s[2*g+0],y[2*e+1]=s[2*g+1];b=a.length;const x=new Float32Array(3*b);for(let e=0;e<b;++e)g=a[e]-1,x[3*e+0]=i[3*g+0],x[3*e+1]=i[3*g+1],x[3*e+2]=i[3*g+2];b=n.length;const I=new Uint16Array(b);for(let e=0;e<b;++e)I[e]=e;return w&&console.warn("WebGL does not support quad faces, only triangles."),{positions:N,texcoords:y,normals:x,indices:I}}function y(e){const t=[],s=[],i=[],n=[],r=[],a=[],o=/v( +[\d|.|+|\-|e]+)( [\d|.|+|\-|e]+)( [\d|.|+|\-|e]+)/g,l=/vn( +[\d|.|+|\-|e]+)( [\d|.|+|\-|e]+)( [\d|.|+|\-|e]+)/g,h=/vt( +[\d|.|+|\-|e]+)( [\d|.|+|\-|e]+)/g,u=/f( +([\d]*)\/([\d]*)\/([\d]*))( ([\d]*)\/([\d]*)\/([\d]*))( ([\d]*)\/([\d]*)\/([\d]*))( ([\d]*)\/([\d]*)\/([\d]*))?/g,d=/f( +[\d|.|+|\-|e]+)( [\d|.|+|\-|e]+)( [\d|.|+|\-|e]+)/g;let c,p,m,f,g,b,w=!1,v=null;for(e=e.replace(/^#.*/g,"");null!=(v=o.exec(e));)c=Number.parseFloat(v[1]),p=Number.parseFloat(v[2]),m=Number.parseFloat(v[3]),t.push(c),t.push(p),t.push(m);for(;null!=(v=l.exec(e));)c=Number.parseFloat(v[1]),p=Number.parseFloat(v[2]),m=Number.parseFloat(v[3]),i.push(c),i.push(p),i.push(m);for(;null!=(v=h.exec(e));)c=Number.parseFloat(v[1]),p=Number.parseFloat(v[2]),s.push(c),s.push(p);for(;null!=(v=u.exec(e));)c=Number.parseInt(v[2]),Number.isNaN(c)&&(c=1),p=Number.parseInt(v[6]),Number.isNaN(p)&&(p=1),m=Number.parseInt(v[10]),Number.isNaN(m)&&(m=1),n.push(c),n.push(p),n.push(m),c=Number.parseInt(v[3]),Number.isNaN(c)&&(c=1),p=Number.parseInt(v[7]),Number.isNaN(p)&&(p=1),m=Number.parseInt(v[11]),Number.isNaN(m)&&(m=1),r.push(c),r.push(p),r.push(m),c=Number.parseInt(v[4]),Number.isNaN(c)&&(c=1),p=Number.parseInt(v[8]),Number.isNaN(p)&&(p=1),m=Number.parseInt(v[12]),Number.isNaN(m)&&(m=1),a.push(c),a.push(p),a.push(m),void 0!==v[13]&&(f=Number.parseInt(v[14]),Number.isNaN(f)&&(f=1),n.push(f),f=Number.parseInt(v[15]),Number.isNaN(f)&&(f=1),r.push(f),f=Number.parseInt(v[16]),Number.isNaN(f)&&(f=1),a.push(f),w=!0);for(;null!=(v=d.exec(e));)c=Number.parseInt(v[2]),p=Number.parseInt(v[6]),m=Number.parseInt(v[10]),n.push(c),n.push(p),n.push(m),r.push(1),r.push(1),r.push(1),a.push(1),a.push(1),a.push(1),void 0!==v[13]&&(f=Number.parseInt(v[14]),n.push(f),r.push(1),a.push(1),w=!0);b=n.length;const N=new Float32Array(3*b);for(let e=0;e<b;++e)g=n[e]-1,N[3*e+0]=t[3*g+0],N[3*e+1]=t[3*g+1],N[3*e+2]=t[3*g+2];b=r.length;const y=new Float32Array(2*b);for(let e=0;e<b;++e)g=r[e]-1,y[2*e+0]=s[2*g+0],y[2*e+1]=s[2*g+1];b=a.length;const x=new Float32Array(3*b);for(let e=0;e<b;++e)g=a[e]-1,x[3*e+0]=i[3*g+0],x[3*e+1]=i[3*g+1],x[3*e+2]=i[3*g+2];b=n.length;const I=new Uint16Array(b);for(let e=0;e<b;++e)I[e]=e;return w&&console.warn("WebGL does not support quad faces, only triangles."),{positions:N,texcoords:y,normals:x,indices:I}}b=new w;let x={};function I(e,t){x[e]=t}function M(e){if(e in x)return x[e];throw new Error(`Unknown asset type '${e}'.`)}async function A(e,t={},s="."){if(e.indexOf(":")<0)throw new Error("Missing type for asset source.");let[i,n]=e.split(":"),r=M(i);return await r(s+"/"+n,t)}I("image",(async function(e,t){return new Promise(((t,s)=>{let i=new Image;i.addEventListener("load",(()=>{t(i)})),i.addEventListener("error",(e=>{s(e)})),i.src=e}))})),I("text",(async function(e,t){return(await fetch(e)).text()})),I("json",(async function(e,t){let s=await fetch(e);return await s.json()})),I("bytes",(async function(e,t){let s=await fetch(e);return await s.arrayBuffer()})),I("obj",(async function(e,t){let s=await fetch(e),i=await s.text();{const e=10;for(let t=0;t<e;++t){performance.now();y(i);performance.now()}}{const e=10;for(let t=0;t<e;++t){performance.now();N(i);performance.now()}}return N(i)}));var _=Object.freeze({__proto__:null,defineAssetLoader:I,getAssetLoader:M,loadAssetMap:async function(e,t="."){let s={};for(let i of Object.keys(e)){let n=e[i];if("string"==typeof n)s[i]=await A(n,void 0,t);else{if("object"!=typeof n)throw new Error("Unknown entry type in asset map.");if(!("src"in n))throw new Error("Missing required field 'src' for entry in asset map.");if("name"in n&&n.name!==i)throw new Error(`Cannot redefine name for asset '${i}' for entry in asset map.`);s[i]=await A(n.src,n,t)}}return s},loadAssetList:async function(e,t="."){let s={};for(let i of e)if("string"==typeof i)s[i]=await A(i,void 0,t);else{if("object"!=typeof i)throw new Error("Unknown entry type in asset list.");if(!("src"in i))throw new Error("Missing required field 'src' for entry in asset list.");s["name"in i?i.name:i.src]=await A(i.src,i,t)}return s},loadAsset:A});!async function(e){document.addEventListener("click",(()=>{"suspended"===e.state&&e.resume()}))}(new AudioContext);e.vec3.fromValues(0,0,0),e.vec3.fromValues(1,0,0),e.vec3.fromValues(0,1,0),e.vec3.fromValues(0,0,1);class E{constructor(e,t,s=new w){this.width=e,this.height=t,this.length=e*t,this.rand=s,this.dangerCount=.2*this.length,this.data={tiles:new Array(length),overlay:new Array(length),regions:new Array(length),solids:new Array(length),marks:new Array(length)},k(this,this.dangerCount,this.rand)}dig(e,t){const s=this.width,i=this.height;let n=this.data,r=e+t*s;if(n.solids[r]<=0)return!0;if(n.marks[r]>0)return!0;if(n.tiles[r]>0)return n.solids[r]=0,!1;let a=new Set,o=[];for(o.push(r);o.length>0;){let e=o.pop();a.add(e);let t=e%s,r=Math.floor(e/s);if(n.solids[e]=0,n.overlay[e]<=0){let e=T(t,r,s,i);for(let t of e)!a.has(t)&&n.marks[t]<=0&&o.push(t)}}return!0}mark(e,t){const s=this.width;let i=this.data,n=e+t*s;return!(i.solids[n]<=0)&&(i.marks[n]>0?i.marks[n]=0:i.marks[n]=1,!0)}checkWinCondition(){const e=this.data;for(let t=0;t<e.tiles.length;++t)if(e.solids[t]>0&&e.tiles[t]<=0)return!1;return!0}reset(){k(this,this.dangerCount,this.rand)}clear(){let e=this.data;for(let t=0;t<this.length;++t)e.tiles[t]=0,e.overlay[t]=0,e.solids[t]=1,e.regions[t]=0,e.marks[t]=0}}function k(e,t,s){e.clear();const i=e.width,n=e.height,r=e.rand;let a=e.data;for(let e=0;e<t;++e){let t=Math.floor(s.range(0,i)),r=Math.floor(s.range(0,n)),o=t+r*i,l=1;if(0===a.tiles[o]){a.tiles[o]+=l,a.overlay[o]=1/0;for(let e of T(t,r,i,n))a.overlay[e]+=l}else--e}const o=Array.from(function(e,t,s,i){const n=e.tiles.length;let r=new Map,a=new Map,o=1;for(let l=0;l<n;++l)if(i(l))e.regions[l]=-1;else{let n=S(e,t,s,l,o++,i);if(n){if(a.has(n.tileIndex)){const e=a.get(n.tileIndex);r.delete(e),a.delete(n.tileIndex)}a.set(n.tileIndex,n.regionIndex),r.set(n.regionIndex,n)}}return r}(a,i,n,(e=>a.overlay[e]>0)).values()).sort(((e,t)=>e.count-t.count)),l=[[o[0]]];let h=0;for(let e of o)l[h][0].count!==e.count?l[++h]=[e]:l[h].push(e);let u=l[Math.floor(l.length/2)],d=r.choose(u).tileIndex,c=d%i,p=Math.floor(d/i);e.dig(c,p)}function S(e,t,s,i,n,r){let a=1/0,o=new Set,l=[];for(l.push(i);l.length>0;){let i=l.pop();if(r(i))continue;o.add(i);let h=i%t,u=Math.floor(i/t);e.regions[i]=n,i<a&&(a=i);let d=T(h,u,t,s);for(let e of d)o.has(e)||l.push(e)}return a<1/0?{tileIndex:a,regionIndex:n,count:o.size}:null}function T(e,t,s,i){let n=[],r=e+t*s;return e>0&&n.push(r-1),e<s-1&&n.push(r+1),t>0&&n.push(r-s),t<i-1&&n.push(r+s),e>0&&t>0&&n.push(r-1-s),e<s-1&&t>0&&n.push(r+1-s),e>0&&t<i-1&&n.push(r-1+s),e<s-1&&t<i-1&&n.push(r+1+s),n}const C=new class{constructor(e={}){const{disabled:t=!0}=e;this.inputSource=null,this._disabled=t,this._ignoreInput=t,this.adapters=new a,this.inputs={},this.onSourceInput=this.onSourceInput.bind(this),this.onSourcePoll=this.onSourcePoll.bind(this)}get disabled(){return this._disabled}set disabled(e){this.toggle(!e)}setInputMap(e){return this._setupInputs(this.inputSource,e),this}attach(e){return this._setupInputs(e,null),this.toggle(!0),this}detach(){return this.toggle(!1),this._setupInputs(null,null),this}_setupInputs(e,t){const s=this.disabled;this.disabled=!0;const i=this.inputSource,n=this.inputs,r=i!==e&&i,a=this.inputs&&t;if(r||a){r&&(i.removeEventListener("poll",this.onSourcePoll),i.removeEventListener("input",this.onSourceInput));for(let e in n){let{adapters:t}=n[e];for(let e of t){const{deviceName:t,keyCode:s}=e;0===f(i,t,s)&&i.delete(t,s)}}a&&(this.adapters.clear(),this.inputs={})}if(t){let e={};for(let s in t){let i=t[s],n=new l(i),r=n.adapters;this.adapters.add(r),e[s]=n}this.inputs=e}if(e){!function(e){p in e||(e[p]={})}(e);const t=this.inputs;for(let s in t){let{adapters:i}=t[s];for(let t of i){const{deviceName:s,keyCode:i}=t;1===m(e,s,i)&&e.add(s,i)}}this.inputSource!==e&&(e.addEventListener("poll",this.onSourcePoll),e.addEventListener("input",this.onSourceInput),this.inputSource=e)}this.disabled=s}onSourceInput(e){if(e.consumed||this._ignoreInput){const{deviceName:t,keyCode:s,input:i}=e;this.adapters.reset(t,s,i)}else{const{stage:t,deviceName:s,keyCode:i,input:n}=e;switch(t){case c:this.adapters.poll(s,i,n);break;case d:this.adapters.update(s,i,n)}e.consumed=!0}}onSourcePoll(e){this._ignoreInput!==this.disabled&&(this._ignoreInput=this.disabled)}toggle(e=this._disabled){if(e){if(!this.inputSource)throw new Error("Input source must be set before enabling input context.");Object.keys(this.inputs).length<=0&&console.warn("No inputs found for enabled input context - did you forget to setInputMap()?")}return this._disabled=!e,this}getInput(e){return this.inputs[e]}getInputValue(e){return e in this.inputs?this.inputs[e].value:0}}({activate:{key:"mouse:0",event:"up"},mark:{key:"mouse:2",event:"up"},restart:{key:"keyboard:KeyR",event:"up"},cursorX:{key:"mouse:pos.x",scale:1},cursorY:{key:"mouse:pos.y",scale:1}}),L=C.getInput("cursorX"),F=C.getInput("cursorY"),R=C.getInput("activate"),O=C.getInput("mark"),V=C.getInput("restart");class j{static screenToWorld(t,s,i,n){let r=e.mat4.multiply(e.mat4.create(),n,i);e.mat4.invert(r,r);let a=e.vec3.fromValues(t,s,0);return e.vec3.transformMat4(a,a,r),a}constructor(t=-1,s=1,i=-1,n=1,r=0,a=1){this.position=e.vec3.create(),this.rotation=e.quat.create(),this.scale=e.vec3.fromValues(1,1,1),this.clippingPlane={left:t,right:s,top:i,bottom:n,near:r,far:a},this._viewMatrix=e.mat4.create(),this._projectionMatrix=e.mat4.create()}get x(){return this.position[0]}set x(e){this.position[0]=e}get y(){return this.position[1]}set y(e){this.position[1]=e}get z(){return this.position[2]}set z(e){this.position[2]=e}moveTo(t,s,i=0,n=1){let r=e.vec3.fromValues(t,s,i);e.vec3.lerp(this.position,this.position,r,Math.min(1,n))}getViewMatrix(t=this._viewMatrix){let s=-Math.round(this.x),i=-Math.round(this.y),n=0===this.z?1:1/this.z,r=e.vec3.fromValues(s,i,0),a=e.vec3.fromValues(this.scale[0]*n,this.scale[1]*n,1);return e.mat4.fromRotationTranslationScale(t,this.rotation,r,a),t}getProjectionMatrix(t=this._projectionMatrix){let{left:s,right:i,top:n,bottom:r,near:a,far:o}=this.clippingPlane;return e.mat4.ortho(t,s,i,n,r,a,o),t}}class P{constructor(){this.prevTransformMatrix=null,this.domProjectionMatrix=new DOMMatrix,this.domViewMatrix=new DOMMatrix,this.ctx=null}begin(e,t,s){if(this.ctx)throw new Error("View already begun - maybe missing end() call?");t&&W(this.domViewMatrix,t),s&&W(this.domProjectionMatrix,s),this.prevTransformMatrix=e.getTransform(),e.setTransform(this.domProjectionMatrix);const{a:i,b:n,c:r,d:a,e:o,f:l}=this.domViewMatrix;e.transform(i,n,r,a,o,l),this.ctx=e}end(e){e.setTransform(this.prevTransformMatrix),this.ctx=null}}function W(e,t){return e.a=t[0],e.b=t[1],e.c=t[4],e.d=t[5],e.e=t[12],e.f=t[13],e}const $=16;function q(){this.mines=new E(16,16),this.minesView=new P,this.camera=new j,this.camera.x=-32,this.camera.y=-32,this.firstAction=!1,this.health=3,this.gameOver=!1,this.gameWin=!1,this.gameTime=0}function U(e){}function G(e){var t,s;if(V.value)z(this);else if(this.gameOver||this.gameWin){if(R.value||O.value)return void z(this)}else{const i=this.display.width,n=this.display.height;this.firstAction&&(this.gameTime+=e);let r=!1;if(R.value){let e=L.value*i,a=F.value*n,o=j.screenToWorld(e,a,this.camera.getViewMatrix(),this.camera.getProjectionMatrix()),l=v(Math.floor(o[0]/$),0,this.mines.width-1),h=v(Math.floor(o[1]/$),0,this.mines.height-1);this.mines.dig(l,h)||(s=1,(t=this).health-=s,t.health<=0&&function(e){e.gameOver=!0}(t)),this.mines.checkWinCondition()&&function(e){e.gameWin=!0}(this),r=!0}if(O.value){let e=L.value*i,t=F.value*n,s=j.screenToWorld(e,t,this.camera.getViewMatrix(),this.camera.getProjectionMatrix()),a=v(Math.floor(s[0]/$),0,this.mines.width-1),o=v(Math.floor(s[1]/$),0,this.mines.height-1);this.mines.mark(a,o),r=!0}r&&!this.firstAction&&(this.firstAction=!0)}}function z(e){e.mines.reset(),e.gameOver=!1,e.gameWin=!1,e.gameTime=0,e.firstAction=!1,e.health=3}const D={LOADED:!1,TILE_IMAGE:null,NUMS_IMAGE:null,MARK_IMAGE:null};async function H(){await async function(){D.TILE_IMAGE=await _.loadAsset("image:mines/tile.png",{}),D.NUMS_IMAGE=await _.loadAsset("image:mines/nums.png",{}),D.MARK_IMAGE=await _.loadAsset("image:mines/flag.png",{}),D.LOADED=!0}()}function B(e,t){let s=e.context;const i=t.camera.getViewMatrix(),n=t.camera.getProjectionMatrix();t.minesView.begin(s,i,n),function(e,t,s=16){if(!D.LOADED)throw new Error("Assets for this renderer have not yet been loaded.");const i=t.width,n=t.height,r=t.data,a=s/2;e.fillStyle="#777777",e.fillRect(0,0,i*s,n*s),function(e,t,s,i,n,r,a){e.strokeStyle="#888888",e.beginPath();for(let r=0;r<n;r+=a)e.moveTo(t,r+s),e.lineTo(t+i,r+s);for(let a=0;a<i;a+=r)e.moveTo(a+t,s),e.lineTo(a+t,s+n);e.stroke()}(e,0,0,i*s,n*s,s,s);for(let t=0;t<n;++t)for(let n=0;n<i;++n){let o=n*s,l=t*s,h=n+t*i;if(r.solids[h]>0)e.drawImage(D.TILE_IMAGE,o,l,s,s),r.marks[h]>0&&e.drawImage(D.MARK_IMAGE,o,l,s,s);else if(r.tiles[h]>0)e.fillStyle="rgba(0, 0, 0, 0.2)",e.fillRect(o,l,s,s),e.textAlign="center",e.textBaseline="middle",e.font="10px sans-serif",e.fillStyle="#000000",e.fillText("X",o+a,l+a);else if(r.overlay[h]>0){let t=r.overlay[h]-1;e.drawImage(D.NUMS_IMAGE,32*t,0,32,32,o,l,s,s)}}}(s,t.mines,$),t.minesView.end(s);const r=t.mines.width,a=t.mines.height,o=32,l=$;let h=L.value*e.width,u=F.value*e.height,d=j.screenToWorld(h,u,i,n),c=v(Math.floor(d[0]/l),0,r-1),p=v(Math.floor(d[1]/l),0,a-1);s.fillStyle="rgba(0, 0, 0, 0.2)",s.fillRect(32+c*l,o+p*l,l,l),s.fillStyle="rgba(0, 0, 0, 0.3)",s.fillRect(0,0,e.width,o),s.fillRect(0,e.height-o,e.width,o),s.fillRect(0,o,32,e.height-64),s.fillRect(e.width-32,o,32,e.height-64);for(let e=0;e<3;++e){let i=e<t.health?"salmon":"darkgray";s.fillStyle=i,s.fillRect(0+e*l,0,13,13)}t.gameOver?(K(s,e.width/2,e.height/2,.7*e.width,8,"black"),X(s,e.width/2+1,e.height/2+1,"Game Over",32,"black"),X(s,e.width/2-1,e.height/2-1,"Game Over",32,"white"),X(s,e.width/2+1,e.height/2+24+1,"Click to continue",16,"black"),X(s,e.width/2-1,e.height/2+24-1,"Click to continue",16,"white")):t.gameWin&&(K(s,e.width/2,e.height/2,.7*e.width,8,"black"),X(s,e.width/2+1,e.height/2+1,"Success!",32,"black"),X(s,e.width/2-1,e.height/2-1,"Success!",32,"gold"),X(s,e.width/2+1,e.height/2+24+1,"Click to continue",16,"black"),X(s,e.width/2-1,e.height/2+24-1,"Click to continue",16,"white")),X(s,e.width/2,e.height-l,`Time: ${Math.floor(t.gameTime)}`,16,"white")}function K(e,t,s,i,n,r){e.translate(t,s);{let t=i/2,s=n/2;e.fillStyle=r,e.fillRect(-t,-s,i,n)}e.translate(-t,-s)}function X(e,t,s,i,n,r){e.translate(t,s),e.textAlign="center",e.textBaseline="middle",e.font=`${n}px sans-serif`,e.fillStyle=r,e.fillText(i,0,0),e.translate(-t,-s)}document.addEventListener("DOMContentLoaded",(async function(){const e=document.querySelector("display-port"),t=e.canvas.getContext("2d");t.imageSmoothingEnabled=!1,document.body.appendChild(C);const s={display:e};await H.call(s),q.call(s),e.addEventListener("frame",(i=>{const n=i.detail.deltaTime/1e3;U.call(s,n),C.poll(),G.call(s,n);const r={context:t,width:e.width,height:e.height};t.clearRect(0,0,r.width,r.height),B.call(s,r,s)}))}))}(glMatrix);
