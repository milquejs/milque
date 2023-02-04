(()=>{var dc=Object.create,Pi=Object.defineProperty,fc=Object.getPrototypeOf,pc=Object.prototype.hasOwnProperty,mc=Object.getOwnPropertyNames,gc=Object.getOwnPropertyDescriptor;var _c=s=>Pi(s,"__esModule",{value:!0});var xc=(s,e)=>()=>(s&&(e=s(s=0)),e),xn=(s,e)=>()=>(e||s((e={exports:{}}).exports,e),e.exports),so=(s,e)=>{for(var t in e)Pi(s,t,{get:e[t],enumerable:!0})},vc=(s,e,t)=>{if(e&&typeof e=="object"||typeof e=="function")for(let n of mc(e))!pc.call(s,n)&&n!=="default"&&Pi(s,n,{get:()=>e[n],enumerable:!(t=gc(e,n))||t.enumerable});return s},yc=s=>vc(_c(Pi(s!=null?dc(fc(s)):{},"default",s&&s.__esModule&&"default"in s?{get:()=>s.default,enumerable:!0}:{value:s,enumerable:!0})),s);var bo={};so(bo,{basename:()=>Co,default:()=>Qh,delimiter:()=>Eo,dirname:()=>To,extname:()=>Lo,isAbsolute:()=>Bs,join:()=>wo,normalize:()=>Us,relative:()=>So,resolve:()=>Di,sep:()=>Ao});function Mo(s,e){for(var t=0,n=s.length-1;n>=0;n--){var i=s[n];i==="."?s.splice(n,1):i===".."?(s.splice(n,1),t++):t&&(s.splice(n,1),t--)}if(e)for(;t--;t)s.unshift("..");return s}function Di(){for(var s="",e=!1,t=arguments.length-1;t>=-1&&!e;t--){var n=t>=0?arguments[t]:"/";if(typeof n!="string")throw new TypeError("Arguments to path.resolve must be strings");if(!n)continue;s=n+"/"+s,e=n.charAt(0)==="/"}return s=Mo(Fs(s.split("/"),function(i){return!!i}),!e).join("/"),(e?"/":"")+s||"."}function Us(s){var e=Bs(s),t=jh(s,-1)==="/";return s=Mo(Fs(s.split("/"),function(n){return!!n}),!e).join("/"),!s&&!e&&(s="."),s&&t&&(s+="/"),(e?"/":"")+s}function Bs(s){return s.charAt(0)==="/"}function wo(){var s=Array.prototype.slice.call(arguments,0);return Us(Fs(s,function(e,t){if(typeof e!="string")throw new TypeError("Arguments to path.join must be strings");return e}).join("/"))}function So(s,e){s=Di(s).substr(1),e=Di(e).substr(1);function t(c){for(var h=0;h<c.length&&c[h]==="";h++);for(var u=c.length-1;u>=0&&c[u]==="";u--);return h>u?[]:c.slice(h,u-h+1)}for(var n=t(s.split("/")),i=t(e.split("/")),r=Math.min(n.length,i.length),a=r,o=0;o<r;o++)if(n[o]!==i[o]){a=o;break}for(var l=[],o=a;o<n.length;o++)l.push("..");return l=l.concat(i.slice(a)),l.join("/")}function To(s){var e=Ns(s),t=e[0],n=e[1];return!t&&!n?".":(n&&(n=n.substr(0,n.length-1)),t+n)}function Co(s,e){var t=Ns(s)[2];return e&&t.substr(-1*e.length)===e&&(t=t.substr(0,t.length-e.length)),t}function Lo(s){return Ns(s)[3]}function Fs(s,e){if(s.filter)return s.filter(e);for(var t=[],n=0;n<s.length;n++)e(s[n],n,s)&&t.push(s[n]);return t}var Jh,Ns,Ao,Eo,Qh,jh,Ro=xc(()=>{Jh=/^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/,Ns=function(s){return Jh.exec(s).slice(1)};Ao="/",Eo=":";Qh={extname:Lo,basename:Co,dirname:To,sep:Ao,delimiter:Eo,relative:So,join:wo,isAbsolute:Bs,normalize:Us,resolve:Di};jh="ab".substr(-1)==="b"?function(s,e,t){return s.substr(e,t)}:function(s,e,t){return e<0&&(e=s.length+e),s.substr(e,t)}});var Ni=xn((P0,Oi)=>{var Qt=(Ro(),bo);Qt&&Qt.default?Oi.exports=Qt.default:Qt&&(Oi.exports=Qt);if(Qt)for(let s in Qt)Oi.exports[s]=Qt[s]});var xi=xn((I0,Po)=>{"use strict";var eu=Ni(),Ot="\\\\/",Io=`[^${Ot}]`,Gt="\\.",tu="\\+",nu="\\?",Fi="\\/",iu="(?=.)",Do="[^/]",zs=`(?:${Fi}|$)`,Oo=`(?:^|${Fi})`,ks=`${Gt}{1,2}${zs}`,su=`(?!${Gt})`,ru=`(?!${Oo}${ks})`,ou=`(?!${Gt}{0,1}${zs})`,au=`(?!${ks})`,lu=`[^.${Fi}]`,cu=`${Do}*?`,No={DOT_LITERAL:Gt,PLUS_LITERAL:tu,QMARK_LITERAL:nu,SLASH_LITERAL:Fi,ONE_CHAR:iu,QMARK:Do,END_ANCHOR:zs,DOTS_SLASH:ks,NO_DOT:su,NO_DOTS:ru,NO_DOT_SLASH:ou,NO_DOTS_SLASH:au,QMARK_NO_DOT:lu,STAR:cu,START_ANCHOR:Oo},hu={...No,SLASH_LITERAL:`[${Ot}]`,QMARK:Io,STAR:`${Io}*?`,DOTS_SLASH:`${Gt}{1,2}(?:[${Ot}]|$)`,NO_DOT:`(?!${Gt})`,NO_DOTS:`(?!(?:^|[${Ot}])${Gt}{1,2}(?:[${Ot}]|$))`,NO_DOT_SLASH:`(?!${Gt}{0,1}(?:[${Ot}]|$))`,NO_DOTS_SLASH:`(?!${Gt}{1,2}(?:[${Ot}]|$))`,QMARK_NO_DOT:`[^.${Ot}]`,START_ANCHOR:`(?:^|[${Ot}])`,END_ANCHOR:`(?:[${Ot}]|$)`},uu={alnum:"a-zA-Z0-9",alpha:"a-zA-Z",ascii:"\\x00-\\x7F",blank:" \\t",cntrl:"\\x00-\\x1F\\x7F",digit:"0-9",graph:"\\x21-\\x7E",lower:"a-z",print:"\\x20-\\x7E ",punct:"\\-!\"#$%&'()\\*+,./:;<=>?@[\\]^_`{|}~",space:" \\t\\r\\n\\v\\f",upper:"A-Z",word:"A-Za-z0-9_",xdigit:"A-Fa-f0-9"};Po.exports={MAX_LENGTH:1024*64,POSIX_REGEX_SOURCE:uu,REGEX_BACKSLASH:/\\(?![*+?^${}(|)[\]])/g,REGEX_NON_SPECIAL_CHARS:/^[^@![\].,$*+?^{}()|\\/]+/,REGEX_SPECIAL_CHARS:/[-*+?.^${}(|)[\]]/,REGEX_SPECIAL_CHARS_BACKREF:/(\\?)((\W)(\3*))/g,REGEX_SPECIAL_CHARS_GLOBAL:/([-*+?.^${}(|)[\]])/g,REGEX_REMOVE_BACKSLASH:/(?:\[.*?[^\\]\]|\\(?=.))/g,REPLACEMENTS:{"***":"*","**/**":"**","**/**/**":"**"},CHAR_0:48,CHAR_9:57,CHAR_UPPERCASE_A:65,CHAR_LOWERCASE_A:97,CHAR_UPPERCASE_Z:90,CHAR_LOWERCASE_Z:122,CHAR_LEFT_PARENTHESES:40,CHAR_RIGHT_PARENTHESES:41,CHAR_ASTERISK:42,CHAR_AMPERSAND:38,CHAR_AT:64,CHAR_BACKWARD_SLASH:92,CHAR_CARRIAGE_RETURN:13,CHAR_CIRCUMFLEX_ACCENT:94,CHAR_COLON:58,CHAR_COMMA:44,CHAR_DOT:46,CHAR_DOUBLE_QUOTE:34,CHAR_EQUAL:61,CHAR_EXCLAMATION_MARK:33,CHAR_FORM_FEED:12,CHAR_FORWARD_SLASH:47,CHAR_GRAVE_ACCENT:96,CHAR_HASH:35,CHAR_HYPHEN_MINUS:45,CHAR_LEFT_ANGLE_BRACKET:60,CHAR_LEFT_CURLY_BRACE:123,CHAR_LEFT_SQUARE_BRACKET:91,CHAR_LINE_FEED:10,CHAR_NO_BREAK_SPACE:160,CHAR_PERCENT:37,CHAR_PLUS:43,CHAR_QUESTION_MARK:63,CHAR_RIGHT_ANGLE_BRACKET:62,CHAR_RIGHT_CURLY_BRACE:125,CHAR_RIGHT_SQUARE_BRACKET:93,CHAR_SEMICOLON:59,CHAR_SINGLE_QUOTE:39,CHAR_SPACE:32,CHAR_TAB:9,CHAR_UNDERSCORE:95,CHAR_VERTICAL_LINE:124,CHAR_ZERO_WIDTH_NOBREAK_SPACE:65279,SEP:eu.sep,extglobChars(s){return{"!":{type:"negate",open:"(?:(?!(?:",close:`))${s.STAR})`},"?":{type:"qmark",open:"(?:",close:")?"},"+":{type:"plus",open:"(?:",close:")+"},"*":{type:"star",open:"(?:",close:")*"},"@":{type:"at",open:"(?:",close:")"}}},globChars(s){return s===!0?hu:No}}});var Bi=xn(lt=>{"use strict";var du=Ni(),fu=!1,{REGEX_BACKSLASH:pu,REGEX_REMOVE_BACKSLASH:mu,REGEX_SPECIAL_CHARS:gu,REGEX_SPECIAL_CHARS_GLOBAL:_u}=xi();lt.isObject=s=>s!==null&&typeof s=="object"&&!Array.isArray(s);lt.hasRegexChars=s=>gu.test(s);lt.isRegexChar=s=>s.length===1&&lt.hasRegexChars(s);lt.escapeRegex=s=>s.replace(_u,"\\$1");lt.toPosixSlashes=s=>s.replace(pu,"/");lt.removeBackslashes=s=>s.replace(mu,e=>e==="\\"?"":e);lt.supportsLookbehinds=()=>{let s=process.version.slice(1).split(".").map(Number);return s.length===3&&s[0]>=9||s[0]===8&&s[1]>=10};lt.isWindows=s=>s&&typeof s.windows=="boolean"?s.windows:fu===!0||du.sep==="\\";lt.escapeLast=(s,e,t)=>{let n=s.lastIndexOf(e,t);return n===-1?s:s[n-1]==="\\"?lt.escapeLast(s,e,n-1):`${s.slice(0,n)}\\${s.slice(n)}`};lt.removePrefix=(s,e={})=>{let t=s;return t.startsWith("./")&&(t=t.slice(2),e.prefix="./"),t};lt.wrapOutput=(s,e={},t={})=>{let n=t.contains?"":"^",i=t.contains?"":"$",r=`${n}(?:${s})${i}`;return e.negated===!0&&(r=`(?:^(?!${r}).*$)`),r}});var Go=xn((O0,Fo)=>{"use strict";var Bo=Bi(),{CHAR_ASTERISK:Hs,CHAR_AT:xu,CHAR_BACKWARD_SLASH:vi,CHAR_COMMA:vu,CHAR_DOT:Vs,CHAR_EXCLAMATION_MARK:Gs,CHAR_FORWARD_SLASH:Uo,CHAR_LEFT_CURLY_BRACE:Ws,CHAR_LEFT_PARENTHESES:qs,CHAR_LEFT_SQUARE_BRACKET:yu,CHAR_PLUS:bu,CHAR_QUESTION_MARK:zo,CHAR_RIGHT_CURLY_BRACE:Mu,CHAR_RIGHT_PARENTHESES:ko,CHAR_RIGHT_SQUARE_BRACKET:wu}=xi(),Ho=s=>s===Uo||s===vi,Vo=s=>{s.isPrefix!==!0&&(s.depth=s.isGlobstar?Infinity:1)},Su=(s,e)=>{let t=e||{},n=s.length-1,i=t.parts===!0||t.scanToEnd===!0,r=[],a=[],o=[],l=s,c=-1,h=0,u=0,d=!1,m=!1,g=!1,p=!1,f=!1,x=!1,M=!1,E=!1,b=!1,A=!1,R=0,N,_,S={value:"",depth:0,isGlob:!1},I=()=>c>=n,L=()=>l.charCodeAt(c+1),J=()=>(N=_,l.charCodeAt(++c));for(;c<n;){_=J();let Z;if(_===vi){M=S.backslashes=!0,_=J(),_===Ws&&(x=!0);continue}if(x===!0||_===Ws){for(R++;I()!==!0&&(_=J());){if(_===vi){M=S.backslashes=!0,J();continue}if(_===Ws){R++;continue}if(x!==!0&&_===Vs&&(_=J())===Vs){if(d=S.isBrace=!0,g=S.isGlob=!0,A=!0,i===!0)continue;break}if(x!==!0&&_===vu){if(d=S.isBrace=!0,g=S.isGlob=!0,A=!0,i===!0)continue;break}if(_===Mu&&(R--,R===0)){x=!1,d=S.isBrace=!0,A=!0;break}}if(i===!0)continue;break}if(_===Uo){if(r.push(c),a.push(S),S={value:"",depth:0,isGlob:!1},A===!0)continue;if(N===Vs&&c===h+1){h+=2;continue}u=c+1;continue}if(t.noext!==!0&&(_===bu||_===xu||_===Hs||_===zo||_===Gs)===!0&&L()===qs){if(g=S.isGlob=!0,p=S.isExtglob=!0,A=!0,_===Gs&&c===h&&(b=!0),i===!0){for(;I()!==!0&&(_=J());){if(_===vi){M=S.backslashes=!0,_=J();continue}if(_===ko){g=S.isGlob=!0,A=!0;break}}continue}break}if(_===Hs){if(N===Hs&&(f=S.isGlobstar=!0),g=S.isGlob=!0,A=!0,i===!0)continue;break}if(_===zo){if(g=S.isGlob=!0,A=!0,i===!0)continue;break}if(_===yu){for(;I()!==!0&&(Z=J());){if(Z===vi){M=S.backslashes=!0,J();continue}if(Z===wu){m=S.isBracket=!0,g=S.isGlob=!0,A=!0;break}}if(i===!0)continue;break}if(t.nonegate!==!0&&_===Gs&&c===h){E=S.negated=!0,h++;continue}if(t.noparen!==!0&&_===qs){if(g=S.isGlob=!0,i===!0){for(;I()!==!0&&(_=J());){if(_===qs){M=S.backslashes=!0,_=J();continue}if(_===ko){A=!0;break}}continue}break}if(g===!0){if(A=!0,i===!0)continue;break}}t.noext===!0&&(p=!1,g=!1);let V=l,F="",T="";h>0&&(F=l.slice(0,h),l=l.slice(h),u-=h),V&&g===!0&&u>0?(V=l.slice(0,u),T=l.slice(u)):g===!0?(V="",T=l):V=l,V&&V!==""&&V!=="/"&&V!==l&&Ho(V.charCodeAt(V.length-1))&&(V=V.slice(0,-1)),t.unescape===!0&&(T&&(T=Bo.removeBackslashes(T)),V&&M===!0&&(V=Bo.removeBackslashes(V)));let C={prefix:F,input:s,start:h,base:V,glob:T,isBrace:d,isBracket:m,isGlob:g,isExtglob:p,isGlobstar:f,negated:E,negatedExtglob:b};if(t.tokens===!0&&(C.maxDepth=0,Ho(_)||a.push(S),C.tokens=a),t.parts===!0||t.tokens===!0){let Z;for(let H=0;H<r.length;H++){let D=Z?Z+1:h,B=r[H],Q=s.slice(D,B);t.tokens&&(H===0&&h!==0?(a[H].isPrefix=!0,a[H].value=F):a[H].value=Q,Vo(a[H]),C.maxDepth+=a[H].depth),(H!==0||Q!=="")&&o.push(Q),Z=B}if(Z&&Z+1<s.length){let H=s.slice(Z+1);o.push(H),t.tokens&&(a[a.length-1].value=H,Vo(a[a.length-1]),C.maxDepth+=a[a.length-1].depth)}C.slashes=r,C.parts=o}return C};Fo.exports=Su});var Yo=xn((N0,Wo)=>{"use strict";var Ui=xi(),dt=Bi(),{MAX_LENGTH:zi,POSIX_REGEX_SOURCE:Au,REGEX_NON_SPECIAL_CHARS:Eu,REGEX_SPECIAL_CHARS_BACKREF:Tu,REPLACEMENTS:qo}=Ui,Cu=(s,e)=>{if(typeof e.expandRange=="function")return e.expandRange(...s,e);s.sort();let t=`[${s.join("-")}]`;try{new RegExp(t)}catch(n){return s.map(i=>dt.escapeRegex(i)).join("..")}return t},kn=(s,e)=>`Missing ${s}: "${e}" - use "\\\\${e}" to match literal characters`,Xo=(s,e)=>{if(typeof s!="string")throw new TypeError("Expected a string");s=qo[s]||s;let t={...e},n=typeof t.maxLength=="number"?Math.min(zi,t.maxLength):zi,i=s.length;if(i>n)throw new SyntaxError(`Input length: ${i}, exceeds maximum allowed length: ${n}`);let r={type:"bos",value:"",output:t.prepend||""},a=[r],o=t.capture?"":"?:",l=dt.isWindows(e),c=Ui.globChars(l),h=Ui.extglobChars(c),{DOT_LITERAL:u,PLUS_LITERAL:d,SLASH_LITERAL:m,ONE_CHAR:g,DOTS_SLASH:p,NO_DOT:f,NO_DOT_SLASH:x,NO_DOTS_SLASH:M,QMARK:E,QMARK_NO_DOT:b,STAR:A,START_ANCHOR:R}=c,N=$=>`(${o}(?:(?!${R}${$.dot?p:u}).)*?)`,_=t.dot?"":f,S=t.dot?E:b,I=t.bash===!0?N(t):A;t.capture&&(I=`(${I})`),typeof t.noext=="boolean"&&(t.noextglob=t.noext);let L={input:s,index:-1,start:0,dot:t.dot===!0,consumed:"",output:"",prefix:"",backtrack:!1,negated:!1,brackets:0,braces:0,parens:0,quotes:0,globstar:!1,tokens:a};s=dt.removePrefix(s,L),i=s.length;let J=[],V=[],F=[],T=r,C,Z=()=>L.index===i-1,H=L.peek=($=1)=>s[L.index+$],D=L.advance=()=>s[++L.index]||"",B=()=>s.slice(L.index+1),Q=($="",ee=0)=>{L.consumed+=$,L.index+=ee},j=$=>{L.output+=$.output!=null?$.output:$.value,Q($.value)},se=()=>{let $=1;for(;H()==="!"&&(H(2)!=="("||H(3)==="?");)D(),L.start++,$++;return $%2==0?!1:(L.negated=!0,L.start++,!0)},de=$=>{L[$]++,F.push($)},ve=$=>{L[$]--,F.pop()},k=$=>{if(T.type==="globstar"){let ee=L.braces>0&&($.type==="comma"||$.type==="brace"),K=$.extglob===!0||J.length&&($.type==="pipe"||$.type==="paren");$.type!=="slash"&&$.type!=="paren"&&!ee&&!K&&(L.output=L.output.slice(0,-T.output.length),T.type="star",T.value="*",T.output=I,L.output+=T.output)}if(J.length&&$.type!=="paren"&&(J[J.length-1].inner+=$.value),($.value||$.output)&&j($),T&&T.type==="text"&&$.type==="text"){T.value+=$.value,T.output=(T.output||"")+$.value;return}$.prev=T,a.push($),T=$},Te=($,ee)=>{let K={...h[ee],conditions:1,inner:""};K.prev=T,K.parens=L.parens,K.output=L.output;let re=(t.capture?"(":"")+K.open;de("parens"),k({type:$,value:ee,output:L.output?"":g}),k({type:"paren",extglob:!0,value:D(),output:re}),J.push(K)},ye=$=>{let ee=$.close+(t.capture?")":""),K;if($.type==="negate"){let re=I;$.inner&&$.inner.length>1&&$.inner.includes("/")&&(re=N(t)),(re!==I||Z()||/^\)+$/.test(B()))&&(ee=$.close=`)$))${re}`),$.inner.includes("*")&&(K=B())&&/^\.[^\\/.]+$/.test(K)&&(ee=$.close=`)${K})${re})`),$.prev.type==="bos"&&(L.negatedExtglob=!0)}k({type:"paren",extglob:!0,value:C,output:ee}),ve("parens")};if(t.fastpaths!==!1&&!/(^[*!]|[/()[\]{}"])/.test(s)){let $=!1,ee=s.replace(Tu,(K,re,ae,Ce,Le,Ke)=>Ce==="\\"?($=!0,K):Ce==="?"?re?re+Ce+(Le?E.repeat(Le.length):""):Ke===0?S+(Le?E.repeat(Le.length):""):E.repeat(ae.length):Ce==="."?u.repeat(ae.length):Ce==="*"?re?re+Ce+(Le?I:""):I:re?K:`\\${K}`);return $===!0&&(t.unescape===!0?ee=ee.replace(/\\/g,""):ee=ee.replace(/\\+/g,K=>K.length%2==0?"\\\\":K?"\\":"")),ee===s&&t.contains===!0?(L.output=s,L):(L.output=dt.wrapOutput(ee,L,e),L)}for(;!Z();){if(C=D(),C==="\0")continue;if(C==="\\"){let K=H();if(K==="/"&&t.bash!==!0||K==="."||K===";")continue;if(!K){C+="\\",k({type:"text",value:C});continue}let re=/^\\+/.exec(B()),ae=0;if(re&&re[0].length>2&&(ae=re[0].length,L.index+=ae,ae%2!=0&&(C+="\\")),t.unescape===!0?C=D():C+=D(),L.brackets===0){k({type:"text",value:C});continue}}if(L.brackets>0&&(C!=="]"||T.value==="["||T.value==="[^")){if(t.posix!==!1&&C===":"){let K=T.value.slice(1);if(K.includes("[")&&(T.posix=!0,K.includes(":"))){let re=T.value.lastIndexOf("["),ae=T.value.slice(0,re),Ce=T.value.slice(re+2),Le=Au[Ce];if(Le){T.value=ae+Le,L.backtrack=!0,D(),!r.output&&a.indexOf(T)===1&&(r.output=g);continue}}}(C==="["&&H()!==":"||C==="-"&&H()==="]")&&(C=`\\${C}`),C==="]"&&(T.value==="["||T.value==="[^")&&(C=`\\${C}`),t.posix===!0&&C==="!"&&T.value==="["&&(C="^"),T.value+=C,j({value:C});continue}if(L.quotes===1&&C!=='"'){C=dt.escapeRegex(C),T.value+=C,j({value:C});continue}if(C==='"'){L.quotes=L.quotes===1?0:1,t.keepQuotes===!0&&k({type:"text",value:C});continue}if(C==="("){de("parens"),k({type:"paren",value:C});continue}if(C===")"){if(L.parens===0&&t.strictBrackets===!0)throw new SyntaxError(kn("opening","("));let K=J[J.length-1];if(K&&L.parens===K.parens+1){ye(J.pop());continue}k({type:"paren",value:C,output:L.parens?")":"\\)"}),ve("parens");continue}if(C==="["){if(t.nobracket===!0||!B().includes("]")){if(t.nobracket!==!0&&t.strictBrackets===!0)throw new SyntaxError(kn("closing","]"));C=`\\${C}`}else de("brackets");k({type:"bracket",value:C});continue}if(C==="]"){if(t.nobracket===!0||T&&T.type==="bracket"&&T.value.length===1){k({type:"text",value:C,output:`\\${C}`});continue}if(L.brackets===0){if(t.strictBrackets===!0)throw new SyntaxError(kn("opening","["));k({type:"text",value:C,output:`\\${C}`});continue}ve("brackets");let K=T.value.slice(1);if(T.posix!==!0&&K[0]==="^"&&!K.includes("/")&&(C=`/${C}`),T.value+=C,j({value:C}),t.literalBrackets===!1||dt.hasRegexChars(K))continue;let re=dt.escapeRegex(T.value);if(L.output=L.output.slice(0,-T.value.length),t.literalBrackets===!0){L.output+=re,T.value=re;continue}T.value=`(${o}${re}|${T.value})`,L.output+=T.value;continue}if(C==="{"&&t.nobrace!==!0){de("braces");let K={type:"brace",value:C,output:"(",outputIndex:L.output.length,tokensIndex:L.tokens.length};V.push(K),k(K);continue}if(C==="}"){let K=V[V.length-1];if(t.nobrace===!0||!K){k({type:"text",value:C,output:C});continue}let re=")";if(K.dots===!0){let ae=a.slice(),Ce=[];for(let Le=ae.length-1;Le>=0&&(a.pop(),ae[Le].type!=="brace");Le--)ae[Le].type!=="dots"&&Ce.unshift(ae[Le].value);re=Cu(Ce,t),L.backtrack=!0}if(K.comma!==!0&&K.dots!==!0){let ae=L.output.slice(0,K.outputIndex),Ce=L.tokens.slice(K.tokensIndex);K.value=K.output="\\{",C=re="\\}",L.output=ae;for(let Le of Ce)L.output+=Le.output||Le.value}k({type:"brace",value:C,output:re}),ve("braces"),V.pop();continue}if(C==="|"){J.length>0&&J[J.length-1].conditions++,k({type:"text",value:C});continue}if(C===","){let K=C,re=V[V.length-1];re&&F[F.length-1]==="braces"&&(re.comma=!0,K="|"),k({type:"comma",value:C,output:K});continue}if(C==="/"){if(T.type==="dot"&&L.index===L.start+1){L.start=L.index+1,L.consumed="",L.output="",a.pop(),T=r;continue}k({type:"slash",value:C,output:m});continue}if(C==="."){if(L.braces>0&&T.type==="dot"){T.value==="."&&(T.output=u);let K=V[V.length-1];T.type="dots",T.output+=C,T.value+=C,K.dots=!0;continue}if(L.braces+L.parens===0&&T.type!=="bos"&&T.type!=="slash"){k({type:"text",value:C,output:u});continue}k({type:"dot",value:C,output:u});continue}if(C==="?"){if(!(T&&T.value==="(")&&t.noextglob!==!0&&H()==="("&&H(2)!=="?"){Te("qmark",C);continue}if(T&&T.type==="paren"){let re=H(),ae=C;if(re==="<"&&!dt.supportsLookbehinds())throw new Error("Node.js v10 or higher is required for regex lookbehinds");(T.value==="("&&!/[!=<:]/.test(re)||re==="<"&&!/<([!=]|\w+>)/.test(B()))&&(ae=`\\${C}`),k({type:"text",value:C,output:ae});continue}if(t.dot!==!0&&(T.type==="slash"||T.type==="bos")){k({type:"qmark",value:C,output:b});continue}k({type:"qmark",value:C,output:E});continue}if(C==="!"){if(t.noextglob!==!0&&H()==="("&&(H(2)!=="?"||!/[!=<:]/.test(H(3)))){Te("negate",C);continue}if(t.nonegate!==!0&&L.index===0){se();continue}}if(C==="+"){if(t.noextglob!==!0&&H()==="("&&H(2)!=="?"){Te("plus",C);continue}if(T&&T.value==="("||t.regex===!1){k({type:"plus",value:C,output:d});continue}if(T&&(T.type==="bracket"||T.type==="paren"||T.type==="brace")||L.parens>0){k({type:"plus",value:C});continue}k({type:"plus",value:d});continue}if(C==="@"){if(t.noextglob!==!0&&H()==="("&&H(2)!=="?"){k({type:"at",extglob:!0,value:C,output:""});continue}k({type:"text",value:C});continue}if(C!=="*"){(C==="$"||C==="^")&&(C=`\\${C}`);let K=Eu.exec(B());K&&(C+=K[0],L.index+=K[0].length),k({type:"text",value:C});continue}if(T&&(T.type==="globstar"||T.star===!0)){T.type="star",T.star=!0,T.value+=C,T.output=I,L.backtrack=!0,L.globstar=!0,Q(C);continue}let $=B();if(t.noextglob!==!0&&/^\([^?]/.test($)){Te("star",C);continue}if(T.type==="star"){if(t.noglobstar===!0){Q(C);continue}let K=T.prev,re=K.prev,ae=K.type==="slash"||K.type==="bos",Ce=re&&(re.type==="star"||re.type==="globstar");if(t.bash===!0&&(!ae||$[0]&&$[0]!=="/")){k({type:"star",value:C,output:""});continue}let Le=L.braces>0&&(K.type==="comma"||K.type==="brace"),Ke=J.length&&(K.type==="pipe"||K.type==="paren");if(!ae&&K.type!=="paren"&&!Le&&!Ke){k({type:"star",value:C,output:""});continue}for(;$.slice(0,3)==="/**";){let st=s[L.index+4];if(st&&st!=="/")break;$=$.slice(3),Q("/**",3)}if(K.type==="bos"&&Z()){T.type="globstar",T.value+=C,T.output=N(t),L.output=T.output,L.globstar=!0,Q(C);continue}if(K.type==="slash"&&K.prev.type!=="bos"&&!Ce&&Z()){L.output=L.output.slice(0,-(K.output+T.output).length),K.output=`(?:${K.output}`,T.type="globstar",T.output=N(t)+(t.strictSlashes?")":"|$)"),T.value+=C,L.globstar=!0,L.output+=K.output+T.output,Q(C);continue}if(K.type==="slash"&&K.prev.type!=="bos"&&$[0]==="/"){let st=$[1]!==void 0?"|$":"";L.output=L.output.slice(0,-(K.output+T.output).length),K.output=`(?:${K.output}`,T.type="globstar",T.output=`${N(t)}${m}|${m}${st})`,T.value+=C,L.output+=K.output+T.output,L.globstar=!0,Q(C+D()),k({type:"slash",value:"/",output:""});continue}if(K.type==="bos"&&$[0]==="/"){T.type="globstar",T.value+=C,T.output=`(?:^|${m}|${N(t)}${m})`,L.output=T.output,L.globstar=!0,Q(C+D()),k({type:"slash",value:"/",output:""});continue}L.output=L.output.slice(0,-T.output.length),T.type="globstar",T.output=N(t),T.value+=C,L.output+=T.output,L.globstar=!0,Q(C);continue}let ee={type:"star",value:C,output:I};if(t.bash===!0){ee.output=".*?",(T.type==="bos"||T.type==="slash")&&(ee.output=_+ee.output),k(ee);continue}if(T&&(T.type==="bracket"||T.type==="paren")&&t.regex===!0){ee.output=C,k(ee);continue}(L.index===L.start||T.type==="slash"||T.type==="dot")&&(T.type==="dot"?(L.output+=x,T.output+=x):t.dot===!0?(L.output+=M,T.output+=M):(L.output+=_,T.output+=_),H()!=="*"&&(L.output+=g,T.output+=g)),k(ee)}for(;L.brackets>0;){if(t.strictBrackets===!0)throw new SyntaxError(kn("closing","]"));L.output=dt.escapeLast(L.output,"["),ve("brackets")}for(;L.parens>0;){if(t.strictBrackets===!0)throw new SyntaxError(kn("closing",")"));L.output=dt.escapeLast(L.output,"("),ve("parens")}for(;L.braces>0;){if(t.strictBrackets===!0)throw new SyntaxError(kn("closing","}"));L.output=dt.escapeLast(L.output,"{"),ve("braces")}if(t.strictSlashes!==!0&&(T.type==="star"||T.type==="bracket")&&k({type:"maybe_slash",value:"",output:`${m}?`}),L.backtrack===!0){L.output="";for(let $ of L.tokens)L.output+=$.output!=null?$.output:$.value,$.suffix&&(L.output+=$.suffix)}return L};Xo.fastpaths=(s,e)=>{let t={...e},n=typeof t.maxLength=="number"?Math.min(zi,t.maxLength):zi,i=s.length;if(i>n)throw new SyntaxError(`Input length: ${i}, exceeds maximum allowed length: ${n}`);s=qo[s]||s;let r=dt.isWindows(e),{DOT_LITERAL:a,SLASH_LITERAL:o,ONE_CHAR:l,DOTS_SLASH:c,NO_DOT:h,NO_DOTS:u,NO_DOTS_SLASH:d,STAR:m,START_ANCHOR:g}=Ui.globChars(r),p=t.dot?u:h,f=t.dot?d:h,x=t.capture?"":"?:",M={negated:!1,prefix:""},E=t.bash===!0?".*?":m;t.capture&&(E=`(${E})`);let b=_=>_.noglobstar===!0?E:`(${x}(?:(?!${g}${_.dot?c:a}).)*?)`,A=_=>{switch(_){case"*":return`${p}${l}${E}`;case".*":return`${a}${l}${E}`;case"*.*":return`${p}${E}${a}${l}${E}`;case"*/*":return`${p}${E}${o}${l}${f}${E}`;case"**":return p+b(t);case"**/*":return`(?:${p}${b(t)}${o})?${f}${l}${E}`;case"**/*.*":return`(?:${p}${b(t)}${o})?${f}${E}${a}${l}${E}`;case"**/.*":return`(?:${p}${b(t)}${o})?${a}${l}${E}`;default:{let S=/^(.*?)\.(\w+)$/.exec(_);if(!S)return;let I=A(S[1]);return I?I+a+S[2]:void 0}}},R=dt.removePrefix(s,M),N=A(R);return N&&t.strictSlashes!==!0&&(N+=`${o}?`),N};Wo.exports=Xo});var Ko=xn((F0,$o)=>{"use strict";var Lu=Ni(),Ru=Go(),Xs=Yo(),Ys=Bi(),Pu=xi(),Iu=s=>s&&typeof s=="object"&&!Array.isArray(s),qe=(s,e,t=!1)=>{if(Array.isArray(s)){let h=s.map(d=>qe(d,e,t));return d=>{for(let m of h){let g=m(d);if(g)return g}return!1}}let n=Iu(s)&&s.tokens&&s.input;if(s===""||typeof s!="string"&&!n)throw new TypeError("Expected pattern to be a non-empty string");let i=e||{},r=Ys.isWindows(e),a=n?qe.compileRe(s,e):qe.makeRe(s,e,!1,!0),o=a.state;delete a.state;let l=()=>!1;if(i.ignore){let h={...e,ignore:null,onMatch:null,onResult:null};l=qe(i.ignore,h,t)}let c=(h,u=!1)=>{let{isMatch:d,match:m,output:g}=qe.test(h,a,e,{glob:s,posix:r}),p={glob:s,state:o,regex:a,posix:r,input:h,output:g,match:m,isMatch:d};return typeof i.onResult=="function"&&i.onResult(p),d===!1?(p.isMatch=!1,u?p:!1):l(h)?(typeof i.onIgnore=="function"&&i.onIgnore(p),p.isMatch=!1,u?p:!1):(typeof i.onMatch=="function"&&i.onMatch(p),u?p:!0)};return t&&(c.state=o),c};qe.test=(s,e,t,{glob:n,posix:i}={})=>{if(typeof s!="string")throw new TypeError("Expected input to be a string");if(s==="")return{isMatch:!1,output:""};let r=t||{},a=r.format||(i?Ys.toPosixSlashes:null),o=s===n,l=o&&a?a(s):s;return o===!1&&(l=a?a(s):s,o=l===n),(o===!1||r.capture===!0)&&(r.matchBase===!0||r.basename===!0?o=qe.matchBase(s,e,t,i):o=e.exec(l)),{isMatch:Boolean(o),match:o,output:l}};qe.matchBase=(s,e,t,n=Ys.isWindows(t))=>(e instanceof RegExp?e:qe.makeRe(e,t)).test(Lu.basename(s));qe.isMatch=(s,e,t)=>qe(e,t)(s);qe.parse=(s,e)=>Array.isArray(s)?s.map(t=>qe.parse(t,e)):Xs(s,{...e,fastpaths:!1});qe.scan=(s,e)=>Ru(s,e);qe.compileRe=(s,e,t=!1,n=!1)=>{if(t===!0)return s.output;let i=e||{},r=i.contains?"":"^",a=i.contains?"":"$",o=`${r}(?:${s.output})${a}`;s&&s.negated===!0&&(o=`^(?!${o}).*$`);let l=qe.toRegex(o,e);return n===!0&&(l.state=s),l};qe.makeRe=(s,e={},t=!1,n=!1)=>{if(!s||typeof s!="string")throw new TypeError("Expected a non-empty string");let i={negated:!1,fastpaths:!0};return e.fastpaths!==!1&&(s[0]==="."||s[0]==="*")&&(i.output=Xs.fastpaths(s,e)),i.output||(i=Xs(s,e)),qe.compileRe(i,e,t,n)};qe.toRegex=(s,e)=>{try{let t=e||{};return new RegExp(s,t.flags||(t.nocase?"i":""))}catch(t){if(e&&e.debug===!0)throw t;return/$^/}};qe.constants=Pu;$o.exports=qe});var Jo=xn((B0,Zo)=>{"use strict";Zo.exports=Ko()});var bc=`<div class="container">
  <label class="hidden" id="title">display-port</label>
  <label class="hidden" id="fps">00</label>
  <label class="hidden" id="dimension">0x0</label>
  <div class="content">
    <canvas> Oh no! Your browser does not support canvas. </canvas>
    <slot id="inner"></slot>
  </div>
  <slot name="frame"></slot>
</div>
`,Mc=`:host {
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
`,ro="noscale",Ss="fit",oo="scale",ao="fill",lo="stretch",wc=300,Sc=150,Ac=Ss,Ec=200,co=class extends HTMLElement{static get[Symbol.for("templateNode")](){let e=document.createElement("template");return e.innerHTML=bc,Object.defineProperty(this,Symbol.for("templateNode"),{value:e}),e}static get[Symbol.for("styleNode")](){let e=document.createElement("style");return e.innerHTML=Mc,Object.defineProperty(this,Symbol.for("styleNode"),{value:e}),e}static define(e=window.customElements){e.define("display-port",this)}static get observedAttributes(){return["debug","disabled","width","height","onframe","id","class"]}get mode(){return this.getAttribute("mode")}set mode(e){this.setAttribute("mode",e)}get debug(){return this._debug}set debug(e){this.toggleAttribute("debug",e)}get disabled(){return this._disabled}set disabled(e){this.toggleAttribute("disabled",e)}get width(){return this._width}set width(e){this.setAttribute("width",String(e))}get height(){return this._height}set height(e){this.setAttribute("height",String(e))}get onframe(){return this._onframe}set onframe(e){this._onframe&&this.removeEventListener("frame",this._onframe),this._onframe=e,this._onframe&&this.addEventListener("frame",e)}constructor(){super();let e=this.attachShadow({mode:"open"});e.appendChild(this.constructor[Symbol.for("templateNode")].content.cloneNode(!0)),e.appendChild(this.constructor[Symbol.for("styleNode")].cloneNode(!0)),this._canvasElement=e.querySelector("canvas"),this._contentElement=e.querySelector(".content"),this._innerElement=e.querySelector("#inner"),this._titleElement=e.querySelector("#title"),this._fpsElement=e.querySelector("#fps"),this._dimensionElement=e.querySelector("#dimension"),this._debug=!1,this._disabled=!1,this._width=wc,this._height=Sc,this._onframe=void 0,this._animationRequestHandle=0,this._prevAnimationFrameTime=0,this._resizeTimeoutHandle=0,this._resizeCanvasWidth=0,this._resizeCanvasHeight=0,this._frameEvent=new CustomEvent("frame",{composed:!0,bubbles:!1,detail:{now:0,prevTime:0,deltaTime:0,canvas:this._canvasElement}}),this._resizeEvent=new CustomEvent("resize",{composed:!0,bubbles:!1,detail:{width:0,height:0}}),this.update=this.update.bind(this),this.onDelayCanvasResize=this.onDelayCanvasResize.bind(this)}get canvas(){return this._canvasElement}connectedCallback(){zn(this,"mode"),zn(this,"debug"),zn(this,"disabled"),zn(this,"width"),zn(this,"height"),zn(this,"onframe"),this.hasAttribute("mode")||this.setAttribute("mode",Ac),this.hasAttribute("tabindex")||this.setAttribute("tabindex","0"),this.updateCanvasSize(!0),this.resume()}disconnectedCallback(){this.pause()}attributeChangedCallback(e,t,n){switch(e){case"debug":this._debug=n!==null;break;case"disabled":this._disabled=n!==null;break;case"width":this._width=Number(n);break;case"height":this._height=Number(n);break;case"onframe":this.onframe=new Function("event","with(document){with(this){"+n+"}}").bind(this);break}switch(e){case"disabled":n?(this.update(0),this.pause()):this.resume();break;case"id":case"class":this._titleElement.innerHTML=`display-port${this.className?"."+this.className:""}${this.hasAttribute("id")?"#"+this.getAttribute("id"):""}`;break;case"debug":this._titleElement.classList.toggle("hidden",n),this._fpsElement.classList.toggle("hidden",n),this._dimensionElement.classList.toggle("hidden",n);break}}getContext(e="2d",t=void 0){return this._canvasElement.getContext(e,t)}pause(){cancelAnimationFrame(this._animationRequestHandle)}resume(){this._animationRequestHandle=requestAnimationFrame(this.update)}update(e){this._animationRequestHandle=requestAnimationFrame(this.update),this.updateCanvasSize(!1);let t=e-this._prevAnimationFrameTime;if(this._prevAnimationFrameTime=e,this._debug){let r=t<=0?"--":String(Math.round(1e3/t)).padStart(2,"0");if(this._fpsElement.textContent!==r&&(this._fpsElement.textContent=r),this.mode===ro){let o=`${this._width}x${this._height}`;this._dimensionElement.textContent!==o&&(this._dimensionElement.textContent=o)}else{let o=`${this._width}x${this._height}|${this.shadowRoot.host.clientWidth}x${this.shadowRoot.host.clientHeight}`;this._dimensionElement.textContent!==o&&(this._dimensionElement.textContent=o)}}let i=this._frameEvent.detail;i.now=e,i.prevTime=this._prevAnimationFrameTime,i.deltaTime=t,this.dispatchEvent(this._frameEvent)}onDelayCanvasResize(){this._resizeTimeoutHandle=0,this.updateCanvasSize(!0)}delayCanvasResize(e,t){(e!==this._resizeCanvasWidth||t!==this._resizeCanvasHeight)&&(this._resizeCanvasWidth=e,this._resizeCanvasHeight=t,this._resizeTimeoutHandle&&clearTimeout(this._resizeTimeoutHandle),this._resizeTimeoutHandle=setTimeout(this.onDelayCanvasResize,Ec))}updateCanvasSize(e=!0){let t=this.shadowRoot.host.getBoundingClientRect(),n=t.width,i=t.height,r=this._canvasElement,a=this._width,o=this._height,l=this.mode;if(l===lo||l===ao)a=n,o=i;else if(l!==ro&&(n<a||i<o||l===Ss||l==oo)){let h=n/a,u=i/o;h<u?(a=n,o=o*h):(a=a*u,o=i)}if(a=Math.floor(a),o=Math.floor(o),typeof e=="undefined"&&(e=r.clientWidth!==a||r.clientHeight!==o),!e){this.delayCanvasResize(a,o);return}let c=Math.min(a/this._width,o/this._height)*.5;if(this._innerElement.style.fontSize=`font-size: ${c}em`,e){l===oo?(r.width=this._width,r.height=this._height):l!==lo&&(r.width=a,r.height=o);let h=this._contentElement.style;h.width=`${a}px`,h.height=`${o}px`,(l===Ss||l===ao)&&(this._width=a,this._height=o);let d=this._resizeEvent.detail;d.width=a,d.height=o,this.dispatchEvent(this._resizeEvent)}}};co.define();function zn(s,e){if(Object.prototype.hasOwnProperty.call(s,e)){let t=s[e];delete s[e],s[e]=t}}var As=class{get polling(){return performance.now()-this._lastPollingTime<1e3}get value(){return 0}get size(){return this._size}constructor(e){this._size=e,this._lastPollingTime=Number.MIN_SAFE_INTEGER}resize(e){this._size=e}getState(e){throw new Error("Missing implementation.")}onUpdate(e,t,n){throw new Error("Missing implementation.")}onStatus(e,t){throw new Error("Missing implementation.")}onPoll(e){this._lastPollingTime=e}onBind(e,t=void 0){e>=this._size&&this.resize(e+1)}onUnbind(){this.resize(0)}},_i=class extends As{static createAxisBindingState(){return{value:0,delta:0,inverted:!1}}get delta(){return this._delta}get value(){return this._value}constructor(e=0){super(e);let t=new Array,n=this.constructor;for(let i=0;i<e;++i)t.push(n.createAxisBindingState());this._state=t,this._value=0,this._delta=0}resize(e){let t=this._state,n=t.length,i;if(e<=n)i=t.slice(0,e);else{i=t;let r=this.constructor;for(let a=n;a<e;++a)i.push(r.createAxisBindingState())}this._state=i,super.resize(e)}getState(e){return this._state[e].value}onPoll(e){let t=this._state,n=0,i=0,r=t.length;for(let a=0;a<r;++a){let o=t[a];n+=o.value*(o.inverted?-1:1),i+=o.delta,t[a].delta=0}this._value=n,this._delta=i,super.onPoll(e)}onUpdate(e,t,n){typeof t=="undefined"?this.onAxisChange(e,n):this.onAxisMove(e,t,n)}onStatus(e,t){this.onAxisStatus(e,t)}onBind(e,t=void 0){super.onBind(e,t);let{inverted:n=!1}=t||{},i=this._state;i[e].inverted=n}onAxisMove(e,t,n){let i=this._state[e];i.value=t,i.delta+=n}onAxisChange(e,t){let n=this._state[e];n.value+=t,n.delta+=t}onAxisStatus(e,t){let n=this._state[e],i=n.value;n.value=t,n.delta=t-i}},Tc=241,ho=254,Cc=239,vn=1,Es=2,Ts=4,Cs=8,Ls=16,Ii=class extends As{get pressed(){return this._pressed}get repeated(){return this._repeated}get released(){return this._released}get down(){return this._down}get value(){return this._value}constructor(e=0){super(e);this._state=new Uint8Array(e),this._value=0,this._down=!1,this._pressed=!1,this._repeated=!1,this._released=!1}resize(e){let t=this._state,n=t.length,i;e<=n?i=t.slice(0,e):(i=new Uint8Array(e),i.set(t)),this._state=i,super.resize(e)}getState(e){let t=this._state[e],n=t&Ls?-1:1;return(t&vn?1:0)*n}onPoll(e){let t=this._state,n=0,i=0,r=0,a=0,o=0,l=t.length;for(let c=0;c<l;++c){let h=t[c],u=h&vn,d=h&Ls;i|=u,r|=h&Es,a|=h&Ts,o|=h&Cs,n+=(u?1:0)*(d?-1:1),t[c]&=Tc}this._value=n,this._down=i!==0,this._pressed=r!==0,this._repeated=a!==0,this._released=o!==0,super.onPoll(e)}onUpdate(e,t,n){n>0?this.onButtonPressed(e):this.onButtonReleased(e)}onStatus(e,t){this.onButtonStatus(e,t!==0)}onBind(e,t={inverted:!1}){super.onBind(e,t);let{inverted:n=!1}=t,i=this._state;n?i[e]|=Ls:i[e]&=Cc}onButtonPressed(e){let t=this._state,n=t[e];n&vn||(n|=Es,n|=vn),n|=Ts,t[e]=n}onButtonReleased(e){let t=this._state,n=t[e];n&vn&&(n|=Cs,n&=ho),t[e]=n}onButtonStatus(e,t){let n=this._state,i=n[e],r=Boolean(i&vn);t?i|=vn:i&=ho,r&&!t&&(i|=Cs),!r&&t&&(i|=Es,i|=Ts),n[e]=i}},oe=class{static parse(e){e=e.trim();let t=e.indexOf(".");if(t<0)throw new Error("Missing device separator for key code.");let n=e.substring(0,t);if(n.length<0)throw new Error("Missing device for key code.");let i=e.substring(t+1);if(i.length<0)throw new Error("Missing code for key code.");return new oe(n,i)}constructor(e,t){this.device=e,this.code=t}toString(){return`${this.device}.${this.code}`}};function uo(s,e){return new oe(s,e)}function Lc(s){return"device"in s&&"code"in s}var me="Keyboard",At="Mouse",Rc=new oe(me,"KeyA"),Pc=new oe(me,"KeyB"),Ic=new oe(me,"KeyC"),Dc=new oe(me,"KeyD"),Oc=new oe(me,"KeyE"),Nc=new oe(me,"KeyF"),Fc=new oe(me,"KeyG"),Bc=new oe(me,"KeyH"),Uc=new oe(me,"KeyI"),zc=new oe(me,"KeyJ"),kc=new oe(me,"KeyK"),Hc=new oe(me,"KeyL"),Vc=new oe(me,"KeyM"),Gc=new oe(me,"KeyN"),Wc=new oe(me,"KeyO"),qc=new oe(me,"KeyP"),Xc=new oe(me,"KeyQ"),Yc=new oe(me,"KeyR"),$c=new oe(me,"KeyS"),Kc=new oe(me,"KeyT"),Zc=new oe(me,"KeyU"),Jc=new oe(me,"KeyV"),jc=new oe(me,"KeyW"),Qc=new oe(me,"KeyX"),eh=new oe(me,"KeyY"),th=new oe(me,"KeyZ"),nh=new oe(me,"Digit0"),ih=new oe(me,"Digit1"),sh=new oe(me,"Digit2"),rh=new oe(me,"Digit3"),oh=new oe(me,"Digit4"),ah=new oe(me,"Digit5"),lh=new oe(me,"Digit6"),ch=new oe(me,"Digit7"),hh=new oe(me,"Digit8"),uh=new oe(me,"Digit9"),dh=new oe(me,"Minus"),fh=new oe(me,"Equal"),ph=new oe(me,"BracketLeft"),mh=new oe(me,"BracketRight"),gh=new oe(me,"Semicolon"),_h=new oe(me,"Quote"),xh=new oe(me,"Backquote"),vh=new oe(me,"Backslash"),yh=new oe(me,"Comma"),bh=new oe(me,"Period"),Mh=new oe(me,"Slash"),wh=new oe(me,"Escape"),Sh=new oe(me,"Space"),Ah=new oe(me,"CapsLock"),Eh=new oe(me,"Backspace"),Th=new oe(me,"Delete"),Ch=new oe(me,"Tab"),Lh=new oe(me,"Enter"),Rh=new oe(me,"ArrowUp"),Ph=new oe(me,"ArrowDown"),Ih=new oe(me,"ArrowLeft"),Dh=new oe(me,"ArrowRight"),Oh=new oe(At,"Button0"),Nh=new oe(At,"Button1"),Fh=new oe(At,"Button2"),Bh=new oe(At,"Button3"),Uh=new oe(At,"Button4"),zh=new oe(At,"PosX"),kh=new oe(At,"PosY"),Hh=new oe(At,"WheelX"),Vh=new oe(At,"WheelY"),Gh=new oe(At,"WheelZ"),yn=Object.freeze({__proto__:null,from:uo,isKeyCode:Lc,KEYBOARD:me,MOUSE:At,KEY_A:Rc,KEY_B:Pc,KEY_C:Ic,KEY_D:Dc,KEY_E:Oc,KEY_F:Nc,KEY_G:Fc,KEY_H:Bc,KEY_I:Uc,KEY_J:zc,KEY_K:kc,KEY_L:Hc,KEY_M:Vc,KEY_N:Gc,KEY_O:Wc,KEY_P:qc,KEY_Q:Xc,KEY_R:Yc,KEY_S:$c,KEY_T:Kc,KEY_U:Zc,KEY_V:Jc,KEY_W:jc,KEY_X:Qc,KEY_Y:eh,KEY_Z:th,DIGIT_0:nh,DIGIT_1:ih,DIGIT_2:sh,DIGIT_3:rh,DIGIT_4:oh,DIGIT_5:ah,DIGIT_6:lh,DIGIT_7:ch,DIGIT_8:hh,DIGIT_9:uh,MINUS:dh,EQUAL:fh,BRACKET_LEFT:ph,BRACKET_RIGHT:mh,SEMICOLON:gh,QUOTE:_h,BACKQUOTE:xh,BACKSLASH:vh,COMMA:yh,PERIOD:bh,SLASH:Mh,ESCAPE:wh,SPACE:Sh,CAPS_LOCK:Ah,BACKSPACE:Eh,DELETE:Th,TAB:Ch,ENTER:Lh,ARROW_UP:Rh,ARROW_DOWN:Ph,ARROW_LEFT:Ih,ARROW_RIGHT:Dh,MOUSE_BUTTON_0:Oh,MOUSE_BUTTON_1:Nh,MOUSE_BUTTON_2:Fh,MOUSE_BUTTON_3:Bh,MOUSE_BUTTON_4:Uh,MOUSE_POS_X:zh,MOUSE_POS_Y:kh,MOUSE_WHEEL_X:Hh,MOUSE_WHEEL_Y:Vh,MOUSE_WHEEL_Z:Gh}),fo=class{get polling(){return this.ref?this.ref.polling:!1}get value(){return!this.ref||this.disabled?0:this.ref.value}constructor(e){this.name=e,this.ref=null,this.disabled=!1}bindTo(e){throw new Error("Unsupported operation.")}disable(e=!0){return this.disabled=e,this}getState(e){return!this.ref||this.disabled?0:this.ref.getState(e)}};function qh(s){Array.isArray(s)||(s=[s]);let e=[];for(let t of s){let n;try{n=oe.parse(t)}catch(i){let r=Wh(t).toUpperCase();if(!(r in yn))throw new Error("Invalid key code string - "+i);n=yn[r]}e.push(n)}return e}function Wh(s){return s.replace(/([a-z]|(?:[A-Z0-9]+))([A-Z0-9]|$)/g,function(e,t,n){return t+(n&&"_"+n)}).toLowerCase()}var Vt=class extends fo{static fromBind(e,t,n,i=void 0){return new Vt(e,uo(t,n),i)}static fromString(e,...t){let n=qh(t);return new Vt(e,n)}get pressed(){return!this.ref||this.disabled?!1:this.ref.pressed}get repeated(){return!this.ref||this.disabled?!1:this.ref.repeated}get released(){return!this.ref||this.disabled?!1:this.ref.released}get down(){return!this.ref||this.disabled?!1:this.ref.down}constructor(e,t,n=void 0){super(e);this.keyCodes=Array.isArray(t)?t:[t],this.opts=n}bindTo(e){let t=this.name,n=this.opts;for(let i of this.keyCodes)e.bindButton(t,i.device,i.code,n);return this.ref=e.getButton(t),this}};var Rs=class{static isAxis(e){return!1}static isButton(e){return!1}constructor(e,t){if(!t)throw new Error(`Missing event target for device ${e}.`);this.name=e,this.eventTarget=t,this.listeners={input:[]}}setEventTarget(e){if(!e)throw new Error(`Missing event target for device ${this.name}.`);this.eventTarget=e}destroy(){let e=this.listeners;for(let t in e)e[t].length=0}addEventListener(e,t){let n=this.listeners;e in n?n[e].push(t):n[e]=[t]}removeEventListener(e,t){let n=this.listeners;if(e in n){let i=n[e],r=i.indexOf(t);r>=0&&i.splice(r,1)}}dispatchInputEvent(e){let t=0;for(let n of this.listeners.input)t|=n(e);return Boolean(t)}},po=class extends Rs{static isAxis(e){return!1}static isButton(e){return!0}constructor(e,t,n={}){super(e,t);let{ignoreRepeat:i=!0}=n;this.ignoreRepeat=i,this._eventObject={target:t,device:e,code:"",event:"",value:0,control:!1,shift:!1,alt:!1},this.onKeyDown=this.onKeyDown.bind(this),this.onKeyUp=this.onKeyUp.bind(this),t.addEventListener("keydown",this.onKeyDown),t.addEventListener("keyup",this.onKeyUp)}setEventTarget(e){this.eventTarget&&this.destroy(),super.setEventTarget(e),e.addEventListener("keydown",this.onKeyDown),e.addEventListener("keyup",this.onKeyUp)}destroy(){let e=this.eventTarget;e.removeEventListener("keydown",this.onKeyDown),e.removeEventListener("keyup",this.onKeyUp),super.destroy()}onKeyDown(e){if(e.repeat&&this.ignoreRepeat)return e.preventDefault(),e.stopPropagation(),!1;let t=this._eventObject;if(t.code=e.code,t.event="pressed",t.value=1,t.control=e.ctrlKey,t.shift=e.shiftKey,t.alt=e.altKey,this.dispatchInputEvent(t))return e.preventDefault(),e.stopPropagation(),!1}onKeyUp(e){let t=this._eventObject;if(t.code=e.code,t.event="released",t.value=1,t.control=e.ctrlKey,t.shift=e.shiftKey,t.alt=e.altKey,this.dispatchInputEvent(t))return e.preventDefault(),e.stopPropagation(),!1}},Ps=10,Is=100,mo=class extends Rs{static isAxis(e){return e==="PosX"||e==="PosY"||e==="WheelX"||e==="WheelY"||e==="WheelZ"}static isButton(e){return!this.isAxis(e)}constructor(e,t,n={}){super(e,t);let{eventsOnFocus:i=!0}=n;this.eventsOnFocus=i,this.canvasTarget=this.getCanvasFromEventTarget(t),this._downHasFocus=!1,this._eventObject={target:t,device:e,code:"",event:"",value:0,control:!1,shift:!1,alt:!1},this._positionObject={target:t,device:e,code:"",event:"move",value:0,movement:0},this._wheelObject={target:t,device:e,code:"",event:"wheel",movement:0},this.onMouseDown=this.onMouseDown.bind(this),this.onMouseUp=this.onMouseUp.bind(this),this.onMouseMove=this.onMouseMove.bind(this),this.onContextMenu=this.onContextMenu.bind(this),this.onWheel=this.onWheel.bind(this),t.addEventListener("mousedown",this.onMouseDown),t.addEventListener("contextmenu",this.onContextMenu),t.addEventListener("wheel",this.onWheel),document.addEventListener("mousemove",this.onMouseMove),document.addEventListener("mouseup",this.onMouseUp)}setEventTarget(e){this.eventTarget&&this.destroy(),super.setEventTarget(e),this.canvasTarget=this.getCanvasFromEventTarget(e),e.addEventListener("mousedown",this.onMouseDown),e.addEventListener("contextmenu",this.onContextMenu),e.addEventListener("wheel",this.onWheel),document.addEventListener("mousemove",this.onMouseMove),document.addEventListener("mouseup",this.onMouseUp)}destroy(){let e=this.eventTarget;e.removeEventListener("mousedown",this.onMouseDown),e.removeEventListener("contextmenu",this.onContextMenu),e.removeEventListener("wheel",this.onWheel),document.removeEventListener("mousemove",this.onMouseMove),document.removeEventListener("mouseup",this.onMouseUp),super.destroy()}setPointerLock(e=!0){e?this.eventTarget.requestPointerLock():this.eventTarget.exitPointerLock()}hasPointerLock(){return document.pointerLockElement===this.eventTarget}onMouseDown(e){this._downHasFocus=!0;let t=this._eventObject;if(t.code="Button"+e.button,t.event="pressed",t.value=1,t.control=e.ctrlKey,t.shift=e.shiftKey,t.alt=e.altKey,this.dispatchInputEvent(t)&&document.activeElement===this.eventTarget)return e.preventDefault(),e.stopPropagation(),!1}onContextMenu(e){return e.preventDefault(),e.stopPropagation(),!1}onWheel(e){let t,n,i;switch(e.deltaMode){case WheelEvent.DOM_DELTA_LINE:t=e.deltaX*Ps,n=e.deltaY*Ps,i=e.deltaZ*Ps;break;case WheelEvent.DOM_DELTA_PAGE:t=e.deltaX*Is,n=e.deltaY*Is,i=e.deltaZ*Is;break;case WheelEvent.DOM_DELTA_PIXEL:default:t=e.deltaX,n=e.deltaY,i=e.deltaZ;break}let r=0,a=this._wheelObject;if(a.code="WheelX",a.movement=t,r|=this.dispatchInputEvent(a),a.code="WheelY",a.movement=n,r|=this.dispatchInputEvent(a),a.code="WheelZ",a.movement=i,r|=this.dispatchInputEvent(a),r)return e.preventDefault(),e.stopPropagation(),!1}onMouseUp(e){if(!this._downHasFocus)return;this._downHasFocus=!1;let t=this._eventObject;if(t.code="Button"+e.button,t.event="released",t.value=1,t.control=e.ctrlKey,t.shift=e.shiftKey,t.alt=e.altKey,this.dispatchInputEvent(t))return e.preventDefault(),e.stopPropagation(),!1}onMouseMove(e){if(this.eventsOnFocus&&document.activeElement!==this.eventTarget)return;let t=this.canvasTarget,{clientWidth:n,clientHeight:i}=t,r=t.getBoundingClientRect(),a=e.movementX/n,o=e.movementY/i,l=(e.clientX-r.left)/n,c=(e.clientY-r.top)/i,h=this._positionObject;h.code="PosX",h.value=l,h.movement=a,this.dispatchInputEvent(h),h.code="PosY",h.value=c,h.movement=o,this.dispatchInputEvent(h)}getCanvasFromEventTarget(e){return e instanceof HTMLCanvasElement?e:e.canvas||e.querySelector("canvas")||e.shadowRoot&&e.shadowRoot.querySelector("canvas")||e}},Xh=`<kbd>
  <span id="name"><slot></slot></span>
  <span id="value" class="hidden"></span>
</kbd>
`,Yh=`kbd {
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
`,Ds=class extends HTMLElement{static get[Symbol.for("templateNode")](){let e=document.createElement("template");return e.innerHTML=Xh,Object.defineProperty(this,Symbol.for("templateNode"),{value:e}),e}static get[Symbol.for("styleNode")](){let e=document.createElement("style");return e.innerHTML=Yh,Object.defineProperty(this,Symbol.for("styleNode"),{value:e}),e}static define(e=window.customElements){e.define("input-code",this)}static get observedAttributes(){return["name","value","disabled"]}get disabled(){return this._disabled}set disabled(e){this.toggleAttribute("disabled",e)}get value(){return this._value}set value(e){this.setAttribute("value",e)}get name(){return this._name}set name(e){this.setAttribute("name",e)}constructor(){super();let e=this.constructor,t=this.attachShadow({mode:"open"});t.appendChild(e[Symbol.for("templateNode")].content.cloneNode(!0)),t.appendChild(e[Symbol.for("styleNode")].cloneNode(!0)),this._name="",this._value="",this._disabled=!1,this._kbdElement=t.querySelector("kbd"),this._nameElement=t.querySelector("#name"),this._valueElement=t.querySelector("#value")}attributeChangedCallback(e,t,n){switch(e){case"name":this._name=n,this._nameElement.textContent=n;break;case"value":this._value=n,n!==null?(this._valueElement.classList.toggle("hidden",!1),this._valueElement.textContent=n,this._kbdElement.style.paddingRight=`${this._valueElement.clientWidth+4}px`):this._valueElement.classList.toggle("hidden",!0);break;case"disabled":this._disabled=n!==null,this._kbdElement.classList.toggle("disabled",n!==null);break}}connectedCallback(){if(Object.prototype.hasOwnProperty.call(this,"name")){let e=this.name;delete this.name,this.name=e}if(Object.prototype.hasOwnProperty.call(this,"value")){let e=this.value;delete this.value,this.value=e}if(Object.prototype.hasOwnProperty.call(this,"disabled")){let e=this.disabled;delete this.disabled,this.disabled=e}}};Ds.define();var $h=`<table>
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
`,Kh=`:host {
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
`,go=class{constructor(e){this.onAnimationFrame=this.onAnimationFrame.bind(this),this.animationFrameHandle=null,this.pollable=e}get running(){return this.animationFrameHandle!==null}start(){let e=this.animationFrameHandle;e&&cancelAnimationFrame(e),this.animationFrameHandle=requestAnimationFrame(this.onAnimationFrame)}stop(){let e=this.animationFrameHandle;e&&cancelAnimationFrame(e),this.animationFrameHandle=null}onAnimationFrame(e){this.animationFrameHandle=requestAnimationFrame(this.onAnimationFrame),this.pollable.onPoll(e)}},_o=class{constructor(e){this.onInput=this.onInput.bind(this),this.onPoll=this.onPoll.bind(this),this.bindings=e}onPoll(e){for(let t of this.bindings.getInputs())t.onPoll(e)}onInput(e){let{device:t,code:n,event:i,value:r,movement:a,control:o,shift:l,alt:c}=e,h=this.bindings.getBindings(t,n);switch(i){case"pressed":for(let{input:u,index:d}of h)u.onUpdate(d,1,1);break;case"released":for(let{input:u,index:d}of h)u.onUpdate(d,0,-1);break;case"move":for(let{input:u,index:d}of h)u.onUpdate(d,r,a);break;case"wheel":for(let{input:u,index:d}of h)u.onUpdate(d,void 0,a);break}return h.length>0}},Os=class{constructor(e,t,n,i){this.device=e,this.code=t,this.input=n,this.index=i}},xo=class{constructor(){this.bindingMap={},this.inputMap=new Map}clear(){for(let e of this.inputMap.keys())e.onUnbind();this.inputMap.clear(),this.bindingMap={}}bind(e,t,n,i={inverted:!1}){let r,a=this.inputMap;if(a.has(e)){let l=a.get(e),c=e.size;e.onBind(c,i),r=new Os(t,n,e,c),l.push(r)}else{let l=[];a.set(e,l);let c=0;e.onBind(c,i),r=new Os(t,n,e,c),l.push(r)}let o=this.bindingMap;t in o?n in o[t]?o[t][n].push(r):o[t][n]=[r]:o[t]={[n]:[r]}}unbind(e){let t=this.inputMap;if(t.has(e)){let n=this.bindingMap,i=t.get(e);for(let r of i){let{device:a,code:o}=r,l=n[a][o],c=l.indexOf(r);l.splice(c,1)}i.length=0,e.onUnbind(),t.delete(e)}}isBound(e){return this.inputMap.has(e)}getInputs(){return this.inputMap.keys()}getBindingsByInput(e){return this.inputMap.get(e)}getBindings(e,t){let n=this.bindingMap;if(e in n){let i=n[e];if(t in i)return i[t]}return[]}},vo=class{constructor(e,t=void 0){this.inputs={},this.devices=[new mo("Mouse",e),new po("Keyboard",e)],this.bindings=new xo,this.adapter=new _o(this.bindings),this.autopoller=new go(this.adapter),this.eventTarget=e,this.anyButton=new Ii(1),this.anyButtonDevice="",this.anyButtonCode="",this.anyAxis=new _i(1),this.anyAxisDevice="",this.anyAxisCode="",this.listeners={bind:[],unbind:[],focus:[],blur:[]},this.onInput=this.onInput.bind(this),this.onEventTargetBlur=this.onEventTargetBlur.bind(this),this.onEventTargetFocus=this.onEventTargetFocus.bind(this),e.addEventListener("focus",this.onEventTargetFocus),e.addEventListener("blur",this.onEventTargetBlur);for(let n of this.devices)n.addEventListener("input",this.onInput)}get autopoll(){return this.autopoller.running}set autopoll(e){this.toggleAutoPoll(e)}destroy(){let e=this.listeners;for(let n in e)e[n].length=0;this.autopoller.running&&this.autopoller.stop();for(let n of this.devices)n.removeEventListener("input",this.onInput),n.destroy();let t=this.eventTarget;t.removeEventListener("focus",this.onEventTargetFocus),t.removeEventListener("blur",this.onEventTargetBlur)}setEventTarget(e){let t=this.eventTarget;t.removeEventListener("focus",this.onEventTargetFocus),t.removeEventListener("blur",this.onEventTargetBlur),this.eventTarget=e;for(let n of this.devices)n.setEventTarget(e);e.addEventListener("focus",this.onEventTargetFocus),e.addEventListener("blur",this.onEventTargetBlur)}toggleAutoPoll(e=void 0){let t=this.autopoller.running,n=typeof e=="undefined"?!t:Boolean(e);n!==t&&(n?this.autopoller.start():this.autopoller.stop())}addEventListener(e,t){let n=this.listeners;e in n?n[e].push(t):n[e]=[t]}removeEventListener(e,t){let n=this.listeners;if(e in n){let i=n[e],r=i.indexOf(t);r>=0&&i.splice(r,1)}}dispatchEvent(e){let{type:t}=e,n=0;for(let i of this.listeners[t])n|=i(e)?1:0;return Boolean(n)}poll(e=performance.now()){if(this.autopoller.running)throw new Error("Should not manually poll() while autopolling.");this.onPoll(e)}onInput(e){let t=this.adapter.onInput(e);switch(e.event){case"pressed":this.anyButtonDevice=e.device,this.anyButtonCode=e.code,this.anyButton.onUpdate(0,1,1);break;case"released":this.anyButtonDevice=e.device,this.anyButtonCode=e.code,this.anyButton.onUpdate(0,0,-1);break;case"move":case"wheel":this.anyAxisDevice=e.device,this.anyAxisCode=e.code,this.anyAxis.onUpdate(0,e.value,e.movement);break}return t}onPoll(e){this.adapter.onPoll(e),this.anyButton.onPoll(e),this.anyAxis.onPoll(e)}onBind(){this.dispatchEvent({type:"bind"})}onUnbind(){this.dispatchEvent({type:"unbind"})}onEventTargetFocus(){this.dispatchEvent({type:"focus"})}onEventTargetBlur(){for(let e of this.bindings.getInputs())e.onStatus(0,0);this.anyButton.onStatus(0,0),this.anyAxis.onStatus(0,0),this.dispatchEvent({type:"blur"})}bindBindings(e){Array.isArray(e)||(e=Object.values(e));for(let t of e)t.bindTo(this)}bindBinding(e){e.bindTo(this)}bindButton(e,t,n,i=void 0){let r;this.hasButton(e)?r=this.getButton(e):(r=new Ii(1),this.inputs[e]=r),this.bindings.bind(r,t,n,i),this.onBind()}bindAxis(e,t,n,i=void 0){let r;this.hasAxis(e)?r=this.getAxis(e):(r=new _i(1),this.inputs[e]=r),this.bindings.bind(r,t,n,i),this.onBind()}bindAxisButtons(e,t,n,i){let r;this.hasAxis(e)?r=this.getAxis(e):(r=new _i(2),this.inputs[e]=r),this.bindings.bind(r,t,i),this.bindings.bind(r,t,n,{inverted:!0}),this.onBind()}unbindButton(e){if(this.hasButton(e)){let t=this.getButton(e);delete this.inputs[e],this.bindings.unbind(t),this.onUnbind()}}unbindAxis(e){if(this.hasAxis(e)){let t=this.getAxis(e);delete this.inputs[e],this.bindings.unbind(t),this.onUnbind()}}getInput(e){return this.inputs[e]}getButton(e){return this.inputs[e]}getAxis(e){return this.inputs[e]}hasButton(e){return e in this.inputs&&this.inputs[e]instanceof Ii}hasAxis(e){return e in this.inputs&&this.inputs[e]instanceof _i}isButtonDown(e){return this.inputs[e].down}isButtonPressed(e){return this.inputs[e].pressed}isButtonReleased(e){return this.inputs[e].released}getInputValue(e){return this.inputs[e].value}getButtonValue(e){return this.inputs[e].value}getAxisValue(e){return this.inputs[e].value}getAxisDelta(e){return this.inputs[e].delta}isAnyButtonDown(e=void 0){if(typeof e=="undefined")return this.anyButton.down;{let t=this.inputs;for(let n of e)if(t[n].down)return!0}return!1}isAnyButtonPressed(e=void 0){if(typeof e=="undefined")return this.anyButton.pressed;{let t=this.inputs;for(let n of e)if(t[n].pressed)return!0}return!1}isAnyButtonReleased(e=void 0){if(typeof e=="undefined")return this.anyButton.released;{let t=this.inputs;for(let n of e)if(t[n].released)return!0}return!1}getAnyAxisValue(e=void 0){if(typeof e=="undefined")return this.anyAxis.value;{let t=this.inputs;for(let n of e){let i=t[n];if(i.value)return i.value}}return 0}getAnyAxisDelta(e=void 0){if(typeof e=="undefined")return this.anyAxis.delta;{let t=this.inputs;for(let n of e){let i=t[n];if(i.delta)return i.delta}}return 0}getLastButtonDevice(){return this.anyButtonDevice}getLastButtonCode(){return this.anyButtonCode}getLastAxisDevice(){return this.anyAxisDevice}getLastAxisCode(){return this.anyAxisCode}getMouse(){return this.devices[0]}getKeyboard(){return this.devices[1]}},yo=class extends HTMLElement{static get[Symbol.for("templateNode")](){let e=document.createElement("template");return e.innerHTML=$h,Object.defineProperty(this,Symbol.for("templateNode"),{value:e}),e}static get[Symbol.for("styleNode")](){let e=document.createElement("style");return e.innerHTML=Kh,Object.defineProperty(this,Symbol.for("styleNode"),{value:e}),e}static define(e=window.customElements){e.define("input-port",this)}static get observedAttributes(){return["autopoll","for"]}get autopoll(){return this._autopoll}set autopoll(e){this.toggleAttribute("autopoll",e)}get for(){return this._for}set for(e){this.setAttribute("for",e)}constructor(){super();let e=this.attachShadow({mode:"open"});e.appendChild(this.constructor[Symbol.for("templateNode")].content.cloneNode(!0)),e.appendChild(this.constructor[Symbol.for("styleNode")].cloneNode(!0)),this._titleElement=e.querySelector("#title"),this._pollElement=e.querySelector("#poll"),this._focusElement=e.querySelector("#focus"),this._bodyElement=e.querySelector("tbody"),this._outputElements={},this.onAnimationFrame=this.onAnimationFrame.bind(this),this.animationFrameHandle=null;let t=this;this._for="",this._eventTarget=t,this._autopoll=!1,this._context=null,this.onInputContextBind=this.onInputContextBind.bind(this),this.onInputContextUnbind=this.onInputContextUnbind.bind(this),this.onInputContextFocus=this.onInputContextFocus.bind(this),this.onInputContextBlur=this.onInputContextBlur.bind(this)}connectedCallback(){if(Object.prototype.hasOwnProperty.call(this,"for")){let e=this.for;delete this.for,this.for=e}if(Object.prototype.hasOwnProperty.call(this,"autopoll")){let e=this.autopoll;delete this.autopoll,this.autopoll=e}this.updateTable(),this.updateTableValues(),this.animationFrameHandle=requestAnimationFrame(this.onAnimationFrame)}disconnectedCallback(){let e=this._context;e&&(e.removeEventListener("bind",this.onInputContextBind),e.removeEventListener("unbind",this.onInputContextUnbind),e.removeEventListener("blur",this.onInputContextBlur),e.removeEventListener("focus",this.onInputContextFocus),e.destroy(),this._context=null)}attributeChangedCallback(e,t,n){switch(e){case"for":{this._for=n;let i,r;n?(i=document.getElementById(n),r=`${i.tagName.toLowerCase()}#${n}`):(i=this,r="input-port"),this._eventTarget=i,this._context&&this._context.setEventTarget(this._eventTarget),this._titleElement.innerHTML=`for ${r}`}break;case"autopoll":this._autopoll=n!==null,this._context&&this._context.toggleAutoPoll(this._autopoll);break}}onAnimationFrame(){this.animationFrameHandle=requestAnimationFrame(this.onAnimationFrame),this.updateTableValues(),this.updatePollStatus()}onInputContextBind(){return this.updateTable(),!0}onInputContextUnbind(){return this.updateTable(),!0}onInputContextFocus(){return this._focusElement.innerHTML="\u2713",!0}onInputContextBlur(){return this._focusElement.innerHTML="",!0}getContext(e="axisbutton",t=void 0){switch(e){case"axisbutton":if(!this._context){let n=new vo(this._eventTarget,t);n.addEventListener("bind",this.onInputContextBind),n.addEventListener("unbind",this.onInputContextUnbind),n.addEventListener("blur",this.onInputContextBlur),n.addEventListener("focus",this.onInputContextFocus),this._autopoll&&n.toggleAutoPoll(!0),this._context=n}return this._context;default:throw new Error(`Input context id '${e}' is not supported.`)}}updateTable(){if(this.isConnected)if(this._context){let e=this._context,t=e.inputs,n=e.bindings,i={},r=[];for(let a of Object.keys(t)){let o=t[a],l=!0;for(let c of n.getBindingsByInput(o)){let h=Zh(`${o.constructor.name}.${a}`,`${c.device}.${c.code}`,0,l);r.push(h),l&&(i[a]=h.querySelector("output"),l=!1)}}this._outputElements=i,this._bodyElement.innerHTML="";for(let a of r)this._bodyElement.appendChild(a)}else{this._outputElements={},this._bodyElement.innerHTML="";return}else return}updateTableValues(){if(this.isConnected)if(this._context){let t=this._context.inputs;for(let n of Object.keys(this._outputElements)){let i=this._outputElements[n],r=t[n].value;i.innerText=Number(r).toFixed(2)}}else{for(let e of Object.keys(this._outputElements)){let t=this._outputElements[e];t.innerText="---"}return}else return}updatePollStatus(){if(this.isConnected)if(this._context){let t=this._context.inputs;for(let n of Object.values(t))if(!n.polling){this._pollElement.innerHTML="";return}this._pollElement.innerHTML="\u2713"}else{this._pollElement.innerHTML="-";return}else return}};yo.define();function Zh(s,e,t,n=!0){let i=document.createElement("tr");n&&i.classList.add("primary");{let r=document.createElement("td");r.textContent=s,r.classList.add("name"),i.appendChild(r)}{let r=document.createElement("td"),a=document.createElement("output");n?a.innerText=Number(t).toFixed(2):a.innerText="---",a.classList.add("value"),r.appendChild(a),i.appendChild(r)}{let r=document.createElement("td");r.classList.add("key");let a=new Ds;a.innerText=e,r.appendChild(a),i.appendChild(r)}return i}var L0=Symbol("keyboardSource");var R0=Symbol("mouseSource");var Du=yc(Jo());window.addEventListener("error",ki,!0);window.addEventListener("unhandledrejection",ki,!0);function ki(s){typeof s=="object"?s instanceof PromiseRejectionEvent?ki(s.reason):s instanceof ErrorEvent?ki(s.error):s instanceof Error?window.alert(s.stack):window.alert(JSON.stringify(s)):window.alert(s)}var $s="144";var Ou=0,jo=1,Nu=2;var Qo=1,Fu=2,yi=3,Hn=0,bt=1,en=2,tn=0,Vn=1,ea=2,ta=3,na=4,Bu=5,Gn=100,Uu=101,zu=102,ia=103,sa=104,ku=200,Hu=201,Vu=202,Gu=203,ra=204,oa=205,Wu=206,qu=207,Xu=208,Yu=209,$u=210,Ku=0,Zu=1,Ju=2,Ks=3,ju=4,Qu=5,ed=6,td=7,Zs=0,nd=1,id=2,Wt=0,sd=1,rd=2,od=3,ad=4,ld=5,aa=300,Wn=301,qn=302,Js=303,js=304,Hi=306,Qs=1e3,Et=1001,er=1002,ct=1003,la=1004;var ca=1005;var Mt=1006,cd=1007;var Vi=1008;var bn=1009,hd=1010,ud=1011,ha=1012,dd=1013,Mn=1014,wn=1015,bi=1016,fd=1017,pd=1018,Xn=1020,md=1021,gd=1022,Nt=1023,_d=1024,xd=1025,Sn=1026,Yn=1027,vd=1028,yd=1029,bd=1030,Md=1031,wd=1033,tr=33776,nr=33777,ir=33778,sr=33779,ua=35840,da=35841,fa=35842,pa=35843,Sd=36196,ma=37492,ga=37496,_a=37808,xa=37809,va=37810,ya=37811,ba=37812,Ma=37813,wa=37814,Sa=37815,Aa=37816,Ea=37817,Ta=37818,Ca=37819,La=37820,Ra=37821,Pa=36492;var Gi=2300,Wi=2301,rr=2302,Ia=2400,Da=2401,Oa=2402;var An=3e3,Ve=3001,Ad=3200,Ed=3201,Na=0,Td=1;var qt="srgb",En="srgb-linear";var or=7680;var Cd=519,Fa=35044;var Ba="300 es",ar=1035,Tn=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;let n=this._listeners;return n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;let i=this._listeners[e];if(i!==void 0){let r=i.indexOf(t);r!==-1&&i.splice(r,1)}}dispatchEvent(e){if(this._listeners===void 0)return;let n=this._listeners[e.type];if(n!==void 0){e.target=this;let i=n.slice(0);for(let r=0,a=i.length;r<a;r++)i[r].call(this,e);e.target=null}}},nt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];var lr=Math.PI/180,Ua=180/Math.PI;function Mi(){let s=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(nt[s&255]+nt[s>>8&255]+nt[s>>16&255]+nt[s>>24&255]+"-"+nt[e&255]+nt[e>>8&255]+"-"+nt[e>>16&15|64]+nt[e>>24&255]+"-"+nt[t&63|128]+nt[t>>8&255]+"-"+nt[t>>16&255]+nt[t>>24&255]+nt[n&255]+nt[n>>8&255]+nt[n>>16&255]+nt[n>>24&255]).toLowerCase()}function ft(s,e,t){return Math.max(e,Math.min(t,s))}function Ld(s,e){return(s%e+e)%e}function cr(s,e,t){return(1-t)*s+t*e}function za(s){return(s&s-1)==0&&s!==0}function hr(s){return Math.pow(2,Math.floor(Math.log(s)/Math.LN2))}function qi(s,e){switch(e.constructor){case Float32Array:return s;case Uint16Array:return s/65535;case Uint8Array:return s/255;case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("Invalid component type.")}}function pt(s,e){switch(e.constructor){case Float32Array:return s;case Uint16Array:return Math.round(s*65535);case Uint8Array:return Math.round(s*255);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("Invalid component type.")}}var Ne=class{constructor(e=0,t=0){Ne.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6],this.y=i[1]*t+i[4]*n+i[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=this.x<0?Math.ceil(this.x):Math.floor(this.x),this.y=this.y<0?Math.ceil(this.y):Math.floor(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),i=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*n-a*i+e.x,this.y=r*i+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},mt=class{constructor(){mt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1]}set(e,t,n,i,r,a,o,l,c){let h=this.elements;return h[0]=e,h[1]=i,h[2]=o,h[3]=t,h[4]=r,h[5]=l,h[6]=n,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,i=t.elements,r=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],h=n[4],u=n[7],d=n[2],m=n[5],g=n[8],p=i[0],f=i[3],x=i[6],M=i[1],E=i[4],b=i[7],A=i[2],R=i[5],N=i[8];return r[0]=a*p+o*M+l*A,r[3]=a*f+o*E+l*R,r[6]=a*x+o*b+l*N,r[1]=c*p+h*M+u*A,r[4]=c*f+h*E+u*R,r[7]=c*x+h*b+u*N,r[2]=d*p+m*M+g*A,r[5]=d*f+m*E+g*R,r[8]=d*x+m*b+g*N,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8];return t*a*h-t*o*c-n*r*h+n*o*l+i*r*c-i*a*l}invert(){let e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],u=h*a-o*c,d=o*l-h*r,m=c*r-a*l,g=t*u+n*d+i*m;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);let p=1/g;return e[0]=u*p,e[1]=(i*c-h*n)*p,e[2]=(o*n-i*a)*p,e[3]=d*p,e[4]=(h*t-i*l)*p,e[5]=(i*r-o*t)*p,e[6]=m*p,e[7]=(n*l-c*t)*p,e[8]=(a*t-n*r)*p,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,i,r,a,o){let l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*a+c*o)+a+e,-i*c,i*l,-i*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){let n=this.elements;return n[0]*=e,n[3]*=e,n[6]*=e,n[1]*=t,n[4]*=t,n[7]*=t,this}rotate(e){let t=Math.cos(e),n=Math.sin(e),i=this.elements,r=i[0],a=i[3],o=i[6],l=i[1],c=i[4],h=i[7];return i[0]=t*r+n*l,i[3]=t*a+n*c,i[6]=t*o+n*h,i[1]=-n*r+t*l,i[4]=-n*a+t*c,i[7]=-n*o+t*h,this}translate(e,t){let n=this.elements;return n[0]+=e*n[2],n[3]+=e*n[5],n[6]+=e*n[8],n[1]+=t*n[2],n[4]+=t*n[5],n[7]+=t*n[8],this}equals(e){let t=this.elements,n=e.elements;for(let i=0;i<9;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}};function ka(s){for(let e=s.length-1;e>=0;--e)if(s[e]>=65535)return!0;return!1}function Xi(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function Cn(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function Yi(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}var ur={[qt]:{[En]:Cn},[En]:{[qt]:Yi}},Tt={legacyMode:!0,get workingColorSpace(){return En},set workingColorSpace(s){console.warn("THREE.ColorManagement: .workingColorSpace is readonly.")},convert:function(s,e,t){if(this.legacyMode||e===t||!e||!t)return s;if(ur[e]&&ur[e][t]!==void 0){let n=ur[e][t];return s.r=n(s.r),s.g=n(s.g),s.b=n(s.b),s}throw new Error("Unsupported color space conversion.")},fromWorkingColorSpace:function(s,e){return this.convert(s,this.workingColorSpace,e)},toWorkingColorSpace:function(s,e){return this.convert(s,e,this.workingColorSpace)}},Ha={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Ze={r:0,g:0,b:0},Ct={h:0,s:0,l:0},$i={h:0,s:0,l:0};function dr(s,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?s+(e-s)*6*t:t<1/2?e:t<2/3?s+(e-s)*6*(2/3-t):s}function Ki(s,e){return e.r=s.r,e.g=s.g,e.b=s.b,e}var ze=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,t===void 0&&n===void 0?this.set(e):this.setRGB(e,t,n)}set(e){return e&&e.isColor?this.copy(e):typeof e=="number"?this.setHex(e):typeof e=="string"&&this.setStyle(e),this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=qt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Tt.toWorkingColorSpace(this,t),this}setRGB(e,t,n,i=En){return this.r=e,this.g=t,this.b=n,Tt.toWorkingColorSpace(this,i),this}setHSL(e,t,n,i=En){if(e=Ld(e,1),t=ft(t,0,1),n=ft(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,a=2*n-r;this.r=dr(a,r,e+1/3),this.g=dr(a,r,e),this.b=dr(a,r,e-1/3)}return Tt.toWorkingColorSpace(this,i),this}setStyle(e,t=qt){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let i;if(i=/^((?:rgb|hsl)a?)\(([^\)]*)\)/.exec(e)){let r,a=i[1],o=i[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return this.r=Math.min(255,parseInt(r[1],10))/255,this.g=Math.min(255,parseInt(r[2],10))/255,this.b=Math.min(255,parseInt(r[3],10))/255,Tt.toWorkingColorSpace(this,t),n(r[4]),this;if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return this.r=Math.min(100,parseInt(r[1],10))/100,this.g=Math.min(100,parseInt(r[2],10))/100,this.b=Math.min(100,parseInt(r[3],10))/100,Tt.toWorkingColorSpace(this,t),n(r[4]),this;break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o)){let l=parseFloat(r[1])/360,c=parseFloat(r[2])/100,h=parseFloat(r[3])/100;return n(r[4]),this.setHSL(l,c,h,t)}break}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(e)){let r=i[1],a=r.length;if(a===3)return this.r=parseInt(r.charAt(0)+r.charAt(0),16)/255,this.g=parseInt(r.charAt(1)+r.charAt(1),16)/255,this.b=parseInt(r.charAt(2)+r.charAt(2),16)/255,Tt.toWorkingColorSpace(this,t),this;if(a===6)return this.r=parseInt(r.charAt(0)+r.charAt(1),16)/255,this.g=parseInt(r.charAt(2)+r.charAt(3),16)/255,this.b=parseInt(r.charAt(4)+r.charAt(5),16)/255,Tt.toWorkingColorSpace(this,t),this}return e&&e.length>0?this.setColorName(e,t):this}setColorName(e,t=qt){let n=Ha[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Cn(e.r),this.g=Cn(e.g),this.b=Cn(e.b),this}copyLinearToSRGB(e){return this.r=Yi(e.r),this.g=Yi(e.g),this.b=Yi(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=qt){return Tt.fromWorkingColorSpace(Ki(this,Ze),e),ft(Ze.r*255,0,255)<<16^ft(Ze.g*255,0,255)<<8^ft(Ze.b*255,0,255)<<0}getHexString(e=qt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=En){Tt.fromWorkingColorSpace(Ki(this,Ze),t);let n=Ze.r,i=Ze.g,r=Ze.b,a=Math.max(n,i,r),o=Math.min(n,i,r),l,c,h=(o+a)/2;if(o===a)l=0,c=0;else{let u=a-o;switch(c=h<=.5?u/(a+o):u/(2-a-o),a){case n:l=(i-r)/u+(i<r?6:0);break;case i:l=(r-n)/u+2;break;case r:l=(n-i)/u+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=En){return Tt.fromWorkingColorSpace(Ki(this,Ze),t),e.r=Ze.r,e.g=Ze.g,e.b=Ze.b,e}getStyle(e=qt){return Tt.fromWorkingColorSpace(Ki(this,Ze),e),e!==qt?`color(${e} ${Ze.r} ${Ze.g} ${Ze.b})`:`rgb(${Ze.r*255|0},${Ze.g*255|0},${Ze.b*255|0})`}offsetHSL(e,t,n){return this.getHSL(Ct),Ct.h+=e,Ct.s+=t,Ct.l+=n,this.setHSL(Ct.h,Ct.s,Ct.l),this}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Ct),e.getHSL($i);let n=cr(Ct.h,$i.h,t),i=cr(Ct.s,$i.s,t),r=cr(Ct.l,$i.l,t);return this.setHSL(n,i,r),this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}};ze.NAMES=Ha;var $n,fr=class{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement=="undefined")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{$n===void 0&&($n=Xi("canvas")),$n.width=e.width,$n.height=e.height;let n=$n.getContext("2d");e instanceof ImageData?n.putImageData(e,0,0):n.drawImage(e,0,0,e.width,e.height),t=$n}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement!="undefined"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement!="undefined"&&e instanceof HTMLCanvasElement||typeof ImageBitmap!="undefined"&&e instanceof ImageBitmap){let t=Xi("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let i=n.getImageData(0,0,e.width,e.height),r=i.data;for(let a=0;a<r.length;a++)r[a]=Cn(r[a]/255)*255;return n.putImageData(i,0,0),t}else if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(Cn(t[n]/255)*255):t[n]=Cn(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},pr=class{constructor(e=null){this.isSource=!0,this.uuid=Mi(),this.data=e,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let r;if(Array.isArray(i)){r=[];for(let a=0,o=i.length;a<o;a++)i[a].isDataTexture?r.push(mr(i[a].image)):r.push(mr(i[a]))}else r=mr(i);n.url=r}return t||(e.images[this.uuid]=n),n}};function mr(s){return typeof HTMLImageElement!="undefined"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement!="undefined"&&s instanceof HTMLCanvasElement||typeof ImageBitmap!="undefined"&&s instanceof ImageBitmap?fr.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var Rd=0,wt=class extends Tn{constructor(e=wt.DEFAULT_IMAGE,t=wt.DEFAULT_MAPPING,n=Et,i=Et,r=Mt,a=Vi,o=Nt,l=bn,c=1,h=An){super();this.isTexture=!0,Object.defineProperty(this,"id",{value:Rd++}),this.uuid=Mi(),this.name="",this.source=new pr(e),this.mipmaps=[],this.mapping=t,this.wrapS=n,this.wrapT=i,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new Ne(0,0),this.repeat=new Ne(1,1),this.center=new Ne(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new mt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.encoding=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.encoding=e.encoding,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.5,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,type:this.type,encoding:this.encoding,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return JSON.stringify(this.userData)!=="{}"&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==aa)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Qs:e.x=e.x-Math.floor(e.x);break;case Et:e.x=e.x<0?0:1;break;case er:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Qs:e.y=e.y-Math.floor(e.y);break;case Et:e.y=e.y<0?0:1;break;case er:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}};wt.DEFAULT_IMAGE=null;wt.DEFAULT_MAPPING=aa;var Je=class{constructor(e=0,t=0,n=0,i=1){Je.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=i}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,i){return this.x=e,this.y=t,this.z=n,this.w=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,i=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*i+a[12]*r,this.y=a[1]*t+a[5]*n+a[9]*i+a[13]*r,this.z=a[2]*t+a[6]*n+a[10]*i+a[14]*r,this.w=a[3]*t+a[7]*n+a[11]*i+a[15]*r,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,i,r,a=.01,o=.1,l=e.elements,c=l[0],h=l[4],u=l[8],d=l[1],m=l[5],g=l[9],p=l[2],f=l[6],x=l[10];if(Math.abs(h-d)<a&&Math.abs(u-p)<a&&Math.abs(g-f)<a){if(Math.abs(h+d)<o&&Math.abs(u+p)<o&&Math.abs(g+f)<o&&Math.abs(c+m+x-3)<o)return this.set(1,0,0,0),this;t=Math.PI;let E=(c+1)/2,b=(m+1)/2,A=(x+1)/2,R=(h+d)/4,N=(u+p)/4,_=(g+f)/4;return E>b&&E>A?E<a?(n=0,i=.707106781,r=.707106781):(n=Math.sqrt(E),i=R/n,r=N/n):b>A?b<a?(n=.707106781,i=0,r=.707106781):(i=Math.sqrt(b),n=R/i,r=_/i):A<a?(n=.707106781,i=.707106781,r=0):(r=Math.sqrt(A),n=N/r,i=_/r),this.set(n,i,r,t),this}let M=Math.sqrt((f-g)*(f-g)+(u-p)*(u-p)+(d-h)*(d-h));return Math.abs(M)<.001&&(M=1),this.x=(f-g)/M,this.y=(u-p)/M,this.z=(d-h)/M,this.w=Math.acos((c+m+x-1)/2),this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=this.x<0?Math.ceil(this.x):Math.floor(this.x),this.y=this.y<0?Math.ceil(this.y):Math.floor(this.y),this.z=this.z<0?Math.ceil(this.z):Math.floor(this.z),this.w=this.w<0?Math.ceil(this.w):Math.floor(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},nn=class extends Tn{constructor(e,t,n={}){super();this.isWebGLRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new Je(0,0,e,t),this.scissorTest=!1,this.viewport=new Je(0,0,e,t);let i={width:e,height:t,depth:1};this.texture=new wt(i,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.encoding),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=n.generateMipmaps!==void 0?n.generateMipmaps:!1,this.texture.internalFormat=n.internalFormat!==void 0?n.internalFormat:null,this.texture.minFilter=n.minFilter!==void 0?n.minFilter:Mt,this.depthBuffer=n.depthBuffer!==void 0?n.depthBuffer:!0,this.stencilBuffer=n.stencilBuffer!==void 0?n.stencilBuffer:!1,this.depthTexture=n.depthTexture!==void 0?n.depthTexture:null,this.samples=n.samples!==void 0?n.samples:0}setSize(e,t,n=1){(this.width!==e||this.height!==t||this.depth!==n)&&(this.width=e,this.height=t,this.depth=n,this.texture.image.width=e,this.texture.image.height=t,this.texture.image.depth=n,this.dispose()),this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.viewport.copy(e.viewport),this.texture=e.texture.clone(),this.texture.isRenderTargetTexture=!0;let t=Object.assign({},e.texture.image);return this.texture.source=new pr(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},gr=class extends wt{constructor(e=null,t=1,n=1,i=1){super(null);this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=ct,this.minFilter=ct,this.wrapR=Et,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Va=class extends wt{constructor(e=null,t=1,n=1,i=1){super(null);this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=ct,this.minFilter=ct,this.wrapR=Et,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Ln=class{constructor(e=0,t=0,n=0,i=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=i}static slerpFlat(e,t,n,i,r,a,o){let l=n[i+0],c=n[i+1],h=n[i+2],u=n[i+3],d=r[a+0],m=r[a+1],g=r[a+2],p=r[a+3];if(o===0){e[t+0]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u;return}if(o===1){e[t+0]=d,e[t+1]=m,e[t+2]=g,e[t+3]=p;return}if(u!==p||l!==d||c!==m||h!==g){let f=1-o,x=l*d+c*m+h*g+u*p,M=x>=0?1:-1,E=1-x*x;if(E>Number.EPSILON){let A=Math.sqrt(E),R=Math.atan2(A,x*M);f=Math.sin(f*R)/A,o=Math.sin(o*R)/A}let b=o*M;if(l=l*f+d*b,c=c*f+m*b,h=h*f+g*b,u=u*f+p*b,f===1-o){let A=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=A,c*=A,h*=A,u*=A}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,i,r,a){let o=n[i],l=n[i+1],c=n[i+2],h=n[i+3],u=r[a],d=r[a+1],m=r[a+2],g=r[a+3];return e[t]=o*g+h*u+l*m-c*d,e[t+1]=l*g+h*d+c*u-o*m,e[t+2]=c*g+h*m+o*d-l*u,e[t+3]=h*g-o*u-l*d-c*m,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,i){return this._x=e,this._y=t,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t){let n=e._x,i=e._y,r=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(n/2),h=o(i/2),u=o(r/2),d=l(n/2),m=l(i/2),g=l(r/2);switch(a){case"XYZ":this._x=d*h*u+c*m*g,this._y=c*m*u-d*h*g,this._z=c*h*g+d*m*u,this._w=c*h*u-d*m*g;break;case"YXZ":this._x=d*h*u+c*m*g,this._y=c*m*u-d*h*g,this._z=c*h*g-d*m*u,this._w=c*h*u+d*m*g;break;case"ZXY":this._x=d*h*u-c*m*g,this._y=c*m*u+d*h*g,this._z=c*h*g+d*m*u,this._w=c*h*u-d*m*g;break;case"ZYX":this._x=d*h*u-c*m*g,this._y=c*m*u+d*h*g,this._z=c*h*g-d*m*u,this._w=c*h*u+d*m*g;break;case"YZX":this._x=d*h*u+c*m*g,this._y=c*m*u+d*h*g,this._z=c*h*g-d*m*u,this._w=c*h*u-d*m*g;break;case"XZY":this._x=d*h*u-c*m*g,this._y=c*m*u-d*h*g,this._z=c*h*g+d*m*u,this._w=c*h*u+d*m*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t!==!1&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,i=Math.sin(n);return this._x=e.x*i,this._y=e.y*i,this._z=e.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],i=t[4],r=t[8],a=t[1],o=t[5],l=t[9],c=t[2],h=t[6],u=t[10],d=n+o+u;if(d>0){let m=.5/Math.sqrt(d+1);this._w=.25/m,this._x=(h-l)*m,this._y=(r-c)*m,this._z=(a-i)*m}else if(n>o&&n>u){let m=2*Math.sqrt(1+n-o-u);this._w=(h-l)/m,this._x=.25*m,this._y=(i+a)/m,this._z=(r+c)/m}else if(o>u){let m=2*Math.sqrt(1+o-n-u);this._w=(r-c)/m,this._x=(i+a)/m,this._y=.25*m,this._z=(l+h)/m}else{let m=2*Math.sqrt(1+u-n-o);this._w=(a-i)/m,this._x=(r+c)/m,this._y=(l+h)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<Number.EPSILON?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(ft(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let i=Math.min(1,t/n);return this.slerp(e,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,i=e._y,r=e._z,a=e._w,o=t._x,l=t._y,c=t._z,h=t._w;return this._x=n*h+a*o+i*c-r*l,this._y=i*h+a*l+r*o-n*c,this._z=r*h+a*c+n*l-i*o,this._w=a*h-n*o-i*l-r*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);let n=this._x,i=this._y,r=this._z,a=this._w,o=a*e._w+n*e._x+i*e._y+r*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=n,this._y=i,this._z=r,this;let l=1-o*o;if(l<=Number.EPSILON){let m=1-t;return this._w=m*a+t*this._w,this._x=m*n+t*this._x,this._y=m*i+t*this._y,this._z=m*r+t*this._z,this.normalize(),this._onChangeCallback(),this}let c=Math.sqrt(l),h=Math.atan2(c,o),u=Math.sin((1-t)*h)/c,d=Math.sin(t*h)/c;return this._w=a*u+this._w*d,this._x=n*u+this._x*d,this._y=i*u+this._y*d,this._z=r*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=Math.random(),t=Math.sqrt(1-e),n=Math.sqrt(e),i=2*Math.PI*Math.random(),r=2*Math.PI*Math.random();return this.set(t*Math.cos(i),n*Math.sin(r),n*Math.cos(r),t*Math.sin(i))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},z=class{constructor(e=0,t=0,n=0){z.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Ga.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Ga.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,i=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*i,this.y=r[1]*t+r[4]*n+r[7]*i,this.z=r[2]*t+r[5]*n+r[8]*i,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,i=this.z,r=e.elements,a=1/(r[3]*t+r[7]*n+r[11]*i+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*i+r[12])*a,this.y=(r[1]*t+r[5]*n+r[9]*i+r[13])*a,this.z=(r[2]*t+r[6]*n+r[10]*i+r[14])*a,this}applyQuaternion(e){let t=this.x,n=this.y,i=this.z,r=e.x,a=e.y,o=e.z,l=e.w,c=l*t+a*i-o*n,h=l*n+o*t-r*i,u=l*i+r*n-a*t,d=-r*t-a*n-o*i;return this.x=c*l+d*-r+h*-o-u*-a,this.y=h*l+d*-a+u*-r-c*-o,this.z=u*l+d*-o+c*-a-h*-r,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,i=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*i,this.y=r[1]*t+r[5]*n+r[9]*i,this.z=r[2]*t+r[6]*n+r[10]*i,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=this.x<0?Math.ceil(this.x):Math.floor(this.x),this.y=this.y<0?Math.ceil(this.y):Math.floor(this.y),this.z=this.z<0?Math.ceil(this.z):Math.floor(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,i=e.y,r=e.z,a=t.x,o=t.y,l=t.z;return this.x=i*l-r*o,this.y=r*a-n*l,this.z=n*o-i*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return _r.copy(this).projectOnVector(e),this.sub(_r)}reflect(e){return this.sub(_r.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(ft(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,i=this.z-e.z;return t*t+n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let i=Math.sin(t)*e;return this.x=i*Math.sin(n),this.y=Math.cos(t)*e,this.z=i*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),i=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=i,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=(Math.random()-.5)*2,t=Math.random()*Math.PI*2,n=Math.sqrt(1-e**2);return this.x=n*Math.cos(t),this.y=n*Math.sin(t),this.z=e,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},_r=new z,Ga=new Ln,Kn=class{constructor(e=new z(Infinity,Infinity,Infinity),t=new z(-Infinity,-Infinity,-Infinity)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){let t=Infinity,n=Infinity,i=Infinity,r=-Infinity,a=-Infinity,o=-Infinity;for(let l=0,c=e.length;l<c;l+=3){let h=e[l],u=e[l+1],d=e[l+2];h<t&&(t=h),u<n&&(n=u),d<i&&(i=d),h>r&&(r=h),u>a&&(a=u),d>o&&(o=d)}return this.min.set(t,n,i),this.max.set(r,a,o),this}setFromBufferAttribute(e){let t=Infinity,n=Infinity,i=Infinity,r=-Infinity,a=-Infinity,o=-Infinity;for(let l=0,c=e.count;l<c;l++){let h=e.getX(l),u=e.getY(l),d=e.getZ(l);h<t&&(t=h),u<n&&(n=u),d<i&&(i=d),h>r&&(r=h),u>a&&(a=u),d>o&&(o=d)}return this.min.set(t,n,i),this.max.set(r,a,o),this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=Rn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=Infinity,this.max.x=this.max.y=this.max.z=-Infinity,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0)if(t&&n.attributes!=null&&n.attributes.position!==void 0){let r=n.attributes.position;for(let a=0,o=r.count;a<o;a++)Rn.fromBufferAttribute(r,a).applyMatrix4(e.matrixWorld),this.expandByPoint(Rn)}else n.boundingBox===null&&n.computeBoundingBox(),xr.copy(n.boundingBox),xr.applyMatrix4(e.matrixWorld),this.union(xr);let i=e.children;for(let r=0,a=i.length;r<a;r++)this.expandByObject(i[r],t);return this}containsPoint(e){return!(e.x<this.min.x||e.x>this.max.x||e.y<this.min.y||e.y>this.max.y||e.z<this.min.z||e.z>this.max.z)}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return!(e.max.x<this.min.x||e.min.x>this.max.x||e.max.y<this.min.y||e.min.y>this.max.y||e.max.z<this.min.z||e.min.z>this.max.z)}intersectsSphere(e){return this.clampPoint(e.center,Rn),Rn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(wi),Zi.subVectors(this.max,wi),Zn.subVectors(e.a,wi),Jn.subVectors(e.b,wi),jn.subVectors(e.c,wi),sn.subVectors(Jn,Zn),rn.subVectors(jn,Jn),Pn.subVectors(Zn,jn);let t=[0,-sn.z,sn.y,0,-rn.z,rn.y,0,-Pn.z,Pn.y,sn.z,0,-sn.x,rn.z,0,-rn.x,Pn.z,0,-Pn.x,-sn.y,sn.x,0,-rn.y,rn.x,0,-Pn.y,Pn.x,0];return!vr(t,Zn,Jn,jn,Zi)||(t=[1,0,0,0,1,0,0,0,1],!vr(t,Zn,Jn,jn,Zi))?!1:(Ji.crossVectors(sn,rn),t=[Ji.x,Ji.y,Ji.z],vr(t,Zn,Jn,jn,Zi))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return Rn.copy(e).clamp(this.min,this.max).sub(e).length()}getBoundingSphere(e){return this.getCenter(e.center),e.radius=this.getSize(Rn).length()*.5,e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Xt[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Xt[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Xt[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Xt[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Xt[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Xt[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Xt[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Xt[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Xt),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}},Xt=[new z,new z,new z,new z,new z,new z,new z,new z],Rn=new z,xr=new Kn,Zn=new z,Jn=new z,jn=new z,sn=new z,rn=new z,Pn=new z,wi=new z,Zi=new z,Ji=new z,In=new z;function vr(s,e,t,n,i){for(let r=0,a=s.length-3;r<=a;r+=3){In.fromArray(s,r);let o=i.x*Math.abs(In.x)+i.y*Math.abs(In.y)+i.z*Math.abs(In.z),l=e.dot(In),c=t.dot(In),h=n.dot(In);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}var Pd=new Kn,Wa=new z,ji=new z,yr=new z,Qi=class{constructor(e=new z,t=-1){this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t!==void 0?n.copy(t):Pd.setFromPoints(e).getCenter(n);let i=0;for(let r=0,a=e.length;r<a;r++)i=Math.max(i,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(i),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){yr.subVectors(e,this.center);let t=yr.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),i=(n-this.radius)*.5;this.center.add(yr.multiplyScalar(i/n)),this.radius+=i}return this}union(e){return this.center.equals(e.center)===!0?ji.set(0,0,1).multiplyScalar(e.radius):ji.subVectors(e.center,this.center).normalize().multiplyScalar(e.radius),this.expandByPoint(Wa.copy(e.center).add(ji)),this.expandByPoint(Wa.copy(e.center).sub(ji)),this}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}},Yt=new z,br=new z,es=new z,on=new z,Mr=new z,ts=new z,wr=new z,qa=class{constructor(e=new z,t=new z(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.direction).multiplyScalar(e).add(this.origin)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Yt)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.direction).multiplyScalar(n).add(this.origin)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=Yt.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Yt.copy(this.direction).multiplyScalar(t).add(this.origin),Yt.distanceToSquared(e))}distanceSqToSegment(e,t,n,i){br.copy(e).add(t).multiplyScalar(.5),es.copy(t).sub(e).normalize(),on.copy(this.origin).sub(br);let r=e.distanceTo(t)*.5,a=-this.direction.dot(es),o=on.dot(this.direction),l=-on.dot(es),c=on.lengthSq(),h=Math.abs(1-a*a),u,d,m,g;if(h>0)if(u=a*l-o,d=a*o-l,g=r*h,u>=0)if(d>=-g)if(d<=g){let p=1/h;u*=p,d*=p,m=u*(u+a*d+2*o)+d*(a*u+d+2*l)+c}else d=r,u=Math.max(0,-(a*d+o)),m=-u*u+d*(d+2*l)+c;else d=-r,u=Math.max(0,-(a*d+o)),m=-u*u+d*(d+2*l)+c;else d<=-g?(u=Math.max(0,-(-a*r+o)),d=u>0?-r:Math.min(Math.max(-r,-l),r),m=-u*u+d*(d+2*l)+c):d<=g?(u=0,d=Math.min(Math.max(-r,-l),r),m=d*(d+2*l)+c):(u=Math.max(0,-(a*r+o)),d=u>0?r:Math.min(Math.max(-r,-l),r),m=-u*u+d*(d+2*l)+c);else d=a>0?-r:r,u=Math.max(0,-(a*d+o)),m=-u*u+d*(d+2*l)+c;return n&&n.copy(this.direction).multiplyScalar(u).add(this.origin),i&&i.copy(es).multiplyScalar(d).add(br),m}intersectSphere(e,t){Yt.subVectors(e.center,this.origin);let n=Yt.dot(this.direction),i=Yt.dot(Yt)-n*n,r=e.radius*e.radius;if(i>r)return null;let a=Math.sqrt(r-i),o=n-a,l=n+a;return o<0&&l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,i,r,a,o,l,c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,i=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,i=(e.min.x-d.x)*c),h>=0?(r=(e.min.y-d.y)*h,a=(e.max.y-d.y)*h):(r=(e.max.y-d.y)*h,a=(e.min.y-d.y)*h),n>a||r>i||((r>n||n!==n)&&(n=r),(a<i||i!==i)&&(i=a),u>=0?(o=(e.min.z-d.z)*u,l=(e.max.z-d.z)*u):(o=(e.max.z-d.z)*u,l=(e.min.z-d.z)*u),n>l||o>i)||((o>n||n!==n)&&(n=o),(l<i||i!==i)&&(i=l),i<0)?null:this.at(n>=0?n:i,t)}intersectsBox(e){return this.intersectBox(e,Yt)!==null}intersectTriangle(e,t,n,i,r){Mr.subVectors(t,e),ts.subVectors(n,e),wr.crossVectors(Mr,ts);let a=this.direction.dot(wr),o;if(a>0){if(i)return null;o=1}else if(a<0)o=-1,a=-a;else return null;on.subVectors(this.origin,e);let l=o*this.direction.dot(ts.crossVectors(on,ts));if(l<0)return null;let c=o*this.direction.dot(Mr.cross(on));if(c<0||l+c>a)return null;let h=-o*on.dot(wr);return h<0?null:this.at(h/a,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},Ye=class{constructor(){Ye.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]}set(e,t,n,i,r,a,o,l,c,h,u,d,m,g,p,f){let x=this.elements;return x[0]=e,x[4]=t,x[8]=n,x[12]=i,x[1]=r,x[5]=a,x[9]=o,x[13]=l,x[2]=c,x[6]=h,x[10]=u,x[14]=d,x[3]=m,x[7]=g,x[11]=p,x[15]=f,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Ye().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){let t=this.elements,n=e.elements,i=1/Qn.setFromMatrixColumn(e,0).length(),r=1/Qn.setFromMatrixColumn(e,1).length(),a=1/Qn.setFromMatrixColumn(e,2).length();return t[0]=n[0]*i,t[1]=n[1]*i,t[2]=n[2]*i,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,i=e.y,r=e.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(i),c=Math.sin(i),h=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){let d=a*h,m=a*u,g=o*h,p=o*u;t[0]=l*h,t[4]=-l*u,t[8]=c,t[1]=m+g*c,t[5]=d-p*c,t[9]=-o*l,t[2]=p-d*c,t[6]=g+m*c,t[10]=a*l}else if(e.order==="YXZ"){let d=l*h,m=l*u,g=c*h,p=c*u;t[0]=d+p*o,t[4]=g*o-m,t[8]=a*c,t[1]=a*u,t[5]=a*h,t[9]=-o,t[2]=m*o-g,t[6]=p+d*o,t[10]=a*l}else if(e.order==="ZXY"){let d=l*h,m=l*u,g=c*h,p=c*u;t[0]=d-p*o,t[4]=-a*u,t[8]=g+m*o,t[1]=m+g*o,t[5]=a*h,t[9]=p-d*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){let d=a*h,m=a*u,g=o*h,p=o*u;t[0]=l*h,t[4]=g*c-m,t[8]=d*c+p,t[1]=l*u,t[5]=p*c+d,t[9]=m*c-g,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){let d=a*l,m=a*c,g=o*l,p=o*c;t[0]=l*h,t[4]=p-d*u,t[8]=g*u+m,t[1]=u,t[5]=a*h,t[9]=-o*h,t[2]=-c*h,t[6]=m*u+g,t[10]=d-p*u}else if(e.order==="XZY"){let d=a*l,m=a*c,g=o*l,p=o*c;t[0]=l*h,t[4]=-u,t[8]=c*h,t[1]=d*u+p,t[5]=a*h,t[9]=m*u-g,t[2]=g*u-m,t[6]=o*h,t[10]=p*u+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Id,e,Dd)}lookAt(e,t,n){let i=this.elements;return gt.subVectors(e,t),gt.lengthSq()===0&&(gt.z=1),gt.normalize(),an.crossVectors(n,gt),an.lengthSq()===0&&(Math.abs(n.z)===1?gt.x+=1e-4:gt.z+=1e-4,gt.normalize(),an.crossVectors(n,gt)),an.normalize(),ns.crossVectors(gt,an),i[0]=an.x,i[4]=ns.x,i[8]=gt.x,i[1]=an.y,i[5]=ns.y,i[9]=gt.y,i[2]=an.z,i[6]=ns.z,i[10]=gt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,i=t.elements,r=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],h=n[1],u=n[5],d=n[9],m=n[13],g=n[2],p=n[6],f=n[10],x=n[14],M=n[3],E=n[7],b=n[11],A=n[15],R=i[0],N=i[4],_=i[8],S=i[12],I=i[1],L=i[5],J=i[9],V=i[13],F=i[2],T=i[6],C=i[10],Z=i[14],H=i[3],D=i[7],B=i[11],Q=i[15];return r[0]=a*R+o*I+l*F+c*H,r[4]=a*N+o*L+l*T+c*D,r[8]=a*_+o*J+l*C+c*B,r[12]=a*S+o*V+l*Z+c*Q,r[1]=h*R+u*I+d*F+m*H,r[5]=h*N+u*L+d*T+m*D,r[9]=h*_+u*J+d*C+m*B,r[13]=h*S+u*V+d*Z+m*Q,r[2]=g*R+p*I+f*F+x*H,r[6]=g*N+p*L+f*T+x*D,r[10]=g*_+p*J+f*C+x*B,r[14]=g*S+p*V+f*Z+x*Q,r[3]=M*R+E*I+b*F+A*H,r[7]=M*N+E*L+b*T+A*D,r[11]=M*_+E*J+b*C+A*B,r[15]=M*S+E*V+b*Z+A*Q,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],i=e[8],r=e[12],a=e[1],o=e[5],l=e[9],c=e[13],h=e[2],u=e[6],d=e[10],m=e[14],g=e[3],p=e[7],f=e[11],x=e[15];return g*(+r*l*u-i*c*u-r*o*d+n*c*d+i*o*m-n*l*m)+p*(+t*l*m-t*c*d+r*a*d-i*a*m+i*c*h-r*l*h)+f*(+t*c*u-t*o*m-r*a*u+n*a*m+r*o*h-n*c*h)+x*(-i*o*h-t*l*u+t*o*d+i*a*u-n*a*d+n*l*h)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let i=this.elements;return e.isVector3?(i[12]=e.x,i[13]=e.y,i[14]=e.z):(i[12]=e,i[13]=t,i[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],u=e[9],d=e[10],m=e[11],g=e[12],p=e[13],f=e[14],x=e[15],M=u*f*c-p*d*c+p*l*m-o*f*m-u*l*x+o*d*x,E=g*d*c-h*f*c-g*l*m+a*f*m+h*l*x-a*d*x,b=h*p*c-g*u*c+g*o*m-a*p*m-h*o*x+a*u*x,A=g*u*l-h*p*l-g*o*d+a*p*d+h*o*f-a*u*f,R=t*M+n*E+i*b+r*A;if(R===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let N=1/R;return e[0]=M*N,e[1]=(p*d*r-u*f*r-p*i*m+n*f*m+u*i*x-n*d*x)*N,e[2]=(o*f*r-p*l*r+p*i*c-n*f*c-o*i*x+n*l*x)*N,e[3]=(u*l*r-o*d*r-u*i*c+n*d*c+o*i*m-n*l*m)*N,e[4]=E*N,e[5]=(h*f*r-g*d*r+g*i*m-t*f*m-h*i*x+t*d*x)*N,e[6]=(g*l*r-a*f*r-g*i*c+t*f*c+a*i*x-t*l*x)*N,e[7]=(a*d*r-h*l*r+h*i*c-t*d*c-a*i*m+t*l*m)*N,e[8]=b*N,e[9]=(g*u*r-h*p*r-g*n*m+t*p*m+h*n*x-t*u*x)*N,e[10]=(a*p*r-g*o*r+g*n*c-t*p*c-a*n*x+t*o*x)*N,e[11]=(h*o*r-a*u*r-h*n*c+t*u*c+a*n*m-t*o*m)*N,e[12]=A*N,e[13]=(h*p*i-g*u*i+g*n*d-t*p*d-h*n*f+t*u*f)*N,e[14]=(g*o*i-a*p*i-g*n*l+t*p*l+a*n*f-t*o*f)*N,e[15]=(a*u*i-h*o*i+h*n*l-t*u*l-a*n*d+t*o*d)*N,this}scale(e){let t=this.elements,n=e.x,i=e.y,r=e.z;return t[0]*=n,t[4]*=i,t[8]*=r,t[1]*=n,t[5]*=i,t[9]*=r,t[2]*=n,t[6]*=i,t[10]*=r,t[3]*=n,t[7]*=i,t[11]*=r,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],i=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,i))}makeTranslation(e,t,n){return this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),i=Math.sin(t),r=1-n,a=e.x,o=e.y,l=e.z,c=r*a,h=r*o;return this.set(c*a+n,c*o-i*l,c*l+i*o,0,c*o+i*l,h*o+n,h*l-i*a,0,c*l-i*o,h*l+i*a,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,i,r,a){return this.set(1,n,r,0,e,1,a,0,t,i,1,0,0,0,0,1),this}compose(e,t,n){let i=this.elements,r=t._x,a=t._y,o=t._z,l=t._w,c=r+r,h=a+a,u=o+o,d=r*c,m=r*h,g=r*u,p=a*h,f=a*u,x=o*u,M=l*c,E=l*h,b=l*u,A=n.x,R=n.y,N=n.z;return i[0]=(1-(p+x))*A,i[1]=(m+b)*A,i[2]=(g-E)*A,i[3]=0,i[4]=(m-b)*R,i[5]=(1-(d+x))*R,i[6]=(f+M)*R,i[7]=0,i[8]=(g+E)*N,i[9]=(f-M)*N,i[10]=(1-(d+p))*N,i[11]=0,i[12]=e.x,i[13]=e.y,i[14]=e.z,i[15]=1,this}decompose(e,t,n){let i=this.elements,r=Qn.set(i[0],i[1],i[2]).length(),a=Qn.set(i[4],i[5],i[6]).length(),o=Qn.set(i[8],i[9],i[10]).length();this.determinant()<0&&(r=-r),e.x=i[12],e.y=i[13],e.z=i[14],Lt.copy(this);let c=1/r,h=1/a,u=1/o;return Lt.elements[0]*=c,Lt.elements[1]*=c,Lt.elements[2]*=c,Lt.elements[4]*=h,Lt.elements[5]*=h,Lt.elements[6]*=h,Lt.elements[8]*=u,Lt.elements[9]*=u,Lt.elements[10]*=u,t.setFromRotationMatrix(Lt),n.x=r,n.y=a,n.z=o,this}makePerspective(e,t,n,i,r,a){let o=this.elements,l=2*r/(t-e),c=2*r/(n-i),h=(t+e)/(t-e),u=(n+i)/(n-i),d=-(a+r)/(a-r),m=-2*a*r/(a-r);return o[0]=l,o[4]=0,o[8]=h,o[12]=0,o[1]=0,o[5]=c,o[9]=u,o[13]=0,o[2]=0,o[6]=0,o[10]=d,o[14]=m,o[3]=0,o[7]=0,o[11]=-1,o[15]=0,this}makeOrthographic(e,t,n,i,r,a){let o=this.elements,l=1/(t-e),c=1/(n-i),h=1/(a-r),u=(t+e)*l,d=(n+i)*c,m=(a+r)*h;return o[0]=2*l,o[4]=0,o[8]=0,o[12]=-u,o[1]=0,o[5]=2*c,o[9]=0,o[13]=-d,o[2]=0,o[6]=0,o[10]=-2*h,o[14]=-m,o[3]=0,o[7]=0,o[11]=0,o[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let i=0;i<16;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},Qn=new z,Lt=new Ye,Id=new z(0,0,0),Dd=new z(1,1,1),an=new z,ns=new z,gt=new z,Xa=new Ye,Ya=new Ln,ei=class{constructor(e=0,t=0,n=0,i=ei.DefaultOrder){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,i=this._order){return this._x=e,this._y=t,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let i=e.elements,r=i[0],a=i[4],o=i[8],l=i[1],c=i[5],h=i[9],u=i[2],d=i[6],m=i[10];switch(t){case"XYZ":this._y=Math.asin(ft(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,m),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-ft(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,m),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(ft(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,m),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-ft(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,m),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(ft(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(o,m));break;case"XZY":this._z=Math.asin(-ft(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,m),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Xa.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Xa,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Ya.setFromEuler(this),this.setFromQuaternion(Ya,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}toVector3(){console.error("THREE.Euler: .toVector3() has been removed. Use Vector3.setFromEuler() instead")}};ei.DefaultOrder="XYZ";ei.RotationOrders=["XYZ","YZX","ZXY","XZY","YXZ","ZYX"];var Sr=class{constructor(){this.mask=1|0}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=4294967295|0}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!=0}isEnabled(e){return(this.mask&(1<<e|0))!=0}},Od=0,$a=new z,ti=new Ln,$t=new Ye,is=new z,Si=new z,Nd=new z,Fd=new Ln,Ka=new z(1,0,0),Za=new z(0,1,0),Ja=new z(0,0,1),Bd={type:"added"},ja={type:"removed"},tt=class extends Tn{constructor(){super();this.isObject3D=!0,Object.defineProperty(this,"id",{value:Od++}),this.uuid=Mi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=tt.DefaultUp.clone();let e=new z,t=new ei,n=new Ln,i=new z(1,1,1);function r(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new Ye},normalMatrix:{value:new mt}}),this.matrix=new Ye,this.matrixWorld=new Ye,this.matrixAutoUpdate=tt.DefaultMatrixAutoUpdate,this.matrixWorldNeedsUpdate=!1,this.matrixWorldAutoUpdate=tt.DefaultMatrixWorldAutoUpdate,this.layers=new Sr,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return ti.setFromAxisAngle(e,t),this.quaternion.multiply(ti),this}rotateOnWorldAxis(e,t){return ti.setFromAxisAngle(e,t),this.quaternion.premultiply(ti),this}rotateX(e){return this.rotateOnAxis(Ka,e)}rotateY(e){return this.rotateOnAxis(Za,e)}rotateZ(e){return this.rotateOnAxis(Ja,e)}translateOnAxis(e,t){return $a.copy(e).applyQuaternion(this.quaternion),this.position.add($a.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Ka,e)}translateY(e){return this.translateOnAxis(Za,e)}translateZ(e){return this.translateOnAxis(Ja,e)}localToWorld(e){return e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return e.applyMatrix4($t.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?is.copy(e):is.set(e,t,n);let i=this.parent;this.updateWorldMatrix(!0,!1),Si.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?$t.lookAt(Si,is,this.up):$t.lookAt(is,Si,this.up),this.quaternion.setFromRotationMatrix($t),i&&($t.extractRotation(i.matrixWorld),ti.setFromRotationMatrix($t),this.quaternion.premultiply(ti.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.parent!==null&&e.parent.remove(e),e.parent=this,this.children.push(e),e.dispatchEvent(Bd)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(ja)),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){for(let e=0;e<this.children.length;e++){let t=this.children[e];t.parent=null,t.dispatchEvent(ja)}return this.children.length=0,this}attach(e){return this.updateWorldMatrix(!0,!1),$t.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),$t.multiply(e.parent.matrixWorld)),e.applyMatrix4($t),this.add(e),e.updateWorldMatrix(!1,!0),this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,i=this.children.length;n<i;n++){let a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Si,e,Nd),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Si,Fd,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);let t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,i=t.length;n<i;n++){let r=t[n];(r.matrixWorldAutoUpdate===!0||e===!0)&&r.updateMatrixWorld(e)}}updateWorldMatrix(e,t){let n=this.parent;if(e===!0&&n!==null&&n.matrixWorldAutoUpdate===!0&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),t===!0){let i=this.children;for(let r=0,a=i.length;r<a;r++){let o=i[r];o.matrixWorldAutoUpdate===!0&&o.updateWorldMatrix(!1,!0)}}}toJSON(e){let t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.5,type:"Object",generator:"Object3D.toJSON"});let i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),JSON.stringify(this.userData)!=="{}"&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=r(e.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){let u=l[c];r(e.shapes,u)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(e.materials,this.material[l]));i.material=o}else i.material=r(e.materials,this.material);if(this.children.length>0){i.children=[];for(let o=0;o<this.children.length;o++)i.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){i.animations=[];for(let o=0;o<this.animations.length;o++){let l=this.animations[o];i.animations.push(r(e.animations,l))}}if(t){let o=a(e.geometries),l=a(e.materials),c=a(e.textures),h=a(e.images),u=a(e.shapes),d=a(e.skeletons),m=a(e.animations),g=a(e.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),m.length>0&&(n.animations=m),g.length>0&&(n.nodes=g)}return n.object=i,n;function a(o){let l=[];for(let c in o){let h=o[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){let i=e.children[n];this.add(i.clone())}return this}};tt.DefaultUp=new z(0,1,0);tt.DefaultMatrixAutoUpdate=!0;tt.DefaultMatrixWorldAutoUpdate=!0;var Rt=new z,Kt=new z,Ar=new z,Zt=new z,ni=new z,ii=new z,Qa=new z,Er=new z,Tr=new z,Cr=new z,Ft=class{constructor(e=new z,t=new z,n=new z){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,i){i.subVectors(n,t),Rt.subVectors(e,t),i.cross(Rt);let r=i.lengthSq();return r>0?i.multiplyScalar(1/Math.sqrt(r)):i.set(0,0,0)}static getBarycoord(e,t,n,i,r){Rt.subVectors(i,t),Kt.subVectors(n,t),Ar.subVectors(e,t);let a=Rt.dot(Rt),o=Rt.dot(Kt),l=Rt.dot(Ar),c=Kt.dot(Kt),h=Kt.dot(Ar),u=a*c-o*o;if(u===0)return r.set(-2,-1,-1);let d=1/u,m=(c*l-o*h)*d,g=(a*h-o*l)*d;return r.set(1-m-g,g,m)}static containsPoint(e,t,n,i){return this.getBarycoord(e,t,n,i,Zt),Zt.x>=0&&Zt.y>=0&&Zt.x+Zt.y<=1}static getUV(e,t,n,i,r,a,o,l){return this.getBarycoord(e,t,n,i,Zt),l.set(0,0),l.addScaledVector(r,Zt.x),l.addScaledVector(a,Zt.y),l.addScaledVector(o,Zt.z),l}static isFrontFacing(e,t,n,i){return Rt.subVectors(n,t),Kt.subVectors(e,t),Rt.cross(Kt).dot(i)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,i){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[i]),this}setFromAttributeAndIndices(e,t,n,i){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,i),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Rt.subVectors(this.c,this.b),Kt.subVectors(this.a,this.b),Rt.cross(Kt).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Ft.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return Ft.getBarycoord(e,this.a,this.b,this.c,t)}getUV(e,t,n,i,r){return Ft.getUV(e,this.a,this.b,this.c,t,n,i,r)}containsPoint(e){return Ft.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Ft.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,i=this.b,r=this.c,a,o;ni.subVectors(i,n),ii.subVectors(r,n),Er.subVectors(e,n);let l=ni.dot(Er),c=ii.dot(Er);if(l<=0&&c<=0)return t.copy(n);Tr.subVectors(e,i);let h=ni.dot(Tr),u=ii.dot(Tr);if(h>=0&&u<=h)return t.copy(i);let d=l*u-h*c;if(d<=0&&l>=0&&h<=0)return a=l/(l-h),t.copy(n).addScaledVector(ni,a);Cr.subVectors(e,r);let m=ni.dot(Cr),g=ii.dot(Cr);if(g>=0&&m<=g)return t.copy(r);let p=m*c-l*g;if(p<=0&&c>=0&&g<=0)return o=c/(c-g),t.copy(n).addScaledVector(ii,o);let f=h*g-m*u;if(f<=0&&u-h>=0&&m-g>=0)return Qa.subVectors(r,i),o=(u-h)/(u-h+(m-g)),t.copy(i).addScaledVector(Qa,o);let x=1/(f+p+d);return a=p*x,o=d*x,t.copy(n).addScaledVector(ni,a).addScaledVector(ii,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},Ud=0,si=class extends Tn{constructor(){super();this.isMaterial=!0,Object.defineProperty(this,"id",{value:Ud++}),this.uuid=Mi(),this.name="",this.type="Material",this.blending=Vn,this.side=Hn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.blendSrc=ra,this.blendDst=oa,this.blendEquation=Gn,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.depthFunc=Ks,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Cd,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=or,this.stencilZFail=or,this.stencilZPass=or,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){console.warn("THREE.Material: '"+t+"' parameter is undefined.");continue}let i=this[t];if(i===void 0){console.warn("THREE."+this.type+": '"+t+"' is not a property of this material.");continue}i&&i.isColor?i.set(n):i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let n={metadata:{version:4.5,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Vn&&(n.blending=this.blending),this.side!==Hn&&(n.side=this.side),this.vertexColors&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=this.transparent),n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.stencilWrite=this.stencilWrite,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaToCoverage===!0&&(n.alphaToCoverage=this.alphaToCoverage),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=this.premultipliedAlpha),this.wireframe===!0&&(n.wireframe=this.wireframe),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=this.flatShading),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),JSON.stringify(this.userData)!=="{}"&&(n.userData=this.userData);function i(r){let a=[];for(let o in r){let l=r[o];delete l.metadata,a.push(l)}return a}if(t){let r=i(e.textures),a=i(e.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let i=t.length;n=new Array(i);for(let r=0;r!==i;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}},Lr=class extends si{constructor(e){super();this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new ze(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=Zs,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},$e=new z,ss=new Ne,Pt=class{constructor(e,t,n){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n===!0,this.usage=Fa,this.updateRange={offset:0,count:-1},this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let i=0,r=this.itemSize;i<r;i++)this.array[e+i]=t.array[n+i];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)ss.fromBufferAttribute(this,t),ss.applyMatrix3(e),this.setXY(t,ss.x,ss.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)$e.fromBufferAttribute(this,t),$e.applyMatrix3(e),this.setXYZ(t,$e.x,$e.y,$e.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)$e.fromBufferAttribute(this,t),$e.applyMatrix4(e),this.setXYZ(t,$e.x,$e.y,$e.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)$e.fromBufferAttribute(this,t),$e.applyNormalMatrix(e),this.setXYZ(t,$e.x,$e.y,$e.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)$e.fromBufferAttribute(this,t),$e.transformDirection(e),this.setXYZ(t,$e.x,$e.y,$e.z);return this}set(e,t=0){return this.array.set(e,t),this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=qi(t,this.array)),t}setX(e,t){return this.normalized&&(t=pt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=qi(t,this.array)),t}setY(e,t){return this.normalized&&(t=pt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=qi(t,this.array)),t}setZ(e,t){return this.normalized&&(t=pt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=qi(t,this.array)),t}setW(e,t){return this.normalized&&(t=pt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=pt(t,this.array),n=pt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,i){return e*=this.itemSize,this.normalized&&(t=pt(t,this.array),n=pt(n,this.array),i=pt(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this}setXYZW(e,t,n,i,r){return e*=this.itemSize,this.normalized&&(t=pt(t,this.array),n=pt(n,this.array),i=pt(i,this.array),r=pt(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Fa&&(e.usage=this.usage),(this.updateRange.offset!==0||this.updateRange.count!==-1)&&(e.updateRange=this.updateRange),e}copyColorsArray(){console.error("THREE.BufferAttribute: copyColorsArray() was removed in r144.")}copyVector2sArray(){console.error("THREE.BufferAttribute: copyVector2sArray() was removed in r144.")}copyVector3sArray(){console.error("THREE.BufferAttribute: copyVector3sArray() was removed in r144.")}copyVector4sArray(){console.error("THREE.BufferAttribute: copyVector4sArray() was removed in r144.")}};var Rr=class extends Pt{constructor(e,t,n){super(new Uint16Array(e),t,n)}};var Pr=class extends Pt{constructor(e,t,n){super(new Uint32Array(e),t,n)}};var ln=class extends Pt{constructor(e,t,n){super(new Float32Array(e),t,n)}};var zd=0,St=new Ye,Ir=new tt,ri=new z,_t=new Kn,Ai=new Kn,Qe=new z,cn=class extends Tn{constructor(){super();this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:zd++}),this.uuid=Mi(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:Infinity},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(ka(e)?Pr:Rr)(e,1):this.index=e,this}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new mt().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}let i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(e),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return St.makeRotationFromQuaternion(e),this.applyMatrix4(St),this}rotateX(e){return St.makeRotationX(e),this.applyMatrix4(St),this}rotateY(e){return St.makeRotationY(e),this.applyMatrix4(St),this}rotateZ(e){return St.makeRotationZ(e),this.applyMatrix4(St),this}translate(e,t,n){return St.makeTranslation(e,t,n),this.applyMatrix4(St),this}scale(e,t,n){return St.makeScale(e,t,n),this.applyMatrix4(St),this}lookAt(e){return Ir.lookAt(e),Ir.updateMatrix(),this.applyMatrix4(Ir.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ri).negate(),this.translate(ri.x,ri.y,ri.z),this}setFromPoints(e){let t=[];for(let n=0,i=e.length;n<i;n++){let r=e[n];t.push(r.x,r.y,r.z||0)}return this.setAttribute("position",new ln(t,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Kn);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new z(-Infinity,-Infinity,-Infinity),new z(Infinity,Infinity,Infinity));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,i=t.length;n<i;n++){let r=t[n];_t.setFromBufferAttribute(r),this.morphTargetsRelative?(Qe.addVectors(this.boundingBox.min,_t.min),this.boundingBox.expandByPoint(Qe),Qe.addVectors(this.boundingBox.max,_t.max),this.boundingBox.expandByPoint(Qe)):(this.boundingBox.expandByPoint(_t.min),this.boundingBox.expandByPoint(_t.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Qi);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new z,Infinity);return}if(e){let n=this.boundingSphere.center;if(_t.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){let o=t[r];Ai.setFromBufferAttribute(o),this.morphTargetsRelative?(Qe.addVectors(_t.min,Ai.min),_t.expandByPoint(Qe),Qe.addVectors(_t.max,Ai.max),_t.expandByPoint(Qe)):(_t.expandByPoint(Ai.min),_t.expandByPoint(Ai.max))}_t.getCenter(n);let i=0;for(let r=0,a=e.count;r<a;r++)Qe.fromBufferAttribute(e,r),i=Math.max(i,n.distanceToSquared(Qe));if(t)for(let r=0,a=t.length;r<a;r++){let o=t[r],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)Qe.fromBufferAttribute(o,c),l&&(ri.fromBufferAttribute(e,c),Qe.add(ri)),i=Math.max(i,n.distanceToSquared(Qe))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=e.array,i=t.position.array,r=t.normal.array,a=t.uv.array,o=i.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Pt(new Float32Array(4*o),4));let l=this.getAttribute("tangent").array,c=[],h=[];for(let I=0;I<o;I++)c[I]=new z,h[I]=new z;let u=new z,d=new z,m=new z,g=new Ne,p=new Ne,f=new Ne,x=new z,M=new z;function E(I,L,J){u.fromArray(i,I*3),d.fromArray(i,L*3),m.fromArray(i,J*3),g.fromArray(a,I*2),p.fromArray(a,L*2),f.fromArray(a,J*2),d.sub(u),m.sub(u),p.sub(g),f.sub(g);let V=1/(p.x*f.y-f.x*p.y);!isFinite(V)||(x.copy(d).multiplyScalar(f.y).addScaledVector(m,-p.y).multiplyScalar(V),M.copy(m).multiplyScalar(p.x).addScaledVector(d,-f.x).multiplyScalar(V),c[I].add(x),c[L].add(x),c[J].add(x),h[I].add(M),h[L].add(M),h[J].add(M))}let b=this.groups;b.length===0&&(b=[{start:0,count:n.length}]);for(let I=0,L=b.length;I<L;++I){let J=b[I],V=J.start,F=J.count;for(let T=V,C=V+F;T<C;T+=3)E(n[T+0],n[T+1],n[T+2])}let A=new z,R=new z,N=new z,_=new z;function S(I){N.fromArray(r,I*3),_.copy(N);let L=c[I];A.copy(L),A.sub(N.multiplyScalar(N.dot(L))).normalize(),R.crossVectors(_,L);let V=R.dot(h[I])<0?-1:1;l[I*4]=A.x,l[I*4+1]=A.y,l[I*4+2]=A.z,l[I*4+3]=V}for(let I=0,L=b.length;I<L;++I){let J=b[I],V=J.start,F=J.count;for(let T=V,C=V+F;T<C;T+=3)S(n[T+0]),S(n[T+1]),S(n[T+2])}}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Pt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let d=0,m=n.count;d<m;d++)n.setXYZ(d,0,0,0);let i=new z,r=new z,a=new z,o=new z,l=new z,c=new z,h=new z,u=new z;if(e)for(let d=0,m=e.count;d<m;d+=3){let g=e.getX(d+0),p=e.getX(d+1),f=e.getX(d+2);i.fromBufferAttribute(t,g),r.fromBufferAttribute(t,p),a.fromBufferAttribute(t,f),h.subVectors(a,r),u.subVectors(i,r),h.cross(u),o.fromBufferAttribute(n,g),l.fromBufferAttribute(n,p),c.fromBufferAttribute(n,f),o.add(h),l.add(h),c.add(h),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(p,l.x,l.y,l.z),n.setXYZ(f,c.x,c.y,c.z)}else for(let d=0,m=t.count;d<m;d+=3)i.fromBufferAttribute(t,d+0),r.fromBufferAttribute(t,d+1),a.fromBufferAttribute(t,d+2),h.subVectors(a,r),u.subVectors(i,r),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}merge(){return console.error("THREE.BufferGeometry.merge() has been removed. Use THREE.BufferGeometryUtils.mergeBufferGeometries() instead."),this}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Qe.fromBufferAttribute(e,t),Qe.normalize(),e.setXYZ(t,Qe.x,Qe.y,Qe.z)}toNonIndexed(){function e(o,l){let c=o.array,h=o.itemSize,u=o.normalized,d=new c.constructor(l.length*h),m=0,g=0;for(let p=0,f=l.length;p<f;p++){o.isInterleavedBufferAttribute?m=l[p]*o.data.stride+o.offset:m=l[p]*h;for(let x=0;x<h;x++)d[g++]=c[m++]}return new Pt(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new cn,n=this.index.array,i=this.attributes;for(let o in i){let l=i[o],c=e(l,n);t.setAttribute(o,c)}let r=this.morphAttributes;for(let o in r){let l=[],c=r[o];for(let h=0,u=c.length;h<u;h++){let d=c[h],m=e(d,n);l.push(m)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;let a=this.groups;for(let o=0,l=a.length;o<l;o++){let c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){let e={metadata:{version:4.5,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let l in n){let c=n[l];e.data.attributes[l]=c.toJSON(e.data)}let i={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],h=[];for(let u=0,d=c.length;u<d;u++){let m=c[u];h.push(m.toJSON(e.data))}h.length>0&&(i[l]=h,r=!0)}r&&(e.data.morphAttributes=i,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone(t));let i=e.attributes;for(let c in i){let h=i[c];this.setAttribute(c,h.clone(t))}let r=e.morphAttributes;for(let c in r){let h=[],u=r[c];for(let d=0,m=u.length;d<m;d++)h.push(u[d].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let c=0,h=a.length;c<h;c++){let u=a[c];this.addGroup(u.start,u.count,u.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,e.parameters!==void 0&&(this.parameters=Object.assign({},e.parameters)),this}dispose(){this.dispatchEvent({type:"dispose"})}},el=new Ye,oi=new qa,Dr=new Qi,hn=new z,un=new z,dn=new z,Or=new z,Nr=new z,Fr=new z,rs=new z,os=new z,as=new z,ls=new Ne,cs=new Ne,hs=new Ne,Br=new z,us=new z,xt=class extends tt{constructor(e=new cn,t=new Lr){super();this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=i.length;r<a;r++){let o=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}raycast(e,t){let n=this.geometry,i=this.material,r=this.matrixWorld;if(i===void 0||(n.boundingSphere===null&&n.computeBoundingSphere(),Dr.copy(n.boundingSphere),Dr.applyMatrix4(r),e.ray.intersectsSphere(Dr)===!1)||(el.copy(r).invert(),oi.copy(e.ray).applyMatrix4(el),n.boundingBox!==null&&oi.intersectsBox(n.boundingBox)===!1))return;let a,o=n.index,l=n.attributes.position,c=n.morphAttributes.position,h=n.morphTargetsRelative,u=n.attributes.uv,d=n.attributes.uv2,m=n.groups,g=n.drawRange;if(o!==null)if(Array.isArray(i))for(let p=0,f=m.length;p<f;p++){let x=m[p],M=i[x.materialIndex],E=Math.max(x.start,g.start),b=Math.min(o.count,Math.min(x.start+x.count,g.start+g.count));for(let A=E,R=b;A<R;A+=3){let N=o.getX(A),_=o.getX(A+1),S=o.getX(A+2);a=ds(this,M,e,oi,l,c,h,u,d,N,_,S),a&&(a.faceIndex=Math.floor(A/3),a.face.materialIndex=x.materialIndex,t.push(a))}}else{let p=Math.max(0,g.start),f=Math.min(o.count,g.start+g.count);for(let x=p,M=f;x<M;x+=3){let E=o.getX(x),b=o.getX(x+1),A=o.getX(x+2);a=ds(this,i,e,oi,l,c,h,u,d,E,b,A),a&&(a.faceIndex=Math.floor(x/3),t.push(a))}}else if(l!==void 0)if(Array.isArray(i))for(let p=0,f=m.length;p<f;p++){let x=m[p],M=i[x.materialIndex],E=Math.max(x.start,g.start),b=Math.min(l.count,Math.min(x.start+x.count,g.start+g.count));for(let A=E,R=b;A<R;A+=3){let N=A,_=A+1,S=A+2;a=ds(this,M,e,oi,l,c,h,u,d,N,_,S),a&&(a.faceIndex=Math.floor(A/3),a.face.materialIndex=x.materialIndex,t.push(a))}}else{let p=Math.max(0,g.start),f=Math.min(l.count,g.start+g.count);for(let x=p,M=f;x<M;x+=3){let E=x,b=x+1,A=x+2;a=ds(this,i,e,oi,l,c,h,u,d,E,b,A),a&&(a.faceIndex=Math.floor(x/3),t.push(a))}}}};function kd(s,e,t,n,i,r,a,o){let l;if(e.side===bt?l=n.intersectTriangle(a,r,i,!0,o):l=n.intersectTriangle(i,r,a,e.side!==en,o),l===null)return null;us.copy(o),us.applyMatrix4(s.matrixWorld);let c=t.ray.origin.distanceTo(us);return c<t.near||c>t.far?null:{distance:c,point:us.clone(),object:s}}function ds(s,e,t,n,i,r,a,o,l,c,h,u){hn.fromBufferAttribute(i,c),un.fromBufferAttribute(i,h),dn.fromBufferAttribute(i,u);let d=s.morphTargetInfluences;if(r&&d){rs.set(0,0,0),os.set(0,0,0),as.set(0,0,0);for(let g=0,p=r.length;g<p;g++){let f=d[g],x=r[g];f!==0&&(Or.fromBufferAttribute(x,c),Nr.fromBufferAttribute(x,h),Fr.fromBufferAttribute(x,u),a?(rs.addScaledVector(Or,f),os.addScaledVector(Nr,f),as.addScaledVector(Fr,f)):(rs.addScaledVector(Or.sub(hn),f),os.addScaledVector(Nr.sub(un),f),as.addScaledVector(Fr.sub(dn),f)))}hn.add(rs),un.add(os),dn.add(as)}s.isSkinnedMesh&&(s.boneTransform(c,hn),s.boneTransform(h,un),s.boneTransform(u,dn));let m=kd(s,e,t,n,hn,un,dn,Br);if(m){o&&(ls.fromBufferAttribute(o,c),cs.fromBufferAttribute(o,h),hs.fromBufferAttribute(o,u),m.uv=Ft.getUV(Br,hn,un,dn,ls,cs,hs,new Ne)),l&&(ls.fromBufferAttribute(l,c),cs.fromBufferAttribute(l,h),hs.fromBufferAttribute(l,u),m.uv2=Ft.getUV(Br,hn,un,dn,ls,cs,hs,new Ne));let g={a:c,b:h,c:u,normal:new z,materialIndex:0};Ft.getNormal(hn,un,dn,g.normal),m.face=g}return m}var Bt=class extends cn{constructor(e=1,t=1,n=1,i=1,r=1,a=1){super();this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:i,heightSegments:r,depthSegments:a};let o=this;i=Math.floor(i),r=Math.floor(r),a=Math.floor(a);let l=[],c=[],h=[],u=[],d=0,m=0;g("z","y","x",-1,-1,n,t,e,a,r,0),g("z","y","x",1,-1,n,t,-e,a,r,1),g("x","z","y",1,1,e,n,t,i,a,2),g("x","z","y",1,-1,e,n,-t,i,a,3),g("x","y","z",1,-1,e,t,n,i,r,4),g("x","y","z",-1,-1,e,t,-n,i,r,5),this.setIndex(l),this.setAttribute("position",new ln(c,3)),this.setAttribute("normal",new ln(h,3)),this.setAttribute("uv",new ln(u,2));function g(p,f,x,M,E,b,A,R,N,_,S){let I=b/N,L=A/_,J=b/2,V=A/2,F=R/2,T=N+1,C=_+1,Z=0,H=0,D=new z;for(let B=0;B<C;B++){let Q=B*L-V;for(let j=0;j<T;j++){let se=j*I-J;D[p]=se*M,D[f]=Q*E,D[x]=F,c.push(D.x,D.y,D.z),D[p]=0,D[f]=0,D[x]=R>0?1:-1,h.push(D.x,D.y,D.z),u.push(j/N),u.push(1-B/_),Z+=1}}for(let B=0;B<_;B++)for(let Q=0;Q<N;Q++){let j=d+Q+T*B,se=d+Q+T*(B+1),de=d+(Q+1)+T*(B+1),ve=d+(Q+1)+T*B;l.push(j,se,ve),l.push(se,de,ve),H+=6}o.addGroup(m,H,S),m+=H,d+=Z}}static fromJSON(e){return new Bt(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};function ai(s){let e={};for(let t in s){e[t]={};for(let n in s[t]){let i=s[t][n];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?e[t][n]=i.clone():Array.isArray(i)?e[t][n]=i.slice():e[t][n]=i}}return e}function it(s){let e={};for(let t=0;t<s.length;t++){let n=ai(s[t]);for(let i in n)e[i]=n[i]}return e}function Hd(s){let e=[];for(let t=0;t<s.length;t++)e.push(s[t].clone());return e}var Vd={clone:ai,merge:it},Gd=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Wd=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,fn=class extends si{constructor(e){super();this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Gd,this.fragmentShader=Wd,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv2:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=ai(e.uniforms),this.uniformsGroups=Hd(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let i in this.uniforms){let a=this.uniforms[i].value;a&&a.isTexture?t.uniforms[i]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[i]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[i]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[i]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[i]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[i]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[i]={type:"m4",value:a.toArray()}:t.uniforms[i]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader;let n={};for(let i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}},Ur=class extends tt{constructor(){super();this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Ye,this.projectionMatrix=new Ye,this.projectionMatrixInverse=new Ye}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(-t[8],-t[9],-t[10]).normalize()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},ht=class extends Ur{constructor(e=50,t=1,n=.1,i=2e3){super();this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=Ua*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(lr*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Ua*2*Math.atan(Math.tan(lr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(e,t,n,i,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(lr*.5*this.fov)/this.zoom,n=2*t,i=this.aspect*n,r=-.5*i,a=this.view;if(this.view!==null&&this.view.enabled){let l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*i/l,t-=a.offsetY*n/c,i*=a.width/l,n*=a.height/c}let o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+i,t,t-n,e,this.far),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},li=90,ci=1,tl=class extends tt{constructor(e,t,n){super();this.type="CubeCamera",this.renderTarget=n;let i=new ht(li,ci,e,t);i.layers=this.layers,i.up.set(0,-1,0),i.lookAt(new z(1,0,0)),this.add(i);let r=new ht(li,ci,e,t);r.layers=this.layers,r.up.set(0,-1,0),r.lookAt(new z(-1,0,0)),this.add(r);let a=new ht(li,ci,e,t);a.layers=this.layers,a.up.set(0,0,1),a.lookAt(new z(0,1,0)),this.add(a);let o=new ht(li,ci,e,t);o.layers=this.layers,o.up.set(0,0,-1),o.lookAt(new z(0,-1,0)),this.add(o);let l=new ht(li,ci,e,t);l.layers=this.layers,l.up.set(0,-1,0),l.lookAt(new z(0,0,1)),this.add(l);let c=new ht(li,ci,e,t);c.layers=this.layers,c.up.set(0,-1,0),c.lookAt(new z(0,0,-1)),this.add(c)}update(e,t){this.parent===null&&this.updateMatrixWorld();let n=this.renderTarget,[i,r,a,o,l,c]=this.children,h=e.getRenderTarget(),u=e.toneMapping,d=e.xr.enabled;e.toneMapping=Wt,e.xr.enabled=!1;let m=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0),e.render(t,i),e.setRenderTarget(n,1),e.render(t,r),e.setRenderTarget(n,2),e.render(t,a),e.setRenderTarget(n,3),e.render(t,o),e.setRenderTarget(n,4),e.render(t,l),n.texture.generateMipmaps=m,e.setRenderTarget(n,5),e.render(t,c),e.setRenderTarget(h),e.toneMapping=u,e.xr.enabled=d,n.texture.needsPMREMUpdate=!0}},zr=class extends wt{constructor(e,t,n,i,r,a,o,l,c,h){e=e!==void 0?e:[],t=t!==void 0?t:Wn,super(e,t,n,i,r,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},nl=class extends nn{constructor(e,t={}){super(e,e,t);this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},i=[n,n,n,n,n,n];this.texture=new zr(i,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.encoding),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:Mt}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.encoding=t.encoding,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},i=new Bt(5,5,5),r=new fn({name:"CubemapFromEquirect",uniforms:ai(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:bt,blending:tn});r.uniforms.tEquirect.value=t;let a=new xt(i,r),o=t.minFilter;return t.minFilter===Vi&&(t.minFilter=Mt),new tl(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t,n,i){let r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,i);e.setRenderTarget(r)}},kr=new z,qd=new z,Xd=new mt,pn=class{constructor(e=new z(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,i){return this.normal.set(e,t,n),this.constant=i,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let i=kr.subVectors(n,t).cross(qd.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(i,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(this.normal).multiplyScalar(-this.distanceToPoint(e)).add(e)}intersectLine(e,t){let n=e.delta(kr),i=this.normal.dot(n);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let r=-(e.start.dot(this.normal)+this.constant)/i;return r<0||r>1?null:t.copy(n).multiplyScalar(r).add(e.start)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||Xd.getNormalMatrix(e),i=this.coplanarPoint(kr).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},hi=new Qi,fs=new z,ps=class{constructor(e=new pn,t=new pn,n=new pn,i=new pn,r=new pn,a=new pn){this.planes=[e,t,n,i,r,a]}set(e,t,n,i,r,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(i),o[4].copy(r),o[5].copy(a),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e){let t=this.planes,n=e.elements,i=n[0],r=n[1],a=n[2],o=n[3],l=n[4],c=n[5],h=n[6],u=n[7],d=n[8],m=n[9],g=n[10],p=n[11],f=n[12],x=n[13],M=n[14],E=n[15];return t[0].setComponents(o-i,u-l,p-d,E-f).normalize(),t[1].setComponents(o+i,u+l,p+d,E+f).normalize(),t[2].setComponents(o+r,u+c,p+m,E+x).normalize(),t[3].setComponents(o-r,u-c,p-m,E-x).normalize(),t[4].setComponents(o-a,u-h,p-g,E-M).normalize(),t[5].setComponents(o+a,u+h,p+g,E+M).normalize(),this}intersectsObject(e){let t=e.geometry;return t.boundingSphere===null&&t.computeBoundingSphere(),hi.copy(t.boundingSphere).applyMatrix4(e.matrixWorld),this.intersectsSphere(hi)}intersectsSprite(e){return hi.center.set(0,0,0),hi.radius=.7071067811865476,hi.applyMatrix4(e.matrixWorld),this.intersectsSphere(hi)}intersectsSphere(e){let t=this.planes,n=e.center,i=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<i)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let i=t[n];if(fs.x=i.normal.x>0?e.max.x:e.min.x,fs.y=i.normal.y>0?e.max.y:e.min.y,fs.z=i.normal.z>0?e.max.z:e.min.z,i.distanceToPoint(fs)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};function il(){let s=null,e=!1,t=null,n=null;function i(r,a){t(r,a),n=s.requestAnimationFrame(i)}return{start:function(){e!==!0&&t!==null&&(n=s.requestAnimationFrame(i),e=!0)},stop:function(){s.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){s=r}}}function Yd(s,e){let t=e.isWebGL2,n=new WeakMap;function i(c,h){let u=c.array,d=c.usage,m=s.createBuffer();s.bindBuffer(h,m),s.bufferData(h,u,d),c.onUploadCallback();let g;if(u instanceof Float32Array)g=5126;else if(u instanceof Uint16Array)if(c.isFloat16BufferAttribute)if(t)g=5131;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else g=5123;else if(u instanceof Int16Array)g=5122;else if(u instanceof Uint32Array)g=5125;else if(u instanceof Int32Array)g=5124;else if(u instanceof Int8Array)g=5120;else if(u instanceof Uint8Array)g=5121;else if(u instanceof Uint8ClampedArray)g=5121;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+u);return{buffer:m,type:g,bytesPerElement:u.BYTES_PER_ELEMENT,version:c.version}}function r(c,h,u){let d=h.array,m=h.updateRange;s.bindBuffer(u,c),m.count===-1?s.bufferSubData(u,0,d):(t?s.bufferSubData(u,m.offset*d.BYTES_PER_ELEMENT,d,m.offset,m.count):s.bufferSubData(u,m.offset*d.BYTES_PER_ELEMENT,d.subarray(m.offset,m.offset+m.count)),m.count=-1)}function a(c){return c.isInterleavedBufferAttribute&&(c=c.data),n.get(c)}function o(c){c.isInterleavedBufferAttribute&&(c=c.data);let h=n.get(c);h&&(s.deleteBuffer(h.buffer),n.delete(c))}function l(c,h){if(c.isGLBufferAttribute){let d=n.get(c);(!d||d.version<c.version)&&n.set(c,{buffer:c.buffer,type:c.type,bytesPerElement:c.elementSize,version:c.version});return}c.isInterleavedBufferAttribute&&(c=c.data);let u=n.get(c);u===void 0?n.set(c,i(c,h)):u.version<c.version&&(r(u.buffer,c,h),u.version=c.version)}return{get:a,remove:o,update:l}}var ms=class extends cn{constructor(e=1,t=1,n=1,i=1){super();this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:i};let r=e/2,a=t/2,o=Math.floor(n),l=Math.floor(i),c=o+1,h=l+1,u=e/o,d=t/l,m=[],g=[],p=[],f=[];for(let x=0;x<h;x++){let M=x*d-a;for(let E=0;E<c;E++){let b=E*u-r;g.push(b,-M,0),p.push(0,0,1),f.push(E/o),f.push(1-x/l)}}for(let x=0;x<l;x++)for(let M=0;M<o;M++){let E=M+c*x,b=M+c*(x+1),A=M+1+c*(x+1),R=M+1+c*x;m.push(E,b,R),m.push(b,A,R)}this.setIndex(m),this.setAttribute("position",new ln(g,3)),this.setAttribute("normal",new ln(p,3)),this.setAttribute("uv",new ln(f,2))}static fromJSON(e){return new ms(e.width,e.height,e.widthSegments,e.heightSegments)}},$d=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vUv ).g;
#endif`,Kd=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Zd=`#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`,Jd=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,jd=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vUv2 ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometry.normal, geometry.viewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Qd=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,ef="vec3 transformed = vec3( position );",tf=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,nf=`vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
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
#endif`,sf=`#ifdef USE_IRIDESCENCE
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
#endif`,rf=`#ifdef USE_BUMPMAP
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
#endif`,of=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,af=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,lf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,cf=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,hf=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,uf=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,df=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,ff=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,pf=`#define PI 3.141592653589793
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
}`,mf=`#ifdef ENVMAP_TYPE_CUBE_UV
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
		vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
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
#endif`,gf=`vec3 transformedNormal = objectNormal;
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
#endif`,_f=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,xf=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vUv ).x * displacementScale + displacementBias );
#endif`,vf=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,yf=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,bf="gl_FragColor = linearToOutputTexel( gl_FragColor );",Mf=`vec4 LinearToLinear( in vec4 value ) {
	return value;
}
vec4 LinearTosRGB( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,wf=`#ifdef USE_ENVMAP
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
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 envColor = textureCubeUV( envMap, reflectVec, 0.0 );
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
#endif`,Sf=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Af=`#ifdef USE_ENVMAP
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
#endif`,Ef=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Tf=`#ifdef USE_ENVMAP
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
#endif`,Cf=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Lf=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Rf=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Pf=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,If=`#ifdef USE_GRADIENTMAP
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
}`,Df=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vUv2 );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,Of=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Nf=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Ff=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert
#define Material_LightProbeLOD( material )	(0)`,Bf=`uniform bool receiveShadow;
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
#endif`,Uf=`#if defined( USE_ENVMAP )
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
#endif`,zf=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,kf=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon
#define Material_LightProbeLOD( material )	(0)`,Hf=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Vf=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong
#define Material_LightProbeLOD( material )	(0)`,Gf=`PhysicalMaterial material;
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
#endif`,Wf=`struct PhysicalMaterial {
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
}`,qf=`
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
		directLight.color *= all( bvec2( directLight.visible, receiveShadow ) ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
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
		directLight.color *= all( bvec2( directLight.visible, receiveShadow ) ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
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
		directLight.color *= all( bvec2( directLight.visible, receiveShadow ) ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
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
#endif`,Xf=`#if defined( RE_IndirectDiffuse )
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
#endif`,Yf=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometry, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometry, material, reflectedLight );
#endif`,$f=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Kf=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Zf=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,Jf=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,jf=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Qf=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,ep=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,tp=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	uniform mat3 uvTransform;
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,np=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vUv );
	metalnessFactor *= texelMetalness.b;
#endif`,ip=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,sp=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,rp=`#ifdef USE_MORPHNORMALS
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
#endif`,op=`#ifdef USE_MORPHTARGETS
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
#endif`,ap=`#ifdef USE_MORPHTARGETS
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
#endif`,lp=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = vec3( dFdx( vViewPosition.x ), dFdx( vViewPosition.y ), dFdx( vViewPosition.z ) );
	vec3 fdy = vec3( dFdy( vViewPosition.x ), dFdy( vViewPosition.y ), dFdy( vViewPosition.z ) );
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
vec3 geometryNormal = normal;`,cp=`#ifdef OBJECTSPACE_NORMALMAP
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
#endif`,hp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,up=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,dp=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,fp=`#ifdef USE_NORMALMAP
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
#endif`,pp=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = geometryNormal;
#endif`,mp=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	#ifdef USE_TANGENT
		clearcoatNormal = normalize( vTBN * clearcoatMapN );
	#else
		clearcoatNormal = perturbNormal2Arb( - vViewPosition, clearcoatNormal, clearcoatMapN, faceDirection );
	#endif
#endif`,gp=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif`,_p=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,xp=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha + 0.1;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,vp=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,yp=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,bp=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Mp=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,wp=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Sp=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Ap=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Ep=`#if NUM_SPOT_LIGHT_COORDS > 0
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
		bvec4 inFrustumVec = bvec4 ( shadowCoord.x >= 0.0, shadowCoord.x <= 1.0, shadowCoord.y >= 0.0, shadowCoord.y <= 1.0 );
		bool inFrustum = all( inFrustumVec );
		bvec2 frustumTestVec = bvec2( inFrustum, shadowCoord.z <= 1.0 );
		bool frustumTest = all( frustumTestVec );
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
#endif`,Tp=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Cp=`#if defined( USE_SHADOWMAP ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#if NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SPOT_LIGHT_COORDS > 0 || NUM_POINT_LIGHT_SHADOWS > 0
		vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		vec4 shadowWorldPosition;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
		vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
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
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
		vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
	#endif
#endif`,Lp=`float getShadowMask() {
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
}`,Rp=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Pp=`#ifdef USE_SKINNING
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
#endif`,Ip=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Dp=`#ifdef USE_SKINNING
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
#endif`,Op=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Np=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Fp=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Bp=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Up=`#ifdef USE_TRANSMISSION
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
#endif`,zp=`#ifdef USE_TRANSMISSION
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
		if ( attenuationDistance == 0.0 ) {
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
#endif`,kp=`#if ( defined( USE_UV ) && ! defined( UVS_VERTEX_ONLY ) )
	varying vec2 vUv;
#endif`,Hp=`#ifdef USE_UV
	#ifdef UVS_VERTEX_ONLY
		vec2 vUv;
	#else
		varying vec2 vUv;
	#endif
	uniform mat3 uvTransform;
#endif`,Vp=`#ifdef USE_UV
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
#endif`,Gp=`#if defined( USE_LIGHTMAP ) || defined( USE_AOMAP )
	varying vec2 vUv2;
#endif`,Wp=`#if defined( USE_LIGHTMAP ) || defined( USE_AOMAP )
	attribute vec2 uv2;
	varying vec2 vUv2;
	uniform mat3 uv2Transform;
#endif`,qp=`#if defined( USE_LIGHTMAP ) || defined( USE_AOMAP )
	vUv2 = ( uv2Transform * vec3( uv2, 1 ) ).xy;
#endif`,Xp=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,Yp=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,$p=`uniform sampler2D t2D;
varying vec2 vUv;
void main() {
	gl_FragColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		gl_FragColor = vec4( mix( pow( gl_FragColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), gl_FragColor.rgb * 0.0773993808, vec3( lessThanEqual( gl_FragColor.rgb, vec3( 0.04045 ) ) ) ), gl_FragColor.w );
	#endif
	#include <tonemapping_fragment>
	#include <encodings_fragment>
}`,Kp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Zp=`#include <envmap_common_pars_fragment>
uniform float opacity;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	vec3 vReflect = vWorldDirection;
	#include <envmap_fragment>
	gl_FragColor = envColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <encodings_fragment>
}`,Jp=`#include <common>
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
}`,jp=`#if DEPTH_PACKING == 3200
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
}`,Qp=`#define DISTANCE
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
}`,em=`#define DISTANCE
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
}`,tm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,nm=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <encodings_fragment>
}`,im=`uniform float scale;
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
}`,sm=`uniform vec3 diffuse;
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
}`,rm=`#include <common>
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
}`,om=`uniform vec3 diffuse;
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
}`,am=`#define LAMBERT
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
}`,lm=`#define LAMBERT
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
}`,cm=`#define MATCAP
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
}`,hm=`#define MATCAP
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
}`,um=`#define NORMAL
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
}`,dm=`#define NORMAL
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
}`,fm=`#define PHONG
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
}`,pm=`#define PHONG
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
}`,mm=`#define STANDARD
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
}`,gm=`#define STANDARD
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
}`,_m=`#define TOON
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
}`,xm=`#define TOON
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
}`,vm=`uniform float size;
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
}`,ym=`uniform vec3 diffuse;
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
}`,bm=`#include <common>
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
}`,Mm=`uniform vec3 color;
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
}`,wm=`uniform float rotation;
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
}`,Sm=`uniform vec3 diffuse;
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
}`,Ee={alphamap_fragment:$d,alphamap_pars_fragment:Kd,alphatest_fragment:Zd,alphatest_pars_fragment:Jd,aomap_fragment:jd,aomap_pars_fragment:Qd,begin_vertex:ef,beginnormal_vertex:tf,bsdfs:nf,iridescence_fragment:sf,bumpmap_pars_fragment:rf,clipping_planes_fragment:of,clipping_planes_pars_fragment:af,clipping_planes_pars_vertex:lf,clipping_planes_vertex:cf,color_fragment:hf,color_pars_fragment:uf,color_pars_vertex:df,color_vertex:ff,common:pf,cube_uv_reflection_fragment:mf,defaultnormal_vertex:gf,displacementmap_pars_vertex:_f,displacementmap_vertex:xf,emissivemap_fragment:vf,emissivemap_pars_fragment:yf,encodings_fragment:bf,encodings_pars_fragment:Mf,envmap_fragment:wf,envmap_common_pars_fragment:Sf,envmap_pars_fragment:Af,envmap_pars_vertex:Ef,envmap_physical_pars_fragment:Uf,envmap_vertex:Tf,fog_vertex:Cf,fog_pars_vertex:Lf,fog_fragment:Rf,fog_pars_fragment:Pf,gradientmap_pars_fragment:If,lightmap_fragment:Df,lightmap_pars_fragment:Of,lights_lambert_fragment:Nf,lights_lambert_pars_fragment:Ff,lights_pars_begin:Bf,lights_toon_fragment:zf,lights_toon_pars_fragment:kf,lights_phong_fragment:Hf,lights_phong_pars_fragment:Vf,lights_physical_fragment:Gf,lights_physical_pars_fragment:Wf,lights_fragment_begin:qf,lights_fragment_maps:Xf,lights_fragment_end:Yf,logdepthbuf_fragment:$f,logdepthbuf_pars_fragment:Kf,logdepthbuf_pars_vertex:Zf,logdepthbuf_vertex:Jf,map_fragment:jf,map_pars_fragment:Qf,map_particle_fragment:ep,map_particle_pars_fragment:tp,metalnessmap_fragment:np,metalnessmap_pars_fragment:ip,morphcolor_vertex:sp,morphnormal_vertex:rp,morphtarget_pars_vertex:op,morphtarget_vertex:ap,normal_fragment_begin:lp,normal_fragment_maps:cp,normal_pars_fragment:hp,normal_pars_vertex:up,normal_vertex:dp,normalmap_pars_fragment:fp,clearcoat_normal_fragment_begin:pp,clearcoat_normal_fragment_maps:mp,clearcoat_pars_fragment:gp,iridescence_pars_fragment:_p,output_fragment:xp,packing:vp,premultiplied_alpha_fragment:yp,project_vertex:bp,dithering_fragment:Mp,dithering_pars_fragment:wp,roughnessmap_fragment:Sp,roughnessmap_pars_fragment:Ap,shadowmap_pars_fragment:Ep,shadowmap_pars_vertex:Tp,shadowmap_vertex:Cp,shadowmask_pars_fragment:Lp,skinbase_vertex:Rp,skinning_pars_vertex:Pp,skinning_vertex:Ip,skinnormal_vertex:Dp,specularmap_fragment:Op,specularmap_pars_fragment:Np,tonemapping_fragment:Fp,tonemapping_pars_fragment:Bp,transmission_fragment:Up,transmission_pars_fragment:zp,uv_pars_fragment:kp,uv_pars_vertex:Hp,uv_vertex:Vp,uv2_pars_fragment:Gp,uv2_pars_vertex:Wp,uv2_vertex:qp,worldpos_vertex:Xp,background_vert:Yp,background_frag:$p,cube_vert:Kp,cube_frag:Zp,depth_vert:Jp,depth_frag:jp,distanceRGBA_vert:Qp,distanceRGBA_frag:em,equirect_vert:tm,equirect_frag:nm,linedashed_vert:im,linedashed_frag:sm,meshbasic_vert:rm,meshbasic_frag:om,meshlambert_vert:am,meshlambert_frag:lm,meshmatcap_vert:cm,meshmatcap_frag:hm,meshnormal_vert:um,meshnormal_frag:dm,meshphong_vert:fm,meshphong_frag:pm,meshphysical_vert:mm,meshphysical_frag:gm,meshtoon_vert:_m,meshtoon_frag:xm,points_vert:vm,points_frag:ym,shadow_vert:bm,shadow_frag:Mm,sprite_vert:wm,sprite_frag:Sm},ie={common:{diffuse:{value:new ze(16777215)},opacity:{value:1},map:{value:null},uvTransform:{value:new mt},uv2Transform:{value:new mt},alphaMap:{value:null},alphaTest:{value:0}},specularmap:{specularMap:{value:null}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1}},emissivemap:{emissiveMap:{value:null}},bumpmap:{bumpMap:{value:null},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalScale:{value:new Ne(1,1)}},displacementmap:{displacementMap:{value:null},displacementScale:{value:1},displacementBias:{value:0}},roughnessmap:{roughnessMap:{value:null}},metalnessmap:{metalnessMap:{value:null}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new ze(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new ze(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaTest:{value:0},uvTransform:{value:new mt}},sprite:{diffuse:{value:new ze(16777215)},opacity:{value:1},center:{value:new Ne(.5,.5)},rotation:{value:0},map:{value:null},alphaMap:{value:null},alphaTest:{value:0},uvTransform:{value:new mt}}},Ut={basic:{uniforms:it([ie.common,ie.specularmap,ie.envmap,ie.aomap,ie.lightmap,ie.fog]),vertexShader:Ee.meshbasic_vert,fragmentShader:Ee.meshbasic_frag},lambert:{uniforms:it([ie.common,ie.specularmap,ie.envmap,ie.aomap,ie.lightmap,ie.emissivemap,ie.bumpmap,ie.normalmap,ie.displacementmap,ie.fog,ie.lights,{emissive:{value:new ze(0)}}]),vertexShader:Ee.meshlambert_vert,fragmentShader:Ee.meshlambert_frag},phong:{uniforms:it([ie.common,ie.specularmap,ie.envmap,ie.aomap,ie.lightmap,ie.emissivemap,ie.bumpmap,ie.normalmap,ie.displacementmap,ie.fog,ie.lights,{emissive:{value:new ze(0)},specular:{value:new ze(1118481)},shininess:{value:30}}]),vertexShader:Ee.meshphong_vert,fragmentShader:Ee.meshphong_frag},standard:{uniforms:it([ie.common,ie.envmap,ie.aomap,ie.lightmap,ie.emissivemap,ie.bumpmap,ie.normalmap,ie.displacementmap,ie.roughnessmap,ie.metalnessmap,ie.fog,ie.lights,{emissive:{value:new ze(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ee.meshphysical_vert,fragmentShader:Ee.meshphysical_frag},toon:{uniforms:it([ie.common,ie.aomap,ie.lightmap,ie.emissivemap,ie.bumpmap,ie.normalmap,ie.displacementmap,ie.gradientmap,ie.fog,ie.lights,{emissive:{value:new ze(0)}}]),vertexShader:Ee.meshtoon_vert,fragmentShader:Ee.meshtoon_frag},matcap:{uniforms:it([ie.common,ie.bumpmap,ie.normalmap,ie.displacementmap,ie.fog,{matcap:{value:null}}]),vertexShader:Ee.meshmatcap_vert,fragmentShader:Ee.meshmatcap_frag},points:{uniforms:it([ie.points,ie.fog]),vertexShader:Ee.points_vert,fragmentShader:Ee.points_frag},dashed:{uniforms:it([ie.common,ie.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ee.linedashed_vert,fragmentShader:Ee.linedashed_frag},depth:{uniforms:it([ie.common,ie.displacementmap]),vertexShader:Ee.depth_vert,fragmentShader:Ee.depth_frag},normal:{uniforms:it([ie.common,ie.bumpmap,ie.normalmap,ie.displacementmap,{opacity:{value:1}}]),vertexShader:Ee.meshnormal_vert,fragmentShader:Ee.meshnormal_frag},sprite:{uniforms:it([ie.sprite,ie.fog]),vertexShader:Ee.sprite_vert,fragmentShader:Ee.sprite_frag},background:{uniforms:{uvTransform:{value:new mt},t2D:{value:null}},vertexShader:Ee.background_vert,fragmentShader:Ee.background_frag},cube:{uniforms:it([ie.envmap,{opacity:{value:1}}]),vertexShader:Ee.cube_vert,fragmentShader:Ee.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ee.equirect_vert,fragmentShader:Ee.equirect_frag},distanceRGBA:{uniforms:it([ie.common,ie.displacementmap,{referencePosition:{value:new z},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ee.distanceRGBA_vert,fragmentShader:Ee.distanceRGBA_frag},shadow:{uniforms:it([ie.lights,ie.fog,{color:{value:new ze(0)},opacity:{value:1}}]),vertexShader:Ee.shadow_vert,fragmentShader:Ee.shadow_frag}};Ut.physical={uniforms:it([Ut.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatNormalScale:{value:new Ne(1,1)},clearcoatNormalMap:{value:null},iridescence:{value:0},iridescenceMap:{value:null},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},sheen:{value:0},sheenColor:{value:new ze(0)},sheenColorMap:{value:null},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},transmission:{value:0},transmissionMap:{value:null},transmissionSamplerSize:{value:new Ne},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},attenuationDistance:{value:0},attenuationColor:{value:new ze(0)},specularIntensity:{value:1},specularIntensityMap:{value:null},specularColor:{value:new ze(1,1,1)},specularColorMap:{value:null}}]),vertexShader:Ee.meshphysical_vert,fragmentShader:Ee.meshphysical_frag};function Am(s,e,t,n,i,r){let a=new ze(0),o=i===!0?0:1,l,c,h=null,u=0,d=null;function m(p,f){let x=!1,M=f.isScene===!0?f.background:null;M&&M.isTexture&&(M=e.get(M));let E=s.xr,b=E.getSession&&E.getSession();b&&b.environmentBlendMode==="additive"&&(M=null),M===null?g(a,o):M&&M.isColor&&(g(M,1),x=!0),(s.autoClear||x)&&s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil),M&&(M.isCubeTexture||M.mapping===Hi)?(c===void 0&&(c=new xt(new Bt(1,1,1),new fn({name:"BackgroundCubeMaterial",uniforms:ai(Ut.cube.uniforms),vertexShader:Ut.cube.vertexShader,fragmentShader:Ut.cube.fragmentShader,side:bt,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(A,R,N){this.matrixWorld.copyPosition(N.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(c)),c.material.uniforms.envMap.value=M,c.material.uniforms.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,(h!==M||u!==M.version||d!==s.toneMapping)&&(c.material.needsUpdate=!0,h=M,u=M.version,d=s.toneMapping),c.layers.enableAll(),p.unshift(c,c.geometry,c.material,0,0,null)):M&&M.isTexture&&(l===void 0&&(l=new xt(new ms(2,2),new fn({name:"BackgroundMaterial",uniforms:ai(Ut.background.uniforms),vertexShader:Ut.background.vertexShader,fragmentShader:Ut.background.fragmentShader,side:Hn,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(l)),l.material.uniforms.t2D.value=M,M.matrixAutoUpdate===!0&&M.updateMatrix(),l.material.uniforms.uvTransform.value.copy(M.matrix),(h!==M||u!==M.version||d!==s.toneMapping)&&(l.material.needsUpdate=!0,h=M,u=M.version,d=s.toneMapping),l.layers.enableAll(),p.unshift(l,l.geometry,l.material,0,0,null))}function g(p,f){t.buffers.color.setClear(p.r,p.g,p.b,f,r)}return{getClearColor:function(){return a},setClearColor:function(p,f=1){a.set(p),o=f,g(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(p){o=p,g(a,o)},render:m}}function Em(s,e,t,n){let i=s.getParameter(34921),r=n.isWebGL2?null:e.get("OES_vertex_array_object"),a=n.isWebGL2||r!==null,o={},l=f(null),c=l,h=!1;function u(F,T,C,Z,H){let D=!1;if(a){let B=p(Z,C,T);c!==B&&(c=B,m(c.object)),D=x(F,Z,C,H),D&&M(F,Z,C,H)}else{let B=T.wireframe===!0;(c.geometry!==Z.id||c.program!==C.id||c.wireframe!==B)&&(c.geometry=Z.id,c.program=C.id,c.wireframe=B,D=!0)}H!==null&&t.update(H,34963),(D||h)&&(h=!1,_(F,T,C,Z),H!==null&&s.bindBuffer(34963,t.get(H).buffer))}function d(){return n.isWebGL2?s.createVertexArray():r.createVertexArrayOES()}function m(F){return n.isWebGL2?s.bindVertexArray(F):r.bindVertexArrayOES(F)}function g(F){return n.isWebGL2?s.deleteVertexArray(F):r.deleteVertexArrayOES(F)}function p(F,T,C){let Z=C.wireframe===!0,H=o[F.id];H===void 0&&(H={},o[F.id]=H);let D=H[T.id];D===void 0&&(D={},H[T.id]=D);let B=D[Z];return B===void 0&&(B=f(d()),D[Z]=B),B}function f(F){let T=[],C=[],Z=[];for(let H=0;H<i;H++)T[H]=0,C[H]=0,Z[H]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:T,enabledAttributes:C,attributeDivisors:Z,object:F,attributes:{},index:null}}function x(F,T,C,Z){let H=c.attributes,D=T.attributes,B=0,Q=C.getAttributes();for(let j in Q)if(Q[j].location>=0){let de=H[j],ve=D[j];if(ve===void 0&&(j==="instanceMatrix"&&F.instanceMatrix&&(ve=F.instanceMatrix),j==="instanceColor"&&F.instanceColor&&(ve=F.instanceColor)),de===void 0||de.attribute!==ve||ve&&de.data!==ve.data)return!0;B++}return c.attributesNum!==B||c.index!==Z}function M(F,T,C,Z){let H={},D=T.attributes,B=0,Q=C.getAttributes();for(let j in Q)if(Q[j].location>=0){let de=D[j];de===void 0&&(j==="instanceMatrix"&&F.instanceMatrix&&(de=F.instanceMatrix),j==="instanceColor"&&F.instanceColor&&(de=F.instanceColor));let ve={};ve.attribute=de,de&&de.data&&(ve.data=de.data),H[j]=ve,B++}c.attributes=H,c.attributesNum=B,c.index=Z}function E(){let F=c.newAttributes;for(let T=0,C=F.length;T<C;T++)F[T]=0}function b(F){A(F,0)}function A(F,T){let C=c.newAttributes,Z=c.enabledAttributes,H=c.attributeDivisors;C[F]=1,Z[F]===0&&(s.enableVertexAttribArray(F),Z[F]=1),H[F]!==T&&((n.isWebGL2?s:e.get("ANGLE_instanced_arrays"))[n.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](F,T),H[F]=T)}function R(){let F=c.newAttributes,T=c.enabledAttributes;for(let C=0,Z=T.length;C<Z;C++)T[C]!==F[C]&&(s.disableVertexAttribArray(C),T[C]=0)}function N(F,T,C,Z,H,D){n.isWebGL2===!0&&(C===5124||C===5125)?s.vertexAttribIPointer(F,T,C,H,D):s.vertexAttribPointer(F,T,C,Z,H,D)}function _(F,T,C,Z){if(n.isWebGL2===!1&&(F.isInstancedMesh||Z.isInstancedBufferGeometry)&&e.get("ANGLE_instanced_arrays")===null)return;E();let H=Z.attributes,D=C.getAttributes(),B=T.defaultAttributeValues;for(let Q in D){let j=D[Q];if(j.location>=0){let se=H[Q];if(se===void 0&&(Q==="instanceMatrix"&&F.instanceMatrix&&(se=F.instanceMatrix),Q==="instanceColor"&&F.instanceColor&&(se=F.instanceColor)),se!==void 0){let de=se.normalized,ve=se.itemSize,k=t.get(se);if(k===void 0)continue;let Te=k.buffer,ye=k.type,$=k.bytesPerElement;if(se.isInterleavedBufferAttribute){let ee=se.data,K=ee.stride,re=se.offset;if(ee.isInstancedInterleavedBuffer){for(let ae=0;ae<j.locationSize;ae++)A(j.location+ae,ee.meshPerAttribute);F.isInstancedMesh!==!0&&Z._maxInstanceCount===void 0&&(Z._maxInstanceCount=ee.meshPerAttribute*ee.count)}else for(let ae=0;ae<j.locationSize;ae++)b(j.location+ae);s.bindBuffer(34962,Te);for(let ae=0;ae<j.locationSize;ae++)N(j.location+ae,ve/j.locationSize,ye,de,K*$,(re+ve/j.locationSize*ae)*$)}else{if(se.isInstancedBufferAttribute){for(let ee=0;ee<j.locationSize;ee++)A(j.location+ee,se.meshPerAttribute);F.isInstancedMesh!==!0&&Z._maxInstanceCount===void 0&&(Z._maxInstanceCount=se.meshPerAttribute*se.count)}else for(let ee=0;ee<j.locationSize;ee++)b(j.location+ee);s.bindBuffer(34962,Te);for(let ee=0;ee<j.locationSize;ee++)N(j.location+ee,ve/j.locationSize,ye,de,ve*$,ve/j.locationSize*ee*$)}}else if(B!==void 0){let de=B[Q];if(de!==void 0)switch(de.length){case 2:s.vertexAttrib2fv(j.location,de);break;case 3:s.vertexAttrib3fv(j.location,de);break;case 4:s.vertexAttrib4fv(j.location,de);break;default:s.vertexAttrib1fv(j.location,de)}}}}R()}function S(){J();for(let F in o){let T=o[F];for(let C in T){let Z=T[C];for(let H in Z)g(Z[H].object),delete Z[H];delete T[C]}delete o[F]}}function I(F){if(o[F.id]===void 0)return;let T=o[F.id];for(let C in T){let Z=T[C];for(let H in Z)g(Z[H].object),delete Z[H];delete T[C]}delete o[F.id]}function L(F){for(let T in o){let C=o[T];if(C[F.id]===void 0)continue;let Z=C[F.id];for(let H in Z)g(Z[H].object),delete Z[H];delete C[F.id]}}function J(){V(),h=!0,c!==l&&(c=l,m(c.object))}function V(){l.geometry=null,l.program=null,l.wireframe=!1}return{setup:u,reset:J,resetDefaultState:V,dispose:S,releaseStatesOfGeometry:I,releaseStatesOfProgram:L,initAttributes:E,enableAttribute:b,disableUnusedAttributes:R}}function Tm(s,e,t,n){let i=n.isWebGL2,r;function a(c){r=c}function o(c,h){s.drawArrays(r,c,h),t.update(h,r,1)}function l(c,h,u){if(u===0)return;let d,m;if(i)d=s,m="drawArraysInstanced";else if(d=e.get("ANGLE_instanced_arrays"),m="drawArraysInstancedANGLE",d===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}d[m](r,c,h,u),t.update(h,r,u)}this.setMode=a,this.render=o,this.renderInstances=l}function Cm(s,e,t){let n;function i(){if(n!==void 0)return n;if(e.has("EXT_texture_filter_anisotropic")===!0){let N=e.get("EXT_texture_filter_anisotropic");n=s.getParameter(N.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n}function r(N){if(N==="highp"){if(s.getShaderPrecisionFormat(35633,36338).precision>0&&s.getShaderPrecisionFormat(35632,36338).precision>0)return"highp";N="mediump"}return N==="mediump"&&s.getShaderPrecisionFormat(35633,36337).precision>0&&s.getShaderPrecisionFormat(35632,36337).precision>0?"mediump":"lowp"}let a=typeof WebGL2RenderingContext!="undefined"&&s instanceof WebGL2RenderingContext||typeof WebGL2ComputeRenderingContext!="undefined"&&s instanceof WebGL2ComputeRenderingContext,o=t.precision!==void 0?t.precision:"highp",l=r(o);l!==o&&(console.warn("THREE.WebGLRenderer:",o,"not supported, using",l,"instead."),o=l);let c=a||e.has("WEBGL_draw_buffers"),h=t.logarithmicDepthBuffer===!0,u=s.getParameter(34930),d=s.getParameter(35660),m=s.getParameter(3379),g=s.getParameter(34076),p=s.getParameter(34921),f=s.getParameter(36347),x=s.getParameter(36348),M=s.getParameter(36349),E=d>0,b=a||e.has("OES_texture_float"),A=E&&b,R=a?s.getParameter(36183):0;return{isWebGL2:a,drawBuffers:c,getMaxAnisotropy:i,getMaxPrecision:r,precision:o,logarithmicDepthBuffer:h,maxTextures:u,maxVertexTextures:d,maxTextureSize:m,maxCubemapSize:g,maxAttributes:p,maxVertexUniforms:f,maxVaryings:x,maxFragmentUniforms:M,vertexTextures:E,floatFragmentTextures:b,floatVertexTextures:A,maxSamples:R}}function Lm(s){let e=this,t=null,n=0,i=!1,r=!1,a=new pn,o=new mt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d,m){let g=u.length!==0||d||n!==0||i;return i=d,t=h(u,m,0),n=u.length,g},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1,c()},this.setState=function(u,d,m){let g=u.clippingPlanes,p=u.clipIntersection,f=u.clipShadows,x=s.get(u);if(!i||g===null||g.length===0||r&&!f)r?h(null):c();else{let M=r?0:n,E=M*4,b=x.clippingState||null;l.value=b,b=h(g,d,E,m);for(let A=0;A!==E;++A)b[A]=t[A];x.clippingState=b,this.numIntersection=p?this.numPlanes:0,this.numPlanes+=M}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(u,d,m,g){let p=u!==null?u.length:0,f=null;if(p!==0){if(f=l.value,g!==!0||f===null){let x=m+p*4,M=d.matrixWorldInverse;o.getNormalMatrix(M),(f===null||f.length<x)&&(f=new Float32Array(x));for(let E=0,b=m;E!==p;++E,b+=4)a.copy(u[E]).applyMatrix4(M,o),a.normal.toArray(f,b),f[b+3]=a.constant}l.value=f,l.needsUpdate=!0}return e.numPlanes=p,e.numIntersection=0,f}}function Rm(s){let e=new WeakMap;function t(a,o){return o===Js?a.mapping=Wn:o===js&&(a.mapping=qn),a}function n(a){if(a&&a.isTexture&&a.isRenderTargetTexture===!1){let o=a.mapping;if(o===Js||o===js)if(e.has(a)){let l=e.get(a).texture;return t(l,a.mapping)}else{let l=a.image;if(l&&l.height>0){let c=new nl(l.height/2);return c.fromEquirectangularTexture(s,a),e.set(a,c),a.addEventListener("dispose",i),t(c.texture,a.mapping)}else return null}}return a}function i(a){let o=a.target;o.removeEventListener("dispose",i);let l=e.get(o);l!==void 0&&(e.delete(o),l.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}var Hr=class extends Ur{constructor(e=-1,t=1,n=1,i=-1,r=.1,a=2e3){super();this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=i,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,i,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2,r=n-e,a=n+e,o=i+t,l=i-t;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},ui=4,sl=[.125,.215,.35,.446,.526,.582],Dn=20,Vr=new Hr,rl=new ze,Gr=null,On=(1+Math.sqrt(5))/2,di=1/On,ol=[new z(1,1,1),new z(-1,1,1),new z(1,1,-1),new z(-1,1,-1),new z(0,On,di),new z(0,On,-di),new z(di,0,On),new z(-di,0,On),new z(On,di,0),new z(-On,di,0)],Wr=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,i=100){Gr=this._renderer.getRenderTarget(),this._setSize(256);let r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(e,n,i,r),t>0&&this._blur(r,0,0,t),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=cl(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=ll(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Gr),e.scissorTest=!1,gs(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Wn||e.mapping===qn?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Gr=this._renderer.getRenderTarget();let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,16*7),t=4*this._cubeSize,n={magFilter:Mt,minFilter:Mt,generateMipmaps:!1,type:bi,format:Nt,encoding:An,depthBuffer:!1},i=al(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=al(e,t,n);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Pm(r)),this._blurMaterial=Im(r,e,t)}return i}_compileMaterial(e){let t=new xt(this._lodPlanes[0],e);this._renderer.compile(t,Vr)}_sceneToCubeUV(e,t,n,i){let r=90,a=1,o=new ht(r,a,t,n),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,d=h.toneMapping;h.getClearColor(rl),h.toneMapping=Wt,h.autoClear=!1;let m=new Lr({name:"PMREM.Background",side:bt,depthWrite:!1,depthTest:!1}),g=new xt(new Bt,m),p=!1,f=e.background;f?f.isColor&&(m.color.copy(f),e.background=null,p=!0):(m.color.copy(rl),p=!0);for(let x=0;x<6;x++){let M=x%3;M===0?(o.up.set(0,l[x],0),o.lookAt(c[x],0,0)):M===1?(o.up.set(0,0,l[x]),o.lookAt(0,c[x],0)):(o.up.set(0,l[x],0),o.lookAt(0,0,c[x]));let E=this._cubeSize;gs(i,M*E,x>2?E:0,E,E),h.setRenderTarget(i),p&&h.render(g,o),h.render(e,o)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=d,h.autoClear=u,e.background=f}_textureToCubeUV(e,t){let n=this._renderer,i=e.mapping===Wn||e.mapping===qn;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=cl()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=ll());let r=i?this._cubemapMaterial:this._equirectMaterial,a=new xt(this._lodPlanes[0],r),o=r.uniforms;o.envMap.value=e;let l=this._cubeSize;gs(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(a,Vr)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;for(let i=1;i<this._lodPlanes.length;i++){let r=Math.sqrt(this._sigmas[i]*this._sigmas[i]-this._sigmas[i-1]*this._sigmas[i-1]),a=ol[(i-1)%ol.length];this._blur(e,i-1,i,r,a)}t.autoClear=n}_blur(e,t,n,i,r){let a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,i,"latitudinal",r),this._halfBlur(a,e,n,n,i,"longitudinal",r)}_halfBlur(e,t,n,i,r,a,o){let l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let h=3,u=new xt(this._lodPlanes[i],c),d=c.uniforms,m=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*m):2*Math.PI/(2*Dn-1),p=r/g,f=isFinite(r)?1+Math.floor(h*p):Dn;f>Dn&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${f} samples when the maximum is set to ${Dn}`);let x=[],M=0;for(let N=0;N<Dn;++N){let _=N/p,S=Math.exp(-_*_/2);x.push(S),N===0?M+=S:N<f&&(M+=2*S)}for(let N=0;N<x.length;N++)x[N]=x[N]/M;d.envMap.value=e.texture,d.samples.value=f,d.weights.value=x,d.latitudinal.value=a==="latitudinal",o&&(d.poleAxis.value=o);let{_lodMax:E}=this;d.dTheta.value=g,d.mipInt.value=E-n;let b=this._sizeLods[i],A=3*b*(i>E-ui?i-E+ui:0),R=4*(this._cubeSize-b);gs(t,A,R,3*b,2*b),l.setRenderTarget(t),l.render(u,Vr)}};function Pm(s){let e=[],t=[],n=[],i=s,r=s-ui+1+sl.length;for(let a=0;a<r;a++){let o=Math.pow(2,i);t.push(o);let l=1/o;a>s-ui?l=sl[a-s+ui-1]:a===0&&(l=0),n.push(l);let c=1/(o-2),h=-c,u=1+c,d=[h,h,u,h,u,u,h,h,u,u,h,u],m=6,g=6,p=3,f=2,x=1,M=new Float32Array(p*g*m),E=new Float32Array(f*g*m),b=new Float32Array(x*g*m);for(let R=0;R<m;R++){let N=R%3*2/3-1,_=R>2?0:-1,S=[N,_,0,N+2/3,_,0,N+2/3,_+1,0,N,_,0,N+2/3,_+1,0,N,_+1,0];M.set(S,p*g*R),E.set(d,f*g*R);let I=[R,R,R,R,R,R];b.set(I,x*g*R)}let A=new cn;A.setAttribute("position",new Pt(M,p)),A.setAttribute("uv",new Pt(E,f)),A.setAttribute("faceIndex",new Pt(b,x)),e.push(A),i>ui&&i--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function al(s,e,t){let n=new nn(s,e,t);return n.texture.mapping=Hi,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function gs(s,e,t,n,i){s.viewport.set(e,t,n,i),s.scissor.set(e,t,n,i)}function Im(s,e,t){let n=new Float32Array(Dn),i=new z(0,1,0);return new fn({name:"SphericalGaussianBlur",defines:{n:Dn,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:qr(),fragmentShader:`

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
		`,blending:tn,depthTest:!1,depthWrite:!1})}function ll(){return new fn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:qr(),fragmentShader:`

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
		`,blending:tn,depthTest:!1,depthWrite:!1})}function cl(){return new fn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:qr(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:tn,depthTest:!1,depthWrite:!1})}function qr(){return`

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
	`}function Dm(s){let e=new WeakMap,t=null;function n(o){if(o&&o.isTexture){let l=o.mapping,c=l===Js||l===js,h=l===Wn||l===qn;if(c||h)if(o.isRenderTargetTexture&&o.needsPMREMUpdate===!0){o.needsPMREMUpdate=!1;let u=e.get(o);return t===null&&(t=new Wr(s)),u=c?t.fromEquirectangular(o,u):t.fromCubemap(o,u),e.set(o,u),u.texture}else{if(e.has(o))return e.get(o).texture;{let u=o.image;if(c&&u&&u.height>0||h&&u&&i(u)){t===null&&(t=new Wr(s));let d=c?t.fromEquirectangular(o):t.fromCubemap(o);return e.set(o,d),o.addEventListener("dispose",r),d.texture}else return null}}}return o}function i(o){let l=0,c=6;for(let h=0;h<c;h++)o[h]!==void 0&&l++;return l===c}function r(o){let l=o.target;l.removeEventListener("dispose",r);let c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function a(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:a}}function Om(s){let e={};function t(n){if(e[n]!==void 0)return e[n];let i;switch(n){case"WEBGL_depth_texture":i=s.getExtension("WEBGL_depth_texture")||s.getExtension("MOZ_WEBGL_depth_texture")||s.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":i=s.getExtension("EXT_texture_filter_anisotropic")||s.getExtension("MOZ_EXT_texture_filter_anisotropic")||s.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":i=s.getExtension("WEBGL_compressed_texture_s3tc")||s.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":i=s.getExtension("WEBGL_compressed_texture_pvrtc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:i=s.getExtension(n)}return e[n]=i,i}return{has:function(n){return t(n)!==null},init:function(n){n.isWebGL2?t("EXT_color_buffer_float"):(t("WEBGL_depth_texture"),t("OES_texture_float"),t("OES_texture_half_float"),t("OES_texture_half_float_linear"),t("OES_standard_derivatives"),t("OES_element_index_uint"),t("OES_vertex_array_object"),t("ANGLE_instanced_arrays")),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture")},get:function(n){let i=t(n);return i===null&&console.warn("THREE.WebGLRenderer: "+n+" extension not supported."),i}}}function Nm(s,e,t,n){let i={},r=new WeakMap;function a(u){let d=u.target;d.index!==null&&e.remove(d.index);for(let g in d.attributes)e.remove(d.attributes[g]);d.removeEventListener("dispose",a),delete i[d.id];let m=r.get(d);m&&(e.remove(m),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,t.memory.geometries--}function o(u,d){return i[d.id]===!0||(d.addEventListener("dispose",a),i[d.id]=!0,t.memory.geometries++),d}function l(u){let d=u.attributes;for(let g in d)e.update(d[g],34962);let m=u.morphAttributes;for(let g in m){let p=m[g];for(let f=0,x=p.length;f<x;f++)e.update(p[f],34962)}}function c(u){let d=[],m=u.index,g=u.attributes.position,p=0;if(m!==null){let M=m.array;p=m.version;for(let E=0,b=M.length;E<b;E+=3){let A=M[E+0],R=M[E+1],N=M[E+2];d.push(A,R,R,N,N,A)}}else{let M=g.array;p=g.version;for(let E=0,b=M.length/3-1;E<b;E+=3){let A=E+0,R=E+1,N=E+2;d.push(A,R,R,N,N,A)}}let f=new(ka(d)?Pr:Rr)(d,1);f.version=p;let x=r.get(u);x&&e.remove(x),r.set(u,f)}function h(u){let d=r.get(u);if(d){let m=u.index;m!==null&&d.version<m.version&&c(u)}else c(u);return r.get(u)}return{get:o,update:l,getWireframeAttribute:h}}function Fm(s,e,t,n){let i=n.isWebGL2,r;function a(d){r=d}let o,l;function c(d){o=d.type,l=d.bytesPerElement}function h(d,m){s.drawElements(r,m,o,d*l),t.update(m,r,1)}function u(d,m,g){if(g===0)return;let p,f;if(i)p=s,f="drawElementsInstanced";else if(p=e.get("ANGLE_instanced_arrays"),f="drawElementsInstancedANGLE",p===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}p[f](r,m,o,d*l,g),t.update(m,r,g)}this.setMode=a,this.setIndex=c,this.render=h,this.renderInstances=u}function Bm(s){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(t.calls++,a){case 4:t.triangles+=o*(r/3);break;case 1:t.lines+=o*(r/2);break;case 3:t.lines+=o*(r-1);break;case 2:t.lines+=o*r;break;case 0:t.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function i(){t.frame++,t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:i,update:n}}function Um(s,e){return s[0]-e[0]}function zm(s,e){return Math.abs(e[1])-Math.abs(s[1])}function km(s,e,t){let n={},i=new Float32Array(8),r=new WeakMap,a=new Je,o=[];for(let c=0;c<8;c++)o[c]=[c,0];function l(c,h,u,d){let m=c.morphTargetInfluences;if(e.isWebGL2===!0){let g=h.morphAttributes.position||h.morphAttributes.normal||h.morphAttributes.color,p=g!==void 0?g.length:0,f=r.get(h);if(f===void 0||f.count!==p){let T=function(){V.dispose(),r.delete(h),h.removeEventListener("dispose",T)};f!==void 0&&f.texture.dispose();let E=h.morphAttributes.position!==void 0,b=h.morphAttributes.normal!==void 0,A=h.morphAttributes.color!==void 0,R=h.morphAttributes.position||[],N=h.morphAttributes.normal||[],_=h.morphAttributes.color||[],S=0;E===!0&&(S=1),b===!0&&(S=2),A===!0&&(S=3);let I=h.attributes.position.count*S,L=1;I>e.maxTextureSize&&(L=Math.ceil(I/e.maxTextureSize),I=e.maxTextureSize);let J=new Float32Array(I*L*4*p),V=new gr(J,I,L,p);V.type=wn,V.needsUpdate=!0;let F=S*4;for(let C=0;C<p;C++){let Z=R[C],H=N[C],D=_[C],B=I*L*4*C;for(let Q=0;Q<Z.count;Q++){let j=Q*F;E===!0&&(a.fromBufferAttribute(Z,Q),J[B+j+0]=a.x,J[B+j+1]=a.y,J[B+j+2]=a.z,J[B+j+3]=0),b===!0&&(a.fromBufferAttribute(H,Q),J[B+j+4]=a.x,J[B+j+5]=a.y,J[B+j+6]=a.z,J[B+j+7]=0),A===!0&&(a.fromBufferAttribute(D,Q),J[B+j+8]=a.x,J[B+j+9]=a.y,J[B+j+10]=a.z,J[B+j+11]=D.itemSize===4?a.w:1)}}f={count:p,texture:V,size:new Ne(I,L)},r.set(h,f),h.addEventListener("dispose",T)}let x=0;for(let E=0;E<m.length;E++)x+=m[E];let M=h.morphTargetsRelative?1:1-x;d.getUniforms().setValue(s,"morphTargetBaseInfluence",M),d.getUniforms().setValue(s,"morphTargetInfluences",m),d.getUniforms().setValue(s,"morphTargetsTexture",f.texture,t),d.getUniforms().setValue(s,"morphTargetsTextureSize",f.size)}else{let g=m===void 0?0:m.length,p=n[h.id];if(p===void 0||p.length!==g){p=[];for(let b=0;b<g;b++)p[b]=[b,0];n[h.id]=p}for(let b=0;b<g;b++){let A=p[b];A[0]=b,A[1]=m[b]}p.sort(zm);for(let b=0;b<8;b++)b<g&&p[b][1]?(o[b][0]=p[b][0],o[b][1]=p[b][1]):(o[b][0]=Number.MAX_SAFE_INTEGER,o[b][1]=0);o.sort(Um);let f=h.morphAttributes.position,x=h.morphAttributes.normal,M=0;for(let b=0;b<8;b++){let A=o[b],R=A[0],N=A[1];R!==Number.MAX_SAFE_INTEGER&&N?(f&&h.getAttribute("morphTarget"+b)!==f[R]&&h.setAttribute("morphTarget"+b,f[R]),x&&h.getAttribute("morphNormal"+b)!==x[R]&&h.setAttribute("morphNormal"+b,x[R]),i[b]=N,M+=N):(f&&h.hasAttribute("morphTarget"+b)===!0&&h.deleteAttribute("morphTarget"+b),x&&h.hasAttribute("morphNormal"+b)===!0&&h.deleteAttribute("morphNormal"+b),i[b]=0)}let E=h.morphTargetsRelative?1:1-M;d.getUniforms().setValue(s,"morphTargetBaseInfluence",E),d.getUniforms().setValue(s,"morphTargetInfluences",i)}}return{update:l}}function Hm(s,e,t,n){let i=new WeakMap;function r(l){let c=n.render.frame,h=l.geometry,u=e.get(l,h);return i.get(u)!==c&&(e.update(u),i.set(u,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),t.update(l.instanceMatrix,34962),l.instanceColor!==null&&t.update(l.instanceColor,34962)),u}function a(){i=new WeakMap}function o(l){let c=l.target;c.removeEventListener("dispose",o),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:r,dispose:a}}var hl=new wt,ul=new gr,dl=new Va,fl=new zr,pl=[],ml=[],gl=new Float32Array(16),_l=new Float32Array(9),xl=new Float32Array(4);function fi(s,e,t){let n=s[0];if(n<=0||n>0)return s;let i=e*t,r=pl[i];if(r===void 0&&(r=new Float32Array(i),pl[i]=r),e!==0){n.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,s[a].toArray(r,o)}return r}function ot(s,e){if(s.length!==e.length)return!1;for(let t=0,n=s.length;t<n;t++)if(s[t]!==e[t])return!1;return!0}function at(s,e){for(let t=0,n=e.length;t<n;t++)s[t]=e[t]}function _s(s,e){let t=ml[e];t===void 0&&(t=new Int32Array(e),ml[e]=t);for(let n=0;n!==e;++n)t[n]=s.allocateTextureUnit();return t}function Vm(s,e){let t=this.cache;t[0]!==e&&(s.uniform1f(this.addr,e),t[0]=e)}function Gm(s,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(ot(t,e))return;s.uniform2fv(this.addr,e),at(t,e)}}function Wm(s,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(s.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(ot(t,e))return;s.uniform3fv(this.addr,e),at(t,e)}}function qm(s,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(ot(t,e))return;s.uniform4fv(this.addr,e),at(t,e)}}function Xm(s,e){let t=this.cache,n=e.elements;if(n===void 0){if(ot(t,e))return;s.uniformMatrix2fv(this.addr,!1,e),at(t,e)}else{if(ot(t,n))return;xl.set(n),s.uniformMatrix2fv(this.addr,!1,xl),at(t,n)}}function Ym(s,e){let t=this.cache,n=e.elements;if(n===void 0){if(ot(t,e))return;s.uniformMatrix3fv(this.addr,!1,e),at(t,e)}else{if(ot(t,n))return;_l.set(n),s.uniformMatrix3fv(this.addr,!1,_l),at(t,n)}}function $m(s,e){let t=this.cache,n=e.elements;if(n===void 0){if(ot(t,e))return;s.uniformMatrix4fv(this.addr,!1,e),at(t,e)}else{if(ot(t,n))return;gl.set(n),s.uniformMatrix4fv(this.addr,!1,gl),at(t,n)}}function Km(s,e){let t=this.cache;t[0]!==e&&(s.uniform1i(this.addr,e),t[0]=e)}function Zm(s,e){let t=this.cache;ot(t,e)||(s.uniform2iv(this.addr,e),at(t,e))}function Jm(s,e){let t=this.cache;ot(t,e)||(s.uniform3iv(this.addr,e),at(t,e))}function jm(s,e){let t=this.cache;ot(t,e)||(s.uniform4iv(this.addr,e),at(t,e))}function Qm(s,e){let t=this.cache;t[0]!==e&&(s.uniform1ui(this.addr,e),t[0]=e)}function eg(s,e){let t=this.cache;ot(t,e)||(s.uniform2uiv(this.addr,e),at(t,e))}function tg(s,e){let t=this.cache;ot(t,e)||(s.uniform3uiv(this.addr,e),at(t,e))}function ng(s,e){let t=this.cache;ot(t,e)||(s.uniform4uiv(this.addr,e),at(t,e))}function ig(s,e,t){let n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTexture2D(e||hl,i)}function sg(s,e,t){let n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTexture3D(e||dl,i)}function rg(s,e,t){let n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTextureCube(e||fl,i)}function og(s,e,t){let n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTexture2DArray(e||ul,i)}function ag(s){switch(s){case 5126:return Vm;case 35664:return Gm;case 35665:return Wm;case 35666:return qm;case 35674:return Xm;case 35675:return Ym;case 35676:return $m;case 5124:case 35670:return Km;case 35667:case 35671:return Zm;case 35668:case 35672:return Jm;case 35669:case 35673:return jm;case 5125:return Qm;case 36294:return eg;case 36295:return tg;case 36296:return ng;case 35678:case 36198:case 36298:case 36306:case 35682:return ig;case 35679:case 36299:case 36307:return sg;case 35680:case 36300:case 36308:case 36293:return rg;case 36289:case 36303:case 36311:case 36292:return og}}function lg(s,e){s.uniform1fv(this.addr,e)}function cg(s,e){let t=fi(e,this.size,2);s.uniform2fv(this.addr,t)}function hg(s,e){let t=fi(e,this.size,3);s.uniform3fv(this.addr,t)}function ug(s,e){let t=fi(e,this.size,4);s.uniform4fv(this.addr,t)}function dg(s,e){let t=fi(e,this.size,4);s.uniformMatrix2fv(this.addr,!1,t)}function fg(s,e){let t=fi(e,this.size,9);s.uniformMatrix3fv(this.addr,!1,t)}function pg(s,e){let t=fi(e,this.size,16);s.uniformMatrix4fv(this.addr,!1,t)}function mg(s,e){s.uniform1iv(this.addr,e)}function gg(s,e){s.uniform2iv(this.addr,e)}function _g(s,e){s.uniform3iv(this.addr,e)}function xg(s,e){s.uniform4iv(this.addr,e)}function vg(s,e){s.uniform1uiv(this.addr,e)}function yg(s,e){s.uniform2uiv(this.addr,e)}function bg(s,e){s.uniform3uiv(this.addr,e)}function Mg(s,e){s.uniform4uiv(this.addr,e)}function wg(s,e,t){let n=e.length,i=_s(t,n);s.uniform1iv(this.addr,i);for(let r=0;r!==n;++r)t.setTexture2D(e[r]||hl,i[r])}function Sg(s,e,t){let n=e.length,i=_s(t,n);s.uniform1iv(this.addr,i);for(let r=0;r!==n;++r)t.setTexture3D(e[r]||dl,i[r])}function Ag(s,e,t){let n=e.length,i=_s(t,n);s.uniform1iv(this.addr,i);for(let r=0;r!==n;++r)t.setTextureCube(e[r]||fl,i[r])}function Eg(s,e,t){let n=e.length,i=_s(t,n);s.uniform1iv(this.addr,i);for(let r=0;r!==n;++r)t.setTexture2DArray(e[r]||ul,i[r])}function Tg(s){switch(s){case 5126:return lg;case 35664:return cg;case 35665:return hg;case 35666:return ug;case 35674:return dg;case 35675:return fg;case 35676:return pg;case 5124:case 35670:return mg;case 35667:case 35671:return gg;case 35668:case 35672:return _g;case 35669:case 35673:return xg;case 5125:return vg;case 36294:return yg;case 36295:return bg;case 36296:return Mg;case 35678:case 36198:case 36298:case 36306:case 35682:return wg;case 35679:case 36299:case 36307:return Sg;case 35680:case 36300:case 36308:case 36293:return Ag;case 36289:case 36303:case 36311:case 36292:return Eg}}var vl=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.setValue=ag(t.type)}},yl=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.size=t.size,this.setValue=Tg(t.type)}},bl=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let i=this.seq;for(let r=0,a=i.length;r!==a;++r){let o=i[r];o.setValue(e,t[o.id],n)}}},Xr=/(\w+)(\])?(\[|\.)?/g;function Ml(s,e){s.seq.push(e),s.map[e.id]=e}function Cg(s,e,t){let n=s.name,i=n.length;for(Xr.lastIndex=0;;){let r=Xr.exec(n),a=Xr.lastIndex,o=r[1],l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===i){Ml(t,c===void 0?new vl(o,s,e):new yl(o,s,e));break}else{let u=t.map[o];u===void 0&&(u=new bl(o),Ml(t,u)),t=u}}}var Ei=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,35718);for(let i=0;i<n;++i){let r=e.getActiveUniform(t,i),a=e.getUniformLocation(t,r.name);Cg(r,a,this)}}setValue(e,t,n,i){let r=this.map[t];r!==void 0&&r.setValue(e,n,i)}setOptional(e,t,n){let i=t[n];i!==void 0&&this.setValue(e,n,i)}static upload(e,t,n,i){for(let r=0,a=t.length;r!==a;++r){let o=t[r],l=n[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,i)}}static seqWithValue(e,t){let n=[];for(let i=0,r=e.length;i!==r;++i){let a=e[i];a.id in t&&n.push(a)}return n}};function wl(s,e,t){let n=s.createShader(e);return s.shaderSource(n,t),s.compileShader(n),n}var Lg=0;function Rg(s,e){let t=s.split(`
`),n=[],i=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=i;a<r;a++){let o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}function Pg(s){switch(s){case An:return["Linear","( value )"];case Ve:return["sRGB","( value )"];default:return console.warn("THREE.WebGLProgram: Unsupported encoding:",s),["Linear","( value )"]}}function Sl(s,e,t){let n=s.getShaderParameter(e,35713),i=s.getShaderInfoLog(e).trim();if(n&&i==="")return"";let r=/ERROR: 0:(\d+)/.exec(i);if(r){let a=parseInt(r[1]);return t.toUpperCase()+`

`+i+`

`+Rg(s.getShaderSource(e),a)}else return i}function Ig(s,e){let t=Pg(e);return"vec4 "+s+"( vec4 value ) { return LinearTo"+t[0]+t[1]+"; }"}function Dg(s,e){let t;switch(e){case sd:t="Linear";break;case rd:t="Reinhard";break;case od:t="OptimizedCineon";break;case ad:t="ACESFilmic";break;case ld:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+s+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}function Og(s){return[s.extensionDerivatives||!!s.envMapCubeUVHeight||s.bumpMap||s.tangentSpaceNormalMap||s.clearcoatNormalMap||s.flatShading||s.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(s.extensionFragDepth||s.logarithmicDepthBuffer)&&s.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",s.extensionDrawBuffers&&s.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(s.extensionShaderTextureLOD||s.envMap||s.transmission)&&s.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(Ti).join(`
`)}function Ng(s){let e=[];for(let t in s){let n=s[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function Fg(s,e){let t={},n=s.getProgramParameter(e,35721);for(let i=0;i<n;i++){let r=s.getActiveAttrib(e,i),a=r.name,o=1;r.type===35674&&(o=2),r.type===35675&&(o=3),r.type===35676&&(o=4),t[a]={type:r.type,location:s.getAttribLocation(e,a),locationSize:o}}return t}function Ti(s){return s!==""}function Al(s,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return s.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function El(s,e){return s.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var Bg=/^[ \t]*#include +<([\w\d./]+)>/gm;function Yr(s){return s.replace(Bg,Ug)}function Ug(s,e){let t=Ee[e];if(t===void 0)throw new Error("Can not resolve #include <"+e+">");return Yr(t)}var zg=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Tl(s){return s.replace(zg,kg)}function kg(s,e,t,n){let i="";for(let r=parseInt(e);r<parseInt(t);r++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return i}function Cl(s){let e="precision "+s.precision+` float;
precision `+s.precision+" int;";return s.precision==="highp"?e+=`
#define HIGH_PRECISION`:s.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:s.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function Hg(s){let e="SHADOWMAP_TYPE_BASIC";return s.shadowMapType===Qo?e="SHADOWMAP_TYPE_PCF":s.shadowMapType===Fu?e="SHADOWMAP_TYPE_PCF_SOFT":s.shadowMapType===yi&&(e="SHADOWMAP_TYPE_VSM"),e}function Vg(s){let e="ENVMAP_TYPE_CUBE";if(s.envMap)switch(s.envMapMode){case Wn:case qn:e="ENVMAP_TYPE_CUBE";break;case Hi:e="ENVMAP_TYPE_CUBE_UV";break}return e}function Gg(s){let e="ENVMAP_MODE_REFLECTION";if(s.envMap)switch(s.envMapMode){case qn:e="ENVMAP_MODE_REFRACTION";break}return e}function Wg(s){let e="ENVMAP_BLENDING_NONE";if(s.envMap)switch(s.combine){case Zs:e="ENVMAP_BLENDING_MULTIPLY";break;case nd:e="ENVMAP_BLENDING_MIX";break;case id:e="ENVMAP_BLENDING_ADD";break}return e}function qg(s){let e=s.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:n,maxMip:t}}function Xg(s,e,t,n){let i=s.getContext(),r=t.defines,a=t.vertexShader,o=t.fragmentShader,l=Hg(t),c=Vg(t),h=Gg(t),u=Wg(t),d=qg(t),m=t.isWebGL2?"":Og(t),g=Ng(r),p=i.createProgram(),f,x,M=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(f=[g].filter(Ti).join(`
`),f.length>0&&(f+=`
`),x=[m,g].filter(Ti).join(`
`),x.length>0&&(x+=`
`)):(f=[Cl(t),"#define SHADER_NAME "+t.shaderName,g,t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.supportsVertexTextures?"#define VERTEX_TEXTURES":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMap&&t.objectSpaceNormalMap?"#define OBJECTSPACE_NORMALMAP":"",t.normalMap&&t.tangentSpaceNormalMap?"#define TANGENTSPACE_NORMALMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.displacementMap&&t.supportsVertexTextures?"#define USE_DISPLACEMENTMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularIntensityMap?"#define USE_SPECULARINTENSITYMAP":"",t.specularColorMap?"#define USE_SPECULARCOLORMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEENCOLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEENROUGHNESSMAP":"",t.vertexTangents?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUvs?"#define USE_UV":"",t.uvsVertexOnly?"#define UVS_VERTEX_ONLY":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors&&t.isWebGL2?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.logarithmicDepthBuffer&&t.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ti).join(`
`),x=[m,Cl(t),"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMap&&t.objectSpaceNormalMap?"#define OBJECTSPACE_NORMALMAP":"",t.normalMap&&t.tangentSpaceNormalMap?"#define TANGENTSPACE_NORMALMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularIntensityMap?"#define USE_SPECULARINTENSITYMAP":"",t.specularColorMap?"#define USE_SPECULARCOLORMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEENCOLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEENROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.vertexTangents?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUvs?"#define USE_UV":"",t.uvsVertexOnly?"#define UVS_VERTEX_ONLY":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.physicallyCorrectLights?"#define PHYSICALLY_CORRECT_LIGHTS":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.logarithmicDepthBuffer&&t.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Wt?"#define TONE_MAPPING":"",t.toneMapping!==Wt?Ee.tonemapping_pars_fragment:"",t.toneMapping!==Wt?Dg("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ee.encodings_pars_fragment,Ig("linearToOutputTexel",t.outputEncoding),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Ti).join(`
`)),a=Yr(a),a=Al(a,t),a=El(a,t),o=Yr(o),o=Al(o,t),o=El(o,t),a=Tl(a),o=Tl(o),t.isWebGL2&&t.isRawShaderMaterial!==!0&&(M=`#version 300 es
`,f=["precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+f,x=["#define varying in",t.glslVersion===Ba?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Ba?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+x);let E=M+f+a,b=M+x+o,A=wl(i,35633,E),R=wl(i,35632,b);if(i.attachShader(p,A),i.attachShader(p,R),t.index0AttributeName!==void 0?i.bindAttribLocation(p,0,t.index0AttributeName):t.morphTargets===!0&&i.bindAttribLocation(p,0,"position"),i.linkProgram(p),s.debug.checkShaderErrors){let S=i.getProgramInfoLog(p).trim(),I=i.getShaderInfoLog(A).trim(),L=i.getShaderInfoLog(R).trim(),J=!0,V=!0;if(i.getProgramParameter(p,35714)===!1){J=!1;let F=Sl(i,A,"vertex"),T=Sl(i,R,"fragment");console.error("THREE.WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(p,35715)+`

Program Info Log: `+S+`
`+F+`
`+T)}else S!==""?console.warn("THREE.WebGLProgram: Program Info Log:",S):(I===""||L==="")&&(V=!1);V&&(this.diagnostics={runnable:J,programLog:S,vertexShader:{log:I,prefix:f},fragmentShader:{log:L,prefix:x}})}i.deleteShader(A),i.deleteShader(R);let N;this.getUniforms=function(){return N===void 0&&(N=new Ei(i,p)),N};let _;return this.getAttributes=function(){return _===void 0&&(_=Fg(i,p)),_},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(p),this.program=void 0},this.name=t.shaderName,this.id=Lg++,this.cacheKey=e,this.usedTimes=1,this.program=p,this.vertexShader=A,this.fragmentShader=R,this}var Yg=0,Ll=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){let t=e.vertexShader,n=e.fragmentShader,i=this._getShaderStage(t),r=this._getShaderStage(n),a=this._getShaderCacheForMaterial(e);return a.has(i)===!1&&(a.add(i),i.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new Rl(e),t.set(e,n)),n}},Rl=class{constructor(e){this.id=Yg++,this.code=e,this.usedTimes=0}};function $g(s,e,t,n,i,r,a){let o=new Sr,l=new Ll,c=[],h=i.isWebGL2,u=i.logarithmicDepthBuffer,d=i.vertexTextures,m=i.precision,g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function p(_,S,I,L,J){let V=L.fog,F=J.geometry,T=_.isMeshStandardMaterial?L.environment:null,C=(_.isMeshStandardMaterial?t:e).get(_.envMap||T),Z=!!C&&C.mapping===Hi?C.image.height:null,H=g[_.type];_.precision!==null&&(m=i.getMaxPrecision(_.precision),m!==_.precision&&console.warn("THREE.WebGLProgram.getParameters:",_.precision,"not supported, using",m,"instead."));let D=F.morphAttributes.position||F.morphAttributes.normal||F.morphAttributes.color,B=D!==void 0?D.length:0,Q=0;F.morphAttributes.position!==void 0&&(Q=1),F.morphAttributes.normal!==void 0&&(Q=2),F.morphAttributes.color!==void 0&&(Q=3);let j,se,de,ve;if(H){let K=Ut[H];j=K.vertexShader,se=K.fragmentShader}else j=_.vertexShader,se=_.fragmentShader,l.update(_),de=l.getVertexShaderID(_),ve=l.getFragmentShaderID(_);let k=s.getRenderTarget(),Te=_.alphaTest>0,ye=_.clearcoat>0,$=_.iridescence>0;return{isWebGL2:h,shaderID:H,shaderName:_.type,vertexShader:j,fragmentShader:se,defines:_.defines,customVertexShaderID:de,customFragmentShaderID:ve,isRawShaderMaterial:_.isRawShaderMaterial===!0,glslVersion:_.glslVersion,precision:m,instancing:J.isInstancedMesh===!0,instancingColor:J.isInstancedMesh===!0&&J.instanceColor!==null,supportsVertexTextures:d,outputEncoding:k===null?s.outputEncoding:k.isXRRenderTarget===!0?k.texture.encoding:An,map:!!_.map,matcap:!!_.matcap,envMap:!!C,envMapMode:C&&C.mapping,envMapCubeUVHeight:Z,lightMap:!!_.lightMap,aoMap:!!_.aoMap,emissiveMap:!!_.emissiveMap,bumpMap:!!_.bumpMap,normalMap:!!_.normalMap,objectSpaceNormalMap:_.normalMapType===Td,tangentSpaceNormalMap:_.normalMapType===Na,decodeVideoTexture:!!_.map&&_.map.isVideoTexture===!0&&_.map.encoding===Ve,clearcoat:ye,clearcoatMap:ye&&!!_.clearcoatMap,clearcoatRoughnessMap:ye&&!!_.clearcoatRoughnessMap,clearcoatNormalMap:ye&&!!_.clearcoatNormalMap,iridescence:$,iridescenceMap:$&&!!_.iridescenceMap,iridescenceThicknessMap:$&&!!_.iridescenceThicknessMap,displacementMap:!!_.displacementMap,roughnessMap:!!_.roughnessMap,metalnessMap:!!_.metalnessMap,specularMap:!!_.specularMap,specularIntensityMap:!!_.specularIntensityMap,specularColorMap:!!_.specularColorMap,opaque:_.transparent===!1&&_.blending===Vn,alphaMap:!!_.alphaMap,alphaTest:Te,gradientMap:!!_.gradientMap,sheen:_.sheen>0,sheenColorMap:!!_.sheenColorMap,sheenRoughnessMap:!!_.sheenRoughnessMap,transmission:_.transmission>0,transmissionMap:!!_.transmissionMap,thicknessMap:!!_.thicknessMap,combine:_.combine,vertexTangents:!!_.normalMap&&!!F.attributes.tangent,vertexColors:_.vertexColors,vertexAlphas:_.vertexColors===!0&&!!F.attributes.color&&F.attributes.color.itemSize===4,vertexUvs:!!_.map||!!_.bumpMap||!!_.normalMap||!!_.specularMap||!!_.alphaMap||!!_.emissiveMap||!!_.roughnessMap||!!_.metalnessMap||!!_.clearcoatMap||!!_.clearcoatRoughnessMap||!!_.clearcoatNormalMap||!!_.iridescenceMap||!!_.iridescenceThicknessMap||!!_.displacementMap||!!_.transmissionMap||!!_.thicknessMap||!!_.specularIntensityMap||!!_.specularColorMap||!!_.sheenColorMap||!!_.sheenRoughnessMap,uvsVertexOnly:!(!!_.map||!!_.bumpMap||!!_.normalMap||!!_.specularMap||!!_.alphaMap||!!_.emissiveMap||!!_.roughnessMap||!!_.metalnessMap||!!_.clearcoatNormalMap||!!_.iridescenceMap||!!_.iridescenceThicknessMap||_.transmission>0||!!_.transmissionMap||!!_.thicknessMap||!!_.specularIntensityMap||!!_.specularColorMap||_.sheen>0||!!_.sheenColorMap||!!_.sheenRoughnessMap)&&!!_.displacementMap,fog:!!V,useFog:_.fog===!0,fogExp2:V&&V.isFogExp2,flatShading:!!_.flatShading,sizeAttenuation:_.sizeAttenuation,logarithmicDepthBuffer:u,skinning:J.isSkinnedMesh===!0,morphTargets:F.morphAttributes.position!==void 0,morphNormals:F.morphAttributes.normal!==void 0,morphColors:F.morphAttributes.color!==void 0,morphTargetsCount:B,morphTextureStride:Q,numDirLights:S.directional.length,numPointLights:S.point.length,numSpotLights:S.spot.length,numSpotLightMaps:S.spotLightMap.length,numRectAreaLights:S.rectArea.length,numHemiLights:S.hemi.length,numDirLightShadows:S.directionalShadowMap.length,numPointLightShadows:S.pointShadowMap.length,numSpotLightShadows:S.spotShadowMap.length,numSpotLightShadowsWithMaps:S.numSpotLightShadowsWithMaps,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:_.dithering,shadowMapEnabled:s.shadowMap.enabled&&I.length>0,shadowMapType:s.shadowMap.type,toneMapping:_.toneMapped?s.toneMapping:Wt,physicallyCorrectLights:s.physicallyCorrectLights,premultipliedAlpha:_.premultipliedAlpha,doubleSided:_.side===en,flipSided:_.side===bt,useDepthPacking:!!_.depthPacking,depthPacking:_.depthPacking||0,index0AttributeName:_.index0AttributeName,extensionDerivatives:_.extensions&&_.extensions.derivatives,extensionFragDepth:_.extensions&&_.extensions.fragDepth,extensionDrawBuffers:_.extensions&&_.extensions.drawBuffers,extensionShaderTextureLOD:_.extensions&&_.extensions.shaderTextureLOD,rendererExtensionFragDepth:h||n.has("EXT_frag_depth"),rendererExtensionDrawBuffers:h||n.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:h||n.has("EXT_shader_texture_lod"),customProgramCacheKey:_.customProgramCacheKey()}}function f(_){let S=[];if(_.shaderID?S.push(_.shaderID):(S.push(_.customVertexShaderID),S.push(_.customFragmentShaderID)),_.defines!==void 0)for(let I in _.defines)S.push(I),S.push(_.defines[I]);return _.isRawShaderMaterial===!1&&(x(S,_),M(S,_),S.push(s.outputEncoding)),S.push(_.customProgramCacheKey),S.join()}function x(_,S){_.push(S.precision),_.push(S.outputEncoding),_.push(S.envMapMode),_.push(S.envMapCubeUVHeight),_.push(S.combine),_.push(S.vertexUvs),_.push(S.fogExp2),_.push(S.sizeAttenuation),_.push(S.morphTargetsCount),_.push(S.morphAttributeCount),_.push(S.numDirLights),_.push(S.numPointLights),_.push(S.numSpotLights),_.push(S.numSpotLightMaps),_.push(S.numHemiLights),_.push(S.numRectAreaLights),_.push(S.numDirLightShadows),_.push(S.numPointLightShadows),_.push(S.numSpotLightShadows),_.push(S.numSpotLightShadowsWithMaps),_.push(S.shadowMapType),_.push(S.toneMapping),_.push(S.numClippingPlanes),_.push(S.numClipIntersection),_.push(S.depthPacking)}function M(_,S){o.disableAll(),S.isWebGL2&&o.enable(0),S.supportsVertexTextures&&o.enable(1),S.instancing&&o.enable(2),S.instancingColor&&o.enable(3),S.map&&o.enable(4),S.matcap&&o.enable(5),S.envMap&&o.enable(6),S.lightMap&&o.enable(7),S.aoMap&&o.enable(8),S.emissiveMap&&o.enable(9),S.bumpMap&&o.enable(10),S.normalMap&&o.enable(11),S.objectSpaceNormalMap&&o.enable(12),S.tangentSpaceNormalMap&&o.enable(13),S.clearcoat&&o.enable(14),S.clearcoatMap&&o.enable(15),S.clearcoatRoughnessMap&&o.enable(16),S.clearcoatNormalMap&&o.enable(17),S.iridescence&&o.enable(18),S.iridescenceMap&&o.enable(19),S.iridescenceThicknessMap&&o.enable(20),S.displacementMap&&o.enable(21),S.specularMap&&o.enable(22),S.roughnessMap&&o.enable(23),S.metalnessMap&&o.enable(24),S.gradientMap&&o.enable(25),S.alphaMap&&o.enable(26),S.alphaTest&&o.enable(27),S.vertexColors&&o.enable(28),S.vertexAlphas&&o.enable(29),S.vertexUvs&&o.enable(30),S.vertexTangents&&o.enable(31),S.uvsVertexOnly&&o.enable(32),_.push(o.mask),o.disableAll(),S.fog&&o.enable(0),S.useFog&&o.enable(1),S.flatShading&&o.enable(2),S.logarithmicDepthBuffer&&o.enable(3),S.skinning&&o.enable(4),S.morphTargets&&o.enable(5),S.morphNormals&&o.enable(6),S.morphColors&&o.enable(7),S.premultipliedAlpha&&o.enable(8),S.shadowMapEnabled&&o.enable(9),S.physicallyCorrectLights&&o.enable(10),S.doubleSided&&o.enable(11),S.flipSided&&o.enable(12),S.useDepthPacking&&o.enable(13),S.dithering&&o.enable(14),S.specularIntensityMap&&o.enable(15),S.specularColorMap&&o.enable(16),S.transmission&&o.enable(17),S.transmissionMap&&o.enable(18),S.thicknessMap&&o.enable(19),S.sheen&&o.enable(20),S.sheenColorMap&&o.enable(21),S.sheenRoughnessMap&&o.enable(22),S.decodeVideoTexture&&o.enable(23),S.opaque&&o.enable(24),_.push(o.mask)}function E(_){let S=g[_.type],I;if(S){let L=Ut[S];I=Vd.clone(L.uniforms)}else I=_.uniforms;return I}function b(_,S){let I;for(let L=0,J=c.length;L<J;L++){let V=c[L];if(V.cacheKey===S){I=V,++I.usedTimes;break}}return I===void 0&&(I=new Xg(s,S,_,r),c.push(I)),I}function A(_){if(--_.usedTimes==0){let S=c.indexOf(_);c[S]=c[c.length-1],c.pop(),_.destroy()}}function R(_){l.remove(_)}function N(){l.dispose()}return{getParameters:p,getProgramCacheKey:f,getUniforms:E,acquireProgram:b,releaseProgram:A,releaseShaderCache:R,programs:c,dispose:N}}function Kg(){let s=new WeakMap;function e(r){let a=s.get(r);return a===void 0&&(a={},s.set(r,a)),a}function t(r){s.delete(r)}function n(r,a,o){s.get(r)[a]=o}function i(){s=new WeakMap}return{get:e,remove:t,update:n,dispose:i}}function Zg(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.material.id!==e.material.id?s.material.id-e.material.id:s.z!==e.z?s.z-e.z:s.id-e.id}function Pl(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.z!==e.z?e.z-s.z:s.id-e.id}function Il(){let s=[],e=0,t=[],n=[],i=[];function r(){e=0,t.length=0,n.length=0,i.length=0}function a(u,d,m,g,p,f){let x=s[e];return x===void 0?(x={id:u.id,object:u,geometry:d,material:m,groupOrder:g,renderOrder:u.renderOrder,z:p,group:f},s[e]=x):(x.id=u.id,x.object=u,x.geometry=d,x.material=m,x.groupOrder=g,x.renderOrder=u.renderOrder,x.z=p,x.group=f),e++,x}function o(u,d,m,g,p,f){let x=a(u,d,m,g,p,f);m.transmission>0?n.push(x):m.transparent===!0?i.push(x):t.push(x)}function l(u,d,m,g,p,f){let x=a(u,d,m,g,p,f);m.transmission>0?n.unshift(x):m.transparent===!0?i.unshift(x):t.unshift(x)}function c(u,d){t.length>1&&t.sort(u||Zg),n.length>1&&n.sort(d||Pl),i.length>1&&i.sort(d||Pl)}function h(){for(let u=e,d=s.length;u<d;u++){let m=s[u];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:t,transmissive:n,transparent:i,init:r,push:o,unshift:l,finish:h,sort:c}}function Jg(){let s=new WeakMap;function e(n,i){let r=s.get(n),a;return r===void 0?(a=new Il,s.set(n,[a])):i>=r.length?(a=new Il,r.push(a)):a=r[i],a}function t(){s=new WeakMap}return{get:e,dispose:t}}function jg(){let s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new z,color:new ze};break;case"SpotLight":t={position:new z,direction:new z,color:new ze,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new z,color:new ze,distance:0,decay:0};break;case"HemisphereLight":t={direction:new z,skyColor:new ze,groundColor:new ze};break;case"RectAreaLight":t={color:new ze,position:new z,halfWidth:new z,halfHeight:new z};break}return s[e.id]=t,t}}}function Qg(){let s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ne};break;case"SpotLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ne};break;case"PointLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ne,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[e.id]=t,t}}}var e0=0;function t0(s,e){return(e.castShadow?2:0)-(s.castShadow?2:0)+(e.map?1:0)-(s.map?1:0)}function n0(s,e){let t=new jg,n=Qg(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0};for(let h=0;h<9;h++)i.probe.push(new z);let r=new z,a=new Ye,o=new Ye;function l(h,u){let d=0,m=0,g=0;for(let L=0;L<9;L++)i.probe[L].set(0,0,0);let p=0,f=0,x=0,M=0,E=0,b=0,A=0,R=0,N=0,_=0;h.sort(t0);let S=u!==!0?Math.PI:1;for(let L=0,J=h.length;L<J;L++){let V=h[L],F=V.color,T=V.intensity,C=V.distance,Z=V.shadow&&V.shadow.map?V.shadow.map.texture:null;if(V.isAmbientLight)d+=F.r*T*S,m+=F.g*T*S,g+=F.b*T*S;else if(V.isLightProbe)for(let H=0;H<9;H++)i.probe[H].addScaledVector(V.sh.coefficients[H],T);else if(V.isDirectionalLight){let H=t.get(V);if(H.color.copy(V.color).multiplyScalar(V.intensity*S),V.castShadow){let D=V.shadow,B=n.get(V);B.shadowBias=D.bias,B.shadowNormalBias=D.normalBias,B.shadowRadius=D.radius,B.shadowMapSize=D.mapSize,i.directionalShadow[p]=B,i.directionalShadowMap[p]=Z,i.directionalShadowMatrix[p]=V.shadow.matrix,b++}i.directional[p]=H,p++}else if(V.isSpotLight){let H=t.get(V);H.position.setFromMatrixPosition(V.matrixWorld),H.color.copy(F).multiplyScalar(T*S),H.distance=C,H.coneCos=Math.cos(V.angle),H.penumbraCos=Math.cos(V.angle*(1-V.penumbra)),H.decay=V.decay,i.spot[x]=H;let D=V.shadow;if(V.map&&(i.spotLightMap[N]=V.map,N++,D.updateMatrices(V),V.castShadow&&_++),i.spotLightMatrix[x]=D.matrix,V.castShadow){let B=n.get(V);B.shadowBias=D.bias,B.shadowNormalBias=D.normalBias,B.shadowRadius=D.radius,B.shadowMapSize=D.mapSize,i.spotShadow[x]=B,i.spotShadowMap[x]=Z,R++}x++}else if(V.isRectAreaLight){let H=t.get(V);H.color.copy(F).multiplyScalar(T),H.halfWidth.set(V.width*.5,0,0),H.halfHeight.set(0,V.height*.5,0),i.rectArea[M]=H,M++}else if(V.isPointLight){let H=t.get(V);if(H.color.copy(V.color).multiplyScalar(V.intensity*S),H.distance=V.distance,H.decay=V.decay,V.castShadow){let D=V.shadow,B=n.get(V);B.shadowBias=D.bias,B.shadowNormalBias=D.normalBias,B.shadowRadius=D.radius,B.shadowMapSize=D.mapSize,B.shadowCameraNear=D.camera.near,B.shadowCameraFar=D.camera.far,i.pointShadow[f]=B,i.pointShadowMap[f]=Z,i.pointShadowMatrix[f]=V.shadow.matrix,A++}i.point[f]=H,f++}else if(V.isHemisphereLight){let H=t.get(V);H.skyColor.copy(V.color).multiplyScalar(T*S),H.groundColor.copy(V.groundColor).multiplyScalar(T*S),i.hemi[E]=H,E++}}M>0&&(e.isWebGL2||s.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=ie.LTC_FLOAT_1,i.rectAreaLTC2=ie.LTC_FLOAT_2):s.has("OES_texture_half_float_linear")===!0?(i.rectAreaLTC1=ie.LTC_HALF_1,i.rectAreaLTC2=ie.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),i.ambient[0]=d,i.ambient[1]=m,i.ambient[2]=g;let I=i.hash;(I.directionalLength!==p||I.pointLength!==f||I.spotLength!==x||I.rectAreaLength!==M||I.hemiLength!==E||I.numDirectionalShadows!==b||I.numPointShadows!==A||I.numSpotShadows!==R||I.numSpotMaps!==N)&&(i.directional.length=p,i.spot.length=x,i.rectArea.length=M,i.point.length=f,i.hemi.length=E,i.directionalShadow.length=b,i.directionalShadowMap.length=b,i.pointShadow.length=A,i.pointShadowMap.length=A,i.spotShadow.length=R,i.spotShadowMap.length=R,i.directionalShadowMatrix.length=b,i.pointShadowMatrix.length=A,i.spotLightMatrix.length=R+N-_,i.spotLightMap.length=N,i.numSpotLightShadowsWithMaps=_,I.directionalLength=p,I.pointLength=f,I.spotLength=x,I.rectAreaLength=M,I.hemiLength=E,I.numDirectionalShadows=b,I.numPointShadows=A,I.numSpotShadows=R,I.numSpotMaps=N,i.version=e0++)}function c(h,u){let d=0,m=0,g=0,p=0,f=0,x=u.matrixWorldInverse;for(let M=0,E=h.length;M<E;M++){let b=h[M];if(b.isDirectionalLight){let A=i.directional[d];A.direction.setFromMatrixPosition(b.matrixWorld),r.setFromMatrixPosition(b.target.matrixWorld),A.direction.sub(r),A.direction.transformDirection(x),d++}else if(b.isSpotLight){let A=i.spot[g];A.position.setFromMatrixPosition(b.matrixWorld),A.position.applyMatrix4(x),A.direction.setFromMatrixPosition(b.matrixWorld),r.setFromMatrixPosition(b.target.matrixWorld),A.direction.sub(r),A.direction.transformDirection(x),g++}else if(b.isRectAreaLight){let A=i.rectArea[p];A.position.setFromMatrixPosition(b.matrixWorld),A.position.applyMatrix4(x),o.identity(),a.copy(b.matrixWorld),a.premultiply(x),o.extractRotation(a),A.halfWidth.set(b.width*.5,0,0),A.halfHeight.set(0,b.height*.5,0),A.halfWidth.applyMatrix4(o),A.halfHeight.applyMatrix4(o),p++}else if(b.isPointLight){let A=i.point[m];A.position.setFromMatrixPosition(b.matrixWorld),A.position.applyMatrix4(x),m++}else if(b.isHemisphereLight){let A=i.hemi[f];A.direction.setFromMatrixPosition(b.matrixWorld),A.direction.transformDirection(x),f++}}}return{setup:l,setupView:c,state:i}}function Dl(s,e){let t=new n0(s,e),n=[],i=[];function r(){n.length=0,i.length=0}function a(u){n.push(u)}function o(u){i.push(u)}function l(u){t.setup(n,u)}function c(u){t.setupView(n,u)}return{init:r,state:{lightsArray:n,shadowsArray:i,lights:t},setupLights:l,setupLightsView:c,pushLight:a,pushShadow:o}}function i0(s,e){let t=new WeakMap;function n(r,a=0){let o=t.get(r),l;return o===void 0?(l=new Dl(s,e),t.set(r,[l])):a>=o.length?(l=new Dl(s,e),o.push(l)):l=o[a],l}function i(){t=new WeakMap}return{get:n,dispose:i}}var Ol=class extends si{constructor(e){super();this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Ad,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},Nl=class extends si{constructor(e){super();this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.referencePosition=new z,this.nearDistance=1,this.farDistance=1e3,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.referencePosition.copy(e.referencePosition),this.nearDistance=e.nearDistance,this.farDistance=e.farDistance,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}},s0=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,r0=`uniform sampler2D shadow_pass;
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
}`;function o0(s,e,t){let n=new ps,i=new Ne,r=new Ne,a=new Je,o=new Ol({depthPacking:Ed}),l=new Nl,c={},h=t.maxTextureSize,u={0:bt,1:Hn,2:en},d=new fn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Ne},radius:{value:4}},vertexShader:s0,fragmentShader:r0}),m=d.clone();m.defines.HORIZONTAL_PASS=1;let g=new cn;g.setAttribute("position",new Pt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let p=new xt(g,d),f=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Qo,this.render=function(b,A,R){if(f.enabled===!1||f.autoUpdate===!1&&f.needsUpdate===!1||b.length===0)return;let N=s.getRenderTarget(),_=s.getActiveCubeFace(),S=s.getActiveMipmapLevel(),I=s.state;I.setBlending(tn),I.buffers.color.setClear(1,1,1,1),I.buffers.depth.setTest(!0),I.setScissorTest(!1);for(let L=0,J=b.length;L<J;L++){let V=b[L],F=V.shadow;if(F===void 0){console.warn("THREE.WebGLShadowMap:",V,"has no shadow.");continue}if(F.autoUpdate===!1&&F.needsUpdate===!1)continue;i.copy(F.mapSize);let T=F.getFrameExtents();if(i.multiply(T),r.copy(F.mapSize),(i.x>h||i.y>h)&&(i.x>h&&(r.x=Math.floor(h/T.x),i.x=r.x*T.x,F.mapSize.x=r.x),i.y>h&&(r.y=Math.floor(h/T.y),i.y=r.y*T.y,F.mapSize.y=r.y)),F.map===null){let Z=this.type!==yi?{minFilter:ct,magFilter:ct}:{};F.map=new nn(i.x,i.y,Z),F.map.texture.name=V.name+".shadowMap",F.camera.updateProjectionMatrix()}s.setRenderTarget(F.map),s.clear();let C=F.getViewportCount();for(let Z=0;Z<C;Z++){let H=F.getViewport(Z);a.set(r.x*H.x,r.y*H.y,r.x*H.z,r.y*H.w),I.viewport(a),F.updateMatrices(V,Z),n=F.getFrustum(),E(A,R,F.camera,V,this.type)}F.isPointLightShadow!==!0&&this.type===yi&&x(F,R),F.needsUpdate=!1}f.needsUpdate=!1,s.setRenderTarget(N,_,S)};function x(b,A){let R=e.update(p);d.defines.VSM_SAMPLES!==b.blurSamples&&(d.defines.VSM_SAMPLES=b.blurSamples,m.defines.VSM_SAMPLES=b.blurSamples,d.needsUpdate=!0,m.needsUpdate=!0),b.mapPass===null&&(b.mapPass=new nn(i.x,i.y)),d.uniforms.shadow_pass.value=b.map.texture,d.uniforms.resolution.value=b.mapSize,d.uniforms.radius.value=b.radius,s.setRenderTarget(b.mapPass),s.clear(),s.renderBufferDirect(A,null,R,d,p,null),m.uniforms.shadow_pass.value=b.mapPass.texture,m.uniforms.resolution.value=b.mapSize,m.uniforms.radius.value=b.radius,s.setRenderTarget(b.map),s.clear(),s.renderBufferDirect(A,null,R,m,p,null)}function M(b,A,R,N,_,S){let I=null,L=R.isPointLight===!0?b.customDistanceMaterial:b.customDepthMaterial;if(L!==void 0?I=L:I=R.isPointLight===!0?l:o,s.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0){let J=I.uuid,V=A.uuid,F=c[J];F===void 0&&(F={},c[J]=F);let T=F[V];T===void 0&&(T=I.clone(),F[V]=T),I=T}return I.visible=A.visible,I.wireframe=A.wireframe,S===yi?I.side=A.shadowSide!==null?A.shadowSide:A.side:I.side=A.shadowSide!==null?A.shadowSide:u[A.side],I.alphaMap=A.alphaMap,I.alphaTest=A.alphaTest,I.clipShadows=A.clipShadows,I.clippingPlanes=A.clippingPlanes,I.clipIntersection=A.clipIntersection,I.displacementMap=A.displacementMap,I.displacementScale=A.displacementScale,I.displacementBias=A.displacementBias,I.wireframeLinewidth=A.wireframeLinewidth,I.linewidth=A.linewidth,R.isPointLight===!0&&I.isMeshDistanceMaterial===!0&&(I.referencePosition.setFromMatrixPosition(R.matrixWorld),I.nearDistance=N,I.farDistance=_),I}function E(b,A,R,N,_){if(b.visible===!1)return;if(b.layers.test(A.layers)&&(b.isMesh||b.isLine||b.isPoints)&&(b.castShadow||b.receiveShadow&&_===yi)&&(!b.frustumCulled||n.intersectsObject(b))){b.modelViewMatrix.multiplyMatrices(R.matrixWorldInverse,b.matrixWorld);let L=e.update(b),J=b.material;if(Array.isArray(J)){let V=L.groups;for(let F=0,T=V.length;F<T;F++){let C=V[F],Z=J[C.materialIndex];if(Z&&Z.visible){let H=M(b,Z,N,R.near,R.far,_);s.renderBufferDirect(R,null,L,H,b,C)}}}else if(J.visible){let V=M(b,J,N,R.near,R.far,_);s.renderBufferDirect(R,null,L,V,b,null)}}let I=b.children;for(let L=0,J=I.length;L<J;L++)E(I[L],A,R,N,_)}}function a0(s,e,t){let n=t.isWebGL2;function i(){let P=!1,ue=new Je,W=null,he=new Je(0,0,0,0);return{setMask:function(le){W!==le&&!P&&(s.colorMask(le,le,le,le),W=le)},setLocked:function(le){P=le},setClear:function(le,Ie,je,We,Jt){Jt===!0&&(le*=We,Ie*=We,je*=We),ue.set(le,Ie,je,We),he.equals(ue)===!1&&(s.clearColor(le,Ie,je,We),he.copy(ue))},reset:function(){P=!1,W=null,he.set(-1,0,0,0)}}}function r(){let P=!1,ue=null,W=null,he=null;return{setTest:function(le){le?Te(2929):ye(2929)},setMask:function(le){ue!==le&&!P&&(s.depthMask(le),ue=le)},setFunc:function(le){if(W!==le){if(le)switch(le){case Ku:s.depthFunc(512);break;case Zu:s.depthFunc(519);break;case Ju:s.depthFunc(513);break;case Ks:s.depthFunc(515);break;case ju:s.depthFunc(514);break;case Qu:s.depthFunc(518);break;case ed:s.depthFunc(516);break;case td:s.depthFunc(517);break;default:s.depthFunc(515)}else s.depthFunc(515);W=le}},setLocked:function(le){P=le},setClear:function(le){he!==le&&(s.clearDepth(le),he=le)},reset:function(){P=!1,ue=null,W=null,he=null}}}function a(){let P=!1,ue=null,W=null,he=null,le=null,Ie=null,je=null,We=null,Jt=null;return{setTest:function(ke){P||(ke?Te(2960):ye(2960))},setMask:function(ke){ue!==ke&&!P&&(s.stencilMask(ke),ue=ke)},setFunc:function(ke,Ht,vt){(W!==ke||he!==Ht||le!==vt)&&(s.stencilFunc(ke,Ht,vt),W=ke,he=Ht,le=vt)},setOp:function(ke,Ht,vt){(Ie!==ke||je!==Ht||We!==vt)&&(s.stencilOp(ke,Ht,vt),Ie=ke,je=Ht,We=vt)},setLocked:function(ke){P=ke},setClear:function(ke){Jt!==ke&&(s.clearStencil(ke),Jt=ke)},reset:function(){P=!1,ue=null,W=null,he=null,le=null,Ie=null,je=null,We=null,Jt=null}}}let o=new i,l=new r,c=new a,h=new WeakMap,u=new WeakMap,d={},m={},g=new WeakMap,p=[],f=null,x=!1,M=null,E=null,b=null,A=null,R=null,N=null,_=null,S=!1,I=null,L=null,J=null,V=null,F=null,T=s.getParameter(35661),C=!1,Z=0,H=s.getParameter(7938);H.indexOf("WebGL")!==-1?(Z=parseFloat(/^WebGL (\d)/.exec(H)[1]),C=Z>=1):H.indexOf("OpenGL ES")!==-1&&(Z=parseFloat(/^OpenGL ES (\d)/.exec(H)[1]),C=Z>=2);let D=null,B={},Q=s.getParameter(3088),j=s.getParameter(2978),se=new Je().fromArray(Q),de=new Je().fromArray(j);function ve(P,ue,W){let he=new Uint8Array(4),le=s.createTexture();s.bindTexture(P,le),s.texParameteri(P,10241,9728),s.texParameteri(P,10240,9728);for(let Ie=0;Ie<W;Ie++)s.texImage2D(ue+Ie,0,6408,1,1,0,6408,5121,he);return le}let k={};k[3553]=ve(3553,3553,1),k[34067]=ve(34067,34069,6),o.setClear(0,0,0,1),l.setClear(1),c.setClear(0),Te(2929),l.setFunc(Ks),Ke(!1),st(jo),Te(2884),Ce(tn);function Te(P){d[P]!==!0&&(s.enable(P),d[P]=!0)}function ye(P){d[P]!==!1&&(s.disable(P),d[P]=!1)}function $(P,ue){return m[P]!==ue?(s.bindFramebuffer(P,ue),m[P]=ue,n&&(P===36009&&(m[36160]=ue),P===36160&&(m[36009]=ue)),!0):!1}function ee(P,ue){let W=p,he=!1;if(P)if(W=g.get(ue),W===void 0&&(W=[],g.set(ue,W)),P.isWebGLMultipleRenderTargets){let le=P.texture;if(W.length!==le.length||W[0]!==36064){for(let Ie=0,je=le.length;Ie<je;Ie++)W[Ie]=36064+Ie;W.length=le.length,he=!0}}else W[0]!==36064&&(W[0]=36064,he=!0);else W[0]!==1029&&(W[0]=1029,he=!0);he&&(t.isWebGL2?s.drawBuffers(W):e.get("WEBGL_draw_buffers").drawBuffersWEBGL(W))}function K(P){return f!==P?(s.useProgram(P),f=P,!0):!1}let re={[Gn]:32774,[Uu]:32778,[zu]:32779};if(n)re[ia]=32775,re[sa]=32776;else{let P=e.get("EXT_blend_minmax");P!==null&&(re[ia]=P.MIN_EXT,re[sa]=P.MAX_EXT)}let ae={[ku]:0,[Hu]:1,[Vu]:768,[ra]:770,[$u]:776,[Xu]:774,[Wu]:772,[Gu]:769,[oa]:771,[Yu]:775,[qu]:773};function Ce(P,ue,W,he,le,Ie,je,We){if(P===tn){x===!0&&(ye(3042),x=!1);return}if(x===!1&&(Te(3042),x=!0),P!==Bu){if(P!==M||We!==S){if((E!==Gn||R!==Gn)&&(s.blendEquation(32774),E=Gn,R=Gn),We)switch(P){case Vn:s.blendFuncSeparate(1,771,1,771);break;case ea:s.blendFunc(1,1);break;case ta:s.blendFuncSeparate(0,769,0,1);break;case na:s.blendFuncSeparate(0,768,0,770);break;default:console.error("THREE.WebGLState: Invalid blending: ",P);break}else switch(P){case Vn:s.blendFuncSeparate(770,771,1,771);break;case ea:s.blendFunc(770,1);break;case ta:s.blendFuncSeparate(0,769,0,1);break;case na:s.blendFunc(0,768);break;default:console.error("THREE.WebGLState: Invalid blending: ",P);break}b=null,A=null,N=null,_=null,M=P,S=We}return}le=le||ue,Ie=Ie||W,je=je||he,(ue!==E||le!==R)&&(s.blendEquationSeparate(re[ue],re[le]),E=ue,R=le),(W!==b||he!==A||Ie!==N||je!==_)&&(s.blendFuncSeparate(ae[W],ae[he],ae[Ie],ae[je]),b=W,A=he,N=Ie,_=je),M=P,S=null}function Le(P,ue){P.side===en?ye(2884):Te(2884);let W=P.side===bt;ue&&(W=!W),Ke(W),P.blending===Vn&&P.transparent===!1?Ce(tn):Ce(P.blending,P.blendEquation,P.blendSrc,P.blendDst,P.blendEquationAlpha,P.blendSrcAlpha,P.blendDstAlpha,P.premultipliedAlpha),l.setFunc(P.depthFunc),l.setTest(P.depthTest),l.setMask(P.depthWrite),o.setMask(P.colorWrite);let he=P.stencilWrite;c.setTest(he),he&&(c.setMask(P.stencilWriteMask),c.setFunc(P.stencilFunc,P.stencilRef,P.stencilFuncMask),c.setOp(P.stencilFail,P.stencilZFail,P.stencilZPass)),Ue(P.polygonOffset,P.polygonOffsetFactor,P.polygonOffsetUnits),P.alphaToCoverage===!0?Te(32926):ye(32926)}function Ke(P){I!==P&&(P?s.frontFace(2304):s.frontFace(2305),I=P)}function st(P){P!==Ou?(Te(2884),P!==L&&(P===jo?s.cullFace(1029):P===Nu?s.cullFace(1028):s.cullFace(1032))):ye(2884),L=P}function et(P){P!==J&&(C&&s.lineWidth(P),J=P)}function Ue(P,ue,W){P?(Te(32823),(V!==ue||F!==W)&&(s.polygonOffset(ue,W),V=ue,F=W)):ye(32823)}function kt(P){P?Te(3089):ye(3089)}function It(P){P===void 0&&(P=33984+T-1),D!==P&&(s.activeTexture(P),D=P)}function w(P,ue){D===null&&It();let W=B[D];W===void 0&&(W={type:void 0,texture:void 0},B[D]=W),(W.type!==P||W.texture!==ue)&&(s.bindTexture(P,ue||k[P]),W.type=P,W.texture=ue)}function v(){let P=B[D];P!==void 0&&P.type!==void 0&&(s.bindTexture(P.type,null),P.type=void 0,P.texture=void 0)}function X(){try{s.compressedTexImage2D.apply(s,arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function te(){try{s.texSubImage2D.apply(s,arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function ne(){try{s.texSubImage3D.apply(s,arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function ce(){try{s.compressedTexSubImage2D.apply(s,arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function Me(){try{s.texStorage2D.apply(s,arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function G(){try{s.texStorage3D.apply(s,arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function _e(){try{s.texImage2D.apply(s,arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function fe(){try{s.texImage3D.apply(s,arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function ge(P){se.equals(P)===!1&&(s.scissor(P.x,P.y,P.z,P.w),se.copy(P))}function pe(P){de.equals(P)===!1&&(s.viewport(P.x,P.y,P.z,P.w),de.copy(P))}function Se(P,ue){let W=u.get(ue);W===void 0&&(W=new WeakMap,u.set(ue,W));let he=W.get(P);he===void 0&&(he=s.getUniformBlockIndex(ue,P.name),W.set(P,he))}function De(P,ue){let he=u.get(ue).get(P);h.get(P)!==he&&(s.uniformBlockBinding(ue,he,P.__bindingPointIndex),h.set(P,he))}function Ge(){s.disable(3042),s.disable(2884),s.disable(2929),s.disable(32823),s.disable(3089),s.disable(2960),s.disable(32926),s.blendEquation(32774),s.blendFunc(1,0),s.blendFuncSeparate(1,0,1,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(513),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(519,0,4294967295),s.stencilOp(7680,7680,7680),s.clearStencil(0),s.cullFace(1029),s.frontFace(2305),s.polygonOffset(0,0),s.activeTexture(33984),s.bindFramebuffer(36160,null),n===!0&&(s.bindFramebuffer(36009,null),s.bindFramebuffer(36008,null)),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),d={},D=null,B={},m={},g=new WeakMap,p=[],f=null,x=!1,M=null,E=null,b=null,A=null,R=null,N=null,_=null,S=!1,I=null,L=null,J=null,V=null,F=null,se.set(0,0,s.canvas.width,s.canvas.height),de.set(0,0,s.canvas.width,s.canvas.height),o.reset(),l.reset(),c.reset()}return{buffers:{color:o,depth:l,stencil:c},enable:Te,disable:ye,bindFramebuffer:$,drawBuffers:ee,useProgram:K,setBlending:Ce,setMaterial:Le,setFlipSided:Ke,setCullFace:st,setLineWidth:et,setPolygonOffset:Ue,setScissorTest:kt,activeTexture:It,bindTexture:w,unbindTexture:v,compressedTexImage2D:X,texImage2D:_e,texImage3D:fe,updateUBOMapping:Se,uniformBlockBinding:De,texStorage2D:Me,texStorage3D:G,texSubImage2D:te,texSubImage3D:ne,compressedTexSubImage2D:ce,scissor:ge,viewport:pe,reset:Ge}}function l0(s,e,t,n,i,r,a){let o=i.isWebGL2,l=i.maxTextures,c=i.maxCubemapSize,h=i.maxTextureSize,u=i.maxSamples,d=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,m=/OculusBrowser/g.test(navigator.userAgent),g=new WeakMap,p,f=new WeakMap,x=!1;try{x=typeof OffscreenCanvas!="undefined"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch(w){}function M(w,v){return x?new OffscreenCanvas(w,v):Xi("canvas")}function E(w,v,X,te){let ne=1;if((w.width>te||w.height>te)&&(ne=te/Math.max(w.width,w.height)),ne<1||v===!0)if(typeof HTMLImageElement!="undefined"&&w instanceof HTMLImageElement||typeof HTMLCanvasElement!="undefined"&&w instanceof HTMLCanvasElement||typeof ImageBitmap!="undefined"&&w instanceof ImageBitmap){let ce=v?hr:Math.floor,Me=ce(ne*w.width),G=ce(ne*w.height);p===void 0&&(p=M(Me,G));let _e=X?M(Me,G):p;return _e.width=Me,_e.height=G,_e.getContext("2d").drawImage(w,0,0,Me,G),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+w.width+"x"+w.height+") to ("+Me+"x"+G+")."),_e}else return"data"in w&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+w.width+"x"+w.height+")."),w;return w}function b(w){return za(w.width)&&za(w.height)}function A(w){return o?!1:w.wrapS!==Et||w.wrapT!==Et||w.minFilter!==ct&&w.minFilter!==Mt}function R(w,v){return w.generateMipmaps&&v&&w.minFilter!==ct&&w.minFilter!==Mt}function N(w){s.generateMipmap(w)}function _(w,v,X,te,ne=!1){if(o===!1)return v;if(w!==null){if(s[w]!==void 0)return s[w];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+w+"'")}let ce=v;return v===6403&&(X===5126&&(ce=33326),X===5131&&(ce=33325),X===5121&&(ce=33321)),v===33319&&(X===5126&&(ce=33328),X===5131&&(ce=33327),X===5121&&(ce=33323)),v===6408&&(X===5126&&(ce=34836),X===5131&&(ce=34842),X===5121&&(ce=te===Ve&&ne===!1?35907:32856),X===32819&&(ce=32854),X===32820&&(ce=32855)),(ce===33325||ce===33326||ce===33327||ce===33328||ce===34842||ce===34836)&&e.get("EXT_color_buffer_float"),ce}function S(w,v,X){return R(w,X)===!0||w.isFramebufferTexture&&w.minFilter!==ct&&w.minFilter!==Mt?Math.log2(Math.max(v.width,v.height))+1:w.mipmaps!==void 0&&w.mipmaps.length>0?w.mipmaps.length:w.isCompressedTexture&&Array.isArray(w.image)?v.mipmaps.length:1}function I(w){return w===ct||w===la||w===ca?9728:9729}function L(w){let v=w.target;v.removeEventListener("dispose",L),V(v),v.isVideoTexture&&g.delete(v)}function J(w){let v=w.target;v.removeEventListener("dispose",J),T(v)}function V(w){let v=n.get(w);if(v.__webglInit===void 0)return;let X=w.source,te=f.get(X);if(te){let ne=te[v.__cacheKey];ne.usedTimes--,ne.usedTimes===0&&F(w),Object.keys(te).length===0&&f.delete(X)}n.remove(w)}function F(w){let v=n.get(w);s.deleteTexture(v.__webglTexture);let X=w.source,te=f.get(X);delete te[v.__cacheKey],a.memory.textures--}function T(w){let v=w.texture,X=n.get(w),te=n.get(v);if(te.__webglTexture!==void 0&&(s.deleteTexture(te.__webglTexture),a.memory.textures--),w.depthTexture&&w.depthTexture.dispose(),w.isWebGLCubeRenderTarget)for(let ne=0;ne<6;ne++)s.deleteFramebuffer(X.__webglFramebuffer[ne]),X.__webglDepthbuffer&&s.deleteRenderbuffer(X.__webglDepthbuffer[ne]);else{if(s.deleteFramebuffer(X.__webglFramebuffer),X.__webglDepthbuffer&&s.deleteRenderbuffer(X.__webglDepthbuffer),X.__webglMultisampledFramebuffer&&s.deleteFramebuffer(X.__webglMultisampledFramebuffer),X.__webglColorRenderbuffer)for(let ne=0;ne<X.__webglColorRenderbuffer.length;ne++)X.__webglColorRenderbuffer[ne]&&s.deleteRenderbuffer(X.__webglColorRenderbuffer[ne]);X.__webglDepthRenderbuffer&&s.deleteRenderbuffer(X.__webglDepthRenderbuffer)}if(w.isWebGLMultipleRenderTargets)for(let ne=0,ce=v.length;ne<ce;ne++){let Me=n.get(v[ne]);Me.__webglTexture&&(s.deleteTexture(Me.__webglTexture),a.memory.textures--),n.remove(v[ne])}n.remove(v),n.remove(w)}let C=0;function Z(){C=0}function H(){let w=C;return w>=l&&console.warn("THREE.WebGLTextures: Trying to use "+w+" texture units while this GPU supports only "+l),C+=1,w}function D(w){let v=[];return v.push(w.wrapS),v.push(w.wrapT),v.push(w.magFilter),v.push(w.minFilter),v.push(w.anisotropy),v.push(w.internalFormat),v.push(w.format),v.push(w.type),v.push(w.generateMipmaps),v.push(w.premultiplyAlpha),v.push(w.flipY),v.push(w.unpackAlignment),v.push(w.encoding),v.join()}function B(w,v){let X=n.get(w);if(w.isVideoTexture&&kt(w),w.isRenderTargetTexture===!1&&w.version>0&&X.__version!==w.version){let te=w.image;if(te===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(te.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{ye(X,w,v);return}}t.activeTexture(33984+v),t.bindTexture(3553,X.__webglTexture)}function Q(w,v){let X=n.get(w);if(w.version>0&&X.__version!==w.version){ye(X,w,v);return}t.activeTexture(33984+v),t.bindTexture(35866,X.__webglTexture)}function j(w,v){let X=n.get(w);if(w.version>0&&X.__version!==w.version){ye(X,w,v);return}t.activeTexture(33984+v),t.bindTexture(32879,X.__webglTexture)}function se(w,v){let X=n.get(w);if(w.version>0&&X.__version!==w.version){$(X,w,v);return}t.activeTexture(33984+v),t.bindTexture(34067,X.__webglTexture)}let de={[Qs]:10497,[Et]:33071,[er]:33648},ve={[ct]:9728,[la]:9984,[ca]:9986,[Mt]:9729,[cd]:9985,[Vi]:9987};function k(w,v,X){if(X?(s.texParameteri(w,10242,de[v.wrapS]),s.texParameteri(w,10243,de[v.wrapT]),(w===32879||w===35866)&&s.texParameteri(w,32882,de[v.wrapR]),s.texParameteri(w,10240,ve[v.magFilter]),s.texParameteri(w,10241,ve[v.minFilter])):(s.texParameteri(w,10242,33071),s.texParameteri(w,10243,33071),(w===32879||w===35866)&&s.texParameteri(w,32882,33071),(v.wrapS!==Et||v.wrapT!==Et)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),s.texParameteri(w,10240,I(v.magFilter)),s.texParameteri(w,10241,I(v.minFilter)),v.minFilter!==ct&&v.minFilter!==Mt&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),e.has("EXT_texture_filter_anisotropic")===!0){let te=e.get("EXT_texture_filter_anisotropic");if(v.type===wn&&e.has("OES_texture_float_linear")===!1||o===!1&&v.type===bi&&e.has("OES_texture_half_float_linear")===!1)return;(v.anisotropy>1||n.get(v).__currentAnisotropy)&&(s.texParameterf(w,te.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(v.anisotropy,i.getMaxAnisotropy())),n.get(v).__currentAnisotropy=v.anisotropy)}}function Te(w,v){let X=!1;w.__webglInit===void 0&&(w.__webglInit=!0,v.addEventListener("dispose",L));let te=v.source,ne=f.get(te);ne===void 0&&(ne={},f.set(te,ne));let ce=D(v);if(ce!==w.__cacheKey){ne[ce]===void 0&&(ne[ce]={texture:s.createTexture(),usedTimes:0},a.memory.textures++,X=!0),ne[ce].usedTimes++;let Me=ne[w.__cacheKey];Me!==void 0&&(ne[w.__cacheKey].usedTimes--,Me.usedTimes===0&&F(v)),w.__cacheKey=ce,w.__webglTexture=ne[ce].texture}return X}function ye(w,v,X){let te=3553;v.isDataArrayTexture&&(te=35866),v.isData3DTexture&&(te=32879);let ne=Te(w,v),ce=v.source;if(t.activeTexture(33984+X),t.bindTexture(te,w.__webglTexture),ce.version!==ce.__currentVersion||ne===!0){s.pixelStorei(37440,v.flipY),s.pixelStorei(37441,v.premultiplyAlpha),s.pixelStorei(3317,v.unpackAlignment),s.pixelStorei(37443,0);let Me=A(v)&&b(v.image)===!1,G=E(v.image,Me,!1,h);G=It(v,G);let _e=b(G)||o,fe=r.convert(v.format,v.encoding),ge=r.convert(v.type),pe=_(v.internalFormat,fe,ge,v.encoding,v.isVideoTexture);k(te,v,_e);let Se,De=v.mipmaps,Ge=o&&v.isVideoTexture!==!0,P=ce.__currentVersion===void 0||ne===!0,ue=S(v,G,_e);if(v.isDepthTexture)pe=6402,o?v.type===wn?pe=36012:v.type===Mn?pe=33190:v.type===Xn?pe=35056:pe=33189:v.type===wn&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),v.format===Sn&&pe===6402&&v.type!==ha&&v.type!==Mn&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),v.type=Mn,ge=r.convert(v.type)),v.format===Yn&&pe===6402&&(pe=34041,v.type!==Xn&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),v.type=Xn,ge=r.convert(v.type))),P&&(Ge?t.texStorage2D(3553,1,pe,G.width,G.height):t.texImage2D(3553,0,pe,G.width,G.height,0,fe,ge,null));else if(v.isDataTexture)if(De.length>0&&_e){Ge&&P&&t.texStorage2D(3553,ue,pe,De[0].width,De[0].height);for(let W=0,he=De.length;W<he;W++)Se=De[W],Ge?t.texSubImage2D(3553,W,0,0,Se.width,Se.height,fe,ge,Se.data):t.texImage2D(3553,W,pe,Se.width,Se.height,0,fe,ge,Se.data);v.generateMipmaps=!1}else Ge?(P&&t.texStorage2D(3553,ue,pe,G.width,G.height),t.texSubImage2D(3553,0,0,0,G.width,G.height,fe,ge,G.data)):t.texImage2D(3553,0,pe,G.width,G.height,0,fe,ge,G.data);else if(v.isCompressedTexture){Ge&&P&&t.texStorage2D(3553,ue,pe,De[0].width,De[0].height);for(let W=0,he=De.length;W<he;W++)Se=De[W],v.format!==Nt?fe!==null?Ge?t.compressedTexSubImage2D(3553,W,0,0,Se.width,Se.height,fe,Se.data):t.compressedTexImage2D(3553,W,pe,Se.width,Se.height,0,Se.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ge?t.texSubImage2D(3553,W,0,0,Se.width,Se.height,fe,ge,Se.data):t.texImage2D(3553,W,pe,Se.width,Se.height,0,fe,ge,Se.data)}else if(v.isDataArrayTexture)Ge?(P&&t.texStorage3D(35866,ue,pe,G.width,G.height,G.depth),t.texSubImage3D(35866,0,0,0,0,G.width,G.height,G.depth,fe,ge,G.data)):t.texImage3D(35866,0,pe,G.width,G.height,G.depth,0,fe,ge,G.data);else if(v.isData3DTexture)Ge?(P&&t.texStorage3D(32879,ue,pe,G.width,G.height,G.depth),t.texSubImage3D(32879,0,0,0,0,G.width,G.height,G.depth,fe,ge,G.data)):t.texImage3D(32879,0,pe,G.width,G.height,G.depth,0,fe,ge,G.data);else if(v.isFramebufferTexture){if(P)if(Ge)t.texStorage2D(3553,ue,pe,G.width,G.height);else{let W=G.width,he=G.height;for(let le=0;le<ue;le++)t.texImage2D(3553,le,pe,W,he,0,fe,ge,null),W>>=1,he>>=1}}else if(De.length>0&&_e){Ge&&P&&t.texStorage2D(3553,ue,pe,De[0].width,De[0].height);for(let W=0,he=De.length;W<he;W++)Se=De[W],Ge?t.texSubImage2D(3553,W,0,0,fe,ge,Se):t.texImage2D(3553,W,pe,fe,ge,Se);v.generateMipmaps=!1}else Ge?(P&&t.texStorage2D(3553,ue,pe,G.width,G.height),t.texSubImage2D(3553,0,0,0,fe,ge,G)):t.texImage2D(3553,0,pe,fe,ge,G);R(v,_e)&&N(te),ce.__currentVersion=ce.version,v.onUpdate&&v.onUpdate(v)}w.__version=v.version}function $(w,v,X){if(v.image.length!==6)return;let te=Te(w,v),ne=v.source;if(t.activeTexture(33984+X),t.bindTexture(34067,w.__webglTexture),ne.version!==ne.__currentVersion||te===!0){s.pixelStorei(37440,v.flipY),s.pixelStorei(37441,v.premultiplyAlpha),s.pixelStorei(3317,v.unpackAlignment),s.pixelStorei(37443,0);let ce=v.isCompressedTexture||v.image[0].isCompressedTexture,Me=v.image[0]&&v.image[0].isDataTexture,G=[];for(let W=0;W<6;W++)!ce&&!Me?G[W]=E(v.image[W],!1,!0,c):G[W]=Me?v.image[W].image:v.image[W],G[W]=It(v,G[W]);let _e=G[0],fe=b(_e)||o,ge=r.convert(v.format,v.encoding),pe=r.convert(v.type),Se=_(v.internalFormat,ge,pe,v.encoding),De=o&&v.isVideoTexture!==!0,Ge=ne.__currentVersion===void 0||te===!0,P=S(v,_e,fe);k(34067,v,fe);let ue;if(ce){De&&Ge&&t.texStorage2D(34067,P,Se,_e.width,_e.height);for(let W=0;W<6;W++){ue=G[W].mipmaps;for(let he=0;he<ue.length;he++){let le=ue[he];v.format!==Nt?ge!==null?De?t.compressedTexSubImage2D(34069+W,he,0,0,le.width,le.height,ge,le.data):t.compressedTexImage2D(34069+W,he,Se,le.width,le.height,0,le.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):De?t.texSubImage2D(34069+W,he,0,0,le.width,le.height,ge,pe,le.data):t.texImage2D(34069+W,he,Se,le.width,le.height,0,ge,pe,le.data)}}}else{ue=v.mipmaps,De&&Ge&&(ue.length>0&&P++,t.texStorage2D(34067,P,Se,G[0].width,G[0].height));for(let W=0;W<6;W++)if(Me){De?t.texSubImage2D(34069+W,0,0,0,G[W].width,G[W].height,ge,pe,G[W].data):t.texImage2D(34069+W,0,Se,G[W].width,G[W].height,0,ge,pe,G[W].data);for(let he=0;he<ue.length;he++){let Ie=ue[he].image[W].image;De?t.texSubImage2D(34069+W,he+1,0,0,Ie.width,Ie.height,ge,pe,Ie.data):t.texImage2D(34069+W,he+1,Se,Ie.width,Ie.height,0,ge,pe,Ie.data)}}else{De?t.texSubImage2D(34069+W,0,0,0,ge,pe,G[W]):t.texImage2D(34069+W,0,Se,ge,pe,G[W]);for(let he=0;he<ue.length;he++){let le=ue[he];De?t.texSubImage2D(34069+W,he+1,0,0,ge,pe,le.image[W]):t.texImage2D(34069+W,he+1,Se,ge,pe,le.image[W])}}}R(v,fe)&&N(34067),ne.__currentVersion=ne.version,v.onUpdate&&v.onUpdate(v)}w.__version=v.version}function ee(w,v,X,te,ne){let ce=r.convert(X.format,X.encoding),Me=r.convert(X.type),G=_(X.internalFormat,ce,Me,X.encoding);n.get(v).__hasExternalTextures||(ne===32879||ne===35866?t.texImage3D(ne,0,G,v.width,v.height,v.depth,0,ce,Me,null):t.texImage2D(ne,0,G,v.width,v.height,0,ce,Me,null)),t.bindFramebuffer(36160,w),Ue(v)?d.framebufferTexture2DMultisampleEXT(36160,te,ne,n.get(X).__webglTexture,0,et(v)):s.framebufferTexture2D(36160,te,ne,n.get(X).__webglTexture,0),t.bindFramebuffer(36160,null)}function K(w,v,X){if(s.bindRenderbuffer(36161,w),v.depthBuffer&&!v.stencilBuffer){let te=33189;if(X||Ue(v)){let ne=v.depthTexture;ne&&ne.isDepthTexture&&(ne.type===wn?te=36012:ne.type===Mn&&(te=33190));let ce=et(v);Ue(v)?d.renderbufferStorageMultisampleEXT(36161,ce,te,v.width,v.height):s.renderbufferStorageMultisample(36161,ce,te,v.width,v.height)}else s.renderbufferStorage(36161,te,v.width,v.height);s.framebufferRenderbuffer(36160,36096,36161,w)}else if(v.depthBuffer&&v.stencilBuffer){let te=et(v);X&&Ue(v)===!1?s.renderbufferStorageMultisample(36161,te,35056,v.width,v.height):Ue(v)?d.renderbufferStorageMultisampleEXT(36161,te,35056,v.width,v.height):s.renderbufferStorage(36161,34041,v.width,v.height),s.framebufferRenderbuffer(36160,33306,36161,w)}else{let te=v.isWebGLMultipleRenderTargets===!0?v.texture:[v.texture];for(let ne=0;ne<te.length;ne++){let ce=te[ne],Me=r.convert(ce.format,ce.encoding),G=r.convert(ce.type),_e=_(ce.internalFormat,Me,G,ce.encoding),fe=et(v);X&&Ue(v)===!1?s.renderbufferStorageMultisample(36161,fe,_e,v.width,v.height):Ue(v)?d.renderbufferStorageMultisampleEXT(36161,fe,_e,v.width,v.height):s.renderbufferStorage(36161,_e,v.width,v.height)}}s.bindRenderbuffer(36161,null)}function re(w,v){if(v&&v.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(36160,w),!(v.depthTexture&&v.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(v.depthTexture).__webglTexture||v.depthTexture.image.width!==v.width||v.depthTexture.image.height!==v.height)&&(v.depthTexture.image.width=v.width,v.depthTexture.image.height=v.height,v.depthTexture.needsUpdate=!0),B(v.depthTexture,0);let te=n.get(v.depthTexture).__webglTexture,ne=et(v);if(v.depthTexture.format===Sn)Ue(v)?d.framebufferTexture2DMultisampleEXT(36160,36096,3553,te,0,ne):s.framebufferTexture2D(36160,36096,3553,te,0);else if(v.depthTexture.format===Yn)Ue(v)?d.framebufferTexture2DMultisampleEXT(36160,33306,3553,te,0,ne):s.framebufferTexture2D(36160,33306,3553,te,0);else throw new Error("Unknown depthTexture format")}function ae(w){let v=n.get(w),X=w.isWebGLCubeRenderTarget===!0;if(w.depthTexture&&!v.__autoAllocateDepthBuffer){if(X)throw new Error("target.depthTexture not supported in Cube render targets");re(v.__webglFramebuffer,w)}else if(X){v.__webglDepthbuffer=[];for(let te=0;te<6;te++)t.bindFramebuffer(36160,v.__webglFramebuffer[te]),v.__webglDepthbuffer[te]=s.createRenderbuffer(),K(v.__webglDepthbuffer[te],w,!1)}else t.bindFramebuffer(36160,v.__webglFramebuffer),v.__webglDepthbuffer=s.createRenderbuffer(),K(v.__webglDepthbuffer,w,!1);t.bindFramebuffer(36160,null)}function Ce(w,v,X){let te=n.get(w);v!==void 0&&ee(te.__webglFramebuffer,w,w.texture,36064,3553),X!==void 0&&ae(w)}function Le(w){let v=w.texture,X=n.get(w),te=n.get(v);w.addEventListener("dispose",J),w.isWebGLMultipleRenderTargets!==!0&&(te.__webglTexture===void 0&&(te.__webglTexture=s.createTexture()),te.__version=v.version,a.memory.textures++);let ne=w.isWebGLCubeRenderTarget===!0,ce=w.isWebGLMultipleRenderTargets===!0,Me=b(w)||o;if(ne){X.__webglFramebuffer=[];for(let G=0;G<6;G++)X.__webglFramebuffer[G]=s.createFramebuffer()}else{if(X.__webglFramebuffer=s.createFramebuffer(),ce)if(i.drawBuffers){let G=w.texture;for(let _e=0,fe=G.length;_e<fe;_e++){let ge=n.get(G[_e]);ge.__webglTexture===void 0&&(ge.__webglTexture=s.createTexture(),a.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(o&&w.samples>0&&Ue(w)===!1){let G=ce?v:[v];X.__webglMultisampledFramebuffer=s.createFramebuffer(),X.__webglColorRenderbuffer=[],t.bindFramebuffer(36160,X.__webglMultisampledFramebuffer);for(let _e=0;_e<G.length;_e++){let fe=G[_e];X.__webglColorRenderbuffer[_e]=s.createRenderbuffer(),s.bindRenderbuffer(36161,X.__webglColorRenderbuffer[_e]);let ge=r.convert(fe.format,fe.encoding),pe=r.convert(fe.type),Se=_(fe.internalFormat,ge,pe,fe.encoding),De=et(w);s.renderbufferStorageMultisample(36161,De,Se,w.width,w.height),s.framebufferRenderbuffer(36160,36064+_e,36161,X.__webglColorRenderbuffer[_e])}s.bindRenderbuffer(36161,null),w.depthBuffer&&(X.__webglDepthRenderbuffer=s.createRenderbuffer(),K(X.__webglDepthRenderbuffer,w,!0)),t.bindFramebuffer(36160,null)}}if(ne){t.bindTexture(34067,te.__webglTexture),k(34067,v,Me);for(let G=0;G<6;G++)ee(X.__webglFramebuffer[G],w,v,36064,34069+G);R(v,Me)&&N(34067),t.unbindTexture()}else if(ce){let G=w.texture;for(let _e=0,fe=G.length;_e<fe;_e++){let ge=G[_e],pe=n.get(ge);t.bindTexture(3553,pe.__webglTexture),k(3553,ge,Me),ee(X.__webglFramebuffer,w,ge,36064+_e,3553),R(ge,Me)&&N(3553)}t.unbindTexture()}else{let G=3553;(w.isWebGL3DRenderTarget||w.isWebGLArrayRenderTarget)&&(o?G=w.isWebGL3DRenderTarget?32879:35866:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),t.bindTexture(G,te.__webglTexture),k(G,v,Me),ee(X.__webglFramebuffer,w,v,36064,G),R(v,Me)&&N(G),t.unbindTexture()}w.depthBuffer&&ae(w)}function Ke(w){let v=b(w)||o,X=w.isWebGLMultipleRenderTargets===!0?w.texture:[w.texture];for(let te=0,ne=X.length;te<ne;te++){let ce=X[te];if(R(ce,v)){let Me=w.isWebGLCubeRenderTarget?34067:3553,G=n.get(ce).__webglTexture;t.bindTexture(Me,G),N(Me),t.unbindTexture()}}}function st(w){if(o&&w.samples>0&&Ue(w)===!1){let v=w.isWebGLMultipleRenderTargets?w.texture:[w.texture],X=w.width,te=w.height,ne=16384,ce=[],Me=w.stencilBuffer?33306:36096,G=n.get(w),_e=w.isWebGLMultipleRenderTargets===!0;if(_e)for(let fe=0;fe<v.length;fe++)t.bindFramebuffer(36160,G.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(36160,36064+fe,36161,null),t.bindFramebuffer(36160,G.__webglFramebuffer),s.framebufferTexture2D(36009,36064+fe,3553,null,0);t.bindFramebuffer(36008,G.__webglMultisampledFramebuffer),t.bindFramebuffer(36009,G.__webglFramebuffer);for(let fe=0;fe<v.length;fe++){ce.push(36064+fe),w.depthBuffer&&ce.push(Me);let ge=G.__ignoreDepthValues!==void 0?G.__ignoreDepthValues:!1;if(ge===!1&&(w.depthBuffer&&(ne|=256),w.stencilBuffer&&(ne|=1024)),_e&&s.framebufferRenderbuffer(36008,36064,36161,G.__webglColorRenderbuffer[fe]),ge===!0&&(s.invalidateFramebuffer(36008,[Me]),s.invalidateFramebuffer(36009,[Me])),_e){let pe=n.get(v[fe]).__webglTexture;s.framebufferTexture2D(36009,36064,3553,pe,0)}s.blitFramebuffer(0,0,X,te,0,0,X,te,ne,9728),m&&s.invalidateFramebuffer(36008,ce)}if(t.bindFramebuffer(36008,null),t.bindFramebuffer(36009,null),_e)for(let fe=0;fe<v.length;fe++){t.bindFramebuffer(36160,G.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(36160,36064+fe,36161,G.__webglColorRenderbuffer[fe]);let ge=n.get(v[fe]).__webglTexture;t.bindFramebuffer(36160,G.__webglFramebuffer),s.framebufferTexture2D(36009,36064+fe,3553,ge,0)}t.bindFramebuffer(36009,G.__webglMultisampledFramebuffer)}}function et(w){return Math.min(u,w.samples)}function Ue(w){let v=n.get(w);return o&&w.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&v.__useRenderToTexture!==!1}function kt(w){let v=a.render.frame;g.get(w)!==v&&(g.set(w,v),w.update())}function It(w,v){let X=w.encoding,te=w.format,ne=w.type;return w.isCompressedTexture===!0||w.isVideoTexture===!0||w.format===ar||X!==An&&(X===Ve?o===!1?e.has("EXT_sRGB")===!0&&te===Nt?(w.format=ar,w.minFilter=Mt,w.generateMipmaps=!1):v=fr.sRGBToLinear(v):(te!==Nt||ne!==bn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture encoding:",X)),v}this.allocateTextureUnit=H,this.resetTextureUnits=Z,this.setTexture2D=B,this.setTexture2DArray=Q,this.setTexture3D=j,this.setTextureCube=se,this.rebindTextures=Ce,this.setupRenderTarget=Le,this.updateRenderTargetMipmap=Ke,this.updateMultisampleRenderTarget=st,this.setupDepthRenderbuffer=ae,this.setupFrameBufferTexture=ee,this.useMultisampledRTT=Ue}function c0(s,e,t){let n=t.isWebGL2;function i(r,a=null){let o;if(r===bn)return 5121;if(r===fd)return 32819;if(r===pd)return 32820;if(r===hd)return 5120;if(r===ud)return 5122;if(r===ha)return 5123;if(r===dd)return 5124;if(r===Mn)return 5125;if(r===wn)return 5126;if(r===bi)return n?5131:(o=e.get("OES_texture_half_float"),o!==null?o.HALF_FLOAT_OES:null);if(r===md)return 6406;if(r===Nt)return 6408;if(r===_d)return 6409;if(r===xd)return 6410;if(r===Sn)return 6402;if(r===Yn)return 34041;if(r===vd)return 6403;if(r===gd)return console.warn("THREE.WebGLRenderer: THREE.RGBFormat has been removed. Use THREE.RGBAFormat instead. https://github.com/mrdoob/three.js/pull/23228"),6408;if(r===ar)return o=e.get("EXT_sRGB"),o!==null?o.SRGB_ALPHA_EXT:null;if(r===yd)return 36244;if(r===bd)return 33319;if(r===Md)return 33320;if(r===wd)return 36249;if(r===tr||r===nr||r===ir||r===sr)if(a===Ve)if(o=e.get("WEBGL_compressed_texture_s3tc_srgb"),o!==null){if(r===tr)return o.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(r===nr)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(r===ir)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(r===sr)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(o=e.get("WEBGL_compressed_texture_s3tc"),o!==null){if(r===tr)return o.COMPRESSED_RGB_S3TC_DXT1_EXT;if(r===nr)return o.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(r===ir)return o.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(r===sr)return o.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(r===ua||r===da||r===fa||r===pa)if(o=e.get("WEBGL_compressed_texture_pvrtc"),o!==null){if(r===ua)return o.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(r===da)return o.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(r===fa)return o.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(r===pa)return o.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(r===Sd)return o=e.get("WEBGL_compressed_texture_etc1"),o!==null?o.COMPRESSED_RGB_ETC1_WEBGL:null;if(r===ma||r===ga)if(o=e.get("WEBGL_compressed_texture_etc"),o!==null){if(r===ma)return a===Ve?o.COMPRESSED_SRGB8_ETC2:o.COMPRESSED_RGB8_ETC2;if(r===ga)return a===Ve?o.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:o.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(r===_a||r===xa||r===va||r===ya||r===ba||r===Ma||r===wa||r===Sa||r===Aa||r===Ea||r===Ta||r===Ca||r===La||r===Ra)if(o=e.get("WEBGL_compressed_texture_astc"),o!==null){if(r===_a)return a===Ve?o.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:o.COMPRESSED_RGBA_ASTC_4x4_KHR;if(r===xa)return a===Ve?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:o.COMPRESSED_RGBA_ASTC_5x4_KHR;if(r===va)return a===Ve?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:o.COMPRESSED_RGBA_ASTC_5x5_KHR;if(r===ya)return a===Ve?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:o.COMPRESSED_RGBA_ASTC_6x5_KHR;if(r===ba)return a===Ve?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:o.COMPRESSED_RGBA_ASTC_6x6_KHR;if(r===Ma)return a===Ve?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:o.COMPRESSED_RGBA_ASTC_8x5_KHR;if(r===wa)return a===Ve?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:o.COMPRESSED_RGBA_ASTC_8x6_KHR;if(r===Sa)return a===Ve?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:o.COMPRESSED_RGBA_ASTC_8x8_KHR;if(r===Aa)return a===Ve?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:o.COMPRESSED_RGBA_ASTC_10x5_KHR;if(r===Ea)return a===Ve?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:o.COMPRESSED_RGBA_ASTC_10x6_KHR;if(r===Ta)return a===Ve?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:o.COMPRESSED_RGBA_ASTC_10x8_KHR;if(r===Ca)return a===Ve?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:o.COMPRESSED_RGBA_ASTC_10x10_KHR;if(r===La)return a===Ve?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:o.COMPRESSED_RGBA_ASTC_12x10_KHR;if(r===Ra)return a===Ve?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:o.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(r===Pa)if(o=e.get("EXT_texture_compression_bptc"),o!==null){if(r===Pa)return a===Ve?o.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:o.COMPRESSED_RGBA_BPTC_UNORM_EXT}else return null;return r===Xn?n?34042:(o=e.get("WEBGL_depth_texture"),o!==null?o.UNSIGNED_INT_24_8_WEBGL:null):s[r]!==void 0?s[r]:null}return{convert:i}}var Fl=class extends ht{constructor(e=[]){super();this.isArrayCamera=!0,this.cameras=e}},Nn=class extends tt{constructor(){super();this.isGroup=!0,this.type="Group"}},h0={type:"move"},xs=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Nn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Nn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new z,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new z),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Nn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new z,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new z),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let i=null,r=null,a=null,o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(let p of e.hand.values()){let f=t.getJointPose(p,n);if(c.joints[p.jointName]===void 0){let M=new Nn;M.matrixAutoUpdate=!1,M.visible=!1,c.joints[p.jointName]=M,c.add(M)}let x=c.joints[p.jointName];f!==null&&(x.matrix.fromArray(f.transform.matrix),x.matrix.decompose(x.position,x.rotation,x.scale),x.jointRadius=f.radius),x.visible=f!==null}let h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],d=h.position.distanceTo(u.position),m=.02,g=.005;c.inputState.pinching&&d>m+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&d<=m-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(i=t.getPose(e.targetRaySpace,n),i===null&&r!==null&&(i=r),i!==null&&(o.matrix.fromArray(i.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),i.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(i.linearVelocity)):o.hasLinearVelocity=!1,i.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(i.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(h0)))}return o!==null&&(o.visible=i!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}},Bl=class extends wt{constructor(e,t,n,i,r,a,o,l,c,h){if(h=h!==void 0?h:Sn,h!==Sn&&h!==Yn)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===Sn&&(n=Mn),n===void 0&&h===Yn&&(n=Xn),super(null,i,r,a,o,l,h,n,c),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=o!==void 0?o:ct,this.minFilter=l!==void 0?l:ct,this.flipY=!1,this.generateMipmaps=!1}},Ul=class extends Tn{constructor(e,t){super();let n=this,i=null,r=1,a=null,o="local-floor",l=null,c=null,h=null,u=null,d=null,m=null,g=t.getContextAttributes(),p=null,f=null,x=[],M=[],E=new ht;E.layers.enable(1),E.viewport=new Je;let b=new ht;b.layers.enable(2),b.viewport=new Je;let A=[E,b],R=new Fl;R.layers.enable(1),R.layers.enable(2);let N=null,_=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(D){let B=x[D];return B===void 0&&(B=new xs,x[D]=B),B.getTargetRaySpace()},this.getControllerGrip=function(D){let B=x[D];return B===void 0&&(B=new xs,x[D]=B),B.getGripSpace()},this.getHand=function(D){let B=x[D];return B===void 0&&(B=new xs,x[D]=B),B.getHandSpace()};function S(D){let B=M.indexOf(D.inputSource);if(B===-1)return;let Q=x[B];Q!==void 0&&Q.dispatchEvent({type:D.type,data:D.inputSource})}function I(){i.removeEventListener("select",S),i.removeEventListener("selectstart",S),i.removeEventListener("selectend",S),i.removeEventListener("squeeze",S),i.removeEventListener("squeezestart",S),i.removeEventListener("squeezeend",S),i.removeEventListener("end",I),i.removeEventListener("inputsourceschange",L);for(let D=0;D<x.length;D++){let B=M[D];B!==null&&(M[D]=null,x[D].disconnect(B))}N=null,_=null,e.setRenderTarget(p),d=null,u=null,h=null,i=null,f=null,H.stop(),n.isPresenting=!1,n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(D){r=D,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(D){o=D,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function(D){l=D},this.getBaseLayer=function(){return u!==null?u:d},this.getBinding=function(){return h},this.getFrame=function(){return m},this.getSession=function(){return i},this.setSession=async function(D){if(i=D,i!==null){if(p=e.getRenderTarget(),i.addEventListener("select",S),i.addEventListener("selectstart",S),i.addEventListener("selectend",S),i.addEventListener("squeeze",S),i.addEventListener("squeezestart",S),i.addEventListener("squeezeend",S),i.addEventListener("end",I),i.addEventListener("inputsourceschange",L),g.xrCompatible!==!0&&await t.makeXRCompatible(),i.renderState.layers===void 0||e.capabilities.isWebGL2===!1){let B={antialias:i.renderState.layers===void 0?g.antialias:!0,alpha:g.alpha,depth:g.depth,stencil:g.stencil,framebufferScaleFactor:r};d=new XRWebGLLayer(i,t,B),i.updateRenderState({baseLayer:d}),f=new nn(d.framebufferWidth,d.framebufferHeight,{format:Nt,type:bn,encoding:e.outputEncoding,stencilBuffer:g.stencil})}else{let B=null,Q=null,j=null;g.depth&&(j=g.stencil?35056:33190,B=g.stencil?Yn:Sn,Q=g.stencil?Xn:Mn);let se={colorFormat:32856,depthFormat:j,scaleFactor:r};h=new XRWebGLBinding(i,t),u=h.createProjectionLayer(se),i.updateRenderState({layers:[u]}),f=new nn(u.textureWidth,u.textureHeight,{format:Nt,type:bn,depthTexture:new Bl(u.textureWidth,u.textureHeight,Q,void 0,void 0,void 0,void 0,void 0,void 0,B),stencilBuffer:g.stencil,encoding:e.outputEncoding,samples:g.antialias?4:0});let de=e.properties.get(f);de.__ignoreDepthValues=u.ignoreDepthValues}f.isXRRenderTarget=!0,this.setFoveation(1),l=null,a=await i.requestReferenceSpace(o),H.setContext(i),H.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}};function L(D){for(let B=0;B<D.removed.length;B++){let Q=D.removed[B],j=M.indexOf(Q);j>=0&&(M[j]=null,x[j].dispatchEvent({type:"disconnected",data:Q}))}for(let B=0;B<D.added.length;B++){let Q=D.added[B],j=M.indexOf(Q);if(j===-1){for(let de=0;de<x.length;de++)if(de>=M.length){M.push(Q),j=de;break}else if(M[de]===null){M[de]=Q,j=de;break}if(j===-1)break}let se=x[j];se&&se.dispatchEvent({type:"connected",data:Q})}}let J=new z,V=new z;function F(D,B,Q){J.setFromMatrixPosition(B.matrixWorld),V.setFromMatrixPosition(Q.matrixWorld);let j=J.distanceTo(V),se=B.projectionMatrix.elements,de=Q.projectionMatrix.elements,ve=se[14]/(se[10]-1),k=se[14]/(se[10]+1),Te=(se[9]+1)/se[5],ye=(se[9]-1)/se[5],$=(se[8]-1)/se[0],ee=(de[8]+1)/de[0],K=ve*$,re=ve*ee,ae=j/(-$+ee),Ce=ae*-$;B.matrixWorld.decompose(D.position,D.quaternion,D.scale),D.translateX(Ce),D.translateZ(ae),D.matrixWorld.compose(D.position,D.quaternion,D.scale),D.matrixWorldInverse.copy(D.matrixWorld).invert();let Le=ve+ae,Ke=k+ae,st=K-Ce,et=re+(j-Ce),Ue=Te*k/Ke*Le,kt=ye*k/Ke*Le;D.projectionMatrix.makePerspective(st,et,Ue,kt,Le,Ke)}function T(D,B){B===null?D.matrixWorld.copy(D.matrix):D.matrixWorld.multiplyMatrices(B.matrixWorld,D.matrix),D.matrixWorldInverse.copy(D.matrixWorld).invert()}this.updateCamera=function(D){if(i===null)return;R.near=b.near=E.near=D.near,R.far=b.far=E.far=D.far,(N!==R.near||_!==R.far)&&(i.updateRenderState({depthNear:R.near,depthFar:R.far}),N=R.near,_=R.far);let B=D.parent,Q=R.cameras;T(R,B);for(let se=0;se<Q.length;se++)T(Q[se],B);R.matrixWorld.decompose(R.position,R.quaternion,R.scale),D.matrix.copy(R.matrix),D.matrix.decompose(D.position,D.quaternion,D.scale);let j=D.children;for(let se=0,de=j.length;se<de;se++)j[se].updateMatrixWorld(!0);Q.length===2?F(R,E,b):R.projectionMatrix.copy(E.projectionMatrix)},this.getCamera=function(){return R},this.getFoveation=function(){if(u!==null)return u.fixedFoveation;if(d!==null)return d.fixedFoveation},this.setFoveation=function(D){u!==null&&(u.fixedFoveation=D),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=D)};let C=null;function Z(D,B){if(c=B.getViewerPose(l||a),m=B,c!==null){let Q=c.views;d!==null&&(e.setRenderTargetFramebuffer(f,d.framebuffer),e.setRenderTarget(f));let j=!1;Q.length!==R.cameras.length&&(R.cameras.length=0,j=!0);for(let se=0;se<Q.length;se++){let de=Q[se],ve=null;if(d!==null)ve=d.getViewport(de);else{let Te=h.getViewSubImage(u,de);ve=Te.viewport,se===0&&(e.setRenderTargetTextures(f,Te.colorTexture,u.ignoreDepthValues?void 0:Te.depthStencilTexture),e.setRenderTarget(f))}let k=A[se];k===void 0&&(k=new ht,k.layers.enable(se),k.viewport=new Je,A[se]=k),k.matrix.fromArray(de.transform.matrix),k.projectionMatrix.fromArray(de.projectionMatrix),k.viewport.set(ve.x,ve.y,ve.width,ve.height),se===0&&R.matrix.copy(k.matrix),j===!0&&R.cameras.push(k)}}for(let Q=0;Q<x.length;Q++){let j=M[Q],se=x[Q];j!==null&&se!==void 0&&se.update(j,B,l||a)}C&&C(D,B),m=null}let H=new il;H.setAnimationLoop(Z),this.setAnimationLoop=function(D){C=D},this.dispose=function(){}}};function u0(s,e){function t(p,f){p.fogColor.value.copy(f.color),f.isFog?(p.fogNear.value=f.near,p.fogFar.value=f.far):f.isFogExp2&&(p.fogDensity.value=f.density)}function n(p,f,x,M,E){f.isMeshBasicMaterial||f.isMeshLambertMaterial?i(p,f):f.isMeshToonMaterial?(i(p,f),h(p,f)):f.isMeshPhongMaterial?(i(p,f),c(p,f)):f.isMeshStandardMaterial?(i(p,f),u(p,f),f.isMeshPhysicalMaterial&&d(p,f,E)):f.isMeshMatcapMaterial?(i(p,f),m(p,f)):f.isMeshDepthMaterial?i(p,f):f.isMeshDistanceMaterial?(i(p,f),g(p,f)):f.isMeshNormalMaterial?i(p,f):f.isLineBasicMaterial?(r(p,f),f.isLineDashedMaterial&&a(p,f)):f.isPointsMaterial?o(p,f,x,M):f.isSpriteMaterial?l(p,f):f.isShadowMaterial?(p.color.value.copy(f.color),p.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function i(p,f){p.opacity.value=f.opacity,f.color&&p.diffuse.value.copy(f.color),f.emissive&&p.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(p.map.value=f.map),f.alphaMap&&(p.alphaMap.value=f.alphaMap),f.bumpMap&&(p.bumpMap.value=f.bumpMap,p.bumpScale.value=f.bumpScale,f.side===bt&&(p.bumpScale.value*=-1)),f.displacementMap&&(p.displacementMap.value=f.displacementMap,p.displacementScale.value=f.displacementScale,p.displacementBias.value=f.displacementBias),f.emissiveMap&&(p.emissiveMap.value=f.emissiveMap),f.normalMap&&(p.normalMap.value=f.normalMap,p.normalScale.value.copy(f.normalScale),f.side===bt&&p.normalScale.value.negate()),f.specularMap&&(p.specularMap.value=f.specularMap),f.alphaTest>0&&(p.alphaTest.value=f.alphaTest);let x=e.get(f).envMap;if(x&&(p.envMap.value=x,p.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,p.reflectivity.value=f.reflectivity,p.ior.value=f.ior,p.refractionRatio.value=f.refractionRatio),f.lightMap){p.lightMap.value=f.lightMap;let b=s.physicallyCorrectLights!==!0?Math.PI:1;p.lightMapIntensity.value=f.lightMapIntensity*b}f.aoMap&&(p.aoMap.value=f.aoMap,p.aoMapIntensity.value=f.aoMapIntensity);let M;f.map?M=f.map:f.specularMap?M=f.specularMap:f.displacementMap?M=f.displacementMap:f.normalMap?M=f.normalMap:f.bumpMap?M=f.bumpMap:f.roughnessMap?M=f.roughnessMap:f.metalnessMap?M=f.metalnessMap:f.alphaMap?M=f.alphaMap:f.emissiveMap?M=f.emissiveMap:f.clearcoatMap?M=f.clearcoatMap:f.clearcoatNormalMap?M=f.clearcoatNormalMap:f.clearcoatRoughnessMap?M=f.clearcoatRoughnessMap:f.iridescenceMap?M=f.iridescenceMap:f.iridescenceThicknessMap?M=f.iridescenceThicknessMap:f.specularIntensityMap?M=f.specularIntensityMap:f.specularColorMap?M=f.specularColorMap:f.transmissionMap?M=f.transmissionMap:f.thicknessMap?M=f.thicknessMap:f.sheenColorMap?M=f.sheenColorMap:f.sheenRoughnessMap&&(M=f.sheenRoughnessMap),M!==void 0&&(M.isWebGLRenderTarget&&(M=M.texture),M.matrixAutoUpdate===!0&&M.updateMatrix(),p.uvTransform.value.copy(M.matrix));let E;f.aoMap?E=f.aoMap:f.lightMap&&(E=f.lightMap),E!==void 0&&(E.isWebGLRenderTarget&&(E=E.texture),E.matrixAutoUpdate===!0&&E.updateMatrix(),p.uv2Transform.value.copy(E.matrix))}function r(p,f){p.diffuse.value.copy(f.color),p.opacity.value=f.opacity}function a(p,f){p.dashSize.value=f.dashSize,p.totalSize.value=f.dashSize+f.gapSize,p.scale.value=f.scale}function o(p,f,x,M){p.diffuse.value.copy(f.color),p.opacity.value=f.opacity,p.size.value=f.size*x,p.scale.value=M*.5,f.map&&(p.map.value=f.map),f.alphaMap&&(p.alphaMap.value=f.alphaMap),f.alphaTest>0&&(p.alphaTest.value=f.alphaTest);let E;f.map?E=f.map:f.alphaMap&&(E=f.alphaMap),E!==void 0&&(E.matrixAutoUpdate===!0&&E.updateMatrix(),p.uvTransform.value.copy(E.matrix))}function l(p,f){p.diffuse.value.copy(f.color),p.opacity.value=f.opacity,p.rotation.value=f.rotation,f.map&&(p.map.value=f.map),f.alphaMap&&(p.alphaMap.value=f.alphaMap),f.alphaTest>0&&(p.alphaTest.value=f.alphaTest);let x;f.map?x=f.map:f.alphaMap&&(x=f.alphaMap),x!==void 0&&(x.matrixAutoUpdate===!0&&x.updateMatrix(),p.uvTransform.value.copy(x.matrix))}function c(p,f){p.specular.value.copy(f.specular),p.shininess.value=Math.max(f.shininess,1e-4)}function h(p,f){f.gradientMap&&(p.gradientMap.value=f.gradientMap)}function u(p,f){p.roughness.value=f.roughness,p.metalness.value=f.metalness,f.roughnessMap&&(p.roughnessMap.value=f.roughnessMap),f.metalnessMap&&(p.metalnessMap.value=f.metalnessMap),e.get(f).envMap&&(p.envMapIntensity.value=f.envMapIntensity)}function d(p,f,x){p.ior.value=f.ior,f.sheen>0&&(p.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),p.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(p.sheenColorMap.value=f.sheenColorMap),f.sheenRoughnessMap&&(p.sheenRoughnessMap.value=f.sheenRoughnessMap)),f.clearcoat>0&&(p.clearcoat.value=f.clearcoat,p.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(p.clearcoatMap.value=f.clearcoatMap),f.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap),f.clearcoatNormalMap&&(p.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),p.clearcoatNormalMap.value=f.clearcoatNormalMap,f.side===bt&&p.clearcoatNormalScale.value.negate())),f.iridescence>0&&(p.iridescence.value=f.iridescence,p.iridescenceIOR.value=f.iridescenceIOR,p.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(p.iridescenceMap.value=f.iridescenceMap),f.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=f.iridescenceThicknessMap)),f.transmission>0&&(p.transmission.value=f.transmission,p.transmissionSamplerMap.value=x.texture,p.transmissionSamplerSize.value.set(x.width,x.height),f.transmissionMap&&(p.transmissionMap.value=f.transmissionMap),p.thickness.value=f.thickness,f.thicknessMap&&(p.thicknessMap.value=f.thicknessMap),p.attenuationDistance.value=f.attenuationDistance,p.attenuationColor.value.copy(f.attenuationColor)),p.specularIntensity.value=f.specularIntensity,p.specularColor.value.copy(f.specularColor),f.specularIntensityMap&&(p.specularIntensityMap.value=f.specularIntensityMap),f.specularColorMap&&(p.specularColorMap.value=f.specularColorMap)}function m(p,f){f.matcap&&(p.matcap.value=f.matcap)}function g(p,f){p.referencePosition.value.copy(f.referencePosition),p.nearDistance.value=f.nearDistance,p.farDistance.value=f.farDistance}return{refreshFogUniforms:t,refreshMaterialUniforms:n}}function d0(s,e,t,n){let i={},r={},a=[],o=t.isWebGL2?s.getParameter(35375):0;function l(M,E){let b=E.program;n.uniformBlockBinding(M,b)}function c(M,E){let b=i[M.id];b===void 0&&(g(M),b=h(M),i[M.id]=b,M.addEventListener("dispose",f));let A=E.program;n.updateUBOMapping(M,A);let R=e.render.frame;r[M.id]!==R&&(d(M),r[M.id]=R)}function h(M){let E=u();M.__bindingPointIndex=E;let b=s.createBuffer(),A=M.__size,R=M.usage;return s.bindBuffer(35345,b),s.bufferData(35345,A,R),s.bindBuffer(35345,null),s.bindBufferBase(35345,E,b),b}function u(){for(let M=0;M<o;M++)if(a.indexOf(M)===-1)return a.push(M),M;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(M){let E=i[M.id],b=M.uniforms,A=M.__cache;s.bindBuffer(35345,E);for(let R=0,N=b.length;R<N;R++){let _=b[R];if(m(_,R,A)===!0){let S=_.value,I=_.__offset;typeof S=="number"?(_.__data[0]=S,s.bufferSubData(35345,I,_.__data)):(_.value.isMatrix3?(_.__data[0]=_.value.elements[0],_.__data[1]=_.value.elements[1],_.__data[2]=_.value.elements[2],_.__data[3]=_.value.elements[0],_.__data[4]=_.value.elements[3],_.__data[5]=_.value.elements[4],_.__data[6]=_.value.elements[5],_.__data[7]=_.value.elements[0],_.__data[8]=_.value.elements[6],_.__data[9]=_.value.elements[7],_.__data[10]=_.value.elements[8],_.__data[11]=_.value.elements[0]):S.toArray(_.__data),s.bufferSubData(35345,I,_.__data))}}s.bindBuffer(35345,null)}function m(M,E,b){let A=M.value;if(b[E]===void 0)return typeof A=="number"?b[E]=A:b[E]=A.clone(),!0;if(typeof A=="number"){if(b[E]!==A)return b[E]=A,!0}else{let R=b[E];if(R.equals(A)===!1)return R.copy(A),!0}return!1}function g(M){let E=M.uniforms,b=0,A=16,R=0;for(let N=0,_=E.length;N<_;N++){let S=E[N],I=p(S);if(S.__data=new Float32Array(I.storage/Float32Array.BYTES_PER_ELEMENT),S.__offset=b,N>0){R=b%A;let L=A-R;R!==0&&L-I.boundary<0&&(b+=A-R,S.__offset=b)}b+=I.storage}return R=b%A,R>0&&(b+=A-R),M.__size=b,M.__cache={},this}function p(M){let E=M.value,b={boundary:0,storage:0};return typeof E=="number"?(b.boundary=4,b.storage=4):E.isVector2?(b.boundary=8,b.storage=8):E.isVector3||E.isColor?(b.boundary=16,b.storage=12):E.isVector4?(b.boundary=16,b.storage=16):E.isMatrix3?(b.boundary=48,b.storage=48):E.isMatrix4?(b.boundary=64,b.storage=64):E.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",E),b}function f(M){let E=M.target;E.removeEventListener("dispose",f);let b=a.indexOf(E.__bindingPointIndex);a.splice(b,1),s.deleteBuffer(i[E.id]),delete i[E.id],delete r[E.id]}function x(){for(let M in i)s.deleteBuffer(i[M]);a=[],i={},r={}}return{bind:l,update:c,dispose:x}}function f0(){let s=Xi("canvas");return s.style.display="block",s}function $r(s={}){this.isWebGLRenderer=!0;let e=s.canvas!==void 0?s.canvas:f0(),t=s.context!==void 0?s.context:null,n=s.depth!==void 0?s.depth:!0,i=s.stencil!==void 0?s.stencil:!0,r=s.antialias!==void 0?s.antialias:!1,a=s.premultipliedAlpha!==void 0?s.premultipliedAlpha:!0,o=s.preserveDrawingBuffer!==void 0?s.preserveDrawingBuffer:!1,l=s.powerPreference!==void 0?s.powerPreference:"default",c=s.failIfMajorPerformanceCaveat!==void 0?s.failIfMajorPerformanceCaveat:!1,h;t!==null?h=t.getContextAttributes().alpha:h=s.alpha!==void 0?s.alpha:!1;let u=null,d=null,m=[],g=[];this.domElement=e,this.debug={checkShaderErrors:!0},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.outputEncoding=An,this.physicallyCorrectLights=!1,this.toneMapping=Wt,this.toneMappingExposure=1,Object.defineProperties(this,{gammaFactor:{get:function(){return console.warn("THREE.WebGLRenderer: .gammaFactor has been removed."),2},set:function(){console.warn("THREE.WebGLRenderer: .gammaFactor has been removed.")}}});let p=this,f=!1,x=0,M=0,E=null,b=-1,A=null,R=new Je,N=new Je,_=null,S=e.width,I=e.height,L=1,J=null,V=null,F=new Je(0,0,S,I),T=new Je(0,0,S,I),C=!1,Z=new ps,H=!1,D=!1,B=null,Q=new Ye,j=new Ne,se=new z,de={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function ve(){return E===null?L:1}let k=t;function Te(y,U){for(let q=0;q<y.length;q++){let O=y[q],Y=e.getContext(O,U);if(Y!==null)return Y}return null}try{let y={alpha:!0,depth:n,stencil:i,antialias:r,premultipliedAlpha:a,preserveDrawingBuffer:o,powerPreference:l,failIfMajorPerformanceCaveat:c};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${$s}`),e.addEventListener("webglcontextlost",Se,!1),e.addEventListener("webglcontextrestored",De,!1),e.addEventListener("webglcontextcreationerror",Ge,!1),k===null){let U=["webgl2","webgl","experimental-webgl"];if(p.isWebGL1Renderer===!0&&U.shift(),k=Te(U,y),k===null)throw Te(U)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}k.getShaderPrecisionFormat===void 0&&(k.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(y){throw console.error("THREE.WebGLRenderer: "+y.message),y}let ye,$,ee,K,re,ae,Ce,Le,Ke,st,et,Ue,kt,It,w,v,X,te,ne,ce,Me,G,_e,fe;function ge(){ye=new Om(k),$=new Cm(k,ye,s),ye.init($),G=new c0(k,ye,$),ee=new a0(k,ye,$),K=new Bm,re=new Kg,ae=new l0(k,ye,ee,re,$,G,K),Ce=new Rm(p),Le=new Dm(p),Ke=new Yd(k,$),_e=new Em(k,ye,Ke,$),st=new Nm(k,Ke,K,_e),et=new Hm(k,st,Ke,K),ne=new km(k,$,ae),v=new Lm(re),Ue=new $g(p,Ce,Le,ye,$,_e,v),kt=new u0(p,re),It=new Jg,w=new i0(ye,$),te=new Am(p,Ce,ee,et,h,a),X=new o0(p,et,$),fe=new d0(k,K,$,ee),ce=new Tm(k,ye,K,$),Me=new Fm(k,ye,K,$),K.programs=Ue.programs,p.capabilities=$,p.extensions=ye,p.properties=re,p.renderLists=It,p.shadowMap=X,p.state=ee,p.info=K}ge();let pe=new Ul(p,k);this.xr=pe,this.getContext=function(){return k},this.getContextAttributes=function(){return k.getContextAttributes()},this.forceContextLoss=function(){let y=ye.get("WEBGL_lose_context");y&&y.loseContext()},this.forceContextRestore=function(){let y=ye.get("WEBGL_lose_context");y&&y.restoreContext()},this.getPixelRatio=function(){return L},this.setPixelRatio=function(y){y!==void 0&&(L=y,this.setSize(S,I,!1))},this.getSize=function(y){return y.set(S,I)},this.setSize=function(y,U,q){if(pe.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}S=y,I=U,e.width=Math.floor(y*L),e.height=Math.floor(U*L),q!==!1&&(e.style.width=y+"px",e.style.height=U+"px"),this.setViewport(0,0,y,U)},this.getDrawingBufferSize=function(y){return y.set(S*L,I*L).floor()},this.setDrawingBufferSize=function(y,U,q){S=y,I=U,L=q,e.width=Math.floor(y*q),e.height=Math.floor(U*q),this.setViewport(0,0,y,U)},this.getCurrentViewport=function(y){return y.copy(R)},this.getViewport=function(y){return y.copy(F)},this.setViewport=function(y,U,q,O){y.isVector4?F.set(y.x,y.y,y.z,y.w):F.set(y,U,q,O),ee.viewport(R.copy(F).multiplyScalar(L).floor())},this.getScissor=function(y){return y.copy(T)},this.setScissor=function(y,U,q,O){y.isVector4?T.set(y.x,y.y,y.z,y.w):T.set(y,U,q,O),ee.scissor(N.copy(T).multiplyScalar(L).floor())},this.getScissorTest=function(){return C},this.setScissorTest=function(y){ee.setScissorTest(C=y)},this.setOpaqueSort=function(y){J=y},this.setTransparentSort=function(y){V=y},this.getClearColor=function(y){return y.copy(te.getClearColor())},this.setClearColor=function(){te.setClearColor.apply(te,arguments)},this.getClearAlpha=function(){return te.getClearAlpha()},this.setClearAlpha=function(){te.setClearAlpha.apply(te,arguments)},this.clear=function(y=!0,U=!0,q=!0){let O=0;y&&(O|=16384),U&&(O|=256),q&&(O|=1024),k.clear(O)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",Se,!1),e.removeEventListener("webglcontextrestored",De,!1),e.removeEventListener("webglcontextcreationerror",Ge,!1),It.dispose(),w.dispose(),re.dispose(),Ce.dispose(),Le.dispose(),et.dispose(),_e.dispose(),fe.dispose(),Ue.dispose(),pe.dispose(),pe.removeEventListener("sessionstart",Ie),pe.removeEventListener("sessionend",je),B&&(B.dispose(),B=null),We.stop()};function Se(y){y.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),f=!0}function De(){console.log("THREE.WebGLRenderer: Context Restored."),f=!1;let y=K.autoReset,U=X.enabled,q=X.autoUpdate,O=X.needsUpdate,Y=X.type;ge(),K.autoReset=y,X.enabled=U,X.autoUpdate=q,X.needsUpdate=O,X.type=Y}function Ge(y){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",y.statusMessage)}function P(y){let U=y.target;U.removeEventListener("dispose",P),ue(U)}function ue(y){W(y),re.remove(y)}function W(y){let U=re.get(y).programs;U!==void 0&&(U.forEach(function(q){Ue.releaseProgram(q)}),y.isShaderMaterial&&Ue.releaseShaderCache(y))}this.renderBufferDirect=function(y,U,q,O,Y,xe){U===null&&(U=de);let be=Y.isMesh&&Y.matrixWorld.determinant()<0,Ae=lc(y,U,q,O,Y);ee.setMaterial(O,be);let we=q.index,Fe=q.attributes.position;if(we===null){if(Fe===void 0||Fe.count===0)return}else if(we.count===0)return;let Re=1;O.wireframe===!0&&(we=st.getWireframeAttribute(q),Re=2),_e.setup(Y,O,Ae,q,we);let Pe,He=ce;we!==null&&(Pe=Ke.get(we),He=Me,He.setIndex(Pe));let gn=we!==null?we.count:Fe.count,Fn=q.drawRange.start*Re,Bn=q.drawRange.count*Re,Dt=xe!==null?xe.start*Re:0,Oe=xe!==null?xe.count*Re:Infinity,Un=Math.max(Fn,Dt),Xe=Math.min(gn,Fn+Bn,Dt+Oe)-1,yt=Math.max(0,Xe-Un+1);if(yt!==0){if(Y.isMesh)O.wireframe===!0?(ee.setLineWidth(O.wireframeLinewidth*ve()),He.setMode(1)):He.setMode(4);else if(Y.isLine){let jt=O.linewidth;jt===void 0&&(jt=1),ee.setLineWidth(jt*ve()),Y.isLineSegments?He.setMode(1):Y.isLineLoop?He.setMode(2):He.setMode(3)}else Y.isPoints?He.setMode(0):Y.isSprite&&He.setMode(4);if(Y.isInstancedMesh)He.renderInstances(Un,yt,Y.count);else if(q.isInstancedBufferGeometry){let jt=Math.min(q.instanceCount,q._maxInstanceCount);He.renderInstances(Un,yt,jt)}else He.render(Un,yt)}},this.compile=function(y,U){function q(O,Y,xe){O.transparent===!0&&O.side===en?(O.side=bt,O.needsUpdate=!0,Ri(O,Y,xe),O.side=Hn,O.needsUpdate=!0,Ri(O,Y,xe),O.side=en):Ri(O,Y,xe)}d=w.get(y),d.init(),g.push(d),y.traverseVisible(function(O){O.isLight&&O.layers.test(U.layers)&&(d.pushLight(O),O.castShadow&&d.pushShadow(O))}),d.setupLights(p.physicallyCorrectLights),y.traverse(function(O){let Y=O.material;if(Y)if(Array.isArray(Y))for(let xe=0;xe<Y.length;xe++){let be=Y[xe];q(be,y,O)}else q(Y,y,O)}),g.pop(),d=null};let he=null;function le(y){he&&he(y)}function Ie(){We.stop()}function je(){We.start()}let We=new il;We.setAnimationLoop(le),typeof self!="undefined"&&We.setContext(self),this.setAnimationLoop=function(y){he=y,pe.setAnimationLoop(y),y===null?We.stop():We.start()},pe.addEventListener("sessionstart",Ie),pe.addEventListener("sessionend",je),this.render=function(y,U){if(U!==void 0&&U.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(f===!0)return;y.matrixWorldAutoUpdate===!0&&y.updateMatrixWorld(),U.parent===null&&U.matrixWorldAutoUpdate===!0&&U.updateMatrixWorld(),pe.enabled===!0&&pe.isPresenting===!0&&(pe.cameraAutoUpdate===!0&&pe.updateCamera(U),U=pe.getCamera()),y.isScene===!0&&y.onBeforeRender(p,y,U,E),d=w.get(y,g.length),d.init(),g.push(d),Q.multiplyMatrices(U.projectionMatrix,U.matrixWorldInverse),Z.setFromProjectionMatrix(Q),D=this.localClippingEnabled,H=v.init(this.clippingPlanes,D,U),u=It.get(y,m.length),u.init(),m.push(u),Jt(y,U,0,p.sortObjects),u.finish(),p.sortObjects===!0&&u.sort(J,V),H===!0&&v.beginShadows();let q=d.state.shadowsArray;if(X.render(q,y,U),H===!0&&v.endShadows(),this.info.autoReset===!0&&this.info.reset(),te.render(u,y),d.setupLights(p.physicallyCorrectLights),U.isArrayCamera){let O=U.cameras;for(let Y=0,xe=O.length;Y<xe;Y++){let be=O[Y];ke(u,y,be,be.viewport)}}else ke(u,y,U);E!==null&&(ae.updateMultisampleRenderTarget(E),ae.updateRenderTargetMipmap(E)),y.isScene===!0&&y.onAfterRender(p,y,U),_e.resetDefaultState(),b=-1,A=null,g.pop(),g.length>0?d=g[g.length-1]:d=null,m.pop(),m.length>0?u=m[m.length-1]:u=null};function Jt(y,U,q,O){if(y.visible===!1)return;if(y.layers.test(U.layers)){if(y.isGroup)q=y.renderOrder;else if(y.isLOD)y.autoUpdate===!0&&y.update(U);else if(y.isLight)d.pushLight(y),y.castShadow&&d.pushShadow(y);else if(y.isSprite){if(!y.frustumCulled||Z.intersectsSprite(y)){O&&se.setFromMatrixPosition(y.matrixWorld).applyMatrix4(Q);let be=et.update(y),Ae=y.material;Ae.visible&&u.push(y,be,Ae,q,se.z,null)}}else if((y.isMesh||y.isLine||y.isPoints)&&(y.isSkinnedMesh&&y.skeleton.frame!==K.render.frame&&(y.skeleton.update(),y.skeleton.frame=K.render.frame),!y.frustumCulled||Z.intersectsObject(y))){O&&se.setFromMatrixPosition(y.matrixWorld).applyMatrix4(Q);let be=et.update(y),Ae=y.material;if(Array.isArray(Ae)){let we=be.groups;for(let Fe=0,Re=we.length;Fe<Re;Fe++){let Pe=we[Fe],He=Ae[Pe.materialIndex];He&&He.visible&&u.push(y,be,He,q,se.z,Pe)}}else Ae.visible&&u.push(y,be,Ae,q,se.z,null)}}let xe=y.children;for(let be=0,Ae=xe.length;be<Ae;be++)Jt(xe[be],U,q,O)}function ke(y,U,q,O){let Y=y.opaque,xe=y.transmissive,be=y.transparent;d.setupLightsView(q),xe.length>0&&Ht(Y,U,q),O&&ee.viewport(R.copy(O)),Y.length>0&&vt(Y,U,q),xe.length>0&&vt(xe,U,q),be.length>0&&vt(be,U,q),ee.buffers.depth.setTest(!0),ee.buffers.depth.setMask(!0),ee.buffers.color.setMask(!0),ee.setPolygonOffset(!1)}function Ht(y,U,q){let O=$.isWebGL2;B===null&&(B=new nn(1,1,{generateMipmaps:!0,type:ye.has("EXT_color_buffer_half_float")?bi:bn,minFilter:Vi,samples:O&&r===!0?4:0})),p.getDrawingBufferSize(j),O?B.setSize(j.x,j.y):B.setSize(hr(j.x),hr(j.y));let Y=p.getRenderTarget();p.setRenderTarget(B),p.clear();let xe=p.toneMapping;p.toneMapping=Wt,vt(y,U,q),p.toneMapping=xe,ae.updateMultisampleRenderTarget(B),ae.updateRenderTargetMipmap(B),p.setRenderTarget(Y)}function vt(y,U,q){let O=U.isScene===!0?U.overrideMaterial:null;for(let Y=0,xe=y.length;Y<xe;Y++){let be=y[Y],Ae=be.object,we=be.geometry,Fe=O===null?be.material:O,Re=be.group;Ae.layers.test(q.layers)&&ac(Ae,U,q,we,Fe,Re)}}function ac(y,U,q,O,Y,xe){y.onBeforeRender(p,U,q,O,Y,xe),y.modelViewMatrix.multiplyMatrices(q.matrixWorldInverse,y.matrixWorld),y.normalMatrix.getNormalMatrix(y.modelViewMatrix),Y.onBeforeRender(p,U,q,O,y,xe),Y.transparent===!0&&Y.side===en?(Y.side=bt,Y.needsUpdate=!0,p.renderBufferDirect(q,U,O,Y,y,xe),Y.side=Hn,Y.needsUpdate=!0,p.renderBufferDirect(q,U,O,Y,y,xe),Y.side=en):p.renderBufferDirect(q,U,O,Y,y,xe),y.onAfterRender(p,U,q,O,Y,xe)}function Ri(y,U,q){U.isScene!==!0&&(U=de);let O=re.get(y),Y=d.state.lights,xe=d.state.shadowsArray,be=Y.state.version,Ae=Ue.getParameters(y,Y.state,xe,U,q),we=Ue.getProgramCacheKey(Ae),Fe=O.programs;O.environment=y.isMeshStandardMaterial?U.environment:null,O.fog=U.fog,O.envMap=(y.isMeshStandardMaterial?Le:Ce).get(y.envMap||O.environment),Fe===void 0&&(y.addEventListener("dispose",P),Fe=new Map,O.programs=Fe);let Re=Fe.get(we);if(Re!==void 0){if(O.currentProgram===Re&&O.lightsStateVersion===be)return no(y,Ae),Re}else Ae.uniforms=Ue.getUniforms(y),y.onBuild(q,Ae,p),y.onBeforeCompile(Ae,p),Re=Ue.acquireProgram(Ae,we),Fe.set(we,Re),O.uniforms=Ae.uniforms;let Pe=O.uniforms;(!y.isShaderMaterial&&!y.isRawShaderMaterial||y.clipping===!0)&&(Pe.clippingPlanes=v.uniform),no(y,Ae),O.needsLights=hc(y),O.lightsStateVersion=be,O.needsLights&&(Pe.ambientLightColor.value=Y.state.ambient,Pe.lightProbe.value=Y.state.probe,Pe.directionalLights.value=Y.state.directional,Pe.directionalLightShadows.value=Y.state.directionalShadow,Pe.spotLights.value=Y.state.spot,Pe.spotLightShadows.value=Y.state.spotShadow,Pe.rectAreaLights.value=Y.state.rectArea,Pe.ltc_1.value=Y.state.rectAreaLTC1,Pe.ltc_2.value=Y.state.rectAreaLTC2,Pe.pointLights.value=Y.state.point,Pe.pointLightShadows.value=Y.state.pointShadow,Pe.hemisphereLights.value=Y.state.hemi,Pe.directionalShadowMap.value=Y.state.directionalShadowMap,Pe.directionalShadowMatrix.value=Y.state.directionalShadowMatrix,Pe.spotShadowMap.value=Y.state.spotShadowMap,Pe.spotLightMatrix.value=Y.state.spotLightMatrix,Pe.spotLightMap.value=Y.state.spotLightMap,Pe.pointShadowMap.value=Y.state.pointShadowMap,Pe.pointShadowMatrix.value=Y.state.pointShadowMatrix);let He=Re.getUniforms(),gn=Ei.seqWithValue(He.seq,Pe);return O.currentProgram=Re,O.uniformsList=gn,Re}function no(y,U){let q=re.get(y);q.outputEncoding=U.outputEncoding,q.instancing=U.instancing,q.skinning=U.skinning,q.morphTargets=U.morphTargets,q.morphNormals=U.morphNormals,q.morphColors=U.morphColors,q.morphTargetsCount=U.morphTargetsCount,q.numClippingPlanes=U.numClippingPlanes,q.numIntersection=U.numClipIntersection,q.vertexAlphas=U.vertexAlphas,q.vertexTangents=U.vertexTangents,q.toneMapping=U.toneMapping}function lc(y,U,q,O,Y){U.isScene!==!0&&(U=de),ae.resetTextureUnits();let xe=U.fog,be=O.isMeshStandardMaterial?U.environment:null,Ae=E===null?p.outputEncoding:E.isXRRenderTarget===!0?E.texture.encoding:An,we=(O.isMeshStandardMaterial?Le:Ce).get(O.envMap||be),Fe=O.vertexColors===!0&&!!q.attributes.color&&q.attributes.color.itemSize===4,Re=!!O.normalMap&&!!q.attributes.tangent,Pe=!!q.morphAttributes.position,He=!!q.morphAttributes.normal,gn=!!q.morphAttributes.color,Fn=O.toneMapped?p.toneMapping:Wt,Bn=q.morphAttributes.position||q.morphAttributes.normal||q.morphAttributes.color,Dt=Bn!==void 0?Bn.length:0,Oe=re.get(O),Un=d.state.lights;if(H===!0&&(D===!0||y!==A)){let ut=y===A&&O.id===b;v.setState(O,y,ut)}let Xe=!1;O.version===Oe.__version?(Oe.needsLights&&Oe.lightsStateVersion!==Un.state.version||Oe.outputEncoding!==Ae||Y.isInstancedMesh&&Oe.instancing===!1||!Y.isInstancedMesh&&Oe.instancing===!0||Y.isSkinnedMesh&&Oe.skinning===!1||!Y.isSkinnedMesh&&Oe.skinning===!0||Oe.envMap!==we||O.fog===!0&&Oe.fog!==xe||Oe.numClippingPlanes!==void 0&&(Oe.numClippingPlanes!==v.numPlanes||Oe.numIntersection!==v.numIntersection)||Oe.vertexAlphas!==Fe||Oe.vertexTangents!==Re||Oe.morphTargets!==Pe||Oe.morphNormals!==He||Oe.morphColors!==gn||Oe.toneMapping!==Fn||$.isWebGL2===!0&&Oe.morphTargetsCount!==Dt)&&(Xe=!0):(Xe=!0,Oe.__version=O.version);let yt=Oe.currentProgram;Xe===!0&&(yt=Ri(O,U,Y));let jt=!1,gi=!1,bs=!1,rt=yt.getUniforms(),_n=Oe.uniforms;if(ee.useProgram(yt.program)&&(jt=!0,gi=!0,bs=!0),O.id!==b&&(b=O.id,gi=!0),jt||A!==y){if(rt.setValue(k,"projectionMatrix",y.projectionMatrix),$.logarithmicDepthBuffer&&rt.setValue(k,"logDepthBufFC",2/(Math.log(y.far+1)/Math.LN2)),A!==y&&(A=y,gi=!0,bs=!0),O.isShaderMaterial||O.isMeshPhongMaterial||O.isMeshToonMaterial||O.isMeshStandardMaterial||O.envMap){let ut=rt.map.cameraPosition;ut!==void 0&&ut.setValue(k,se.setFromMatrixPosition(y.matrixWorld))}(O.isMeshPhongMaterial||O.isMeshToonMaterial||O.isMeshLambertMaterial||O.isMeshBasicMaterial||O.isMeshStandardMaterial||O.isShaderMaterial)&&rt.setValue(k,"isOrthographic",y.isOrthographicCamera===!0),(O.isMeshPhongMaterial||O.isMeshToonMaterial||O.isMeshLambertMaterial||O.isMeshBasicMaterial||O.isMeshStandardMaterial||O.isShaderMaterial||O.isShadowMaterial||Y.isSkinnedMesh)&&rt.setValue(k,"viewMatrix",y.matrixWorldInverse)}if(Y.isSkinnedMesh){rt.setOptional(k,Y,"bindMatrix"),rt.setOptional(k,Y,"bindMatrixInverse");let ut=Y.skeleton;ut&&($.floatVertexTextures?(ut.boneTexture===null&&ut.computeBoneTexture(),rt.setValue(k,"boneTexture",ut.boneTexture,ae),rt.setValue(k,"boneTextureSize",ut.boneTextureSize)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}let Ms=q.morphAttributes;if((Ms.position!==void 0||Ms.normal!==void 0||Ms.color!==void 0&&$.isWebGL2===!0)&&ne.update(Y,q,O,yt),(gi||Oe.receiveShadow!==Y.receiveShadow)&&(Oe.receiveShadow=Y.receiveShadow,rt.setValue(k,"receiveShadow",Y.receiveShadow)),O.isMeshGouraudMaterial&&O.envMap!==null&&(_n.envMap.value=we,_n.flipEnvMap.value=we.isCubeTexture&&we.isRenderTargetTexture===!1?-1:1),gi&&(rt.setValue(k,"toneMappingExposure",p.toneMappingExposure),Oe.needsLights&&cc(_n,bs),xe&&O.fog===!0&&kt.refreshFogUniforms(_n,xe),kt.refreshMaterialUniforms(_n,O,L,I,B),Ei.upload(k,Oe.uniformsList,_n,ae)),O.isShaderMaterial&&O.uniformsNeedUpdate===!0&&(Ei.upload(k,Oe.uniformsList,_n,ae),O.uniformsNeedUpdate=!1),O.isSpriteMaterial&&rt.setValue(k,"center",Y.center),rt.setValue(k,"modelViewMatrix",Y.modelViewMatrix),rt.setValue(k,"normalMatrix",Y.normalMatrix),rt.setValue(k,"modelMatrix",Y.matrixWorld),O.isShaderMaterial||O.isRawShaderMaterial){let ut=O.uniformsGroups;for(let ws=0,uc=ut.length;ws<uc;ws++)if($.isWebGL2){let io=ut[ws];fe.update(io,yt),fe.bind(io,yt)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return yt}function cc(y,U){y.ambientLightColor.needsUpdate=U,y.lightProbe.needsUpdate=U,y.directionalLights.needsUpdate=U,y.directionalLightShadows.needsUpdate=U,y.pointLights.needsUpdate=U,y.pointLightShadows.needsUpdate=U,y.spotLights.needsUpdate=U,y.spotLightShadows.needsUpdate=U,y.rectAreaLights.needsUpdate=U,y.hemisphereLights.needsUpdate=U}function hc(y){return y.isMeshLambertMaterial||y.isMeshToonMaterial||y.isMeshPhongMaterial||y.isMeshStandardMaterial||y.isShadowMaterial||y.isShaderMaterial&&y.lights===!0}this.getActiveCubeFace=function(){return x},this.getActiveMipmapLevel=function(){return M},this.getRenderTarget=function(){return E},this.setRenderTargetTextures=function(y,U,q){re.get(y.texture).__webglTexture=U,re.get(y.depthTexture).__webglTexture=q;let O=re.get(y);O.__hasExternalTextures=!0,O.__hasExternalTextures&&(O.__autoAllocateDepthBuffer=q===void 0,O.__autoAllocateDepthBuffer||ye.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),O.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(y,U){let q=re.get(y);q.__webglFramebuffer=U,q.__useDefaultFramebuffer=U===void 0},this.setRenderTarget=function(y,U=0,q=0){E=y,x=U,M=q;let O=!0;if(y){let we=re.get(y);we.__useDefaultFramebuffer!==void 0?(ee.bindFramebuffer(36160,null),O=!1):we.__webglFramebuffer===void 0?ae.setupRenderTarget(y):we.__hasExternalTextures&&ae.rebindTextures(y,re.get(y.texture).__webglTexture,re.get(y.depthTexture).__webglTexture)}let Y=null,xe=!1,be=!1;if(y){let we=y.texture;(we.isData3DTexture||we.isDataArrayTexture)&&(be=!0);let Fe=re.get(y).__webglFramebuffer;y.isWebGLCubeRenderTarget?(Y=Fe[U],xe=!0):$.isWebGL2&&y.samples>0&&ae.useMultisampledRTT(y)===!1?Y=re.get(y).__webglMultisampledFramebuffer:Y=Fe,R.copy(y.viewport),N.copy(y.scissor),_=y.scissorTest}else R.copy(F).multiplyScalar(L).floor(),N.copy(T).multiplyScalar(L).floor(),_=C;if(ee.bindFramebuffer(36160,Y)&&$.drawBuffers&&O&&ee.drawBuffers(y,Y),ee.viewport(R),ee.scissor(N),ee.setScissorTest(_),xe){let we=re.get(y.texture);k.framebufferTexture2D(36160,36064,34069+U,we.__webglTexture,q)}else if(be){let we=re.get(y.texture),Fe=U||0;k.framebufferTextureLayer(36160,36064,we.__webglTexture,q||0,Fe)}b=-1},this.readRenderTargetPixels=function(y,U,q,O,Y,xe,be){if(!(y&&y.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ae=re.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&be!==void 0&&(Ae=Ae[be]),Ae){ee.bindFramebuffer(36160,Ae);try{let we=y.texture,Fe=we.format,Re=we.type;if(Fe!==Nt&&G.convert(Fe)!==k.getParameter(35739)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}let Pe=Re===bi&&(ye.has("EXT_color_buffer_half_float")||$.isWebGL2&&ye.has("EXT_color_buffer_float"));if(Re!==bn&&G.convert(Re)!==k.getParameter(35738)&&!(Re===wn&&($.isWebGL2||ye.has("OES_texture_float")||ye.has("WEBGL_color_buffer_float")))&&!Pe){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}U>=0&&U<=y.width-O&&q>=0&&q<=y.height-Y&&k.readPixels(U,q,O,Y,G.convert(Fe),G.convert(Re),xe)}finally{let we=E!==null?re.get(E).__webglFramebuffer:null;ee.bindFramebuffer(36160,we)}}},this.copyFramebufferToTexture=function(y,U,q=0){let O=Math.pow(2,-q),Y=Math.floor(U.image.width*O),xe=Math.floor(U.image.height*O);ae.setTexture2D(U,0),k.copyTexSubImage2D(3553,q,0,0,y.x,y.y,Y,xe),ee.unbindTexture()},this.copyTextureToTexture=function(y,U,q,O=0){let Y=U.image.width,xe=U.image.height,be=G.convert(q.format),Ae=G.convert(q.type);ae.setTexture2D(q,0),k.pixelStorei(37440,q.flipY),k.pixelStorei(37441,q.premultiplyAlpha),k.pixelStorei(3317,q.unpackAlignment),U.isDataTexture?k.texSubImage2D(3553,O,y.x,y.y,Y,xe,be,Ae,U.image.data):U.isCompressedTexture?k.compressedTexSubImage2D(3553,O,y.x,y.y,U.mipmaps[0].width,U.mipmaps[0].height,be,U.mipmaps[0].data):k.texSubImage2D(3553,O,y.x,y.y,be,Ae,U.image),O===0&&q.generateMipmaps&&k.generateMipmap(3553),ee.unbindTexture()},this.copyTextureToTexture3D=function(y,U,q,O,Y=0){if(p.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}let xe=y.max.x-y.min.x+1,be=y.max.y-y.min.y+1,Ae=y.max.z-y.min.z+1,we=G.convert(O.format),Fe=G.convert(O.type),Re;if(O.isData3DTexture)ae.setTexture3D(O,0),Re=32879;else if(O.isDataArrayTexture)ae.setTexture2DArray(O,0),Re=35866;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}k.pixelStorei(37440,O.flipY),k.pixelStorei(37441,O.premultiplyAlpha),k.pixelStorei(3317,O.unpackAlignment);let Pe=k.getParameter(3314),He=k.getParameter(32878),gn=k.getParameter(3316),Fn=k.getParameter(3315),Bn=k.getParameter(32877),Dt=q.isCompressedTexture?q.mipmaps[0]:q.image;k.pixelStorei(3314,Dt.width),k.pixelStorei(32878,Dt.height),k.pixelStorei(3316,y.min.x),k.pixelStorei(3315,y.min.y),k.pixelStorei(32877,y.min.z),q.isDataTexture||q.isData3DTexture?k.texSubImage3D(Re,Y,U.x,U.y,U.z,xe,be,Ae,we,Fe,Dt.data):q.isCompressedTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),k.compressedTexSubImage3D(Re,Y,U.x,U.y,U.z,xe,be,Ae,we,Dt.data)):k.texSubImage3D(Re,Y,U.x,U.y,U.z,xe,be,Ae,we,Fe,Dt),k.pixelStorei(3314,Pe),k.pixelStorei(32878,He),k.pixelStorei(3316,gn),k.pixelStorei(3315,Fn),k.pixelStorei(32877,Bn),Y===0&&O.generateMipmaps&&k.generateMipmap(Re),ee.unbindTexture()},this.initTexture=function(y){y.isCubeTexture?ae.setTextureCube(y,0):y.isData3DTexture?ae.setTexture3D(y,0):y.isDataArrayTexture?ae.setTexture2DArray(y,0):ae.setTexture2D(y,0),ee.unbindTexture()},this.resetState=function(){x=0,M=0,E=null,ee.reset(),_e.reset()},typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}var zl=class extends $r{};zl.prototype.isWebGL1Renderer=!0;var Kr=class extends tt{constructor(){super();this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t}get autoUpdate(){return console.warn("THREE.Scene: autoUpdate was renamed to matrixWorldAutoUpdate in r144."),this.matrixWorldAutoUpdate}set autoUpdate(e){console.warn("THREE.Scene: autoUpdate was renamed to matrixWorldAutoUpdate in r144."),this.matrixWorldAutoUpdate=e}};var Ci=class extends si{constructor(e){super();this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new ze(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ze(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Na,this.normalScale=new Ne(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=Zs,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}};function mn(s,e,t){return kl(s)?new s.constructor(s.subarray(e,t!==void 0?t:s.length)):s.slice(e,t)}function vs(s,e,t){return!s||!t&&s.constructor===e?s:typeof e.BYTES_PER_ELEMENT=="number"?new e(s):Array.prototype.slice.call(s)}function kl(s){return ArrayBuffer.isView(s)&&!(s instanceof DataView)}var Li=class{constructor(e,t,n,i){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=i!==void 0?i:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,i=t[n],r=t[n-1];n:{e:{let a;t:{i:if(!(e<i)){for(let o=n+2;;){if(i===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===o)break;if(r=i,i=t[++n],e<i)break e}a=t.length;break t}if(!(e>=r)){let o=t[1];e<o&&(n=2,r=o);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(i=r,r=t[--n-1],e>=r)break e}a=n,n=0;break t}break n}for(;n<a;){let o=n+a>>>1;e<t[o]?a=o:n=o+1}if(i=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,i)}return this.interpolate_(n,r,e,i)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,i=this.valueSize,r=e*i;for(let a=0;a!==i;++a)t[a]=n[r+a];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},Hl=class extends Li{constructor(e,t,n,i){super(e,t,n,i);this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Ia,endingEnd:Ia}}intervalChanged_(e,t,n){let i=this.parameterPositions,r=e-2,a=e+1,o=i[r],l=i[a];if(o===void 0)switch(this.getSettings_().endingStart){case Da:r=e,o=2*t-n;break;case Oa:r=i.length-2,o=t+i[r]-i[r+1];break;default:r=e,o=n}if(l===void 0)switch(this.getSettings_().endingEnd){case Da:a=e,l=2*n-t;break;case Oa:a=1,l=n+i[1]-i[0];break;default:a=e-1,l=t}let c=(n-t)*.5,h=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(l-n),this._offsetPrev=r*h,this._offsetNext=a*h}interpolate_(e,t,n,i){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,m=this._weightNext,g=(n-t)/(i-t),p=g*g,f=p*g,x=-d*f+2*d*p-d*g,M=(1+d)*f+(-1.5-2*d)*p+(-.5+d)*g+1,E=(-1-m)*f+(1.5+m)*p+.5*g,b=m*f-m*p;for(let A=0;A!==o;++A)r[A]=x*a[h+A]+M*a[c+A]+E*a[l+A]+b*a[u+A];return r}},Vl=class extends Li{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=(n-t)/(i-t),u=1-h;for(let d=0;d!==o;++d)r[d]=a[c+d]*u+a[l+d]*h;return r}},Gl=class extends Li{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e){return this.copySampleValue_(e-1)}},zt=class{constructor(e,t,n,i){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=vs(t,this.TimeBufferType),this.values=vs(n,this.ValueBufferType),this.setInterpolation(i||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:vs(e.times,Array),values:vs(e.values,Array)};let i=e.getInterpolation();i!==e.DefaultInterpolation&&(n.interpolation=i)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new Gl(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Vl(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Hl(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case Gi:t=this.InterpolantFactoryMethodDiscrete;break;case Wi:t=this.InterpolantFactoryMethodLinear;break;case rr:t=this.InterpolantFactoryMethodSmooth;break}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Gi;case this.InterpolantFactoryMethodLinear:return Wi;case this.InterpolantFactoryMethodSmooth:return rr}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]*=e}return this}trim(e,t){let n=this.times,i=n.length,r=0,a=i-1;for(;r!==i&&n[r]<e;)++r;for(;a!==-1&&n[a]>t;)--a;if(++a,r!==0||a!==i){r>=a&&(a=Math.max(a,1),r=a-1);let o=this.getValueSize();this.times=mn(n,r,a),this.values=mn(this.values,r*o,a*o)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!=0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);let n=this.times,i=this.values,r=n.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let a=null;for(let o=0;o!==r;o++){let l=n[o];if(typeof l=="number"&&isNaN(l)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,o,l),e=!1;break}if(a!==null&&a>l){console.error("THREE.KeyframeTrack: Out of order keys.",this,o,l,a),e=!1;break}a=l}if(i!==void 0&&kl(i))for(let o=0,l=i.length;o!==l;++o){let c=i[o];if(isNaN(c)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,o,c),e=!1;break}}return e}optimize(){let e=mn(this.times),t=mn(this.values),n=this.getValueSize(),i=this.getInterpolation()===rr,r=e.length-1,a=1;for(let o=1;o<r;++o){let l=!1,c=e[o],h=e[o+1];if(c!==h&&(o!==1||c!==e[0]))if(i)l=!0;else{let u=o*n,d=u-n,m=u+n;for(let g=0;g!==n;++g){let p=t[u+g];if(p!==t[d+g]||p!==t[m+g]){l=!0;break}}}if(l){if(o!==a){e[a]=e[o];let u=o*n,d=a*n;for(let m=0;m!==n;++m)t[d+m]=t[u+m]}++a}}if(r>0){e[a]=e[r];for(let o=r*n,l=a*n,c=0;c!==n;++c)t[l+c]=t[o+c];++a}return a!==e.length?(this.times=mn(e,0,a),this.values=mn(t,0,a*n)):(this.times=e,this.values=t),this}clone(){let e=mn(this.times,0),t=mn(this.values,0),n=this.constructor,i=new n(this.name,e,t);return i.createInterpolant=this.createInterpolant,i}};zt.prototype.TimeBufferType=Float32Array;zt.prototype.ValueBufferType=Float32Array;zt.prototype.DefaultInterpolation=Wi;var pi=class extends zt{};pi.prototype.ValueTypeName="bool";pi.prototype.ValueBufferType=Array;pi.prototype.DefaultInterpolation=Gi;pi.prototype.InterpolantFactoryMethodLinear=void 0;pi.prototype.InterpolantFactoryMethodSmooth=void 0;var Wl=class extends zt{};Wl.prototype.ValueTypeName="color";var ql=class extends zt{};ql.prototype.ValueTypeName="number";var Xl=class extends Li{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=(n-t)/(i-t),c=e*o;for(let h=c+o;c!==h;c+=4)Ln.slerpFlat(r,0,a,c-o,a,c,l);return r}},ys=class extends zt{InterpolantFactoryMethodLinear(e){return new Xl(this.times,this.values,this.getValueSize(),e)}};ys.prototype.ValueTypeName="quaternion";ys.prototype.DefaultInterpolation=Wi;ys.prototype.InterpolantFactoryMethodSmooth=void 0;var mi=class extends zt{};mi.prototype.ValueTypeName="string";mi.prototype.ValueBufferType=Array;mi.prototype.DefaultInterpolation=Gi;mi.prototype.InterpolantFactoryMethodLinear=void 0;mi.prototype.InterpolantFactoryMethodSmooth=void 0;var Yl=class extends zt{};Yl.prototype.ValueTypeName="vector";var Zr=class extends tt{constructor(e,t=1){super();this.isLight=!0,this.type="Light",this.color=new ze(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),t}};var $l=new Ye,Kl=new z,Zl=new z,Jl=class{constructor(e){this.camera=e,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Ne(512,512),this.map=null,this.mapPass=null,this.matrix=new Ye,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new ps,this._frameExtents=new Ne(1,1),this._viewportCount=1,this._viewports=[new Je(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera,n=this.matrix;Kl.setFromMatrixPosition(e.matrixWorld),t.position.copy(Kl),Zl.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Zl),t.updateMatrixWorld(),$l.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix($l),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(t.projectionMatrix),n.multiply(t.matrixWorldInverse)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}};var jl=class extends Jl{constructor(){super(new Hr(-5,5,5,-5,.5,500));this.isDirectionalLightShadow=!0}},Jr=class extends Zr{constructor(e,t){super(e,t);this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(tt.DefaultUp),this.updateMatrix(),this.target=new tt,this.shadow=new jl}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}},jr=class extends Zr{constructor(e,t){super(e,t);this.isAmbientLight=!0,this.type="AmbientLight"}};var Qr="\\[\\]\\.:\\/",p0=new RegExp("["+Qr+"]","g"),eo="[^"+Qr+"]",m0="[^"+Qr.replace("\\.","")+"]",g0=/((?:WC+[\/:])*)/.source.replace("WC",eo),_0=/(WCOD+)?/.source.replace("WCOD",m0),x0=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",eo),v0=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",eo),y0=new RegExp("^"+g0+_0+x0+v0+"$"),b0=["material","materials","bones","map"],Ql=class{constructor(e,t,n){let i=n||Be.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,i)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,i=this._bindings[n];i!==void 0&&i.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let i=this._targetGroup.nCachedObjects_,r=n.length;i!==r;++i)n[i].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},Be=class{constructor(e,t,n){this.path=t,this.parsedPath=n||Be.parseTrackName(t),this.node=Be.findNode(e,this.parsedPath.nodeName)||e,this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new Be.Composite(e,t,n):new Be(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(p0,"")}static parseTrackName(e){let t=y0.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},i=n.nodeName&&n.nodeName.lastIndexOf(".");if(i!==void 0&&i!==-1){let r=n.nodeName.substring(i+1);b0.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,i),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(r){for(let a=0;a<r.length;a++){let o=r[a];if(o.name===t||o.uuid===t)return o;let l=n(o.children);if(l)return l}return null},i=n(e.children);if(i)return i}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)e[t++]=n[i]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,n=t.objectName,i=t.propertyName,r=t.propertyIndex;if(e||(e=Be.findNode(this.rootNode,t.nodeName)||this.rootNode,this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){console.error("THREE.PropertyBinding: Trying to update node for track: "+this.path+" but it wasn't found.");return}if(n){let c=t.objectIndex;switch(n){case"materials":if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===c){c=h;break}break;case"map":if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(c!==void 0){if(e[c]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}let a=e[i];if(a===void 0){let c=t.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+c+"."+i+" but it wasn't found.",e);return}let o=this.Versioning.None;this.targetObject=e,e.needsUpdate!==void 0?o=this.Versioning.NeedsUpdate:e.matrixWorldNeedsUpdate!==void 0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(i==="morphTargetInfluences"){if(!e.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=r}else a.fromArray!==void 0&&a.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(l=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=i;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Be.Composite=Ql;Be.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};Be.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};Be.prototype.GetterByBindingType=[Be.prototype._getValue_direct,Be.prototype._getValue_array,Be.prototype._getValue_arrayElement,Be.prototype._getValue_toArray];Be.prototype.SetterByBindingTypeAndVersioning=[[Be.prototype._setValue_direct,Be.prototype._setValue_direct_setNeedsUpdate,Be.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Be.prototype._setValue_array,Be.prototype._setValue_array_setNeedsUpdate,Be.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Be.prototype._setValue_arrayElement,Be.prototype._setValue_arrayElement_setNeedsUpdate,Be.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Be.prototype._setValue_fromArray,Be.prototype._setValue_fromArray_setNeedsUpdate,Be.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var H0=new Float32Array(1);typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:$s}}));typeof window!="undefined"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=$s);var to={};so(to,{MoveBackward:()=>tc,MoveForward:()=>ec,MoveLeft:()=>nc,MoveRight:()=>ic});var ec=new Vt("MoveForward",yn.ARROW_UP),tc=new Vt("MoveBackward",yn.ARROW_DOWN),nc=new Vt("MoveLeft",yn.ARROW_LEFT),ic=new Vt("MoveRight",yn.ARROW_RIGHT);var M0=new Ci({color:7909707}),w0=new Ci({color:16777215}),S0=new Ci({color:3355443});function rc(){let s=new Nn,e=sc();e.position.y=6,e.position.x=-18,s.add(e);let t=sc();t.position.y=6,t.position.x=18,s.add(t);let n=new xt(new Bt(60,15,30),M0);n.position.y=12,s.add(n);let i=new xt(new Bt(33,12,24),w0);return i.position.x=-6,i.position.y=25.5,s.add(i),s}function sc(){return new xt(new Bt(12,12,33),S0)}async function oc(){let s=document.querySelector("display-port"),t=document.querySelector("input-port").getContext("axisbutton");t.bindBindings(Object.values(to));let n=new Kr,i=new jr(16777215,.6);n.add(i);let r=new Jr(16777215,.8);r.position.set(200,500,300),n.add(r);let a=new ht;a.position.set(200,200,200),a.lookAt(0,10,0);let o=new $r({antialias:!0,canvas:s.canvas}),l=rc();n.add(l),s.addEventListener("frame",c=>{let{deltaTime:h,now:u}=c.detail;t.poll(u);let d=ic.value-nc.value,m=tc.value-ec.value;l.position.y+=m,o.setSize(s.width,s.height),a.aspect=s.width/s.height,a.updateProjectionMatrix(),o.render(n,a)})}window.addEventListener("DOMContentLoaded",A0);async function A0(){await oc()}})();
/**
 * @license
 * Copyright 2010-2022 Three.js Authors
 * SPDX-License-Identifier: MIT
 */
//# sourceMappingURL=main.js.map
