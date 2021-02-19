!function(){"use strict";const t="noscale";class e extends HTMLElement{static get[Symbol.for("cuttleTemplate")](){let t=document.createElement("template");return t.innerHTML='<div class="container">\n    <label class="hidden" id="title">display-port</label>\n    <label class="hidden" id="fps">00</label>\n    <label class="hidden" id="dimension">0x0</label>\n    <canvas></canvas>\n    <slot></slot>\n</div>',Object.defineProperty(this,Symbol.for("cuttleTemplate"),{value:t}),t}static get[Symbol.for("cuttleStyle")](){let t=document.createElement("style");return t.innerHTML=":host{display:inline-block;color:#555}.container{display:flex;position:relative;width:100%;height:100%}canvas{background:#000;margin:auto;-ms-interpolation-mode:nearest-neighbor;image-rendering:-moz-crisp-edges;image-rendering:pixelated}label{font-family:monospace;color:currentColor;position:absolute}#title{left:.5rem;top:.5rem}#fps{right:.5rem;top:.5rem}#dimension{left:.5rem;bottom:.5rem}.hidden{display:none}:host([debug]) .container{outline:6px dashed rgba(0,0,0,.1);outline-offset:-4px;background-color:rgba(0,0,0,.1)}:host([mode=noscale]) canvas{margin:0;top:0;left:0}:host([mode=center]),:host([mode=fit]),:host([mode=stretch]){width:100%;height:100%}:host([full]){width:100vw!important;height:100vh!important}:host([disabled]){display:none}slot{display:flex;flex-direction:column;align-items:center;justify-content:center;position:absolute;width:100%;height:100%;top:0;left:0;pointer-events:none}::slotted(*){pointer-events:auto}",Object.defineProperty(this,Symbol.for("cuttleStyle"),{value:t}),t}static get properties(){return{width:Number,height:Number,disabled:Boolean,debug:Boolean,mode:{type:String,value:"fit",observed:!1}}}get mode(){return this.getAttribute("mode")}set mode(t){this.setAttribute("mode",t)}get debug(){return this._debug}set debug(t){this.toggleAttribute("debug",t)}get disabled(){return this._disabled}set disabled(t){this.toggleAttribute("disabled",t)}get height(){return this._height}set height(t){this.setAttribute("height",String(t))}get width(){return this._width}set width(t){this.setAttribute("width",String(t))}static get customEvents(){return["frame"]}get onframe(){return this._onframe}set onframe(t){this._onframe&&this.removeEventListener("frame",this._onframe),this._onframe=t,this._onframe&&this.addEventListener("frame",t)}static get observedAttributes(){return["onframe","width","height","disabled","debug","id","class"]}constructor(){super(),this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(this.constructor[Symbol.for("cuttleTemplate")].content.cloneNode(!0)),this.shadowRoot.appendChild(this.constructor[Symbol.for("cuttleStyle")].cloneNode(!0)),this._canvasElement=this.shadowRoot.querySelector("canvas"),this._titleElement=this.shadowRoot.querySelector("#title"),this._fpsElement=this.shadowRoot.querySelector("#fps"),this._dimensionElement=this.shadowRoot.querySelector("#dimension"),this._animationRequestHandle=0,this._prevAnimationFrameTime=0,this._width=300,this._height=150,this._onframe=null,this.update=this.update.bind(this)}get canvas(){return this._canvasElement}connectedCallback(){if(Object.prototype.hasOwnProperty.call(this,"onframe")){let t=this.onframe;delete this.onframe,this.onframe=t}if(Object.prototype.hasOwnProperty.call(this,"width")){let t=this.width;delete this.width,this.width=t}if(Object.prototype.hasOwnProperty.call(this,"height")){let t=this.height;delete this.height,this.height=t}if(Object.prototype.hasOwnProperty.call(this,"disabled")){let t=this.disabled;delete this.disabled,this.disabled=t}if(Object.prototype.hasOwnProperty.call(this,"debug")){let t=this.debug;delete this.debug,this.debug=t}if(Object.prototype.hasOwnProperty.call(this,"mode")){let t=this.mode;delete this.mode,this.mode=t}this.hasAttribute("mode")||this.setAttribute("mode","fit"),this.hasAttribute("tabindex")||this.setAttribute("tabindex",0),this.updateCanvasSize(),this.resume()}disconnectedCallback(){this.pause()}attributeChangedCallback(t,e,s){switch(t){case"width":this._width=Number(s);break;case"height":this._height=Number(s);break;case"disabled":this._disabled=null!==s;break;case"debug":this._debug=null!==s;break;case"onframe":this.onframe=new Function("event","with(document){with(this){"+s+"}}").bind(this)}((t,e,s)=>{switch(t){case"disabled":s?(this.update(0),this.pause()):this.resume();break;case"id":case"class":this._titleElement.innerHTML=`display-port${this.className?"."+this.className:""}${this.hasAttribute("id")?"#"+this.getAttribute("id"):""}`;break;case"debug":this._titleElement.classList.toggle("hidden",s),this._fpsElement.classList.toggle("hidden",s),this._dimensionElement.classList.toggle("hidden",s)}})(t,0,s)}update(e){this._animationRequestHandle=requestAnimationFrame(this.update),this.updateCanvasSize();const s=e-this._prevAnimationFrameTime;if(this._prevAnimationFrameTime=e,this.debug){const e=s<=0?"--":String(Math.round(1e3/s)).padStart(2,"0");if(this._fpsElement.innerText!==e&&(this._fpsElement.innerText=e),this.mode===t){let t=`${this._width}x${this._height}`;this._dimensionElement.innerText!==t&&(this._dimensionElement.innerText=t)}else{let t=`${this._width}x${this._height}|${this.shadowRoot.host.clientWidth}x${this.shadowRoot.host.clientHeight}`;this._dimensionElement.innerText!==t&&(this._dimensionElement.innerText=t)}}this.dispatchEvent(new CustomEvent("frame",{detail:{now:e,prevTime:this._prevAnimationFrameTime,deltaTime:s,canvas:this._canvasElement},bubbles:!1,composed:!0}))}pause(){cancelAnimationFrame(this._animationRequestHandle)}resume(){this._animationRequestHandle=requestAnimationFrame(this.update)}updateCanvasSize(){let e=this.shadowRoot.host.getBoundingClientRect();const s=e.width,i=e.height;let n=this._canvasElement,o=this._width,l=this._height;const a=this.mode;if("stretch"===a)o=s,l=i;else if(a!==t){if(s<o||i<l||"fit"===a){let t=s/o,e=i/l;t<e?(o=s,l*=t):(o*=e,l=i)}}o=Math.floor(o),l=Math.floor(l),n.clientWidth===o&&n.clientHeight===l||(n.width=this._width,n.height=this._height,n.style=`width: ${o}px; height: ${l}px`,this.dispatchEvent(new CustomEvent("resize",{detail:{width:o,height:l},bubbles:!1,composed:!0})))}}window.customElements.define("display-port",e);const s=1,i=2,n=3,o={NULL:0,DOWN:1,UP:2,MOVE:3,parse(t){if("string"!=typeof t)return o.NULL;switch(t.toLowerCase()){case"down":return o.DOWN;case"up":return o.UP;case"move":return o.MOVE;default:return o.NULL}}},l="*";class a{constructor(t,e){this.deviceName=t,this.eventTarget=e,this.listeners={}}destroy(){this.listeners={}}addInputListener(t,e){let s=this.listeners[t];s?s.push(e):(s=[e],this.listeners[t]=s)}removeInputListener(t,e){let s=this.listeners[t];s&&(s.indexOf(e),s.splice(e,1))}dispatchInput(t){const{keyCode:e}=t,s=this.listeners[e];let i=!1;if(s){for(let e of s)i|=e(t);return i}for(let e of this.listeners["*"])i|=e(t);return i}}class r{static createAdapter(t,e,s,i,n,o){return{target:t,adapterId:e,deviceName:s,keyCode:i,scale:n,eventCode:o}}constructor(){this.adapters={"*":h()}}add(t){for(let e of t){const{deviceName:t,keyCode:s}=e;let i;t in this.adapters?i=this.adapters[t]:(i=h(),this.adapters[t]=i),s in i?i[s].push(e):i[s]=[e]}}delete(t){for(let e of t){const{deviceName:t,keyCode:s}=e;if(t in this.adapters){let i=this.adapters[t];if(s in i){let t=i[s],n=t.indexOf(e);n>=0&&t.splice(n,1)}}}}clear(){for(let t in this.adapters)this.adapters[t]=h()}poll(t,e,s){const i=this.findAdapters(t,e);for(let t of i){const e=t.eventCode;if(e===o.NULL){const{target:e,scale:i}=t,n=s.value*i;e.poll(n,t)}else{const{target:i,scale:n}=t,o=s.getEvent(e)*n;i.poll(o,t)}}return i.length>0}update(t,e,s){let i=!1;for(let n of this.findAdapters(t,e)){const t=n.eventCode;if(t!==o.NULL){const{target:e,scale:o}=n,l=s.getEvent(t)*o;e.update(l,n),i=!0}}return i}reset(t,e,s){let i=!1;for(let s of this.findAdapters(t,e))s.target.reset(),i=!0;return i}findAdapters(t,e){let s=[];if(t in this.adapters){let i=this.adapters[t];e in i&&s.push(...i[e]),s.push(...i["*"])}let i=this.adapters["*"];return e in i&&s.push(...i[e]),s.push(...i["*"]),s}}function h(){return{[l]:[]}}class d{constructor(){this.value=0}update(t){this.value=t}poll(){this.value=0}getEvent(t){return 0}getState(){return this.value}}class u extends d{constructor(){super(),this.update=this.update.bind(this),this.adapters=[],this.values=[],this.next={values:[],value:0}}hydrate(t){Array.isArray(t)||(t=[t]);let e=[],s=0;for(let i of t){"string"==typeof i&&(i={key:i});const{key:t,scale:n=1,event:l="null"}=i,{deviceName:a,keyCode:h}=c(t),d=o.parse(l),u=Number(n);let p=r.createAdapter(this,s,a,h,u,d);e.push(p),++s}this.adapters=e,this.values=new Array(e.length).fill(0),this.next={values:new Array(e.length).fill(0),value:0}}poll(t,e){const s=e.adapterId;let i=this.values[s];this.values[s]=t,this.value=this.value-i+t,this.next.values[s]=0,this.next.value+=t-i}update(t,e){const s=e.adapterId;let i=this.next.values[s];this.next.values[s]=t,this.next.value+=t-i}reset(){this.values.fill(0),this.value=0,this.next.values.fill(0),this.next.value=0}}function c(t){let e=t.indexOf(":");if(e>=0)return{deviceName:t.substring(0,e),keyCode:t.substring(e+1)};throw new Error("Invalid key string - missing device separator ':'.")}function p(t,e){return`${t}:${e}`}class m extends a{constructor(t,e={}){super("Keyboard",t);const{repeat:i=!1}=e;this.repeat=i,this._eventObject={target:t,deviceName:this.deviceName,keyCode:"",event:o.NULL,type:s,value:0,control:!1,shift:!1,alt:!1},this.onKeyDown=this.onKeyDown.bind(this),this.onKeyUp=this.onKeyUp.bind(this),t.addEventListener("keydown",this.onKeyDown),t.addEventListener("keyup",this.onKeyUp)}destroy(){let t=this.eventTarget;t.removeEventListener("keydown",this.onKeyDown),t.removeEventListener("keyup",this.onKeyUp),super.destroy()}onKeyDown(t){if(t.repeat)return t.preventDefault(),t.stopPropagation(),!1;let e=this._eventObject;return e.keyCode=t.code,e.event=o.DOWN,e.value=1,e.control=t.ctrlKey,e.shift=t.shiftKey,e.alt=t.altKey,this.dispatchInput(e)?(t.preventDefault(),t.stopPropagation(),!1):void 0}onKeyUp(t){let e=this._eventObject;if(e.keyCode=t.code,e.event=o.UP,e.value=1,e.control=t.ctrlKey,e.shift=t.shiftKey,e.alt=t.altKey,this.dispatchInput(e))return t.preventDefault(),t.stopPropagation(),!1}}class b extends a{constructor(t,e={eventsOnFocus:!0}){super("Mouse",t),this.canvasTarget=t instanceof HTMLCanvasElement&&t||t.canvas||t.querySelector("canvas")||t.shadowRoot&&t.shadowRoot.querySelector("canvas")||t,this.eventsOnFocus=e.eventsOnFocus,this._downHasFocus=!1,this._eventObject={target:t,deviceName:this.deviceName,keyCode:"",event:o.NULL,type:s,value:0,control:!1,shift:!1,alt:!1},this._positionObject={target:t,deviceName:this.deviceName,keyCode:"Position",event:o.MOVE,type:i,x:0,y:0,dx:0,dy:0},this._wheelObject={target:t,deviceName:this.deviceName,keyCode:"Wheel",event:o.MOVE,type:n,dx:0,dy:0,dz:0},this.onMouseDown=this.onMouseDown.bind(this),this.onMouseUp=this.onMouseUp.bind(this),this.onMouseMove=this.onMouseMove.bind(this),this.onContextMenu=this.onContextMenu.bind(this),this.onWheel=this.onWheel.bind(this),t.addEventListener("mousedown",this.onMouseDown),t.addEventListener("contextmenu",this.onContextMenu),t.addEventListener("wheel",this.onWheel),document.addEventListener("mousemove",this.onMouseMove),document.addEventListener("mouseup",this.onMouseUp)}destroy(){let t=this.eventTarget;t.removeEventListener("mousedown",this.onMouseDown),t.removeEventListener("contextmenu",this.onContextMenu),t.removeEventListener("wheel",this.onWheel),document.removeEventListener("mousemove",this.onMouseMove),document.removeEventListener("mouseup",this.onMouseUp),super.destroy()}setPointerLock(t=!0){t?this.eventTarget.requestPointerLock():this.eventTarget.exitPointerLock()}hasPointerLock(){return document.pointerLockElement===this.eventTarget}onMouseDown(t){this._downHasFocus=!0;let e=this._eventObject;if(e.keyCode="Button"+t.button,e.event=o.DOWN,e.value=1,e.control=t.ctrlKey,e.shift=t.shiftKey,e.alt=t.altKey,this.dispatchInput(e)&&document.activeElement===this.eventTarget)return t.preventDefault(),t.stopPropagation(),!1}onContextMenu(t){return t.preventDefault(),t.stopPropagation(),!1}onWheel(t){let e=this._wheelObject;switch(t.deltaMode){case WheelEvent.DOM_DELTA_LINE:e.dx=10*t.deltaX,e.dy=10*t.deltaY,e.dz=10*t.deltaZ;break;case WheelEvent.DOM_DELTA_PAGE:e.dx=100*t.deltaX,e.dy=100*t.deltaY,e.dz=100*t.deltaZ;break;case WheelEvent.DOM_DELTA_PIXEL:default:e.dx=t.deltaX,e.dy=t.deltaY,e.dz=t.deltaZ}if(this.dispatchInput(e))return t.preventDefault(),t.stopPropagation(),!1}onMouseUp(t){if(!this._downHasFocus)return;this._downHasFocus=!1;let e=this._eventObject;return e.keyCode="Button"+t.button,e.event=o.UP,e.value=1,e.control=t.ctrlKey,e.shift=t.shiftKey,e.alt=t.altKey,this.dispatchInput(e)?(t.preventDefault(),t.stopPropagation(),!1):void 0}onMouseMove(t){if(this.eventsOnFocus&&document.activeElement!==this.eventTarget)return;const e=this.canvasTarget,{clientWidth:s,clientHeight:i}=e,n=e.getBoundingClientRect();let o=t.movementX/s,l=t.movementY/i,a=(t.clientX-n.left)/s,r=(t.clientY-n.top)/i,h=this._positionObject;h.x=a,h.y=r,h.dx=o,h.dy=l,this.dispatchInput(h)}}class f extends d{constructor(){super(),this.delta=0,this.next={delta:0}}update(t,e){this.value=t,this.next.delta+=e}poll(){this.delta=this.next.delta,this.next.delta=0}getEvent(t){switch(t){case o.MOVE:return this.delta;default:return super.getEvent(t)}}}class v extends d{constructor(){super(),this.down=!1,this.up=!1,this.next={down:!1,up:!1}}update(t){t?this.next.down=!0:this.next.up=!0}poll(){const{up:t,down:e}=this.next;this.value?this.up&&!t&&(this.value=0):e&&(this.value=1),this.down=e,this.up=t,this.next.down=!1,this.next.up=!1}getEvent(t){switch(t){case o.DOWN:return 1&this.down;case o.UP:return 1&this.up;default:return super.getEvent(t)}}}const g=1,y=2;const _=Symbol("inputSource");class E{static for(t){if(Object.prototype.hasOwnProperty.call(t,_))return t[_];{let e=new E([new m(t),new b(t)]);return Object.defineProperty(t,_,{value:e}),e}}constructor(t){this.onInputEvent=this.onInputEvent.bind(this);let e={},s={};for(let i of t){const t=i.deviceName;e[t]=i,s[t]={},i.addInputListener(l,this.onInputEvent)}this.devices=e,this.inputs=s,this.listeners={poll:[],update:[]},this._autopoll=!1,this._animationFrameHandle=null,this.onAnimationFrame=this.onAnimationFrame.bind(this)}set autopoll(t){this._autopoll=t,t?this._animationFrameHandle=requestAnimationFrame(this.onAnimationFrame):cancelAnimationFrame(this._animationFrameHandle)}get autopoll(){return this._autopoll}destroy(){this.clear();for(let t in this.devices){let e=this.devices[t];e.removeInputListener(l,this.onInputEvent),e.destroy()}}addEventListener(t,e){t in this.listeners?this.listeners[t].unshift(e):this.listeners[t]=[e]}removeEventListener(t,e){if(t in this.listeners){let s=this.listeners[t],i=s.indexOf(e);s.splice(i,1)}}dispatchEvent(t,e){for(let s of this.listeners[t])s(e)}_dispatchInputEvent(t,e,s,i){this.dispatchEvent("input",{stage:t,deviceName:e,keyCode:s,input:i})}_dispatchPollEvent(t){this.dispatchEvent("poll",{now:t})}poll(t=performance.now()){for(const t in this.inputs){const e=this.inputs[t];for(const s in e){let i=e[s];i.poll(),this._dispatchInputEvent(y,t,s,i)}}this._dispatchPollEvent(t)}onAnimationFrame(t){this._autopoll&&(this._animationFrameHandle=requestAnimationFrame(this.onAnimationFrame),this.poll(t))}onInputEvent(t){const e=t.deviceName;switch(t.type){case s:{const s=t.keyCode;let i=this.inputs[e][s];if(i)return i.update(t.event===o.DOWN),this._dispatchInputEvent(g,e,s,i),!0}break;case i:{let s=this.inputs[e],i=s.PosX;i&&(i.update(t.x,t.dx),this._dispatchInputEvent(g,e,"PosX",i));let n=s.PosY;n&&(n.update(t.y,t.dy),this._dispatchInputEvent(g,e,"PosY",n))}break;case n:{let s=this.inputs[e],i=s.WheelX;i&&(i.update(t.dx,t.dx),this._dispatchInputEvent(g,e,"WheelX",i));let n=s.WheelY;n&&(n.update(t.dy,t.dy),this._dispatchInputEvent(g,e,"WheelY",n));let o=s.WheelZ;o&&(o.update(t.dz,t.dz),this._dispatchInputEvent(g,e,"WheelZ",o))}}}add(t,e){if(!(t in this.devices))throw new Error("Invalid device name - missing device with name in source.");let s=function(t,e){return"Mouse"===t&&("PosX"===e||"PosY"===e||"WheelX"===e||"WheelY"===e||"WheelZ"===e)}(t,e)?new f:new v;return this.inputs[t][e]=s,this}delete(t,e){delete this.inputs[t][e]}get(t,e){return this.inputs[t][e]}has(t,e){return t in this.inputs&&e in this.inputs[t]}clear(){for(let t in this.devices)this.inputs[t]={}}}class w{constructor(t={}){const{disabled:e=!0}=t;this.source=null,this._disabled=e,this._ignoreInput=e,this.adapters=new r,this.inputs={},this.onSourceInput=this.onSourceInput.bind(this),this.onSourcePoll=this.onSourcePoll.bind(this)}get disabled(){return this._disabled}set disabled(t){this.toggle(!t)}setInputMap(t){return this._setupInputs(this.source,t),this}attach(t){return this._setupInputs(t,null),this.toggle(!0),this}detach(){return this.toggle(!1),this._setupInputs(null,null),this}_setupInputs(t,e){const s=this.disabled;this.disabled=!0;const i=this.source,n=this.inputs,o=i!==t&&i,l=this.inputs&&e;if(o||l){o&&(i.removeEventListener("poll",this.onSourcePoll),i.removeEventListener("input",this.onSourceInput));for(let t in n){let{adapters:e}=n[t];for(let t of e){const{deviceName:e,keyCode:s}=t;0===L(i,e,s)&&i.delete(e,s)}}l&&(this.adapters.clear(),this.inputs={})}if(e){let t={};for(let s in e){let i=e[s],o=n[s]||new u;o.hydrate(i);let l=o.adapters;this.adapters.add(l),t[s]=o}this.inputs=t}if(t){!function(t){S in t||(t[S]={})}(t);const e=this.inputs;for(let s in e){let{adapters:i}=e[s];for(let e of i){const{deviceName:s,keyCode:i}=e;1===x(t,s,i)&&t.add(s,i)}}this.source!==t&&(t.addEventListener("poll",this.onSourcePoll),t.addEventListener("input",this.onSourceInput),this.source=t)}this.disabled=s}onSourceInput(t){if(t.consumed||this._ignoreInput){const{deviceName:e,keyCode:s,input:i}=t;this.adapters.reset(e,s,i)}else{const{stage:e,deviceName:s,keyCode:i,input:n}=t;switch(e){case y:this.adapters.poll(s,i,n);break;case g:this.adapters.update(s,i,n)}t.consumed=!0}}onSourcePoll(t){this._ignoreInput!==this.disabled&&(this._ignoreInput=this.disabled)}toggle(t=this._disabled){if(t){if(!this.source)throw new Error("Input source must be set before enabling input context.");Object.keys(this.inputs).length<=0&&console.warn("No inputs found for enabled input context - did you forget to setInputMap()?")}return this._disabled=!t,this}getInput(t){if(t in this.inputs)return this.inputs[t];{let e=new u;return this.inputs[t]=e,e}}hasInput(t){return t in this.inputs&&this.inputs[t].adapters.length>0}getInputValue(t){return t in this.inputs?this.inputs[t].value:0}}const S=Symbol("inputRefCounts");function x(t,e,s){const i=p(e,s);let n=t[S],o=n[i]+1||1;return n[i]=o,o}function L(t,e,s){const i=p(e,s);let n=t[S],o=n[i]-1||0;return n[i]=Math.max(o,0),o}class k extends HTMLElement{static get[Symbol.for("cuttleTemplate")](){let t=document.createElement("template");return t.innerHTML='<kbd>\n    <span id="key"><slot></slot></span>\n    <span id="value" class="hidden"></span>\n</kbd>\n',Object.defineProperty(this,Symbol.for("cuttleTemplate"),{value:t}),t}static get[Symbol.for("cuttleStyle")](){let t=document.createElement("style");return t.innerHTML='kbd{position:relative;display:inline-block;border-radius:3px;border:1px solid #888;font-size:.85em;font-weight:700;text-rendering:optimizeLegibility;line-height:12px;height:14px;padding:2px 4px;color:#444;background-color:#eee;box-shadow:inset 0 -3px 0 #aaa;overflow:hidden}kbd:empty:after{content:"<?>";opacity:.6}.disabled{opacity:.6;box-shadow:none;background-color:#aaa}.hidden{display:none}#value{position:absolute;top:0;bottom:0;right:0;font-size:.85em;padding:2px 4px 0;color:#ccc;background-color:#333;box-shadow:inset 0 3px 0 #222}',Object.defineProperty(this,Symbol.for("cuttleStyle"),{value:t}),t}static get properties(){return{name:String,value:String,disabled:Boolean}}get disabled(){return this._disabled}set disabled(t){this.toggleAttribute("disabled",t)}get value(){return this._value}set value(t){this.setAttribute("value",t)}get name(){return this._name}set name(t){this.setAttribute("name",t)}constructor(){super(),this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(this.constructor[Symbol.for("cuttleTemplate")].content.cloneNode(!0)),this.shadowRoot.appendChild(this.constructor[Symbol.for("cuttleStyle")].cloneNode(!0)),this._keyboardElement=this.shadowRoot.querySelector("kbd"),this._keyElement=this.shadowRoot.querySelector("#key"),this._valueElement=this.shadowRoot.querySelector("#value")}attributeChangedCallback(t,e,s){switch(t){case"name":this._name=s;break;case"value":this._value=s;break;case"disabled":this._disabled=null!==s}((t,e,s)=>{switch(t){case"name":this._keyElement.innerText=s;break;case"value":null!==s?(this._valueElement.classList.toggle("hidden",!1),this._valueElement.innerText=s,this._keyboardElement.style.paddingRight=`${this._valueElement.clientWidth+4}px`):this._valueElement.classList.toggle("hidden",!0);break;case"disabled":this._keyboardElement.classList.toggle("disabled",null!==s)}})(t,0,s)}connectedCallback(){if(Object.prototype.hasOwnProperty.call(this,"name")){let t=this.name;delete this.name,this.name=t}if(Object.prototype.hasOwnProperty.call(this,"value")){let t=this.value;delete this.value,this.value=t}if(Object.prototype.hasOwnProperty.call(this,"disabled")){let t=this.disabled;delete this.disabled,this.disabled=t}}static get observedAttributes(){return["name","value","disabled"]}}window.customElements.define("input-key",k);class C extends HTMLElement{static get[Symbol.for("cuttleTemplate")](){let t=document.createElement("template");return t.innerHTML='<table>\n    <thead>\n        <tr class="tableHeader">\n            <th colspan=4>\n                <slot id="title">input-map</slot>\n            </th>\n        </tr>\n        <tr class="colHeader">\n            <th>name</th>\n            <th>key</th>\n            <th>mod</th>\n            <th>value</th>\n        </tr>\n    </thead>\n    <tbody>\n    </tbody>\n</table>\n',Object.defineProperty(this,Symbol.for("cuttleTemplate"),{value:t}),t}static get[Symbol.for("cuttleStyle")](){let t=document.createElement("style");return t.innerHTML=":host{display:block}table{border-collapse:collapse}table,td,th{border:1px solid #666}td,th{padding:5px 10px}td{text-align:center}thead th{padding:0}.colHeader>th{font-size:.8em;padding:0 10px;letter-spacing:3px;background-color:#aaa;color:#666}.colHeader>th,output{font-family:monospace}output{border-radius:.3em;padding:3px}tr:not(.primary) .name,tr:not(.primary) .value{opacity:.3}tr:nth-child(2n){background-color:#eee}",Object.defineProperty(this,Symbol.for("cuttleStyle"),{value:t}),t}static get customEvents(){return["load"]}get onload(){return this._onload}set onload(t){this._onload&&this.removeEventListener("load",this._onload),this._onload=t,this._onload&&this.addEventListener("load",t)}static get observedAttributes(){return["onload","src","id","class"]}constructor(){super(),this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(this.constructor[Symbol.for("cuttleTemplate")].content.cloneNode(!0)),this.shadowRoot.appendChild(this.constructor[Symbol.for("cuttleStyle")].cloneNode(!0)),this._src="",this._inputMap=null,this._tableElements={},this._titleElement=this.shadowRoot.querySelector("#title"),this._bodyElement=this.shadowRoot.querySelector("tbody"),this._children=this.shadowRoot.querySelector("slot")}get map(){return this._inputMap}get mapElements(){return this._tableElements}connectedCallback(){if(Object.prototype.hasOwnProperty.call(this,"onload")){let t=this.onload;delete this.onload,this.onload=t}!function(t,e){if(Object.prototype.hasOwnProperty.call(t,e)){let s=t[e];delete t[e],t[e]=s}}(this,"src")}attributeChangedCallback(t,e,s){switch(t){case"onload":this.onload=new Function("event","with(document){with(this){"+s+"}}").bind(this)}((t,e,s)=>{switch(t){case"src":if(this._src!==s)if(this._src=s,s.trim().startsWith("{")){let t=JSON.parse(s);this._setInputMap(t)}else fetch(s).then((t=>t.json())).then((t=>this._setInputMap(t)));break;case"id":case"class":this._titleElement.innerHTML=`input-port${this.className?"."+this.className:""}${this.hasAttribute("id")?"#"+this.getAttribute("id"):""}`}})(t,0,s)}get src(){return this.getAttribute("src")}set src(t){switch(typeof t){case"object":{let e=JSON.stringify(t);this._src=e,this._setInputMap(t),this.setAttribute("src",e)}break;case"string":this.setAttribute("src",t);break;default:this.setAttribute("src",JSON.stringify(t))}}_setInputMap(t){let e={},s=[];for(let i in t){let n=[];O(n,i,t[i]),e[i]=n,s.push(...n)}this._bodyElement.innerHTML="";for(let t of s)this._bodyElement.appendChild(t);this._inputMap=t,this._tableElements=e,this.dispatchEvent(new CustomEvent("load",{bubbles:!1,composed:!0,detail:{map:t}}))}}function O(t,e,s){if(Array.isArray(s)){O(t,e,s[0]);let i=s.length;for(let n=1;n<i;++n)t.push(M(e,s[n],!1))}else t.push(M(e,s,!0));return t}function M(t,e,s=!0){if("object"==typeof e){const{key:i,event:n,scale:o}=e;return P(t,i,n,o,0,s)}return P(t,e,null,1,0,s)}function P(t,e,s,i,n,o=!0){let l=document.createElement("tr");o&&l.classList.add("primary");{let e=document.createElement("td");e.textContent=t,e.classList.add("name"),l.appendChild(e)}{let t=document.createElement("td");t.classList.add("key");let s=new k;s.innerText=e,t.appendChild(s),l.appendChild(t)}{let t=document.createElement("td"),e=document.createElement("samp"),n=[];"string"==typeof s&&"null"!==s&&n.push(s),"number"==typeof i&&1!==i&&n.push(`×(${i.toFixed(2)})`),e.innerText=n.join(" "),t.classList.add("mod"),t.appendChild(e),l.appendChild(t)}{let t=document.createElement("td"),e=document.createElement("output");e.innerText=Number(n).toFixed(2),e.classList.add("value"),t.appendChild(e),l.appendChild(t)}return l}window.customElements.define("input-map",C);class T extends HTMLElement{static get[Symbol.for("cuttleTemplate")](){let t=document.createElement("template");return t.innerHTML='<div class="hidden">\n    <label id="title">\n        input-source\n    </label>\n    <span>|</span>\n    <p>\n        <label for="poll">poll</label>\n        <output id="poll"></output>\n    </p>\n    <p>\n        <label for="focus">focus</label>\n        <output id="focus"></output>\n    </p>\n</div>\n',Object.defineProperty(this,Symbol.for("cuttleTemplate"),{value:t}),t}static get[Symbol.for("cuttleStyle")](){let t=document.createElement("style");return t.innerHTML=':host{display:inline-block}.hidden{display:none}div{font-family:monospace;color:#666;outline:1px solid #666;padding:4px}p{display:inline;margin:0;padding:0}#focus:empty:after,#poll:empty:after{content:"✗";color:red}',Object.defineProperty(this,Symbol.for("cuttleStyle"),{value:t}),t}static get properties(){return{for:String,autopoll:Boolean,debug:Boolean}}get debug(){return this._debug}set debug(t){this.toggleAttribute("debug",t)}get autopoll(){return this._autopoll}set autopoll(t){this.toggleAttribute("autopoll",t)}get for(){return this._for}set for(t){this.setAttribute("for",t)}static get customEvents(){return["input","poll"]}get onpoll(){return this._onpoll}set onpoll(t){this._onpoll&&this.removeEventListener("poll",this._onpoll),this._onpoll=t,this._onpoll&&this.addEventListener("poll",t)}get oninput(){return this._oninput}set oninput(t){this._oninput&&this.removeEventListener("input",this._oninput),this._oninput=t,this._oninput&&this.addEventListener("input",t)}static get observedAttributes(){return["oninput","onpoll","for","autopoll","debug","id","class"]}constructor(){super(),this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(this.constructor[Symbol.for("cuttleTemplate")].content.cloneNode(!0)),this.shadowRoot.appendChild(this.constructor[Symbol.for("cuttleStyle")].cloneNode(!0)),this._containerElement=this.shadowRoot.querySelector("div"),this._titleElement=this.shadowRoot.querySelector("#title"),this._pollElement=this.shadowRoot.querySelector("#poll"),this._focusElement=this.shadowRoot.querySelector("#focus"),this._pollCount=0,this._pollCountDelay=0,this._sourceElement=null,this._inputSource=null,this.onSourceInput=this.onSourceInput.bind(this),this.onSourcePoll=this.onSourcePoll.bind(this),this.onSourceFocus=this.onSourceFocus.bind(this),this.onSourceBlur=this.onSourceBlur.bind(this)}get source(){return this._inputSource}poll(){this._inputSource.poll()}connectedCallback(){if(Object.prototype.hasOwnProperty.call(this,"oninput")){let t=this.oninput;delete this.oninput,this.oninput=t}if(Object.prototype.hasOwnProperty.call(this,"onpoll")){let t=this.onpoll;delete this.onpoll,this.onpoll=t}if(Object.prototype.hasOwnProperty.call(this,"for")){let t=this.for;delete this.for,this.for=t}if(Object.prototype.hasOwnProperty.call(this,"autopoll")){let t=this.autopoll;delete this.autopoll,this.autopoll=t}if(Object.prototype.hasOwnProperty.call(this,"debug")){let t=this.debug;delete this.debug,this.debug=t}this.hasAttribute("tabindex")||this.setAttribute("tabindex",0),this.hasAttribute("for")||this._setSourceElement(this)}disconnectedCallback(){this._clearSourceElement()}attributeChangedCallback(t,e,s){switch(t){case"for":this._for=s;break;case"autopoll":this._autopoll=null!==s;break;case"debug":this._debug=null!==s;break;case"oninput":this.oninput=new Function("event","with(document){with(this){"+s+"}}").bind(this);break;case"onpoll":this.onpoll=new Function("event","with(document){with(this){"+s+"}}").bind(this)}((t,e,s)=>{switch(t){case"for":this._setSourceElement(s?document.getElementById(s):this);break;case"id":case"class":{let t=this.className?"."+this.className:"",e=this.hasAttribute("id")?"#"+this.getAttribute("id"):"";this._titleElement.innerHTML=t+e}break;case"debug":this._containerElement.classList.toggle("hidden",s)}})(t,0,s)}onSourceInput(t){this.dispatchEvent(new CustomEvent("input",{composed:!0,bubbles:!1,detail:t}))}onSourcePoll(t){const{now:e}=t;if(this._pollCount+=1,this.dispatchEvent(new CustomEvent("poll",{composed:!0,bubbles:!1})),this.debug){e-this._pollCountDelay>1e3&&(this._pollCountDelay=e,this._pollCount>0?(this._pollElement.innerText="✓",this._pollCount=0):this._pollElement.innerText="")}}onSourceFocus(){this._focusElement.innerText="✓"}onSourceBlur(){this._focusElement.innerText=""}_clearSourceElement(){if(this._inputSource){let t=this._inputSource,e=this._sourceElement;this._inputSource=null,this._sourceElement=null,e.removeEventListener("focus",this.onSourceFocus),e.removeEventListener("blur",this.onSourceBlur),t.destroy()}}_setSourceElement(t){if(this._clearSourceElement(),!t)throw new Error("Event target not found.");let e=E.for(t);e.addEventListener("input",this.onSourceInput),e.addEventListener("poll",this.onSourcePoll),t.addEventListener("focus",this.onSourceFocus),t.addEventListener("blur",this.onSourceBlur),this._sourceElement=t,this._inputSource=e}}window.customElements.define("input-source",T);class I extends HTMLElement{static get[Symbol.for("cuttleTemplate")](){let t=document.createElement("template");return t.innerHTML='<input-map class="hidden">\n    <slot></slot>\n    <input-source debug></input-source>\n</input-map>\n',Object.defineProperty(this,Symbol.for("cuttleTemplate"),{value:t}),t}static get[Symbol.for("cuttleStyle")](){let t=document.createElement("style");return t.innerHTML=":host{display:inline-block}.hidden{display:none}",Object.defineProperty(this,Symbol.for("cuttleStyle"),{value:t}),t}static get properties(){return{for:String,disabled:Boolean,debug:Boolean}}get debug(){return this._debug}set debug(t){this.toggleAttribute("debug",t)}get disabled(){return this._disabled}set disabled(t){this.toggleAttribute("disabled",t)}get for(){return this._for}set for(t){this.setAttribute("for",t)}static get observedAttributes(){return["for","disabled","debug","src","id","class"]}constructor(){super(),this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(this.constructor[Symbol.for("cuttleTemplate")].content.cloneNode(!0)),this.shadowRoot.appendChild(this.constructor[Symbol.for("cuttleStyle")].cloneNode(!0)),this._inputContext=new w,this._mapElement=this.shadowRoot.querySelector("input-map"),this._sourceElement=this.shadowRoot.querySelector("input-source"),this.onInputMapLoad=this.onInputMapLoad.bind(this),this.onInputSourcePoll=this.onInputSourcePoll.bind(this),this._mapElement.addEventListener("load",this.onInputMapLoad),this._sourceElement.addEventListener("poll",this.onInputSourcePoll)}get context(){return this._inputContext}get source(){return this._sourceElement.source}get map(){return this._mapElement.map}onInputMapLoad(){let t=this._sourceElement.source,e=this._mapElement.map;t&&e&&(this._inputContext.setInputMap(e).attach(t),this._inputContext.disabled=this._disabled)}onInputSourcePoll(){for(let[t,e]of Object.entries(this._mapElement.mapElements)){let s=this._inputContext.getInputValue(t);e[0].querySelector("output").innerText=Number(s).toFixed(2)}}connectedCallback(){if(Object.prototype.hasOwnProperty.call(this,"for")){let t=this.for;delete this.for,this.for=t}if(Object.prototype.hasOwnProperty.call(this,"disabled")){let t=this.disabled;delete this.disabled,this.disabled=t}if(Object.prototype.hasOwnProperty.call(this,"debug")){let t=this.debug;delete this.debug,this.debug=t}!function(t,e){if(Object.prototype.hasOwnProperty.call(t,e)){let s=t[e];delete t[e],t[e]=s}}(this,"src")}attributeChangedCallback(t,e,s){switch(t){case"for":this._for=s;break;case"disabled":this._disabled=null!==s;break;case"debug":this._debug=null!==s}((t,e,s)=>{switch(t){case"for":{this._sourceElement.for=s;let t=this._sourceElement.source,e=this._mapElement.map;e&&(this._inputContext.setInputMap(e).attach(t),this._inputContext.disabled=this._disabled)}break;case"src":this._mapElement.src=s;break;case"disabled":{let t=this._sourceElement.source,e=this._mapElement.map;t&&e&&(this._inputContext.disabled=this._disabled)}break;case"debug":this._mapElement.classList.toggle("hidden",null===s);break;case"id":this._sourceElement.id=s;break;case"class":this._sourceElement.className=s}})(t,0,s)}get src(){return this._mapElement.src}set src(t){this._mapElement.src=t}}window.customElements.define("input-context",I),window.addEventListener("DOMContentLoaded",(async function(){const t=document.querySelector("#main");document.querySelector("#input").source.autopoll=!0;const e=t.canvas.getContext("2d");t.addEventListener("frame",(({deltaTime:s})=>{e.fillStyle="black",e.fillRect(0,0,t.width,t.height)}))}))}();
