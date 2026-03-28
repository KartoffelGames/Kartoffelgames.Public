var nu=Object.create;var Eo=Object.defineProperty;var ou=Object.getOwnPropertyDescriptor;var bi=(r,e)=>(e=Symbol[r])?e:Symbol.for("Symbol."+r),Et=r=>{throw TypeError(r)};var Ti=(r,e,t)=>e in r?Eo(r,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[e]=t;var yi=(r,e)=>Eo(r,"name",{value:e,configurable:!0});var d=(r,e)=>()=>(r&&(e=r(r=0)),e);var D=r=>[,,,nu(r?.[bi("metadata")]??null)],vi=["class","method","getter","setter","accessor","field","value","get","set"],_t=r=>r!==void 0&&typeof r!="function"?Et("Function expected"):r,ru=(r,e,t,n,o)=>({kind:vi[r],name:e,metadata:n,addInitializer:i=>t._?Et("Already initialized"):o.push(_t(i||null))}),iu=(r,e)=>Ti(e,bi("metadata"),r[3]),u=(r,e,t,n)=>{for(var o=0,i=r[e>>1],s=i&&i.length;o<s;o++)e&1?i[o].call(t):n=i[o].call(t,n);return n},y=(r,e,t,n,o,i)=>{var s,a,l,c,p,m=e&7,h=!!(e&8),T=!!(e&16),F=m>3?r.length+1:m?h?1:2:0,P=vi[m+5],g=m>3&&(r[F-1]=[]),v=r[F]||(r[F]=[]),N=m&&(!T&&!h&&(o=o.prototype),m<5&&(m>3||!T)&&ou(m<4?o:{get[t](){return fi(this,i)},set[t](U){return gi(this,i,U)}},t));m?T&&m<4&&yi(i,(m>2?"set ":m>1?"get ":"")+t):yi(o,t);for(var L=n.length-1;L>=0;L--)c=ru(m,t,l={},r[3],v),m&&(c.static=h,c.private=T,p=c.access={has:T?U=>su(o,U):U=>t in U},m^3&&(p.get=T?U=>(m^1?fi:au)(U,o,m^4?i:N.get):U=>U[t]),m>2&&(p.set=T?(U,x)=>gi(U,o,x,m^4?i:N.set):(U,x)=>U[t]=x)),a=(0,n[L])(m?m<4?T?i:N[P]:m>4?void 0:{get:N.get,set:N.set}:o,c),l._=1,m^4||a===void 0?_t(a)&&(m>4?g.unshift(a):m?T?i=a:N[P]=a:o=a):typeof a!="object"||a===null?Et("Object expected"):(_t(s=a.get)&&(N.get=s),_t(s=a.set)&&(N.set=s),_t(s=a.init)&&g.unshift(s));return m||iu(r,o),N&&Eo(o,t,N),T?m^4?i:N:o},b=(r,e,t)=>Ti(r,typeof e!="symbol"?e+"":e,t),No=(r,e,t)=>e.has(r)||Et("Cannot "+t),su=(r,e)=>Object(e)!==e?Et('Cannot use the "in" operator on this value'):r.has(e),fi=(r,e,t)=>(No(r,e,"read from private field"),t?t.call(r):e.get(r)),k=(r,e,t)=>e.has(r)?Et("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(r):e.set(r,t),gi=(r,e,t,n)=>(No(r,e,"write to private field"),n?n.call(r,t):e.set(r,t),t),au=(r,e,t)=>(No(r,e,"access private method"),t);var Nt,ko=d(()=>{Nt=class{mActiveFunctionId;mFunctions;get activeFunction(){return this.mFunctions.get(this.mActiveFunctionId)}get activeFunctionId(){return this.mActiveFunctionId}get functions(){return this.mFunctions}constructor(){this.mFunctions=new Map,this.mActiveFunctionId=""}addFunction(e){this.mFunctions.set(e.id,e),this.mActiveFunctionId||(this.mActiveFunctionId=e.id)}removeFunction(e){let t=this.mFunctions.get(e);if(!t||t.system)return!1;if(this.mFunctions.delete(e),this.mActiveFunctionId===e){let n=this.mFunctions.keys().next().value;this.mActiveFunctionId=n??""}return!0}setActiveFunction(e){return this.mFunctions.has(e)?(this.mActiveFunctionId=e,!0):!1}getFunction(e){return this.mFunctions.get(e)}}});var Ke,kt,it=d(()=>{Ke=(h=>(h.Function="function",h.Operator="operator",h.Value="value",h.Flow="flow",h.Comment="comment",h.TypeConversion="type-conversion",h.Input="input",h.Output="output",h.Event="event",h.Reroute="reroute",h.GetLocal="getlocal",h.SetLocal="setlocal",h))(Ke||{}),kt=class r{static META={function:{icon:"f",cssColor:"var(--pn-accent-blue)",label:"Function"},operator:{icon:"\xB1",cssColor:"var(--pn-accent-green)",label:"Operator"},value:{icon:"#",cssColor:"var(--pn-accent-peach)",label:"Value"},flow:{icon:"\u27F3",cssColor:"var(--pn-accent-mauve)",label:"Flow"},comment:{icon:"\u{1F4AC}",cssColor:"var(--pn-accent-yellow)",label:"Comment"},"type-conversion":{icon:"\u21C4",cssColor:"var(--pn-accent-teal)",label:"Type Conversion"},input:{icon:"\u2192",cssColor:"var(--pn-accent-green)",label:"Input"},output:{icon:"\u2190",cssColor:"var(--pn-accent-red)",label:"Output"},event:{icon:"\u26A1",cssColor:"var(--pn-accent-danger)",label:"Event"},reroute:{icon:"\u25C7",cssColor:"var(--pn-text-muted)",label:"Reroute"},getlocal:{icon:"\u2193",cssColor:"var(--pn-accent-teal)",label:"Get Local"},setlocal:{icon:"\u2191",cssColor:"var(--pn-accent-teal)",label:"Set Local"}};static get(e){return r.META[e]??{icon:"?",cssColor:"var(--pn-text-muted)",label:"Unknown"}}}});var Se,Do=d(()=>{Se=class{mData;mInteractionTrigger;mInteractionType;mOrigin;mStackError;get data(){return this.mData}get origin(){return this.mOrigin}get stacktrace(){return this.mStackError}get trigger(){return this.mInteractionTrigger}get type(){return this.mInteractionType}constructor(e,t,n,o){this.mInteractionType=e,this.mInteractionTrigger=t,this.mData=o,this.mStackError=new Error,this.mOrigin=n}toString(){return`${this.origin.name} -> ${this.type[this.trigger]} - ${this.data.toString()}`}}});var q,Ao=d(()=>{q=class r extends Array{static newListWith(...e){let t=new r;return t.push(...e),t}clear(){this.splice(0,this.length)}clone(){return r.newListWith(...this)}distinct(){return r.newListWith(...new Set(this))}equals(e){if(this===e)return!0;if(!e||this.length!==e.length)return!1;for(let t=0;t<this.length;++t)if(this[t]!==e[t])return!1;return!0}remove(e){let t=this.indexOf(e);if(t!==-1)return this.splice(t,1)[0]}replace(e,t){let n=this.indexOf(e);if(n!==-1){let o=this[n];return this[n]=t,o}}toString(){return`[${super.join(", ")}]`}}});var f,Dt=d(()=>{f=class extends Error{mTarget;get target(){return this.mTarget}constructor(e,t,n){super(e,n),this.mTarget=t}}});var A,Pi=d(()=>{Ao();Dt();A=class r extends Map{add(e,t){if(!this.has(e))this.set(e,t);else throw new f("Can't add duplicate key to dictionary.",this)}clone(){return new r(this)}getAllKeysOfValue(e){return[...this.entries()].filter(o=>o[1]===e).map(o=>o[0])}getOrDefault(e,t){let n=this.get(e);return typeof n<"u"?n:t}map(e){let t=new q;for(let n of this){let o=e(n[0],n[1]);t.push(o)}return t}}});var we,xi=d(()=>{we=class r{mSize;mTopItem;get size(){return this.mSize}get top(){if(this.mTopItem)return this.mTopItem.value}constructor(){this.mTopItem=null,this.mSize=0}clone(){let e=new r;return e.mTopItem=this.mTopItem,e.mSize=this.mSize,e}*entries(){let e=this.mTopItem;for(;e!==null;)yield e.value,e=e.previous}flush(){let e=new Array;for(;this.mTopItem;)e.push(this.pop());return e}pop(){if(!this.mTopItem)return;let e=this.mTopItem.value;return this.mTopItem=this.mTopItem.previous,this.mSize--,e}push(e){let t={previous:this.mTopItem,value:e};this.mTopItem=t,this.mSize++}toArray(){return[...this.entries()]}}});var Ci=d(()=>{});var Ii=d(()=>{Dt()});var wi=d(()=>{});var Ei=d(()=>{});var qt,Ni=d(()=>{qt=class{mCompareFunction;constructor(e){this.mCompareFunction=e}differencesOf(e,t){let n={1:{x:0,history:[]}},o=c=>c-1,i=e.length,s=t.length,a,l;for(let c=0;c<i+s+1;c++)for(let p=-c;p<c+1;p+=2){let m=p===-c||p!==c&&n[p-1].x<n[p+1].x;if(m){let T=n[p+1];l=T.x,a=T.history}else{let T=n[p-1];l=T.x+1,a=T.history}a=a.slice();let h=l-p;for(1<=h&&h<=s&&m?a.push({changeState:2,item:t[o(h)]}):1<=l&&l<=i&&a.push({changeState:1,item:e[o(l)]});l<i&&h<s&&this.mCompareFunction(e[o(l+1)],t[o(h+1)]);)l+=1,h+=1,a.push({changeState:3,item:e[o(l)]});if(l>=i&&h>=s)return a;n[p]={x:l,history:a}}return new Array}}});var ki=d(()=>{});var So=d(()=>{});var Di=d(()=>{});var On=d(()=>{Dt()});var Lo=d(()=>{Dt();On()});var Si=d(()=>{So();Lo();On()});var R=d(()=>{Pi();Ao();xi();Dt();Ci();Ii();wi();Ei();Ni();ki();So();Di();Lo();Si();On()});var Xe,Mo=d(()=>{Xe=class r{static mAsyncronErrorZones=new WeakMap;static mSynchronErrorZones=new WeakMap;static allocateAsyncronError(e,t){r.mAsyncronErrorZones.set(e,t)}static allocateSyncronError(e,t){let n=typeof e=="object"&&e!==null?e:new Error(e);return r.mSynchronErrorZones.set(n,t),n}static getAsyncronErrorZone(e){return r.mAsyncronErrorZones.get(e)}static getSyncronErrorZone(e){return r.mSynchronErrorZones.get(e)}}});var Fn,Li=d(()=>{R();Mo();Ro();Fn=class r{static enable(e){if(e.target.globalPatched)return!1;e.target.globalPatched=!0;let t=e.target,n=new r;{let o=e.patches.requirements.promise;t[o]=n.patchPromise(t[o]);let i=e.patches.requirements.eventTarget;t[i]=n.patchEventTarget(t[i])}n.patchOnEvents(t);for(let o of e.patches.functions??[])t[o]=n.patchFunctionCallbacks(t[o]);if(!e.patches.classes)return!0;for(let o of e.patches.classes.callback??[]){let i=t[o];i=n.patchClass(i),t[o]=i}for(let o of e.patches.classes.eventTargets??[]){let i=t[o];n.patchOnEvents(i.prototype)}return!0}callInZone(e,t){return function(...n){return t.execute(()=>e(...n))}}patchClass(e){if(typeof e!="function")return e;let t=this,n=class extends e{constructor(...o){let i=H.current;for(let s=0;s<o.length;s++){let a=o[s];typeof a=="function"&&(o[s]=t.callInZone(t.patchFunctionCallbacks(a),i))}super(...o)}};return this.patchMethods(n),n}patchEventTarget(e){let t=e.prototype,n=this,o=new WeakMap,i=t.addEventListener,s=t.removeEventListener;return Object.defineProperty(t,"addEventListener",{configurable:!1,writable:!1,value:function(a,l,c){if(l===null||typeof l!="function"&&!(typeof l=="object"&&"handleEvent"in l)){i.call(this,a,l,c);return}let p=o.get(l);if(!p){let m=H.current;typeof l=="function"?p=n.callInZone(l,m):p=n.callInZone(l.handleEvent.bind(l),m)}o.set(l,p),i.call(this,a,p,c)}}),Object.defineProperty(t,"removeEventListener",{configurable:!1,writable:!1,value:function(a,l,c){if(l===null||typeof l!="function"&&!(typeof l=="object"&&"handleEvent"in l)){s.call(this,a,l,c);return}let p=o.get(l)??l;s.call(this,a,p,c)}}),e}patchFunctionCallbacks(e){let t=this;return function(...n){let o=H.current;for(let i=0;i<n.length;i++){let s=n[i];typeof s=="function"&&(n[i]=t.callInZone(t.patchFunctionCallbacks(s),o))}return o.execute(()=>e.call(this,...n))}}patchMethods(e){if(typeof e!="function")return e;let t=i=>{if(i===null||i.constructor===Object)return new A;let s=new A;for(let a of Object.getOwnPropertyNames(i)){if(a==="constructor")continue;let l=Object.getOwnPropertyDescriptor(i,a);l&&typeof l.value=="function"&&s.set(a,l)}for(let[a,l]of t(Object.getPrototypeOf(i)))s.has(a)||s.set(a,l);return s},n=e.prototype,o=t(n);for(let[i,s]of o)s.configurable&&(s.value=this.patchFunctionCallbacks(s.value),Object.defineProperty(n,i,s))}patchOnEvents(e){if(!e||!(e instanceof EventTarget))return;let t=o=>{if(o===null)return new A;let i=new A;for(let s of Object.getOwnPropertyNames(o)){if(!s.startsWith("on"))continue;let a=Object.getOwnPropertyDescriptor(o,s);a&&typeof a.value!="function"&&i.set(s.substring(2),a)}for(let[s,a]of t(Object.getPrototypeOf(o)))i.has(s)||i.set(s,a);return i},n=t(e);for(let[o,i]of n){if(!i.configurable)continue;let s=`on${o}`;delete i.writable,delete i.value;let a=new WeakMap;i.set=function(l){let c=a.get(this);(typeof c=="function"||typeof c=="object")&&this.removeEventListener(o,c),a.set(this,l),(typeof l=="function"||typeof l=="object")&&this.addEventListener(o,l)},i.get=function(){return a.get(this)},Object.defineProperty(e,s,i)}}patchPromise(e){let t=e;class n extends t{constructor(i){super(i),Xe.allocateAsyncronError(this,H.current)}}return this.patchMethods(n),n}}});var H,Ro=d(()=>{R();Mo();Do();Li();H=class r{static mCurrentZone=new r("Default",null,!0);static get current(){return r.mCurrentZone}static enableGlobalTracing(e){if(!Fn.enable(e))return!1;if(!e.errorHandling)return!0;let t=e.target;if(!("addEventListener"in t)||typeof t.addEventListener!="function")throw new f("Global scope does not support addEventListener",r);let n=(o,i,s)=>{s&&s.callErrorListener(i)&&o.preventDefault()};return t.addEventListener("error",o=>{typeof o.error!="object"||o.error===null||n(o,o.error,Xe.getSyncronErrorZone(o.error))}),t.addEventListener("unhandledrejection",o=>{n(o,o.reason,Xe.getAsyncronErrorZone(o.promise))}),!0}static pushInteraction(e,t,n){if(((this.mCurrentZone.mTriggerMapping.get(e)??-1)&t)===0)return!1;let i=new Se(e,t,this.mCurrentZone,n);return this.mCurrentZone.callInteractionListener(i)}mAttachments;mErrorListener;mInteractionListener;mIsolated;mName;mParent;mTriggerMapping;get name(){return this.mName}get parent(){return this.mParent}constructor(e,t,n){this.mAttachments=new Map,this.mErrorListener=new A,this.mName=e,this.mTriggerMapping=new A,this.mInteractionListener=new A,this.mParent=t,this.mIsolated=n}addErrorListener(e){return this.mErrorListener.set(e,r.current),this}addInteractionListener(e,t){return this.mInteractionListener.has(e)||this.mInteractionListener.set(e,new A),this.mInteractionListener.get(e).set(t,r.current),this}addTriggerRestriction(e,t){return this.mTriggerMapping.set(e,t),this}attachment(e,t){if(typeof t<"u")return this.mAttachments.set(e,t),t;let n=this.mAttachments.get(e);if(typeof n<"u")return n;if(!this.mIsolated)return this.mParent.attachment(e)}create(e,t){return new r(e,this,t?.isolate===!0)}execute(e,...t){let n=r.mCurrentZone;r.mCurrentZone=this;let o;try{o=e(...t)}catch(i){throw Xe.allocateSyncronError(i,r.mCurrentZone)}finally{r.mCurrentZone=n}return o}removeErrorListener(e){return this.mErrorListener.delete(e),this}removeInteractionListener(e,t){if(!t)return this.mInteractionListener.delete(e),this;let n=this.mInteractionListener.get(e);return n?(n.delete(t),this):this}callErrorListener(e){return this.execute(()=>{for(let[n,o]of this.mErrorListener.entries())if(o.execute(()=>n.call(this,e))===!1)return!0;return!1})?!0:this.mIsolated?!1:this.parent.callErrorListener(e)}callInteractionListener(e){if(((this.mTriggerMapping.get(e.type)??-1)&e.trigger)===0)return!1;let n=this.mInteractionListener.get(e.type);return n&&n.size>0&&this.execute(()=>{for(let[o,i]of n.entries())i.execute(()=>{o.call(this,e)})}),this.mIsolated?!0:this.parent.callInteractionListener(e)}}});var Jt=d(()=>{Do();Ro()});var le,At=d(()=>{R();le=class r{static mComponents=new WeakMap;static mConstructorSelector=new WeakMap;static mElements=new WeakMap;static ofComponent(e){let t=e.processorConstructor,n=r.mConstructorSelector.get(t);if(!n)throw new f(`Constructor "${t.name}" is not a registered custom element`,t);let o=r.mElements.get(e);if(!o)throw new f(`Component "${e}" is not a registered component`,e);let i;return e.isProcessorCreated&&(i=e.processor),{selector:n,constructor:t,element:o,component:e}}static ofConstructor(e){let t=r.mConstructorSelector.get(e);if(!t)throw new f(`Constructor "${e.name}" is not a registered custom element`,e);let n=globalThis.customElements.get(t);if(!n)throw new f(`Constructor "${e.name}" is not a registered custom element`,e);return{selector:t,constructor:e,elementConstructor:n}}static ofElement(e){let t=r.mComponents.get(e);if(!t)throw new f(`Element "${e}" is not a PwbComponent.`,e);return r.ofComponent(t)}static ofProcessor(e){let t=r.mComponents.get(e);if(!t)throw new f("Processor is not a PwbComponent.",e);return r.ofComponent(t)}static registerComponent(e,t,n){r.mComponents.has(t)||r.mComponents.set(t,e),n&&!r.mComponents.has(n)&&r.mComponents.set(n,e),r.mElements.has(e)||r.mElements.set(e,t)}static registerConstructor(e,t){e&&!r.mConstructorSelector.has(e)&&r.mConstructorSelector.set(e,t)}}});var St=d(()=>{});var Ge,Bn=d(()=>{St();Ge=class r{static DEFAULT=(()=>{let e=new r;return e.mSpashscreenConfiguration.background="blue",e.mSpashscreenConfiguration.content="",e.mSpashscreenConfiguration.manual=!1,e.mSpashscreenConfiguration.animationTime=1e3,e.mErrorConfiguration.ignore=!1,e.mErrorConfiguration.print=!0,e.mLoggingConfiguration.filter=7,e.mLoggingConfiguration.updatePerformance=!1,e.mLoggingConfiguration.updaterTrigger=!1,e.mLoggingConfiguration.updateReshedule=!1,e.mUpdatingConfiguration.frameTime=100,e.mUpdatingConfiguration.stackCap=10,e})();mErrorConfiguration;mLoggingConfiguration;mSpashscreenConfiguration;mUpdatingConfiguration;get error(){return this.mErrorConfiguration}get logging(){return this.mLoggingConfiguration}get splashscreen(){return this.mSpashscreenConfiguration}get updating(){return this.mUpdatingConfiguration}constructor(){this.mSpashscreenConfiguration={background:r.DEFAULT?.mSpashscreenConfiguration.background,content:r.DEFAULT?.mSpashscreenConfiguration.content,manual:r.DEFAULT?.mSpashscreenConfiguration.manual,animationTime:r.DEFAULT?.mSpashscreenConfiguration.animationTime},this.mErrorConfiguration={ignore:r.DEFAULT?.mErrorConfiguration.ignore,print:r.DEFAULT?.mErrorConfiguration.print},this.mLoggingConfiguration={filter:r.DEFAULT?.mLoggingConfiguration.filter,updatePerformance:r.DEFAULT?.mLoggingConfiguration.updatePerformance,updaterTrigger:r.DEFAULT?.mLoggingConfiguration.updaterTrigger,updateReshedule:r.DEFAULT?.mLoggingConfiguration.updateReshedule},this.mUpdatingConfiguration={frameTime:r.DEFAULT?.mUpdatingConfiguration.frameTime,stackCap:r.DEFAULT?.mUpdatingConfiguration.stackCap}}print(e,...t){(e&this.mLoggingConfiguration.filter)!==0&&console.log(...t)}}});var st,Mi=d(()=>{Jt();At();Bn();st=class r{static CONFIGURATION_ATTACHMENT=Symbol("PwbApplicationConfigurationAttachment");static new(e,t,n){let o=new Ge,i=new r(e,o);t(i),n&&i.appendTo(n)}mConfiguration;mElement;mInteractionZone;get configuration(){return this.mConfiguration}constructor(e,t){this.mInteractionZone=H.current.create(`App-${e}`,{isolate:!0}),this.mInteractionZone.attachment(r.CONFIGURATION_ATTACHMENT,t),this.mConfiguration=t,this.mElement=document.createElement("div"),this.mElement.attachShadow({mode:"open"})}addContent(e){let t=le.ofConstructor(e).elementConstructor;return this.mInteractionZone.execute(()=>{let n=le.ofElement(new t);return this.mElement.shadowRoot.appendChild(n.element),n.component.processor})}addErrorListener(e){this.mInteractionZone.addErrorListener(e)}addStyle(e){let t=document.createElement("style");t.textContent=e,this.mElement.shadowRoot.prepend(t)}appendTo(e){e.appendChild(this.mElement)}}});var Lt,Oo=d(()=>{R();Lt=class{mCustomMetadata;constructor(){this.mCustomMetadata=new A}getMetadata(e){return this.mCustomMetadata.get(e)??null}setMetadata(e,t){this.mCustomMetadata.set(e,t)}}});var Qt,Fo=d(()=>{Oo();Qt=class extends Lt{}});var en,Go=d(()=>{R();Oo();Fo();en=class r extends Lt{static mPrivateMetadataKey=Symbol("Metadata");mDecoratorMetadataObject;mPropertyMetadata;constructor(e){super(),this.mDecoratorMetadataObject=e,this.mPropertyMetadata=new A,e[r.mPrivateMetadataKey]=this}getInheritedMetadata(e){let t=new Array,n=this.mDecoratorMetadataObject;do{if(Object.hasOwn(n,r.mPrivateMetadataKey)){let i=n[r.mPrivateMetadataKey].getMetadata(e);i!==null&&t.push(i)}n=Object.getPrototypeOf(n)}while(n!==null);return t.reverse()}getProperty(e){return this.mPropertyMetadata.has(e)||this.mPropertyMetadata.add(e,new Qt),this.mPropertyMetadata.get(e)}}});var ce,Bo=d(()=>{R();Go();Symbol.metadata??=Symbol("Symbol.metadata");ce=class r{static mMetadataMapping=new A;static add(e,t){return(n,o)=>{let i=r.forInternalDecorator(o.metadata);switch(o.kind){case"class":i.setMetadata(e,t);return;case"method":case"field":case"getter":case"setter":case"accessor":if(o.static)throw new Error("@Metadata.add not supported for statics.");i.getProperty(o.name).setMetadata(e,t);return}}}static forInternalDecorator(e){return r.mapMetadata(e)}static get(e){Object.hasOwn(e,Symbol.metadata)||r.polyfillMissingMetadata(e);let t=e[Symbol.metadata];return r.mapMetadata(t)}static init(){return(e,t)=>{r.forInternalDecorator(t.metadata)}}static mapMetadata(e){if(r.mMetadataMapping.has(e))return r.mMetadataMapping.get(e);let t=new en(e);return r.mMetadataMapping.set(e,t),t}static polyfillMissingMetadata(e){let t=new Array,n=e;do t.push(n),n=Object.getPrototypeOf(n);while(n!==null);for(let o=t.length-1;o>=0;o--){let i=t[o];if(!Object.hasOwn(i,Symbol.metadata)){let s=null;o<t.length-2&&(s=t[o+1][Symbol.metadata]),i[Symbol.metadata]=Object.create(s,{})}}}}});var I,Ri=d(()=>{R();Bo();I=class r{static mCurrentInjectionContext=null;static mInjectMode=new A;static mInjectableConstructor=new A;static mInjectableReplacement=new A;static mInjectionConstructorIdentificationMetadataKey=Symbol("InjectionConstructorIdentification");static mSingletonMapping=new A;static createObject(e,t,n){let[o,i]=typeof t=="object"&&t!==null?[!1,t]:[!!t,n??new A],s=r.getInjectionIdentification(e);if(!r.mInjectableConstructor.has(s))throw new f(`Constructor "${e.name}" is not registered for injection and can not be built`,r);let a=o?"instanced":r.mInjectMode.get(s),l=new A(i.map((m,h)=>[r.getInjectionIdentification(m),h])),c=r.mCurrentInjectionContext,p=new A([...c?.localInjections.entries()??[],...l.entries()]);r.mCurrentInjectionContext={injectionMode:a,localInjections:p};try{if(!o&&a==="singleton"&&r.mSingletonMapping.has(s))return r.mSingletonMapping.get(s);let m=new e;return a==="singleton"&&!r.mSingletonMapping.has(s)&&r.mSingletonMapping.add(s,m),m}finally{r.mCurrentInjectionContext=c}}static injectable(e="instanced"){return(t,n)=>{r.registerInjectable(t,n.metadata,e)}}static registerInjectable(e,t,n){let o=r.getInjectionIdentification(e,t);r.mInjectableConstructor.add(o,e),r.mInjectMode.add(o,n)}static replaceInjectable(e,t){let n=r.getInjectionIdentification(e);if(!r.mInjectableConstructor.has(n))throw new f("Original constructor is not registered.",r);let o=r.getInjectionIdentification(t);if(!r.mInjectableConstructor.has(o))throw new f("Replacement constructor is not registered.",r);r.mInjectableReplacement.set(n,t)}static use(e){if(r.mCurrentInjectionContext===null)throw new f("Can't create object outside of an injection context.",r);let t=r.getInjectionIdentification(e);if(r.mCurrentInjectionContext.injectionMode!=="singleton"&&r.mCurrentInjectionContext.localInjections.has(t))return r.mCurrentInjectionContext.localInjections.get(t);let n=r.mInjectableReplacement.get(t);if(n||(n=r.mInjectableConstructor.get(t)),!n)throw new f(`Constructor "${e.name}" is not registered for injection and can not be built`,r);return r.createObject(n)}static getInjectionIdentification(e,t){let n=t?ce.forInternalDecorator(t):ce.get(e),o=n.getMetadata(r.mInjectionConstructorIdentificationMetadataKey);return o||(o=Symbol(e.name),n.setMetadata(r.mInjectionConstructorIdentificationMetadataKey,o)),o}}});var Z=d(()=>{Ri();Bo();Go();Fo()});var jo=d(()=>{});var Le=d(()=>{});var K,ie=d(()=>{K=(a=>(a[a.None=0]="None",a[a.PropertySet=4]="PropertySet",a[a.PropertyDelete=8]="PropertyDelete",a[a.UntrackableFunctionCall=16]="UntrackableFunctionCall",a[a.Manual=32]="Manual",a[a.InputChange=64]="InputChange",a[a.Any=127]="Any",a))(K||{})});var fe,Mt=d(()=>{Jt();ie();fe=class r{static IGNORED_CLASSES=(()=>{let e=new WeakSet;return e.add(r),e.add(H),e.add(Se),e})();static ORIGINAL_TO_INTERACTION_MAPPING=new WeakMap;static PROXY_TO_ORIGINAL_MAPPING=new WeakMap;static UNTRACEABLE_FUNCTION_UPDATE_TRIGGER=(()=>{let e=new WeakMap;return e.set(Array.prototype.fill,4),e.set(Array.prototype.pop,8),e.set(Array.prototype.push,4),e.set(Array.prototype.shift,8),e.set(Array.prototype.unshift,4),e.set(Array.prototype.splice,4),e.set(Array.prototype.reverse,4),e.set(Array.prototype.sort,4),e.set(Array.prototype.concat,4),e.set(Map.prototype.clear,8),e.set(Map.prototype.delete,8),e.set(Map.prototype.set,4),e.set(Set.prototype.clear,8),e.set(Set.prototype.delete,8),e.set(Set.prototype.add,4),e})();static createCoreEntityCreationData(e,t){return{source:e,property:t,toString:function(){let n=typeof this.source;return"constructor"in this.source&&(n=this.source.constructor.name),this.property?`[ ${n} => ${this.property.toString()} ]`:`[ ${n} ]`}}}static getOriginal(e){return r.PROXY_TO_ORIGINAL_MAPPING.get(e)??e}static ignoreClass(e){r.IGNORED_CLASSES.add(e)}static getWrapper(e){let t=r.getOriginal(e);return r.ORIGINAL_TO_INTERACTION_MAPPING.get(t)}mListenerZones;mProxyObject;get proxy(){return this.mProxyObject}constructor(e){let t=r.getWrapper(e);if(t)return t;this.mListenerZones=new Set,r.IGNORED_CLASSES.has(Object.getPrototypeOf(e)?.constructor)?this.mProxyObject=e:this.mProxyObject=this.createProxyObject(e),r.PROXY_TO_ORIGINAL_MAPPING.set(this.mProxyObject,e),r.ORIGINAL_TO_INTERACTION_MAPPING.set(e,this)}addListenerZone(e){this.mListenerZones.has(e)||this.mListenerZones.add(e)}convertToProxy(e){if(e===null||typeof e!="object"&&typeof e!="function")return e;let t=new r(e);for(let n of this.mListenerZones)t.addListenerZone(n);return t.proxy}createProxyObject(e){let t=(o,i,s)=>{let a=r.getOriginal(i);try{let l=o.call(a,...s);return this.convertToProxy(l)}finally{r.UNTRACEABLE_FUNCTION_UPDATE_TRIGGER.has(o)?this.dispatch(r.UNTRACEABLE_FUNCTION_UPDATE_TRIGGER.get(o),i):this.dispatch(16,this.mProxyObject)}};return new Proxy(e,{apply:(o,i,s)=>{this.addListenerZone(H.current);let a=o;try{let l=a.call(i,...s);return this.convertToProxy(l)}catch(l){if(!(l instanceof TypeError))throw l;return t(a,i,s)}},set:(o,i,s)=>{this.addListenerZone(H.current);try{let a=s;return(a!==null&&typeof a=="object"||typeof a=="function")&&(a=r.getOriginal(a)),Reflect.set(o,i,a)}finally{this.dispatch(4,this.mProxyObject,i)}},get:(o,i,s)=>{this.addListenerZone(H.current);let a=Reflect.get(o,i);return this.convertToProxy(a)},deleteProperty:(o,i)=>{this.addListenerZone(H.current);try{return delete o[i]}finally{this.dispatch(8,this.mProxyObject,i)}}})}dispatch(e,t,n){if(H.pushInteraction(K,e,r.createCoreEntityCreationData(t,n)))for(let i of this.mListenerZones)i.execute(()=>{H.pushInteraction(K,e,r.createCoreEntityCreationData(t,n))})}}});var E,ue=d(()=>{Mt();E=class r{static mEnableTrackingOnConstruction=!1;static enableTrackingOnConstruction(e){let t=r.mEnableTrackingOnConstruction;r.mEnableTrackingOnConstruction=!0;try{return e()}finally{r.mEnableTrackingOnConstruction=t}}constructor(){if(r.mEnableTrackingOnConstruction)return new fe(this).proxy}}});function Oi(){return r=>{fe.ignoreClass(r)}}var Fi=d(()=>{Mt()});var We,Gi=d(()=>{We=class r{static mCurrentUpdateCycle=null;static openResheduledCycle(e,t){let n=!1;if(!r.mCurrentUpdateCycle){let o=performance.now();r.mCurrentUpdateCycle={initiator:e.initiator,timeStamp:o,startTime:o,forcedSync:e.forcedSync,runner:e.runner},n=!0}try{return t(r.mCurrentUpdateCycle)}finally{n&&(r.mCurrentUpdateCycle=null)}}static openUpdateCycle(e,t){let n=!1;if(!r.mCurrentUpdateCycle){let o=performance.now();r.mCurrentUpdateCycle={initiator:e.updater,timeStamp:o,startTime:o,forcedSync:e.runSync,runner:{id:Symbol("Runner "+o),timestamp:o}},n=!0}try{return t(r.mCurrentUpdateCycle)}finally{n&&(r.mCurrentUpdateCycle=null)}}static updateCycleRunId(e,t){if(e.initiator===t){let n=performance.now(),o=e;o.runner={id:Symbol("Runner "+n),timestamp:n}}}static updateCyleStartTime(e){let t=performance.now(),n=e;n.startTime=t}}});var jn,Bi=d(()=>{jn=class extends Error{mChain;get chain(){return this.mChain}constructor(e,t){let n=t.slice(-20).map(o=>o.toString()).join(`
`);super(`${e}: 
${n}`),this.mChain=[...t]}}});var Rt,ji=d(()=>{Rt=class extends Error{constructor(){super("Update resheduled")}}});var Vi,Vo,at,Ui=d(()=>{R();Jt();St();ie();Mt();Fi();Gi();Bi();ji();Vi=[Oi()];at=class{mApplicationContext;mInteractionZone;mLoggingType;mRegisteredObjects;mUpdateFunction;mUpdateRunCache;mUpdateStates;get zone(){return this.mInteractionZone}constructor(e){this.mUpdateRunCache=new WeakMap,this.mRegisteredObjects=new WeakMap,this.mUpdateFunction=e.onUpdate,this.mApplicationContext=e.applicationContext,this.mLoggingType=e.loggingType;let t=e.parent?.mInteractionZone??H.current,n=Math.floor(Math.random()*16777215).toString(16);this.mInteractionZone=t.create(`${e.label}-ProcessorZone (${n})`,{isolate:e.isolate}).addTriggerRestriction(K,e.trigger),this.mUpdateStates={chainCompleteHooks:new we,async:{hasSheduledTask:!1,hasRunningTask:!1,sheduledTaskIsResheduled:!1},sync:{running:!1},cycle:{chainedTask:null}}}addUpdateTrigger(e){this.mInteractionZone.addInteractionListener(K,t=>{(e&e)!==0&&this.runUpdateAsynchron(t,null)})}deconstruct(){this.mInteractionZone.removeInteractionListener(K)}registerObject(e){if(this.mRegisteredObjects.has(e))return this.mRegisteredObjects.get(e).proxy;if(e instanceof EventTarget)for(let n of["input","change"])this.mInteractionZone.execute(()=>{e.addEventListener(n,()=>{H.pushInteraction(K,64,fe.createCoreEntityCreationData(e,n))})});let t=new fe(e);return this.mRegisteredObjects.set(e,t),this.mRegisteredObjects.set(t.proxy,t),t.proxy}async resolveAfterUpdate(){return this.mUpdateStates.async.hasSheduledTask?new Promise((e,t)=>{this.mUpdateStates.chainCompleteHooks.push((n,o)=>{o?t(o):e(n)})}):!1}switchToUpdateZone(e){return this.mInteractionZone.execute(e)}update(){let e=new Se(K,32,this.mInteractionZone,fe.createCoreEntityCreationData(this,Symbol("Manual Update")));return this.runUpdateSynchron(e)}updateAsync(){let e=new Se(K,32,this.mInteractionZone,fe.createCoreEntityCreationData(this,Symbol("Manual Update")));this.runUpdateAsynchron(e,null)}executeTaskChain(e,t,n,o){if(o.size>this.mApplicationContext.updating.stackCap)throw new jn("Call loop detected",o.toArray());let i=performance.now();if(!t.forcedSync&&i-t.startTime>this.mApplicationContext.updating.frameTime)throw new Rt;o.push(e);let s=this.mInteractionZone.execute(()=>this.mUpdateFunction.call(this,e))||n;if(this.mApplicationContext.logging.updatePerformance){let l=performance.now();this.mApplicationContext.print(this.mLoggingType,"Update performance:",this.mInteractionZone.name,`
	`,"Cycle:",l-t.timeStamp,"ms",`
	`,"Runner:",l-t.runner.timestamp,"ms",`
	`,"  ","Id:",t.runner.id.toString(),`
	`,"Update:",l-i,"ms",`
	`,"  ","State:",s,`
	`,"  ","Chain: ",o.toArray().map(c=>c.toString()))}if(We.updateCycleRunId(t,this),!this.mUpdateStates.cycle.chainedTask)return s;let a=this.mUpdateStates.cycle.chainedTask;return this.mUpdateStates.cycle.chainedTask=null,this.executeTaskChain(a,t,s,o)}releaseUpdateChainCompleteHooks(e,t){if(!this.mUpdateStates.chainCompleteHooks.top)return;let n;for(;n=this.mUpdateStates.chainCompleteHooks.pop();)n(e,t)}runUpdateAsynchron(e,t){if(this.mUpdateStates.async.hasRunningTask||this.mUpdateStates.async.sheduledTaskIsResheduled){this.mUpdateStates.cycle.chainedTask=e;return}if(this.mUpdateStates.async.hasSheduledTask)return;let n=o=>{this.mUpdateStates.async.hasRunningTask=!0,this.mUpdateStates.async.hasSheduledTask=!1,this.mUpdateStates.async.sheduledTaskIsResheduled=!1;let i=!1;try{this.runUpdateSynchron(e)}catch(s){s instanceof Rt&&o.initiator===this&&(this.mApplicationContext.logging.updateReshedule&&this.mApplicationContext.print(this.mLoggingType,"Reshedule:",this.mInteractionZone.name,`
	`,"Cycle Performance",performance.now()-o.timeStamp,`
	`,"Runner Id:",o.runner.id.toString()),i=!0)}finally{this.mUpdateStates.async.hasRunningTask=!1}i&&this.runUpdateAsynchron(e,o)};this.mUpdateStates.async.hasSheduledTask=!0,t&&(this.mUpdateStates.async.sheduledTaskIsResheduled=!0),globalThis.requestAnimationFrame(()=>{t?We.openResheduledCycle(t,n):We.openUpdateCycle({updater:this,reason:e,runSync:!1},n)})}runUpdateSynchron(e){if(this.mApplicationContext.logging.updaterTrigger&&this.mApplicationContext.print(this.mLoggingType,"Update trigger:",this.mInteractionZone.name,`
	`,"Trigger:",e.toString(),`
	`,"Chained:",this.mUpdateStates.sync.running,`
	`,"Omitted:",!!this.mUpdateStates.cycle.chainedTask),this.mUpdateStates.sync.running)return this.mUpdateStates.cycle.chainedTask=e,!1;this.mUpdateStates.sync.running=!0;try{let t=We.openUpdateCycle({updater:this,reason:e,runSync:!0},n=>{if(this.mUpdateRunCache.has(n.runner))return We.updateCyleStartTime(n),this.mUpdateRunCache.get(n.runner);let o=this.executeTaskChain(e,n,!1,new we);return this.mUpdateRunCache.set(n.runner,o),o});return this.releaseUpdateChainCompleteHooks(t),t}catch(t){if(t instanceof Rt)throw t;let n=t;if(t&&this.mApplicationContext.error.print&&this.mApplicationContext.print(7,t),this.mApplicationContext.error.ignore&&(this.mApplicationContext.print(this.mLoggingType,t),n=null),this.releaseUpdateChainCompleteHooks(!1,n),n)throw t;return!1}finally{this.mUpdateStates.sync.running=!1}}};Vo=D(null),at=y(Vo,0,"CoreEntityUpdater",Vi,at),u(Vo,1,at)});var Be,Vn=d(()=>{R();Z();Mt();ue();Ui();Be=class{mApplicationContext;mHooks;mInjections;mIsLocked;mIsSetup;mProcessor;mProcessorConstructor;mTrackChanges;mUpdater;get applicationContext(){return this.mApplicationContext}get isProcessorCreated(){return!!this.mProcessor}get processor(){if(!this.mIsSetup)throw new f("Processor can not be build before calling setup.",this);return this.isProcessorCreated||(this.mProcessor=this.createProcessor()),this.mProcessor}get processorConstructor(){return this.mProcessorConstructor}constructor(e){if(!(e.constructor.prototype instanceof E))throw new f(`Constructor "${e.constructor.name}" does not extend`,this);if(this.mApplicationContext=e.applicationContext,this.mProcessorConstructor=e.constructor,this.mProcessor=null,this.mIsLocked=!1,this.mIsSetup=!1,this.mTrackChanges=e.trackConstructorChanges,this.mInjections=new A,this.mHooks={create:new we,setup:new we},e.parent)for(let[t,n]of e.parent.mInjections.entries())this.setProcessorAttributes(t,n);this.mUpdater=new at({applicationContext:e.applicationContext,label:e.constructor.name,loggingType:e.loggingType,isolate:!!e.isolate,trigger:e.trigger,parent:e.parent?.mUpdater,onUpdate:()=>this.mIsSetup?this.onUpdate():!1})}call(e,t,...n){if(!this.isProcessorCreated&&!t)return null;let o=Reflect.get(this.processor,e);return typeof o!="function"?null:this.mUpdater.switchToUpdateZone(()=>o.apply(this.processor,n))}deconstruct(){this.mUpdater.deconstruct()}getProcessorAttribute(e){return this.mInjections.get(e)}registerObject(e){return this.mUpdater.registerObject(e)}setProcessorAttributes(e,t){if(this.mIsLocked)throw new f("Cant add injections to after construction.",this);this.mInjections.set(e,t)}setup(){if(this.mIsSetup)throw new f("Setup allready called.",this);this.mIsSetup=!0;let e;for(;e=this.mHooks.setup.pop();)e.apply(this);return this}update(){return this.mUpdater.update()}updateAsync(){this.mUpdater.updateAsync()}async waitForUpdate(){return this.mUpdater.resolveAfterUpdate()}addCreationHook(e){return this.mHooks.create.push(e),this}addSetupHook(e){return this.mHooks.setup.push(e),this}setAutoUpdate(e){this.mUpdater.addUpdateTrigger(e)}createProcessor(){this.mIsLocked=!0;let e=this.mUpdater.switchToUpdateZone(()=>this.mTrackChanges?E.enableTrackingOnConstruction(()=>I.createObject(this.mProcessorConstructor,this.mInjections)):I.createObject(this.mProcessorConstructor,this.mInjections));e=fe.getOriginal(e);let t;for(;t=this.mHooks.create.pop();){let n=t.call(this,e);n&&(e=n)}return e}}});var Ze,Un=d(()=>{St();Vn();Ze=class r extends Be{constructor(e,t,n,o){super({applicationContext:e,constructor:t,loggingType:4,parent:n,isolate:!1,trigger:o,trackConstructorChanges:!1}),this.setProcessorAttributes(r,this),this.addSetupHook(()=>{this.call("onExecute",!1)}).addSetupHook(()=>{let i=this.processor})}deconstruct(){this.call("onDeconstruct",!1),super.deconstruct()}onUpdate(){return!1}}});var Uo,ge,lt=d(()=>{R();Vn();Uo=class r{static mInstance;mCoreEntityConstructor;mProcessorConstructorConfiguration;constructor(){if(r.mInstance)return r.mInstance;r.mInstance=this,this.mCoreEntityConstructor=new A,this.mProcessorConstructorConfiguration=new A}get(e){let t=this.mCoreEntityConstructor.get(e);if(!t)return new Array;let n=new Array;for(let o of t)n.push({processorConstructor:o,processorConfiguration:this.mProcessorConstructorConfiguration.get(o)});return n}register(e,t,n){this.mProcessorConstructorConfiguration.set(t,n);let o=e;do{if(!(o.prototype instanceof Be)&&o!==Be)break;this.mCoreEntityConstructor.has(o)||this.mCoreEntityConstructor.set(o,new Set),this.mCoreEntityConstructor.get(o).add(t)}while(o=Object.getPrototypeOf(o))}},ge=new Uo});var Ot,zo=d(()=>{Le();Un();Vn();lt();Ot=class r extends Be{static mExtensionCache=new WeakMap;mExtensionList;constructor(e){super(e),this.mExtensionList=new Array,this.addSetupHook(()=>{this.executeExtensions()})}deconstruct(){for(let e of this.mExtensionList)e.deconstruct();super.deconstruct()}executeExtensions(){let e=(()=>{let n=r.mExtensionCache.get(this.processorConstructor);if(n)return n;let i=ge.get(Ze).filter(a=>{for(let l of a.processorConfiguration.targetRestrictions)if(this instanceof l||this.processorConstructor.prototype instanceof l||this.processorConstructor===l)return!0;return!1}),s={read:i.filter(a=>a.processorConfiguration.access===1),write:i.filter(a=>a.processorConfiguration.access===3),readWrite:i.filter(a=>a.processorConfiguration.access===2)};return r.mExtensionCache.set(this.processorConstructor,s),s})(),t=[...e.write,...e.readWrite,...e.read];for(let n of t){let o=new Ze(this.applicationContext,n.processorConstructor,this,n.processorConfiguration.trigger);o.setup(),this.mExtensionList.push(o)}}}});var ct,zn=d(()=>{R();ct=class{mExpression;mTemporaryValues;constructor(e,t,n){if(this.mTemporaryValues=new A,n.length>0)for(let o of n)this.mTemporaryValues.set(o,void 0);this.mExpression=this.createEvaluationFunktion(e,this.mTemporaryValues).bind(t.store)}execute(){return this.mExpression()}setTemporaryValue(e,t){if(!this.mTemporaryValues.has(e))throw new f(`Temporary value "${e}" does not exist for this procedure.`,this);this.mTemporaryValues.set(e,t)}createEvaluationFunktion(e,t){let n,o=`__${Math.random().toString(36).substring(2)}`;if(n="return function () {",t.size>0)for(let i of t.keys())n+=`const ${i} = ${o}.get('${i}');`;return n+=`return ${e};`,n+="};",new Function(o,n)(t)}}});var Me,tn=d(()=>{zn();Me=class{mDataLevel;get data(){return this.mDataLevel}constructor(e){this.mDataLevel=e}createExpressionProcedure(e,t){return new ct(e,this.data,t??[])}setTemporaryValue(e,t){this.data.setTemporaryValue(e,t)}}});var xe,ut=d(()=>{R();Ft();xe=class{mComponent;mDataProxy;mParentLevel;mTemporaryValues;get store(){return this.mDataProxy}constructor(e){this.mTemporaryValues=new A,e instanceof Ce?(this.mParentLevel=null,this.mComponent=e):(this.mParentLevel=e,this.mComponent=e.mComponent),this.mDataProxy=this.createAccessProxy()}setTemporaryValue(e,t){this.mTemporaryValues.set(e,t)}updateLevelData(e){if(e.mParentLevel!==this.mParentLevel)throw new f("Can't update InstructionLevelData for a deeper level than it target data.",this);this.mTemporaryValues=e.mTemporaryValues}createAccessProxy(){return new Proxy(new Object,{get:(e,t)=>this.getValue(t),set:(e,t,n)=>(this.hasTemporaryValue(t)&&this.setTemporaryValue(t,n),t in this.mComponent.processor?(this.mComponent.processor[t]=n,!0):(this.setTemporaryValue(t,n),!0)),deleteProperty:()=>{throw new f("Deleting properties is not allowed",this)},ownKeys:()=>[...new Set([...Object.keys(this.mComponent.processor),...this.getTemporaryValuesList()])]})}getTemporaryValuesList(){let e=this.mTemporaryValues.map(t=>t);return this.mParentLevel&&e.push(...this.mParentLevel.getTemporaryValuesList()),e}getValue(e){if(this.mTemporaryValues.has(e))return this.mTemporaryValues.get(e);if(this.mParentLevel)return this.mParentLevel.getValue(e);if(e in this.mComponent.processor)return this.mComponent.processor[e]}hasTemporaryValue(e){return this.mTemporaryValues.has(e)?!0:this.mParentLevel?this.mParentLevel.hasTemporaryValue(e):!1}}});var Re,nn=d(()=>{Re=class{mParent;get parent(){return this.mParent}set parent(e){this.mParent=e}get template(){return this.parent?.template??null}constructor(){this.mParent=null}}});var dt,$n=d(()=>{R();nn();dt=class r extends Re{mChildList;mInstruction;mInstructionType;get childList(){return q.newListWith(...this.mChildList)}get instruction(){return this.mInstruction}set instruction(e){this.mInstruction=e}get instructionType(){return this.mInstructionType}set instructionType(e){this.mInstructionType=e}constructor(){super(),this.mChildList=Array(),this.mInstruction="",this.mInstructionType=""}appendChild(...e){for(let t of e)t.parent=this;this.mChildList.push(...e)}clone(){let e=new r;e.instruction=this.instruction,e.instructionType=this.instructionType;for(let t of this.mChildList)e.appendChild(t.clone());return e}equals(e){if(!(e instanceof r)||e.instruction!==this.instruction||e.instructionType!==this.instructionType||e.childList.length!==this.childList.length)return!1;for(let t=0;t<e.childList.length;t++)if(!e.childList[t].equals(this.childList[t]))return!1;return!0}removeChild(e){let t=this.mChildList.indexOf(e),n;return t!==-1&&(n=this.mChildList.splice(t,1)[0],n.parent=null),n}}});var Gt,$o=d(()=>{R();Gt=class{mNode;get node(){if(!this.mNode)throw new f("Template value is not attached to any template node.",this);return this.mNode}set node(e){this.mNode=e}constructor(){this.mNode=null}}});var Ae,on=d(()=>{$o();Ae=class r extends Gt{mExpression;get value(){return this.mExpression}set value(e){this.mExpression=e}constructor(){super(),this.mExpression=""}clone(){let e=new r;return e.value=this.value,e}equals(e){return e instanceof r&&e.value===this.value}toString(){return`{{ ${this.mExpression} }}`}}});var je,rn=d(()=>{nn();on();je=class r extends Re{mContainsExpression;mTextValue;mValues;get containsExpression(){return this.mContainsExpression}get values(){return this.mValues}constructor(){super(),this.mTextValue="",this.mContainsExpression=!1,this.mValues=[]}addValue(...e){for(let t of e)t instanceof Ae&&(t.node=this,this.mContainsExpression=!0),this.mValues.push(t),this.mTextValue+=t.toString()}clone(){let e=new r;for(let t of this.values){let n=typeof t=="string"?t:t.clone();e.addValue(n)}return e}equals(e){if(!(e instanceof r)||e.values.length!==this.values.length)return!1;for(let t=0;t<this.values.length;t++){let n=this.values[t],o=e.values[t];if(n!==o&&(typeof n!=typeof o||typeof n=="string"&&n!==o||!o.equals(n)))return!1}return!0}toString(){return this.mTextValue}}});var sn,Ho=d(()=>{rn();$o();sn=class r extends Gt{mName;mValue;get name(){return this.mName}set name(e){this.mName=e}get values(){return this.mValue}constructor(){super(),this.mName="",this.mValue=new je}clone(){let e=new r;e.name=this.name;for(let t of this.values.values){let n=typeof t=="string"?t:t.clone();e.values.addValue(n)}return e}equals(e){return!(!(e instanceof r)||e.name!==this.name||!e.values.equals(this.values))}}});var Ve,an=d(()=>{R();nn();Ho();Ve=class r extends Re{mAttributeDictionary;mChildList;mTagName;get attributes(){return q.newListWith(...this.mAttributeDictionary.values())}get childList(){return q.newListWith(...this.mChildList)}get tagName(){return this.mTagName}set tagName(e){this.mTagName=e}constructor(){super(),this.mAttributeDictionary=new A,this.mChildList=Array(),this.mTagName=""}appendChild(...e){for(let t of e)t.parent=this;this.mChildList.push(...e)}clone(){let e=new r;e.tagName=this.tagName;for(let t of this.attributes){let n=e.setAttribute(t.name);for(let o of t.values.values){let i=typeof o=="string"?o:o.clone();n.addValue(i)}}for(let t of this.mChildList)e.appendChild(t.clone());return e}equals(e){if(!(e instanceof r)||e.tagName!==this.tagName||e.attributes.length!==this.attributes.length||e.childList.length!==this.childList.length)return!1;for(let t of e.mAttributeDictionary.values()){let n=this.mAttributeDictionary.get(t.name);if(!n||!n.equals(t))return!1}for(let t=0;t<e.childList.length;t++)if(!e.childList[t].equals(this.childList[t]))return!1;return!0}getAttribute(e){return this.mAttributeDictionary.get(e)?.values??null}removeAttribute(e){return this.mAttributeDictionary.has(e)?(this.mAttributeDictionary.delete(e),!0):!1}removeChild(e){let t=this.mChildList.indexOf(e),n;return t!==-1&&(n=this.mChildList.splice(t,1)[0],n.parent=null),n}setAttribute(e){let t=this.mAttributeDictionary.get(e);return t||(t=new sn,t.name=e,t.node=this,this.mAttributeDictionary.set(e,t)),t.values}}});var be,pt=d(()=>{R();nn();be=class r extends Re{mBodyElementList;get body(){return this.mBodyElementList.clone()}get template(){return this}constructor(){super(),this.mBodyElementList=new q}appendChild(...e){this.mBodyElementList.push(...e);for(let t of e)t.parent=this}clone(){let e=new r;for(let t of this.mBodyElementList)e.appendChild(t.clone());return e}equals(e){if(!(e instanceof r)||e.body.length!==this.body.length)return!1;for(let t=0;t<this.body.length;t++)if(!this.body[t].equals(e.body[t]))return!1;return!0}removeChild(e){let t=this.mBodyElementList.indexOf(e),n;return t!==-1&&(n=this.mBodyElementList.splice(t,1)[0],n.parent=null),n}}});var de,Hn=d(()=>{de=class{mApplicationContext;mComponentValues;mContent;mTemplate;get anchor(){return this.mContent.contentAnchor}get applicationContext(){return this.mApplicationContext}get boundary(){return this.mContent.getBoundary()}get template(){return this.mTemplate}get values(){return this.mComponentValues}get content(){return this.mContent}constructor(e,t,n,o){this.mApplicationContext=e,this.mTemplate=t,this.mTemplate.parent=null,this.mComponentValues=n,this.mContent=o,o.setCoreBuilder(this)}deconstruct(){this.content.deconstruct()}update(){let e=this.onUpdate(),t=!1,n=this.content.builders;if(n.length>0)for(let o=0;o<n.length;o++)t=n[o].update()||t;return e||t}createZoneEnabledElement(e){let t=e.tagName;if(typeof t!="string")throw t;if(t.includes("-")){let o=globalThis.customElements.get(t);if(typeof o<"u")return new o}let n=e.getAttribute("xmlns");return n&&!n.containsExpression?document.createElementNS(n.values[0],t):document.createElement(t)}createZoneEnabledText(e){return document.createTextNode(e)}}});var Bt,Ko=d(()=>{R();Hn();Bt=class{mChildBuilderList;mChildComponents;mContentAnchor;mContentBoundary;mLinkedContent;mModules;mRootChildList;get body(){return this.mRootChildList}get builders(){return this.mChildBuilderList}get contentAnchor(){return this.mContentAnchor}get modules(){return this.mModules}constructor(e,t){this.mModules=e,this.mChildBuilderList=new q,this.mRootChildList=new q,this.mChildComponents=new A,this.mLinkedContent=new WeakSet,this.mContentAnchor=document.createComment(t),this.mContentBoundary={start:this.mContentAnchor,end:this.mContentAnchor}}deconstruct(){this.onDeconstruct();let e;for(;e=this.mChildBuilderList.pop();)e.deconstruct();for(let n of this.mChildComponents.values())n.deconstruct();this.mChildComponents.clear();let t;for(;t=this.mRootChildList.pop();)t instanceof de||t.remove();this.contentAnchor.remove()}getBoundary(){let e=this.mContentBoundary.start,t;return this.mContentBoundary.end instanceof de?t=this.mContentBoundary.end.boundary.end:t=this.mContentBoundary.end,{start:e,end:t}}hasContent(e){return this.mLinkedContent.has(e)}insert(e,t,n){if(!this.hasContent(n))throw new f("Can't add content to builder. Target is not part of builder.",this);let o=e instanceof de?e.anchor:e;switch(t){case"After":{this.insertAfter(o,n);break}case"TopOf":{this.insertTop(o,n);break}case"BottomOf":{this.insertBottom(o,n);break}}this.mLinkedContent.add(e),e instanceof de&&this.mChildBuilderList.push(e);let i=o.parentElement??o.getRootNode(),s=this.mContentAnchor.parentElement??this.mContentAnchor.getRootNode();if(i===s){let a;switch(t){case"After":{a=this.mRootChildList.indexOf(n)+1;break}case"TopOf":{a=0;break}case"BottomOf":{a=this.mRootChildList.length;break}}a===this.mRootChildList.length&&(this.mContentBoundary.end=e),this.mRootChildList.splice(a+1,0,e)}}remove(e){if(!this.mLinkedContent.has(e))throw new f("Child node cant be deleted from builder when it not a child of them",this);if(this.mLinkedContent.delete(e),e instanceof de)this.mChildBuilderList.remove(e),e.deconstruct();else{let t=this.mChildComponents.get(e);t&&(t.deconstruct(),this.mChildComponents.delete(e)),e.remove()}this.mRootChildList.remove(e)&&(this.mContentBoundary.end=this.mRootChildList.at(-1)??this.mContentAnchor)}setCoreBuilder(e){this.mLinkedContent.add(e)}insertAfter(e,t){let n;t instanceof de?n=t.boundary.end:n=t,(n.parentElement??n.getRootNode()).insertBefore(e,n.nextSibling)}insertBottom(e,t){if(t instanceof de){this.insertAfter(e,t);return}if(t instanceof Element){t.appendChild(e);return}throw new f("Source node does not support child nodes.",this)}insertTop(e,t){if(t instanceof de){this.insertAfter(e,t.anchor);return}if(t instanceof Element){t.prepend(e);return}throw new f("Source node does not support child nodes.",this)}}});var Kn,zi=d(()=>{R();Ko();Kn=class extends Bt{mAttributeModulesChangedOrder;mLinkedAttributeElement;mLinkedAttributeExpressionModules;mLinkedAttributeModuleList;mLinkedAttributeNodes;mLinkedExpressionModuleList;get linkedAttributeModules(){return this.mAttributeModulesChangedOrder&&(this.mAttributeModulesChangedOrder=!1,this.orderAttributeModules()),this.mLinkedAttributeModuleList}get linkedExpressionModules(){return this.mLinkedExpressionModuleList}constructor(e,t){super(e,t),this.mLinkedExpressionModuleList=new Array,this.mLinkedAttributeModuleList=new Array,this.mLinkedAttributeExpressionModules=new WeakMap,this.mLinkedAttributeNodes=new WeakMap,this.mLinkedAttributeElement=new WeakMap,this.mAttributeModulesChangedOrder=!1}attributeOfLinkedExpressionModule(e){return this.mLinkedAttributeExpressionModules.get(e)}getLinkedAttributeData(e){let t=this.mLinkedAttributeNodes.get(e),n=this.mLinkedAttributeElement.get(e);if(!t||!n)throw new f("Attribute has no linked data.",this);return{values:t,node:n}}linkAttributeExpression(e,t){this.mLinkedAttributeExpressionModules.set(e,t)}linkAttributeModule(e){this.mLinkedAttributeModuleList.push(e),this.mAttributeModulesChangedOrder=!0}linkAttributeNodes(e,t,n){this.mLinkedAttributeNodes.set(e,n),this.mLinkedAttributeElement.set(e,t)}linkExpressionModule(e){this.mLinkedExpressionModuleList.push(e)}onDeconstruct(){for(let e of this.mLinkedAttributeModuleList)e.deconstruct();for(let e of this.mLinkedExpressionModuleList)e.deconstruct()}orderAttributeModules(){this.mLinkedAttributeModuleList.sort((e,t)=>e.accessMode-t.accessMode)}}});var Xn,$i=d(()=>{Ko();Xn=class extends Bt{mInstructionModule;get instructionModule(){return this.mInstructionModule}set instructionModule(e){this.mInstructionModule=e}constructor(e,t){super(e,t),this.mInstructionModule=null}onDeconstruct(){this.mInstructionModule.deconstruct()}}});var Wn,Hi=d(()=>{R();Hn();$i();Xo();Wn=class extends de{constructor(e,t,n,o){super(e,t,o,new Xn(n,`Instruction - {$${t.instructionType}}`))}onUpdate(){if(!this.content.instructionModule){let t=this.content.modules.createInstructionModule(this.applicationContext,this.template,this.values);this.content.instructionModule=t}if(this.content.instructionModule.update()){let t=this.content.body;this.updateStaticBuilder(t,this.content.instructionModule.instructionResult.elementList)}return!1}insertNewContent(e,t){let n=new jt(this.applicationContext,e.template,this.content.modules,e.dataLevel,`Child - {$${this.template.instructionType}}`);return t===null?this.content.insert(n,"TopOf",this):this.content.insert(n,"After",t),n}updateStaticBuilder(e,t){let o=new qt((a,l)=>l.template.equals(a.template)).differencesOf(e,t),i=0,s=null;for(let a=0;a<o.length;a++){let l=o[a];if(l.changeState===1)this.content.remove(l.item);else if(l.changeState===2)s=this.insertNewContent(l.item,s),i++;else{let c=t[i].dataLevel;l.item.values.updateLevelData(c),s=l.item,i++}}}}});var jt,Xo=d(()=>{ut();$n();rn();an();pt();on();Hn();zi();Hi();jt=class extends de{mInitialized;constructor(e,t,n,o,i){super(e,t,o,new Kn(n,`Static - {${i}}`)),this.mInitialized=!1}onUpdate(){this.mInitialized||(this.mInitialized=!0,this.buildTemplate([this.template],this));let e=!1,t=this.content.linkedAttributeModules;for(let i=0;i<t.length;i++)e=t[i].update()||e;let n=!1,o=this.content.linkedExpressionModules;for(let i=0;i<o.length;i++){let s=o[i];if(s.update()){n=!0;let a=this.content.attributeOfLinkedExpressionModule(s);if(!a)continue;let l=this.content.getLinkedAttributeData(a),c=l.values.reduce((p,m)=>p+m.data,"");l.node.setAttribute(a.name,c)}}return e||n}buildInstructionTemplate(e,t){let n=new Wn(this.applicationContext,e,this.content.modules,new xe(this.values));this.content.insert(n,"BottomOf",t)}buildStaticTemplate(e,t){let n=this.createZoneEnabledElement(e);this.content.insert(n,"BottomOf",t);for(let o of e.attributes){let i=this.content.modules.createAttributeModule(this.applicationContext,o,n,this.values);if(i){this.content.linkAttributeModule(i);continue}if(o.values.containsExpression){let s=new Array;for(let a of o.values.values){let l=this.createZoneEnabledText("");if(s.push(l),!(a instanceof Ae)){l.data=a;continue}let c=this.content.modules.createExpressionModule(this.applicationContext,a,l,this.values);this.content.linkExpressionModule(c),this.content.linkAttributeExpression(c,o)}this.content.linkAttributeNodes(o,n,s);continue}n.setAttribute(o.name,o.values.toString())}this.content.insert(n,"BottomOf",t),this.buildTemplate(e.childList,n)}buildTemplate(e,t){for(let n of e)n instanceof be?this.buildTemplate(n.body,t):n instanceof je?this.buildTextTemplate(n,t):n instanceof dt?this.buildInstructionTemplate(n,t):n instanceof Ve&&this.buildStaticTemplate(n,t)}buildTextTemplate(e,t){for(let n of e.values){if(typeof n=="string"){this.content.insert(this.createZoneEnabledText(n),"BottomOf",t);continue}let o=this.createZoneEnabledText("");this.content.insert(o,"BottomOf",t);let i=this.content.modules.createExpressionModule(this.applicationContext,n,o,this.values);this.content.linkExpressionModule(i)}}}});var ln,Wo=d(()=>{ln=class{mHtmlElement;mShadowRoot;get htmlElement(){return this.mHtmlElement}get shadowRoot(){return this.mShadowRoot}constructor(e){this.mHtmlElement=e,this.mShadowRoot=this.mHtmlElement.attachShadow({mode:"open"})}}});var W,Ee=d(()=>{zn();W=class{mDataLevel;get data(){return this.mDataLevel}constructor(e){this.mDataLevel=e}createExpressionProcedure(e,t){return new ct(e,this.data,t??[])}}});var _e,Zn=d(()=>{St();zo();Ee();_e=class extends Ot{constructor(e){super({applicationContext:e.applicationContext,constructor:e.constructor,loggingType:2,parent:e.parent,isolate:!1,trigger:e.trigger,trackConstructorChanges:!1}),this.setProcessorAttributes(W,new W(e.values)),this.addSetupHook(()=>{let t=this.processor})}deconstruct(){super.deconstruct(),this.call("onDeconstruct",!1)}}});var Q,qe=d(()=>{Q=class{mValue;get value(){return this.mValue}constructor(e){this.mValue=e}}});var ne,Ue=d(()=>{R();ne=class{constructor(){throw new f("Reference should not be instanced.",this)}}});var Ie,mt=d(()=>{R();Ie=class{constructor(){throw new f("Reference should not be instanced.",this)}}});var Je,Yn=d(()=>{Zn();qe();Ue();mt();Je=class r extends _e{mLastResult;mTargetTextNode;constructor(e){super({applicationContext:e.applicationContext,constructor:e.constructor,parent:e.parent,trigger:e.trigger,values:e.values}),this.mTargetTextNode=e.targetNode,this.mLastResult=null,this.setProcessorAttributes(r,this),this.setProcessorAttributes(Ie,e.targetTemplate.clone()),this.setProcessorAttributes(ne,e.targetNode),this.setProcessorAttributes(Q,new Q(e.targetTemplate.value))}onUpdate(){let e=this.call("onUpdate",!0);e===null&&(e="");let t=this.mLastResult===null||this.mLastResult!==e;if(t){let n=this.mTargetTextNode;n.data=e,this.mLastResult=e}return t}}});function Zo(r){return(e,t)=>{I.registerInjectable(e,t.metadata,"instanced"),ge.register(Je,e,{trigger:r.trigger})}}var Yo=d(()=>{Z();lt();Yn()});var Ki,_o,du,ht,Xi=d(()=>{Z();ue();Ee();ie();Yo();qe();Ki=[Zo({trigger:111})];ht=class extends(du=E){mProcedure;constructor(e=I.use(W),t=I.use(Q)){super(),this.mProcedure=e.createExpressionProcedure(t.value)}onUpdate(){let e=this.mProcedure.execute();return typeof e>"u"?null:e?.toString()}};_o=D(du),ht=y(_o,0,"MustacheExpressionModule",Ki,ht),u(_o,1,ht)});var Te,yt=d(()=>{Te=class{mName;mValue;get name(){return this.mName}get value(){return this.mValue}constructor(e,t){this.mName=e,this.mValue=t}}});var pe,ft=d(()=>{Zn();yt();Ue();mt();pe=class r extends _e{mAccessMode;get accessMode(){return this.mAccessMode}constructor(e){super({applicationContext:e.applicationContext,constructor:e.constructor,parent:e.parent,trigger:e.trigger,values:e.values}),this.mAccessMode=e.accessMode,this.setProcessorAttributes(r,this),this.setProcessorAttributes(Ie,e.targetTemplate.clone()),this.setProcessorAttributes(ne,e.targetNode),this.setProcessorAttributes(Te,new Te(e.targetTemplate.name,e.targetTemplate.values.toString()))}onUpdate(){return this.call("onUpdate",!0)??!1}}});var ve,gt=d(()=>{R();ve=class{mElementList;get elementList(){return q.newListWith(...this.mElementList)}constructor(){this.mElementList=new Array}addElement(e,t){if(this.mElementList.findIndex(o=>o.template===e||o.dataLevel===t)===-1)this.mElementList.push({template:e,dataLevel:t});else throw new f("Can't add same template or values for multiple Elements.",this)}}});var Qe,_n=d(()=>{Zn();qe();mt();gt();Qe=class r extends _e{mLastResult;get instructionResult(){return this.mLastResult}constructor(e){super({applicationContext:e.applicationContext,constructor:e.constructor,parent:e.parent,trigger:e.trigger,values:e.values}),this.setProcessorAttributes(r,this),this.setProcessorAttributes(Ie,e.targetTemplate.clone()),this.setProcessorAttributes(Q,new Q(e.targetTemplate.instruction)),this.mLastResult=new ve}onUpdate(){let e=this.call("onUpdate",!0);return e instanceof ve?(this.mLastResult=e,!0):!1}}});var qn,Wi=d(()=>{R();Xi();lt();ft();Yn();_n();qn=class r{static mAttributeModuleCache=new A;static mExpressionModuleCache=new WeakMap;static mInstructionModuleCache=new A;mComponent;mExpressionModule;constructor(e,t){this.mExpressionModule=t??ht,this.mComponent=e}createAttributeModule(e,t,n,o){let i=(()=>{let s=r.mAttributeModuleCache.get(t.name);if(s||s===null)return s;for(let a of ge.get(pe))if(a.processorConfiguration.selector.test(t.name))return r.mAttributeModuleCache.set(t.name,a),a;return r.mAttributeModuleCache.set(t.name,null),null})();return i===null?null:new pe({applicationContext:e,accessMode:i.processorConfiguration.access,constructor:i.processorConstructor,parent:this.mComponent,targetNode:n,targetTemplate:t,values:o,trigger:i.processorConfiguration.trigger}).setup()}createExpressionModule(e,t,n,o){let i=(()=>{let s=r.mExpressionModuleCache.get(this.mExpressionModule);if(s)return s;let a=ge.get(Je).find(l=>l.processorConstructor===this.mExpressionModule);if(!a)throw new f("An expression module could not be found.",this);return r.mExpressionModuleCache.set(this.mExpressionModule,a),a})();return new Je({applicationContext:e,constructor:i.processorConstructor,parent:this.mComponent,targetNode:n,targetTemplate:t,values:o,trigger:i.processorConfiguration.trigger}).setup()}createInstructionModule(e,t,n){let o=(()=>{let i=r.mInstructionModuleCache.get(t.instructionType);if(i)return i;for(let s of ge.get(Qe))if(s.processorConfiguration.instructionType===t.instructionType)return r.mInstructionModuleCache.set(t.instructionType,s),s;throw new f(`Instruction module type "${t.instructionType}" not found.`,this)})();return new Qe({applicationContext:e,constructor:o.processorConstructor,parent:this.mComponent,targetTemplate:t,values:n,trigger:o.processorConfiguration.trigger}).setup()}}});var bt,Jn=d(()=>{R();bt=class extends f{mColumnEnd;mColumnStart;mLineEnd;mLineStart;get columnEnd(){return this.mColumnEnd}get columnStart(){return this.mColumnStart}get lineEnd(){return this.mLineEnd}get lineStart(){return this.mLineStart}constructor(e,t,n,o,i,s,a){super(e,t,a),this.mColumnStart=n,this.mLineStart=o,this.mColumnEnd=i,this.mLineEnd=s}}});var Vt,qo=d(()=>{R();Vt=class{mDependencyFetch;mDependencyFetchResolved;mLexer;mMeta;mPattern;mPatternDependencies;mType;get dependencies(){return this.mPatternDependencies}get dependenciesResolved(){return this.mDependencyFetchResolved}get lexer(){return this.mLexer}get meta(){return this.mMeta}get pattern(){return this.mPattern}constructor(e,t){if(this.mLexer=e,this.mType=t.type,this.mMeta=t.metadata,this.mPatternDependencies=new Array,this.mDependencyFetch=t.dependencyFetch??null,this.mDependencyFetchResolved=!t.dependencyFetch,this.mType==="split"&&!this.mDependencyFetch)throw new f("Split token with a start and end token, need inner token definitions.",this);if(this.mType==="single"&&this.mDependencyFetch)throw new f("Pattern does not allow inner token pattern.",this);this.mPattern=this.convertTokenPattern(this.mType,t.pattern)}isSplit(){return this.mType==="split"}resolveDependencies(){this.mDependencyFetchResolved||(this.mDependencyFetch(this),this.mDependencyFetchResolved=!0)}useChildPattern(e){if(this.mLexer!==e.lexer)throw new f("Can only add dependencies of the same lexer.",this);this.mPatternDependencies.push(e)}convertTokenPattern(e,t){if("single"in t){if(e==="split")throw new f("Can't use split pattern type with single pattern definition.",this);return{start:{regex:t.single.regex,types:t.single.types,validator:t.single.validator??null}}}else{if(e==="single")throw new f("Can't use single pattern type with split pattern definition.",this);return{start:{regex:t.start.regex,types:t.start.types,validator:t.start.validator??null},end:{regex:t.end.regex,types:t.end.types,validator:t.end.validator??null},innerType:t.innerType??null}}}}});var Ut,Jo=d(()=>{Ut=class{mColumnNumber;mLineNumber;mMetas;mType;mValue;get columnNumber(){return this.mColumnNumber}get lineNumber(){return this.mLineNumber}get metas(){return[...this.mMetas]}get type(){return this.mType}get value(){return this.mValue}constructor(e,t,n,o){this.mValue=t,this.mColumnNumber=n,this.mLineNumber=o,this.mType=e,this.mMetas=new Set}addMeta(...e){for(let t of e)this.mMetas.add(t)}hasMeta(e){return this.mMetas.has(e)}}});var cn,Zi=d(()=>{R();Jn();qo();Jo();cn=class{mRootPattern;mSettings;get errorType(){return this.mSettings.errorType}set errorType(e){this.mSettings.errorType=e}get trimWhitespace(){return this.mSettings.trimSpaces}set trimWhitespace(e){this.mSettings.trimSpaces=e}get validWhitespaces(){return[...this.mSettings.whiteSpaces].join("")}set validWhitespaces(e){this.mSettings.whiteSpaces=new Set(e.split(""))}constructor(){this.mSettings={errorType:null,trimSpaces:!0,whiteSpaces:new Set},this.mRootPattern=new Vt(this,{type:"single",pattern:{single:{regex:/^/,types:{},validator:null}},metadata:[],dependencyFetch:null})}createTokenPattern(e,t){let n=a=>typeof a=="string"?{token:a}:a,o=a=>{let l=new Set(a.flags.split(""));return new RegExp(`^(?<token>${a.source})`,[...l].join(""))},i=new Array;e.meta&&(typeof e.meta=="string"?i.push(e.meta):i.push(...e.meta));let s;return"regex"in e.pattern?s={single:{regex:o(e.pattern.regex),types:n(e.pattern.type),validator:e.pattern.validator??null}}:s={start:{regex:o(e.pattern.start.regex),types:n(e.pattern.start.type),validator:e.pattern.start.validator??null},end:{regex:o(e.pattern.end.regex),types:n(e.pattern.end.type),validator:e.pattern.end.validator??null},innerType:e.pattern.innerType??null},new Vt(this,{type:"regex"in e.pattern?"single":"split",pattern:s,metadata:i,dependencyFetch:t??null})}*tokenize(e,t){let n={data:e,cursor:{position:0,column:1,line:1},error:null,progressTracker:t??null};yield*this.tokenizeRecursionLayer(n,this.mRootPattern,new Array,null)}useRootTokenPattern(e){if(e.lexer!==this)throw new f("Token pattern must be created by this lexer.",this);this.mRootPattern.useChildPattern(e)}findNextStartToken(e,t,n,o){for(let i of t){let s=i.pattern.start,a=this.matchToken(i,s,e,n,o);if(a!==null)return{pattern:i,token:a}}return null}findTokenTypeOfMatch(e,t,n){for(let s in e.groups){let a=e.groups[s],l=t[s];if(!(!a||!l)){if(a.length!==e[0].length)throw new f("A group of a token pattern must match the whole token.",this);return l}}let o=new Array;for(let s in e.groups)e.groups[s]&&o.push(s);let i=new Array;for(let s in t)i.push(s);throw new f(`No token type found for any defined pattern regex group. Full: "${e[0]}", Matches: "${o.join(", ")}", Available: "${i.join(", ")}", Regex: "${n.source}"`,this)}*generateErrorToken(e,t){if(!e.error||!this.mSettings.errorType)return;let n=new Ut(this.mSettings.errorType,e.error.data,e.error.startColumn,e.error.startLine);n.addMeta(...t),e.error=null,yield n}generateToken(e,t,n,o,i,s){let a=n[0],l=this.findTokenTypeOfMatch(n,o,s),c=new Ut(i??l,a,e.cursor.column,e.cursor.line);return c.addMeta(...t),c}matchToken(e,t,n,o,i){let s=t.regex;s.lastIndex=0;let a=s.exec(n.data);if(!a||a.index!==0)return null;let l=this.generateToken(n,[...o,...e.meta],a,t.types,i,s);if(t.validator){let c=n.data.substring(l.value.length);if(!t.validator(l,c,n.cursor.position))return null}return this.moveCursor(n,l.value),l}moveCursor(e,t){let n=t.split(`
`);n.length>1&&(e.cursor.column=1),e.cursor.line+=n.length-1,e.cursor.column+=n.at(-1).length,e.cursor.position+=t.length,e.data=e.data.substring(t.length),this.trackProgress(e)}pushNextCharToErrorState(e){if(!this.mSettings.errorType)throw new bt(`Unable to parse next token. No valid pattern found for "${e.data.substring(0,20)}".`,this,e.cursor.column,e.cursor.line,e.cursor.column,e.cursor.line);e.error||(e.error={data:"",startColumn:e.cursor.column,startLine:e.cursor.line});let t=e.data.charAt(0);e.error.data+=t,this.moveCursor(e,t)}skipNextWhitespace(e){let t=e.data.charAt(0);return!this.mSettings.trimSpaces||!this.mSettings.whiteSpaces.has(t)?!1:(this.moveCursor(e,t),!0)}*tokenizeRecursionLayer(e,t,n,o){let i=t.dependencies;for(;e.data.length>0;){if(!e.error&&this.skipNextWhitespace(e))continue;if(t.isSplit()){let l=this.matchToken(t,t.pattern.end,e,n,o);if(l!==null){yield*this.generateErrorToken(e,n),yield l;return}}let s=this.findNextStartToken(e,i,n,o);if(!s){this.pushNextCharToErrorState(e);continue}yield*this.generateErrorToken(e,n),yield s.token;let a=s.pattern;a.isSplit()&&(a.resolveDependencies(),yield*this.tokenizeRecursionLayer(e,a,[...n,...a.meta],o??a.pattern.innerType))}yield*this.generateErrorToken(e,n)}trackProgress(e){e.progressTracker!==null&&e.progressTracker(e.cursor.position,e.cursor.line,e.cursor.column)}}});var Y,Qo=d(()=>{Y=class extends Error{static PARSER_ERROR=Symbol("PARSER_ERROR");mTrace;get columnEnd(){return this.mTrace.top.range.columnEnd}get columnStart(){return this.mTrace.top.range.columnStart}get graph(){return this.mTrace.top.graph}get incidents(){return this.mTrace.incidents}get lineEnd(){return this.mTrace.top.range.lineEnd}get lineStart(){return this.mTrace.top.range.lineStart}constructor(e){super(e.top.message,{cause:e.top.cause}),this.mTrace=e}}});var Qn,Yi=d(()=>{R();Qn=class{mIncidents;mTop;get incidents(){if(this.mIncidents===null)throw new f("A complete incident list is only available on debug mode.",this);return this.mIncidents}get top(){return this.mTop}constructor(e){this.mTop={message:"Unknown parser error",priority:0,graph:null,range:{lineStart:1,columnStart:1,lineEnd:1,columnEnd:1},cause:null},e?this.mIncidents=new Array:this.mIncidents=null}push(e,t,n,o,i,s,a=!1,l=null){let c;if(a?c=this.mTop.priority+1:c=i*1e4+s,this.mIncidents!==null){let p={message:e,priority:c,graph:t,range:{lineStart:n,columnStart:o,lineEnd:i,columnEnd:s},cause:l};this.mIncidents.push(p)}this.mTop&&c<this.mTop.priority||this.setTop({message:e,priority:c,graph:t,range:{lineStart:n,columnStart:o,lineEnd:i,columnEnd:s},cause:l})}setTop(e){this.mTop=e}}});var eo,_i=d(()=>{R();Yi();eo=class r{static MAX_JUNCTION_CIRCULAR_REFERENCES=1e3;mGraphStack;mIncidentTrace;mLastTokenPosition;mProcessStack;mTokenCache;mTokenGenerator;mTrimTokenCache;get currentGraph(){return this.mGraphStack.top.graph}get currentToken(){let e=this.mGraphStack.top;return this.mTokenCache[e.token.cursor]}get incidentTrace(){return this.mIncidentTrace}get processStack(){return this.mProcessStack}constructor(e,t,n){this.mTokenGenerator=e,this.mGraphStack=new we,this.mLastTokenPosition={column:1,line:1},this.mTokenCache=new Array,this.mProcessStack=new we,this.mTrimTokenCache=n,this.mIncidentTrace=new Qn(t),this.mGraphStack.push({graph:null,linear:!0,circularGraphs:new A,token:{start:0,cursor:-1}})}collapse(){let e=this.mGraphStack.top,t=this.mTokenCache.slice(e.token.cursor);t.length!==0&&t.at(-1)===null&&t.pop();for(let n of this.mTokenGenerator)t.push(n);return t}getGraphBoundingToken(){let e=this.mGraphStack.top,t=this.mTokenCache[e.token.start],n=this.mTokenCache[e.token.cursor-1];return t??=n,n??=t,[t??null,n??null]}getGraphPosition(){let e=this.mGraphStack.top,t,n;if(t=this.mTokenCache[e.token.start],n=this.mTokenCache[e.token.cursor-1],t??=n,n??=t,!t||!n)return{graph:e.graph,columnEnd:this.mLastTokenPosition.column,columnStart:this.mLastTokenPosition.column,lineEnd:this.mLastTokenPosition.line,lineStart:this.mLastTokenPosition.line};let o,i;if(n.value.includes(`
`)){let s=n.value.split(`
`);i=n.lineNumber+s.length-1,o=1+s[s.length-1].length}else o=n.columnNumber+n.value.length,i=n.lineNumber;return{graph:e.graph,lineStart:t.lineNumber,columnStart:t.columnNumber,lineEnd:i,columnEnd:o}}getTokenPosition(){let e=this.mGraphStack.top,t=this.currentToken;if(!t)return{graph:e.graph,columnEnd:this.mLastTokenPosition.column,columnStart:this.mLastTokenPosition.column,lineEnd:this.mLastTokenPosition.line,lineStart:this.mLastTokenPosition.line};let n,o;if(t.value.includes(`
`)){let i=t.value.split(`
`);o=t.lineNumber+i.length-1,n=1+i[i.length-1].length}else n=t.columnNumber+t.value.length,o=t.lineNumber;return{graph:e.graph,lineStart:t.lineNumber,columnStart:t.columnNumber,lineEnd:o,columnEnd:n}}graphIsCircular(e){let t=this.mGraphStack.top;if(!t.circularGraphs.has(e))return!1;if(e.isJunction){if(t.circularGraphs.get(e)>r.MAX_JUNCTION_CIRCULAR_REFERENCES)throw new f("Junction graph called circular too often.",this);return!1}return!0}moveNextToken(){let e=this.mGraphStack.top;if(e.circularGraphs.size>0&&(e.circularGraphs=new A),e.graph&&e.graph.isJunction)throw new f("Junction graph must not have own nodes.",this);if(e.token.cursor++,e.token.cursor<this.mTokenCache.length)return;let t=this.mTokenGenerator.next();if(t.done){this.mTokenCache.push(null);return}this.mLastTokenPosition.column=t.value.columnNumber,this.mLastTokenPosition.line=t.value.lineNumber,this.mTokenCache.push(t.value)}popGraphStack(e){let t=this.mGraphStack.pop(),n=this.mGraphStack.top;if(e&&(t.token.cursor=t.token.start),t.token.cursor!==t.token.start&&n.circularGraphs.size>0&&(n.circularGraphs=new A),!this.mTrimTokenCache){n.token.cursor=t.token.cursor;return}t.linear?(this.mTokenCache.splice(0,t.token.cursor),n.token.start=0,n.token.cursor=0):n.token.cursor=t.token.cursor}pushGraphStack(e,t){let n=this.mGraphStack.top,o={graph:e,linear:t&&n.linear,circularGraphs:new A(n.circularGraphs),token:{start:n.token.cursor,cursor:n.token.cursor}},i=o.circularGraphs.get(e)??0;o.circularGraphs.set(e,i+1),this.mGraphStack.push(o)}}});var un,qi=d(()=>{R();Jn();Qo();_i();un=class r{static NODE_NULL_RESULT=Symbol("FAILED_NODE_VALUE_PARSE");static NODE_VALUE_LIST_END_MEET=Symbol("FAILED_NODE_VALUE_PARSE");mConfiguration;mLexer;mRootPart;get lexer(){return this.mLexer}constructor(e,t){this.mLexer=e,this.mRootPart=null,this.mConfiguration={keepTraceIncidents:!1,trimTokenCache:!1,...t}}parse(e,t){if(this.mRootPart===null)throw new f("Parser has not root part set.",this);let n=new eo(this.mLexer.tokenize(e,t),this.mConfiguration.keepTraceIncidents,this.mConfiguration.trimTokenCache),o=(()=>{try{return this.beginParseProcess(n,this.mRootPart)}catch(s){if(s instanceof bt)return n.incidentTrace.push(s.message,n.currentGraph,s.lineStart,s.columnStart,s.lineEnd,s.columnEnd,!0,s),Y.PARSER_ERROR;let a=s instanceof Error?s.message:s.toString(),l=n.getGraphPosition();return n.incidentTrace.push(a,n.currentGraph,l.lineStart,l.columnStart,l.lineEnd,l.columnEnd,!0,s),Y.PARSER_ERROR}})();if(o===Y.PARSER_ERROR)throw new Y(n.incidentTrace);let i=n.collapse();if(i.length!==0){let s=i[0];if(n.incidentTrace.top.range.lineEnd===1&&n.incidentTrace.top.range.columnEnd===1){let a=`Tokens could not be parsed. Graph end meet without reaching last token. Current: "${s.value}" (${s.type})`;n.incidentTrace.push(a,this.mRootPart,s.lineNumber,s.columnNumber,s.lineNumber,s.columnNumber)}throw new Y(n.incidentTrace)}return o}setRootGraph(e){this.mRootPart=e}beginParseProcess(e,t){e.moveNextToken(),e.processStack.push({type:"graph-parse",parameter:{graph:t,linear:!0},state:0});let n=r.NODE_NULL_RESULT;for(;e.processStack.top;)n=this.processStack(e,e.processStack.top,n);return n}processChainedNodeParseProcess(e,t,n){switch(t.state){case 0:{let s=t.parameter.node.connections.next;return s===null?(e.processStack.pop(),{}):(t.state++,e.processStack.push({type:"node-parse",parameter:{node:s},state:0,values:{}}),r.NODE_NULL_RESULT)}case 1:{let o=n;return o===Y.PARSER_ERROR?(e.processStack.pop(),Y.PARSER_ERROR):(e.processStack.pop(),o)}}throw new f(`Invalid node next parse state "${t.state}".`,this)}processGraphParseProcess(e,t,n){let o=t.parameter.graph;switch(t.state){case 0:{if(e.graphIsCircular(o)){let s=e.getGraphPosition();return e.incidentTrace.push("Circular graph detected.",o,s.lineStart,s.columnStart,s.lineEnd,s.columnEnd),e.processStack.pop(),Y.PARSER_ERROR}let i=t.parameter.linear;return e.pushGraphStack(o,i),t.state++,e.processStack.push({type:"node-parse",parameter:{node:o.node},state:0,values:{}}),r.NODE_NULL_RESULT}case 1:{let i=n;if(i===Y.PARSER_ERROR)return e.popGraphStack(!0),e.processStack.pop(),Y.PARSER_ERROR;let s=o.convert(i,e);if(typeof s=="symbol"){let a=e.getGraphPosition();return e.incidentTrace.push(s.description??"Unknown data convert error",a.graph,a.lineStart,a.columnStart,a.lineEnd,a.columnEnd),e.popGraphStack(!0),e.processStack.pop(),Y.PARSER_ERROR}return e.popGraphStack(!1),e.processStack.pop(),s}}throw new f(`Invalid graph parse state "${t.state}".`,this)}processNodeParseProcess(e,t,n){let o=t.parameter.node;switch(t.state){case 0:return e.processStack.push({type:"node-value-parse",parameter:{node:o,valueIndex:0},state:0,values:{}}),t.state++,r.NODE_NULL_RESULT;case 1:{let i=n;return i===Y.PARSER_ERROR?(e.processStack.pop(),Y.PARSER_ERROR):(t.values.nodeValueResult=i,e.processStack.push({type:"node-next-parse",parameter:{node:o},state:0}),t.state++,r.NODE_NULL_RESULT)}case 2:{let i=n;if(i===Y.PARSER_ERROR)return e.processStack.pop(),Y.PARSER_ERROR;let s=o.mergeData(t.values.nodeValueResult,i);return e.processStack.pop(),s}}throw new f(`Invalid node parse state "${t.state}".`,this)}processNodeValueParseProcess(e,t,n){let o=t.parameter.node;switch(t.state){case 0:{if(n!==r.NODE_NULL_RESULT&&n!==Y.PARSER_ERROR)return t.values.parseResult=n,t.state++,r.NODE_NULL_RESULT;let i=t.parameter.valueIndex,s=o.connections;if(i>=s.values.length)return t.values.parseResult=r.NODE_VALUE_LIST_END_MEET,t.state++,r.NODE_NULL_RESULT;t.parameter.valueIndex++;let a=e.currentToken,l=s.values[i];if(typeof l=="string"){if(!a){if(s.required){let c=e.getTokenPosition();e.incidentTrace.push(`Unexpected end of statement. Token "${l}" expected.`,e.currentGraph,c.lineStart,c.columnStart,c.lineEnd,c.columnEnd)}return r.NODE_NULL_RESULT}if(l!==a.type){if(s.required){let c=e.getTokenPosition();e.incidentTrace.push(`Unexpected token "${a.value}". "${l}" expected`,e.currentGraph,c.lineStart,c.columnStart,c.lineEnd,c.columnEnd)}return r.NODE_NULL_RESULT}return e.moveNextToken(),a.value}else{let c=s.values.length===1||s.values.length===i+1;return e.processStack.push({type:"graph-parse",parameter:{graph:l,linear:c},state:0}),r.NODE_NULL_RESULT}}case 1:{let i=t.values.parseResult,s=o.connections;if(i===r.NODE_VALUE_LIST_END_MEET&&!s.required){e.processStack.pop();return}return i===r.NODE_VALUE_LIST_END_MEET?(e.processStack.pop(),Y.PARSER_ERROR):(e.processStack.pop(),i)}}throw new f(`Invalid node value parse state "${t.state}".`,this)}processStack(e,t,n){switch(t.type){case"graph-parse":return this.processGraphParseProcess(e,t,n);case"node-parse":return this.processNodeParseProcess(e,t,n);case"node-value-parse":return this.processNodeValueParseProcess(e,t,n);case"node-next-parse":return this.processChainedNodeParseProcess(e,t,n)}}}});var J,er=d(()=>{J=class r{static define(e,t=!1){return new r(e,t)}mDataConverterList;mGraphCollector;mIsJunction;mResolvedGraphNode;get isJunction(){return this.mIsJunction}get node(){return this.mResolvedGraphNode||(this.mResolvedGraphNode=this.mGraphCollector().root),this.mResolvedGraphNode}constructor(e,t){this.mGraphCollector=e,this.mDataConverterList=new Array,this.mResolvedGraphNode=null,this.mIsJunction=t}convert(e,t){if(this.mDataConverterList.length===0)return e;let n=t.getGraphBoundingToken(),o=n[0]??void 0,i=n[1]??void 0;if(this.mDataConverterList.length===1)return this.mDataConverterList[0](e,o,i);let s=e;for(let a of this.mDataConverterList)if(s=a(s,o,i),typeof s=="symbol")return s;return s}converter(e){let t=new r(this.mGraphCollector,this.isJunction);return t.mDataConverterList.push(...this.mDataConverterList,e),t}}});var V,Ji=d(()=>{R();er();V=class r{static new(){let e=new r("",!1,[]);return e.mRootNode=null,e}mConnections;mIdentifier;mRootNode;get configuration(){return{dataKey:this.mIdentifier.dataKey,isList:this.mIdentifier.type==="list",isRequired:this.mConnections.required,isBranch:this.mConnections.values.length>1}}get connections(){return this.mConnections}get root(){if(!this.mRootNode)throw new f("Staring nodes must be chained with another node to be used.",this);return this.mRootNode}constructor(e,t,n,o){if(e==="")this.mIdentifier={type:"empty",dataKey:"",mergeKey:""};else if(e.endsWith("[]"))this.mIdentifier={type:"list",mergeKey:"",dataKey:e.substring(0,e.length-2)};else if(e.includes("<-")){let s=e.split("<-");this.mIdentifier={type:"merge",dataKey:s[0],mergeKey:s[1]}}else this.mIdentifier={type:"single",mergeKey:"",dataKey:e};let i=n.map(s=>s instanceof r?J.define(()=>s):s);this.mConnections={required:t,values:i,next:null},o?this.mRootNode=o:this.mRootNode=this}mergeData(e,t){if(this.mIdentifier.type==="empty")return t;let n=t,o=typeof e>"u";if(this.mIdentifier.type==="single"){if(this.mIdentifier.dataKey in t)throw new f(`Graph path has a duplicate value identifier "${this.mIdentifier.dataKey}"`,this);return o||(n[this.mIdentifier.dataKey]=e),t}if(this.mIdentifier.type==="list"){let a;o?a=new Array:Array.isArray(e)?a=e:a=[e];let l=(()=>{if(this.mIdentifier.dataKey in t){let c=n[this.mIdentifier.dataKey];return Array.isArray(c)?(c.unshift(...a),c):(a.push(c),a)}return a})();return n[this.mIdentifier.dataKey]=l,t}if(o)return t;let i=(()=>{if(!this.mIdentifier.mergeKey)throw new f("Cant merge data without a merge key.",this);if(typeof e!="object"||e===null)throw new f("Node data must be an object when merge key is set.",this);if(!(this.mIdentifier.mergeKey in e))throw new f(`Node data does not contain merge key "${this.mIdentifier.mergeKey}"`,this);return e[this.mIdentifier.mergeKey]})();if(typeof i>"u")return t;let s=n[this.mIdentifier.dataKey];if(typeof s>"u")return n[this.mIdentifier.dataKey]=i,n;if(!Array.isArray(s))throw new f("Chain data merge value is not an array but should be.",this);return Array.isArray(i)?s.unshift(...i):s.unshift(i),t}optional(e,t){let n=typeof t>"u"?"":e,o=typeof t>"u"?e:t,i=new Array;Array.isArray(o)?i.push(...o):i.push(o);let s=new r(n,!1,i,this.mRootNode);return this.setChainedNode(s),s}required(e,t){let n=typeof t>"u"?"":e,o=typeof t>"u"?e:t,i=new Array;Array.isArray(o)?i.push(...o):i.push(o);let s=new r(n,!0,i,this.mRootNode);return this.setChainedNode(s),s}setChainedNode(e){if(this.mConnections.next!==null)throw new f("Node can only be chained to a single node.",this);this.mConnections.next=e}}});var Qi=d(()=>{Jn();qo();Jo();Zi();Qo();qi();Ji();er()});var dn,tr=d(()=>{R();Qi();$n();rn();an();pt();on();dn=class{mParser;constructor(){this.mParser=null}parse(e){if(!this.mParser){let t=this.createLexer();this.mParser=this.createParser(t)}return this.mParser.parse(e)}createLexer(){let e=new cn;e.validWhitespaces=` 
\r`,e.trimWhitespace=!0;let t=e.createTokenPattern({pattern:{regex:/(?:(?!}}).)*/,type:"ExpressionValue"}}),n=e.createTokenPattern({pattern:{start:{regex:/{{/,type:"ExpressionStart"},end:{regex:/}}/,type:"ExpressionEnd"}}},x=>{x.useChildPattern(t)}),o=e.createTokenPattern({pattern:{regex:/[^>\s\n="/]+/,type:"Identifier"}}),i=e.createTokenPattern({pattern:{regex:/(?:(?!{{|"|<).)+/,type:"XmlValue"}}),s=e.createTokenPattern({pattern:{regex:/<!--.*?-->/,type:"XmlComment"}}),a=e.createTokenPattern({pattern:{regex:/=/,type:"XmlAssignment"}}),l=e.createTokenPattern({pattern:{start:{regex:/"/,type:"XmlExplicitValueIdentifier"},end:{regex:/"/,type:"XmlExplicitValueIdentifier"}}},x=>{x.useChildPattern(n),x.useChildPattern(i)}),c=e.createTokenPattern({pattern:{start:{regex:/<\//,type:"XmlOpenClosingBracket"},end:{regex:/>/,type:"XmlCloseBracket"}}},x=>{x.useChildPattern(o)}),p=e.createTokenPattern({pattern:{start:{regex:/</,type:"XmlOpenBracket"},end:{regex:/(?<closeClosingBracket>\/>)|(?<closeBracket>>)/,type:{closeClosingBracket:"XmlCloseClosingBracket",closeBracket:"XmlCloseBracket"}}}},x=>{x.useChildPattern(a),x.useChildPattern(o),x.useChildPattern(l)}),m=e.createTokenPattern({pattern:{regex:/[^()"'`/)]+/,type:"InstructionInstructionValue"}}),h=e.createTokenPattern({pattern:{innerType:"InstructionInstructionValue",start:{regex:/\//,type:"InstructionInstructionValue"},end:{regex:/\//,type:"InstructionInstructionValue"}}},x=>{x.useChildPattern(F),x.useChildPattern(P),x.useChildPattern(g),x.useChildPattern(T),x.useChildPattern(m)}),T=e.createTokenPattern({pattern:{innerType:"InstructionInstructionValue",start:{regex:/\(/,type:"InstructionInstructionValue"},end:{regex:/\)/,type:"InstructionInstructionValue"}}},x=>{x.useChildPattern(h),x.useChildPattern(F),x.useChildPattern(P),x.useChildPattern(g),x.useChildPattern(m)}),F=e.createTokenPattern({pattern:{innerType:"InstructionInstructionValue",start:{regex:/"/,type:"InstructionInstructionValue"},end:{regex:/"/,type:"InstructionInstructionValue"}}},x=>{x.useChildPattern(h),x.useChildPattern(P),x.useChildPattern(g),x.useChildPattern(T),x.useChildPattern(m)}),P=e.createTokenPattern({pattern:{innerType:"InstructionInstructionValue",start:{regex:/'/,type:"InstructionInstructionValue"},end:{regex:/'/,type:"InstructionInstructionValue"}}},x=>{x.useChildPattern(h),x.useChildPattern(F),x.useChildPattern(g),x.useChildPattern(T),x.useChildPattern(m)}),g=e.createTokenPattern({pattern:{innerType:"InstructionInstructionValue",start:{regex:/`/,type:"InstructionInstructionValue"},end:{regex:/`/,type:"InstructionInstructionValue"}}},x=>{x.useChildPattern(h),x.useChildPattern(F),x.useChildPattern(P),x.useChildPattern(T),x.useChildPattern(m)}),v=e.createTokenPattern({pattern:{regex:/\$[^(\s\n/{]+/,type:"InstructionStart"}}),N=e.createTokenPattern({pattern:{start:{regex:/\(/,type:"InstructionInstructionOpeningBracket"},end:{regex:/\)/,type:"InstructionInstructionClosingBracket"}}},x=>{x.useChildPattern(h),x.useChildPattern(F),x.useChildPattern(P),x.useChildPattern(g),x.useChildPattern(T),x.useChildPattern(m)}),L=e.createTokenPattern({pattern:{start:{regex:/{/,type:"InstructionBodyStartBraket"},end:{regex:/}/,type:"InstructionBodyCloseBraket"}}},x=>{for(let Rn of U)x.useChildPattern(Rn)}),U=[s,c,p,l,n,v,N,L,i];for(let x of U)e.useRootTokenPattern(x);return e}createParser(e){let t=new un(e),n=J.define(()=>V.new().required("ExpressionStart").optional("value","ExpressionValue").required("ExpressionEnd")).converter(g=>{let v=new Ae;return v.value=g.value??"",v}),o=J.define(()=>{let g=o;return V.new().required("data[]",V.new().required("value",[n,V.new().required("text","XmlValue")])).optional("data<-data",g)}),i=J.define(()=>V.new().required("name","Identifier").optional("attributeValue",V.new().required("XmlAssignment").required("XmlExplicitValueIdentifier").optional("list<-data",o).required("XmlExplicitValueIdentifier"))).converter(g=>{let v=new Array;if(g.attributeValue?.list)for(let N of g.attributeValue.list)N.value instanceof Ae?v.push(N.value):v.push(N.value.text);return{name:g.name,values:v}}),s=J.define(()=>{let g=s;return V.new().required("data[]",i).optional("data<-data",g)}),a=J.define(()=>{let g=a;return V.new().required("data[]",V.new().required("value",[n,V.new().required("text","XmlValue"),V.new().required("XmlExplicitValueIdentifier").required("text","XmlValue").required("XmlExplicitValueIdentifier")])).optional("data<-data",g)}),l=J.define(()=>V.new().required("list<-data",a)).converter(g=>{let v=new je;for(let N of g.list)N.value instanceof Ae?v.addValue(N.value):v.addValue(N.value.text);return v}),c=J.define(()=>V.new().required("XmlComment")).converter(()=>null),p=J.define(()=>V.new().required("XmlOpenBracket").required("openingTagName","Identifier").optional("attributes<-data",s).required("closing",[V.new().required("XmlCloseClosingBracket"),V.new().required("XmlCloseBracket").required("values",F).required("XmlOpenClosingBracket").required("closingTageName","Identifier").required("XmlCloseBracket")])).converter(g=>{if("closingTageName"in g.closing&&g.openingTagName!==g.closing.closingTageName)throw new f(`Opening (${g.openingTagName}) and closing tagname (${g.closing.closingTageName}) does not match`,this);let v=new Ve;if(v.tagName=g.openingTagName,g.attributes)for(let N of g.attributes)v.setAttribute(N.name).addValue(...N.values);return"values"in g.closing&&v.appendChild(...g.closing.values),v}),m=J.define(()=>{let g=m;return V.new().required("list[]","InstructionInstructionValue").optional("list<-list",g)}),h=J.define(()=>V.new().required("instructionName","InstructionStart").optional("instruction",V.new().required("InstructionInstructionOpeningBracket").required("value<-list",m).required("InstructionInstructionClosingBracket")).optional("body",V.new().required("InstructionBodyStartBraket").required("value",F).required("InstructionBodyCloseBraket"))).converter(g=>{let v=new dt;return v.instructionType=g.instructionName.substring(1),v.instruction=g.instruction?.value.join("")??"",g.body&&v.appendChild(...g.body.value),v}),T=J.define(()=>{let g=T;return V.new().required("list[]",[c,p,h,l]).optional("list<-list",g)}),F=J.define(()=>{let g=T;return V.new().optional("list<-list",g)}).converter(g=>{let v=new Array;if(g.list)for(let N of g.list)N!==null&&v.push(N);return v}),P=J.define(()=>V.new().required("content",F)).converter(g=>{let v=new be;return v.appendChild(...g.content),v});return t.setRootGraph(P),t}}});var Ce,Ft=d(()=>{R();St();zo();tn();ut();jo();ie();Xo();Wo();Wi();At();tr();Ce=class r extends Ot{static mTemplateCache=new A;static mXmlParser=new dn;mComponentElement;mRootBuilder;mUpdateMode;get element(){return this.mComponentElement.htmlElement}get updateMode(){return this.mUpdateMode}constructor(e){super({applicationContext:e.applicationContext,constructor:e.processorConstructor,loggingType:1,trigger:127,isolate:(e.updateMode&1)!==0,trackConstructorChanges:!0}),le.registerComponent(this,e.htmlElement),this.addCreationHook(n=>{le.registerComponent(this,this.mComponentElement.htmlElement,n)}).addCreationHook(n=>this.registerObject(n)).addCreationHook(n=>{le.registerComponent(this,this.mComponentElement.htmlElement,n)});let t=r.mTemplateCache.get(e.processorConstructor);t?t=t.clone():(t=r.mXmlParser.parse(e.templateString??""),r.mTemplateCache.set(e.processorConstructor,t)),this.mUpdateMode=e.updateMode,this.mComponentElement=new ln(e.htmlElement),this.mRootBuilder=new jt(this.applicationContext,t,new qn(this,e.expressionModule),new xe(this),"ROOT"),this.mComponentElement.shadowRoot.appendChild(this.mRootBuilder.anchor),this.setProcessorAttributes(Me,new Me(this.mRootBuilder.values)),this.setProcessorAttributes(r,this),(e.updateMode&2)===0&&this.setAutoUpdate(127)}addStyle(e){let t=document.createElement("style");t.innerHTML=e,this.mComponentElement.shadowRoot.prepend(t)}attributeChanged(e,t,n){this.call("onAttributeChange",!1,e,t,n)}connected(){this.call("onConnect",!1)}deconstruct(){this.call("onDeconstruct",!1),this.mRootBuilder.deconstruct(),super.deconstruct()}disconnected(){this.call("onDisconnect",!1)}onUpdate(){return this.mRootBuilder.update()?(this.call("onUpdate",!1),!0):!1}}});function z(r){return H.enableGlobalTracing(mu(globalThis)),(e,t)=>{I.registerInjectable(e,t.metadata,"instanced"),le.registerConstructor(e,r.selector);let n=class extends HTMLElement{mComponent;constructor(){super();let o=H.current.attachment(st.CONFIGURATION_ATTACHMENT);o||(o=Ge.DEFAULT),this.mComponent=new Ce({applicationContext:o,processorConstructor:e,templateString:r.template??null,expressionModule:r.expressionmodule,htmlElement:this,updateMode:r.updateScope??0}).setup(),r.style&&this.mComponent.addStyle(r.style),this.mComponent.update()}connectedCallback(){this.mComponent.connected()}disconnectedCallback(){this.mComponent.disconnected()}};globalThis.customElements.define(r.selector,n)}}var mu,es=d(()=>{Z();Jt();Bn();me();jo();At();Ft();mu=r=>{let e={target:r,patches:{requirements:{promise:r.Promise?.name,eventTarget:r.EventTarget?.name},classes:{eventTargets:new Array,callback:new Array},functions:new Array},errorHandling:!0},t=[r.requestAnimationFrame?.name,r.setInterval?.name,r.setTimeout?.name];e.patches.functions.push(...t.filter(i=>!!i));let n=[r.XMLHttpRequestEventTarget?.name,r.XMLHttpRequest?.name,r.Document?.name,r.SVGElement?.name,r.Element?.name,r.HTMLElement?.name,r.HTMLMediaElement?.name,r.HTMLFrameSetElement?.name,r.HTMLBodyElement?.name,r.HTMLFrameElement?.name,r.HTMLIFrameElement?.name,r.HTMLMarqueeElement?.name,r.Worker?.name,r.IDBRequest?.name,r.IDBOpenDBRequest?.name,r.IDBDatabase?.name,r.IDBTransaction?.name,r.WebSocket?.name,r.FileReader?.name,r.Notification?.name,r.RTCPeerConnection?.name];e.patches.classes.eventTargets.push(...n.filter(i=>!!i));let o=[r.ResizeObserver?.name,r.MutationObserver?.name,r.IntersectionObserver?.name];return e.patches.classes.callback.push(...o.filter(i=>!!i)),e}});var ts=d(()=>{Mt()});function Tt(r){return(e,t)=>{I.registerInjectable(e,t.metadata,"instanced"),ge.register(Ze,e,{access:r.access,trigger:r.trigger,targetRestrictions:r.targetRestrictions})}}var pn=d(()=>{Z();lt();Un()});function ze(r){return(e,t)=>{I.registerInjectable(e,t.metadata,"instanced"),ge.register(pe,e,{access:r.access,selector:r.selector,trigger:r.trigger})}}var zt=d(()=>{Z();lt();ft()});function $e(r){return(e,t)=>{I.registerInjectable(e,t.metadata,"instanced"),ge.register(Qe,e,{instructionType:r.instructionType,trigger:r.trigger})}}var $t=d(()=>{Z();lt();_n()});var ns,nr,hu,Ht,mn,to=d(()=>{Z();Ft();ue();Le();ie();pn();ns=[Tt({access:1,trigger:127,targetRestrictions:[Ce]})];Ht=class Ht extends(hu=E){static METADATA_USER_EVENT_LISTENER_PROPERIES="pwb:user_event_listener_properties";mEventListenerList;mTargetElement;constructor(e=I.use(Ce)){super();let t=new Array,n=e.processorConstructor;do{let o=ce.get(n).getMetadata(Ht.METADATA_USER_EVENT_LISTENER_PROPERIES);if(o)for(let i of o)t.push(i)}while(n=Object.getPrototypeOf(n));this.mEventListenerList=new Array,this.mTargetElement=e.element;for(let o of t){let[i,s]=o,a=Reflect.get(e.processor,i);a=a.bind(e.processor),this.mEventListenerList.push([s,a]),this.mTargetElement.addEventListener(s,a)}}onDeconstruct(){for(let e of this.mEventListenerList){let[t,n]=e;this.mTargetElement.removeEventListener(t,n)}}};nr=D(hu),Ht=y(nr,0,"ComponentEventListenerComponentExtension",ns,Ht),u(nr,1,Ht);mn=Ht});var os=d(()=>{R();Z();to()});var hn,or=d(()=>{hn=class extends window.Event{mValue;get value(){return this.mValue}constructor(e,t){super(e),this.mValue=t}}});var yn,rr=d(()=>{or();yn=class{mElement;mEventName;constructor(e,t){this.mEventName=e,this.mElement=t}dispatchEvent(e){let t=new hn(this.mEventName,e);this.mElement.dispatchEvent(t)}}});function O(r){return(e,t)=>{if(t.static)throw new f("Event target is not for a static property.",O);let n=null;return{get(){if(!n){let o=(()=>{try{return le.ofProcessor(this).component}catch{throw new f("PwbComponentEvent target class is not a component.",this)}})();n=new yn(r,o.element)}return n}}}}var rs=d(()=>{R();At();rr()});var is,ir,yu,Kt,fn,sr=d(()=>{R();Z();Ft();ue();Le();ie();pn();is=[Tt({access:2,trigger:127,targetRestrictions:[Ce]})];Kt=class Kt extends(yu=E){static METADATA_EXPORTED_PROPERTIES="pwb:exported_properties";mComponent;constructor(e=I.use(Ce)){super(),this.mComponent=e;let t=new q,n=e.processorConstructor;do{let i=ce.get(n).getMetadata(Kt.METADATA_EXPORTED_PROPERTIES);i&&t.push(...i)}while(n=Object.getPrototypeOf(n));let o=new Set(t);o.size>0&&this.connectExportedProperties(o)}connectExportedProperties(e){this.exportPropertyAsAttribute(e),this.patchHtmlAttributes(e)}exportPropertyAsAttribute(e){for(let t of e){let n={};n.enumerable=!0,n.configurable=!0,delete n.value,delete n.writable,n.set=o=>{Reflect.set(this.mComponent.processor,t,o)},n.get=()=>{let o=Reflect.get(this.mComponent.processor,t);return typeof o=="function"&&(o=o.bind(this.mComponent.processor)),o},Object.defineProperty(this.mComponent.element,t,n)}}patchHtmlAttributes(e){let t=this.mComponent.element.getAttribute;new MutationObserver(o=>{for(let i of o){let s=i.attributeName,a=t.call(this.mComponent.element,s);Reflect.set(this.mComponent.element,s,a),this.mComponent.attributeChanged(s,i.oldValue,a)}}).observe(this.mComponent.element,{attributeFilter:[...e],attributeOldValue:!0});for(let o of e)if(this.mComponent.element.hasAttribute(o)){let i=t.call(this.mComponent.element,o);this.mComponent.element.setAttribute(o,i)}this.mComponent.element.getAttribute=o=>e.has(o)?Reflect.get(this.mComponent.element,o):t.call(this.mComponent.element,o)}};ir=D(yu),Kt=y(ir,0,"ExportExtension",is,Kt),u(ir,1,Kt);fn=Kt});function w(r,e){if(e.static)throw new f("Event target is not for a static property.",w);let t=ce.forInternalDecorator(e.metadata),n=t.getMetadata(fn.METADATA_EXPORTED_PROPERTIES)??new Array;n.push(e.name),t.setMetadata(fn.METADATA_EXPORTED_PROPERTIES,n)}var ss=d(()=>{R();Z();sr()});function oe(r){return(e,t)=>{if(t.static)throw new f("Event target is not for a static property.",oe);return{get(){let i=(()=>{try{return le.ofProcessor(this).component}catch{throw new f("PwbChild target class is not a component.",this)}})().getProcessorAttribute(Me).data.store[r];if(i instanceof Element)return i;throw new f(`Can't find child "${r}".`,this)}}}}var as=d(()=>{R();At();tn()});var ls,ar,fu,gn,cs=d(()=>{R();Z();pt();ue();ut();Ee();ie();qe();gt();$t();ls=[$e({instructionType:"dynamic-content",trigger:111})];gn=class extends(fu=E){mLastTemplate;mModuleValues;mProcedure;constructor(e=I.use(Q),t=I.use(W)){super(),this.mModuleValues=t,this.mLastTemplate=null,this.mProcedure=this.mModuleValues.createExpressionProcedure(e.value)}onUpdate(){let e=this.mProcedure.execute();if(!e||!(e instanceof be))throw new f("Dynamic content method has a wrong result type.",this);if(this.mLastTemplate!==null&&this.mLastTemplate.equals(e))return null;let t=e.clone();this.mLastTemplate=t;let n=new ve;return n.addElement(t,new xe(this.mModuleValues.data)),n}};ar=D(fu),gn=y(ar,0,"DynamicContentInstructionModule",ls,gn),u(ar,1,gn)});var us,lr,gu,bn,ds=d(()=>{Z();ue();Ee();Le();ie();zt();yt();Ue();us=[ze({access:3,selector:/^\([[\w\-$]+\)$/,trigger:127})];bn=class extends(gu=E){mEventName;mListener;mTarget;constructor(e=I.use(ne),t=I.use(W),n=I.use(Te)){super(),this.mTarget=e,this.mEventName=n.name.substring(1,n.name.length-1);let o=t.createExpressionProcedure(n.value,["$event"]);this.mListener=i=>{o.setTemporaryValue("$event",i),o.execute()},this.mTarget.addEventListener(this.mEventName,this.mListener)}onDeconstruct(){this.mTarget.removeEventListener(this.mEventName,this.mListener)}};lr=D(gu),bn=y(lr,0,"EventAttributeModule",us,bn),u(lr,1,bn)});var ps,cr,bu,Tn,ms=d(()=>{R();Z();pt();ue();ut();Ee();ie();qe();mt();gt();$t();ps=[$e({instructionType:"for",trigger:111})];Tn=class extends(bu=E){mExpression;mLastEntries;mModuleValues;mTemplate;constructor(e=I.use(Ie),t=I.use(W),n=I.use(Q)){super(),this.mTemplate=e,this.mModuleValues=t,this.mLastEntries=new Array;let o=n.value,s=new RegExp(/^\s*([a-zA-Z]+[a-zA-Z0-9]*)\s*of\s+([^;]+)\s*(;\s*([a-zA-Z]+[a-zA-Z0-9]*)\s*=\s*(.*)\s*)?$/).exec(o);if(!s)throw new f(`For-Parameter value has wrong format: ${o}`,this);let a=s[1],l=s[2],c=s[4]??null,p=s[5],m=this.mModuleValues.createExpressionProcedure(l),h=c?this.mModuleValues.createExpressionProcedure(p,["$index",a]):null;this.mExpression={iterateVariableName:a,iterateValueProcedure:m,indexExportVariableName:c,indexExportProcedure:h}}onUpdate(){let e=new ve,t=this.mExpression.iterateValueProcedure.execute();if(typeof t=="object"&&t!==null||Array.isArray(t)){let n=Symbol.iterator in t?Object.entries([...t]):Object.entries(t);if(this.compareEntries(n,this.mLastEntries))return null;this.mLastEntries=n;for(let[o,i]of n)this.addTemplateForElement(e,this.mExpression,i,o);return e}else return null}addTemplateForElement=(e,t,n,o)=>{let i=new xe(this.mModuleValues.data);if(i.setTemporaryValue(t.iterateVariableName,n),t.indexExportProcedure&&t.indexExportVariableName){t.indexExportProcedure.setTemporaryValue("$index",o),t.indexExportProcedure.setTemporaryValue(t.iterateVariableName,n);let a=t.indexExportProcedure.execute();i.setTemporaryValue(t.indexExportVariableName,a)}let s=new be;s.appendChild(...this.mTemplate.childList),e.addElement(s,i)};compareEntries(e,t){if(e.length!==t.length)return!1;for(let n=0;n<e.length;n++){let[o,i]=e[n],[s,a]=t[n];if(o!==s||i!==a)return!1}return!0}};cr=D(bu),Tn=y(cr,0,"ForInstructionModule",ps,Tn),u(cr,1,Tn)});var hs,ur,Tu,vn,ys=d(()=>{Z();pt();ue();ut();Ee();ie();qe();mt();gt();$t();hs=[$e({instructionType:"if",trigger:111})];vn=class extends(Tu=E){mLastBoolean;mModuleValues;mProcedure;mTemplateReference;constructor(e=I.use(Ie),t=I.use(W),n=I.use(Q)){super(),this.mTemplateReference=e,this.mModuleValues=t,this.mProcedure=this.mModuleValues.createExpressionProcedure(n.value),this.mLastBoolean=!1}onUpdate(){let e=this.mProcedure.execute();if(!!e!==this.mLastBoolean){this.mLastBoolean=!!e;let t=new ve;if(e){let n=new be;n.appendChild(...this.mTemplateReference.childList),t.addElement(n,new xe(this.mModuleValues.data))}return t}else return null}};ur=D(Tu),vn=y(ur,0,"IfInstructionModule",hs,vn),u(ur,1,vn)});var fs,dr,vu,Pn,gs=d(()=>{Z();ue();Ee();Le();ie();zt();yt();Ue();fs=[ze({access:1,selector:/^\[[\w$]+\]$/,trigger:127})];Pn=class extends(vu=E){mLastValue;mProcedure;mTarget;mTargetProperty;constructor(e=I.use(ne),t=I.use(W),n=I.use(Te)){super(),this.mTarget=e,this.mProcedure=t.createExpressionProcedure(n.value),this.mTargetProperty=n.name.substring(1,n.name.length-1),this.mLastValue=Symbol("Uncomparable")}onUpdate(){let e=this.mProcedure.execute();return e===this.mLastValue?!1:(this.mLastValue=e,Reflect.set(this.mTarget,this.mTargetProperty,e),!0)}};dr=D(vu),Pn=y(dr,0,"OneWayBindingAttributeModule",fs,Pn),u(dr,1,Pn)});var bs,pr,Pu,xn,Ts=d(()=>{Z();ue();tn();Le();ie();ft();zt();yt();Ue();bs=[ze({access:3,selector:/^#[[\w$]+$/,trigger:127})];xn=class extends(Pu=E){constructor(e=I.use(ne),t=I.use(pe),n=I.use(Te),o=I.use(Me)){super();let i=e,s=t.registerObject(i);o.setTemporaryValue(n.name.substring(1),s)}};pr=D(Pu),xn=y(pr,0,"PwbChildAttributeModule",bs,xn),u(pr,1,xn)});var vs,mr,xu,Cn,Ps=d(()=>{Z();an();pt();ue();Ee();ie();qe();gt();$t();vs=[$e({instructionType:"slot",trigger:0})];Cn=class extends(xu=E){mIsSetup;mModuleValues;mSlotName;constructor(e=I.use(W),t=I.use(Q)){super(),this.mModuleValues=e,this.mSlotName=t.value,this.mIsSetup=!1}onUpdate(){if(this.mIsSetup)return null;this.mIsSetup=!0;let e=new Ve;e.tagName="slot",this.mSlotName!==""&&e.setAttribute("name").addValue(this.mSlotName);let t=new be;t.appendChild(e);let n=new ve;return n.addElement(t,this.mModuleValues.data),n}};mr=D(xu),Cn=y(mr,0,"SlotInstructionModule",vs,Cn),u(mr,1,Cn)});var xs,hr,Cu,In,Cs=d(()=>{ue();Le();ie();ft();zt();yt();Ue();Ee();Z();xs=[ze({access:2,selector:/^\[\([[\w$]+\)\]$/,trigger:127})];In=class extends(Cu=E){mAttributeKey;mLastDataValue;mReadProcedure;mTargetNode;mWriteProcedure;constructor(e=I.use(ne),t=I.use(W),n=I.use(Te),o=I.use(pe)){super(),this.mTargetNode=e,this.mAttributeKey=n.name.substring(2,n.name.length-2),this.mReadProcedure=t.createExpressionProcedure(n.value),this.mWriteProcedure=t.createExpressionProcedure(`${n.value} = $DATA;`,["$DATA"]),this.mLastDataValue=Symbol("Uncomparable"),o.registerObject(this.mTargetNode)}onUpdate(){let e=this.mReadProcedure.execute();if(e!==this.mLastDataValue)return Reflect.set(this.mTargetNode,this.mAttributeKey,e),this.mLastDataValue=e,!0;let t=Reflect.get(this.mTargetNode,this.mAttributeKey);return t!==e?(this.mWriteProcedure.setTemporaryValue("$DATA",t),this.mWriteProcedure.execute(),this.mLastDataValue=t,!0):!1}};hr=D(Cu),In=y(hr,0,"TwoWayBindingAttributeModule",xs,In),u(hr,1,In)});var Is,yr,Iu,wn,ws=d(()=>{Z();ue();Le();ie();pn();ft();Ue();to();Is=[Tt({access:1,trigger:127,targetRestrictions:[pe]})];wn=class extends(Iu=E){mEventListenerList;mTargetElement;constructor(e=I.use(pe),t=I.use(ne)){super();let n=new Array,o=e.processorConstructor;do{let i=ce.get(o).getMetadata(mn.METADATA_USER_EVENT_LISTENER_PROPERIES);if(i)for(let s of i)n.push(s)}while(o=Object.getPrototypeOf(o));this.mEventListenerList=new Array,this.mTargetElement=t;for(let i of n){let[s,a]=i,l=Reflect.get(e.processor,s);l=l.bind(e.processor),this.mEventListenerList.push([a,l]),this.mTargetElement.addEventListener(a,l)}}onDeconstruct(){for(let e of this.mEventListenerList){let[t,n]=e;this.mTargetElement.removeEventListener(t,n)}}};yr=D(Iu),wn=y(yr,0,"ComponentEventListenerModuleExtension",Is,wn),u(yr,1,wn)});var me=d(()=>{Mi();Bn();es();ts();ue();Ee();Un();ft();Yn();yt();Ue();mt();_n();Wo();Ft();tn();ut();zn();Ee();pn();zt();Yo();gt();$t();Le();os();rr();or();rs();ss();as();$n();rn();an();Ho();on();tr();cs();ds();ms();ys();gs();Ts();Ps();Cs();to();ws();sr()});var vt=d(()=>{});var Pt,fr=d(()=>{Pt=class{id;kind;sourceNodeId;sourcePortId;targetNodeId;targetPortId;mValid;get valid(){return this.mValid}set valid(e){this.mValid=e}constructor(e,t,n,o,i,s){this.id=e,this.sourceNodeId=t,this.sourcePortId=n,this.targetNodeId=o,this.targetPortId=i,this.kind=s,this.mValid=!0}}});var Es=d(()=>{});var En,Ns=d(()=>{En=class{direction;id;name;mConnectedTo;get connectedTo(){return this.mConnectedTo}set connectedTo(e){this.mConnectedTo=e}constructor(e,t,n){this.id=e,this.name=t,this.direction=n,this.mConnectedTo=null}}});var Nn,ks=d(()=>{Nn=class{direction;id;name;type;valueId;mConnectedTo;get connectedTo(){return this.mConnectedTo}set connectedTo(e){this.mConnectedTo=e}constructor(e,t,n,o,i){this.id=e,this.name=t,this.type=n,this.direction=o,this.valueId=i,this.mConnectedTo=null}}});var xt,gr=d(()=>{Es();Ns();ks();xt=class r{category;definitionId;flowInputs;flowOutputs;id;inputs;outputs;properties;system;mPosition;mSize;get position(){return this.mPosition}get size(){return this.mSize}constructor(e,t,n,o){this.id=e,this.definitionId=t.id,this.category=t.category,this.system=o,this.mPosition={x:n.x,y:n.y},this.mSize={w:8,h:4},this.properties=new Map,this.inputs=new Map,this.flowInputs=new Map;for(let[i,s]of Object.entries(t.inputs))if(s.nodeType==="flow"){let a=r.generatePortId();this.flowInputs.set(i,new En(a,i,"input"))}else{let a=r.generatePortId(),l=r.generateValueId(t.category),c=r.getPortDataType(s);this.inputs.set(i,new Nn(a,i,c,"input",l))}this.outputs=new Map,this.flowOutputs=new Map;for(let[i,s]of Object.entries(t.outputs))if(s.nodeType==="flow"){let a=r.generatePortId();this.flowOutputs.set(i,new En(a,i,"output"))}else{let a=r.generatePortId(),l=r.generateValueId(t.category),c=r.getPortDataType(s);this.outputs.set(i,new Nn(a,i,c,"output",l))}}moveTo(e,t){this.mPosition={x:e,y:t}}resizeTo(e,t){this.mSize={w:Math.max(4,e),h:Math.max(2,t)}}static getPortDataType(e){return e.nodeType==="value"||e.nodeType==="input"?e.dataType:""}static generatePortId(){return crypto.randomUUID().substring(0,8)}static generateValueId(e){let t=crypto.randomUUID().replace(/-/g,"").substring(0,12);return`${String(e).replace(/[^a-zA-Z0-9]/g,"")}_${t}`}}});var no,Ds=d(()=>{vt();fr();gr();no=class{mConnections;mNodes;get connections(){return this.mConnections}get nodes(){return this.mNodes}constructor(){this.mNodes=new Map,this.mConnections=new Map}addNode(e,t,n=!1){let o=crypto.randomUUID(),i=new xt(o,e,t,n);return this.mNodes.set(o,i),i}addExistingNode(e){this.mNodes.set(e.id,e)}removeNode(e){let t=new Array;for(let[n,o]of this.mConnections)(o.sourceNodeId===e||o.targetNodeId===e)&&(t.push(o),this.mConnections.delete(n));return this.mNodes.delete(e),t}addConnection(e,t,n,o,i){let s=this.mNodes.get(e),a=this.mNodes.get(n);if(!s||!a||e===n)return null;if(i==="data"){let l=this.findDataPortById(s,t),c=this.findDataPortById(a,o);if(!l||!c)return null;let p=l.type===c.type;for(let[T,F]of this.mConnections)if(F.targetNodeId===n&&F.targetPortId===o&&F.kind==="data"){this.mConnections.delete(T);break}c.connectedTo=l.valueId;let m=crypto.randomUUID(),h=new Pt(m,e,t,n,o,i);return h.valid=p,this.mConnections.set(m,h),h}else{let l=this.findFlowPortById(s,t),c=this.findFlowPortById(a,o);if(!l||!c)return null;for(let[h,T]of this.mConnections)if(T.sourceNodeId===e&&T.sourcePortId===t&&T.kind==="flow"){this.mConnections.delete(h);break}l.connectedTo=c.id,c.connectedTo=l.id;let p=crypto.randomUUID(),m=new Pt(p,e,t,n,o,i);return this.mConnections.set(p,m),m}}addExistingConnection(e){this.mConnections.set(e.id,e)}removeConnection(e){let t=this.mConnections.get(e);if(!t)return null;let n=this.mNodes.get(t.targetNodeId);if(n)if(t.kind==="data"){let o=this.findDataPortById(n,t.targetPortId);o&&(o.connectedTo=null)}else{let o=this.mNodes.get(t.sourceNodeId),i=o?this.findFlowPortById(o,t.sourcePortId):null,s=this.findFlowPortById(n,t.targetPortId);i&&(i.connectedTo=null),s&&(s.connectedTo=null)}return this.mConnections.delete(e),t}validate(){let e=new Array;for(let t of this.mConnections.values()){if(t.kind!=="data")continue;let n=this.mNodes.get(t.sourceNodeId),o=this.mNodes.get(t.targetNodeId);if(!n||!o){t.valid=!1,e.push(t);continue}let i=this.findDataPortById(n,t.sourcePortId),s=this.findDataPortById(o,t.targetPortId);if(!i||!s){t.valid=!1,e.push(t);continue}let a=i.type===s.type;t.valid=a,a||e.push(t)}return e}getNode(e){return this.mNodes.get(e)}getConnection(e){return this.mConnections.get(e)}getConnectionsForNode(e){let t=new Array;for(let n of this.mConnections.values())(n.sourceNodeId===e||n.targetNodeId===e)&&t.push(n);return t}findDataPortById(e,t){for(let n of e.inputs.values())if(n.id===t)return n;for(let n of e.outputs.values())if(n.id===t)return n;return null}findFlowPortById(e,t){for(let n of e.flowInputs.values())if(n.id===t)return n;for(let n of e.flowOutputs.values())if(n.id===t)return n;return null}}});var Ct,br=d(()=>{Ds();Ct=class{editableByUser;graph;id;system;mImports;mInputs;mLabel;mLocalVariables;mName;mOutputs;get imports(){return this.mImports}get inputs(){return this.mInputs}get localVariables(){return this.mLocalVariables}get label(){return this.mLabel}get name(){return this.mName}get outputs(){return this.mOutputs}constructor(e,t,n,o,i=!1){this.id=e,this.mName=t,this.mLabel=n,this.system=o,this.editableByUser=i,this.graph=new no,this.mInputs={},this.mOutputs={},this.mImports=new Array,this.mLocalVariables=new Array}setName(e){this.mName=e}setLabel(e){this.mLabel=e}setInputs(e){this.mInputs={...e}}setOutputs(e){this.mOutputs={...e}}setImports(e){this.mImports=[...e]}addImport(e){this.mImports.includes(e)||this.mImports.push(e)}removeImport(e){let t=this.mImports.indexOf(e);t!==-1&&this.mImports.splice(t,1)}addInput(e,t){this.mInputs[e]=t}removeInput(e){delete this.mInputs[e]}addOutput(e,t){this.mOutputs[e]=t}removeOutput(e){delete this.mOutputs[e]}addLocalVariable(e,t){this.mLocalVariables.push({name:e,type:t})}removeLocalVariable(e){this.mLocalVariables.splice(e,1)}setLocalVariables(e){this.mLocalVariables=[...e]}}});var oo,As=d(()=>{it();vt();fr();gr();br();ko();oo=class{mProject;constructor(e){this.mProject=e}deserialize(e){let t=new Nt,n=this.parseMetadataComment(e);if(!n)return t;for(let i of n.functions){let s=this.reconstructFunction(i);this.reconstructNodes(s,i.nodes),this.restoreAllPortData(s,i.nodes),this.reconstructConnections(s,i.connections),t.addFunction(s)}let o=t.functions.keys().next().value;return o&&t.setActiveFunction(o),t}parseMetadataComment(e){let n=`${this.mProject.commentToken} #potatno `,o=e.split(`
`);for(let i=o.length-1;i>=0;i--){let s=o[i].trim();if(s.startsWith(n)){let a=s.substring(n.length);try{return JSON.parse(a)}catch{return null}}}return null}reconstructFunction(e){let t=new Ct(e.id,e.name,e.label,e.system,e.editableByUser);return e.inputs&&typeof e.inputs=="object"&&t.setInputs(e.inputs),e.outputs&&typeof e.outputs=="object"&&t.setOutputs(e.outputs),Array.isArray(e.imports)&&t.setImports(e.imports),t}reconstructNodes(e,t){for(let n of t){let o=n.category,i=this.mProject.nodeDefinitions.get(n.nodeDefinitionId);if(i){let s=new xt(n.id,i,n.position??{x:0,y:0},n.system??!1);if(n.size&&s.resizeTo(n.size.w,n.size.h),n.properties)for(let[a,l]of Object.entries(n.properties))s.properties.set(a,l);e.graph.addExistingNode(s)}else if(o==="input"||o==="output"){let s={};for(let p of n.inputs??[])s[p.name]={nodeType:"value",dataType:p.type};let a={};for(let p of n.outputs??[])a[p.name]={nodeType:"value",dataType:p.type};let l=this.mProject.nodeDefinitions.get(n.nodeDefinitionId),c=new xt(n.id,l,n.position??{x:0,y:0},n.system??!0);if(n.size&&c.resizeTo(n.size.w,n.size.h),n.properties)for(let[p,m]of Object.entries(n.properties))c.properties.set(p,m);e.graph.addExistingNode(c)}}}restoreAllPortData(e,t){for(let n of t){let o=e.graph.getNode(n.id);if(o){if(Array.isArray(n.inputs))for(let i of n.inputs){let s=o.inputs.get(i.name);s&&i.connectedTo&&(s.connectedTo=i.connectedTo)}if(Array.isArray(n.flowInputs))for(let i of n.flowInputs){let s=o.flowInputs.get(i.name);s&&i.connectedTo&&(s.connectedTo=i.connectedTo)}if(Array.isArray(n.flowOutputs))for(let i of n.flowOutputs){let s=o.flowOutputs.get(i.name);s&&i.connectedTo&&(s.connectedTo=i.connectedTo)}}}}reconstructConnections(e,t){for(let n of t){let o=n.kind==="flow"?"flow":"data",i=new Pt(n.id,n.sourceNodeId,n.sourcePortId,n.targetNodeId,n.targetPortId,o);i.valid=n.valid??!0,e.graph.addExistingConnection(i)}}}});var se,et=d(()=>{se=class{mBody;mInputs;mOutputs;mProperties;get body(){return this.mBody}get inputs(){return this.mInputs}get outputs(){return this.mOutputs}get properties(){return this.mProperties}constructor(){this.mInputs=new Map,this.mOutputs=new Map,this.mBody=new Map,this.mProperties=new Map}buildContext(){let e={};for(let[n,o]of this.mInputs)switch(o.nodeType){case"flow":e[n]={code:""};break;case"input":e[n]={value:this.mProperties.get(n)??"",valueId:o.valueId};break;case"value":e[n]={valueId:o.valueId};break}let t={};for(let[n,o]of this.mOutputs)switch(o.nodeType){case"flow":{let i=this.mBody.get(n);t[n]={code:i?.code??""};break}case"input":t[n]={value:this.mProperties.get(n)??"",valueId:o.valueId};break;case"value":t[n]={valueId:o.valueId};break}return{inputs:e,outputs:t}}}});var ro,Ss=d(()=>{et();ro=class extends se{get commentText(){return this.properties.get("comment")??""}set commentText(e){this.properties.set("comment",e)}generateCode(){return""}}});var tt,io=d(()=>{et();tt=class extends se{mCodeGenerator;constructor(e){super(),this.mCodeGenerator=e}generateCode(){return this.mCodeGenerator(this.buildContext())}}});var so,Ls=d(()=>{io();so=class extends tt{}});var ao,Ms=d(()=>{et();ao=class extends se{generateCode(){return""}}});var lo,Rs=d(()=>{et();lo=class extends se{generateCode(){return""}}});var co,Os=d(()=>{et();co=class extends se{generateCode(){return""}}});var uo,Fs=d(()=>{et();uo=class extends se{generateCode(){return""}}});var po,Gs=d(()=>{et();po=class extends se{generateCode(){let e=this.properties.get("variableName")??"undefined",n=this.inputs.values().next().value?.valueId??"undefined";return`${e} = ${n};`}}});var mo,Bs=d(()=>{io();mo=class extends tt{get value(){return this.properties.get("value")??""}set value(e){this.properties.set("value",e)}}});var ho,js=d(()=>{ho=class{bodyCode;inputs;name;outputs;constructor(){this.name="",this.bodyCode="",this.inputs=new Array,this.outputs=new Array}}});var Dn,Vs=d(()=>{it();vt();Ss();Ls();Ms();Rs();Os();Fs();Gs();io();Bs();js();Dn=class r{mConfig;constructor(e){this.mConfig=e}generateFunctionCode(e){let t=e.graph,n=this.generateGraphCode(t),o=[];for(let s of e.localVariables)o.push(`    let ${s.name};`);o.length>0&&(n=o.join(`
`)+`
`+n);let i=new ho;i.name=e.name,i.bodyCode=n;for(let[s,a]of Object.entries(e.inputs)){let l=this.findInputNodeValueId(t,s),c=r.getPortDataType(a);i.inputs.push({name:s,type:c,valueId:l})}for(let[s,a]of Object.entries(e.outputs)){let l=this.findOutputNodeValueId(t,s),c=r.getPortDataType(a);i.outputs.push({name:s,type:c,valueId:l})}return this.mConfig.functionCodeGenerator?this.mConfig.functionCodeGenerator(i):n}generateProjectCode(e){let t=new Array;for(let n of e.values())t.push(this.generateFunctionCode(n));return t.join(`

`)}generateGraphCode(e){let t=this.topologicalSort(e),n=new Array;for(let o of t){if(o.category==="input"||o.category==="output"||o.category==="reroute"||o.category==="getlocal"||!this.mConfig.nodeDefinitions.get(o.definitionId))continue;let s=this.buildCodeNode(e,o);for(let[l,c]of o.flowOutputs)if(c.connectedTo){let p=this.generateFlowBodyCode(e,c.connectedTo);s.body.set(l,{code:p})}else s.body.set(l,{code:""});let a=s.generateCode();n.push(a)}return n.join(`
`)}generateFlowBodyCode(e,t){let n=new Array,o=t;for(;o;){let i=this.findNodeByFlowPortId(e,o);if(!i||!this.mConfig.nodeDefinitions.get(i.definitionId))break;let a=this.buildCodeNode(e,i);for(let[c,p]of i.flowOutputs)if(p.connectedTo){let m=this.generateFlowBodyCode(e,p.connectedTo);a.body.set(c,{code:m})}else a.body.set(c,{code:""});let l=a.generateCode();n.push(l),o=null}return n.join(`
`)}buildCodeNode(e,t){let n=this.mConfig.nodeDefinitions.get(t.definitionId),o=n?.codeGenerator??(()=>""),i=this.createNodeForCategory(t.category,o),s=n?Object.fromEntries(Object.entries(n.inputs)):{},a=n?Object.fromEntries(Object.entries(n.outputs)):{};for(let[l,c]of t.inputs){let p=this.resolveRerouteChain(e,c.connectedTo??c.valueId),m=s[l]?.nodeType??"value";i.inputs.set(l,{name:l,type:c.type,valueId:p,nodeType:m})}for(let[l]of t.flowInputs)i.inputs.set(l,{name:l,type:"",valueId:"",nodeType:"flow"});for(let[l,c]of t.outputs){let p=a[l]?.nodeType??"value";i.outputs.set(l,{name:l,type:c.type,valueId:c.valueId,nodeType:p})}for(let[l]of t.flowOutputs)i.outputs.set(l,{name:l,type:"",valueId:"",nodeType:"flow"});for(let[l,c]of t.properties)i.properties.set(l,c);if(t.category==="getlocal"){let l=t.properties.get("variableName")??"",c=i.outputs.values().next().value;c&&l&&i.outputs.set(c.name,{name:c.name,type:c.type,valueId:l,nodeType:c.nodeType})}return i}createNodeForCategory(e,t){switch(e){case"comment":return new ro;case"input":return new lo;case"output":return new co;case"value":return new mo(t);case"flow":return new so(t);case"reroute":return new uo;case"getlocal":return new ao;case"setlocal":return new po;default:return new tt(t)}}topologicalSort(e){let t=new Set,n=new Array,o=new Map;for(let s of e.nodes.values())o.set(s.id,new Set);for(let s of e.connections.values())if(s.kind==="data"){let a=o.get(s.targetNodeId);a&&a.add(s.sourceNodeId)}let i=s=>{if(t.has(s))return;t.add(s);let a=o.get(s);if(a)for(let c of a)i(c);let l=e.getNode(s);l&&n.push(l)};for(let s of e.nodes.keys())i(s);return n}findInputNodeValueId(e,t){for(let n of e.nodes.values())if(n.category==="input"&&n.definitionId===t){let o=n.outputs.values().next().value;if(o)return o.valueId}return t}findOutputNodeValueId(e,t){for(let n of e.nodes.values())if(n.category==="output"&&n.definitionId===t){let o=n.inputs.values().next().value;return o&&o.connectedTo?this.resolveRerouteChain(e,o.connectedTo):o?.valueId??t}return t}resolveRerouteChain(e,t){for(let n of e.nodes.values())for(let o of n.outputs.values())if(o.valueId===t&&n.category==="reroute"){let i=n.inputs.values().next().value;return i&&i.connectedTo?this.resolveRerouteChain(e,i.connectedTo):i?.valueId??t}return t}findNodeByFlowPortId(e,t){for(let n of e.nodes.values()){for(let o of n.flowInputs.values())if(o.id===t)return n;for(let o of n.flowOutputs.values())if(o.id===t)return n}return null}static getPortDataType(e){return e.nodeType==="value"||e.nodeType==="input"?e.dataType:""}}});var An,Us=d(()=>{Vs();An=class{mConfig;constructor(e){this.mConfig=e}serialize(e){let n=new Dn(this.mConfig).generateProjectCode(e.functions),o=this.buildMetadata(e),s=`${this.mConfig.commentToken} #potatno ${JSON.stringify(o)}`;return`${n}
${s}`}serializeFunction(e){let n=new Dn(this.mConfig).generateFunctionCode(e),o={functions:[this.serializeFunctionData(e)]},s=`${this.mConfig.commentToken} #potatno ${JSON.stringify(o)}`;return`${n}
${s}`}buildMetadata(e){let t=new Array;for(let n of e.functions.values())t.push(this.serializeFunctionData(n));return{functions:t}}serializeFunctionData(e){let t=new Array,n=new Array;for(let o of e.graph.nodes.values())t.push(this.serializeNode(o));for(let o of e.graph.connections.values())n.push(this.serializeConnection(o));return{id:e.id,name:e.name,label:e.label,system:e.system,editableByUser:e.editableByUser,inputs:{...e.inputs},outputs:{...e.outputs},imports:[...e.imports],nodes:t,connections:n}}serializeNode(e){let t=new Array;for(let[a,l]of e.inputs)t.push({name:a,type:l.type,id:l.id,valueId:l.valueId,connectedTo:l.connectedTo});let n=new Array;for(let[a,l]of e.outputs)n.push({name:a,type:l.type,id:l.id,valueId:l.valueId});let o=new Array;for(let[a,l]of e.flowInputs)o.push({name:a,id:l.id,connectedTo:l.connectedTo});let i=new Array;for(let[a,l]of e.flowOutputs)i.push({name:a,id:l.id,connectedTo:l.connectedTo});let s={};for(let[a,l]of e.properties)s[a]=l;return{id:e.id,type:e.definitionId,category:e.category,position:e.position,size:e.size,system:e.system,properties:s,inputs:t,outputs:n,flowInputs:o,flowOutputs:i}}serializeConnection(e){return{id:e.id,kind:e.kind,sourceNodeId:e.sourceNodeId,sourcePortId:e.sourcePortId,targetNodeId:e.targetNodeId,targetPortId:e.targetPortId,valid:e.valid}}}});var G,Tr=d(()=>{R();G=class r{static create(e,t){return new r(e,t)}mProject;mId;mCategory;mInputs;mLabel;mOutputs;mCodeGenerator;mPreview;get id(){return this.mId}get project(){return this.mProject}get category(){return this.mCategory}get inputs(){return this.mInputs}get label(){return this.mLabel}get outputs(){return this.mOutputs}get codeGenerator(){return this.mCodeGenerator}get preview(){return this.mPreview}constructor(e,t){this.mProject=e,this.mId=t.id,this.mLabel=t.label??t.id,this.mCategory=t.category,this.mInputs=t.inputs??{},this.mOutputs=t.outputs??{},this.mCodeGenerator=t.codeGenerator,this.mPreview=t.preview??null;for(let n of Object.values(this.mInputs))if(n.nodeType==="value"&&!e.hasType(n.dataType))throw new f(`Type not registered in project for input port type '${n.dataType.toString()}' in node definition '${this.mId}'.`,this);for(let n of Object.values(this.mOutputs))if(n.nodeType==="value"&&!e.hasType(n.dataType))throw new f(`Type not registered in project for output port type '${n.dataType.toString()}' in node definition '${this.mId}'.`,this)}}});var yo,zs=d(()=>{vt();yo=class r{static evaluate(e,t,n){let o=new Map,i=new Map;for(let p of t.nodes.values()){for(let[m,h]of p.outputs)i.set(h.id,{nodeId:p.id,portName:m});for(let[m,h]of p.inputs)i.set(h.id,{nodeId:p.id,portName:m});for(let[m,h]of p.flowOutputs)i.set(h.id,{nodeId:p.id,portName:m});for(let[m,h]of p.flowInputs)i.set(h.id,{nodeId:p.id,portName:m})}let s=new Map,a=new Map;for(let p of t.nodes.values())a.set(p.id,0);for(let p of t.connections.values()){if(p.kind!=="data")continue;let m=i.get(p.sourcePortId),h=i.get(p.targetPortId);if(!m||!h)continue;let T=s.get(p.targetNodeId);T||(T=[],s.set(p.targetNodeId,T)),T.push({sourceNodeId:m.nodeId,sourcePortName:m.portName,targetPortName:h.portName}),a.set(p.targetNodeId,(a.get(p.targetNodeId)??0)+1)}let l=[];for(let[p,m]of a)m===0&&l.push(p);let c=[];for(;l.length>0;){let p=l.shift();c.push(p);for(let m of t.connections.values()){if(m.kind!=="data"||m.sourceNodeId!==p)continue;let h=(a.get(m.targetNodeId)??0)-1;a.set(m.targetNodeId,h),h===0&&l.push(m.targetNodeId)}}for(let p of c){let m=t.getNode(p);if(!m)continue;let h=e.nodeDefinitions.get(m.definitionId),T={},F=s.get(p);if(F)for(let v of F){let N=o.get(v.sourceNodeId);N&&(T[v.targetPortName]=N.outputs[v.sourcePortName])}for(let[v,N]of m.inputs)if(T[v]===void 0){let L=m.properties.get("value"),U=h?h.outputs[v]??h.inputs[v]:void 0;U?.nodeType==="input"&&L!==void 0?T[v]=r.parsePropertyValue(L,U.inputType):T[v]=r.getTypeDefault(N.type)}for(let[v]of m.flowInputs)T[v]===void 0&&(T[v]=!0);let P=n[m.definitionId],g;if(P&&Object.keys(T).length===0)g={...P};else if(h?.preview)try{g=h.preview.data.updatePreviewData(T)}catch{g=r.buildDefaultOutputs(m)}else g=r.buildDefaultOutputs(m);o.set(p,{inputs:T,outputs:g})}return o}static parsePropertyValue(e,t){switch(t){case"number":return parseFloat(e)||0;case"boolean":return e==="true";case"string":default:return e}}static getTypeDefault(e){switch(e){case"number":return 0;case"boolean":return!1;case"string":default:return""}}static buildDefaultOutputs(e){let t={};for(let[n,o]of e.outputs)t[n]=r.getTypeDefault(o.type);for(let[n]of e.flowOutputs)t[n]=!0;return t}}});var Xt,vr=d(()=>{Xt=class r{static MAX_ZOOM=2;static MIN_ZOOM=.25;mGridSize;mPanX;mPanY;mSelectionEnd;mSelectionStart;mZoom;get gridSize(){return this.mGridSize}get panX(){return this.mPanX}get panY(){return this.mPanY}get selectionEnd(){return this.mSelectionEnd}get selectionStart(){return this.mSelectionStart}get zoom(){return this.mZoom}constructor(e=20){this.mGridSize=e,this.mPanX=0,this.mPanY=0,this.mZoom=1,this.mSelectionStart=null,this.mSelectionEnd=null}clearSelection(){this.mSelectionStart=null,this.mSelectionEnd=null}getGridBackgroundCss(){let e=this.mGridSize*this.mZoom,t=this.mPanX%e,n=this.mPanY%e,o=e*5,i=this.mPanX%o,s=this.mPanY%o;return[`background-size: ${e}px ${e}px, ${o}px ${o}px`,`background-position: ${t}px ${n}px, ${i}px ${s}px`,"background-image: radial-gradient(circle, var(--pn-grid-color) 1px, transparent 1px), radial-gradient(circle, var(--pn-grid-color) 1.5px, transparent 1.5px)"].join("; ")}getTransformCss(){return`translate(${this.mPanX}px, ${this.mPanY}px) scale(${this.mZoom})`}pan(e,t){this.mPanX+=e,this.mPanY+=t}screenToWorld(e,t){return{x:(e-this.mPanX)/this.mZoom,y:(t-this.mPanY)/this.mZoom}}setSelectionEnd(e,t){this.mSelectionEnd={x:e,y:t}}setSelectionStart(e,t){this.mSelectionStart={x:e,y:t}}snapToGrid(e,t){return{x:Math.round(e/this.mGridSize)*this.mGridSize,y:Math.round(t/this.mGridSize)*this.mGridSize}}worldToScreen(e,t){return{x:e*this.mZoom+this.mPanX,y:t*this.mZoom+this.mPanY}}zoomAt(e,t,n){let o=this.mZoom,i=1+n,s=this.mZoom*i;s=Math.max(r.MIN_ZOOM,Math.min(r.MAX_ZOOM,s));let a=(e-this.mPanX)/o,l=(t-this.mPanY)/o;this.mZoom=s,this.mPanX=e-a*this.mZoom,this.mPanY=t-l*this.mZoom}}});var Pr,xr,Wt,Cr=d(()=>{Pr="http://www.w3.org/2000/svg",xr="data-temp-connection",Wt=class{clearAll(e){let t=e.querySelectorAll("path");for(let n of t)n.remove()}clearTempConnection(e){let t=e.querySelector(`[${xr}]`);t&&t.remove()}generateBezierPath(e,t,n,o){let i=Math.abs(n-e),s=Math.max(i*.4,50),a=e+s,l=t,c=n-s;return`M ${e} ${t} C ${a} ${l}, ${c} ${o}, ${n} ${o}`}renderConnections(e,t){let n=e.querySelectorAll(`path:not([${xr}])`);for(let o of n)o.remove();for(let o of t){let i=this.generateBezierPath(o.sourceX,o.sourceY,o.targetX,o.targetY),s=document.createElementNS(Pr,"path");s.setAttribute("d",i),s.setAttribute("fill","none"),s.setAttribute("data-connection-id",o.id),s.setAttribute("data-hit-area","true"),s.style.stroke="transparent",s.style.strokeWidth="12",s.style.pointerEvents="stroke",s.style.cursor="pointer",e.appendChild(s);let a=document.createElementNS(Pr,"path");a.setAttribute("d",i),a.setAttribute("fill","none"),a.setAttribute("data-connection-id",o.id),a.style.stroke=o.valid?"#a6adc8":"#f38ba8",a.style.strokeWidth="2",a.style.pointerEvents="none",o.valid||a.setAttribute("stroke-dasharray","6 3"),e.appendChild(a)}}renderTempConnection(e,t,n,o){this.clearTempConnection(e);let i=document.createElementNS(Pr,"path");i.setAttribute("d",this.generateBezierPath(t.x,t.y,n.x,n.y)),i.setAttribute("fill","none"),i.setAttribute(xr,"true"),i.style.stroke=o,i.style.strokeWidth="2",i.style.opacity="0.6",i.style.strokeDasharray="8 4",i.style.pointerEvents="none",e.appendChild(i)}}});var fo,$s=d(()=>{vt();fo=class{mData;get hasData(){return this.mData!==null}constructor(){this.mData=null}copy(e,t){let n=new Array,o=new Map;for(let a of t){let l=e.getNode(a);l&&!l.system&&(o.set(l.id,n.length),n.push(l))}if(n.length===0)return;let i=n.map(a=>{let l={};for(let[p,m]of a.properties)l[p]=m;let c=new Array;for(let[p,m]of a.inputs)m.connectedTo&&c.push({portName:p,connectedValueId:m.connectedTo});return{definitionName:a.definitionId,position:{...a.position},size:{...a.size},properties:l,inputConnections:c}}),s=[];for(let a of e.connections.values()){let l=o.get(a.sourceNodeId),c=o.get(a.targetNodeId);if(l!==void 0&&c!==void 0){let p=n[l],m=n[c],h="",T="",F;if(a.kind==="data"){F="data";for(let[P,g]of p.outputs)if(g.id===a.sourcePortId){h=P;break}for(let[P,g]of m.inputs)if(g.id===a.targetPortId){T=P;break}}else{F="flow";for(let[P,g]of p.flowOutputs)if(g.id===a.sourcePortId){h=P;break}for(let[P,g]of m.flowInputs)if(g.id===a.targetPortId){T=P;break}}h&&T&&s.push({sourceNodeIndex:l,sourcePortName:h,targetNodeIndex:c,targetPortName:T,kind:F})}}this.mData={nodes:i,internalConnections:s}}getData(){return this.mData}}});var Sn,Hs=d(()=>{Sn=class{description;mActions;constructor(e,t){this.description=e,this.mActions=t}apply(){for(let e of this.mActions)e.apply()}revert(){for(let e=this.mActions.length-1;e>=0;e--)this.mActions[e].revert()}}});var go,Ks=d(()=>{go=class{mMaxSize;mRedoStack;mUndoStack;get canRedo(){return this.mRedoStack.length>0}get canUndo(){return this.mUndoStack.length>0}constructor(e=100){this.mUndoStack=new Array,this.mRedoStack=new Array,this.mMaxSize=e}push(e){e.apply(),this.mUndoStack.push(e),this.mRedoStack.length=0,this.mUndoStack.length>this.mMaxSize&&this.mUndoStack.shift()}undo(){let e=this.mUndoStack.pop();e&&(e.revert(),this.mRedoStack.push(e))}redo(){let e=this.mRedoStack.pop();e&&(e.apply(),this.mUndoStack.push(e))}clear(){this.mUndoStack.length=0,this.mRedoStack.length=0}}});var Ln,bo,Xs=d(()=>{Ln=class{description;mDefinition;mGraph;mNode;mPosition;mSystem;get node(){return this.mNode}constructor(e,t,n,o=!1){this.description=`Add node: ${t.id}`,this.mGraph=e,this.mDefinition=t,this.mPosition=n,this.mSystem=o,this.mNode=null}apply(){this.mNode?this.mGraph.addExistingNode(this.mNode):this.mNode=this.mGraph.addNode(this.mDefinition,this.mPosition,this.mSystem)}revert(){this.mNode&&this.mGraph.removeNode(this.mNode.id)}},bo=class{description;mGraph;mNodeId;mRemovedConnections;mRemovedNode;constructor(e,t){this.description="Remove node",this.mGraph=e,this.mNodeId=t,this.mRemovedNode=null,this.mRemovedConnections=new Array}apply(){this.mRemovedNode=this.mGraph.getNode(this.mNodeId)??null,this.mRemovedConnections=this.mGraph.removeNode(this.mNodeId)}revert(){if(this.mRemovedNode){this.mGraph.addExistingNode(this.mRemovedNode);for(let e of this.mRemovedConnections)this.mGraph.addExistingConnection(e)}}}});var Mn,Ws=d(()=>{Mn=class{description;mNewValue;mNode;mOldValue;mPropertyName;constructor(e,t,n){this.description=`Change property: ${t}`,this.mNode=e,this.mPropertyName=t,this.mNewValue=n,this.mOldValue=e.properties.get(t)??""}apply(){this.mOldValue=this.mNode.properties.get(this.mPropertyName)??"",this.mNode.properties.set(this.mPropertyName,this.mNewValue)}revert(){this.mOldValue===""?this.mNode.properties.delete(this.mPropertyName):this.mNode.properties.set(this.mPropertyName,this.mOldValue)}}});var Ys,Zs=d(()=>{Ys=`:host {\r
    display: flex;\r
    width: 100%;\r
    height: 100%;\r
    font-family: var(--pn-font-family);\r
    color: var(--pn-text-primary);\r
    background: var(--pn-bg-primary);\r
    overflow: hidden;\r
}\r
\r
.editor-layout {\r
    display: flex;\r
    width: 100%;\r
    height: 100%;\r
    position: relative;\r
}\r
\r
.panel-left {\r
    width: var(--pn-panel-width);\r
    min-width: var(--pn-panel-min-width);\r
    max-width: var(--pn-panel-max-width);\r
    background: var(--pn-bg-secondary);\r
    border-right: 1px solid var(--pn-border-default);\r
    display: flex;\r
    flex-direction: column;\r
    overflow: hidden;\r
    flex-shrink: 0;\r
}\r
\r
.resize-handle-left {\r
    width: 4px;\r
    cursor: col-resize;\r
    background: transparent;\r
    flex-shrink: 0;\r
    transition: background 0.15s;\r
    z-index: 10;\r
}\r
\r
.resize-handle-left:hover {\r
    background: var(--pn-accent-primary);\r
}\r
\r
.center-area {\r
    flex: 1;\r
    display: flex;\r
    flex-direction: column;\r
    position: relative;\r
    overflow: hidden;\r
    min-width: 200px;\r
}\r
\r
.preview-wrapper {\r
    position: absolute;\r
    bottom: 12px;\r
    right: 12px;\r
    z-index: 100;\r
}\r
\r
.resize-handle-right {\r
    width: 4px;\r
    cursor: col-resize;\r
    background: transparent;\r
    flex-shrink: 0;\r
    transition: background 0.15s;\r
    z-index: 10;\r
}\r
\r
.resize-handle-right:hover {\r
    background: var(--pn-accent-primary);\r
}\r
\r
.panel-right {\r
    width: var(--pn-panel-width);\r
    min-width: var(--pn-panel-min-width);\r
    max-width: var(--pn-panel-max-width);\r
    background: var(--pn-bg-secondary);\r
    border-left: 1px solid var(--pn-border-default);\r
    display: flex;\r
    flex-direction: column;\r
    overflow: hidden;\r
    flex-shrink: 0;\r
}\r
\r
.grid-layer {\r
    position: absolute;\r
    top: 0;\r
    left: 0;\r
    width: 100%;\r
    height: 100%;\r
    transform-origin: 0 0;\r
}\r
\r
.svg-layer {\r
    position: absolute;\r
    top: 0;\r
    left: 0;\r
    width: 100%;\r
    height: 100%;\r
    pointer-events: none;\r
    overflow: visible;\r
}\r
\r
.svg-layer path[data-hit-area] {\r
    pointer-events: stroke;\r
}\r
\r
.node-layer {\r
    position: absolute;\r
    top: 0;\r
    left: 0;\r
}\r
\r
.node-position {\r
    position: absolute;\r
}\r
\r
.canvas-wrapper {\r
    background: var(--pn-bg-primary);\r
    position: relative;\r
    overflow: hidden;\r
    flex: 1;\r
    cursor: default;\r
}\r
\r
.selection-box {\r
    position: absolute;\r
    border: 1px solid var(--pn-accent-primary);\r
    background: var(--pn-selection-color);\r
    pointer-events: none;\r
    z-index: 1000;\r
}\r
`});var qs,_s=d(()=>{qs=`<div class="editor-layout">\r
    <div #panelLeft class="panel-left">\r
        <potatno-panel-left\r
            [nodeDefinitions]="this.nodeDefinitionList"\r
            [functions]="this.functionList"\r
            [activeFunctionId]="this.activeFunctionId"\r
            (node-drag-start)="this.onNodeDragFromLibrary($event)"\r
            (function-select)="this.onFunctionSelect($event)"\r
            (function-add)="this.onFunctionAdd()"\r
            (function-delete)="this.onFunctionDelete($event)">\r
        </potatno-panel-left>\r
    </div>\r
    <div #resizeLeft class="resize-handle-left"\r
        (pointerdown)="this.onResizeLeftStart($event)">\r
    </div>\r
    <div class="center-area">\r
        <div #canvasWrapper class="canvas-wrapper"\r
            [style]="this.gridBackgroundStyle"\r
            (pointerdown)="this.onCanvasPointerDown($event)"\r
            (pointermove)="this.onCanvasPointerMove($event)"\r
            (pointerup)="this.onCanvasPointerUp($event)"\r
            (wheel)="this.onCanvasWheel($event)"\r
            (contextmenu)="this.onContextMenu($event)">\r
            <div #gridLayer class="grid-layer" [style]="this.gridTransformStyle">\r
                <svg #svgLayer class="svg-layer" xmlns="http://www.w3.org/2000/svg"></svg>\r
                <div class="node-layer">\r
                    $for(nodeRender of this.visibleNodes) {\r
                        <div class="node-position" style="left:{{this.nodeRender.pixelX}}px;top:{{this.nodeRender.pixelY}}px;width:{{this.nodeRender.size.w * this.interaction.gridSize}}px">\r
                            <potatno-node\r
                                [nodeData]="this.nodeRender"\r
                                [selected]="this.nodeRender.selected"\r
                                [gridSize]="this.interaction.gridSize"\r
                                (pointerdown)="this.onNodePointerDown($event, this.nodeRender)"\r
                                (port-drag-start)="this.onPortDragStart($event)"\r
                                (port-hover)="this.onPortHover($event)"\r
                                (port-leave)="this.onPortLeave($event)"\r
                                (resize-start)="this.onNodeResizeStart($event, this.nodeRender)"\r
                                (comment-change)="this.onCommentChange($event)"\r
                                (value-change)="this.onValueChange($event)">\r
                            </potatno-node>\r
                        </div>\r
                    }\r
                </div>\r
            </div>\r
            $if(this.showSelectionBox) {\r
                <div class="selection-box" [style]="this.selectionBoxStyle"></div>\r
            }\r
        </div>\r
        $if(this.hasPreview) {\r
            <div class="preview-wrapper">\r
                <potatno-preview #previewEl [errors]="this.editorErrors"></potatno-preview>\r
            </div>\r
        }\r
    </div>\r
    <div #resizeRight class="resize-handle-right"\r
        (pointerdown)="this.onResizeRightStart($event)">\r
    </div>\r
    <div #panelRight class="panel-right">\r
        <potatno-panel-properties\r
            [functionName]="this.activeFunctionName"\r
            [functionInputs]="this.activeFunctionInputs"\r
            [functionOutputs]="this.activeFunctionOutputs"\r
            [functionImports]="this.activeFunctionImports"\r
            [isSystem]="this.activeFunctionIsSystem"\r
            [editableByUser]="this.activeFunctionEditableByUser"\r
            [availableImports]="this.availableImportsList"\r
            [availableTypes]="this.availableTypes"\r
            (properties-change)="this.onPropertiesChange($event)">\r
        </potatno-panel-properties>\r
    </div>\r
</div>`});var Qs,Js=d(()=>{Qs=`:host {\r
    display: block;\r
    width: 100%;\r
    height: 100%;\r
    overflow: hidden;\r
    position: relative;\r
}\r
\r
.viewport {\r
    width: 100%;\r
    height: 100%;\r
    overflow: hidden;\r
    position: relative;\r
    cursor: default;\r
    background: var(--pn-bg-primary);\r
}\r
\r
.viewport.panning {\r
    cursor: grabbing;\r
}\r
\r
.grid {\r
    position: absolute;\r
    top: 0;\r
    left: 0;\r
    width: 100%;\r
    height: 100%;\r
    transform-origin: 0 0;\r
}\r
\r
.svg-layer {\r
    position: absolute;\r
    top: 0;\r
    left: 0;\r
    width: 100%;\r
    height: 100%;\r
    pointer-events: none;\r
    overflow: visible;\r
}\r
\r
.node-layer {\r
    position: absolute;\r
    top: 0;\r
    left: 0;\r
}\r
\r
.selection-box {\r
    position: absolute;\r
    border: 1px solid var(--pn-accent-primary);\r
    background: var(--pn-selection-color);\r
    pointer-events: none;\r
    z-index: 1000;\r
}\r
`});var ta,ea=d(()=>{ta=`<div #viewport class="viewport" (pointerdown)="this.onPointerDown($event)" (pointermove)="this.onPointerMove($event)" (pointerup)="this.onPointerUp($event)" (wheel)="this.onWheel($event)" (contextmenu)="this.onContextMenu($event)" (keydown)="this.onKeyDown($event)" tabindex="0">\r
    <div #grid class="grid" [style]="this.gridStyle">\r
        <svg #svgLayer class="svg-layer" xmlns="http://www.w3.org/2000/svg"></svg>\r
        <div class="node-layer">\r
            $slot\r
        </div>\r
    </div>\r
    $if(this.showSelectionBox) {\r
        <div class="selection-box" [style]="this.selectionBoxStyle"></div>\r
    }\r
</div>\r
`});var na,oa,ra,ia,sa,aa,la,ca,ua,da,pa,ma,ha,j,Ir,wr,Er,Nr,kr,Dr,Ar,ae,ya=d(()=>{me();vr();Cr();Js();ea();ha=[z({selector:"potatno-canvas",template:ta,style:Qs})];ae=class extends(ma=E,pa=[w],da=[w],ua=[w],ca=[w],la=[O("canvas-connect")],aa=[O("canvas-delete")],sa=[O("canvas-node-move")],ia=[O("canvas-node-select")],ra=[O("canvas-select")],oa=[oe("svgLayer")],na=[oe("viewport")],ma){constructor(){super();b(this,"connections",u(j,36,this,[])),u(j,39,this);b(this,"gridSize",u(j,40,this,20)),u(j,43,this);b(this,"nodes",u(j,44,this,[])),u(j,47,this);b(this,"selectedNodeIds",u(j,48,this,new Set)),u(j,51,this);k(this,Ir,u(j,8,this)),u(j,11,this);k(this,wr,u(j,12,this)),u(j,15,this);k(this,Er,u(j,16,this)),u(j,19,this);k(this,Nr,u(j,20,this)),u(j,23,this);k(this,kr,u(j,24,this)),u(j,27,this);k(this,Dr,u(j,28,this)),u(j,31,this);k(this,Ar,u(j,32,this)),u(j,35,this);b(this,"mDragNodeId",null);b(this,"mDragStartWorldX",0);b(this,"mDragStartWorldY",0);b(this,"mInteraction");b(this,"mMode","idle");b(this,"mPointerId",null);b(this,"mRenderer");b(this,"mWireColor","var(--pn-accent-primary)");b(this,"mWirePortKind","");b(this,"mWireSourceNodeId","");b(this,"mWireSourcePortId","");b(this,"mWireStartWorld",{x:0,y:0});this.mInteraction=new Xt(this.gridSize),this.mRenderer=new Wt}get gridStyle(){let t=`transform: ${this.mInteraction.getTransformCss()}`,n=this.mInteraction.getGridBackgroundCss();return`${t}; ${n}`}get selectionBoxStyle(){let t=this.mInteraction.selectionStart,n=this.mInteraction.selectionEnd;if(!t||!n)return"display: none";let o=this.mInteraction.worldToScreen(t.x,t.y),i=this.mInteraction.worldToScreen(n.x,n.y),s=Math.min(o.x,i.x),a=Math.min(o.y,i.y),l=Math.abs(i.x-o.x),c=Math.abs(i.y-o.y);return`left: ${s}px; top: ${a}px; width: ${l}px; height: ${c}px`}get showSelectionBox(){return this.mMode==="selectingBox"&&this.mInteraction.selectionStart!==null&&this.mInteraction.selectionEnd!==null}onContextMenu(t){t.preventDefault()}onKeyDown(t){(t.key==="Delete"||t.key==="Backspace")&&this.selectedNodeIds.size>0&&this.mDeleteEvent.dispatchEvent({nodeIds:new Set(this.selectedNodeIds)})}onPointerDown(t){if(this.mMode!=="idle")return;let n=t.target,o=this.mViewport.getBoundingClientRect(),i=t.clientX-o.left,s=t.clientY-o.top;if(t.button===1){this.mMode="panning",this.mPointerId=t.pointerId,this.mViewport.setPointerCapture(t.pointerId),this.mViewport.classList.add("panning"),t.preventDefault();return}if(t.button===0){let a=n.closest("[data-port-id]");if(a){this.beginWireDrag(a,i,s),this.mPointerId=t.pointerId,this.mViewport.setPointerCapture(t.pointerId),t.preventDefault();return}let l=n.closest("[data-node-id]");if(l){this.beginNodeDrag(l,i,s,t.shiftKey||t.ctrlKey||t.metaKey),this.mPointerId=t.pointerId,this.mViewport.setPointerCapture(t.pointerId),t.preventDefault();return}this.beginSelectionBox(i,s),this.mPointerId=t.pointerId,this.mViewport.setPointerCapture(t.pointerId),t.preventDefault()}}onPointerMove(t){if(this.mPointerId!==t.pointerId)return;let n=this.mViewport.getBoundingClientRect(),o=t.clientX-n.left,i=t.clientY-n.top;switch(this.mMode){case"panning":this.mInteraction.pan(t.movementX,t.movementY),this.updateConnections();break;case"draggingNode":this.updateNodeDrag(o,i);break;case"draggingWire":this.updateWireDrag(o,i);break;case"selectingBox":this.updateSelectionBox(o,i);break}}onPointerUp(t){if(this.mPointerId!==t.pointerId)return;let n=t.target;switch(this.mMode){case"panning":this.mViewport.classList.remove("panning");break;case"draggingNode":this.endNodeDrag();break;case"draggingWire":this.endWireDrag(n);break;case"selectingBox":this.endSelectionBox();break}this.mPointerId!==null&&this.mViewport.releasePointerCapture(this.mPointerId),this.mPointerId=null,this.mMode="idle"}onWheel(t){t.preventDefault();let n=this.mViewport.getBoundingClientRect(),o=t.clientX-n.left,i=t.clientY-n.top;this.mInteraction.zoomAt(o,i,t.deltaY),this.updateConnections()}updateConnections(){this.mRenderer.renderConnections(this.mSvgLayer,this.connections)}beginNodeDrag(t,n,o,i){let s=t.dataset.nodeId;if(!s)return;this.mMode="draggingNode",this.mDragNodeId=s;let a=this.mInteraction.screenToWorld(n,o);this.mDragStartWorldX=a.x,this.mDragStartWorldY=a.y,this.mNodeSelectEvent.dispatchEvent({nodeId:s,additive:i})}beginSelectionBox(t,n){this.mMode="selectingBox";let o=this.mInteraction.screenToWorld(t,n);this.mInteraction.setSelectionStart(o.x,o.y),this.mInteraction.setSelectionEnd(o.x,o.y)}beginWireDrag(t,n,o){this.mMode="draggingWire",this.mWireSourceNodeId=t.dataset.nodeId??"",this.mWireSourcePortId=t.dataset.portId??"",this.mWirePortKind=t.dataset.portKind??"",this.mWireColor=t.dataset.portColor??"var(--pn-accent-primary)";let i=this.mInteraction.screenToWorld(n,o);this.mWireStartWorld={x:i.x,y:i.y}}endNodeDrag(){if(!this.mDragNodeId)return;let t=this.nodes.find(n=>n.id===this.mDragNodeId);if(t){let n=this.mInteraction.snapToGrid(t.x,t.y);this.mNodeMoveEvent.dispatchEvent({nodeId:this.mDragNodeId,newX:n.x,newY:n.y})}this.mDragNodeId=null}endSelectionBox(){let t=this.mInteraction.selectionStart,n=this.mInteraction.selectionEnd;if(t&&n){let o=Math.min(t.x,n.x),i=Math.min(t.y,n.y),s=Math.max(t.x,n.x),a=Math.max(t.y,n.y),l=new Set;for(let c of this.nodes){let p=c.x+c.width,m=c.y+c.height;c.x<s&&p>o&&c.y<a&&m>i&&l.add(c.id)}this.mSelectEvent.dispatchEvent({nodeIds:l})}this.mInteraction.clearSelection()}endWireDrag(t){this.mRenderer.clearTempConnection(this.mSvgLayer);let n=t.closest("[data-port-id]");if(n){let o=n.dataset.nodeId??"",i=n.dataset.portId??"";o&&i&&(o!==this.mWireSourceNodeId||i!==this.mWireSourcePortId)&&this.mConnectEvent.dispatchEvent({sourceNodeId:this.mWireSourceNodeId,sourcePortId:this.mWireSourcePortId,targetNodeId:o,targetPortId:i,portKind:this.mWirePortKind})}this.mWireSourceNodeId="",this.mWireSourcePortId="",this.mWirePortKind=""}updateNodeDrag(t,n){if(!this.mDragNodeId)return;let o=this.mInteraction.screenToWorld(t,n),i=o.x-this.mDragStartWorldX,s=o.y-this.mDragStartWorldY;this.mDragStartWorldX=o.x,this.mDragStartWorldY=o.y;let a=this.nodes.find(l=>l.id===this.mDragNodeId);a&&this.mNodeMoveEvent.dispatchEvent({nodeId:this.mDragNodeId,newX:a.x+i,newY:a.y+s}),this.updateConnections()}updateSelectionBox(t,n){let o=this.mInteraction.screenToWorld(t,n);this.mInteraction.setSelectionEnd(o.x,o.y)}updateWireDrag(t,n){let o=this.mInteraction.screenToWorld(t,n);this.mRenderer.renderTempConnection(this.mSvgLayer,this.mWireStartWorld,o,this.mWireColor)}};j=D(ma),Ir=new WeakMap,wr=new WeakMap,Er=new WeakMap,Nr=new WeakMap,kr=new WeakMap,Dr=new WeakMap,Ar=new WeakMap,y(j,4,"mConnectEvent",la,ae,Ir),y(j,4,"mDeleteEvent",aa,ae,wr),y(j,4,"mNodeMoveEvent",sa,ae,Er),y(j,4,"mNodeSelectEvent",ia,ae,Nr),y(j,4,"mSelectEvent",ra,ae,kr),y(j,4,"mSvgLayer",oa,ae,Dr),y(j,4,"mViewport",na,ae,Ar),y(j,5,"connections",pa,ae),y(j,5,"gridSize",da,ae),y(j,5,"nodes",ua,ae),y(j,5,"selectedNodeIds",ca,ae),ae=y(j,0,"PotatnoCanvas",ha,ae),u(j,1,ae)});var ga,fa=d(()=>{ga=`:host {\r
    display: flex;\r
    flex-direction: column;\r
    height: 100%;\r
    overflow: hidden;\r
}\r
\r
.function-list-content {\r
    flex: 1;\r
    overflow-y: auto;\r
    overflow-x: hidden;\r
    padding: 4px 0;\r
}\r
\r
.function-list-content::-webkit-scrollbar {\r
    width: 6px;\r
}\r
\r
.function-list-content::-webkit-scrollbar-track {\r
    background: var(--pn-scrollbar-track);\r
}\r
\r
.function-list-content::-webkit-scrollbar-thumb {\r
    background: var(--pn-scrollbar-thumb);\r
    border-radius: 3px;\r
}\r
\r
.function-entry {\r
    display: flex;\r
    align-items: center;\r
    gap: 6px;\r
    padding: 6px 12px;\r
    cursor: pointer;\r
    user-select: none;\r
    font-family: var(--pn-font-family);\r
    font-size: var(--pn-font-size);\r
    color: var(--pn-text-primary);\r
    background: transparent;\r
    border: none;\r
    width: 100%;\r
    text-align: left;\r
    transition: background 0.1s;\r
}\r
\r
.function-entry:hover {\r
    background: var(--pn-bg-elevated);\r
}\r
\r
.function-entry.active {\r
    background: var(--pn-bg-surface);\r
    border-left: 2px solid var(--pn-accent-primary);\r
    padding-left: 10px;\r
}\r
\r
.function-icon {\r
    font-size: var(--pn-font-size);\r
    color: var(--pn-cat-function);\r
    flex-shrink: 0;\r
    width: 16px;\r
    text-align: center;\r
}\r
\r
.lock-icon {\r
    font-size: var(--pn-font-size-sm);\r
    color: var(--pn-text-muted);\r
    flex-shrink: 0;\r
    width: 14px;\r
    text-align: center;\r
}\r
\r
.function-name {\r
    flex: 1;\r
    overflow: hidden;\r
    text-overflow: ellipsis;\r
    white-space: nowrap;\r
}\r
\r
.delete-button {\r
    display: flex;\r
    align-items: center;\r
    justify-content: center;\r
    width: 18px;\r
    height: 18px;\r
    background: transparent;\r
    border: none;\r
    border-radius: 3px;\r
    color: var(--pn-text-muted);\r
    font-size: var(--pn-font-size-sm);\r
    cursor: pointer;\r
    flex-shrink: 0;\r
    transition: background 0.1s, color 0.1s;\r
    padding: 0;\r
    line-height: 1;\r
}\r
\r
.delete-button:hover {\r
    background: var(--pn-accent-danger);\r
    color: var(--pn-text-primary);\r
}\r
\r
.add-button-wrapper {\r
    flex-shrink: 0;\r
    padding: 8px;\r
    border-top: 1px solid var(--pn-border-default);\r
}\r
\r
.add-button {\r
    display: flex;\r
    align-items: center;\r
    justify-content: center;\r
    gap: 6px;\r
    width: 100%;\r
    padding: 6px 12px;\r
    background: var(--pn-bg-surface);\r
    border: 1px dashed var(--pn-border-default);\r
    border-radius: 4px;\r
    color: var(--pn-text-secondary);\r
    font-family: var(--pn-font-family);\r
    font-size: var(--pn-font-size);\r
    cursor: pointer;\r
    transition: background 0.15s, border-color 0.15s, color 0.15s;\r
}\r
\r
.add-button:hover {\r
    background: var(--pn-bg-elevated);\r
    border-color: var(--pn-accent-primary);\r
    color: var(--pn-text-primary);\r
}\r
\r
.add-icon {\r
    font-size: var(--pn-font-size-lg);\r
    font-weight: bold;\r
}\r
`});var Ta,ba=d(()=>{Ta=`<div class="function-list-content">\r
    $for(fn of this.functions) {\r
        <div [className]="this.getEntryClass(this.fn.id)" (click)="this.onFunctionSelect(this.fn.id)">\r
            <span class="function-icon">\u0192</span>\r
            $if(this.fn.system) {\r
                <span class="lock-icon">\u{1F512}</span>\r
            }\r
            <span class="function-name">{{this.fn.label}}</span>\r
            $if(!this.fn.system) {\r
                <button class="delete-button" (click)="this.onFunctionDelete($event, this.fn.id)">\u2715</button>\r
            }\r
        </div>\r
    }\r
</div>\r
<div class="add-button-wrapper">\r
    <button class="add-button" (click)="this.onFunctionAdd()">\r
        <span class="add-icon">+</span>\r
        <span>Add Function</span>\r
    </button>\r
</div>`});var va,Pa,xa,Ca,Ia,wa,Ea,ee,Sr,Lr,Mr,Oe,Rr=d(()=>{me();fa();ba();Ea=[z({selector:"potatno-function-list",template:Ta,style:ga})];Oe=class extends(wa=E,Ia=[w],Ca=[w],xa=[O("function-select")],Pa=[O("function-add")],va=[O("function-delete")],wa){constructor(){super(...arguments);b(this,"functions",u(ee,20,this,[])),u(ee,23,this);b(this,"activeFunctionId",u(ee,24,this,"")),u(ee,27,this);k(this,Sr,u(ee,8,this)),u(ee,11,this);k(this,Lr,u(ee,12,this)),u(ee,15,this);k(this,Mr,u(ee,16,this)),u(ee,19,this)}getEntryClass(t){return t===this.activeFunctionId?"function-entry active":"function-entry"}onFunctionSelect(t){this.mFunctionSelect.dispatchEvent(t)}onFunctionAdd(){this.mFunctionAdd.dispatchEvent(void 0)}onFunctionDelete(t,n){t.stopPropagation(),this.mFunctionDelete.dispatchEvent(n)}};ee=D(wa),Sr=new WeakMap,Lr=new WeakMap,Mr=new WeakMap,y(ee,4,"mFunctionSelect",xa,Oe,Sr),y(ee,4,"mFunctionAdd",Pa,Oe,Lr),y(ee,4,"mFunctionDelete",va,Oe,Mr),y(ee,5,"functions",Ia,Oe),y(ee,5,"activeFunctionId",Ca,Oe),Oe=y(ee,0,"PotatnoFunctionList",Ea,Oe),u(ee,1,Oe)});var ka,Na=d(()=>{ka=`:host {\r
    display: block;\r
    width: 100%;\r
    font-family: var(--pn-font-family);\r
    font-size: var(--pn-font-size);\r
}\r
\r
/* \u2500\u2500 Standard node container \u2500\u2500 */\r
\r
.node {\r
    min-width: var(--pn-node-min-width);\r
    background: var(--pn-node-bg);\r
    border: 1px solid var(--pn-node-border);\r
    border-radius: var(--pn-node-border-radius);\r
    box-shadow: 0 2px 8px var(--pn-node-shadow);\r
    overflow: visible;\r
    user-select: none;\r
}\r
\r
.node.selected {\r
    border-color: var(--pn-node-border-selected);\r
    box-shadow: 0 0 0 1px var(--pn-node-border-selected), 0 2px 8px var(--pn-node-shadow);\r
}\r
\r
/* \u2500\u2500 Header bar \u2500\u2500 */\r
\r
.node-header {\r
    display: flex;\r
    align-items: center;\r
    height: var(--pn-node-header-height);\r
    padding: 0 8px;\r
    gap: 6px;\r
    border-radius: var(--pn-node-border-radius) var(--pn-node-border-radius) 0 0;\r
    color: #fff;\r
    font-weight: 600;\r
    font-size: var(--pn-font-size-sm);\r
    cursor: grab;\r
    --port-label-color: rgba(255, 255, 255, 0.9);\r
}\r
\r
.node-header:active {\r
    cursor: grabbing;\r
}\r
\r
.node-icon {\r
    font-size: var(--pn-font-size);\r
    flex-shrink: 0;\r
}\r
\r
.node-label {\r
    flex: 1;\r
    white-space: nowrap;\r
    overflow: hidden;\r
    text-overflow: ellipsis;\r
}\r
\r
/* \u2500\u2500 Flow ports in header \u2500\u2500 */\r
\r
.header-flow-inputs,\r
.header-flow-outputs {\r
    display: flex;\r
    align-items: center;\r
    gap: 2px;\r
    flex-shrink: 0;\r
}\r
\r
.header-flow-inputs {\r
    margin-left: -8px;\r
}\r
\r
.header-flow-outputs {\r
    margin-right: -8px;\r
}\r
\r
/* \u2500\u2500 Body with data ports \u2500\u2500 */\r
\r
.node-body {\r
    display: flex;\r
    justify-content: space-between;\r
    padding: 4px 0;\r
    min-height: 4px;\r
}\r
\r
.node-inputs,\r
.node-outputs {\r
    display: flex;\r
    flex-direction: column;\r
}\r
\r
.node-inputs {\r
    align-items: flex-start;\r
    margin-left: -8px;\r
}\r
\r
.node-outputs {\r
    align-items: flex-end;\r
    margin-left: auto;\r
    margin-right: -8px;\r
}\r
\r
/* \u2500\u2500 Value node text input \u2500\u2500 */\r
\r
.node-value-row {\r
    display: flex;\r
    align-items: center;\r
    padding: 4px 0;\r
}\r
\r
.node-value-row .node-value-input {\r
    flex: 1;\r
}\r
\r
.node-value-row .node-outputs {\r
    flex-shrink: 0;\r
    margin-right: -8px;\r
}\r
\r
.node-value-input {\r
    width: 100%;\r
    padding: 4px 8px;\r
    box-sizing: border-box;\r
}\r
\r
.node-value-input input {\r
    width: 100%;\r
    background: var(--pn-bg-secondary);\r
    border: 1px solid var(--pn-border-default);\r
    border-radius: 3px;\r
    color: var(--pn-text-primary);\r
    font-family: var(--pn-font-mono);\r
    font-size: var(--pn-font-size-sm);\r
    padding: 2px 6px;\r
    outline: none;\r
    box-sizing: border-box;\r
}\r
\r
.node-value-input input:focus {\r
    border-color: var(--pn-border-active);\r
}\r
\r
/* \u2500\u2500 Open-function button \u2500\u2500 */\r
\r
.open-function-btn {\r
    background: none;\r
    border: 1px solid currentColor;\r
    border-radius: 3px;\r
    color: inherit;\r
    font-size: 9px;\r
    padding: 1px 4px;\r
    cursor: pointer;\r
    opacity: 0.7;\r
    flex-shrink: 0;\r
}\r
\r
.open-function-btn:hover {\r
    opacity: 1;\r
}\r
\r
/* \u2500\u2500 Comment node \u2500\u2500 */\r
\r
.node-comment {\r
    background: rgba(108, 112, 134, 0.1);\r
    border: 1px dashed var(--pn-cat-comment);\r
    border-radius: var(--pn-node-border-radius);\r
    min-width: 120px;\r
    min-height: 60px;\r
    position: relative;\r
    user-select: none;\r
}\r
\r
.node-comment.selected {\r
    border-color: var(--pn-node-border-selected);\r
}\r
\r
.comment-header {\r
    display: flex;\r
    align-items: center;\r
    gap: 4px;\r
    padding: 6px 8px 2px 8px;\r
    color: var(--pn-text-muted);\r
    font-size: var(--pn-font-size-sm);\r
    cursor: grab;\r
}\r
\r
.comment-header:active {\r
    cursor: grabbing;\r
}\r
\r
.comment-body {\r
    padding: 2px 8px 8px 8px;\r
}\r
\r
.comment-body textarea {\r
    width: 100%;\r
    min-height: 32px;\r
    background: transparent;\r
    border: none;\r
    color: var(--pn-text-secondary);\r
    font-family: var(--pn-font-family);\r
    font-size: var(--pn-font-size-sm);\r
    resize: none;\r
    outline: none;\r
    box-sizing: border-box;\r
}\r
\r
.resize-handle {\r
    position: absolute;\r
    right: 0;\r
    bottom: 0;\r
    width: 14px;\r
    height: 14px;\r
    cursor: se-resize;\r
}\r
\r
.resize-handle::after {\r
    content: '';\r
    position: absolute;\r
    right: 3px;\r
    bottom: 3px;\r
    width: 8px;\r
    height: 8px;\r
    border-right: 2px solid var(--pn-text-muted);\r
    border-bottom: 2px solid var(--pn-text-muted);\r
    opacity: 0.5;\r
}\r
\r
.resize-handle:hover::after {\r
    opacity: 1;\r
}\r
\r
/* \u2500\u2500 Node inline preview \u2500\u2500 */\r
\r
.node-preview {\r
    overflow: hidden;\r
}\r
\r
.node-preview:empty {\r
    display: none;\r
}\r
\r
.node-preview:not(:empty) {\r
    padding: 4px;\r
    border-top: 1px solid var(--pn-node-border);\r
}\r
\r
/* \u2500\u2500 Reroute node \u2500\u2500 */\r
\r
.node-reroute {\r
    display: flex;\r
    align-items: center;\r
    gap: 0;\r
    user-select: none;\r
}\r
\r
.node-reroute.selected .reroute-dot {\r
    box-shadow: 0 0 0 2px var(--pn-node-border-selected);\r
}\r
\r
.reroute-dot {\r
    width: 12px;\r
    height: 12px;\r
    background: var(--pn-text-muted);\r
    border-radius: 2px;\r
    transform: rotate(45deg);\r
    cursor: grab;\r
    flex-shrink: 0;\r
}\r
\r
.reroute-dot:active {\r
    cursor: grabbing;\r
}\r
\r
.reroute-inputs {\r
    margin-right: -4px;\r
}\r
\r
.reroute-outputs {\r
    margin-left: -4px;\r
}\r
`});var Aa,Da=d(()=>{Aa=`$if(this.nodeData) {\r
    $if(this.isReroute) {\r
        <div class="node-reroute {{this.selectedClass}}"\r
             (pointerdown)="this.onNodePointerDown($event)">\r
            <div class="reroute-inputs">\r
                $for(inPort of this.inputPorts) {\r
                    <potatno-port\r
                        [name]="this.inPort.name"\r
                        [type]="this.inPort.type"\r
                        [portId]="this.inPort.id"\r
                        [nodeId]="this.nodeId"\r
                        [direction]="'input'"\r
                        [portKind]="'data'"\r
                        [connected]="this.inPort.connectedTo !== null"\r
                        (port-drag-start)="this.onPortDragStart($event)"\r
                        (port-hover)="this.onPortHover($event)"\r
                        (port-leave)="this.onPortLeave($event)">\r
                    </potatno-port>\r
                }\r
            </div>\r
            <div class="reroute-dot"></div>\r
            <div class="reroute-outputs">\r
                $for(outPort of this.outputPorts) {\r
                    <potatno-port\r
                        [name]="this.outPort.name"\r
                        [type]="this.outPort.type"\r
                        [portId]="this.outPort.id"\r
                        [nodeId]="this.nodeId"\r
                        [direction]="'output'"\r
                        [portKind]="'data'"\r
                        [connected]="this.outPort.connectedTo !== null"\r
                        (port-drag-start)="this.onPortDragStart($event)"\r
                        (port-hover)="this.onPortHover($event)"\r
                        (port-leave)="this.onPortLeave($event)">\r
                    </potatno-port>\r
                }\r
            </div>\r
        </div>\r
    }\r
    $if(!this.isReroute) {\r
    $if(this.isComment) {\r
        <div class="node-comment {{this.selectedClass}}"\r
             [style]="this.commentSizeStyle"\r
             (pointerdown)="this.onNodePointerDown($event)">\r
            <div class="comment-header">\r
                <span class="node-icon">{{this.nodeData.categoryIcon}}</span>\r
                <span class="node-label">{{this.nodeData.definitionName}}</span>\r
            </div>\r
            <div class="comment-body">\r
                <textarea [value]="this.nodeData.commentText"\r
                          (input)="this.onCommentInput($event)">\r
                </textarea>\r
            </div>\r
            <div class="resize-handle"\r
                 (pointerdown)="this.onResizeStart($event)">\r
            </div>\r
        </div>\r
    }\r
    $if(!this.isComment) {\r
        <div class="node {{this.selectedClass}}"\r
             (pointerdown)="this.onNodePointerDown($event)">\r
            <div class="node-header" style="background: {{this.nodeData.categoryColor}}">\r
                <div class="header-flow-inputs">\r
                    $for(flowIn of this.flowInputPorts) {\r
                        <potatno-port\r
                            [name]="this.flowIn.name"\r
                            [portId]="this.flowIn.id"\r
                            [nodeId]="this.nodeId"\r
                            [direction]="'input'"\r
                            [portKind]="'flow'"\r
                            [connected]="this.flowIn.connectedTo !== null"\r
                            (port-drag-start)="this.onPortDragStart($event)"\r
                            (port-hover)="this.onPortHover($event)"\r
                            (port-leave)="this.onPortLeave($event)">\r
                        </potatno-port>\r
                    }\r
                </div>\r
                <span class="node-icon">{{this.nodeData.categoryIcon}}</span>\r
                <span class="node-label">{{this.nodeData.definitionName}}</span>\r
                $if(this.showOpenButton) {\r
                    <button class="open-function-btn"\r
                            (click)="this.onOpenFunction($event)">\r
                        open\r
                    </button>\r
                }\r
                <div class="header-flow-outputs">\r
                    $for(flowOut of this.flowOutputPorts) {\r
                        <potatno-port\r
                            [name]="this.flowOut.name"\r
                            [portId]="this.flowOut.id"\r
                            [nodeId]="this.nodeId"\r
                            [direction]="'output'"\r
                            [portKind]="'flow'"\r
                            [connected]="this.flowOut.connectedTo !== null"\r
                            (port-drag-start)="this.onPortDragStart($event)"\r
                            (port-hover)="this.onPortHover($event)"\r
                            (port-leave)="this.onPortLeave($event)">\r
                        </potatno-port>\r
                    }\r
                </div>\r
            </div>\r
            <div class="node-body">\r
                $if(this.isValue) {\r
                    <div class="node-value-row">\r
                        <div class="node-value-input">\r
                            <input type="text"\r
                                   [value]="this.nodeData.valueText"\r
                                   (input)="this.onValueInput($event)"\r
                                   (pointerdown)="$event.stopPropagation()"/>\r
                        </div>\r
                        <div class="node-outputs">\r
                            $for(outPort of this.outputPorts) {\r
                                <potatno-port\r
                                    [name]="this.outPort.name"\r
                                    [type]="this.outPort.type"\r
                                    [portId]="this.outPort.id"\r
                                    [nodeId]="this.nodeId"\r
                                    [direction]="'output'"\r
                                    [portKind]="'data'"\r
                                    [connected]="this.outPort.connectedTo !== null"\r
                                    (port-drag-start)="this.onPortDragStart($event)"\r
                                    (port-hover)="this.onPortHover($event)"\r
                                    (port-leave)="this.onPortLeave($event)">\r
                                </potatno-port>\r
                            }\r
                        </div>\r
                    </div>\r
                }\r
                $if(!this.isValue) {\r
                    <div class="node-inputs">\r
                        $for(inPort of this.inputPorts) {\r
                            <potatno-port\r
                                [name]="this.inPort.name"\r
                                [type]="this.inPort.type"\r
                                [portId]="this.inPort.id"\r
                                [nodeId]="this.nodeId"\r
                                [direction]="'input'"\r
                                [portKind]="'data'"\r
                                [connected]="this.inPort.connectedTo !== null"\r
                                (port-drag-start)="this.onPortDragStart($event)"\r
                                (port-hover)="this.onPortHover($event)"\r
                                (port-leave)="this.onPortLeave($event)">\r
                            </potatno-port>\r
                        }\r
                    </div>\r
                    <div class="node-outputs">\r
                        $for(outPort of this.outputPorts) {\r
                            <potatno-port\r
                                [name]="this.outPort.name"\r
                                [type]="this.outPort.type"\r
                                [portId]="this.outPort.id"\r
                                [nodeId]="this.nodeId"\r
                                [direction]="'output'"\r
                                [portKind]="'data'"\r
                                [connected]="this.outPort.connectedTo !== null"\r
                                (port-drag-start)="this.onPortDragStart($event)"\r
                                (port-hover)="this.onPortHover($event)"\r
                                (port-leave)="this.onPortLeave($event)">\r
                            </potatno-port>\r
                        }\r
                    </div>\r
                }\r
            </div>\r
            <div class="node-preview" #NodePreview></div>\r
        </div>\r
    }\r
    }\r
}\r
`});var La,Sa=d(()=>{La=`:host {\r
    display: block;\r
    position: relative;\r
}\r
\r
.port-wrapper {\r
    display: flex;\r
    align-items: center;\r
    gap: 6px;\r
    height: var(--pn-node-port-gap);\r
    position: relative;\r
}\r
\r
.port-wrapper.direction-output {\r
    flex-direction: row-reverse;\r
}\r
\r
.port-circle {\r
    width: 16px;\r
    height: 14px;\r
    position: relative;\r
    cursor: crosshair;\r
    flex-shrink: 0;\r
    transition: transform 0.1s;\r
}\r
\r
.port-circle:hover {\r
    transform: scale(1.3);\r
}\r
\r
/* Rectangle body */\r
.port-circle::before {\r
    content: '';\r
    position: absolute;\r
    top: 0;\r
    width: 9px;\r
    height: 100%;\r
    background: var(--port-color, var(--pn-text-muted));\r
}\r
\r
/* Triangle tip */\r
.port-circle::after {\r
    content: '';\r
    position: absolute;\r
    top: 0;\r
    width: 0;\r
    height: 0;\r
    border-top: 7px solid transparent;\r
    border-bottom: 7px solid transparent;\r
}\r
\r
/* Output: arrow points right */\r
.port-circle.direction-output::before {\r
    left: 0;\r
    border-radius: 3px 0 0 3px;\r
}\r
.port-circle.direction-output::after {\r
    left: 9px;\r
    border-left: 7px solid var(--port-color, var(--pn-text-muted));\r
}\r
\r
/* Input: arrow points left */\r
.port-circle.direction-input::before {\r
    right: 0;\r
    border-radius: 0 3px 3px 0;\r
}\r
.port-circle.direction-input::after {\r
    right: 9px;\r
    border-right: 7px solid var(--port-color, var(--pn-text-muted));\r
}\r
\r
/* Connected: solid fill (default) */\r
.port-circle.connected::before { background: var(--port-color, var(--pn-text-muted)); }\r
.port-circle.connected.direction-output::after { border-left-color: var(--port-color, var(--pn-text-muted)); }\r
.port-circle.connected.direction-input::after { border-right-color: var(--port-color, var(--pn-text-muted)); }\r
\r
/* Disconnected: dimmed */\r
.port-circle.disconnected::before { background: color-mix(in srgb, var(--port-color, var(--pn-text-muted)) 30%, var(--pn-node-bg)); }\r
.port-circle.disconnected.direction-output::after { border-left-color: color-mix(in srgb, var(--port-color, var(--pn-text-muted)) 30%, var(--pn-node-bg)); }\r
.port-circle.disconnected.direction-input::after { border-right-color: color-mix(in srgb, var(--port-color, var(--pn-text-muted)) 30%, var(--pn-node-bg)); }\r
\r
/* Invalid: red glow */\r
.port-circle.invalid::before { background: var(--pn-accent-danger); }\r
.port-circle.invalid.direction-output::after { border-left-color: var(--pn-accent-danger); }\r
.port-circle.invalid.direction-input::after { border-right-color: var(--pn-accent-danger); }\r
.port-circle.invalid { filter: drop-shadow(0 0 4px var(--pn-accent-danger)); }\r
\r
.port-label {\r
    color: var(--port-label-color, var(--pn-text-secondary));\r
    font-size: var(--pn-font-size-sm);\r
    white-space: nowrap;\r
    user-select: none;\r
}\r
`});var Ra,Ma=d(()=>{Ra=`<div [className]="this.portWrapperClasses" [title]="this.type">\r
    <div #portCircle [className]="this.portCircleClasses" style="--port-color: {{this.portColor}}"\r
         (pointerdown)="this.onPointerDown($event)"\r
         (pointerenter)="this.onPointerEnter($event)"\r
         (pointerleave)="this.onPointerLeave($event)">\r
    </div>\r
    <span class="port-label">{{this.name}}</span>\r
</div>\r
`});var Oa,Fa,Ga,Ba,ja,Va,Ua,za,$a,Ha,Ka,Xa,Wa,Za,B,Or,Fr,Gr,Br,re,jr=d(()=>{me();Sa();Ma();Za=[z({selector:"potatno-port",template:Ra,style:La})];re=class extends(Wa=E,Xa=[w],Ka=[w],Ha=[w],$a=[w],za=[w],Ua=[w],Va=[w],ja=[w],Ba=[O("port-drag-start")],Ga=[O("port-hover")],Fa=[O("port-leave")],Oa=[oe("portCircle")],Wa){constructor(){super(...arguments);b(this,"name",u(B,24,this,"")),u(B,27,this);b(this,"type",u(B,28,this,"")),u(B,31,this);b(this,"portId",u(B,32,this,"")),u(B,35,this);b(this,"nodeId",u(B,36,this,"")),u(B,39,this);b(this,"direction",u(B,40,this,"input")),u(B,43,this);b(this,"connected",u(B,44,this,!1)),u(B,47,this);b(this,"invalid",u(B,48,this,!1)),u(B,51,this);b(this,"portKind",u(B,52,this,"data")),u(B,55,this);k(this,Or,u(B,8,this)),u(B,11,this);k(this,Fr,u(B,12,this)),u(B,15,this);k(this,Gr,u(B,16,this)),u(B,19,this);k(this,Br,u(B,20,this)),u(B,23,this)}get portWrapperClasses(){return this.direction==="output"?"port-wrapper direction-output":"port-wrapper direction-input"}get portCircleClasses(){let t=["port-circle"];return this.connected?t.push("connected"):t.push("disconnected"),this.invalid&&t.push("invalid"),t.push(this.direction==="output"?"direction-output":"direction-input"),t.join(" ")}get portColor(){return this.portKind==="flow"?"var(--pn-text-primary)":this.getTypeColor(this.type)}onPointerDown(t){t.stopPropagation(),t.preventDefault(),this.mPortDragStart.dispatchEvent({nodeId:this.nodeId,portId:this.portId,portKind:this.portKind,direction:this.direction,type:this.type,element:this.portCircleElement})}onPointerEnter(t){this.mPortHover.dispatchEvent({nodeId:this.nodeId,portId:this.portId,portKind:this.portKind,direction:this.direction,type:this.type,element:this.portCircleElement})}onPointerLeave(t){this.mPortLeave.dispatchEvent(void 0)}getTypeColor(t){let n=0;for(let s=0;s<t.length;s++)n=t.charCodeAt(s)+((n<<5)-n);return`hsl(${Math.abs(n)%256*137.508%360}, 70%, 60%)`}};B=D(Wa),Or=new WeakMap,Fr=new WeakMap,Gr=new WeakMap,Br=new WeakMap,y(B,4,"mPortDragStart",Ba,re,Or),y(B,4,"mPortHover",Ga,re,Fr),y(B,4,"mPortLeave",Fa,re,Gr),y(B,4,"portCircleElement",Oa,re,Br),y(B,5,"name",Xa,re),y(B,5,"type",Ka,re),y(B,5,"portId",Ha,re),y(B,5,"nodeId",$a,re),y(B,5,"direction",za,re),y(B,5,"connected",Ua,re),y(B,5,"invalid",Va,re),y(B,5,"portKind",ja,re),re=y(B,0,"PotatnoPortComponent",Za,re),u(B,1,re)});function ul(r,e){e?To.set(r,e):To.delete(r)}var To,Ya,_a,qa,Ja,Qa,el,tl,nl,ol,rl,il,sl,al,ll,cl,M,Vr,Ur,zr,$r,Hr,Kr,Xr,Wr,Zr,Yr,te,dl=d(()=>{me();it();Na();Da();jr();To=new Map;cl=[z({selector:"potatno-node",template:Aa,style:ka})];te=class extends(ll=E,al=[w],sl=[w],il=[w],rl=[oe("NodePreview")],ol=[O("node-select")],nl=[O("node-drag-start")],tl=[O("port-drag-start")],el=[O("port-hover")],Qa=[O("port-leave")],Ja=[O("open-function")],qa=[O("value-change")],_a=[O("comment-change")],Ya=[O("resize-start")],ll){constructor(){super(...arguments);b(this,"nodeData",u(M,48,this,null)),u(M,51,this);b(this,"selected",u(M,52,this,!1)),u(M,55,this);b(this,"gridSize",u(M,56,this,20)),u(M,59,this);k(this,Vr,u(M,8,this)),u(M,11,this);k(this,Ur,u(M,12,this)),u(M,15,this);k(this,zr,u(M,16,this)),u(M,19,this);k(this,$r,u(M,20,this)),u(M,23,this);k(this,Hr,u(M,24,this)),u(M,27,this);k(this,Kr,u(M,28,this)),u(M,31,this);k(this,Xr,u(M,32,this)),u(M,35,this);k(this,Wr,u(M,36,this)),u(M,39,this);k(this,Zr,u(M,40,this)),u(M,43,this);k(this,Yr,u(M,44,this)),u(M,47,this)}get nodeStyle(){return this.nodeData?`left: ${this.nodeData.position.x*this.gridSize}px; top: ${this.nodeData.position.y*this.gridSize}px; width: ${this.nodeData.size.w*this.gridSize}px;`:""}get nodeId(){return this.nodeData?.id??""}get selectedClass(){return this.selected?"selected":""}get isComment(){return this.nodeData?.category==="comment"}get isReroute(){return this.nodeData?.category==="reroute"}get commentSizeStyle(){return this.nodeData?`height: ${this.nodeData.size.h*this.gridSize}px;`:""}get isValue(){return this.nodeData?.category==="value"}get isFunction(){return this.nodeData?.category==="function"}get showOpenButton(){return!1}get inputPorts(){return this.nodeData?.inputs??[]}get outputPorts(){return this.nodeData?.outputs??[]}get flowInputPorts(){return this.nodeData?.flowInputs??[]}get flowOutputPorts(){return this.nodeData?.flowOutputs??[]}get hasPreviewElement(){let t=this.nodeData?.id;return!!t&&To.has(t)}onUpdate(){let t=this.nodeData?.id;if(!t)return;let n=To.get(t);if(!n)return;let o;try{o=this.mPreviewContainer}catch{return}n.parentElement!==o&&(o.innerHTML="",o.appendChild(n))}onNodePointerDown(t){t.target.tagName?.toLowerCase()!=="potatno-port"&&(this.mNodeSelect.dispatchEvent({nodeId:this.nodeId,shiftKey:t.shiftKey}),this.mNodeDragStart.dispatchEvent({nodeId:this.nodeId,startX:t.clientX,startY:t.clientY}))}onPortDragStart(t){this.mPortDragStart.dispatchEvent(t.value)}onPortHover(t){this.mPortHover.dispatchEvent(t.value)}onPortLeave(t){this.mPortLeave.dispatchEvent(void 0)}onOpenFunction(t){t.stopPropagation(),this.mOpenFunction.dispatchEvent({definitionName:this.nodeData?.definitionName??""})}onValueInput(t){let n=t.target;this.mValueChange.dispatchEvent({nodeId:this.nodeId,property:"value",value:n.value})}onCommentInput(t){let n=t.target;this.mCommentChange.dispatchEvent({nodeId:this.nodeId,text:n.value})}onResizeStart(t){t.stopPropagation(),t.preventDefault(),this.mResizeStart.dispatchEvent({nodeId:this.nodeId,startX:t.clientX,startY:t.clientY})}};M=D(ll),Vr=new WeakMap,Ur=new WeakMap,zr=new WeakMap,$r=new WeakMap,Hr=new WeakMap,Kr=new WeakMap,Xr=new WeakMap,Wr=new WeakMap,Zr=new WeakMap,Yr=new WeakMap,y(M,4,"mPreviewContainer",rl,te,Vr),y(M,4,"mNodeSelect",ol,te,Ur),y(M,4,"mNodeDragStart",nl,te,zr),y(M,4,"mPortDragStart",tl,te,$r),y(M,4,"mPortHover",el,te,Hr),y(M,4,"mPortLeave",Qa,te,Kr),y(M,4,"mOpenFunction",Ja,te,Xr),y(M,4,"mValueChange",qa,te,Wr),y(M,4,"mCommentChange",_a,te,Zr),y(M,4,"mResizeStart",Ya,te,Yr),y(M,5,"nodeData",al,te),y(M,5,"selected",sl,te),y(M,5,"gridSize",il,te),te=y(M,0,"PotatnoNodeComponent",cl,te),u(M,1,te)});var ml,pl=d(()=>{ml=`:host {\r
    display: flex;\r
    flex-direction: column;\r
    height: 100%;\r
    overflow: hidden;\r
}\r
\r
.search-wrapper {\r
    display: flex;\r
    align-items: center;\r
    background: var(--pn-bg-surface);\r
    border: 1px solid var(--pn-border-default);\r
    border-radius: 4px;\r
    padding: 0 8px;\r
    margin: 8px;\r
    gap: 6px;\r
    transition: border-color 0.15s;\r
    flex-shrink: 0;\r
}\r
\r
.search-wrapper:focus-within {\r
    border-color: var(--pn-accent-primary);\r
}\r
\r
.search-icon {\r
    color: var(--pn-text-muted);\r
    font-size: var(--pn-font-size);\r
    flex-shrink: 0;\r
    user-select: none;\r
}\r
\r
.search-field {\r
    flex: 1;\r
    background: transparent;\r
    border: none;\r
    outline: none;\r
    color: var(--pn-text-primary);\r
    font-family: var(--pn-font-family);\r
    font-size: var(--pn-font-size);\r
    padding: 6px 0;\r
}\r
\r
.search-field::placeholder {\r
    color: var(--pn-text-muted);\r
}\r
\r
.category-list {\r
    flex: 1;\r
    overflow-y: auto;\r
    overflow-x: hidden;\r
    padding: 0 0 8px 0;\r
}\r
\r
.category-list::-webkit-scrollbar {\r
    width: 6px;\r
}\r
\r
.category-list::-webkit-scrollbar-track {\r
    background: var(--pn-scrollbar-track);\r
}\r
\r
.category-list::-webkit-scrollbar-thumb {\r
    background: var(--pn-scrollbar-thumb);\r
    border-radius: 3px;\r
}\r
\r
.category-group {\r
    margin-bottom: 2px;\r
}\r
\r
.category-header {\r
    display: flex;\r
    align-items: center;\r
    gap: 6px;\r
    padding: 6px 12px;\r
    cursor: pointer;\r
    user-select: none;\r
    background: var(--pn-bg-secondary);\r
    border: none;\r
    width: 100%;\r
    text-align: left;\r
    font-family: var(--pn-font-family);\r
    font-size: var(--pn-font-size-sm);\r
    color: var(--pn-text-secondary);\r
    text-transform: uppercase;\r
    letter-spacing: 0.5px;\r
    transition: background 0.15s, color 0.15s;\r
}\r
\r
.category-header:hover {\r
    background: var(--pn-bg-elevated);\r
    color: var(--pn-text-primary);\r
}\r
\r
.category-border {\r
    width: 3px;\r
    height: 14px;\r
    border-radius: 2px;\r
    flex-shrink: 0;\r
}\r
\r
.category-icon {\r
    font-size: var(--pn-font-size);\r
    flex-shrink: 0;\r
    width: 16px;\r
    text-align: center;\r
}\r
\r
.category-label {\r
    flex: 1;\r
}\r
\r
.category-toggle {\r
    font-size: 10px;\r
    color: var(--pn-text-muted);\r
    transition: transform 0.15s;\r
}\r
\r
.category-toggle.collapsed {\r
    transform: rotate(-90deg);\r
}\r
\r
.category-items {\r
    padding: 2px 0;\r
}\r
\r
.node-entry {\r
    display: flex;\r
    align-items: center;\r
    padding: 5px 12px 5px 32px;\r
    cursor: grab;\r
    user-select: none;\r
    font-family: var(--pn-font-family);\r
    font-size: var(--pn-font-size);\r
    color: var(--pn-text-primary);\r
    transition: background 0.1s;\r
    border: none;\r
    background: transparent;\r
    width: 100%;\r
    text-align: left;\r
}\r
\r
.node-entry:hover {\r
    background: var(--pn-bg-elevated);\r
}\r
\r
.node-entry:active {\r
    cursor: grabbing;\r
    background: var(--pn-bg-surface);\r
}\r
\r
.empty-message {\r
    padding: 16px;\r
    text-align: center;\r
    color: var(--pn-text-muted);\r
    font-family: var(--pn-font-family);\r
    font-size: var(--pn-font-size-sm);\r
    font-style: italic;\r
}\r
`});var yl,hl=d(()=>{yl=`<div class="search-wrapper">\r
    <span class="search-icon">\u2315</span>\r
    <input class="search-field" type="text" placeholder="Search nodes..." (input)="this.onSearchInput($event)" />\r
</div>\r
<div class="category-list">\r
    $for(group of this.filteredGroups) {\r
        <div class="category-group">\r
            <button class="category-header" (click)="this.toggleCategory(this.group.category)">\r
                <span class="category-border" style="background: {{this.group.cssColor}}"></span>\r
                <span class="category-icon">{{this.group.icon}}</span>\r
                <span class="category-label">{{this.group.label}}</span>\r
                <span [className]="this.getToggleClass(this.group.category)">\u25BC</span>\r
            </button>\r
            $if(!this.isCategoryCollapsed(this.group.category)) {\r
                <div class="category-items">\r
                    $for(node of this.group.nodes) {\r
                        <div class="node-entry" (mousedown)="this.onNodeMouseDown(this.node.name)">{{this.node.name}}</div>\r
                    }\r
                </div>\r
            }\r
        </div>\r
    }\r
    $if(this.filteredGroups.length === 0) {\r
        <div class="empty-message">No matching nodes found.</div>\r
    }\r
</div>`});var fl,gl,bl,Tl,nt,_r,It,qr=d(()=>{me();it();pl();hl();Tl=[z({selector:"potatno-node-library",template:yl,style:ml})];It=class extends(bl=E,gl=[O("node-drag-start")],fl=[w],bl){constructor(){super(...arguments);u(nt,5,this);b(this,"mNodeDefinitions",[]);b(this,"mCachedFilteredGroups",[]);k(this,_r,u(nt,8,this)),u(nt,11,this);b(this,"mSearchQuery","");b(this,"mCollapsedCategories",{})}set nodeDefinitions(t){this.mNodeDefinitions=t,this.rebuildFilteredGroups()}get nodeDefinitions(){return this.mNodeDefinitions}get filteredGroups(){return this.mCachedFilteredGroups}rebuildFilteredGroups(){let t=this.mSearchQuery.toLowerCase(),n=new Map;for(let s of this.mNodeDefinitions){if(t&&!s.name.toLowerCase().includes(t))continue;let a=n.get(s.category);a||(a=[],n.set(s.category,a)),a.push(s)}let o=[],i=Object.values(Ke);for(let s of i){let a=n.get(s);if(a&&a.length>0){let l=kt.get(s);o.push({category:s,icon:l.icon,label:l.label,cssColor:l.cssColor,nodes:a})}}this.mCachedFilteredGroups=o}onSearchInput(t){this.mSearchQuery=t.target.value,this.rebuildFilteredGroups()}toggleCategory(t){this.mCollapsedCategories[t]=!this.mCollapsedCategories[t],this.rebuildFilteredGroups()}isCategoryCollapsed(t){return!!this.mCollapsedCategories[t]}getToggleClass(t){return this.mCollapsedCategories[t]?"category-toggle collapsed":"category-toggle"}onNodeMouseDown(t){this.mNodeDragStart.dispatchEvent(t)}};nt=D(bl),_r=new WeakMap,y(nt,4,"mNodeDragStart",gl,It,_r),y(nt,3,"nodeDefinitions",fl,It),It=y(nt,0,"PotatnoNodeLibrary",Tl,It),u(nt,1,It)});var Pl,vl=d(()=>{Pl=`:host {\r
    display: flex;\r
    flex-direction: column;\r
    height: 100%;\r
    overflow: hidden;\r
}\r
\r
.tab-bar {\r
    display: flex;\r
    background: var(--pn-bg-secondary);\r
    border-bottom: 1px solid var(--pn-border-default);\r
    flex-shrink: 0;\r
}\r
\r
.tab-button {\r
    flex: 1;\r
    padding: 8px 12px;\r
    background: transparent;\r
    border: none;\r
    color: var(--pn-text-secondary);\r
    font-family: var(--pn-font-family);\r
    font-size: var(--pn-font-size);\r
    cursor: pointer;\r
    border-bottom: 2px solid transparent;\r
    transition: color 0.15s, border-color 0.15s;\r
}\r
\r
.tab-button:hover {\r
    color: var(--pn-text-primary);\r
}\r
\r
.tab-button.active {\r
    color: var(--pn-accent-primary);\r
    border-bottom-color: var(--pn-accent-primary);\r
}\r
\r
.tab-content {\r
    flex: 1;\r
    overflow: hidden;\r
    display: flex;\r
    flex-direction: column;\r
}\r
`});var Cl,xl=d(()=>{Cl=`<div class="tab-bar">\r
    <button [className]="this.getTabClass(0)" (click)="this.onTabClick(0)">Nodes</button>\r
    <button [className]="this.getTabClass(1)" (click)="this.onTabClick(1)">Functions</button>\r
</div>\r
<div class="tab-content">\r
    $if(this.activeTabIndex === 0) {\r
        <potatno-node-library [nodeDefinitions]="this.nodeDefinitions" (node-drag-start)="this.onNodeDragStart($event)"></potatno-node-library>\r
    }\r
    $if(this.activeTabIndex === 1) {\r
        <potatno-function-list [functions]="this.functions" [activeFunctionId]="this.activeFunctionId" (function-select)="this.onFunctionSelect($event)" (function-add)="this.onFunctionAdd($event)" (function-delete)="this.onFunctionDelete($event)"></potatno-function-list>\r
    }\r
</div>`});var Il,wl,El,Nl,kl,Dl,Al,Sl,Ll,X,Jr,Qr,ei,ti,Ne,Ml=d(()=>{me();vl();xl();qr();Rr();Ll=[z({selector:"potatno-panel-left",template:Cl,style:Pl})];Ne=class extends(Sl=E,Al=[w],Dl=[w],kl=[w],Nl=[O("node-drag-start")],El=[O("function-select")],wl=[O("function-add")],Il=[O("function-delete")],Sl){constructor(){super(...arguments);b(this,"nodeDefinitions",u(X,24,this,[])),u(X,27,this);b(this,"functions",u(X,28,this,[])),u(X,31,this);b(this,"activeFunctionId",u(X,32,this,"")),u(X,35,this);k(this,Jr,u(X,8,this)),u(X,11,this);k(this,Qr,u(X,12,this)),u(X,15,this);k(this,ei,u(X,16,this)),u(X,19,this);k(this,ti,u(X,20,this)),u(X,23,this);b(this,"mActiveTabIndex",0)}get activeTabIndex(){return this.mActiveTabIndex}getTabClass(t){return t===this.mActiveTabIndex?"tab-button active":"tab-button"}onTabClick(t){this.mActiveTabIndex=t}onNodeDragStart(t){this.mNodeDragStart.dispatchEvent(t.value)}onFunctionSelect(t){this.mFunctionSelect.dispatchEvent(t.value)}onFunctionAdd(t){this.mFunctionAdd.dispatchEvent(void 0)}onFunctionDelete(t){this.mFunctionDelete.dispatchEvent(t.value)}};X=D(Sl),Jr=new WeakMap,Qr=new WeakMap,ei=new WeakMap,ti=new WeakMap,y(X,4,"mNodeDragStart",Nl,Ne,Jr),y(X,4,"mFunctionSelect",El,Ne,Qr),y(X,4,"mFunctionAdd",wl,Ne,ei),y(X,4,"mFunctionDelete",Il,Ne,ti),y(X,5,"nodeDefinitions",Al,Ne),y(X,5,"functions",Dl,Ne),y(X,5,"activeFunctionId",kl,Ne),Ne=y(X,0,"PotatnoPanelLeft",Ll,Ne),u(X,1,Ne)});var Ol,Rl=d(()=>{Ol=`:host {\r
    display: flex;\r
    flex-direction: column;\r
    height: 100%;\r
    overflow: hidden;\r
}\r
\r
.properties-header {\r
    padding: 10px 12px;\r
    font-family: var(--pn-font-family);\r
    font-size: var(--pn-font-size-lg);\r
    font-weight: 600;\r
    color: var(--pn-text-primary);\r
    border-bottom: 1px solid var(--pn-border-default);\r
    background: var(--pn-bg-secondary);\r
    flex-shrink: 0;\r
}\r
\r
.properties-content {\r
    flex: 1;\r
    overflow-y: auto;\r
    overflow-x: hidden;\r
    padding: 8px 0;\r
}\r
\r
.properties-content::-webkit-scrollbar {\r
    width: 6px;\r
}\r
\r
.properties-content::-webkit-scrollbar-track {\r
    background: var(--pn-scrollbar-track);\r
}\r
\r
.properties-content::-webkit-scrollbar-thumb {\r
    background: var(--pn-scrollbar-thumb);\r
    border-radius: 3px;\r
}\r
\r
.section {\r
    padding: 8px 12px;\r
    border-bottom: 1px solid var(--pn-border-default);\r
}\r
\r
.section:last-child {\r
    border-bottom: none;\r
}\r
\r
.section-label {\r
    font-family: var(--pn-font-family);\r
    font-size: var(--pn-font-size-sm);\r
    color: var(--pn-text-muted);\r
    text-transform: uppercase;\r
    letter-spacing: 0.5px;\r
    margin-bottom: 6px;\r
}\r
\r
.name-input {\r
    width: 100%;\r
    background: var(--pn-bg-surface);\r
    border: 1px solid var(--pn-border-default);\r
    border-radius: 4px;\r
    color: var(--pn-text-primary);\r
    font-family: var(--pn-font-family);\r
    font-size: var(--pn-font-size);\r
    padding: 5px 8px;\r
    outline: none;\r
    transition: border-color 0.15s;\r
    box-sizing: border-box;\r
}\r
\r
.name-input:focus {\r
    border-color: var(--pn-accent-primary);\r
}\r
\r
.name-input:invalid {\r
    border-color: var(--pn-accent-danger);\r
    outline-color: var(--pn-accent-danger);\r
}\r
\r
.name-input:disabled {\r
    color: var(--pn-text-muted);\r
    background: var(--pn-bg-secondary);\r
    cursor: not-allowed;\r
}\r
\r
.port-list {\r
    display: flex;\r
    flex-direction: column;\r
    gap: 4px;\r
}\r
\r
.port-entry {\r
    display: flex;\r
    align-items: center;\r
    gap: 4px;\r
}\r
\r
.port-name-input {\r
    flex: 1;\r
    background: var(--pn-bg-surface);\r
    border: 1px solid var(--pn-border-default);\r
    border-radius: 4px;\r
    color: var(--pn-text-primary);\r
    font-family: var(--pn-font-family);\r
    font-size: var(--pn-font-size-sm);\r
    padding: 4px 6px;\r
    outline: none;\r
    transition: border-color 0.15s;\r
    min-width: 0;\r
}\r
\r
.port-name-input:focus {\r
    border-color: var(--pn-accent-primary);\r
}\r
\r
.port-name-input:invalid {\r
    border-color: var(--pn-accent-danger);\r
    outline-color: var(--pn-accent-danger);\r
}\r
\r
.port-name-input:disabled {\r
    color: var(--pn-text-muted);\r
    background: var(--pn-bg-secondary);\r
    cursor: not-allowed;\r
}\r
\r
.port-type-input {\r
    width: 70px;\r
    background: var(--pn-bg-surface);\r
    border: 1px solid var(--pn-border-default);\r
    border-radius: 4px;\r
    color: var(--pn-text-secondary);\r
    font-family: var(--pn-font-mono);\r
    font-size: var(--pn-font-size-sm);\r
    padding: 4px 6px;\r
    outline: none;\r
    transition: border-color 0.15s;\r
    flex-shrink: 0;\r
}\r
\r
.port-type-input:focus {\r
    border-color: var(--pn-accent-primary);\r
}\r
\r
.port-type-input:disabled {\r
    color: var(--pn-text-muted);\r
    background: var(--pn-bg-secondary);\r
    cursor: not-allowed;\r
}\r
\r
.port-delete-button {\r
    display: flex;\r
    align-items: center;\r
    justify-content: center;\r
    width: 20px;\r
    height: 20px;\r
    background: transparent;\r
    border: none;\r
    border-radius: 3px;\r
    color: var(--pn-text-muted);\r
    font-size: var(--pn-font-size-sm);\r
    cursor: pointer;\r
    flex-shrink: 0;\r
    transition: background 0.1s, color 0.1s;\r
    padding: 0;\r
    line-height: 1;\r
}\r
\r
.port-delete-button:hover {\r
    background: var(--pn-accent-danger);\r
    color: var(--pn-text-primary);\r
}\r
\r
.import-entry {\r
    display: flex;\r
    align-items: center;\r
    gap: 4px;\r
}\r
\r
.import-name {\r
    flex: 1;\r
    font-family: var(--pn-font-mono);\r
    font-size: var(--pn-font-size-sm);\r
    color: var(--pn-text-primary);\r
    padding: 4px 6px;\r
    overflow: hidden;\r
    text-overflow: ellipsis;\r
    white-space: nowrap;\r
}\r
\r
.import-select {\r
    flex: 1;\r
    background: var(--pn-bg-surface);\r
    border: 1px solid var(--pn-border-default);\r
    border-radius: 4px;\r
    color: var(--pn-text-primary);\r
    font-family: var(--pn-font-mono);\r
    font-size: var(--pn-font-size-sm);\r
    padding: 4px 6px;\r
    outline: none;\r
    transition: border-color 0.15s;\r
    min-width: 0;\r
}\r
\r
.import-select:focus {\r
    border-color: var(--pn-accent-primary);\r
}\r
\r
.add-import-row {\r
    display: flex;\r
    gap: 4px;\r
    margin-top: 6px;\r
}\r
\r
.add-import-row .import-select {\r
    flex: 1;\r
}\r
\r
.add-import-row .add-button {\r
    flex-shrink: 0;\r
    width: auto;\r
    margin-top: 0;\r
}\r
\r
.add-button {\r
    display: flex;\r
    align-items: center;\r
    justify-content: center;\r
    gap: 4px;\r
    width: 100%;\r
    margin-top: 6px;\r
    padding: 4px 8px;\r
    background: transparent;\r
    border: 1px dashed var(--pn-border-default);\r
    border-radius: 4px;\r
    color: var(--pn-text-secondary);\r
    font-family: var(--pn-font-family);\r
    font-size: var(--pn-font-size-sm);\r
    cursor: pointer;\r
    transition: background 0.15s, border-color 0.15s, color 0.15s;\r
}\r
\r
.add-button:hover {\r
    background: var(--pn-bg-elevated);\r
    border-color: var(--pn-accent-primary);\r
    color: var(--pn-text-primary);\r
}\r
\r
.empty-note {\r
    color: var(--pn-text-muted);\r
    font-family: var(--pn-font-family);\r
    font-size: var(--pn-font-size-sm);\r
    font-style: italic;\r
    padding: 4px 0;\r
}\r
`});var Gl,Fl=d(()=>{Gl=`<div class="properties-header">Properties</div>\r
<div class="properties-content">\r
    <div class="section">\r
        <div class="section-label">Function Name</div>\r
        <input class="name-input" type="text" [value]="this.functionName" [disabled]="this.nameDisabled" pattern="[a-zA-Z][a-zA-Z0-9_]*" title="Must start with a letter, use only letters, digits, underscores" (change)="this.onNameChange($event)" />\r
    </div>\r
\r
    <div class="section">\r
        <div class="section-label">Inputs</div>\r
        <div class="port-list">\r
            $for(input of this.functionInputs; index = $index) {\r
                <div class="port-entry">\r
                    <input class="port-name-input" type="text" [value]="this.input.name" [disabled]="this.portsDisabled" pattern="[a-zA-Z][a-zA-Z0-9_]*" title="Must start with a letter, use only letters, digits, underscores" (change)="this.onInputNameChange(this.index, $event)" />\r
                    <select class="port-type-input" [disabled]="this.portsDisabled" (change)="this.onInputTypeChange(this.index, $event)">\r
                        $for(t of this.availableTypes) {\r
                            <option [value]="this.t" [selected]="this.t === this.input.type">{{this.t}}</option>\r
                        }\r
                    </select>\r
                    $if(!this.portsDisabled) {\r
                        <button class="port-delete-button" (click)="this.onDeleteInput(this.index)">\u2715</button>\r
                    }\r
                </div>\r
            }\r
            $if(this.functionInputs.length === 0) {\r
                <div class="empty-note">No inputs defined.</div>\r
            }\r
        </div>\r
        $if(!this.portsDisabled) {\r
            <button class="add-button" (click)="this.onAddInput()">+ Add Input</button>\r
        }\r
    </div>\r
\r
    <div class="section">\r
        <div class="section-label">Outputs</div>\r
        <div class="port-list">\r
            $for(output of this.functionOutputs; index = $index) {\r
                <div class="port-entry">\r
                    <input class="port-name-input" type="text" [value]="this.output.name" [disabled]="this.portsDisabled" pattern="[a-zA-Z][a-zA-Z0-9_]*" title="Must start with a letter, use only letters, digits, underscores" (change)="this.onOutputNameChange(this.index, $event)" />\r
                    <select class="port-type-input" [disabled]="this.portsDisabled" (change)="this.onOutputTypeChange(this.index, $event)">\r
                        $for(t of this.availableTypes) {\r
                            <option [value]="this.t" [selected]="this.t === this.output.type">{{this.t}}</option>\r
                        }\r
                    </select>\r
                    $if(!this.portsDisabled) {\r
                        <button class="port-delete-button" (click)="this.onDeleteOutput(this.index)">\u2715</button>\r
                    }\r
                </div>\r
            }\r
            $if(this.functionOutputs.length === 0) {\r
                <div class="empty-note">No outputs defined.</div>\r
            }\r
        </div>\r
        $if(!this.portsDisabled) {\r
            <button class="add-button" (click)="this.onAddOutput()">+ Add Output</button>\r
        }\r
    </div>\r
\r
    <div class="section">\r
        <div class="section-label">Imports</div>\r
        <div class="port-list">\r
            $for(imp of this.functionImports; index = $index) {\r
                <div class="import-entry">\r
                    <span class="import-name">{{this.imp}}</span>\r
                    $if(!this.portsDisabled) {\r
                        <button class="port-delete-button" (click)="this.onDeleteImport(this.index)">\u2715</button>\r
                    }\r
                </div>\r
            }\r
            $if(this.functionImports.length === 0) {\r
                <div class="empty-note">No imports added.</div>\r
            }\r
        </div>\r
        $if(!this.portsDisabled) {\r
            $if(this.unusedImports.length > 0) {\r
                <div class="add-import-row">\r
                    <select class="import-select" (change)="this.onImportSelectChange($event)">\r
                        $for(avail of this.unusedImports) {\r
                            <option [value]="this.avail">{{this.avail}}</option>\r
                        }\r
                    </select>\r
                    <button class="add-button" (click)="this.onAddSelectedImport()">+ Add</button>\r
                </div>\r
            }\r
        }\r
    </div>\r
</div>\r
`});var Bl,jl,Vl,Ul,zl,$l,Hl,Kl,Xl,Wl,Zl,$,ni,Pe,Yl=d(()=>{me();Rl();Fl();Zl=[z({selector:"potatno-panel-properties",template:Gl,style:Ol})];Pe=class extends(Wl=E,Xl=[w],Kl=[w],Hl=[w],$l=[w],zl=[w],Ul=[w],Vl=[w],jl=[w],Bl=[O("properties-change")],Wl){constructor(){super(...arguments);u($,5,this);b(this,"functionName",u($,12,this,"")),u($,15,this);b(this,"functionInputs",u($,16,this,[])),u($,19,this);b(this,"functionOutputs",u($,20,this,[])),u($,23,this);b(this,"mFunctionImports",[]);b(this,"isSystem",u($,24,this,!1)),u($,27,this);b(this,"editableByUser",u($,28,this,!1)),u($,31,this);b(this,"mAvailableImports",[]);b(this,"mAvailableTypes",[]);b(this,"mCachedUnusedImports",[]);b(this,"mSelectedImport","");k(this,ni,u($,8,this)),u($,11,this)}set functionImports(t){this.mFunctionImports=t,this.rebuildUnusedImports()}get functionImports(){return this.mFunctionImports}get nameDisabled(){return this.isSystem}get portsDisabled(){return this.isSystem&&!this.editableByUser}set availableImports(t){this.mAvailableImports=t,this.rebuildUnusedImports()}get availableImports(){return this.mAvailableImports}set availableTypes(t){this.mAvailableTypes=t}get availableTypes(){return this.mAvailableTypes}validateName(t){return/^[a-zA-Z][a-zA-Z0-9_]*$/.test(t)}isNameDuplicate(t,n,o){if(n!=="function"&&t===this.functionName)return!0;for(let i=0;i<this.functionInputs.length;i++)if(!(n==="input"&&i===o)&&this.functionInputs[i].name===t)return!0;for(let i=0;i<this.functionOutputs.length;i++)if(!(n==="output"&&i===o)&&this.functionOutputs[i].name===t)return!0;return!1}onNameChange(t){let n=t.target,o=n.value,i=!this.validateName(o)||this.isNameDuplicate(o,"function");n.style.borderColor=i?"var(--pn-accent-danger)":"",this.functionName=o,this.mPropertiesChange.dispatchEvent({name:o})}onInputNameChange(t,n){let o=n.target,i=o.value,s=!this.validateName(i)||this.isNameDuplicate(i,"input",t);o.style.borderColor=s?"var(--pn-accent-danger)":"";let a=[...this.functionInputs];a[t]={...a[t],name:i},this.functionInputs=a,this.mPropertiesChange.dispatchEvent({inputs:a})}onInputTypeChange(t,n){let o=n.target.value,i=[...this.functionInputs];i[t]={...i[t],type:o},this.functionInputs=i,this.mPropertiesChange.dispatchEvent({inputs:i})}onOutputNameChange(t,n){let o=n.target,i=o.value,s=!this.validateName(i)||this.isNameDuplicate(i,"output",t);o.style.borderColor=s?"var(--pn-accent-danger)":"";let a=[...this.functionOutputs];a[t]={...a[t],name:i},this.functionOutputs=a,this.mPropertiesChange.dispatchEvent({outputs:a})}onOutputTypeChange(t,n){let o=n.target.value,i=[...this.functionOutputs];i[t]={...i[t],type:o},this.functionOutputs=i,this.mPropertiesChange.dispatchEvent({outputs:i})}onAddInput(){let t=this.mAvailableTypes.length>0?this.mAvailableTypes[0]:"number",n=[...this.functionInputs,{name:"new_input",type:t}];this.functionInputs=n,this.mPropertiesChange.dispatchEvent({inputs:n})}onDeleteInput(t){let n=[...this.functionInputs];n.splice(t,1),this.functionInputs=n,this.mPropertiesChange.dispatchEvent({inputs:n})}onAddOutput(){let t=this.mAvailableTypes.length>0?this.mAvailableTypes[0]:"number",n=[...this.functionOutputs,{name:"new_output",type:t}];this.functionOutputs=n,this.mPropertiesChange.dispatchEvent({outputs:n})}onDeleteOutput(t){let n=[...this.functionOutputs];n.splice(t,1),this.functionOutputs=n,this.mPropertiesChange.dispatchEvent({outputs:n})}get unusedImports(){return this.mCachedUnusedImports}onImportSelectChange(t){this.mSelectedImport=t.target.value}onAddSelectedImport(){let t=this.mSelectedImport||(this.mCachedUnusedImports.length>0?this.mCachedUnusedImports[0]:"");if(!t)return;let n=[...this.mFunctionImports,t];this.functionImports=n,this.mSelectedImport="",this.mPropertiesChange.dispatchEvent({imports:n})}onDeleteImport(t){let n=[...this.mFunctionImports];n.splice(t,1),this.functionImports=n,this.mPropertiesChange.dispatchEvent({imports:n})}rebuildUnusedImports(){let t=new Set(this.mFunctionImports);this.mCachedUnusedImports=this.mAvailableImports.filter(n=>!t.has(n))}};$=D(Wl),ni=new WeakMap,y($,3,"functionImports",$l,Pe),y($,3,"availableImports",Vl,Pe),y($,3,"availableTypes",jl,Pe),y($,4,"mPropertiesChange",Bl,Pe,ni),y($,5,"functionName",Xl,Pe),y($,5,"functionInputs",Kl,Pe),y($,5,"functionOutputs",Hl,Pe),y($,5,"isSystem",zl,Pe),y($,5,"editableByUser",Ul,Pe),Pe=y($,0,"PotatnoPanelProperties",Zl,Pe),u($,1,Pe)});var ql,_l=d(()=>{ql=`:host {\r
    display: block;\r
    position: relative;\r
}\r
\r
.preview-container {\r
    display: flex;\r
    flex-direction: column;\r
    width: 320px;\r
    height: 240px;\r
    min-width: 200px;\r
    min-height: 150px;\r
    background: var(--pn-bg-secondary);\r
    border: 1px solid var(--pn-border-default);\r
    border-radius: var(--pn-node-border-radius);\r
    box-shadow: 0 4px 12px var(--pn-node-shadow);\r
    overflow: hidden;\r
}\r
\r
.preview-header {\r
    display: flex;\r
    align-items: center;\r
    padding: 6px 10px;\r
    background: var(--pn-bg-elevated);\r
    border-bottom: 1px solid var(--pn-border-default);\r
    flex-shrink: 0;\r
    cursor: default;\r
    user-select: none;\r
}\r
\r
.preview-title {\r
    font-family: var(--pn-font-family);\r
    font-size: var(--pn-font-size-sm);\r
    color: var(--pn-text-secondary);\r
    text-transform: uppercase;\r
    letter-spacing: 0.5px;\r
    flex: 1;\r
}\r
\r
.preview-content {\r
    flex: 1;\r
    overflow: auto;\r
    padding: 8px;\r
    background: var(--pn-bg-primary);\r
}\r
\r
.preview-content::-webkit-scrollbar {\r
    width: 6px;\r
    height: 6px;\r
}\r
\r
.preview-content::-webkit-scrollbar-track {\r
    background: var(--pn-scrollbar-track);\r
}\r
\r
.preview-content::-webkit-scrollbar-thumb {\r
    background: var(--pn-scrollbar-thumb);\r
    border-radius: 3px;\r
}\r
\r
.resize-handle {\r
    position: absolute;\r
    top: -2px;\r
    left: -2px;\r
    width: 12px;\r
    height: 12px;\r
    cursor: nwse-resize;\r
    z-index: 10;\r
}\r
\r
.resize-handle::before {\r
    content: '';\r
    position: absolute;\r
    bottom: 2px;\r
    right: 2px;\r
    width: 8px;\r
    height: 8px;\r
    border-top: 2px solid var(--pn-text-muted);\r
    border-left: 2px solid var(--pn-text-muted);\r
    transition: border-color 0.15s;\r
}\r
\r
.resize-handle:hover::before {\r
    border-color: var(--pn-accent-primary);\r
}\r
\r
.error-title {\r
    color: var(--pn-accent-danger) !important;\r
}\r
\r
.error-list {\r
    overflow-y: auto;\r
    flex: 1;\r
    padding: 4px;\r
}\r
\r
.error-item {\r
    display: flex;\r
    align-items: flex-start;\r
    gap: 8px;\r
    padding: 6px 8px;\r
    border-bottom: 1px solid var(--pn-border-color);\r
}\r
\r
.error-item:last-child {\r
    border-bottom: none;\r
}\r
\r
.error-icon {\r
    flex-shrink: 0;\r
    width: 18px;\r
    height: 18px;\r
    border-radius: 50%;\r
    background: var(--pn-accent-danger);\r
    color: white;\r
    display: flex;\r
    align-items: center;\r
    justify-content: center;\r
    font-size: 11px;\r
    font-weight: bold;\r
}\r
\r
.error-content {\r
    flex: 1;\r
    min-width: 0;\r
}\r
\r
.error-message {\r
    color: var(--pn-text-primary);\r
    font-size: var(--pn-font-size-sm);\r
    word-break: break-word;\r
}\r
\r
.error-location {\r
    color: var(--pn-text-muted);\r
    font-size: 10px;\r
    margin-top: 2px;\r
}\r
`});var Ql,Jl=d(()=>{Ql=`<div class="resize-handle" (pointerdown)="this.onResizePointerDown($event)"></div>\r
<div class="preview-container" #PreviewContainer>\r
    <div class="preview-header">\r
        $if(this.hasErrors) {\r
            <span class="preview-title error-title">Errors ({{this.errors.length}})</span>\r
        }\r
        $if(!this.hasErrors) {\r
            <span class="preview-title">Preview</span>\r
        }\r
    </div>\r
    $if(this.hasErrors) {\r
        <div class="error-list">\r
            $for(error of this.errors) {\r
                <div class="error-item">\r
                    <span class="error-icon">!</span>\r
                    <div class="error-content">\r
                        <div class="error-message">{{this.error.message}}</div>\r
                        <div class="error-location">{{this.error.location}}</div>\r
                    </div>\r
                </div>\r
            }\r
        </div>\r
    }\r
    $if(!this.hasErrors) {\r
        <div class="preview-content" #PreviewContent></div>\r
    }\r
</div>\r
`});var ec,tc,nc,oc,rc,ic,sc,he,oi,ri,Fe,ac=d(()=>{me();_l();Jl();sc=[z({selector:"potatno-preview",template:Ql,style:ql})];Fe=class extends(ic=E,rc=[w,oe("PreviewContent")],oc=[oe("PreviewContainer")],nc=[w],tc=[w],ec=[w],ic){constructor(){super(...arguments);u(he,5,this);k(this,oi,u(he,8,this)),u(he,11,this);k(this,ri,u(he,12,this)),u(he,15,this);b(this,"errors",u(he,16,this,[])),u(he,19,this);b(this,"mDragging",!1);b(this,"mStartX",0);b(this,"mStartY",0);b(this,"mStartWidth",0);b(this,"mStartHeight",0)}get hasErrors(){return this.errors.length>0}getContainer(){return this.contentElement}setContent(t){let n=this.contentElement;for(;n.firstChild;)n.removeChild(n.firstChild);n.appendChild(t)}onResizePointerDown(t){t.preventDefault(),t.stopPropagation(),this.mDragging=!0,this.mStartX=t.clientX,this.mStartY=t.clientY;let n=this.containerElement;if(!n)return;this.mStartWidth=n.offsetWidth,this.mStartHeight=n.offsetHeight,t.target.setPointerCapture(t.pointerId);let o=s=>{if(!this.mDragging)return;let a=this.mStartX-s.clientX,l=this.mStartY-s.clientY,c=Math.max(200,this.mStartWidth+a),p=Math.max(150,this.mStartHeight+l);n.style.width=c+"px",n.style.height=p+"px"},i=s=>{this.mDragging=!1,s.target.releasePointerCapture(s.pointerId),document.removeEventListener("pointermove",o),document.removeEventListener("pointerup",i)};document.addEventListener("pointermove",o),document.addEventListener("pointerup",i)}};he=D(ic),oi=new WeakMap,ri=new WeakMap,y(he,4,"contentElement",rc,Fe,oi),y(he,4,"containerElement",oc,Fe,ri),y(he,1,"getContainer",tc,Fe),y(he,1,"setContent",ec,Fe),y(he,5,"errors",nc,Fe),Fe=y(he,0,"PotatnoPreview",sc,Fe),u(he,1,Fe)});var cc,lc=d(()=>{cc=`.resize-handle {\r
    background: var(--pn-border-default);\r
    transition: background 0.15s;\r
    flex-shrink: 0;\r
}\r
\r
.resize-handle:hover {\r
    background: var(--pn-accent-primary);\r
}\r
\r
.resize-handle.vertical {\r
    width: 4px;\r
    height: 100%;\r
    cursor: col-resize;\r
}\r
\r
.resize-handle.horizontal {\r
    width: 100%;\r
    height: 4px;\r
    cursor: row-resize;\r
}\r
`});var dc,uc=d(()=>{dc=`<div [className]="this.getHandleClass()" (pointerdown)="this.onPointerDown($event)"></div>\r
`});var pc,mc,hc,yc,He,ii,wt,fc=d(()=>{me();lc();uc();yc=[z({selector:"potatno-resize-handle",template:dc,style:cc})];wt=class extends(hc=E,mc=[w],pc=[O("resize")],hc){constructor(){super(...arguments);b(this,"direction",u(He,12,this,"vertical")),u(He,15,this);k(this,ii,u(He,8,this)),u(He,11,this);b(this,"mDragging",!1);b(this,"mStartPosition",0)}getHandleClass(){return`resize-handle ${this.direction}`}onPointerDown(t){t.preventDefault(),this.mDragging=!0,this.mStartPosition=this.direction==="vertical"?t.clientX:t.clientY,t.target.setPointerCapture(t.pointerId);let n=i=>{if(!this.mDragging)return;let s=this.direction==="vertical"?i.clientX:i.clientY,a=s-this.mStartPosition;this.mStartPosition=s,this.mResize.dispatchEvent({delta:a})},o=i=>{this.mDragging=!1,i.target.releasePointerCapture(i.pointerId),document.removeEventListener("pointermove",n),document.removeEventListener("pointerup",o)};document.addEventListener("pointermove",n),document.addEventListener("pointerup",o)}};He=D(hc),ii=new WeakMap,y(He,4,"mResize",pc,wt,ii),y(He,5,"direction",mc,wt),wt=y(He,0,"PotatnoResizeHandle",yc,wt),u(He,1,wt)});var bc,gc=d(()=>{bc=`.search-wrapper {\r
    display: flex;\r
    align-items: center;\r
    background: var(--pn-bg-surface);\r
    border: 1px solid var(--pn-border-default);\r
    border-radius: 4px;\r
    padding: 0 8px;\r
    gap: 6px;\r
    transition: border-color 0.15s;\r
}\r
\r
.search-wrapper:focus-within {\r
    border-color: var(--pn-accent-primary);\r
}\r
\r
.search-icon {\r
    width: 14px;\r
    height: 14px;\r
    color: var(--pn-text-muted);\r
    flex-shrink: 0;\r
}\r
\r
.search-field {\r
    flex: 1;\r
    background: transparent;\r
    border: none;\r
    outline: none;\r
    color: var(--pn-text-primary);\r
    font-family: var(--pn-font-family);\r
    font-size: var(--pn-font-size);\r
    padding: 6px 0;\r
}\r
\r
.search-field::placeholder {\r
    color: var(--pn-text-muted);\r
}\r
`});var vc,Tc=d(()=>{vc=`<div class="search-wrapper">\r
    <svg class="search-icon" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">\r
        <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" stroke-width="1.5"/>\r
        <line x1="10.5" y1="10.5" x2="14.5" y2="14.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>\r
    </svg>\r
    <input class="search-field" type="text" [placeholder]="this.placeholder" [value]="this.value" (input)="this.onInput($event)"/>\r
</div>\r
`});var Pc,xc,Cc,Ic,wc,ke,si,ot,Ec=d(()=>{me();gc();Tc();wc=[z({selector:"potatno-search-input",template:vc,style:bc})];ot=class extends(Ic=E,Cc=[w],xc=[w],Pc=[O("search-change")],Ic){constructor(){super(...arguments);b(this,"placeholder",u(ke,12,this,"Search...")),u(ke,15,this);b(this,"value",u(ke,16,this,"")),u(ke,19,this);k(this,si,u(ke,8,this)),u(ke,11,this)}onInput(t){let n=t.target;this.value=n.value,this.mSearchChange.dispatchEvent(this.value)}};ke=D(Ic),si=new WeakMap,y(ke,4,"mSearchChange",Pc,ot,si),y(ke,5,"placeholder",Cc,ot),y(ke,5,"value",xc,ot),ot=y(ke,0,"PotatnoSearchInput",wc,ot),u(ke,1,ot)});var kc,Nc=d(()=>{kc=`.tabs-header {\r
    display: flex;\r
    background: var(--pn-bg-secondary);\r
    border-bottom: 1px solid var(--pn-border-default);\r
}\r
\r
.tab-button {\r
    flex: 1;\r
    padding: 8px 12px;\r
    background: transparent;\r
    border: none;\r
    color: var(--pn-text-secondary);\r
    font-family: var(--pn-font-family);\r
    font-size: var(--pn-font-size);\r
    cursor: pointer;\r
    border-bottom: 2px solid transparent;\r
    transition: color 0.15s, border-color 0.15s;\r
}\r
\r
.tab-button:hover {\r
    color: var(--pn-text-primary);\r
}\r
\r
.tab-button.active {\r
    color: var(--pn-accent-primary);\r
    border-bottom-color: var(--pn-accent-primary);\r
}\r
\r
.tabs-content {\r
    flex: 1;\r
    overflow: hidden;\r
}\r
`});var Ac,Dc=d(()=>{Ac=`<div class="tabs-header">\r
    $for(tab of this.tabs; index = $index) {\r
        <button [className]="this.getTabClass(this.index)" (click)="this.onTabClick(this.index)">{{this.tab}}</button>\r
    }\r
</div>\r
<div class="tabs-content">\r
    $slot\r
</div>\r
`});var Sc,Lc,Mc,Rc,Oc,De,ai,rt,Fc=d(()=>{me();Nc();Dc();Oc=[z({selector:"potatno-tabs",template:Ac,style:kc})];rt=class extends(Rc=E,Mc=[w],Lc=[w],Sc=[O("tab-change")],Rc){constructor(){super(...arguments);b(this,"tabs",u(De,12,this,[])),u(De,15,this);b(this,"activeIndex",u(De,16,this,0)),u(De,19,this);k(this,ai,u(De,8,this)),u(De,11,this)}getTabClass(t){return t===this.activeIndex?"tab-button active":"tab-button"}onTabClick(t){this.activeIndex=t,this.mTabChange.dispatchEvent(t)}};De=D(Rc),ai=new WeakMap,y(De,4,"mTabChange",Sc,rt,ai),y(De,5,"tabs",Mc,rt),y(De,5,"activeIndex",Lc,rt),rt=y(De,0,"PotatnoTabs",Oc,rt),u(De,1,rt)});var pi,S,Gc,Bc,jc,Vc,Uc,zc,$c,Hc,Kc,Xc,_,li,ci,ui,di,ye,Wc=d(()=>{me();it();vt();As();Us();br();Tr();zs();vr();Cr();$s();Hs();Ks();Xs();Ws();Zs();_s();ya();Rr();dl();qr();Ml();Yl();jr();ac();fc();Ec();Fc();pi=class{mFiles=new Map;mInternals=new Map;mProjects=new Map;mSelections=new Map;deleteAll(e){this.mProjects.delete(e),this.mFiles.delete(e),this.mSelections.delete(e),this.mInternals.delete(e)}deleteFile(e){this.mFiles.delete(e)}getFile(e){return this.mFiles.get(e)}getInternals(e){return this.mInternals.get(e)}getProject(e){return this.mProjects.get(e)}getSelection(e){return this.mSelections.get(e)}setFile(e,t){this.mFiles.set(e,t)}setInternals(e,t){this.mInternals.set(e,t)}setProject(e,t){this.mProjects.set(e,t)}setSelection(e,t){this.mSelections.set(e,t)}},S=new pi;Xc=[z({selector:"potatno-code-editor",template:qs,style:Ys})];ye=class extends(Kc=E,Hc=[oe("svgLayer")],$c=[oe("canvasWrapper")],zc=[oe("panelLeft")],Uc=[oe("panelRight")],Vc=[w],jc=[w],Bc=[w],Gc=[w],Kc){constructor(){super();u(_,5,this);b(this,"mInstanceKey");b(this,"mShowSelectionBox");b(this,"mSelectionBoxScreen");b(this,"mPreviewDebounceTimer");b(this,"mKeyboardHandler");b(this,"mResizeState");b(this,"mResizeMoveHandler");b(this,"mResizeUpHandler");b(this,"mCacheVersion");k(this,li,u(_,8,this)),u(_,11,this);k(this,ci,u(_,12,this)),u(_,15,this);k(this,ui,u(_,16,this)),u(_,19,this);k(this,di,u(_,20,this)),u(_,23,this);this.mInstanceKey=crypto.randomUUID(),S.setSelection(this.mInstanceKey,new Set),S.setInternals(this.mInstanceKey,{history:new go,clipboard:new fo,interaction:new Xt(20),renderer:new Wt,hoveredPort:null,interactionState:{mode:"idle"},previewInitialized:!1,previewElements:new Map,previewDataCache:new Map,cachedData:{activeFunctionId:"",activeFunctionName:"",activeFunctionIsSystem:!1,activeFunctionEditableByUser:!1,errors:[],hasPreview:!1,nodeDefinitionList:[],functionList:[],availableImports:[],availableTypes:[],activeFunctionInputs:[],activeFunctionOutputs:[],activeFunctionImports:[],visibleNodes:[]}}),this.mShowSelectionBox=!1,this.mSelectionBoxScreen={x1:0,y1:0,x2:0,y2:0},this.mPreviewDebounceTimer=0,this.mKeyboardHandler=null,this.mResizeState=null,this.mResizeMoveHandler=null,this.mResizeUpHandler=null,this.mCacheVersion=0}get project(){return this.getProject()}set project(t){S.setProject(this.mInstanceKey,t),this.rebuildCachedData()}get file(){return S.getFile(this.mInstanceKey)??null}set file(t){if(t){S.setFile(this.mInstanceKey,t);let n=S.getProject(this.mInstanceKey);n&&t.functions.size===0&&this.initializeMainFunctions(t,n)}else S.deleteFile(this.mInstanceKey);this.getSelectedIds().clear(),this.getInternals().history.clear(),this.getInternals().previewInitialized=!1,this.rebuildCachedData(),this.renderConnections(),this.initializePreview(),this.updatePreview()}get activeFunctionId(){return this.mCacheVersion,this.getInternals().cachedData.activeFunctionId}get interaction(){return this.getInternals().interaction}get showSelectionBox(){return this.mShowSelectionBox}get hasPreview(){return this.mCacheVersion,this.getInternals().cachedData.hasPreview}get editorErrors(){return this.mCacheVersion,this.getInternals().cachedData.errors}get gridBackgroundStyle(){return this.getInternals().interaction.getGridBackgroundCss()}get gridTransformStyle(){return"transform: "+this.getInternals().interaction.getTransformCss()}get selectionBoxStyle(){if(!this.mShowSelectionBox)return"display: none";let t=Math.min(this.mSelectionBoxScreen.x1,this.mSelectionBoxScreen.x2),n=Math.min(this.mSelectionBoxScreen.y1,this.mSelectionBoxScreen.y2),o=Math.abs(this.mSelectionBoxScreen.x2-this.mSelectionBoxScreen.x1),i=Math.abs(this.mSelectionBoxScreen.y2-this.mSelectionBoxScreen.y1);return`left: ${t}px; top: ${n}px; width: ${o}px; height: ${i}px`}get visibleNodes(){return this.mCacheVersion,this.getInternals().cachedData.visibleNodes}get nodeDefinitionList(){return this.mCacheVersion,this.getInternals().cachedData.nodeDefinitionList}get functionList(){return this.mCacheVersion,this.getInternals().cachedData.functionList}get activeFunctionName(){return this.mCacheVersion,this.getInternals().cachedData.activeFunctionName}get activeFunctionInputs(){return this.mCacheVersion,this.getInternals().cachedData.activeFunctionInputs}get activeFunctionOutputs(){return this.mCacheVersion,this.getInternals().cachedData.activeFunctionOutputs}get activeFunctionImports(){return this.mCacheVersion,this.getInternals().cachedData.activeFunctionImports}get activeFunctionIsSystem(){return this.mCacheVersion,this.getInternals().cachedData.activeFunctionIsSystem}get activeFunctionEditableByUser(){return this.mCacheVersion,this.getInternals().cachedData.activeFunctionEditableByUser}get availableImportsList(){return this.mCacheVersion,this.getInternals().cachedData.availableImports}get availableTypes(){return this.mCacheVersion,this.getInternals().cachedData.availableTypes}getProject(){return S.getProject(this.mInstanceKey)}getFile(){return S.getFile(this.mInstanceKey)}getSelectedIds(){return S.getSelection(this.mInstanceKey)}getInternals(){return S.getInternals(this.mInstanceKey)}loadCode(t){let n=this.getProject(),i=new oo(n).deserialize(t);S.setFile(this.mInstanceKey,i),this.getInternals().history.clear(),this.getSelectedIds().clear(),this.getInternals().previewInitialized=!1,this.rebuildCachedData(),this.renderConnections(),this.initializePreview(),this.updatePreview()}generateCode(){let t=this.getProject(),n=S.getFile(this.mInstanceKey);return n?new An(t).serialize(n):""}onConnect(){this.mKeyboardHandler=t=>this.onKeyDown(t),document.addEventListener("keydown",this.mKeyboardHandler)}onDeconstruct(){this.mKeyboardHandler&&document.removeEventListener("keydown",this.mKeyboardHandler),S.deleteAll(this.mInstanceKey)}onNodeDragFromLibrary(t){let n=t.value??t.detail?.value??t,o=this.getProject(),i=S.getFile(this.mInstanceKey);if(!i)return;let s=o.nodeDefinitions.get(n);if(!s){for(let P of i.functions.values())if(P.name===n&&!P.system){s=G.create(o,{id:P.name,category:"function",inputs:{...P.inputs},outputs:{...P.outputs},codeGenerator:()=>""});break}}if(!s){let P=i.activeFunction;if(P){let g=new Set(P.imports);for(let v of o.imports)if(g.has(v.name)){for(let N of v.nodes)if(N.id===n){s=N;break}if(s)break}}}if(!s){for(let P of o.globalInputs)if(n===`Get ${P.name}`){s=G.create(o,{id:n,category:"value",inputs:{},outputs:{[P.name]:{nodeType:"value",dataType:P.type}},codeGenerator:()=>""});break}}if(!s){for(let P of o.globalOutputs)if(n===`Set ${P.name}`){s=G.create(o,{id:n,category:"value",inputs:{[P.name]:{nodeType:"value",dataType:P.type}},outputs:{},codeGenerator:()=>""});break}}if(!s)return;let a=i.activeFunction?.graph;if(!a)return;let l=this.getInternals(),c=this.canvasWrapper,p=c&&c.clientWidth||800,m=c&&c.clientHeight||600,h=l.interaction.screenToWorld(p/2,m/2),T=l.interaction.snapToGrid(h.x,h.y),F=new Ln(a,s,{x:T.x/l.interaction.gridSize,y:T.y/l.interaction.gridSize});l.history.push(F),this.rebuildCachedData(),this.renderConnections(),this.updatePreview()}onFunctionSelect(t){let n=t.value??t.detail?.value??t,o=S.getFile(this.mInstanceKey);o&&(o.setActiveFunction(n),this.getSelectedIds().clear(),this.rebuildCachedData(),this.renderConnections())}onFunctionAdd(){let t=S.getFile(this.mInstanceKey);if(!t)return;let n=this.getInternals().cachedData.functionList.length,o=new Ct(crypto.randomUUID(),`function_${n}`,`Function ${n}`,!1);t.addFunction(o),t.setActiveFunction(o.id),this.getSelectedIds().clear(),this.rebuildCachedData(),this.renderConnections()}onFunctionDelete(t){let n=t.value??t.detail?.value??t,o=S.getFile(this.mInstanceKey);o&&(o.removeFunction(n),this.getSelectedIds().clear(),this.rebuildCachedData(),this.renderConnections(),this.updatePreview())}onPropertiesChange(t){let n=S.getFile(this.mInstanceKey);if(!n)return;let o=n.activeFunction;if(!o)return;let i=t.value??t.detail?.value??t;i.name!==void 0&&(o.setName(i.name),o.setLabel(i.name)),i.inputs!==void 0&&o.setInputs(i.inputs),i.outputs!==void 0&&o.setOutputs(i.outputs),i.imports!==void 0&&o.setImports(i.imports),o.graph.validate(),this.rebuildCachedData(),this.renderConnections(),this.updatePreview()}onCanvasPointerDown(t){let n=this.getInternals();if(t.button===1){t.preventDefault(),n.interactionState={mode:"panning",startX:t.clientX,startY:t.clientY},t.currentTarget.setPointerCapture(t.pointerId);return}if(t.button===0){t.ctrlKey||(this.getSelectedIds().clear(),this.rebuildCachedData());let o=this.canvasWrapper.getBoundingClientRect(),i=t.clientX-o.left,s=t.clientY-o.top;n.interactionState={mode:"selecting",startX:i,startY:s},this.mSelectionBoxScreen={x1:i,y1:s,x2:i,y2:s},this.mShowSelectionBox=!1,t.currentTarget.setPointerCapture(t.pointerId)}}onCanvasPointerMove(t){let n=this.getInternals(),o=n.interactionState;if(o.mode==="panning"){let i=t.clientX-o.startX,s=t.clientY-o.startY;n.interaction.pan(i,s),o.startX=t.clientX,o.startY=t.clientY,this.renderConnections();return}if(o.mode==="dragging-node"){let i=S.getFile(this.mInstanceKey);if(!i)return;let s=(t.clientX-o.startX)/n.interaction.zoom,a=(t.clientY-o.startY)/n.interaction.zoom;for(let l of o.origins){let c=l.originX+s,p=l.originY+a,m=n.interaction.snapToGrid(c,p),h=i.activeFunction?.graph.getNode(l.nodeId);h&&(h.moveTo(m.x/n.interaction.gridSize,m.y/n.interaction.gridSize),this.updateNodePosition(l.nodeId))}this.renderConnections();return}if(o.mode==="dragging-wire"){let i=this.canvasWrapper.getBoundingClientRect(),s=(t.clientX-i.left-n.interaction.panX)/n.interaction.zoom,a=(t.clientY-i.top-n.interaction.panY)/n.interaction.zoom;n.renderer.renderTempConnection(this.svgLayer,{x:o.startX,y:o.startY},{x:s,y:a},"#bac2de");return}if(o.mode==="selecting"){let i=this.canvasWrapper.getBoundingClientRect();this.mSelectionBoxScreen.x2=t.clientX-i.left,this.mSelectionBoxScreen.y2=t.clientY-i.top;let s=Math.abs(this.mSelectionBoxScreen.x2-this.mSelectionBoxScreen.x1),a=Math.abs(this.mSelectionBoxScreen.y2-this.mSelectionBoxScreen.y1);(s>5||a>5)&&(this.mShowSelectionBox=!0);return}if(o.mode==="resizing-comment"){let i=S.getFile(this.mInstanceKey);if(!i)return;let s=(t.clientX-o.startX)/n.interaction.zoom,a=(t.clientY-o.startY)/n.interaction.zoom,l=n.interaction.gridSize,c=o.originalW+Math.round(s/l),p=o.originalH+Math.round(a/l),m=i.activeFunction?.graph.getNode(o.nodeId);m&&(m.resizeTo(c,p),this.updateNodeSize(o.nodeId));return}}onCanvasPointerUp(t){let n=this.getInternals();if(n.interactionState.mode==="dragging-node"&&(this.rebuildCachedData(),this.renderConnections(),this.updatePreview()),n.interactionState.mode==="dragging-wire"&&(n.renderer.clearTempConnection(this.svgLayer),n.hoveredPort)){let o=n.hoveredPort;if(n.interactionState.direction!==o.direction&&n.interactionState.portKind===o.portKind){let s=S.getFile(this.mInstanceKey)?.activeFunction?.graph;if(s){let a=n.interactionState.portKind==="data"?"data":"flow",l,c,p,m;n.interactionState.direction==="output"?(l=n.interactionState.sourceNodeId,c=n.interactionState.sourcePortId,p=o.nodeId,m=o.portId):(l=o.nodeId,c=o.portId,p=n.interactionState.sourceNodeId,m=n.interactionState.sourcePortId),s.addConnection(l,c,p,m,a),this.rebuildCachedData(),this.renderConnections(),this.updatePreview()}}}n.interactionState.mode==="selecting"&&(this.mShowSelectionBox=!1,this.selectNodesInBox()),n.interactionState.mode==="resizing-comment"&&this.rebuildCachedData(),n.interactionState={mode:"idle"},t.currentTarget.releasePointerCapture(t.pointerId)}onCanvasWheel(t){t.preventDefault();let n=this.canvasWrapper.getBoundingClientRect(),o=t.clientX-n.left,i=t.clientY-n.top;this.getInternals().interaction.zoomAt(o,i,t.deltaY>0?-.1:.1),this.renderConnections()}onContextMenu(t){t.preventDefault();let n=t.target;if(n.hasAttribute?.("data-hit-area")){let o=n.getAttribute("data-connection-id");if(o){let s=S.getFile(this.mInstanceKey)?.activeFunction?.graph;s&&(s.removeConnection(o),this.rebuildCachedData(),this.renderConnections(),this.updatePreview())}}}onNodePointerDown(t,n){let o=t.composedPath();for(let m of o)if(m.tagName?.toLowerCase()==="potatno-port")return;if(t.stopPropagation(),t.button!==0)return;let i=n.id,s=this.getInternals(),a=this.getSelectedIds(),l=S.getFile(this.mInstanceKey);if(!l)return;t.ctrlKey?a.has(i)?a.delete(i):a.add(i):a.has(i)||(a.clear(),a.add(i)),this.rebuildCachedData();let c=[],p=l.activeFunction?.graph;for(let m of a){let h=p?.getNode(m);h&&c.push({nodeId:m,originX:h.position.x*s.interaction.gridSize,originY:h.position.y*s.interaction.gridSize})}if(p){let m=p.getNode(i);if(m&&m.category==="comment"){let h=s.interaction.gridSize,T=m.position.x*h,F=m.position.y*h,P=T+m.size.w*h,g=F+m.size.h*h;for(let v of p.nodes.values()){if(v.id===i||a.has(v.id)||v.category==="comment")continue;let N=v.position.x*h,L=v.position.y*h;N>=T&&N<=P&&L>=F&&L<=g&&c.push({nodeId:v.id,originX:N,originY:L})}}}c.length>0&&(s.interactionState={mode:"dragging-node",nodeId:i,startX:t.clientX,startY:t.clientY,origins:c},this.canvasWrapper.setPointerCapture(t.pointerId))}onPortDragStart(t){let n=t.value??t.detail?.value??t,i=S.getFile(this.mInstanceKey)?.activeFunction?.graph;if(!i)return;let s=i.getNode(n.nodeId);if(!s)return;let a=this.getInternals(),l=a.interaction.gridSize,c=s.position.x*l,p=s.position.y*l,m=s.size.w*l,h=28,T=24,F=4,P,g;if(n.portKind==="flow")P=n.direction==="output"?c+m:c,g=p+h/2;else{let v=0;if(n.direction==="output"){let N=0;for(let L of s.outputs.values()){if(L.id===n.portId){v=N;break}N++}P=c+m}else{let N=0;for(let L of s.inputs.values()){if(L.id===n.portId){v=N;break}N++}P=c}g=p+h+F+(v+.5)*T}a.interactionState={mode:"dragging-wire",sourceNodeId:n.nodeId,sourcePortId:n.portId,portKind:n.portKind,direction:n.direction,type:n.type,startX:P,startY:g}}onPortHover(t){let n=t.value??t.detail?.value??t;this.getInternals().hoveredPort={nodeId:n.nodeId,portId:n.portId,portKind:n.portKind,direction:n.direction,type:n.type}}onPortLeave(){this.getInternals().hoveredPort=null}onNodeResizeStart(t,n){let o=t.value??t.detail?.value??t,s=S.getFile(this.mInstanceKey)?.activeFunction?.graph.getNode(o.nodeId);s&&(this.getInternals().interactionState={mode:"resizing-comment",nodeId:o.nodeId,startX:o.startX,startY:o.startY,originalW:s.size.w,originalH:s.size.h},this.canvasWrapper.setPointerCapture(t.pointerId??o.startX))}onCommentChange(t){let n=t.value??t.detail?.value??t,i=S.getFile(this.mInstanceKey)?.activeFunction?.graph.getNode(n.nodeId);if(i){let s=new Mn(i,"comment",n.text);this.getInternals().history.push(s),this.rebuildCachedData()}}onValueChange(t){let n=t.value??t.detail?.value??t,i=S.getFile(this.mInstanceKey)?.activeFunction?.graph.getNode(n.nodeId);if(i){let s=new Mn(i,n.property,n.value);this.getInternals().history.push(s),this.rebuildCachedData(),this.updatePreview()}}onKeyDown(t){if(t.key==="Delete"){this.deleteSelectedNodes();return}if(t.ctrlKey&&t.key==="z"){t.preventDefault(),this.getInternals().history.undo(),this.rebuildCachedData(),this.renderConnections(),this.updatePreview();return}if(t.ctrlKey&&(t.key==="y"||t.shiftKey&&t.key==="z")){t.preventDefault(),this.getInternals().history.redo(),this.rebuildCachedData(),this.renderConnections(),this.updatePreview();return}if(t.ctrlKey&&t.key==="c"){let o=S.getFile(this.mInstanceKey)?.activeFunction?.graph;o&&this.getInternals().clipboard.copy(o,this.getSelectedIds());return}if(t.ctrlKey&&t.key==="v"){this.pasteFromClipboard();return}}onResizeLeftStart(t){t.preventDefault(),this.startPanelResize("left",t)}onResizeRightStart(t){t.preventDefault(),this.startPanelResize("right",t)}startPanelResize(t,n){let o=t==="left"?this.panelLeft:this.panelRight;this.mResizeState={panel:t,startX:n.clientX,startWidth:o.offsetWidth},this.mResizeMoveHandler=i=>{if(!this.mResizeState)return;let s=t==="left"?i.clientX-this.mResizeState.startX:this.mResizeState.startX-i.clientX,a=Math.max(200,Math.min(500,this.mResizeState.startWidth+s));o.style.width=`${a}px`},this.mResizeUpHandler=()=>{this.mResizeMoveHandler&&document.removeEventListener("pointermove",this.mResizeMoveHandler),this.mResizeUpHandler&&document.removeEventListener("pointerup",this.mResizeUpHandler),this.mResizeState=null},document.addEventListener("pointermove",this.mResizeMoveHandler),document.addEventListener("pointerup",this.mResizeUpHandler)}initializeMainFunctions(t,n){let o=n.entryPoint;if(!o)return;let i=new Ct(crypto.randomUUID(),o.id,o.label,!0,o.statics.inputs||o.statics.outputs),s=o.nodes.static;for(let l=0;l<s.length;l++){let c=s[l];i.graph.addNode(c,{x:2+l*12,y:2},!0),n.nodeDefinitions.has(c.id)||n.addNodeDefinition(c)}let a=o.nodes.dynamic;for(let l of a)n.nodeDefinitions.has(l.id)||n.addNodeDefinition(l);if(o.statics.imports)for(let l of n.imports)i.addImport(l.name);if(o.statics.inputs){let l=0;for(let c of n.globalInputs){let p=G.create(n,{id:`Get ${c.name}`,category:"input",inputs:{},outputs:{[c.name]:{nodeType:"value",dataType:c.type}},codeGenerator:()=>""});i.graph.addNode(p,{x:2,y:16+l*3},!0),n.nodeDefinitions.has(p.id)||n.addNodeDefinition(p),l++}}if(o.statics.outputs){let l=0;for(let c of n.globalOutputs){let p=G.create(n,{id:`Set ${c.name}`,category:"output",inputs:{[c.name]:{nodeType:"value",dataType:c.type}},outputs:{},codeGenerator:()=>""});i.graph.addNode(p,{x:30,y:16+l*3},!0),n.nodeDefinitions.has(p.id)||n.addNodeDefinition(p),l++}}t.addFunction(i)}deleteSelectedNodes(){let n=S.getFile(this.mInstanceKey)?.activeFunction?.graph;if(!n)return;let o=[];for(let i of this.getSelectedIds()){let s=n.getNode(i);s&&!s.system&&o.push(new bo(n,i))}o.length>0&&(this.getInternals().history.push(new Sn("Delete nodes",o)),this.getSelectedIds().clear(),this.rebuildCachedData(),this.renderConnections(),this.updatePreview())}pasteFromClipboard(){let t=this.getInternals(),n=t.clipboard.getData();if(!n)return;let o=this.getProject(),s=S.getFile(this.mInstanceKey)?.activeFunction?.graph;if(!s)return;let a=[],l=[];for(let c of n.nodes){let p=o.nodeDefinitions.get(c.definitionName);if(p){let m=new Ln(s,p,{x:c.position.x+2,y:c.position.y+2});a.push(m),l.push(m)}}if(a.length>0){t.history.push(new Sn("Paste nodes",a));for(let c=0;c<l.length;c++){let p=l[c].node,m=n.nodes[c];if(p&&m.properties)for(let[h,T]of Object.entries(m.properties))p.properties.set(h,T)}for(let c of n.internalConnections){let p=l[c.sourceNodeIndex]?.node??null,m=l[c.targetNodeIndex]?.node??null;if(p&&m){let h="",T="",F=c.kind==="flow"?"flow":"data";if(F==="data"){for(let[P,g]of p.outputs)if(P===c.sourcePortName){h=g.id;break}for(let[P,g]of m.inputs)if(P===c.targetPortName){T=g.id;break}}else{for(let[P,g]of p.flowOutputs)if(P===c.sourcePortName){h=g.id;break}for(let[P,g]of m.flowInputs)if(P===c.targetPortName){T=g.id;break}}h&&T&&s.addConnection(p.id,h,m.id,T,F)}}this.getSelectedIds().clear();for(let c of l)c.node&&this.getSelectedIds().add(c.node.id);this.rebuildCachedData(),this.renderConnections(),this.updatePreview()}}selectNodesInBox(){let n=S.getFile(this.mInstanceKey)?.activeFunction?.graph;if(!n)return;let o=this.getInternals(),i=o.interaction.screenToWorld(Math.min(this.mSelectionBoxScreen.x1,this.mSelectionBoxScreen.x2),Math.min(this.mSelectionBoxScreen.y1,this.mSelectionBoxScreen.y2)),s=o.interaction.screenToWorld(Math.max(this.mSelectionBoxScreen.x1,this.mSelectionBoxScreen.x2),Math.max(this.mSelectionBoxScreen.y1,this.mSelectionBoxScreen.y2)),a=o.interaction.gridSize;for(let l of n.nodes.values()){let c=l.position.x*a,p=l.position.y*a,m=c+l.size.w*a,h=p+l.size.h*a;c<s.x&&m>i.x&&p<s.y&&h>i.y&&this.getSelectedIds().add(l.id)}this.rebuildCachedData()}renderConnections(){if(!this.svgLayer)return;let n=S.getFile(this.mInstanceKey)?.activeFunction?.graph;if(!n){this.getInternals().renderer.clearAll(this.svgLayer);return}let o=this.getInternals(),i=o.interaction.gridSize,s=28,a=24,l=4,c=[];for(let p of n.connections.values()){let m=n.getNode(p.sourceNodeId),h=n.getNode(p.targetNodeId);if(!m||!h)continue;let T=m.position.x*i,F=m.position.y*i,P=h.position.x*i,g=h.position.y*i,v=m.size.w*i,N,L,U,x;if(p.kind==="data"){let Rn=0,Yt=0;for(let wo of m.outputs.values()){if(wo.id===p.sourcePortId){Rn=Yt;break}Yt++}let hi=0;Yt=0;for(let wo of h.inputs.values()){if(wo.id===p.targetPortId){hi=Yt;break}Yt++}N=T+v,L=F+s+l+(Rn+.5)*a,U=P,x=g+s+l+(hi+.5)*a}else N=T+v,L=F+s/2,U=P,x=g+s/2;c.push({id:p.id,sourceX:N,sourceY:L,targetX:U,targetY:x,color:p.valid?"var(--pn-text-secondary)":"var(--pn-accent-danger)",valid:p.valid})}o.renderer.renderConnections(this.svgLayer,c)}initializePreview(){let t=S.getProject(this.mInstanceKey);if(!t)return;let n=t.createPreview;if(!n)return;let o=this.getInternals();if(o.previewInitialized)return;let i=this.previewEl;if(i&&typeof i.getContainer=="function"){let s=i.getContainer();n(s),o.previewInitialized=!0}}updatePreview(){let t=S.getProject(this.mInstanceKey);if(!t)return;let n=t.updatePreview;if(!n)return;let o=S.getFile(this.mInstanceKey);if(!o||this.getInternals().cachedData.errors.some(l=>l.blocking!==!1))return;let a;try{let c=new An(t).serialize(o);a=this.stripMetadataComments(c,t.commentToken)}catch{return}clearTimeout(this.mPreviewDebounceTimer),this.mPreviewDebounceTimer=setTimeout(()=>{try{n(a)}catch{}},300)}stripMetadataComments(t,n){let o=t.split(`
`),i=`${n} #potatno `;return o.filter(a=>!a.trim().startsWith(i)).join(`
`)}updateNodePosition(t){let o=S.getFile(this.mInstanceKey)?.activeFunction?.graph.getNode(t);if(!o)return;let i=this.getInternals().interaction.gridSize;for(let s of this.getInternals().cachedData.visibleNodes)if(s.id===t){s.position={x:o.position.x,y:o.position.y},s.pixelX=o.position.x*i,s.pixelY=o.position.y*i;break}}updateNodeSize(t){let o=S.getFile(this.mInstanceKey)?.activeFunction?.graph.getNode(t);if(o){for(let i of this.getInternals().cachedData.visibleNodes)if(i.id===t){i.size={w:o.size.w,h:o.size.h};break}}}validateProject(){let t=[],n=S.getFile(this.mInstanceKey);if(!n)return t;let o=/^[a-zA-Z][a-zA-Z0-9_]*$/,i=new Set;for(let a of n.functions.values()){i.has(a.name)&&t.push({message:`Duplicate function name "${a.name}".`,location:`Function "${a.name}"`}),i.add(a.name),o.test(a.name)||t.push({message:`Invalid function name "${a.name}". Must start with a letter and contain only letters, digits, and underscores.`,location:`Function "${a.name}"`});let l=new Set;for(let c of Object.keys(a.inputs))o.test(c)||t.push({message:`Invalid input name "${c}".`,location:`Function "${a.name}" > Inputs`}),l.has(c)&&t.push({message:`Duplicate input/output name "${c}".`,location:`Function "${a.name}" > Inputs`}),l.add(c);for(let c of Object.keys(a.outputs))o.test(c)||t.push({message:`Invalid output name "${c}".`,location:`Function "${a.name}" > Outputs`}),l.has(c)&&t.push({message:`Duplicate input/output name "${c}".`,location:`Function "${a.name}" > Outputs`}),l.add(c)}let s=n.activeFunction;if(!s)return t.push({message:"No active function selected.",location:"Editor"}),t;for(let a of s.graph.nodes.values())for(let l of a.inputs.values())!l.connectedTo&&!a.system&&t.push({message:`Input "${l.name}" on node "${a.definitionId}" is not connected.`,location:`Function "${s.name}" > Node "${a.definitionId}"`,blocking:!1});for(let a of s.graph.connections.values())a.valid||t.push({message:"Type mismatch on connection.",location:`Function "${s.name}"`});return t}rebuildCachedData(){let t=S.getProject(this.mInstanceKey),n=S.getFile(this.mInstanceKey),o=this.getInternals().cachedData;o.activeFunctionId=n?.activeFunctionId??"",o.hasPreview=t?.hasPreview??!1,o.errors=this.validateProject();let i=[];if(t)for(let c of t.nodeDefinitions.values())i.push({name:c.id,category:c.category});if(n)for(let c of n.functions.values())c.system||i.push({name:c.name,category:"function"});o.nodeDefinitionList=i;let s=[];if(n)for(let c of n.functions.values())s.push({id:c.id,name:c.name,label:c.label,system:c.system});if(o.functionList=s,t&&n){let c=n.activeFunction;if(c){let p=new Set(c.imports);for(let m of t.imports)if(p.has(m.name))for(let h of m.nodes)i.push({name:h.id,category:h.category})}}if(t){for(let c of t.globalInputs)i.push({name:`Get ${c.name}`,category:"value"});for(let c of t.globalOutputs)i.push({name:`Set ${c.name}`,category:"value"})}o.availableImports=t?.imports.map(c=>c.name)??[];let a=new Set;if(t)for(let c of t.nodeDefinitions.values()){let p=c;for(let m of Object.values(p.inputs))(m.nodeType==="value"||m.nodeType==="input")&&a.add(m.dataType);for(let m of Object.values(p.outputs))(m.nodeType==="value"||m.nodeType==="input")&&a.add(m.dataType)}o.availableTypes=[...a].sort();let l=n?.activeFunction;if(o.activeFunctionName=l?.name??"",o.activeFunctionIsSystem=l?.system??!1,o.activeFunctionEditableByUser=l?.editableByUser??!1,o.activeFunctionInputs=l?Object.entries(l.inputs).map(([c,p])=>({name:c,type:p.nodeType==="value"||p.nodeType==="input"?p.dataType:""})):[],o.activeFunctionOutputs=l?Object.entries(l.outputs).map(([c,p])=>({name:c,type:p.nodeType==="value"||p.nodeType==="input"?p.dataType:""})):[],o.activeFunctionImports=[...l?.imports??[]],l){let c=new Set,p=new Set;for(let h of l.graph.connections.values())c.add(h.sourcePortId),p.add(h.sourcePortId),p.add(h.targetPortId);let m=[];for(let h of l.graph.nodes.values()){let T=t?.nodeDefinitions.get(h.definitionId),F=kt.get(h.category),P=[];for(let L of h.inputs.values())P.push({id:L.id,name:L.name,type:L.type,direction:L.direction,connectedTo:L.connectedTo});let g=[];for(let L of h.outputs.values()){let U=c.has(L.id);g.push({id:L.id,name:L.name,type:L.type,direction:L.direction,connectedTo:U?"connected":null})}let v=[];for(let L of h.flowInputs.values())v.push({id:L.id,name:L.name,direction:L.direction,connectedTo:p.has(L.id)?"connected":null});let N=[];for(let L of h.flowOutputs.values())N.push({id:L.id,name:L.name,direction:L.direction,connectedTo:p.has(L.id)?"connected":null});m.push({id:h.id,definitionName:h.definitionId,category:h.category,categoryColor:F.cssColor,categoryIcon:F.icon,label:h.definitionId,position:{x:h.position.x,y:h.position.y},size:{w:h.size.w,h:h.size.h},system:h.system,selected:this.getSelectedIds().has(h.id),inputs:P,outputs:g,flowInputs:v,flowOutputs:N,valueText:h.properties.get("value")??"",commentText:h.properties.get("comment")??"",hasDefinition:!!T,pixelX:h.position.x*this.getInternals().interaction.gridSize,pixelY:h.position.y*this.getInternals().interaction.gridSize}),ul(h.id,this.getOrCreatePreviewElement(h.id,T))}o.visibleNodes=m}else o.visibleNodes=[];this.mCacheVersion++}getOrCreatePreviewElement(t,n){if(!n?.preview?.element)return null;let o=this.getInternals(),i=o.previewElements.get(t);if(i)return i;let s=n.preview.element.generatePreviewElement();return o.previewElements.set(t,s),s}evaluatePreview(t,n=!0){let o=S.getProject(this.mInstanceKey),s=S.getFile(this.mInstanceKey)?.activeFunction?.graph;if(!o||!s)return null;let a=yo.evaluate(o,s,t),l=this.getInternals();if(l.previewDataCache=a,n)for(let[c,p]of a){let m=l.previewElements.get(c);if(!m)continue;let h=s.getNode(c);if(!h)continue;let T=o.nodeDefinitions.get(h.definitionId);if(T?.preview?.element)try{T.preview.element.updatePreviewElement(m,p.inputs,p.outputs)}catch{}}return a}};_=D(Kc),li=new WeakMap,ci=new WeakMap,ui=new WeakMap,di=new WeakMap,y(_,4,"svgLayer",Hc,ye,li),y(_,4,"canvasWrapper",$c,ye,ci),y(_,4,"panelLeft",zc,ye,ui),y(_,4,"panelRight",Uc,ye,di),y(_,3,"project",Vc,ye),y(_,3,"file",jc,ye),y(_,1,"loadCode",Bc,ye),y(_,1,"generateCode",Gc,ye),ye=y(_,0,"PotatnoCodeEditor",Xc,ye),u(_,1,ye)});var Yc,Zc=d(()=>{Yc=`:host {\r
    display: block;\r
    width: 100%;\r
    height: 100%;\r
}\r
\r
potatno-code-editor {\r
    display: block;\r
    width: 100%;\r
    height: 100%;\r
}`});var qc,_c=d(()=>{qc=`:host {\r
    /* Background */\r
    --pn-bg-primary: #1e1e2e;\r
    --pn-bg-secondary: #181825;\r
    --pn-bg-surface: #252536;\r
    --pn-bg-elevated: #2a2a3c;\r
\r
    /* Text */\r
    --pn-text-primary: #cdd6f4;\r
    --pn-text-secondary: #a6adc8;\r
    --pn-text-muted: #6c7086;\r
\r
    /* Borders */\r
    --pn-border-default: #45475a;\r
    --pn-border-active: #89b4fa;\r
\r
    /* Accent */\r
    --pn-accent-primary: #89b4fa;\r
    --pn-accent-secondary: #74c7ec;\r
    --pn-accent-danger: #f38ba8;\r
    --pn-accent-warning: #fab387;\r
    --pn-accent-success: #a6e3a1;\r
\r
    /* Node category colors */\r
    --pn-cat-input: #a6e3a1;\r
    --pn-cat-output: #f38ba8;\r
    --pn-cat-value: #f9e2af;\r
    --pn-cat-function: #89b4fa;\r
    --pn-cat-flow: #cba6f7;\r
    --pn-cat-comment: #6c7086;\r
    --pn-cat-operator: #fab387;\r
    --pn-cat-type-conversion: #74c7ec;\r
\r
    /* Canvas */\r
    --pn-grid-color: #313244;\r
    --pn-grid-size: 20px;\r
    --pn-connection-width: 2px;\r
    --pn-selection-color: rgba(137, 180, 250, 0.2);\r
\r
    /* Panel */\r
    --pn-panel-width: 280px;\r
    --pn-panel-min-width: 200px;\r
    --pn-panel-max-width: 500px;\r
\r
    /* Scrollbar */\r
    --pn-scrollbar-thumb: #45475a;\r
    --pn-scrollbar-track: transparent;\r
\r
    /* Node */\r
    --pn-node-bg: #1e1e2e;\r
    --pn-node-border: #45475a;\r
    --pn-node-border-selected: #89b4fa;\r
    --pn-node-shadow: rgba(0, 0, 0, 0.3);\r
    --pn-node-header-height: 28px;\r
    --pn-node-port-size: 12px;\r
    --pn-node-port-gap: 24px;\r
    --pn-node-min-width: 160px;\r
    --pn-node-border-radius: 6px;\r
\r
    /* Font */\r
    --pn-font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;\r
    --pn-font-mono: 'Cascadia Code', 'Fira Code', 'Consolas', monospace;\r
    --pn-font-size-sm: 11px;\r
    --pn-font-size: 13px;\r
    --pn-font-size-lg: 14px;\r
}\r
`});var vo,Jc=d(()=>{me();Wc();Zc();_c();vo=class extends st{mCodeEditor;mProject;get file(){return this.mCodeEditor.file}set file(e){this.mCodeEditor.file=e}get project(){return this.mProject}constructor(e){super("potatno-code",new Ge),this.mProject=e,this.addStyle(qc),this.addStyle(Yc),this.mCodeEditor=this.addContent(ye),this.mCodeEditor.project=e}update(e,t=!0){return this.mCodeEditor.evaluatePreview(e,t)}}});var Po,Qc=d(()=>{Po=class{mProject;mId;mLabel;mStatics;mNodes;get id(){return this.mId}get nodes(){return this.mNodes}get project(){return this.mProject}get label(){return this.mLabel}get statics(){return this.mStatics}constructor(e,t){this.mProject=e,this.mId=t.id,this.mLabel=t.label??t.id,this.mNodes={static:t.nodes?.static??[],dynamic:t.nodes?.dynamic??[]},this.mStatics={imports:t.statics.imports??!1,inputs:t.statics.inputs??!1,outputs:t.statics.outputs??!1}}}});var xo,eu=d(()=>{xo=class{mCommentToken;mCreatePreview;mFunctionCodeGenerator;mGlobalInputs;mGlobalOutputs;mImports;mEntryPoint;mNodeDefinitions;mUpdatePreview;mValidTypes;get commentToken(){return this.mCommentToken}get createPreview(){return this.mCreatePreview}get functionCodeGenerator(){return this.mFunctionCodeGenerator}get globalInputs(){return this.mGlobalInputs}get globalOutputs(){return this.mGlobalOutputs}get hasPreview(){return this.mCreatePreview!==null}get imports(){return this.mImports}get entryPoint(){return this.mEntryPoint}get nodeDefinitions(){return this.mNodeDefinitions}get updatePreview(){return this.mUpdatePreview}constructor(e){this.mCommentToken=e.commentToken,this.mValidTypes=new Map;for(let[t,n]of Object.entries(e.types))this.mValidTypes.set(t,n);this.mCreatePreview=null,this.mUpdatePreview=null,this.mFunctionCodeGenerator=null,this.mEntryPoint=null,this.mNodeDefinitions=new Map,this.mImports=new Array,this.mGlobalInputs=new Array,this.mGlobalOutputs=new Array}addGlobalInput(e){this.mGlobalInputs.push(e)}addGlobalOutput(e){this.mGlobalOutputs.push(e)}addImport(e){this.mImports.push(e)}setEntryPoint(e){this.mEntryPoint=e}addNodeDefinition(e){this.mNodeDefinitions.set(e.id,e)}setFunctionCodeGenerator(e){this.mFunctionCodeGenerator=e}setPreview(e,t){this.mCreatePreview=e,this.mUpdatePreview=t}hasType(e){return this.mValidTypes.has(e)}}});var qu={};function mi(){if(!Co){requestAnimationFrame(mi);return}let r=Co.createImageData(100,100);for(let e=0;e<100;e++)for(let t=0;t<100;t++){let n=Io.update({OnPixel:{x:t/100,y:e/100}},!1),o=0,i=0,s=0;if(n){for(let[,l]of n)if("red"in l.inputs&&"green"in l.inputs&&"blue"in l.inputs){o=l.inputs.red,i=l.inputs.green,s=l.inputs.blue;break}}let a=(e*100+t)*4;r.data[a]=Math.max(0,Math.min(255,Math.round(o*255))),r.data[a+1]=Math.max(0,Math.min(255,Math.round(i*255))),r.data[a+2]=Math.max(0,Math.min(255,Math.round(s*255))),r.data[a+3]=255}Co.putImageData(r,0,0),Io.update({OnPixel:{x:.5,y:.5}},!0),requestAnimationFrame(mi)}var C,Zt,Co,Io,tu=d(()=>{ko();it();Jc();Qc();Tr();eu();C=new xo({commentToken:"//",types:{number:0,string:"",boolean:!1}});C.addImport({name:"Math",nodes:[G.create(C,{id:"Math.PI",category:"value",inputs:{},outputs:{value:{nodeType:"value",dataType:"number"}},codeGenerator:r=>`const ${r.outputs.value.valueId} = Math.PI;`,preview:{data:{updatePreviewData:()=>({value:Math.PI})}}}),G.create(C,{id:"Math.E",category:"value",inputs:{},outputs:{value:{nodeType:"value",dataType:"number"}},codeGenerator:r=>`const ${r.outputs.value.valueId} = Math.E;`,preview:{data:{updatePreviewData:()=>({value:Math.E})}}}),G.create(C,{id:"Math.abs",category:"function",inputs:{value:{nodeType:"value",dataType:"number"}},outputs:{result:{nodeType:"value",dataType:"number"}},codeGenerator:r=>`const ${r.outputs.result.valueId} = Math.abs(${r.inputs.value.valueId});`,preview:{data:{updatePreviewData:r=>({result:Math.abs(r.value)})}}}),G.create(C,{id:"Math.floor",category:"function",inputs:{value:{nodeType:"value",dataType:"number"}},outputs:{result:{nodeType:"value",dataType:"number"}},codeGenerator:r=>`const ${r.outputs.result.valueId} = Math.floor(${r.inputs.value.valueId});`,preview:{data:{updatePreviewData:r=>({result:Math.floor(r.value)})}}}),G.create(C,{id:"Math.random",category:"function",inputs:{},outputs:{result:{nodeType:"value",dataType:"number"}},codeGenerator:r=>`const ${r.outputs.result.valueId} = Math.random();`,preview:{data:{updatePreviewData:()=>({result:Math.random()})}}})]});C.addNodeDefinition(G.create(C,{id:"Number Literal",category:"value",inputs:{},outputs:{value:{nodeType:"input",inputType:"number",dataType:"number"}},codeGenerator:r=>`const ${r.outputs.value.valueId} = ${r.outputs.value.value};`,preview:{data:{updatePreviewData:()=>({value:0})}}}));C.addNodeDefinition(G.create(C,{id:"String Literal",category:"value",inputs:{},outputs:{value:{nodeType:"input",inputType:"string",dataType:"string"}},codeGenerator:r=>`const ${r.outputs.value.valueId} = "${r.outputs.value.value}";`,preview:{data:{updatePreviewData:()=>({value:""})}}}));C.addNodeDefinition(G.create(C,{id:"Boolean Literal",category:"value",inputs:{},outputs:{value:{nodeType:"input",inputType:"boolean",dataType:"boolean"}},codeGenerator:r=>`const ${r.outputs.value.valueId} = ${r.outputs.value.value?"true":"false"};`,preview:{data:{updatePreviewData:()=>({value:!1})}}}));C.addNodeDefinition(G.create(C,{id:"Add",category:"operator",inputs:{a:{nodeType:"value",dataType:"number"},b:{nodeType:"value",dataType:"number"}},outputs:{result:{nodeType:"value",dataType:"number"}},codeGenerator:r=>`const ${r.outputs.result.valueId} = ${r.inputs.a.valueId} + ${r.inputs.b.valueId};`,preview:{data:{updatePreviewData:r=>({result:r.a+r.b})}}}));C.addNodeDefinition(G.create(C,{id:"Subtract",category:"operator",inputs:{a:{nodeType:"value",dataType:"number"},b:{nodeType:"value",dataType:"number"}},outputs:{result:{nodeType:"value",dataType:"number"}},codeGenerator:r=>`const ${r.outputs.result.valueId} = ${r.inputs.a.valueId} - ${r.inputs.b.valueId};`,preview:{data:{updatePreviewData:r=>({result:r.a-r.b})}}}));C.addNodeDefinition(G.create(C,{id:"Multiply",category:"operator",inputs:{a:{nodeType:"value",dataType:"number"},b:{nodeType:"value",dataType:"number"}},outputs:{result:{nodeType:"value",dataType:"number"}},codeGenerator:r=>`const ${r.outputs.result.valueId} = ${r.inputs.a.valueId} * ${r.inputs.b.valueId};`,preview:{element:{generatePreviewElement:()=>{let r=document.createElement("canvas");return r.width=50,r.height=50,r.style.cssText="width: 50px; height: 50px; image-rendering: pixelated; border: 1px solid rgba(255,255,255,0.1); border-radius: 2px;",r},updatePreviewElement:(r,e,t)=>{let n=r.getContext("2d");if(!n)return;let o=Math.max(0,Math.min(255,Math.round(t.result*255)));n.fillStyle=`rgb(${o}, ${o}, ${o})`,n.fillRect(0,0,50,50)}},data:{updatePreviewData:r=>({result:r.a*r.b})}}}));C.addNodeDefinition(G.create(C,{id:"Divide",category:"operator",inputs:{a:{nodeType:"value",dataType:"number"},b:{nodeType:"value",dataType:"number"}},outputs:{result:{nodeType:"value",dataType:"number"}},codeGenerator:r=>`const ${r.outputs.result.valueId} = ${r.inputs.a.valueId} / ${r.inputs.b.valueId};`,preview:{data:{updatePreviewData:r=>({result:r.b!==0?r.a/r.b:0})}}}));C.addNodeDefinition(G.create(C,{id:"Modulo",category:"operator",inputs:{a:{nodeType:"value",dataType:"number"},b:{nodeType:"value",dataType:"number"}},outputs:{result:{nodeType:"value",dataType:"number"}},codeGenerator:r=>`const ${r.outputs.result.valueId} = ${r.inputs.a.valueId} % ${r.inputs.b.valueId};`,preview:{data:{updatePreviewData:r=>({result:r.b!==0?r.a%r.b:0})}}}));C.addNodeDefinition(G.create(C,{id:"Equal",category:"operator",inputs:{a:{nodeType:"value",dataType:"number"},b:{nodeType:"value",dataType:"number"}},outputs:{result:{nodeType:"value",dataType:"boolean"}},codeGenerator:r=>`const ${r.outputs.result.valueId} = ${r.inputs.a.valueId} === ${r.inputs.b.valueId};`,preview:{data:{updatePreviewData:r=>({result:r.a===r.b})}}}));C.addNodeDefinition(G.create(C,{id:"Not Equal",category:"operator",inputs:{a:{nodeType:"value",dataType:"number"},b:{nodeType:"value",dataType:"number"}},outputs:{result:{nodeType:"value",dataType:"boolean"}},codeGenerator:r=>`const ${r.outputs.result.valueId} = ${r.inputs.a.valueId} !== ${r.inputs.b.valueId};`,preview:{data:{updatePreviewData:r=>({result:r.a!==r.b})}}}));C.addNodeDefinition(G.create(C,{id:"Less Than",category:"operator",inputs:{a:{nodeType:"value",dataType:"number"},b:{nodeType:"value",dataType:"number"}},outputs:{result:{nodeType:"value",dataType:"boolean"}},codeGenerator:r=>`const ${r.outputs.result.valueId} = ${r.inputs.a.valueId} < ${r.inputs.b.valueId};`,preview:{data:{updatePreviewData:r=>({result:r.a<r.b})}}}));C.addNodeDefinition(G.create(C,{id:"Greater Than",category:"operator",inputs:{a:{nodeType:"value",dataType:"number"},b:{nodeType:"value",dataType:"number"}},outputs:{result:{nodeType:"value",dataType:"boolean"}},codeGenerator:r=>`const ${r.outputs.result.valueId} = ${r.inputs.a.valueId} > ${r.inputs.b.valueId};`,preview:{data:{updatePreviewData:r=>({result:r.a>r.b})}}}));C.addNodeDefinition(G.create(C,{id:"And",category:"operator",inputs:{a:{nodeType:"value",dataType:"boolean"},b:{nodeType:"value",dataType:"boolean"}},outputs:{result:{nodeType:"value",dataType:"boolean"}},codeGenerator:r=>`const ${r.outputs.result.valueId} = ${r.inputs.a.valueId} && ${r.inputs.b.valueId};`,preview:{data:{updatePreviewData:r=>({result:r.a&&r.b})}}}));C.addNodeDefinition(G.create(C,{id:"Or",category:"operator",inputs:{a:{nodeType:"value",dataType:"boolean"},b:{nodeType:"value",dataType:"boolean"}},outputs:{result:{nodeType:"value",dataType:"boolean"}},codeGenerator:r=>`const ${r.outputs.result.valueId} = ${r.inputs.a.valueId} || ${r.inputs.b.valueId};`,preview:{data:{updatePreviewData:r=>({result:r.a||r.b})}}}));C.addNodeDefinition(G.create(C,{id:"Not",category:"operator",inputs:{a:{nodeType:"value",dataType:"boolean"}},outputs:{result:{nodeType:"value",dataType:"boolean"}},codeGenerator:r=>`const ${r.outputs.result.valueId} = !${r.inputs.a.valueId};`,preview:{data:{updatePreviewData:r=>({result:!r.a})}}}));C.addNodeDefinition(G.create(C,{id:"Number to String",category:"type-conversion",inputs:{input:{nodeType:"value",dataType:"number"}},outputs:{output:{nodeType:"value",dataType:"string"}},codeGenerator:r=>`const ${r.outputs.output.valueId} = String(${r.inputs.input.valueId});`,preview:{data:{updatePreviewData:r=>({output:r.input.toString()})}}}));C.addNodeDefinition(G.create(C,{id:"String to Number",category:"type-conversion",inputs:{input:{nodeType:"value",dataType:"string"}},outputs:{output:{nodeType:"value",dataType:"number"}},codeGenerator:r=>`const ${r.outputs.output.valueId} = Number(${r.inputs.input.valueId});`,preview:{data:{updatePreviewData:r=>({output:parseFloat(r.input)||0})}}}));C.addNodeDefinition(G.create(C,{id:"Boolean to String",category:"type-conversion",inputs:{input:{nodeType:"value",dataType:"boolean"}},outputs:{output:{nodeType:"value",dataType:"string"}},codeGenerator:r=>`const ${r.outputs.output.valueId} = String(${r.inputs.input.valueId});`,preview:{data:{updatePreviewData:r=>({output:r.input.toString()})}}}));C.addNodeDefinition(G.create(C,{id:"If",category:"flow",inputs:{exec:{nodeType:"flow"},condition:{nodeType:"value",dataType:"boolean"}},outputs:{then:{nodeType:"flow"},else:{nodeType:"flow"}},codeGenerator:r=>`if (${r.inputs.condition.valueId}) {
${r.outputs.then.code}
} else {
${r.outputs.else.code}
}`,preview:{data:{updatePreviewData:r=>({then:r.condition,else:!r.condition})}}}));C.addNodeDefinition(G.create(C,{id:"While",category:"flow",inputs:{exec:{nodeType:"flow"},condition:{nodeType:"value",dataType:"boolean"}},outputs:{body:{nodeType:"flow"}},codeGenerator:r=>`while (${r.inputs.condition.valueId}) {
${r.outputs.body.code}
}`,preview:{data:{updatePreviewData:r=>({body:r.condition})}}}));C.addNodeDefinition(G.create(C,{id:"For Loop",category:"flow",inputs:{exec:{nodeType:"flow"},count:{nodeType:"value",dataType:"number"}},outputs:{exec:{nodeType:"flow"},index:{nodeType:"value",dataType:"number"}},codeGenerator:r=>`for (let ${r.outputs.index.valueId} = 0; ${r.outputs.index.valueId} < ${r.inputs.count.valueId}; ${r.outputs.index.valueId}++) {
${r.outputs.exec.code}
}`,preview:{data:{updatePreviewData:()=>({exec:!0,index:0})}}}));C.addNodeDefinition(G.create(C,{id:"Console Log",category:"function",inputs:{message:{nodeType:"value",dataType:"string"}},outputs:{},codeGenerator:({inputs:r})=>`console.log(${r.message.valueId});`,preview:{data:{updatePreviewData:()=>({})}}}));C.addNodeDefinition(G.create(C,{id:"String Concat",category:"function",inputs:{a:{nodeType:"value",dataType:"string"},b:{nodeType:"value",dataType:"string"}},outputs:{result:{nodeType:"value",dataType:"string"}},codeGenerator:r=>`const ${r.outputs.result.valueId} = ${r.inputs.a.valueId} + ${r.inputs.b.valueId};`,preview:{data:{updatePreviewData:r=>({result:r.a+r.b})}}}));C.setFunctionCodeGenerator(r=>{let e=r.inputs.map(n=>n.valueId).join(", "),t=r.outputs.length>0?`
    return ${r.outputs[0].valueId};`:"";return`function ${r.name}(${e}) {
${r.bodyCode}${t}
}`});C.setEntryPoint(new Po(C,{id:"pixelShader",label:"Pixel Shader",statics:{imports:!0,inputs:!1,outputs:!1},nodes:{static:[G.create(C,{id:"OnPixel",category:"event",inputs:{},outputs:{x:{nodeType:"value",dataType:"number"},y:{nodeType:"value",dataType:"number"}},codeGenerator:r=>`// Pixel coordinates
const ${r.outputs.x.valueId} = __pixel_x;
const ${r.outputs.y.valueId} = __pixel_y;`,preview:{data:{updatePreviewData:r=>({x:r.x??0,y:r.y??0})}}}),G.create(C,{id:"PixelResult",category:"output",inputs:{red:{nodeType:"value",dataType:"number"},green:{nodeType:"value",dataType:"number"},blue:{nodeType:"value",dataType:"number"}},outputs:{},codeGenerator:r=>`__pixel_r = ${r.inputs.red.valueId};
__pixel_g = ${r.inputs.green.valueId};
__pixel_b = ${r.inputs.blue.valueId};`,preview:{data:{updatePreviewData:()=>({})}}})]}}));C.setPreview(r=>{Zt=document.createElement("canvas"),Zt.width=100,Zt.height=100,Zt.style.cssText="width: 100px; height: 100px; image-rendering: pixelated; background: #000;",r.appendChild(Zt),Co=Zt.getContext("2d")},r=>{});Io=new vo(C);Io.appendTo(document.body);Io.file=new Nt;mi()});(()=>{let r=new WebSocket("ws://127.0.0.1:8088");r.addEventListener("open",()=>{console.log("Refresh connection established")}),r.addEventListener("message",e=>{console.log("Bundle finished. Start refresh"),e.data==="REFRESH"&&window.location.reload()})})();Promise.resolve().then(()=>tu());
//# sourceMappingURL=page.js.map
