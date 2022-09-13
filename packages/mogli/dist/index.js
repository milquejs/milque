!function(e,r){"object"==typeof exports&&"undefined"!=typeof module?r(exports):"function"==typeof define&&define.amd?define(["exports"],r):r(((e="undefined"!=typeof globalThis?globalThis:e||self).milque=e.milque||{},e.milque.mogli={}))}(this,(function(e){"use strict";function r(e){return"undefined"!=typeof WebGL2RenderingContext&&e instanceof WebGL2RenderingContext}var t=Object.freeze({__proto__:null,isWebGL2Supported:r});class n{constructor(e,r){this.gl=e,this.target=r}data(e,r){const t=this.gl,n=this.target;if("number"==typeof e)t.bufferData(n,e,r||t.STATIC_DRAW);else{if(!ArrayBuffer.isView(e))throw new Error("Source data must be a typed array.");t.bufferData(n,e,r||t.STATIC_DRAW)}return this}subData(e,t=0,n,i){const a=this.gl,u=this.target;if(!ArrayBuffer.isView(e))throw new Error("Source data must be a typed array.");if(void 0!==n)if(r(a))a.bufferSubData(u,t,e,n,i);else{const r=i?e.subarray(n,n+i):e.subarray(n);a.bufferSubData(u,t,r)}else a.bufferSubData(u,t,e);return this}}class i{constructor(e,r,t){this.dataContext=new n(e,r),this.handle=t||e.createBuffer(),e.bindBuffer(r,this.handle)}get gl(){return this.dataContext.gl}get target(){return this.dataContext.target}data(e,r){return this.dataContext.data(e,r),this}subData(e,r=0,t,n){return this.dataContext.subData(e,r,t,n),this}build(){return this.handle}}class a{constructor(e,r,t,i){this.gl=e,this.target=r,this.handle=i,this.type=t,this.bindContext=new n(e,this.target)}bind(e){return e.bindBuffer(this.target,this.handle),this.bindContext.gl=e,this.bindContext}}const u={BYTE:5120,UNSIGNED_BYTE:5121,SHORT:5122,UNSIGNED_SHORT:5123,INT:5124,UNSIGNED_INT:5125,FLOAT:5126,HALF_FLOAT:5131};function o(e,r){let t=[];const n=e.getProgramParameter(r,e.ACTIVE_UNIFORMS);for(let i=0;i<n;++i){let n=e.getActiveUniform(r,i);if(!n)break;t.push(n)}return t}function s(e,r){let t=[];const n=e.getProgramParameter(r,e.ACTIVE_ATTRIBUTES);for(let i=0;i<n;++i){let n=e.getActiveAttrib(r,i);n&&t.push(n)}return t}function f(e,r){switch(r){case e.FLOAT:case e.INT:case e.UNSIGNED_INT:case e.BOOL:return 1;case e.FLOAT_VEC2:case e.INT_VEC2:case e.BOOL_VEC2:return 2;case e.FLOAT_VEC3:case e.INT_VEC3:case e.BOOL_VEC3:return 3;case e.FLOAT_VEC4:case e.INT_VEC4:case e.BOOL_VEC4:case e.FLOAT_MAT2:return 4;case e.FLOAT_MAT3:return 9;case e.FLOAT_MAT4:return 16;default:throw new Error("Invalid vertex attribute type.")}}function c(e,t){switch(t){case e.FLOAT:case e.FLOAT_VEC2:case e.FLOAT_VEC3:case e.FLOAT_VEC4:return A}if(r(e)){const r=e;switch(t){case e.INT:case e.INT_VEC2:case e.INT_VEC3:case e.INT_VEC4:case e.BOOL:case e.BOOL_VEC2:case e.BOOL_VEC3:case e.BOOL_VEC4:return _;case e.FLOAT_MAT2:return T;case e.FLOAT_MAT3:return l;case e.FLOAT_MAT4:return h;case r.UNSIGNED_INT:case r.UNSIGNED_INT_VEC2:case r.UNSIGNED_INT_VEC3:case r.UNSIGNED_INT_VEC4:return E}}throw new Error("Cannot find attribute function for gl enum.")}function A(e,t,n,i,a=!1,u=0,o=0,s){if(this.bindBuffer(this.ARRAY_BUFFER,t),this.enableVertexAttribArray(e),this.vertexAttribPointer(e,n,i,a,u,o),void 0!==s){if(!r(this))throw new Error("Cannot use attribute divisor in WebGL 1.");this.vertexAttribDivisor(e,s)}}function _(e,t,n,i,a=!1,u=0,o=0,s){if(!r(this))throw new Error("Cannot use attribute divisor in WebGL 1.");const f=this;f.bindBuffer(f.ARRAY_BUFFER,t),f.enableVertexAttribArray(e),f.vertexAttribIPointer(e,n,i,u,o),void 0!==s&&f.vertexAttribDivisor(e,s)}function E(e,t,n,i,a=!1,u=0,o=0,s){if(!r(this))throw new Error("Cannot use attribute divisor in WebGL 1.");const f=this;f.bindBuffer(f.ARRAY_BUFFER,t),f.enableVertexAttribArray(e),f.vertexAttribIPointer(e,n,i,u,o),void 0!==s&&f.vertexAttribDivisor(e,s)}function T(e,r,t,n,i=!1,a=0,u=0,o){let s=f(this,this.FLOAT_MAT2);N(s*s,s,e,r,t,n,i,a,u,o)}function l(e,r,t,n,i=!1,a=0,u=0,o){let s=f(this,this.FLOAT_MAT3);N(s*s,s,e,r,t,n,i,a,u,o)}function h(e,r,t,n,i=!1,a=0,u=0,o){let s=f(this,this.FLOAT_MAT4);N(s*s,s,e,r,t,n,i,a,u,o)}function N(e,t,n,i,a,u,o,s,f,c){if(!r(this))throw new Error("Cannot use attribute divisor in WebGL 1.");const A=this;A.bindBuffer(A.ARRAY_BUFFER,i);let _=a/t,E=e*a,T=s/t;for(let e=0;e<t;++e){let r=n+e;A.enableVertexAttribArray(r),A.vertexAttribPointer(r,_,u,o,E,f+T*e),void 0!==c&&A.vertexAttribDivisor(r,c)}}function d(e,r){let t={};const n=s(e,r);for(let i of n){const n=i.name,a=i.size,u=i.type,o=e.getAttribLocation(r,n),s=c(e,u),A=f(e,u);t[n]={type:u,length:a,location:o,size:A,applier:s,set value([e,r,t,n,i,a,u]){this.applier(this.location,e,r,t,n,i,a,u)}}}return t}function L(e,r,t){let n=e.createShader(r);if(e.shaderSource(n,t),e.compileShader(n),!e.getShaderParameter(n,e.COMPILE_STATUS)){let r=e.getShaderInfoLog(n)+`\nFailed to compile shader:\n${t}`;throw e.deleteShader(n),new Error(r)}return n}async function R(e,r,t){for(let n of t)e.attachShader(r,n);e.linkProgram(r);const n=e.getExtension("KHR_parallel_shader_compile");if(n){const t=1e3/60;let i;do{await new Promise(((e,r)=>setTimeout(e,t))),i=e.getProgramParameter(r,n.COMPLETION_STATUS_KHR)}while(!i)}for(let n of t)e.detachShader(r,n),e.deleteShader(n);if(!e.getProgramParameter(r,e.LINK_STATUS)){let t=e.getProgramInfoLog(r);throw e.deleteProgram(r),new Error(t)}return r}function S(e,r,t,n,i){i?(e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,i),e.drawElements(r,n,e.UNSIGNED_SHORT,t)):e.drawArrays(r,t,n)}var I=Object.freeze({__proto__:null,createShader:L,createShaderProgram:R,draw:S,getProgramStatus:function(e,r){return{linkStatus:e.getProgramParameter(r,e.LINK_STATUS),deleteStatus:e.getProgramParameter(r,e.DELETE_STATUS),validateStatus:e.getProgramParameter(r,e.VALIDATE_STATUS),infoLog:e.getProgramInfoLog(r)}},getActiveUniforms:o,getActiveAttribs:s,createProgramInfo:function(e,r){return{handle:r,attributes:d(e,r),uniforms:W(e,r)}},linkProgramShaders:async function(e,r,t,n=[e.VERTEX_SHADER,e.FRAGMENT_SHADER]){let i=0,a=[];for(let r of t){if(i>=n.length)throw new Error("Missing shader type for shader source.");let t=n[i++],u=L(e,t,r);a.push(u)}return await R(e,r,a),r},bindProgramAttributes:z,bindProgramUniforms:function(e,r,t){let n=r.uniforms;for(let r in t){let i=t[r],{location:a,applier:u}=n[r];u.call(e,a,i)}}});function m(e,t){const n=e;switch(t){case n.FLOAT:return n.uniform1f;case n.FLOAT_VEC2:return n.uniform2fv;case n.FLOAT_VEC3:return n.uniform3fv;case n.FLOAT_VEC4:return n.uniform4fv;case n.INT:return n.uniform1i;case n.INT_VEC2:return n.uniform2iv;case n.INT_VEC3:return n.uniform3iv;case n.INT_VEC4:return n.uniform4iv;case n.BOOL:return n.uniform1i;case n.BOOL_VEC2:return n.uniform2iv;case n.BOOL_VEC3:return n.uniform3iv;case n.BOOL_VEC4:return n.uniform4iv;case n.FLOAT_MAT2:return O;case n.FLOAT_MAT3:return B;case n.FLOAT_MAT4:return g;case n.SAMPLER_2D:case n.SAMPLER_CUBE:return n.uniform1i}if(r(e)){const r=e;switch(t){case r.UNSIGNED_INT:return r.uniform1ui;case r.UNSIGNED_INT_VEC2:return r.uniform2uiv;case r.UNSIGNED_INT_VEC3:return r.uniform3uiv;case r.UNSIGNED_INT_VEC4:return r.uniform4uiv;case r.FLOAT_MAT2x3:return M;case r.FLOAT_MAT2x4:return C;case r.FLOAT_MAT3x2:return y;case r.FLOAT_MAT3x4:return x;case r.FLOAT_MAT4x2:return w;case r.FLOAT_MAT4x3:return G;case r.SAMPLER_3D:case r.SAMPLER_2D_SHADOW:case r.SAMPLER_2D_ARRAY:case r.SAMPLER_2D_ARRAY_SHADOW:case r.SAMPLER_CUBE_SHADOW:case r.INT_SAMPLER_2D:case r.INT_SAMPLER_3D:case r.INT_SAMPLER_CUBE:case r.INT_SAMPLER_2D_ARRAY:case r.UNSIGNED_INT_SAMPLER_2D:case r.UNSIGNED_INT_SAMPLER_3D:case r.UNSIGNED_INT_SAMPLER_CUBE:case r.UNSIGNED_INT_SAMPLER_2D_ARRAY:return r.uniform1i}}throw new Error("Cannot find uniform function for gl enum.")}function O(e,r){this.uniformMatrix2fv(e,!1,r)}function b(e,r,t,n,i){this.uniformMatrix2fv(e,!1,[r,t,n,i])}function B(e,r){this.uniformMatrix3fv(e,!1,r)}function F(e,r,t,n,i,a,u,o,s,f){this.uniformMatrix3fv(e,!1,[r,t,n,i,a,u,o,s,f])}function g(e,r){this.uniformMatrix4fv(e,!1,r)}function D(e,r,t,n,i,a,u,o,s,f,c,A,_,E,T,l,h){this.uniformMatrix4fv(e,!1,[r,t,n,i,a,u,o,s,f,c,A,_,E,T,l,h])}function M(e,r){this.uniformMatrix2x3fv(e,!1,r)}function U(e,r,t,n,i,a,u){this.uniformMatrix2x3fv(e,!1,[r,t,n,i,a,u])}function C(e,r){this.uniformMatrix2x4fv(e,!1,r)}function v(e,r,t,n,i,a,u,o,s){this.uniformMatrix2x4fv(e,!1,[r,t,n,i,a,u,o,s])}function y(e,r){this.uniformMatrix3x2fv(e,!1,r)}function P(e,r,t,n,i,a,u){this.uniformMatrix3x2fv(e,!1,[r,t,n,i,a,u])}function x(e,r){this.uniformMatrix3x4fv(e,!1,r)}function p(e,r,t,n,i,a,u,o,s,f,c,A,_){this.uniformMatrix3x4fv(e,!1,[r,t,n,i,a,u,o,s,f,c,A,_])}function w(e,r){this.uniformMatrix4x2fv(e,!1,r)}function V(e,r,t,n,i,a,u,o,s){this.uniformMatrix4x2fv(e,!1,[r,t,n,i,a,u,o,s])}function G(e,r){this.uniformMatrix4x3fv(e,!1,r)}function Y(e,r,t,n,i,a,u,o,s,f,c,A,_){this.uniformMatrix4x3fv(e,!1,[r,t,n,i,a,u,o,s,f,c,A,_])}var H=Object.freeze({__proto__:null,getUniformFunction:m,getUniformComponentFunction:function(e,t){const n=e;switch(t){case n.FLOAT:return n.uniform1f;case n.FLOAT_VEC2:return n.uniform2f;case n.FLOAT_VEC3:return n.uniform3f;case n.FLOAT_VEC4:return n.uniform4f;case n.INT:return n.uniform1i;case n.INT_VEC2:return n.uniform2i;case n.INT_VEC3:return n.uniform3i;case n.INT_VEC4:return n.uniform4i;case n.BOOL:return n.uniform1i;case n.BOOL_VEC2:return n.uniform2i;case n.BOOL_VEC3:return n.uniform3i;case n.BOOL_VEC4:return n.uniform4i;case n.FLOAT_MAT2:return b;case n.FLOAT_MAT3:return F;case n.FLOAT_MAT4:return D;case n.SAMPLER_2D:case n.SAMPLER_CUBE:return n.uniform1i}if(r(e)){const r=e;switch(t){case r.UNSIGNED_INT:return r.uniform1ui;case r.UNSIGNED_INT_VEC2:return r.uniform2ui;case r.UNSIGNED_INT_VEC3:return r.uniform3ui;case r.UNSIGNED_INT_VEC4:return r.uniform4ui;case r.FLOAT_MAT2x3:return U;case r.FLOAT_MAT2x4:return v;case r.FLOAT_MAT3x2:return P;case r.FLOAT_MAT3x4:return p;case r.FLOAT_MAT4x2:return V;case r.FLOAT_MAT4x3:return Y;case r.SAMPLER_3D:case r.SAMPLER_2D_SHADOW:case r.SAMPLER_2D_ARRAY:case r.SAMPLER_2D_ARRAY_SHADOW:case r.SAMPLER_CUBE_SHADOW:case r.INT_SAMPLER_2D:case r.INT_SAMPLER_3D:case r.INT_SAMPLER_CUBE:case r.INT_SAMPLER_2D_ARRAY:case r.UNSIGNED_INT_SAMPLER_2D:case r.UNSIGNED_INT_SAMPLER_3D:case r.UNSIGNED_INT_SAMPLER_CUBE:case r.UNSIGNED_INT_SAMPLER_2D_ARRAY:return r.uniform1i}}throw new Error("Cannot find per component uniform function for gl enum.")},getUniformArrayFunction:function(e,t){const n=e;switch(t){case n.FLOAT:return n.uniform1fv;case n.FLOAT_VEC2:return n.uniform2fv;case n.FLOAT_VEC3:return n.uniform3fv;case n.FLOAT_VEC4:return n.uniform4fv;case n.INT:return n.uniform1iv;case n.INT_VEC2:return n.uniform2iv;case n.INT_VEC3:return n.uniform3iv;case n.INT_VEC4:return n.uniform4iv;case n.BOOL:return n.uniform1iv;case n.BOOL_VEC2:return n.uniform2iv;case n.BOOL_VEC3:return n.uniform3iv;case n.BOOL_VEC4:return n.uniform4iv;case n.FLOAT_MAT2:return O;case n.FLOAT_MAT3:return B;case n.FLOAT_MAT4:return g;case n.SAMPLER_2D:case n.SAMPLER_CUBE:return n.uniform1iv}if(r(e)){const r=e;switch(t){case r.UNSIGNED_INT:return r.uniform1uiv;case r.UNSIGNED_INT_VEC2:return r.uniform2uiv;case r.UNSIGNED_INT_VEC3:return r.uniform3uiv;case r.UNSIGNED_INT_VEC4:return r.uniform4uiv;case r.FLOAT_MAT2x3:return M;case r.FLOAT_MAT2x4:return C;case r.FLOAT_MAT3x2:return y;case r.FLOAT_MAT3x4:return x;case r.FLOAT_MAT4x2:return w;case r.FLOAT_MAT4x3:return G;case r.SAMPLER_3D:case r.SAMPLER_2D_SHADOW:case r.SAMPLER_2D_ARRAY:case r.SAMPLER_2D_ARRAY_SHADOW:case r.SAMPLER_CUBE_SHADOW:case r.INT_SAMPLER_2D:case r.INT_SAMPLER_3D:case r.INT_SAMPLER_CUBE:case r.INT_SAMPLER_2D_ARRAY:case r.UNSIGNED_INT_SAMPLER_2D:case r.UNSIGNED_INT_SAMPLER_3D:case r.UNSIGNED_INT_SAMPLER_CUBE:case r.UNSIGNED_INT_SAMPLER_2D_ARRAY:return r.uniform1iv}}throw new Error("Cannot find array uniform function for gl enum.")}});function W(e,r){let t={};const n=o(e,r);for(let i of n){const n=i.name,a=i.size,u=i.type,o=e.getUniformLocation(r,n),s=m(e,u);t[n]={type:u,length:a,location:o,applier:s,set value(r){this.applier.call(e,this.location,r)}}}return t}function z(e,t,n){if("handle"in n&&n.handle instanceof WebGLVertexArrayObject){if(!r(e))throw new Error("Vertex array objects are only supported in WebGL 2.");let t=n;e.bindVertexArray(t.handle)}else{let r=n,i=t.attributes;for(let t in i){if(!(t in r.attributes))throw new Error(`Missing buffer for attribute '${t}'.`);let n=r.attributes[t],{location:a,applier:u}=i[n.name];u.call(e,a,n.buffer,n.size,n.type,n.normalize,n.stride,n.offset,n.divisor)}r.element&&e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,r.element.buffer)}}function j(e,r){let t;if(t=e.includes("texcoord")?2:e.includes("color")?4:3,r%t!=0)throw new Error(`Could not determine vertex size - guessed ${t} but array length ${r} is not evenly divisible.`);return t}function k(e,r,t,n,i,a,u,o,s){return{name:e,buffer:r,length:t,size:n,type:i,normalize:a,stride:u,offset:o,divisor:s}}function $(e,r){switch(r){case e.BYTE:return Int8Array;case e.UNSIGNED_BYTE:return Uint8Array;case e.SHORT:return Int16Array;case e.UNSIGNED_SHORT:return Uint16Array;case e.INT:return Int32Array;case e.UNSIGNED_INT:return Uint32Array;case e.FLOAT:return Float32Array;default:throw new Error(`Cannot find valid typed array for buffer type '${r}'.`)}}function K(e,r){if(r instanceof Int8Array)return e.BYTE;if(r instanceof Uint8Array)return e.UNSIGNED_BYTE;if(r instanceof Int16Array)return e.SHORT;if(r instanceof Uint16Array)return e.UNSIGNED_SHORT;if(r instanceof Int32Array)return e.INT;if(r instanceof Uint32Array)return e.UNSIGNED_INT;if(r instanceof Float32Array)return e.FLOAT;throw new Error("Cannot find valid data type for buffer source.")}const q={[u.BYTE]:1,[u.UNSIGNED_BYTE]:1,[u.SHORT]:2,[u.UNSIGNED_SHORT]:2,[u.INT]:4,[u.UNSIGNED_INT]:4,[u.FLOAT]:4,[u.HALF_FLOAT]:2};function Z(e,r){return q[r]}function X(e,r,t){return e.bindBuffer(r,t),e.getBufferParameter(r,e.BUFFER_SIZE)}var J=Object.freeze({__proto__:null,createBufferSource:function(e,r,t){return new($(e,r))(t)},createBuffer:function(e,r,t,n=e.STATIC_DRAW){if(!ArrayBuffer.isView(t))throw new Error("Source data must be a typed array.");let i=e.createBuffer();return e.bindBuffer(r,i),e.bufferData(r,t,n),i},getTypedArrayForBufferType:$,getBufferTypeForBufferSource:K,getByteCountForBufferType:Z,getBufferTypeForTypedArray:function(e,r){switch(r){case Int8Array:return e.BYTE;case Uint8Array:return e.UNSIGNED_BYTE;case Int16Array:return e.SHORT;case Uint16Array:return e.UNSIGNED_SHORT;case Int32Array:return e.INT;case Uint32Array:return e.UNSIGNED_INT;case Float32Array:return e.FLOAT;default:throw new Error("Cannot find valid buffer type for typed array.")}},getBufferUsage:function(e,r,t){return e.bindBuffer(r,t),e.getBufferParameter(r,e.BUFFER_USAGE)},getBufferByteCount:X,getBufferLength:function(e,r,t,n){return Math.trunc(X(e,r,t)/Z(0,n))},createBufferInfo:function(e,r,t){let n,i=function(e,r){let t={};for(let n of Object.keys(r)){let i=r[n];if(!i)continue;if("object"!=typeof i)throw new Error("Array attribute options must be an object.");let{name:a=n,buffer:u,size:o=3,type:s,normalize:f=!1,stride:c=0,offset:A=0,divisor:_,usage:E=e.STATIC_DRAW,length:T}=i;if(u instanceof WebGLBuffer)e.bindBuffer(e.ARRAY_BUFFER,u);else if(ArrayBuffer.isView(u)){let r=u;u=e.createBuffer(),e.bindBuffer(e.ARRAY_BUFFER,u),e.bufferData(e.ARRAY_BUFFER,r,E),void 0===s&&(s=K(e,r)),void 0===T&&(T=r.length)}else if(Array.isArray(u)){let r=u;void 0===s&&(s=e.FLOAT),void 0===T&&(T=r.length),u=e.createBuffer(),e.bindBuffer(e.ARRAY_BUFFER,u);let t=$(e,s);e.bufferData(e.ARRAY_BUFFER,new t(r),E)}else{if("number"!=typeof u)throw new Error(`Invalid buffer '${u}' for array attribute options.`);{let r=u;u=e.createBuffer(),e.bindBuffer(e.ARRAY_BUFFER,u),e.bufferData(e.ARRAY_BUFFER,r,E),void 0===T&&(T=r)}}if(void 0===s&&(s=e.FLOAT),void 0===T){let r=e.getBufferParameter(e.ARRAY_BUFFER,e.BUFFER_SIZE);T=Math.trunc(r/Z(e,s))}void 0===o&&(o=j(a,T)),t[a]=k(a,u,T,o,s,f,c,A,_)}return t}(e,r),a=function(e,r){if(!r)return null;if("object"!=typeof r)throw new Error("Element attribute options must be an object.");let{type:t=e.UNSIGNED_SHORT,buffer:n,usage:i=e.STATIC_DRAW,length:a}=r;if(n instanceof WebGLBuffer)e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,n);else if(ArrayBuffer.isView(n)){let r=n;n=e.createBuffer(),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,n),e.bufferData(e.ELEMENT_ARRAY_BUFFER,r,i),void 0===t&&(t=K(e,r)),void 0===a&&(a=r.length)}else if(Array.isArray(n)){let r=n;n=e.createBuffer(),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,n),e.bufferData(e.ELEMENT_ARRAY_BUFFER,new Uint16Array(r),i),void 0===a&&(a=r.length)}else{if("number"!=typeof n)throw new Error("Invalid buffer for element attribute options.");{let r=n;n=e.createBuffer(),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,n),e.bufferData(e.ELEMENT_ARRAY_BUFFER,r,i),void 0===a&&(a=r)}}void 0===t&&(t=e.UNSIGNED_SHORT);if(void 0===a){let r=e.getBufferParameter(e.ELEMENT_ARRAY_BUFFER,e.BUFFER_SIZE);a=Math.trunc(r/Z(e,t))}return function(e,r,t){return{buffer:e,type:r,length:t}}(n,t,a)}(e,t);if(a)n=a.length;else{let e=Object.keys(i);if(e.length>0){let r=i[e[0]];n=Math.trunc(r.length/r.size)}else n=0}return{attributes:i,element:a,vertexCount:n}},createVertexArrayInfo:function(e,t,n){if(!r(e))throw new Error("Vertex array objects is only supported on WebGL2.");const i=e;let a=i.createVertexArray();i.bindVertexArray(a);for(let e of n)z(i,e,t);return i.bindVertexArray(null),{handle:a,element:t.element,vertexCount:t.vertexCount}},drawBufferInfo:function(e,t,n=e.TRIANGLES,i=0,a=t.vertexCount,u){let o=t.element;if(o){let t=o.type;if(void 0!==u){if(!r(e))throw new Error("Instanced element drawing is only supported on WebGL2.");e.drawElementsInstanced(n,a,t,i,u)}else e.drawElements(n,a,t,i)}else if(void 0!==u){if(!r(e))throw new Error("Instanced array drawing is only supported on WebGL2.");e.drawArraysInstanced(n,i,a,u)}else e.drawArrays(n,i,a)}});class Q{constructor(e,r){this.handle=r,this.activeUniforms=W(e,r),this.activeAttributes=d(e,r),this.drawContext=new ee(e,this)}bind(e){return e.useProgram(this.handle),this.drawContext.gl=e,this.drawContext}}class ee{constructor(e,r){this.gl=e,this.parent=r}uniform(e,r){const t=this.parent.activeUniforms;if(e in t){let n=t[e],i=n.location;n.applier.call(this.gl,i,r)}return this}attribute(e,r,t,n=!1,i=0,a=0){const u=this.gl,o=this.parent.activeAttributes;if(e in o){let s=o[e],f=s.location,c=s.size;t?(u.bindBuffer(u.ARRAY_BUFFER,t),u.vertexAttribPointer(f,c,r,n,i,a),u.enableVertexAttribArray(f)):u.disableVertexAttribArray(f)}return this}draw(e,r,t,n,i=null){return S(e,r,t,n,i),this.parent}}class re{constructor(e,r){this.handle=r||e.createProgram(),this.shaders=[],this.gl=e}shader(e,r){let t=L(this.gl,e,r);return this.shaders.push(t),this}link(){return R(this.gl,this.handle,this.shaders),this.shaders.length=0,this.handle}}e.BufferBuilder=i,e.BufferDataContext=n,e.BufferEnums=u,e.BufferHelper=J,e.BufferInfo=a,e.BufferInfoBuilder=class{constructor(e,r,t){this.bufferBuilder=new i(e,r,t),this.bufferType=e.FLOAT}get gl(){return this.bufferBuilder.gl}get handle(){return this.bufferBuilder.handle}get target(){return this.bufferBuilder.target}data(e,r){return this.bufferBuilder.data(e,r),"number"!=typeof e&&(this.bufferType=K(this.gl,e)),this}subData(e,r,t,n){return this.bufferBuilder.subData(e,r,t,n),this.bufferType=K(this.gl,e),this}build(){const e=this.bufferBuilder.build(),r=this.gl,t=this.target,n=this.bufferType;return new a(r,t,n,e)}},e.GLHelper=t,e.ProgramAttributeEnums={BYTE:5120,UNSIGNED_BYTE:5121,SHORT:5122,UNSIGNED_SHORT:5123,FLOAT:5126,HALF_FLOAT:5131},e.ProgramBuilder=re,e.ProgramHelper=I,e.ProgramInfo=Q,e.ProgramInfoBuilder=class{constructor(e,r){this.programBuilder=new re(e,r)}get gl(){return this.programBuilder.gl}get handle(){return this.programBuilder.handle}get shaders(){return this.programBuilder.shaders}shader(e,r){return this.programBuilder.shader(e,r),this}link(){const e=this.programBuilder.link();return new Q(this.gl,e)}},e.ProgramInfoDrawContext=ee,e.ProgramUniformEnums={FLOAT:5126,FLOAT_VEC2:35664,FLOAT_VEC3:35665,FLOAT_VEC4:35666,INT:5124,INT_VEC2:35667,INT_VEC3:35668,INT_VEC4:35669,BOOL:35670,BOOL_VEC2:35671,BOOL_VEC3:35672,BOOL_VEC4:35673,FLOAT_MAT2:35674,FLOAT_MAT3:35675,FLOAT_MAT4:35676,SAMPLER_2D:35678,SAMPLER_CUBE:35680,UNSIGNED_INT:5125,UNSIGNED_INT_VEC2:36294,UNSIGNED_INT_VEC3:36295,UNSIGNED_INT_VEC4:36296,FLOAT_MAT2x3:35685,FLOAT_MAT2x4:35686,FLOAT_MAT3x2:35687,FLOAT_MAT3x4:35688,FLOAT_MAT4x2:35689,FLOAT_MAT4x3:35690,SAMPLER_3D:35679,SAMPLER_2D_SHADOW:35682,SAMPLER_2D_ARRAY:36289,SAMPLER_2D_ARRAY_SHADOW:36292,SAMPLER_CUBE_SHADOW:36293,INT_SAMPLER_2D:36298,INT_SAMPLER_3D:36299,INT_SAMPLER_CUBE:36300,INT_SAMPLER_2D_ARRAY:36303,UNSIGNED_INT_SAMPLER_2D:36306,UNSIGNED_INT_SAMPLER_3D:36307,UNSIGNED_INT_SAMPLER_CUBE:36308,UNSIGNED_INT_SAMPLER_2D_ARRAY:36311},e.ProgramUniformFunctions=H,Object.defineProperty(e,"__esModule",{value:!0})}));
