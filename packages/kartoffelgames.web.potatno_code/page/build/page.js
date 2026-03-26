var Kc=Object.create;var Po=Object.defineProperty;var Xc=Object.getOwnPropertyDescriptor;var ui=(i,e)=>(e=Symbol[i])?e:Symbol.for("Symbol."+i),Et=i=>{throw TypeError(i)};var pi=(i,e,t)=>e in i?Po(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t;var ai=(i,e)=>Po(i,"name",{value:e,configurable:!0});var p=(i,e)=>()=>(i&&(e=i(i=0)),e);var k=i=>[,,,Kc(i?.[ui("metadata")]??null)],di=["class","method","getter","setter","accessor","field","value","get","set"],_t=i=>i!==void 0&&typeof i!="function"?Et("Function expected"):i,Wc=(i,e,t,n,o)=>({kind:di[i],name:e,metadata:n,addInitializer:r=>t._?Et("Already initialized"):o.push(_t(r||null))}),Zc=(i,e)=>pi(e,ui("metadata"),i[3]),u=(i,e,t,n)=>{for(var o=0,r=i[e>>1],s=r&&r.length;o<s;o++)e&1?r[o].call(t):n=r[o].call(t,n);return n},h=(i,e,t,n,o,r)=>{var s,a,l,c,m,d=e&7,y=!!(e&8),C=!!(e&16),G=d>3?i.length+1:d?y?1:2:0,x=di[d+5],b=d>3&&(i[G-1]=[]),E=i[G]||(i[G]=[]),A=d&&(!C&&!y&&(o=o.prototype),d<5&&(d>3||!C)&&Xc(d<4?o:{get[t](){return li(this,r)},set[t](W){return ci(this,r,W)}},t));d?C&&d<4&&ai(r,(d>2?"set ":d>1?"get ":"")+t):ai(o,t);for(var R=n.length-1;R>=0;R--)c=Wc(d,t,l={},i[3],E),d&&(c.static=y,c.private=C,m=c.access={has:C?W=>Yc(o,W):W=>t in W},d^3&&(m.get=C?W=>(d^1?li:_c)(W,o,d^4?r:A.get):W=>W[t]),d>2&&(m.set=C?(W,v)=>ci(W,o,v,d^4?r:A.set):(W,v)=>W[t]=v)),a=(0,n[R])(d?d<4?C?r:A[x]:d>4?void 0:{get:A.get,set:A.set}:o,c),l._=1,d^4||a===void 0?_t(a)&&(d>4?b.unshift(a):d?C?r=a:A[x]=a:o=a):typeof a!="object"||a===null?Et("Object expected"):(_t(s=a.get)&&(A.get=s),_t(s=a.set)&&(A.set=s),_t(s=a.init)&&b.unshift(s));return d||Zc(i,o),A&&Po(o,t,A),C?d^4?r:A:o},f=(i,e,t)=>pi(i,typeof e!="symbol"?e+"":e,t),Co=(i,e,t)=>e.has(i)||Et("Cannot "+t),Yc=(i,e)=>Object(e)!==e?Et('Cannot use the "in" operator on this value'):i.has(e),li=(i,e,t)=>(Co(i,e,"read from private field"),t?t.call(i):e.get(i)),N=(i,e,t)=>e.has(i)?Et("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(i):e.set(i,t),ci=(i,e,t,n)=>(Co(i,e,"write to private field"),n?n.call(i,t):e.set(i,t),t),_c=(i,e,t)=>(Co(i,e,"access private method"),t);var kt,xo=p(()=>{kt=class{mActiveFunctionId;mFunctions;get activeFunction(){return this.mFunctions.get(this.mActiveFunctionId)}get activeFunctionId(){return this.mActiveFunctionId}get functions(){return this.mFunctions}constructor(){this.mFunctions=new Map,this.mActiveFunctionId=""}addFunction(e){this.mFunctions.set(e.id,e),this.mActiveFunctionId||(this.mActiveFunctionId=e.id)}removeFunction(e){let t=this.mFunctions.get(e);if(!t||t.system)return!1;if(this.mFunctions.delete(e),this.mActiveFunctionId===e){let n=this.mFunctions.keys().next().value;this.mActiveFunctionId=n??""}return!0}setActiveFunction(e){return this.mFunctions.has(e)?(this.mActiveFunctionId=e,!0):!1}getFunction(e){return this.mFunctions.get(e)}}});var Xe,Nt,st=p(()=>{Xe=(y=>(y.Function="function",y.Operator="operator",y.Value="value",y.Flow="flow",y.Comment="comment",y.TypeConversion="type-conversion",y.Input="input",y.Output="output",y.Event="event",y.Reroute="reroute",y.GetLocal="getlocal",y.SetLocal="setlocal",y))(Xe||{}),Nt=class i{static META={function:{icon:"f",cssColor:"var(--pn-accent-blue)",label:"Function"},operator:{icon:"\xB1",cssColor:"var(--pn-accent-green)",label:"Operator"},value:{icon:"#",cssColor:"var(--pn-accent-peach)",label:"Value"},flow:{icon:"\u27F3",cssColor:"var(--pn-accent-mauve)",label:"Flow"},comment:{icon:"\u{1F4AC}",cssColor:"var(--pn-accent-yellow)",label:"Comment"},"type-conversion":{icon:"\u21C4",cssColor:"var(--pn-accent-teal)",label:"Type Conversion"},input:{icon:"\u2192",cssColor:"var(--pn-accent-green)",label:"Input"},output:{icon:"\u2190",cssColor:"var(--pn-accent-red)",label:"Output"},event:{icon:"\u26A1",cssColor:"var(--pn-accent-danger)",label:"Event"},reroute:{icon:"\u25C7",cssColor:"var(--pn-text-muted)",label:"Reroute"},getlocal:{icon:"\u2193",cssColor:"var(--pn-accent-teal)",label:"Get Local"},setlocal:{icon:"\u2191",cssColor:"var(--pn-accent-teal)",label:"Set Local"}};static get(e){return i.META[e]??{icon:"?",cssColor:"var(--pn-text-muted)",label:"Unknown"}}}});var Se,Io=p(()=>{Se=class{mData;mInteractionTrigger;mInteractionType;mOrigin;mStackError;get data(){return this.mData}get origin(){return this.mOrigin}get stacktrace(){return this.mStackError}get trigger(){return this.mInteractionTrigger}get type(){return this.mInteractionType}constructor(e,t,n,o){this.mInteractionType=e,this.mInteractionTrigger=t,this.mData=o,this.mStackError=new Error,this.mOrigin=n}toString(){return`${this.origin.name} -> ${this.type[this.trigger]} - ${this.data.toString()}`}}});var q,wo=p(()=>{q=class i extends Array{static newListWith(...e){let t=new i;return t.push(...e),t}clear(){this.splice(0,this.length)}clone(){return i.newListWith(...this)}distinct(){return i.newListWith(...new Set(this))}equals(e){if(this===e)return!0;if(!e||this.length!==e.length)return!1;for(let t=0;t<this.length;++t)if(this[t]!==e[t])return!1;return!0}remove(e){let t=this.indexOf(e);if(t!==-1)return this.splice(t,1)[0]}replace(e,t){let n=this.indexOf(e);if(n!==-1){let o=this[n];return this[n]=t,o}}toString(){return`[${super.join(", ")}]`}}});var g,Dt=p(()=>{g=class extends Error{mTarget;get target(){return this.mTarget}constructor(e,t,n){super(e,n),this.mTarget=t}}});var D,mi=p(()=>{wo();Dt();D=class i extends Map{add(e,t){if(!this.has(e))this.set(e,t);else throw new g("Can't add duplicate key to dictionary.",this)}clone(){return new i(this)}getAllKeysOfValue(e){return[...this.entries()].filter(o=>o[1]===e).map(o=>o[0])}getOrDefault(e,t){let n=this.get(e);return typeof n<"u"?n:t}map(e){let t=new q;for(let n of this){let o=e(n[0],n[1]);t.push(o)}return t}}});var we,hi=p(()=>{we=class i{mSize;mTopItem;get size(){return this.mSize}get top(){if(this.mTopItem)return this.mTopItem.value}constructor(){this.mTopItem=null,this.mSize=0}clone(){let e=new i;return e.mTopItem=this.mTopItem,e.mSize=this.mSize,e}*entries(){let e=this.mTopItem;for(;e!==null;)yield e.value,e=e.previous}flush(){let e=new Array;for(;this.mTopItem;)e.push(this.pop());return e}pop(){if(!this.mTopItem)return;let e=this.mTopItem.value;return this.mTopItem=this.mTopItem.previous,this.mSize--,e}push(e){let t={previous:this.mTopItem,value:e};this.mTopItem=t,this.mSize++}toArray(){return[...this.entries()]}}});var yi=p(()=>{});var gi=p(()=>{Dt()});var fi=p(()=>{});var bi=p(()=>{});var qt,Ti=p(()=>{qt=class{mCompareFunction;constructor(e){this.mCompareFunction=e}differencesOf(e,t){let n={1:{x:0,history:[]}},o=c=>c-1,r=e.length,s=t.length,a,l;for(let c=0;c<r+s+1;c++)for(let m=-c;m<c+1;m+=2){let d=m===-c||m!==c&&n[m-1].x<n[m+1].x;if(d){let C=n[m+1];l=C.x,a=C.history}else{let C=n[m-1];l=C.x+1,a=C.history}a=a.slice();let y=l-m;for(1<=y&&y<=s&&d?a.push({changeState:2,item:t[o(y)]}):1<=l&&l<=r&&a.push({changeState:1,item:e[o(l)]});l<r&&y<s&&this.mCompareFunction(e[o(l+1)],t[o(y+1)]);)l+=1,y+=1,a.push({changeState:3,item:e[o(l)]});if(l>=r&&y>=s)return a;n[m]={x:l,history:a}}return new Array}}});var vi=p(()=>{});var Eo=p(()=>{});var Pi=p(()=>{});var Rn=p(()=>{Dt()});var ko=p(()=>{Dt();Rn()});var xi=p(()=>{Eo();ko();Rn()});var S=p(()=>{mi();wo();hi();Dt();yi();gi();fi();bi();Ti();vi();Eo();Pi();ko();xi();Rn()});var We,No=p(()=>{We=class i{static mAsyncronErrorZones=new WeakMap;static mSynchronErrorZones=new WeakMap;static allocateAsyncronError(e,t){i.mAsyncronErrorZones.set(e,t)}static allocateSyncronError(e,t){let n=typeof e=="object"&&e!==null?e:new Error(e);return i.mSynchronErrorZones.set(n,t),n}static getAsyncronErrorZone(e){return i.mAsyncronErrorZones.get(e)}static getSyncronErrorZone(e){return i.mSynchronErrorZones.get(e)}}});var On,Ii=p(()=>{S();No();Do();On=class i{static enable(e){if(e.target.globalPatched)return!1;e.target.globalPatched=!0;let t=e.target,n=new i;{let o=e.patches.requirements.promise;t[o]=n.patchPromise(t[o]);let r=e.patches.requirements.eventTarget;t[r]=n.patchEventTarget(t[r])}n.patchOnEvents(t);for(let o of e.patches.functions??[])t[o]=n.patchFunctionCallbacks(t[o]);if(!e.patches.classes)return!0;for(let o of e.patches.classes.callback??[]){let r=t[o];r=n.patchClass(r),t[o]=r}for(let o of e.patches.classes.eventTargets??[]){let r=t[o];n.patchOnEvents(r.prototype)}return!0}callInZone(e,t){return function(...n){return t.execute(()=>e(...n))}}patchClass(e){if(typeof e!="function")return e;let t=this,n=class extends e{constructor(...o){let r=$.current;for(let s=0;s<o.length;s++){let a=o[s];typeof a=="function"&&(o[s]=t.callInZone(t.patchFunctionCallbacks(a),r))}super(...o)}};return this.patchMethods(n),n}patchEventTarget(e){let t=e.prototype,n=this,o=new WeakMap,r=t.addEventListener,s=t.removeEventListener;return Object.defineProperty(t,"addEventListener",{configurable:!1,writable:!1,value:function(a,l,c){if(l===null||typeof l!="function"&&!(typeof l=="object"&&"handleEvent"in l)){r.call(this,a,l,c);return}let m=o.get(l);if(!m){let d=$.current;typeof l=="function"?m=n.callInZone(l,d):m=n.callInZone(l.handleEvent.bind(l),d)}o.set(l,m),r.call(this,a,m,c)}}),Object.defineProperty(t,"removeEventListener",{configurable:!1,writable:!1,value:function(a,l,c){if(l===null||typeof l!="function"&&!(typeof l=="object"&&"handleEvent"in l)){s.call(this,a,l,c);return}let m=o.get(l)??l;s.call(this,a,m,c)}}),e}patchFunctionCallbacks(e){let t=this;return function(...n){let o=$.current;for(let r=0;r<n.length;r++){let s=n[r];typeof s=="function"&&(n[r]=t.callInZone(t.patchFunctionCallbacks(s),o))}return o.execute(()=>e.call(this,...n))}}patchMethods(e){if(typeof e!="function")return e;let t=r=>{if(r===null||r.constructor===Object)return new D;let s=new D;for(let a of Object.getOwnPropertyNames(r)){if(a==="constructor")continue;let l=Object.getOwnPropertyDescriptor(r,a);l&&typeof l.value=="function"&&s.set(a,l)}for(let[a,l]of t(Object.getPrototypeOf(r)))s.has(a)||s.set(a,l);return s},n=e.prototype,o=t(n);for(let[r,s]of o)s.configurable&&(s.value=this.patchFunctionCallbacks(s.value),Object.defineProperty(n,r,s))}patchOnEvents(e){if(!e||!(e instanceof EventTarget))return;let t=o=>{if(o===null)return new D;let r=new D;for(let s of Object.getOwnPropertyNames(o)){if(!s.startsWith("on"))continue;let a=Object.getOwnPropertyDescriptor(o,s);a&&typeof a.value!="function"&&r.set(s.substring(2),a)}for(let[s,a]of t(Object.getPrototypeOf(o)))r.has(s)||r.set(s,a);return r},n=t(e);for(let[o,r]of n){if(!r.configurable)continue;let s=`on${o}`;delete r.writable,delete r.value;let a=new WeakMap;r.set=function(l){let c=a.get(this);(typeof c=="function"||typeof c=="object")&&this.removeEventListener(o,c),a.set(this,l),(typeof l=="function"||typeof l=="object")&&this.addEventListener(o,l)},r.get=function(){return a.get(this)},Object.defineProperty(e,s,r)}}patchPromise(e){let t=e;class n extends t{constructor(r){super(r),We.allocateAsyncronError(this,$.current)}}return this.patchMethods(n),n}}});var $,Do=p(()=>{S();No();Io();Ii();$=class i{static mCurrentZone=new i("Default",null,!0);static get current(){return i.mCurrentZone}static enableGlobalTracing(e){if(!On.enable(e))return!1;if(!e.errorHandling)return!0;let t=e.target;if(!("addEventListener"in t)||typeof t.addEventListener!="function")throw new g("Global scope does not support addEventListener",i);let n=(o,r,s)=>{s&&s.callErrorListener(r)&&o.preventDefault()};return t.addEventListener("error",o=>{typeof o.error!="object"||o.error===null||n(o,o.error,We.getSyncronErrorZone(o.error))}),t.addEventListener("unhandledrejection",o=>{n(o,o.reason,We.getAsyncronErrorZone(o.promise))}),!0}static pushInteraction(e,t,n){if(((this.mCurrentZone.mTriggerMapping.get(e)??-1)&t)===0)return!1;let r=new Se(e,t,this.mCurrentZone,n);return this.mCurrentZone.callInteractionListener(r)}mAttachments;mErrorListener;mInteractionListener;mIsolated;mName;mParent;mTriggerMapping;get name(){return this.mName}get parent(){return this.mParent}constructor(e,t,n){this.mAttachments=new Map,this.mErrorListener=new D,this.mName=e,this.mTriggerMapping=new D,this.mInteractionListener=new D,this.mParent=t,this.mIsolated=n}addErrorListener(e){return this.mErrorListener.set(e,i.current),this}addInteractionListener(e,t){return this.mInteractionListener.has(e)||this.mInteractionListener.set(e,new D),this.mInteractionListener.get(e).set(t,i.current),this}addTriggerRestriction(e,t){return this.mTriggerMapping.set(e,t),this}attachment(e,t){if(typeof t<"u")return this.mAttachments.set(e,t),t;let n=this.mAttachments.get(e);if(typeof n<"u")return n;if(!this.mIsolated)return this.mParent.attachment(e)}create(e,t){return new i(e,this,t?.isolate===!0)}execute(e,...t){let n=i.mCurrentZone;i.mCurrentZone=this;let o;try{o=e(...t)}catch(r){throw We.allocateSyncronError(r,i.mCurrentZone)}finally{i.mCurrentZone=n}return o}removeErrorListener(e){return this.mErrorListener.delete(e),this}removeInteractionListener(e,t){if(!t)return this.mInteractionListener.delete(e),this;let n=this.mInteractionListener.get(e);return n?(n.delete(t),this):this}callErrorListener(e){return this.execute(()=>{for(let[n,o]of this.mErrorListener.entries())if(o.execute(()=>n.call(this,e))===!1)return!0;return!1})?!0:this.mIsolated?!1:this.parent.callErrorListener(e)}callInteractionListener(e){if(((this.mTriggerMapping.get(e.type)??-1)&e.trigger)===0)return!1;let n=this.mInteractionListener.get(e.type);return n&&n.size>0&&this.execute(()=>{for(let[o,r]of n.entries())r.execute(()=>{o.call(this,e)})}),this.mIsolated?!0:this.parent.callInteractionListener(e)}}});var Jt=p(()=>{Io();Do()});var ae,At=p(()=>{S();ae=class i{static mComponents=new WeakMap;static mConstructorSelector=new WeakMap;static mElements=new WeakMap;static ofComponent(e){let t=e.processorConstructor,n=i.mConstructorSelector.get(t);if(!n)throw new g(`Constructor "${t.name}" is not a registered custom element`,t);let o=i.mElements.get(e);if(!o)throw new g(`Component "${e}" is not a registered component`,e);let r;return e.isProcessorCreated&&(r=e.processor),{selector:n,constructor:t,element:o,component:e}}static ofConstructor(e){let t=i.mConstructorSelector.get(e);if(!t)throw new g(`Constructor "${e.name}" is not a registered custom element`,e);let n=globalThis.customElements.get(t);if(!n)throw new g(`Constructor "${e.name}" is not a registered custom element`,e);return{selector:t,constructor:e,elementConstructor:n}}static ofElement(e){let t=i.mComponents.get(e);if(!t)throw new g(`Element "${e}" is not a PwbComponent.`,e);return i.ofComponent(t)}static ofProcessor(e){let t=i.mComponents.get(e);if(!t)throw new g("Processor is not a PwbComponent.",e);return i.ofComponent(t)}static registerComponent(e,t,n){i.mComponents.has(t)||i.mComponents.set(t,e),n&&!i.mComponents.has(n)&&i.mComponents.set(n,e),i.mElements.has(e)||i.mElements.set(e,t)}static registerConstructor(e,t){e&&!i.mConstructorSelector.has(e)&&i.mConstructorSelector.set(e,t)}}});var St=p(()=>{});var Ge,Gn=p(()=>{St();Ge=class i{static DEFAULT=(()=>{let e=new i;return e.mSpashscreenConfiguration.background="blue",e.mSpashscreenConfiguration.content="",e.mSpashscreenConfiguration.manual=!1,e.mSpashscreenConfiguration.animationTime=1e3,e.mErrorConfiguration.ignore=!1,e.mErrorConfiguration.print=!0,e.mLoggingConfiguration.filter=7,e.mLoggingConfiguration.updatePerformance=!1,e.mLoggingConfiguration.updaterTrigger=!1,e.mLoggingConfiguration.updateReshedule=!1,e.mUpdatingConfiguration.frameTime=100,e.mUpdatingConfiguration.stackCap=10,e})();mErrorConfiguration;mLoggingConfiguration;mSpashscreenConfiguration;mUpdatingConfiguration;get error(){return this.mErrorConfiguration}get logging(){return this.mLoggingConfiguration}get splashscreen(){return this.mSpashscreenConfiguration}get updating(){return this.mUpdatingConfiguration}constructor(){this.mSpashscreenConfiguration={background:i.DEFAULT?.mSpashscreenConfiguration.background,content:i.DEFAULT?.mSpashscreenConfiguration.content,manual:i.DEFAULT?.mSpashscreenConfiguration.manual,animationTime:i.DEFAULT?.mSpashscreenConfiguration.animationTime},this.mErrorConfiguration={ignore:i.DEFAULT?.mErrorConfiguration.ignore,print:i.DEFAULT?.mErrorConfiguration.print},this.mLoggingConfiguration={filter:i.DEFAULT?.mLoggingConfiguration.filter,updatePerformance:i.DEFAULT?.mLoggingConfiguration.updatePerformance,updaterTrigger:i.DEFAULT?.mLoggingConfiguration.updaterTrigger,updateReshedule:i.DEFAULT?.mLoggingConfiguration.updateReshedule},this.mUpdatingConfiguration={frameTime:i.DEFAULT?.mUpdatingConfiguration.frameTime,stackCap:i.DEFAULT?.mUpdatingConfiguration.stackCap}}print(e,...t){(e&this.mLoggingConfiguration.filter)!==0&&console.log(...t)}}});var at,wi=p(()=>{Jt();At();Gn();at=class i{static CONFIGURATION_ATTACHMENT=Symbol("PwbApplicationConfigurationAttachment");static new(e,t,n){let o=new Ge,r=new i(e,o);t(r),n&&r.appendTo(n)}mConfiguration;mElement;mInteractionZone;get configuration(){return this.mConfiguration}constructor(e,t){this.mInteractionZone=$.current.create(`App-${e}`,{isolate:!0}),this.mInteractionZone.attachment(i.CONFIGURATION_ATTACHMENT,t),this.mConfiguration=t,this.mElement=document.createElement("div"),this.mElement.attachShadow({mode:"open"})}addContent(e){let t=ae.ofConstructor(e).elementConstructor;return this.mInteractionZone.execute(()=>{let n=ae.ofElement(new t);return this.mElement.shadowRoot.appendChild(n.element),n.component.processor})}addErrorListener(e){this.mInteractionZone.addErrorListener(e)}addStyle(e){let t=document.createElement("style");t.textContent=e,this.mElement.shadowRoot.prepend(t)}appendTo(e){e.appendChild(this.mElement)}}});var Lt,Ao=p(()=>{S();Lt=class{mCustomMetadata;constructor(){this.mCustomMetadata=new D}getMetadata(e){return this.mCustomMetadata.get(e)??null}setMetadata(e,t){this.mCustomMetadata.set(e,t)}}});var Qt,So=p(()=>{Ao();Qt=class extends Lt{}});var en,Lo=p(()=>{S();Ao();So();en=class i extends Lt{static mPrivateMetadataKey=Symbol("Metadata");mDecoratorMetadataObject;mPropertyMetadata;constructor(e){super(),this.mDecoratorMetadataObject=e,this.mPropertyMetadata=new D,e[i.mPrivateMetadataKey]=this}getInheritedMetadata(e){let t=new Array,n=this.mDecoratorMetadataObject;do{if(Object.hasOwn(n,i.mPrivateMetadataKey)){let r=n[i.mPrivateMetadataKey].getMetadata(e);r!==null&&t.push(r)}n=Object.getPrototypeOf(n)}while(n!==null);return t.reverse()}getProperty(e){return this.mPropertyMetadata.has(e)||this.mPropertyMetadata.add(e,new Qt),this.mPropertyMetadata.get(e)}}});var le,Mo=p(()=>{S();Lo();Symbol.metadata??=Symbol("Symbol.metadata");le=class i{static mMetadataMapping=new D;static add(e,t){return(n,o)=>{let r=i.forInternalDecorator(o.metadata);switch(o.kind){case"class":r.setMetadata(e,t);return;case"method":case"field":case"getter":case"setter":case"accessor":if(o.static)throw new Error("@Metadata.add not supported for statics.");r.getProperty(o.name).setMetadata(e,t);return}}}static forInternalDecorator(e){return i.mapMetadata(e)}static get(e){Object.hasOwn(e,Symbol.metadata)||i.polyfillMissingMetadata(e);let t=e[Symbol.metadata];return i.mapMetadata(t)}static init(){return(e,t)=>{i.forInternalDecorator(t.metadata)}}static mapMetadata(e){if(i.mMetadataMapping.has(e))return i.mMetadataMapping.get(e);let t=new en(e);return i.mMetadataMapping.set(e,t),t}static polyfillMissingMetadata(e){let t=new Array,n=e;do t.push(n),n=Object.getPrototypeOf(n);while(n!==null);for(let o=t.length-1;o>=0;o--){let r=t[o];if(!Object.hasOwn(r,Symbol.metadata)){let s=null;o<t.length-2&&(s=t[o+1][Symbol.metadata]),r[Symbol.metadata]=Object.create(s,{})}}}}});var P,Ei=p(()=>{S();Mo();P=class i{static mCurrentInjectionContext=null;static mInjectMode=new D;static mInjectableConstructor=new D;static mInjectableReplacement=new D;static mInjectionConstructorIdentificationMetadataKey=Symbol("InjectionConstructorIdentification");static mSingletonMapping=new D;static createObject(e,t,n){let[o,r]=typeof t=="object"&&t!==null?[!1,t]:[!!t,n??new D],s=i.getInjectionIdentification(e);if(!i.mInjectableConstructor.has(s))throw new g(`Constructor "${e.name}" is not registered for injection and can not be built`,i);let a=o?"instanced":i.mInjectMode.get(s),l=new D(r.map((d,y)=>[i.getInjectionIdentification(d),y])),c=i.mCurrentInjectionContext,m=new D([...c?.localInjections.entries()??[],...l.entries()]);i.mCurrentInjectionContext={injectionMode:a,localInjections:m};try{if(!o&&a==="singleton"&&i.mSingletonMapping.has(s))return i.mSingletonMapping.get(s);let d=new e;return a==="singleton"&&!i.mSingletonMapping.has(s)&&i.mSingletonMapping.add(s,d),d}finally{i.mCurrentInjectionContext=c}}static injectable(e="instanced"){return(t,n)=>{i.registerInjectable(t,n.metadata,e)}}static registerInjectable(e,t,n){let o=i.getInjectionIdentification(e,t);i.mInjectableConstructor.add(o,e),i.mInjectMode.add(o,n)}static replaceInjectable(e,t){let n=i.getInjectionIdentification(e);if(!i.mInjectableConstructor.has(n))throw new g("Original constructor is not registered.",i);let o=i.getInjectionIdentification(t);if(!i.mInjectableConstructor.has(o))throw new g("Replacement constructor is not registered.",i);i.mInjectableReplacement.set(n,t)}static use(e){if(i.mCurrentInjectionContext===null)throw new g("Can't create object outside of an injection context.",i);let t=i.getInjectionIdentification(e);if(i.mCurrentInjectionContext.injectionMode!=="singleton"&&i.mCurrentInjectionContext.localInjections.has(t))return i.mCurrentInjectionContext.localInjections.get(t);let n=i.mInjectableReplacement.get(t);if(n||(n=i.mInjectableConstructor.get(t)),!n)throw new g(`Constructor "${e.name}" is not registered for injection and can not be built`,i);return i.createObject(n)}static getInjectionIdentification(e,t){let n=t?le.forInternalDecorator(t):le.get(e),o=n.getMetadata(i.mInjectionConstructorIdentificationMetadataKey);return o||(o=Symbol(e.name),n.setMetadata(i.mInjectionConstructorIdentificationMetadataKey,o)),o}}});var Z=p(()=>{Ei();Mo();Lo();So()});var Ro=p(()=>{});var Le=p(()=>{});var H,re=p(()=>{H=(a=>(a[a.None=0]="None",a[a.PropertySet=4]="PropertySet",a[a.PropertyDelete=8]="PropertyDelete",a[a.UntrackableFunctionCall=16]="UntrackableFunctionCall",a[a.Manual=32]="Manual",a[a.InputChange=64]="InputChange",a[a.Any=127]="Any",a))(H||{})});var ye,Mt=p(()=>{Jt();re();ye=class i{static IGNORED_CLASSES=(()=>{let e=new WeakSet;return e.add(i),e.add($),e.add(Se),e})();static ORIGINAL_TO_INTERACTION_MAPPING=new WeakMap;static PROXY_TO_ORIGINAL_MAPPING=new WeakMap;static UNTRACEABLE_FUNCTION_UPDATE_TRIGGER=(()=>{let e=new WeakMap;return e.set(Array.prototype.fill,4),e.set(Array.prototype.pop,8),e.set(Array.prototype.push,4),e.set(Array.prototype.shift,8),e.set(Array.prototype.unshift,4),e.set(Array.prototype.splice,4),e.set(Array.prototype.reverse,4),e.set(Array.prototype.sort,4),e.set(Array.prototype.concat,4),e.set(Map.prototype.clear,8),e.set(Map.prototype.delete,8),e.set(Map.prototype.set,4),e.set(Set.prototype.clear,8),e.set(Set.prototype.delete,8),e.set(Set.prototype.add,4),e})();static createCoreEntityCreationData(e,t){return{source:e,property:t,toString:function(){let n=typeof this.source;return"constructor"in this.source&&(n=this.source.constructor.name),this.property?`[ ${n} => ${this.property.toString()} ]`:`[ ${n} ]`}}}static getOriginal(e){return i.PROXY_TO_ORIGINAL_MAPPING.get(e)??e}static ignoreClass(e){i.IGNORED_CLASSES.add(e)}static getWrapper(e){let t=i.getOriginal(e);return i.ORIGINAL_TO_INTERACTION_MAPPING.get(t)}mListenerZones;mProxyObject;get proxy(){return this.mProxyObject}constructor(e){let t=i.getWrapper(e);if(t)return t;this.mListenerZones=new Set,i.IGNORED_CLASSES.has(Object.getPrototypeOf(e)?.constructor)?this.mProxyObject=e:this.mProxyObject=this.createProxyObject(e),i.PROXY_TO_ORIGINAL_MAPPING.set(this.mProxyObject,e),i.ORIGINAL_TO_INTERACTION_MAPPING.set(e,this)}addListenerZone(e){this.mListenerZones.has(e)||this.mListenerZones.add(e)}convertToProxy(e){if(e===null||typeof e!="object"&&typeof e!="function")return e;let t=new i(e);for(let n of this.mListenerZones)t.addListenerZone(n);return t.proxy}createProxyObject(e){let t=(o,r,s)=>{let a=i.getOriginal(r);try{let l=o.call(a,...s);return this.convertToProxy(l)}finally{i.UNTRACEABLE_FUNCTION_UPDATE_TRIGGER.has(o)?this.dispatch(i.UNTRACEABLE_FUNCTION_UPDATE_TRIGGER.get(o),r):this.dispatch(16,this.mProxyObject)}};return new Proxy(e,{apply:(o,r,s)=>{this.addListenerZone($.current);let a=o;try{let l=a.call(r,...s);return this.convertToProxy(l)}catch(l){if(!(l instanceof TypeError))throw l;return t(a,r,s)}},set:(o,r,s)=>{this.addListenerZone($.current);try{let a=s;return(a!==null&&typeof a=="object"||typeof a=="function")&&(a=i.getOriginal(a)),Reflect.set(o,r,a)}finally{this.dispatch(4,this.mProxyObject,r)}},get:(o,r,s)=>{this.addListenerZone($.current);let a=Reflect.get(o,r);return this.convertToProxy(a)},deleteProperty:(o,r)=>{this.addListenerZone($.current);try{return delete o[r]}finally{this.dispatch(8,this.mProxyObject,r)}}})}dispatch(e,t,n){if($.pushInteraction(H,e,i.createCoreEntityCreationData(t,n)))for(let r of this.mListenerZones)r.execute(()=>{$.pushInteraction(H,e,i.createCoreEntityCreationData(t,n))})}}});var w,ce=p(()=>{Mt();w=class i{static mEnableTrackingOnConstruction=!1;static enableTrackingOnConstruction(e){let t=i.mEnableTrackingOnConstruction;i.mEnableTrackingOnConstruction=!0;try{return e()}finally{i.mEnableTrackingOnConstruction=t}}constructor(){if(i.mEnableTrackingOnConstruction)return new ye(this).proxy}}});function ki(){return i=>{ye.ignoreClass(i)}}var Ni=p(()=>{Mt()});var Ze,Di=p(()=>{Ze=class i{static mCurrentUpdateCycle=null;static openResheduledCycle(e,t){let n=!1;if(!i.mCurrentUpdateCycle){let o=performance.now();i.mCurrentUpdateCycle={initiator:e.initiator,timeStamp:o,startTime:o,forcedSync:e.forcedSync,runner:e.runner},n=!0}try{return t(i.mCurrentUpdateCycle)}finally{n&&(i.mCurrentUpdateCycle=null)}}static openUpdateCycle(e,t){let n=!1;if(!i.mCurrentUpdateCycle){let o=performance.now();i.mCurrentUpdateCycle={initiator:e.updater,timeStamp:o,startTime:o,forcedSync:e.runSync,runner:{id:Symbol("Runner "+o),timestamp:o}},n=!0}try{return t(i.mCurrentUpdateCycle)}finally{n&&(i.mCurrentUpdateCycle=null)}}static updateCycleRunId(e,t){if(e.initiator===t){let n=performance.now(),o=e;o.runner={id:Symbol("Runner "+n),timestamp:n}}}static updateCyleStartTime(e){let t=performance.now(),n=e;n.startTime=t}}});var jn,Ai=p(()=>{jn=class extends Error{mChain;get chain(){return this.mChain}constructor(e,t){let n=t.slice(-20).map(o=>o.toString()).join(`
`);super(`${e}: 
${n}`),this.mChain=[...t]}}});var Rt,Si=p(()=>{Rt=class extends Error{constructor(){super("Update resheduled")}}});var Li,Oo,lt,Mi=p(()=>{S();Jt();St();re();Mt();Ni();Di();Ai();Si();Li=[ki()];lt=class{mApplicationContext;mInteractionZone;mLoggingType;mRegisteredObjects;mUpdateFunction;mUpdateRunCache;mUpdateStates;get zone(){return this.mInteractionZone}constructor(e){this.mUpdateRunCache=new WeakMap,this.mRegisteredObjects=new WeakMap,this.mUpdateFunction=e.onUpdate,this.mApplicationContext=e.applicationContext,this.mLoggingType=e.loggingType;let t=e.parent?.mInteractionZone??$.current,n=Math.floor(Math.random()*16777215).toString(16);this.mInteractionZone=t.create(`${e.label}-ProcessorZone (${n})`,{isolate:e.isolate}).addTriggerRestriction(H,e.trigger),this.mUpdateStates={chainCompleteHooks:new we,async:{hasSheduledTask:!1,hasRunningTask:!1,sheduledTaskIsResheduled:!1},sync:{running:!1},cycle:{chainedTask:null}}}addUpdateTrigger(e){this.mInteractionZone.addInteractionListener(H,t=>{(e&e)!==0&&this.runUpdateAsynchron(t,null)})}deconstruct(){this.mInteractionZone.removeInteractionListener(H)}registerObject(e){if(this.mRegisteredObjects.has(e))return this.mRegisteredObjects.get(e).proxy;if(e instanceof EventTarget)for(let n of["input","change"])this.mInteractionZone.execute(()=>{e.addEventListener(n,()=>{$.pushInteraction(H,64,ye.createCoreEntityCreationData(e,n))})});let t=new ye(e);return this.mRegisteredObjects.set(e,t),this.mRegisteredObjects.set(t.proxy,t),t.proxy}async resolveAfterUpdate(){return this.mUpdateStates.async.hasSheduledTask?new Promise((e,t)=>{this.mUpdateStates.chainCompleteHooks.push((n,o)=>{o?t(o):e(n)})}):!1}switchToUpdateZone(e){return this.mInteractionZone.execute(e)}update(){let e=new Se(H,32,this.mInteractionZone,ye.createCoreEntityCreationData(this,Symbol("Manual Update")));return this.runUpdateSynchron(e)}updateAsync(){let e=new Se(H,32,this.mInteractionZone,ye.createCoreEntityCreationData(this,Symbol("Manual Update")));this.runUpdateAsynchron(e,null)}executeTaskChain(e,t,n,o){if(o.size>this.mApplicationContext.updating.stackCap)throw new jn("Call loop detected",o.toArray());let r=performance.now();if(!t.forcedSync&&r-t.startTime>this.mApplicationContext.updating.frameTime)throw new Rt;o.push(e);let s=this.mInteractionZone.execute(()=>this.mUpdateFunction.call(this,e))||n;if(this.mApplicationContext.logging.updatePerformance){let l=performance.now();this.mApplicationContext.print(this.mLoggingType,"Update performance:",this.mInteractionZone.name,`
	`,"Cycle:",l-t.timeStamp,"ms",`
	`,"Runner:",l-t.runner.timestamp,"ms",`
	`,"  ","Id:",t.runner.id.toString(),`
	`,"Update:",l-r,"ms",`
	`,"  ","State:",s,`
	`,"  ","Chain: ",o.toArray().map(c=>c.toString()))}if(Ze.updateCycleRunId(t,this),!this.mUpdateStates.cycle.chainedTask)return s;let a=this.mUpdateStates.cycle.chainedTask;return this.mUpdateStates.cycle.chainedTask=null,this.executeTaskChain(a,t,s,o)}releaseUpdateChainCompleteHooks(e,t){if(!this.mUpdateStates.chainCompleteHooks.top)return;let n;for(;n=this.mUpdateStates.chainCompleteHooks.pop();)n(e,t)}runUpdateAsynchron(e,t){if(this.mUpdateStates.async.hasRunningTask||this.mUpdateStates.async.sheduledTaskIsResheduled){this.mUpdateStates.cycle.chainedTask=e;return}if(this.mUpdateStates.async.hasSheduledTask)return;let n=o=>{this.mUpdateStates.async.hasRunningTask=!0,this.mUpdateStates.async.hasSheduledTask=!1,this.mUpdateStates.async.sheduledTaskIsResheduled=!1;let r=!1;try{this.runUpdateSynchron(e)}catch(s){s instanceof Rt&&o.initiator===this&&(this.mApplicationContext.logging.updateReshedule&&this.mApplicationContext.print(this.mLoggingType,"Reshedule:",this.mInteractionZone.name,`
	`,"Cycle Performance",performance.now()-o.timeStamp,`
	`,"Runner Id:",o.runner.id.toString()),r=!0)}finally{this.mUpdateStates.async.hasRunningTask=!1}r&&this.runUpdateAsynchron(e,o)};this.mUpdateStates.async.hasSheduledTask=!0,t&&(this.mUpdateStates.async.sheduledTaskIsResheduled=!0),globalThis.requestAnimationFrame(()=>{t?Ze.openResheduledCycle(t,n):Ze.openUpdateCycle({updater:this,reason:e,runSync:!1},n)})}runUpdateSynchron(e){if(this.mApplicationContext.logging.updaterTrigger&&this.mApplicationContext.print(this.mLoggingType,"Update trigger:",this.mInteractionZone.name,`
	`,"Trigger:",e.toString(),`
	`,"Chained:",this.mUpdateStates.sync.running,`
	`,"Omitted:",!!this.mUpdateStates.cycle.chainedTask),this.mUpdateStates.sync.running)return this.mUpdateStates.cycle.chainedTask=e,!1;this.mUpdateStates.sync.running=!0;try{let t=Ze.openUpdateCycle({updater:this,reason:e,runSync:!0},n=>{if(this.mUpdateRunCache.has(n.runner))return Ze.updateCyleStartTime(n),this.mUpdateRunCache.get(n.runner);let o=this.executeTaskChain(e,n,!1,new we);return this.mUpdateRunCache.set(n.runner,o),o});return this.releaseUpdateChainCompleteHooks(t),t}catch(t){if(t instanceof Rt)throw t;let n=t;if(t&&this.mApplicationContext.error.print&&this.mApplicationContext.print(7,t),this.mApplicationContext.error.ignore&&(this.mApplicationContext.print(this.mLoggingType,t),n=null),this.releaseUpdateChainCompleteHooks(!1,n),n)throw t;return!1}finally{this.mUpdateStates.sync.running=!1}}};Oo=k(null),lt=h(Oo,0,"CoreEntityUpdater",Li,lt),u(Oo,1,lt)});var je,Bn=p(()=>{S();Z();Mt();ce();Mi();je=class{mApplicationContext;mHooks;mInjections;mIsLocked;mIsSetup;mProcessor;mProcessorConstructor;mTrackChanges;mUpdater;get applicationContext(){return this.mApplicationContext}get isProcessorCreated(){return!!this.mProcessor}get processor(){if(!this.mIsSetup)throw new g("Processor can not be build before calling setup.",this);return this.isProcessorCreated||(this.mProcessor=this.createProcessor()),this.mProcessor}get processorConstructor(){return this.mProcessorConstructor}constructor(e){if(!(e.constructor.prototype instanceof w))throw new g(`Constructor "${e.constructor.name}" does not extend`,this);if(this.mApplicationContext=e.applicationContext,this.mProcessorConstructor=e.constructor,this.mProcessor=null,this.mIsLocked=!1,this.mIsSetup=!1,this.mTrackChanges=e.trackConstructorChanges,this.mInjections=new D,this.mHooks={create:new we,setup:new we},e.parent)for(let[t,n]of e.parent.mInjections.entries())this.setProcessorAttributes(t,n);this.mUpdater=new lt({applicationContext:e.applicationContext,label:e.constructor.name,loggingType:e.loggingType,isolate:!!e.isolate,trigger:e.trigger,parent:e.parent?.mUpdater,onUpdate:()=>this.mIsSetup?this.onUpdate():!1})}call(e,t,...n){if(!this.isProcessorCreated&&!t)return null;let o=Reflect.get(this.processor,e);return typeof o!="function"?null:this.mUpdater.switchToUpdateZone(()=>o.apply(this.processor,n))}deconstruct(){this.mUpdater.deconstruct()}getProcessorAttribute(e){return this.mInjections.get(e)}registerObject(e){return this.mUpdater.registerObject(e)}setProcessorAttributes(e,t){if(this.mIsLocked)throw new g("Cant add injections to after construction.",this);this.mInjections.set(e,t)}setup(){if(this.mIsSetup)throw new g("Setup allready called.",this);this.mIsSetup=!0;let e;for(;e=this.mHooks.setup.pop();)e.apply(this);return this}update(){return this.mUpdater.update()}updateAsync(){this.mUpdater.updateAsync()}async waitForUpdate(){return this.mUpdater.resolveAfterUpdate()}addCreationHook(e){return this.mHooks.create.push(e),this}addSetupHook(e){return this.mHooks.setup.push(e),this}setAutoUpdate(e){this.mUpdater.addUpdateTrigger(e)}createProcessor(){this.mIsLocked=!0;let e=this.mUpdater.switchToUpdateZone(()=>this.mTrackChanges?w.enableTrackingOnConstruction(()=>P.createObject(this.mProcessorConstructor,this.mInjections)):P.createObject(this.mProcessorConstructor,this.mInjections));e=ye.getOriginal(e);let t;for(;t=this.mHooks.create.pop();){let n=t.call(this,e);n&&(e=n)}return e}}});var Ye,Vn=p(()=>{St();Bn();Ye=class i extends je{constructor(e,t,n,o){super({applicationContext:e,constructor:t,loggingType:4,parent:n,isolate:!1,trigger:o,trackConstructorChanges:!1}),this.setProcessorAttributes(i,this),this.addSetupHook(()=>{this.call("onExecute",!1)}).addSetupHook(()=>{let r=this.processor})}deconstruct(){this.call("onDeconstruct",!1),super.deconstruct()}onUpdate(){return!1}}});var Fo,ge,ct=p(()=>{S();Bn();Fo=class i{static mInstance;mCoreEntityConstructor;mProcessorConstructorConfiguration;constructor(){if(i.mInstance)return i.mInstance;i.mInstance=this,this.mCoreEntityConstructor=new D,this.mProcessorConstructorConfiguration=new D}get(e){let t=this.mCoreEntityConstructor.get(e);if(!t)return new Array;let n=new Array;for(let o of t)n.push({processorConstructor:o,processorConfiguration:this.mProcessorConstructorConfiguration.get(o)});return n}register(e,t,n){this.mProcessorConstructorConfiguration.set(t,n);let o=e;do{if(!(o.prototype instanceof je)&&o!==je)break;this.mCoreEntityConstructor.has(o)||this.mCoreEntityConstructor.set(o,new Set),this.mCoreEntityConstructor.get(o).add(t)}while(o=Object.getPrototypeOf(o))}},ge=new Fo});var Ot,Go=p(()=>{Le();Vn();Bn();ct();Ot=class i extends je{static mExtensionCache=new WeakMap;mExtensionList;constructor(e){super(e),this.mExtensionList=new Array,this.addSetupHook(()=>{this.executeExtensions()})}deconstruct(){for(let e of this.mExtensionList)e.deconstruct();super.deconstruct()}executeExtensions(){let e=(()=>{let n=i.mExtensionCache.get(this.processorConstructor);if(n)return n;let r=ge.get(Ye).filter(a=>{for(let l of a.processorConfiguration.targetRestrictions)if(this instanceof l||this.processorConstructor.prototype instanceof l||this.processorConstructor===l)return!0;return!1}),s={read:r.filter(a=>a.processorConfiguration.access===1),write:r.filter(a=>a.processorConfiguration.access===3),readWrite:r.filter(a=>a.processorConfiguration.access===2)};return i.mExtensionCache.set(this.processorConstructor,s),s})(),t=[...e.write,...e.readWrite,...e.read];for(let n of t){let o=new Ye(this.applicationContext,n.processorConstructor,this,n.processorConfiguration.trigger);o.setup(),this.mExtensionList.push(o)}}}});var ut,Un=p(()=>{S();ut=class{mExpression;mTemporaryValues;constructor(e,t,n){if(this.mTemporaryValues=new D,n.length>0)for(let o of n)this.mTemporaryValues.set(o,void 0);this.mExpression=this.createEvaluationFunktion(e,this.mTemporaryValues).bind(t.store)}execute(){return this.mExpression()}setTemporaryValue(e,t){if(!this.mTemporaryValues.has(e))throw new g(`Temporary value "${e}" does not exist for this procedure.`,this);this.mTemporaryValues.set(e,t)}createEvaluationFunktion(e,t){let n,o=`__${Math.random().toString(36).substring(2)}`;if(n="return function () {",t.size>0)for(let r of t.keys())n+=`const ${r} = ${o}.get('${r}');`;return n+=`return ${e};`,n+="};",new Function(o,n)(t)}}});var Me,tn=p(()=>{Un();Me=class{mDataLevel;get data(){return this.mDataLevel}constructor(e){this.mDataLevel=e}createExpressionProcedure(e,t){return new ut(e,this.data,t??[])}setTemporaryValue(e,t){this.data.setTemporaryValue(e,t)}}});var Ce,pt=p(()=>{S();Ft();Ce=class{mComponent;mDataProxy;mParentLevel;mTemporaryValues;get store(){return this.mDataProxy}constructor(e){this.mTemporaryValues=new D,e instanceof xe?(this.mParentLevel=null,this.mComponent=e):(this.mParentLevel=e,this.mComponent=e.mComponent),this.mDataProxy=this.createAccessProxy()}setTemporaryValue(e,t){this.mTemporaryValues.set(e,t)}updateLevelData(e){if(e.mParentLevel!==this.mParentLevel)throw new g("Can't update InstructionLevelData for a deeper level than it target data.",this);this.mTemporaryValues=e.mTemporaryValues}createAccessProxy(){return new Proxy(new Object,{get:(e,t)=>this.getValue(t),set:(e,t,n)=>(this.hasTemporaryValue(t)&&this.setTemporaryValue(t,n),t in this.mComponent.processor?(this.mComponent.processor[t]=n,!0):(this.setTemporaryValue(t,n),!0)),deleteProperty:()=>{throw new g("Deleting properties is not allowed",this)},ownKeys:()=>[...new Set([...Object.keys(this.mComponent.processor),...this.getTemporaryValuesList()])]})}getTemporaryValuesList(){let e=this.mTemporaryValues.map(t=>t);return this.mParentLevel&&e.push(...this.mParentLevel.getTemporaryValuesList()),e}getValue(e){if(this.mTemporaryValues.has(e))return this.mTemporaryValues.get(e);if(this.mParentLevel)return this.mParentLevel.getValue(e);if(e in this.mComponent.processor)return this.mComponent.processor[e]}hasTemporaryValue(e){return this.mTemporaryValues.has(e)?!0:this.mParentLevel?this.mParentLevel.hasTemporaryValue(e):!1}}});var Re,nn=p(()=>{Re=class{mParent;get parent(){return this.mParent}set parent(e){this.mParent=e}get template(){return this.parent?.template??null}constructor(){this.mParent=null}}});var dt,zn=p(()=>{S();nn();dt=class i extends Re{mChildList;mInstruction;mInstructionType;get childList(){return q.newListWith(...this.mChildList)}get instruction(){return this.mInstruction}set instruction(e){this.mInstruction=e}get instructionType(){return this.mInstructionType}set instructionType(e){this.mInstructionType=e}constructor(){super(),this.mChildList=Array(),this.mInstruction="",this.mInstructionType=""}appendChild(...e){for(let t of e)t.parent=this;this.mChildList.push(...e)}clone(){let e=new i;e.instruction=this.instruction,e.instructionType=this.instructionType;for(let t of this.mChildList)e.appendChild(t.clone());return e}equals(e){if(!(e instanceof i)||e.instruction!==this.instruction||e.instructionType!==this.instructionType||e.childList.length!==this.childList.length)return!1;for(let t=0;t<e.childList.length;t++)if(!e.childList[t].equals(this.childList[t]))return!1;return!0}removeChild(e){let t=this.mChildList.indexOf(e),n;return t!==-1&&(n=this.mChildList.splice(t,1)[0],n.parent=null),n}}});var Gt,jo=p(()=>{S();Gt=class{mNode;get node(){if(!this.mNode)throw new g("Template value is not attached to any template node.",this);return this.mNode}set node(e){this.mNode=e}constructor(){this.mNode=null}}});var Ae,on=p(()=>{jo();Ae=class i extends Gt{mExpression;get value(){return this.mExpression}set value(e){this.mExpression=e}constructor(){super(),this.mExpression=""}clone(){let e=new i;return e.value=this.value,e}equals(e){return e instanceof i&&e.value===this.value}toString(){return`{{ ${this.mExpression} }}`}}});var Be,rn=p(()=>{nn();on();Be=class i extends Re{mContainsExpression;mTextValue;mValues;get containsExpression(){return this.mContainsExpression}get values(){return this.mValues}constructor(){super(),this.mTextValue="",this.mContainsExpression=!1,this.mValues=[]}addValue(...e){for(let t of e)t instanceof Ae&&(t.node=this,this.mContainsExpression=!0),this.mValues.push(t),this.mTextValue+=t.toString()}clone(){let e=new i;for(let t of this.values){let n=typeof t=="string"?t:t.clone();e.addValue(n)}return e}equals(e){if(!(e instanceof i)||e.values.length!==this.values.length)return!1;for(let t=0;t<this.values.length;t++){let n=this.values[t],o=e.values[t];if(n!==o&&(typeof n!=typeof o||typeof n=="string"&&n!==o||!o.equals(n)))return!1}return!0}toString(){return this.mTextValue}}});var sn,Bo=p(()=>{rn();jo();sn=class i extends Gt{mName;mValue;get name(){return this.mName}set name(e){this.mName=e}get values(){return this.mValue}constructor(){super(),this.mName="",this.mValue=new Be}clone(){let e=new i;e.name=this.name;for(let t of this.values.values){let n=typeof t=="string"?t:t.clone();e.values.addValue(n)}return e}equals(e){return!(!(e instanceof i)||e.name!==this.name||!e.values.equals(this.values))}}});var Ve,an=p(()=>{S();nn();Bo();Ve=class i extends Re{mAttributeDictionary;mChildList;mTagName;get attributes(){return q.newListWith(...this.mAttributeDictionary.values())}get childList(){return q.newListWith(...this.mChildList)}get tagName(){return this.mTagName}set tagName(e){this.mTagName=e}constructor(){super(),this.mAttributeDictionary=new D,this.mChildList=Array(),this.mTagName=""}appendChild(...e){for(let t of e)t.parent=this;this.mChildList.push(...e)}clone(){let e=new i;e.tagName=this.tagName;for(let t of this.attributes){let n=e.setAttribute(t.name);for(let o of t.values.values){let r=typeof o=="string"?o:o.clone();n.addValue(r)}}for(let t of this.mChildList)e.appendChild(t.clone());return e}equals(e){if(!(e instanceof i)||e.tagName!==this.tagName||e.attributes.length!==this.attributes.length||e.childList.length!==this.childList.length)return!1;for(let t of e.mAttributeDictionary.values()){let n=this.mAttributeDictionary.get(t.name);if(!n||!n.equals(t))return!1}for(let t=0;t<e.childList.length;t++)if(!e.childList[t].equals(this.childList[t]))return!1;return!0}getAttribute(e){return this.mAttributeDictionary.get(e)?.values??null}removeAttribute(e){return this.mAttributeDictionary.has(e)?(this.mAttributeDictionary.delete(e),!0):!1}removeChild(e){let t=this.mChildList.indexOf(e),n;return t!==-1&&(n=this.mChildList.splice(t,1)[0],n.parent=null),n}setAttribute(e){let t=this.mAttributeDictionary.get(e);return t||(t=new sn,t.name=e,t.node=this,this.mAttributeDictionary.set(e,t)),t.values}}});var fe,mt=p(()=>{S();nn();fe=class i extends Re{mBodyElementList;get body(){return this.mBodyElementList.clone()}get template(){return this}constructor(){super(),this.mBodyElementList=new q}appendChild(...e){this.mBodyElementList.push(...e);for(let t of e)t.parent=this}clone(){let e=new i;for(let t of this.mBodyElementList)e.appendChild(t.clone());return e}equals(e){if(!(e instanceof i)||e.body.length!==this.body.length)return!1;for(let t=0;t<this.body.length;t++)if(!this.body[t].equals(e.body[t]))return!1;return!0}removeChild(e){let t=this.mBodyElementList.indexOf(e),n;return t!==-1&&(n=this.mBodyElementList.splice(t,1)[0],n.parent=null),n}}});var ue,$n=p(()=>{ue=class{mApplicationContext;mComponentValues;mContent;mTemplate;get anchor(){return this.mContent.contentAnchor}get applicationContext(){return this.mApplicationContext}get boundary(){return this.mContent.getBoundary()}get template(){return this.mTemplate}get values(){return this.mComponentValues}get content(){return this.mContent}constructor(e,t,n,o){this.mApplicationContext=e,this.mTemplate=t,this.mTemplate.parent=null,this.mComponentValues=n,this.mContent=o,o.setCoreBuilder(this)}deconstruct(){this.content.deconstruct()}update(){let e=this.onUpdate(),t=!1,n=this.content.builders;if(n.length>0)for(let o=0;o<n.length;o++)t=n[o].update()||t;return e||t}createZoneEnabledElement(e){let t=e.tagName;if(typeof t!="string")throw t;if(t.includes("-")){let o=globalThis.customElements.get(t);if(typeof o<"u")return new o}let n=e.getAttribute("xmlns");return n&&!n.containsExpression?document.createElementNS(n.values[0],t):document.createElement(t)}createZoneEnabledText(e){return document.createTextNode(e)}}});var jt,Vo=p(()=>{S();$n();jt=class{mChildBuilderList;mChildComponents;mContentAnchor;mContentBoundary;mLinkedContent;mModules;mRootChildList;get body(){return this.mRootChildList}get builders(){return this.mChildBuilderList}get contentAnchor(){return this.mContentAnchor}get modules(){return this.mModules}constructor(e,t){this.mModules=e,this.mChildBuilderList=new q,this.mRootChildList=new q,this.mChildComponents=new D,this.mLinkedContent=new WeakSet,this.mContentAnchor=document.createComment(t),this.mContentBoundary={start:this.mContentAnchor,end:this.mContentAnchor}}deconstruct(){this.onDeconstruct();let e;for(;e=this.mChildBuilderList.pop();)e.deconstruct();for(let n of this.mChildComponents.values())n.deconstruct();this.mChildComponents.clear();let t;for(;t=this.mRootChildList.pop();)t instanceof ue||t.remove();this.contentAnchor.remove()}getBoundary(){let e=this.mContentBoundary.start,t;return this.mContentBoundary.end instanceof ue?t=this.mContentBoundary.end.boundary.end:t=this.mContentBoundary.end,{start:e,end:t}}hasContent(e){return this.mLinkedContent.has(e)}insert(e,t,n){if(!this.hasContent(n))throw new g("Can't add content to builder. Target is not part of builder.",this);let o=e instanceof ue?e.anchor:e;switch(t){case"After":{this.insertAfter(o,n);break}case"TopOf":{this.insertTop(o,n);break}case"BottomOf":{this.insertBottom(o,n);break}}this.mLinkedContent.add(e),e instanceof ue&&this.mChildBuilderList.push(e);let r=o.parentElement??o.getRootNode(),s=this.mContentAnchor.parentElement??this.mContentAnchor.getRootNode();if(r===s){let a;switch(t){case"After":{a=this.mRootChildList.indexOf(n)+1;break}case"TopOf":{a=0;break}case"BottomOf":{a=this.mRootChildList.length;break}}a===this.mRootChildList.length&&(this.mContentBoundary.end=e),this.mRootChildList.splice(a+1,0,e)}}remove(e){if(!this.mLinkedContent.has(e))throw new g("Child node cant be deleted from builder when it not a child of them",this);if(this.mLinkedContent.delete(e),e instanceof ue)this.mChildBuilderList.remove(e),e.deconstruct();else{let t=this.mChildComponents.get(e);t&&(t.deconstruct(),this.mChildComponents.delete(e)),e.remove()}this.mRootChildList.remove(e)&&(this.mContentBoundary.end=this.mRootChildList.at(-1)??this.mContentAnchor)}setCoreBuilder(e){this.mLinkedContent.add(e)}insertAfter(e,t){let n;t instanceof ue?n=t.boundary.end:n=t,(n.parentElement??n.getRootNode()).insertBefore(e,n.nextSibling)}insertBottom(e,t){if(t instanceof ue){this.insertAfter(e,t);return}if(t instanceof Element){t.appendChild(e);return}throw new g("Source node does not support child nodes.",this)}insertTop(e,t){if(t instanceof ue){this.insertAfter(e,t.anchor);return}if(t instanceof Element){t.prepend(e);return}throw new g("Source node does not support child nodes.",this)}}});var Hn,Ri=p(()=>{S();Vo();Hn=class extends jt{mAttributeModulesChangedOrder;mLinkedAttributeElement;mLinkedAttributeExpressionModules;mLinkedAttributeModuleList;mLinkedAttributeNodes;mLinkedExpressionModuleList;get linkedAttributeModules(){return this.mAttributeModulesChangedOrder&&(this.mAttributeModulesChangedOrder=!1,this.orderAttributeModules()),this.mLinkedAttributeModuleList}get linkedExpressionModules(){return this.mLinkedExpressionModuleList}constructor(e,t){super(e,t),this.mLinkedExpressionModuleList=new Array,this.mLinkedAttributeModuleList=new Array,this.mLinkedAttributeExpressionModules=new WeakMap,this.mLinkedAttributeNodes=new WeakMap,this.mLinkedAttributeElement=new WeakMap,this.mAttributeModulesChangedOrder=!1}attributeOfLinkedExpressionModule(e){return this.mLinkedAttributeExpressionModules.get(e)}getLinkedAttributeData(e){let t=this.mLinkedAttributeNodes.get(e),n=this.mLinkedAttributeElement.get(e);if(!t||!n)throw new g("Attribute has no linked data.",this);return{values:t,node:n}}linkAttributeExpression(e,t){this.mLinkedAttributeExpressionModules.set(e,t)}linkAttributeModule(e){this.mLinkedAttributeModuleList.push(e),this.mAttributeModulesChangedOrder=!0}linkAttributeNodes(e,t,n){this.mLinkedAttributeNodes.set(e,n),this.mLinkedAttributeElement.set(e,t)}linkExpressionModule(e){this.mLinkedExpressionModuleList.push(e)}onDeconstruct(){for(let e of this.mLinkedAttributeModuleList)e.deconstruct();for(let e of this.mLinkedExpressionModuleList)e.deconstruct()}orderAttributeModules(){this.mLinkedAttributeModuleList.sort((e,t)=>e.accessMode-t.accessMode)}}});var Kn,Oi=p(()=>{Vo();Kn=class extends jt{mInstructionModule;get instructionModule(){return this.mInstructionModule}set instructionModule(e){this.mInstructionModule=e}constructor(e,t){super(e,t),this.mInstructionModule=null}onDeconstruct(){this.mInstructionModule.deconstruct()}}});var Xn,Fi=p(()=>{S();$n();Oi();Uo();Xn=class extends ue{constructor(e,t,n,o){super(e,t,o,new Kn(n,`Instruction - {$${t.instructionType}}`))}onUpdate(){if(!this.content.instructionModule){let t=this.content.modules.createInstructionModule(this.applicationContext,this.template,this.values);this.content.instructionModule=t}if(this.content.instructionModule.update()){let t=this.content.body;this.updateStaticBuilder(t,this.content.instructionModule.instructionResult.elementList)}return!1}insertNewContent(e,t){let n=new Bt(this.applicationContext,e.template,this.content.modules,e.dataLevel,`Child - {$${this.template.instructionType}}`);return t===null?this.content.insert(n,"TopOf",this):this.content.insert(n,"After",t),n}updateStaticBuilder(e,t){let o=new qt((a,l)=>l.template.equals(a.template)).differencesOf(e,t),r=0,s=null;for(let a=0;a<o.length;a++){let l=o[a];if(l.changeState===1)this.content.remove(l.item);else if(l.changeState===2)s=this.insertNewContent(l.item,s),r++;else{let c=t[r].dataLevel;l.item.values.updateLevelData(c),s=l.item,r++}}}}});var Bt,Uo=p(()=>{pt();zn();rn();an();mt();on();$n();Ri();Fi();Bt=class extends ue{mInitialized;constructor(e,t,n,o,r){super(e,t,o,new Hn(n,`Static - {${r}}`)),this.mInitialized=!1}onUpdate(){this.mInitialized||(this.mInitialized=!0,this.buildTemplate([this.template],this));let e=!1,t=this.content.linkedAttributeModules;for(let r=0;r<t.length;r++)e=t[r].update()||e;let n=!1,o=this.content.linkedExpressionModules;for(let r=0;r<o.length;r++){let s=o[r];if(s.update()){n=!0;let a=this.content.attributeOfLinkedExpressionModule(s);if(!a)continue;let l=this.content.getLinkedAttributeData(a),c=l.values.reduce((m,d)=>m+d.data,"");l.node.setAttribute(a.name,c)}}return e||n}buildInstructionTemplate(e,t){let n=new Xn(this.applicationContext,e,this.content.modules,new Ce(this.values));this.content.insert(n,"BottomOf",t)}buildStaticTemplate(e,t){let n=this.createZoneEnabledElement(e);this.content.insert(n,"BottomOf",t);for(let o of e.attributes){let r=this.content.modules.createAttributeModule(this.applicationContext,o,n,this.values);if(r){this.content.linkAttributeModule(r);continue}if(o.values.containsExpression){let s=new Array;for(let a of o.values.values){let l=this.createZoneEnabledText("");if(s.push(l),!(a instanceof Ae)){l.data=a;continue}let c=this.content.modules.createExpressionModule(this.applicationContext,a,l,this.values);this.content.linkExpressionModule(c),this.content.linkAttributeExpression(c,o)}this.content.linkAttributeNodes(o,n,s);continue}n.setAttribute(o.name,o.values.toString())}this.content.insert(n,"BottomOf",t),this.buildTemplate(e.childList,n)}buildTemplate(e,t){for(let n of e)n instanceof fe?this.buildTemplate(n.body,t):n instanceof Be?this.buildTextTemplate(n,t):n instanceof dt?this.buildInstructionTemplate(n,t):n instanceof Ve&&this.buildStaticTemplate(n,t)}buildTextTemplate(e,t){for(let n of e.values){if(typeof n=="string"){this.content.insert(this.createZoneEnabledText(n),"BottomOf",t);continue}let o=this.createZoneEnabledText("");this.content.insert(o,"BottomOf",t);let r=this.content.modules.createExpressionModule(this.applicationContext,n,o,this.values);this.content.linkExpressionModule(r)}}}});var ln,zo=p(()=>{ln=class{mHtmlElement;mShadowRoot;get htmlElement(){return this.mHtmlElement}get shadowRoot(){return this.mShadowRoot}constructor(e){this.mHtmlElement=e,this.mShadowRoot=this.mHtmlElement.attachShadow({mode:"open"})}}});var X,Ee=p(()=>{Un();X=class{mDataLevel;get data(){return this.mDataLevel}constructor(e){this.mDataLevel=e}createExpressionProcedure(e,t){return new ut(e,this.data,t??[])}}});var qe,Wn=p(()=>{St();Go();Ee();qe=class extends Ot{constructor(e){super({applicationContext:e.applicationContext,constructor:e.constructor,loggingType:2,parent:e.parent,isolate:!1,trigger:e.trigger,trackConstructorChanges:!1}),this.setProcessorAttributes(X,new X(e.values)),this.addSetupHook(()=>{let t=this.processor})}deconstruct(){super.deconstruct(),this.call("onDeconstruct",!1)}}});var Q,Je=p(()=>{Q=class{mValue;get value(){return this.mValue}constructor(e){this.mValue=e}}});var te,Ue=p(()=>{S();te=class{constructor(){throw new g("Reference should not be instanced.",this)}}});var Ie,ht=p(()=>{S();Ie=class{constructor(){throw new g("Reference should not be instanced.",this)}}});var Qe,Zn=p(()=>{Wn();Je();Ue();ht();Qe=class i extends qe{mLastResult;mTargetTextNode;constructor(e){super({applicationContext:e.applicationContext,constructor:e.constructor,parent:e.parent,trigger:e.trigger,values:e.values}),this.mTargetTextNode=e.targetNode,this.mLastResult=null,this.setProcessorAttributes(i,this),this.setProcessorAttributes(Ie,e.targetTemplate.clone()),this.setProcessorAttributes(te,e.targetNode),this.setProcessorAttributes(Q,new Q(e.targetTemplate.value))}onUpdate(){let e=this.call("onUpdate",!0);e===null&&(e="");let t=this.mLastResult===null||this.mLastResult!==e;if(t){let n=this.mTargetTextNode;n.data=e,this.mLastResult=e}return t}}});function $o(i){return(e,t)=>{P.registerInjectable(e,t.metadata,"instanced"),ge.register(Qe,e,{trigger:i.trigger})}}var Ho=p(()=>{Z();ct();Zn()});var Gi,Ko,eu,yt,ji=p(()=>{Z();ce();Ee();re();Ho();Je();Gi=[$o({trigger:111})];yt=class extends(eu=w){mProcedure;constructor(e=P.use(X),t=P.use(Q)){super(),this.mProcedure=e.createExpressionProcedure(t.value)}onUpdate(){let e=this.mProcedure.execute();return typeof e>"u"?null:e?.toString()}};Ko=k(eu),yt=h(Ko,0,"MustacheExpressionModule",Gi,yt),u(Ko,1,yt)});var be,gt=p(()=>{be=class{mName;mValue;get name(){return this.mName}get value(){return this.mValue}constructor(e,t){this.mName=e,this.mValue=t}}});var pe,ft=p(()=>{Wn();gt();Ue();ht();pe=class i extends qe{mAccessMode;get accessMode(){return this.mAccessMode}constructor(e){super({applicationContext:e.applicationContext,constructor:e.constructor,parent:e.parent,trigger:e.trigger,values:e.values}),this.mAccessMode=e.accessMode,this.setProcessorAttributes(i,this),this.setProcessorAttributes(Ie,e.targetTemplate.clone()),this.setProcessorAttributes(te,e.targetNode),this.setProcessorAttributes(be,new be(e.targetTemplate.name,e.targetTemplate.values.toString()))}onUpdate(){return this.call("onUpdate",!0)??!1}}});var Te,bt=p(()=>{S();Te=class{mElementList;get elementList(){return q.newListWith(...this.mElementList)}constructor(){this.mElementList=new Array}addElement(e,t){if(this.mElementList.findIndex(o=>o.template===e||o.dataLevel===t)===-1)this.mElementList.push({template:e,dataLevel:t});else throw new g("Can't add same template or values for multiple Elements.",this)}}});var et,Yn=p(()=>{Wn();Je();ht();bt();et=class i extends qe{mLastResult;get instructionResult(){return this.mLastResult}constructor(e){super({applicationContext:e.applicationContext,constructor:e.constructor,parent:e.parent,trigger:e.trigger,values:e.values}),this.setProcessorAttributes(i,this),this.setProcessorAttributes(Ie,e.targetTemplate.clone()),this.setProcessorAttributes(Q,new Q(e.targetTemplate.instruction)),this.mLastResult=new Te}onUpdate(){let e=this.call("onUpdate",!0);return e instanceof Te?(this.mLastResult=e,!0):!1}}});var _n,Bi=p(()=>{S();ji();ct();ft();Zn();Yn();_n=class i{static mAttributeModuleCache=new D;static mExpressionModuleCache=new WeakMap;static mInstructionModuleCache=new D;mComponent;mExpressionModule;constructor(e,t){this.mExpressionModule=t??yt,this.mComponent=e}createAttributeModule(e,t,n,o){let r=(()=>{let s=i.mAttributeModuleCache.get(t.name);if(s||s===null)return s;for(let a of ge.get(pe))if(a.processorConfiguration.selector.test(t.name))return i.mAttributeModuleCache.set(t.name,a),a;return i.mAttributeModuleCache.set(t.name,null),null})();return r===null?null:new pe({applicationContext:e,accessMode:r.processorConfiguration.access,constructor:r.processorConstructor,parent:this.mComponent,targetNode:n,targetTemplate:t,values:o,trigger:r.processorConfiguration.trigger}).setup()}createExpressionModule(e,t,n,o){let r=(()=>{let s=i.mExpressionModuleCache.get(this.mExpressionModule);if(s)return s;let a=ge.get(Qe).find(l=>l.processorConstructor===this.mExpressionModule);if(!a)throw new g("An expression module could not be found.",this);return i.mExpressionModuleCache.set(this.mExpressionModule,a),a})();return new Qe({applicationContext:e,constructor:r.processorConstructor,parent:this.mComponent,targetNode:n,targetTemplate:t,values:o,trigger:r.processorConfiguration.trigger}).setup()}createInstructionModule(e,t,n){let o=(()=>{let r=i.mInstructionModuleCache.get(t.instructionType);if(r)return r;for(let s of ge.get(et))if(s.processorConfiguration.instructionType===t.instructionType)return i.mInstructionModuleCache.set(t.instructionType,s),s;throw new g(`Instruction module type "${t.instructionType}" not found.`,this)})();return new et({applicationContext:e,constructor:o.processorConstructor,parent:this.mComponent,targetTemplate:t,values:n,trigger:o.processorConfiguration.trigger}).setup()}}});var Tt,qn=p(()=>{S();Tt=class extends g{mColumnEnd;mColumnStart;mLineEnd;mLineStart;get columnEnd(){return this.mColumnEnd}get columnStart(){return this.mColumnStart}get lineEnd(){return this.mLineEnd}get lineStart(){return this.mLineStart}constructor(e,t,n,o,r,s,a){super(e,t,a),this.mColumnStart=n,this.mLineStart=o,this.mColumnEnd=r,this.mLineEnd=s}}});var Vt,Xo=p(()=>{S();Vt=class{mDependencyFetch;mDependencyFetchResolved;mLexer;mMeta;mPattern;mPatternDependencies;mType;get dependencies(){return this.mPatternDependencies}get dependenciesResolved(){return this.mDependencyFetchResolved}get lexer(){return this.mLexer}get meta(){return this.mMeta}get pattern(){return this.mPattern}constructor(e,t){if(this.mLexer=e,this.mType=t.type,this.mMeta=t.metadata,this.mPatternDependencies=new Array,this.mDependencyFetch=t.dependencyFetch??null,this.mDependencyFetchResolved=!t.dependencyFetch,this.mType==="split"&&!this.mDependencyFetch)throw new g("Split token with a start and end token, need inner token definitions.",this);if(this.mType==="single"&&this.mDependencyFetch)throw new g("Pattern does not allow inner token pattern.",this);this.mPattern=this.convertTokenPattern(this.mType,t.pattern)}isSplit(){return this.mType==="split"}resolveDependencies(){this.mDependencyFetchResolved||(this.mDependencyFetch(this),this.mDependencyFetchResolved=!0)}useChildPattern(e){if(this.mLexer!==e.lexer)throw new g("Can only add dependencies of the same lexer.",this);this.mPatternDependencies.push(e)}convertTokenPattern(e,t){if("single"in t){if(e==="split")throw new g("Can't use split pattern type with single pattern definition.",this);return{start:{regex:t.single.regex,types:t.single.types,validator:t.single.validator??null}}}else{if(e==="single")throw new g("Can't use single pattern type with split pattern definition.",this);return{start:{regex:t.start.regex,types:t.start.types,validator:t.start.validator??null},end:{regex:t.end.regex,types:t.end.types,validator:t.end.validator??null},innerType:t.innerType??null}}}}});var Ut,Wo=p(()=>{Ut=class{mColumnNumber;mLineNumber;mMetas;mType;mValue;get columnNumber(){return this.mColumnNumber}get lineNumber(){return this.mLineNumber}get metas(){return[...this.mMetas]}get type(){return this.mType}get value(){return this.mValue}constructor(e,t,n,o){this.mValue=t,this.mColumnNumber=n,this.mLineNumber=o,this.mType=e,this.mMetas=new Set}addMeta(...e){for(let t of e)this.mMetas.add(t)}hasMeta(e){return this.mMetas.has(e)}}});var cn,Vi=p(()=>{S();qn();Xo();Wo();cn=class{mRootPattern;mSettings;get errorType(){return this.mSettings.errorType}set errorType(e){this.mSettings.errorType=e}get trimWhitespace(){return this.mSettings.trimSpaces}set trimWhitespace(e){this.mSettings.trimSpaces=e}get validWhitespaces(){return[...this.mSettings.whiteSpaces].join("")}set validWhitespaces(e){this.mSettings.whiteSpaces=new Set(e.split(""))}constructor(){this.mSettings={errorType:null,trimSpaces:!0,whiteSpaces:new Set},this.mRootPattern=new Vt(this,{type:"single",pattern:{single:{regex:/^/,types:{},validator:null}},metadata:[],dependencyFetch:null})}createTokenPattern(e,t){let n=a=>typeof a=="string"?{token:a}:a,o=a=>{let l=new Set(a.flags.split(""));return new RegExp(`^(?<token>${a.source})`,[...l].join(""))},r=new Array;e.meta&&(typeof e.meta=="string"?r.push(e.meta):r.push(...e.meta));let s;return"regex"in e.pattern?s={single:{regex:o(e.pattern.regex),types:n(e.pattern.type),validator:e.pattern.validator??null}}:s={start:{regex:o(e.pattern.start.regex),types:n(e.pattern.start.type),validator:e.pattern.start.validator??null},end:{regex:o(e.pattern.end.regex),types:n(e.pattern.end.type),validator:e.pattern.end.validator??null},innerType:e.pattern.innerType??null},new Vt(this,{type:"regex"in e.pattern?"single":"split",pattern:s,metadata:r,dependencyFetch:t??null})}*tokenize(e,t){let n={data:e,cursor:{position:0,column:1,line:1},error:null,progressTracker:t??null};yield*this.tokenizeRecursionLayer(n,this.mRootPattern,new Array,null)}useRootTokenPattern(e){if(e.lexer!==this)throw new g("Token pattern must be created by this lexer.",this);this.mRootPattern.useChildPattern(e)}findNextStartToken(e,t,n,o){for(let r of t){let s=r.pattern.start,a=this.matchToken(r,s,e,n,o);if(a!==null)return{pattern:r,token:a}}return null}findTokenTypeOfMatch(e,t,n){for(let s in e.groups){let a=e.groups[s],l=t[s];if(!(!a||!l)){if(a.length!==e[0].length)throw new g("A group of a token pattern must match the whole token.",this);return l}}let o=new Array;for(let s in e.groups)e.groups[s]&&o.push(s);let r=new Array;for(let s in t)r.push(s);throw new g(`No token type found for any defined pattern regex group. Full: "${e[0]}", Matches: "${o.join(", ")}", Available: "${r.join(", ")}", Regex: "${n.source}"`,this)}*generateErrorToken(e,t){if(!e.error||!this.mSettings.errorType)return;let n=new Ut(this.mSettings.errorType,e.error.data,e.error.startColumn,e.error.startLine);n.addMeta(...t),e.error=null,yield n}generateToken(e,t,n,o,r,s){let a=n[0],l=this.findTokenTypeOfMatch(n,o,s),c=new Ut(r??l,a,e.cursor.column,e.cursor.line);return c.addMeta(...t),c}matchToken(e,t,n,o,r){let s=t.regex;s.lastIndex=0;let a=s.exec(n.data);if(!a||a.index!==0)return null;let l=this.generateToken(n,[...o,...e.meta],a,t.types,r,s);if(t.validator){let c=n.data.substring(l.value.length);if(!t.validator(l,c,n.cursor.position))return null}return this.moveCursor(n,l.value),l}moveCursor(e,t){let n=t.split(`
`);n.length>1&&(e.cursor.column=1),e.cursor.line+=n.length-1,e.cursor.column+=n.at(-1).length,e.cursor.position+=t.length,e.data=e.data.substring(t.length),this.trackProgress(e)}pushNextCharToErrorState(e){if(!this.mSettings.errorType)throw new Tt(`Unable to parse next token. No valid pattern found for "${e.data.substring(0,20)}".`,this,e.cursor.column,e.cursor.line,e.cursor.column,e.cursor.line);e.error||(e.error={data:"",startColumn:e.cursor.column,startLine:e.cursor.line});let t=e.data.charAt(0);e.error.data+=t,this.moveCursor(e,t)}skipNextWhitespace(e){let t=e.data.charAt(0);return!this.mSettings.trimSpaces||!this.mSettings.whiteSpaces.has(t)?!1:(this.moveCursor(e,t),!0)}*tokenizeRecursionLayer(e,t,n,o){let r=t.dependencies;for(;e.data.length>0;){if(!e.error&&this.skipNextWhitespace(e))continue;if(t.isSplit()){let l=this.matchToken(t,t.pattern.end,e,n,o);if(l!==null){yield*this.generateErrorToken(e,n),yield l;return}}let s=this.findNextStartToken(e,r,n,o);if(!s){this.pushNextCharToErrorState(e);continue}yield*this.generateErrorToken(e,n),yield s.token;let a=s.pattern;a.isSplit()&&(a.resolveDependencies(),yield*this.tokenizeRecursionLayer(e,a,[...n,...a.meta],o??a.pattern.innerType))}yield*this.generateErrorToken(e,n)}trackProgress(e){e.progressTracker!==null&&e.progressTracker(e.cursor.position,e.cursor.line,e.cursor.column)}}});var Y,Zo=p(()=>{Y=class extends Error{static PARSER_ERROR=Symbol("PARSER_ERROR");mTrace;get columnEnd(){return this.mTrace.top.range.columnEnd}get columnStart(){return this.mTrace.top.range.columnStart}get graph(){return this.mTrace.top.graph}get incidents(){return this.mTrace.incidents}get lineEnd(){return this.mTrace.top.range.lineEnd}get lineStart(){return this.mTrace.top.range.lineStart}constructor(e){super(e.top.message,{cause:e.top.cause}),this.mTrace=e}}});var Jn,Ui=p(()=>{S();Jn=class{mIncidents;mTop;get incidents(){if(this.mIncidents===null)throw new g("A complete incident list is only available on debug mode.",this);return this.mIncidents}get top(){return this.mTop}constructor(e){this.mTop={message:"Unknown parser error",priority:0,graph:null,range:{lineStart:1,columnStart:1,lineEnd:1,columnEnd:1},cause:null},e?this.mIncidents=new Array:this.mIncidents=null}push(e,t,n,o,r,s,a=!1,l=null){let c;if(a?c=this.mTop.priority+1:c=r*1e4+s,this.mIncidents!==null){let m={message:e,priority:c,graph:t,range:{lineStart:n,columnStart:o,lineEnd:r,columnEnd:s},cause:l};this.mIncidents.push(m)}this.mTop&&c<this.mTop.priority||this.setTop({message:e,priority:c,graph:t,range:{lineStart:n,columnStart:o,lineEnd:r,columnEnd:s},cause:l})}setTop(e){this.mTop=e}}});var Qn,zi=p(()=>{S();Ui();Qn=class i{static MAX_JUNCTION_CIRCULAR_REFERENCES=1e3;mGraphStack;mIncidentTrace;mLastTokenPosition;mProcessStack;mTokenCache;mTokenGenerator;mTrimTokenCache;get currentGraph(){return this.mGraphStack.top.graph}get currentToken(){let e=this.mGraphStack.top;return this.mTokenCache[e.token.cursor]}get incidentTrace(){return this.mIncidentTrace}get processStack(){return this.mProcessStack}constructor(e,t,n){this.mTokenGenerator=e,this.mGraphStack=new we,this.mLastTokenPosition={column:1,line:1},this.mTokenCache=new Array,this.mProcessStack=new we,this.mTrimTokenCache=n,this.mIncidentTrace=new Jn(t),this.mGraphStack.push({graph:null,linear:!0,circularGraphs:new D,token:{start:0,cursor:-1}})}collapse(){let e=this.mGraphStack.top,t=this.mTokenCache.slice(e.token.cursor);t.length!==0&&t.at(-1)===null&&t.pop();for(let n of this.mTokenGenerator)t.push(n);return t}getGraphBoundingToken(){let e=this.mGraphStack.top,t=this.mTokenCache[e.token.start],n=this.mTokenCache[e.token.cursor-1];return t??=n,n??=t,[t??null,n??null]}getGraphPosition(){let e=this.mGraphStack.top,t,n;if(t=this.mTokenCache[e.token.start],n=this.mTokenCache[e.token.cursor-1],t??=n,n??=t,!t||!n)return{graph:e.graph,columnEnd:this.mLastTokenPosition.column,columnStart:this.mLastTokenPosition.column,lineEnd:this.mLastTokenPosition.line,lineStart:this.mLastTokenPosition.line};let o,r;if(n.value.includes(`
`)){let s=n.value.split(`
`);r=n.lineNumber+s.length-1,o=1+s[s.length-1].length}else o=n.columnNumber+n.value.length,r=n.lineNumber;return{graph:e.graph,lineStart:t.lineNumber,columnStart:t.columnNumber,lineEnd:r,columnEnd:o}}getTokenPosition(){let e=this.mGraphStack.top,t=this.currentToken;if(!t)return{graph:e.graph,columnEnd:this.mLastTokenPosition.column,columnStart:this.mLastTokenPosition.column,lineEnd:this.mLastTokenPosition.line,lineStart:this.mLastTokenPosition.line};let n,o;if(t.value.includes(`
`)){let r=t.value.split(`
`);o=t.lineNumber+r.length-1,n=1+r[r.length-1].length}else n=t.columnNumber+t.value.length,o=t.lineNumber;return{graph:e.graph,lineStart:t.lineNumber,columnStart:t.columnNumber,lineEnd:o,columnEnd:n}}graphIsCircular(e){let t=this.mGraphStack.top;if(!t.circularGraphs.has(e))return!1;if(e.isJunction){if(t.circularGraphs.get(e)>i.MAX_JUNCTION_CIRCULAR_REFERENCES)throw new g("Junction graph called circular too often.",this);return!1}return!0}moveNextToken(){let e=this.mGraphStack.top;if(e.circularGraphs.size>0&&(e.circularGraphs=new D),e.graph&&e.graph.isJunction)throw new g("Junction graph must not have own nodes.",this);if(e.token.cursor++,e.token.cursor<this.mTokenCache.length)return;let t=this.mTokenGenerator.next();if(t.done){this.mTokenCache.push(null);return}this.mLastTokenPosition.column=t.value.columnNumber,this.mLastTokenPosition.line=t.value.lineNumber,this.mTokenCache.push(t.value)}popGraphStack(e){let t=this.mGraphStack.pop(),n=this.mGraphStack.top;if(e&&(t.token.cursor=t.token.start),t.token.cursor!==t.token.start&&n.circularGraphs.size>0&&(n.circularGraphs=new D),!this.mTrimTokenCache){n.token.cursor=t.token.cursor;return}t.linear?(this.mTokenCache.splice(0,t.token.cursor),n.token.start=0,n.token.cursor=0):n.token.cursor=t.token.cursor}pushGraphStack(e,t){let n=this.mGraphStack.top,o={graph:e,linear:t&&n.linear,circularGraphs:new D(n.circularGraphs),token:{start:n.token.cursor,cursor:n.token.cursor}},r=o.circularGraphs.get(e)??0;o.circularGraphs.set(e,r+1),this.mGraphStack.push(o)}}});var un,$i=p(()=>{S();qn();Zo();zi();un=class i{static NODE_NULL_RESULT=Symbol("FAILED_NODE_VALUE_PARSE");static NODE_VALUE_LIST_END_MEET=Symbol("FAILED_NODE_VALUE_PARSE");mConfiguration;mLexer;mRootPart;get lexer(){return this.mLexer}constructor(e,t){this.mLexer=e,this.mRootPart=null,this.mConfiguration={keepTraceIncidents:!1,trimTokenCache:!1,...t}}parse(e,t){if(this.mRootPart===null)throw new g("Parser has not root part set.",this);let n=new Qn(this.mLexer.tokenize(e,t),this.mConfiguration.keepTraceIncidents,this.mConfiguration.trimTokenCache),o=(()=>{try{return this.beginParseProcess(n,this.mRootPart)}catch(s){if(s instanceof Tt)return n.incidentTrace.push(s.message,n.currentGraph,s.lineStart,s.columnStart,s.lineEnd,s.columnEnd,!0,s),Y.PARSER_ERROR;let a=s instanceof Error?s.message:s.toString(),l=n.getGraphPosition();return n.incidentTrace.push(a,n.currentGraph,l.lineStart,l.columnStart,l.lineEnd,l.columnEnd,!0,s),Y.PARSER_ERROR}})();if(o===Y.PARSER_ERROR)throw new Y(n.incidentTrace);let r=n.collapse();if(r.length!==0){let s=r[0];if(n.incidentTrace.top.range.lineEnd===1&&n.incidentTrace.top.range.columnEnd===1){let a=`Tokens could not be parsed. Graph end meet without reaching last token. Current: "${s.value}" (${s.type})`;n.incidentTrace.push(a,this.mRootPart,s.lineNumber,s.columnNumber,s.lineNumber,s.columnNumber)}throw new Y(n.incidentTrace)}return o}setRootGraph(e){this.mRootPart=e}beginParseProcess(e,t){e.moveNextToken(),e.processStack.push({type:"graph-parse",parameter:{graph:t,linear:!0},state:0});let n=i.NODE_NULL_RESULT;for(;e.processStack.top;)n=this.processStack(e,e.processStack.top,n);return n}processChainedNodeParseProcess(e,t,n){switch(t.state){case 0:{let s=t.parameter.node.connections.next;return s===null?(e.processStack.pop(),{}):(t.state++,e.processStack.push({type:"node-parse",parameter:{node:s},state:0,values:{}}),i.NODE_NULL_RESULT)}case 1:{let o=n;return o===Y.PARSER_ERROR?(e.processStack.pop(),Y.PARSER_ERROR):(e.processStack.pop(),o)}}throw new g(`Invalid node next parse state "${t.state}".`,this)}processGraphParseProcess(e,t,n){let o=t.parameter.graph;switch(t.state){case 0:{if(e.graphIsCircular(o)){let s=e.getGraphPosition();return e.incidentTrace.push("Circular graph detected.",o,s.lineStart,s.columnStart,s.lineEnd,s.columnEnd),e.processStack.pop(),Y.PARSER_ERROR}let r=t.parameter.linear;return e.pushGraphStack(o,r),t.state++,e.processStack.push({type:"node-parse",parameter:{node:o.node},state:0,values:{}}),i.NODE_NULL_RESULT}case 1:{let r=n;if(r===Y.PARSER_ERROR)return e.popGraphStack(!0),e.processStack.pop(),Y.PARSER_ERROR;let s=o.convert(r,e);if(typeof s=="symbol"){let a=e.getGraphPosition();return e.incidentTrace.push(s.description??"Unknown data convert error",a.graph,a.lineStart,a.columnStart,a.lineEnd,a.columnEnd),e.popGraphStack(!0),e.processStack.pop(),Y.PARSER_ERROR}return e.popGraphStack(!1),e.processStack.pop(),s}}throw new g(`Invalid graph parse state "${t.state}".`,this)}processNodeParseProcess(e,t,n){let o=t.parameter.node;switch(t.state){case 0:return e.processStack.push({type:"node-value-parse",parameter:{node:o,valueIndex:0},state:0,values:{}}),t.state++,i.NODE_NULL_RESULT;case 1:{let r=n;return r===Y.PARSER_ERROR?(e.processStack.pop(),Y.PARSER_ERROR):(t.values.nodeValueResult=r,e.processStack.push({type:"node-next-parse",parameter:{node:o},state:0}),t.state++,i.NODE_NULL_RESULT)}case 2:{let r=n;if(r===Y.PARSER_ERROR)return e.processStack.pop(),Y.PARSER_ERROR;let s=o.mergeData(t.values.nodeValueResult,r);return e.processStack.pop(),s}}throw new g(`Invalid node parse state "${t.state}".`,this)}processNodeValueParseProcess(e,t,n){let o=t.parameter.node;switch(t.state){case 0:{if(n!==i.NODE_NULL_RESULT&&n!==Y.PARSER_ERROR)return t.values.parseResult=n,t.state++,i.NODE_NULL_RESULT;let r=t.parameter.valueIndex,s=o.connections;if(r>=s.values.length)return t.values.parseResult=i.NODE_VALUE_LIST_END_MEET,t.state++,i.NODE_NULL_RESULT;t.parameter.valueIndex++;let a=e.currentToken,l=s.values[r];if(typeof l=="string"){if(!a){if(s.required){let c=e.getTokenPosition();e.incidentTrace.push(`Unexpected end of statement. Token "${l}" expected.`,e.currentGraph,c.lineStart,c.columnStart,c.lineEnd,c.columnEnd)}return i.NODE_NULL_RESULT}if(l!==a.type){if(s.required){let c=e.getTokenPosition();e.incidentTrace.push(`Unexpected token "${a.value}". "${l}" expected`,e.currentGraph,c.lineStart,c.columnStart,c.lineEnd,c.columnEnd)}return i.NODE_NULL_RESULT}return e.moveNextToken(),a.value}else{let c=s.values.length===1||s.values.length===r+1;return e.processStack.push({type:"graph-parse",parameter:{graph:l,linear:c},state:0}),i.NODE_NULL_RESULT}}case 1:{let r=t.values.parseResult,s=o.connections;if(r===i.NODE_VALUE_LIST_END_MEET&&!s.required){e.processStack.pop();return}return r===i.NODE_VALUE_LIST_END_MEET?(e.processStack.pop(),Y.PARSER_ERROR):(e.processStack.pop(),r)}}throw new g(`Invalid node value parse state "${t.state}".`,this)}processStack(e,t,n){switch(t.type){case"graph-parse":return this.processGraphParseProcess(e,t,n);case"node-parse":return this.processNodeParseProcess(e,t,n);case"node-value-parse":return this.processNodeValueParseProcess(e,t,n);case"node-next-parse":return this.processChainedNodeParseProcess(e,t,n)}}}});var J,Yo=p(()=>{J=class i{static define(e,t=!1){return new i(e,t)}mDataConverterList;mGraphCollector;mIsJunction;mResolvedGraphNode;get isJunction(){return this.mIsJunction}get node(){return this.mResolvedGraphNode||(this.mResolvedGraphNode=this.mGraphCollector().root),this.mResolvedGraphNode}constructor(e,t){this.mGraphCollector=e,this.mDataConverterList=new Array,this.mResolvedGraphNode=null,this.mIsJunction=t}convert(e,t){if(this.mDataConverterList.length===0)return e;let n=t.getGraphBoundingToken(),o=n[0]??void 0,r=n[1]??void 0;if(this.mDataConverterList.length===1)return this.mDataConverterList[0](e,o,r);let s=e;for(let a of this.mDataConverterList)if(s=a(s,o,r),typeof s=="symbol")return s;return s}converter(e){let t=new i(this.mGraphCollector,this.isJunction);return t.mDataConverterList.push(...this.mDataConverterList,e),t}}});var V,Hi=p(()=>{S();Yo();V=class i{static new(){let e=new i("",!1,[]);return e.mRootNode=null,e}mConnections;mIdentifier;mRootNode;get configuration(){return{dataKey:this.mIdentifier.dataKey,isList:this.mIdentifier.type==="list",isRequired:this.mConnections.required,isBranch:this.mConnections.values.length>1}}get connections(){return this.mConnections}get root(){if(!this.mRootNode)throw new g("Staring nodes must be chained with another node to be used.",this);return this.mRootNode}constructor(e,t,n,o){if(e==="")this.mIdentifier={type:"empty",dataKey:"",mergeKey:""};else if(e.endsWith("[]"))this.mIdentifier={type:"list",mergeKey:"",dataKey:e.substring(0,e.length-2)};else if(e.includes("<-")){let s=e.split("<-");this.mIdentifier={type:"merge",dataKey:s[0],mergeKey:s[1]}}else this.mIdentifier={type:"single",mergeKey:"",dataKey:e};let r=n.map(s=>s instanceof i?J.define(()=>s):s);this.mConnections={required:t,values:r,next:null},o?this.mRootNode=o:this.mRootNode=this}mergeData(e,t){if(this.mIdentifier.type==="empty")return t;let n=t,o=typeof e>"u";if(this.mIdentifier.type==="single"){if(this.mIdentifier.dataKey in t)throw new g(`Graph path has a duplicate value identifier "${this.mIdentifier.dataKey}"`,this);return o||(n[this.mIdentifier.dataKey]=e),t}if(this.mIdentifier.type==="list"){let a;o?a=new Array:Array.isArray(e)?a=e:a=[e];let l=(()=>{if(this.mIdentifier.dataKey in t){let c=n[this.mIdentifier.dataKey];return Array.isArray(c)?(c.unshift(...a),c):(a.push(c),a)}return a})();return n[this.mIdentifier.dataKey]=l,t}if(o)return t;let r=(()=>{if(!this.mIdentifier.mergeKey)throw new g("Cant merge data without a merge key.",this);if(typeof e!="object"||e===null)throw new g("Node data must be an object when merge key is set.",this);if(!(this.mIdentifier.mergeKey in e))throw new g(`Node data does not contain merge key "${this.mIdentifier.mergeKey}"`,this);return e[this.mIdentifier.mergeKey]})();if(typeof r>"u")return t;let s=n[this.mIdentifier.dataKey];if(typeof s>"u")return n[this.mIdentifier.dataKey]=r,n;if(!Array.isArray(s))throw new g("Chain data merge value is not an array but should be.",this);return Array.isArray(r)?s.unshift(...r):s.unshift(r),t}optional(e,t){let n=typeof t>"u"?"":e,o=typeof t>"u"?e:t,r=new Array;Array.isArray(o)?r.push(...o):r.push(o);let s=new i(n,!1,r,this.mRootNode);return this.setChainedNode(s),s}required(e,t){let n=typeof t>"u"?"":e,o=typeof t>"u"?e:t,r=new Array;Array.isArray(o)?r.push(...o):r.push(o);let s=new i(n,!0,r,this.mRootNode);return this.setChainedNode(s),s}setChainedNode(e){if(this.mConnections.next!==null)throw new g("Node can only be chained to a single node.",this);this.mConnections.next=e}}});var Ki=p(()=>{qn();Xo();Wo();Vi();Zo();$i();Hi();Yo()});var pn,_o=p(()=>{S();Ki();zn();rn();an();mt();on();pn=class{mParser;constructor(){this.mParser=null}parse(e){if(!this.mParser){let t=this.createLexer();this.mParser=this.createParser(t)}return this.mParser.parse(e)}createLexer(){let e=new cn;e.validWhitespaces=` 
\r`,e.trimWhitespace=!0;let t=e.createTokenPattern({pattern:{regex:/(?:(?!}}).)*/,type:"ExpressionValue"}}),n=e.createTokenPattern({pattern:{start:{regex:/{{/,type:"ExpressionStart"},end:{regex:/}}/,type:"ExpressionEnd"}}},v=>{v.useChildPattern(t)}),o=e.createTokenPattern({pattern:{regex:/[^>\s\n="/]+/,type:"Identifier"}}),r=e.createTokenPattern({pattern:{regex:/(?:(?!{{|"|<).)+/,type:"XmlValue"}}),s=e.createTokenPattern({pattern:{regex:/<!--.*?-->/,type:"XmlComment"}}),a=e.createTokenPattern({pattern:{regex:/=/,type:"XmlAssignment"}}),l=e.createTokenPattern({pattern:{start:{regex:/"/,type:"XmlExplicitValueIdentifier"},end:{regex:/"/,type:"XmlExplicitValueIdentifier"}}},v=>{v.useChildPattern(n),v.useChildPattern(r)}),c=e.createTokenPattern({pattern:{start:{regex:/<\//,type:"XmlOpenClosingBracket"},end:{regex:/>/,type:"XmlCloseBracket"}}},v=>{v.useChildPattern(o)}),m=e.createTokenPattern({pattern:{start:{regex:/</,type:"XmlOpenBracket"},end:{regex:/(?<closeClosingBracket>\/>)|(?<closeBracket>>)/,type:{closeClosingBracket:"XmlCloseClosingBracket",closeBracket:"XmlCloseBracket"}}}},v=>{v.useChildPattern(a),v.useChildPattern(o),v.useChildPattern(l)}),d=e.createTokenPattern({pattern:{regex:/[^()"'`/)]+/,type:"InstructionInstructionValue"}}),y=e.createTokenPattern({pattern:{innerType:"InstructionInstructionValue",start:{regex:/\//,type:"InstructionInstructionValue"},end:{regex:/\//,type:"InstructionInstructionValue"}}},v=>{v.useChildPattern(G),v.useChildPattern(x),v.useChildPattern(b),v.useChildPattern(C),v.useChildPattern(d)}),C=e.createTokenPattern({pattern:{innerType:"InstructionInstructionValue",start:{regex:/\(/,type:"InstructionInstructionValue"},end:{regex:/\)/,type:"InstructionInstructionValue"}}},v=>{v.useChildPattern(y),v.useChildPattern(G),v.useChildPattern(x),v.useChildPattern(b),v.useChildPattern(d)}),G=e.createTokenPattern({pattern:{innerType:"InstructionInstructionValue",start:{regex:/"/,type:"InstructionInstructionValue"},end:{regex:/"/,type:"InstructionInstructionValue"}}},v=>{v.useChildPattern(y),v.useChildPattern(x),v.useChildPattern(b),v.useChildPattern(C),v.useChildPattern(d)}),x=e.createTokenPattern({pattern:{innerType:"InstructionInstructionValue",start:{regex:/'/,type:"InstructionInstructionValue"},end:{regex:/'/,type:"InstructionInstructionValue"}}},v=>{v.useChildPattern(y),v.useChildPattern(G),v.useChildPattern(b),v.useChildPattern(C),v.useChildPattern(d)}),b=e.createTokenPattern({pattern:{innerType:"InstructionInstructionValue",start:{regex:/`/,type:"InstructionInstructionValue"},end:{regex:/`/,type:"InstructionInstructionValue"}}},v=>{v.useChildPattern(y),v.useChildPattern(G),v.useChildPattern(x),v.useChildPattern(C),v.useChildPattern(d)}),E=e.createTokenPattern({pattern:{regex:/\$[^(\s\n/{]+/,type:"InstructionStart"}}),A=e.createTokenPattern({pattern:{start:{regex:/\(/,type:"InstructionInstructionOpeningBracket"},end:{regex:/\)/,type:"InstructionInstructionClosingBracket"}}},v=>{v.useChildPattern(y),v.useChildPattern(G),v.useChildPattern(x),v.useChildPattern(b),v.useChildPattern(C),v.useChildPattern(d)}),R=e.createTokenPattern({pattern:{start:{regex:/{/,type:"InstructionBodyStartBraket"},end:{regex:/}/,type:"InstructionBodyCloseBraket"}}},v=>{for(let Mn of W)v.useChildPattern(Mn)}),W=[s,c,m,l,n,E,A,R,r];for(let v of W)e.useRootTokenPattern(v);return e}createParser(e){let t=new un(e),n=J.define(()=>V.new().required("ExpressionStart").optional("value","ExpressionValue").required("ExpressionEnd")).converter(b=>{let E=new Ae;return E.value=b.value??"",E}),o=J.define(()=>{let b=o;return V.new().required("data[]",V.new().required("value",[n,V.new().required("text","XmlValue")])).optional("data<-data",b)}),r=J.define(()=>V.new().required("name","Identifier").optional("attributeValue",V.new().required("XmlAssignment").required("XmlExplicitValueIdentifier").optional("list<-data",o).required("XmlExplicitValueIdentifier"))).converter(b=>{let E=new Array;if(b.attributeValue?.list)for(let A of b.attributeValue.list)A.value instanceof Ae?E.push(A.value):E.push(A.value.text);return{name:b.name,values:E}}),s=J.define(()=>{let b=s;return V.new().required("data[]",r).optional("data<-data",b)}),a=J.define(()=>{let b=a;return V.new().required("data[]",V.new().required("value",[n,V.new().required("text","XmlValue"),V.new().required("XmlExplicitValueIdentifier").required("text","XmlValue").required("XmlExplicitValueIdentifier")])).optional("data<-data",b)}),l=J.define(()=>V.new().required("list<-data",a)).converter(b=>{let E=new Be;for(let A of b.list)A.value instanceof Ae?E.addValue(A.value):E.addValue(A.value.text);return E}),c=J.define(()=>V.new().required("XmlComment")).converter(()=>null),m=J.define(()=>V.new().required("XmlOpenBracket").required("openingTagName","Identifier").optional("attributes<-data",s).required("closing",[V.new().required("XmlCloseClosingBracket"),V.new().required("XmlCloseBracket").required("values",G).required("XmlOpenClosingBracket").required("closingTageName","Identifier").required("XmlCloseBracket")])).converter(b=>{if("closingTageName"in b.closing&&b.openingTagName!==b.closing.closingTageName)throw new g(`Opening (${b.openingTagName}) and closing tagname (${b.closing.closingTageName}) does not match`,this);let E=new Ve;if(E.tagName=b.openingTagName,b.attributes)for(let A of b.attributes)E.setAttribute(A.name).addValue(...A.values);return"values"in b.closing&&E.appendChild(...b.closing.values),E}),d=J.define(()=>{let b=d;return V.new().required("list[]","InstructionInstructionValue").optional("list<-list",b)}),y=J.define(()=>V.new().required("instructionName","InstructionStart").optional("instruction",V.new().required("InstructionInstructionOpeningBracket").required("value<-list",d).required("InstructionInstructionClosingBracket")).optional("body",V.new().required("InstructionBodyStartBraket").required("value",G).required("InstructionBodyCloseBraket"))).converter(b=>{let E=new dt;return E.instructionType=b.instructionName.substring(1),E.instruction=b.instruction?.value.join("")??"",b.body&&E.appendChild(...b.body.value),E}),C=J.define(()=>{let b=C;return V.new().required("list[]",[c,m,y,l]).optional("list<-list",b)}),G=J.define(()=>{let b=C;return V.new().optional("list<-list",b)}).converter(b=>{let E=new Array;if(b.list)for(let A of b.list)A!==null&&E.push(A);return E}),x=J.define(()=>V.new().required("content",G)).converter(b=>{let E=new fe;return E.appendChild(...b.content),E});return t.setRootGraph(x),t}}});var xe,Ft=p(()=>{S();St();Go();tn();pt();Ro();re();Uo();zo();Bi();At();_o();xe=class i extends Ot{static mTemplateCache=new D;static mXmlParser=new pn;mComponentElement;mRootBuilder;mUpdateMode;get element(){return this.mComponentElement.htmlElement}get updateMode(){return this.mUpdateMode}constructor(e){super({applicationContext:e.applicationContext,constructor:e.processorConstructor,loggingType:1,trigger:127,isolate:(e.updateMode&1)!==0,trackConstructorChanges:!0}),ae.registerComponent(this,e.htmlElement),this.addCreationHook(n=>{ae.registerComponent(this,this.mComponentElement.htmlElement,n)}).addCreationHook(n=>this.registerObject(n)).addCreationHook(n=>{ae.registerComponent(this,this.mComponentElement.htmlElement,n)});let t=i.mTemplateCache.get(e.processorConstructor);t?t=t.clone():(t=i.mXmlParser.parse(e.templateString??""),i.mTemplateCache.set(e.processorConstructor,t)),this.mUpdateMode=e.updateMode,this.mComponentElement=new ln(e.htmlElement),this.mRootBuilder=new Bt(this.applicationContext,t,new _n(this,e.expressionModule),new Ce(this),"ROOT"),this.mComponentElement.shadowRoot.appendChild(this.mRootBuilder.anchor),this.setProcessorAttributes(Me,new Me(this.mRootBuilder.values)),this.setProcessorAttributes(i,this),(e.updateMode&2)===0&&this.setAutoUpdate(127)}addStyle(e){let t=document.createElement("style");t.innerHTML=e,this.mComponentElement.shadowRoot.prepend(t)}attributeChanged(e,t,n){this.call("onAttributeChange",!1,e,t,n)}connected(){this.call("onConnect",!1)}deconstruct(){this.call("onDeconstruct",!1),this.mRootBuilder.deconstruct(),super.deconstruct()}disconnected(){this.call("onDisconnect",!1)}onUpdate(){return this.mRootBuilder.update()?(this.call("onUpdate",!1),!0):!1}}});function U(i){return $.enableGlobalTracing(nu(globalThis)),(e,t)=>{P.registerInjectable(e,t.metadata,"instanced"),ae.registerConstructor(e,i.selector);let n=class extends HTMLElement{mComponent;constructor(){super();let o=$.current.attachment(at.CONFIGURATION_ATTACHMENT);o||(o=Ge.DEFAULT),this.mComponent=new xe({applicationContext:o,processorConstructor:e,templateString:i.template??null,expressionModule:i.expressionmodule,htmlElement:this,updateMode:i.updateScope??0}).setup(),i.style&&this.mComponent.addStyle(i.style),this.mComponent.update()}connectedCallback(){this.mComponent.connected()}disconnectedCallback(){this.mComponent.disconnected()}};globalThis.customElements.define(i.selector,n)}}var nu,Xi=p(()=>{Z();Jt();Gn();de();Ro();At();Ft();nu=i=>{let e={target:i,patches:{requirements:{promise:i.Promise?.name,eventTarget:i.EventTarget?.name},classes:{eventTargets:new Array,callback:new Array},functions:new Array},errorHandling:!0},t=[i.requestAnimationFrame?.name,i.setInterval?.name,i.setTimeout?.name];e.patches.functions.push(...t.filter(r=>!!r));let n=[i.XMLHttpRequestEventTarget?.name,i.XMLHttpRequest?.name,i.Document?.name,i.SVGElement?.name,i.Element?.name,i.HTMLElement?.name,i.HTMLMediaElement?.name,i.HTMLFrameSetElement?.name,i.HTMLBodyElement?.name,i.HTMLFrameElement?.name,i.HTMLIFrameElement?.name,i.HTMLMarqueeElement?.name,i.Worker?.name,i.IDBRequest?.name,i.IDBOpenDBRequest?.name,i.IDBDatabase?.name,i.IDBTransaction?.name,i.WebSocket?.name,i.FileReader?.name,i.Notification?.name,i.RTCPeerConnection?.name];e.patches.classes.eventTargets.push(...n.filter(r=>!!r));let o=[i.ResizeObserver?.name,i.MutationObserver?.name,i.IntersectionObserver?.name];return e.patches.classes.callback.push(...o.filter(r=>!!r)),e}});var Wi=p(()=>{Mt()});function vt(i){return(e,t)=>{P.registerInjectable(e,t.metadata,"instanced"),ge.register(Ye,e,{access:i.access,trigger:i.trigger,targetRestrictions:i.targetRestrictions})}}var dn=p(()=>{Z();ct();Vn()});function ze(i){return(e,t)=>{P.registerInjectable(e,t.metadata,"instanced"),ge.register(pe,e,{access:i.access,selector:i.selector,trigger:i.trigger})}}var zt=p(()=>{Z();ct();ft()});function $e(i){return(e,t)=>{P.registerInjectable(e,t.metadata,"instanced"),ge.register(et,e,{instructionType:i.instructionType,trigger:i.trigger})}}var $t=p(()=>{Z();ct();Yn()});var Zi,qo,ou,Ht,mn,eo=p(()=>{Z();Ft();ce();Le();re();dn();Zi=[vt({access:1,trigger:127,targetRestrictions:[xe]})];Ht=class Ht extends(ou=w){static METADATA_USER_EVENT_LISTENER_PROPERIES="pwb:user_event_listener_properties";mEventListenerList;mTargetElement;constructor(e=P.use(xe)){super();let t=new Array,n=e.processorConstructor;do{let o=le.get(n).getMetadata(Ht.METADATA_USER_EVENT_LISTENER_PROPERIES);if(o)for(let r of o)t.push(r)}while(n=Object.getPrototypeOf(n));this.mEventListenerList=new Array,this.mTargetElement=e.element;for(let o of t){let[r,s]=o,a=Reflect.get(e.processor,r);a=a.bind(e.processor),this.mEventListenerList.push([s,a]),this.mTargetElement.addEventListener(s,a)}}onDeconstruct(){for(let e of this.mEventListenerList){let[t,n]=e;this.mTargetElement.removeEventListener(t,n)}}};qo=k(ou),Ht=h(qo,0,"ComponentEventListenerComponentExtension",Zi,Ht),u(qo,1,Ht);mn=Ht});var Yi=p(()=>{S();Z();eo()});var hn,Jo=p(()=>{hn=class extends window.Event{mValue;get value(){return this.mValue}constructor(e,t){super(e),this.mValue=t}}});var yn,Qo=p(()=>{Jo();yn=class{mElement;mEventName;constructor(e,t){this.mEventName=e,this.mElement=t}dispatchEvent(e){let t=new hn(this.mEventName,e);this.mElement.dispatchEvent(t)}}});function L(i){return(e,t)=>{if(t.static)throw new g("Event target is not for a static property.",L);let n=null;return{get(){if(!n){let o=(()=>{try{return ae.ofProcessor(this).component}catch{throw new g("PwbComponentEvent target class is not a component.",this)}})();n=new yn(i,o.element)}return n}}}}var _i=p(()=>{S();At();Qo()});var qi,er,ru,Kt,gn,tr=p(()=>{S();Z();Ft();ce();Le();re();dn();qi=[vt({access:2,trigger:127,targetRestrictions:[xe]})];Kt=class Kt extends(ru=w){static METADATA_EXPORTED_PROPERTIES="pwb:exported_properties";mComponent;constructor(e=P.use(xe)){super(),this.mComponent=e;let t=new q,n=e.processorConstructor;do{let r=le.get(n).getMetadata(Kt.METADATA_EXPORTED_PROPERTIES);r&&t.push(...r)}while(n=Object.getPrototypeOf(n));let o=new Set(t);o.size>0&&this.connectExportedProperties(o)}connectExportedProperties(e){this.exportPropertyAsAttribute(e),this.patchHtmlAttributes(e)}exportPropertyAsAttribute(e){for(let t of e){let n={};n.enumerable=!0,n.configurable=!0,delete n.value,delete n.writable,n.set=o=>{Reflect.set(this.mComponent.processor,t,o)},n.get=()=>{let o=Reflect.get(this.mComponent.processor,t);return typeof o=="function"&&(o=o.bind(this.mComponent.processor)),o},Object.defineProperty(this.mComponent.element,t,n)}}patchHtmlAttributes(e){let t=this.mComponent.element.getAttribute;new MutationObserver(o=>{for(let r of o){let s=r.attributeName,a=t.call(this.mComponent.element,s);Reflect.set(this.mComponent.element,s,a),this.mComponent.attributeChanged(s,r.oldValue,a)}}).observe(this.mComponent.element,{attributeFilter:[...e],attributeOldValue:!0});for(let o of e)if(this.mComponent.element.hasAttribute(o)){let r=t.call(this.mComponent.element,o);this.mComponent.element.setAttribute(o,r)}this.mComponent.element.getAttribute=o=>e.has(o)?Reflect.get(this.mComponent.element,o):t.call(this.mComponent.element,o)}};er=k(ru),Kt=h(er,0,"ExportExtension",qi,Kt),u(er,1,Kt);gn=Kt});function I(i,e){if(e.static)throw new g("Event target is not for a static property.",I);let t=le.forInternalDecorator(e.metadata),n=t.getMetadata(gn.METADATA_EXPORTED_PROPERTIES)??new Array;n.push(e.name),t.setMetadata(gn.METADATA_EXPORTED_PROPERTIES,n)}var Ji=p(()=>{S();Z();tr()});function me(i){return(e,t)=>{if(t.static)throw new g("Event target is not for a static property.",me);return{get(){let r=(()=>{try{return ae.ofProcessor(this).component}catch{throw new g("PwbChild target class is not a component.",this)}})().getProcessorAttribute(Me).data.store[i];if(r instanceof Element)return r;throw new g(`Can't find child "${i}".`,this)}}}}var Qi=p(()=>{S();At();tn()});var es,nr,iu,fn,ts=p(()=>{S();Z();mt();ce();pt();Ee();re();Je();bt();$t();es=[$e({instructionType:"dynamic-content",trigger:111})];fn=class extends(iu=w){mLastTemplate;mModuleValues;mProcedure;constructor(e=P.use(Q),t=P.use(X)){super(),this.mModuleValues=t,this.mLastTemplate=null,this.mProcedure=this.mModuleValues.createExpressionProcedure(e.value)}onUpdate(){let e=this.mProcedure.execute();if(!e||!(e instanceof fe))throw new g("Dynamic content method has a wrong result type.",this);if(this.mLastTemplate!==null&&this.mLastTemplate.equals(e))return null;let t=e.clone();this.mLastTemplate=t;let n=new Te;return n.addElement(t,new Ce(this.mModuleValues.data)),n}};nr=k(iu),fn=h(nr,0,"DynamicContentInstructionModule",es,fn),u(nr,1,fn)});var ns,or,su,bn,os=p(()=>{Z();ce();Ee();Le();re();zt();gt();Ue();ns=[ze({access:3,selector:/^\([[\w\-$]+\)$/,trigger:127})];bn=class extends(su=w){mEventName;mListener;mTarget;constructor(e=P.use(te),t=P.use(X),n=P.use(be)){super(),this.mTarget=e,this.mEventName=n.name.substring(1,n.name.length-1);let o=t.createExpressionProcedure(n.value,["$event"]);this.mListener=r=>{o.setTemporaryValue("$event",r),o.execute()},this.mTarget.addEventListener(this.mEventName,this.mListener)}onDeconstruct(){this.mTarget.removeEventListener(this.mEventName,this.mListener)}};or=k(su),bn=h(or,0,"EventAttributeModule",ns,bn),u(or,1,bn)});var rs,rr,au,Tn,is=p(()=>{S();Z();mt();ce();pt();Ee();re();Je();ht();bt();$t();rs=[$e({instructionType:"for",trigger:111})];Tn=class extends(au=w){mExpression;mLastEntries;mModuleValues;mTemplate;constructor(e=P.use(Ie),t=P.use(X),n=P.use(Q)){super(),this.mTemplate=e,this.mModuleValues=t,this.mLastEntries=new Array;let o=n.value,s=new RegExp(/^\s*([a-zA-Z]+[a-zA-Z0-9]*)\s*of\s+([^;]+)\s*(;\s*([a-zA-Z]+[a-zA-Z0-9]*)\s*=\s*(.*)\s*)?$/).exec(o);if(!s)throw new g(`For-Parameter value has wrong format: ${o}`,this);let a=s[1],l=s[2],c=s[4]??null,m=s[5],d=this.mModuleValues.createExpressionProcedure(l),y=c?this.mModuleValues.createExpressionProcedure(m,["$index",a]):null;this.mExpression={iterateVariableName:a,iterateValueProcedure:d,indexExportVariableName:c,indexExportProcedure:y}}onUpdate(){let e=new Te,t=this.mExpression.iterateValueProcedure.execute();if(typeof t=="object"&&t!==null||Array.isArray(t)){let n=Symbol.iterator in t?Object.entries([...t]):Object.entries(t);if(this.compareEntries(n,this.mLastEntries))return null;this.mLastEntries=n;for(let[o,r]of n)this.addTemplateForElement(e,this.mExpression,r,o);return e}else return null}addTemplateForElement=(e,t,n,o)=>{let r=new Ce(this.mModuleValues.data);if(r.setTemporaryValue(t.iterateVariableName,n),t.indexExportProcedure&&t.indexExportVariableName){t.indexExportProcedure.setTemporaryValue("$index",o),t.indexExportProcedure.setTemporaryValue(t.iterateVariableName,n);let a=t.indexExportProcedure.execute();r.setTemporaryValue(t.indexExportVariableName,a)}let s=new fe;s.appendChild(...this.mTemplate.childList),e.addElement(s,r)};compareEntries(e,t){if(e.length!==t.length)return!1;for(let n=0;n<e.length;n++){let[o,r]=e[n],[s,a]=t[n];if(o!==s||r!==a)return!1}return!0}};rr=k(au),Tn=h(rr,0,"ForInstructionModule",rs,Tn),u(rr,1,Tn)});var ss,ir,lu,vn,as=p(()=>{Z();mt();ce();pt();Ee();re();Je();ht();bt();$t();ss=[$e({instructionType:"if",trigger:111})];vn=class extends(lu=w){mLastBoolean;mModuleValues;mProcedure;mTemplateReference;constructor(e=P.use(Ie),t=P.use(X),n=P.use(Q)){super(),this.mTemplateReference=e,this.mModuleValues=t,this.mProcedure=this.mModuleValues.createExpressionProcedure(n.value),this.mLastBoolean=!1}onUpdate(){let e=this.mProcedure.execute();if(!!e!==this.mLastBoolean){this.mLastBoolean=!!e;let t=new Te;if(e){let n=new fe;n.appendChild(...this.mTemplateReference.childList),t.addElement(n,new Ce(this.mModuleValues.data))}return t}else return null}};ir=k(lu),vn=h(ir,0,"IfInstructionModule",ss,vn),u(ir,1,vn)});var ls,sr,cu,Pn,cs=p(()=>{Z();ce();Ee();Le();re();zt();gt();Ue();ls=[ze({access:1,selector:/^\[[\w$]+\]$/,trigger:127})];Pn=class extends(cu=w){mLastValue;mProcedure;mTarget;mTargetProperty;constructor(e=P.use(te),t=P.use(X),n=P.use(be)){super(),this.mTarget=e,this.mProcedure=t.createExpressionProcedure(n.value),this.mTargetProperty=n.name.substring(1,n.name.length-1),this.mLastValue=Symbol("Uncomparable")}onUpdate(){let e=this.mProcedure.execute();return e===this.mLastValue?!1:(this.mLastValue=e,Reflect.set(this.mTarget,this.mTargetProperty,e),!0)}};sr=k(cu),Pn=h(sr,0,"OneWayBindingAttributeModule",ls,Pn),u(sr,1,Pn)});var us,ar,uu,Cn,ps=p(()=>{Z();ce();tn();Le();re();ft();zt();gt();Ue();us=[ze({access:3,selector:/^#[[\w$]+$/,trigger:127})];Cn=class extends(uu=w){constructor(e=P.use(te),t=P.use(pe),n=P.use(be),o=P.use(Me)){super();let r=e,s=t.registerObject(r);o.setTemporaryValue(n.name.substring(1),s)}};ar=k(uu),Cn=h(ar,0,"PwbChildAttributeModule",us,Cn),u(ar,1,Cn)});var ds,lr,pu,xn,ms=p(()=>{Z();an();mt();ce();Ee();re();Je();bt();$t();ds=[$e({instructionType:"slot",trigger:0})];xn=class extends(pu=w){mIsSetup;mModuleValues;mSlotName;constructor(e=P.use(X),t=P.use(Q)){super(),this.mModuleValues=e,this.mSlotName=t.value,this.mIsSetup=!1}onUpdate(){if(this.mIsSetup)return null;this.mIsSetup=!0;let e=new Ve;e.tagName="slot",this.mSlotName!==""&&e.setAttribute("name").addValue(this.mSlotName);let t=new fe;t.appendChild(e);let n=new Te;return n.addElement(t,this.mModuleValues.data),n}};lr=k(pu),xn=h(lr,0,"SlotInstructionModule",ds,xn),u(lr,1,xn)});var hs,cr,du,In,ys=p(()=>{ce();Le();re();ft();zt();gt();Ue();Ee();Z();hs=[ze({access:2,selector:/^\[\([[\w$]+\)\]$/,trigger:127})];In=class extends(du=w){mAttributeKey;mLastDataValue;mReadProcedure;mTargetNode;mWriteProcedure;constructor(e=P.use(te),t=P.use(X),n=P.use(be),o=P.use(pe)){super(),this.mTargetNode=e,this.mAttributeKey=n.name.substring(2,n.name.length-2),this.mReadProcedure=t.createExpressionProcedure(n.value),this.mWriteProcedure=t.createExpressionProcedure(`${n.value} = $DATA;`,["$DATA"]),this.mLastDataValue=Symbol("Uncomparable"),o.registerObject(this.mTargetNode)}onUpdate(){let e=this.mReadProcedure.execute();if(e!==this.mLastDataValue)return Reflect.set(this.mTargetNode,this.mAttributeKey,e),this.mLastDataValue=e,!0;let t=Reflect.get(this.mTargetNode,this.mAttributeKey);return t!==e?(this.mWriteProcedure.setTemporaryValue("$DATA",t),this.mWriteProcedure.execute(),this.mLastDataValue=t,!0):!1}};cr=k(du),In=h(cr,0,"TwoWayBindingAttributeModule",hs,In),u(cr,1,In)});var gs,ur,mu,wn,fs=p(()=>{Z();ce();Le();re();dn();ft();Ue();eo();gs=[vt({access:1,trigger:127,targetRestrictions:[pe]})];wn=class extends(mu=w){mEventListenerList;mTargetElement;constructor(e=P.use(pe),t=P.use(te)){super();let n=new Array,o=e.processorConstructor;do{let r=le.get(o).getMetadata(mn.METADATA_USER_EVENT_LISTENER_PROPERIES);if(r)for(let s of r)n.push(s)}while(o=Object.getPrototypeOf(o));this.mEventListenerList=new Array,this.mTargetElement=t;for(let r of n){let[s,a]=r,l=Reflect.get(e.processor,s);l=l.bind(e.processor),this.mEventListenerList.push([a,l]),this.mTargetElement.addEventListener(a,l)}}onDeconstruct(){for(let e of this.mEventListenerList){let[t,n]=e;this.mTargetElement.removeEventListener(t,n)}}};ur=k(mu),wn=h(ur,0,"ComponentEventListenerModuleExtension",gs,wn),u(ur,1,wn)});var de=p(()=>{wi();Gn();Xi();Wi();ce();Ee();Vn();ft();Zn();gt();Ue();ht();Yn();zo();Ft();tn();pt();Un();Ee();dn();zt();Ho();bt();$t();Le();Yi();Qo();Jo();_i();Ji();Qi();zn();rn();an();Bo();on();_o();ts();os();is();as();cs();ps();ms();ys();eo();fs();tr()});var Xt=p(()=>{});var Pt,pr=p(()=>{Pt=class{id;kind;sourceNodeId;sourcePortId;targetNodeId;targetPortId;mValid;get valid(){return this.mValid}set valid(e){this.mValid=e}constructor(e,t,n,o,r,s){this.id=e,this.sourceNodeId=t,this.sourcePortId=n,this.targetNodeId=o,this.targetPortId=r,this.kind=s,this.mValid=!0}}});var bs=p(()=>{});var En,Ts=p(()=>{En=class{direction;id;name;mConnectedTo;get connectedTo(){return this.mConnectedTo}set connectedTo(e){this.mConnectedTo=e}constructor(e,t,n){this.id=e,this.name=t,this.direction=n,this.mConnectedTo=null}}});var kn,vs=p(()=>{kn=class{direction;id;name;type;valueId;mConnectedTo;get connectedTo(){return this.mConnectedTo}set connectedTo(e){this.mConnectedTo=e}constructor(e,t,n,o,r){this.id=e,this.name=t,this.type=n,this.direction=o,this.valueId=r,this.mConnectedTo=null}}});var Ct,dr=p(()=>{bs();Ts();vs();Ct=class i{category;definitionName;flowInputs;flowOutputs;id;inputs;outputs;properties;system;mPosition;mSize;get position(){return this.mPosition}get size(){return this.mSize}constructor(e,t,n,o){this.id=e,this.definitionName=t.name,this.category=t.category,this.system=o,this.mPosition={x:n.x,y:n.y},this.mSize={w:8,h:4},this.properties=new Map,this.inputs=new Map,this.flowInputs=new Map;for(let[r,s]of Object.entries(t.inputs))if(s.nodeType==="flow"){let a=i.generatePortId();this.flowInputs.set(r,new En(a,r,"input"))}else{let a=i.generatePortId(),l=i.generateValueId(t.category),c=i.getPortDataType(s);this.inputs.set(r,new kn(a,r,c,"input",l))}this.outputs=new Map,this.flowOutputs=new Map;for(let[r,s]of Object.entries(t.outputs))if(s.nodeType==="flow"){let a=i.generatePortId();this.flowOutputs.set(r,new En(a,r,"output"))}else{let a=i.generatePortId(),l=i.generateValueId(t.category),c=i.getPortDataType(s);this.outputs.set(r,new kn(a,r,c,"output",l))}}moveTo(e,t){this.mPosition={x:e,y:t}}resizeTo(e,t){this.mSize={w:Math.max(4,e),h:Math.max(2,t)}}static getPortDataType(e){return e.nodeType==="value"||e.nodeType==="input"?e.dataType:""}static generatePortId(){return crypto.randomUUID().substring(0,8)}static generateValueId(e){let t=crypto.randomUUID().replace(/-/g,"").substring(0,12);return`${String(e).replace(/[^a-zA-Z0-9]/g,"")}_${t}`}}});var to,Ps=p(()=>{Xt();pr();dr();to=class{mConnections;mNodes;get connections(){return this.mConnections}get nodes(){return this.mNodes}constructor(){this.mNodes=new Map,this.mConnections=new Map}addNode(e,t,n=!1){let o=crypto.randomUUID(),r=new Ct(o,e,t,n);return this.mNodes.set(o,r),r}addExistingNode(e){this.mNodes.set(e.id,e)}removeNode(e){let t=new Array;for(let[n,o]of this.mConnections)(o.sourceNodeId===e||o.targetNodeId===e)&&(t.push(o),this.mConnections.delete(n));return this.mNodes.delete(e),t}addConnection(e,t,n,o,r){let s=this.mNodes.get(e),a=this.mNodes.get(n);if(!s||!a||e===n)return null;if(r==="data"){let l=this.findDataPortById(s,t),c=this.findDataPortById(a,o);if(!l||!c)return null;let m=l.type===c.type;for(let[C,G]of this.mConnections)if(G.targetNodeId===n&&G.targetPortId===o&&G.kind==="data"){this.mConnections.delete(C);break}c.connectedTo=l.valueId;let d=crypto.randomUUID(),y=new Pt(d,e,t,n,o,r);return y.valid=m,this.mConnections.set(d,y),y}else{let l=this.findFlowPortById(s,t),c=this.findFlowPortById(a,o);if(!l||!c)return null;for(let[y,C]of this.mConnections)if(C.sourceNodeId===e&&C.sourcePortId===t&&C.kind==="flow"){this.mConnections.delete(y);break}l.connectedTo=c.id,c.connectedTo=l.id;let m=crypto.randomUUID(),d=new Pt(m,e,t,n,o,r);return this.mConnections.set(m,d),d}}addExistingConnection(e){this.mConnections.set(e.id,e)}removeConnection(e){let t=this.mConnections.get(e);if(!t)return null;let n=this.mNodes.get(t.targetNodeId);if(n)if(t.kind==="data"){let o=this.findDataPortById(n,t.targetPortId);o&&(o.connectedTo=null)}else{let o=this.mNodes.get(t.sourceNodeId),r=o?this.findFlowPortById(o,t.sourcePortId):null,s=this.findFlowPortById(n,t.targetPortId);r&&(r.connectedTo=null),s&&(s.connectedTo=null)}return this.mConnections.delete(e),t}validate(){let e=new Array;for(let t of this.mConnections.values()){if(t.kind!=="data")continue;let n=this.mNodes.get(t.sourceNodeId),o=this.mNodes.get(t.targetNodeId);if(!n||!o){t.valid=!1,e.push(t);continue}let r=this.findDataPortById(n,t.sourcePortId),s=this.findDataPortById(o,t.targetPortId);if(!r||!s){t.valid=!1,e.push(t);continue}let a=r.type===s.type;t.valid=a,a||e.push(t)}return e}getNode(e){return this.mNodes.get(e)}getConnection(e){return this.mConnections.get(e)}getConnectionsForNode(e){let t=new Array;for(let n of this.mConnections.values())(n.sourceNodeId===e||n.targetNodeId===e)&&t.push(n);return t}findDataPortById(e,t){for(let n of e.inputs.values())if(n.id===t)return n;for(let n of e.outputs.values())if(n.id===t)return n;return null}findFlowPortById(e,t){for(let n of e.flowInputs.values())if(n.id===t)return n;for(let n of e.flowOutputs.values())if(n.id===t)return n;return null}}});var xt,mr=p(()=>{Ps();xt=class{editableByUser;graph;id;system;mImports;mInputs;mLabel;mLocalVariables;mName;mOutputs;get imports(){return this.mImports}get inputs(){return this.mInputs}get localVariables(){return this.mLocalVariables}get label(){return this.mLabel}get name(){return this.mName}get outputs(){return this.mOutputs}constructor(e,t,n,o,r=!1){this.id=e,this.mName=t,this.mLabel=n,this.system=o,this.editableByUser=r,this.graph=new to,this.mInputs={},this.mOutputs={},this.mImports=new Array,this.mLocalVariables=new Array}setName(e){this.mName=e}setLabel(e){this.mLabel=e}setInputs(e){this.mInputs={...e}}setOutputs(e){this.mOutputs={...e}}setImports(e){this.mImports=[...e]}addImport(e){this.mImports.includes(e)||this.mImports.push(e)}removeImport(e){let t=this.mImports.indexOf(e);t!==-1&&this.mImports.splice(t,1)}addInput(e,t){this.mInputs[e]=t}removeInput(e){delete this.mInputs[e]}addOutput(e,t){this.mOutputs[e]=t}removeOutput(e){delete this.mOutputs[e]}addLocalVariable(e,t){this.mLocalVariables.push({name:e,type:t})}removeLocalVariable(e){this.mLocalVariables.splice(e,1)}setLocalVariables(e){this.mLocalVariables=[...e]}}});var oo,Cs=p(()=>{st();Xt();pr();dr();mr();xo();oo=class{mConfig;constructor(e){this.mConfig=e}deserialize(e){let t=new kt,n=this.parseMetadataComment(e);if(!n)return t;for(let r of n.functions){let s=this.reconstructFunction(r);this.reconstructNodes(s,r.nodes),this.restoreAllPortData(s,r.nodes),this.reconstructConnections(s,r.connections),t.addFunction(s)}let o=t.functions.keys().next().value;return o&&t.setActiveFunction(o),t}parseMetadataComment(e){let n=`${this.mConfig.commentToken} #potatno `,o=e.split(`
`);for(let r=o.length-1;r>=0;r--){let s=o[r].trim();if(s.startsWith(n)){let a=s.substring(n.length);try{return JSON.parse(a)}catch{return null}}}return null}reconstructFunction(e){let t=new xt(e.id,e.name,e.label,e.system,e.editableByUser);return e.inputs&&typeof e.inputs=="object"&&t.setInputs(e.inputs),e.outputs&&typeof e.outputs=="object"&&t.setOutputs(e.outputs),Array.isArray(e.imports)&&t.setImports(e.imports),t}reconstructNodes(e,t){for(let n of t){let o=n.category,r=this.mConfig.nodeDefinitions.get(n.type);if(r){let s=new Ct(n.id,r,n.position??{x:0,y:0},n.system??!1);if(n.size&&s.resizeTo(n.size.w,n.size.h),n.properties)for(let[a,l]of Object.entries(n.properties))s.properties.set(a,l);e.graph.addExistingNode(s)}else if(o==="input"||o==="output"){let s={};for(let m of n.inputs??[])s[m.name]={nodeType:"value",dataType:m.type};let a={};for(let m of n.outputs??[])a[m.name]={nodeType:"value",dataType:m.type};let l={name:n.type,category:o,inputs:s,outputs:a},c=new Ct(n.id,l,n.position??{x:0,y:0},n.system??!0);if(n.size&&c.resizeTo(n.size.w,n.size.h),n.properties)for(let[m,d]of Object.entries(n.properties))c.properties.set(m,d);e.graph.addExistingNode(c)}}}restoreAllPortData(e,t){for(let n of t){let o=e.graph.getNode(n.id);if(o){if(Array.isArray(n.inputs))for(let r of n.inputs){let s=o.inputs.get(r.name);s&&r.connectedTo&&(s.connectedTo=r.connectedTo)}if(Array.isArray(n.flowInputs))for(let r of n.flowInputs){let s=o.flowInputs.get(r.name);s&&r.connectedTo&&(s.connectedTo=r.connectedTo)}if(Array.isArray(n.flowOutputs))for(let r of n.flowOutputs){let s=o.flowOutputs.get(r.name);s&&r.connectedTo&&(s.connectedTo=r.connectedTo)}}}}reconstructConnections(e,t){for(let n of t){let o=n.kind==="flow"?"flow":"data",r=new Pt(n.id,n.sourceNodeId,n.sourcePortId,n.targetNodeId,n.targetPortId,o);r.valid=n.valid??!0,e.graph.addExistingConnection(r)}}}});var ie,tt=p(()=>{ie=class{mBody;mInputs;mOutputs;mProperties;get body(){return this.mBody}get inputs(){return this.mInputs}get outputs(){return this.mOutputs}get properties(){return this.mProperties}constructor(){this.mInputs=new Map,this.mOutputs=new Map,this.mBody=new Map,this.mProperties=new Map}buildContext(){let e={};for(let[n,o]of this.mInputs)switch(o.nodeType){case"flow":e[n]={code:""};break;case"input":e[n]={value:this.mProperties.get(n)??"",valueId:o.valueId};break;case"value":e[n]={valueId:o.valueId};break}let t={};for(let[n,o]of this.mOutputs)switch(o.nodeType){case"flow":{let r=this.mBody.get(n);t[n]={code:r?.code??""};break}case"input":t[n]={value:this.mProperties.get(n)??"",valueId:o.valueId};break;case"value":t[n]={valueId:o.valueId};break}return{inputs:e,outputs:t}}}});var ro,xs=p(()=>{tt();ro=class extends ie{get commentText(){return this.properties.get("comment")??""}set commentText(e){this.properties.set("comment",e)}generateCode(){return""}}});var nt,io=p(()=>{tt();nt=class extends ie{mCodeGenerator;constructor(e){super(),this.mCodeGenerator=e}generateCode(){return this.mCodeGenerator(this.buildContext())}}});var so,Is=p(()=>{io();so=class extends nt{}});var ao,ws=p(()=>{tt();ao=class extends ie{generateCode(){return""}}});var lo,Es=p(()=>{tt();lo=class extends ie{generateCode(){return""}}});var co,ks=p(()=>{tt();co=class extends ie{generateCode(){return""}}});var uo,Ns=p(()=>{tt();uo=class extends ie{generateCode(){return""}}});var po,Ds=p(()=>{tt();po=class extends ie{generateCode(){let e=this.properties.get("variableName")??"undefined",n=this.inputs.values().next().value?.valueId??"undefined";return`${e} = ${n};`}}});var mo,As=p(()=>{io();mo=class extends nt{get value(){return this.properties.get("value")??""}set value(e){this.properties.set("value",e)}}});var ho,Ss=p(()=>{ho=class{bodyCode;inputs;name;outputs;constructor(){this.name="",this.bodyCode="",this.inputs=new Array,this.outputs=new Array}}});var Nn,Ls=p(()=>{st();Xt();xs();Is();ws();Es();ks();Ns();Ds();io();As();Ss();Nn=class i{mConfig;constructor(e){this.mConfig=e}generateFunctionCode(e){let t=e.graph,n=this.generateGraphCode(t),o=[];for(let s of e.localVariables)o.push(`    let ${s.name};`);o.length>0&&(n=o.join(`
`)+`
`+n);let r=new ho;r.name=e.name,r.bodyCode=n;for(let[s,a]of Object.entries(e.inputs)){let l=this.findInputNodeValueId(t,s),c=i.getPortDataType(a);r.inputs.push({name:s,type:c,valueId:l})}for(let[s,a]of Object.entries(e.outputs)){let l=this.findOutputNodeValueId(t,s),c=i.getPortDataType(a);r.outputs.push({name:s,type:c,valueId:l})}return this.mConfig.functionCodeGenerator?this.mConfig.functionCodeGenerator(r):n}generateProjectCode(e){let t=new Array;for(let n of e.values())t.push(this.generateFunctionCode(n));return t.join(`

`)}generateGraphCode(e){let t=this.topologicalSort(e),n=new Array;for(let o of t){if(o.category==="input"||o.category==="output"||o.category==="reroute"||o.category==="getlocal"||!this.mConfig.nodeDefinitions.get(o.definitionName))continue;let s=this.buildCodeNode(e,o);for(let[l,c]of o.flowOutputs)if(c.connectedTo){let m=this.generateFlowBodyCode(e,c.connectedTo);s.body.set(l,{code:m})}else s.body.set(l,{code:""});let a=s.generateCode();n.push(a)}return n.join(`
`)}generateFlowBodyCode(e,t){let n=new Array,o=t;for(;o;){let r=this.findNodeByFlowPortId(e,o);if(!r||!this.mConfig.nodeDefinitions.get(r.definitionName))break;let a=this.buildCodeNode(e,r);for(let[c,m]of r.flowOutputs)if(m.connectedTo){let d=this.generateFlowBodyCode(e,m.connectedTo);a.body.set(c,{code:d})}else a.body.set(c,{code:""});let l=a.generateCode();n.push(l),o=null}return n.join(`
`)}buildCodeNode(e,t){let n=this.mConfig.nodeDefinitions.get(t.definitionName),o=n?.codeGenerator??(()=>""),r=this.createNodeForCategory(t.category,o),s=n?Object.fromEntries(Object.entries(n.inputs)):{},a=n?Object.fromEntries(Object.entries(n.outputs)):{};for(let[l,c]of t.inputs){let m=this.resolveRerouteChain(e,c.connectedTo??c.valueId),d=s[l]?.nodeType??"value";r.inputs.set(l,{name:l,type:c.type,valueId:m,nodeType:d})}for(let[l]of t.flowInputs)r.inputs.set(l,{name:l,type:"",valueId:"",nodeType:"flow"});for(let[l,c]of t.outputs){let m=a[l]?.nodeType??"value";r.outputs.set(l,{name:l,type:c.type,valueId:c.valueId,nodeType:m})}for(let[l]of t.flowOutputs)r.outputs.set(l,{name:l,type:"",valueId:"",nodeType:"flow"});for(let[l,c]of t.properties)r.properties.set(l,c);if(t.category==="getlocal"){let l=t.properties.get("variableName")??"",c=r.outputs.values().next().value;c&&l&&r.outputs.set(c.name,{name:c.name,type:c.type,valueId:l,nodeType:c.nodeType})}return r}createNodeForCategory(e,t){switch(e){case"comment":return new ro;case"input":return new lo;case"output":return new co;case"value":return new mo(t);case"flow":return new so(t);case"reroute":return new uo;case"getlocal":return new ao;case"setlocal":return new po;default:return new nt(t)}}topologicalSort(e){let t=new Set,n=new Array,o=new Map;for(let s of e.nodes.values())o.set(s.id,new Set);for(let s of e.connections.values())if(s.kind==="data"){let a=o.get(s.targetNodeId);a&&a.add(s.sourceNodeId)}let r=s=>{if(t.has(s))return;t.add(s);let a=o.get(s);if(a)for(let c of a)r(c);let l=e.getNode(s);l&&n.push(l)};for(let s of e.nodes.keys())r(s);return n}findInputNodeValueId(e,t){for(let n of e.nodes.values())if(n.category==="input"&&n.definitionName===t){let o=n.outputs.values().next().value;if(o)return o.valueId}return t}findOutputNodeValueId(e,t){for(let n of e.nodes.values())if(n.category==="output"&&n.definitionName===t){let o=n.inputs.values().next().value;return o&&o.connectedTo?this.resolveRerouteChain(e,o.connectedTo):o?.valueId??t}return t}resolveRerouteChain(e,t){for(let n of e.nodes.values())for(let o of n.outputs.values())if(o.valueId===t&&n.category==="reroute"){let r=n.inputs.values().next().value;return r&&r.connectedTo?this.resolveRerouteChain(e,r.connectedTo):r?.valueId??t}return t}findNodeByFlowPortId(e,t){for(let n of e.nodes.values()){for(let o of n.flowInputs.values())if(o.id===t)return n;for(let o of n.flowOutputs.values())if(o.id===t)return n}return null}static getPortDataType(e){return e.nodeType==="value"||e.nodeType==="input"?e.dataType:""}}});var Dn,Ms=p(()=>{Ls();Dn=class{mConfig;constructor(e){this.mConfig=e}serialize(e){let n=new Nn(this.mConfig).generateProjectCode(e.functions),o=this.buildMetadata(e),s=`${this.mConfig.commentToken} #potatno ${JSON.stringify(o)}`;return`${n}
${s}`}serializeFunction(e){let n=new Nn(this.mConfig).generateFunctionCode(e),o={functions:[this.serializeFunctionData(e)]},s=`${this.mConfig.commentToken} #potatno ${JSON.stringify(o)}`;return`${n}
${s}`}buildMetadata(e){let t=new Array;for(let n of e.functions.values())t.push(this.serializeFunctionData(n));return{functions:t}}serializeFunctionData(e){let t=new Array,n=new Array;for(let o of e.graph.nodes.values())t.push(this.serializeNode(o));for(let o of e.graph.connections.values())n.push(this.serializeConnection(o));return{id:e.id,name:e.name,label:e.label,system:e.system,editableByUser:e.editableByUser,inputs:{...e.inputs},outputs:{...e.outputs},imports:[...e.imports],nodes:t,connections:n}}serializeNode(e){let t=new Array;for(let[a,l]of e.inputs)t.push({name:a,type:l.type,id:l.id,valueId:l.valueId,connectedTo:l.connectedTo});let n=new Array;for(let[a,l]of e.outputs)n.push({name:a,type:l.type,id:l.id,valueId:l.valueId});let o=new Array;for(let[a,l]of e.flowInputs)o.push({name:a,id:l.id,connectedTo:l.connectedTo});let r=new Array;for(let[a,l]of e.flowOutputs)r.push({name:a,id:l.id,connectedTo:l.connectedTo});let s={};for(let[a,l]of e.properties)s[a]=l;return{id:e.id,type:e.definitionName,category:e.category,position:e.position,size:e.size,system:e.system,properties:s,inputs:t,outputs:n,flowInputs:o,flowOutputs:r}}serializeConnection(e){return{id:e.id,kind:e.kind,sourceNodeId:e.sourceNodeId,sourcePortId:e.sourcePortId,targetNodeId:e.targetNodeId,targetPortId:e.targetPortId,valid:e.valid}}}});var Wt,hr=p(()=>{Wt=class i{static MAX_ZOOM=2;static MIN_ZOOM=.25;mGridSize;mPanX;mPanY;mSelectionEnd;mSelectionStart;mZoom;get gridSize(){return this.mGridSize}get panX(){return this.mPanX}get panY(){return this.mPanY}get selectionEnd(){return this.mSelectionEnd}get selectionStart(){return this.mSelectionStart}get zoom(){return this.mZoom}constructor(e=20){this.mGridSize=e,this.mPanX=0,this.mPanY=0,this.mZoom=1,this.mSelectionStart=null,this.mSelectionEnd=null}clearSelection(){this.mSelectionStart=null,this.mSelectionEnd=null}getGridBackgroundCss(){let e=this.mGridSize*this.mZoom,t=this.mPanX%e,n=this.mPanY%e,o=e*5,r=this.mPanX%o,s=this.mPanY%o;return[`background-size: ${e}px ${e}px, ${o}px ${o}px`,`background-position: ${t}px ${n}px, ${r}px ${s}px`,"background-image: radial-gradient(circle, var(--pn-grid-color) 1px, transparent 1px), radial-gradient(circle, var(--pn-grid-color) 1.5px, transparent 1.5px)"].join("; ")}getTransformCss(){return`translate(${this.mPanX}px, ${this.mPanY}px) scale(${this.mZoom})`}pan(e,t){this.mPanX+=e,this.mPanY+=t}screenToWorld(e,t){return{x:(e-this.mPanX)/this.mZoom,y:(t-this.mPanY)/this.mZoom}}setSelectionEnd(e,t){this.mSelectionEnd={x:e,y:t}}setSelectionStart(e,t){this.mSelectionStart={x:e,y:t}}snapToGrid(e,t){return{x:Math.round(e/this.mGridSize)*this.mGridSize,y:Math.round(t/this.mGridSize)*this.mGridSize}}worldToScreen(e,t){return{x:e*this.mZoom+this.mPanX,y:t*this.mZoom+this.mPanY}}zoomAt(e,t,n){let o=this.mZoom,r=1+n,s=this.mZoom*r;s=Math.max(i.MIN_ZOOM,Math.min(i.MAX_ZOOM,s));let a=(e-this.mPanX)/o,l=(t-this.mPanY)/o;this.mZoom=s,this.mPanX=e-a*this.mZoom,this.mPanY=t-l*this.mZoom}}});var yr,gr,Zt,fr=p(()=>{yr="http://www.w3.org/2000/svg",gr="data-temp-connection",Zt=class{clearAll(e){let t=e.querySelectorAll("path");for(let n of t)n.remove()}clearTempConnection(e){let t=e.querySelector(`[${gr}]`);t&&t.remove()}generateBezierPath(e,t,n,o){let r=Math.abs(n-e),s=Math.max(r*.4,50),a=e+s,l=t,c=n-s;return`M ${e} ${t} C ${a} ${l}, ${c} ${o}, ${n} ${o}`}renderConnections(e,t){let n=e.querySelectorAll(`path:not([${gr}])`);for(let o of n)o.remove();for(let o of t){let r=this.generateBezierPath(o.sourceX,o.sourceY,o.targetX,o.targetY),s=document.createElementNS(yr,"path");s.setAttribute("d",r),s.setAttribute("fill","none"),s.setAttribute("data-connection-id",o.id),s.setAttribute("data-hit-area","true"),s.style.stroke="transparent",s.style.strokeWidth="12",s.style.pointerEvents="stroke",s.style.cursor="pointer",e.appendChild(s);let a=document.createElementNS(yr,"path");a.setAttribute("d",r),a.setAttribute("fill","none"),a.setAttribute("data-connection-id",o.id),a.style.stroke=o.valid?"#a6adc8":"#f38ba8",a.style.strokeWidth="2",a.style.pointerEvents="none",o.valid||a.setAttribute("stroke-dasharray","6 3"),e.appendChild(a)}}renderTempConnection(e,t,n,o){this.clearTempConnection(e);let r=document.createElementNS(yr,"path");r.setAttribute("d",this.generateBezierPath(t.x,t.y,n.x,n.y)),r.setAttribute("fill","none"),r.setAttribute(gr,"true"),r.style.stroke=o,r.style.strokeWidth="2",r.style.opacity="0.6",r.style.strokeDasharray="8 4",r.style.pointerEvents="none",e.appendChild(r)}}});var yo,Rs=p(()=>{Xt();yo=class{mData;get hasData(){return this.mData!==null}constructor(){this.mData=null}copy(e,t){let n=new Array,o=new Map;for(let a of t){let l=e.getNode(a);l&&!l.system&&(o.set(l.id,n.length),n.push(l))}if(n.length===0)return;let r=n.map(a=>{let l={};for(let[m,d]of a.properties)l[m]=d;let c=new Array;for(let[m,d]of a.inputs)d.connectedTo&&c.push({portName:m,connectedValueId:d.connectedTo});return{definitionName:a.definitionName,position:{...a.position},size:{...a.size},properties:l,inputConnections:c}}),s=[];for(let a of e.connections.values()){let l=o.get(a.sourceNodeId),c=o.get(a.targetNodeId);if(l!==void 0&&c!==void 0){let m=n[l],d=n[c],y="",C="",G;if(a.kind==="data"){G="data";for(let[x,b]of m.outputs)if(b.id===a.sourcePortId){y=x;break}for(let[x,b]of d.inputs)if(b.id===a.targetPortId){C=x;break}}else{G="flow";for(let[x,b]of m.flowOutputs)if(b.id===a.sourcePortId){y=x;break}for(let[x,b]of d.flowInputs)if(b.id===a.targetPortId){C=x;break}}y&&C&&s.push({sourceNodeIndex:l,sourcePortName:y,targetNodeIndex:c,targetPortName:C,kind:G})}}this.mData={nodes:r,internalConnections:s}}getData(){return this.mData}}});var An,Os=p(()=>{An=class{description;mActions;constructor(e,t){this.description=e,this.mActions=t}apply(){for(let e of this.mActions)e.apply()}revert(){for(let e=this.mActions.length-1;e>=0;e--)this.mActions[e].revert()}}});var go,Fs=p(()=>{go=class{mMaxSize;mRedoStack;mUndoStack;get canRedo(){return this.mRedoStack.length>0}get canUndo(){return this.mUndoStack.length>0}constructor(e=100){this.mUndoStack=new Array,this.mRedoStack=new Array,this.mMaxSize=e}push(e){e.apply(),this.mUndoStack.push(e),this.mRedoStack.length=0,this.mUndoStack.length>this.mMaxSize&&this.mUndoStack.shift()}undo(){let e=this.mUndoStack.pop();e&&(e.revert(),this.mRedoStack.push(e))}redo(){let e=this.mRedoStack.pop();e&&(e.apply(),this.mUndoStack.push(e))}clear(){this.mUndoStack.length=0,this.mRedoStack.length=0}}});var Sn,fo,Gs=p(()=>{Sn=class{description;mDefinition;mGraph;mNode;mPosition;mSystem;get node(){return this.mNode}constructor(e,t,n,o=!1){this.description=`Add node: ${t.name}`,this.mGraph=e,this.mDefinition=t,this.mPosition=n,this.mSystem=o,this.mNode=null}apply(){this.mNode?this.mGraph.addExistingNode(this.mNode):this.mNode=this.mGraph.addNode(this.mDefinition,this.mPosition,this.mSystem)}revert(){this.mNode&&this.mGraph.removeNode(this.mNode.id)}},fo=class{description;mGraph;mNodeId;mRemovedConnections;mRemovedNode;constructor(e,t){this.description="Remove node",this.mGraph=e,this.mNodeId=t,this.mRemovedNode=null,this.mRemovedConnections=new Array}apply(){this.mRemovedNode=this.mGraph.getNode(this.mNodeId)??null,this.mRemovedConnections=this.mGraph.removeNode(this.mNodeId)}revert(){if(this.mRemovedNode){this.mGraph.addExistingNode(this.mRemovedNode);for(let e of this.mRemovedConnections)this.mGraph.addExistingConnection(e)}}}});var Ln,js=p(()=>{Ln=class{description;mNewValue;mNode;mOldValue;mPropertyName;constructor(e,t,n){this.description=`Change property: ${t}`,this.mNode=e,this.mPropertyName=t,this.mNewValue=n,this.mOldValue=e.properties.get(t)??""}apply(){this.mOldValue=this.mNode.properties.get(this.mPropertyName)??"",this.mNode.properties.set(this.mPropertyName,this.mNewValue)}revert(){this.mOldValue===""?this.mNode.properties.delete(this.mPropertyName):this.mNode.properties.set(this.mPropertyName,this.mOldValue)}}});var Vs,Bs=p(()=>{Vs=`:host {\r
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
`});var zs,Us=p(()=>{zs=`<div class="editor-layout">\r
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
</div>`});var Hs,$s=p(()=>{Hs=`:host {\r
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
`});var Xs,Ks=p(()=>{Xs=`<div #viewport class="viewport" (pointerdown)="this.onPointerDown($event)" (pointermove)="this.onPointerMove($event)" (pointerup)="this.onPointerUp($event)" (wheel)="this.onWheel($event)" (contextmenu)="this.onContextMenu($event)" (keydown)="this.onKeyDown($event)" tabindex="0">\r
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
`});var Ws,Zs,Ys,_s,qs,Js,Qs,ea,ta,na,oa,ra,ia,j,br,Tr,vr,Pr,Cr,xr,Ir,se,sa=p(()=>{de();hr();fr();$s();Ks();ia=[U({selector:"potatno-canvas",template:Xs,style:Hs})];se=class extends(ra=w,oa=[I],na=[I],ta=[I],ea=[I],Qs=[L("canvas-connect")],Js=[L("canvas-delete")],qs=[L("canvas-node-move")],_s=[L("canvas-node-select")],Ys=[L("canvas-select")],Zs=[me("svgLayer")],Ws=[me("viewport")],ra){constructor(){super();f(this,"connections",u(j,36,this,[])),u(j,39,this);f(this,"gridSize",u(j,40,this,20)),u(j,43,this);f(this,"nodes",u(j,44,this,[])),u(j,47,this);f(this,"selectedNodeIds",u(j,48,this,new Set)),u(j,51,this);N(this,br,u(j,8,this)),u(j,11,this);N(this,Tr,u(j,12,this)),u(j,15,this);N(this,vr,u(j,16,this)),u(j,19,this);N(this,Pr,u(j,20,this)),u(j,23,this);N(this,Cr,u(j,24,this)),u(j,27,this);N(this,xr,u(j,28,this)),u(j,31,this);N(this,Ir,u(j,32,this)),u(j,35,this);f(this,"mDragNodeId",null);f(this,"mDragStartWorldX",0);f(this,"mDragStartWorldY",0);f(this,"mInteraction");f(this,"mMode","idle");f(this,"mPointerId",null);f(this,"mRenderer");f(this,"mWireColor","var(--pn-accent-primary)");f(this,"mWirePortKind","");f(this,"mWireSourceNodeId","");f(this,"mWireSourcePortId","");f(this,"mWireStartWorld",{x:0,y:0});this.mInteraction=new Wt(this.gridSize),this.mRenderer=new Zt}get gridStyle(){let t=`transform: ${this.mInteraction.getTransformCss()}`,n=this.mInteraction.getGridBackgroundCss();return`${t}; ${n}`}get selectionBoxStyle(){let t=this.mInteraction.selectionStart,n=this.mInteraction.selectionEnd;if(!t||!n)return"display: none";let o=this.mInteraction.worldToScreen(t.x,t.y),r=this.mInteraction.worldToScreen(n.x,n.y),s=Math.min(o.x,r.x),a=Math.min(o.y,r.y),l=Math.abs(r.x-o.x),c=Math.abs(r.y-o.y);return`left: ${s}px; top: ${a}px; width: ${l}px; height: ${c}px`}get showSelectionBox(){return this.mMode==="selectingBox"&&this.mInteraction.selectionStart!==null&&this.mInteraction.selectionEnd!==null}onContextMenu(t){t.preventDefault()}onKeyDown(t){(t.key==="Delete"||t.key==="Backspace")&&this.selectedNodeIds.size>0&&this.mDeleteEvent.dispatchEvent({nodeIds:new Set(this.selectedNodeIds)})}onPointerDown(t){if(this.mMode!=="idle")return;let n=t.target,o=this.mViewport.getBoundingClientRect(),r=t.clientX-o.left,s=t.clientY-o.top;if(t.button===1){this.mMode="panning",this.mPointerId=t.pointerId,this.mViewport.setPointerCapture(t.pointerId),this.mViewport.classList.add("panning"),t.preventDefault();return}if(t.button===0){let a=n.closest("[data-port-id]");if(a){this.beginWireDrag(a,r,s),this.mPointerId=t.pointerId,this.mViewport.setPointerCapture(t.pointerId),t.preventDefault();return}let l=n.closest("[data-node-id]");if(l){this.beginNodeDrag(l,r,s,t.shiftKey||t.ctrlKey||t.metaKey),this.mPointerId=t.pointerId,this.mViewport.setPointerCapture(t.pointerId),t.preventDefault();return}this.beginSelectionBox(r,s),this.mPointerId=t.pointerId,this.mViewport.setPointerCapture(t.pointerId),t.preventDefault()}}onPointerMove(t){if(this.mPointerId!==t.pointerId)return;let n=this.mViewport.getBoundingClientRect(),o=t.clientX-n.left,r=t.clientY-n.top;switch(this.mMode){case"panning":this.mInteraction.pan(t.movementX,t.movementY),this.updateConnections();break;case"draggingNode":this.updateNodeDrag(o,r);break;case"draggingWire":this.updateWireDrag(o,r);break;case"selectingBox":this.updateSelectionBox(o,r);break}}onPointerUp(t){if(this.mPointerId!==t.pointerId)return;let n=t.target;switch(this.mMode){case"panning":this.mViewport.classList.remove("panning");break;case"draggingNode":this.endNodeDrag();break;case"draggingWire":this.endWireDrag(n);break;case"selectingBox":this.endSelectionBox();break}this.mPointerId!==null&&this.mViewport.releasePointerCapture(this.mPointerId),this.mPointerId=null,this.mMode="idle"}onWheel(t){t.preventDefault();let n=this.mViewport.getBoundingClientRect(),o=t.clientX-n.left,r=t.clientY-n.top;this.mInteraction.zoomAt(o,r,t.deltaY),this.updateConnections()}updateConnections(){this.mRenderer.renderConnections(this.mSvgLayer,this.connections)}beginNodeDrag(t,n,o,r){let s=t.dataset.nodeId;if(!s)return;this.mMode="draggingNode",this.mDragNodeId=s;let a=this.mInteraction.screenToWorld(n,o);this.mDragStartWorldX=a.x,this.mDragStartWorldY=a.y,this.mNodeSelectEvent.dispatchEvent({nodeId:s,additive:r})}beginSelectionBox(t,n){this.mMode="selectingBox";let o=this.mInteraction.screenToWorld(t,n);this.mInteraction.setSelectionStart(o.x,o.y),this.mInteraction.setSelectionEnd(o.x,o.y)}beginWireDrag(t,n,o){this.mMode="draggingWire",this.mWireSourceNodeId=t.dataset.nodeId??"",this.mWireSourcePortId=t.dataset.portId??"",this.mWirePortKind=t.dataset.portKind??"",this.mWireColor=t.dataset.portColor??"var(--pn-accent-primary)";let r=this.mInteraction.screenToWorld(n,o);this.mWireStartWorld={x:r.x,y:r.y}}endNodeDrag(){if(!this.mDragNodeId)return;let t=this.nodes.find(n=>n.id===this.mDragNodeId);if(t){let n=this.mInteraction.snapToGrid(t.x,t.y);this.mNodeMoveEvent.dispatchEvent({nodeId:this.mDragNodeId,newX:n.x,newY:n.y})}this.mDragNodeId=null}endSelectionBox(){let t=this.mInteraction.selectionStart,n=this.mInteraction.selectionEnd;if(t&&n){let o=Math.min(t.x,n.x),r=Math.min(t.y,n.y),s=Math.max(t.x,n.x),a=Math.max(t.y,n.y),l=new Set;for(let c of this.nodes){let m=c.x+c.width,d=c.y+c.height;c.x<s&&m>o&&c.y<a&&d>r&&l.add(c.id)}this.mSelectEvent.dispatchEvent({nodeIds:l})}this.mInteraction.clearSelection()}endWireDrag(t){this.mRenderer.clearTempConnection(this.mSvgLayer);let n=t.closest("[data-port-id]");if(n){let o=n.dataset.nodeId??"",r=n.dataset.portId??"";o&&r&&(o!==this.mWireSourceNodeId||r!==this.mWireSourcePortId)&&this.mConnectEvent.dispatchEvent({sourceNodeId:this.mWireSourceNodeId,sourcePortId:this.mWireSourcePortId,targetNodeId:o,targetPortId:r,portKind:this.mWirePortKind})}this.mWireSourceNodeId="",this.mWireSourcePortId="",this.mWirePortKind=""}updateNodeDrag(t,n){if(!this.mDragNodeId)return;let o=this.mInteraction.screenToWorld(t,n),r=o.x-this.mDragStartWorldX,s=o.y-this.mDragStartWorldY;this.mDragStartWorldX=o.x,this.mDragStartWorldY=o.y;let a=this.nodes.find(l=>l.id===this.mDragNodeId);a&&this.mNodeMoveEvent.dispatchEvent({nodeId:this.mDragNodeId,newX:a.x+r,newY:a.y+s}),this.updateConnections()}updateSelectionBox(t,n){let o=this.mInteraction.screenToWorld(t,n);this.mInteraction.setSelectionEnd(o.x,o.y)}updateWireDrag(t,n){let o=this.mInteraction.screenToWorld(t,n);this.mRenderer.renderTempConnection(this.mSvgLayer,this.mWireStartWorld,o,this.mWireColor)}};j=k(ra),br=new WeakMap,Tr=new WeakMap,vr=new WeakMap,Pr=new WeakMap,Cr=new WeakMap,xr=new WeakMap,Ir=new WeakMap,h(j,4,"mConnectEvent",Qs,se,br),h(j,4,"mDeleteEvent",Js,se,Tr),h(j,4,"mNodeMoveEvent",qs,se,vr),h(j,4,"mNodeSelectEvent",_s,se,Pr),h(j,4,"mSelectEvent",Ys,se,Cr),h(j,4,"mSvgLayer",Zs,se,xr),h(j,4,"mViewport",Ws,se,Ir),h(j,5,"connections",oa,se),h(j,5,"gridSize",na,se),h(j,5,"nodes",ta,se),h(j,5,"selectedNodeIds",ea,se),se=h(j,0,"PotatnoCanvas",ia,se),u(j,1,se)});var la,aa=p(()=>{la=`:host {\r
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
`});var ua,ca=p(()=>{ua=`<div class="function-list-content">\r
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
</div>`});var pa,da,ma,ha,ya,ga,fa,ee,wr,Er,kr,Oe,Nr=p(()=>{de();aa();ca();fa=[U({selector:"potatno-function-list",template:ua,style:la})];Oe=class extends(ga=w,ya=[I],ha=[I],ma=[L("function-select")],da=[L("function-add")],pa=[L("function-delete")],ga){constructor(){super(...arguments);f(this,"functions",u(ee,20,this,[])),u(ee,23,this);f(this,"activeFunctionId",u(ee,24,this,"")),u(ee,27,this);N(this,wr,u(ee,8,this)),u(ee,11,this);N(this,Er,u(ee,12,this)),u(ee,15,this);N(this,kr,u(ee,16,this)),u(ee,19,this)}getEntryClass(t){return t===this.activeFunctionId?"function-entry active":"function-entry"}onFunctionSelect(t){this.mFunctionSelect.dispatchEvent(t)}onFunctionAdd(){this.mFunctionAdd.dispatchEvent(void 0)}onFunctionDelete(t,n){t.stopPropagation(),this.mFunctionDelete.dispatchEvent(n)}};ee=k(ga),wr=new WeakMap,Er=new WeakMap,kr=new WeakMap,h(ee,4,"mFunctionSelect",ma,Oe,wr),h(ee,4,"mFunctionAdd",da,Oe,Er),h(ee,4,"mFunctionDelete",pa,Oe,kr),h(ee,5,"functions",ya,Oe),h(ee,5,"activeFunctionId",ha,Oe),Oe=h(ee,0,"PotatnoFunctionList",fa,Oe),u(ee,1,Oe)});var Ta,ba=p(()=>{Ta=`:host {\r
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
`});var Pa,va=p(()=>{Pa=`$if(this.nodeData) {\r
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
        </div>\r
    }\r
    }\r
}\r
`});var xa,Ca=p(()=>{xa=`:host {\r
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
`});var wa,Ia=p(()=>{wa=`<div [className]="this.portWrapperClasses" [title]="this.type">\r
    <div #portCircle [className]="this.portCircleClasses" style="--port-color: {{this.portColor}}"\r
         (pointerdown)="this.onPointerDown($event)"\r
         (pointerenter)="this.onPointerEnter($event)"\r
         (pointerleave)="this.onPointerLeave($event)">\r
    </div>\r
    <span class="port-label">{{this.name}}</span>\r
</div>\r
`});var Ea,ka,Na,Da,Aa,Sa,La,Ma,Ra,Oa,Fa,Ga,ja,Ba,O,Dr,Ar,Sr,Lr,ne,Mr=p(()=>{de();Ca();Ia();Ba=[U({selector:"potatno-port",template:wa,style:xa})];ne=class extends(ja=w,Ga=[I],Fa=[I],Oa=[I],Ra=[I],Ma=[I],La=[I],Sa=[I],Aa=[I],Da=[L("port-drag-start")],Na=[L("port-hover")],ka=[L("port-leave")],Ea=[me("portCircle")],ja){constructor(){super(...arguments);f(this,"name",u(O,24,this,"")),u(O,27,this);f(this,"type",u(O,28,this,"")),u(O,31,this);f(this,"portId",u(O,32,this,"")),u(O,35,this);f(this,"nodeId",u(O,36,this,"")),u(O,39,this);f(this,"direction",u(O,40,this,"input")),u(O,43,this);f(this,"connected",u(O,44,this,!1)),u(O,47,this);f(this,"invalid",u(O,48,this,!1)),u(O,51,this);f(this,"portKind",u(O,52,this,"data")),u(O,55,this);N(this,Dr,u(O,8,this)),u(O,11,this);N(this,Ar,u(O,12,this)),u(O,15,this);N(this,Sr,u(O,16,this)),u(O,19,this);N(this,Lr,u(O,20,this)),u(O,23,this)}get portWrapperClasses(){return this.direction==="output"?"port-wrapper direction-output":"port-wrapper direction-input"}get portCircleClasses(){let t=["port-circle"];return this.connected?t.push("connected"):t.push("disconnected"),this.invalid&&t.push("invalid"),t.push(this.direction==="output"?"direction-output":"direction-input"),t.join(" ")}get portColor(){return this.portKind==="flow"?"var(--pn-text-primary)":this.getTypeColor(this.type)}onPointerDown(t){t.stopPropagation(),t.preventDefault(),this.mPortDragStart.dispatchEvent({nodeId:this.nodeId,portId:this.portId,portKind:this.portKind,direction:this.direction,type:this.type,element:this.portCircleElement})}onPointerEnter(t){this.mPortHover.dispatchEvent({nodeId:this.nodeId,portId:this.portId,portKind:this.portKind,direction:this.direction,type:this.type,element:this.portCircleElement})}onPointerLeave(t){this.mPortLeave.dispatchEvent(void 0)}getTypeColor(t){let n=0;for(let s=0;s<t.length;s++)n=t.charCodeAt(s)+((n<<5)-n);return`hsl(${Math.abs(n)%256*137.508%360}, 70%, 60%)`}};O=k(ja),Dr=new WeakMap,Ar=new WeakMap,Sr=new WeakMap,Lr=new WeakMap,h(O,4,"mPortDragStart",Da,ne,Dr),h(O,4,"mPortHover",Na,ne,Ar),h(O,4,"mPortLeave",ka,ne,Sr),h(O,4,"portCircleElement",Ea,ne,Lr),h(O,5,"name",Ga,ne),h(O,5,"type",Fa,ne),h(O,5,"portId",Oa,ne),h(O,5,"nodeId",Ra,ne),h(O,5,"direction",Ma,ne),h(O,5,"connected",La,ne),h(O,5,"invalid",Sa,ne),h(O,5,"portKind",Aa,ne),ne=h(O,0,"PotatnoPortComponent",Ba,ne),u(O,1,ne)});var Va,Ua,za,$a,Ha,Ka,Xa,Wa,Za,Ya,_a,qa,Ja,Qa,F,Rr,Or,Fr,Gr,jr,Br,Vr,Ur,zr,oe,el=p(()=>{de();st();ba();va();Mr();Qa=[U({selector:"potatno-node",template:Pa,style:Ta})];oe=class extends(Ja=w,qa=[I],_a=[I],Ya=[I],Za=[L("node-select")],Wa=[L("node-drag-start")],Xa=[L("port-drag-start")],Ka=[L("port-hover")],Ha=[L("port-leave")],$a=[L("open-function")],za=[L("value-change")],Ua=[L("comment-change")],Va=[L("resize-start")],Ja){constructor(){super(...arguments);f(this,"nodeData",u(F,44,this,null)),u(F,47,this);f(this,"selected",u(F,48,this,!1)),u(F,51,this);f(this,"gridSize",u(F,52,this,20)),u(F,55,this);N(this,Rr,u(F,8,this)),u(F,11,this);N(this,Or,u(F,12,this)),u(F,15,this);N(this,Fr,u(F,16,this)),u(F,19,this);N(this,Gr,u(F,20,this)),u(F,23,this);N(this,jr,u(F,24,this)),u(F,27,this);N(this,Br,u(F,28,this)),u(F,31,this);N(this,Vr,u(F,32,this)),u(F,35,this);N(this,Ur,u(F,36,this)),u(F,39,this);N(this,zr,u(F,40,this)),u(F,43,this)}get nodeStyle(){return this.nodeData?`left: ${this.nodeData.position.x*this.gridSize}px; top: ${this.nodeData.position.y*this.gridSize}px; width: ${this.nodeData.size.w*this.gridSize}px;`:""}get nodeId(){return this.nodeData?.id??""}get selectedClass(){return this.selected?"selected":""}get isComment(){return this.nodeData?.category==="comment"}get isReroute(){return this.nodeData?.category==="reroute"}get commentSizeStyle(){return this.nodeData?`height: ${this.nodeData.size.h*this.gridSize}px;`:""}get isValue(){return this.nodeData?.category==="value"}get isFunction(){return this.nodeData?.category==="function"}get showOpenButton(){return!1}get inputPorts(){return this.nodeData?.inputs??[]}get outputPorts(){return this.nodeData?.outputs??[]}get flowInputPorts(){return this.nodeData?.flowInputs??[]}get flowOutputPorts(){return this.nodeData?.flowOutputs??[]}onNodePointerDown(t){t.target.tagName?.toLowerCase()!=="potatno-port"&&(this.mNodeSelect.dispatchEvent({nodeId:this.nodeId,shiftKey:t.shiftKey}),this.mNodeDragStart.dispatchEvent({nodeId:this.nodeId,startX:t.clientX,startY:t.clientY}))}onPortDragStart(t){this.mPortDragStart.dispatchEvent(t.value)}onPortHover(t){this.mPortHover.dispatchEvent(t.value)}onPortLeave(t){this.mPortLeave.dispatchEvent(void 0)}onOpenFunction(t){t.stopPropagation(),this.mOpenFunction.dispatchEvent({definitionName:this.nodeData?.definitionName??""})}onValueInput(t){let n=t.target;this.mValueChange.dispatchEvent({nodeId:this.nodeId,property:"value",value:n.value})}onCommentInput(t){let n=t.target;this.mCommentChange.dispatchEvent({nodeId:this.nodeId,text:n.value})}onResizeStart(t){t.stopPropagation(),t.preventDefault(),this.mResizeStart.dispatchEvent({nodeId:this.nodeId,startX:t.clientX,startY:t.clientY})}};F=k(Ja),Rr=new WeakMap,Or=new WeakMap,Fr=new WeakMap,Gr=new WeakMap,jr=new WeakMap,Br=new WeakMap,Vr=new WeakMap,Ur=new WeakMap,zr=new WeakMap,h(F,4,"mNodeSelect",Za,oe,Rr),h(F,4,"mNodeDragStart",Wa,oe,Or),h(F,4,"mPortDragStart",Xa,oe,Fr),h(F,4,"mPortHover",Ka,oe,Gr),h(F,4,"mPortLeave",Ha,oe,jr),h(F,4,"mOpenFunction",$a,oe,Br),h(F,4,"mValueChange",za,oe,Vr),h(F,4,"mCommentChange",Ua,oe,Ur),h(F,4,"mResizeStart",Va,oe,zr),h(F,5,"nodeData",qa,oe),h(F,5,"selected",_a,oe),h(F,5,"gridSize",Ya,oe),oe=h(F,0,"PotatnoNodeComponent",Qa,oe),u(F,1,oe)});var nl,tl=p(()=>{nl=`:host {\r
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
`});var rl,ol=p(()=>{rl=`<div class="search-wrapper">\r
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
</div>`});var il,sl,al,ll,ot,$r,It,Hr=p(()=>{de();st();tl();ol();ll=[U({selector:"potatno-node-library",template:rl,style:nl})];It=class extends(al=w,sl=[L("node-drag-start")],il=[I],al){constructor(){super(...arguments);u(ot,5,this);f(this,"mNodeDefinitions",[]);f(this,"mCachedFilteredGroups",[]);N(this,$r,u(ot,8,this)),u(ot,11,this);f(this,"mSearchQuery","");f(this,"mCollapsedCategories",{})}set nodeDefinitions(t){this.mNodeDefinitions=t,this.rebuildFilteredGroups()}get nodeDefinitions(){return this.mNodeDefinitions}get filteredGroups(){return this.mCachedFilteredGroups}rebuildFilteredGroups(){let t=this.mSearchQuery.toLowerCase(),n=new Map;for(let s of this.mNodeDefinitions){if(t&&!s.name.toLowerCase().includes(t))continue;let a=n.get(s.category);a||(a=[],n.set(s.category,a)),a.push(s)}let o=[],r=Object.values(Xe);for(let s of r){let a=n.get(s);if(a&&a.length>0){let l=Nt.get(s);o.push({category:s,icon:l.icon,label:l.label,cssColor:l.cssColor,nodes:a})}}this.mCachedFilteredGroups=o}onSearchInput(t){this.mSearchQuery=t.target.value,this.rebuildFilteredGroups()}toggleCategory(t){this.mCollapsedCategories[t]=!this.mCollapsedCategories[t],this.rebuildFilteredGroups()}isCategoryCollapsed(t){return!!this.mCollapsedCategories[t]}getToggleClass(t){return this.mCollapsedCategories[t]?"category-toggle collapsed":"category-toggle"}onNodeMouseDown(t){this.mNodeDragStart.dispatchEvent(t)}};ot=k(al),$r=new WeakMap,h(ot,4,"mNodeDragStart",sl,It,$r),h(ot,3,"nodeDefinitions",il,It),It=h(ot,0,"PotatnoNodeLibrary",ll,It),u(ot,1,It)});var ul,cl=p(()=>{ul=`:host {\r
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
`});var dl,pl=p(()=>{dl=`<div class="tab-bar">\r
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
</div>`});var ml,hl,yl,gl,fl,bl,Tl,vl,Pl,K,Kr,Xr,Wr,Zr,ke,Cl=p(()=>{de();cl();pl();Hr();Nr();Pl=[U({selector:"potatno-panel-left",template:dl,style:ul})];ke=class extends(vl=w,Tl=[I],bl=[I],fl=[I],gl=[L("node-drag-start")],yl=[L("function-select")],hl=[L("function-add")],ml=[L("function-delete")],vl){constructor(){super(...arguments);f(this,"nodeDefinitions",u(K,24,this,[])),u(K,27,this);f(this,"functions",u(K,28,this,[])),u(K,31,this);f(this,"activeFunctionId",u(K,32,this,"")),u(K,35,this);N(this,Kr,u(K,8,this)),u(K,11,this);N(this,Xr,u(K,12,this)),u(K,15,this);N(this,Wr,u(K,16,this)),u(K,19,this);N(this,Zr,u(K,20,this)),u(K,23,this);f(this,"mActiveTabIndex",0)}get activeTabIndex(){return this.mActiveTabIndex}getTabClass(t){return t===this.mActiveTabIndex?"tab-button active":"tab-button"}onTabClick(t){this.mActiveTabIndex=t}onNodeDragStart(t){this.mNodeDragStart.dispatchEvent(t.value)}onFunctionSelect(t){this.mFunctionSelect.dispatchEvent(t.value)}onFunctionAdd(t){this.mFunctionAdd.dispatchEvent(void 0)}onFunctionDelete(t){this.mFunctionDelete.dispatchEvent(t.value)}};K=k(vl),Kr=new WeakMap,Xr=new WeakMap,Wr=new WeakMap,Zr=new WeakMap,h(K,4,"mNodeDragStart",gl,ke,Kr),h(K,4,"mFunctionSelect",yl,ke,Xr),h(K,4,"mFunctionAdd",hl,ke,Wr),h(K,4,"mFunctionDelete",ml,ke,Zr),h(K,5,"nodeDefinitions",Tl,ke),h(K,5,"functions",bl,ke),h(K,5,"activeFunctionId",fl,ke),ke=h(K,0,"PotatnoPanelLeft",Pl,ke),u(K,1,ke)});var Il,xl=p(()=>{Il=`:host {\r
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
`});var El,wl=p(()=>{El=`<div class="properties-header">Properties</div>\r
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
`});var kl,Nl,Dl,Al,Sl,Ll,Ml,Rl,Ol,Fl,Gl,z,Yr,ve,jl=p(()=>{de();xl();wl();Gl=[U({selector:"potatno-panel-properties",template:El,style:Il})];ve=class extends(Fl=w,Ol=[I],Rl=[I],Ml=[I],Ll=[I],Sl=[I],Al=[I],Dl=[I],Nl=[I],kl=[L("properties-change")],Fl){constructor(){super(...arguments);u(z,5,this);f(this,"functionName",u(z,12,this,"")),u(z,15,this);f(this,"functionInputs",u(z,16,this,[])),u(z,19,this);f(this,"functionOutputs",u(z,20,this,[])),u(z,23,this);f(this,"mFunctionImports",[]);f(this,"isSystem",u(z,24,this,!1)),u(z,27,this);f(this,"editableByUser",u(z,28,this,!1)),u(z,31,this);f(this,"mAvailableImports",[]);f(this,"mAvailableTypes",[]);f(this,"mCachedUnusedImports",[]);f(this,"mSelectedImport","");N(this,Yr,u(z,8,this)),u(z,11,this)}set functionImports(t){this.mFunctionImports=t,this.rebuildUnusedImports()}get functionImports(){return this.mFunctionImports}get nameDisabled(){return this.isSystem}get portsDisabled(){return this.isSystem&&!this.editableByUser}set availableImports(t){this.mAvailableImports=t,this.rebuildUnusedImports()}get availableImports(){return this.mAvailableImports}set availableTypes(t){this.mAvailableTypes=t}get availableTypes(){return this.mAvailableTypes}validateName(t){return/^[a-zA-Z][a-zA-Z0-9_]*$/.test(t)}isNameDuplicate(t,n,o){if(n!=="function"&&t===this.functionName)return!0;for(let r=0;r<this.functionInputs.length;r++)if(!(n==="input"&&r===o)&&this.functionInputs[r].name===t)return!0;for(let r=0;r<this.functionOutputs.length;r++)if(!(n==="output"&&r===o)&&this.functionOutputs[r].name===t)return!0;return!1}onNameChange(t){let n=t.target,o=n.value,r=!this.validateName(o)||this.isNameDuplicate(o,"function");n.style.borderColor=r?"var(--pn-accent-danger)":"",this.functionName=o,this.mPropertiesChange.dispatchEvent({name:o})}onInputNameChange(t,n){let o=n.target,r=o.value,s=!this.validateName(r)||this.isNameDuplicate(r,"input",t);o.style.borderColor=s?"var(--pn-accent-danger)":"";let a=[...this.functionInputs];a[t]={...a[t],name:r},this.functionInputs=a,this.mPropertiesChange.dispatchEvent({inputs:a})}onInputTypeChange(t,n){let o=n.target.value,r=[...this.functionInputs];r[t]={...r[t],type:o},this.functionInputs=r,this.mPropertiesChange.dispatchEvent({inputs:r})}onOutputNameChange(t,n){let o=n.target,r=o.value,s=!this.validateName(r)||this.isNameDuplicate(r,"output",t);o.style.borderColor=s?"var(--pn-accent-danger)":"";let a=[...this.functionOutputs];a[t]={...a[t],name:r},this.functionOutputs=a,this.mPropertiesChange.dispatchEvent({outputs:a})}onOutputTypeChange(t,n){let o=n.target.value,r=[...this.functionOutputs];r[t]={...r[t],type:o},this.functionOutputs=r,this.mPropertiesChange.dispatchEvent({outputs:r})}onAddInput(){let t=this.mAvailableTypes.length>0?this.mAvailableTypes[0]:"number",n=[...this.functionInputs,{name:"new_input",type:t}];this.functionInputs=n,this.mPropertiesChange.dispatchEvent({inputs:n})}onDeleteInput(t){let n=[...this.functionInputs];n.splice(t,1),this.functionInputs=n,this.mPropertiesChange.dispatchEvent({inputs:n})}onAddOutput(){let t=this.mAvailableTypes.length>0?this.mAvailableTypes[0]:"number",n=[...this.functionOutputs,{name:"new_output",type:t}];this.functionOutputs=n,this.mPropertiesChange.dispatchEvent({outputs:n})}onDeleteOutput(t){let n=[...this.functionOutputs];n.splice(t,1),this.functionOutputs=n,this.mPropertiesChange.dispatchEvent({outputs:n})}get unusedImports(){return this.mCachedUnusedImports}onImportSelectChange(t){this.mSelectedImport=t.target.value}onAddSelectedImport(){let t=this.mSelectedImport||(this.mCachedUnusedImports.length>0?this.mCachedUnusedImports[0]:"");if(!t)return;let n=[...this.mFunctionImports,t];this.functionImports=n,this.mSelectedImport="",this.mPropertiesChange.dispatchEvent({imports:n})}onDeleteImport(t){let n=[...this.mFunctionImports];n.splice(t,1),this.functionImports=n,this.mPropertiesChange.dispatchEvent({imports:n})}rebuildUnusedImports(){let t=new Set(this.mFunctionImports);this.mCachedUnusedImports=this.mAvailableImports.filter(n=>!t.has(n))}};z=k(Fl),Yr=new WeakMap,h(z,3,"functionImports",Ll,ve),h(z,3,"availableImports",Dl,ve),h(z,3,"availableTypes",Nl,ve),h(z,4,"mPropertiesChange",kl,ve,Yr),h(z,5,"functionName",Ol,ve),h(z,5,"functionInputs",Rl,ve),h(z,5,"functionOutputs",Ml,ve),h(z,5,"isSystem",Sl,ve),h(z,5,"editableByUser",Al,ve),ve=h(z,0,"PotatnoPanelProperties",Gl,ve),u(z,1,ve)});var Vl,Bl=p(()=>{Vl=`:host {\r
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
`});var zl,Ul=p(()=>{zl=`<div class="resize-handle" (pointerdown)="this.onResizePointerDown($event)"></div>\r
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
`});var $l,Hl,Kl,Xl,Wl,Zl,Pe,_r,qr,He,Yl=p(()=>{de();Bl();Ul();Zl=[U({selector:"potatno-preview",template:zl,style:Vl})];He=class extends(Wl=w,Xl=[I,me("PreviewContent")],Kl=[me("PreviewContainer")],Hl=[I],$l=[I],Wl){constructor(){super(...arguments);u(Pe,5,this);N(this,_r,u(Pe,8,this)),u(Pe,11,this);N(this,qr,u(Pe,12,this)),u(Pe,15,this);f(this,"errors",u(Pe,16,this,[])),u(Pe,19,this);f(this,"mDragging",!1);f(this,"mStartX",0);f(this,"mStartY",0);f(this,"mStartWidth",0);f(this,"mStartHeight",0)}get hasErrors(){return this.errors.length>0}setContent(t){let n=this.contentElement;for(;n.firstChild;)n.removeChild(n.firstChild);n.appendChild(t)}onResizePointerDown(t){t.preventDefault(),t.stopPropagation(),this.mDragging=!0,this.mStartX=t.clientX,this.mStartY=t.clientY;let n=this.containerElement;if(!n)return;this.mStartWidth=n.offsetWidth,this.mStartHeight=n.offsetHeight,t.target.setPointerCapture(t.pointerId);let o=s=>{if(!this.mDragging)return;let a=this.mStartX-s.clientX,l=this.mStartY-s.clientY,c=Math.max(200,this.mStartWidth+a),m=Math.max(150,this.mStartHeight+l);n.style.width=c+"px",n.style.height=m+"px"},r=s=>{this.mDragging=!1,s.target.releasePointerCapture(s.pointerId),document.removeEventListener("pointermove",o),document.removeEventListener("pointerup",r)};document.addEventListener("pointermove",o),document.addEventListener("pointerup",r)}};Pe=k(Wl),_r=new WeakMap,qr=new WeakMap,h(Pe,4,"contentElement",Xl,He,_r),h(Pe,4,"containerElement",Kl,He,qr),h(Pe,1,"setContent",$l,He),h(Pe,5,"errors",Hl,He),He=h(Pe,0,"PotatnoPreview",Zl,He),u(Pe,1,He)});var ql,_l=p(()=>{ql=`.resize-handle {\r
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
`});var Ql,Jl=p(()=>{Ql=`<div [className]="this.getHandleClass()" (pointerdown)="this.onPointerDown($event)"></div>\r
`});var ec,tc,nc,oc,Ke,Jr,wt,rc=p(()=>{de();_l();Jl();oc=[U({selector:"potatno-resize-handle",template:Ql,style:ql})];wt=class extends(nc=w,tc=[I],ec=[L("resize")],nc){constructor(){super(...arguments);f(this,"direction",u(Ke,12,this,"vertical")),u(Ke,15,this);N(this,Jr,u(Ke,8,this)),u(Ke,11,this);f(this,"mDragging",!1);f(this,"mStartPosition",0)}getHandleClass(){return`resize-handle ${this.direction}`}onPointerDown(t){t.preventDefault(),this.mDragging=!0,this.mStartPosition=this.direction==="vertical"?t.clientX:t.clientY,t.target.setPointerCapture(t.pointerId);let n=r=>{if(!this.mDragging)return;let s=this.direction==="vertical"?r.clientX:r.clientY,a=s-this.mStartPosition;this.mStartPosition=s,this.mResize.dispatchEvent({delta:a})},o=r=>{this.mDragging=!1,r.target.releasePointerCapture(r.pointerId),document.removeEventListener("pointermove",n),document.removeEventListener("pointerup",o)};document.addEventListener("pointermove",n),document.addEventListener("pointerup",o)}};Ke=k(nc),Jr=new WeakMap,h(Ke,4,"mResize",ec,wt,Jr),h(Ke,5,"direction",tc,wt),wt=h(Ke,0,"PotatnoResizeHandle",oc,wt),u(Ke,1,wt)});var sc,ic=p(()=>{sc=`.search-wrapper {\r
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
`});var lc,ac=p(()=>{lc=`<div class="search-wrapper">\r
    <svg class="search-icon" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">\r
        <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" stroke-width="1.5"/>\r
        <line x1="10.5" y1="10.5" x2="14.5" y2="14.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>\r
    </svg>\r
    <input class="search-field" type="text" [placeholder]="this.placeholder" [value]="this.value" (input)="this.onInput($event)"/>\r
</div>\r
`});var cc,uc,pc,dc,mc,Ne,Qr,rt,hc=p(()=>{de();ic();ac();mc=[U({selector:"potatno-search-input",template:lc,style:sc})];rt=class extends(dc=w,pc=[I],uc=[I],cc=[L("search-change")],dc){constructor(){super(...arguments);f(this,"placeholder",u(Ne,12,this,"Search...")),u(Ne,15,this);f(this,"value",u(Ne,16,this,"")),u(Ne,19,this);N(this,Qr,u(Ne,8,this)),u(Ne,11,this)}onInput(t){let n=t.target;this.value=n.value,this.mSearchChange.dispatchEvent(this.value)}};Ne=k(dc),Qr=new WeakMap,h(Ne,4,"mSearchChange",cc,rt,Qr),h(Ne,5,"placeholder",pc,rt),h(Ne,5,"value",uc,rt),rt=h(Ne,0,"PotatnoSearchInput",mc,rt),u(Ne,1,rt)});var gc,yc=p(()=>{gc=`.tabs-header {\r
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
`});var bc,fc=p(()=>{bc=`<div class="tabs-header">\r
    $for(tab of this.tabs; index = $index) {\r
        <button [className]="this.getTabClass(this.index)" (click)="this.onTabClick(this.index)">{{this.tab}}</button>\r
    }\r
</div>\r
<div class="tabs-content">\r
    $slot\r
</div>\r
`});var Tc,vc,Pc,Cc,xc,De,ei,it,Ic=p(()=>{de();yc();fc();xc=[U({selector:"potatno-tabs",template:bc,style:gc})];it=class extends(Cc=w,Pc=[I],vc=[I],Tc=[L("tab-change")],Cc){constructor(){super(...arguments);f(this,"tabs",u(De,12,this,[])),u(De,15,this);f(this,"activeIndex",u(De,16,this,0)),u(De,19,this);N(this,ei,u(De,8,this)),u(De,11,this)}getTabClass(t){return t===this.activeIndex?"tab-button active":"tab-button"}onTabClick(t){this.activeIndex=t,this.mTabChange.dispatchEvent(t)}};De=k(Cc),ei=new WeakMap,h(De,4,"mTabChange",Tc,it,ei),h(De,5,"tabs",Pc,it),h(De,5,"activeIndex",vc,it),it=h(De,0,"PotatnoTabs",xc,it),u(De,1,it)});var ii,M,wc,Ec,kc,Nc,Dc,Ac,Sc,Lc,Mc,Rc,_,ti,ni,oi,ri,he,Oc=p(()=>{de();st();Xt();Cs();Ms();mr();hr();fr();Rs();Os();Fs();Gs();js();Bs();Us();sa();Nr();el();Hr();Cl();jl();Mr();Yl();rc();hc();Ic();ii=class{mFiles=new Map;mInternals=new Map;mProjects=new Map;mSelections=new Map;deleteAll(e){this.mProjects.delete(e),this.mFiles.delete(e),this.mSelections.delete(e),this.mInternals.delete(e)}deleteFile(e){this.mFiles.delete(e)}getFile(e){return this.mFiles.get(e)}getInternals(e){return this.mInternals.get(e)}getProject(e){return this.mProjects.get(e)}getSelection(e){return this.mSelections.get(e)}setFile(e,t){this.mFiles.set(e,t)}setInternals(e,t){this.mInternals.set(e,t)}setProject(e,t){this.mProjects.set(e,t)}setSelection(e,t){this.mSelections.set(e,t)}},M=new ii;Rc=[U({selector:"potatno-code-editor",template:zs,style:Vs})];he=class extends(Mc=w,Lc=[me("svgLayer")],Sc=[me("canvasWrapper")],Ac=[me("panelLeft")],Dc=[me("panelRight")],Nc=[I],kc=[I],Ec=[I],wc=[I],Mc){constructor(){super();u(_,5,this);f(this,"mInstanceKey");f(this,"mShowSelectionBox");f(this,"mSelectionBoxScreen");f(this,"mPreviewDebounceTimer");f(this,"mKeyboardHandler");f(this,"mResizeState");f(this,"mResizeMoveHandler");f(this,"mResizeUpHandler");f(this,"mCacheVersion");N(this,ti,u(_,8,this)),u(_,11,this);N(this,ni,u(_,12,this)),u(_,15,this);N(this,oi,u(_,16,this)),u(_,19,this);N(this,ri,u(_,20,this)),u(_,23,this);this.mInstanceKey=crypto.randomUUID(),M.setSelection(this.mInstanceKey,new Set),M.setInternals(this.mInstanceKey,{history:new go,clipboard:new yo,interaction:new Wt(20),renderer:new Zt,hoveredPort:null,interactionState:{mode:"idle"},previewInitialized:!1,cachedData:{activeFunctionId:"",activeFunctionName:"",activeFunctionIsSystem:!1,activeFunctionEditableByUser:!1,errors:[],hasPreview:!1,nodeDefinitionList:[],functionList:[],availableImports:[],availableTypes:[],activeFunctionInputs:[],activeFunctionOutputs:[],activeFunctionImports:[],visibleNodes:[]}}),this.mShowSelectionBox=!1,this.mSelectionBoxScreen={x1:0,y1:0,x2:0,y2:0},this.mPreviewDebounceTimer=0,this.mKeyboardHandler=null,this.mResizeState=null,this.mResizeMoveHandler=null,this.mResizeUpHandler=null,this.mCacheVersion=0}get project(){return this.getProject()}set project(t){M.setProject(this.mInstanceKey,t),this.rebuildCachedData()}get file(){return M.getFile(this.mInstanceKey)??null}set file(t){if(t){M.setFile(this.mInstanceKey,t);let n=M.getProject(this.mInstanceKey);n&&t.functions.size===0&&this.initializeMainFunctions(t,n)}else M.deleteFile(this.mInstanceKey);this.getSelectedIds().clear(),this.getInternals().history.clear(),this.getInternals().previewInitialized=!1,this.rebuildCachedData(),this.renderConnections(),this.initializePreview(),this.updatePreview()}get activeFunctionId(){return this.mCacheVersion,this.getInternals().cachedData.activeFunctionId}get interaction(){return this.getInternals().interaction}get showSelectionBox(){return this.mShowSelectionBox}get hasPreview(){return this.mCacheVersion,this.getInternals().cachedData.hasPreview}get editorErrors(){return this.mCacheVersion,this.getInternals().cachedData.errors}get gridBackgroundStyle(){return this.getInternals().interaction.getGridBackgroundCss()}get gridTransformStyle(){return"transform: "+this.getInternals().interaction.getTransformCss()}get selectionBoxStyle(){if(!this.mShowSelectionBox)return"display: none";let t=Math.min(this.mSelectionBoxScreen.x1,this.mSelectionBoxScreen.x2),n=Math.min(this.mSelectionBoxScreen.y1,this.mSelectionBoxScreen.y2),o=Math.abs(this.mSelectionBoxScreen.x2-this.mSelectionBoxScreen.x1),r=Math.abs(this.mSelectionBoxScreen.y2-this.mSelectionBoxScreen.y1);return`left: ${t}px; top: ${n}px; width: ${o}px; height: ${r}px`}get visibleNodes(){return this.mCacheVersion,this.getInternals().cachedData.visibleNodes}get nodeDefinitionList(){return this.mCacheVersion,this.getInternals().cachedData.nodeDefinitionList}get functionList(){return this.mCacheVersion,this.getInternals().cachedData.functionList}get activeFunctionName(){return this.mCacheVersion,this.getInternals().cachedData.activeFunctionName}get activeFunctionInputs(){return this.mCacheVersion,this.getInternals().cachedData.activeFunctionInputs}get activeFunctionOutputs(){return this.mCacheVersion,this.getInternals().cachedData.activeFunctionOutputs}get activeFunctionImports(){return this.mCacheVersion,this.getInternals().cachedData.activeFunctionImports}get activeFunctionIsSystem(){return this.mCacheVersion,this.getInternals().cachedData.activeFunctionIsSystem}get activeFunctionEditableByUser(){return this.mCacheVersion,this.getInternals().cachedData.activeFunctionEditableByUser}get availableImportsList(){return this.mCacheVersion,this.getInternals().cachedData.availableImports}get availableTypes(){return this.mCacheVersion,this.getInternals().cachedData.availableTypes}getProject(){return M.getProject(this.mInstanceKey)}getFile(){return M.getFile(this.mInstanceKey)}getSelectedIds(){return M.getSelection(this.mInstanceKey)}getInternals(){return M.getInternals(this.mInstanceKey)}loadCode(t){let n=this.getProject(),r=new oo(n).deserialize(t);M.setFile(this.mInstanceKey,r),this.getInternals().history.clear(),this.getSelectedIds().clear(),this.getInternals().previewInitialized=!1,this.rebuildCachedData(),this.renderConnections(),this.initializePreview(),this.updatePreview()}generateCode(){let t=this.getProject(),n=M.getFile(this.mInstanceKey);return n?new Dn(t).serialize(n):""}onConnect(){this.mKeyboardHandler=t=>this.onKeyDown(t),document.addEventListener("keydown",this.mKeyboardHandler)}onDeconstruct(){this.mKeyboardHandler&&document.removeEventListener("keydown",this.mKeyboardHandler),M.deleteAll(this.mInstanceKey)}onNodeDragFromLibrary(t){let n=t.value??t.detail?.value??t,o=this.getProject(),r=M.getFile(this.mInstanceKey);if(!r)return;let s=o.nodeDefinitions.get(n);if(!s){for(let x of r.functions.values())if(x.name===n&&!x.system){s={name:x.name,category:"function",inputs:{...x.inputs},outputs:{...x.outputs}};break}}if(!s){let x=r.activeFunction;if(x){let b=new Set(x.imports);for(let E of o.imports)if(b.has(E.name)){for(let A of E.nodes)if(A.name===n){s=A;break}if(s)break}}}if(!s){for(let x of o.globalInputs)if(n===`Get ${x.name}`){s={name:n,category:"value",inputs:{},outputs:{[x.name]:{nodeType:"value",dataType:x.type}}};break}}if(!s){for(let x of o.globalOutputs)if(n===`Set ${x.name}`){s={name:n,category:"value",inputs:{[x.name]:{nodeType:"value",dataType:x.type}},outputs:{}};break}}if(!s)return;let a=r.activeFunction?.graph;if(!a)return;let l=this.getInternals(),c=this.canvasWrapper,m=c&&c.clientWidth||800,d=c&&c.clientHeight||600,y=l.interaction.screenToWorld(m/2,d/2),C=l.interaction.snapToGrid(y.x,y.y),G=new Sn(a,s,{x:C.x/l.interaction.gridSize,y:C.y/l.interaction.gridSize});l.history.push(G),this.rebuildCachedData(),this.renderConnections(),this.updatePreview()}onFunctionSelect(t){let n=t.value??t.detail?.value??t,o=M.getFile(this.mInstanceKey);o&&(o.setActiveFunction(n),this.getSelectedIds().clear(),this.rebuildCachedData(),this.renderConnections())}onFunctionAdd(){let t=M.getFile(this.mInstanceKey);if(!t)return;let n=this.getInternals().cachedData.functionList.length,o=new xt(crypto.randomUUID(),`function_${n}`,`Function ${n}`,!1);t.addFunction(o),t.setActiveFunction(o.id),this.getSelectedIds().clear(),this.rebuildCachedData(),this.renderConnections()}onFunctionDelete(t){let n=t.value??t.detail?.value??t,o=M.getFile(this.mInstanceKey);o&&(o.removeFunction(n),this.getSelectedIds().clear(),this.rebuildCachedData(),this.renderConnections(),this.updatePreview())}onPropertiesChange(t){let n=M.getFile(this.mInstanceKey);if(!n)return;let o=n.activeFunction;if(!o)return;let r=t.value??t.detail?.value??t;r.name!==void 0&&(o.setName(r.name),o.setLabel(r.name)),r.inputs!==void 0&&o.setInputs(r.inputs),r.outputs!==void 0&&o.setOutputs(r.outputs),r.imports!==void 0&&o.setImports(r.imports),o.graph.validate(),this.rebuildCachedData(),this.renderConnections(),this.updatePreview()}onCanvasPointerDown(t){let n=this.getInternals();if(t.button===1){t.preventDefault(),n.interactionState={mode:"panning",startX:t.clientX,startY:t.clientY},t.currentTarget.setPointerCapture(t.pointerId);return}if(t.button===0){t.ctrlKey||(this.getSelectedIds().clear(),this.rebuildCachedData());let o=this.canvasWrapper.getBoundingClientRect(),r=t.clientX-o.left,s=t.clientY-o.top;n.interactionState={mode:"selecting",startX:r,startY:s},this.mSelectionBoxScreen={x1:r,y1:s,x2:r,y2:s},this.mShowSelectionBox=!1,t.currentTarget.setPointerCapture(t.pointerId)}}onCanvasPointerMove(t){let n=this.getInternals(),o=n.interactionState;if(o.mode==="panning"){let r=t.clientX-o.startX,s=t.clientY-o.startY;n.interaction.pan(r,s),o.startX=t.clientX,o.startY=t.clientY,this.renderConnections();return}if(o.mode==="dragging-node"){let r=M.getFile(this.mInstanceKey);if(!r)return;let s=(t.clientX-o.startX)/n.interaction.zoom,a=(t.clientY-o.startY)/n.interaction.zoom;for(let l of o.origins){let c=l.originX+s,m=l.originY+a,d=n.interaction.snapToGrid(c,m),y=r.activeFunction?.graph.getNode(l.nodeId);y&&(y.moveTo(d.x/n.interaction.gridSize,d.y/n.interaction.gridSize),this.updateNodePosition(l.nodeId))}this.renderConnections();return}if(o.mode==="dragging-wire"){let r=this.canvasWrapper.getBoundingClientRect(),s=(t.clientX-r.left-n.interaction.panX)/n.interaction.zoom,a=(t.clientY-r.top-n.interaction.panY)/n.interaction.zoom;n.renderer.renderTempConnection(this.svgLayer,{x:o.startX,y:o.startY},{x:s,y:a},"#bac2de");return}if(o.mode==="selecting"){let r=this.canvasWrapper.getBoundingClientRect();this.mSelectionBoxScreen.x2=t.clientX-r.left,this.mSelectionBoxScreen.y2=t.clientY-r.top;let s=Math.abs(this.mSelectionBoxScreen.x2-this.mSelectionBoxScreen.x1),a=Math.abs(this.mSelectionBoxScreen.y2-this.mSelectionBoxScreen.y1);(s>5||a>5)&&(this.mShowSelectionBox=!0);return}if(o.mode==="resizing-comment"){let r=M.getFile(this.mInstanceKey);if(!r)return;let s=(t.clientX-o.startX)/n.interaction.zoom,a=(t.clientY-o.startY)/n.interaction.zoom,l=n.interaction.gridSize,c=o.originalW+Math.round(s/l),m=o.originalH+Math.round(a/l),d=r.activeFunction?.graph.getNode(o.nodeId);d&&(d.resizeTo(c,m),this.updateNodeSize(o.nodeId));return}}onCanvasPointerUp(t){let n=this.getInternals();if(n.interactionState.mode==="dragging-node"&&(this.rebuildCachedData(),this.renderConnections(),this.updatePreview()),n.interactionState.mode==="dragging-wire"&&(n.renderer.clearTempConnection(this.svgLayer),n.hoveredPort)){let o=n.hoveredPort;if(n.interactionState.direction!==o.direction&&n.interactionState.portKind===o.portKind){let s=M.getFile(this.mInstanceKey)?.activeFunction?.graph;if(s){let a=n.interactionState.portKind==="data"?"data":"flow",l,c,m,d;n.interactionState.direction==="output"?(l=n.interactionState.sourceNodeId,c=n.interactionState.sourcePortId,m=o.nodeId,d=o.portId):(l=o.nodeId,c=o.portId,m=n.interactionState.sourceNodeId,d=n.interactionState.sourcePortId),s.addConnection(l,c,m,d,a),this.rebuildCachedData(),this.renderConnections(),this.updatePreview()}}}n.interactionState.mode==="selecting"&&(this.mShowSelectionBox=!1,this.selectNodesInBox()),n.interactionState.mode==="resizing-comment"&&this.rebuildCachedData(),n.interactionState={mode:"idle"},t.currentTarget.releasePointerCapture(t.pointerId)}onCanvasWheel(t){t.preventDefault();let n=this.canvasWrapper.getBoundingClientRect(),o=t.clientX-n.left,r=t.clientY-n.top;this.getInternals().interaction.zoomAt(o,r,t.deltaY>0?-.1:.1),this.renderConnections()}onContextMenu(t){t.preventDefault();let n=t.target;if(n.hasAttribute?.("data-hit-area")){let o=n.getAttribute("data-connection-id");if(o){let s=M.getFile(this.mInstanceKey)?.activeFunction?.graph;s&&(s.removeConnection(o),this.rebuildCachedData(),this.renderConnections(),this.updatePreview())}}}onNodePointerDown(t,n){let o=t.composedPath();for(let d of o)if(d.tagName?.toLowerCase()==="potatno-port")return;if(t.stopPropagation(),t.button!==0)return;let r=n.id,s=this.getInternals(),a=this.getSelectedIds(),l=M.getFile(this.mInstanceKey);if(!l)return;t.ctrlKey?a.has(r)?a.delete(r):a.add(r):a.has(r)||(a.clear(),a.add(r)),this.rebuildCachedData();let c=[],m=l.activeFunction?.graph;for(let d of a){let y=m?.getNode(d);y&&c.push({nodeId:d,originX:y.position.x*s.interaction.gridSize,originY:y.position.y*s.interaction.gridSize})}if(m){let d=m.getNode(r);if(d&&d.category==="comment"){let y=s.interaction.gridSize,C=d.position.x*y,G=d.position.y*y,x=C+d.size.w*y,b=G+d.size.h*y;for(let E of m.nodes.values()){if(E.id===r||a.has(E.id)||E.category==="comment")continue;let A=E.position.x*y,R=E.position.y*y;A>=C&&A<=x&&R>=G&&R<=b&&c.push({nodeId:E.id,originX:A,originY:R})}}}c.length>0&&(s.interactionState={mode:"dragging-node",nodeId:r,startX:t.clientX,startY:t.clientY,origins:c},this.canvasWrapper.setPointerCapture(t.pointerId))}onPortDragStart(t){let n=t.value??t.detail?.value??t,r=M.getFile(this.mInstanceKey)?.activeFunction?.graph;if(!r)return;let s=r.getNode(n.nodeId);if(!s)return;let a=this.getInternals(),l=a.interaction.gridSize,c=s.position.x*l,m=s.position.y*l,d=s.size.w*l,y=28,C=24,G=4,x,b;if(n.portKind==="flow")x=n.direction==="output"?c+d:c,b=m+y/2;else{let E=0;if(n.direction==="output"){let A=0;for(let R of s.outputs.values()){if(R.id===n.portId){E=A;break}A++}x=c+d}else{let A=0;for(let R of s.inputs.values()){if(R.id===n.portId){E=A;break}A++}x=c}b=m+y+G+(E+.5)*C}a.interactionState={mode:"dragging-wire",sourceNodeId:n.nodeId,sourcePortId:n.portId,portKind:n.portKind,direction:n.direction,type:n.type,startX:x,startY:b}}onPortHover(t){let n=t.value??t.detail?.value??t;this.getInternals().hoveredPort={nodeId:n.nodeId,portId:n.portId,portKind:n.portKind,direction:n.direction,type:n.type}}onPortLeave(){this.getInternals().hoveredPort=null}onNodeResizeStart(t,n){let o=t.value??t.detail?.value??t,s=M.getFile(this.mInstanceKey)?.activeFunction?.graph.getNode(o.nodeId);s&&(this.getInternals().interactionState={mode:"resizing-comment",nodeId:o.nodeId,startX:o.startX,startY:o.startY,originalW:s.size.w,originalH:s.size.h},this.canvasWrapper.setPointerCapture(t.pointerId??o.startX))}onCommentChange(t){let n=t.value??t.detail?.value??t,r=M.getFile(this.mInstanceKey)?.activeFunction?.graph.getNode(n.nodeId);if(r){let s=new Ln(r,"comment",n.text);this.getInternals().history.push(s),this.rebuildCachedData()}}onValueChange(t){let n=t.value??t.detail?.value??t,r=M.getFile(this.mInstanceKey)?.activeFunction?.graph.getNode(n.nodeId);if(r){let s=new Ln(r,n.property,n.value);this.getInternals().history.push(s),this.rebuildCachedData(),this.updatePreview()}}onKeyDown(t){if(t.key==="Delete"){this.deleteSelectedNodes();return}if(t.ctrlKey&&t.key==="z"){t.preventDefault(),this.getInternals().history.undo(),this.rebuildCachedData(),this.renderConnections(),this.updatePreview();return}if(t.ctrlKey&&(t.key==="y"||t.shiftKey&&t.key==="z")){t.preventDefault(),this.getInternals().history.redo(),this.rebuildCachedData(),this.renderConnections(),this.updatePreview();return}if(t.ctrlKey&&t.key==="c"){let o=M.getFile(this.mInstanceKey)?.activeFunction?.graph;o&&this.getInternals().clipboard.copy(o,this.getSelectedIds());return}if(t.ctrlKey&&t.key==="v"){this.pasteFromClipboard();return}}onResizeLeftStart(t){t.preventDefault(),this.startPanelResize("left",t)}onResizeRightStart(t){t.preventDefault(),this.startPanelResize("right",t)}startPanelResize(t,n){let o=t==="left"?this.panelLeft:this.panelRight;this.mResizeState={panel:t,startX:n.clientX,startWidth:o.offsetWidth},this.mResizeMoveHandler=r=>{if(!this.mResizeState)return;let s=t==="left"?r.clientX-this.mResizeState.startX:this.mResizeState.startX-r.clientX,a=Math.max(200,Math.min(500,this.mResizeState.startWidth+s));o.style.width=`${a}px`},this.mResizeUpHandler=()=>{this.mResizeMoveHandler&&document.removeEventListener("pointermove",this.mResizeMoveHandler),this.mResizeUpHandler&&document.removeEventListener("pointerup",this.mResizeUpHandler),this.mResizeState=null},document.addEventListener("pointermove",this.mResizeMoveHandler),document.addEventListener("pointerup",this.mResizeUpHandler)}initializeMainFunctions(t,n){for(let o of n.mainFunctions){let r=new xt(crypto.randomUUID(),o.name,o.label,!0,o.editableByUser??!1),s={};if(o.inputs)for(let[m,d]of Object.entries(o.inputs))s[m]={nodeType:"value",dataType:d};let a={};if(o.outputs)for(let[m,d]of Object.entries(o.outputs))a[m]={nodeType:"value",dataType:d};r.setInputs(s),r.setOutputs(a);let l=0;for(let[m,d]of Object.entries(s)){let y={name:m,category:"input",inputs:{},outputs:{[m]:d}};r.graph.addNode(y,{x:2,y:2+l*3},!0),l++}let c=0;for(let[m,d]of Object.entries(a)){let y={name:m,category:"output",inputs:{[m]:d},outputs:{}};r.graph.addNode(y,{x:30,y:2+c*3},!0),c++}if(o.events)for(let m=0;m<o.events.length;m++){let d=o.events[m],y={name:d.name,category:"event",inputs:{},outputs:{...d.outputs}};r.graph.addNode(y,{x:2+m*10,y:-4},!0)}t.addFunction(r)}}deleteSelectedNodes(){let n=M.getFile(this.mInstanceKey)?.activeFunction?.graph;if(!n)return;let o=[];for(let r of this.getSelectedIds()){let s=n.getNode(r);s&&!s.system&&o.push(new fo(n,r))}o.length>0&&(this.getInternals().history.push(new An("Delete nodes",o)),this.getSelectedIds().clear(),this.rebuildCachedData(),this.renderConnections(),this.updatePreview())}pasteFromClipboard(){let t=this.getInternals(),n=t.clipboard.getData();if(!n)return;let o=this.getProject(),s=M.getFile(this.mInstanceKey)?.activeFunction?.graph;if(!s)return;let a=[],l=[];for(let c of n.nodes){let m=o.nodeDefinitions.get(c.definitionName);if(m){let d=new Sn(s,m,{x:c.position.x+2,y:c.position.y+2});a.push(d),l.push(d)}}if(a.length>0){t.history.push(new An("Paste nodes",a));for(let c=0;c<l.length;c++){let m=l[c].node,d=n.nodes[c];if(m&&d.properties)for(let[y,C]of Object.entries(d.properties))m.properties.set(y,C)}for(let c of n.internalConnections){let m=l[c.sourceNodeIndex]?.node??null,d=l[c.targetNodeIndex]?.node??null;if(m&&d){let y="",C="",G=c.kind==="flow"?"flow":"data";if(G==="data"){for(let[x,b]of m.outputs)if(x===c.sourcePortName){y=b.id;break}for(let[x,b]of d.inputs)if(x===c.targetPortName){C=b.id;break}}else{for(let[x,b]of m.flowOutputs)if(x===c.sourcePortName){y=b.id;break}for(let[x,b]of d.flowInputs)if(x===c.targetPortName){C=b.id;break}}y&&C&&s.addConnection(m.id,y,d.id,C,G)}}this.getSelectedIds().clear();for(let c of l)c.node&&this.getSelectedIds().add(c.node.id);this.rebuildCachedData(),this.renderConnections(),this.updatePreview()}}selectNodesInBox(){let n=M.getFile(this.mInstanceKey)?.activeFunction?.graph;if(!n)return;let o=this.getInternals(),r=o.interaction.screenToWorld(Math.min(this.mSelectionBoxScreen.x1,this.mSelectionBoxScreen.x2),Math.min(this.mSelectionBoxScreen.y1,this.mSelectionBoxScreen.y2)),s=o.interaction.screenToWorld(Math.max(this.mSelectionBoxScreen.x1,this.mSelectionBoxScreen.x2),Math.max(this.mSelectionBoxScreen.y1,this.mSelectionBoxScreen.y2)),a=o.interaction.gridSize;for(let l of n.nodes.values()){let c=l.position.x*a,m=l.position.y*a,d=c+l.size.w*a,y=m+l.size.h*a;c<s.x&&d>r.x&&m<s.y&&y>r.y&&this.getSelectedIds().add(l.id)}this.rebuildCachedData()}renderConnections(){if(!this.svgLayer)return;let n=M.getFile(this.mInstanceKey)?.activeFunction?.graph;if(!n){this.getInternals().renderer.clearAll(this.svgLayer);return}let o=this.getInternals(),r=o.interaction.gridSize,s=28,a=24,l=4,c=[];for(let m of n.connections.values()){let d=n.getNode(m.sourceNodeId),y=n.getNode(m.targetNodeId);if(!d||!y)continue;let C=d.position.x*r,G=d.position.y*r,x=y.position.x*r,b=y.position.y*r,E=d.size.w*r,A,R,W,v;if(m.kind==="data"){let Mn=0,Yt=0;for(let vo of d.outputs.values()){if(vo.id===m.sourcePortId){Mn=Yt;break}Yt++}let si=0;Yt=0;for(let vo of y.inputs.values()){if(vo.id===m.targetPortId){si=Yt;break}Yt++}A=C+E,R=G+s+l+(Mn+.5)*a,W=x,v=b+s+l+(si+.5)*a}else A=C+E,R=G+s/2,W=x,v=b+s/2;c.push({id:m.id,sourceX:A,sourceY:R,targetX:W,targetY:v,color:m.valid?"var(--pn-text-secondary)":"var(--pn-accent-danger)",valid:m.valid})}o.renderer.renderConnections(this.svgLayer,c)}initializePreview(){let t=M.getProject(this.mInstanceKey);if(!t)return;let n=t.createPreview;if(!n)return;let o=this.getInternals();if(o.previewInitialized)return;let r=this.previewEl;if(r&&typeof r.getContainer=="function"){let s=r.getContainer();n(s),o.previewInitialized=!0}}updatePreview(){let t=M.getProject(this.mInstanceKey);if(!t)return;let n=t.updatePreview;if(!n)return;let o=M.getFile(this.mInstanceKey);if(!o||this.getInternals().cachedData.errors.some(l=>l.blocking!==!1))return;let a;try{let c=new Dn(t).serialize(o);a=this.stripMetadataComments(c,t.commentToken)}catch{return}clearTimeout(this.mPreviewDebounceTimer),this.mPreviewDebounceTimer=setTimeout(()=>{try{n(a)}catch{}},300)}stripMetadataComments(t,n){let o=t.split(`
`),r=`${n} #potatno `;return o.filter(a=>!a.trim().startsWith(r)).join(`
`)}updateNodePosition(t){let o=M.getFile(this.mInstanceKey)?.activeFunction?.graph.getNode(t);if(!o)return;let r=this.getInternals().interaction.gridSize;for(let s of this.getInternals().cachedData.visibleNodes)if(s.id===t){s.position={x:o.position.x,y:o.position.y},s.pixelX=o.position.x*r,s.pixelY=o.position.y*r;break}}updateNodeSize(t){let o=M.getFile(this.mInstanceKey)?.activeFunction?.graph.getNode(t);if(o){for(let r of this.getInternals().cachedData.visibleNodes)if(r.id===t){r.size={w:o.size.w,h:o.size.h};break}}}validateProject(){let t=[],n=M.getFile(this.mInstanceKey);if(!n)return t;let o=/^[a-zA-Z][a-zA-Z0-9_]*$/,r=new Set;for(let a of n.functions.values()){r.has(a.name)&&t.push({message:`Duplicate function name "${a.name}".`,location:`Function "${a.name}"`}),r.add(a.name),o.test(a.name)||t.push({message:`Invalid function name "${a.name}". Must start with a letter and contain only letters, digits, and underscores.`,location:`Function "${a.name}"`});let l=new Set;for(let c of Object.keys(a.inputs))o.test(c)||t.push({message:`Invalid input name "${c}".`,location:`Function "${a.name}" > Inputs`}),l.has(c)&&t.push({message:`Duplicate input/output name "${c}".`,location:`Function "${a.name}" > Inputs`}),l.add(c);for(let c of Object.keys(a.outputs))o.test(c)||t.push({message:`Invalid output name "${c}".`,location:`Function "${a.name}" > Outputs`}),l.has(c)&&t.push({message:`Duplicate input/output name "${c}".`,location:`Function "${a.name}" > Outputs`}),l.add(c)}let s=n.activeFunction;if(!s)return t.push({message:"No active function selected.",location:"Editor"}),t;for(let a of s.graph.nodes.values())for(let l of a.inputs.values())!l.connectedTo&&!a.system&&t.push({message:`Input "${l.name}" on node "${a.definitionName}" is not connected.`,location:`Function "${s.name}" > Node "${a.definitionName}"`,blocking:!1});for(let a of s.graph.connections.values())a.valid||t.push({message:"Type mismatch on connection.",location:`Function "${s.name}"`});return t}rebuildCachedData(){let t=M.getProject(this.mInstanceKey),n=M.getFile(this.mInstanceKey),o=this.getInternals().cachedData;o.activeFunctionId=n?.activeFunctionId??"",o.hasPreview=t?.hasPreview??!1,o.errors=this.validateProject();let r=[];if(t)for(let c of t.nodeDefinitions.values())r.push({name:c.name,category:c.category});if(n)for(let c of n.functions.values())c.system||r.push({name:c.name,category:"function"});o.nodeDefinitionList=r;let s=[];if(n)for(let c of n.functions.values())s.push({id:c.id,name:c.name,label:c.label,system:c.system});if(o.functionList=s,t&&n){let c=n.activeFunction;if(c){let m=new Set(c.imports);for(let d of t.imports)if(m.has(d.name))for(let y of d.nodes)r.push({name:y.name,category:y.category})}}if(t){for(let c of t.globalInputs)r.push({name:`Get ${c.name}`,category:"value"});for(let c of t.globalOutputs)r.push({name:`Set ${c.name}`,category:"value"})}o.availableImports=t?.imports.map(c=>c.name)??[];let a=new Set;if(t)for(let c of t.nodeDefinitions.values()){let m=c;for(let d of Object.values(m.inputs))(d.nodeType==="value"||d.nodeType==="input")&&a.add(d.dataType);for(let d of Object.values(m.outputs))(d.nodeType==="value"||d.nodeType==="input")&&a.add(d.dataType)}o.availableTypes=[...a].sort();let l=n?.activeFunction;if(o.activeFunctionName=l?.name??"",o.activeFunctionIsSystem=l?.system??!1,o.activeFunctionEditableByUser=l?.editableByUser??!1,o.activeFunctionInputs=l?Object.entries(l.inputs).map(([c,m])=>({name:c,type:m.nodeType==="value"||m.nodeType==="input"?m.dataType:""})):[],o.activeFunctionOutputs=l?Object.entries(l.outputs).map(([c,m])=>({name:c,type:m.nodeType==="value"||m.nodeType==="input"?m.dataType:""})):[],o.activeFunctionImports=[...l?.imports??[]],l){let c=new Set,m=new Set;for(let y of l.graph.connections.values())c.add(y.sourcePortId),m.add(y.sourcePortId),m.add(y.targetPortId);let d=[];for(let y of l.graph.nodes.values()){let C=t?.nodeDefinitions.get(y.definitionName),G=Nt.get(y.category),x=[];for(let R of y.inputs.values())x.push({id:R.id,name:R.name,type:R.type,direction:R.direction,connectedTo:R.connectedTo});let b=[];for(let R of y.outputs.values()){let W=c.has(R.id);b.push({id:R.id,name:R.name,type:R.type,direction:R.direction,connectedTo:W?"connected":null})}let E=[];for(let R of y.flowInputs.values())E.push({id:R.id,name:R.name,direction:R.direction,connectedTo:m.has(R.id)?"connected":null});let A=[];for(let R of y.flowOutputs.values())A.push({id:R.id,name:R.name,direction:R.direction,connectedTo:m.has(R.id)?"connected":null});d.push({id:y.id,definitionName:y.definitionName,category:y.category,categoryColor:G.cssColor,categoryIcon:G.icon,label:y.definitionName,position:{x:y.position.x,y:y.position.y},size:{w:y.size.w,h:y.size.h},system:y.system,selected:this.getSelectedIds().has(y.id),inputs:x,outputs:b,flowInputs:E,flowOutputs:A,valueText:y.properties.get("value")??"",commentText:y.properties.get("comment")??"",hasDefinition:!!C,pixelX:y.position.x*this.getInternals().interaction.gridSize,pixelY:y.position.y*this.getInternals().interaction.gridSize})}o.visibleNodes=d}else o.visibleNodes=[];this.mCacheVersion++}};_=k(Mc),ti=new WeakMap,ni=new WeakMap,oi=new WeakMap,ri=new WeakMap,h(_,4,"svgLayer",Lc,he,ti),h(_,4,"canvasWrapper",Sc,he,ni),h(_,4,"panelLeft",Ac,he,oi),h(_,4,"panelRight",Dc,he,ri),h(_,3,"project",Nc,he),h(_,3,"file",kc,he),h(_,1,"loadCode",Ec,he),h(_,1,"generateCode",wc,he),he=h(_,0,"PotatnoCodeEditor",Rc,he),u(_,1,he)});var Gc,Fc=p(()=>{Gc=`:host {\r
    display: block;\r
    width: 100%;\r
    height: 100%;\r
}\r
\r
potatno-code-editor {\r
    display: block;\r
    width: 100%;\r
    height: 100%;\r
}`});var Bc,jc=p(()=>{Bc=`:host {\r
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
`});var bo,Vc=p(()=>{de();Oc();Fc();jc();bo=class extends at{mCodeEditor;mProject;get file(){return this.mCodeEditor.file}set file(e){this.mCodeEditor.file=e}get project(){return this.mProject}constructor(e){super("potatno-code",new Ge),this.mProject=e,this.addStyle(Bc),this.addStyle(Gc),this.mCodeEditor=this.addContent(he),this.mCodeEditor.project=e}}});var B,Uc=p(()=>{S();B=class{mName;mCategory;mInputs;mOutputs;mCodeGenerator;get name(){return this.mName}get category(){return this.mCategory}get inputs(){return this.mInputs}get outputs(){return this.mOutputs}get codeGenerator(){return this.mCodeGenerator}constructor(e,t){this.mName=t.name,this.mCategory=t.category,this.mInputs=t.inputs??{},this.mOutputs=t.outputs??{},this.mCodeGenerator=t.codeGenerator;for(let n of Object.values(this.mInputs))if(n.nodeType==="value"&&!e.hasType(n.dataType))throw new g(`Type not registered in project for input port type '${n.dataType}' in node definition '${this.mName}'.`,this);for(let n of Object.values(this.mOutputs))if(n.nodeType==="value"&&!e.hasType(n.dataType))throw new g(`Type not registered in project for output port type '${n.dataType}' in node definition '${this.mName}'.`,this)}}});var To,zc=p(()=>{To=class{mCommentToken;mCreatePreview;mFunctionCodeGenerator;mGlobalInputs;mGlobalOutputs;mImports;mMainFunctions;mNodeDefinitions;mUpdatePreview;mValidTypes;get commentToken(){return this.mCommentToken}get createPreview(){return this.mCreatePreview}get functionCodeGenerator(){return this.mFunctionCodeGenerator}get globalInputs(){return this.mGlobalInputs}get globalOutputs(){return this.mGlobalOutputs}get hasPreview(){return this.mCreatePreview!==null}get imports(){return this.mImports}get mainFunctions(){return this.mMainFunctions}get nodeDefinitions(){return this.mNodeDefinitions}get updatePreview(){return this.mUpdatePreview}constructor(){this.mCommentToken="//",this.mNodeDefinitions=new Map,this.mMainFunctions=new Array,this.mImports=new Array,this.mGlobalInputs=new Array,this.mGlobalOutputs=new Array,this.mCreatePreview=null,this.mUpdatePreview=null,this.mFunctionCodeGenerator=null,this.mValidTypes=new Set}addGlobalInput(e){this.mGlobalInputs.push(e)}addGlobalOutput(e){this.mGlobalOutputs.push(e)}addImport(e){this.mImports.push(e)}addMainFunction(e){this.mMainFunctions.push(e)}addNodeDefinition(e){this.mNodeDefinitions.set(e.name,e)}setCommentToken(e){this.mCommentToken=e}setFunctionCodeGenerator(e){this.mFunctionCodeGenerator=e}setPreview(e,t){this.mCreatePreview=e,this.mUpdatePreview=t}addType(e){this.mValidTypes.add(e)}hasType(e){return this.mValidTypes.has(e)}}});var Vu={};var T,Fe,$c,Hc=p(()=>{xo();st();Vc();Uc();zc();T=new To;T.setCommentToken("//");T.addType("number");T.addType("string");T.addType("boolean");T.addImport({name:"Math",nodes:[new B(T,{name:"Math.PI",category:"value",inputs:{},outputs:{value:{nodeType:"value",dataType:"number"}},codeGenerator:i=>`const ${i.outputs.value.valueId} = Math.PI;`}),new B(T,{name:"Math.E",category:"value",inputs:{},outputs:{value:{nodeType:"value",dataType:"number"}},codeGenerator:i=>`const ${i.outputs.value.valueId} = Math.E;`}),new B(T,{name:"Math.abs",category:"function",inputs:{value:{nodeType:"value",dataType:"number"}},outputs:{result:{nodeType:"value",dataType:"number"}},codeGenerator:i=>`const ${i.outputs.result.valueId} = Math.abs(${i.inputs.value.valueId});`}),new B(T,{name:"Math.floor",category:"function",inputs:{value:{nodeType:"value",dataType:"number"}},outputs:{result:{nodeType:"value",dataType:"number"}},codeGenerator:i=>`const ${i.outputs.result.valueId} = Math.floor(${i.inputs.value.valueId});`}),new B(T,{name:"Math.random",category:"function",inputs:{},outputs:{result:{nodeType:"value",dataType:"number"}},codeGenerator:i=>`const ${i.outputs.result.valueId} = Math.random();`})]});T.addGlobalInput({name:"time",type:"number"});T.addGlobalOutput({name:"result",type:"string"});T.addNodeDefinition(new B(T,{name:"Number Literal",category:"value",inputs:{},outputs:{value:{nodeType:"input",inputType:"number",dataType:"number"}},codeGenerator:i=>`const ${i.outputs.value.valueId} = ${i.outputs.value.value};`}));T.addNodeDefinition(new B(T,{name:"String Literal",category:"value",inputs:{},outputs:{value:{nodeType:"input",inputType:"string",dataType:"string"}},codeGenerator:i=>`const ${i.outputs.value.valueId} = "${i.outputs.value.value}";`}));T.addNodeDefinition(new B(T,{name:"Boolean Literal",category:"value",inputs:{},outputs:{value:{nodeType:"input",inputType:"boolean",dataType:"boolean"}},codeGenerator:i=>`const ${i.outputs.value.valueId} = ${i.outputs.value.value?"true":"false"};`}));T.addNodeDefinition(new B(T,{name:"Add",category:"operator",inputs:{a:{nodeType:"value",dataType:"number"},b:{nodeType:"value",dataType:"number"}},outputs:{result:{nodeType:"value",dataType:"number"}},codeGenerator:i=>`const ${i.outputs.result.valueId} = ${i.inputs.a.valueId} + ${i.inputs.b.valueId};`}));T.addNodeDefinition(new B(T,{name:"Subtract",category:"operator",inputs:{a:{nodeType:"value",dataType:"number"},b:{nodeType:"value",dataType:"number"}},outputs:{result:{nodeType:"value",dataType:"number"}},codeGenerator:i=>`const ${i.outputs.result.valueId} = ${i.inputs.a.valueId} - ${i.inputs.b.valueId};`}));T.addNodeDefinition(new B(T,{name:"Multiply",category:"operator",inputs:{a:{nodeType:"value",dataType:"number"},b:{nodeType:"value",dataType:"number"}},outputs:{result:{nodeType:"value",dataType:"number"}},codeGenerator:i=>`const ${i.outputs.result.valueId} = ${i.inputs.a.valueId} * ${i.inputs.b.valueId};`}));T.addNodeDefinition(new B(T,{name:"Divide",category:"operator",inputs:{a:{nodeType:"value",dataType:"number"},b:{nodeType:"value",dataType:"number"}},outputs:{result:{nodeType:"value",dataType:"number"}},codeGenerator:i=>`const ${i.outputs.result.valueId} = ${i.inputs.a.valueId} / ${i.inputs.b.valueId};`}));T.addNodeDefinition(new B(T,{name:"Modulo",category:"operator",inputs:{a:{nodeType:"value",dataType:"number"},b:{nodeType:"value",dataType:"number"}},outputs:{result:{nodeType:"value",dataType:"number"}},codeGenerator:i=>`const ${i.outputs.result.valueId} = ${i.inputs.a.valueId} % ${i.inputs.b.valueId};`}));T.addNodeDefinition(new B(T,{name:"Equal",category:"operator",inputs:{a:{nodeType:"value",dataType:"number"},b:{nodeType:"value",dataType:"number"}},outputs:{result:{nodeType:"value",dataType:"boolean"}},codeGenerator:i=>`const ${i.outputs.result.valueId} = ${i.inputs.a.valueId} === ${i.inputs.b.valueId};`}));T.addNodeDefinition(new B(T,{name:"Not Equal",category:"operator",inputs:{a:{nodeType:"value",dataType:"number"},b:{nodeType:"value",dataType:"number"}},outputs:{result:{nodeType:"value",dataType:"boolean"}},codeGenerator:i=>`const ${i.outputs.result.valueId} = ${i.inputs.a.valueId} !== ${i.inputs.b.valueId};`}));T.addNodeDefinition(new B(T,{name:"Less Than",category:"operator",inputs:{a:{nodeType:"value",dataType:"number"},b:{nodeType:"value",dataType:"number"}},outputs:{result:{nodeType:"value",dataType:"boolean"}},codeGenerator:i=>`const ${i.outputs.result.valueId} = ${i.inputs.a.valueId} < ${i.inputs.b.valueId};`}));T.addNodeDefinition(new B(T,{name:"Greater Than",category:"operator",inputs:{a:{nodeType:"value",dataType:"number"},b:{nodeType:"value",dataType:"number"}},outputs:{result:{nodeType:"value",dataType:"boolean"}},codeGenerator:i=>`const ${i.outputs.result.valueId} = ${i.inputs.a.valueId} > ${i.inputs.b.valueId};`}));T.addNodeDefinition(new B(T,{name:"And",category:"operator",inputs:{a:{nodeType:"value",dataType:"boolean"},b:{nodeType:"value",dataType:"boolean"}},outputs:{result:{nodeType:"value",dataType:"boolean"}},codeGenerator:i=>`const ${i.outputs.result.valueId} = ${i.inputs.a.valueId} && ${i.inputs.b.valueId};`}));T.addNodeDefinition(new B(T,{name:"Or",category:"operator",inputs:{a:{nodeType:"value",dataType:"boolean"},b:{nodeType:"value",dataType:"boolean"}},outputs:{result:{nodeType:"value",dataType:"boolean"}},codeGenerator:i=>`const ${i.outputs.result.valueId} = ${i.inputs.a.valueId} || ${i.inputs.b.valueId};`}));T.addNodeDefinition(new B(T,{name:"Not",category:"operator",inputs:{a:{nodeType:"value",dataType:"boolean"}},outputs:{result:{nodeType:"value",dataType:"boolean"}},codeGenerator:i=>`const ${i.outputs.result.valueId} = !${i.inputs.a.valueId};`}));T.addNodeDefinition(new B(T,{name:"Number to String",category:"type-conversion",inputs:{input:{nodeType:"value",dataType:"number"}},outputs:{output:{nodeType:"value",dataType:"string"}},codeGenerator:i=>`const ${i.outputs.output.valueId} = String(${i.inputs.input.valueId});`}));T.addNodeDefinition(new B(T,{name:"String to Number",category:"type-conversion",inputs:{input:{nodeType:"value",dataType:"string"}},outputs:{output:{nodeType:"value",dataType:"number"}},codeGenerator:i=>`const ${i.outputs.output.valueId} = Number(${i.inputs.input.valueId});`}));T.addNodeDefinition(new B(T,{name:"Boolean to String",category:"type-conversion",inputs:{input:{nodeType:"value",dataType:"boolean"}},outputs:{output:{nodeType:"value",dataType:"string"}},codeGenerator:i=>`const ${i.outputs.output.valueId} = String(${i.inputs.input.valueId});`}));T.addNodeDefinition(new B(T,{name:"If",category:"flow",inputs:{exec:{nodeType:"flow"},condition:{nodeType:"value",dataType:"boolean"}},outputs:{then:{nodeType:"flow"},else:{nodeType:"flow"}},codeGenerator:i=>`if (${i.inputs.condition.valueId}) {
${i.outputs.then.code}
} else {
${i.outputs.else.code}
}`}));T.addNodeDefinition(new B(T,{name:"While",category:"flow",inputs:{exec:{nodeType:"flow"},condition:{nodeType:"value",dataType:"boolean"}},outputs:{body:{nodeType:"flow"}},codeGenerator:i=>`while (${i.inputs.condition.valueId}) {
${i.outputs.body.code}
}`}));T.addNodeDefinition(new B(T,{name:"For Loop",category:"flow",inputs:{exec:{nodeType:"flow"},count:{nodeType:"value",dataType:"number"}},outputs:{exec:{nodeType:"flow"},index:{nodeType:"value",dataType:"number"}},codeGenerator:i=>`for (let ${i.outputs.index.valueId} = 0; ${i.outputs.index.valueId} < ${i.inputs.count.valueId}; ${i.outputs.index.valueId}++) {
${i.outputs.exec.code}
}`}));T.addNodeDefinition(new B(T,{name:"Console Log",category:"function",inputs:{message:{nodeType:"value",dataType:"string"}},outputs:{},codeGenerator:({inputs:i})=>`console.log(${i.message});`}));T.addNodeDefinition(new B(T,{name:"String Concat",category:"function",inputs:{a:{nodeType:"value",dataType:"string"},b:{nodeType:"value",dataType:"string"}},outputs:{result:{nodeType:"value",dataType:"string"}},codeGenerator:i=>`const ${i.outputs.result.valueId} = ${i.inputs.a.valueId} + ${i.inputs.b.valueId};`}));T.setFunctionCodeGenerator(i=>{let e=i.inputs.map(n=>n.valueId).join(", "),t=i.outputs.length>0?`
    return ${i.outputs[0].valueId};`:"";return`function ${i.name}(${e}) {
${i.bodyCode}${t}
}`});T.addMainFunction({name:"main",label:"Main",editableByUser:!0,inputs:{},outputs:{},events:[{name:"OnStart",outputs:[]},{name:"OnTick",outputs:[{name:"deltaTime",type:"number"}]}]});T.setPreview(i=>{Fe=document.createElement("pre"),Fe.style.cssText='color: #cdd6f4; margin: 0; padding: 8px; font-family: "Cascadia Code", "Fira Code", monospace; font-size: 13px; white-space: pre-wrap; word-break: break-all;',i.appendChild(Fe)},i=>{if(Fe)try{let e=`
                const __logs = [];
                const console = { log: function() { __logs.push(Array.prototype.slice.call(arguments).map(String).join(' ')); } };
                ${i}
                if (typeof main === 'function') { main(); }
                return __logs;
            `,n=new Function(e)();n.length>0?(Fe.textContent=n.join(`
`),Fe.style.color="#cdd6f4"):(Fe.textContent="(no output)",Fe.style.color="#6c7086")}catch(e){Fe.textContent=`Error: ${e.message??e}`,Fe.style.color="#f38ba8"}});$c=new bo(T);$c.appendTo(document.body);$c.file=new kt});(()=>{let i=new WebSocket("ws://127.0.0.1:8088");i.addEventListener("open",()=>{console.log("Refresh connection established")}),i.addEventListener("message",e=>{console.log("Bundle finished. Start refresh"),e.data==="REFRESH"&&window.location.reload()})})();Promise.resolve().then(()=>Hc());
//# sourceMappingURL=page.js.map
