!function(){"use strict";const t="noscale";class e extends HTMLElement{static get[Symbol.for("cuttleTemplate")](){let t=document.createElement("template");return t.innerHTML='<div class="container">\r\n    <label class="hidden" id="title">display-port</label>\r\n    <label class="hidden" id="fps">00</label>\r\n    <label class="hidden" id="dimension">0x0</label>\r\n    <canvas></canvas>\r\n    <slot></slot>\r\n</div>',Object.defineProperty(this,Symbol.for("cuttleTemplate"),{value:t}),t}static get[Symbol.for("cuttleStyle")](){let t=document.createElement("style");return t.innerHTML=":host{display:inline-block;color:#555}.container{display:flex;position:relative;width:100%;height:100%}canvas{background:#000;margin:auto;-ms-interpolation-mode:nearest-neighbor;image-rendering:-moz-crisp-edges;image-rendering:pixelated}label{font-family:monospace;color:currentColor;position:absolute}#title{left:.5rem;top:.5rem}#fps{right:.5rem;top:.5rem}#dimension{left:.5rem;bottom:.5rem}.hidden{display:none}:host([debug]) .container{outline:6px dashed rgba(0,0,0,.1);outline-offset:-4px;background-color:rgba(0,0,0,.1)}:host([mode=noscale]) canvas{margin:0;top:0;left:0}:host([mode=center]),:host([mode=fit]),:host([mode=stretch]){width:100%;height:100%}:host([full]){width:100vw!important;height:100vh!important}:host([disabled]){display:none}slot{display:flex;flex-direction:column;align-items:center;justify-content:center;position:absolute;width:100%;height:100%;top:0;left:0;pointer-events:none}::slotted(*){pointer-events:auto}",Object.defineProperty(this,Symbol.for("cuttleStyle"),{value:t}),t}static get observedAttributes(){return["onframe","width","height","disabled","debug","id","class"]}static get properties(){return{width:Number,height:Number,disabled:Boolean,debug:Boolean,mode:{type:String,value:"fit",observed:!1}}}get mode(){return this.getAttribute("mode")}set mode(t){this.setAttribute("mode",t)}get debug(){return this._debug}set debug(t){this.toggleAttribute("debug",t)}get disabled(){return this._disabled}set disabled(t){this.toggleAttribute("disabled",t)}get height(){return this._height}set height(t){this.setAttribute("height",String(t))}get width(){return this._width}set width(t){this.setAttribute("width",String(t))}static get customEvents(){return["frame"]}get onframe(){return this._onframe}set onframe(t){this._onframe&&this.removeEventListener("frame",this._onframe),this._onframe=t,this._onframe&&this.addEventListener("frame",t)}constructor(){super(),this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(this.constructor[Symbol.for("cuttleTemplate")].content.cloneNode(!0)),this.shadowRoot.appendChild(this.constructor[Symbol.for("cuttleStyle")].cloneNode(!0)),this._canvasElement=this.shadowRoot.querySelector("canvas"),this._titleElement=this.shadowRoot.querySelector("#title"),this._fpsElement=this.shadowRoot.querySelector("#fps"),this._dimensionElement=this.shadowRoot.querySelector("#dimension"),this._animationRequestHandle=0,this._prevAnimationFrameTime=0,this._width=300,this._height=150,this.update=this.update.bind(this)}get canvas(){return this._canvasElement}connectedCallback(){if(Object.prototype.hasOwnProperty.call(this,"onframe")){let t=this.onframe;delete this.onframe,this.onframe=t}if(Object.prototype.hasOwnProperty.call(this,"width")){let t=this.width;delete this.width,this.width=t}if(Object.prototype.hasOwnProperty.call(this,"height")){let t=this.height;delete this.height,this.height=t}if(Object.prototype.hasOwnProperty.call(this,"disabled")){let t=this.disabled;delete this.disabled,this.disabled=t}if(Object.prototype.hasOwnProperty.call(this,"debug")){let t=this.debug;delete this.debug,this.debug=t}if(Object.prototype.hasOwnProperty.call(this,"mode")){let t=this.mode;delete this.mode,this.mode=t}this.hasAttribute("mode")||this.setAttribute("mode","fit"),this.hasAttribute("tabindex")||this.setAttribute("tabindex",0),this.updateCanvasSize(),this.resume()}disconnectedCallback(){this.pause()}attributeChangedCallback(t,e,s){switch(t){case"width":this._width=Number(s);break;case"height":this._height=Number(s);break;case"disabled":this._disabled=null!==s;break;case"debug":this._debug=null!==s;break;case"onframe":this.onframe=new Function("event","with(document){with(this){"+s+"}}").bind(this)}((t,e,s)=>{switch(t){case"disabled":s?(this.update(0),this.pause()):this.resume();break;case"id":case"class":this._titleElement.innerHTML=`display-port${this.className?"."+this.className:""}${this.hasAttribute("id")?"#"+this.getAttribute("id"):""}`;break;case"debug":this._titleElement.classList.toggle("hidden",s),this._fpsElement.classList.toggle("hidden",s),this._dimensionElement.classList.toggle("hidden",s)}})(t,0,s)}pause(){cancelAnimationFrame(this._animationRequestHandle)}resume(){this._animationRequestHandle=requestAnimationFrame(this.update)}update(e){this._animationRequestHandle=requestAnimationFrame(this.update),this.updateCanvasSize();const s=e-this._prevAnimationFrameTime;if(this._prevAnimationFrameTime=e,this.debug){const e=s<=0?"--":String(Math.round(1e3/s)).padStart(2,"0");if(this._fpsElement.innerText!==e&&(this._fpsElement.innerText=e),this.mode===t){let t=`${this._width}x${this._height}`;this._dimensionElement.innerText!==t&&(this._dimensionElement.innerText=t)}else{let t=`${this._width}x${this._height}|${this.shadowRoot.host.clientWidth}x${this.shadowRoot.host.clientHeight}`;this._dimensionElement.innerText!==t&&(this._dimensionElement.innerText=t)}}this.dispatchEvent(new CustomEvent("frame",{detail:{now:e,prevTime:this._prevAnimationFrameTime,deltaTime:s,canvas:this._canvasElement},bubbles:!1,composed:!0}))}updateCanvasSize(){let e=this.shadowRoot.host.getBoundingClientRect();const s=e.width,i=e.height;let n=this._canvasElement,o=this._width,r=this._height;const a=this.mode;if("stretch"===a)o=s,r=i;else if(a!==t){if(s<o||i<r||"fit"===a){let t=s/o,e=i/r;t<e?(o=s,r*=t):(o*=e,r=i)}}o=Math.floor(o),r=Math.floor(r),n.clientWidth===o&&n.clientHeight===r||(n.width=this._width,n.height=this._height,n.style=`width: ${o}px; height: ${r}px`,this.dispatchEvent(new CustomEvent("resize",{detail:{width:o,height:r},bubbles:!1,composed:!0})))}}window.customElements.define("display-port",e);const s=1,i=2,n=3,o={NULL:0,DOWN:1,UP:2,MOVE:3,parse(t){if("string"!=typeof t)return o.NULL;switch(t.toLowerCase()){case"down":return o.DOWN;case"up":return o.UP;case"move":return o.MOVE;default:return o.NULL}}},r="*";class a{static isAxis(t){return!1}static isButton(t){return!1}constructor(t,e){this.deviceName=t,this.eventTarget=e,this.listeners={}}destroy(){this.listeners={}}addInputListener(t,e){let s=this.listeners[t];s?s.push(e):(s=[e],this.listeners[t]=s)}removeInputListener(t,e){let s=this.listeners[t];s&&(s.indexOf(e),s.splice(e,1))}dispatchInput(t){const{keyCode:e}=t,s=this.listeners[e];let i=!1;if(s){for(let e of s)i|=e(t);return i}for(let e of this.listeners["*"])i|=e(t);return i}}class l{static createAdapter(t,e,s,i,n,o){return{target:t,adapterId:e,deviceName:s,keyCode:i,scale:n,eventCode:o}}constructor(){this.adapters={"*":h()}}add(t){for(let e of t){const{deviceName:t,keyCode:s}=e;let i;t in this.adapters?i=this.adapters[t]:(i=h(),this.adapters[t]=i),s in i?i[s].push(e):i[s]=[e]}}delete(t){for(let e of t){const{deviceName:t,keyCode:s}=e;if(t in this.adapters){let i=this.adapters[t];if(s in i){let t=i[s],n=t.indexOf(e);n>=0&&t.splice(n,1)}}}}clear(){for(let t in this.adapters)this.adapters[t]=h()}poll(t,e,s){const i=this.findAdapters(t,e);for(let t of i){const e=t.eventCode;if(e===o.NULL){const{target:e,scale:i}=t,n=s.value*i;e.poll(n,t)}else{const{target:i,scale:n}=t,o=s.getEvent(e)*n;i.poll(o,t)}}return i.length>0}update(t,e,s){let i=!1;for(let n of this.findAdapters(t,e)){const t=n.eventCode;if(t!==o.NULL){const{target:e,scale:o}=n,r=s.getEvent(t)*o;e.update(r,n),i=!0}}return i}reset(t,e,s){let i=!1;for(let s of this.findAdapters(t,e))s.target.reset(),i=!0;return i}findAdapters(t,e){let s=[];if(t in this.adapters){let i=this.adapters[t];e in i&&s.push(...i[e]),s.push(...i["*"])}let i=this.adapters["*"];return e in i&&s.push(...i[e]),s.push(...i["*"]),s}}function h(){return{[r]:[]}}class d{constructor(){this.value=0}update(t){this.value=t}poll(){this.value=0}getEvent(t){return 0}getState(){return this.value}}class u extends d{constructor(){super(),this.update=this.update.bind(this),this.adapters=[],this.values=[],this.next={values:[],value:0}}hydrate(t){Array.isArray(t)||(t=[t]);let e=[],s=0;for(let i of t){"string"==typeof i&&(i={key:i});const{key:t,scale:n=1,event:r="null"}=i,{deviceName:a,keyCode:h}=c(t),d=o.parse(r),u=Number(n);let p=l.createAdapter(this,s,a,h,u,d);e.push(p),++s}this.adapters=e,this.values=new Array(e.length).fill(0),this.next={values:new Array(e.length).fill(0),value:0}}poll(t,e){const s=e.adapterId;let i=this.values[s];this.values[s]=t,this.value=this.value-i+t,this.next.values[s]=0,this.next.value+=t-i}update(t,e){const s=e.adapterId;let i=this.next.values[s];this.next.values[s]=t,this.next.value+=t-i}reset(){this.values.fill(0),this.value=0,this.next.values.fill(0),this.next.value=0}}function c(t){let e=t.indexOf(":");if(e>=0)return{deviceName:t.substring(0,e),keyCode:t.substring(e+1)};throw new Error("Invalid key string - missing device separator ':'.")}function p(t,e){return`${t}:${e}`}class m extends d{constructor(){super(),this.delta=0,this.next={delta:0}}update(t,e){this.value=t,this.next.delta+=e}poll(){this.delta=this.next.delta,this.next.delta=0}getEvent(t){switch(t){case o.MOVE:return this.delta;default:return super.getEvent(t)}}}class b extends d{constructor(){super(),this.down=!1,this.up=!1,this.next={down:!1,up:!1}}update(t){t?this.next.down=!0:this.next.up=!0}poll(){const{up:t,down:e}=this.next;this.value?this.up&&!t&&(this.value=0):e&&(this.value=1),this.down=e,this.up=t,this.next.down=!1,this.next.up=!1}getEvent(t){switch(t){case o.DOWN:return 1&this.down;case o.UP:return 1&this.up;default:return super.getEvent(t)}}}const v=1,y=2;class f{constructor(t){this.onInputEvent=this.onInputEvent.bind(this),this.onAnimationFrame=this.onAnimationFrame.bind(this);let e={},s={};for(let i of t){const t=i.deviceName;if(t in e)throw new Error(`Another device with name '${t}' already exists.`);e[t]=i,s[t]={},i.addInputListener(r,this.onInputEvent)}this.devices=e,this.keySources=s,this.listeners={poll:[],update:[]},this._autopoll=!1,this._animationFrameHandle=null}destroy(){this.clearKeySources();for(let t in this.devices){let e=this.devices[t];e.removeInputListener(r,this.onInputEvent),e.destroy()}this.devices={}}poll(t=performance.now()){for(const t in this.keySources){const e=this.keySources[t];for(const s in e){let i=e[s];i.poll(),this.dispatchInputEvent(y,t,s,i)}}this.dispatchPollEvent(t)}addEventListener(t,e){t in this.listeners?this.listeners[t].unshift(e):this.listeners[t]=[e]}removeEventListener(t,e){if(t in this.listeners){let s=this.listeners[t],i=s.indexOf(e);s.splice(i,1)}}countEventListeners(t){if(!(t in this.listeners))throw new Error(`Cannot count listeners for unknown event '${t}'.`);return this.listeners[t].length}dispatchEvent(t,e){for(let s of this.listeners[t])s(e)}dispatchInputEvent(t,e,s,i){this.dispatchEvent("input",{stage:t,deviceName:e,keyCode:s,input:i})}dispatchPollEvent(t){this.dispatchEvent("poll",{now:t})}onInputEvent(t){const e=t.deviceName;switch(t.type){case s:{const s=t.keyCode;let i=this.keySources[e][s];if(i)return i.update(t.event===o.DOWN),this.dispatchInputEvent(v,e,s,i),!0}break;case i:{let s=this.keySources[e],i=s.PosX;i&&(i.update(t.x,t.dx),this.dispatchInputEvent(v,e,"PosX",i));let n=s.PosY;n&&(n.update(t.y,t.dy),this.dispatchInputEvent(v,e,"PosY",n))}break;case n:{let s=this.keySources[e],i=s.WheelX;i&&(i.update(t.dx,t.dx),this.dispatchInputEvent(v,e,"WheelX",i));let n=s.WheelY;n&&(n.update(t.dy,t.dy),this.dispatchInputEvent(v,e,"WheelY",n));let o=s.WheelZ;o&&(o.update(t.dz,t.dz),this.dispatchInputEvent(v,e,"WheelZ",o))}}}onAnimationFrame(t){this._autopoll&&(this._animationFrameHandle=requestAnimationFrame(this.onAnimationFrame),this.poll(t))}set autopoll(t){this._autopoll=t,this._animationFrameHandle&&(cancelAnimationFrame(this._animationFrameHandle),this._animationFrameHandle=null),t&&(this._animationFrameHandle=requestAnimationFrame(this.onAnimationFrame))}get autopoll(){return this._autopoll}addKeySource(t,e){if(!(t in this.devices))throw new Error("Invalid device name - missing device with name in source.");let s,i=this.devices[t];if(i.constructor.isAxis(e))s=new m;else{if(!i.constructor.isButton(e))throw new Error(`Unknown key code '${e}' for device ${t}.`);s=new b}if(this.keySources[t][e])throw new Error("Cannot add duplicate key source for the same device and key code.");return this.keySources[t][e]=s,this}deleteKeySource(t,e){if(!this.keySources[t][e])throw new Error("Cannot delete missing key source for the device and key code.");delete this.keySources[t][e]}getKeySource(t,e){return this.keySources[t][e]}hasKeySource(t,e){return t in this.keySources&&e in this.keySources[t]}clearKeySources(){for(let t in this.devices)this.keySources[t]={}}}class g extends a{static isAxis(t){return!1}static isButton(t){return!0}constructor(t,e={}){super("Keyboard",t);const{repeat:i=!1}=e;this.repeat=i,this._eventObject={target:t,deviceName:this.deviceName,keyCode:"",event:o.NULL,type:s,value:0,control:!1,shift:!1,alt:!1},this.onKeyDown=this.onKeyDown.bind(this),this.onKeyUp=this.onKeyUp.bind(this),t.addEventListener("keydown",this.onKeyDown),t.addEventListener("keyup",this.onKeyUp)}destroy(){let t=this.eventTarget;t.removeEventListener("keydown",this.onKeyDown),t.removeEventListener("keyup",this.onKeyUp),super.destroy()}onKeyDown(t){if(t.repeat)return t.preventDefault(),t.stopPropagation(),!1;let e=this._eventObject;return e.keyCode=t.code,e.event=o.DOWN,e.value=1,e.control=t.ctrlKey,e.shift=t.shiftKey,e.alt=t.altKey,this.dispatchInput(e)?(t.preventDefault(),t.stopPropagation(),!1):void 0}onKeyUp(t){let e=this._eventObject;if(e.keyCode=t.code,e.event=o.UP,e.value=1,e.control=t.ctrlKey,e.shift=t.shiftKey,e.alt=t.altKey,this.dispatchInput(e))return t.preventDefault(),t.stopPropagation(),!1}}class w extends a{static isAxis(t){return"PosX"===t||"PosY"===t||"WheelX"===t||"WheelY"===t||"WheelZ"===t}static isButton(t){return!this.isAxis(t)}constructor(t,e={eventsOnFocus:!0}){super("Mouse",t),this.canvasTarget=t instanceof HTMLCanvasElement&&t||t.canvas||t.querySelector("canvas")||t.shadowRoot&&t.shadowRoot.querySelector("canvas")||t,this.eventsOnFocus=e.eventsOnFocus,this._downHasFocus=!1,this._eventObject={target:t,deviceName:this.deviceName,keyCode:"",event:o.NULL,type:s,value:0,control:!1,shift:!1,alt:!1},this._positionObject={target:t,deviceName:this.deviceName,keyCode:"Position",event:o.MOVE,type:i,x:0,y:0,dx:0,dy:0},this._wheelObject={target:t,deviceName:this.deviceName,keyCode:"Wheel",event:o.MOVE,type:n,dx:0,dy:0,dz:0},this.onMouseDown=this.onMouseDown.bind(this),this.onMouseUp=this.onMouseUp.bind(this),this.onMouseMove=this.onMouseMove.bind(this),this.onContextMenu=this.onContextMenu.bind(this),this.onWheel=this.onWheel.bind(this),t.addEventListener("mousedown",this.onMouseDown),t.addEventListener("contextmenu",this.onContextMenu),t.addEventListener("wheel",this.onWheel),document.addEventListener("mousemove",this.onMouseMove),document.addEventListener("mouseup",this.onMouseUp)}destroy(){let t=this.eventTarget;t.removeEventListener("mousedown",this.onMouseDown),t.removeEventListener("contextmenu",this.onContextMenu),t.removeEventListener("wheel",this.onWheel),document.removeEventListener("mousemove",this.onMouseMove),document.removeEventListener("mouseup",this.onMouseUp),super.destroy()}setPointerLock(t=!0){t?this.eventTarget.requestPointerLock():this.eventTarget.exitPointerLock()}hasPointerLock(){return document.pointerLockElement===this.eventTarget}onMouseDown(t){this._downHasFocus=!0;let e=this._eventObject;if(e.keyCode="Button"+t.button,e.event=o.DOWN,e.value=1,e.control=t.ctrlKey,e.shift=t.shiftKey,e.alt=t.altKey,this.dispatchInput(e)&&document.activeElement===this.eventTarget)return t.preventDefault(),t.stopPropagation(),!1}onContextMenu(t){return t.preventDefault(),t.stopPropagation(),!1}onWheel(t){let e=this._wheelObject;switch(t.deltaMode){case WheelEvent.DOM_DELTA_LINE:e.dx=10*t.deltaX,e.dy=10*t.deltaY,e.dz=10*t.deltaZ;break;case WheelEvent.DOM_DELTA_PAGE:e.dx=100*t.deltaX,e.dy=100*t.deltaY,e.dz=100*t.deltaZ;break;case WheelEvent.DOM_DELTA_PIXEL:default:e.dx=t.deltaX,e.dy=t.deltaY,e.dz=t.deltaZ}if(this.dispatchInput(e))return t.preventDefault(),t.stopPropagation(),!1}onMouseUp(t){if(!this._downHasFocus)return;this._downHasFocus=!1;let e=this._eventObject;return e.keyCode="Button"+t.button,e.event=o.UP,e.value=1,e.control=t.ctrlKey,e.shift=t.shiftKey,e.alt=t.altKey,this.dispatchInput(e)?(t.preventDefault(),t.stopPropagation(),!1):void 0}onMouseMove(t){if(this.eventsOnFocus&&document.activeElement!==this.eventTarget)return;const e=this.canvasTarget,{clientWidth:s,clientHeight:i}=e,n=e.getBoundingClientRect();let o=t.movementX/s,r=t.movementY/i,a=(t.clientX-n.left)/s,l=(t.clientY-n.top)/i,h=this._positionObject;h.x=a,h.y=l,h.dx=o,h.dy=r,this.dispatchInput(h)}}const E=Symbol("keySourceRefCount");const _=Symbol("inputEventSource");function S(t){return Object.prototype.hasOwnProperty.call(t,_)&&Object.getOwnPropertyDescriptor(t,_).value}class x extends HTMLElement{static get[Symbol.for("cuttleTemplate")](){let t=document.createElement("template");return t.innerHTML='<div>\r\n    <label id="title">\r\n        input-source\r\n    </label>\r\n    <span>|</span>\r\n    <p>\r\n        <label for="poll">poll</label>\r\n        <output id="poll"></output>\r\n    </p>\r\n    <p>\r\n        <label for="focus">focus</label>\r\n        <output id="focus"></output>\r\n    </p>\r\n</div>\r\n',Object.defineProperty(this,Symbol.for("cuttleTemplate"),{value:t}),t}static get[Symbol.for("cuttleStyle")](){let t=document.createElement("style");return t.innerHTML=':host{display:inline-block}div{font-family:monospace;color:#666;outline:1px solid #666;padding:4px}p{display:inline;margin:0;padding:0}#focus:empty:after,#poll:empty:after{content:"✗";color:red}',Object.defineProperty(this,Symbol.for("cuttleStyle"),{value:t}),t}static for(t){return new x(t)}static get observedAttributes(){return["oninput","onpoll","for","autopoll","id","class"]}static get properties(){return{for:String,autopoll:Boolean}}get autopoll(){return this._autopoll}set autopoll(t){this.toggleAttribute("autopoll",t)}get for(){return this._for}set for(t){this.setAttribute("for",t)}static get customEvents(){return["input","poll"]}get onpoll(){return this._onpoll}set onpoll(t){this._onpoll&&this.removeEventListener("poll",this._onpoll),this._onpoll=t,this._onpoll&&this.addEventListener("poll",t)}get oninput(){return this._oninput}set oninput(t){this._oninput&&this.removeEventListener("input",this._oninput),this._oninput=t,this._oninput&&this.addEventListener("input",t)}constructor(t){super(),this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(this.constructor[Symbol.for("cuttleTemplate")].content.cloneNode(!0)),this.shadowRoot.appendChild(this.constructor[Symbol.for("cuttleStyle")].cloneNode(!0)),this._containerElement=this.shadowRoot.querySelector("div"),this._titleElement=this.shadowRoot.querySelector("#title"),this._pollElement=this.shadowRoot.querySelector("#poll"),this._focusElement=this.shadowRoot.querySelector("#focus"),this._pollCount=0,this._pollCountDelay=0,this._eventTarget=null,this._eventSource=null,this._keySourceRefCount={},this.onSourcePoll=this.onSourcePoll.bind(this),this.onSourceInput=this.onSourceInput.bind(this),this.onTargetFocus=this.onTargetFocus.bind(this),this.onTargetBlur=this.onTargetBlur.bind(this),t&&this.setEventTarget(t)}connectedCallback(){if(Object.prototype.hasOwnProperty.call(this,"oninput")){let t=this.oninput;delete this.oninput,this.oninput=t}if(Object.prototype.hasOwnProperty.call(this,"onpoll")){let t=this.onpoll;delete this.onpoll,this.onpoll=t}if(Object.prototype.hasOwnProperty.call(this,"for")){let t=this.for;delete this.for,this.for=t}if(Object.prototype.hasOwnProperty.call(this,"autopoll")){let t=this.autopoll;delete this.autopoll,this.autopoll=t}this.hasAttribute("tabindex")||this.setAttribute("tabindex",0),this.hasAttribute("for")||this._eventTarget||this.setEventTarget(this)}disconnectedCallback(){this.clearEventTarget()}attributeChangedCallback(t,e,s){switch(t){case"for":this._for=s;break;case"autopoll":this._autopoll=null!==s;break;case"oninput":this.oninput=new Function("event","with(document){with(this){"+s+"}}").bind(this);break;case"onpoll":this.onpoll=new Function("event","with(document){with(this){"+s+"}}").bind(this)}((t,e,s)=>{switch(t){case"for":this.setEventTarget(s?document.getElementById(s):this);break;case"id":case"class":{let t=this.className?"."+this.className:"",e=this.hasAttribute("id")?"#"+this.getAttribute("id"):"";this._titleElement.innerHTML=t+e}}})(t,0,s)}poll(t){this._eventSource.poll(t)}onSourceInput({stage:t,deviceName:e,keyCode:s,input:i}){this.dispatchEvent(new CustomEvent("input",{composed:!0,bubbles:!1,detail:{stage:t,deviceName:e,keyCode:s,input:i}}))}onSourcePoll({now:t}){this._pollCount+=1,this.dispatchEvent(new CustomEvent("poll",{composed:!0,bubbles:!1})),t-this._pollCountDelay>1e3&&(this._pollCountDelay=t,this._pollCount>0?(this._pollElement.innerHTML="✓",this._pollCount=0):this._pollElement.innerHTML="")}onTargetFocus(){this._focusElement.innerHTML="✓"}onTargetBlur(){this._focusElement.innerHTML=""}setEventTarget(t){if(this.clearEventTarget(),!t)throw new Error("Cannot set null as event target for input source.");let e;S(t)?e=function(t){return Object.getOwnPropertyDescriptor(t,_).value}(t):(e=new f([new g(t),new w(t)]),function(t,e){Object.defineProperty(t,_,{value:e,configurable:!0})}(t,e),function(t){E in t||(t[E]={})}(e)),this._eventSource=e,this._eventTarget=t;let s=this.autopoll;s&&(this._eventSource.autopoll=s),e.addEventListener("poll",this.onSourcePoll),e.addEventListener("input",this.onSourceInput),t.addEventListener("focus",this.onTargetFocus),t.addEventListener("blur",this.onTargetBlur)}clearEventTarget(){let t=this._eventTarget,e=this._eventSource;this._eventTarget=null,this._eventSource=null,t&&(t.removeEventListener("focus",this.onTargetFocus),t.removeEventListener("blur",this.onTargetBlur),e.removeEventListener("poll",this.onSourcePoll),e.removeEventListener("input",this.onSourceInput),e.countEventListeners("input")<=0&&(e.destroy(),function(t){Object.defineProperty(t,_,{value:null,configurable:!0})}(t)))}enableKeySource(t,e){if(!t||!e)throw new Error("Invalid device name or key code for key source.");let s=this._eventSource;1===function(t,e,s){const i=p(e,s);let n=t[E],o=n[i]+1||1;return n[i]=o,o}(s,t,e)&&s.addKeySource(t,e)}disableKeySource(t,e){if(!t||!e)throw new Error("Invalid device name or key code for key source.");let s=this._eventSource;0===function(t,e,s){const i=p(e,s);let n=t[E],o=n[i]-1||0;return n[i]=Math.max(o,0),o}(s,t,e)&&s.deleteKeySource(t,e)}getKeySource(t,e){if(!t||!e)throw new Error("Invalid device name or key code for key source.");return this._eventSource.getKeySource(t,e)}hasKeySource(t,e){if(!t||!e)throw new Error("Invalid device name or key code for key source.");return this._eventSource.hasKeySource(t,e)}clearKeySources(){let t=this._eventSource;t.clearKeySources(),function(t){t[E]={}}(t)}get keySources(){return this._eventSource.keySources}get devices(){return this._eventSource.devices}}window.customElements.define("input-source",x);class k{constructor(t=null,e=null,s=!0){this.source=null,this._disabled=s,this._ignoreInput=s,this.adapters=new l,this.inputs={},this.onSourceInput=this.onSourceInput.bind(this),this.onSourcePoll=this.onSourcePoll.bind(this),(t||e)&&this._setupInputs(L(t),e),s||this.attach()}get disabled(){return this._disabled}set disabled(t){this.toggle(!t)}setInputMap(t){return this._setupInputs(this.source,t),this}setInputSource(t){return this._setupInputs(L(t),null),this}attach(){if(!this.source)throw new Error("Missing input source to attach context.");return this.toggle(!0),this}detach(){return this.toggle(!1),this._setupInputs(null,null),this}_setupInputs(t,e){const s=this.disabled;this.disabled=!0;const i=this.source,n=this.inputs,o=i!==t&&i,r=this.inputs&&e;if(o||r){o&&(i.removeEventListener("poll",this.onSourcePoll),i.removeEventListener("input",this.onSourceInput));for(let t in n){let{adapters:e}=n[t];for(let t of e){const{deviceName:e,keyCode:s}=t;i.disableKeySource(e,s)}}r&&(this.adapters.clear(),this.inputs={})}if(e){let t={};for(let s in e){let i=e[s],o=n[s]||new u;o.hydrate(i);let r=o.adapters;this.adapters.add(r),t[s]=o}this.inputs=t}if(t){const e=this.inputs;for(let s in e){let{adapters:i}=e[s];for(let e of i){const{deviceName:s,keyCode:i}=e;t.enableKeySource(s,i)}}this.source!==t&&(t.addEventListener("poll",this.onSourcePoll),t.addEventListener("input",this.onSourceInput),this.source=t)}this.disabled=s}onSourceInput(t){if(t.detail.consumed||this._ignoreInput){const{deviceName:e,keyCode:s,input:i}=t;this.adapters.reset(e,s,i)}else{const{stage:e,deviceName:s,keyCode:i,input:n}=t.detail;switch(e){case y:this.adapters.poll(s,i,n);break;case v:this.adapters.update(s,i,n);break;default:throw new Error("Unknown input source stage.")}t.consumed=!0}}onSourcePoll(t){this._ignoreInput!==this.disabled&&(this._ignoreInput=this.disabled)}toggle(t=this._disabled){if(t){if(!this.source)throw new Error("Input source must be set before enabling input context.");Object.keys(this.inputs).length<=0&&console.warn("No inputs found for enabled input context - did you forget to setInputMap()?")}return this._disabled=!t,this}getInput(t){if(t in this.inputs)return this.inputs[t];{let e=new u;return this.inputs[t]=e,e}}hasInput(t){return t in this.inputs&&this.inputs[t].adapters.length>0}getInputValue(t){return t in this.inputs?this.inputs[t].value:0}}function L(t){if(t instanceof x)return t;{let e=t,s=S(e),i=new x(e);return s||(i.autopoll=!0),i}}class M extends HTMLElement{static get[Symbol.for("cuttleTemplate")](){let t=document.createElement("template");return t.innerHTML='<kbd>\r\n    <span id="key"><slot></slot></span>\r\n    <span id="value" class="hidden"></span>\r\n</kbd>\r\n',Object.defineProperty(this,Symbol.for("cuttleTemplate"),{value:t}),t}static get[Symbol.for("cuttleStyle")](){let t=document.createElement("style");return t.innerHTML='kbd{position:relative;display:inline-block;border-radius:3px;border:1px solid #888;font-size:.85em;font-weight:700;text-rendering:optimizeLegibility;line-height:12px;height:14px;padding:2px 4px;color:#444;background-color:#eee;box-shadow:inset 0 -3px 0 #aaa;overflow:hidden}kbd:empty:after{content:"<?>";opacity:.6}.disabled{opacity:.6;box-shadow:none;background-color:#aaa}.hidden{display:none}#value{position:absolute;top:0;bottom:0;right:0;font-size:.85em;padding:2px 4px 0;color:#ccc;background-color:#333;box-shadow:inset 0 3px 0 #222}',Object.defineProperty(this,Symbol.for("cuttleStyle"),{value:t}),t}static get properties(){return{name:String,value:String,disabled:Boolean}}get disabled(){return this._disabled}set disabled(t){this.toggleAttribute("disabled",t)}get value(){return this._value}set value(t){this.setAttribute("value",t)}get name(){return this._name}set name(t){this.setAttribute("name",t)}constructor(){super(),this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(this.constructor[Symbol.for("cuttleTemplate")].content.cloneNode(!0)),this.shadowRoot.appendChild(this.constructor[Symbol.for("cuttleStyle")].cloneNode(!0)),this._keyboardElement=this.shadowRoot.querySelector("kbd"),this._keyElement=this.shadowRoot.querySelector("#key"),this._valueElement=this.shadowRoot.querySelector("#value")}attributeChangedCallback(t,e,s){switch(t){case"name":this._name=s;break;case"value":this._value=s;break;case"disabled":this._disabled=null!==s}((t,e,s)=>{switch(t){case"name":this._keyElement.innerText=s;break;case"value":null!==s?(this._valueElement.classList.toggle("hidden",!1),this._valueElement.innerText=s,this._keyboardElement.style.paddingRight=`${this._valueElement.clientWidth+4}px`):this._valueElement.classList.toggle("hidden",!0);break;case"disabled":this._keyboardElement.classList.toggle("disabled",null!==s)}})(t,0,s)}connectedCallback(){if(Object.prototype.hasOwnProperty.call(this,"name")){let t=this.name;delete this.name,this.name=t}if(Object.prototype.hasOwnProperty.call(this,"value")){let t=this.value;delete this.value,this.value=t}if(Object.prototype.hasOwnProperty.call(this,"disabled")){let t=this.disabled;delete this.disabled,this.disabled=t}}static get observedAttributes(){return["name","value","disabled"]}}window.customElements.define("input-key",M);class C extends HTMLElement{static get[Symbol.for("cuttleTemplate")](){let t=document.createElement("template");return t.innerHTML='<table>\r\n    <thead>\r\n        <tr class="tableHeader">\r\n            <th colspan=4>\r\n                <slot id="title">input-map</slot>\r\n            </th>\r\n        </tr>\r\n        <tr class="colHeader">\r\n            <th>name</th>\r\n            <th>key</th>\r\n            <th>mod</th>\r\n            <th>value</th>\r\n        </tr>\r\n    </thead>\r\n    <tbody>\r\n    </tbody>\r\n</table>\r\n',Object.defineProperty(this,Symbol.for("cuttleTemplate"),{value:t}),t}static get[Symbol.for("cuttleStyle")](){let t=document.createElement("style");return t.innerHTML=":host{display:block}table{border-collapse:collapse}table,td,th{border:1px solid #666}td,th{padding:5px 10px}td{text-align:center}thead th{padding:0}.colHeader>th{font-size:.8em;padding:0 10px;letter-spacing:3px;background-color:#aaa;color:#666}.colHeader>th,output{font-family:monospace}output{border-radius:.3em;padding:3px}tr:not(.primary) .name,tr:not(.primary) .value{opacity:.3}tr:nth-child(2n){background-color:#eee}",Object.defineProperty(this,Symbol.for("cuttleStyle"),{value:t}),t}static get customEvents(){return["load"]}get onload(){return this._onload}set onload(t){this._onload&&this.removeEventListener("load",this._onload),this._onload=t,this._onload&&this.addEventListener("load",t)}static get observedAttributes(){return["onload","src","id","class"]}constructor(){super(),this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(this.constructor[Symbol.for("cuttleTemplate")].content.cloneNode(!0)),this.shadowRoot.appendChild(this.constructor[Symbol.for("cuttleStyle")].cloneNode(!0)),this._src="",this._inputMap=null,this._tableElements={},this._titleElement=this.shadowRoot.querySelector("#title"),this._bodyElement=this.shadowRoot.querySelector("tbody"),this._children=this.shadowRoot.querySelector("slot")}get map(){return this._inputMap}get mapElements(){return this._tableElements}connectedCallback(){if(Object.prototype.hasOwnProperty.call(this,"onload")){let t=this.onload;delete this.onload,this.onload=t}!function(t,e){if(Object.prototype.hasOwnProperty.call(t,e)){let s=t[e];delete t[e],t[e]=s}}(this,"src")}attributeChangedCallback(t,e,s){switch(t){case"onload":this.onload=new Function("event","with(document){with(this){"+s+"}}").bind(this)}((t,e,s)=>{switch(t){case"src":if(this._src!==s)if(this._src=s,s.trim().startsWith("{")){let t=JSON.parse(s);this._setInputMap(t)}else fetch(s).then((t=>t.json())).then((t=>this._setInputMap(t)));break;case"id":case"class":this._titleElement.innerHTML=`input-port${this.className?"."+this.className:""}${this.hasAttribute("id")?"#"+this.getAttribute("id"):""}`}})(t,0,s)}get src(){return this.getAttribute("src")}set src(t){switch(typeof t){case"object":{let e=JSON.stringify(t);this._src=e,this._setInputMap(t),this.setAttribute("src",e)}break;case"string":this.setAttribute("src",t);break;default:this.setAttribute("src",JSON.stringify(t))}}_setInputMap(t){let e={},s=[];for(let i in t){let n=[];I(n,i,t[i]),e[i]=n,s.push(...n)}this._bodyElement.innerHTML="";for(let t of s)this._bodyElement.appendChild(t);this._inputMap=t,this._tableElements=e,this.dispatchEvent(new CustomEvent("load",{bubbles:!1,composed:!0,detail:{map:t}}))}}function I(t,e,s){if(Array.isArray(s)){I(t,e,s[0]);let i=s.length;for(let n=1;n<i;++n)t.push(T(e,s[n],!1))}else t.push(T(e,s,!0));return t}function T(t,e,s=!0){if("object"==typeof e){const{key:i,event:n,scale:o}=e;return O(t,i,n,o,0,s)}return O(t,e,null,1,0,s)}function O(t,e,s,i,n,o=!0){let r=document.createElement("tr");o&&r.classList.add("primary");{let e=document.createElement("td");e.textContent=t,e.classList.add("name"),r.appendChild(e)}{let t=document.createElement("td");t.classList.add("key");let s=new M;s.innerText=e,t.appendChild(s),r.appendChild(t)}{let t=document.createElement("td"),e=document.createElement("samp"),n=[];"string"==typeof s&&"null"!==s&&n.push(s),"number"==typeof i&&1!==i&&n.push(`×(${i.toFixed(2)})`),e.innerText=n.join(" "),t.classList.add("mod"),t.appendChild(e),r.appendChild(t)}{let t=document.createElement("td"),e=document.createElement("output");e.innerText=Number(n).toFixed(2),e.classList.add("value"),t.appendChild(e),r.appendChild(t)}return r}window.customElements.define("input-map",C);class P extends HTMLElement{static get[Symbol.for("cuttleTemplate")](){let t=document.createElement("template");return t.innerHTML="<input-map>\r\n    <slot></slot>\r\n    <input-source></input-source>\r\n</input-map>\r\n",Object.defineProperty(this,Symbol.for("cuttleTemplate"),{value:t}),t}static get[Symbol.for("cuttleStyle")](){let t=document.createElement("style");return t.innerHTML=":host{display:inline-block}",Object.defineProperty(this,Symbol.for("cuttleStyle"),{value:t}),t}static get properties(){return{for:String,disabled:Boolean}}get disabled(){return this._disabled}set disabled(t){this.toggleAttribute("disabled",t)}get for(){return this._for}set for(t){this.setAttribute("for",t)}static get observedAttributes(){return["for","disabled","src","id","class"]}constructor(){super(),this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(this.constructor[Symbol.for("cuttleTemplate")].content.cloneNode(!0)),this.shadowRoot.appendChild(this.constructor[Symbol.for("cuttleStyle")].cloneNode(!0)),this._inputContext=new k,this._mapElement=this.shadowRoot.querySelector("input-map"),this._sourceElement=this.shadowRoot.querySelector("input-source"),this.onInputMapLoad=this.onInputMapLoad.bind(this),this.onInputSourcePoll=this.onInputSourcePoll.bind(this),this._mapElement.addEventListener("load",this.onInputMapLoad),this._sourceElement.addEventListener("poll",this.onInputSourcePoll)}get context(){return this._inputContext}get source(){return this._sourceElement}get map(){return this._mapElement.map}onInputMapLoad(){let t=this._sourceElement,e=this._mapElement.map;t&&e&&(this._inputContext.setInputMap(e).setInputSource(t).attach(),this._inputContext.disabled=this._disabled)}onInputSourcePoll(){for(let[t,e]of Object.entries(this._mapElement.mapElements)){let s=this._inputContext.getInputValue(t);e[0].querySelector("output").innerText=Number(s).toFixed(2)}}connectedCallback(){if(Object.prototype.hasOwnProperty.call(this,"for")){let t=this.for;delete this.for,this.for=t}if(Object.prototype.hasOwnProperty.call(this,"disabled")){let t=this.disabled;delete this.disabled,this.disabled=t}!function(t,e){if(Object.prototype.hasOwnProperty.call(t,e)){let s=t[e];delete t[e],t[e]=s}}(this,"src")}attributeChangedCallback(t,e,s){switch(t){case"for":this._for=s;break;case"disabled":this._disabled=null!==s}((t,e,s)=>{switch(t){case"for":{let t=document.getElementById(s);S(s?t:this._sourceElement)||(this._sourceElement.autopoll=!0),t instanceof x&&t._eventTarget?(this._sourceElement.setEventTarget(t._eventTarget),this._sourceElement.className=t.className,this._sourceElement.id=t.id):this._sourceElement.for=s;let e=this._sourceElement,i=this._mapElement.map;i&&(this._inputContext.setInputMap(i).setInputSource(e).attach(),this._inputContext.disabled=this._disabled)}break;case"src":this._mapElement.src=s;break;case"disabled":{let t=this._sourceElement,e=this._mapElement.map;t&&e&&(this._inputContext.disabled=this._disabled)}break;case"id":this._sourceElement.id=s;break;case"class":this._sourceElement.className=s}})(t,0,s)}get src(){return this._mapElement.src}set src(t){this._mapElement.src=t}getInput(t){return this._inputContext.getInput(t)}getInputValue(t){return this._inputContext.getInputValue(t)}}window.customElements.define("input-context",P);class A{constructor(t){if(!t)throw new Error("Bounding shape must have unique type identifier.");this.type=t}}class N extends A{static fromBounds(t,e,s,i){let n=.5*Math.abs(s-t),o=.5*Math.abs(i-e);return new N(t+n,e+o,n,o)}constructor(t,e,s,i){super("aabb"),this.x=t,this.y=e,this.rx=s,this.ry=i}}function K(t,e,s,i){let n=t.r+i,o=Math.abs(t.x-e),r=Math.abs(t.y-s);return o*o+r*r<=n*n?function(t,e,s,i,n,o,r){return{x:t,y:e,dx:s,dy:i,nx:n,ny:o,time:r}}(0,0,0,0,0,0,0):null}window.addEventListener("DOMContentLoaded",(async function(){const t=document.querySelector("#main");t.width=320,t.height=240;const e=document.querySelector("input-context");e.src=j;const s=t.canvas.getContext("2d");let i={display:t,input:e,ctx:s,entities:{}},n={x:0,y:0,radians:0,motionX:0,motionY:0,holding:null,facing:1,moving:!1,dashing:!1,dashProgress:0,swingProgress:0,interactBody:{...H}};n.x=160,n.y=120,i.entities.players=[n];let o=q();o.x=64,o.y=64,i.entities.items=[o],t.addEventListener("frame",(t=>{const e=t.detail.deltaTime/60;!function(t,e,s){const{input:i,entities:n}=s;let o=i.getInputValue("MoveRight")-i.getInputValue("MoveLeft"),r=i.getInputValue("MoveDown")-i.getInputValue("MoveUp"),a=i.getInputValue("Evade"),l=i.getInputValue("Interact");if(i.getInputValue("Interacting"),l)if(t.holding){t.holding=null;let e=q();e.x=t.x,e.y=t.y,n.items.push(e)}else for(let e of n.items){if(K(t.interactBody,e.x,e.y,D)){t.holding=e;break}}if(t.dashing){let e=t.radians,s=2,i=Math.cos(e)*s,n=Math.sin(e)*s;t.motionX+=i,t.motionY+=n,t.moving=!0,t.dashProgress+=1,t.dashProgress>=10&&(t.dashing=!1)}else if(a)t.dashing=!0,t.dashProgress=0;else if(o||r){let e=Math.atan2(r,o);t.radians=e;let s=2,i=Math.cos(e)*s,n=Math.sin(e)*s;t.motionX+=i,t.motionY+=n,t.moving=!0;let a=Math.sign(Math.round(i));0!==a&&t.facing!==a&&(t.facing=a,t.swingProgress=0)}else t.moving=!1}(n,0,i),function(t,e,s){let i=Math.pow(.4,e);t.motionX*=i,t.motionY*=i;let n=1;t.dashing&&(n*=5);t.x+=t.motionX*n*e,t.y+=t.motionY*n*e,t.interactBody.x=t.x,t.interactBody.y=t.y}(n,e);for(let t of i.entities.items);s.fillStyle="#000000",s.fillRect(0,0,320,240);for(let t of i.entities.items)W(t,s);!function(t,e){let s=Math.trunc(t.x),i=Math.trunc(t.y),n=t.facing<0,o=t.dashing,r=0;o?(t.swingProgress=0,r=n?-R+F:R-F):t.moving?(t.swingProgress+=.22,t.swingProgress%=2*Math.PI):0!==t.swingProgress&&(t.swingProgress>.1?t.swingProgress-=.22:t.swingProgress=0);let a=(n?-1:1)*Math.sin(t.swingProgress),l=a*F,h=4*a;e.translate(s+h,i),e.fillStyle="rgba(100, 100, 100, 0.8)",e.fillRect(-11,9,22,4),e.rotate(l),o&&e.rotate(r);n&&e.scale(-1,1);if(e.fillStyle="#FFFFFF",e.fillRect(-8,-10,16,20),e.fillStyle="#000000",e.fillRect(3,-4,2,4),e.fillRect(-2,-4,2,4),t.holding){let s=t.holding,i=-s.x,n=-s.y-13;e.translate(i,n),W(s,e),e.translate(-i,-n)}n&&e.scale(-1,1);o&&e.rotate(-r);e.rotate(-l),e.translate(-h,0);let d=t.radians,u=24*Math.cos(d),c=24*Math.sin(d);e.fillStyle="#AAAAAA",e.fillRect(u-2,c-2,4,4),e.translate(-s,-i)}(n,s)}))}));const j={MoveLeft:["Keyboard:ArrowLeft","Keyboard:KeyA"],MoveRight:["Keyboard:ArrowRight","Keyboard:KeyD"],MoveUp:["Keyboard:ArrowUp","Keyboard:KeyW"],MoveDown:["Keyboard:ArrowDown","Keyboard:KeyS"],Evade:{key:"Keyboard:Space",event:"down"},Interact:{key:"Keyboard:KeyE",event:"down"},Interacting:"Keyboard:KeyE"},R=Math.PI/2;const F=Math.PI/8;new N(0,0,8,8);const H=new class extends A{constructor(t,e,s){super("radial"),this.x=t,this.y=e,this.r=s}}(0,0,24);const D=6;function q(t){return{x:0,y:0}}function W(t,e){let s=t.x,i=t.y;e.translate(s,i),e.fillStyle="#FF0000",e.fillRect(-D,-D,12,12),e.translate(-s,-i)}}();
