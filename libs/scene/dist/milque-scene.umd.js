!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports,require("gl-matrix")):"function"==typeof define&&define.amd?define(["exports","gl-matrix"],e):e(((t="undefined"!=typeof globalThis?globalThis:t||self).milque=t.milque||{},t.milque.scene={}),t.glMatrix)}(this,(function(t,e){"use strict";const n=e.vec3.fromValues(0,1,0);class s{constructor(t,e){this.projectionMatrix=t,this.viewMatrix=e}resize(t,e){return this}}const i=Math.PI/3;const a=Math.PI/180;const r=100;function o(t,e,n){t?(n.nodes[t].children.push(e),n.nodes[e].parent=t):(n.roots.push(e),n.nodes[e].parent=0)}function l(t,e,n){if(t){let s=n.nodes[t].children,i=s.indexOf(e);s.splice(i,1),n.nodes[e].parentNode=0}else{let t=n.roots,s=t.indexOf(e);t.splice(s,1),n.nodes[e].parentNode=0}}function h(t,e,n,s,i){if(n>=r)return;let a=s(e,t);if(!1===a)return;let o=t.nodes[e],l=i?i(o.children,e,t):o.children;for(let e of l)h(t,e,n+1,s,i);"function"==typeof a&&a(e,t)}function c(t,e){delete e.nodes[t]}class u{constructor(){this.cachedResults={},this.keyQueryMapping={},this.onEntityComponentChanged=this.onEntityComponentChanged.bind(this)}onEntityComponentChanged(t,e,n,s,i){for(let a of Object.values(this.keyQueryMapping)){let r=this.cachedResults[a.key];if(i){let t=r.indexOf(e);t>=0&&r.splice(t,1)}else if(n){if(a.hasSelector(d(n))){let t=r.indexOf(e);t>=0&&r.splice(t,1)}else if(a.hasSelector(n)&&a.test(t,e)){r.indexOf(e)<0&&r.push(e)}}else if(s)if(a.hasSelector(d(s))&&a.test(t,e)){r.indexOf(e)<0&&r.push(e)}else if(a.hasSelector(s)&&a.test(t,e)){let t=r.indexOf(e);t>=0&&r.splice(t,1)}}}findAny(t,e){let n=this.findAll(t,e);return n.length<=0?null:n[Math.floor(Math.random()*n.length)]}findAll(t,e){const n=e.key;let s;return n in this.keyQueryMapping?s=this.cachedResults[n]:(s=[],this.keyQueryMapping[n]=e,this.cachedResults[n]=s,e.hydrate(t,s)),s}count(t,e){return this.findAll(t,e).length}clear(t){const e=t.key;e in this.keyQueryMapping&&(delete this.keyQueryMapping[e],delete this.cachedResults[e])}reset(){this.keyQueryMapping={},this.cachedResults={}}}function d(t){return{type:"not",name:t.name,value:t}}function m(t){return"type"in t&&"not"===t.type}function f(t,e,n,s){t[0]=n;let i=1;for(let a of s)m(a)?t[i]=null:t[i]=e.get(n,a),++i;return t}function p(t,e){return t.priority-e.priority}t.AnimationFrameLoop=class{constructor(t,e){const{animationFrameHandler:n=window}=e||{};this.handle=0,this.detail={prevTime:-1,currentTime:-1,deltaTime:0},this.animationFrameHandler=n,this.callback=t,this.next=this.next.bind(this),this.start=this.start.bind(this),this.cancel=this.cancel.bind(this)}next(t=performance.now()){this.handle=this.animationFrameHandler.requestAnimationFrame(this.next);let e=this.detail;e.prevTime=e.currentTime,e.currentTime=t,e.deltaTime=e.currentTime-e.prevTime,this.callback(this)}start(){return this.handle=this.animationFrameHandler.requestAnimationFrame(this.next),this}cancel(){return this.animationFrameHandler.cancelAnimationFrame(this.handle),this}},t.Camera=s,t.ComponentClass=class{constructor(t,e=(()=>null),n=(()=>{})){this.name=t,this.new=e,this.delete=n}},t.EntityManager=class{constructor(){this.components={},this.nameClassMapping={},this.nextAvailableEntityId=1,this.queue=[],this.queries=new u}entityComponentChangedCallback(t,e,n,s){this.queries.onEntityComponentChanged(this,t,e,n,s)}flush(){for(;this.queue.length>0;){let[t,...e]=this.queue.shift();switch(t){case"attach":{let[t,n,s]=e;this.attachImmediately(t,n,s)}break;case"detach":{let[t,n]=e;this.detachImmediately(t,n)}break;case"clear":{let[t]=e;this.clearImmediately(t)}}}}create(){return this.nextAvailableEntityId++}destroy(t){const e=this.components;for(const n of Object.keys(e)){const s=e[n];t in s&&(delete s[t],this.entityComponentChangedCallback(t,null,this.nameClassMapping[n],!1))}this.entityComponentChangedCallback(t,null,null,!0)}exists(t,...e){if(e.length>0){for(const n of e){if(!(t in this.mapOf(n)))return!1}return!0}for(let e of Object.values(this.components))if(t in e)return!0;return!1}attach(t,e,n){return void 0===n&&(n=e.new()),this.queue.push(["attach",t,e,n]),n}attachImmediately(t,e,n){return void 0===n&&(n=e.new()),this.mapOf(e)[t]=n,this.entityComponentChangedCallback(t,e,null,!1),n}detach(t,e){this.queue.push(["detach",t,e])}detachImmediately(t,e){let n=this.mapOf(e),s=n[t];delete n[t],e.delete(s),this.entityComponentChangedCallback(t,null,e,!1)}clear(t){this.queue.push(["clear",t])}clearImmediately(t){const e=t.name,n=this.components,s=n[e];let i=Object.keys(s).map(Number),a=Object.values(s);n[e]={},this.nameClassMapping[e]=t;for(let e of a)t.delete(e);for(let e of i)this.entityComponentChangedCallback(e,null,t,!1)}get(t,e){return this.mapOf(e)[t]||null}count(t){return Object.keys(this.mapOf(t)).length}keysOf(t){return Object.keys(this.mapOf(t)).map(Number)}valuesOf(t){return Object.values(this.mapOf(t))}mapOf(t){const e=t.name,n=this.components;if(e in n)return n[e];{let s={};return n[e]=s,this.nameClassMapping[e]=t,s}}entityIds(){let t=new Set;for(let e of Object.values(this.components))for(let n of Object.keys(e))t.add(n);return t}componentClasses(){return Object.values(this.nameClassMapping)}reset(){const t=this.components;let e=new Set;for(const n of Object.keys(t)){const s=this.nameClassMapping[n],i=t[n];for(let t of Object.keys(i))e.add(Number(t));this.clearImmediately(s)}for(let t of e)this.entityComponentChangedCallback(t,null,null,!0);e.clear(),this.queries.reset(),this.components={},this.nextAvailableEntityId=1,this.queue.length=0}},t.EntityTemplate=class{constructor(...t){this.componentClasses=t}create(t){let e=t.create(),n=[e];for(let s of this.componentClasses){let i=t.attach(e,s);n.push(i)}return n}destroy(t,e){for(let n of this.componentClasses)t.detach(e,n)}},t.FirstPersonCameraController=class{constructor(t={locky:!1}){this.locky=t.locky,this.position=e.vec3.create(),this.forward=e.vec3.fromValues(0,0,-1),this.right=e.vec3.fromValues(1,0,0),this.up=e.vec3.fromValues(0,1,0),this.forwardAmount=0,this.rightAmount=0,this.upAmount=0,this.pitch=0,this.yaw=-90}look(t,e,n=1){return n*=1e3,this.pitch=Math.min(89.9,Math.max(-89.9,this.pitch+e*n)),this.yaw=(this.yaw+t*n)%360,this}move(t,e=0,n=0,s=1){return this.forwardAmount+=t*s,this.rightAmount+=e*s,this.upAmount+=n*s,this}apply(t){let{position:n,forward:s,right:i,up:r,forwardAmount:o,rightAmount:l,upAmount:h,pitch:c,yaw:u}=this,d=u*a,m=c*a,f=Math.cos(d),p=Math.cos(m),y=Math.sin(d),g=f*p,v=Math.sin(m),b=y*p;e.vec3.normalize(s,e.vec3.set(s,g,this.locky?0:v,b)),e.vec3.normalize(i,e.vec3.cross(i,s,r));let k=e.vec3.create();e.vec3.scale(k,s,o),e.vec3.add(n,n,k),e.vec3.scale(k,i,l),e.vec3.add(n,n,k),e.vec3.scale(k,r,h),e.vec3.add(n,n,k),this.forwardAmount=0,this.rightAmount=0,this.upAmount=0,this.locky&&e.vec3.set(s,g,v,b);let O=e.vec3.add(k,n,s);return e.mat4.lookAt(t,n,O,r),t}},t.Not=d,t.OrthographicCamera=class extends s{constructor(t,n,s,i,a=-1e3,r=1e3){super(e.mat4.create(),e.mat4.create()),this.orthoBounds={left:void 0===t?void 0:Number(t),top:void 0===n?void 0:Number(n),right:void 0===s?void 0:Number(s),bottom:void 0===i?void 0:Number(i)},this.clippingPlane={near:Number(a),far:Number(r)}}resize(t,n){const{near:s,far:i}=this.clippingPlane,{left:a,top:r,right:o,bottom:l}=this.orthoBounds;let h=this.projectionMatrix,c=void 0!==a;if(void 0!==t)if(c){const c=t/n;e.mat4.ortho(h,a*c,o*c,l,r,s,i)}else e.mat4.ortho(h,0,t,n,0,s,i);else c?e.mat4.ortho(h,a,o,l,r,s,i):e.mat4.ortho(h,-1,1,1,-1,-1,1);return this}},t.PerspectiveCamera=class extends s{constructor(t=i,n=.1,s=1e3){super(e.mat4.create(),e.mat4.create()),this.fieldOfView=Number(t),this.clippingPlane={near:Number(n),far:Number(s)}}resize(t,n){const s=void 0===t?1:t/n,{near:i,far:a}=this.clippingPlane;return e.mat4.perspective(this.projectionMatrix,this.fieldOfView,s,i,a),this}},t.Query=class{constructor(...t){this.selectors=t,this.key=t.map((t=>m(t)?`!${t.name}`:t.name)).sort().join("&")}hasSelector(t){return m(t)?this.selectors.findIndex((e=>m(e)&&e.name===t.name))>=0:this.selectors.findIndex((e=>e.name===t.name))>=0}test(t,e){for(let n of this.selectors)if(m(n)){const s=n.value;if(t.exists(e,s))return!1}else{const s=n;if(!t.exists(e,s))return!1}return!0}hydrate(t,e){if(this.selectors.length<=0)return e.length=0,e;let n=t.entityIds();for(let s of n)this.test(t,s)&&e.push(s);return e}count(t){return t.queryManager.count(t,this)}findAny(t){const e=t.queryManager;let n=new Array(this.selectors.length+1),s=e.findAny(t,this);return null===s?n.fill(void 0):(f(n,t,s,this.selectors),n)}*findAll(t){const e=t.queryManager;let n=new Array(this.selectors.length+1),s=e.findAll(t,this);for(let e of s)f(n,t,e,this.selectors),yield n}},t.QueryManager=u,t.SceneGraph=class{constructor(){this.nodes={},this.roots=[],this._nextAvailableSceneNodeId=1}createSceneNode(t){let e=this._nextAvailableSceneNodeId++,n={parent:0,children:[]};return this.nodes[e]=n,o(t,e,this),e}createSceneNodes(t,e){let n=[];for(let s=0;s<t;++s)n.push(this.createSceneNode(e));return n}deleteSceneNode(t){if(!(t in this.nodes))throw new Error("Cannot delete non-existant scene node for scene graph.");l(this.nodes[t].parent,t,this),h(this,t,0,c)}deleteSceneNodes(t){for(let e of t)this.deleteSceneNode(e)}getSceneNodeInfo(t){return this.nodes[t]}parentSceneNode(t,e){l(this.nodes[t].parent,t,this),o(e,t,this)}replaceSceneNode(t,e){let n=this.nodes[t],s=n.parent,i=n.children.slice();if(l(s,t,this),n.children.length=0,e){let t=this.nodes[e];l(t.parent,e,this),t.children.push(...i),o(s,e,this)}else if(s){this.nodes[s].children.push(...i)}else this.roots.push(...i);for(let t of i)this.nodes[t].parent=s}walk(t,e={}){const{from:n,childFilter:s}=e;let i;i=n?Array.isArray(n)?n:[n]:this.roots,s&&(i=s(i,0,this));for(let e of i)h(this,e,0,t,s)}},t.Topic=class{constructor(t){this.name=t}dispatch(t,e){t.dispatch(this,e)}on(t,e,n){return t.addEventListener(this,n,{priority:e}),this}off(t,e){return t.removeEventListener(this,e),this}once(t,e,n){let s=e=>(this.off(t,s),n(e));return this.on(t,e,s)}*poll(t,e){e=Math.min(e,t.count(this));for(let n=0;n<e;++n)yield t.poll(this)}retain(t,e){t.retain(this,e)}*pollAndRetain(t,e){this.retain(t,e);for(let n of this.poll(t,e))yield n}},t.TopicManager=class{constructor(){this.cachedIn={},this.cachedOut={},this.callbacks={},this.maxRetains={},this.nameTopicMapping={}}addEventListener(t,e,n){const{priority:s=0}=n;let i=this.callbacksOf(t);i.push({callback:e,priority:s}),i.sort(p)}removeEventListener(t,e){let n=this.callbacksOf(t),s=n.findIndex((t=>t.callback===e));s>=0&&n.splice(s,1)}countEventListeners(t){return this.callbacksOf(t).length}dispatch(t,e){this.incomingOf(t).push(e)}dispatchImmediately(t,e){let n=this.callbacksOf(t);for(let{callback:t}of n){if(!0===t(e))return}this.outgoingOf(t).push(e)}count(t){return this.outgoingOf(t).length}poll(t){let e=this.outgoingOf(t);return e.length<=0?null:e.shift()}retain(t,e){const n=t.name;let s=Math.max(e,this.maxRetains[n]||0);this.maxRetains[n]=s}flush(t=100){for(const e of Object.keys(this.cachedIn)){const n=this.nameTopicMapping[e],s=this.cachedIn[e],i=this.cachedOut[e],a=this.maxRetains[e]||0;a<i.length&&i.splice(0,i.length-a);let r=Math.min(t,s.length);for(let t=0;t<r;++t){let t=s.shift();this.dispatchImmediately(n,t)}}}getPendingRetainCount(t){return this.maxRetains[t.name]||0}getPendingFlushCount(t){return this.incomingOf(t).length}reset(){this.cachedIn={},this.cachedOut={},this.callbacks={},this.maxRetains={},this.nameTopicMapping={}}incomingOf(t){const e=t.name;if(e in this.cachedIn)return this.cachedIn[e];{let t=[];return this.cachedIn[e]=t,t}}outgoingOf(t){const e=t.name;if(e in this.cachedOut)return this.cachedOut[e];{let t=[];return this.cachedOut[e]=t,t}}callbacksOf(t){const e=t.name;if(e in this.callbacks)return this.callbacks[e];{let t=[];return this.callbacks[e]=t,t}}},t.isSelectorNot=m,t.lookAt=function(t,s,i,a=0,r=1){let o=e.vec3.create(),l=e.quat.create();e.mat4.getTranslation(o,t),e.mat4.getRotation(l,t);let h=e.vec3.fromValues(s,i,a);e.mat4.lookAt(t,o,h,n);let c=e.quat.create();e.mat4.getRotation(c,t),e.quat.slerp(l,l,c,r),e.mat4.fromRotationTranslation(t,l,o)},t.panTo=function(t,n,s,i=0,a=1){let r=e.vec3.create();e.mat4.getTranslation(r,t);let o=e.vec3.fromValues((n-r[0])*a,(s-r[1])*a,(i-r[2])*a);e.mat4.translate(t,t,o)},t.screenToWorldRay=function(t,n,s,i,a,r=!1){let o=e.vec4.fromValues(n,s,-1,1),l=e.mat4.create();return e.mat4.invert(l,i),e.vec4.transformMat4(o,o,l),o[2]=-1,o[3]=0,e.mat4.invert(l,a),e.vec4.transformMat4(o,o,l),t[0]=o[0],t[1]=o[1],t[2]=o[2],r&&e.vec3.normalize(t,t),t}}));
//# sourceMappingURL=milque-scene.umd.js.map
