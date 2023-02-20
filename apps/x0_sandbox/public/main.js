(()=>{var Ic=Object.create,zi=Object.defineProperty;var Dc=Object.getOwnPropertyDescriptor;var Nc=Object.getOwnPropertyNames;var Oc=Object.getPrototypeOf,Fc=Object.prototype.hasOwnProperty;var Bc=s=>zi(s,"__esModule",{value:!0});var zc=(s,e)=>()=>(s&&(e=s(s=0)),e),_n=(s,e)=>()=>(e||s((e={exports:{}}).exports,e),e.exports),go=(s,e)=>{for(var t in e)zi(s,t,{get:e[t],enumerable:!0})},Uc=(s,e,t)=>{if(e&&typeof e=="object"||typeof e=="function")for(let n of Nc(e))!Fc.call(s,n)&&n!=="default"&&zi(s,n,{get:()=>e[n],enumerable:!(t=Dc(e,n))||t.enumerable});return s},kc=s=>Uc(Bc(zi(s!=null?Ic(Oc(s)):{},"default",s&&s.__esModule&&"default"in s?{get:()=>s.default,enumerable:!0}:{value:s,enumerable:!0})),s);var Eo={};go(Eo,{basename:()=>So,default:()=>Vc,delimiter:()=>Mo,dirname:()=>wo,extname:()=>Ao,isAbsolute:()=>Os,join:()=>yo,normalize:()=>Ns,relative:()=>vo,resolve:()=>ki,sep:()=>bo});function xo(s,e){for(var t=0,n=s.length-1;n>=0;n--){var i=s[n];i==="."?s.splice(n,1):i===".."?(s.splice(n,1),t++):t&&(s.splice(n,1),t--)}if(e)for(;t--;t)s.unshift("..");return s}function ki(){for(var s="",e=!1,t=arguments.length-1;t>=-1&&!e;t--){var n=t>=0?arguments[t]:"/";if(typeof n!="string")throw new TypeError("Arguments to path.resolve must be strings");if(!n)continue;s=n+"/"+s,e=n.charAt(0)==="/"}return s=xo(Fs(s.split("/"),function(i){return!!i}),!e).join("/"),(e?"/":"")+s||"."}function Ns(s){var e=Os(s),t=Gc(s,-1)==="/";return s=xo(Fs(s.split("/"),function(n){return!!n}),!e).join("/"),!s&&!e&&(s="."),s&&t&&(s+="/"),(e?"/":"")+s}function Os(s){return s.charAt(0)==="/"}function yo(){var s=Array.prototype.slice.call(arguments,0);return Ns(Fs(s,function(e,t){if(typeof e!="string")throw new TypeError("Arguments to path.join must be strings");return e}).join("/"))}function vo(s,e){s=ki(s).substr(1),e=ki(e).substr(1);function t(c){for(var h=0;h<c.length&&c[h]==="";h++);for(var d=c.length-1;d>=0&&c[d]==="";d--);return h>d?[]:c.slice(h,d-h+1)}for(var n=t(s.split("/")),i=t(e.split("/")),r=Math.min(n.length,i.length),a=r,o=0;o<r;o++)if(n[o]!==i[o]){a=o;break}for(var l=[],o=a;o<n.length;o++)l.push("..");return l=l.concat(i.slice(a)),l.join("/")}function wo(s){var e=Ds(s),t=e[0],n=e[1];return!t&&!n?".":(n&&(n=n.substr(0,n.length-1)),t+n)}function So(s,e){var t=Ds(s)[2];return e&&t.substr(-1*e.length)===e&&(t=t.substr(0,t.length-e.length)),t}function Ao(s){return Ds(s)[3]}function Fs(s,e){if(s.filter)return s.filter(e);for(var t=[],n=0;n<s.length;n++)e(s[n],n,s)&&t.push(s[n]);return t}var Hc,Ds,bo,Mo,Vc,Gc,To=zc(()=>{Hc=/^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/,Ds=function(s){return Hc.exec(s).slice(1)};bo="/",Mo=":";Vc={extname:Ao,basename:So,dirname:wo,sep:bo,delimiter:Mo,relative:vo,join:yo,isAbsolute:Os,normalize:Ns,resolve:ki};Gc="ab".substr(-1)==="b"?function(s,e,t){return s.substr(e,t)}:function(s,e,t){return e<0&&(e=s.length+e),s.substr(e,t)}});var Vi=_n((V_,Hi)=>{var xn=(To(),Eo);if(xn&&xn.default){Hi.exports=xn.default;for(let s in xn)Hi.exports[s]=xn[s]}else xn&&(Hi.exports=xn)});var fi=_n((G_,Io)=>{"use strict";var Wc=Vi(),Bt="\\\\/",Co=`[^${Bt}]`,qt="\\.",qc="\\+",Xc="\\?",Gi="\\/",Yc="(?=.)",Ro="[^/]",Bs=`(?:${Gi}|$)`,Lo=`(?:^|${Gi})`,zs=`${qt}{1,2}${Bs}`,$c=`(?!${qt})`,Kc=`(?!${Lo}${zs})`,Zc=`(?!${qt}{0,1}${Bs})`,Jc=`(?!${zs})`,jc=`[^.${Gi}]`,Qc=`${Ro}*?`,Po={DOT_LITERAL:qt,PLUS_LITERAL:qc,QMARK_LITERAL:Xc,SLASH_LITERAL:Gi,ONE_CHAR:Yc,QMARK:Ro,END_ANCHOR:Bs,DOTS_SLASH:zs,NO_DOT:$c,NO_DOTS:Kc,NO_DOT_SLASH:Zc,NO_DOTS_SLASH:Jc,QMARK_NO_DOT:jc,STAR:Qc,START_ANCHOR:Lo},eh={...Po,SLASH_LITERAL:`[${Bt}]`,QMARK:Co,STAR:`${Co}*?`,DOTS_SLASH:`${qt}{1,2}(?:[${Bt}]|$)`,NO_DOT:`(?!${qt})`,NO_DOTS:`(?!(?:^|[${Bt}])${qt}{1,2}(?:[${Bt}]|$))`,NO_DOT_SLASH:`(?!${qt}{0,1}(?:[${Bt}]|$))`,NO_DOTS_SLASH:`(?!${qt}{1,2}(?:[${Bt}]|$))`,QMARK_NO_DOT:`[^.${Bt}]`,START_ANCHOR:`(?:^|[${Bt}])`,END_ANCHOR:`(?:[${Bt}]|$)`},th={alnum:"a-zA-Z0-9",alpha:"a-zA-Z",ascii:"\\x00-\\x7F",blank:" \\t",cntrl:"\\x00-\\x1F\\x7F",digit:"0-9",graph:"\\x21-\\x7E",lower:"a-z",print:"\\x20-\\x7E ",punct:"\\-!\"#$%&'()\\*+,./:;<=>?@[\\]^_`{|}~",space:" \\t\\r\\n\\v\\f",upper:"A-Z",word:"A-Za-z0-9_",xdigit:"A-Fa-f0-9"};Io.exports={MAX_LENGTH:1024*64,POSIX_REGEX_SOURCE:th,REGEX_BACKSLASH:/\\(?![*+?^${}(|)[\]])/g,REGEX_NON_SPECIAL_CHARS:/^[^@![\].,$*+?^{}()|\\/]+/,REGEX_SPECIAL_CHARS:/[-*+?.^${}(|)[\]]/,REGEX_SPECIAL_CHARS_BACKREF:/(\\?)((\W)(\3*))/g,REGEX_SPECIAL_CHARS_GLOBAL:/([-*+?.^${}(|)[\]])/g,REGEX_REMOVE_BACKSLASH:/(?:\[.*?[^\\]\]|\\(?=.))/g,REPLACEMENTS:{"***":"*","**/**":"**","**/**/**":"**"},CHAR_0:48,CHAR_9:57,CHAR_UPPERCASE_A:65,CHAR_LOWERCASE_A:97,CHAR_UPPERCASE_Z:90,CHAR_LOWERCASE_Z:122,CHAR_LEFT_PARENTHESES:40,CHAR_RIGHT_PARENTHESES:41,CHAR_ASTERISK:42,CHAR_AMPERSAND:38,CHAR_AT:64,CHAR_BACKWARD_SLASH:92,CHAR_CARRIAGE_RETURN:13,CHAR_CIRCUMFLEX_ACCENT:94,CHAR_COLON:58,CHAR_COMMA:44,CHAR_DOT:46,CHAR_DOUBLE_QUOTE:34,CHAR_EQUAL:61,CHAR_EXCLAMATION_MARK:33,CHAR_FORM_FEED:12,CHAR_FORWARD_SLASH:47,CHAR_GRAVE_ACCENT:96,CHAR_HASH:35,CHAR_HYPHEN_MINUS:45,CHAR_LEFT_ANGLE_BRACKET:60,CHAR_LEFT_CURLY_BRACE:123,CHAR_LEFT_SQUARE_BRACKET:91,CHAR_LINE_FEED:10,CHAR_NO_BREAK_SPACE:160,CHAR_PERCENT:37,CHAR_PLUS:43,CHAR_QUESTION_MARK:63,CHAR_RIGHT_ANGLE_BRACKET:62,CHAR_RIGHT_CURLY_BRACE:125,CHAR_RIGHT_SQUARE_BRACKET:93,CHAR_SEMICOLON:59,CHAR_SINGLE_QUOTE:39,CHAR_SPACE:32,CHAR_TAB:9,CHAR_UNDERSCORE:95,CHAR_VERTICAL_LINE:124,CHAR_ZERO_WIDTH_NOBREAK_SPACE:65279,SEP:Wc.sep,extglobChars(s){return{"!":{type:"negate",open:"(?:(?!(?:",close:`))${s.STAR})`},"?":{type:"qmark",open:"(?:",close:")?"},"+":{type:"plus",open:"(?:",close:")+"},"*":{type:"star",open:"(?:",close:")*"},"@":{type:"at",open:"(?:",close:")"}}},globChars(s){return s===!0?eh:Po}}});var Wi=_n(dt=>{"use strict";var nh=Vi(),ih=!1,{REGEX_BACKSLASH:sh,REGEX_REMOVE_BACKSLASH:rh,REGEX_SPECIAL_CHARS:oh,REGEX_SPECIAL_CHARS_GLOBAL:ah}=fi();dt.isObject=s=>s!==null&&typeof s=="object"&&!Array.isArray(s);dt.hasRegexChars=s=>oh.test(s);dt.isRegexChar=s=>s.length===1&&dt.hasRegexChars(s);dt.escapeRegex=s=>s.replace(ah,"\\$1");dt.toPosixSlashes=s=>s.replace(sh,"/");dt.removeBackslashes=s=>s.replace(rh,e=>e==="\\"?"":e);dt.supportsLookbehinds=()=>{let s=process.version.slice(1).split(".").map(Number);return s.length===3&&s[0]>=9||s[0]===8&&s[1]>=10};dt.isWindows=s=>s&&typeof s.windows=="boolean"?s.windows:ih===!0||nh.sep==="\\";dt.escapeLast=(s,e,t)=>{let n=s.lastIndexOf(e,t);return n===-1?s:s[n-1]==="\\"?dt.escapeLast(s,e,n-1):`${s.slice(0,n)}\\${s.slice(n)}`};dt.removePrefix=(s,e={})=>{let t=s;return t.startsWith("./")&&(t=t.slice(2),e.prefix="./"),t};dt.wrapOutput=(s,e={},t={})=>{let n=t.contains?"":"^",i=t.contains?"":"$",r=`${n}(?:${s})${i}`;return e.negated===!0&&(r=`(?:^(?!${r}).*$)`),r}});var ko=_n((q_,Uo)=>{"use strict";var Do=Wi(),{CHAR_ASTERISK:Us,CHAR_AT:lh,CHAR_BACKWARD_SLASH:pi,CHAR_COMMA:ch,CHAR_DOT:ks,CHAR_EXCLAMATION_MARK:Hs,CHAR_FORWARD_SLASH:No,CHAR_LEFT_CURLY_BRACE:Vs,CHAR_LEFT_PARENTHESES:Gs,CHAR_LEFT_SQUARE_BRACKET:hh,CHAR_PLUS:uh,CHAR_QUESTION_MARK:Oo,CHAR_RIGHT_CURLY_BRACE:dh,CHAR_RIGHT_PARENTHESES:Fo,CHAR_RIGHT_SQUARE_BRACKET:fh}=fi(),Bo=s=>s===No||s===pi,zo=s=>{s.isPrefix!==!0&&(s.depth=s.isGlobstar?Infinity:1)},ph=(s,e)=>{let t=e||{},n=s.length-1,i=t.parts===!0||t.scanToEnd===!0,r=[],a=[],o=[],l=s,c=-1,h=0,d=0,u=!1,m=!1,_=!1,f=!1,p=!1,b=!1,E=!1,y=!1,M=!1,T=!1,P=0,N,g,w={value:"",depth:0,isGlob:!1},D=()=>c>=n,R=()=>l.charCodeAt(c+1),X=()=>(N=g,l.charCodeAt(++c));for(;c<n;){g=X();let J;if(g===pi){E=w.backslashes=!0,g=X(),g===Vs&&(b=!0);continue}if(b===!0||g===Vs){for(P++;D()!==!0&&(g=X());){if(g===pi){E=w.backslashes=!0,X();continue}if(g===Vs){P++;continue}if(b!==!0&&g===ks&&(g=X())===ks){if(u=w.isBrace=!0,_=w.isGlob=!0,T=!0,i===!0)continue;break}if(b!==!0&&g===ch){if(u=w.isBrace=!0,_=w.isGlob=!0,T=!0,i===!0)continue;break}if(g===dh&&(P--,P===0)){b=!1,u=w.isBrace=!0,T=!0;break}}if(i===!0)continue;break}if(g===No){if(r.push(c),a.push(w),w={value:"",depth:0,isGlob:!1},T===!0)continue;if(N===ks&&c===h+1){h+=2;continue}d=c+1;continue}if(t.noext!==!0&&(g===uh||g===lh||g===Us||g===Oo||g===Hs)===!0&&R()===Gs){if(_=w.isGlob=!0,f=w.isExtglob=!0,T=!0,g===Hs&&c===h&&(M=!0),i===!0){for(;D()!==!0&&(g=X());){if(g===pi){E=w.backslashes=!0,g=X();continue}if(g===Fo){_=w.isGlob=!0,T=!0;break}}continue}break}if(g===Us){if(N===Us&&(p=w.isGlobstar=!0),_=w.isGlob=!0,T=!0,i===!0)continue;break}if(g===Oo){if(_=w.isGlob=!0,T=!0,i===!0)continue;break}if(g===hh){for(;D()!==!0&&(J=X());){if(J===pi){E=w.backslashes=!0,X();continue}if(J===fh){m=w.isBracket=!0,_=w.isGlob=!0,T=!0;break}}if(i===!0)continue;break}if(t.nonegate!==!0&&g===Hs&&c===h){y=w.negated=!0,h++;continue}if(t.noparen!==!0&&g===Gs){if(_=w.isGlob=!0,i===!0){for(;D()!==!0&&(g=X());){if(g===Gs){E=w.backslashes=!0,g=X();continue}if(g===Fo){T=!0;break}}continue}break}if(_===!0){if(T=!0,i===!0)continue;break}}t.noext===!0&&(f=!1,_=!1);let O=l,B="",A="";h>0&&(B=l.slice(0,h),l=l.slice(h),d-=h),O&&_===!0&&d>0?(O=l.slice(0,d),A=l.slice(d)):_===!0?(O="",A=l):O=l,O&&O!==""&&O!=="/"&&O!==l&&Bo(O.charCodeAt(O.length-1))&&(O=O.slice(0,-1)),t.unescape===!0&&(A&&(A=Do.removeBackslashes(A)),O&&E===!0&&(O=Do.removeBackslashes(O)));let C={prefix:B,input:s,start:h,base:O,glob:A,isBrace:u,isBracket:m,isGlob:_,isExtglob:f,isGlobstar:p,negated:y,negatedExtglob:M};if(t.tokens===!0&&(C.maxDepth=0,Bo(g)||a.push(w),C.tokens=a),t.parts===!0||t.tokens===!0){let J;for(let k=0;k<r.length;k++){let j=J?J+1:h,Z=r[k],fe=s.slice(j,Z);t.tokens&&(k===0&&h!==0?(a[k].isPrefix=!0,a[k].value=B):a[k].value=fe,zo(a[k]),C.maxDepth+=a[k].depth),(k!==0||fe!=="")&&o.push(fe),J=Z}if(J&&J+1<s.length){let k=s.slice(J+1);o.push(k),t.tokens&&(a[a.length-1].value=k,zo(a[a.length-1]),C.maxDepth+=a[a.length-1].depth)}C.slashes=r,C.parts=o}return C};Uo.exports=ph});var Go=_n((X_,Vo)=>{"use strict";var qi=fi(),yt=Wi(),{MAX_LENGTH:Xi,POSIX_REGEX_SOURCE:mh,REGEX_NON_SPECIAL_CHARS:gh,REGEX_SPECIAL_CHARS_BACKREF:_h,REPLACEMENTS:Ho}=qi,xh=(s,e)=>{if(typeof e.expandRange=="function")return e.expandRange(...s,e);s.sort();let t=`[${s.join("-")}]`;try{new RegExp(t)}catch(n){return s.map(i=>yt.escapeRegex(i)).join("..")}return t},Nn=(s,e)=>`Missing ${s}: "${e}" - use "\\\\${e}" to match literal characters`,Ws=(s,e)=>{if(typeof s!="string")throw new TypeError("Expected a string");s=Ho[s]||s;let t={...e},n=typeof t.maxLength=="number"?Math.min(Xi,t.maxLength):Xi,i=s.length;if(i>n)throw new SyntaxError(`Input length: ${i}, exceeds maximum allowed length: ${n}`);let r={type:"bos",value:"",output:t.prepend||""},a=[r],o=t.capture?"":"?:",l=yt.isWindows(e),c=qi.globChars(l),h=qi.extglobChars(c),{DOT_LITERAL:d,PLUS_LITERAL:u,SLASH_LITERAL:m,ONE_CHAR:_,DOTS_SLASH:f,NO_DOT:p,NO_DOT_SLASH:b,NO_DOTS_SLASH:E,QMARK:y,QMARK_NO_DOT:M,STAR:T,START_ANCHOR:P}=c,N=V=>`(${o}(?:(?!${P}${V.dot?f:d}).)*?)`,g=t.dot?"":p,w=t.dot?y:M,D=t.bash===!0?N(t):T;t.capture&&(D=`(${D})`),typeof t.noext=="boolean"&&(t.noextglob=t.noext);let R={input:s,index:-1,start:0,dot:t.dot===!0,consumed:"",output:"",prefix:"",backtrack:!1,negated:!1,brackets:0,braces:0,parens:0,quotes:0,globstar:!1,tokens:a};s=yt.removePrefix(s,R),i=s.length;let X=[],O=[],B=[],A=r,C,J=()=>R.index===i-1,k=R.peek=(V=1)=>s[R.index+V],j=R.advance=()=>s[++R.index]||"",Z=()=>s.slice(R.index+1),fe=(V="",ee=0)=>{R.consumed+=V,R.index+=ee},U=V=>{R.output+=V.output!=null?V.output:V.value,fe(V.value)},Q=()=>{let V=1;for(;k()==="!"&&(k(2)!=="("||k(3)==="?");)j(),R.start++,V++;return V%2==0?!1:(R.negated=!0,R.start++,!0)},se=V=>{R[V]++,B.push(V)},ie=V=>{R[V]--,B.pop()},I=V=>{if(A.type==="globstar"){let ee=R.braces>0&&(V.type==="comma"||V.type==="brace"),K=V.extglob===!0||X.length&&(V.type==="pipe"||V.type==="paren");V.type!=="slash"&&V.type!=="paren"&&!ee&&!K&&(R.output=R.output.slice(0,-A.output.length),A.type="star",A.value="*",A.output=D,R.output+=A.output)}if(X.length&&V.type!=="paren"&&(X[X.length-1].inner+=V.value),(V.value||V.output)&&U(V),A&&A.type==="text"&&V.type==="text"){A.value+=V.value,A.output=(A.output||"")+V.value;return}V.prev=A,a.push(V),A=V},Me=(V,ee)=>{let K={...h[ee],conditions:1,inner:""};K.prev=A,K.parens=R.parens,K.output=R.output;let oe=(t.capture?"(":"")+K.open;se("parens"),I({type:V,value:ee,output:R.output?"":_}),I({type:"paren",extglob:!0,value:j(),output:oe}),X.push(K)},ge=V=>{let ee=V.close+(t.capture?")":""),K;if(V.type==="negate"){let oe=D;if(V.inner&&V.inner.length>1&&V.inner.includes("/")&&(oe=N(t)),(oe!==D||J()||/^\)+$/.test(Z()))&&(ee=V.close=`)$))${oe}`),V.inner.includes("*")&&(K=Z())&&/^\.[^\\/.]+$/.test(K)){let ce=Ws(K,{...e,fastpaths:!1}).output;ee=V.close=`)${ce})${oe})`}V.prev.type==="bos"&&(R.negatedExtglob=!0)}I({type:"paren",extglob:!0,value:C,output:ee}),ie("parens")};if(t.fastpaths!==!1&&!/(^[*!]|[/()[\]{}"])/.test(s)){let V=!1,ee=s.replace(_h,(K,oe,ce,Oe,Ie,qe)=>Oe==="\\"?(V=!0,K):Oe==="?"?oe?oe+Oe+(Ie?y.repeat(Ie.length):""):qe===0?w+(Ie?y.repeat(Ie.length):""):y.repeat(ce.length):Oe==="."?d.repeat(ce.length):Oe==="*"?oe?oe+Oe+(Ie?D:""):D:oe?K:`\\${K}`);return V===!0&&(t.unescape===!0?ee=ee.replace(/\\/g,""):ee=ee.replace(/\\+/g,K=>K.length%2==0?"\\\\":K?"\\":"")),ee===s&&t.contains===!0?(R.output=s,R):(R.output=yt.wrapOutput(ee,R,e),R)}for(;!J();){if(C=j(),C==="\0")continue;if(C==="\\"){let K=k();if(K==="/"&&t.bash!==!0||K==="."||K===";")continue;if(!K){C+="\\",I({type:"text",value:C});continue}let oe=/^\\+/.exec(Z()),ce=0;if(oe&&oe[0].length>2&&(ce=oe[0].length,R.index+=ce,ce%2!=0&&(C+="\\")),t.unescape===!0?C=j():C+=j(),R.brackets===0){I({type:"text",value:C});continue}}if(R.brackets>0&&(C!=="]"||A.value==="["||A.value==="[^")){if(t.posix!==!1&&C===":"){let K=A.value.slice(1);if(K.includes("[")&&(A.posix=!0,K.includes(":"))){let oe=A.value.lastIndexOf("["),ce=A.value.slice(0,oe),Oe=A.value.slice(oe+2),Ie=mh[Oe];if(Ie){A.value=ce+Ie,R.backtrack=!0,j(),!r.output&&a.indexOf(A)===1&&(r.output=_);continue}}}(C==="["&&k()!==":"||C==="-"&&k()==="]")&&(C=`\\${C}`),C==="]"&&(A.value==="["||A.value==="[^")&&(C=`\\${C}`),t.posix===!0&&C==="!"&&A.value==="["&&(C="^"),A.value+=C,U({value:C});continue}if(R.quotes===1&&C!=='"'){C=yt.escapeRegex(C),A.value+=C,U({value:C});continue}if(C==='"'){R.quotes=R.quotes===1?0:1,t.keepQuotes===!0&&I({type:"text",value:C});continue}if(C==="("){se("parens"),I({type:"paren",value:C});continue}if(C===")"){if(R.parens===0&&t.strictBrackets===!0)throw new SyntaxError(Nn("opening","("));let K=X[X.length-1];if(K&&R.parens===K.parens+1){ge(X.pop());continue}I({type:"paren",value:C,output:R.parens?")":"\\)"}),ie("parens");continue}if(C==="["){if(t.nobracket===!0||!Z().includes("]")){if(t.nobracket!==!0&&t.strictBrackets===!0)throw new SyntaxError(Nn("closing","]"));C=`\\${C}`}else se("brackets");I({type:"bracket",value:C});continue}if(C==="]"){if(t.nobracket===!0||A&&A.type==="bracket"&&A.value.length===1){I({type:"text",value:C,output:`\\${C}`});continue}if(R.brackets===0){if(t.strictBrackets===!0)throw new SyntaxError(Nn("opening","["));I({type:"text",value:C,output:`\\${C}`});continue}ie("brackets");let K=A.value.slice(1);if(A.posix!==!0&&K[0]==="^"&&!K.includes("/")&&(C=`/${C}`),A.value+=C,U({value:C}),t.literalBrackets===!1||yt.hasRegexChars(K))continue;let oe=yt.escapeRegex(A.value);if(R.output=R.output.slice(0,-A.value.length),t.literalBrackets===!0){R.output+=oe,A.value=oe;continue}A.value=`(${o}${oe}|${A.value})`,R.output+=A.value;continue}if(C==="{"&&t.nobrace!==!0){se("braces");let K={type:"brace",value:C,output:"(",outputIndex:R.output.length,tokensIndex:R.tokens.length};O.push(K),I(K);continue}if(C==="}"){let K=O[O.length-1];if(t.nobrace===!0||!K){I({type:"text",value:C,output:C});continue}let oe=")";if(K.dots===!0){let ce=a.slice(),Oe=[];for(let Ie=ce.length-1;Ie>=0&&(a.pop(),ce[Ie].type!=="brace");Ie--)ce[Ie].type!=="dots"&&Oe.unshift(ce[Ie].value);oe=xh(Oe,t),R.backtrack=!0}if(K.comma!==!0&&K.dots!==!0){let ce=R.output.slice(0,K.outputIndex),Oe=R.tokens.slice(K.tokensIndex);K.value=K.output="\\{",C=oe="\\}",R.output=ce;for(let Ie of Oe)R.output+=Ie.output||Ie.value}I({type:"brace",value:C,output:oe}),ie("braces"),O.pop();continue}if(C==="|"){X.length>0&&X[X.length-1].conditions++,I({type:"text",value:C});continue}if(C===","){let K=C,oe=O[O.length-1];oe&&B[B.length-1]==="braces"&&(oe.comma=!0,K="|"),I({type:"comma",value:C,output:K});continue}if(C==="/"){if(A.type==="dot"&&R.index===R.start+1){R.start=R.index+1,R.consumed="",R.output="",a.pop(),A=r;continue}I({type:"slash",value:C,output:m});continue}if(C==="."){if(R.braces>0&&A.type==="dot"){A.value==="."&&(A.output=d);let K=O[O.length-1];A.type="dots",A.output+=C,A.value+=C,K.dots=!0;continue}if(R.braces+R.parens===0&&A.type!=="bos"&&A.type!=="slash"){I({type:"text",value:C,output:d});continue}I({type:"dot",value:C,output:d});continue}if(C==="?"){if(!(A&&A.value==="(")&&t.noextglob!==!0&&k()==="("&&k(2)!=="?"){Me("qmark",C);continue}if(A&&A.type==="paren"){let oe=k(),ce=C;if(oe==="<"&&!yt.supportsLookbehinds())throw new Error("Node.js v10 or higher is required for regex lookbehinds");(A.value==="("&&!/[!=<:]/.test(oe)||oe==="<"&&!/<([!=]|\w+>)/.test(Z()))&&(ce=`\\${C}`),I({type:"text",value:C,output:ce});continue}if(t.dot!==!0&&(A.type==="slash"||A.type==="bos")){I({type:"qmark",value:C,output:M});continue}I({type:"qmark",value:C,output:y});continue}if(C==="!"){if(t.noextglob!==!0&&k()==="("&&(k(2)!=="?"||!/[!=<:]/.test(k(3)))){Me("negate",C);continue}if(t.nonegate!==!0&&R.index===0){Q();continue}}if(C==="+"){if(t.noextglob!==!0&&k()==="("&&k(2)!=="?"){Me("plus",C);continue}if(A&&A.value==="("||t.regex===!1){I({type:"plus",value:C,output:u});continue}if(A&&(A.type==="bracket"||A.type==="paren"||A.type==="brace")||R.parens>0){I({type:"plus",value:C});continue}I({type:"plus",value:u});continue}if(C==="@"){if(t.noextglob!==!0&&k()==="("&&k(2)!=="?"){I({type:"at",extglob:!0,value:C,output:""});continue}I({type:"text",value:C});continue}if(C!=="*"){(C==="$"||C==="^")&&(C=`\\${C}`);let K=gh.exec(Z());K&&(C+=K[0],R.index+=K[0].length),I({type:"text",value:C});continue}if(A&&(A.type==="globstar"||A.star===!0)){A.type="star",A.star=!0,A.value+=C,A.output=D,R.backtrack=!0,R.globstar=!0,fe(C);continue}let V=Z();if(t.noextglob!==!0&&/^\([^?]/.test(V)){Me("star",C);continue}if(A.type==="star"){if(t.noglobstar===!0){fe(C);continue}let K=A.prev,oe=K.prev,ce=K.type==="slash"||K.type==="bos",Oe=oe&&(oe.type==="star"||oe.type==="globstar");if(t.bash===!0&&(!ce||V[0]&&V[0]!=="/")){I({type:"star",value:C,output:""});continue}let Ie=R.braces>0&&(K.type==="comma"||K.type==="brace"),qe=X.length&&(K.type==="pipe"||K.type==="paren");if(!ce&&K.type!=="paren"&&!Ie&&!qe){I({type:"star",value:C,output:""});continue}for(;V.slice(0,3)==="/**";){let rt=s[R.index+4];if(rt&&rt!=="/")break;V=V.slice(3),fe("/**",3)}if(K.type==="bos"&&J()){A.type="globstar",A.value+=C,A.output=N(t),R.output=A.output,R.globstar=!0,fe(C);continue}if(K.type==="slash"&&K.prev.type!=="bos"&&!Oe&&J()){R.output=R.output.slice(0,-(K.output+A.output).length),K.output=`(?:${K.output}`,A.type="globstar",A.output=N(t)+(t.strictSlashes?")":"|$)"),A.value+=C,R.globstar=!0,R.output+=K.output+A.output,fe(C);continue}if(K.type==="slash"&&K.prev.type!=="bos"&&V[0]==="/"){let rt=V[1]!==void 0?"|$":"";R.output=R.output.slice(0,-(K.output+A.output).length),K.output=`(?:${K.output}`,A.type="globstar",A.output=`${N(t)}${m}|${m}${rt})`,A.value+=C,R.output+=K.output+A.output,R.globstar=!0,fe(C+j()),I({type:"slash",value:"/",output:""});continue}if(K.type==="bos"&&V[0]==="/"){A.type="globstar",A.value+=C,A.output=`(?:^|${m}|${N(t)}${m})`,R.output=A.output,R.globstar=!0,fe(C+j()),I({type:"slash",value:"/",output:""});continue}R.output=R.output.slice(0,-A.output.length),A.type="globstar",A.output=N(t),A.value+=C,R.output+=A.output,R.globstar=!0,fe(C);continue}let ee={type:"star",value:C,output:D};if(t.bash===!0){ee.output=".*?",(A.type==="bos"||A.type==="slash")&&(ee.output=g+ee.output),I(ee);continue}if(A&&(A.type==="bracket"||A.type==="paren")&&t.regex===!0){ee.output=C,I(ee);continue}(R.index===R.start||A.type==="slash"||A.type==="dot")&&(A.type==="dot"?(R.output+=b,A.output+=b):t.dot===!0?(R.output+=E,A.output+=E):(R.output+=g,A.output+=g),k()!=="*"&&(R.output+=_,A.output+=_)),I(ee)}for(;R.brackets>0;){if(t.strictBrackets===!0)throw new SyntaxError(Nn("closing","]"));R.output=yt.escapeLast(R.output,"["),ie("brackets")}for(;R.parens>0;){if(t.strictBrackets===!0)throw new SyntaxError(Nn("closing",")"));R.output=yt.escapeLast(R.output,"("),ie("parens")}for(;R.braces>0;){if(t.strictBrackets===!0)throw new SyntaxError(Nn("closing","}"));R.output=yt.escapeLast(R.output,"{"),ie("braces")}if(t.strictSlashes!==!0&&(A.type==="star"||A.type==="bracket")&&I({type:"maybe_slash",value:"",output:`${m}?`}),R.backtrack===!0){R.output="";for(let V of R.tokens)R.output+=V.output!=null?V.output:V.value,V.suffix&&(R.output+=V.suffix)}return R};Ws.fastpaths=(s,e)=>{let t={...e},n=typeof t.maxLength=="number"?Math.min(Xi,t.maxLength):Xi,i=s.length;if(i>n)throw new SyntaxError(`Input length: ${i}, exceeds maximum allowed length: ${n}`);s=Ho[s]||s;let r=yt.isWindows(e),{DOT_LITERAL:a,SLASH_LITERAL:o,ONE_CHAR:l,DOTS_SLASH:c,NO_DOT:h,NO_DOTS:d,NO_DOTS_SLASH:u,STAR:m,START_ANCHOR:_}=qi.globChars(r),f=t.dot?d:h,p=t.dot?u:h,b=t.capture?"":"?:",E={negated:!1,prefix:""},y=t.bash===!0?".*?":m;t.capture&&(y=`(${y})`);let M=g=>g.noglobstar===!0?y:`(${b}(?:(?!${_}${g.dot?c:a}).)*?)`,T=g=>{switch(g){case"*":return`${f}${l}${y}`;case".*":return`${a}${l}${y}`;case"*.*":return`${f}${y}${a}${l}${y}`;case"*/*":return`${f}${y}${o}${l}${p}${y}`;case"**":return f+M(t);case"**/*":return`(?:${f}${M(t)}${o})?${p}${l}${y}`;case"**/*.*":return`(?:${f}${M(t)}${o})?${p}${y}${a}${l}${y}`;case"**/.*":return`(?:${f}${M(t)}${o})?${a}${l}${y}`;default:{let w=/^(.*?)\.(\w+)$/.exec(g);if(!w)return;let D=T(w[1]);return D?D+a+w[2]:void 0}}},P=yt.removePrefix(s,E),N=T(P);return N&&t.strictSlashes!==!0&&(N+=`${o}?`),N};Vo.exports=Ws});var qo=_n((Y_,Wo)=>{"use strict";var yh=Vi(),vh=ko(),qs=Go(),Xs=Wi(),bh=fi(),Mh=s=>s&&typeof s=="object"&&!Array.isArray(s),We=(s,e,t=!1)=>{if(Array.isArray(s)){let h=s.map(u=>We(u,e,t));return u=>{for(let m of h){let _=m(u);if(_)return _}return!1}}let n=Mh(s)&&s.tokens&&s.input;if(s===""||typeof s!="string"&&!n)throw new TypeError("Expected pattern to be a non-empty string");let i=e||{},r=Xs.isWindows(e),a=n?We.compileRe(s,e):We.makeRe(s,e,!1,!0),o=a.state;delete a.state;let l=()=>!1;if(i.ignore){let h={...e,ignore:null,onMatch:null,onResult:null};l=We(i.ignore,h,t)}let c=(h,d=!1)=>{let{isMatch:u,match:m,output:_}=We.test(h,a,e,{glob:s,posix:r}),f={glob:s,state:o,regex:a,posix:r,input:h,output:_,match:m,isMatch:u};return typeof i.onResult=="function"&&i.onResult(f),u===!1?(f.isMatch=!1,d?f:!1):l(h)?(typeof i.onIgnore=="function"&&i.onIgnore(f),f.isMatch=!1,d?f:!1):(typeof i.onMatch=="function"&&i.onMatch(f),d?f:!0)};return t&&(c.state=o),c};We.test=(s,e,t,{glob:n,posix:i}={})=>{if(typeof s!="string")throw new TypeError("Expected input to be a string");if(s==="")return{isMatch:!1,output:""};let r=t||{},a=r.format||(i?Xs.toPosixSlashes:null),o=s===n,l=o&&a?a(s):s;return o===!1&&(l=a?a(s):s,o=l===n),(o===!1||r.capture===!0)&&(r.matchBase===!0||r.basename===!0?o=We.matchBase(s,e,t,i):o=e.exec(l)),{isMatch:Boolean(o),match:o,output:l}};We.matchBase=(s,e,t,n=Xs.isWindows(t))=>(e instanceof RegExp?e:We.makeRe(e,t)).test(yh.basename(s));We.isMatch=(s,e,t)=>We(e,t)(s);We.parse=(s,e)=>Array.isArray(s)?s.map(t=>We.parse(t,e)):qs(s,{...e,fastpaths:!1});We.scan=(s,e)=>vh(s,e);We.compileRe=(s,e,t=!1,n=!1)=>{if(t===!0)return s.output;let i=e||{},r=i.contains?"":"^",a=i.contains?"":"$",o=`${r}(?:${s.output})${a}`;s&&s.negated===!0&&(o=`^(?!${o}).*$`);let l=We.toRegex(o,e);return n===!0&&(l.state=s),l};We.makeRe=(s,e={},t=!1,n=!1)=>{if(!s||typeof s!="string")throw new TypeError("Expected a non-empty string");let i={negated:!1,fastpaths:!0};return e.fastpaths!==!1&&(s[0]==="."||s[0]==="*")&&(i.output=qs.fastpaths(s,e)),i.output||(i=qs(s,e)),We.compileRe(i,e,t,n)};We.toRegex=(s,e)=>{try{let t=e||{};return new RegExp(s,t.flags||(t.nocase?"i":""))}catch(t){if(e&&e.debug===!0)throw t;return/$^/}};We.constants=bh;Wo.exports=We});var Yo=_n(($_,Xo)=>{"use strict";Xo.exports=qo()});window.addEventListener("error",Ui,!0);window.addEventListener("unhandledrejection",Ui,!0);var _o=!1;function Ui(s){_o||(typeof s=="object"?s instanceof PromiseRejectionEvent?Ui(s.reason):s instanceof ErrorEvent?Ui(s.error):s instanceof Error?window.alert(s.stack):window.alert(JSON.stringify(s)):window.alert(s),_o=!0)}var $o=kc(Yo());var mi=class{constructor(e){let t;typeof e=="object"&&e instanceof mi?t=e.source:t=String(e),this.source=t,this._re=(0,$o.makeRe)(t)}test(e){return this._re.test(e)}},wh=/^([_\w\d]+)\:\/\//;async function Ko(s,e,t,n,i,r){let{loadings:a}=s,o;e in a?o=a[e]:(o=new On(r),a[e]=o);let l=On.nextAttempt(o),c=[o.promise];return wh.test(t)?c.push(Zo(s,t,r).then(h=>n(h,i)).then(h=>On.isCurrentAttempt(o,l)?Yi(s,e,h):void 0)):c.push(fetch(t).then(h=>h.arrayBuffer()).then(h=>n(h)).then(h=>On.isCurrentAttempt(o,l)?Yi(s,e,h):void 0)),await Promise.race(c)}function Yi(s,e,t){let{store:n,loadings:i}=s;return n[e]=t,e in i&&(i[e].resolve(t),delete i[e]),t}function Sh(s,e,t){let{defaults:n}=s;typeof e=="string"&&(e=new mi(e));let i=`__default://[${n.length}]`;return Yi(s,i,t),n.push(new Qo(e,i)),t}function Ah(s,e){let{store:t,loadings:n}=s;e in n&&(n[e].reject(new Error("Stop loading to delete asset.")),delete n[e]),e in t&&delete t[e]}function Eh(s,e){typeof e=="string"&&(e=new mi(e));let{store:t,loadings:n}=s;for(let[i,r]of Object.entries(n))e.test(i)&&(r.reject(new Error(`Stop loading to clear assets matching ${e}`)),delete n[i]);for(let i of Object.keys(t))e.test(i)&&delete t[i]}function Th(s){let{store:e,loadings:t,defaults:n}=s;for(let[i,r]of Object.entries(t))r.reject(new Error("Stop loading to clear all assets.")),delete t[i];for(let i of Object.keys(e))delete e[i];n.length=0}function Ch(s,e){let{loadings:t}=s;return e in t?t[e].promise:null}async function Zo(s,e,t){let{store:n,loadings:i}=s;if(e in n)return n[e];if(e in i)return i[e].promise;{let r=new On(t);return i[e]=r,r.promise}}function Rh(s,e){let{defaults:t}=s;for(let n of t)if(n.glob.test(e))return $i(s,n.uri);return null}function $i(s,e){return s.store[e]}function Lh(s,e){return Boolean(s.store[e])}function Ph(s){return Object.keys(s.store)}function Jo(s,e){return e in s.store}function jo(s,e){return e in s.loadings}var Qo=class{constructor(e,t){this.glob=e,this.uri=t}},On=class{static nextAttempt(e){return++e._promiseHandle}static isCurrentAttempt(e,t){return e._promiseHandle===t}constructor(e){this._promiseHandle=0,this._resolve=null,this._reject=null,this._reason=null,this._value=null,this._timeoutHandle=Number.isFinite(e)&&e>0?setTimeout(()=>{this.reject(`Asset loading exceeded timeout of ${e} ms.`)},e):null,this._promise=new Promise((t,n)=>{this._value?t(this._value):this._resolve=t,this._reason?n(this._reason):this._reject=n})}get promise(){return this._promise}resolve(e){this._timeoutHandle&&(clearTimeout(this._timeoutHandle),this._timeoutHandle=null),this._resolve?this._resolve(e):this._value=e}reject(e){this._timeoutHandle&&(clearTimeout(this._timeoutHandle),this._timeoutHandle=null),this._reject?this._reject(e):this._reason=e}},Ys=class{constructor(e=null){this.parent=e,this.store={},this.loadings={},this.defaults=[]}get(e){let t=this;if(Jo(t,e))return $i(t,e);let n=Rh(t,e);return n||null}async resolve(e,t,n,i,r){return this.get(e)||await this.load(e,t,n,i,r)}fallback(e,t){return Sh(this,e,t)}cache(e,t){return Yi(this,e,t)}async load(e,t,n,i,r){let a=this;return Jo(a,e)?$i(a,e):jo(a,e)?await Zo(a,e,r):await Ko(a,e,t,n,i,r)}async reload(e,t,n,i,r){return await Ko(this,e,t,n,i,r)}unload(e){Ah(this,e)}clear(e){Eh(this,e)}current(e){return $i(this,e)}exists(e){return Lh(this,e)}loading(e){let t=this;return jo(t,e)?Ch(t,e):null}keys(){return Ph(this)}reset(){Th(this)}};var Ih=`<div class="container">
  <label class="hidden" id="title">display-port</label>
  <label class="hidden" id="fps">00</label>
  <label class="hidden" id="dimension">0x0</label>
  <div class="content">
    <canvas> Oh no! Your browser does not support canvas. </canvas>
    <slot id="inner"></slot>
  </div>
  <slot name="frame"></slot>
</div>
`,Dh=`:host {
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
}
`,ea="noscale";var $s="fit",ta="scale",na="fill",ia="stretch",sa=300,ra=150,oa=$s,Nh=200,Fn=class extends HTMLElement{static create(e={}){let{root:t=document.body,id:n=void 0,mode:i=oa,width:r=sa,height:a=ra,debug:o=!1}=e||{},l=new Fn;return l.id=n,l.mode=i,l.width=r,l.height=a,l.debug=o,t.appendChild(l),l}static get[Symbol.for("templateNode")](){let e=document.createElement("template");return e.innerHTML=Ih,Object.defineProperty(this,Symbol.for("templateNode"),{value:e}),e}static get[Symbol.for("styleNode")](){let e=document.createElement("style");return e.innerHTML=Dh,Object.defineProperty(this,Symbol.for("styleNode"),{value:e}),e}static define(e=window.customElements){e.define("display-port",this)}static get observedAttributes(){return["debug","disabled","width","height","onframe","id","class"]}get mode(){return this.getAttribute("mode")}set mode(e){this.setAttribute("mode",e)}get debug(){return this._debug}set debug(e){this.toggleAttribute("debug",e)}get disabled(){return this._disabled}set disabled(e){this.toggleAttribute("disabled",e)}get width(){return this._width}set width(e){this.setAttribute("width",String(e))}get height(){return this._height}set height(e){this.setAttribute("height",String(e))}get onframe(){return this._onframe}set onframe(e){this._onframe&&this.removeEventListener("frame",this._onframe),this._onframe=e,this._onframe&&this.addEventListener("frame",e)}constructor(){super();let e=this.attachShadow({mode:"open"});e.appendChild(this.constructor[Symbol.for("templateNode")].content.cloneNode(!0)),e.appendChild(this.constructor[Symbol.for("styleNode")].cloneNode(!0)),this._canvasElement=e.querySelector("canvas"),this._contentElement=e.querySelector(".content"),this._innerElement=e.querySelector("#inner"),this._titleElement=e.querySelector("#title"),this._fpsElement=e.querySelector("#fps"),this._dimensionElement=e.querySelector("#dimension"),this._debug=!1,this._disabled=!1,this._width=sa,this._height=ra,this._onframe=void 0,this._animationRequestHandle=0,this._prevAnimationFrameTime=0,this._resizeTimeoutHandle=0,this._resizeCanvasWidth=0,this._resizeCanvasHeight=0,this._frameEvent=new CustomEvent("frame",{composed:!0,bubbles:!1,detail:{now:0,prevTime:0,deltaTime:0,canvas:this._canvasElement}}),this._resizeEvent=new CustomEvent("resize",{composed:!0,bubbles:!1,detail:{width:0,height:0}}),this.update=this.update.bind(this),this.onDelayCanvasResize=this.onDelayCanvasResize.bind(this)}get canvas(){return this._canvasElement}connectedCallback(){Bn(this,"mode"),Bn(this,"debug"),Bn(this,"disabled"),Bn(this,"width"),Bn(this,"height"),Bn(this,"onframe"),this.hasAttribute("mode")||this.setAttribute("mode",oa),this.hasAttribute("tabindex")||this.setAttribute("tabindex","0"),this.updateCanvasSize(!0),this.resume()}disconnectedCallback(){this.pause()}attributeChangedCallback(e,t,n){switch(e){case"debug":this._debug=n!==null;break;case"disabled":this._disabled=n!==null;break;case"width":this._width=Number(n);break;case"height":this._height=Number(n);break;case"onframe":this.onframe=new Function("event","with(document){with(this){"+n+"}}").bind(this);break}switch(e){case"disabled":n?(this.update(0),this.pause()):this.resume();break;case"id":case"class":this._titleElement.innerHTML=`display-port${this.className?"."+this.className:""}${this.hasAttribute("id")?"#"+this.getAttribute("id"):""}`;break;case"debug":this._titleElement.classList.toggle("hidden",n),this._fpsElement.classList.toggle("hidden",n),this._dimensionElement.classList.toggle("hidden",n);break}}getContext(e="2d",t=void 0){return this._canvasElement.getContext(e,t)}pause(){window.cancelAnimationFrame(this._animationRequestHandle)}resume(){this._animationRequestHandle=window.requestAnimationFrame(this.update)}update(e){this._animationRequestHandle=window.requestAnimationFrame(this.update),this.updateCanvasSize(!1);let t=e-this._prevAnimationFrameTime;if(this._prevAnimationFrameTime=e,this._debug){let r=t<=0?"--":String(Math.round(1e3/t)).padStart(2,"0");if(this._fpsElement.textContent!==r&&(this._fpsElement.textContent=r),this.mode===ea){let o=`${this._width}x${this._height}`;this._dimensionElement.textContent!==o&&(this._dimensionElement.textContent=o)}else{let o=`${this._width}x${this._height}|${this.shadowRoot.host.clientWidth}x${this.shadowRoot.host.clientHeight}`;this._dimensionElement.textContent!==o&&(this._dimensionElement.textContent=o)}}let i=this._frameEvent.detail;i.now=e,i.prevTime=this._prevAnimationFrameTime,i.deltaTime=t,this.dispatchEvent(this._frameEvent)}onDelayCanvasResize(){this._resizeTimeoutHandle=null,this.updateCanvasSize(!0)}delayCanvasResize(e,t){(e!==this._resizeCanvasWidth||t!==this._resizeCanvasHeight)&&(this._resizeCanvasWidth=e,this._resizeCanvasHeight=t,this._resizeTimeoutHandle&&window.clearTimeout(this._resizeTimeoutHandle),this._resizeTimeoutHandle=window.setTimeout(this.onDelayCanvasResize,Nh))}updateCanvasSize(e=!0){let t=this.shadowRoot.host.getBoundingClientRect(),n=t.width,i=t.height,r=this._canvasElement,a=this._width,o=this._height,l=this.mode;if(l===ia||l===na)a=n,o=i;else if(l!==ea&&(n<a||i<o||l===$s||l==ta)){let h=n/a,d=i/o;h<d?(a=n,o=o*h):(a=a*d,o=i)}if(a=Math.floor(a),o=Math.floor(o),typeof e=="undefined"&&(e=r.clientWidth!==a||r.clientHeight!==o),!e){this.delayCanvasResize(a,o);return}let c=Math.min(a/this._width,o/this._height)*.5;if(this._innerElement.style.fontSize=`font-size: ${c}em`,e){l===ta?(r.width=this._width,r.height=this._height):l!==ia&&(r.width=a,r.height=o);let h=this._contentElement.style;h.width=`${a}px`,h.height=`${o}px`,(l===$s||l===na)&&(this._width=a,this._height=o);let u=this._resizeEvent.detail;u.width=a,u.height=o,this.dispatchEvent(this._resizeEvent)}}};Fn.define();function Bn(s,e){if(Object.prototype.hasOwnProperty.call(s,e)){let t=s[e];delete s[e],s[e]=t}}var Ks=class{get polling(){return performance.now()-this._lastPollingTime<1e3}get value(){return 0}get size(){return this._size}constructor(e){this._size=e,this._lastPollingTime=Number.MIN_SAFE_INTEGER}resize(e){this._size=e}getState(e){throw new Error("Missing implementation.")}onUpdate(e,t,n){throw new Error("Missing implementation.")}onStatus(e,t){throw new Error("Missing implementation.")}onPoll(e){this._lastPollingTime=e}onBind(e,t=void 0){e>=this._size&&this.resize(e+1)}onUnbind(){this.resize(0)}},gi=class extends Ks{static createAxisBindingState(){return{value:0,delta:0,inverted:!1}}get delta(){return this._delta}get value(){return this._value}constructor(e=0){super(e);let t=new Array,n=this.constructor;for(let i=0;i<e;++i)t.push(n.createAxisBindingState());this._state=t,this._value=0,this._delta=0}resize(e){let t=this._state,n=t.length,i;if(e<=n)i=t.slice(0,e);else{i=t;let r=this.constructor;for(let a=n;a<e;++a)i.push(r.createAxisBindingState())}this._state=i,super.resize(e)}getState(e){return this._state[e].value}onPoll(e){let t=this._state,n=0,i=0,r=t.length;for(let a=0;a<r;++a){let o=t[a];n+=o.value*(o.inverted?-1:1),i+=o.delta,t[a].delta=0}this._value=n,this._delta=i,super.onPoll(e)}onUpdate(e,t,n){typeof t=="undefined"?this.onAxisChange(e,n):this.onAxisMove(e,t,n)}onStatus(e,t){this.onAxisStatus(e,t)}onBind(e,t=void 0){super.onBind(e,t);let{inverted:n=!1}=t||{},i=this._state;i[e].inverted=n}onAxisMove(e,t,n){let i=this._state[e];i.value=t,i.delta+=n}onAxisChange(e,t){let n=this._state[e];n.value+=t,n.delta+=t}onAxisStatus(e,t){let n=this._state[e],i=n.value;n.value=t,n.delta=t-i}},Oh=241,aa=254,Fh=239,yn=1,Zs=2,Js=4,js=8,Qs=16,Ki=class extends Ks{get pressed(){return this._pressed}get repeated(){return this._repeated}get released(){return this._released}get down(){return this._down}get value(){return this._value}constructor(e=0){super(e);this._state=new Uint8Array(e),this._value=0,this._down=!1,this._pressed=!1,this._repeated=!1,this._released=!1}resize(e){let t=this._state,n=t.length,i;e<=n?i=t.slice(0,e):(i=new Uint8Array(e),i.set(t)),this._state=i,super.resize(e)}getState(e){let t=this._state[e],n=t&Qs?-1:1;return(t&yn?1:0)*n}onPoll(e){let t=this._state,n=0,i=0,r=0,a=0,o=0,l=t.length;for(let c=0;c<l;++c){let h=t[c],d=h&yn,u=h&Qs;i|=d,r|=h&Zs,a|=h&Js,o|=h&js,n+=(d?1:0)*(u?-1:1),t[c]&=Oh}this._value=n,this._down=i!==0,this._pressed=r!==0,this._repeated=a!==0,this._released=o!==0,super.onPoll(e)}onUpdate(e,t,n){n>0?this.onButtonPressed(e):this.onButtonReleased(e)}onStatus(e,t){this.onButtonStatus(e,t!==0)}onBind(e,t={inverted:!1}){super.onBind(e,t);let{inverted:n=!1}=t,i=this._state;n?i[e]|=Qs:i[e]&=Fh}onButtonPressed(e){let t=this._state,n=t[e];n&yn||(n|=Zs,n|=yn),n|=Js,t[e]=n}onButtonReleased(e){let t=this._state,n=t[e];n&yn&&(n|=js,n&=aa),t[e]=n}onButtonStatus(e,t){let n=this._state,i=n[e],r=Boolean(i&yn);t?i|=yn:i&=aa,r&&!t&&(i|=js),!r&&t&&(i|=Zs,i|=Js),n[e]=i}},le=class{static parse(e){e=e.trim();let t=e.indexOf(".");if(t<0)throw new Error("Missing device separator for key code.");let n=e.substring(0,t);if(n.length<0)throw new Error("Missing device for key code.");let i=e.substring(t+1);if(i.length<0)throw new Error("Missing code for key code.");return new le(n,i)}constructor(e,t){this.device=e,this.code=t}toString(){return`${this.device}.${this.code}`}};function la(s,e){return new le(s,e)}function Bh(s){return"device"in s&&"code"in s}var pe="Keyboard",Lt="Mouse",zh=new le(pe,"KeyA"),Uh=new le(pe,"KeyB"),kh=new le(pe,"KeyC"),Hh=new le(pe,"KeyD"),Vh=new le(pe,"KeyE"),Gh=new le(pe,"KeyF"),Wh=new le(pe,"KeyG"),qh=new le(pe,"KeyH"),Xh=new le(pe,"KeyI"),Yh=new le(pe,"KeyJ"),$h=new le(pe,"KeyK"),Kh=new le(pe,"KeyL"),Zh=new le(pe,"KeyM"),Jh=new le(pe,"KeyN"),jh=new le(pe,"KeyO"),Qh=new le(pe,"KeyP"),eu=new le(pe,"KeyQ"),tu=new le(pe,"KeyR"),nu=new le(pe,"KeyS"),iu=new le(pe,"KeyT"),su=new le(pe,"KeyU"),ru=new le(pe,"KeyV"),ou=new le(pe,"KeyW"),au=new le(pe,"KeyX"),lu=new le(pe,"KeyY"),cu=new le(pe,"KeyZ"),hu=new le(pe,"Digit0"),uu=new le(pe,"Digit1"),du=new le(pe,"Digit2"),fu=new le(pe,"Digit3"),pu=new le(pe,"Digit4"),mu=new le(pe,"Digit5"),gu=new le(pe,"Digit6"),_u=new le(pe,"Digit7"),xu=new le(pe,"Digit8"),yu=new le(pe,"Digit9"),vu=new le(pe,"Minus"),bu=new le(pe,"Equal"),Mu=new le(pe,"BracketLeft"),wu=new le(pe,"BracketRight"),Su=new le(pe,"Semicolon"),Au=new le(pe,"Quote"),Eu=new le(pe,"Backquote"),Tu=new le(pe,"Backslash"),Cu=new le(pe,"Comma"),Ru=new le(pe,"Period"),Lu=new le(pe,"Slash"),Pu=new le(pe,"Escape"),Iu=new le(pe,"Space"),Du=new le(pe,"CapsLock"),Nu=new le(pe,"Backspace"),Ou=new le(pe,"Delete"),Fu=new le(pe,"Tab"),Bu=new le(pe,"Enter"),zu=new le(pe,"ArrowUp"),Uu=new le(pe,"ArrowDown"),ku=new le(pe,"ArrowLeft"),Hu=new le(pe,"ArrowRight"),Vu=new le(Lt,"Button0"),Gu=new le(Lt,"Button1"),Wu=new le(Lt,"Button2"),qu=new le(Lt,"Button3"),Xu=new le(Lt,"Button4"),Yu=new le(Lt,"PosX"),$u=new le(Lt,"PosY"),Ku=new le(Lt,"WheelX"),Zu=new le(Lt,"WheelY"),Ju=new le(Lt,"WheelZ"),_i=Object.freeze({__proto__:null,ARROW_DOWN:Uu,ARROW_LEFT:ku,ARROW_RIGHT:Hu,ARROW_UP:zu,BACKQUOTE:Eu,BACKSLASH:Tu,BACKSPACE:Nu,BRACKET_LEFT:Mu,BRACKET_RIGHT:wu,CAPS_LOCK:Du,COMMA:Cu,DELETE:Ou,DIGIT_0:hu,DIGIT_1:uu,DIGIT_2:du,DIGIT_3:fu,DIGIT_4:pu,DIGIT_5:mu,DIGIT_6:gu,DIGIT_7:_u,DIGIT_8:xu,DIGIT_9:yu,ENTER:Bu,EQUAL:bu,ESCAPE:Pu,KEYBOARD:pe,KEY_A:zh,KEY_B:Uh,KEY_C:kh,KEY_D:Hh,KEY_E:Vh,KEY_F:Gh,KEY_G:Wh,KEY_H:qh,KEY_I:Xh,KEY_J:Yh,KEY_K:$h,KEY_L:Kh,KEY_M:Zh,KEY_N:Jh,KEY_O:jh,KEY_P:Qh,KEY_Q:eu,KEY_R:tu,KEY_S:nu,KEY_T:iu,KEY_U:su,KEY_V:ru,KEY_W:ou,KEY_X:au,KEY_Y:lu,KEY_Z:cu,MINUS:vu,MOUSE:Lt,MOUSE_BUTTON_0:Vu,MOUSE_BUTTON_1:Gu,MOUSE_BUTTON_2:Wu,MOUSE_BUTTON_3:qu,MOUSE_BUTTON_4:Xu,MOUSE_POS_X:Yu,MOUSE_POS_Y:$u,MOUSE_WHEEL_X:Ku,MOUSE_WHEEL_Y:Zu,MOUSE_WHEEL_Z:Ju,PERIOD:Ru,QUOTE:Au,SEMICOLON:Su,SLASH:Lu,SPACE:Iu,TAB:Fu,from:la,isKeyCode:Bh}),ca=class{get polling(){return this.ref?this.ref.polling:!1}get value(){return!this.ref||this.disabled?0:this.ref.value}constructor(e){this.name=e,this.ref=null,this.disabled=!1}bindTo(e){throw new Error("Unsupported operation.")}disable(e=!0){return this.disabled=e,this}getState(e){return!this.ref||this.disabled?0:this.ref.getState(e)}};function ju(s){Array.isArray(s)||(s=[s]);let e=[];for(let t of s){let n;try{n=le.parse(t)}catch(i){let r=Qu(t).toUpperCase();if(!(r in _i))throw new Error("Invalid key code string - "+i);n=_i[r]}e.push(n)}return e}function Qu(s){return s.replace(/([a-z]|(?:[A-Z0-9]+))([A-Z0-9]|$)/g,function(e,t,n){return t+(n&&"_"+n)}).toLowerCase()}var vn=class extends ca{static fromBind(e,t,n,i=void 0){return new vn(e,la(t,n),i)}static fromString(e,...t){let n=ju(t);return new vn(e,n)}get pressed(){return!this.ref||this.disabled?!1:this.ref.pressed}get repeated(){return!this.ref||this.disabled?!1:this.ref.repeated}get released(){return!this.ref||this.disabled?!1:this.ref.released}get down(){return!this.ref||this.disabled?!1:this.ref.down}constructor(e,t,n=void 0){super(e);this.keyCodes=Array.isArray(t)?t:[t],this.opts=n}bindTo(e){let t=this.name,n=this.opts;for(let i of this.keyCodes)e.bindButton(t,i.device,i.code,n);return this.ref=e.getButton(t),this}};var er=class{static isAxis(e){return!1}static isButton(e){return!1}constructor(e,t){if(!t)throw new Error(`Missing event target for device ${e}.`);this.name=e,this.eventTarget=t,this.listeners={input:[]}}setEventTarget(e){if(!e)throw new Error(`Missing event target for device ${this.name}.`);this.eventTarget=e}destroy(){let e=this.listeners;for(let t in e)e[t].length=0}addEventListener(e,t){let n=this.listeners;e in n?n[e].push(t):n[e]=[t]}removeEventListener(e,t){let n=this.listeners;if(e in n){let i=n[e],r=i.indexOf(t);r>=0&&i.splice(r,1)}}dispatchInputEvent(e){let t=0;for(let n of this.listeners.input)t|=n(e);return Boolean(t)}},ha=class extends er{static isAxis(e){return!1}static isButton(e){return!0}constructor(e,t,n={}){super(e,t);let{ignoreRepeat:i=!0}=n;this.ignoreRepeat=i,this._eventObject={target:t,device:e,code:"",event:"",value:0,control:!1,shift:!1,alt:!1},this.onKeyDown=this.onKeyDown.bind(this),this.onKeyUp=this.onKeyUp.bind(this),t.addEventListener("keydown",this.onKeyDown),t.addEventListener("keyup",this.onKeyUp)}setEventTarget(e){this.eventTarget&&this.destroy(),super.setEventTarget(e),e.addEventListener("keydown",this.onKeyDown),e.addEventListener("keyup",this.onKeyUp)}destroy(){let e=this.eventTarget;e.removeEventListener("keydown",this.onKeyDown),e.removeEventListener("keyup",this.onKeyUp),super.destroy()}onKeyDown(e){if(e.repeat&&this.ignoreRepeat)return e.preventDefault(),e.stopPropagation(),!1;let t=this._eventObject;if(t.code=e.code,t.event="pressed",t.value=1,t.control=e.ctrlKey,t.shift=e.shiftKey,t.alt=e.altKey,this.dispatchInputEvent(t))return e.preventDefault(),e.stopPropagation(),!1}onKeyUp(e){let t=this._eventObject;if(t.code=e.code,t.event="released",t.value=1,t.control=e.ctrlKey,t.shift=e.shiftKey,t.alt=e.altKey,this.dispatchInputEvent(t))return e.preventDefault(),e.stopPropagation(),!1}},tr=10,nr=100,ua=class extends er{static isAxis(e){return e==="PosX"||e==="PosY"||e==="WheelX"||e==="WheelY"||e==="WheelZ"}static isButton(e){return!this.isAxis(e)}constructor(e,t,n={}){super(e,t);let{eventsOnFocus:i=!0}=n;this.eventsOnFocus=i,this.canvasTarget=this.getCanvasFromEventTarget(t),this._downHasFocus=!1,this._eventObject={target:t,device:e,code:"",event:"",value:0,control:!1,shift:!1,alt:!1},this._positionObject={target:t,device:e,code:"",event:"move",value:0,movement:0},this._wheelObject={target:t,device:e,code:"",event:"wheel",movement:0},this.onMouseDown=this.onMouseDown.bind(this),this.onMouseUp=this.onMouseUp.bind(this),this.onMouseMove=this.onMouseMove.bind(this),this.onContextMenu=this.onContextMenu.bind(this),this.onWheel=this.onWheel.bind(this),t.addEventListener("mousedown",this.onMouseDown),t.addEventListener("contextmenu",this.onContextMenu),t.addEventListener("wheel",this.onWheel),document.addEventListener("mousemove",this.onMouseMove),document.addEventListener("mouseup",this.onMouseUp)}setEventTarget(e){this.eventTarget&&this.destroy(),super.setEventTarget(e),this.canvasTarget=this.getCanvasFromEventTarget(e),e.addEventListener("mousedown",this.onMouseDown),e.addEventListener("contextmenu",this.onContextMenu),e.addEventListener("wheel",this.onWheel),document.addEventListener("mousemove",this.onMouseMove),document.addEventListener("mouseup",this.onMouseUp)}destroy(){let e=this.eventTarget;e.removeEventListener("mousedown",this.onMouseDown),e.removeEventListener("contextmenu",this.onContextMenu),e.removeEventListener("wheel",this.onWheel),document.removeEventListener("mousemove",this.onMouseMove),document.removeEventListener("mouseup",this.onMouseUp),super.destroy()}setPointerLock(e=!0){e?this.eventTarget.requestPointerLock():this.eventTarget.exitPointerLock()}hasPointerLock(){return document.pointerLockElement===this.eventTarget}onMouseDown(e){this._downHasFocus=!0;let t=this._eventObject;if(t.code="Button"+e.button,t.event="pressed",t.value=1,t.control=e.ctrlKey,t.shift=e.shiftKey,t.alt=e.altKey,this.dispatchInputEvent(t)&&document.activeElement===this.eventTarget)return e.preventDefault(),e.stopPropagation(),!1}onContextMenu(e){return e.preventDefault(),e.stopPropagation(),!1}onWheel(e){let t,n,i;switch(e.deltaMode){case WheelEvent.DOM_DELTA_LINE:t=e.deltaX*tr,n=e.deltaY*tr,i=e.deltaZ*tr;break;case WheelEvent.DOM_DELTA_PAGE:t=e.deltaX*nr,n=e.deltaY*nr,i=e.deltaZ*nr;break;case WheelEvent.DOM_DELTA_PIXEL:default:t=e.deltaX,n=e.deltaY,i=e.deltaZ;break}let r=0,a=this._wheelObject;if(a.code="WheelX",a.movement=t,r|=this.dispatchInputEvent(a),a.code="WheelY",a.movement=n,r|=this.dispatchInputEvent(a),a.code="WheelZ",a.movement=i,r|=this.dispatchInputEvent(a),r)return e.preventDefault(),e.stopPropagation(),!1}onMouseUp(e){if(!this._downHasFocus)return;this._downHasFocus=!1;let t=this._eventObject;if(t.code="Button"+e.button,t.event="released",t.value=1,t.control=e.ctrlKey,t.shift=e.shiftKey,t.alt=e.altKey,this.dispatchInputEvent(t))return e.preventDefault(),e.stopPropagation(),!1}onMouseMove(e){if(this.eventsOnFocus&&document.activeElement!==this.eventTarget)return;let t=this.canvasTarget,{clientWidth:n,clientHeight:i}=t,r=t.getBoundingClientRect(),a=e.movementX/n,o=e.movementY/i,l=(e.clientX-r.left)/n,c=(e.clientY-r.top)/i,h=this._positionObject;h.code="PosX",h.value=l,h.movement=a,this.dispatchInputEvent(h),h.code="PosY",h.value=c,h.movement=o,this.dispatchInputEvent(h)}getCanvasFromEventTarget(e){return e instanceof HTMLCanvasElement?e:e.canvas||e.querySelector("canvas")||e.shadowRoot&&e.shadowRoot.querySelector("canvas")||e}},ed=`<kbd>
  <span id="name"><slot></slot></span>
  <span id="value" class="hidden"></span>
</kbd>
`,td=`kbd {
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
`,ir=class extends HTMLElement{static get[Symbol.for("templateNode")](){let e=document.createElement("template");return e.innerHTML=ed,Object.defineProperty(this,Symbol.for("templateNode"),{value:e}),e}static get[Symbol.for("styleNode")](){let e=document.createElement("style");return e.innerHTML=td,Object.defineProperty(this,Symbol.for("styleNode"),{value:e}),e}static define(e=window.customElements){e.define("input-code",this)}static get observedAttributes(){return["name","value","disabled"]}get disabled(){return this._disabled}set disabled(e){this.toggleAttribute("disabled",e)}get value(){return this._value}set value(e){this.setAttribute("value",e)}get name(){return this._name}set name(e){this.setAttribute("name",e)}constructor(){super();let e=this.constructor,t=this.attachShadow({mode:"open"});t.appendChild(e[Symbol.for("templateNode")].content.cloneNode(!0)),t.appendChild(e[Symbol.for("styleNode")].cloneNode(!0)),this._name="",this._value="",this._disabled=!1,this._kbdElement=t.querySelector("kbd"),this._nameElement=t.querySelector("#name"),this._valueElement=t.querySelector("#value")}attributeChangedCallback(e,t,n){switch(e){case"name":this._name=n,this._nameElement.textContent=n;break;case"value":this._value=n,n!==null?(this._valueElement.classList.toggle("hidden",!1),this._valueElement.textContent=n,this._kbdElement.style.paddingRight=`${this._valueElement.clientWidth+4}px`):this._valueElement.classList.toggle("hidden",!0);break;case"disabled":this._disabled=n!==null,this._kbdElement.classList.toggle("disabled",n!==null);break}}connectedCallback(){if(Object.prototype.hasOwnProperty.call(this,"name")){let e=this.name;delete this.name,this.name=e}if(Object.prototype.hasOwnProperty.call(this,"value")){let e=this.value;delete this.value,this.value=e}if(Object.prototype.hasOwnProperty.call(this,"disabled")){let e=this.disabled;delete this.disabled,this.disabled=e}}};ir.define();var nd=`<table>
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
`,id=`:host {
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
`,da=class{constructor(e){this.onAnimationFrame=this.onAnimationFrame.bind(this),this.animationFrameHandle=null,this.pollable=e}get running(){return this.animationFrameHandle!==null}start(){let e=this.animationFrameHandle;e&&cancelAnimationFrame(e),this.animationFrameHandle=requestAnimationFrame(this.onAnimationFrame)}stop(){let e=this.animationFrameHandle;e&&cancelAnimationFrame(e),this.animationFrameHandle=null}onAnimationFrame(e){this.animationFrameHandle=requestAnimationFrame(this.onAnimationFrame),this.pollable.onPoll(e)}},fa=class{constructor(e){this.onInput=this.onInput.bind(this),this.onPoll=this.onPoll.bind(this),this.bindings=e}onPoll(e){for(let t of this.bindings.getInputs())t.onPoll(e)}onInput(e){let{device:t,code:n,event:i,value:r,movement:a,control:o,shift:l,alt:c}=e,h=this.bindings.getBindings(t,n);switch(i){case"pressed":for(let{input:d,index:u}of h)d.onUpdate(u,1,1);break;case"released":for(let{input:d,index:u}of h)d.onUpdate(u,0,-1);break;case"move":for(let{input:d,index:u}of h)d.onUpdate(u,r,a);break;case"wheel":for(let{input:d,index:u}of h)d.onUpdate(u,void 0,a);break}return h.length>0}},sr=class{constructor(e,t,n,i){this.device=e,this.code=t,this.input=n,this.index=i}},pa=class{constructor(){this.bindingMap={},this.inputMap=new Map}clear(){for(let e of this.inputMap.keys())e.onUnbind();this.inputMap.clear(),this.bindingMap={}}bind(e,t,n,i={inverted:!1}){let r,a=this.inputMap;if(a.has(e)){let l=a.get(e),c=e.size;e.onBind(c,i),r=new sr(t,n,e,c),l.push(r)}else{let l=[];a.set(e,l);let c=0;e.onBind(c,i),r=new sr(t,n,e,c),l.push(r)}let o=this.bindingMap;t in o?n in o[t]?o[t][n].push(r):o[t][n]=[r]:o[t]={[n]:[r]}}unbind(e){let t=this.inputMap;if(t.has(e)){let n=this.bindingMap,i=t.get(e);for(let r of i){let{device:a,code:o}=r,l=n[a][o],c=l.indexOf(r);l.splice(c,1)}i.length=0,e.onUnbind(),t.delete(e)}}isBound(e){return this.inputMap.has(e)}getInputs(){return this.inputMap.keys()}getBindingsByInput(e){return this.inputMap.get(e)}getBindings(e,t){let n=this.bindingMap;if(e in n){let i=n[e];if(t in i)return i[t]}return[]}},ma=class{constructor(e,t=void 0){this.inputs={},this.devices=[new ua("Mouse",e),new ha("Keyboard",e)],this.bindings=new pa,this.adapter=new fa(this.bindings),this.autopoller=new da(this.adapter),this.eventTarget=e,this.anyButton=new Ki(1),this.anyButtonDevice="",this.anyButtonCode="",this.anyAxis=new gi(1),this.anyAxisDevice="",this.anyAxisCode="",this.listeners={bind:[],unbind:[],focus:[],blur:[]},this.onInput=this.onInput.bind(this),this.onEventTargetBlur=this.onEventTargetBlur.bind(this),this.onEventTargetFocus=this.onEventTargetFocus.bind(this),e.addEventListener("focus",this.onEventTargetFocus),e.addEventListener("blur",this.onEventTargetBlur);for(let n of this.devices)n.addEventListener("input",this.onInput)}get autopoll(){return this.autopoller.running}set autopoll(e){this.toggleAutoPoll(e)}destroy(){let e=this.listeners;for(let n in e)e[n].length=0;this.autopoller.running&&this.autopoller.stop();for(let n of this.devices)n.removeEventListener("input",this.onInput),n.destroy();let t=this.eventTarget;t.removeEventListener("focus",this.onEventTargetFocus),t.removeEventListener("blur",this.onEventTargetBlur)}setEventTarget(e){let t=this.eventTarget;t.removeEventListener("focus",this.onEventTargetFocus),t.removeEventListener("blur",this.onEventTargetBlur),this.eventTarget=e;for(let n of this.devices)n.setEventTarget(e);e.addEventListener("focus",this.onEventTargetFocus),e.addEventListener("blur",this.onEventTargetBlur)}toggleAutoPoll(e=void 0){let t=this.autopoller.running,n=typeof e=="undefined"?!t:Boolean(e);n!==t&&(n?this.autopoller.start():this.autopoller.stop())}addEventListener(e,t){let n=this.listeners;e in n?n[e].push(t):n[e]=[t]}removeEventListener(e,t){let n=this.listeners;if(e in n){let i=n[e],r=i.indexOf(t);r>=0&&i.splice(r,1)}}dispatchEvent(e){let{type:t}=e,n=0;for(let i of this.listeners[t])n|=i(e)?1:0;return Boolean(n)}poll(e=performance.now()){if(this.autopoller.running)throw new Error("Should not manually poll() while autopolling.");this.onPoll(e)}onInput(e){let t=this.adapter.onInput(e);switch(e.event){case"pressed":this.anyButtonDevice=e.device,this.anyButtonCode=e.code,this.anyButton.onUpdate(0,1,1);break;case"released":this.anyButtonDevice=e.device,this.anyButtonCode=e.code,this.anyButton.onUpdate(0,0,-1);break;case"move":case"wheel":this.anyAxisDevice=e.device,this.anyAxisCode=e.code,this.anyAxis.onUpdate(0,e.value,e.movement);break}return t}onPoll(e){this.adapter.onPoll(e),this.anyButton.onPoll(e),this.anyAxis.onPoll(e)}onBind(){this.dispatchEvent({type:"bind"})}onUnbind(){this.dispatchEvent({type:"unbind"})}onEventTargetFocus(){this.dispatchEvent({type:"focus"})}onEventTargetBlur(){for(let e of this.bindings.getInputs())e.onStatus(0,0);this.anyButton.onStatus(0,0),this.anyAxis.onStatus(0,0),this.dispatchEvent({type:"blur"})}bindBindings(e){Array.isArray(e)||(e=Object.values(e));for(let t of e)t.bindTo(this)}bindBinding(e){e.bindTo(this)}bindButton(e,t,n,i=void 0){let r;this.hasButton(e)?r=this.getButton(e):(r=new Ki(1),this.inputs[e]=r),this.bindings.bind(r,t,n,i),this.onBind()}bindAxis(e,t,n,i=void 0){let r;this.hasAxis(e)?r=this.getAxis(e):(r=new gi(1),this.inputs[e]=r),this.bindings.bind(r,t,n,i),this.onBind()}bindAxisButtons(e,t,n,i){let r;this.hasAxis(e)?r=this.getAxis(e):(r=new gi(2),this.inputs[e]=r),this.bindings.bind(r,t,i),this.bindings.bind(r,t,n,{inverted:!0}),this.onBind()}unbindButton(e){if(this.hasButton(e)){let t=this.getButton(e);delete this.inputs[e],this.bindings.unbind(t),this.onUnbind()}}unbindAxis(e){if(this.hasAxis(e)){let t=this.getAxis(e);delete this.inputs[e],this.bindings.unbind(t),this.onUnbind()}}getInput(e){return this.inputs[e]}getButton(e){return this.inputs[e]}getAxis(e){return this.inputs[e]}hasButton(e){return e in this.inputs&&this.inputs[e]instanceof Ki}hasAxis(e){return e in this.inputs&&this.inputs[e]instanceof gi}isButtonDown(e){return this.inputs[e].down}isButtonPressed(e){return this.inputs[e].pressed}isButtonReleased(e){return this.inputs[e].released}getInputValue(e){return this.inputs[e].value}getButtonValue(e){return this.inputs[e].value}getAxisValue(e){return this.inputs[e].value}getAxisDelta(e){return this.inputs[e].delta}isAnyButtonDown(e=void 0){if(typeof e=="undefined")return this.anyButton.down;{let t=this.inputs;for(let n of e)if(t[n].down)return!0}return!1}isAnyButtonPressed(e=void 0){if(typeof e=="undefined")return this.anyButton.pressed;{let t=this.inputs;for(let n of e)if(t[n].pressed)return!0}return!1}isAnyButtonReleased(e=void 0){if(typeof e=="undefined")return this.anyButton.released;{let t=this.inputs;for(let n of e)if(t[n].released)return!0}return!1}getAnyAxisValue(e=void 0){if(typeof e=="undefined")return this.anyAxis.value;{let t=this.inputs;for(let n of e){let i=t[n];if(i.value)return i.value}}return 0}getAnyAxisDelta(e=void 0){if(typeof e=="undefined")return this.anyAxis.delta;{let t=this.inputs;for(let n of e){let i=t[n];if(i.delta)return i.delta}}return 0}getLastButtonDevice(){return this.anyButtonDevice}getLastButtonCode(){return this.anyButtonCode}getLastAxisDevice(){return this.anyAxisDevice}getLastAxisCode(){return this.anyAxisCode}getMouse(){return this.devices[0]}getKeyboard(){return this.devices[1]}},zn=class extends HTMLElement{static create(e={}){let{root:t=document.body,id:n=void 0,for:i=void 0,autopoll:r=!1}=e||{},a=new zn;return a.id=n,a.for=i,a.autopoll=r,t.appendChild(a),a}static get[Symbol.for("templateNode")](){let e=document.createElement("template");return e.innerHTML=nd,Object.defineProperty(this,Symbol.for("templateNode"),{value:e}),e}static get[Symbol.for("styleNode")](){let e=document.createElement("style");return e.innerHTML=id,Object.defineProperty(this,Symbol.for("styleNode"),{value:e}),e}static define(e=window.customElements){e.define("input-port",this)}static get observedAttributes(){return["autopoll","for"]}get autopoll(){return this._autopoll}set autopoll(e){this.toggleAttribute("autopoll",e)}get for(){return this._for}set for(e){this.setAttribute("for",e)}constructor(){super();let e=this.attachShadow({mode:"open"});e.appendChild(this.constructor[Symbol.for("templateNode")].content.cloneNode(!0)),e.appendChild(this.constructor[Symbol.for("styleNode")].cloneNode(!0)),this._titleElement=e.querySelector("#title"),this._pollElement=e.querySelector("#poll"),this._focusElement=e.querySelector("#focus"),this._bodyElement=e.querySelector("tbody"),this._outputElements={},this.onAnimationFrame=this.onAnimationFrame.bind(this),this.animationFrameHandle=null;let t=this;this._for="",this._eventTarget=t,this._autopoll=!1,this._context=null,this.onInputContextBind=this.onInputContextBind.bind(this),this.onInputContextUnbind=this.onInputContextUnbind.bind(this),this.onInputContextFocus=this.onInputContextFocus.bind(this),this.onInputContextBlur=this.onInputContextBlur.bind(this)}connectedCallback(){if(Object.prototype.hasOwnProperty.call(this,"for")){let e=this.for;delete this.for,this.for=e}if(Object.prototype.hasOwnProperty.call(this,"autopoll")){let e=this.autopoll;delete this.autopoll,this.autopoll=e}this.updateTable(),this.updateTableValues(),this.animationFrameHandle=window.requestAnimationFrame(this.onAnimationFrame)}disconnectedCallback(){let e=this._context;e&&(e.removeEventListener("bind",this.onInputContextBind),e.removeEventListener("unbind",this.onInputContextUnbind),e.removeEventListener("blur",this.onInputContextBlur),e.removeEventListener("focus",this.onInputContextFocus),e.destroy(),this._context=null)}attributeChangedCallback(e,t,n){switch(e){case"for":{this._for=n;let i,r;n?(i=document.getElementById(n),r=`${i.tagName.toLowerCase()}#${n}`):(i=this,r="input-port"),this._eventTarget=i,this._context&&this._context.setEventTarget(this._eventTarget),this._titleElement.innerHTML=`for ${r}`}break;case"autopoll":this._autopoll=n!==null,this._context&&this._context.toggleAutoPoll(this._autopoll);break}}onAnimationFrame(){this.animationFrameHandle=window.requestAnimationFrame(this.onAnimationFrame),this.updateTableValues(),this.updatePollStatus()}onInputContextBind(){return this.updateTable(),!0}onInputContextUnbind(){return this.updateTable(),!0}onInputContextFocus(){return this._focusElement.innerHTML="\u2713",!0}onInputContextBlur(){return this._focusElement.innerHTML="",!0}getContext(e="axisbutton",t=void 0){switch(e){case"axisbutton":if(!this._context){let n=new ma(this._eventTarget,t);n.addEventListener("bind",this.onInputContextBind),n.addEventListener("unbind",this.onInputContextUnbind),n.addEventListener("blur",this.onInputContextBlur),n.addEventListener("focus",this.onInputContextFocus),this._autopoll&&n.toggleAutoPoll(!0),this._context=n}return this._context;default:throw new Error(`Input context id '${e}' is not supported.`)}}updateTable(){if(this.isConnected)if(this._context){let e=this._context,t=e.inputs,n=e.bindings,i={},r=[];for(let a of Object.keys(t)){let o=t[a],l=!0;for(let c of n.getBindingsByInput(o)){let h=sd(`${o.constructor.name}.${a}`,`${c.device}.${c.code}`,0,l);r.push(h),l&&(i[a]=h.querySelector("output"),l=!1)}}this._outputElements=i,this._bodyElement.innerHTML="";for(let a of r)this._bodyElement.appendChild(a)}else{this._outputElements={},this._bodyElement.innerHTML="";return}else return}updateTableValues(){if(this.isConnected)if(this._context){let t=this._context.inputs;for(let n of Object.keys(this._outputElements)){let i=this._outputElements[n],r=t[n].value;i.innerText=Number(r).toFixed(2)}}else{for(let e of Object.keys(this._outputElements)){let t=this._outputElements[e];t.innerText="---"}return}else return}updatePollStatus(){if(this.isConnected)if(this._context){let t=this._context.inputs;for(let n of Object.values(t))if(!n.polling){this._pollElement.innerHTML="";return}this._pollElement.innerHTML="\u2713"}else{this._pollElement.innerHTML="-";return}else return}};zn.define();function sd(s,e,t,n=!0){let i=document.createElement("tr");n&&i.classList.add("primary");{let r=document.createElement("td");r.textContent=s,r.classList.add("name"),i.appendChild(r)}{let r=document.createElement("td"),a=document.createElement("output");n?a.innerText=Number(t).toFixed(2):a.innerText="---",a.classList.add("value"),r.appendChild(a),i.appendChild(r)}{let r=document.createElement("td");r.classList.add("key");let a=new ir;a.innerText=e,r.appendChild(a),i.appendChild(r)}return i}var J_=Symbol("keyboardSource");var j_=Symbol("mouseSource");var Zi=1e-6,xi=typeof Float32Array!="undefined"?Float32Array:Array,rr=Math.random;var ex=Math.PI/180;Math.hypot||(Math.hypot=function(){for(var s=0,e=arguments.length;e--;)s+=arguments[e]*arguments[e];return Math.sqrt(s)});var Ji={};go(Ji,{add:()=>cd,angle:()=>Pd,bezier:()=>wd,ceil:()=>hd,clone:()=>rd,copy:()=>ad,create:()=>ga,cross:()=>vd,dist:()=>Ud,distance:()=>ba,div:()=>zd,divide:()=>va,dot:()=>Sa,equals:()=>Od,exactEquals:()=>Nd,floor:()=>ud,forEach:()=>Gd,fromValues:()=>od,hermite:()=>Md,inverse:()=>xd,len:()=>Hd,length:()=>_a,lerp:()=>bd,max:()=>fd,min:()=>dd,mul:()=>Bd,multiply:()=>ya,negate:()=>_d,normalize:()=>yd,random:()=>Sd,rotateX:()=>Cd,rotateY:()=>Rd,rotateZ:()=>Ld,round:()=>pd,scale:()=>md,scaleAndAdd:()=>gd,set:()=>ld,sqrDist:()=>kd,sqrLen:()=>Vd,squaredDistance:()=>Ma,squaredLength:()=>wa,str:()=>Dd,sub:()=>Fd,subtract:()=>xa,transformMat3:()=>Ed,transformMat4:()=>Ad,transformQuat:()=>Td,zero:()=>Id});function ga(){var s=new xi(3);return xi!=Float32Array&&(s[0]=0,s[1]=0,s[2]=0),s}function rd(s){var e=new xi(3);return e[0]=s[0],e[1]=s[1],e[2]=s[2],e}function _a(s){var e=s[0],t=s[1],n=s[2];return Math.hypot(e,t,n)}function od(s,e,t){var n=new xi(3);return n[0]=s,n[1]=e,n[2]=t,n}function ad(s,e){return s[0]=e[0],s[1]=e[1],s[2]=e[2],s}function ld(s,e,t,n){return s[0]=e,s[1]=t,s[2]=n,s}function cd(s,e,t){return s[0]=e[0]+t[0],s[1]=e[1]+t[1],s[2]=e[2]+t[2],s}function xa(s,e,t){return s[0]=e[0]-t[0],s[1]=e[1]-t[1],s[2]=e[2]-t[2],s}function ya(s,e,t){return s[0]=e[0]*t[0],s[1]=e[1]*t[1],s[2]=e[2]*t[2],s}function va(s,e,t){return s[0]=e[0]/t[0],s[1]=e[1]/t[1],s[2]=e[2]/t[2],s}function hd(s,e){return s[0]=Math.ceil(e[0]),s[1]=Math.ceil(e[1]),s[2]=Math.ceil(e[2]),s}function ud(s,e){return s[0]=Math.floor(e[0]),s[1]=Math.floor(e[1]),s[2]=Math.floor(e[2]),s}function dd(s,e,t){return s[0]=Math.min(e[0],t[0]),s[1]=Math.min(e[1],t[1]),s[2]=Math.min(e[2],t[2]),s}function fd(s,e,t){return s[0]=Math.max(e[0],t[0]),s[1]=Math.max(e[1],t[1]),s[2]=Math.max(e[2],t[2]),s}function pd(s,e){return s[0]=Math.round(e[0]),s[1]=Math.round(e[1]),s[2]=Math.round(e[2]),s}function md(s,e,t){return s[0]=e[0]*t,s[1]=e[1]*t,s[2]=e[2]*t,s}function gd(s,e,t,n){return s[0]=e[0]+t[0]*n,s[1]=e[1]+t[1]*n,s[2]=e[2]+t[2]*n,s}function ba(s,e){var t=e[0]-s[0],n=e[1]-s[1],i=e[2]-s[2];return Math.hypot(t,n,i)}function Ma(s,e){var t=e[0]-s[0],n=e[1]-s[1],i=e[2]-s[2];return t*t+n*n+i*i}function wa(s){var e=s[0],t=s[1],n=s[2];return e*e+t*t+n*n}function _d(s,e){return s[0]=-e[0],s[1]=-e[1],s[2]=-e[2],s}function xd(s,e){return s[0]=1/e[0],s[1]=1/e[1],s[2]=1/e[2],s}function yd(s,e){var t=e[0],n=e[1],i=e[2],r=t*t+n*n+i*i;return r>0&&(r=1/Math.sqrt(r)),s[0]=e[0]*r,s[1]=e[1]*r,s[2]=e[2]*r,s}function Sa(s,e){return s[0]*e[0]+s[1]*e[1]+s[2]*e[2]}function vd(s,e,t){var n=e[0],i=e[1],r=e[2],a=t[0],o=t[1],l=t[2];return s[0]=i*l-r*o,s[1]=r*a-n*l,s[2]=n*o-i*a,s}function bd(s,e,t,n){var i=e[0],r=e[1],a=e[2];return s[0]=i+n*(t[0]-i),s[1]=r+n*(t[1]-r),s[2]=a+n*(t[2]-a),s}function Md(s,e,t,n,i,r){var a=r*r,o=a*(2*r-3)+1,l=a*(r-2)+r,c=a*(r-1),h=a*(3-2*r);return s[0]=e[0]*o+t[0]*l+n[0]*c+i[0]*h,s[1]=e[1]*o+t[1]*l+n[1]*c+i[1]*h,s[2]=e[2]*o+t[2]*l+n[2]*c+i[2]*h,s}function wd(s,e,t,n,i,r){var a=1-r,o=a*a,l=r*r,c=o*a,h=3*r*o,d=3*l*a,u=l*r;return s[0]=e[0]*c+t[0]*h+n[0]*d+i[0]*u,s[1]=e[1]*c+t[1]*h+n[1]*d+i[1]*u,s[2]=e[2]*c+t[2]*h+n[2]*d+i[2]*u,s}function Sd(s,e){e=e||1;var t=rr()*2*Math.PI,n=rr()*2-1,i=Math.sqrt(1-n*n)*e;return s[0]=Math.cos(t)*i,s[1]=Math.sin(t)*i,s[2]=n*e,s}function Ad(s,e,t){var n=e[0],i=e[1],r=e[2],a=t[3]*n+t[7]*i+t[11]*r+t[15];return a=a||1,s[0]=(t[0]*n+t[4]*i+t[8]*r+t[12])/a,s[1]=(t[1]*n+t[5]*i+t[9]*r+t[13])/a,s[2]=(t[2]*n+t[6]*i+t[10]*r+t[14])/a,s}function Ed(s,e,t){var n=e[0],i=e[1],r=e[2];return s[0]=n*t[0]+i*t[3]+r*t[6],s[1]=n*t[1]+i*t[4]+r*t[7],s[2]=n*t[2]+i*t[5]+r*t[8],s}function Td(s,e,t){var n=t[0],i=t[1],r=t[2],a=t[3],o=e[0],l=e[1],c=e[2],h=i*c-r*l,d=r*o-n*c,u=n*l-i*o,m=i*u-r*d,_=r*h-n*u,f=n*d-i*h,p=a*2;return h*=p,d*=p,u*=p,m*=2,_*=2,f*=2,s[0]=o+h+m,s[1]=l+d+_,s[2]=c+u+f,s}function Cd(s,e,t,n){var i=[],r=[];return i[0]=e[0]-t[0],i[1]=e[1]-t[1],i[2]=e[2]-t[2],r[0]=i[0],r[1]=i[1]*Math.cos(n)-i[2]*Math.sin(n),r[2]=i[1]*Math.sin(n)+i[2]*Math.cos(n),s[0]=r[0]+t[0],s[1]=r[1]+t[1],s[2]=r[2]+t[2],s}function Rd(s,e,t,n){var i=[],r=[];return i[0]=e[0]-t[0],i[1]=e[1]-t[1],i[2]=e[2]-t[2],r[0]=i[2]*Math.sin(n)+i[0]*Math.cos(n),r[1]=i[1],r[2]=i[2]*Math.cos(n)-i[0]*Math.sin(n),s[0]=r[0]+t[0],s[1]=r[1]+t[1],s[2]=r[2]+t[2],s}function Ld(s,e,t,n){var i=[],r=[];return i[0]=e[0]-t[0],i[1]=e[1]-t[1],i[2]=e[2]-t[2],r[0]=i[0]*Math.cos(n)-i[1]*Math.sin(n),r[1]=i[0]*Math.sin(n)+i[1]*Math.cos(n),r[2]=i[2],s[0]=r[0]+t[0],s[1]=r[1]+t[1],s[2]=r[2]+t[2],s}function Pd(s,e){var t=s[0],n=s[1],i=s[2],r=e[0],a=e[1],o=e[2],l=Math.sqrt(t*t+n*n+i*i),c=Math.sqrt(r*r+a*a+o*o),h=l*c,d=h&&Sa(s,e)/h;return Math.acos(Math.min(Math.max(d,-1),1))}function Id(s){return s[0]=0,s[1]=0,s[2]=0,s}function Dd(s){return"vec3("+s[0]+", "+s[1]+", "+s[2]+")"}function Nd(s,e){return s[0]===e[0]&&s[1]===e[1]&&s[2]===e[2]}function Od(s,e){var t=s[0],n=s[1],i=s[2],r=e[0],a=e[1],o=e[2];return Math.abs(t-r)<=Zi*Math.max(1,Math.abs(t),Math.abs(r))&&Math.abs(n-a)<=Zi*Math.max(1,Math.abs(n),Math.abs(a))&&Math.abs(i-o)<=Zi*Math.max(1,Math.abs(i),Math.abs(o))}var Fd=xa,Bd=ya,zd=va,Ud=ba,kd=Ma,Hd=_a,Vd=wa,Gd=function(){var s=ga();return function(e,t,n,i,r,a){var o,l;for(t||(t=3),n||(n=0),i?l=Math.min(i*t+n,e.length):l=e.length,o=n;o<l;o+=t)s[0]=e[o],s[1]=e[o+1],s[2]=e[o+2],r(s,s,a),e[o]=s[0],e[o+1]=s[1],e[o+2]=s[2];return e}}();var lx=Ji.fromValues(0,1,0);var cx=Math.PI/3;var hx=Math.PI/180;var ji=class{constructor(e,t=()=>null,n=()=>{}){this.name=e,this.new=t,this.delete=n}},Aa=class{constructor(){this.cachedResults={},this.keyQueryMapping={},this.onEntityComponentChanged=this.onEntityComponentChanged.bind(this)}onEntityComponentChanged(e,t,n,i,r){for(let a of Object.values(this.keyQueryMapping)){let o=this.cachedResults[a.key];if(r){let l=o.indexOf(t);l>=0&&o.splice(l,1)}else if(n)if(a.hasSelector(Ea(n))){let l=o.indexOf(t);l>=0&&o.splice(l,1)}else a.hasSelector(n)&&a.test(e,t)&&o.indexOf(t)<0&&o.push(t);else if(i){if(a.hasSelector(Ea(i))&&a.test(e,t))o.indexOf(t)<0&&o.push(t);else if(a.hasSelector(i)&&a.test(e,t)){let l=o.indexOf(t);l>=0&&o.splice(l,1)}}}}findAny(e,t){let n=this.findAll(e,t);return n.length<=0?null:n[Math.floor(Math.random()*n.length)]}findAll(e,t){let n=t.key,i;return n in this.keyQueryMapping?i=this.cachedResults[n]:(i=[],this.keyQueryMapping[n]=t,this.cachedResults[n]=i,t.hydrate(e,i)),i}count(e,t){return this.findAll(e,t).length}clear(e){let t=e.key;t in this.keyQueryMapping&&(delete this.keyQueryMapping[t],delete this.cachedResults[t])}reset(){this.keyQueryMapping={},this.cachedResults={}}};function Ea(s){return{type:"not",name:s.name,value:s}}function yi(s){return"type"in s&&s.type==="not"}var or=class{constructor(){this.components={},this.nameClassMapping={},this.nextAvailableEntityId=1,this.queue=[],this.queries=new Aa}entityComponentChangedCallback(e,t,n,i){this.queries.onEntityComponentChanged(this,e,t,n,i)}flush(){for(;this.queue.length>0;){let[e,...t]=this.queue.shift();switch(e){case"attach":{let[n,i,r]=t;this.attachImmediately(n,i,r)}break;case"detach":{let[n,i]=t;this.detachImmediately(n,i)}break;case"clear":{let[n]=t;this.clearImmediately(n)}break}}}create(){return this.nextAvailableEntityId++}destroy(e){let t=this.components;for(let n of Object.keys(t)){let i=t[n];e in i&&(delete i[e],this.entityComponentChangedCallback(e,null,this.nameClassMapping[n],!1))}this.entityComponentChangedCallback(e,null,null,!0)}exists(e,...t){if(t.length>0){for(let n of t){let i=this.mapOf(n);if(!(e in i))return!1}return!0}else for(let n of Object.values(this.components))if(e in n)return!0;return!1}attach(e,t,n=void 0){return typeof n=="undefined"&&(n=t.new()),this.queue.push(["attach",e,t,n]),n}attachImmediately(e,t,n=void 0){typeof n=="undefined"&&(n=t.new());let i=this.mapOf(t);return i[e]=n,this.entityComponentChangedCallback(e,t,null,!1),n}detach(e,t){this.queue.push(["detach",e,t])}detachImmediately(e,t){let n=this.mapOf(t),i=n[e];delete n[e],t.delete(i),this.entityComponentChangedCallback(e,null,t,!1)}clear(e){this.queue.push(["clear",e])}clearImmediately(e){let t=e.name,n=this.components,i=n[t],r=Object.keys(i).map(Number),a=Object.values(i);n[t]={},this.nameClassMapping[t]=e;for(let o of a)e.delete(o);for(let o of r)this.entityComponentChangedCallback(o,null,e,!1)}get(e,t){return this.mapOf(t)[e]||null}count(e){return Object.keys(this.mapOf(e)).length}keysOf(e){return Object.keys(this.mapOf(e)).map(Number)}valuesOf(e){return Object.values(this.mapOf(e))}mapOf(e){let t=e.name,n=this.components;if(t in n)return n[t];{let i={};return n[t]=i,this.nameClassMapping[t]=e,i}}entityIds(){let e=new Set;for(let t of Object.values(this.components))for(let n of Object.keys(t))e.add(n);return e}componentClasses(){return Object.values(this.nameClassMapping)}reset(){let e=this.components,t=new Set;for(let n of Object.keys(e)){let i=this.nameClassMapping[n],r=e[n];for(let a of Object.keys(r))t.add(Number(a));this.clearImmediately(i)}for(let n of t)this.entityComponentChangedCallback(n,null,null,!0);t.clear(),this.queries.reset(),this.components={},this.nextAvailableEntityId=1,this.queue.length=0}};var ar=class{constructor(...e){this.selectors=e,this.key=e.map(t=>yi(t)?`!${t.name}`:t.name).sort().join("&")}hasSelector(e){return yi(e)?this.selectors.findIndex(t=>yi(t)&&t.name===e.name)>=0:this.selectors.findIndex(t=>t.name===e.name)>=0}test(e,t){for(let n of this.selectors)if(yi(n)){let i=n.value;if(e.exists(t,i))return!1}else{let i=n;if(!e.exists(t,i))return!1}return!0}hydrate(e,t){if(this.selectors.length<=0)return t.length=0,t;let n=e.entityIds();for(let i of n)this.test(e,i)&&t.push(i);return t}count(e){return e.queryManager.count(e,this)}findAny(e){let t=e.queryManager,n=new Array(this.selectors.length+1),i=t.findAny(e,this);return i===null?n.fill(void 0):(Ta(n,e,i,this.selectors),n)}*findAll(e){let t=e.queryManager,n=new Array(this.selectors.length+1),i=t.findAll(e,this);for(let r of i)Ta(n,e,r,this.selectors),yield n}};function Ta(s,e,t,n){s[0]=t;let i=1;for(let r of n)yi(r)?s[i]=null:s[i]=e.get(t,r),++i;return s}var lr=class{constructor(e,t=void 0){let{animationFrameHandler:n=window}=t||{};this.handle=0,this.detail={prevTime:-1,currentTime:-1,deltaTime:0},this.animationFrameHandler=n,this.callback=e,this.next=this.next.bind(this),this.start=this.start.bind(this),this.cancel=this.cancel.bind(this)}next(e=performance.now()){this.handle=this.animationFrameHandler.requestAnimationFrame(this.next);let t=this.detail;t.prevTime=t.currentTime,t.currentTime=e,t.deltaTime=t.currentTime-t.prevTime,this.callback(this)}start(){return this.handle=this.animationFrameHandler.requestAnimationFrame(this.next),this}cancel(){return this.animationFrameHandler.cancelAnimationFrame(this.handle),this}};var cr="149";var Wd=0,Ca=1,qd=2;var Ra=1,Xd=2,vi=3,Qt=0,vt=1,en=2;var tn=0,Un=1,La=2,Pa=3,Ia=4,Yd=5,kn=100,$d=101,Kd=102,Da=103,Na=104,Zd=200,Jd=201,jd=202,Qd=203,Oa=204,Fa=205,ef=206,tf=207,nf=208,sf=209,rf=210,of=0,af=1,lf=2,hr=3,cf=4,hf=5,uf=6,df=7,Ba=0,ff=1,pf=2,Xt=0,mf=1,gf=2,_f=3,xf=4,yf=5,za=300,Hn=301,Vn=302,ur=303,dr=304,Qi=306,fr=1e3,Pt=1001,pr=1002,ct=1003,Ua=1004;var mr=1005;var Et=1006,vf=1007;var bi=1008;var bn=1009,bf=1010,Mf=1011,ka=1012,wf=1013,Mn=1014,wn=1015,Mi=1016,Sf=1017,Af=1018,Gn=1020,Ef=1021,It=1023,Tf=1024,Cf=1025,Sn=1026,Wn=1027,Rf=1028,Lf=1029,Pf=1030,If=1031,Df=1033,gr=33776,_r=33777,xr=33778,yr=33779,Ha=35840,Va=35841,Ga=35842,Wa=35843,Nf=36196,qa=37492,Xa=37496,Ya=37808,$a=37809,Ka=37810,Za=37811,Ja=37812,ja=37813,Qa=37814,el=37815,tl=37816,nl=37817,il=37818,sl=37819,rl=37820,ol=37821,vr=36492,Of=36283,al=36284,ll=36285,cl=36286;var es=2300,ts=2301,br=2302,hl=2400,ul=2401,dl=2402;var An=3e3,ke=3001,Ff=3200,Bf=3201,zf=0,Uf=1;var zt="srgb",wi="srgb-linear";var Mr=7680;var kf=519,fl=35044;var pl="300 es",wr=1035,En=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;let n=this._listeners;return n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;let i=this._listeners[e];if(i!==void 0){let r=i.indexOf(t);r!==-1&&i.splice(r,1)}}dispatchEvent(e){if(this._listeners===void 0)return;let n=this._listeners[e.type];if(n!==void 0){e.target=this;let i=n.slice(0);for(let r=0,a=i.length;r<a;r++)i[r].call(this,e);e.target=null}}},at=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];var Sr=Math.PI/180,ml=180/Math.PI;function Si(){let s=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(at[s&255]+at[s>>8&255]+at[s>>16&255]+at[s>>24&255]+"-"+at[e&255]+at[e>>8&255]+"-"+at[e>>16&15|64]+at[e>>24&255]+"-"+at[t&63|128]+at[t>>8&255]+"-"+at[t>>16&255]+at[t>>24&255]+at[n&255]+at[n>>8&255]+at[n>>16&255]+at[n>>24&255]).toLowerCase()}function bt(s,e,t){return Math.max(e,Math.min(t,s))}function Hf(s,e){return(s%e+e)%e}function Ar(s,e,t){return(1-t)*s+t*e}function gl(s){return(s&s-1)==0&&s!==0}function Er(s){return Math.pow(2,Math.floor(Math.log(s)/Math.LN2))}function ns(s,e){switch(e.constructor){case Float32Array:return s;case Uint16Array:return s/65535;case Uint8Array:return s/255;case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("Invalid component type.")}}function Mt(s,e){switch(e.constructor){case Float32Array:return s;case Uint16Array:return Math.round(s*65535);case Uint8Array:return Math.round(s*255);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("Invalid component type.")}}var Ue=class{constructor(e=0,t=0){Ue.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6],this.y=i[1]*t+i[4]*n+i[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=this.x<0?Math.ceil(this.x):Math.floor(this.x),this.y=this.y<0?Math.ceil(this.y):Math.floor(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),i=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*n-a*i+e.x,this.y=r*i+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},ft=class{constructor(){ft.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1]}set(e,t,n,i,r,a,o,l,c){let h=this.elements;return h[0]=e,h[1]=i,h[2]=o,h[3]=t,h[4]=r,h[5]=l,h[6]=n,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,i=t.elements,r=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],h=n[4],d=n[7],u=n[2],m=n[5],_=n[8],f=i[0],p=i[3],b=i[6],E=i[1],y=i[4],M=i[7],T=i[2],P=i[5],N=i[8];return r[0]=a*f+o*E+l*T,r[3]=a*p+o*y+l*P,r[6]=a*b+o*M+l*N,r[1]=c*f+h*E+d*T,r[4]=c*p+h*y+d*P,r[7]=c*b+h*M+d*N,r[2]=u*f+m*E+_*T,r[5]=u*p+m*y+_*P,r[8]=u*b+m*M+_*N,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8];return t*a*h-t*o*c-n*r*h+n*o*l+i*r*c-i*a*l}invert(){let e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],d=h*a-o*c,u=o*l-h*r,m=c*r-a*l,_=t*d+n*u+i*m;if(_===0)return this.set(0,0,0,0,0,0,0,0,0);let f=1/_;return e[0]=d*f,e[1]=(i*c-h*n)*f,e[2]=(o*n-i*a)*f,e[3]=u*f,e[4]=(h*t-i*l)*f,e[5]=(i*r-o*t)*f,e[6]=m*f,e[7]=(n*l-c*t)*f,e[8]=(a*t-n*r)*f,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,i,r,a,o){let l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*a+c*o)+a+e,-i*c,i*l,-i*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(Tr.makeScale(e,t)),this}rotate(e){return this.premultiply(Tr.makeRotation(-e)),this}translate(e,t){return this.premultiply(Tr.makeTranslation(e,t)),this}makeTranslation(e,t){return this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let i=0;i<9;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},Tr=new ft;function _l(s){for(let e=s.length-1;e>=0;--e)if(s[e]>=65535)return!0;return!1}function is(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function Tn(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function ss(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}var Cr={[zt]:{[wi]:Tn},[wi]:{[zt]:ss}},ht={legacyMode:!0,get workingColorSpace(){return wi},set workingColorSpace(s){console.warn("THREE.ColorManagement: .workingColorSpace is readonly.")},convert:function(s,e,t){if(this.legacyMode||e===t||!e||!t)return s;if(Cr[e]&&Cr[e][t]!==void 0){let n=Cr[e][t];return s.r=n(s.r),s.g=n(s.g),s.b=n(s.b),s}throw new Error("Unsupported color space conversion.")},fromWorkingColorSpace:function(s,e){return this.convert(s,this.workingColorSpace,e)},toWorkingColorSpace:function(s,e){return this.convert(s,e,this.workingColorSpace)}},xl={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Ze={r:0,g:0,b:0},Dt={h:0,s:0,l:0},rs={h:0,s:0,l:0};function Rr(s,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?s+(e-s)*6*t:t<1/2?e:t<2/3?s+(e-s)*6*(2/3-t):s}function os(s,e){return e.r=s.r,e.g=s.g,e.b=s.b,e}var Ge=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,t===void 0&&n===void 0?this.set(e):this.setRGB(e,t,n)}set(e){return e&&e.isColor?this.copy(e):typeof e=="number"?this.setHex(e):typeof e=="string"&&this.setStyle(e),this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=zt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,ht.toWorkingColorSpace(this,t),this}setRGB(e,t,n,i=ht.workingColorSpace){return this.r=e,this.g=t,this.b=n,ht.toWorkingColorSpace(this,i),this}setHSL(e,t,n,i=ht.workingColorSpace){if(e=Hf(e,1),t=bt(t,0,1),n=bt(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,a=2*n-r;this.r=Rr(a,r,e+1/3),this.g=Rr(a,r,e),this.b=Rr(a,r,e-1/3)}return ht.toWorkingColorSpace(this,i),this}setStyle(e,t=zt){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let i;if(i=/^((?:rgb|hsl)a?)\(([^\)]*)\)/.exec(e)){let r,a=i[1],o=i[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return this.r=Math.min(255,parseInt(r[1],10))/255,this.g=Math.min(255,parseInt(r[2],10))/255,this.b=Math.min(255,parseInt(r[3],10))/255,ht.toWorkingColorSpace(this,t),n(r[4]),this;if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return this.r=Math.min(100,parseInt(r[1],10))/100,this.g=Math.min(100,parseInt(r[2],10))/100,this.b=Math.min(100,parseInt(r[3],10))/100,ht.toWorkingColorSpace(this,t),n(r[4]),this;break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o)){let l=parseFloat(r[1])/360,c=parseFloat(r[2])/100,h=parseFloat(r[3])/100;return n(r[4]),this.setHSL(l,c,h,t)}break}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(e)){let r=i[1],a=r.length;if(a===3)return this.r=parseInt(r.charAt(0)+r.charAt(0),16)/255,this.g=parseInt(r.charAt(1)+r.charAt(1),16)/255,this.b=parseInt(r.charAt(2)+r.charAt(2),16)/255,ht.toWorkingColorSpace(this,t),this;if(a===6)return this.r=parseInt(r.charAt(0)+r.charAt(1),16)/255,this.g=parseInt(r.charAt(2)+r.charAt(3),16)/255,this.b=parseInt(r.charAt(4)+r.charAt(5),16)/255,ht.toWorkingColorSpace(this,t),this}return e&&e.length>0?this.setColorName(e,t):this}setColorName(e,t=zt){let n=xl[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Tn(e.r),this.g=Tn(e.g),this.b=Tn(e.b),this}copyLinearToSRGB(e){return this.r=ss(e.r),this.g=ss(e.g),this.b=ss(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=zt){return ht.fromWorkingColorSpace(os(this,Ze),e),bt(Ze.r*255,0,255)<<16^bt(Ze.g*255,0,255)<<8^bt(Ze.b*255,0,255)<<0}getHexString(e=zt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=ht.workingColorSpace){ht.fromWorkingColorSpace(os(this,Ze),t);let n=Ze.r,i=Ze.g,r=Ze.b,a=Math.max(n,i,r),o=Math.min(n,i,r),l,c,h=(o+a)/2;if(o===a)l=0,c=0;else{let d=a-o;switch(c=h<=.5?d/(a+o):d/(2-a-o),a){case n:l=(i-r)/d+(i<r?6:0);break;case i:l=(r-n)/d+2;break;case r:l=(n-i)/d+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=ht.workingColorSpace){return ht.fromWorkingColorSpace(os(this,Ze),t),e.r=Ze.r,e.g=Ze.g,e.b=Ze.b,e}getStyle(e=zt){return ht.fromWorkingColorSpace(os(this,Ze),e),e!==zt?`color(${e} ${Ze.r} ${Ze.g} ${Ze.b})`:`rgb(${Ze.r*255|0},${Ze.g*255|0},${Ze.b*255|0})`}offsetHSL(e,t,n){return this.getHSL(Dt),Dt.h+=e,Dt.s+=t,Dt.l+=n,this.setHSL(Dt.h,Dt.s,Dt.l),this}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Dt),e.getHSL(rs);let n=Ar(Dt.h,rs.h,t),i=Ar(Dt.s,rs.s,t),r=Ar(Dt.l,rs.l,t);return this.setHSL(n,i,r),this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}};Ge.NAMES=xl;var qn,Lr=class{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement=="undefined")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{qn===void 0&&(qn=is("canvas")),qn.width=e.width,qn.height=e.height;let n=qn.getContext("2d");e instanceof ImageData?n.putImageData(e,0,0):n.drawImage(e,0,0,e.width,e.height),t=qn}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement!="undefined"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement!="undefined"&&e instanceof HTMLCanvasElement||typeof ImageBitmap!="undefined"&&e instanceof ImageBitmap){let t=is("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let i=n.getImageData(0,0,e.width,e.height),r=i.data;for(let a=0;a<r.length;a++)r[a]=Tn(r[a]/255)*255;return n.putImageData(i,0,0),t}else if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(Tn(t[n]/255)*255):t[n]=Tn(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},Pr=class{constructor(e=null){this.isSource=!0,this.uuid=Si(),this.data=e,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let r;if(Array.isArray(i)){r=[];for(let a=0,o=i.length;a<o;a++)i[a].isDataTexture?r.push(Ir(i[a].image)):r.push(Ir(i[a]))}else r=Ir(i);n.url=r}return t||(e.images[this.uuid]=n),n}};function Ir(s){return typeof HTMLImageElement!="undefined"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement!="undefined"&&s instanceof HTMLCanvasElement||typeof ImageBitmap!="undefined"&&s instanceof ImageBitmap?Lr.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var Vf=0,pt=class extends En{constructor(e=pt.DEFAULT_IMAGE,t=pt.DEFAULT_MAPPING,n=Pt,i=Pt,r=Et,a=bi,o=It,l=bn,c=pt.DEFAULT_ANISOTROPY,h=An){super();this.isTexture=!0,Object.defineProperty(this,"id",{value:Vf++}),this.uuid=Si(),this.name="",this.source=new Pr(e),this.mipmaps=[],this.mapping=t,this.wrapS=n,this.wrapT=i,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new Ue(0,0),this.repeat=new Ue(1,1),this.center=new Ue(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new ft,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.encoding=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.encoding=e.encoding,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.5,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,type:this.type,encoding:this.encoding,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==za)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case fr:e.x=e.x-Math.floor(e.x);break;case Pt:e.x=e.x<0?0:1;break;case pr:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case fr:e.y=e.y-Math.floor(e.y);break;case Pt:e.y=e.y<0?0:1;break;case pr:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}};pt.DEFAULT_IMAGE=null;pt.DEFAULT_MAPPING=za;pt.DEFAULT_ANISOTROPY=1;var nt=class{constructor(e=0,t=0,n=0,i=1){nt.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=i}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,i){return this.x=e,this.y=t,this.z=n,this.w=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,i=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*i+a[12]*r,this.y=a[1]*t+a[5]*n+a[9]*i+a[13]*r,this.z=a[2]*t+a[6]*n+a[10]*i+a[14]*r,this.w=a[3]*t+a[7]*n+a[11]*i+a[15]*r,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,i,r,a=.01,o=.1,l=e.elements,c=l[0],h=l[4],d=l[8],u=l[1],m=l[5],_=l[9],f=l[2],p=l[6],b=l[10];if(Math.abs(h-u)<a&&Math.abs(d-f)<a&&Math.abs(_-p)<a){if(Math.abs(h+u)<o&&Math.abs(d+f)<o&&Math.abs(_+p)<o&&Math.abs(c+m+b-3)<o)return this.set(1,0,0,0),this;t=Math.PI;let y=(c+1)/2,M=(m+1)/2,T=(b+1)/2,P=(h+u)/4,N=(d+f)/4,g=(_+p)/4;return y>M&&y>T?y<a?(n=0,i=.707106781,r=.707106781):(n=Math.sqrt(y),i=P/n,r=N/n):M>T?M<a?(n=.707106781,i=0,r=.707106781):(i=Math.sqrt(M),n=P/i,r=g/i):T<a?(n=.707106781,i=.707106781,r=0):(r=Math.sqrt(T),n=N/r,i=g/r),this.set(n,i,r,t),this}let E=Math.sqrt((p-_)*(p-_)+(d-f)*(d-f)+(u-h)*(u-h));return Math.abs(E)<.001&&(E=1),this.x=(p-_)/E,this.y=(d-f)/E,this.z=(u-h)/E,this.w=Math.acos((c+m+b-1)/2),this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=this.x<0?Math.ceil(this.x):Math.floor(this.x),this.y=this.y<0?Math.ceil(this.y):Math.floor(this.y),this.z=this.z<0?Math.ceil(this.z):Math.floor(this.z),this.w=this.w<0?Math.ceil(this.w):Math.floor(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},nn=class extends En{constructor(e=1,t=1,n={}){super();this.isWebGLRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new nt(0,0,e,t),this.scissorTest=!1,this.viewport=new nt(0,0,e,t);let i={width:e,height:t,depth:1};this.texture=new pt(i,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.encoding),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=n.generateMipmaps!==void 0?n.generateMipmaps:!1,this.texture.internalFormat=n.internalFormat!==void 0?n.internalFormat:null,this.texture.minFilter=n.minFilter!==void 0?n.minFilter:Et,this.depthBuffer=n.depthBuffer!==void 0?n.depthBuffer:!0,this.stencilBuffer=n.stencilBuffer!==void 0?n.stencilBuffer:!1,this.depthTexture=n.depthTexture!==void 0?n.depthTexture:null,this.samples=n.samples!==void 0?n.samples:0}setSize(e,t,n=1){(this.width!==e||this.height!==t||this.depth!==n)&&(this.width=e,this.height=t,this.depth=n,this.texture.image.width=e,this.texture.image.height=t,this.texture.image.depth=n,this.dispose()),this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.viewport.copy(e.viewport),this.texture=e.texture.clone(),this.texture.isRenderTargetTexture=!0;let t=Object.assign({},e.texture.image);return this.texture.source=new Pr(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},Dr=class extends pt{constructor(e=null,t=1,n=1,i=1){super(null);this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=ct,this.minFilter=ct,this.wrapR=Pt,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var yl=class extends pt{constructor(e=null,t=1,n=1,i=1){super(null);this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=ct,this.minFilter=ct,this.wrapR=Pt,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Cn=class{constructor(e=0,t=0,n=0,i=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=i}static slerpFlat(e,t,n,i,r,a,o){let l=n[i+0],c=n[i+1],h=n[i+2],d=n[i+3],u=r[a+0],m=r[a+1],_=r[a+2],f=r[a+3];if(o===0){e[t+0]=l,e[t+1]=c,e[t+2]=h,e[t+3]=d;return}if(o===1){e[t+0]=u,e[t+1]=m,e[t+2]=_,e[t+3]=f;return}if(d!==f||l!==u||c!==m||h!==_){let p=1-o,b=l*u+c*m+h*_+d*f,E=b>=0?1:-1,y=1-b*b;if(y>Number.EPSILON){let T=Math.sqrt(y),P=Math.atan2(T,b*E);p=Math.sin(p*P)/T,o=Math.sin(o*P)/T}let M=o*E;if(l=l*p+u*M,c=c*p+m*M,h=h*p+_*M,d=d*p+f*M,p===1-o){let T=1/Math.sqrt(l*l+c*c+h*h+d*d);l*=T,c*=T,h*=T,d*=T}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=d}static multiplyQuaternionsFlat(e,t,n,i,r,a){let o=n[i],l=n[i+1],c=n[i+2],h=n[i+3],d=r[a],u=r[a+1],m=r[a+2],_=r[a+3];return e[t]=o*_+h*d+l*m-c*u,e[t+1]=l*_+h*u+c*d-o*m,e[t+2]=c*_+h*m+o*u-l*d,e[t+3]=h*_-o*d-l*u-c*m,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,i){return this._x=e,this._y=t,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t){let n=e._x,i=e._y,r=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(n/2),h=o(i/2),d=o(r/2),u=l(n/2),m=l(i/2),_=l(r/2);switch(a){case"XYZ":this._x=u*h*d+c*m*_,this._y=c*m*d-u*h*_,this._z=c*h*_+u*m*d,this._w=c*h*d-u*m*_;break;case"YXZ":this._x=u*h*d+c*m*_,this._y=c*m*d-u*h*_,this._z=c*h*_-u*m*d,this._w=c*h*d+u*m*_;break;case"ZXY":this._x=u*h*d-c*m*_,this._y=c*m*d+u*h*_,this._z=c*h*_+u*m*d,this._w=c*h*d-u*m*_;break;case"ZYX":this._x=u*h*d-c*m*_,this._y=c*m*d+u*h*_,this._z=c*h*_-u*m*d,this._w=c*h*d+u*m*_;break;case"YZX":this._x=u*h*d+c*m*_,this._y=c*m*d+u*h*_,this._z=c*h*_-u*m*d,this._w=c*h*d-u*m*_;break;case"XZY":this._x=u*h*d-c*m*_,this._y=c*m*d-u*h*_,this._z=c*h*_+u*m*d,this._w=c*h*d+u*m*_;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t!==!1&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,i=Math.sin(n);return this._x=e.x*i,this._y=e.y*i,this._z=e.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],i=t[4],r=t[8],a=t[1],o=t[5],l=t[9],c=t[2],h=t[6],d=t[10],u=n+o+d;if(u>0){let m=.5/Math.sqrt(u+1);this._w=.25/m,this._x=(h-l)*m,this._y=(r-c)*m,this._z=(a-i)*m}else if(n>o&&n>d){let m=2*Math.sqrt(1+n-o-d);this._w=(h-l)/m,this._x=.25*m,this._y=(i+a)/m,this._z=(r+c)/m}else if(o>d){let m=2*Math.sqrt(1+o-n-d);this._w=(r-c)/m,this._x=(i+a)/m,this._y=.25*m,this._z=(l+h)/m}else{let m=2*Math.sqrt(1+d-n-o);this._w=(a-i)/m,this._x=(r+c)/m,this._y=(l+h)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<Number.EPSILON?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(bt(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let i=Math.min(1,t/n);return this.slerp(e,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,i=e._y,r=e._z,a=e._w,o=t._x,l=t._y,c=t._z,h=t._w;return this._x=n*h+a*o+i*c-r*l,this._y=i*h+a*l+r*o-n*c,this._z=r*h+a*c+n*l-i*o,this._w=a*h-n*o-i*l-r*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);let n=this._x,i=this._y,r=this._z,a=this._w,o=a*e._w+n*e._x+i*e._y+r*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=n,this._y=i,this._z=r,this;let l=1-o*o;if(l<=Number.EPSILON){let m=1-t;return this._w=m*a+t*this._w,this._x=m*n+t*this._x,this._y=m*i+t*this._y,this._z=m*r+t*this._z,this.normalize(),this._onChangeCallback(),this}let c=Math.sqrt(l),h=Math.atan2(c,o),d=Math.sin((1-t)*h)/c,u=Math.sin(t*h)/c;return this._w=a*d+this._w*u,this._x=n*d+this._x*u,this._y=i*d+this._y*u,this._z=r*d+this._z*u,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=Math.random(),t=Math.sqrt(1-e),n=Math.sqrt(e),i=2*Math.PI*Math.random(),r=2*Math.PI*Math.random();return this.set(t*Math.cos(i),n*Math.sin(r),n*Math.cos(r),t*Math.sin(i))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},H=class{constructor(e=0,t=0,n=0){H.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(vl.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(vl.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,i=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*i,this.y=r[1]*t+r[4]*n+r[7]*i,this.z=r[2]*t+r[5]*n+r[8]*i,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,i=this.z,r=e.elements,a=1/(r[3]*t+r[7]*n+r[11]*i+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*i+r[12])*a,this.y=(r[1]*t+r[5]*n+r[9]*i+r[13])*a,this.z=(r[2]*t+r[6]*n+r[10]*i+r[14])*a,this}applyQuaternion(e){let t=this.x,n=this.y,i=this.z,r=e.x,a=e.y,o=e.z,l=e.w,c=l*t+a*i-o*n,h=l*n+o*t-r*i,d=l*i+r*n-a*t,u=-r*t-a*n-o*i;return this.x=c*l+u*-r+h*-o-d*-a,this.y=h*l+u*-a+d*-r-c*-o,this.z=d*l+u*-o+c*-a-h*-r,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,i=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*i,this.y=r[1]*t+r[5]*n+r[9]*i,this.z=r[2]*t+r[6]*n+r[10]*i,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=this.x<0?Math.ceil(this.x):Math.floor(this.x),this.y=this.y<0?Math.ceil(this.y):Math.floor(this.y),this.z=this.z<0?Math.ceil(this.z):Math.floor(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,i=e.y,r=e.z,a=t.x,o=t.y,l=t.z;return this.x=i*l-r*o,this.y=r*a-n*l,this.z=n*o-i*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Nr.copy(this).projectOnVector(e),this.sub(Nr)}reflect(e){return this.sub(Nr.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(bt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,i=this.z-e.z;return t*t+n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let i=Math.sin(t)*e;return this.x=i*Math.sin(n),this.y=Math.cos(t)*e,this.z=i*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),i=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=i,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=(Math.random()-.5)*2,t=Math.random()*Math.PI*2,n=Math.sqrt(1-e**2);return this.x=n*Math.cos(t),this.y=n*Math.sin(t),this.z=e,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},Nr=new H,vl=new Cn,Xn=class{constructor(e=new H(Infinity,Infinity,Infinity),t=new H(-Infinity,-Infinity,-Infinity)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){let t=Infinity,n=Infinity,i=Infinity,r=-Infinity,a=-Infinity,o=-Infinity;for(let l=0,c=e.length;l<c;l+=3){let h=e[l],d=e[l+1],u=e[l+2];h<t&&(t=h),d<n&&(n=d),u<i&&(i=u),h>r&&(r=h),d>a&&(a=d),u>o&&(o=u)}return this.min.set(t,n,i),this.max.set(r,a,o),this}setFromBufferAttribute(e){let t=Infinity,n=Infinity,i=Infinity,r=-Infinity,a=-Infinity,o=-Infinity;for(let l=0,c=e.count;l<c;l++){let h=e.getX(l),d=e.getY(l),u=e.getZ(l);h<t&&(t=h),d<n&&(n=d),u<i&&(i=u),h>r&&(r=h),d>a&&(a=d),u>o&&(o=u)}return this.min.set(t,n,i),this.max.set(r,a,o),this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=Rn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=Infinity,this.max.x=this.max.y=this.max.z=-Infinity,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0)if(t&&n.attributes!=null&&n.attributes.position!==void 0){let r=n.attributes.position;for(let a=0,o=r.count;a<o;a++)Rn.fromBufferAttribute(r,a).applyMatrix4(e.matrixWorld),this.expandByPoint(Rn)}else n.boundingBox===null&&n.computeBoundingBox(),Or.copy(n.boundingBox),Or.applyMatrix4(e.matrixWorld),this.union(Or);let i=e.children;for(let r=0,a=i.length;r<a;r++)this.expandByObject(i[r],t);return this}containsPoint(e){return!(e.x<this.min.x||e.x>this.max.x||e.y<this.min.y||e.y>this.max.y||e.z<this.min.z||e.z>this.max.z)}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return!(e.max.x<this.min.x||e.min.x>this.max.x||e.max.y<this.min.y||e.min.y>this.max.y||e.max.z<this.min.z||e.min.z>this.max.z)}intersectsSphere(e){return this.clampPoint(e.center,Rn),Rn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Ai),as.subVectors(this.max,Ai),Yn.subVectors(e.a,Ai),$n.subVectors(e.b,Ai),Kn.subVectors(e.c,Ai),sn.subVectors($n,Yn),rn.subVectors(Kn,$n),Ln.subVectors(Yn,Kn);let t=[0,-sn.z,sn.y,0,-rn.z,rn.y,0,-Ln.z,Ln.y,sn.z,0,-sn.x,rn.z,0,-rn.x,Ln.z,0,-Ln.x,-sn.y,sn.x,0,-rn.y,rn.x,0,-Ln.y,Ln.x,0];return!Fr(t,Yn,$n,Kn,as)||(t=[1,0,0,0,1,0,0,0,1],!Fr(t,Yn,$n,Kn,as))?!1:(ls.crossVectors(sn,rn),t=[ls.x,ls.y,ls.z],Fr(t,Yn,$n,Kn,as))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return Rn.copy(e).clamp(this.min,this.max).sub(e).length()}getBoundingSphere(e){return this.getCenter(e.center),e.radius=this.getSize(Rn).length()*.5,e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Yt[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Yt[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Yt[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Yt[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Yt[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Yt[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Yt[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Yt[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Yt),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}},Yt=[new H,new H,new H,new H,new H,new H,new H,new H],Rn=new H,Or=new Xn,Yn=new H,$n=new H,Kn=new H,sn=new H,rn=new H,Ln=new H,Ai=new H,as=new H,ls=new H,Pn=new H;function Fr(s,e,t,n,i){for(let r=0,a=s.length-3;r<=a;r+=3){Pn.fromArray(s,r);let o=i.x*Math.abs(Pn.x)+i.y*Math.abs(Pn.y)+i.z*Math.abs(Pn.z),l=e.dot(Pn),c=t.dot(Pn),h=n.dot(Pn);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}var Gf=new Xn,Ei=new H,Br=new H,cs=class{constructor(e=new H,t=-1){this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t!==void 0?n.copy(t):Gf.setFromPoints(e).getCenter(n);let i=0;for(let r=0,a=e.length;r<a;r++)i=Math.max(i,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(i),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Ei.subVectors(e,this.center);let t=Ei.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),i=(n-this.radius)*.5;this.center.addScaledVector(Ei,i/n),this.radius+=i}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Br.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Ei.copy(e.center).add(Br)),this.expandByPoint(Ei.copy(e.center).sub(Br))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}},$t=new H,zr=new H,hs=new H,on=new H,Ur=new H,us=new H,kr=new H,bl=class{constructor(e=new H,t=new H(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.direction).multiplyScalar(e).add(this.origin)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,$t)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.direction).multiplyScalar(n).add(this.origin)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=$t.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):($t.copy(this.direction).multiplyScalar(t).add(this.origin),$t.distanceToSquared(e))}distanceSqToSegment(e,t,n,i){zr.copy(e).add(t).multiplyScalar(.5),hs.copy(t).sub(e).normalize(),on.copy(this.origin).sub(zr);let r=e.distanceTo(t)*.5,a=-this.direction.dot(hs),o=on.dot(this.direction),l=-on.dot(hs),c=on.lengthSq(),h=Math.abs(1-a*a),d,u,m,_;if(h>0)if(d=a*l-o,u=a*o-l,_=r*h,d>=0)if(u>=-_)if(u<=_){let f=1/h;d*=f,u*=f,m=d*(d+a*u+2*o)+u*(a*d+u+2*l)+c}else u=r,d=Math.max(0,-(a*u+o)),m=-d*d+u*(u+2*l)+c;else u=-r,d=Math.max(0,-(a*u+o)),m=-d*d+u*(u+2*l)+c;else u<=-_?(d=Math.max(0,-(-a*r+o)),u=d>0?-r:Math.min(Math.max(-r,-l),r),m=-d*d+u*(u+2*l)+c):u<=_?(d=0,u=Math.min(Math.max(-r,-l),r),m=u*(u+2*l)+c):(d=Math.max(0,-(a*r+o)),u=d>0?r:Math.min(Math.max(-r,-l),r),m=-d*d+u*(u+2*l)+c);else u=a>0?-r:r,d=Math.max(0,-(a*u+o)),m=-d*d+u*(u+2*l)+c;return n&&n.copy(this.direction).multiplyScalar(d).add(this.origin),i&&i.copy(hs).multiplyScalar(u).add(zr),m}intersectSphere(e,t){$t.subVectors(e.center,this.origin);let n=$t.dot(this.direction),i=$t.dot($t)-n*n,r=e.radius*e.radius;if(i>r)return null;let a=Math.sqrt(r-i),o=n-a,l=n+a;return o<0&&l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,i,r,a,o,l,c=1/this.direction.x,h=1/this.direction.y,d=1/this.direction.z,u=this.origin;return c>=0?(n=(e.min.x-u.x)*c,i=(e.max.x-u.x)*c):(n=(e.max.x-u.x)*c,i=(e.min.x-u.x)*c),h>=0?(r=(e.min.y-u.y)*h,a=(e.max.y-u.y)*h):(r=(e.max.y-u.y)*h,a=(e.min.y-u.y)*h),n>a||r>i||((r>n||isNaN(n))&&(n=r),(a<i||isNaN(i))&&(i=a),d>=0?(o=(e.min.z-u.z)*d,l=(e.max.z-u.z)*d):(o=(e.max.z-u.z)*d,l=(e.min.z-u.z)*d),n>l||o>i)||((o>n||n!==n)&&(n=o),(l<i||i!==i)&&(i=l),i<0)?null:this.at(n>=0?n:i,t)}intersectsBox(e){return this.intersectBox(e,$t)!==null}intersectTriangle(e,t,n,i,r){Ur.subVectors(t,e),us.subVectors(n,e),kr.crossVectors(Ur,us);let a=this.direction.dot(kr),o;if(a>0){if(i)return null;o=1}else if(a<0)o=-1,a=-a;else return null;on.subVectors(this.origin,e);let l=o*this.direction.dot(us.crossVectors(on,us));if(l<0)return null;let c=o*this.direction.dot(Ur.cross(on));if(c<0||l+c>a)return null;let h=-o*on.dot(kr);return h<0?null:this.at(h/a,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},it=class{constructor(){it.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]}set(e,t,n,i,r,a,o,l,c,h,d,u,m,_,f,p){let b=this.elements;return b[0]=e,b[4]=t,b[8]=n,b[12]=i,b[1]=r,b[5]=a,b[9]=o,b[13]=l,b[2]=c,b[6]=h,b[10]=d,b[14]=u,b[3]=m,b[7]=_,b[11]=f,b[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new it().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){let t=this.elements,n=e.elements,i=1/Zn.setFromMatrixColumn(e,0).length(),r=1/Zn.setFromMatrixColumn(e,1).length(),a=1/Zn.setFromMatrixColumn(e,2).length();return t[0]=n[0]*i,t[1]=n[1]*i,t[2]=n[2]*i,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,i=e.y,r=e.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(i),c=Math.sin(i),h=Math.cos(r),d=Math.sin(r);if(e.order==="XYZ"){let u=a*h,m=a*d,_=o*h,f=o*d;t[0]=l*h,t[4]=-l*d,t[8]=c,t[1]=m+_*c,t[5]=u-f*c,t[9]=-o*l,t[2]=f-u*c,t[6]=_+m*c,t[10]=a*l}else if(e.order==="YXZ"){let u=l*h,m=l*d,_=c*h,f=c*d;t[0]=u+f*o,t[4]=_*o-m,t[8]=a*c,t[1]=a*d,t[5]=a*h,t[9]=-o,t[2]=m*o-_,t[6]=f+u*o,t[10]=a*l}else if(e.order==="ZXY"){let u=l*h,m=l*d,_=c*h,f=c*d;t[0]=u-f*o,t[4]=-a*d,t[8]=_+m*o,t[1]=m+_*o,t[5]=a*h,t[9]=f-u*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){let u=a*h,m=a*d,_=o*h,f=o*d;t[0]=l*h,t[4]=_*c-m,t[8]=u*c+f,t[1]=l*d,t[5]=f*c+u,t[9]=m*c-_,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){let u=a*l,m=a*c,_=o*l,f=o*c;t[0]=l*h,t[4]=f-u*d,t[8]=_*d+m,t[1]=d,t[5]=a*h,t[9]=-o*h,t[2]=-c*h,t[6]=m*d+_,t[10]=u-f*d}else if(e.order==="XZY"){let u=a*l,m=a*c,_=o*l,f=o*c;t[0]=l*h,t[4]=-d,t[8]=c*h,t[1]=u*d+f,t[5]=a*h,t[9]=m*d-_,t[2]=_*d-m,t[6]=o*h,t[10]=f*d+u}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Wf,e,qf)}lookAt(e,t,n){let i=this.elements;return wt.subVectors(e,t),wt.lengthSq()===0&&(wt.z=1),wt.normalize(),an.crossVectors(n,wt),an.lengthSq()===0&&(Math.abs(n.z)===1?wt.x+=1e-4:wt.z+=1e-4,wt.normalize(),an.crossVectors(n,wt)),an.normalize(),ds.crossVectors(wt,an),i[0]=an.x,i[4]=ds.x,i[8]=wt.x,i[1]=an.y,i[5]=ds.y,i[9]=wt.y,i[2]=an.z,i[6]=ds.z,i[10]=wt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,i=t.elements,r=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],h=n[1],d=n[5],u=n[9],m=n[13],_=n[2],f=n[6],p=n[10],b=n[14],E=n[3],y=n[7],M=n[11],T=n[15],P=i[0],N=i[4],g=i[8],w=i[12],D=i[1],R=i[5],X=i[9],O=i[13],B=i[2],A=i[6],C=i[10],J=i[14],k=i[3],j=i[7],Z=i[11],fe=i[15];return r[0]=a*P+o*D+l*B+c*k,r[4]=a*N+o*R+l*A+c*j,r[8]=a*g+o*X+l*C+c*Z,r[12]=a*w+o*O+l*J+c*fe,r[1]=h*P+d*D+u*B+m*k,r[5]=h*N+d*R+u*A+m*j,r[9]=h*g+d*X+u*C+m*Z,r[13]=h*w+d*O+u*J+m*fe,r[2]=_*P+f*D+p*B+b*k,r[6]=_*N+f*R+p*A+b*j,r[10]=_*g+f*X+p*C+b*Z,r[14]=_*w+f*O+p*J+b*fe,r[3]=E*P+y*D+M*B+T*k,r[7]=E*N+y*R+M*A+T*j,r[11]=E*g+y*X+M*C+T*Z,r[15]=E*w+y*O+M*J+T*fe,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],i=e[8],r=e[12],a=e[1],o=e[5],l=e[9],c=e[13],h=e[2],d=e[6],u=e[10],m=e[14],_=e[3],f=e[7],p=e[11],b=e[15];return _*(+r*l*d-i*c*d-r*o*u+n*c*u+i*o*m-n*l*m)+f*(+t*l*m-t*c*u+r*a*u-i*a*m+i*c*h-r*l*h)+p*(+t*c*d-t*o*m-r*a*d+n*a*m+r*o*h-n*c*h)+b*(-i*o*h-t*l*d+t*o*u+i*a*d-n*a*u+n*l*h)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let i=this.elements;return e.isVector3?(i[12]=e.x,i[13]=e.y,i[14]=e.z):(i[12]=e,i[13]=t,i[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],d=e[9],u=e[10],m=e[11],_=e[12],f=e[13],p=e[14],b=e[15],E=d*p*c-f*u*c+f*l*m-o*p*m-d*l*b+o*u*b,y=_*u*c-h*p*c-_*l*m+a*p*m+h*l*b-a*u*b,M=h*f*c-_*d*c+_*o*m-a*f*m-h*o*b+a*d*b,T=_*d*l-h*f*l-_*o*u+a*f*u+h*o*p-a*d*p,P=t*E+n*y+i*M+r*T;if(P===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let N=1/P;return e[0]=E*N,e[1]=(f*u*r-d*p*r-f*i*m+n*p*m+d*i*b-n*u*b)*N,e[2]=(o*p*r-f*l*r+f*i*c-n*p*c-o*i*b+n*l*b)*N,e[3]=(d*l*r-o*u*r-d*i*c+n*u*c+o*i*m-n*l*m)*N,e[4]=y*N,e[5]=(h*p*r-_*u*r+_*i*m-t*p*m-h*i*b+t*u*b)*N,e[6]=(_*l*r-a*p*r-_*i*c+t*p*c+a*i*b-t*l*b)*N,e[7]=(a*u*r-h*l*r+h*i*c-t*u*c-a*i*m+t*l*m)*N,e[8]=M*N,e[9]=(_*d*r-h*f*r-_*n*m+t*f*m+h*n*b-t*d*b)*N,e[10]=(a*f*r-_*o*r+_*n*c-t*f*c-a*n*b+t*o*b)*N,e[11]=(h*o*r-a*d*r-h*n*c+t*d*c+a*n*m-t*o*m)*N,e[12]=T*N,e[13]=(h*f*i-_*d*i+_*n*u-t*f*u-h*n*p+t*d*p)*N,e[14]=(_*o*i-a*f*i-_*n*l+t*f*l+a*n*p-t*o*p)*N,e[15]=(a*d*i-h*o*i+h*n*l-t*d*l-a*n*u+t*o*u)*N,this}scale(e){let t=this.elements,n=e.x,i=e.y,r=e.z;return t[0]*=n,t[4]*=i,t[8]*=r,t[1]*=n,t[5]*=i,t[9]*=r,t[2]*=n,t[6]*=i,t[10]*=r,t[3]*=n,t[7]*=i,t[11]*=r,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],i=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,i))}makeTranslation(e,t,n){return this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),i=Math.sin(t),r=1-n,a=e.x,o=e.y,l=e.z,c=r*a,h=r*o;return this.set(c*a+n,c*o-i*l,c*l+i*o,0,c*o+i*l,h*o+n,h*l-i*a,0,c*l-i*o,h*l+i*a,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,i,r,a){return this.set(1,n,r,0,e,1,a,0,t,i,1,0,0,0,0,1),this}compose(e,t,n){let i=this.elements,r=t._x,a=t._y,o=t._z,l=t._w,c=r+r,h=a+a,d=o+o,u=r*c,m=r*h,_=r*d,f=a*h,p=a*d,b=o*d,E=l*c,y=l*h,M=l*d,T=n.x,P=n.y,N=n.z;return i[0]=(1-(f+b))*T,i[1]=(m+M)*T,i[2]=(_-y)*T,i[3]=0,i[4]=(m-M)*P,i[5]=(1-(u+b))*P,i[6]=(p+E)*P,i[7]=0,i[8]=(_+y)*N,i[9]=(p-E)*N,i[10]=(1-(u+f))*N,i[11]=0,i[12]=e.x,i[13]=e.y,i[14]=e.z,i[15]=1,this}decompose(e,t,n){let i=this.elements,r=Zn.set(i[0],i[1],i[2]).length(),a=Zn.set(i[4],i[5],i[6]).length(),o=Zn.set(i[8],i[9],i[10]).length();this.determinant()<0&&(r=-r),e.x=i[12],e.y=i[13],e.z=i[14],Nt.copy(this);let c=1/r,h=1/a,d=1/o;return Nt.elements[0]*=c,Nt.elements[1]*=c,Nt.elements[2]*=c,Nt.elements[4]*=h,Nt.elements[5]*=h,Nt.elements[6]*=h,Nt.elements[8]*=d,Nt.elements[9]*=d,Nt.elements[10]*=d,t.setFromRotationMatrix(Nt),n.x=r,n.y=a,n.z=o,this}makePerspective(e,t,n,i,r,a){let o=this.elements,l=2*r/(t-e),c=2*r/(n-i),h=(t+e)/(t-e),d=(n+i)/(n-i),u=-(a+r)/(a-r),m=-2*a*r/(a-r);return o[0]=l,o[4]=0,o[8]=h,o[12]=0,o[1]=0,o[5]=c,o[9]=d,o[13]=0,o[2]=0,o[6]=0,o[10]=u,o[14]=m,o[3]=0,o[7]=0,o[11]=-1,o[15]=0,this}makeOrthographic(e,t,n,i,r,a){let o=this.elements,l=1/(t-e),c=1/(n-i),h=1/(a-r),d=(t+e)*l,u=(n+i)*c,m=(a+r)*h;return o[0]=2*l,o[4]=0,o[8]=0,o[12]=-d,o[1]=0,o[5]=2*c,o[9]=0,o[13]=-u,o[2]=0,o[6]=0,o[10]=-2*h,o[14]=-m,o[3]=0,o[7]=0,o[11]=0,o[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let i=0;i<16;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},Zn=new H,Nt=new it,Wf=new H(0,0,0),qf=new H(1,1,1),an=new H,ds=new H,wt=new H,Ml=new it,wl=new Cn,Ti=class{constructor(e=0,t=0,n=0,i=Ti.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,i=this._order){return this._x=e,this._y=t,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let i=e.elements,r=i[0],a=i[4],o=i[8],l=i[1],c=i[5],h=i[9],d=i[2],u=i[6],m=i[10];switch(t){case"XYZ":this._y=Math.asin(bt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,m),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(u,c),this._z=0);break;case"YXZ":this._x=Math.asin(-bt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,m),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin(bt(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-d,m),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-bt(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(u,m),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(bt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(o,m));break;case"XZY":this._z=Math.asin(-bt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(u,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,m),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Ml.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Ml,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return wl.setFromEuler(this),this.setFromQuaternion(wl,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Ti.DEFAULT_ORDER="XYZ";var Hr=class{constructor(){this.mask=1|0}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=4294967295|0}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!=0}isEnabled(e){return(this.mask&(1<<e|0))!=0}},Xf=0,Sl=new H,Jn=new Cn,Kt=new it,fs=new H,Ci=new H,Yf=new H,$f=new Cn,Al=new H(1,0,0),El=new H(0,1,0),Tl=new H(0,0,1),Kf={type:"added"},Cl={type:"removed"},mt=class extends En{constructor(){super();this.isObject3D=!0,Object.defineProperty(this,"id",{value:Xf++}),this.uuid=Si(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=mt.DEFAULT_UP.clone();let e=new H,t=new Ti,n=new Cn,i=new H(1,1,1);function r(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new it},normalMatrix:{value:new ft}}),this.matrix=new it,this.matrixWorld=new it,this.matrixAutoUpdate=mt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.matrixWorldAutoUpdate=mt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.layers=new Hr,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Jn.setFromAxisAngle(e,t),this.quaternion.multiply(Jn),this}rotateOnWorldAxis(e,t){return Jn.setFromAxisAngle(e,t),this.quaternion.premultiply(Jn),this}rotateX(e){return this.rotateOnAxis(Al,e)}rotateY(e){return this.rotateOnAxis(El,e)}rotateZ(e){return this.rotateOnAxis(Tl,e)}translateOnAxis(e,t){return Sl.copy(e).applyQuaternion(this.quaternion),this.position.add(Sl.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Al,e)}translateY(e){return this.translateOnAxis(El,e)}translateZ(e){return this.translateOnAxis(Tl,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Kt.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?fs.copy(e):fs.set(e,t,n);let i=this.parent;this.updateWorldMatrix(!0,!1),Ci.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Kt.lookAt(Ci,fs,this.up):Kt.lookAt(fs,Ci,this.up),this.quaternion.setFromRotationMatrix(Kt),i&&(Kt.extractRotation(i.matrixWorld),Jn.setFromRotationMatrix(Kt),this.quaternion.premultiply(Jn.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.parent!==null&&e.parent.remove(e),e.parent=this,this.children.push(e),e.dispatchEvent(Kf)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Cl)),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){for(let e=0;e<this.children.length;e++){let t=this.children[e];t.parent=null,t.dispatchEvent(Cl)}return this.children.length=0,this}attach(e){return this.updateWorldMatrix(!0,!1),Kt.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Kt.multiply(e.parent.matrixWorld)),e.applyMatrix4(Kt),this.add(e),e.updateWorldMatrix(!1,!0),this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,i=this.children.length;n<i;n++){let a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t){let n=[];this[e]===t&&n.push(this);for(let i=0,r=this.children.length;i<r;i++){let a=this.children[i].getObjectsByProperty(e,t);a.length>0&&(n=n.concat(a))}return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ci,e,Yf),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ci,$f,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);let t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,i=t.length;n<i;n++){let r=t[n];(r.matrixWorldAutoUpdate===!0||e===!0)&&r.updateMatrixWorld(e)}}updateWorldMatrix(e,t){let n=this.parent;if(e===!0&&n!==null&&n.matrixWorldAutoUpdate===!0&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),t===!0){let i=this.children;for(let r=0,a=i.length;r<a;r++){let o=i[r];o.matrixWorldAutoUpdate===!0&&o.updateWorldMatrix(!1,!0)}}}toJSON(e){let t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.5,type:"Object",generator:"Object3D.toJSON"});let i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=r(e.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){let d=l[c];r(e.shapes,d)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(e.materials,this.material[l]));i.material=o}else i.material=r(e.materials,this.material);if(this.children.length>0){i.children=[];for(let o=0;o<this.children.length;o++)i.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){i.animations=[];for(let o=0;o<this.animations.length;o++){let l=this.animations[o];i.animations.push(r(e.animations,l))}}if(t){let o=a(e.geometries),l=a(e.materials),c=a(e.textures),h=a(e.images),d=a(e.shapes),u=a(e.skeletons),m=a(e.animations),_=a(e.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),d.length>0&&(n.shapes=d),u.length>0&&(n.skeletons=u),m.length>0&&(n.animations=m),_.length>0&&(n.nodes=_)}return n.object=i,n;function a(o){let l=[];for(let c in o){let h=o[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){let i=e.children[n];this.add(i.clone())}return this}};mt.DEFAULT_UP=new H(0,1,0);mt.DEFAULT_MATRIX_AUTO_UPDATE=!0;mt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Ot=new H,Zt=new H,Vr=new H,Jt=new H,jn=new H,Qn=new H,Rl=new H,Gr=new H,Wr=new H,qr=new H,Ut=class{constructor(e=new H,t=new H,n=new H){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,i){i.subVectors(n,t),Ot.subVectors(e,t),i.cross(Ot);let r=i.lengthSq();return r>0?i.multiplyScalar(1/Math.sqrt(r)):i.set(0,0,0)}static getBarycoord(e,t,n,i,r){Ot.subVectors(i,t),Zt.subVectors(n,t),Vr.subVectors(e,t);let a=Ot.dot(Ot),o=Ot.dot(Zt),l=Ot.dot(Vr),c=Zt.dot(Zt),h=Zt.dot(Vr),d=a*c-o*o;if(d===0)return r.set(-2,-1,-1);let u=1/d,m=(c*l-o*h)*u,_=(a*h-o*l)*u;return r.set(1-m-_,_,m)}static containsPoint(e,t,n,i){return this.getBarycoord(e,t,n,i,Jt),Jt.x>=0&&Jt.y>=0&&Jt.x+Jt.y<=1}static getUV(e,t,n,i,r,a,o,l){return this.getBarycoord(e,t,n,i,Jt),l.set(0,0),l.addScaledVector(r,Jt.x),l.addScaledVector(a,Jt.y),l.addScaledVector(o,Jt.z),l}static isFrontFacing(e,t,n,i){return Ot.subVectors(n,t),Zt.subVectors(e,t),Ot.cross(Zt).dot(i)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,i){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[i]),this}setFromAttributeAndIndices(e,t,n,i){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,i),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Ot.subVectors(this.c,this.b),Zt.subVectors(this.a,this.b),Ot.cross(Zt).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Ut.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return Ut.getBarycoord(e,this.a,this.b,this.c,t)}getUV(e,t,n,i,r){return Ut.getUV(e,this.a,this.b,this.c,t,n,i,r)}containsPoint(e){return Ut.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Ut.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,i=this.b,r=this.c,a,o;jn.subVectors(i,n),Qn.subVectors(r,n),Gr.subVectors(e,n);let l=jn.dot(Gr),c=Qn.dot(Gr);if(l<=0&&c<=0)return t.copy(n);Wr.subVectors(e,i);let h=jn.dot(Wr),d=Qn.dot(Wr);if(h>=0&&d<=h)return t.copy(i);let u=l*d-h*c;if(u<=0&&l>=0&&h<=0)return a=l/(l-h),t.copy(n).addScaledVector(jn,a);qr.subVectors(e,r);let m=jn.dot(qr),_=Qn.dot(qr);if(_>=0&&m<=_)return t.copy(r);let f=m*c-l*_;if(f<=0&&c>=0&&_<=0)return o=c/(c-_),t.copy(n).addScaledVector(Qn,o);let p=h*_-m*d;if(p<=0&&d-h>=0&&m-_>=0)return Rl.subVectors(r,i),o=(d-h)/(d-h+(m-_)),t.copy(i).addScaledVector(Rl,o);let b=1/(p+f+u);return a=f*b,o=u*b,t.copy(n).addScaledVector(jn,a).addScaledVector(Qn,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},Zf=0,Ri=class extends En{constructor(){super();this.isMaterial=!0,Object.defineProperty(this,"id",{value:Zf++}),this.uuid=Si(),this.name="",this.type="Material",this.blending=Un,this.side=Qt,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.blendSrc=Oa,this.blendDst=Fa,this.blendEquation=kn,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.depthFunc=hr,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=kf,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Mr,this.stencilZFail=Mr,this.stencilZPass=Mr,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){console.warn("THREE.Material: '"+t+"' parameter is undefined.");continue}let i=this[t];if(i===void 0){console.warn("THREE."+this.type+": '"+t+"' is not a property of this material.");continue}i&&i.isColor?i.set(n):i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let n={metadata:{version:4.5,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==Infinity&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Un&&(n.blending=this.blending),this.side!==Qt&&(n.side=this.side),this.vertexColors&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=this.transparent),n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.stencilWrite=this.stencilWrite,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaToCoverage===!0&&(n.alphaToCoverage=this.alphaToCoverage),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=this.premultipliedAlpha),this.forceSinglePass===!0&&(n.forceSinglePass=this.forceSinglePass),this.wireframe===!0&&(n.wireframe=this.wireframe),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=this.flatShading),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(r){let a=[];for(let o in r){let l=r[o];delete l.metadata,a.push(l)}return a}if(t){let r=i(e.textures),a=i(e.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let i=t.length;n=new Array(i);for(let r=0;r!==i;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}},ei=class extends Ri{constructor(e){super();this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ge(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=Ba,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},$e=new H,ps=new Ue,Ft=class{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=fl,this.updateRange={offset:0,count:-1},this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let i=0,r=this.itemSize;i<r;i++)this.array[e+i]=t.array[n+i];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)ps.fromBufferAttribute(this,t),ps.applyMatrix3(e),this.setXY(t,ps.x,ps.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)$e.fromBufferAttribute(this,t),$e.applyMatrix3(e),this.setXYZ(t,$e.x,$e.y,$e.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)$e.fromBufferAttribute(this,t),$e.applyMatrix4(e),this.setXYZ(t,$e.x,$e.y,$e.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)$e.fromBufferAttribute(this,t),$e.applyNormalMatrix(e),this.setXYZ(t,$e.x,$e.y,$e.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)$e.fromBufferAttribute(this,t),$e.transformDirection(e),this.setXYZ(t,$e.x,$e.y,$e.z);return this}set(e,t=0){return this.array.set(e,t),this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=ns(t,this.array)),t}setX(e,t){return this.normalized&&(t=Mt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=ns(t,this.array)),t}setY(e,t){return this.normalized&&(t=Mt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=ns(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Mt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=ns(t,this.array)),t}setW(e,t){return this.normalized&&(t=Mt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=Mt(t,this.array),n=Mt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,i){return e*=this.itemSize,this.normalized&&(t=Mt(t,this.array),n=Mt(n,this.array),i=Mt(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this}setXYZW(e,t,n,i,r){return e*=this.itemSize,this.normalized&&(t=Mt(t,this.array),n=Mt(n,this.array),i=Mt(i,this.array),r=Mt(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==fl&&(e.usage=this.usage),(this.updateRange.offset!==0||this.updateRange.count!==-1)&&(e.updateRange=this.updateRange),e}copyColorsArray(){console.error("THREE.BufferAttribute: copyColorsArray() was removed in r144.")}copyVector2sArray(){console.error("THREE.BufferAttribute: copyVector2sArray() was removed in r144.")}copyVector3sArray(){console.error("THREE.BufferAttribute: copyVector3sArray() was removed in r144.")}copyVector4sArray(){console.error("THREE.BufferAttribute: copyVector4sArray() was removed in r144.")}};var Xr=class extends Ft{constructor(e,t,n){super(new Uint16Array(e),t,n)}};var Yr=class extends Ft{constructor(e,t,n){super(new Uint32Array(e),t,n)}};var ln=class extends Ft{constructor(e,t,n){super(new Float32Array(e),t,n)}};var Jf=0,Tt=new it,$r=new mt,ti=new H,St=new Xn,Li=new Xn,st=new H,cn=class extends En{constructor(){super();this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Jf++}),this.uuid=Si(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:Infinity},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(_l(e)?Yr:Xr)(e,1):this.index=e,this}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new ft().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}let i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(e),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Tt.makeRotationFromQuaternion(e),this.applyMatrix4(Tt),this}rotateX(e){return Tt.makeRotationX(e),this.applyMatrix4(Tt),this}rotateY(e){return Tt.makeRotationY(e),this.applyMatrix4(Tt),this}rotateZ(e){return Tt.makeRotationZ(e),this.applyMatrix4(Tt),this}translate(e,t,n){return Tt.makeTranslation(e,t,n),this.applyMatrix4(Tt),this}scale(e,t,n){return Tt.makeScale(e,t,n),this.applyMatrix4(Tt),this}lookAt(e){return $r.lookAt(e),$r.updateMatrix(),this.applyMatrix4($r.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ti).negate(),this.translate(ti.x,ti.y,ti.z),this}setFromPoints(e){let t=[];for(let n=0,i=e.length;n<i;n++){let r=e[n];t.push(r.x,r.y,r.z||0)}return this.setAttribute("position",new ln(t,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Xn);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new H(-Infinity,-Infinity,-Infinity),new H(Infinity,Infinity,Infinity));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,i=t.length;n<i;n++){let r=t[n];St.setFromBufferAttribute(r),this.morphTargetsRelative?(st.addVectors(this.boundingBox.min,St.min),this.boundingBox.expandByPoint(st),st.addVectors(this.boundingBox.max,St.max),this.boundingBox.expandByPoint(st)):(this.boundingBox.expandByPoint(St.min),this.boundingBox.expandByPoint(St.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new cs);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new H,Infinity);return}if(e){let n=this.boundingSphere.center;if(St.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){let o=t[r];Li.setFromBufferAttribute(o),this.morphTargetsRelative?(st.addVectors(St.min,Li.min),St.expandByPoint(st),st.addVectors(St.max,Li.max),St.expandByPoint(st)):(St.expandByPoint(Li.min),St.expandByPoint(Li.max))}St.getCenter(n);let i=0;for(let r=0,a=e.count;r<a;r++)st.fromBufferAttribute(e,r),i=Math.max(i,n.distanceToSquared(st));if(t)for(let r=0,a=t.length;r<a;r++){let o=t[r],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)st.fromBufferAttribute(o,c),l&&(ti.fromBufferAttribute(e,c),st.add(ti)),i=Math.max(i,n.distanceToSquared(st))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=e.array,i=t.position.array,r=t.normal.array,a=t.uv.array,o=i.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Ft(new Float32Array(4*o),4));let l=this.getAttribute("tangent").array,c=[],h=[];for(let D=0;D<o;D++)c[D]=new H,h[D]=new H;let d=new H,u=new H,m=new H,_=new Ue,f=new Ue,p=new Ue,b=new H,E=new H;function y(D,R,X){d.fromArray(i,D*3),u.fromArray(i,R*3),m.fromArray(i,X*3),_.fromArray(a,D*2),f.fromArray(a,R*2),p.fromArray(a,X*2),u.sub(d),m.sub(d),f.sub(_),p.sub(_);let O=1/(f.x*p.y-p.x*f.y);!isFinite(O)||(b.copy(u).multiplyScalar(p.y).addScaledVector(m,-f.y).multiplyScalar(O),E.copy(m).multiplyScalar(f.x).addScaledVector(u,-p.x).multiplyScalar(O),c[D].add(b),c[R].add(b),c[X].add(b),h[D].add(E),h[R].add(E),h[X].add(E))}let M=this.groups;M.length===0&&(M=[{start:0,count:n.length}]);for(let D=0,R=M.length;D<R;++D){let X=M[D],O=X.start,B=X.count;for(let A=O,C=O+B;A<C;A+=3)y(n[A+0],n[A+1],n[A+2])}let T=new H,P=new H,N=new H,g=new H;function w(D){N.fromArray(r,D*3),g.copy(N);let R=c[D];T.copy(R),T.sub(N.multiplyScalar(N.dot(R))).normalize(),P.crossVectors(g,R);let O=P.dot(h[D])<0?-1:1;l[D*4]=T.x,l[D*4+1]=T.y,l[D*4+2]=T.z,l[D*4+3]=O}for(let D=0,R=M.length;D<R;++D){let X=M[D],O=X.start,B=X.count;for(let A=O,C=O+B;A<C;A+=3)w(n[A+0]),w(n[A+1]),w(n[A+2])}}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Ft(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let u=0,m=n.count;u<m;u++)n.setXYZ(u,0,0,0);let i=new H,r=new H,a=new H,o=new H,l=new H,c=new H,h=new H,d=new H;if(e)for(let u=0,m=e.count;u<m;u+=3){let _=e.getX(u+0),f=e.getX(u+1),p=e.getX(u+2);i.fromBufferAttribute(t,_),r.fromBufferAttribute(t,f),a.fromBufferAttribute(t,p),h.subVectors(a,r),d.subVectors(i,r),h.cross(d),o.fromBufferAttribute(n,_),l.fromBufferAttribute(n,f),c.fromBufferAttribute(n,p),o.add(h),l.add(h),c.add(h),n.setXYZ(_,o.x,o.y,o.z),n.setXYZ(f,l.x,l.y,l.z),n.setXYZ(p,c.x,c.y,c.z)}else for(let u=0,m=t.count;u<m;u+=3)i.fromBufferAttribute(t,u+0),r.fromBufferAttribute(t,u+1),a.fromBufferAttribute(t,u+2),h.subVectors(a,r),d.subVectors(i,r),h.cross(d),n.setXYZ(u+0,h.x,h.y,h.z),n.setXYZ(u+1,h.x,h.y,h.z),n.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}merge(){return console.error("THREE.BufferGeometry.merge() has been removed. Use THREE.BufferGeometryUtils.mergeBufferGeometries() instead."),this}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)st.fromBufferAttribute(e,t),st.normalize(),e.setXYZ(t,st.x,st.y,st.z)}toNonIndexed(){function e(o,l){let c=o.array,h=o.itemSize,d=o.normalized,u=new c.constructor(l.length*h),m=0,_=0;for(let f=0,p=l.length;f<p;f++){o.isInterleavedBufferAttribute?m=l[f]*o.data.stride+o.offset:m=l[f]*h;for(let b=0;b<h;b++)u[_++]=c[m++]}return new Ft(u,h,d)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new cn,n=this.index.array,i=this.attributes;for(let o in i){let l=i[o],c=e(l,n);t.setAttribute(o,c)}let r=this.morphAttributes;for(let o in r){let l=[],c=r[o];for(let h=0,d=c.length;h<d;h++){let u=c[h],m=e(u,n);l.push(m)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;let a=this.groups;for(let o=0,l=a.length;o<l;o++){let c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){let e={metadata:{version:4.5,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let l in n){let c=n[l];e.data.attributes[l]=c.toJSON(e.data)}let i={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],h=[];for(let d=0,u=c.length;d<u;d++){let m=c[d];h.push(m.toJSON(e.data))}h.length>0&&(i[l]=h,r=!0)}r&&(e.data.morphAttributes=i,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone(t));let i=e.attributes;for(let c in i){let h=i[c];this.setAttribute(c,h.clone(t))}let r=e.morphAttributes;for(let c in r){let h=[],d=r[c];for(let u=0,m=d.length;u<m;u++)h.push(d[u].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let c=0,h=a.length;c<h;c++){let d=a[c];this.addGroup(d.start,d.count,d.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,e.parameters!==void 0&&(this.parameters=Object.assign({},e.parameters)),this}dispose(){this.dispatchEvent({type:"dispose"})}},Ll=new it,ni=new bl,Kr=new cs,Pi=new H,Ii=new H,Di=new H,Zr=new H,ms=new H,gs=new Ue,_s=new Ue,xs=new Ue,Jr=new H,ys=new H,Ct=class extends mt{constructor(e=new cn,t=new ei){super();this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=i.length;r<a;r++){let o=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){let n=this.geometry,i=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(i,e);let o=this.morphTargetInfluences;if(r&&o){ms.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let h=o[l],d=r[l];h!==0&&(Zr.fromBufferAttribute(d,e),a?ms.addScaledVector(Zr,h):ms.addScaledVector(Zr.sub(t),h))}t.add(ms)}return this.isSkinnedMesh&&this.boneTransform(e,t),t}raycast(e,t){let n=this.geometry,i=this.material,r=this.matrixWorld;if(i===void 0||(n.boundingSphere===null&&n.computeBoundingSphere(),Kr.copy(n.boundingSphere),Kr.applyMatrix4(r),e.ray.intersectsSphere(Kr)===!1)||(Ll.copy(r).invert(),ni.copy(e.ray).applyMatrix4(Ll),n.boundingBox!==null&&ni.intersectsBox(n.boundingBox)===!1))return;let a,o=n.index,l=n.attributes.position,c=n.attributes.uv,h=n.attributes.uv2,d=n.groups,u=n.drawRange;if(o!==null)if(Array.isArray(i))for(let m=0,_=d.length;m<_;m++){let f=d[m],p=i[f.materialIndex],b=Math.max(f.start,u.start),E=Math.min(o.count,Math.min(f.start+f.count,u.start+u.count));for(let y=b,M=E;y<M;y+=3){let T=o.getX(y),P=o.getX(y+1),N=o.getX(y+2);a=vs(this,p,e,ni,c,h,T,P,N),a&&(a.faceIndex=Math.floor(y/3),a.face.materialIndex=f.materialIndex,t.push(a))}}else{let m=Math.max(0,u.start),_=Math.min(o.count,u.start+u.count);for(let f=m,p=_;f<p;f+=3){let b=o.getX(f),E=o.getX(f+1),y=o.getX(f+2);a=vs(this,i,e,ni,c,h,b,E,y),a&&(a.faceIndex=Math.floor(f/3),t.push(a))}}else if(l!==void 0)if(Array.isArray(i))for(let m=0,_=d.length;m<_;m++){let f=d[m],p=i[f.materialIndex],b=Math.max(f.start,u.start),E=Math.min(l.count,Math.min(f.start+f.count,u.start+u.count));for(let y=b,M=E;y<M;y+=3){let T=y,P=y+1,N=y+2;a=vs(this,p,e,ni,c,h,T,P,N),a&&(a.faceIndex=Math.floor(y/3),a.face.materialIndex=f.materialIndex,t.push(a))}}else{let m=Math.max(0,u.start),_=Math.min(l.count,u.start+u.count);for(let f=m,p=_;f<p;f+=3){let b=f,E=f+1,y=f+2;a=vs(this,i,e,ni,c,h,b,E,y),a&&(a.faceIndex=Math.floor(f/3),t.push(a))}}}};function jf(s,e,t,n,i,r,a,o){let l;if(e.side===vt?l=n.intersectTriangle(a,r,i,!0,o):l=n.intersectTriangle(i,r,a,e.side===Qt,o),l===null)return null;ys.copy(o),ys.applyMatrix4(s.matrixWorld);let c=t.ray.origin.distanceTo(ys);return c<t.near||c>t.far?null:{distance:c,point:ys.clone(),object:s}}function vs(s,e,t,n,i,r,a,o,l){s.getVertexPosition(a,Pi),s.getVertexPosition(o,Ii),s.getVertexPosition(l,Di);let c=jf(s,e,t,n,Pi,Ii,Di,Jr);if(c){i&&(gs.fromBufferAttribute(i,a),_s.fromBufferAttribute(i,o),xs.fromBufferAttribute(i,l),c.uv=Ut.getUV(Jr,Pi,Ii,Di,gs,_s,xs,new Ue)),r&&(gs.fromBufferAttribute(r,a),_s.fromBufferAttribute(r,o),xs.fromBufferAttribute(r,l),c.uv2=Ut.getUV(Jr,Pi,Ii,Di,gs,_s,xs,new Ue));let h={a,b:o,c:l,normal:new H,materialIndex:0};Ut.getNormal(Pi,Ii,Di,h.normal),c.face=h}return c}var jt=class extends cn{constructor(e=1,t=1,n=1,i=1,r=1,a=1){super();this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:i,heightSegments:r,depthSegments:a};let o=this;i=Math.floor(i),r=Math.floor(r),a=Math.floor(a);let l=[],c=[],h=[],d=[],u=0,m=0;_("z","y","x",-1,-1,n,t,e,a,r,0),_("z","y","x",1,-1,n,t,-e,a,r,1),_("x","z","y",1,1,e,n,t,i,a,2),_("x","z","y",1,-1,e,n,-t,i,a,3),_("x","y","z",1,-1,e,t,n,i,r,4),_("x","y","z",-1,-1,e,t,-n,i,r,5),this.setIndex(l),this.setAttribute("position",new ln(c,3)),this.setAttribute("normal",new ln(h,3)),this.setAttribute("uv",new ln(d,2));function _(f,p,b,E,y,M,T,P,N,g,w){let D=M/N,R=T/g,X=M/2,O=T/2,B=P/2,A=N+1,C=g+1,J=0,k=0,j=new H;for(let Z=0;Z<C;Z++){let fe=Z*R-O;for(let U=0;U<A;U++){let Q=U*D-X;j[f]=Q*E,j[p]=fe*y,j[b]=B,c.push(j.x,j.y,j.z),j[f]=0,j[p]=0,j[b]=P>0?1:-1,h.push(j.x,j.y,j.z),d.push(U/N),d.push(1-Z/g),J+=1}}for(let Z=0;Z<g;Z++)for(let fe=0;fe<N;fe++){let U=u+fe+A*Z,Q=u+fe+A*(Z+1),se=u+(fe+1)+A*(Z+1),ie=u+(fe+1)+A*Z;l.push(U,Q,ie),l.push(Q,se,ie),k+=6}o.addGroup(m,k,w),m+=k,u+=J}}static fromJSON(e){return new jt(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};function ii(s){let e={};for(let t in s){e[t]={};for(let n in s[t]){let i=s[t][n];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?e[t][n]=i.clone():Array.isArray(i)?e[t][n]=i.slice():e[t][n]=i}}return e}function ut(s){let e={};for(let t=0;t<s.length;t++){let n=ii(s[t]);for(let i in n)e[i]=n[i]}return e}function Qf(s){let e=[];for(let t=0;t<s.length;t++)e.push(s[t].clone());return e}function Pl(s){return s.getRenderTarget()===null&&s.outputEncoding===ke?zt:wi}var ep={clone:ii,merge:ut},tp=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,np=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,hn=class extends Ri{constructor(e){super();this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=tp,this.fragmentShader=np,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv2:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=ii(e.uniforms),this.uniformsGroups=Qf(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let i in this.uniforms){let a=this.uniforms[i].value;a&&a.isTexture?t.uniforms[i]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[i]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[i]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[i]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[i]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[i]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[i]={type:"m4",value:a.toArray()}:t.uniforms[i]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader;let n={};for(let i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}},jr=class extends mt{constructor(){super();this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new it,this.projectionMatrix=new it,this.projectionMatrixInverse=new it}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(-t[8],-t[9],-t[10]).normalize()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},gt=class extends jr{constructor(e=50,t=1,n=.1,i=2e3){super();this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=ml*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(Sr*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return ml*2*Math.atan(Math.tan(Sr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(e,t,n,i,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(Sr*.5*this.fov)/this.zoom,n=2*t,i=this.aspect*n,r=-.5*i,a=this.view;if(this.view!==null&&this.view.enabled){let l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*i/l,t-=a.offsetY*n/c,i*=a.width/l,n*=a.height/c}let o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+i,t,t-n,e,this.far),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},si=-90,ri=1,Il=class extends mt{constructor(e,t,n){super();this.type="CubeCamera",this.renderTarget=n;let i=new gt(si,ri,e,t);i.layers=this.layers,i.up.set(0,1,0),i.lookAt(1,0,0),this.add(i);let r=new gt(si,ri,e,t);r.layers=this.layers,r.up.set(0,1,0),r.lookAt(-1,0,0),this.add(r);let a=new gt(si,ri,e,t);a.layers=this.layers,a.up.set(0,0,-1),a.lookAt(0,1,0),this.add(a);let o=new gt(si,ri,e,t);o.layers=this.layers,o.up.set(0,0,1),o.lookAt(0,-1,0),this.add(o);let l=new gt(si,ri,e,t);l.layers=this.layers,l.up.set(0,1,0),l.lookAt(0,0,1),this.add(l);let c=new gt(si,ri,e,t);c.layers=this.layers,c.up.set(0,1,0),c.lookAt(0,0,-1),this.add(c)}update(e,t){this.parent===null&&this.updateMatrixWorld();let n=this.renderTarget,[i,r,a,o,l,c]=this.children,h=e.getRenderTarget(),d=e.toneMapping,u=e.xr.enabled;e.toneMapping=Xt,e.xr.enabled=!1;let m=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0),e.render(t,i),e.setRenderTarget(n,1),e.render(t,r),e.setRenderTarget(n,2),e.render(t,a),e.setRenderTarget(n,3),e.render(t,o),e.setRenderTarget(n,4),e.render(t,l),n.texture.generateMipmaps=m,e.setRenderTarget(n,5),e.render(t,c),e.setRenderTarget(h),e.toneMapping=d,e.xr.enabled=u,n.texture.needsPMREMUpdate=!0}},Qr=class extends pt{constructor(e,t,n,i,r,a,o,l,c,h){e=e!==void 0?e:[],t=t!==void 0?t:Hn,super(e,t,n,i,r,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},Dl=class extends nn{constructor(e=1,t={}){super(e,e,t);this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},i=[n,n,n,n,n,n];this.texture=new Qr(i,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.encoding),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:Et}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.encoding=t.encoding,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},i=new jt(5,5,5),r=new hn({name:"CubemapFromEquirect",uniforms:ii(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:vt,blending:tn});r.uniforms.tEquirect.value=t;let a=new Ct(i,r),o=t.minFilter;return t.minFilter===bi&&(t.minFilter=Et),new Il(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t,n,i){let r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,i);e.setRenderTarget(r)}},eo=new H,ip=new H,sp=new ft,un=class{constructor(e=new H(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,i){return this.normal.set(e,t,n),this.constant=i,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let i=eo.subVectors(n,t).cross(ip.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(i,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(this.normal).multiplyScalar(-this.distanceToPoint(e)).add(e)}intersectLine(e,t){let n=e.delta(eo),i=this.normal.dot(n);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let r=-(e.start.dot(this.normal)+this.constant)/i;return r<0||r>1?null:t.copy(n).multiplyScalar(r).add(e.start)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||sp.getNormalMatrix(e),i=this.coplanarPoint(eo).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},oi=new cs,bs=new H,to=class{constructor(e=new un,t=new un,n=new un,i=new un,r=new un,a=new un){this.planes=[e,t,n,i,r,a]}set(e,t,n,i,r,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(i),o[4].copy(r),o[5].copy(a),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e){let t=this.planes,n=e.elements,i=n[0],r=n[1],a=n[2],o=n[3],l=n[4],c=n[5],h=n[6],d=n[7],u=n[8],m=n[9],_=n[10],f=n[11],p=n[12],b=n[13],E=n[14],y=n[15];return t[0].setComponents(o-i,d-l,f-u,y-p).normalize(),t[1].setComponents(o+i,d+l,f+u,y+p).normalize(),t[2].setComponents(o+r,d+c,f+m,y+b).normalize(),t[3].setComponents(o-r,d-c,f-m,y-b).normalize(),t[4].setComponents(o-a,d-h,f-_,y-E).normalize(),t[5].setComponents(o+a,d+h,f+_,y+E).normalize(),this}intersectsObject(e){let t=e.geometry;return t.boundingSphere===null&&t.computeBoundingSphere(),oi.copy(t.boundingSphere).applyMatrix4(e.matrixWorld),this.intersectsSphere(oi)}intersectsSprite(e){return oi.center.set(0,0,0),oi.radius=.7071067811865476,oi.applyMatrix4(e.matrixWorld),this.intersectsSphere(oi)}intersectsSphere(e){let t=this.planes,n=e.center,i=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<i)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let i=t[n];if(bs.x=i.normal.x>0?e.max.x:e.min.x,bs.y=i.normal.y>0?e.max.y:e.min.y,bs.z=i.normal.z>0?e.max.z:e.min.z,i.distanceToPoint(bs)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};function Nl(){let s=null,e=!1,t=null,n=null;function i(r,a){t(r,a),n=s.requestAnimationFrame(i)}return{start:function(){e!==!0&&t!==null&&(n=s.requestAnimationFrame(i),e=!0)},stop:function(){s.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){s=r}}}function rp(s,e){let t=e.isWebGL2,n=new WeakMap;function i(c,h){let d=c.array,u=c.usage,m=s.createBuffer();s.bindBuffer(h,m),s.bufferData(h,d,u),c.onUploadCallback();let _;if(d instanceof Float32Array)_=5126;else if(d instanceof Uint16Array)if(c.isFloat16BufferAttribute)if(t)_=5131;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else _=5123;else if(d instanceof Int16Array)_=5122;else if(d instanceof Uint32Array)_=5125;else if(d instanceof Int32Array)_=5124;else if(d instanceof Int8Array)_=5120;else if(d instanceof Uint8Array)_=5121;else if(d instanceof Uint8ClampedArray)_=5121;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+d);return{buffer:m,type:_,bytesPerElement:d.BYTES_PER_ELEMENT,version:c.version}}function r(c,h,d){let u=h.array,m=h.updateRange;s.bindBuffer(d,c),m.count===-1?s.bufferSubData(d,0,u):(t?s.bufferSubData(d,m.offset*u.BYTES_PER_ELEMENT,u,m.offset,m.count):s.bufferSubData(d,m.offset*u.BYTES_PER_ELEMENT,u.subarray(m.offset,m.offset+m.count)),m.count=-1),h.onUploadCallback()}function a(c){return c.isInterleavedBufferAttribute&&(c=c.data),n.get(c)}function o(c){c.isInterleavedBufferAttribute&&(c=c.data);let h=n.get(c);h&&(s.deleteBuffer(h.buffer),n.delete(c))}function l(c,h){if(c.isGLBufferAttribute){let u=n.get(c);(!u||u.version<c.version)&&n.set(c,{buffer:c.buffer,type:c.type,bytesPerElement:c.elementSize,version:c.version});return}c.isInterleavedBufferAttribute&&(c=c.data);let d=n.get(c);d===void 0?n.set(c,i(c,h)):d.version<c.version&&(r(d.buffer,c,h),d.version=c.version)}return{get:a,remove:o,update:l}}var Ms=class extends cn{constructor(e=1,t=1,n=1,i=1){super();this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:i};let r=e/2,a=t/2,o=Math.floor(n),l=Math.floor(i),c=o+1,h=l+1,d=e/o,u=t/l,m=[],_=[],f=[],p=[];for(let b=0;b<h;b++){let E=b*u-a;for(let y=0;y<c;y++){let M=y*d-r;_.push(M,-E,0),f.push(0,0,1),p.push(y/o),p.push(1-b/l)}}for(let b=0;b<l;b++)for(let E=0;E<o;E++){let y=E+c*b,M=E+c*(b+1),T=E+1+c*(b+1),P=E+1+c*b;m.push(y,M,P),m.push(M,T,P)}this.setIndex(m),this.setAttribute("position",new ln(_,3)),this.setAttribute("normal",new ln(f,3)),this.setAttribute("uv",new ln(p,2))}static fromJSON(e){return new Ms(e.width,e.height,e.widthSegments,e.heightSegments)}},op=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vUv ).g;
#endif`,ap=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,lp=`#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`,cp=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,hp=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vUv2 ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometry.normal, geometry.viewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,up=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,dp="vec3 transformed = vec3( position );",fp=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,pp=`vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
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
#endif`,mp=`#ifdef USE_IRIDESCENCE
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
#endif`,gp=`#ifdef USE_BUMPMAP
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
#endif`,_p=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,xp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,yp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,vp=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,bp=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Mp=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,wp=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,Sp=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,Ap=`#define PI 3.141592653589793
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
}`,Ep=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Tp=`vec3 transformedNormal = objectNormal;
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
#endif`,Cp=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Rp=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vUv ).x * displacementScale + displacementBias );
#endif`,Lp=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Pp=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Ip="gl_FragColor = linearToOutputTexel( gl_FragColor );",Dp=`vec4 LinearToLinear( in vec4 value ) {
	return value;
}
vec4 LinearTosRGB( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Np=`#ifdef USE_ENVMAP
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
#endif`,Op=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Fp=`#ifdef USE_ENVMAP
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
#endif`,Bp=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,zp=`#ifdef USE_ENVMAP
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
#endif`,Up=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,kp=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Hp=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Vp=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Gp=`#ifdef USE_GRADIENTMAP
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
}`,Wp=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vUv2 );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,qp=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Xp=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Yp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,$p=`uniform bool receiveShadow;
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
#endif`,Kp=`#if defined( USE_ENVMAP )
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
#endif`,Zp=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Jp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,jp=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Qp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,em=`PhysicalMaterial material;
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
#endif`,tm=`struct PhysicalMaterial {
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
}`,nm=`
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
#endif`,im=`#if defined( RE_IndirectDiffuse )
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
#endif`,sm=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometry, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometry, material, reflectedLight );
#endif`,rm=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,om=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,am=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,lm=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,cm=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,hm=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,um=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,dm=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	uniform mat3 uvTransform;
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,fm=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vUv );
	metalnessFactor *= texelMetalness.b;
#endif`,pm=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,mm=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,gm=`#ifdef USE_MORPHNORMALS
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
#endif`,_m=`#ifdef USE_MORPHTARGETS
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
#endif`,xm=`#ifdef USE_MORPHTARGETS
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
#endif`,ym=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 geometryNormal = normal;`,vm=`#ifdef OBJECTSPACE_NORMALMAP
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
#endif`,bm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Mm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,wm=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Sm=`#ifdef USE_NORMALMAP
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
#endif`,Am=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = geometryNormal;
#endif`,Em=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	#ifdef USE_TANGENT
		clearcoatNormal = normalize( vTBN * clearcoatMapN );
	#else
		clearcoatNormal = perturbNormal2Arb( - vViewPosition, clearcoatNormal, clearcoatMapN, faceDirection );
	#endif
#endif`,Tm=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif`,Cm=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Rm=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha + 0.1;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Lm=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Pm=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Im=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Dm=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Nm=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Om=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Fm=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Bm=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,zm=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Um=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,km=`float getShadowMask() {
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
}`,Hm=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Vm=`#ifdef USE_SKINNING
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
#endif`,Gm=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Wm=`#ifdef USE_SKINNING
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
#endif`,qm=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Xm=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Ym=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,$m=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Km=`#ifdef USE_TRANSMISSION
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
#endif`,Zm=`#ifdef USE_TRANSMISSION
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
#endif`,Jm=`#if ( defined( USE_UV ) && ! defined( UVS_VERTEX_ONLY ) )
	varying vec2 vUv;
#endif`,jm=`#ifdef USE_UV
	#ifdef UVS_VERTEX_ONLY
		vec2 vUv;
	#else
		varying vec2 vUv;
	#endif
	uniform mat3 uvTransform;
#endif`,Qm=`#ifdef USE_UV
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
#endif`,eg=`#if defined( USE_LIGHTMAP ) || defined( USE_AOMAP )
	varying vec2 vUv2;
#endif`,tg=`#if defined( USE_LIGHTMAP ) || defined( USE_AOMAP )
	attribute vec2 uv2;
	varying vec2 vUv2;
	uniform mat3 uv2Transform;
#endif`,ng=`#if defined( USE_LIGHTMAP ) || defined( USE_AOMAP )
	vUv2 = ( uv2Transform * vec3( uv2, 1 ) ).xy;
#endif`,ig=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,sg=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,rg=`uniform sampler2D t2D;
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
}`,og=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,ag=`#ifdef ENVMAP_TYPE_CUBE
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
}`,lg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,cg=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <encodings_fragment>
}`,hg=`#include <common>
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
}`,ug=`#if DEPTH_PACKING == 3200
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
}`,dg=`#define DISTANCE
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
}`,fg=`#define DISTANCE
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
}`,pg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,mg=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <encodings_fragment>
}`,gg=`uniform float scale;
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
}`,_g=`uniform vec3 diffuse;
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
}`,xg=`#include <common>
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
}`,yg=`uniform vec3 diffuse;
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
}`,vg=`#define LAMBERT
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
}`,bg=`#define LAMBERT
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
}`,Mg=`#define MATCAP
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
}`,wg=`#define MATCAP
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
}`,Sg=`#define NORMAL
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
}`,Ag=`#define NORMAL
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
}`,Eg=`#define PHONG
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
}`,Tg=`#define PHONG
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
}`,Cg=`#define STANDARD
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
}`,Rg=`#define STANDARD
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
}`,Lg=`#define TOON
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
}`,Pg=`#define TOON
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
}`,Ig=`uniform float size;
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
}`,Dg=`uniform vec3 diffuse;
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
}`,Ng=`#include <common>
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
}`,Og=`uniform vec3 color;
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
}`,Fg=`uniform float rotation;
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
}`,Bg=`uniform vec3 diffuse;
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
}`,Ee={alphamap_fragment:op,alphamap_pars_fragment:ap,alphatest_fragment:lp,alphatest_pars_fragment:cp,aomap_fragment:hp,aomap_pars_fragment:up,begin_vertex:dp,beginnormal_vertex:fp,bsdfs:pp,iridescence_fragment:mp,bumpmap_pars_fragment:gp,clipping_planes_fragment:_p,clipping_planes_pars_fragment:xp,clipping_planes_pars_vertex:yp,clipping_planes_vertex:vp,color_fragment:bp,color_pars_fragment:Mp,color_pars_vertex:wp,color_vertex:Sp,common:Ap,cube_uv_reflection_fragment:Ep,defaultnormal_vertex:Tp,displacementmap_pars_vertex:Cp,displacementmap_vertex:Rp,emissivemap_fragment:Lp,emissivemap_pars_fragment:Pp,encodings_fragment:Ip,encodings_pars_fragment:Dp,envmap_fragment:Np,envmap_common_pars_fragment:Op,envmap_pars_fragment:Fp,envmap_pars_vertex:Bp,envmap_physical_pars_fragment:Kp,envmap_vertex:zp,fog_vertex:Up,fog_pars_vertex:kp,fog_fragment:Hp,fog_pars_fragment:Vp,gradientmap_pars_fragment:Gp,lightmap_fragment:Wp,lightmap_pars_fragment:qp,lights_lambert_fragment:Xp,lights_lambert_pars_fragment:Yp,lights_pars_begin:$p,lights_toon_fragment:Zp,lights_toon_pars_fragment:Jp,lights_phong_fragment:jp,lights_phong_pars_fragment:Qp,lights_physical_fragment:em,lights_physical_pars_fragment:tm,lights_fragment_begin:nm,lights_fragment_maps:im,lights_fragment_end:sm,logdepthbuf_fragment:rm,logdepthbuf_pars_fragment:om,logdepthbuf_pars_vertex:am,logdepthbuf_vertex:lm,map_fragment:cm,map_pars_fragment:hm,map_particle_fragment:um,map_particle_pars_fragment:dm,metalnessmap_fragment:fm,metalnessmap_pars_fragment:pm,morphcolor_vertex:mm,morphnormal_vertex:gm,morphtarget_pars_vertex:_m,morphtarget_vertex:xm,normal_fragment_begin:ym,normal_fragment_maps:vm,normal_pars_fragment:bm,normal_pars_vertex:Mm,normal_vertex:wm,normalmap_pars_fragment:Sm,clearcoat_normal_fragment_begin:Am,clearcoat_normal_fragment_maps:Em,clearcoat_pars_fragment:Tm,iridescence_pars_fragment:Cm,output_fragment:Rm,packing:Lm,premultiplied_alpha_fragment:Pm,project_vertex:Im,dithering_fragment:Dm,dithering_pars_fragment:Nm,roughnessmap_fragment:Om,roughnessmap_pars_fragment:Fm,shadowmap_pars_fragment:Bm,shadowmap_pars_vertex:zm,shadowmap_vertex:Um,shadowmask_pars_fragment:km,skinbase_vertex:Hm,skinning_pars_vertex:Vm,skinning_vertex:Gm,skinnormal_vertex:Wm,specularmap_fragment:qm,specularmap_pars_fragment:Xm,tonemapping_fragment:Ym,tonemapping_pars_fragment:$m,transmission_fragment:Km,transmission_pars_fragment:Zm,uv_pars_fragment:Jm,uv_pars_vertex:jm,uv_vertex:Qm,uv2_pars_fragment:eg,uv2_pars_vertex:tg,uv2_vertex:ng,worldpos_vertex:ig,background_vert:sg,background_frag:rg,backgroundCube_vert:og,backgroundCube_frag:ag,cube_vert:lg,cube_frag:cg,depth_vert:hg,depth_frag:ug,distanceRGBA_vert:dg,distanceRGBA_frag:fg,equirect_vert:pg,equirect_frag:mg,linedashed_vert:gg,linedashed_frag:_g,meshbasic_vert:xg,meshbasic_frag:yg,meshlambert_vert:vg,meshlambert_frag:bg,meshmatcap_vert:Mg,meshmatcap_frag:wg,meshnormal_vert:Sg,meshnormal_frag:Ag,meshphong_vert:Eg,meshphong_frag:Tg,meshphysical_vert:Cg,meshphysical_frag:Rg,meshtoon_vert:Lg,meshtoon_frag:Pg,points_vert:Ig,points_frag:Dg,shadow_vert:Ng,shadow_frag:Og,sprite_vert:Fg,sprite_frag:Bg},ae={common:{diffuse:{value:new Ge(16777215)},opacity:{value:1},map:{value:null},uvTransform:{value:new ft},uv2Transform:{value:new ft},alphaMap:{value:null},alphaTest:{value:0}},specularmap:{specularMap:{value:null}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1}},emissivemap:{emissiveMap:{value:null}},bumpmap:{bumpMap:{value:null},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalScale:{value:new Ue(1,1)}},displacementmap:{displacementMap:{value:null},displacementScale:{value:1},displacementBias:{value:0}},roughnessmap:{roughnessMap:{value:null}},metalnessmap:{metalnessMap:{value:null}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ge(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Ge(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaTest:{value:0},uvTransform:{value:new ft}},sprite:{diffuse:{value:new Ge(16777215)},opacity:{value:1},center:{value:new Ue(.5,.5)},rotation:{value:0},map:{value:null},alphaMap:{value:null},alphaTest:{value:0},uvTransform:{value:new ft}}},kt={basic:{uniforms:ut([ae.common,ae.specularmap,ae.envmap,ae.aomap,ae.lightmap,ae.fog]),vertexShader:Ee.meshbasic_vert,fragmentShader:Ee.meshbasic_frag},lambert:{uniforms:ut([ae.common,ae.specularmap,ae.envmap,ae.aomap,ae.lightmap,ae.emissivemap,ae.bumpmap,ae.normalmap,ae.displacementmap,ae.fog,ae.lights,{emissive:{value:new Ge(0)}}]),vertexShader:Ee.meshlambert_vert,fragmentShader:Ee.meshlambert_frag},phong:{uniforms:ut([ae.common,ae.specularmap,ae.envmap,ae.aomap,ae.lightmap,ae.emissivemap,ae.bumpmap,ae.normalmap,ae.displacementmap,ae.fog,ae.lights,{emissive:{value:new Ge(0)},specular:{value:new Ge(1118481)},shininess:{value:30}}]),vertexShader:Ee.meshphong_vert,fragmentShader:Ee.meshphong_frag},standard:{uniforms:ut([ae.common,ae.envmap,ae.aomap,ae.lightmap,ae.emissivemap,ae.bumpmap,ae.normalmap,ae.displacementmap,ae.roughnessmap,ae.metalnessmap,ae.fog,ae.lights,{emissive:{value:new Ge(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ee.meshphysical_vert,fragmentShader:Ee.meshphysical_frag},toon:{uniforms:ut([ae.common,ae.aomap,ae.lightmap,ae.emissivemap,ae.bumpmap,ae.normalmap,ae.displacementmap,ae.gradientmap,ae.fog,ae.lights,{emissive:{value:new Ge(0)}}]),vertexShader:Ee.meshtoon_vert,fragmentShader:Ee.meshtoon_frag},matcap:{uniforms:ut([ae.common,ae.bumpmap,ae.normalmap,ae.displacementmap,ae.fog,{matcap:{value:null}}]),vertexShader:Ee.meshmatcap_vert,fragmentShader:Ee.meshmatcap_frag},points:{uniforms:ut([ae.points,ae.fog]),vertexShader:Ee.points_vert,fragmentShader:Ee.points_frag},dashed:{uniforms:ut([ae.common,ae.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ee.linedashed_vert,fragmentShader:Ee.linedashed_frag},depth:{uniforms:ut([ae.common,ae.displacementmap]),vertexShader:Ee.depth_vert,fragmentShader:Ee.depth_frag},normal:{uniforms:ut([ae.common,ae.bumpmap,ae.normalmap,ae.displacementmap,{opacity:{value:1}}]),vertexShader:Ee.meshnormal_vert,fragmentShader:Ee.meshnormal_frag},sprite:{uniforms:ut([ae.sprite,ae.fog]),vertexShader:Ee.sprite_vert,fragmentShader:Ee.sprite_frag},background:{uniforms:{uvTransform:{value:new ft},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ee.background_vert,fragmentShader:Ee.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:Ee.backgroundCube_vert,fragmentShader:Ee.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ee.cube_vert,fragmentShader:Ee.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ee.equirect_vert,fragmentShader:Ee.equirect_frag},distanceRGBA:{uniforms:ut([ae.common,ae.displacementmap,{referencePosition:{value:new H},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ee.distanceRGBA_vert,fragmentShader:Ee.distanceRGBA_frag},shadow:{uniforms:ut([ae.lights,ae.fog,{color:{value:new Ge(0)},opacity:{value:1}}]),vertexShader:Ee.shadow_vert,fragmentShader:Ee.shadow_frag}};kt.physical={uniforms:ut([kt.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatNormalScale:{value:new Ue(1,1)},clearcoatNormalMap:{value:null},iridescence:{value:0},iridescenceMap:{value:null},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},sheen:{value:0},sheenColor:{value:new Ge(0)},sheenColorMap:{value:null},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},transmission:{value:0},transmissionMap:{value:null},transmissionSamplerSize:{value:new Ue},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},attenuationDistance:{value:0},attenuationColor:{value:new Ge(0)},specularIntensity:{value:1},specularIntensityMap:{value:null},specularColor:{value:new Ge(1,1,1)},specularColorMap:{value:null}}]),vertexShader:Ee.meshphysical_vert,fragmentShader:Ee.meshphysical_frag};var ws={r:0,b:0,g:0};function zg(s,e,t,n,i,r,a){let o=new Ge(0),l=r===!0?0:1,c,h,d=null,u=0,m=null;function _(p,b){let E=!1,y=b.isScene===!0?b.background:null;y&&y.isTexture&&(y=(b.backgroundBlurriness>0?t:e).get(y));let M=s.xr,T=M.getSession&&M.getSession();T&&T.environmentBlendMode==="additive"&&(y=null),y===null?f(o,l):y&&y.isColor&&(f(y,1),E=!0),(s.autoClear||E)&&s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil),y&&(y.isCubeTexture||y.mapping===Qi)?(h===void 0&&(h=new Ct(new jt(1,1,1),new hn({name:"BackgroundCubeMaterial",uniforms:ii(kt.backgroundCube.uniforms),vertexShader:kt.backgroundCube.vertexShader,fragmentShader:kt.backgroundCube.fragmentShader,side:vt,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(P,N,g){this.matrixWorld.copyPosition(g.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(h)),h.material.uniforms.envMap.value=y,h.material.uniforms.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=b.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,h.material.toneMapped=y.encoding!==ke,(d!==y||u!==y.version||m!==s.toneMapping)&&(h.material.needsUpdate=!0,d=y,u=y.version,m=s.toneMapping),h.layers.enableAll(),p.unshift(h,h.geometry,h.material,0,0,null)):y&&y.isTexture&&(c===void 0&&(c=new Ct(new Ms(2,2),new hn({name:"BackgroundMaterial",uniforms:ii(kt.background.uniforms),vertexShader:kt.background.vertexShader,fragmentShader:kt.background.fragmentShader,side:Qt,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(c)),c.material.uniforms.t2D.value=y,c.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,c.material.toneMapped=y.encoding!==ke,y.matrixAutoUpdate===!0&&y.updateMatrix(),c.material.uniforms.uvTransform.value.copy(y.matrix),(d!==y||u!==y.version||m!==s.toneMapping)&&(c.material.needsUpdate=!0,d=y,u=y.version,m=s.toneMapping),c.layers.enableAll(),p.unshift(c,c.geometry,c.material,0,0,null))}function f(p,b){p.getRGB(ws,Pl(s)),n.buffers.color.setClear(ws.r,ws.g,ws.b,b,a)}return{getClearColor:function(){return o},setClearColor:function(p,b=1){o.set(p),l=b,f(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(p){l=p,f(o,l)},render:_}}function Ug(s,e,t,n){let i=s.getParameter(34921),r=n.isWebGL2?null:e.get("OES_vertex_array_object"),a=n.isWebGL2||r!==null,o={},l=p(null),c=l,h=!1;function d(B,A,C,J,k){let j=!1;if(a){let Z=f(J,C,A);c!==Z&&(c=Z,m(c.object)),j=b(B,J,C,k),j&&E(B,J,C,k)}else{let Z=A.wireframe===!0;(c.geometry!==J.id||c.program!==C.id||c.wireframe!==Z)&&(c.geometry=J.id,c.program=C.id,c.wireframe=Z,j=!0)}k!==null&&t.update(k,34963),(j||h)&&(h=!1,g(B,A,C,J),k!==null&&s.bindBuffer(34963,t.get(k).buffer))}function u(){return n.isWebGL2?s.createVertexArray():r.createVertexArrayOES()}function m(B){return n.isWebGL2?s.bindVertexArray(B):r.bindVertexArrayOES(B)}function _(B){return n.isWebGL2?s.deleteVertexArray(B):r.deleteVertexArrayOES(B)}function f(B,A,C){let J=C.wireframe===!0,k=o[B.id];k===void 0&&(k={},o[B.id]=k);let j=k[A.id];j===void 0&&(j={},k[A.id]=j);let Z=j[J];return Z===void 0&&(Z=p(u()),j[J]=Z),Z}function p(B){let A=[],C=[],J=[];for(let k=0;k<i;k++)A[k]=0,C[k]=0,J[k]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:A,enabledAttributes:C,attributeDivisors:J,object:B,attributes:{},index:null}}function b(B,A,C,J){let k=c.attributes,j=A.attributes,Z=0,fe=C.getAttributes();for(let U in fe)if(fe[U].location>=0){let se=k[U],ie=j[U];if(ie===void 0&&(U==="instanceMatrix"&&B.instanceMatrix&&(ie=B.instanceMatrix),U==="instanceColor"&&B.instanceColor&&(ie=B.instanceColor)),se===void 0||se.attribute!==ie||ie&&se.data!==ie.data)return!0;Z++}return c.attributesNum!==Z||c.index!==J}function E(B,A,C,J){let k={},j=A.attributes,Z=0,fe=C.getAttributes();for(let U in fe)if(fe[U].location>=0){let se=j[U];se===void 0&&(U==="instanceMatrix"&&B.instanceMatrix&&(se=B.instanceMatrix),U==="instanceColor"&&B.instanceColor&&(se=B.instanceColor));let ie={};ie.attribute=se,se&&se.data&&(ie.data=se.data),k[U]=ie,Z++}c.attributes=k,c.attributesNum=Z,c.index=J}function y(){let B=c.newAttributes;for(let A=0,C=B.length;A<C;A++)B[A]=0}function M(B){T(B,0)}function T(B,A){let C=c.newAttributes,J=c.enabledAttributes,k=c.attributeDivisors;C[B]=1,J[B]===0&&(s.enableVertexAttribArray(B),J[B]=1),k[B]!==A&&((n.isWebGL2?s:e.get("ANGLE_instanced_arrays"))[n.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](B,A),k[B]=A)}function P(){let B=c.newAttributes,A=c.enabledAttributes;for(let C=0,J=A.length;C<J;C++)A[C]!==B[C]&&(s.disableVertexAttribArray(C),A[C]=0)}function N(B,A,C,J,k,j){n.isWebGL2===!0&&(C===5124||C===5125)?s.vertexAttribIPointer(B,A,C,k,j):s.vertexAttribPointer(B,A,C,J,k,j)}function g(B,A,C,J){if(n.isWebGL2===!1&&(B.isInstancedMesh||J.isInstancedBufferGeometry)&&e.get("ANGLE_instanced_arrays")===null)return;y();let k=J.attributes,j=C.getAttributes(),Z=A.defaultAttributeValues;for(let fe in j){let U=j[fe];if(U.location>=0){let Q=k[fe];if(Q===void 0&&(fe==="instanceMatrix"&&B.instanceMatrix&&(Q=B.instanceMatrix),fe==="instanceColor"&&B.instanceColor&&(Q=B.instanceColor)),Q!==void 0){let se=Q.normalized,ie=Q.itemSize,I=t.get(Q);if(I===void 0)continue;let Me=I.buffer,ge=I.type,V=I.bytesPerElement;if(Q.isInterleavedBufferAttribute){let ee=Q.data,K=ee.stride,oe=Q.offset;if(ee.isInstancedInterleavedBuffer){for(let ce=0;ce<U.locationSize;ce++)T(U.location+ce,ee.meshPerAttribute);B.isInstancedMesh!==!0&&J._maxInstanceCount===void 0&&(J._maxInstanceCount=ee.meshPerAttribute*ee.count)}else for(let ce=0;ce<U.locationSize;ce++)M(U.location+ce);s.bindBuffer(34962,Me);for(let ce=0;ce<U.locationSize;ce++)N(U.location+ce,ie/U.locationSize,ge,se,K*V,(oe+ie/U.locationSize*ce)*V)}else{if(Q.isInstancedBufferAttribute){for(let ee=0;ee<U.locationSize;ee++)T(U.location+ee,Q.meshPerAttribute);B.isInstancedMesh!==!0&&J._maxInstanceCount===void 0&&(J._maxInstanceCount=Q.meshPerAttribute*Q.count)}else for(let ee=0;ee<U.locationSize;ee++)M(U.location+ee);s.bindBuffer(34962,Me);for(let ee=0;ee<U.locationSize;ee++)N(U.location+ee,ie/U.locationSize,ge,se,ie*V,ie/U.locationSize*ee*V)}}else if(Z!==void 0){let se=Z[fe];if(se!==void 0)switch(se.length){case 2:s.vertexAttrib2fv(U.location,se);break;case 3:s.vertexAttrib3fv(U.location,se);break;case 4:s.vertexAttrib4fv(U.location,se);break;default:s.vertexAttrib1fv(U.location,se)}}}}P()}function w(){X();for(let B in o){let A=o[B];for(let C in A){let J=A[C];for(let k in J)_(J[k].object),delete J[k];delete A[C]}delete o[B]}}function D(B){if(o[B.id]===void 0)return;let A=o[B.id];for(let C in A){let J=A[C];for(let k in J)_(J[k].object),delete J[k];delete A[C]}delete o[B.id]}function R(B){for(let A in o){let C=o[A];if(C[B.id]===void 0)continue;let J=C[B.id];for(let k in J)_(J[k].object),delete J[k];delete C[B.id]}}function X(){O(),h=!0,c!==l&&(c=l,m(c.object))}function O(){l.geometry=null,l.program=null,l.wireframe=!1}return{setup:d,reset:X,resetDefaultState:O,dispose:w,releaseStatesOfGeometry:D,releaseStatesOfProgram:R,initAttributes:y,enableAttribute:M,disableUnusedAttributes:P}}function kg(s,e,t,n){let i=n.isWebGL2,r;function a(c){r=c}function o(c,h){s.drawArrays(r,c,h),t.update(h,r,1)}function l(c,h,d){if(d===0)return;let u,m;if(i)u=s,m="drawArraysInstanced";else if(u=e.get("ANGLE_instanced_arrays"),m="drawArraysInstancedANGLE",u===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}u[m](r,c,h,d),t.update(h,r,d)}this.setMode=a,this.render=o,this.renderInstances=l}function Hg(s,e,t){let n;function i(){if(n!==void 0)return n;if(e.has("EXT_texture_filter_anisotropic")===!0){let N=e.get("EXT_texture_filter_anisotropic");n=s.getParameter(N.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n}function r(N){if(N==="highp"){if(s.getShaderPrecisionFormat(35633,36338).precision>0&&s.getShaderPrecisionFormat(35632,36338).precision>0)return"highp";N="mediump"}return N==="mediump"&&s.getShaderPrecisionFormat(35633,36337).precision>0&&s.getShaderPrecisionFormat(35632,36337).precision>0?"mediump":"lowp"}let a=typeof WebGL2RenderingContext!="undefined"&&s instanceof WebGL2RenderingContext,o=t.precision!==void 0?t.precision:"highp",l=r(o);l!==o&&(console.warn("THREE.WebGLRenderer:",o,"not supported, using",l,"instead."),o=l);let c=a||e.has("WEBGL_draw_buffers"),h=t.logarithmicDepthBuffer===!0,d=s.getParameter(34930),u=s.getParameter(35660),m=s.getParameter(3379),_=s.getParameter(34076),f=s.getParameter(34921),p=s.getParameter(36347),b=s.getParameter(36348),E=s.getParameter(36349),y=u>0,M=a||e.has("OES_texture_float"),T=y&&M,P=a?s.getParameter(36183):0;return{isWebGL2:a,drawBuffers:c,getMaxAnisotropy:i,getMaxPrecision:r,precision:o,logarithmicDepthBuffer:h,maxTextures:d,maxVertexTextures:u,maxTextureSize:m,maxCubemapSize:_,maxAttributes:f,maxVertexUniforms:p,maxVaryings:b,maxFragmentUniforms:E,vertexTextures:y,floatFragmentTextures:M,floatVertexTextures:T,maxSamples:P}}function Vg(s){let e=this,t=null,n=0,i=!1,r=!1,a=new un,o=new ft,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(d,u){let m=d.length!==0||u||n!==0||i;return i=u,n=d.length,m},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,u){t=h(d,u,0)},this.setState=function(d,u,m){let _=d.clippingPlanes,f=d.clipIntersection,p=d.clipShadows,b=s.get(d);if(!i||_===null||_.length===0||r&&!p)r?h(null):c();else{let E=r?0:n,y=E*4,M=b.clippingState||null;l.value=M,M=h(_,u,y,m);for(let T=0;T!==y;++T)M[T]=t[T];b.clippingState=M,this.numIntersection=f?this.numPlanes:0,this.numPlanes+=E}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(d,u,m,_){let f=d!==null?d.length:0,p=null;if(f!==0){if(p=l.value,_!==!0||p===null){let b=m+f*4,E=u.matrixWorldInverse;o.getNormalMatrix(E),(p===null||p.length<b)&&(p=new Float32Array(b));for(let y=0,M=m;y!==f;++y,M+=4)a.copy(d[y]).applyMatrix4(E,o),a.normal.toArray(p,M),p[M+3]=a.constant}l.value=p,l.needsUpdate=!0}return e.numPlanes=f,e.numIntersection=0,p}}function Gg(s){let e=new WeakMap;function t(a,o){return o===ur?a.mapping=Hn:o===dr&&(a.mapping=Vn),a}function n(a){if(a&&a.isTexture&&a.isRenderTargetTexture===!1){let o=a.mapping;if(o===ur||o===dr)if(e.has(a)){let l=e.get(a).texture;return t(l,a.mapping)}else{let l=a.image;if(l&&l.height>0){let c=new Dl(l.height/2);return c.fromEquirectangularTexture(s,a),e.set(a,c),a.addEventListener("dispose",i),t(c.texture,a.mapping)}else return null}}return a}function i(a){let o=a.target;o.removeEventListener("dispose",i);let l=e.get(o);l!==void 0&&(e.delete(o),l.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}var Ol=class extends jr{constructor(e=-1,t=1,n=1,i=-1,r=.1,a=2e3){super();this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=i,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,i,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2,r=n-e,a=n+e,o=i+t,l=i-t;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},ai=4,Fl=[.125,.215,.35,.446,.526,.582],In=20,no=new Ol,Bl=new Ge,io=null,Dn=(1+Math.sqrt(5))/2,li=1/Dn,zl=[new H(1,1,1),new H(-1,1,1),new H(1,1,-1),new H(-1,1,-1),new H(0,Dn,li),new H(0,Dn,-li),new H(li,0,Dn),new H(-li,0,Dn),new H(Dn,li,0),new H(-Dn,li,0)],so=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,i=100){io=this._renderer.getRenderTarget(),this._setSize(256);let r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(e,n,i,r),t>0&&this._blur(r,0,0,t),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Hl(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=kl(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(io),e.scissorTest=!1,Ss(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Hn||e.mapping===Vn?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),io=this._renderer.getRenderTarget();let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,16*7),t=4*this._cubeSize,n={magFilter:Et,minFilter:Et,generateMipmaps:!1,type:Mi,format:It,encoding:An,depthBuffer:!1},i=Ul(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Ul(e,t,n);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Wg(r)),this._blurMaterial=qg(r,e,t)}return i}_compileMaterial(e){let t=new Ct(this._lodPlanes[0],e);this._renderer.compile(t,no)}_sceneToCubeUV(e,t,n,i){let r=90,a=1,o=new gt(r,a,t,n),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,d=h.autoClear,u=h.toneMapping;h.getClearColor(Bl),h.toneMapping=Xt,h.autoClear=!1;let m=new ei({name:"PMREM.Background",side:vt,depthWrite:!1,depthTest:!1}),_=new Ct(new jt,m),f=!1,p=e.background;p?p.isColor&&(m.color.copy(p),e.background=null,f=!0):(m.color.copy(Bl),f=!0);for(let b=0;b<6;b++){let E=b%3;E===0?(o.up.set(0,l[b],0),o.lookAt(c[b],0,0)):E===1?(o.up.set(0,0,l[b]),o.lookAt(0,c[b],0)):(o.up.set(0,l[b],0),o.lookAt(0,0,c[b]));let y=this._cubeSize;Ss(i,E*y,b>2?y:0,y,y),h.setRenderTarget(i),f&&h.render(_,o),h.render(e,o)}_.geometry.dispose(),_.material.dispose(),h.toneMapping=u,h.autoClear=d,e.background=p}_textureToCubeUV(e,t){let n=this._renderer,i=e.mapping===Hn||e.mapping===Vn;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=Hl()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=kl());let r=i?this._cubemapMaterial:this._equirectMaterial,a=new Ct(this._lodPlanes[0],r),o=r.uniforms;o.envMap.value=e;let l=this._cubeSize;Ss(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(a,no)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;for(let i=1;i<this._lodPlanes.length;i++){let r=Math.sqrt(this._sigmas[i]*this._sigmas[i]-this._sigmas[i-1]*this._sigmas[i-1]),a=zl[(i-1)%zl.length];this._blur(e,i-1,i,r,a)}t.autoClear=n}_blur(e,t,n,i,r){let a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,i,"latitudinal",r),this._halfBlur(a,e,n,n,i,"longitudinal",r)}_halfBlur(e,t,n,i,r,a,o){let l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let h=3,d=new Ct(this._lodPlanes[i],c),u=c.uniforms,m=this._sizeLods[n]-1,_=isFinite(r)?Math.PI/(2*m):2*Math.PI/(2*In-1),f=r/_,p=isFinite(r)?1+Math.floor(h*f):In;p>In&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${In}`);let b=[],E=0;for(let N=0;N<In;++N){let g=N/f,w=Math.exp(-g*g/2);b.push(w),N===0?E+=w:N<p&&(E+=2*w)}for(let N=0;N<b.length;N++)b[N]=b[N]/E;u.envMap.value=e.texture,u.samples.value=p,u.weights.value=b,u.latitudinal.value=a==="latitudinal",o&&(u.poleAxis.value=o);let{_lodMax:y}=this;u.dTheta.value=_,u.mipInt.value=y-n;let M=this._sizeLods[i],T=3*M*(i>y-ai?i-y+ai:0),P=4*(this._cubeSize-M);Ss(t,T,P,3*M,2*M),l.setRenderTarget(t),l.render(d,no)}};function Wg(s){let e=[],t=[],n=[],i=s,r=s-ai+1+Fl.length;for(let a=0;a<r;a++){let o=Math.pow(2,i);t.push(o);let l=1/o;a>s-ai?l=Fl[a-s+ai-1]:a===0&&(l=0),n.push(l);let c=1/(o-2),h=-c,d=1+c,u=[h,h,d,h,d,d,h,h,d,d,h,d],m=6,_=6,f=3,p=2,b=1,E=new Float32Array(f*_*m),y=new Float32Array(p*_*m),M=new Float32Array(b*_*m);for(let P=0;P<m;P++){let N=P%3*2/3-1,g=P>2?0:-1,w=[N,g,0,N+2/3,g,0,N+2/3,g+1,0,N,g,0,N+2/3,g+1,0,N,g+1,0];E.set(w,f*_*P),y.set(u,p*_*P);let D=[P,P,P,P,P,P];M.set(D,b*_*P)}let T=new cn;T.setAttribute("position",new Ft(E,f)),T.setAttribute("uv",new Ft(y,p)),T.setAttribute("faceIndex",new Ft(M,b)),e.push(T),i>ai&&i--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function Ul(s,e,t){let n=new nn(s,e,t);return n.texture.mapping=Qi,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Ss(s,e,t,n,i){s.viewport.set(e,t,n,i),s.scissor.set(e,t,n,i)}function qg(s,e,t){let n=new Float32Array(In),i=new H(0,1,0);return new hn({name:"SphericalGaussianBlur",defines:{n:In,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:ro(),fragmentShader:`

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
		`,blending:tn,depthTest:!1,depthWrite:!1})}function kl(){return new hn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:ro(),fragmentShader:`

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
		`,blending:tn,depthTest:!1,depthWrite:!1})}function Hl(){return new hn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:ro(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:tn,depthTest:!1,depthWrite:!1})}function ro(){return`

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
	`}function Xg(s){let e=new WeakMap,t=null;function n(o){if(o&&o.isTexture){let l=o.mapping,c=l===ur||l===dr,h=l===Hn||l===Vn;if(c||h)if(o.isRenderTargetTexture&&o.needsPMREMUpdate===!0){o.needsPMREMUpdate=!1;let d=e.get(o);return t===null&&(t=new so(s)),d=c?t.fromEquirectangular(o,d):t.fromCubemap(o,d),e.set(o,d),d.texture}else{if(e.has(o))return e.get(o).texture;{let d=o.image;if(c&&d&&d.height>0||h&&d&&i(d)){t===null&&(t=new so(s));let u=c?t.fromEquirectangular(o):t.fromCubemap(o);return e.set(o,u),o.addEventListener("dispose",r),u.texture}else return null}}}return o}function i(o){let l=0,c=6;for(let h=0;h<c;h++)o[h]!==void 0&&l++;return l===c}function r(o){let l=o.target;l.removeEventListener("dispose",r);let c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function a(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:a}}function Yg(s){let e={};function t(n){if(e[n]!==void 0)return e[n];let i;switch(n){case"WEBGL_depth_texture":i=s.getExtension("WEBGL_depth_texture")||s.getExtension("MOZ_WEBGL_depth_texture")||s.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":i=s.getExtension("EXT_texture_filter_anisotropic")||s.getExtension("MOZ_EXT_texture_filter_anisotropic")||s.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":i=s.getExtension("WEBGL_compressed_texture_s3tc")||s.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":i=s.getExtension("WEBGL_compressed_texture_pvrtc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:i=s.getExtension(n)}return e[n]=i,i}return{has:function(n){return t(n)!==null},init:function(n){n.isWebGL2?t("EXT_color_buffer_float"):(t("WEBGL_depth_texture"),t("OES_texture_float"),t("OES_texture_half_float"),t("OES_texture_half_float_linear"),t("OES_standard_derivatives"),t("OES_element_index_uint"),t("OES_vertex_array_object"),t("ANGLE_instanced_arrays")),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture")},get:function(n){let i=t(n);return i===null&&console.warn("THREE.WebGLRenderer: "+n+" extension not supported."),i}}}function $g(s,e,t,n){let i={},r=new WeakMap;function a(d){let u=d.target;u.index!==null&&e.remove(u.index);for(let _ in u.attributes)e.remove(u.attributes[_]);u.removeEventListener("dispose",a),delete i[u.id];let m=r.get(u);m&&(e.remove(m),r.delete(u)),n.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,t.memory.geometries--}function o(d,u){return i[u.id]===!0||(u.addEventListener("dispose",a),i[u.id]=!0,t.memory.geometries++),u}function l(d){let u=d.attributes;for(let _ in u)e.update(u[_],34962);let m=d.morphAttributes;for(let _ in m){let f=m[_];for(let p=0,b=f.length;p<b;p++)e.update(f[p],34962)}}function c(d){let u=[],m=d.index,_=d.attributes.position,f=0;if(m!==null){let E=m.array;f=m.version;for(let y=0,M=E.length;y<M;y+=3){let T=E[y+0],P=E[y+1],N=E[y+2];u.push(T,P,P,N,N,T)}}else{let E=_.array;f=_.version;for(let y=0,M=E.length/3-1;y<M;y+=3){let T=y+0,P=y+1,N=y+2;u.push(T,P,P,N,N,T)}}let p=new(_l(u)?Yr:Xr)(u,1);p.version=f;let b=r.get(d);b&&e.remove(b),r.set(d,p)}function h(d){let u=r.get(d);if(u){let m=d.index;m!==null&&u.version<m.version&&c(d)}else c(d);return r.get(d)}return{get:o,update:l,getWireframeAttribute:h}}function Kg(s,e,t,n){let i=n.isWebGL2,r;function a(u){r=u}let o,l;function c(u){o=u.type,l=u.bytesPerElement}function h(u,m){s.drawElements(r,m,o,u*l),t.update(m,r,1)}function d(u,m,_){if(_===0)return;let f,p;if(i)f=s,p="drawElementsInstanced";else if(f=e.get("ANGLE_instanced_arrays"),p="drawElementsInstancedANGLE",f===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}f[p](r,m,o,u*l,_),t.update(m,r,_)}this.setMode=a,this.setIndex=c,this.render=h,this.renderInstances=d}function Zg(s){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(t.calls++,a){case 4:t.triangles+=o*(r/3);break;case 1:t.lines+=o*(r/2);break;case 3:t.lines+=o*(r-1);break;case 2:t.lines+=o*r;break;case 0:t.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function i(){t.frame++,t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:i,update:n}}function Jg(s,e){return s[0]-e[0]}function jg(s,e){return Math.abs(e[1])-Math.abs(s[1])}function Qg(s,e,t){let n={},i=new Float32Array(8),r=new WeakMap,a=new nt,o=[];for(let c=0;c<8;c++)o[c]=[c,0];function l(c,h,d,u){let m=c.morphTargetInfluences;if(e.isWebGL2===!0){let _=h.morphAttributes.position||h.morphAttributes.normal||h.morphAttributes.color,f=_!==void 0?_.length:0,p=r.get(h);if(p===void 0||p.count!==f){let A=function(){O.dispose(),r.delete(h),h.removeEventListener("dispose",A)};p!==void 0&&p.texture.dispose();let y=h.morphAttributes.position!==void 0,M=h.morphAttributes.normal!==void 0,T=h.morphAttributes.color!==void 0,P=h.morphAttributes.position||[],N=h.morphAttributes.normal||[],g=h.morphAttributes.color||[],w=0;y===!0&&(w=1),M===!0&&(w=2),T===!0&&(w=3);let D=h.attributes.position.count*w,R=1;D>e.maxTextureSize&&(R=Math.ceil(D/e.maxTextureSize),D=e.maxTextureSize);let X=new Float32Array(D*R*4*f),O=new Dr(X,D,R,f);O.type=wn,O.needsUpdate=!0;let B=w*4;for(let C=0;C<f;C++){let J=P[C],k=N[C],j=g[C],Z=D*R*4*C;for(let fe=0;fe<J.count;fe++){let U=fe*B;y===!0&&(a.fromBufferAttribute(J,fe),X[Z+U+0]=a.x,X[Z+U+1]=a.y,X[Z+U+2]=a.z,X[Z+U+3]=0),M===!0&&(a.fromBufferAttribute(k,fe),X[Z+U+4]=a.x,X[Z+U+5]=a.y,X[Z+U+6]=a.z,X[Z+U+7]=0),T===!0&&(a.fromBufferAttribute(j,fe),X[Z+U+8]=a.x,X[Z+U+9]=a.y,X[Z+U+10]=a.z,X[Z+U+11]=j.itemSize===4?a.w:1)}}p={count:f,texture:O,size:new Ue(D,R)},r.set(h,p),h.addEventListener("dispose",A)}let b=0;for(let y=0;y<m.length;y++)b+=m[y];let E=h.morphTargetsRelative?1:1-b;u.getUniforms().setValue(s,"morphTargetBaseInfluence",E),u.getUniforms().setValue(s,"morphTargetInfluences",m),u.getUniforms().setValue(s,"morphTargetsTexture",p.texture,t),u.getUniforms().setValue(s,"morphTargetsTextureSize",p.size)}else{let _=m===void 0?0:m.length,f=n[h.id];if(f===void 0||f.length!==_){f=[];for(let M=0;M<_;M++)f[M]=[M,0];n[h.id]=f}for(let M=0;M<_;M++){let T=f[M];T[0]=M,T[1]=m[M]}f.sort(jg);for(let M=0;M<8;M++)M<_&&f[M][1]?(o[M][0]=f[M][0],o[M][1]=f[M][1]):(o[M][0]=Number.MAX_SAFE_INTEGER,o[M][1]=0);o.sort(Jg);let p=h.morphAttributes.position,b=h.morphAttributes.normal,E=0;for(let M=0;M<8;M++){let T=o[M],P=T[0],N=T[1];P!==Number.MAX_SAFE_INTEGER&&N?(p&&h.getAttribute("morphTarget"+M)!==p[P]&&h.setAttribute("morphTarget"+M,p[P]),b&&h.getAttribute("morphNormal"+M)!==b[P]&&h.setAttribute("morphNormal"+M,b[P]),i[M]=N,E+=N):(p&&h.hasAttribute("morphTarget"+M)===!0&&h.deleteAttribute("morphTarget"+M),b&&h.hasAttribute("morphNormal"+M)===!0&&h.deleteAttribute("morphNormal"+M),i[M]=0)}let y=h.morphTargetsRelative?1:1-E;u.getUniforms().setValue(s,"morphTargetBaseInfluence",y),u.getUniforms().setValue(s,"morphTargetInfluences",i)}}return{update:l}}function e0(s,e,t,n){let i=new WeakMap;function r(l){let c=n.render.frame,h=l.geometry,d=e.get(l,h);return i.get(d)!==c&&(e.update(d),i.set(d,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),t.update(l.instanceMatrix,34962),l.instanceColor!==null&&t.update(l.instanceColor,34962)),d}function a(){i=new WeakMap}function o(l){let c=l.target;c.removeEventListener("dispose",o),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:r,dispose:a}}var Vl=new pt,Gl=new Dr,Wl=new yl,ql=new Qr,Xl=[],Yl=[],$l=new Float32Array(16),Kl=new Float32Array(9),Zl=new Float32Array(4);function ci(s,e,t){let n=s[0];if(n<=0||n>0)return s;let i=e*t,r=Xl[i];if(r===void 0&&(r=new Float32Array(i),Xl[i]=r),e!==0){n.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,s[a].toArray(r,o)}return r}function Je(s,e){if(s.length!==e.length)return!1;for(let t=0,n=s.length;t<n;t++)if(s[t]!==e[t])return!1;return!0}function je(s,e){for(let t=0,n=e.length;t<n;t++)s[t]=e[t]}function As(s,e){let t=Yl[e];t===void 0&&(t=new Int32Array(e),Yl[e]=t);for(let n=0;n!==e;++n)t[n]=s.allocateTextureUnit();return t}function t0(s,e){let t=this.cache;t[0]!==e&&(s.uniform1f(this.addr,e),t[0]=e)}function n0(s,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Je(t,e))return;s.uniform2fv(this.addr,e),je(t,e)}}function i0(s,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(s.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Je(t,e))return;s.uniform3fv(this.addr,e),je(t,e)}}function s0(s,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Je(t,e))return;s.uniform4fv(this.addr,e),je(t,e)}}function r0(s,e){let t=this.cache,n=e.elements;if(n===void 0){if(Je(t,e))return;s.uniformMatrix2fv(this.addr,!1,e),je(t,e)}else{if(Je(t,n))return;Zl.set(n),s.uniformMatrix2fv(this.addr,!1,Zl),je(t,n)}}function o0(s,e){let t=this.cache,n=e.elements;if(n===void 0){if(Je(t,e))return;s.uniformMatrix3fv(this.addr,!1,e),je(t,e)}else{if(Je(t,n))return;Kl.set(n),s.uniformMatrix3fv(this.addr,!1,Kl),je(t,n)}}function a0(s,e){let t=this.cache,n=e.elements;if(n===void 0){if(Je(t,e))return;s.uniformMatrix4fv(this.addr,!1,e),je(t,e)}else{if(Je(t,n))return;$l.set(n),s.uniformMatrix4fv(this.addr,!1,$l),je(t,n)}}function l0(s,e){let t=this.cache;t[0]!==e&&(s.uniform1i(this.addr,e),t[0]=e)}function c0(s,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Je(t,e))return;s.uniform2iv(this.addr,e),je(t,e)}}function h0(s,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Je(t,e))return;s.uniform3iv(this.addr,e),je(t,e)}}function u0(s,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Je(t,e))return;s.uniform4iv(this.addr,e),je(t,e)}}function d0(s,e){let t=this.cache;t[0]!==e&&(s.uniform1ui(this.addr,e),t[0]=e)}function f0(s,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Je(t,e))return;s.uniform2uiv(this.addr,e),je(t,e)}}function p0(s,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Je(t,e))return;s.uniform3uiv(this.addr,e),je(t,e)}}function m0(s,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Je(t,e))return;s.uniform4uiv(this.addr,e),je(t,e)}}function g0(s,e,t){let n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTexture2D(e||Vl,i)}function _0(s,e,t){let n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTexture3D(e||Wl,i)}function x0(s,e,t){let n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTextureCube(e||ql,i)}function y0(s,e,t){let n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTexture2DArray(e||Gl,i)}function v0(s){switch(s){case 5126:return t0;case 35664:return n0;case 35665:return i0;case 35666:return s0;case 35674:return r0;case 35675:return o0;case 35676:return a0;case 5124:case 35670:return l0;case 35667:case 35671:return c0;case 35668:case 35672:return h0;case 35669:case 35673:return u0;case 5125:return d0;case 36294:return f0;case 36295:return p0;case 36296:return m0;case 35678:case 36198:case 36298:case 36306:case 35682:return g0;case 35679:case 36299:case 36307:return _0;case 35680:case 36300:case 36308:case 36293:return x0;case 36289:case 36303:case 36311:case 36292:return y0}}function b0(s,e){s.uniform1fv(this.addr,e)}function M0(s,e){let t=ci(e,this.size,2);s.uniform2fv(this.addr,t)}function w0(s,e){let t=ci(e,this.size,3);s.uniform3fv(this.addr,t)}function S0(s,e){let t=ci(e,this.size,4);s.uniform4fv(this.addr,t)}function A0(s,e){let t=ci(e,this.size,4);s.uniformMatrix2fv(this.addr,!1,t)}function E0(s,e){let t=ci(e,this.size,9);s.uniformMatrix3fv(this.addr,!1,t)}function T0(s,e){let t=ci(e,this.size,16);s.uniformMatrix4fv(this.addr,!1,t)}function C0(s,e){s.uniform1iv(this.addr,e)}function R0(s,e){s.uniform2iv(this.addr,e)}function L0(s,e){s.uniform3iv(this.addr,e)}function P0(s,e){s.uniform4iv(this.addr,e)}function I0(s,e){s.uniform1uiv(this.addr,e)}function D0(s,e){s.uniform2uiv(this.addr,e)}function N0(s,e){s.uniform3uiv(this.addr,e)}function O0(s,e){s.uniform4uiv(this.addr,e)}function F0(s,e,t){let n=this.cache,i=e.length,r=As(t,i);Je(n,r)||(s.uniform1iv(this.addr,r),je(n,r));for(let a=0;a!==i;++a)t.setTexture2D(e[a]||Vl,r[a])}function B0(s,e,t){let n=this.cache,i=e.length,r=As(t,i);Je(n,r)||(s.uniform1iv(this.addr,r),je(n,r));for(let a=0;a!==i;++a)t.setTexture3D(e[a]||Wl,r[a])}function z0(s,e,t){let n=this.cache,i=e.length,r=As(t,i);Je(n,r)||(s.uniform1iv(this.addr,r),je(n,r));for(let a=0;a!==i;++a)t.setTextureCube(e[a]||ql,r[a])}function U0(s,e,t){let n=this.cache,i=e.length,r=As(t,i);Je(n,r)||(s.uniform1iv(this.addr,r),je(n,r));for(let a=0;a!==i;++a)t.setTexture2DArray(e[a]||Gl,r[a])}function k0(s){switch(s){case 5126:return b0;case 35664:return M0;case 35665:return w0;case 35666:return S0;case 35674:return A0;case 35675:return E0;case 35676:return T0;case 5124:case 35670:return C0;case 35667:case 35671:return R0;case 35668:case 35672:return L0;case 35669:case 35673:return P0;case 5125:return I0;case 36294:return D0;case 36295:return N0;case 36296:return O0;case 35678:case 36198:case 36298:case 36306:case 35682:return F0;case 35679:case 36299:case 36307:return B0;case 35680:case 36300:case 36308:case 36293:return z0;case 36289:case 36303:case 36311:case 36292:return U0}}var Jl=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.setValue=v0(t.type)}},jl=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.size=t.size,this.setValue=k0(t.type)}},Ql=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let i=this.seq;for(let r=0,a=i.length;r!==a;++r){let o=i[r];o.setValue(e,t[o.id],n)}}},oo=/(\w+)(\])?(\[|\.)?/g;function ec(s,e){s.seq.push(e),s.map[e.id]=e}function H0(s,e,t){let n=s.name,i=n.length;for(oo.lastIndex=0;;){let r=oo.exec(n),a=oo.lastIndex,o=r[1],l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===i){ec(t,c===void 0?new Jl(o,s,e):new jl(o,s,e));break}else{let d=t.map[o];d===void 0&&(d=new Ql(o),ec(t,d)),t=d}}}var Ni=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,35718);for(let i=0;i<n;++i){let r=e.getActiveUniform(t,i),a=e.getUniformLocation(t,r.name);H0(r,a,this)}}setValue(e,t,n,i){let r=this.map[t];r!==void 0&&r.setValue(e,n,i)}setOptional(e,t,n){let i=t[n];i!==void 0&&this.setValue(e,n,i)}static upload(e,t,n,i){for(let r=0,a=t.length;r!==a;++r){let o=t[r],l=n[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,i)}}static seqWithValue(e,t){let n=[];for(let i=0,r=e.length;i!==r;++i){let a=e[i];a.id in t&&n.push(a)}return n}};function tc(s,e,t){let n=s.createShader(e);return s.shaderSource(n,t),s.compileShader(n),n}var V0=0;function G0(s,e){let t=s.split(`
`),n=[],i=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=i;a<r;a++){let o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}function W0(s){switch(s){case An:return["Linear","( value )"];case ke:return["sRGB","( value )"];default:return console.warn("THREE.WebGLProgram: Unsupported encoding:",s),["Linear","( value )"]}}function nc(s,e,t){let n=s.getShaderParameter(e,35713),i=s.getShaderInfoLog(e).trim();if(n&&i==="")return"";let r=/ERROR: 0:(\d+)/.exec(i);if(r){let a=parseInt(r[1]);return t.toUpperCase()+`

`+i+`

`+G0(s.getShaderSource(e),a)}else return i}function q0(s,e){let t=W0(e);return"vec4 "+s+"( vec4 value ) { return LinearTo"+t[0]+t[1]+"; }"}function X0(s,e){let t;switch(e){case mf:t="Linear";break;case gf:t="Reinhard";break;case _f:t="OptimizedCineon";break;case xf:t="ACESFilmic";break;case yf:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+s+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}function Y0(s){return[s.extensionDerivatives||!!s.envMapCubeUVHeight||s.bumpMap||s.tangentSpaceNormalMap||s.clearcoatNormalMap||s.flatShading||s.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(s.extensionFragDepth||s.logarithmicDepthBuffer)&&s.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",s.extensionDrawBuffers&&s.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(s.extensionShaderTextureLOD||s.envMap||s.transmission)&&s.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(Oi).join(`
`)}function $0(s){let e=[];for(let t in s){let n=s[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function K0(s,e){let t={},n=s.getProgramParameter(e,35721);for(let i=0;i<n;i++){let r=s.getActiveAttrib(e,i),a=r.name,o=1;r.type===35674&&(o=2),r.type===35675&&(o=3),r.type===35676&&(o=4),t[a]={type:r.type,location:s.getAttribLocation(e,a),locationSize:o}}return t}function Oi(s){return s!==""}function ic(s,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return s.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function sc(s,e){return s.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var Z0=/^[ \t]*#include +<([\w\d./]+)>/gm;function ao(s){return s.replace(Z0,J0)}function J0(s,e){let t=Ee[e];if(t===void 0)throw new Error("Can not resolve #include <"+e+">");return ao(t)}var j0=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function rc(s){return s.replace(j0,Q0)}function Q0(s,e,t,n){let i="";for(let r=parseInt(e);r<parseInt(t);r++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return i}function oc(s){let e="precision "+s.precision+` float;
precision `+s.precision+" int;";return s.precision==="highp"?e+=`
#define HIGH_PRECISION`:s.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:s.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function e_(s){let e="SHADOWMAP_TYPE_BASIC";return s.shadowMapType===Ra?e="SHADOWMAP_TYPE_PCF":s.shadowMapType===Xd?e="SHADOWMAP_TYPE_PCF_SOFT":s.shadowMapType===vi&&(e="SHADOWMAP_TYPE_VSM"),e}function t_(s){let e="ENVMAP_TYPE_CUBE";if(s.envMap)switch(s.envMapMode){case Hn:case Vn:e="ENVMAP_TYPE_CUBE";break;case Qi:e="ENVMAP_TYPE_CUBE_UV";break}return e}function n_(s){let e="ENVMAP_MODE_REFLECTION";if(s.envMap)switch(s.envMapMode){case Vn:e="ENVMAP_MODE_REFRACTION";break}return e}function i_(s){let e="ENVMAP_BLENDING_NONE";if(s.envMap)switch(s.combine){case Ba:e="ENVMAP_BLENDING_MULTIPLY";break;case ff:e="ENVMAP_BLENDING_MIX";break;case pf:e="ENVMAP_BLENDING_ADD";break}return e}function s_(s){let e=s.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:n,maxMip:t}}function r_(s,e,t,n){let i=s.getContext(),r=t.defines,a=t.vertexShader,o=t.fragmentShader,l=e_(t),c=t_(t),h=n_(t),d=i_(t),u=s_(t),m=t.isWebGL2?"":Y0(t),_=$0(r),f=i.createProgram(),p,b,E=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(p=[_].filter(Oi).join(`
`),p.length>0&&(p+=`
`),b=[m,_].filter(Oi).join(`
`),b.length>0&&(b+=`
`)):(p=[oc(t),"#define SHADER_NAME "+t.shaderName,_,t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.supportsVertexTextures?"#define VERTEX_TEXTURES":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMap&&t.objectSpaceNormalMap?"#define OBJECTSPACE_NORMALMAP":"",t.normalMap&&t.tangentSpaceNormalMap?"#define TANGENTSPACE_NORMALMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.displacementMap&&t.supportsVertexTextures?"#define USE_DISPLACEMENTMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularIntensityMap?"#define USE_SPECULARINTENSITYMAP":"",t.specularColorMap?"#define USE_SPECULARCOLORMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEENCOLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEENROUGHNESSMAP":"",t.vertexTangents?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUvs?"#define USE_UV":"",t.uvsVertexOnly?"#define UVS_VERTEX_ONLY":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors&&t.isWebGL2?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.logarithmicDepthBuffer&&t.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Oi).join(`
`),b=[m,oc(t),"#define SHADER_NAME "+t.shaderName,_,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+d:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMap&&t.objectSpaceNormalMap?"#define OBJECTSPACE_NORMALMAP":"",t.normalMap&&t.tangentSpaceNormalMap?"#define TANGENTSPACE_NORMALMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularIntensityMap?"#define USE_SPECULARINTENSITYMAP":"",t.specularColorMap?"#define USE_SPECULARCOLORMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEENCOLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEENROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.vertexTangents?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUvs?"#define USE_UV":"",t.uvsVertexOnly?"#define UVS_VERTEX_ONLY":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.physicallyCorrectLights?"#define PHYSICALLY_CORRECT_LIGHTS":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.logarithmicDepthBuffer&&t.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Xt?"#define TONE_MAPPING":"",t.toneMapping!==Xt?Ee.tonemapping_pars_fragment:"",t.toneMapping!==Xt?X0("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ee.encodings_pars_fragment,q0("linearToOutputTexel",t.outputEncoding),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Oi).join(`
`)),a=ao(a),a=ic(a,t),a=sc(a,t),o=ao(o),o=ic(o,t),o=sc(o,t),a=rc(a),o=rc(o),t.isWebGL2&&t.isRawShaderMaterial!==!0&&(E=`#version 300 es
`,p=["precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,b=["#define varying in",t.glslVersion===pl?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===pl?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+b);let y=E+p+a,M=E+b+o,T=tc(i,35633,y),P=tc(i,35632,M);if(i.attachShader(f,T),i.attachShader(f,P),t.index0AttributeName!==void 0?i.bindAttribLocation(f,0,t.index0AttributeName):t.morphTargets===!0&&i.bindAttribLocation(f,0,"position"),i.linkProgram(f),s.debug.checkShaderErrors){let w=i.getProgramInfoLog(f).trim(),D=i.getShaderInfoLog(T).trim(),R=i.getShaderInfoLog(P).trim(),X=!0,O=!0;if(i.getProgramParameter(f,35714)===!1){X=!1;let B=nc(i,T,"vertex"),A=nc(i,P,"fragment");console.error("THREE.WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(f,35715)+`

Program Info Log: `+w+`
`+B+`
`+A)}else w!==""?console.warn("THREE.WebGLProgram: Program Info Log:",w):(D===""||R==="")&&(O=!1);O&&(this.diagnostics={runnable:X,programLog:w,vertexShader:{log:D,prefix:p},fragmentShader:{log:R,prefix:b}})}i.deleteShader(T),i.deleteShader(P);let N;this.getUniforms=function(){return N===void 0&&(N=new Ni(i,f)),N};let g;return this.getAttributes=function(){return g===void 0&&(g=K0(i,f)),g},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(f),this.program=void 0},this.name=t.shaderName,this.id=V0++,this.cacheKey=e,this.usedTimes=1,this.program=f,this.vertexShader=T,this.fragmentShader=P,this}var o_=0,ac=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){let t=e.vertexShader,n=e.fragmentShader,i=this._getShaderStage(t),r=this._getShaderStage(n),a=this._getShaderCacheForMaterial(e);return a.has(i)===!1&&(a.add(i),i.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new lc(e),t.set(e,n)),n}},lc=class{constructor(e){this.id=o_++,this.code=e,this.usedTimes=0}};function a_(s,e,t,n,i,r,a){let o=new Hr,l=new ac,c=[],h=i.isWebGL2,d=i.logarithmicDepthBuffer,u=i.vertexTextures,m=i.precision,_={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function f(g,w,D,R,X){let O=R.fog,B=X.geometry,A=g.isMeshStandardMaterial?R.environment:null,C=(g.isMeshStandardMaterial?t:e).get(g.envMap||A),J=!!C&&C.mapping===Qi?C.image.height:null,k=_[g.type];g.precision!==null&&(m=i.getMaxPrecision(g.precision),m!==g.precision&&console.warn("THREE.WebGLProgram.getParameters:",g.precision,"not supported, using",m,"instead."));let j=B.morphAttributes.position||B.morphAttributes.normal||B.morphAttributes.color,Z=j!==void 0?j.length:0,fe=0;B.morphAttributes.position!==void 0&&(fe=1),B.morphAttributes.normal!==void 0&&(fe=2),B.morphAttributes.color!==void 0&&(fe=3);let U,Q,se,ie;if(k){let K=kt[k];U=K.vertexShader,Q=K.fragmentShader}else U=g.vertexShader,Q=g.fragmentShader,l.update(g),se=l.getVertexShaderID(g),ie=l.getFragmentShaderID(g);let I=s.getRenderTarget(),Me=g.alphaTest>0,ge=g.clearcoat>0,V=g.iridescence>0;return{isWebGL2:h,shaderID:k,shaderName:g.type,vertexShader:U,fragmentShader:Q,defines:g.defines,customVertexShaderID:se,customFragmentShaderID:ie,isRawShaderMaterial:g.isRawShaderMaterial===!0,glslVersion:g.glslVersion,precision:m,instancing:X.isInstancedMesh===!0,instancingColor:X.isInstancedMesh===!0&&X.instanceColor!==null,supportsVertexTextures:u,outputEncoding:I===null?s.outputEncoding:I.isXRRenderTarget===!0?I.texture.encoding:An,map:!!g.map,matcap:!!g.matcap,envMap:!!C,envMapMode:C&&C.mapping,envMapCubeUVHeight:J,lightMap:!!g.lightMap,aoMap:!!g.aoMap,emissiveMap:!!g.emissiveMap,bumpMap:!!g.bumpMap,normalMap:!!g.normalMap,objectSpaceNormalMap:g.normalMapType===Uf,tangentSpaceNormalMap:g.normalMapType===zf,decodeVideoTexture:!!g.map&&g.map.isVideoTexture===!0&&g.map.encoding===ke,clearcoat:ge,clearcoatMap:ge&&!!g.clearcoatMap,clearcoatRoughnessMap:ge&&!!g.clearcoatRoughnessMap,clearcoatNormalMap:ge&&!!g.clearcoatNormalMap,iridescence:V,iridescenceMap:V&&!!g.iridescenceMap,iridescenceThicknessMap:V&&!!g.iridescenceThicknessMap,displacementMap:!!g.displacementMap,roughnessMap:!!g.roughnessMap,metalnessMap:!!g.metalnessMap,specularMap:!!g.specularMap,specularIntensityMap:!!g.specularIntensityMap,specularColorMap:!!g.specularColorMap,opaque:g.transparent===!1&&g.blending===Un,alphaMap:!!g.alphaMap,alphaTest:Me,gradientMap:!!g.gradientMap,sheen:g.sheen>0,sheenColorMap:!!g.sheenColorMap,sheenRoughnessMap:!!g.sheenRoughnessMap,transmission:g.transmission>0,transmissionMap:!!g.transmissionMap,thicknessMap:!!g.thicknessMap,combine:g.combine,vertexTangents:!!g.normalMap&&!!B.attributes.tangent,vertexColors:g.vertexColors,vertexAlphas:g.vertexColors===!0&&!!B.attributes.color&&B.attributes.color.itemSize===4,vertexUvs:!!g.map||!!g.bumpMap||!!g.normalMap||!!g.specularMap||!!g.alphaMap||!!g.emissiveMap||!!g.roughnessMap||!!g.metalnessMap||!!g.clearcoatMap||!!g.clearcoatRoughnessMap||!!g.clearcoatNormalMap||!!g.iridescenceMap||!!g.iridescenceThicknessMap||!!g.displacementMap||!!g.transmissionMap||!!g.thicknessMap||!!g.specularIntensityMap||!!g.specularColorMap||!!g.sheenColorMap||!!g.sheenRoughnessMap,uvsVertexOnly:!(!!g.map||!!g.bumpMap||!!g.normalMap||!!g.specularMap||!!g.alphaMap||!!g.emissiveMap||!!g.roughnessMap||!!g.metalnessMap||!!g.clearcoatNormalMap||!!g.iridescenceMap||!!g.iridescenceThicknessMap||g.transmission>0||!!g.transmissionMap||!!g.thicknessMap||!!g.specularIntensityMap||!!g.specularColorMap||g.sheen>0||!!g.sheenColorMap||!!g.sheenRoughnessMap)&&!!g.displacementMap,fog:!!O,useFog:g.fog===!0,fogExp2:O&&O.isFogExp2,flatShading:!!g.flatShading,sizeAttenuation:g.sizeAttenuation,logarithmicDepthBuffer:d,skinning:X.isSkinnedMesh===!0,morphTargets:B.morphAttributes.position!==void 0,morphNormals:B.morphAttributes.normal!==void 0,morphColors:B.morphAttributes.color!==void 0,morphTargetsCount:Z,morphTextureStride:fe,numDirLights:w.directional.length,numPointLights:w.point.length,numSpotLights:w.spot.length,numSpotLightMaps:w.spotLightMap.length,numRectAreaLights:w.rectArea.length,numHemiLights:w.hemi.length,numDirLightShadows:w.directionalShadowMap.length,numPointLightShadows:w.pointShadowMap.length,numSpotLightShadows:w.spotShadowMap.length,numSpotLightShadowsWithMaps:w.numSpotLightShadowsWithMaps,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:g.dithering,shadowMapEnabled:s.shadowMap.enabled&&D.length>0,shadowMapType:s.shadowMap.type,toneMapping:g.toneMapped?s.toneMapping:Xt,physicallyCorrectLights:s.physicallyCorrectLights,premultipliedAlpha:g.premultipliedAlpha,doubleSided:g.side===en,flipSided:g.side===vt,useDepthPacking:!!g.depthPacking,depthPacking:g.depthPacking||0,index0AttributeName:g.index0AttributeName,extensionDerivatives:g.extensions&&g.extensions.derivatives,extensionFragDepth:g.extensions&&g.extensions.fragDepth,extensionDrawBuffers:g.extensions&&g.extensions.drawBuffers,extensionShaderTextureLOD:g.extensions&&g.extensions.shaderTextureLOD,rendererExtensionFragDepth:h||n.has("EXT_frag_depth"),rendererExtensionDrawBuffers:h||n.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:h||n.has("EXT_shader_texture_lod"),customProgramCacheKey:g.customProgramCacheKey()}}function p(g){let w=[];if(g.shaderID?w.push(g.shaderID):(w.push(g.customVertexShaderID),w.push(g.customFragmentShaderID)),g.defines!==void 0)for(let D in g.defines)w.push(D),w.push(g.defines[D]);return g.isRawShaderMaterial===!1&&(b(w,g),E(w,g),w.push(s.outputEncoding)),w.push(g.customProgramCacheKey),w.join()}function b(g,w){g.push(w.precision),g.push(w.outputEncoding),g.push(w.envMapMode),g.push(w.envMapCubeUVHeight),g.push(w.combine),g.push(w.vertexUvs),g.push(w.fogExp2),g.push(w.sizeAttenuation),g.push(w.morphTargetsCount),g.push(w.morphAttributeCount),g.push(w.numDirLights),g.push(w.numPointLights),g.push(w.numSpotLights),g.push(w.numSpotLightMaps),g.push(w.numHemiLights),g.push(w.numRectAreaLights),g.push(w.numDirLightShadows),g.push(w.numPointLightShadows),g.push(w.numSpotLightShadows),g.push(w.numSpotLightShadowsWithMaps),g.push(w.shadowMapType),g.push(w.toneMapping),g.push(w.numClippingPlanes),g.push(w.numClipIntersection),g.push(w.depthPacking)}function E(g,w){o.disableAll(),w.isWebGL2&&o.enable(0),w.supportsVertexTextures&&o.enable(1),w.instancing&&o.enable(2),w.instancingColor&&o.enable(3),w.map&&o.enable(4),w.matcap&&o.enable(5),w.envMap&&o.enable(6),w.lightMap&&o.enable(7),w.aoMap&&o.enable(8),w.emissiveMap&&o.enable(9),w.bumpMap&&o.enable(10),w.normalMap&&o.enable(11),w.objectSpaceNormalMap&&o.enable(12),w.tangentSpaceNormalMap&&o.enable(13),w.clearcoat&&o.enable(14),w.clearcoatMap&&o.enable(15),w.clearcoatRoughnessMap&&o.enable(16),w.clearcoatNormalMap&&o.enable(17),w.iridescence&&o.enable(18),w.iridescenceMap&&o.enable(19),w.iridescenceThicknessMap&&o.enable(20),w.displacementMap&&o.enable(21),w.specularMap&&o.enable(22),w.roughnessMap&&o.enable(23),w.metalnessMap&&o.enable(24),w.gradientMap&&o.enable(25),w.alphaMap&&o.enable(26),w.alphaTest&&o.enable(27),w.vertexColors&&o.enable(28),w.vertexAlphas&&o.enable(29),w.vertexUvs&&o.enable(30),w.vertexTangents&&o.enable(31),w.uvsVertexOnly&&o.enable(32),g.push(o.mask),o.disableAll(),w.fog&&o.enable(0),w.useFog&&o.enable(1),w.flatShading&&o.enable(2),w.logarithmicDepthBuffer&&o.enable(3),w.skinning&&o.enable(4),w.morphTargets&&o.enable(5),w.morphNormals&&o.enable(6),w.morphColors&&o.enable(7),w.premultipliedAlpha&&o.enable(8),w.shadowMapEnabled&&o.enable(9),w.physicallyCorrectLights&&o.enable(10),w.doubleSided&&o.enable(11),w.flipSided&&o.enable(12),w.useDepthPacking&&o.enable(13),w.dithering&&o.enable(14),w.specularIntensityMap&&o.enable(15),w.specularColorMap&&o.enable(16),w.transmission&&o.enable(17),w.transmissionMap&&o.enable(18),w.thicknessMap&&o.enable(19),w.sheen&&o.enable(20),w.sheenColorMap&&o.enable(21),w.sheenRoughnessMap&&o.enable(22),w.decodeVideoTexture&&o.enable(23),w.opaque&&o.enable(24),g.push(o.mask)}function y(g){let w=_[g.type],D;if(w){let R=kt[w];D=ep.clone(R.uniforms)}else D=g.uniforms;return D}function M(g,w){let D;for(let R=0,X=c.length;R<X;R++){let O=c[R];if(O.cacheKey===w){D=O,++D.usedTimes;break}}return D===void 0&&(D=new r_(s,w,g,r),c.push(D)),D}function T(g){if(--g.usedTimes==0){let w=c.indexOf(g);c[w]=c[c.length-1],c.pop(),g.destroy()}}function P(g){l.remove(g)}function N(){l.dispose()}return{getParameters:f,getProgramCacheKey:p,getUniforms:y,acquireProgram:M,releaseProgram:T,releaseShaderCache:P,programs:c,dispose:N}}function l_(){let s=new WeakMap;function e(r){let a=s.get(r);return a===void 0&&(a={},s.set(r,a)),a}function t(r){s.delete(r)}function n(r,a,o){s.get(r)[a]=o}function i(){s=new WeakMap}return{get:e,remove:t,update:n,dispose:i}}function c_(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.material.id!==e.material.id?s.material.id-e.material.id:s.z!==e.z?s.z-e.z:s.id-e.id}function cc(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.z!==e.z?e.z-s.z:s.id-e.id}function hc(){let s=[],e=0,t=[],n=[],i=[];function r(){e=0,t.length=0,n.length=0,i.length=0}function a(d,u,m,_,f,p){let b=s[e];return b===void 0?(b={id:d.id,object:d,geometry:u,material:m,groupOrder:_,renderOrder:d.renderOrder,z:f,group:p},s[e]=b):(b.id=d.id,b.object=d,b.geometry=u,b.material=m,b.groupOrder=_,b.renderOrder=d.renderOrder,b.z=f,b.group=p),e++,b}function o(d,u,m,_,f,p){let b=a(d,u,m,_,f,p);m.transmission>0?n.push(b):m.transparent===!0?i.push(b):t.push(b)}function l(d,u,m,_,f,p){let b=a(d,u,m,_,f,p);m.transmission>0?n.unshift(b):m.transparent===!0?i.unshift(b):t.unshift(b)}function c(d,u){t.length>1&&t.sort(d||c_),n.length>1&&n.sort(u||cc),i.length>1&&i.sort(u||cc)}function h(){for(let d=e,u=s.length;d<u;d++){let m=s[d];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:t,transmissive:n,transparent:i,init:r,push:o,unshift:l,finish:h,sort:c}}function h_(){let s=new WeakMap;function e(n,i){let r=s.get(n),a;return r===void 0?(a=new hc,s.set(n,[a])):i>=r.length?(a=new hc,r.push(a)):a=r[i],a}function t(){s=new WeakMap}return{get:e,dispose:t}}function u_(){let s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new H,color:new Ge};break;case"SpotLight":t={position:new H,direction:new H,color:new Ge,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new H,color:new Ge,distance:0,decay:0};break;case"HemisphereLight":t={direction:new H,skyColor:new Ge,groundColor:new Ge};break;case"RectAreaLight":t={color:new Ge,position:new H,halfWidth:new H,halfHeight:new H};break}return s[e.id]=t,t}}}function d_(){let s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ue};break;case"SpotLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ue};break;case"PointLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ue,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[e.id]=t,t}}}var f_=0;function p_(s,e){return(e.castShadow?2:0)-(s.castShadow?2:0)+(e.map?1:0)-(s.map?1:0)}function m_(s,e){let t=new u_,n=d_(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0};for(let h=0;h<9;h++)i.probe.push(new H);let r=new H,a=new it,o=new it;function l(h,d){let u=0,m=0,_=0;for(let R=0;R<9;R++)i.probe[R].set(0,0,0);let f=0,p=0,b=0,E=0,y=0,M=0,T=0,P=0,N=0,g=0;h.sort(p_);let w=d!==!0?Math.PI:1;for(let R=0,X=h.length;R<X;R++){let O=h[R],B=O.color,A=O.intensity,C=O.distance,J=O.shadow&&O.shadow.map?O.shadow.map.texture:null;if(O.isAmbientLight)u+=B.r*A*w,m+=B.g*A*w,_+=B.b*A*w;else if(O.isLightProbe)for(let k=0;k<9;k++)i.probe[k].addScaledVector(O.sh.coefficients[k],A);else if(O.isDirectionalLight){let k=t.get(O);if(k.color.copy(O.color).multiplyScalar(O.intensity*w),O.castShadow){let j=O.shadow,Z=n.get(O);Z.shadowBias=j.bias,Z.shadowNormalBias=j.normalBias,Z.shadowRadius=j.radius,Z.shadowMapSize=j.mapSize,i.directionalShadow[f]=Z,i.directionalShadowMap[f]=J,i.directionalShadowMatrix[f]=O.shadow.matrix,M++}i.directional[f]=k,f++}else if(O.isSpotLight){let k=t.get(O);k.position.setFromMatrixPosition(O.matrixWorld),k.color.copy(B).multiplyScalar(A*w),k.distance=C,k.coneCos=Math.cos(O.angle),k.penumbraCos=Math.cos(O.angle*(1-O.penumbra)),k.decay=O.decay,i.spot[b]=k;let j=O.shadow;if(O.map&&(i.spotLightMap[N]=O.map,N++,j.updateMatrices(O),O.castShadow&&g++),i.spotLightMatrix[b]=j.matrix,O.castShadow){let Z=n.get(O);Z.shadowBias=j.bias,Z.shadowNormalBias=j.normalBias,Z.shadowRadius=j.radius,Z.shadowMapSize=j.mapSize,i.spotShadow[b]=Z,i.spotShadowMap[b]=J,P++}b++}else if(O.isRectAreaLight){let k=t.get(O);k.color.copy(B).multiplyScalar(A),k.halfWidth.set(O.width*.5,0,0),k.halfHeight.set(0,O.height*.5,0),i.rectArea[E]=k,E++}else if(O.isPointLight){let k=t.get(O);if(k.color.copy(O.color).multiplyScalar(O.intensity*w),k.distance=O.distance,k.decay=O.decay,O.castShadow){let j=O.shadow,Z=n.get(O);Z.shadowBias=j.bias,Z.shadowNormalBias=j.normalBias,Z.shadowRadius=j.radius,Z.shadowMapSize=j.mapSize,Z.shadowCameraNear=j.camera.near,Z.shadowCameraFar=j.camera.far,i.pointShadow[p]=Z,i.pointShadowMap[p]=J,i.pointShadowMatrix[p]=O.shadow.matrix,T++}i.point[p]=k,p++}else if(O.isHemisphereLight){let k=t.get(O);k.skyColor.copy(O.color).multiplyScalar(A*w),k.groundColor.copy(O.groundColor).multiplyScalar(A*w),i.hemi[y]=k,y++}}E>0&&(e.isWebGL2||s.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=ae.LTC_FLOAT_1,i.rectAreaLTC2=ae.LTC_FLOAT_2):s.has("OES_texture_half_float_linear")===!0?(i.rectAreaLTC1=ae.LTC_HALF_1,i.rectAreaLTC2=ae.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),i.ambient[0]=u,i.ambient[1]=m,i.ambient[2]=_;let D=i.hash;(D.directionalLength!==f||D.pointLength!==p||D.spotLength!==b||D.rectAreaLength!==E||D.hemiLength!==y||D.numDirectionalShadows!==M||D.numPointShadows!==T||D.numSpotShadows!==P||D.numSpotMaps!==N)&&(i.directional.length=f,i.spot.length=b,i.rectArea.length=E,i.point.length=p,i.hemi.length=y,i.directionalShadow.length=M,i.directionalShadowMap.length=M,i.pointShadow.length=T,i.pointShadowMap.length=T,i.spotShadow.length=P,i.spotShadowMap.length=P,i.directionalShadowMatrix.length=M,i.pointShadowMatrix.length=T,i.spotLightMatrix.length=P+N-g,i.spotLightMap.length=N,i.numSpotLightShadowsWithMaps=g,D.directionalLength=f,D.pointLength=p,D.spotLength=b,D.rectAreaLength=E,D.hemiLength=y,D.numDirectionalShadows=M,D.numPointShadows=T,D.numSpotShadows=P,D.numSpotMaps=N,i.version=f_++)}function c(h,d){let u=0,m=0,_=0,f=0,p=0,b=d.matrixWorldInverse;for(let E=0,y=h.length;E<y;E++){let M=h[E];if(M.isDirectionalLight){let T=i.directional[u];T.direction.setFromMatrixPosition(M.matrixWorld),r.setFromMatrixPosition(M.target.matrixWorld),T.direction.sub(r),T.direction.transformDirection(b),u++}else if(M.isSpotLight){let T=i.spot[_];T.position.setFromMatrixPosition(M.matrixWorld),T.position.applyMatrix4(b),T.direction.setFromMatrixPosition(M.matrixWorld),r.setFromMatrixPosition(M.target.matrixWorld),T.direction.sub(r),T.direction.transformDirection(b),_++}else if(M.isRectAreaLight){let T=i.rectArea[f];T.position.setFromMatrixPosition(M.matrixWorld),T.position.applyMatrix4(b),o.identity(),a.copy(M.matrixWorld),a.premultiply(b),o.extractRotation(a),T.halfWidth.set(M.width*.5,0,0),T.halfHeight.set(0,M.height*.5,0),T.halfWidth.applyMatrix4(o),T.halfHeight.applyMatrix4(o),f++}else if(M.isPointLight){let T=i.point[m];T.position.setFromMatrixPosition(M.matrixWorld),T.position.applyMatrix4(b),m++}else if(M.isHemisphereLight){let T=i.hemi[p];T.direction.setFromMatrixPosition(M.matrixWorld),T.direction.transformDirection(b),p++}}}return{setup:l,setupView:c,state:i}}function uc(s,e){let t=new m_(s,e),n=[],i=[];function r(){n.length=0,i.length=0}function a(d){n.push(d)}function o(d){i.push(d)}function l(d){t.setup(n,d)}function c(d){t.setupView(n,d)}return{init:r,state:{lightsArray:n,shadowsArray:i,lights:t},setupLights:l,setupLightsView:c,pushLight:a,pushShadow:o}}function g_(s,e){let t=new WeakMap;function n(r,a=0){let o=t.get(r),l;return o===void 0?(l=new uc(s,e),t.set(r,[l])):a>=o.length?(l=new uc(s,e),o.push(l)):l=o[a],l}function i(){t=new WeakMap}return{get:n,dispose:i}}var dc=class extends Ri{constructor(e){super();this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Ff,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},fc=class extends Ri{constructor(e){super();this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.referencePosition=new H,this.nearDistance=1,this.farDistance=1e3,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.referencePosition.copy(e.referencePosition),this.nearDistance=e.nearDistance,this.farDistance=e.farDistance,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}},__=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,x_=`uniform sampler2D shadow_pass;
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
}`;function y_(s,e,t){let n=new to,i=new Ue,r=new Ue,a=new nt,o=new dc({depthPacking:Bf}),l=new fc,c={},h=t.maxTextureSize,d={[Qt]:vt,[vt]:Qt,[en]:en},u=new hn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Ue},radius:{value:4}},vertexShader:__,fragmentShader:x_}),m=u.clone();m.defines.HORIZONTAL_PASS=1;let _=new cn;_.setAttribute("position",new Ft(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let f=new Ct(_,u),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Ra,this.render=function(M,T,P){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||M.length===0)return;let N=s.getRenderTarget(),g=s.getActiveCubeFace(),w=s.getActiveMipmapLevel(),D=s.state;D.setBlending(tn),D.buffers.color.setClear(1,1,1,1),D.buffers.depth.setTest(!0),D.setScissorTest(!1);for(let R=0,X=M.length;R<X;R++){let O=M[R],B=O.shadow;if(B===void 0){console.warn("THREE.WebGLShadowMap:",O,"has no shadow.");continue}if(B.autoUpdate===!1&&B.needsUpdate===!1)continue;i.copy(B.mapSize);let A=B.getFrameExtents();if(i.multiply(A),r.copy(B.mapSize),(i.x>h||i.y>h)&&(i.x>h&&(r.x=Math.floor(h/A.x),i.x=r.x*A.x,B.mapSize.x=r.x),i.y>h&&(r.y=Math.floor(h/A.y),i.y=r.y*A.y,B.mapSize.y=r.y)),B.map===null){let J=this.type!==vi?{minFilter:ct,magFilter:ct}:{};B.map=new nn(i.x,i.y,J),B.map.texture.name=O.name+".shadowMap",B.camera.updateProjectionMatrix()}s.setRenderTarget(B.map),s.clear();let C=B.getViewportCount();for(let J=0;J<C;J++){let k=B.getViewport(J);a.set(r.x*k.x,r.y*k.y,r.x*k.z,r.y*k.w),D.viewport(a),B.updateMatrices(O,J),n=B.getFrustum(),y(T,P,B.camera,O,this.type)}B.isPointLightShadow!==!0&&this.type===vi&&b(B,P),B.needsUpdate=!1}p.needsUpdate=!1,s.setRenderTarget(N,g,w)};function b(M,T){let P=e.update(f);u.defines.VSM_SAMPLES!==M.blurSamples&&(u.defines.VSM_SAMPLES=M.blurSamples,m.defines.VSM_SAMPLES=M.blurSamples,u.needsUpdate=!0,m.needsUpdate=!0),M.mapPass===null&&(M.mapPass=new nn(i.x,i.y)),u.uniforms.shadow_pass.value=M.map.texture,u.uniforms.resolution.value=M.mapSize,u.uniforms.radius.value=M.radius,s.setRenderTarget(M.mapPass),s.clear(),s.renderBufferDirect(T,null,P,u,f,null),m.uniforms.shadow_pass.value=M.mapPass.texture,m.uniforms.resolution.value=M.mapSize,m.uniforms.radius.value=M.radius,s.setRenderTarget(M.map),s.clear(),s.renderBufferDirect(T,null,P,m,f,null)}function E(M,T,P,N,g,w){let D=null,R=P.isPointLight===!0?M.customDistanceMaterial:M.customDepthMaterial;if(R!==void 0)D=R;else if(D=P.isPointLight===!0?l:o,s.localClippingEnabled&&T.clipShadows===!0&&Array.isArray(T.clippingPlanes)&&T.clippingPlanes.length!==0||T.displacementMap&&T.displacementScale!==0||T.alphaMap&&T.alphaTest>0||T.map&&T.alphaTest>0){let X=D.uuid,O=T.uuid,B=c[X];B===void 0&&(B={},c[X]=B);let A=B[O];A===void 0&&(A=D.clone(),B[O]=A),D=A}return D.visible=T.visible,D.wireframe=T.wireframe,w===vi?D.side=T.shadowSide!==null?T.shadowSide:T.side:D.side=T.shadowSide!==null?T.shadowSide:d[T.side],D.alphaMap=T.alphaMap,D.alphaTest=T.alphaTest,D.map=T.map,D.clipShadows=T.clipShadows,D.clippingPlanes=T.clippingPlanes,D.clipIntersection=T.clipIntersection,D.displacementMap=T.displacementMap,D.displacementScale=T.displacementScale,D.displacementBias=T.displacementBias,D.wireframeLinewidth=T.wireframeLinewidth,D.linewidth=T.linewidth,P.isPointLight===!0&&D.isMeshDistanceMaterial===!0&&(D.referencePosition.setFromMatrixPosition(P.matrixWorld),D.nearDistance=N,D.farDistance=g),D}function y(M,T,P,N,g){if(M.visible===!1)return;if(M.layers.test(T.layers)&&(M.isMesh||M.isLine||M.isPoints)&&(M.castShadow||M.receiveShadow&&g===vi)&&(!M.frustumCulled||n.intersectsObject(M))){M.modelViewMatrix.multiplyMatrices(P.matrixWorldInverse,M.matrixWorld);let R=e.update(M),X=M.material;if(Array.isArray(X)){let O=R.groups;for(let B=0,A=O.length;B<A;B++){let C=O[B],J=X[C.materialIndex];if(J&&J.visible){let k=E(M,J,N,P.near,P.far,g);s.renderBufferDirect(P,null,R,k,M,C)}}}else if(X.visible){let O=E(M,X,N,P.near,P.far,g);s.renderBufferDirect(P,null,R,O,M,null)}}let D=M.children;for(let R=0,X=D.length;R<X;R++)y(D[R],T,P,N,g)}}function v_(s,e,t){let n=t.isWebGL2;function i(){let L=!1,G=new nt,te=null,de=new nt(0,0,0,0);return{setMask:function(_e){te!==_e&&!L&&(s.colorMask(_e,_e,_e,_e),te=_e)},setLocked:function(_e){L=_e},setClear:function(_e,Fe,et,ot,fn){fn===!0&&(_e*=ot,Fe*=ot,et*=ot),G.set(_e,Fe,et,ot),de.equals(G)===!1&&(s.clearColor(_e,Fe,et,ot),de.copy(G))},reset:function(){L=!1,te=null,de.set(-1,0,0,0)}}}function r(){let L=!1,G=null,te=null,de=null;return{setTest:function(_e){_e?Me(2929):ge(2929)},setMask:function(_e){G!==_e&&!L&&(s.depthMask(_e),G=_e)},setFunc:function(_e){if(te!==_e){switch(_e){case of:s.depthFunc(512);break;case af:s.depthFunc(519);break;case lf:s.depthFunc(513);break;case hr:s.depthFunc(515);break;case cf:s.depthFunc(514);break;case hf:s.depthFunc(518);break;case uf:s.depthFunc(516);break;case df:s.depthFunc(517);break;default:s.depthFunc(515)}te=_e}},setLocked:function(_e){L=_e},setClear:function(_e){de!==_e&&(s.clearDepth(_e),de=_e)},reset:function(){L=!1,G=null,te=null,de=null}}}function a(){let L=!1,G=null,te=null,de=null,_e=null,Fe=null,et=null,ot=null,fn=null;return{setTest:function(Ve){L||(Ve?Me(2960):ge(2960))},setMask:function(Ve){G!==Ve&&!L&&(s.stencilMask(Ve),G=Ve)},setFunc:function(Ve,Gt,At){(te!==Ve||de!==Gt||_e!==At)&&(s.stencilFunc(Ve,Gt,At),te=Ve,de=Gt,_e=At)},setOp:function(Ve,Gt,At){(Fe!==Ve||et!==Gt||ot!==At)&&(s.stencilOp(Ve,Gt,At),Fe=Ve,et=Gt,ot=At)},setLocked:function(Ve){L=Ve},setClear:function(Ve){fn!==Ve&&(s.clearStencil(Ve),fn=Ve)},reset:function(){L=!1,G=null,te=null,de=null,_e=null,Fe=null,et=null,ot=null,fn=null}}}let o=new i,l=new r,c=new a,h=new WeakMap,d=new WeakMap,u={},m={},_=new WeakMap,f=[],p=null,b=!1,E=null,y=null,M=null,T=null,P=null,N=null,g=null,w=!1,D=null,R=null,X=null,O=null,B=null,A=s.getParameter(35661),C=!1,J=0,k=s.getParameter(7938);k.indexOf("WebGL")!==-1?(J=parseFloat(/^WebGL (\d)/.exec(k)[1]),C=J>=1):k.indexOf("OpenGL ES")!==-1&&(J=parseFloat(/^OpenGL ES (\d)/.exec(k)[1]),C=J>=2);let j=null,Z={},fe=s.getParameter(3088),U=s.getParameter(2978),Q=new nt().fromArray(fe),se=new nt().fromArray(U);function ie(L,G,te){let de=new Uint8Array(4),_e=s.createTexture();s.bindTexture(L,_e),s.texParameteri(L,10241,9728),s.texParameteri(L,10240,9728);for(let Fe=0;Fe<te;Fe++)s.texImage2D(G+Fe,0,6408,1,1,0,6408,5121,de);return _e}let I={};I[3553]=ie(3553,3553,1),I[34067]=ie(34067,34069,6),o.setClear(0,0,0,1),l.setClear(1),c.setClear(0),Me(2929),l.setFunc(hr),qe(!1),rt(Ca),Me(2884),Oe(tn);function Me(L){u[L]!==!0&&(s.enable(L),u[L]=!0)}function ge(L){u[L]!==!1&&(s.disable(L),u[L]=!1)}function V(L,G){return m[L]!==G?(s.bindFramebuffer(L,G),m[L]=G,n&&(L===36009&&(m[36160]=G),L===36160&&(m[36009]=G)),!0):!1}function ee(L,G){let te=f,de=!1;if(L)if(te=_.get(G),te===void 0&&(te=[],_.set(G,te)),L.isWebGLMultipleRenderTargets){let _e=L.texture;if(te.length!==_e.length||te[0]!==36064){for(let Fe=0,et=_e.length;Fe<et;Fe++)te[Fe]=36064+Fe;te.length=_e.length,de=!0}}else te[0]!==36064&&(te[0]=36064,de=!0);else te[0]!==1029&&(te[0]=1029,de=!0);de&&(t.isWebGL2?s.drawBuffers(te):e.get("WEBGL_draw_buffers").drawBuffersWEBGL(te))}function K(L){return p!==L?(s.useProgram(L),p=L,!0):!1}let oe={[kn]:32774,[$d]:32778,[Kd]:32779};if(n)oe[Da]=32775,oe[Na]=32776;else{let L=e.get("EXT_blend_minmax");L!==null&&(oe[Da]=L.MIN_EXT,oe[Na]=L.MAX_EXT)}let ce={[Zd]:0,[Jd]:1,[jd]:768,[Oa]:770,[rf]:776,[nf]:774,[ef]:772,[Qd]:769,[Fa]:771,[sf]:775,[tf]:773};function Oe(L,G,te,de,_e,Fe,et,ot){if(L===tn){b===!0&&(ge(3042),b=!1);return}if(b===!1&&(Me(3042),b=!0),L!==Yd){if(L!==E||ot!==w){if((y!==kn||P!==kn)&&(s.blendEquation(32774),y=kn,P=kn),ot)switch(L){case Un:s.blendFuncSeparate(1,771,1,771);break;case La:s.blendFunc(1,1);break;case Pa:s.blendFuncSeparate(0,769,0,1);break;case Ia:s.blendFuncSeparate(0,768,0,770);break;default:console.error("THREE.WebGLState: Invalid blending: ",L);break}else switch(L){case Un:s.blendFuncSeparate(770,771,1,771);break;case La:s.blendFunc(770,1);break;case Pa:s.blendFuncSeparate(0,769,0,1);break;case Ia:s.blendFunc(0,768);break;default:console.error("THREE.WebGLState: Invalid blending: ",L);break}M=null,T=null,N=null,g=null,E=L,w=ot}return}_e=_e||G,Fe=Fe||te,et=et||de,(G!==y||_e!==P)&&(s.blendEquationSeparate(oe[G],oe[_e]),y=G,P=_e),(te!==M||de!==T||Fe!==N||et!==g)&&(s.blendFuncSeparate(ce[te],ce[de],ce[Fe],ce[et]),M=te,T=de,N=Fe,g=et),E=L,w=!1}function Ie(L,G){L.side===en?ge(2884):Me(2884);let te=L.side===vt;G&&(te=!te),qe(te),L.blending===Un&&L.transparent===!1?Oe(tn):Oe(L.blending,L.blendEquation,L.blendSrc,L.blendDst,L.blendEquationAlpha,L.blendSrcAlpha,L.blendDstAlpha,L.premultipliedAlpha),l.setFunc(L.depthFunc),l.setTest(L.depthTest),l.setMask(L.depthWrite),o.setMask(L.colorWrite);let de=L.stencilWrite;c.setTest(de),de&&(c.setMask(L.stencilWriteMask),c.setFunc(L.stencilFunc,L.stencilRef,L.stencilFuncMask),c.setOp(L.stencilFail,L.stencilZFail,L.stencilZPass)),Be(L.polygonOffset,L.polygonOffsetFactor,L.polygonOffsetUnits),L.alphaToCoverage===!0?Me(32926):ge(32926)}function qe(L){D!==L&&(L?s.frontFace(2304):s.frontFace(2305),D=L)}function rt(L){L!==Wd?(Me(2884),L!==R&&(L===Ca?s.cullFace(1029):L===qd?s.cullFace(1028):s.cullFace(1032))):ge(2884),R=L}function Ke(L){L!==X&&(C&&s.lineWidth(L),X=L)}function Be(L,G,te){L?(Me(32823),(O!==G||B!==te)&&(s.polygonOffset(G,te),O=G,B=te)):ge(32823)}function Vt(L){L?Me(3089):ge(3089)}function Rt(L){L===void 0&&(L=33984+A-1),j!==L&&(s.activeTexture(L),j=L)}function S(L,G,te){te===void 0&&(j===null?te=33984+A-1:te=j);let de=Z[te];de===void 0&&(de={type:void 0,texture:void 0},Z[te]=de),(de.type!==L||de.texture!==G)&&(j!==te&&(s.activeTexture(te),j=te),s.bindTexture(L,G||I[L]),de.type=L,de.texture=G)}function x(){let L=Z[j];L!==void 0&&L.type!==void 0&&(s.bindTexture(L.type,null),L.type=void 0,L.texture=void 0)}function q(){try{s.compressedTexImage2D.apply(s,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function ne(){try{s.compressedTexImage3D.apply(s,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function re(){try{s.texSubImage2D.apply(s,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function he(){try{s.texSubImage3D.apply(s,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Se(){try{s.compressedTexSubImage2D.apply(s,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function ue(){try{s.compressedTexSubImage3D.apply(s,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function $(){try{s.texStorage2D.apply(s,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function ve(){try{s.texStorage3D.apply(s,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function we(){try{s.texImage2D.apply(s,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function me(){try{s.texImage3D.apply(s,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function be(L){Q.equals(L)===!1&&(s.scissor(L.x,L.y,L.z,L.w),Q.copy(L))}function xe(L){se.equals(L)===!1&&(s.viewport(L.x,L.y,L.z,L.w),se.copy(L))}function De(L,G){let te=d.get(G);te===void 0&&(te=new WeakMap,d.set(G,te));let de=te.get(L);de===void 0&&(de=s.getUniformBlockIndex(G,L.name),te.set(L,de))}function He(L,G){let de=d.get(G).get(L);h.get(G)!==de&&(s.uniformBlockBinding(G,de,L.__bindingPointIndex),h.set(G,de))}function Qe(){s.disable(3042),s.disable(2884),s.disable(2929),s.disable(32823),s.disable(3089),s.disable(2960),s.disable(32926),s.blendEquation(32774),s.blendFunc(1,0),s.blendFuncSeparate(1,0,1,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(513),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(519,0,4294967295),s.stencilOp(7680,7680,7680),s.clearStencil(0),s.cullFace(1029),s.frontFace(2305),s.polygonOffset(0,0),s.activeTexture(33984),s.bindFramebuffer(36160,null),n===!0&&(s.bindFramebuffer(36009,null),s.bindFramebuffer(36008,null)),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),u={},j=null,Z={},m={},_=new WeakMap,f=[],p=null,b=!1,E=null,y=null,M=null,T=null,P=null,N=null,g=null,w=!1,D=null,R=null,X=null,O=null,B=null,Q.set(0,0,s.canvas.width,s.canvas.height),se.set(0,0,s.canvas.width,s.canvas.height),o.reset(),l.reset(),c.reset()}return{buffers:{color:o,depth:l,stencil:c},enable:Me,disable:ge,bindFramebuffer:V,drawBuffers:ee,useProgram:K,setBlending:Oe,setMaterial:Ie,setFlipSided:qe,setCullFace:rt,setLineWidth:Ke,setPolygonOffset:Be,setScissorTest:Vt,activeTexture:Rt,bindTexture:S,unbindTexture:x,compressedTexImage2D:q,compressedTexImage3D:ne,texImage2D:we,texImage3D:me,updateUBOMapping:De,uniformBlockBinding:He,texStorage2D:$,texStorage3D:ve,texSubImage2D:re,texSubImage3D:he,compressedTexSubImage2D:Se,compressedTexSubImage3D:ue,scissor:be,viewport:xe,reset:Qe}}function b_(s,e,t,n,i,r,a){let o=i.isWebGL2,l=i.maxTextures,c=i.maxCubemapSize,h=i.maxTextureSize,d=i.maxSamples,u=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,m=typeof navigator=="undefined"?!1:/OculusBrowser/g.test(navigator.userAgent),_=new WeakMap,f,p=new WeakMap,b=!1;try{b=typeof OffscreenCanvas!="undefined"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch(S){}function E(S,x){return b?new OffscreenCanvas(S,x):is("canvas")}function y(S,x,q,ne){let re=1;if((S.width>ne||S.height>ne)&&(re=ne/Math.max(S.width,S.height)),re<1||x===!0)if(typeof HTMLImageElement!="undefined"&&S instanceof HTMLImageElement||typeof HTMLCanvasElement!="undefined"&&S instanceof HTMLCanvasElement||typeof ImageBitmap!="undefined"&&S instanceof ImageBitmap){let he=x?Er:Math.floor,Se=he(re*S.width),ue=he(re*S.height);f===void 0&&(f=E(Se,ue));let $=q?E(Se,ue):f;return $.width=Se,$.height=ue,$.getContext("2d").drawImage(S,0,0,Se,ue),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+S.width+"x"+S.height+") to ("+Se+"x"+ue+")."),$}else return"data"in S&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+S.width+"x"+S.height+")."),S;return S}function M(S){return gl(S.width)&&gl(S.height)}function T(S){return o?!1:S.wrapS!==Pt||S.wrapT!==Pt||S.minFilter!==ct&&S.minFilter!==Et}function P(S,x){return S.generateMipmaps&&x&&S.minFilter!==ct&&S.minFilter!==Et}function N(S){s.generateMipmap(S)}function g(S,x,q,ne,re=!1){if(o===!1)return x;if(S!==null){if(s[S]!==void 0)return s[S];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+S+"'")}let he=x;return x===6403&&(q===5126&&(he=33326),q===5131&&(he=33325),q===5121&&(he=33321)),x===33319&&(q===5126&&(he=33328),q===5131&&(he=33327),q===5121&&(he=33323)),x===6408&&(q===5126&&(he=34836),q===5131&&(he=34842),q===5121&&(he=ne===ke&&re===!1?35907:32856),q===32819&&(he=32854),q===32820&&(he=32855)),(he===33325||he===33326||he===33327||he===33328||he===34842||he===34836)&&e.get("EXT_color_buffer_float"),he}function w(S,x,q){return P(S,q)===!0||S.isFramebufferTexture&&S.minFilter!==ct&&S.minFilter!==Et?Math.log2(Math.max(x.width,x.height))+1:S.mipmaps!==void 0&&S.mipmaps.length>0?S.mipmaps.length:S.isCompressedTexture&&Array.isArray(S.image)?x.mipmaps.length:1}function D(S){return S===ct||S===Ua||S===mr?9728:9729}function R(S){let x=S.target;x.removeEventListener("dispose",R),O(x),x.isVideoTexture&&_.delete(x)}function X(S){let x=S.target;x.removeEventListener("dispose",X),A(x)}function O(S){let x=n.get(S);if(x.__webglInit===void 0)return;let q=S.source,ne=p.get(q);if(ne){let re=ne[x.__cacheKey];re.usedTimes--,re.usedTimes===0&&B(S),Object.keys(ne).length===0&&p.delete(q)}n.remove(S)}function B(S){let x=n.get(S);s.deleteTexture(x.__webglTexture);let q=S.source,ne=p.get(q);delete ne[x.__cacheKey],a.memory.textures--}function A(S){let x=S.texture,q=n.get(S),ne=n.get(x);if(ne.__webglTexture!==void 0&&(s.deleteTexture(ne.__webglTexture),a.memory.textures--),S.depthTexture&&S.depthTexture.dispose(),S.isWebGLCubeRenderTarget)for(let re=0;re<6;re++)s.deleteFramebuffer(q.__webglFramebuffer[re]),q.__webglDepthbuffer&&s.deleteRenderbuffer(q.__webglDepthbuffer[re]);else{if(s.deleteFramebuffer(q.__webglFramebuffer),q.__webglDepthbuffer&&s.deleteRenderbuffer(q.__webglDepthbuffer),q.__webglMultisampledFramebuffer&&s.deleteFramebuffer(q.__webglMultisampledFramebuffer),q.__webglColorRenderbuffer)for(let re=0;re<q.__webglColorRenderbuffer.length;re++)q.__webglColorRenderbuffer[re]&&s.deleteRenderbuffer(q.__webglColorRenderbuffer[re]);q.__webglDepthRenderbuffer&&s.deleteRenderbuffer(q.__webglDepthRenderbuffer)}if(S.isWebGLMultipleRenderTargets)for(let re=0,he=x.length;re<he;re++){let Se=n.get(x[re]);Se.__webglTexture&&(s.deleteTexture(Se.__webglTexture),a.memory.textures--),n.remove(x[re])}n.remove(x),n.remove(S)}let C=0;function J(){C=0}function k(){let S=C;return S>=l&&console.warn("THREE.WebGLTextures: Trying to use "+S+" texture units while this GPU supports only "+l),C+=1,S}function j(S){let x=[];return x.push(S.wrapS),x.push(S.wrapT),x.push(S.wrapR||0),x.push(S.magFilter),x.push(S.minFilter),x.push(S.anisotropy),x.push(S.internalFormat),x.push(S.format),x.push(S.type),x.push(S.generateMipmaps),x.push(S.premultiplyAlpha),x.push(S.flipY),x.push(S.unpackAlignment),x.push(S.encoding),x.join()}function Z(S,x){let q=n.get(S);if(S.isVideoTexture&&Vt(S),S.isRenderTargetTexture===!1&&S.version>0&&q.__version!==S.version){let ne=S.image;if(ne===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(ne.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{ge(q,S,x);return}}t.bindTexture(3553,q.__webglTexture,33984+x)}function fe(S,x){let q=n.get(S);if(S.version>0&&q.__version!==S.version){ge(q,S,x);return}t.bindTexture(35866,q.__webglTexture,33984+x)}function U(S,x){let q=n.get(S);if(S.version>0&&q.__version!==S.version){ge(q,S,x);return}t.bindTexture(32879,q.__webglTexture,33984+x)}function Q(S,x){let q=n.get(S);if(S.version>0&&q.__version!==S.version){V(q,S,x);return}t.bindTexture(34067,q.__webglTexture,33984+x)}let se={[fr]:10497,[Pt]:33071,[pr]:33648},ie={[ct]:9728,[Ua]:9984,[mr]:9986,[Et]:9729,[vf]:9985,[bi]:9987};function I(S,x,q){if(q?(s.texParameteri(S,10242,se[x.wrapS]),s.texParameteri(S,10243,se[x.wrapT]),(S===32879||S===35866)&&s.texParameteri(S,32882,se[x.wrapR]),s.texParameteri(S,10240,ie[x.magFilter]),s.texParameteri(S,10241,ie[x.minFilter])):(s.texParameteri(S,10242,33071),s.texParameteri(S,10243,33071),(S===32879||S===35866)&&s.texParameteri(S,32882,33071),(x.wrapS!==Pt||x.wrapT!==Pt)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),s.texParameteri(S,10240,D(x.magFilter)),s.texParameteri(S,10241,D(x.minFilter)),x.minFilter!==ct&&x.minFilter!==Et&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),e.has("EXT_texture_filter_anisotropic")===!0){let ne=e.get("EXT_texture_filter_anisotropic");if(x.magFilter===ct||x.minFilter!==mr&&x.minFilter!==bi||x.type===wn&&e.has("OES_texture_float_linear")===!1||o===!1&&x.type===Mi&&e.has("OES_texture_half_float_linear")===!1)return;(x.anisotropy>1||n.get(x).__currentAnisotropy)&&(s.texParameterf(S,ne.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(x.anisotropy,i.getMaxAnisotropy())),n.get(x).__currentAnisotropy=x.anisotropy)}}function Me(S,x){let q=!1;S.__webglInit===void 0&&(S.__webglInit=!0,x.addEventListener("dispose",R));let ne=x.source,re=p.get(ne);re===void 0&&(re={},p.set(ne,re));let he=j(x);if(he!==S.__cacheKey){re[he]===void 0&&(re[he]={texture:s.createTexture(),usedTimes:0},a.memory.textures++,q=!0),re[he].usedTimes++;let Se=re[S.__cacheKey];Se!==void 0&&(re[S.__cacheKey].usedTimes--,Se.usedTimes===0&&B(x)),S.__cacheKey=he,S.__webglTexture=re[he].texture}return q}function ge(S,x,q){let ne=3553;(x.isDataArrayTexture||x.isCompressedArrayTexture)&&(ne=35866),x.isData3DTexture&&(ne=32879);let re=Me(S,x),he=x.source;t.bindTexture(ne,S.__webglTexture,33984+q);let Se=n.get(he);if(he.version!==Se.__version||re===!0){t.activeTexture(33984+q),s.pixelStorei(37440,x.flipY),s.pixelStorei(37441,x.premultiplyAlpha),s.pixelStorei(3317,x.unpackAlignment),s.pixelStorei(37443,0);let ue=T(x)&&M(x.image)===!1,$=y(x.image,ue,!1,h);$=Rt(x,$);let ve=M($)||o,we=r.convert(x.format,x.encoding),me=r.convert(x.type),be=g(x.internalFormat,we,me,x.encoding,x.isVideoTexture);I(ne,x,ve);let xe,De=x.mipmaps,He=o&&x.isVideoTexture!==!0,Qe=Se.__version===void 0||re===!0,L=w(x,$,ve);if(x.isDepthTexture)be=6402,o?x.type===wn?be=36012:x.type===Mn?be=33190:x.type===Gn?be=35056:be=33189:x.type===wn&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),x.format===Sn&&be===6402&&x.type!==ka&&x.type!==Mn&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),x.type=Mn,me=r.convert(x.type)),x.format===Wn&&be===6402&&(be=34041,x.type!==Gn&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),x.type=Gn,me=r.convert(x.type))),Qe&&(He?t.texStorage2D(3553,1,be,$.width,$.height):t.texImage2D(3553,0,be,$.width,$.height,0,we,me,null));else if(x.isDataTexture)if(De.length>0&&ve){He&&Qe&&t.texStorage2D(3553,L,be,De[0].width,De[0].height);for(let G=0,te=De.length;G<te;G++)xe=De[G],He?t.texSubImage2D(3553,G,0,0,xe.width,xe.height,we,me,xe.data):t.texImage2D(3553,G,be,xe.width,xe.height,0,we,me,xe.data);x.generateMipmaps=!1}else He?(Qe&&t.texStorage2D(3553,L,be,$.width,$.height),t.texSubImage2D(3553,0,0,0,$.width,$.height,we,me,$.data)):t.texImage2D(3553,0,be,$.width,$.height,0,we,me,$.data);else if(x.isCompressedTexture)if(x.isCompressedArrayTexture){He&&Qe&&t.texStorage3D(35866,L,be,De[0].width,De[0].height,$.depth);for(let G=0,te=De.length;G<te;G++)xe=De[G],x.format!==It?we!==null?He?t.compressedTexSubImage3D(35866,G,0,0,0,xe.width,xe.height,$.depth,we,xe.data,0,0):t.compressedTexImage3D(35866,G,be,xe.width,xe.height,$.depth,0,xe.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):He?t.texSubImage3D(35866,G,0,0,0,xe.width,xe.height,$.depth,we,me,xe.data):t.texImage3D(35866,G,be,xe.width,xe.height,$.depth,0,we,me,xe.data)}else{He&&Qe&&t.texStorage2D(3553,L,be,De[0].width,De[0].height);for(let G=0,te=De.length;G<te;G++)xe=De[G],x.format!==It?we!==null?He?t.compressedTexSubImage2D(3553,G,0,0,xe.width,xe.height,we,xe.data):t.compressedTexImage2D(3553,G,be,xe.width,xe.height,0,xe.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):He?t.texSubImage2D(3553,G,0,0,xe.width,xe.height,we,me,xe.data):t.texImage2D(3553,G,be,xe.width,xe.height,0,we,me,xe.data)}else if(x.isDataArrayTexture)He?(Qe&&t.texStorage3D(35866,L,be,$.width,$.height,$.depth),t.texSubImage3D(35866,0,0,0,0,$.width,$.height,$.depth,we,me,$.data)):t.texImage3D(35866,0,be,$.width,$.height,$.depth,0,we,me,$.data);else if(x.isData3DTexture)He?(Qe&&t.texStorage3D(32879,L,be,$.width,$.height,$.depth),t.texSubImage3D(32879,0,0,0,0,$.width,$.height,$.depth,we,me,$.data)):t.texImage3D(32879,0,be,$.width,$.height,$.depth,0,we,me,$.data);else if(x.isFramebufferTexture){if(Qe)if(He)t.texStorage2D(3553,L,be,$.width,$.height);else{let G=$.width,te=$.height;for(let de=0;de<L;de++)t.texImage2D(3553,de,be,G,te,0,we,me,null),G>>=1,te>>=1}}else if(De.length>0&&ve){He&&Qe&&t.texStorage2D(3553,L,be,De[0].width,De[0].height);for(let G=0,te=De.length;G<te;G++)xe=De[G],He?t.texSubImage2D(3553,G,0,0,we,me,xe):t.texImage2D(3553,G,be,we,me,xe);x.generateMipmaps=!1}else He?(Qe&&t.texStorage2D(3553,L,be,$.width,$.height),t.texSubImage2D(3553,0,0,0,we,me,$)):t.texImage2D(3553,0,be,we,me,$);P(x,ve)&&N(ne),Se.__version=he.version,x.onUpdate&&x.onUpdate(x)}S.__version=x.version}function V(S,x,q){if(x.image.length!==6)return;let ne=Me(S,x),re=x.source;t.bindTexture(34067,S.__webglTexture,33984+q);let he=n.get(re);if(re.version!==he.__version||ne===!0){t.activeTexture(33984+q),s.pixelStorei(37440,x.flipY),s.pixelStorei(37441,x.premultiplyAlpha),s.pixelStorei(3317,x.unpackAlignment),s.pixelStorei(37443,0);let Se=x.isCompressedTexture||x.image[0].isCompressedTexture,ue=x.image[0]&&x.image[0].isDataTexture,$=[];for(let G=0;G<6;G++)!Se&&!ue?$[G]=y(x.image[G],!1,!0,c):$[G]=ue?x.image[G].image:x.image[G],$[G]=Rt(x,$[G]);let ve=$[0],we=M(ve)||o,me=r.convert(x.format,x.encoding),be=r.convert(x.type),xe=g(x.internalFormat,me,be,x.encoding),De=o&&x.isVideoTexture!==!0,He=he.__version===void 0||ne===!0,Qe=w(x,ve,we);I(34067,x,we);let L;if(Se){De&&He&&t.texStorage2D(34067,Qe,xe,ve.width,ve.height);for(let G=0;G<6;G++){L=$[G].mipmaps;for(let te=0;te<L.length;te++){let de=L[te];x.format!==It?me!==null?De?t.compressedTexSubImage2D(34069+G,te,0,0,de.width,de.height,me,de.data):t.compressedTexImage2D(34069+G,te,xe,de.width,de.height,0,de.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):De?t.texSubImage2D(34069+G,te,0,0,de.width,de.height,me,be,de.data):t.texImage2D(34069+G,te,xe,de.width,de.height,0,me,be,de.data)}}}else{L=x.mipmaps,De&&He&&(L.length>0&&Qe++,t.texStorage2D(34067,Qe,xe,$[0].width,$[0].height));for(let G=0;G<6;G++)if(ue){De?t.texSubImage2D(34069+G,0,0,0,$[G].width,$[G].height,me,be,$[G].data):t.texImage2D(34069+G,0,xe,$[G].width,$[G].height,0,me,be,$[G].data);for(let te=0;te<L.length;te++){let _e=L[te].image[G].image;De?t.texSubImage2D(34069+G,te+1,0,0,_e.width,_e.height,me,be,_e.data):t.texImage2D(34069+G,te+1,xe,_e.width,_e.height,0,me,be,_e.data)}}else{De?t.texSubImage2D(34069+G,0,0,0,me,be,$[G]):t.texImage2D(34069+G,0,xe,me,be,$[G]);for(let te=0;te<L.length;te++){let de=L[te];De?t.texSubImage2D(34069+G,te+1,0,0,me,be,de.image[G]):t.texImage2D(34069+G,te+1,xe,me,be,de.image[G])}}}P(x,we)&&N(34067),he.__version=re.version,x.onUpdate&&x.onUpdate(x)}S.__version=x.version}function ee(S,x,q,ne,re){let he=r.convert(q.format,q.encoding),Se=r.convert(q.type),ue=g(q.internalFormat,he,Se,q.encoding);n.get(x).__hasExternalTextures||(re===32879||re===35866?t.texImage3D(re,0,ue,x.width,x.height,x.depth,0,he,Se,null):t.texImage2D(re,0,ue,x.width,x.height,0,he,Se,null)),t.bindFramebuffer(36160,S),Be(x)?u.framebufferTexture2DMultisampleEXT(36160,ne,re,n.get(q).__webglTexture,0,Ke(x)):(re===3553||re>=34069&&re<=34074)&&s.framebufferTexture2D(36160,ne,re,n.get(q).__webglTexture,0),t.bindFramebuffer(36160,null)}function K(S,x,q){if(s.bindRenderbuffer(36161,S),x.depthBuffer&&!x.stencilBuffer){let ne=33189;if(q||Be(x)){let re=x.depthTexture;re&&re.isDepthTexture&&(re.type===wn?ne=36012:re.type===Mn&&(ne=33190));let he=Ke(x);Be(x)?u.renderbufferStorageMultisampleEXT(36161,he,ne,x.width,x.height):s.renderbufferStorageMultisample(36161,he,ne,x.width,x.height)}else s.renderbufferStorage(36161,ne,x.width,x.height);s.framebufferRenderbuffer(36160,36096,36161,S)}else if(x.depthBuffer&&x.stencilBuffer){let ne=Ke(x);q&&Be(x)===!1?s.renderbufferStorageMultisample(36161,ne,35056,x.width,x.height):Be(x)?u.renderbufferStorageMultisampleEXT(36161,ne,35056,x.width,x.height):s.renderbufferStorage(36161,34041,x.width,x.height),s.framebufferRenderbuffer(36160,33306,36161,S)}else{let ne=x.isWebGLMultipleRenderTargets===!0?x.texture:[x.texture];for(let re=0;re<ne.length;re++){let he=ne[re],Se=r.convert(he.format,he.encoding),ue=r.convert(he.type),$=g(he.internalFormat,Se,ue,he.encoding),ve=Ke(x);q&&Be(x)===!1?s.renderbufferStorageMultisample(36161,ve,$,x.width,x.height):Be(x)?u.renderbufferStorageMultisampleEXT(36161,ve,$,x.width,x.height):s.renderbufferStorage(36161,$,x.width,x.height)}}s.bindRenderbuffer(36161,null)}function oe(S,x){if(x&&x.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(36160,S),!(x.depthTexture&&x.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(x.depthTexture).__webglTexture||x.depthTexture.image.width!==x.width||x.depthTexture.image.height!==x.height)&&(x.depthTexture.image.width=x.width,x.depthTexture.image.height=x.height,x.depthTexture.needsUpdate=!0),Z(x.depthTexture,0);let ne=n.get(x.depthTexture).__webglTexture,re=Ke(x);if(x.depthTexture.format===Sn)Be(x)?u.framebufferTexture2DMultisampleEXT(36160,36096,3553,ne,0,re):s.framebufferTexture2D(36160,36096,3553,ne,0);else if(x.depthTexture.format===Wn)Be(x)?u.framebufferTexture2DMultisampleEXT(36160,33306,3553,ne,0,re):s.framebufferTexture2D(36160,33306,3553,ne,0);else throw new Error("Unknown depthTexture format")}function ce(S){let x=n.get(S),q=S.isWebGLCubeRenderTarget===!0;if(S.depthTexture&&!x.__autoAllocateDepthBuffer){if(q)throw new Error("target.depthTexture not supported in Cube render targets");oe(x.__webglFramebuffer,S)}else if(q){x.__webglDepthbuffer=[];for(let ne=0;ne<6;ne++)t.bindFramebuffer(36160,x.__webglFramebuffer[ne]),x.__webglDepthbuffer[ne]=s.createRenderbuffer(),K(x.__webglDepthbuffer[ne],S,!1)}else t.bindFramebuffer(36160,x.__webglFramebuffer),x.__webglDepthbuffer=s.createRenderbuffer(),K(x.__webglDepthbuffer,S,!1);t.bindFramebuffer(36160,null)}function Oe(S,x,q){let ne=n.get(S);x!==void 0&&ee(ne.__webglFramebuffer,S,S.texture,36064,3553),q!==void 0&&ce(S)}function Ie(S){let x=S.texture,q=n.get(S),ne=n.get(x);S.addEventListener("dispose",X),S.isWebGLMultipleRenderTargets!==!0&&(ne.__webglTexture===void 0&&(ne.__webglTexture=s.createTexture()),ne.__version=x.version,a.memory.textures++);let re=S.isWebGLCubeRenderTarget===!0,he=S.isWebGLMultipleRenderTargets===!0,Se=M(S)||o;if(re){q.__webglFramebuffer=[];for(let ue=0;ue<6;ue++)q.__webglFramebuffer[ue]=s.createFramebuffer()}else{if(q.__webglFramebuffer=s.createFramebuffer(),he)if(i.drawBuffers){let ue=S.texture;for(let $=0,ve=ue.length;$<ve;$++){let we=n.get(ue[$]);we.__webglTexture===void 0&&(we.__webglTexture=s.createTexture(),a.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(o&&S.samples>0&&Be(S)===!1){let ue=he?x:[x];q.__webglMultisampledFramebuffer=s.createFramebuffer(),q.__webglColorRenderbuffer=[],t.bindFramebuffer(36160,q.__webglMultisampledFramebuffer);for(let $=0;$<ue.length;$++){let ve=ue[$];q.__webglColorRenderbuffer[$]=s.createRenderbuffer(),s.bindRenderbuffer(36161,q.__webglColorRenderbuffer[$]);let we=r.convert(ve.format,ve.encoding),me=r.convert(ve.type),be=g(ve.internalFormat,we,me,ve.encoding,S.isXRRenderTarget===!0),xe=Ke(S);s.renderbufferStorageMultisample(36161,xe,be,S.width,S.height),s.framebufferRenderbuffer(36160,36064+$,36161,q.__webglColorRenderbuffer[$])}s.bindRenderbuffer(36161,null),S.depthBuffer&&(q.__webglDepthRenderbuffer=s.createRenderbuffer(),K(q.__webglDepthRenderbuffer,S,!0)),t.bindFramebuffer(36160,null)}}if(re){t.bindTexture(34067,ne.__webglTexture),I(34067,x,Se);for(let ue=0;ue<6;ue++)ee(q.__webglFramebuffer[ue],S,x,36064,34069+ue);P(x,Se)&&N(34067),t.unbindTexture()}else if(he){let ue=S.texture;for(let $=0,ve=ue.length;$<ve;$++){let we=ue[$],me=n.get(we);t.bindTexture(3553,me.__webglTexture),I(3553,we,Se),ee(q.__webglFramebuffer,S,we,36064+$,3553),P(we,Se)&&N(3553)}t.unbindTexture()}else{let ue=3553;(S.isWebGL3DRenderTarget||S.isWebGLArrayRenderTarget)&&(o?ue=S.isWebGL3DRenderTarget?32879:35866:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),t.bindTexture(ue,ne.__webglTexture),I(ue,x,Se),ee(q.__webglFramebuffer,S,x,36064,ue),P(x,Se)&&N(ue),t.unbindTexture()}S.depthBuffer&&ce(S)}function qe(S){let x=M(S)||o,q=S.isWebGLMultipleRenderTargets===!0?S.texture:[S.texture];for(let ne=0,re=q.length;ne<re;ne++){let he=q[ne];if(P(he,x)){let Se=S.isWebGLCubeRenderTarget?34067:3553,ue=n.get(he).__webglTexture;t.bindTexture(Se,ue),N(Se),t.unbindTexture()}}}function rt(S){if(o&&S.samples>0&&Be(S)===!1){let x=S.isWebGLMultipleRenderTargets?S.texture:[S.texture],q=S.width,ne=S.height,re=16384,he=[],Se=S.stencilBuffer?33306:36096,ue=n.get(S),$=S.isWebGLMultipleRenderTargets===!0;if($)for(let ve=0;ve<x.length;ve++)t.bindFramebuffer(36160,ue.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(36160,36064+ve,36161,null),t.bindFramebuffer(36160,ue.__webglFramebuffer),s.framebufferTexture2D(36009,36064+ve,3553,null,0);t.bindFramebuffer(36008,ue.__webglMultisampledFramebuffer),t.bindFramebuffer(36009,ue.__webglFramebuffer);for(let ve=0;ve<x.length;ve++){he.push(36064+ve),S.depthBuffer&&he.push(Se);let we=ue.__ignoreDepthValues!==void 0?ue.__ignoreDepthValues:!1;if(we===!1&&(S.depthBuffer&&(re|=256),S.stencilBuffer&&(re|=1024)),$&&s.framebufferRenderbuffer(36008,36064,36161,ue.__webglColorRenderbuffer[ve]),we===!0&&(s.invalidateFramebuffer(36008,[Se]),s.invalidateFramebuffer(36009,[Se])),$){let me=n.get(x[ve]).__webglTexture;s.framebufferTexture2D(36009,36064,3553,me,0)}s.blitFramebuffer(0,0,q,ne,0,0,q,ne,re,9728),m&&s.invalidateFramebuffer(36008,he)}if(t.bindFramebuffer(36008,null),t.bindFramebuffer(36009,null),$)for(let ve=0;ve<x.length;ve++){t.bindFramebuffer(36160,ue.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(36160,36064+ve,36161,ue.__webglColorRenderbuffer[ve]);let we=n.get(x[ve]).__webglTexture;t.bindFramebuffer(36160,ue.__webglFramebuffer),s.framebufferTexture2D(36009,36064+ve,3553,we,0)}t.bindFramebuffer(36009,ue.__webglMultisampledFramebuffer)}}function Ke(S){return Math.min(d,S.samples)}function Be(S){let x=n.get(S);return o&&S.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&x.__useRenderToTexture!==!1}function Vt(S){let x=a.render.frame;_.get(S)!==x&&(_.set(S,x),S.update())}function Rt(S,x){let q=S.encoding,ne=S.format,re=S.type;return S.isCompressedTexture===!0||S.isVideoTexture===!0||S.format===wr||q!==An&&(q===ke?o===!1?e.has("EXT_sRGB")===!0&&ne===It?(S.format=wr,S.minFilter=Et,S.generateMipmaps=!1):x=Lr.sRGBToLinear(x):(ne!==It||re!==bn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture encoding:",q)),x}this.allocateTextureUnit=k,this.resetTextureUnits=J,this.setTexture2D=Z,this.setTexture2DArray=fe,this.setTexture3D=U,this.setTextureCube=Q,this.rebindTextures=Oe,this.setupRenderTarget=Ie,this.updateRenderTargetMipmap=qe,this.updateMultisampleRenderTarget=rt,this.setupDepthRenderbuffer=ce,this.setupFrameBufferTexture=ee,this.useMultisampledRTT=Be}function M_(s,e,t){let n=t.isWebGL2;function i(r,a=null){let o;if(r===bn)return 5121;if(r===Sf)return 32819;if(r===Af)return 32820;if(r===bf)return 5120;if(r===Mf)return 5122;if(r===ka)return 5123;if(r===wf)return 5124;if(r===Mn)return 5125;if(r===wn)return 5126;if(r===Mi)return n?5131:(o=e.get("OES_texture_half_float"),o!==null?o.HALF_FLOAT_OES:null);if(r===Ef)return 6406;if(r===It)return 6408;if(r===Tf)return 6409;if(r===Cf)return 6410;if(r===Sn)return 6402;if(r===Wn)return 34041;if(r===wr)return o=e.get("EXT_sRGB"),o!==null?o.SRGB_ALPHA_EXT:null;if(r===Rf)return 6403;if(r===Lf)return 36244;if(r===Pf)return 33319;if(r===If)return 33320;if(r===Df)return 36249;if(r===gr||r===_r||r===xr||r===yr)if(a===ke)if(o=e.get("WEBGL_compressed_texture_s3tc_srgb"),o!==null){if(r===gr)return o.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(r===_r)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(r===xr)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(r===yr)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(o=e.get("WEBGL_compressed_texture_s3tc"),o!==null){if(r===gr)return o.COMPRESSED_RGB_S3TC_DXT1_EXT;if(r===_r)return o.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(r===xr)return o.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(r===yr)return o.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(r===Ha||r===Va||r===Ga||r===Wa)if(o=e.get("WEBGL_compressed_texture_pvrtc"),o!==null){if(r===Ha)return o.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(r===Va)return o.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(r===Ga)return o.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(r===Wa)return o.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(r===Nf)return o=e.get("WEBGL_compressed_texture_etc1"),o!==null?o.COMPRESSED_RGB_ETC1_WEBGL:null;if(r===qa||r===Xa)if(o=e.get("WEBGL_compressed_texture_etc"),o!==null){if(r===qa)return a===ke?o.COMPRESSED_SRGB8_ETC2:o.COMPRESSED_RGB8_ETC2;if(r===Xa)return a===ke?o.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:o.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(r===Ya||r===$a||r===Ka||r===Za||r===Ja||r===ja||r===Qa||r===el||r===tl||r===nl||r===il||r===sl||r===rl||r===ol)if(o=e.get("WEBGL_compressed_texture_astc"),o!==null){if(r===Ya)return a===ke?o.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:o.COMPRESSED_RGBA_ASTC_4x4_KHR;if(r===$a)return a===ke?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:o.COMPRESSED_RGBA_ASTC_5x4_KHR;if(r===Ka)return a===ke?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:o.COMPRESSED_RGBA_ASTC_5x5_KHR;if(r===Za)return a===ke?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:o.COMPRESSED_RGBA_ASTC_6x5_KHR;if(r===Ja)return a===ke?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:o.COMPRESSED_RGBA_ASTC_6x6_KHR;if(r===ja)return a===ke?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:o.COMPRESSED_RGBA_ASTC_8x5_KHR;if(r===Qa)return a===ke?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:o.COMPRESSED_RGBA_ASTC_8x6_KHR;if(r===el)return a===ke?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:o.COMPRESSED_RGBA_ASTC_8x8_KHR;if(r===tl)return a===ke?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:o.COMPRESSED_RGBA_ASTC_10x5_KHR;if(r===nl)return a===ke?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:o.COMPRESSED_RGBA_ASTC_10x6_KHR;if(r===il)return a===ke?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:o.COMPRESSED_RGBA_ASTC_10x8_KHR;if(r===sl)return a===ke?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:o.COMPRESSED_RGBA_ASTC_10x10_KHR;if(r===rl)return a===ke?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:o.COMPRESSED_RGBA_ASTC_12x10_KHR;if(r===ol)return a===ke?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:o.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(r===vr)if(o=e.get("EXT_texture_compression_bptc"),o!==null){if(r===vr)return a===ke?o.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:o.COMPRESSED_RGBA_BPTC_UNORM_EXT}else return null;if(r===Of||r===al||r===ll||r===cl)if(o=e.get("EXT_texture_compression_rgtc"),o!==null){if(r===vr)return o.COMPRESSED_RED_RGTC1_EXT;if(r===al)return o.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(r===ll)return o.COMPRESSED_RED_GREEN_RGTC2_EXT;if(r===cl)return o.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return r===Gn?n?34042:(o=e.get("WEBGL_depth_texture"),o!==null?o.UNSIGNED_INT_24_8_WEBGL:null):s[r]!==void 0?s[r]:null}return{convert:i}}var pc=class extends gt{constructor(e=[]){super();this.isArrayCamera=!0,this.cameras=e}},Fi=class extends mt{constructor(){super();this.isGroup=!0,this.type="Group"}},w_={type:"move"},Es=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Fi,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Fi,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new H,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new H),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Fi,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new H,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new H),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let i=null,r=null,a=null,o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(let f of e.hand.values()){let p=t.getJointPose(f,n),b=this._getHandJoint(c,f);p!==null&&(b.matrix.fromArray(p.transform.matrix),b.matrix.decompose(b.position,b.rotation,b.scale),b.jointRadius=p.radius),b.visible=p!==null}let h=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],u=h.position.distanceTo(d.position),m=.02,_=.005;c.inputState.pinching&&u>m+_?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&u<=m-_&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(i=t.getPose(e.targetRaySpace,n),i===null&&r!==null&&(i=r),i!==null&&(o.matrix.fromArray(i.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),i.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(i.linearVelocity)):o.hasLinearVelocity=!1,i.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(i.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(w_)))}return o!==null&&(o.visible=i!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new Fi;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},mc=class extends pt{constructor(e,t,n,i,r,a,o,l,c,h){if(h=h!==void 0?h:Sn,h!==Sn&&h!==Wn)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===Sn&&(n=Mn),n===void 0&&h===Wn&&(n=Gn),super(null,i,r,a,o,l,h,n,c),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=o!==void 0?o:ct,this.minFilter=l!==void 0?l:ct,this.flipY=!1,this.generateMipmaps=!1}},gc=class extends En{constructor(e,t){super();let n=this,i=null,r=1,a=null,o="local-floor",l=1,c=null,h=null,d=null,u=null,m=null,_=null,f=t.getContextAttributes(),p=null,b=null,E=[],y=[],M=new Set,T=new Map,P=new gt;P.layers.enable(1),P.viewport=new nt;let N=new gt;N.layers.enable(2),N.viewport=new nt;let g=[P,N],w=new pc;w.layers.enable(1),w.layers.enable(2);let D=null,R=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(U){let Q=E[U];return Q===void 0&&(Q=new Es,E[U]=Q),Q.getTargetRaySpace()},this.getControllerGrip=function(U){let Q=E[U];return Q===void 0&&(Q=new Es,E[U]=Q),Q.getGripSpace()},this.getHand=function(U){let Q=E[U];return Q===void 0&&(Q=new Es,E[U]=Q),Q.getHandSpace()};function X(U){let Q=y.indexOf(U.inputSource);if(Q===-1)return;let se=E[Q];se!==void 0&&se.dispatchEvent({type:U.type,data:U.inputSource})}function O(){i.removeEventListener("select",X),i.removeEventListener("selectstart",X),i.removeEventListener("selectend",X),i.removeEventListener("squeeze",X),i.removeEventListener("squeezestart",X),i.removeEventListener("squeezeend",X),i.removeEventListener("end",O),i.removeEventListener("inputsourceschange",B);for(let U=0;U<E.length;U++){let Q=y[U];Q!==null&&(y[U]=null,E[U].disconnect(Q))}D=null,R=null,e.setRenderTarget(p),m=null,u=null,d=null,i=null,b=null,fe.stop(),n.isPresenting=!1,n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(U){r=U,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(U){o=U,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(U){c=U},this.getBaseLayer=function(){return u!==null?u:m},this.getBinding=function(){return d},this.getFrame=function(){return _},this.getSession=function(){return i},this.setSession=async function(U){if(i=U,i!==null){if(p=e.getRenderTarget(),i.addEventListener("select",X),i.addEventListener("selectstart",X),i.addEventListener("selectend",X),i.addEventListener("squeeze",X),i.addEventListener("squeezestart",X),i.addEventListener("squeezeend",X),i.addEventListener("end",O),i.addEventListener("inputsourceschange",B),f.xrCompatible!==!0&&await t.makeXRCompatible(),i.renderState.layers===void 0||e.capabilities.isWebGL2===!1){let Q={antialias:i.renderState.layers===void 0?f.antialias:!0,alpha:f.alpha,depth:f.depth,stencil:f.stencil,framebufferScaleFactor:r};m=new XRWebGLLayer(i,t,Q),i.updateRenderState({baseLayer:m}),b=new nn(m.framebufferWidth,m.framebufferHeight,{format:It,type:bn,encoding:e.outputEncoding,stencilBuffer:f.stencil})}else{let Q=null,se=null,ie=null;f.depth&&(ie=f.stencil?35056:33190,Q=f.stencil?Wn:Sn,se=f.stencil?Gn:Mn);let I={colorFormat:32856,depthFormat:ie,scaleFactor:r};d=new XRWebGLBinding(i,t),u=d.createProjectionLayer(I),i.updateRenderState({layers:[u]}),b=new nn(u.textureWidth,u.textureHeight,{format:It,type:bn,depthTexture:new mc(u.textureWidth,u.textureHeight,se,void 0,void 0,void 0,void 0,void 0,void 0,Q),stencilBuffer:f.stencil,encoding:e.outputEncoding,samples:f.antialias?4:0});let Me=e.properties.get(b);Me.__ignoreDepthValues=u.ignoreDepthValues}b.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await i.requestReferenceSpace(o),fe.setContext(i),fe.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}};function B(U){for(let Q=0;Q<U.removed.length;Q++){let se=U.removed[Q],ie=y.indexOf(se);ie>=0&&(y[ie]=null,E[ie].disconnect(se))}for(let Q=0;Q<U.added.length;Q++){let se=U.added[Q],ie=y.indexOf(se);if(ie===-1){for(let Me=0;Me<E.length;Me++)if(Me>=y.length){y.push(se),ie=Me;break}else if(y[Me]===null){y[Me]=se,ie=Me;break}if(ie===-1)break}let I=E[ie];I&&I.connect(se)}}let A=new H,C=new H;function J(U,Q,se){A.setFromMatrixPosition(Q.matrixWorld),C.setFromMatrixPosition(se.matrixWorld);let ie=A.distanceTo(C),I=Q.projectionMatrix.elements,Me=se.projectionMatrix.elements,ge=I[14]/(I[10]-1),V=I[14]/(I[10]+1),ee=(I[9]+1)/I[5],K=(I[9]-1)/I[5],oe=(I[8]-1)/I[0],ce=(Me[8]+1)/Me[0],Oe=ge*oe,Ie=ge*ce,qe=ie/(-oe+ce),rt=qe*-oe;Q.matrixWorld.decompose(U.position,U.quaternion,U.scale),U.translateX(rt),U.translateZ(qe),U.matrixWorld.compose(U.position,U.quaternion,U.scale),U.matrixWorldInverse.copy(U.matrixWorld).invert();let Ke=ge+qe,Be=V+qe,Vt=Oe-rt,Rt=Ie+(ie-rt),S=ee*V/Be*Ke,x=K*V/Be*Ke;U.projectionMatrix.makePerspective(Vt,Rt,S,x,Ke,Be)}function k(U,Q){Q===null?U.matrixWorld.copy(U.matrix):U.matrixWorld.multiplyMatrices(Q.matrixWorld,U.matrix),U.matrixWorldInverse.copy(U.matrixWorld).invert()}this.updateCamera=function(U){if(i===null)return;w.near=N.near=P.near=U.near,w.far=N.far=P.far=U.far,(D!==w.near||R!==w.far)&&(i.updateRenderState({depthNear:w.near,depthFar:w.far}),D=w.near,R=w.far);let Q=U.parent,se=w.cameras;k(w,Q);for(let I=0;I<se.length;I++)k(se[I],Q);w.matrixWorld.decompose(w.position,w.quaternion,w.scale),U.matrix.copy(w.matrix),U.matrix.decompose(U.position,U.quaternion,U.scale);let ie=U.children;for(let I=0,Me=ie.length;I<Me;I++)ie[I].updateMatrixWorld(!0);se.length===2?J(w,P,N):w.projectionMatrix.copy(P.projectionMatrix)},this.getCamera=function(){return w},this.getFoveation=function(){if(!(u===null&&m===null))return l},this.setFoveation=function(U){l=U,u!==null&&(u.fixedFoveation=U),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=U)},this.getPlanes=function(){return M};let j=null;function Z(U,Q){if(h=Q.getViewerPose(c||a),_=Q,h!==null){let se=h.views;m!==null&&(e.setRenderTargetFramebuffer(b,m.framebuffer),e.setRenderTarget(b));let ie=!1;se.length!==w.cameras.length&&(w.cameras.length=0,ie=!0);for(let I=0;I<se.length;I++){let Me=se[I],ge=null;if(m!==null)ge=m.getViewport(Me);else{let ee=d.getViewSubImage(u,Me);ge=ee.viewport,I===0&&(e.setRenderTargetTextures(b,ee.colorTexture,u.ignoreDepthValues?void 0:ee.depthStencilTexture),e.setRenderTarget(b))}let V=g[I];V===void 0&&(V=new gt,V.layers.enable(I),V.viewport=new nt,g[I]=V),V.matrix.fromArray(Me.transform.matrix),V.projectionMatrix.fromArray(Me.projectionMatrix),V.viewport.set(ge.x,ge.y,ge.width,ge.height),I===0&&w.matrix.copy(V.matrix),ie===!0&&w.cameras.push(V)}}for(let se=0;se<E.length;se++){let ie=y[se],I=E[se];ie!==null&&I!==void 0&&I.update(ie,Q,c||a)}if(j&&j(U,Q),Q.detectedPlanes){n.dispatchEvent({type:"planesdetected",data:Q.detectedPlanes});let se=null;for(let ie of M)Q.detectedPlanes.has(ie)||(se===null&&(se=[]),se.push(ie));if(se!==null)for(let ie of se)M.delete(ie),T.delete(ie),n.dispatchEvent({type:"planeremoved",data:ie});for(let ie of Q.detectedPlanes)if(!M.has(ie))M.add(ie),T.set(ie,Q.lastChangedTime),n.dispatchEvent({type:"planeadded",data:ie});else{let I=T.get(ie);ie.lastChangedTime>I&&(T.set(ie,ie.lastChangedTime),n.dispatchEvent({type:"planechanged",data:ie}))}}_=null}let fe=new Nl;fe.setAnimationLoop(Z),this.setAnimationLoop=function(U){j=U},this.dispose=function(){}}};function S_(s,e){function t(f,p){p.color.getRGB(f.fogColor.value,Pl(s)),p.isFog?(f.fogNear.value=p.near,f.fogFar.value=p.far):p.isFogExp2&&(f.fogDensity.value=p.density)}function n(f,p,b,E,y){p.isMeshBasicMaterial||p.isMeshLambertMaterial?i(f,p):p.isMeshToonMaterial?(i(f,p),h(f,p)):p.isMeshPhongMaterial?(i(f,p),c(f,p)):p.isMeshStandardMaterial?(i(f,p),d(f,p),p.isMeshPhysicalMaterial&&u(f,p,y)):p.isMeshMatcapMaterial?(i(f,p),m(f,p)):p.isMeshDepthMaterial?i(f,p):p.isMeshDistanceMaterial?(i(f,p),_(f,p)):p.isMeshNormalMaterial?i(f,p):p.isLineBasicMaterial?(r(f,p),p.isLineDashedMaterial&&a(f,p)):p.isPointsMaterial?o(f,p,b,E):p.isSpriteMaterial?l(f,p):p.isShadowMaterial?(f.color.value.copy(p.color),f.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function i(f,p){f.opacity.value=p.opacity,p.color&&f.diffuse.value.copy(p.color),p.emissive&&f.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(f.map.value=p.map),p.alphaMap&&(f.alphaMap.value=p.alphaMap),p.bumpMap&&(f.bumpMap.value=p.bumpMap,f.bumpScale.value=p.bumpScale,p.side===vt&&(f.bumpScale.value*=-1)),p.displacementMap&&(f.displacementMap.value=p.displacementMap,f.displacementScale.value=p.displacementScale,f.displacementBias.value=p.displacementBias),p.emissiveMap&&(f.emissiveMap.value=p.emissiveMap),p.normalMap&&(f.normalMap.value=p.normalMap,f.normalScale.value.copy(p.normalScale),p.side===vt&&f.normalScale.value.negate()),p.specularMap&&(f.specularMap.value=p.specularMap),p.alphaTest>0&&(f.alphaTest.value=p.alphaTest);let b=e.get(p).envMap;if(b&&(f.envMap.value=b,f.flipEnvMap.value=b.isCubeTexture&&b.isRenderTargetTexture===!1?-1:1,f.reflectivity.value=p.reflectivity,f.ior.value=p.ior,f.refractionRatio.value=p.refractionRatio),p.lightMap){f.lightMap.value=p.lightMap;let M=s.physicallyCorrectLights!==!0?Math.PI:1;f.lightMapIntensity.value=p.lightMapIntensity*M}p.aoMap&&(f.aoMap.value=p.aoMap,f.aoMapIntensity.value=p.aoMapIntensity);let E;p.map?E=p.map:p.specularMap?E=p.specularMap:p.displacementMap?E=p.displacementMap:p.normalMap?E=p.normalMap:p.bumpMap?E=p.bumpMap:p.roughnessMap?E=p.roughnessMap:p.metalnessMap?E=p.metalnessMap:p.alphaMap?E=p.alphaMap:p.emissiveMap?E=p.emissiveMap:p.clearcoatMap?E=p.clearcoatMap:p.clearcoatNormalMap?E=p.clearcoatNormalMap:p.clearcoatRoughnessMap?E=p.clearcoatRoughnessMap:p.iridescenceMap?E=p.iridescenceMap:p.iridescenceThicknessMap?E=p.iridescenceThicknessMap:p.specularIntensityMap?E=p.specularIntensityMap:p.specularColorMap?E=p.specularColorMap:p.transmissionMap?E=p.transmissionMap:p.thicknessMap?E=p.thicknessMap:p.sheenColorMap?E=p.sheenColorMap:p.sheenRoughnessMap&&(E=p.sheenRoughnessMap),E!==void 0&&(E.isWebGLRenderTarget&&(E=E.texture),E.matrixAutoUpdate===!0&&E.updateMatrix(),f.uvTransform.value.copy(E.matrix));let y;p.aoMap?y=p.aoMap:p.lightMap&&(y=p.lightMap),y!==void 0&&(y.isWebGLRenderTarget&&(y=y.texture),y.matrixAutoUpdate===!0&&y.updateMatrix(),f.uv2Transform.value.copy(y.matrix))}function r(f,p){f.diffuse.value.copy(p.color),f.opacity.value=p.opacity}function a(f,p){f.dashSize.value=p.dashSize,f.totalSize.value=p.dashSize+p.gapSize,f.scale.value=p.scale}function o(f,p,b,E){f.diffuse.value.copy(p.color),f.opacity.value=p.opacity,f.size.value=p.size*b,f.scale.value=E*.5,p.map&&(f.map.value=p.map),p.alphaMap&&(f.alphaMap.value=p.alphaMap),p.alphaTest>0&&(f.alphaTest.value=p.alphaTest);let y;p.map?y=p.map:p.alphaMap&&(y=p.alphaMap),y!==void 0&&(y.matrixAutoUpdate===!0&&y.updateMatrix(),f.uvTransform.value.copy(y.matrix))}function l(f,p){f.diffuse.value.copy(p.color),f.opacity.value=p.opacity,f.rotation.value=p.rotation,p.map&&(f.map.value=p.map),p.alphaMap&&(f.alphaMap.value=p.alphaMap),p.alphaTest>0&&(f.alphaTest.value=p.alphaTest);let b;p.map?b=p.map:p.alphaMap&&(b=p.alphaMap),b!==void 0&&(b.matrixAutoUpdate===!0&&b.updateMatrix(),f.uvTransform.value.copy(b.matrix))}function c(f,p){f.specular.value.copy(p.specular),f.shininess.value=Math.max(p.shininess,1e-4)}function h(f,p){p.gradientMap&&(f.gradientMap.value=p.gradientMap)}function d(f,p){f.roughness.value=p.roughness,f.metalness.value=p.metalness,p.roughnessMap&&(f.roughnessMap.value=p.roughnessMap),p.metalnessMap&&(f.metalnessMap.value=p.metalnessMap),e.get(p).envMap&&(f.envMapIntensity.value=p.envMapIntensity)}function u(f,p,b){f.ior.value=p.ior,p.sheen>0&&(f.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),f.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(f.sheenColorMap.value=p.sheenColorMap),p.sheenRoughnessMap&&(f.sheenRoughnessMap.value=p.sheenRoughnessMap)),p.clearcoat>0&&(f.clearcoat.value=p.clearcoat,f.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(f.clearcoatMap.value=p.clearcoatMap),p.clearcoatRoughnessMap&&(f.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap),p.clearcoatNormalMap&&(f.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),f.clearcoatNormalMap.value=p.clearcoatNormalMap,p.side===vt&&f.clearcoatNormalScale.value.negate())),p.iridescence>0&&(f.iridescence.value=p.iridescence,f.iridescenceIOR.value=p.iridescenceIOR,f.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],f.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(f.iridescenceMap.value=p.iridescenceMap),p.iridescenceThicknessMap&&(f.iridescenceThicknessMap.value=p.iridescenceThicknessMap)),p.transmission>0&&(f.transmission.value=p.transmission,f.transmissionSamplerMap.value=b.texture,f.transmissionSamplerSize.value.set(b.width,b.height),p.transmissionMap&&(f.transmissionMap.value=p.transmissionMap),f.thickness.value=p.thickness,p.thicknessMap&&(f.thicknessMap.value=p.thicknessMap),f.attenuationDistance.value=p.attenuationDistance,f.attenuationColor.value.copy(p.attenuationColor)),f.specularIntensity.value=p.specularIntensity,f.specularColor.value.copy(p.specularColor),p.specularIntensityMap&&(f.specularIntensityMap.value=p.specularIntensityMap),p.specularColorMap&&(f.specularColorMap.value=p.specularColorMap)}function m(f,p){p.matcap&&(f.matcap.value=p.matcap)}function _(f,p){f.referencePosition.value.copy(p.referencePosition),f.nearDistance.value=p.nearDistance,f.farDistance.value=p.farDistance}return{refreshFogUniforms:t,refreshMaterialUniforms:n}}function A_(s,e,t,n){let i={},r={},a=[],o=t.isWebGL2?s.getParameter(35375):0;function l(E,y){let M=y.program;n.uniformBlockBinding(E,M)}function c(E,y){let M=i[E.id];M===void 0&&(_(E),M=h(E),i[E.id]=M,E.addEventListener("dispose",p));let T=y.program;n.updateUBOMapping(E,T);let P=e.render.frame;r[E.id]!==P&&(u(E),r[E.id]=P)}function h(E){let y=d();E.__bindingPointIndex=y;let M=s.createBuffer(),T=E.__size,P=E.usage;return s.bindBuffer(35345,M),s.bufferData(35345,T,P),s.bindBuffer(35345,null),s.bindBufferBase(35345,y,M),M}function d(){for(let E=0;E<o;E++)if(a.indexOf(E)===-1)return a.push(E),E;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(E){let y=i[E.id],M=E.uniforms,T=E.__cache;s.bindBuffer(35345,y);for(let P=0,N=M.length;P<N;P++){let g=M[P];if(m(g,P,T)===!0){let w=g.__offset,D=Array.isArray(g.value)?g.value:[g.value],R=0;for(let X=0;X<D.length;X++){let O=D[X],B=f(O);typeof O=="number"?(g.__data[0]=O,s.bufferSubData(35345,w+R,g.__data)):O.isMatrix3?(g.__data[0]=O.elements[0],g.__data[1]=O.elements[1],g.__data[2]=O.elements[2],g.__data[3]=O.elements[0],g.__data[4]=O.elements[3],g.__data[5]=O.elements[4],g.__data[6]=O.elements[5],g.__data[7]=O.elements[0],g.__data[8]=O.elements[6],g.__data[9]=O.elements[7],g.__data[10]=O.elements[8],g.__data[11]=O.elements[0]):(O.toArray(g.__data,R),R+=B.storage/Float32Array.BYTES_PER_ELEMENT)}s.bufferSubData(35345,w,g.__data)}}s.bindBuffer(35345,null)}function m(E,y,M){let T=E.value;if(M[y]===void 0){if(typeof T=="number")M[y]=T;else{let P=Array.isArray(T)?T:[T],N=[];for(let g=0;g<P.length;g++)N.push(P[g].clone());M[y]=N}return!0}else if(typeof T=="number"){if(M[y]!==T)return M[y]=T,!0}else{let P=Array.isArray(M[y])?M[y]:[M[y]],N=Array.isArray(T)?T:[T];for(let g=0;g<P.length;g++){let w=P[g];if(w.equals(N[g])===!1)return w.copy(N[g]),!0}}return!1}function _(E){let y=E.uniforms,M=0,T=16,P=0;for(let N=0,g=y.length;N<g;N++){let w=y[N],D={boundary:0,storage:0},R=Array.isArray(w.value)?w.value:[w.value];for(let X=0,O=R.length;X<O;X++){let B=R[X],A=f(B);D.boundary+=A.boundary,D.storage+=A.storage}if(w.__data=new Float32Array(D.storage/Float32Array.BYTES_PER_ELEMENT),w.__offset=M,N>0){P=M%T;let X=T-P;P!==0&&X-D.boundary<0&&(M+=T-P,w.__offset=M)}M+=D.storage}return P=M%T,P>0&&(M+=T-P),E.__size=M,E.__cache={},this}function f(E){let y={boundary:0,storage:0};return typeof E=="number"?(y.boundary=4,y.storage=4):E.isVector2?(y.boundary=8,y.storage=8):E.isVector3||E.isColor?(y.boundary=16,y.storage=12):E.isVector4?(y.boundary=16,y.storage=16):E.isMatrix3?(y.boundary=48,y.storage=48):E.isMatrix4?(y.boundary=64,y.storage=64):E.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",E),y}function p(E){let y=E.target;y.removeEventListener("dispose",p);let M=a.indexOf(y.__bindingPointIndex);a.splice(M,1),s.deleteBuffer(i[y.id]),delete i[y.id],delete r[y.id]}function b(){for(let E in i)s.deleteBuffer(i[E]);a=[],i={},r={}}return{bind:l,update:c,dispose:b}}function E_(){let s=is("canvas");return s.style.display="block",s}function lo(s={}){this.isWebGLRenderer=!0;let e=s.canvas!==void 0?s.canvas:E_(),t=s.context!==void 0?s.context:null,n=s.depth!==void 0?s.depth:!0,i=s.stencil!==void 0?s.stencil:!0,r=s.antialias!==void 0?s.antialias:!1,a=s.premultipliedAlpha!==void 0?s.premultipliedAlpha:!0,o=s.preserveDrawingBuffer!==void 0?s.preserveDrawingBuffer:!1,l=s.powerPreference!==void 0?s.powerPreference:"default",c=s.failIfMajorPerformanceCaveat!==void 0?s.failIfMajorPerformanceCaveat:!1,h;t!==null?h=t.getContextAttributes().alpha:h=s.alpha!==void 0?s.alpha:!1;let d=null,u=null,m=[],_=[];this.domElement=e,this.debug={checkShaderErrors:!0},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.outputEncoding=An,this.physicallyCorrectLights=!1,this.toneMapping=Xt,this.toneMappingExposure=1;let f=this,p=!1,b=0,E=0,y=null,M=-1,T=null,P=new nt,N=new nt,g=null,w=e.width,D=e.height,R=1,X=null,O=null,B=new nt(0,0,w,D),A=new nt(0,0,w,D),C=!1,J=new to,k=!1,j=!1,Z=null,fe=new it,U=new Ue,Q=new H,se={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function ie(){return y===null?R:1}let I=t;function Me(v,z){for(let W=0;W<v.length;W++){let F=v[W],Y=e.getContext(F,z);if(Y!==null)return Y}return null}try{let v={alpha:!0,depth:n,stencil:i,antialias:r,premultipliedAlpha:a,preserveDrawingBuffer:o,powerPreference:l,failIfMajorPerformanceCaveat:c};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${cr}`),e.addEventListener("webglcontextlost",be,!1),e.addEventListener("webglcontextrestored",xe,!1),e.addEventListener("webglcontextcreationerror",De,!1),I===null){let z=["webgl2","webgl","experimental-webgl"];if(f.isWebGL1Renderer===!0&&z.shift(),I=Me(z,v),I===null)throw Me(z)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}I.getShaderPrecisionFormat===void 0&&(I.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(v){throw console.error("THREE.WebGLRenderer: "+v.message),v}let ge,V,ee,K,oe,ce,Oe,Ie,qe,rt,Ke,Be,Vt,Rt,S,x,q,ne,re,he,Se,ue,$,ve;function we(){ge=new Yg(I),V=new Hg(I,ge,s),ge.init(V),ue=new M_(I,ge,V),ee=new v_(I,ge,V),K=new Zg,oe=new l_,ce=new b_(I,ge,ee,oe,V,ue,K),Oe=new Gg(f),Ie=new Xg(f),qe=new rp(I,V),$=new Ug(I,ge,qe,V),rt=new $g(I,qe,K,$),Ke=new e0(I,rt,qe,K),re=new Qg(I,V,ce),x=new Vg(oe),Be=new a_(f,Oe,Ie,ge,V,$,x),Vt=new S_(f,oe),Rt=new h_,S=new g_(ge,V),ne=new zg(f,Oe,Ie,ee,Ke,h,a),q=new y_(f,Ke,V),ve=new A_(I,K,V,ee),he=new kg(I,ge,K,V),Se=new Kg(I,ge,K,V),K.programs=Be.programs,f.capabilities=V,f.extensions=ge,f.properties=oe,f.renderLists=Rt,f.shadowMap=q,f.state=ee,f.info=K}we();let me=new gc(f,I);this.xr=me,this.getContext=function(){return I},this.getContextAttributes=function(){return I.getContextAttributes()},this.forceContextLoss=function(){let v=ge.get("WEBGL_lose_context");v&&v.loseContext()},this.forceContextRestore=function(){let v=ge.get("WEBGL_lose_context");v&&v.restoreContext()},this.getPixelRatio=function(){return R},this.setPixelRatio=function(v){v!==void 0&&(R=v,this.setSize(w,D,!1))},this.getSize=function(v){return v.set(w,D)},this.setSize=function(v,z,W){if(me.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}w=v,D=z,e.width=Math.floor(v*R),e.height=Math.floor(z*R),W!==!1&&(e.style.width=v+"px",e.style.height=z+"px"),this.setViewport(0,0,v,z)},this.getDrawingBufferSize=function(v){return v.set(w*R,D*R).floor()},this.setDrawingBufferSize=function(v,z,W){w=v,D=z,R=W,e.width=Math.floor(v*W),e.height=Math.floor(z*W),this.setViewport(0,0,v,z)},this.getCurrentViewport=function(v){return v.copy(P)},this.getViewport=function(v){return v.copy(B)},this.setViewport=function(v,z,W,F){v.isVector4?B.set(v.x,v.y,v.z,v.w):B.set(v,z,W,F),ee.viewport(P.copy(B).multiplyScalar(R).floor())},this.getScissor=function(v){return v.copy(A)},this.setScissor=function(v,z,W,F){v.isVector4?A.set(v.x,v.y,v.z,v.w):A.set(v,z,W,F),ee.scissor(N.copy(A).multiplyScalar(R).floor())},this.getScissorTest=function(){return C},this.setScissorTest=function(v){ee.setScissorTest(C=v)},this.setOpaqueSort=function(v){X=v},this.setTransparentSort=function(v){O=v},this.getClearColor=function(v){return v.copy(ne.getClearColor())},this.setClearColor=function(){ne.setClearColor.apply(ne,arguments)},this.getClearAlpha=function(){return ne.getClearAlpha()},this.setClearAlpha=function(){ne.setClearAlpha.apply(ne,arguments)},this.clear=function(v=!0,z=!0,W=!0){let F=0;v&&(F|=16384),z&&(F|=256),W&&(F|=1024),I.clear(F)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",be,!1),e.removeEventListener("webglcontextrestored",xe,!1),e.removeEventListener("webglcontextcreationerror",De,!1),Rt.dispose(),S.dispose(),oe.dispose(),Oe.dispose(),Ie.dispose(),Ke.dispose(),$.dispose(),ve.dispose(),Be.dispose(),me.dispose(),me.removeEventListener("sessionstart",de),me.removeEventListener("sessionend",_e),Z&&(Z.dispose(),Z=null),Fe.stop()};function be(v){v.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),p=!0}function xe(){console.log("THREE.WebGLRenderer: Context Restored."),p=!1;let v=K.autoReset,z=q.enabled,W=q.autoUpdate,F=q.needsUpdate,Y=q.type;we(),K.autoReset=v,q.enabled=z,q.autoUpdate=W,q.needsUpdate=F,q.type=Y}function De(v){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",v.statusMessage)}function He(v){let z=v.target;z.removeEventListener("dispose",He),Qe(z)}function Qe(v){L(v),oe.remove(v)}function L(v){let z=oe.get(v).programs;z!==void 0&&(z.forEach(function(W){Be.releaseProgram(W)}),v.isShaderMaterial&&Be.releaseShaderCache(v))}this.renderBufferDirect=function(v,z,W,F,Y,ye){z===null&&(z=se);let Ae=Y.isMesh&&Y.matrixWorld.determinant()<0,Te=Cc(v,z,W,F,Y);ee.setMaterial(F,Ae);let Ce=W.index,Ne=1;F.wireframe===!0&&(Ce=rt.getWireframeAttribute(W),Ne=2);let Re=W.drawRange,Le=W.attributes.position,Xe=Re.start*Ne,_t=(Re.start+Re.count)*Ne;ye!==null&&(Xe=Math.max(Xe,ye.start*Ne),_t=Math.min(_t,(ye.start+ye.count)*Ne)),Ce!==null?(Xe=Math.max(Xe,0),_t=Math.min(_t,Ce.count)):Le!=null&&(Xe=Math.max(Xe,0),_t=Math.min(_t,Le.count));let Wt=_t-Xe;if(Wt<0||Wt===Infinity)return;$.setup(Y,F,Te,W,Ce);let pn,Ye=he;if(Ce!==null&&(pn=qe.get(Ce),Ye=Se,Ye.setIndex(pn)),Y.isMesh)F.wireframe===!0?(ee.setLineWidth(F.wireframeLinewidth*ie()),Ye.setMode(1)):Ye.setMode(4);else if(Y.isLine){let Pe=F.linewidth;Pe===void 0&&(Pe=1),ee.setLineWidth(Pe*ie()),Y.isLineSegments?Ye.setMode(1):Y.isLineLoop?Ye.setMode(2):Ye.setMode(3)}else Y.isPoints?Ye.setMode(0):Y.isSprite&&Ye.setMode(4);if(Y.isInstancedMesh)Ye.renderInstances(Xe,Wt,Y.count);else if(W.isInstancedBufferGeometry){let Pe=W._maxInstanceCount!==void 0?W._maxInstanceCount:Infinity,Rs=Math.min(W.instanceCount,Pe);Ye.renderInstances(Xe,Wt,Rs)}else Ye.render(Xe,Wt)},this.compile=function(v,z){function W(F,Y,ye){F.transparent===!0&&F.side===en&&F.forceSinglePass===!1?(F.side=vt,F.needsUpdate=!0,At(F,Y,ye),F.side=Qt,F.needsUpdate=!0,At(F,Y,ye),F.side=en):At(F,Y,ye)}u=S.get(v),u.init(),_.push(u),v.traverseVisible(function(F){F.isLight&&F.layers.test(z.layers)&&(u.pushLight(F),F.castShadow&&u.pushShadow(F))}),u.setupLights(f.physicallyCorrectLights),v.traverse(function(F){let Y=F.material;if(Y)if(Array.isArray(Y))for(let ye=0;ye<Y.length;ye++){let Ae=Y[ye];W(Ae,v,F)}else W(Y,v,F)}),_.pop(),u=null};let G=null;function te(v){G&&G(v)}function de(){Fe.stop()}function _e(){Fe.start()}let Fe=new Nl;Fe.setAnimationLoop(te),typeof self!="undefined"&&Fe.setContext(self),this.setAnimationLoop=function(v){G=v,me.setAnimationLoop(v),v===null?Fe.stop():Fe.start()},me.addEventListener("sessionstart",de),me.addEventListener("sessionend",_e),this.render=function(v,z){if(z!==void 0&&z.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(p===!0)return;v.matrixWorldAutoUpdate===!0&&v.updateMatrixWorld(),z.parent===null&&z.matrixWorldAutoUpdate===!0&&z.updateMatrixWorld(),me.enabled===!0&&me.isPresenting===!0&&(me.cameraAutoUpdate===!0&&me.updateCamera(z),z=me.getCamera()),v.isScene===!0&&v.onBeforeRender(f,v,z,y),u=S.get(v,_.length),u.init(),_.push(u),fe.multiplyMatrices(z.projectionMatrix,z.matrixWorldInverse),J.setFromProjectionMatrix(fe),j=this.localClippingEnabled,k=x.init(this.clippingPlanes,j),d=Rt.get(v,m.length),d.init(),m.push(d),et(v,z,0,f.sortObjects),d.finish(),f.sortObjects===!0&&d.sort(X,O),k===!0&&x.beginShadows();let W=u.state.shadowsArray;if(q.render(W,v,z),k===!0&&x.endShadows(),this.info.autoReset===!0&&this.info.reset(),ne.render(d,v),u.setupLights(f.physicallyCorrectLights),z.isArrayCamera){let F=z.cameras;for(let Y=0,ye=F.length;Y<ye;Y++){let Ae=F[Y];ot(d,v,Ae,Ae.viewport)}}else ot(d,v,z);y!==null&&(ce.updateMultisampleRenderTarget(y),ce.updateRenderTargetMipmap(y)),v.isScene===!0&&v.onAfterRender(f,v,z),$.resetDefaultState(),M=-1,T=null,_.pop(),_.length>0?u=_[_.length-1]:u=null,m.pop(),m.length>0?d=m[m.length-1]:d=null};function et(v,z,W,F){if(v.visible===!1)return;if(v.layers.test(z.layers)){if(v.isGroup)W=v.renderOrder;else if(v.isLOD)v.autoUpdate===!0&&v.update(z);else if(v.isLight)u.pushLight(v),v.castShadow&&u.pushShadow(v);else if(v.isSprite){if(!v.frustumCulled||J.intersectsSprite(v)){F&&Q.setFromMatrixPosition(v.matrixWorld).applyMatrix4(fe);let Ae=Ke.update(v),Te=v.material;Te.visible&&d.push(v,Ae,Te,W,Q.z,null)}}else if((v.isMesh||v.isLine||v.isPoints)&&(v.isSkinnedMesh&&v.skeleton.frame!==K.render.frame&&(v.skeleton.update(),v.skeleton.frame=K.render.frame),!v.frustumCulled||J.intersectsObject(v))){F&&Q.setFromMatrixPosition(v.matrixWorld).applyMatrix4(fe);let Ae=Ke.update(v),Te=v.material;if(Array.isArray(Te)){let Ce=Ae.groups;for(let Ne=0,Re=Ce.length;Ne<Re;Ne++){let Le=Ce[Ne],Xe=Te[Le.materialIndex];Xe&&Xe.visible&&d.push(v,Ae,Xe,W,Q.z,Le)}}else Te.visible&&d.push(v,Ae,Te,W,Q.z,null)}}let ye=v.children;for(let Ae=0,Te=ye.length;Ae<Te;Ae++)et(ye[Ae],z,W,F)}function ot(v,z,W,F){let Y=v.opaque,ye=v.transmissive,Ae=v.transparent;u.setupLightsView(W),k===!0&&x.setGlobalState(f.clippingPlanes,W),ye.length>0&&fn(Y,z,W),F&&ee.viewport(P.copy(F)),Y.length>0&&Ve(Y,z,W),ye.length>0&&Ve(ye,z,W),Ae.length>0&&Ve(Ae,z,W),ee.buffers.depth.setTest(!0),ee.buffers.depth.setMask(!0),ee.buffers.color.setMask(!0),ee.setPolygonOffset(!1)}function fn(v,z,W){let F=V.isWebGL2;Z===null&&(Z=new nn(1,1,{generateMipmaps:!0,type:ge.has("EXT_color_buffer_half_float")?Mi:bn,minFilter:bi,samples:F&&r===!0?4:0})),f.getDrawingBufferSize(U),F?Z.setSize(U.x,U.y):Z.setSize(Er(U.x),Er(U.y));let Y=f.getRenderTarget();f.setRenderTarget(Z),f.clear();let ye=f.toneMapping;f.toneMapping=Xt,Ve(v,z,W),f.toneMapping=ye,ce.updateMultisampleRenderTarget(Z),ce.updateRenderTargetMipmap(Z),f.setRenderTarget(Y)}function Ve(v,z,W){let F=z.isScene===!0?z.overrideMaterial:null;for(let Y=0,ye=v.length;Y<ye;Y++){let Ae=v[Y],Te=Ae.object,Ce=Ae.geometry,Ne=F===null?Ae.material:F,Re=Ae.group;Te.layers.test(W.layers)&&Gt(Te,z,W,Ce,Ne,Re)}}function Gt(v,z,W,F,Y,ye){v.onBeforeRender(f,z,W,F,Y,ye),v.modelViewMatrix.multiplyMatrices(W.matrixWorldInverse,v.matrixWorld),v.normalMatrix.getNormalMatrix(v.modelViewMatrix),Y.onBeforeRender(f,z,W,F,v,ye),Y.transparent===!0&&Y.side===en&&Y.forceSinglePass===!1?(Y.side=vt,Y.needsUpdate=!0,f.renderBufferDirect(W,z,F,Y,v,ye),Y.side=Qt,Y.needsUpdate=!0,f.renderBufferDirect(W,z,F,Y,v,ye),Y.side=en):f.renderBufferDirect(W,z,F,Y,v,ye),v.onAfterRender(f,z,W,F,Y,ye)}function At(v,z,W){z.isScene!==!0&&(z=se);let F=oe.get(v),Y=u.state.lights,ye=u.state.shadowsArray,Ae=Y.state.version,Te=Be.getParameters(v,Y.state,ye,z,W),Ce=Be.getProgramCacheKey(Te),Ne=F.programs;F.environment=v.isMeshStandardMaterial?z.environment:null,F.fog=z.fog,F.envMap=(v.isMeshStandardMaterial?Ie:Oe).get(v.envMap||F.environment),Ne===void 0&&(v.addEventListener("dispose",He),Ne=new Map,F.programs=Ne);let Re=Ne.get(Ce);if(Re!==void 0){if(F.currentProgram===Re&&F.lightsStateVersion===Ae)return fo(v,Te),Re}else Te.uniforms=Be.getUniforms(v),v.onBuild(W,Te,f),v.onBeforeCompile(Te,f),Re=Be.acquireProgram(Te,Ce),Ne.set(Ce,Re),F.uniforms=Te.uniforms;let Le=F.uniforms;(!v.isShaderMaterial&&!v.isRawShaderMaterial||v.clipping===!0)&&(Le.clippingPlanes=x.uniform),fo(v,Te),F.needsLights=Lc(v),F.lightsStateVersion=Ae,F.needsLights&&(Le.ambientLightColor.value=Y.state.ambient,Le.lightProbe.value=Y.state.probe,Le.directionalLights.value=Y.state.directional,Le.directionalLightShadows.value=Y.state.directionalShadow,Le.spotLights.value=Y.state.spot,Le.spotLightShadows.value=Y.state.spotShadow,Le.rectAreaLights.value=Y.state.rectArea,Le.ltc_1.value=Y.state.rectAreaLTC1,Le.ltc_2.value=Y.state.rectAreaLTC2,Le.pointLights.value=Y.state.point,Le.pointLightShadows.value=Y.state.pointShadow,Le.hemisphereLights.value=Y.state.hemi,Le.directionalShadowMap.value=Y.state.directionalShadowMap,Le.directionalShadowMatrix.value=Y.state.directionalShadowMatrix,Le.spotShadowMap.value=Y.state.spotShadowMap,Le.spotLightMatrix.value=Y.state.spotLightMatrix,Le.spotLightMap.value=Y.state.spotLightMap,Le.pointShadowMap.value=Y.state.pointShadowMap,Le.pointShadowMatrix.value=Y.state.pointShadowMatrix);let Xe=Re.getUniforms(),_t=Ni.seqWithValue(Xe.seq,Le);return F.currentProgram=Re,F.uniformsList=_t,Re}function fo(v,z){let W=oe.get(v);W.outputEncoding=z.outputEncoding,W.instancing=z.instancing,W.skinning=z.skinning,W.morphTargets=z.morphTargets,W.morphNormals=z.morphNormals,W.morphColors=z.morphColors,W.morphTargetsCount=z.morphTargetsCount,W.numClippingPlanes=z.numClippingPlanes,W.numIntersection=z.numClipIntersection,W.vertexAlphas=z.vertexAlphas,W.vertexTangents=z.vertexTangents,W.toneMapping=z.toneMapping}function Cc(v,z,W,F,Y){z.isScene!==!0&&(z=se),ce.resetTextureUnits();let ye=z.fog,Ae=F.isMeshStandardMaterial?z.environment:null,Te=y===null?f.outputEncoding:y.isXRRenderTarget===!0?y.texture.encoding:An,Ce=(F.isMeshStandardMaterial?Ie:Oe).get(F.envMap||Ae),Ne=F.vertexColors===!0&&!!W.attributes.color&&W.attributes.color.itemSize===4,Re=!!F.normalMap&&!!W.attributes.tangent,Le=!!W.morphAttributes.position,Xe=!!W.morphAttributes.normal,_t=!!W.morphAttributes.color,Wt=F.toneMapped?f.toneMapping:Xt,pn=W.morphAttributes.position||W.morphAttributes.normal||W.morphAttributes.color,Ye=pn!==void 0?pn.length:0,Pe=oe.get(F),Rs=u.state.lights;if(k===!0&&(j===!0||v!==T)){let xt=v===T&&F.id===M;x.setState(F,v,xt)}let tt=!1;F.version===Pe.__version?(Pe.needsLights&&Pe.lightsStateVersion!==Rs.state.version||Pe.outputEncoding!==Te||Y.isInstancedMesh&&Pe.instancing===!1||!Y.isInstancedMesh&&Pe.instancing===!0||Y.isSkinnedMesh&&Pe.skinning===!1||!Y.isSkinnedMesh&&Pe.skinning===!0||Pe.envMap!==Ce||F.fog===!0&&Pe.fog!==ye||Pe.numClippingPlanes!==void 0&&(Pe.numClippingPlanes!==x.numPlanes||Pe.numIntersection!==x.numIntersection)||Pe.vertexAlphas!==Ne||Pe.vertexTangents!==Re||Pe.morphTargets!==Le||Pe.morphNormals!==Xe||Pe.morphColors!==_t||Pe.toneMapping!==Wt||V.isWebGL2===!0&&Pe.morphTargetsCount!==Ye)&&(tt=!0):(tt=!0,Pe.__version=F.version);let mn=Pe.currentProgram;tt===!0&&(mn=At(F,z,Y));let po=!1,di=!1,Ls=!1,lt=mn.getUniforms(),gn=Pe.uniforms;if(ee.useProgram(mn.program)&&(po=!0,di=!0,Ls=!0),F.id!==M&&(M=F.id,di=!0),po||T!==v){if(lt.setValue(I,"projectionMatrix",v.projectionMatrix),V.logarithmicDepthBuffer&&lt.setValue(I,"logDepthBufFC",2/(Math.log(v.far+1)/Math.LN2)),T!==v&&(T=v,di=!0,Ls=!0),F.isShaderMaterial||F.isMeshPhongMaterial||F.isMeshToonMaterial||F.isMeshStandardMaterial||F.envMap){let xt=lt.map.cameraPosition;xt!==void 0&&xt.setValue(I,Q.setFromMatrixPosition(v.matrixWorld))}(F.isMeshPhongMaterial||F.isMeshToonMaterial||F.isMeshLambertMaterial||F.isMeshBasicMaterial||F.isMeshStandardMaterial||F.isShaderMaterial)&&lt.setValue(I,"isOrthographic",v.isOrthographicCamera===!0),(F.isMeshPhongMaterial||F.isMeshToonMaterial||F.isMeshLambertMaterial||F.isMeshBasicMaterial||F.isMeshStandardMaterial||F.isShaderMaterial||F.isShadowMaterial||Y.isSkinnedMesh)&&lt.setValue(I,"viewMatrix",v.matrixWorldInverse)}if(Y.isSkinnedMesh){lt.setOptional(I,Y,"bindMatrix"),lt.setOptional(I,Y,"bindMatrixInverse");let xt=Y.skeleton;xt&&(V.floatVertexTextures?(xt.boneTexture===null&&xt.computeBoneTexture(),lt.setValue(I,"boneTexture",xt.boneTexture,ce),lt.setValue(I,"boneTextureSize",xt.boneTextureSize)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}let Ps=W.morphAttributes;if((Ps.position!==void 0||Ps.normal!==void 0||Ps.color!==void 0&&V.isWebGL2===!0)&&re.update(Y,W,F,mn),(di||Pe.receiveShadow!==Y.receiveShadow)&&(Pe.receiveShadow=Y.receiveShadow,lt.setValue(I,"receiveShadow",Y.receiveShadow)),F.isMeshGouraudMaterial&&F.envMap!==null&&(gn.envMap.value=Ce,gn.flipEnvMap.value=Ce.isCubeTexture&&Ce.isRenderTargetTexture===!1?-1:1),di&&(lt.setValue(I,"toneMappingExposure",f.toneMappingExposure),Pe.needsLights&&Rc(gn,Ls),ye&&F.fog===!0&&Vt.refreshFogUniforms(gn,ye),Vt.refreshMaterialUniforms(gn,F,R,D,Z),Ni.upload(I,Pe.uniformsList,gn,ce)),F.isShaderMaterial&&F.uniformsNeedUpdate===!0&&(Ni.upload(I,Pe.uniformsList,gn,ce),F.uniformsNeedUpdate=!1),F.isSpriteMaterial&&lt.setValue(I,"center",Y.center),lt.setValue(I,"modelViewMatrix",Y.modelViewMatrix),lt.setValue(I,"normalMatrix",Y.normalMatrix),lt.setValue(I,"modelMatrix",Y.matrixWorld),F.isShaderMaterial||F.isRawShaderMaterial){let xt=F.uniformsGroups;for(let Is=0,Pc=xt.length;Is<Pc;Is++)if(V.isWebGL2){let mo=xt[Is];ve.update(mo,mn),ve.bind(mo,mn)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return mn}function Rc(v,z){v.ambientLightColor.needsUpdate=z,v.lightProbe.needsUpdate=z,v.directionalLights.needsUpdate=z,v.directionalLightShadows.needsUpdate=z,v.pointLights.needsUpdate=z,v.pointLightShadows.needsUpdate=z,v.spotLights.needsUpdate=z,v.spotLightShadows.needsUpdate=z,v.rectAreaLights.needsUpdate=z,v.hemisphereLights.needsUpdate=z}function Lc(v){return v.isMeshLambertMaterial||v.isMeshToonMaterial||v.isMeshPhongMaterial||v.isMeshStandardMaterial||v.isShadowMaterial||v.isShaderMaterial&&v.lights===!0}this.getActiveCubeFace=function(){return b},this.getActiveMipmapLevel=function(){return E},this.getRenderTarget=function(){return y},this.setRenderTargetTextures=function(v,z,W){oe.get(v.texture).__webglTexture=z,oe.get(v.depthTexture).__webglTexture=W;let F=oe.get(v);F.__hasExternalTextures=!0,F.__hasExternalTextures&&(F.__autoAllocateDepthBuffer=W===void 0,F.__autoAllocateDepthBuffer||ge.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),F.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(v,z){let W=oe.get(v);W.__webglFramebuffer=z,W.__useDefaultFramebuffer=z===void 0},this.setRenderTarget=function(v,z=0,W=0){y=v,b=z,E=W;let F=!0,Y=null,ye=!1,Ae=!1;if(v){let Ce=oe.get(v);Ce.__useDefaultFramebuffer!==void 0?(ee.bindFramebuffer(36160,null),F=!1):Ce.__webglFramebuffer===void 0?ce.setupRenderTarget(v):Ce.__hasExternalTextures&&ce.rebindTextures(v,oe.get(v.texture).__webglTexture,oe.get(v.depthTexture).__webglTexture);let Ne=v.texture;(Ne.isData3DTexture||Ne.isDataArrayTexture||Ne.isCompressedArrayTexture)&&(Ae=!0);let Re=oe.get(v).__webglFramebuffer;v.isWebGLCubeRenderTarget?(Y=Re[z],ye=!0):V.isWebGL2&&v.samples>0&&ce.useMultisampledRTT(v)===!1?Y=oe.get(v).__webglMultisampledFramebuffer:Y=Re,P.copy(v.viewport),N.copy(v.scissor),g=v.scissorTest}else P.copy(B).multiplyScalar(R).floor(),N.copy(A).multiplyScalar(R).floor(),g=C;if(ee.bindFramebuffer(36160,Y)&&V.drawBuffers&&F&&ee.drawBuffers(v,Y),ee.viewport(P),ee.scissor(N),ee.setScissorTest(g),ye){let Ce=oe.get(v.texture);I.framebufferTexture2D(36160,36064,34069+z,Ce.__webglTexture,W)}else if(Ae){let Ce=oe.get(v.texture),Ne=z||0;I.framebufferTextureLayer(36160,36064,Ce.__webglTexture,W||0,Ne)}M=-1},this.readRenderTargetPixels=function(v,z,W,F,Y,ye,Ae){if(!(v&&v.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Te=oe.get(v).__webglFramebuffer;if(v.isWebGLCubeRenderTarget&&Ae!==void 0&&(Te=Te[Ae]),Te){ee.bindFramebuffer(36160,Te);try{let Ce=v.texture,Ne=Ce.format,Re=Ce.type;if(Ne!==It&&ue.convert(Ne)!==I.getParameter(35739)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}let Le=Re===Mi&&(ge.has("EXT_color_buffer_half_float")||V.isWebGL2&&ge.has("EXT_color_buffer_float"));if(Re!==bn&&ue.convert(Re)!==I.getParameter(35738)&&!(Re===wn&&(V.isWebGL2||ge.has("OES_texture_float")||ge.has("WEBGL_color_buffer_float")))&&!Le){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}z>=0&&z<=v.width-F&&W>=0&&W<=v.height-Y&&I.readPixels(z,W,F,Y,ue.convert(Ne),ue.convert(Re),ye)}finally{let Ce=y!==null?oe.get(y).__webglFramebuffer:null;ee.bindFramebuffer(36160,Ce)}}},this.copyFramebufferToTexture=function(v,z,W=0){let F=Math.pow(2,-W),Y=Math.floor(z.image.width*F),ye=Math.floor(z.image.height*F);ce.setTexture2D(z,0),I.copyTexSubImage2D(3553,W,0,0,v.x,v.y,Y,ye),ee.unbindTexture()},this.copyTextureToTexture=function(v,z,W,F=0){let Y=z.image.width,ye=z.image.height,Ae=ue.convert(W.format),Te=ue.convert(W.type);ce.setTexture2D(W,0),I.pixelStorei(37440,W.flipY),I.pixelStorei(37441,W.premultiplyAlpha),I.pixelStorei(3317,W.unpackAlignment),z.isDataTexture?I.texSubImage2D(3553,F,v.x,v.y,Y,ye,Ae,Te,z.image.data):z.isCompressedTexture?I.compressedTexSubImage2D(3553,F,v.x,v.y,z.mipmaps[0].width,z.mipmaps[0].height,Ae,z.mipmaps[0].data):I.texSubImage2D(3553,F,v.x,v.y,Ae,Te,z.image),F===0&&W.generateMipmaps&&I.generateMipmap(3553),ee.unbindTexture()},this.copyTextureToTexture3D=function(v,z,W,F,Y=0){if(f.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}let ye=v.max.x-v.min.x+1,Ae=v.max.y-v.min.y+1,Te=v.max.z-v.min.z+1,Ce=ue.convert(F.format),Ne=ue.convert(F.type),Re;if(F.isData3DTexture)ce.setTexture3D(F,0),Re=32879;else if(F.isDataArrayTexture)ce.setTexture2DArray(F,0),Re=35866;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}I.pixelStorei(37440,F.flipY),I.pixelStorei(37441,F.premultiplyAlpha),I.pixelStorei(3317,F.unpackAlignment);let Le=I.getParameter(3314),Xe=I.getParameter(32878),_t=I.getParameter(3316),Wt=I.getParameter(3315),pn=I.getParameter(32877),Ye=W.isCompressedTexture?W.mipmaps[0]:W.image;I.pixelStorei(3314,Ye.width),I.pixelStorei(32878,Ye.height),I.pixelStorei(3316,v.min.x),I.pixelStorei(3315,v.min.y),I.pixelStorei(32877,v.min.z),W.isDataTexture||W.isData3DTexture?I.texSubImage3D(Re,Y,z.x,z.y,z.z,ye,Ae,Te,Ce,Ne,Ye.data):W.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),I.compressedTexSubImage3D(Re,Y,z.x,z.y,z.z,ye,Ae,Te,Ce,Ye.data)):I.texSubImage3D(Re,Y,z.x,z.y,z.z,ye,Ae,Te,Ce,Ne,Ye),I.pixelStorei(3314,Le),I.pixelStorei(32878,Xe),I.pixelStorei(3316,_t),I.pixelStorei(3315,Wt),I.pixelStorei(32877,pn),Y===0&&F.generateMipmaps&&I.generateMipmap(Re),ee.unbindTexture()},this.initTexture=function(v){v.isCubeTexture?ce.setTextureCube(v,0):v.isData3DTexture?ce.setTexture3D(v,0):v.isDataArrayTexture||v.isCompressedArrayTexture?ce.setTexture2DArray(v,0):ce.setTexture2D(v,0),ee.unbindTexture()},this.resetState=function(){b=0,E=0,y=null,ee.reset(),$.reset()},typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}var _c=class extends lo{};_c.prototype.isWebGL1Renderer=!0;var co=class extends mt{constructor(){super();this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t}get autoUpdate(){return console.warn("THREE.Scene: autoUpdate was renamed to matrixWorldAutoUpdate in r144."),this.matrixWorldAutoUpdate}set autoUpdate(e){console.warn("THREE.Scene: autoUpdate was renamed to matrixWorldAutoUpdate in r144."),this.matrixWorldAutoUpdate=e}};function dn(s,e,t){return xc(s)?new s.constructor(s.subarray(e,t!==void 0?t:s.length)):s.slice(e,t)}function Ts(s,e,t){return!s||!t&&s.constructor===e?s:typeof e.BYTES_PER_ELEMENT=="number"?new e(s):Array.prototype.slice.call(s)}function xc(s){return ArrayBuffer.isView(s)&&!(s instanceof DataView)}var Bi=class{constructor(e,t,n,i){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=i!==void 0?i:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,i=t[n],r=t[n-1];n:{e:{let a;t:{i:if(!(e<i)){for(let o=n+2;;){if(i===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===o)break;if(r=i,i=t[++n],e<i)break e}a=t.length;break t}if(!(e>=r)){let o=t[1];e<o&&(n=2,r=o);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(i=r,r=t[--n-1],e>=r)break e}a=n,n=0;break t}break n}for(;n<a;){let o=n+a>>>1;e<t[o]?a=o:n=o+1}if(i=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,i)}return this.interpolate_(n,r,e,i)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,i=this.valueSize,r=e*i;for(let a=0;a!==i;++a)t[a]=n[r+a];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},yc=class extends Bi{constructor(e,t,n,i){super(e,t,n,i);this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:hl,endingEnd:hl}}intervalChanged_(e,t,n){let i=this.parameterPositions,r=e-2,a=e+1,o=i[r],l=i[a];if(o===void 0)switch(this.getSettings_().endingStart){case ul:r=e,o=2*t-n;break;case dl:r=i.length-2,o=t+i[r]-i[r+1];break;default:r=e,o=n}if(l===void 0)switch(this.getSettings_().endingEnd){case ul:a=e,l=2*n-t;break;case dl:a=1,l=n+i[1]-i[0];break;default:a=e-1,l=t}let c=(n-t)*.5,h=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(l-n),this._offsetPrev=r*h,this._offsetNext=a*h}interpolate_(e,t,n,i){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=this._offsetPrev,d=this._offsetNext,u=this._weightPrev,m=this._weightNext,_=(n-t)/(i-t),f=_*_,p=f*_,b=-u*p+2*u*f-u*_,E=(1+u)*p+(-1.5-2*u)*f+(-.5+u)*_+1,y=(-1-m)*p+(1.5+m)*f+.5*_,M=m*p-m*f;for(let T=0;T!==o;++T)r[T]=b*a[h+T]+E*a[c+T]+y*a[l+T]+M*a[d+T];return r}},vc=class extends Bi{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=(n-t)/(i-t),d=1-h;for(let u=0;u!==o;++u)r[u]=a[c+u]*d+a[l+u]*h;return r}},bc=class extends Bi{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e){return this.copySampleValue_(e-1)}},Ht=class{constructor(e,t,n,i){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=Ts(t,this.TimeBufferType),this.values=Ts(n,this.ValueBufferType),this.setInterpolation(i||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:Ts(e.times,Array),values:Ts(e.values,Array)};let i=e.getInterpolation();i!==e.DefaultInterpolation&&(n.interpolation=i)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new bc(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new vc(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new yc(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case es:t=this.InterpolantFactoryMethodDiscrete;break;case ts:t=this.InterpolantFactoryMethodLinear;break;case br:t=this.InterpolantFactoryMethodSmooth;break}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return es;case this.InterpolantFactoryMethodLinear:return ts;case this.InterpolantFactoryMethodSmooth:return br}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]*=e}return this}trim(e,t){let n=this.times,i=n.length,r=0,a=i-1;for(;r!==i&&n[r]<e;)++r;for(;a!==-1&&n[a]>t;)--a;if(++a,r!==0||a!==i){r>=a&&(a=Math.max(a,1),r=a-1);let o=this.getValueSize();this.times=dn(n,r,a),this.values=dn(this.values,r*o,a*o)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!=0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);let n=this.times,i=this.values,r=n.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let a=null;for(let o=0;o!==r;o++){let l=n[o];if(typeof l=="number"&&isNaN(l)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,o,l),e=!1;break}if(a!==null&&a>l){console.error("THREE.KeyframeTrack: Out of order keys.",this,o,l,a),e=!1;break}a=l}if(i!==void 0&&xc(i))for(let o=0,l=i.length;o!==l;++o){let c=i[o];if(isNaN(c)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,o,c),e=!1;break}}return e}optimize(){let e=dn(this.times),t=dn(this.values),n=this.getValueSize(),i=this.getInterpolation()===br,r=e.length-1,a=1;for(let o=1;o<r;++o){let l=!1,c=e[o],h=e[o+1];if(c!==h&&(o!==1||c!==e[0]))if(i)l=!0;else{let d=o*n,u=d-n,m=d+n;for(let _=0;_!==n;++_){let f=t[d+_];if(f!==t[u+_]||f!==t[m+_]){l=!0;break}}}if(l){if(o!==a){e[a]=e[o];let d=o*n,u=a*n;for(let m=0;m!==n;++m)t[u+m]=t[d+m]}++a}}if(r>0){e[a]=e[r];for(let o=r*n,l=a*n,c=0;c!==n;++c)t[l+c]=t[o+c];++a}return a!==e.length?(this.times=dn(e,0,a),this.values=dn(t,0,a*n)):(this.times=e,this.values=t),this}clone(){let e=dn(this.times,0),t=dn(this.values,0),n=this.constructor,i=new n(this.name,e,t);return i.createInterpolant=this.createInterpolant,i}};Ht.prototype.TimeBufferType=Float32Array;Ht.prototype.ValueBufferType=Float32Array;Ht.prototype.DefaultInterpolation=ts;var hi=class extends Ht{};hi.prototype.ValueTypeName="bool";hi.prototype.ValueBufferType=Array;hi.prototype.DefaultInterpolation=es;hi.prototype.InterpolantFactoryMethodLinear=void 0;hi.prototype.InterpolantFactoryMethodSmooth=void 0;var Mc=class extends Ht{};Mc.prototype.ValueTypeName="color";var wc=class extends Ht{};wc.prototype.ValueTypeName="number";var Sc=class extends Bi{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=(n-t)/(i-t),c=e*o;for(let h=c+o;c!==h;c+=4)Cn.slerpFlat(r,0,a,c-o,a,c,l);return r}},Cs=class extends Ht{InterpolantFactoryMethodLinear(e){return new Sc(this.times,this.values,this.getValueSize(),e)}};Cs.prototype.ValueTypeName="quaternion";Cs.prototype.DefaultInterpolation=ts;Cs.prototype.InterpolantFactoryMethodSmooth=void 0;var ui=class extends Ht{};ui.prototype.ValueTypeName="string";ui.prototype.ValueBufferType=Array;ui.prototype.DefaultInterpolation=es;ui.prototype.InterpolantFactoryMethodLinear=void 0;ui.prototype.InterpolantFactoryMethodSmooth=void 0;var Ac=class extends Ht{};Ac.prototype.ValueTypeName="vector";var ho="\\[\\]\\.:\\/",T_=new RegExp("["+ho+"]","g"),uo="[^"+ho+"]",C_="[^"+ho.replace("\\.","")+"]",R_=/((?:WC+[\/:])*)/.source.replace("WC",uo),L_=/(WCOD+)?/.source.replace("WCOD",C_),P_=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",uo),I_=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",uo),D_=new RegExp("^"+R_+L_+P_+I_+"$"),N_=["material","materials","bones","map"],Ec=class{constructor(e,t,n){let i=n||ze.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,i)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,i=this._bindings[n];i!==void 0&&i.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let i=this._targetGroup.nCachedObjects_,r=n.length;i!==r;++i)n[i].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},ze=class{constructor(e,t,n){this.path=t,this.parsedPath=n||ze.parseTrackName(t),this.node=ze.findNode(e,this.parsedPath.nodeName)||e,this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new ze.Composite(e,t,n):new ze(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(T_,"")}static parseTrackName(e){let t=D_.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},i=n.nodeName&&n.nodeName.lastIndexOf(".");if(i!==void 0&&i!==-1){let r=n.nodeName.substring(i+1);N_.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,i),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(r){for(let a=0;a<r.length;a++){let o=r[a];if(o.name===t||o.uuid===t)return o;let l=n(o.children);if(l)return l}return null},i=n(e.children);if(i)return i}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)e[t++]=n[i]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,n=t.objectName,i=t.propertyName,r=t.propertyIndex;if(e||(e=ze.findNode(this.rootNode,t.nodeName)||this.rootNode,this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){console.error("THREE.PropertyBinding: Trying to update node for track: "+this.path+" but it wasn't found.");return}if(n){let c=t.objectIndex;switch(n){case"materials":if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===c){c=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(c!==void 0){if(e[c]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}let a=e[i];if(a===void 0){let c=t.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+c+"."+i+" but it wasn't found.",e);return}let o=this.Versioning.None;this.targetObject=e,e.needsUpdate!==void 0?o=this.Versioning.NeedsUpdate:e.matrixWorldNeedsUpdate!==void 0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(i==="morphTargetInfluences"){if(!e.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=r}else a.fromArray!==void 0&&a.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(l=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=i;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};ze.Composite=Ec;ze.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};ze.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};ze.prototype.GetterByBindingType=[ze.prototype._getValue_direct,ze.prototype._getValue_array,ze.prototype._getValue_arrayElement,ze.prototype._getValue_toArray];ze.prototype.SetterByBindingTypeAndVersioning=[[ze.prototype._setValue_direct,ze.prototype._setValue_direct_setNeedsUpdate,ze.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[ze.prototype._setValue_array,ze.prototype._setValue_array_setNeedsUpdate,ze.prototype._setValue_array_setMatrixWorldNeedsUpdate],[ze.prototype._setValue_arrayElement,ze.prototype._setValue_arrayElement_setNeedsUpdate,ze.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[ze.prototype._setValue_fromArray,ze.prototype._setValue_fromArray_setNeedsUpdate,ze.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var dx=new Float32Array(1);typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:cr}}));typeof window!="undefined"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=cr);var O_=new vn("left",_i.ARROW_LEFT),F_=new vn("right",_i.ARROW_LEFT);async function Tc(){let s=Fn.create({id:"display",mode:"fit",debug:!0}),e=zn.create({for:"display"}),t=new Ys,n=new or,i=e.getContext("axisbutton");i.bindBinding(O_),i.bindBinding(F_);let r=new lo({canvas:s.canvas});r.setSize(s.width,s.height);let a=new gt(45,s.width/s.height,1,100);a.position.set(5,5,5),a.lookAt(0,0,0);let o=new co,l=new jt(1,1,1),c=new ei({color:65280}),h=new Ct(l,c);o.add(h),s.addEventListener("resize",()=>{r.setSize(s.width,s.height)}),requestAnimationFrame(new lr(d=>{i.poll(d.detail.currentTime);let u=d.detail.deltaTime/60;h.rotation.x+=.5*u,r.render(o,a)}).next)}var yx=new ji("Player",()=>({x:0,y:0,rotation:0})),B_=new jt(1,1,1),z_=new ei({color:65280}),U_=new ji("Box",()=>({mesh:new Ct(B_,z_)})),vx=new ar(U_);Tc();})();
/**
 * @license
 * Copyright 2010-2023 Three.js Authors
 * SPDX-License-Identifier: MIT
 */
//# sourceMappingURL=main.js.map
