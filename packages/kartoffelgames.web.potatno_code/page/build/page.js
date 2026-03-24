var Kc=Object.create;var vr=Object.defineProperty;var Xc=Object.getOwnPropertyDescriptor;var pi=(i,e)=>(e=Symbol[i])?e:Symbol.for("Symbol."+i),wt=i=>{throw TypeError(i)};var di=(i,e,t)=>e in i?vr(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t;var li=(i,e)=>vr(i,"name",{value:e,configurable:!0});var p=(i,e)=>()=>(i&&(e=i(i=0)),e);var E=i=>[,,,Kc(i?.[pi("metadata")]??null)],mi=["class","method","getter","setter","accessor","field","value","get","set"],Yt=i=>i!==void 0&&typeof i!="function"?wt("Function expected"):i,Wc=(i,e,t,n,r)=>({kind:mi[i],name:e,metadata:n,addInitializer:o=>t._?wt("Already initialized"):r.push(Yt(o||null))}),Zc=(i,e)=>di(e,pi("metadata"),i[3]),u=(i,e,t,n)=>{for(var r=0,o=i[e>>1],s=o&&o.length;r<s;r++)e&1?o[r].call(t):n=o[r].call(t,n);return n},d=(i,e,t,n,r,o)=>{var s,a,l,c,h,m=e&7,y=!!(e&8),C=!!(e&16),F=m>3?i.length+1:m?y?1:2:0,x=mi[m+5],b=m>3&&(i[F-1]=[]),w=i[F]||(i[F]=[]),A=m&&(!C&&!y&&(r=r.prototype),m<5&&(m>3||!C)&&Xc(m<4?r:{get[t](){return ci(this,o)},set[t](X){return ui(this,o,X)}},t));m?C&&m<4&&li(o,(m>2?"set ":m>1?"get ":"")+t):li(r,t);for(var M=n.length-1;M>=0;M--)c=Wc(m,t,l={},i[3],w),m&&(c.static=y,c.private=C,h=c.access={has:C?X=>Yc(r,X):X=>t in X},m^3&&(h.get=C?X=>(m^1?ci:_c)(X,r,m^4?o:A.get):X=>X[t]),m>2&&(h.set=C?(X,T)=>ui(X,r,T,m^4?o:A.set):(X,T)=>X[t]=T)),a=(0,n[M])(m?m<4?C?o:A[x]:m>4?void 0:{get:A.get,set:A.set}:r,c),l._=1,m^4||a===void 0?Yt(a)&&(m>4?b.unshift(a):m?C?o=a:A[x]=a:r=a):typeof a!="object"||a===null?wt("Object expected"):(Yt(s=a.get)&&(A.get=s),Yt(s=a.set)&&(A.set=s),Yt(s=a.init)&&b.unshift(s));return m||Zc(i,r),A&&vr(r,t,A),C?m^4?o:A:r},f=(i,e,t)=>di(i,typeof e!="symbol"?e+"":e,t),Cr=(i,e,t)=>e.has(i)||wt("Cannot "+t),Yc=(i,e)=>Object(e)!==e?wt('Cannot use the "in" operator on this value'):i.has(e),ci=(i,e,t)=>(Cr(i,e,"read from private field"),t?t.call(i):e.get(i)),k=(i,e,t)=>e.has(i)?wt("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(i):e.set(i,t),ui=(i,e,t,n)=>(Cr(i,e,"write to private field"),n?n.call(i,t):e.set(i,t),t),_c=(i,e,t)=>(Cr(i,e,"access private method"),t);var De,xr=p(()=>{De=class{mData;mInteractionTrigger;mInteractionType;mOrigin;mStackError;get data(){return this.mData}get origin(){return this.mOrigin}get stacktrace(){return this.mStackError}get trigger(){return this.mInteractionTrigger}get type(){return this.mInteractionType}constructor(e,t,n,r){this.mInteractionType=e,this.mInteractionTrigger=t,this.mData=r,this.mStackError=new Error,this.mOrigin=n}toString(){return`${this.origin.name} -> ${this.type[this.trigger]} - ${this.data.toString()}`}}});var _,Pr=p(()=>{_=class i extends Array{static newListWith(...e){let t=new i;return t.push(...e),t}clear(){this.splice(0,this.length)}clone(){return i.newListWith(...this)}distinct(){return i.newListWith(...new Set(this))}equals(e){if(this===e)return!0;if(!e||this.length!==e.length)return!1;for(let t=0;t<this.length;++t)if(this[t]!==e[t])return!1;return!0}remove(e){let t=this.indexOf(e);if(t!==-1)return this.splice(t,1)[0]}replace(e,t){let n=this.indexOf(e);if(n!==-1){let r=this[n];return this[n]=t,r}}toString(){return`[${super.join(", ")}]`}}});var g,Et=p(()=>{g=class extends Error{mTarget;get target(){return this.mTarget}constructor(e,t,n){super(e,n),this.mTarget=t}}});var N,hi=p(()=>{Pr();Et();N=class i extends Map{add(e,t){if(!this.has(e))this.set(e,t);else throw new g("Can't add duplicate key to dictionary.",this)}clone(){return new i(this)}getAllKeysOfValue(e){return[...this.entries()].filter(r=>r[1]===e).map(r=>r[0])}getOrDefault(e,t){let n=this.get(e);return typeof n<"u"?n:t}map(e){let t=new _;for(let n of this){let r=e(n[0],n[1]);t.push(r)}return t}}});var Ie,yi=p(()=>{Ie=class i{mSize;mTopItem;get size(){return this.mSize}get top(){if(this.mTopItem)return this.mTopItem.value}constructor(){this.mTopItem=null,this.mSize=0}clone(){let e=new i;return e.mTopItem=this.mTopItem,e.mSize=this.mSize,e}*entries(){let e=this.mTopItem;for(;e!==null;)yield e.value,e=e.previous}flush(){let e=new Array;for(;this.mTopItem;)e.push(this.pop());return e}pop(){if(!this.mTopItem)return;let e=this.mTopItem.value;return this.mTopItem=this.mTopItem.previous,this.mSize--,e}push(e){let t={previous:this.mTopItem,value:e};this.mTopItem=t,this.mSize++}toArray(){return[...this.entries()]}}});var gi=p(()=>{});var fi=p(()=>{Et()});var bi=p(()=>{});var Ti=p(()=>{});var _t,vi=p(()=>{_t=class{mCompareFunction;constructor(e){this.mCompareFunction=e}differencesOf(e,t){let n={1:{x:0,history:[]}},r=c=>c-1,o=e.length,s=t.length,a,l;for(let c=0;c<o+s+1;c++)for(let h=-c;h<c+1;h+=2){let m=h===-c||h!==c&&n[h-1].x<n[h+1].x;if(m){let C=n[h+1];l=C.x,a=C.history}else{let C=n[h-1];l=C.x+1,a=C.history}a=a.slice();let y=l-h;for(1<=y&&y<=s&&m?a.push({changeState:2,item:t[r(y)]}):1<=l&&l<=o&&a.push({changeState:1,item:e[r(l)]});l<o&&y<s&&this.mCompareFunction(e[r(l+1)],t[r(y+1)]);)l+=1,y+=1,a.push({changeState:3,item:e[r(l)]});if(l>=o&&y>=s)return a;n[h]={x:l,history:a}}return new Array}}});var Ci=p(()=>{});var Ir=p(()=>{});var xi=p(()=>{});var Mn=p(()=>{Et()});var wr=p(()=>{Et();Mn()});var Ii=p(()=>{Ir();wr();Mn()});var L=p(()=>{hi();Pr();yi();Et();gi();fi();bi();Ti();vi();Ci();Ir();xi();wr();Ii();Mn()});var Ke,Er=p(()=>{Ke=class i{static mAsyncronErrorZones=new WeakMap;static mSynchronErrorZones=new WeakMap;static allocateAsyncronError(e,t){i.mAsyncronErrorZones.set(e,t)}static allocateSyncronError(e,t){let n=typeof e=="object"&&e!==null?e:new Error(e);return i.mSynchronErrorZones.set(n,t),n}static getAsyncronErrorZone(e){return i.mAsyncronErrorZones.get(e)}static getSyncronErrorZone(e){return i.mSynchronErrorZones.get(e)}}});var Rn,wi=p(()=>{L();Er();kr();Rn=class i{static enable(e){if(e.target.globalPatched)return!1;e.target.globalPatched=!0;let t=e.target,n=new i;{let r=e.patches.requirements.promise;t[r]=n.patchPromise(t[r]);let o=e.patches.requirements.eventTarget;t[o]=n.patchEventTarget(t[o])}n.patchOnEvents(t);for(let r of e.patches.functions??[])t[r]=n.patchFunctionCallbacks(t[r]);if(!e.patches.classes)return!0;for(let r of e.patches.classes.callback??[]){let o=t[r];o=n.patchClass(o),t[r]=o}for(let r of e.patches.classes.eventTargets??[]){let o=t[r];n.patchOnEvents(o.prototype)}return!0}callInZone(e,t){return function(...n){return t.execute(()=>e(...n))}}patchClass(e){if(typeof e!="function")return e;let t=this,n=class extends e{constructor(...r){let o=z.current;for(let s=0;s<r.length;s++){let a=r[s];typeof a=="function"&&(r[s]=t.callInZone(t.patchFunctionCallbacks(a),o))}super(...r)}};return this.patchMethods(n),n}patchEventTarget(e){let t=e.prototype,n=this,r=new WeakMap,o=t.addEventListener,s=t.removeEventListener;return Object.defineProperty(t,"addEventListener",{configurable:!1,writable:!1,value:function(a,l,c){if(l===null||typeof l!="function"&&!(typeof l=="object"&&"handleEvent"in l)){o.call(this,a,l,c);return}let h=r.get(l);if(!h){let m=z.current;typeof l=="function"?h=n.callInZone(l,m):h=n.callInZone(l.handleEvent.bind(l),m)}r.set(l,h),o.call(this,a,h,c)}}),Object.defineProperty(t,"removeEventListener",{configurable:!1,writable:!1,value:function(a,l,c){if(l===null||typeof l!="function"&&!(typeof l=="object"&&"handleEvent"in l)){s.call(this,a,l,c);return}let h=r.get(l)??l;s.call(this,a,h,c)}}),e}patchFunctionCallbacks(e){let t=this;return function(...n){let r=z.current;for(let o=0;o<n.length;o++){let s=n[o];typeof s=="function"&&(n[o]=t.callInZone(t.patchFunctionCallbacks(s),r))}return r.execute(()=>e.call(this,...n))}}patchMethods(e){if(typeof e!="function")return e;let t=o=>{if(o===null||o.constructor===Object)return new N;let s=new N;for(let a of Object.getOwnPropertyNames(o)){if(a==="constructor")continue;let l=Object.getOwnPropertyDescriptor(o,a);l&&typeof l.value=="function"&&s.set(a,l)}for(let[a,l]of t(Object.getPrototypeOf(o)))s.has(a)||s.set(a,l);return s},n=e.prototype,r=t(n);for(let[o,s]of r)s.configurable&&(s.value=this.patchFunctionCallbacks(s.value),Object.defineProperty(n,o,s))}patchOnEvents(e){if(!e||!(e instanceof EventTarget))return;let t=r=>{if(r===null)return new N;let o=new N;for(let s of Object.getOwnPropertyNames(r)){if(!s.startsWith("on"))continue;let a=Object.getOwnPropertyDescriptor(r,s);a&&typeof a.value!="function"&&o.set(s.substring(2),a)}for(let[s,a]of t(Object.getPrototypeOf(r)))o.has(s)||o.set(s,a);return o},n=t(e);for(let[r,o]of n){if(!o.configurable)continue;let s=`on${r}`;delete o.writable,delete o.value;let a=new WeakMap;o.set=function(l){let c=a.get(this);(typeof c=="function"||typeof c=="object")&&this.removeEventListener(r,c),a.set(this,l),(typeof l=="function"||typeof l=="object")&&this.addEventListener(r,l)},o.get=function(){return a.get(this)},Object.defineProperty(e,s,o)}}patchPromise(e){let t=e;class n extends t{constructor(o){super(o),Ke.allocateAsyncronError(this,z.current)}}return this.patchMethods(n),n}}});var z,kr=p(()=>{L();Er();xr();wi();z=class i{static mCurrentZone=new i("Default",null,!0);static get current(){return i.mCurrentZone}static enableGlobalTracing(e){if(!Rn.enable(e))return!1;if(!e.errorHandling)return!0;let t=e.target;if(!("addEventListener"in t)||typeof t.addEventListener!="function")throw new g("Global scope does not support addEventListener",i);let n=(r,o,s)=>{s&&s.callErrorListener(o)&&r.preventDefault()};return t.addEventListener("error",r=>{typeof r.error!="object"||r.error===null||n(r,r.error,Ke.getSyncronErrorZone(r.error))}),t.addEventListener("unhandledrejection",r=>{n(r,r.reason,Ke.getAsyncronErrorZone(r.promise))}),!0}static pushInteraction(e,t,n){if(((this.mCurrentZone.mTriggerMapping.get(e)??-1)&t)===0)return!1;let o=new De(e,t,this.mCurrentZone,n);return this.mCurrentZone.callInteractionListener(o)}mAttachments;mErrorListener;mInteractionListener;mIsolated;mName;mParent;mTriggerMapping;get name(){return this.mName}get parent(){return this.mParent}constructor(e,t,n){this.mAttachments=new Map,this.mErrorListener=new N,this.mName=e,this.mTriggerMapping=new N,this.mInteractionListener=new N,this.mParent=t,this.mIsolated=n}addErrorListener(e){return this.mErrorListener.set(e,i.current),this}addInteractionListener(e,t){return this.mInteractionListener.has(e)||this.mInteractionListener.set(e,new N),this.mInteractionListener.get(e).set(t,i.current),this}addTriggerRestriction(e,t){return this.mTriggerMapping.set(e,t),this}attachment(e,t){if(typeof t<"u")return this.mAttachments.set(e,t),t;let n=this.mAttachments.get(e);if(typeof n<"u")return n;if(!this.mIsolated)return this.mParent.attachment(e)}create(e,t){return new i(e,this,t?.isolate===!0)}execute(e,...t){let n=i.mCurrentZone;i.mCurrentZone=this;let r;try{r=e(...t)}catch(o){throw Ke.allocateSyncronError(o,i.mCurrentZone)}finally{i.mCurrentZone=n}return r}removeErrorListener(e){return this.mErrorListener.delete(e),this}removeInteractionListener(e,t){if(!t)return this.mInteractionListener.delete(e),this;let n=this.mInteractionListener.get(e);return n?(n.delete(t),this):this}callErrorListener(e){return this.execute(()=>{for(let[n,r]of this.mErrorListener.entries())if(r.execute(()=>n.call(this,e))===!1)return!0;return!1})?!0:this.mIsolated?!1:this.parent.callErrorListener(e)}callInteractionListener(e){if(((this.mTriggerMapping.get(e.type)??-1)&e.trigger)===0)return!1;let n=this.mInteractionListener.get(e.type);return n&&n.size>0&&this.execute(()=>{for(let[r,o]of n.entries())o.execute(()=>{r.call(this,e)})}),this.mIsolated?!0:this.parent.callInteractionListener(e)}}});var qt=p(()=>{xr();kr()});var se,kt=p(()=>{L();se=class i{static mComponents=new WeakMap;static mConstructorSelector=new WeakMap;static mElements=new WeakMap;static ofComponent(e){let t=e.processorConstructor,n=i.mConstructorSelector.get(t);if(!n)throw new g(`Constructor "${t.name}" is not a registered custom element`,t);let r=i.mElements.get(e);if(!r)throw new g(`Component "${e}" is not a registered component`,e);let o;return e.isProcessorCreated&&(o=e.processor),{selector:n,constructor:t,element:r,component:e}}static ofConstructor(e){let t=i.mConstructorSelector.get(e);if(!t)throw new g(`Constructor "${e.name}" is not a registered custom element`,e);let n=globalThis.customElements.get(t);if(!n)throw new g(`Constructor "${e.name}" is not a registered custom element`,e);return{selector:t,constructor:e,elementConstructor:n}}static ofElement(e){let t=i.mComponents.get(e);if(!t)throw new g(`Element "${e}" is not a PwbComponent.`,e);return i.ofComponent(t)}static ofProcessor(e){let t=i.mComponents.get(e);if(!t)throw new g("Processor is not a PwbComponent.",e);return i.ofComponent(t)}static registerComponent(e,t,n){i.mComponents.has(t)||i.mComponents.set(t,e),n&&!i.mComponents.has(n)&&i.mComponents.set(n,e),i.mElements.has(e)||i.mElements.set(e,t)}static registerConstructor(e,t){e&&!i.mConstructorSelector.has(e)&&i.mConstructorSelector.set(e,t)}}});var Nt=p(()=>{});var Fe,Fn=p(()=>{Nt();Fe=class i{static DEFAULT=(()=>{let e=new i;return e.mSpashscreenConfiguration.background="blue",e.mSpashscreenConfiguration.content="",e.mSpashscreenConfiguration.manual=!1,e.mSpashscreenConfiguration.animationTime=1e3,e.mErrorConfiguration.ignore=!1,e.mErrorConfiguration.print=!0,e.mLoggingConfiguration.filter=7,e.mLoggingConfiguration.updatePerformance=!1,e.mLoggingConfiguration.updaterTrigger=!1,e.mLoggingConfiguration.updateReshedule=!1,e.mUpdatingConfiguration.frameTime=100,e.mUpdatingConfiguration.stackCap=10,e})();mErrorConfiguration;mLoggingConfiguration;mSpashscreenConfiguration;mUpdatingConfiguration;get error(){return this.mErrorConfiguration}get logging(){return this.mLoggingConfiguration}get splashscreen(){return this.mSpashscreenConfiguration}get updating(){return this.mUpdatingConfiguration}constructor(){this.mSpashscreenConfiguration={background:i.DEFAULT?.mSpashscreenConfiguration.background,content:i.DEFAULT?.mSpashscreenConfiguration.content,manual:i.DEFAULT?.mSpashscreenConfiguration.manual,animationTime:i.DEFAULT?.mSpashscreenConfiguration.animationTime},this.mErrorConfiguration={ignore:i.DEFAULT?.mErrorConfiguration.ignore,print:i.DEFAULT?.mErrorConfiguration.print},this.mLoggingConfiguration={filter:i.DEFAULT?.mLoggingConfiguration.filter,updatePerformance:i.DEFAULT?.mLoggingConfiguration.updatePerformance,updaterTrigger:i.DEFAULT?.mLoggingConfiguration.updaterTrigger,updateReshedule:i.DEFAULT?.mLoggingConfiguration.updateReshedule},this.mUpdatingConfiguration={frameTime:i.DEFAULT?.mUpdatingConfiguration.frameTime,stackCap:i.DEFAULT?.mUpdatingConfiguration.stackCap}}print(e,...t){(e&this.mLoggingConfiguration.filter)!==0&&console.log(...t)}}});var it,Ei=p(()=>{qt();kt();Fn();it=class i{static CONFIGURATION_ATTACHMENT=Symbol("PwbApplicationConfigurationAttachment");static new(e,t,n){let r=new Fe,o=new i(e,r);t(o),n&&o.appendTo(n)}mConfiguration;mElement;mInteractionZone;get configuration(){return this.mConfiguration}constructor(e,t){this.mInteractionZone=z.current.create(`App-${e}`,{isolate:!0}),this.mInteractionZone.attachment(i.CONFIGURATION_ATTACHMENT,t),this.mConfiguration=t,this.mElement=document.createElement("div"),this.mElement.attachShadow({mode:"open"})}addContent(e){let t=se.ofConstructor(e).elementConstructor;return this.mInteractionZone.execute(()=>{let n=se.ofElement(new t);return this.mElement.shadowRoot.appendChild(n.element),n.component.processor})}addErrorListener(e){this.mInteractionZone.addErrorListener(e)}addStyle(e){let t=document.createElement("style");t.textContent=e,this.mElement.shadowRoot.prepend(t)}appendTo(e){e.appendChild(this.mElement)}}});var At,Nr=p(()=>{L();At=class{mCustomMetadata;constructor(){this.mCustomMetadata=new N}getMetadata(e){return this.mCustomMetadata.get(e)??null}setMetadata(e,t){this.mCustomMetadata.set(e,t)}}});var Jt,Ar=p(()=>{Nr();Jt=class extends At{}});var Qt,Dr=p(()=>{L();Nr();Ar();Qt=class i extends At{static mPrivateMetadataKey=Symbol("Metadata");mDecoratorMetadataObject;mPropertyMetadata;constructor(e){super(),this.mDecoratorMetadataObject=e,this.mPropertyMetadata=new N,e[i.mPrivateMetadataKey]=this}getInheritedMetadata(e){let t=new Array,n=this.mDecoratorMetadataObject;do{if(Object.hasOwn(n,i.mPrivateMetadataKey)){let o=n[i.mPrivateMetadataKey].getMetadata(e);o!==null&&t.push(o)}n=Object.getPrototypeOf(n)}while(n!==null);return t.reverse()}getProperty(e){return this.mPropertyMetadata.has(e)||this.mPropertyMetadata.add(e,new Jt),this.mPropertyMetadata.get(e)}}});var ae,Sr=p(()=>{L();Dr();Symbol.metadata??=Symbol("Symbol.metadata");ae=class i{static mMetadataMapping=new N;static add(e,t){return(n,r)=>{let o=i.forInternalDecorator(r.metadata);switch(r.kind){case"class":o.setMetadata(e,t);return;case"method":case"field":case"getter":case"setter":case"accessor":if(r.static)throw new Error("@Metadata.add not supported for statics.");o.getProperty(r.name).setMetadata(e,t);return}}}static forInternalDecorator(e){return i.mapMetadata(e)}static get(e){Object.hasOwn(e,Symbol.metadata)||i.polyfillMissingMetadata(e);let t=e[Symbol.metadata];return i.mapMetadata(t)}static init(){return(e,t)=>{i.forInternalDecorator(t.metadata)}}static mapMetadata(e){if(i.mMetadataMapping.has(e))return i.mMetadataMapping.get(e);let t=new Qt(e);return i.mMetadataMapping.set(e,t),t}static polyfillMissingMetadata(e){let t=new Array,n=e;do t.push(n),n=Object.getPrototypeOf(n);while(n!==null);for(let r=t.length-1;r>=0;r--){let o=t[r];if(!Object.hasOwn(o,Symbol.metadata)){let s=null;r<t.length-2&&(s=t[r+1][Symbol.metadata]),o[Symbol.metadata]=Object.create(s,{})}}}}});var v,ki=p(()=>{L();Sr();v=class i{static mCurrentInjectionContext=null;static mInjectMode=new N;static mInjectableConstructor=new N;static mInjectableReplacement=new N;static mInjectionConstructorIdentificationMetadataKey=Symbol("InjectionConstructorIdentification");static mSingletonMapping=new N;static createObject(e,t,n){let[r,o]=typeof t=="object"&&t!==null?[!1,t]:[!!t,n??new N],s=i.getInjectionIdentification(e);if(!i.mInjectableConstructor.has(s))throw new g(`Constructor "${e.name}" is not registered for injection and can not be built`,i);let a=r?"instanced":i.mInjectMode.get(s),l=new N(o.map((m,y)=>[i.getInjectionIdentification(m),y])),c=i.mCurrentInjectionContext,h=new N([...c?.localInjections.entries()??[],...l.entries()]);i.mCurrentInjectionContext={injectionMode:a,localInjections:h};try{if(!r&&a==="singleton"&&i.mSingletonMapping.has(s))return i.mSingletonMapping.get(s);let m=new e;return a==="singleton"&&!i.mSingletonMapping.has(s)&&i.mSingletonMapping.add(s,m),m}finally{i.mCurrentInjectionContext=c}}static injectable(e="instanced"){return(t,n)=>{i.registerInjectable(t,n.metadata,e)}}static registerInjectable(e,t,n){let r=i.getInjectionIdentification(e,t);i.mInjectableConstructor.add(r,e),i.mInjectMode.add(r,n)}static replaceInjectable(e,t){let n=i.getInjectionIdentification(e);if(!i.mInjectableConstructor.has(n))throw new g("Original constructor is not registered.",i);let r=i.getInjectionIdentification(t);if(!i.mInjectableConstructor.has(r))throw new g("Replacement constructor is not registered.",i);i.mInjectableReplacement.set(n,t)}static use(e){if(i.mCurrentInjectionContext===null)throw new g("Can't create object outside of an injection context.",i);let t=i.getInjectionIdentification(e);if(i.mCurrentInjectionContext.injectionMode!=="singleton"&&i.mCurrentInjectionContext.localInjections.has(t))return i.mCurrentInjectionContext.localInjections.get(t);let n=i.mInjectableReplacement.get(t);if(n||(n=i.mInjectableConstructor.get(t)),!n)throw new g(`Constructor "${e.name}" is not registered for injection and can not be built`,i);return i.createObject(n)}static getInjectionIdentification(e,t){let n=t?ae.forInternalDecorator(t):ae.get(e),r=n.getMetadata(i.mInjectionConstructorIdentificationMetadataKey);return r||(r=Symbol(e.name),n.setMetadata(i.mInjectionConstructorIdentificationMetadataKey,r)),r}}});var W=p(()=>{ki();Sr();Dr();Ar()});var Lr=p(()=>{});var Se=p(()=>{});var $,re=p(()=>{$=(a=>(a[a.None=0]="None",a[a.PropertySet=4]="PropertySet",a[a.PropertyDelete=8]="PropertyDelete",a[a.UntrackableFunctionCall=16]="UntrackableFunctionCall",a[a.Manual=32]="Manual",a[a.InputChange=64]="InputChange",a[a.Any=127]="Any",a))($||{})});var he,Dt=p(()=>{qt();re();he=class i{static IGNORED_CLASSES=(()=>{let e=new WeakSet;return e.add(i),e.add(z),e.add(De),e})();static ORIGINAL_TO_INTERACTION_MAPPING=new WeakMap;static PROXY_TO_ORIGINAL_MAPPING=new WeakMap;static UNTRACEABLE_FUNCTION_UPDATE_TRIGGER=(()=>{let e=new WeakMap;return e.set(Array.prototype.fill,4),e.set(Array.prototype.pop,8),e.set(Array.prototype.push,4),e.set(Array.prototype.shift,8),e.set(Array.prototype.unshift,4),e.set(Array.prototype.splice,4),e.set(Array.prototype.reverse,4),e.set(Array.prototype.sort,4),e.set(Array.prototype.concat,4),e.set(Map.prototype.clear,8),e.set(Map.prototype.delete,8),e.set(Map.prototype.set,4),e.set(Set.prototype.clear,8),e.set(Set.prototype.delete,8),e.set(Set.prototype.add,4),e})();static createCoreEntityCreationData(e,t){return{source:e,property:t,toString:function(){let n=typeof this.source;return"constructor"in this.source&&(n=this.source.constructor.name),this.property?`[ ${n} => ${this.property.toString()} ]`:`[ ${n} ]`}}}static getOriginal(e){return i.PROXY_TO_ORIGINAL_MAPPING.get(e)??e}static ignoreClass(e){i.IGNORED_CLASSES.add(e)}static getWrapper(e){let t=i.getOriginal(e);return i.ORIGINAL_TO_INTERACTION_MAPPING.get(t)}mListenerZones;mProxyObject;get proxy(){return this.mProxyObject}constructor(e){let t=i.getWrapper(e);if(t)return t;this.mListenerZones=new Set,i.IGNORED_CLASSES.has(Object.getPrototypeOf(e)?.constructor)?this.mProxyObject=e:this.mProxyObject=this.createProxyObject(e),i.PROXY_TO_ORIGINAL_MAPPING.set(this.mProxyObject,e),i.ORIGINAL_TO_INTERACTION_MAPPING.set(e,this)}addListenerZone(e){this.mListenerZones.has(e)||this.mListenerZones.add(e)}convertToProxy(e){if(e===null||typeof e!="object"&&typeof e!="function")return e;let t=new i(e);for(let n of this.mListenerZones)t.addListenerZone(n);return t.proxy}createProxyObject(e){let t=(r,o,s)=>{let a=i.getOriginal(o);try{let l=r.call(a,...s);return this.convertToProxy(l)}finally{i.UNTRACEABLE_FUNCTION_UPDATE_TRIGGER.has(r)?this.dispatch(i.UNTRACEABLE_FUNCTION_UPDATE_TRIGGER.get(r),o):this.dispatch(16,this.mProxyObject)}};return new Proxy(e,{apply:(r,o,s)=>{this.addListenerZone(z.current);let a=r;try{let l=a.call(o,...s);return this.convertToProxy(l)}catch(l){if(!(l instanceof TypeError))throw l;return t(a,o,s)}},set:(r,o,s)=>{this.addListenerZone(z.current);try{let a=s;return(a!==null&&typeof a=="object"||typeof a=="function")&&(a=i.getOriginal(a)),Reflect.set(r,o,a)}finally{this.dispatch(4,this.mProxyObject,o)}},get:(r,o,s)=>{this.addListenerZone(z.current);let a=Reflect.get(r,o);return this.convertToProxy(a)},deleteProperty:(r,o)=>{this.addListenerZone(z.current);try{return delete r[o]}finally{this.dispatch(8,this.mProxyObject,o)}}})}dispatch(e,t,n){if(z.pushInteraction($,e,i.createCoreEntityCreationData(t,n)))for(let o of this.mListenerZones)o.execute(()=>{z.pushInteraction($,e,i.createCoreEntityCreationData(t,n))})}}});var I,le=p(()=>{Dt();I=class i{static mEnableTrackingOnConstruction=!1;static enableTrackingOnConstruction(e){let t=i.mEnableTrackingOnConstruction;i.mEnableTrackingOnConstruction=!0;try{return e()}finally{i.mEnableTrackingOnConstruction=t}}constructor(){if(i.mEnableTrackingOnConstruction)return new he(this).proxy}}});function Ni(){return i=>{he.ignoreClass(i)}}var Ai=p(()=>{Dt()});var Xe,Di=p(()=>{Xe=class i{static mCurrentUpdateCycle=null;static openResheduledCycle(e,t){let n=!1;if(!i.mCurrentUpdateCycle){let r=performance.now();i.mCurrentUpdateCycle={initiator:e.initiator,timeStamp:r,startTime:r,forcedSync:e.forcedSync,runner:e.runner},n=!0}try{return t(i.mCurrentUpdateCycle)}finally{n&&(i.mCurrentUpdateCycle=null)}}static openUpdateCycle(e,t){let n=!1;if(!i.mCurrentUpdateCycle){let r=performance.now();i.mCurrentUpdateCycle={initiator:e.updater,timeStamp:r,startTime:r,forcedSync:e.runSync,runner:{id:Symbol("Runner "+r),timestamp:r}},n=!0}try{return t(i.mCurrentUpdateCycle)}finally{n&&(i.mCurrentUpdateCycle=null)}}static updateCycleRunId(e,t){if(e.initiator===t){let n=performance.now(),r=e;r.runner={id:Symbol("Runner "+n),timestamp:n}}}static updateCyleStartTime(e){let t=performance.now(),n=e;n.startTime=t}}});var Gn,Si=p(()=>{Gn=class extends Error{mChain;get chain(){return this.mChain}constructor(e,t){let n=t.slice(-20).map(r=>r.toString()).join(`
`);super(`${e}: 
${n}`),this.mChain=[...t]}}});var St,Li=p(()=>{St=class extends Error{constructor(){super("Update resheduled")}}});var Mi,Mr,st,Ri=p(()=>{L();qt();Nt();re();Dt();Ai();Di();Si();Li();Mi=[Ni()];st=class{mApplicationContext;mInteractionZone;mLoggingType;mRegisteredObjects;mUpdateFunction;mUpdateRunCache;mUpdateStates;get zone(){return this.mInteractionZone}constructor(e){this.mUpdateRunCache=new WeakMap,this.mRegisteredObjects=new WeakMap,this.mUpdateFunction=e.onUpdate,this.mApplicationContext=e.applicationContext,this.mLoggingType=e.loggingType;let t=e.parent?.mInteractionZone??z.current,n=Math.floor(Math.random()*16777215).toString(16);this.mInteractionZone=t.create(`${e.label}-ProcessorZone (${n})`,{isolate:e.isolate}).addTriggerRestriction($,e.trigger),this.mUpdateStates={chainCompleteHooks:new Ie,async:{hasSheduledTask:!1,hasRunningTask:!1,sheduledTaskIsResheduled:!1},sync:{running:!1},cycle:{chainedTask:null}}}addUpdateTrigger(e){this.mInteractionZone.addInteractionListener($,t=>{(e&e)!==0&&this.runUpdateAsynchron(t,null)})}deconstruct(){this.mInteractionZone.removeInteractionListener($)}registerObject(e){if(this.mRegisteredObjects.has(e))return this.mRegisteredObjects.get(e).proxy;if(e instanceof EventTarget)for(let n of["input","change"])this.mInteractionZone.execute(()=>{e.addEventListener(n,()=>{z.pushInteraction($,64,he.createCoreEntityCreationData(e,n))})});let t=new he(e);return this.mRegisteredObjects.set(e,t),this.mRegisteredObjects.set(t.proxy,t),t.proxy}async resolveAfterUpdate(){return this.mUpdateStates.async.hasSheduledTask?new Promise((e,t)=>{this.mUpdateStates.chainCompleteHooks.push((n,r)=>{r?t(r):e(n)})}):!1}switchToUpdateZone(e){return this.mInteractionZone.execute(e)}update(){let e=new De($,32,this.mInteractionZone,he.createCoreEntityCreationData(this,Symbol("Manual Update")));return this.runUpdateSynchron(e)}updateAsync(){let e=new De($,32,this.mInteractionZone,he.createCoreEntityCreationData(this,Symbol("Manual Update")));this.runUpdateAsynchron(e,null)}executeTaskChain(e,t,n,r){if(r.size>this.mApplicationContext.updating.stackCap)throw new Gn("Call loop detected",r.toArray());let o=performance.now();if(!t.forcedSync&&o-t.startTime>this.mApplicationContext.updating.frameTime)throw new St;r.push(e);let s=this.mInteractionZone.execute(()=>this.mUpdateFunction.call(this,e))||n;if(this.mApplicationContext.logging.updatePerformance){let l=performance.now();this.mApplicationContext.print(this.mLoggingType,"Update performance:",this.mInteractionZone.name,`
	`,"Cycle:",l-t.timeStamp,"ms",`
	`,"Runner:",l-t.runner.timestamp,"ms",`
	`,"  ","Id:",t.runner.id.toString(),`
	`,"Update:",l-o,"ms",`
	`,"  ","State:",s,`
	`,"  ","Chain: ",r.toArray().map(c=>c.toString()))}if(Xe.updateCycleRunId(t,this),!this.mUpdateStates.cycle.chainedTask)return s;let a=this.mUpdateStates.cycle.chainedTask;return this.mUpdateStates.cycle.chainedTask=null,this.executeTaskChain(a,t,s,r)}releaseUpdateChainCompleteHooks(e,t){if(!this.mUpdateStates.chainCompleteHooks.top)return;let n;for(;n=this.mUpdateStates.chainCompleteHooks.pop();)n(e,t)}runUpdateAsynchron(e,t){if(this.mUpdateStates.async.hasRunningTask||this.mUpdateStates.async.sheduledTaskIsResheduled){this.mUpdateStates.cycle.chainedTask=e;return}if(this.mUpdateStates.async.hasSheduledTask)return;let n=r=>{this.mUpdateStates.async.hasRunningTask=!0,this.mUpdateStates.async.hasSheduledTask=!1,this.mUpdateStates.async.sheduledTaskIsResheduled=!1;let o=!1;try{this.runUpdateSynchron(e)}catch(s){s instanceof St&&r.initiator===this&&(this.mApplicationContext.logging.updateReshedule&&this.mApplicationContext.print(this.mLoggingType,"Reshedule:",this.mInteractionZone.name,`
	`,"Cycle Performance",performance.now()-r.timeStamp,`
	`,"Runner Id:",r.runner.id.toString()),o=!0)}finally{this.mUpdateStates.async.hasRunningTask=!1}o&&this.runUpdateAsynchron(e,r)};this.mUpdateStates.async.hasSheduledTask=!0,t&&(this.mUpdateStates.async.sheduledTaskIsResheduled=!0),globalThis.requestAnimationFrame(()=>{t?Xe.openResheduledCycle(t,n):Xe.openUpdateCycle({updater:this,reason:e,runSync:!1},n)})}runUpdateSynchron(e){if(this.mApplicationContext.logging.updaterTrigger&&this.mApplicationContext.print(this.mLoggingType,"Update trigger:",this.mInteractionZone.name,`
	`,"Trigger:",e.toString(),`
	`,"Chained:",this.mUpdateStates.sync.running,`
	`,"Omitted:",!!this.mUpdateStates.cycle.chainedTask),this.mUpdateStates.sync.running)return this.mUpdateStates.cycle.chainedTask=e,!1;this.mUpdateStates.sync.running=!0;try{let t=Xe.openUpdateCycle({updater:this,reason:e,runSync:!0},n=>{if(this.mUpdateRunCache.has(n.runner))return Xe.updateCyleStartTime(n),this.mUpdateRunCache.get(n.runner);let r=this.executeTaskChain(e,n,!1,new Ie);return this.mUpdateRunCache.set(n.runner,r),r});return this.releaseUpdateChainCompleteHooks(t),t}catch(t){if(t instanceof St)throw t;let n=t;if(t&&this.mApplicationContext.error.print&&this.mApplicationContext.print(7,t),this.mApplicationContext.error.ignore&&(this.mApplicationContext.print(this.mLoggingType,t),n=null),this.releaseUpdateChainCompleteHooks(!1,n),n)throw t;return!1}finally{this.mUpdateStates.sync.running=!1}}};Mr=E(null),st=d(Mr,0,"CoreEntityUpdater",Mi,st),u(Mr,1,st)});var Ge,Bn=p(()=>{L();W();Dt();le();Ri();Ge=class{mApplicationContext;mHooks;mInjections;mIsLocked;mIsSetup;mProcessor;mProcessorConstructor;mTrackChanges;mUpdater;get applicationContext(){return this.mApplicationContext}get isProcessorCreated(){return!!this.mProcessor}get processor(){if(!this.mIsSetup)throw new g("Processor can not be build before calling setup.",this);return this.isProcessorCreated||(this.mProcessor=this.createProcessor()),this.mProcessor}get processorConstructor(){return this.mProcessorConstructor}constructor(e){if(!(e.constructor.prototype instanceof I))throw new g(`Constructor "${e.constructor.name}" does not extend`,this);if(this.mApplicationContext=e.applicationContext,this.mProcessorConstructor=e.constructor,this.mProcessor=null,this.mIsLocked=!1,this.mIsSetup=!1,this.mTrackChanges=e.trackConstructorChanges,this.mInjections=new N,this.mHooks={create:new Ie,setup:new Ie},e.parent)for(let[t,n]of e.parent.mInjections.entries())this.setProcessorAttributes(t,n);this.mUpdater=new st({applicationContext:e.applicationContext,label:e.constructor.name,loggingType:e.loggingType,isolate:!!e.isolate,trigger:e.trigger,parent:e.parent?.mUpdater,onUpdate:()=>this.mIsSetup?this.onUpdate():!1})}call(e,t,...n){if(!this.isProcessorCreated&&!t)return null;let r=Reflect.get(this.processor,e);return typeof r!="function"?null:this.mUpdater.switchToUpdateZone(()=>r.apply(this.processor,n))}deconstruct(){this.mUpdater.deconstruct()}getProcessorAttribute(e){return this.mInjections.get(e)}registerObject(e){return this.mUpdater.registerObject(e)}setProcessorAttributes(e,t){if(this.mIsLocked)throw new g("Cant add injections to after construction.",this);this.mInjections.set(e,t)}setup(){if(this.mIsSetup)throw new g("Setup allready called.",this);this.mIsSetup=!0;let e;for(;e=this.mHooks.setup.pop();)e.apply(this);return this}update(){return this.mUpdater.update()}updateAsync(){this.mUpdater.updateAsync()}async waitForUpdate(){return this.mUpdater.resolveAfterUpdate()}addCreationHook(e){return this.mHooks.create.push(e),this}addSetupHook(e){return this.mHooks.setup.push(e),this}setAutoUpdate(e){this.mUpdater.addUpdateTrigger(e)}createProcessor(){this.mIsLocked=!0;let e=this.mUpdater.switchToUpdateZone(()=>this.mTrackChanges?I.enableTrackingOnConstruction(()=>v.createObject(this.mProcessorConstructor,this.mInjections)):v.createObject(this.mProcessorConstructor,this.mInjections));e=he.getOriginal(e);let t;for(;t=this.mHooks.create.pop();){let n=t.call(this,e);n&&(e=n)}return e}}});var We,Vn=p(()=>{Nt();Bn();We=class i extends Ge{constructor(e,t,n,r){super({applicationContext:e,constructor:t,loggingType:4,parent:n,isolate:!1,trigger:r,trackConstructorChanges:!1}),this.setProcessorAttributes(i,this),this.addSetupHook(()=>{this.call("onExecute",!1)}).addSetupHook(()=>{let o=this.processor})}deconstruct(){this.call("onDeconstruct",!1),super.deconstruct()}onUpdate(){return!1}}});var Rr,ye,at=p(()=>{L();Bn();Rr=class i{static mInstance;mCoreEntityConstructor;mProcessorConstructorConfiguration;constructor(){if(i.mInstance)return i.mInstance;i.mInstance=this,this.mCoreEntityConstructor=new N,this.mProcessorConstructorConfiguration=new N}get(e){let t=this.mCoreEntityConstructor.get(e);if(!t)return new Array;let n=new Array;for(let r of t)n.push({processorConstructor:r,processorConfiguration:this.mProcessorConstructorConfiguration.get(r)});return n}register(e,t,n){this.mProcessorConstructorConfiguration.set(t,n);let r=e;do{if(!(r.prototype instanceof Ge)&&r!==Ge)break;this.mCoreEntityConstructor.has(r)||this.mCoreEntityConstructor.set(r,new Set),this.mCoreEntityConstructor.get(r).add(t)}while(r=Object.getPrototypeOf(r))}},ye=new Rr});var Lt,Or=p(()=>{Se();Vn();Bn();at();Lt=class i extends Ge{static mExtensionCache=new WeakMap;mExtensionList;constructor(e){super(e),this.mExtensionList=new Array,this.addSetupHook(()=>{this.executeExtensions()})}deconstruct(){for(let e of this.mExtensionList)e.deconstruct();super.deconstruct()}executeExtensions(){let e=(()=>{let n=i.mExtensionCache.get(this.processorConstructor);if(n)return n;let o=ye.get(We).filter(a=>{for(let l of a.processorConfiguration.targetRestrictions)if(this instanceof l||this.processorConstructor.prototype instanceof l||this.processorConstructor===l)return!0;return!1}),s={read:o.filter(a=>a.processorConfiguration.access===1),write:o.filter(a=>a.processorConfiguration.access===3),readWrite:o.filter(a=>a.processorConfiguration.access===2)};return i.mExtensionCache.set(this.processorConstructor,s),s})(),t=[...e.write,...e.readWrite,...e.read];for(let n of t){let r=new We(this.applicationContext,n.processorConstructor,this,n.processorConfiguration.trigger);r.setup(),this.mExtensionList.push(r)}}}});var lt,jn=p(()=>{L();lt=class{mExpression;mTemporaryValues;constructor(e,t,n){if(this.mTemporaryValues=new N,n.length>0)for(let r of n)this.mTemporaryValues.set(r,void 0);this.mExpression=this.createEvaluationFunktion(e,this.mTemporaryValues).bind(t.store)}execute(){return this.mExpression()}setTemporaryValue(e,t){if(!this.mTemporaryValues.has(e))throw new g(`Temporary value "${e}" does not exist for this procedure.`,this);this.mTemporaryValues.set(e,t)}createEvaluationFunktion(e,t){let n,r=`__${Math.random().toString(36).substring(2)}`;if(n="return function () {",t.size>0)for(let o of t.keys())n+=`const ${o} = ${r}.get('${o}');`;return n+=`return ${e};`,n+="};",new Function(r,n)(t)}}});var Le,en=p(()=>{jn();Le=class{mDataLevel;get data(){return this.mDataLevel}constructor(e){this.mDataLevel=e}createExpressionProcedure(e,t){return new lt(e,this.data,t??[])}setTemporaryValue(e,t){this.data.setTemporaryValue(e,t)}}});var Ce,ct=p(()=>{L();Mt();Ce=class{mComponent;mDataProxy;mParentLevel;mTemporaryValues;get store(){return this.mDataProxy}constructor(e){this.mTemporaryValues=new N,e instanceof xe?(this.mParentLevel=null,this.mComponent=e):(this.mParentLevel=e,this.mComponent=e.mComponent),this.mDataProxy=this.createAccessProxy()}setTemporaryValue(e,t){this.mTemporaryValues.set(e,t)}updateLevelData(e){if(e.mParentLevel!==this.mParentLevel)throw new g("Can't update InstructionLevelData for a deeper level than it target data.",this);this.mTemporaryValues=e.mTemporaryValues}createAccessProxy(){return new Proxy(new Object,{get:(e,t)=>this.getValue(t),set:(e,t,n)=>(this.hasTemporaryValue(t)&&this.setTemporaryValue(t,n),t in this.mComponent.processor?(this.mComponent.processor[t]=n,!0):(this.setTemporaryValue(t,n),!0)),deleteProperty:()=>{throw new g("Deleting properties is not allowed",this)},ownKeys:()=>[...new Set([...Object.keys(this.mComponent.processor),...this.getTemporaryValuesList()])]})}getTemporaryValuesList(){let e=this.mTemporaryValues.map(t=>t);return this.mParentLevel&&e.push(...this.mParentLevel.getTemporaryValuesList()),e}getValue(e){if(this.mTemporaryValues.has(e))return this.mTemporaryValues.get(e);if(this.mParentLevel)return this.mParentLevel.getValue(e);if(e in this.mComponent.processor)return this.mComponent.processor[e]}hasTemporaryValue(e){return this.mTemporaryValues.has(e)?!0:this.mParentLevel?this.mParentLevel.hasTemporaryValue(e):!1}}});var Me,tn=p(()=>{Me=class{mParent;get parent(){return this.mParent}set parent(e){this.mParent=e}get template(){return this.parent?.template??null}constructor(){this.mParent=null}}});var ut,Un=p(()=>{L();tn();ut=class i extends Me{mChildList;mInstruction;mInstructionType;get childList(){return _.newListWith(...this.mChildList)}get instruction(){return this.mInstruction}set instruction(e){this.mInstruction=e}get instructionType(){return this.mInstructionType}set instructionType(e){this.mInstructionType=e}constructor(){super(),this.mChildList=Array(),this.mInstruction="",this.mInstructionType=""}appendChild(...e){for(let t of e)t.parent=this;this.mChildList.push(...e)}clone(){let e=new i;e.instruction=this.instruction,e.instructionType=this.instructionType;for(let t of this.mChildList)e.appendChild(t.clone());return e}equals(e){if(!(e instanceof i)||e.instruction!==this.instruction||e.instructionType!==this.instructionType||e.childList.length!==this.childList.length)return!1;for(let t=0;t<e.childList.length;t++)if(!e.childList[t].equals(this.childList[t]))return!1;return!0}removeChild(e){let t=this.mChildList.indexOf(e),n;return t!==-1&&(n=this.mChildList.splice(t,1)[0],n.parent=null),n}}});var Rt,Fr=p(()=>{L();Rt=class{mNode;get node(){if(!this.mNode)throw new g("Template value is not attached to any template node.",this);return this.mNode}set node(e){this.mNode=e}constructor(){this.mNode=null}}});var Ae,nn=p(()=>{Fr();Ae=class i extends Rt{mExpression;get value(){return this.mExpression}set value(e){this.mExpression=e}constructor(){super(),this.mExpression=""}clone(){let e=new i;return e.value=this.value,e}equals(e){return e instanceof i&&e.value===this.value}toString(){return`{{ ${this.mExpression} }}`}}});var Be,rn=p(()=>{tn();nn();Be=class i extends Me{mContainsExpression;mTextValue;mValues;get containsExpression(){return this.mContainsExpression}get values(){return this.mValues}constructor(){super(),this.mTextValue="",this.mContainsExpression=!1,this.mValues=[]}addValue(...e){for(let t of e)t instanceof Ae&&(t.node=this,this.mContainsExpression=!0),this.mValues.push(t),this.mTextValue+=t.toString()}clone(){let e=new i;for(let t of this.values){let n=typeof t=="string"?t:t.clone();e.addValue(n)}return e}equals(e){if(!(e instanceof i)||e.values.length!==this.values.length)return!1;for(let t=0;t<this.values.length;t++){let n=this.values[t],r=e.values[t];if(n!==r&&(typeof n!=typeof r||typeof n=="string"&&n!==r||!r.equals(n)))return!1}return!0}toString(){return this.mTextValue}}});var on,Gr=p(()=>{rn();Fr();on=class i extends Rt{mName;mValue;get name(){return this.mName}set name(e){this.mName=e}get values(){return this.mValue}constructor(){super(),this.mName="",this.mValue=new Be}clone(){let e=new i;e.name=this.name;for(let t of this.values.values){let n=typeof t=="string"?t:t.clone();e.values.addValue(n)}return e}equals(e){return!(!(e instanceof i)||e.name!==this.name||!e.values.equals(this.values))}}});var Ve,sn=p(()=>{L();tn();Gr();Ve=class i extends Me{mAttributeDictionary;mChildList;mTagName;get attributes(){return _.newListWith(...this.mAttributeDictionary.values())}get childList(){return _.newListWith(...this.mChildList)}get tagName(){return this.mTagName}set tagName(e){this.mTagName=e}constructor(){super(),this.mAttributeDictionary=new N,this.mChildList=Array(),this.mTagName=""}appendChild(...e){for(let t of e)t.parent=this;this.mChildList.push(...e)}clone(){let e=new i;e.tagName=this.tagName;for(let t of this.attributes){let n=e.setAttribute(t.name);for(let r of t.values.values){let o=typeof r=="string"?r:r.clone();n.addValue(o)}}for(let t of this.mChildList)e.appendChild(t.clone());return e}equals(e){if(!(e instanceof i)||e.tagName!==this.tagName||e.attributes.length!==this.attributes.length||e.childList.length!==this.childList.length)return!1;for(let t of e.mAttributeDictionary.values()){let n=this.mAttributeDictionary.get(t.name);if(!n||!n.equals(t))return!1}for(let t=0;t<e.childList.length;t++)if(!e.childList[t].equals(this.childList[t]))return!1;return!0}getAttribute(e){return this.mAttributeDictionary.get(e)?.values??null}removeAttribute(e){return this.mAttributeDictionary.has(e)?(this.mAttributeDictionary.delete(e),!0):!1}removeChild(e){let t=this.mChildList.indexOf(e),n;return t!==-1&&(n=this.mChildList.splice(t,1)[0],n.parent=null),n}setAttribute(e){let t=this.mAttributeDictionary.get(e);return t||(t=new on,t.name=e,t.node=this,this.mAttributeDictionary.set(e,t)),t.values}}});var ge,pt=p(()=>{L();tn();ge=class i extends Me{mBodyElementList;get body(){return this.mBodyElementList.clone()}get template(){return this}constructor(){super(),this.mBodyElementList=new _}appendChild(...e){this.mBodyElementList.push(...e);for(let t of e)t.parent=this}clone(){let e=new i;for(let t of this.mBodyElementList)e.appendChild(t.clone());return e}equals(e){if(!(e instanceof i)||e.body.length!==this.body.length)return!1;for(let t=0;t<this.body.length;t++)if(!this.body[t].equals(e.body[t]))return!1;return!0}removeChild(e){let t=this.mBodyElementList.indexOf(e),n;return t!==-1&&(n=this.mBodyElementList.splice(t,1)[0],n.parent=null),n}}});var ce,zn=p(()=>{ce=class{mApplicationContext;mComponentValues;mContent;mTemplate;get anchor(){return this.mContent.contentAnchor}get applicationContext(){return this.mApplicationContext}get boundary(){return this.mContent.getBoundary()}get template(){return this.mTemplate}get values(){return this.mComponentValues}get content(){return this.mContent}constructor(e,t,n,r){this.mApplicationContext=e,this.mTemplate=t,this.mTemplate.parent=null,this.mComponentValues=n,this.mContent=r,r.setCoreBuilder(this)}deconstruct(){this.content.deconstruct()}update(){let e=this.onUpdate(),t=!1,n=this.content.builders;if(n.length>0)for(let r=0;r<n.length;r++)t=n[r].update()||t;return e||t}createZoneEnabledElement(e){let t=e.tagName;if(typeof t!="string")throw t;if(t.includes("-")){let r=globalThis.customElements.get(t);if(typeof r<"u")return new r}let n=e.getAttribute("xmlns");return n&&!n.containsExpression?document.createElementNS(n.values[0],t):document.createElement(t)}createZoneEnabledText(e){return document.createTextNode(e)}}});var Ot,Br=p(()=>{L();zn();Ot=class{mChildBuilderList;mChildComponents;mContentAnchor;mContentBoundary;mLinkedContent;mModules;mRootChildList;get body(){return this.mRootChildList}get builders(){return this.mChildBuilderList}get contentAnchor(){return this.mContentAnchor}get modules(){return this.mModules}constructor(e,t){this.mModules=e,this.mChildBuilderList=new _,this.mRootChildList=new _,this.mChildComponents=new N,this.mLinkedContent=new WeakSet,this.mContentAnchor=document.createComment(t),this.mContentBoundary={start:this.mContentAnchor,end:this.mContentAnchor}}deconstruct(){this.onDeconstruct();let e;for(;e=this.mChildBuilderList.pop();)e.deconstruct();for(let n of this.mChildComponents.values())n.deconstruct();this.mChildComponents.clear();let t;for(;t=this.mRootChildList.pop();)t instanceof ce||t.remove();this.contentAnchor.remove()}getBoundary(){let e=this.mContentBoundary.start,t;return this.mContentBoundary.end instanceof ce?t=this.mContentBoundary.end.boundary.end:t=this.mContentBoundary.end,{start:e,end:t}}hasContent(e){return this.mLinkedContent.has(e)}insert(e,t,n){if(!this.hasContent(n))throw new g("Can't add content to builder. Target is not part of builder.",this);let r=e instanceof ce?e.anchor:e;switch(t){case"After":{this.insertAfter(r,n);break}case"TopOf":{this.insertTop(r,n);break}case"BottomOf":{this.insertBottom(r,n);break}}this.mLinkedContent.add(e),e instanceof ce&&this.mChildBuilderList.push(e);let o=r.parentElement??r.getRootNode(),s=this.mContentAnchor.parentElement??this.mContentAnchor.getRootNode();if(o===s){let a;switch(t){case"After":{a=this.mRootChildList.indexOf(n)+1;break}case"TopOf":{a=0;break}case"BottomOf":{a=this.mRootChildList.length;break}}a===this.mRootChildList.length&&(this.mContentBoundary.end=e),this.mRootChildList.splice(a+1,0,e)}}remove(e){if(!this.mLinkedContent.has(e))throw new g("Child node cant be deleted from builder when it not a child of them",this);if(this.mLinkedContent.delete(e),e instanceof ce)this.mChildBuilderList.remove(e),e.deconstruct();else{let t=this.mChildComponents.get(e);t&&(t.deconstruct(),this.mChildComponents.delete(e)),e.remove()}this.mRootChildList.remove(e)&&(this.mContentBoundary.end=this.mRootChildList.at(-1)??this.mContentAnchor)}setCoreBuilder(e){this.mLinkedContent.add(e)}insertAfter(e,t){let n;t instanceof ce?n=t.boundary.end:n=t,(n.parentElement??n.getRootNode()).insertBefore(e,n.nextSibling)}insertBottom(e,t){if(t instanceof ce){this.insertAfter(e,t);return}if(t instanceof Element){t.appendChild(e);return}throw new g("Source node does not support child nodes.",this)}insertTop(e,t){if(t instanceof ce){this.insertAfter(e,t.anchor);return}if(t instanceof Element){t.prepend(e);return}throw new g("Source node does not support child nodes.",this)}}});var $n,Oi=p(()=>{L();Br();$n=class extends Ot{mAttributeModulesChangedOrder;mLinkedAttributeElement;mLinkedAttributeExpressionModules;mLinkedAttributeModuleList;mLinkedAttributeNodes;mLinkedExpressionModuleList;get linkedAttributeModules(){return this.mAttributeModulesChangedOrder&&(this.mAttributeModulesChangedOrder=!1,this.orderAttributeModules()),this.mLinkedAttributeModuleList}get linkedExpressionModules(){return this.mLinkedExpressionModuleList}constructor(e,t){super(e,t),this.mLinkedExpressionModuleList=new Array,this.mLinkedAttributeModuleList=new Array,this.mLinkedAttributeExpressionModules=new WeakMap,this.mLinkedAttributeNodes=new WeakMap,this.mLinkedAttributeElement=new WeakMap,this.mAttributeModulesChangedOrder=!1}attributeOfLinkedExpressionModule(e){return this.mLinkedAttributeExpressionModules.get(e)}getLinkedAttributeData(e){let t=this.mLinkedAttributeNodes.get(e),n=this.mLinkedAttributeElement.get(e);if(!t||!n)throw new g("Attribute has no linked data.",this);return{values:t,node:n}}linkAttributeExpression(e,t){this.mLinkedAttributeExpressionModules.set(e,t)}linkAttributeModule(e){this.mLinkedAttributeModuleList.push(e),this.mAttributeModulesChangedOrder=!0}linkAttributeNodes(e,t,n){this.mLinkedAttributeNodes.set(e,n),this.mLinkedAttributeElement.set(e,t)}linkExpressionModule(e){this.mLinkedExpressionModuleList.push(e)}onDeconstruct(){for(let e of this.mLinkedAttributeModuleList)e.deconstruct();for(let e of this.mLinkedExpressionModuleList)e.deconstruct()}orderAttributeModules(){this.mLinkedAttributeModuleList.sort((e,t)=>e.accessMode-t.accessMode)}}});var Hn,Fi=p(()=>{Br();Hn=class extends Ot{mInstructionModule;get instructionModule(){return this.mInstructionModule}set instructionModule(e){this.mInstructionModule=e}constructor(e,t){super(e,t),this.mInstructionModule=null}onDeconstruct(){this.mInstructionModule.deconstruct()}}});var Kn,Gi=p(()=>{L();zn();Fi();Vr();Kn=class extends ce{constructor(e,t,n,r){super(e,t,r,new Hn(n,`Instruction - {$${t.instructionType}}`))}onUpdate(){if(!this.content.instructionModule){let t=this.content.modules.createInstructionModule(this.applicationContext,this.template,this.values);this.content.instructionModule=t}if(this.content.instructionModule.update()){let t=this.content.body;this.updateStaticBuilder(t,this.content.instructionModule.instructionResult.elementList)}return!1}insertNewContent(e,t){let n=new Ft(this.applicationContext,e.template,this.content.modules,e.dataLevel,`Child - {$${this.template.instructionType}}`);return t===null?this.content.insert(n,"TopOf",this):this.content.insert(n,"After",t),n}updateStaticBuilder(e,t){let r=new _t((a,l)=>l.template.equals(a.template)).differencesOf(e,t),o=0,s=null;for(let a=0;a<r.length;a++){let l=r[a];if(l.changeState===1)this.content.remove(l.item);else if(l.changeState===2)s=this.insertNewContent(l.item,s),o++;else{let c=t[o].dataLevel;l.item.values.updateLevelData(c),s=l.item,o++}}}}});var Ft,Vr=p(()=>{ct();Un();rn();sn();pt();nn();zn();Oi();Gi();Ft=class extends ce{mInitialized;constructor(e,t,n,r,o){super(e,t,r,new $n(n,`Static - {${o}}`)),this.mInitialized=!1}onUpdate(){this.mInitialized||(this.mInitialized=!0,this.buildTemplate([this.template],this));let e=!1,t=this.content.linkedAttributeModules;for(let o=0;o<t.length;o++)e=t[o].update()||e;let n=!1,r=this.content.linkedExpressionModules;for(let o=0;o<r.length;o++){let s=r[o];if(s.update()){n=!0;let a=this.content.attributeOfLinkedExpressionModule(s);if(!a)continue;let l=this.content.getLinkedAttributeData(a),c=l.values.reduce((h,m)=>h+m.data,"");l.node.setAttribute(a.name,c)}}return e||n}buildInstructionTemplate(e,t){let n=new Kn(this.applicationContext,e,this.content.modules,new Ce(this.values));this.content.insert(n,"BottomOf",t)}buildStaticTemplate(e,t){let n=this.createZoneEnabledElement(e);this.content.insert(n,"BottomOf",t);for(let r of e.attributes){let o=this.content.modules.createAttributeModule(this.applicationContext,r,n,this.values);if(o){this.content.linkAttributeModule(o);continue}if(r.values.containsExpression){let s=new Array;for(let a of r.values.values){let l=this.createZoneEnabledText("");if(s.push(l),!(a instanceof Ae)){l.data=a;continue}let c=this.content.modules.createExpressionModule(this.applicationContext,a,l,this.values);this.content.linkExpressionModule(c),this.content.linkAttributeExpression(c,r)}this.content.linkAttributeNodes(r,n,s);continue}n.setAttribute(r.name,r.values.toString())}this.content.insert(n,"BottomOf",t),this.buildTemplate(e.childList,n)}buildTemplate(e,t){for(let n of e)n instanceof ge?this.buildTemplate(n.body,t):n instanceof Be?this.buildTextTemplate(n,t):n instanceof ut?this.buildInstructionTemplate(n,t):n instanceof Ve&&this.buildStaticTemplate(n,t)}buildTextTemplate(e,t){for(let n of e.values){if(typeof n=="string"){this.content.insert(this.createZoneEnabledText(n),"BottomOf",t);continue}let r=this.createZoneEnabledText("");this.content.insert(r,"BottomOf",t);let o=this.content.modules.createExpressionModule(this.applicationContext,n,r,this.values);this.content.linkExpressionModule(o)}}}});var an,jr=p(()=>{an=class{mHtmlElement;mShadowRoot;get htmlElement(){return this.mHtmlElement}get shadowRoot(){return this.mShadowRoot}constructor(e){this.mHtmlElement=e,this.mShadowRoot=this.mHtmlElement.attachShadow({mode:"open"})}}});var K,we=p(()=>{jn();K=class{mDataLevel;get data(){return this.mDataLevel}constructor(e){this.mDataLevel=e}createExpressionProcedure(e,t){return new lt(e,this.data,t??[])}}});var Ye,Xn=p(()=>{Nt();Or();we();Ye=class extends Lt{constructor(e){super({applicationContext:e.applicationContext,constructor:e.constructor,loggingType:2,parent:e.parent,isolate:!1,trigger:e.trigger,trackConstructorChanges:!1}),this.setProcessorAttributes(K,new K(e.values)),this.addSetupHook(()=>{let t=this.processor})}deconstruct(){super.deconstruct(),this.call("onDeconstruct",!1)}}});var J,_e=p(()=>{J=class{mValue;get value(){return this.mValue}constructor(e){this.mValue=e}}});var ee,je=p(()=>{L();ee=class{constructor(){throw new g("Reference should not be instanced.",this)}}});var Pe,dt=p(()=>{L();Pe=class{constructor(){throw new g("Reference should not be instanced.",this)}}});var qe,Wn=p(()=>{Xn();_e();je();dt();qe=class i extends Ye{mLastResult;mTargetTextNode;constructor(e){super({applicationContext:e.applicationContext,constructor:e.constructor,parent:e.parent,trigger:e.trigger,values:e.values}),this.mTargetTextNode=e.targetNode,this.mLastResult=null,this.setProcessorAttributes(i,this),this.setProcessorAttributes(Pe,e.targetTemplate.clone()),this.setProcessorAttributes(ee,e.targetNode),this.setProcessorAttributes(J,new J(e.targetTemplate.value))}onUpdate(){let e=this.call("onUpdate",!0);e===null&&(e="");let t=this.mLastResult===null||this.mLastResult!==e;if(t){let n=this.mTargetTextNode;n.data=e,this.mLastResult=e}return t}}});function Ur(i){return(e,t)=>{v.registerInjectable(e,t.metadata,"instanced"),ye.register(qe,e,{trigger:i.trigger})}}var zr=p(()=>{W();at();Wn()});var Bi,$r,eu,mt,Vi=p(()=>{W();le();we();re();zr();_e();Bi=[Ur({trigger:111})];mt=class extends(eu=I){mProcedure;constructor(e=v.use(K),t=v.use(J)){super(),this.mProcedure=e.createExpressionProcedure(t.value)}onUpdate(){let e=this.mProcedure.execute();return typeof e>"u"?null:e?.toString()}};$r=E(eu),mt=d($r,0,"MustacheExpressionModule",Bi,mt),u($r,1,mt)});var fe,ht=p(()=>{fe=class{mName;mValue;get name(){return this.mName}get value(){return this.mValue}constructor(e,t){this.mName=e,this.mValue=t}}});var ue,yt=p(()=>{Xn();ht();je();dt();ue=class i extends Ye{mAccessMode;get accessMode(){return this.mAccessMode}constructor(e){super({applicationContext:e.applicationContext,constructor:e.constructor,parent:e.parent,trigger:e.trigger,values:e.values}),this.mAccessMode=e.accessMode,this.setProcessorAttributes(i,this),this.setProcessorAttributes(Pe,e.targetTemplate.clone()),this.setProcessorAttributes(ee,e.targetNode),this.setProcessorAttributes(fe,new fe(e.targetTemplate.name,e.targetTemplate.values.toString()))}onUpdate(){return this.call("onUpdate",!0)??!1}}});var be,gt=p(()=>{L();be=class{mElementList;get elementList(){return _.newListWith(...this.mElementList)}constructor(){this.mElementList=new Array}addElement(e,t){if(this.mElementList.findIndex(r=>r.template===e||r.dataLevel===t)===-1)this.mElementList.push({template:e,dataLevel:t});else throw new g("Can't add same template or values for multiple Elements.",this)}}});var Je,Zn=p(()=>{Xn();_e();dt();gt();Je=class i extends Ye{mLastResult;get instructionResult(){return this.mLastResult}constructor(e){super({applicationContext:e.applicationContext,constructor:e.constructor,parent:e.parent,trigger:e.trigger,values:e.values}),this.setProcessorAttributes(i,this),this.setProcessorAttributes(Pe,e.targetTemplate.clone()),this.setProcessorAttributes(J,new J(e.targetTemplate.instruction)),this.mLastResult=new be}onUpdate(){let e=this.call("onUpdate",!0);return e instanceof be?(this.mLastResult=e,!0):!1}}});var Yn,ji=p(()=>{L();Vi();at();yt();Wn();Zn();Yn=class i{static mAttributeModuleCache=new N;static mExpressionModuleCache=new WeakMap;static mInstructionModuleCache=new N;mComponent;mExpressionModule;constructor(e,t){this.mExpressionModule=t??mt,this.mComponent=e}createAttributeModule(e,t,n,r){let o=(()=>{let s=i.mAttributeModuleCache.get(t.name);if(s||s===null)return s;for(let a of ye.get(ue))if(a.processorConfiguration.selector.test(t.name))return i.mAttributeModuleCache.set(t.name,a),a;return i.mAttributeModuleCache.set(t.name,null),null})();return o===null?null:new ue({applicationContext:e,accessMode:o.processorConfiguration.access,constructor:o.processorConstructor,parent:this.mComponent,targetNode:n,targetTemplate:t,values:r,trigger:o.processorConfiguration.trigger}).setup()}createExpressionModule(e,t,n,r){let o=(()=>{let s=i.mExpressionModuleCache.get(this.mExpressionModule);if(s)return s;let a=ye.get(qe).find(l=>l.processorConstructor===this.mExpressionModule);if(!a)throw new g("An expression module could not be found.",this);return i.mExpressionModuleCache.set(this.mExpressionModule,a),a})();return new qe({applicationContext:e,constructor:o.processorConstructor,parent:this.mComponent,targetNode:n,targetTemplate:t,values:r,trigger:o.processorConfiguration.trigger}).setup()}createInstructionModule(e,t,n){let r=(()=>{let o=i.mInstructionModuleCache.get(t.instructionType);if(o)return o;for(let s of ye.get(Je))if(s.processorConfiguration.instructionType===t.instructionType)return i.mInstructionModuleCache.set(t.instructionType,s),s;throw new g(`Instruction module type "${t.instructionType}" not found.`,this)})();return new Je({applicationContext:e,constructor:r.processorConstructor,parent:this.mComponent,targetTemplate:t,values:n,trigger:r.processorConfiguration.trigger}).setup()}}});var ft,_n=p(()=>{L();ft=class extends g{mColumnEnd;mColumnStart;mLineEnd;mLineStart;get columnEnd(){return this.mColumnEnd}get columnStart(){return this.mColumnStart}get lineEnd(){return this.mLineEnd}get lineStart(){return this.mLineStart}constructor(e,t,n,r,o,s,a){super(e,t,a),this.mColumnStart=n,this.mLineStart=r,this.mColumnEnd=o,this.mLineEnd=s}}});var Gt,Hr=p(()=>{L();Gt=class{mDependencyFetch;mDependencyFetchResolved;mLexer;mMeta;mPattern;mPatternDependencies;mType;get dependencies(){return this.mPatternDependencies}get dependenciesResolved(){return this.mDependencyFetchResolved}get lexer(){return this.mLexer}get meta(){return this.mMeta}get pattern(){return this.mPattern}constructor(e,t){if(this.mLexer=e,this.mType=t.type,this.mMeta=t.metadata,this.mPatternDependencies=new Array,this.mDependencyFetch=t.dependencyFetch??null,this.mDependencyFetchResolved=!t.dependencyFetch,this.mType==="split"&&!this.mDependencyFetch)throw new g("Split token with a start and end token, need inner token definitions.",this);if(this.mType==="single"&&this.mDependencyFetch)throw new g("Pattern does not allow inner token pattern.",this);this.mPattern=this.convertTokenPattern(this.mType,t.pattern)}isSplit(){return this.mType==="split"}resolveDependencies(){this.mDependencyFetchResolved||(this.mDependencyFetch(this),this.mDependencyFetchResolved=!0)}useChildPattern(e){if(this.mLexer!==e.lexer)throw new g("Can only add dependencies of the same lexer.",this);this.mPatternDependencies.push(e)}convertTokenPattern(e,t){if("single"in t){if(e==="split")throw new g("Can't use split pattern type with single pattern definition.",this);return{start:{regex:t.single.regex,types:t.single.types,validator:t.single.validator??null}}}else{if(e==="single")throw new g("Can't use single pattern type with split pattern definition.",this);return{start:{regex:t.start.regex,types:t.start.types,validator:t.start.validator??null},end:{regex:t.end.regex,types:t.end.types,validator:t.end.validator??null},innerType:t.innerType??null}}}}});var Bt,Kr=p(()=>{Bt=class{mColumnNumber;mLineNumber;mMetas;mType;mValue;get columnNumber(){return this.mColumnNumber}get lineNumber(){return this.mLineNumber}get metas(){return[...this.mMetas]}get type(){return this.mType}get value(){return this.mValue}constructor(e,t,n,r){this.mValue=t,this.mColumnNumber=n,this.mLineNumber=r,this.mType=e,this.mMetas=new Set}addMeta(...e){for(let t of e)this.mMetas.add(t)}hasMeta(e){return this.mMetas.has(e)}}});var ln,Ui=p(()=>{L();_n();Hr();Kr();ln=class{mRootPattern;mSettings;get errorType(){return this.mSettings.errorType}set errorType(e){this.mSettings.errorType=e}get trimWhitespace(){return this.mSettings.trimSpaces}set trimWhitespace(e){this.mSettings.trimSpaces=e}get validWhitespaces(){return[...this.mSettings.whiteSpaces].join("")}set validWhitespaces(e){this.mSettings.whiteSpaces=new Set(e.split(""))}constructor(){this.mSettings={errorType:null,trimSpaces:!0,whiteSpaces:new Set},this.mRootPattern=new Gt(this,{type:"single",pattern:{single:{regex:/^/,types:{},validator:null}},metadata:[],dependencyFetch:null})}createTokenPattern(e,t){let n=a=>typeof a=="string"?{token:a}:a,r=a=>{let l=new Set(a.flags.split(""));return new RegExp(`^(?<token>${a.source})`,[...l].join(""))},o=new Array;e.meta&&(typeof e.meta=="string"?o.push(e.meta):o.push(...e.meta));let s;return"regex"in e.pattern?s={single:{regex:r(e.pattern.regex),types:n(e.pattern.type),validator:e.pattern.validator??null}}:s={start:{regex:r(e.pattern.start.regex),types:n(e.pattern.start.type),validator:e.pattern.start.validator??null},end:{regex:r(e.pattern.end.regex),types:n(e.pattern.end.type),validator:e.pattern.end.validator??null},innerType:e.pattern.innerType??null},new Gt(this,{type:"regex"in e.pattern?"single":"split",pattern:s,metadata:o,dependencyFetch:t??null})}*tokenize(e,t){let n={data:e,cursor:{position:0,column:1,line:1},error:null,progressTracker:t??null};yield*this.tokenizeRecursionLayer(n,this.mRootPattern,new Array,null)}useRootTokenPattern(e){if(e.lexer!==this)throw new g("Token pattern must be created by this lexer.",this);this.mRootPattern.useChildPattern(e)}findNextStartToken(e,t,n,r){for(let o of t){let s=o.pattern.start,a=this.matchToken(o,s,e,n,r);if(a!==null)return{pattern:o,token:a}}return null}findTokenTypeOfMatch(e,t,n){for(let s in e.groups){let a=e.groups[s],l=t[s];if(!(!a||!l)){if(a.length!==e[0].length)throw new g("A group of a token pattern must match the whole token.",this);return l}}let r=new Array;for(let s in e.groups)e.groups[s]&&r.push(s);let o=new Array;for(let s in t)o.push(s);throw new g(`No token type found for any defined pattern regex group. Full: "${e[0]}", Matches: "${r.join(", ")}", Available: "${o.join(", ")}", Regex: "${n.source}"`,this)}*generateErrorToken(e,t){if(!e.error||!this.mSettings.errorType)return;let n=new Bt(this.mSettings.errorType,e.error.data,e.error.startColumn,e.error.startLine);n.addMeta(...t),e.error=null,yield n}generateToken(e,t,n,r,o,s){let a=n[0],l=this.findTokenTypeOfMatch(n,r,s),c=new Bt(o??l,a,e.cursor.column,e.cursor.line);return c.addMeta(...t),c}matchToken(e,t,n,r,o){let s=t.regex;s.lastIndex=0;let a=s.exec(n.data);if(!a||a.index!==0)return null;let l=this.generateToken(n,[...r,...e.meta],a,t.types,o,s);if(t.validator){let c=n.data.substring(l.value.length);if(!t.validator(l,c,n.cursor.position))return null}return this.moveCursor(n,l.value),l}moveCursor(e,t){let n=t.split(`
`);n.length>1&&(e.cursor.column=1),e.cursor.line+=n.length-1,e.cursor.column+=n.at(-1).length,e.cursor.position+=t.length,e.data=e.data.substring(t.length),this.trackProgress(e)}pushNextCharToErrorState(e){if(!this.mSettings.errorType)throw new ft(`Unable to parse next token. No valid pattern found for "${e.data.substring(0,20)}".`,this,e.cursor.column,e.cursor.line,e.cursor.column,e.cursor.line);e.error||(e.error={data:"",startColumn:e.cursor.column,startLine:e.cursor.line});let t=e.data.charAt(0);e.error.data+=t,this.moveCursor(e,t)}skipNextWhitespace(e){let t=e.data.charAt(0);return!this.mSettings.trimSpaces||!this.mSettings.whiteSpaces.has(t)?!1:(this.moveCursor(e,t),!0)}*tokenizeRecursionLayer(e,t,n,r){let o=t.dependencies;for(;e.data.length>0;){if(!e.error&&this.skipNextWhitespace(e))continue;if(t.isSplit()){let l=this.matchToken(t,t.pattern.end,e,n,r);if(l!==null){yield*this.generateErrorToken(e,n),yield l;return}}let s=this.findNextStartToken(e,o,n,r);if(!s){this.pushNextCharToErrorState(e);continue}yield*this.generateErrorToken(e,n),yield s.token;let a=s.pattern;a.isSplit()&&(a.resolveDependencies(),yield*this.tokenizeRecursionLayer(e,a,[...n,...a.meta],r??a.pattern.innerType))}yield*this.generateErrorToken(e,n)}trackProgress(e){e.progressTracker!==null&&e.progressTracker(e.cursor.position,e.cursor.line,e.cursor.column)}}});var Z,Xr=p(()=>{Z=class extends Error{static PARSER_ERROR=Symbol("PARSER_ERROR");mTrace;get columnEnd(){return this.mTrace.top.range.columnEnd}get columnStart(){return this.mTrace.top.range.columnStart}get graph(){return this.mTrace.top.graph}get incidents(){return this.mTrace.incidents}get lineEnd(){return this.mTrace.top.range.lineEnd}get lineStart(){return this.mTrace.top.range.lineStart}constructor(e){super(e.top.message,{cause:e.top.cause}),this.mTrace=e}}});var qn,zi=p(()=>{L();qn=class{mIncidents;mTop;get incidents(){if(this.mIncidents===null)throw new g("A complete incident list is only available on debug mode.",this);return this.mIncidents}get top(){return this.mTop}constructor(e){this.mTop={message:"Unknown parser error",priority:0,graph:null,range:{lineStart:1,columnStart:1,lineEnd:1,columnEnd:1},cause:null},e?this.mIncidents=new Array:this.mIncidents=null}push(e,t,n,r,o,s,a=!1,l=null){let c;if(a?c=this.mTop.priority+1:c=o*1e4+s,this.mIncidents!==null){let h={message:e,priority:c,graph:t,range:{lineStart:n,columnStart:r,lineEnd:o,columnEnd:s},cause:l};this.mIncidents.push(h)}this.mTop&&c<this.mTop.priority||this.setTop({message:e,priority:c,graph:t,range:{lineStart:n,columnStart:r,lineEnd:o,columnEnd:s},cause:l})}setTop(e){this.mTop=e}}});var Jn,$i=p(()=>{L();zi();Jn=class i{static MAX_JUNCTION_CIRCULAR_REFERENCES=1e3;mGraphStack;mIncidentTrace;mLastTokenPosition;mProcessStack;mTokenCache;mTokenGenerator;mTrimTokenCache;get currentGraph(){return this.mGraphStack.top.graph}get currentToken(){let e=this.mGraphStack.top;return this.mTokenCache[e.token.cursor]}get incidentTrace(){return this.mIncidentTrace}get processStack(){return this.mProcessStack}constructor(e,t,n){this.mTokenGenerator=e,this.mGraphStack=new Ie,this.mLastTokenPosition={column:1,line:1},this.mTokenCache=new Array,this.mProcessStack=new Ie,this.mTrimTokenCache=n,this.mIncidentTrace=new qn(t),this.mGraphStack.push({graph:null,linear:!0,circularGraphs:new N,token:{start:0,cursor:-1}})}collapse(){let e=this.mGraphStack.top,t=this.mTokenCache.slice(e.token.cursor);t.length!==0&&t.at(-1)===null&&t.pop();for(let n of this.mTokenGenerator)t.push(n);return t}getGraphBoundingToken(){let e=this.mGraphStack.top,t=this.mTokenCache[e.token.start],n=this.mTokenCache[e.token.cursor-1];return t??=n,n??=t,[t??null,n??null]}getGraphPosition(){let e=this.mGraphStack.top,t,n;if(t=this.mTokenCache[e.token.start],n=this.mTokenCache[e.token.cursor-1],t??=n,n??=t,!t||!n)return{graph:e.graph,columnEnd:this.mLastTokenPosition.column,columnStart:this.mLastTokenPosition.column,lineEnd:this.mLastTokenPosition.line,lineStart:this.mLastTokenPosition.line};let r,o;if(n.value.includes(`
`)){let s=n.value.split(`
`);o=n.lineNumber+s.length-1,r=1+s[s.length-1].length}else r=n.columnNumber+n.value.length,o=n.lineNumber;return{graph:e.graph,lineStart:t.lineNumber,columnStart:t.columnNumber,lineEnd:o,columnEnd:r}}getTokenPosition(){let e=this.mGraphStack.top,t=this.currentToken;if(!t)return{graph:e.graph,columnEnd:this.mLastTokenPosition.column,columnStart:this.mLastTokenPosition.column,lineEnd:this.mLastTokenPosition.line,lineStart:this.mLastTokenPosition.line};let n,r;if(t.value.includes(`
`)){let o=t.value.split(`
`);r=t.lineNumber+o.length-1,n=1+o[o.length-1].length}else n=t.columnNumber+t.value.length,r=t.lineNumber;return{graph:e.graph,lineStart:t.lineNumber,columnStart:t.columnNumber,lineEnd:r,columnEnd:n}}graphIsCircular(e){let t=this.mGraphStack.top;if(!t.circularGraphs.has(e))return!1;if(e.isJunction){if(t.circularGraphs.get(e)>i.MAX_JUNCTION_CIRCULAR_REFERENCES)throw new g("Junction graph called circular too often.",this);return!1}return!0}moveNextToken(){let e=this.mGraphStack.top;if(e.circularGraphs.size>0&&(e.circularGraphs=new N),e.graph&&e.graph.isJunction)throw new g("Junction graph must not have own nodes.",this);if(e.token.cursor++,e.token.cursor<this.mTokenCache.length)return;let t=this.mTokenGenerator.next();if(t.done){this.mTokenCache.push(null);return}this.mLastTokenPosition.column=t.value.columnNumber,this.mLastTokenPosition.line=t.value.lineNumber,this.mTokenCache.push(t.value)}popGraphStack(e){let t=this.mGraphStack.pop(),n=this.mGraphStack.top;if(e&&(t.token.cursor=t.token.start),t.token.cursor!==t.token.start&&n.circularGraphs.size>0&&(n.circularGraphs=new N),!this.mTrimTokenCache){n.token.cursor=t.token.cursor;return}t.linear?(this.mTokenCache.splice(0,t.token.cursor),n.token.start=0,n.token.cursor=0):n.token.cursor=t.token.cursor}pushGraphStack(e,t){let n=this.mGraphStack.top,r={graph:e,linear:t&&n.linear,circularGraphs:new N(n.circularGraphs),token:{start:n.token.cursor,cursor:n.token.cursor}},o=r.circularGraphs.get(e)??0;r.circularGraphs.set(e,o+1),this.mGraphStack.push(r)}}});var cn,Hi=p(()=>{L();_n();Xr();$i();cn=class i{static NODE_NULL_RESULT=Symbol("FAILED_NODE_VALUE_PARSE");static NODE_VALUE_LIST_END_MEET=Symbol("FAILED_NODE_VALUE_PARSE");mConfiguration;mLexer;mRootPart;get lexer(){return this.mLexer}constructor(e,t){this.mLexer=e,this.mRootPart=null,this.mConfiguration={keepTraceIncidents:!1,trimTokenCache:!1,...t}}parse(e,t){if(this.mRootPart===null)throw new g("Parser has not root part set.",this);let n=new Jn(this.mLexer.tokenize(e,t),this.mConfiguration.keepTraceIncidents,this.mConfiguration.trimTokenCache),r=(()=>{try{return this.beginParseProcess(n,this.mRootPart)}catch(s){if(s instanceof ft)return n.incidentTrace.push(s.message,n.currentGraph,s.lineStart,s.columnStart,s.lineEnd,s.columnEnd,!0,s),Z.PARSER_ERROR;let a=s instanceof Error?s.message:s.toString(),l=n.getGraphPosition();return n.incidentTrace.push(a,n.currentGraph,l.lineStart,l.columnStart,l.lineEnd,l.columnEnd,!0,s),Z.PARSER_ERROR}})();if(r===Z.PARSER_ERROR)throw new Z(n.incidentTrace);let o=n.collapse();if(o.length!==0){let s=o[0];if(n.incidentTrace.top.range.lineEnd===1&&n.incidentTrace.top.range.columnEnd===1){let a=`Tokens could not be parsed. Graph end meet without reaching last token. Current: "${s.value}" (${s.type})`;n.incidentTrace.push(a,this.mRootPart,s.lineNumber,s.columnNumber,s.lineNumber,s.columnNumber)}throw new Z(n.incidentTrace)}return r}setRootGraph(e){this.mRootPart=e}beginParseProcess(e,t){e.moveNextToken(),e.processStack.push({type:"graph-parse",parameter:{graph:t,linear:!0},state:0});let n=i.NODE_NULL_RESULT;for(;e.processStack.top;)n=this.processStack(e,e.processStack.top,n);return n}processChainedNodeParseProcess(e,t,n){switch(t.state){case 0:{let s=t.parameter.node.connections.next;return s===null?(e.processStack.pop(),{}):(t.state++,e.processStack.push({type:"node-parse",parameter:{node:s},state:0,values:{}}),i.NODE_NULL_RESULT)}case 1:{let r=n;return r===Z.PARSER_ERROR?(e.processStack.pop(),Z.PARSER_ERROR):(e.processStack.pop(),r)}}throw new g(`Invalid node next parse state "${t.state}".`,this)}processGraphParseProcess(e,t,n){let r=t.parameter.graph;switch(t.state){case 0:{if(e.graphIsCircular(r)){let s=e.getGraphPosition();return e.incidentTrace.push("Circular graph detected.",r,s.lineStart,s.columnStart,s.lineEnd,s.columnEnd),e.processStack.pop(),Z.PARSER_ERROR}let o=t.parameter.linear;return e.pushGraphStack(r,o),t.state++,e.processStack.push({type:"node-parse",parameter:{node:r.node},state:0,values:{}}),i.NODE_NULL_RESULT}case 1:{let o=n;if(o===Z.PARSER_ERROR)return e.popGraphStack(!0),e.processStack.pop(),Z.PARSER_ERROR;let s=r.convert(o,e);if(typeof s=="symbol"){let a=e.getGraphPosition();return e.incidentTrace.push(s.description??"Unknown data convert error",a.graph,a.lineStart,a.columnStart,a.lineEnd,a.columnEnd),e.popGraphStack(!0),e.processStack.pop(),Z.PARSER_ERROR}return e.popGraphStack(!1),e.processStack.pop(),s}}throw new g(`Invalid graph parse state "${t.state}".`,this)}processNodeParseProcess(e,t,n){let r=t.parameter.node;switch(t.state){case 0:return e.processStack.push({type:"node-value-parse",parameter:{node:r,valueIndex:0},state:0,values:{}}),t.state++,i.NODE_NULL_RESULT;case 1:{let o=n;return o===Z.PARSER_ERROR?(e.processStack.pop(),Z.PARSER_ERROR):(t.values.nodeValueResult=o,e.processStack.push({type:"node-next-parse",parameter:{node:r},state:0}),t.state++,i.NODE_NULL_RESULT)}case 2:{let o=n;if(o===Z.PARSER_ERROR)return e.processStack.pop(),Z.PARSER_ERROR;let s=r.mergeData(t.values.nodeValueResult,o);return e.processStack.pop(),s}}throw new g(`Invalid node parse state "${t.state}".`,this)}processNodeValueParseProcess(e,t,n){let r=t.parameter.node;switch(t.state){case 0:{if(n!==i.NODE_NULL_RESULT&&n!==Z.PARSER_ERROR)return t.values.parseResult=n,t.state++,i.NODE_NULL_RESULT;let o=t.parameter.valueIndex,s=r.connections;if(o>=s.values.length)return t.values.parseResult=i.NODE_VALUE_LIST_END_MEET,t.state++,i.NODE_NULL_RESULT;t.parameter.valueIndex++;let a=e.currentToken,l=s.values[o];if(typeof l=="string"){if(!a){if(s.required){let c=e.getTokenPosition();e.incidentTrace.push(`Unexpected end of statement. Token "${l}" expected.`,e.currentGraph,c.lineStart,c.columnStart,c.lineEnd,c.columnEnd)}return i.NODE_NULL_RESULT}if(l!==a.type){if(s.required){let c=e.getTokenPosition();e.incidentTrace.push(`Unexpected token "${a.value}". "${l}" expected`,e.currentGraph,c.lineStart,c.columnStart,c.lineEnd,c.columnEnd)}return i.NODE_NULL_RESULT}return e.moveNextToken(),a.value}else{let c=s.values.length===1||s.values.length===o+1;return e.processStack.push({type:"graph-parse",parameter:{graph:l,linear:c},state:0}),i.NODE_NULL_RESULT}}case 1:{let o=t.values.parseResult,s=r.connections;if(o===i.NODE_VALUE_LIST_END_MEET&&!s.required){e.processStack.pop();return}return o===i.NODE_VALUE_LIST_END_MEET?(e.processStack.pop(),Z.PARSER_ERROR):(e.processStack.pop(),o)}}throw new g(`Invalid node value parse state "${t.state}".`,this)}processStack(e,t,n){switch(t.type){case"graph-parse":return this.processGraphParseProcess(e,t,n);case"node-parse":return this.processNodeParseProcess(e,t,n);case"node-value-parse":return this.processNodeValueParseProcess(e,t,n);case"node-next-parse":return this.processChainedNodeParseProcess(e,t,n)}}}});var q,Wr=p(()=>{q=class i{static define(e,t=!1){return new i(e,t)}mDataConverterList;mGraphCollector;mIsJunction;mResolvedGraphNode;get isJunction(){return this.mIsJunction}get node(){return this.mResolvedGraphNode||(this.mResolvedGraphNode=this.mGraphCollector().root),this.mResolvedGraphNode}constructor(e,t){this.mGraphCollector=e,this.mDataConverterList=new Array,this.mResolvedGraphNode=null,this.mIsJunction=t}convert(e,t){if(this.mDataConverterList.length===0)return e;let n=t.getGraphBoundingToken(),r=n[0]??void 0,o=n[1]??void 0;if(this.mDataConverterList.length===1)return this.mDataConverterList[0](e,r,o);let s=e;for(let a of this.mDataConverterList)if(s=a(s,r,o),typeof s=="symbol")return s;return s}converter(e){let t=new i(this.mGraphCollector,this.isJunction);return t.mDataConverterList.push(...this.mDataConverterList,e),t}}});var V,Ki=p(()=>{L();Wr();V=class i{static new(){let e=new i("",!1,[]);return e.mRootNode=null,e}mConnections;mIdentifier;mRootNode;get configuration(){return{dataKey:this.mIdentifier.dataKey,isList:this.mIdentifier.type==="list",isRequired:this.mConnections.required,isBranch:this.mConnections.values.length>1}}get connections(){return this.mConnections}get root(){if(!this.mRootNode)throw new g("Staring nodes must be chained with another node to be used.",this);return this.mRootNode}constructor(e,t,n,r){if(e==="")this.mIdentifier={type:"empty",dataKey:"",mergeKey:""};else if(e.endsWith("[]"))this.mIdentifier={type:"list",mergeKey:"",dataKey:e.substring(0,e.length-2)};else if(e.includes("<-")){let s=e.split("<-");this.mIdentifier={type:"merge",dataKey:s[0],mergeKey:s[1]}}else this.mIdentifier={type:"single",mergeKey:"",dataKey:e};let o=n.map(s=>s instanceof i?q.define(()=>s):s);this.mConnections={required:t,values:o,next:null},r?this.mRootNode=r:this.mRootNode=this}mergeData(e,t){if(this.mIdentifier.type==="empty")return t;let n=t,r=typeof e>"u";if(this.mIdentifier.type==="single"){if(this.mIdentifier.dataKey in t)throw new g(`Graph path has a duplicate value identifier "${this.mIdentifier.dataKey}"`,this);return r||(n[this.mIdentifier.dataKey]=e),t}if(this.mIdentifier.type==="list"){let a;r?a=new Array:Array.isArray(e)?a=e:a=[e];let l=(()=>{if(this.mIdentifier.dataKey in t){let c=n[this.mIdentifier.dataKey];return Array.isArray(c)?(c.unshift(...a),c):(a.push(c),a)}return a})();return n[this.mIdentifier.dataKey]=l,t}if(r)return t;let o=(()=>{if(!this.mIdentifier.mergeKey)throw new g("Cant merge data without a merge key.",this);if(typeof e!="object"||e===null)throw new g("Node data must be an object when merge key is set.",this);if(!(this.mIdentifier.mergeKey in e))throw new g(`Node data does not contain merge key "${this.mIdentifier.mergeKey}"`,this);return e[this.mIdentifier.mergeKey]})();if(typeof o>"u")return t;let s=n[this.mIdentifier.dataKey];if(typeof s>"u")return n[this.mIdentifier.dataKey]=o,n;if(!Array.isArray(s))throw new g("Chain data merge value is not an array but should be.",this);return Array.isArray(o)?s.unshift(...o):s.unshift(o),t}optional(e,t){let n=typeof t>"u"?"":e,r=typeof t>"u"?e:t,o=new Array;Array.isArray(r)?o.push(...r):o.push(r);let s=new i(n,!1,o,this.mRootNode);return this.setChainedNode(s),s}required(e,t){let n=typeof t>"u"?"":e,r=typeof t>"u"?e:t,o=new Array;Array.isArray(r)?o.push(...r):o.push(r);let s=new i(n,!0,o,this.mRootNode);return this.setChainedNode(s),s}setChainedNode(e){if(this.mConnections.next!==null)throw new g("Node can only be chained to a single node.",this);this.mConnections.next=e}}});var Xi=p(()=>{_n();Hr();Kr();Ui();Xr();Hi();Ki();Wr()});var un,Zr=p(()=>{L();Xi();Un();rn();sn();pt();nn();un=class{mParser;constructor(){this.mParser=null}parse(e){if(!this.mParser){let t=this.createLexer();this.mParser=this.createParser(t)}return this.mParser.parse(e)}createLexer(){let e=new ln;e.validWhitespaces=` 
\r`,e.trimWhitespace=!0;let t=e.createTokenPattern({pattern:{regex:/(?:(?!}}).)*/,type:"ExpressionValue"}}),n=e.createTokenPattern({pattern:{start:{regex:/{{/,type:"ExpressionStart"},end:{regex:/}}/,type:"ExpressionEnd"}}},T=>{T.useChildPattern(t)}),r=e.createTokenPattern({pattern:{regex:/[^>\s\n="/]+/,type:"Identifier"}}),o=e.createTokenPattern({pattern:{regex:/(?:(?!{{|"|<).)+/,type:"XmlValue"}}),s=e.createTokenPattern({pattern:{regex:/<!--.*?-->/,type:"XmlComment"}}),a=e.createTokenPattern({pattern:{regex:/=/,type:"XmlAssignment"}}),l=e.createTokenPattern({pattern:{start:{regex:/"/,type:"XmlExplicitValueIdentifier"},end:{regex:/"/,type:"XmlExplicitValueIdentifier"}}},T=>{T.useChildPattern(n),T.useChildPattern(o)}),c=e.createTokenPattern({pattern:{start:{regex:/<\//,type:"XmlOpenClosingBracket"},end:{regex:/>/,type:"XmlCloseBracket"}}},T=>{T.useChildPattern(r)}),h=e.createTokenPattern({pattern:{start:{regex:/</,type:"XmlOpenBracket"},end:{regex:/(?<closeClosingBracket>\/>)|(?<closeBracket>>)/,type:{closeClosingBracket:"XmlCloseClosingBracket",closeBracket:"XmlCloseBracket"}}}},T=>{T.useChildPattern(a),T.useChildPattern(r),T.useChildPattern(l)}),m=e.createTokenPattern({pattern:{regex:/[^()"'`/)]+/,type:"InstructionInstructionValue"}}),y=e.createTokenPattern({pattern:{innerType:"InstructionInstructionValue",start:{regex:/\//,type:"InstructionInstructionValue"},end:{regex:/\//,type:"InstructionInstructionValue"}}},T=>{T.useChildPattern(F),T.useChildPattern(x),T.useChildPattern(b),T.useChildPattern(C),T.useChildPattern(m)}),C=e.createTokenPattern({pattern:{innerType:"InstructionInstructionValue",start:{regex:/\(/,type:"InstructionInstructionValue"},end:{regex:/\)/,type:"InstructionInstructionValue"}}},T=>{T.useChildPattern(y),T.useChildPattern(F),T.useChildPattern(x),T.useChildPattern(b),T.useChildPattern(m)}),F=e.createTokenPattern({pattern:{innerType:"InstructionInstructionValue",start:{regex:/"/,type:"InstructionInstructionValue"},end:{regex:/"/,type:"InstructionInstructionValue"}}},T=>{T.useChildPattern(y),T.useChildPattern(x),T.useChildPattern(b),T.useChildPattern(C),T.useChildPattern(m)}),x=e.createTokenPattern({pattern:{innerType:"InstructionInstructionValue",start:{regex:/'/,type:"InstructionInstructionValue"},end:{regex:/'/,type:"InstructionInstructionValue"}}},T=>{T.useChildPattern(y),T.useChildPattern(F),T.useChildPattern(b),T.useChildPattern(C),T.useChildPattern(m)}),b=e.createTokenPattern({pattern:{innerType:"InstructionInstructionValue",start:{regex:/`/,type:"InstructionInstructionValue"},end:{regex:/`/,type:"InstructionInstructionValue"}}},T=>{T.useChildPattern(y),T.useChildPattern(F),T.useChildPattern(x),T.useChildPattern(C),T.useChildPattern(m)}),w=e.createTokenPattern({pattern:{regex:/\$[^(\s\n/{]+/,type:"InstructionStart"}}),A=e.createTokenPattern({pattern:{start:{regex:/\(/,type:"InstructionInstructionOpeningBracket"},end:{regex:/\)/,type:"InstructionInstructionClosingBracket"}}},T=>{T.useChildPattern(y),T.useChildPattern(F),T.useChildPattern(x),T.useChildPattern(b),T.useChildPattern(C),T.useChildPattern(m)}),M=e.createTokenPattern({pattern:{start:{regex:/{/,type:"InstructionBodyStartBraket"},end:{regex:/}/,type:"InstructionBodyCloseBraket"}}},T=>{for(let Ln of X)T.useChildPattern(Ln)}),X=[s,c,h,l,n,w,A,M,o];for(let T of X)e.useRootTokenPattern(T);return e}createParser(e){let t=new cn(e),n=q.define(()=>V.new().required("ExpressionStart").optional("value","ExpressionValue").required("ExpressionEnd")).converter(b=>{let w=new Ae;return w.value=b.value??"",w}),r=q.define(()=>{let b=r;return V.new().required("data[]",V.new().required("value",[n,V.new().required("text","XmlValue")])).optional("data<-data",b)}),o=q.define(()=>V.new().required("name","Identifier").optional("attributeValue",V.new().required("XmlAssignment").required("XmlExplicitValueIdentifier").optional("list<-data",r).required("XmlExplicitValueIdentifier"))).converter(b=>{let w=new Array;if(b.attributeValue?.list)for(let A of b.attributeValue.list)A.value instanceof Ae?w.push(A.value):w.push(A.value.text);return{name:b.name,values:w}}),s=q.define(()=>{let b=s;return V.new().required("data[]",o).optional("data<-data",b)}),a=q.define(()=>{let b=a;return V.new().required("data[]",V.new().required("value",[n,V.new().required("text","XmlValue"),V.new().required("XmlExplicitValueIdentifier").required("text","XmlValue").required("XmlExplicitValueIdentifier")])).optional("data<-data",b)}),l=q.define(()=>V.new().required("list<-data",a)).converter(b=>{let w=new Be;for(let A of b.list)A.value instanceof Ae?w.addValue(A.value):w.addValue(A.value.text);return w}),c=q.define(()=>V.new().required("XmlComment")).converter(()=>null),h=q.define(()=>V.new().required("XmlOpenBracket").required("openingTagName","Identifier").optional("attributes<-data",s).required("closing",[V.new().required("XmlCloseClosingBracket"),V.new().required("XmlCloseBracket").required("values",F).required("XmlOpenClosingBracket").required("closingTageName","Identifier").required("XmlCloseBracket")])).converter(b=>{if("closingTageName"in b.closing&&b.openingTagName!==b.closing.closingTageName)throw new g(`Opening (${b.openingTagName}) and closing tagname (${b.closing.closingTageName}) does not match`,this);let w=new Ve;if(w.tagName=b.openingTagName,b.attributes)for(let A of b.attributes)w.setAttribute(A.name).addValue(...A.values);return"values"in b.closing&&w.appendChild(...b.closing.values),w}),m=q.define(()=>{let b=m;return V.new().required("list[]","InstructionInstructionValue").optional("list<-list",b)}),y=q.define(()=>V.new().required("instructionName","InstructionStart").optional("instruction",V.new().required("InstructionInstructionOpeningBracket").required("value<-list",m).required("InstructionInstructionClosingBracket")).optional("body",V.new().required("InstructionBodyStartBraket").required("value",F).required("InstructionBodyCloseBraket"))).converter(b=>{let w=new ut;return w.instructionType=b.instructionName.substring(1),w.instruction=b.instruction?.value.join("")??"",b.body&&w.appendChild(...b.body.value),w}),C=q.define(()=>{let b=C;return V.new().required("list[]",[c,h,y,l]).optional("list<-list",b)}),F=q.define(()=>{let b=C;return V.new().optional("list<-list",b)}).converter(b=>{let w=new Array;if(b.list)for(let A of b.list)A!==null&&w.push(A);return w}),x=q.define(()=>V.new().required("content",F)).converter(b=>{let w=new ge;return w.appendChild(...b.content),w});return t.setRootGraph(x),t}}});var xe,Mt=p(()=>{L();Nt();Or();en();ct();Lr();re();Vr();jr();ji();kt();Zr();xe=class i extends Lt{static mTemplateCache=new N;static mXmlParser=new un;mComponentElement;mRootBuilder;mUpdateMode;get element(){return this.mComponentElement.htmlElement}get updateMode(){return this.mUpdateMode}constructor(e){super({applicationContext:e.applicationContext,constructor:e.processorConstructor,loggingType:1,trigger:127,isolate:(e.updateMode&1)!==0,trackConstructorChanges:!0}),se.registerComponent(this,e.htmlElement),this.addCreationHook(n=>{se.registerComponent(this,this.mComponentElement.htmlElement,n)}).addCreationHook(n=>this.registerObject(n)).addCreationHook(n=>{se.registerComponent(this,this.mComponentElement.htmlElement,n)});let t=i.mTemplateCache.get(e.processorConstructor);t?t=t.clone():(t=i.mXmlParser.parse(e.templateString??""),i.mTemplateCache.set(e.processorConstructor,t)),this.mUpdateMode=e.updateMode,this.mComponentElement=new an(e.htmlElement),this.mRootBuilder=new Ft(this.applicationContext,t,new Yn(this,e.expressionModule),new Ce(this),"ROOT"),this.mComponentElement.shadowRoot.appendChild(this.mRootBuilder.anchor),this.setProcessorAttributes(Le,new Le(this.mRootBuilder.values)),this.setProcessorAttributes(i,this),(e.updateMode&2)===0&&this.setAutoUpdate(127)}addStyle(e){let t=document.createElement("style");t.innerHTML=e,this.mComponentElement.shadowRoot.prepend(t)}attributeChanged(e,t,n){this.call("onAttributeChange",!1,e,t,n)}connected(){this.call("onConnect",!1)}deconstruct(){this.call("onDeconstruct",!1),this.mRootBuilder.deconstruct(),super.deconstruct()}disconnected(){this.call("onDisconnect",!1)}onUpdate(){return this.mRootBuilder.update()?(this.call("onUpdate",!1),!0):!1}}});function j(i){return z.enableGlobalTracing(nu(globalThis)),(e,t)=>{v.registerInjectable(e,t.metadata,"instanced"),se.registerConstructor(e,i.selector);let n=class extends HTMLElement{mComponent;constructor(){super();let r=z.current.attachment(it.CONFIGURATION_ATTACHMENT);r||(r=Fe.DEFAULT),this.mComponent=new xe({applicationContext:r,processorConstructor:e,templateString:i.template??null,expressionModule:i.expressionmodule,htmlElement:this,updateMode:i.updateScope??0}).setup(),i.style&&this.mComponent.addStyle(i.style),this.mComponent.update()}connectedCallback(){this.mComponent.connected()}disconnectedCallback(){this.mComponent.disconnected()}};globalThis.customElements.define(i.selector,n)}}var nu,Wi=p(()=>{W();qt();Fn();pe();Lr();kt();Mt();nu=i=>{let e={target:i,patches:{requirements:{promise:i.Promise?.name,eventTarget:i.EventTarget?.name},classes:{eventTargets:new Array,callback:new Array},functions:new Array},errorHandling:!0},t=[i.requestAnimationFrame?.name,i.setInterval?.name,i.setTimeout?.name];e.patches.functions.push(...t.filter(o=>!!o));let n=[i.XMLHttpRequestEventTarget?.name,i.XMLHttpRequest?.name,i.Document?.name,i.SVGElement?.name,i.Element?.name,i.HTMLElement?.name,i.HTMLMediaElement?.name,i.HTMLFrameSetElement?.name,i.HTMLBodyElement?.name,i.HTMLFrameElement?.name,i.HTMLIFrameElement?.name,i.HTMLMarqueeElement?.name,i.Worker?.name,i.IDBRequest?.name,i.IDBOpenDBRequest?.name,i.IDBDatabase?.name,i.IDBTransaction?.name,i.WebSocket?.name,i.FileReader?.name,i.Notification?.name,i.RTCPeerConnection?.name];e.patches.classes.eventTargets.push(...n.filter(o=>!!o));let r=[i.ResizeObserver?.name,i.MutationObserver?.name,i.IntersectionObserver?.name];return e.patches.classes.callback.push(...r.filter(o=>!!o)),e}});var Zi=p(()=>{Dt()});function bt(i){return(e,t)=>{v.registerInjectable(e,t.metadata,"instanced"),ye.register(We,e,{access:i.access,trigger:i.trigger,targetRestrictions:i.targetRestrictions})}}var pn=p(()=>{W();at();Vn()});function Ue(i){return(e,t)=>{v.registerInjectable(e,t.metadata,"instanced"),ye.register(ue,e,{access:i.access,selector:i.selector,trigger:i.trigger})}}var Vt=p(()=>{W();at();yt()});function ze(i){return(e,t)=>{v.registerInjectable(e,t.metadata,"instanced"),ye.register(Je,e,{instructionType:i.instructionType,trigger:i.trigger})}}var jt=p(()=>{W();at();Zn()});var Yi,Yr,ru,Ut,dn,Qn=p(()=>{W();Mt();le();Se();re();pn();Yi=[bt({access:1,trigger:127,targetRestrictions:[xe]})];Ut=class Ut extends(ru=I){static METADATA_USER_EVENT_LISTENER_PROPERIES="pwb:user_event_listener_properties";mEventListenerList;mTargetElement;constructor(e=v.use(xe)){super();let t=new Array,n=e.processorConstructor;do{let r=ae.get(n).getMetadata(Ut.METADATA_USER_EVENT_LISTENER_PROPERIES);if(r)for(let o of r)t.push(o)}while(n=Object.getPrototypeOf(n));this.mEventListenerList=new Array,this.mTargetElement=e.element;for(let r of t){let[o,s]=r,a=Reflect.get(e.processor,o);a=a.bind(e.processor),this.mEventListenerList.push([s,a]),this.mTargetElement.addEventListener(s,a)}}onDeconstruct(){for(let e of this.mEventListenerList){let[t,n]=e;this.mTargetElement.removeEventListener(t,n)}}};Yr=E(ru),Ut=d(Yr,0,"ComponentEventListenerComponentExtension",Yi,Ut),u(Yr,1,Ut);dn=Ut});var _i=p(()=>{L();W();Qn()});var mn,_r=p(()=>{mn=class extends window.Event{mValue;get value(){return this.mValue}constructor(e,t){super(e),this.mValue=t}}});var hn,qr=p(()=>{_r();hn=class{mElement;mEventName;constructor(e,t){this.mEventName=e,this.mElement=t}dispatchEvent(e){let t=new mn(this.mEventName,e);this.mElement.dispatchEvent(t)}}});function D(i){return(e,t)=>{if(t.static)throw new g("Event target is not for a static property.",D);let n=null;return{get(){if(!n){let r=(()=>{try{return se.ofProcessor(this).component}catch{throw new g("PwbComponentEvent target class is not a component.",this)}})();n=new hn(i,r.element)}return n}}}}var qi=p(()=>{L();kt();qr()});var Ji,Jr,ou,zt,yn,Qr=p(()=>{L();W();Mt();le();Se();re();pn();Ji=[bt({access:2,trigger:127,targetRestrictions:[xe]})];zt=class zt extends(ou=I){static METADATA_EXPORTED_PROPERTIES="pwb:exported_properties";mComponent;constructor(e=v.use(xe)){super(),this.mComponent=e;let t=new _,n=e.processorConstructor;do{let o=ae.get(n).getMetadata(zt.METADATA_EXPORTED_PROPERTIES);o&&t.push(...o)}while(n=Object.getPrototypeOf(n));let r=new Set(t);r.size>0&&this.connectExportedProperties(r)}connectExportedProperties(e){this.exportPropertyAsAttribute(e),this.patchHtmlAttributes(e)}exportPropertyAsAttribute(e){for(let t of e){let n={};n.enumerable=!0,n.configurable=!0,delete n.value,delete n.writable,n.set=r=>{Reflect.set(this.mComponent.processor,t,r)},n.get=()=>{let r=Reflect.get(this.mComponent.processor,t);return typeof r=="function"&&(r=r.bind(this.mComponent.processor)),r},Object.defineProperty(this.mComponent.element,t,n)}}patchHtmlAttributes(e){let t=this.mComponent.element.getAttribute;new MutationObserver(r=>{for(let o of r){let s=o.attributeName,a=t.call(this.mComponent.element,s);Reflect.set(this.mComponent.element,s,a),this.mComponent.attributeChanged(s,o.oldValue,a)}}).observe(this.mComponent.element,{attributeFilter:[...e],attributeOldValue:!0});for(let r of e)if(this.mComponent.element.hasAttribute(r)){let o=t.call(this.mComponent.element,r);this.mComponent.element.setAttribute(r,o)}this.mComponent.element.getAttribute=r=>e.has(r)?Reflect.get(this.mComponent.element,r):t.call(this.mComponent.element,r)}};Jr=E(ou),zt=d(Jr,0,"ExportExtension",Ji,zt),u(Jr,1,zt);yn=zt});function P(i,e){if(e.static)throw new g("Event target is not for a static property.",P);let t=ae.forInternalDecorator(e.metadata),n=t.getMetadata(yn.METADATA_EXPORTED_PROPERTIES)??new Array;n.push(e.name),t.setMetadata(yn.METADATA_EXPORTED_PROPERTIES,n)}var Qi=p(()=>{L();W();Qr()});function de(i){return(e,t)=>{if(t.static)throw new g("Event target is not for a static property.",de);return{get(){let o=(()=>{try{return se.ofProcessor(this).component}catch{throw new g("PwbChild target class is not a component.",this)}})().getProcessorAttribute(Le).data.store[i];if(o instanceof Element)return o;throw new g(`Can't find child "${i}".`,this)}}}}var es=p(()=>{L();kt();en()});var ts,eo,iu,gn,ns=p(()=>{L();W();pt();le();ct();we();re();_e();gt();jt();ts=[ze({instructionType:"dynamic-content",trigger:111})];gn=class extends(iu=I){mLastTemplate;mModuleValues;mProcedure;constructor(e=v.use(J),t=v.use(K)){super(),this.mModuleValues=t,this.mLastTemplate=null,this.mProcedure=this.mModuleValues.createExpressionProcedure(e.value)}onUpdate(){let e=this.mProcedure.execute();if(!e||!(e instanceof ge))throw new g("Dynamic content method has a wrong result type.",this);if(this.mLastTemplate!==null&&this.mLastTemplate.equals(e))return null;let t=e.clone();this.mLastTemplate=t;let n=new be;return n.addElement(t,new Ce(this.mModuleValues.data)),n}};eo=E(iu),gn=d(eo,0,"DynamicContentInstructionModule",ts,gn),u(eo,1,gn)});var rs,to,su,fn,os=p(()=>{W();le();we();Se();re();Vt();ht();je();rs=[Ue({access:3,selector:/^\([[\w\-$]+\)$/,trigger:127})];fn=class extends(su=I){mEventName;mListener;mTarget;constructor(e=v.use(ee),t=v.use(K),n=v.use(fe)){super(),this.mTarget=e,this.mEventName=n.name.substring(1,n.name.length-1);let r=t.createExpressionProcedure(n.value,["$event"]);this.mListener=o=>{r.setTemporaryValue("$event",o),r.execute()},this.mTarget.addEventListener(this.mEventName,this.mListener)}onDeconstruct(){this.mTarget.removeEventListener(this.mEventName,this.mListener)}};to=E(su),fn=d(to,0,"EventAttributeModule",rs,fn),u(to,1,fn)});var is,no,au,bn,ss=p(()=>{L();W();pt();le();ct();we();re();_e();dt();gt();jt();is=[ze({instructionType:"for",trigger:111})];bn=class extends(au=I){mExpression;mLastEntries;mModuleValues;mTemplate;constructor(e=v.use(Pe),t=v.use(K),n=v.use(J)){super(),this.mTemplate=e,this.mModuleValues=t,this.mLastEntries=new Array;let r=n.value,s=new RegExp(/^\s*([a-zA-Z]+[a-zA-Z0-9]*)\s*of\s+([^;]+)\s*(;\s*([a-zA-Z]+[a-zA-Z0-9]*)\s*=\s*(.*)\s*)?$/).exec(r);if(!s)throw new g(`For-Parameter value has wrong format: ${r}`,this);let a=s[1],l=s[2],c=s[4]??null,h=s[5],m=this.mModuleValues.createExpressionProcedure(l),y=c?this.mModuleValues.createExpressionProcedure(h,["$index",a]):null;this.mExpression={iterateVariableName:a,iterateValueProcedure:m,indexExportVariableName:c,indexExportProcedure:y}}onUpdate(){let e=new be,t=this.mExpression.iterateValueProcedure.execute();if(typeof t=="object"&&t!==null||Array.isArray(t)){let n=Symbol.iterator in t?Object.entries([...t]):Object.entries(t);if(this.compareEntries(n,this.mLastEntries))return null;this.mLastEntries=n;for(let[r,o]of n)this.addTemplateForElement(e,this.mExpression,o,r);return e}else return null}addTemplateForElement=(e,t,n,r)=>{let o=new Ce(this.mModuleValues.data);if(o.setTemporaryValue(t.iterateVariableName,n),t.indexExportProcedure&&t.indexExportVariableName){t.indexExportProcedure.setTemporaryValue("$index",r),t.indexExportProcedure.setTemporaryValue(t.iterateVariableName,n);let a=t.indexExportProcedure.execute();o.setTemporaryValue(t.indexExportVariableName,a)}let s=new ge;s.appendChild(...this.mTemplate.childList),e.addElement(s,o)};compareEntries(e,t){if(e.length!==t.length)return!1;for(let n=0;n<e.length;n++){let[r,o]=e[n],[s,a]=t[n];if(r!==s||o!==a)return!1}return!0}};no=E(au),bn=d(no,0,"ForInstructionModule",is,bn),u(no,1,bn)});var as,ro,lu,Tn,ls=p(()=>{W();pt();le();ct();we();re();_e();dt();gt();jt();as=[ze({instructionType:"if",trigger:111})];Tn=class extends(lu=I){mLastBoolean;mModuleValues;mProcedure;mTemplateReference;constructor(e=v.use(Pe),t=v.use(K),n=v.use(J)){super(),this.mTemplateReference=e,this.mModuleValues=t,this.mProcedure=this.mModuleValues.createExpressionProcedure(n.value),this.mLastBoolean=!1}onUpdate(){let e=this.mProcedure.execute();if(!!e!==this.mLastBoolean){this.mLastBoolean=!!e;let t=new be;if(e){let n=new ge;n.appendChild(...this.mTemplateReference.childList),t.addElement(n,new Ce(this.mModuleValues.data))}return t}else return null}};ro=E(lu),Tn=d(ro,0,"IfInstructionModule",as,Tn),u(ro,1,Tn)});var cs,oo,cu,vn,us=p(()=>{W();le();we();Se();re();Vt();ht();je();cs=[Ue({access:1,selector:/^\[[\w$]+\]$/,trigger:127})];vn=class extends(cu=I){mLastValue;mProcedure;mTarget;mTargetProperty;constructor(e=v.use(ee),t=v.use(K),n=v.use(fe)){super(),this.mTarget=e,this.mProcedure=t.createExpressionProcedure(n.value),this.mTargetProperty=n.name.substring(1,n.name.length-1),this.mLastValue=Symbol("Uncomparable")}onUpdate(){let e=this.mProcedure.execute();return e===this.mLastValue?!1:(this.mLastValue=e,Reflect.set(this.mTarget,this.mTargetProperty,e),!0)}};oo=E(cu),vn=d(oo,0,"OneWayBindingAttributeModule",cs,vn),u(oo,1,vn)});var ps,io,uu,Cn,ds=p(()=>{W();le();en();Se();re();yt();Vt();ht();je();ps=[Ue({access:3,selector:/^#[[\w$]+$/,trigger:127})];Cn=class extends(uu=I){constructor(e=v.use(ee),t=v.use(ue),n=v.use(fe),r=v.use(Le)){super();let o=e,s=t.registerObject(o);r.setTemporaryValue(n.name.substring(1),s)}};io=E(uu),Cn=d(io,0,"PwbChildAttributeModule",ps,Cn),u(io,1,Cn)});var ms,so,pu,xn,hs=p(()=>{W();sn();pt();le();we();re();_e();gt();jt();ms=[ze({instructionType:"slot",trigger:0})];xn=class extends(pu=I){mIsSetup;mModuleValues;mSlotName;constructor(e=v.use(K),t=v.use(J)){super(),this.mModuleValues=e,this.mSlotName=t.value,this.mIsSetup=!1}onUpdate(){if(this.mIsSetup)return null;this.mIsSetup=!0;let e=new Ve;e.tagName="slot",this.mSlotName!==""&&e.setAttribute("name").addValue(this.mSlotName);let t=new ge;t.appendChild(e);let n=new be;return n.addElement(t,this.mModuleValues.data),n}};so=E(pu),xn=d(so,0,"SlotInstructionModule",ms,xn),u(so,1,xn)});var ys,ao,du,Pn,gs=p(()=>{le();Se();re();yt();Vt();ht();je();we();W();ys=[Ue({access:2,selector:/^\[\([[\w$]+\)\]$/,trigger:127})];Pn=class extends(du=I){mAttributeKey;mLastDataValue;mReadProcedure;mTargetNode;mWriteProcedure;constructor(e=v.use(ee),t=v.use(K),n=v.use(fe),r=v.use(ue)){super(),this.mTargetNode=e,this.mAttributeKey=n.name.substring(2,n.name.length-2),this.mReadProcedure=t.createExpressionProcedure(n.value),this.mWriteProcedure=t.createExpressionProcedure(`${n.value} = $DATA;`,["$DATA"]),this.mLastDataValue=Symbol("Uncomparable"),r.registerObject(this.mTargetNode)}onUpdate(){let e=this.mReadProcedure.execute();if(e!==this.mLastDataValue)return Reflect.set(this.mTargetNode,this.mAttributeKey,e),this.mLastDataValue=e,!0;let t=Reflect.get(this.mTargetNode,this.mAttributeKey);return t!==e?(this.mWriteProcedure.setTemporaryValue("$DATA",t),this.mWriteProcedure.execute(),this.mLastDataValue=t,!0):!1}};ao=E(du),Pn=d(ao,0,"TwoWayBindingAttributeModule",ys,Pn),u(ao,1,Pn)});var fs,lo,mu,In,bs=p(()=>{W();le();Se();re();pn();yt();je();Qn();fs=[bt({access:1,trigger:127,targetRestrictions:[ue]})];In=class extends(mu=I){mEventListenerList;mTargetElement;constructor(e=v.use(ue),t=v.use(ee)){super();let n=new Array,r=e.processorConstructor;do{let o=ae.get(r).getMetadata(dn.METADATA_USER_EVENT_LISTENER_PROPERIES);if(o)for(let s of o)n.push(s)}while(r=Object.getPrototypeOf(r));this.mEventListenerList=new Array,this.mTargetElement=t;for(let o of n){let[s,a]=o,l=Reflect.get(e.processor,s);l=l.bind(e.processor),this.mEventListenerList.push([a,l]),this.mTargetElement.addEventListener(a,l)}}onDeconstruct(){for(let e of this.mEventListenerList){let[t,n]=e;this.mTargetElement.removeEventListener(t,n)}}};lo=E(mu),In=d(lo,0,"ComponentEventListenerModuleExtension",fs,In),u(lo,1,In)});var pe=p(()=>{Ei();Fn();Wi();Zi();le();we();Vn();yt();Wn();ht();je();dt();Zn();jr();Mt();en();ct();jn();we();pn();Vt();zr();gt();jt();Se();_i();qr();_r();qi();Qi();es();Un();rn();sn();Gr();nn();Zr();ns();os();ss();ls();us();ds();hs();gs();Qn();bs();Qr()});var vs,Ts=p(()=>{vs=`:host {\r
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
`});var xs,Cs=p(()=>{xs=`<div class="editor-layout">\r
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
</div>`});var $t=p(()=>{});var Tt,co=p(()=>{Tt=class{id;kind;sourceNodeId;sourcePortId;targetNodeId;targetPortId;mValid;get valid(){return this.mValid}set valid(e){this.mValid=e}constructor(e,t,n,r,o,s){this.id=e,this.sourceNodeId=t,this.sourcePortId=n,this.targetNodeId=r,this.targetPortId=o,this.kind=s,this.mValid=!0}}});var Ps=p(()=>{});var wn,Is=p(()=>{wn=class{direction;id;name;mConnectedTo;get connectedTo(){return this.mConnectedTo}set connectedTo(e){this.mConnectedTo=e}constructor(e,t,n){this.id=e,this.name=t,this.direction=n,this.mConnectedTo=null}}});var En,ws=p(()=>{En=class{direction;id;name;type;valueId;mConnectedTo;get connectedTo(){return this.mConnectedTo}set connectedTo(e){this.mConnectedTo=e}constructor(e,t,n,r,o){this.id=e,this.name=t,this.type=n,this.direction=r,this.valueId=o,this.mConnectedTo=null}}});var vt,uo=p(()=>{Ps();Is();ws();vt=class i{category;definitionName;flowInputs;flowOutputs;id;inputs;outputs;properties;system;mPosition;mSize;get position(){return this.mPosition}get size(){return this.mSize}constructor(e,t,n,r){this.id=e,this.definitionName=t.name,this.category=t.category,this.system=r,this.mPosition={x:n.x,y:n.y},this.mSize={w:8,h:4},this.properties=new Map,this.inputs=new Map;for(let a of t.inputs){let l=i.generatePortId(),c=i.generateValueId(t.category);this.inputs.set(a.name,new En(l,a.name,a.type,"input",c))}this.outputs=new Map;for(let a of t.outputs){let l=i.generatePortId(),c=i.generateValueId(t.category);this.outputs.set(a.name,new En(l,a.name,a.type,"output",c))}let o=t.flowInputs??i.getAutoFlowInputs(t.category),s=t.flowOutputs??i.getAutoFlowOutputs(t.category);this.flowInputs=new Map;for(let a of o){let l=i.generatePortId();this.flowInputs.set(a,new wn(l,a,"input"))}this.flowOutputs=new Map;for(let a of s){let l=i.generatePortId();this.flowOutputs.set(a,new wn(l,a,"output"))}}moveTo(e,t){this.mPosition={x:e,y:t}}resizeTo(e,t){this.mSize={w:Math.max(4,e),h:Math.max(2,t)}}static getAutoFlowInputs(e){return e==="function"?["exec"]:[]}static getAutoFlowOutputs(e){return e==="function"||e==="event"?["exec"]:[]}static generatePortId(){return crypto.randomUUID().substring(0,8)}static generateValueId(e){let t=crypto.randomUUID().replace(/-/g,"").substring(0,12);return`${String(e).replace(/[^a-zA-Z0-9]/g,"")}_${t}`}}});var er,Es=p(()=>{$t();co();uo();er=class{mConnections;mNodes;get connections(){return this.mConnections}get nodes(){return this.mNodes}constructor(){this.mNodes=new Map,this.mConnections=new Map}addNode(e,t,n=!1){let r=crypto.randomUUID(),o=new vt(r,e,t,n);return this.mNodes.set(r,o),o}addExistingNode(e){this.mNodes.set(e.id,e)}removeNode(e){let t=new Array;for(let[n,r]of this.mConnections)(r.sourceNodeId===e||r.targetNodeId===e)&&(t.push(r),this.mConnections.delete(n));return this.mNodes.delete(e),t}addConnection(e,t,n,r,o){let s=this.mNodes.get(e),a=this.mNodes.get(n);if(!s||!a||e===n)return null;if(o==="data"){let l=this.findDataPortById(s,t),c=this.findDataPortById(a,r);if(!l||!c)return null;let h=l.type===c.type;for(let[C,F]of this.mConnections)if(F.targetNodeId===n&&F.targetPortId===r&&F.kind==="data"){this.mConnections.delete(C);break}c.connectedTo=l.valueId;let m=crypto.randomUUID(),y=new Tt(m,e,t,n,r,o);return y.valid=h,this.mConnections.set(m,y),y}else{let l=this.findFlowPortById(s,t),c=this.findFlowPortById(a,r);if(!l||!c)return null;for(let[y,C]of this.mConnections)if(C.sourceNodeId===e&&C.sourcePortId===t&&C.kind==="flow"){this.mConnections.delete(y);break}l.connectedTo=c.id,c.connectedTo=l.id;let h=crypto.randomUUID(),m=new Tt(h,e,t,n,r,o);return this.mConnections.set(h,m),m}}addExistingConnection(e){this.mConnections.set(e.id,e)}removeConnection(e){let t=this.mConnections.get(e);if(!t)return null;let n=this.mNodes.get(t.targetNodeId);if(n)if(t.kind==="data"){let r=this.findDataPortById(n,t.targetPortId);r&&(r.connectedTo=null)}else{let r=this.mNodes.get(t.sourceNodeId),o=r?this.findFlowPortById(r,t.sourcePortId):null,s=this.findFlowPortById(n,t.targetPortId);o&&(o.connectedTo=null),s&&(s.connectedTo=null)}return this.mConnections.delete(e),t}validate(){let e=new Array;for(let t of this.mConnections.values()){if(t.kind!=="data")continue;let n=this.mNodes.get(t.sourceNodeId),r=this.mNodes.get(t.targetNodeId);if(!n||!r){t.valid=!1,e.push(t);continue}let o=this.findDataPortById(n,t.sourcePortId),s=this.findDataPortById(r,t.targetPortId);if(!o||!s){t.valid=!1,e.push(t);continue}let a=o.type===s.type;t.valid=a,a||e.push(t)}return e}getNode(e){return this.mNodes.get(e)}getConnection(e){return this.mConnections.get(e)}getConnectionsForNode(e){let t=new Array;for(let n of this.mConnections.values())(n.sourceNodeId===e||n.targetNodeId===e)&&t.push(n);return t}findDataPortById(e,t){for(let n of e.inputs.values())if(n.id===t)return n;for(let n of e.outputs.values())if(n.id===t)return n;return null}findFlowPortById(e,t){for(let n of e.flowInputs.values())if(n.id===t)return n;for(let n of e.flowOutputs.values())if(n.id===t)return n;return null}}});var Ct,po=p(()=>{Es();Ct=class{editableByUser;graph;id;system;mImports;mInputs;mLabel;mLocalVariables;mName;mOutputs;get imports(){return this.mImports}get inputs(){return this.mInputs}get localVariables(){return this.mLocalVariables}get label(){return this.mLabel}get name(){return this.mName}get outputs(){return this.mOutputs}constructor(e,t,n,r,o=!1){this.id=e,this.mName=t,this.mLabel=n,this.system=r,this.editableByUser=o,this.graph=new er,this.mInputs=new Array,this.mOutputs=new Array,this.mImports=new Array,this.mLocalVariables=new Array}setName(e){this.mName=e}setLabel(e){this.mLabel=e}setInputs(e){this.mInputs=[...e]}setOutputs(e){this.mOutputs=[...e]}setImports(e){this.mImports=[...e]}addImport(e){this.mImports.includes(e)||this.mImports.push(e)}removeImport(e){let t=this.mImports.indexOf(e);t!==-1&&this.mImports.splice(t,1)}addInput(e){this.mInputs.push(e)}removeInput(e){this.mInputs.splice(e,1)}addOutput(e){this.mOutputs.push(e)}removeOutput(e){this.mOutputs.splice(e,1)}addLocalVariable(e,t){this.mLocalVariables.push({name:e,type:t})}removeLocalVariable(e){this.mLocalVariables.splice(e,1)}setLocalVariables(e){this.mLocalVariables=[...e]}}});var nr,ks=p(()=>{nr=class{mMaxSize;mRedoStack;mUndoStack;get canRedo(){return this.mRedoStack.length>0}get canUndo(){return this.mUndoStack.length>0}constructor(e=100){this.mUndoStack=new Array,this.mRedoStack=new Array,this.mMaxSize=e}push(e){e.apply(),this.mUndoStack.push(e),this.mRedoStack.length=0,this.mUndoStack.length>this.mMaxSize&&this.mUndoStack.shift()}undo(){let e=this.mUndoStack.pop();e&&(e.revert(),this.mRedoStack.push(e))}redo(){let e=this.mRedoStack.pop();e&&(e.apply(),this.mUndoStack.push(e))}clear(){this.mUndoStack.length=0,this.mRedoStack.length=0}}});var rr,Ns=p(()=>{$t();rr=class{mData;get hasData(){return this.mData!==null}constructor(){this.mData=null}copy(e,t){let n=new Array,r=new Map;for(let a of t){let l=e.getNode(a);l&&!l.system&&(r.set(l.id,n.length),n.push(l))}if(n.length===0)return;let o=n.map(a=>{let l={};for(let[h,m]of a.properties)l[h]=m;let c=new Array;for(let[h,m]of a.inputs)m.connectedTo&&c.push({portName:h,connectedValueId:m.connectedTo});return{definitionName:a.definitionName,position:{...a.position},size:{...a.size},properties:l,inputConnections:c}}),s=[];for(let a of e.connections.values()){let l=r.get(a.sourceNodeId),c=r.get(a.targetNodeId);if(l!==void 0&&c!==void 0){let h=n[l],m=n[c],y="",C="",F;if(a.kind==="data"){F="data";for(let[x,b]of h.outputs)if(b.id===a.sourcePortId){y=x;break}for(let[x,b]of m.inputs)if(b.id===a.targetPortId){C=x;break}}else{F="flow";for(let[x,b]of h.flowOutputs)if(b.id===a.sourcePortId){y=x;break}for(let[x,b]of m.flowInputs)if(b.id===a.targetPortId){C=x;break}}y&&C&&s.push({sourceNodeIndex:l,sourcePortName:y,targetNodeIndex:c,targetPortName:C,kind:F})}}this.mData={nodes:o,internalConnections:s}}getData(){return this.mData}}});var Ht,mo=p(()=>{Ht=class i{static MAX_ZOOM=2;static MIN_ZOOM=.25;mGridSize;mPanX;mPanY;mSelectionEnd;mSelectionStart;mZoom;get gridSize(){return this.mGridSize}get panX(){return this.mPanX}get panY(){return this.mPanY}get selectionEnd(){return this.mSelectionEnd}get selectionStart(){return this.mSelectionStart}get zoom(){return this.mZoom}constructor(e=20){this.mGridSize=e,this.mPanX=0,this.mPanY=0,this.mZoom=1,this.mSelectionStart=null,this.mSelectionEnd=null}clearSelection(){this.mSelectionStart=null,this.mSelectionEnd=null}getGridBackgroundCss(){let e=this.mGridSize*this.mZoom,t=this.mPanX%e,n=this.mPanY%e,r=e*5,o=this.mPanX%r,s=this.mPanY%r;return[`background-size: ${e}px ${e}px, ${r}px ${r}px`,`background-position: ${t}px ${n}px, ${o}px ${s}px`,"background-image: radial-gradient(circle, var(--pn-grid-color) 1px, transparent 1px), radial-gradient(circle, var(--pn-grid-color) 1.5px, transparent 1.5px)"].join("; ")}getTransformCss(){return`translate(${this.mPanX}px, ${this.mPanY}px) scale(${this.mZoom})`}pan(e,t){this.mPanX+=e,this.mPanY+=t}screenToWorld(e,t){return{x:(e-this.mPanX)/this.mZoom,y:(t-this.mPanY)/this.mZoom}}setSelectionEnd(e,t){this.mSelectionEnd={x:e,y:t}}setSelectionStart(e,t){this.mSelectionStart={x:e,y:t}}snapToGrid(e,t){return{x:Math.round(e/this.mGridSize)*this.mGridSize,y:Math.round(t/this.mGridSize)*this.mGridSize}}worldToScreen(e,t){return{x:e*this.mZoom+this.mPanX,y:t*this.mZoom+this.mPanY}}zoomAt(e,t,n){let r=this.mZoom,o=1+n,s=this.mZoom*o;s=Math.max(i.MIN_ZOOM,Math.min(i.MAX_ZOOM,s));let a=(e-this.mPanX)/r,l=(t-this.mPanY)/r;this.mZoom=s,this.mPanX=e-a*this.mZoom,this.mPanY=t-l*this.mZoom}}});var ho,yo,Kt,go=p(()=>{ho="http://www.w3.org/2000/svg",yo="data-temp-connection",Kt=class{clearAll(e){let t=e.querySelectorAll("path");for(let n of t)n.remove()}clearTempConnection(e){let t=e.querySelector(`[${yo}]`);t&&t.remove()}generateBezierPath(e,t,n,r){let o=Math.abs(n-e),s=Math.max(o*.4,50),a=e+s,l=t,c=n-s;return`M ${e} ${t} C ${a} ${l}, ${c} ${r}, ${n} ${r}`}renderConnections(e,t){let n=e.querySelectorAll(`path:not([${yo}])`);for(let r of n)r.remove();for(let r of t){let o=this.generateBezierPath(r.sourceX,r.sourceY,r.targetX,r.targetY),s=document.createElementNS(ho,"path");s.setAttribute("d",o),s.setAttribute("fill","none"),s.setAttribute("data-connection-id",r.id),s.setAttribute("data-hit-area","true"),s.style.stroke="transparent",s.style.strokeWidth="12",s.style.pointerEvents="stroke",s.style.cursor="pointer",e.appendChild(s);let a=document.createElementNS(ho,"path");a.setAttribute("d",o),a.setAttribute("fill","none"),a.setAttribute("data-connection-id",r.id),a.style.stroke=r.valid?"#a6adc8":"#f38ba8",a.style.strokeWidth="2",a.style.pointerEvents="none",r.valid||a.setAttribute("stroke-dasharray","6 3"),e.appendChild(a)}}renderTempConnection(e,t,n,r){this.clearTempConnection(e);let o=document.createElementNS(ho,"path");o.setAttribute("d",this.generateBezierPath(t.x,t.y,n.x,n.y)),o.setAttribute("fill","none"),o.setAttribute(yo,"true"),o.style.stroke=r,o.style.strokeWidth="2",o.style.opacity="0.6",o.style.strokeDasharray="8 4",o.style.pointerEvents="none",e.appendChild(o)}}});var Qe,Xt,xt=p(()=>{Qe=(y=>(y.Function="function",y.Operator="operator",y.Value="value",y.Flow="flow",y.Comment="comment",y.TypeConversion="type-conversion",y.Input="input",y.Output="output",y.Event="event",y.Reroute="reroute",y.GetLocal="getlocal",y.SetLocal="setlocal",y))(Qe||{}),Xt=class i{static META={function:{icon:"f",cssColor:"var(--pn-accent-blue)",label:"Function"},operator:{icon:"\xB1",cssColor:"var(--pn-accent-green)",label:"Operator"},value:{icon:"#",cssColor:"var(--pn-accent-peach)",label:"Value"},flow:{icon:"\u27F3",cssColor:"var(--pn-accent-mauve)",label:"Flow"},comment:{icon:"\u{1F4AC}",cssColor:"var(--pn-accent-yellow)",label:"Comment"},"type-conversion":{icon:"\u21C4",cssColor:"var(--pn-accent-teal)",label:"Type Conversion"},input:{icon:"\u2192",cssColor:"var(--pn-accent-green)",label:"Input"},output:{icon:"\u2190",cssColor:"var(--pn-accent-red)",label:"Output"},event:{icon:"\u26A1",cssColor:"var(--pn-accent-danger)",label:"Event"},reroute:{icon:"\u25C7",cssColor:"var(--pn-text-muted)",label:"Reroute"},getlocal:{icon:"\u2193",cssColor:"var(--pn-accent-teal)",label:"Get Local"},setlocal:{icon:"\u2191",cssColor:"var(--pn-accent-teal)",label:"Set Local"}};static get(e){return i.META[e]??{icon:"?",cssColor:"var(--pn-text-muted)",label:"Unknown"}}}});var or,As=p(()=>{or=class{bodyCode;inputs;name;outputs;constructor(){this.name="",this.bodyCode="",this.inputs=new Array,this.outputs=new Array}}});var oe,et=p(()=>{oe=class{mBody;mInputs;mOutputs;mProperties;get body(){return this.mBody}get inputs(){return this.mInputs}get outputs(){return this.mOutputs}get properties(){return this.mProperties}constructor(){this.mInputs=new Map,this.mOutputs=new Map,this.mBody=new Map,this.mProperties=new Map}buildContext(){let e={};for(let[o,s]of this.mInputs)e[o]=s.valueId;let t={};for(let[o,s]of this.mOutputs)t[o]=s.valueId;let n={};for(let[o,s]of this.mProperties)n[o]=s||"undefined";let r={};for(let[o,s]of this.mBody)r[o]=s.code;return{inputs:e,outputs:t,properties:n,body:r}}}});var ir,Ds=p(()=>{et();ir=class extends oe{get commentText(){return this.properties.get("comment")??""}set commentText(e){this.properties.set("comment",e)}generateCode(){return""}}});var sr,Ss=p(()=>{et();sr=class extends oe{generateCode(){return""}}});var ar,Ls=p(()=>{et();ar=class extends oe{generateCode(){return""}}});var tt,lr=p(()=>{et();tt=class extends oe{mCodeGenerator;constructor(e){super(),this.mCodeGenerator=e}generateCode(){return this.mCodeGenerator(this.buildContext())}}});var cr,Ms=p(()=>{lr();cr=class extends tt{get value(){return this.properties.get("value")??""}set value(e){this.properties.set("value",e)}}});var ur,Rs=p(()=>{lr();ur=class extends tt{}});var pr,Os=p(()=>{et();pr=class extends oe{generateCode(){return""}}});var dr,Fs=p(()=>{et();dr=class extends oe{generateCode(){let e=this.properties.get("variableName")??"undefined",n=this.inputs.values().next().value?.valueId??"undefined";return`${e} = ${n};`}}});var mr,Gs=p(()=>{et();mr=class extends oe{generateCode(){return""}}});var kn,Bs=p(()=>{xt();$t();As();Ds();Ss();Ls();lr();Ms();Rs();Os();Fs();Gs();kn=class{mConfig;constructor(e){this.mConfig=e}generateFunctionCode(e){let t=e.graph,n=this.generateGraphCode(t),r=[];for(let s of e.localVariables)r.push(`    let ${s.name};`);r.length>0&&(n=r.join(`
`)+`
`+n);let o=new or;o.name=e.name,o.bodyCode=n;for(let s of e.inputs){let a=this.findInputNodeValueId(t,s.name);o.inputs.push({name:s.name,type:s.type,valueId:a})}for(let s of e.outputs){let a=this.findOutputNodeValueId(t,s.name);o.outputs.push({name:s.name,type:s.type,valueId:a})}return this.mConfig.functionCodeGenerator?this.mConfig.functionCodeGenerator(o):n}generateProjectCode(e){let t=new Array;for(let n of e.values())t.push(this.generateFunctionCode(n));return t.join(`

`)}generateGraphCode(e){let t=this.topologicalSort(e),n=new Array;for(let r of t){if(r.category==="input"||r.category==="output"||r.category==="reroute"||r.category==="getlocal"||!this.mConfig.nodeDefinitions.get(r.definitionName))continue;let s=this.buildCodeNode(e,r);for(let[l,c]of r.flowOutputs)if(c.connectedTo){let h=this.generateFlowBodyCode(e,c.connectedTo);s.body.set(l,{code:h})}else s.body.set(l,{code:""});let a=s.generateCode();n.push(a)}return n.join(`
`)}generateFlowBodyCode(e,t){let n=new Array,r=t;for(;r;){let o=this.findNodeByFlowPortId(e,r);if(!o||!this.mConfig.nodeDefinitions.get(o.definitionName))break;let a=this.buildCodeNode(e,o);for(let[c,h]of o.flowOutputs)if(h.connectedTo){let m=this.generateFlowBodyCode(e,h.connectedTo);a.body.set(c,{code:m})}else a.body.set(c,{code:""});let l=a.generateCode();n.push(l),r=null}return n.join(`
`)}buildCodeNode(e,t){let r=this.mConfig.nodeDefinitions.get(t.definitionName)?.codeGenerator??(()=>""),o=this.createNodeForCategory(t.category,r);for(let[s,a]of t.inputs){let l=this.resolveRerouteChain(e,a.connectedTo??a.valueId);o.inputs.set(s,{name:s,type:a.type,valueId:l})}for(let[s,a]of t.outputs)o.outputs.set(s,{name:s,type:a.type,valueId:a.valueId});for(let[s,a]of t.properties)o.properties.set(s,a);if(t.category==="getlocal"){let s=t.properties.get("variableName")??"",a=o.outputs.values().next().value;a&&s&&o.outputs.set(a.name,{name:a.name,type:a.type,valueId:s})}return o}createNodeForCategory(e,t){switch(e){case"comment":return new ir;case"input":return new sr;case"output":return new ar;case"value":return new cr(t);case"flow":return new ur(t);case"reroute":return new mr;case"getlocal":return new pr;case"setlocal":return new dr;default:return new tt(t)}}topologicalSort(e){let t=new Set,n=new Array,r=new Map;for(let s of e.nodes.values())r.set(s.id,new Set);for(let s of e.connections.values())if(s.kind==="data"){let a=r.get(s.targetNodeId);a&&a.add(s.sourceNodeId)}let o=s=>{if(t.has(s))return;t.add(s);let a=r.get(s);if(a)for(let c of a)o(c);let l=e.getNode(s);l&&n.push(l)};for(let s of e.nodes.keys())o(s);return n}findInputNodeValueId(e,t){for(let n of e.nodes.values())if(n.category==="input"&&n.definitionName===t){let r=n.outputs.values().next().value;if(r)return r.valueId}return t}findOutputNodeValueId(e,t){for(let n of e.nodes.values())if(n.category==="output"&&n.definitionName===t){let r=n.inputs.values().next().value;return r&&r.connectedTo?this.resolveRerouteChain(e,r.connectedTo):r?.valueId??t}return t}resolveRerouteChain(e,t){for(let n of e.nodes.values())for(let r of n.outputs.values())if(r.valueId===t&&n.category==="reroute"){let o=n.inputs.values().next().value;return o&&o.connectedTo?this.resolveRerouteChain(e,o.connectedTo):o?.valueId??t}return t}findNodeByFlowPortId(e,t){for(let n of e.nodes.values()){for(let r of n.flowInputs.values())if(r.id===t)return n;for(let r of n.flowOutputs.values())if(r.id===t)return n}return null}}});var Nn,Vs=p(()=>{Bs();Nn=class{mConfig;constructor(e){this.mConfig=e}serialize(e){let n=new kn(this.mConfig).generateProjectCode(e.functions),r=this.buildMetadata(e),s=`${this.mConfig.commentToken} #potatno ${JSON.stringify(r)}`;return`${n}
${s}`}serializeFunction(e){let n=new kn(this.mConfig).generateFunctionCode(e),r={functions:[this.serializeFunctionData(e)]},s=`${this.mConfig.commentToken} #potatno ${JSON.stringify(r)}`;return`${n}
${s}`}buildMetadata(e){let t=new Array;for(let n of e.functions.values())t.push(this.serializeFunctionData(n));return{functions:t}}serializeFunctionData(e){let t=new Array,n=new Array;for(let r of e.graph.nodes.values())t.push(this.serializeNode(r));for(let r of e.graph.connections.values())n.push(this.serializeConnection(r));return{id:e.id,name:e.name,label:e.label,system:e.system,editableByUser:e.editableByUser,inputs:[...e.inputs].map(r=>({name:r.name,type:r.type})),outputs:[...e.outputs].map(r=>({name:r.name,type:r.type})),imports:[...e.imports],nodes:t,connections:n}}serializeNode(e){let t=new Array;for(let[a,l]of e.inputs)t.push({name:a,type:l.type,id:l.id,valueId:l.valueId,connectedTo:l.connectedTo});let n=new Array;for(let[a,l]of e.outputs)n.push({name:a,type:l.type,id:l.id,valueId:l.valueId});let r=new Array;for(let[a,l]of e.flowInputs)r.push({name:a,id:l.id,connectedTo:l.connectedTo});let o=new Array;for(let[a,l]of e.flowOutputs)o.push({name:a,id:l.id,connectedTo:l.connectedTo});let s={};for(let[a,l]of e.properties)s[a]=l;return{id:e.id,type:e.definitionName,category:e.category,position:e.position,size:e.size,system:e.system,properties:s,inputs:t,outputs:n,flowInputs:r,flowOutputs:o}}serializeConnection(e){return{id:e.id,kind:e.kind,sourceNodeId:e.sourceNodeId,sourcePortId:e.sourcePortId,targetNodeId:e.targetNodeId,targetPortId:e.targetPortId,valid:e.valid}}}});var Wt,fo=p(()=>{Wt=class{mActiveFunctionId;mFunctions;get activeFunction(){return this.mFunctions.get(this.mActiveFunctionId)}get activeFunctionId(){return this.mActiveFunctionId}get functions(){return this.mFunctions}constructor(){this.mFunctions=new Map,this.mActiveFunctionId=""}addFunction(e){this.mFunctions.set(e.id,e),this.mActiveFunctionId||(this.mActiveFunctionId=e.id)}removeFunction(e){let t=this.mFunctions.get(e);if(!t||t.system)return!1;if(this.mFunctions.delete(e),this.mActiveFunctionId===e){let n=this.mFunctions.keys().next().value;this.mActiveFunctionId=n??""}return!0}setActiveFunction(e){return this.mFunctions.has(e)?(this.mActiveFunctionId=e,!0):!1}getFunction(e){return this.mFunctions.get(e)}}});var hr,js=p(()=>{xt();$t();co();uo();po();fo();hr=class{mConfig;constructor(e){this.mConfig=e}deserialize(e){let t=new Wt,n=this.parseMetadataComment(e);if(!n)return t;for(let o of n.functions){let s=this.reconstructFunction(o);this.reconstructNodes(s,o.nodes),this.restoreAllPortData(s,o.nodes),this.reconstructConnections(s,o.connections),t.addFunction(s)}let r=t.functions.keys().next().value;return r&&t.setActiveFunction(r),t}parseMetadataComment(e){let n=`${this.mConfig.commentToken} #potatno `,r=e.split(`
`);for(let o=r.length-1;o>=0;o--){let s=r[o].trim();if(s.startsWith(n)){let a=s.substring(n.length);try{return JSON.parse(a)}catch{return null}}}return null}reconstructFunction(e){let t=new Ct(e.id,e.name,e.label,e.system,e.editableByUser);return Array.isArray(e.inputs)&&t.setInputs(e.inputs),Array.isArray(e.outputs)&&t.setOutputs(e.outputs),Array.isArray(e.imports)&&t.setImports(e.imports),t}reconstructNodes(e,t){for(let n of t){let r=n.category,o=this.mConfig.nodeDefinitions.get(n.type);if(o){let s=new vt(n.id,o,n.position??{x:0,y:0},n.system??!1);if(n.size&&s.resizeTo(n.size.w,n.size.h),n.properties)for(let[a,l]of Object.entries(n.properties))s.properties.set(a,l);e.graph.addExistingNode(s)}else if(r==="input"||r==="output"){let s=(n.inputs??[]).map(h=>({name:h.name,type:h.type})),a=(n.outputs??[]).map(h=>({name:h.name,type:h.type})),l={name:n.type,category:r,inputs:s,outputs:a},c=new vt(n.id,l,n.position??{x:0,y:0},n.system??!0);if(n.size&&c.resizeTo(n.size.w,n.size.h),n.properties)for(let[h,m]of Object.entries(n.properties))c.properties.set(h,m);e.graph.addExistingNode(c)}}}restoreAllPortData(e,t){for(let n of t){let r=e.graph.getNode(n.id);if(r){if(Array.isArray(n.inputs))for(let o of n.inputs){let s=r.inputs.get(o.name);s&&o.connectedTo&&(s.connectedTo=o.connectedTo)}if(Array.isArray(n.flowInputs))for(let o of n.flowInputs){let s=r.flowInputs.get(o.name);s&&o.connectedTo&&(s.connectedTo=o.connectedTo)}if(Array.isArray(n.flowOutputs))for(let o of n.flowOutputs){let s=r.flowOutputs.get(o.name);s&&o.connectedTo&&(s.connectedTo=o.connectedTo)}}}}reconstructConnections(e,t){for(let n of t){let r=n.kind==="flow"?"flow":"data",o=new Tt(n.id,n.sourceNodeId,n.sourcePortId,n.targetNodeId,n.targetPortId,r);o.valid=n.valid??!0,e.graph.addExistingConnection(o)}}}});var An,yr,bo=p(()=>{An=class{description;mDefinition;mGraph;mNode;mPosition;mSystem;get node(){return this.mNode}constructor(e,t,n,r=!1){this.description=`Add node: ${t.name}`,this.mGraph=e,this.mDefinition=t,this.mPosition=n,this.mSystem=r,this.mNode=null}apply(){this.mNode?this.mGraph.addExistingNode(this.mNode):this.mNode=this.mGraph.addNode(this.mDefinition,this.mPosition,this.mSystem)}revert(){this.mNode&&this.mGraph.removeNode(this.mNode.id)}},yr=class{description;mGraph;mNodeId;mRemovedConnections;mRemovedNode;constructor(e,t){this.description="Remove node",this.mGraph=e,this.mNodeId=t,this.mRemovedNode=null,this.mRemovedConnections=new Array}apply(){this.mRemovedNode=this.mGraph.getNode(this.mNodeId)??null,this.mRemovedConnections=this.mGraph.removeNode(this.mNodeId)}revert(){if(this.mRemovedNode){this.mGraph.addExistingNode(this.mRemovedNode);for(let e of this.mRemovedConnections)this.mGraph.addExistingConnection(e)}}}});var Dn,Us=p(()=>{Dn=class{description;mNewValue;mNode;mOldValue;mPropertyName;constructor(e,t,n){this.description=`Change property: ${t}`,this.mNode=e,this.mPropertyName=t,this.mNewValue=n,this.mOldValue=e.properties.get(t)??""}apply(){this.mOldValue=this.mNode.properties.get(this.mPropertyName)??"",this.mNode.properties.set(this.mPropertyName,this.mNewValue)}revert(){this.mOldValue===""?this.mNode.properties.delete(this.mPropertyName):this.mNode.properties.set(this.mPropertyName,this.mOldValue)}}});var Sn,zs=p(()=>{Sn=class{description;mActions;constructor(e,t){this.description=e,this.mActions=t}apply(){for(let e of this.mActions)e.apply()}revert(){for(let e=this.mActions.length-1;e>=0;e--)this.mActions[e].revert()}}});var Hs,$s=p(()=>{Hs=`:host {\r
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
`});var Xs,Ks=p(()=>{Xs=`<div class="search-wrapper">\r
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
</div>`});var Ws,Zs,Ys,_s,nt,To,Pt,vo=p(()=>{pe();xt();$s();Ks();_s=[j({selector:"potatno-node-library",template:Xs,style:Hs})];Pt=class extends(Ys=I,Zs=[D("node-drag-start")],Ws=[P],Ys){constructor(){super(...arguments);u(nt,5,this);f(this,"mNodeDefinitions",[]);f(this,"mCachedFilteredGroups",[]);k(this,To,u(nt,8,this)),u(nt,11,this);f(this,"mSearchQuery","");f(this,"mCollapsedCategories",{})}set nodeDefinitions(t){this.mNodeDefinitions=t,this.rebuildFilteredGroups()}get nodeDefinitions(){return this.mNodeDefinitions}get filteredGroups(){return this.mCachedFilteredGroups}rebuildFilteredGroups(){let t=this.mSearchQuery.toLowerCase(),n=new Map;for(let s of this.mNodeDefinitions){if(t&&!s.name.toLowerCase().includes(t))continue;let a=n.get(s.category);a||(a=[],n.set(s.category,a)),a.push(s)}let r=[],o=Object.values(Qe);for(let s of o){let a=n.get(s);if(a&&a.length>0){let l=Xt.get(s);r.push({category:s,icon:l.icon,label:l.label,cssColor:l.cssColor,nodes:a})}}this.mCachedFilteredGroups=r}onSearchInput(t){this.mSearchQuery=t.target.value,this.rebuildFilteredGroups()}toggleCategory(t){this.mCollapsedCategories[t]=!this.mCollapsedCategories[t],this.rebuildFilteredGroups()}isCategoryCollapsed(t){return!!this.mCollapsedCategories[t]}getToggleClass(t){return this.mCollapsedCategories[t]?"category-toggle collapsed":"category-toggle"}onNodeMouseDown(t){this.mNodeDragStart.dispatchEvent(t)}};nt=E(Ys),To=new WeakMap,d(nt,4,"mNodeDragStart",Zs,Pt,To),d(nt,3,"nodeDefinitions",Ws,Pt),Pt=d(nt,0,"PotatnoNodeLibrary",_s,Pt),u(nt,1,Pt)});var Js,qs=p(()=>{Js=`:host {\r
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
`});var ea,Qs=p(()=>{ea=`<div class="function-list-content">\r
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
</div>`});var ta,na,ra,oa,ia,sa,aa,Q,Co,xo,Po,Re,Io=p(()=>{pe();qs();Qs();aa=[j({selector:"potatno-function-list",template:ea,style:Js})];Re=class extends(sa=I,ia=[P],oa=[P],ra=[D("function-select")],na=[D("function-add")],ta=[D("function-delete")],sa){constructor(){super(...arguments);f(this,"functions",u(Q,20,this,[])),u(Q,23,this);f(this,"activeFunctionId",u(Q,24,this,"")),u(Q,27,this);k(this,Co,u(Q,8,this)),u(Q,11,this);k(this,xo,u(Q,12,this)),u(Q,15,this);k(this,Po,u(Q,16,this)),u(Q,19,this)}getEntryClass(t){return t===this.activeFunctionId?"function-entry active":"function-entry"}onFunctionSelect(t){this.mFunctionSelect.dispatchEvent(t)}onFunctionAdd(){this.mFunctionAdd.dispatchEvent(void 0)}onFunctionDelete(t,n){t.stopPropagation(),this.mFunctionDelete.dispatchEvent(n)}};Q=E(sa),Co=new WeakMap,xo=new WeakMap,Po=new WeakMap,d(Q,4,"mFunctionSelect",ra,Re,Co),d(Q,4,"mFunctionAdd",na,Re,xo),d(Q,4,"mFunctionDelete",ta,Re,Po),d(Q,5,"functions",ia,Re),d(Q,5,"activeFunctionId",oa,Re),Re=d(Q,0,"PotatnoFunctionList",aa,Re),u(Q,1,Re)});var ca,la=p(()=>{ca=`:host {\r
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
`});var pa,ua=p(()=>{pa=`<div class="tab-bar">\r
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
</div>`});var da,ma,ha,ya,ga,fa,ba,Ta,va,H,wo,Eo,ko,No,Ee,Ca=p(()=>{pe();la();ua();vo();Io();va=[j({selector:"potatno-panel-left",template:pa,style:ca})];Ee=class extends(Ta=I,ba=[P],fa=[P],ga=[P],ya=[D("node-drag-start")],ha=[D("function-select")],ma=[D("function-add")],da=[D("function-delete")],Ta){constructor(){super(...arguments);f(this,"nodeDefinitions",u(H,24,this,[])),u(H,27,this);f(this,"functions",u(H,28,this,[])),u(H,31,this);f(this,"activeFunctionId",u(H,32,this,"")),u(H,35,this);k(this,wo,u(H,8,this)),u(H,11,this);k(this,Eo,u(H,12,this)),u(H,15,this);k(this,ko,u(H,16,this)),u(H,19,this);k(this,No,u(H,20,this)),u(H,23,this);f(this,"mActiveTabIndex",0)}get activeTabIndex(){return this.mActiveTabIndex}getTabClass(t){return t===this.mActiveTabIndex?"tab-button active":"tab-button"}onTabClick(t){this.mActiveTabIndex=t}onNodeDragStart(t){this.mNodeDragStart.dispatchEvent(t.value)}onFunctionSelect(t){this.mFunctionSelect.dispatchEvent(t.value)}onFunctionAdd(t){this.mFunctionAdd.dispatchEvent(void 0)}onFunctionDelete(t){this.mFunctionDelete.dispatchEvent(t.value)}};H=E(Ta),wo=new WeakMap,Eo=new WeakMap,ko=new WeakMap,No=new WeakMap,d(H,4,"mNodeDragStart",ya,Ee,wo),d(H,4,"mFunctionSelect",ha,Ee,Eo),d(H,4,"mFunctionAdd",ma,Ee,ko),d(H,4,"mFunctionDelete",da,Ee,No),d(H,5,"nodeDefinitions",ba,Ee),d(H,5,"functions",fa,Ee),d(H,5,"activeFunctionId",ga,Ee),Ee=d(H,0,"PotatnoPanelLeft",va,Ee),u(H,1,Ee)});var Pa,xa=p(()=>{Pa=`:host {\r
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
`});var wa,Ia=p(()=>{wa=`<div class="properties-header">Properties</div>\r
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
`});var Ea,ka,Na,Aa,Da,Sa,La,Ma,Ra,Oa,Fa,U,Ao,Te,Ga=p(()=>{pe();xa();Ia();Fa=[j({selector:"potatno-panel-properties",template:wa,style:Pa})];Te=class extends(Oa=I,Ra=[P],Ma=[P],La=[P],Sa=[P],Da=[P],Aa=[P],Na=[P],ka=[P],Ea=[D("properties-change")],Oa){constructor(){super(...arguments);u(U,5,this);f(this,"functionName",u(U,12,this,"")),u(U,15,this);f(this,"functionInputs",u(U,16,this,[])),u(U,19,this);f(this,"functionOutputs",u(U,20,this,[])),u(U,23,this);f(this,"mFunctionImports",[]);f(this,"isSystem",u(U,24,this,!1)),u(U,27,this);f(this,"editableByUser",u(U,28,this,!1)),u(U,31,this);f(this,"mAvailableImports",[]);f(this,"mAvailableTypes",[]);f(this,"mCachedUnusedImports",[]);f(this,"mSelectedImport","");k(this,Ao,u(U,8,this)),u(U,11,this)}set functionImports(t){this.mFunctionImports=t,this.rebuildUnusedImports()}get functionImports(){return this.mFunctionImports}get nameDisabled(){return this.isSystem}get portsDisabled(){return this.isSystem&&!this.editableByUser}set availableImports(t){this.mAvailableImports=t,this.rebuildUnusedImports()}get availableImports(){return this.mAvailableImports}set availableTypes(t){this.mAvailableTypes=t}get availableTypes(){return this.mAvailableTypes}validateName(t){return/^[a-zA-Z][a-zA-Z0-9_]*$/.test(t)}isNameDuplicate(t,n,r){if(n!=="function"&&t===this.functionName)return!0;for(let o=0;o<this.functionInputs.length;o++)if(!(n==="input"&&o===r)&&this.functionInputs[o].name===t)return!0;for(let o=0;o<this.functionOutputs.length;o++)if(!(n==="output"&&o===r)&&this.functionOutputs[o].name===t)return!0;return!1}onNameChange(t){let n=t.target,r=n.value,o=!this.validateName(r)||this.isNameDuplicate(r,"function");n.style.borderColor=o?"var(--pn-accent-danger)":"",this.functionName=r,this.mPropertiesChange.dispatchEvent({name:r})}onInputNameChange(t,n){let r=n.target,o=r.value,s=!this.validateName(o)||this.isNameDuplicate(o,"input",t);r.style.borderColor=s?"var(--pn-accent-danger)":"";let a=[...this.functionInputs];a[t]={...a[t],name:o},this.functionInputs=a,this.mPropertiesChange.dispatchEvent({inputs:a})}onInputTypeChange(t,n){let r=n.target.value,o=[...this.functionInputs];o[t]={...o[t],type:r},this.functionInputs=o,this.mPropertiesChange.dispatchEvent({inputs:o})}onOutputNameChange(t,n){let r=n.target,o=r.value,s=!this.validateName(o)||this.isNameDuplicate(o,"output",t);r.style.borderColor=s?"var(--pn-accent-danger)":"";let a=[...this.functionOutputs];a[t]={...a[t],name:o},this.functionOutputs=a,this.mPropertiesChange.dispatchEvent({outputs:a})}onOutputTypeChange(t,n){let r=n.target.value,o=[...this.functionOutputs];o[t]={...o[t],type:r},this.functionOutputs=o,this.mPropertiesChange.dispatchEvent({outputs:o})}onAddInput(){let t=this.mAvailableTypes.length>0?this.mAvailableTypes[0]:"number",n=[...this.functionInputs,{name:"new_input",type:t}];this.functionInputs=n,this.mPropertiesChange.dispatchEvent({inputs:n})}onDeleteInput(t){let n=[...this.functionInputs];n.splice(t,1),this.functionInputs=n,this.mPropertiesChange.dispatchEvent({inputs:n})}onAddOutput(){let t=this.mAvailableTypes.length>0?this.mAvailableTypes[0]:"number",n=[...this.functionOutputs,{name:"new_output",type:t}];this.functionOutputs=n,this.mPropertiesChange.dispatchEvent({outputs:n})}onDeleteOutput(t){let n=[...this.functionOutputs];n.splice(t,1),this.functionOutputs=n,this.mPropertiesChange.dispatchEvent({outputs:n})}get unusedImports(){return this.mCachedUnusedImports}onImportSelectChange(t){this.mSelectedImport=t.target.value}onAddSelectedImport(){let t=this.mSelectedImport||(this.mCachedUnusedImports.length>0?this.mCachedUnusedImports[0]:"");if(!t)return;let n=[...this.mFunctionImports,t];this.functionImports=n,this.mSelectedImport="",this.mPropertiesChange.dispatchEvent({imports:n})}onDeleteImport(t){let n=[...this.mFunctionImports];n.splice(t,1),this.functionImports=n,this.mPropertiesChange.dispatchEvent({imports:n})}rebuildUnusedImports(){let t=new Set(this.mFunctionImports);this.mCachedUnusedImports=this.mAvailableImports.filter(n=>!t.has(n))}};U=E(Oa),Ao=new WeakMap,d(U,3,"functionImports",Sa,Te),d(U,3,"availableImports",Na,Te),d(U,3,"availableTypes",ka,Te),d(U,4,"mPropertiesChange",Ea,Te,Ao),d(U,5,"functionName",Ra,Te),d(U,5,"functionInputs",Ma,Te),d(U,5,"functionOutputs",La,Te),d(U,5,"isSystem",Da,Te),d(U,5,"editableByUser",Aa,Te),Te=d(U,0,"PotatnoPanelProperties",Fa,Te),u(U,1,Te)});var Va,Ba=p(()=>{Va=`:host {\r
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
`});var Ua,ja=p(()=>{Ua=`<div class="resize-handle" (pointerdown)="this.onResizePointerDown($event)"></div>\r
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
`});var za,$a,Ha,Ka,Xa,Wa,ve,Do,So,$e,Za=p(()=>{pe();Ba();ja();Wa=[j({selector:"potatno-preview",template:Ua,style:Va})];$e=class extends(Xa=I,Ka=[P,de("PreviewContent")],Ha=[de("PreviewContainer")],$a=[P],za=[P],Xa){constructor(){super(...arguments);u(ve,5,this);k(this,Do,u(ve,8,this)),u(ve,11,this);k(this,So,u(ve,12,this)),u(ve,15,this);f(this,"errors",u(ve,16,this,[])),u(ve,19,this);f(this,"mDragging",!1);f(this,"mStartX",0);f(this,"mStartY",0);f(this,"mStartWidth",0);f(this,"mStartHeight",0)}get hasErrors(){return this.errors.length>0}setContent(t){let n=this.contentElement;for(;n.firstChild;)n.removeChild(n.firstChild);n.appendChild(t)}onResizePointerDown(t){t.preventDefault(),t.stopPropagation(),this.mDragging=!0,this.mStartX=t.clientX,this.mStartY=t.clientY;let n=this.containerElement;if(!n)return;this.mStartWidth=n.offsetWidth,this.mStartHeight=n.offsetHeight,t.target.setPointerCapture(t.pointerId);let r=s=>{if(!this.mDragging)return;let a=this.mStartX-s.clientX,l=this.mStartY-s.clientY,c=Math.max(200,this.mStartWidth+a),h=Math.max(150,this.mStartHeight+l);n.style.width=c+"px",n.style.height=h+"px"},o=s=>{this.mDragging=!1,s.target.releasePointerCapture(s.pointerId),document.removeEventListener("pointermove",r),document.removeEventListener("pointerup",o)};document.addEventListener("pointermove",r),document.addEventListener("pointerup",o)}};ve=E(Xa),Do=new WeakMap,So=new WeakMap,d(ve,4,"contentElement",Ka,$e,Do),d(ve,4,"containerElement",Ha,$e,So),d(ve,1,"setContent",za,$e),d(ve,5,"errors",$a,$e),$e=d(ve,0,"PotatnoPreview",Wa,$e),u(ve,1,$e)});var _a,Ya=p(()=>{_a=`:host {\r
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
`});var Ja,qa=p(()=>{Ja=`<div #viewport class="viewport" (pointerdown)="this.onPointerDown($event)" (pointermove)="this.onPointerMove($event)" (pointerup)="this.onPointerUp($event)" (wheel)="this.onWheel($event)" (contextmenu)="this.onContextMenu($event)" (keydown)="this.onKeyDown($event)" tabindex="0">\r
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
`});var Qa,el,tl,nl,rl,ol,il,sl,al,ll,cl,ul,pl,G,Lo,Mo,Ro,Oo,Fo,Go,Bo,ie,dl=p(()=>{pe();mo();go();Ya();qa();pl=[j({selector:"potatno-canvas",template:Ja,style:_a})];ie=class extends(ul=I,cl=[P],ll=[P],al=[P],sl=[P],il=[D("canvas-connect")],ol=[D("canvas-delete")],rl=[D("canvas-node-move")],nl=[D("canvas-node-select")],tl=[D("canvas-select")],el=[de("svgLayer")],Qa=[de("viewport")],ul){constructor(){super();f(this,"connections",u(G,36,this,[])),u(G,39,this);f(this,"gridSize",u(G,40,this,20)),u(G,43,this);f(this,"nodes",u(G,44,this,[])),u(G,47,this);f(this,"selectedNodeIds",u(G,48,this,new Set)),u(G,51,this);k(this,Lo,u(G,8,this)),u(G,11,this);k(this,Mo,u(G,12,this)),u(G,15,this);k(this,Ro,u(G,16,this)),u(G,19,this);k(this,Oo,u(G,20,this)),u(G,23,this);k(this,Fo,u(G,24,this)),u(G,27,this);k(this,Go,u(G,28,this)),u(G,31,this);k(this,Bo,u(G,32,this)),u(G,35,this);f(this,"mDragNodeId",null);f(this,"mDragStartWorldX",0);f(this,"mDragStartWorldY",0);f(this,"mInteraction");f(this,"mMode","idle");f(this,"mPointerId",null);f(this,"mRenderer");f(this,"mWireColor","var(--pn-accent-primary)");f(this,"mWirePortKind","");f(this,"mWireSourceNodeId","");f(this,"mWireSourcePortId","");f(this,"mWireStartWorld",{x:0,y:0});this.mInteraction=new Ht(this.gridSize),this.mRenderer=new Kt}get gridStyle(){let t=`transform: ${this.mInteraction.getTransformCss()}`,n=this.mInteraction.getGridBackgroundCss();return`${t}; ${n}`}get selectionBoxStyle(){let t=this.mInteraction.selectionStart,n=this.mInteraction.selectionEnd;if(!t||!n)return"display: none";let r=this.mInteraction.worldToScreen(t.x,t.y),o=this.mInteraction.worldToScreen(n.x,n.y),s=Math.min(r.x,o.x),a=Math.min(r.y,o.y),l=Math.abs(o.x-r.x),c=Math.abs(o.y-r.y);return`left: ${s}px; top: ${a}px; width: ${l}px; height: ${c}px`}get showSelectionBox(){return this.mMode==="selectingBox"&&this.mInteraction.selectionStart!==null&&this.mInteraction.selectionEnd!==null}onContextMenu(t){t.preventDefault()}onKeyDown(t){(t.key==="Delete"||t.key==="Backspace")&&this.selectedNodeIds.size>0&&this.mDeleteEvent.dispatchEvent({nodeIds:new Set(this.selectedNodeIds)})}onPointerDown(t){if(this.mMode!=="idle")return;let n=t.target,r=this.mViewport.getBoundingClientRect(),o=t.clientX-r.left,s=t.clientY-r.top;if(t.button===1){this.mMode="panning",this.mPointerId=t.pointerId,this.mViewport.setPointerCapture(t.pointerId),this.mViewport.classList.add("panning"),t.preventDefault();return}if(t.button===0){let a=n.closest("[data-port-id]");if(a){this.beginWireDrag(a,o,s),this.mPointerId=t.pointerId,this.mViewport.setPointerCapture(t.pointerId),t.preventDefault();return}let l=n.closest("[data-node-id]");if(l){this.beginNodeDrag(l,o,s,t.shiftKey||t.ctrlKey||t.metaKey),this.mPointerId=t.pointerId,this.mViewport.setPointerCapture(t.pointerId),t.preventDefault();return}this.beginSelectionBox(o,s),this.mPointerId=t.pointerId,this.mViewport.setPointerCapture(t.pointerId),t.preventDefault()}}onPointerMove(t){if(this.mPointerId!==t.pointerId)return;let n=this.mViewport.getBoundingClientRect(),r=t.clientX-n.left,o=t.clientY-n.top;switch(this.mMode){case"panning":this.mInteraction.pan(t.movementX,t.movementY),this.updateConnections();break;case"draggingNode":this.updateNodeDrag(r,o);break;case"draggingWire":this.updateWireDrag(r,o);break;case"selectingBox":this.updateSelectionBox(r,o);break}}onPointerUp(t){if(this.mPointerId!==t.pointerId)return;let n=t.target;switch(this.mMode){case"panning":this.mViewport.classList.remove("panning");break;case"draggingNode":this.endNodeDrag();break;case"draggingWire":this.endWireDrag(n);break;case"selectingBox":this.endSelectionBox();break}this.mPointerId!==null&&this.mViewport.releasePointerCapture(this.mPointerId),this.mPointerId=null,this.mMode="idle"}onWheel(t){t.preventDefault();let n=this.mViewport.getBoundingClientRect(),r=t.clientX-n.left,o=t.clientY-n.top;this.mInteraction.zoomAt(r,o,t.deltaY),this.updateConnections()}updateConnections(){this.mRenderer.renderConnections(this.mSvgLayer,this.connections)}beginNodeDrag(t,n,r,o){let s=t.dataset.nodeId;if(!s)return;this.mMode="draggingNode",this.mDragNodeId=s;let a=this.mInteraction.screenToWorld(n,r);this.mDragStartWorldX=a.x,this.mDragStartWorldY=a.y,this.mNodeSelectEvent.dispatchEvent({nodeId:s,additive:o})}beginSelectionBox(t,n){this.mMode="selectingBox";let r=this.mInteraction.screenToWorld(t,n);this.mInteraction.setSelectionStart(r.x,r.y),this.mInteraction.setSelectionEnd(r.x,r.y)}beginWireDrag(t,n,r){this.mMode="draggingWire",this.mWireSourceNodeId=t.dataset.nodeId??"",this.mWireSourcePortId=t.dataset.portId??"",this.mWirePortKind=t.dataset.portKind??"",this.mWireColor=t.dataset.portColor??"var(--pn-accent-primary)";let o=this.mInteraction.screenToWorld(n,r);this.mWireStartWorld={x:o.x,y:o.y}}endNodeDrag(){if(!this.mDragNodeId)return;let t=this.nodes.find(n=>n.id===this.mDragNodeId);if(t){let n=this.mInteraction.snapToGrid(t.x,t.y);this.mNodeMoveEvent.dispatchEvent({nodeId:this.mDragNodeId,newX:n.x,newY:n.y})}this.mDragNodeId=null}endSelectionBox(){let t=this.mInteraction.selectionStart,n=this.mInteraction.selectionEnd;if(t&&n){let r=Math.min(t.x,n.x),o=Math.min(t.y,n.y),s=Math.max(t.x,n.x),a=Math.max(t.y,n.y),l=new Set;for(let c of this.nodes){let h=c.x+c.width,m=c.y+c.height;c.x<s&&h>r&&c.y<a&&m>o&&l.add(c.id)}this.mSelectEvent.dispatchEvent({nodeIds:l})}this.mInteraction.clearSelection()}endWireDrag(t){this.mRenderer.clearTempConnection(this.mSvgLayer);let n=t.closest("[data-port-id]");if(n){let r=n.dataset.nodeId??"",o=n.dataset.portId??"";r&&o&&(r!==this.mWireSourceNodeId||o!==this.mWireSourcePortId)&&this.mConnectEvent.dispatchEvent({sourceNodeId:this.mWireSourceNodeId,sourcePortId:this.mWireSourcePortId,targetNodeId:r,targetPortId:o,portKind:this.mWirePortKind})}this.mWireSourceNodeId="",this.mWireSourcePortId="",this.mWirePortKind=""}updateNodeDrag(t,n){if(!this.mDragNodeId)return;let r=this.mInteraction.screenToWorld(t,n),o=r.x-this.mDragStartWorldX,s=r.y-this.mDragStartWorldY;this.mDragStartWorldX=r.x,this.mDragStartWorldY=r.y;let a=this.nodes.find(l=>l.id===this.mDragNodeId);a&&this.mNodeMoveEvent.dispatchEvent({nodeId:this.mDragNodeId,newX:a.x+o,newY:a.y+s}),this.updateConnections()}updateSelectionBox(t,n){let r=this.mInteraction.screenToWorld(t,n);this.mInteraction.setSelectionEnd(r.x,r.y)}updateWireDrag(t,n){let r=this.mInteraction.screenToWorld(t,n);this.mRenderer.renderTempConnection(this.mSvgLayer,this.mWireStartWorld,r,this.mWireColor)}};G=E(ul),Lo=new WeakMap,Mo=new WeakMap,Ro=new WeakMap,Oo=new WeakMap,Fo=new WeakMap,Go=new WeakMap,Bo=new WeakMap,d(G,4,"mConnectEvent",il,ie,Lo),d(G,4,"mDeleteEvent",ol,ie,Mo),d(G,4,"mNodeMoveEvent",rl,ie,Ro),d(G,4,"mNodeSelectEvent",nl,ie,Oo),d(G,4,"mSelectEvent",tl,ie,Fo),d(G,4,"mSvgLayer",el,ie,Go),d(G,4,"mViewport",Qa,ie,Bo),d(G,5,"connections",cl,ie),d(G,5,"gridSize",ll,ie),d(G,5,"nodes",al,ie),d(G,5,"selectedNodeIds",sl,ie),ie=d(G,0,"PotatnoCanvas",pl,ie),u(G,1,ie)});var hl,ml=p(()=>{hl=`:host {\r
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
`});var gl,yl=p(()=>{gl=`$if(this.nodeData) {\r
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
`});var bl,fl=p(()=>{bl=`:host {\r
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
`});var vl,Tl=p(()=>{vl=`<div [className]="this.portWrapperClasses" [title]="this.type">\r
    <div #portCircle [className]="this.portCircleClasses" style="--port-color: {{this.portColor}}"\r
         (pointerdown)="this.onPointerDown($event)"\r
         (pointerenter)="this.onPointerEnter($event)"\r
         (pointerleave)="this.onPointerLeave($event)">\r
    </div>\r
    <span class="port-label">{{this.name}}</span>\r
</div>\r
`});var Cl,xl,Pl,Il,wl,El,kl,Nl,Al,Dl,Sl,Ll,Ml,Rl,R,Vo,jo,Uo,zo,te,$o=p(()=>{pe();fl();Tl();Rl=[j({selector:"potatno-port",template:vl,style:bl})];te=class extends(Ml=I,Ll=[P],Sl=[P],Dl=[P],Al=[P],Nl=[P],kl=[P],El=[P],wl=[P],Il=[D("port-drag-start")],Pl=[D("port-hover")],xl=[D("port-leave")],Cl=[de("portCircle")],Ml){constructor(){super(...arguments);f(this,"name",u(R,24,this,"")),u(R,27,this);f(this,"type",u(R,28,this,"")),u(R,31,this);f(this,"portId",u(R,32,this,"")),u(R,35,this);f(this,"nodeId",u(R,36,this,"")),u(R,39,this);f(this,"direction",u(R,40,this,"input")),u(R,43,this);f(this,"connected",u(R,44,this,!1)),u(R,47,this);f(this,"invalid",u(R,48,this,!1)),u(R,51,this);f(this,"portKind",u(R,52,this,"data")),u(R,55,this);k(this,Vo,u(R,8,this)),u(R,11,this);k(this,jo,u(R,12,this)),u(R,15,this);k(this,Uo,u(R,16,this)),u(R,19,this);k(this,zo,u(R,20,this)),u(R,23,this)}get portWrapperClasses(){return this.direction==="output"?"port-wrapper direction-output":"port-wrapper direction-input"}get portCircleClasses(){let t=["port-circle"];return this.connected?t.push("connected"):t.push("disconnected"),this.invalid&&t.push("invalid"),t.push(this.direction==="output"?"direction-output":"direction-input"),t.join(" ")}get portColor(){return this.portKind==="flow"?"var(--pn-text-primary)":this.getTypeColor(this.type)}onPointerDown(t){t.stopPropagation(),t.preventDefault(),this.mPortDragStart.dispatchEvent({nodeId:this.nodeId,portId:this.portId,portKind:this.portKind,direction:this.direction,type:this.type,element:this.portCircleElement})}onPointerEnter(t){this.mPortHover.dispatchEvent({nodeId:this.nodeId,portId:this.portId,portKind:this.portKind,direction:this.direction,type:this.type,element:this.portCircleElement})}onPointerLeave(t){this.mPortLeave.dispatchEvent(void 0)}getTypeColor(t){let n=0;for(let s=0;s<t.length;s++)n=t.charCodeAt(s)+((n<<5)-n);return`hsl(${Math.abs(n)%256*137.508%360}, 70%, 60%)`}};R=E(Ml),Vo=new WeakMap,jo=new WeakMap,Uo=new WeakMap,zo=new WeakMap,d(R,4,"mPortDragStart",Il,te,Vo),d(R,4,"mPortHover",Pl,te,jo),d(R,4,"mPortLeave",xl,te,Uo),d(R,4,"portCircleElement",Cl,te,zo),d(R,5,"name",Ll,te),d(R,5,"type",Sl,te),d(R,5,"portId",Dl,te),d(R,5,"nodeId",Al,te),d(R,5,"direction",Nl,te),d(R,5,"connected",kl,te),d(R,5,"invalid",El,te),d(R,5,"portKind",wl,te),te=d(R,0,"PotatnoPortComponent",Rl,te),u(R,1,te)});var Ol,Fl,Gl,Bl,Vl,jl,Ul,zl,$l,Hl,Kl,Xl,Wl,Zl,O,Ho,Ko,Xo,Wo,Zo,Yo,_o,qo,Jo,ne,Yl=p(()=>{pe();xt();ml();yl();$o();Zl=[j({selector:"potatno-node",template:gl,style:hl})];ne=class extends(Wl=I,Xl=[P],Kl=[P],Hl=[P],$l=[D("node-select")],zl=[D("node-drag-start")],Ul=[D("port-drag-start")],jl=[D("port-hover")],Vl=[D("port-leave")],Bl=[D("open-function")],Gl=[D("value-change")],Fl=[D("comment-change")],Ol=[D("resize-start")],Wl){constructor(){super(...arguments);f(this,"nodeData",u(O,44,this,null)),u(O,47,this);f(this,"selected",u(O,48,this,!1)),u(O,51,this);f(this,"gridSize",u(O,52,this,20)),u(O,55,this);k(this,Ho,u(O,8,this)),u(O,11,this);k(this,Ko,u(O,12,this)),u(O,15,this);k(this,Xo,u(O,16,this)),u(O,19,this);k(this,Wo,u(O,20,this)),u(O,23,this);k(this,Zo,u(O,24,this)),u(O,27,this);k(this,Yo,u(O,28,this)),u(O,31,this);k(this,_o,u(O,32,this)),u(O,35,this);k(this,qo,u(O,36,this)),u(O,39,this);k(this,Jo,u(O,40,this)),u(O,43,this)}get nodeStyle(){return this.nodeData?`left: ${this.nodeData.position.x*this.gridSize}px; top: ${this.nodeData.position.y*this.gridSize}px; width: ${this.nodeData.size.w*this.gridSize}px;`:""}get nodeId(){return this.nodeData?.id??""}get selectedClass(){return this.selected?"selected":""}get isComment(){return this.nodeData?.category==="comment"}get isReroute(){return this.nodeData?.category==="reroute"}get commentSizeStyle(){return this.nodeData?`height: ${this.nodeData.size.h*this.gridSize}px;`:""}get isValue(){return this.nodeData?.category==="value"}get isFunction(){return this.nodeData?.category==="function"}get showOpenButton(){return!1}get inputPorts(){return this.nodeData?.inputs??[]}get outputPorts(){return this.nodeData?.outputs??[]}get flowInputPorts(){return this.nodeData?.flowInputs??[]}get flowOutputPorts(){return this.nodeData?.flowOutputs??[]}onNodePointerDown(t){t.target.tagName?.toLowerCase()!=="potatno-port"&&(this.mNodeSelect.dispatchEvent({nodeId:this.nodeId,shiftKey:t.shiftKey}),this.mNodeDragStart.dispatchEvent({nodeId:this.nodeId,startX:t.clientX,startY:t.clientY}))}onPortDragStart(t){this.mPortDragStart.dispatchEvent(t.value)}onPortHover(t){this.mPortHover.dispatchEvent(t.value)}onPortLeave(t){this.mPortLeave.dispatchEvent(void 0)}onOpenFunction(t){t.stopPropagation(),this.mOpenFunction.dispatchEvent({definitionName:this.nodeData?.definitionName??""})}onValueInput(t){let n=t.target;this.mValueChange.dispatchEvent({nodeId:this.nodeId,property:"value",value:n.value})}onCommentInput(t){let n=t.target;this.mCommentChange.dispatchEvent({nodeId:this.nodeId,text:n.value})}onResizeStart(t){t.stopPropagation(),t.preventDefault(),this.mResizeStart.dispatchEvent({nodeId:this.nodeId,startX:t.clientX,startY:t.clientY})}};O=E(Wl),Ho=new WeakMap,Ko=new WeakMap,Xo=new WeakMap,Wo=new WeakMap,Zo=new WeakMap,Yo=new WeakMap,_o=new WeakMap,qo=new WeakMap,Jo=new WeakMap,d(O,4,"mNodeSelect",$l,ne,Ho),d(O,4,"mNodeDragStart",zl,ne,Ko),d(O,4,"mPortDragStart",Ul,ne,Xo),d(O,4,"mPortHover",jl,ne,Wo),d(O,4,"mPortLeave",Vl,ne,Zo),d(O,4,"mOpenFunction",Bl,ne,Yo),d(O,4,"mValueChange",Gl,ne,_o),d(O,4,"mCommentChange",Fl,ne,qo),d(O,4,"mResizeStart",Ol,ne,Jo),d(O,5,"nodeData",Xl,ne),d(O,5,"selected",Kl,ne),d(O,5,"gridSize",Hl,ne),ne=d(O,0,"PotatnoNodeComponent",Zl,ne),u(O,1,ne)});var ql,_l=p(()=>{ql=`.tabs-header {\r
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
`});var Ql,Jl=p(()=>{Ql=`<div class="tabs-header">\r
    $for(tab of this.tabs; index = $index) {\r
        <button [className]="this.getTabClass(this.index)" (click)="this.onTabClick(this.index)">{{this.tab}}</button>\r
    }\r
</div>\r
<div class="tabs-content">\r
    $slot\r
</div>\r
`});var ec,tc,nc,rc,oc,ke,Qo,rt,ic=p(()=>{pe();_l();Jl();oc=[j({selector:"potatno-tabs",template:Ql,style:ql})];rt=class extends(rc=I,nc=[P],tc=[P],ec=[D("tab-change")],rc){constructor(){super(...arguments);f(this,"tabs",u(ke,12,this,[])),u(ke,15,this);f(this,"activeIndex",u(ke,16,this,0)),u(ke,19,this);k(this,Qo,u(ke,8,this)),u(ke,11,this)}getTabClass(t){return t===this.activeIndex?"tab-button active":"tab-button"}onTabClick(t){this.activeIndex=t,this.mTabChange.dispatchEvent(t)}};ke=E(rc),Qo=new WeakMap,d(ke,4,"mTabChange",ec,rt,Qo),d(ke,5,"tabs",nc,rt),d(ke,5,"activeIndex",tc,rt),rt=d(ke,0,"PotatnoTabs",oc,rt),u(ke,1,rt)});var ac,sc=p(()=>{ac=`.resize-handle {\r
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
`});var cc,lc=p(()=>{cc=`<div [className]="this.getHandleClass()" (pointerdown)="this.onPointerDown($event)"></div>\r
`});var uc,pc,dc,mc,He,ei,It,hc=p(()=>{pe();sc();lc();mc=[j({selector:"potatno-resize-handle",template:cc,style:ac})];It=class extends(dc=I,pc=[P],uc=[D("resize")],dc){constructor(){super(...arguments);f(this,"direction",u(He,12,this,"vertical")),u(He,15,this);k(this,ei,u(He,8,this)),u(He,11,this);f(this,"mDragging",!1);f(this,"mStartPosition",0)}getHandleClass(){return`resize-handle ${this.direction}`}onPointerDown(t){t.preventDefault(),this.mDragging=!0,this.mStartPosition=this.direction==="vertical"?t.clientX:t.clientY,t.target.setPointerCapture(t.pointerId);let n=o=>{if(!this.mDragging)return;let s=this.direction==="vertical"?o.clientX:o.clientY,a=s-this.mStartPosition;this.mStartPosition=s,this.mResize.dispatchEvent({delta:a})},r=o=>{this.mDragging=!1,o.target.releasePointerCapture(o.pointerId),document.removeEventListener("pointermove",n),document.removeEventListener("pointerup",r)};document.addEventListener("pointermove",n),document.addEventListener("pointerup",r)}};He=E(dc),ei=new WeakMap,d(He,4,"mResize",uc,It,ei),d(He,5,"direction",pc,It),It=d(He,0,"PotatnoResizeHandle",mc,It),u(He,1,It)});var gc,yc=p(()=>{gc=`.search-wrapper {\r
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
`});var bc,fc=p(()=>{bc=`<div class="search-wrapper">\r
    <svg class="search-icon" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">\r
        <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" stroke-width="1.5"/>\r
        <line x1="10.5" y1="10.5" x2="14.5" y2="14.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>\r
    </svg>\r
    <input class="search-field" type="text" [placeholder]="this.placeholder" [value]="this.value" (input)="this.onInput($event)"/>\r
</div>\r
`});var Tc,vc,Cc,xc,Pc,Ne,ti,ot,Ic=p(()=>{pe();yc();fc();Pc=[j({selector:"potatno-search-input",template:bc,style:gc})];ot=class extends(xc=I,Cc=[P],vc=[P],Tc=[D("search-change")],xc){constructor(){super(...arguments);f(this,"placeholder",u(Ne,12,this,"Search...")),u(Ne,15,this);f(this,"value",u(Ne,16,this,"")),u(Ne,19,this);k(this,ti,u(Ne,8,this)),u(Ne,11,this)}onInput(t){let n=t.target;this.value=n.value,this.mSearchChange.dispatchEvent(this.value)}};Ne=E(xc),ti=new WeakMap,d(Ne,4,"mSearchChange",Tc,ot,ti),d(Ne,5,"placeholder",Cc,ot),d(Ne,5,"value",vc,ot),ot=d(Ne,0,"PotatnoSearchInput",Pc,ot),u(Ne,1,ot)});var si,S,wc,Ec,kc,Nc,Ac,Dc,Sc,Lc,Mc,Rc,Y,ni,ri,oi,ii,me,Oc=p(()=>{pe();Ts();Cs();po();ks();Ns();mo();go();Vs();js();xt();$t();bo();bo();Us();zs();vo();Io();Ca();Ga();Za();dl();Yl();$o();ic();hc();Ic();si=class{mFiles=new Map;mInternals=new Map;mProjects=new Map;mSelections=new Map;deleteAll(e){this.mProjects.delete(e),this.mFiles.delete(e),this.mSelections.delete(e),this.mInternals.delete(e)}deleteFile(e){this.mFiles.delete(e)}getFile(e){return this.mFiles.get(e)}getInternals(e){return this.mInternals.get(e)}getProject(e){return this.mProjects.get(e)}getSelection(e){return this.mSelections.get(e)}setFile(e,t){this.mFiles.set(e,t)}setInternals(e,t){this.mInternals.set(e,t)}setProject(e,t){this.mProjects.set(e,t)}setSelection(e,t){this.mSelections.set(e,t)}},S=new si;Rc=[j({selector:"potatno-code-editor",template:xs,style:vs})];me=class extends(Mc=I,Lc=[de("svgLayer")],Sc=[de("canvasWrapper")],Dc=[de("panelLeft")],Ac=[de("panelRight")],Nc=[P],kc=[P],Ec=[P],wc=[P],Mc){constructor(){super();u(Y,5,this);f(this,"mInstanceKey");f(this,"mShowSelectionBox");f(this,"mSelectionBoxScreen");f(this,"mPreviewDebounceTimer");f(this,"mKeyboardHandler");f(this,"mResizeState");f(this,"mResizeMoveHandler");f(this,"mResizeUpHandler");f(this,"mCacheVersion");k(this,ni,u(Y,8,this)),u(Y,11,this);k(this,ri,u(Y,12,this)),u(Y,15,this);k(this,oi,u(Y,16,this)),u(Y,19,this);k(this,ii,u(Y,20,this)),u(Y,23,this);this.mInstanceKey=crypto.randomUUID(),S.setSelection(this.mInstanceKey,new Set),S.setInternals(this.mInstanceKey,{history:new nr,clipboard:new rr,interaction:new Ht(20),renderer:new Kt,hoveredPort:null,interactionState:{mode:"idle"},previewInitialized:!1,cachedData:{activeFunctionId:"",activeFunctionName:"",activeFunctionIsSystem:!1,activeFunctionEditableByUser:!1,errors:[],hasPreview:!1,nodeDefinitionList:[],functionList:[],availableImports:[],availableTypes:[],activeFunctionInputs:[],activeFunctionOutputs:[],activeFunctionImports:[],visibleNodes:[]}}),this.mShowSelectionBox=!1,this.mSelectionBoxScreen={x1:0,y1:0,x2:0,y2:0},this.mPreviewDebounceTimer=0,this.mKeyboardHandler=null,this.mResizeState=null,this.mResizeMoveHandler=null,this.mResizeUpHandler=null,this.mCacheVersion=0}get project(){return this.getProject()}set project(t){S.setProject(this.mInstanceKey,t),this.rebuildCachedData()}get file(){return S.getFile(this.mInstanceKey)??null}set file(t){if(t){S.setFile(this.mInstanceKey,t);let n=S.getProject(this.mInstanceKey);n&&t.functions.size===0&&this.initializeMainFunctions(t,n.configuration)}else S.deleteFile(this.mInstanceKey);this.getSelectedIds().clear(),this.getInternals().history.clear(),this.getInternals().previewInitialized=!1,this.rebuildCachedData(),this.renderConnections(),this.initializePreview(),this.updatePreview()}get activeFunctionId(){return this.mCacheVersion,this.getInternals().cachedData.activeFunctionId}get interaction(){return this.getInternals().interaction}get showSelectionBox(){return this.mShowSelectionBox}get hasPreview(){return this.mCacheVersion,this.getInternals().cachedData.hasPreview}get editorErrors(){return this.mCacheVersion,this.getInternals().cachedData.errors}get gridBackgroundStyle(){return this.getInternals().interaction.getGridBackgroundCss()}get gridTransformStyle(){return"transform: "+this.getInternals().interaction.getTransformCss()}get selectionBoxStyle(){if(!this.mShowSelectionBox)return"display: none";let t=Math.min(this.mSelectionBoxScreen.x1,this.mSelectionBoxScreen.x2),n=Math.min(this.mSelectionBoxScreen.y1,this.mSelectionBoxScreen.y2),r=Math.abs(this.mSelectionBoxScreen.x2-this.mSelectionBoxScreen.x1),o=Math.abs(this.mSelectionBoxScreen.y2-this.mSelectionBoxScreen.y1);return`left: ${t}px; top: ${n}px; width: ${r}px; height: ${o}px`}get visibleNodes(){return this.mCacheVersion,this.getInternals().cachedData.visibleNodes}get nodeDefinitionList(){return this.mCacheVersion,this.getInternals().cachedData.nodeDefinitionList}get functionList(){return this.mCacheVersion,this.getInternals().cachedData.functionList}get activeFunctionName(){return this.mCacheVersion,this.getInternals().cachedData.activeFunctionName}get activeFunctionInputs(){return this.mCacheVersion,this.getInternals().cachedData.activeFunctionInputs}get activeFunctionOutputs(){return this.mCacheVersion,this.getInternals().cachedData.activeFunctionOutputs}get activeFunctionImports(){return this.mCacheVersion,this.getInternals().cachedData.activeFunctionImports}get activeFunctionIsSystem(){return this.mCacheVersion,this.getInternals().cachedData.activeFunctionIsSystem}get activeFunctionEditableByUser(){return this.mCacheVersion,this.getInternals().cachedData.activeFunctionEditableByUser}get availableImportsList(){return this.mCacheVersion,this.getInternals().cachedData.availableImports}get availableTypes(){return this.mCacheVersion,this.getInternals().cachedData.availableTypes}getProject(){return S.getProject(this.mInstanceKey)}getFile(){return S.getFile(this.mInstanceKey)}getSelectedIds(){return S.getSelection(this.mInstanceKey)}getInternals(){return S.getInternals(this.mInstanceKey)}loadCode(t){let n=this.getProject(),o=new hr(n.configuration).deserialize(t);S.setFile(this.mInstanceKey,o),this.getInternals().history.clear(),this.getSelectedIds().clear(),this.getInternals().previewInitialized=!1,this.rebuildCachedData(),this.renderConnections(),this.initializePreview(),this.updatePreview()}generateCode(){let t=this.getProject(),n=S.getFile(this.mInstanceKey);return n?new Nn(t.configuration).serialize(n):""}onConnect(){this.mKeyboardHandler=t=>this.onKeyDown(t),document.addEventListener("keydown",this.mKeyboardHandler)}onDeconstruct(){this.mKeyboardHandler&&document.removeEventListener("keydown",this.mKeyboardHandler),S.deleteAll(this.mInstanceKey)}onNodeDragFromLibrary(t){let n=t.value??t.detail?.value??t,r=this.getProject(),o=S.getFile(this.mInstanceKey);if(!o)return;let s=r.configuration.nodeDefinitions.get(n);if(!s){for(let x of o.functions.values())if(x.name===n&&!x.system){s={name:x.name,category:"function",inputs:[...x.inputs],outputs:[...x.outputs]};break}}if(!s){let x=o.activeFunction;if(x){let b=new Set(x.imports);for(let w of r.configuration.imports)if(b.has(w.name)){for(let A of w.nodes)if(A.name===n){s=A;break}if(s)break}}}if(!s){for(let x of r.configuration.globalInputs)if(n===`Get ${x.name}`){s={name:n,category:"value",inputs:[],outputs:[{name:x.name,type:x.type}]};break}}if(!s){for(let x of r.configuration.globalOutputs)if(n===`Set ${x.name}`){s={name:n,category:"value",inputs:[{name:x.name,type:x.type}],outputs:[]};break}}if(!s)return;let a=o.activeFunction?.graph;if(!a)return;let l=this.getInternals(),c=this.canvasWrapper,h=c&&c.clientWidth||800,m=c&&c.clientHeight||600,y=l.interaction.screenToWorld(h/2,m/2),C=l.interaction.snapToGrid(y.x,y.y),F=new An(a,s,{x:C.x/l.interaction.gridSize,y:C.y/l.interaction.gridSize});l.history.push(F),this.rebuildCachedData(),this.renderConnections(),this.updatePreview()}onFunctionSelect(t){let n=t.value??t.detail?.value??t,r=S.getFile(this.mInstanceKey);r&&(r.setActiveFunction(n),this.getSelectedIds().clear(),this.rebuildCachedData(),this.renderConnections())}onFunctionAdd(){let t=S.getFile(this.mInstanceKey);if(!t)return;let n=this.getInternals().cachedData.functionList.length,r=new Ct(crypto.randomUUID(),`function_${n}`,`Function ${n}`,!1);t.addFunction(r),t.setActiveFunction(r.id),this.getSelectedIds().clear(),this.rebuildCachedData(),this.renderConnections()}onFunctionDelete(t){let n=t.value??t.detail?.value??t,r=S.getFile(this.mInstanceKey);r&&(r.removeFunction(n),this.getSelectedIds().clear(),this.rebuildCachedData(),this.renderConnections(),this.updatePreview())}onPropertiesChange(t){let n=S.getFile(this.mInstanceKey);if(!n)return;let r=n.activeFunction;if(!r)return;let o=t.value??t.detail?.value??t;o.name!==void 0&&(r.setName(o.name),r.setLabel(o.name)),o.inputs!==void 0&&r.setInputs(o.inputs),o.outputs!==void 0&&r.setOutputs(o.outputs),o.imports!==void 0&&r.setImports(o.imports),r.graph.validate(),this.rebuildCachedData(),this.renderConnections(),this.updatePreview()}onCanvasPointerDown(t){let n=this.getInternals();if(t.button===1){t.preventDefault(),n.interactionState={mode:"panning",startX:t.clientX,startY:t.clientY},t.currentTarget.setPointerCapture(t.pointerId);return}if(t.button===0){t.ctrlKey||(this.getSelectedIds().clear(),this.rebuildCachedData());let r=this.canvasWrapper.getBoundingClientRect(),o=t.clientX-r.left,s=t.clientY-r.top;n.interactionState={mode:"selecting",startX:o,startY:s},this.mSelectionBoxScreen={x1:o,y1:s,x2:o,y2:s},this.mShowSelectionBox=!1,t.currentTarget.setPointerCapture(t.pointerId)}}onCanvasPointerMove(t){let n=this.getInternals(),r=n.interactionState;if(r.mode==="panning"){let o=t.clientX-r.startX,s=t.clientY-r.startY;n.interaction.pan(o,s),r.startX=t.clientX,r.startY=t.clientY,this.renderConnections();return}if(r.mode==="dragging-node"){let o=S.getFile(this.mInstanceKey);if(!o)return;let s=(t.clientX-r.startX)/n.interaction.zoom,a=(t.clientY-r.startY)/n.interaction.zoom;for(let l of r.origins){let c=l.originX+s,h=l.originY+a,m=n.interaction.snapToGrid(c,h),y=o.activeFunction?.graph.getNode(l.nodeId);y&&(y.moveTo(m.x/n.interaction.gridSize,m.y/n.interaction.gridSize),this.updateNodePosition(l.nodeId))}this.renderConnections();return}if(r.mode==="dragging-wire"){let o=this.canvasWrapper.getBoundingClientRect(),s=(t.clientX-o.left-n.interaction.panX)/n.interaction.zoom,a=(t.clientY-o.top-n.interaction.panY)/n.interaction.zoom;n.renderer.renderTempConnection(this.svgLayer,{x:r.startX,y:r.startY},{x:s,y:a},"#bac2de");return}if(r.mode==="selecting"){let o=this.canvasWrapper.getBoundingClientRect();this.mSelectionBoxScreen.x2=t.clientX-o.left,this.mSelectionBoxScreen.y2=t.clientY-o.top;let s=Math.abs(this.mSelectionBoxScreen.x2-this.mSelectionBoxScreen.x1),a=Math.abs(this.mSelectionBoxScreen.y2-this.mSelectionBoxScreen.y1);(s>5||a>5)&&(this.mShowSelectionBox=!0);return}if(r.mode==="resizing-comment"){let o=S.getFile(this.mInstanceKey);if(!o)return;let s=(t.clientX-r.startX)/n.interaction.zoom,a=(t.clientY-r.startY)/n.interaction.zoom,l=n.interaction.gridSize,c=r.originalW+Math.round(s/l),h=r.originalH+Math.round(a/l),m=o.activeFunction?.graph.getNode(r.nodeId);m&&(m.resizeTo(c,h),this.updateNodeSize(r.nodeId));return}}onCanvasPointerUp(t){let n=this.getInternals();if(n.interactionState.mode==="dragging-node"&&(this.rebuildCachedData(),this.renderConnections(),this.updatePreview()),n.interactionState.mode==="dragging-wire"&&(n.renderer.clearTempConnection(this.svgLayer),n.hoveredPort)){let r=n.hoveredPort;if(n.interactionState.direction!==r.direction&&n.interactionState.portKind===r.portKind){let s=S.getFile(this.mInstanceKey)?.activeFunction?.graph;if(s){let a=n.interactionState.portKind==="data"?"data":"flow",l,c,h,m;n.interactionState.direction==="output"?(l=n.interactionState.sourceNodeId,c=n.interactionState.sourcePortId,h=r.nodeId,m=r.portId):(l=r.nodeId,c=r.portId,h=n.interactionState.sourceNodeId,m=n.interactionState.sourcePortId),s.addConnection(l,c,h,m,a),this.rebuildCachedData(),this.renderConnections(),this.updatePreview()}}}n.interactionState.mode==="selecting"&&(this.mShowSelectionBox=!1,this.selectNodesInBox()),n.interactionState.mode==="resizing-comment"&&this.rebuildCachedData(),n.interactionState={mode:"idle"},t.currentTarget.releasePointerCapture(t.pointerId)}onCanvasWheel(t){t.preventDefault();let n=this.canvasWrapper.getBoundingClientRect(),r=t.clientX-n.left,o=t.clientY-n.top;this.getInternals().interaction.zoomAt(r,o,t.deltaY>0?-.1:.1),this.renderConnections()}onContextMenu(t){t.preventDefault();let n=t.target;if(n.hasAttribute?.("data-hit-area")){let r=n.getAttribute("data-connection-id");if(r){let s=S.getFile(this.mInstanceKey)?.activeFunction?.graph;s&&(s.removeConnection(r),this.rebuildCachedData(),this.renderConnections(),this.updatePreview())}}}onNodePointerDown(t,n){let r=t.composedPath();for(let m of r)if(m.tagName?.toLowerCase()==="potatno-port")return;if(t.stopPropagation(),t.button!==0)return;let o=n.id,s=this.getInternals(),a=this.getSelectedIds(),l=S.getFile(this.mInstanceKey);if(!l)return;t.ctrlKey?a.has(o)?a.delete(o):a.add(o):a.has(o)||(a.clear(),a.add(o)),this.rebuildCachedData();let c=[],h=l.activeFunction?.graph;for(let m of a){let y=h?.getNode(m);y&&c.push({nodeId:m,originX:y.position.x*s.interaction.gridSize,originY:y.position.y*s.interaction.gridSize})}if(h){let m=h.getNode(o);if(m&&m.category==="comment"){let y=s.interaction.gridSize,C=m.position.x*y,F=m.position.y*y,x=C+m.size.w*y,b=F+m.size.h*y;for(let w of h.nodes.values()){if(w.id===o||a.has(w.id)||w.category==="comment")continue;let A=w.position.x*y,M=w.position.y*y;A>=C&&A<=x&&M>=F&&M<=b&&c.push({nodeId:w.id,originX:A,originY:M})}}}c.length>0&&(s.interactionState={mode:"dragging-node",nodeId:o,startX:t.clientX,startY:t.clientY,origins:c},this.canvasWrapper.setPointerCapture(t.pointerId))}onPortDragStart(t){let n=t.value??t.detail?.value??t,o=S.getFile(this.mInstanceKey)?.activeFunction?.graph;if(!o)return;let s=o.getNode(n.nodeId);if(!s)return;let a=this.getInternals(),l=a.interaction.gridSize,c=s.position.x*l,h=s.position.y*l,m=s.size.w*l,y=28,C=24,F=4,x,b;if(n.portKind==="flow")x=n.direction==="output"?c+m:c,b=h+y/2;else{let w=0;if(n.direction==="output"){let A=0;for(let M of s.outputs.values()){if(M.id===n.portId){w=A;break}A++}x=c+m}else{let A=0;for(let M of s.inputs.values()){if(M.id===n.portId){w=A;break}A++}x=c}b=h+y+F+(w+.5)*C}a.interactionState={mode:"dragging-wire",sourceNodeId:n.nodeId,sourcePortId:n.portId,portKind:n.portKind,direction:n.direction,type:n.type,startX:x,startY:b}}onPortHover(t){let n=t.value??t.detail?.value??t;this.getInternals().hoveredPort={nodeId:n.nodeId,portId:n.portId,portKind:n.portKind,direction:n.direction,type:n.type}}onPortLeave(){this.getInternals().hoveredPort=null}onNodeResizeStart(t,n){let r=t.value??t.detail?.value??t,s=S.getFile(this.mInstanceKey)?.activeFunction?.graph.getNode(r.nodeId);s&&(this.getInternals().interactionState={mode:"resizing-comment",nodeId:r.nodeId,startX:r.startX,startY:r.startY,originalW:s.size.w,originalH:s.size.h},this.canvasWrapper.setPointerCapture(t.pointerId??r.startX))}onCommentChange(t){let n=t.value??t.detail?.value??t,o=S.getFile(this.mInstanceKey)?.activeFunction?.graph.getNode(n.nodeId);if(o){let s=new Dn(o,"comment",n.text);this.getInternals().history.push(s),this.rebuildCachedData()}}onValueChange(t){let n=t.value??t.detail?.value??t,o=S.getFile(this.mInstanceKey)?.activeFunction?.graph.getNode(n.nodeId);if(o){let s=new Dn(o,n.property,n.value);this.getInternals().history.push(s),this.rebuildCachedData(),this.updatePreview()}}onKeyDown(t){if(t.key==="Delete"){this.deleteSelectedNodes();return}if(t.ctrlKey&&t.key==="z"){t.preventDefault(),this.getInternals().history.undo(),this.rebuildCachedData(),this.renderConnections(),this.updatePreview();return}if(t.ctrlKey&&(t.key==="y"||t.shiftKey&&t.key==="z")){t.preventDefault(),this.getInternals().history.redo(),this.rebuildCachedData(),this.renderConnections(),this.updatePreview();return}if(t.ctrlKey&&t.key==="c"){let r=S.getFile(this.mInstanceKey)?.activeFunction?.graph;r&&this.getInternals().clipboard.copy(r,this.getSelectedIds());return}if(t.ctrlKey&&t.key==="v"){this.pasteFromClipboard();return}}onResizeLeftStart(t){t.preventDefault(),this.startPanelResize("left",t)}onResizeRightStart(t){t.preventDefault(),this.startPanelResize("right",t)}startPanelResize(t,n){let r=t==="left"?this.panelLeft:this.panelRight;this.mResizeState={panel:t,startX:n.clientX,startWidth:r.offsetWidth},this.mResizeMoveHandler=o=>{if(!this.mResizeState)return;let s=t==="left"?o.clientX-this.mResizeState.startX:this.mResizeState.startX-o.clientX,a=Math.max(200,Math.min(500,this.mResizeState.startWidth+s));r.style.width=`${a}px`},this.mResizeUpHandler=()=>{this.mResizeMoveHandler&&document.removeEventListener("pointermove",this.mResizeMoveHandler),this.mResizeUpHandler&&document.removeEventListener("pointerup",this.mResizeUpHandler),this.mResizeState=null},document.addEventListener("pointermove",this.mResizeMoveHandler),document.addEventListener("pointerup",this.mResizeUpHandler)}initializeMainFunctions(t,n){for(let r of n.mainFunctions){let o=new Ct(crypto.randomUUID(),r.name,r.label,!0,r.editableByUser??!1),s=r.inputs?Object.entries(r.inputs).map(([l,c])=>({name:l,type:c})):[],a=r.outputs?Object.entries(r.outputs).map(([l,c])=>({name:l,type:c})):[];o.setInputs(s),o.setOutputs(a);for(let l=0;l<s.length;l++){let c=s[l],h={name:c.name,category:"input",inputs:[],outputs:[{name:c.name,type:c.type}]};o.graph.addNode(h,{x:2,y:2+l*3},!0)}for(let l=0;l<a.length;l++){let c=a[l],h={name:c.name,category:"output",inputs:[{name:c.name,type:c.type}],outputs:[]};o.graph.addNode(h,{x:30,y:2+l*3},!0)}if(r.events)for(let l=0;l<r.events.length;l++){let c=r.events[l],h={name:c.name,category:"event",inputs:[],outputs:[...c.outputs]};o.graph.addNode(h,{x:2+l*10,y:-4},!0)}t.addFunction(o)}}deleteSelectedNodes(){let n=S.getFile(this.mInstanceKey)?.activeFunction?.graph;if(!n)return;let r=[];for(let o of this.getSelectedIds()){let s=n.getNode(o);s&&!s.system&&r.push(new yr(n,o))}r.length>0&&(this.getInternals().history.push(new Sn("Delete nodes",r)),this.getSelectedIds().clear(),this.rebuildCachedData(),this.renderConnections(),this.updatePreview())}pasteFromClipboard(){let t=this.getInternals(),n=t.clipboard.getData();if(!n)return;let r=this.getProject(),s=S.getFile(this.mInstanceKey)?.activeFunction?.graph;if(!s)return;let a=[],l=[];for(let c of n.nodes){let h=r.configuration.nodeDefinitions.get(c.definitionName);if(h){let m=new An(s,h,{x:c.position.x+2,y:c.position.y+2});a.push(m),l.push(m)}}if(a.length>0){t.history.push(new Sn("Paste nodes",a));for(let c=0;c<l.length;c++){let h=l[c].node,m=n.nodes[c];if(h&&m.properties)for(let[y,C]of Object.entries(m.properties))h.properties.set(y,C)}for(let c of n.internalConnections){let h=l[c.sourceNodeIndex]?.node??null,m=l[c.targetNodeIndex]?.node??null;if(h&&m){let y="",C="",F=c.kind==="flow"?"flow":"data";if(F==="data"){for(let[x,b]of h.outputs)if(x===c.sourcePortName){y=b.id;break}for(let[x,b]of m.inputs)if(x===c.targetPortName){C=b.id;break}}else{for(let[x,b]of h.flowOutputs)if(x===c.sourcePortName){y=b.id;break}for(let[x,b]of m.flowInputs)if(x===c.targetPortName){C=b.id;break}}y&&C&&s.addConnection(h.id,y,m.id,C,F)}}this.getSelectedIds().clear();for(let c of l)c.node&&this.getSelectedIds().add(c.node.id);this.rebuildCachedData(),this.renderConnections(),this.updatePreview()}}selectNodesInBox(){let n=S.getFile(this.mInstanceKey)?.activeFunction?.graph;if(!n)return;let r=this.getInternals(),o=r.interaction.screenToWorld(Math.min(this.mSelectionBoxScreen.x1,this.mSelectionBoxScreen.x2),Math.min(this.mSelectionBoxScreen.y1,this.mSelectionBoxScreen.y2)),s=r.interaction.screenToWorld(Math.max(this.mSelectionBoxScreen.x1,this.mSelectionBoxScreen.x2),Math.max(this.mSelectionBoxScreen.y1,this.mSelectionBoxScreen.y2)),a=r.interaction.gridSize;for(let l of n.nodes.values()){let c=l.position.x*a,h=l.position.y*a,m=c+l.size.w*a,y=h+l.size.h*a;c<s.x&&m>o.x&&h<s.y&&y>o.y&&this.getSelectedIds().add(l.id)}this.rebuildCachedData()}renderConnections(){if(!this.svgLayer)return;let n=S.getFile(this.mInstanceKey)?.activeFunction?.graph;if(!n){this.getInternals().renderer.clearAll(this.svgLayer);return}let r=this.getInternals(),o=r.interaction.gridSize,s=28,a=24,l=4,c=[];for(let h of n.connections.values()){let m=n.getNode(h.sourceNodeId),y=n.getNode(h.targetNodeId);if(!m||!y)continue;let C=m.position.x*o,F=m.position.y*o,x=y.position.x*o,b=y.position.y*o,w=m.size.w*o,A,M,X,T;if(h.kind==="data"){let Ln=0,Zt=0;for(let Tr of m.outputs.values()){if(Tr.id===h.sourcePortId){Ln=Zt;break}Zt++}let ai=0;Zt=0;for(let Tr of y.inputs.values()){if(Tr.id===h.targetPortId){ai=Zt;break}Zt++}A=C+w,M=F+s+l+(Ln+.5)*a,X=x,T=b+s+l+(ai+.5)*a}else A=C+w,M=F+s/2,X=x,T=b+s/2;c.push({id:h.id,sourceX:A,sourceY:M,targetX:X,targetY:T,color:h.valid?"var(--pn-text-secondary)":"var(--pn-accent-danger)",valid:h.valid})}r.renderer.renderConnections(this.svgLayer,c)}initializePreview(){let t=S.getProject(this.mInstanceKey);if(!t)return;let n=t.configuration.createPreview;if(!n)return;let r=this.getInternals();if(r.previewInitialized)return;let o=this.previewEl;if(o&&typeof o.getContainer=="function"){let s=o.getContainer();n(s),r.previewInitialized=!0}}updatePreview(){let t=S.getProject(this.mInstanceKey);if(!t)return;let n=t.configuration.updatePreview;if(!n)return;let r=S.getFile(this.mInstanceKey);if(!r||this.getInternals().cachedData.errors.some(l=>l.blocking!==!1))return;let a;try{let c=new Nn(t.configuration).serialize(r);a=this.stripMetadataComments(c,t.configuration.commentToken)}catch{return}clearTimeout(this.mPreviewDebounceTimer),this.mPreviewDebounceTimer=setTimeout(()=>{try{n(a)}catch{}},300)}stripMetadataComments(t,n){let r=t.split(`
`),o=`${n} #potatno `;return r.filter(a=>!a.trim().startsWith(o)).join(`
`)}updateNodePosition(t){let r=S.getFile(this.mInstanceKey)?.activeFunction?.graph.getNode(t);if(!r)return;let o=this.getInternals().interaction.gridSize;for(let s of this.getInternals().cachedData.visibleNodes)if(s.id===t){s.position={x:r.position.x,y:r.position.y},s.pixelX=r.position.x*o,s.pixelY=r.position.y*o;break}}updateNodeSize(t){let r=S.getFile(this.mInstanceKey)?.activeFunction?.graph.getNode(t);if(r){for(let o of this.getInternals().cachedData.visibleNodes)if(o.id===t){o.size={w:r.size.w,h:r.size.h};break}}}validateProject(){let t=[],n=S.getFile(this.mInstanceKey);if(!n)return t;let r=/^[a-zA-Z][a-zA-Z0-9_]*$/,o=new Set;for(let a of n.functions.values()){o.has(a.name)&&t.push({message:`Duplicate function name "${a.name}".`,location:`Function "${a.name}"`}),o.add(a.name),r.test(a.name)||t.push({message:`Invalid function name "${a.name}". Must start with a letter and contain only letters, digits, and underscores.`,location:`Function "${a.name}"`});let l=new Set;for(let c of a.inputs)r.test(c.name)||t.push({message:`Invalid input name "${c.name}".`,location:`Function "${a.name}" > Inputs`}),l.has(c.name)&&t.push({message:`Duplicate input/output name "${c.name}".`,location:`Function "${a.name}" > Inputs`}),l.add(c.name);for(let c of a.outputs)r.test(c.name)||t.push({message:`Invalid output name "${c.name}".`,location:`Function "${a.name}" > Outputs`}),l.has(c.name)&&t.push({message:`Duplicate input/output name "${c.name}".`,location:`Function "${a.name}" > Outputs`}),l.add(c.name)}let s=n.activeFunction;if(!s)return t.push({message:"No active function selected.",location:"Editor"}),t;for(let a of s.graph.nodes.values())for(let l of a.inputs.values())!l.connectedTo&&!a.system&&t.push({message:`Input "${l.name}" on node "${a.definitionName}" is not connected.`,location:`Function "${s.name}" > Node "${a.definitionName}"`,blocking:!1});for(let a of s.graph.connections.values())a.valid||t.push({message:"Type mismatch on connection.",location:`Function "${s.name}"`});return t}rebuildCachedData(){let t=S.getProject(this.mInstanceKey),n=S.getFile(this.mInstanceKey),r=this.getInternals().cachedData;r.activeFunctionId=n?.activeFunctionId??"",r.hasPreview=t?.configuration.hasPreview??!1,r.errors=this.validateProject();let o=[];if(t)for(let c of t.configuration.nodeDefinitions.values())o.push({name:c.name,category:c.category});if(n)for(let c of n.functions.values())c.system||o.push({name:c.name,category:"function"});r.nodeDefinitionList=o;let s=[];if(n)for(let c of n.functions.values())s.push({id:c.id,name:c.name,label:c.label,system:c.system});if(r.functionList=s,t&&n){let c=n.activeFunction;if(c){let h=new Set(c.imports);for(let m of t.configuration.imports)if(h.has(m.name))for(let y of m.nodes)o.push({name:y.name,category:y.category})}}if(t){for(let c of t.configuration.globalInputs)o.push({name:`Get ${c.name}`,category:"value"});for(let c of t.configuration.globalOutputs)o.push({name:`Set ${c.name}`,category:"value"})}r.availableImports=t?.configuration.imports.map(c=>c.name)??[];let a=new Set;if(t)for(let c of t.configuration.nodeDefinitions.values()){for(let h of c.inputs)a.add(h.type);for(let h of c.outputs)a.add(h.type)}r.availableTypes=[...a].sort();let l=n?.activeFunction;if(r.activeFunctionName=l?.name??"",r.activeFunctionIsSystem=l?.system??!1,r.activeFunctionEditableByUser=l?.editableByUser??!1,r.activeFunctionInputs=[...l?.inputs??[]],r.activeFunctionOutputs=[...l?.outputs??[]],r.activeFunctionImports=[...l?.imports??[]],l){let c=new Set,h=new Set;for(let y of l.graph.connections.values())c.add(y.sourcePortId),h.add(y.sourcePortId),h.add(y.targetPortId);let m=[];for(let y of l.graph.nodes.values()){let C=t?.configuration.nodeDefinitions.get(y.definitionName),F=Xt.get(y.category),x=[];for(let M of y.inputs.values())x.push({id:M.id,name:M.name,type:M.type,direction:M.direction,connectedTo:M.connectedTo});let b=[];for(let M of y.outputs.values()){let X=c.has(M.id);b.push({id:M.id,name:M.name,type:M.type,direction:M.direction,connectedTo:X?"connected":null})}let w=[];for(let M of y.flowInputs.values())w.push({id:M.id,name:M.name,direction:M.direction,connectedTo:h.has(M.id)?"connected":null});let A=[];for(let M of y.flowOutputs.values())A.push({id:M.id,name:M.name,direction:M.direction,connectedTo:h.has(M.id)?"connected":null});m.push({id:y.id,definitionName:y.definitionName,category:y.category,categoryColor:F.cssColor,categoryIcon:F.icon,label:y.definitionName,position:{x:y.position.x,y:y.position.y},size:{w:y.size.w,h:y.size.h},system:y.system,selected:this.getSelectedIds().has(y.id),inputs:x,outputs:b,flowInputs:w,flowOutputs:A,valueText:y.properties.get("value")??"",commentText:y.properties.get("comment")??"",hasDefinition:!!C,pixelX:y.position.x*this.getInternals().interaction.gridSize,pixelY:y.position.y*this.getInternals().interaction.gridSize})}r.visibleNodes=m}else r.visibleNodes=[];this.mCacheVersion++}};Y=E(Mc),ni=new WeakMap,ri=new WeakMap,oi=new WeakMap,ii=new WeakMap,d(Y,4,"svgLayer",Lc,me,ni),d(Y,4,"canvasWrapper",Sc,me,ri),d(Y,4,"panelLeft",Dc,me,oi),d(Y,4,"panelRight",Ac,me,ii),d(Y,3,"project",Nc,me),d(Y,3,"file",kc,me),d(Y,1,"loadCode",Ec,me),d(Y,1,"generateCode",wc,me),me=d(Y,0,"PotatnoCodeEditor",Rc,me),u(Y,1,me)});var Gc,Fc=p(()=>{Gc=`:host {\r
    display: block;\r
    width: 100%;\r
    height: 100%;\r
}\r
\r
potatno-code-editor {\r
    display: block;\r
    width: 100%;\r
    height: 100%;\r
}`});var Vc,Bc=p(()=>{Vc=`:host {\r
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
`});var gr,jc=p(()=>{pe();Oc();Fc();Bc();gr=class extends it{mCodeEditor;mProject;get file(){return this.mCodeEditor.file}set file(e){this.mCodeEditor.file=e}get project(){return this.mProject}constructor(e){super("potatno-code",new Fe),this.mProject=e,this.addStyle(Vc),this.addStyle(Gc),this.mCodeEditor=this.addContent(me),this.mCodeEditor.project=e}}});var fr,Uc=p(()=>{fr=class{mCommentToken;mCreatePreview;mFunctionCodeGenerator;mGlobalInputs;mGlobalOutputs;mImports;mMainFunctions;mNodeDefinitions;mUpdatePreview;get commentToken(){return this.mCommentToken}get createPreview(){return this.mCreatePreview}get functionCodeGenerator(){return this.mFunctionCodeGenerator}get globalInputs(){return this.mGlobalInputs}get globalOutputs(){return this.mGlobalOutputs}get hasPreview(){return this.mCreatePreview!==null}get imports(){return this.mImports}get mainFunctions(){return this.mMainFunctions}get nodeDefinitions(){return this.mNodeDefinitions}get updatePreview(){return this.mUpdatePreview}constructor(){this.mCommentToken="//",this.mNodeDefinitions=new Map,this.mMainFunctions=new Array,this.mImports=new Array,this.mGlobalInputs=new Array,this.mGlobalOutputs=new Array,this.mCreatePreview=null,this.mUpdatePreview=null,this.mFunctionCodeGenerator=null}addGlobalInput(e){this.mGlobalInputs.push(e)}addGlobalOutput(e){this.mGlobalOutputs.push(e)}addImport(e){this.mImports.push(e)}addMainFunction(e){this.mMainFunctions.push(e)}addNodeDefinition(e){this.mNodeDefinitions.set(e.name,e)}setCommentToken(e){this.mCommentToken=e}setFunctionCodeGenerator(e){this.mFunctionCodeGenerator=e}setPreview(e,t){this.mCreatePreview=e,this.mUpdatePreview=t}}});var br,zc=p(()=>{Uc();br=class{mConfiguration;get configuration(){return this.mConfiguration}constructor(){this.mConfiguration=new fr}defineGlobalInput(e){this.mConfiguration.addGlobalInput(e)}defineGlobalOutput(e){this.mConfiguration.addGlobalOutput(e)}defineImport(e){this.mConfiguration.addImport(e)}defineMainFunction(e){this.mConfiguration.addMainFunction(e)}defineNode(e){this.mConfiguration.addNodeDefinition(e)}setCommentToken(e){this.mConfiguration.setCommentToken(e)}setFunctionCodeGenerator(e){this.mConfiguration.setFunctionCodeGenerator(e)}setPreview(e,t){this.mConfiguration.setPreview(e,t)}}});var ju={};var B,Oe,$c,Hc=p(()=>{jc();zc();fo();xt();B=new br;B.setCommentToken("//");B.defineImport({name:"Math",nodes:[{name:"Math.PI",category:"value",inputs:[],outputs:[{name:"value",type:"number"}],codeGenerator:({outputs:i})=>`const ${i.value} = Math.PI;`},{name:"Math.E",category:"value",inputs:[],outputs:[{name:"value",type:"number"}],codeGenerator:({outputs:i})=>`const ${i.value} = Math.E;`},{name:"Math.abs",category:"function",inputs:[{name:"value",type:"number"}],outputs:[{name:"result",type:"number"}],codeGenerator:({inputs:i,outputs:e})=>`const ${e.result} = Math.abs(${i.value});`},{name:"Math.floor",category:"function",inputs:[{name:"value",type:"number"}],outputs:[{name:"result",type:"number"}],codeGenerator:({inputs:i,outputs:e})=>`const ${e.result} = Math.floor(${i.value});`},{name:"Math.random",category:"function",inputs:[],outputs:[{name:"result",type:"number"}],codeGenerator:({outputs:i})=>`const ${i.result} = Math.random();`}]});B.defineGlobalInput({name:"time",type:"number"});B.defineGlobalOutput({name:"result",type:"string"});B.defineNode({name:"Number Literal",category:"value",inputs:[],outputs:[{name:"value",type:"number"}],codeGenerator:({outputs:i,properties:e})=>`const ${i.value} = ${e.value};`});B.defineNode({name:"String Literal",category:"value",inputs:[],outputs:[{name:"value",type:"string"}],codeGenerator:({outputs:i,properties:e})=>`const ${i.value} = "${e.value}";`});B.defineNode({name:"Boolean Literal",category:"value",inputs:[],outputs:[{name:"value",type:"boolean"}],codeGenerator:({outputs:i,properties:e})=>`const ${i.value} = ${e.value};`});B.defineNode({name:"Add",category:"operator",inputs:[{name:"a",type:"number"},{name:"b",type:"number"}],outputs:[{name:"result",type:"number"}],codeGenerator:({inputs:i,outputs:e})=>`const ${e.result} = ${i.a} + ${i.b};`});B.defineNode({name:"Subtract",category:"operator",inputs:[{name:"a",type:"number"},{name:"b",type:"number"}],outputs:[{name:"result",type:"number"}],codeGenerator:({inputs:i,outputs:e})=>`const ${e.result} = ${i.a} - ${i.b};`});B.defineNode({name:"Multiply",category:"operator",inputs:[{name:"a",type:"number"},{name:"b",type:"number"}],outputs:[{name:"result",type:"number"}],codeGenerator:({inputs:i,outputs:e})=>`const ${e.result} = ${i.a} * ${i.b};`});B.defineNode({name:"Divide",category:"operator",inputs:[{name:"a",type:"number"},{name:"b",type:"number"}],outputs:[{name:"result",type:"number"}],codeGenerator:({inputs:i,outputs:e})=>`const ${e.result} = ${i.a} / ${i.b};`});B.defineNode({name:"Modulo",category:"operator",inputs:[{name:"a",type:"number"},{name:"b",type:"number"}],outputs:[{name:"result",type:"number"}],codeGenerator:({inputs:i,outputs:e})=>`const ${e.result} = ${i.a} % ${i.b};`});B.defineNode({name:"Equal",category:"operator",inputs:[{name:"a",type:"number"},{name:"b",type:"number"}],outputs:[{name:"result",type:"boolean"}],codeGenerator:({inputs:i,outputs:e})=>`const ${e.result} = ${i.a} === ${i.b};`});B.defineNode({name:"Not Equal",category:"operator",inputs:[{name:"a",type:"number"},{name:"b",type:"number"}],outputs:[{name:"result",type:"boolean"}],codeGenerator:({inputs:i,outputs:e})=>`const ${e.result} = ${i.a} !== ${i.b};`});B.defineNode({name:"Less Than",category:"operator",inputs:[{name:"a",type:"number"},{name:"b",type:"number"}],outputs:[{name:"result",type:"boolean"}],codeGenerator:({inputs:i,outputs:e})=>`const ${e.result} = ${i.a} < ${i.b};`});B.defineNode({name:"Greater Than",category:"operator",inputs:[{name:"a",type:"number"},{name:"b",type:"number"}],outputs:[{name:"result",type:"boolean"}],codeGenerator:({inputs:i,outputs:e})=>`const ${e.result} = ${i.a} > ${i.b};`});B.defineNode({name:"And",category:"operator",inputs:[{name:"a",type:"boolean"},{name:"b",type:"boolean"}],outputs:[{name:"result",type:"boolean"}],codeGenerator:({inputs:i,outputs:e})=>`const ${e.result} = ${i.a} && ${i.b};`});B.defineNode({name:"Or",category:"operator",inputs:[{name:"a",type:"boolean"},{name:"b",type:"boolean"}],outputs:[{name:"result",type:"boolean"}],codeGenerator:({inputs:i,outputs:e})=>`const ${e.result} = ${i.a} || ${i.b};`});B.defineNode({name:"Not",category:"operator",inputs:[{name:"a",type:"boolean"}],outputs:[{name:"result",type:"boolean"}],codeGenerator:({inputs:i,outputs:e})=>`const ${e.result} = !${i.a};`});B.defineNode({name:"Number to String",category:"type-conversion",inputs:[{name:"input",type:"number"}],outputs:[{name:"output",type:"string"}],codeGenerator:({inputs:i,outputs:e})=>`const ${e.output} = String(${i.input});`});B.defineNode({name:"String to Number",category:"type-conversion",inputs:[{name:"input",type:"string"}],outputs:[{name:"output",type:"number"}],codeGenerator:({inputs:i,outputs:e})=>`const ${e.output} = Number(${i.input});`});B.defineNode({name:"Boolean to String",category:"type-conversion",inputs:[{name:"input",type:"boolean"}],outputs:[{name:"output",type:"string"}],codeGenerator:({inputs:i,outputs:e})=>`const ${e.output} = String(${i.input});`});B.defineNode({name:"If",category:"flow",inputs:[{name:"condition",type:"boolean"}],outputs:[],flowInputs:["exec"],flowOutputs:["then","else"],codeGenerator:({inputs:i,body:e})=>`if (${i.condition}) {
${e.then}
} else {
${e.else}
}`});B.defineNode({name:"While",category:"flow",inputs:[{name:"condition",type:"boolean"}],outputs:[],flowInputs:["exec"],flowOutputs:["body"],codeGenerator:({inputs:i,body:e})=>`while (${i.condition}) {
${e.body}
}`});B.defineNode({name:"For Loop",category:"flow",inputs:[{name:"count",type:"number"}],outputs:[{name:"index",type:"number"}],flowInputs:["exec"],flowOutputs:["body"],codeGenerator:({inputs:i,outputs:e,body:t})=>`for (let ${e.index} = 0; ${e.index} < ${i.count}; ${e.index}++) {
${t.body}
}`});B.defineNode({name:"Console Log",category:"function",inputs:[{name:"message",type:"string"}],outputs:[],codeGenerator:({inputs:i})=>`console.log(${i.message});`});B.defineNode({name:"String Concat",category:"function",inputs:[{name:"a",type:"string"},{name:"b",type:"string"}],outputs:[{name:"result",type:"string"}],codeGenerator:({inputs:i,outputs:e})=>`const ${e.result} = ${i.a} + ${i.b};`});B.defineNode({name:"Reroute",category:"reroute",inputs:[{name:"in",type:"any"}],outputs:[{name:"out",type:"any"}]});B.defineNode({name:"Comment",category:"comment",inputs:[],outputs:[]});B.setFunctionCodeGenerator(i=>{let e=i.inputs.map(n=>n.valueId).join(", "),t=i.outputs.length>0?`
    return ${i.outputs[0].valueId};`:"";return`function ${i.name}(${e}) {
${i.bodyCode}${t}
}`});B.defineMainFunction({name:"main",label:"Main",editableByUser:!0,inputs:{},outputs:{},events:[{name:"OnStart",outputs:[]},{name:"OnTick",outputs:[{name:"deltaTime",type:"number"}]}]});B.setPreview(i=>{Oe=document.createElement("pre"),Oe.style.cssText='color: #cdd6f4; margin: 0; padding: 8px; font-family: "Cascadia Code", "Fira Code", monospace; font-size: 13px; white-space: pre-wrap; word-break: break-all;',i.appendChild(Oe)},i=>{if(Oe)try{let e=`
                const __logs = [];
                const console = { log: function() { __logs.push(Array.prototype.slice.call(arguments).map(String).join(' ')); } };
                ${i}
                if (typeof main === 'function') { main(); }
                return __logs;
            `,n=new Function(e)();n.length>0?(Oe.textContent=n.join(`
`),Oe.style.color="#cdd6f4"):(Oe.textContent="(no output)",Oe.style.color="#6c7086")}catch(e){Oe.textContent=`Error: ${e.message??e}`,Oe.style.color="#f38ba8"}});$c=new gr(B);$c.appendTo(document.body);$c.file=new Wt});(()=>{let i=new WebSocket("ws://127.0.0.1:8088");i.addEventListener("open",()=>{console.log("Refresh connection established")}),i.addEventListener("message",e=>{console.log("Bundle finished. Start refresh"),e.data==="REFRESH"&&window.location.reload()})})();Promise.resolve().then(()=>Hc());
//# sourceMappingURL=page.js.map
