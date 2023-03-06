"use strict";var e=require("gl-matrix");const t=e.vec3.fromValues(0,1,0);class n{constructor(e,t){this.projectionMatrix=e,this.viewMatrix=t}resize(e,t){return this}}const s=Math.PI/3;const i=Math.PI/180;const r=100;function o(e,t,n){e?(n.nodes[e].children.push(t),n.nodes[t].parent=e):(n.roots.push(t),n.nodes[t].parent=0)}function a(e,t,n){if(e){let s=n.nodes[e].children,i=s.indexOf(t);s.splice(i,1),n.nodes[t].parentNode=0}else{let e=n.roots,s=e.indexOf(t);e.splice(s,1),n.nodes[t].parentNode=0}}function l(e,t,n,s,i){if(n>=r)return;let o=s(t,e);if(!1===o)return;let a=e.nodes[t],c=i?i(a.children,t,e):a.children;for(let t of c)l(e,t,n+1,s,i);"function"==typeof o&&o(t,e)}function c(e,t){delete t.nodes[e]}class h{constructor(){this.cachedResults={},this.keyQueryMapping={},this.onEntityComponentChanged=this.onEntityComponentChanged.bind(this)}onEntityComponentChanged(e,t,n,s,i){for(let r of Object.values(this.keyQueryMapping)){let o=this.cachedResults[r.key];if(i){let e=o.indexOf(t);e>=0&&o.splice(e,1)}else if(n){if(r.hasSelector(u(n))){let e=o.indexOf(t);e>=0&&o.splice(e,1)}else if(r.hasSelector(n)&&r.test(e,t)){o.indexOf(t)<0&&o.push(t)}}else if(s)if(r.hasSelector(u(s))&&r.test(e,t)){o.indexOf(t)<0&&o.push(t)}else if(r.hasSelector(s)&&r.test(e,t)){let e=o.indexOf(t);e>=0&&o.splice(e,1)}}}findAny(e,t){let n=this.findAll(e,t);return n.length<=0?null:n[Math.floor(Math.random()*n.length)]}findAll(e,t){const n=t.key;let s;return n in this.keyQueryMapping?s=this.cachedResults[n]:(s=[],this.keyQueryMapping[n]=t,this.cachedResults[n]=s,t.hydrate(e,s)),s}count(e,t){return this.findAll(e,t).length}clear(e){const t=e.key;t in this.keyQueryMapping&&(delete this.keyQueryMapping[t],delete this.cachedResults[t])}reset(){this.keyQueryMapping={},this.cachedResults={}}}function u(e){return{type:"not",name:e.name,value:e}}function d(e){return"type"in e&&"not"===e.type}function f(e,t,n,s){e[0]=n;let i=1;for(let r of s)d(r)?e[i]=null:e[i]=t.get(n,r),++i;return e}function p(e,t){return e.priority-t.priority}function m(e){let t=v(e);if(!t)throw new Error("This is not a provider.");return t.current}const y=Symbol("providers");function g(e){return y in e?e[y]:e[y]={contexts:{},current:null}}function v(e){return y in e?e[y]:null}const x=Symbol("effectors");function b(e){return x in e?e[x]:e[x]={contexts:{}}}function k(e,t){const n=e.name;return n in t?t[n]:t[n]={befores:[],afters:[]}}function C(e,t){const n=e.name;return n in t?t[n]:null}exports.AnimationFrameLoop=class{constructor(e,t){const{animationFrameHandler:n=window}=t||{};this.handle=0,this.detail={prevTime:-1,currentTime:-1,deltaTime:0},this.animationFrameHandler=n,this.callback=e,this.next=this.next.bind(this),this.start=this.start.bind(this),this.cancel=this.cancel.bind(this)}next(e=performance.now()){this.handle=this.animationFrameHandler.requestAnimationFrame(this.next);let t=this.detail;t.prevTime=t.currentTime,t.currentTime=e,t.deltaTime=t.currentTime-t.prevTime,this.callback(this)}start(){return this.handle=this.animationFrameHandler.requestAnimationFrame(this.next),this}cancel(){return this.animationFrameHandler.cancelAnimationFrame(this.handle),this}},exports.Camera=n,exports.ComponentClass=class{constructor(e,t=(()=>null),n=(()=>{})){this.name=e,this.new=t,this.delete=n}},exports.EntityManager=class{constructor(){this.components={},this.nameClassMapping={},this.nextAvailableEntityId=1,this.queue=[],this.listeners=[],this.queries=new h}entityComponentChangedCallback(e,t,n,s){this.queries.onEntityComponentChanged(this,e,t,n,s);for(let i of this.listeners)i(this,e,t,n,s)}addEventListener(e,t){"change"===e&&this.listeners.push(t)}removeEventListener(e,t){if("change"===e){let e=this.listeners.indexOf(t);e>=0&&this.listeners.splice(e,1)}}flush(){for(;this.queue.length>0;){let[e,...t]=this.queue.shift();switch(e){case"attach":{let[e,n,s]=t;this.attachImmediately(e,n,s)}break;case"detach":{let[e,n]=t;this.detachImmediately(e,n)}break;case"clear":{let[e]=t;this.clearImmediately(e)}}}}create(){let e=this.nextAvailableEntityId++;return this.entityComponentChangedCallback(e,null,null,!1),e}destroy(e){const t=this.components;for(const n of Object.keys(t)){const s=t[n];e in s&&(delete s[e],this.entityComponentChangedCallback(e,null,this.nameClassMapping[n],!1))}this.entityComponentChangedCallback(e,null,null,!0)}exists(e,...t){if(t.length>0){for(const n of t){if(!(e in this.mapOf(n)))return!1}return!0}for(let t of Object.values(this.components))if(e in t)return!0;return!1}attach(e,t,n){return void 0===n&&(n=t.new()),this.queue.push(["attach",e,t,n]),n}attachImmediately(e,t,n){return void 0===n&&(n=t.new()),this.mapOf(t)[e]=n,this.entityComponentChangedCallback(e,t,null,!1),n}detach(e,t){this.queue.push(["detach",e,t])}detachImmediately(e,t){let n=this.mapOf(t),s=n[e];delete n[e],t.delete(s),this.entityComponentChangedCallback(e,null,t,!1)}clear(e){this.queue.push(["clear",e])}clearImmediately(e){const t=e.name,n=this.components,s=n[t];let i=Object.keys(s).map(Number),r=Object.values(s);n[t]={},this.nameClassMapping[t]=e;for(let t of r)e.delete(t);for(let t of i)this.entityComponentChangedCallback(t,null,e,!1)}get(e,t){return this.mapOf(t)[e]||null}count(e){return Object.keys(this.mapOf(e)).length}keysOf(e){return Object.keys(this.mapOf(e)).map(Number)}valuesOf(e){return Object.values(this.mapOf(e))}mapOf(e){const t=e.name,n=this.components;if(t in n)return n[t];{let s={};return n[t]=s,this.nameClassMapping[t]=e,s}}entityIds(){let e=new Set;for(let t of Object.values(this.components))for(let n of Object.keys(t))e.add(n);return e}componentClasses(){return Object.values(this.nameClassMapping)}reset(){const e=this.components;let t=new Set;for(const n of Object.keys(e)){const s=this.nameClassMapping[n],i=e[n];for(let e of Object.keys(i))t.add(Number(e));this.clearImmediately(s)}for(let e of t)this.entityComponentChangedCallback(e,null,null,!0);t.clear(),this.queries.reset(),this.components={},this.nextAvailableEntityId=1,this.queue.length=0,this.listeners.length=0}},exports.EntityTemplate=class{constructor(...e){this.componentClasses=e}create(e){let t=e.create(),n=[t];for(let s of this.componentClasses){let i=e.attach(t,s);n.push(i)}return n}destroy(e,t){for(let n of this.componentClasses)e.detach(t,n)}},exports.FirstPersonCameraController=class{constructor(t={locky:!1}){this.locky=t.locky,this.position=e.vec3.create(),this.forward=e.vec3.fromValues(0,0,-1),this.right=e.vec3.fromValues(1,0,0),this.up=e.vec3.fromValues(0,1,0),this.forwardAmount=0,this.rightAmount=0,this.upAmount=0,this.pitch=0,this.yaw=-90}look(e,t,n=1){return n*=1e3,this.pitch=Math.min(89.9,Math.max(-89.9,this.pitch+t*n)),this.yaw=(this.yaw+e*n)%360,this}move(e,t=0,n=0,s=1){return this.forwardAmount+=e*s,this.rightAmount+=t*s,this.upAmount+=n*s,this}apply(t){let{position:n,forward:s,right:r,up:o,forwardAmount:a,rightAmount:l,upAmount:c,pitch:h,yaw:u}=this,d=u*i,f=h*i,p=Math.cos(d),m=Math.cos(f),y=Math.sin(d),g=p*m,v=Math.sin(f),x=y*m;e.vec3.normalize(s,e.vec3.set(s,g,this.locky?0:v,x)),e.vec3.normalize(r,e.vec3.cross(r,s,o));let b=e.vec3.create();e.vec3.scale(b,s,a),e.vec3.add(n,n,b),e.vec3.scale(b,r,l),e.vec3.add(n,n,b),e.vec3.scale(b,o,c),e.vec3.add(n,n,b),this.forwardAmount=0,this.rightAmount=0,this.upAmount=0,this.locky&&e.vec3.set(s,g,v,x);let k=e.vec3.add(b,n,s);return e.mat4.lookAt(t,n,k,o),t}},exports.Not=u,exports.OrthographicCamera=class extends n{constructor(t,n,s,i,r=-1e3,o=1e3){super(e.mat4.create(),e.mat4.create()),this.orthoBounds={left:void 0===t?void 0:Number(t),top:void 0===n?void 0:Number(n),right:void 0===s?void 0:Number(s),bottom:void 0===i?void 0:Number(i)},this.clippingPlane={near:Number(r),far:Number(o)}}resize(t,n){const{near:s,far:i}=this.clippingPlane,{left:r,top:o,right:a,bottom:l}=this.orthoBounds;let c=this.projectionMatrix,h=void 0!==r;if(void 0!==t)if(h){const h=t/n;e.mat4.ortho(c,r*h,a*h,l,o,s,i)}else e.mat4.ortho(c,0,t,n,0,s,i);else h?e.mat4.ortho(c,r,a,l,o,s,i):e.mat4.ortho(c,-1,1,1,-1,-1,1);return this}},exports.PerspectiveCamera=class extends n{constructor(t=s,n=.1,i=1e3){super(e.mat4.create(),e.mat4.create()),this.fieldOfView=Number(t),this.clippingPlane={near:Number(n),far:Number(i)}}resize(t,n){const s=void 0===t?1:t/n,{near:i,far:r}=this.clippingPlane;return e.mat4.perspective(this.projectionMatrix,this.fieldOfView,s,i,r),this}},exports.Query=class{constructor(...e){if(e.length<=0)throw new Error("Must have at least 1 selector for query.");this.selectors=e,this.key=e.map((e=>d(e)?`!${e.name}`:e.name)).sort().join("&")}hasSelector(e){return d(e)?this.selectors.findIndex((t=>d(t)&&t.name===e.name))>=0:this.selectors.findIndex((t=>t.name===e.name))>=0}test(e,t){for(let n of this.selectors)if(d(n)){const s=n.value;if(e.exists(t,s))return!1}else{const s=n;if(!e.exists(t,s))return!1}return!0}hydrate(e,t){if(this.selectors.length<=0)return t.length=0,t;let n=e.entityIds();for(let s of n)this.test(e,s)&&t.push(s);return t}count(e){return e.queries.count(e,this)}findAny(e){const t=e.queries;let n=new Array(this.selectors.length+1),s=t.findAny(e,this);return null===s?n.fill(void 0):(f(n,e,s,this.selectors),n)}*findAll(e){const t=e.queries;let n=new Array(this.selectors.length+1),s=t.findAll(e,this);for(let t of s)f(n,e,t,this.selectors),yield n}},exports.QueryManager=h,exports.SceneGraph=class{constructor(){this.nodes={},this.roots=[],this._nextAvailableSceneNodeId=1}createSceneNode(e){let t=this._nextAvailableSceneNodeId++,n={parent:0,children:[]};return this.nodes[t]=n,o(e,t,this),t}createSceneNodes(e,t){let n=[];for(let s=0;s<e;++s)n.push(this.createSceneNode(t));return n}deleteSceneNode(e){if(!(e in this.nodes))throw new Error("Cannot delete non-existant scene node for scene graph.");a(this.nodes[e].parent,e,this),l(this,e,0,c)}deleteSceneNodes(e){for(let t of e)this.deleteSceneNode(t)}getSceneNodeInfo(e){return this.nodes[e]}parentSceneNode(e,t){a(this.nodes[e].parent,e,this),o(t,e,this)}replaceSceneNode(e,t){let n=this.nodes[e],s=n.parent,i=n.children.slice();if(a(s,e,this),n.children.length=0,t){let e=this.nodes[t];a(e.parent,t,this),e.children.push(...i),o(s,t,this)}else if(s){this.nodes[s].children.push(...i)}else this.roots.push(...i);for(let e of i)this.nodes[e].parent=s}walk(e,t={}){const{from:n,childFilter:s}=t;let i;i=n?Array.isArray(n)?n:[n]:this.roots,s&&(i=s(i,0,this));for(let t of i)l(this,t,0,e,s)}},exports.Topic=class{constructor(e){this.name=e}dispatch(e,t){e.dispatch(this,t)}dispatchImmediately(e,t){e.dispatchImmediately(this,t)}on(e,t,n){return e.addEventListener(this,n,{priority:t}),this}off(e,t){return e.removeEventListener(this,t),this}once(e,t,n){let s=t=>(this.off(e,s),n(t));return this.on(e,t,s)}*poll(e,t){t=Math.min(t,e.count(this));for(let n=0;n<t;++n)yield e.poll(this)}retain(e,t){e.retain(this,t)}*pollAndRetain(e,t){this.retain(e,t);for(let n of this.poll(e,t))yield n}},exports.TopicManager=class{constructor(){this.cachedIn={},this.cachedOut={},this.callbacks={},this.maxRetains={},this.nameTopicMapping={}}addEventListener(e,t,n){const{priority:s=0}=n;let i=this.callbacksOf(e);i.push({callback:t,priority:s}),i.sort(p)}removeEventListener(e,t){let n=this.callbacksOf(e),s=n.findIndex((e=>e.callback===t));s>=0&&n.splice(s,1)}countEventListeners(e){return this.callbacksOf(e).length}dispatch(e,t){this.incomingOf(e).push(t)}dispatchImmediately(e,t){let n=this.callbacksOf(e);for(let{callback:e}of n){if(!0===e(t))return}this.outgoingOf(e).push(t)}count(e){return this.outgoingOf(e).length}poll(e){let t=this.outgoingOf(e);return t.length<=0?null:t.shift()}retain(e,t){const n=e.name;let s=Math.max(t,this.maxRetains[n]||0);this.maxRetains[n]=s}flush(e=100){for(const t of Object.keys(this.cachedIn)){const n=this.nameTopicMapping[t],s=this.cachedIn[t],i=this.cachedOut[t],r=this.maxRetains[t]||0;r<i.length&&i.splice(0,i.length-r);let o=Math.min(e,s.length);for(let e=0;e<o;++e){let e=s.shift();this.dispatchImmediately(n,e)}}}getPendingRetainCount(e){return this.maxRetains[e.name]||0}getPendingFlushCount(e){return this.incomingOf(e).length}reset(){this.cachedIn={},this.cachedOut={},this.callbacks={},this.maxRetains={},this.nameTopicMapping={}}incomingOf(e){const t=e.name;if(t in this.cachedIn)return this.cachedIn[t];{let n=[];return this.cachedIn[t]=n,this.cachedOut[t]=[],this.nameTopicMapping[t]=e,n}}outgoingOf(e){const t=e.name;if(t in this.cachedOut)return this.cachedOut[t];{let n=[];return this.cachedIn[t]=[],this.cachedOut[t]=n,this.nameTopicMapping[t]=e,n}}callbacksOf(e){const t=e.name;if(t in this.callbacks)return this.callbacks[t];{let e=[];return this.callbacks[t]=e,e}}},exports.applyEffects=async function(e,t){let n=b(e);for(let e of t){let t=k(e,n.contexts),s=t.befores.slice();t.befores.length=0;let i=await Promise.all(s.map((e=>e&&e())));t.afters.push(...i)}return e},exports.ejectProviders=function(e,t){let n=v(e);if(!n)return e;for(let e of t.slice().reverse()){n.contexts[e.name].value=null,delete n.contexts[e.name]}return e},exports.injectProviders=function(e,t){let n=g(e);for(let s of t){let t={handle:s,value:null};n.contexts[s.name]=t,n.current=s,t.value=s(e)}return e},exports.isSelectorNot=d,exports.lookAt=function(n,s,i,r=0,o=1){let a=e.vec3.create(),l=e.quat.create();e.mat4.getTranslation(a,n),e.mat4.getRotation(l,n);let c=e.vec3.fromValues(s,i,r);e.mat4.lookAt(n,a,c,t);let h=e.quat.create();e.mat4.getRotation(h,n),e.quat.slerp(l,l,h,o),e.mat4.fromRotationTranslation(n,l,a)},exports.panTo=function(t,n,s,i=0,r=1){let o=e.vec3.create();e.mat4.getTranslation(o,t);let a=e.vec3.fromValues((n-o[0])*r,(s-o[1])*r,(i-o[2])*r);e.mat4.translate(t,t,a)},exports.revertEffects=async function(e,t){let n=function(e){if(x in e)return e[x];return null}(e);if(!n)return e;for(let e of t.slice().reverse()){let t=C(e,n.contexts);if(!t)throw new Error("Cannot revert context for non-existent provider.");let s=t.afters.slice();t.afters.length=0,await Promise.all(s.map((e=>e&&e())))}return e},exports.screenToWorldRay=function(t,n,s,i,r,o=!1){let a=e.vec4.fromValues(n,s,-1,1),l=e.mat4.create();return e.mat4.invert(l,i),e.vec4.transformMat4(a,a,l),a[2]=-1,a[3]=0,e.mat4.invert(l,r),e.vec4.transformMat4(a,a,l),t[0]=a[0],t[1]=a[1],t[2]=a[2],o&&e.vec3.normalize(t,t),t},exports.useEffect=function(e,t){const n=m(e);if(!n)throw new Error("Not a provider.");k(n,b(e).contexts).befores.push(t)},exports.useProvider=function(e,t){let n=g(e),s=t.name;if(s in n.contexts){let{value:i}=n.contexts[s];if(i)return i;throw m(e).name===t.name?new Error("Cannot useProvider() on self during initialization!"):new Error("This is not a provider.")}throw new Error(`Missing assigned dependent provider '${s}' in context.`)};
//# sourceMappingURL=milque-scene.cjs.js.map
