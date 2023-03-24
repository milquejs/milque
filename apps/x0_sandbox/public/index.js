(()=>{var Af=Object.create;var Ps=Object.defineProperty;var Tf=Object.getOwnPropertyDescriptor;var Cf=Object.getOwnPropertyNames;var Rf=Object.getPrototypeOf,Lf=Object.prototype.hasOwnProperty;var Pf=(i,e)=>()=>(i&&(e=i(i=0)),e);var kn=(i,e)=>()=>(e||i((e={exports:{}}).exports,e),e.exports),Xi=(i,e)=>{for(var t in e)Ps(i,t,{get:e[t],enumerable:!0})},Tl=(i,e,t,n)=>{if(e&&typeof e=="object"||typeof e=="function")for(let s of Cf(e))!Lf.call(i,s)&&s!==t&&Ps(i,s,{get:()=>e[s],enumerable:!(n=Tf(e,s))||n.enumerable});return i};var If=(i,e,t)=>(t=i!=null?Af(Rf(i)):{},Tl(e||!i||!i.__esModule?Ps(t,"default",{value:i,enumerable:!0}):t,i)),Df=i=>Tl(Ps({},"__esModule",{value:!0}),i);var Zl={};Xi(Zl,{basename:()=>$l,default:()=>ed,delimiter:()=>Xl,dirname:()=>Yl,extname:()=>Kl,isAbsolute:()=>io,join:()=>Wl,normalize:()=>no,relative:()=>Gl,resolve:()=>Ns,sep:()=>ql});function Vl(i,e){for(var t=0,n=i.length-1;n>=0;n--){var s=i[n];s==="."?i.splice(n,1):s===".."?(i.splice(n,1),t++):t&&(i.splice(n,1),t--)}if(e)for(;t--;t)i.unshift("..");return i}function Ns(){for(var i="",e=!1,t=arguments.length-1;t>=-1&&!e;t--){var n=t>=0?arguments[t]:"/";if(typeof n!="string")throw new TypeError("Arguments to path.resolve must be strings");if(!n)continue;i=n+"/"+i,e=n.charAt(0)==="/"}return i=Vl(so(i.split("/"),function(s){return!!s}),!e).join("/"),(e?"/":"")+i||"."}function no(i){var e=io(i),t=td(i,-1)==="/";return i=Vl(so(i.split("/"),function(n){return!!n}),!e).join("/"),!i&&!e&&(i="."),i&&t&&(i+="/"),(e?"/":"")+i}function io(i){return i.charAt(0)==="/"}function Wl(){var i=Array.prototype.slice.call(arguments,0);return no(so(i,function(e,t){if(typeof e!="string")throw new TypeError("Arguments to path.join must be strings");return e}).join("/"))}function Gl(i,e){i=Ns(i).substr(1),e=Ns(e).substr(1);function t(c){for(var h=0;h<c.length&&c[h]==="";h++);for(var u=c.length-1;u>=0&&c[u]==="";u--);return h>u?[]:c.slice(h,u-h+1)}for(var n=t(i.split("/")),s=t(e.split("/")),r=Math.min(n.length,s.length),a=r,o=0;o<r;o++)if(n[o]!==s[o]){a=o;break}for(var l=[],o=a;o<n.length;o++)l.push("..");return l=l.concat(s.slice(a)),l.join("/")}function Yl(i){var e=to(i),t=e[0],n=e[1];return!t&&!n?".":(n&&(n=n.substr(0,n.length-1)),t+n)}function $l(i,e){var t=to(i)[2];return e&&t.substr(-1*e.length)===e&&(t=t.substr(0,t.length-e.length)),t}function Kl(i){return to(i)[3]}function so(i,e){if(i.filter)return i.filter(e);for(var t=[],n=0;n<i.length;n++)e(i[n],n,i)&&t.push(i[n]);return t}var Qf,to,ql,Xl,ed,td,Jl=Pf(()=>{Qf=/^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/,to=function(i){return Qf.exec(i).slice(1)};ql="/",Xl=":";ed={extname:Kl,basename:$l,dirname:Yl,sep:ql,delimiter:Xl,relative:Gl,join:Wl,isAbsolute:io,normalize:no,resolve:Ns};td="ab".substr(-1)==="b"?function(i,e,t){return i.substr(e,t)}:function(i,e,t){return e<0&&(e=i.length+e),i.substr(e,t)}});var Fs=kn((fw,Os)=>{var Bn=(Jl(),Df(Zl));if(Bn&&Bn.default){Os.exports=Bn.default;for(let i in Bn)Os.exports[i]=Bn[i]}else Bn&&(Os.exports=Bn)});var $i=kn((dw,nc)=>{"use strict";var nd=Fs(),en="\\\\/",jl=`[^${en}]`,hn="\\.",id="\\+",sd="\\?",zs="\\/",rd="(?=.)",Ql="[^/]",ro=`(?:${zs}|$)`,ec=`(?:^|${zs})`,oo=`${hn}{1,2}${ro}`,od=`(?!${hn})`,ad=`(?!${ec}${oo})`,ld=`(?!${hn}{0,1}${ro})`,cd=`(?!${oo})`,hd=`[^.${zs}]`,ud=`${Ql}*?`,tc={DOT_LITERAL:hn,PLUS_LITERAL:id,QMARK_LITERAL:sd,SLASH_LITERAL:zs,ONE_CHAR:rd,QMARK:Ql,END_ANCHOR:ro,DOTS_SLASH:oo,NO_DOT:od,NO_DOTS:ad,NO_DOT_SLASH:ld,NO_DOTS_SLASH:cd,QMARK_NO_DOT:hd,STAR:ud,START_ANCHOR:ec},fd={...tc,SLASH_LITERAL:`[${en}]`,QMARK:jl,STAR:`${jl}*?`,DOTS_SLASH:`${hn}{1,2}(?:[${en}]|$)`,NO_DOT:`(?!${hn})`,NO_DOTS:`(?!(?:^|[${en}])${hn}{1,2}(?:[${en}]|$))`,NO_DOT_SLASH:`(?!${hn}{0,1}(?:[${en}]|$))`,NO_DOTS_SLASH:`(?!${hn}{1,2}(?:[${en}]|$))`,QMARK_NO_DOT:`[^.${en}]`,START_ANCHOR:`(?:^|[${en}])`,END_ANCHOR:`(?:[${en}]|$)`},dd={alnum:"a-zA-Z0-9",alpha:"a-zA-Z",ascii:"\\x00-\\x7F",blank:" \\t",cntrl:"\\x00-\\x1F\\x7F",digit:"0-9",graph:"\\x21-\\x7E",lower:"a-z",print:"\\x20-\\x7E ",punct:"\\-!\"#$%&'()\\*+,./:;<=>?@[\\]^_`{|}~",space:" \\t\\r\\n\\v\\f",upper:"A-Z",word:"A-Za-z0-9_",xdigit:"A-Fa-f0-9"};nc.exports={MAX_LENGTH:1024*64,POSIX_REGEX_SOURCE:dd,REGEX_BACKSLASH:/\\(?![*+?^${}(|)[\]])/g,REGEX_NON_SPECIAL_CHARS:/^[^@![\].,$*+?^{}()|\\/]+/,REGEX_SPECIAL_CHARS:/[-*+?.^${}(|)[\]]/,REGEX_SPECIAL_CHARS_BACKREF:/(\\?)((\W)(\3*))/g,REGEX_SPECIAL_CHARS_GLOBAL:/([-*+?.^${}(|)[\]])/g,REGEX_REMOVE_BACKSLASH:/(?:\[.*?[^\\]\]|\\(?=.))/g,REPLACEMENTS:{"***":"*","**/**":"**","**/**/**":"**"},CHAR_0:48,CHAR_9:57,CHAR_UPPERCASE_A:65,CHAR_LOWERCASE_A:97,CHAR_UPPERCASE_Z:90,CHAR_LOWERCASE_Z:122,CHAR_LEFT_PARENTHESES:40,CHAR_RIGHT_PARENTHESES:41,CHAR_ASTERISK:42,CHAR_AMPERSAND:38,CHAR_AT:64,CHAR_BACKWARD_SLASH:92,CHAR_CARRIAGE_RETURN:13,CHAR_CIRCUMFLEX_ACCENT:94,CHAR_COLON:58,CHAR_COMMA:44,CHAR_DOT:46,CHAR_DOUBLE_QUOTE:34,CHAR_EQUAL:61,CHAR_EXCLAMATION_MARK:33,CHAR_FORM_FEED:12,CHAR_FORWARD_SLASH:47,CHAR_GRAVE_ACCENT:96,CHAR_HASH:35,CHAR_HYPHEN_MINUS:45,CHAR_LEFT_ANGLE_BRACKET:60,CHAR_LEFT_CURLY_BRACE:123,CHAR_LEFT_SQUARE_BRACKET:91,CHAR_LINE_FEED:10,CHAR_NO_BREAK_SPACE:160,CHAR_PERCENT:37,CHAR_PLUS:43,CHAR_QUESTION_MARK:63,CHAR_RIGHT_ANGLE_BRACKET:62,CHAR_RIGHT_CURLY_BRACE:125,CHAR_RIGHT_SQUARE_BRACKET:93,CHAR_SEMICOLON:59,CHAR_SINGLE_QUOTE:39,CHAR_SPACE:32,CHAR_TAB:9,CHAR_UNDERSCORE:95,CHAR_VERTICAL_LINE:124,CHAR_ZERO_WIDTH_NOBREAK_SPACE:65279,SEP:nd.sep,extglobChars(i){return{"!":{type:"negate",open:"(?:(?!(?:",close:`))${i.STAR})`},"?":{type:"qmark",open:"(?:",close:")?"},"+":{type:"plus",open:"(?:",close:")+"},"*":{type:"star",open:"(?:",close:")*"},"@":{type:"at",open:"(?:",close:")"}}},globChars(i){return i===!0?fd:tc}}});var Us=kn(Mt=>{"use strict";var pd=Fs(),md=process.platform==="win32",{REGEX_BACKSLASH:gd,REGEX_REMOVE_BACKSLASH:xd,REGEX_SPECIAL_CHARS:_d,REGEX_SPECIAL_CHARS_GLOBAL:vd}=$i();Mt.isObject=i=>i!==null&&typeof i=="object"&&!Array.isArray(i);Mt.hasRegexChars=i=>_d.test(i);Mt.isRegexChar=i=>i.length===1&&Mt.hasRegexChars(i);Mt.escapeRegex=i=>i.replace(vd,"\\$1");Mt.toPosixSlashes=i=>i.replace(gd,"/");Mt.removeBackslashes=i=>i.replace(xd,e=>e==="\\"?"":e);Mt.supportsLookbehinds=()=>{let i=process.version.slice(1).split(".").map(Number);return i.length===3&&i[0]>=9||i[0]===8&&i[1]>=10};Mt.isWindows=i=>i&&typeof i.windows=="boolean"?i.windows:md===!0||pd.sep==="\\";Mt.escapeLast=(i,e,t)=>{let n=i.lastIndexOf(e,t);return n===-1?i:i[n-1]==="\\"?Mt.escapeLast(i,e,n-1):`${i.slice(0,n)}\\${i.slice(n)}`};Mt.removePrefix=(i,e={})=>{let t=i;return t.startsWith("./")&&(t=t.slice(2),e.prefix="./"),t};Mt.wrapOutput=(i,e={},t={})=>{let n=t.contains?"":"^",s=t.contains?"":"$",r=`${n}(?:${i})${s}`;return e.negated===!0&&(r=`(?:^(?!${r}).*$)`),r}});var hc=kn((mw,cc)=>{"use strict";var ic=Us(),{CHAR_ASTERISK:ao,CHAR_AT:yd,CHAR_BACKWARD_SLASH:Ki,CHAR_COMMA:bd,CHAR_DOT:lo,CHAR_EXCLAMATION_MARK:co,CHAR_FORWARD_SLASH:lc,CHAR_LEFT_CURLY_BRACE:ho,CHAR_LEFT_PARENTHESES:uo,CHAR_LEFT_SQUARE_BRACKET:wd,CHAR_PLUS:Md,CHAR_QUESTION_MARK:sc,CHAR_RIGHT_CURLY_BRACE:Sd,CHAR_RIGHT_PARENTHESES:rc,CHAR_RIGHT_SQUARE_BRACKET:Ed}=$i(),oc=i=>i===lc||i===Ki,ac=i=>{i.isPrefix!==!0&&(i.depth=i.isGlobstar?1/0:1)},Ad=(i,e)=>{let t=e||{},n=i.length-1,s=t.parts===!0||t.scanToEnd===!0,r=[],a=[],o=[],l=i,c=-1,h=0,u=0,f=!1,m=!1,x=!1,p=!1,d=!1,v=!1,A=!1,y=!1,w=!1,M=!1,P=0,F,g,S={value:"",depth:0,isGlob:!1},D=()=>c>=n,L=()=>l.charCodeAt(c+1),G=()=>(F=g,l.charCodeAt(++c));for(;c<n;){g=G();let j;if(g===Ki){A=S.backslashes=!0,g=G(),g===ho&&(v=!0);continue}if(v===!0||g===ho){for(P++;D()!==!0&&(g=G());){if(g===Ki){A=S.backslashes=!0,G();continue}if(g===ho){P++;continue}if(v!==!0&&g===lo&&(g=G())===lo){if(f=S.isBrace=!0,x=S.isGlob=!0,M=!0,s===!0)continue;break}if(v!==!0&&g===bd){if(f=S.isBrace=!0,x=S.isGlob=!0,M=!0,s===!0)continue;break}if(g===Sd&&(P--,P===0)){v=!1,f=S.isBrace=!0,M=!0;break}}if(s===!0)continue;break}if(g===lc){if(r.push(c),a.push(S),S={value:"",depth:0,isGlob:!1},M===!0)continue;if(F===lo&&c===h+1){h+=2;continue}u=c+1;continue}if(t.noext!==!0&&(g===Md||g===yd||g===ao||g===sc||g===co)===!0&&L()===uo){if(x=S.isGlob=!0,p=S.isExtglob=!0,M=!0,g===co&&c===h&&(w=!0),s===!0){for(;D()!==!0&&(g=G());){if(g===Ki){A=S.backslashes=!0,g=G();continue}if(g===rc){x=S.isGlob=!0,M=!0;break}}continue}break}if(g===ao){if(F===ao&&(d=S.isGlobstar=!0),x=S.isGlob=!0,M=!0,s===!0)continue;break}if(g===sc){if(x=S.isGlob=!0,M=!0,s===!0)continue;break}if(g===wd){for(;D()!==!0&&(j=G());){if(j===Ki){A=S.backslashes=!0,G();continue}if(j===Ed){m=S.isBracket=!0,x=S.isGlob=!0,M=!0;break}}if(s===!0)continue;break}if(t.nonegate!==!0&&g===co&&c===h){y=S.negated=!0,h++;continue}if(t.noparen!==!0&&g===uo){if(x=S.isGlob=!0,s===!0){for(;D()!==!0&&(g=G());){if(g===uo){A=S.backslashes=!0,g=G();continue}if(g===rc){M=!0;break}}continue}break}if(x===!0){if(M=!0,s===!0)continue;break}}t.noext===!0&&(p=!1,x=!1);let O=l,z="",T="";h>0&&(z=l.slice(0,h),l=l.slice(h),u-=h),O&&x===!0&&u>0?(O=l.slice(0,u),T=l.slice(u)):x===!0?(O="",T=l):O=l,O&&O!==""&&O!=="/"&&O!==l&&oc(O.charCodeAt(O.length-1))&&(O=O.slice(0,-1)),t.unescape===!0&&(T&&(T=ic.removeBackslashes(T)),O&&A===!0&&(O=ic.removeBackslashes(O)));let R={prefix:z,input:i,start:h,base:O,glob:T,isBrace:f,isBracket:m,isGlob:x,isExtglob:p,isGlobstar:d,negated:y,negatedExtglob:w};if(t.tokens===!0&&(R.maxDepth=0,oc(g)||a.push(S),R.tokens=a),t.parts===!0||t.tokens===!0){let j;for(let V=0;V<r.length;V++){let Q=j?j+1:h,Z=r[V],ue=i.slice(Q,Z);t.tokens&&(V===0&&h!==0?(a[V].isPrefix=!0,a[V].value=z):a[V].value=ue,ac(a[V]),R.maxDepth+=a[V].depth),(V!==0||ue!=="")&&o.push(ue),j=Z}if(j&&j+1<i.length){let V=i.slice(j+1);o.push(V),t.tokens&&(a[a.length-1].value=V,ac(a[a.length-1]),R.maxDepth+=a[a.length-1].depth)}R.slashes=r,R.parts=o}return R};cc.exports=Ad});var dc=kn((gw,fc)=>{"use strict";var ks=$i(),Rt=Us(),{MAX_LENGTH:Bs,POSIX_REGEX_SOURCE:Td,REGEX_NON_SPECIAL_CHARS:Cd,REGEX_SPECIAL_CHARS_BACKREF:Rd,REPLACEMENTS:uc}=ks,Ld=(i,e)=>{if(typeof e.expandRange=="function")return e.expandRange(...i,e);i.sort();let t=`[${i.join("-")}]`;try{new RegExp(t)}catch{return i.map(s=>Rt.escapeRegex(s)).join("..")}return t},ci=(i,e)=>`Missing ${i}: "${e}" - use "\\\\${e}" to match literal characters`,fo=(i,e)=>{if(typeof i!="string")throw new TypeError("Expected a string");i=uc[i]||i;let t={...e},n=typeof t.maxLength=="number"?Math.min(Bs,t.maxLength):Bs,s=i.length;if(s>n)throw new SyntaxError(`Input length: ${s}, exceeds maximum allowed length: ${n}`);let r={type:"bos",value:"",output:t.prepend||""},a=[r],o=t.capture?"":"?:",l=Rt.isWindows(e),c=ks.globChars(l),h=ks.extglobChars(c),{DOT_LITERAL:u,PLUS_LITERAL:f,SLASH_LITERAL:m,ONE_CHAR:x,DOTS_SLASH:p,NO_DOT:d,NO_DOT_SLASH:v,NO_DOTS_SLASH:A,QMARK:y,QMARK_NO_DOT:w,STAR:M,START_ANCHOR:P}=c,F=q=>`(${o}(?:(?!${P}${q.dot?p:u}).)*?)`,g=t.dot?"":d,S=t.dot?y:w,D=t.bash===!0?F(t):M;t.capture&&(D=`(${D})`),typeof t.noext=="boolean"&&(t.noextglob=t.noext);let L={input:i,index:-1,start:0,dot:t.dot===!0,consumed:"",output:"",prefix:"",backtrack:!1,negated:!1,brackets:0,braces:0,parens:0,quotes:0,globstar:!1,tokens:a};i=Rt.removePrefix(i,L),s=i.length;let G=[],O=[],z=[],T=r,R,j=()=>L.index===s-1,V=L.peek=(q=1)=>i[L.index+q],Q=L.advance=()=>i[++L.index]||"",Z=()=>i.slice(L.index+1),ue=(q="",te=0)=>{L.consumed+=q,L.index+=te},B=q=>{L.output+=q.output!=null?q.output:q.value,ue(q.value)},ee=()=>{let q=1;for(;V()==="!"&&(V(2)!=="("||V(3)==="?");)Q(),L.start++,q++;return q%2===0?!1:(L.negated=!0,L.start++,!0)},re=q=>{L[q]++,z.push(q)},se=q=>{L[q]--,z.pop()},N=q=>{if(T.type==="globstar"){let te=L.braces>0&&(q.type==="comma"||q.type==="brace"),J=q.extglob===!0||G.length&&(q.type==="pipe"||q.type==="paren");q.type!=="slash"&&q.type!=="paren"&&!te&&!J&&(L.output=L.output.slice(0,-T.output.length),T.type="star",T.value="*",T.output=D,L.output+=T.output)}if(G.length&&q.type!=="paren"&&(G[G.length-1].inner+=q.value),(q.value||q.output)&&B(q),T&&T.type==="text"&&q.type==="text"){T.value+=q.value,T.output=(T.output||"")+q.value;return}q.prev=T,a.push(q),T=q},we=(q,te)=>{let J={...h[te],conditions:1,inner:""};J.prev=T,J.parens=L.parens,J.output=L.output;let ae=(t.capture?"(":"")+J.open;re("parens"),N({type:q,value:te,output:L.output?"":x}),N({type:"paren",extglob:!0,value:Q(),output:ae}),G.push(J)},xe=q=>{let te=q.close+(t.capture?")":""),J;if(q.type==="negate"){let ae=D;if(q.inner&&q.inner.length>1&&q.inner.includes("/")&&(ae=F(t)),(ae!==D||j()||/^\)+$/.test(Z()))&&(te=q.close=`)$))${ae}`),q.inner.includes("*")&&(J=Z())&&/^\.[^\\/.]+$/.test(J)){let he=fo(J,{...e,fastpaths:!1}).output;te=q.close=`)${he})${ae})`}q.prev.type==="bos"&&(L.negatedExtglob=!0)}N({type:"paren",extglob:!0,value:R,output:te}),se("parens")};if(t.fastpaths!==!1&&!/(^[*!]|[/()[\]{}"])/.test(i)){let q=!1,te=i.replace(Rd,(J,ae,he,Ie,Le,$e)=>Ie==="\\"?(q=!0,J):Ie==="?"?ae?ae+Ie+(Le?y.repeat(Le.length):""):$e===0?S+(Le?y.repeat(Le.length):""):y.repeat(he.length):Ie==="."?u.repeat(he.length):Ie==="*"?ae?ae+Ie+(Le?D:""):D:ae?J:`\\${J}`);return q===!0&&(t.unescape===!0?te=te.replace(/\\/g,""):te=te.replace(/\\+/g,J=>J.length%2===0?"\\\\":J?"\\":"")),te===i&&t.contains===!0?(L.output=i,L):(L.output=Rt.wrapOutput(te,L,e),L)}for(;!j();){if(R=Q(),R==="\0")continue;if(R==="\\"){let J=V();if(J==="/"&&t.bash!==!0||J==="."||J===";")continue;if(!J){R+="\\",N({type:"text",value:R});continue}let ae=/^\\+/.exec(Z()),he=0;if(ae&&ae[0].length>2&&(he=ae[0].length,L.index+=he,he%2!==0&&(R+="\\")),t.unescape===!0?R=Q():R+=Q(),L.brackets===0){N({type:"text",value:R});continue}}if(L.brackets>0&&(R!=="]"||T.value==="["||T.value==="[^")){if(t.posix!==!1&&R===":"){let J=T.value.slice(1);if(J.includes("[")&&(T.posix=!0,J.includes(":"))){let ae=T.value.lastIndexOf("["),he=T.value.slice(0,ae),Ie=T.value.slice(ae+2),Le=Td[Ie];if(Le){T.value=he+Le,L.backtrack=!0,Q(),!r.output&&a.indexOf(T)===1&&(r.output=x);continue}}}(R==="["&&V()!==":"||R==="-"&&V()==="]")&&(R=`\\${R}`),R==="]"&&(T.value==="["||T.value==="[^")&&(R=`\\${R}`),t.posix===!0&&R==="!"&&T.value==="["&&(R="^"),T.value+=R,B({value:R});continue}if(L.quotes===1&&R!=='"'){R=Rt.escapeRegex(R),T.value+=R,B({value:R});continue}if(R==='"'){L.quotes=L.quotes===1?0:1,t.keepQuotes===!0&&N({type:"text",value:R});continue}if(R==="("){re("parens"),N({type:"paren",value:R});continue}if(R===")"){if(L.parens===0&&t.strictBrackets===!0)throw new SyntaxError(ci("opening","("));let J=G[G.length-1];if(J&&L.parens===J.parens+1){xe(G.pop());continue}N({type:"paren",value:R,output:L.parens?")":"\\)"}),se("parens");continue}if(R==="["){if(t.nobracket===!0||!Z().includes("]")){if(t.nobracket!==!0&&t.strictBrackets===!0)throw new SyntaxError(ci("closing","]"));R=`\\${R}`}else re("brackets");N({type:"bracket",value:R});continue}if(R==="]"){if(t.nobracket===!0||T&&T.type==="bracket"&&T.value.length===1){N({type:"text",value:R,output:`\\${R}`});continue}if(L.brackets===0){if(t.strictBrackets===!0)throw new SyntaxError(ci("opening","["));N({type:"text",value:R,output:`\\${R}`});continue}se("brackets");let J=T.value.slice(1);if(T.posix!==!0&&J[0]==="^"&&!J.includes("/")&&(R=`/${R}`),T.value+=R,B({value:R}),t.literalBrackets===!1||Rt.hasRegexChars(J))continue;let ae=Rt.escapeRegex(T.value);if(L.output=L.output.slice(0,-T.value.length),t.literalBrackets===!0){L.output+=ae,T.value=ae;continue}T.value=`(${o}${ae}|${T.value})`,L.output+=T.value;continue}if(R==="{"&&t.nobrace!==!0){re("braces");let J={type:"brace",value:R,output:"(",outputIndex:L.output.length,tokensIndex:L.tokens.length};O.push(J),N(J);continue}if(R==="}"){let J=O[O.length-1];if(t.nobrace===!0||!J){N({type:"text",value:R,output:R});continue}let ae=")";if(J.dots===!0){let he=a.slice(),Ie=[];for(let Le=he.length-1;Le>=0&&(a.pop(),he[Le].type!=="brace");Le--)he[Le].type!=="dots"&&Ie.unshift(he[Le].value);ae=Ld(Ie,t),L.backtrack=!0}if(J.comma!==!0&&J.dots!==!0){let he=L.output.slice(0,J.outputIndex),Ie=L.tokens.slice(J.tokensIndex);J.value=J.output="\\{",R=ae="\\}",L.output=he;for(let Le of Ie)L.output+=Le.output||Le.value}N({type:"brace",value:R,output:ae}),se("braces"),O.pop();continue}if(R==="|"){G.length>0&&G[G.length-1].conditions++,N({type:"text",value:R});continue}if(R===","){let J=R,ae=O[O.length-1];ae&&z[z.length-1]==="braces"&&(ae.comma=!0,J="|"),N({type:"comma",value:R,output:J});continue}if(R==="/"){if(T.type==="dot"&&L.index===L.start+1){L.start=L.index+1,L.consumed="",L.output="",a.pop(),T=r;continue}N({type:"slash",value:R,output:m});continue}if(R==="."){if(L.braces>0&&T.type==="dot"){T.value==="."&&(T.output=u);let J=O[O.length-1];T.type="dots",T.output+=R,T.value+=R,J.dots=!0;continue}if(L.braces+L.parens===0&&T.type!=="bos"&&T.type!=="slash"){N({type:"text",value:R,output:u});continue}N({type:"dot",value:R,output:u});continue}if(R==="?"){if(!(T&&T.value==="(")&&t.noextglob!==!0&&V()==="("&&V(2)!=="?"){we("qmark",R);continue}if(T&&T.type==="paren"){let ae=V(),he=R;if(ae==="<"&&!Rt.supportsLookbehinds())throw new Error("Node.js v10 or higher is required for regex lookbehinds");(T.value==="("&&!/[!=<:]/.test(ae)||ae==="<"&&!/<([!=]|\w+>)/.test(Z()))&&(he=`\\${R}`),N({type:"text",value:R,output:he});continue}if(t.dot!==!0&&(T.type==="slash"||T.type==="bos")){N({type:"qmark",value:R,output:w});continue}N({type:"qmark",value:R,output:y});continue}if(R==="!"){if(t.noextglob!==!0&&V()==="("&&(V(2)!=="?"||!/[!=<:]/.test(V(3)))){we("negate",R);continue}if(t.nonegate!==!0&&L.index===0){ee();continue}}if(R==="+"){if(t.noextglob!==!0&&V()==="("&&V(2)!=="?"){we("plus",R);continue}if(T&&T.value==="("||t.regex===!1){N({type:"plus",value:R,output:f});continue}if(T&&(T.type==="bracket"||T.type==="paren"||T.type==="brace")||L.parens>0){N({type:"plus",value:R});continue}N({type:"plus",value:f});continue}if(R==="@"){if(t.noextglob!==!0&&V()==="("&&V(2)!=="?"){N({type:"at",extglob:!0,value:R,output:""});continue}N({type:"text",value:R});continue}if(R!=="*"){(R==="$"||R==="^")&&(R=`\\${R}`);let J=Cd.exec(Z());J&&(R+=J[0],L.index+=J[0].length),N({type:"text",value:R});continue}if(T&&(T.type==="globstar"||T.star===!0)){T.type="star",T.star=!0,T.value+=R,T.output=D,L.backtrack=!0,L.globstar=!0,ue(R);continue}let q=Z();if(t.noextglob!==!0&&/^\([^?]/.test(q)){we("star",R);continue}if(T.type==="star"){if(t.noglobstar===!0){ue(R);continue}let J=T.prev,ae=J.prev,he=J.type==="slash"||J.type==="bos",Ie=ae&&(ae.type==="star"||ae.type==="globstar");if(t.bash===!0&&(!he||q[0]&&q[0]!=="/")){N({type:"star",value:R,output:""});continue}let Le=L.braces>0&&(J.type==="comma"||J.type==="brace"),$e=G.length&&(J.type==="pipe"||J.type==="paren");if(!he&&J.type!=="paren"&&!Le&&!$e){N({type:"star",value:R,output:""});continue}for(;q.slice(0,3)==="/**";){let Qe=i[L.index+4];if(Qe&&Qe!=="/")break;q=q.slice(3),ue("/**",3)}if(J.type==="bos"&&j()){T.type="globstar",T.value+=R,T.output=F(t),L.output=T.output,L.globstar=!0,ue(R);continue}if(J.type==="slash"&&J.prev.type!=="bos"&&!Ie&&j()){L.output=L.output.slice(0,-(J.output+T.output).length),J.output=`(?:${J.output}`,T.type="globstar",T.output=F(t)+(t.strictSlashes?")":"|$)"),T.value+=R,L.globstar=!0,L.output+=J.output+T.output,ue(R);continue}if(J.type==="slash"&&J.prev.type!=="bos"&&q[0]==="/"){let Qe=q[1]!==void 0?"|$":"";L.output=L.output.slice(0,-(J.output+T.output).length),J.output=`(?:${J.output}`,T.type="globstar",T.output=`${F(t)}${m}|${m}${Qe})`,T.value+=R,L.output+=J.output+T.output,L.globstar=!0,ue(R+Q()),N({type:"slash",value:"/",output:""});continue}if(J.type==="bos"&&q[0]==="/"){T.type="globstar",T.value+=R,T.output=`(?:^|${m}|${F(t)}${m})`,L.output=T.output,L.globstar=!0,ue(R+Q()),N({type:"slash",value:"/",output:""});continue}L.output=L.output.slice(0,-T.output.length),T.type="globstar",T.output=F(t),T.value+=R,L.output+=T.output,L.globstar=!0,ue(R);continue}let te={type:"star",value:R,output:D};if(t.bash===!0){te.output=".*?",(T.type==="bos"||T.type==="slash")&&(te.output=g+te.output),N(te);continue}if(T&&(T.type==="bracket"||T.type==="paren")&&t.regex===!0){te.output=R,N(te);continue}(L.index===L.start||T.type==="slash"||T.type==="dot")&&(T.type==="dot"?(L.output+=v,T.output+=v):t.dot===!0?(L.output+=A,T.output+=A):(L.output+=g,T.output+=g),V()!=="*"&&(L.output+=x,T.output+=x)),N(te)}for(;L.brackets>0;){if(t.strictBrackets===!0)throw new SyntaxError(ci("closing","]"));L.output=Rt.escapeLast(L.output,"["),se("brackets")}for(;L.parens>0;){if(t.strictBrackets===!0)throw new SyntaxError(ci("closing",")"));L.output=Rt.escapeLast(L.output,"("),se("parens")}for(;L.braces>0;){if(t.strictBrackets===!0)throw new SyntaxError(ci("closing","}"));L.output=Rt.escapeLast(L.output,"{"),se("braces")}if(t.strictSlashes!==!0&&(T.type==="star"||T.type==="bracket")&&N({type:"maybe_slash",value:"",output:`${m}?`}),L.backtrack===!0){L.output="";for(let q of L.tokens)L.output+=q.output!=null?q.output:q.value,q.suffix&&(L.output+=q.suffix)}return L};fo.fastpaths=(i,e)=>{let t={...e},n=typeof t.maxLength=="number"?Math.min(Bs,t.maxLength):Bs,s=i.length;if(s>n)throw new SyntaxError(`Input length: ${s}, exceeds maximum allowed length: ${n}`);i=uc[i]||i;let r=Rt.isWindows(e),{DOT_LITERAL:a,SLASH_LITERAL:o,ONE_CHAR:l,DOTS_SLASH:c,NO_DOT:h,NO_DOTS:u,NO_DOTS_SLASH:f,STAR:m,START_ANCHOR:x}=ks.globChars(r),p=t.dot?u:h,d=t.dot?f:h,v=t.capture?"":"?:",A={negated:!1,prefix:""},y=t.bash===!0?".*?":m;t.capture&&(y=`(${y})`);let w=g=>g.noglobstar===!0?y:`(${v}(?:(?!${x}${g.dot?c:a}).)*?)`,M=g=>{switch(g){case"*":return`${p}${l}${y}`;case".*":return`${a}${l}${y}`;case"*.*":return`${p}${y}${a}${l}${y}`;case"*/*":return`${p}${y}${o}${l}${d}${y}`;case"**":return p+w(t);case"**/*":return`(?:${p}${w(t)}${o})?${d}${l}${y}`;case"**/*.*":return`(?:${p}${w(t)}${o})?${d}${y}${a}${l}${y}`;case"**/.*":return`(?:${p}${w(t)}${o})?${a}${l}${y}`;default:{let S=/^(.*?)\.(\w+)$/.exec(g);if(!S)return;let D=M(S[1]);return D?D+a+S[2]:void 0}}},P=Rt.removePrefix(i,A),F=M(P);return F&&t.strictSlashes!==!0&&(F+=`${o}?`),F};fc.exports=fo});var mc=kn((xw,pc)=>{"use strict";var Pd=Fs(),Id=hc(),po=dc(),mo=Us(),Dd=$i(),Nd=i=>i&&typeof i=="object"&&!Array.isArray(i),Je=(i,e,t=!1)=>{if(Array.isArray(i)){let h=i.map(f=>Je(f,e,t));return f=>{for(let m of h){let x=m(f);if(x)return x}return!1}}let n=Nd(i)&&i.tokens&&i.input;if(i===""||typeof i!="string"&&!n)throw new TypeError("Expected pattern to be a non-empty string");let s=e||{},r=mo.isWindows(e),a=n?Je.compileRe(i,e):Je.makeRe(i,e,!1,!0),o=a.state;delete a.state;let l=()=>!1;if(s.ignore){let h={...e,ignore:null,onMatch:null,onResult:null};l=Je(s.ignore,h,t)}let c=(h,u=!1)=>{let{isMatch:f,match:m,output:x}=Je.test(h,a,e,{glob:i,posix:r}),p={glob:i,state:o,regex:a,posix:r,input:h,output:x,match:m,isMatch:f};return typeof s.onResult=="function"&&s.onResult(p),f===!1?(p.isMatch=!1,u?p:!1):l(h)?(typeof s.onIgnore=="function"&&s.onIgnore(p),p.isMatch=!1,u?p:!1):(typeof s.onMatch=="function"&&s.onMatch(p),u?p:!0)};return t&&(c.state=o),c};Je.test=(i,e,t,{glob:n,posix:s}={})=>{if(typeof i!="string")throw new TypeError("Expected input to be a string");if(i==="")return{isMatch:!1,output:""};let r=t||{},a=r.format||(s?mo.toPosixSlashes:null),o=i===n,l=o&&a?a(i):i;return o===!1&&(l=a?a(i):i,o=l===n),(o===!1||r.capture===!0)&&(r.matchBase===!0||r.basename===!0?o=Je.matchBase(i,e,t,s):o=e.exec(l)),{isMatch:!!o,match:o,output:l}};Je.matchBase=(i,e,t,n=mo.isWindows(t))=>(e instanceof RegExp?e:Je.makeRe(e,t)).test(Pd.basename(i));Je.isMatch=(i,e,t)=>Je(e,t)(i);Je.parse=(i,e)=>Array.isArray(i)?i.map(t=>Je.parse(t,e)):po(i,{...e,fastpaths:!1});Je.scan=(i,e)=>Id(i,e);Je.compileRe=(i,e,t=!1,n=!1)=>{if(t===!0)return i.output;let s=e||{},r=s.contains?"":"^",a=s.contains?"":"$",o=`${r}(?:${i.output})${a}`;i&&i.negated===!0&&(o=`^(?!${o}).*$`);let l=Je.toRegex(o,e);return n===!0&&(l.state=i),l};Je.makeRe=(i,e={},t=!1,n=!1)=>{if(!i||typeof i!="string")throw new TypeError("Expected a non-empty string");let s={negated:!1,fastpaths:!0};return e.fastpaths!==!1&&(i[0]==="."||i[0]==="*")&&(s.output=po.fastpaths(i,e)),s.output||(s=po(i,e)),Je.compileRe(s,e,t,n)};Je.toRegex=(i,e)=>{try{let t=e||{};return new RegExp(i,t.flags||(t.nocase?"i":""))}catch(t){if(e&&e.debug===!0)throw t;return/$^/}};Je.constants=Dd;pc.exports=Je});var xc=kn((_w,gc)=>{"use strict";gc.exports=mc()});var Nf=`
<div class="container">
  <label class="hidden" id="title">display-port</label>
  <label class="hidden" id="fps">00</label>
  <label class="hidden" id="dimension">0x0</label>
  <div class="content">
    <slot id="inner">
      <canvas>
        Oh no! Your browser does not support canvas.
      </canvas>
    </slot>
    <slot name="overlay"></slot>
  </div>
  <slot name="frame"></slot>
</div>`,Of=`
:host {
  display: inline-block;
  color: #555555;
}

.container {
  display: flex;
  position: relative;
  width: 100%;
  height: 100%;
}

.content {
  position: relative;
  margin: auto;
  overflow: hidden;
}

.content > *:not(canvas) {
  width: 100%;
  height: 100%;
}

canvas {
  background: #000000;
  image-rendering: pixelated;
}

label {
  position: absolute;
  font-family: monospace;
  color: currentColor;
}

#inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
}

#title {
  left: 0.5rem;
  top: 0.5rem;
}

#fps {
  right: 0.5rem;
  top: 0.5rem;
}

#dimension {
  left: 0.5rem;
  bottom: 0.5rem;
}

.hidden {
  display: none;
}

:host([debug]) .container {
  outline: 6px dashed rgba(0, 0, 0, 0.1);
  outline-offset: -4px;
  background-color: rgba(0, 0, 0, 0.1);
}

:host([mode='noscale']) canvas {
  margin: 0;
  top: 0;
  left: 0;
}

:host([mode='stretch']) canvas,
:host([mode='scale']) canvas {
  width: 100%;
  height: 100%;
}

:host([mode='fit']),
:host([mode='scale']),
:host([mode='center']),
:host([mode='stretch']),
:host([mode='fill']) {
  width: 100%;
  height: 100%;
}

:host([full]) {
  width: 100vw !important;
  height: 100vh !important;
}

:host([disabled]) {
  display: none;
}

slot {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
}

::slotted(*) {
  pointer-events: auto;
}`,Cl="noscale";var Qr="fit",Rl="scale",Ll="fill",Pl="stretch";var Il=Qr,Ff=200,wt=class extends HTMLElement{static create(e={}){let{root:t=document.body,id:n=void 0,mode:s=Il,width:r=300,height:a=150,debug:o=!1}=e||{},l=new wt;return l.id=n,l.mode=s,l.width=r,l.height=a,l.debug=o,t.appendChild(l),l}static define(e=window.customElements){e.define("display-port",this)}static get[Symbol.for("templateNode")](){let e=document.createElement("template");return e.innerHTML=Nf,Object.defineProperty(this,Symbol.for("templateNode"),{value:e}),e}static get[Symbol.for("styleNode")](){let e=document.createElement("style");return e.innerHTML=Of,Object.defineProperty(this,Symbol.for("styleNode"),{value:e}),e}static get observedAttributes(){return["debug","disabled","width","height","onframe","id","class"]}get mode(){return this.getAttribute("mode")}set mode(e){this.setAttribute("mode",e)}get debug(){return this._debug}set debug(e){this.toggleAttribute("debug",e)}get disabled(){return this._disabled}set disabled(e){this.toggleAttribute("disabled",e)}get width(){return this._width}set width(e){this.setAttribute("width",String(e))}get height(){return this._height}set height(e){this.setAttribute("height",String(e))}get onframe(){return this._onframe}set onframe(e){this._onframe&&this.removeEventListener("frame",this._onframe),this._onframe=e,this._onframe&&this.addEventListener("frame",e)}constructor(){super();let e=this.attachShadow({mode:"open"});e.appendChild(this.constructor[Symbol.for("templateNode")].content.cloneNode(!0)),e.appendChild(this.constructor[Symbol.for("styleNode")].cloneNode(!0)),this._canvasElement=null,this._contentElement=e.querySelector(".content"),this._innerElement=e.querySelector("#inner"),this._titleElement=e.querySelector("#title"),this._fpsElement=e.querySelector("#fps"),this._dimensionElement=e.querySelector("#dimension"),this._debug=!1,this._disabled=!1,this._width=300,this._height=150,this._onframe=void 0,this._animationRequestHandle=0,this._prevAnimationFrameTime=0,this._resizeTimeoutHandle=0,this._resizeCanvasWidth=0,this._resizeCanvasHeight=0,this._frameEvent=new CustomEvent("frame",{composed:!0,bubbles:!1,detail:{now:0,prevTime:0,deltaTime:0,canvas:this._canvasElement}}),this._resizeEvent=new CustomEvent("resize",{composed:!0,bubbles:!1,detail:{width:0,height:0}}),this.update=this.update.bind(this),this.onDelayCanvasResize=this.onDelayCanvasResize.bind(this),this.onSlotChange=this.onSlotChange.bind(this)}get canvas(){return this._canvasElement}connectedCallback(){ai(this,"mode"),ai(this,"debug"),ai(this,"disabled"),ai(this,"width"),ai(this,"height"),ai(this,"onframe"),this.hasAttribute("mode")||this.setAttribute("mode",Il),this.hasAttribute("tabindex")||this.setAttribute("tabindex","0"),this._innerElement.addEventListener("slotchange",this.onSlotChange),this._canvasElement=this._innerElement.querySelector("canvas"),this._canvasElement&&(this.updateCanvasSize(!0),this.resume())}disconnectedCallback(){this._innerElement.removeEventListener("slotchange",this.onSlotChange),this.pause()}attributeChangedCallback(e,t,n){switch(e){case"debug":this._debug=n!==null;break;case"disabled":this._disabled=n!==null;break;case"width":this._width=Number(n);break;case"height":this._height=Number(n);break;case"onframe":this.onframe=new Function("event","with(document){with(this){"+n+"}}").bind(this);break}switch(e){case"disabled":n?(this.update(0),this.pause()):this.resume();break;case"id":case"class":this._titleElement.innerHTML=`display-port${this.className?"."+this.className:""}${this.hasAttribute("id")?"#"+this.getAttribute("id"):""}`;break;case"debug":this._titleElement.classList.toggle("hidden",n),this._fpsElement.classList.toggle("hidden",n),this._dimensionElement.classList.toggle("hidden",n);break}}onSlotChange(e){let s=e.target.assignedElements({flatten:!0}).find(r=>r instanceof HTMLCanvasElement);if(!s)throw new Error("No valid canvas element found for display.");this._canvasElement=s,this.updateCanvasSize(!0),this.resume()}getContext(e="2d",t=void 0){return this._canvasElement.getContext(e,t)}pause(){window.cancelAnimationFrame(this._animationRequestHandle)}resume(){this._animationRequestHandle=window.requestAnimationFrame(this.update)}update(e){this._animationRequestHandle=window.requestAnimationFrame(this.update),this.updateCanvasSize(!1);let t=e-this._prevAnimationFrameTime;if(this._prevAnimationFrameTime=e,this._debug){let r=t<=0?"--":String(Math.round(1e3/t)).padStart(2,"0");if(this._fpsElement.textContent!==r&&(this._fpsElement.textContent=r),this.mode===Cl){let o=`${this._width}x${this._height}`;this._dimensionElement.textContent!==o&&(this._dimensionElement.textContent=o)}else{let o=`${this._width}x${this._height}|${this.shadowRoot.host.clientWidth}x${this.shadowRoot.host.clientHeight}`;this._dimensionElement.textContent!==o&&(this._dimensionElement.textContent=o)}}let s=this._frameEvent.detail;s.now=e,s.prevTime=this._prevAnimationFrameTime,s.deltaTime=t,this.dispatchEvent(this._frameEvent)}onDelayCanvasResize(){this._resizeTimeoutHandle=null,this.updateCanvasSize(!0)}delayCanvasResize(e,t){(e!==this._resizeCanvasWidth||t!==this._resizeCanvasHeight)&&(this._resizeCanvasWidth=e,this._resizeCanvasHeight=t,this._resizeTimeoutHandle&&window.clearTimeout(this._resizeTimeoutHandle),this._resizeTimeoutHandle=window.setTimeout(this.onDelayCanvasResize,Ff))}updateCanvasSize(e=!0){let t=this.shadowRoot.host.getBoundingClientRect(),n=t.width,s=t.height,r=this._canvasElement,a=this._width,o=this._height,l=this.mode;if(l===Pl||l===Ll)a=n,o=s;else if(l!==Cl&&(n<a||s<o||l===Qr||l==Rl)){let h=n/a,u=s/o;h<u?(a=n,o=o*h):(a=a*u,o=s)}if(a=Math.floor(a),o=Math.floor(o),typeof e>"u"&&(e=r.clientWidth!==a||r.clientHeight!==o),!e){this.delayCanvasResize(a,o);return}let c=Math.min(a/this._width,o/this._height)*.5;if(this._innerElement.style.fontSize=`font-size: ${c}em`,e){l===Rl?(r.width=this._width,r.height=this._height):l!==Pl&&(r.width=a,r.height=o);let h=this._contentElement.style;h.width=`${a}px`,h.height=`${o}px`,(l===Qr||l===Ll)&&(this._width=a,this._height=o);let f=this._resizeEvent.detail;f.width=a,f.height=o,this.dispatchEvent(this._resizeEvent)}}};function ai(i,e){if(Object.prototype.hasOwnProperty.call(i,e)){let t=i[e];delete i[e],i[e]=t}}window.addEventListener("error",Is,!0);window.addEventListener("unhandledrejection",Is,!0);var Dl=!1;function Is(i){Dl||(typeof i=="object"?i instanceof PromiseRejectionEvent?Is(i.reason):i instanceof ErrorEvent?Is(i.error):i instanceof Error?window.alert(i.stack):window.alert(JSON.stringify(i)):window.alert(i),Dl=!0)}var zf=5,Uf=4,kf=3,Bf=2,Hf=1,Vf=0,aw={[zf]:Yi("#7F8C8D"),[Uf]:Yi("#2ECC71"),[kf]:Yi("#4794C8"),[Bf]:Yi("#F39C12"),[Hf]:Yi("#C0392B"),[Vf]:[""]};function Yi(i){return[`background: ${i}`,"border-radius: 0.5em","color: white","font-weight: bold","padding: 2px 0.5em"]}var lw=Symbol("level"),cw=Symbol("domain");var li=0,Nl=class{constructor(e){this._heap=[],this._comparator=e}get size(){return this._heap.length}clear(){this._heap.length=0}push(...e){for(let t of e)this._heap.push(t),this._shiftUp()}pop(){let e=this.peek(),t=Wf(this);return t>li&&this._swap(li,t),this._heap.pop(),this._shiftDown(),e}replace(e){let t=this.peek();return this._heap[li]=e,this._shiftDown(),t}peek(){return this._heap[li]}at(e){return this._heap[e]}indexOf(e,t=void 0){return this._heap.indexOf(e,t)}splice(e,t=void 0){return this._heap.splice(e,t)}_compare(e,t){return this._comparator(this._heap[e],this._heap[t])}_swap(e,t){let n=this._heap[e];this._heap[e]=this._heap[t],this._heap[t]=n}_shiftUp(){let e=this._heap.length-1,t;for(;e>li&&this._compare(e,t=Gf(e));)this._swap(e,t),e=t}_shiftDown(){let e=this._heap.length,t=li,n,s=Ol(t),r=s<e,a=Fl(t),o=a<e;for(;r&&this._compare(s,t)||o&&this._compare(a,t);)n=o&&this._compare(a,s)?a:s,this._swap(t,n),t=n,s=Ol(t),r=s<e,a=Fl(t),o=a<e}values(){return this._heap}[Symbol.iterator](){return this._heap[Symbol.iterator]()}};function Wf(i){return i._heap.length-1}function Gf(i){return(i+1>>>1)-1}function Ol(i){return(i<<1)+1}function Fl(i){return i+1<<1}function eo(i=void 0){return i?(i^Math.random()*16>>i/4).toString(16):([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,eo)}var hw=Math.PI/180,uw=180/Math.PI;function zl(i=window.location.search){return Object.fromEntries(new URLSearchParams(i).entries())}function Ul(i){return i>>16&255}function qf(i){return(i>>16&255)/255}function kl(i){return i>>8&255}function Xf(i){return(i>>8&255)/255}function Bl(i){return i&255}function Yf(i){return(i&255)/255}function $f(i){return i>>24&255}function Kf(i){return(i>>24&255)/255}function Hl(i,e,t,n=1){let s=Math.floor(Math.max(Math.min(i,1),0)*255),r=Math.floor(Math.max(Math.min(e,1),0)*255),a=Math.floor(Math.max(Math.min(t,1),0)*255);return(Math.floor(Math.max(Math.min(n,1),0)*255)&255)<<24|(s&255)<<16|(r&255)<<8|a&255}function Zf(i=0,e=16777215,t=.5){let n=this.redf(i),s=this.greenf(i),r=this.bluef(i),a=this.alphaf(i),o=(this.redf(e)-n)*t+n,l=(this.greenf(e)-s)*t+s,c=(this.bluef(e)-r)*t+r,h=(this.alphaf(e)-a)*t+a;return h<.01&&(h=void 0),Hl(o,l,c,h)}function Jf(i){if(typeof i!="number")return i;let e=Ul(i).toString(16).padStart(2,"0"),t=kl(i).toString(16).padStart(2,"0"),n=Bl(i).toString(16).padStart(2,"0");return`#${e}${t}${n}`}var Ds=Object.freeze({__proto__:null,alpha:$f,alphaf:Kf,blue:Bl,bluef:Yf,green:kl,greenf:Xf,hexf:Hl,mix:Zf,red:Ul,redf:qf,toCSSColor:Jf});var kc=If(xc());var _c={},Od=function(i,e,t,n,s){var r=new Worker(_c[e]||(_c[e]=URL.createObjectURL(new Blob([i+';addEventListener("error",function(e){e=e.error;postMessage({$e$:[e.message,e.code,e.stack]})})'],{type:"text/javascript"}))));return r.onmessage=function(a){var o=a.data,l=o.$e$;if(l){var c=new Error(l[0]);c.code=l[1],c.stack=l[2],s(c,null)}else s(null,o)},r.postMessage(t,n),r},gt=Uint8Array,Sn=Uint16Array,_o=Uint32Array,vo=new gt([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),yo=new gt([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),bc=new gt([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),wc=function(i,e){for(var t=new Sn(31),n=0;n<31;++n)t[n]=e+=1<<i[n-1];for(var s=new _o(t[30]),n=1;n<30;++n)for(var r=t[n];r<t[n+1];++r)s[r]=r-t[n]<<5|n;return[t,s]},Mc=wc(vo,2),bo=Mc[0],Fd=Mc[1];bo[28]=258,Fd[258]=28;var Sc=wc(yo,0),Ec=Sc[0],vw=Sc[1],Gs=new Sn(32768);for(Be=0;Be<32768;++Be)un=(Be&43690)>>>1|(Be&21845)<<1,un=(un&52428)>>>2|(un&13107)<<2,un=(un&61680)>>>4|(un&3855)<<4,Gs[Be]=((un&65280)>>>8|(un&255)<<8)>>>1;var un,Be,hi=function(i,e,t){for(var n=i.length,s=0,r=new Sn(e);s<n;++s)i[s]&&++r[i[s]-1];var a=new Sn(e);for(s=0;s<e;++s)a[s]=a[s-1]+r[s-1]<<1;var o;if(t){o=new Sn(1<<e);var l=15-e;for(s=0;s<n;++s)if(i[s])for(var c=s<<4|i[s],h=e-i[s],u=a[i[s]-1]++<<h,f=u|(1<<h)-1;u<=f;++u)o[Gs[u]>>>l]=c}else for(o=new Sn(n),s=0;s<n;++s)i[s]&&(o[s]=Gs[a[i[s]-1]++]>>>15-i[s]);return o},Zi=new gt(288);for(Be=0;Be<144;++Be)Zi[Be]=8;var Be;for(Be=144;Be<256;++Be)Zi[Be]=9;var Be;for(Be=256;Be<280;++Be)Zi[Be]=7;var Be;for(Be=280;Be<288;++Be)Zi[Be]=8;var Be,Ac=new gt(32);for(Be=0;Be<32;++Be)Ac[Be]=5;var Be;var Tc=hi(Zi,9,1);var Cc=hi(Ac,5,1),Vs=function(i){for(var e=i[0],t=1;t<i.length;++t)i[t]>e&&(e=i[t]);return e},zt=function(i,e,t){var n=e/8|0;return(i[n]|i[n+1]<<8)>>(e&7)&t},Ws=function(i,e){var t=e/8|0;return(i[t]|i[t+1]<<8|i[t+2]<<16)>>(e&7)},Rc=function(i){return(i+7)/8|0},qs=function(i,e,t){(e==null||e<0)&&(e=0),(t==null||t>i.length)&&(t=i.length);var n=new(i.BYTES_PER_ELEMENT==2?Sn:i.BYTES_PER_ELEMENT==4?_o:gt)(t-e);return n.set(i.subarray(e,t)),n};var Lc=["unexpected EOF","invalid block type","invalid length/literal","invalid distance","stream finished","no stream handler",,"no callback","invalid UTF-8 data","extra field too long","date not in range 1980-2099","filename too long","stream finishing","invalid zip data"],St=function(i,e,t){var n=new Error(e||Lc[i]);if(n.code=i,Error.captureStackTrace&&Error.captureStackTrace(n,St),!t)throw n;return n},Pc=function(i,e,t){var n=i.length;if(!n||t&&t.f&&!t.l)return e||new gt(0);var s=!e||t,r=!t||t.i;t||(t={}),e||(e=new gt(n*3));var a=function(N){var we=e.length;if(N>we){var xe=new gt(Math.max(we*2,N));xe.set(e),e=xe}},o=t.f||0,l=t.p||0,c=t.b||0,h=t.l,u=t.d,f=t.m,m=t.n,x=n*8;do{if(!h){o=zt(i,l,1);var p=zt(i,l+1,3);if(l+=3,p)if(p==1)h=Tc,u=Cc,f=9,m=5;else if(p==2){var y=zt(i,l,31)+257,w=zt(i,l+10,15)+4,M=y+zt(i,l+5,31)+1;l+=14;for(var P=new gt(M),F=new gt(19),g=0;g<w;++g)F[bc[g]]=zt(i,l+g*3,7);l+=w*3;for(var S=Vs(F),D=(1<<S)-1,L=hi(F,S,1),g=0;g<M;){var G=L[zt(i,l,D)];l+=G&15;var d=G>>>4;if(d<16)P[g++]=d;else{var O=0,z=0;for(d==16?(z=3+zt(i,l,3),l+=2,O=P[g-1]):d==17?(z=3+zt(i,l,7),l+=3):d==18&&(z=11+zt(i,l,127),l+=7);z--;)P[g++]=O}}var T=P.subarray(0,y),R=P.subarray(y);f=Vs(T),m=Vs(R),h=hi(T,f,1),u=hi(R,m,1)}else St(1);else{var d=Rc(l)+4,v=i[d-4]|i[d-3]<<8,A=d+v;if(A>n){r&&St(0);break}s&&a(c+v),e.set(i.subarray(d,A),c),t.b=c+=v,t.p=l=A*8,t.f=o;continue}if(l>x){r&&St(0);break}}s&&a(c+131072);for(var j=(1<<f)-1,V=(1<<m)-1,Q=l;;Q=l){var O=h[Ws(i,l)&j],Z=O>>>4;if(l+=O&15,l>x){r&&St(0);break}if(O||St(2),Z<256)e[c++]=Z;else if(Z==256){Q=l,h=null;break}else{var ue=Z-254;if(Z>264){var g=Z-257,B=vo[g];ue=zt(i,l,(1<<B)-1)+bo[g],l+=B}var ee=u[Ws(i,l)&V],re=ee>>>4;ee||St(3),l+=ee&15;var R=Ec[re];if(re>3){var B=yo[re];R+=Ws(i,l)&(1<<B)-1,l+=B}if(l>x){r&&St(0);break}s&&a(c+131072);for(var se=c+ue;c<se;c+=4)e[c]=e[c-R],e[c+1]=e[c+1-R],e[c+2]=e[c+2-R],e[c+3]=e[c+3-R];c=se}}t.l=h,t.p=Q,t.b=c,t.f=o,h&&(o=1,t.m=f,t.d=u,t.n=m)}while(!o);return c==e.length?e:qs(e,0,c)};var zd=new gt(0);var Ud=function(i,e){var t={};for(var n in i)t[n]=i[n];for(var n in e)t[n]=e[n];return t},vc=function(i,e,t){for(var n=i(),s=i.toString(),r=s.slice(s.indexOf("[")+1,s.lastIndexOf("]")).replace(/\s+/g,"").split(","),a=0;a<n.length;++a){var o=n[a],l=r[a];if(typeof o=="function"){e+=";"+l+"=";var c=o.toString();if(o.prototype)if(c.indexOf("[native code]")!=-1){var h=c.indexOf(" ",8)+1;e+=c.slice(h,c.indexOf("(",h))}else{e+=c;for(var u in o.prototype)e+=";"+l+".prototype."+u+"="+o.prototype[u].toString()}else e+=c}else t[l]=o}return[e,t]},Hs=[],kd=function(i){var e=[];for(var t in i)i[t].buffer&&e.push((i[t]=new i[t].constructor(i[t])).buffer);return e},Bd=function(i,e,t,n){var s;if(!Hs[t]){for(var r="",a={},o=i.length-1,l=0;l<o;++l)s=vc(i[l],r,a),r=s[0],a=s[1];Hs[t]=vc(i[o],r,a)}var c=Ud({},Hs[t][1]);return Od(Hs[t][0]+";onmessage=function(e){for(var k in e.data)self[k]=e.data[k];onmessage="+e.toString()+"}",t,c,kd(c),n)},Hd=function(){return[gt,Sn,_o,vo,yo,bc,bo,Ec,Tc,Cc,Gs,Lc,hi,Vs,zt,Ws,Rc,qs,St,Pc,wo,Ic,Dc]};var Ic=function(i){return postMessage(i,[i.buffer])},Dc=function(i){return i&&i.size&&new gt(i.size)},Vd=function(i,e,t,n,s,r){var a=Bd(t,n,s,function(o,l){a.terminate(),r(o,l)});return a.postMessage([i,e],e.consume?[i.buffer]:[]),function(){a.terminate()}};var tn=function(i,e){return i[e]|i[e+1]<<8},Ht=function(i,e){return(i[e]|i[e+1]<<8|i[e+2]<<16|i[e+3]<<24)>>>0},go=function(i,e){return Ht(i,e)+Ht(i,e+4)*4294967296};function Wd(i,e,t){return t||(t=e,e={}),typeof t!="function"&&St(7),Vd(i,e,[Hd],function(n){return Ic(wo(n.data[0],Dc(n.data[1])))},1,t)}function wo(i,e){return Pc(i,e)}var xo=typeof TextDecoder<"u"&&new TextDecoder,Gd=0;try{xo.decode(zd,{stream:!0}),Gd=1}catch{}var qd=function(i){for(var e="",t=0;;){var n=i[t++],s=(n>127)+(n>223)+(n>239);if(t+s>i.length)return[e,qs(i,t-1)];s?s==3?(n=((n&15)<<18|(i[t++]&63)<<12|(i[t++]&63)<<6|i[t++]&63)-65536,e+=String.fromCharCode(55296|n>>10,56320|n&1023)):s&1?e+=String.fromCharCode((n&31)<<6|i[t++]&63):e+=String.fromCharCode((n&15)<<12|(i[t++]&63)<<6|i[t++]&63):e+=String.fromCharCode(n)}};function Xd(i,e){if(e){for(var t="",n=0;n<i.length;n+=16384)t+=String.fromCharCode.apply(null,i.subarray(n,n+16384));return t}else{if(xo)return xo.decode(i);var s=qd(i),r=s[0],a=s[1];return a.length&&St(8),r}}var Yd=function(i,e){return e+30+tn(i,e+26)+tn(i,e+28)},$d=function(i,e,t){var n=tn(i,e+28),s=Xd(i.subarray(e+46,e+46+n),!(tn(i,e+8)&2048)),r=e+46+n,a=Ht(i,e+20),o=t&&a==4294967295?Kd(i,r):[a,Ht(i,e+24),Ht(i,e+42)],l=o[0],c=o[1],h=o[2];return[tn(i,e+10),l,c,s,r+tn(i,e+30)+tn(i,e+32),h]},Kd=function(i,e){for(;tn(i,e)!=1;e+=4+tn(i,e+2));return[go(i,e+12),go(i,e+4),go(i,e+20)]};var yc=typeof queueMicrotask=="function"?queueMicrotask:typeof setTimeout=="function"?setTimeout:function(i){i()};function Nc(i,e,t){t||(t=e,e={}),typeof t!="function"&&St(7);var n=[],s=function(){for(var d=0;d<n.length;++d)n[d]()},r={},a=function(d,v){yc(function(){t(d,v)})};yc(function(){a=t});for(var o=i.length-22;Ht(i,o)!=101010256;--o)if(!o||i.length-o>65558)return a(St(13,0,1),null),s;var l=tn(i,o+8);if(l){var c=l,h=Ht(i,o+16),u=h==4294967295||c==65535;if(u){var f=Ht(i,o-12);u=Ht(i,f)==101075792,u&&(c=l=Ht(i,f+32),h=Ht(i,f+48))}for(var m=e&&e.filter,x=function(d){var v=$d(i,h,u),A=v[0],y=v[1],w=v[2],M=v[3],P=v[4],F=v[5],g=Yd(i,F);h=P;var S=function(L,G){L?(s(),a(L,null)):(G&&(r[M]=G),--l||a(null,r))};if(!m||m({name:M,size:y,originalSize:w,compression:A}))if(!A)S(null,qs(i,g,g+y));else if(A==8){var D=i.subarray(g,g+y);if(y<32e4)try{S(null,wo(D,new gt(w)))}catch(L){S(L,null)}else n.push(Wd(D,{size:w},S))}else S(St(14,"unknown compression type "+A,1),null);else S(null,null)},p=0;p<c;++p)x(p)}else a(null,{});return s}var ui=class{constructor(e){let t;typeof e=="object"&&e instanceof ui?t=e.source:t=String(e),this.source=t,this._re=(0,kc.makeRe)(t)}test(e){return this._re.test(e)}},Zd=/^([_\w\d]+)\:\/\//;async function Oc(i,e,t,n,s,r){let{loadings:a}=i,o;e in a?o=a[e]:(o=new Hn(r),a[e]=o);let l=Hn.nextAttempt(o),c=[o.promise];return Zd.test(t)?c.push(Bc(i,t,r).then(h=>n(h,s)).then(h=>Hn.isCurrentAttempt(o,l)?Ji(i,e,h):void 0)):c.push(n(t).then(h=>Hn.isCurrentAttempt(o,l)?Ji(i,e,h):void 0)),await Promise.race(c)}function Ji(i,e,t){let{store:n,loadings:s}=i;return n[e]=t,e in s&&(s[e].resolve(t),delete s[e]),t}function Jd(i,e,t){let{defaults:n}=i;typeof e=="string"&&(e=new ui(e));let s=`__default://[${n.length}]`;return Ji(i,s,t),n.push(new Mo(e,s)),t}function jd(i,e){let{store:t,loadings:n}=i;e in n&&(n[e].reject(new Error("Stop loading to delete asset.")),delete n[e]),e in t&&delete t[e]}function Qd(i,e){typeof e=="string"&&(e=new ui(e));let{store:t,loadings:n}=i;for(let[s,r]of Object.entries(n))e.test(s)&&(r.reject(new Error(`Stop loading to clear assets matching ${e}`)),delete n[s]);for(let s of Object.keys(t))e.test(s)&&delete t[s]}function ep(i){let{store:e,loadings:t,defaults:n}=i;for(let[s,r]of Object.entries(t))r.reject(new Error("Stop loading to clear all assets.")),delete t[s];for(let s of Object.keys(e))delete e[s];n.length=0}function tp(i,e){let{loadings:t}=i;return e in t?t[e].promise:null}async function Bc(i,e,t){let{store:n,loadings:s}=i;if(e in n)return n[e];if(e in s)return s[e].promise;{let r=new Hn(t);return s[e]=r,r.promise}}function np(i,e){let{defaults:t}=i;for(let n of t)if(n.glob.test(e))return Xs(i,n.uri);return null}function Xs(i,e){return i.store[e]}function ip(i,e){return!!i.store[e]}function sp(i){return Object.keys(i.store)}function Fc(i,e){return e in i.store}function zc(i,e){return e in i.loadings}var Mo=class{constructor(e,t){this.glob=e,this.uri=t}},Hn=class{static nextAttempt(e){return++e._promiseHandle}static isCurrentAttempt(e,t){return e._promiseHandle===t}constructor(e){this._promiseHandle=0,this._resolve=null,this._reject=null,this._reason=null,this._value=null,this._timeoutHandle=Number.isFinite(e)&&e>0?setTimeout(()=>{this.reject(`Asset loading exceeded timeout of ${e} ms.`)},e):null,this._promise=new Promise((t,n)=>{this._value?t(this._value):this._resolve=t,this._reason?n(this._reason):this._reject=n})}get promise(){return this._promise}resolve(e){this._timeoutHandle&&(clearTimeout(this._timeoutHandle),this._timeoutHandle=null),this._resolve?this._resolve(e):this._value=e}reject(e){this._timeoutHandle&&(clearTimeout(this._timeoutHandle),this._timeoutHandle=null),this._reject?this._reject(e):this._reason=e}},Ys=class{constructor(e=null){this.parent=e,this.store={},this.loadings={},this.defaults=[]}get(e){let t=this;if(Fc(t,e))return Xs(t,e);let n=np(t,e);return n||null}async resolve(e,t,n,s,r){return this.get(e)||await this.load(e,t,n,s,r)}fallback(e,t){return Jd(this,e,t)}cache(e,t){return Ji(this,e,t)}async load(e,t,n,s,r){let a=this;return Fc(a,e)?Xs(a,e):zc(a,e)?await Bc(a,e,r):await Oc(a,e,t,n,s,r)}async reload(e,t,n,s,r){return await Oc(this,e,t,n,s,r)}unload(e){jd(this,e)}clear(e){Qd(this,e)}current(e){return Xs(this,e)}exists(e){return ip(this,e)}loading(e){let t=this;return zc(t,e)?tp(t,e):null}keys(){return sp(this)}reset(){ep(this)}},Uc=5e3,En=class{constructor(e,t,n=void 0,s=e,r=null){this.uri=e,this.loader=t,this.opts=n,this.initial=r,this.filepath=s,this.source=null,this.current=null}cache(e,t){return e.cache(this.uri,t),this.source=e,this.current=t,this}get(e){let t;return e.exists(this.uri)?t=e.current(this.uri):this.initial&&this.initial instanceof En?t=this.initial.get(e):t=this.initial,this.source=e,this.current=t,t}async load(e,t=Uc){let n;if(e.exists(this.uri))n=e.current(this.uri);else if(n=await e.load(this.uri,this.filepath,this.loader,this.opts,t),!n)if(this.initial&&this.initial instanceof En){let s=this.initial;n=await e.load(s.uri,s.filepath,s.loader,s.opts,t)}else n=this.initial;return this.source=e,this.current=n,n}async reload(e,t=Uc){let n=await e.reload(this.uri,this.filepath,this.loader,this.opts,t);return this.source=e,this.current=n,n}};async function Hc(i,e,t=void 0){let n=i,s="raw://",a=await(await fetch(e)).arrayBuffer();await new Promise((o,l)=>{Nc(new Uint8Array(a),(c,h)=>{if(c)l(c);else{for(let[u,f]of Object.entries(h)){u=u.replaceAll("\\","/");let m=u.indexOf("/");m>=0&&(u=u.substring(m+1));let x=s+u;Ji(n,x,f),t&&t(f,x,u)}o()}})})}async function Vc(i,e,t=5e3){let n=[];for(let s of e)n.push(s.load(i,t));await Promise.allSettled(n)}async function So(i,e=void 0){let{imageType:t=void 0}=e||{};if(typeof i=="string"){let l=await(await fetch(i)).arrayBuffer();if(typeof t>"u"){let c=i.lastIndexOf(".");if(c<0)throw new Error("Cannot load from url - unknown image type.");t="image/"+i.slice(c+1)}return So(l,{...e,imageType:t})}else if(!(i instanceof ArrayBuffer||ArrayBuffer.isView(i)))throw new Error("Cannot load from source - must be an array buffer or fetchable url");let n=i;typeof t>"u"&&(t="image/png");let s=new Blob([n],{type:t}),r=URL.createObjectURL(s),a=new Image;return new Promise((o,l)=>{a.addEventListener("load",()=>{o(a)}),a.addEventListener("error",c=>{l(c)}),a.src=r})}var $s=class{get polling(){return performance.now()-this._lastPollingTime<1e3}get value(){return 0}get size(){return this._size}constructor(e){this._size=e,this._lastPollingTime=Number.MIN_SAFE_INTEGER}resize(e){this._size=e}getState(e){throw new Error("Missing implementation.")}onUpdate(e,t,n){throw new Error("Missing implementation.")}onStatus(e,t){throw new Error("Missing implementation.")}onPoll(e){this._lastPollingTime=e}onBind(e,t=void 0){e>=this._size&&this.resize(e+1)}onUnbind(){this.resize(0)}},fi=class extends $s{static createAxisBindingState(){return{value:0,delta:0,inverted:!1}}get delta(){return this._delta}get value(){return this._value}constructor(e=0){super(e);let t=new Array,n=this.constructor;for(let s=0;s<e;++s)t.push(n.createAxisBindingState());this._state=t,this._value=0,this._delta=0}resize(e){let t=this._state,n=t.length,s;if(e<=n)s=t.slice(0,e);else{s=t;let r=this.constructor;for(let a=n;a<e;++a)s.push(r.createAxisBindingState())}this._state=s,super.resize(e)}getState(e){return this._state[e].value}onPoll(e){let t=this._state,n=0,s=0,r=t.length;for(let a=0;a<r;++a){let o=t[a];n+=o.value*(o.inverted?-1:1),s+=o.delta,t[a].delta=0}this._value=n,this._delta=s,super.onPoll(e)}onUpdate(e,t,n){typeof t>"u"?this.onAxisChange(e,n):this.onAxisMove(e,t,n)}onStatus(e,t){this.onAxisStatus(e,t)}onBind(e,t=void 0){super.onBind(e,t);let{inverted:n=!1}=t||{},s=this._state;s[e].inverted=n}onAxisMove(e,t,n){let s=this._state[e];s.value=t,s.delta+=n}onAxisChange(e,t){let n=this._state[e];n.value+=t,n.delta+=t}onAxisStatus(e,t){let n=this._state[e],s=n.value;n.value=t,n.delta=t-s}},rp=241,Wc=254,op=239,Vn=1,Eo=2,Ao=4,To=8,Co=16,ji=class extends $s{get pressed(){return this._pressed}get repeated(){return this._repeated}get released(){return this._released}get down(){return this._down}get value(){return this._value}constructor(e=0){super(e),this._state=new Uint8Array(e),this._value=0,this._down=!1,this._pressed=!1,this._repeated=!1,this._released=!1}resize(e){let t=this._state,n=t.length,s;e<=n?s=t.slice(0,e):(s=new Uint8Array(e),s.set(t)),this._state=s,super.resize(e)}getState(e){let t=this._state[e],n=t&Co?-1:1;return(t&Vn?1:0)*n}onPoll(e){let t=this._state,n=0,s=0,r=0,a=0,o=0,l=t.length;for(let c=0;c<l;++c){let h=t[c],u=h&Vn,f=h&Co;s|=u,r|=h&Eo,a|=h&Ao,o|=h&To,n+=(u?1:0)*(f?-1:1),t[c]&=rp}this._value=n,this._down=s!==0,this._pressed=r!==0,this._repeated=a!==0,this._released=o!==0,super.onPoll(e)}onUpdate(e,t,n){n>0?this.onButtonPressed(e):this.onButtonReleased(e)}onStatus(e,t){this.onButtonStatus(e,t!==0)}onBind(e,t={inverted:!1}){super.onBind(e,t);let{inverted:n=!1}=t,s=this._state;n?s[e]|=Co:s[e]&=op}onButtonPressed(e){let t=this._state,n=t[e];n&Vn||(n|=Eo,n|=Vn),n|=Ao,t[e]=n}onButtonReleased(e){let t=this._state,n=t[e];n&Vn&&(n|=To,n&=Wc),t[e]=n}onButtonStatus(e,t){let n=this._state,s=n[e],r=!!(s&Vn);t?s|=Vn:s&=Wc,r&&!t&&(s|=To),!r&&t&&(s|=Eo,s|=Ao),n[e]=s}},ce=class{static parse(e){e=e.trim();let t=e.indexOf(".");if(t<0)throw new Error("Missing device separator for key code.");let n=e.substring(0,t);if(n.length<0)throw new Error("Missing device for key code.");let s=e.substring(t+1);if(s.length<0)throw new Error("Missing code for key code.");return new ce(n,s)}constructor(e,t){this.device=e,this.code=t}toString(){return`${this.device}.${this.code}`}};function Gc(i,e){return new ce(i,e)}function ap(i){return"device"in i&&"code"in i}var _e="Keyboard",Wt="Mouse",lp=new ce(_e,"KeyA"),cp=new ce(_e,"KeyB"),hp=new ce(_e,"KeyC"),up=new ce(_e,"KeyD"),fp=new ce(_e,"KeyE"),dp=new ce(_e,"KeyF"),pp=new ce(_e,"KeyG"),mp=new ce(_e,"KeyH"),gp=new ce(_e,"KeyI"),xp=new ce(_e,"KeyJ"),_p=new ce(_e,"KeyK"),vp=new ce(_e,"KeyL"),yp=new ce(_e,"KeyM"),bp=new ce(_e,"KeyN"),wp=new ce(_e,"KeyO"),Mp=new ce(_e,"KeyP"),Sp=new ce(_e,"KeyQ"),Ep=new ce(_e,"KeyR"),Ap=new ce(_e,"KeyS"),Tp=new ce(_e,"KeyT"),Cp=new ce(_e,"KeyU"),Rp=new ce(_e,"KeyV"),Lp=new ce(_e,"KeyW"),Pp=new ce(_e,"KeyX"),Ip=new ce(_e,"KeyY"),Dp=new ce(_e,"KeyZ"),Np=new ce(_e,"Digit0"),Op=new ce(_e,"Digit1"),Fp=new ce(_e,"Digit2"),zp=new ce(_e,"Digit3"),Up=new ce(_e,"Digit4"),kp=new ce(_e,"Digit5"),Bp=new ce(_e,"Digit6"),Hp=new ce(_e,"Digit7"),Vp=new ce(_e,"Digit8"),Wp=new ce(_e,"Digit9"),Gp=new ce(_e,"Minus"),qp=new ce(_e,"Equal"),Xp=new ce(_e,"BracketLeft"),Yp=new ce(_e,"BracketRight"),$p=new ce(_e,"Semicolon"),Kp=new ce(_e,"Quote"),Zp=new ce(_e,"Backquote"),Jp=new ce(_e,"Backslash"),jp=new ce(_e,"Comma"),Qp=new ce(_e,"Period"),em=new ce(_e,"Slash"),tm=new ce(_e,"Escape"),nm=new ce(_e,"Space"),im=new ce(_e,"CapsLock"),sm=new ce(_e,"Backspace"),rm=new ce(_e,"Delete"),om=new ce(_e,"Tab"),am=new ce(_e,"Enter"),lm=new ce(_e,"ArrowUp"),cm=new ce(_e,"ArrowDown"),hm=new ce(_e,"ArrowLeft"),um=new ce(_e,"ArrowRight"),fm=new ce(Wt,"Button0"),dm=new ce(Wt,"Button1"),pm=new ce(Wt,"Button2"),mm=new ce(Wt,"Button3"),gm=new ce(Wt,"Button4"),xm=new ce(Wt,"PosX"),_m=new ce(Wt,"PosY"),vm=new ce(Wt,"WheelX"),ym=new ce(Wt,"WheelY"),bm=new ce(Wt,"WheelZ"),ze=Object.freeze({__proto__:null,ARROW_DOWN:cm,ARROW_LEFT:hm,ARROW_RIGHT:um,ARROW_UP:lm,BACKQUOTE:Zp,BACKSLASH:Jp,BACKSPACE:sm,BRACKET_LEFT:Xp,BRACKET_RIGHT:Yp,CAPS_LOCK:im,COMMA:jp,DELETE:rm,DIGIT_0:Np,DIGIT_1:Op,DIGIT_2:Fp,DIGIT_3:zp,DIGIT_4:Up,DIGIT_5:kp,DIGIT_6:Bp,DIGIT_7:Hp,DIGIT_8:Vp,DIGIT_9:Wp,ENTER:am,EQUAL:qp,ESCAPE:tm,KEYBOARD:_e,KEY_A:lp,KEY_B:cp,KEY_C:hp,KEY_D:up,KEY_E:fp,KEY_F:dp,KEY_G:pp,KEY_H:mp,KEY_I:gp,KEY_J:xp,KEY_K:_p,KEY_L:vp,KEY_M:yp,KEY_N:bp,KEY_O:wp,KEY_P:Mp,KEY_Q:Sp,KEY_R:Ep,KEY_S:Ap,KEY_T:Tp,KEY_U:Cp,KEY_V:Rp,KEY_W:Lp,KEY_X:Pp,KEY_Y:Ip,KEY_Z:Dp,MINUS:Gp,MOUSE:Wt,MOUSE_BUTTON_0:fm,MOUSE_BUTTON_1:dm,MOUSE_BUTTON_2:pm,MOUSE_BUTTON_3:mm,MOUSE_BUTTON_4:gm,MOUSE_POS_X:xm,MOUSE_POS_Y:_m,MOUSE_WHEEL_X:vm,MOUSE_WHEEL_Y:ym,MOUSE_WHEEL_Z:bm,PERIOD:Qp,QUOTE:Kp,SEMICOLON:$p,SLASH:em,SPACE:nm,TAB:om,from:Gc,isKeyCode:ap}),Po=class{get polling(){return this.ref?this.ref.polling:!1}get value(){return!this.ref||this.disabled?0:this.ref.value}constructor(e){this.name=e,this.ref=null,this.disabled=!1}bindTo(e){throw new Error("Unsupported operation.")}disable(e=!0){return this.disabled=e,this}getState(e){return!this.ref||this.disabled?0:this.ref.getState(e)}};function wm(i){Array.isArray(i)||(i=[i]);let e=[];for(let t of i){let n;try{n=ce.parse(t)}catch(s){let r=Mm(t).toUpperCase();if(!(r in ze))throw new Error("Invalid key code string - "+s);n=ze[r]}e.push(n)}return e}function Mm(i){return i.replace(/([a-z]|(?:[A-Z0-9]+))([A-Z0-9]|$)/g,function(e,t,n){return t+(n&&"_"+n)}).toLowerCase()}var Xe=class extends Po{static fromBind(e,t,n,s=void 0){return new Xe(e,Gc(t,n),s)}static fromString(e,...t){let n=wm(t);return new Xe(e,n)}get pressed(){return!this.ref||this.disabled?!1:this.ref.pressed}get repeated(){return!this.ref||this.disabled?!1:this.ref.repeated}get released(){return!this.ref||this.disabled?!1:this.ref.released}get down(){return!this.ref||this.disabled?!1:this.ref.down}constructor(e,t,n=void 0){super(e),this.keyCodes=Array.isArray(t)?t:[t],this.opts=n}bindTo(e){let t=this.name,n=this.opts;for(let s of this.keyCodes)e.bindButton(t,s.device,s.code,n);return this.ref=e.getButton(t),this}};var Ks=class{static isAxis(e){return!1}static isButton(e){return!1}constructor(e,t){if(!t)throw new Error(`Missing event target for device ${e}.`);this.name=e,this.eventTarget=t,this.listeners={input:[]}}setEventTarget(e){if(!e)throw new Error(`Missing event target for device ${this.name}.`);this.eventTarget=e}destroy(){let e=this.listeners;for(let t in e)e[t].length=0}addEventListener(e,t){let n=this.listeners;e in n?n[e].push(t):n[e]=[t]}removeEventListener(e,t){let n=this.listeners;if(e in n){let s=n[e],r=s.indexOf(t);r>=0&&s.splice(r,1)}}dispatchInputEvent(e){let t=0;for(let n of this.listeners.input)t|=n(e);return!!t}},Io=class extends Ks{static isAxis(e){return!1}static isButton(e){return!0}constructor(e,t,n={}){super(e,t);let{ignoreRepeat:s=!0}=n;this.ignoreRepeat=s,this._eventObject={target:t,device:e,code:"",event:"",value:0,control:!1,shift:!1,alt:!1},this.onKeyDown=this.onKeyDown.bind(this),this.onKeyUp=this.onKeyUp.bind(this),t.addEventListener("keydown",this.onKeyDown),t.addEventListener("keyup",this.onKeyUp)}setEventTarget(e){this.eventTarget&&this.destroy(),super.setEventTarget(e),e.addEventListener("keydown",this.onKeyDown),e.addEventListener("keyup",this.onKeyUp)}destroy(){let e=this.eventTarget;e.removeEventListener("keydown",this.onKeyDown),e.removeEventListener("keyup",this.onKeyUp),super.destroy()}onKeyDown(e){if(e.repeat&&this.ignoreRepeat)return e.preventDefault(),e.stopPropagation(),!1;let t=this._eventObject;if(t.code=e.code,t.event="pressed",t.value=1,t.control=e.ctrlKey,t.shift=e.shiftKey,t.alt=e.altKey,this.dispatchInputEvent(t))return e.preventDefault(),e.stopPropagation(),!1}onKeyUp(e){let t=this._eventObject;if(t.code=e.code,t.event="released",t.value=1,t.control=e.ctrlKey,t.shift=e.shiftKey,t.alt=e.altKey,this.dispatchInputEvent(t))return e.preventDefault(),e.stopPropagation(),!1}},Ro=10,Lo=100,Do=class extends Ks{static isAxis(e){return e==="PosX"||e==="PosY"||e==="WheelX"||e==="WheelY"||e==="WheelZ"}static isButton(e){return!this.isAxis(e)}constructor(e,t,n={}){super(e,t);let{eventsOnFocus:s=!0}=n;this.eventsOnFocus=s,this.canvasTarget=this.getCanvasFromEventTarget(t),this._downHasFocus=!1,this._eventObject={target:t,device:e,code:"",event:"",value:0,control:!1,shift:!1,alt:!1},this._positionObject={target:t,device:e,code:"",event:"move",value:0,movement:0},this._wheelObject={target:t,device:e,code:"",event:"wheel",movement:0},this.onMouseDown=this.onMouseDown.bind(this),this.onMouseUp=this.onMouseUp.bind(this),this.onMouseMove=this.onMouseMove.bind(this),this.onContextMenu=this.onContextMenu.bind(this),this.onWheel=this.onWheel.bind(this),t.addEventListener("mousedown",this.onMouseDown),t.addEventListener("contextmenu",this.onContextMenu),t.addEventListener("wheel",this.onWheel),document.addEventListener("mousemove",this.onMouseMove),document.addEventListener("mouseup",this.onMouseUp)}setEventTarget(e){this.eventTarget&&this.destroy(),super.setEventTarget(e),this.canvasTarget=this.getCanvasFromEventTarget(e),e.addEventListener("mousedown",this.onMouseDown),e.addEventListener("contextmenu",this.onContextMenu),e.addEventListener("wheel",this.onWheel),document.addEventListener("mousemove",this.onMouseMove),document.addEventListener("mouseup",this.onMouseUp)}destroy(){let e=this.eventTarget;e.removeEventListener("mousedown",this.onMouseDown),e.removeEventListener("contextmenu",this.onContextMenu),e.removeEventListener("wheel",this.onWheel),document.removeEventListener("mousemove",this.onMouseMove),document.removeEventListener("mouseup",this.onMouseUp),super.destroy()}setPointerLock(e=!0){e?this.eventTarget.requestPointerLock():this.eventTarget.exitPointerLock()}hasPointerLock(){return document.pointerLockElement===this.eventTarget}onMouseDown(e){this._downHasFocus=!0;let t=this._eventObject;if(t.code="Button"+e.button,t.event="pressed",t.value=1,t.control=e.ctrlKey,t.shift=e.shiftKey,t.alt=e.altKey,this.dispatchInputEvent(t)&&document.activeElement===this.eventTarget)return e.preventDefault(),e.stopPropagation(),!1}onContextMenu(e){return e.preventDefault(),e.stopPropagation(),!1}onWheel(e){let t,n,s;switch(e.deltaMode){case WheelEvent.DOM_DELTA_LINE:t=e.deltaX*Ro,n=e.deltaY*Ro,s=e.deltaZ*Ro;break;case WheelEvent.DOM_DELTA_PAGE:t=e.deltaX*Lo,n=e.deltaY*Lo,s=e.deltaZ*Lo;break;case WheelEvent.DOM_DELTA_PIXEL:default:t=e.deltaX,n=e.deltaY,s=e.deltaZ;break}let r=0,a=this._wheelObject;if(a.code="WheelX",a.movement=t,r|=this.dispatchInputEvent(a),a.code="WheelY",a.movement=n,r|=this.dispatchInputEvent(a),a.code="WheelZ",a.movement=s,r|=this.dispatchInputEvent(a),r)return e.preventDefault(),e.stopPropagation(),!1}onMouseUp(e){if(!this._downHasFocus)return;this._downHasFocus=!1;let t=this._eventObject;if(t.code="Button"+e.button,t.event="released",t.value=1,t.control=e.ctrlKey,t.shift=e.shiftKey,t.alt=e.altKey,this.dispatchInputEvent(t))return e.preventDefault(),e.stopPropagation(),!1}onMouseMove(e){if(this.eventsOnFocus&&document.activeElement!==this.eventTarget)return;let t=this.canvasTarget,{clientWidth:n,clientHeight:s}=t,r=t.getBoundingClientRect(),a=e.movementX/n,o=e.movementY/s,l=(e.clientX-r.left)/n,c=(e.clientY-r.top)/s,h=this._positionObject;h.code="PosX",h.value=l,h.movement=a,this.dispatchInputEvent(h),h.code="PosY",h.value=c,h.movement=o,this.dispatchInputEvent(h)}getCanvasFromEventTarget(e){return e instanceof HTMLCanvasElement?e:e.canvas||e.querySelector("canvas")||e.shadowRoot&&e.shadowRoot.querySelector("canvas")||e}},Sm=`<kbd>
  <span id="name"><slot></slot></span>
  <span id="value" class="hidden"></span>
</kbd>
`,Em=`kbd {
  position: relative;
  display: inline-block;
  border-radius: 3px;
  border: 1px solid #888888;
  font-size: 0.85em;
  font-weight: 700;
  text-rendering: optimizeLegibility;
  line-height: 12px;
  height: 14px;
  padding: 2px 4px;
  color: #444444;
  background-color: #eeeeee;
  box-shadow: inset 0 -3px 0 #aaaaaa;
  overflow: hidden;
}

kbd:empty::after {
  content: '<?>';
  opacity: 0.6;
}

.disabled {
  opacity: 0.6;
  box-shadow: none;
  background-color: #aaaaaa;
}

.hidden {
  display: none;
}

#value {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  font-size: 0.85em;
  padding: 0 4px;
  padding-top: 2px;
  color: #cccccc;
  background-color: #333333;
  box-shadow: inset 0 3px 0 #222222;
}
`,Zs=class extends HTMLElement{static get[Symbol.for("templateNode")](){let e=document.createElement("template");return e.innerHTML=Sm,Object.defineProperty(this,Symbol.for("templateNode"),{value:e}),e}static get[Symbol.for("styleNode")](){let e=document.createElement("style");return e.innerHTML=Em,Object.defineProperty(this,Symbol.for("styleNode"),{value:e}),e}static define(e=window.customElements){e.define("input-code",this)}static get observedAttributes(){return["name","value","disabled"]}get disabled(){return this._disabled}set disabled(e){this.toggleAttribute("disabled",e)}get value(){return this._value}set value(e){this.setAttribute("value",e)}get name(){return this._name}set name(e){this.setAttribute("name",e)}constructor(){super();let e=this.constructor,t=this.attachShadow({mode:"open"});t.appendChild(e[Symbol.for("templateNode")].content.cloneNode(!0)),t.appendChild(e[Symbol.for("styleNode")].cloneNode(!0)),this._name="",this._value="",this._disabled=!1,this._kbdElement=t.querySelector("kbd"),this._nameElement=t.querySelector("#name"),this._valueElement=t.querySelector("#value")}attributeChangedCallback(e,t,n){switch(e){case"name":this._name=n,this._nameElement.textContent=n;break;case"value":this._value=n,n!==null?(this._valueElement.classList.toggle("hidden",!1),this._valueElement.textContent=n,this._kbdElement.style.paddingRight=`${this._valueElement.clientWidth+4}px`):this._valueElement.classList.toggle("hidden",!0);break;case"disabled":this._disabled=n!==null,this._kbdElement.classList.toggle("disabled",n!==null);break}}connectedCallback(){if(Object.prototype.hasOwnProperty.call(this,"name")){let e=this.name;delete this.name,this.name=e}if(Object.prototype.hasOwnProperty.call(this,"value")){let e=this.value;delete this.value,this.value=e}if(Object.prototype.hasOwnProperty.call(this,"disabled")){let e=this.disabled;delete this.disabled,this.disabled=e}}};Zs.define();var Am=`<table>
  <thead>
    <tr class="tableHeader">
      <th colspan="3">
        <span class="tableTitle">
          <label id="title"> input-source </label>
          <span id="slotContainer">
            <slot></slot>
          </span>
          <p>
            <label for="poll">poll</label>
            <output id="poll"></output>
          </p>
          <p>
            <label for="focus">focus</label>
            <output id="focus"></output>
          </p>
        </span>
      </th>
    </tr>
    <tr class="colHeader">
      <th>name</th>
      <th>value</th>
      <th>key</th>
    </tr>
  </thead>
  <tbody></tbody>
</table>
`,Tm=`:host {
  display: block;
}

table {
  border-collapse: collapse;
  font-family: monospace;
}

table,
th,
td {
  border: 1px solid #666666;
}

th,
td {
  padding: 5px 10px;
}

td {
  text-align: center;
}

thead th {
  padding: 0;
}

.colHeader > th {
  font-size: 0.8em;
  padding: 0 10px;
  letter-spacing: 3px;
  background-color: #aaaaaa;
  color: #666666;
}

tbody output {
  border-radius: 0.3em;
  padding: 3px;
}

tr:not(.primary) .name,
tr:not(.primary) .value {
  opacity: 0.3;
}

tr:nth-child(2n) {
  background-color: #eeeeee;
}

.tableHeader {
  color: #666666;
}

.tableTitle {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 4px;
}

#slotContainer {
  flex: 1;
}

p {
  display: inline;
  margin: 0;
  padding: 0;
  padding-right: 10px;
}

#poll:empty::after,
#focus:empty::after {
  content: '\u2717';
  color: #ff0000;
}
`,No=class{constructor(e){this.onAnimationFrame=this.onAnimationFrame.bind(this),this.animationFrameHandle=null,this.pollable=e}get running(){return this.animationFrameHandle!==null}start(){let e=this.animationFrameHandle;e&&cancelAnimationFrame(e),this.animationFrameHandle=requestAnimationFrame(this.onAnimationFrame)}stop(){let e=this.animationFrameHandle;e&&cancelAnimationFrame(e),this.animationFrameHandle=null}onAnimationFrame(e){this.animationFrameHandle=requestAnimationFrame(this.onAnimationFrame),this.pollable.onPoll(e)}},Oo=class{constructor(e){this.onInput=this.onInput.bind(this),this.onPoll=this.onPoll.bind(this),this.bindings=e}onPoll(e){for(let t of this.bindings.getInputs())t.onPoll(e)}onInput(e){let{device:t,code:n,event:s,value:r,movement:a,control:o,shift:l,alt:c}=e,h=this.bindings.getBindings(t,n);switch(s){case"pressed":for(let{input:u,index:f}of h)u.onUpdate(f,1,1);break;case"released":for(let{input:u,index:f}of h)u.onUpdate(f,0,-1);break;case"move":for(let{input:u,index:f}of h)u.onUpdate(f,r,a);break;case"wheel":for(let{input:u,index:f}of h)u.onUpdate(f,void 0,a);break}return h.length>0}},Js=class{constructor(e,t,n,s){this.device=e,this.code=t,this.input=n,this.index=s}},Fo=class{constructor(){this.bindingMap={},this.inputMap=new Map}clear(){for(let e of this.inputMap.keys())e.onUnbind();this.inputMap.clear(),this.bindingMap={}}bind(e,t,n,s={inverted:!1}){let r,a=this.inputMap;if(a.has(e)){let l=a.get(e),c=e.size;e.onBind(c,s),r=new Js(t,n,e,c),l.push(r)}else{let l=[];a.set(e,l);let c=0;e.onBind(c,s),r=new Js(t,n,e,c),l.push(r)}let o=this.bindingMap;t in o?n in o[t]?o[t][n].push(r):o[t][n]=[r]:o[t]={[n]:[r]}}unbind(e){let t=this.inputMap;if(t.has(e)){let n=this.bindingMap,s=t.get(e);for(let r of s){let{device:a,code:o}=r,l=n[a][o],c=l.indexOf(r);l.splice(c,1)}s.length=0,e.onUnbind(),t.delete(e)}}isBound(e){return this.inputMap.has(e)}getInputs(){return this.inputMap.keys()}getBindingsByInput(e){return this.inputMap.get(e)}getBindings(e,t){let n=this.bindingMap;if(e in n){let s=n[e];if(t in s)return s[t]}return[]}},zo=class{constructor(e,t=void 0){this.inputs={},this.devices=[new Do("Mouse",e),new Io("Keyboard",e)],this.bindings=new Fo,this.adapter=new Oo(this.bindings),this.autopoller=new No(this.adapter),this.eventTarget=e,this.anyButton=new ji(1),this.anyButtonDevice="",this.anyButtonCode="",this.anyAxis=new fi(1),this.anyAxisDevice="",this.anyAxisCode="",this.listeners={bind:[],unbind:[],focus:[],blur:[]},this.onInput=this.onInput.bind(this),this.onEventTargetBlur=this.onEventTargetBlur.bind(this),this.onEventTargetFocus=this.onEventTargetFocus.bind(this),e.addEventListener("focus",this.onEventTargetFocus),e.addEventListener("blur",this.onEventTargetBlur);for(let n of this.devices)n.addEventListener("input",this.onInput)}get autopoll(){return this.autopoller.running}set autopoll(e){this.toggleAutoPoll(e)}destroy(){let e=this.listeners;for(let n in e)e[n].length=0;this.autopoller.running&&this.autopoller.stop();for(let n of this.devices)n.removeEventListener("input",this.onInput),n.destroy();let t=this.eventTarget;t.removeEventListener("focus",this.onEventTargetFocus),t.removeEventListener("blur",this.onEventTargetBlur)}setEventTarget(e){let t=this.eventTarget;t.removeEventListener("focus",this.onEventTargetFocus),t.removeEventListener("blur",this.onEventTargetBlur),this.eventTarget=e;for(let n of this.devices)n.setEventTarget(e);e.addEventListener("focus",this.onEventTargetFocus),e.addEventListener("blur",this.onEventTargetBlur)}toggleAutoPoll(e=void 0){let t=this.autopoller.running,n=typeof e>"u"?!t:!!e;n!==t&&(n?this.autopoller.start():this.autopoller.stop())}addEventListener(e,t){let n=this.listeners;e in n?n[e].push(t):n[e]=[t]}removeEventListener(e,t){let n=this.listeners;if(e in n){let s=n[e],r=s.indexOf(t);r>=0&&s.splice(r,1)}}dispatchEvent(e){let{type:t}=e,n=0;for(let s of this.listeners[t])n|=s(e)?1:0;return!!n}poll(e=performance.now()){if(this.autopoller.running)throw new Error("Should not manually poll() while autopolling.");this.onPoll(e)}onInput(e){let t=this.adapter.onInput(e);switch(e.event){case"pressed":this.anyButtonDevice=e.device,this.anyButtonCode=e.code,this.anyButton.onUpdate(0,1,1);break;case"released":this.anyButtonDevice=e.device,this.anyButtonCode=e.code,this.anyButton.onUpdate(0,0,-1);break;case"move":case"wheel":this.anyAxisDevice=e.device,this.anyAxisCode=e.code,this.anyAxis.onUpdate(0,e.value,e.movement);break}return t}onPoll(e){this.adapter.onPoll(e),this.anyButton.onPoll(e),this.anyAxis.onPoll(e)}onBind(){this.dispatchEvent({type:"bind"})}onUnbind(){this.dispatchEvent({type:"unbind"})}onEventTargetFocus(){this.dispatchEvent({type:"focus"})}onEventTargetBlur(){for(let e of this.bindings.getInputs())e.onStatus(0,0);this.anyButton.onStatus(0,0),this.anyAxis.onStatus(0,0),this.dispatchEvent({type:"blur"})}bindBindings(e){Array.isArray(e)||(e=Object.values(e));for(let t of e)t.bindTo(this)}bindBinding(e){e.bindTo(this)}bindButton(e,t,n,s=void 0){let r;this.hasButton(e)?r=this.getButton(e):(r=new ji(1),this.inputs[e]=r),this.bindings.bind(r,t,n,s),this.onBind()}bindAxis(e,t,n,s=void 0){let r;this.hasAxis(e)?r=this.getAxis(e):(r=new fi(1),this.inputs[e]=r),this.bindings.bind(r,t,n,s),this.onBind()}bindAxisButtons(e,t,n,s){let r;this.hasAxis(e)?r=this.getAxis(e):(r=new fi(2),this.inputs[e]=r),this.bindings.bind(r,t,s),this.bindings.bind(r,t,n,{inverted:!0}),this.onBind()}unbindButton(e){if(this.hasButton(e)){let t=this.getButton(e);delete this.inputs[e],this.bindings.unbind(t),this.onUnbind()}}unbindAxis(e){if(this.hasAxis(e)){let t=this.getAxis(e);delete this.inputs[e],this.bindings.unbind(t),this.onUnbind()}}getInput(e){return this.inputs[e]}getButton(e){return this.inputs[e]}getAxis(e){return this.inputs[e]}hasButton(e){return e in this.inputs&&this.inputs[e]instanceof ji}hasAxis(e){return e in this.inputs&&this.inputs[e]instanceof fi}isButtonDown(e){return this.inputs[e].down}isButtonPressed(e){return this.inputs[e].pressed}isButtonReleased(e){return this.inputs[e].released}getInputValue(e){return this.inputs[e].value}getButtonValue(e){return this.inputs[e].value}getAxisValue(e){return this.inputs[e].value}getAxisDelta(e){return this.inputs[e].delta}isAnyButtonDown(e=void 0){if(typeof e>"u")return this.anyButton.down;{let t=this.inputs;for(let n of e)if(t[n].down)return!0}return!1}isAnyButtonPressed(e=void 0){if(typeof e>"u")return this.anyButton.pressed;{let t=this.inputs;for(let n of e)if(t[n].pressed)return!0}return!1}isAnyButtonReleased(e=void 0){if(typeof e>"u")return this.anyButton.released;{let t=this.inputs;for(let n of e)if(t[n].released)return!0}return!1}getAnyAxisValue(e=void 0){if(typeof e>"u")return this.anyAxis.value;{let t=this.inputs;for(let n of e){let s=t[n];if(s.value)return s.value}}return 0}getAnyAxisDelta(e=void 0){if(typeof e>"u")return this.anyAxis.delta;{let t=this.inputs;for(let n of e){let s=t[n];if(s.delta)return s.delta}}return 0}getLastButtonDevice(){return this.anyButtonDevice}getLastButtonCode(){return this.anyButtonCode}getLastAxisDevice(){return this.anyAxisDevice}getLastAxisCode(){return this.anyAxisCode}getMouse(){return this.devices[0]}getKeyboard(){return this.devices[1]}},Vt=class extends HTMLElement{static create(e={}){let{root:t=document.body,id:n=void 0,for:s=void 0,autopoll:r=!1}=e||{},a=new Vt;return a.id=n,a.for=s,a.autopoll=r,t.appendChild(a),a}static get[Symbol.for("templateNode")](){let e=document.createElement("template");return e.innerHTML=Am,Object.defineProperty(this,Symbol.for("templateNode"),{value:e}),e}static get[Symbol.for("styleNode")](){let e=document.createElement("style");return e.innerHTML=Tm,Object.defineProperty(this,Symbol.for("styleNode"),{value:e}),e}static define(e=window.customElements){e.define("input-port",this)}static get observedAttributes(){return["autopoll","for"]}get autopoll(){return this._autopoll}set autopoll(e){this.toggleAttribute("autopoll",e)}get for(){return this._for}set for(e){this.setAttribute("for",e)}constructor(){super();let e=this.attachShadow({mode:"open"});e.appendChild(this.constructor[Symbol.for("templateNode")].content.cloneNode(!0)),e.appendChild(this.constructor[Symbol.for("styleNode")].cloneNode(!0)),this._titleElement=e.querySelector("#title"),this._pollElement=e.querySelector("#poll"),this._focusElement=e.querySelector("#focus"),this._bodyElement=e.querySelector("tbody"),this._outputElements={},this.onAnimationFrame=this.onAnimationFrame.bind(this),this.animationFrameHandle=null;let t=this;this._for="",this._eventTarget=t,this._autopoll=!1,this._context=null,this.onInputContextBind=this.onInputContextBind.bind(this),this.onInputContextUnbind=this.onInputContextUnbind.bind(this),this.onInputContextFocus=this.onInputContextFocus.bind(this),this.onInputContextBlur=this.onInputContextBlur.bind(this)}connectedCallback(){if(Object.prototype.hasOwnProperty.call(this,"for")){let e=this.for;delete this.for,this.for=e}if(Object.prototype.hasOwnProperty.call(this,"autopoll")){let e=this.autopoll;delete this.autopoll,this.autopoll=e}this.updateTable(),this.updateTableValues(),this.animationFrameHandle=window.requestAnimationFrame(this.onAnimationFrame)}disconnectedCallback(){let e=this._context;e&&(e.removeEventListener("bind",this.onInputContextBind),e.removeEventListener("unbind",this.onInputContextUnbind),e.removeEventListener("blur",this.onInputContextBlur),e.removeEventListener("focus",this.onInputContextFocus),e.destroy(),this._context=null)}attributeChangedCallback(e,t,n){switch(e){case"for":{this._for=n;let s,r;n?(s=document.getElementById(n),r=`${s.tagName.toLowerCase()}#${n}`):(s=this,r="input-port"),this._eventTarget=s,this._context&&this._context.setEventTarget(this._eventTarget),this._titleElement.innerHTML=`for ${r}`}break;case"autopoll":this._autopoll=n!==null,this._context&&this._context.toggleAutoPoll(this._autopoll);break}}onAnimationFrame(){this.animationFrameHandle=window.requestAnimationFrame(this.onAnimationFrame),this.updateTableValues(),this.updatePollStatus()}onInputContextBind(){return this.updateTable(),!0}onInputContextUnbind(){return this.updateTable(),!0}onInputContextFocus(){return this._focusElement.innerHTML="\u2713",!0}onInputContextBlur(){return this._focusElement.innerHTML="",!0}getContext(e="axisbutton",t=void 0){switch(e){case"axisbutton":if(!this._context){let n=new zo(this._eventTarget,t);n.addEventListener("bind",this.onInputContextBind),n.addEventListener("unbind",this.onInputContextUnbind),n.addEventListener("blur",this.onInputContextBlur),n.addEventListener("focus",this.onInputContextFocus),this._autopoll&&n.toggleAutoPoll(!0),this._context=n}return this._context;default:throw new Error(`Input context id '${e}' is not supported.`)}}updateTable(){if(this.isConnected)if(this._context){let e=this._context,t=e.inputs,n=e.bindings,s={},r=[];for(let a of Object.keys(t)){let o=t[a],l=!0;for(let c of n.getBindingsByInput(o)){let h=Cm(`${o.constructor.name}.${a}`,`${c.device}.${c.code}`,0,l);r.push(h),l&&(s[a]=h.querySelector("output"),l=!1)}}this._outputElements=s,this._bodyElement.innerHTML="";for(let a of r)this._bodyElement.appendChild(a)}else{this._outputElements={},this._bodyElement.innerHTML="";return}else return}updateTableValues(){if(this.isConnected)if(this._context){let t=this._context.inputs;for(let n of Object.keys(this._outputElements)){let s=this._outputElements[n],r=t[n].value;s.innerText=Number(r).toFixed(2)}}else{for(let e of Object.keys(this._outputElements)){let t=this._outputElements[e];t.innerText="---"}return}else return}updatePollStatus(){if(this.isConnected)if(this._context){let t=this._context.inputs;for(let n of Object.values(t))if(!n.polling){this._pollElement.innerHTML="";return}this._pollElement.innerHTML="\u2713"}else{this._pollElement.innerHTML="-";return}else return}};Vt.define();function Cm(i,e,t,n=!0){let s=document.createElement("tr");n&&s.classList.add("primary");{let r=document.createElement("td");r.textContent=i,r.classList.add("name"),s.appendChild(r)}{let r=document.createElement("td"),a=document.createElement("output");n?a.innerText=Number(t).toFixed(2):a.innerText="---",a.classList.add("value"),r.appendChild(a),s.appendChild(r)}{let r=document.createElement("td");r.classList.add("key");let a=new Zs;a.innerText=e,r.appendChild(a),s.appendChild(r)}return s}var Mw=Symbol("keyboardSource");var Sw=Symbol("mouseSource");var js=1e-6,Qi=typeof Float32Array<"u"?Float32Array:Array,Uo=Math.random;var Aw=Math.PI/180;Math.hypot||(Math.hypot=function(){for(var i=0,e=arguments.length;e--;)i+=arguments[e]*arguments[e];return Math.sqrt(i)});var Qs={};Xi(Qs,{add:()=>Nm,angle:()=>ng,bezier:()=>$m,ceil:()=>Om,clone:()=>Lm,copy:()=>Im,create:()=>qc,cross:()=>qm,dist:()=>hg,distance:()=>Zc,div:()=>cg,divide:()=>Kc,dot:()=>Qc,equals:()=>og,exactEquals:()=>rg,floor:()=>Fm,forEach:()=>pg,fromValues:()=>Pm,hermite:()=>Ym,inverse:()=>Wm,len:()=>fg,length:()=>Xc,lerp:()=>Xm,max:()=>Um,min:()=>zm,mul:()=>lg,multiply:()=>$c,negate:()=>Vm,normalize:()=>Gm,random:()=>Km,rotateX:()=>Qm,rotateY:()=>eg,rotateZ:()=>tg,round:()=>km,scale:()=>Bm,scaleAndAdd:()=>Hm,set:()=>Dm,sqrDist:()=>ug,sqrLen:()=>dg,squaredDistance:()=>Jc,squaredLength:()=>jc,str:()=>sg,sub:()=>ag,subtract:()=>Yc,transformMat3:()=>Jm,transformMat4:()=>Zm,transformQuat:()=>jm,zero:()=>ig});function qc(){var i=new Qi(3);return Qi!=Float32Array&&(i[0]=0,i[1]=0,i[2]=0),i}function Lm(i){var e=new Qi(3);return e[0]=i[0],e[1]=i[1],e[2]=i[2],e}function Xc(i){var e=i[0],t=i[1],n=i[2];return Math.hypot(e,t,n)}function Pm(i,e,t){var n=new Qi(3);return n[0]=i,n[1]=e,n[2]=t,n}function Im(i,e){return i[0]=e[0],i[1]=e[1],i[2]=e[2],i}function Dm(i,e,t,n){return i[0]=e,i[1]=t,i[2]=n,i}function Nm(i,e,t){return i[0]=e[0]+t[0],i[1]=e[1]+t[1],i[2]=e[2]+t[2],i}function Yc(i,e,t){return i[0]=e[0]-t[0],i[1]=e[1]-t[1],i[2]=e[2]-t[2],i}function $c(i,e,t){return i[0]=e[0]*t[0],i[1]=e[1]*t[1],i[2]=e[2]*t[2],i}function Kc(i,e,t){return i[0]=e[0]/t[0],i[1]=e[1]/t[1],i[2]=e[2]/t[2],i}function Om(i,e){return i[0]=Math.ceil(e[0]),i[1]=Math.ceil(e[1]),i[2]=Math.ceil(e[2]),i}function Fm(i,e){return i[0]=Math.floor(e[0]),i[1]=Math.floor(e[1]),i[2]=Math.floor(e[2]),i}function zm(i,e,t){return i[0]=Math.min(e[0],t[0]),i[1]=Math.min(e[1],t[1]),i[2]=Math.min(e[2],t[2]),i}function Um(i,e,t){return i[0]=Math.max(e[0],t[0]),i[1]=Math.max(e[1],t[1]),i[2]=Math.max(e[2],t[2]),i}function km(i,e){return i[0]=Math.round(e[0]),i[1]=Math.round(e[1]),i[2]=Math.round(e[2]),i}function Bm(i,e,t){return i[0]=e[0]*t,i[1]=e[1]*t,i[2]=e[2]*t,i}function Hm(i,e,t,n){return i[0]=e[0]+t[0]*n,i[1]=e[1]+t[1]*n,i[2]=e[2]+t[2]*n,i}function Zc(i,e){var t=e[0]-i[0],n=e[1]-i[1],s=e[2]-i[2];return Math.hypot(t,n,s)}function Jc(i,e){var t=e[0]-i[0],n=e[1]-i[1],s=e[2]-i[2];return t*t+n*n+s*s}function jc(i){var e=i[0],t=i[1],n=i[2];return e*e+t*t+n*n}function Vm(i,e){return i[0]=-e[0],i[1]=-e[1],i[2]=-e[2],i}function Wm(i,e){return i[0]=1/e[0],i[1]=1/e[1],i[2]=1/e[2],i}function Gm(i,e){var t=e[0],n=e[1],s=e[2],r=t*t+n*n+s*s;return r>0&&(r=1/Math.sqrt(r)),i[0]=e[0]*r,i[1]=e[1]*r,i[2]=e[2]*r,i}function Qc(i,e){return i[0]*e[0]+i[1]*e[1]+i[2]*e[2]}function qm(i,e,t){var n=e[0],s=e[1],r=e[2],a=t[0],o=t[1],l=t[2];return i[0]=s*l-r*o,i[1]=r*a-n*l,i[2]=n*o-s*a,i}function Xm(i,e,t,n){var s=e[0],r=e[1],a=e[2];return i[0]=s+n*(t[0]-s),i[1]=r+n*(t[1]-r),i[2]=a+n*(t[2]-a),i}function Ym(i,e,t,n,s,r){var a=r*r,o=a*(2*r-3)+1,l=a*(r-2)+r,c=a*(r-1),h=a*(3-2*r);return i[0]=e[0]*o+t[0]*l+n[0]*c+s[0]*h,i[1]=e[1]*o+t[1]*l+n[1]*c+s[1]*h,i[2]=e[2]*o+t[2]*l+n[2]*c+s[2]*h,i}function $m(i,e,t,n,s,r){var a=1-r,o=a*a,l=r*r,c=o*a,h=3*r*o,u=3*l*a,f=l*r;return i[0]=e[0]*c+t[0]*h+n[0]*u+s[0]*f,i[1]=e[1]*c+t[1]*h+n[1]*u+s[1]*f,i[2]=e[2]*c+t[2]*h+n[2]*u+s[2]*f,i}function Km(i,e){e=e||1;var t=Uo()*2*Math.PI,n=Uo()*2-1,s=Math.sqrt(1-n*n)*e;return i[0]=Math.cos(t)*s,i[1]=Math.sin(t)*s,i[2]=n*e,i}function Zm(i,e,t){var n=e[0],s=e[1],r=e[2],a=t[3]*n+t[7]*s+t[11]*r+t[15];return a=a||1,i[0]=(t[0]*n+t[4]*s+t[8]*r+t[12])/a,i[1]=(t[1]*n+t[5]*s+t[9]*r+t[13])/a,i[2]=(t[2]*n+t[6]*s+t[10]*r+t[14])/a,i}function Jm(i,e,t){var n=e[0],s=e[1],r=e[2];return i[0]=n*t[0]+s*t[3]+r*t[6],i[1]=n*t[1]+s*t[4]+r*t[7],i[2]=n*t[2]+s*t[5]+r*t[8],i}function jm(i,e,t){var n=t[0],s=t[1],r=t[2],a=t[3],o=e[0],l=e[1],c=e[2],h=s*c-r*l,u=r*o-n*c,f=n*l-s*o,m=s*f-r*u,x=r*h-n*f,p=n*u-s*h,d=a*2;return h*=d,u*=d,f*=d,m*=2,x*=2,p*=2,i[0]=o+h+m,i[1]=l+u+x,i[2]=c+f+p,i}function Qm(i,e,t,n){var s=[],r=[];return s[0]=e[0]-t[0],s[1]=e[1]-t[1],s[2]=e[2]-t[2],r[0]=s[0],r[1]=s[1]*Math.cos(n)-s[2]*Math.sin(n),r[2]=s[1]*Math.sin(n)+s[2]*Math.cos(n),i[0]=r[0]+t[0],i[1]=r[1]+t[1],i[2]=r[2]+t[2],i}function eg(i,e,t,n){var s=[],r=[];return s[0]=e[0]-t[0],s[1]=e[1]-t[1],s[2]=e[2]-t[2],r[0]=s[2]*Math.sin(n)+s[0]*Math.cos(n),r[1]=s[1],r[2]=s[2]*Math.cos(n)-s[0]*Math.sin(n),i[0]=r[0]+t[0],i[1]=r[1]+t[1],i[2]=r[2]+t[2],i}function tg(i,e,t,n){var s=[],r=[];return s[0]=e[0]-t[0],s[1]=e[1]-t[1],s[2]=e[2]-t[2],r[0]=s[0]*Math.cos(n)-s[1]*Math.sin(n),r[1]=s[0]*Math.sin(n)+s[1]*Math.cos(n),r[2]=s[2],i[0]=r[0]+t[0],i[1]=r[1]+t[1],i[2]=r[2]+t[2],i}function ng(i,e){var t=i[0],n=i[1],s=i[2],r=e[0],a=e[1],o=e[2],l=Math.sqrt(t*t+n*n+s*s),c=Math.sqrt(r*r+a*a+o*o),h=l*c,u=h&&Qc(i,e)/h;return Math.acos(Math.min(Math.max(u,-1),1))}function ig(i){return i[0]=0,i[1]=0,i[2]=0,i}function sg(i){return"vec3("+i[0]+", "+i[1]+", "+i[2]+")"}function rg(i,e){return i[0]===e[0]&&i[1]===e[1]&&i[2]===e[2]}function og(i,e){var t=i[0],n=i[1],s=i[2],r=e[0],a=e[1],o=e[2];return Math.abs(t-r)<=js*Math.max(1,Math.abs(t),Math.abs(r))&&Math.abs(n-a)<=js*Math.max(1,Math.abs(n),Math.abs(a))&&Math.abs(s-o)<=js*Math.max(1,Math.abs(s),Math.abs(o))}var ag=Yc,lg=$c,cg=Kc,hg=Zc,ug=Jc,fg=Xc,dg=jc,pg=function(){var i=qc();return function(e,t,n,s,r,a){var o,l;for(t||(t=3),n||(n=0),s?l=Math.min(s*t+n,e.length):l=e.length,o=n;o<l;o+=t)i[0]=e[o],i[1]=e[o+1],i[2]=e[o+2],r(i,i,a),e[o]=i[0],e[o+1]=i[1],e[o+2]=i[2];return e}}();var Iw=Qs.fromValues(0,1,0);var Dw=Math.PI/3;var Nw=Math.PI/180;var fn=class{constructor(e){this.name=e}dispatch(e,t){e.dispatch(this,t)}dispatchImmediately(e,t){e.dispatchImmediately(this,t)}dispatchImmediatelyAndWait(e,t){e.dispatchImmediatelyAndWait(this,t)}on(e,t,n){return e.addEventListener(this,n,{priority:t}),this}off(e,t){return e.removeEventListener(this,t),this}once(e,t,n){let s=r=>(this.off(e,s),n(r));return this.on(e,t,s)}*poll(e,t){t=Math.min(t,e.count(this));for(let n=0;n<t;++n)yield e.poll(this)}retain(e,t){e.retain(this,t)}*pollAndRetain(e,t){this.retain(e,t);for(let n of this.poll(e,t))yield n}};function mg(i,e){return i.priority-e.priority}var ns=class{constructor(){this.cachedIn={},this.cachedOut={},this.callbacks={},this.maxRetains={},this.nameTopicMapping={}}addEventListener(e,t,n=void 0){let{priority:s=0}=n,r=this.callbacksOf(e);r.push({callback:t,priority:s}),r.sort(mg)}removeEventListener(e,t){let n=this.callbacksOf(e),s=n.findIndex(r=>r.callback===t);s>=0&&n.splice(s,1)}countEventListeners(e){return this.callbacksOf(e).length}dispatch(e,t){this.incomingOf(e).push(t)}dispatchImmediately(e,t){let n=this.callbacksOf(e);for(let{callback:r}of n)if(r(t)===!0)return;this.outgoingOf(e).push(t)}async dispatchImmediatelyAndWait(e,t){let n=this.callbacksOf(e);for(let{callback:r}of n)if(await r(t)===!0)return;this.outgoingOf(e).push(t)}count(e){return this.outgoingOf(e).length}poll(e){let t=this.outgoingOf(e);return t.length<=0?null:t.shift()}retain(e,t){let n=e.name,s=Math.max(t,this.maxRetains[n]||0);this.maxRetains[n]=s}flush(e=100){for(let t of Object.keys(this.cachedIn)){let n=this.nameTopicMapping[t],s=this.cachedIn[t],r=this.cachedOut[t],a=this.maxRetains[t]||0;a<r.length&&r.splice(0,r.length-a);let o=Math.min(e,s.length);for(let l=0;l<o;++l){let c=s.shift();typeof c=="object"&&c instanceof Promise?this.dispatchImmediately(n,c):this.dispatchImmediately(n,c)}}}getPendingRetainCount(e){return this.maxRetains[e.name]||0}getPendingFlushCount(e){return this.incomingOf(e).length}reset(){this.cachedIn={},this.cachedOut={},this.callbacks={},this.maxRetains={},this.nameTopicMapping={}}incomingOf(e){let t=e.name;if(t in this.cachedIn)return this.cachedIn[t];{let n=[];return this.cachedIn[t]=n,this.cachedOut[t]=[],this.nameTopicMapping[t]=e,n}}outgoingOf(e){let t=e.name;if(t in this.cachedOut)return this.cachedOut[t];{let n=[];return this.cachedIn[t]=[],this.cachedOut[t]=n,this.nameTopicMapping[t]=e,n}}callbacksOf(e){let t=e.name;if(t in this.callbacks)return this.callbacks[t];{let n=[];return this.callbacks[t]=n,n}}},Wn=class{constructor(e,t=void 0){let{animationFrameHandler:n=window}=t||{};this.handle=0,this.detail={prevTime:-1,currentTime:-1,deltaTime:0},this.animationFrameHandler=n,this.callback=e,this.next=this.next.bind(this),this.start=this.start.bind(this),this.cancel=this.cancel.bind(this)}next(e=performance.now()){this.handle=this.animationFrameHandler.requestAnimationFrame(this.next);let t=this.detail;t.prevTime=t.currentTime,t.currentTime=e,t.deltaTime=t.currentTime-t.prevTime,this.callback(this)}start(){return this.handle=this.animationFrameHandler.requestAnimationFrame(this.next),this}cancel(){return this.animationFrameHandler.cancelAnimationFrame(this.handle),this}};function er(i,e){let t=th(i),n=e.name;if(n in t.contexts){let{value:s}=t.contexts[n];if(s)return s;throw eh(i).name===e.name?new Error("Cannot useProvider() on self during initialization!"):new Error("This is not a provider.")}throw new Error(`Missing assigned dependent provider '${n}' in context.`)}function gg(i,e){let t=th(i);for(let n of e){let s={handle:n,value:null};t.contexts[n.name]=s,t.current=n,s.value=n(i)}return i}function xg(i,e){let t=nh(i);if(!t)return i;for(let n of e.slice().reverse()){let s=t.contexts[n.name];s.value=null,delete t.contexts[n.name]}return i}function eh(i){let e=nh(i);if(!e)throw new Error("This is not a provider.");return e.current}var es=Symbol("providers");function _g(){return{contexts:{},current:null}}function th(i){return es in i?i[es]:i[es]=_g()}function nh(i){return es in i?i[es]:null}function An(i,e){let t=eh(i);if(!t)throw new Error("Not a provider.");let n=ih(i);sh(t,n.contexts).befores.push(e)}async function vg(i,e){let t=ih(i);for(let n of e){let s=sh(n,t.contexts),r=s.befores.slice();s.befores.length=0;let a=await Promise.all(r.map(o=>o&&o()));s.afters.push(...a)}return i}async function yg(i,e){let t=wg(i);if(!t)return i;for(let n of e.slice().reverse()){let s=Sg(n,t.contexts);if(!s)throw new Error("Cannot revert context for non-existent provider.");let r=s.afters.slice();s.afters.length=0,await Promise.all(r.map(a=>a&&a()))}return i}var ts=Symbol("effectors");function bg(){return{contexts:{}}}function ih(i){return ts in i?i[ts]:i[ts]=bg()}function wg(i){return ts in i?i[ts]:null}function Mg(){return{befores:[],afters:[]}}function sh(i,e){let t=i.name;return t in e?e[t]:e[t]=Mg()}function Sg(i,e){let t=i.name;return t in e?e[t]:null}var ko=new fn("main.update");function Bo(i,e,t){An(i,()=>(ko.on(e,0,t),()=>{ko.off(e,t)}))}function Eg(i,e,t,n){let s=er(i,is);An(i,()=>(e.on(s,t,n),()=>{e.off(s,n)}))}function is(i){let e=new ns;return Bo(i,e,()=>{e.flush()}),e}function Ag(i,e,t=[]){function n(r){let a=er(r,is);An(r,async()=>(e.load&&await e.load(r),e.main&&await e.main(r),e.init&&e.init(r),async()=>{e.dead&&e.dead(r),e.unload&&await e.unload(r)})),Bo(r,a,()=>{e.update&&e.update(r),e.draw&&e.draw(r)})}let s=[is,rh,...t,n];return{async start(){return gg(i,s),await vg(i,s),this},async stop(){return await yg(i,s),xg(i,s),this}}}function rh(i){let e=er(i,is),t=new Wn(n=>{ko.dispatchImmediately(e,n)});return An(i,()=>{t.start()}),t}function Tg(i,e,t){An(i,()=>{let n=window;return n.addEventListener(e,t),()=>{n.removeEventListener(e,t)}})}function Cg(i,e,t){An(i,()=>{let n=window.document;return n.addEventListener(e,t),()=>{n.removeEventListener(e,t)}})}function Rg(i,e,t,n){An(i,()=>(e.addEventListener(t,n),()=>{e.removeEventListener(t,n)}))}var Ge=Object.freeze({__proto__:null,AnimationFrameLoopProvider:rh,TopicsProvider:is,toast:Ag,useDocumentEventListener:Cg,useEffect:An,useHTMLElementEventListener:Rg,useProvider:er,useSystemUpdate:Bo,useTopic:Eg,useWindowEventListener:Tg});var nl="149",ri={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},oi={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Lg=0,oh=1,Pg=2;var Mu=1,Ig=2,us=3,Nn=0,Dt=1,In=2;var Dn=0,Ri=1,ah=2,lh=3,ch=4,Dg=5,Ti=100,Ng=101,Og=102,hh=103,uh=104,Fg=200,zg=201,Ug=202,kg=203,Su=204,Eu=205,Bg=206,Hg=207,Vg=208,Wg=209,Gg=210,qg=0,Xg=1,Yg=2,ba=3,$g=4,Kg=5,Zg=6,Jg=7,Au=0,jg=1,Qg=2,vn=0,e0=1,t0=2,n0=3,i0=4,s0=5,Tu=300,Ii=301,Di=302,wa=303,Ma=304,kr=306,Sa=1e3,Yt=1001,Ea=1002,vt=1003,fh=1004;var Ho=1005;var kt=1006,r0=1007;var ps=1008;var Qn=1009,o0=1010,a0=1011,Cu=1012,l0=1013,Kn=1014,Zn=1015,ms=1016,c0=1017,h0=1018,Li=1020,u0=1021,$t=1023,f0=1024,d0=1025,Jn=1026,Ni=1027,p0=1028,m0=1029,g0=1030,x0=1031,_0=1033,Vo=33776,Wo=33777,Go=33778,qo=33779,dh=35840,ph=35841,mh=35842,gh=35843,v0=36196,xh=37492,_h=37496,vh=37808,yh=37809,bh=37810,wh=37811,Mh=37812,Sh=37813,Eh=37814,Ah=37815,Th=37816,Ch=37817,Rh=37818,Lh=37819,Ph=37820,Ih=37821,Xo=36492,y0=36283,Dh=36284,Nh=36285,Oh=36286;var wr=2300,Mr=2301,Yo=2302,Fh=2400,zh=2401,Uh=2402;var ei=3e3,Ye=3001,b0=3200,w0=3201,Ru=0,M0=1;var nn="srgb",gs="srgb-linear";var $o=7680;var S0=519,kh=35044;var Bh="300 es",Aa=1035,on=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;let n=this._listeners;return n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;let s=this._listeners[e];if(s!==void 0){let r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){if(this._listeners===void 0)return;let n=this._listeners[e.type];if(n!==void 0){e.target=this;let s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}},pt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];var Ko=Math.PI/180,Hh=180/Math.PI;function Ms(){let i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(pt[i&255]+pt[i>>8&255]+pt[i>>16&255]+pt[i>>24&255]+"-"+pt[e&255]+pt[e>>8&255]+"-"+pt[e>>16&15|64]+pt[e>>24&255]+"-"+pt[t&63|128]+pt[t>>8&255]+"-"+pt[t>>16&255]+pt[t>>24&255]+pt[n&255]+pt[n>>8&255]+pt[n>>16&255]+pt[n>>24&255]).toLowerCase()}function Et(i,e,t){return Math.max(e,Math.min(t,i))}function E0(i,e){return(i%e+e)%e}function Zo(i,e,t){return(1-t)*i+t*e}function Vh(i){return(i&i-1)===0&&i!==0}function Ta(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function tr(i,e){switch(e.constructor){case Float32Array:return i;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function Lt(i,e){switch(e.constructor){case Float32Array:return i;case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}var Ae=class{constructor(e=0,t=0){Ae.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=this.x<0?Math.ceil(this.x):Math.floor(this.x),this.y=this.y<0?Math.ceil(this.y):Math.floor(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*n-a*s+e.x,this.y=r*s+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},yt=class{constructor(){yt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1]}set(e,t,n,s,r,a,o,l,c){let h=this.elements;return h[0]=e,h[1]=s,h[2]=o,h[3]=t,h[4]=r,h[5]=l,h[6]=n,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],h=n[4],u=n[7],f=n[2],m=n[5],x=n[8],p=s[0],d=s[3],v=s[6],A=s[1],y=s[4],w=s[7],M=s[2],P=s[5],F=s[8];return r[0]=a*p+o*A+l*M,r[3]=a*d+o*y+l*P,r[6]=a*v+o*w+l*F,r[1]=c*p+h*A+u*M,r[4]=c*d+h*y+u*P,r[7]=c*v+h*w+u*F,r[2]=f*p+m*A+x*M,r[5]=f*d+m*y+x*P,r[8]=f*v+m*w+x*F,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8];return t*a*h-t*o*c-n*r*h+n*o*l+s*r*c-s*a*l}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],u=h*a-o*c,f=o*l-h*r,m=c*r-a*l,x=t*u+n*f+s*m;if(x===0)return this.set(0,0,0,0,0,0,0,0,0);let p=1/x;return e[0]=u*p,e[1]=(s*c-h*n)*p,e[2]=(o*n-s*a)*p,e[3]=f*p,e[4]=(h*t-s*l)*p,e[5]=(s*r-o*t)*p,e[6]=m*p,e[7]=(n*l-c*t)*p,e[8]=(a*t-n*r)*p,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,a,o){let l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*a+c*o)+a+e,-s*c,s*l,-s*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(Jo.makeScale(e,t)),this}rotate(e){return this.premultiply(Jo.makeRotation(-e)),this}translate(e,t){return this.premultiply(Jo.makeTranslation(e,t)),this}makeTranslation(e,t){return this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},Jo=new yt;function Lu(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function xs(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function jn(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function br(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var jo={[nn]:{[gs]:jn},[gs]:{[nn]:br}},xt={legacyMode:!0,get workingColorSpace(){return gs},set workingColorSpace(i){console.warn("THREE.ColorManagement: .workingColorSpace is readonly.")},convert:function(i,e,t){if(this.legacyMode||e===t||!e||!t)return i;if(jo[e]&&jo[e][t]!==void 0){let n=jo[e][t];return i.r=n(i.r),i.g=n(i.g),i.b=n(i.b),i}throw new Error("Unsupported color space conversion.")},fromWorkingColorSpace:function(i,e){return this.convert(i,this.workingColorSpace,e)},toWorkingColorSpace:function(i,e){return this.convert(i,e,this.workingColorSpace)}},Pu={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},st={r:0,g:0,b:0},Gt={h:0,s:0,l:0},nr={h:0,s:0,l:0};function Qo(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}function ir(i,e){return e.r=i.r,e.g=i.g,e.b=i.b,e}var qe=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,t===void 0&&n===void 0?this.set(e):this.setRGB(e,t,n)}set(e){return e&&e.isColor?this.copy(e):typeof e=="number"?this.setHex(e):typeof e=="string"&&this.setStyle(e),this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=nn){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,xt.toWorkingColorSpace(this,t),this}setRGB(e,t,n,s=xt.workingColorSpace){return this.r=e,this.g=t,this.b=n,xt.toWorkingColorSpace(this,s),this}setHSL(e,t,n,s=xt.workingColorSpace){if(e=E0(e,1),t=Et(t,0,1),n=Et(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,a=2*n-r;this.r=Qo(a,r,e+1/3),this.g=Qo(a,r,e),this.b=Qo(a,r,e-1/3)}return xt.toWorkingColorSpace(this,s),this}setStyle(e,t=nn){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^((?:rgb|hsl)a?)\(([^\)]*)\)/.exec(e)){let r,a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return this.r=Math.min(255,parseInt(r[1],10))/255,this.g=Math.min(255,parseInt(r[2],10))/255,this.b=Math.min(255,parseInt(r[3],10))/255,xt.toWorkingColorSpace(this,t),n(r[4]),this;if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return this.r=Math.min(100,parseInt(r[1],10))/100,this.g=Math.min(100,parseInt(r[2],10))/100,this.b=Math.min(100,parseInt(r[3],10))/100,xt.toWorkingColorSpace(this,t),n(r[4]),this;break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o)){let l=parseFloat(r[1])/360,c=parseFloat(r[2])/100,h=parseFloat(r[3])/100;return n(r[4]),this.setHSL(l,c,h,t)}break}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){let r=s[1],a=r.length;if(a===3)return this.r=parseInt(r.charAt(0)+r.charAt(0),16)/255,this.g=parseInt(r.charAt(1)+r.charAt(1),16)/255,this.b=parseInt(r.charAt(2)+r.charAt(2),16)/255,xt.toWorkingColorSpace(this,t),this;if(a===6)return this.r=parseInt(r.charAt(0)+r.charAt(1),16)/255,this.g=parseInt(r.charAt(2)+r.charAt(3),16)/255,this.b=parseInt(r.charAt(4)+r.charAt(5),16)/255,xt.toWorkingColorSpace(this,t),this}return e&&e.length>0?this.setColorName(e,t):this}setColorName(e,t=nn){let n=Pu[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=jn(e.r),this.g=jn(e.g),this.b=jn(e.b),this}copyLinearToSRGB(e){return this.r=br(e.r),this.g=br(e.g),this.b=br(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=nn){return xt.fromWorkingColorSpace(ir(this,st),e),Et(st.r*255,0,255)<<16^Et(st.g*255,0,255)<<8^Et(st.b*255,0,255)<<0}getHexString(e=nn){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=xt.workingColorSpace){xt.fromWorkingColorSpace(ir(this,st),t);let n=st.r,s=st.g,r=st.b,a=Math.max(n,s,r),o=Math.min(n,s,r),l,c,h=(o+a)/2;if(o===a)l=0,c=0;else{let u=a-o;switch(c=h<=.5?u/(a+o):u/(2-a-o),a){case n:l=(s-r)/u+(s<r?6:0);break;case s:l=(r-n)/u+2;break;case r:l=(n-s)/u+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=xt.workingColorSpace){return xt.fromWorkingColorSpace(ir(this,st),t),e.r=st.r,e.g=st.g,e.b=st.b,e}getStyle(e=nn){return xt.fromWorkingColorSpace(ir(this,st),e),e!==nn?`color(${e} ${st.r} ${st.g} ${st.b})`:`rgb(${st.r*255|0},${st.g*255|0},${st.b*255|0})`}offsetHSL(e,t,n){return this.getHSL(Gt),Gt.h+=e,Gt.s+=t,Gt.l+=n,this.setHSL(Gt.h,Gt.s,Gt.l),this}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Gt),e.getHSL(nr);let n=Zo(Gt.h,nr.h,t),s=Zo(Gt.s,nr.s,t),r=Zo(Gt.l,nr.l,t);return this.setHSL(n,s,r),this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}};qe.NAMES=Pu;var di,Sr=class{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{di===void 0&&(di=xs("canvas")),di.width=e.width,di.height=e.height;let n=di.getContext("2d");e instanceof ImageData?n.putImageData(e,0,0):n.drawImage(e,0,0,e.width,e.height),t=di}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=xs("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=jn(r[a]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(jn(t[n]/255)*255):t[n]=jn(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},Er=class{constructor(e=null){this.isSource=!0,this.uuid=Ms(),this.data=e,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(ea(s[a].image)):r.push(ea(s[a]))}else r=ea(s);n.url=r}return t||(e.images[this.uuid]=n),n}};function ea(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Sr.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var A0=0,ht=class extends on{constructor(e=ht.DEFAULT_IMAGE,t=ht.DEFAULT_MAPPING,n=Yt,s=Yt,r=kt,a=ps,o=$t,l=Qn,c=ht.DEFAULT_ANISOTROPY,h=ei){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:A0++}),this.uuid=Ms(),this.name="",this.source=new Er(e),this.mipmaps=[],this.mapping=t,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new Ae(0,0),this.repeat=new Ae(1,1),this.center=new Ae(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new yt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.encoding=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.encoding=e.encoding,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.5,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,type:this.type,encoding:this.encoding,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Tu)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Sa:e.x=e.x-Math.floor(e.x);break;case Yt:e.x=e.x<0?0:1;break;case Ea:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Sa:e.y=e.y-Math.floor(e.y);break;case Yt:e.y=e.y<0?0:1;break;case Ea:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}};ht.DEFAULT_IMAGE=null;ht.DEFAULT_MAPPING=Tu;ht.DEFAULT_ANISOTROPY=1;var it=class{constructor(e=0,t=0,n=0,s=1){it.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*n+a[11]*s+a[15]*r,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r,l=e.elements,c=l[0],h=l[4],u=l[8],f=l[1],m=l[5],x=l[9],p=l[2],d=l[6],v=l[10];if(Math.abs(h-f)<.01&&Math.abs(u-p)<.01&&Math.abs(x-d)<.01){if(Math.abs(h+f)<.1&&Math.abs(u+p)<.1&&Math.abs(x+d)<.1&&Math.abs(c+m+v-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let y=(c+1)/2,w=(m+1)/2,M=(v+1)/2,P=(h+f)/4,F=(u+p)/4,g=(x+d)/4;return y>w&&y>M?y<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(y),s=P/n,r=F/n):w>M?w<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(w),n=P/s,r=g/s):M<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(M),n=F/r,s=g/r),this.set(n,s,r,t),this}let A=Math.sqrt((d-x)*(d-x)+(u-p)*(u-p)+(f-h)*(f-h));return Math.abs(A)<.001&&(A=1),this.x=(d-x)/A,this.y=(u-p)/A,this.z=(f-h)/A,this.w=Math.acos((c+m+v-1)/2),this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=this.x<0?Math.ceil(this.x):Math.floor(this.x),this.y=this.y<0?Math.ceil(this.y):Math.floor(this.y),this.z=this.z<0?Math.ceil(this.z):Math.floor(this.z),this.w=this.w<0?Math.ceil(this.w):Math.floor(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},bn=class extends on{constructor(e=1,t=1,n={}){super(),this.isWebGLRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new it(0,0,e,t),this.scissorTest=!1,this.viewport=new it(0,0,e,t);let s={width:e,height:t,depth:1};this.texture=new ht(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.encoding),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=n.generateMipmaps!==void 0?n.generateMipmaps:!1,this.texture.internalFormat=n.internalFormat!==void 0?n.internalFormat:null,this.texture.minFilter=n.minFilter!==void 0?n.minFilter:kt,this.depthBuffer=n.depthBuffer!==void 0?n.depthBuffer:!0,this.stencilBuffer=n.stencilBuffer!==void 0?n.stencilBuffer:!1,this.depthTexture=n.depthTexture!==void 0?n.depthTexture:null,this.samples=n.samples!==void 0?n.samples:0}setSize(e,t,n=1){(this.width!==e||this.height!==t||this.depth!==n)&&(this.width=e,this.height=t,this.depth=n,this.texture.image.width=e,this.texture.image.height=t,this.texture.image.depth=n,this.dispose()),this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.viewport.copy(e.viewport),this.texture=e.texture.clone(),this.texture.isRenderTargetTexture=!0;let t=Object.assign({},e.texture.image);return this.texture.source=new Er(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},Ar=class extends ht{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=vt,this.minFilter=vt,this.wrapR=Yt,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Ca=class extends ht{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=vt,this.minFilter=vt,this.wrapR=Yt,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Zt=class{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,a,o){let l=n[s+0],c=n[s+1],h=n[s+2],u=n[s+3],f=r[a+0],m=r[a+1],x=r[a+2],p=r[a+3];if(o===0){e[t+0]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u;return}if(o===1){e[t+0]=f,e[t+1]=m,e[t+2]=x,e[t+3]=p;return}if(u!==p||l!==f||c!==m||h!==x){let d=1-o,v=l*f+c*m+h*x+u*p,A=v>=0?1:-1,y=1-v*v;if(y>Number.EPSILON){let M=Math.sqrt(y),P=Math.atan2(M,v*A);d=Math.sin(d*P)/M,o=Math.sin(o*P)/M}let w=o*A;if(l=l*d+f*w,c=c*d+m*w,h=h*d+x*w,u=u*d+p*w,d===1-o){let M=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=M,c*=M,h*=M,u*=M}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,s,r,a){let o=n[s],l=n[s+1],c=n[s+2],h=n[s+3],u=r[a],f=r[a+1],m=r[a+2],x=r[a+3];return e[t]=o*x+h*u+l*m-c*f,e[t+1]=l*x+h*f+c*u-o*m,e[t+2]=c*x+h*m+o*f-l*u,e[t+3]=h*x-o*u-l*f-c*m,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t){let n=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(n/2),h=o(s/2),u=o(r/2),f=l(n/2),m=l(s/2),x=l(r/2);switch(a){case"XYZ":this._x=f*h*u+c*m*x,this._y=c*m*u-f*h*x,this._z=c*h*x+f*m*u,this._w=c*h*u-f*m*x;break;case"YXZ":this._x=f*h*u+c*m*x,this._y=c*m*u-f*h*x,this._z=c*h*x-f*m*u,this._w=c*h*u+f*m*x;break;case"ZXY":this._x=f*h*u-c*m*x,this._y=c*m*u+f*h*x,this._z=c*h*x+f*m*u,this._w=c*h*u-f*m*x;break;case"ZYX":this._x=f*h*u-c*m*x,this._y=c*m*u+f*h*x,this._z=c*h*x-f*m*u,this._w=c*h*u+f*m*x;break;case"YZX":this._x=f*h*u+c*m*x,this._y=c*m*u+f*h*x,this._z=c*h*x-f*m*u,this._w=c*h*u-f*m*x;break;case"XZY":this._x=f*h*u-c*m*x,this._y=c*m*u-f*h*x,this._z=c*h*x+f*m*u,this._w=c*h*u+f*m*x;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t!==!1&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],s=t[4],r=t[8],a=t[1],o=t[5],l=t[9],c=t[2],h=t[6],u=t[10],f=n+o+u;if(f>0){let m=.5/Math.sqrt(f+1);this._w=.25/m,this._x=(h-l)*m,this._y=(r-c)*m,this._z=(a-s)*m}else if(n>o&&n>u){let m=2*Math.sqrt(1+n-o-u);this._w=(h-l)/m,this._x=.25*m,this._y=(s+a)/m,this._z=(r+c)/m}else if(o>u){let m=2*Math.sqrt(1+o-n-u);this._w=(r-c)/m,this._x=(s+a)/m,this._y=.25*m,this._z=(l+h)/m}else{let m=2*Math.sqrt(1+u-n-o);this._w=(a-s)/m,this._x=(r+c)/m,this._y=(l+h)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<Number.EPSILON?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Et(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,s=e._y,r=e._z,a=e._w,o=t._x,l=t._y,c=t._z,h=t._w;return this._x=n*h+a*o+s*c-r*l,this._y=s*h+a*l+r*o-n*c,this._z=r*h+a*c+n*l-s*o,this._w=a*h-n*o-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);let n=this._x,s=this._y,r=this._z,a=this._w,o=a*e._w+n*e._x+s*e._y+r*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=n,this._y=s,this._z=r,this;let l=1-o*o;if(l<=Number.EPSILON){let m=1-t;return this._w=m*a+t*this._w,this._x=m*n+t*this._x,this._y=m*s+t*this._y,this._z=m*r+t*this._z,this.normalize(),this._onChangeCallback(),this}let c=Math.sqrt(l),h=Math.atan2(c,o),u=Math.sin((1-t)*h)/c,f=Math.sin(t*h)/c;return this._w=a*u+this._w*f,this._x=n*u+this._x*f,this._y=s*u+this._y*f,this._z=r*u+this._z*f,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=Math.random(),t=Math.sqrt(1-e),n=Math.sqrt(e),s=2*Math.PI*Math.random(),r=2*Math.PI*Math.random();return this.set(t*Math.cos(s),n*Math.sin(r),n*Math.cos(r),t*Math.sin(s))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},W=class{constructor(e=0,t=0,n=0){W.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Wh.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Wh.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(e){let t=this.x,n=this.y,s=this.z,r=e.x,a=e.y,o=e.z,l=e.w,c=l*t+a*s-o*n,h=l*n+o*t-r*s,u=l*s+r*n-a*t,f=-r*t-a*n-o*s;return this.x=c*l+f*-r+h*-o-u*-a,this.y=h*l+f*-a+u*-r-c*-o,this.z=u*l+f*-o+c*-a-h*-r,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=this.x<0?Math.ceil(this.x):Math.floor(this.x),this.y=this.y<0?Math.ceil(this.y):Math.floor(this.y),this.z=this.z<0?Math.ceil(this.z):Math.floor(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,s=e.y,r=e.z,a=t.x,o=t.y,l=t.z;return this.x=s*l-r*o,this.y=r*a-n*l,this.z=n*o-s*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return ta.copy(this).projectOnVector(e),this.sub(ta)}reflect(e){return this.sub(ta.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(Et(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=(Math.random()-.5)*2,t=Math.random()*Math.PI*2,n=Math.sqrt(1-e**2);return this.x=n*Math.cos(t),this.y=n*Math.sin(t),this.z=e,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},ta=new W,Wh=new Zt,ti=class{constructor(e=new W(1/0,1/0,1/0),t=new W(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){let t=1/0,n=1/0,s=1/0,r=-1/0,a=-1/0,o=-1/0;for(let l=0,c=e.length;l<c;l+=3){let h=e[l],u=e[l+1],f=e[l+2];h<t&&(t=h),u<n&&(n=u),f<s&&(s=f),h>r&&(r=h),u>a&&(a=u),f>o&&(o=f)}return this.min.set(t,n,s),this.max.set(r,a,o),this}setFromBufferAttribute(e){let t=1/0,n=1/0,s=1/0,r=-1/0,a=-1/0,o=-1/0;for(let l=0,c=e.count;l<c;l++){let h=e.getX(l),u=e.getY(l),f=e.getZ(l);h<t&&(t=h),u<n&&(n=u),f<s&&(s=f),h>r&&(r=h),u>a&&(a=u),f>o&&(o=f)}return this.min.set(t,n,s),this.max.set(r,a,o),this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=Gn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0)if(t&&n.attributes!=null&&n.attributes.position!==void 0){let r=n.attributes.position;for(let a=0,o=r.count;a<o;a++)Gn.fromBufferAttribute(r,a).applyMatrix4(e.matrixWorld),this.expandByPoint(Gn)}else n.boundingBox===null&&n.computeBoundingBox(),na.copy(n.boundingBox),na.applyMatrix4(e.matrixWorld),this.union(na);let s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return!(e.x<this.min.x||e.x>this.max.x||e.y<this.min.y||e.y>this.max.y||e.z<this.min.z||e.z>this.max.z)}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return!(e.max.x<this.min.x||e.min.x>this.max.x||e.max.y<this.min.y||e.min.y>this.max.y||e.max.z<this.min.z||e.min.z>this.max.z)}intersectsSphere(e){return this.clampPoint(e.center,Gn),Gn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(ss),sr.subVectors(this.max,ss),pi.subVectors(e.a,ss),mi.subVectors(e.b,ss),gi.subVectors(e.c,ss),Tn.subVectors(mi,pi),Cn.subVectors(gi,mi),qn.subVectors(pi,gi);let t=[0,-Tn.z,Tn.y,0,-Cn.z,Cn.y,0,-qn.z,qn.y,Tn.z,0,-Tn.x,Cn.z,0,-Cn.x,qn.z,0,-qn.x,-Tn.y,Tn.x,0,-Cn.y,Cn.x,0,-qn.y,qn.x,0];return!ia(t,pi,mi,gi,sr)||(t=[1,0,0,0,1,0,0,0,1],!ia(t,pi,mi,gi,sr))?!1:(rr.crossVectors(Tn,Cn),t=[rr.x,rr.y,rr.z],ia(t,pi,mi,gi,sr))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return Gn.copy(e).clamp(this.min,this.max).sub(e).length()}getBoundingSphere(e){return this.getCenter(e.center),e.radius=this.getSize(Gn).length()*.5,e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(dn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),dn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),dn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),dn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),dn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),dn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),dn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),dn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(dn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}},dn=[new W,new W,new W,new W,new W,new W,new W,new W],Gn=new W,na=new ti,pi=new W,mi=new W,gi=new W,Tn=new W,Cn=new W,qn=new W,ss=new W,sr=new W,rr=new W,Xn=new W;function ia(i,e,t,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){Xn.fromArray(i,r);let o=s.x*Math.abs(Xn.x)+s.y*Math.abs(Xn.y)+s.z*Math.abs(Xn.z),l=e.dot(Xn),c=t.dot(Xn),h=n.dot(Xn);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}var T0=new ti,rs=new W,sa=new W,_s=class{constructor(e=new W,t=-1){this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t!==void 0?n.copy(t):T0.setFromPoints(e).getCenter(n);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;rs.subVectors(e,this.center);let t=rs.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(rs,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(sa.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(rs.copy(e.center).add(sa)),this.expandByPoint(rs.copy(e.center).sub(sa))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}},pn=new W,ra=new W,or=new W,Rn=new W,oa=new W,ar=new W,aa=new W,Ra=class{constructor(e=new W,t=new W(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.direction).multiplyScalar(e).add(this.origin)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,pn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.direction).multiplyScalar(n).add(this.origin)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=pn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(pn.copy(this.direction).multiplyScalar(t).add(this.origin),pn.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){ra.copy(e).add(t).multiplyScalar(.5),or.copy(t).sub(e).normalize(),Rn.copy(this.origin).sub(ra);let r=e.distanceTo(t)*.5,a=-this.direction.dot(or),o=Rn.dot(this.direction),l=-Rn.dot(or),c=Rn.lengthSq(),h=Math.abs(1-a*a),u,f,m,x;if(h>0)if(u=a*l-o,f=a*o-l,x=r*h,u>=0)if(f>=-x)if(f<=x){let p=1/h;u*=p,f*=p,m=u*(u+a*f+2*o)+f*(a*u+f+2*l)+c}else f=r,u=Math.max(0,-(a*f+o)),m=-u*u+f*(f+2*l)+c;else f=-r,u=Math.max(0,-(a*f+o)),m=-u*u+f*(f+2*l)+c;else f<=-x?(u=Math.max(0,-(-a*r+o)),f=u>0?-r:Math.min(Math.max(-r,-l),r),m=-u*u+f*(f+2*l)+c):f<=x?(u=0,f=Math.min(Math.max(-r,-l),r),m=f*(f+2*l)+c):(u=Math.max(0,-(a*r+o)),f=u>0?r:Math.min(Math.max(-r,-l),r),m=-u*u+f*(f+2*l)+c);else f=a>0?-r:r,u=Math.max(0,-(a*f+o)),m=-u*u+f*(f+2*l)+c;return n&&n.copy(this.direction).multiplyScalar(u).add(this.origin),s&&s.copy(or).multiplyScalar(f).add(ra),m}intersectSphere(e,t){pn.subVectors(e.center,this.origin);let n=pn.dot(this.direction),s=pn.dot(pn)-n*n,r=e.radius*e.radius;if(s>r)return null;let a=Math.sqrt(r-s),o=n-a,l=n+a;return o<0&&l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,a,o,l,c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,f=this.origin;return c>=0?(n=(e.min.x-f.x)*c,s=(e.max.x-f.x)*c):(n=(e.max.x-f.x)*c,s=(e.min.x-f.x)*c),h>=0?(r=(e.min.y-f.y)*h,a=(e.max.y-f.y)*h):(r=(e.max.y-f.y)*h,a=(e.min.y-f.y)*h),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),u>=0?(o=(e.min.z-f.z)*u,l=(e.max.z-f.z)*u):(o=(e.max.z-f.z)*u,l=(e.min.z-f.z)*u),n>l||o>s)||((o>n||n!==n)&&(n=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,pn)!==null}intersectTriangle(e,t,n,s,r){oa.subVectors(t,e),ar.subVectors(n,e),aa.crossVectors(oa,ar);let a=this.direction.dot(aa),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Rn.subVectors(this.origin,e);let l=o*this.direction.dot(ar.crossVectors(Rn,ar));if(l<0)return null;let c=o*this.direction.dot(oa.cross(Rn));if(c<0||l+c>a)return null;let h=-o*Rn.dot(aa);return h<0?null:this.at(h/a,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},je=class{constructor(){je.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]}set(e,t,n,s,r,a,o,l,c,h,u,f,m,x,p,d){let v=this.elements;return v[0]=e,v[4]=t,v[8]=n,v[12]=s,v[1]=r,v[5]=a,v[9]=o,v[13]=l,v[2]=c,v[6]=h,v[10]=u,v[14]=f,v[3]=m,v[7]=x,v[11]=p,v[15]=d,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new je().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){let t=this.elements,n=e.elements,s=1/xi.setFromMatrixColumn(e,0).length(),r=1/xi.setFromMatrixColumn(e,1).length(),a=1/xi.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,s=e.y,r=e.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){let f=a*h,m=a*u,x=o*h,p=o*u;t[0]=l*h,t[4]=-l*u,t[8]=c,t[1]=m+x*c,t[5]=f-p*c,t[9]=-o*l,t[2]=p-f*c,t[6]=x+m*c,t[10]=a*l}else if(e.order==="YXZ"){let f=l*h,m=l*u,x=c*h,p=c*u;t[0]=f+p*o,t[4]=x*o-m,t[8]=a*c,t[1]=a*u,t[5]=a*h,t[9]=-o,t[2]=m*o-x,t[6]=p+f*o,t[10]=a*l}else if(e.order==="ZXY"){let f=l*h,m=l*u,x=c*h,p=c*u;t[0]=f-p*o,t[4]=-a*u,t[8]=x+m*o,t[1]=m+x*o,t[5]=a*h,t[9]=p-f*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){let f=a*h,m=a*u,x=o*h,p=o*u;t[0]=l*h,t[4]=x*c-m,t[8]=f*c+p,t[1]=l*u,t[5]=p*c+f,t[9]=m*c-x,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){let f=a*l,m=a*c,x=o*l,p=o*c;t[0]=l*h,t[4]=p-f*u,t[8]=x*u+m,t[1]=u,t[5]=a*h,t[9]=-o*h,t[2]=-c*h,t[6]=m*u+x,t[10]=f-p*u}else if(e.order==="XZY"){let f=a*l,m=a*c,x=o*l,p=o*c;t[0]=l*h,t[4]=-u,t[8]=c*h,t[1]=f*u+p,t[5]=a*h,t[9]=m*u-x,t[2]=x*u-m,t[6]=o*h,t[10]=p*u+f}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(C0,e,R0)}lookAt(e,t,n){let s=this.elements;return Pt.subVectors(e,t),Pt.lengthSq()===0&&(Pt.z=1),Pt.normalize(),Ln.crossVectors(n,Pt),Ln.lengthSq()===0&&(Math.abs(n.z)===1?Pt.x+=1e-4:Pt.z+=1e-4,Pt.normalize(),Ln.crossVectors(n,Pt)),Ln.normalize(),lr.crossVectors(Pt,Ln),s[0]=Ln.x,s[4]=lr.x,s[8]=Pt.x,s[1]=Ln.y,s[5]=lr.y,s[9]=Pt.y,s[2]=Ln.z,s[6]=lr.z,s[10]=Pt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],h=n[1],u=n[5],f=n[9],m=n[13],x=n[2],p=n[6],d=n[10],v=n[14],A=n[3],y=n[7],w=n[11],M=n[15],P=s[0],F=s[4],g=s[8],S=s[12],D=s[1],L=s[5],G=s[9],O=s[13],z=s[2],T=s[6],R=s[10],j=s[14],V=s[3],Q=s[7],Z=s[11],ue=s[15];return r[0]=a*P+o*D+l*z+c*V,r[4]=a*F+o*L+l*T+c*Q,r[8]=a*g+o*G+l*R+c*Z,r[12]=a*S+o*O+l*j+c*ue,r[1]=h*P+u*D+f*z+m*V,r[5]=h*F+u*L+f*T+m*Q,r[9]=h*g+u*G+f*R+m*Z,r[13]=h*S+u*O+f*j+m*ue,r[2]=x*P+p*D+d*z+v*V,r[6]=x*F+p*L+d*T+v*Q,r[10]=x*g+p*G+d*R+v*Z,r[14]=x*S+p*O+d*j+v*ue,r[3]=A*P+y*D+w*z+M*V,r[7]=A*F+y*L+w*T+M*Q,r[11]=A*g+y*G+w*R+M*Z,r[15]=A*S+y*O+w*j+M*ue,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],a=e[1],o=e[5],l=e[9],c=e[13],h=e[2],u=e[6],f=e[10],m=e[14],x=e[3],p=e[7],d=e[11],v=e[15];return x*(+r*l*u-s*c*u-r*o*f+n*c*f+s*o*m-n*l*m)+p*(+t*l*m-t*c*f+r*a*f-s*a*m+s*c*h-r*l*h)+d*(+t*c*u-t*o*m-r*a*u+n*a*m+r*o*h-n*c*h)+v*(-s*o*h-t*l*u+t*o*f+s*a*u-n*a*f+n*l*h)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],u=e[9],f=e[10],m=e[11],x=e[12],p=e[13],d=e[14],v=e[15],A=u*d*c-p*f*c+p*l*m-o*d*m-u*l*v+o*f*v,y=x*f*c-h*d*c-x*l*m+a*d*m+h*l*v-a*f*v,w=h*p*c-x*u*c+x*o*m-a*p*m-h*o*v+a*u*v,M=x*u*l-h*p*l-x*o*f+a*p*f+h*o*d-a*u*d,P=t*A+n*y+s*w+r*M;if(P===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let F=1/P;return e[0]=A*F,e[1]=(p*f*r-u*d*r-p*s*m+n*d*m+u*s*v-n*f*v)*F,e[2]=(o*d*r-p*l*r+p*s*c-n*d*c-o*s*v+n*l*v)*F,e[3]=(u*l*r-o*f*r-u*s*c+n*f*c+o*s*m-n*l*m)*F,e[4]=y*F,e[5]=(h*d*r-x*f*r+x*s*m-t*d*m-h*s*v+t*f*v)*F,e[6]=(x*l*r-a*d*r-x*s*c+t*d*c+a*s*v-t*l*v)*F,e[7]=(a*f*r-h*l*r+h*s*c-t*f*c-a*s*m+t*l*m)*F,e[8]=w*F,e[9]=(x*u*r-h*p*r-x*n*m+t*p*m+h*n*v-t*u*v)*F,e[10]=(a*p*r-x*o*r+x*n*c-t*p*c-a*n*v+t*o*v)*F,e[11]=(h*o*r-a*u*r-h*n*c+t*u*c+a*n*m-t*o*m)*F,e[12]=M*F,e[13]=(h*p*s-x*u*s+x*n*f-t*p*f-h*n*d+t*u*d)*F,e[14]=(x*o*s-a*p*s-x*n*l+t*p*l+a*n*d-t*o*d)*F,e[15]=(a*u*s-h*o*s+h*n*l-t*u*l-a*n*f+t*o*f)*F,this}scale(e){let t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),s=Math.sin(t),r=1-n,a=e.x,o=e.y,l=e.z,c=r*a,h=r*o;return this.set(c*a+n,c*o-s*l,c*l+s*o,0,c*o+s*l,h*o+n,h*l-s*a,0,c*l-s*o,h*l+s*a,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,a){return this.set(1,n,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){let s=this.elements,r=t._x,a=t._y,o=t._z,l=t._w,c=r+r,h=a+a,u=o+o,f=r*c,m=r*h,x=r*u,p=a*h,d=a*u,v=o*u,A=l*c,y=l*h,w=l*u,M=n.x,P=n.y,F=n.z;return s[0]=(1-(p+v))*M,s[1]=(m+w)*M,s[2]=(x-y)*M,s[3]=0,s[4]=(m-w)*P,s[5]=(1-(f+v))*P,s[6]=(d+A)*P,s[7]=0,s[8]=(x+y)*F,s[9]=(d-A)*F,s[10]=(1-(f+p))*F,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){let s=this.elements,r=xi.set(s[0],s[1],s[2]).length(),a=xi.set(s[4],s[5],s[6]).length(),o=xi.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),e.x=s[12],e.y=s[13],e.z=s[14],qt.copy(this);let c=1/r,h=1/a,u=1/o;return qt.elements[0]*=c,qt.elements[1]*=c,qt.elements[2]*=c,qt.elements[4]*=h,qt.elements[5]*=h,qt.elements[6]*=h,qt.elements[8]*=u,qt.elements[9]*=u,qt.elements[10]*=u,t.setFromRotationMatrix(qt),n.x=r,n.y=a,n.z=o,this}makePerspective(e,t,n,s,r,a){let o=this.elements,l=2*r/(t-e),c=2*r/(n-s),h=(t+e)/(t-e),u=(n+s)/(n-s),f=-(a+r)/(a-r),m=-2*a*r/(a-r);return o[0]=l,o[4]=0,o[8]=h,o[12]=0,o[1]=0,o[5]=c,o[9]=u,o[13]=0,o[2]=0,o[6]=0,o[10]=f,o[14]=m,o[3]=0,o[7]=0,o[11]=-1,o[15]=0,this}makeOrthographic(e,t,n,s,r,a){let o=this.elements,l=1/(t-e),c=1/(n-s),h=1/(a-r),u=(t+e)*l,f=(n+s)*c,m=(a+r)*h;return o[0]=2*l,o[4]=0,o[8]=0,o[12]=-u,o[1]=0,o[5]=2*c,o[9]=0,o[13]=-f,o[2]=0,o[6]=0,o[10]=-2*h,o[14]=-m,o[3]=0,o[7]=0,o[11]=0,o[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},xi=new W,qt=new je,C0=new W(0,0,0),R0=new W(1,1,1),Ln=new W,lr=new W,Pt=new W,Gh=new je,qh=new Zt,Oi=class{constructor(e=0,t=0,n=0,s=Oi.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let s=e.elements,r=s[0],a=s[4],o=s[8],l=s[1],c=s[5],h=s[9],u=s[2],f=s[6],m=s[10];switch(t){case"XYZ":this._y=Math.asin(Et(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,m),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(f,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Et(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,m),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(Et(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-u,m),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Et(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(f,m),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(Et(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(o,m));break;case"XZY":this._z=Math.asin(-Et(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(f,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,m),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Gh.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Gh,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return qh.setFromEuler(this),this.setFromQuaternion(qh,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Oi.DEFAULT_ORDER="XYZ";var Tr=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},L0=0,Xh=new W,_i=new Zt,mn=new je,cr=new W,os=new W,P0=new W,I0=new Zt,Yh=new W(1,0,0),$h=new W(0,1,0),Kh=new W(0,0,1),D0={type:"added"},Zh={type:"removed"},ut=class extends on{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:L0++}),this.uuid=Ms(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=ut.DEFAULT_UP.clone();let e=new W,t=new Oi,n=new Zt,s=new W(1,1,1);function r(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new je},normalMatrix:{value:new yt}}),this.matrix=new je,this.matrixWorld=new je,this.matrixAutoUpdate=ut.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.matrixWorldAutoUpdate=ut.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.layers=new Tr,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return _i.setFromAxisAngle(e,t),this.quaternion.multiply(_i),this}rotateOnWorldAxis(e,t){return _i.setFromAxisAngle(e,t),this.quaternion.premultiply(_i),this}rotateX(e){return this.rotateOnAxis(Yh,e)}rotateY(e){return this.rotateOnAxis($h,e)}rotateZ(e){return this.rotateOnAxis(Kh,e)}translateOnAxis(e,t){return Xh.copy(e).applyQuaternion(this.quaternion),this.position.add(Xh.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Yh,e)}translateY(e){return this.translateOnAxis($h,e)}translateZ(e){return this.translateOnAxis(Kh,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(mn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?cr.copy(e):cr.set(e,t,n);let s=this.parent;this.updateWorldMatrix(!0,!1),os.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?mn.lookAt(os,cr,this.up):mn.lookAt(cr,os,this.up),this.quaternion.setFromRotationMatrix(mn),s&&(mn.extractRotation(s.matrixWorld),_i.setFromRotationMatrix(mn),this.quaternion.premultiply(_i.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.parent!==null&&e.parent.remove(e),e.parent=this,this.children.push(e),e.dispatchEvent(D0)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Zh)),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){for(let e=0;e<this.children.length;e++){let t=this.children[e];t.parent=null,t.dispatchEvent(Zh)}return this.children.length=0,this}attach(e){return this.updateWorldMatrix(!0,!1),mn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),mn.multiply(e.parent.matrixWorld)),e.applyMatrix4(mn),this.add(e),e.updateWorldMatrix(!1,!0),this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){let a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t){let n=[];this[e]===t&&n.push(this);for(let s=0,r=this.children.length;s<r;s++){let a=this.children[s].getObjectsByProperty(e,t);a.length>0&&(n=n.concat(a))}return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(os,e,P0),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(os,I0,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,s=t.length;n<s;n++){let r=t[n];(r.matrixWorldAutoUpdate===!0||e===!0)&&r.updateMatrixWorld(e)}}updateWorldMatrix(e,t){let n=this.parent;if(e===!0&&n!==null&&n.matrixWorldAutoUpdate===!0&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),t===!0){let s=this.children;for(let r=0,a=s.length;r<a;r++){let o=s[r];o.matrixWorldAutoUpdate===!0&&o.updateWorldMatrix(!1,!0)}}}toJSON(e){let t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.5,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){let u=l[c];r(e.shapes,u)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(e.materials,this.material[l]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){let l=this.animations[o];s.animations.push(r(e.animations,l))}}if(t){let o=a(e.geometries),l=a(e.materials),c=a(e.textures),h=a(e.images),u=a(e.shapes),f=a(e.skeletons),m=a(e.animations),x=a(e.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),f.length>0&&(n.skeletons=f),m.length>0&&(n.animations=m),x.length>0&&(n.nodes=x)}return n.object=s,n;function a(o){let l=[];for(let c in o){let h=o[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){let s=e.children[n];this.add(s.clone())}return this}};ut.DEFAULT_UP=new W(0,1,0);ut.DEFAULT_MATRIX_AUTO_UPDATE=!0;ut.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Xt=new W,gn=new W,la=new W,xn=new W,vi=new W,yi=new W,Jh=new W,ca=new W,ha=new W,ua=new W,Kt=class{constructor(e=new W,t=new W,n=new W){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),Xt.subVectors(e,t),s.cross(Xt);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){Xt.subVectors(s,t),gn.subVectors(n,t),la.subVectors(e,t);let a=Xt.dot(Xt),o=Xt.dot(gn),l=Xt.dot(la),c=gn.dot(gn),h=gn.dot(la),u=a*c-o*o;if(u===0)return r.set(-2,-1,-1);let f=1/u,m=(c*l-o*h)*f,x=(a*h-o*l)*f;return r.set(1-m-x,x,m)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,xn),xn.x>=0&&xn.y>=0&&xn.x+xn.y<=1}static getUV(e,t,n,s,r,a,o,l){return this.getBarycoord(e,t,n,s,xn),l.set(0,0),l.addScaledVector(r,xn.x),l.addScaledVector(a,xn.y),l.addScaledVector(o,xn.z),l}static isFrontFacing(e,t,n,s){return Xt.subVectors(n,t),gn.subVectors(e,t),Xt.cross(gn).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Xt.subVectors(this.c,this.b),gn.subVectors(this.a,this.b),Xt.cross(gn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Kt.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return Kt.getBarycoord(e,this.a,this.b,this.c,t)}getUV(e,t,n,s,r){return Kt.getUV(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return Kt.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Kt.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,s=this.b,r=this.c,a,o;vi.subVectors(s,n),yi.subVectors(r,n),ca.subVectors(e,n);let l=vi.dot(ca),c=yi.dot(ca);if(l<=0&&c<=0)return t.copy(n);ha.subVectors(e,s);let h=vi.dot(ha),u=yi.dot(ha);if(h>=0&&u<=h)return t.copy(s);let f=l*u-h*c;if(f<=0&&l>=0&&h<=0)return a=l/(l-h),t.copy(n).addScaledVector(vi,a);ua.subVectors(e,r);let m=vi.dot(ua),x=yi.dot(ua);if(x>=0&&m<=x)return t.copy(r);let p=m*c-l*x;if(p<=0&&c>=0&&x<=0)return o=c/(c-x),t.copy(n).addScaledVector(yi,o);let d=h*x-m*u;if(d<=0&&u-h>=0&&m-x>=0)return Jh.subVectors(r,s),o=(u-h)/(u-h+(m-x)),t.copy(s).addScaledVector(Jh,o);let v=1/(d+p+f);return a=p*v,o=f*v,t.copy(n).addScaledVector(vi,a).addScaledVector(yi,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},N0=0,ni=class extends on{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:N0++}),this.uuid=Ms(),this.name="",this.type="Material",this.blending=Ri,this.side=Nn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.blendSrc=Su,this.blendDst=Eu,this.blendEquation=Ti,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.depthFunc=ba,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=S0,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=$o,this.stencilZFail=$o,this.stencilZPass=$o,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){console.warn("THREE.Material: '"+t+"' parameter is undefined.");continue}let s=this[t];if(s===void 0){console.warn("THREE."+this.type+": '"+t+"' is not a property of this material.");continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let n={metadata:{version:4.5,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Ri&&(n.blending=this.blending),this.side!==Nn&&(n.side=this.side),this.vertexColors&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=this.transparent),n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.stencilWrite=this.stencilWrite,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaToCoverage===!0&&(n.alphaToCoverage=this.alphaToCoverage),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=this.premultipliedAlpha),this.forceSinglePass===!0&&(n.forceSinglePass=this.forceSinglePass),this.wireframe===!0&&(n.wireframe=this.wireframe),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=this.flatShading),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let a=[];for(let o in r){let l=r[o];delete l.metadata,a.push(l)}return a}if(t){let r=s(e.textures),a=s(e.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}},Cr=class extends ni{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new qe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=Au,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},nt=new W,hr=new Ae,Bt=class{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=kh,this.updateRange={offset:0,count:-1},this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)hr.fromBufferAttribute(this,t),hr.applyMatrix3(e),this.setXY(t,hr.x,hr.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)nt.fromBufferAttribute(this,t),nt.applyMatrix3(e),this.setXYZ(t,nt.x,nt.y,nt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)nt.fromBufferAttribute(this,t),nt.applyMatrix4(e),this.setXYZ(t,nt.x,nt.y,nt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)nt.fromBufferAttribute(this,t),nt.applyNormalMatrix(e),this.setXYZ(t,nt.x,nt.y,nt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)nt.fromBufferAttribute(this,t),nt.transformDirection(e),this.setXYZ(t,nt.x,nt.y,nt.z);return this}set(e,t=0){return this.array.set(e,t),this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=tr(t,this.array)),t}setX(e,t){return this.normalized&&(t=Lt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=tr(t,this.array)),t}setY(e,t){return this.normalized&&(t=Lt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=tr(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Lt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=tr(t,this.array)),t}setW(e,t){return this.normalized&&(t=Lt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=Lt(t,this.array),n=Lt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=Lt(t,this.array),n=Lt(n,this.array),s=Lt(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=Lt(t,this.array),n=Lt(n,this.array),s=Lt(s,this.array),r=Lt(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==kh&&(e.usage=this.usage),(this.updateRange.offset!==0||this.updateRange.count!==-1)&&(e.updateRange=this.updateRange),e}copyColorsArray(){console.error("THREE.BufferAttribute: copyColorsArray() was removed in r144.")}copyVector2sArray(){console.error("THREE.BufferAttribute: copyVector2sArray() was removed in r144.")}copyVector3sArray(){console.error("THREE.BufferAttribute: copyVector3sArray() was removed in r144.")}copyVector4sArray(){console.error("THREE.BufferAttribute: copyVector4sArray() was removed in r144.")}};var Rr=class extends Bt{constructor(e,t,n){super(new Uint16Array(e),t,n)}};var Lr=class extends Bt{constructor(e,t,n){super(new Uint32Array(e),t,n)}};var yn=class extends Bt{constructor(e,t,n){super(new Float32Array(e),t,n)}};var O0=0,Ut=new je,fa=new ut,bi=new W,It=new ti,as=new ti,ct=new W,wn=class extends on{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:O0++}),this.uuid=Ms(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Lu(e)?Lr:Rr)(e,1):this.index=e,this}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new yt().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Ut.makeRotationFromQuaternion(e),this.applyMatrix4(Ut),this}rotateX(e){return Ut.makeRotationX(e),this.applyMatrix4(Ut),this}rotateY(e){return Ut.makeRotationY(e),this.applyMatrix4(Ut),this}rotateZ(e){return Ut.makeRotationZ(e),this.applyMatrix4(Ut),this}translate(e,t,n){return Ut.makeTranslation(e,t,n),this.applyMatrix4(Ut),this}scale(e,t,n){return Ut.makeScale(e,t,n),this.applyMatrix4(Ut),this}lookAt(e){return fa.lookAt(e),fa.updateMatrix(),this.applyMatrix4(fa.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(bi).negate(),this.translate(bi.x,bi.y,bi.z),this}setFromPoints(e){let t=[];for(let n=0,s=e.length;n<s;n++){let r=e[n];t.push(r.x,r.y,r.z||0)}return this.setAttribute("position",new yn(t,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ti);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new W(-1/0,-1/0,-1/0),new W(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){let r=t[n];It.setFromBufferAttribute(r),this.morphTargetsRelative?(ct.addVectors(this.boundingBox.min,It.min),this.boundingBox.expandByPoint(ct),ct.addVectors(this.boundingBox.max,It.max),this.boundingBox.expandByPoint(ct)):(this.boundingBox.expandByPoint(It.min),this.boundingBox.expandByPoint(It.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new _s);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new W,1/0);return}if(e){let n=this.boundingSphere.center;if(It.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){let o=t[r];as.setFromBufferAttribute(o),this.morphTargetsRelative?(ct.addVectors(It.min,as.min),It.expandByPoint(ct),ct.addVectors(It.max,as.max),It.expandByPoint(ct)):(It.expandByPoint(as.min),It.expandByPoint(as.max))}It.getCenter(n);let s=0;for(let r=0,a=e.count;r<a;r++)ct.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(ct));if(t)for(let r=0,a=t.length;r<a;r++){let o=t[r],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)ct.fromBufferAttribute(o,c),l&&(bi.fromBufferAttribute(e,c),ct.add(bi)),s=Math.max(s,n.distanceToSquared(ct))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=e.array,s=t.position.array,r=t.normal.array,a=t.uv.array,o=s.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Bt(new Float32Array(4*o),4));let l=this.getAttribute("tangent").array,c=[],h=[];for(let D=0;D<o;D++)c[D]=new W,h[D]=new W;let u=new W,f=new W,m=new W,x=new Ae,p=new Ae,d=new Ae,v=new W,A=new W;function y(D,L,G){u.fromArray(s,D*3),f.fromArray(s,L*3),m.fromArray(s,G*3),x.fromArray(a,D*2),p.fromArray(a,L*2),d.fromArray(a,G*2),f.sub(u),m.sub(u),p.sub(x),d.sub(x);let O=1/(p.x*d.y-d.x*p.y);isFinite(O)&&(v.copy(f).multiplyScalar(d.y).addScaledVector(m,-p.y).multiplyScalar(O),A.copy(m).multiplyScalar(p.x).addScaledVector(f,-d.x).multiplyScalar(O),c[D].add(v),c[L].add(v),c[G].add(v),h[D].add(A),h[L].add(A),h[G].add(A))}let w=this.groups;w.length===0&&(w=[{start:0,count:n.length}]);for(let D=0,L=w.length;D<L;++D){let G=w[D],O=G.start,z=G.count;for(let T=O,R=O+z;T<R;T+=3)y(n[T+0],n[T+1],n[T+2])}let M=new W,P=new W,F=new W,g=new W;function S(D){F.fromArray(r,D*3),g.copy(F);let L=c[D];M.copy(L),M.sub(F.multiplyScalar(F.dot(L))).normalize(),P.crossVectors(g,L);let O=P.dot(h[D])<0?-1:1;l[D*4]=M.x,l[D*4+1]=M.y,l[D*4+2]=M.z,l[D*4+3]=O}for(let D=0,L=w.length;D<L;++D){let G=w[D],O=G.start,z=G.count;for(let T=O,R=O+z;T<R;T+=3)S(n[T+0]),S(n[T+1]),S(n[T+2])}}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Bt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let f=0,m=n.count;f<m;f++)n.setXYZ(f,0,0,0);let s=new W,r=new W,a=new W,o=new W,l=new W,c=new W,h=new W,u=new W;if(e)for(let f=0,m=e.count;f<m;f+=3){let x=e.getX(f+0),p=e.getX(f+1),d=e.getX(f+2);s.fromBufferAttribute(t,x),r.fromBufferAttribute(t,p),a.fromBufferAttribute(t,d),h.subVectors(a,r),u.subVectors(s,r),h.cross(u),o.fromBufferAttribute(n,x),l.fromBufferAttribute(n,p),c.fromBufferAttribute(n,d),o.add(h),l.add(h),c.add(h),n.setXYZ(x,o.x,o.y,o.z),n.setXYZ(p,l.x,l.y,l.z),n.setXYZ(d,c.x,c.y,c.z)}else for(let f=0,m=t.count;f<m;f+=3)s.fromBufferAttribute(t,f+0),r.fromBufferAttribute(t,f+1),a.fromBufferAttribute(t,f+2),h.subVectors(a,r),u.subVectors(s,r),h.cross(u),n.setXYZ(f+0,h.x,h.y,h.z),n.setXYZ(f+1,h.x,h.y,h.z),n.setXYZ(f+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}merge(){return console.error("THREE.BufferGeometry.merge() has been removed. Use THREE.BufferGeometryUtils.mergeBufferGeometries() instead."),this}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)ct.fromBufferAttribute(e,t),ct.normalize(),e.setXYZ(t,ct.x,ct.y,ct.z)}toNonIndexed(){function e(o,l){let c=o.array,h=o.itemSize,u=o.normalized,f=new c.constructor(l.length*h),m=0,x=0;for(let p=0,d=l.length;p<d;p++){o.isInterleavedBufferAttribute?m=l[p]*o.data.stride+o.offset:m=l[p]*h;for(let v=0;v<h;v++)f[x++]=c[m++]}return new Bt(f,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new wn,n=this.index.array,s=this.attributes;for(let o in s){let l=s[o],c=e(l,n);t.setAttribute(o,c)}let r=this.morphAttributes;for(let o in r){let l=[],c=r[o];for(let h=0,u=c.length;h<u;h++){let f=c[h],m=e(f,n);l.push(m)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;let a=this.groups;for(let o=0,l=a.length;o<l;o++){let c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){let e={metadata:{version:4.5,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let l in n){let c=n[l];e.data.attributes[l]=c.toJSON(e.data)}let s={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],h=[];for(let u=0,f=c.length;u<f;u++){let m=c[u];h.push(m.toJSON(e.data))}h.length>0&&(s[l]=h,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone(t));let s=e.attributes;for(let c in s){let h=s[c];this.setAttribute(c,h.clone(t))}let r=e.morphAttributes;for(let c in r){let h=[],u=r[c];for(let f=0,m=u.length;f<m;f++)h.push(u[f].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let c=0,h=a.length;c<h;c++){let u=a[c];this.addGroup(u.start,u.count,u.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,e.parameters!==void 0&&(this.parameters=Object.assign({},e.parameters)),this}dispose(){this.dispatchEvent({type:"dispose"})}},jh=new je,wi=new Ra,da=new _s,ls=new W,cs=new W,hs=new W,pa=new W,ur=new W,fr=new Ae,dr=new Ae,pr=new Ae,ma=new W,mr=new W,At=class extends ut{constructor(e=new wn,t=new Cr){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(s,e);let o=this.morphTargetInfluences;if(r&&o){ur.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let h=o[l],u=r[l];h!==0&&(pa.fromBufferAttribute(u,e),a?ur.addScaledVector(pa,h):ur.addScaledVector(pa.sub(t),h))}t.add(ur)}return this.isSkinnedMesh&&this.boneTransform(e,t),t}raycast(e,t){let n=this.geometry,s=this.material,r=this.matrixWorld;if(s===void 0||(n.boundingSphere===null&&n.computeBoundingSphere(),da.copy(n.boundingSphere),da.applyMatrix4(r),e.ray.intersectsSphere(da)===!1)||(jh.copy(r).invert(),wi.copy(e.ray).applyMatrix4(jh),n.boundingBox!==null&&wi.intersectsBox(n.boundingBox)===!1))return;let a,o=n.index,l=n.attributes.position,c=n.attributes.uv,h=n.attributes.uv2,u=n.groups,f=n.drawRange;if(o!==null)if(Array.isArray(s))for(let m=0,x=u.length;m<x;m++){let p=u[m],d=s[p.materialIndex],v=Math.max(p.start,f.start),A=Math.min(o.count,Math.min(p.start+p.count,f.start+f.count));for(let y=v,w=A;y<w;y+=3){let M=o.getX(y),P=o.getX(y+1),F=o.getX(y+2);a=gr(this,d,e,wi,c,h,M,P,F),a&&(a.faceIndex=Math.floor(y/3),a.face.materialIndex=p.materialIndex,t.push(a))}}else{let m=Math.max(0,f.start),x=Math.min(o.count,f.start+f.count);for(let p=m,d=x;p<d;p+=3){let v=o.getX(p),A=o.getX(p+1),y=o.getX(p+2);a=gr(this,s,e,wi,c,h,v,A,y),a&&(a.faceIndex=Math.floor(p/3),t.push(a))}}else if(l!==void 0)if(Array.isArray(s))for(let m=0,x=u.length;m<x;m++){let p=u[m],d=s[p.materialIndex],v=Math.max(p.start,f.start),A=Math.min(l.count,Math.min(p.start+p.count,f.start+f.count));for(let y=v,w=A;y<w;y+=3){let M=y,P=y+1,F=y+2;a=gr(this,d,e,wi,c,h,M,P,F),a&&(a.faceIndex=Math.floor(y/3),a.face.materialIndex=p.materialIndex,t.push(a))}}else{let m=Math.max(0,f.start),x=Math.min(l.count,f.start+f.count);for(let p=m,d=x;p<d;p+=3){let v=p,A=p+1,y=p+2;a=gr(this,s,e,wi,c,h,v,A,y),a&&(a.faceIndex=Math.floor(p/3),t.push(a))}}}};function F0(i,e,t,n,s,r,a,o){let l;if(e.side===Dt?l=n.intersectTriangle(a,r,s,!0,o):l=n.intersectTriangle(s,r,a,e.side===Nn,o),l===null)return null;mr.copy(o),mr.applyMatrix4(i.matrixWorld);let c=t.ray.origin.distanceTo(mr);return c<t.near||c>t.far?null:{distance:c,point:mr.clone(),object:i}}function gr(i,e,t,n,s,r,a,o,l){i.getVertexPosition(a,ls),i.getVertexPosition(o,cs),i.getVertexPosition(l,hs);let c=F0(i,e,t,n,ls,cs,hs,ma);if(c){s&&(fr.fromBufferAttribute(s,a),dr.fromBufferAttribute(s,o),pr.fromBufferAttribute(s,l),c.uv=Kt.getUV(ma,ls,cs,hs,fr,dr,pr,new Ae)),r&&(fr.fromBufferAttribute(r,a),dr.fromBufferAttribute(r,o),pr.fromBufferAttribute(r,l),c.uv2=Kt.getUV(ma,ls,cs,hs,fr,dr,pr,new Ae));let h={a,b:o,c:l,normal:new W,materialIndex:0};Kt.getNormal(ls,cs,hs,h.normal),c.face=h}return c}var Jt=class extends wn{constructor(e=1,t=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};let o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);let l=[],c=[],h=[],u=[],f=0,m=0;x("z","y","x",-1,-1,n,t,e,a,r,0),x("z","y","x",1,-1,n,t,-e,a,r,1),x("x","z","y",1,1,e,n,t,s,a,2),x("x","z","y",1,-1,e,n,-t,s,a,3),x("x","y","z",1,-1,e,t,n,s,r,4),x("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new yn(c,3)),this.setAttribute("normal",new yn(h,3)),this.setAttribute("uv",new yn(u,2));function x(p,d,v,A,y,w,M,P,F,g,S){let D=w/F,L=M/g,G=w/2,O=M/2,z=P/2,T=F+1,R=g+1,j=0,V=0,Q=new W;for(let Z=0;Z<R;Z++){let ue=Z*L-O;for(let B=0;B<T;B++){let ee=B*D-G;Q[p]=ee*A,Q[d]=ue*y,Q[v]=z,c.push(Q.x,Q.y,Q.z),Q[p]=0,Q[d]=0,Q[v]=P>0?1:-1,h.push(Q.x,Q.y,Q.z),u.push(B/F),u.push(1-Z/g),j+=1}}for(let Z=0;Z<g;Z++)for(let ue=0;ue<F;ue++){let B=f+ue+T*Z,ee=f+ue+T*(Z+1),re=f+(ue+1)+T*(Z+1),se=f+(ue+1)+T*Z;l.push(B,ee,se),l.push(ee,re,se),V+=6}o.addGroup(m,V,S),m+=V,f+=j}}static fromJSON(e){return new Jt(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};function Fi(i){let e={};for(let t in i){e[t]={};for(let n in i[t]){let s=i[t][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?e[t][n]=s.clone():Array.isArray(s)?e[t][n]=s.slice():e[t][n]=s}}return e}function _t(i){let e={};for(let t=0;t<i.length;t++){let n=Fi(i[t]);for(let s in n)e[s]=n[s]}return e}function z0(i){let e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function Iu(i){return i.getRenderTarget()===null&&i.outputEncoding===Ye?nn:gs}var U0={clone:Fi,merge:_t},k0=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,B0=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Mn=class extends ni{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=k0,this.fragmentShader=B0,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv2:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Fi(e.uniforms),this.uniformsGroups=z0(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let s in this.uniforms){let a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}},Pr=class extends ut{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new je,this.projectionMatrix=new je,this.projectionMatrixInverse=new je}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(-t[8],-t[9],-t[10]).normalize()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},ft=class extends Pr{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=Hh*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(Ko*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Hh*2*Math.atan(Math.tan(Ko*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(e,t,n,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(Ko*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s,a=this.view;if(this.view!==null&&this.view.enabled){let l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*s/l,t-=a.offsetY*n/c,s*=a.width/l,n*=a.height/c}let o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},Mi=-90,Si=1,La=class extends ut{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n;let s=new ft(Mi,Si,e,t);s.layers=this.layers,s.up.set(0,1,0),s.lookAt(1,0,0),this.add(s);let r=new ft(Mi,Si,e,t);r.layers=this.layers,r.up.set(0,1,0),r.lookAt(-1,0,0),this.add(r);let a=new ft(Mi,Si,e,t);a.layers=this.layers,a.up.set(0,0,-1),a.lookAt(0,1,0),this.add(a);let o=new ft(Mi,Si,e,t);o.layers=this.layers,o.up.set(0,0,1),o.lookAt(0,-1,0),this.add(o);let l=new ft(Mi,Si,e,t);l.layers=this.layers,l.up.set(0,1,0),l.lookAt(0,0,1),this.add(l);let c=new ft(Mi,Si,e,t);c.layers=this.layers,c.up.set(0,1,0),c.lookAt(0,0,-1),this.add(c)}update(e,t){this.parent===null&&this.updateMatrixWorld();let n=this.renderTarget,[s,r,a,o,l,c]=this.children,h=e.getRenderTarget(),u=e.toneMapping,f=e.xr.enabled;e.toneMapping=vn,e.xr.enabled=!1;let m=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0),e.render(t,s),e.setRenderTarget(n,1),e.render(t,r),e.setRenderTarget(n,2),e.render(t,a),e.setRenderTarget(n,3),e.render(t,o),e.setRenderTarget(n,4),e.render(t,l),n.texture.generateMipmaps=m,e.setRenderTarget(n,5),e.render(t,c),e.setRenderTarget(h),e.toneMapping=u,e.xr.enabled=f,n.texture.needsPMREMUpdate=!0}},Ir=class extends ht{constructor(e,t,n,s,r,a,o,l,c,h){e=e!==void 0?e:[],t=t!==void 0?t:Ii,super(e,t,n,s,r,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},Pa=class extends bn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new Ir(s,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.encoding),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:kt}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.encoding=t.encoding,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new Jt(5,5,5),r=new Mn({name:"CubemapFromEquirect",uniforms:Fi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Dt,blending:Dn});r.uniforms.tEquirect.value=t;let a=new At(s,r),o=t.minFilter;return t.minFilter===ps&&(t.minFilter=kt),new La(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t,n,s){let r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,s);e.setRenderTarget(r)}},ga=new W,H0=new W,V0=new yt,_n=class{constructor(e=new W(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let s=ga.subVectors(n,t).cross(H0.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(this.normal).multiplyScalar(-this.distanceToPoint(e)).add(e)}intersectLine(e,t){let n=e.delta(ga),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(n).multiplyScalar(r).add(e.start)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||V0.getNormalMatrix(e),s=this.coplanarPoint(ga).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},Ei=new _s,xr=new W,vs=class{constructor(e=new _n,t=new _n,n=new _n,s=new _n,r=new _n,a=new _n){this.planes=[e,t,n,s,r,a]}set(e,t,n,s,r,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e){let t=this.planes,n=e.elements,s=n[0],r=n[1],a=n[2],o=n[3],l=n[4],c=n[5],h=n[6],u=n[7],f=n[8],m=n[9],x=n[10],p=n[11],d=n[12],v=n[13],A=n[14],y=n[15];return t[0].setComponents(o-s,u-l,p-f,y-d).normalize(),t[1].setComponents(o+s,u+l,p+f,y+d).normalize(),t[2].setComponents(o+r,u+c,p+m,y+v).normalize(),t[3].setComponents(o-r,u-c,p-m,y-v).normalize(),t[4].setComponents(o-a,u-h,p-x,y-A).normalize(),t[5].setComponents(o+a,u+h,p+x,y+A).normalize(),this}intersectsObject(e){let t=e.geometry;return t.boundingSphere===null&&t.computeBoundingSphere(),Ei.copy(t.boundingSphere).applyMatrix4(e.matrixWorld),this.intersectsSphere(Ei)}intersectsSprite(e){return Ei.center.set(0,0,0),Ei.radius=.7071067811865476,Ei.applyMatrix4(e.matrixWorld),this.intersectsSphere(Ei)}intersectsSphere(e){let t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let s=t[n];if(xr.x=s.normal.x>0?e.max.x:e.min.x,xr.y=s.normal.y>0?e.max.y:e.min.y,xr.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(xr)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};function Du(){let i=null,e=!1,t=null,n=null;function s(r,a){t(r,a),n=i.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function W0(i,e){let t=e.isWebGL2,n=new WeakMap;function s(c,h){let u=c.array,f=c.usage,m=i.createBuffer();i.bindBuffer(h,m),i.bufferData(h,u,f),c.onUploadCallback();let x;if(u instanceof Float32Array)x=5126;else if(u instanceof Uint16Array)if(c.isFloat16BufferAttribute)if(t)x=5131;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else x=5123;else if(u instanceof Int16Array)x=5122;else if(u instanceof Uint32Array)x=5125;else if(u instanceof Int32Array)x=5124;else if(u instanceof Int8Array)x=5120;else if(u instanceof Uint8Array)x=5121;else if(u instanceof Uint8ClampedArray)x=5121;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+u);return{buffer:m,type:x,bytesPerElement:u.BYTES_PER_ELEMENT,version:c.version}}function r(c,h,u){let f=h.array,m=h.updateRange;i.bindBuffer(u,c),m.count===-1?i.bufferSubData(u,0,f):(t?i.bufferSubData(u,m.offset*f.BYTES_PER_ELEMENT,f,m.offset,m.count):i.bufferSubData(u,m.offset*f.BYTES_PER_ELEMENT,f.subarray(m.offset,m.offset+m.count)),m.count=-1),h.onUploadCallback()}function a(c){return c.isInterleavedBufferAttribute&&(c=c.data),n.get(c)}function o(c){c.isInterleavedBufferAttribute&&(c=c.data);let h=n.get(c);h&&(i.deleteBuffer(h.buffer),n.delete(c))}function l(c,h){if(c.isGLBufferAttribute){let f=n.get(c);(!f||f.version<c.version)&&n.set(c,{buffer:c.buffer,type:c.type,bytesPerElement:c.elementSize,version:c.version});return}c.isInterleavedBufferAttribute&&(c=c.data);let u=n.get(c);u===void 0?n.set(c,s(c,h)):u.version<c.version&&(r(u.buffer,c,h),u.version=c.version)}return{get:a,remove:o,update:l}}var ys=class extends wn{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};let r=e/2,a=t/2,o=Math.floor(n),l=Math.floor(s),c=o+1,h=l+1,u=e/o,f=t/l,m=[],x=[],p=[],d=[];for(let v=0;v<h;v++){let A=v*f-a;for(let y=0;y<c;y++){let w=y*u-r;x.push(w,-A,0),p.push(0,0,1),d.push(y/o),d.push(1-v/l)}}for(let v=0;v<l;v++)for(let A=0;A<o;A++){let y=A+c*v,w=A+c*(v+1),M=A+1+c*(v+1),P=A+1+c*v;m.push(y,w,P),m.push(w,M,P)}this.setIndex(m),this.setAttribute("position",new yn(x,3)),this.setAttribute("normal",new yn(p,3)),this.setAttribute("uv",new yn(d,2))}static fromJSON(e){return new ys(e.width,e.height,e.widthSegments,e.heightSegments)}},G0=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vUv ).g;
#endif`,q0=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,X0=`#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`,Y0=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,$0=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vUv2 ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometry.normal, geometry.viewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,K0=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Z0="vec3 transformed = vec3( position );",J0=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,j0=`vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 f0, const in float f90, const in float roughness ) {
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
	float D = D_GGX( alpha, dotNH );
	return F * ( V * D );
}
#ifdef USE_IRIDESCENCE
	vec3 BRDF_GGX_Iridescence( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 f0, const in float f90, const in float iridescence, const in vec3 iridescenceFresnel, const in float roughness ) {
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = mix( F_Schlick( f0, f90, dotVH ), iridescenceFresnel, iridescence );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif`,Q0=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			 return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float R21 = R12;
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,ex=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vUv );
		vec2 dSTdy = dFdy( vUv );
		float Hll = bumpScale * texture2D( bumpMap, vUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = dFdx( surf_pos.xyz );
		vec3 vSigmaY = dFdy( surf_pos.xyz );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,tx=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#pragma unroll_loop_start
	for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
		plane = clippingPlanes[ i ];
		if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
	}
	#pragma unroll_loop_end
	#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
		bool clipped = true;
		#pragma unroll_loop_start
		for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
		}
		#pragma unroll_loop_end
		if ( clipped ) discard;
	#endif
#endif`,nx=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,ix=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,sx=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,rx=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,ox=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,ax=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,lx=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,cx=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
struct GeometricContext {
	vec3 position;
	vec3 normal;
	vec3 viewDir;
#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal;
#endif
};
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
float luminance( const in vec3 rgb ) {
	const vec3 weights = vec3( 0.2126729, 0.7151522, 0.0721750 );
	return dot( weights, rgb );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}`,hx=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_v0 0.339
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_v1 0.276
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_v4 0.046
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_v5 0.016
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_v6 0.0038
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,ux=`vec3 transformedNormal = objectNormal;
#ifdef USE_INSTANCING
	mat3 m = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( m[ 0 ], m[ 0 ] ), dot( m[ 1 ], m[ 1 ] ), dot( m[ 2 ], m[ 2 ] ) );
	transformedNormal = m * transformedNormal;
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	vec3 transformedTangent = ( modelViewMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,fx=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,dx=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vUv ).x * displacementScale + displacementBias );
#endif`,px=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,mx=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,gx="gl_FragColor = linearToOutputTexel( gl_FragColor );",xx=`vec4 LinearToLinear( in vec4 value ) {
	return value;
}
vec4 LinearTosRGB( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,_x=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,vx=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,yx=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,bx=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,wx=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Mx=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Sx=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Ex=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Ax=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Tx=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Cx=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vUv2 );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,Rx=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Lx=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Px=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in GeometricContext geometry, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometry.normal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in GeometricContext geometry, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Ix=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
uniform vec3 lightProbe[ 9 ];
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	#if defined ( PHYSICALLY_CORRECT_LIGHTS )
		float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
		if ( cutoffDistance > 0.0 ) {
			distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
		}
		return distanceFalloff;
	#else
		if ( cutoffDistance > 0.0 && decayExponent > 0.0 ) {
			return pow( saturate( - lightDistance / cutoffDistance + 1.0 ), decayExponent );
		}
		return 1.0;
	#endif
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, const in GeometricContext geometry, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in GeometricContext geometry, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometry.position;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in GeometricContext geometry, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometry.position;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Dx=`#if defined( USE_ENVMAP )
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#if defined( ENVMAP_TYPE_CUBE_UV )
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#if defined( ENVMAP_TYPE_CUBE_UV )
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
#endif`,Nx=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Ox=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in GeometricContext geometry, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometry.normal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in GeometricContext geometry, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Fx=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,zx=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in GeometricContext geometry, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometry.normal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometry.viewDir, geometry.normal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in GeometricContext geometry, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Ux=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( geometryNormal ) ), abs( dFdy( geometryNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULARINTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vUv ).a;
		#endif
		#ifdef USE_SPECULARCOLORMAP
			specularColorFactor *= texture2D( specularColorMap, vUv ).rgb;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEENCOLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEENROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vUv ).a;
	#endif
#endif`,kx=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
};
vec3 clearcoatSpecular = vec3( 0.0 );
vec3 sheenSpecular = vec3( 0.0 );
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in GeometricContext geometry, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometry.normal;
		vec3 viewDir = geometry.viewDir;
		vec3 position = geometry.position;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in GeometricContext geometry, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometry.normal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometry.clearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecular += ccIrradiance * BRDF_GGX( directLight.direction, geometry.viewDir, geometry.clearcoatNormal, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecular += irradiance * BRDF_Sheen( directLight.direction, geometry.viewDir, geometry.normal, material.sheenColor, material.sheenRoughness );
	#endif
	#ifdef USE_IRIDESCENCE
		reflectedLight.directSpecular += irradiance * BRDF_GGX_Iridescence( directLight.direction, geometry.viewDir, geometry.normal, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness );
	#else
		reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometry.viewDir, geometry.normal, material.specularColor, material.specularF90, material.roughness );
	#endif
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in GeometricContext geometry, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in GeometricContext geometry, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecular += clearcoatRadiance * EnvironmentBRDF( geometry.clearcoatNormal, geometry.viewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecular += irradiance * material.sheenColor * IBLSheenBRDF( geometry.normal, geometry.viewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometry.normal, geometry.viewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometry.normal, geometry.viewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Bx=`
GeometricContext geometry;
geometry.position = - vViewPosition;
geometry.normal = normal;
geometry.viewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
#ifdef USE_CLEARCOAT
	geometry.clearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometry.viewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometry, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometry, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometry, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometry, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, geometry, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometry, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometry, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	irradiance += getLightProbeIrradiance( lightProbe, geometry.normal );
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometry.normal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Hx=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vUv2 );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometry.normal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	radiance += getIBLRadiance( geometry.viewDir, geometry.normal, material.roughness );
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometry.viewDir, geometry.clearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Vx=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometry, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometry, material, reflectedLight );
#endif`,Wx=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Gx=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,qx=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,Xx=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,Yx=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,$x=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Kx=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Zx=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	uniform mat3 uvTransform;
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Jx=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vUv );
	metalnessFactor *= texelMetalness.b;
#endif`,jx=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Qx=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,e_=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		objectNormal += morphNormal0 * morphTargetInfluences[ 0 ];
		objectNormal += morphNormal1 * morphTargetInfluences[ 1 ];
		objectNormal += morphNormal2 * morphTargetInfluences[ 2 ];
		objectNormal += morphNormal3 * morphTargetInfluences[ 3 ];
	#endif
#endif`,t_=`#ifdef USE_MORPHTARGETS
	uniform float morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
		uniform sampler2DArray morphTargetsTexture;
		uniform ivec2 morphTargetsTextureSize;
		vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
			int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
			int y = texelIndex / morphTargetsTextureSize.x;
			int x = texelIndex - y * morphTargetsTextureSize.x;
			ivec3 morphUV = ivec3( x, y, morphTargetIndex );
			return texelFetch( morphTargetsTexture, morphUV, 0 );
		}
	#else
		#ifndef USE_MORPHNORMALS
			uniform float morphTargetInfluences[ 8 ];
		#else
			uniform float morphTargetInfluences[ 4 ];
		#endif
	#endif
#endif`,n_=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		transformed += morphTarget0 * morphTargetInfluences[ 0 ];
		transformed += morphTarget1 * morphTargetInfluences[ 1 ];
		transformed += morphTarget2 * morphTargetInfluences[ 2 ];
		transformed += morphTarget3 * morphTargetInfluences[ 3 ];
		#ifndef USE_MORPHNORMALS
			transformed += morphTarget4 * morphTargetInfluences[ 4 ];
			transformed += morphTarget5 * morphTargetInfluences[ 5 ];
			transformed += morphTarget6 * morphTargetInfluences[ 6 ];
			transformed += morphTarget7 * morphTargetInfluences[ 7 ];
		#endif
	#endif
#endif`,i_=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	#ifdef USE_TANGENT
		vec3 tangent = normalize( vTangent );
		vec3 bitangent = normalize( vBitangent );
		#ifdef DOUBLE_SIDED
			tangent = tangent * faceDirection;
			bitangent = bitangent * faceDirection;
		#endif
		#if defined( TANGENTSPACE_NORMALMAP ) || defined( USE_CLEARCOAT_NORMALMAP )
			mat3 vTBN = mat3( tangent, bitangent, normal );
		#endif
	#endif
#endif
vec3 geometryNormal = normal;`,s_=`#ifdef OBJECTSPACE_NORMALMAP
	normal = texture2D( normalMap, vUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( TANGENTSPACE_NORMALMAP )
	vec3 mapN = texture2D( normalMap, vUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	#ifdef USE_TANGENT
		normal = normalize( vTBN * mapN );
	#else
		normal = perturbNormal2Arb( - vViewPosition, normal, mapN, faceDirection );
	#endif
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,r_=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,o_=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,a_=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,l_=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef OBJECTSPACE_NORMALMAP
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( TANGENTSPACE_NORMALMAP ) || defined ( USE_CLEARCOAT_NORMALMAP ) )
	vec3 perturbNormal2Arb( vec3 eye_pos, vec3 surf_norm, vec3 mapN, float faceDirection ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( vUv.st );
		vec2 st1 = dFdy( vUv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : faceDirection * inversesqrt( det );
		return normalize( T * ( mapN.x * scale ) + B * ( mapN.y * scale ) + N * mapN.z );
	}
#endif`,c_=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = geometryNormal;
#endif`,h_=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	#ifdef USE_TANGENT
		clearcoatNormal = normalize( vTBN * clearcoatMapN );
	#else
		clearcoatNormal = perturbNormal2Arb( - vViewPosition, clearcoatNormal, clearcoatMapN, faceDirection );
	#endif
#endif`,u_=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif`,f_=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,d_=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha + 0.1;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,p_=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;
const vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256., 256. );
const vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );
const float ShiftRight8 = 1. / 256.;
vec4 packDepthToRGBA( const in float v ) {
	vec4 r = vec4( fract( v * PackFactors ), v );
	r.yzw -= r.xyz * ShiftRight8;	return r * PackUpscale;
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors );
}
vec2 packDepthToRG( in highp float v ) {
	return packDepthToRGBA( v ).yx;
}
float unpackRGToDepth( const in highp vec2 v ) {
	return unpackRGBAToDepth( vec4( v.xy, 0.0, 0.0 ) );
}
vec4 pack2HalfToRGBA( vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float linearClipZ, const in float near, const in float far ) {
	return linearClipZ * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float invClipZ, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * invClipZ - far );
}`,m_=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,g_=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,x_=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,__=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,v_=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vUv );
	roughnessFactor *= texelRoughness.g;
#endif`,y_=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,b_=`#if NUM_SPOT_LIGHT_COORDS > 0
  varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
  uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return shadow;
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
		vec3 lightToPosition = shadowCoord.xyz;
		float dp = ( length( lightToPosition ) - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );		dp += shadowBias;
		vec3 bd3D = normalize( lightToPosition );
		#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
			vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
			return (
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
			) * ( 1.0 / 9.0 );
		#else
			return texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
		#endif
	}
#endif`,w_=`#if NUM_SPOT_LIGHT_COORDS > 0
  uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
  varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,M_=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,S_=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,E_=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,A_=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	uniform int boneTextureSize;
	mat4 getBoneMatrix( const in float i ) {
		float j = i * 4.0;
		float x = mod( j, float( boneTextureSize ) );
		float y = floor( j / float( boneTextureSize ) );
		float dx = 1.0 / float( boneTextureSize );
		float dy = 1.0 / float( boneTextureSize );
		y = dy * ( y + 0.5 );
		vec4 v1 = texture2D( boneTexture, vec2( dx * ( x + 0.5 ), y ) );
		vec4 v2 = texture2D( boneTexture, vec2( dx * ( x + 1.5 ), y ) );
		vec4 v3 = texture2D( boneTexture, vec2( dx * ( x + 2.5 ), y ) );
		vec4 v4 = texture2D( boneTexture, vec2( dx * ( x + 3.5 ), y ) );
		mat4 bone = mat4( v1, v2, v3, v4 );
		return bone;
	}
#endif`,T_=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,C_=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,R_=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,L_=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,P_=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,I_=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return toneMappingExposure * color;
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 OptimizedCineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,D_=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmission = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmission.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmission.rgb, material.transmission );
#endif`,N_=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float framebufferLod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		#ifdef texture2DLodEXT
			return texture2DLodEXT( transmissionSamplerMap, fragCoord.xy, framebufferLod );
		#else
			return texture2D( transmissionSamplerMap, fragCoord.xy, framebufferLod );
		#endif
	}
	vec3 applyVolumeAttenuation( const in vec3 radiance, const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return radiance;
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance * radiance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
		vec3 refractedRayExit = position + transmissionRay;
		vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
		vec2 refractionCoords = ndcPos.xy / ndcPos.w;
		refractionCoords += 1.0;
		refractionCoords /= 2.0;
		vec4 transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
		vec3 attenuatedColor = applyVolumeAttenuation( transmittedLight.rgb, length( transmissionRay ), attenuationColor, attenuationDistance );
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		return vec4( ( 1.0 - F ) * attenuatedColor * diffuseColor, transmittedLight.a );
	}
#endif`,O_=`#if ( defined( USE_UV ) && ! defined( UVS_VERTEX_ONLY ) )
	varying vec2 vUv;
#endif`,F_=`#ifdef USE_UV
	#ifdef UVS_VERTEX_ONLY
		vec2 vUv;
	#else
		varying vec2 vUv;
	#endif
	uniform mat3 uvTransform;
#endif`,z_=`#ifdef USE_UV
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
#endif`,U_=`#if defined( USE_LIGHTMAP ) || defined( USE_AOMAP )
	varying vec2 vUv2;
#endif`,k_=`#if defined( USE_LIGHTMAP ) || defined( USE_AOMAP )
	attribute vec2 uv2;
	varying vec2 vUv2;
	uniform mat3 uv2Transform;
#endif`,B_=`#if defined( USE_LIGHTMAP ) || defined( USE_AOMAP )
	vUv2 = ( uv2Transform * vec3( uv2, 1 ) ).xy;
#endif`,H_=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,V_=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,W_=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <encodings_fragment>
}`,G_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,q_=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <encodings_fragment>
}`,X_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Y_=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <encodings_fragment>
}`,$_=`#include <common>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <skinbase_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,K_=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( 1.0 );
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#endif
}`,Z_=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <skinbase_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,J_=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( 1.0 );
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,j_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Q_=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <encodings_fragment>
}`,ev=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,tv=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <output_fragment>
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,nv=`#include <common>
#include <uv_pars_vertex>
#include <uv2_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <uv2_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,iv=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <uv2_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vUv2 );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <output_fragment>
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,sv=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <uv_pars_vertex>
#include <uv2_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <uv2_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,rv=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <uv2_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <output_fragment>
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ov=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,av=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <output_fragment>
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,lv=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( TANGENTSPACE_NORMALMAP )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( TANGENTSPACE_NORMALMAP )
	vViewPosition = - mvPosition.xyz;
#endif
}`,cv=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( TANGENTSPACE_NORMALMAP )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), opacity );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,hv=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <uv_pars_vertex>
#include <uv2_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <uv2_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,uv=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <uv2_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <output_fragment>
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,fv=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <uv_pars_vertex>
#include <uv2_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <uv2_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,dv=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULARINTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
	#ifdef USE_SPECULARCOLORMAP
		uniform sampler2D specularColorMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEENCOLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEENROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <uv2_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <bsdfs>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecular;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometry.clearcoatNormal, geometry.viewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + clearcoatSpecular * material.clearcoat;
	#endif
	#include <output_fragment>
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,pv=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <uv_pars_vertex>
#include <uv2_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <uv2_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,mv=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <uv2_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <output_fragment>
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,gv=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,xv=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <output_fragment>
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,_v=`#include <common>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,vv=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
}`,yv=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
	vec2 scale;
	scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );
	scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,bv=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <output_fragment>
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
}`,Te={alphamap_fragment:G0,alphamap_pars_fragment:q0,alphatest_fragment:X0,alphatest_pars_fragment:Y0,aomap_fragment:$0,aomap_pars_fragment:K0,begin_vertex:Z0,beginnormal_vertex:J0,bsdfs:j0,iridescence_fragment:Q0,bumpmap_pars_fragment:ex,clipping_planes_fragment:tx,clipping_planes_pars_fragment:nx,clipping_planes_pars_vertex:ix,clipping_planes_vertex:sx,color_fragment:rx,color_pars_fragment:ox,color_pars_vertex:ax,color_vertex:lx,common:cx,cube_uv_reflection_fragment:hx,defaultnormal_vertex:ux,displacementmap_pars_vertex:fx,displacementmap_vertex:dx,emissivemap_fragment:px,emissivemap_pars_fragment:mx,encodings_fragment:gx,encodings_pars_fragment:xx,envmap_fragment:_x,envmap_common_pars_fragment:vx,envmap_pars_fragment:yx,envmap_pars_vertex:bx,envmap_physical_pars_fragment:Dx,envmap_vertex:wx,fog_vertex:Mx,fog_pars_vertex:Sx,fog_fragment:Ex,fog_pars_fragment:Ax,gradientmap_pars_fragment:Tx,lightmap_fragment:Cx,lightmap_pars_fragment:Rx,lights_lambert_fragment:Lx,lights_lambert_pars_fragment:Px,lights_pars_begin:Ix,lights_toon_fragment:Nx,lights_toon_pars_fragment:Ox,lights_phong_fragment:Fx,lights_phong_pars_fragment:zx,lights_physical_fragment:Ux,lights_physical_pars_fragment:kx,lights_fragment_begin:Bx,lights_fragment_maps:Hx,lights_fragment_end:Vx,logdepthbuf_fragment:Wx,logdepthbuf_pars_fragment:Gx,logdepthbuf_pars_vertex:qx,logdepthbuf_vertex:Xx,map_fragment:Yx,map_pars_fragment:$x,map_particle_fragment:Kx,map_particle_pars_fragment:Zx,metalnessmap_fragment:Jx,metalnessmap_pars_fragment:jx,morphcolor_vertex:Qx,morphnormal_vertex:e_,morphtarget_pars_vertex:t_,morphtarget_vertex:n_,normal_fragment_begin:i_,normal_fragment_maps:s_,normal_pars_fragment:r_,normal_pars_vertex:o_,normal_vertex:a_,normalmap_pars_fragment:l_,clearcoat_normal_fragment_begin:c_,clearcoat_normal_fragment_maps:h_,clearcoat_pars_fragment:u_,iridescence_pars_fragment:f_,output_fragment:d_,packing:p_,premultiplied_alpha_fragment:m_,project_vertex:g_,dithering_fragment:x_,dithering_pars_fragment:__,roughnessmap_fragment:v_,roughnessmap_pars_fragment:y_,shadowmap_pars_fragment:b_,shadowmap_pars_vertex:w_,shadowmap_vertex:M_,shadowmask_pars_fragment:S_,skinbase_vertex:E_,skinning_pars_vertex:A_,skinning_vertex:T_,skinnormal_vertex:C_,specularmap_fragment:R_,specularmap_pars_fragment:L_,tonemapping_fragment:P_,tonemapping_pars_fragment:I_,transmission_fragment:D_,transmission_pars_fragment:N_,uv_pars_fragment:O_,uv_pars_vertex:F_,uv_vertex:z_,uv2_pars_fragment:U_,uv2_pars_vertex:k_,uv2_vertex:B_,worldpos_vertex:H_,background_vert:V_,background_frag:W_,backgroundCube_vert:G_,backgroundCube_frag:q_,cube_vert:X_,cube_frag:Y_,depth_vert:$_,depth_frag:K_,distanceRGBA_vert:Z_,distanceRGBA_frag:J_,equirect_vert:j_,equirect_frag:Q_,linedashed_vert:ev,linedashed_frag:tv,meshbasic_vert:nv,meshbasic_frag:iv,meshlambert_vert:sv,meshlambert_frag:rv,meshmatcap_vert:ov,meshmatcap_frag:av,meshnormal_vert:lv,meshnormal_frag:cv,meshphong_vert:hv,meshphong_frag:uv,meshphysical_vert:fv,meshphysical_frag:dv,meshtoon_vert:pv,meshtoon_frag:mv,points_vert:gv,points_frag:xv,shadow_vert:_v,shadow_frag:vv,sprite_vert:yv,sprite_frag:bv},le={common:{diffuse:{value:new qe(16777215)},opacity:{value:1},map:{value:null},uvTransform:{value:new yt},uv2Transform:{value:new yt},alphaMap:{value:null},alphaTest:{value:0}},specularmap:{specularMap:{value:null}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1}},emissivemap:{emissiveMap:{value:null}},bumpmap:{bumpMap:{value:null},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalScale:{value:new Ae(1,1)}},displacementmap:{displacementMap:{value:null},displacementScale:{value:1},displacementBias:{value:0}},roughnessmap:{roughnessMap:{value:null}},metalnessmap:{metalnessMap:{value:null}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new qe(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new qe(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaTest:{value:0},uvTransform:{value:new yt}},sprite:{diffuse:{value:new qe(16777215)},opacity:{value:1},center:{value:new Ae(.5,.5)},rotation:{value:0},map:{value:null},alphaMap:{value:null},alphaTest:{value:0},uvTransform:{value:new yt}}},sn={basic:{uniforms:_t([le.common,le.specularmap,le.envmap,le.aomap,le.lightmap,le.fog]),vertexShader:Te.meshbasic_vert,fragmentShader:Te.meshbasic_frag},lambert:{uniforms:_t([le.common,le.specularmap,le.envmap,le.aomap,le.lightmap,le.emissivemap,le.bumpmap,le.normalmap,le.displacementmap,le.fog,le.lights,{emissive:{value:new qe(0)}}]),vertexShader:Te.meshlambert_vert,fragmentShader:Te.meshlambert_frag},phong:{uniforms:_t([le.common,le.specularmap,le.envmap,le.aomap,le.lightmap,le.emissivemap,le.bumpmap,le.normalmap,le.displacementmap,le.fog,le.lights,{emissive:{value:new qe(0)},specular:{value:new qe(1118481)},shininess:{value:30}}]),vertexShader:Te.meshphong_vert,fragmentShader:Te.meshphong_frag},standard:{uniforms:_t([le.common,le.envmap,le.aomap,le.lightmap,le.emissivemap,le.bumpmap,le.normalmap,le.displacementmap,le.roughnessmap,le.metalnessmap,le.fog,le.lights,{emissive:{value:new qe(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Te.meshphysical_vert,fragmentShader:Te.meshphysical_frag},toon:{uniforms:_t([le.common,le.aomap,le.lightmap,le.emissivemap,le.bumpmap,le.normalmap,le.displacementmap,le.gradientmap,le.fog,le.lights,{emissive:{value:new qe(0)}}]),vertexShader:Te.meshtoon_vert,fragmentShader:Te.meshtoon_frag},matcap:{uniforms:_t([le.common,le.bumpmap,le.normalmap,le.displacementmap,le.fog,{matcap:{value:null}}]),vertexShader:Te.meshmatcap_vert,fragmentShader:Te.meshmatcap_frag},points:{uniforms:_t([le.points,le.fog]),vertexShader:Te.points_vert,fragmentShader:Te.points_frag},dashed:{uniforms:_t([le.common,le.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Te.linedashed_vert,fragmentShader:Te.linedashed_frag},depth:{uniforms:_t([le.common,le.displacementmap]),vertexShader:Te.depth_vert,fragmentShader:Te.depth_frag},normal:{uniforms:_t([le.common,le.bumpmap,le.normalmap,le.displacementmap,{opacity:{value:1}}]),vertexShader:Te.meshnormal_vert,fragmentShader:Te.meshnormal_frag},sprite:{uniforms:_t([le.sprite,le.fog]),vertexShader:Te.sprite_vert,fragmentShader:Te.sprite_frag},background:{uniforms:{uvTransform:{value:new yt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Te.background_vert,fragmentShader:Te.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:Te.backgroundCube_vert,fragmentShader:Te.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Te.cube_vert,fragmentShader:Te.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Te.equirect_vert,fragmentShader:Te.equirect_frag},distanceRGBA:{uniforms:_t([le.common,le.displacementmap,{referencePosition:{value:new W},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Te.distanceRGBA_vert,fragmentShader:Te.distanceRGBA_frag},shadow:{uniforms:_t([le.lights,le.fog,{color:{value:new qe(0)},opacity:{value:1}}]),vertexShader:Te.shadow_vert,fragmentShader:Te.shadow_frag}};sn.physical={uniforms:_t([sn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatNormalScale:{value:new Ae(1,1)},clearcoatNormalMap:{value:null},iridescence:{value:0},iridescenceMap:{value:null},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},sheen:{value:0},sheenColor:{value:new qe(0)},sheenColorMap:{value:null},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},transmission:{value:0},transmissionMap:{value:null},transmissionSamplerSize:{value:new Ae},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},attenuationDistance:{value:0},attenuationColor:{value:new qe(0)},specularIntensity:{value:1},specularIntensityMap:{value:null},specularColor:{value:new qe(1,1,1)},specularColorMap:{value:null}}]),vertexShader:Te.meshphysical_vert,fragmentShader:Te.meshphysical_frag};var _r={r:0,b:0,g:0};function wv(i,e,t,n,s,r,a){let o=new qe(0),l=r===!0?0:1,c,h,u=null,f=0,m=null;function x(d,v){let A=!1,y=v.isScene===!0?v.background:null;y&&y.isTexture&&(y=(v.backgroundBlurriness>0?t:e).get(y));let w=i.xr,M=w.getSession&&w.getSession();M&&M.environmentBlendMode==="additive"&&(y=null),y===null?p(o,l):y&&y.isColor&&(p(y,1),A=!0),(i.autoClear||A)&&i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil),y&&(y.isCubeTexture||y.mapping===kr)?(h===void 0&&(h=new At(new Jt(1,1,1),new Mn({name:"BackgroundCubeMaterial",uniforms:Fi(sn.backgroundCube.uniforms),vertexShader:sn.backgroundCube.vertexShader,fragmentShader:sn.backgroundCube.fragmentShader,side:Dt,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(P,F,g){this.matrixWorld.copyPosition(g.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),h.material.uniforms.envMap.value=y,h.material.uniforms.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=v.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,h.material.toneMapped=y.encoding!==Ye,(u!==y||f!==y.version||m!==i.toneMapping)&&(h.material.needsUpdate=!0,u=y,f=y.version,m=i.toneMapping),h.layers.enableAll(),d.unshift(h,h.geometry,h.material,0,0,null)):y&&y.isTexture&&(c===void 0&&(c=new At(new ys(2,2),new Mn({name:"BackgroundMaterial",uniforms:Fi(sn.background.uniforms),vertexShader:sn.background.vertexShader,fragmentShader:sn.background.fragmentShader,side:Nn,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=y,c.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,c.material.toneMapped=y.encoding!==Ye,y.matrixAutoUpdate===!0&&y.updateMatrix(),c.material.uniforms.uvTransform.value.copy(y.matrix),(u!==y||f!==y.version||m!==i.toneMapping)&&(c.material.needsUpdate=!0,u=y,f=y.version,m=i.toneMapping),c.layers.enableAll(),d.unshift(c,c.geometry,c.material,0,0,null))}function p(d,v){d.getRGB(_r,Iu(i)),n.buffers.color.setClear(_r.r,_r.g,_r.b,v,a)}return{getClearColor:function(){return o},setClearColor:function(d,v=1){o.set(d),l=v,p(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(d){l=d,p(o,l)},render:x}}function Mv(i,e,t,n){let s=i.getParameter(34921),r=n.isWebGL2?null:e.get("OES_vertex_array_object"),a=n.isWebGL2||r!==null,o={},l=d(null),c=l,h=!1;function u(z,T,R,j,V){let Q=!1;if(a){let Z=p(j,R,T);c!==Z&&(c=Z,m(c.object)),Q=v(z,j,R,V),Q&&A(z,j,R,V)}else{let Z=T.wireframe===!0;(c.geometry!==j.id||c.program!==R.id||c.wireframe!==Z)&&(c.geometry=j.id,c.program=R.id,c.wireframe=Z,Q=!0)}V!==null&&t.update(V,34963),(Q||h)&&(h=!1,g(z,T,R,j),V!==null&&i.bindBuffer(34963,t.get(V).buffer))}function f(){return n.isWebGL2?i.createVertexArray():r.createVertexArrayOES()}function m(z){return n.isWebGL2?i.bindVertexArray(z):r.bindVertexArrayOES(z)}function x(z){return n.isWebGL2?i.deleteVertexArray(z):r.deleteVertexArrayOES(z)}function p(z,T,R){let j=R.wireframe===!0,V=o[z.id];V===void 0&&(V={},o[z.id]=V);let Q=V[T.id];Q===void 0&&(Q={},V[T.id]=Q);let Z=Q[j];return Z===void 0&&(Z=d(f()),Q[j]=Z),Z}function d(z){let T=[],R=[],j=[];for(let V=0;V<s;V++)T[V]=0,R[V]=0,j[V]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:T,enabledAttributes:R,attributeDivisors:j,object:z,attributes:{},index:null}}function v(z,T,R,j){let V=c.attributes,Q=T.attributes,Z=0,ue=R.getAttributes();for(let B in ue)if(ue[B].location>=0){let re=V[B],se=Q[B];if(se===void 0&&(B==="instanceMatrix"&&z.instanceMatrix&&(se=z.instanceMatrix),B==="instanceColor"&&z.instanceColor&&(se=z.instanceColor)),re===void 0||re.attribute!==se||se&&re.data!==se.data)return!0;Z++}return c.attributesNum!==Z||c.index!==j}function A(z,T,R,j){let V={},Q=T.attributes,Z=0,ue=R.getAttributes();for(let B in ue)if(ue[B].location>=0){let re=Q[B];re===void 0&&(B==="instanceMatrix"&&z.instanceMatrix&&(re=z.instanceMatrix),B==="instanceColor"&&z.instanceColor&&(re=z.instanceColor));let se={};se.attribute=re,re&&re.data&&(se.data=re.data),V[B]=se,Z++}c.attributes=V,c.attributesNum=Z,c.index=j}function y(){let z=c.newAttributes;for(let T=0,R=z.length;T<R;T++)z[T]=0}function w(z){M(z,0)}function M(z,T){let R=c.newAttributes,j=c.enabledAttributes,V=c.attributeDivisors;R[z]=1,j[z]===0&&(i.enableVertexAttribArray(z),j[z]=1),V[z]!==T&&((n.isWebGL2?i:e.get("ANGLE_instanced_arrays"))[n.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](z,T),V[z]=T)}function P(){let z=c.newAttributes,T=c.enabledAttributes;for(let R=0,j=T.length;R<j;R++)T[R]!==z[R]&&(i.disableVertexAttribArray(R),T[R]=0)}function F(z,T,R,j,V,Q){n.isWebGL2===!0&&(R===5124||R===5125)?i.vertexAttribIPointer(z,T,R,V,Q):i.vertexAttribPointer(z,T,R,j,V,Q)}function g(z,T,R,j){if(n.isWebGL2===!1&&(z.isInstancedMesh||j.isInstancedBufferGeometry)&&e.get("ANGLE_instanced_arrays")===null)return;y();let V=j.attributes,Q=R.getAttributes(),Z=T.defaultAttributeValues;for(let ue in Q){let B=Q[ue];if(B.location>=0){let ee=V[ue];if(ee===void 0&&(ue==="instanceMatrix"&&z.instanceMatrix&&(ee=z.instanceMatrix),ue==="instanceColor"&&z.instanceColor&&(ee=z.instanceColor)),ee!==void 0){let re=ee.normalized,se=ee.itemSize,N=t.get(ee);if(N===void 0)continue;let we=N.buffer,xe=N.type,q=N.bytesPerElement;if(ee.isInterleavedBufferAttribute){let te=ee.data,J=te.stride,ae=ee.offset;if(te.isInstancedInterleavedBuffer){for(let he=0;he<B.locationSize;he++)M(B.location+he,te.meshPerAttribute);z.isInstancedMesh!==!0&&j._maxInstanceCount===void 0&&(j._maxInstanceCount=te.meshPerAttribute*te.count)}else for(let he=0;he<B.locationSize;he++)w(B.location+he);i.bindBuffer(34962,we);for(let he=0;he<B.locationSize;he++)F(B.location+he,se/B.locationSize,xe,re,J*q,(ae+se/B.locationSize*he)*q)}else{if(ee.isInstancedBufferAttribute){for(let te=0;te<B.locationSize;te++)M(B.location+te,ee.meshPerAttribute);z.isInstancedMesh!==!0&&j._maxInstanceCount===void 0&&(j._maxInstanceCount=ee.meshPerAttribute*ee.count)}else for(let te=0;te<B.locationSize;te++)w(B.location+te);i.bindBuffer(34962,we);for(let te=0;te<B.locationSize;te++)F(B.location+te,se/B.locationSize,xe,re,se*q,se/B.locationSize*te*q)}}else if(Z!==void 0){let re=Z[ue];if(re!==void 0)switch(re.length){case 2:i.vertexAttrib2fv(B.location,re);break;case 3:i.vertexAttrib3fv(B.location,re);break;case 4:i.vertexAttrib4fv(B.location,re);break;default:i.vertexAttrib1fv(B.location,re)}}}}P()}function S(){G();for(let z in o){let T=o[z];for(let R in T){let j=T[R];for(let V in j)x(j[V].object),delete j[V];delete T[R]}delete o[z]}}function D(z){if(o[z.id]===void 0)return;let T=o[z.id];for(let R in T){let j=T[R];for(let V in j)x(j[V].object),delete j[V];delete T[R]}delete o[z.id]}function L(z){for(let T in o){let R=o[T];if(R[z.id]===void 0)continue;let j=R[z.id];for(let V in j)x(j[V].object),delete j[V];delete R[z.id]}}function G(){O(),h=!0,c!==l&&(c=l,m(c.object))}function O(){l.geometry=null,l.program=null,l.wireframe=!1}return{setup:u,reset:G,resetDefaultState:O,dispose:S,releaseStatesOfGeometry:D,releaseStatesOfProgram:L,initAttributes:y,enableAttribute:w,disableUnusedAttributes:P}}function Sv(i,e,t,n){let s=n.isWebGL2,r;function a(c){r=c}function o(c,h){i.drawArrays(r,c,h),t.update(h,r,1)}function l(c,h,u){if(u===0)return;let f,m;if(s)f=i,m="drawArraysInstanced";else if(f=e.get("ANGLE_instanced_arrays"),m="drawArraysInstancedANGLE",f===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}f[m](r,c,h,u),t.update(h,r,u)}this.setMode=a,this.render=o,this.renderInstances=l}function Ev(i,e,t){let n;function s(){if(n!==void 0)return n;if(e.has("EXT_texture_filter_anisotropic")===!0){let F=e.get("EXT_texture_filter_anisotropic");n=i.getParameter(F.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n}function r(F){if(F==="highp"){if(i.getShaderPrecisionFormat(35633,36338).precision>0&&i.getShaderPrecisionFormat(35632,36338).precision>0)return"highp";F="mediump"}return F==="mediump"&&i.getShaderPrecisionFormat(35633,36337).precision>0&&i.getShaderPrecisionFormat(35632,36337).precision>0?"mediump":"lowp"}let a=typeof WebGL2RenderingContext<"u"&&i instanceof WebGL2RenderingContext,o=t.precision!==void 0?t.precision:"highp",l=r(o);l!==o&&(console.warn("THREE.WebGLRenderer:",o,"not supported, using",l,"instead."),o=l);let c=a||e.has("WEBGL_draw_buffers"),h=t.logarithmicDepthBuffer===!0,u=i.getParameter(34930),f=i.getParameter(35660),m=i.getParameter(3379),x=i.getParameter(34076),p=i.getParameter(34921),d=i.getParameter(36347),v=i.getParameter(36348),A=i.getParameter(36349),y=f>0,w=a||e.has("OES_texture_float"),M=y&&w,P=a?i.getParameter(36183):0;return{isWebGL2:a,drawBuffers:c,getMaxAnisotropy:s,getMaxPrecision:r,precision:o,logarithmicDepthBuffer:h,maxTextures:u,maxVertexTextures:f,maxTextureSize:m,maxCubemapSize:x,maxAttributes:p,maxVertexUniforms:d,maxVaryings:v,maxFragmentUniforms:A,vertexTextures:y,floatFragmentTextures:w,floatVertexTextures:M,maxSamples:P}}function Av(i){let e=this,t=null,n=0,s=!1,r=!1,a=new _n,o=new yt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,f){let m=u.length!==0||f||n!==0||s;return s=f,n=u.length,m},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,f){t=h(u,f,0)},this.setState=function(u,f,m){let x=u.clippingPlanes,p=u.clipIntersection,d=u.clipShadows,v=i.get(u);if(!s||x===null||x.length===0||r&&!d)r?h(null):c();else{let A=r?0:n,y=A*4,w=v.clippingState||null;l.value=w,w=h(x,f,y,m);for(let M=0;M!==y;++M)w[M]=t[M];v.clippingState=w,this.numIntersection=p?this.numPlanes:0,this.numPlanes+=A}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(u,f,m,x){let p=u!==null?u.length:0,d=null;if(p!==0){if(d=l.value,x!==!0||d===null){let v=m+p*4,A=f.matrixWorldInverse;o.getNormalMatrix(A),(d===null||d.length<v)&&(d=new Float32Array(v));for(let y=0,w=m;y!==p;++y,w+=4)a.copy(u[y]).applyMatrix4(A,o),a.normal.toArray(d,w),d[w+3]=a.constant}l.value=d,l.needsUpdate=!0}return e.numPlanes=p,e.numIntersection=0,d}}function Tv(i){let e=new WeakMap;function t(a,o){return o===wa?a.mapping=Ii:o===Ma&&(a.mapping=Di),a}function n(a){if(a&&a.isTexture&&a.isRenderTargetTexture===!1){let o=a.mapping;if(o===wa||o===Ma)if(e.has(a)){let l=e.get(a).texture;return t(l,a.mapping)}else{let l=a.image;if(l&&l.height>0){let c=new Pa(l.height/2);return c.fromEquirectangularTexture(i,a),e.set(a,c),a.addEventListener("dispose",s),t(c.texture,a.mapping)}else return null}}return a}function s(a){let o=a.target;o.removeEventListener("dispose",s);let l=e.get(o);l!==void 0&&(e.delete(o),l.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}var Dr=class extends Pr{constructor(e=-1,t=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-e,a=n+e,o=s+t,l=s-t;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},Ci=4,Qh=[.125,.215,.35,.446,.526,.582],$n=20,xa=new Dr,eu=new qe,_a=null,Yn=(1+Math.sqrt(5))/2,Ai=1/Yn,tu=[new W(1,1,1),new W(-1,1,1),new W(1,1,-1),new W(-1,1,-1),new W(0,Yn,Ai),new W(0,Yn,-Ai),new W(Ai,0,Yn),new W(-Ai,0,Yn),new W(Yn,Ai,0),new W(-Yn,Ai,0)],Nr=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,s=100){_a=this._renderer.getRenderTarget(),this._setSize(256);let r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(e,n,s,r),t>0&&this._blur(r,0,0,t),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=su(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=iu(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(_a),e.scissorTest=!1,vr(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Ii||e.mapping===Di?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),_a=this._renderer.getRenderTarget();let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:kt,minFilter:kt,generateMipmaps:!1,type:ms,format:$t,encoding:ei,depthBuffer:!1},s=nu(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=nu(e,t,n);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Cv(r)),this._blurMaterial=Rv(r,e,t)}return s}_compileMaterial(e){let t=new At(this._lodPlanes[0],e);this._renderer.compile(t,xa)}_sceneToCubeUV(e,t,n,s){let o=new ft(90,1,t,n),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,f=h.toneMapping;h.getClearColor(eu),h.toneMapping=vn,h.autoClear=!1;let m=new Cr({name:"PMREM.Background",side:Dt,depthWrite:!1,depthTest:!1}),x=new At(new Jt,m),p=!1,d=e.background;d?d.isColor&&(m.color.copy(d),e.background=null,p=!0):(m.color.copy(eu),p=!0);for(let v=0;v<6;v++){let A=v%3;A===0?(o.up.set(0,l[v],0),o.lookAt(c[v],0,0)):A===1?(o.up.set(0,0,l[v]),o.lookAt(0,c[v],0)):(o.up.set(0,l[v],0),o.lookAt(0,0,c[v]));let y=this._cubeSize;vr(s,A*y,v>2?y:0,y,y),h.setRenderTarget(s),p&&h.render(x,o),h.render(e,o)}x.geometry.dispose(),x.material.dispose(),h.toneMapping=f,h.autoClear=u,e.background=d}_textureToCubeUV(e,t){let n=this._renderer,s=e.mapping===Ii||e.mapping===Di;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=su()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=iu());let r=s?this._cubemapMaterial:this._equirectMaterial,a=new At(this._lodPlanes[0],r),o=r.uniforms;o.envMap.value=e;let l=this._cubeSize;vr(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(a,xa)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;for(let s=1;s<this._lodPlanes.length;s++){let r=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),a=tu[(s-1)%tu.length];this._blur(e,s-1,s,r,a)}t.autoClear=n}_blur(e,t,n,s,r){let a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,s,"latitudinal",r),this._halfBlur(a,e,n,n,s,"longitudinal",r)}_halfBlur(e,t,n,s,r,a,o){let l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let h=3,u=new At(this._lodPlanes[s],c),f=c.uniforms,m=this._sizeLods[n]-1,x=isFinite(r)?Math.PI/(2*m):2*Math.PI/(2*$n-1),p=r/x,d=isFinite(r)?1+Math.floor(h*p):$n;d>$n&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${d} samples when the maximum is set to ${$n}`);let v=[],A=0;for(let F=0;F<$n;++F){let g=F/p,S=Math.exp(-g*g/2);v.push(S),F===0?A+=S:F<d&&(A+=2*S)}for(let F=0;F<v.length;F++)v[F]=v[F]/A;f.envMap.value=e.texture,f.samples.value=d,f.weights.value=v,f.latitudinal.value=a==="latitudinal",o&&(f.poleAxis.value=o);let{_lodMax:y}=this;f.dTheta.value=x,f.mipInt.value=y-n;let w=this._sizeLods[s],M=3*w*(s>y-Ci?s-y+Ci:0),P=4*(this._cubeSize-w);vr(t,M,P,3*w,2*w),l.setRenderTarget(t),l.render(u,xa)}};function Cv(i){let e=[],t=[],n=[],s=i,r=i-Ci+1+Qh.length;for(let a=0;a<r;a++){let o=Math.pow(2,s);t.push(o);let l=1/o;a>i-Ci?l=Qh[a-i+Ci-1]:a===0&&(l=0),n.push(l);let c=1/(o-2),h=-c,u=1+c,f=[h,h,u,h,u,u,h,h,u,u,h,u],m=6,x=6,p=3,d=2,v=1,A=new Float32Array(p*x*m),y=new Float32Array(d*x*m),w=new Float32Array(v*x*m);for(let P=0;P<m;P++){let F=P%3*2/3-1,g=P>2?0:-1,S=[F,g,0,F+2/3,g,0,F+2/3,g+1,0,F,g,0,F+2/3,g+1,0,F,g+1,0];A.set(S,p*x*P),y.set(f,d*x*P);let D=[P,P,P,P,P,P];w.set(D,v*x*P)}let M=new wn;M.setAttribute("position",new Bt(A,p)),M.setAttribute("uv",new Bt(y,d)),M.setAttribute("faceIndex",new Bt(w,v)),e.push(M),s>Ci&&s--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function nu(i,e,t){let n=new bn(i,e,t);return n.texture.mapping=kr,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function vr(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function Rv(i,e,t){let n=new Float32Array($n),s=new W(0,1,0);return new Mn({name:"SphericalGaussianBlur",defines:{n:$n,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:il(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Dn,depthTest:!1,depthWrite:!1})}function iu(){return new Mn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:il(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Dn,depthTest:!1,depthWrite:!1})}function su(){return new Mn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:il(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Dn,depthTest:!1,depthWrite:!1})}function il(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function Lv(i){let e=new WeakMap,t=null;function n(o){if(o&&o.isTexture){let l=o.mapping,c=l===wa||l===Ma,h=l===Ii||l===Di;if(c||h)if(o.isRenderTargetTexture&&o.needsPMREMUpdate===!0){o.needsPMREMUpdate=!1;let u=e.get(o);return t===null&&(t=new Nr(i)),u=c?t.fromEquirectangular(o,u):t.fromCubemap(o,u),e.set(o,u),u.texture}else{if(e.has(o))return e.get(o).texture;{let u=o.image;if(c&&u&&u.height>0||h&&u&&s(u)){t===null&&(t=new Nr(i));let f=c?t.fromEquirectangular(o):t.fromCubemap(o);return e.set(o,f),o.addEventListener("dispose",r),f.texture}else return null}}}return o}function s(o){let l=0,c=6;for(let h=0;h<c;h++)o[h]!==void 0&&l++;return l===c}function r(o){let l=o.target;l.removeEventListener("dispose",r);let c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function a(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:a}}function Pv(i){let e={};function t(n){if(e[n]!==void 0)return e[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(n){n.isWebGL2?t("EXT_color_buffer_float"):(t("WEBGL_depth_texture"),t("OES_texture_float"),t("OES_texture_half_float"),t("OES_texture_half_float_linear"),t("OES_standard_derivatives"),t("OES_element_index_uint"),t("OES_vertex_array_object"),t("ANGLE_instanced_arrays")),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture")},get:function(n){let s=t(n);return s===null&&console.warn("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function Iv(i,e,t,n){let s={},r=new WeakMap;function a(u){let f=u.target;f.index!==null&&e.remove(f.index);for(let x in f.attributes)e.remove(f.attributes[x]);f.removeEventListener("dispose",a),delete s[f.id];let m=r.get(f);m&&(e.remove(m),r.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,t.memory.geometries--}function o(u,f){return s[f.id]===!0||(f.addEventListener("dispose",a),s[f.id]=!0,t.memory.geometries++),f}function l(u){let f=u.attributes;for(let x in f)e.update(f[x],34962);let m=u.morphAttributes;for(let x in m){let p=m[x];for(let d=0,v=p.length;d<v;d++)e.update(p[d],34962)}}function c(u){let f=[],m=u.index,x=u.attributes.position,p=0;if(m!==null){let A=m.array;p=m.version;for(let y=0,w=A.length;y<w;y+=3){let M=A[y+0],P=A[y+1],F=A[y+2];f.push(M,P,P,F,F,M)}}else{let A=x.array;p=x.version;for(let y=0,w=A.length/3-1;y<w;y+=3){let M=y+0,P=y+1,F=y+2;f.push(M,P,P,F,F,M)}}let d=new(Lu(f)?Lr:Rr)(f,1);d.version=p;let v=r.get(u);v&&e.remove(v),r.set(u,d)}function h(u){let f=r.get(u);if(f){let m=u.index;m!==null&&f.version<m.version&&c(u)}else c(u);return r.get(u)}return{get:o,update:l,getWireframeAttribute:h}}function Dv(i,e,t,n){let s=n.isWebGL2,r;function a(f){r=f}let o,l;function c(f){o=f.type,l=f.bytesPerElement}function h(f,m){i.drawElements(r,m,o,f*l),t.update(m,r,1)}function u(f,m,x){if(x===0)return;let p,d;if(s)p=i,d="drawElementsInstanced";else if(p=e.get("ANGLE_instanced_arrays"),d="drawElementsInstancedANGLE",p===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}p[d](r,m,o,f*l,x),t.update(m,r,x)}this.setMode=a,this.setIndex=c,this.render=h,this.renderInstances=u}function Nv(i){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(t.calls++,a){case 4:t.triangles+=o*(r/3);break;case 1:t.lines+=o*(r/2);break;case 3:t.lines+=o*(r-1);break;case 2:t.lines+=o*r;break;case 0:t.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function s(){t.frame++,t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function Ov(i,e){return i[0]-e[0]}function Fv(i,e){return Math.abs(e[1])-Math.abs(i[1])}function zv(i,e,t){let n={},s=new Float32Array(8),r=new WeakMap,a=new it,o=[];for(let c=0;c<8;c++)o[c]=[c,0];function l(c,h,u,f){let m=c.morphTargetInfluences;if(e.isWebGL2===!0){let x=h.morphAttributes.position||h.morphAttributes.normal||h.morphAttributes.color,p=x!==void 0?x.length:0,d=r.get(h);if(d===void 0||d.count!==p){let T=function(){O.dispose(),r.delete(h),h.removeEventListener("dispose",T)};d!==void 0&&d.texture.dispose();let y=h.morphAttributes.position!==void 0,w=h.morphAttributes.normal!==void 0,M=h.morphAttributes.color!==void 0,P=h.morphAttributes.position||[],F=h.morphAttributes.normal||[],g=h.morphAttributes.color||[],S=0;y===!0&&(S=1),w===!0&&(S=2),M===!0&&(S=3);let D=h.attributes.position.count*S,L=1;D>e.maxTextureSize&&(L=Math.ceil(D/e.maxTextureSize),D=e.maxTextureSize);let G=new Float32Array(D*L*4*p),O=new Ar(G,D,L,p);O.type=Zn,O.needsUpdate=!0;let z=S*4;for(let R=0;R<p;R++){let j=P[R],V=F[R],Q=g[R],Z=D*L*4*R;for(let ue=0;ue<j.count;ue++){let B=ue*z;y===!0&&(a.fromBufferAttribute(j,ue),G[Z+B+0]=a.x,G[Z+B+1]=a.y,G[Z+B+2]=a.z,G[Z+B+3]=0),w===!0&&(a.fromBufferAttribute(V,ue),G[Z+B+4]=a.x,G[Z+B+5]=a.y,G[Z+B+6]=a.z,G[Z+B+7]=0),M===!0&&(a.fromBufferAttribute(Q,ue),G[Z+B+8]=a.x,G[Z+B+9]=a.y,G[Z+B+10]=a.z,G[Z+B+11]=Q.itemSize===4?a.w:1)}}d={count:p,texture:O,size:new Ae(D,L)},r.set(h,d),h.addEventListener("dispose",T)}let v=0;for(let y=0;y<m.length;y++)v+=m[y];let A=h.morphTargetsRelative?1:1-v;f.getUniforms().setValue(i,"morphTargetBaseInfluence",A),f.getUniforms().setValue(i,"morphTargetInfluences",m),f.getUniforms().setValue(i,"morphTargetsTexture",d.texture,t),f.getUniforms().setValue(i,"morphTargetsTextureSize",d.size)}else{let x=m===void 0?0:m.length,p=n[h.id];if(p===void 0||p.length!==x){p=[];for(let w=0;w<x;w++)p[w]=[w,0];n[h.id]=p}for(let w=0;w<x;w++){let M=p[w];M[0]=w,M[1]=m[w]}p.sort(Fv);for(let w=0;w<8;w++)w<x&&p[w][1]?(o[w][0]=p[w][0],o[w][1]=p[w][1]):(o[w][0]=Number.MAX_SAFE_INTEGER,o[w][1]=0);o.sort(Ov);let d=h.morphAttributes.position,v=h.morphAttributes.normal,A=0;for(let w=0;w<8;w++){let M=o[w],P=M[0],F=M[1];P!==Number.MAX_SAFE_INTEGER&&F?(d&&h.getAttribute("morphTarget"+w)!==d[P]&&h.setAttribute("morphTarget"+w,d[P]),v&&h.getAttribute("morphNormal"+w)!==v[P]&&h.setAttribute("morphNormal"+w,v[P]),s[w]=F,A+=F):(d&&h.hasAttribute("morphTarget"+w)===!0&&h.deleteAttribute("morphTarget"+w),v&&h.hasAttribute("morphNormal"+w)===!0&&h.deleteAttribute("morphNormal"+w),s[w]=0)}let y=h.morphTargetsRelative?1:1-A;f.getUniforms().setValue(i,"morphTargetBaseInfluence",y),f.getUniforms().setValue(i,"morphTargetInfluences",s)}}return{update:l}}function Uv(i,e,t,n){let s=new WeakMap;function r(l){let c=n.render.frame,h=l.geometry,u=e.get(l,h);return s.get(u)!==c&&(e.update(u),s.set(u,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),t.update(l.instanceMatrix,34962),l.instanceColor!==null&&t.update(l.instanceColor,34962)),u}function a(){s=new WeakMap}function o(l){let c=l.target;c.removeEventListener("dispose",o),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:r,dispose:a}}var Nu=new ht,Ou=new Ar,Fu=new Ca,zu=new Ir,ru=[],ou=[],au=new Float32Array(16),lu=new Float32Array(9),cu=new Float32Array(4);function Hi(i,e,t){let n=i[0];if(n<=0||n>0)return i;let s=e*t,r=ru[s];if(r===void 0&&(r=new Float32Array(s),ru[s]=r),e!==0){n.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,i[a].toArray(r,o)}return r}function rt(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function ot(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function Br(i,e){let t=ou[e];t===void 0&&(t=new Int32Array(e),ou[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function kv(i,e){let t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function Bv(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(rt(t,e))return;i.uniform2fv(this.addr,e),ot(t,e)}}function Hv(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(rt(t,e))return;i.uniform3fv(this.addr,e),ot(t,e)}}function Vv(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(rt(t,e))return;i.uniform4fv(this.addr,e),ot(t,e)}}function Wv(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(rt(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),ot(t,e)}else{if(rt(t,n))return;cu.set(n),i.uniformMatrix2fv(this.addr,!1,cu),ot(t,n)}}function Gv(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(rt(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),ot(t,e)}else{if(rt(t,n))return;lu.set(n),i.uniformMatrix3fv(this.addr,!1,lu),ot(t,n)}}function qv(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(rt(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),ot(t,e)}else{if(rt(t,n))return;au.set(n),i.uniformMatrix4fv(this.addr,!1,au),ot(t,n)}}function Xv(i,e){let t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function Yv(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(rt(t,e))return;i.uniform2iv(this.addr,e),ot(t,e)}}function $v(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(rt(t,e))return;i.uniform3iv(this.addr,e),ot(t,e)}}function Kv(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(rt(t,e))return;i.uniform4iv(this.addr,e),ot(t,e)}}function Zv(i,e){let t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function Jv(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(rt(t,e))return;i.uniform2uiv(this.addr,e),ot(t,e)}}function jv(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(rt(t,e))return;i.uniform3uiv(this.addr,e),ot(t,e)}}function Qv(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(rt(t,e))return;i.uniform4uiv(this.addr,e),ot(t,e)}}function ey(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2D(e||Nu,s)}function ty(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||Fu,s)}function ny(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||zu,s)}function iy(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||Ou,s)}function sy(i){switch(i){case 5126:return kv;case 35664:return Bv;case 35665:return Hv;case 35666:return Vv;case 35674:return Wv;case 35675:return Gv;case 35676:return qv;case 5124:case 35670:return Xv;case 35667:case 35671:return Yv;case 35668:case 35672:return $v;case 35669:case 35673:return Kv;case 5125:return Zv;case 36294:return Jv;case 36295:return jv;case 36296:return Qv;case 35678:case 36198:case 36298:case 36306:case 35682:return ey;case 35679:case 36299:case 36307:return ty;case 35680:case 36300:case 36308:case 36293:return ny;case 36289:case 36303:case 36311:case 36292:return iy}}function ry(i,e){i.uniform1fv(this.addr,e)}function oy(i,e){let t=Hi(e,this.size,2);i.uniform2fv(this.addr,t)}function ay(i,e){let t=Hi(e,this.size,3);i.uniform3fv(this.addr,t)}function ly(i,e){let t=Hi(e,this.size,4);i.uniform4fv(this.addr,t)}function cy(i,e){let t=Hi(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function hy(i,e){let t=Hi(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function uy(i,e){let t=Hi(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function fy(i,e){i.uniform1iv(this.addr,e)}function dy(i,e){i.uniform2iv(this.addr,e)}function py(i,e){i.uniform3iv(this.addr,e)}function my(i,e){i.uniform4iv(this.addr,e)}function gy(i,e){i.uniform1uiv(this.addr,e)}function xy(i,e){i.uniform2uiv(this.addr,e)}function _y(i,e){i.uniform3uiv(this.addr,e)}function vy(i,e){i.uniform4uiv(this.addr,e)}function yy(i,e,t){let n=this.cache,s=e.length,r=Br(t,s);rt(n,r)||(i.uniform1iv(this.addr,r),ot(n,r));for(let a=0;a!==s;++a)t.setTexture2D(e[a]||Nu,r[a])}function by(i,e,t){let n=this.cache,s=e.length,r=Br(t,s);rt(n,r)||(i.uniform1iv(this.addr,r),ot(n,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||Fu,r[a])}function wy(i,e,t){let n=this.cache,s=e.length,r=Br(t,s);rt(n,r)||(i.uniform1iv(this.addr,r),ot(n,r));for(let a=0;a!==s;++a)t.setTextureCube(e[a]||zu,r[a])}function My(i,e,t){let n=this.cache,s=e.length,r=Br(t,s);rt(n,r)||(i.uniform1iv(this.addr,r),ot(n,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||Ou,r[a])}function Sy(i){switch(i){case 5126:return ry;case 35664:return oy;case 35665:return ay;case 35666:return ly;case 35674:return cy;case 35675:return hy;case 35676:return uy;case 5124:case 35670:return fy;case 35667:case 35671:return dy;case 35668:case 35672:return py;case 35669:case 35673:return my;case 5125:return gy;case 36294:return xy;case 36295:return _y;case 36296:return vy;case 35678:case 36198:case 36298:case 36306:case 35682:return yy;case 35679:case 36299:case 36307:return by;case 35680:case 36300:case 36308:case 36293:return wy;case 36289:case 36303:case 36311:case 36292:return My}}var Ia=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.setValue=sy(t.type)}},Da=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.size=t.size,this.setValue=Sy(t.type)}},Na=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let s=this.seq;for(let r=0,a=s.length;r!==a;++r){let o=s[r];o.setValue(e,t[o.id],n)}}},va=/(\w+)(\])?(\[|\.)?/g;function hu(i,e){i.seq.push(e),i.map[e.id]=e}function Ey(i,e,t){let n=i.name,s=n.length;for(va.lastIndex=0;;){let r=va.exec(n),a=va.lastIndex,o=r[1],l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===s){hu(t,c===void 0?new Ia(o,i,e):new Da(o,i,e));break}else{let u=t.map[o];u===void 0&&(u=new Na(o),hu(t,u)),t=u}}}var Pi=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,35718);for(let s=0;s<n;++s){let r=e.getActiveUniform(t,s),a=e.getUniformLocation(t,r.name);Ey(r,a,this)}}setValue(e,t,n,s){let r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){let s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,a=t.length;r!==a;++r){let o=t[r],l=n[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,s)}}static seqWithValue(e,t){let n=[];for(let s=0,r=e.length;s!==r;++s){let a=e[s];a.id in t&&n.push(a)}return n}};function uu(i,e,t){let n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}var Ay=0;function Ty(i,e){let t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){let o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}function Cy(i){switch(i){case ei:return["Linear","( value )"];case Ye:return["sRGB","( value )"];default:return console.warn("THREE.WebGLProgram: Unsupported encoding:",i),["Linear","( value )"]}}function fu(i,e,t){let n=i.getShaderParameter(e,35713),s=i.getShaderInfoLog(e).trim();if(n&&s==="")return"";let r=/ERROR: 0:(\d+)/.exec(s);if(r){let a=parseInt(r[1]);return t.toUpperCase()+`

`+s+`

`+Ty(i.getShaderSource(e),a)}else return s}function Ry(i,e){let t=Cy(e);return"vec4 "+i+"( vec4 value ) { return LinearTo"+t[0]+t[1]+"; }"}function Ly(i,e){let t;switch(e){case e0:t="Linear";break;case t0:t="Reinhard";break;case n0:t="OptimizedCineon";break;case i0:t="ACESFilmic";break;case s0:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}function Py(i){return[i.extensionDerivatives||i.envMapCubeUVHeight||i.bumpMap||i.tangentSpaceNormalMap||i.clearcoatNormalMap||i.flatShading||i.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(i.extensionFragDepth||i.logarithmicDepthBuffer)&&i.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",i.extensionDrawBuffers&&i.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(i.extensionShaderTextureLOD||i.envMap||i.transmission)&&i.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(fs).join(`
`)}function Iy(i){let e=[];for(let t in i){let n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function Dy(i,e){let t={},n=i.getProgramParameter(e,35721);for(let s=0;s<n;s++){let r=i.getActiveAttrib(e,s),a=r.name,o=1;r.type===35674&&(o=2),r.type===35675&&(o=3),r.type===35676&&(o=4),t[a]={type:r.type,location:i.getAttribLocation(e,a),locationSize:o}}return t}function fs(i){return i!==""}function du(i,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function pu(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var Ny=/^[ \t]*#include +<([\w\d./]+)>/gm;function Oa(i){return i.replace(Ny,Oy)}function Oy(i,e){let t=Te[e];if(t===void 0)throw new Error("Can not resolve #include <"+e+">");return Oa(t)}var Fy=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function mu(i){return i.replace(Fy,zy)}function zy(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function gu(i){let e="precision "+i.precision+` float;
precision `+i.precision+" int;";return i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function Uy(i){let e="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Mu?e="SHADOWMAP_TYPE_PCF":i.shadowMapType===Ig?e="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===us&&(e="SHADOWMAP_TYPE_VSM"),e}function ky(i){let e="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Ii:case Di:e="ENVMAP_TYPE_CUBE";break;case kr:e="ENVMAP_TYPE_CUBE_UV";break}return e}function By(i){let e="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case Di:e="ENVMAP_MODE_REFRACTION";break}return e}function Hy(i){let e="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Au:e="ENVMAP_BLENDING_MULTIPLY";break;case jg:e="ENVMAP_BLENDING_MIX";break;case Qg:e="ENVMAP_BLENDING_ADD";break}return e}function Vy(i){let e=i.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:n,maxMip:t}}function Wy(i,e,t,n){let s=i.getContext(),r=t.defines,a=t.vertexShader,o=t.fragmentShader,l=Uy(t),c=ky(t),h=By(t),u=Hy(t),f=Vy(t),m=t.isWebGL2?"":Py(t),x=Iy(r),p=s.createProgram(),d,v,A=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(d=[x].filter(fs).join(`
`),d.length>0&&(d+=`
`),v=[m,x].filter(fs).join(`
`),v.length>0&&(v+=`
`)):(d=[gu(t),"#define SHADER_NAME "+t.shaderName,x,t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.supportsVertexTextures?"#define VERTEX_TEXTURES":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMap&&t.objectSpaceNormalMap?"#define OBJECTSPACE_NORMALMAP":"",t.normalMap&&t.tangentSpaceNormalMap?"#define TANGENTSPACE_NORMALMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.displacementMap&&t.supportsVertexTextures?"#define USE_DISPLACEMENTMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularIntensityMap?"#define USE_SPECULARINTENSITYMAP":"",t.specularColorMap?"#define USE_SPECULARCOLORMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEENCOLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEENROUGHNESSMAP":"",t.vertexTangents?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUvs?"#define USE_UV":"",t.uvsVertexOnly?"#define UVS_VERTEX_ONLY":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors&&t.isWebGL2?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.logarithmicDepthBuffer&&t.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(fs).join(`
`),v=[m,gu(t),"#define SHADER_NAME "+t.shaderName,x,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMap&&t.objectSpaceNormalMap?"#define OBJECTSPACE_NORMALMAP":"",t.normalMap&&t.tangentSpaceNormalMap?"#define TANGENTSPACE_NORMALMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularIntensityMap?"#define USE_SPECULARINTENSITYMAP":"",t.specularColorMap?"#define USE_SPECULARCOLORMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEENCOLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEENROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.vertexTangents?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUvs?"#define USE_UV":"",t.uvsVertexOnly?"#define UVS_VERTEX_ONLY":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.physicallyCorrectLights?"#define PHYSICALLY_CORRECT_LIGHTS":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.logarithmicDepthBuffer&&t.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==vn?"#define TONE_MAPPING":"",t.toneMapping!==vn?Te.tonemapping_pars_fragment:"",t.toneMapping!==vn?Ly("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Te.encodings_pars_fragment,Ry("linearToOutputTexel",t.outputEncoding),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(fs).join(`
`)),a=Oa(a),a=du(a,t),a=pu(a,t),o=Oa(o),o=du(o,t),o=pu(o,t),a=mu(a),o=mu(o),t.isWebGL2&&t.isRawShaderMaterial!==!0&&(A=`#version 300 es
`,d=["precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+d,v=["#define varying in",t.glslVersion===Bh?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Bh?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+v);let y=A+d+a,w=A+v+o,M=uu(s,35633,y),P=uu(s,35632,w);if(s.attachShader(p,M),s.attachShader(p,P),t.index0AttributeName!==void 0?s.bindAttribLocation(p,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(p,0,"position"),s.linkProgram(p),i.debug.checkShaderErrors){let S=s.getProgramInfoLog(p).trim(),D=s.getShaderInfoLog(M).trim(),L=s.getShaderInfoLog(P).trim(),G=!0,O=!0;if(s.getProgramParameter(p,35714)===!1){G=!1;let z=fu(s,M,"vertex"),T=fu(s,P,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(p,35715)+`

Program Info Log: `+S+`
`+z+`
`+T)}else S!==""?console.warn("THREE.WebGLProgram: Program Info Log:",S):(D===""||L==="")&&(O=!1);O&&(this.diagnostics={runnable:G,programLog:S,vertexShader:{log:D,prefix:d},fragmentShader:{log:L,prefix:v}})}s.deleteShader(M),s.deleteShader(P);let F;this.getUniforms=function(){return F===void 0&&(F=new Pi(s,p)),F};let g;return this.getAttributes=function(){return g===void 0&&(g=Dy(s,p)),g},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(p),this.program=void 0},this.name=t.shaderName,this.id=Ay++,this.cacheKey=e,this.usedTimes=1,this.program=p,this.vertexShader=M,this.fragmentShader=P,this}var Gy=0,Fa=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){let t=e.vertexShader,n=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(n),a=this._getShaderCacheForMaterial(e);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new za(e),t.set(e,n)),n}},za=class{constructor(e){this.id=Gy++,this.code=e,this.usedTimes=0}};function qy(i,e,t,n,s,r,a){let o=new Tr,l=new Fa,c=[],h=s.isWebGL2,u=s.logarithmicDepthBuffer,f=s.vertexTextures,m=s.precision,x={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function p(g,S,D,L,G){let O=L.fog,z=G.geometry,T=g.isMeshStandardMaterial?L.environment:null,R=(g.isMeshStandardMaterial?t:e).get(g.envMap||T),j=R&&R.mapping===kr?R.image.height:null,V=x[g.type];g.precision!==null&&(m=s.getMaxPrecision(g.precision),m!==g.precision&&console.warn("THREE.WebGLProgram.getParameters:",g.precision,"not supported, using",m,"instead."));let Q=z.morphAttributes.position||z.morphAttributes.normal||z.morphAttributes.color,Z=Q!==void 0?Q.length:0,ue=0;z.morphAttributes.position!==void 0&&(ue=1),z.morphAttributes.normal!==void 0&&(ue=2),z.morphAttributes.color!==void 0&&(ue=3);let B,ee,re,se;if(V){let J=sn[V];B=J.vertexShader,ee=J.fragmentShader}else B=g.vertexShader,ee=g.fragmentShader,l.update(g),re=l.getVertexShaderID(g),se=l.getFragmentShaderID(g);let N=i.getRenderTarget(),we=g.alphaTest>0,xe=g.clearcoat>0,q=g.iridescence>0;return{isWebGL2:h,shaderID:V,shaderName:g.type,vertexShader:B,fragmentShader:ee,defines:g.defines,customVertexShaderID:re,customFragmentShaderID:se,isRawShaderMaterial:g.isRawShaderMaterial===!0,glslVersion:g.glslVersion,precision:m,instancing:G.isInstancedMesh===!0,instancingColor:G.isInstancedMesh===!0&&G.instanceColor!==null,supportsVertexTextures:f,outputEncoding:N===null?i.outputEncoding:N.isXRRenderTarget===!0?N.texture.encoding:ei,map:!!g.map,matcap:!!g.matcap,envMap:!!R,envMapMode:R&&R.mapping,envMapCubeUVHeight:j,lightMap:!!g.lightMap,aoMap:!!g.aoMap,emissiveMap:!!g.emissiveMap,bumpMap:!!g.bumpMap,normalMap:!!g.normalMap,objectSpaceNormalMap:g.normalMapType===M0,tangentSpaceNormalMap:g.normalMapType===Ru,decodeVideoTexture:!!g.map&&g.map.isVideoTexture===!0&&g.map.encoding===Ye,clearcoat:xe,clearcoatMap:xe&&!!g.clearcoatMap,clearcoatRoughnessMap:xe&&!!g.clearcoatRoughnessMap,clearcoatNormalMap:xe&&!!g.clearcoatNormalMap,iridescence:q,iridescenceMap:q&&!!g.iridescenceMap,iridescenceThicknessMap:q&&!!g.iridescenceThicknessMap,displacementMap:!!g.displacementMap,roughnessMap:!!g.roughnessMap,metalnessMap:!!g.metalnessMap,specularMap:!!g.specularMap,specularIntensityMap:!!g.specularIntensityMap,specularColorMap:!!g.specularColorMap,opaque:g.transparent===!1&&g.blending===Ri,alphaMap:!!g.alphaMap,alphaTest:we,gradientMap:!!g.gradientMap,sheen:g.sheen>0,sheenColorMap:!!g.sheenColorMap,sheenRoughnessMap:!!g.sheenRoughnessMap,transmission:g.transmission>0,transmissionMap:!!g.transmissionMap,thicknessMap:!!g.thicknessMap,combine:g.combine,vertexTangents:!!g.normalMap&&!!z.attributes.tangent,vertexColors:g.vertexColors,vertexAlphas:g.vertexColors===!0&&!!z.attributes.color&&z.attributes.color.itemSize===4,vertexUvs:!!g.map||!!g.bumpMap||!!g.normalMap||!!g.specularMap||!!g.alphaMap||!!g.emissiveMap||!!g.roughnessMap||!!g.metalnessMap||!!g.clearcoatMap||!!g.clearcoatRoughnessMap||!!g.clearcoatNormalMap||!!g.iridescenceMap||!!g.iridescenceThicknessMap||!!g.displacementMap||!!g.transmissionMap||!!g.thicknessMap||!!g.specularIntensityMap||!!g.specularColorMap||!!g.sheenColorMap||!!g.sheenRoughnessMap,uvsVertexOnly:!(g.map||g.bumpMap||g.normalMap||g.specularMap||g.alphaMap||g.emissiveMap||g.roughnessMap||g.metalnessMap||g.clearcoatNormalMap||g.iridescenceMap||g.iridescenceThicknessMap||g.transmission>0||g.transmissionMap||g.thicknessMap||g.specularIntensityMap||g.specularColorMap||g.sheen>0||g.sheenColorMap||g.sheenRoughnessMap)&&!!g.displacementMap,fog:!!O,useFog:g.fog===!0,fogExp2:O&&O.isFogExp2,flatShading:!!g.flatShading,sizeAttenuation:g.sizeAttenuation,logarithmicDepthBuffer:u,skinning:G.isSkinnedMesh===!0,morphTargets:z.morphAttributes.position!==void 0,morphNormals:z.morphAttributes.normal!==void 0,morphColors:z.morphAttributes.color!==void 0,morphTargetsCount:Z,morphTextureStride:ue,numDirLights:S.directional.length,numPointLights:S.point.length,numSpotLights:S.spot.length,numSpotLightMaps:S.spotLightMap.length,numRectAreaLights:S.rectArea.length,numHemiLights:S.hemi.length,numDirLightShadows:S.directionalShadowMap.length,numPointLightShadows:S.pointShadowMap.length,numSpotLightShadows:S.spotShadowMap.length,numSpotLightShadowsWithMaps:S.numSpotLightShadowsWithMaps,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:g.dithering,shadowMapEnabled:i.shadowMap.enabled&&D.length>0,shadowMapType:i.shadowMap.type,toneMapping:g.toneMapped?i.toneMapping:vn,physicallyCorrectLights:i.physicallyCorrectLights,premultipliedAlpha:g.premultipliedAlpha,doubleSided:g.side===In,flipSided:g.side===Dt,useDepthPacking:!!g.depthPacking,depthPacking:g.depthPacking||0,index0AttributeName:g.index0AttributeName,extensionDerivatives:g.extensions&&g.extensions.derivatives,extensionFragDepth:g.extensions&&g.extensions.fragDepth,extensionDrawBuffers:g.extensions&&g.extensions.drawBuffers,extensionShaderTextureLOD:g.extensions&&g.extensions.shaderTextureLOD,rendererExtensionFragDepth:h||n.has("EXT_frag_depth"),rendererExtensionDrawBuffers:h||n.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:h||n.has("EXT_shader_texture_lod"),customProgramCacheKey:g.customProgramCacheKey()}}function d(g){let S=[];if(g.shaderID?S.push(g.shaderID):(S.push(g.customVertexShaderID),S.push(g.customFragmentShaderID)),g.defines!==void 0)for(let D in g.defines)S.push(D),S.push(g.defines[D]);return g.isRawShaderMaterial===!1&&(v(S,g),A(S,g),S.push(i.outputEncoding)),S.push(g.customProgramCacheKey),S.join()}function v(g,S){g.push(S.precision),g.push(S.outputEncoding),g.push(S.envMapMode),g.push(S.envMapCubeUVHeight),g.push(S.combine),g.push(S.vertexUvs),g.push(S.fogExp2),g.push(S.sizeAttenuation),g.push(S.morphTargetsCount),g.push(S.morphAttributeCount),g.push(S.numDirLights),g.push(S.numPointLights),g.push(S.numSpotLights),g.push(S.numSpotLightMaps),g.push(S.numHemiLights),g.push(S.numRectAreaLights),g.push(S.numDirLightShadows),g.push(S.numPointLightShadows),g.push(S.numSpotLightShadows),g.push(S.numSpotLightShadowsWithMaps),g.push(S.shadowMapType),g.push(S.toneMapping),g.push(S.numClippingPlanes),g.push(S.numClipIntersection),g.push(S.depthPacking)}function A(g,S){o.disableAll(),S.isWebGL2&&o.enable(0),S.supportsVertexTextures&&o.enable(1),S.instancing&&o.enable(2),S.instancingColor&&o.enable(3),S.map&&o.enable(4),S.matcap&&o.enable(5),S.envMap&&o.enable(6),S.lightMap&&o.enable(7),S.aoMap&&o.enable(8),S.emissiveMap&&o.enable(9),S.bumpMap&&o.enable(10),S.normalMap&&o.enable(11),S.objectSpaceNormalMap&&o.enable(12),S.tangentSpaceNormalMap&&o.enable(13),S.clearcoat&&o.enable(14),S.clearcoatMap&&o.enable(15),S.clearcoatRoughnessMap&&o.enable(16),S.clearcoatNormalMap&&o.enable(17),S.iridescence&&o.enable(18),S.iridescenceMap&&o.enable(19),S.iridescenceThicknessMap&&o.enable(20),S.displacementMap&&o.enable(21),S.specularMap&&o.enable(22),S.roughnessMap&&o.enable(23),S.metalnessMap&&o.enable(24),S.gradientMap&&o.enable(25),S.alphaMap&&o.enable(26),S.alphaTest&&o.enable(27),S.vertexColors&&o.enable(28),S.vertexAlphas&&o.enable(29),S.vertexUvs&&o.enable(30),S.vertexTangents&&o.enable(31),S.uvsVertexOnly&&o.enable(32),g.push(o.mask),o.disableAll(),S.fog&&o.enable(0),S.useFog&&o.enable(1),S.flatShading&&o.enable(2),S.logarithmicDepthBuffer&&o.enable(3),S.skinning&&o.enable(4),S.morphTargets&&o.enable(5),S.morphNormals&&o.enable(6),S.morphColors&&o.enable(7),S.premultipliedAlpha&&o.enable(8),S.shadowMapEnabled&&o.enable(9),S.physicallyCorrectLights&&o.enable(10),S.doubleSided&&o.enable(11),S.flipSided&&o.enable(12),S.useDepthPacking&&o.enable(13),S.dithering&&o.enable(14),S.specularIntensityMap&&o.enable(15),S.specularColorMap&&o.enable(16),S.transmission&&o.enable(17),S.transmissionMap&&o.enable(18),S.thicknessMap&&o.enable(19),S.sheen&&o.enable(20),S.sheenColorMap&&o.enable(21),S.sheenRoughnessMap&&o.enable(22),S.decodeVideoTexture&&o.enable(23),S.opaque&&o.enable(24),g.push(o.mask)}function y(g){let S=x[g.type],D;if(S){let L=sn[S];D=U0.clone(L.uniforms)}else D=g.uniforms;return D}function w(g,S){let D;for(let L=0,G=c.length;L<G;L++){let O=c[L];if(O.cacheKey===S){D=O,++D.usedTimes;break}}return D===void 0&&(D=new Wy(i,S,g,r),c.push(D)),D}function M(g){if(--g.usedTimes===0){let S=c.indexOf(g);c[S]=c[c.length-1],c.pop(),g.destroy()}}function P(g){l.remove(g)}function F(){l.dispose()}return{getParameters:p,getProgramCacheKey:d,getUniforms:y,acquireProgram:w,releaseProgram:M,releaseShaderCache:P,programs:c,dispose:F}}function Xy(){let i=new WeakMap;function e(r){let a=i.get(r);return a===void 0&&(a={},i.set(r,a)),a}function t(r){i.delete(r)}function n(r,a,o){i.get(r)[a]=o}function s(){i=new WeakMap}return{get:e,remove:t,update:n,dispose:s}}function Yy(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function xu(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function _u(){let i=[],e=0,t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function a(u,f,m,x,p,d){let v=i[e];return v===void 0?(v={id:u.id,object:u,geometry:f,material:m,groupOrder:x,renderOrder:u.renderOrder,z:p,group:d},i[e]=v):(v.id=u.id,v.object=u,v.geometry=f,v.material=m,v.groupOrder=x,v.renderOrder=u.renderOrder,v.z=p,v.group=d),e++,v}function o(u,f,m,x,p,d){let v=a(u,f,m,x,p,d);m.transmission>0?n.push(v):m.transparent===!0?s.push(v):t.push(v)}function l(u,f,m,x,p,d){let v=a(u,f,m,x,p,d);m.transmission>0?n.unshift(v):m.transparent===!0?s.unshift(v):t.unshift(v)}function c(u,f){t.length>1&&t.sort(u||Yy),n.length>1&&n.sort(f||xu),s.length>1&&s.sort(f||xu)}function h(){for(let u=e,f=i.length;u<f;u++){let m=i[u];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:o,unshift:l,finish:h,sort:c}}function $y(){let i=new WeakMap;function e(n,s){let r=i.get(n),a;return r===void 0?(a=new _u,i.set(n,[a])):s>=r.length?(a=new _u,r.push(a)):a=r[s],a}function t(){i=new WeakMap}return{get:e,dispose:t}}function Ky(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new W,color:new qe};break;case"SpotLight":t={position:new W,direction:new W,color:new qe,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new W,color:new qe,distance:0,decay:0};break;case"HemisphereLight":t={direction:new W,skyColor:new qe,groundColor:new qe};break;case"RectAreaLight":t={color:new qe,position:new W,halfWidth:new W,halfHeight:new W};break}return i[e.id]=t,t}}}function Zy(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ae};break;case"SpotLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ae};break;case"PointLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ae,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}var Jy=0;function jy(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function Qy(i,e){let t=new Ky,n=Zy(),s={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0};for(let h=0;h<9;h++)s.probe.push(new W);let r=new W,a=new je,o=new je;function l(h,u){let f=0,m=0,x=0;for(let L=0;L<9;L++)s.probe[L].set(0,0,0);let p=0,d=0,v=0,A=0,y=0,w=0,M=0,P=0,F=0,g=0;h.sort(jy);let S=u!==!0?Math.PI:1;for(let L=0,G=h.length;L<G;L++){let O=h[L],z=O.color,T=O.intensity,R=O.distance,j=O.shadow&&O.shadow.map?O.shadow.map.texture:null;if(O.isAmbientLight)f+=z.r*T*S,m+=z.g*T*S,x+=z.b*T*S;else if(O.isLightProbe)for(let V=0;V<9;V++)s.probe[V].addScaledVector(O.sh.coefficients[V],T);else if(O.isDirectionalLight){let V=t.get(O);if(V.color.copy(O.color).multiplyScalar(O.intensity*S),O.castShadow){let Q=O.shadow,Z=n.get(O);Z.shadowBias=Q.bias,Z.shadowNormalBias=Q.normalBias,Z.shadowRadius=Q.radius,Z.shadowMapSize=Q.mapSize,s.directionalShadow[p]=Z,s.directionalShadowMap[p]=j,s.directionalShadowMatrix[p]=O.shadow.matrix,w++}s.directional[p]=V,p++}else if(O.isSpotLight){let V=t.get(O);V.position.setFromMatrixPosition(O.matrixWorld),V.color.copy(z).multiplyScalar(T*S),V.distance=R,V.coneCos=Math.cos(O.angle),V.penumbraCos=Math.cos(O.angle*(1-O.penumbra)),V.decay=O.decay,s.spot[v]=V;let Q=O.shadow;if(O.map&&(s.spotLightMap[F]=O.map,F++,Q.updateMatrices(O),O.castShadow&&g++),s.spotLightMatrix[v]=Q.matrix,O.castShadow){let Z=n.get(O);Z.shadowBias=Q.bias,Z.shadowNormalBias=Q.normalBias,Z.shadowRadius=Q.radius,Z.shadowMapSize=Q.mapSize,s.spotShadow[v]=Z,s.spotShadowMap[v]=j,P++}v++}else if(O.isRectAreaLight){let V=t.get(O);V.color.copy(z).multiplyScalar(T),V.halfWidth.set(O.width*.5,0,0),V.halfHeight.set(0,O.height*.5,0),s.rectArea[A]=V,A++}else if(O.isPointLight){let V=t.get(O);if(V.color.copy(O.color).multiplyScalar(O.intensity*S),V.distance=O.distance,V.decay=O.decay,O.castShadow){let Q=O.shadow,Z=n.get(O);Z.shadowBias=Q.bias,Z.shadowNormalBias=Q.normalBias,Z.shadowRadius=Q.radius,Z.shadowMapSize=Q.mapSize,Z.shadowCameraNear=Q.camera.near,Z.shadowCameraFar=Q.camera.far,s.pointShadow[d]=Z,s.pointShadowMap[d]=j,s.pointShadowMatrix[d]=O.shadow.matrix,M++}s.point[d]=V,d++}else if(O.isHemisphereLight){let V=t.get(O);V.skyColor.copy(O.color).multiplyScalar(T*S),V.groundColor.copy(O.groundColor).multiplyScalar(T*S),s.hemi[y]=V,y++}}A>0&&(e.isWebGL2||i.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=le.LTC_FLOAT_1,s.rectAreaLTC2=le.LTC_FLOAT_2):i.has("OES_texture_half_float_linear")===!0?(s.rectAreaLTC1=le.LTC_HALF_1,s.rectAreaLTC2=le.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),s.ambient[0]=f,s.ambient[1]=m,s.ambient[2]=x;let D=s.hash;(D.directionalLength!==p||D.pointLength!==d||D.spotLength!==v||D.rectAreaLength!==A||D.hemiLength!==y||D.numDirectionalShadows!==w||D.numPointShadows!==M||D.numSpotShadows!==P||D.numSpotMaps!==F)&&(s.directional.length=p,s.spot.length=v,s.rectArea.length=A,s.point.length=d,s.hemi.length=y,s.directionalShadow.length=w,s.directionalShadowMap.length=w,s.pointShadow.length=M,s.pointShadowMap.length=M,s.spotShadow.length=P,s.spotShadowMap.length=P,s.directionalShadowMatrix.length=w,s.pointShadowMatrix.length=M,s.spotLightMatrix.length=P+F-g,s.spotLightMap.length=F,s.numSpotLightShadowsWithMaps=g,D.directionalLength=p,D.pointLength=d,D.spotLength=v,D.rectAreaLength=A,D.hemiLength=y,D.numDirectionalShadows=w,D.numPointShadows=M,D.numSpotShadows=P,D.numSpotMaps=F,s.version=Jy++)}function c(h,u){let f=0,m=0,x=0,p=0,d=0,v=u.matrixWorldInverse;for(let A=0,y=h.length;A<y;A++){let w=h[A];if(w.isDirectionalLight){let M=s.directional[f];M.direction.setFromMatrixPosition(w.matrixWorld),r.setFromMatrixPosition(w.target.matrixWorld),M.direction.sub(r),M.direction.transformDirection(v),f++}else if(w.isSpotLight){let M=s.spot[x];M.position.setFromMatrixPosition(w.matrixWorld),M.position.applyMatrix4(v),M.direction.setFromMatrixPosition(w.matrixWorld),r.setFromMatrixPosition(w.target.matrixWorld),M.direction.sub(r),M.direction.transformDirection(v),x++}else if(w.isRectAreaLight){let M=s.rectArea[p];M.position.setFromMatrixPosition(w.matrixWorld),M.position.applyMatrix4(v),o.identity(),a.copy(w.matrixWorld),a.premultiply(v),o.extractRotation(a),M.halfWidth.set(w.width*.5,0,0),M.halfHeight.set(0,w.height*.5,0),M.halfWidth.applyMatrix4(o),M.halfHeight.applyMatrix4(o),p++}else if(w.isPointLight){let M=s.point[m];M.position.setFromMatrixPosition(w.matrixWorld),M.position.applyMatrix4(v),m++}else if(w.isHemisphereLight){let M=s.hemi[d];M.direction.setFromMatrixPosition(w.matrixWorld),M.direction.transformDirection(v),d++}}}return{setup:l,setupView:c,state:s}}function vu(i,e){let t=new Qy(i,e),n=[],s=[];function r(){n.length=0,s.length=0}function a(u){n.push(u)}function o(u){s.push(u)}function l(u){t.setup(n,u)}function c(u){t.setupView(n,u)}return{init:r,state:{lightsArray:n,shadowsArray:s,lights:t},setupLights:l,setupLightsView:c,pushLight:a,pushShadow:o}}function eb(i,e){let t=new WeakMap;function n(r,a=0){let o=t.get(r),l;return o===void 0?(l=new vu(i,e),t.set(r,[l])):a>=o.length?(l=new vu(i,e),o.push(l)):l=o[a],l}function s(){t=new WeakMap}return{get:n,dispose:s}}var Ua=class extends ni{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=b0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},ka=class extends ni{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.referencePosition=new W,this.nearDistance=1,this.farDistance=1e3,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.referencePosition.copy(e.referencePosition),this.nearDistance=e.nearDistance,this.farDistance=e.farDistance,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}},tb=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,nb=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function ib(i,e,t){let n=new vs,s=new Ae,r=new Ae,a=new it,o=new Ua({depthPacking:w0}),l=new ka,c={},h=t.maxTextureSize,u={[Nn]:Dt,[Dt]:Nn,[In]:In},f=new Mn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Ae},radius:{value:4}},vertexShader:tb,fragmentShader:nb}),m=f.clone();m.defines.HORIZONTAL_PASS=1;let x=new wn;x.setAttribute("position",new Bt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let p=new At(x,f),d=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Mu,this.render=function(w,M,P){if(d.enabled===!1||d.autoUpdate===!1&&d.needsUpdate===!1||w.length===0)return;let F=i.getRenderTarget(),g=i.getActiveCubeFace(),S=i.getActiveMipmapLevel(),D=i.state;D.setBlending(Dn),D.buffers.color.setClear(1,1,1,1),D.buffers.depth.setTest(!0),D.setScissorTest(!1);for(let L=0,G=w.length;L<G;L++){let O=w[L],z=O.shadow;if(z===void 0){console.warn("THREE.WebGLShadowMap:",O,"has no shadow.");continue}if(z.autoUpdate===!1&&z.needsUpdate===!1)continue;s.copy(z.mapSize);let T=z.getFrameExtents();if(s.multiply(T),r.copy(z.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/T.x),s.x=r.x*T.x,z.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/T.y),s.y=r.y*T.y,z.mapSize.y=r.y)),z.map===null){let j=this.type!==us?{minFilter:vt,magFilter:vt}:{};z.map=new bn(s.x,s.y,j),z.map.texture.name=O.name+".shadowMap",z.camera.updateProjectionMatrix()}i.setRenderTarget(z.map),i.clear();let R=z.getViewportCount();for(let j=0;j<R;j++){let V=z.getViewport(j);a.set(r.x*V.x,r.y*V.y,r.x*V.z,r.y*V.w),D.viewport(a),z.updateMatrices(O,j),n=z.getFrustum(),y(M,P,z.camera,O,this.type)}z.isPointLightShadow!==!0&&this.type===us&&v(z,P),z.needsUpdate=!1}d.needsUpdate=!1,i.setRenderTarget(F,g,S)};function v(w,M){let P=e.update(p);f.defines.VSM_SAMPLES!==w.blurSamples&&(f.defines.VSM_SAMPLES=w.blurSamples,m.defines.VSM_SAMPLES=w.blurSamples,f.needsUpdate=!0,m.needsUpdate=!0),w.mapPass===null&&(w.mapPass=new bn(s.x,s.y)),f.uniforms.shadow_pass.value=w.map.texture,f.uniforms.resolution.value=w.mapSize,f.uniforms.radius.value=w.radius,i.setRenderTarget(w.mapPass),i.clear(),i.renderBufferDirect(M,null,P,f,p,null),m.uniforms.shadow_pass.value=w.mapPass.texture,m.uniforms.resolution.value=w.mapSize,m.uniforms.radius.value=w.radius,i.setRenderTarget(w.map),i.clear(),i.renderBufferDirect(M,null,P,m,p,null)}function A(w,M,P,F,g,S){let D=null,L=P.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(L!==void 0)D=L;else if(D=P.isPointLight===!0?l:o,i.localClippingEnabled&&M.clipShadows===!0&&Array.isArray(M.clippingPlanes)&&M.clippingPlanes.length!==0||M.displacementMap&&M.displacementScale!==0||M.alphaMap&&M.alphaTest>0||M.map&&M.alphaTest>0){let G=D.uuid,O=M.uuid,z=c[G];z===void 0&&(z={},c[G]=z);let T=z[O];T===void 0&&(T=D.clone(),z[O]=T),D=T}return D.visible=M.visible,D.wireframe=M.wireframe,S===us?D.side=M.shadowSide!==null?M.shadowSide:M.side:D.side=M.shadowSide!==null?M.shadowSide:u[M.side],D.alphaMap=M.alphaMap,D.alphaTest=M.alphaTest,D.map=M.map,D.clipShadows=M.clipShadows,D.clippingPlanes=M.clippingPlanes,D.clipIntersection=M.clipIntersection,D.displacementMap=M.displacementMap,D.displacementScale=M.displacementScale,D.displacementBias=M.displacementBias,D.wireframeLinewidth=M.wireframeLinewidth,D.linewidth=M.linewidth,P.isPointLight===!0&&D.isMeshDistanceMaterial===!0&&(D.referencePosition.setFromMatrixPosition(P.matrixWorld),D.nearDistance=F,D.farDistance=g),D}function y(w,M,P,F,g){if(w.visible===!1)return;if(w.layers.test(M.layers)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&g===us)&&(!w.frustumCulled||n.intersectsObject(w))){w.modelViewMatrix.multiplyMatrices(P.matrixWorldInverse,w.matrixWorld);let L=e.update(w),G=w.material;if(Array.isArray(G)){let O=L.groups;for(let z=0,T=O.length;z<T;z++){let R=O[z],j=G[R.materialIndex];if(j&&j.visible){let V=A(w,j,F,P.near,P.far,g);i.renderBufferDirect(P,null,L,V,w,R)}}}else if(G.visible){let O=A(w,G,F,P.near,P.far,g);i.renderBufferDirect(P,null,L,O,w,null)}}let D=w.children;for(let L=0,G=D.length;L<G;L++)y(D[L],M,P,F,g)}}function sb(i,e,t){let n=t.isWebGL2;function s(){let I=!1,Y=new it,ne=null,me=new it(0,0,0,0);return{setMask:function(be){ne!==be&&!I&&(i.colorMask(be,be,be,be),ne=be)},setLocked:function(be){I=be},setClear:function(be,He,at,dt,On){On===!0&&(be*=dt,He*=dt,at*=dt),Y.set(be,He,at,dt),me.equals(Y)===!1&&(i.clearColor(be,He,at,dt),me.copy(Y))},reset:function(){I=!1,ne=null,me.set(-1,0,0,0)}}}function r(){let I=!1,Y=null,ne=null,me=null;return{setTest:function(be){be?we(2929):xe(2929)},setMask:function(be){Y!==be&&!I&&(i.depthMask(be),Y=be)},setFunc:function(be){if(ne!==be){switch(be){case qg:i.depthFunc(512);break;case Xg:i.depthFunc(519);break;case Yg:i.depthFunc(513);break;case ba:i.depthFunc(515);break;case $g:i.depthFunc(514);break;case Kg:i.depthFunc(518);break;case Zg:i.depthFunc(516);break;case Jg:i.depthFunc(517);break;default:i.depthFunc(515)}ne=be}},setLocked:function(be){I=be},setClear:function(be){me!==be&&(i.clearDepth(be),me=be)},reset:function(){I=!1,Y=null,ne=null,me=null}}}function a(){let I=!1,Y=null,ne=null,me=null,be=null,He=null,at=null,dt=null,On=null;return{setTest:function(Ke){I||(Ke?we(2960):xe(2960))},setMask:function(Ke){Y!==Ke&&!I&&(i.stencilMask(Ke),Y=Ke)},setFunc:function(Ke,ln,Ft){(ne!==Ke||me!==ln||be!==Ft)&&(i.stencilFunc(Ke,ln,Ft),ne=Ke,me=ln,be=Ft)},setOp:function(Ke,ln,Ft){(He!==Ke||at!==ln||dt!==Ft)&&(i.stencilOp(Ke,ln,Ft),He=Ke,at=ln,dt=Ft)},setLocked:function(Ke){I=Ke},setClear:function(Ke){On!==Ke&&(i.clearStencil(Ke),On=Ke)},reset:function(){I=!1,Y=null,ne=null,me=null,be=null,He=null,at=null,dt=null,On=null}}}let o=new s,l=new r,c=new a,h=new WeakMap,u=new WeakMap,f={},m={},x=new WeakMap,p=[],d=null,v=!1,A=null,y=null,w=null,M=null,P=null,F=null,g=null,S=!1,D=null,L=null,G=null,O=null,z=null,T=i.getParameter(35661),R=!1,j=0,V=i.getParameter(7938);V.indexOf("WebGL")!==-1?(j=parseFloat(/^WebGL (\d)/.exec(V)[1]),R=j>=1):V.indexOf("OpenGL ES")!==-1&&(j=parseFloat(/^OpenGL ES (\d)/.exec(V)[1]),R=j>=2);let Q=null,Z={},ue=i.getParameter(3088),B=i.getParameter(2978),ee=new it().fromArray(ue),re=new it().fromArray(B);function se(I,Y,ne){let me=new Uint8Array(4),be=i.createTexture();i.bindTexture(I,be),i.texParameteri(I,10241,9728),i.texParameteri(I,10240,9728);for(let He=0;He<ne;He++)i.texImage2D(Y+He,0,6408,1,1,0,6408,5121,me);return be}let N={};N[3553]=se(3553,3553,1),N[34067]=se(34067,34069,6),o.setClear(0,0,0,1),l.setClear(1),c.setClear(0),we(2929),l.setFunc(ba),$e(!1),Qe(oh),we(2884),Ie(Dn);function we(I){f[I]!==!0&&(i.enable(I),f[I]=!0)}function xe(I){f[I]!==!1&&(i.disable(I),f[I]=!1)}function q(I,Y){return m[I]!==Y?(i.bindFramebuffer(I,Y),m[I]=Y,n&&(I===36009&&(m[36160]=Y),I===36160&&(m[36009]=Y)),!0):!1}function te(I,Y){let ne=p,me=!1;if(I)if(ne=x.get(Y),ne===void 0&&(ne=[],x.set(Y,ne)),I.isWebGLMultipleRenderTargets){let be=I.texture;if(ne.length!==be.length||ne[0]!==36064){for(let He=0,at=be.length;He<at;He++)ne[He]=36064+He;ne.length=be.length,me=!0}}else ne[0]!==36064&&(ne[0]=36064,me=!0);else ne[0]!==1029&&(ne[0]=1029,me=!0);me&&(t.isWebGL2?i.drawBuffers(ne):e.get("WEBGL_draw_buffers").drawBuffersWEBGL(ne))}function J(I){return d!==I?(i.useProgram(I),d=I,!0):!1}let ae={[Ti]:32774,[Ng]:32778,[Og]:32779};if(n)ae[hh]=32775,ae[uh]=32776;else{let I=e.get("EXT_blend_minmax");I!==null&&(ae[hh]=I.MIN_EXT,ae[uh]=I.MAX_EXT)}let he={[Fg]:0,[zg]:1,[Ug]:768,[Su]:770,[Gg]:776,[Vg]:774,[Bg]:772,[kg]:769,[Eu]:771,[Wg]:775,[Hg]:773};function Ie(I,Y,ne,me,be,He,at,dt){if(I===Dn){v===!0&&(xe(3042),v=!1);return}if(v===!1&&(we(3042),v=!0),I!==Dg){if(I!==A||dt!==S){if((y!==Ti||P!==Ti)&&(i.blendEquation(32774),y=Ti,P=Ti),dt)switch(I){case Ri:i.blendFuncSeparate(1,771,1,771);break;case ah:i.blendFunc(1,1);break;case lh:i.blendFuncSeparate(0,769,0,1);break;case ch:i.blendFuncSeparate(0,768,0,770);break;default:console.error("THREE.WebGLState: Invalid blending: ",I);break}else switch(I){case Ri:i.blendFuncSeparate(770,771,1,771);break;case ah:i.blendFunc(770,1);break;case lh:i.blendFuncSeparate(0,769,0,1);break;case ch:i.blendFunc(0,768);break;default:console.error("THREE.WebGLState: Invalid blending: ",I);break}w=null,M=null,F=null,g=null,A=I,S=dt}return}be=be||Y,He=He||ne,at=at||me,(Y!==y||be!==P)&&(i.blendEquationSeparate(ae[Y],ae[be]),y=Y,P=be),(ne!==w||me!==M||He!==F||at!==g)&&(i.blendFuncSeparate(he[ne],he[me],he[He],he[at]),w=ne,M=me,F=He,g=at),A=I,S=!1}function Le(I,Y){I.side===In?xe(2884):we(2884);let ne=I.side===Dt;Y&&(ne=!ne),$e(ne),I.blending===Ri&&I.transparent===!1?Ie(Dn):Ie(I.blending,I.blendEquation,I.blendSrc,I.blendDst,I.blendEquationAlpha,I.blendSrcAlpha,I.blendDstAlpha,I.premultipliedAlpha),l.setFunc(I.depthFunc),l.setTest(I.depthTest),l.setMask(I.depthWrite),o.setMask(I.colorWrite);let me=I.stencilWrite;c.setTest(me),me&&(c.setMask(I.stencilWriteMask),c.setFunc(I.stencilFunc,I.stencilRef,I.stencilFuncMask),c.setOp(I.stencilFail,I.stencilZFail,I.stencilZPass)),ke(I.polygonOffset,I.polygonOffsetFactor,I.polygonOffsetUnits),I.alphaToCoverage===!0?we(32926):xe(32926)}function $e(I){D!==I&&(I?i.frontFace(2304):i.frontFace(2305),D=I)}function Qe(I){I!==Lg?(we(2884),I!==L&&(I===oh?i.cullFace(1029):I===Pg?i.cullFace(1028):i.cullFace(1032))):xe(2884),L=I}function Ze(I){I!==G&&(R&&i.lineWidth(I),G=I)}function ke(I,Y,ne){I?(we(32823),(O!==Y||z!==ne)&&(i.polygonOffset(Y,ne),O=Y,z=ne)):xe(32823)}function Ot(I){I?we(3089):xe(3089)}function bt(I){I===void 0&&(I=33984+T-1),Q!==I&&(i.activeTexture(I),Q=I)}function E(I,Y,ne){ne===void 0&&(Q===null?ne=33984+T-1:ne=Q);let me=Z[ne];me===void 0&&(me={type:void 0,texture:void 0},Z[ne]=me),(me.type!==I||me.texture!==Y)&&(Q!==ne&&(i.activeTexture(ne),Q=ne),i.bindTexture(I,Y||N[I]),me.type=I,me.texture=Y)}function _(){let I=Z[Q];I!==void 0&&I.type!==void 0&&(i.bindTexture(I.type,null),I.type=void 0,I.texture=void 0)}function X(){try{i.compressedTexImage2D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function ie(){try{i.compressedTexImage3D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function oe(){try{i.texSubImage2D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function fe(){try{i.texSubImage3D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Se(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function C(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function U(){try{i.texStorage2D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function pe(){try{i.texStorage3D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function ge(){try{i.texImage2D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function de(){try{i.texImage3D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function ye(I){ee.equals(I)===!1&&(i.scissor(I.x,I.y,I.z,I.w),ee.copy(I))}function ve(I){re.equals(I)===!1&&(i.viewport(I.x,I.y,I.z,I.w),re.copy(I))}function Pe(I,Y){let ne=u.get(Y);ne===void 0&&(ne=new WeakMap,u.set(Y,ne));let me=ne.get(I);me===void 0&&(me=i.getUniformBlockIndex(Y,I.name),ne.set(I,me))}function De(I,Y){let me=u.get(Y).get(I);h.get(Y)!==me&&(i.uniformBlockBinding(Y,me,I.__bindingPointIndex),h.set(Y,me))}function We(){i.disable(3042),i.disable(2884),i.disable(2929),i.disable(32823),i.disable(3089),i.disable(2960),i.disable(32926),i.blendEquation(32774),i.blendFunc(1,0),i.blendFuncSeparate(1,0,1,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(513),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(519,0,4294967295),i.stencilOp(7680,7680,7680),i.clearStencil(0),i.cullFace(1029),i.frontFace(2305),i.polygonOffset(0,0),i.activeTexture(33984),i.bindFramebuffer(36160,null),n===!0&&(i.bindFramebuffer(36009,null),i.bindFramebuffer(36008,null)),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),f={},Q=null,Z={},m={},x=new WeakMap,p=[],d=null,v=!1,A=null,y=null,w=null,M=null,P=null,F=null,g=null,S=!1,D=null,L=null,G=null,O=null,z=null,ee.set(0,0,i.canvas.width,i.canvas.height),re.set(0,0,i.canvas.width,i.canvas.height),o.reset(),l.reset(),c.reset()}return{buffers:{color:o,depth:l,stencil:c},enable:we,disable:xe,bindFramebuffer:q,drawBuffers:te,useProgram:J,setBlending:Ie,setMaterial:Le,setFlipSided:$e,setCullFace:Qe,setLineWidth:Ze,setPolygonOffset:ke,setScissorTest:Ot,activeTexture:bt,bindTexture:E,unbindTexture:_,compressedTexImage2D:X,compressedTexImage3D:ie,texImage2D:ge,texImage3D:de,updateUBOMapping:Pe,uniformBlockBinding:De,texStorage2D:U,texStorage3D:pe,texSubImage2D:oe,texSubImage3D:fe,compressedTexSubImage2D:Se,compressedTexSubImage3D:C,scissor:ye,viewport:ve,reset:We}}function rb(i,e,t,n,s,r,a){let o=s.isWebGL2,l=s.maxTextures,c=s.maxCubemapSize,h=s.maxTextureSize,u=s.maxSamples,f=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,m=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),x=new WeakMap,p,d=new WeakMap,v=!1;try{v=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function A(E,_){return v?new OffscreenCanvas(E,_):xs("canvas")}function y(E,_,X,ie){let oe=1;if((E.width>ie||E.height>ie)&&(oe=ie/Math.max(E.width,E.height)),oe<1||_===!0)if(typeof HTMLImageElement<"u"&&E instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&E instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&E instanceof ImageBitmap){let fe=_?Ta:Math.floor,Se=fe(oe*E.width),C=fe(oe*E.height);p===void 0&&(p=A(Se,C));let U=X?A(Se,C):p;return U.width=Se,U.height=C,U.getContext("2d").drawImage(E,0,0,Se,C),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+E.width+"x"+E.height+") to ("+Se+"x"+C+")."),U}else return"data"in E&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+E.width+"x"+E.height+")."),E;return E}function w(E){return Vh(E.width)&&Vh(E.height)}function M(E){return o?!1:E.wrapS!==Yt||E.wrapT!==Yt||E.minFilter!==vt&&E.minFilter!==kt}function P(E,_){return E.generateMipmaps&&_&&E.minFilter!==vt&&E.minFilter!==kt}function F(E){i.generateMipmap(E)}function g(E,_,X,ie,oe=!1){if(o===!1)return _;if(E!==null){if(i[E]!==void 0)return i[E];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+E+"'")}let fe=_;return _===6403&&(X===5126&&(fe=33326),X===5131&&(fe=33325),X===5121&&(fe=33321)),_===33319&&(X===5126&&(fe=33328),X===5131&&(fe=33327),X===5121&&(fe=33323)),_===6408&&(X===5126&&(fe=34836),X===5131&&(fe=34842),X===5121&&(fe=ie===Ye&&oe===!1?35907:32856),X===32819&&(fe=32854),X===32820&&(fe=32855)),(fe===33325||fe===33326||fe===33327||fe===33328||fe===34842||fe===34836)&&e.get("EXT_color_buffer_float"),fe}function S(E,_,X){return P(E,X)===!0||E.isFramebufferTexture&&E.minFilter!==vt&&E.minFilter!==kt?Math.log2(Math.max(_.width,_.height))+1:E.mipmaps!==void 0&&E.mipmaps.length>0?E.mipmaps.length:E.isCompressedTexture&&Array.isArray(E.image)?_.mipmaps.length:1}function D(E){return E===vt||E===fh||E===Ho?9728:9729}function L(E){let _=E.target;_.removeEventListener("dispose",L),O(_),_.isVideoTexture&&x.delete(_)}function G(E){let _=E.target;_.removeEventListener("dispose",G),T(_)}function O(E){let _=n.get(E);if(_.__webglInit===void 0)return;let X=E.source,ie=d.get(X);if(ie){let oe=ie[_.__cacheKey];oe.usedTimes--,oe.usedTimes===0&&z(E),Object.keys(ie).length===0&&d.delete(X)}n.remove(E)}function z(E){let _=n.get(E);i.deleteTexture(_.__webglTexture);let X=E.source,ie=d.get(X);delete ie[_.__cacheKey],a.memory.textures--}function T(E){let _=E.texture,X=n.get(E),ie=n.get(_);if(ie.__webglTexture!==void 0&&(i.deleteTexture(ie.__webglTexture),a.memory.textures--),E.depthTexture&&E.depthTexture.dispose(),E.isWebGLCubeRenderTarget)for(let oe=0;oe<6;oe++)i.deleteFramebuffer(X.__webglFramebuffer[oe]),X.__webglDepthbuffer&&i.deleteRenderbuffer(X.__webglDepthbuffer[oe]);else{if(i.deleteFramebuffer(X.__webglFramebuffer),X.__webglDepthbuffer&&i.deleteRenderbuffer(X.__webglDepthbuffer),X.__webglMultisampledFramebuffer&&i.deleteFramebuffer(X.__webglMultisampledFramebuffer),X.__webglColorRenderbuffer)for(let oe=0;oe<X.__webglColorRenderbuffer.length;oe++)X.__webglColorRenderbuffer[oe]&&i.deleteRenderbuffer(X.__webglColorRenderbuffer[oe]);X.__webglDepthRenderbuffer&&i.deleteRenderbuffer(X.__webglDepthRenderbuffer)}if(E.isWebGLMultipleRenderTargets)for(let oe=0,fe=_.length;oe<fe;oe++){let Se=n.get(_[oe]);Se.__webglTexture&&(i.deleteTexture(Se.__webglTexture),a.memory.textures--),n.remove(_[oe])}n.remove(_),n.remove(E)}let R=0;function j(){R=0}function V(){let E=R;return E>=l&&console.warn("THREE.WebGLTextures: Trying to use "+E+" texture units while this GPU supports only "+l),R+=1,E}function Q(E){let _=[];return _.push(E.wrapS),_.push(E.wrapT),_.push(E.wrapR||0),_.push(E.magFilter),_.push(E.minFilter),_.push(E.anisotropy),_.push(E.internalFormat),_.push(E.format),_.push(E.type),_.push(E.generateMipmaps),_.push(E.premultiplyAlpha),_.push(E.flipY),_.push(E.unpackAlignment),_.push(E.encoding),_.join()}function Z(E,_){let X=n.get(E);if(E.isVideoTexture&&Ot(E),E.isRenderTargetTexture===!1&&E.version>0&&X.__version!==E.version){let ie=E.image;if(ie===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(ie.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{xe(X,E,_);return}}t.bindTexture(3553,X.__webglTexture,33984+_)}function ue(E,_){let X=n.get(E);if(E.version>0&&X.__version!==E.version){xe(X,E,_);return}t.bindTexture(35866,X.__webglTexture,33984+_)}function B(E,_){let X=n.get(E);if(E.version>0&&X.__version!==E.version){xe(X,E,_);return}t.bindTexture(32879,X.__webglTexture,33984+_)}function ee(E,_){let X=n.get(E);if(E.version>0&&X.__version!==E.version){q(X,E,_);return}t.bindTexture(34067,X.__webglTexture,33984+_)}let re={[Sa]:10497,[Yt]:33071,[Ea]:33648},se={[vt]:9728,[fh]:9984,[Ho]:9986,[kt]:9729,[r0]:9985,[ps]:9987};function N(E,_,X){if(X?(i.texParameteri(E,10242,re[_.wrapS]),i.texParameteri(E,10243,re[_.wrapT]),(E===32879||E===35866)&&i.texParameteri(E,32882,re[_.wrapR]),i.texParameteri(E,10240,se[_.magFilter]),i.texParameteri(E,10241,se[_.minFilter])):(i.texParameteri(E,10242,33071),i.texParameteri(E,10243,33071),(E===32879||E===35866)&&i.texParameteri(E,32882,33071),(_.wrapS!==Yt||_.wrapT!==Yt)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),i.texParameteri(E,10240,D(_.magFilter)),i.texParameteri(E,10241,D(_.minFilter)),_.minFilter!==vt&&_.minFilter!==kt&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),e.has("EXT_texture_filter_anisotropic")===!0){let ie=e.get("EXT_texture_filter_anisotropic");if(_.magFilter===vt||_.minFilter!==Ho&&_.minFilter!==ps||_.type===Zn&&e.has("OES_texture_float_linear")===!1||o===!1&&_.type===ms&&e.has("OES_texture_half_float_linear")===!1)return;(_.anisotropy>1||n.get(_).__currentAnisotropy)&&(i.texParameterf(E,ie.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(_.anisotropy,s.getMaxAnisotropy())),n.get(_).__currentAnisotropy=_.anisotropy)}}function we(E,_){let X=!1;E.__webglInit===void 0&&(E.__webglInit=!0,_.addEventListener("dispose",L));let ie=_.source,oe=d.get(ie);oe===void 0&&(oe={},d.set(ie,oe));let fe=Q(_);if(fe!==E.__cacheKey){oe[fe]===void 0&&(oe[fe]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,X=!0),oe[fe].usedTimes++;let Se=oe[E.__cacheKey];Se!==void 0&&(oe[E.__cacheKey].usedTimes--,Se.usedTimes===0&&z(_)),E.__cacheKey=fe,E.__webglTexture=oe[fe].texture}return X}function xe(E,_,X){let ie=3553;(_.isDataArrayTexture||_.isCompressedArrayTexture)&&(ie=35866),_.isData3DTexture&&(ie=32879);let oe=we(E,_),fe=_.source;t.bindTexture(ie,E.__webglTexture,33984+X);let Se=n.get(fe);if(fe.version!==Se.__version||oe===!0){t.activeTexture(33984+X),i.pixelStorei(37440,_.flipY),i.pixelStorei(37441,_.premultiplyAlpha),i.pixelStorei(3317,_.unpackAlignment),i.pixelStorei(37443,0);let C=M(_)&&w(_.image)===!1,U=y(_.image,C,!1,h);U=bt(_,U);let pe=w(U)||o,ge=r.convert(_.format,_.encoding),de=r.convert(_.type),ye=g(_.internalFormat,ge,de,_.encoding,_.isVideoTexture);N(ie,_,pe);let ve,Pe=_.mipmaps,De=o&&_.isVideoTexture!==!0,We=Se.__version===void 0||oe===!0,I=S(_,U,pe);if(_.isDepthTexture)ye=6402,o?_.type===Zn?ye=36012:_.type===Kn?ye=33190:_.type===Li?ye=35056:ye=33189:_.type===Zn&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),_.format===Jn&&ye===6402&&_.type!==Cu&&_.type!==Kn&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),_.type=Kn,de=r.convert(_.type)),_.format===Ni&&ye===6402&&(ye=34041,_.type!==Li&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),_.type=Li,de=r.convert(_.type))),We&&(De?t.texStorage2D(3553,1,ye,U.width,U.height):t.texImage2D(3553,0,ye,U.width,U.height,0,ge,de,null));else if(_.isDataTexture)if(Pe.length>0&&pe){De&&We&&t.texStorage2D(3553,I,ye,Pe[0].width,Pe[0].height);for(let Y=0,ne=Pe.length;Y<ne;Y++)ve=Pe[Y],De?t.texSubImage2D(3553,Y,0,0,ve.width,ve.height,ge,de,ve.data):t.texImage2D(3553,Y,ye,ve.width,ve.height,0,ge,de,ve.data);_.generateMipmaps=!1}else De?(We&&t.texStorage2D(3553,I,ye,U.width,U.height),t.texSubImage2D(3553,0,0,0,U.width,U.height,ge,de,U.data)):t.texImage2D(3553,0,ye,U.width,U.height,0,ge,de,U.data);else if(_.isCompressedTexture)if(_.isCompressedArrayTexture){De&&We&&t.texStorage3D(35866,I,ye,Pe[0].width,Pe[0].height,U.depth);for(let Y=0,ne=Pe.length;Y<ne;Y++)ve=Pe[Y],_.format!==$t?ge!==null?De?t.compressedTexSubImage3D(35866,Y,0,0,0,ve.width,ve.height,U.depth,ge,ve.data,0,0):t.compressedTexImage3D(35866,Y,ye,ve.width,ve.height,U.depth,0,ve.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):De?t.texSubImage3D(35866,Y,0,0,0,ve.width,ve.height,U.depth,ge,de,ve.data):t.texImage3D(35866,Y,ye,ve.width,ve.height,U.depth,0,ge,de,ve.data)}else{De&&We&&t.texStorage2D(3553,I,ye,Pe[0].width,Pe[0].height);for(let Y=0,ne=Pe.length;Y<ne;Y++)ve=Pe[Y],_.format!==$t?ge!==null?De?t.compressedTexSubImage2D(3553,Y,0,0,ve.width,ve.height,ge,ve.data):t.compressedTexImage2D(3553,Y,ye,ve.width,ve.height,0,ve.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):De?t.texSubImage2D(3553,Y,0,0,ve.width,ve.height,ge,de,ve.data):t.texImage2D(3553,Y,ye,ve.width,ve.height,0,ge,de,ve.data)}else if(_.isDataArrayTexture)De?(We&&t.texStorage3D(35866,I,ye,U.width,U.height,U.depth),t.texSubImage3D(35866,0,0,0,0,U.width,U.height,U.depth,ge,de,U.data)):t.texImage3D(35866,0,ye,U.width,U.height,U.depth,0,ge,de,U.data);else if(_.isData3DTexture)De?(We&&t.texStorage3D(32879,I,ye,U.width,U.height,U.depth),t.texSubImage3D(32879,0,0,0,0,U.width,U.height,U.depth,ge,de,U.data)):t.texImage3D(32879,0,ye,U.width,U.height,U.depth,0,ge,de,U.data);else if(_.isFramebufferTexture){if(We)if(De)t.texStorage2D(3553,I,ye,U.width,U.height);else{let Y=U.width,ne=U.height;for(let me=0;me<I;me++)t.texImage2D(3553,me,ye,Y,ne,0,ge,de,null),Y>>=1,ne>>=1}}else if(Pe.length>0&&pe){De&&We&&t.texStorage2D(3553,I,ye,Pe[0].width,Pe[0].height);for(let Y=0,ne=Pe.length;Y<ne;Y++)ve=Pe[Y],De?t.texSubImage2D(3553,Y,0,0,ge,de,ve):t.texImage2D(3553,Y,ye,ge,de,ve);_.generateMipmaps=!1}else De?(We&&t.texStorage2D(3553,I,ye,U.width,U.height),t.texSubImage2D(3553,0,0,0,ge,de,U)):t.texImage2D(3553,0,ye,ge,de,U);P(_,pe)&&F(ie),Se.__version=fe.version,_.onUpdate&&_.onUpdate(_)}E.__version=_.version}function q(E,_,X){if(_.image.length!==6)return;let ie=we(E,_),oe=_.source;t.bindTexture(34067,E.__webglTexture,33984+X);let fe=n.get(oe);if(oe.version!==fe.__version||ie===!0){t.activeTexture(33984+X),i.pixelStorei(37440,_.flipY),i.pixelStorei(37441,_.premultiplyAlpha),i.pixelStorei(3317,_.unpackAlignment),i.pixelStorei(37443,0);let Se=_.isCompressedTexture||_.image[0].isCompressedTexture,C=_.image[0]&&_.image[0].isDataTexture,U=[];for(let Y=0;Y<6;Y++)!Se&&!C?U[Y]=y(_.image[Y],!1,!0,c):U[Y]=C?_.image[Y].image:_.image[Y],U[Y]=bt(_,U[Y]);let pe=U[0],ge=w(pe)||o,de=r.convert(_.format,_.encoding),ye=r.convert(_.type),ve=g(_.internalFormat,de,ye,_.encoding),Pe=o&&_.isVideoTexture!==!0,De=fe.__version===void 0||ie===!0,We=S(_,pe,ge);N(34067,_,ge);let I;if(Se){Pe&&De&&t.texStorage2D(34067,We,ve,pe.width,pe.height);for(let Y=0;Y<6;Y++){I=U[Y].mipmaps;for(let ne=0;ne<I.length;ne++){let me=I[ne];_.format!==$t?de!==null?Pe?t.compressedTexSubImage2D(34069+Y,ne,0,0,me.width,me.height,de,me.data):t.compressedTexImage2D(34069+Y,ne,ve,me.width,me.height,0,me.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Pe?t.texSubImage2D(34069+Y,ne,0,0,me.width,me.height,de,ye,me.data):t.texImage2D(34069+Y,ne,ve,me.width,me.height,0,de,ye,me.data)}}}else{I=_.mipmaps,Pe&&De&&(I.length>0&&We++,t.texStorage2D(34067,We,ve,U[0].width,U[0].height));for(let Y=0;Y<6;Y++)if(C){Pe?t.texSubImage2D(34069+Y,0,0,0,U[Y].width,U[Y].height,de,ye,U[Y].data):t.texImage2D(34069+Y,0,ve,U[Y].width,U[Y].height,0,de,ye,U[Y].data);for(let ne=0;ne<I.length;ne++){let be=I[ne].image[Y].image;Pe?t.texSubImage2D(34069+Y,ne+1,0,0,be.width,be.height,de,ye,be.data):t.texImage2D(34069+Y,ne+1,ve,be.width,be.height,0,de,ye,be.data)}}else{Pe?t.texSubImage2D(34069+Y,0,0,0,de,ye,U[Y]):t.texImage2D(34069+Y,0,ve,de,ye,U[Y]);for(let ne=0;ne<I.length;ne++){let me=I[ne];Pe?t.texSubImage2D(34069+Y,ne+1,0,0,de,ye,me.image[Y]):t.texImage2D(34069+Y,ne+1,ve,de,ye,me.image[Y])}}}P(_,ge)&&F(34067),fe.__version=oe.version,_.onUpdate&&_.onUpdate(_)}E.__version=_.version}function te(E,_,X,ie,oe){let fe=r.convert(X.format,X.encoding),Se=r.convert(X.type),C=g(X.internalFormat,fe,Se,X.encoding);n.get(_).__hasExternalTextures||(oe===32879||oe===35866?t.texImage3D(oe,0,C,_.width,_.height,_.depth,0,fe,Se,null):t.texImage2D(oe,0,C,_.width,_.height,0,fe,Se,null)),t.bindFramebuffer(36160,E),ke(_)?f.framebufferTexture2DMultisampleEXT(36160,ie,oe,n.get(X).__webglTexture,0,Ze(_)):(oe===3553||oe>=34069&&oe<=34074)&&i.framebufferTexture2D(36160,ie,oe,n.get(X).__webglTexture,0),t.bindFramebuffer(36160,null)}function J(E,_,X){if(i.bindRenderbuffer(36161,E),_.depthBuffer&&!_.stencilBuffer){let ie=33189;if(X||ke(_)){let oe=_.depthTexture;oe&&oe.isDepthTexture&&(oe.type===Zn?ie=36012:oe.type===Kn&&(ie=33190));let fe=Ze(_);ke(_)?f.renderbufferStorageMultisampleEXT(36161,fe,ie,_.width,_.height):i.renderbufferStorageMultisample(36161,fe,ie,_.width,_.height)}else i.renderbufferStorage(36161,ie,_.width,_.height);i.framebufferRenderbuffer(36160,36096,36161,E)}else if(_.depthBuffer&&_.stencilBuffer){let ie=Ze(_);X&&ke(_)===!1?i.renderbufferStorageMultisample(36161,ie,35056,_.width,_.height):ke(_)?f.renderbufferStorageMultisampleEXT(36161,ie,35056,_.width,_.height):i.renderbufferStorage(36161,34041,_.width,_.height),i.framebufferRenderbuffer(36160,33306,36161,E)}else{let ie=_.isWebGLMultipleRenderTargets===!0?_.texture:[_.texture];for(let oe=0;oe<ie.length;oe++){let fe=ie[oe],Se=r.convert(fe.format,fe.encoding),C=r.convert(fe.type),U=g(fe.internalFormat,Se,C,fe.encoding),pe=Ze(_);X&&ke(_)===!1?i.renderbufferStorageMultisample(36161,pe,U,_.width,_.height):ke(_)?f.renderbufferStorageMultisampleEXT(36161,pe,U,_.width,_.height):i.renderbufferStorage(36161,U,_.width,_.height)}}i.bindRenderbuffer(36161,null)}function ae(E,_){if(_&&_.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(36160,E),!(_.depthTexture&&_.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(_.depthTexture).__webglTexture||_.depthTexture.image.width!==_.width||_.depthTexture.image.height!==_.height)&&(_.depthTexture.image.width=_.width,_.depthTexture.image.height=_.height,_.depthTexture.needsUpdate=!0),Z(_.depthTexture,0);let ie=n.get(_.depthTexture).__webglTexture,oe=Ze(_);if(_.depthTexture.format===Jn)ke(_)?f.framebufferTexture2DMultisampleEXT(36160,36096,3553,ie,0,oe):i.framebufferTexture2D(36160,36096,3553,ie,0);else if(_.depthTexture.format===Ni)ke(_)?f.framebufferTexture2DMultisampleEXT(36160,33306,3553,ie,0,oe):i.framebufferTexture2D(36160,33306,3553,ie,0);else throw new Error("Unknown depthTexture format")}function he(E){let _=n.get(E),X=E.isWebGLCubeRenderTarget===!0;if(E.depthTexture&&!_.__autoAllocateDepthBuffer){if(X)throw new Error("target.depthTexture not supported in Cube render targets");ae(_.__webglFramebuffer,E)}else if(X){_.__webglDepthbuffer=[];for(let ie=0;ie<6;ie++)t.bindFramebuffer(36160,_.__webglFramebuffer[ie]),_.__webglDepthbuffer[ie]=i.createRenderbuffer(),J(_.__webglDepthbuffer[ie],E,!1)}else t.bindFramebuffer(36160,_.__webglFramebuffer),_.__webglDepthbuffer=i.createRenderbuffer(),J(_.__webglDepthbuffer,E,!1);t.bindFramebuffer(36160,null)}function Ie(E,_,X){let ie=n.get(E);_!==void 0&&te(ie.__webglFramebuffer,E,E.texture,36064,3553),X!==void 0&&he(E)}function Le(E){let _=E.texture,X=n.get(E),ie=n.get(_);E.addEventListener("dispose",G),E.isWebGLMultipleRenderTargets!==!0&&(ie.__webglTexture===void 0&&(ie.__webglTexture=i.createTexture()),ie.__version=_.version,a.memory.textures++);let oe=E.isWebGLCubeRenderTarget===!0,fe=E.isWebGLMultipleRenderTargets===!0,Se=w(E)||o;if(oe){X.__webglFramebuffer=[];for(let C=0;C<6;C++)X.__webglFramebuffer[C]=i.createFramebuffer()}else{if(X.__webglFramebuffer=i.createFramebuffer(),fe)if(s.drawBuffers){let C=E.texture;for(let U=0,pe=C.length;U<pe;U++){let ge=n.get(C[U]);ge.__webglTexture===void 0&&(ge.__webglTexture=i.createTexture(),a.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(o&&E.samples>0&&ke(E)===!1){let C=fe?_:[_];X.__webglMultisampledFramebuffer=i.createFramebuffer(),X.__webglColorRenderbuffer=[],t.bindFramebuffer(36160,X.__webglMultisampledFramebuffer);for(let U=0;U<C.length;U++){let pe=C[U];X.__webglColorRenderbuffer[U]=i.createRenderbuffer(),i.bindRenderbuffer(36161,X.__webglColorRenderbuffer[U]);let ge=r.convert(pe.format,pe.encoding),de=r.convert(pe.type),ye=g(pe.internalFormat,ge,de,pe.encoding,E.isXRRenderTarget===!0),ve=Ze(E);i.renderbufferStorageMultisample(36161,ve,ye,E.width,E.height),i.framebufferRenderbuffer(36160,36064+U,36161,X.__webglColorRenderbuffer[U])}i.bindRenderbuffer(36161,null),E.depthBuffer&&(X.__webglDepthRenderbuffer=i.createRenderbuffer(),J(X.__webglDepthRenderbuffer,E,!0)),t.bindFramebuffer(36160,null)}}if(oe){t.bindTexture(34067,ie.__webglTexture),N(34067,_,Se);for(let C=0;C<6;C++)te(X.__webglFramebuffer[C],E,_,36064,34069+C);P(_,Se)&&F(34067),t.unbindTexture()}else if(fe){let C=E.texture;for(let U=0,pe=C.length;U<pe;U++){let ge=C[U],de=n.get(ge);t.bindTexture(3553,de.__webglTexture),N(3553,ge,Se),te(X.__webglFramebuffer,E,ge,36064+U,3553),P(ge,Se)&&F(3553)}t.unbindTexture()}else{let C=3553;(E.isWebGL3DRenderTarget||E.isWebGLArrayRenderTarget)&&(o?C=E.isWebGL3DRenderTarget?32879:35866:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),t.bindTexture(C,ie.__webglTexture),N(C,_,Se),te(X.__webglFramebuffer,E,_,36064,C),P(_,Se)&&F(C),t.unbindTexture()}E.depthBuffer&&he(E)}function $e(E){let _=w(E)||o,X=E.isWebGLMultipleRenderTargets===!0?E.texture:[E.texture];for(let ie=0,oe=X.length;ie<oe;ie++){let fe=X[ie];if(P(fe,_)){let Se=E.isWebGLCubeRenderTarget?34067:3553,C=n.get(fe).__webglTexture;t.bindTexture(Se,C),F(Se),t.unbindTexture()}}}function Qe(E){if(o&&E.samples>0&&ke(E)===!1){let _=E.isWebGLMultipleRenderTargets?E.texture:[E.texture],X=E.width,ie=E.height,oe=16384,fe=[],Se=E.stencilBuffer?33306:36096,C=n.get(E),U=E.isWebGLMultipleRenderTargets===!0;if(U)for(let pe=0;pe<_.length;pe++)t.bindFramebuffer(36160,C.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(36160,36064+pe,36161,null),t.bindFramebuffer(36160,C.__webglFramebuffer),i.framebufferTexture2D(36009,36064+pe,3553,null,0);t.bindFramebuffer(36008,C.__webglMultisampledFramebuffer),t.bindFramebuffer(36009,C.__webglFramebuffer);for(let pe=0;pe<_.length;pe++){fe.push(36064+pe),E.depthBuffer&&fe.push(Se);let ge=C.__ignoreDepthValues!==void 0?C.__ignoreDepthValues:!1;if(ge===!1&&(E.depthBuffer&&(oe|=256),E.stencilBuffer&&(oe|=1024)),U&&i.framebufferRenderbuffer(36008,36064,36161,C.__webglColorRenderbuffer[pe]),ge===!0&&(i.invalidateFramebuffer(36008,[Se]),i.invalidateFramebuffer(36009,[Se])),U){let de=n.get(_[pe]).__webglTexture;i.framebufferTexture2D(36009,36064,3553,de,0)}i.blitFramebuffer(0,0,X,ie,0,0,X,ie,oe,9728),m&&i.invalidateFramebuffer(36008,fe)}if(t.bindFramebuffer(36008,null),t.bindFramebuffer(36009,null),U)for(let pe=0;pe<_.length;pe++){t.bindFramebuffer(36160,C.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(36160,36064+pe,36161,C.__webglColorRenderbuffer[pe]);let ge=n.get(_[pe]).__webglTexture;t.bindFramebuffer(36160,C.__webglFramebuffer),i.framebufferTexture2D(36009,36064+pe,3553,ge,0)}t.bindFramebuffer(36009,C.__webglMultisampledFramebuffer)}}function Ze(E){return Math.min(u,E.samples)}function ke(E){let _=n.get(E);return o&&E.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&_.__useRenderToTexture!==!1}function Ot(E){let _=a.render.frame;x.get(E)!==_&&(x.set(E,_),E.update())}function bt(E,_){let X=E.encoding,ie=E.format,oe=E.type;return E.isCompressedTexture===!0||E.isVideoTexture===!0||E.format===Aa||X!==ei&&(X===Ye?o===!1?e.has("EXT_sRGB")===!0&&ie===$t?(E.format=Aa,E.minFilter=kt,E.generateMipmaps=!1):_=Sr.sRGBToLinear(_):(ie!==$t||oe!==Qn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture encoding:",X)),_}this.allocateTextureUnit=V,this.resetTextureUnits=j,this.setTexture2D=Z,this.setTexture2DArray=ue,this.setTexture3D=B,this.setTextureCube=ee,this.rebindTextures=Ie,this.setupRenderTarget=Le,this.updateRenderTargetMipmap=$e,this.updateMultisampleRenderTarget=Qe,this.setupDepthRenderbuffer=he,this.setupFrameBufferTexture=te,this.useMultisampledRTT=ke}function ob(i,e,t){let n=t.isWebGL2;function s(r,a=null){let o;if(r===Qn)return 5121;if(r===c0)return 32819;if(r===h0)return 32820;if(r===o0)return 5120;if(r===a0)return 5122;if(r===Cu)return 5123;if(r===l0)return 5124;if(r===Kn)return 5125;if(r===Zn)return 5126;if(r===ms)return n?5131:(o=e.get("OES_texture_half_float"),o!==null?o.HALF_FLOAT_OES:null);if(r===u0)return 6406;if(r===$t)return 6408;if(r===f0)return 6409;if(r===d0)return 6410;if(r===Jn)return 6402;if(r===Ni)return 34041;if(r===Aa)return o=e.get("EXT_sRGB"),o!==null?o.SRGB_ALPHA_EXT:null;if(r===p0)return 6403;if(r===m0)return 36244;if(r===g0)return 33319;if(r===x0)return 33320;if(r===_0)return 36249;if(r===Vo||r===Wo||r===Go||r===qo)if(a===Ye)if(o=e.get("WEBGL_compressed_texture_s3tc_srgb"),o!==null){if(r===Vo)return o.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(r===Wo)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(r===Go)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(r===qo)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(o=e.get("WEBGL_compressed_texture_s3tc"),o!==null){if(r===Vo)return o.COMPRESSED_RGB_S3TC_DXT1_EXT;if(r===Wo)return o.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(r===Go)return o.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(r===qo)return o.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(r===dh||r===ph||r===mh||r===gh)if(o=e.get("WEBGL_compressed_texture_pvrtc"),o!==null){if(r===dh)return o.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(r===ph)return o.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(r===mh)return o.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(r===gh)return o.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(r===v0)return o=e.get("WEBGL_compressed_texture_etc1"),o!==null?o.COMPRESSED_RGB_ETC1_WEBGL:null;if(r===xh||r===_h)if(o=e.get("WEBGL_compressed_texture_etc"),o!==null){if(r===xh)return a===Ye?o.COMPRESSED_SRGB8_ETC2:o.COMPRESSED_RGB8_ETC2;if(r===_h)return a===Ye?o.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:o.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(r===vh||r===yh||r===bh||r===wh||r===Mh||r===Sh||r===Eh||r===Ah||r===Th||r===Ch||r===Rh||r===Lh||r===Ph||r===Ih)if(o=e.get("WEBGL_compressed_texture_astc"),o!==null){if(r===vh)return a===Ye?o.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:o.COMPRESSED_RGBA_ASTC_4x4_KHR;if(r===yh)return a===Ye?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:o.COMPRESSED_RGBA_ASTC_5x4_KHR;if(r===bh)return a===Ye?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:o.COMPRESSED_RGBA_ASTC_5x5_KHR;if(r===wh)return a===Ye?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:o.COMPRESSED_RGBA_ASTC_6x5_KHR;if(r===Mh)return a===Ye?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:o.COMPRESSED_RGBA_ASTC_6x6_KHR;if(r===Sh)return a===Ye?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:o.COMPRESSED_RGBA_ASTC_8x5_KHR;if(r===Eh)return a===Ye?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:o.COMPRESSED_RGBA_ASTC_8x6_KHR;if(r===Ah)return a===Ye?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:o.COMPRESSED_RGBA_ASTC_8x8_KHR;if(r===Th)return a===Ye?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:o.COMPRESSED_RGBA_ASTC_10x5_KHR;if(r===Ch)return a===Ye?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:o.COMPRESSED_RGBA_ASTC_10x6_KHR;if(r===Rh)return a===Ye?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:o.COMPRESSED_RGBA_ASTC_10x8_KHR;if(r===Lh)return a===Ye?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:o.COMPRESSED_RGBA_ASTC_10x10_KHR;if(r===Ph)return a===Ye?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:o.COMPRESSED_RGBA_ASTC_12x10_KHR;if(r===Ih)return a===Ye?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:o.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(r===Xo)if(o=e.get("EXT_texture_compression_bptc"),o!==null){if(r===Xo)return a===Ye?o.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:o.COMPRESSED_RGBA_BPTC_UNORM_EXT}else return null;if(r===y0||r===Dh||r===Nh||r===Oh)if(o=e.get("EXT_texture_compression_rgtc"),o!==null){if(r===Xo)return o.COMPRESSED_RED_RGTC1_EXT;if(r===Dh)return o.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(r===Nh)return o.COMPRESSED_RED_GREEN_RGTC2_EXT;if(r===Oh)return o.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return r===Li?n?34042:(o=e.get("WEBGL_depth_texture"),o!==null?o.UNSIGNED_INT_24_8_WEBGL:null):i[r]!==void 0?i[r]:null}return{convert:s}}var Ba=class extends ft{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}},rn=class extends ut{constructor(){super(),this.isGroup=!0,this.type="Group"}},ab={type:"move"},ds=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new rn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new rn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new W,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new W),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new rn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new W,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new W),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,a=null,o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(let p of e.hand.values()){let d=t.getJointPose(p,n),v=this._getHandJoint(c,p);d!==null&&(v.matrix.fromArray(d.transform.matrix),v.matrix.decompose(v.position,v.rotation,v.scale),v.jointRadius=d.radius),v.visible=d!==null}let h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],f=h.position.distanceTo(u.position),m=.02,x=.005;c.inputState.pinching&&f>m+x?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&f<=m-x&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(ab)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new rn;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},Ha=class extends ht{constructor(e,t,n,s,r,a,o,l,c,h){if(h=h!==void 0?h:Jn,h!==Jn&&h!==Ni)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===Jn&&(n=Kn),n===void 0&&h===Ni&&(n=Li),super(null,s,r,a,o,l,h,n,c),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=o!==void 0?o:vt,this.minFilter=l!==void 0?l:vt,this.flipY=!1,this.generateMipmaps=!1}},Va=class extends on{constructor(e,t){super();let n=this,s=null,r=1,a=null,o="local-floor",l=1,c=null,h=null,u=null,f=null,m=null,x=null,p=t.getContextAttributes(),d=null,v=null,A=[],y=[],w=new Set,M=new Map,P=new ft;P.layers.enable(1),P.viewport=new it;let F=new ft;F.layers.enable(2),F.viewport=new it;let g=[P,F],S=new Ba;S.layers.enable(1),S.layers.enable(2);let D=null,L=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(B){let ee=A[B];return ee===void 0&&(ee=new ds,A[B]=ee),ee.getTargetRaySpace()},this.getControllerGrip=function(B){let ee=A[B];return ee===void 0&&(ee=new ds,A[B]=ee),ee.getGripSpace()},this.getHand=function(B){let ee=A[B];return ee===void 0&&(ee=new ds,A[B]=ee),ee.getHandSpace()};function G(B){let ee=y.indexOf(B.inputSource);if(ee===-1)return;let re=A[ee];re!==void 0&&re.dispatchEvent({type:B.type,data:B.inputSource})}function O(){s.removeEventListener("select",G),s.removeEventListener("selectstart",G),s.removeEventListener("selectend",G),s.removeEventListener("squeeze",G),s.removeEventListener("squeezestart",G),s.removeEventListener("squeezeend",G),s.removeEventListener("end",O),s.removeEventListener("inputsourceschange",z);for(let B=0;B<A.length;B++){let ee=y[B];ee!==null&&(y[B]=null,A[B].disconnect(ee))}D=null,L=null,e.setRenderTarget(d),m=null,f=null,u=null,s=null,v=null,ue.stop(),n.isPresenting=!1,n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(B){r=B,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(B){o=B,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(B){c=B},this.getBaseLayer=function(){return f!==null?f:m},this.getBinding=function(){return u},this.getFrame=function(){return x},this.getSession=function(){return s},this.setSession=async function(B){if(s=B,s!==null){if(d=e.getRenderTarget(),s.addEventListener("select",G),s.addEventListener("selectstart",G),s.addEventListener("selectend",G),s.addEventListener("squeeze",G),s.addEventListener("squeezestart",G),s.addEventListener("squeezeend",G),s.addEventListener("end",O),s.addEventListener("inputsourceschange",z),p.xrCompatible!==!0&&await t.makeXRCompatible(),s.renderState.layers===void 0||e.capabilities.isWebGL2===!1){let ee={antialias:s.renderState.layers===void 0?p.antialias:!0,alpha:p.alpha,depth:p.depth,stencil:p.stencil,framebufferScaleFactor:r};m=new XRWebGLLayer(s,t,ee),s.updateRenderState({baseLayer:m}),v=new bn(m.framebufferWidth,m.framebufferHeight,{format:$t,type:Qn,encoding:e.outputEncoding,stencilBuffer:p.stencil})}else{let ee=null,re=null,se=null;p.depth&&(se=p.stencil?35056:33190,ee=p.stencil?Ni:Jn,re=p.stencil?Li:Kn);let N={colorFormat:32856,depthFormat:se,scaleFactor:r};u=new XRWebGLBinding(s,t),f=u.createProjectionLayer(N),s.updateRenderState({layers:[f]}),v=new bn(f.textureWidth,f.textureHeight,{format:$t,type:Qn,depthTexture:new Ha(f.textureWidth,f.textureHeight,re,void 0,void 0,void 0,void 0,void 0,void 0,ee),stencilBuffer:p.stencil,encoding:e.outputEncoding,samples:p.antialias?4:0});let we=e.properties.get(v);we.__ignoreDepthValues=f.ignoreDepthValues}v.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await s.requestReferenceSpace(o),ue.setContext(s),ue.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}};function z(B){for(let ee=0;ee<B.removed.length;ee++){let re=B.removed[ee],se=y.indexOf(re);se>=0&&(y[se]=null,A[se].disconnect(re))}for(let ee=0;ee<B.added.length;ee++){let re=B.added[ee],se=y.indexOf(re);if(se===-1){for(let we=0;we<A.length;we++)if(we>=y.length){y.push(re),se=we;break}else if(y[we]===null){y[we]=re,se=we;break}if(se===-1)break}let N=A[se];N&&N.connect(re)}}let T=new W,R=new W;function j(B,ee,re){T.setFromMatrixPosition(ee.matrixWorld),R.setFromMatrixPosition(re.matrixWorld);let se=T.distanceTo(R),N=ee.projectionMatrix.elements,we=re.projectionMatrix.elements,xe=N[14]/(N[10]-1),q=N[14]/(N[10]+1),te=(N[9]+1)/N[5],J=(N[9]-1)/N[5],ae=(N[8]-1)/N[0],he=(we[8]+1)/we[0],Ie=xe*ae,Le=xe*he,$e=se/(-ae+he),Qe=$e*-ae;ee.matrixWorld.decompose(B.position,B.quaternion,B.scale),B.translateX(Qe),B.translateZ($e),B.matrixWorld.compose(B.position,B.quaternion,B.scale),B.matrixWorldInverse.copy(B.matrixWorld).invert();let Ze=xe+$e,ke=q+$e,Ot=Ie-Qe,bt=Le+(se-Qe),E=te*q/ke*Ze,_=J*q/ke*Ze;B.projectionMatrix.makePerspective(Ot,bt,E,_,Ze,ke)}function V(B,ee){ee===null?B.matrixWorld.copy(B.matrix):B.matrixWorld.multiplyMatrices(ee.matrixWorld,B.matrix),B.matrixWorldInverse.copy(B.matrixWorld).invert()}this.updateCamera=function(B){if(s===null)return;S.near=F.near=P.near=B.near,S.far=F.far=P.far=B.far,(D!==S.near||L!==S.far)&&(s.updateRenderState({depthNear:S.near,depthFar:S.far}),D=S.near,L=S.far);let ee=B.parent,re=S.cameras;V(S,ee);for(let N=0;N<re.length;N++)V(re[N],ee);S.matrixWorld.decompose(S.position,S.quaternion,S.scale),B.matrix.copy(S.matrix),B.matrix.decompose(B.position,B.quaternion,B.scale);let se=B.children;for(let N=0,we=se.length;N<we;N++)se[N].updateMatrixWorld(!0);re.length===2?j(S,P,F):S.projectionMatrix.copy(P.projectionMatrix)},this.getCamera=function(){return S},this.getFoveation=function(){if(!(f===null&&m===null))return l},this.setFoveation=function(B){l=B,f!==null&&(f.fixedFoveation=B),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=B)},this.getPlanes=function(){return w};let Q=null;function Z(B,ee){if(h=ee.getViewerPose(c||a),x=ee,h!==null){let re=h.views;m!==null&&(e.setRenderTargetFramebuffer(v,m.framebuffer),e.setRenderTarget(v));let se=!1;re.length!==S.cameras.length&&(S.cameras.length=0,se=!0);for(let N=0;N<re.length;N++){let we=re[N],xe=null;if(m!==null)xe=m.getViewport(we);else{let te=u.getViewSubImage(f,we);xe=te.viewport,N===0&&(e.setRenderTargetTextures(v,te.colorTexture,f.ignoreDepthValues?void 0:te.depthStencilTexture),e.setRenderTarget(v))}let q=g[N];q===void 0&&(q=new ft,q.layers.enable(N),q.viewport=new it,g[N]=q),q.matrix.fromArray(we.transform.matrix),q.projectionMatrix.fromArray(we.projectionMatrix),q.viewport.set(xe.x,xe.y,xe.width,xe.height),N===0&&S.matrix.copy(q.matrix),se===!0&&S.cameras.push(q)}}for(let re=0;re<A.length;re++){let se=y[re],N=A[re];se!==null&&N!==void 0&&N.update(se,ee,c||a)}if(Q&&Q(B,ee),ee.detectedPlanes){n.dispatchEvent({type:"planesdetected",data:ee.detectedPlanes});let re=null;for(let se of w)ee.detectedPlanes.has(se)||(re===null&&(re=[]),re.push(se));if(re!==null)for(let se of re)w.delete(se),M.delete(se),n.dispatchEvent({type:"planeremoved",data:se});for(let se of ee.detectedPlanes)if(!w.has(se))w.add(se),M.set(se,ee.lastChangedTime),n.dispatchEvent({type:"planeadded",data:se});else{let N=M.get(se);se.lastChangedTime>N&&(M.set(se,se.lastChangedTime),n.dispatchEvent({type:"planechanged",data:se}))}}x=null}let ue=new Du;ue.setAnimationLoop(Z),this.setAnimationLoop=function(B){Q=B},this.dispose=function(){}}};function lb(i,e){function t(p,d){d.color.getRGB(p.fogColor.value,Iu(i)),d.isFog?(p.fogNear.value=d.near,p.fogFar.value=d.far):d.isFogExp2&&(p.fogDensity.value=d.density)}function n(p,d,v,A,y){d.isMeshBasicMaterial||d.isMeshLambertMaterial?s(p,d):d.isMeshToonMaterial?(s(p,d),h(p,d)):d.isMeshPhongMaterial?(s(p,d),c(p,d)):d.isMeshStandardMaterial?(s(p,d),u(p,d),d.isMeshPhysicalMaterial&&f(p,d,y)):d.isMeshMatcapMaterial?(s(p,d),m(p,d)):d.isMeshDepthMaterial?s(p,d):d.isMeshDistanceMaterial?(s(p,d),x(p,d)):d.isMeshNormalMaterial?s(p,d):d.isLineBasicMaterial?(r(p,d),d.isLineDashedMaterial&&a(p,d)):d.isPointsMaterial?o(p,d,v,A):d.isSpriteMaterial?l(p,d):d.isShadowMaterial?(p.color.value.copy(d.color),p.opacity.value=d.opacity):d.isShaderMaterial&&(d.uniformsNeedUpdate=!1)}function s(p,d){p.opacity.value=d.opacity,d.color&&p.diffuse.value.copy(d.color),d.emissive&&p.emissive.value.copy(d.emissive).multiplyScalar(d.emissiveIntensity),d.map&&(p.map.value=d.map),d.alphaMap&&(p.alphaMap.value=d.alphaMap),d.bumpMap&&(p.bumpMap.value=d.bumpMap,p.bumpScale.value=d.bumpScale,d.side===Dt&&(p.bumpScale.value*=-1)),d.displacementMap&&(p.displacementMap.value=d.displacementMap,p.displacementScale.value=d.displacementScale,p.displacementBias.value=d.displacementBias),d.emissiveMap&&(p.emissiveMap.value=d.emissiveMap),d.normalMap&&(p.normalMap.value=d.normalMap,p.normalScale.value.copy(d.normalScale),d.side===Dt&&p.normalScale.value.negate()),d.specularMap&&(p.specularMap.value=d.specularMap),d.alphaTest>0&&(p.alphaTest.value=d.alphaTest);let v=e.get(d).envMap;if(v&&(p.envMap.value=v,p.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,p.reflectivity.value=d.reflectivity,p.ior.value=d.ior,p.refractionRatio.value=d.refractionRatio),d.lightMap){p.lightMap.value=d.lightMap;let w=i.physicallyCorrectLights!==!0?Math.PI:1;p.lightMapIntensity.value=d.lightMapIntensity*w}d.aoMap&&(p.aoMap.value=d.aoMap,p.aoMapIntensity.value=d.aoMapIntensity);let A;d.map?A=d.map:d.specularMap?A=d.specularMap:d.displacementMap?A=d.displacementMap:d.normalMap?A=d.normalMap:d.bumpMap?A=d.bumpMap:d.roughnessMap?A=d.roughnessMap:d.metalnessMap?A=d.metalnessMap:d.alphaMap?A=d.alphaMap:d.emissiveMap?A=d.emissiveMap:d.clearcoatMap?A=d.clearcoatMap:d.clearcoatNormalMap?A=d.clearcoatNormalMap:d.clearcoatRoughnessMap?A=d.clearcoatRoughnessMap:d.iridescenceMap?A=d.iridescenceMap:d.iridescenceThicknessMap?A=d.iridescenceThicknessMap:d.specularIntensityMap?A=d.specularIntensityMap:d.specularColorMap?A=d.specularColorMap:d.transmissionMap?A=d.transmissionMap:d.thicknessMap?A=d.thicknessMap:d.sheenColorMap?A=d.sheenColorMap:d.sheenRoughnessMap&&(A=d.sheenRoughnessMap),A!==void 0&&(A.isWebGLRenderTarget&&(A=A.texture),A.matrixAutoUpdate===!0&&A.updateMatrix(),p.uvTransform.value.copy(A.matrix));let y;d.aoMap?y=d.aoMap:d.lightMap&&(y=d.lightMap),y!==void 0&&(y.isWebGLRenderTarget&&(y=y.texture),y.matrixAutoUpdate===!0&&y.updateMatrix(),p.uv2Transform.value.copy(y.matrix))}function r(p,d){p.diffuse.value.copy(d.color),p.opacity.value=d.opacity}function a(p,d){p.dashSize.value=d.dashSize,p.totalSize.value=d.dashSize+d.gapSize,p.scale.value=d.scale}function o(p,d,v,A){p.diffuse.value.copy(d.color),p.opacity.value=d.opacity,p.size.value=d.size*v,p.scale.value=A*.5,d.map&&(p.map.value=d.map),d.alphaMap&&(p.alphaMap.value=d.alphaMap),d.alphaTest>0&&(p.alphaTest.value=d.alphaTest);let y;d.map?y=d.map:d.alphaMap&&(y=d.alphaMap),y!==void 0&&(y.matrixAutoUpdate===!0&&y.updateMatrix(),p.uvTransform.value.copy(y.matrix))}function l(p,d){p.diffuse.value.copy(d.color),p.opacity.value=d.opacity,p.rotation.value=d.rotation,d.map&&(p.map.value=d.map),d.alphaMap&&(p.alphaMap.value=d.alphaMap),d.alphaTest>0&&(p.alphaTest.value=d.alphaTest);let v;d.map?v=d.map:d.alphaMap&&(v=d.alphaMap),v!==void 0&&(v.matrixAutoUpdate===!0&&v.updateMatrix(),p.uvTransform.value.copy(v.matrix))}function c(p,d){p.specular.value.copy(d.specular),p.shininess.value=Math.max(d.shininess,1e-4)}function h(p,d){d.gradientMap&&(p.gradientMap.value=d.gradientMap)}function u(p,d){p.roughness.value=d.roughness,p.metalness.value=d.metalness,d.roughnessMap&&(p.roughnessMap.value=d.roughnessMap),d.metalnessMap&&(p.metalnessMap.value=d.metalnessMap),e.get(d).envMap&&(p.envMapIntensity.value=d.envMapIntensity)}function f(p,d,v){p.ior.value=d.ior,d.sheen>0&&(p.sheenColor.value.copy(d.sheenColor).multiplyScalar(d.sheen),p.sheenRoughness.value=d.sheenRoughness,d.sheenColorMap&&(p.sheenColorMap.value=d.sheenColorMap),d.sheenRoughnessMap&&(p.sheenRoughnessMap.value=d.sheenRoughnessMap)),d.clearcoat>0&&(p.clearcoat.value=d.clearcoat,p.clearcoatRoughness.value=d.clearcoatRoughness,d.clearcoatMap&&(p.clearcoatMap.value=d.clearcoatMap),d.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=d.clearcoatRoughnessMap),d.clearcoatNormalMap&&(p.clearcoatNormalScale.value.copy(d.clearcoatNormalScale),p.clearcoatNormalMap.value=d.clearcoatNormalMap,d.side===Dt&&p.clearcoatNormalScale.value.negate())),d.iridescence>0&&(p.iridescence.value=d.iridescence,p.iridescenceIOR.value=d.iridescenceIOR,p.iridescenceThicknessMinimum.value=d.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=d.iridescenceThicknessRange[1],d.iridescenceMap&&(p.iridescenceMap.value=d.iridescenceMap),d.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=d.iridescenceThicknessMap)),d.transmission>0&&(p.transmission.value=d.transmission,p.transmissionSamplerMap.value=v.texture,p.transmissionSamplerSize.value.set(v.width,v.height),d.transmissionMap&&(p.transmissionMap.value=d.transmissionMap),p.thickness.value=d.thickness,d.thicknessMap&&(p.thicknessMap.value=d.thicknessMap),p.attenuationDistance.value=d.attenuationDistance,p.attenuationColor.value.copy(d.attenuationColor)),p.specularIntensity.value=d.specularIntensity,p.specularColor.value.copy(d.specularColor),d.specularIntensityMap&&(p.specularIntensityMap.value=d.specularIntensityMap),d.specularColorMap&&(p.specularColorMap.value=d.specularColorMap)}function m(p,d){d.matcap&&(p.matcap.value=d.matcap)}function x(p,d){p.referencePosition.value.copy(d.referencePosition),p.nearDistance.value=d.nearDistance,p.farDistance.value=d.farDistance}return{refreshFogUniforms:t,refreshMaterialUniforms:n}}function cb(i,e,t,n){let s={},r={},a=[],o=t.isWebGL2?i.getParameter(35375):0;function l(A,y){let w=y.program;n.uniformBlockBinding(A,w)}function c(A,y){let w=s[A.id];w===void 0&&(x(A),w=h(A),s[A.id]=w,A.addEventListener("dispose",d));let M=y.program;n.updateUBOMapping(A,M);let P=e.render.frame;r[A.id]!==P&&(f(A),r[A.id]=P)}function h(A){let y=u();A.__bindingPointIndex=y;let w=i.createBuffer(),M=A.__size,P=A.usage;return i.bindBuffer(35345,w),i.bufferData(35345,M,P),i.bindBuffer(35345,null),i.bindBufferBase(35345,y,w),w}function u(){for(let A=0;A<o;A++)if(a.indexOf(A)===-1)return a.push(A),A;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(A){let y=s[A.id],w=A.uniforms,M=A.__cache;i.bindBuffer(35345,y);for(let P=0,F=w.length;P<F;P++){let g=w[P];if(m(g,P,M)===!0){let S=g.__offset,D=Array.isArray(g.value)?g.value:[g.value],L=0;for(let G=0;G<D.length;G++){let O=D[G],z=p(O);typeof O=="number"?(g.__data[0]=O,i.bufferSubData(35345,S+L,g.__data)):O.isMatrix3?(g.__data[0]=O.elements[0],g.__data[1]=O.elements[1],g.__data[2]=O.elements[2],g.__data[3]=O.elements[0],g.__data[4]=O.elements[3],g.__data[5]=O.elements[4],g.__data[6]=O.elements[5],g.__data[7]=O.elements[0],g.__data[8]=O.elements[6],g.__data[9]=O.elements[7],g.__data[10]=O.elements[8],g.__data[11]=O.elements[0]):(O.toArray(g.__data,L),L+=z.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(35345,S,g.__data)}}i.bindBuffer(35345,null)}function m(A,y,w){let M=A.value;if(w[y]===void 0){if(typeof M=="number")w[y]=M;else{let P=Array.isArray(M)?M:[M],F=[];for(let g=0;g<P.length;g++)F.push(P[g].clone());w[y]=F}return!0}else if(typeof M=="number"){if(w[y]!==M)return w[y]=M,!0}else{let P=Array.isArray(w[y])?w[y]:[w[y]],F=Array.isArray(M)?M:[M];for(let g=0;g<P.length;g++){let S=P[g];if(S.equals(F[g])===!1)return S.copy(F[g]),!0}}return!1}function x(A){let y=A.uniforms,w=0,M=16,P=0;for(let F=0,g=y.length;F<g;F++){let S=y[F],D={boundary:0,storage:0},L=Array.isArray(S.value)?S.value:[S.value];for(let G=0,O=L.length;G<O;G++){let z=L[G],T=p(z);D.boundary+=T.boundary,D.storage+=T.storage}if(S.__data=new Float32Array(D.storage/Float32Array.BYTES_PER_ELEMENT),S.__offset=w,F>0){P=w%M;let G=M-P;P!==0&&G-D.boundary<0&&(w+=M-P,S.__offset=w)}w+=D.storage}return P=w%M,P>0&&(w+=M-P),A.__size=w,A.__cache={},this}function p(A){let y={boundary:0,storage:0};return typeof A=="number"?(y.boundary=4,y.storage=4):A.isVector2?(y.boundary=8,y.storage=8):A.isVector3||A.isColor?(y.boundary=16,y.storage=12):A.isVector4?(y.boundary=16,y.storage=16):A.isMatrix3?(y.boundary=48,y.storage=48):A.isMatrix4?(y.boundary=64,y.storage=64):A.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",A),y}function d(A){let y=A.target;y.removeEventListener("dispose",d);let w=a.indexOf(y.__bindingPointIndex);a.splice(w,1),i.deleteBuffer(s[y.id]),delete s[y.id],delete r[y.id]}function v(){for(let A in s)i.deleteBuffer(s[A]);a=[],s={},r={}}return{bind:l,update:c,dispose:v}}function hb(){let i=xs("canvas");return i.style.display="block",i}function Ss(i={}){this.isWebGLRenderer=!0;let e=i.canvas!==void 0?i.canvas:hb(),t=i.context!==void 0?i.context:null,n=i.depth!==void 0?i.depth:!0,s=i.stencil!==void 0?i.stencil:!0,r=i.antialias!==void 0?i.antialias:!1,a=i.premultipliedAlpha!==void 0?i.premultipliedAlpha:!0,o=i.preserveDrawingBuffer!==void 0?i.preserveDrawingBuffer:!1,l=i.powerPreference!==void 0?i.powerPreference:"default",c=i.failIfMajorPerformanceCaveat!==void 0?i.failIfMajorPerformanceCaveat:!1,h;t!==null?h=t.getContextAttributes().alpha:h=i.alpha!==void 0?i.alpha:!1;let u=null,f=null,m=[],x=[];this.domElement=e,this.debug={checkShaderErrors:!0},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.outputEncoding=ei,this.physicallyCorrectLights=!1,this.toneMapping=vn,this.toneMappingExposure=1;let p=this,d=!1,v=0,A=0,y=null,w=-1,M=null,P=new it,F=new it,g=null,S=e.width,D=e.height,L=1,G=null,O=null,z=new it(0,0,S,D),T=new it(0,0,S,D),R=!1,j=new vs,V=!1,Q=!1,Z=null,ue=new je,B=new Ae,ee=new W,re={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function se(){return y===null?L:1}let N=t;function we(b,H){for(let $=0;$<b.length;$++){let k=b[$],K=e.getContext(k,H);if(K!==null)return K}return null}try{let b={alpha:!0,depth:n,stencil:s,antialias:r,premultipliedAlpha:a,preserveDrawingBuffer:o,powerPreference:l,failIfMajorPerformanceCaveat:c};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${nl}`),e.addEventListener("webglcontextlost",ye,!1),e.addEventListener("webglcontextrestored",ve,!1),e.addEventListener("webglcontextcreationerror",Pe,!1),N===null){let H=["webgl2","webgl","experimental-webgl"];if(p.isWebGL1Renderer===!0&&H.shift(),N=we(H,b),N===null)throw we(H)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}N.getShaderPrecisionFormat===void 0&&(N.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(b){throw console.error("THREE.WebGLRenderer: "+b.message),b}let xe,q,te,J,ae,he,Ie,Le,$e,Qe,Ze,ke,Ot,bt,E,_,X,ie,oe,fe,Se,C,U,pe;function ge(){xe=new Pv(N),q=new Ev(N,xe,i),xe.init(q),C=new ob(N,xe,q),te=new sb(N,xe,q),J=new Nv,ae=new Xy,he=new rb(N,xe,te,ae,q,C,J),Ie=new Tv(p),Le=new Lv(p),$e=new W0(N,q),U=new Mv(N,xe,$e,q),Qe=new Iv(N,$e,J,U),Ze=new Uv(N,Qe,$e,J),oe=new zv(N,q,he),_=new Av(ae),ke=new qy(p,Ie,Le,xe,q,U,_),Ot=new lb(p,ae),bt=new $y,E=new eb(xe,q),ie=new wv(p,Ie,Le,te,Ze,h,a),X=new ib(p,Ze,q),pe=new cb(N,J,q,te),fe=new Sv(N,xe,J,q),Se=new Dv(N,xe,J,q),J.programs=ke.programs,p.capabilities=q,p.extensions=xe,p.properties=ae,p.renderLists=bt,p.shadowMap=X,p.state=te,p.info=J}ge();let de=new Va(p,N);this.xr=de,this.getContext=function(){return N},this.getContextAttributes=function(){return N.getContextAttributes()},this.forceContextLoss=function(){let b=xe.get("WEBGL_lose_context");b&&b.loseContext()},this.forceContextRestore=function(){let b=xe.get("WEBGL_lose_context");b&&b.restoreContext()},this.getPixelRatio=function(){return L},this.setPixelRatio=function(b){b!==void 0&&(L=b,this.setSize(S,D,!1))},this.getSize=function(b){return b.set(S,D)},this.setSize=function(b,H,$){if(de.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}S=b,D=H,e.width=Math.floor(b*L),e.height=Math.floor(H*L),$!==!1&&(e.style.width=b+"px",e.style.height=H+"px"),this.setViewport(0,0,b,H)},this.getDrawingBufferSize=function(b){return b.set(S*L,D*L).floor()},this.setDrawingBufferSize=function(b,H,$){S=b,D=H,L=$,e.width=Math.floor(b*$),e.height=Math.floor(H*$),this.setViewport(0,0,b,H)},this.getCurrentViewport=function(b){return b.copy(P)},this.getViewport=function(b){return b.copy(z)},this.setViewport=function(b,H,$,k){b.isVector4?z.set(b.x,b.y,b.z,b.w):z.set(b,H,$,k),te.viewport(P.copy(z).multiplyScalar(L).floor())},this.getScissor=function(b){return b.copy(T)},this.setScissor=function(b,H,$,k){b.isVector4?T.set(b.x,b.y,b.z,b.w):T.set(b,H,$,k),te.scissor(F.copy(T).multiplyScalar(L).floor())},this.getScissorTest=function(){return R},this.setScissorTest=function(b){te.setScissorTest(R=b)},this.setOpaqueSort=function(b){G=b},this.setTransparentSort=function(b){O=b},this.getClearColor=function(b){return b.copy(ie.getClearColor())},this.setClearColor=function(){ie.setClearColor.apply(ie,arguments)},this.getClearAlpha=function(){return ie.getClearAlpha()},this.setClearAlpha=function(){ie.setClearAlpha.apply(ie,arguments)},this.clear=function(b=!0,H=!0,$=!0){let k=0;b&&(k|=16384),H&&(k|=256),$&&(k|=1024),N.clear(k)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",ye,!1),e.removeEventListener("webglcontextrestored",ve,!1),e.removeEventListener("webglcontextcreationerror",Pe,!1),bt.dispose(),E.dispose(),ae.dispose(),Ie.dispose(),Le.dispose(),Ze.dispose(),U.dispose(),pe.dispose(),ke.dispose(),de.dispose(),de.removeEventListener("sessionstart",me),de.removeEventListener("sessionend",be),Z&&(Z.dispose(),Z=null),He.stop()};function ye(b){b.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),d=!0}function ve(){console.log("THREE.WebGLRenderer: Context Restored."),d=!1;let b=J.autoReset,H=X.enabled,$=X.autoUpdate,k=X.needsUpdate,K=X.type;ge(),J.autoReset=b,X.enabled=H,X.autoUpdate=$,X.needsUpdate=k,X.type=K}function Pe(b){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",b.statusMessage)}function De(b){let H=b.target;H.removeEventListener("dispose",De),We(H)}function We(b){I(b),ae.remove(b)}function I(b){let H=ae.get(b).programs;H!==void 0&&(H.forEach(function($){ke.releaseProgram($)}),b.isShaderMaterial&&ke.releaseShaderCache(b))}this.renderBufferDirect=function(b,H,$,k,K,Me){H===null&&(H=re);let Ee=K.isMesh&&K.matrixWorld.determinant()<0,Ce=wf(b,H,$,k,K);te.setMaterial(k,Ee);let Re=$.index,Ue=1;k.wireframe===!0&&(Re=Qe.getWireframeAttribute($),Ue=2);let Ne=$.drawRange,Oe=$.attributes.position,et=Ne.start*Ue,Tt=(Ne.start+Ne.count)*Ue;Me!==null&&(et=Math.max(et,Me.start*Ue),Tt=Math.min(Tt,(Me.start+Me.count)*Ue)),Re!==null?(et=Math.max(et,0),Tt=Math.min(Tt,Re.count)):Oe!=null&&(et=Math.max(et,0),Tt=Math.min(Tt,Oe.count));let cn=Tt-et;if(cn<0||cn===1/0)return;U.setup(K,k,Ce,$,Re);let Fn,tt=fe;if(Re!==null&&(Fn=$e.get(Re),tt=Se,tt.setIndex(Fn)),K.isMesh)k.wireframe===!0?(te.setLineWidth(k.wireframeLinewidth*se()),tt.setMode(1)):tt.setMode(4);else if(K.isLine){let Fe=k.linewidth;Fe===void 0&&(Fe=1),te.setLineWidth(Fe*se()),K.isLineSegments?tt.setMode(1):K.isLineLoop?tt.setMode(2):tt.setMode(3)}else K.isPoints?tt.setMode(0):K.isSprite&&tt.setMode(4);if(K.isInstancedMesh)tt.renderInstances(et,cn,K.count);else if($.isInstancedBufferGeometry){let Fe=$._maxInstanceCount!==void 0?$._maxInstanceCount:1/0,Kr=Math.min($.instanceCount,Fe);tt.renderInstances(et,cn,Kr)}else tt.render(et,cn)},this.compile=function(b,H){function $(k,K,Me){k.transparent===!0&&k.side===In&&k.forceSinglePass===!1?(k.side=Dt,k.needsUpdate=!0,Ft(k,K,Me),k.side=Nn,k.needsUpdate=!0,Ft(k,K,Me),k.side=In):Ft(k,K,Me)}f=E.get(b),f.init(),x.push(f),b.traverseVisible(function(k){k.isLight&&k.layers.test(H.layers)&&(f.pushLight(k),k.castShadow&&f.pushShadow(k))}),f.setupLights(p.physicallyCorrectLights),b.traverse(function(k){let K=k.material;if(K)if(Array.isArray(K))for(let Me=0;Me<K.length;Me++){let Ee=K[Me];$(Ee,b,k)}else $(K,b,k)}),x.pop(),f=null};let Y=null;function ne(b){Y&&Y(b)}function me(){He.stop()}function be(){He.start()}let He=new Du;He.setAnimationLoop(ne),typeof self<"u"&&He.setContext(self),this.setAnimationLoop=function(b){Y=b,de.setAnimationLoop(b),b===null?He.stop():He.start()},de.addEventListener("sessionstart",me),de.addEventListener("sessionend",be),this.render=function(b,H){if(H!==void 0&&H.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(d===!0)return;b.matrixWorldAutoUpdate===!0&&b.updateMatrixWorld(),H.parent===null&&H.matrixWorldAutoUpdate===!0&&H.updateMatrixWorld(),de.enabled===!0&&de.isPresenting===!0&&(de.cameraAutoUpdate===!0&&de.updateCamera(H),H=de.getCamera()),b.isScene===!0&&b.onBeforeRender(p,b,H,y),f=E.get(b,x.length),f.init(),x.push(f),ue.multiplyMatrices(H.projectionMatrix,H.matrixWorldInverse),j.setFromProjectionMatrix(ue),Q=this.localClippingEnabled,V=_.init(this.clippingPlanes,Q),u=bt.get(b,m.length),u.init(),m.push(u),at(b,H,0,p.sortObjects),u.finish(),p.sortObjects===!0&&u.sort(G,O),V===!0&&_.beginShadows();let $=f.state.shadowsArray;if(X.render($,b,H),V===!0&&_.endShadows(),this.info.autoReset===!0&&this.info.reset(),ie.render(u,b),f.setupLights(p.physicallyCorrectLights),H.isArrayCamera){let k=H.cameras;for(let K=0,Me=k.length;K<Me;K++){let Ee=k[K];dt(u,b,Ee,Ee.viewport)}}else dt(u,b,H);y!==null&&(he.updateMultisampleRenderTarget(y),he.updateRenderTargetMipmap(y)),b.isScene===!0&&b.onAfterRender(p,b,H),U.resetDefaultState(),w=-1,M=null,x.pop(),x.length>0?f=x[x.length-1]:f=null,m.pop(),m.length>0?u=m[m.length-1]:u=null};function at(b,H,$,k){if(b.visible===!1)return;if(b.layers.test(H.layers)){if(b.isGroup)$=b.renderOrder;else if(b.isLOD)b.autoUpdate===!0&&b.update(H);else if(b.isLight)f.pushLight(b),b.castShadow&&f.pushShadow(b);else if(b.isSprite){if(!b.frustumCulled||j.intersectsSprite(b)){k&&ee.setFromMatrixPosition(b.matrixWorld).applyMatrix4(ue);let Ee=Ze.update(b),Ce=b.material;Ce.visible&&u.push(b,Ee,Ce,$,ee.z,null)}}else if((b.isMesh||b.isLine||b.isPoints)&&(b.isSkinnedMesh&&b.skeleton.frame!==J.render.frame&&(b.skeleton.update(),b.skeleton.frame=J.render.frame),!b.frustumCulled||j.intersectsObject(b))){k&&ee.setFromMatrixPosition(b.matrixWorld).applyMatrix4(ue);let Ee=Ze.update(b),Ce=b.material;if(Array.isArray(Ce)){let Re=Ee.groups;for(let Ue=0,Ne=Re.length;Ue<Ne;Ue++){let Oe=Re[Ue],et=Ce[Oe.materialIndex];et&&et.visible&&u.push(b,Ee,et,$,ee.z,Oe)}}else Ce.visible&&u.push(b,Ee,Ce,$,ee.z,null)}}let Me=b.children;for(let Ee=0,Ce=Me.length;Ee<Ce;Ee++)at(Me[Ee],H,$,k)}function dt(b,H,$,k){let K=b.opaque,Me=b.transmissive,Ee=b.transparent;f.setupLightsView($),V===!0&&_.setGlobalState(p.clippingPlanes,$),Me.length>0&&On(K,H,$),k&&te.viewport(P.copy(k)),K.length>0&&Ke(K,H,$),Me.length>0&&Ke(Me,H,$),Ee.length>0&&Ke(Ee,H,$),te.buffers.depth.setTest(!0),te.buffers.depth.setMask(!0),te.buffers.color.setMask(!0),te.setPolygonOffset(!1)}function On(b,H,$){let k=q.isWebGL2;Z===null&&(Z=new bn(1,1,{generateMipmaps:!0,type:xe.has("EXT_color_buffer_half_float")?ms:Qn,minFilter:ps,samples:k&&r===!0?4:0})),p.getDrawingBufferSize(B),k?Z.setSize(B.x,B.y):Z.setSize(Ta(B.x),Ta(B.y));let K=p.getRenderTarget();p.setRenderTarget(Z),p.clear();let Me=p.toneMapping;p.toneMapping=vn,Ke(b,H,$),p.toneMapping=Me,he.updateMultisampleRenderTarget(Z),he.updateRenderTargetMipmap(Z),p.setRenderTarget(K)}function Ke(b,H,$){let k=H.isScene===!0?H.overrideMaterial:null;for(let K=0,Me=b.length;K<Me;K++){let Ee=b[K],Ce=Ee.object,Re=Ee.geometry,Ue=k===null?Ee.material:k,Ne=Ee.group;Ce.layers.test($.layers)&&ln(Ce,H,$,Re,Ue,Ne)}}function ln(b,H,$,k,K,Me){b.onBeforeRender(p,H,$,k,K,Me),b.modelViewMatrix.multiplyMatrices($.matrixWorldInverse,b.matrixWorld),b.normalMatrix.getNormalMatrix(b.modelViewMatrix),K.onBeforeRender(p,H,$,k,b,Me),K.transparent===!0&&K.side===In&&K.forceSinglePass===!1?(K.side=Dt,K.needsUpdate=!0,p.renderBufferDirect($,H,k,K,b,Me),K.side=Nn,K.needsUpdate=!0,p.renderBufferDirect($,H,k,K,b,Me),K.side=In):p.renderBufferDirect($,H,k,K,b,Me),b.onAfterRender(p,H,$,k,K,Me)}function Ft(b,H,$){H.isScene!==!0&&(H=re);let k=ae.get(b),K=f.state.lights,Me=f.state.shadowsArray,Ee=K.state.version,Ce=ke.getParameters(b,K.state,Me,H,$),Re=ke.getProgramCacheKey(Ce),Ue=k.programs;k.environment=b.isMeshStandardMaterial?H.environment:null,k.fog=H.fog,k.envMap=(b.isMeshStandardMaterial?Le:Ie).get(b.envMap||k.environment),Ue===void 0&&(b.addEventListener("dispose",De),Ue=new Map,k.programs=Ue);let Ne=Ue.get(Re);if(Ne!==void 0){if(k.currentProgram===Ne&&k.lightsStateVersion===Ee)return Sl(b,Ce),Ne}else Ce.uniforms=ke.getUniforms(b),b.onBuild($,Ce,p),b.onBeforeCompile(Ce,p),Ne=ke.acquireProgram(Ce,Re),Ue.set(Re,Ne),k.uniforms=Ce.uniforms;let Oe=k.uniforms;(!b.isShaderMaterial&&!b.isRawShaderMaterial||b.clipping===!0)&&(Oe.clippingPlanes=_.uniform),Sl(b,Ce),k.needsLights=Sf(b),k.lightsStateVersion=Ee,k.needsLights&&(Oe.ambientLightColor.value=K.state.ambient,Oe.lightProbe.value=K.state.probe,Oe.directionalLights.value=K.state.directional,Oe.directionalLightShadows.value=K.state.directionalShadow,Oe.spotLights.value=K.state.spot,Oe.spotLightShadows.value=K.state.spotShadow,Oe.rectAreaLights.value=K.state.rectArea,Oe.ltc_1.value=K.state.rectAreaLTC1,Oe.ltc_2.value=K.state.rectAreaLTC2,Oe.pointLights.value=K.state.point,Oe.pointLightShadows.value=K.state.pointShadow,Oe.hemisphereLights.value=K.state.hemi,Oe.directionalShadowMap.value=K.state.directionalShadowMap,Oe.directionalShadowMatrix.value=K.state.directionalShadowMatrix,Oe.spotShadowMap.value=K.state.spotShadowMap,Oe.spotLightMatrix.value=K.state.spotLightMatrix,Oe.spotLightMap.value=K.state.spotLightMap,Oe.pointShadowMap.value=K.state.pointShadowMap,Oe.pointShadowMatrix.value=K.state.pointShadowMatrix);let et=Ne.getUniforms(),Tt=Pi.seqWithValue(et.seq,Oe);return k.currentProgram=Ne,k.uniformsList=Tt,Ne}function Sl(b,H){let $=ae.get(b);$.outputEncoding=H.outputEncoding,$.instancing=H.instancing,$.skinning=H.skinning,$.morphTargets=H.morphTargets,$.morphNormals=H.morphNormals,$.morphColors=H.morphColors,$.morphTargetsCount=H.morphTargetsCount,$.numClippingPlanes=H.numClippingPlanes,$.numIntersection=H.numClipIntersection,$.vertexAlphas=H.vertexAlphas,$.vertexTangents=H.vertexTangents,$.toneMapping=H.toneMapping}function wf(b,H,$,k,K){H.isScene!==!0&&(H=re),he.resetTextureUnits();let Me=H.fog,Ee=k.isMeshStandardMaterial?H.environment:null,Ce=y===null?p.outputEncoding:y.isXRRenderTarget===!0?y.texture.encoding:ei,Re=(k.isMeshStandardMaterial?Le:Ie).get(k.envMap||Ee),Ue=k.vertexColors===!0&&!!$.attributes.color&&$.attributes.color.itemSize===4,Ne=!!k.normalMap&&!!$.attributes.tangent,Oe=!!$.morphAttributes.position,et=!!$.morphAttributes.normal,Tt=!!$.morphAttributes.color,cn=k.toneMapped?p.toneMapping:vn,Fn=$.morphAttributes.position||$.morphAttributes.normal||$.morphAttributes.color,tt=Fn!==void 0?Fn.length:0,Fe=ae.get(k),Kr=f.state.lights;if(V===!0&&(Q===!0||b!==M)){let Ct=b===M&&k.id===w;_.setState(k,b,Ct)}let lt=!1;k.version===Fe.__version?(Fe.needsLights&&Fe.lightsStateVersion!==Kr.state.version||Fe.outputEncoding!==Ce||K.isInstancedMesh&&Fe.instancing===!1||!K.isInstancedMesh&&Fe.instancing===!0||K.isSkinnedMesh&&Fe.skinning===!1||!K.isSkinnedMesh&&Fe.skinning===!0||Fe.envMap!==Re||k.fog===!0&&Fe.fog!==Me||Fe.numClippingPlanes!==void 0&&(Fe.numClippingPlanes!==_.numPlanes||Fe.numIntersection!==_.numIntersection)||Fe.vertexAlphas!==Ue||Fe.vertexTangents!==Ne||Fe.morphTargets!==Oe||Fe.morphNormals!==et||Fe.morphColors!==Tt||Fe.toneMapping!==cn||q.isWebGL2===!0&&Fe.morphTargetsCount!==tt)&&(lt=!0):(lt=!0,Fe.__version=k.version);let zn=Fe.currentProgram;lt===!0&&(zn=Ft(k,H,K));let El=!1,qi=!1,Zr=!1,mt=zn.getUniforms(),Un=Fe.uniforms;if(te.useProgram(zn.program)&&(El=!0,qi=!0,Zr=!0),k.id!==w&&(w=k.id,qi=!0),El||M!==b){if(mt.setValue(N,"projectionMatrix",b.projectionMatrix),q.logarithmicDepthBuffer&&mt.setValue(N,"logDepthBufFC",2/(Math.log(b.far+1)/Math.LN2)),M!==b&&(M=b,qi=!0,Zr=!0),k.isShaderMaterial||k.isMeshPhongMaterial||k.isMeshToonMaterial||k.isMeshStandardMaterial||k.envMap){let Ct=mt.map.cameraPosition;Ct!==void 0&&Ct.setValue(N,ee.setFromMatrixPosition(b.matrixWorld))}(k.isMeshPhongMaterial||k.isMeshToonMaterial||k.isMeshLambertMaterial||k.isMeshBasicMaterial||k.isMeshStandardMaterial||k.isShaderMaterial)&&mt.setValue(N,"isOrthographic",b.isOrthographicCamera===!0),(k.isMeshPhongMaterial||k.isMeshToonMaterial||k.isMeshLambertMaterial||k.isMeshBasicMaterial||k.isMeshStandardMaterial||k.isShaderMaterial||k.isShadowMaterial||K.isSkinnedMesh)&&mt.setValue(N,"viewMatrix",b.matrixWorldInverse)}if(K.isSkinnedMesh){mt.setOptional(N,K,"bindMatrix"),mt.setOptional(N,K,"bindMatrixInverse");let Ct=K.skeleton;Ct&&(q.floatVertexTextures?(Ct.boneTexture===null&&Ct.computeBoneTexture(),mt.setValue(N,"boneTexture",Ct.boneTexture,he),mt.setValue(N,"boneTextureSize",Ct.boneTextureSize)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}let Jr=$.morphAttributes;if((Jr.position!==void 0||Jr.normal!==void 0||Jr.color!==void 0&&q.isWebGL2===!0)&&oe.update(K,$,k,zn),(qi||Fe.receiveShadow!==K.receiveShadow)&&(Fe.receiveShadow=K.receiveShadow,mt.setValue(N,"receiveShadow",K.receiveShadow)),k.isMeshGouraudMaterial&&k.envMap!==null&&(Un.envMap.value=Re,Un.flipEnvMap.value=Re.isCubeTexture&&Re.isRenderTargetTexture===!1?-1:1),qi&&(mt.setValue(N,"toneMappingExposure",p.toneMappingExposure),Fe.needsLights&&Mf(Un,Zr),Me&&k.fog===!0&&Ot.refreshFogUniforms(Un,Me),Ot.refreshMaterialUniforms(Un,k,L,D,Z),Pi.upload(N,Fe.uniformsList,Un,he)),k.isShaderMaterial&&k.uniformsNeedUpdate===!0&&(Pi.upload(N,Fe.uniformsList,Un,he),k.uniformsNeedUpdate=!1),k.isSpriteMaterial&&mt.setValue(N,"center",K.center),mt.setValue(N,"modelViewMatrix",K.modelViewMatrix),mt.setValue(N,"normalMatrix",K.normalMatrix),mt.setValue(N,"modelMatrix",K.matrixWorld),k.isShaderMaterial||k.isRawShaderMaterial){let Ct=k.uniformsGroups;for(let jr=0,Ef=Ct.length;jr<Ef;jr++)if(q.isWebGL2){let Al=Ct[jr];pe.update(Al,zn),pe.bind(Al,zn)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return zn}function Mf(b,H){b.ambientLightColor.needsUpdate=H,b.lightProbe.needsUpdate=H,b.directionalLights.needsUpdate=H,b.directionalLightShadows.needsUpdate=H,b.pointLights.needsUpdate=H,b.pointLightShadows.needsUpdate=H,b.spotLights.needsUpdate=H,b.spotLightShadows.needsUpdate=H,b.rectAreaLights.needsUpdate=H,b.hemisphereLights.needsUpdate=H}function Sf(b){return b.isMeshLambertMaterial||b.isMeshToonMaterial||b.isMeshPhongMaterial||b.isMeshStandardMaterial||b.isShadowMaterial||b.isShaderMaterial&&b.lights===!0}this.getActiveCubeFace=function(){return v},this.getActiveMipmapLevel=function(){return A},this.getRenderTarget=function(){return y},this.setRenderTargetTextures=function(b,H,$){ae.get(b.texture).__webglTexture=H,ae.get(b.depthTexture).__webglTexture=$;let k=ae.get(b);k.__hasExternalTextures=!0,k.__hasExternalTextures&&(k.__autoAllocateDepthBuffer=$===void 0,k.__autoAllocateDepthBuffer||xe.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),k.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(b,H){let $=ae.get(b);$.__webglFramebuffer=H,$.__useDefaultFramebuffer=H===void 0},this.setRenderTarget=function(b,H=0,$=0){y=b,v=H,A=$;let k=!0,K=null,Me=!1,Ee=!1;if(b){let Re=ae.get(b);Re.__useDefaultFramebuffer!==void 0?(te.bindFramebuffer(36160,null),k=!1):Re.__webglFramebuffer===void 0?he.setupRenderTarget(b):Re.__hasExternalTextures&&he.rebindTextures(b,ae.get(b.texture).__webglTexture,ae.get(b.depthTexture).__webglTexture);let Ue=b.texture;(Ue.isData3DTexture||Ue.isDataArrayTexture||Ue.isCompressedArrayTexture)&&(Ee=!0);let Ne=ae.get(b).__webglFramebuffer;b.isWebGLCubeRenderTarget?(K=Ne[H],Me=!0):q.isWebGL2&&b.samples>0&&he.useMultisampledRTT(b)===!1?K=ae.get(b).__webglMultisampledFramebuffer:K=Ne,P.copy(b.viewport),F.copy(b.scissor),g=b.scissorTest}else P.copy(z).multiplyScalar(L).floor(),F.copy(T).multiplyScalar(L).floor(),g=R;if(te.bindFramebuffer(36160,K)&&q.drawBuffers&&k&&te.drawBuffers(b,K),te.viewport(P),te.scissor(F),te.setScissorTest(g),Me){let Re=ae.get(b.texture);N.framebufferTexture2D(36160,36064,34069+H,Re.__webglTexture,$)}else if(Ee){let Re=ae.get(b.texture),Ue=H||0;N.framebufferTextureLayer(36160,36064,Re.__webglTexture,$||0,Ue)}w=-1},this.readRenderTargetPixels=function(b,H,$,k,K,Me,Ee){if(!(b&&b.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ce=ae.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&Ee!==void 0&&(Ce=Ce[Ee]),Ce){te.bindFramebuffer(36160,Ce);try{let Re=b.texture,Ue=Re.format,Ne=Re.type;if(Ue!==$t&&C.convert(Ue)!==N.getParameter(35739)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}let Oe=Ne===ms&&(xe.has("EXT_color_buffer_half_float")||q.isWebGL2&&xe.has("EXT_color_buffer_float"));if(Ne!==Qn&&C.convert(Ne)!==N.getParameter(35738)&&!(Ne===Zn&&(q.isWebGL2||xe.has("OES_texture_float")||xe.has("WEBGL_color_buffer_float")))&&!Oe){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}H>=0&&H<=b.width-k&&$>=0&&$<=b.height-K&&N.readPixels(H,$,k,K,C.convert(Ue),C.convert(Ne),Me)}finally{let Re=y!==null?ae.get(y).__webglFramebuffer:null;te.bindFramebuffer(36160,Re)}}},this.copyFramebufferToTexture=function(b,H,$=0){let k=Math.pow(2,-$),K=Math.floor(H.image.width*k),Me=Math.floor(H.image.height*k);he.setTexture2D(H,0),N.copyTexSubImage2D(3553,$,0,0,b.x,b.y,K,Me),te.unbindTexture()},this.copyTextureToTexture=function(b,H,$,k=0){let K=H.image.width,Me=H.image.height,Ee=C.convert($.format),Ce=C.convert($.type);he.setTexture2D($,0),N.pixelStorei(37440,$.flipY),N.pixelStorei(37441,$.premultiplyAlpha),N.pixelStorei(3317,$.unpackAlignment),H.isDataTexture?N.texSubImage2D(3553,k,b.x,b.y,K,Me,Ee,Ce,H.image.data):H.isCompressedTexture?N.compressedTexSubImage2D(3553,k,b.x,b.y,H.mipmaps[0].width,H.mipmaps[0].height,Ee,H.mipmaps[0].data):N.texSubImage2D(3553,k,b.x,b.y,Ee,Ce,H.image),k===0&&$.generateMipmaps&&N.generateMipmap(3553),te.unbindTexture()},this.copyTextureToTexture3D=function(b,H,$,k,K=0){if(p.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}let Me=b.max.x-b.min.x+1,Ee=b.max.y-b.min.y+1,Ce=b.max.z-b.min.z+1,Re=C.convert(k.format),Ue=C.convert(k.type),Ne;if(k.isData3DTexture)he.setTexture3D(k,0),Ne=32879;else if(k.isDataArrayTexture)he.setTexture2DArray(k,0),Ne=35866;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}N.pixelStorei(37440,k.flipY),N.pixelStorei(37441,k.premultiplyAlpha),N.pixelStorei(3317,k.unpackAlignment);let Oe=N.getParameter(3314),et=N.getParameter(32878),Tt=N.getParameter(3316),cn=N.getParameter(3315),Fn=N.getParameter(32877),tt=$.isCompressedTexture?$.mipmaps[0]:$.image;N.pixelStorei(3314,tt.width),N.pixelStorei(32878,tt.height),N.pixelStorei(3316,b.min.x),N.pixelStorei(3315,b.min.y),N.pixelStorei(32877,b.min.z),$.isDataTexture||$.isData3DTexture?N.texSubImage3D(Ne,K,H.x,H.y,H.z,Me,Ee,Ce,Re,Ue,tt.data):$.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),N.compressedTexSubImage3D(Ne,K,H.x,H.y,H.z,Me,Ee,Ce,Re,tt.data)):N.texSubImage3D(Ne,K,H.x,H.y,H.z,Me,Ee,Ce,Re,Ue,tt),N.pixelStorei(3314,Oe),N.pixelStorei(32878,et),N.pixelStorei(3316,Tt),N.pixelStorei(3315,cn),N.pixelStorei(32877,Fn),K===0&&k.generateMipmaps&&N.generateMipmap(Ne),te.unbindTexture()},this.initTexture=function(b){b.isCubeTexture?he.setTextureCube(b,0):b.isData3DTexture?he.setTexture3D(b,0):b.isDataArrayTexture||b.isCompressedArrayTexture?he.setTexture2DArray(b,0):he.setTexture2D(b,0),te.unbindTexture()},this.resetState=function(){v=0,A=0,y=null,te.reset(),U.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}var Wa=class extends Ss{};Wa.prototype.isWebGL1Renderer=!0;var zi=class extends ut{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t}get autoUpdate(){return console.warn("THREE.Scene: autoUpdate was renamed to matrixWorldAutoUpdate in r144."),this.matrixWorldAutoUpdate}set autoUpdate(e){console.warn("THREE.Scene: autoUpdate was renamed to matrixWorldAutoUpdate in r144."),this.matrixWorldAutoUpdate=e}};var Ui=class extends ni{constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new qe(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new qe(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Ru,this.normalScale=new Ae(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}};function Pn(i,e,t){return Uu(i)?new i.constructor(i.subarray(e,t!==void 0?t:i.length)):i.slice(e,t)}function yr(i,e,t){return!i||!t&&i.constructor===e?i:typeof e.BYTES_PER_ELEMENT=="number"?new e(i):Array.prototype.slice.call(i)}function Uu(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}var ki=class{constructor(e,t,n,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,s=t[n],r=t[n-1];n:{e:{let a;t:{i:if(!(e<s)){for(let o=n+2;;){if(s===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===o)break;if(r=s,s=t[++n],e<s)break e}a=t.length;break t}if(!(e>=r)){let o=t[1];e<o&&(n=2,r=o);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(s=r,r=t[--n-1],e>=r)break e}a=n,n=0;break t}break n}for(;n<a;){let o=n+a>>>1;e<t[o]?a=o:n=o+1}if(s=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=e*s;for(let a=0;a!==s;++a)t[a]=n[r+a];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},Ga=class extends ki{constructor(e,t,n,s){super(e,t,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Fh,endingEnd:Fh}}intervalChanged_(e,t,n){let s=this.parameterPositions,r=e-2,a=e+1,o=s[r],l=s[a];if(o===void 0)switch(this.getSettings_().endingStart){case zh:r=e,o=2*t-n;break;case Uh:r=s.length-2,o=t+s[r]-s[r+1];break;default:r=e,o=n}if(l===void 0)switch(this.getSettings_().endingEnd){case zh:a=e,l=2*n-t;break;case Uh:a=1,l=n+s[1]-s[0];break;default:a=e-1,l=t}let c=(n-t)*.5,h=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(l-n),this._offsetPrev=r*h,this._offsetNext=a*h}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=this._offsetPrev,u=this._offsetNext,f=this._weightPrev,m=this._weightNext,x=(n-t)/(s-t),p=x*x,d=p*x,v=-f*d+2*f*p-f*x,A=(1+f)*d+(-1.5-2*f)*p+(-.5+f)*x+1,y=(-1-m)*d+(1.5+m)*p+.5*x,w=m*d-m*p;for(let M=0;M!==o;++M)r[M]=v*a[h+M]+A*a[c+M]+y*a[l+M]+w*a[u+M];return r}},qa=class extends ki{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=(n-t)/(s-t),u=1-h;for(let f=0;f!==o;++f)r[f]=a[c+f]*u+a[l+f]*h;return r}},Xa=class extends ki{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e){return this.copySampleValue_(e-1)}},jt=class{constructor(e,t,n,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=yr(t,this.TimeBufferType),this.values=yr(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:yr(e.times,Array),values:yr(e.values,Array)};let s=e.getInterpolation();s!==e.DefaultInterpolation&&(n.interpolation=s)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new Xa(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new qa(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Ga(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case wr:t=this.InterpolantFactoryMethodDiscrete;break;case Mr:t=this.InterpolantFactoryMethodLinear;break;case Yo:t=this.InterpolantFactoryMethodSmooth;break}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return wr;case this.InterpolantFactoryMethodLinear:return Mr;case this.InterpolantFactoryMethodSmooth:return Yo}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]*=e}return this}trim(e,t){let n=this.times,s=n.length,r=0,a=s-1;for(;r!==s&&n[r]<e;)++r;for(;a!==-1&&n[a]>t;)--a;if(++a,r!==0||a!==s){r>=a&&(a=Math.max(a,1),r=a-1);let o=this.getValueSize();this.times=Pn(n,r,a),this.values=Pn(this.values,r*o,a*o)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);let n=this.times,s=this.values,r=n.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let a=null;for(let o=0;o!==r;o++){let l=n[o];if(typeof l=="number"&&isNaN(l)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,o,l),e=!1;break}if(a!==null&&a>l){console.error("THREE.KeyframeTrack: Out of order keys.",this,o,l,a),e=!1;break}a=l}if(s!==void 0&&Uu(s))for(let o=0,l=s.length;o!==l;++o){let c=s[o];if(isNaN(c)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,o,c),e=!1;break}}return e}optimize(){let e=Pn(this.times),t=Pn(this.values),n=this.getValueSize(),s=this.getInterpolation()===Yo,r=e.length-1,a=1;for(let o=1;o<r;++o){let l=!1,c=e[o],h=e[o+1];if(c!==h&&(o!==1||c!==e[0]))if(s)l=!0;else{let u=o*n,f=u-n,m=u+n;for(let x=0;x!==n;++x){let p=t[u+x];if(p!==t[f+x]||p!==t[m+x]){l=!0;break}}}if(l){if(o!==a){e[a]=e[o];let u=o*n,f=a*n;for(let m=0;m!==n;++m)t[f+m]=t[u+m]}++a}}if(r>0){e[a]=e[r];for(let o=r*n,l=a*n,c=0;c!==n;++c)t[l+c]=t[o+c];++a}return a!==e.length?(this.times=Pn(e,0,a),this.values=Pn(t,0,a*n)):(this.times=e,this.values=t),this}clone(){let e=Pn(this.times,0),t=Pn(this.values,0),n=this.constructor,s=new n(this.name,e,t);return s.createInterpolant=this.createInterpolant,s}};jt.prototype.TimeBufferType=Float32Array;jt.prototype.ValueBufferType=Float32Array;jt.prototype.DefaultInterpolation=Mr;var ii=class extends jt{};ii.prototype.ValueTypeName="bool";ii.prototype.ValueBufferType=Array;ii.prototype.DefaultInterpolation=wr;ii.prototype.InterpolantFactoryMethodLinear=void 0;ii.prototype.InterpolantFactoryMethodSmooth=void 0;var Ya=class extends jt{};Ya.prototype.ValueTypeName="color";var $a=class extends jt{};$a.prototype.ValueTypeName="number";var Ka=class extends ki{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=(n-t)/(s-t),c=e*o;for(let h=c+o;c!==h;c+=4)Zt.slerpFlat(r,0,a,c-o,a,c,l);return r}},bs=class extends jt{InterpolantFactoryMethodLinear(e){return new Ka(this.times,this.values,this.getValueSize(),e)}};bs.prototype.ValueTypeName="quaternion";bs.prototype.DefaultInterpolation=Mr;bs.prototype.InterpolantFactoryMethodSmooth=void 0;var si=class extends jt{};si.prototype.ValueTypeName="string";si.prototype.ValueBufferType=Array;si.prototype.DefaultInterpolation=wr;si.prototype.InterpolantFactoryMethodLinear=void 0;si.prototype.InterpolantFactoryMethodSmooth=void 0;var Za=class extends jt{};Za.prototype.ValueTypeName="vector";var yu={enabled:!1,files:{},add:function(i,e){this.enabled!==!1&&(this.files[i]=e)},get:function(i){if(this.enabled!==!1)return this.files[i]},remove:function(i){delete this.files[i]},clear:function(){this.files={}}},Ja=class{constructor(e,t,n){let s=this,r=!1,a=0,o=0,l,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this.itemStart=function(h){o++,r===!1&&s.onStart!==void 0&&s.onStart(h,a,o),r=!0},this.itemEnd=function(h){a++,s.onProgress!==void 0&&s.onProgress(h,a,o),a===o&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,u){return c.push(h,u),this},this.removeHandler=function(h){let u=c.indexOf(h);return u!==-1&&c.splice(u,2),this},this.getHandler=function(h){for(let u=0,f=c.length;u<f;u+=2){let m=c[u],x=c[u+1];if(m.global&&(m.lastIndex=0),m.test(h))return x}return null}}},ub=new Ja,Or=class{constructor(e){this.manager=e!==void 0?e:ub,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){let n=this;return new Promise(function(s,r){n.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}};var ja=class extends Or{constructor(e){super(e)}load(e,t,n,s){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let r=this,a=yu.get(e);if(a!==void 0)return r.manager.itemStart(e),setTimeout(function(){t&&t(a),r.manager.itemEnd(e)},0),a;let o=xs("img");function l(){h(),yu.add(e,this),t&&t(this),r.manager.itemEnd(e)}function c(u){h(),s&&s(u),r.manager.itemError(e),r.manager.itemEnd(e)}function h(){o.removeEventListener("load",l,!1),o.removeEventListener("error",c,!1)}return o.addEventListener("load",l,!1),o.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),r.manager.itemStart(e),o.src=e,o}};var Fr=class extends Or{constructor(e){super(e)}load(e,t,n,s){let r=new ht,a=new ja(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(o){r.image=o,r.needsUpdate=!0,t!==void 0&&t(r)},n,s),r}},zr=class extends ut{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new qe(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),t}};var ya=new je,bu=new W,wu=new W,Qa=class{constructor(e){this.camera=e,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Ae(512,512),this.map=null,this.mapPass=null,this.matrix=new je,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new vs,this._frameExtents=new Ae(1,1),this._viewportCount=1,this._viewports=[new it(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera,n=this.matrix;bu.setFromMatrixPosition(e.matrixWorld),t.position.copy(bu),wu.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(wu),t.updateMatrixWorld(),ya.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(ya),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(ya)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}};var el=class extends Qa{constructor(){super(new Dr(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Bi=class extends zr{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(ut.DEFAULT_UP),this.updateMatrix(),this.target=new ut,this.shadow=new el}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}},Ur=class extends zr{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}};var sl="\\[\\]\\.:\\/",fb=new RegExp("["+sl+"]","g"),rl="[^"+sl+"]",db="[^"+sl.replace("\\.","")+"]",pb=/((?:WC+[\/:])*)/.source.replace("WC",rl),mb=/(WCOD+)?/.source.replace("WCOD",db),gb=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",rl),xb=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",rl),_b=new RegExp("^"+pb+mb+gb+xb+"$"),vb=["material","materials","bones","map"],tl=class{constructor(e,t,n){let s=n||Ve.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},Ve=class{constructor(e,t,n){this.path=t,this.parsedPath=n||Ve.parseTrackName(t),this.node=Ve.findNode(e,this.parsedPath.nodeName)||e,this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new Ve.Composite(e,t,n):new Ve(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(fb,"")}static parseTrackName(e){let t=_b.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);vb.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(r){for(let a=0;a<r.length;a++){let o=r[a];if(o.name===t||o.uuid===t)return o;let l=n(o.children);if(l)return l}return null},s=n(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)e[t++]=n[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,n=t.objectName,s=t.propertyName,r=t.propertyIndex;if(e||(e=Ve.findNode(this.rootNode,t.nodeName)||this.rootNode,this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){console.error("THREE.PropertyBinding: Trying to update node for track: "+this.path+" but it wasn't found.");return}if(n){let c=t.objectIndex;switch(n){case"materials":if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===c){c=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(c!==void 0){if(e[c]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}let a=e[s];if(a===void 0){let c=t.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",e);return}let o=this.Versioning.None;this.targetObject=e,e.needsUpdate!==void 0?o=this.Versioning.NeedsUpdate:e.matrixWorldNeedsUpdate!==void 0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=r}else a.fromArray!==void 0&&a.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(l=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Ve.Composite=tl;Ve.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};Ve.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};Ve.prototype.GetterByBindingType=[Ve.prototype._getValue_direct,Ve.prototype._getValue_array,Ve.prototype._getValue_arrayElement,Ve.prototype._getValue_toArray];Ve.prototype.SetterByBindingTypeAndVersioning=[[Ve.prototype._setValue_direct,Ve.prototype._setValue_direct_setNeedsUpdate,Ve.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Ve.prototype._setValue_array,Ve.prototype._setValue_array_setNeedsUpdate,Ve.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Ve.prototype._setValue_arrayElement,Ve.prototype._setValue_arrayElement_setNeedsUpdate,Ve.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Ve.prototype._setValue_fromArray,Ve.prototype._setValue_fromArray_setNeedsUpdate,Ve.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var Fw=new Float32Array(1);var ws=class{constructor(e=1,t=0,n=0){return this.radius=e,this.phi=t,this.theta=n,this}set(e,t,n){return this.radius=e,this.phi=t,this.theta=n,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,n){return this.radius=Math.sqrt(e*e+t*t+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,n),this.phi=Math.acos(Et(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}};typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:nl}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=nl);var Bu={type:"change"},ol={type:"start"},Hu={type:"end"},Vi=class extends on{constructor(e,t){super(),this.object=e,this.domElement=t,this.domElement.style.touchAction="none",this.enabled=!0,this.target=new W,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:ri.ROTATE,MIDDLE:ri.DOLLY,RIGHT:ri.PAN},this.touches={ONE:oi.ROTATE,TWO:oi.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this.getPolarAngle=function(){return o.phi},this.getAzimuthalAngle=function(){return o.theta},this.getDistance=function(){return this.object.position.distanceTo(this.target)},this.listenToKeyEvents=function(C){C.addEventListener("keydown",bt),this._domElementKeyEvents=C},this.saveState=function(){n.target0.copy(n.target),n.position0.copy(n.object.position),n.zoom0=n.object.zoom},this.reset=function(){n.target.copy(n.target0),n.object.position.copy(n.position0),n.object.zoom=n.zoom0,n.object.updateProjectionMatrix(),n.dispatchEvent(Bu),n.update(),r=s.NONE},this.update=function(){let C=new W,U=new Zt().setFromUnitVectors(e.up,new W(0,1,0)),pe=U.clone().invert(),ge=new W,de=new Zt,ye=2*Math.PI;return function(){let Pe=n.object.position;C.copy(Pe).sub(n.target),C.applyQuaternion(U),o.setFromVector3(C),n.autoRotate&&r===s.NONE&&S(F()),n.enableDamping?(o.theta+=l.theta*n.dampingFactor,o.phi+=l.phi*n.dampingFactor):(o.theta+=l.theta,o.phi+=l.phi);let De=n.minAzimuthAngle,We=n.maxAzimuthAngle;return isFinite(De)&&isFinite(We)&&(De<-Math.PI?De+=ye:De>Math.PI&&(De-=ye),We<-Math.PI?We+=ye:We>Math.PI&&(We-=ye),De<=We?o.theta=Math.max(De,Math.min(We,o.theta)):o.theta=o.theta>(De+We)/2?Math.max(De,o.theta):Math.min(We,o.theta)),o.phi=Math.max(n.minPolarAngle,Math.min(n.maxPolarAngle,o.phi)),o.makeSafe(),o.radius*=c,o.radius=Math.max(n.minDistance,Math.min(n.maxDistance,o.radius)),n.enableDamping===!0?n.target.addScaledVector(h,n.dampingFactor):n.target.add(h),C.setFromSpherical(o),C.applyQuaternion(pe),Pe.copy(n.target).add(C),n.object.lookAt(n.target),n.enableDamping===!0?(l.theta*=1-n.dampingFactor,l.phi*=1-n.dampingFactor,h.multiplyScalar(1-n.dampingFactor)):(l.set(0,0,0),h.set(0,0,0)),c=1,u||ge.distanceToSquared(n.object.position)>a||8*(1-de.dot(n.object.quaternion))>a?(n.dispatchEvent(Bu),ge.copy(n.object.position),de.copy(n.object.quaternion),u=!1,!0):!1}}(),this.dispose=function(){n.domElement.removeEventListener("contextmenu",X),n.domElement.removeEventListener("pointerdown",Ie),n.domElement.removeEventListener("pointercancel",Qe),n.domElement.removeEventListener("wheel",Ot),n.domElement.removeEventListener("pointermove",Le),n.domElement.removeEventListener("pointerup",$e),n._domElementKeyEvents!==null&&n._domElementKeyEvents.removeEventListener("keydown",bt)};let n=this,s={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},r=s.NONE,a=1e-6,o=new ws,l=new ws,c=1,h=new W,u=!1,f=new Ae,m=new Ae,x=new Ae,p=new Ae,d=new Ae,v=new Ae,A=new Ae,y=new Ae,w=new Ae,M=[],P={};function F(){return 2*Math.PI/60/60*n.autoRotateSpeed}function g(){return Math.pow(.95,n.zoomSpeed)}function S(C){l.theta-=C}function D(C){l.phi-=C}let L=function(){let C=new W;return function(pe,ge){C.setFromMatrixColumn(ge,0),C.multiplyScalar(-pe),h.add(C)}}(),G=function(){let C=new W;return function(pe,ge){n.screenSpacePanning===!0?C.setFromMatrixColumn(ge,1):(C.setFromMatrixColumn(ge,0),C.crossVectors(n.object.up,C)),C.multiplyScalar(pe),h.add(C)}}(),O=function(){let C=new W;return function(pe,ge){let de=n.domElement;if(n.object.isPerspectiveCamera){let ye=n.object.position;C.copy(ye).sub(n.target);let ve=C.length();ve*=Math.tan(n.object.fov/2*Math.PI/180),L(2*pe*ve/de.clientHeight,n.object.matrix),G(2*ge*ve/de.clientHeight,n.object.matrix)}else n.object.isOrthographicCamera?(L(pe*(n.object.right-n.object.left)/n.object.zoom/de.clientWidth,n.object.matrix),G(ge*(n.object.top-n.object.bottom)/n.object.zoom/de.clientHeight,n.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),n.enablePan=!1)}}();function z(C){n.object.isPerspectiveCamera?c/=C:n.object.isOrthographicCamera?(n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom*C)),n.object.updateProjectionMatrix(),u=!0):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),n.enableZoom=!1)}function T(C){n.object.isPerspectiveCamera?c*=C:n.object.isOrthographicCamera?(n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/C)),n.object.updateProjectionMatrix(),u=!0):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),n.enableZoom=!1)}function R(C){f.set(C.clientX,C.clientY)}function j(C){A.set(C.clientX,C.clientY)}function V(C){p.set(C.clientX,C.clientY)}function Q(C){m.set(C.clientX,C.clientY),x.subVectors(m,f).multiplyScalar(n.rotateSpeed);let U=n.domElement;S(2*Math.PI*x.x/U.clientHeight),D(2*Math.PI*x.y/U.clientHeight),f.copy(m),n.update()}function Z(C){y.set(C.clientX,C.clientY),w.subVectors(y,A),w.y>0?z(g()):w.y<0&&T(g()),A.copy(y),n.update()}function ue(C){d.set(C.clientX,C.clientY),v.subVectors(d,p).multiplyScalar(n.panSpeed),O(v.x,v.y),p.copy(d),n.update()}function B(C){C.deltaY<0?T(g()):C.deltaY>0&&z(g()),n.update()}function ee(C){let U=!1;switch(C.code){case n.keys.UP:C.ctrlKey||C.metaKey||C.shiftKey?D(2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):O(0,n.keyPanSpeed),U=!0;break;case n.keys.BOTTOM:C.ctrlKey||C.metaKey||C.shiftKey?D(-2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):O(0,-n.keyPanSpeed),U=!0;break;case n.keys.LEFT:C.ctrlKey||C.metaKey||C.shiftKey?S(2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):O(n.keyPanSpeed,0),U=!0;break;case n.keys.RIGHT:C.ctrlKey||C.metaKey||C.shiftKey?S(-2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):O(-n.keyPanSpeed,0),U=!0;break}U&&(C.preventDefault(),n.update())}function re(){if(M.length===1)f.set(M[0].pageX,M[0].pageY);else{let C=.5*(M[0].pageX+M[1].pageX),U=.5*(M[0].pageY+M[1].pageY);f.set(C,U)}}function se(){if(M.length===1)p.set(M[0].pageX,M[0].pageY);else{let C=.5*(M[0].pageX+M[1].pageX),U=.5*(M[0].pageY+M[1].pageY);p.set(C,U)}}function N(){let C=M[0].pageX-M[1].pageX,U=M[0].pageY-M[1].pageY,pe=Math.sqrt(C*C+U*U);A.set(0,pe)}function we(){n.enableZoom&&N(),n.enablePan&&se()}function xe(){n.enableZoom&&N(),n.enableRotate&&re()}function q(C){if(M.length==1)m.set(C.pageX,C.pageY);else{let pe=Se(C),ge=.5*(C.pageX+pe.x),de=.5*(C.pageY+pe.y);m.set(ge,de)}x.subVectors(m,f).multiplyScalar(n.rotateSpeed);let U=n.domElement;S(2*Math.PI*x.x/U.clientHeight),D(2*Math.PI*x.y/U.clientHeight),f.copy(m)}function te(C){if(M.length===1)d.set(C.pageX,C.pageY);else{let U=Se(C),pe=.5*(C.pageX+U.x),ge=.5*(C.pageY+U.y);d.set(pe,ge)}v.subVectors(d,p).multiplyScalar(n.panSpeed),O(v.x,v.y),p.copy(d)}function J(C){let U=Se(C),pe=C.pageX-U.x,ge=C.pageY-U.y,de=Math.sqrt(pe*pe+ge*ge);y.set(0,de),w.set(0,Math.pow(y.y/A.y,n.zoomSpeed)),z(w.y),A.copy(y)}function ae(C){n.enableZoom&&J(C),n.enablePan&&te(C)}function he(C){n.enableZoom&&J(C),n.enableRotate&&q(C)}function Ie(C){n.enabled!==!1&&(M.length===0&&(n.domElement.setPointerCapture(C.pointerId),n.domElement.addEventListener("pointermove",Le),n.domElement.addEventListener("pointerup",$e)),ie(C),C.pointerType==="touch"?E(C):Ze(C))}function Le(C){n.enabled!==!1&&(C.pointerType==="touch"?_(C):ke(C))}function $e(C){oe(C),M.length===0&&(n.domElement.releasePointerCapture(C.pointerId),n.domElement.removeEventListener("pointermove",Le),n.domElement.removeEventListener("pointerup",$e)),n.dispatchEvent(Hu),r=s.NONE}function Qe(C){oe(C)}function Ze(C){let U;switch(C.button){case 0:U=n.mouseButtons.LEFT;break;case 1:U=n.mouseButtons.MIDDLE;break;case 2:U=n.mouseButtons.RIGHT;break;default:U=-1}switch(U){case ri.DOLLY:if(n.enableZoom===!1)return;j(C),r=s.DOLLY;break;case ri.ROTATE:if(C.ctrlKey||C.metaKey||C.shiftKey){if(n.enablePan===!1)return;V(C),r=s.PAN}else{if(n.enableRotate===!1)return;R(C),r=s.ROTATE}break;case ri.PAN:if(C.ctrlKey||C.metaKey||C.shiftKey){if(n.enableRotate===!1)return;R(C),r=s.ROTATE}else{if(n.enablePan===!1)return;V(C),r=s.PAN}break;default:r=s.NONE}r!==s.NONE&&n.dispatchEvent(ol)}function ke(C){switch(r){case s.ROTATE:if(n.enableRotate===!1)return;Q(C);break;case s.DOLLY:if(n.enableZoom===!1)return;Z(C);break;case s.PAN:if(n.enablePan===!1)return;ue(C);break}}function Ot(C){n.enabled===!1||n.enableZoom===!1||r!==s.NONE||(C.preventDefault(),n.dispatchEvent(ol),B(C),n.dispatchEvent(Hu))}function bt(C){n.enabled===!1||n.enablePan===!1||ee(C)}function E(C){switch(fe(C),M.length){case 1:switch(n.touches.ONE){case oi.ROTATE:if(n.enableRotate===!1)return;re(),r=s.TOUCH_ROTATE;break;case oi.PAN:if(n.enablePan===!1)return;se(),r=s.TOUCH_PAN;break;default:r=s.NONE}break;case 2:switch(n.touches.TWO){case oi.DOLLY_PAN:if(n.enableZoom===!1&&n.enablePan===!1)return;we(),r=s.TOUCH_DOLLY_PAN;break;case oi.DOLLY_ROTATE:if(n.enableZoom===!1&&n.enableRotate===!1)return;xe(),r=s.TOUCH_DOLLY_ROTATE;break;default:r=s.NONE}break;default:r=s.NONE}r!==s.NONE&&n.dispatchEvent(ol)}function _(C){switch(fe(C),r){case s.TOUCH_ROTATE:if(n.enableRotate===!1)return;q(C),n.update();break;case s.TOUCH_PAN:if(n.enablePan===!1)return;te(C),n.update();break;case s.TOUCH_DOLLY_PAN:if(n.enableZoom===!1&&n.enablePan===!1)return;ae(C),n.update();break;case s.TOUCH_DOLLY_ROTATE:if(n.enableZoom===!1&&n.enableRotate===!1)return;he(C),n.update();break;default:r=s.NONE}}function X(C){n.enabled!==!1&&C.preventDefault()}function ie(C){M.push(C)}function oe(C){delete P[C.pointerId];for(let U=0;U<M.length;U++)if(M[U].pointerId==C.pointerId){M.splice(U,1);return}}function fe(C){let U=P[C.pointerId];U===void 0&&(U=new Ae,P[C.pointerId]=U),U.set(C.pageX,C.pageY)}function Se(C){let U=C.pointerId===M[0].pointerId?M[1]:M[0];return P[U.pointerId]}n.domElement.addEventListener("contextmenu",X),n.domElement.addEventListener("pointerdown",Ie),n.domElement.addEventListener("pointercancel",Qe),n.domElement.addEventListener("wheel",Ot,{passive:!1}),this.update()}};var Zw={MoveLeft:new Xe("move2d.left",[ze.ARROW_LEFT,ze.KEY_A]),MoveRight:new Xe("move2d.right",[ze.ARROW_RIGHT,ze.KEY_D]),MoveUp:new Xe("move2d.up",[ze.ARROW_UP,ze.KEY_W]),MoveDown:new Xe("move2d.down",[ze.ARROW_DOWN,ze.KEY_S])};async function Vu(){let i=wt.create({id:"display",debug:!0}),e=new Ss({canvas:i.canvas});e.setSize(i.width,i.height);let t=new ft(45,i.width/i.height,1,100);t.position.set(0,5,10),t.lookAt(0,0,0);let n=new Vi(t,i);n.update();let s=new zi,r=yb(s),a=new Bi(16777215,1);a.position.set(10,10,5),s.add(a),i.addEventListener("resize",()=>{e.setSize(i.width,i.height)}),requestAnimationFrame(new Wn(o=>{n.update(),e.render(s,t)}).next)}function yb(i){let e=6,t=.2,n=4,s=e/2,r=t/2,a=n/2,o=new rn,l=Hr(o,0,-r,0,e,t,e),c=Hr(o,-s-r,a-t,0,t,n,e),h=Hr(o,s+r,a-t,0,t,n,e),u=Hr(o,0,a-t,-s-r,e+t*2,n,t);return i.add(o),o}function Hr(i,e=0,t=0,n=0,s=1,r=1,a=1,o=bb()){let l=new Jt(s,r,a),c=new Ui({color:o}),h=new At(l,c);return h.position.set(e,t,n),i.add(h),h}function bb(){return"#"+Math.floor(Math.random()*16777215).toString(16)}var cl={};Xi(cl,{Inputs:()=>Wi,draw:()=>Eb,init:()=>Mb,name:()=>wb,update:()=>Sb});function Wu(i,e){i.fillStyle=Ds.toCSSColor(e),i.fillRect(0,0,i.canvas.width,i.canvas.height)}function Vr(i,e,t,n,s){i.fillStyle=Ds.toCSSColor(s),i.beginPath(),i.arc(e,t,n,0,Math.PI*2),i.fill()}function Gu(i,e,t,n,s,r){i.fillStyle=Ds.toCSSColor(r),i.beginPath();let a=n,l=s/2,c=a/2;i.moveTo(e+c,t),i.lineTo(e-c,t-l),i.lineTo(e-c,t+l),i.fill()}var Wi={MoveLeft:new Xe("move.left",[ze.ARROW_LEFT]),MoveRight:new Xe("move.right",[ze.ARROW_RIGHT]),MoveUp:new Xe("move.up",[ze.ARROW_UP]),MoveDown:new Xe("move.down",[ze.ARROW_DOWN])},al=0,ll=0,wb="Fun Game";function Mb(i){let{axb:e}=Ge.useProvider(i,hl);e.bindBindings(Wi)}function Sb(i){Wi.MoveLeft.down&&(al-=1),Wi.MoveRight.down&&(al+=1),Wi.MoveUp.down&&(ll-=1),Wi.MoveDown.down&&(ll+=1)}function Eb(i){let{display:e}=Ge.useProvider(i,Gr),{ctx:t}=Ge.useProvider(i,Wr);Wu(t,0),Vr(t,al,ll,16,16773120);let n=e.width/2,s=e.height/2;Vr(t,n,s,30,65280),Vr(t,n,s,25,3355443),Ab(i,n,s)}function Ab(i,e,t){let{ctx:n}=Ge.useProvider(i,Wr),{detail:s}=Ge.useProvider(i,Ge.AnimationFrameLoopProvider);n.resetTransform(),n.translate(e,t),n.rotate(s.currentTime/1e3),Gu(n,0,0,30,30,16777215),n.resetTransform()}async function qu(){await Ge.toast({},cl,[Gr,hl,Wr]).start()}function Wr(i){let{canvas:e}=Ge.useProvider(i,Gr);return{ctx:e.getContext("2d")}}function Gr(i){let e=wt.create({id:"display",debug:!0}),t=e.canvas;return{display:e,canvas:t}}function hl(i){let t=Vt.create({for:"display"}).getContext("axisbutton"),n=Ge.useProvider(i,Ge.TopicsProvider);return Ge.useSystemUpdate(i,n,s=>{t.poll(s.detail.currentTime)}),{axb:t}}var pl={};Xi(pl,{ASSETS:()=>Ju,INPUTS:()=>Nb,PROVIDERS:()=>dl,init:()=>Fb,load:()=>Ob,update:()=>zb});var Tb=`
<div class="container">
  <h3 class="title">Speaker</h3>
  <div class="content">
    <p>
    Text of this cool things?
    Text of this cool things?
    Text of this cool things?
    Text of this cool things?
    Text of this cool things?
    Text of this cool things?
    Text of this cool things?
    Text of this cool things?
    Text of this cool things?
    Text of this cool things?
    Text of this cool things?
    Text of this cool things?
    Text of this cool things?
    Text of this cool things?
    Text of this cool things?
    Text of this cool things?
    Text of this cool things?
    Text of this cool things?
    Text of this cool things?
    Text of this cool things?
    Text of this cool things?
    Text of this cool things?
    </p>
  </div>
  <nav>
    <button id="next"><span class="arrow"></span></button>
  </nav>
</div>`,Cb=`
:host {
  position: absolute;
  left: 2rem;
  right: 2rem;
  bottom: 1rem;
  font-size: 1.5rem;
  color: #000000;
}

.container {
  display: flex;
  padding: 1em;
  border: 0.5rem solid #FFFFFF;
  border-radius: 1rem;
  font-family: sans-serif;
  background: rgba(200, 200, 200, 0.8);
  height: 8rem;
}

.title {
  position: absolute;
  left: 1rem;
  top: -0.2rem;
  margin: 0;
  padding: 0.2rem 0.5rem;
  transform: translateY(-50%);
  background: white;
  border: 0.5rem inset gold;
  border-radius: 1rem;
}

.content {
  flex: 1;
  overflow-y: auto;
  margin-right: 1rem;
}

p {
  margin: 0;
}

nav {
  position: absolute;
  right: 0.5em;
  bottom: 0.5em;
}

button {
  position: relative;
  padding: 0;
  margin: 0;
  width: 2rem;
  height: 2rem;
  background: none;
  border: none;
  --color: black;
}

button:hover {
  --color: gray;
  cursor: pointer;
}

.arrow {
  display: inline-block;
  width: 0;
  height: 0;
  border-left: 0.5rem solid transparent;
  border-right: 0.5rem solid transparent;
  border-top: 0.5rem solid var(--color);
}
`,qr=class extends HTMLElement{static define(e=window.customElements){e.define("dialogue-prompt",this)}static get[Symbol.for("templateNode")](){let e=document.createElement("template");return e.innerHTML=Tb,Object.defineProperty(this,Symbol.for("templateNode"),{value:e}),e}static get[Symbol.for("styleNode")](){let e=document.createElement("style");return e.innerHTML=Cb,Object.defineProperty(this,Symbol.for("styleNode"),{value:e}),e}constructor(){super();let e=this.attachShadow({mode:"open"});e.appendChild(this.constructor[Symbol.for("templateNode")].content.cloneNode(!0)),e.appendChild(this.constructor[Symbol.for("styleNode")].cloneNode(!0))}};var an=Symbol("animatedText"),Rb=1e6,Ku=30,Xu=300,Lb=Ku,Pb=/\s/,Yu=/[.!?]/,$u=/[-,:;]/,Ib=/[.-]/;function Db(i,e){if(Pb.test(e)||Ib.test(i)){if(Yu.test(i))return 800;if($u.test(i))return 250}else{if(Yu.test(i))return 200;if($u.test(i))return 100}return Ku}var ul=class{constructor(e,t=1){this.rootElement=e,this.targetNode=null,this.animatedNodes=new Set,this.nodeContents=new Map,this.deltaTime=0,this.prevTime=0,this.waitTime=Xu,this.targetText="",this.index=-1,this.disabled=!0,this.complete=!1,this.speed=t,this.callback=null,this.error=null,this.animationFrameHandle=null,this.onAnimationFrame=this.onAnimationFrame.bind(this)}toggle(e=!this.disabled){e?this.pause():this.resume()}pause(){this.disabled=!0,cancelAnimationFrame(this.animationFrameHandle),this.animationFrameHandle=null,this.deltaTime=this.waitTime}resume(){this.disabled=!1,this.canSafelyResumeWithTarget(this.targetNode)||(this.targetNode=null),this.prevTime=performance.now(),this.animationFrameHandle=requestAnimationFrame(this.onAnimationFrame)}reset(){this.targetNode=null,this.animatedNodes.clear()}skipAll(){this.targetNode&&(this.targetNode.nodeValue=this.targetText,this.targetNode=null),this.completeRemainingChildText()}onAnimationFrame(e){if(this.animationFrameHandle=requestAnimationFrame(this.onAnimationFrame),this.targetNode==null){let r=this.findNextChildText();if(r){let a=r.previousSibling||window.getComputedStyle(r.parentElement).display==="inline";this.targetNode=r,this.targetText=this.nodeContents.get(r),this.animatedNodes.add(r),this.index=-1,this.waitTime=a?Lb:Xu,this.deltaTime=0,this.complete=!1}else{this.complete=!0,this.callback.call(void 0);return}}let t=e-this.prevTime;if(this.deltaTime+=t*this.speed,this.prevTime=e,t>Rb){this.skipAll(),this.error(new Error("Frame took too long; skipping animation."));return}let n=this.targetText,s=!1;for(;!s&&this.deltaTime>=this.waitTime;){this.deltaTime-=this.waitTime;let r=++this.index;if(r<n.length){let a=n.charAt(r),o=n.charAt(r+1);this.waitTime=Db(a,o)}else this.index=n.length,s=!0}if(s)this.targetNode.nodeValue=n,this.targetNode=null;else{let r=n.substring(0,this.index+1);this.targetNode.nodeValue=r}}canSafelyResumeWithTarget(e){if(!e||!e.isConnected)return!1;let t=e.nodeValue,n=this.targetText.substring(0,this.index+1);return t===n}completeRemainingChildText(e=this.rootElement){for(let t of e.childNodes)t instanceof Text?this.nodeContents.has(t)&&(this.animatedNodes.has(t)||(t.nodeValue=this.nodeContents.get(t),this.animatedNodes.add(t))):this.completeRemainingChildText(t)}findNextChildText(e=this.rootElement,t=null){for(let n of e.childNodes)if(n instanceof Text){let s=this.animatedNodes.has(n),r=n.nodeValue;r&&r.trim().length>0&&this.nodeContents.get(n)!==r&&(this.nodeContents.set(n,r),n.nodeValue="",s&&this.animatedNodes.delete(n)),!t&&!s&&this.nodeContents.has(n)&&(t=n)}else t=this.findNextChildText(n,t);return t}},fl={async play(i,e=1){if(!(i instanceof Element))throw new Error("Cannot animate text for non-element.");if(e<=0)throw new Error("Cannot animate text at non-positive speed.");let t=new ul(i,e);return i[an]=t,new Promise((n,s)=>{t.error=r=>{s(r)},t.callback=()=>{t.pause(),delete i[an],n()},t.resume()})},pause(i){i&&an in i&&i[an].pause()},resume(i){i&&an in i&&i[an].resume()},skip(i){i&&an in i&&i[an].skipAll()},toggle(i,e=void 0){i&&an in i&&i[an].toggle(e)}};qr.define();var Nb={MoveLeft:new Xe("move.left",[ze.ARROW_LEFT,ze.KEY_A]),MoveRight:new Xe("move.right",[ze.ARROW_RIGHT,ze.KEY_D]),MoveUp:new Xe("move.up",[ze.ARROW_UP,ze.KEY_W]),MoveDown:new Xe("move.down",[ze.ARROW_DOWN,ze.KEY_S])},dl=[ju,Yr,Qu],Ju={WallFaceTexture:new En("wall.face",Zu,{},"star.png"),WallSideTexture:new En("wall.side",Zu,{},"raw://star.png")};async function Ob(i){let e=Ge.useProvider(i,ju);await Hc(e,"res.pack"),await Vc(e,Object.values(Ju))}function Fb(i){let{scene:e}=Ge.useProvider(i,Yr),{display:t}=Ge.useProvider(i,Es),n=Ub(e),s=new Bi(16777215,1);s.position.set(10,10,5),e.add(s);let r=new Ur(16777215,.3);e.add(r);let a=document.createElement("dialogue-prompt");a.slot="overlay",t.appendChild(a);let o=a.shadowRoot.querySelector(".content");o.addEventListener("click",()=>{fl.skip(o)}),fl.play(o)}function zb(i){Ge.useProvider(i,Qu).update();let{scene:t,renderer:n,camera:s}=Ge.useProvider(i,Yr);n.render(t,s)}function ju(i){return new Ys}function Yr(i){let{display:e}=Ge.useProvider(i,Es),t=new Ss({canvas:e.canvas});t.setSize(e.width,e.height);let n=new ft(45,e.width/e.height,1,100);n.position.set(0,5,10),n.lookAt(0,0,0);let s=new zi;return Ge.useHTMLElementEventListener(i,e,"resize",()=>{t.setSize(e.width,e.height)}),{renderer:t,camera:n,scene:s}}function Qu(i){let{display:e}=Ge.useProvider(i,Es),{camera:t}=Ge.useProvider(i,Yr),n=new Vi(t,e);return n.update(),n}function Ub(i){let e=6,t=.2,n=4,s=e/2,r=t/2,a=n/2,o=new rn,l=Xr(o,0,-r,0,e,t,e),c=Xr(o,-s-r,a-t,0,t,n,e),h=Xr(o,s+r,a-t,0,t,n,e),u=Xr(o,0,a-t,-s-r,e+t*2,n,t);return i.add(o),o}function Xr(i,e=0,t=0,n=0,s=1,r=1,a=1,o=kb()){let l=new Jt(s,r,a),c=new Ui({color:o}),h=new At(l,c);return h.position.set(e,t,n),i.add(h),h}function kb(){return"#"+Math.floor(Math.random()*16777215).toString(16)}async function Zu(i,e){if(typeof i=="string")return await new Fr().loadAsync(i);{let t=await So(i);return new ht(t)}}async function ef(){await Ge.toast({},pl,[Es,Bb,...dl]).start()}function Es(i){let e=wt.create({id:"display",debug:!0}),t=e.canvas;return{display:e,canvas:t}}function Bb(i){let t=Vt.create({for:"display"}).getContext("axisbutton"),n=Ge.useProvider(i,Ge.TopicsProvider);return Ge.useSystemUpdate(i,n,s=>{t.poll(s.detail.currentTime)}),{axb:t}}function Ts(i,e){let t=sf(i),n=e.name;if(n in t.contexts){let{value:s}=t.contexts[n];if(s)return s;throw Gi(i).name===e.name?new Error("Cannot get provider state on self during initialization!"):new Error("This is not a provider.")}throw new Error(`Missing assigned dependent provider '${n}' in context.`)}function tf(i,e){let t=sf(i);for(let n of e){let s={handle:n,value:null};t.contexts[n.name]=s,t.current=n,s.value=n(i)}return t.current=null,i}function nf(i,e){let t=ml(i);if(!t)return i;for(let n of e.slice().reverse()){let s=t.contexts[n.name];s.value=null,delete t.contexts[n.name]}return i}function Gi(i){let e=ml(i);if(!e)throw new Error("This is not a provider.");return e.current}function Nt(i,e){let t=ml(i);if(!t)throw new Error("This is not a provider.");t.current=e}var As=Symbol("providers");function Hb(){return{contexts:{},current:null}}function sf(i){return As in i?i[As]:i[As]=Hb()}function ml(i){return As in i?i[As]:null}function rf(i,e){let t=Gi(i);if(!t)throw new Error("Not a provider.");let n=xl(i);_l(t,n.contexts).befores.push(e)}function gl(i,e){let t=Gi(i);if(!t)throw new Error("Not a provider.");let n=xl(i);_l(t,n.contexts).afters.push(e)}async function of(i,e){let t=xl(i);for(let n of e){let s=_l(n,t.contexts),r=s.befores.slice();s.befores.length=0;let a=await Promise.all(r.map(o=>o&&o()));s.afters.push(...a)}return i}async function af(i,e){let t=Wb(i);if(!t)return i;for(let n of e.slice().reverse()){let s=qb(n,t.contexts);if(!s)throw new Error("Cannot revert context for non-existent provider.");let r=s.afters.slice();s.afters.length=0,await Promise.all(r.map(a=>a&&a()))}return i}var Cs=Symbol("effectors");function Vb(){return{contexts:{}}}function xl(i){return Cs in i?i[Cs]:i[Cs]=Vb()}function Wb(i){return Cs in i?i[Cs]:null}function Gb(){return{befores:[],afters:[]}}function _l(i,e){let t=i.name;return t in e?e[t]:e[t]=Gb()}function qb(i,e){let t=i.name;return t in e?e[t]:null}function lf(i){let e=$b(i);if(!e)throw new Error("Missing assigned run configuration in context.");return e}function cf(i,e,t){let n=Yb(i);return n.id=eo(),n.runner=e,n.providers=t,i}var Rs=Symbol("runConfiguration");function Xb(i){return{id:null,runner:null,providers:[]}}function Yb(i){if(typeof i!="object")throw new Error("Context is not an object.");return Rs in i?i[Rs]:i[Rs]=Xb(i)}function $b(i){return typeof i=="object"&&Rs in i?i[Rs]:null}var hf=new fn("system.preload"),uf=new fn("system.init"),ff=new fn("system.dead"),vl=new fn("system.update"),df=new fn("system.draw");async function pf(i,e=[],t=void 0){let n=typeof i=="function"?{init:()=>{},main:i}:i,s=t||{},r=[Qt,...e,Kb];cf(s,n,r.slice(1,r.length-1)),await mf(s,r)}function Qt(i){let e=new ns,t=new Wn(a=>{vl.dispatchImmediately(e,a),e.flush(),df.dispatchImmediately(e,a)}),{id:n,runner:s,providers:r}=lf(i);return Ls(i,e,vl,()=>{Nt(i,Qt),s.update&&s.update(i),Nt(i,null)}),Ls(i,e,df,()=>{Nt(i,Qt),s.draw&&s.draw(i),Nt(i,null)}),Ls(i,e,hf,async()=>{Nt(i,Qt),s.preload&&await s.preload(i),Nt(i,null)}),Ls(i,e,uf,()=>{Nt(i,Qt),s.init&&s.init(i),Nt(i,null)}),Ls(i,e,ff,()=>{Nt(i,Qt),s.dead&&s.dead(i),Nt(i,null)}),rf(i,async()=>(await hf.dispatchImmediatelyAndWait(e,null),uf.dispatchImmediately(e,null),Nt(i,Qt),s.main&&await s.main(i),Nt(i,null),()=>{ff.dispatchImmediatelyAndWait(e,null)})),{id:n,runner:s,providers:r,topics:e,loop:t,async stop(){gf(i,r)},async restart(){Zb(i,r)}}}function Kb(i){}function Ls(i,e,t,n){t.on(e,0,n),gl(i,()=>{t.off(e,n)})}async function mf(i,e){tf(i,e),await of(i,e);let{loop:t}=Ts(i,Qt);t.start()}async function gf(i,e){let{loop:t}=Ts(i,Qt);t.cancel(),await af(i,e),nf(i,e)}async function Zb(i,e){await gf(i,e),await mf(i,e)}function Jb(i){return Ts(i,Qt)}function jb(i,e,t,n){let{topics:s}=Jb(i);return e.on(s,t,n),gl(i,()=>{e.off(s,n)}),e}function xf(i,e,t){if(Gi(i)===Qt)throw new Error("Cannot use system topics from runner - use update() instead.");return jb(i,vl,e,t)}var $r=Ts;var bl={};Xi(bl,{INPUTS:()=>_f,PROVIDERS:()=>yl,draw:()=>nw,init:()=>Qb,main:()=>ew,update:()=>tw});var _f={MoveLeft:new Xe("move.left",[ze.ARROW_LEFT,ze.KEY_A]),MoveRight:new Xe("move.right",[ze.ARROW_RIGHT,ze.KEY_D]),MoveUp:new Xe("move.up",[ze.ARROW_UP,ze.KEY_W]),MoveDown:new Xe("move.down",[ze.ARROW_DOWN,ze.KEY_S])},yl=[vf];function vf(i){let{axb:e}=$r(i,Ml);e.bindBindings(Object.values(_f));let{canvas:t}=$r(i,wl);return{ctx:t.getContext("2d")}}function Qb(i){}async function ew(i){}function tw(i){}function nw(i){let{ctx:e}=$r(i,vf);e.fillStyle="white",e.fillRect(0,0,10,10)}async function yf(){await pf(bl,[wl,Ml,...yl])}function wl(i){let e=wt.create({id:"display",debug:!0}),t=e.canvas;return{display:e,canvas:t}}function Ml(i){let t=Vt.create({for:"display"}).getContext("axisbutton");return xf(i,0,n=>{t.poll(n.detail.currentTime)}),{axb:t}}wt.define();var bf=[Vu,qu,ef,yf];window.addEventListener("DOMContentLoaded",()=>iw(bf));async function iw(i){let{m:e=0}=zl(),t=Math.max(0,Math.min(e,bf.length)),n=i[t];if(!n)throw new Error("Missing main function.");await n()}})();
/*! Bundled license information:

three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2023 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
//# sourceMappingURL=index.js.map
