!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e(((t="undefined"!=typeof globalThis?globalThis:t||self).milque=t.milque||{},t.milque.input={}))}(this,(function(t){"use strict";class e{get polling(){return performance.now()-this._lastPollingTime<1e3}get value(){return 0}get size(){return this._size}constructor(t){this._size=t,this._lastPollingTime=Number.MIN_SAFE_INTEGER}resize(t){this._size=t}getState(t){throw new Error("Missing implementation.")}onUpdate(t,e,n){throw new Error("Missing implementation.")}onStatus(t,e){throw new Error("Missing implementation.")}onPoll(t){this._lastPollingTime=t}onBind(t,e){t>=this._size&&this.resize(t+1)}onUnbind(){this.resize(0)}}class n extends e{static createAxisBindingState(){return{value:0,delta:0,inverted:!1}}get delta(){return this._delta}get value(){return this._value}constructor(t=0){super(t);let e=new Array,n=this.constructor;for(let i=0;i<t;++i)e.push(n.createAxisBindingState());this._state=e,this._value=0,this._delta=0}resize(t){let e,n=this._state,i=n.length;if(t<=i)e=n.slice(0,t);else{e=n;let s=this.constructor;for(let n=i;n<t;++n)e.push(s.createAxisBindingState())}this._state=e,super.resize(t)}getState(t){return this._state[t].value}onPoll(t){let e=this._state,n=0,i=0;const s=e.length;for(let t=0;t<s;++t){let s=e[t];n+=s.value*(s.inverted?-1:1),i+=s.delta,e[t].delta=0}this._value=n,this._delta=i,super.onPoll(t)}onUpdate(t,e,n){void 0===e?this.onAxisChange(t,n):this.onAxisMove(t,e,n)}onStatus(t,e){this.onAxisStatus(t,e)}onBind(t,e){super.onBind(t,e);const{inverted:n=!1}=e||{};this._state[t].inverted=n}onAxisMove(t,e,n){let i=this._state[t];i.value=e,i.delta+=n}onAxisChange(t,e){let n=this._state[t];n.value+=e,n.delta+=e}onAxisStatus(t,e){let n=this._state[t],i=n.value;n.value=e,n.delta=e-i}}class i extends e{get pressed(){return this._pressed}get repeated(){return this._repeated}get released(){return this._released}get down(){return this._down}get value(){return this._value}constructor(t=0){super(t),this._state=new Uint8Array(t),this._value=0,this._down=!1,this._pressed=!1,this._repeated=!1,this._released=!1}resize(t){let e,n=this._state;t<=n.length?e=n.slice(0,t):(e=new Uint8Array(t),e.set(n)),this._state=e,super.resize(t)}getState(t){let e=this._state[t];return(1&e?1:0)*(16&e?-1:1)}onPoll(t){let e=this._state,n=0,i=0,s=0,o=0,r=0;const a=e.length;for(let t=0;t<a;++t){let a=e[t],l=1&a;i|=l,s|=2&a,o|=4&a,r|=8&a,n+=(l?1:0)*(16&a?-1:1),e[t]&=241}this._value=n,this._down=0!==i,this._pressed=0!==s,this._repeated=0!==o,this._released=0!==r,super.onPoll(t)}onUpdate(t,e,n){n>0?this.onButtonPressed(t):this.onButtonReleased(t)}onStatus(t,e){this.onButtonStatus(t,0!==e)}onBind(t,e={inverted:!1}){super.onBind(t,e);const{inverted:n=!1}=e;let i=this._state;n?i[t]|=16:i[t]&=239}onButtonPressed(t){let e=this._state,n=e[t];1&n||(n|=2,n|=1),n|=4,e[t]=n}onButtonReleased(t){let e=this._state,n=e[t];1&n&&(n|=8,n&=254),e[t]=n}onButtonStatus(t,e){let n=this._state,i=n[t],s=Boolean(1&i);e?i|=1:i&=254,s&&!e&&(i|=8),!s&&e&&(i|=2,i|=4),n[t]=i}}class s{static parse(t){let e=(t=t.trim()).indexOf(".");if(e<0)throw new Error("Missing device separator for key code.");let n=t.substring(0,e);if(n.length<0)throw new Error("Missing device for key code.");let i=t.substring(e+1);if(i.length<0)throw new Error("Missing code for key code.");return new s(n,i)}constructor(t,e){this.device=t,this.code=e}toString(){return`${this.device}.${this.code}`}}function o(t,e){return new s(t,e)}const r="Keyboard",a="Mouse",l=new s(r,"KeyA"),h=new s(r,"KeyB"),u=new s(r,"KeyC"),d=new s(r,"KeyD"),c=new s(r,"KeyE"),p=new s(r,"KeyF"),v=new s(r,"KeyG"),m=new s(r,"KeyH"),g=new s(r,"KeyI"),w=new s(r,"KeyJ"),y=new s(r,"KeyK"),b=new s(r,"KeyL"),f=new s(r,"KeyM"),E=new s(r,"KeyN"),_=new s(r,"KeyO"),x=new s(r,"KeyP"),B=new s(r,"KeyQ"),K=new s(r,"KeyR"),A=new s(r,"KeyS"),T=new s(r,"KeyT"),L=new s(r,"KeyU"),C=new s(r,"KeyV"),M=new s(r,"KeyW"),I=new s(r,"KeyX"),S=new s(r,"KeyY"),D=new s(r,"KeyZ"),O=new s(r,"Digit0"),P=new s(r,"Digit1"),k=new s(r,"Digit2"),U=new s(r,"Digit3"),F=new s(r,"Digit4"),Y=new s(r,"Digit5"),H=new s(r,"Digit6"),N=new s(r,"Digit7"),R=new s(r,"Digit8"),W=new s(r,"Digit9"),j=new s(r,"Minus"),q=new s(r,"Equal"),z=new s(r,"BracketLeft"),X=new s(r,"BracketRight"),G=new s(r,"Semicolon"),$=new s(r,"Quote"),Z=new s(r,"Backquote"),V=new s(r,"Backslash"),Q=new s(r,"Comma"),J=new s(r,"Period"),tt=new s(r,"Slash"),et=new s(r,"Escape"),nt=new s(r,"Space"),it=new s(r,"CapsLock"),st=new s(r,"Backspace"),ot=new s(r,"Delete"),rt=new s(r,"Tab"),at=new s(r,"Enter"),lt=new s(r,"ArrowUp"),ht=new s(r,"ArrowDown"),ut=new s(r,"ArrowLeft"),dt=new s(r,"ArrowRight"),ct=new s(a,"Button0"),pt=new s(a,"Button1"),vt=new s(a,"Button2"),mt=new s(a,"Button3"),gt=new s(a,"Button4"),wt=new s(a,"PosX"),yt=new s(a,"PosY"),bt=new s(a,"WheelX"),ft=new s(a,"WheelY"),Et=new s(a,"WheelZ");var _t=Object.freeze({__proto__:null,ARROW_DOWN:ht,ARROW_LEFT:ut,ARROW_RIGHT:dt,ARROW_UP:lt,BACKQUOTE:Z,BACKSLASH:V,BACKSPACE:st,BRACKET_LEFT:z,BRACKET_RIGHT:X,CAPS_LOCK:it,COMMA:Q,DELETE:ot,DIGIT_0:O,DIGIT_1:P,DIGIT_2:k,DIGIT_3:U,DIGIT_4:F,DIGIT_5:Y,DIGIT_6:H,DIGIT_7:N,DIGIT_8:R,DIGIT_9:W,ENTER:at,EQUAL:q,ESCAPE:et,KEYBOARD:r,KEY_A:l,KEY_B:h,KEY_C:u,KEY_D:d,KEY_E:c,KEY_F:p,KEY_G:v,KEY_H:m,KEY_I:g,KEY_J:w,KEY_K:y,KEY_L:b,KEY_M:f,KEY_N:E,KEY_O:_,KEY_P:x,KEY_Q:B,KEY_R:K,KEY_S:A,KEY_T:T,KEY_U:L,KEY_V:C,KEY_W:M,KEY_X:I,KEY_Y:S,KEY_Z:D,MINUS:j,MOUSE:a,MOUSE_BUTTON_0:ct,MOUSE_BUTTON_1:pt,MOUSE_BUTTON_2:vt,MOUSE_BUTTON_3:mt,MOUSE_BUTTON_4:gt,MOUSE_POS_X:wt,MOUSE_POS_Y:yt,MOUSE_WHEEL_X:bt,MOUSE_WHEEL_Y:ft,MOUSE_WHEEL_Z:Et,PERIOD:J,QUOTE:$,SEMICOLON:G,SLASH:tt,SPACE:nt,TAB:rt,from:o,isKeyCode:function(t){return"device"in t&&"code"in t}});class xt{constructor(t){this.name=t,this.current=null}bindKeys(t){throw new Error("Unsupported operation.")}get(t){throw new Error("Unsupported operation.")}}function Bt(t){Array.isArray(t)||(t=[t]);let e=[];for(let n of t){let t;try{t=s.parse(n)}catch(e){let i=Kt(n).toUpperCase();if(!(i in _t))throw new Error("Invalid key code string - "+e);t=_t[i]}e.push(t)}return e}function Kt(t){return t.replace(/([a-z]|(?:[A-Z0-9]+))([A-Z0-9]|$)/g,(function(t,e,n){return e+(n&&"_"+n)})).toLowerCase()}class At extends xt{static fromBind(t,e,n,i){return new At(t,o(e,n),i)}static fromString(t,...e){let n=Bt(e);return new At(t,n)}constructor(t,e,n){super(t),this.keyCodes=Array.isArray(e)?e:[e],this.opts=n,this.current=null}bindKeys(t){let e=this.name,n=this.opts;for(let i of this.keyCodes)t.bindAxis(e,i.device,i.code,n);return this.current=t.getAxis(e),this}get(t){let e=this.name;t.hasAxis(e)||this.bindKeys(t);let n=t.getAxis(e);return this.current=n,n}}class Tt extends xt{static fromBind(t,e,n,i){return new Tt(t,o(e,n),i)}static fromString(t,...e){let n=Bt(e);return new Tt(t,n)}constructor(t,e,n){super(t),this.keyCodes=Array.isArray(e)?e:[e],this.opts=n,this.current=null}bindKeys(t){let e=this.name,n=this.opts;for(let i of this.keyCodes)t.bindButton(e,i.device,i.code,n);return this.current=t.getButton(e),this}get(t){let e=this.name;t.hasButton(e)||this.bindKeys(t);let n=t.getButton(e);return this.current=n,n}}class Lt extends At{static fromBind(t,e,n,i){return new Lt(t,o(e,n),o(e,i))}constructor(t,e,n){if(super(t,[]),e.device!==n.device)throw new Error("Cannot create axis-button codes for different devices.");this.negativeKeyCode=e,this.positiveKeyCode=n}bindKeys(t){let e=this.name,n=this.negativeKeyCode,i=this.positiveKeyCode;return t.bindAxisButtons(e,n.device,n.code,i.code),this.current=t.getAxis(e),this}}class Ct{static isAxis(t){return!1}static isButton(t){return!1}constructor(t,e){if(!e)throw new Error(`Missing event target for device ${t}.`);this.name=t,this.eventTarget=e,this.listeners={input:[]}}setEventTarget(t){if(!t)throw new Error(`Missing event target for device ${this.name}.`);this.eventTarget=t}destroy(){let t=this.listeners;for(let e in t)t[e].length=0}addEventListener(t,e){let n=this.listeners;t in n?n[t].push(e):n[t]=[e]}removeEventListener(t,e){let n=this.listeners;if(t in n){let i=n[t],s=i.indexOf(e);s>=0&&i.splice(s,1)}}dispatchInputEvent(t){let e=0;for(let n of this.listeners.input)e|=n(t);return Boolean(e)}}class Mt extends Ct{static isAxis(t){return!1}static isButton(t){return!0}constructor(t,e,n={}){super(t,e);const{ignoreRepeat:i=!0}=n;this.ignoreRepeat=i,this._eventObject={target:e,device:t,code:"",event:"",value:0,control:!1,shift:!1,alt:!1},this.onKeyDown=this.onKeyDown.bind(this),this.onKeyUp=this.onKeyUp.bind(this),e.addEventListener("keydown",this.onKeyDown),e.addEventListener("keyup",this.onKeyUp)}setEventTarget(t){this.eventTarget&&this.destroy(),super.setEventTarget(t),t.addEventListener("keydown",this.onKeyDown),t.addEventListener("keyup",this.onKeyUp)}destroy(){let t=this.eventTarget;t.removeEventListener("keydown",this.onKeyDown),t.removeEventListener("keyup",this.onKeyUp),super.destroy()}onKeyDown(t){if(t.repeat&&this.ignoreRepeat)return t.preventDefault(),t.stopPropagation(),!1;let e=this._eventObject;return e.code=t.code,e.event="pressed",e.value=1,e.control=t.ctrlKey,e.shift=t.shiftKey,e.alt=t.altKey,this.dispatchInputEvent(e)?(t.preventDefault(),t.stopPropagation(),!1):void 0}onKeyUp(t){let e=this._eventObject;if(e.code=t.code,e.event="released",e.value=1,e.control=t.ctrlKey,e.shift=t.shiftKey,e.alt=t.altKey,this.dispatchInputEvent(e))return t.preventDefault(),t.stopPropagation(),!1}}class It extends Ct{static isAxis(t){return"PosX"===t||"PosY"===t||"WheelX"===t||"WheelY"===t||"WheelZ"===t}static isButton(t){return!this.isAxis(t)}constructor(t,e,n={}){super(t,e);const{eventsOnFocus:i=!0}=n;this.eventsOnFocus=i,this.canvasTarget=this.getCanvasFromEventTarget(e),this._downHasFocus=!1,this._eventObject={target:e,device:t,code:"",event:"",value:0,control:!1,shift:!1,alt:!1},this._positionObject={target:e,device:t,code:"",event:"move",value:0,movement:0},this._wheelObject={target:e,device:t,code:"",event:"wheel",movement:0},this.onMouseDown=this.onMouseDown.bind(this),this.onMouseUp=this.onMouseUp.bind(this),this.onMouseMove=this.onMouseMove.bind(this),this.onContextMenu=this.onContextMenu.bind(this),this.onWheel=this.onWheel.bind(this),e.addEventListener("mousedown",this.onMouseDown),e.addEventListener("contextmenu",this.onContextMenu),e.addEventListener("wheel",this.onWheel),document.addEventListener("mousemove",this.onMouseMove),document.addEventListener("mouseup",this.onMouseUp)}setEventTarget(t){this.eventTarget&&this.destroy(),super.setEventTarget(t),this.canvasTarget=this.getCanvasFromEventTarget(t),t.addEventListener("mousedown",this.onMouseDown),t.addEventListener("contextmenu",this.onContextMenu),t.addEventListener("wheel",this.onWheel),document.addEventListener("mousemove",this.onMouseMove),document.addEventListener("mouseup",this.onMouseUp)}destroy(){let t=this.eventTarget;t.removeEventListener("mousedown",this.onMouseDown),t.removeEventListener("contextmenu",this.onContextMenu),t.removeEventListener("wheel",this.onWheel),document.removeEventListener("mousemove",this.onMouseMove),document.removeEventListener("mouseup",this.onMouseUp),super.destroy()}setPointerLock(t=!0){t?this.eventTarget.requestPointerLock():this.eventTarget.exitPointerLock()}hasPointerLock(){return document.pointerLockElement===this.eventTarget}onMouseDown(t){this._downHasFocus=!0;let e=this._eventObject;if(e.code="Button"+t.button,e.event="pressed",e.value=1,e.control=t.ctrlKey,e.shift=t.shiftKey,e.alt=t.altKey,this.dispatchInputEvent(e)&&document.activeElement===this.eventTarget)return t.preventDefault(),t.stopPropagation(),!1}onContextMenu(t){return t.preventDefault(),t.stopPropagation(),!1}onWheel(t){let e,n,i;switch(t.deltaMode){case WheelEvent.DOM_DELTA_LINE:e=10*t.deltaX,n=10*t.deltaY,i=10*t.deltaZ;break;case WheelEvent.DOM_DELTA_PAGE:e=100*t.deltaX,n=100*t.deltaY,i=100*t.deltaZ;break;case WheelEvent.DOM_DELTA_PIXEL:default:e=t.deltaX,n=t.deltaY,i=t.deltaZ}let s=0,o=this._wheelObject;if(o.code="WheelX",o.movement=e,s|=this.dispatchInputEvent(o),o.code="WheelY",o.movement=n,s|=this.dispatchInputEvent(o),o.code="WheelZ",o.movement=i,s|=this.dispatchInputEvent(o),s)return t.preventDefault(),t.stopPropagation(),!1}onMouseUp(t){if(!this._downHasFocus)return;this._downHasFocus=!1;let e=this._eventObject;return e.code="Button"+t.button,e.event="released",e.value=1,e.control=t.ctrlKey,e.shift=t.shiftKey,e.alt=t.altKey,this.dispatchInputEvent(e)?(t.preventDefault(),t.stopPropagation(),!1):void 0}onMouseMove(t){if(this.eventsOnFocus&&document.activeElement!==this.eventTarget)return;const e=this.canvasTarget,{clientWidth:n,clientHeight:i}=e,s=e.getBoundingClientRect();let o=t.movementX/n,r=t.movementY/i,a=(t.clientX-s.left)/n,l=(t.clientY-s.top)/i,h=this._positionObject;h.code="PosX",h.value=a,h.movement=o,this.dispatchInputEvent(h),h.code="PosY",h.value=l,h.movement=r,this.dispatchInputEvent(h)}getCanvasFromEventTarget(t){return t instanceof HTMLCanvasElement?t:t.canvas||t.querySelector("canvas")||t.shadowRoot&&t.shadowRoot.querySelector("canvas")||t}}class St extends HTMLElement{static get[Symbol.for("templateNode")](){let t=document.createElement("template");return t.innerHTML='<kbd>\n  <span id="name"><slot></slot></span>\n  <span id="value" class="hidden"></span>\n</kbd>\n',Object.defineProperty(this,Symbol.for("templateNode"),{value:t}),t}static get[Symbol.for("styleNode")](){let t=document.createElement("style");return t.innerHTML="kbd {\n  position: relative;\n  display: inline-block;\n  border-radius: 3px;\n  border: 1px solid #888888;\n  font-size: 0.85em;\n  font-weight: 700;\n  text-rendering: optimizeLegibility;\n  line-height: 12px;\n  height: 14px;\n  padding: 2px 4px;\n  color: #444444;\n  background-color: #eeeeee;\n  box-shadow: inset 0 -3px 0 #aaaaaa;\n  overflow: hidden;\n}\n\nkbd:empty::after {\n  content: '<?>';\n  opacity: 0.6;\n}\n\n.disabled {\n  opacity: 0.6;\n  box-shadow: none;\n  background-color: #aaaaaa;\n}\n\n.hidden {\n  display: none;\n}\n\n#value {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  right: 0;\n  font-size: 0.85em;\n  padding: 0 4px;\n  padding-top: 2px;\n  color: #cccccc;\n  background-color: #333333;\n  box-shadow: inset 0 3px 0 #222222;\n}\n",Object.defineProperty(this,Symbol.for("styleNode"),{value:t}),t}static define(t=window.customElements){t.define("input-code",this)}static get observedAttributes(){return["name","value","disabled"]}get disabled(){return this._disabled}set disabled(t){this.toggleAttribute("disabled",t)}get value(){return this._value}set value(t){this.setAttribute("value",t)}get name(){return this._name}set name(t){this.setAttribute("name",t)}constructor(){super();const t=this.constructor,e=this.attachShadow({mode:"open"});e.appendChild(t[Symbol.for("templateNode")].content.cloneNode(!0)),e.appendChild(t[Symbol.for("styleNode")].cloneNode(!0)),this._name="",this._value="",this._disabled=!1,this._kbdElement=e.querySelector("kbd"),this._nameElement=e.querySelector("#name"),this._valueElement=e.querySelector("#value")}attributeChangedCallback(t,e,n){switch(t){case"name":this._name=n,this._nameElement.textContent=n;break;case"value":this._value=n,null!==n?(this._valueElement.classList.toggle("hidden",!1),this._valueElement.textContent=n,this._kbdElement.style.paddingRight=`${this._valueElement.clientWidth+4}px`):this._valueElement.classList.toggle("hidden",!0);break;case"disabled":this._disabled=null!==n,this._kbdElement.classList.toggle("disabled",null!==n)}}connectedCallback(){if(Object.prototype.hasOwnProperty.call(this,"name")){let t=this.name;delete this.name,this.name=t}if(Object.prototype.hasOwnProperty.call(this,"value")){let t=this.value;delete this.value,this.value=t}if(Object.prototype.hasOwnProperty.call(this,"disabled")){let t=this.disabled;delete this.disabled,this.disabled=t}}}St.define();class Dt{constructor(t){this.onAnimationFrame=this.onAnimationFrame.bind(this),this.animationFrameHandle=null,this.pollable=t}get running(){return null!==this.animationFrameHandle}start(){let t=this.animationFrameHandle;t&&cancelAnimationFrame(t),this.animationFrameHandle=requestAnimationFrame(this.onAnimationFrame)}stop(){let t=this.animationFrameHandle;t&&cancelAnimationFrame(t),this.animationFrameHandle=null}onAnimationFrame(t){this.animationFrameHandle=requestAnimationFrame(this.onAnimationFrame),this.pollable.onPoll(t)}}class Ot{constructor(t){this.onInput=this.onInput.bind(this),this.onPoll=this.onPoll.bind(this),this.bindings=t}onPoll(t){for(let e of this.bindings.getInputs())e.onPoll(t)}onInput(t){const{device:e,code:n,event:i,value:s,movement:o,control:r,shift:a,alt:l}=t;let h=this.bindings.getBindings(e,n);switch(i){case"pressed":for(let{input:t,index:e}of h)t.onUpdate(e,1,1);break;case"released":for(let{input:t,index:e}of h)t.onUpdate(e,0,-1);break;case"move":for(let{input:t,index:e}of h)t.onUpdate(e,s,o);break;case"wheel":for(let{input:t,index:e}of h)t.onUpdate(e,void 0,o)}return h.length>0}}class Pt{constructor(t,e,n,i){this.device=t,this.code=e,this.input=n,this.index=i}}class kt{constructor(){this.bindingMap={},this.inputMap=new Map}clear(){for(let t of this.inputMap.keys())t.onUnbind();this.inputMap.clear(),this.bindingMap={}}bind(t,e,n,i={inverted:!1}){let s,o=this.inputMap;if(o.has(t)){let r=o.get(t),a=t.size;t.onBind(a,i),s=new Pt(e,n,t,a),r.push(s)}else{let r=[];o.set(t,r);let a=0;t.onBind(a,i),s=new Pt(e,n,t,a),r.push(s)}let r=this.bindingMap;e in r?n in r[e]?r[e][n].push(s):r[e][n]=[s]:r[e]={[n]:[s]}}unbind(t){let e=this.inputMap;if(e.has(t)){let n=this.bindingMap,i=e.get(t);for(let t of i){let{device:e,code:i}=t,s=n[e][i],o=s.indexOf(t);s.splice(o,1)}i.length=0,t.onUnbind(),e.delete(t)}}isBound(t){return this.inputMap.has(t)}getInputs(){return this.inputMap.keys()}getBindingsByInput(t){return this.inputMap.get(t)}getBindings(t,e){let n=this.bindingMap;if(t in n){let i=n[t];if(e in i)return i[e]}return[]}}class Ut{constructor(t,e){this.inputs={},this.devices=[new It("Mouse",t),new Mt("Keyboard",t)],this.bindings=new kt,this.adapter=new Ot(this.bindings),this.autopoller=new Dt(this.adapter),this.eventTarget=t,this.anyButton=new i(1),this.anyButtonDevice="",this.anyButtonCode="",this.anyAxis=new n(1),this.anyAxisDevice="",this.anyAxisCode="",this.listeners={bind:[],unbind:[],focus:[],blur:[]},this.onInput=this.onInput.bind(this),this.onEventTargetBlur=this.onEventTargetBlur.bind(this),this.onEventTargetFocus=this.onEventTargetFocus.bind(this),t.addEventListener("focus",this.onEventTargetFocus),t.addEventListener("blur",this.onEventTargetBlur);for(let t of this.devices)t.addEventListener("input",this.onInput)}get autopoll(){return this.autopoller.running}set autopoll(t){this.toggleAutoPoll(t)}destroy(){let t=this.listeners;for(let e in t)t[e].length=0;this.autopoller.running&&this.autopoller.stop();for(let t of this.devices)t.removeEventListener("input",this.onInput),t.destroy();let e=this.eventTarget;e.removeEventListener("focus",this.onEventTargetFocus),e.removeEventListener("blur",this.onEventTargetBlur)}setEventTarget(t){let e=this.eventTarget;e.removeEventListener("focus",this.onEventTargetFocus),e.removeEventListener("blur",this.onEventTargetBlur),this.eventTarget=t;for(let e of this.devices)e.setEventTarget(t);t.addEventListener("focus",this.onEventTargetFocus),t.addEventListener("blur",this.onEventTargetBlur)}toggleAutoPoll(t){let e=this.autopoller.running,n=void 0===t?!e:Boolean(t);n!==e&&(n?this.autopoller.start():this.autopoller.stop())}addEventListener(t,e){let n=this.listeners;t in n?n[t].push(e):n[t]=[e]}removeEventListener(t,e){let n=this.listeners;if(t in n){let i=n[t],s=i.indexOf(e);s>=0&&i.splice(s,1)}}dispatchEvent(t){const{type:e}=t;let n=0;for(let i of this.listeners[e])n|=i(t)?1:0;return Boolean(n)}poll(t=performance.now()){if(this.autopoller.running)throw new Error("Should not manually poll() while autopolling.");this.onPoll(t)}onInput(t){let e=this.adapter.onInput(t);switch(t.event){case"pressed":this.anyButtonDevice=t.device,this.anyButtonCode=t.code,this.anyButton.onUpdate(0,1,1);break;case"released":this.anyButtonDevice=t.device,this.anyButtonCode=t.code,this.anyButton.onUpdate(0,0,-1);break;case"move":case"wheel":this.anyAxisDevice=t.device,this.anyAxisCode=t.code,this.anyAxis.onUpdate(0,t.value,t.movement)}return e}onPoll(t){this.adapter.onPoll(t),this.anyButton.onPoll(t),this.anyAxis.onPoll(t)}onBind(){this.dispatchEvent({type:"bind"})}onUnbind(){this.dispatchEvent({type:"unbind"})}onEventTargetFocus(){this.dispatchEvent({type:"focus"})}onEventTargetBlur(){for(let t of this.bindings.getInputs())t.onStatus(0,0);this.anyButton.onStatus(0,0),this.anyAxis.onStatus(0,0),this.dispatchEvent({type:"blur"})}bindKeys(t){if(Array.isArray(t))for(let e of t)e.bindKeys(this);else if("function"==typeof t.bindKeys)t.bindKeys(this);else{t=Object.values(t);for(let e of t)e.bindKeys(this)}}bindButton(t,e,n,s){let o;this.hasButton(t)?o=this.getButton(t):(o=new i(1),this.inputs[t]=o),this.bindings.bind(o,e,n,s),this.onBind()}bindAxis(t,e,i,s){let o;this.hasAxis(t)?o=this.getAxis(t):(o=new n(1),this.inputs[t]=o),this.bindings.bind(o,e,i,s),this.onBind()}bindAxisButtons(t,e,i,s){let o;this.hasAxis(t)?o=this.getAxis(t):(o=new n(2),this.inputs[t]=o),this.bindings.bind(o,e,s),this.bindings.bind(o,e,i,{inverted:!0}),this.onBind()}unbindButton(t){if(this.hasButton(t)){let e=this.getButton(t);delete this.inputs[t],this.bindings.unbind(e),this.onUnbind()}}unbindAxis(t){if(this.hasAxis(t)){let e=this.getAxis(t);delete this.inputs[t],this.bindings.unbind(e),this.onUnbind()}}getInput(t){return this.inputs[t]}getButton(t){return this.inputs[t]}getAxis(t){return this.inputs[t]}hasButton(t){return t in this.inputs&&this.inputs[t]instanceof i}hasAxis(t){return t in this.inputs&&this.inputs[t]instanceof n}isButtonDown(t){return this.inputs[t].down}isButtonPressed(t){return this.inputs[t].pressed}isButtonReleased(t){return this.inputs[t].released}getInputValue(t){return this.inputs[t].value}getButtonValue(t){return this.inputs[t].value}getAxisValue(t){return this.inputs[t].value}getAxisDelta(t){return this.inputs[t].delta}isAnyButtonDown(t){if(void 0===t)return this.anyButton.down;{let e=this.inputs;for(let n of t){if(e[n].down)return!0}}return!1}isAnyButtonPressed(t){if(void 0===t)return this.anyButton.pressed;{let e=this.inputs;for(let n of t){if(e[n].pressed)return!0}}return!1}isAnyButtonReleased(t){if(void 0===t)return this.anyButton.released;{let e=this.inputs;for(let n of t){if(e[n].released)return!0}}return!1}getAnyAxisValue(t){if(void 0===t)return this.anyAxis.value;{let e=this.inputs;for(let n of t){let t=e[n];if(t.value)return t.value}}return 0}getAnyAxisDelta(t){if(void 0===t)return this.anyAxis.delta;{let e=this.inputs;for(let n of t){let t=e[n];if(t.delta)return t.delta}}return 0}getLastButtonDevice(){return this.anyButtonDevice}getLastButtonCode(){return this.anyButtonCode}getLastAxisDevice(){return this.anyAxisDevice}getLastAxisCode(){return this.anyAxisCode}getMouse(){return this.devices[0]}getKeyboard(){return this.devices[1]}}class Ft extends HTMLElement{static create(t={}){const{root:e=document.body,id:n,for:i,autopoll:s=!1}=t||{};let o=new Ft;return o.id=n,o.for=i,o.autopoll=s,e.appendChild(o),o}static get[Symbol.for("templateNode")](){let t=document.createElement("template");return t.innerHTML='<table>\n  <thead>\n    <tr class="tableHeader">\n      <th colspan="3">\n        <span class="tableTitle">\n          <label id="title"> input-source </label>\n          <span id="slotContainer">\n            <slot></slot>\n          </span>\n          <p>\n            <label for="poll">poll</label>\n            <output id="poll"></output>\n          </p>\n          <p>\n            <label for="focus">focus</label>\n            <output id="focus"></output>\n          </p>\n        </span>\n      </th>\n    </tr>\n    <tr class="colHeader">\n      <th>name</th>\n      <th>value</th>\n      <th>key</th>\n    </tr>\n  </thead>\n  <tbody></tbody>\n</table>\n',Object.defineProperty(this,Symbol.for("templateNode"),{value:t}),t}static get[Symbol.for("styleNode")](){let t=document.createElement("style");return t.innerHTML=":host {\n  display: block;\n}\n\ntable {\n  border-collapse: collapse;\n  font-family: monospace;\n}\n\ntable,\nth,\ntd {\n  border: 1px solid #666666;\n}\n\nth,\ntd {\n  padding: 5px 10px;\n}\n\ntd {\n  text-align: center;\n}\n\nthead th {\n  padding: 0;\n}\n\n.colHeader > th {\n  font-size: 0.8em;\n  padding: 0 10px;\n  letter-spacing: 3px;\n  background-color: #aaaaaa;\n  color: #666666;\n}\n\ntbody output {\n  border-radius: 0.3em;\n  padding: 3px;\n}\n\ntr:not(.primary) .name,\ntr:not(.primary) .value {\n  opacity: 0.3;\n}\n\ntr:nth-child(2n) {\n  background-color: #eeeeee;\n}\n\n.tableHeader {\n  color: #666666;\n}\n\n.tableTitle {\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  padding: 4px;\n}\n\n#slotContainer {\n  flex: 1;\n}\n\np {\n  display: inline;\n  margin: 0;\n  padding: 0;\n  padding-right: 10px;\n}\n\n#poll:empty::after,\n#focus:empty::after {\n  content: '✗';\n  color: #ff0000;\n}\n",Object.defineProperty(this,Symbol.for("styleNode"),{value:t}),t}static define(t=window.customElements){t.define("input-port",this)}static get observedAttributes(){return["autopoll","for"]}get autopoll(){return this._autopoll}set autopoll(t){this.toggleAttribute("autopoll",t)}get for(){return this._for}set for(t){this.setAttribute("for",t)}constructor(){super();const t=this.attachShadow({mode:"open"});t.appendChild(this.constructor[Symbol.for("templateNode")].content.cloneNode(!0)),t.appendChild(this.constructor[Symbol.for("styleNode")].cloneNode(!0)),this._titleElement=t.querySelector("#title"),this._pollElement=t.querySelector("#poll"),this._focusElement=t.querySelector("#focus"),this._bodyElement=t.querySelector("tbody"),this._outputElements={},this.onAnimationFrame=this.onAnimationFrame.bind(this),this.animationFrameHandle=null;this._for="",this._eventTarget=this,this._autopoll=!1,this._context=null,this.onInputContextBind=this.onInputContextBind.bind(this),this.onInputContextUnbind=this.onInputContextUnbind.bind(this),this.onInputContextFocus=this.onInputContextFocus.bind(this),this.onInputContextBlur=this.onInputContextBlur.bind(this)}connectedCallback(){if(Object.prototype.hasOwnProperty.call(this,"for")){let t=this.for;delete this.for,this.for=t}if(Object.prototype.hasOwnProperty.call(this,"autopoll")){let t=this.autopoll;delete this.autopoll,this.autopoll=t}this.updateTable(),this.updateTableValues(),this.animationFrameHandle=window.requestAnimationFrame(this.onAnimationFrame)}disconnectedCallback(){let t=this._context;t&&(t.removeEventListener("bind",this.onInputContextBind),t.removeEventListener("unbind",this.onInputContextUnbind),t.removeEventListener("blur",this.onInputContextBlur),t.removeEventListener("focus",this.onInputContextFocus),t.destroy(),this._context=null)}attributeChangedCallback(t,e,n){switch(t){case"for":{let t,e;this._for=n,n?(t=document.getElementById(n),e=`${t.tagName.toLowerCase()}#${n}`):(t=this,e="input-port"),this._eventTarget=t,this._context&&this._context.setEventTarget(this._eventTarget),this._titleElement.innerHTML=`for ${e}`}break;case"autopoll":this._autopoll=null!==n,this._context&&this._context.toggleAutoPoll(this._autopoll)}}onAnimationFrame(){this.animationFrameHandle=window.requestAnimationFrame(this.onAnimationFrame),this.updateTableValues(),this.updatePollStatus()}onInputContextBind(){return this.updateTable(),!0}onInputContextUnbind(){return this.updateTable(),!0}onInputContextFocus(){return this._focusElement.innerHTML="✓",!0}onInputContextBlur(){return this._focusElement.innerHTML="",!0}getContext(t="axisbutton",e){if("axisbutton"===t){if(!this._context){let t=new Ut(this._eventTarget,e);t.addEventListener("bind",this.onInputContextBind),t.addEventListener("unbind",this.onInputContextUnbind),t.addEventListener("blur",this.onInputContextBlur),t.addEventListener("focus",this.onInputContextFocus),this._autopoll&&t.toggleAutoPoll(!0),this._context=t}return this._context}throw new Error(`Input context id '${t}' is not supported.`)}updateTable(){if(this.isConnected){if(!this._context)return this._outputElements={},void(this._bodyElement.innerHTML="");{let t=this._context,e=t.inputs,n=t.bindings,i={},s=[];for(let t of Object.keys(e)){let o=e[t],r=!0;for(let e of n.getBindingsByInput(o)){let n=Yt(`${o.constructor.name}.${t}`,`${e.device}.${e.code}`,0,r);s.push(n),r&&(i[t]=n.querySelector("output"),r=!1)}}this._outputElements=i,this._bodyElement.innerHTML="";for(let t of s)this._bodyElement.appendChild(t)}}}updateTableValues(){if(this.isConnected)if(this._context){let t=this._context.inputs;for(let e of Object.keys(this._outputElements)){let n=this._outputElements[e],i=t[e].value;n.innerText=Number(i).toFixed(2)}}else for(let t of Object.keys(this._outputElements)){this._outputElements[t].innerText="---"}}updatePollStatus(){if(this.isConnected)if(this._context){let t=this._context.inputs;for(let e of Object.values(t))if(!e.polling)return void(this._pollElement.innerHTML="");this._pollElement.innerHTML="✓"}else this._pollElement.innerHTML="-"}}function Yt(t,e,n,i=!0){let s=document.createElement("tr");i&&s.classList.add("primary");{let e=document.createElement("td");e.textContent=t,e.classList.add("name"),s.appendChild(e)}{let t=document.createElement("td"),e=document.createElement("output");e.innerText=i?Number(n).toFixed(2):"---",e.classList.add("value"),t.appendChild(e),s.appendChild(t)}{let t=document.createElement("td");t.classList.add("key");let n=new St;n.innerText=e,t.appendChild(n),s.appendChild(t)}return s}Ft.define();const Ht=Symbol("keyboardSource");const Nt=Symbol("mouseSource");t.AutoPoller=Dt,t.AxisBinding=At,t.AxisButtonBinding=Lt,t.AxisState=n,t.ButtonBinding=Tt,t.ButtonState=i,t.DeviceInputAdapter=Ot,t.InputBinding=xt,t.InputBindings=kt,t.InputCode=St,t.InputContext=Ut,t.InputDevice=Ct,t.InputPort=Ft,t.InputState=e,t.KeyCodes=_t,t.Keyboard=class{constructor(t,e){this.KeyA=new i,this.KeyB=new i,this.KeyC=new i,this.KeyD=new i,this.KeyE=new i,this.KeyF=new i,this.KeyG=new i,this.KeyH=new i,this.KeyI=new i,this.KeyJ=new i,this.KeyK=new i,this.KeyL=new i,this.KeyM=new i,this.KeyN=new i,this.KeyO=new i,this.KeyP=new i,this.KeyQ=new i,this.KeyR=new i,this.KeyS=new i,this.KeyT=new i,this.KeyU=new i,this.KeyV=new i,this.KeyW=new i,this.KeyX=new i,this.KeyY=new i,this.KeyZ=new i,this.Digit0=new i,this.Digit1=new i,this.Digit2=new i,this.Digit3=new i,this.Digit4=new i,this.Digit5=new i,this.Digit6=new i,this.Digit7=new i,this.Digit8=new i,this.Digit9=new i,this.Minus=new i,this.Equal=new i,this.BracketLeft=new i,this.BracketRight=new i,this.Semicolon=new i,this.Quote=new i,this.Backquote=new i,this.Backslash=new i,this.Comma=new i,this.Period=new i,this.Slash=new i,this.Escape=new i,this.Space=new i,this.CapsLock=new i,this.Backspace=new i,this.Delete=new i,this.Tab=new i,this.Enter=new i,this.ArrowUp=new i,this.ArrowDown=new i,this.ArrowLeft=new i,this.ArrowRight=new i;const n=r,s=new Mt(n,t,e),o=new kt;for(let t in this)if(Object.prototype.hasOwnProperty.call(this,t)){let e=this[t];o.bind(e,n,t)}const a=new Ot(o);s.addEventListener("input",a.onInput);const l=new Dt(a);l.start(),this[Ht]={device:s,bindings:o,adapter:a,autopoller:l}}destroy(){const t=this[Ht];t.autopoller.stop(),t.device.removeEventListener("input",t.adapter.onInput),t.device.destroy(),t.bindings.clear()}},t.KeyboardDevice=Mt,t.Mouse=class{constructor(t,e){this.PosX=new n,this.PosY=new n,this.WheelX=new n,this.WheelY=new n,this.WheelZ=new n,this.Button0=new i,this.Button1=new i,this.Button2=new i,this.Button3=new i,this.Button4=new i;const s=a,o=new It(s,t,e),r=new kt;for(let t in this)if(Object.prototype.hasOwnProperty.call(this,t)){let e=this[t];r.bind(e,s,t)}const l=new Ot(r);o.addEventListener("input",l.onInput);const h=new Dt(l);h.start(),this[Nt]={device:o,bindings:r,adapter:l,autopoller:h}}destroy(){const t=this[Nt];t.autopoller.stop(),t.device.removeEventListener("input",t.adapter.onInput),t.device.destroy(),t.bindings.clear()}},t.MouseDevice=It,t.stringsToKeyCodes=Bt}));
//# sourceMappingURL=milque-input.umd.js.map
