"use strict";class t{next(){return 0}}class s extends t{next(){return Math.random()}}class e extends t{constructor(t){super(),this.seed=t,this.a=t}next(){var t=this.a+=1831565813;return t=Math.imul(t^t>>>15,1|t),(((t^=t+Math.imul(t^t>>>7,61|t))^t>>>14)>>>0)/4294967296}}exports.MathRandom=s,exports.Mulberry32=e,exports.Random=class{static get RAND(){let t=new this;return this.next=this.next.bind(this),this.choose=this.choose.bind(this),this.range=this.range.bind(this),this.rangeInt=this.rangeInt.bind(this),this.sign=this.sign.bind(this),Object.defineProperty(this,"RAND",{value:t}),t}constructor(t){this.generator="number"==typeof t?new e(t):t||new s,this.next=this.next.bind(this),this.choose=this.choose.bind(this),this.range=this.range.bind(this),this.rangeInt=this.rangeInt.bind(this),this.sign=this.sign.bind(this)}static next(){return this.RAND.next()}next(){return this.generator.next()}static choose(t){return this.RAND.choose(t)}choose(t){return t[Math.floor(this.generator.next()*t.length)]}static range(t,s){return this.RAND.range(t,s)}range(t,s){return(s-t)*this.generator.next()+t}static rangeInt(t,s){return this.RAND.rangeInt(t,s)}rangeInt(t,s){return Math.trunc(this.range(t,s))}static sign(){return this.RAND.sign()}sign(){return this.generator.next()<.5?-1:1}},exports.RandomBase=t,exports.SmallFastCounter32=class extends t{constructor(t,s,e,n){super(),this.a=t,this.b=s,this.c=e,this.d=n}next(){let{a:t,b:s,c:e,d:n}=this;t|=0,s|=0,e|=0,n|=0;let i=(t+s|0)+n|0;return n=n+1|0,t=s^s>>>9,s=e+(e<<3)|0,e=e<<21|e>>>11,e=e+i|0,this.a=t,this.b=s,this.c=e,this.d=n,(i>>>0)/4294967296}};
//# sourceMappingURL=milque-random.cjs.js.map