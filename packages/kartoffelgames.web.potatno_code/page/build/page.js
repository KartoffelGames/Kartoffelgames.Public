var Ic=Object.create;var or=Object.defineProperty;var wc=Object.getOwnPropertyDescriptor;var Jo=(i,e)=>(e=Symbol[i])?e:Symbol.for("Symbol."+i),Tt=i=>{throw TypeError(i)};var Qo=(i,e,t)=>e in i?or(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t;var Yo=(i,e)=>or(i,"name",{value:e,configurable:!0});var p=(i,e)=>()=>(i&&(e=i(i=0)),e);var E=i=>[,,,Ic(i?.[Jo("metadata")]??null)],ei=["class","method","getter","setter","accessor","field","value","get","set"],$t=i=>i!==void 0&&typeof i!="function"?Tt("Function expected"):i,Ec=(i,e,t,n,r)=>({kind:ei[i],name:e,metadata:n,addInitializer:o=>t._?Tt("Already initialized"):r.push($t(o||null))}),kc=(i,e)=>Qo(e,Jo("metadata"),i[3]),c=(i,e,t,n)=>{for(var r=0,o=i[e>>1],s=o&&o.length;r<s;r++)e&1?o[r].call(t):n=o[r].call(t,n);return n},m=(i,e,t,n,r,o)=>{var s,a,l,u,h,d=e&7,T=!!(e&8),f=!!(e&16),I=d>3?i.length+1:d?T?1:2:0,N=ei[d+5],b=d>3&&(i[I-1]=[]),D=i[I]||(i[I]=[]),P=d&&(!f&&!T&&(r=r.prototype),d<5&&(d>3||!f)&&wc(d<4?r:{get[t](){return _o(this,o)},set[t](Z){return qo(this,o,Z)}},t));d?f&&d<4&&Yo(o,(d>2?"set ":d>1?"get ":"")+t):Yo(r,t);for(var Ee=n.length-1;Ee>=0;Ee--)u=Ec(d,t,l={},i[3],D),d&&(u.static=T,u.private=f,h=u.access={has:f?Z=>Ac(r,Z):Z=>t in Z},d^3&&(h.get=f?Z=>(d^1?_o:Dc)(Z,r,d^4?o:P.get):Z=>Z[t]),d>2&&(h.set=f?(Z,v)=>qo(Z,r,v,d^4?o:P.set):(Z,v)=>Z[t]=v)),a=(0,n[Ee])(d?d<4?f?o:P[N]:d>4?void 0:{get:P.get,set:P.set}:r,u),l._=1,d^4||a===void 0?$t(a)&&(d>4?b.unshift(a):d?f?o=a:P[N]=a:r=a):typeof a!="object"||a===null?Tt("Object expected"):($t(s=a.get)&&(P.get=s),$t(s=a.set)&&(P.set=s),$t(s=a.init)&&b.unshift(s));return d||kc(i,r),P&&or(r,t,P),f?d^4?o:P:r},y=(i,e,t)=>Qo(i,typeof e!="symbol"?e+"":e,t),ir=(i,e,t)=>e.has(i)||Tt("Cannot "+t),Ac=(i,e)=>Object(e)!==e?Tt('Cannot use the "in" operator on this value'):i.has(e),_o=(i,e,t)=>(ir(i,e,"read from private field"),t?t.call(i):e.get(i)),k=(i,e,t)=>e.has(i)?Tt("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(i):e.set(i,t),qo=(i,e,t,n)=>(ir(i,e,"write to private field"),n?n.call(i,t):e.set(i,t),t),Dc=(i,e,t)=>(ir(i,e,"access private method"),t);var Ae,sr=p(()=>{Ae=class{mData;mInteractionTrigger;mInteractionType;mOrigin;mStackError;get data(){return this.mData}get origin(){return this.mOrigin}get stacktrace(){return this.mStackError}get trigger(){return this.mInteractionTrigger}get type(){return this.mInteractionType}constructor(e,t,n,r){this.mInteractionType=e,this.mInteractionTrigger=t,this.mData=r,this.mStackError=new Error,this.mOrigin=n}toString(){return`${this.origin.name} -> ${this.type[this.trigger]} - ${this.data.toString()}`}}});var Y,ar=p(()=>{Y=class i extends Array{static newListWith(...e){let t=new i;return t.push(...e),t}clear(){this.splice(0,this.length)}clone(){return i.newListWith(...this)}distinct(){return i.newListWith(...new Set(this))}equals(e){if(this===e)return!0;if(!e||this.length!==e.length)return!1;for(let t=0;t<this.length;++t)if(this[t]!==e[t])return!1;return!0}remove(e){let t=this.indexOf(e);if(t!==-1)return this.splice(t,1)[0]}replace(e,t){let n=this.indexOf(e);if(n!==-1){let r=this[n];return this[n]=t,r}}toString(){return`[${super.join(", ")}]`}}});var g,vt=p(()=>{g=class extends Error{mTarget;get target(){return this.mTarget}constructor(e,t,n){super(e,n),this.mTarget=t}}});var A,ti=p(()=>{ar();vt();A=class i extends Map{add(e,t){if(!this.has(e))this.set(e,t);else throw new g("Can't add duplicate key to dictionary.",this)}clone(){return new i(this)}getAllKeysOfValue(e){return[...this.entries()].filter(r=>r[1]===e).map(r=>r[0])}getOrDefault(e,t){let n=this.get(e);return typeof n<"u"?n:t}map(e){let t=new Y;for(let n of this){let r=e(n[0],n[1]);t.push(r)}return t}}});var Ce,ni=p(()=>{Ce=class i{mSize;mTopItem;get size(){return this.mSize}get top(){if(this.mTopItem)return this.mTopItem.value}constructor(){this.mTopItem=null,this.mSize=0}clone(){let e=new i;return e.mTopItem=this.mTopItem,e.mSize=this.mSize,e}*entries(){let e=this.mTopItem;for(;e!==null;)yield e.value,e=e.previous}flush(){let e=new Array;for(;this.mTopItem;)e.push(this.pop());return e}pop(){if(!this.mTopItem)return;let e=this.mTopItem.value;return this.mTopItem=this.mTopItem.previous,this.mSize--,e}push(e){let t={previous:this.mTopItem,value:e};this.mTopItem=t,this.mSize++}toArray(){return[...this.entries()]}}});var ri=p(()=>{});var oi=p(()=>{vt()});var ii=p(()=>{});var si=p(()=>{});var zt,ai=p(()=>{zt=class{mCompareFunction;constructor(e){this.mCompareFunction=e}differencesOf(e,t){let n={1:{x:0,history:[]}},r=u=>u-1,o=e.length,s=t.length,a,l;for(let u=0;u<o+s+1;u++)for(let h=-u;h<u+1;h+=2){let d=h===-u||h!==u&&n[h-1].x<n[h+1].x;if(d){let f=n[h+1];l=f.x,a=f.history}else{let f=n[h-1];l=f.x+1,a=f.history}a=a.slice();let T=l-h;for(1<=T&&T<=s&&d?a.push({changeState:2,item:t[r(T)]}):1<=l&&l<=o&&a.push({changeState:1,item:e[r(l)]});l<o&&T<s&&this.mCompareFunction(e[r(l+1)],t[r(T+1)]);)l+=1,T+=1,a.push({changeState:3,item:e[r(l)]});if(l>=o&&T>=s)return a;n[h]={x:l,history:a}}return new Array}}});var li=p(()=>{});var lr=p(()=>{});var ci=p(()=>{});var Nn=p(()=>{vt()});var cr=p(()=>{vt();Nn()});var pi=p(()=>{lr();cr();Nn()});var L=p(()=>{ti();ar();ni();vt();ri();oi();ii();si();ai();li();lr();ci();cr();pi();Nn()});var $e,ur=p(()=>{$e=class i{static mAsyncronErrorZones=new WeakMap;static mSynchronErrorZones=new WeakMap;static allocateAsyncronError(e,t){i.mAsyncronErrorZones.set(e,t)}static allocateSyncronError(e,t){let n=typeof e=="object"&&e!==null?e:new Error(e);return i.mSynchronErrorZones.set(n,t),n}static getAsyncronErrorZone(e){return i.mAsyncronErrorZones.get(e)}static getSyncronErrorZone(e){return i.mSynchronErrorZones.get(e)}}});var Sn,di=p(()=>{L();ur();pr();Sn=class i{static enable(e){if(e.target.globalPatched)return!1;e.target.globalPatched=!0;let t=e.target,n=new i;{let r=e.patches.requirements.promise;t[r]=n.patchPromise(t[r]);let o=e.patches.requirements.eventTarget;t[o]=n.patchEventTarget(t[o])}n.patchOnEvents(t);for(let r of e.patches.functions??[])t[r]=n.patchFunctionCallbacks(t[r]);if(!e.patches.classes)return!0;for(let r of e.patches.classes.callback??[]){let o=t[r];o=n.patchClass(o),t[r]=o}for(let r of e.patches.classes.eventTargets??[]){let o=t[r];n.patchOnEvents(o.prototype)}return!0}callInZone(e,t){return function(...n){return t.execute(()=>e(...n))}}patchClass(e){if(typeof e!="function")return e;let t=this,n=class extends e{constructor(...r){let o=U.current;for(let s=0;s<r.length;s++){let a=r[s];typeof a=="function"&&(r[s]=t.callInZone(t.patchFunctionCallbacks(a),o))}super(...r)}};return this.patchMethods(n),n}patchEventTarget(e){let t=e.prototype,n=this,r=new WeakMap,o=t.addEventListener,s=t.removeEventListener;return Object.defineProperty(t,"addEventListener",{configurable:!1,writable:!1,value:function(a,l,u){if(l===null||typeof l!="function"&&!(typeof l=="object"&&"handleEvent"in l)){o.call(this,a,l,u);return}let h=r.get(l);if(!h){let d=U.current;typeof l=="function"?h=n.callInZone(l,d):h=n.callInZone(l.handleEvent.bind(l),d)}r.set(l,h),o.call(this,a,h,u)}}),Object.defineProperty(t,"removeEventListener",{configurable:!1,writable:!1,value:function(a,l,u){if(l===null||typeof l!="function"&&!(typeof l=="object"&&"handleEvent"in l)){s.call(this,a,l,u);return}let h=r.get(l)??l;s.call(this,a,h,u)}}),e}patchFunctionCallbacks(e){let t=this;return function(...n){let r=U.current;for(let o=0;o<n.length;o++){let s=n[o];typeof s=="function"&&(n[o]=t.callInZone(t.patchFunctionCallbacks(s),r))}return r.execute(()=>e.call(this,...n))}}patchMethods(e){if(typeof e!="function")return e;let t=o=>{if(o===null||o.constructor===Object)return new A;let s=new A;for(let a of Object.getOwnPropertyNames(o)){if(a==="constructor")continue;let l=Object.getOwnPropertyDescriptor(o,a);l&&typeof l.value=="function"&&s.set(a,l)}for(let[a,l]of t(Object.getPrototypeOf(o)))s.has(a)||s.set(a,l);return s},n=e.prototype,r=t(n);for(let[o,s]of r)s.configurable&&(s.value=this.patchFunctionCallbacks(s.value),Object.defineProperty(n,o,s))}patchOnEvents(e){if(!e||!(e instanceof EventTarget))return;let t=r=>{if(r===null)return new A;let o=new A;for(let s of Object.getOwnPropertyNames(r)){if(!s.startsWith("on"))continue;let a=Object.getOwnPropertyDescriptor(r,s);a&&typeof a.value!="function"&&o.set(s.substring(2),a)}for(let[s,a]of t(Object.getPrototypeOf(r)))o.has(s)||o.set(s,a);return o},n=t(e);for(let[r,o]of n){if(!o.configurable)continue;let s=`on${r}`;delete o.writable,delete o.value;let a=new WeakMap;o.set=function(l){let u=a.get(this);(typeof u=="function"||typeof u=="object")&&this.removeEventListener(r,u),a.set(this,l),(typeof l=="function"||typeof l=="object")&&this.addEventListener(r,l)},o.get=function(){return a.get(this)},Object.defineProperty(e,s,o)}}patchPromise(e){let t=e;class n extends t{constructor(o){super(o),$e.allocateAsyncronError(this,U.current)}}return this.patchMethods(n),n}}});var U,pr=p(()=>{L();ur();sr();di();U=class i{static mCurrentZone=new i("Default",null,!0);static get current(){return i.mCurrentZone}static enableGlobalTracing(e){if(!Sn.enable(e))return!1;if(!e.errorHandling)return!0;let t=e.target;if(!("addEventListener"in t)||typeof t.addEventListener!="function")throw new g("Global scope does not support addEventListener",i);let n=(r,o,s)=>{s&&s.callErrorListener(o)&&r.preventDefault()};return t.addEventListener("error",r=>{typeof r.error!="object"||r.error===null||n(r,r.error,$e.getSyncronErrorZone(r.error))}),t.addEventListener("unhandledrejection",r=>{n(r,r.reason,$e.getAsyncronErrorZone(r.promise))}),!0}static pushInteraction(e,t,n){if(((this.mCurrentZone.mTriggerMapping.get(e)??-1)&t)===0)return!1;let o=new Ae(e,t,this.mCurrentZone,n);return this.mCurrentZone.callInteractionListener(o)}mAttachments;mErrorListener;mInteractionListener;mIsolated;mName;mParent;mTriggerMapping;get name(){return this.mName}get parent(){return this.mParent}constructor(e,t,n){this.mAttachments=new Map,this.mErrorListener=new A,this.mName=e,this.mTriggerMapping=new A,this.mInteractionListener=new A,this.mParent=t,this.mIsolated=n}addErrorListener(e){return this.mErrorListener.set(e,i.current),this}addInteractionListener(e,t){return this.mInteractionListener.has(e)||this.mInteractionListener.set(e,new A),this.mInteractionListener.get(e).set(t,i.current),this}addTriggerRestriction(e,t){return this.mTriggerMapping.set(e,t),this}attachment(e,t){if(typeof t<"u")return this.mAttachments.set(e,t),t;let n=this.mAttachments.get(e);if(typeof n<"u")return n;if(!this.mIsolated)return this.mParent.attachment(e)}create(e,t){return new i(e,this,t?.isolate===!0)}execute(e,...t){let n=i.mCurrentZone;i.mCurrentZone=this;let r;try{r=e(...t)}catch(o){throw $e.allocateSyncronError(o,i.mCurrentZone)}finally{i.mCurrentZone=n}return r}removeErrorListener(e){return this.mErrorListener.delete(e),this}removeInteractionListener(e,t){if(!t)return this.mInteractionListener.delete(e),this;let n=this.mInteractionListener.get(e);return n?(n.delete(t),this):this}callErrorListener(e){return this.execute(()=>{for(let[n,r]of this.mErrorListener.entries())if(r.execute(()=>n.call(this,e))===!1)return!0;return!1})?!0:this.mIsolated?!1:this.parent.callErrorListener(e)}callInteractionListener(e){if(((this.mTriggerMapping.get(e.type)??-1)&e.trigger)===0)return!1;let n=this.mInteractionListener.get(e.type);return n&&n.size>0&&this.execute(()=>{for(let[r,o]of n.entries())o.execute(()=>{r.call(this,e)})}),this.mIsolated?!0:this.parent.callInteractionListener(e)}}});var Ht=p(()=>{sr();pr()});var oe,Ct=p(()=>{L();oe=class i{static mComponents=new WeakMap;static mConstructorSelector=new WeakMap;static mElements=new WeakMap;static ofComponent(e){let t=e.processorConstructor,n=i.mConstructorSelector.get(t);if(!n)throw new g(`Constructor "${t.name}" is not a registered custom element`,t);let r=i.mElements.get(e);if(!r)throw new g(`Component "${e}" is not a registered component`,e);let o;return e.isProcessorCreated&&(o=e.processor),{selector:n,constructor:t,element:r,component:e,processor:o}}static ofConstructor(e){let t=i.mConstructorSelector.get(e);if(!t)throw new g(`Constructor "${e.name}" is not a registered custom element`,e);let n=globalThis.customElements.get(t);if(!n)throw new g(`Constructor "${e.name}" is not a registered custom element`,e);return{selector:t,constructor:e,elementConstructor:n}}static ofElement(e){let t=i.mComponents.get(e);if(!t)throw new g(`Element "${e}" is not a PwbComponent.`,e);return i.ofComponent(t)}static ofProcessor(e){let t=i.mComponents.get(e);if(!t)throw new g("Processor is not a PwbComponent.",e);return i.ofComponent(t)}static registerComponent(e,t,n){i.mComponents.has(t)||i.mComponents.set(t,e),n&&!i.mComponents.has(n)&&i.mComponents.set(n,e),i.mElements.has(e)||i.mElements.set(e,t)}static registerConstructor(e,t){e&&!i.mConstructorSelector.has(e)&&i.mConstructorSelector.set(e,t)}}});var xt=p(()=>{});var Pt,dr=p(()=>{xt();Pt=class i{static DEFAULT=(()=>{let e=new i;return e.mSpashscreenConfiguration.background="blue",e.mSpashscreenConfiguration.content="",e.mSpashscreenConfiguration.manual=!1,e.mSpashscreenConfiguration.animationTime=1e3,e.mErrorConfiguration.ignore=!1,e.mErrorConfiguration.print=!0,e.mLoggingConfiguration.filter=7,e.mLoggingConfiguration.updatePerformance=!1,e.mLoggingConfiguration.updaterTrigger=!1,e.mLoggingConfiguration.updateReshedule=!1,e.mUpdatingConfiguration.frameTime=100,e.mUpdatingConfiguration.stackCap=10,e})();mErrorConfiguration;mLoggingConfiguration;mSpashscreenConfiguration;mUpdatingConfiguration;get error(){return this.mErrorConfiguration}get logging(){return this.mLoggingConfiguration}get splashscreen(){return this.mSpashscreenConfiguration}get updating(){return this.mUpdatingConfiguration}constructor(){this.mSpashscreenConfiguration={background:i.DEFAULT?.mSpashscreenConfiguration.background,content:i.DEFAULT?.mSpashscreenConfiguration.content,manual:i.DEFAULT?.mSpashscreenConfiguration.manual,animationTime:i.DEFAULT?.mSpashscreenConfiguration.animationTime},this.mErrorConfiguration={ignore:i.DEFAULT?.mErrorConfiguration.ignore,print:i.DEFAULT?.mErrorConfiguration.print},this.mLoggingConfiguration={filter:i.DEFAULT?.mLoggingConfiguration.filter,updatePerformance:i.DEFAULT?.mLoggingConfiguration.updatePerformance,updaterTrigger:i.DEFAULT?.mLoggingConfiguration.updaterTrigger,updateReshedule:i.DEFAULT?.mLoggingConfiguration.updateReshedule},this.mUpdatingConfiguration={frameTime:i.DEFAULT?.mUpdatingConfiguration.frameTime,stackCap:i.DEFAULT?.mUpdatingConfiguration.stackCap}}print(e,...t){(e&this.mLoggingConfiguration.filter)!==0&&console.log(...t)}}});var tt,mi=p(()=>{Ht();Ct();dr();tt=class i{static CONFIGURATION_ATTACHMENT=Symbol("PwbApplicationConfigurationAttachment");static new(e,t,n){let r=new Pt,o=new i(e,r);t(o),n&&o.appendTo(n)}mConfiguration;mContent;mElement;mInteractionZone;get configuration(){return this.mConfiguration}constructor(e,t){this.mInteractionZone=U.current.create(`App-${e}`,{isolate:!0}),this.mInteractionZone.attachment(i.CONFIGURATION_ATTACHMENT,t),this.mConfiguration=t,this.mContent=new Array,this.mElement=document.createElement("div"),this.mElement.attachShadow({mode:"open"})}addContent(e){let t=oe.ofConstructor(e).elementConstructor;this.mInteractionZone.execute(()=>{let n=oe.ofElement(new t);this.mContent.push(n.component),this.mElement.shadowRoot.appendChild(n.element)})}addErrorListener(e){this.mInteractionZone.addErrorListener(e)}addStyle(e){let t=document.createElement("style");t.textContent=e,this.mElement.shadowRoot.prepend(t)}appendTo(e){e.appendChild(this.mElement)}}});var It,mr=p(()=>{L();It=class{mCustomMetadata;constructor(){this.mCustomMetadata=new A}getMetadata(e){return this.mCustomMetadata.get(e)??null}setMetadata(e,t){this.mCustomMetadata.set(e,t)}}});var Kt,hr=p(()=>{mr();Kt=class extends It{}});var Xt,gr=p(()=>{L();mr();hr();Xt=class i extends It{static mPrivateMetadataKey=Symbol("Metadata");mDecoratorMetadataObject;mPropertyMetadata;constructor(e){super(),this.mDecoratorMetadataObject=e,this.mPropertyMetadata=new A,e[i.mPrivateMetadataKey]=this}getInheritedMetadata(e){let t=new Array,n=this.mDecoratorMetadataObject;do{if(Object.hasOwn(n,i.mPrivateMetadataKey)){let o=n[i.mPrivateMetadataKey].getMetadata(e);o!==null&&t.push(o)}n=Object.getPrototypeOf(n)}while(n!==null);return t.reverse()}getProperty(e){return this.mPropertyMetadata.has(e)||this.mPropertyMetadata.add(e,new Kt),this.mPropertyMetadata.get(e)}}});var ie,yr=p(()=>{L();gr();Symbol.metadata??=Symbol("Symbol.metadata");ie=class i{static mMetadataMapping=new A;static add(e,t){return(n,r)=>{let o=i.forInternalDecorator(r.metadata);switch(r.kind){case"class":o.setMetadata(e,t);return;case"method":case"field":case"getter":case"setter":case"accessor":if(r.static)throw new Error("@Metadata.add not supported for statics.");o.getProperty(r.name).setMetadata(e,t);return}}}static forInternalDecorator(e){return i.mapMetadata(e)}static get(e){Object.hasOwn(e,Symbol.metadata)||i.polyfillMissingMetadata(e);let t=e[Symbol.metadata];return i.mapMetadata(t)}static init(){return(e,t)=>{i.forInternalDecorator(t.metadata)}}static mapMetadata(e){if(i.mMetadataMapping.has(e))return i.mMetadataMapping.get(e);let t=new Xt(e);return i.mMetadataMapping.set(e,t),t}static polyfillMissingMetadata(e){let t=new Array,n=e;do t.push(n),n=Object.getPrototypeOf(n);while(n!==null);for(let r=t.length-1;r>=0;r--){let o=t[r];if(!Object.hasOwn(o,Symbol.metadata)){let s=null;r<t.length-2&&(s=t[r+1][Symbol.metadata]),o[Symbol.metadata]=Object.create(s,{})}}}}});var x,hi=p(()=>{L();yr();x=class i{static mCurrentInjectionContext=null;static mInjectMode=new A;static mInjectableConstructor=new A;static mInjectableReplacement=new A;static mInjectionConstructorIdentificationMetadataKey=Symbol("InjectionConstructorIdentification");static mSingletonMapping=new A;static createObject(e,t,n){let[r,o]=typeof t=="object"&&t!==null?[!1,t]:[!!t,n??new A],s=i.getInjectionIdentification(e);if(!i.mInjectableConstructor.has(s))throw new g(`Constructor "${e.name}" is not registered for injection and can not be built`,i);let a=r?"instanced":i.mInjectMode.get(s),l=new A(o.map((d,T)=>[i.getInjectionIdentification(d),T])),u=i.mCurrentInjectionContext,h=new A([...u?.localInjections.entries()??[],...l.entries()]);i.mCurrentInjectionContext={injectionMode:a,localInjections:h};try{if(!r&&a==="singleton"&&i.mSingletonMapping.has(s))return i.mSingletonMapping.get(s);let d=new e;return a==="singleton"&&!i.mSingletonMapping.has(s)&&i.mSingletonMapping.add(s,d),d}finally{i.mCurrentInjectionContext=u}}static injectable(e="instanced"){return(t,n)=>{i.registerInjectable(t,n.metadata,e)}}static registerInjectable(e,t,n){let r=i.getInjectionIdentification(e,t);i.mInjectableConstructor.add(r,e),i.mInjectMode.add(r,n)}static replaceInjectable(e,t){let n=i.getInjectionIdentification(e);if(!i.mInjectableConstructor.has(n))throw new g("Original constructor is not registered.",i);let r=i.getInjectionIdentification(t);if(!i.mInjectableConstructor.has(r))throw new g("Replacement constructor is not registered.",i);i.mInjectableReplacement.set(n,t)}static use(e){if(i.mCurrentInjectionContext===null)throw new g("Can't create object outside of an injection context.",i);let t=i.getInjectionIdentification(e);if(i.mCurrentInjectionContext.injectionMode!=="singleton"&&i.mCurrentInjectionContext.localInjections.has(t))return i.mCurrentInjectionContext.localInjections.get(t);let n=i.mInjectableReplacement.get(t);if(n||(n=i.mInjectableConstructor.get(t)),!n)throw new g(`Constructor "${e.name}" is not registered for injection and can not be built`,i);return i.createObject(n)}static getInjectionIdentification(e,t){let n=t?ie.forInternalDecorator(t):ie.get(e),r=n.getMetadata(i.mInjectionConstructorIdentificationMetadataKey);return r||(r=Symbol(e.name),n.setMetadata(i.mInjectionConstructorIdentificationMetadataKey,r)),r}}});var K=p(()=>{hi();yr();gr();hr()});var fr=p(()=>{});var De=p(()=>{});var $,ne=p(()=>{$=(a=>(a[a.None=0]="None",a[a.PropertySet=4]="PropertySet",a[a.PropertyDelete=8]="PropertyDelete",a[a.UntrackableFunctionCall=16]="UntrackableFunctionCall",a[a.Manual=32]="Manual",a[a.InputChange=64]="InputChange",a[a.Any=127]="Any",a))($||{})});var pe,wt=p(()=>{Ht();ne();pe=class i{static IGNORED_CLASSES=(()=>{let e=new WeakSet;return e.add(i),e.add(U),e.add(Ae),e})();static ORIGINAL_TO_INTERACTION_MAPPING=new WeakMap;static PROXY_TO_ORIGINAL_MAPPING=new WeakMap;static UNTRACEABLE_FUNCTION_UPDATE_TRIGGER=(()=>{let e=new WeakMap;return e.set(Array.prototype.fill,4),e.set(Array.prototype.pop,8),e.set(Array.prototype.push,4),e.set(Array.prototype.shift,8),e.set(Array.prototype.unshift,4),e.set(Array.prototype.splice,4),e.set(Array.prototype.reverse,4),e.set(Array.prototype.sort,4),e.set(Array.prototype.concat,4),e.set(Map.prototype.clear,8),e.set(Map.prototype.delete,8),e.set(Map.prototype.set,4),e.set(Set.prototype.clear,8),e.set(Set.prototype.delete,8),e.set(Set.prototype.add,4),e})();static createCoreEntityCreationData(e,t){return{source:e,property:t,toString:function(){let n=typeof this.source;return"constructor"in this.source&&(n=this.source.constructor.name),this.property?`[ ${n} => ${this.property.toString()} ]`:`[ ${n} ]`}}}static getOriginal(e){return i.PROXY_TO_ORIGINAL_MAPPING.get(e)??e}static ignoreClass(e){i.IGNORED_CLASSES.add(e)}static getWrapper(e){let t=i.getOriginal(e);return i.ORIGINAL_TO_INTERACTION_MAPPING.get(t)}mListenerZones;mProxyObject;get proxy(){return this.mProxyObject}constructor(e){let t=i.getWrapper(e);if(t)return t;this.mListenerZones=new Set,i.IGNORED_CLASSES.has(Object.getPrototypeOf(e)?.constructor)?this.mProxyObject=e:this.mProxyObject=this.createProxyObject(e),i.PROXY_TO_ORIGINAL_MAPPING.set(this.mProxyObject,e),i.ORIGINAL_TO_INTERACTION_MAPPING.set(e,this)}addListenerZone(e){this.mListenerZones.has(e)||this.mListenerZones.add(e)}convertToProxy(e){if(e===null||typeof e!="object"&&typeof e!="function")return e;let t=new i(e);for(let n of this.mListenerZones)t.addListenerZone(n);return t.proxy}createProxyObject(e){let t=(r,o,s)=>{let a=i.getOriginal(o);try{let l=r.call(a,...s);return this.convertToProxy(l)}finally{i.UNTRACEABLE_FUNCTION_UPDATE_TRIGGER.has(r)?this.dispatch(i.UNTRACEABLE_FUNCTION_UPDATE_TRIGGER.get(r),o):this.dispatch(16,this.mProxyObject)}};return new Proxy(e,{apply:(r,o,s)=>{this.addListenerZone(U.current);let a=r;try{let l=a.call(o,...s);return this.convertToProxy(l)}catch(l){if(!(l instanceof TypeError))throw l;return t(a,o,s)}},set:(r,o,s)=>{this.addListenerZone(U.current);try{let a=s;return(a!==null&&typeof a=="object"||typeof a=="function")&&(a=i.getOriginal(a)),Reflect.set(r,o,a)}finally{this.dispatch(4,this.mProxyObject,o)}},get:(r,o,s)=>{this.addListenerZone(U.current);let a=Reflect.get(r,o);return this.convertToProxy(a)},deleteProperty:(r,o)=>{this.addListenerZone(U.current);try{return delete r[o]}finally{this.dispatch(8,this.mProxyObject,o)}}})}dispatch(e,t,n){if(U.pushInteraction($,e,i.createCoreEntityCreationData(t,n)))for(let o of this.mListenerZones)o.execute(()=>{U.pushInteraction($,e,i.createCoreEntityCreationData(t,n))})}}});var w,se=p(()=>{wt();w=class i{static mEnableTrackingOnConstruction=!1;static enableTrackingOnConstruction(e){let t=i.mEnableTrackingOnConstruction;i.mEnableTrackingOnConstruction=!0;try{return e()}finally{i.mEnableTrackingOnConstruction=t}}constructor(){if(i.mEnableTrackingOnConstruction)return new pe(this).proxy}}});function gi(){return i=>{pe.ignoreClass(i)}}var yi=p(()=>{wt()});var ze,fi=p(()=>{ze=class i{static mCurrentUpdateCycle=null;static openResheduledCycle(e,t){let n=!1;if(!i.mCurrentUpdateCycle){let r=performance.now();i.mCurrentUpdateCycle={initiator:e.initiator,timeStamp:r,startTime:r,forcedSync:e.forcedSync,runner:e.runner},n=!0}try{return t(i.mCurrentUpdateCycle)}finally{n&&(i.mCurrentUpdateCycle=null)}}static openUpdateCycle(e,t){let n=!1;if(!i.mCurrentUpdateCycle){let r=performance.now();i.mCurrentUpdateCycle={initiator:e.updater,timeStamp:r,startTime:r,forcedSync:e.runSync,runner:{id:Symbol("Runner "+r),timestamp:r}},n=!0}try{return t(i.mCurrentUpdateCycle)}finally{n&&(i.mCurrentUpdateCycle=null)}}static updateCycleRunId(e,t){if(e.initiator===t){let n=performance.now(),r=e;r.runner={id:Symbol("Runner "+n),timestamp:n}}}static updateCyleStartTime(e){let t=performance.now(),n=e;n.startTime=t}}});var Mn,bi=p(()=>{Mn=class extends Error{mChain;get chain(){return this.mChain}constructor(e,t){let n=t.slice(-20).map(r=>r.toString()).join(`
`);super(`${e}: 
${n}`),this.mChain=[...t]}}});var Et,Ti=p(()=>{Et=class extends Error{constructor(){super("Update resheduled")}}});var vi,br,nt,Ci=p(()=>{L();Ht();xt();ne();wt();yi();fi();bi();Ti();vi=[gi()];nt=class{mApplicationContext;mInteractionZone;mLoggingType;mRegisteredObjects;mUpdateFunction;mUpdateRunCache;mUpdateStates;get zone(){return this.mInteractionZone}constructor(e){this.mUpdateRunCache=new WeakMap,this.mRegisteredObjects=new WeakMap,this.mUpdateFunction=e.onUpdate,this.mApplicationContext=e.applicationContext,this.mLoggingType=e.loggingType;let t=e.parent?.mInteractionZone??U.current,n=Math.floor(Math.random()*16777215).toString(16);this.mInteractionZone=t.create(`${e.label}-ProcessorZone (${n})`,{isolate:e.isolate}).addTriggerRestriction($,e.trigger),this.mUpdateStates={chainCompleteHooks:new Ce,async:{hasSheduledTask:!1,hasRunningTask:!1,sheduledTaskIsResheduled:!1},sync:{running:!1},cycle:{chainedTask:null}}}addUpdateTrigger(e){this.mInteractionZone.addInteractionListener($,t=>{(e&e)!==0&&this.runUpdateAsynchron(t,null)})}deconstruct(){this.mInteractionZone.removeInteractionListener($)}registerObject(e){if(this.mRegisteredObjects.has(e))return this.mRegisteredObjects.get(e).proxy;if(e instanceof EventTarget)for(let n of["input","change"])this.mInteractionZone.execute(()=>{e.addEventListener(n,()=>{U.pushInteraction($,64,pe.createCoreEntityCreationData(e,n))})});let t=new pe(e);return this.mRegisteredObjects.set(e,t),this.mRegisteredObjects.set(t.proxy,t),t.proxy}async resolveAfterUpdate(){return this.mUpdateStates.async.hasSheduledTask?new Promise((e,t)=>{this.mUpdateStates.chainCompleteHooks.push((n,r)=>{r?t(r):e(n)})}):!1}switchToUpdateZone(e){return this.mInteractionZone.execute(e)}update(){let e=new Ae($,32,this.mInteractionZone,pe.createCoreEntityCreationData(this,Symbol("Manual Update")));return this.runUpdateSynchron(e)}updateAsync(){let e=new Ae($,32,this.mInteractionZone,pe.createCoreEntityCreationData(this,Symbol("Manual Update")));this.runUpdateAsynchron(e,null)}executeTaskChain(e,t,n,r){if(r.size>this.mApplicationContext.updating.stackCap)throw new Mn("Call loop detected",r.toArray());let o=performance.now();if(!t.forcedSync&&o-t.startTime>this.mApplicationContext.updating.frameTime)throw new Et;r.push(e);let s=this.mInteractionZone.execute(()=>this.mUpdateFunction.call(this,e))||n;if(this.mApplicationContext.logging.updatePerformance){let l=performance.now();this.mApplicationContext.print(this.mLoggingType,"Update performance:",this.mInteractionZone.name,`
	`,"Cycle:",l-t.timeStamp,"ms",`
	`,"Runner:",l-t.runner.timestamp,"ms",`
	`,"  ","Id:",t.runner.id.toString(),`
	`,"Update:",l-o,"ms",`
	`,"  ","State:",s,`
	`,"  ","Chain: ",r.toArray().map(u=>u.toString()))}if(ze.updateCycleRunId(t,this),!this.mUpdateStates.cycle.chainedTask)return s;let a=this.mUpdateStates.cycle.chainedTask;return this.mUpdateStates.cycle.chainedTask=null,this.executeTaskChain(a,t,s,r)}releaseUpdateChainCompleteHooks(e,t){if(!this.mUpdateStates.chainCompleteHooks.top)return;let n;for(;n=this.mUpdateStates.chainCompleteHooks.pop();)n(e,t)}runUpdateAsynchron(e,t){if(this.mUpdateStates.async.hasRunningTask||this.mUpdateStates.async.sheduledTaskIsResheduled){this.mUpdateStates.cycle.chainedTask=e;return}if(this.mUpdateStates.async.hasSheduledTask)return;let n=r=>{this.mUpdateStates.async.hasRunningTask=!0,this.mUpdateStates.async.hasSheduledTask=!1,this.mUpdateStates.async.sheduledTaskIsResheduled=!1;let o=!1;try{this.runUpdateSynchron(e)}catch(s){s instanceof Et&&r.initiator===this&&(this.mApplicationContext.logging.updateReshedule&&this.mApplicationContext.print(this.mLoggingType,"Reshedule:",this.mInteractionZone.name,`
	`,"Cycle Performance",performance.now()-r.timeStamp,`
	`,"Runner Id:",r.runner.id.toString()),o=!0)}finally{this.mUpdateStates.async.hasRunningTask=!1}o&&this.runUpdateAsynchron(e,r)};this.mUpdateStates.async.hasSheduledTask=!0,t&&(this.mUpdateStates.async.sheduledTaskIsResheduled=!0),globalThis.requestAnimationFrame(()=>{t?ze.openResheduledCycle(t,n):ze.openUpdateCycle({updater:this,reason:e,runSync:!1},n)})}runUpdateSynchron(e){if(this.mApplicationContext.logging.updaterTrigger&&this.mApplicationContext.print(this.mLoggingType,"Update trigger:",this.mInteractionZone.name,`
	`,"Trigger:",e.toString(),`
	`,"Chained:",this.mUpdateStates.sync.running,`
	`,"Omitted:",!!this.mUpdateStates.cycle.chainedTask),this.mUpdateStates.sync.running)return this.mUpdateStates.cycle.chainedTask=e,!1;this.mUpdateStates.sync.running=!0;try{let t=ze.openUpdateCycle({updater:this,reason:e,runSync:!0},n=>{if(this.mUpdateRunCache.has(n.runner))return ze.updateCyleStartTime(n),this.mUpdateRunCache.get(n.runner);let r=this.executeTaskChain(e,n,!1,new Ce);return this.mUpdateRunCache.set(n.runner,r),r});return this.releaseUpdateChainCompleteHooks(t),t}catch(t){if(t instanceof Et)throw t;let n=t;if(t&&this.mApplicationContext.error.print&&this.mApplicationContext.print(7,t),this.mApplicationContext.error.ignore&&(this.mApplicationContext.print(this.mLoggingType,t),n=null),this.releaseUpdateChainCompleteHooks(!1,n),n)throw t;return!1}finally{this.mUpdateStates.sync.running=!1}}};br=E(null),nt=m(br,0,"CoreEntityUpdater",vi,nt),c(br,1,nt)});var Re,Rn=p(()=>{L();K();wt();se();Ci();Re=class{mApplicationContext;mHooks;mInjections;mIsLocked;mIsSetup;mProcessor;mProcessorConstructor;mTrackChanges;mUpdater;get applicationContext(){return this.mApplicationContext}get isProcessorCreated(){return!!this.mProcessor}get processor(){if(!this.mIsSetup)throw new g("Processor can not be build before calling setup.",this);return this.isProcessorCreated||(this.mProcessor=this.createProcessor()),this.mProcessor}get processorConstructor(){return this.mProcessorConstructor}constructor(e){if(!(e.constructor.prototype instanceof w))throw new g(`Constructor "${e.constructor.name}" does not extend`,this);if(this.mApplicationContext=e.applicationContext,this.mProcessorConstructor=e.constructor,this.mProcessor=null,this.mIsLocked=!1,this.mIsSetup=!1,this.mTrackChanges=e.trackConstructorChanges,this.mInjections=new A,this.mHooks={create:new Ce,setup:new Ce},e.parent)for(let[t,n]of e.parent.mInjections.entries())this.setProcessorAttributes(t,n);this.mUpdater=new nt({applicationContext:e.applicationContext,label:e.constructor.name,loggingType:e.loggingType,isolate:!!e.isolate,trigger:e.trigger,parent:e.parent?.mUpdater,onUpdate:()=>this.mIsSetup?this.onUpdate():!1})}call(e,t,...n){if(!this.isProcessorCreated&&!t)return null;let r=Reflect.get(this.processor,e);return typeof r!="function"?null:this.mUpdater.switchToUpdateZone(()=>r.apply(this.processor,n))}deconstruct(){this.mUpdater.deconstruct()}getProcessorAttribute(e){return this.mInjections.get(e)}registerObject(e){return this.mUpdater.registerObject(e)}setProcessorAttributes(e,t){if(this.mIsLocked)throw new g("Cant add injections to after construction.",this);this.mInjections.set(e,t)}setup(){if(this.mIsSetup)throw new g("Setup allready called.",this);this.mIsSetup=!0;let e;for(;e=this.mHooks.setup.pop();)e.apply(this);return this}update(){return this.mUpdater.update()}updateAsync(){this.mUpdater.updateAsync()}async waitForUpdate(){return this.mUpdater.resolveAfterUpdate()}addCreationHook(e){return this.mHooks.create.push(e),this}addSetupHook(e){return this.mHooks.setup.push(e),this}setAutoUpdate(e){this.mUpdater.addUpdateTrigger(e)}createProcessor(){this.mIsLocked=!0;let e=this.mUpdater.switchToUpdateZone(()=>this.mTrackChanges?w.enableTrackingOnConstruction(()=>x.createObject(this.mProcessorConstructor,this.mInjections)):x.createObject(this.mProcessorConstructor,this.mInjections));e=pe.getOriginal(e);let t;for(;t=this.mHooks.create.pop();){let n=t.call(this,e);n&&(e=n)}return e}}});var He,On=p(()=>{xt();Rn();He=class i extends Re{constructor(e,t,n,r){super({applicationContext:e,constructor:t,loggingType:4,parent:n,isolate:!1,trigger:r,trackConstructorChanges:!1}),this.setProcessorAttributes(i,this),this.addSetupHook(()=>{this.call("onExecute",!1)}).addSetupHook(()=>{let o=this.processor})}deconstruct(){this.call("onDeconstruct",!1),super.deconstruct()}onUpdate(){return!1}}});var Tr,de,rt=p(()=>{L();Rn();Tr=class i{static mInstance;mCoreEntityConstructor;mProcessorConstructorConfiguration;constructor(){if(i.mInstance)return i.mInstance;i.mInstance=this,this.mCoreEntityConstructor=new A,this.mProcessorConstructorConfiguration=new A}get(e){let t=this.mCoreEntityConstructor.get(e);if(!t)return new Array;let n=new Array;for(let r of t)n.push({processorConstructor:r,processorConfiguration:this.mProcessorConstructorConfiguration.get(r)});return n}register(e,t,n){this.mProcessorConstructorConfiguration.set(t,n);let r=e;do{if(!(r.prototype instanceof Re)&&r!==Re)break;this.mCoreEntityConstructor.has(r)||this.mCoreEntityConstructor.set(r,new Set),this.mCoreEntityConstructor.get(r).add(t)}while(r=Object.getPrototypeOf(r))}},de=new Tr});var kt,vr=p(()=>{De();On();Rn();rt();kt=class i extends Re{static mExtensionCache=new WeakMap;mExtensionList;constructor(e){super(e),this.mExtensionList=new Array,this.addSetupHook(()=>{this.executeExtensions()})}deconstruct(){for(let e of this.mExtensionList)e.deconstruct();super.deconstruct()}executeExtensions(){let e=(()=>{let n=i.mExtensionCache.get(this.processorConstructor);if(n)return n;let o=de.get(He).filter(a=>{for(let l of a.processorConfiguration.targetRestrictions)if(this instanceof l||this.processorConstructor.prototype instanceof l||this.processorConstructor===l)return!0;return!1}),s={read:o.filter(a=>a.processorConfiguration.access===1),write:o.filter(a=>a.processorConfiguration.access===3),readWrite:o.filter(a=>a.processorConfiguration.access===2)};return i.mExtensionCache.set(this.processorConstructor,s),s})(),t=[...e.write,...e.readWrite,...e.read];for(let n of t){let r=new He(this.applicationContext,n.processorConstructor,this,n.processorConfiguration.trigger);r.setup(),this.mExtensionList.push(r)}}}});var ot,Gn=p(()=>{L();ot=class{mExpression;mTemporaryValues;constructor(e,t,n){if(this.mTemporaryValues=new A,n.length>0)for(let r of n)this.mTemporaryValues.set(r,void 0);this.mExpression=this.createEvaluationFunktion(e,this.mTemporaryValues).bind(t.store)}execute(){return this.mExpression()}setTemporaryValue(e,t){if(!this.mTemporaryValues.has(e))throw new g(`Temporary value "${e}" does not exist for this procedure.`,this);this.mTemporaryValues.set(e,t)}createEvaluationFunktion(e,t){let n,r=`__${Math.random().toString(36).substring(2)}`;if(n="return function () {",t.size>0)for(let o of t.keys())n+=`const ${o} = ${r}.get('${o}');`;return n+=`return ${e};`,n+="};",new Function(r,n)(t)}}});var Ne,Wt=p(()=>{Gn();Ne=class{mDataLevel;get data(){return this.mDataLevel}constructor(e){this.mDataLevel=e}createExpressionProcedure(e,t){return new ot(e,this.data,t??[])}setTemporaryValue(e,t){this.data.setTemporaryValue(e,t)}}});var be,it=p(()=>{L();At();be=class{mComponent;mDataProxy;mParentLevel;mTemporaryValues;get store(){return this.mDataProxy}constructor(e){this.mTemporaryValues=new A,e instanceof Te?(this.mParentLevel=null,this.mComponent=e):(this.mParentLevel=e,this.mComponent=e.mComponent),this.mDataProxy=this.createAccessProxy()}setTemporaryValue(e,t){this.mTemporaryValues.set(e,t)}updateLevelData(e){if(e.mParentLevel!==this.mParentLevel)throw new g("Can't update InstructionLevelData for a deeper level than it target data.",this);this.mTemporaryValues=e.mTemporaryValues}createAccessProxy(){return new Proxy(new Object,{get:(e,t)=>this.getValue(t),set:(e,t,n)=>(this.hasTemporaryValue(t)&&this.setTemporaryValue(t,n),t in this.mComponent.processor?(this.mComponent.processor[t]=n,!0):(this.setTemporaryValue(t,n),!0)),deleteProperty:()=>{throw new g("Deleting properties is not allowed",this)},ownKeys:()=>[...new Set([...Object.keys(this.mComponent.processor),...this.getTemporaryValuesList()])]})}getTemporaryValuesList(){let e=this.mTemporaryValues.map(t=>t);return this.mParentLevel&&e.push(...this.mParentLevel.getTemporaryValuesList()),e}getValue(e){if(this.mTemporaryValues.has(e))return this.mTemporaryValues.get(e);if(this.mParentLevel)return this.mParentLevel.getValue(e);if(e in this.mComponent.processor)return this.mComponent.processor[e]}hasTemporaryValue(e){return this.mTemporaryValues.has(e)?!0:this.mParentLevel?this.mParentLevel.hasTemporaryValue(e):!1}}});var Se,Zt=p(()=>{Se=class{mParent;get parent(){return this.mParent}set parent(e){this.mParent=e}get template(){return this.parent?.template??null}constructor(){this.mParent=null}}});var st,Bn=p(()=>{L();Zt();st=class i extends Se{mChildList;mInstruction;mInstructionType;get childList(){return Y.newListWith(...this.mChildList)}get instruction(){return this.mInstruction}set instruction(e){this.mInstruction=e}get instructionType(){return this.mInstructionType}set instructionType(e){this.mInstructionType=e}constructor(){super(),this.mChildList=Array(),this.mInstruction="",this.mInstructionType=""}appendChild(...e){for(let t of e)t.parent=this;this.mChildList.push(...e)}clone(){let e=new i;e.instruction=this.instruction,e.instructionType=this.instructionType;for(let t of this.mChildList)e.appendChild(t.clone());return e}equals(e){if(!(e instanceof i)||e.instruction!==this.instruction||e.instructionType!==this.instructionType||e.childList.length!==this.childList.length)return!1;for(let t=0;t<e.childList.length;t++)if(!e.childList[t].equals(this.childList[t]))return!1;return!0}removeChild(e){let t=this.mChildList.indexOf(e),n;return t!==-1&&(n=this.mChildList.splice(t,1)[0],n.parent=null),n}}});var Dt,Cr=p(()=>{L();Dt=class{mNode;get node(){if(!this.mNode)throw new g("Template value is not attached to any template node.",this);return this.mNode}set node(e){this.mNode=e}constructor(){this.mNode=null}}});var ke,Yt=p(()=>{Cr();ke=class i extends Dt{mExpression;get value(){return this.mExpression}set value(e){this.mExpression=e}constructor(){super(),this.mExpression=""}clone(){let e=new i;return e.value=this.value,e}equals(e){return e instanceof i&&e.value===this.value}toString(){return`{{ ${this.mExpression} }}`}}});var Oe,_t=p(()=>{Zt();Yt();Oe=class i extends Se{mContainsExpression;mTextValue;mValues;get containsExpression(){return this.mContainsExpression}get values(){return this.mValues}constructor(){super(),this.mTextValue="",this.mContainsExpression=!1,this.mValues=[]}addValue(...e){for(let t of e)t instanceof ke&&(t.node=this,this.mContainsExpression=!0),this.mValues.push(t),this.mTextValue+=t.toString()}clone(){let e=new i;for(let t of this.values){let n=typeof t=="string"?t:t.clone();e.addValue(n)}return e}equals(e){if(!(e instanceof i)||e.values.length!==this.values.length)return!1;for(let t=0;t<this.values.length;t++){let n=this.values[t],r=e.values[t];if(n!==r&&(typeof n!=typeof r||typeof n=="string"&&n!==r||!r.equals(n)))return!1}return!0}toString(){return this.mTextValue}}});var qt,xr=p(()=>{_t();Cr();qt=class i extends Dt{mName;mValue;get name(){return this.mName}set name(e){this.mName=e}get values(){return this.mValue}constructor(){super(),this.mName="",this.mValue=new Oe}clone(){let e=new i;e.name=this.name;for(let t of this.values.values){let n=typeof t=="string"?t:t.clone();e.values.addValue(n)}return e}equals(e){return!(!(e instanceof i)||e.name!==this.name||!e.values.equals(this.values))}}});var Ge,Jt=p(()=>{L();Zt();xr();Ge=class i extends Se{mAttributeDictionary;mChildList;mTagName;get attributes(){return Y.newListWith(...this.mAttributeDictionary.values())}get childList(){return Y.newListWith(...this.mChildList)}get tagName(){return this.mTagName}set tagName(e){this.mTagName=e}constructor(){super(),this.mAttributeDictionary=new A,this.mChildList=Array(),this.mTagName=""}appendChild(...e){for(let t of e)t.parent=this;this.mChildList.push(...e)}clone(){let e=new i;e.tagName=this.tagName;for(let t of this.attributes){let n=e.setAttribute(t.name);for(let r of t.values.values){let o=typeof r=="string"?r:r.clone();n.addValue(o)}}for(let t of this.mChildList)e.appendChild(t.clone());return e}equals(e){if(!(e instanceof i)||e.tagName!==this.tagName||e.attributes.length!==this.attributes.length||e.childList.length!==this.childList.length)return!1;for(let t of e.mAttributeDictionary.values()){let n=this.mAttributeDictionary.get(t.name);if(!n||!n.equals(t))return!1}for(let t=0;t<e.childList.length;t++)if(!e.childList[t].equals(this.childList[t]))return!1;return!0}removeAttribute(e){return this.mAttributeDictionary.has(e)?(this.mAttributeDictionary.delete(e),!0):!1}removeChild(e){let t=this.mChildList.indexOf(e),n;return t!==-1&&(n=this.mChildList.splice(t,1)[0],n.parent=null),n}setAttribute(e){let t=this.mAttributeDictionary.get(e);return t||(t=new qt,t.name=e,t.node=this,this.mAttributeDictionary.set(e,t)),t.values}}});var me,at=p(()=>{L();Zt();me=class i extends Se{mBodyElementList;get body(){return this.mBodyElementList.clone()}get template(){return this}constructor(){super(),this.mBodyElementList=new Y}appendChild(...e){this.mBodyElementList.push(...e);for(let t of e)t.parent=this}clone(){let e=new i;for(let t of this.mBodyElementList)e.appendChild(t.clone());return e}equals(e){if(!(e instanceof i)||e.body.length!==this.body.length)return!1;for(let t=0;t<this.body.length;t++)if(!this.body[t].equals(e.body[t]))return!1;return!0}removeChild(e){let t=this.mBodyElementList.indexOf(e),n;return t!==-1&&(n=this.mBodyElementList.splice(t,1)[0],n.parent=null),n}}});var ae,Fn=p(()=>{ae=class{mApplicationContext;mComponentValues;mContent;mTemplate;get anchor(){return this.mContent.contentAnchor}get applicationContext(){return this.mApplicationContext}get boundary(){return this.mContent.getBoundary()}get template(){return this.mTemplate}get values(){return this.mComponentValues}get content(){return this.mContent}constructor(e,t,n,r){this.mApplicationContext=e,this.mTemplate=t,this.mTemplate.parent=null,this.mComponentValues=n,this.mContent=r,r.setCoreBuilder(this)}deconstruct(){this.content.deconstruct()}update(){let e=this.onUpdate(),t=!1,n=this.content.builders;if(n.length>0)for(let r=0;r<n.length;r++)t=n[r].update()||t;return e||t}createZoneEnabledElement(e){let t=e.tagName;if(typeof t!="string")throw t;if(t.includes("-")){let n=globalThis.customElements.get(t);if(typeof n<"u")return new n}return document.createElement(t)}createZoneEnabledText(e){return document.createTextNode(e)}}});var Nt,Pr=p(()=>{L();Fn();Nt=class{mChildBuilderList;mChildComponents;mContentAnchor;mContentBoundary;mLinkedContent;mModules;mRootChildList;get body(){return this.mRootChildList}get builders(){return this.mChildBuilderList}get contentAnchor(){return this.mContentAnchor}get modules(){return this.mModules}constructor(e,t){this.mModules=e,this.mChildBuilderList=new Y,this.mRootChildList=new Y,this.mChildComponents=new A,this.mLinkedContent=new WeakSet,this.mContentAnchor=document.createComment(t),this.mContentBoundary={start:this.mContentAnchor,end:this.mContentAnchor}}deconstruct(){this.onDeconstruct();let e;for(;e=this.mChildBuilderList.pop();)e.deconstruct();for(let n of this.mChildComponents.values())n.deconstruct();this.mChildComponents.clear();let t;for(;t=this.mRootChildList.pop();)t instanceof ae||t.remove();this.contentAnchor.remove()}getBoundary(){let e=this.mContentBoundary.start,t;return this.mContentBoundary.end instanceof ae?t=this.mContentBoundary.end.boundary.end:t=this.mContentBoundary.end,{start:e,end:t}}hasContent(e){return this.mLinkedContent.has(e)}insert(e,t,n){if(!this.hasContent(n))throw new g("Can't add content to builder. Target is not part of builder.",this);let r=e instanceof ae?e.anchor:e;switch(t){case"After":{this.insertAfter(r,n);break}case"TopOf":{this.insertTop(r,n);break}case"BottomOf":{this.insertBottom(r,n);break}}this.mLinkedContent.add(e),e instanceof ae&&this.mChildBuilderList.push(e);let o=r.parentElement??r.getRootNode(),s=this.mContentAnchor.parentElement??this.mContentAnchor.getRootNode();if(o===s){let a;switch(t){case"After":{a=this.mRootChildList.indexOf(n)+1;break}case"TopOf":{a=0;break}case"BottomOf":{a=this.mRootChildList.length;break}}a===this.mRootChildList.length&&(this.mContentBoundary.end=e),this.mRootChildList.splice(a+1,0,e)}}remove(e){if(!this.mLinkedContent.has(e))throw new g("Child node cant be deleted from builder when it not a child of them",this);if(this.mLinkedContent.delete(e),e instanceof ae)this.mChildBuilderList.remove(e),e.deconstruct();else{let t=this.mChildComponents.get(e);t&&(t.deconstruct(),this.mChildComponents.delete(e)),e.remove()}this.mRootChildList.remove(e)&&(this.mContentBoundary.end=this.mRootChildList.at(-1)??this.mContentAnchor)}setCoreBuilder(e){this.mLinkedContent.add(e)}insertAfter(e,t){let n;t instanceof ae?n=t.boundary.end:n=t,(n.parentElement??n.getRootNode()).insertBefore(e,n.nextSibling)}insertBottom(e,t){if(t instanceof ae){this.insertAfter(e,t);return}if(t instanceof Element){t.appendChild(e);return}throw new g("Source node does not support child nodes.",this)}insertTop(e,t){if(t instanceof ae){this.insertAfter(e,t.anchor);return}if(t instanceof Element){t.prepend(e);return}throw new g("Source node does not support child nodes.",this)}}});var Vn,xi=p(()=>{L();Pr();Vn=class extends Nt{mAttributeModulesChangedOrder;mLinkedAttributeElement;mLinkedAttributeExpressionModules;mLinkedAttributeModuleList;mLinkedAttributeNodes;mLinkedExpressionModuleList;get linkedAttributeModules(){return this.mAttributeModulesChangedOrder&&(this.mAttributeModulesChangedOrder=!1,this.orderAttributeModules()),this.mLinkedAttributeModuleList}get linkedExpressionModules(){return this.mLinkedExpressionModuleList}constructor(e,t){super(e,t),this.mLinkedExpressionModuleList=new Array,this.mLinkedAttributeModuleList=new Array,this.mLinkedAttributeExpressionModules=new WeakMap,this.mLinkedAttributeNodes=new WeakMap,this.mLinkedAttributeElement=new WeakMap,this.mAttributeModulesChangedOrder=!1}attributeOfLinkedExpressionModule(e){return this.mLinkedAttributeExpressionModules.get(e)}getLinkedAttributeData(e){let t=this.mLinkedAttributeNodes.get(e),n=this.mLinkedAttributeElement.get(e);if(!t||!n)throw new g("Attribute has no linked data.",this);return{values:t,node:n}}linkAttributeExpression(e,t){this.mLinkedAttributeExpressionModules.set(e,t)}linkAttributeModule(e){this.mLinkedAttributeModuleList.push(e),this.mAttributeModulesChangedOrder=!0}linkAttributeNodes(e,t,n){this.mLinkedAttributeNodes.set(e,n),this.mLinkedAttributeElement.set(e,t)}linkExpressionModule(e){this.mLinkedExpressionModuleList.push(e)}onDeconstruct(){for(let e of this.mLinkedAttributeModuleList)e.deconstruct();for(let e of this.mLinkedExpressionModuleList)e.deconstruct()}orderAttributeModules(){this.mLinkedAttributeModuleList.sort((e,t)=>e.accessMode-t.accessMode)}}});var jn,Pi=p(()=>{Pr();jn=class extends Nt{mInstructionModule;get instructionModule(){return this.mInstructionModule}set instructionModule(e){this.mInstructionModule=e}constructor(e,t){super(e,t),this.mInstructionModule=null}onDeconstruct(){this.mInstructionModule.deconstruct()}}});var Un,Ii=p(()=>{L();Fn();Pi();Ir();Un=class extends ae{constructor(e,t,n,r){super(e,t,r,new jn(n,`Instruction - {$${t.instructionType}}`))}onUpdate(){if(!this.content.instructionModule){let t=this.content.modules.createInstructionModule(this.applicationContext,this.template,this.values);this.content.instructionModule=t}if(this.content.instructionModule.update()){let t=this.content.body;this.updateStaticBuilder(t,this.content.instructionModule.instructionResult.elementList)}return!1}insertNewContent(e,t){let n=new St(this.applicationContext,e.template,this.content.modules,e.dataLevel,`Child - {$${this.template.instructionType}}`);return t===null?this.content.insert(n,"TopOf",this):this.content.insert(n,"After",t),n}updateStaticBuilder(e,t){let r=new zt((a,l)=>l.template.equals(a.template)).differencesOf(e,t),o=0,s=null;for(let a=0;a<r.length;a++){let l=r[a];if(l.changeState===1)this.content.remove(l.item);else if(l.changeState===2)s=this.insertNewContent(l.item,s),o++;else{let u=t[o].dataLevel;l.item.values.updateLevelData(u),s=l.item,o++}}}}});var St,Ir=p(()=>{it();Bn();_t();Jt();at();Yt();Fn();xi();Ii();St=class extends ae{mInitialized;constructor(e,t,n,r,o){super(e,t,r,new Vn(n,`Static - {${o}}`)),this.mInitialized=!1}onUpdate(){this.mInitialized||(this.mInitialized=!0,this.buildTemplate([this.template],this));let e=!1,t=this.content.linkedAttributeModules;for(let o=0;o<t.length;o++)e=t[o].update()||e;let n=!1,r=this.content.linkedExpressionModules;for(let o=0;o<r.length;o++){let s=r[o];if(s.update()){n=!0;let a=this.content.attributeOfLinkedExpressionModule(s);if(!a)continue;let l=this.content.getLinkedAttributeData(a),u=l.values.reduce((h,d)=>h+d.data,"");l.node.setAttribute(a.name,u)}}return e||n}buildInstructionTemplate(e,t){let n=new Un(this.applicationContext,e,this.content.modules,new be(this.values));this.content.insert(n,"BottomOf",t)}buildStaticTemplate(e,t){let n=this.createZoneEnabledElement(e);this.content.insert(n,"BottomOf",t);for(let r of e.attributes){let o=this.content.modules.createAttributeModule(this.applicationContext,r,n,this.values);if(o){this.content.linkAttributeModule(o);continue}if(r.values.containsExpression){let s=new Array;for(let a of r.values.values){let l=this.createZoneEnabledText("");if(s.push(l),!(a instanceof ke)){l.data=a;continue}let u=this.content.modules.createExpressionModule(this.applicationContext,a,l,this.values);this.content.linkExpressionModule(u),this.content.linkAttributeExpression(u,r)}this.content.linkAttributeNodes(r,n,s);continue}n.setAttribute(r.name,r.values.toString())}this.content.insert(n,"BottomOf",t),this.buildTemplate(e.childList,n)}buildTemplate(e,t){for(let n of e)n instanceof me?this.buildTemplate(n.body,t):n instanceof Oe?this.buildTextTemplate(n,t):n instanceof st?this.buildInstructionTemplate(n,t):n instanceof Ge&&this.buildStaticTemplate(n,t)}buildTextTemplate(e,t){for(let n of e.values){if(typeof n=="string"){this.content.insert(this.createZoneEnabledText(n),"BottomOf",t);continue}let r=this.createZoneEnabledText("");this.content.insert(r,"BottomOf",t);let o=this.content.modules.createExpressionModule(this.applicationContext,n,r,this.values);this.content.linkExpressionModule(o)}}}});var Qt,wr=p(()=>{Qt=class{mHtmlElement;mShadowRoot;get htmlElement(){return this.mHtmlElement}get shadowRoot(){return this.mShadowRoot}constructor(e){this.mHtmlElement=e,this.mShadowRoot=this.mHtmlElement.attachShadow({mode:"open"})}}});var H,xe=p(()=>{Gn();H=class{mDataLevel;get data(){return this.mDataLevel}constructor(e){this.mDataLevel=e}createExpressionProcedure(e,t){return new ot(e,this.data,t??[])}}});var Xe,$n=p(()=>{xt();vr();xe();Xe=class extends kt{constructor(e){super({applicationContext:e.applicationContext,constructor:e.constructor,loggingType:2,parent:e.parent,isolate:!1,trigger:e.trigger,trackConstructorChanges:!1}),this.setProcessorAttributes(H,new H(e.values)),this.addSetupHook(()=>{let t=this.processor})}deconstruct(){super.deconstruct(),this.call("onDeconstruct",!1)}}});var q,We=p(()=>{q=class{mValue;get value(){return this.mValue}constructor(e){this.mValue=e}}});var Q,Be=p(()=>{L();Q=class{constructor(){throw new g("Reference should not be instanced.",this)}}});var ve,lt=p(()=>{L();ve=class{constructor(){throw new g("Reference should not be instanced.",this)}}});var Ze,zn=p(()=>{$n();We();Be();lt();Ze=class i extends Xe{mLastResult;mTargetTextNode;constructor(e){super({applicationContext:e.applicationContext,constructor:e.constructor,parent:e.parent,trigger:e.trigger,values:e.values}),this.mTargetTextNode=e.targetNode,this.mLastResult=null,this.setProcessorAttributes(i,this),this.setProcessorAttributes(ve,e.targetTemplate.clone()),this.setProcessorAttributes(Q,e.targetNode),this.setProcessorAttributes(q,new q(e.targetTemplate.value))}onUpdate(){let e=this.call("onUpdate",!0);e===null&&(e="");let t=this.mLastResult===null||this.mLastResult!==e;if(t){let n=this.mTargetTextNode;n.data=e,this.mLastResult=e}return t}}});function Er(i){return(e,t)=>{x.registerInjectable(e,t.metadata,"instanced"),de.register(Ze,e,{trigger:i.trigger})}}var kr=p(()=>{K();rt();zn()});var wi,Ar,Mc,ct,Ei=p(()=>{K();se();xe();ne();kr();We();wi=[Er({trigger:111})];ct=class extends(Mc=w){mProcedure;constructor(e=x.use(H),t=x.use(q)){super(),this.mProcedure=e.createExpressionProcedure(t.value)}onUpdate(){let e=this.mProcedure.execute();return typeof e>"u"?null:e?.toString()}};Ar=E(Mc),ct=m(Ar,0,"MustacheExpressionModule",wi,ct),c(Ar,1,ct)});var he,ut=p(()=>{he=class{mName;mValue;get name(){return this.mName}get value(){return this.mValue}constructor(e,t){this.mName=e,this.mValue=t}}});var le,pt=p(()=>{$n();ut();Be();lt();le=class i extends Xe{mAccessMode;get accessMode(){return this.mAccessMode}constructor(e){super({applicationContext:e.applicationContext,constructor:e.constructor,parent:e.parent,trigger:e.trigger,values:e.values}),this.mAccessMode=e.accessMode,this.setProcessorAttributes(i,this),this.setProcessorAttributes(ve,e.targetTemplate.clone()),this.setProcessorAttributes(Q,e.targetNode),this.setProcessorAttributes(he,new he(e.targetTemplate.name,e.targetTemplate.values.toString()))}onUpdate(){return this.call("onUpdate",!0)??!1}}});var ge,dt=p(()=>{L();ge=class{mElementList;get elementList(){return Y.newListWith(...this.mElementList)}constructor(){this.mElementList=new Array}addElement(e,t){if(this.mElementList.findIndex(r=>r.template===e||r.dataLevel===t)===-1)this.mElementList.push({template:e,dataLevel:t});else throw new g("Can't add same template or values for multiple Elements.",this)}}});var Ye,Hn=p(()=>{$n();We();lt();dt();Ye=class i extends Xe{mLastResult;get instructionResult(){return this.mLastResult}constructor(e){super({applicationContext:e.applicationContext,constructor:e.constructor,parent:e.parent,trigger:e.trigger,values:e.values}),this.setProcessorAttributes(i,this),this.setProcessorAttributes(ve,e.targetTemplate.clone()),this.setProcessorAttributes(q,new q(e.targetTemplate.instruction)),this.mLastResult=new ge}onUpdate(){let e=this.call("onUpdate",!0);return e instanceof ge?(this.mLastResult=e,!0):!1}}});var Kn,ki=p(()=>{L();Ei();rt();pt();zn();Hn();Kn=class i{static mAttributeModuleCache=new A;static mExpressionModuleCache=new WeakMap;static mInstructionModuleCache=new A;mComponent;mExpressionModule;constructor(e,t){this.mExpressionModule=t??ct,this.mComponent=e}createAttributeModule(e,t,n,r){let o=(()=>{let s=i.mAttributeModuleCache.get(t.name);if(s||s===null)return s;for(let a of de.get(le))if(a.processorConfiguration.selector.test(t.name))return i.mAttributeModuleCache.set(t.name,a),a;return i.mAttributeModuleCache.set(t.name,null),null})();return o===null?null:new le({applicationContext:e,accessMode:o.processorConfiguration.access,constructor:o.processorConstructor,parent:this.mComponent,targetNode:n,targetTemplate:t,values:r,trigger:o.processorConfiguration.trigger}).setup()}createExpressionModule(e,t,n,r){let o=(()=>{let s=i.mExpressionModuleCache.get(this.mExpressionModule);if(s)return s;let a=de.get(Ze).find(l=>l.processorConstructor===this.mExpressionModule);if(!a)throw new g("An expression module could not be found.",this);return i.mExpressionModuleCache.set(this.mExpressionModule,a),a})();return new Ze({applicationContext:e,constructor:o.processorConstructor,parent:this.mComponent,targetNode:n,targetTemplate:t,values:r,trigger:o.processorConfiguration.trigger}).setup()}createInstructionModule(e,t,n){let r=(()=>{let o=i.mInstructionModuleCache.get(t.instructionType);if(o)return o;for(let s of de.get(Ye))if(s.processorConfiguration.instructionType===t.instructionType)return i.mInstructionModuleCache.set(t.instructionType,s),s;throw new g(`Instruction module type "${t.instructionType}" not found.`,this)})();return new Ye({applicationContext:e,constructor:r.processorConstructor,parent:this.mComponent,targetTemplate:t,values:n,trigger:r.processorConfiguration.trigger}).setup()}}});var mt,Xn=p(()=>{L();mt=class extends g{mColumnEnd;mColumnStart;mLineEnd;mLineStart;get columnEnd(){return this.mColumnEnd}get columnStart(){return this.mColumnStart}get lineEnd(){return this.mLineEnd}get lineStart(){return this.mLineStart}constructor(e,t,n,r,o,s,a){super(e,t,a),this.mColumnStart=n,this.mLineStart=r,this.mColumnEnd=o,this.mLineEnd=s}}});var Lt,Dr=p(()=>{L();Lt=class{mDependencyFetch;mDependencyFetchResolved;mLexer;mMeta;mPattern;mPatternDependencies;mType;get dependencies(){return this.mPatternDependencies}get dependenciesResolved(){return this.mDependencyFetchResolved}get lexer(){return this.mLexer}get meta(){return this.mMeta}get pattern(){return this.mPattern}constructor(e,t){if(this.mLexer=e,this.mType=t.type,this.mMeta=t.metadata,this.mPatternDependencies=new Array,this.mDependencyFetch=t.dependencyFetch??null,this.mDependencyFetchResolved=!t.dependencyFetch,this.mType==="split"&&!this.mDependencyFetch)throw new g("Split token with a start and end token, need inner token definitions.",this);if(this.mType==="single"&&this.mDependencyFetch)throw new g("Pattern does not allow inner token pattern.",this);this.mPattern=this.convertTokenPattern(this.mType,t.pattern)}isSplit(){return this.mType==="split"}resolveDependencies(){this.mDependencyFetchResolved||(this.mDependencyFetch(this),this.mDependencyFetchResolved=!0)}useChildPattern(e){if(this.mLexer!==e.lexer)throw new g("Can only add dependencies of the same lexer.",this);this.mPatternDependencies.push(e)}convertTokenPattern(e,t){if("single"in t){if(e==="split")throw new g("Can't use split pattern type with single pattern definition.",this);return{start:{regex:t.single.regex,types:t.single.types,validator:t.single.validator??null}}}else{if(e==="single")throw new g("Can't use single pattern type with split pattern definition.",this);return{start:{regex:t.start.regex,types:t.start.types,validator:t.start.validator??null},end:{regex:t.end.regex,types:t.end.types,validator:t.end.validator??null},innerType:t.innerType??null}}}}});var Mt,Nr=p(()=>{Mt=class{mColumnNumber;mLineNumber;mMetas;mType;mValue;get columnNumber(){return this.mColumnNumber}get lineNumber(){return this.mLineNumber}get metas(){return[...this.mMetas]}get type(){return this.mType}get value(){return this.mValue}constructor(e,t,n,r){this.mValue=t,this.mColumnNumber=n,this.mLineNumber=r,this.mType=e,this.mMetas=new Set}addMeta(...e){for(let t of e)this.mMetas.add(t)}hasMeta(e){return this.mMetas.has(e)}}});var en,Ai=p(()=>{L();Xn();Dr();Nr();en=class{mRootPattern;mSettings;get errorType(){return this.mSettings.errorType}set errorType(e){this.mSettings.errorType=e}get trimWhitespace(){return this.mSettings.trimSpaces}set trimWhitespace(e){this.mSettings.trimSpaces=e}get validWhitespaces(){return[...this.mSettings.whiteSpaces].join("")}set validWhitespaces(e){this.mSettings.whiteSpaces=new Set(e.split(""))}constructor(){this.mSettings={errorType:null,trimSpaces:!0,whiteSpaces:new Set},this.mRootPattern=new Lt(this,{type:"single",pattern:{single:{regex:/^/,types:{},validator:null}},metadata:[],dependencyFetch:null})}createTokenPattern(e,t){let n=a=>typeof a=="string"?{token:a}:a,r=a=>{let l=new Set(a.flags.split(""));return new RegExp(`^(?<token>${a.source})`,[...l].join(""))},o=new Array;e.meta&&(typeof e.meta=="string"?o.push(e.meta):o.push(...e.meta));let s;return"regex"in e.pattern?s={single:{regex:r(e.pattern.regex),types:n(e.pattern.type),validator:e.pattern.validator??null}}:s={start:{regex:r(e.pattern.start.regex),types:n(e.pattern.start.type),validator:e.pattern.start.validator??null},end:{regex:r(e.pattern.end.regex),types:n(e.pattern.end.type),validator:e.pattern.end.validator??null},innerType:e.pattern.innerType??null},new Lt(this,{type:"regex"in e.pattern?"single":"split",pattern:s,metadata:o,dependencyFetch:t??null})}*tokenize(e,t){let n={data:e,cursor:{position:0,column:1,line:1},error:null,progressTracker:t??null};yield*this.tokenizeRecursionLayer(n,this.mRootPattern,new Array,null)}useRootTokenPattern(e){if(e.lexer!==this)throw new g("Token pattern must be created by this lexer.",this);this.mRootPattern.useChildPattern(e)}findNextStartToken(e,t,n,r){for(let o of t){let s=o.pattern.start,a=this.matchToken(o,s,e,n,r);if(a!==null)return{pattern:o,token:a}}return null}findTokenTypeOfMatch(e,t,n){for(let s in e.groups){let a=e.groups[s],l=t[s];if(!(!a||!l)){if(a.length!==e[0].length)throw new g("A group of a token pattern must match the whole token.",this);return l}}let r=new Array;for(let s in e.groups)e.groups[s]&&r.push(s);let o=new Array;for(let s in t)o.push(s);throw new g(`No token type found for any defined pattern regex group. Full: "${e[0]}", Matches: "${r.join(", ")}", Available: "${o.join(", ")}", Regex: "${n.source}"`,this)}*generateErrorToken(e,t){if(!e.error||!this.mSettings.errorType)return;let n=new Mt(this.mSettings.errorType,e.error.data,e.error.startColumn,e.error.startLine);n.addMeta(...t),e.error=null,yield n}generateToken(e,t,n,r,o,s){let a=n[0],l=this.findTokenTypeOfMatch(n,r,s),u=new Mt(o??l,a,e.cursor.column,e.cursor.line);return u.addMeta(...t),u}matchToken(e,t,n,r,o){let s=t.regex;s.lastIndex=0;let a=s.exec(n.data);if(!a||a.index!==0)return null;let l=this.generateToken(n,[...r,...e.meta],a,t.types,o,s);if(t.validator){let u=n.data.substring(l.value.length);if(!t.validator(l,u,n.cursor.position))return null}return this.moveCursor(n,l.value),l}moveCursor(e,t){let n=t.split(`
`);n.length>1&&(e.cursor.column=1),e.cursor.line+=n.length-1,e.cursor.column+=n.at(-1).length,e.cursor.position+=t.length,e.data=e.data.substring(t.length),this.trackProgress(e)}pushNextCharToErrorState(e){if(!this.mSettings.errorType)throw new mt(`Unable to parse next token. No valid pattern found for "${e.data.substring(0,20)}".`,this,e.cursor.column,e.cursor.line,e.cursor.column,e.cursor.line);e.error||(e.error={data:"",startColumn:e.cursor.column,startLine:e.cursor.line});let t=e.data.charAt(0);e.error.data+=t,this.moveCursor(e,t)}skipNextWhitespace(e){let t=e.data.charAt(0);return!this.mSettings.trimSpaces||!this.mSettings.whiteSpaces.has(t)?!1:(this.moveCursor(e,t),!0)}*tokenizeRecursionLayer(e,t,n,r){let o=t.dependencies;for(;e.data.length>0;){if(!e.error&&this.skipNextWhitespace(e))continue;if(t.isSplit()){let l=this.matchToken(t,t.pattern.end,e,n,r);if(l!==null){yield*this.generateErrorToken(e,n),yield l;return}}let s=this.findNextStartToken(e,o,n,r);if(!s){this.pushNextCharToErrorState(e);continue}yield*this.generateErrorToken(e,n),yield s.token;let a=s.pattern;a.isSplit()&&(a.resolveDependencies(),yield*this.tokenizeRecursionLayer(e,a,[...n,...a.meta],r??a.pattern.innerType))}yield*this.generateErrorToken(e,n)}trackProgress(e){e.progressTracker!==null&&e.progressTracker(e.cursor.position,e.cursor.line,e.cursor.column)}}});var X,Sr=p(()=>{X=class extends Error{static PARSER_ERROR=Symbol("PARSER_ERROR");mTrace;get columnEnd(){return this.mTrace.top.range.columnEnd}get columnStart(){return this.mTrace.top.range.columnStart}get graph(){return this.mTrace.top.graph}get incidents(){return this.mTrace.incidents}get lineEnd(){return this.mTrace.top.range.lineEnd}get lineStart(){return this.mTrace.top.range.lineStart}constructor(e){super(e.top.message,{cause:e.top.cause}),this.mTrace=e}}});var Wn,Di=p(()=>{L();Wn=class{mIncidents;mTop;get incidents(){if(this.mIncidents===null)throw new g("A complete incident list is only available on debug mode.",this);return this.mIncidents}get top(){return this.mTop}constructor(e){this.mTop={message:"Unknown parser error",priority:0,graph:null,range:{lineStart:1,columnStart:1,lineEnd:1,columnEnd:1},cause:null},e?this.mIncidents=new Array:this.mIncidents=null}push(e,t,n,r,o,s,a=!1,l=null){let u;if(a?u=this.mTop.priority+1:u=o*1e4+s,this.mIncidents!==null){let h={message:e,priority:u,graph:t,range:{lineStart:n,columnStart:r,lineEnd:o,columnEnd:s},cause:l};this.mIncidents.push(h)}this.mTop&&u<this.mTop.priority||this.setTop({message:e,priority:u,graph:t,range:{lineStart:n,columnStart:r,lineEnd:o,columnEnd:s},cause:l})}setTop(e){this.mTop=e}}});var Zn,Ni=p(()=>{L();Di();Zn=class i{static MAX_JUNCTION_CIRCULAR_REFERENCES=1e3;mGraphStack;mIncidentTrace;mLastTokenPosition;mProcessStack;mTokenCache;mTokenGenerator;mTrimTokenCache;get currentGraph(){return this.mGraphStack.top.graph}get currentToken(){let e=this.mGraphStack.top;return this.mTokenCache[e.token.cursor]}get incidentTrace(){return this.mIncidentTrace}get processStack(){return this.mProcessStack}constructor(e,t,n){this.mTokenGenerator=e,this.mGraphStack=new Ce,this.mLastTokenPosition={column:1,line:1},this.mTokenCache=new Array,this.mProcessStack=new Ce,this.mTrimTokenCache=n,this.mIncidentTrace=new Wn(t),this.mGraphStack.push({graph:null,linear:!0,circularGraphs:new A,token:{start:0,cursor:-1}})}collapse(){let e=this.mGraphStack.top,t=this.mTokenCache.slice(e.token.cursor);t.length!==0&&t.at(-1)===null&&t.pop();for(let n of this.mTokenGenerator)t.push(n);return t}getGraphBoundingToken(){let e=this.mGraphStack.top,t=this.mTokenCache[e.token.start],n=this.mTokenCache[e.token.cursor-1];return t??=n,n??=t,[t??null,n??null]}getGraphPosition(){let e=this.mGraphStack.top,t,n;if(t=this.mTokenCache[e.token.start],n=this.mTokenCache[e.token.cursor-1],t??=n,n??=t,!t||!n)return{graph:e.graph,columnEnd:this.mLastTokenPosition.column,columnStart:this.mLastTokenPosition.column,lineEnd:this.mLastTokenPosition.line,lineStart:this.mLastTokenPosition.line};let r,o;if(n.value.includes(`
`)){let s=n.value.split(`
`);o=n.lineNumber+s.length-1,r=1+s[s.length-1].length}else r=n.columnNumber+n.value.length,o=n.lineNumber;return{graph:e.graph,lineStart:t.lineNumber,columnStart:t.columnNumber,lineEnd:o,columnEnd:r}}getTokenPosition(){let e=this.mGraphStack.top,t=this.currentToken;if(!t)return{graph:e.graph,columnEnd:this.mLastTokenPosition.column,columnStart:this.mLastTokenPosition.column,lineEnd:this.mLastTokenPosition.line,lineStart:this.mLastTokenPosition.line};let n,r;if(t.value.includes(`
`)){let o=t.value.split(`
`);r=t.lineNumber+o.length-1,n=1+o[o.length-1].length}else n=t.columnNumber+t.value.length,r=t.lineNumber;return{graph:e.graph,lineStart:t.lineNumber,columnStart:t.columnNumber,lineEnd:r,columnEnd:n}}graphIsCircular(e){let t=this.mGraphStack.top;if(!t.circularGraphs.has(e))return!1;if(e.isJunction){if(t.circularGraphs.get(e)>i.MAX_JUNCTION_CIRCULAR_REFERENCES)throw new g("Junction graph called circular too often.",this);return!1}return!0}moveNextToken(){let e=this.mGraphStack.top;if(e.circularGraphs.size>0&&(e.circularGraphs=new A),e.graph&&e.graph.isJunction)throw new g("Junction graph must not have own nodes.",this);if(e.token.cursor++,e.token.cursor<this.mTokenCache.length)return;let t=this.mTokenGenerator.next();if(t.done){this.mTokenCache.push(null);return}this.mLastTokenPosition.column=t.value.columnNumber,this.mLastTokenPosition.line=t.value.lineNumber,this.mTokenCache.push(t.value)}popGraphStack(e){let t=this.mGraphStack.pop(),n=this.mGraphStack.top;if(e&&(t.token.cursor=t.token.start),t.token.cursor!==t.token.start&&n.circularGraphs.size>0&&(n.circularGraphs=new A),!this.mTrimTokenCache){n.token.cursor=t.token.cursor;return}t.linear?(this.mTokenCache.splice(0,t.token.cursor),n.token.start=0,n.token.cursor=0):n.token.cursor=t.token.cursor}pushGraphStack(e,t){let n=this.mGraphStack.top,r={graph:e,linear:t&&n.linear,circularGraphs:new A(n.circularGraphs),token:{start:n.token.cursor,cursor:n.token.cursor}},o=r.circularGraphs.get(e)??0;r.circularGraphs.set(e,o+1),this.mGraphStack.push(r)}}});var tn,Si=p(()=>{L();Xn();Sr();Ni();tn=class i{static NODE_NULL_RESULT=Symbol("FAILED_NODE_VALUE_PARSE");static NODE_VALUE_LIST_END_MEET=Symbol("FAILED_NODE_VALUE_PARSE");mConfiguration;mLexer;mRootPart;get lexer(){return this.mLexer}constructor(e,t){this.mLexer=e,this.mRootPart=null,this.mConfiguration={keepTraceIncidents:!1,trimTokenCache:!1,...t}}parse(e,t){if(this.mRootPart===null)throw new g("Parser has not root part set.",this);let n=new Zn(this.mLexer.tokenize(e,t),this.mConfiguration.keepTraceIncidents,this.mConfiguration.trimTokenCache),r=(()=>{try{return this.beginParseProcess(n,this.mRootPart)}catch(s){if(s instanceof mt)return n.incidentTrace.push(s.message,n.currentGraph,s.lineStart,s.columnStart,s.lineEnd,s.columnEnd,!0,s),X.PARSER_ERROR;let a=s instanceof Error?s.message:s.toString(),l=n.getGraphPosition();return n.incidentTrace.push(a,n.currentGraph,l.lineStart,l.columnStart,l.lineEnd,l.columnEnd,!0,s),X.PARSER_ERROR}})();if(r===X.PARSER_ERROR)throw new X(n.incidentTrace);let o=n.collapse();if(o.length!==0){let s=o[0];if(n.incidentTrace.top.range.lineEnd===1&&n.incidentTrace.top.range.columnEnd===1){let a=`Tokens could not be parsed. Graph end meet without reaching last token. Current: "${s.value}" (${s.type})`;n.incidentTrace.push(a,this.mRootPart,s.lineNumber,s.columnNumber,s.lineNumber,s.columnNumber)}throw new X(n.incidentTrace)}return r}setRootGraph(e){this.mRootPart=e}beginParseProcess(e,t){e.moveNextToken(),e.processStack.push({type:"graph-parse",parameter:{graph:t,linear:!0},state:0});let n=i.NODE_NULL_RESULT;for(;e.processStack.top;)n=this.processStack(e,e.processStack.top,n);return n}processChainedNodeParseProcess(e,t,n){switch(t.state){case 0:{let s=t.parameter.node.connections.next;return s===null?(e.processStack.pop(),{}):(t.state++,e.processStack.push({type:"node-parse",parameter:{node:s},state:0,values:{}}),i.NODE_NULL_RESULT)}case 1:{let r=n;return r===X.PARSER_ERROR?(e.processStack.pop(),X.PARSER_ERROR):(e.processStack.pop(),r)}}throw new g(`Invalid node next parse state "${t.state}".`,this)}processGraphParseProcess(e,t,n){let r=t.parameter.graph;switch(t.state){case 0:{if(e.graphIsCircular(r)){let s=e.getGraphPosition();return e.incidentTrace.push("Circular graph detected.",r,s.lineStart,s.columnStart,s.lineEnd,s.columnEnd),e.processStack.pop(),X.PARSER_ERROR}let o=t.parameter.linear;return e.pushGraphStack(r,o),t.state++,e.processStack.push({type:"node-parse",parameter:{node:r.node},state:0,values:{}}),i.NODE_NULL_RESULT}case 1:{let o=n;if(o===X.PARSER_ERROR)return e.popGraphStack(!0),e.processStack.pop(),X.PARSER_ERROR;let s=r.convert(o,e);if(typeof s=="symbol"){let a=e.getGraphPosition();return e.incidentTrace.push(s.description??"Unknown data convert error",a.graph,a.lineStart,a.columnStart,a.lineEnd,a.columnEnd),e.popGraphStack(!0),e.processStack.pop(),X.PARSER_ERROR}return e.popGraphStack(!1),e.processStack.pop(),s}}throw new g(`Invalid graph parse state "${t.state}".`,this)}processNodeParseProcess(e,t,n){let r=t.parameter.node;switch(t.state){case 0:return e.processStack.push({type:"node-value-parse",parameter:{node:r,valueIndex:0},state:0,values:{}}),t.state++,i.NODE_NULL_RESULT;case 1:{let o=n;return o===X.PARSER_ERROR?(e.processStack.pop(),X.PARSER_ERROR):(t.values.nodeValueResult=o,e.processStack.push({type:"node-next-parse",parameter:{node:r},state:0}),t.state++,i.NODE_NULL_RESULT)}case 2:{let o=n;if(o===X.PARSER_ERROR)return e.processStack.pop(),X.PARSER_ERROR;let s=r.mergeData(t.values.nodeValueResult,o);return e.processStack.pop(),s}}throw new g(`Invalid node parse state "${t.state}".`,this)}processNodeValueParseProcess(e,t,n){let r=t.parameter.node;switch(t.state){case 0:{if(n!==i.NODE_NULL_RESULT&&n!==X.PARSER_ERROR)return t.values.parseResult=n,t.state++,i.NODE_NULL_RESULT;let o=t.parameter.valueIndex,s=r.connections;if(o>=s.values.length)return t.values.parseResult=i.NODE_VALUE_LIST_END_MEET,t.state++,i.NODE_NULL_RESULT;t.parameter.valueIndex++;let a=e.currentToken,l=s.values[o];if(typeof l=="string"){if(!a){if(s.required){let u=e.getTokenPosition();e.incidentTrace.push(`Unexpected end of statement. Token "${l}" expected.`,e.currentGraph,u.lineStart,u.columnStart,u.lineEnd,u.columnEnd)}return i.NODE_NULL_RESULT}if(l!==a.type){if(s.required){let u=e.getTokenPosition();e.incidentTrace.push(`Unexpected token "${a.value}". "${l}" expected`,e.currentGraph,u.lineStart,u.columnStart,u.lineEnd,u.columnEnd)}return i.NODE_NULL_RESULT}return e.moveNextToken(),a.value}else{let u=s.values.length===1||s.values.length===o+1;return e.processStack.push({type:"graph-parse",parameter:{graph:l,linear:u},state:0}),i.NODE_NULL_RESULT}}case 1:{let o=t.values.parseResult,s=r.connections;if(o===i.NODE_VALUE_LIST_END_MEET&&!s.required){e.processStack.pop();return}return o===i.NODE_VALUE_LIST_END_MEET?(e.processStack.pop(),X.PARSER_ERROR):(e.processStack.pop(),o)}}throw new g(`Invalid node value parse state "${t.state}".`,this)}processStack(e,t,n){switch(t.type){case"graph-parse":return this.processGraphParseProcess(e,t,n);case"node-parse":return this.processNodeParseProcess(e,t,n);case"node-value-parse":return this.processNodeValueParseProcess(e,t,n);case"node-next-parse":return this.processChainedNodeParseProcess(e,t,n)}}}});var _,Lr=p(()=>{_=class i{static define(e,t=!1){return new i(e,t)}mDataConverterList;mGraphCollector;mIsJunction;mResolvedGraphNode;get isJunction(){return this.mIsJunction}get node(){return this.mResolvedGraphNode||(this.mResolvedGraphNode=this.mGraphCollector().root),this.mResolvedGraphNode}constructor(e,t){this.mGraphCollector=e,this.mDataConverterList=new Array,this.mResolvedGraphNode=null,this.mIsJunction=t}convert(e,t){if(this.mDataConverterList.length===0)return e;let n=t.getGraphBoundingToken(),r=n[0]??void 0,o=n[1]??void 0;if(this.mDataConverterList.length===1)return this.mDataConverterList[0](e,r,o);let s=e;for(let a of this.mDataConverterList)if(s=a(s,r,o),typeof s=="symbol")return s;return s}converter(e){let t=new i(this.mGraphCollector,this.isJunction);return t.mDataConverterList.push(...this.mDataConverterList,e),t}}});var B,Li=p(()=>{L();Lr();B=class i{static new(){let e=new i("",!1,[]);return e.mRootNode=null,e}mConnections;mIdentifier;mRootNode;get configuration(){return{dataKey:this.mIdentifier.dataKey,isList:this.mIdentifier.type==="list",isRequired:this.mConnections.required,isBranch:this.mConnections.values.length>1}}get connections(){return this.mConnections}get root(){if(!this.mRootNode)throw new g("Staring nodes must be chained with another node to be used.",this);return this.mRootNode}constructor(e,t,n,r){if(e==="")this.mIdentifier={type:"empty",dataKey:"",mergeKey:""};else if(e.endsWith("[]"))this.mIdentifier={type:"list",mergeKey:"",dataKey:e.substring(0,e.length-2)};else if(e.includes("<-")){let s=e.split("<-");this.mIdentifier={type:"merge",dataKey:s[0],mergeKey:s[1]}}else this.mIdentifier={type:"single",mergeKey:"",dataKey:e};let o=n.map(s=>s instanceof i?_.define(()=>s):s);this.mConnections={required:t,values:o,next:null},r?this.mRootNode=r:this.mRootNode=this}mergeData(e,t){if(this.mIdentifier.type==="empty")return t;let n=t,r=typeof e>"u";if(this.mIdentifier.type==="single"){if(this.mIdentifier.dataKey in t)throw new g(`Graph path has a duplicate value identifier "${this.mIdentifier.dataKey}"`,this);return r||(n[this.mIdentifier.dataKey]=e),t}if(this.mIdentifier.type==="list"){let a;r?a=new Array:Array.isArray(e)?a=e:a=[e];let l=(()=>{if(this.mIdentifier.dataKey in t){let u=n[this.mIdentifier.dataKey];return Array.isArray(u)?(u.unshift(...a),u):(a.push(u),a)}return a})();return n[this.mIdentifier.dataKey]=l,t}if(r)return t;let o=(()=>{if(!this.mIdentifier.mergeKey)throw new g("Cant merge data without a merge key.",this);if(typeof e!="object"||e===null)throw new g("Node data must be an object when merge key is set.",this);if(!(this.mIdentifier.mergeKey in e))throw new g(`Node data does not contain merge key "${this.mIdentifier.mergeKey}"`,this);return e[this.mIdentifier.mergeKey]})();if(typeof o>"u")return t;let s=n[this.mIdentifier.dataKey];if(typeof s>"u")return n[this.mIdentifier.dataKey]=o,n;if(!Array.isArray(s))throw new g("Chain data merge value is not an array but should be.",this);return Array.isArray(o)?s.unshift(...o):s.unshift(o),t}optional(e,t){let n=typeof t>"u"?"":e,r=typeof t>"u"?e:t,o=new Array;Array.isArray(r)?o.push(...r):o.push(r);let s=new i(n,!1,o,this.mRootNode);return this.setChainedNode(s),s}required(e,t){let n=typeof t>"u"?"":e,r=typeof t>"u"?e:t,o=new Array;Array.isArray(r)?o.push(...r):o.push(r);let s=new i(n,!0,o,this.mRootNode);return this.setChainedNode(s),s}setChainedNode(e){if(this.mConnections.next!==null)throw new g("Node can only be chained to a single node.",this);this.mConnections.next=e}}});var Mi=p(()=>{Xn();Dr();Nr();Ai();Sr();Si();Li();Lr()});var nn,Mr=p(()=>{L();Mi();Bn();_t();Jt();at();Yt();nn=class{mParser;constructor(){this.mParser=null}parse(e){if(!this.mParser){let t=this.createLexer();this.mParser=this.createParser(t)}return this.mParser.parse(e)}createLexer(){let e=new en;e.validWhitespaces=` 
\r`,e.trimWhitespace=!0;let t=e.createTokenPattern({pattern:{regex:/(?:(?!}}).)*/,type:"ExpressionValue"}}),n=e.createTokenPattern({pattern:{start:{regex:/{{/,type:"ExpressionStart"},end:{regex:/}}/,type:"ExpressionEnd"}}},v=>{v.useChildPattern(t)}),r=e.createTokenPattern({pattern:{regex:/[^>\s\n="/]+/,type:"Identifier"}}),o=e.createTokenPattern({pattern:{regex:/(?:(?!{{|"|<).)+/,type:"XmlValue"}}),s=e.createTokenPattern({pattern:{regex:/<!--.*?-->/,type:"XmlComment"}}),a=e.createTokenPattern({pattern:{regex:/=/,type:"XmlAssignment"}}),l=e.createTokenPattern({pattern:{start:{regex:/"/,type:"XmlExplicitValueIdentifier"},end:{regex:/"/,type:"XmlExplicitValueIdentifier"}}},v=>{v.useChildPattern(n),v.useChildPattern(o)}),u=e.createTokenPattern({pattern:{start:{regex:/<\//,type:"XmlOpenClosingBracket"},end:{regex:/>/,type:"XmlCloseBracket"}}},v=>{v.useChildPattern(r)}),h=e.createTokenPattern({pattern:{start:{regex:/</,type:"XmlOpenBracket"},end:{regex:/(?<closeClosingBracket>\/>)|(?<closeBracket>>)/,type:{closeClosingBracket:"XmlCloseClosingBracket",closeBracket:"XmlCloseBracket"}}}},v=>{v.useChildPattern(a),v.useChildPattern(r),v.useChildPattern(l)}),d=e.createTokenPattern({pattern:{regex:/[^()"'`/)]+/,type:"InstructionInstructionValue"}}),T=e.createTokenPattern({pattern:{innerType:"InstructionInstructionValue",start:{regex:/\//,type:"InstructionInstructionValue"},end:{regex:/\//,type:"InstructionInstructionValue"}}},v=>{v.useChildPattern(I),v.useChildPattern(N),v.useChildPattern(b),v.useChildPattern(f),v.useChildPattern(d)}),f=e.createTokenPattern({pattern:{innerType:"InstructionInstructionValue",start:{regex:/\(/,type:"InstructionInstructionValue"},end:{regex:/\)/,type:"InstructionInstructionValue"}}},v=>{v.useChildPattern(T),v.useChildPattern(I),v.useChildPattern(N),v.useChildPattern(b),v.useChildPattern(d)}),I=e.createTokenPattern({pattern:{innerType:"InstructionInstructionValue",start:{regex:/"/,type:"InstructionInstructionValue"},end:{regex:/"/,type:"InstructionInstructionValue"}}},v=>{v.useChildPattern(T),v.useChildPattern(N),v.useChildPattern(b),v.useChildPattern(f),v.useChildPattern(d)}),N=e.createTokenPattern({pattern:{innerType:"InstructionInstructionValue",start:{regex:/'/,type:"InstructionInstructionValue"},end:{regex:/'/,type:"InstructionInstructionValue"}}},v=>{v.useChildPattern(T),v.useChildPattern(I),v.useChildPattern(b),v.useChildPattern(f),v.useChildPattern(d)}),b=e.createTokenPattern({pattern:{innerType:"InstructionInstructionValue",start:{regex:/`/,type:"InstructionInstructionValue"},end:{regex:/`/,type:"InstructionInstructionValue"}}},v=>{v.useChildPattern(T),v.useChildPattern(I),v.useChildPattern(N),v.useChildPattern(f),v.useChildPattern(d)}),D=e.createTokenPattern({pattern:{regex:/\$[^(\s\n/{]+/,type:"InstructionStart"}}),P=e.createTokenPattern({pattern:{start:{regex:/\(/,type:"InstructionInstructionOpeningBracket"},end:{regex:/\)/,type:"InstructionInstructionClosingBracket"}}},v=>{v.useChildPattern(T),v.useChildPattern(I),v.useChildPattern(N),v.useChildPattern(b),v.useChildPattern(f),v.useChildPattern(d)}),Ee=e.createTokenPattern({pattern:{start:{regex:/{/,type:"InstructionBodyStartBraket"},end:{regex:/}/,type:"InstructionBodyCloseBraket"}}},v=>{for(let Dn of Z)v.useChildPattern(Dn)}),Z=[s,u,h,l,n,D,P,Ee,o];for(let v of Z)e.useRootTokenPattern(v);return e}createParser(e){let t=new tn(e),n=_.define(()=>B.new().required("ExpressionStart").optional("value","ExpressionValue").required("ExpressionEnd")).converter(b=>{let D=new ke;return D.value=b.value??"",D}),r=_.define(()=>{let b=r;return B.new().required("data[]",B.new().required("value",[n,B.new().required("text","XmlValue")])).optional("data<-data",b)}),o=_.define(()=>B.new().required("name","Identifier").optional("attributeValue",B.new().required("XmlAssignment").required("XmlExplicitValueIdentifier").optional("list<-data",r).required("XmlExplicitValueIdentifier"))).converter(b=>{let D=new Array;if(b.attributeValue?.list)for(let P of b.attributeValue.list)P.value instanceof ke?D.push(P.value):D.push(P.value.text);return{name:b.name,values:D}}),s=_.define(()=>{let b=s;return B.new().required("data[]",o).optional("data<-data",b)}),a=_.define(()=>{let b=a;return B.new().required("data[]",B.new().required("value",[n,B.new().required("text","XmlValue"),B.new().required("XmlExplicitValueIdentifier").required("text","XmlValue").required("XmlExplicitValueIdentifier")])).optional("data<-data",b)}),l=_.define(()=>B.new().required("list<-data",a)).converter(b=>{let D=new Oe;for(let P of b.list)P.value instanceof ke?D.addValue(P.value):D.addValue(P.value.text);return D}),u=_.define(()=>B.new().required("XmlComment")).converter(()=>null),h=_.define(()=>B.new().required("XmlOpenBracket").required("openingTagName","Identifier").optional("attributes<-data",s).required("closing",[B.new().required("XmlCloseClosingBracket"),B.new().required("XmlCloseBracket").required("values",I).required("XmlOpenClosingBracket").required("closingTageName","Identifier").required("XmlCloseBracket")])).converter(b=>{if("closingTageName"in b.closing&&b.openingTagName!==b.closing.closingTageName)throw new g(`Opening (${b.openingTagName}) and closing tagname (${b.closing.closingTageName}) does not match`,this);let D=new Ge;if(D.tagName=b.openingTagName,b.attributes)for(let P of b.attributes)D.setAttribute(P.name).addValue(...P.values);return"values"in b.closing&&D.appendChild(...b.closing.values),D}),d=_.define(()=>{let b=d;return B.new().required("list[]","InstructionInstructionValue").optional("list<-list",b)}),T=_.define(()=>B.new().required("instructionName","InstructionStart").optional("instruction",B.new().required("InstructionInstructionOpeningBracket").required("value<-list",d).required("InstructionInstructionClosingBracket")).optional("body",B.new().required("InstructionBodyStartBraket").required("value",I).required("InstructionBodyCloseBraket"))).converter(b=>{let D=new st;return D.instructionType=b.instructionName.substring(1),D.instruction=b.instruction?.value.join("")??"",b.body&&D.appendChild(...b.body.value),D}),f=_.define(()=>{let b=f;return B.new().required("list[]",[u,h,T,l]).optional("list<-list",b)}),I=_.define(()=>{let b=f;return B.new().optional("list<-list",b)}).converter(b=>{let D=new Array;if(b.list)for(let P of b.list)P!==null&&D.push(P);return D}),N=_.define(()=>B.new().required("content",I)).converter(b=>{let D=new me;return D.appendChild(...b.content),D});return t.setRootGraph(N),t}}});var Te,At=p(()=>{L();xt();vr();Wt();it();fr();ne();Ir();wr();ki();Ct();Mr();Te=class i extends kt{static mTemplateCache=new A;static mXmlParser=new nn;mComponentElement;mRootBuilder;mUpdateMode;get element(){return this.mComponentElement.htmlElement}get updateMode(){return this.mUpdateMode}constructor(e){super({applicationContext:e.applicationContext,constructor:e.processorConstructor,loggingType:1,trigger:127,isolate:(e.updateMode&1)!==0,trackConstructorChanges:!0}),oe.registerComponent(this,e.htmlElement),this.addCreationHook(n=>{oe.registerComponent(this,this.mComponentElement.htmlElement,n)}).addCreationHook(n=>this.registerObject(n)).addCreationHook(n=>{oe.registerComponent(this,this.mComponentElement.htmlElement,n)});let t=i.mTemplateCache.get(e.processorConstructor);t?t=t.clone():(t=i.mXmlParser.parse(e.templateString??""),i.mTemplateCache.set(e.processorConstructor,t)),this.mUpdateMode=e.updateMode,this.mComponentElement=new Qt(e.htmlElement),this.mRootBuilder=new St(this.applicationContext,t,new Kn(this,e.expressionModule),new be(this),"ROOT"),this.mComponentElement.shadowRoot.appendChild(this.mRootBuilder.anchor),this.setProcessorAttributes(Ne,new Ne(this.mRootBuilder.values)),this.setProcessorAttributes(i,this),(e.updateMode&2)===0&&this.setAutoUpdate(127)}addStyle(e){let t=document.createElement("style");t.innerHTML=e,this.mComponentElement.shadowRoot.prepend(t)}attributeChanged(e,t,n){this.call("onAttributeChange",!1,e,t,n)}connected(){this.call("onConnect",!1)}deconstruct(){this.call("onDeconstruct",!1),this.mRootBuilder.deconstruct(),super.deconstruct()}disconnected(){this.call("onDisconnect",!1)}onUpdate(){return this.mRootBuilder.update()?(this.call("onUpdate",!1),!0):!1}}});function F(i){return U.enableGlobalTracing(Oc(globalThis)),(e,t)=>{x.registerInjectable(e,t.metadata,"instanced"),oe.registerConstructor(e,i.selector);let n=class extends HTMLElement{mComponent;constructor(){super();let r=U.current.attachment(tt.CONFIGURATION_ATTACHMENT);r||(r=Pt.DEFAULT),this.mComponent=new Te({applicationContext:r,processorConstructor:e,templateString:i.template??null,expressionModule:i.expressionmodule,htmlElement:this,updateMode:i.updateScope??0}).setup(),i.style&&this.mComponent.addStyle(i.style),this.mComponent.update()}connectedCallback(){this.mComponent.connected()}disconnectedCallback(){this.mComponent.disconnected()}};globalThis.customElements.define(i.selector,n)}}var Oc,Ri=p(()=>{K();Ht();dr();ce();fr();Ct();At();Oc=i=>{let e={target:i,patches:{requirements:{promise:i.Promise?.name,eventTarget:i.EventTarget?.name},classes:{eventTargets:new Array,callback:new Array},functions:new Array},errorHandling:!0},t=[i.requestAnimationFrame?.name,i.setInterval?.name,i.setTimeout?.name];e.patches.functions.push(...t.filter(o=>!!o));let n=[i.XMLHttpRequestEventTarget?.name,i.XMLHttpRequest?.name,i.Document?.name,i.SVGElement?.name,i.Element?.name,i.HTMLElement?.name,i.HTMLMediaElement?.name,i.HTMLFrameSetElement?.name,i.HTMLBodyElement?.name,i.HTMLFrameElement?.name,i.HTMLIFrameElement?.name,i.HTMLMarqueeElement?.name,i.Worker?.name,i.IDBRequest?.name,i.IDBOpenDBRequest?.name,i.IDBDatabase?.name,i.IDBTransaction?.name,i.WebSocket?.name,i.FileReader?.name,i.Notification?.name,i.RTCPeerConnection?.name];e.patches.classes.eventTargets.push(...n.filter(o=>!!o));let r=[i.ResizeObserver?.name,i.MutationObserver?.name,i.IntersectionObserver?.name];return e.patches.classes.callback.push(...r.filter(o=>!!o)),e}});var Oi=p(()=>{wt()});function ht(i){return(e,t)=>{x.registerInjectable(e,t.metadata,"instanced"),de.register(He,e,{access:i.access,trigger:i.trigger,targetRestrictions:i.targetRestrictions})}}var rn=p(()=>{K();rt();On()});function Fe(i){return(e,t)=>{x.registerInjectable(e,t.metadata,"instanced"),de.register(le,e,{access:i.access,selector:i.selector,trigger:i.trigger})}}var Rt=p(()=>{K();rt();pt()});function Ve(i){return(e,t)=>{x.registerInjectable(e,t.metadata,"instanced"),de.register(Ye,e,{instructionType:i.instructionType,trigger:i.trigger})}}var Ot=p(()=>{K();rt();Hn()});var Gi,Rr,Gc,Gt,on,Yn=p(()=>{K();At();se();De();ne();rn();Gi=[ht({access:1,trigger:127,targetRestrictions:[Te]})];Gt=class Gt extends(Gc=w){static METADATA_USER_EVENT_LISTENER_PROPERIES="pwb:user_event_listener_properties";mEventListenerList;mTargetElement;constructor(e=x.use(Te)){super();let t=new Array,n=e.processorConstructor;do{let r=ie.get(n).getMetadata(Gt.METADATA_USER_EVENT_LISTENER_PROPERIES);if(r)for(let o of r)t.push(o)}while(n=Object.getPrototypeOf(n));this.mEventListenerList=new Array,this.mTargetElement=e.element;for(let r of t){let[o,s]=r,a=Reflect.get(e.processor,o);a=a.bind(e.processor),this.mEventListenerList.push([s,a]),this.mTargetElement.addEventListener(s,a)}}onDeconstruct(){for(let e of this.mEventListenerList){let[t,n]=e;this.mTargetElement.removeEventListener(t,n)}}};Rr=E(Gc),Gt=m(Rr,0,"ComponentEventListenerComponentExtension",Gi,Gt),c(Rr,1,Gt);on=Gt});var Bi=p(()=>{L();K();Yn()});var sn,Or=p(()=>{sn=class extends window.Event{mValue;get value(){return this.mValue}constructor(e,t){super(e),this.mValue=t}}});var an,Gr=p(()=>{Or();an=class{mElement;mEventName;constructor(e,t){this.mEventName=e,this.mElement=t}dispatchEvent(e){let t=new sn(this.mEventName,e);this.mElement.dispatchEvent(t)}}});function S(i){return(e,t)=>{if(t.static)throw new g("Event target is not for a static property.",S);let n=null;return{get(){if(!n){let r=(()=>{try{return oe.ofProcessor(this).component}catch{throw new g("PwbComponentEvent target class is not a component.",this)}})();n=new an(i,r.element)}return n}}}}var Fi=p(()=>{L();Ct();Gr()});var Vi,Br,Bc,Bt,ln,Fr=p(()=>{L();K();At();se();De();ne();rn();Vi=[ht({access:2,trigger:127,targetRestrictions:[Te]})];Bt=class Bt extends(Bc=w){static METADATA_EXPORTED_PROPERTIES="pwb:exported_properties";mComponent;constructor(e=x.use(Te)){super(),this.mComponent=e;let t=new Y,n=e.processorConstructor;do{let o=ie.get(n).getMetadata(Bt.METADATA_EXPORTED_PROPERTIES);o&&t.push(...o)}while(n=Object.getPrototypeOf(n));let r=new Set(t);r.size>0&&this.connectExportedProperties(r)}connectExportedProperties(e){this.exportPropertyAsAttribute(e),this.patchHtmlAttributes(e)}exportPropertyAsAttribute(e){for(let t of e){let n={};n.enumerable=!0,n.configurable=!0,delete n.value,delete n.writable,n.set=r=>{Reflect.set(this.mComponent.processor,t,r)},n.get=()=>{let r=Reflect.get(this.mComponent.processor,t);return typeof r=="function"&&(r=r.bind(this.mComponent.processor)),r},Object.defineProperty(this.mComponent.element,t,n)}}patchHtmlAttributes(e){let t=this.mComponent.element.getAttribute;new MutationObserver(r=>{for(let o of r){let s=o.attributeName,a=t.call(this.mComponent.element,s);Reflect.set(this.mComponent.element,s,a),this.mComponent.attributeChanged(s,o.oldValue,a)}}).observe(this.mComponent.element,{attributeFilter:[...e],attributeOldValue:!0});for(let r of e)if(this.mComponent.element.hasAttribute(r)){let o=t.call(this.mComponent.element,r);this.mComponent.element.setAttribute(r,o)}this.mComponent.element.getAttribute=r=>e.has(r)?Reflect.get(this.mComponent.element,r):t.call(this.mComponent.element,r)}};Br=E(Bc),Bt=m(Br,0,"ExportExtension",Vi,Bt),c(Br,1,Bt);ln=Bt});function C(i,e){if(e.static)throw new g("Event target is not for a static property.",C);let t=ie.forInternalDecorator(e.metadata),n=t.getMetadata(ln.METADATA_EXPORTED_PROPERTIES)??new Array;n.push(e.name),t.setMetadata(ln.METADATA_EXPORTED_PROPERTIES,n)}var ji=p(()=>{L();K();Fr()});function ue(i){return(e,t)=>{if(t.static)throw new g("Event target is not for a static property.",ue);return{get(){let o=(()=>{try{return oe.ofProcessor(this).component}catch{throw new g("PwbChild target class is not a component.",this)}})().getProcessorAttribute(Ne).data.store[i];if(o instanceof Element)return o;throw new g(`Can't find child "${i}".`,this)}}}}var Ui=p(()=>{L();Ct();Wt()});var $i,Vr,Fc,cn,zi=p(()=>{L();K();at();se();it();xe();ne();We();dt();Ot();$i=[Ve({instructionType:"dynamic-content",trigger:111})];cn=class extends(Fc=w){mLastTemplate;mModuleValues;mProcedure;constructor(e=x.use(q),t=x.use(H)){super(),this.mModuleValues=t,this.mLastTemplate=null,this.mProcedure=this.mModuleValues.createExpressionProcedure(e.value)}onUpdate(){let e=this.mProcedure.execute();if(!e||!(e instanceof me))throw new g("Dynamic content method has a wrong result type.",this);if(this.mLastTemplate!==null&&this.mLastTemplate.equals(e))return null;let t=e.clone();this.mLastTemplate=t;let n=new ge;return n.addElement(t,new be(this.mModuleValues.data)),n}};Vr=E(Fc),cn=m(Vr,0,"DynamicContentInstructionModule",$i,cn),c(Vr,1,cn)});var Hi,jr,Vc,un,Ki=p(()=>{K();se();xe();De();ne();Rt();ut();Be();Hi=[Fe({access:3,selector:/^\([[\w\-$]+\)$/,trigger:127})];un=class extends(Vc=w){mEventName;mListener;mTarget;constructor(e=x.use(Q),t=x.use(H),n=x.use(he)){super(),this.mTarget=e,this.mEventName=n.name.substring(1,n.name.length-1);let r=t.createExpressionProcedure(n.value,["$event"]);this.mListener=o=>{r.setTemporaryValue("$event",o),r.execute()},this.mTarget.addEventListener(this.mEventName,this.mListener)}onDeconstruct(){this.mTarget.removeEventListener(this.mEventName,this.mListener)}};jr=E(Vc),un=m(jr,0,"EventAttributeModule",Hi,un),c(jr,1,un)});var Xi,Ur,jc,pn,Wi=p(()=>{L();K();at();se();it();xe();ne();We();lt();dt();Ot();Xi=[Ve({instructionType:"for",trigger:111})];pn=class extends(jc=w){mExpression;mLastEntries;mModuleValues;mTemplate;constructor(e=x.use(ve),t=x.use(H),n=x.use(q)){super(),this.mTemplate=e,this.mModuleValues=t,this.mLastEntries=new Array;let r=n.value,s=new RegExp(/^\s*([a-zA-Z]+[a-zA-Z0-9]*)\s*of\s+([^;]+)\s*(;\s*([a-zA-Z]+[a-zA-Z0-9]*)\s*=\s*(.*)\s*)?$/).exec(r);if(!s)throw new g(`For-Parameter value has wrong format: ${r}`,this);let a=s[1],l=s[2],u=s[4]??null,h=s[5],d=this.mModuleValues.createExpressionProcedure(l),T=u?this.mModuleValues.createExpressionProcedure(h,["$index",a]):null;this.mExpression={iterateVariableName:a,iterateValueProcedure:d,indexExportVariableName:u,indexExportProcedure:T}}onUpdate(){let e=new ge,t=this.mExpression.iterateValueProcedure.execute();if(typeof t=="object"&&t!==null||Array.isArray(t)){let n=Symbol.iterator in t?Object.entries([...t]):Object.entries(t);if(this.compareEntries(n,this.mLastEntries))return null;this.mLastEntries=n;for(let[r,o]of n)this.addTemplateForElement(e,this.mExpression,o,r);return e}else return null}addTemplateForElement=(e,t,n,r)=>{let o=new be(this.mModuleValues.data);if(o.setTemporaryValue(t.iterateVariableName,n),t.indexExportProcedure&&t.indexExportVariableName){t.indexExportProcedure.setTemporaryValue("$index",r),t.indexExportProcedure.setTemporaryValue(t.iterateVariableName,n);let a=t.indexExportProcedure.execute();o.setTemporaryValue(t.indexExportVariableName,a)}let s=new me;s.appendChild(...this.mTemplate.childList),e.addElement(s,o)};compareEntries(e,t){if(e.length!==t.length)return!1;for(let n=0;n<e.length;n++){let[r,o]=e[n],[s,a]=t[n];if(r!==s||o!==a)return!1}return!0}};Ur=E(jc),pn=m(Ur,0,"ForInstructionModule",Xi,pn),c(Ur,1,pn)});var Zi,$r,Uc,dn,Yi=p(()=>{K();at();se();it();xe();ne();We();lt();dt();Ot();Zi=[Ve({instructionType:"if",trigger:111})];dn=class extends(Uc=w){mLastBoolean;mModuleValues;mProcedure;mTemplateReference;constructor(e=x.use(ve),t=x.use(H),n=x.use(q)){super(),this.mTemplateReference=e,this.mModuleValues=t,this.mProcedure=this.mModuleValues.createExpressionProcedure(n.value),this.mLastBoolean=!1}onUpdate(){let e=this.mProcedure.execute();if(!!e!==this.mLastBoolean){this.mLastBoolean=!!e;let t=new ge;if(e){let n=new me;n.appendChild(...this.mTemplateReference.childList),t.addElement(n,new be(this.mModuleValues.data))}return t}else return null}};$r=E(Uc),dn=m($r,0,"IfInstructionModule",Zi,dn),c($r,1,dn)});var _i,zr,$c,mn,qi=p(()=>{K();se();xe();De();ne();Rt();ut();Be();_i=[Fe({access:1,selector:/^\[[\w$]+\]$/,trigger:127})];mn=class extends($c=w){mLastValue;mProcedure;mTarget;mTargetProperty;constructor(e=x.use(Q),t=x.use(H),n=x.use(he)){super(),this.mTarget=e,this.mProcedure=t.createExpressionProcedure(n.value),this.mTargetProperty=n.name.substring(1,n.name.length-1),this.mLastValue=Symbol("Uncomparable")}onUpdate(){let e=this.mProcedure.execute();return e===this.mLastValue?!1:(this.mLastValue=e,Reflect.set(this.mTarget,this.mTargetProperty,e),!0)}};zr=E($c),mn=m(zr,0,"OneWayBindingAttributeModule",_i,mn),c(zr,1,mn)});var Ji,Hr,zc,hn,Qi=p(()=>{K();se();Wt();De();ne();pt();Rt();ut();Be();Ji=[Fe({access:3,selector:/^#[[\w$]+$/,trigger:127})];hn=class extends(zc=w){constructor(e=x.use(Q),t=x.use(le),n=x.use(he),r=x.use(Ne)){super();let o=e,s=t.registerObject(o);r.setTemporaryValue(n.name.substring(1),s)}};Hr=E(zc),hn=m(Hr,0,"PwbChildAttributeModule",Ji,hn),c(Hr,1,hn)});var es,Kr,Hc,gn,ts=p(()=>{K();Jt();at();se();xe();ne();We();dt();Ot();es=[Ve({instructionType:"slot",trigger:0})];gn=class extends(Hc=w){mIsSetup;mModuleValues;mSlotName;constructor(e=x.use(H),t=x.use(q)){super(),this.mModuleValues=e,this.mSlotName=t.value,this.mIsSetup=!1}onUpdate(){if(this.mIsSetup)return null;this.mIsSetup=!0;let e=new Ge;e.tagName="slot",this.mSlotName!==""&&e.setAttribute("name").addValue(this.mSlotName);let t=new me;t.appendChild(e);let n=new ge;return n.addElement(t,this.mModuleValues.data),n}};Kr=E(Hc),gn=m(Kr,0,"SlotInstructionModule",es,gn),c(Kr,1,gn)});var ns,Xr,Kc,yn,rs=p(()=>{se();De();ne();pt();Rt();ut();Be();xe();K();ns=[Fe({access:2,selector:/^\[\([[\w$]+\)\]$/,trigger:127})];yn=class extends(Kc=w){mAttributeKey;mLastDataValue;mReadProcedure;mTargetNode;mWriteProcedure;constructor(e=x.use(Q),t=x.use(H),n=x.use(he),r=x.use(le)){super(),this.mTargetNode=e,this.mAttributeKey=n.name.substring(2,n.name.length-2),this.mReadProcedure=t.createExpressionProcedure(n.value),this.mWriteProcedure=t.createExpressionProcedure(`${n.value} = $DATA;`,["$DATA"]),this.mLastDataValue=Symbol("Uncomparable"),r.registerObject(this.mTargetNode)}onUpdate(){let e=this.mReadProcedure.execute();if(e!==this.mLastDataValue)return Reflect.set(this.mTargetNode,this.mAttributeKey,e),this.mLastDataValue=e,!0;let t=Reflect.get(this.mTargetNode,this.mAttributeKey);return t!==e?(this.mWriteProcedure.setTemporaryValue("$DATA",t),this.mWriteProcedure.execute(),this.mLastDataValue=t,!0):!1}};Xr=E(Kc),yn=m(Xr,0,"TwoWayBindingAttributeModule",ns,yn),c(Xr,1,yn)});var os,Wr,Xc,fn,is=p(()=>{K();se();De();ne();rn();pt();Be();Yn();os=[ht({access:1,trigger:127,targetRestrictions:[le]})];fn=class extends(Xc=w){mEventListenerList;mTargetElement;constructor(e=x.use(le),t=x.use(Q)){super();let n=new Array,r=e.processorConstructor;do{let o=ie.get(r).getMetadata(on.METADATA_USER_EVENT_LISTENER_PROPERIES);if(o)for(let s of o)n.push(s)}while(r=Object.getPrototypeOf(r));this.mEventListenerList=new Array,this.mTargetElement=t;for(let o of n){let[s,a]=o,l=Reflect.get(e.processor,s);l=l.bind(e.processor),this.mEventListenerList.push([a,l]),this.mTargetElement.addEventListener(a,l)}}onDeconstruct(){for(let e of this.mEventListenerList){let[t,n]=e;this.mTargetElement.removeEventListener(t,n)}}};Wr=E(Xc),fn=m(Wr,0,"ComponentEventListenerModuleExtension",os,fn),c(Wr,1,fn)});var ce=p(()=>{mi();Ri();Oi();se();xe();On();pt();zn();ut();Be();lt();Hn();wr();At();Wt();it();Gn();xe();rn();Rt();kr();dt();Ot();De();Bi();Gr();Or();Fi();ji();Ui();Bn();_t();Jt();xr();Yt();Mr();zi();Ki();Wi();Yi();qi();Qi();ts();rs();Yn();is();Fr()});var as,ss=p(()=>{as=`:host {\r
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
`});var cs,ls=p(()=>{cs=`<div class="editor-layout">\r
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
</div>`});var _n,us=p(()=>{_n=class{mCommentToken;mFunctionCodeGenerator;mGlobalValues;mMainFunctions;mNodeDefinitions;mPreviewCallback;get commentToken(){return this.mCommentToken}get functionCodeGenerator(){return this.mFunctionCodeGenerator}get globalValues(){return this.mGlobalValues}get mainFunctions(){return this.mMainFunctions}get nodeDefinitions(){return this.mNodeDefinitions}get previewCallback(){return this.mPreviewCallback}constructor(){this.mCommentToken="//",this.mNodeDefinitions=new Map,this.mMainFunctions=new Array,this.mGlobalValues=new Array,this.mPreviewCallback=null,this.mFunctionCodeGenerator=null}addGlobalValue(e){this.mGlobalValues.push(e)}addMainFunction(e){this.mMainFunctions.push(e)}addNodeDefinition(e){this.mNodeDefinitions.set(e.name,e)}setCommentToken(e){this.mCommentToken=e}setFunctionCodeGenerator(e){this.mFunctionCodeGenerator=e}setPreviewCallback(e){this.mPreviewCallback=e}}});var Le,bn,_e=p(()=>{Le=(l=>(l.Input="input",l.Output="output",l.Value="value",l.Function="function",l.Flow="flow",l.Comment="comment",l.Operator="operator",l.TypeConversion="type-conversion",l))(Le||{}),bn={input:{icon:"\u25B6",cssColor:"var(--pn-cat-input)",label:"Input"},output:{icon:"\u25C0",cssColor:"var(--pn-cat-output)",label:"Output"},value:{icon:"\u2261",cssColor:"var(--pn-cat-value)",label:"Value"},function:{icon:"\u0192",cssColor:"var(--pn-cat-function)",label:"Function"},flow:{icon:"\u27F3",cssColor:"var(--pn-cat-flow)",label:"Flow"},comment:{icon:"\u270E",cssColor:"var(--pn-cat-comment)",label:"Comment"},operator:{icon:"\u2211",cssColor:"var(--pn-cat-operator)",label:"Operator"},"type-conversion":{icon:"\u21C4",cssColor:"var(--pn-cat-type-conversion)",label:"Type Conversion"}}});var gt=p(()=>{});var qe,Zr=p(()=>{qe=class{id;kind;sourceNodeId;sourcePortId;targetNodeId;targetPortId;mValid;get valid(){return this.mValid}set valid(e){this.mValid=e}constructor(e,t,n,r,o,s){this.id=e,this.sourceNodeId=t,this.sourcePortId=n,this.targetNodeId=r,this.targetPortId=o,this.kind=s,this.mValid=!0}}});var Yr=p(()=>{});var Tn,ps=p(()=>{Tn=class{direction;id;name;mConnectedTo;get connectedTo(){return this.mConnectedTo}set connectedTo(e){this.mConnectedTo=e}constructor(e,t,n){this.id=e,this.name=t,this.direction=n,this.mConnectedTo=null}}});var vn,ds=p(()=>{vn=class{direction;id;name;type;valueId;mConnectedTo;get connectedTo(){return this.mConnectedTo}set connectedTo(e){this.mConnectedTo=e}constructor(e,t,n,r,o){this.id=e,this.name=t,this.type=n,this.direction=r,this.valueId=o,this.mConnectedTo=null}}});var yt,_r=p(()=>{Yr();ps();ds();yt=class i{category;definitionName;flowInputs;flowOutputs;id;inputs;outputs;properties;system;mPosition;mSize;get position(){return this.mPosition}get size(){return this.mSize}constructor(e,t,n,r){this.id=e,this.definitionName=t.name,this.category=t.category,this.system=r,this.mPosition={x:n.x,y:n.y},this.mSize={w:8,h:4},this.properties=new Map,this.inputs=new Map;for(let o of t.inputs){let s=i.generatePortId(),a=i.generateValueId(t.category);this.inputs.set(o.name,new vn(s,o.name,o.type,"input",a))}this.outputs=new Map;for(let o of t.outputs){let s=i.generatePortId(),a=i.generateValueId(t.category);this.outputs.set(o.name,new vn(s,o.name,o.type,"output",a))}if(this.flowInputs=new Map,t.flowInputs)for(let o of t.flowInputs){let s=i.generatePortId();this.flowInputs.set(o,new Tn(s,o,"input"))}if(this.flowOutputs=new Map,t.flowOutputs)for(let o of t.flowOutputs){let s=i.generatePortId();this.flowOutputs.set(o,new Tn(s,o,"output"))}}moveTo(e,t){this.mPosition={x:e,y:t}}resizeTo(e,t){this.mSize={w:Math.max(4,e),h:Math.max(2,t)}}static generatePortId(){return crypto.randomUUID().substring(0,8)}static generateValueId(e){let t=crypto.randomUUID().replace(/-/g,"").substring(0,12);return`${String(e).replace(/[^a-zA-Z0-9]/g,"")}_${t}`}}});var qn,ms=p(()=>{gt();Zr();_r();qn=class{mConnections;mNodes;get connections(){return this.mConnections}get nodes(){return this.mNodes}constructor(){this.mNodes=new Map,this.mConnections=new Map}addNode(e,t,n=!1){let r=crypto.randomUUID(),o=new yt(r,e,t,n);return this.mNodes.set(r,o),o}addExistingNode(e){this.mNodes.set(e.id,e)}removeNode(e){let t=new Array;for(let[n,r]of this.mConnections)(r.sourceNodeId===e||r.targetNodeId===e)&&(t.push(r),this.mConnections.delete(n));return this.mNodes.delete(e),t}addConnection(e,t,n,r,o){let s=this.mNodes.get(e),a=this.mNodes.get(n);if(!s||!a||e===n)return null;if(o==="data"){let l=this.findDataPortById(s,t),u=this.findDataPortById(a,r);if(!l||!u)return null;let h=l.type===u.type;for(let[f,I]of this.mConnections)if(I.targetNodeId===n&&I.targetPortId===r&&I.kind==="data"){this.mConnections.delete(f);break}u.connectedTo=l.valueId;let d=crypto.randomUUID(),T=new qe(d,e,t,n,r,o);return T.valid=h,this.mConnections.set(d,T),T}else{let l=this.findFlowPortById(s,t),u=this.findFlowPortById(a,r);if(!l||!u)return null;for(let[T,f]of this.mConnections)if(f.sourceNodeId===e&&f.sourcePortId===t&&f.kind==="flow"){this.mConnections.delete(T);break}l.connectedTo=u.id,u.connectedTo=l.id;let h=crypto.randomUUID(),d=new qe(h,e,t,n,r,o);return this.mConnections.set(h,d),d}}addExistingConnection(e){this.mConnections.set(e.id,e)}removeConnection(e){let t=this.mConnections.get(e);if(!t)return null;let n=this.mNodes.get(t.targetNodeId);if(n)if(t.kind==="data"){let r=this.findDataPortById(n,t.targetPortId);r&&(r.connectedTo=null)}else{let r=this.mNodes.get(t.sourceNodeId),o=r?this.findFlowPortById(r,t.sourcePortId):null,s=this.findFlowPortById(n,t.targetPortId);o&&(o.connectedTo=null),s&&(s.connectedTo=null)}return this.mConnections.delete(e),t}validate(){let e=new Array;for(let t of this.mConnections.values()){if(t.kind!=="data")continue;let n=this.mNodes.get(t.sourceNodeId),r=this.mNodes.get(t.targetNodeId);if(!n||!r){t.valid=!1,e.push(t);continue}let o=this.findDataPortById(n,t.sourcePortId),s=this.findDataPortById(r,t.targetPortId);if(!o||!s){t.valid=!1,e.push(t);continue}let a=o.type===s.type;t.valid=a,a||e.push(t)}return e}getNode(e){return this.mNodes.get(e)}getConnection(e){return this.mConnections.get(e)}getConnectionsForNode(e){let t=new Array;for(let n of this.mConnections.values())(n.sourceNodeId===e||n.targetNodeId===e)&&t.push(n);return t}findDataPortById(e,t){for(let n of e.inputs.values())if(n.id===t)return n;for(let n of e.outputs.values())if(n.id===t)return n;return null}findFlowPortById(e,t){for(let n of e.flowInputs.values())if(n.id===t)return n;for(let n of e.flowOutputs.values())if(n.id===t)return n;return null}}});var Ft,qr=p(()=>{ms();Ft=class{editableByUser;graph;id;system;mImports;mInputs;mLabel;mName;mOutputs;get imports(){return this.mImports}get inputs(){return this.mInputs}get label(){return this.mLabel}get name(){return this.mName}get outputs(){return this.mOutputs}constructor(e,t,n,r,o=!1){this.id=e,this.mName=t,this.mLabel=n,this.system=r,this.editableByUser=o,this.graph=new qn,this.mInputs=new Array,this.mOutputs=new Array,this.mImports=new Array}setName(e){this.mName=e}setLabel(e){this.mLabel=e}setInputs(e){this.mInputs=[...e]}setOutputs(e){this.mOutputs=[...e]}setImports(e){this.mImports=[...e]}addImport(e){this.mImports.includes(e)||this.mImports.push(e)}removeImport(e){let t=this.mImports.indexOf(e);t!==-1&&this.mImports.splice(t,1)}addInput(e){this.mInputs.push(e)}removeInput(e){this.mInputs.splice(e,1)}addOutput(e){this.mOutputs.push(e)}removeOutput(e){this.mOutputs.splice(e,1)}}});var Vt,Jr=p(()=>{us();_e();qr();Vt=class{configuration;mActiveFunctionId;mFunctions;get activeFunction(){return this.mFunctions.get(this.mActiveFunctionId)}get activeFunctionId(){return this.mActiveFunctionId}get functions(){return this.mFunctions}constructor(){this.configuration=new _n,this.mFunctions=new Map,this.mActiveFunctionId=""}initializeMainFunctions(){for(let e of this.configuration.mainFunctions){let t=this.addFunction(e.name,e.label,!0,e.editableByUser??!1);t.setInputs([...e.inputs]),t.setOutputs([...e.outputs]);for(let n of e.inputs){let r={name:n.name,category:"input",inputs:[],outputs:[{name:n.name,type:n.type}],codeGenerator:()=>""};t.graph.addNode(r,{x:2,y:2+e.inputs.indexOf(n)*3},!0)}for(let n of e.outputs){let r={name:n.name,category:"output",inputs:[{name:n.name,type:n.type}],outputs:[],codeGenerator:()=>""};t.graph.addNode(r,{x:30,y:2+e.outputs.indexOf(n)*3},!0)}this.mActiveFunctionId||(this.mActiveFunctionId=t.id)}}addFunction(e,t,n=!1,r=!1){let o=crypto.randomUUID(),s=new Ft(o,e,t,n,r);return this.mFunctions.set(o,s),this.mActiveFunctionId||(this.mActiveFunctionId=o),s}removeFunction(e){let t=this.mFunctions.get(e);if(!t||t.system)return!1;if(this.mFunctions.delete(e),this.mActiveFunctionId===e){let n=this.mFunctions.keys().next().value;this.mActiveFunctionId=n??""}return!0}setActiveFunction(e){return this.mFunctions.has(e)?(this.mActiveFunctionId=e,!0):!1}getFunction(e){return this.mFunctions.get(e)}}});var Jn,hs=p(()=>{Jn=class{mMaxSize;mRedoStack;mUndoStack;get canRedo(){return this.mRedoStack.length>0}get canUndo(){return this.mUndoStack.length>0}constructor(e=100){this.mUndoStack=new Array,this.mRedoStack=new Array,this.mMaxSize=e}push(e){e.apply(),this.mUndoStack.push(e),this.mRedoStack.length=0,this.mUndoStack.length>this.mMaxSize&&this.mUndoStack.shift()}undo(){let e=this.mUndoStack.pop();e&&(e.revert(),this.mRedoStack.push(e))}redo(){let e=this.mRedoStack.pop();e&&(e.apply(),this.mUndoStack.push(e))}clear(){this.mUndoStack.length=0,this.mRedoStack.length=0}}});var Qn,gs=p(()=>{gt();Qn=class{mData;get hasData(){return this.mData!==null}constructor(){this.mData=null}copy(e,t){let n=new Array,r=new Map;for(let a of t){let l=e.getNode(a);l&&!l.system&&(r.set(l.id,n.length),n.push(l))}if(n.length===0)return;let o=n.map(a=>{let l={};for(let[h,d]of a.properties)l[h]=d;let u=new Array;for(let[h,d]of a.inputs)d.connectedTo&&u.push({portName:h,connectedValueId:d.connectedTo});return{definitionName:a.definitionName,position:{...a.position},size:{...a.size},properties:l,inputConnections:u}}),s=[];for(let a of e.connections.values()){let l=r.get(a.sourceNodeId),u=r.get(a.targetNodeId);if(l!==void 0&&u!==void 0){let h=n[l],d=n[u],T="",f="",I;if(a.kind==="data"){I="data";for(let[N,b]of h.outputs)if(b.id===a.sourcePortId){T=N;break}for(let[N,b]of d.inputs)if(b.id===a.targetPortId){f=N;break}}else{I="flow";for(let[N,b]of h.flowOutputs)if(b.id===a.sourcePortId){T=N;break}for(let[N,b]of d.flowInputs)if(b.id===a.targetPortId){f=N;break}}T&&f&&s.push({sourceNodeIndex:l,sourcePortName:T,targetNodeIndex:u,targetPortName:f,kind:I})}}this.mData={nodes:o,internalConnections:s}}getData(){return this.mData}}});var xn,Qr=p(()=>{xn=class{bodyCode;inputs;name;outputs;constructor(){this.name="",this.bodyCode="",this.inputs=new Array,this.outputs=new Array}}});var Pn,eo=p(()=>{Pn=class{body;inputs;outputs;properties;constructor(){this.inputs=new Map,this.outputs=new Map,this.body=new Map,this.properties=new Map}}});var In,ys=p(()=>{_e();gt();Qr();eo();In=class{mConfig;constructor(e){this.mConfig=e}generateFunctionCode(e){let t=e.graph,n=this.generateGraphCode(t),r=new xn;r.name=e.name,r.bodyCode=n;for(let o of e.inputs){let s=this.findInputNodeValueId(t,o.name);r.inputs.push({name:o.name,type:o.type,valueId:s})}for(let o of e.outputs){let s=this.findOutputNodeValueId(t,o.name);r.outputs.push({name:o.name,type:o.type,valueId:s})}if(this.mConfig.functionCodeGenerator){let o=this.mConfig.functionCodeGenerator(r);return this.wrapWithMetadata(e,o)}return this.wrapWithMetadata(e,n)}generateProjectCode(e){let t=new Array;for(let n of e.values())t.push(this.generateFunctionCode(n));return t.join(`

`)}generateGraphCode(e){let t=this.topologicalSort(e),n=new Array;for(let r of t){if(r.category==="input"||r.category==="output")continue;let o=this.mConfig.nodeDefinitions.get(r.definitionName);if(!o)continue;let s=this.buildCodeNode(e,r);for(let[u,h]of r.flowOutputs)if(h.connectedTo){let d=this.generateFlowBodyCode(e,h.connectedTo);s.body.set(u,{code:d})}else s.body.set(u,{code:""});let a=o.codeGenerator(s),l=this.wrapNodeWithMetadata(r,a);n.push(l)}return n.join(`
`)}generateFlowBodyCode(e,t){let n=new Array,r=t;for(;r;){let o=this.findNodeByFlowPortId(e,r);if(!o)break;let s=this.mConfig.nodeDefinitions.get(o.definitionName);if(!s)break;let a=this.buildCodeNode(e,o);for(let[u,h]of o.flowOutputs)if(h.connectedTo){let d=this.generateFlowBodyCode(e,h.connectedTo);a.body.set(u,{code:d})}else a.body.set(u,{code:""});let l=s.codeGenerator(a);n.push(this.wrapNodeWithMetadata(o,l)),r=null}return n.join(`
`)}buildCodeNode(e,t){let n=new Pn;for(let[r,o]of t.inputs){let s=o.connectedTo??o.valueId;n.inputs.set(r,{name:r,type:o.type,valueId:s})}for(let[r,o]of t.outputs)n.outputs.set(r,{name:r,type:o.type,valueId:o.valueId});for(let[r,o]of t.properties)n.properties.set(r,o);return n}topologicalSort(e){let t=new Set,n=new Array,r=new Map;for(let s of e.nodes.values())r.set(s.id,new Set);for(let s of e.connections.values())if(s.kind==="data"){let a=r.get(s.targetNodeId);a&&a.add(s.sourceNodeId)}let o=s=>{if(t.has(s))return;t.add(s);let a=r.get(s);if(a)for(let u of a)o(u);let l=e.getNode(s);l&&n.push(l)};for(let s of e.nodes.keys())o(s);return n}findInputNodeValueId(e,t){for(let n of e.nodes.values())if(n.category==="input"&&n.definitionName===t){let r=n.outputs.values().next().value;if(r)return r.valueId}return t}findOutputNodeValueId(e,t){for(let n of e.nodes.values())if(n.category==="output"&&n.definitionName===t){let r=n.inputs.values().next().value;return r&&r.connectedTo?r.connectedTo:r?.valueId??t}return t}findNodeByFlowPortId(e,t){for(let n of e.nodes.values()){for(let r of n.flowInputs.values())if(r.id===t)return n;for(let r of n.flowOutputs.values())if(r.id===t)return n}return null}wrapWithMetadata(e,t){let n=this.mConfig.commentToken,r={type:"function",label:e.label,name:e.name,system:e.system,inputs:[...e.inputs],outputs:[...e.outputs],imports:[...e.imports]},o=`${n} __POTATNO_START: ${e.id} ${JSON.stringify(r)}`,s=`${n} __POTATNO_END: ${e.id}`;return`${o}
${t}
${s}`}wrapNodeWithMetadata(e,t){let n=this.mConfig.commentToken,r=new Array;for(let[T,f]of e.inputs)r.push({name:T,type:f.type,id:f.id,valueId:f.valueId,connectedTo:f.connectedTo});let o=new Array;for(let[T,f]of e.outputs)o.push({name:T,type:f.type,id:f.id,valueId:f.valueId});let s=new Array;for(let[T,f]of e.flowInputs)s.push({name:T,id:f.id,connectedTo:f.connectedTo});let a=new Array;for(let[T,f]of e.flowOutputs)a.push({name:T,id:f.id,connectedTo:f.connectedTo});let l={};for(let[T,f]of e.properties)l[T]=f;let u={type:e.definitionName,category:e.category,position:e.position,size:e.size,system:e.system,inputs:r,outputs:o,flowInputs:s,flowOutputs:a,properties:l},h=`${n} __POTATNO_START: ${e.id} ${JSON.stringify(u)}`,d=`${n} __POTATNO_END: ${e.id}`;return`${h}
${t}
${d}`}}});var wn,fs=p(()=>{ys();wn=class{mConfig;constructor(e){this.mConfig=e}serialize(e){return new In(this.mConfig).generateProjectCode(e.functions)}serializeFunction(e){return new In(this.mConfig).generateFunctionCode(e)}}});var er,bs=p(()=>{_e();gt();Zr();_r();qr();Jr();er=class{mConfig;constructor(e){this.mConfig=e}deserialize(e){let t=new Vt;for(let[o,s]of this.mConfig.nodeDefinitions)t.configuration.addNodeDefinition(s);for(let o of this.mConfig.mainFunctions)t.configuration.addMainFunction(o);for(let o of this.mConfig.globalValues)t.configuration.addGlobalValue(o);t.configuration.setCommentToken(this.mConfig.commentToken),this.mConfig.functionCodeGenerator&&t.configuration.setFunctionCodeGenerator(this.mConfig.functionCodeGenerator),this.mConfig.previewCallback&&t.configuration.setPreviewCallback(this.mConfig.previewCallback);let n=this.parseMarkers(e);for(let o of n)if(o.meta.type==="function"){let s=this.reconstructFunction(o);t.addFunction(s.name,s.label,s.system);let a=this.findFunctionByName(t,s.name);a&&(a.setInputs(s.inputs),a.setOutputs(s.outputs),a.setImports(s.imports),this.reconstructNodes(a,o.children))}let r=t.functions.keys().next().value;return r&&t.setActiveFunction(r),t}parseMarkers(e){let t=this.mConfig.commentToken,n=`${this.escapeRegex(t)} __POTATNO_START: `,r=`${this.escapeRegex(t)} __POTATNO_END: `,o=e.split(`
`),s=new Array,a=new Array;for(let l=0;l<o.length;l++){let u=o[l].trim();if(u.startsWith(n)){let h=u.substring(n.length),d=h.indexOf(" "),T=d>=0?h.substring(0,d):h,f=d>=0?h.substring(d+1):"{}",I;try{I=JSON.parse(f)}catch{I={}}let N={id:T,meta:I,innerCode:"",children:new Array};s.push({marker:N,startLine:l})}else if(u.startsWith(r)){let d=u.substring(r.length).trim();for(let T=s.length-1;T>=0;T--)if(s[T].marker.id===d){let f=s.splice(T,1)[0],I=new Array;for(let N=f.startLine+1;N<l;N++)I.push(o[N]);f.marker.innerCode=I.join(`
`),s.length>0?s[s.length-1].marker.children.push(f.marker):a.push(f.marker);break}}}return a}reconstructFunction(e){let t=new Ft(e.id,e.meta.name??"unnamed",e.meta.label??e.meta.name??"Unnamed",e.meta.system??!1);return Array.isArray(e.meta.inputs)&&t.setInputs(e.meta.inputs),Array.isArray(e.meta.outputs)&&t.setOutputs(e.meta.outputs),Array.isArray(e.meta.imports)&&t.setImports(e.meta.imports),t}reconstructNodes(e,t){for(let n of t){let r=n.meta,o=r.category,s=this.mConfig.nodeDefinitions.get(r.type);if(s){let a=new yt(n.id,s,r.position??{x:0,y:0},r.system??!1);if(r.size&&a.resizeTo(r.size.w,r.size.h),r.properties)for(let[l,u]of Object.entries(r.properties))a.properties.set(l,u);this.restorePortData(a,r),e.graph.addExistingNode(a)}else if(o==="input"||o==="output"){let a=(r.inputs??[]).map(d=>({name:d.name,type:d.type})),l=(r.outputs??[]).map(d=>({name:d.name,type:d.type})),u={name:r.type,category:o,inputs:a,outputs:l,codeGenerator:()=>""},h=new yt(n.id,u,r.position??{x:0,y:0},r.system??!0);this.restorePortData(h,r),e.graph.addExistingNode(h)}n.children.length>0&&this.reconstructNodes(e,n.children)}this.reconstructConnections(e)}restorePortData(e,t){if(Array.isArray(t.inputs))for(let n of t.inputs){let r=e.inputs.get(n.name);r&&n.connectedTo&&(r.connectedTo=n.connectedTo)}if(Array.isArray(t.flowInputs))for(let n of t.flowInputs){let r=e.flowInputs.get(n.name);r&&n.connectedTo&&(r.connectedTo=n.connectedTo)}if(Array.isArray(t.flowOutputs))for(let n of t.flowOutputs){let r=e.flowOutputs.get(n.name);r&&n.connectedTo&&(r.connectedTo=n.connectedTo)}}reconstructConnections(e){let t=e.graph,n=new Map;for(let o of t.nodes.values())for(let s of o.outputs.values())n.set(s.valueId,{nodeId:o.id,portId:s.id});for(let o of t.nodes.values())for(let s of o.inputs.values())if(s.connectedTo){let a=n.get(s.connectedTo);if(a){let l=new qe(crypto.randomUUID(),a.nodeId,a.portId,o.id,s.id,"data"),u=t.getNode(a.nodeId);if(u){let h;for(let d of u.outputs.values())if(d.id===a.portId){h=d;break}h&&(l.valid=h.type===s.type)}t.addExistingConnection(l)}}let r=new Map;for(let o of t.nodes.values()){for(let s of o.flowInputs.values())r.set(s.id,{nodeId:o.id,portId:s.id});for(let s of o.flowOutputs.values())r.set(s.id,{nodeId:o.id,portId:s.id})}for(let o of t.nodes.values())for(let s of o.flowOutputs.values())if(s.connectedTo){let a=r.get(s.connectedTo);if(a){let l=new qe(crypto.randomUUID(),o.id,s.id,a.nodeId,a.portId,"flow");t.addExistingConnection(l)}}}findFunctionByName(e,t){for(let n of e.functions.values())if(n.name===t)return n}escapeRegex(e){return e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}}});var En,tr,to=p(()=>{En=class{description;mDefinition;mGraph;mNode;mPosition;mSystem;get node(){return this.mNode}constructor(e,t,n,r=!1){this.description=`Add node: ${t.name}`,this.mGraph=e,this.mDefinition=t,this.mPosition=n,this.mSystem=r,this.mNode=null}apply(){this.mNode?this.mGraph.addExistingNode(this.mNode):this.mNode=this.mGraph.addNode(this.mDefinition,this.mPosition,this.mSystem)}revert(){this.mNode&&this.mGraph.removeNode(this.mNode.id)}},tr=class{description;mGraph;mNodeId;mRemovedConnections;mRemovedNode;constructor(e,t){this.description="Remove node",this.mGraph=e,this.mNodeId=t,this.mRemovedNode=null,this.mRemovedConnections=new Array}apply(){this.mRemovedNode=this.mGraph.getNode(this.mNodeId)??null,this.mRemovedConnections=this.mGraph.removeNode(this.mNodeId)}revert(){if(this.mRemovedNode){this.mGraph.addExistingNode(this.mRemovedNode);for(let e of this.mRemovedConnections)this.mGraph.addExistingConnection(e)}}}});var kn,Ts=p(()=>{kn=class{description;mNewValue;mNode;mOldValue;mPropertyName;constructor(e,t,n){this.description=`Change property: ${t}`,this.mNode=e,this.mPropertyName=t,this.mNewValue=n,this.mOldValue=e.properties.get(t)??""}apply(){this.mOldValue=this.mNode.properties.get(this.mPropertyName)??"",this.mNode.properties.set(this.mPropertyName,this.mNewValue)}revert(){this.mOldValue===""?this.mNode.properties.delete(this.mPropertyName):this.mNode.properties.set(this.mPropertyName,this.mOldValue)}}});var An,vs=p(()=>{An=class{description;mActions;constructor(e,t){this.description=e,this.mActions=t}apply(){for(let e of this.mActions)e.apply()}revert(){for(let e=this.mActions.length-1;e>=0;e--)this.mActions[e].revert()}}});var jt,no=p(()=>{jt=class i{static MAX_ZOOM=2;static MIN_ZOOM=.25;mGridSize;mPanX;mPanY;mSelectionEnd;mSelectionStart;mZoom;get gridSize(){return this.mGridSize}get panX(){return this.mPanX}get panY(){return this.mPanY}get selectionEnd(){return this.mSelectionEnd}get selectionStart(){return this.mSelectionStart}get zoom(){return this.mZoom}constructor(e=20){this.mGridSize=e,this.mPanX=0,this.mPanY=0,this.mZoom=1,this.mSelectionStart=null,this.mSelectionEnd=null}clearSelection(){this.mSelectionStart=null,this.mSelectionEnd=null}getGridBackgroundCss(){let e=this.mGridSize*this.mZoom,t=this.mPanX%e,n=this.mPanY%e,r=e*5,o=this.mPanX%r,s=this.mPanY%r;return[`background-size: ${e}px ${e}px, ${r}px ${r}px`,`background-position: ${t}px ${n}px, ${o}px ${s}px`,"background-image: radial-gradient(circle, var(--pn-grid-color) 1px, transparent 1px), radial-gradient(circle, var(--pn-grid-color) 1.5px, transparent 1.5px)"].join("; ")}getTransformCss(){return`translate(${this.mPanX}px, ${this.mPanY}px) scale(${this.mZoom})`}pan(e,t){this.mPanX+=e,this.mPanY+=t}screenToWorld(e,t){return{x:(e-this.mPanX)/this.mZoom,y:(t-this.mPanY)/this.mZoom}}setSelectionEnd(e,t){this.mSelectionEnd={x:e,y:t}}setSelectionStart(e,t){this.mSelectionStart={x:e,y:t}}snapToGrid(e,t){return{x:Math.round(e/this.mGridSize)*this.mGridSize,y:Math.round(t/this.mGridSize)*this.mGridSize}}worldToScreen(e,t){return{x:e*this.mZoom+this.mPanX,y:t*this.mZoom+this.mPanY}}zoomAt(e,t,n){let r=this.mZoom,o=1+n,s=this.mZoom*o;s=Math.max(i.MIN_ZOOM,Math.min(i.MAX_ZOOM,s));let a=(e-this.mPanX)/r,l=(t-this.mPanY)/r;this.mZoom=s,this.mPanX=e-a*this.mZoom,this.mPanY=t-l*this.mZoom}}});var Cs,ro,Ut,oo=p(()=>{Cs="http://www.w3.org/2000/svg",ro="data-temp-connection",Ut=class{clearAll(e){let t=e.querySelectorAll("path");for(let n of t)n.remove()}clearTempConnection(e){let t=e.querySelector(`[${ro}]`);t&&t.remove()}generateBezierPath(e,t,n,r){let o=Math.abs(n-e),s=Math.max(o*.4,50),a=e+s,l=t,u=n-s;return`M ${e} ${t} C ${a} ${l}, ${u} ${r}, ${n} ${r}`}renderConnections(e,t){let n=e.querySelectorAll(`path:not([${ro}])`);for(let r of n)r.remove();for(let r of t){let o=document.createElementNS(Cs,"path");o.setAttribute("d",this.generateBezierPath(r.sourceX,r.sourceY,r.targetX,r.targetY)),o.setAttribute("fill","none"),o.setAttribute("data-connection-id",r.id),o.style.stroke=r.valid?"#a6adc8":"#f38ba8",o.style.strokeWidth="2",r.valid||o.setAttribute("stroke-dasharray","6 3"),e.appendChild(o)}}renderTempConnection(e,t,n,r){this.clearTempConnection(e);let o=document.createElementNS(Cs,"path");o.setAttribute("d",this.generateBezierPath(t.x,t.y,n.x,n.y)),o.setAttribute("fill","none"),o.setAttribute(ro,"true"),o.style.stroke="#bac2de",o.style.strokeWidth="2",o.style.opacity="0.6",o.style.strokeDasharray="8 4",e.appendChild(o)}}});var Ps,xs=p(()=>{Ps=`:host {\r
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
`});var ws,Is=p(()=>{ws=`<div class="search-wrapper">\r
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
</div>`});var Es,ks,As,Ds,Je,io,ft,so=p(()=>{ce();_e();xs();Is();Ds=[F({selector:"potatno-node-library",template:ws,style:Ps})];ft=class extends(As=w,ks=[S("node-drag-start")],Es=[C],As){constructor(){super(...arguments);c(Je,5,this);y(this,"mNodeDefinitions",[]);y(this,"mCachedFilteredGroups",[]);k(this,io,c(Je,8,this)),c(Je,11,this);y(this,"mSearchQuery","");y(this,"mCollapsedCategories",{})}set nodeDefinitions(t){this.mNodeDefinitions=t,this.rebuildFilteredGroups()}get nodeDefinitions(){return this.mNodeDefinitions}get filteredGroups(){return this.mCachedFilteredGroups}rebuildFilteredGroups(){let t=this.mSearchQuery.toLowerCase(),n=new Map;for(let s of this.mNodeDefinitions){if(t&&!s.name.toLowerCase().includes(t))continue;let a=n.get(s.category);a||(a=[],n.set(s.category,a)),a.push(s)}let r=[],o=Object.values(Le);for(let s of o){let a=n.get(s);if(a&&a.length>0){let l=bn[s];r.push({category:s,icon:l.icon,label:l.label,cssColor:l.cssColor,nodes:a})}}this.mCachedFilteredGroups=r}onSearchInput(t){this.mSearchQuery=t.target.value,this.rebuildFilteredGroups()}toggleCategory(t){this.mCollapsedCategories[t]=!this.mCollapsedCategories[t],this.rebuildFilteredGroups()}isCategoryCollapsed(t){return!!this.mCollapsedCategories[t]}getToggleClass(t){return this.mCollapsedCategories[t]?"category-toggle collapsed":"category-toggle"}onNodeMouseDown(t){this.mNodeDragStart.dispatchEvent(t)}};Je=E(As),io=new WeakMap,m(Je,4,"mNodeDragStart",ks,ft,io),m(Je,3,"nodeDefinitions",Es,ft),ft=m(Je,0,"PotatnoNodeLibrary",Ds,ft),c(Je,1,ft)});var Ss,Ns=p(()=>{Ss=`:host {\r
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
`});var Ms,Ls=p(()=>{Ms=`<div class="function-list-content">\r
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
</div>`});var Rs,Os,Gs,Bs,Fs,Vs,js,J,ao,lo,co,Me,uo=p(()=>{ce();Ns();Ls();js=[F({selector:"potatno-function-list",template:Ms,style:Ss})];Me=class extends(Vs=w,Fs=[C],Bs=[C],Gs=[S("function-select")],Os=[S("function-add")],Rs=[S("function-delete")],Vs){constructor(){super(...arguments);y(this,"functions",c(J,20,this,[])),c(J,23,this);y(this,"activeFunctionId",c(J,24,this,"")),c(J,27,this);k(this,ao,c(J,8,this)),c(J,11,this);k(this,lo,c(J,12,this)),c(J,15,this);k(this,co,c(J,16,this)),c(J,19,this)}getEntryClass(t){return t===this.activeFunctionId?"function-entry active":"function-entry"}onFunctionSelect(t){this.mFunctionSelect.dispatchEvent(t)}onFunctionAdd(){this.mFunctionAdd.dispatchEvent(void 0)}onFunctionDelete(t,n){t.stopPropagation(),this.mFunctionDelete.dispatchEvent(n)}};J=E(Vs),ao=new WeakMap,lo=new WeakMap,co=new WeakMap,m(J,4,"mFunctionSelect",Gs,Me,ao),m(J,4,"mFunctionAdd",Os,Me,lo),m(J,4,"mFunctionDelete",Rs,Me,co),m(J,5,"functions",Fs,Me),m(J,5,"activeFunctionId",Bs,Me),Me=m(J,0,"PotatnoFunctionList",js,Me),c(J,1,Me)});var $s,Us=p(()=>{$s=`:host {\r
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
`});var Hs,zs=p(()=>{Hs=`<div class="tab-bar">\r
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
</div>`});var Ks,Xs,Ws,Zs,Ys,_s,qs,Js,Qs,z,po,mo,ho,go,Pe,ea=p(()=>{ce();Us();zs();so();uo();Qs=[F({selector:"potatno-panel-left",template:Hs,style:$s})];Pe=class extends(Js=w,qs=[C],_s=[C],Ys=[C],Zs=[S("node-drag-start")],Ws=[S("function-select")],Xs=[S("function-add")],Ks=[S("function-delete")],Js){constructor(){super(...arguments);y(this,"nodeDefinitions",c(z,24,this,[])),c(z,27,this);y(this,"functions",c(z,28,this,[])),c(z,31,this);y(this,"activeFunctionId",c(z,32,this,"")),c(z,35,this);k(this,po,c(z,8,this)),c(z,11,this);k(this,mo,c(z,12,this)),c(z,15,this);k(this,ho,c(z,16,this)),c(z,19,this);k(this,go,c(z,20,this)),c(z,23,this);y(this,"mActiveTabIndex",0)}get activeTabIndex(){return this.mActiveTabIndex}getTabClass(t){return t===this.mActiveTabIndex?"tab-button active":"tab-button"}onTabClick(t){this.mActiveTabIndex=t}onNodeDragStart(t){this.mNodeDragStart.dispatchEvent(t.value)}onFunctionSelect(t){this.mFunctionSelect.dispatchEvent(t.value)}onFunctionAdd(t){this.mFunctionAdd.dispatchEvent(void 0)}onFunctionDelete(t){this.mFunctionDelete.dispatchEvent(t.value)}};z=E(Js),po=new WeakMap,mo=new WeakMap,ho=new WeakMap,go=new WeakMap,m(z,4,"mNodeDragStart",Zs,Pe,po),m(z,4,"mFunctionSelect",Ws,Pe,mo),m(z,4,"mFunctionAdd",Xs,Pe,ho),m(z,4,"mFunctionDelete",Ks,Pe,go),m(z,5,"nodeDefinitions",qs,Pe),m(z,5,"functions",_s,Pe),m(z,5,"activeFunctionId",Ys,Pe),Pe=m(z,0,"PotatnoPanelLeft",Qs,Pe),c(z,1,Pe)});var na,ta=p(()=>{na=`:host {\r
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
`});var oa,ra=p(()=>{oa=`<div class="properties-header">Properties</div>\r
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
`});var ia,sa,aa,la,ca,ua,pa,da,ma,ha,ga,V,yo,ye,ya=p(()=>{ce();ta();ra();ga=[F({selector:"potatno-panel-properties",template:oa,style:na})];ye=class extends(ha=w,ma=[C],da=[C],pa=[C],ua=[C],ca=[C],la=[C],aa=[C],sa=[C],ia=[S("properties-change")],ha){constructor(){super(...arguments);c(V,5,this);y(this,"functionName",c(V,12,this,"")),c(V,15,this);y(this,"functionInputs",c(V,16,this,[])),c(V,19,this);y(this,"functionOutputs",c(V,20,this,[])),c(V,23,this);y(this,"mFunctionImports",[]);y(this,"isSystem",c(V,24,this,!1)),c(V,27,this);y(this,"editableByUser",c(V,28,this,!1)),c(V,31,this);y(this,"mAvailableImports",[]);y(this,"mAvailableTypes",[]);y(this,"mCachedUnusedImports",[]);y(this,"mSelectedImport","");k(this,yo,c(V,8,this)),c(V,11,this)}set functionImports(t){this.mFunctionImports=t,this.rebuildUnusedImports()}get functionImports(){return this.mFunctionImports}get nameDisabled(){return this.isSystem}get portsDisabled(){return this.isSystem&&!this.editableByUser}set availableImports(t){this.mAvailableImports=t,this.rebuildUnusedImports()}get availableImports(){return this.mAvailableImports}set availableTypes(t){this.mAvailableTypes=t}get availableTypes(){return this.mAvailableTypes}validateName(t){return/^[a-zA-Z][a-zA-Z0-9_]*$/.test(t)}isNameDuplicate(t,n,r){if(n!=="function"&&t===this.functionName)return!0;for(let o=0;o<this.functionInputs.length;o++)if(!(n==="input"&&o===r)&&this.functionInputs[o].name===t)return!0;for(let o=0;o<this.functionOutputs.length;o++)if(!(n==="output"&&o===r)&&this.functionOutputs[o].name===t)return!0;return!1}onNameChange(t){let n=t.target,r=n.value,o=!this.validateName(r)||this.isNameDuplicate(r,"function");n.style.borderColor=o?"var(--pn-accent-danger)":"",this.functionName=r,this.mPropertiesChange.dispatchEvent({name:r})}onInputNameChange(t,n){let r=n.target,o=r.value,s=!this.validateName(o)||this.isNameDuplicate(o,"input",t);r.style.borderColor=s?"var(--pn-accent-danger)":"";let a=[...this.functionInputs];a[t]={...a[t],name:o},this.functionInputs=a,this.mPropertiesChange.dispatchEvent({inputs:a})}onInputTypeChange(t,n){let r=n.target.value,o=[...this.functionInputs];o[t]={...o[t],type:r},this.functionInputs=o,this.mPropertiesChange.dispatchEvent({inputs:o})}onOutputNameChange(t,n){let r=n.target,o=r.value,s=!this.validateName(o)||this.isNameDuplicate(o,"output",t);r.style.borderColor=s?"var(--pn-accent-danger)":"";let a=[...this.functionOutputs];a[t]={...a[t],name:o},this.functionOutputs=a,this.mPropertiesChange.dispatchEvent({outputs:a})}onOutputTypeChange(t,n){let r=n.target.value,o=[...this.functionOutputs];o[t]={...o[t],type:r},this.functionOutputs=o,this.mPropertiesChange.dispatchEvent({outputs:o})}onAddInput(){let t=this.mAvailableTypes.length>0?this.mAvailableTypes[0]:"number",n=[...this.functionInputs,{name:"new_input",type:t}];this.functionInputs=n,this.mPropertiesChange.dispatchEvent({inputs:n})}onDeleteInput(t){let n=[...this.functionInputs];n.splice(t,1),this.functionInputs=n,this.mPropertiesChange.dispatchEvent({inputs:n})}onAddOutput(){let t=this.mAvailableTypes.length>0?this.mAvailableTypes[0]:"number",n=[...this.functionOutputs,{name:"new_output",type:t}];this.functionOutputs=n,this.mPropertiesChange.dispatchEvent({outputs:n})}onDeleteOutput(t){let n=[...this.functionOutputs];n.splice(t,1),this.functionOutputs=n,this.mPropertiesChange.dispatchEvent({outputs:n})}get unusedImports(){return this.mCachedUnusedImports}onImportSelectChange(t){this.mSelectedImport=t.target.value}onAddSelectedImport(){let t=this.mSelectedImport||(this.mCachedUnusedImports.length>0?this.mCachedUnusedImports[0]:"");if(!t)return;let n=[...this.mFunctionImports,t];this.functionImports=n,this.mSelectedImport="",this.mPropertiesChange.dispatchEvent({imports:n})}onDeleteImport(t){let n=[...this.mFunctionImports];n.splice(t,1),this.functionImports=n,this.mPropertiesChange.dispatchEvent({imports:n})}rebuildUnusedImports(){let t=new Set(this.mFunctionImports);this.mCachedUnusedImports=this.mAvailableImports.filter(n=>!t.has(n))}};V=E(ha),yo=new WeakMap,m(V,3,"functionImports",ua,ye),m(V,3,"availableImports",aa,ye),m(V,3,"availableTypes",sa,ye),m(V,4,"mPropertiesChange",ia,ye,yo),m(V,5,"functionName",ma,ye),m(V,5,"functionInputs",da,ye),m(V,5,"functionOutputs",pa,ye),m(V,5,"isSystem",ca,ye),m(V,5,"editableByUser",la,ye),ye=m(V,0,"PotatnoPanelProperties",ga,ye),c(V,1,ye)});var ba,fa=p(()=>{ba=`:host {\r
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
`});var va,Ta=p(()=>{va=`<div class="resize-handle" (pointerdown)="this.onResizePointerDown($event)"></div>\r
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
`});var Ca,xa,Pa,Ia,wa,Ea,fe,fo,bo,je,ka=p(()=>{ce();fa();Ta();Ea=[F({selector:"potatno-preview",template:va,style:ba})];je=class extends(wa=w,Ia=[C,ue("PreviewContent")],Pa=[ue("PreviewContainer")],xa=[C],Ca=[C],wa){constructor(){super(...arguments);c(fe,5,this);k(this,fo,c(fe,8,this)),c(fe,11,this);k(this,bo,c(fe,12,this)),c(fe,15,this);y(this,"errors",c(fe,16,this,[])),c(fe,19,this);y(this,"mDragging",!1);y(this,"mStartX",0);y(this,"mStartY",0);y(this,"mStartWidth",0);y(this,"mStartHeight",0)}get hasErrors(){return this.errors.length>0}setContent(t){let n=this.contentElement;for(;n.firstChild;)n.removeChild(n.firstChild);n.appendChild(t)}onResizePointerDown(t){t.preventDefault(),t.stopPropagation(),this.mDragging=!0,this.mStartX=t.clientX,this.mStartY=t.clientY;let n=this.containerElement;if(!n)return;this.mStartWidth=n.offsetWidth,this.mStartHeight=n.offsetHeight,t.target.setPointerCapture(t.pointerId);let r=s=>{if(!this.mDragging)return;let a=this.mStartX-s.clientX,l=this.mStartY-s.clientY,u=Math.max(200,this.mStartWidth+a),h=Math.max(150,this.mStartHeight+l);n.style.width=u+"px",n.style.height=h+"px"},o=s=>{this.mDragging=!1,s.target.releasePointerCapture(s.pointerId),document.removeEventListener("pointermove",r),document.removeEventListener("pointerup",o)};document.addEventListener("pointermove",r),document.addEventListener("pointerup",o)}};fe=E(wa),fo=new WeakMap,bo=new WeakMap,m(fe,4,"contentElement",Ia,je,fo),m(fe,4,"containerElement",Pa,je,bo),m(fe,1,"setContent",Ca,je),m(fe,5,"errors",xa,je),je=m(fe,0,"PotatnoPreview",Ea,je),c(fe,1,je)});var Da,Aa=p(()=>{Da=`:host {\r
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
`});var Sa,Na=p(()=>{Sa=`<div #viewport class="viewport" (pointerdown)="this.onPointerDown($event)" (pointermove)="this.onPointerMove($event)" (pointerup)="this.onPointerUp($event)" (wheel)="this.onWheel($event)" (contextmenu)="this.onContextMenu($event)" (keydown)="this.onKeyDown($event)" tabindex="0">\r
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
`});var La,Ma,Ra,Oa,Ga,Ba,Fa,Va,ja,Ua,$a,za,Ha,O,To,vo,Co,xo,Po,Io,wo,re,Ka=p(()=>{ce();no();oo();Aa();Na();Ha=[F({selector:"potatno-canvas",template:Sa,style:Da})];re=class extends(za=w,$a=[C],Ua=[C],ja=[C],Va=[C],Fa=[S("canvas-connect")],Ba=[S("canvas-delete")],Ga=[S("canvas-node-move")],Oa=[S("canvas-node-select")],Ra=[S("canvas-select")],Ma=[ue("svgLayer")],La=[ue("viewport")],za){constructor(){super();y(this,"connections",c(O,36,this,[])),c(O,39,this);y(this,"gridSize",c(O,40,this,20)),c(O,43,this);y(this,"nodes",c(O,44,this,[])),c(O,47,this);y(this,"selectedNodeIds",c(O,48,this,new Set)),c(O,51,this);k(this,To,c(O,8,this)),c(O,11,this);k(this,vo,c(O,12,this)),c(O,15,this);k(this,Co,c(O,16,this)),c(O,19,this);k(this,xo,c(O,20,this)),c(O,23,this);k(this,Po,c(O,24,this)),c(O,27,this);k(this,Io,c(O,28,this)),c(O,31,this);k(this,wo,c(O,32,this)),c(O,35,this);y(this,"mDragNodeId",null);y(this,"mDragStartWorldX",0);y(this,"mDragStartWorldY",0);y(this,"mInteraction");y(this,"mMode","idle");y(this,"mPointerId",null);y(this,"mRenderer");y(this,"mWireColor","var(--pn-accent-primary)");y(this,"mWirePortKind","");y(this,"mWireSourceNodeId","");y(this,"mWireSourcePortId","");y(this,"mWireStartWorld",{x:0,y:0});this.mInteraction=new jt(this.gridSize),this.mRenderer=new Ut}get gridStyle(){let t=`transform: ${this.mInteraction.getTransformCss()}`,n=this.mInteraction.getGridBackgroundCss();return`${t}; ${n}`}get selectionBoxStyle(){let t=this.mInteraction.selectionStart,n=this.mInteraction.selectionEnd;if(!t||!n)return"display: none";let r=this.mInteraction.worldToScreen(t.x,t.y),o=this.mInteraction.worldToScreen(n.x,n.y),s=Math.min(r.x,o.x),a=Math.min(r.y,o.y),l=Math.abs(o.x-r.x),u=Math.abs(o.y-r.y);return`left: ${s}px; top: ${a}px; width: ${l}px; height: ${u}px`}get showSelectionBox(){return this.mMode==="selectingBox"&&this.mInteraction.selectionStart!==null&&this.mInteraction.selectionEnd!==null}onContextMenu(t){t.preventDefault()}onKeyDown(t){(t.key==="Delete"||t.key==="Backspace")&&this.selectedNodeIds.size>0&&this.mDeleteEvent.dispatchEvent({nodeIds:new Set(this.selectedNodeIds)})}onPointerDown(t){if(this.mMode!=="idle")return;let n=t.target,r=this.mViewport.getBoundingClientRect(),o=t.clientX-r.left,s=t.clientY-r.top;if(t.button===1){this.mMode="panning",this.mPointerId=t.pointerId,this.mViewport.setPointerCapture(t.pointerId),this.mViewport.classList.add("panning"),t.preventDefault();return}if(t.button===0){let a=n.closest("[data-port-id]");if(a){this.beginWireDrag(a,o,s),this.mPointerId=t.pointerId,this.mViewport.setPointerCapture(t.pointerId),t.preventDefault();return}let l=n.closest("[data-node-id]");if(l){this.beginNodeDrag(l,o,s,t.shiftKey||t.ctrlKey||t.metaKey),this.mPointerId=t.pointerId,this.mViewport.setPointerCapture(t.pointerId),t.preventDefault();return}this.beginSelectionBox(o,s),this.mPointerId=t.pointerId,this.mViewport.setPointerCapture(t.pointerId),t.preventDefault()}}onPointerMove(t){if(this.mPointerId!==t.pointerId)return;let n=this.mViewport.getBoundingClientRect(),r=t.clientX-n.left,o=t.clientY-n.top;switch(this.mMode){case"panning":this.mInteraction.pan(t.movementX,t.movementY),this.updateConnections();break;case"draggingNode":this.updateNodeDrag(r,o);break;case"draggingWire":this.updateWireDrag(r,o);break;case"selectingBox":this.updateSelectionBox(r,o);break}}onPointerUp(t){if(this.mPointerId!==t.pointerId)return;let n=t.target;switch(this.mMode){case"panning":this.mViewport.classList.remove("panning");break;case"draggingNode":this.endNodeDrag();break;case"draggingWire":this.endWireDrag(n);break;case"selectingBox":this.endSelectionBox();break}this.mPointerId!==null&&this.mViewport.releasePointerCapture(this.mPointerId),this.mPointerId=null,this.mMode="idle"}onWheel(t){t.preventDefault();let n=this.mViewport.getBoundingClientRect(),r=t.clientX-n.left,o=t.clientY-n.top;this.mInteraction.zoomAt(r,o,t.deltaY),this.updateConnections()}updateConnections(){this.mRenderer.renderConnections(this.mSvgLayer,this.connections)}beginNodeDrag(t,n,r,o){let s=t.dataset.nodeId;if(!s)return;this.mMode="draggingNode",this.mDragNodeId=s;let a=this.mInteraction.screenToWorld(n,r);this.mDragStartWorldX=a.x,this.mDragStartWorldY=a.y,this.mNodeSelectEvent.dispatchEvent({nodeId:s,additive:o})}beginSelectionBox(t,n){this.mMode="selectingBox";let r=this.mInteraction.screenToWorld(t,n);this.mInteraction.setSelectionStart(r.x,r.y),this.mInteraction.setSelectionEnd(r.x,r.y)}beginWireDrag(t,n,r){this.mMode="draggingWire",this.mWireSourceNodeId=t.dataset.nodeId??"",this.mWireSourcePortId=t.dataset.portId??"",this.mWirePortKind=t.dataset.portKind??"",this.mWireColor=t.dataset.portColor??"var(--pn-accent-primary)";let o=this.mInteraction.screenToWorld(n,r);this.mWireStartWorld={x:o.x,y:o.y}}endNodeDrag(){if(!this.mDragNodeId)return;let t=this.nodes.find(n=>n.id===this.mDragNodeId);if(t){let n=this.mInteraction.snapToGrid(t.x,t.y);this.mNodeMoveEvent.dispatchEvent({nodeId:this.mDragNodeId,newX:n.x,newY:n.y})}this.mDragNodeId=null}endSelectionBox(){let t=this.mInteraction.selectionStart,n=this.mInteraction.selectionEnd;if(t&&n){let r=Math.min(t.x,n.x),o=Math.min(t.y,n.y),s=Math.max(t.x,n.x),a=Math.max(t.y,n.y),l=new Set;for(let u of this.nodes){let h=u.x+u.width,d=u.y+u.height;u.x<s&&h>r&&u.y<a&&d>o&&l.add(u.id)}this.mSelectEvent.dispatchEvent({nodeIds:l})}this.mInteraction.clearSelection()}endWireDrag(t){this.mRenderer.clearTempConnection(this.mSvgLayer);let n=t.closest("[data-port-id]");if(n){let r=n.dataset.nodeId??"",o=n.dataset.portId??"";r&&o&&(r!==this.mWireSourceNodeId||o!==this.mWireSourcePortId)&&this.mConnectEvent.dispatchEvent({sourceNodeId:this.mWireSourceNodeId,sourcePortId:this.mWireSourcePortId,targetNodeId:r,targetPortId:o,portKind:this.mWirePortKind})}this.mWireSourceNodeId="",this.mWireSourcePortId="",this.mWirePortKind=""}updateNodeDrag(t,n){if(!this.mDragNodeId)return;let r=this.mInteraction.screenToWorld(t,n),o=r.x-this.mDragStartWorldX,s=r.y-this.mDragStartWorldY;this.mDragStartWorldX=r.x,this.mDragStartWorldY=r.y;let a=this.nodes.find(l=>l.id===this.mDragNodeId);a&&this.mNodeMoveEvent.dispatchEvent({nodeId:this.mDragNodeId,newX:a.x+o,newY:a.y+s}),this.updateConnections()}updateSelectionBox(t,n){let r=this.mInteraction.screenToWorld(t,n);this.mInteraction.setSelectionEnd(r.x,r.y)}updateWireDrag(t,n){let r=this.mInteraction.screenToWorld(t,n);this.mRenderer.renderTempConnection(this.mSvgLayer,this.mWireStartWorld,r,this.mWireColor)}};O=E(za),To=new WeakMap,vo=new WeakMap,Co=new WeakMap,xo=new WeakMap,Po=new WeakMap,Io=new WeakMap,wo=new WeakMap,m(O,4,"mConnectEvent",Fa,re,To),m(O,4,"mDeleteEvent",Ba,re,vo),m(O,4,"mNodeMoveEvent",Ga,re,Co),m(O,4,"mNodeSelectEvent",Oa,re,xo),m(O,4,"mSelectEvent",Ra,re,Po),m(O,4,"mSvgLayer",Ma,re,Io),m(O,4,"mViewport",La,re,wo),m(O,5,"connections",$a,re),m(O,5,"gridSize",Ua,re),m(O,5,"nodes",ja,re),m(O,5,"selectedNodeIds",Va,re),re=m(O,0,"PotatnoCanvas",Ha,re),c(O,1,re)});var Wa,Xa=p(()=>{Wa=`:host {\r
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
    color: var(--pn-bg-primary);\r
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
`});var Ya,Za=p(()=>{Ya=`$if(this.nodeData) {\r
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
`});var qa,_a=p(()=>{qa=`:host {\r
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
`});var Qa,Ja=p(()=>{Qa=`<div [className]="this.portWrapperClasses" [title]="this.type">\r
    <div #portCircle [className]="this.portCircleClasses" style="--port-color: {{this.portColor}}"\r
         (pointerdown)="this.onPointerDown($event)"\r
         (pointerenter)="this.onPointerEnter($event)"\r
         (pointerleave)="this.onPointerLeave($event)">\r
    </div>\r
    <span class="port-label">{{this.name}}</span>\r
</div>\r
`});var el,tl,nl,rl,ol,il,sl,al,ll,cl,ul,pl,dl,ml,M,Eo,ko,Ao,Do,ee,No=p(()=>{ce();_a();Ja();ml=[F({selector:"potatno-port",template:Qa,style:qa})];ee=class extends(dl=w,pl=[C],ul=[C],cl=[C],ll=[C],al=[C],sl=[C],il=[C],ol=[C],rl=[S("port-drag-start")],nl=[S("port-hover")],tl=[S("port-leave")],el=[ue("portCircle")],dl){constructor(){super(...arguments);y(this,"name",c(M,24,this,"")),c(M,27,this);y(this,"type",c(M,28,this,"")),c(M,31,this);y(this,"portId",c(M,32,this,"")),c(M,35,this);y(this,"nodeId",c(M,36,this,"")),c(M,39,this);y(this,"direction",c(M,40,this,"input")),c(M,43,this);y(this,"connected",c(M,44,this,!1)),c(M,47,this);y(this,"invalid",c(M,48,this,!1)),c(M,51,this);y(this,"portKind",c(M,52,this,"data")),c(M,55,this);k(this,Eo,c(M,8,this)),c(M,11,this);k(this,ko,c(M,12,this)),c(M,15,this);k(this,Ao,c(M,16,this)),c(M,19,this);k(this,Do,c(M,20,this)),c(M,23,this)}get portWrapperClasses(){return this.direction==="output"?"port-wrapper direction-output":"port-wrapper direction-input"}get portCircleClasses(){let t=["port-circle"];return this.connected?t.push("connected"):t.push("disconnected"),this.invalid&&t.push("invalid"),t.push(this.direction==="output"?"direction-output":"direction-input"),t.join(" ")}get portColor(){return this.portKind==="flow"?"var(--pn-text-primary)":this.getTypeColor(this.type)}onPointerDown(t){t.stopPropagation(),t.preventDefault(),this.mPortDragStart.dispatchEvent({nodeId:this.nodeId,portId:this.portId,portKind:this.portKind,direction:this.direction,type:this.type,element:this.portCircleElement})}onPointerEnter(t){this.mPortHover.dispatchEvent({nodeId:this.nodeId,portId:this.portId,portKind:this.portKind,direction:this.direction,type:this.type,element:this.portCircleElement})}onPointerLeave(t){this.mPortLeave.dispatchEvent(void 0)}getTypeColor(t){let n=0;for(let s=0;s<t.length;s++)n=t.charCodeAt(s)+((n<<5)-n);return`hsl(${Math.abs(n)%256*137.508%360}, 70%, 60%)`}};M=E(dl),Eo=new WeakMap,ko=new WeakMap,Ao=new WeakMap,Do=new WeakMap,m(M,4,"mPortDragStart",rl,ee,Eo),m(M,4,"mPortHover",nl,ee,ko),m(M,4,"mPortLeave",tl,ee,Ao),m(M,4,"portCircleElement",el,ee,Do),m(M,5,"name",pl,ee),m(M,5,"type",ul,ee),m(M,5,"portId",cl,ee),m(M,5,"nodeId",ll,ee),m(M,5,"direction",al,ee),m(M,5,"connected",sl,ee),m(M,5,"invalid",il,ee),m(M,5,"portKind",ol,ee),ee=m(M,0,"PotatnoPortComponent",ml,ee),c(M,1,ee)});var hl,gl,yl,fl,bl,Tl,vl,Cl,xl,Pl,Il,wl,El,kl,R,So,Lo,Mo,Ro,Oo,Go,Bo,Fo,Vo,te,Al=p(()=>{ce();_e();Xa();Za();No();kl=[F({selector:"potatno-node",template:Ya,style:Wa})];te=class extends(El=w,wl=[C],Il=[C],Pl=[C],xl=[S("node-select")],Cl=[S("node-drag-start")],vl=[S("port-drag-start")],Tl=[S("port-hover")],bl=[S("port-leave")],fl=[S("open-function")],yl=[S("value-change")],gl=[S("comment-change")],hl=[S("resize-start")],El){constructor(){super(...arguments);y(this,"nodeData",c(R,44,this,null)),c(R,47,this);y(this,"selected",c(R,48,this,!1)),c(R,51,this);y(this,"gridSize",c(R,52,this,20)),c(R,55,this);k(this,So,c(R,8,this)),c(R,11,this);k(this,Lo,c(R,12,this)),c(R,15,this);k(this,Mo,c(R,16,this)),c(R,19,this);k(this,Ro,c(R,20,this)),c(R,23,this);k(this,Oo,c(R,24,this)),c(R,27,this);k(this,Go,c(R,28,this)),c(R,31,this);k(this,Bo,c(R,32,this)),c(R,35,this);k(this,Fo,c(R,36,this)),c(R,39,this);k(this,Vo,c(R,40,this)),c(R,43,this)}get nodeStyle(){return this.nodeData?`left: ${this.nodeData.position.x*this.gridSize}px; top: ${this.nodeData.position.y*this.gridSize}px; width: ${this.nodeData.size.w*this.gridSize}px;`:""}get nodeId(){return this.nodeData?.id??""}get selectedClass(){return this.selected?"selected":""}get isComment(){return this.nodeData?.category==="comment"}get commentSizeStyle(){return this.nodeData?`height: ${this.nodeData.size.h*this.gridSize}px;`:""}get isValue(){return this.nodeData?.category==="value"}get isFunction(){return this.nodeData?.category==="function"}get showOpenButton(){return!1}get inputPorts(){return this.nodeData?.inputs??[]}get outputPorts(){return this.nodeData?.outputs??[]}get flowInputPorts(){return this.nodeData?.flowInputs??[]}get flowOutputPorts(){return this.nodeData?.flowOutputs??[]}onNodePointerDown(t){t.target.tagName?.toLowerCase()!=="potatno-port"&&(this.mNodeSelect.dispatchEvent({nodeId:this.nodeId,shiftKey:t.shiftKey}),this.mNodeDragStart.dispatchEvent({nodeId:this.nodeId,startX:t.clientX,startY:t.clientY}))}onPortDragStart(t){this.mPortDragStart.dispatchEvent(t.value)}onPortHover(t){this.mPortHover.dispatchEvent(t.value)}onPortLeave(t){this.mPortLeave.dispatchEvent(void 0)}onOpenFunction(t){t.stopPropagation(),this.mOpenFunction.dispatchEvent({definitionName:this.nodeData?.definitionName??""})}onValueInput(t){let n=t.target;this.mValueChange.dispatchEvent({nodeId:this.nodeId,property:"value",value:n.value})}onCommentInput(t){let n=t.target;this.mCommentChange.dispatchEvent({nodeId:this.nodeId,text:n.value})}onResizeStart(t){t.stopPropagation(),t.preventDefault(),this.mResizeStart.dispatchEvent({nodeId:this.nodeId,startX:t.clientX,startY:t.clientY})}};R=E(El),So=new WeakMap,Lo=new WeakMap,Mo=new WeakMap,Ro=new WeakMap,Oo=new WeakMap,Go=new WeakMap,Bo=new WeakMap,Fo=new WeakMap,Vo=new WeakMap,m(R,4,"mNodeSelect",xl,te,So),m(R,4,"mNodeDragStart",Cl,te,Lo),m(R,4,"mPortDragStart",vl,te,Mo),m(R,4,"mPortHover",Tl,te,Ro),m(R,4,"mPortLeave",bl,te,Oo),m(R,4,"mOpenFunction",fl,te,Go),m(R,4,"mValueChange",yl,te,Bo),m(R,4,"mCommentChange",gl,te,Fo),m(R,4,"mResizeStart",hl,te,Vo),m(R,5,"nodeData",wl,te),m(R,5,"selected",Il,te),m(R,5,"gridSize",Pl,te),te=m(R,0,"PotatnoNodeComponent",kl,te),c(R,1,te)});var Nl,Dl=p(()=>{Nl=`.tabs-header {\r
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
`});var Ll,Sl=p(()=>{Ll=`<div class="tabs-header">\r
    $for(tab of this.tabs; index = $index) {\r
        <button [className]="this.getTabClass(this.index)" (click)="this.onTabClick(this.index)">{{this.tab}}</button>\r
    }\r
</div>\r
<div class="tabs-content">\r
    $slot\r
</div>\r
`});var Ml,Rl,Ol,Gl,Bl,Ie,jo,Qe,Fl=p(()=>{ce();Dl();Sl();Bl=[F({selector:"potatno-tabs",template:Ll,style:Nl})];Qe=class extends(Gl=w,Ol=[C],Rl=[C],Ml=[S("tab-change")],Gl){constructor(){super(...arguments);y(this,"tabs",c(Ie,12,this,[])),c(Ie,15,this);y(this,"activeIndex",c(Ie,16,this,0)),c(Ie,19,this);k(this,jo,c(Ie,8,this)),c(Ie,11,this)}getTabClass(t){return t===this.activeIndex?"tab-button active":"tab-button"}onTabClick(t){this.activeIndex=t,this.mTabChange.dispatchEvent(t)}};Ie=E(Gl),jo=new WeakMap,m(Ie,4,"mTabChange",Ml,Qe,jo),m(Ie,5,"tabs",Ol,Qe),m(Ie,5,"activeIndex",Rl,Qe),Qe=m(Ie,0,"PotatnoTabs",Bl,Qe),c(Ie,1,Qe)});var jl,Vl=p(()=>{jl=`.resize-handle {\r
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
`});var $l,Ul=p(()=>{$l=`<div [className]="this.getHandleClass()" (pointerdown)="this.onPointerDown($event)"></div>\r
`});var zl,Hl,Kl,Xl,Ue,Uo,bt,Wl=p(()=>{ce();Vl();Ul();Xl=[F({selector:"potatno-resize-handle",template:$l,style:jl})];bt=class extends(Kl=w,Hl=[C],zl=[S("resize")],Kl){constructor(){super(...arguments);y(this,"direction",c(Ue,12,this,"vertical")),c(Ue,15,this);k(this,Uo,c(Ue,8,this)),c(Ue,11,this);y(this,"mDragging",!1);y(this,"mStartPosition",0)}getHandleClass(){return`resize-handle ${this.direction}`}onPointerDown(t){t.preventDefault(),this.mDragging=!0,this.mStartPosition=this.direction==="vertical"?t.clientX:t.clientY,t.target.setPointerCapture(t.pointerId);let n=o=>{if(!this.mDragging)return;let s=this.direction==="vertical"?o.clientX:o.clientY,a=s-this.mStartPosition;this.mStartPosition=s,this.mResize.dispatchEvent({delta:a})},r=o=>{this.mDragging=!1,o.target.releasePointerCapture(o.pointerId),document.removeEventListener("pointermove",n),document.removeEventListener("pointerup",r)};document.addEventListener("pointermove",n),document.addEventListener("pointerup",r)}};Ue=E(Kl),Uo=new WeakMap,m(Ue,4,"mResize",zl,bt,Uo),m(Ue,5,"direction",Hl,bt),bt=m(Ue,0,"PotatnoResizeHandle",Xl,bt),c(Ue,1,bt)});var Yl,Zl=p(()=>{Yl=`.search-wrapper {\r
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
`});var ql,_l=p(()=>{ql=`<div class="search-wrapper">\r
    <svg class="search-icon" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">\r
        <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" stroke-width="1.5"/>\r
        <line x1="10.5" y1="10.5" x2="14.5" y2="14.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>\r
    </svg>\r
    <input class="search-field" type="text" [placeholder]="this.placeholder" [value]="this.value" (input)="this.onInput($event)"/>\r
</div>\r
`});var Jl,Ql,ec,tc,nc,we,$o,et,rc=p(()=>{ce();Zl();_l();nc=[F({selector:"potatno-search-input",template:ql,style:Yl})];et=class extends(tc=w,ec=[C],Ql=[C],Jl=[S("search-change")],tc){constructor(){super(...arguments);y(this,"placeholder",c(we,12,this,"Search...")),c(we,15,this);y(this,"value",c(we,16,this,"")),c(we,19,this);k(this,$o,c(we,8,this)),c(we,11,this)}onInput(t){let n=t.target;this.value=n.value,this.mSearchChange.dispatchEvent(this.value)}};we=E(tc),$o=new WeakMap,m(we,4,"mSearchChange",Jl,et,$o),m(we,5,"placeholder",ec,et),m(we,5,"value",Ql,et),et=m(we,0,"PotatnoSearchInput",nc,et),c(we,1,et)});var nr,zo,Ho,oc,ic,sc,ac,lc,cc,uc,pc,dc,mc,hc,gc,yc,fc,bc,j,Ko,Xo,Wo,Zo,W,Tc=p(()=>{ce();ss();ls();Jr();hs();gs();fs();bs();_e();gt();to();to();Ts();vs();no();oo();so();uo();ea();ya();ka();Ka();Al();No();Fl();Wl();rc();nr=new Map,zo=new Map,Ho=new Map;bc=[F({selector:"potatno-code-editor",template:cs,style:as})];W=class extends(fc=w,yc=[ue("svgLayer")],gc=[ue("canvasWrapper")],hc=[ue("panelLeft")],mc=[ue("panelRight")],dc=[C],pc=[C],uc=[C],cc=[C],lc=[C],ac=[C],sc=[C],ic=[C],oc=[C],fc){constructor(){super();c(j,5,this);y(this,"mProjectKey");y(this,"mShowSelectionBox");y(this,"mSelectionBoxScreen");y(this,"mPreviewDebounceTimer");y(this,"mKeyboardHandler");y(this,"mResizeState");y(this,"mResizeMoveHandler");y(this,"mResizeUpHandler");y(this,"mCacheVersion");k(this,Ko,c(j,8,this)),c(j,11,this);k(this,Xo,c(j,12,this)),c(j,15,this);k(this,Wo,c(j,16,this)),c(j,19,this);k(this,Zo,c(j,20,this)),c(j,23,this);this.mProjectKey=crypto.randomUUID(),nr.set(this.mProjectKey,new Vt),zo.set(this.mProjectKey,new Set),Ho.set(this.mProjectKey,{history:new Jn,clipboard:new Qn,interaction:new jt(20),renderer:new Ut,hoveredPort:null,interactionState:{mode:"idle"},cachedData:{activeFunctionId:"",activeFunctionName:"",activeFunctionIsSystem:!1,activeFunctionEditableByUser:!1,errors:[],hasPreview:!1,nodeDefinitionList:[],functionList:[],availableImports:[],availableTypes:[],activeFunctionInputs:[],activeFunctionOutputs:[],activeFunctionImports:[],visibleNodes:[]}}),this.mShowSelectionBox=!1,this.mSelectionBoxScreen={x1:0,y1:0,x2:0,y2:0},this.mPreviewDebounceTimer=0,this.mKeyboardHandler=null,this.mResizeState=null,this.mResizeMoveHandler=null,this.mResizeUpHandler=null,this.mCacheVersion=0}get project(){return this.getProject()}get activeFunctionId(){return this.mCacheVersion,this.getInternals().cachedData.activeFunctionId}get interaction(){return this.getInternals().interaction}get showSelectionBox(){return this.mShowSelectionBox}get hasPreview(){return this.mCacheVersion,this.getInternals().cachedData.hasPreview}get editorErrors(){return this.mCacheVersion,this.getInternals().cachedData.errors}get gridBackgroundStyle(){return this.getInternals().interaction.getGridBackgroundCss()}get gridTransformStyle(){return"transform: "+this.getInternals().interaction.getTransformCss()}get selectionBoxStyle(){if(!this.mShowSelectionBox)return"display: none";let t=Math.min(this.mSelectionBoxScreen.x1,this.mSelectionBoxScreen.x2),n=Math.min(this.mSelectionBoxScreen.y1,this.mSelectionBoxScreen.y2),r=Math.abs(this.mSelectionBoxScreen.x2-this.mSelectionBoxScreen.x1),o=Math.abs(this.mSelectionBoxScreen.y2-this.mSelectionBoxScreen.y1);return`left: ${t}px; top: ${n}px; width: ${r}px; height: ${o}px`}get visibleNodes(){return this.mCacheVersion,this.getInternals().cachedData.visibleNodes}get nodeDefinitionList(){return this.mCacheVersion,this.getInternals().cachedData.nodeDefinitionList}get functionList(){return this.mCacheVersion,this.getInternals().cachedData.functionList}get activeFunctionName(){return this.mCacheVersion,this.getInternals().cachedData.activeFunctionName}get activeFunctionInputs(){return this.mCacheVersion,this.getInternals().cachedData.activeFunctionInputs}get activeFunctionOutputs(){return this.mCacheVersion,this.getInternals().cachedData.activeFunctionOutputs}get activeFunctionImports(){return this.mCacheVersion,this.getInternals().cachedData.activeFunctionImports}get activeFunctionIsSystem(){return this.mCacheVersion,this.getInternals().cachedData.activeFunctionIsSystem}get activeFunctionEditableByUser(){return this.mCacheVersion,this.getInternals().cachedData.activeFunctionEditableByUser}get availableImportsList(){return this.mCacheVersion,this.getInternals().cachedData.availableImports}get availableTypes(){return this.mCacheVersion,this.getInternals().cachedData.availableTypes}getProject(){return nr.get(this.mProjectKey)}getSelectedIds(){return zo.get(this.mProjectKey)}getInternals(){return Ho.get(this.mProjectKey)}defineNode(t){this.getProject().configuration.addNodeDefinition(t),this.rebuildCachedData()}defineMainFunction(t){this.getProject().configuration.addMainFunction(t),this.rebuildCachedData()}defineGlobalValue(t){this.getProject().configuration.addGlobalValue(t),this.rebuildCachedData()}setCommentToken(t){this.getProject().configuration.setCommentToken(t)}setPreviewCallback(t){this.getProject().configuration.setPreviewCallback(t)}setFunctionCodeGenerator(t){this.getProject().configuration.setFunctionCodeGenerator(t)}initialize(){this.getProject().initializeMainFunctions(),this.rebuildCachedData(),this.renderConnections(),this.updatePreview()}loadCode(t){let n=this.getProject(),o=new er(n.configuration).deserialize(t);nr.set(this.mProjectKey,o),this.getInternals().history.clear(),this.getSelectedIds().clear(),this.rebuildCachedData(),this.renderConnections(),this.updatePreview()}generateCode(){let t=this.getProject();return new wn(t.configuration).serialize(t)}onConnect(){this.mKeyboardHandler=t=>this.onKeyDown(t),document.addEventListener("keydown",this.mKeyboardHandler)}onDeconstruct(){this.mKeyboardHandler&&document.removeEventListener("keydown",this.mKeyboardHandler),nr.delete(this.mProjectKey),zo.delete(this.mProjectKey),Ho.delete(this.mProjectKey)}onNodeDragFromLibrary(t){let n=t.value??t.detail?.value??t,r=this.getProject(),o=r.configuration.nodeDefinitions.get(n);if(!o){for(let I of r.functions.values())if(I.name===n&&!I.system){o={name:I.name,category:"function",inputs:[...I.inputs],outputs:[...I.outputs],codeGenerator:()=>""};break}}if(!o)return;let s=r.activeFunction?.graph;if(!s)return;let a=this.getInternals(),l=this.canvasWrapper,u=l&&l.clientWidth||800,h=l&&l.clientHeight||600,d=a.interaction.screenToWorld(u/2,h/2),T=a.interaction.snapToGrid(d.x,d.y),f=new En(s,o,{x:T.x/a.interaction.gridSize,y:T.y/a.interaction.gridSize});a.history.push(f),this.rebuildCachedData(),this.renderConnections(),this.updatePreview()}onFunctionSelect(t){let n=t.value??t.detail?.value??t;this.getProject().setActiveFunction(n),this.getSelectedIds().clear(),this.rebuildCachedData(),this.renderConnections()}onFunctionAdd(){let t=this.getProject(),n=this.getInternals().cachedData.functionList.length,r=t.addFunction(`function_${n}`,`Function ${n}`,!1);t.setActiveFunction(r.id),this.getSelectedIds().clear(),this.rebuildCachedData(),this.renderConnections()}onFunctionDelete(t){let n=t.value??t.detail?.value??t;this.getProject().removeFunction(n),this.getSelectedIds().clear(),this.rebuildCachedData(),this.renderConnections(),this.updatePreview()}onPropertiesChange(t){let n=this.getProject().activeFunction;if(!n)return;let r=t.value??t.detail?.value??t;r.name!==void 0&&(n.setName(r.name),n.setLabel(r.name)),r.inputs!==void 0&&n.setInputs(r.inputs),r.outputs!==void 0&&n.setOutputs(r.outputs),r.imports!==void 0&&n.setImports(r.imports),n.graph.validate(),this.rebuildCachedData(),this.renderConnections(),this.updatePreview()}onCanvasPointerDown(t){let n=this.getInternals();if(t.button===1){t.preventDefault(),n.interactionState={mode:"panning",startX:t.clientX,startY:t.clientY},t.currentTarget.setPointerCapture(t.pointerId);return}if(t.button===0){t.ctrlKey||(this.getSelectedIds().clear(),this.rebuildCachedData());let r=this.canvasWrapper.getBoundingClientRect(),o=t.clientX-r.left,s=t.clientY-r.top;n.interactionState={mode:"selecting",startX:o,startY:s},this.mSelectionBoxScreen={x1:o,y1:s,x2:o,y2:s},this.mShowSelectionBox=!1,t.currentTarget.setPointerCapture(t.pointerId)}}onCanvasPointerMove(t){let n=this.getInternals(),r=n.interactionState;if(r.mode==="panning"){let o=t.clientX-r.startX,s=t.clientY-r.startY;n.interaction.pan(o,s),r.startX=t.clientX,r.startY=t.clientY,this.renderConnections();return}if(r.mode==="dragging-node"){let o=(t.clientX-r.startX)/n.interaction.zoom,s=(t.clientY-r.startY)/n.interaction.zoom;for(let a of r.origins){let l=a.originX+o,u=a.originY+s,h=n.interaction.snapToGrid(l,u),d=this.getProject().activeFunction?.graph.getNode(a.nodeId);d&&(d.moveTo(h.x/n.interaction.gridSize,h.y/n.interaction.gridSize),this.updateNodePosition(a.nodeId))}this.renderConnections();return}if(r.mode==="dragging-wire"){let o=this.canvasWrapper.getBoundingClientRect(),s=(t.clientX-o.left-n.interaction.panX)/n.interaction.zoom,a=(t.clientY-o.top-n.interaction.panY)/n.interaction.zoom;n.renderer.renderTempConnection(this.svgLayer,{x:r.startX,y:r.startY},{x:s,y:a},"#bac2de");return}if(r.mode==="selecting"){let o=this.canvasWrapper.getBoundingClientRect();this.mSelectionBoxScreen.x2=t.clientX-o.left,this.mSelectionBoxScreen.y2=t.clientY-o.top;let s=Math.abs(this.mSelectionBoxScreen.x2-this.mSelectionBoxScreen.x1),a=Math.abs(this.mSelectionBoxScreen.y2-this.mSelectionBoxScreen.y1);(s>5||a>5)&&(this.mShowSelectionBox=!0);return}if(r.mode==="resizing-comment"){let o=(t.clientX-r.startX)/n.interaction.zoom,s=(t.clientY-r.startY)/n.interaction.zoom,a=n.interaction.gridSize,l=r.originalW+Math.round(o/a),u=r.originalH+Math.round(s/a),h=this.getProject().activeFunction?.graph.getNode(r.nodeId);h&&(h.resizeTo(l,u),this.updateNodeSize(r.nodeId));return}}onCanvasPointerUp(t){let n=this.getInternals();if(n.interactionState.mode==="dragging-node"&&(this.rebuildCachedData(),this.renderConnections(),this.updatePreview()),n.interactionState.mode==="dragging-wire"&&(n.renderer.clearTempConnection(this.svgLayer),n.hoveredPort)){let r=n.hoveredPort;if(n.interactionState.direction!==r.direction&&n.interactionState.portKind===r.portKind){let o=this.getProject().activeFunction?.graph;if(o){let s=n.interactionState.portKind==="data"?"data":"flow",a,l,u,h;n.interactionState.direction==="output"?(a=n.interactionState.sourceNodeId,l=n.interactionState.sourcePortId,u=r.nodeId,h=r.portId):(a=r.nodeId,l=r.portId,u=n.interactionState.sourceNodeId,h=n.interactionState.sourcePortId),o.addConnection(a,l,u,h,s),this.rebuildCachedData(),this.renderConnections(),this.updatePreview()}}}n.interactionState.mode==="selecting"&&(this.mShowSelectionBox=!1,this.selectNodesInBox()),n.interactionState.mode==="resizing-comment"&&this.rebuildCachedData(),n.interactionState={mode:"idle"},t.currentTarget.releasePointerCapture(t.pointerId)}onCanvasWheel(t){t.preventDefault();let n=this.canvasWrapper.getBoundingClientRect(),r=t.clientX-n.left,o=t.clientY-n.top;this.getInternals().interaction.zoomAt(r,o,t.deltaY>0?-.1:.1),this.renderConnections()}onContextMenu(t){t.preventDefault()}onNodePointerDown(t,n){let r=t.composedPath();for(let h of r)if(h.tagName?.toLowerCase()==="potatno-port")return;if(t.stopPropagation(),t.button!==0)return;let o=n.id,s=this.getInternals(),a=this.getSelectedIds();t.ctrlKey?a.has(o)?a.delete(o):a.add(o):a.has(o)||(a.clear(),a.add(o)),this.rebuildCachedData();let l=[],u=this.getProject().activeFunction?.graph;for(let h of a){let d=u?.getNode(h);d&&l.push({nodeId:h,originX:d.position.x*s.interaction.gridSize,originY:d.position.y*s.interaction.gridSize})}if(u){let h=u.getNode(o);if(h&&h.category==="comment"){let d=s.interaction.gridSize,T=h.position.x*d,f=h.position.y*d,I=T+h.size.w*d,N=f+h.size.h*d;for(let b of u.nodes.values()){if(b.id===o||a.has(b.id)||b.category==="comment")continue;let D=b.position.x*d,P=b.position.y*d;D>=T&&D<=I&&P>=f&&P<=N&&l.push({nodeId:b.id,originX:D,originY:P})}}}l.length>0&&(s.interactionState={mode:"dragging-node",nodeId:o,startX:t.clientX,startY:t.clientY,origins:l},this.canvasWrapper.setPointerCapture(t.pointerId))}onPortDragStart(t){let n=t.value??t.detail?.value??t,r=this.getProject().activeFunction?.graph;if(!r)return;let o=r.getNode(n.nodeId);if(!o)return;let s=this.getInternals(),a=s.interaction.gridSize,l=o.position.x*a,u=o.position.y*a,h=o.size.w*a,d=28,T=24,f,I;if(n.portKind==="flow")f=n.direction==="output"?l+h:l,I=u+d/2;else{let N=0;if(n.direction==="output"){let b=0;for(let D of o.outputs.values()){if(D.id===n.portId){N=b;break}b++}f=l+h}else{let b=0;for(let D of o.inputs.values()){if(D.id===n.portId){N=b;break}b++}f=l}I=u+d+(N+.5)*T}s.interactionState={mode:"dragging-wire",sourceNodeId:n.nodeId,sourcePortId:n.portId,portKind:n.portKind,direction:n.direction,type:n.type,startX:f,startY:I}}onPortHover(t){let n=t.value??t.detail?.value??t;this.getInternals().hoveredPort={nodeId:n.nodeId,portId:n.portId,portKind:n.portKind,direction:n.direction,type:n.type}}onPortLeave(){this.getInternals().hoveredPort=null}onNodeResizeStart(t,n){let r=t.value??t.detail?.value??t,o=this.getProject().activeFunction?.graph.getNode(r.nodeId);o&&(this.getInternals().interactionState={mode:"resizing-comment",nodeId:r.nodeId,startX:r.startX,startY:r.startY,originalW:o.size.w,originalH:o.size.h},this.canvasWrapper.setPointerCapture(t.pointerId??r.startX))}onCommentChange(t){let n=t.value??t.detail?.value??t,r=this.getProject().activeFunction?.graph.getNode(n.nodeId);if(r){let o=new kn(r,"comment",n.text);this.getInternals().history.push(o),this.rebuildCachedData()}}onValueChange(t){let n=t.value??t.detail?.value??t,r=this.getProject().activeFunction?.graph.getNode(n.nodeId);if(r){let o=new kn(r,n.property,n.value);this.getInternals().history.push(o),this.rebuildCachedData(),this.updatePreview()}}onKeyDown(t){if(t.key==="Delete"){this.deleteSelectedNodes();return}if(t.ctrlKey&&t.key==="z"){t.preventDefault(),this.getInternals().history.undo(),this.rebuildCachedData(),this.renderConnections(),this.updatePreview();return}if(t.ctrlKey&&(t.key==="y"||t.shiftKey&&t.key==="z")){t.preventDefault(),this.getInternals().history.redo(),this.rebuildCachedData(),this.renderConnections(),this.updatePreview();return}if(t.ctrlKey&&t.key==="c"){let n=this.getProject().activeFunction?.graph;n&&this.getInternals().clipboard.copy(n,this.getSelectedIds());return}if(t.ctrlKey&&t.key==="v"){this.pasteFromClipboard();return}}onResizeLeftStart(t){t.preventDefault(),this.startPanelResize("left",t)}onResizeRightStart(t){t.preventDefault(),this.startPanelResize("right",t)}startPanelResize(t,n){let r=t==="left"?this.panelLeft:this.panelRight;this.mResizeState={panel:t,startX:n.clientX,startWidth:r.offsetWidth},this.mResizeMoveHandler=o=>{if(!this.mResizeState)return;let s=t==="left"?o.clientX-this.mResizeState.startX:this.mResizeState.startX-o.clientX,a=Math.max(200,Math.min(500,this.mResizeState.startWidth+s));r.style.width=`${a}px`},this.mResizeUpHandler=()=>{this.mResizeMoveHandler&&document.removeEventListener("pointermove",this.mResizeMoveHandler),this.mResizeUpHandler&&document.removeEventListener("pointerup",this.mResizeUpHandler),this.mResizeState=null},document.addEventListener("pointermove",this.mResizeMoveHandler),document.addEventListener("pointerup",this.mResizeUpHandler)}deleteSelectedNodes(){let t=this.getProject().activeFunction?.graph;if(!t)return;let n=[];for(let r of this.getSelectedIds()){let o=t.getNode(r);o&&!o.system&&n.push(new tr(t,r))}n.length>0&&(this.getInternals().history.push(new An("Delete nodes",n)),this.getSelectedIds().clear(),this.rebuildCachedData(),this.renderConnections(),this.updatePreview())}pasteFromClipboard(){let t=this.getInternals(),n=t.clipboard.getData();if(!n)return;let r=this.getProject(),o=r.activeFunction?.graph;if(!o)return;let s=[],a=[];for(let l of n.nodes){let u=r.configuration.nodeDefinitions.get(l.definitionName);if(u){let h=new En(o,u,{x:l.position.x+2,y:l.position.y+2});s.push(h),a.push(h)}}if(s.length>0){t.history.push(new An("Paste nodes",s));for(let l=0;l<a.length;l++){let u=a[l].node,h=n.nodes[l];if(u&&h.properties)for(let[d,T]of Object.entries(h.properties))u.properties.set(d,T)}for(let l of n.internalConnections){let u=a[l.sourceNodeIndex]?.node??null,h=a[l.targetNodeIndex]?.node??null;if(u&&h){let d="",T="",f=l.kind==="flow"?"flow":"data";if(f==="data"){for(let[I,N]of u.outputs)if(I===l.sourcePortName){d=N.id;break}for(let[I,N]of h.inputs)if(I===l.targetPortName){T=N.id;break}}else{for(let[I,N]of u.flowOutputs)if(I===l.sourcePortName){d=N.id;break}for(let[I,N]of h.flowInputs)if(I===l.targetPortName){T=N.id;break}}d&&T&&o.addConnection(u.id,d,h.id,T,f)}}this.getSelectedIds().clear();for(let l of a)l.node&&this.getSelectedIds().add(l.node.id);this.rebuildCachedData(),this.renderConnections(),this.updatePreview()}}selectNodesInBox(){let t=this.getProject().activeFunction?.graph;if(!t)return;let n=this.getInternals(),r=n.interaction.screenToWorld(Math.min(this.mSelectionBoxScreen.x1,this.mSelectionBoxScreen.x2),Math.min(this.mSelectionBoxScreen.y1,this.mSelectionBoxScreen.y2)),o=n.interaction.screenToWorld(Math.max(this.mSelectionBoxScreen.x1,this.mSelectionBoxScreen.x2),Math.max(this.mSelectionBoxScreen.y1,this.mSelectionBoxScreen.y2)),s=n.interaction.gridSize;for(let a of t.nodes.values()){let l=a.position.x*s,u=a.position.y*s,h=l+a.size.w*s,d=u+a.size.h*s;l<o.x&&h>r.x&&u<o.y&&d>r.y&&this.getSelectedIds().add(a.id)}this.rebuildCachedData()}renderConnections(){if(!this.svgLayer)return;let t=this.getProject().activeFunction?.graph;if(!t){this.getInternals().renderer.clearAll(this.svgLayer);return}let n=this.getInternals(),r=n.interaction.gridSize,o=28,s=24,a=[];for(let l of t.connections.values()){let u=t.getNode(l.sourceNodeId),h=t.getNode(l.targetNodeId);if(!u||!h)continue;let d=u.position.x*r,T=u.position.y*r,f=h.position.x*r,I=h.position.y*r,N=u.size.w*r,b,D,P,Ee;if(l.kind==="data"){let Z=0,v=0;for(let rr of u.outputs.values()){if(rr.id===l.sourcePortId){Z=v;break}v++}let Dn=0;v=0;for(let rr of h.inputs.values()){if(rr.id===l.targetPortId){Dn=v;break}v++}b=d+N,D=T+o+(Z+.5)*s,P=f,Ee=I+o+(Dn+.5)*s}else b=d+N,D=T+o/2,P=f,Ee=I+o/2;a.push({id:l.id,sourceX:b,sourceY:D,targetX:P,targetY:Ee,color:l.valid?"var(--pn-text-secondary)":"var(--pn-accent-danger)",valid:l.valid})}n.renderer.renderConnections(this.svgLayer,a)}updatePreview(){let t=this.getProject(),n=t.configuration.previewCallback;if(!n||this.getInternals().cachedData.errors.length>0)return;let o;try{let l=new wn(t.configuration).serialize(t);o=this.stripMetadataComments(l,t.configuration.commentToken)}catch{return}let s=this.previewEl;clearTimeout(this.mPreviewDebounceTimer),this.mPreviewDebounceTimer=setTimeout(()=>{try{let a=n(o);s&&typeof s.setContent=="function"&&s.setContent(a)}catch{}},300)}stripMetadataComments(t,n){return t.split(`
`).filter(s=>{let a=s.trim();return!a.startsWith(`${n} __POTATNO_START:`)&&!a.startsWith(`${n} __POTATNO_END:`)}).join(`
`)}updateNodePosition(t){let r=this.getProject().activeFunction?.graph.getNode(t);if(!r)return;let o=this.getInternals().interaction.gridSize;for(let s of this.getInternals().cachedData.visibleNodes)if(s.id===t){s.position={x:r.position.x,y:r.position.y},s.pixelX=r.position.x*o,s.pixelY=r.position.y*o;break}}updateNodeSize(t){let r=this.getProject().activeFunction?.graph.getNode(t);if(r){for(let o of this.getInternals().cachedData.visibleNodes)if(o.id===t){o.size={w:r.size.w,h:r.size.h};break}}}validateProject(){let t=[],n=this.getProject(),r=/^[a-zA-Z][a-zA-Z0-9_]*$/,o=new Set;for(let a of n.functions.values()){o.has(a.name)&&t.push({message:`Duplicate function name "${a.name}".`,location:`Function "${a.name}"`}),o.add(a.name),r.test(a.name)||t.push({message:`Invalid function name "${a.name}". Must start with a letter and contain only letters, digits, and underscores.`,location:`Function "${a.name}"`});let l=new Set;for(let u of a.inputs)r.test(u.name)||t.push({message:`Invalid input name "${u.name}".`,location:`Function "${a.name}" > Inputs`}),l.has(u.name)&&t.push({message:`Duplicate input/output name "${u.name}".`,location:`Function "${a.name}" > Inputs`}),l.add(u.name);for(let u of a.outputs)r.test(u.name)||t.push({message:`Invalid output name "${u.name}".`,location:`Function "${a.name}" > Outputs`}),l.has(u.name)&&t.push({message:`Duplicate input/output name "${u.name}".`,location:`Function "${a.name}" > Outputs`}),l.add(u.name)}let s=n.activeFunction;if(!s)return t.push({message:"No active function selected.",location:"Editor"}),t;for(let a of s.graph.nodes.values())for(let l of a.inputs.values())!l.connectedTo&&!a.system&&t.push({message:`Input "${l.name}" on node "${a.definitionName}" is not connected.`,location:`Function "${s.name}" > Node "${a.definitionName}"`});for(let a of s.graph.connections.values())a.valid||t.push({message:"Type mismatch on connection.",location:`Function "${s.name}"`});return t}rebuildCachedData(){let t=this.getProject(),n=this.getInternals().cachedData;n.activeFunctionId=t.activeFunctionId,n.hasPreview=t.configuration.previewCallback!==null,n.errors=this.validateProject();let r=[];for(let l of t.configuration.nodeDefinitions.values())r.push({name:l.name,category:l.category});for(let l of t.functions.values())l.system||r.push({name:l.name,category:"function"});n.nodeDefinitionList=r;let o=[];for(let l of t.functions.values())o.push({id:l.id,name:l.name,label:l.label,system:l.system});n.functionList=o,n.availableImports=t.configuration.globalValues.map(l=>l.name);let s=new Set;for(let l of t.configuration.nodeDefinitions.values()){for(let u of l.inputs)s.add(u.type);for(let u of l.outputs)s.add(u.type)}n.availableTypes=[...s].sort();let a=t.activeFunction;if(n.activeFunctionName=a?.name??"",n.activeFunctionIsSystem=a?.system??!1,n.activeFunctionEditableByUser=a?.editableByUser??!1,n.activeFunctionInputs=[...a?.inputs??[]],n.activeFunctionOutputs=[...a?.outputs??[]],n.activeFunctionImports=[...a?.imports??[]],a){let l=new Set,u=new Set;for(let d of a.graph.connections.values())l.add(d.sourcePortId),u.add(d.sourcePortId),u.add(d.targetPortId);let h=[];for(let d of a.graph.nodes.values()){let T=t.configuration.nodeDefinitions.get(d.definitionName),f=bn[d.category]??{icon:"?",cssColor:"var(--pn-text-muted)",label:"Unknown"},I=[];for(let P of d.inputs.values())I.push({id:P.id,name:P.name,type:P.type,direction:P.direction,connectedTo:P.connectedTo});let N=[];for(let P of d.outputs.values()){let Ee=l.has(P.id);N.push({id:P.id,name:P.name,type:P.type,direction:P.direction,connectedTo:Ee?"connected":null})}let b=[];for(let P of d.flowInputs.values())b.push({id:P.id,name:P.name,direction:P.direction,connectedTo:u.has(P.id)?"connected":null});let D=[];for(let P of d.flowOutputs.values())D.push({id:P.id,name:P.name,direction:P.direction,connectedTo:u.has(P.id)?"connected":null});h.push({id:d.id,definitionName:d.definitionName,category:d.category,categoryColor:f.cssColor,categoryIcon:f.icon,label:d.definitionName,position:{x:d.position.x,y:d.position.y},size:{w:d.size.w,h:d.size.h},system:d.system,selected:this.getSelectedIds().has(d.id),inputs:I,outputs:N,flowInputs:b,flowOutputs:D,valueText:d.properties.get("value")??"",commentText:d.properties.get("comment")??"",hasDefinition:!!T,pixelX:d.position.x*this.getInternals().interaction.gridSize,pixelY:d.position.y*this.getInternals().interaction.gridSize})}n.visibleNodes=h}else n.visibleNodes=[];this.mCacheVersion++}};j=E(fc),Ko=new WeakMap,Xo=new WeakMap,Wo=new WeakMap,Zo=new WeakMap,m(j,4,"svgLayer",yc,W,Ko),m(j,4,"canvasWrapper",gc,W,Xo),m(j,4,"panelLeft",hc,W,Wo),m(j,4,"panelRight",mc,W,Zo),m(j,1,"defineNode",dc,W),m(j,1,"defineMainFunction",pc,W),m(j,1,"defineGlobalValue",uc,W),m(j,1,"setCommentToken",cc,W),m(j,1,"setPreviewCallback",lc,W),m(j,1,"setFunctionCodeGenerator",ac,W),m(j,1,"initialize",sc,W),m(j,1,"loadCode",ic,W),m(j,1,"generateCode",oc,W),W=m(j,0,"PotatnoCodeEditor",bc,W),c(j,1,W)});var vc=p(()=>{Tc();_e();Yr();gt();eo();Qr()});var xc,Cc=p(()=>{xc=`:host {\r
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
`});var vu={};var G,Tu,Pc=p(()=>{ce();vc();Cc();tt.new("potatno-code",i=>{i.addStyle(xc),i.addStyle(":host { display: block; width: 100%; height: 100%; } potatno-code-editor { display: block; width: 100%; height: 100%; }"),i.addContent(W)},document.body);Tu=document.body.lastElementChild;G=Tu?.shadowRoot?.querySelector("potatno-code-editor");G.setCommentToken("//");G.defineGlobalValue({name:"Math_PI",type:"number",label:"Math.PI"});G.defineGlobalValue({name:"Math_E",type:"number",label:"Math.E"});G.defineNode({name:"Number Literal",category:"value",inputs:[],outputs:[{name:"value",type:"number"}],codeGenerator:i=>{let e=i.properties.get("value")??"0";return`const ${i.outputs.get("value").valueId} = ${e};`}});G.defineNode({name:"String Literal",category:"value",inputs:[],outputs:[{name:"value",type:"string"}],codeGenerator:i=>{let e=i.properties.get("value")??"";return`const ${i.outputs.get("value").valueId} = "${e}";`}});G.defineNode({name:"Boolean Literal",category:"value",inputs:[],outputs:[{name:"value",type:"boolean"}],codeGenerator:i=>{let e=i.properties.get("value")??"false";return`const ${i.outputs.get("value").valueId} = ${e};`}});G.defineNode({name:"Add",category:"operator",inputs:[{name:"a",type:"number"},{name:"b",type:"number"}],outputs:[{name:"result",type:"number"}],codeGenerator:i=>`const ${i.outputs.get("result").valueId} = ${i.inputs.get("a").valueId} + ${i.inputs.get("b").valueId};`});G.defineNode({name:"Subtract",category:"operator",inputs:[{name:"a",type:"number"},{name:"b",type:"number"}],outputs:[{name:"result",type:"number"}],codeGenerator:i=>`const ${i.outputs.get("result").valueId} = ${i.inputs.get("a").valueId} - ${i.inputs.get("b").valueId};`});G.defineNode({name:"Multiply",category:"operator",inputs:[{name:"a",type:"number"},{name:"b",type:"number"}],outputs:[{name:"result",type:"number"}],codeGenerator:i=>`const ${i.outputs.get("result").valueId} = ${i.inputs.get("a").valueId} * ${i.inputs.get("b").valueId};`});G.defineNode({name:"Divide",category:"operator",inputs:[{name:"a",type:"number"},{name:"b",type:"number"}],outputs:[{name:"result",type:"number"}],codeGenerator:i=>`const ${i.outputs.get("result").valueId} = ${i.inputs.get("a").valueId} / ${i.inputs.get("b").valueId};`});G.defineNode({name:"Modulo",category:"operator",inputs:[{name:"a",type:"number"},{name:"b",type:"number"}],outputs:[{name:"result",type:"number"}],codeGenerator:i=>`const ${i.outputs.get("result").valueId} = ${i.inputs.get("a").valueId} % ${i.inputs.get("b").valueId};`});G.defineNode({name:"Equal",category:"operator",inputs:[{name:"a",type:"number"},{name:"b",type:"number"}],outputs:[{name:"result",type:"boolean"}],codeGenerator:i=>`const ${i.outputs.get("result").valueId} = ${i.inputs.get("a").valueId} === ${i.inputs.get("b").valueId};`});G.defineNode({name:"Not Equal",category:"operator",inputs:[{name:"a",type:"number"},{name:"b",type:"number"}],outputs:[{name:"result",type:"boolean"}],codeGenerator:i=>`const ${i.outputs.get("result").valueId} = ${i.inputs.get("a").valueId} !== ${i.inputs.get("b").valueId};`});G.defineNode({name:"Less Than",category:"operator",inputs:[{name:"a",type:"number"},{name:"b",type:"number"}],outputs:[{name:"result",type:"boolean"}],codeGenerator:i=>`const ${i.outputs.get("result").valueId} = ${i.inputs.get("a").valueId} < ${i.inputs.get("b").valueId};`});G.defineNode({name:"Greater Than",category:"operator",inputs:[{name:"a",type:"number"},{name:"b",type:"number"}],outputs:[{name:"result",type:"boolean"}],codeGenerator:i=>`const ${i.outputs.get("result").valueId} = ${i.inputs.get("a").valueId} > ${i.inputs.get("b").valueId};`});G.defineNode({name:"And",category:"operator",inputs:[{name:"a",type:"boolean"},{name:"b",type:"boolean"}],outputs:[{name:"result",type:"boolean"}],codeGenerator:i=>`const ${i.outputs.get("result").valueId} = ${i.inputs.get("a").valueId} && ${i.inputs.get("b").valueId};`});G.defineNode({name:"Or",category:"operator",inputs:[{name:"a",type:"boolean"},{name:"b",type:"boolean"}],outputs:[{name:"result",type:"boolean"}],codeGenerator:i=>`const ${i.outputs.get("result").valueId} = ${i.inputs.get("a").valueId} || ${i.inputs.get("b").valueId};`});G.defineNode({name:"Not",category:"operator",inputs:[{name:"a",type:"boolean"}],outputs:[{name:"result",type:"boolean"}],codeGenerator:i=>`const ${i.outputs.get("result").valueId} = !${i.inputs.get("a").valueId};`});G.defineNode({name:"Number to String",category:"type-conversion",inputs:[{name:"input",type:"number"}],outputs:[{name:"output",type:"string"}],codeGenerator:i=>`const ${i.outputs.get("output").valueId} = String(${i.inputs.get("input").valueId});`});G.defineNode({name:"String to Number",category:"type-conversion",inputs:[{name:"input",type:"string"}],outputs:[{name:"output",type:"number"}],codeGenerator:i=>`const ${i.outputs.get("output").valueId} = Number(${i.inputs.get("input").valueId});`});G.defineNode({name:"Boolean to String",category:"type-conversion",inputs:[{name:"input",type:"boolean"}],outputs:[{name:"output",type:"string"}],codeGenerator:i=>`const ${i.outputs.get("output").valueId} = String(${i.inputs.get("input").valueId});`});G.defineNode({name:"If",category:"flow",inputs:[{name:"condition",type:"boolean"}],outputs:[],flowInputs:["exec"],flowOutputs:["then","else"],codeGenerator:i=>{let e=i.body.get("then")?.code??"",t=i.body.get("else")?.code??"";return`if (${i.inputs.get("condition").valueId}) {
${e}
} else {
${t}
}`}});G.defineNode({name:"While",category:"flow",inputs:[{name:"condition",type:"boolean"}],outputs:[],flowInputs:["exec"],flowOutputs:["body"],codeGenerator:i=>{let e=i.body.get("body")?.code??"";return`while (${i.inputs.get("condition").valueId}) {
${e}
}`}});G.defineNode({name:"For Loop",category:"flow",inputs:[{name:"count",type:"number"}],outputs:[{name:"index",type:"number"}],flowInputs:["exec"],flowOutputs:["body"],codeGenerator:i=>{let e=i.outputs.get("index").valueId,t=i.body.get("body")?.code??"";return`for (let ${e} = 0; ${e} < ${i.inputs.get("count").valueId}; ${e}++) {
${t}
}`}});G.defineNode({name:"Console Log",category:"function",inputs:[{name:"message",type:"string"}],outputs:[],codeGenerator:i=>`console.log(${i.inputs.get("message").valueId});`});G.defineNode({name:"String Concat",category:"function",inputs:[{name:"a",type:"string"},{name:"b",type:"string"}],outputs:[{name:"result",type:"string"}],codeGenerator:i=>`const ${i.outputs.get("result").valueId} = ${i.inputs.get("a").valueId} + ${i.inputs.get("b").valueId};`});G.defineNode({name:"Math.abs",category:"function",inputs:[{name:"value",type:"number"}],outputs:[{name:"result",type:"number"}],codeGenerator:i=>`const ${i.outputs.get("result").valueId} = Math.abs(${i.inputs.get("value").valueId});`});G.defineNode({name:"Math.floor",category:"function",inputs:[{name:"value",type:"number"}],outputs:[{name:"result",type:"number"}],codeGenerator:i=>`const ${i.outputs.get("result").valueId} = Math.floor(${i.inputs.get("value").valueId});`});G.defineNode({name:"Math.random",category:"function",inputs:[],outputs:[{name:"result",type:"number"}],codeGenerator:i=>`const ${i.outputs.get("result").valueId} = Math.random();`});G.defineNode({name:"Comment",category:"comment",inputs:[],outputs:[],codeGenerator:i=>""});G.setFunctionCodeGenerator(i=>{let e=i.inputs.map(n=>n.valueId).join(", "),t=i.outputs.length>0?`
    return ${i.outputs[0].valueId};`:"";return`function ${i.name}(${e}) {
${i.bodyCode}${t}
}`});G.defineMainFunction({name:"main",label:"Main",editableByUser:!0,inputs:[],outputs:[]});G.setPreviewCallback(i=>{let e=document.createDocumentFragment(),t=document.createElement("pre");t.style.cssText='color: #cdd6f4; margin: 0; padding: 8px; font-family: "Cascadia Code", "Fira Code", monospace; font-size: 13px; white-space: pre-wrap; word-break: break-all;';try{let n=`
            const __logs = [];
            const console = { log: function() { __logs.push(Array.prototype.slice.call(arguments).map(String).join(' ')); } };
            ${i}
            if (typeof main === 'function') { main(); }
            return __logs;
        `,o=new Function(n)();o.length>0?t.textContent=o.join(`
`):(t.textContent="(no output)",t.style.color="#6c7086")}catch(n){t.textContent=`Error: ${n.message??n}`,t.style.color="#f38ba8"}return e.appendChild(t),e});G.initialize()});(()=>{let i=new WebSocket("ws://127.0.0.1:8088");i.addEventListener("open",()=>{console.log("Refresh connection established")}),i.addEventListener("message",e=>{console.log("Bundle finished. Start refresh"),e.data==="REFRESH"&&window.location.reload()})})();Promise.resolve().then(()=>Pc());
//# sourceMappingURL=page.js.map
