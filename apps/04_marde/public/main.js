(()=>{var Ct=`
<div class="container">
  <label class="hidden" id="title">display-port</label>
  <label class="hidden" id="fps">00</label>
  <label class="hidden" id="dimension">0x0</label>
  <div class="content">
    <slot id="inner">
      <canvas>
        Oh no! Your browser does not support canvas.
      </canvas>
    </slot>
    <slot name="overlay"></slot>
  </div>
  <slot name="frame"></slot>
</div>`,St=`
:host {
  display: inline-block;
  color: #555555;
}

.container {
  display: flex;
  position: relative;
  width: 100%;
  height: 100%;
}

.content {
  position: relative;
  margin: auto;
  overflow: hidden;
}

.content > *:not(canvas) {
  width: 100%;
  height: 100%;
}

canvas {
  background: #000000;
  image-rendering: pixelated;
}

label {
  position: absolute;
  font-family: monospace;
  color: currentColor;
}

#inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
}

#title {
  left: 0.5rem;
  top: 0.5rem;
}

#fps {
  right: 0.5rem;
  top: 0.5rem;
}

#dimension {
  left: 0.5rem;
  bottom: 0.5rem;
}

.hidden {
  display: none;
}

:host([debug]) .container {
  outline: 6px dashed rgba(0, 0, 0, 0.1);
  outline-offset: -4px;
  background-color: rgba(0, 0, 0, 0.1);
}

:host([mode='noscale']) canvas {
  margin: 0;
  top: 0;
  left: 0;
}

:host([mode='stretch']) canvas,
:host([mode='scale']) canvas {
  width: 100%;
  height: 100%;
}

:host([mode='fit']),
:host([mode='scale']),
:host([mode='center']),
:host([mode='stretch']),
:host([mode='fill']) {
  width: 100%;
  height: 100%;
}

:host([full]) {
  width: 100vw !important;
  height: 100vh !important;
}

:host([disabled]) {
  display: none;
}

slot {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
}

::slotted(*) {
  pointer-events: auto;
}`,W="noscale";var L="fit",$="scale",G="fill",j="stretch",q=300,X=150,V=L,Lt=200,b=class extends HTMLElement{static create(t={}){let{root:e=document.body,id:n=void 0,mode:i=V,width:s=q,height:a=X,debug:r=!1}=t||{},d=new b;return d.id=n,d.mode=i,d.width=s,d.height=a,d.debug=r,e.appendChild(d),d}static define(t=window.customElements){t.define("display-port",this)}static get[Symbol.for("templateNode")](){let t=document.createElement("template");return t.innerHTML=Ct,Object.defineProperty(this,Symbol.for("templateNode"),{value:t}),t}static get[Symbol.for("styleNode")](){let t=document.createElement("style");return t.innerHTML=St,Object.defineProperty(this,Symbol.for("styleNode"),{value:t}),t}static get observedAttributes(){return["debug","disabled","width","height","onframe","id","class"]}get mode(){return this.getAttribute("mode")}set mode(t){this.setAttribute("mode",t)}get debug(){return this._debug}set debug(t){this.toggleAttribute("debug",t)}get disabled(){return this._disabled}set disabled(t){this.toggleAttribute("disabled",t)}get width(){return this._width}set width(t){this.setAttribute("width",String(t))}get height(){return this._height}set height(t){this.setAttribute("height",String(t))}get onframe(){return this._onframe}set onframe(t){this._onframe&&this.removeEventListener("frame",this._onframe),this._onframe=t,this._onframe&&this.addEventListener("frame",t)}constructor(){super();let t=this.attachShadow({mode:"open"});t.appendChild(this.constructor[Symbol.for("templateNode")].content.cloneNode(!0)),t.appendChild(this.constructor[Symbol.for("styleNode")].cloneNode(!0)),this._canvasElement=null,this._contentElement=t.querySelector(".content"),this._innerElement=t.querySelector("#inner"),this._titleElement=t.querySelector("#title"),this._fpsElement=t.querySelector("#fps"),this._dimensionElement=t.querySelector("#dimension"),this._debug=!1,this._disabled=!1,this._width=q,this._height=X,this._onframe=void 0,this._animationRequestHandle=0,this._prevAnimationFrameTime=0,this._resizeTimeoutHandle=0,this._resizeCanvasWidth=0,this._resizeCanvasHeight=0,this._frameEvent=new CustomEvent("frame",{composed:!0,bubbles:!1,detail:{now:0,prevTime:0,deltaTime:0,canvas:this._canvasElement}}),this._resizeEvent=new CustomEvent("resize",{composed:!0,bubbles:!1,detail:{width:0,height:0}}),this.update=this.update.bind(this),this.onDelayCanvasResize=this.onDelayCanvasResize.bind(this),this.onSlotChange=this.onSlotChange.bind(this)}get canvas(){return this._canvasElement}connectedCallback(){y(this,"mode"),y(this,"debug"),y(this,"disabled"),y(this,"width"),y(this,"height"),y(this,"onframe"),this.hasAttribute("mode")||this.setAttribute("mode",V),this.hasAttribute("tabindex")||this.setAttribute("tabindex","0"),this._innerElement.addEventListener("slotchange",this.onSlotChange),this._canvasElement=this._innerElement.querySelector("canvas"),this._canvasElement&&(this.updateCanvasSize(!0),this.resume())}disconnectedCallback(){this._innerElement.removeEventListener("slotchange",this.onSlotChange),this.pause()}attributeChangedCallback(t,e,n){switch(t){case"debug":this._debug=n!==null;break;case"disabled":this._disabled=n!==null;break;case"width":this._width=Number(n);break;case"height":this._height=Number(n);break;case"onframe":this.onframe=new Function("event","with(document){with(this){"+n+"}}").bind(this);break}switch(t){case"disabled":n?(this.update(0),this.pause()):this.resume();break;case"id":case"class":this._titleElement.innerHTML=`display-port${this.className?"."+this.className:""}${this.hasAttribute("id")?"#"+this.getAttribute("id"):""}`;break;case"debug":this._titleElement.classList.toggle("hidden",n),this._fpsElement.classList.toggle("hidden",n),this._dimensionElement.classList.toggle("hidden",n);break}}onSlotChange(t){let i=t.target.assignedElements({flatten:!0}).find(s=>s instanceof HTMLCanvasElement);if(!i)throw new Error("No valid canvas element found for display.");this._canvasElement=i,this.updateCanvasSize(!0),this.resume()}getContext(t="2d",e=void 0){return this._canvasElement.getContext(t,e)}pause(){window.cancelAnimationFrame(this._animationRequestHandle)}resume(){this._animationRequestHandle=window.requestAnimationFrame(this.update)}update(t){this._animationRequestHandle=window.requestAnimationFrame(this.update),this.updateCanvasSize(!1);let e=t-this._prevAnimationFrameTime;if(this._prevAnimationFrameTime=t,this._debug){let s=e<=0?"--":String(Math.round(1e3/e)).padStart(2,"0");if(this._fpsElement.textContent!==s&&(this._fpsElement.textContent=s),this.mode===W){let r=`${this._width}x${this._height}`;this._dimensionElement.textContent!==r&&(this._dimensionElement.textContent=r)}else{let r=`${this._width}x${this._height}|${this.shadowRoot.host.clientWidth}x${this.shadowRoot.host.clientHeight}`;this._dimensionElement.textContent!==r&&(this._dimensionElement.textContent=r)}}let i=this._frameEvent.detail;i.now=t,i.prevTime=this._prevAnimationFrameTime,i.deltaTime=e,this.dispatchEvent(this._frameEvent)}onDelayCanvasResize(){this._resizeTimeoutHandle=null,this.updateCanvasSize(!0)}delayCanvasResize(t,e){(t!==this._resizeCanvasWidth||e!==this._resizeCanvasHeight)&&(this._resizeCanvasWidth=t,this._resizeCanvasHeight=e,this._resizeTimeoutHandle&&window.clearTimeout(this._resizeTimeoutHandle),this._resizeTimeoutHandle=window.setTimeout(this.onDelayCanvasResize,Lt))}updateCanvasSize(t=!0){let e=this.shadowRoot.host.getBoundingClientRect(),n=e.width,i=e.height,s=this._canvasElement,a=this._width,r=this._height,d=this.mode;if(d===j||d===G)a=n,r=i;else if(d!==W&&(n<a||i<r||d===L||d==$)){let u=n/a,p=i/r;u<p?(a=n,r=r*u):(a=a*p,r=i)}if(a=Math.floor(a),r=Math.floor(r),typeof t=="undefined"&&(t=s.clientWidth!==a||s.clientHeight!==r),!t){this.delayCanvasResize(a,r);return}let c=Math.min(a/this._width,r/this._height)*.5;if(this._innerElement.style.fontSize=`font-size: ${c}em`,t){d===$?(s.width=this._width,s.height=this._height):d!==j&&(s.width=a,s.height=r);let u=this._contentElement.style;u.width=`${a}px`,u.height=`${r}px`,(d===L||d===G)&&(this._width=a,this._height=r);let f=this._resizeEvent.detail;f.width=a,f.height=r,this.dispatchEvent(this._resizeEvent)}}};function y(o,t){if(Object.prototype.hasOwnProperty.call(o,t)){let e=o[t];delete o[t],o[t]=e}}var It=`<div class="container">
  <div class="padding"></div>
  <div class="innerContainer">
    <div class="padding"></div>
    <slot><canvas>Oh no! Your browser does not support canvas.</canvas></slot>
    <div class="padding"></div>
  </div>
  <div class="padding"></div>
</div>`,Mt=`
:host {
  display: inline-block;
  flex: 1;
  --width: 300px;
  --height: 150px;
}
:host([scaling="noscale"]) {
  width: var(--width);
  height: var(--height);
}
:host([sizing="viewport"]) {
    position: fixed;
    top: 0;
    left: 0;
}
.container {
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.innerContainer {
  display: flex;
  flex-direction: column;
}
.padding {
  flex: 1;
}`,Z="scale",Bt="conatiner",Q=300,J=150,w=class extends HTMLElement{static create(t={}){let{root:e=document.body,id:n=void 0,scaling:i=Z,sizing:s=Bt,width:a=Q,height:r=J}=t||{};window.customElements.get("flex-canvas")||window.customElements.define("flex-canvas",w);let d=new w;return d.id=n,d.scaling=i,d.sizing=s,d.width=a,d.height=r,e.appendChild(d),d}static define(t=window.customElements){t.define("flex-canvas",this)}static get[Symbol.for("templateNode")](){let t=document.createElement("template");return t.innerHTML=It,Object.defineProperty(this,Symbol.for("templateNode"),{value:t}),t}static get[Symbol.for("styleNode")](){let t=document.createElement("style");return t.innerHTML=Mt,Object.defineProperty(this,Symbol.for("styleNode"),{value:t}),t}static get observedAttributes(){return["sizing","width","height","resize-delay"]}get scaling(){return this.getAttribute("scaling")}set scaling(t){this.setAttribute("scaling",t)}get sizing(){return this._sizing}set sizing(t){this.setAttribute("sizing",String(t))}get resizeDelay(){return this._resizeDelay}set resizeDelay(t){this.setAttribute("resize-delay",String(t))}get width(){return this._width}set width(t){this.setAttribute("width",String(t))}get height(){return this._height}set height(t){this.setAttribute("height",String(t))}get canvas(){return this.canvasElement}constructor(){super();let t=this.attachShadow({mode:"open"});t.appendChild(this.constructor[Symbol.for("templateNode")].content.cloneNode(!0)),t.appendChild(this.constructor[Symbol.for("styleNode")].cloneNode(!0)),this._sizing="none",this._width=Q,this._height=J,this._resizeDelay=0,this.animationFrameHandle=0,this.resizeTimeoutHandle=0,this.resizeCanvasWidth=0,this.resizeCanvasHeight=0,this.canvasSlotElement=t.querySelector("slot"),this.canvasElement=null,this.onResize=this.onResize.bind(this),this.onAnimationFrame=this.onAnimationFrame.bind(this),this.onSlotChange=this.onSlotChange.bind(this)}connectedCallback(){v(this,"scaling"),v(this,"sizing"),v(this,"width"),v(this,"height"),v(this,"resize-delay"),this.hasAttribute("scaling")||this.setAttribute("scaling",Z),this.hasAttribute("tabindex")||this.setAttribute("tabindex","0"),this.animationFrameHandle=requestAnimationFrame(this.onAnimationFrame),this.canvasSlotElement.addEventListener("slotchange",this.onSlotChange),this.canvasElement||this.setCanvasElement(this.canvasSlotElement.querySelector("canvas"))}disconnectedCallback(){cancelAnimationFrame(this.animationFrameHandle),this.animationFrameHandle=null,this.canvasSlotElement.removeEventListener("slotchange",this.onSlotChange)}attributeChangedCallback(t,e,n){switch(t){case"sizing":switch(this._sizing=String(n),this._sizing){case"none":this.style.removeProperty("width"),this.style.removeProperty("height");break;case"container":this.style.setProperty("width","100%"),this.style.setProperty("height","100%");break;case"viewport":this.style.setProperty("width","100vw"),this.style.setProperty("height","100vh");break;default:let[i,s]=this._sizing.split(" ");i&&s&&(this.style.setProperty("width",i),this.style.setProperty("height",s));break}break;case"width":this._width=Number(n),this.canvasElement&&(this.canvasElement.width=this._width);break;case"height":this._height=Number(n),this.canvasElement&&(this.canvasElement.height=this._height);break;case"resize-delay":this._resizeDelay=Number(n);break}}onAnimationFrame(t){this.animationFrameHandle=requestAnimationFrame(this.onAnimationFrame),!(this.clientWidth===this.resizeCanvasWidth&&this.clientHeight===this.resizeCanvasHeight)&&(this.resizeCanvasWidth=this.clientWidth,this.resizeCanvasHeight=this.clientHeight,this._resizeDelay>0?this.resizeTimeoutHandle||(this.resizeTimeoutHandle=window.setTimeout(this.onResize,this._resizeDelay)):this.onResize())}onResize(){window.clearTimeout(this.resizeTimeoutHandle),this.resizeTimeoutHandle=null;let t=this.canvasElement;if(!t)return;let e=this.scaling,n=this.getBoundingClientRect(),i=n.width,s=n.height,a=this._width,r=this._height,d=i/a,c=s/r;e==="noscale"&&(this.style.setProperty("--width",`${a}px`),this.style.setProperty("--height",`${r}px`)),e==="scale"&&(d<c?(t.style.setProperty("width",`${Math.floor(i)}px`),t.style.setProperty("height",`${Math.floor(r*d)}px`)):(t.style.setProperty("width",`${Math.floor(a*c)}px`),t.style.setProperty("height",`${Math.floor(s)}px`))),e==="stretch"&&(t.style.setProperty("width",`${Math.floor(i)}px`),t.style.setProperty("height",`${Math.floor(s)}px`)),e==="fit"&&(d<c?(a=Math.floor(i),r=Math.floor(r*d),t.style.setProperty("width",`${a}px`),t.style.setProperty("height",`${r}px`)):(a=Math.floor(a*c),r=Math.floor(s),t.style.setProperty("width",`${a}px`),t.style.setProperty("height",`${r}px`)),t.width!==a&&(t.width=a),t.height!==r&&(t.height=r)),e==="fill"&&(d<c?(a=Math.floor(i),r=Math.floor(s),t.style.setProperty("width",`${a}px`),t.style.setProperty("height",`${r}px`)):(a=Math.floor(i),r=Math.floor(s),t.style.setProperty("width",`${a}px`),t.style.setProperty("height",`${r}px`)),t.width!==a&&(t.width=a),t.height!==r&&(t.height=r))}onSlotChange(t){let i=t.target.assignedElements({flatten:!0}).find(s=>s instanceof HTMLCanvasElement);i&&this.setCanvasElement(i)}setCanvasElement(t){t.width=this._width,t.height=this._height,t.style.imageRendering="pixelated",this.canvasElement=t}getContext(t="2d",e=void 0){return this.canvasElement.getContext(t,e)}};function v(o,t){if(Object.prototype.hasOwnProperty.call(o,t)){let e=o[t];delete o[t],o[t]=e}}var I=class{get polling(){return performance.now()-this._lastPollingTime<1e3}get value(){return 0}get size(){return this._size}constructor(t){this._size=t,this._lastPollingTime=Number.MIN_SAFE_INTEGER}resize(t){this._size=t}getState(t){throw new Error("Missing implementation.")}onUpdate(t,e,n){throw new Error("Missing implementation.")}onStatus(t,e){throw new Error("Missing implementation.")}onPoll(t){this._lastPollingTime=t}onBind(t,e=void 0){t>=this._size&&this.resize(t+1)}onUnbind(){this.resize(0)}},_=class extends I{static createAxisBindingState(){return{value:0,delta:0,inverted:!1}}get delta(){return this._delta}get value(){return this._value}constructor(t=0){super(t);let e=new Array,n=this.constructor;for(let i=0;i<t;++i)e.push(n.createAxisBindingState());this._state=e,this._value=0,this._delta=0}resize(t){let e=this._state,n=e.length,i;if(t<=n)i=e.slice(0,t);else{i=e;let s=this.constructor;for(let a=n;a<t;++a)i.push(s.createAxisBindingState())}this._state=i,super.resize(t)}getState(t){return this._state[t].value}onPoll(t){let e=this._state,n=0,i=0,s=e.length;for(let a=0;a<s;++a){let r=e[a];n+=r.value*(r.inverted?-1:1),i+=r.delta,e[a].delta=0}this._value=n,this._delta=i,super.onPoll(t)}onUpdate(t,e,n){typeof e=="undefined"?this.onAxisChange(t,n):this.onAxisMove(t,e,n)}onStatus(t,e){this.onAxisStatus(t,e)}onBind(t,e=void 0){super.onBind(t,e);let{inverted:n=!1}=e||{},i=this._state;i[t].inverted=n}onAxisMove(t,e,n){let i=this._state[t];i.value=e,i.delta+=n}onAxisChange(t,e){let n=this._state[t];n.value+=e,n.delta+=e}onAxisStatus(t,e){let n=this._state[t],i=n.value;n.value=e,n.delta=e-i}},Kt=241,tt=254,Dt=239,E=1,M=2,B=4,K=8,D=16,x=class extends I{get pressed(){return this._pressed}get repeated(){return this._repeated}get released(){return this._released}get down(){return this._down}get value(){return this._value}constructor(t=0){super(t);this._state=new Uint8Array(t),this._value=0,this._down=!1,this._pressed=!1,this._repeated=!1,this._released=!1}resize(t){let e=this._state,n=e.length,i;t<=n?i=e.slice(0,t):(i=new Uint8Array(t),i.set(e)),this._state=i,super.resize(t)}getState(t){let e=this._state[t],n=e&D?-1:1;return(e&E?1:0)*n}onPoll(t){let e=this._state,n=0,i=0,s=0,a=0,r=0,d=e.length;for(let c=0;c<d;++c){let u=e[c],p=u&E,f=u&D;i|=p,s|=u&M,a|=u&B,r|=u&K,n+=(p?1:0)*(f?-1:1),e[c]&=Kt}this._value=n,this._down=i!==0,this._pressed=s!==0,this._repeated=a!==0,this._released=r!==0,super.onPoll(t)}onUpdate(t,e,n){n>0?this.onButtonPressed(t):this.onButtonReleased(t)}onStatus(t,e){this.onButtonStatus(t,e!==0)}onBind(t,e={inverted:!1}){super.onBind(t,e);let{inverted:n=!1}=e,i=this._state;n?i[t]|=D:i[t]&=Dt}onButtonPressed(t){let e=this._state,n=e[t];n&E||(n|=M,n|=E),n|=B,e[t]=n}onButtonReleased(t){let e=this._state,n=e[t];n&E&&(n|=K,n&=tt),e[t]=n}onButtonStatus(t,e){let n=this._state,i=n[t],s=Boolean(i&E);e?i|=E:i&=tt,s&&!e&&(i|=K),!s&&e&&(i|=M,i|=B),n[t]=i}},l=class{static parse(t){t=t.trim();let e=t.indexOf(".");if(e<0)throw new Error("Missing device separator for key code.");let n=t.substring(0,e);if(n.length<0)throw new Error("Missing device for key code.");let i=t.substring(e+1);if(i.length<0)throw new Error("Missing code for key code.");return new l(n,i)}constructor(t,e){this.device=t,this.code=e}toString(){return`${this.device}.${this.code}`}};var h="Keyboard",m="Mouse",ae=new l(h,"KeyA"),re=new l(h,"KeyB"),le=new l(h,"KeyC"),he=new l(h,"KeyD"),de=new l(h,"KeyE"),ue=new l(h,"KeyF"),ce=new l(h,"KeyG"),pe=new l(h,"KeyH"),fe=new l(h,"KeyI"),me=new l(h,"KeyJ"),ge=new l(h,"KeyK"),Ee=new l(h,"KeyL"),ye=new l(h,"KeyM"),be=new l(h,"KeyN"),ve=new l(h,"KeyO"),_e=new l(h,"KeyP"),we=new l(h,"KeyQ"),xe=new l(h,"KeyR"),Te=new l(h,"KeyS"),Ae=new l(h,"KeyT"),Ce=new l(h,"KeyU"),Se=new l(h,"KeyV"),Le=new l(h,"KeyW"),Ie=new l(h,"KeyX"),Me=new l(h,"KeyY"),Be=new l(h,"KeyZ"),Ke=new l(h,"Digit0"),De=new l(h,"Digit1"),Re=new l(h,"Digit2"),Oe=new l(h,"Digit3"),Ne=new l(h,"Digit4"),ke=new l(h,"Digit5"),Pe=new l(h,"Digit6"),He=new l(h,"Digit7"),Fe=new l(h,"Digit8"),Ue=new l(h,"Digit9"),Ye=new l(h,"Minus"),ze=new l(h,"Equal"),We=new l(h,"BracketLeft"),$e=new l(h,"BracketRight"),Ge=new l(h,"Semicolon"),je=new l(h,"Quote"),qe=new l(h,"Backquote"),Xe=new l(h,"Backslash"),Ve=new l(h,"Comma"),Ze=new l(h,"Period"),Qe=new l(h,"Slash"),Je=new l(h,"Escape"),tn=new l(h,"Space"),en=new l(h,"CapsLock"),nn=new l(h,"Backspace"),sn=new l(h,"Delete"),on=new l(h,"Tab"),an=new l(h,"Enter"),rn=new l(h,"ArrowUp"),ln=new l(h,"ArrowDown"),hn=new l(h,"ArrowLeft"),dn=new l(h,"ArrowRight"),un=new l(m,"Button0"),cn=new l(m,"Button1"),pn=new l(m,"Button2"),fn=new l(m,"Button3"),mn=new l(m,"Button4"),gn=new l(m,"PosX"),En=new l(m,"PosY"),yn=new l(m,"WheelX"),bn=new l(m,"WheelY"),vn=new l(m,"WheelZ");var R=class{static isAxis(t){return!1}static isButton(t){return!1}constructor(t,e){if(!e)throw new Error(`Missing event target for device ${t}.`);this.name=t,this.eventTarget=e,this.listeners={input:[]}}setEventTarget(t){if(!t)throw new Error(`Missing event target for device ${this.name}.`);this.eventTarget=t}destroy(){let t=this.listeners;for(let e in t)t[e].length=0}addEventListener(t,e){let n=this.listeners;t in n?n[t].push(e):n[t]=[e]}removeEventListener(t,e){let n=this.listeners;if(t in n){let i=n[t],s=i.indexOf(e);s>=0&&i.splice(s,1)}}dispatchInputEvent(t){let e=0;for(let n of this.listeners.input)e|=n(t);return Boolean(e)}},et=class extends R{static isAxis(t){return!1}static isButton(t){return!0}constructor(t,e,n={}){super(t,e);let{ignoreRepeat:i=!0}=n;this.ignoreRepeat=i,this._eventObject={target:e,device:t,code:"",event:"",value:0,control:!1,shift:!1,alt:!1},this.onKeyDown=this.onKeyDown.bind(this),this.onKeyUp=this.onKeyUp.bind(this),e.addEventListener("keydown",this.onKeyDown),e.addEventListener("keyup",this.onKeyUp)}setEventTarget(t){this.eventTarget&&this.destroy(),super.setEventTarget(t),t.addEventListener("keydown",this.onKeyDown),t.addEventListener("keyup",this.onKeyUp)}destroy(){let t=this.eventTarget;t.removeEventListener("keydown",this.onKeyDown),t.removeEventListener("keyup",this.onKeyUp),super.destroy()}onKeyDown(t){if(t.repeat&&this.ignoreRepeat)return t.preventDefault(),t.stopPropagation(),!1;let e=this._eventObject;if(e.code=t.code,e.event="pressed",e.value=1,e.control=t.ctrlKey,e.shift=t.shiftKey,e.alt=t.altKey,this.dispatchInputEvent(e))return t.preventDefault(),t.stopPropagation(),!1}onKeyUp(t){let e=this._eventObject;if(e.code=t.code,e.event="released",e.value=1,e.control=t.ctrlKey,e.shift=t.shiftKey,e.alt=t.altKey,this.dispatchInputEvent(e))return t.preventDefault(),t.stopPropagation(),!1}},O=10,N=100,nt=class extends R{static isAxis(t){return t==="PosX"||t==="PosY"||t==="WheelX"||t==="WheelY"||t==="WheelZ"}static isButton(t){return!this.isAxis(t)}constructor(t,e,n={}){super(t,e);let{eventsOnFocus:i=!0}=n;this.eventsOnFocus=i,this.canvasTarget=this.getCanvasFromEventTarget(e),this._downHasFocus=!1,this._eventObject={target:e,device:t,code:"",event:"",value:0,control:!1,shift:!1,alt:!1},this._positionObject={target:e,device:t,code:"",event:"move",value:0,movement:0},this._wheelObject={target:e,device:t,code:"",event:"wheel",movement:0},this.onMouseDown=this.onMouseDown.bind(this),this.onMouseUp=this.onMouseUp.bind(this),this.onMouseMove=this.onMouseMove.bind(this),this.onContextMenu=this.onContextMenu.bind(this),this.onWheel=this.onWheel.bind(this),e.addEventListener("mousedown",this.onMouseDown),e.addEventListener("contextmenu",this.onContextMenu),e.addEventListener("wheel",this.onWheel),document.addEventListener("mousemove",this.onMouseMove),document.addEventListener("mouseup",this.onMouseUp)}setEventTarget(t){this.eventTarget&&this.destroy(),super.setEventTarget(t),this.canvasTarget=this.getCanvasFromEventTarget(t),t.addEventListener("mousedown",this.onMouseDown),t.addEventListener("contextmenu",this.onContextMenu),t.addEventListener("wheel",this.onWheel),document.addEventListener("mousemove",this.onMouseMove),document.addEventListener("mouseup",this.onMouseUp)}destroy(){let t=this.eventTarget;t.removeEventListener("mousedown",this.onMouseDown),t.removeEventListener("contextmenu",this.onContextMenu),t.removeEventListener("wheel",this.onWheel),document.removeEventListener("mousemove",this.onMouseMove),document.removeEventListener("mouseup",this.onMouseUp),super.destroy()}setPointerLock(t=!0){t?this.eventTarget.requestPointerLock():this.eventTarget.exitPointerLock()}hasPointerLock(){return document.pointerLockElement===this.eventTarget}onMouseDown(t){this._downHasFocus=!0;let e=this._eventObject;if(e.code="Button"+t.button,e.event="pressed",e.value=1,e.control=t.ctrlKey,e.shift=t.shiftKey,e.alt=t.altKey,this.dispatchInputEvent(e)&&document.activeElement===this.eventTarget)return t.preventDefault(),t.stopPropagation(),!1}onContextMenu(t){return t.preventDefault(),t.stopPropagation(),!1}onWheel(t){let e,n,i;switch(t.deltaMode){case WheelEvent.DOM_DELTA_LINE:e=t.deltaX*O,n=t.deltaY*O,i=t.deltaZ*O;break;case WheelEvent.DOM_DELTA_PAGE:e=t.deltaX*N,n=t.deltaY*N,i=t.deltaZ*N;break;case WheelEvent.DOM_DELTA_PIXEL:default:e=t.deltaX,n=t.deltaY,i=t.deltaZ;break}let s=0,a=this._wheelObject;if(a.code="WheelX",a.movement=e,s|=this.dispatchInputEvent(a),a.code="WheelY",a.movement=n,s|=this.dispatchInputEvent(a),a.code="WheelZ",a.movement=i,s|=this.dispatchInputEvent(a),s)return t.preventDefault(),t.stopPropagation(),!1}onMouseUp(t){if(!this._downHasFocus)return;this._downHasFocus=!1;let e=this._eventObject;if(e.code="Button"+t.button,e.event="released",e.value=1,e.control=t.ctrlKey,e.shift=t.shiftKey,e.alt=t.altKey,this.dispatchInputEvent(e))return t.preventDefault(),t.stopPropagation(),!1}onMouseMove(t){if(this.eventsOnFocus&&document.activeElement!==this.eventTarget)return;let e=this.canvasTarget,{clientWidth:n,clientHeight:i}=e,s=e.getBoundingClientRect(),a=t.movementX/n,r=t.movementY/i,d=(t.clientX-s.left)/n,c=(t.clientY-s.top)/i,u=this._positionObject;u.code="PosX",u.value=d,u.movement=a,this.dispatchInputEvent(u),u.code="PosY",u.value=c,u.movement=r,this.dispatchInputEvent(u)}getCanvasFromEventTarget(t){return t instanceof HTMLCanvasElement?t:t.canvas||t.querySelector("canvas")||t.shadowRoot&&t.shadowRoot.querySelector("canvas")||t}},Rt=`<kbd>
  <span id="name"><slot></slot></span>
  <span id="value" class="hidden"></span>
</kbd>
`,Ot=`kbd {
  position: relative;
  display: inline-block;
  border-radius: 3px;
  border: 1px solid #888888;
  font-size: 0.85em;
  font-weight: 700;
  text-rendering: optimizeLegibility;
  line-height: 12px;
  height: 14px;
  padding: 2px 4px;
  color: #444444;
  background-color: #eeeeee;
  box-shadow: inset 0 -3px 0 #aaaaaa;
  overflow: hidden;
}

kbd:empty::after {
  content: '<?>';
  opacity: 0.6;
}

.disabled {
  opacity: 0.6;
  box-shadow: none;
  background-color: #aaaaaa;
}

.hidden {
  display: none;
}

#value {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  font-size: 0.85em;
  padding: 0 4px;
  padding-top: 2px;
  color: #cccccc;
  background-color: #333333;
  box-shadow: inset 0 3px 0 #222222;
}
`,k=class extends HTMLElement{static get[Symbol.for("templateNode")](){let t=document.createElement("template");return t.innerHTML=Rt,Object.defineProperty(this,Symbol.for("templateNode"),{value:t}),t}static get[Symbol.for("styleNode")](){let t=document.createElement("style");return t.innerHTML=Ot,Object.defineProperty(this,Symbol.for("styleNode"),{value:t}),t}static define(t=window.customElements){t.define("input-code",this)}static get observedAttributes(){return["name","value","disabled"]}get disabled(){return this._disabled}set disabled(t){this.toggleAttribute("disabled",t)}get value(){return this._value}set value(t){this.setAttribute("value",t)}get name(){return this._name}set name(t){this.setAttribute("name",t)}constructor(){super();let t=this.constructor,e=this.attachShadow({mode:"open"});e.appendChild(t[Symbol.for("templateNode")].content.cloneNode(!0)),e.appendChild(t[Symbol.for("styleNode")].cloneNode(!0)),this._name="",this._value="",this._disabled=!1,this._kbdElement=e.querySelector("kbd"),this._nameElement=e.querySelector("#name"),this._valueElement=e.querySelector("#value")}attributeChangedCallback(t,e,n){switch(t){case"name":this._name=n,this._nameElement.textContent=n;break;case"value":this._value=n,n!==null?(this._valueElement.classList.toggle("hidden",!1),this._valueElement.textContent=n,this._kbdElement.style.paddingRight=`${this._valueElement.clientWidth+4}px`):this._valueElement.classList.toggle("hidden",!0);break;case"disabled":this._disabled=n!==null,this._kbdElement.classList.toggle("disabled",n!==null);break}}connectedCallback(){if(Object.prototype.hasOwnProperty.call(this,"name")){let t=this.name;delete this.name,this.name=t}if(Object.prototype.hasOwnProperty.call(this,"value")){let t=this.value;delete this.value,this.value=t}if(Object.prototype.hasOwnProperty.call(this,"disabled")){let t=this.disabled;delete this.disabled,this.disabled=t}}};k.define();var Nt=`<table>
  <thead>
    <tr class="tableHeader">
      <th colspan="3">
        <span class="tableTitle">
          <label id="title"> input-source </label>
          <span id="slotContainer">
            <slot></slot>
          </span>
          <p>
            <label for="poll">poll</label>
            <output id="poll"></output>
          </p>
          <p>
            <label for="focus">focus</label>
            <output id="focus"></output>
          </p>
        </span>
      </th>
    </tr>
    <tr class="colHeader">
      <th>name</th>
      <th>value</th>
      <th>key</th>
    </tr>
  </thead>
  <tbody></tbody>
</table>
`,kt=`:host {
  display: block;
}

table {
  border-collapse: collapse;
  font-family: monospace;
}

table,
th,
td {
  border: 1px solid #666666;
}

th,
td {
  padding: 5px 10px;
}

td {
  text-align: center;
}

thead th {
  padding: 0;
}

.colHeader > th {
  font-size: 0.8em;
  padding: 0 10px;
  letter-spacing: 3px;
  background-color: #aaaaaa;
  color: #666666;
}

tbody output {
  border-radius: 0.3em;
  padding: 3px;
}

tr:not(.primary) .name,
tr:not(.primary) .value {
  opacity: 0.3;
}

tr:nth-child(2n) {
  background-color: #eeeeee;
}

.tableHeader {
  color: #666666;
}

.tableTitle {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 4px;
}

#slotContainer {
  flex: 1;
}

p {
  display: inline;
  margin: 0;
  padding: 0;
  padding-right: 10px;
}

#poll:empty::after,
#focus:empty::after {
  content: '\u2717';
  color: #ff0000;
}
`,it=class{constructor(t){this.onAnimationFrame=this.onAnimationFrame.bind(this),this.animationFrameHandle=null,this.pollable=t}get running(){return this.animationFrameHandle!==null}start(){let t=this.animationFrameHandle;t&&cancelAnimationFrame(t),this.animationFrameHandle=requestAnimationFrame(this.onAnimationFrame)}stop(){let t=this.animationFrameHandle;t&&cancelAnimationFrame(t),this.animationFrameHandle=null}onAnimationFrame(t){this.animationFrameHandle=requestAnimationFrame(this.onAnimationFrame),this.pollable.onPoll(t)}},st=class{constructor(t){this.onInput=this.onInput.bind(this),this.onPoll=this.onPoll.bind(this),this.bindings=t}onPoll(t){for(let e of this.bindings.getInputs())e.onPoll(t)}onInput(t){let{device:e,code:n,event:i,value:s,movement:a,control:r,shift:d,alt:c}=t,u=this.bindings.getBindings(e,n);switch(i){case"pressed":for(let{input:p,index:f}of u)p.onUpdate(f,1,1);break;case"released":for(let{input:p,index:f}of u)p.onUpdate(f,0,-1);break;case"move":for(let{input:p,index:f}of u)p.onUpdate(f,s,a);break;case"wheel":for(let{input:p,index:f}of u)p.onUpdate(f,void 0,a);break}return u.length>0}},P=class{constructor(t,e,n,i){this.device=t,this.code=e,this.input=n,this.index=i}},ot=class{constructor(){this.bindingMap={},this.inputMap=new Map}clear(){for(let t of this.inputMap.keys())t.onUnbind();this.inputMap.clear(),this.bindingMap={}}bind(t,e,n,i={inverted:!1}){let s,a=this.inputMap;if(a.has(t)){let d=a.get(t),c=t.size;t.onBind(c,i),s=new P(e,n,t,c),d.push(s)}else{let d=[];a.set(t,d);let c=0;t.onBind(c,i),s=new P(e,n,t,c),d.push(s)}let r=this.bindingMap;e in r?n in r[e]?r[e][n].push(s):r[e][n]=[s]:r[e]={[n]:[s]}}unbind(t){let e=this.inputMap;if(e.has(t)){let n=this.bindingMap,i=e.get(t);for(let s of i){let{device:a,code:r}=s,d=n[a][r],c=d.indexOf(s);d.splice(c,1)}i.length=0,t.onUnbind(),e.delete(t)}}isBound(t){return this.inputMap.has(t)}getInputs(){return this.inputMap.keys()}getBindingsByInput(t){return this.inputMap.get(t)}getBindings(t,e){let n=this.bindingMap;if(t in n){let i=n[t];if(e in i)return i[e]}return[]}},at=class{constructor(t,e=void 0){this.inputs={},this.devices=[new nt("Mouse",t),new et("Keyboard",t)],this.bindings=new ot,this.adapter=new st(this.bindings),this.autopoller=new it(this.adapter),this.eventTarget=t,this.anyButton=new x(1),this.anyButtonDevice="",this.anyButtonCode="",this.anyAxis=new _(1),this.anyAxisDevice="",this.anyAxisCode="",this.listeners={bind:[],unbind:[],focus:[],blur:[]},this.onInput=this.onInput.bind(this),this.onEventTargetBlur=this.onEventTargetBlur.bind(this),this.onEventTargetFocus=this.onEventTargetFocus.bind(this),t.addEventListener("focus",this.onEventTargetFocus),t.addEventListener("blur",this.onEventTargetBlur);for(let n of this.devices)n.addEventListener("input",this.onInput)}get autopoll(){return this.autopoller.running}set autopoll(t){this.toggleAutoPoll(t)}destroy(){let t=this.listeners;for(let n in t)t[n].length=0;this.autopoller.running&&this.autopoller.stop();for(let n of this.devices)n.removeEventListener("input",this.onInput),n.destroy();let e=this.eventTarget;e.removeEventListener("focus",this.onEventTargetFocus),e.removeEventListener("blur",this.onEventTargetBlur)}setEventTarget(t){let e=this.eventTarget;e.removeEventListener("focus",this.onEventTargetFocus),e.removeEventListener("blur",this.onEventTargetBlur),this.eventTarget=t;for(let n of this.devices)n.setEventTarget(t);t.addEventListener("focus",this.onEventTargetFocus),t.addEventListener("blur",this.onEventTargetBlur)}toggleAutoPoll(t=void 0){let e=this.autopoller.running,n=typeof t=="undefined"?!e:Boolean(t);n!==e&&(n?this.autopoller.start():this.autopoller.stop())}addEventListener(t,e){let n=this.listeners;t in n?n[t].push(e):n[t]=[e]}removeEventListener(t,e){let n=this.listeners;if(t in n){let i=n[t],s=i.indexOf(e);s>=0&&i.splice(s,1)}}dispatchEvent(t){let{type:e}=t,n=0;for(let i of this.listeners[e])n|=i(t)?1:0;return Boolean(n)}poll(t=performance.now()){if(this.autopoller.running)throw new Error("Should not manually poll() while autopolling.");this.onPoll(t)}onInput(t){let e=this.adapter.onInput(t);switch(t.event){case"pressed":this.anyButtonDevice=t.device,this.anyButtonCode=t.code,this.anyButton.onUpdate(0,1,1);break;case"released":this.anyButtonDevice=t.device,this.anyButtonCode=t.code,this.anyButton.onUpdate(0,0,-1);break;case"move":case"wheel":this.anyAxisDevice=t.device,this.anyAxisCode=t.code,this.anyAxis.onUpdate(0,t.value,t.movement);break}return e}onPoll(t){this.adapter.onPoll(t),this.anyButton.onPoll(t),this.anyAxis.onPoll(t)}onBind(){this.dispatchEvent({type:"bind"})}onUnbind(){this.dispatchEvent({type:"unbind"})}onEventTargetFocus(){this.dispatchEvent({type:"focus"})}onEventTargetBlur(){for(let t of this.bindings.getInputs())t.onStatus(0,0);this.anyButton.onStatus(0,0),this.anyAxis.onStatus(0,0),this.dispatchEvent({type:"blur"})}bindKeys(t){if(Array.isArray(t))for(let e of t)e.bindKeys(this);else if(typeof t.bindKeys=="function")t.bindKeys(this);else{t=Object.values(t);for(let e of t)e.bindKeys(this)}}bindButton(t,e,n,i=void 0){let s;this.hasButton(t)?s=this.getButton(t):(s=new x(1),this.inputs[t]=s),this.bindings.bind(s,e,n,i),this.onBind()}bindAxis(t,e,n,i=void 0){let s;this.hasAxis(t)?s=this.getAxis(t):(s=new _(1),this.inputs[t]=s),this.bindings.bind(s,e,n,i),this.onBind()}bindAxisButtons(t,e,n,i){let s;this.hasAxis(t)?s=this.getAxis(t):(s=new _(2),this.inputs[t]=s),this.bindings.bind(s,e,i),this.bindings.bind(s,e,n,{inverted:!0}),this.onBind()}unbindButton(t){if(this.hasButton(t)){let e=this.getButton(t);delete this.inputs[t],this.bindings.unbind(e),this.onUnbind()}}unbindAxis(t){if(this.hasAxis(t)){let e=this.getAxis(t);delete this.inputs[t],this.bindings.unbind(e),this.onUnbind()}}getInput(t){return this.inputs[t]}getButton(t){return this.inputs[t]}getAxis(t){return this.inputs[t]}hasButton(t){return t in this.inputs&&this.inputs[t]instanceof x}hasAxis(t){return t in this.inputs&&this.inputs[t]instanceof _}isButtonDown(t){return this.inputs[t].down}isButtonPressed(t){return this.inputs[t].pressed}isButtonReleased(t){return this.inputs[t].released}getInputValue(t){return this.inputs[t].value}getButtonValue(t){return this.inputs[t].value}getAxisValue(t){return this.inputs[t].value}getAxisDelta(t){return this.inputs[t].delta}isAnyButtonDown(t=void 0){if(typeof t=="undefined")return this.anyButton.down;{let e=this.inputs;for(let n of t)if(e[n].down)return!0}return!1}isAnyButtonPressed(t=void 0){if(typeof t=="undefined")return this.anyButton.pressed;{let e=this.inputs;for(let n of t)if(e[n].pressed)return!0}return!1}isAnyButtonReleased(t=void 0){if(typeof t=="undefined")return this.anyButton.released;{let e=this.inputs;for(let n of t)if(e[n].released)return!0}return!1}getAnyAxisValue(t=void 0){if(typeof t=="undefined")return this.anyAxis.value;{let e=this.inputs;for(let n of t){let i=e[n];if(i.value)return i.value}}return 0}getAnyAxisDelta(t=void 0){if(typeof t=="undefined")return this.anyAxis.delta;{let e=this.inputs;for(let n of t){let i=e[n];if(i.delta)return i.delta}}return 0}getLastButtonDevice(){return this.anyButtonDevice}getLastButtonCode(){return this.anyButtonCode}getLastAxisDevice(){return this.anyAxisDevice}getLastAxisCode(){return this.anyAxisCode}getMouse(){return this.devices[0]}getKeyboard(){return this.devices[1]}},T=class extends HTMLElement{static create(t={}){let{root:e=document.body,id:n=void 0,for:i=void 0,autopoll:s=!1}=t||{},a=new T;return a.id=n,a.for=i,a.autopoll=s,e.appendChild(a),a}static get[Symbol.for("templateNode")](){let t=document.createElement("template");return t.innerHTML=Nt,Object.defineProperty(this,Symbol.for("templateNode"),{value:t}),t}static get[Symbol.for("styleNode")](){let t=document.createElement("style");return t.innerHTML=kt,Object.defineProperty(this,Symbol.for("styleNode"),{value:t}),t}static define(t=window.customElements){t.define("input-port",this)}static get observedAttributes(){return["autopoll","for"]}get autopoll(){return this._autopoll}set autopoll(t){this.toggleAttribute("autopoll",t)}get for(){return this._for}set for(t){this.setAttribute("for",t)}constructor(){super();let t=this.attachShadow({mode:"open"});t.appendChild(this.constructor[Symbol.for("templateNode")].content.cloneNode(!0)),t.appendChild(this.constructor[Symbol.for("styleNode")].cloneNode(!0)),this._titleElement=t.querySelector("#title"),this._pollElement=t.querySelector("#poll"),this._focusElement=t.querySelector("#focus"),this._bodyElement=t.querySelector("tbody"),this._outputElements={},this.onAnimationFrame=this.onAnimationFrame.bind(this),this.animationFrameHandle=null;let e=this;this._for="",this._eventTarget=e,this._autopoll=!1,this._context=null,this.onInputContextBind=this.onInputContextBind.bind(this),this.onInputContextUnbind=this.onInputContextUnbind.bind(this),this.onInputContextFocus=this.onInputContextFocus.bind(this),this.onInputContextBlur=this.onInputContextBlur.bind(this)}connectedCallback(){if(Object.prototype.hasOwnProperty.call(this,"for")){let t=this.for;delete this.for,this.for=t}if(Object.prototype.hasOwnProperty.call(this,"autopoll")){let t=this.autopoll;delete this.autopoll,this.autopoll=t}this.updateTable(),this.updateTableValues(),this.animationFrameHandle=window.requestAnimationFrame(this.onAnimationFrame)}disconnectedCallback(){let t=this._context;t&&(t.removeEventListener("bind",this.onInputContextBind),t.removeEventListener("unbind",this.onInputContextUnbind),t.removeEventListener("blur",this.onInputContextBlur),t.removeEventListener("focus",this.onInputContextFocus),t.destroy(),this._context=null)}attributeChangedCallback(t,e,n){switch(t){case"for":{this._for=n;let i,s;n?(i=document.getElementById(n),s=`${i.tagName.toLowerCase()}#${n}`):(i=this,s="input-port"),this._eventTarget=i,this._context&&this._context.setEventTarget(this._eventTarget),this._titleElement.innerHTML=`for ${s}`}break;case"autopoll":this._autopoll=n!==null,this._context&&this._context.toggleAutoPoll(this._autopoll);break}}onAnimationFrame(){this.animationFrameHandle=window.requestAnimationFrame(this.onAnimationFrame),this.updateTableValues(),this.updatePollStatus()}onInputContextBind(){return this.updateTable(),!0}onInputContextUnbind(){return this.updateTable(),!0}onInputContextFocus(){return this._focusElement.innerHTML="\u2713",!0}onInputContextBlur(){return this._focusElement.innerHTML="",!0}getContext(t="axisbutton",e=void 0){switch(t){case"axisbutton":if(!this._context){let n=new at(this._eventTarget,e);n.addEventListener("bind",this.onInputContextBind),n.addEventListener("unbind",this.onInputContextUnbind),n.addEventListener("blur",this.onInputContextBlur),n.addEventListener("focus",this.onInputContextFocus),this._autopoll&&n.toggleAutoPoll(!0),this._context=n}return this._context;default:throw new Error(`Input context id '${t}' is not supported.`)}}updateTable(){if(this.isConnected)if(this._context){let t=this._context,e=t.inputs,n=t.bindings,i={},s=[];for(let a of Object.keys(e)){let r=e[a],d=!0;for(let c of n.getBindingsByInput(r)){let u=Pt(`${r.constructor.name}.${a}`,`${c.device}.${c.code}`,0,d);s.push(u),d&&(i[a]=u.querySelector("output"),d=!1)}}this._outputElements=i,this._bodyElement.innerHTML="";for(let a of s)this._bodyElement.appendChild(a)}else{this._outputElements={},this._bodyElement.innerHTML="";return}else return}updateTableValues(){if(this.isConnected)if(this._context){let e=this._context.inputs;for(let n of Object.keys(this._outputElements)){let i=this._outputElements[n],s=e[n].value;i.innerText=Number(s).toFixed(2)}}else{for(let t of Object.keys(this._outputElements)){let e=this._outputElements[t];e.innerText="---"}return}else return}updatePollStatus(){if(this.isConnected)if(this._context){let e=this._context.inputs;for(let n of Object.values(e))if(!n.polling){this._pollElement.innerHTML="";return}this._pollElement.innerHTML="\u2713"}else{this._pollElement.innerHTML="-";return}else return}};T.define();function Pt(o,t,e,n=!0){let i=document.createElement("tr");n&&i.classList.add("primary");{let s=document.createElement("td");s.textContent=o,s.classList.add("name"),i.appendChild(s)}{let s=document.createElement("td"),a=document.createElement("output");n?a.innerText=Number(e).toFixed(2):a.innerText="---",a.classList.add("value"),s.appendChild(a),i.appendChild(s)}{let s=document.createElement("td");s.classList.add("key");let a=new k;a.innerText=t,s.appendChild(a),i.appendChild(s)}return i}var _n=Symbol("keyboardSource");var wn=Symbol("mouseSource");window.addEventListener("error",A,!0);window.addEventListener("unhandledrejection",A,!0);function A(o){typeof o=="object"?o instanceof PromiseRejectionEvent?A(o.reason):o instanceof ErrorEvent?A(o.error):o instanceof Error?window.alert(o.stack):window.alert(JSON.stringify(o)):window.alert(o)}var H=class{next(){return 0}},rt=class extends H{next(){return Math.random()}},lt=class extends H{constructor(t){super();this.seed=t,this.a=t}next(){var t=this.a+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}},F=class{static get RAND(){let t=new this;return this.next=this.next.bind(this),this.choose=this.choose.bind(this),this.range=this.range.bind(this),this.rangeInt=this.rangeInt.bind(this),this.sign=this.sign.bind(this),Object.defineProperty(this,"RAND",{value:t}),t}constructor(t=void 0){typeof t=="number"?this.generator=new lt(t):t?this.generator=t:this.generator=new rt,this.next=this.next.bind(this),this.choose=this.choose.bind(this),this.range=this.range.bind(this),this.rangeInt=this.rangeInt.bind(this),this.sign=this.sign.bind(this)}static next(){return this.RAND.next()}next(){return this.generator.next()}static choose(t){return this.RAND.choose(t)}choose(t){return t[Math.floor(this.generator.next()*t.length)]}static range(t,e){return this.RAND.range(t,e)}range(t,e){return(e-t)*this.generator.next()+t}static rangeInt(t,e){return this.RAND.rangeInt(t,e)}rangeInt(t,e){return Math.trunc(this.range(t,e))}static sign(){return this.RAND.sign()}sign(){return this.generator.next()<.5?-1:1}};var ht=["back","main","fore"],Ht={back:"#000000",main:"#333333",fore:"#888888"},Ft={back:.3,main:.5,fore:1},Ut={back:0,main:-8,fore:-16},Yt=["back","back","back","back","main","main","fore"],zt=80,C=new F,Wt=()=>C.choose(Yt),$t=o=>Math.trunc(C.range(0,o)),Gt=()=>Math.trunc(C.range(16,32)),jt=()=>Math.trunc(C.range(36,80)),S=80,U=8,dt=6,Y=64;function qt(o){let t="main",e={x:0,width:36,height:16,layer:t};return o.background.buildings.push(e),o.background.buildingLayers[t].push(e),e}function ut(o,t){t.x=$t(o.display.width),t.width=Gt(),t.height=jt();let e=t.layer,n=Wt(),i=o.background.buildingLayers;i[e].splice(i[e].indexOf(t),1),i[n].push(t),t.layer=n}function ct(o){o.background={buildingLayers:{fore:[],back:[],main:[]},buildings:[],progress:0};for(let t=0;t<zt;++t){let e=qt(o);ut(o,e)}}function pt(o,t){t.background.progress+=o;for(let e of ht)for(let n of t.background.buildingLayers[e])n.x>t.display.width?(ut(t,n),n.x-=t.display.width+n.width):n.x+=Ft[e]}function ft(o,t){let e=t.display.width,n=t.display.height;o.fillStyle="#561435",o.fillRect(0,0,e,n),o.fillStyle="#8e3e13",o.fillRect(0,0,e,n/3),o.fillStyle="#a09340",o.fillRect(0,0,e,n/10),o.fillStyle="#e8d978",o.fillRect(0,0,e,n/30);for(let r of ht){o.fillStyle=Ht[r];for(let d of t.background.buildingLayers[r])Vt(o,t,d)}let i=n-Y;o.fillStyle="#000000";let s=i-U,a=t.background.progress%S*dt;o.translate(a,s);for(let r=-S*dt;r<e;r+=S)o.translate(r,0),Xt(o,t),o.translate(-r,0);o.translate(-a,-s),o.fillStyle="#000000",o.fillRect(0,i,e,Y)}function Xt(o,t){let e=5,n=S/e;for(let i=0;i<e;++i){let s=i*n,a=s%3;o.translate(s,0),o.fillRect(0,-a*2,3,U+a*2),o.fillRect(8,0,3,U),o.fillRect(0,2+a,n,3),o.translate(-s,0)}}function Vt(o,t,e){let n=Ut[e.layer],i=Math.trunc(e.x),s=Math.trunc(t.display.height-Y-e.height-n);o.translate(i,s),o.fillRect(0,0,e.width,e.height+n),o.translate(-i,-s)}var g=Symbol("animatedText"),Zt=1e6,mt=30,gt=300,Qt=mt,Jt=/\s/,Et=/[.!?]/,yt=/[-,:;]/,te=/[.-]/;function ee(o,t){if(Jt.test(t)||te.test(o)){if(Et.test(o))return 800;if(yt.test(o))return 250}else{if(Et.test(o))return 200;if(yt.test(o))return 100}return mt}var bt=class{constructor(t,e=1){this.rootElement=t,this.targetNode=null,this.animatedNodes=new Set,this.nodeContents=new Map,this.deltaTime=0,this.prevTime=0,this.waitTime=gt,this.targetText="",this.index=-1,this.disabled=!0,this.complete=!1,this.speed=e,this.callback=null,this.error=null,this.animationFrameHandle=null,this.onAnimationFrame=this.onAnimationFrame.bind(this)}toggle(t=!this.disabled){t?this.pause():this.resume()}pause(){this.disabled=!0,cancelAnimationFrame(this.animationFrameHandle),this.animationFrameHandle=null,this.deltaTime=this.waitTime}resume(){this.disabled=!1,this.canSafelyResumeWithTarget(this.targetNode)||(this.targetNode=null),this.prevTime=performance.now(),this.animationFrameHandle=requestAnimationFrame(this.onAnimationFrame)}reset(){this.targetNode=null,this.animatedNodes.clear()}skipAll(){this.targetNode&&(this.targetNode.nodeValue=this.targetText,this.targetNode=null),this.completeRemainingChildText()}onAnimationFrame(t){if(this.animationFrameHandle=requestAnimationFrame(this.onAnimationFrame),this.targetNode==null){let s=this.findNextChildText();if(s){let a=s.previousSibling||window.getComputedStyle(s.parentElement).display==="inline";this.targetNode=s,this.targetText=this.nodeContents.get(s),this.animatedNodes.add(s),this.index=-1,this.waitTime=a?Qt:gt,this.deltaTime=0,this.complete=!1}else{this.complete=!0,this.callback.call(void 0);return}}let e=t-this.prevTime;if(this.deltaTime+=e*this.speed,this.prevTime=t,e>Zt){this.skipAll(),this.error(new Error("Frame took too long; skipping animation."));return}let n=this.targetText,i=!1;for(;!i&&this.deltaTime>=this.waitTime;){this.deltaTime-=this.waitTime;let s=++this.index;if(s<n.length){let a=n.charAt(s),r=n.charAt(s+1);this.waitTime=ee(a,r)}else this.index=n.length,i=!0}if(i)this.targetNode.nodeValue=n,this.targetNode=null;else{let s=n.substring(0,this.index+1);this.targetNode.nodeValue=s}}canSafelyResumeWithTarget(t){if(!t||!t.isConnected)return!1;let e=t.nodeValue,n=this.targetText.substring(0,this.index+1);return e===n}completeRemainingChildText(t=this.rootElement){for(let e of t.childNodes)e instanceof Text?this.nodeContents.has(e)&&(this.animatedNodes.has(e)||(e.nodeValue=this.nodeContents.get(e),this.animatedNodes.add(e))):this.completeRemainingChildText(e)}findNextChildText(t=this.rootElement,e=null){for(let n of t.childNodes)if(n instanceof Text){let i=this.animatedNodes.has(n),s=n.nodeValue;s&&s.trim().length>0&&this.nodeContents.get(n)!==s&&(this.nodeContents.set(n,s),n.nodeValue="",i&&this.animatedNodes.delete(n)),!e&&!i&&this.nodeContents.has(n)&&(e=n)}else e=this.findNextChildText(n,e);return e}},z={async play(o,t=1){if(!(o instanceof Element))throw new Error("Cannot animate text for non-element.");if(t<=0)throw new Error("Cannot animate text at non-positive speed.");let e=new bt(o,t);return o[g]=e,new Promise((n,i)=>{e.error=s=>{i(s)},e.callback=()=>{e.pause(),delete o[g],n()},e.resume()})},pause(o){o&&g in o&&o[g].pause()},resume(o){o&&g in o&&o[g].resume()},skip(o){o&&g in o&&o[g].skipAll()},toggle(o,t=void 0){o&&g in o&&o[g].toggle(t)}};function vt(o){let t=document.createElement("div");t.style.position="absolute",t.style.bottom="0.8em",t.style.right="0.8em",t.innerHTML=`
        <style>
            .container {
                position: relative;
                background-color: #091b3d;
                color: #eeeeee;
                padding: 0.5em;
                width: 20em;
                height: 5em;
                overflow: auto;
                font-family: monospace;
            }
        </style>
        <div class="container">
            <article>
                There is something amiss in Marde. The stench of unrest is baked into every nook and alley and not a corner is left
                untainted
                by the foulness of its mindless residents. No windows unshattered. No doors unlocked.
            </article>
        </div>`,o.display.appendChild(t);let e=t.querySelector("article");e.addEventListener("click",()=>{z.skip(e)}),z.play(e),o.dialogue={text:"",element:t}}function _t(o,t){}function wt(o,t){}function xt(o){let t=document.createElement("div"),e=document.createElement("button");e.textContent="VACANT",e.style.backgroundColor="#aa3333",e.style.color="#eeeeee",e.style.border="0.3em ridge #660000",e.style.fontSize="1.5em",e.style.padding="0.1em 0.5em",e.style.position="absolute",e.style.left="0.2em",e.style.bottom="0.2em",t.appendChild(e);let n=document.createElement("label");n.textContent="0000 fare",n.style.color="#eeeeee",n.style.fontSize="1.5em",n.style.position="absolute",n.style.bottom="0.2em",n.style.left="7em",t.appendChild(n),o.display.appendChild(t)}function Tt(o,t){}function At(o,t){}b.define();window.addEventListener("DOMContentLoaded",ne);async function ne(){let o=document.querySelector("#display"),t=o.canvas.getContext("2d"),e={display:o,ctx:t,frames:0};ct(e),vt(e),xt(e),o.addEventListener("frame",n=>{let{deltaTime:i}=n.detail,s=i/60;ie(s,e),se(t,e),e.frames+=1})}function ie(o,t){pt(o,t),_t(o,t),Tt(o,t)}function se(o,t){o.fillStyle="#000000",o.fillRect(0,0,t.display.width,t.display.height),ft(o,t),wt(o,t),At(o,t)}})();
//# sourceMappingURL=main.js.map
