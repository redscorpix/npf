(function(){var d=void 0,g=!1,h,i=this;function l(a,b){var e=a.split("."),c=i;!(e[0]in c)&&c.execScript&&c.execScript("var "+e[0]);for(var f;e.length&&(f=e.shift());)!e.length&&b!==d?c[f]=b:c=c[f]?c[f]:c[f]={}}
function m(a){var b=typeof a;if("object"==b)if(a){if(a instanceof Array)return"array";if(a instanceof Object)return b;var e=Object.prototype.toString.call(a);if("[object Window]"==e)return"object";if("[object Array]"==e||"number"==typeof a.length&&"undefined"!=typeof a.splice&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("splice"))return"array";if("[object Function]"==e||"undefined"!=typeof a.call&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("call"))return"function"}else return"null";
else if("function"==b&&"undefined"==typeof a.call)return"object";return b};function n(a){for(var b=0,e=(""+o).replace(/^[\s\xa0]+|[\s\xa0]+$/g,"").split("."),a=(""+a).replace(/^[\s\xa0]+|[\s\xa0]+$/g,"").split("."),c=Math.max(e.length,a.length),f=0;0==b&&f<c;f++){var p=e[f]||"",B=a[f]||"",Y=RegExp("(\\d*)(\\D*)","g"),Z=RegExp("(\\d*)(\\D*)","g");do{var j=Y.exec(p)||["","",""],k=Z.exec(B)||["","",""];if(0==j[0].length&&0==k[0].length)break;b=((0==j[1].length?0:parseInt(j[1],10))<(0==k[1].length?0:parseInt(k[1],10))?-1:(0==j[1].length?0:parseInt(j[1],10))>(0==k[1].length?
0:parseInt(k[1],10))?1:0)||((0==j[2].length)<(0==k[2].length)?-1:(0==j[2].length)>(0==k[2].length)?1:0)||(j[2]<k[2]?-1:j[2]>k[2]?1:0)}while(0==b)}return b};var q,r,s,t;function u(){return i.navigator?i.navigator.userAgent:null}t=s=r=q=g;var v;if(v=u()){var w=i.navigator;q=0==v.indexOf("Opera");r=!q&&-1!=v.indexOf("MSIE");s=!q&&-1!=v.indexOf("WebKit");t=!q&&!s&&"Gecko"==w.product}var x=q,y=r,z=t,A=s,o;
a:{var C="",D;if(x&&i.opera)var E=i.opera.version,C="function"==typeof E?E():E;else if(z?D=/rv\:([^\);]+)(\)|;)/:y?D=/MSIE\s+([^\);]+)(\)|;)/:A&&(D=/WebKit\/(\S+)/),D)var F=D.exec(u()),C=F?F[1]:"";if(y){var G,H=i.document;G=H?H.documentMode:d;if(G>parseFloat(C)){o=""+G;break a}}o=C}var I={},J={};function K(){return J[9]||(J[9]=y&&!!document.documentMode&&9<=document.documentMode)};!y||K();if(z||y)if(!y||!K())z&&(I["1.9.1"]||(I["1.9.1"]=0<=n("1.9.1")));y&&(I["9"]||(I["9"]=0<=n("9")));function L(a){var b=arguments.length;if(1==b&&"array"==m(arguments[0]))return L.apply(null,arguments[0]);if(b%2)throw Error("Uneven number of arguments");for(var e={},c=0;c<b;c+=2)e[arguments[c]]=arguments[c+1];return e};function M(a){return document.createElement(a)};function N(){this.b={};this.a=M(O).style;this.c=L(aa,this.e,da,this.f,ea,this.g,fa,this.h,ga,this.i,ha,this.j,P,this.k,ia,this.l,ja,this.m,ka,this.n,la,this.o,ma,this.p,na,this.q,oa,this.r,pa,this.s,qa,this.t,ra,this.u,sa,this.v,ta,this.w,ua,this.z,va,this.A,wa,this.B,xa,this.C,ya,this.D,za,this.F,Aa,this.G,Q,this.d,R,this.d,Ba,this.H,Ca,this.I,Da,this.J,Ea,this.K,Fa,this.L,Ga,this.M,Ha,this.N,Ia,this.O,Ja,this.P,Ka,this.Q,La,this.R,Ma,this.S,Na,this.W,Oa,this.T,Pa,this.U,Qa,this.V)}
(function(a){a.Z=function(){return a.$||(a.$=new a)}})(N);
var aa="applicationcache",da="audio",ea="backgroundsize",fa="borderimage",ga="borderradius",ha="boxshadow",P="canvas",ia="canvastext",ja="cssanimations",ka="csscolumns",la="cssgradients",ma="cssreflections",na="csstransforms",oa="csstransforms3d",pa="csstransitions",qa="draganddrop",ra="flexbox",sa="flexboxLegacy",ta="fontface",ua="generatedcontent",va="geolocation",wa="hashchange",xa="history",ya="hsla",za="indexeddb",Aa="inlinesvg",Q="input",R="inputtypes",Ba="localstorage",Ca="multiplebackgrounds",
Da="opacity",Ea="postmessage",Fa="rgba",Ga="sessionstorage",Ha="smil",Ia="svg",Ja="svgclippaths",Ka="textshadow",La="touch",Ma="video",Na="webgl",Oa="websockets",Pa="websqldatabase",Qa="webworkers",Ra={select:"INPUT",change:"INPUT",submit:"FORM",reset:"FORM",error:"IMG",load:"IMG",abort:"IMG"},O="useragentsupport_"+Math.floor(1E6*Math.random()),S=A?"webkit":z?"moz":x?"o":y?"ms":"",T=(S?" -"+S+"- ":" ").split(" "),U=["webkit","moz","o","ms"],Sa=["Webkit","Moz","O","ms"];
function V(a,b){a.b[b]===d&&a.c[b]&&(a.b[b]=a.c[b].call(a));return a.b[b]}h=N.prototype;h.e=function(){return!!window.applicationCache};h.f=function(){var a=M("audio"),b=null;try{a.canPlayType&&(b={},b.aa=a.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/,""),b.fa=a.canPlayType("audio/mpeg;").replace(/^no$/,""),b.ga=a.canPlayType('audio/wav; codecs="1"').replace(/^no$/,""),b.ea=a.canPlayType("audio/x-m4a;")||a.canPlayType("audio/aac;").replace(/^no$/,""))}catch(e){}return b};
h.g=function(){return W(this,"backgroundSize")};h.h=function(){return W(this,"borderImage")};h.i=function(){return W(this,"borderRadius")};h.j=function(){return W(this,"boxShadow")};h.k=function(){var a=M("CANVAS");return!(!a.getContext||!a.getContext("2d"))};h.l=function(){return V(this,P)&&!!M("CANVAS").getContext("2d").fillText};h.m=function(){return W(this,"animationName")};h.n=function(){return W(this,"columnCount")};
h.o=function(){this.a.cssText=("background-image:-webkit-"+T.join("linear-gradient(left top,#9f9, white);background-image:")).slice(0,-17);return!!~(""+this.a.backgroundImage).indexOf("gradient")};h.p=function(){return W(this,"boxReflect")};h.q=function(){return!!W(this,"transform")};
h.r=function(){var a=!!W(this,"perspective");a&&"webkitPerspective"in document.documentElement.style&&X(["@media (",T.join("transform-3d),("),O,"){#testCssTransforms3d{left:9px;position:absolute;height:3px;}}"].join(""),function(b){a=9===b.childNodes[0].offsetLeft&&3===b.childNodes[0].offsetHeight},"testCssTransforms3d");return a};h.s=function(){return W(this,"transition")};h.t=function(){var a=M("DIV");return"draggable"in a||"ondragstart"in a&&"ondrop"in a};h.u=function(){return W(this,"flexWrap")};
h.v=function(){return W(this,"boxDirection")};h.w=function(){var a;X('@font-face {font-family:"font";src:url("https://")}',function(b,e){var c=document.styleSheets[document.styleSheets.length-1],c=c.cssRules&&c.cssRules[0]?c.cssRules[0].cssText:c.cssText||"";a=/src/i.test(c)&&0===c.indexOf(e.split(" ")[0])},"testFontFace");return a};h.z=function(){var a;X('#testGeneratedContent:after{content:":)";visibility:hidden}',function(b){a=1<=b.childNodes[0].offsetHeight},"testGeneratedContent");return a};
h.A=function(){return"geolocation"in navigator};h.B=function(){var a=window||M(Ra.hashchange||"DIV"),b="onhashchange"in a;b||(a.setAttribute||(a=M("DIV")),a.setAttribute&&a.removeAttribute&&(a.setAttribute("onhashchange",""),b=!!a.onhashchange,a.onhashchange!==d&&(a.onhashchange=d),a.removeAttribute("onhashchange")));return b&&(document.documentMode===d||7<document.documentMode)};h.C=function(){return!(!window.history||!window.history.pushState)};
h.D=function(){this.a.cssText="background-color:hsla(120,40%,100%,.5)";return!!~(""+this.a.backgroundColor).indexOf("rgba")||!!~(""+this.a.backgroundColor).indexOf("hsla")};h.F=function(){for(var a=-1,b=U.length;++a<b;)if(window[U[a].toLowerCase()+"IndexedDB"])return!0;return!!window.indexedDB};h.G=function(){var a=M("DIV");a.innerHTML="<svg/>";return"http://www.w3.org/2000/svg"==(a.firstChild&&a.firstChild.namespaceURI)};
h.H=function(){try{return window.localStorage.setItem(O,O),window.localStorage.removeItem(O),!0}catch(a){return g}};h.I=function(){this.a.cssText="background:url(https://),url(https://),red url(https://)";return/(url\s*\(.*?){3}/.test(this.a.background)};h.J=function(){this.a.cssText=T.join("opacity:.55;");return/^0.55$/.test(this.a.opacity)};h.K=function(){return!!window.postMessage};h.L=function(){this.a.cssText="background-color:rgba(150,255,150,.5)";return!!~(""+this.a.backgroundColor).indexOf("rgba")};
h.M=function(){try{return window.sessionStorage.setItem(O,O),window.sessionStorage.removeItem(O),!0}catch(a){return g}};h.N=function(){return!!document.createElementNS&&/SVGAnimate/.test({}.toString.call(document.createElementNS("http://www.w3.org/2000/svg","animate")))};h.O=function(){return!!document.createElementNS&&!!document.createElementNS("http://www.w3.org/2000/svg","svg").createSVGRect};
h.P=function(){return!!document.createElementNS&&/SVGClipPath/.test({}.toString.call(document.createElementNS("http://www.w3.org/2000/svg","clipPath")))};h.Q=function(){return""===M("DIV").style.textShadow};h.R=function(){var a;"ontouchstart"in window||window.DocumentTouch&&document instanceof window.DocumentTouch?a=!0:X(["@media (",T.join("touch-enabled),("),O,"){#testTouch{top:9px;position:absolute}}"].join(""),function(b){a=9===b.childNodes[0].offsetTop},"testTouch");return a};
h.S=function(){var a=M("video"),b=g;try{if(b=!!a.canPlayType)b=new Boolean(b),b.aa=a.canPlayType('video/ogg; codecs="theora"').replace(/^no$/,""),b.da=a.canPlayType('video/mp4; codecs="avc1.42E01E"').replace(/^no$/,""),b.ha=a.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/^no$/,"")}catch(e){}return!!b};h.W=function(){return!!window.ba};h.T=function(){return"WebSocket"in window||"MozWebSocket"in window};h.U=function(){return!!window.openDatabase};h.V=function(){return!!window.ca};
h.d=function(){var a=M("INPUT");this.b[Q]=function(b){for(var e={},c=0,f=b.length;c<f;c++)e[b[c]]=!!(b[c]in a);e.list&&(e.list=!(!M("datalist")||!window.HTMLDataListElement));return e}("autocomplete,autofocus,list,placeholder,max,min,multiple,pattern,required,step".split(","));this.b[R]=function(b){for(var e={},c=0,f,p,B=b.length;c<B;c++){a.setAttribute("type",p=b[c]);if(f="text"!==a.type)a.value=":)",a.style.cssText="position:absolute;visibility:hidden;",/^range$/.test(p)&&a.style.WebkitAppearance!==
d?(document.documentElement.appendChild(a),f=document.defaultView,f=f.getComputedStyle&&"textfield"!==f.getComputedStyle(a,null).WebkitAppearance&&0!==a.offsetHeight,document.documentElement.removeChild(a)):/^(search|tel)$/.test(p)||(f=/^(url|email)$/.test(p)?a.X&&a.X()===g:":)"!=a.value);e[b[c]]=!!f}return e}("search,tel,url,email,datetime,date,month,week,time,datetime-local,number,range,color".split(","))};
function X(a,b,e){var c=M("DIV");if(e){var f=M("DIV");f.id=e;c.appendChild(f)}e=["&shy;<style>",a,"</style>"].join("");c.id=O;c.innerHTML+=e;document.documentElement.appendChild(c);b(c,a);c&&c.parentNode&&c.parentNode.removeChild(c)}function W(a,b){var e=b.charAt(0).toUpperCase()+b.substr(1),c;a:{e=(b+" "+Sa.join(e+" ")+e).split(" ");for(c in e)if(!~(""+e[c]).indexOf("-")&&a.a[e[c]]!==d){c=!0;break a}c=g}return c};function $(a){return V(N.Z(),a.toLowerCase())}$.Y=function(a){var b="";S&&(b="-"+S+"-");return b+a};l("npfSupport",$);l("npfSupport.getCssPropertyName",$.Y);})();