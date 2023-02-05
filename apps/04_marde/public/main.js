(()=>{var bt=`<div class="container">
  <label class="hidden" id="title">display-port</label>
  <label class="hidden" id="fps">00</label>
  <label class="hidden" id="dimension">0x0</label>
  <div class="content">
    <canvas> Oh no! Your browser does not support canvas. </canvas>
    <slot id="inner"></slot>
  </div>
  <slot name="frame"></slot>
</div>
`,_t=`:host {
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
}
`,H="noscale",x="fit",F="scale",Y="fill",W="stretch",vt=300,yt=150,wt=x,Tt=200,z=class extends HTMLElement{static get[Symbol.for("templateNode")](){let t=document.createElement("template");return t.innerHTML=bt,Object.defineProperty(this,Symbol.for("templateNode"),{value:t}),t}static get[Symbol.for("styleNode")](){let t=document.createElement("style");return t.innerHTML=_t,Object.defineProperty(this,Symbol.for("styleNode"),{value:t}),t}static define(t=window.customElements){t.define("display-port",this)}static get observedAttributes(){return["debug","disabled","width","height","onframe","id","class"]}get mode(){return this.getAttribute("mode")}set mode(t){this.setAttribute("mode",t)}get debug(){return this._debug}set debug(t){this.toggleAttribute("debug",t)}get disabled(){return this._disabled}set disabled(t){this.toggleAttribute("disabled",t)}get width(){return this._width}set width(t){this.setAttribute("width",String(t))}get height(){return this._height}set height(t){this.setAttribute("height",String(t))}get onframe(){return this._onframe}set onframe(t){this._onframe&&this.removeEventListener("frame",this._onframe),this._onframe=t,this._onframe&&this.addEventListener("frame",t)}constructor(){super();let t=this.attachShadow({mode:"open"});t.appendChild(this.constructor[Symbol.for("templateNode")].content.cloneNode(!0)),t.appendChild(this.constructor[Symbol.for("styleNode")].cloneNode(!0)),this._canvasElement=t.querySelector("canvas"),this._contentElement=t.querySelector(".content"),this._innerElement=t.querySelector("#inner"),this._titleElement=t.querySelector("#title"),this._fpsElement=t.querySelector("#fps"),this._dimensionElement=t.querySelector("#dimension"),this._debug=!1,this._disabled=!1,this._width=vt,this._height=yt,this._onframe=void 0,this._animationRequestHandle=0,this._prevAnimationFrameTime=0,this._resizeTimeoutHandle=0,this._resizeCanvasWidth=0,this._resizeCanvasHeight=0,this._frameEvent=new CustomEvent("frame",{composed:!0,bubbles:!1,detail:{now:0,prevTime:0,deltaTime:0,canvas:this._canvasElement}}),this._resizeEvent=new CustomEvent("resize",{composed:!0,bubbles:!1,detail:{width:0,height:0}}),this.update=this.update.bind(this),this.onDelayCanvasResize=this.onDelayCanvasResize.bind(this)}get canvas(){return this._canvasElement}connectedCallback(){b(this,"mode"),b(this,"debug"),b(this,"disabled"),b(this,"width"),b(this,"height"),b(this,"onframe"),this.hasAttribute("mode")||this.setAttribute("mode",wt),this.hasAttribute("tabindex")||this.setAttribute("tabindex","0"),this.updateCanvasSize(!0),this.resume()}disconnectedCallback(){this.pause()}attributeChangedCallback(t,e,n){switch(t){case"debug":this._debug=n!==null;break;case"disabled":this._disabled=n!==null;break;case"width":this._width=Number(n);break;case"height":this._height=Number(n);break;case"onframe":this.onframe=new Function("event","with(document){with(this){"+n+"}}").bind(this);break}switch(t){case"disabled":n?(this.update(0),this.pause()):this.resume();break;case"id":case"class":this._titleElement.innerHTML=`display-port${this.className?"."+this.className:""}${this.hasAttribute("id")?"#"+this.getAttribute("id"):""}`;break;case"debug":this._titleElement.classList.toggle("hidden",n),this._fpsElement.classList.toggle("hidden",n),this._dimensionElement.classList.toggle("hidden",n);break}}getContext(t="2d",e=void 0){return this._canvasElement.getContext(t,e)}pause(){cancelAnimationFrame(this._animationRequestHandle)}resume(){this._animationRequestHandle=requestAnimationFrame(this.update)}update(t){this._animationRequestHandle=requestAnimationFrame(this.update),this.updateCanvasSize(!1);let e=t-this._prevAnimationFrameTime;if(this._prevAnimationFrameTime=t,this._debug){let o=e<=0?"--":String(Math.round(1e3/e)).padStart(2,"0");if(this._fpsElement.textContent!==o&&(this._fpsElement.textContent=o),this.mode===H){let h=`${this._width}x${this._height}`;this._dimensionElement.textContent!==h&&(this._dimensionElement.textContent=h)}else{let h=`${this._width}x${this._height}|${this.shadowRoot.host.clientWidth}x${this.shadowRoot.host.clientHeight}`;this._dimensionElement.textContent!==h&&(this._dimensionElement.textContent=h)}}let i=this._frameEvent.detail;i.now=t,i.prevTime=this._prevAnimationFrameTime,i.deltaTime=e,this.dispatchEvent(this._frameEvent)}onDelayCanvasResize(){this._resizeTimeoutHandle=0,this.updateCanvasSize(!0)}delayCanvasResize(t,e){(t!==this._resizeCanvasWidth||e!==this._resizeCanvasHeight)&&(this._resizeCanvasWidth=t,this._resizeCanvasHeight=e,this._resizeTimeoutHandle&&clearTimeout(this._resizeTimeoutHandle),this._resizeTimeoutHandle=setTimeout(this.onDelayCanvasResize,Tt))}updateCanvasSize(t=!0){let e=this.shadowRoot.host.getBoundingClientRect(),n=e.width,i=e.height,o=this._canvasElement,a=this._width,h=this._height,u=this.mode;if(u===W||u===Y)a=n,h=i;else if(u!==H&&(n<a||i<h||u===x||u==F)){let d=n/a,p=i/h;d<p?(a=n,h=h*d):(a=a*p,h=i)}if(a=Math.floor(a),h=Math.floor(h),typeof t=="undefined"&&(t=o.clientWidth!==a||o.clientHeight!==h),!t){this.delayCanvasResize(a,h);return}let c=Math.min(a/this._width,h/this._height)*.5;if(this._innerElement.style.fontSize=`font-size: ${c}em`,t){u===F?(o.width=this._width,o.height=this._height):u!==W&&(o.width=a,o.height=h);let d=this._contentElement.style;d.width=`${a}px`,d.height=`${h}px`,(u===x||u===Y)&&(this._width=a,this._height=h);let f=this._resizeEvent.detail;f.width=a,f.height=h,this.dispatchEvent(this._resizeEvent)}}};z.define();function b(s,t){if(Object.prototype.hasOwnProperty.call(s,t)){let e=s[t];delete s[t],s[t]=e}}var A=class{get polling(){return performance.now()-this._lastPollingTime<1e3}get value(){return 0}get size(){return this._size}constructor(t){this._size=t,this._lastPollingTime=Number.MIN_SAFE_INTEGER}resize(t){this._size=t}getState(t){throw new Error("Missing implementation.")}onUpdate(t,e,n){throw new Error("Missing implementation.")}onStatus(t,e){throw new Error("Missing implementation.")}onPoll(t){this._lastPollingTime=t}onBind(t,e=void 0){t>=this._size&&this.resize(t+1)}onUnbind(){this.resize(0)}},_=class extends A{static createAxisBindingState(){return{value:0,delta:0,inverted:!1}}get delta(){return this._delta}get value(){return this._value}constructor(t=0){super(t);let e=new Array,n=this.constructor;for(let i=0;i<t;++i)e.push(n.createAxisBindingState());this._state=e,this._value=0,this._delta=0}resize(t){let e=this._state,n=e.length,i;if(t<=n)i=e.slice(0,t);else{i=e;let o=this.constructor;for(let a=n;a<t;++a)i.push(o.createAxisBindingState())}this._state=i,super.resize(t)}getState(t){return this._state[t].value}onPoll(t){let e=this._state,n=0,i=0,o=e.length;for(let a=0;a<o;++a){let h=e[a];n+=h.value*(h.inverted?-1:1),i+=h.delta,e[a].delta=0}this._value=n,this._delta=i,super.onPoll(t)}onUpdate(t,e,n){typeof e=="undefined"?this.onAxisChange(t,n):this.onAxisMove(t,e,n)}onStatus(t,e){this.onAxisStatus(t,e)}onBind(t,e=void 0){super.onBind(t,e);let{inverted:n=!1}=e||{},i=this._state;i[t].inverted=n}onAxisMove(t,e,n){let i=this._state[t];i.value=e,i.delta+=n}onAxisChange(t,e){let n=this._state[t];n.value+=e,n.delta+=e}onAxisStatus(t,e){let n=this._state[t],i=n.value;n.value=e,n.delta=e-i}},xt=241,G=254,At=239,E=1,L=2,C=4,I=8,S=16,v=class extends A{get pressed(){return this._pressed}get repeated(){return this._repeated}get released(){return this._released}get down(){return this._down}get value(){return this._value}constructor(t=0){super(t);this._state=new Uint8Array(t),this._value=0,this._down=!1,this._pressed=!1,this._repeated=!1,this._released=!1}resize(t){let e=this._state,n=e.length,i;t<=n?i=e.slice(0,t):(i=new Uint8Array(t),i.set(e)),this._state=i,super.resize(t)}getState(t){let e=this._state[t],n=e&S?-1:1;return(e&E?1:0)*n}onPoll(t){let e=this._state,n=0,i=0,o=0,a=0,h=0,u=e.length;for(let c=0;c<u;++c){let d=e[c],p=d&E,f=d&S;i|=p,o|=d&L,a|=d&C,h|=d&I,n+=(p?1:0)*(f?-1:1),e[c]&=xt}this._value=n,this._down=i!==0,this._pressed=o!==0,this._repeated=a!==0,this._released=h!==0,super.onPoll(t)}onUpdate(t,e,n){n>0?this.onButtonPressed(t):this.onButtonReleased(t)}onStatus(t,e){this.onButtonStatus(t,e!==0)}onBind(t,e={inverted:!1}){super.onBind(t,e);let{inverted:n=!1}=e,i=this._state;n?i[t]|=S:i[t]&=At}onButtonPressed(t){let e=this._state,n=e[t];n&E||(n|=L,n|=E),n|=C,e[t]=n}onButtonReleased(t){let e=this._state,n=e[t];n&E&&(n|=I,n&=G),e[t]=n}onButtonStatus(t,e){let n=this._state,i=n[t],o=Boolean(i&E);e?i|=E:i&=G,o&&!e&&(i|=I),!o&&e&&(i|=L,i|=C),n[t]=i}},r=class{static parse(t){t=t.trim();let e=t.indexOf(".");if(e<0)throw new Error("Missing device separator for key code.");let n=t.substring(0,e);if(n.length<0)throw new Error("Missing device for key code.");let i=t.substring(e+1);if(i.length<0)throw new Error("Missing code for key code.");return new r(n,i)}constructor(t,e){this.device=t,this.code=e}toString(){return`${this.device}.${this.code}`}};var l="Keyboard",m="Mouse",Qt=new r(l,"KeyA"),Jt=new r(l,"KeyB"),te=new r(l,"KeyC"),ee=new r(l,"KeyD"),ne=new r(l,"KeyE"),ie=new r(l,"KeyF"),se=new r(l,"KeyG"),oe=new r(l,"KeyH"),ae=new r(l,"KeyI"),re=new r(l,"KeyJ"),le=new r(l,"KeyK"),he=new r(l,"KeyL"),de=new r(l,"KeyM"),ue=new r(l,"KeyN"),ce=new r(l,"KeyO"),pe=new r(l,"KeyP"),fe=new r(l,"KeyQ"),me=new r(l,"KeyR"),ge=new r(l,"KeyS"),Ee=new r(l,"KeyT"),be=new r(l,"KeyU"),_e=new r(l,"KeyV"),ve=new r(l,"KeyW"),ye=new r(l,"KeyX"),we=new r(l,"KeyY"),Te=new r(l,"KeyZ"),xe=new r(l,"Digit0"),Ae=new r(l,"Digit1"),Le=new r(l,"Digit2"),Ce=new r(l,"Digit3"),Ie=new r(l,"Digit4"),Se=new r(l,"Digit5"),Be=new r(l,"Digit6"),Me=new r(l,"Digit7"),Ke=new r(l,"Digit8"),De=new r(l,"Digit9"),Oe=new r(l,"Minus"),Re=new r(l,"Equal"),ke=new r(l,"BracketLeft"),Ne=new r(l,"BracketRight"),Pe=new r(l,"Semicolon"),Ue=new r(l,"Quote"),He=new r(l,"Backquote"),Fe=new r(l,"Backslash"),Ye=new r(l,"Comma"),We=new r(l,"Period"),ze=new r(l,"Slash"),Ge=new r(l,"Escape"),je=new r(l,"Space"),qe=new r(l,"CapsLock"),Xe=new r(l,"Backspace"),$e=new r(l,"Delete"),Ve=new r(l,"Tab"),Ze=new r(l,"Enter"),Qe=new r(l,"ArrowUp"),Je=new r(l,"ArrowDown"),tn=new r(l,"ArrowLeft"),en=new r(l,"ArrowRight"),nn=new r(m,"Button0"),sn=new r(m,"Button1"),on=new r(m,"Button2"),an=new r(m,"Button3"),rn=new r(m,"Button4"),ln=new r(m,"PosX"),hn=new r(m,"PosY"),dn=new r(m,"WheelX"),un=new r(m,"WheelY"),cn=new r(m,"WheelZ");var B=class{static isAxis(t){return!1}static isButton(t){return!1}constructor(t,e){if(!e)throw new Error(`Missing event target for device ${t}.`);this.name=t,this.eventTarget=e,this.listeners={input:[]}}setEventTarget(t){if(!t)throw new Error(`Missing event target for device ${this.name}.`);this.eventTarget=t}destroy(){let t=this.listeners;for(let e in t)t[e].length=0}addEventListener(t,e){let n=this.listeners;t in n?n[t].push(e):n[t]=[e]}removeEventListener(t,e){let n=this.listeners;if(t in n){let i=n[t],o=i.indexOf(e);o>=0&&i.splice(o,1)}}dispatchInputEvent(t){let e=0;for(let n of this.listeners.input)e|=n(t);return Boolean(e)}},j=class extends B{static isAxis(t){return!1}static isButton(t){return!0}constructor(t,e,n={}){super(t,e);let{ignoreRepeat:i=!0}=n;this.ignoreRepeat=i,this._eventObject={target:e,device:t,code:"",event:"",value:0,control:!1,shift:!1,alt:!1},this.onKeyDown=this.onKeyDown.bind(this),this.onKeyUp=this.onKeyUp.bind(this),e.addEventListener("keydown",this.onKeyDown),e.addEventListener("keyup",this.onKeyUp)}setEventTarget(t){this.eventTarget&&this.destroy(),super.setEventTarget(t),t.addEventListener("keydown",this.onKeyDown),t.addEventListener("keyup",this.onKeyUp)}destroy(){let t=this.eventTarget;t.removeEventListener("keydown",this.onKeyDown),t.removeEventListener("keyup",this.onKeyUp),super.destroy()}onKeyDown(t){if(t.repeat&&this.ignoreRepeat)return t.preventDefault(),t.stopPropagation(),!1;let e=this._eventObject;if(e.code=t.code,e.event="pressed",e.value=1,e.control=t.ctrlKey,e.shift=t.shiftKey,e.alt=t.altKey,this.dispatchInputEvent(e))return t.preventDefault(),t.stopPropagation(),!1}onKeyUp(t){let e=this._eventObject;if(e.code=t.code,e.event="released",e.value=1,e.control=t.ctrlKey,e.shift=t.shiftKey,e.alt=t.altKey,this.dispatchInputEvent(e))return t.preventDefault(),t.stopPropagation(),!1}},M=10,K=100,q=class extends B{static isAxis(t){return t==="PosX"||t==="PosY"||t==="WheelX"||t==="WheelY"||t==="WheelZ"}static isButton(t){return!this.isAxis(t)}constructor(t,e,n={}){super(t,e);let{eventsOnFocus:i=!0}=n;this.eventsOnFocus=i,this.canvasTarget=this.getCanvasFromEventTarget(e),this._downHasFocus=!1,this._eventObject={target:e,device:t,code:"",event:"",value:0,control:!1,shift:!1,alt:!1},this._positionObject={target:e,device:t,code:"",event:"move",value:0,movement:0},this._wheelObject={target:e,device:t,code:"",event:"wheel",movement:0},this.onMouseDown=this.onMouseDown.bind(this),this.onMouseUp=this.onMouseUp.bind(this),this.onMouseMove=this.onMouseMove.bind(this),this.onContextMenu=this.onContextMenu.bind(this),this.onWheel=this.onWheel.bind(this),e.addEventListener("mousedown",this.onMouseDown),e.addEventListener("contextmenu",this.onContextMenu),e.addEventListener("wheel",this.onWheel),document.addEventListener("mousemove",this.onMouseMove),document.addEventListener("mouseup",this.onMouseUp)}setEventTarget(t){this.eventTarget&&this.destroy(),super.setEventTarget(t),this.canvasTarget=this.getCanvasFromEventTarget(t),t.addEventListener("mousedown",this.onMouseDown),t.addEventListener("contextmenu",this.onContextMenu),t.addEventListener("wheel",this.onWheel),document.addEventListener("mousemove",this.onMouseMove),document.addEventListener("mouseup",this.onMouseUp)}destroy(){let t=this.eventTarget;t.removeEventListener("mousedown",this.onMouseDown),t.removeEventListener("contextmenu",this.onContextMenu),t.removeEventListener("wheel",this.onWheel),document.removeEventListener("mousemove",this.onMouseMove),document.removeEventListener("mouseup",this.onMouseUp),super.destroy()}setPointerLock(t=!0){t?this.eventTarget.requestPointerLock():this.eventTarget.exitPointerLock()}hasPointerLock(){return document.pointerLockElement===this.eventTarget}onMouseDown(t){this._downHasFocus=!0;let e=this._eventObject;if(e.code="Button"+t.button,e.event="pressed",e.value=1,e.control=t.ctrlKey,e.shift=t.shiftKey,e.alt=t.altKey,this.dispatchInputEvent(e)&&document.activeElement===this.eventTarget)return t.preventDefault(),t.stopPropagation(),!1}onContextMenu(t){return t.preventDefault(),t.stopPropagation(),!1}onWheel(t){let e,n,i;switch(t.deltaMode){case WheelEvent.DOM_DELTA_LINE:e=t.deltaX*M,n=t.deltaY*M,i=t.deltaZ*M;break;case WheelEvent.DOM_DELTA_PAGE:e=t.deltaX*K,n=t.deltaY*K,i=t.deltaZ*K;break;case WheelEvent.DOM_DELTA_PIXEL:default:e=t.deltaX,n=t.deltaY,i=t.deltaZ;break}let o=0,a=this._wheelObject;if(a.code="WheelX",a.movement=e,o|=this.dispatchInputEvent(a),a.code="WheelY",a.movement=n,o|=this.dispatchInputEvent(a),a.code="WheelZ",a.movement=i,o|=this.dispatchInputEvent(a),o)return t.preventDefault(),t.stopPropagation(),!1}onMouseUp(t){if(!this._downHasFocus)return;this._downHasFocus=!1;let e=this._eventObject;if(e.code="Button"+t.button,e.event="released",e.value=1,e.control=t.ctrlKey,e.shift=t.shiftKey,e.alt=t.altKey,this.dispatchInputEvent(e))return t.preventDefault(),t.stopPropagation(),!1}onMouseMove(t){if(this.eventsOnFocus&&document.activeElement!==this.eventTarget)return;let e=this.canvasTarget,{clientWidth:n,clientHeight:i}=e,o=e.getBoundingClientRect(),a=t.movementX/n,h=t.movementY/i,u=(t.clientX-o.left)/n,c=(t.clientY-o.top)/i,d=this._positionObject;d.code="PosX",d.value=u,d.movement=a,this.dispatchInputEvent(d),d.code="PosY",d.value=c,d.movement=h,this.dispatchInputEvent(d)}getCanvasFromEventTarget(t){return t instanceof HTMLCanvasElement?t:t.canvas||t.querySelector("canvas")||t.shadowRoot&&t.shadowRoot.querySelector("canvas")||t}},Lt=`<kbd>
  <span id="name"><slot></slot></span>
  <span id="value" class="hidden"></span>
</kbd>
`,Ct=`kbd {
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
`,D=class extends HTMLElement{static get[Symbol.for("templateNode")](){let t=document.createElement("template");return t.innerHTML=Lt,Object.defineProperty(this,Symbol.for("templateNode"),{value:t}),t}static get[Symbol.for("styleNode")](){let t=document.createElement("style");return t.innerHTML=Ct,Object.defineProperty(this,Symbol.for("styleNode"),{value:t}),t}static define(t=window.customElements){t.define("input-code",this)}static get observedAttributes(){return["name","value","disabled"]}get disabled(){return this._disabled}set disabled(t){this.toggleAttribute("disabled",t)}get value(){return this._value}set value(t){this.setAttribute("value",t)}get name(){return this._name}set name(t){this.setAttribute("name",t)}constructor(){super();let t=this.constructor,e=this.attachShadow({mode:"open"});e.appendChild(t[Symbol.for("templateNode")].content.cloneNode(!0)),e.appendChild(t[Symbol.for("styleNode")].cloneNode(!0)),this._name="",this._value="",this._disabled=!1,this._kbdElement=e.querySelector("kbd"),this._nameElement=e.querySelector("#name"),this._valueElement=e.querySelector("#value")}attributeChangedCallback(t,e,n){switch(t){case"name":this._name=n,this._nameElement.textContent=n;break;case"value":this._value=n,n!==null?(this._valueElement.classList.toggle("hidden",!1),this._valueElement.textContent=n,this._kbdElement.style.paddingRight=`${this._valueElement.clientWidth+4}px`):this._valueElement.classList.toggle("hidden",!0);break;case"disabled":this._disabled=n!==null,this._kbdElement.classList.toggle("disabled",n!==null);break}}connectedCallback(){if(Object.prototype.hasOwnProperty.call(this,"name")){let t=this.name;delete this.name,this.name=t}if(Object.prototype.hasOwnProperty.call(this,"value")){let t=this.value;delete this.value,this.value=t}if(Object.prototype.hasOwnProperty.call(this,"disabled")){let t=this.disabled;delete this.disabled,this.disabled=t}}};D.define();var It=`<table>
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
`,St=`:host {
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
`,X=class{constructor(t){this.onAnimationFrame=this.onAnimationFrame.bind(this),this.animationFrameHandle=null,this.pollable=t}get running(){return this.animationFrameHandle!==null}start(){let t=this.animationFrameHandle;t&&cancelAnimationFrame(t),this.animationFrameHandle=requestAnimationFrame(this.onAnimationFrame)}stop(){let t=this.animationFrameHandle;t&&cancelAnimationFrame(t),this.animationFrameHandle=null}onAnimationFrame(t){this.animationFrameHandle=requestAnimationFrame(this.onAnimationFrame),this.pollable.onPoll(t)}},$=class{constructor(t){this.onInput=this.onInput.bind(this),this.onPoll=this.onPoll.bind(this),this.bindings=t}onPoll(t){for(let e of this.bindings.getInputs())e.onPoll(t)}onInput(t){let{device:e,code:n,event:i,value:o,movement:a,control:h,shift:u,alt:c}=t,d=this.bindings.getBindings(e,n);switch(i){case"pressed":for(let{input:p,index:f}of d)p.onUpdate(f,1,1);break;case"released":for(let{input:p,index:f}of d)p.onUpdate(f,0,-1);break;case"move":for(let{input:p,index:f}of d)p.onUpdate(f,o,a);break;case"wheel":for(let{input:p,index:f}of d)p.onUpdate(f,void 0,a);break}return d.length>0}},O=class{constructor(t,e,n,i){this.device=t,this.code=e,this.input=n,this.index=i}},V=class{constructor(){this.bindingMap={},this.inputMap=new Map}clear(){for(let t of this.inputMap.keys())t.onUnbind();this.inputMap.clear(),this.bindingMap={}}bind(t,e,n,i={inverted:!1}){let o,a=this.inputMap;if(a.has(t)){let u=a.get(t),c=t.size;t.onBind(c,i),o=new O(e,n,t,c),u.push(o)}else{let u=[];a.set(t,u);let c=0;t.onBind(c,i),o=new O(e,n,t,c),u.push(o)}let h=this.bindingMap;e in h?n in h[e]?h[e][n].push(o):h[e][n]=[o]:h[e]={[n]:[o]}}unbind(t){let e=this.inputMap;if(e.has(t)){let n=this.bindingMap,i=e.get(t);for(let o of i){let{device:a,code:h}=o,u=n[a][h],c=u.indexOf(o);u.splice(c,1)}i.length=0,t.onUnbind(),e.delete(t)}}isBound(t){return this.inputMap.has(t)}getInputs(){return this.inputMap.keys()}getBindingsByInput(t){return this.inputMap.get(t)}getBindings(t,e){let n=this.bindingMap;if(t in n){let i=n[t];if(e in i)return i[e]}return[]}},Z=class{constructor(t,e=void 0){this.inputs={},this.devices=[new q("Mouse",t),new j("Keyboard",t)],this.bindings=new V,this.adapter=new $(this.bindings),this.autopoller=new X(this.adapter),this.eventTarget=t,this.anyButton=new v(1),this.anyButtonDevice="",this.anyButtonCode="",this.anyAxis=new _(1),this.anyAxisDevice="",this.anyAxisCode="",this.listeners={bind:[],unbind:[],focus:[],blur:[]},this.onInput=this.onInput.bind(this),this.onEventTargetBlur=this.onEventTargetBlur.bind(this),this.onEventTargetFocus=this.onEventTargetFocus.bind(this),t.addEventListener("focus",this.onEventTargetFocus),t.addEventListener("blur",this.onEventTargetBlur);for(let n of this.devices)n.addEventListener("input",this.onInput)}get autopoll(){return this.autopoller.running}set autopoll(t){this.toggleAutoPoll(t)}destroy(){let t=this.listeners;for(let n in t)t[n].length=0;this.autopoller.running&&this.autopoller.stop();for(let n of this.devices)n.removeEventListener("input",this.onInput),n.destroy();let e=this.eventTarget;e.removeEventListener("focus",this.onEventTargetFocus),e.removeEventListener("blur",this.onEventTargetBlur)}setEventTarget(t){let e=this.eventTarget;e.removeEventListener("focus",this.onEventTargetFocus),e.removeEventListener("blur",this.onEventTargetBlur),this.eventTarget=t;for(let n of this.devices)n.setEventTarget(t);t.addEventListener("focus",this.onEventTargetFocus),t.addEventListener("blur",this.onEventTargetBlur)}toggleAutoPoll(t=void 0){let e=this.autopoller.running,n=typeof t=="undefined"?!e:Boolean(t);n!==e&&(n?this.autopoller.start():this.autopoller.stop())}addEventListener(t,e){let n=this.listeners;t in n?n[t].push(e):n[t]=[e]}removeEventListener(t,e){let n=this.listeners;if(t in n){let i=n[t],o=i.indexOf(e);o>=0&&i.splice(o,1)}}dispatchEvent(t){let{type:e}=t,n=0;for(let i of this.listeners[e])n|=i(t)?1:0;return Boolean(n)}poll(t=performance.now()){if(this.autopoller.running)throw new Error("Should not manually poll() while autopolling.");this.onPoll(t)}onInput(t){let e=this.adapter.onInput(t);switch(t.event){case"pressed":this.anyButtonDevice=t.device,this.anyButtonCode=t.code,this.anyButton.onUpdate(0,1,1);break;case"released":this.anyButtonDevice=t.device,this.anyButtonCode=t.code,this.anyButton.onUpdate(0,0,-1);break;case"move":case"wheel":this.anyAxisDevice=t.device,this.anyAxisCode=t.code,this.anyAxis.onUpdate(0,t.value,t.movement);break}return e}onPoll(t){this.adapter.onPoll(t),this.anyButton.onPoll(t),this.anyAxis.onPoll(t)}onBind(){this.dispatchEvent({type:"bind"})}onUnbind(){this.dispatchEvent({type:"unbind"})}onEventTargetFocus(){this.dispatchEvent({type:"focus"})}onEventTargetBlur(){for(let t of this.bindings.getInputs())t.onStatus(0,0);this.anyButton.onStatus(0,0),this.anyAxis.onStatus(0,0),this.dispatchEvent({type:"blur"})}bindBindings(t){Array.isArray(t)||(t=Object.values(t));for(let e of t)e.bindTo(this)}bindBinding(t){t.bindTo(this)}bindButton(t,e,n,i=void 0){let o;this.hasButton(t)?o=this.getButton(t):(o=new v(1),this.inputs[t]=o),this.bindings.bind(o,e,n,i),this.onBind()}bindAxis(t,e,n,i=void 0){let o;this.hasAxis(t)?o=this.getAxis(t):(o=new _(1),this.inputs[t]=o),this.bindings.bind(o,e,n,i),this.onBind()}bindAxisButtons(t,e,n,i){let o;this.hasAxis(t)?o=this.getAxis(t):(o=new _(2),this.inputs[t]=o),this.bindings.bind(o,e,i),this.bindings.bind(o,e,n,{inverted:!0}),this.onBind()}unbindButton(t){if(this.hasButton(t)){let e=this.getButton(t);delete this.inputs[t],this.bindings.unbind(e),this.onUnbind()}}unbindAxis(t){if(this.hasAxis(t)){let e=this.getAxis(t);delete this.inputs[t],this.bindings.unbind(e),this.onUnbind()}}getInput(t){return this.inputs[t]}getButton(t){return this.inputs[t]}getAxis(t){return this.inputs[t]}hasButton(t){return t in this.inputs&&this.inputs[t]instanceof v}hasAxis(t){return t in this.inputs&&this.inputs[t]instanceof _}isButtonDown(t){return this.inputs[t].down}isButtonPressed(t){return this.inputs[t].pressed}isButtonReleased(t){return this.inputs[t].released}getInputValue(t){return this.inputs[t].value}getButtonValue(t){return this.inputs[t].value}getAxisValue(t){return this.inputs[t].value}getAxisDelta(t){return this.inputs[t].delta}isAnyButtonDown(t=void 0){if(typeof t=="undefined")return this.anyButton.down;{let e=this.inputs;for(let n of t)if(e[n].down)return!0}return!1}isAnyButtonPressed(t=void 0){if(typeof t=="undefined")return this.anyButton.pressed;{let e=this.inputs;for(let n of t)if(e[n].pressed)return!0}return!1}isAnyButtonReleased(t=void 0){if(typeof t=="undefined")return this.anyButton.released;{let e=this.inputs;for(let n of t)if(e[n].released)return!0}return!1}getAnyAxisValue(t=void 0){if(typeof t=="undefined")return this.anyAxis.value;{let e=this.inputs;for(let n of t){let i=e[n];if(i.value)return i.value}}return 0}getAnyAxisDelta(t=void 0){if(typeof t=="undefined")return this.anyAxis.delta;{let e=this.inputs;for(let n of t){let i=e[n];if(i.delta)return i.delta}}return 0}getLastButtonDevice(){return this.anyButtonDevice}getLastButtonCode(){return this.anyButtonCode}getLastAxisDevice(){return this.anyAxisDevice}getLastAxisCode(){return this.anyAxisCode}getMouse(){return this.devices[0]}getKeyboard(){return this.devices[1]}},Q=class extends HTMLElement{static get[Symbol.for("templateNode")](){let t=document.createElement("template");return t.innerHTML=It,Object.defineProperty(this,Symbol.for("templateNode"),{value:t}),t}static get[Symbol.for("styleNode")](){let t=document.createElement("style");return t.innerHTML=St,Object.defineProperty(this,Symbol.for("styleNode"),{value:t}),t}static define(t=window.customElements){t.define("input-port",this)}static get observedAttributes(){return["autopoll","for"]}get autopoll(){return this._autopoll}set autopoll(t){this.toggleAttribute("autopoll",t)}get for(){return this._for}set for(t){this.setAttribute("for",t)}constructor(){super();let t=this.attachShadow({mode:"open"});t.appendChild(this.constructor[Symbol.for("templateNode")].content.cloneNode(!0)),t.appendChild(this.constructor[Symbol.for("styleNode")].cloneNode(!0)),this._titleElement=t.querySelector("#title"),this._pollElement=t.querySelector("#poll"),this._focusElement=t.querySelector("#focus"),this._bodyElement=t.querySelector("tbody"),this._outputElements={},this.onAnimationFrame=this.onAnimationFrame.bind(this),this.animationFrameHandle=null;let e=this;this._for="",this._eventTarget=e,this._autopoll=!1,this._context=null,this.onInputContextBind=this.onInputContextBind.bind(this),this.onInputContextUnbind=this.onInputContextUnbind.bind(this),this.onInputContextFocus=this.onInputContextFocus.bind(this),this.onInputContextBlur=this.onInputContextBlur.bind(this)}connectedCallback(){if(Object.prototype.hasOwnProperty.call(this,"for")){let t=this.for;delete this.for,this.for=t}if(Object.prototype.hasOwnProperty.call(this,"autopoll")){let t=this.autopoll;delete this.autopoll,this.autopoll=t}this.updateTable(),this.updateTableValues(),this.animationFrameHandle=requestAnimationFrame(this.onAnimationFrame)}disconnectedCallback(){let t=this._context;t&&(t.removeEventListener("bind",this.onInputContextBind),t.removeEventListener("unbind",this.onInputContextUnbind),t.removeEventListener("blur",this.onInputContextBlur),t.removeEventListener("focus",this.onInputContextFocus),t.destroy(),this._context=null)}attributeChangedCallback(t,e,n){switch(t){case"for":{this._for=n;let i,o;n?(i=document.getElementById(n),o=`${i.tagName.toLowerCase()}#${n}`):(i=this,o="input-port"),this._eventTarget=i,this._context&&this._context.setEventTarget(this._eventTarget),this._titleElement.innerHTML=`for ${o}`}break;case"autopoll":this._autopoll=n!==null,this._context&&this._context.toggleAutoPoll(this._autopoll);break}}onAnimationFrame(){this.animationFrameHandle=requestAnimationFrame(this.onAnimationFrame),this.updateTableValues(),this.updatePollStatus()}onInputContextBind(){return this.updateTable(),!0}onInputContextUnbind(){return this.updateTable(),!0}onInputContextFocus(){return this._focusElement.innerHTML="\u2713",!0}onInputContextBlur(){return this._focusElement.innerHTML="",!0}getContext(t="axisbutton",e=void 0){switch(t){case"axisbutton":if(!this._context){let n=new Z(this._eventTarget,e);n.addEventListener("bind",this.onInputContextBind),n.addEventListener("unbind",this.onInputContextUnbind),n.addEventListener("blur",this.onInputContextBlur),n.addEventListener("focus",this.onInputContextFocus),this._autopoll&&n.toggleAutoPoll(!0),this._context=n}return this._context;default:throw new Error(`Input context id '${t}' is not supported.`)}}updateTable(){if(this.isConnected)if(this._context){let t=this._context,e=t.inputs,n=t.bindings,i={},o=[];for(let a of Object.keys(e)){let h=e[a],u=!0;for(let c of n.getBindingsByInput(h)){let d=Bt(`${h.constructor.name}.${a}`,`${c.device}.${c.code}`,0,u);o.push(d),u&&(i[a]=d.querySelector("output"),u=!1)}}this._outputElements=i,this._bodyElement.innerHTML="";for(let a of o)this._bodyElement.appendChild(a)}else{this._outputElements={},this._bodyElement.innerHTML="";return}else return}updateTableValues(){if(this.isConnected)if(this._context){let e=this._context.inputs;for(let n of Object.keys(this._outputElements)){let i=this._outputElements[n],o=e[n].value;i.innerText=Number(o).toFixed(2)}}else{for(let t of Object.keys(this._outputElements)){let e=this._outputElements[t];e.innerText="---"}return}else return}updatePollStatus(){if(this.isConnected)if(this._context){let e=this._context.inputs;for(let n of Object.values(e))if(!n.polling){this._pollElement.innerHTML="";return}this._pollElement.innerHTML="\u2713"}else{this._pollElement.innerHTML="-";return}else return}};Q.define();function Bt(s,t,e,n=!0){let i=document.createElement("tr");n&&i.classList.add("primary");{let o=document.createElement("td");o.textContent=s,o.classList.add("name"),i.appendChild(o)}{let o=document.createElement("td"),a=document.createElement("output");n?a.innerText=Number(e).toFixed(2):a.innerText="---",a.classList.add("value"),o.appendChild(a),i.appendChild(o)}{let o=document.createElement("td");o.classList.add("key");let a=new D;a.innerText=t,o.appendChild(a),i.appendChild(o)}return i}var pn=Symbol("keyboardSource");var fn=Symbol("mouseSource");window.addEventListener("error",y,!0);window.addEventListener("unhandledrejection",y,!0);function y(s){typeof s=="object"?s instanceof PromiseRejectionEvent?y(s.reason):s instanceof ErrorEvent?y(s.error):s instanceof Error?window.alert(s.stack):window.alert(JSON.stringify(s)):window.alert(s)}var R=class{next(){return 0}},J=class extends R{next(){return Math.random()}},tt=class extends R{constructor(t){super();this.seed=t,this.a=t}next(){var t=this.a+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}},k=class{static get RAND(){let t=new this;return this.next=this.next.bind(this),this.choose=this.choose.bind(this),this.range=this.range.bind(this),this.rangeInt=this.rangeInt.bind(this),this.sign=this.sign.bind(this),Object.defineProperty(this,"RAND",{value:t}),t}constructor(t=void 0){typeof t=="number"?this.generator=new tt(t):t?this.generator=t:this.generator=new J,this.next=this.next.bind(this),this.choose=this.choose.bind(this),this.range=this.range.bind(this),this.rangeInt=this.rangeInt.bind(this),this.sign=this.sign.bind(this)}static next(){return this.RAND.next()}next(){return this.generator.next()}static choose(t){return this.RAND.choose(t)}choose(t){return t[Math.floor(this.generator.next()*t.length)]}static range(t,e){return this.RAND.range(t,e)}range(t,e){return(e-t)*this.generator.next()+t}static rangeInt(t,e){return this.RAND.rangeInt(t,e)}rangeInt(t,e){return Math.trunc(this.range(t,e))}static sign(){return this.RAND.sign()}sign(){return this.generator.next()<.5?-1:1}};var et=["back","main","fore"],Mt={back:"#000000",main:"#333333",fore:"#888888"},Kt={back:.3,main:.5,fore:1},Dt={back:0,main:-8,fore:-16},Ot=["back","back","back","back","main","main","fore"],Rt=80,w=new k,kt=()=>w.choose(Ot),Nt=s=>Math.trunc(w.range(0,s)),Pt=()=>Math.trunc(w.range(16,32)),Ut=()=>Math.trunc(w.range(36,80)),T=80,N=8,nt=6,P=64;function Ht(s){let t="main",e={x:0,width:36,height:16,layer:t};return s.background.buildings.push(e),s.background.buildingLayers[t].push(e),e}function it(s,t){t.x=Nt(s.display.width),t.width=Pt(),t.height=Ut();let e=t.layer,n=kt(),i=s.background.buildingLayers;i[e].splice(i[e].indexOf(t),1),i[n].push(t),t.layer=n}function st(s){s.background={buildingLayers:{fore:[],back:[],main:[]},buildings:[],progress:0};for(let t=0;t<Rt;++t){let e=Ht(s);it(s,e)}}function ot(s,t){t.background.progress+=s;for(let e of et)for(let n of t.background.buildingLayers[e])n.x>t.display.width?(it(t,n),n.x-=t.display.width+n.width):n.x+=Kt[e]}function at(s,t){let e=t.display.width,n=t.display.height;s.fillStyle="#561435",s.fillRect(0,0,e,n),s.fillStyle="#8e3e13",s.fillRect(0,0,e,n/3),s.fillStyle="#a09340",s.fillRect(0,0,e,n/10),s.fillStyle="#e8d978",s.fillRect(0,0,e,n/30);for(let h of et){s.fillStyle=Mt[h];for(let u of t.background.buildingLayers[h])Yt(s,t,u)}let i=n-P;s.fillStyle="#000000";let o=i-N,a=t.background.progress%T*nt;s.translate(a,o);for(let h=-T*nt;h<e;h+=T)s.translate(h,0),Ft(s,t),s.translate(-h,0);s.translate(-a,-o),s.fillStyle="#000000",s.fillRect(0,i,e,P)}function Ft(s,t){let e=5,n=T/e;for(let i=0;i<e;++i){let o=i*n,a=o%3;s.translate(o,0),s.fillRect(0,-a*2,3,N+a*2),s.fillRect(8,0,3,N),s.fillRect(0,2+a,n,3),s.translate(-o,0)}}function Yt(s,t,e){let n=Dt[e.layer],i=Math.trunc(e.x),o=Math.trunc(t.display.height-P-e.height-n);s.translate(i,o),s.fillRect(0,0,e.width,e.height+n),s.translate(-i,-o)}var g=Symbol("animatedText"),Wt=1e6,rt=30,lt=300,zt=rt,Gt=/\s/,ht=/[.!?]/,dt=/[-,:;]/,jt=/[.-]/;function qt(s,t){if(Gt.test(t)||jt.test(s)){if(ht.test(s))return 800;if(dt.test(s))return 250}else{if(ht.test(s))return 200;if(dt.test(s))return 100}return rt}var ut=class{constructor(t,e=1){this.rootElement=t,this.targetNode=null,this.animatedNodes=new Set,this.nodeContents=new Map,this.deltaTime=0,this.prevTime=0,this.waitTime=lt,this.targetText="",this.index=-1,this.disabled=!0,this.complete=!1,this.speed=e,this.callback=null,this.error=null,this.animationFrameHandle=null,this.onAnimationFrame=this.onAnimationFrame.bind(this)}toggle(t=!this.disabled){t?this.pause():this.resume()}pause(){this.disabled=!0,cancelAnimationFrame(this.animationFrameHandle),this.animationFrameHandle=null,this.deltaTime=this.waitTime}resume(){this.disabled=!1,this.canSafelyResumeWithTarget(this.targetNode)||(this.targetNode=null),this.prevTime=performance.now(),this.animationFrameHandle=requestAnimationFrame(this.onAnimationFrame)}reset(){this.targetNode=null,this.animatedNodes.clear()}skipAll(){this.targetNode&&(this.targetNode.nodeValue=this.targetText,this.targetNode=null),this.completeRemainingChildText()}onAnimationFrame(t){if(this.animationFrameHandle=requestAnimationFrame(this.onAnimationFrame),this.targetNode==null){let o=this.findNextChildText();if(o){let a=o.previousSibling||window.getComputedStyle(o.parentElement).display==="inline";this.targetNode=o,this.targetText=this.nodeContents.get(o),this.animatedNodes.add(o),this.index=-1,this.waitTime=a?zt:lt,this.deltaTime=0,this.complete=!1}else{this.complete=!0,this.callback.call(void 0);return}}let e=t-this.prevTime;if(this.deltaTime+=e*this.speed,this.prevTime=t,e>Wt){this.skipAll(),this.error(new Error("Frame took too long; skipping animation."));return}let n=this.targetText,i=!1;for(;!i&&this.deltaTime>=this.waitTime;){this.deltaTime-=this.waitTime;let o=++this.index;if(o<n.length){let a=n.charAt(o),h=n.charAt(o+1);this.waitTime=qt(a,h)}else this.index=n.length,i=!0}if(i)this.targetNode.nodeValue=n,this.targetNode=null;else{let o=n.substring(0,this.index+1);this.targetNode.nodeValue=o}}canSafelyResumeWithTarget(t){if(!t||!t.isConnected)return!1;let e=t.nodeValue,n=this.targetText.substring(0,this.index+1);return e===n}completeRemainingChildText(t=this.rootElement){for(let e of t.childNodes)e instanceof Text?this.nodeContents.has(e)&&(this.animatedNodes.has(e)||(e.nodeValue=this.nodeContents.get(e),this.animatedNodes.add(e))):this.completeRemainingChildText(e)}findNextChildText(t=this.rootElement,e=null){for(let n of t.childNodes)if(n instanceof Text){let i=this.animatedNodes.has(n),o=n.nodeValue;o&&o.trim().length>0&&this.nodeContents.get(n)!==o&&(this.nodeContents.set(n,o),n.nodeValue="",i&&this.animatedNodes.delete(n)),!e&&!i&&this.nodeContents.has(n)&&(e=n)}else e=this.findNextChildText(n,e);return e}},U={async play(s,t=1){if(!(s instanceof Element))throw new Error("Cannot animate text for non-element.");if(t<=0)throw new Error("Cannot animate text at non-positive speed.");let e=new ut(s,t);return s[g]=e,new Promise((n,i)=>{e.error=o=>{i(o)},e.callback=()=>{e.pause(),delete s[g],n()},e.resume()})},pause(s){s&&g in s&&s[g].pause()},resume(s){s&&g in s&&s[g].resume()},skip(s){s&&g in s&&s[g].skipAll()},toggle(s,t=void 0){s&&g in s&&s[g].toggle(t)}};function ct(s){let t=document.createElement("div");t.style.position="absolute",t.style.bottom="0.8em",t.style.right="0.8em",t.innerHTML=`
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
        </div>`,s.display.appendChild(t);let e=t.querySelector("article");e.addEventListener("click",()=>{U.skip(e)}),U.play(e),s.dialogue={text:"",element:t}}function pt(s,t){}function ft(s,t){}function mt(s){let t=document.createElement("div"),e=document.createElement("button");e.textContent="VACANT",e.style.backgroundColor="#aa3333",e.style.color="#eeeeee",e.style.border="0.3em ridge #660000",e.style.fontSize="1.5em",e.style.padding="0.1em 0.5em",e.style.position="absolute",e.style.left="0.2em",e.style.bottom="0.2em",t.appendChild(e);let n=document.createElement("label");n.textContent="0000 fare",n.style.color="#eeeeee",n.style.fontSize="1.5em",n.style.position="absolute",n.style.bottom="0.2em",n.style.left="7em",t.appendChild(n),s.display.appendChild(t)}function gt(s,t){}function Et(s,t){}window.addEventListener("DOMContentLoaded",Xt);async function Xt(){let s=document.querySelector("#display"),t=s.canvas.getContext("2d"),e={display:s,ctx:t,frames:0};st(e),ct(e),mt(e),s.addEventListener("frame",n=>{let{deltaTime:i}=n.detail,o=i/60;$t(o,e),Vt(t,e),e.frames+=1})}function $t(s,t){ot(s,t),pt(s,t),gt(s,t)}function Vt(s,t){s.fillStyle="#000000",s.fillRect(0,0,t.display.width,t.display.height),at(s,t),ft(s,t),Et(s,t)}})();
//# sourceMappingURL=main.js.map
