!function(){"use strict";const t="noscale",e=Symbol("template"),s=Symbol("style");class i extends HTMLElement{static get[e](){let t=document.createElement("template");return t.innerHTML='<div class="container">\r\n    <label class="hidden" id="title">display-port</label>\r\n    <label class="hidden" id="fps">00</label>\r\n    <label class="hidden" id="dimension">0x0</label>\r\n    <canvas></canvas>\r\n    <slot></slot>\r\n</div>',Object.defineProperty(this,e,{value:t}),t}static get[s](){let t=document.createElement("style");return t.innerHTML=":host{display:inline-block;color:#555}.container{display:flex;position:relative;width:100%;height:100%}canvas{background:#000;margin:auto;-ms-interpolation-mode:nearest-neighbor;image-rendering:-moz-crisp-edges;image-rendering:pixelated}label{font-family:monospace;color:currentColor;position:absolute}#title{left:.5rem;top:.5rem}#fps{right:.5rem;top:.5rem}#dimension{left:.5rem;bottom:.5rem}.hidden{display:none}:host([debug]) .container{outline:6px dashed rgba(0,0,0,.1);outline-offset:-4px;background-color:rgba(0,0,0,.1)}:host([mode=noscale]) canvas{margin:0;top:0;left:0}:host([mode=center]),:host([mode=fit]),:host([mode=stretch]){width:100%;height:100%}:host([full]){width:100vw!important;height:100vh!important}:host([disabled]){display:none}slot{display:flex;flex-direction:column;align-items:center;justify-content:center;position:absolute;width:100%;height:100%;top:0;left:0;pointer-events:none}::slotted(*){pointer-events:auto}",Object.defineProperty(this,s,{value:t}),t}static get observedAttributes(){return["width","height","disabled","onframe","debug","id","class"]}constructor(){super(),this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(this.constructor[e].content.cloneNode(!0)),this.shadowRoot.appendChild(this.constructor[s].cloneNode(!0)),this._canvasElement=this.shadowRoot.querySelector("canvas"),this._titleElement=this.shadowRoot.querySelector("#title"),this._fpsElement=this.shadowRoot.querySelector("#fps"),this._dimensionElement=this.shadowRoot.querySelector("#dimension"),this._animationRequestHandle=0,this._prevAnimationFrameTime=0,this._width=300,this._height=150,this._onframe=null,this.update=this.update.bind(this)}get canvas(){return this._canvasElement}connectedCallback(){this.hasAttribute("mode")||(this.mode="noscale"),this.hasAttribute("tabindex")||this.setAttribute("tabindex",0),this.updateCanvasSize(),this.resume()}disconnectedCallback(){this.pause()}attributeChangedCallback(t,e,s){switch(t){case"width":this._width=s;break;case"height":this._height=s;break;case"disabled":s?(this.update(0),this.pause()):this.resume();break;case"onframe":this.onframe=new Function("event",`with(document){with(this){${s}}}`).bind(this);break;case"id":case"class":this._titleElement.innerHTML=`display-port${this.className?"."+this.className:""}${this.hasAttribute("id")?"#"+this.getAttribute("id"):""}`;break;case"debug":this._titleElement.classList.toggle("hidden",s),this._fpsElement.classList.toggle("hidden",s),this._dimensionElement.classList.toggle("hidden",s)}}update(e){this._animationRequestHandle=requestAnimationFrame(this.update),this.updateCanvasSize();const s=e-this._prevAnimationFrameTime;if(this._prevAnimationFrameTime=e,this.debug){const e=s<=0?"--":String(Math.round(1e3/s)).padStart(2,"0");if(this._fpsElement.innerText!==e&&(this._fpsElement.innerText=e),this.mode===t){let t=`${this._width}x${this._height}`;this._dimensionElement.innerText!==t&&(this._dimensionElement.innerText=t)}else{let t=`${this._width}x${this._height}|${this.shadowRoot.host.clientWidth}x${this.shadowRoot.host.clientHeight}`;this._dimensionElement.innerText!==t&&(this._dimensionElement.innerText=t)}}this.dispatchEvent(new CustomEvent("frame",{detail:{now:e,prevTime:this._prevAnimationFrameTime,deltaTime:s,canvas:this._canvasElement,get context(){let t=this.canvas.getContext("2d");return t.imageSmoothingEnabled=!1,t}},bubbles:!1,composed:!0}))}pause(){cancelAnimationFrame(this._animationRequestHandle)}resume(){this._animationRequestHandle=requestAnimationFrame(this.update)}updateCanvasSize(){let e=this.shadowRoot.host.getBoundingClientRect();const s=e.width,i=e.height;let a=this._canvasElement,h=this._width,r=this._height;const n=this.mode;if("stretch"===n)h=s,r=i;else if(n!==t){if(s<h||i<r||"fit"===n){let t=s/h,e=i/r;t<e?(h=s,r*=t):(h*=e,r=i)}}h=Math.floor(h),r=Math.floor(r),a.clientWidth===h&&a.clientHeight===r||(a.width=this._width,a.height=this._height,a.style=`width: ${h}px; height: ${r}px`,this.dispatchEvent(new CustomEvent("resize",{detail:{width:h,height:r},bubbles:!1,composed:!0})))}get onframe(){return this._onframe}set onframe(t){this._onframe&&this.removeEventListener("frame",this._onframe),this._onframe=t,this._onframe&&this.addEventListener("frame",t)}get width(){return this._width}set width(t){this.setAttribute("width",t)}get height(){return this._height}set height(t){this.setAttribute("height",t)}get mode(){return this.getAttribute("mode")}set mode(t){this.setAttribute("mode",t)}get disabled(){return this.hasAttribute("disabled")}set disabled(t){t?this.setAttribute("disabled",""):this.removeAttribute("disabled")}get debug(){return this.hasAttribute("debug")}set debug(t){t?this.setAttribute("debug",""):this.removeAttribute("debug")}}window.customElements.define("display-port",i);class a{next(){return Math.random()}}let h;class r{constructor(t=new a){this.generator=t}static next(){return h.next()}next(){return this.generator.next()}static choose(t){return h.choose(t)}choose(t){return t[Math.floor(this.generator.next()*t.length)]}static range(t,e){return h.range(t,e)}range(t,e){return(e-t)*this.generator.next()+t}static sign(){return h.sign()}sign(){return this.generator.next()<.5?-1:1}}h=new r;const n=[2,4],o=[.3,1];function l(t,e,s="white"){for(let i=0;i<e.length;++i){let a=e.x[i],h=e.y[i],r=e.size[i],n=r/2;t.fillStyle=s,t.fillRect(a-n,h-n,r,r)}}function d(t,e=1,s=0){const{length:i,width:a,height:h}=t;for(let n=0;n<i;++n){let i=e*t.speed[n],o=s*t.speed[n];t.x[n]+=i,t.y[n]+=o,i<0?t.x[n]<0&&(t.x[n]=a,t.y[n]=r.range(0,h)):i>0&&t.x[n]>a&&(t.x[n]=0,t.y[n]=r.range(0,h)),o<0?t.y[n]<0&&(t.x[n]=r.range(0,a),t.y[n]=h):o>0&&t.y[n]>h&&(t.x[n]=r.range(0,a),t.y[n]=0)}}const c=document.querySelector("display-port").canvas,p=c.getContext("2d");let g,u=new AudioContext,y=0,f={load:async function(){g={start:q("space/start.wav"),dead:q("space/dead.wav"),pop:q("space/boop.wav"),music:q("space/music.wav",!0),shoot:q("space/click.wav"),boom:q("space/boom.wav")}},start:function(){this.level=0,this.score=0,this.highScore=Number(localStorage.getItem("highscore")),this.flashScoreDelta=0,this.flashHighScoreDelta=0,this.flashShootDelta=0,this.player={scene:this,x:c.width/2,y:c.height/2,rotation:0,dx:0,dy:0,dr:0,left:0,right:0,up:0,down:0,cooldown:0,powerMode:0,shoot(){if(!(this.scene.bullets.length>100||this.cooldown>0)){if(this.powerMode>0){for(let t=-1;t<=1;++t){let e=this.rotation+t*Math.PI/4,s=z(this.scene,this.x-5*Math.cos(e),this.y-5*Math.sin(e),4*-Math.cos(e)+this.dx,4*-Math.sin(e)+this.dy);this.scene.bullets.push(s)}--this.powerMode}else{let t=z(this.scene,this.x-5*Math.cos(this.rotation),this.y-5*Math.sin(this.rotation),4*-Math.cos(this.rotation)+this.dx,4*-Math.sin(this.rotation)+this.dy);this.scene.bullets.push(t)}this.cooldown=10,g.shoot.play()}}},this.asteroids=[],this.asteroidSpawner={scene:this,spawnTicks:b[1],reset(){this.spawnTicks=b[1]},spawn(){if(this.scene.asteroids.length>100)return;let t=r.choose(w),e=P(this.scene,r.range(t[0],t[0]+t[2]),r.range(t[1],t[1]+t[3]),r.range(-1,1),r.range(-1,1),8);this.scene.asteroids.push(e)},update(t){this.scene.gamePause||(this.spawnTicks-=t,this.spawnTicks<=0&&(this.spawn(),this.spawnTicks=r.range(...b)))}},this.bullets=[],this.particles=[],this.powerUps=[],this.powerUpSpawner={scene:this,reset(){},spawn(){let t=r.choose(w),e=(s=this.scene,i=r.range(t[0],t[0]+t[2]),a=r.range(t[1],t[1]+t[3]),h=r.range(-1,1),n=r.range(-1,1),{scene:s,x:i,y:a,dx:h,dy:n,rotation:Math.atan2(n,h),destroy(){this.scene.powerUps.splice(this.scene.powerUps.indexOf(this),1)}});var s,i,a,h,n;this.scene.powerUps.push(e)},update(t){}},this.starfield=function(t,e){let s={x:[],y:[],size:[],speed:[],length:0,width:t,height:e};for(let i=0;i<30;++i)s.x.push(r.range(0,t)),s.y.push(r.range(0,e)),s.size.push(r.range(...n)),s.speed.push(r.range(...o)),s.length++;return s}(c.width,c.height),this.gamePause=!0,this.showPlayer=!0,this.gameStart=!0,this.gameWait=!0,this.hint="[ wasd_ ]",document.addEventListener("keydown",(t=>L.call(this,t.key))),document.addEventListener("keyup",(t=>$.call(this,t.key)))},update:function(t){if(this.gamePause){for(let e of this.particles)e.age+=t,e.age>x?e.destroy():(e.x+=e.dx,e.y+=e.dy,M(e,8,8));return}const e=this.player.right-this.player.left,s=this.player.down-this.player.up,i=this.player.fire;this.player.dx+=s*Math.cos(this.player.rotation)*.02,this.player.dy+=s*Math.sin(this.player.rotation)*.02,this.player.dx*=.999,this.player.dy*=.999,this.player.dr+=.008*e,this.player.dr*=.9,this.player.x+=this.player.dx,this.player.y+=this.player.dy,this.player.rotation+=this.player.dr,--this.player.cooldown,M(this.player,10,10),i&&(this.player.shoot(),this.flashShootDelta=1);s&&function(t,e,s,i,a,h){if(r.next()>.3){let n=C(t,e+r.range(...k),s+r.range(...k),i,a,h);n.age=r.range(60,240),t.particles.push(n)}}(this,this.player.x,this.player.y,-s*Math.cos(this.player.rotation)*1.5,-s*Math.sin(this.player.rotation)*1.5,r.choose.bind(null,v));for(let e of this.bullets)e.age+=t,e.age>2e3?e.destroy():(e.x+=e.dx,e.y+=e.dy,M(e,4,4));for(let t of this.bullets)for(let e of this.asteroids)if(E(t,e,e.size)){this.flashScore=1,this.score++,this.score>this.highScore&&(this.flashHighScore=this.score-this.highScore,this.highScore=this.score,localStorage.setItem("highscore",this.highScore)),H(this,e.x,e.y,10,r.choose.bind(null,_)),g.pop.play(),t.destroy(),e.breakUp(.1*t.dx,.1*t.dy);break}for(let e of this.particles)e.age+=t,e.age>x?e.destroy():(e.x+=e.dx,e.y+=e.dy,M(e,8,8));for(let t of this.asteroids)t.x+=t.dx,t.y+=t.dy,M(t,2*t.size,2*t.size);for(let t of this.asteroids)if(E(t,this.player,t.size+5)){H(this,t.x,t.y,10,r.choose.bind(null,_)),t.destroy(),U(this);break}for(let t of this.powerUps)t.x+=t.dx,t.y+=t.dy,M(t,8,8);for(let t of this.powerUps)if(E(t,this.player,9)){H(this,t.x,t.y,10,r.choose.bind(null,T)),t.destroy(),this.player.powerMode+=30;break}d(this.starfield),this.asteroidSpawner.update(t),this.powerUpSpawner.update(t),!this.gamePause&&this.asteroids.length<=0&&(this.gamePause=!0,this.showPlayer=!0,g.start.play(),setTimeout((()=>this.gameWait=!0),1e3))},render:function(t){t.fillStyle="black",t.fillRect(0,0,c.width,c.height),l(t,this.starfield),t.fillStyle="rgba(255, 255, 255, 0.2)",t.textAlign="center",t.textBaseline="middle",t.font="16px sans-serif",t.fillText(this.hint,c.width/2,c.height/2-32),this.flashScore>0?(t.fillStyle=`rgba(255, 255, 255, ${this.flashScore+.2})`,this.flashScore-=.1):t.fillStyle="rgba(255, 255, 255, 0.2)";t.font="48px sans-serif",t.fillText("= "+String(this.score).padStart(2,"0")+" =",c.width/2,c.height/2),this.flashHighScore>0?(t.fillStyle=`rgba(255, 255, 255, ${this.flashHighScore+.2})`,this.flashHighScore-=.1):t.fillStyle="rgba(255, 255, 255, 0.2)";t.font="16px sans-serif",t.fillText(String(this.highScore).padStart(2,"0"),c.width/2,c.height/2+32),t.fillStyle="rgba(255, 255, 255, 0.2)",t.font="24px sans-serif",t.textAlign="right",t.fillText(Math.ceil(this.asteroidSpawner.spawnTicks/1e3),c.width,c.height-12);for(let e of this.asteroids)t.translate(e.x,e.y),t.rotate(e.rotation),t.fillStyle="slategray",t.fillRect(-e.size,-e.size,2*e.size,2*e.size),t.setTransform(1,0,0,1,0,0),R(t,e.x,e.y,e.size);for(let e of this.powerUps)t.translate(e.x,e.y),t.rotate(e.rotation),t.beginPath(),t.strokeStyle="violet",t.arc(0,0,4,0,2*Math.PI),t.moveTo(-2,0),t.lineTo(2,0),t.moveTo(0,-2),t.lineTo(0,2),t.stroke(),t.setTransform(1,0,0,1,0,0),R(t,e.x,e.y,4);for(let e of this.bullets)t.translate(e.x,e.y),t.rotate(e.rotation),t.fillStyle="gold",t.fillRect(-2,-2,8,4),t.setTransform(1,0,0,1,0,0),R(t,e.x,e.y,2);for(let e of this.particles){t.translate(e.x,e.y),t.rotate(e.rotation),t.fillStyle=e.color;let s=4*(1-e.age/x);t.fillRect(-s,-s,2*s,2*s),t.setTransform(1,0,0,1,0,0)}if(this.showPlayer){t.translate(this.player.x,this.player.y),t.rotate(this.player.rotation),t.fillStyle="white";let e=5;t.fillRect(-e,-e,2*e,2*e);let s=-1,i=0,a=0;this.flashShootDelta>0?(t.fillStyle=`rgb(${200*this.flashShootDelta+55*Math.sin(performance.now()/20)}, 0, 0)`,this.flashShootDelta-=.1,a=2*this.flashShootDelta,s=this.flashShootDelta):t.fillStyle="black",t.fillRect(-e-a/2+s,-e/4-a/2+i,e+a,e/2+a),t.setTransform(1,0,0,1,0,0)}R(t,this.player.x,this.player.y,5)}};function m(t){requestAnimationFrame(m);const e=t-y;y=t,f.update(e),f.render(p)}const w=[[-8,-8,16+c.width,8],[-8,0,8,c.height],[-8,c.height,16+c.width,8],[c.width,0,8,c.height]],b=[3e3,1e4],x=600,S=["red","red","red","yellow","orange"],_=["blue","blue","blue","dodgerblue","gray","darkgray","yellow"],v=["gray","darkgray","lightgray"],k=[-2,2],T=["violet","white","violet"];let A=!1;function M(t,e,s){t.x<-e&&(t.x=c.width),t.y<-s&&(t.y=c.height),t.x>c.width+e/2&&(t.x=-e),t.y>c.height+s/2&&(t.y=-s)}function E(t,e,s){const i=t.x-e.x,a=t.y-e.y;return i*i+a*a<=s*s}function R(t,e,s,i){A&&(t.translate(e,s),t.beginPath(),t.arc(0,0,i,0,2*Math.PI),t.strokeStyle="lime",t.stroke(),t.setTransform(1,0,0,1,0,0))}function P(t,e,s,i,a,h){return{scene:t,x:e,y:s,dx:i,dy:a,size:h,rotation:Math.atan2(a,i),breakUp(t=0,e=0){if(this.destroy(),this.size>4){let s=[];s.push(P(this.scene,this.x+r.range(-8,8),this.y+r.range(-8,8),r.range(-1,1)+t,r.range(-1,1)+e,4)),s.push(P(this.scene,this.x+r.range(-8,8),this.y+r.range(-8,8),r.range(-1,1)+t,r.range(-1,1)+e,4)),s.push(P(this.scene,this.x+r.range(-8,8),this.y+r.range(-8,8),r.range(-1,1)+t,r.range(-1,1)+e,4)),s.push(P(this.scene,this.x+r.range(-8,8),this.y+r.range(-8,8),r.range(-1,1)+t,r.range(-1,1)+e,4)),this.scene.asteroids.push(...s)}},destroy(){this.scene.asteroids.splice(this.scene.asteroids.indexOf(this),1)}}}function z(t,e,s,i,a){return{scene:t,x:e,y:s,dx:i,dy:a,rotation:Math.atan2(a,i),age:0,destroy(){this.scene.bullets.splice(this.scene.bullets.indexOf(this),1)}}}function C(t,e,s,i,a,h){return"function"==typeof h&&(h=h.call(null)),{scene:t,x:e,y:s,dx:i,dy:a,rotation:Math.atan2(a,i),age:0,color:h,destroy(){this.scene.particles.splice(this.scene.particles.indexOf(this),1)}}}function U(t){t.gamePause=!0,t.showPlayer=!1,H(t,t.player.x,t.player.y,100,r.choose.bind(null,S)),g.dead.play(),g.boom.play(),setTimeout((()=>t.gameStart=t.gameWait=!0),1e3)}function H(t,e,s,i=10,a){for(let h=0;h<i;++h)t.particles.push(C(t,e,s,2*r.range(-1,1),2*r.range(-1,1),a))}function L(t){switch(this.gameWait&&(this.gameStart&&(g.music.play(),this.score=0,this.flashScore=!0,this.level=0,this.gameStart=!1,this.player.powerMode=0,this.powerUps.length=0,this.asteroidSpawner.reset(),this.powerUpSpawner.reset()),this.gameWait=!1,function(t){t.bullets.length=0,t.asteroids.length=0,t.particles.length=0,t.player.x=c.width/2,t.player.y=c.height/2,t.player.dx=0,t.player.dy=0,t.level++,t.gamePause=!1,t.showPlayer=!0;for(let e=0;e<1*t.level;++e)t.asteroidSpawner.spawn();r.next()>.7&&t.powerUpSpawner.spawn(),g.music.playing||g.music.play()}(this)),t){case"w":case"ArrowUp":this.player.up=1;break;case"s":case"ArrowDown":this.player.down=1;break;case"a":case"ArrowLeft":this.player.left=1;break;case"d":case"ArrowRight":this.player.right=1;break;case" ":this.player.fire=1;break;case"\\":break;default:console.log(t)}}function $(t){switch(t){case"w":case"ArrowUp":this.player.up=0;break;case"s":case"ArrowDown":this.player.down=0;break;case"a":case"ArrowLeft":this.player.left=0;break;case"d":case"ArrowRight":this.player.right=0;break;case" ":this.player.fire=0;break;case"\\":A=!A;break;default:console.log(t)}}function q(t,e=!1){const s={_playing:!1,_data:null,_source:null,play(){if(!this._data)return;this._source&&this.destroy();let t=u.createBufferSource();t.loop=e,t.buffer=this._data,t.addEventListener("ended",(()=>{this._playing=!1})),t.connect(u.destination),t.start(0),this._source=t,this._playing=!0},pause(){this._source.stop(),this._playing=!1},destroy(){this._source&&this._source.disconnect(),this._source=null},isPaused(){return!this._playing}};return fetch(t).then((t=>t.arrayBuffer())).then((t=>u.decodeAudioData(t))).then((t=>s._data=t)),s}f.load().then((()=>{f.start(),m(y=performance.now())}))}();
