"use strict";var e=require("gl-matrix");const t=e.vec3.fromValues(0,1,0);class s{constructor(e,t){this.projectionMatrix=e,this.viewMatrix=t}resize(e,t){return this}}const i=Math.PI/3;const r=Math.PI/180;const n=100;function o(e,t,s){e?(s.nodes[e].children.push(t),s.nodes[t].parent=e):(s.roots.push(t),s.nodes[t].parent=0)}function a(e,t,s){if(e){let i=s.nodes[e].children,r=i.indexOf(t);i.splice(r,1),s.nodes[t].parentNode=0}else{let e=s.roots,i=e.indexOf(t);e.splice(i,1),s.nodes[t].parentNode=0}}function h(e,t,s,i,r){if(s>=n)return;let o=i(t,e);if(!1===o)return;let a=e.nodes[t],l=r?r(a.children,t,e):a.children;for(let t of l)h(e,t,s+1,i,r);"function"==typeof o&&o(t,e)}function l(e,t){delete t.nodes[e]}function c(e,t){let s=e.components;if(t in s)return s[t];{let e={};return s[t]=e,e}}function u(e,t,s,i){return c(e,s.name)[t]=i,i}function d(e,t,s){let i=c(e,s.name),r=i[t];delete i[t],s.delete(r)}function m(e,t){let s=t.name,i=c(e,s),r=Object.values(i);!function(e,t){let s={};e.components[t]=s}(e,s);for(let e of r)t.delete(e)}const p=Symbol("nextAvailableEntityId");function f(e){return++e[p]}class v{dispatch(e=null){}dispatchImmediately(e=null){}flush(e=1e3){}}function x(e,t){return e.priority-t.priority}exports.AnimationFrameLoop=class{constructor(e,t){const{animationFrameHandler:s=window}=t||{};this.handle=0,this.detail={prevTime:-1,currentTime:-1,deltaTime:0},this.animationFrameHandler=s,this.callback=e,this.next=this.next.bind(this),this.start=this.start.bind(this),this.cancel=this.cancel.bind(this)}next(e=performance.now()){this.handle=this.animationFrameHandler.requestAnimationFrame(this.next);let t=this.detail;t.prevTime=t.currentTime,t.currentTime=e,t.deltaTime=t.currentTime-t.prevTime,this.callback(this)}start(){return this.handle=this.animationFrameHandler.requestAnimationFrame(this.next),this}cancel(){return this.animationFrameHandler.cancelAnimationFrame(this.handle),this}},exports.Camera=s,exports.CommandTopic=class extends v{constructor(){super(),this.messages=[],this.queued=[]}dispatch(e){this.queued.push(e)}dispatchImmediately(e){this.messages.push(e)}flush(e=1e3){let t=this.queued.splice(0,Math.min(e,this.queued.length));this.messages.push(...t)}*poll(e=1e3){let t=0;for(;t<e&&this.messages.length>0;){let e=this.messages.shift();yield e,++t}}},exports.ComponentClass=class{constructor(e,t=(()=>null),s=(()=>{})){this.name=e,this.new=t,this.delete=s}},exports.EntityManager=class{constructor(){this.components={},this[p]=1,this.queue=[]}flush(){for(;this.queue.length>0;){let[e,...t]=this.queue.shift();switch(e){case"attach":{let[e,s,i]=t;u(this,e,s,i)}break;case"detach":{let[e,s]=t;d(this,e,s)}break;case"clear":{let[e]=t;m(this,e)}}}}createAndAttach(...e){let t=f(this),s=[t];for(let i of e){let e=this.attach(t,i);s.push(e)}return s}create(){return f(this)}destroy(e){for(let t of Object.values(this.components))e in t&&delete t[e]}exists(e){for(let t of Object.values(this.components))if(e in t)return!0;return!1}attach(e,t){let s=t.new();return this.queue.push(["attach",e,t,s]),s}attachImmediately(e,t){let s=t.new();return u(this,e,t,s)}detach(e,t){this.queue.push(["detach",e,t])}detachImmediately(e,t){d(this,e,t)}clear(e){this.queue.push(["clear",e])}clearImmediately(e){m(this,e)}get(e,t){let s=c(this,t.name);return s?null:s[e]||null}count(e){let t=c(this,e.name);return t?0:Object.keys(t).length}reset(){this.components={},this[p]=1,this.queue.length=0}},exports.EntityQuery=class{constructor(...e){this.selectors=e}count(e){let t=0,s=this.findAll(e);for(;!s.next().done;)++t;return t}find(e){let t=this.findAll(e).next();return t.done?[]:t.value}*findAll(e){if(this.selectors.length<=0)return;let t=c(e,this.selectors[0].name),s=new Array(this.selectors.length+1);for(let i of Object.keys(t)){let t=Number(i),r=!0;s[0]=t;let n=1;for(let i of this.selectors){let o=c(e,i.name);if(!(t in o)){r=!1;break}let a=o[t];s[n++]=a}r&&(yield s)}}},exports.EntityTemplate=class{constructor(...e){this.componentClasses=e}create(e){let t=f(e),s=[t];for(let i of this.componentClasses){let r=e.attach(t,i);s.push(r)}return s}destroy(e,t){for(let s of this.componentClasses)e.detach(t,s)}},exports.EventTopic=class extends v{constructor(){super(),this.listeners=[],this.queued=[]}on(e){return this.listeners.push(e),this}off(e){let t=this.listeners.indexOf(e);return t>=0&&this.listeners.splice(t,1),this}once(e){let t=s=>(this.off(t),e(s));return this.on(t),this}dispatch(e=null){this.queued.push(e)}dispatchImmediately(e=null){for(let t of this.listeners){if(!0===t(e))break}}flush(e=1e3){let t=0;for(;this.queued.length>0&&t++<e;){let e=this.queued.shift();this.dispatchImmediately(e)}}count(){return this.listeners.length}},exports.FirstPersonCameraController=class{constructor(t={locky:!1}){this.locky=t.locky,this.position=e.vec3.create(),this.forward=e.vec3.fromValues(0,0,-1),this.right=e.vec3.fromValues(1,0,0),this.up=e.vec3.fromValues(0,1,0),this.forwardAmount=0,this.rightAmount=0,this.upAmount=0,this.pitch=0,this.yaw=-90}look(e,t,s=1){return s*=1e3,this.pitch=Math.min(89.9,Math.max(-89.9,this.pitch+t*s)),this.yaw=(this.yaw+e*s)%360,this}move(e,t=0,s=0,i=1){return this.forwardAmount+=e*i,this.rightAmount+=t*i,this.upAmount+=s*i,this}apply(t){let{position:s,forward:i,right:n,up:o,forwardAmount:a,rightAmount:h,upAmount:l,pitch:c,yaw:u}=this,d=u*r,m=c*r,p=Math.cos(d),f=Math.cos(m),v=Math.sin(d),x=p*f,g=Math.sin(m),y=v*f;e.vec3.normalize(i,e.vec3.set(i,x,this.locky?0:g,y)),e.vec3.normalize(n,e.vec3.cross(n,i,o));let b=e.vec3.create();e.vec3.scale(b,i,a),e.vec3.add(s,s,b),e.vec3.scale(b,n,h),e.vec3.add(s,s,b),e.vec3.scale(b,o,l),e.vec3.add(s,s,b),this.forwardAmount=0,this.rightAmount=0,this.upAmount=0,this.locky&&e.vec3.set(i,x,g,y);let A=e.vec3.add(b,s,i);return e.mat4.lookAt(t,s,A,o),t}},exports.OrthographicCamera=class extends s{constructor(t,s,i,r,n=-1e3,o=1e3){super(e.mat4.create(),e.mat4.create()),this.orthoBounds={left:void 0===t?void 0:Number(t),top:void 0===s?void 0:Number(s),right:void 0===i?void 0:Number(i),bottom:void 0===r?void 0:Number(r)},this.clippingPlane={near:Number(n),far:Number(o)}}resize(t,s){const{near:i,far:r}=this.clippingPlane,{left:n,top:o,right:a,bottom:h}=this.orthoBounds;let l=this.projectionMatrix,c=void 0!==n;if(void 0!==t)if(c){const c=t/s;e.mat4.ortho(l,n*c,a*c,h,o,i,r)}else e.mat4.ortho(l,0,t,s,0,i,r);else c?e.mat4.ortho(l,n,a,h,o,i,r):e.mat4.ortho(l,-1,1,1,-1,-1,1);return this}},exports.PerspectiveCamera=class extends s{constructor(t=i,s=.1,r=1e3){super(e.mat4.create(),e.mat4.create()),this.fieldOfView=Number(t),this.clippingPlane={near:Number(s),far:Number(r)}}resize(t,s){const i=void 0===t?1:t/s,{near:r,far:n}=this.clippingPlane;return e.mat4.perspective(this.projectionMatrix,this.fieldOfView,i,r,n),this}},exports.PriorityEventTopic=class extends v{constructor(){super(),this.listeners=[],this.queued=[]}on(e,t){return this.listeners.push({priority:e,callback:t}),this.listeners.sort(x),this}off(e){for(let t=0;t<this.listeners.length;++t)if(this.listeners.at(t).callback===e){this.listeners.splice(t,1);break}return this}once(e,t){let s=e=>(this.off(s),t(e));return this.on(e,s)}count(){return this.listeners.length}dispatch(e=null){return this.queued.push(e),this}dispatchImmediately(e=null){for(let t of this.listeners){if(!0===t.callback(e))break}return this}flush(e=1e3){let t=0;for(;this.queued.length>0&&t++<e;){let e=this.queued.shift();this.dispatchImmediately(e)}return this}},exports.SceneGraph=class{constructor(){this.nodes={},this.roots=[],this._nextAvailableSceneNodeId=1}createSceneNode(e){let t=this._nextAvailableSceneNodeId++,s={parent:0,children:[]};return this.nodes[t]=s,o(e,t,this),t}createSceneNodes(e,t){let s=[];for(let i=0;i<e;++i)s.push(this.createSceneNode(t));return s}deleteSceneNode(e){if(!(e in this.nodes))throw new Error("Cannot delete non-existant scene node for scene graph.");a(this.nodes[e].parent,e,this),h(this,e,0,l)}deleteSceneNodes(e){for(let t of e)this.deleteSceneNode(t)}getSceneNodeInfo(e){return this.nodes[e]}parentSceneNode(e,t){a(this.nodes[e].parent,e,this),o(t,e,this)}replaceSceneNode(e,t){let s=this.nodes[e],i=s.parent,r=s.children.slice();if(a(i,e,this),s.children.length=0,t){let e=this.nodes[t];a(e.parent,t,this),e.children.push(...r),o(i,t,this)}else if(i){this.nodes[i].children.push(...r)}else this.roots.push(...r);for(let e of r)this.nodes[e].parent=i}walk(e,t={}){const{from:s,childFilter:i}=t;let r;r=s?Array.isArray(s)?s:[s]:this.roots,i&&(r=i(r,0,this));for(let t of r)h(this,t,0,e,i)}},exports.Topic=v,exports.lookAt=function(s,i,r,n=0,o=1){let a=e.vec3.create(),h=e.quat.create();e.mat4.getTranslation(a,s),e.mat4.getRotation(h,s);let l=e.vec3.fromValues(i,r,n);e.mat4.lookAt(s,a,l,t);let c=e.quat.create();e.mat4.getRotation(c,s),e.quat.slerp(h,h,c,o),e.mat4.fromRotationTranslation(s,h,a)},exports.panTo=function(t,s,i,r=0,n=1){let o=e.vec3.create();e.mat4.getTranslation(o,t);let a=e.vec3.fromValues((s-o[0])*n,(i-o[1])*n,(r-o[2])*n);e.mat4.translate(t,t,a)},exports.screenToWorldRay=function(t,s,i,r,n,o=!1){let a=e.vec4.fromValues(s,i,-1,1),h=e.mat4.create();return e.mat4.invert(h,r),e.vec4.transformMat4(a,a,h),a[2]=-1,a[3]=0,e.mat4.invert(h,n),e.vec4.transformMat4(a,a,h),t[0]=a[0],t[1]=a[1],t[2]=a[2],o&&e.vec3.normalize(t,t),t};
//# sourceMappingURL=milque-scene.cjs.js.map
