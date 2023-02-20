"use strict";var t=require("gl-matrix");const e=t.vec3.fromValues(0,1,0);class s{constructor(t,e){this.projectionMatrix=t,this.viewMatrix=e}resize(t,e){return this}}const n=Math.PI/3;const i=Math.PI/180;const r=100;function a(t,e,s){t?(s.nodes[t].children.push(e),s.nodes[e].parent=t):(s.roots.push(e),s.nodes[e].parent=0)}function o(t,e,s){if(t){let n=s.nodes[t].children,i=n.indexOf(e);n.splice(i,1),s.nodes[e].parentNode=0}else{let t=s.roots,n=t.indexOf(e);t.splice(n,1),s.nodes[e].parentNode=0}}function l(t,e,s,n,i){if(s>=r)return;let a=n(e,t);if(!1===a)return;let o=t.nodes[e],h=i?i(o.children,e,t):o.children;for(let e of h)l(t,e,s+1,n,i);"function"==typeof a&&a(e,t)}function h(t,e){delete e.nodes[t]}class c{constructor(){this.cachedResults={},this.keyQueryMapping={},this.onEntityComponentChanged=this.onEntityComponentChanged.bind(this)}onEntityComponentChanged(t,e,s,n,i){for(let r of Object.values(this.keyQueryMapping)){let a=this.cachedResults[r.key];if(i){let t=a.indexOf(e);t>=0&&a.splice(t,1)}else if(s){if(r.hasSelector(u(s))){let t=a.indexOf(e);t>=0&&a.splice(t,1)}else if(r.hasSelector(s)&&r.test(t,e)){a.indexOf(e)<0&&a.push(e)}}else if(n)if(r.hasSelector(u(n))&&r.test(t,e)){a.indexOf(e)<0&&a.push(e)}else if(r.hasSelector(n)&&r.test(t,e)){let t=a.indexOf(e);t>=0&&a.splice(t,1)}}}findAny(t,e){let s=this.findAll(t,e);return s.length<=0?null:s[Math.floor(Math.random()*s.length)]}findAll(t,e){const s=e.key;let n;return s in this.keyQueryMapping?n=this.cachedResults[s]:(n=[],this.keyQueryMapping[s]=e,this.cachedResults[s]=n,e.hydrate(t,n)),n}count(t,e){return this.findAll(t,e).length}clear(t){const e=t.key;e in this.keyQueryMapping&&(delete this.keyQueryMapping[e],delete this.cachedResults[e])}reset(){this.keyQueryMapping={},this.cachedResults={}}}function u(t){return{type:"not",name:t.name,value:t}}function d(t){return"type"in t&&"not"===t.type}function m(t,e,s,n){t[0]=s;let i=1;for(let r of n)d(r)?t[i]=null:t[i]=e.get(s,r),++i;return t}function p(t,e){return t.priority-e.priority}exports.AnimationFrameLoop=class{constructor(t,e){const{animationFrameHandler:s=window}=e||{};this.handle=0,this.detail={prevTime:-1,currentTime:-1,deltaTime:0},this.animationFrameHandler=s,this.callback=t,this.next=this.next.bind(this),this.start=this.start.bind(this),this.cancel=this.cancel.bind(this)}next(t=performance.now()){this.handle=this.animationFrameHandler.requestAnimationFrame(this.next);let e=this.detail;e.prevTime=e.currentTime,e.currentTime=t,e.deltaTime=e.currentTime-e.prevTime,this.callback(this)}start(){return this.handle=this.animationFrameHandler.requestAnimationFrame(this.next),this}cancel(){return this.animationFrameHandler.cancelAnimationFrame(this.handle),this}},exports.Camera=s,exports.ComponentClass=class{constructor(t,e=(()=>null),s=(()=>{})){this.name=t,this.new=e,this.delete=s}},exports.EntityManager=class{constructor(){this.components={},this.nameClassMapping={},this.nextAvailableEntityId=1,this.queue=[],this.queries=new c}entityComponentChangedCallback(t,e,s,n){this.queries.onEntityComponentChanged(this,t,e,s,n)}flush(){for(;this.queue.length>0;){let[t,...e]=this.queue.shift();switch(t){case"attach":{let[t,s,n]=e;this.attachImmediately(t,s,n)}break;case"detach":{let[t,s]=e;this.detachImmediately(t,s)}break;case"clear":{let[t]=e;this.clearImmediately(t)}}}}create(){return this.nextAvailableEntityId++}destroy(t){const e=this.components;for(const s of Object.keys(e)){const n=e[s];t in n&&(delete n[t],this.entityComponentChangedCallback(t,null,this.nameClassMapping[s],!1))}this.entityComponentChangedCallback(t,null,null,!0)}exists(t,...e){if(e.length>0){for(const s of e){if(!(t in this.mapOf(s)))return!1}return!0}for(let e of Object.values(this.components))if(t in e)return!0;return!1}attach(t,e,s){return void 0===s&&(s=e.new()),this.queue.push(["attach",t,e,s]),s}attachImmediately(t,e,s){return void 0===s&&(s=e.new()),this.mapOf(e)[t]=s,this.entityComponentChangedCallback(t,e,null,!1),s}detach(t,e){this.queue.push(["detach",t,e])}detachImmediately(t,e){let s=this.mapOf(e),n=s[t];delete s[t],e.delete(n),this.entityComponentChangedCallback(t,null,e,!1)}clear(t){this.queue.push(["clear",t])}clearImmediately(t){const e=t.name,s=this.components,n=s[e];let i=Object.keys(n).map(Number),r=Object.values(n);s[e]={},this.nameClassMapping[e]=t;for(let e of r)t.delete(e);for(let e of i)this.entityComponentChangedCallback(e,null,t,!1)}get(t,e){return this.mapOf(e)[t]||null}count(t){return Object.keys(this.mapOf(t)).length}keysOf(t){return Object.keys(this.mapOf(t)).map(Number)}valuesOf(t){return Object.values(this.mapOf(t))}mapOf(t){const e=t.name,s=this.components;if(e in s)return s[e];{let n={};return s[e]=n,this.nameClassMapping[e]=t,n}}entityIds(){let t=new Set;for(let e of Object.values(this.components))for(let s of Object.keys(e))t.add(s);return t}componentClasses(){return Object.values(this.nameClassMapping)}reset(){const t=this.components;let e=new Set;for(const s of Object.keys(t)){const n=this.nameClassMapping[s],i=t[s];for(let t of Object.keys(i))e.add(Number(t));this.clearImmediately(n)}for(let t of e)this.entityComponentChangedCallback(t,null,null,!0);e.clear(),this.queries.reset(),this.components={},this.nextAvailableEntityId=1,this.queue.length=0}},exports.EntityTemplate=class{constructor(...t){this.componentClasses=t}create(t){let e=t.create(),s=[e];for(let n of this.componentClasses){let i=t.attach(e,n);s.push(i)}return s}destroy(t,e){for(let s of this.componentClasses)t.detach(e,s)}},exports.FirstPersonCameraController=class{constructor(e={locky:!1}){this.locky=e.locky,this.position=t.vec3.create(),this.forward=t.vec3.fromValues(0,0,-1),this.right=t.vec3.fromValues(1,0,0),this.up=t.vec3.fromValues(0,1,0),this.forwardAmount=0,this.rightAmount=0,this.upAmount=0,this.pitch=0,this.yaw=-90}look(t,e,s=1){return s*=1e3,this.pitch=Math.min(89.9,Math.max(-89.9,this.pitch+e*s)),this.yaw=(this.yaw+t*s)%360,this}move(t,e=0,s=0,n=1){return this.forwardAmount+=t*n,this.rightAmount+=e*n,this.upAmount+=s*n,this}apply(e){let{position:s,forward:n,right:r,up:a,forwardAmount:o,rightAmount:l,upAmount:h,pitch:c,yaw:u}=this,d=u*i,m=c*i,p=Math.cos(d),f=Math.cos(m),y=Math.sin(d),g=p*f,v=Math.sin(m),b=y*f;t.vec3.normalize(n,t.vec3.set(n,g,this.locky?0:v,b)),t.vec3.normalize(r,t.vec3.cross(r,n,a));let x=t.vec3.create();t.vec3.scale(x,n,o),t.vec3.add(s,s,x),t.vec3.scale(x,r,l),t.vec3.add(s,s,x),t.vec3.scale(x,a,h),t.vec3.add(s,s,x),this.forwardAmount=0,this.rightAmount=0,this.upAmount=0,this.locky&&t.vec3.set(n,g,v,b);let k=t.vec3.add(x,s,n);return t.mat4.lookAt(e,s,k,a),e}},exports.Not=u,exports.OrthographicCamera=class extends s{constructor(e,s,n,i,r=-1e3,a=1e3){super(t.mat4.create(),t.mat4.create()),this.orthoBounds={left:void 0===e?void 0:Number(e),top:void 0===s?void 0:Number(s),right:void 0===n?void 0:Number(n),bottom:void 0===i?void 0:Number(i)},this.clippingPlane={near:Number(r),far:Number(a)}}resize(e,s){const{near:n,far:i}=this.clippingPlane,{left:r,top:a,right:o,bottom:l}=this.orthoBounds;let h=this.projectionMatrix,c=void 0!==r;if(void 0!==e)if(c){const c=e/s;t.mat4.ortho(h,r*c,o*c,l,a,n,i)}else t.mat4.ortho(h,0,e,s,0,n,i);else c?t.mat4.ortho(h,r,o,l,a,n,i):t.mat4.ortho(h,-1,1,1,-1,-1,1);return this}},exports.PerspectiveCamera=class extends s{constructor(e=n,s=.1,i=1e3){super(t.mat4.create(),t.mat4.create()),this.fieldOfView=Number(e),this.clippingPlane={near:Number(s),far:Number(i)}}resize(e,s){const n=void 0===e?1:e/s,{near:i,far:r}=this.clippingPlane;return t.mat4.perspective(this.projectionMatrix,this.fieldOfView,n,i,r),this}},exports.Query=class{constructor(...t){this.selectors=t,this.key=t.map((t=>d(t)?`!${t.name}`:t.name)).sort().join("&")}hasSelector(t){return d(t)?this.selectors.findIndex((e=>d(e)&&e.name===t.name))>=0:this.selectors.findIndex((e=>e.name===t.name))>=0}test(t,e){for(let s of this.selectors)if(d(s)){const n=s.value;if(t.exists(e,n))return!1}else{const n=s;if(!t.exists(e,n))return!1}return!0}hydrate(t,e){if(this.selectors.length<=0)return e.length=0,e;let s=t.entityIds();for(let n of s)this.test(t,n)&&e.push(n);return e}count(t){return t.queryManager.count(t,this)}findAny(t){const e=t.queryManager;let s=new Array(this.selectors.length+1),n=e.findAny(t,this);return null===n?s.fill(void 0):(m(s,t,n,this.selectors),s)}*findAll(t){const e=t.queryManager;let s=new Array(this.selectors.length+1),n=e.findAll(t,this);for(let e of n)m(s,t,e,this.selectors),yield s}},exports.QueryManager=c,exports.SceneGraph=class{constructor(){this.nodes={},this.roots=[],this._nextAvailableSceneNodeId=1}createSceneNode(t){let e=this._nextAvailableSceneNodeId++,s={parent:0,children:[]};return this.nodes[e]=s,a(t,e,this),e}createSceneNodes(t,e){let s=[];for(let n=0;n<t;++n)s.push(this.createSceneNode(e));return s}deleteSceneNode(t){if(!(t in this.nodes))throw new Error("Cannot delete non-existant scene node for scene graph.");o(this.nodes[t].parent,t,this),l(this,t,0,h)}deleteSceneNodes(t){for(let e of t)this.deleteSceneNode(e)}getSceneNodeInfo(t){return this.nodes[t]}parentSceneNode(t,e){o(this.nodes[t].parent,t,this),a(e,t,this)}replaceSceneNode(t,e){let s=this.nodes[t],n=s.parent,i=s.children.slice();if(o(n,t,this),s.children.length=0,e){let t=this.nodes[e];o(t.parent,e,this),t.children.push(...i),a(n,e,this)}else if(n){this.nodes[n].children.push(...i)}else this.roots.push(...i);for(let t of i)this.nodes[t].parent=n}walk(t,e={}){const{from:s,childFilter:n}=e;let i;i=s?Array.isArray(s)?s:[s]:this.roots,n&&(i=n(i,0,this));for(let e of i)l(this,e,0,t,n)}},exports.Topic=class{constructor(t){this.name=t}dispatch(t,e){t.dispatch(this,e)}on(t,e,s){return t.addEventListener(this,s,{priority:e}),this}off(t,e){return t.removeEventListener(this,e),this}once(t,e,s){let n=e=>(this.off(t,n),s(e));return this.on(t,e,n)}*poll(t,e){e=Math.min(e,t.count(this));for(let s=0;s<e;++s)yield t.poll(this)}retain(t,e){t.retain(this,e)}*pollAndRetain(t,e){this.retain(t,e);for(let s of this.poll(t,e))yield s}},exports.TopicManager=class{constructor(){this.cachedIn={},this.cachedOut={},this.callbacks={},this.maxRetains={},this.nameTopicMapping={}}addEventListener(t,e,s){const{priority:n=0}=s;let i=this.callbacksOf(t);i.push({callback:e,priority:n}),i.sort(p)}removeEventListener(t,e){let s=this.callbacksOf(t),n=s.findIndex((t=>t.callback===e));n>=0&&s.splice(n,1)}countEventListeners(t){return this.callbacksOf(t).length}dispatch(t,e){this.incomingOf(t).push(e)}dispatchImmediately(t,e){let s=this.callbacksOf(t);for(let{callback:t}of s){if(!0===t(e))return}this.outgoingOf(t).push(e)}count(t){return this.outgoingOf(t).length}poll(t){let e=this.outgoingOf(t);return e.length<=0?null:e.shift()}retain(t,e){const s=t.name;let n=Math.max(e,this.maxRetains[s]||0);this.maxRetains[s]=n}flush(t=100){for(const e of Object.keys(this.cachedIn)){const s=this.nameTopicMapping[e],n=this.cachedIn[e],i=this.cachedOut[e],r=this.maxRetains[e]||0;r<i.length&&i.splice(0,i.length-r);let a=Math.min(t,n.length);for(let t=0;t<a;++t){let t=n.shift();this.dispatchImmediately(s,t)}}}getPendingRetainCount(t){return this.maxRetains[t.name]||0}getPendingFlushCount(t){return this.incomingOf(t).length}reset(){this.cachedIn={},this.cachedOut={},this.callbacks={},this.maxRetains={},this.nameTopicMapping={}}incomingOf(t){const e=t.name;if(e in this.cachedIn)return this.cachedIn[e];{let t=[];return this.cachedIn[e]=t,t}}outgoingOf(t){const e=t.name;if(e in this.cachedOut)return this.cachedOut[e];{let t=[];return this.cachedOut[e]=t,t}}callbacksOf(t){const e=t.name;if(e in this.callbacks)return this.callbacks[e];{let t=[];return this.callbacks[e]=t,t}}},exports.isSelectorNot=d,exports.lookAt=function(s,n,i,r=0,a=1){let o=t.vec3.create(),l=t.quat.create();t.mat4.getTranslation(o,s),t.mat4.getRotation(l,s);let h=t.vec3.fromValues(n,i,r);t.mat4.lookAt(s,o,h,e);let c=t.quat.create();t.mat4.getRotation(c,s),t.quat.slerp(l,l,c,a),t.mat4.fromRotationTranslation(s,l,o)},exports.panTo=function(e,s,n,i=0,r=1){let a=t.vec3.create();t.mat4.getTranslation(a,e);let o=t.vec3.fromValues((s-a[0])*r,(n-a[1])*r,(i-a[2])*r);t.mat4.translate(e,e,o)},exports.screenToWorldRay=function(e,s,n,i,r,a=!1){let o=t.vec4.fromValues(s,n,-1,1),l=t.mat4.create();return t.mat4.invert(l,i),t.vec4.transformMat4(o,o,l),o[2]=-1,o[3]=0,t.mat4.invert(l,r),t.vec4.transformMat4(o,o,l),e[0]=o[0],e[1]=o[1],e[2]=o[2],a&&t.vec3.normalize(e,e),e};
//# sourceMappingURL=milque-scene.cjs.js.map
