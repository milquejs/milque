"use strict";function r(r){return"undefined"!=typeof WebGL2RenderingContext&&r instanceof WebGL2RenderingContext}var e=Object.freeze({__proto__:null,isWebGL2Supported:r});class t{constructor(r,e){this.gl=r,this.target=e}data(r,e){const t=this.gl,n=this.target;if("number"==typeof r)t.bufferData(n,r,e||t.STATIC_DRAW);else{if(!ArrayBuffer.isView(r))throw new Error("Source data must be a typed array.");t.bufferData(n,r,e||t.STATIC_DRAW)}return this}subData(e,t=0,n,i){const a=this.gl,u=this.target;if(!ArrayBuffer.isView(e))throw new Error("Source data must be a typed array.");if(void 0!==n)if(r(a))a.bufferSubData(u,t,e,n,i);else{const r=i?e.subarray(n,n+i):e.subarray(n);a.bufferSubData(u,t,r)}else a.bufferSubData(u,t,e);return this}}class n{constructor(r,e,n){this.dataContext=new t(r,e),this.handle=n||r.createBuffer(),r.bindBuffer(e,this.handle)}get gl(){return this.dataContext.gl}get target(){return this.dataContext.target}data(r,e){return this.dataContext.data(r,e),this}subData(r,e=0,t,n){return this.dataContext.subData(r,e,t,n),this}build(){return this.handle}}class i{constructor(r,e,n,i){this.gl=r,this.target=e,this.handle=i,this.type=n,this.bindContext=new t(r,this.target)}bind(r){return r.bindBuffer(this.target,this.handle),this.bindContext.gl=r,this.bindContext}}const a={BYTE:5120,UNSIGNED_BYTE:5121,SHORT:5122,UNSIGNED_SHORT:5123,INT:5124,UNSIGNED_INT:5125,FLOAT:5126,HALF_FLOAT:5131};function u(r,e){let t=[];const n=r.getProgramParameter(e,r.ACTIVE_UNIFORMS);for(let i=0;i<n;++i){let n=r.getActiveUniform(e,i);if(!n)break;t.push(n)}return t}function s(r,e){let t=[];const n=r.getProgramParameter(e,r.ACTIVE_ATTRIBUTES);for(let i=0;i<n;++i){let n=r.getActiveAttrib(e,i);n&&t.push(n)}return t}function o(r,e){switch(e){case r.FLOAT:case r.INT:case r.UNSIGNED_INT:case r.BOOL:return 1;case r.FLOAT_VEC2:case r.INT_VEC2:case r.BOOL_VEC2:return 2;case r.FLOAT_VEC3:case r.INT_VEC3:case r.BOOL_VEC3:return 3;case r.FLOAT_VEC4:case r.INT_VEC4:case r.BOOL_VEC4:case r.FLOAT_MAT2:return 4;case r.FLOAT_MAT3:return 9;case r.FLOAT_MAT4:return 16;default:throw new Error("Invalid vertex attribute type.")}}function f(e,t){switch(t){case e.FLOAT:case e.FLOAT_VEC2:case e.FLOAT_VEC3:case e.FLOAT_VEC4:return c}if(r(e)){const r=e;switch(t){case e.INT:case e.INT_VEC2:case e.INT_VEC3:case e.INT_VEC4:case e.BOOL:case e.BOOL_VEC2:case e.BOOL_VEC3:case e.BOOL_VEC4:return A;case e.FLOAT_MAT2:return E;case e.FLOAT_MAT3:return T;case e.FLOAT_MAT4:return l;case r.UNSIGNED_INT:case r.UNSIGNED_INT_VEC2:case r.UNSIGNED_INT_VEC3:case r.UNSIGNED_INT_VEC4:return _}}throw new Error("Cannot find attribute function for gl enum.")}function c(e,t,n,i,a=!1,u=0,s=0,o){if(this.bindBuffer(this.ARRAY_BUFFER,t),this.enableVertexAttribArray(e),this.vertexAttribPointer(e,n,i,a,u,s),void 0!==o){if(!r(this))throw new Error("Cannot use attribute divisor in WebGL 1.");this.vertexAttribDivisor(e,o)}}function A(e,t,n,i,a=!1,u=0,s=0,o){if(!r(this))throw new Error("Cannot use attribute divisor in WebGL 1.");const f=this;f.bindBuffer(f.ARRAY_BUFFER,t),f.enableVertexAttribArray(e),f.vertexAttribIPointer(e,n,i,u,s),void 0!==o&&f.vertexAttribDivisor(e,o)}function _(e,t,n,i,a=!1,u=0,s=0,o){if(!r(this))throw new Error("Cannot use attribute divisor in WebGL 1.");const f=this;f.bindBuffer(f.ARRAY_BUFFER,t),f.enableVertexAttribArray(e),f.vertexAttribIPointer(e,n,i,u,s),void 0!==o&&f.vertexAttribDivisor(e,o)}function E(r,e,t,n,i=!1,a=0,u=0,s){let f=o(this,this.FLOAT_MAT2);h(f*f,f,r,e,t,n,i,a,u,s)}function T(r,e,t,n,i=!1,a=0,u=0,s){let f=o(this,this.FLOAT_MAT3);h(f*f,f,r,e,t,n,i,a,u,s)}function l(r,e,t,n,i=!1,a=0,u=0,s){let f=o(this,this.FLOAT_MAT4);h(f*f,f,r,e,t,n,i,a,u,s)}function h(e,t,n,i,a,u,s,o,f,c){if(!r(this))throw new Error("Cannot use attribute divisor in WebGL 1.");const A=this;A.bindBuffer(A.ARRAY_BUFFER,i);let _=a/t,E=e*a,T=o/t;for(let r=0;r<t;++r){let e=n+r;A.enableVertexAttribArray(e),A.vertexAttribPointer(e,_,u,s,E,f+T*r),void 0!==c&&A.vertexAttribDivisor(e,c)}}function N(r,e){let t={};const n=s(r,e);for(let i of n){const n=i.name,a=i.size,u=i.type,s=r.getAttribLocation(e,n),c=f(r,u),A=o(r,u);t[n]={type:u,length:a,location:s,size:A,applier:c,set value([r,e,t,n,i,a,u]){this.applier(this.location,r,e,t,n,i,a,u)}}}return t}function L(r,e,t){let n=r.createShader(e);if(r.shaderSource(n,t),r.compileShader(n),!r.getShaderParameter(n,r.COMPILE_STATUS)){let e=r.getShaderInfoLog(n)+`\nFailed to compile shader:\n${t}`;throw r.deleteShader(n),new Error(e)}return n}async function d(r,e,t){for(let n of t)r.attachShader(e,n);r.linkProgram(e);const n=r.getExtension("KHR_parallel_shader_compile");if(n){const t=1e3/60;let i;do{await new Promise(((r,e)=>setTimeout(r,t))),i=r.getProgramParameter(e,n.COMPLETION_STATUS_KHR)}while(!i)}for(let n of t)r.detachShader(e,n),r.deleteShader(n);if(!r.getProgramParameter(e,r.LINK_STATUS)){let t=r.getProgramInfoLog(e);throw r.deleteProgram(e),new Error(t)}return e}function R(r,e,t,n,i){i?(r.bindBuffer(r.ELEMENT_ARRAY_BUFFER,i),r.drawElements(e,n,r.UNSIGNED_SHORT,t)):r.drawArrays(e,t,n)}var S=Object.freeze({__proto__:null,bindProgramAttributes:W,bindProgramUniforms:function(r,e,t){let n=e.uniforms;for(let e in t){let i=t[e],{location:a,applier:u}=n[e];u.call(r,a,i)}},createProgramInfo:function(r,e){return{handle:e,attributes:N(r,e),uniforms:H(r,e)}},createShader:L,createShaderProgram:d,draw:R,getActiveAttribs:s,getActiveUniforms:u,getProgramStatus:function(r,e){return{linkStatus:r.getProgramParameter(e,r.LINK_STATUS),deleteStatus:r.getProgramParameter(e,r.DELETE_STATUS),validateStatus:r.getProgramParameter(e,r.VALIDATE_STATUS),infoLog:r.getProgramInfoLog(e)}},linkProgramShaders:async function(r,e,t,n=[r.VERTEX_SHADER,r.FRAGMENT_SHADER]){let i=0,a=[];for(let e of t){if(i>=n.length)throw new Error("Missing shader type for shader source.");let t=L(r,n[i++],e);a.push(t)}return await d(r,e,a),e}});function I(e,t){const n=e;switch(t){case n.FLOAT:return n.uniform1f;case n.FLOAT_VEC2:return n.uniform2fv;case n.FLOAT_VEC3:return n.uniform3fv;case n.FLOAT_VEC4:return n.uniform4fv;case n.INT:return n.uniform1i;case n.INT_VEC2:return n.uniform2iv;case n.INT_VEC3:return n.uniform3iv;case n.INT_VEC4:return n.uniform4iv;case n.BOOL:return n.uniform1i;case n.BOOL_VEC2:return n.uniform2iv;case n.BOOL_VEC3:return n.uniform3iv;case n.BOOL_VEC4:return n.uniform4iv;case n.FLOAT_MAT2:return m;case n.FLOAT_MAT3:return b;case n.FLOAT_MAT4:return F;case n.SAMPLER_2D:case n.SAMPLER_CUBE:return n.uniform1i}if(r(e)){const r=e;switch(t){case r.UNSIGNED_INT:return r.uniform1ui;case r.UNSIGNED_INT_VEC2:return r.uniform2uiv;case r.UNSIGNED_INT_VEC3:return r.uniform3uiv;case r.UNSIGNED_INT_VEC4:return r.uniform4uiv;case r.FLOAT_MAT2x3:return M;case r.FLOAT_MAT2x4:return U;case r.FLOAT_MAT3x2:return v;case r.FLOAT_MAT3x4:return y;case r.FLOAT_MAT4x2:return P;case r.FLOAT_MAT4x3:return V;case r.SAMPLER_3D:case r.SAMPLER_2D_SHADOW:case r.SAMPLER_2D_ARRAY:case r.SAMPLER_2D_ARRAY_SHADOW:case r.SAMPLER_CUBE_SHADOW:case r.INT_SAMPLER_2D:case r.INT_SAMPLER_3D:case r.INT_SAMPLER_CUBE:case r.INT_SAMPLER_2D_ARRAY:case r.UNSIGNED_INT_SAMPLER_2D:case r.UNSIGNED_INT_SAMPLER_3D:case r.UNSIGNED_INT_SAMPLER_CUBE:case r.UNSIGNED_INT_SAMPLER_2D_ARRAY:return r.uniform1i}}throw new Error("Cannot find uniform function for gl enum.")}function m(r,e){this.uniformMatrix2fv(r,!1,e)}function O(r,e,t,n,i){this.uniformMatrix2fv(r,!1,[e,t,n,i])}function b(r,e){this.uniformMatrix3fv(r,!1,e)}function B(r,e,t,n,i,a,u,s,o,f){this.uniformMatrix3fv(r,!1,[e,t,n,i,a,u,s,o,f])}function F(r,e){this.uniformMatrix4fv(r,!1,e)}function D(r,e,t,n,i,a,u,s,o,f,c,A,_,E,T,l,h){this.uniformMatrix4fv(r,!1,[e,t,n,i,a,u,s,o,f,c,A,_,E,T,l,h])}function M(r,e){this.uniformMatrix2x3fv(r,!1,e)}function g(r,e,t,n,i,a,u){this.uniformMatrix2x3fv(r,!1,[e,t,n,i,a,u])}function U(r,e){this.uniformMatrix2x4fv(r,!1,e)}function C(r,e,t,n,i,a,u,s,o){this.uniformMatrix2x4fv(r,!1,[e,t,n,i,a,u,s,o])}function v(r,e){this.uniformMatrix3x2fv(r,!1,e)}function x(r,e,t,n,i,a,u){this.uniformMatrix3x2fv(r,!1,[e,t,n,i,a,u])}function y(r,e){this.uniformMatrix3x4fv(r,!1,e)}function p(r,e,t,n,i,a,u,s,o,f,c,A,_){this.uniformMatrix3x4fv(r,!1,[e,t,n,i,a,u,s,o,f,c,A,_])}function P(r,e){this.uniformMatrix4x2fv(r,!1,e)}function w(r,e,t,n,i,a,u,s,o){this.uniformMatrix4x2fv(r,!1,[e,t,n,i,a,u,s,o])}function V(r,e){this.uniformMatrix4x3fv(r,!1,e)}function G(r,e,t,n,i,a,u,s,o,f,c,A,_){this.uniformMatrix4x3fv(r,!1,[e,t,n,i,a,u,s,o,f,c,A,_])}var Y=Object.freeze({__proto__:null,getUniformArrayFunction:function(e,t){const n=e;switch(t){case n.FLOAT:return n.uniform1fv;case n.FLOAT_VEC2:return n.uniform2fv;case n.FLOAT_VEC3:return n.uniform3fv;case n.FLOAT_VEC4:return n.uniform4fv;case n.INT:return n.uniform1iv;case n.INT_VEC2:return n.uniform2iv;case n.INT_VEC3:return n.uniform3iv;case n.INT_VEC4:return n.uniform4iv;case n.BOOL:return n.uniform1iv;case n.BOOL_VEC2:return n.uniform2iv;case n.BOOL_VEC3:return n.uniform3iv;case n.BOOL_VEC4:return n.uniform4iv;case n.FLOAT_MAT2:return m;case n.FLOAT_MAT3:return b;case n.FLOAT_MAT4:return F;case n.SAMPLER_2D:case n.SAMPLER_CUBE:return n.uniform1iv}if(r(e)){const r=e;switch(t){case r.UNSIGNED_INT:return r.uniform1uiv;case r.UNSIGNED_INT_VEC2:return r.uniform2uiv;case r.UNSIGNED_INT_VEC3:return r.uniform3uiv;case r.UNSIGNED_INT_VEC4:return r.uniform4uiv;case r.FLOAT_MAT2x3:return M;case r.FLOAT_MAT2x4:return U;case r.FLOAT_MAT3x2:return v;case r.FLOAT_MAT3x4:return y;case r.FLOAT_MAT4x2:return P;case r.FLOAT_MAT4x3:return V;case r.SAMPLER_3D:case r.SAMPLER_2D_SHADOW:case r.SAMPLER_2D_ARRAY:case r.SAMPLER_2D_ARRAY_SHADOW:case r.SAMPLER_CUBE_SHADOW:case r.INT_SAMPLER_2D:case r.INT_SAMPLER_3D:case r.INT_SAMPLER_CUBE:case r.INT_SAMPLER_2D_ARRAY:case r.UNSIGNED_INT_SAMPLER_2D:case r.UNSIGNED_INT_SAMPLER_3D:case r.UNSIGNED_INT_SAMPLER_CUBE:case r.UNSIGNED_INT_SAMPLER_2D_ARRAY:return r.uniform1iv}}throw new Error("Cannot find array uniform function for gl enum.")},getUniformComponentFunction:function(e,t){const n=e;switch(t){case n.FLOAT:return n.uniform1f;case n.FLOAT_VEC2:return n.uniform2f;case n.FLOAT_VEC3:return n.uniform3f;case n.FLOAT_VEC4:return n.uniform4f;case n.INT:return n.uniform1i;case n.INT_VEC2:return n.uniform2i;case n.INT_VEC3:return n.uniform3i;case n.INT_VEC4:return n.uniform4i;case n.BOOL:return n.uniform1i;case n.BOOL_VEC2:return n.uniform2i;case n.BOOL_VEC3:return n.uniform3i;case n.BOOL_VEC4:return n.uniform4i;case n.FLOAT_MAT2:return O;case n.FLOAT_MAT3:return B;case n.FLOAT_MAT4:return D;case n.SAMPLER_2D:case n.SAMPLER_CUBE:return n.uniform1i}if(r(e)){const r=e;switch(t){case r.UNSIGNED_INT:return r.uniform1ui;case r.UNSIGNED_INT_VEC2:return r.uniform2ui;case r.UNSIGNED_INT_VEC3:return r.uniform3ui;case r.UNSIGNED_INT_VEC4:return r.uniform4ui;case r.FLOAT_MAT2x3:return g;case r.FLOAT_MAT2x4:return C;case r.FLOAT_MAT3x2:return x;case r.FLOAT_MAT3x4:return p;case r.FLOAT_MAT4x2:return w;case r.FLOAT_MAT4x3:return G;case r.SAMPLER_3D:case r.SAMPLER_2D_SHADOW:case r.SAMPLER_2D_ARRAY:case r.SAMPLER_2D_ARRAY_SHADOW:case r.SAMPLER_CUBE_SHADOW:case r.INT_SAMPLER_2D:case r.INT_SAMPLER_3D:case r.INT_SAMPLER_CUBE:case r.INT_SAMPLER_2D_ARRAY:case r.UNSIGNED_INT_SAMPLER_2D:case r.UNSIGNED_INT_SAMPLER_3D:case r.UNSIGNED_INT_SAMPLER_CUBE:case r.UNSIGNED_INT_SAMPLER_2D_ARRAY:return r.uniform1i}}throw new Error("Cannot find per component uniform function for gl enum.")},getUniformFunction:I});function H(r,e){let t={};const n=u(r,e);for(let i of n){const n=i.name,a=i.size,u=i.type,s=r.getUniformLocation(e,n),o=I(r,u);t[n]={type:u,length:a,location:s,applier:o,set value(e){this.applier.call(r,this.location,e)}}}return t}function W(e,t,n){if("handle"in n&&n.handle instanceof WebGLVertexArrayObject){if(!r(e))throw new Error("Vertex array objects are only supported in WebGL 2.");let t=n;e.bindVertexArray(t.handle)}else{let r=n,i=t.attributes;for(let t in i){if(!(t in r.attributes))throw new Error(`Missing buffer for attribute '${t}'.`);let n=r.attributes[t],{location:a,applier:u}=i[n.name];u.call(e,a,n.buffer,n.size,n.type,n.normalize,n.stride,n.offset,n.divisor)}r.element&&e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,r.element.buffer)}}function z(r,e){let t;if(t=r.includes("texcoord")?2:r.includes("color")?4:3,e%t!=0)throw new Error(`Could not determine vertex size - guessed ${t} but array length ${e} is not evenly divisible.`);return t}function j(r,e,t,n,i,a,u,s,o){return{name:r,buffer:e,length:t,size:n,type:i,normalize:a,stride:u,offset:s,divisor:o}}function k(r,e){switch(e){case r.BYTE:return Int8Array;case r.UNSIGNED_BYTE:return Uint8Array;case r.SHORT:return Int16Array;case r.UNSIGNED_SHORT:return Uint16Array;case r.INT:return Int32Array;case r.UNSIGNED_INT:return Uint32Array;case r.FLOAT:return Float32Array;default:throw new Error(`Cannot find valid typed array for buffer type '${e}'.`)}}function $(r,e){if(e instanceof Int8Array)return r.BYTE;if(e instanceof Uint8Array)return r.UNSIGNED_BYTE;if(e instanceof Int16Array)return r.SHORT;if(e instanceof Uint16Array)return r.UNSIGNED_SHORT;if(e instanceof Int32Array)return r.INT;if(e instanceof Uint32Array)return r.UNSIGNED_INT;if(e instanceof Float32Array)return r.FLOAT;throw new Error("Cannot find valid data type for buffer source.")}const K={[a.BYTE]:1,[a.UNSIGNED_BYTE]:1,[a.SHORT]:2,[a.UNSIGNED_SHORT]:2,[a.INT]:4,[a.UNSIGNED_INT]:4,[a.FLOAT]:4,[a.HALF_FLOAT]:2};function Z(r,e){return K[e]}function X(r,e,t){return r.bindBuffer(e,t),r.getBufferParameter(e,r.BUFFER_SIZE)}var q=Object.freeze({__proto__:null,createBuffer:function(r,e,t,n=r.STATIC_DRAW){if(!ArrayBuffer.isView(t))throw new Error("Source data must be a typed array.");let i=r.createBuffer();return r.bindBuffer(e,i),r.bufferData(e,t,n),i},createBufferInfo:function(r,e,t){let n,i=function(r,e){let t={};for(let n of Object.keys(e)){let i=e[n];if(!i)continue;if("object"!=typeof i)throw new Error("Array attribute options must be an object.");let{name:a=n,buffer:u,size:s=3,type:o,normalize:f=!1,stride:c=0,offset:A=0,divisor:_,usage:E=r.STATIC_DRAW,length:T}=i;if(u instanceof WebGLBuffer)r.bindBuffer(r.ARRAY_BUFFER,u);else if(ArrayBuffer.isView(u)){let e=u;u=r.createBuffer(),r.bindBuffer(r.ARRAY_BUFFER,u),r.bufferData(r.ARRAY_BUFFER,e,E),void 0===o&&(o=$(r,e)),void 0===T&&(T=e.length)}else if(Array.isArray(u)){let e=u;void 0===o&&(o=r.FLOAT),void 0===T&&(T=e.length),u=r.createBuffer(),r.bindBuffer(r.ARRAY_BUFFER,u);let t=k(r,o);r.bufferData(r.ARRAY_BUFFER,new t(e),E)}else{if("number"!=typeof u)throw new Error(`Invalid buffer '${u}' for array attribute options.`);{let e=u;u=r.createBuffer(),r.bindBuffer(r.ARRAY_BUFFER,u),r.bufferData(r.ARRAY_BUFFER,e,E),void 0===T&&(T=e)}}if(void 0===o&&(o=r.FLOAT),void 0===T){let e=r.getBufferParameter(r.ARRAY_BUFFER,r.BUFFER_SIZE);T=Math.trunc(e/Z(r,o))}void 0===s&&(s=z(a,T)),t[a]=j(a,u,T,s,o,f,c,A,_)}return t}(r,e),a=function(r,e){if(!e)return null;if("object"!=typeof e)throw new Error("Element attribute options must be an object.");let{type:t=r.UNSIGNED_SHORT,buffer:n,usage:i=r.STATIC_DRAW,length:a}=e;if(n instanceof WebGLBuffer)r.bindBuffer(r.ELEMENT_ARRAY_BUFFER,n);else if(ArrayBuffer.isView(n)){let e=n;n=r.createBuffer(),r.bindBuffer(r.ELEMENT_ARRAY_BUFFER,n),r.bufferData(r.ELEMENT_ARRAY_BUFFER,e,i),void 0===t&&(t=$(r,e)),void 0===a&&(a=e.length)}else if(Array.isArray(n)){let e=n;n=r.createBuffer(),r.bindBuffer(r.ELEMENT_ARRAY_BUFFER,n),r.bufferData(r.ELEMENT_ARRAY_BUFFER,new Uint16Array(e),i),void 0===a&&(a=e.length)}else{if("number"!=typeof n)throw new Error("Invalid buffer for element attribute options.");{let e=n;n=r.createBuffer(),r.bindBuffer(r.ELEMENT_ARRAY_BUFFER,n),r.bufferData(r.ELEMENT_ARRAY_BUFFER,e,i),void 0===a&&(a=e)}}void 0===t&&(t=r.UNSIGNED_SHORT);if(void 0===a){let e=r.getBufferParameter(r.ELEMENT_ARRAY_BUFFER,r.BUFFER_SIZE);a=Math.trunc(e/Z(r,t))}return function(r,e,t){return{buffer:r,type:e,length:t}}(n,t,a)}(r,t);if(a)n=a.length;else{let r=Object.keys(i);if(r.length>0){let e=i[r[0]];n=Math.trunc(e.length/e.size)}else n=0}return{attributes:i,element:a,vertexCount:n}},createBufferSource:function(r,e,t){return new(k(r,e))(t)},createVertexArrayInfo:function(e,t,n){if(!r(e))throw new Error("Vertex array objects is only supported on WebGL2.");const i=e;let a=i.createVertexArray();i.bindVertexArray(a);for(let r of n)W(i,r,t);return i.bindVertexArray(null),{handle:a,element:t.element,vertexCount:t.vertexCount}},drawBufferInfo:function(e,t,n=e.TRIANGLES,i=0,a=t.vertexCount,u){let s=t.element;if(s){let t=s.type;if(void 0!==u){if(!r(e))throw new Error("Instanced element drawing is only supported on WebGL2.");e.drawElementsInstanced(n,a,t,i,u)}else e.drawElements(n,a,t,i)}else if(void 0!==u){if(!r(e))throw new Error("Instanced array drawing is only supported on WebGL2.");e.drawArraysInstanced(n,i,a,u)}else e.drawArrays(n,i,a)},getBufferByteCount:X,getBufferLength:function(r,e,t,n){return Math.trunc(X(r,e,t)/Z(0,n))},getBufferTypeForBufferSource:$,getBufferTypeForTypedArray:function(r,e){switch(e){case Int8Array:return r.BYTE;case Uint8Array:return r.UNSIGNED_BYTE;case Int16Array:return r.SHORT;case Uint16Array:return r.UNSIGNED_SHORT;case Int32Array:return r.INT;case Uint32Array:return r.UNSIGNED_INT;case Float32Array:return r.FLOAT;default:throw new Error("Cannot find valid buffer type for typed array.")}},getBufferUsage:function(r,e,t){return r.bindBuffer(e,t),r.getBufferParameter(e,r.BUFFER_USAGE)},getByteCountForBufferType:Z,getTypedArrayForBufferType:k});class J{constructor(r,e){this.handle=e,this.activeUniforms=H(r,e),this.activeAttributes=N(r,e),this.drawContext=new Q(r,this)}bind(r){return r.useProgram(this.handle),this.drawContext.gl=r,this.drawContext}}class Q{constructor(r,e){this.gl=r,this.parent=e}uniform(r,e){const t=this.parent.activeUniforms;if(r in t){let n=t[r],i=n.location;n.applier.call(this.gl,i,e)}return this}attribute(r,e,t,n=!1,i=0,a=0){const u=this.gl,s=this.parent.activeAttributes;if(r in s){let o=s[r],f=o.location,c=o.size;t?(u.bindBuffer(u.ARRAY_BUFFER,t),u.vertexAttribPointer(f,c,e,n,i,a),u.enableVertexAttribArray(f)):u.disableVertexAttribArray(f)}return this}draw(r,e,t,n,i=null){return R(r,e,t,n,i),this.parent}}class rr{constructor(r,e){this.handle=e||r.createProgram(),this.shaders=[],this.gl=r}shader(r,e){let t=L(this.gl,r,e);return this.shaders.push(t),this}link(){return d(this.gl,this.handle,this.shaders),this.shaders.length=0,this.handle}}exports.BufferBuilder=n,exports.BufferDataContext=t,exports.BufferEnums=a,exports.BufferHelper=q,exports.BufferInfo=i,exports.BufferInfoBuilder=class{constructor(r,e,t){this.bufferBuilder=new n(r,e,t),this.bufferType=r.FLOAT}get gl(){return this.bufferBuilder.gl}get handle(){return this.bufferBuilder.handle}get target(){return this.bufferBuilder.target}data(r,e){return this.bufferBuilder.data(r,e),"number"!=typeof r&&(this.bufferType=$(this.gl,r)),this}subData(r,e,t,n){return this.bufferBuilder.subData(r,e,t,n),this.bufferType=$(this.gl,r),this}build(){const r=this.bufferBuilder.build(),e=this.gl,t=this.target,n=this.bufferType;return new i(e,t,n,r)}},exports.GLHelper=e,exports.ProgramAttributeEnums={BYTE:5120,UNSIGNED_BYTE:5121,SHORT:5122,UNSIGNED_SHORT:5123,FLOAT:5126,HALF_FLOAT:5131},exports.ProgramBuilder=rr,exports.ProgramHelper=S,exports.ProgramInfo=J,exports.ProgramInfoBuilder=class{constructor(r,e){this.programBuilder=new rr(r,e)}get gl(){return this.programBuilder.gl}get handle(){return this.programBuilder.handle}get shaders(){return this.programBuilder.shaders}shader(r,e){return this.programBuilder.shader(r,e),this}link(){const r=this.programBuilder.link();return new J(this.gl,r)}},exports.ProgramInfoDrawContext=Q,exports.ProgramUniformEnums={FLOAT:5126,FLOAT_VEC2:35664,FLOAT_VEC3:35665,FLOAT_VEC4:35666,INT:5124,INT_VEC2:35667,INT_VEC3:35668,INT_VEC4:35669,BOOL:35670,BOOL_VEC2:35671,BOOL_VEC3:35672,BOOL_VEC4:35673,FLOAT_MAT2:35674,FLOAT_MAT3:35675,FLOAT_MAT4:35676,SAMPLER_2D:35678,SAMPLER_CUBE:35680,UNSIGNED_INT:5125,UNSIGNED_INT_VEC2:36294,UNSIGNED_INT_VEC3:36295,UNSIGNED_INT_VEC4:36296,FLOAT_MAT2x3:35685,FLOAT_MAT2x4:35686,FLOAT_MAT3x2:35687,FLOAT_MAT3x4:35688,FLOAT_MAT4x2:35689,FLOAT_MAT4x3:35690,SAMPLER_3D:35679,SAMPLER_2D_SHADOW:35682,SAMPLER_2D_ARRAY:36289,SAMPLER_2D_ARRAY_SHADOW:36292,SAMPLER_CUBE_SHADOW:36293,INT_SAMPLER_2D:36298,INT_SAMPLER_3D:36299,INT_SAMPLER_CUBE:36300,INT_SAMPLER_2D_ARRAY:36303,UNSIGNED_INT_SAMPLER_2D:36306,UNSIGNED_INT_SAMPLER_3D:36307,UNSIGNED_INT_SAMPLER_CUBE:36308,UNSIGNED_INT_SAMPLER_2D_ARRAY:36311},exports.ProgramUniformFunctions=Y;
//# sourceMappingURL=milque-mogli.cjs.js.map
