!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t(((e="undefined"!=typeof globalThis?globalThis:e||self).milque=e.milque||{},e.milque.input={}))}(this,(function(e){"use strict";class t{get polling(){return performance.now()-this._lastPollingTime<1e3}get value(){return 0}get size(){return this._size}constructor(e){this._size=e,this._lastPollingTime=Number.MIN_SAFE_INTEGER}resize(e){this._size=e}getState(e){throw new Error("Missing implementation.")}onUpdate(e,t,n){throw new Error("Missing implementation.")}onStatus(e,t){throw new Error("Missing implementation.")}onPoll(e){this._lastPollingTime=e}onBind(e,t={}){e>=this._size&&this.resize(e+1)}onUnbind(){this.resize(0)}}class n extends t{static createAxisBindingState(){return{value:0,delta:0,inverted:!1}}get delta(){return this._delta}get value(){return this._value}constructor(e=0){super(e);let t=new Array;for(let n=0;n<e;++n)t.push(this.constructor.createAxisBindingState());this._state=t,this._value=0,this._delta=0}resize(e){let t,n=this._state,i=n.length;if(e<=i)t=n.slice(0,e);else{t=n;for(let n=i;n<e;++n)t.push(this.constructor.createAxisBindingState())}this._state=t,super.resize(e)}getState(e){return this._state[e].value}onPoll(e){let t=this._state,n=0,i=0;const s=t.length;for(let e=0;e<s;++e){let s=t[e];n+=s.value*(s.inverted?-1:1),i+=s.delta,t[e].delta=0}this._value=n,this._delta=i,super.onPoll(e)}onUpdate(e,t,n){void 0===t?this.onAxisChange(e,n):this.onAxisMove(e,t,n)}onStatus(e,t){this.onAxisStatus(e,t)}onBind(e,t={}){super.onBind(e,t);const{inverted:n=!1}=t;this._state[e].inverted=n}onAxisMove(e,t,n){let i=this._state[e];i.value=t,i.delta+=n}onAxisChange(e,t){let n=this._state[e];n.value+=t,n.delta+=t}onAxisStatus(e,t){let n=this._state[e],i=n.value;n.value=t,n.delta=t-i}}class i extends t{get pressed(){return this._pressed}get repeated(){return this._repeated}get released(){return this._released}get down(){return this._down}get value(){return this._value}constructor(e=0){super(e),this._state=new Uint8Array(e),this._value=0,this._down=!1,this._pressed=!1,this._repeated=!1,this._released=!1}resize(e){let t,n=this._state;e<=n.length?t=n.slice(0,e):(t=new Uint8Array(e),t.set(n)),this._state=t,super.resize(e)}getState(e){let t=this._state[e];return(1&t?1:0)*(16&t?-1:1)}onPoll(e){let t=this._state,n=0,i=0,s=0,o=0,r=0;const a=t.length;for(let e=0;e<a;++e){let a=t[e],l=1&a;i|=l,s|=2&a,o|=4&a,r|=8&a,n+=(l?1:0)*(16&a?-1:1),t[e]&=241}this._value=n,this._down=0!==i,this._pressed=0!==s,this._repeated=0!==o,this._released=0!==r,super.onPoll(e)}onUpdate(e,t,n){n>0?this.onButtonPressed(e):this.onButtonReleased(e)}onStatus(e,t){this.onButtonStatus(e,0!==t)}onBind(e,t={}){super.onBind(e,t);const{inverted:n=!1}=t;let i=this._state;n?i[e]|=16:i[e]&=239}onButtonPressed(e){let t=this._state,n=t[e];1&n||(n|=2,n|=1),n|=4,t[e]=n}onButtonReleased(e){let t=this._state,n=t[e];1&n&&(n|=8,n&=254),t[e]=n}onButtonStatus(e,t){let n=this._state,i=n[e],s=Boolean(1&i);t?i|=1:i&=254,s&&!t&&(i|=8),!s&&t&&(i|=2,i|=4),n[e]=i}}class s{static parse(e){let t=(e=e.trim()).indexOf(".");if(t<0)throw new Error("Missing device separator for key code.");let n=e.substring(0,t);if(n.length<0)throw new Error("Missing device for key code.");let i=e.substring(t+1);if(i.length<0)throw new Error("Missing code for key code.");return new s(n,i)}constructor(e,t){this.device=e,this.code=t}toString(){return`${this.device}.${this.code}`}}class o{get polling(){return!!this.ref&&this.ref.polling}get value(){return!this.ref||this.disabled?0:this.ref.value}constructor(e){this.name=e,this.ref=null,this.disabled=!1}register(e){throw new Error("Unsupported operation.")}disable(e=!0){return this.disabled=e,this}getState(e){return!this.ref||this.disabled?0:this.ref.getState(e)}}function r(e,t){return new s(e,t)}const a="Keyboard",l="Mouse",h=new s(a,"KeyA"),u=new s(a,"KeyB"),d=new s(a,"KeyC"),c=new s(a,"KeyD"),p=new s(a,"KeyE"),v=new s(a,"KeyF"),g=new s(a,"KeyG"),m=new s(a,"KeyH"),w=new s(a,"KeyI"),f=new s(a,"KeyJ"),y=new s(a,"KeyK"),b=new s(a,"KeyL"),E=new s(a,"KeyM"),_=new s(a,"KeyN"),x=new s(a,"KeyO"),B=new s(a,"KeyP"),T=new s(a,"KeyQ"),A=new s(a,"KeyR"),K=new s(a,"KeyS"),L=new s(a,"KeyT"),C=new s(a,"KeyU"),I=new s(a,"KeyV"),M=new s(a,"KeyW"),S=new s(a,"KeyX"),D=new s(a,"KeyY"),O=new s(a,"KeyZ"),P=new s(a,"Digit0"),k=new s(a,"Digit1"),U=new s(a,"Digit2"),F=new s(a,"Digit3"),R=new s(a,"Digit4"),Y=new s(a,"Digit5"),H=new s(a,"Digit6"),N=new s(a,"Digit7"),W=new s(a,"Digit8"),j=new s(a,"Digit9"),q=new s(a,"Minus"),z=new s(a,"Equal"),X=new s(a,"BracketLeft"),G=new s(a,"BracketRight"),$=new s(a,"Semicolon"),Z=new s(a,"Quote"),V=new s(a,"Backquote"),Q=new s(a,"Backslash"),J=new s(a,"Comma"),ee=new s(a,"Period"),te=new s(a,"Slash"),ne=new s(a,"Escape"),ie=new s(a,"Space"),se=new s(a,"CapsLock"),oe=new s(a,"Backspace"),re=new s(a,"Delete"),ae=new s(a,"Tab"),le=new s(a,"Enter"),he=new s(a,"ArrowUp"),ue=new s(a,"ArrowDown"),de=new s(a,"ArrowLeft"),ce=new s(a,"ArrowRight"),pe=new s(l,"Button0"),ve=new s(l,"Button1"),ge=new s(l,"Button2"),me=new s(l,"Button3"),we=new s(l,"Button4"),fe=new s(l,"PosX"),ye=new s(l,"PosY"),be=new s(l,"WheelX"),Ee=new s(l,"WheelY"),_e=new s(l,"WheelZ");var xe=Object.freeze({__proto__:null,from:r,isKeyCode:function(e){return"device"in e&&"code"in e},KEYBOARD:a,MOUSE:l,KEY_A:h,KEY_B:u,KEY_C:d,KEY_D:c,KEY_E:p,KEY_F:v,KEY_G:g,KEY_H:m,KEY_I:w,KEY_J:f,KEY_K:y,KEY_L:b,KEY_M:E,KEY_N:_,KEY_O:x,KEY_P:B,KEY_Q:T,KEY_R:A,KEY_S:K,KEY_T:L,KEY_U:C,KEY_V:I,KEY_W:M,KEY_X:S,KEY_Y:D,KEY_Z:O,DIGIT_0:P,DIGIT_1:k,DIGIT_2:U,DIGIT_3:F,DIGIT_4:R,DIGIT_5:Y,DIGIT_6:H,DIGIT_7:N,DIGIT_8:W,DIGIT_9:j,MINUS:q,EQUAL:z,BRACKET_LEFT:X,BRACKET_RIGHT:G,SEMICOLON:$,QUOTE:Z,BACKQUOTE:V,BACKSLASH:Q,COMMA:J,PERIOD:ee,SLASH:te,ESCAPE:ne,SPACE:ie,CAPS_LOCK:se,BACKSPACE:oe,DELETE:re,TAB:ae,ENTER:le,ARROW_UP:he,ARROW_DOWN:ue,ARROW_LEFT:de,ARROW_RIGHT:ce,MOUSE_BUTTON_0:pe,MOUSE_BUTTON_1:ve,MOUSE_BUTTON_2:ge,MOUSE_BUTTON_3:me,MOUSE_BUTTON_4:we,MOUSE_POS_X:fe,MOUSE_POS_Y:ye,MOUSE_WHEEL_X:be,MOUSE_WHEEL_Y:Ee,MOUSE_WHEEL_Z:_e});function Be(e){Array.isArray(e)||(e=[e]);let t=[];for(let n of e){let e;try{e=s.parse(n)}catch(t){let i=Te(n).toUpperCase();if(!(i in xe))throw new Error("Invalid key code string - "+t);e=xe[i]}t.push(e)}return t}function Te(e){return e.replace(/([a-z]|(?:[A-Z0-9]+))([A-Z0-9]|$)/g,(function(e,t,n){return t+(n&&"_"+n)})).toLowerCase()}class Ae extends o{static fromBind(e,t,n,i){return new Ae(e,function(e,t){return new s(e,t)}(t,n),i)}static fromString(e,...t){let n=Be(t);return new Ae(e,n)}get delta(){return!this.ref||this.disabled?0:this.ref.delta}constructor(e,t,n){super(e),this.keyCodes=Array.isArray(t)?t:[t],this.opts=n}register(e){let t=this.name,n=this.opts;for(let i of this.keyCodes)e.bindAxis(t,i.device,i.code,n);return this.ref=e.getAxis(t),this}}class Ke extends o{static fromBind(e,t,n,i){return new Ke(e,r(t,n),i)}static fromString(e,...t){let n=Be(t);return new Ke(e,n)}get pressed(){return!(!this.ref||this.disabled)&&this.ref.pressed}get repeated(){return!(!this.ref||this.disabled)&&this.ref.repeated}get released(){return!(!this.ref||this.disabled)&&this.ref.released}get down(){return!(!this.ref||this.disabled)&&this.ref.down}constructor(e,t,n){super(e),this.keyCodes=Array.isArray(t)?t:[t],this.opts=n}register(e){let t=this.name,n=this.opts;for(let i of this.keyCodes)e.bindButton(t,i.device,i.code,n);return this.ref=e.getButton(t),this}}class Le extends Ae{static fromBind(e,t,n,i){return new Le(e,r(t,n),r(t,i))}constructor(e,t,n){if(super(e,[]),t.device!==n.device)throw new Error("Cannot create axis-button codes for different devices.");this.negativeKeyCode=t,this.positiveKeyCode=n}register(e){let t=this.name,n=this.negativeKeyCode,i=this.positiveKeyCode;return e.bindAxisButtons(t,n.device,n.code,i.code),this.ref=e.getAxis(t),this}}class Ce{static isAxis(e){return!1}static isButton(e){return!1}constructor(e,t){if(!t)throw new Error(`Missing event target for device ${e}.`);this.name=e,this.eventTarget=t,this.listeners={input:[]}}setEventTarget(e){if(!e)throw new Error(`Missing event target for device ${this.name}.`);this.eventTarget=e}destroy(){let e=this.listeners;for(let t in e)e[t].length=0}addEventListener(e,t){let n=this.listeners;e in n?n[e].push(t):n[e]=[t]}removeEventListener(e,t){let n=this.listeners;if(e in n){let i=n[e],s=i.indexOf(t);s>=0&&i.splice(s,1)}}dispatchInputEvent(e){let t=0;for(let n of this.listeners.input)t|=n(e);return Boolean(t)}}class Ie extends Ce{static isAxis(e){return!1}static isButton(e){return!0}constructor(e,t,n={}){super(e,t);const{ignoreRepeat:i=!0}=n;this.ignoreRepeat=i,this._eventObject={target:t,device:e,code:"",event:"",value:0,control:!1,shift:!1,alt:!1},this.onKeyDown=this.onKeyDown.bind(this),this.onKeyUp=this.onKeyUp.bind(this),t.addEventListener("keydown",this.onKeyDown),t.addEventListener("keyup",this.onKeyUp)}setEventTarget(e){this.eventTarget&&this.destroy(),super.setEventTarget(e),e.addEventListener("keydown",this.onKeyDown),e.addEventListener("keyup",this.onKeyUp)}destroy(){let e=this.eventTarget;e.removeEventListener("keydown",this.onKeyDown),e.removeEventListener("keyup",this.onKeyUp),super.destroy()}onKeyDown(e){if(e.repeat&&this.ignoreRepeat)return e.preventDefault(),e.stopPropagation(),!1;let t=this._eventObject;return t.code=e.code,t.event="pressed",t.value=1,t.control=e.ctrlKey,t.shift=e.shiftKey,t.alt=e.altKey,this.dispatchInputEvent(t)?(e.preventDefault(),e.stopPropagation(),!1):void 0}onKeyUp(e){let t=this._eventObject;if(t.code=e.code,t.event="released",t.value=1,t.control=e.ctrlKey,t.shift=e.shiftKey,t.alt=e.altKey,this.dispatchInputEvent(t))return e.preventDefault(),e.stopPropagation(),!1}}class Me extends Ce{static isAxis(e){return"PosX"===e||"PosY"===e||"WheelX"===e||"WheelY"===e||"WheelZ"===e}static isButton(e){return!this.isAxis(e)}constructor(e,t,n={}){super(e,t);const{eventsOnFocus:i=!0}=n;this.eventsOnFocus=i,this.canvasTarget=this.getCanvasFromEventTarget(t),this._downHasFocus=!1,this._eventObject={target:t,device:e,code:"",event:"",value:0,control:!1,shift:!1,alt:!1},this._positionObject={target:t,device:e,code:"",event:"move",value:0,movement:0},this._wheelObject={target:t,device:e,code:"",event:"wheel",movement:0},this.onMouseDown=this.onMouseDown.bind(this),this.onMouseUp=this.onMouseUp.bind(this),this.onMouseMove=this.onMouseMove.bind(this),this.onContextMenu=this.onContextMenu.bind(this),this.onWheel=this.onWheel.bind(this),t.addEventListener("mousedown",this.onMouseDown),t.addEventListener("contextmenu",this.onContextMenu),t.addEventListener("wheel",this.onWheel),document.addEventListener("mousemove",this.onMouseMove),document.addEventListener("mouseup",this.onMouseUp)}setEventTarget(e){this.eventTarget&&this.destroy(),super.setEventTarget(e),this.canvasTarget=this.getCanvasFromEventTarget(e),e.addEventListener("mousedown",this.onMouseDown),e.addEventListener("contextmenu",this.onContextMenu),e.addEventListener("wheel",this.onWheel),document.addEventListener("mousemove",this.onMouseMove),document.addEventListener("mouseup",this.onMouseUp)}destroy(){let e=this.eventTarget;e.removeEventListener("mousedown",this.onMouseDown),e.removeEventListener("contextmenu",this.onContextMenu),e.removeEventListener("wheel",this.onWheel),document.removeEventListener("mousemove",this.onMouseMove),document.removeEventListener("mouseup",this.onMouseUp),super.destroy()}setPointerLock(e=!0){e?this.eventTarget.requestPointerLock():this.eventTarget.exitPointerLock()}hasPointerLock(){return document.pointerLockElement===this.eventTarget}onMouseDown(e){this._downHasFocus=!0;let t=this._eventObject;if(t.code="Button"+e.button,t.event="pressed",t.value=1,t.control=e.ctrlKey,t.shift=e.shiftKey,t.alt=e.altKey,this.dispatchInputEvent(t)&&document.activeElement===this.eventTarget)return e.preventDefault(),e.stopPropagation(),!1}onContextMenu(e){return e.preventDefault(),e.stopPropagation(),!1}onWheel(e){let t,n,i;switch(e.deltaMode){case WheelEvent.DOM_DELTA_LINE:t=10*e.deltaX,n=10*e.deltaY,i=10*e.deltaZ;break;case WheelEvent.DOM_DELTA_PAGE:t=100*e.deltaX,n=100*e.deltaY,i=100*e.deltaZ;break;case WheelEvent.DOM_DELTA_PIXEL:default:t=e.deltaX,n=e.deltaY,i=e.deltaZ}let s=0,o=this._wheelObject;if(o.code="WheelX",o.movement=t,s|=this.dispatchInputEvent(o),o.code="WheelY",o.movement=n,s|=this.dispatchInputEvent(o),o.code="WheelZ",o.movement=i,s|=this.dispatchInputEvent(o),s)return e.preventDefault(),e.stopPropagation(),!1}onMouseUp(e){if(!this._downHasFocus)return;this._downHasFocus=!1;let t=this._eventObject;return t.code="Button"+e.button,t.event="released",t.value=1,t.control=e.ctrlKey,t.shift=e.shiftKey,t.alt=e.altKey,this.dispatchInputEvent(t)?(e.preventDefault(),e.stopPropagation(),!1):void 0}onMouseMove(e){if(this.eventsOnFocus&&document.activeElement!==this.eventTarget)return;const t=this.canvasTarget,{clientWidth:n,clientHeight:i}=t,s=t.getBoundingClientRect();let o=e.movementX/n,r=e.movementY/i,a=(e.clientX-s.left)/n,l=(e.clientY-s.top)/i,h=this._positionObject;h.code="PosX",h.value=a,h.movement=o,this.dispatchInputEvent(h),h.code="PosY",h.value=l,h.movement=r,this.dispatchInputEvent(h)}getCanvasFromEventTarget(e){return e instanceof HTMLCanvasElement?e:e.canvas||e.querySelector("canvas")||e.shadowRoot&&e.shadowRoot.querySelector("canvas")||e}}class Se extends HTMLElement{static get[Symbol.for("templateNode")](){let e=document.createElement("template");return e.innerHTML='<kbd>\n  <span id="name"><slot></slot></span>\n  <span id="value" class="hidden"></span>\n</kbd>\n',Object.defineProperty(this,Symbol.for("templateNode"),{value:e}),e}static get[Symbol.for("styleNode")](){let e=document.createElement("style");return e.innerHTML="kbd {\n  position: relative;\n  display: inline-block;\n  border-radius: 3px;\n  border: 1px solid #888888;\n  font-size: 0.85em;\n  font-weight: 700;\n  text-rendering: optimizeLegibility;\n  line-height: 12px;\n  height: 14px;\n  padding: 2px 4px;\n  color: #444444;\n  background-color: #eeeeee;\n  box-shadow: inset 0 -3px 0 #aaaaaa;\n  overflow: hidden;\n}\n\nkbd:empty::after {\n  content: '<?>';\n  opacity: 0.6;\n}\n\n.disabled {\n  opacity: 0.6;\n  box-shadow: none;\n  background-color: #aaaaaa;\n}\n\n.hidden {\n  display: none;\n}\n\n#value {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  right: 0;\n  font-size: 0.85em;\n  padding: 0 4px;\n  padding-top: 2px;\n  color: #cccccc;\n  background-color: #333333;\n  box-shadow: inset 0 3px 0 #222222;\n}\n",Object.defineProperty(this,Symbol.for("styleNode"),{value:e}),e}static define(e=window.customElements){e.define("input-code",this)}static get observedAttributes(){return["name","value","disabled"]}get disabled(){return this._disabled}set disabled(e){this.toggleAttribute("disabled",e)}get value(){return this._value}set value(e){this.setAttribute("value",e)}get name(){return this._name}set name(e){this.setAttribute("name",e)}constructor(){super(),this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(this.constructor[Symbol.for("templateNode")].content.cloneNode(!0)),this.shadowRoot.appendChild(this.constructor[Symbol.for("styleNode")].cloneNode(!0)),this._name="",this._value="",this._disabled=!1,this._kbdElement=this.shadowRoot.querySelector("kbd"),this._nameElement=this.shadowRoot.querySelector("#name"),this._valueElement=this.shadowRoot.querySelector("#value")}attributeChangedCallback(e,t,n){switch(e){case"name":this._name=n,this._nameElement.textContent=n;break;case"value":this._value=n,null!==n?(this._valueElement.classList.toggle("hidden",!1),this._valueElement.textContent=n,this._kbdElement.style.paddingRight=`${this._valueElement.clientWidth+4}px`):this._valueElement.classList.toggle("hidden",!0);break;case"disabled":this._disabled=null!==n,this._kbdElement.classList.toggle("disabled",null!==n)}}connectedCallback(){if(Object.prototype.hasOwnProperty.call(this,"name")){let e=this.name;delete this.name,this.name=e}if(Object.prototype.hasOwnProperty.call(this,"value")){let e=this.value;delete this.value,this.value=e}if(Object.prototype.hasOwnProperty.call(this,"disabled")){let e=this.disabled;delete this.disabled,this.disabled=e}}}Se.define();class De{constructor(e){this.onAnimationFrame=this.onAnimationFrame.bind(this),this.animationFrameHandle=null,this.pollable=e}get running(){return null!==this.animationFrameHandle}start(){let e=this.animationFrameHandle;e&&cancelAnimationFrame(e),this.animationFrameHandle=requestAnimationFrame(this.onAnimationFrame)}stop(){let e=this.animationFrameHandle;e&&cancelAnimationFrame(e),this.animationFrameHandle=null}onAnimationFrame(e){this.animationFrameHandle=requestAnimationFrame(this.onAnimationFrame),this.pollable.onPoll(e)}}class Oe{constructor(e){this.onInput=this.onInput.bind(this),this.onPoll=this.onPoll.bind(this),this.bindings=e}onPoll(e){for(let t of this.bindings.getInputs())t.onPoll(e)}onInput(e){const{device:t,code:n,event:i,value:s,movement:o,control:r,shift:a,alt:l}=e;let h=this.bindings.getBindings(t,n);switch(i){case"pressed":for(let{input:e,index:t}of h)e.onUpdate(t,1,1);break;case"released":for(let{input:e,index:t}of h)e.onUpdate(t,0,-1);break;case"move":for(let{input:e,index:t}of h)e.onUpdate(t,s,o);break;case"wheel":for(let{input:e,index:t}of h)e.onUpdate(t,void 0,o)}return h.length>0}}class Pe{constructor(e,t,n,i){this.device=e,this.code=t,this.input=n,this.index=i}}class ke{constructor(){this.bindingMap={},this.inputMap=new Map}clear(){for(let e of this.inputMap.keys())e.onUnbind();this.inputMap.clear(),this.bindingMap={}}bind(e,t,n,i={inverted:!1}){let s,o=this.inputMap;if(o.has(e)){let r=o.get(e),a=e.size;e.onBind(a,i),s=new Pe(t,n,e,a),r.push(s)}else{let r=[];o.set(e,r);let a=0;e.onBind(a,i),s=new Pe(t,n,e,a),r.push(s)}let r=this.bindingMap;t in r?n in r[t]?r[t][n].push(s):r[t][n]=[s]:r[t]={[n]:[s]}}unbind(e){let t=this.inputMap;if(t.has(e)){let n=this.bindingMap,i=t.get(e);for(let e of i){let{device:t,code:i}=e,s=n[t][i],o=s.indexOf(e);s.splice(o,1)}i.length=0,e.onUnbind(),t.delete(e)}}isBound(e){return this.inputMap.has(e)}getInputs(){return this.inputMap.keys()}getBindingsByInput(e){return this.inputMap.get(e)}getBindings(e,t){let n=this.bindingMap;if(e in n){let i=n[e];if(t in i)return i[t]}return[]}}class Ue{constructor(e,t={}){this.inputs={},this.devices=[new Me("Mouse",e),new Ie("Keyboard",e)],this.bindings=new ke,this.adapter=new Oe(this.bindings),this.autopoller=new De(this.adapter),this.eventTarget=e,this.anyButton=new i(1),this.anyButtonDevice="",this.anyButtonCode="",this.anyAxis=new n(1),this.anyAxisDevice="",this.anyAxisCode="",this.listeners={bind:[],unbind:[],focus:[],blur:[]},this.onInput=this.onInput.bind(this),this.onEventTargetBlur=this.onEventTargetBlur.bind(this),this.onEventTargetFocus=this.onEventTargetFocus.bind(this),e.addEventListener("focus",this.onEventTargetFocus),e.addEventListener("blur",this.onEventTargetBlur);for(let e of this.devices)e.addEventListener("input",this.onInput)}get autopoll(){return this.autopoller.running}set autopoll(e){this.toggleAutoPoll(e)}destroy(){let e=this.listeners;for(let t in e)e[t].length=0;this.autopoller.running&&this.autopoller.stop();for(let e of this.devices)e.removeEventListener("input",this.onInput),e.destroy();let t=this.eventTarget;t.removeEventListener("focus",this.onEventTargetFocus),t.removeEventListener("blur",this.onEventTargetBlur)}setEventTarget(e){let t=this.eventTarget;t.removeEventListener("focus",this.onEventTargetFocus),t.removeEventListener("blur",this.onEventTargetBlur),this.eventTarget=e;for(let t of this.devices)t.setEventTarget(e);e.addEventListener("focus",this.onEventTargetFocus),e.addEventListener("blur",this.onEventTargetBlur)}toggleAutoPoll(e){let t=this.autopoller.running,n=void 0===e?!t:Boolean(e);n!==t&&(n?this.autopoller.start():this.autopoller.stop())}addEventListener(e,t){let n=this.listeners;e in n?n[e].push(t):n[e]=[t]}removeEventListener(e,t){let n=this.listeners;if(e in n){let i=n[e],s=i.indexOf(t);s>=0&&i.splice(s,1)}}dispatchEvent(e){const{type:t}=e;let n=0;for(let i of this.listeners[t])n|=i(e)?1:0;return Boolean(n)}poll(e=performance.now()){if(this.autopoller.running)throw new Error("Should not manually poll() while autopolling.");this.onPoll(e)}onInput(e){let t=this.adapter.onInput(e);switch(e.event){case"pressed":this.anyButtonDevice=e.device,this.anyButtonCode=e.code,this.anyButton.onUpdate(0,1,1);break;case"released":this.anyButtonDevice=e.device,this.anyButtonCode=e.code,this.anyButton.onUpdate(0,0,-1);break;case"move":case"wheel":this.anyAxisDevice=e.device,this.anyAxisCode=e.code,this.anyAxis.onUpdate(0,e.value,e.movement)}return t}onPoll(e){this.adapter.onPoll(e),this.anyButton.onPoll(e),this.anyAxis.onPoll(e)}onBind(){this.dispatchEvent({type:"bind"})}onUnbind(){this.dispatchEvent({type:"unbind"})}onEventTargetFocus(){this.dispatchEvent({type:"focus"})}onEventTargetBlur(){for(let e of this.bindings.getInputs())e.onStatus(0,0);this.anyButton.onStatus(0,0),this.anyAxis.onStatus(0,0),this.dispatchEvent({type:"blur"})}bindBindings(e){for(let t of e)t.register(this)}bindButton(e,t,n,s){let o;this.hasButton(e)?o=this.getButton(e):(o=new i(1),this.inputs[e]=o),this.bindings.bind(o,t,n,s),this.onBind()}bindAxis(e,t,i,s){let o;this.hasAxis(e)?o=this.getAxis(e):(o=new n(1),this.inputs[e]=o),this.bindings.bind(o,t,i,s),this.onBind()}bindAxisButtons(e,t,i,s){let o;this.hasAxis(e)?o=this.getAxis(e):(o=new n(2),this.inputs[e]=o),this.bindings.bind(o,t,s),this.bindings.bind(o,t,i,{inverted:!0}),this.onBind()}unbindButton(e){if(this.hasButton(e)){let t=this.getButton(e);delete this.inputs[e],this.bindings.unbind(t),this.onUnbind()}}unbindAxis(e){if(this.hasAxis(e)){let t=this.getAxis(e);delete this.inputs[e],this.bindings.unbind(t),this.onUnbind()}}getInput(e){return this.inputs[e]}getButton(e){return this.inputs[e]}getAxis(e){return this.inputs[e]}hasButton(e){return e in this.inputs&&this.inputs[e]instanceof i}hasAxis(e){return e in this.inputs&&this.inputs[e]instanceof n}isButtonDown(e){return this.inputs[e].down}isButtonPressed(e){return this.inputs[e].pressed}isButtonReleased(e){return this.inputs[e].released}getInputValue(e){return this.inputs[e].value}getButtonValue(e){return this.inputs[e].value}getAxisValue(e){return this.inputs[e].value}getAxisDelta(e){return this.inputs[e].delta}isAnyButtonDown(e){if(void 0===e)return this.anyButton.down;{let t=this.inputs;for(let n of e){if(t[n].down)return!0}}return!1}isAnyButtonPressed(e){if(void 0===e)return this.anyButton.pressed;{let t=this.inputs;for(let n of e){if(t[n].pressed)return!0}}return!1}isAnyButtonReleased(e){if(void 0===e)return this.anyButton.released;{let t=this.inputs;for(let n of e){if(t[n].released)return!0}}return!1}getAnyAxisValue(e){if(void 0===e)return this.anyAxis.value;{let t=this.inputs;for(let n of e){let e=t[n];if(e.value)return e.value}}return 0}getAnyAxisDelta(e){if(void 0===e)return this.anyAxis.delta;{let t=this.inputs;for(let n of e){let e=t[n];if(e.delta)return e.delta}}return 0}getLastButtonDevice(){return this.anyButtonDevice}getLastButtonCode(){return this.anyButtonCode}getLastAxisDevice(){return this.anyAxisDevice}getLastAxisCode(){return this.anyAxisCode}getMouse(){return this.devices[0]}getKeyboard(){return this.devices[1]}}class Fe extends HTMLElement{static get[Symbol.for("templateNode")](){let e=document.createElement("template");return e.innerHTML='<table>\n  <thead>\n    <tr class="tableHeader">\n      <th colspan="3">\n        <span class="tableTitle">\n          <label id="title"> input-source </label>\n          <span id="slotContainer">\n            <slot></slot>\n          </span>\n          <p>\n            <label for="poll">poll</label>\n            <output id="poll"></output>\n          </p>\n          <p>\n            <label for="focus">focus</label>\n            <output id="focus"></output>\n          </p>\n        </span>\n      </th>\n    </tr>\n    <tr class="colHeader">\n      <th>name</th>\n      <th>value</th>\n      <th>key</th>\n    </tr>\n  </thead>\n  <tbody></tbody>\n</table>\n',Object.defineProperty(this,Symbol.for("templateNode"),{value:e}),e}static get[Symbol.for("styleNode")](){let e=document.createElement("style");return e.innerHTML=":host {\n  display: block;\n}\n\ntable {\n  border-collapse: collapse;\n  font-family: monospace;\n}\n\ntable,\nth,\ntd {\n  border: 1px solid #666666;\n}\n\nth,\ntd {\n  padding: 5px 10px;\n}\n\ntd {\n  text-align: center;\n}\n\nthead th {\n  padding: 0;\n}\n\n.colHeader > th {\n  font-size: 0.8em;\n  padding: 0 10px;\n  letter-spacing: 3px;\n  background-color: #aaaaaa;\n  color: #666666;\n}\n\ntbody output {\n  border-radius: 0.3em;\n  padding: 3px;\n}\n\ntr:not(.primary) .name,\ntr:not(.primary) .value {\n  opacity: 0.3;\n}\n\ntr:nth-child(2n) {\n  background-color: #eeeeee;\n}\n\n.tableHeader {\n  color: #666666;\n}\n\n.tableTitle {\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  padding: 4px;\n}\n\n#slotContainer {\n  flex: 1;\n}\n\np {\n  display: inline;\n  margin: 0;\n  padding: 0;\n  padding-right: 10px;\n}\n\n#poll:empty::after,\n#focus:empty::after {\n  content: '✗';\n  color: #ff0000;\n}\n",Object.defineProperty(this,Symbol.for("styleNode"),{value:e}),e}static define(e=window.customElements){e.define("input-port",this)}static get observedAttributes(){return["autopoll","for"]}get autopoll(){return this._autopoll}set autopoll(e){this.toggleAttribute("autopoll",e)}get for(){return this._for}set for(e){this.setAttribute("for",e)}constructor(){super();const e=this.attachShadow({mode:"open"});e.appendChild(this.constructor[Symbol.for("templateNode")].content.cloneNode(!0)),e.appendChild(this.constructor[Symbol.for("styleNode")].cloneNode(!0)),this._titleElement=e.querySelector("#title"),this._pollElement=e.querySelector("#poll"),this._focusElement=e.querySelector("#focus"),this._bodyElement=e.querySelector("tbody"),this._outputElements={},this.onAnimationFrame=this.onAnimationFrame.bind(this),this.animationFrameHandle=null;this._for="",this._eventTarget=this,this._autopoll=!1,this._context=null,this.onInputContextBind=this.onInputContextBind.bind(this),this.onInputContextUnbind=this.onInputContextUnbind.bind(this),this.onInputContextFocus=this.onInputContextFocus.bind(this),this.onInputContextBlur=this.onInputContextBlur.bind(this)}connectedCallback(){if(Object.prototype.hasOwnProperty.call(this,"for")){let e=this.for;delete this.for,this.for=e}if(Object.prototype.hasOwnProperty.call(this,"autopoll")){let e=this.autopoll;delete this.autopoll,this.autopoll=e}this.updateTable(),this.updateTableValues(),this.animationFrameHandle=requestAnimationFrame(this.onAnimationFrame)}disconnectedCallback(){let e=this._context;e&&(e.removeEventListener("bind",this.onInputContextBind),e.removeEventListener("unbind",this.onInputContextUnbind),e.removeEventListener("blur",this.onInputContextBlur),e.removeEventListener("focus",this.onInputContextFocus),e.destroy(),this._context=null)}attributeChangedCallback(e,t,n){switch(e){case"for":{let e,t;this._for=n,n?(e=document.getElementById(n),t=`${e.tagName.toLowerCase()}#${n}`):(e=this,t="input-port"),this._eventTarget=e,this._context&&this._context.setEventTarget(this._eventTarget),this._titleElement.innerHTML=`for ${t}`}break;case"autopoll":this._autopoll=null!==n,this._context&&this._context.toggleAutoPoll(this._autopoll)}}onAnimationFrame(){this.animationFrameHandle=requestAnimationFrame(this.onAnimationFrame),this.updateTableValues(),this.updatePollStatus()}onInputContextBind(){return this.updateTable(),!0}onInputContextUnbind(){return this.updateTable(),!0}onInputContextFocus(){return this._focusElement.innerHTML="✓",!0}onInputContextBlur(){return this._focusElement.innerHTML="",!0}getContext(e="axisbutton",t){switch(e){case"axisbutton":if(!this._context){let e=new Ue(this._eventTarget,t);e.addEventListener("bind",this.onInputContextBind),e.addEventListener("unbind",this.onInputContextUnbind),e.addEventListener("blur",this.onInputContextBlur),e.addEventListener("focus",this.onInputContextFocus),this._autopoll&&e.toggleAutoPoll(!0),this._context=e}return this._context;default:throw new Error(`Input context id '${e}' is not supported.`)}}updateTable(){if(this.isConnected){if(!this._context)return this._outputElements={},void(this._bodyElement.innerHTML="");{let e=this._context,t=e.inputs,n=e.bindings,i={},s=[];for(let e of Object.keys(t)){let o=t[e],r=!0;for(let t of n.getBindingsByInput(o)){let n=Re(`${o.constructor.name}.${e}`,`${t.device}.${t.code}`,0,r);s.push(n),r&&(i[e]=n.querySelector("output"),r=!1)}}this._outputElements=i,this._bodyElement.innerHTML="";for(let e of s)this._bodyElement.appendChild(e)}}}updateTableValues(){if(this.isConnected)if(this._context){let e=this._context.inputs;for(let t of Object.keys(this._outputElements)){let n=this._outputElements[t],i=e[t].value;n.innerText=Number(i).toFixed(2)}}else for(let e of Object.keys(this._outputElements)){this._outputElements[e].innerText="---"}}updatePollStatus(){if(this.isConnected)if(this._context){let e=this._context.inputs;for(let t of Object.values(e))if(!t.polling)return void(this._pollElement.innerHTML="");this._pollElement.innerHTML="✓"}else this._pollElement.innerHTML="-"}}function Re(e,t,n,i=!0){let s=document.createElement("tr");i&&s.classList.add("primary");{let t=document.createElement("td");t.textContent=e,t.classList.add("name"),s.appendChild(t)}{let e=document.createElement("td"),t=document.createElement("output");t.innerText=i?Number(n).toFixed(2):"---",t.classList.add("value"),e.appendChild(t),s.appendChild(e)}{let e=document.createElement("td");e.classList.add("key");let n=new Se;n.innerText=t,e.appendChild(n),s.appendChild(e)}return s}Fe.define();const Ye=Symbol("keyboardSource");const He=Symbol("mouseSource");e.AutoPoller=De,e.Axis=n,e.AxisBinding=Ae,e.AxisButtonBinding=Le,e.Button=i,e.ButtonBinding=Ke,e.CLEAR_DOWN_STATE_BITS=254,e.CLEAR_INVERTED_MODIFIER_BITS=239,e.CLEAR_POLL_BITS=241,e.DOWN_STATE_BIT=1,e.DeviceInputAdapter=Oe,e.INVERTED_MODIFIER_BIT=16,e.InputBase=t,e.InputBindings=ke,e.InputCode=Se,e.InputContext=Ue,e.InputDevice=Ce,e.InputPort=Fe,e.KeyCodes=xe,e.Keyboard=class{constructor(e,t){this.KeyA=new i,this.KeyB=new i,this.KeyC=new i,this.KeyD=new i,this.KeyE=new i,this.KeyF=new i,this.KeyG=new i,this.KeyH=new i,this.KeyI=new i,this.KeyJ=new i,this.KeyK=new i,this.KeyL=new i,this.KeyM=new i,this.KeyN=new i,this.KeyO=new i,this.KeyP=new i,this.KeyQ=new i,this.KeyR=new i,this.KeyS=new i,this.KeyT=new i,this.KeyU=new i,this.KeyV=new i,this.KeyW=new i,this.KeyX=new i,this.KeyY=new i,this.KeyZ=new i,this.Digit0=new i,this.Digit1=new i,this.Digit2=new i,this.Digit3=new i,this.Digit4=new i,this.Digit5=new i,this.Digit6=new i,this.Digit7=new i,this.Digit8=new i,this.Digit9=new i,this.Minus=new i,this.Equal=new i,this.BracketLeft=new i,this.BracketRight=new i,this.Semicolon=new i,this.Quote=new i,this.Backquote=new i,this.Backslash=new i,this.Comma=new i,this.Period=new i,this.Slash=new i,this.Escape=new i,this.Space=new i,this.CapsLock=new i,this.Backspace=new i,this.Delete=new i,this.Tab=new i,this.Enter=new i,this.ArrowUp=new i,this.ArrowDown=new i,this.ArrowLeft=new i,this.ArrowRight=new i;const n=a,s=new Ie(n,e,t),o=new ke;for(let e in this)if(Object.prototype.hasOwnProperty.call(this,e)){let t=this[e];o.bind(t,n,e)}const r=new Oe(o);s.addEventListener("input",r.onInput);const l=new De(r);l.start(),this[Ye]={device:s,bindings:o,adapter:r,autopoller:l}}destroy(){const e=this[Ye];e.autopoller.stop(),e.device.removeEventListener("input",e.adapter.onInput),e.device.destroy(),e.bindings.clear()}},e.KeyboardDevice=Ie,e.Mouse=class{constructor(e,t){this.PosX=new n,this.PosY=new n,this.WheelX=new n,this.WheelY=new n,this.WheelZ=new n,this.Button0=new i,this.Button1=new i,this.Button2=new i,this.Button3=new i,this.Button4=new i;const s=l,o=new Me(s,e,t),r=new ke;for(let e in this)if(Object.prototype.hasOwnProperty.call(this,e)){let t=this[e];r.bind(t,s,e)}const a=new Oe(r);o.addEventListener("input",a.onInput);const h=new De(a);h.start(),this[He]={device:o,bindings:r,adapter:a,autopoller:h}}destroy(){const e=this[He];e.autopoller.stop(),e.device.removeEventListener("input",e.adapter.onInput),e.device.destroy(),e.bindings.clear()}},e.MouseDevice=Me,e.PRESSED_STATE_BIT=2,e.RELEASED_STATE_BIT=8,e.REPEATED_STATE_BIT=4,e.stringsToKeyCodes=Be,Object.defineProperty(e,"__esModule",{value:!0})}));
