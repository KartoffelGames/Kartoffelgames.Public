var jc=Object.create;var gr=Object.defineProperty;var Uc=Object.getOwnPropertyDescriptor;var li=(s,e)=>(e=Symbol[s])?e:Symbol.for("Symbol."+s),Et=s=>{throw TypeError(s)};var ci=(s,e,t)=>e in s?gr(s,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):s[e]=t;var ii=(s,e)=>gr(s,"name",{value:e,configurable:!0});var p=(s,e)=>()=>(s&&(e=s(s=0)),e);var E=s=>[,,,jc(s?.[li("metadata")]??null)],ui=["class","method","getter","setter","accessor","field","value","get","set"],Zt=s=>s!==void 0&&typeof s!="function"?Et("Function expected"):s,$c=(s,e,t,n,r)=>({kind:ui[s],name:e,metadata:n,addInitializer:o=>t._?Et("Already initialized"):r.push(Zt(o||null))}),zc=(s,e)=>ci(e,li("metadata"),s[3]),u=(s,e,t,n)=>{for(var r=0,o=s[e>>1],i=o&&o.length;r<i;r++)e&1?o[r].call(t):n=o[r].call(t,n);return n},m=(s,e,t,n,r,o)=>{var i,a,l,c,h,d=e&7,y=!!(e&8),b=!!(e&16),N=d>3?s.length+1:d?y?1:2:0,I=ui[d+5],T=d>3&&(s[N-1]=[]),w=s[N]||(s[N]=[]),D=d&&(!b&&!y&&(r=r.prototype),d<5&&(d>3||!b)&&Uc(d<4?r:{get[t](){return si(this,o)},set[t](X){return ai(this,o,X)}},t));d?b&&d<4&&ii(o,(d>2?"set ":d>1?"get ":"")+t):ii(r,t);for(var F=n.length-1;F>=0;F--)c=$c(d,t,l={},s[3],w),d&&(c.static=y,c.private=b,h=c.access={has:b?X=>Hc(r,X):X=>t in X},d^3&&(h.get=b?X=>(d^1?si:Kc)(X,r,d^4?o:D.get):X=>X[t]),d>2&&(h.set=b?(X,v)=>ai(X,r,v,d^4?o:D.set):(X,v)=>X[t]=v)),a=(0,n[F])(d?d<4?b?o:D[I]:d>4?void 0:{get:D.get,set:D.set}:r,c),l._=1,d^4||a===void 0?Zt(a)&&(d>4?T.unshift(a):d?b?o=a:D[I]=a:r=a):typeof a!="object"||a===null?Et("Object expected"):(Zt(i=a.get)&&(D.get=i),Zt(i=a.set)&&(D.set=i),Zt(i=a.init)&&T.unshift(i));return d||zc(s,r),D&&gr(r,t,D),b?d^4?o:D:r},g=(s,e,t)=>ci(s,typeof e!="symbol"?e+"":e,t),br=(s,e,t)=>e.has(s)||Et("Cannot "+t),Hc=(s,e)=>Object(e)!==e?Et('Cannot use the "in" operator on this value'):s.has(e),si=(s,e,t)=>(br(s,e,"read from private field"),t?t.call(s):e.get(s)),k=(s,e,t)=>e.has(s)?Et("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(s):e.set(s,t),ai=(s,e,t,n)=>(br(s,e,"write to private field"),n?n.call(s,t):e.set(s,t),t),Kc=(s,e,t)=>(br(s,e,"access private method"),t);var Ne,Tr=p(()=>{Ne=class{mData;mInteractionTrigger;mInteractionType;mOrigin;mStackError;get data(){return this.mData}get origin(){return this.mOrigin}get stacktrace(){return this.mStackError}get trigger(){return this.mInteractionTrigger}get type(){return this.mInteractionType}constructor(e,t,n,r){this.mInteractionType=e,this.mInteractionTrigger=t,this.mData=r,this.mStackError=new Error,this.mOrigin=n}toString(){return`${this.origin.name} -> ${this.type[this.trigger]} - ${this.data.toString()}`}}});var _,vr=p(()=>{_=class s extends Array{static newListWith(...e){let t=new s;return t.push(...e),t}clear(){this.splice(0,this.length)}clone(){return s.newListWith(...this)}distinct(){return s.newListWith(...new Set(this))}equals(e){if(this===e)return!0;if(!e||this.length!==e.length)return!1;for(let t=0;t<this.length;++t)if(this[t]!==e[t])return!1;return!0}remove(e){let t=this.indexOf(e);if(t!==-1)return this.splice(t,1)[0]}replace(e,t){let n=this.indexOf(e);if(n!==-1){let r=this[n];return this[n]=t,r}}toString(){return`[${super.join(", ")}]`}}});var f,kt=p(()=>{f=class extends Error{mTarget;get target(){return this.mTarget}constructor(e,t,n){super(e,n),this.mTarget=t}}});var A,pi=p(()=>{vr();kt();A=class s extends Map{add(e,t){if(!this.has(e))this.set(e,t);else throw new f("Can't add duplicate key to dictionary.",this)}clone(){return new s(this)}getAllKeysOfValue(e){return[...this.entries()].filter(r=>r[1]===e).map(r=>r[0])}getOrDefault(e,t){let n=this.get(e);return typeof n<"u"?n:t}map(e){let t=new _;for(let n of this){let r=e(n[0],n[1]);t.push(r)}return t}}});var Pe,di=p(()=>{Pe=class s{mSize;mTopItem;get size(){return this.mSize}get top(){if(this.mTopItem)return this.mTopItem.value}constructor(){this.mTopItem=null,this.mSize=0}clone(){let e=new s;return e.mTopItem=this.mTopItem,e.mSize=this.mSize,e}*entries(){let e=this.mTopItem;for(;e!==null;)yield e.value,e=e.previous}flush(){let e=new Array;for(;this.mTopItem;)e.push(this.pop());return e}pop(){if(!this.mTopItem)return;let e=this.mTopItem.value;return this.mTopItem=this.mTopItem.previous,this.mSize--,e}push(e){let t={previous:this.mTopItem,value:e};this.mTopItem=t,this.mSize++}toArray(){return[...this.entries()]}}});var mi=p(()=>{});var hi=p(()=>{kt()});var yi=p(()=>{});var fi=p(()=>{});var Yt,gi=p(()=>{Yt=class{mCompareFunction;constructor(e){this.mCompareFunction=e}differencesOf(e,t){let n={1:{x:0,history:[]}},r=c=>c-1,o=e.length,i=t.length,a,l;for(let c=0;c<o+i+1;c++)for(let h=-c;h<c+1;h+=2){let d=h===-c||h!==c&&n[h-1].x<n[h+1].x;if(d){let b=n[h+1];l=b.x,a=b.history}else{let b=n[h-1];l=b.x+1,a=b.history}a=a.slice();let y=l-h;for(1<=y&&y<=i&&d?a.push({changeState:2,item:t[r(y)]}):1<=l&&l<=o&&a.push({changeState:1,item:e[r(l)]});l<o&&y<i&&this.mCompareFunction(e[r(l+1)],t[r(y+1)]);)l+=1,y+=1,a.push({changeState:3,item:e[r(l)]});if(l>=o&&y>=i)return a;n[h]={x:l,history:a}}return new Array}}});var bi=p(()=>{});var Cr=p(()=>{});var Ti=p(()=>{});var Ln=p(()=>{kt()});var xr=p(()=>{kt();Ln()});var Ci=p(()=>{Cr();xr();Ln()});var L=p(()=>{pi();vr();di();kt();mi();hi();yi();fi();gi();bi();Cr();Ti();xr();Ci();Ln()});var Ke,Pr=p(()=>{Ke=class s{static mAsyncronErrorZones=new WeakMap;static mSynchronErrorZones=new WeakMap;static allocateAsyncronError(e,t){s.mAsyncronErrorZones.set(e,t)}static allocateSyncronError(e,t){let n=typeof e=="object"&&e!==null?e:new Error(e);return s.mSynchronErrorZones.set(n,t),n}static getAsyncronErrorZone(e){return s.mAsyncronErrorZones.get(e)}static getSyncronErrorZone(e){return s.mSynchronErrorZones.get(e)}}});var Mn,xi=p(()=>{L();Pr();Ir();Mn=class s{static enable(e){if(e.target.globalPatched)return!1;e.target.globalPatched=!0;let t=e.target,n=new s;{let r=e.patches.requirements.promise;t[r]=n.patchPromise(t[r]);let o=e.patches.requirements.eventTarget;t[o]=n.patchEventTarget(t[o])}n.patchOnEvents(t);for(let r of e.patches.functions??[])t[r]=n.patchFunctionCallbacks(t[r]);if(!e.patches.classes)return!0;for(let r of e.patches.classes.callback??[]){let o=t[r];o=n.patchClass(o),t[r]=o}for(let r of e.patches.classes.eventTargets??[]){let o=t[r];n.patchOnEvents(o.prototype)}return!0}callInZone(e,t){return function(...n){return t.execute(()=>e(...n))}}patchClass(e){if(typeof e!="function")return e;let t=this,n=class extends e{constructor(...r){let o=$.current;for(let i=0;i<r.length;i++){let a=r[i];typeof a=="function"&&(r[i]=t.callInZone(t.patchFunctionCallbacks(a),o))}super(...r)}};return this.patchMethods(n),n}patchEventTarget(e){let t=e.prototype,n=this,r=new WeakMap,o=t.addEventListener,i=t.removeEventListener;return Object.defineProperty(t,"addEventListener",{configurable:!1,writable:!1,value:function(a,l,c){if(l===null||typeof l!="function"&&!(typeof l=="object"&&"handleEvent"in l)){o.call(this,a,l,c);return}let h=r.get(l);if(!h){let d=$.current;typeof l=="function"?h=n.callInZone(l,d):h=n.callInZone(l.handleEvent.bind(l),d)}r.set(l,h),o.call(this,a,h,c)}}),Object.defineProperty(t,"removeEventListener",{configurable:!1,writable:!1,value:function(a,l,c){if(l===null||typeof l!="function"&&!(typeof l=="object"&&"handleEvent"in l)){i.call(this,a,l,c);return}let h=r.get(l)??l;i.call(this,a,h,c)}}),e}patchFunctionCallbacks(e){let t=this;return function(...n){let r=$.current;for(let o=0;o<n.length;o++){let i=n[o];typeof i=="function"&&(n[o]=t.callInZone(t.patchFunctionCallbacks(i),r))}return r.execute(()=>e.call(this,...n))}}patchMethods(e){if(typeof e!="function")return e;let t=o=>{if(o===null||o.constructor===Object)return new A;let i=new A;for(let a of Object.getOwnPropertyNames(o)){if(a==="constructor")continue;let l=Object.getOwnPropertyDescriptor(o,a);l&&typeof l.value=="function"&&i.set(a,l)}for(let[a,l]of t(Object.getPrototypeOf(o)))i.has(a)||i.set(a,l);return i},n=e.prototype,r=t(n);for(let[o,i]of r)i.configurable&&(i.value=this.patchFunctionCallbacks(i.value),Object.defineProperty(n,o,i))}patchOnEvents(e){if(!e||!(e instanceof EventTarget))return;let t=r=>{if(r===null)return new A;let o=new A;for(let i of Object.getOwnPropertyNames(r)){if(!i.startsWith("on"))continue;let a=Object.getOwnPropertyDescriptor(r,i);a&&typeof a.value!="function"&&o.set(i.substring(2),a)}for(let[i,a]of t(Object.getPrototypeOf(r)))o.has(i)||o.set(i,a);return o},n=t(e);for(let[r,o]of n){if(!o.configurable)continue;let i=`on${r}`;delete o.writable,delete o.value;let a=new WeakMap;o.set=function(l){let c=a.get(this);(typeof c=="function"||typeof c=="object")&&this.removeEventListener(r,c),a.set(this,l),(typeof l=="function"||typeof l=="object")&&this.addEventListener(r,l)},o.get=function(){return a.get(this)},Object.defineProperty(e,i,o)}}patchPromise(e){let t=e;class n extends t{constructor(o){super(o),Ke.allocateAsyncronError(this,$.current)}}return this.patchMethods(n),n}}});var $,Ir=p(()=>{L();Pr();Tr();xi();$=class s{static mCurrentZone=new s("Default",null,!0);static get current(){return s.mCurrentZone}static enableGlobalTracing(e){if(!Mn.enable(e))return!1;if(!e.errorHandling)return!0;let t=e.target;if(!("addEventListener"in t)||typeof t.addEventListener!="function")throw new f("Global scope does not support addEventListener",s);let n=(r,o,i)=>{i&&i.callErrorListener(o)&&r.preventDefault()};return t.addEventListener("error",r=>{typeof r.error!="object"||r.error===null||n(r,r.error,Ke.getSyncronErrorZone(r.error))}),t.addEventListener("unhandledrejection",r=>{n(r,r.reason,Ke.getAsyncronErrorZone(r.promise))}),!0}static pushInteraction(e,t,n){if(((this.mCurrentZone.mTriggerMapping.get(e)??-1)&t)===0)return!1;let o=new Ne(e,t,this.mCurrentZone,n);return this.mCurrentZone.callInteractionListener(o)}mAttachments;mErrorListener;mInteractionListener;mIsolated;mName;mParent;mTriggerMapping;get name(){return this.mName}get parent(){return this.mParent}constructor(e,t,n){this.mAttachments=new Map,this.mErrorListener=new A,this.mName=e,this.mTriggerMapping=new A,this.mInteractionListener=new A,this.mParent=t,this.mIsolated=n}addErrorListener(e){return this.mErrorListener.set(e,s.current),this}addInteractionListener(e,t){return this.mInteractionListener.has(e)||this.mInteractionListener.set(e,new A),this.mInteractionListener.get(e).set(t,s.current),this}addTriggerRestriction(e,t){return this.mTriggerMapping.set(e,t),this}attachment(e,t){if(typeof t<"u")return this.mAttachments.set(e,t),t;let n=this.mAttachments.get(e);if(typeof n<"u")return n;if(!this.mIsolated)return this.mParent.attachment(e)}create(e,t){return new s(e,this,t?.isolate===!0)}execute(e,...t){let n=s.mCurrentZone;s.mCurrentZone=this;let r;try{r=e(...t)}catch(o){throw Ke.allocateSyncronError(o,s.mCurrentZone)}finally{s.mCurrentZone=n}return r}removeErrorListener(e){return this.mErrorListener.delete(e),this}removeInteractionListener(e,t){if(!t)return this.mInteractionListener.delete(e),this;let n=this.mInteractionListener.get(e);return n?(n.delete(t),this):this}callErrorListener(e){return this.execute(()=>{for(let[n,r]of this.mErrorListener.entries())if(r.execute(()=>n.call(this,e))===!1)return!0;return!1})?!0:this.mIsolated?!1:this.parent.callErrorListener(e)}callInteractionListener(e){if(((this.mTriggerMapping.get(e.type)??-1)&e.trigger)===0)return!1;let n=this.mInteractionListener.get(e.type);return n&&n.size>0&&this.execute(()=>{for(let[r,o]of n.entries())o.execute(()=>{r.call(this,e)})}),this.mIsolated?!0:this.parent.callInteractionListener(e)}}});var _t=p(()=>{Tr();Ir()});var ie,At=p(()=>{L();ie=class s{static mComponents=new WeakMap;static mConstructorSelector=new WeakMap;static mElements=new WeakMap;static ofComponent(e){let t=e.processorConstructor,n=s.mConstructorSelector.get(t);if(!n)throw new f(`Constructor "${t.name}" is not a registered custom element`,t);let r=s.mElements.get(e);if(!r)throw new f(`Component "${e}" is not a registered component`,e);let o;return e.isProcessorCreated&&(o=e.processor),{selector:n,constructor:t,element:r,component:e}}static ofConstructor(e){let t=s.mConstructorSelector.get(e);if(!t)throw new f(`Constructor "${e.name}" is not a registered custom element`,e);let n=globalThis.customElements.get(t);if(!n)throw new f(`Constructor "${e.name}" is not a registered custom element`,e);return{selector:t,constructor:e,elementConstructor:n}}static ofElement(e){let t=s.mComponents.get(e);if(!t)throw new f(`Element "${e}" is not a PwbComponent.`,e);return s.ofComponent(t)}static ofProcessor(e){let t=s.mComponents.get(e);if(!t)throw new f("Processor is not a PwbComponent.",e);return s.ofComponent(t)}static registerComponent(e,t,n){s.mComponents.has(t)||s.mComponents.set(t,e),n&&!s.mComponents.has(n)&&s.mComponents.set(n,e),s.mElements.has(e)||s.mElements.set(e,t)}static registerConstructor(e,t){e&&!s.mConstructorSelector.has(e)&&s.mConstructorSelector.set(e,t)}}});var Nt=p(()=>{});var Fe,On=p(()=>{Nt();Fe=class s{static DEFAULT=(()=>{let e=new s;return e.mSpashscreenConfiguration.background="blue",e.mSpashscreenConfiguration.content="",e.mSpashscreenConfiguration.manual=!1,e.mSpashscreenConfiguration.animationTime=1e3,e.mErrorConfiguration.ignore=!1,e.mErrorConfiguration.print=!0,e.mLoggingConfiguration.filter=7,e.mLoggingConfiguration.updatePerformance=!1,e.mLoggingConfiguration.updaterTrigger=!1,e.mLoggingConfiguration.updateReshedule=!1,e.mUpdatingConfiguration.frameTime=100,e.mUpdatingConfiguration.stackCap=10,e})();mErrorConfiguration;mLoggingConfiguration;mSpashscreenConfiguration;mUpdatingConfiguration;get error(){return this.mErrorConfiguration}get logging(){return this.mLoggingConfiguration}get splashscreen(){return this.mSpashscreenConfiguration}get updating(){return this.mUpdatingConfiguration}constructor(){this.mSpashscreenConfiguration={background:s.DEFAULT?.mSpashscreenConfiguration.background,content:s.DEFAULT?.mSpashscreenConfiguration.content,manual:s.DEFAULT?.mSpashscreenConfiguration.manual,animationTime:s.DEFAULT?.mSpashscreenConfiguration.animationTime},this.mErrorConfiguration={ignore:s.DEFAULT?.mErrorConfiguration.ignore,print:s.DEFAULT?.mErrorConfiguration.print},this.mLoggingConfiguration={filter:s.DEFAULT?.mLoggingConfiguration.filter,updatePerformance:s.DEFAULT?.mLoggingConfiguration.updatePerformance,updaterTrigger:s.DEFAULT?.mLoggingConfiguration.updaterTrigger,updateReshedule:s.DEFAULT?.mLoggingConfiguration.updateReshedule},this.mUpdatingConfiguration={frameTime:s.DEFAULT?.mUpdatingConfiguration.frameTime,stackCap:s.DEFAULT?.mUpdatingConfiguration.stackCap}}print(e,...t){(e&this.mLoggingConfiguration.filter)!==0&&console.log(...t)}}});var st,Pi=p(()=>{_t();At();On();st=class s{static CONFIGURATION_ATTACHMENT=Symbol("PwbApplicationConfigurationAttachment");static new(e,t,n){let r=new Fe,o=new s(e,r);t(o),n&&o.appendTo(n)}mConfiguration;mElement;mInteractionZone;get configuration(){return this.mConfiguration}constructor(e,t){this.mInteractionZone=$.current.create(`App-${e}`,{isolate:!0}),this.mInteractionZone.attachment(s.CONFIGURATION_ATTACHMENT,t),this.mConfiguration=t,this.mElement=document.createElement("div"),this.mElement.attachShadow({mode:"open"})}addContent(e){let t=ie.ofConstructor(e).elementConstructor;return this.mInteractionZone.execute(()=>{let n=ie.ofElement(new t);return this.mElement.shadowRoot.appendChild(n.element),n.component.processor})}addErrorListener(e){this.mInteractionZone.addErrorListener(e)}addStyle(e){let t=document.createElement("style");t.textContent=e,this.mElement.shadowRoot.prepend(t)}appendTo(e){e.appendChild(this.mElement)}}});var Dt,wr=p(()=>{L();Dt=class{mCustomMetadata;constructor(){this.mCustomMetadata=new A}getMetadata(e){return this.mCustomMetadata.get(e)??null}setMetadata(e,t){this.mCustomMetadata.set(e,t)}}});var qt,Er=p(()=>{wr();qt=class extends Dt{}});var Jt,kr=p(()=>{L();wr();Er();Jt=class s extends Dt{static mPrivateMetadataKey=Symbol("Metadata");mDecoratorMetadataObject;mPropertyMetadata;constructor(e){super(),this.mDecoratorMetadataObject=e,this.mPropertyMetadata=new A,e[s.mPrivateMetadataKey]=this}getInheritedMetadata(e){let t=new Array,n=this.mDecoratorMetadataObject;do{if(Object.hasOwn(n,s.mPrivateMetadataKey)){let o=n[s.mPrivateMetadataKey].getMetadata(e);o!==null&&t.push(o)}n=Object.getPrototypeOf(n)}while(n!==null);return t.reverse()}getProperty(e){return this.mPropertyMetadata.has(e)||this.mPropertyMetadata.add(e,new qt),this.mPropertyMetadata.get(e)}}});var se,Ar=p(()=>{L();kr();Symbol.metadata??=Symbol("Symbol.metadata");se=class s{static mMetadataMapping=new A;static add(e,t){return(n,r)=>{let o=s.forInternalDecorator(r.metadata);switch(r.kind){case"class":o.setMetadata(e,t);return;case"method":case"field":case"getter":case"setter":case"accessor":if(r.static)throw new Error("@Metadata.add not supported for statics.");o.getProperty(r.name).setMetadata(e,t);return}}}static forInternalDecorator(e){return s.mapMetadata(e)}static get(e){Object.hasOwn(e,Symbol.metadata)||s.polyfillMissingMetadata(e);let t=e[Symbol.metadata];return s.mapMetadata(t)}static init(){return(e,t)=>{s.forInternalDecorator(t.metadata)}}static mapMetadata(e){if(s.mMetadataMapping.has(e))return s.mMetadataMapping.get(e);let t=new Jt(e);return s.mMetadataMapping.set(e,t),t}static polyfillMissingMetadata(e){let t=new Array,n=e;do t.push(n),n=Object.getPrototypeOf(n);while(n!==null);for(let r=t.length-1;r>=0;r--){let o=t[r];if(!Object.hasOwn(o,Symbol.metadata)){let i=null;r<t.length-2&&(i=t[r+1][Symbol.metadata]),o[Symbol.metadata]=Object.create(i,{})}}}}});var C,Ii=p(()=>{L();Ar();C=class s{static mCurrentInjectionContext=null;static mInjectMode=new A;static mInjectableConstructor=new A;static mInjectableReplacement=new A;static mInjectionConstructorIdentificationMetadataKey=Symbol("InjectionConstructorIdentification");static mSingletonMapping=new A;static createObject(e,t,n){let[r,o]=typeof t=="object"&&t!==null?[!1,t]:[!!t,n??new A],i=s.getInjectionIdentification(e);if(!s.mInjectableConstructor.has(i))throw new f(`Constructor "${e.name}" is not registered for injection and can not be built`,s);let a=r?"instanced":s.mInjectMode.get(i),l=new A(o.map((d,y)=>[s.getInjectionIdentification(d),y])),c=s.mCurrentInjectionContext,h=new A([...c?.localInjections.entries()??[],...l.entries()]);s.mCurrentInjectionContext={injectionMode:a,localInjections:h};try{if(!r&&a==="singleton"&&s.mSingletonMapping.has(i))return s.mSingletonMapping.get(i);let d=new e;return a==="singleton"&&!s.mSingletonMapping.has(i)&&s.mSingletonMapping.add(i,d),d}finally{s.mCurrentInjectionContext=c}}static injectable(e="instanced"){return(t,n)=>{s.registerInjectable(t,n.metadata,e)}}static registerInjectable(e,t,n){let r=s.getInjectionIdentification(e,t);s.mInjectableConstructor.add(r,e),s.mInjectMode.add(r,n)}static replaceInjectable(e,t){let n=s.getInjectionIdentification(e);if(!s.mInjectableConstructor.has(n))throw new f("Original constructor is not registered.",s);let r=s.getInjectionIdentification(t);if(!s.mInjectableConstructor.has(r))throw new f("Replacement constructor is not registered.",s);s.mInjectableReplacement.set(n,t)}static use(e){if(s.mCurrentInjectionContext===null)throw new f("Can't create object outside of an injection context.",s);let t=s.getInjectionIdentification(e);if(s.mCurrentInjectionContext.injectionMode!=="singleton"&&s.mCurrentInjectionContext.localInjections.has(t))return s.mCurrentInjectionContext.localInjections.get(t);let n=s.mInjectableReplacement.get(t);if(n||(n=s.mInjectableConstructor.get(t)),!n)throw new f(`Constructor "${e.name}" is not registered for injection and can not be built`,s);return s.createObject(n)}static getInjectionIdentification(e,t){let n=t?se.forInternalDecorator(t):se.get(e),r=n.getMetadata(s.mInjectionConstructorIdentificationMetadataKey);return r||(r=Symbol(e.name),n.setMetadata(s.mInjectionConstructorIdentificationMetadataKey,r)),r}}});var W=p(()=>{Ii();Ar();kr();Er()});var Nr=p(()=>{});var De=p(()=>{});var z,re=p(()=>{z=(a=>(a[a.None=0]="None",a[a.PropertySet=4]="PropertySet",a[a.PropertyDelete=8]="PropertyDelete",a[a.UntrackableFunctionCall=16]="UntrackableFunctionCall",a[a.Manual=32]="Manual",a[a.InputChange=64]="InputChange",a[a.Any=127]="Any",a))(z||{})});var me,St=p(()=>{_t();re();me=class s{static IGNORED_CLASSES=(()=>{let e=new WeakSet;return e.add(s),e.add($),e.add(Ne),e})();static ORIGINAL_TO_INTERACTION_MAPPING=new WeakMap;static PROXY_TO_ORIGINAL_MAPPING=new WeakMap;static UNTRACEABLE_FUNCTION_UPDATE_TRIGGER=(()=>{let e=new WeakMap;return e.set(Array.prototype.fill,4),e.set(Array.prototype.pop,8),e.set(Array.prototype.push,4),e.set(Array.prototype.shift,8),e.set(Array.prototype.unshift,4),e.set(Array.prototype.splice,4),e.set(Array.prototype.reverse,4),e.set(Array.prototype.sort,4),e.set(Array.prototype.concat,4),e.set(Map.prototype.clear,8),e.set(Map.prototype.delete,8),e.set(Map.prototype.set,4),e.set(Set.prototype.clear,8),e.set(Set.prototype.delete,8),e.set(Set.prototype.add,4),e})();static createCoreEntityCreationData(e,t){return{source:e,property:t,toString:function(){let n=typeof this.source;return"constructor"in this.source&&(n=this.source.constructor.name),this.property?`[ ${n} => ${this.property.toString()} ]`:`[ ${n} ]`}}}static getOriginal(e){return s.PROXY_TO_ORIGINAL_MAPPING.get(e)??e}static ignoreClass(e){s.IGNORED_CLASSES.add(e)}static getWrapper(e){let t=s.getOriginal(e);return s.ORIGINAL_TO_INTERACTION_MAPPING.get(t)}mListenerZones;mProxyObject;get proxy(){return this.mProxyObject}constructor(e){let t=s.getWrapper(e);if(t)return t;this.mListenerZones=new Set,s.IGNORED_CLASSES.has(Object.getPrototypeOf(e)?.constructor)?this.mProxyObject=e:this.mProxyObject=this.createProxyObject(e),s.PROXY_TO_ORIGINAL_MAPPING.set(this.mProxyObject,e),s.ORIGINAL_TO_INTERACTION_MAPPING.set(e,this)}addListenerZone(e){this.mListenerZones.has(e)||this.mListenerZones.add(e)}convertToProxy(e){if(e===null||typeof e!="object"&&typeof e!="function")return e;let t=new s(e);for(let n of this.mListenerZones)t.addListenerZone(n);return t.proxy}createProxyObject(e){let t=(r,o,i)=>{let a=s.getOriginal(o);try{let l=r.call(a,...i);return this.convertToProxy(l)}finally{s.UNTRACEABLE_FUNCTION_UPDATE_TRIGGER.has(r)?this.dispatch(s.UNTRACEABLE_FUNCTION_UPDATE_TRIGGER.get(r),o):this.dispatch(16,this.mProxyObject)}};return new Proxy(e,{apply:(r,o,i)=>{this.addListenerZone($.current);let a=r;try{let l=a.call(o,...i);return this.convertToProxy(l)}catch(l){if(!(l instanceof TypeError))throw l;return t(a,o,i)}},set:(r,o,i)=>{this.addListenerZone($.current);try{let a=i;return(a!==null&&typeof a=="object"||typeof a=="function")&&(a=s.getOriginal(a)),Reflect.set(r,o,a)}finally{this.dispatch(4,this.mProxyObject,o)}},get:(r,o,i)=>{this.addListenerZone($.current);let a=Reflect.get(r,o);return this.convertToProxy(a)},deleteProperty:(r,o)=>{this.addListenerZone($.current);try{return delete r[o]}finally{this.dispatch(8,this.mProxyObject,o)}}})}dispatch(e,t,n){if($.pushInteraction(z,e,s.createCoreEntityCreationData(t,n)))for(let o of this.mListenerZones)o.execute(()=>{$.pushInteraction(z,e,s.createCoreEntityCreationData(t,n))})}}});var P,ae=p(()=>{St();P=class s{static mEnableTrackingOnConstruction=!1;static enableTrackingOnConstruction(e){let t=s.mEnableTrackingOnConstruction;s.mEnableTrackingOnConstruction=!0;try{return e()}finally{s.mEnableTrackingOnConstruction=t}}constructor(){if(s.mEnableTrackingOnConstruction)return new me(this).proxy}}});function wi(){return s=>{me.ignoreClass(s)}}var Ei=p(()=>{St()});var Xe,ki=p(()=>{Xe=class s{static mCurrentUpdateCycle=null;static openResheduledCycle(e,t){let n=!1;if(!s.mCurrentUpdateCycle){let r=performance.now();s.mCurrentUpdateCycle={initiator:e.initiator,timeStamp:r,startTime:r,forcedSync:e.forcedSync,runner:e.runner},n=!0}try{return t(s.mCurrentUpdateCycle)}finally{n&&(s.mCurrentUpdateCycle=null)}}static openUpdateCycle(e,t){let n=!1;if(!s.mCurrentUpdateCycle){let r=performance.now();s.mCurrentUpdateCycle={initiator:e.updater,timeStamp:r,startTime:r,forcedSync:e.runSync,runner:{id:Symbol("Runner "+r),timestamp:r}},n=!0}try{return t(s.mCurrentUpdateCycle)}finally{n&&(s.mCurrentUpdateCycle=null)}}static updateCycleRunId(e,t){if(e.initiator===t){let n=performance.now(),r=e;r.runner={id:Symbol("Runner "+n),timestamp:n}}}static updateCyleStartTime(e){let t=performance.now(),n=e;n.startTime=t}}});var Fn,Ai=p(()=>{Fn=class extends Error{mChain;get chain(){return this.mChain}constructor(e,t){let n=t.slice(-20).map(r=>r.toString()).join(`
`);super(`${e}: 
${n}`),this.mChain=[...t]}}});var Lt,Ni=p(()=>{Lt=class extends Error{constructor(){super("Update resheduled")}}});var Di,Dr,at,Si=p(()=>{L();_t();Nt();re();St();Ei();ki();Ai();Ni();Di=[wi()];at=class{mApplicationContext;mInteractionZone;mLoggingType;mRegisteredObjects;mUpdateFunction;mUpdateRunCache;mUpdateStates;get zone(){return this.mInteractionZone}constructor(e){this.mUpdateRunCache=new WeakMap,this.mRegisteredObjects=new WeakMap,this.mUpdateFunction=e.onUpdate,this.mApplicationContext=e.applicationContext,this.mLoggingType=e.loggingType;let t=e.parent?.mInteractionZone??$.current,n=Math.floor(Math.random()*16777215).toString(16);this.mInteractionZone=t.create(`${e.label}-ProcessorZone (${n})`,{isolate:e.isolate}).addTriggerRestriction(z,e.trigger),this.mUpdateStates={chainCompleteHooks:new Pe,async:{hasSheduledTask:!1,hasRunningTask:!1,sheduledTaskIsResheduled:!1},sync:{running:!1},cycle:{chainedTask:null}}}addUpdateTrigger(e){this.mInteractionZone.addInteractionListener(z,t=>{(e&e)!==0&&this.runUpdateAsynchron(t,null)})}deconstruct(){this.mInteractionZone.removeInteractionListener(z)}registerObject(e){if(this.mRegisteredObjects.has(e))return this.mRegisteredObjects.get(e).proxy;if(e instanceof EventTarget)for(let n of["input","change"])this.mInteractionZone.execute(()=>{e.addEventListener(n,()=>{$.pushInteraction(z,64,me.createCoreEntityCreationData(e,n))})});let t=new me(e);return this.mRegisteredObjects.set(e,t),this.mRegisteredObjects.set(t.proxy,t),t.proxy}async resolveAfterUpdate(){return this.mUpdateStates.async.hasSheduledTask?new Promise((e,t)=>{this.mUpdateStates.chainCompleteHooks.push((n,r)=>{r?t(r):e(n)})}):!1}switchToUpdateZone(e){return this.mInteractionZone.execute(e)}update(){let e=new Ne(z,32,this.mInteractionZone,me.createCoreEntityCreationData(this,Symbol("Manual Update")));return this.runUpdateSynchron(e)}updateAsync(){let e=new Ne(z,32,this.mInteractionZone,me.createCoreEntityCreationData(this,Symbol("Manual Update")));this.runUpdateAsynchron(e,null)}executeTaskChain(e,t,n,r){if(r.size>this.mApplicationContext.updating.stackCap)throw new Fn("Call loop detected",r.toArray());let o=performance.now();if(!t.forcedSync&&o-t.startTime>this.mApplicationContext.updating.frameTime)throw new Lt;r.push(e);let i=this.mInteractionZone.execute(()=>this.mUpdateFunction.call(this,e))||n;if(this.mApplicationContext.logging.updatePerformance){let l=performance.now();this.mApplicationContext.print(this.mLoggingType,"Update performance:",this.mInteractionZone.name,`
	`,"Cycle:",l-t.timeStamp,"ms",`
	`,"Runner:",l-t.runner.timestamp,"ms",`
	`,"  ","Id:",t.runner.id.toString(),`
	`,"Update:",l-o,"ms",`
	`,"  ","State:",i,`
	`,"  ","Chain: ",r.toArray().map(c=>c.toString()))}if(Xe.updateCycleRunId(t,this),!this.mUpdateStates.cycle.chainedTask)return i;let a=this.mUpdateStates.cycle.chainedTask;return this.mUpdateStates.cycle.chainedTask=null,this.executeTaskChain(a,t,i,r)}releaseUpdateChainCompleteHooks(e,t){if(!this.mUpdateStates.chainCompleteHooks.top)return;let n;for(;n=this.mUpdateStates.chainCompleteHooks.pop();)n(e,t)}runUpdateAsynchron(e,t){if(this.mUpdateStates.async.hasRunningTask||this.mUpdateStates.async.sheduledTaskIsResheduled){this.mUpdateStates.cycle.chainedTask=e;return}if(this.mUpdateStates.async.hasSheduledTask)return;let n=r=>{this.mUpdateStates.async.hasRunningTask=!0,this.mUpdateStates.async.hasSheduledTask=!1,this.mUpdateStates.async.sheduledTaskIsResheduled=!1;let o=!1;try{this.runUpdateSynchron(e)}catch(i){i instanceof Lt&&r.initiator===this&&(this.mApplicationContext.logging.updateReshedule&&this.mApplicationContext.print(this.mLoggingType,"Reshedule:",this.mInteractionZone.name,`
	`,"Cycle Performance",performance.now()-r.timeStamp,`
	`,"Runner Id:",r.runner.id.toString()),o=!0)}finally{this.mUpdateStates.async.hasRunningTask=!1}o&&this.runUpdateAsynchron(e,r)};this.mUpdateStates.async.hasSheduledTask=!0,t&&(this.mUpdateStates.async.sheduledTaskIsResheduled=!0),globalThis.requestAnimationFrame(()=>{t?Xe.openResheduledCycle(t,n):Xe.openUpdateCycle({updater:this,reason:e,runSync:!1},n)})}runUpdateSynchron(e){if(this.mApplicationContext.logging.updaterTrigger&&this.mApplicationContext.print(this.mLoggingType,"Update trigger:",this.mInteractionZone.name,`
	`,"Trigger:",e.toString(),`
	`,"Chained:",this.mUpdateStates.sync.running,`
	`,"Omitted:",!!this.mUpdateStates.cycle.chainedTask),this.mUpdateStates.sync.running)return this.mUpdateStates.cycle.chainedTask=e,!1;this.mUpdateStates.sync.running=!0;try{let t=Xe.openUpdateCycle({updater:this,reason:e,runSync:!0},n=>{if(this.mUpdateRunCache.has(n.runner))return Xe.updateCyleStartTime(n),this.mUpdateRunCache.get(n.runner);let r=this.executeTaskChain(e,n,!1,new Pe);return this.mUpdateRunCache.set(n.runner,r),r});return this.releaseUpdateChainCompleteHooks(t),t}catch(t){if(t instanceof Lt)throw t;let n=t;if(t&&this.mApplicationContext.error.print&&this.mApplicationContext.print(7,t),this.mApplicationContext.error.ignore&&(this.mApplicationContext.print(this.mLoggingType,t),n=null),this.releaseUpdateChainCompleteHooks(!1,n),n)throw t;return!1}finally{this.mUpdateStates.sync.running=!1}}};Dr=E(null),at=m(Dr,0,"CoreEntityUpdater",Di,at),u(Dr,1,at)});var Be,Bn=p(()=>{L();W();St();ae();Si();Be=class{mApplicationContext;mHooks;mInjections;mIsLocked;mIsSetup;mProcessor;mProcessorConstructor;mTrackChanges;mUpdater;get applicationContext(){return this.mApplicationContext}get isProcessorCreated(){return!!this.mProcessor}get processor(){if(!this.mIsSetup)throw new f("Processor can not be build before calling setup.",this);return this.isProcessorCreated||(this.mProcessor=this.createProcessor()),this.mProcessor}get processorConstructor(){return this.mProcessorConstructor}constructor(e){if(!(e.constructor.prototype instanceof P))throw new f(`Constructor "${e.constructor.name}" does not extend`,this);if(this.mApplicationContext=e.applicationContext,this.mProcessorConstructor=e.constructor,this.mProcessor=null,this.mIsLocked=!1,this.mIsSetup=!1,this.mTrackChanges=e.trackConstructorChanges,this.mInjections=new A,this.mHooks={create:new Pe,setup:new Pe},e.parent)for(let[t,n]of e.parent.mInjections.entries())this.setProcessorAttributes(t,n);this.mUpdater=new at({applicationContext:e.applicationContext,label:e.constructor.name,loggingType:e.loggingType,isolate:!!e.isolate,trigger:e.trigger,parent:e.parent?.mUpdater,onUpdate:()=>this.mIsSetup?this.onUpdate():!1})}call(e,t,...n){if(!this.isProcessorCreated&&!t)return null;let r=Reflect.get(this.processor,e);return typeof r!="function"?null:this.mUpdater.switchToUpdateZone(()=>r.apply(this.processor,n))}deconstruct(){this.mUpdater.deconstruct()}getProcessorAttribute(e){return this.mInjections.get(e)}registerObject(e){return this.mUpdater.registerObject(e)}setProcessorAttributes(e,t){if(this.mIsLocked)throw new f("Cant add injections to after construction.",this);this.mInjections.set(e,t)}setup(){if(this.mIsSetup)throw new f("Setup allready called.",this);this.mIsSetup=!0;let e;for(;e=this.mHooks.setup.pop();)e.apply(this);return this}update(){return this.mUpdater.update()}updateAsync(){this.mUpdater.updateAsync()}async waitForUpdate(){return this.mUpdater.resolveAfterUpdate()}addCreationHook(e){return this.mHooks.create.push(e),this}addSetupHook(e){return this.mHooks.setup.push(e),this}setAutoUpdate(e){this.mUpdater.addUpdateTrigger(e)}createProcessor(){this.mIsLocked=!0;let e=this.mUpdater.switchToUpdateZone(()=>this.mTrackChanges?P.enableTrackingOnConstruction(()=>C.createObject(this.mProcessorConstructor,this.mInjections)):C.createObject(this.mProcessorConstructor,this.mInjections));e=me.getOriginal(e);let t;for(;t=this.mHooks.create.pop();){let n=t.call(this,e);n&&(e=n)}return e}}});var We,Gn=p(()=>{Nt();Bn();We=class s extends Be{constructor(e,t,n,r){super({applicationContext:e,constructor:t,loggingType:4,parent:n,isolate:!1,trigger:r,trackConstructorChanges:!1}),this.setProcessorAttributes(s,this),this.addSetupHook(()=>{this.call("onExecute",!1)}).addSetupHook(()=>{let o=this.processor})}deconstruct(){this.call("onDeconstruct",!1),super.deconstruct()}onUpdate(){return!1}}});var Sr,he,lt=p(()=>{L();Bn();Sr=class s{static mInstance;mCoreEntityConstructor;mProcessorConstructorConfiguration;constructor(){if(s.mInstance)return s.mInstance;s.mInstance=this,this.mCoreEntityConstructor=new A,this.mProcessorConstructorConfiguration=new A}get(e){let t=this.mCoreEntityConstructor.get(e);if(!t)return new Array;let n=new Array;for(let r of t)n.push({processorConstructor:r,processorConfiguration:this.mProcessorConstructorConfiguration.get(r)});return n}register(e,t,n){this.mProcessorConstructorConfiguration.set(t,n);let r=e;do{if(!(r.prototype instanceof Be)&&r!==Be)break;this.mCoreEntityConstructor.has(r)||this.mCoreEntityConstructor.set(r,new Set),this.mCoreEntityConstructor.get(r).add(t)}while(r=Object.getPrototypeOf(r))}},he=new Sr});var Mt,Lr=p(()=>{De();Gn();Bn();lt();Mt=class s extends Be{static mExtensionCache=new WeakMap;mExtensionList;constructor(e){super(e),this.mExtensionList=new Array,this.addSetupHook(()=>{this.executeExtensions()})}deconstruct(){for(let e of this.mExtensionList)e.deconstruct();super.deconstruct()}executeExtensions(){let e=(()=>{let n=s.mExtensionCache.get(this.processorConstructor);if(n)return n;let o=he.get(We).filter(a=>{for(let l of a.processorConfiguration.targetRestrictions)if(this instanceof l||this.processorConstructor.prototype instanceof l||this.processorConstructor===l)return!0;return!1}),i={read:o.filter(a=>a.processorConfiguration.access===1),write:o.filter(a=>a.processorConfiguration.access===3),readWrite:o.filter(a=>a.processorConfiguration.access===2)};return s.mExtensionCache.set(this.processorConstructor,i),i})(),t=[...e.write,...e.readWrite,...e.read];for(let n of t){let r=new We(this.applicationContext,n.processorConstructor,this,n.processorConfiguration.trigger);r.setup(),this.mExtensionList.push(r)}}}});var ct,Vn=p(()=>{L();ct=class{mExpression;mTemporaryValues;constructor(e,t,n){if(this.mTemporaryValues=new A,n.length>0)for(let r of n)this.mTemporaryValues.set(r,void 0);this.mExpression=this.createEvaluationFunktion(e,this.mTemporaryValues).bind(t.store)}execute(){return this.mExpression()}setTemporaryValue(e,t){if(!this.mTemporaryValues.has(e))throw new f(`Temporary value "${e}" does not exist for this procedure.`,this);this.mTemporaryValues.set(e,t)}createEvaluationFunktion(e,t){let n,r=`__${Math.random().toString(36).substring(2)}`;if(n="return function () {",t.size>0)for(let o of t.keys())n+=`const ${o} = ${r}.get('${o}');`;return n+=`return ${e};`,n+="};",new Function(r,n)(t)}}});var Se,Qt=p(()=>{Vn();Se=class{mDataLevel;get data(){return this.mDataLevel}constructor(e){this.mDataLevel=e}createExpressionProcedure(e,t){return new ct(e,this.data,t??[])}setTemporaryValue(e,t){this.data.setTemporaryValue(e,t)}}});var ve,ut=p(()=>{L();Rt();ve=class{mComponent;mDataProxy;mParentLevel;mTemporaryValues;get store(){return this.mDataProxy}constructor(e){this.mTemporaryValues=new A,e instanceof Ce?(this.mParentLevel=null,this.mComponent=e):(this.mParentLevel=e,this.mComponent=e.mComponent),this.mDataProxy=this.createAccessProxy()}setTemporaryValue(e,t){this.mTemporaryValues.set(e,t)}updateLevelData(e){if(e.mParentLevel!==this.mParentLevel)throw new f("Can't update InstructionLevelData for a deeper level than it target data.",this);this.mTemporaryValues=e.mTemporaryValues}createAccessProxy(){return new Proxy(new Object,{get:(e,t)=>this.getValue(t),set:(e,t,n)=>(this.hasTemporaryValue(t)&&this.setTemporaryValue(t,n),t in this.mComponent.processor?(this.mComponent.processor[t]=n,!0):(this.setTemporaryValue(t,n),!0)),deleteProperty:()=>{throw new f("Deleting properties is not allowed",this)},ownKeys:()=>[...new Set([...Object.keys(this.mComponent.processor),...this.getTemporaryValuesList()])]})}getTemporaryValuesList(){let e=this.mTemporaryValues.map(t=>t);return this.mParentLevel&&e.push(...this.mParentLevel.getTemporaryValuesList()),e}getValue(e){if(this.mTemporaryValues.has(e))return this.mTemporaryValues.get(e);if(this.mParentLevel)return this.mParentLevel.getValue(e);if(e in this.mComponent.processor)return this.mComponent.processor[e]}hasTemporaryValue(e){return this.mTemporaryValues.has(e)?!0:this.mParentLevel?this.mParentLevel.hasTemporaryValue(e):!1}}});var Le,en=p(()=>{Le=class{mParent;get parent(){return this.mParent}set parent(e){this.mParent=e}get template(){return this.parent?.template??null}constructor(){this.mParent=null}}});var pt,jn=p(()=>{L();en();pt=class s extends Le{mChildList;mInstruction;mInstructionType;get childList(){return _.newListWith(...this.mChildList)}get instruction(){return this.mInstruction}set instruction(e){this.mInstruction=e}get instructionType(){return this.mInstructionType}set instructionType(e){this.mInstructionType=e}constructor(){super(),this.mChildList=Array(),this.mInstruction="",this.mInstructionType=""}appendChild(...e){for(let t of e)t.parent=this;this.mChildList.push(...e)}clone(){let e=new s;e.instruction=this.instruction,e.instructionType=this.instructionType;for(let t of this.mChildList)e.appendChild(t.clone());return e}equals(e){if(!(e instanceof s)||e.instruction!==this.instruction||e.instructionType!==this.instructionType||e.childList.length!==this.childList.length)return!1;for(let t=0;t<e.childList.length;t++)if(!e.childList[t].equals(this.childList[t]))return!1;return!0}removeChild(e){let t=this.mChildList.indexOf(e),n;return t!==-1&&(n=this.mChildList.splice(t,1)[0],n.parent=null),n}}});var Ot,Mr=p(()=>{L();Ot=class{mNode;get node(){if(!this.mNode)throw new f("Template value is not attached to any template node.",this);return this.mNode}set node(e){this.mNode=e}constructor(){this.mNode=null}}});var Ae,tn=p(()=>{Mr();Ae=class s extends Ot{mExpression;get value(){return this.mExpression}set value(e){this.mExpression=e}constructor(){super(),this.mExpression=""}clone(){let e=new s;return e.value=this.value,e}equals(e){return e instanceof s&&e.value===this.value}toString(){return`{{ ${this.mExpression} }}`}}});var Ge,nn=p(()=>{en();tn();Ge=class s extends Le{mContainsExpression;mTextValue;mValues;get containsExpression(){return this.mContainsExpression}get values(){return this.mValues}constructor(){super(),this.mTextValue="",this.mContainsExpression=!1,this.mValues=[]}addValue(...e){for(let t of e)t instanceof Ae&&(t.node=this,this.mContainsExpression=!0),this.mValues.push(t),this.mTextValue+=t.toString()}clone(){let e=new s;for(let t of this.values){let n=typeof t=="string"?t:t.clone();e.addValue(n)}return e}equals(e){if(!(e instanceof s)||e.values.length!==this.values.length)return!1;for(let t=0;t<this.values.length;t++){let n=this.values[t],r=e.values[t];if(n!==r&&(typeof n!=typeof r||typeof n=="string"&&n!==r||!r.equals(n)))return!1}return!0}toString(){return this.mTextValue}}});var rn,Rr=p(()=>{nn();Mr();rn=class s extends Ot{mName;mValue;get name(){return this.mName}set name(e){this.mName=e}get values(){return this.mValue}constructor(){super(),this.mName="",this.mValue=new Ge}clone(){let e=new s;e.name=this.name;for(let t of this.values.values){let n=typeof t=="string"?t:t.clone();e.values.addValue(n)}return e}equals(e){return!(!(e instanceof s)||e.name!==this.name||!e.values.equals(this.values))}}});var Ve,on=p(()=>{L();en();Rr();Ve=class s extends Le{mAttributeDictionary;mChildList;mTagName;get attributes(){return _.newListWith(...this.mAttributeDictionary.values())}get childList(){return _.newListWith(...this.mChildList)}get tagName(){return this.mTagName}set tagName(e){this.mTagName=e}constructor(){super(),this.mAttributeDictionary=new A,this.mChildList=Array(),this.mTagName=""}appendChild(...e){for(let t of e)t.parent=this;this.mChildList.push(...e)}clone(){let e=new s;e.tagName=this.tagName;for(let t of this.attributes){let n=e.setAttribute(t.name);for(let r of t.values.values){let o=typeof r=="string"?r:r.clone();n.addValue(o)}}for(let t of this.mChildList)e.appendChild(t.clone());return e}equals(e){if(!(e instanceof s)||e.tagName!==this.tagName||e.attributes.length!==this.attributes.length||e.childList.length!==this.childList.length)return!1;for(let t of e.mAttributeDictionary.values()){let n=this.mAttributeDictionary.get(t.name);if(!n||!n.equals(t))return!1}for(let t=0;t<e.childList.length;t++)if(!e.childList[t].equals(this.childList[t]))return!1;return!0}getAttribute(e){return this.mAttributeDictionary.get(e)?.values??null}removeAttribute(e){return this.mAttributeDictionary.has(e)?(this.mAttributeDictionary.delete(e),!0):!1}removeChild(e){let t=this.mChildList.indexOf(e),n;return t!==-1&&(n=this.mChildList.splice(t,1)[0],n.parent=null),n}setAttribute(e){let t=this.mAttributeDictionary.get(e);return t||(t=new rn,t.name=e,t.node=this,this.mAttributeDictionary.set(e,t)),t.values}}});var ye,dt=p(()=>{L();en();ye=class s extends Le{mBodyElementList;get body(){return this.mBodyElementList.clone()}get template(){return this}constructor(){super(),this.mBodyElementList=new _}appendChild(...e){this.mBodyElementList.push(...e);for(let t of e)t.parent=this}clone(){let e=new s;for(let t of this.mBodyElementList)e.appendChild(t.clone());return e}equals(e){if(!(e instanceof s)||e.body.length!==this.body.length)return!1;for(let t=0;t<this.body.length;t++)if(!this.body[t].equals(e.body[t]))return!1;return!0}removeChild(e){let t=this.mBodyElementList.indexOf(e),n;return t!==-1&&(n=this.mBodyElementList.splice(t,1)[0],n.parent=null),n}}});var le,Un=p(()=>{le=class{mApplicationContext;mComponentValues;mContent;mTemplate;get anchor(){return this.mContent.contentAnchor}get applicationContext(){return this.mApplicationContext}get boundary(){return this.mContent.getBoundary()}get template(){return this.mTemplate}get values(){return this.mComponentValues}get content(){return this.mContent}constructor(e,t,n,r){this.mApplicationContext=e,this.mTemplate=t,this.mTemplate.parent=null,this.mComponentValues=n,this.mContent=r,r.setCoreBuilder(this)}deconstruct(){this.content.deconstruct()}update(){let e=this.onUpdate(),t=!1,n=this.content.builders;if(n.length>0)for(let r=0;r<n.length;r++)t=n[r].update()||t;return e||t}createZoneEnabledElement(e){let t=e.tagName;if(typeof t!="string")throw t;if(t.includes("-")){let r=globalThis.customElements.get(t);if(typeof r<"u")return new r}let n=e.getAttribute("xmlns");return n&&!n.containsExpression?document.createElementNS(n.values[0],t):document.createElement(t)}createZoneEnabledText(e){return document.createTextNode(e)}}});var Ft,Or=p(()=>{L();Un();Ft=class{mChildBuilderList;mChildComponents;mContentAnchor;mContentBoundary;mLinkedContent;mModules;mRootChildList;get body(){return this.mRootChildList}get builders(){return this.mChildBuilderList}get contentAnchor(){return this.mContentAnchor}get modules(){return this.mModules}constructor(e,t){this.mModules=e,this.mChildBuilderList=new _,this.mRootChildList=new _,this.mChildComponents=new A,this.mLinkedContent=new WeakSet,this.mContentAnchor=document.createComment(t),this.mContentBoundary={start:this.mContentAnchor,end:this.mContentAnchor}}deconstruct(){this.onDeconstruct();let e;for(;e=this.mChildBuilderList.pop();)e.deconstruct();for(let n of this.mChildComponents.values())n.deconstruct();this.mChildComponents.clear();let t;for(;t=this.mRootChildList.pop();)t instanceof le||t.remove();this.contentAnchor.remove()}getBoundary(){let e=this.mContentBoundary.start,t;return this.mContentBoundary.end instanceof le?t=this.mContentBoundary.end.boundary.end:t=this.mContentBoundary.end,{start:e,end:t}}hasContent(e){return this.mLinkedContent.has(e)}insert(e,t,n){if(!this.hasContent(n))throw new f("Can't add content to builder. Target is not part of builder.",this);let r=e instanceof le?e.anchor:e;switch(t){case"After":{this.insertAfter(r,n);break}case"TopOf":{this.insertTop(r,n);break}case"BottomOf":{this.insertBottom(r,n);break}}this.mLinkedContent.add(e),e instanceof le&&this.mChildBuilderList.push(e);let o=r.parentElement??r.getRootNode(),i=this.mContentAnchor.parentElement??this.mContentAnchor.getRootNode();if(o===i){let a;switch(t){case"After":{a=this.mRootChildList.indexOf(n)+1;break}case"TopOf":{a=0;break}case"BottomOf":{a=this.mRootChildList.length;break}}a===this.mRootChildList.length&&(this.mContentBoundary.end=e),this.mRootChildList.splice(a+1,0,e)}}remove(e){if(!this.mLinkedContent.has(e))throw new f("Child node cant be deleted from builder when it not a child of them",this);if(this.mLinkedContent.delete(e),e instanceof le)this.mChildBuilderList.remove(e),e.deconstruct();else{let t=this.mChildComponents.get(e);t&&(t.deconstruct(),this.mChildComponents.delete(e)),e.remove()}this.mRootChildList.remove(e)&&(this.mContentBoundary.end=this.mRootChildList.at(-1)??this.mContentAnchor)}setCoreBuilder(e){this.mLinkedContent.add(e)}insertAfter(e,t){let n;t instanceof le?n=t.boundary.end:n=t,(n.parentElement??n.getRootNode()).insertBefore(e,n.nextSibling)}insertBottom(e,t){if(t instanceof le){this.insertAfter(e,t);return}if(t instanceof Element){t.appendChild(e);return}throw new f("Source node does not support child nodes.",this)}insertTop(e,t){if(t instanceof le){this.insertAfter(e,t.anchor);return}if(t instanceof Element){t.prepend(e);return}throw new f("Source node does not support child nodes.",this)}}});var $n,Li=p(()=>{L();Or();$n=class extends Ft{mAttributeModulesChangedOrder;mLinkedAttributeElement;mLinkedAttributeExpressionModules;mLinkedAttributeModuleList;mLinkedAttributeNodes;mLinkedExpressionModuleList;get linkedAttributeModules(){return this.mAttributeModulesChangedOrder&&(this.mAttributeModulesChangedOrder=!1,this.orderAttributeModules()),this.mLinkedAttributeModuleList}get linkedExpressionModules(){return this.mLinkedExpressionModuleList}constructor(e,t){super(e,t),this.mLinkedExpressionModuleList=new Array,this.mLinkedAttributeModuleList=new Array,this.mLinkedAttributeExpressionModules=new WeakMap,this.mLinkedAttributeNodes=new WeakMap,this.mLinkedAttributeElement=new WeakMap,this.mAttributeModulesChangedOrder=!1}attributeOfLinkedExpressionModule(e){return this.mLinkedAttributeExpressionModules.get(e)}getLinkedAttributeData(e){let t=this.mLinkedAttributeNodes.get(e),n=this.mLinkedAttributeElement.get(e);if(!t||!n)throw new f("Attribute has no linked data.",this);return{values:t,node:n}}linkAttributeExpression(e,t){this.mLinkedAttributeExpressionModules.set(e,t)}linkAttributeModule(e){this.mLinkedAttributeModuleList.push(e),this.mAttributeModulesChangedOrder=!0}linkAttributeNodes(e,t,n){this.mLinkedAttributeNodes.set(e,n),this.mLinkedAttributeElement.set(e,t)}linkExpressionModule(e){this.mLinkedExpressionModuleList.push(e)}onDeconstruct(){for(let e of this.mLinkedAttributeModuleList)e.deconstruct();for(let e of this.mLinkedExpressionModuleList)e.deconstruct()}orderAttributeModules(){this.mLinkedAttributeModuleList.sort((e,t)=>e.accessMode-t.accessMode)}}});var zn,Mi=p(()=>{Or();zn=class extends Ft{mInstructionModule;get instructionModule(){return this.mInstructionModule}set instructionModule(e){this.mInstructionModule=e}constructor(e,t){super(e,t),this.mInstructionModule=null}onDeconstruct(){this.mInstructionModule.deconstruct()}}});var Hn,Ri=p(()=>{L();Un();Mi();Fr();Hn=class extends le{constructor(e,t,n,r){super(e,t,r,new zn(n,`Instruction - {$${t.instructionType}}`))}onUpdate(){if(!this.content.instructionModule){let t=this.content.modules.createInstructionModule(this.applicationContext,this.template,this.values);this.content.instructionModule=t}if(this.content.instructionModule.update()){let t=this.content.body;this.updateStaticBuilder(t,this.content.instructionModule.instructionResult.elementList)}return!1}insertNewContent(e,t){let n=new Bt(this.applicationContext,e.template,this.content.modules,e.dataLevel,`Child - {$${this.template.instructionType}}`);return t===null?this.content.insert(n,"TopOf",this):this.content.insert(n,"After",t),n}updateStaticBuilder(e,t){let r=new Yt((a,l)=>l.template.equals(a.template)).differencesOf(e,t),o=0,i=null;for(let a=0;a<r.length;a++){let l=r[a];if(l.changeState===1)this.content.remove(l.item);else if(l.changeState===2)i=this.insertNewContent(l.item,i),o++;else{let c=t[o].dataLevel;l.item.values.updateLevelData(c),i=l.item,o++}}}}});var Bt,Fr=p(()=>{ut();jn();nn();on();dt();tn();Un();Li();Ri();Bt=class extends le{mInitialized;constructor(e,t,n,r,o){super(e,t,r,new $n(n,`Static - {${o}}`)),this.mInitialized=!1}onUpdate(){this.mInitialized||(this.mInitialized=!0,this.buildTemplate([this.template],this));let e=!1,t=this.content.linkedAttributeModules;for(let o=0;o<t.length;o++)e=t[o].update()||e;let n=!1,r=this.content.linkedExpressionModules;for(let o=0;o<r.length;o++){let i=r[o];if(i.update()){n=!0;let a=this.content.attributeOfLinkedExpressionModule(i);if(!a)continue;let l=this.content.getLinkedAttributeData(a),c=l.values.reduce((h,d)=>h+d.data,"");l.node.setAttribute(a.name,c)}}return e||n}buildInstructionTemplate(e,t){let n=new Hn(this.applicationContext,e,this.content.modules,new ve(this.values));this.content.insert(n,"BottomOf",t)}buildStaticTemplate(e,t){let n=this.createZoneEnabledElement(e);this.content.insert(n,"BottomOf",t);for(let r of e.attributes){let o=this.content.modules.createAttributeModule(this.applicationContext,r,n,this.values);if(o){this.content.linkAttributeModule(o);continue}if(r.values.containsExpression){let i=new Array;for(let a of r.values.values){let l=this.createZoneEnabledText("");if(i.push(l),!(a instanceof Ae)){l.data=a;continue}let c=this.content.modules.createExpressionModule(this.applicationContext,a,l,this.values);this.content.linkExpressionModule(c),this.content.linkAttributeExpression(c,r)}this.content.linkAttributeNodes(r,n,i);continue}n.setAttribute(r.name,r.values.toString())}this.content.insert(n,"BottomOf",t),this.buildTemplate(e.childList,n)}buildTemplate(e,t){for(let n of e)n instanceof ye?this.buildTemplate(n.body,t):n instanceof Ge?this.buildTextTemplate(n,t):n instanceof pt?this.buildInstructionTemplate(n,t):n instanceof Ve&&this.buildStaticTemplate(n,t)}buildTextTemplate(e,t){for(let n of e.values){if(typeof n=="string"){this.content.insert(this.createZoneEnabledText(n),"BottomOf",t);continue}let r=this.createZoneEnabledText("");this.content.insert(r,"BottomOf",t);let o=this.content.modules.createExpressionModule(this.applicationContext,n,r,this.values);this.content.linkExpressionModule(o)}}}});var sn,Br=p(()=>{sn=class{mHtmlElement;mShadowRoot;get htmlElement(){return this.mHtmlElement}get shadowRoot(){return this.mShadowRoot}constructor(e){this.mHtmlElement=e,this.mShadowRoot=this.mHtmlElement.attachShadow({mode:"open"})}}});var K,Ie=p(()=>{Vn();K=class{mDataLevel;get data(){return this.mDataLevel}constructor(e){this.mDataLevel=e}createExpressionProcedure(e,t){return new ct(e,this.data,t??[])}}});var Ye,Kn=p(()=>{Nt();Lr();Ie();Ye=class extends Mt{constructor(e){super({applicationContext:e.applicationContext,constructor:e.constructor,loggingType:2,parent:e.parent,isolate:!1,trigger:e.trigger,trackConstructorChanges:!1}),this.setProcessorAttributes(K,new K(e.values)),this.addSetupHook(()=>{let t=this.processor})}deconstruct(){super.deconstruct(),this.call("onDeconstruct",!1)}}});var J,_e=p(()=>{J=class{mValue;get value(){return this.mValue}constructor(e){this.mValue=e}}});var ee,je=p(()=>{L();ee=class{constructor(){throw new f("Reference should not be instanced.",this)}}});var xe,mt=p(()=>{L();xe=class{constructor(){throw new f("Reference should not be instanced.",this)}}});var qe,Xn=p(()=>{Kn();_e();je();mt();qe=class s extends Ye{mLastResult;mTargetTextNode;constructor(e){super({applicationContext:e.applicationContext,constructor:e.constructor,parent:e.parent,trigger:e.trigger,values:e.values}),this.mTargetTextNode=e.targetNode,this.mLastResult=null,this.setProcessorAttributes(s,this),this.setProcessorAttributes(xe,e.targetTemplate.clone()),this.setProcessorAttributes(ee,e.targetNode),this.setProcessorAttributes(J,new J(e.targetTemplate.value))}onUpdate(){let e=this.call("onUpdate",!0);e===null&&(e="");let t=this.mLastResult===null||this.mLastResult!==e;if(t){let n=this.mTargetTextNode;n.data=e,this.mLastResult=e}return t}}});function Gr(s){return(e,t)=>{C.registerInjectable(e,t.metadata,"instanced"),he.register(qe,e,{trigger:s.trigger})}}var Vr=p(()=>{W();lt();Xn()});var Oi,jr,Yc,ht,Fi=p(()=>{W();ae();Ie();re();Vr();_e();Oi=[Gr({trigger:111})];ht=class extends(Yc=P){mProcedure;constructor(e=C.use(K),t=C.use(J)){super(),this.mProcedure=e.createExpressionProcedure(t.value)}onUpdate(){let e=this.mProcedure.execute();return typeof e>"u"?null:e?.toString()}};jr=E(Yc),ht=m(jr,0,"MustacheExpressionModule",Oi,ht),u(jr,1,ht)});var fe,yt=p(()=>{fe=class{mName;mValue;get name(){return this.mName}get value(){return this.mValue}constructor(e,t){this.mName=e,this.mValue=t}}});var ce,ft=p(()=>{Kn();yt();je();mt();ce=class s extends Ye{mAccessMode;get accessMode(){return this.mAccessMode}constructor(e){super({applicationContext:e.applicationContext,constructor:e.constructor,parent:e.parent,trigger:e.trigger,values:e.values}),this.mAccessMode=e.accessMode,this.setProcessorAttributes(s,this),this.setProcessorAttributes(xe,e.targetTemplate.clone()),this.setProcessorAttributes(ee,e.targetNode),this.setProcessorAttributes(fe,new fe(e.targetTemplate.name,e.targetTemplate.values.toString()))}onUpdate(){return this.call("onUpdate",!0)??!1}}});var ge,gt=p(()=>{L();ge=class{mElementList;get elementList(){return _.newListWith(...this.mElementList)}constructor(){this.mElementList=new Array}addElement(e,t){if(this.mElementList.findIndex(r=>r.template===e||r.dataLevel===t)===-1)this.mElementList.push({template:e,dataLevel:t});else throw new f("Can't add same template or values for multiple Elements.",this)}}});var Je,Wn=p(()=>{Kn();_e();mt();gt();Je=class s extends Ye{mLastResult;get instructionResult(){return this.mLastResult}constructor(e){super({applicationContext:e.applicationContext,constructor:e.constructor,parent:e.parent,trigger:e.trigger,values:e.values}),this.setProcessorAttributes(s,this),this.setProcessorAttributes(xe,e.targetTemplate.clone()),this.setProcessorAttributes(J,new J(e.targetTemplate.instruction)),this.mLastResult=new ge}onUpdate(){let e=this.call("onUpdate",!0);return e instanceof ge?(this.mLastResult=e,!0):!1}}});var Zn,Bi=p(()=>{L();Fi();lt();ft();Xn();Wn();Zn=class s{static mAttributeModuleCache=new A;static mExpressionModuleCache=new WeakMap;static mInstructionModuleCache=new A;mComponent;mExpressionModule;constructor(e,t){this.mExpressionModule=t??ht,this.mComponent=e}createAttributeModule(e,t,n,r){let o=(()=>{let i=s.mAttributeModuleCache.get(t.name);if(i||i===null)return i;for(let a of he.get(ce))if(a.processorConfiguration.selector.test(t.name))return s.mAttributeModuleCache.set(t.name,a),a;return s.mAttributeModuleCache.set(t.name,null),null})();return o===null?null:new ce({applicationContext:e,accessMode:o.processorConfiguration.access,constructor:o.processorConstructor,parent:this.mComponent,targetNode:n,targetTemplate:t,values:r,trigger:o.processorConfiguration.trigger}).setup()}createExpressionModule(e,t,n,r){let o=(()=>{let i=s.mExpressionModuleCache.get(this.mExpressionModule);if(i)return i;let a=he.get(qe).find(l=>l.processorConstructor===this.mExpressionModule);if(!a)throw new f("An expression module could not be found.",this);return s.mExpressionModuleCache.set(this.mExpressionModule,a),a})();return new qe({applicationContext:e,constructor:o.processorConstructor,parent:this.mComponent,targetNode:n,targetTemplate:t,values:r,trigger:o.processorConfiguration.trigger}).setup()}createInstructionModule(e,t,n){let r=(()=>{let o=s.mInstructionModuleCache.get(t.instructionType);if(o)return o;for(let i of he.get(Je))if(i.processorConfiguration.instructionType===t.instructionType)return s.mInstructionModuleCache.set(t.instructionType,i),i;throw new f(`Instruction module type "${t.instructionType}" not found.`,this)})();return new Je({applicationContext:e,constructor:r.processorConstructor,parent:this.mComponent,targetTemplate:t,values:n,trigger:r.processorConfiguration.trigger}).setup()}}});var bt,Yn=p(()=>{L();bt=class extends f{mColumnEnd;mColumnStart;mLineEnd;mLineStart;get columnEnd(){return this.mColumnEnd}get columnStart(){return this.mColumnStart}get lineEnd(){return this.mLineEnd}get lineStart(){return this.mLineStart}constructor(e,t,n,r,o,i,a){super(e,t,a),this.mColumnStart=n,this.mLineStart=r,this.mColumnEnd=o,this.mLineEnd=i}}});var Gt,Ur=p(()=>{L();Gt=class{mDependencyFetch;mDependencyFetchResolved;mLexer;mMeta;mPattern;mPatternDependencies;mType;get dependencies(){return this.mPatternDependencies}get dependenciesResolved(){return this.mDependencyFetchResolved}get lexer(){return this.mLexer}get meta(){return this.mMeta}get pattern(){return this.mPattern}constructor(e,t){if(this.mLexer=e,this.mType=t.type,this.mMeta=t.metadata,this.mPatternDependencies=new Array,this.mDependencyFetch=t.dependencyFetch??null,this.mDependencyFetchResolved=!t.dependencyFetch,this.mType==="split"&&!this.mDependencyFetch)throw new f("Split token with a start and end token, need inner token definitions.",this);if(this.mType==="single"&&this.mDependencyFetch)throw new f("Pattern does not allow inner token pattern.",this);this.mPattern=this.convertTokenPattern(this.mType,t.pattern)}isSplit(){return this.mType==="split"}resolveDependencies(){this.mDependencyFetchResolved||(this.mDependencyFetch(this),this.mDependencyFetchResolved=!0)}useChildPattern(e){if(this.mLexer!==e.lexer)throw new f("Can only add dependencies of the same lexer.",this);this.mPatternDependencies.push(e)}convertTokenPattern(e,t){if("single"in t){if(e==="split")throw new f("Can't use split pattern type with single pattern definition.",this);return{start:{regex:t.single.regex,types:t.single.types,validator:t.single.validator??null}}}else{if(e==="single")throw new f("Can't use single pattern type with split pattern definition.",this);return{start:{regex:t.start.regex,types:t.start.types,validator:t.start.validator??null},end:{regex:t.end.regex,types:t.end.types,validator:t.end.validator??null},innerType:t.innerType??null}}}}});var Vt,$r=p(()=>{Vt=class{mColumnNumber;mLineNumber;mMetas;mType;mValue;get columnNumber(){return this.mColumnNumber}get lineNumber(){return this.mLineNumber}get metas(){return[...this.mMetas]}get type(){return this.mType}get value(){return this.mValue}constructor(e,t,n,r){this.mValue=t,this.mColumnNumber=n,this.mLineNumber=r,this.mType=e,this.mMetas=new Set}addMeta(...e){for(let t of e)this.mMetas.add(t)}hasMeta(e){return this.mMetas.has(e)}}});var an,Gi=p(()=>{L();Yn();Ur();$r();an=class{mRootPattern;mSettings;get errorType(){return this.mSettings.errorType}set errorType(e){this.mSettings.errorType=e}get trimWhitespace(){return this.mSettings.trimSpaces}set trimWhitespace(e){this.mSettings.trimSpaces=e}get validWhitespaces(){return[...this.mSettings.whiteSpaces].join("")}set validWhitespaces(e){this.mSettings.whiteSpaces=new Set(e.split(""))}constructor(){this.mSettings={errorType:null,trimSpaces:!0,whiteSpaces:new Set},this.mRootPattern=new Gt(this,{type:"single",pattern:{single:{regex:/^/,types:{},validator:null}},metadata:[],dependencyFetch:null})}createTokenPattern(e,t){let n=a=>typeof a=="string"?{token:a}:a,r=a=>{let l=new Set(a.flags.split(""));return new RegExp(`^(?<token>${a.source})`,[...l].join(""))},o=new Array;e.meta&&(typeof e.meta=="string"?o.push(e.meta):o.push(...e.meta));let i;return"regex"in e.pattern?i={single:{regex:r(e.pattern.regex),types:n(e.pattern.type),validator:e.pattern.validator??null}}:i={start:{regex:r(e.pattern.start.regex),types:n(e.pattern.start.type),validator:e.pattern.start.validator??null},end:{regex:r(e.pattern.end.regex),types:n(e.pattern.end.type),validator:e.pattern.end.validator??null},innerType:e.pattern.innerType??null},new Gt(this,{type:"regex"in e.pattern?"single":"split",pattern:i,metadata:o,dependencyFetch:t??null})}*tokenize(e,t){let n={data:e,cursor:{position:0,column:1,line:1},error:null,progressTracker:t??null};yield*this.tokenizeRecursionLayer(n,this.mRootPattern,new Array,null)}useRootTokenPattern(e){if(e.lexer!==this)throw new f("Token pattern must be created by this lexer.",this);this.mRootPattern.useChildPattern(e)}findNextStartToken(e,t,n,r){for(let o of t){let i=o.pattern.start,a=this.matchToken(o,i,e,n,r);if(a!==null)return{pattern:o,token:a}}return null}findTokenTypeOfMatch(e,t,n){for(let i in e.groups){let a=e.groups[i],l=t[i];if(!(!a||!l)){if(a.length!==e[0].length)throw new f("A group of a token pattern must match the whole token.",this);return l}}let r=new Array;for(let i in e.groups)e.groups[i]&&r.push(i);let o=new Array;for(let i in t)o.push(i);throw new f(`No token type found for any defined pattern regex group. Full: "${e[0]}", Matches: "${r.join(", ")}", Available: "${o.join(", ")}", Regex: "${n.source}"`,this)}*generateErrorToken(e,t){if(!e.error||!this.mSettings.errorType)return;let n=new Vt(this.mSettings.errorType,e.error.data,e.error.startColumn,e.error.startLine);n.addMeta(...t),e.error=null,yield n}generateToken(e,t,n,r,o,i){let a=n[0],l=this.findTokenTypeOfMatch(n,r,i),c=new Vt(o??l,a,e.cursor.column,e.cursor.line);return c.addMeta(...t),c}matchToken(e,t,n,r,o){let i=t.regex;i.lastIndex=0;let a=i.exec(n.data);if(!a||a.index!==0)return null;let l=this.generateToken(n,[...r,...e.meta],a,t.types,o,i);if(t.validator){let c=n.data.substring(l.value.length);if(!t.validator(l,c,n.cursor.position))return null}return this.moveCursor(n,l.value),l}moveCursor(e,t){let n=t.split(`
`);n.length>1&&(e.cursor.column=1),e.cursor.line+=n.length-1,e.cursor.column+=n.at(-1).length,e.cursor.position+=t.length,e.data=e.data.substring(t.length),this.trackProgress(e)}pushNextCharToErrorState(e){if(!this.mSettings.errorType)throw new bt(`Unable to parse next token. No valid pattern found for "${e.data.substring(0,20)}".`,this,e.cursor.column,e.cursor.line,e.cursor.column,e.cursor.line);e.error||(e.error={data:"",startColumn:e.cursor.column,startLine:e.cursor.line});let t=e.data.charAt(0);e.error.data+=t,this.moveCursor(e,t)}skipNextWhitespace(e){let t=e.data.charAt(0);return!this.mSettings.trimSpaces||!this.mSettings.whiteSpaces.has(t)?!1:(this.moveCursor(e,t),!0)}*tokenizeRecursionLayer(e,t,n,r){let o=t.dependencies;for(;e.data.length>0;){if(!e.error&&this.skipNextWhitespace(e))continue;if(t.isSplit()){let l=this.matchToken(t,t.pattern.end,e,n,r);if(l!==null){yield*this.generateErrorToken(e,n),yield l;return}}let i=this.findNextStartToken(e,o,n,r);if(!i){this.pushNextCharToErrorState(e);continue}yield*this.generateErrorToken(e,n),yield i.token;let a=i.pattern;a.isSplit()&&(a.resolveDependencies(),yield*this.tokenizeRecursionLayer(e,a,[...n,...a.meta],r??a.pattern.innerType))}yield*this.generateErrorToken(e,n)}trackProgress(e){e.progressTracker!==null&&e.progressTracker(e.cursor.position,e.cursor.line,e.cursor.column)}}});var Z,zr=p(()=>{Z=class extends Error{static PARSER_ERROR=Symbol("PARSER_ERROR");mTrace;get columnEnd(){return this.mTrace.top.range.columnEnd}get columnStart(){return this.mTrace.top.range.columnStart}get graph(){return this.mTrace.top.graph}get incidents(){return this.mTrace.incidents}get lineEnd(){return this.mTrace.top.range.lineEnd}get lineStart(){return this.mTrace.top.range.lineStart}constructor(e){super(e.top.message,{cause:e.top.cause}),this.mTrace=e}}});var _n,Vi=p(()=>{L();_n=class{mIncidents;mTop;get incidents(){if(this.mIncidents===null)throw new f("A complete incident list is only available on debug mode.",this);return this.mIncidents}get top(){return this.mTop}constructor(e){this.mTop={message:"Unknown parser error",priority:0,graph:null,range:{lineStart:1,columnStart:1,lineEnd:1,columnEnd:1},cause:null},e?this.mIncidents=new Array:this.mIncidents=null}push(e,t,n,r,o,i,a=!1,l=null){let c;if(a?c=this.mTop.priority+1:c=o*1e4+i,this.mIncidents!==null){let h={message:e,priority:c,graph:t,range:{lineStart:n,columnStart:r,lineEnd:o,columnEnd:i},cause:l};this.mIncidents.push(h)}this.mTop&&c<this.mTop.priority||this.setTop({message:e,priority:c,graph:t,range:{lineStart:n,columnStart:r,lineEnd:o,columnEnd:i},cause:l})}setTop(e){this.mTop=e}}});var qn,ji=p(()=>{L();Vi();qn=class s{static MAX_JUNCTION_CIRCULAR_REFERENCES=1e3;mGraphStack;mIncidentTrace;mLastTokenPosition;mProcessStack;mTokenCache;mTokenGenerator;mTrimTokenCache;get currentGraph(){return this.mGraphStack.top.graph}get currentToken(){let e=this.mGraphStack.top;return this.mTokenCache[e.token.cursor]}get incidentTrace(){return this.mIncidentTrace}get processStack(){return this.mProcessStack}constructor(e,t,n){this.mTokenGenerator=e,this.mGraphStack=new Pe,this.mLastTokenPosition={column:1,line:1},this.mTokenCache=new Array,this.mProcessStack=new Pe,this.mTrimTokenCache=n,this.mIncidentTrace=new _n(t),this.mGraphStack.push({graph:null,linear:!0,circularGraphs:new A,token:{start:0,cursor:-1}})}collapse(){let e=this.mGraphStack.top,t=this.mTokenCache.slice(e.token.cursor);t.length!==0&&t.at(-1)===null&&t.pop();for(let n of this.mTokenGenerator)t.push(n);return t}getGraphBoundingToken(){let e=this.mGraphStack.top,t=this.mTokenCache[e.token.start],n=this.mTokenCache[e.token.cursor-1];return t??=n,n??=t,[t??null,n??null]}getGraphPosition(){let e=this.mGraphStack.top,t,n;if(t=this.mTokenCache[e.token.start],n=this.mTokenCache[e.token.cursor-1],t??=n,n??=t,!t||!n)return{graph:e.graph,columnEnd:this.mLastTokenPosition.column,columnStart:this.mLastTokenPosition.column,lineEnd:this.mLastTokenPosition.line,lineStart:this.mLastTokenPosition.line};let r,o;if(n.value.includes(`
`)){let i=n.value.split(`
`);o=n.lineNumber+i.length-1,r=1+i[i.length-1].length}else r=n.columnNumber+n.value.length,o=n.lineNumber;return{graph:e.graph,lineStart:t.lineNumber,columnStart:t.columnNumber,lineEnd:o,columnEnd:r}}getTokenPosition(){let e=this.mGraphStack.top,t=this.currentToken;if(!t)return{graph:e.graph,columnEnd:this.mLastTokenPosition.column,columnStart:this.mLastTokenPosition.column,lineEnd:this.mLastTokenPosition.line,lineStart:this.mLastTokenPosition.line};let n,r;if(t.value.includes(`
`)){let o=t.value.split(`
`);r=t.lineNumber+o.length-1,n=1+o[o.length-1].length}else n=t.columnNumber+t.value.length,r=t.lineNumber;return{graph:e.graph,lineStart:t.lineNumber,columnStart:t.columnNumber,lineEnd:r,columnEnd:n}}graphIsCircular(e){let t=this.mGraphStack.top;if(!t.circularGraphs.has(e))return!1;if(e.isJunction){if(t.circularGraphs.get(e)>s.MAX_JUNCTION_CIRCULAR_REFERENCES)throw new f("Junction graph called circular too often.",this);return!1}return!0}moveNextToken(){let e=this.mGraphStack.top;if(e.circularGraphs.size>0&&(e.circularGraphs=new A),e.graph&&e.graph.isJunction)throw new f("Junction graph must not have own nodes.",this);if(e.token.cursor++,e.token.cursor<this.mTokenCache.length)return;let t=this.mTokenGenerator.next();if(t.done){this.mTokenCache.push(null);return}this.mLastTokenPosition.column=t.value.columnNumber,this.mLastTokenPosition.line=t.value.lineNumber,this.mTokenCache.push(t.value)}popGraphStack(e){let t=this.mGraphStack.pop(),n=this.mGraphStack.top;if(e&&(t.token.cursor=t.token.start),t.token.cursor!==t.token.start&&n.circularGraphs.size>0&&(n.circularGraphs=new A),!this.mTrimTokenCache){n.token.cursor=t.token.cursor;return}t.linear?(this.mTokenCache.splice(0,t.token.cursor),n.token.start=0,n.token.cursor=0):n.token.cursor=t.token.cursor}pushGraphStack(e,t){let n=this.mGraphStack.top,r={graph:e,linear:t&&n.linear,circularGraphs:new A(n.circularGraphs),token:{start:n.token.cursor,cursor:n.token.cursor}},o=r.circularGraphs.get(e)??0;r.circularGraphs.set(e,o+1),this.mGraphStack.push(r)}}});var ln,Ui=p(()=>{L();Yn();zr();ji();ln=class s{static NODE_NULL_RESULT=Symbol("FAILED_NODE_VALUE_PARSE");static NODE_VALUE_LIST_END_MEET=Symbol("FAILED_NODE_VALUE_PARSE");mConfiguration;mLexer;mRootPart;get lexer(){return this.mLexer}constructor(e,t){this.mLexer=e,this.mRootPart=null,this.mConfiguration={keepTraceIncidents:!1,trimTokenCache:!1,...t}}parse(e,t){if(this.mRootPart===null)throw new f("Parser has not root part set.",this);let n=new qn(this.mLexer.tokenize(e,t),this.mConfiguration.keepTraceIncidents,this.mConfiguration.trimTokenCache),r=(()=>{try{return this.beginParseProcess(n,this.mRootPart)}catch(i){if(i instanceof bt)return n.incidentTrace.push(i.message,n.currentGraph,i.lineStart,i.columnStart,i.lineEnd,i.columnEnd,!0,i),Z.PARSER_ERROR;let a=i instanceof Error?i.message:i.toString(),l=n.getGraphPosition();return n.incidentTrace.push(a,n.currentGraph,l.lineStart,l.columnStart,l.lineEnd,l.columnEnd,!0,i),Z.PARSER_ERROR}})();if(r===Z.PARSER_ERROR)throw new Z(n.incidentTrace);let o=n.collapse();if(o.length!==0){let i=o[0];if(n.incidentTrace.top.range.lineEnd===1&&n.incidentTrace.top.range.columnEnd===1){let a=`Tokens could not be parsed. Graph end meet without reaching last token. Current: "${i.value}" (${i.type})`;n.incidentTrace.push(a,this.mRootPart,i.lineNumber,i.columnNumber,i.lineNumber,i.columnNumber)}throw new Z(n.incidentTrace)}return r}setRootGraph(e){this.mRootPart=e}beginParseProcess(e,t){e.moveNextToken(),e.processStack.push({type:"graph-parse",parameter:{graph:t,linear:!0},state:0});let n=s.NODE_NULL_RESULT;for(;e.processStack.top;)n=this.processStack(e,e.processStack.top,n);return n}processChainedNodeParseProcess(e,t,n){switch(t.state){case 0:{let i=t.parameter.node.connections.next;return i===null?(e.processStack.pop(),{}):(t.state++,e.processStack.push({type:"node-parse",parameter:{node:i},state:0,values:{}}),s.NODE_NULL_RESULT)}case 1:{let r=n;return r===Z.PARSER_ERROR?(e.processStack.pop(),Z.PARSER_ERROR):(e.processStack.pop(),r)}}throw new f(`Invalid node next parse state "${t.state}".`,this)}processGraphParseProcess(e,t,n){let r=t.parameter.graph;switch(t.state){case 0:{if(e.graphIsCircular(r)){let i=e.getGraphPosition();return e.incidentTrace.push("Circular graph detected.",r,i.lineStart,i.columnStart,i.lineEnd,i.columnEnd),e.processStack.pop(),Z.PARSER_ERROR}let o=t.parameter.linear;return e.pushGraphStack(r,o),t.state++,e.processStack.push({type:"node-parse",parameter:{node:r.node},state:0,values:{}}),s.NODE_NULL_RESULT}case 1:{let o=n;if(o===Z.PARSER_ERROR)return e.popGraphStack(!0),e.processStack.pop(),Z.PARSER_ERROR;let i=r.convert(o,e);if(typeof i=="symbol"){let a=e.getGraphPosition();return e.incidentTrace.push(i.description??"Unknown data convert error",a.graph,a.lineStart,a.columnStart,a.lineEnd,a.columnEnd),e.popGraphStack(!0),e.processStack.pop(),Z.PARSER_ERROR}return e.popGraphStack(!1),e.processStack.pop(),i}}throw new f(`Invalid graph parse state "${t.state}".`,this)}processNodeParseProcess(e,t,n){let r=t.parameter.node;switch(t.state){case 0:return e.processStack.push({type:"node-value-parse",parameter:{node:r,valueIndex:0},state:0,values:{}}),t.state++,s.NODE_NULL_RESULT;case 1:{let o=n;return o===Z.PARSER_ERROR?(e.processStack.pop(),Z.PARSER_ERROR):(t.values.nodeValueResult=o,e.processStack.push({type:"node-next-parse",parameter:{node:r},state:0}),t.state++,s.NODE_NULL_RESULT)}case 2:{let o=n;if(o===Z.PARSER_ERROR)return e.processStack.pop(),Z.PARSER_ERROR;let i=r.mergeData(t.values.nodeValueResult,o);return e.processStack.pop(),i}}throw new f(`Invalid node parse state "${t.state}".`,this)}processNodeValueParseProcess(e,t,n){let r=t.parameter.node;switch(t.state){case 0:{if(n!==s.NODE_NULL_RESULT&&n!==Z.PARSER_ERROR)return t.values.parseResult=n,t.state++,s.NODE_NULL_RESULT;let o=t.parameter.valueIndex,i=r.connections;if(o>=i.values.length)return t.values.parseResult=s.NODE_VALUE_LIST_END_MEET,t.state++,s.NODE_NULL_RESULT;t.parameter.valueIndex++;let a=e.currentToken,l=i.values[o];if(typeof l=="string"){if(!a){if(i.required){let c=e.getTokenPosition();e.incidentTrace.push(`Unexpected end of statement. Token "${l}" expected.`,e.currentGraph,c.lineStart,c.columnStart,c.lineEnd,c.columnEnd)}return s.NODE_NULL_RESULT}if(l!==a.type){if(i.required){let c=e.getTokenPosition();e.incidentTrace.push(`Unexpected token "${a.value}". "${l}" expected`,e.currentGraph,c.lineStart,c.columnStart,c.lineEnd,c.columnEnd)}return s.NODE_NULL_RESULT}return e.moveNextToken(),a.value}else{let c=i.values.length===1||i.values.length===o+1;return e.processStack.push({type:"graph-parse",parameter:{graph:l,linear:c},state:0}),s.NODE_NULL_RESULT}}case 1:{let o=t.values.parseResult,i=r.connections;if(o===s.NODE_VALUE_LIST_END_MEET&&!i.required){e.processStack.pop();return}return o===s.NODE_VALUE_LIST_END_MEET?(e.processStack.pop(),Z.PARSER_ERROR):(e.processStack.pop(),o)}}throw new f(`Invalid node value parse state "${t.state}".`,this)}processStack(e,t,n){switch(t.type){case"graph-parse":return this.processGraphParseProcess(e,t,n);case"node-parse":return this.processNodeParseProcess(e,t,n);case"node-value-parse":return this.processNodeValueParseProcess(e,t,n);case"node-next-parse":return this.processChainedNodeParseProcess(e,t,n)}}}});var q,Hr=p(()=>{q=class s{static define(e,t=!1){return new s(e,t)}mDataConverterList;mGraphCollector;mIsJunction;mResolvedGraphNode;get isJunction(){return this.mIsJunction}get node(){return this.mResolvedGraphNode||(this.mResolvedGraphNode=this.mGraphCollector().root),this.mResolvedGraphNode}constructor(e,t){this.mGraphCollector=e,this.mDataConverterList=new Array,this.mResolvedGraphNode=null,this.mIsJunction=t}convert(e,t){if(this.mDataConverterList.length===0)return e;let n=t.getGraphBoundingToken(),r=n[0]??void 0,o=n[1]??void 0;if(this.mDataConverterList.length===1)return this.mDataConverterList[0](e,r,o);let i=e;for(let a of this.mDataConverterList)if(i=a(i,r,o),typeof i=="symbol")return i;return i}converter(e){let t=new s(this.mGraphCollector,this.isJunction);return t.mDataConverterList.push(...this.mDataConverterList,e),t}}});var V,$i=p(()=>{L();Hr();V=class s{static new(){let e=new s("",!1,[]);return e.mRootNode=null,e}mConnections;mIdentifier;mRootNode;get configuration(){return{dataKey:this.mIdentifier.dataKey,isList:this.mIdentifier.type==="list",isRequired:this.mConnections.required,isBranch:this.mConnections.values.length>1}}get connections(){return this.mConnections}get root(){if(!this.mRootNode)throw new f("Staring nodes must be chained with another node to be used.",this);return this.mRootNode}constructor(e,t,n,r){if(e==="")this.mIdentifier={type:"empty",dataKey:"",mergeKey:""};else if(e.endsWith("[]"))this.mIdentifier={type:"list",mergeKey:"",dataKey:e.substring(0,e.length-2)};else if(e.includes("<-")){let i=e.split("<-");this.mIdentifier={type:"merge",dataKey:i[0],mergeKey:i[1]}}else this.mIdentifier={type:"single",mergeKey:"",dataKey:e};let o=n.map(i=>i instanceof s?q.define(()=>i):i);this.mConnections={required:t,values:o,next:null},r?this.mRootNode=r:this.mRootNode=this}mergeData(e,t){if(this.mIdentifier.type==="empty")return t;let n=t,r=typeof e>"u";if(this.mIdentifier.type==="single"){if(this.mIdentifier.dataKey in t)throw new f(`Graph path has a duplicate value identifier "${this.mIdentifier.dataKey}"`,this);return r||(n[this.mIdentifier.dataKey]=e),t}if(this.mIdentifier.type==="list"){let a;r?a=new Array:Array.isArray(e)?a=e:a=[e];let l=(()=>{if(this.mIdentifier.dataKey in t){let c=n[this.mIdentifier.dataKey];return Array.isArray(c)?(c.unshift(...a),c):(a.push(c),a)}return a})();return n[this.mIdentifier.dataKey]=l,t}if(r)return t;let o=(()=>{if(!this.mIdentifier.mergeKey)throw new f("Cant merge data without a merge key.",this);if(typeof e!="object"||e===null)throw new f("Node data must be an object when merge key is set.",this);if(!(this.mIdentifier.mergeKey in e))throw new f(`Node data does not contain merge key "${this.mIdentifier.mergeKey}"`,this);return e[this.mIdentifier.mergeKey]})();if(typeof o>"u")return t;let i=n[this.mIdentifier.dataKey];if(typeof i>"u")return n[this.mIdentifier.dataKey]=o,n;if(!Array.isArray(i))throw new f("Chain data merge value is not an array but should be.",this);return Array.isArray(o)?i.unshift(...o):i.unshift(o),t}optional(e,t){let n=typeof t>"u"?"":e,r=typeof t>"u"?e:t,o=new Array;Array.isArray(r)?o.push(...r):o.push(r);let i=new s(n,!1,o,this.mRootNode);return this.setChainedNode(i),i}required(e,t){let n=typeof t>"u"?"":e,r=typeof t>"u"?e:t,o=new Array;Array.isArray(r)?o.push(...r):o.push(r);let i=new s(n,!0,o,this.mRootNode);return this.setChainedNode(i),i}setChainedNode(e){if(this.mConnections.next!==null)throw new f("Node can only be chained to a single node.",this);this.mConnections.next=e}}});var zi=p(()=>{Yn();Ur();$r();Gi();zr();Ui();$i();Hr()});var cn,Kr=p(()=>{L();zi();jn();nn();on();dt();tn();cn=class{mParser;constructor(){this.mParser=null}parse(e){if(!this.mParser){let t=this.createLexer();this.mParser=this.createParser(t)}return this.mParser.parse(e)}createLexer(){let e=new an;e.validWhitespaces=` 
\r`,e.trimWhitespace=!0;let t=e.createTokenPattern({pattern:{regex:/(?:(?!}}).)*/,type:"ExpressionValue"}}),n=e.createTokenPattern({pattern:{start:{regex:/{{/,type:"ExpressionStart"},end:{regex:/}}/,type:"ExpressionEnd"}}},v=>{v.useChildPattern(t)}),r=e.createTokenPattern({pattern:{regex:/[^>\s\n="/]+/,type:"Identifier"}}),o=e.createTokenPattern({pattern:{regex:/(?:(?!{{|"|<).)+/,type:"XmlValue"}}),i=e.createTokenPattern({pattern:{regex:/<!--.*?-->/,type:"XmlComment"}}),a=e.createTokenPattern({pattern:{regex:/=/,type:"XmlAssignment"}}),l=e.createTokenPattern({pattern:{start:{regex:/"/,type:"XmlExplicitValueIdentifier"},end:{regex:/"/,type:"XmlExplicitValueIdentifier"}}},v=>{v.useChildPattern(n),v.useChildPattern(o)}),c=e.createTokenPattern({pattern:{start:{regex:/<\//,type:"XmlOpenClosingBracket"},end:{regex:/>/,type:"XmlCloseBracket"}}},v=>{v.useChildPattern(r)}),h=e.createTokenPattern({pattern:{start:{regex:/</,type:"XmlOpenBracket"},end:{regex:/(?<closeClosingBracket>\/>)|(?<closeBracket>>)/,type:{closeClosingBracket:"XmlCloseClosingBracket",closeBracket:"XmlCloseBracket"}}}},v=>{v.useChildPattern(a),v.useChildPattern(r),v.useChildPattern(l)}),d=e.createTokenPattern({pattern:{regex:/[^()"'`/)]+/,type:"InstructionInstructionValue"}}),y=e.createTokenPattern({pattern:{innerType:"InstructionInstructionValue",start:{regex:/\//,type:"InstructionInstructionValue"},end:{regex:/\//,type:"InstructionInstructionValue"}}},v=>{v.useChildPattern(N),v.useChildPattern(I),v.useChildPattern(T),v.useChildPattern(b),v.useChildPattern(d)}),b=e.createTokenPattern({pattern:{innerType:"InstructionInstructionValue",start:{regex:/\(/,type:"InstructionInstructionValue"},end:{regex:/\)/,type:"InstructionInstructionValue"}}},v=>{v.useChildPattern(y),v.useChildPattern(N),v.useChildPattern(I),v.useChildPattern(T),v.useChildPattern(d)}),N=e.createTokenPattern({pattern:{innerType:"InstructionInstructionValue",start:{regex:/"/,type:"InstructionInstructionValue"},end:{regex:/"/,type:"InstructionInstructionValue"}}},v=>{v.useChildPattern(y),v.useChildPattern(I),v.useChildPattern(T),v.useChildPattern(b),v.useChildPattern(d)}),I=e.createTokenPattern({pattern:{innerType:"InstructionInstructionValue",start:{regex:/'/,type:"InstructionInstructionValue"},end:{regex:/'/,type:"InstructionInstructionValue"}}},v=>{v.useChildPattern(y),v.useChildPattern(N),v.useChildPattern(T),v.useChildPattern(b),v.useChildPattern(d)}),T=e.createTokenPattern({pattern:{innerType:"InstructionInstructionValue",start:{regex:/`/,type:"InstructionInstructionValue"},end:{regex:/`/,type:"InstructionInstructionValue"}}},v=>{v.useChildPattern(y),v.useChildPattern(N),v.useChildPattern(I),v.useChildPattern(b),v.useChildPattern(d)}),w=e.createTokenPattern({pattern:{regex:/\$[^(\s\n/{]+/,type:"InstructionStart"}}),D=e.createTokenPattern({pattern:{start:{regex:/\(/,type:"InstructionInstructionOpeningBracket"},end:{regex:/\)/,type:"InstructionInstructionClosingBracket"}}},v=>{v.useChildPattern(y),v.useChildPattern(N),v.useChildPattern(I),v.useChildPattern(T),v.useChildPattern(b),v.useChildPattern(d)}),F=e.createTokenPattern({pattern:{start:{regex:/{/,type:"InstructionBodyStartBraket"},end:{regex:/}/,type:"InstructionBodyCloseBraket"}}},v=>{for(let it of X)v.useChildPattern(it)}),X=[i,c,h,l,n,w,D,F,o];for(let v of X)e.useRootTokenPattern(v);return e}createParser(e){let t=new ln(e),n=q.define(()=>V.new().required("ExpressionStart").optional("value","ExpressionValue").required("ExpressionEnd")).converter(T=>{let w=new Ae;return w.value=T.value??"",w}),r=q.define(()=>{let T=r;return V.new().required("data[]",V.new().required("value",[n,V.new().required("text","XmlValue")])).optional("data<-data",T)}),o=q.define(()=>V.new().required("name","Identifier").optional("attributeValue",V.new().required("XmlAssignment").required("XmlExplicitValueIdentifier").optional("list<-data",r).required("XmlExplicitValueIdentifier"))).converter(T=>{let w=new Array;if(T.attributeValue?.list)for(let D of T.attributeValue.list)D.value instanceof Ae?w.push(D.value):w.push(D.value.text);return{name:T.name,values:w}}),i=q.define(()=>{let T=i;return V.new().required("data[]",o).optional("data<-data",T)}),a=q.define(()=>{let T=a;return V.new().required("data[]",V.new().required("value",[n,V.new().required("text","XmlValue"),V.new().required("XmlExplicitValueIdentifier").required("text","XmlValue").required("XmlExplicitValueIdentifier")])).optional("data<-data",T)}),l=q.define(()=>V.new().required("list<-data",a)).converter(T=>{let w=new Ge;for(let D of T.list)D.value instanceof Ae?w.addValue(D.value):w.addValue(D.value.text);return w}),c=q.define(()=>V.new().required("XmlComment")).converter(()=>null),h=q.define(()=>V.new().required("XmlOpenBracket").required("openingTagName","Identifier").optional("attributes<-data",i).required("closing",[V.new().required("XmlCloseClosingBracket"),V.new().required("XmlCloseBracket").required("values",N).required("XmlOpenClosingBracket").required("closingTageName","Identifier").required("XmlCloseBracket")])).converter(T=>{if("closingTageName"in T.closing&&T.openingTagName!==T.closing.closingTageName)throw new f(`Opening (${T.openingTagName}) and closing tagname (${T.closing.closingTageName}) does not match`,this);let w=new Ve;if(w.tagName=T.openingTagName,T.attributes)for(let D of T.attributes)w.setAttribute(D.name).addValue(...D.values);return"values"in T.closing&&w.appendChild(...T.closing.values),w}),d=q.define(()=>{let T=d;return V.new().required("list[]","InstructionInstructionValue").optional("list<-list",T)}),y=q.define(()=>V.new().required("instructionName","InstructionStart").optional("instruction",V.new().required("InstructionInstructionOpeningBracket").required("value<-list",d).required("InstructionInstructionClosingBracket")).optional("body",V.new().required("InstructionBodyStartBraket").required("value",N).required("InstructionBodyCloseBraket"))).converter(T=>{let w=new pt;return w.instructionType=T.instructionName.substring(1),w.instruction=T.instruction?.value.join("")??"",T.body&&w.appendChild(...T.body.value),w}),b=q.define(()=>{let T=b;return V.new().required("list[]",[c,h,y,l]).optional("list<-list",T)}),N=q.define(()=>{let T=b;return V.new().optional("list<-list",T)}).converter(T=>{let w=new Array;if(T.list)for(let D of T.list)D!==null&&w.push(D);return w}),I=q.define(()=>V.new().required("content",N)).converter(T=>{let w=new ye;return w.appendChild(...T.content),w});return t.setRootGraph(I),t}}});var Ce,Rt=p(()=>{L();Nt();Lr();Qt();ut();Nr();re();Fr();Br();Bi();At();Kr();Ce=class s extends Mt{static mTemplateCache=new A;static mXmlParser=new cn;mComponentElement;mRootBuilder;mUpdateMode;get element(){return this.mComponentElement.htmlElement}get updateMode(){return this.mUpdateMode}constructor(e){super({applicationContext:e.applicationContext,constructor:e.processorConstructor,loggingType:1,trigger:127,isolate:(e.updateMode&1)!==0,trackConstructorChanges:!0}),ie.registerComponent(this,e.htmlElement),this.addCreationHook(n=>{ie.registerComponent(this,this.mComponentElement.htmlElement,n)}).addCreationHook(n=>this.registerObject(n)).addCreationHook(n=>{ie.registerComponent(this,this.mComponentElement.htmlElement,n)});let t=s.mTemplateCache.get(e.processorConstructor);t?t=t.clone():(t=s.mXmlParser.parse(e.templateString??""),s.mTemplateCache.set(e.processorConstructor,t)),this.mUpdateMode=e.updateMode,this.mComponentElement=new sn(e.htmlElement),this.mRootBuilder=new Bt(this.applicationContext,t,new Zn(this,e.expressionModule),new ve(this),"ROOT"),this.mComponentElement.shadowRoot.appendChild(this.mRootBuilder.anchor),this.setProcessorAttributes(Se,new Se(this.mRootBuilder.values)),this.setProcessorAttributes(s,this),(e.updateMode&2)===0&&this.setAutoUpdate(127)}addStyle(e){let t=document.createElement("style");t.innerHTML=e,this.mComponentElement.shadowRoot.prepend(t)}attributeChanged(e,t,n){this.call("onAttributeChange",!1,e,t,n)}connected(){this.call("onConnect",!1)}deconstruct(){this.call("onDeconstruct",!1),this.mRootBuilder.deconstruct(),super.deconstruct()}disconnected(){this.call("onDisconnect",!1)}onUpdate(){return this.mRootBuilder.update()?(this.call("onUpdate",!1),!0):!1}}});function j(s){return $.enableGlobalTracing(qc(globalThis)),(e,t)=>{C.registerInjectable(e,t.metadata,"instanced"),ie.registerConstructor(e,s.selector);let n=class extends HTMLElement{mComponent;constructor(){super();let r=$.current.attachment(st.CONFIGURATION_ATTACHMENT);r||(r=Fe.DEFAULT),this.mComponent=new Ce({applicationContext:r,processorConstructor:e,templateString:s.template??null,expressionModule:s.expressionmodule,htmlElement:this,updateMode:s.updateScope??0}).setup(),s.style&&this.mComponent.addStyle(s.style),this.mComponent.update()}connectedCallback(){this.mComponent.connected()}disconnectedCallback(){this.mComponent.disconnected()}};globalThis.customElements.define(s.selector,n)}}var qc,Hi=p(()=>{W();_t();On();ue();Nr();At();Rt();qc=s=>{let e={target:s,patches:{requirements:{promise:s.Promise?.name,eventTarget:s.EventTarget?.name},classes:{eventTargets:new Array,callback:new Array},functions:new Array},errorHandling:!0},t=[s.requestAnimationFrame?.name,s.setInterval?.name,s.setTimeout?.name];e.patches.functions.push(...t.filter(o=>!!o));let n=[s.XMLHttpRequestEventTarget?.name,s.XMLHttpRequest?.name,s.Document?.name,s.SVGElement?.name,s.Element?.name,s.HTMLElement?.name,s.HTMLMediaElement?.name,s.HTMLFrameSetElement?.name,s.HTMLBodyElement?.name,s.HTMLFrameElement?.name,s.HTMLIFrameElement?.name,s.HTMLMarqueeElement?.name,s.Worker?.name,s.IDBRequest?.name,s.IDBOpenDBRequest?.name,s.IDBDatabase?.name,s.IDBTransaction?.name,s.WebSocket?.name,s.FileReader?.name,s.Notification?.name,s.RTCPeerConnection?.name];e.patches.classes.eventTargets.push(...n.filter(o=>!!o));let r=[s.ResizeObserver?.name,s.MutationObserver?.name,s.IntersectionObserver?.name];return e.patches.classes.callback.push(...r.filter(o=>!!o)),e}});var Ki=p(()=>{St()});function Tt(s){return(e,t)=>{C.registerInjectable(e,t.metadata,"instanced"),he.register(We,e,{access:s.access,trigger:s.trigger,targetRestrictions:s.targetRestrictions})}}var un=p(()=>{W();lt();Gn()});function Ue(s){return(e,t)=>{C.registerInjectable(e,t.metadata,"instanced"),he.register(ce,e,{access:s.access,selector:s.selector,trigger:s.trigger})}}var jt=p(()=>{W();lt();ft()});function $e(s){return(e,t)=>{C.registerInjectable(e,t.metadata,"instanced"),he.register(Je,e,{instructionType:s.instructionType,trigger:s.trigger})}}var Ut=p(()=>{W();lt();Wn()});var Xi,Xr,Jc,$t,pn,Jn=p(()=>{W();Rt();ae();De();re();un();Xi=[Tt({access:1,trigger:127,targetRestrictions:[Ce]})];$t=class $t extends(Jc=P){static METADATA_USER_EVENT_LISTENER_PROPERIES="pwb:user_event_listener_properties";mEventListenerList;mTargetElement;constructor(e=C.use(Ce)){super();let t=new Array,n=e.processorConstructor;do{let r=se.get(n).getMetadata($t.METADATA_USER_EVENT_LISTENER_PROPERIES);if(r)for(let o of r)t.push(o)}while(n=Object.getPrototypeOf(n));this.mEventListenerList=new Array,this.mTargetElement=e.element;for(let r of t){let[o,i]=r,a=Reflect.get(e.processor,o);a=a.bind(e.processor),this.mEventListenerList.push([i,a]),this.mTargetElement.addEventListener(i,a)}}onDeconstruct(){for(let e of this.mEventListenerList){let[t,n]=e;this.mTargetElement.removeEventListener(t,n)}}};Xr=E(Jc),$t=m(Xr,0,"ComponentEventListenerComponentExtension",Xi,$t),u(Xr,1,$t);pn=$t});var Wi=p(()=>{L();W();Jn()});var dn,Wr=p(()=>{dn=class extends window.Event{mValue;get value(){return this.mValue}constructor(e,t){super(e),this.mValue=t}}});var mn,Zr=p(()=>{Wr();mn=class{mElement;mEventName;constructor(e,t){this.mEventName=e,this.mElement=t}dispatchEvent(e){let t=new dn(this.mEventName,e);this.mElement.dispatchEvent(t)}}});function S(s){return(e,t)=>{if(t.static)throw new f("Event target is not for a static property.",S);let n=null;return{get(){if(!n){let r=(()=>{try{return ie.ofProcessor(this).component}catch{throw new f("PwbComponentEvent target class is not a component.",this)}})();n=new mn(s,r.element)}return n}}}}var Zi=p(()=>{L();At();Zr()});var Yi,Yr,Qc,zt,hn,_r=p(()=>{L();W();Rt();ae();De();re();un();Yi=[Tt({access:2,trigger:127,targetRestrictions:[Ce]})];zt=class zt extends(Qc=P){static METADATA_EXPORTED_PROPERTIES="pwb:exported_properties";mComponent;constructor(e=C.use(Ce)){super(),this.mComponent=e;let t=new _,n=e.processorConstructor;do{let o=se.get(n).getMetadata(zt.METADATA_EXPORTED_PROPERTIES);o&&t.push(...o)}while(n=Object.getPrototypeOf(n));let r=new Set(t);r.size>0&&this.connectExportedProperties(r)}connectExportedProperties(e){this.exportPropertyAsAttribute(e),this.patchHtmlAttributes(e)}exportPropertyAsAttribute(e){for(let t of e){let n={};n.enumerable=!0,n.configurable=!0,delete n.value,delete n.writable,n.set=r=>{Reflect.set(this.mComponent.processor,t,r)},n.get=()=>{let r=Reflect.get(this.mComponent.processor,t);return typeof r=="function"&&(r=r.bind(this.mComponent.processor)),r},Object.defineProperty(this.mComponent.element,t,n)}}patchHtmlAttributes(e){let t=this.mComponent.element.getAttribute;new MutationObserver(r=>{for(let o of r){let i=o.attributeName,a=t.call(this.mComponent.element,i);Reflect.set(this.mComponent.element,i,a),this.mComponent.attributeChanged(i,o.oldValue,a)}}).observe(this.mComponent.element,{attributeFilter:[...e],attributeOldValue:!0});for(let r of e)if(this.mComponent.element.hasAttribute(r)){let o=t.call(this.mComponent.element,r);this.mComponent.element.setAttribute(r,o)}this.mComponent.element.getAttribute=r=>e.has(r)?Reflect.get(this.mComponent.element,r):t.call(this.mComponent.element,r)}};Yr=E(Qc),zt=m(Yr,0,"ExportExtension",Yi,zt),u(Yr,1,zt);hn=zt});function x(s,e){if(e.static)throw new f("Event target is not for a static property.",x);let t=se.forInternalDecorator(e.metadata),n=t.getMetadata(hn.METADATA_EXPORTED_PROPERTIES)??new Array;n.push(e.name),t.setMetadata(hn.METADATA_EXPORTED_PROPERTIES,n)}var _i=p(()=>{L();W();_r()});function pe(s){return(e,t)=>{if(t.static)throw new f("Event target is not for a static property.",pe);return{get(){let o=(()=>{try{return ie.ofProcessor(this).component}catch{throw new f("PwbChild target class is not a component.",this)}})().getProcessorAttribute(Se).data.store[s];if(o instanceof Element)return o;throw new f(`Can't find child "${s}".`,this)}}}}var qi=p(()=>{L();At();Qt()});var Ji,qr,eu,yn,Qi=p(()=>{L();W();dt();ae();ut();Ie();re();_e();gt();Ut();Ji=[$e({instructionType:"dynamic-content",trigger:111})];yn=class extends(eu=P){mLastTemplate;mModuleValues;mProcedure;constructor(e=C.use(J),t=C.use(K)){super(),this.mModuleValues=t,this.mLastTemplate=null,this.mProcedure=this.mModuleValues.createExpressionProcedure(e.value)}onUpdate(){let e=this.mProcedure.execute();if(!e||!(e instanceof ye))throw new f("Dynamic content method has a wrong result type.",this);if(this.mLastTemplate!==null&&this.mLastTemplate.equals(e))return null;let t=e.clone();this.mLastTemplate=t;let n=new ge;return n.addElement(t,new ve(this.mModuleValues.data)),n}};qr=E(eu),yn=m(qr,0,"DynamicContentInstructionModule",Ji,yn),u(qr,1,yn)});var es,Jr,tu,fn,ts=p(()=>{W();ae();Ie();De();re();jt();yt();je();es=[Ue({access:3,selector:/^\([[\w\-$]+\)$/,trigger:127})];fn=class extends(tu=P){mEventName;mListener;mTarget;constructor(e=C.use(ee),t=C.use(K),n=C.use(fe)){super(),this.mTarget=e,this.mEventName=n.name.substring(1,n.name.length-1);let r=t.createExpressionProcedure(n.value,["$event"]);this.mListener=o=>{r.setTemporaryValue("$event",o),r.execute()},this.mTarget.addEventListener(this.mEventName,this.mListener)}onDeconstruct(){this.mTarget.removeEventListener(this.mEventName,this.mListener)}};Jr=E(tu),fn=m(Jr,0,"EventAttributeModule",es,fn),u(Jr,1,fn)});var ns,Qr,nu,gn,rs=p(()=>{L();W();dt();ae();ut();Ie();re();_e();mt();gt();Ut();ns=[$e({instructionType:"for",trigger:111})];gn=class extends(nu=P){mExpression;mLastEntries;mModuleValues;mTemplate;constructor(e=C.use(xe),t=C.use(K),n=C.use(J)){super(),this.mTemplate=e,this.mModuleValues=t,this.mLastEntries=new Array;let r=n.value,i=new RegExp(/^\s*([a-zA-Z]+[a-zA-Z0-9]*)\s*of\s+([^;]+)\s*(;\s*([a-zA-Z]+[a-zA-Z0-9]*)\s*=\s*(.*)\s*)?$/).exec(r);if(!i)throw new f(`For-Parameter value has wrong format: ${r}`,this);let a=i[1],l=i[2],c=i[4]??null,h=i[5],d=this.mModuleValues.createExpressionProcedure(l),y=c?this.mModuleValues.createExpressionProcedure(h,["$index",a]):null;this.mExpression={iterateVariableName:a,iterateValueProcedure:d,indexExportVariableName:c,indexExportProcedure:y}}onUpdate(){let e=new ge,t=this.mExpression.iterateValueProcedure.execute();if(typeof t=="object"&&t!==null||Array.isArray(t)){let n=Symbol.iterator in t?Object.entries([...t]):Object.entries(t);if(this.compareEntries(n,this.mLastEntries))return null;this.mLastEntries=n;for(let[r,o]of n)this.addTemplateForElement(e,this.mExpression,o,r);return e}else return null}addTemplateForElement=(e,t,n,r)=>{let o=new ve(this.mModuleValues.data);if(o.setTemporaryValue(t.iterateVariableName,n),t.indexExportProcedure&&t.indexExportVariableName){t.indexExportProcedure.setTemporaryValue("$index",r),t.indexExportProcedure.setTemporaryValue(t.iterateVariableName,n);let a=t.indexExportProcedure.execute();o.setTemporaryValue(t.indexExportVariableName,a)}let i=new ye;i.appendChild(...this.mTemplate.childList),e.addElement(i,o)};compareEntries(e,t){if(e.length!==t.length)return!1;for(let n=0;n<e.length;n++){let[r,o]=e[n],[i,a]=t[n];if(r!==i||o!==a)return!1}return!0}};Qr=E(nu),gn=m(Qr,0,"ForInstructionModule",ns,gn),u(Qr,1,gn)});var os,eo,ru,bn,is=p(()=>{W();dt();ae();ut();Ie();re();_e();mt();gt();Ut();os=[$e({instructionType:"if",trigger:111})];bn=class extends(ru=P){mLastBoolean;mModuleValues;mProcedure;mTemplateReference;constructor(e=C.use(xe),t=C.use(K),n=C.use(J)){super(),this.mTemplateReference=e,this.mModuleValues=t,this.mProcedure=this.mModuleValues.createExpressionProcedure(n.value),this.mLastBoolean=!1}onUpdate(){let e=this.mProcedure.execute();if(!!e!==this.mLastBoolean){this.mLastBoolean=!!e;let t=new ge;if(e){let n=new ye;n.appendChild(...this.mTemplateReference.childList),t.addElement(n,new ve(this.mModuleValues.data))}return t}else return null}};eo=E(ru),bn=m(eo,0,"IfInstructionModule",os,bn),u(eo,1,bn)});var ss,to,ou,Tn,as=p(()=>{W();ae();Ie();De();re();jt();yt();je();ss=[Ue({access:1,selector:/^\[[\w$]+\]$/,trigger:127})];Tn=class extends(ou=P){mLastValue;mProcedure;mTarget;mTargetProperty;constructor(e=C.use(ee),t=C.use(K),n=C.use(fe)){super(),this.mTarget=e,this.mProcedure=t.createExpressionProcedure(n.value),this.mTargetProperty=n.name.substring(1,n.name.length-1),this.mLastValue=Symbol("Uncomparable")}onUpdate(){let e=this.mProcedure.execute();return e===this.mLastValue?!1:(this.mLastValue=e,Reflect.set(this.mTarget,this.mTargetProperty,e),!0)}};to=E(ou),Tn=m(to,0,"OneWayBindingAttributeModule",ss,Tn),u(to,1,Tn)});var ls,no,iu,vn,cs=p(()=>{W();ae();Qt();De();re();ft();jt();yt();je();ls=[Ue({access:3,selector:/^#[[\w$]+$/,trigger:127})];vn=class extends(iu=P){constructor(e=C.use(ee),t=C.use(ce),n=C.use(fe),r=C.use(Se)){super();let o=e,i=t.registerObject(o);r.setTemporaryValue(n.name.substring(1),i)}};no=E(iu),vn=m(no,0,"PwbChildAttributeModule",ls,vn),u(no,1,vn)});var us,ro,su,Cn,ps=p(()=>{W();on();dt();ae();Ie();re();_e();gt();Ut();us=[$e({instructionType:"slot",trigger:0})];Cn=class extends(su=P){mIsSetup;mModuleValues;mSlotName;constructor(e=C.use(K),t=C.use(J)){super(),this.mModuleValues=e,this.mSlotName=t.value,this.mIsSetup=!1}onUpdate(){if(this.mIsSetup)return null;this.mIsSetup=!0;let e=new Ve;e.tagName="slot",this.mSlotName!==""&&e.setAttribute("name").addValue(this.mSlotName);let t=new ye;t.appendChild(e);let n=new ge;return n.addElement(t,this.mModuleValues.data),n}};ro=E(su),Cn=m(ro,0,"SlotInstructionModule",us,Cn),u(ro,1,Cn)});var ds,oo,au,xn,ms=p(()=>{ae();De();re();ft();jt();yt();je();Ie();W();ds=[Ue({access:2,selector:/^\[\([[\w$]+\)\]$/,trigger:127})];xn=class extends(au=P){mAttributeKey;mLastDataValue;mReadProcedure;mTargetNode;mWriteProcedure;constructor(e=C.use(ee),t=C.use(K),n=C.use(fe),r=C.use(ce)){super(),this.mTargetNode=e,this.mAttributeKey=n.name.substring(2,n.name.length-2),this.mReadProcedure=t.createExpressionProcedure(n.value),this.mWriteProcedure=t.createExpressionProcedure(`${n.value} = $DATA;`,["$DATA"]),this.mLastDataValue=Symbol("Uncomparable"),r.registerObject(this.mTargetNode)}onUpdate(){let e=this.mReadProcedure.execute();if(e!==this.mLastDataValue)return Reflect.set(this.mTargetNode,this.mAttributeKey,e),this.mLastDataValue=e,!0;let t=Reflect.get(this.mTargetNode,this.mAttributeKey);return t!==e?(this.mWriteProcedure.setTemporaryValue("$DATA",t),this.mWriteProcedure.execute(),this.mLastDataValue=t,!0):!1}};oo=E(au),xn=m(oo,0,"TwoWayBindingAttributeModule",ds,xn),u(oo,1,xn)});var hs,io,lu,Pn,ys=p(()=>{W();ae();De();re();un();ft();je();Jn();hs=[Tt({access:1,trigger:127,targetRestrictions:[ce]})];Pn=class extends(lu=P){mEventListenerList;mTargetElement;constructor(e=C.use(ce),t=C.use(ee)){super();let n=new Array,r=e.processorConstructor;do{let o=se.get(r).getMetadata(pn.METADATA_USER_EVENT_LISTENER_PROPERIES);if(o)for(let i of o)n.push(i)}while(r=Object.getPrototypeOf(r));this.mEventListenerList=new Array,this.mTargetElement=t;for(let o of n){let[i,a]=o,l=Reflect.get(e.processor,i);l=l.bind(e.processor),this.mEventListenerList.push([a,l]),this.mTargetElement.addEventListener(a,l)}}onDeconstruct(){for(let e of this.mEventListenerList){let[t,n]=e;this.mTargetElement.removeEventListener(t,n)}}};io=E(lu),Pn=m(io,0,"ComponentEventListenerModuleExtension",hs,Pn),u(io,1,Pn)});var ue=p(()=>{Pi();On();Hi();Ki();ae();Ie();Gn();ft();Xn();yt();je();mt();Wn();Br();Rt();Qt();ut();Vn();Ie();un();jt();Vr();gt();Ut();De();Wi();Zr();Wr();Zi();_i();qi();jn();nn();on();Rr();tn();Kr();Qi();ts();rs();is();as();cs();ps();ms();Jn();ys();_r()});var gs,fs=p(()=>{gs=`:host {\r
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
`});var Ts,bs=p(()=>{Ts=`<div class="editor-layout">\r
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
</div>`});var Ht=p(()=>{});var Qe,so=p(()=>{Qe=class{id;kind;sourceNodeId;sourcePortId;targetNodeId;targetPortId;mValid;get valid(){return this.mValid}set valid(e){this.mValid=e}constructor(e,t,n,r,o,i){this.id=e,this.sourceNodeId=t,this.sourcePortId=n,this.targetNodeId=r,this.targetPortId=o,this.kind=i,this.mValid=!0}}});var vs=p(()=>{});var In,Cs=p(()=>{In=class{direction;id;name;mConnectedTo;get connectedTo(){return this.mConnectedTo}set connectedTo(e){this.mConnectedTo=e}constructor(e,t,n){this.id=e,this.name=t,this.direction=n,this.mConnectedTo=null}}});var wn,xs=p(()=>{wn=class{direction;id;name;type;valueId;mConnectedTo;get connectedTo(){return this.mConnectedTo}set connectedTo(e){this.mConnectedTo=e}constructor(e,t,n,r,o){this.id=e,this.name=t,this.type=n,this.direction=r,this.valueId=o,this.mConnectedTo=null}}});var vt,ao=p(()=>{vs();Cs();xs();vt=class s{category;definitionName;flowInputs;flowOutputs;id;inputs;outputs;properties;system;mPosition;mSize;get position(){return this.mPosition}get size(){return this.mSize}constructor(e,t,n,r){this.id=e,this.definitionName=t.name,this.category=t.category,this.system=r,this.mPosition={x:n.x,y:n.y},this.mSize={w:8,h:4},this.properties=new Map,this.inputs=new Map;for(let o of t.inputs){let i=s.generatePortId(),a=s.generateValueId(t.category);this.inputs.set(o.name,new wn(i,o.name,o.type,"input",a))}this.outputs=new Map;for(let o of t.outputs){let i=s.generatePortId(),a=s.generateValueId(t.category);this.outputs.set(o.name,new wn(i,o.name,o.type,"output",a))}if(this.flowInputs=new Map,t.flowInputs)for(let o of t.flowInputs){let i=s.generatePortId();this.flowInputs.set(o,new In(i,o,"input"))}if(this.flowOutputs=new Map,t.flowOutputs)for(let o of t.flowOutputs){let i=s.generatePortId();this.flowOutputs.set(o,new In(i,o,"output"))}}moveTo(e,t){this.mPosition={x:e,y:t}}resizeTo(e,t){this.mSize={w:Math.max(4,e),h:Math.max(2,t)}}static generatePortId(){return crypto.randomUUID().substring(0,8)}static generateValueId(e){let t=crypto.randomUUID().replace(/-/g,"").substring(0,12);return`${String(e).replace(/[^a-zA-Z0-9]/g,"")}_${t}`}}});var Qn,Ps=p(()=>{Ht();so();ao();Qn=class{mConnections;mNodes;get connections(){return this.mConnections}get nodes(){return this.mNodes}constructor(){this.mNodes=new Map,this.mConnections=new Map}addNode(e,t,n=!1){let r=crypto.randomUUID(),o=new vt(r,e,t,n);return this.mNodes.set(r,o),o}addExistingNode(e){this.mNodes.set(e.id,e)}removeNode(e){let t=new Array;for(let[n,r]of this.mConnections)(r.sourceNodeId===e||r.targetNodeId===e)&&(t.push(r),this.mConnections.delete(n));return this.mNodes.delete(e),t}addConnection(e,t,n,r,o){let i=this.mNodes.get(e),a=this.mNodes.get(n);if(!i||!a||e===n)return null;if(o==="data"){let l=this.findDataPortById(i,t),c=this.findDataPortById(a,r);if(!l||!c)return null;let h=l.type===c.type;for(let[b,N]of this.mConnections)if(N.targetNodeId===n&&N.targetPortId===r&&N.kind==="data"){this.mConnections.delete(b);break}c.connectedTo=l.valueId;let d=crypto.randomUUID(),y=new Qe(d,e,t,n,r,o);return y.valid=h,this.mConnections.set(d,y),y}else{let l=this.findFlowPortById(i,t),c=this.findFlowPortById(a,r);if(!l||!c)return null;for(let[y,b]of this.mConnections)if(b.sourceNodeId===e&&b.sourcePortId===t&&b.kind==="flow"){this.mConnections.delete(y);break}l.connectedTo=c.id,c.connectedTo=l.id;let h=crypto.randomUUID(),d=new Qe(h,e,t,n,r,o);return this.mConnections.set(h,d),d}}addExistingConnection(e){this.mConnections.set(e.id,e)}removeConnection(e){let t=this.mConnections.get(e);if(!t)return null;let n=this.mNodes.get(t.targetNodeId);if(n)if(t.kind==="data"){let r=this.findDataPortById(n,t.targetPortId);r&&(r.connectedTo=null)}else{let r=this.mNodes.get(t.sourceNodeId),o=r?this.findFlowPortById(r,t.sourcePortId):null,i=this.findFlowPortById(n,t.targetPortId);o&&(o.connectedTo=null),i&&(i.connectedTo=null)}return this.mConnections.delete(e),t}validate(){let e=new Array;for(let t of this.mConnections.values()){if(t.kind!=="data")continue;let n=this.mNodes.get(t.sourceNodeId),r=this.mNodes.get(t.targetNodeId);if(!n||!r){t.valid=!1,e.push(t);continue}let o=this.findDataPortById(n,t.sourcePortId),i=this.findDataPortById(r,t.targetPortId);if(!o||!i){t.valid=!1,e.push(t);continue}let a=o.type===i.type;t.valid=a,a||e.push(t)}return e}getNode(e){return this.mNodes.get(e)}getConnection(e){return this.mConnections.get(e)}getConnectionsForNode(e){let t=new Array;for(let n of this.mConnections.values())(n.sourceNodeId===e||n.targetNodeId===e)&&t.push(n);return t}findDataPortById(e,t){for(let n of e.inputs.values())if(n.id===t)return n;for(let n of e.outputs.values())if(n.id===t)return n;return null}findFlowPortById(e,t){for(let n of e.flowInputs.values())if(n.id===t)return n;for(let n of e.flowOutputs.values())if(n.id===t)return n;return null}}});var Ct,lo=p(()=>{Ps();Ct=class{editableByUser;graph;id;system;mImports;mInputs;mLabel;mName;mOutputs;get imports(){return this.mImports}get inputs(){return this.mInputs}get label(){return this.mLabel}get name(){return this.mName}get outputs(){return this.mOutputs}constructor(e,t,n,r,o=!1){this.id=e,this.mName=t,this.mLabel=n,this.system=r,this.editableByUser=o,this.graph=new Qn,this.mInputs=new Array,this.mOutputs=new Array,this.mImports=new Array}setName(e){this.mName=e}setLabel(e){this.mLabel=e}setInputs(e){this.mInputs=[...e]}setOutputs(e){this.mOutputs=[...e]}setImports(e){this.mImports=[...e]}addImport(e){this.mImports.includes(e)||this.mImports.push(e)}removeImport(e){let t=this.mImports.indexOf(e);t!==-1&&this.mImports.splice(t,1)}addInput(e){this.mInputs.push(e)}removeInput(e){this.mInputs.splice(e,1)}addOutput(e){this.mOutputs.push(e)}removeOutput(e){this.mOutputs.splice(e,1)}}});var tr,Is=p(()=>{tr=class{mMaxSize;mRedoStack;mUndoStack;get canRedo(){return this.mRedoStack.length>0}get canUndo(){return this.mUndoStack.length>0}constructor(e=100){this.mUndoStack=new Array,this.mRedoStack=new Array,this.mMaxSize=e}push(e){e.apply(),this.mUndoStack.push(e),this.mRedoStack.length=0,this.mUndoStack.length>this.mMaxSize&&this.mUndoStack.shift()}undo(){let e=this.mUndoStack.pop();e&&(e.revert(),this.mRedoStack.push(e))}redo(){let e=this.mRedoStack.pop();e&&(e.apply(),this.mUndoStack.push(e))}clear(){this.mUndoStack.length=0,this.mRedoStack.length=0}}});var nr,ws=p(()=>{Ht();nr=class{mData;get hasData(){return this.mData!==null}constructor(){this.mData=null}copy(e,t){let n=new Array,r=new Map;for(let a of t){let l=e.getNode(a);l&&!l.system&&(r.set(l.id,n.length),n.push(l))}if(n.length===0)return;let o=n.map(a=>{let l={};for(let[h,d]of a.properties)l[h]=d;let c=new Array;for(let[h,d]of a.inputs)d.connectedTo&&c.push({portName:h,connectedValueId:d.connectedTo});return{definitionName:a.definitionName,position:{...a.position},size:{...a.size},properties:l,inputConnections:c}}),i=[];for(let a of e.connections.values()){let l=r.get(a.sourceNodeId),c=r.get(a.targetNodeId);if(l!==void 0&&c!==void 0){let h=n[l],d=n[c],y="",b="",N;if(a.kind==="data"){N="data";for(let[I,T]of h.outputs)if(T.id===a.sourcePortId){y=I;break}for(let[I,T]of d.inputs)if(T.id===a.targetPortId){b=I;break}}else{N="flow";for(let[I,T]of h.flowOutputs)if(T.id===a.sourcePortId){y=I;break}for(let[I,T]of d.flowInputs)if(T.id===a.targetPortId){b=I;break}}y&&b&&i.push({sourceNodeIndex:l,sourcePortName:y,targetNodeIndex:c,targetPortName:b,kind:N})}}this.mData={nodes:o,internalConnections:i}}getData(){return this.mData}}});var Kt,co=p(()=>{Kt=class s{static MAX_ZOOM=2;static MIN_ZOOM=.25;mGridSize;mPanX;mPanY;mSelectionEnd;mSelectionStart;mZoom;get gridSize(){return this.mGridSize}get panX(){return this.mPanX}get panY(){return this.mPanY}get selectionEnd(){return this.mSelectionEnd}get selectionStart(){return this.mSelectionStart}get zoom(){return this.mZoom}constructor(e=20){this.mGridSize=e,this.mPanX=0,this.mPanY=0,this.mZoom=1,this.mSelectionStart=null,this.mSelectionEnd=null}clearSelection(){this.mSelectionStart=null,this.mSelectionEnd=null}getGridBackgroundCss(){let e=this.mGridSize*this.mZoom,t=this.mPanX%e,n=this.mPanY%e,r=e*5,o=this.mPanX%r,i=this.mPanY%r;return[`background-size: ${e}px ${e}px, ${r}px ${r}px`,`background-position: ${t}px ${n}px, ${o}px ${i}px`,"background-image: radial-gradient(circle, var(--pn-grid-color) 1px, transparent 1px), radial-gradient(circle, var(--pn-grid-color) 1.5px, transparent 1.5px)"].join("; ")}getTransformCss(){return`translate(${this.mPanX}px, ${this.mPanY}px) scale(${this.mZoom})`}pan(e,t){this.mPanX+=e,this.mPanY+=t}screenToWorld(e,t){return{x:(e-this.mPanX)/this.mZoom,y:(t-this.mPanY)/this.mZoom}}setSelectionEnd(e,t){this.mSelectionEnd={x:e,y:t}}setSelectionStart(e,t){this.mSelectionStart={x:e,y:t}}snapToGrid(e,t){return{x:Math.round(e/this.mGridSize)*this.mGridSize,y:Math.round(t/this.mGridSize)*this.mGridSize}}worldToScreen(e,t){return{x:e*this.mZoom+this.mPanX,y:t*this.mZoom+this.mPanY}}zoomAt(e,t,n){let r=this.mZoom,o=1+n,i=this.mZoom*o;i=Math.max(s.MIN_ZOOM,Math.min(s.MAX_ZOOM,i));let a=(e-this.mPanX)/r,l=(t-this.mPanY)/r;this.mZoom=i,this.mPanX=e-a*this.mZoom,this.mPanY=t-l*this.mZoom}}});var Es,uo,Xt,po=p(()=>{Es="http://www.w3.org/2000/svg",uo="data-temp-connection",Xt=class{clearAll(e){let t=e.querySelectorAll("path");for(let n of t)n.remove()}clearTempConnection(e){let t=e.querySelector(`[${uo}]`);t&&t.remove()}generateBezierPath(e,t,n,r){let o=Math.abs(n-e),i=Math.max(o*.4,50),a=e+i,l=t,c=n-i;return`M ${e} ${t} C ${a} ${l}, ${c} ${r}, ${n} ${r}`}renderConnections(e,t){let n=e.querySelectorAll(`path:not([${uo}])`);for(let r of n)r.remove();for(let r of t){let o=document.createElementNS(Es,"path");o.setAttribute("d",this.generateBezierPath(r.sourceX,r.sourceY,r.targetX,r.targetY)),o.setAttribute("fill","none"),o.setAttribute("data-connection-id",r.id),o.style.stroke=r.valid?"#a6adc8":"#f38ba8",o.style.strokeWidth="2",r.valid||o.setAttribute("stroke-dasharray","6 3"),e.appendChild(o)}}renderTempConnection(e,t,n,r){this.clearTempConnection(e);let o=document.createElementNS(Es,"path");o.setAttribute("d",this.generateBezierPath(t.x,t.y,n.x,n.y)),o.setAttribute("fill","none"),o.setAttribute(uo,"true"),o.style.stroke=r,o.style.strokeWidth="2",o.style.opacity="0.6",o.style.strokeDasharray="8 4",e.appendChild(o)}}});var et,rr,xt=p(()=>{et=(l=>(l.Function="function",l.Operator="operator",l.Value="value",l.Flow="flow",l.Comment="comment",l.TypeConversion="type-conversion",l.Input="input",l.Output="output",l))(et||{}),rr={function:{icon:"f",cssColor:"var(--pn-accent-blue)",label:"Function"},operator:{icon:"\xB1",cssColor:"var(--pn-accent-green)",label:"Operator"},value:{icon:"#",cssColor:"var(--pn-accent-peach)",label:"Value"},flow:{icon:"\u27F3",cssColor:"var(--pn-accent-mauve)",label:"Flow"},comment:{icon:"\u{1F4AC}",cssColor:"var(--pn-accent-yellow)",label:"Comment"},"type-conversion":{icon:"\u21C4",cssColor:"var(--pn-accent-teal)",label:"Type Conversion"},input:{icon:"\u2192",cssColor:"var(--pn-accent-green)",label:"Input"},output:{icon:"\u2190",cssColor:"var(--pn-accent-red)",label:"Output"}}});var or,ks=p(()=>{or=class{bodyCode;inputs;name;outputs;constructor(){this.name="",this.bodyCode="",this.inputs=new Array,this.outputs=new Array}}});var Me,En=p(()=>{Me=class{mBody;mInputs;mOutputs;mProperties;get body(){return this.mBody}get inputs(){return this.mInputs}get outputs(){return this.mOutputs}get properties(){return this.mProperties}constructor(){this.mInputs=new Map,this.mOutputs=new Map,this.mBody=new Map,this.mProperties=new Map}expandTemplate(e){return e.replace(/\$\{(input|output|property|body):([^}]+)\}/g,(t,n,r)=>{switch(n){case"input":return this.mInputs.get(r)?.valueId??"";case"output":return this.mOutputs.get(r)?.valueId??"";case"property":return this.mProperties.get(r)??"";case"body":return this.mBody.get(r)?.code??"";default:return""}})}}});var ir,As=p(()=>{En();ir=class extends Me{get commentText(){return this.properties.get("comment")??""}set commentText(e){this.properties.set("comment",e)}generateCode(){return""}}});var sr,Ns=p(()=>{En();sr=class extends Me{generateCode(){return""}}});var ar,Ds=p(()=>{En();ar=class extends Me{generateCode(){return""}}});var tt,lr=p(()=>{En();tt=class extends Me{mCodeTemplate;constructor(e){super(),this.mCodeTemplate=e}generateCode(){return this.expandTemplate(this.mCodeTemplate)}}});var cr,Ss=p(()=>{lr();cr=class extends tt{get value(){return this.properties.get("value")??""}set value(e){this.properties.set("value",e)}}});var ur,Ls=p(()=>{lr();ur=class extends tt{}});var kn,Ms=p(()=>{xt();Ht();ks();As();Ns();Ds();lr();Ss();Ls();kn=class{mConfig;constructor(e){this.mConfig=e}generateFunctionCode(e){let t=e.graph,n=this.generateGraphCode(t),r=new or;r.name=e.name,r.bodyCode=n;for(let o of e.inputs){let i=this.findInputNodeValueId(t,o.name);r.inputs.push({name:o.name,type:o.type,valueId:i})}for(let o of e.outputs){let i=this.findOutputNodeValueId(t,o.name);r.outputs.push({name:o.name,type:o.type,valueId:i})}if(this.mConfig.functionCodeGenerator){let o=this.mConfig.functionCodeGenerator(r);return this.wrapWithMetadata(e,o)}return this.wrapWithMetadata(e,n)}generateProjectCode(e){let t=new Array;for(let n of e.values())t.push(this.generateFunctionCode(n));return t.join(`

`)}generateGraphCode(e){let t=this.topologicalSort(e),n=new Array;for(let r of t){if(r.category==="input"||r.category==="output"||!this.mConfig.nodeDefinitions.get(r.definitionName))continue;let i=this.buildCodeNode(e,r);for(let[c,h]of r.flowOutputs)if(h.connectedTo){let d=this.generateFlowBodyCode(e,h.connectedTo);i.body.set(c,{code:d})}else i.body.set(c,{code:""});let a=i.generateCode(),l=this.wrapNodeWithMetadata(r,a);n.push(l)}return n.join(`
`)}generateFlowBodyCode(e,t){let n=new Array,r=t;for(;r;){let o=this.findNodeByFlowPortId(e,r);if(!o||!this.mConfig.nodeDefinitions.get(o.definitionName))break;let a=this.buildCodeNode(e,o);for(let[c,h]of o.flowOutputs)if(h.connectedTo){let d=this.generateFlowBodyCode(e,h.connectedTo);a.body.set(c,{code:d})}else a.body.set(c,{code:""});let l=a.generateCode();n.push(this.wrapNodeWithMetadata(o,l)),r=null}return n.join(`
`)}buildCodeNode(e,t){let n=this.mConfig.nodeDefinitions.get(t.definitionName),r=this.createNodeForCategory(t.category,n?.codeTemplate??"");for(let[o,i]of t.inputs){let a=i.connectedTo??i.valueId;r.inputs.set(o,{name:o,type:i.type,valueId:a})}for(let[o,i]of t.outputs)r.outputs.set(o,{name:o,type:i.type,valueId:i.valueId});for(let[o,i]of t.properties)r.properties.set(o,i);return r}createNodeForCategory(e,t){switch(e){case"comment":return new ir;case"input":return new sr;case"output":return new ar;case"value":return new cr(t);case"flow":return new ur(t);default:return new tt(t)}}topologicalSort(e){let t=new Set,n=new Array,r=new Map;for(let i of e.nodes.values())r.set(i.id,new Set);for(let i of e.connections.values())if(i.kind==="data"){let a=r.get(i.targetNodeId);a&&a.add(i.sourceNodeId)}let o=i=>{if(t.has(i))return;t.add(i);let a=r.get(i);if(a)for(let c of a)o(c);let l=e.getNode(i);l&&n.push(l)};for(let i of e.nodes.keys())o(i);return n}findInputNodeValueId(e,t){for(let n of e.nodes.values())if(n.category==="input"&&n.definitionName===t){let r=n.outputs.values().next().value;if(r)return r.valueId}return t}findOutputNodeValueId(e,t){for(let n of e.nodes.values())if(n.category==="output"&&n.definitionName===t){let r=n.inputs.values().next().value;return r&&r.connectedTo?r.connectedTo:r?.valueId??t}return t}findNodeByFlowPortId(e,t){for(let n of e.nodes.values()){for(let r of n.flowInputs.values())if(r.id===t)return n;for(let r of n.flowOutputs.values())if(r.id===t)return n}return null}wrapWithMetadata(e,t){let n=this.mConfig.commentToken,r={type:"function",label:e.label,name:e.name,system:e.system,inputs:[...e.inputs],outputs:[...e.outputs],imports:[...e.imports]},o=`${n} __POTATNO_START: ${e.id} ${JSON.stringify(r)}`,i=`${n} __POTATNO_END: ${e.id}`;return`${o}
${t}
${i}`}wrapNodeWithMetadata(e,t){let n=this.mConfig.commentToken,r=new Array;for(let[y,b]of e.inputs)r.push({name:y,type:b.type,id:b.id,valueId:b.valueId,connectedTo:b.connectedTo});let o=new Array;for(let[y,b]of e.outputs)o.push({name:y,type:b.type,id:b.id,valueId:b.valueId});let i=new Array;for(let[y,b]of e.flowInputs)i.push({name:y,id:b.id,connectedTo:b.connectedTo});let a=new Array;for(let[y,b]of e.flowOutputs)a.push({name:y,id:b.id,connectedTo:b.connectedTo});let l={};for(let[y,b]of e.properties)l[y]=b;let c={type:e.definitionName,category:e.category,position:e.position,size:e.size,system:e.system,inputs:r,outputs:o,flowInputs:i,flowOutputs:a,properties:l},h=`${n} __POTATNO_START: ${e.id} ${JSON.stringify(c)}`,d=`${n} __POTATNO_END: ${e.id}`;return`${h}
${t}
${d}`}}});var An,Rs=p(()=>{Ms();An=class{mConfig;constructor(e){this.mConfig=e}serialize(e){return new kn(this.mConfig).generateProjectCode(e.functions)}serializeFunction(e){return new kn(this.mConfig).generateFunctionCode(e)}}});var Wt,mo=p(()=>{Wt=class{mActiveFunctionId;mFunctions;get activeFunction(){return this.mFunctions.get(this.mActiveFunctionId)}get activeFunctionId(){return this.mActiveFunctionId}get functions(){return this.mFunctions}constructor(){this.mFunctions=new Map,this.mActiveFunctionId=""}addFunction(e){this.mFunctions.set(e.id,e),this.mActiveFunctionId||(this.mActiveFunctionId=e.id)}removeFunction(e){let t=this.mFunctions.get(e);if(!t||t.system)return!1;if(this.mFunctions.delete(e),this.mActiveFunctionId===e){let n=this.mFunctions.keys().next().value;this.mActiveFunctionId=n??""}return!0}setActiveFunction(e){return this.mFunctions.has(e)?(this.mActiveFunctionId=e,!0):!1}getFunction(e){return this.mFunctions.get(e)}}});var pr,Os=p(()=>{xt();Ht();so();ao();lo();mo();pr=class{mConfig;constructor(e){this.mConfig=e}deserialize(e){let t=new Wt,n=this.parseMarkers(e);for(let o of n)if(o.meta.type==="function"){let i=this.reconstructFunction(o);t.addFunction(i),this.reconstructNodes(i,o.children)}let r=t.functions.keys().next().value;return r&&t.setActiveFunction(r),t}parseMarkers(e){let t=this.mConfig.commentToken,n=`${this.escapeRegex(t)} __POTATNO_START: `,r=`${this.escapeRegex(t)} __POTATNO_END: `,o=e.split(`
`),i=new Array,a=new Array;for(let l=0;l<o.length;l++){let c=o[l].trim();if(c.startsWith(n)){let h=c.substring(n.length),d=h.indexOf(" "),y=d>=0?h.substring(0,d):h,b=d>=0?h.substring(d+1):"{}",N;try{N=JSON.parse(b)}catch{N={}}let I={id:y,meta:N,innerCode:"",children:new Array};i.push({marker:I,startLine:l})}else if(c.startsWith(r)){let d=c.substring(r.length).trim();for(let y=i.length-1;y>=0;y--)if(i[y].marker.id===d){let b=i.splice(y,1)[0],N=new Array;for(let I=b.startLine+1;I<l;I++)N.push(o[I]);b.marker.innerCode=N.join(`
`),i.length>0?i[i.length-1].marker.children.push(b.marker):a.push(b.marker);break}}}return a}reconstructFunction(e){let t=new Ct(e.id,e.meta.name??"unnamed",e.meta.label??e.meta.name??"Unnamed",e.meta.system??!1);return Array.isArray(e.meta.inputs)&&t.setInputs(e.meta.inputs),Array.isArray(e.meta.outputs)&&t.setOutputs(e.meta.outputs),Array.isArray(e.meta.imports)&&t.setImports(e.meta.imports),t}reconstructNodes(e,t){for(let n of t){let r=n.meta,o=r.category,i=this.mConfig.nodeDefinitions.get(r.type);if(i){let a=new vt(n.id,i,r.position??{x:0,y:0},r.system??!1);if(r.size&&a.resizeTo(r.size.w,r.size.h),r.properties)for(let[l,c]of Object.entries(r.properties))a.properties.set(l,c);this.restorePortData(a,r),e.graph.addExistingNode(a)}else if(o==="input"||o==="output"){let a=(r.inputs??[]).map(d=>({name:d.name,type:d.type})),l=(r.outputs??[]).map(d=>({name:d.name,type:d.type})),c={name:r.type,category:o,inputs:a,outputs:l},h=new vt(n.id,c,r.position??{x:0,y:0},r.system??!0);this.restorePortData(h,r),e.graph.addExistingNode(h)}n.children.length>0&&this.reconstructNodes(e,n.children)}this.reconstructConnections(e)}restorePortData(e,t){if(Array.isArray(t.inputs))for(let n of t.inputs){let r=e.inputs.get(n.name);r&&n.connectedTo&&(r.connectedTo=n.connectedTo)}if(Array.isArray(t.flowInputs))for(let n of t.flowInputs){let r=e.flowInputs.get(n.name);r&&n.connectedTo&&(r.connectedTo=n.connectedTo)}if(Array.isArray(t.flowOutputs))for(let n of t.flowOutputs){let r=e.flowOutputs.get(n.name);r&&n.connectedTo&&(r.connectedTo=n.connectedTo)}}reconstructConnections(e){let t=e.graph,n=new Map;for(let o of t.nodes.values())for(let i of o.outputs.values())n.set(i.valueId,{nodeId:o.id,portId:i.id});for(let o of t.nodes.values())for(let i of o.inputs.values())if(i.connectedTo){let a=n.get(i.connectedTo);if(a){let l=new Qe(crypto.randomUUID(),a.nodeId,a.portId,o.id,i.id,"data"),c=t.getNode(a.nodeId);if(c){let h;for(let d of c.outputs.values())if(d.id===a.portId){h=d;break}h&&(l.valid=h.type===i.type)}t.addExistingConnection(l)}}let r=new Map;for(let o of t.nodes.values()){for(let i of o.flowInputs.values())r.set(i.id,{nodeId:o.id,portId:i.id});for(let i of o.flowOutputs.values())r.set(i.id,{nodeId:o.id,portId:i.id})}for(let o of t.nodes.values())for(let i of o.flowOutputs.values())if(i.connectedTo){let a=r.get(i.connectedTo);if(a){let l=new Qe(crypto.randomUUID(),o.id,i.id,a.nodeId,a.portId,"flow");t.addExistingConnection(l)}}}escapeRegex(e){return e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}}});var Nn,dr,ho=p(()=>{Nn=class{description;mDefinition;mGraph;mNode;mPosition;mSystem;get node(){return this.mNode}constructor(e,t,n,r=!1){this.description=`Add node: ${t.name}`,this.mGraph=e,this.mDefinition=t,this.mPosition=n,this.mSystem=r,this.mNode=null}apply(){this.mNode?this.mGraph.addExistingNode(this.mNode):this.mNode=this.mGraph.addNode(this.mDefinition,this.mPosition,this.mSystem)}revert(){this.mNode&&this.mGraph.removeNode(this.mNode.id)}},dr=class{description;mGraph;mNodeId;mRemovedConnections;mRemovedNode;constructor(e,t){this.description="Remove node",this.mGraph=e,this.mNodeId=t,this.mRemovedNode=null,this.mRemovedConnections=new Array}apply(){this.mRemovedNode=this.mGraph.getNode(this.mNodeId)??null,this.mRemovedConnections=this.mGraph.removeNode(this.mNodeId)}revert(){if(this.mRemovedNode){this.mGraph.addExistingNode(this.mRemovedNode);for(let e of this.mRemovedConnections)this.mGraph.addExistingConnection(e)}}}});var Dn,Fs=p(()=>{Dn=class{description;mNewValue;mNode;mOldValue;mPropertyName;constructor(e,t,n){this.description=`Change property: ${t}`,this.mNode=e,this.mPropertyName=t,this.mNewValue=n,this.mOldValue=e.properties.get(t)??""}apply(){this.mOldValue=this.mNode.properties.get(this.mPropertyName)??"",this.mNode.properties.set(this.mPropertyName,this.mNewValue)}revert(){this.mOldValue===""?this.mNode.properties.delete(this.mPropertyName):this.mNode.properties.set(this.mPropertyName,this.mOldValue)}}});var Sn,Bs=p(()=>{Sn=class{description;mActions;constructor(e,t){this.description=e,this.mActions=t}apply(){for(let e of this.mActions)e.apply()}revert(){for(let e=this.mActions.length-1;e>=0;e--)this.mActions[e].revert()}}});var Vs,Gs=p(()=>{Vs=`:host {\r
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
`});var Us,js=p(()=>{Us=`<div class="search-wrapper">\r
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
</div>`});var $s,zs,Hs,Ks,nt,yo,Pt,fo=p(()=>{ue();xt();Gs();js();Ks=[j({selector:"potatno-node-library",template:Us,style:Vs})];Pt=class extends(Hs=P,zs=[S("node-drag-start")],$s=[x],Hs){constructor(){super(...arguments);u(nt,5,this);g(this,"mNodeDefinitions",[]);g(this,"mCachedFilteredGroups",[]);k(this,yo,u(nt,8,this)),u(nt,11,this);g(this,"mSearchQuery","");g(this,"mCollapsedCategories",{})}set nodeDefinitions(t){this.mNodeDefinitions=t,this.rebuildFilteredGroups()}get nodeDefinitions(){return this.mNodeDefinitions}get filteredGroups(){return this.mCachedFilteredGroups}rebuildFilteredGroups(){let t=this.mSearchQuery.toLowerCase(),n=new Map;for(let i of this.mNodeDefinitions){if(t&&!i.name.toLowerCase().includes(t))continue;let a=n.get(i.category);a||(a=[],n.set(i.category,a)),a.push(i)}let r=[],o=Object.values(et);for(let i of o){let a=n.get(i);if(a&&a.length>0){let l=rr[i];r.push({category:i,icon:l.icon,label:l.label,cssColor:l.cssColor,nodes:a})}}this.mCachedFilteredGroups=r}onSearchInput(t){this.mSearchQuery=t.target.value,this.rebuildFilteredGroups()}toggleCategory(t){this.mCollapsedCategories[t]=!this.mCollapsedCategories[t],this.rebuildFilteredGroups()}isCategoryCollapsed(t){return!!this.mCollapsedCategories[t]}getToggleClass(t){return this.mCollapsedCategories[t]?"category-toggle collapsed":"category-toggle"}onNodeMouseDown(t){this.mNodeDragStart.dispatchEvent(t)}};nt=E(Hs),yo=new WeakMap,m(nt,4,"mNodeDragStart",zs,Pt,yo),m(nt,3,"nodeDefinitions",$s,Pt),Pt=m(nt,0,"PotatnoNodeLibrary",Ks,Pt),u(nt,1,Pt)});var Ws,Xs=p(()=>{Ws=`:host {\r
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
`});var Ys,Zs=p(()=>{Ys=`<div class="function-list-content">\r
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
</div>`});var _s,qs,Js,Qs,ea,ta,na,Q,go,bo,To,Re,vo=p(()=>{ue();Xs();Zs();na=[j({selector:"potatno-function-list",template:Ys,style:Ws})];Re=class extends(ta=P,ea=[x],Qs=[x],Js=[S("function-select")],qs=[S("function-add")],_s=[S("function-delete")],ta){constructor(){super(...arguments);g(this,"functions",u(Q,20,this,[])),u(Q,23,this);g(this,"activeFunctionId",u(Q,24,this,"")),u(Q,27,this);k(this,go,u(Q,8,this)),u(Q,11,this);k(this,bo,u(Q,12,this)),u(Q,15,this);k(this,To,u(Q,16,this)),u(Q,19,this)}getEntryClass(t){return t===this.activeFunctionId?"function-entry active":"function-entry"}onFunctionSelect(t){this.mFunctionSelect.dispatchEvent(t)}onFunctionAdd(){this.mFunctionAdd.dispatchEvent(void 0)}onFunctionDelete(t,n){t.stopPropagation(),this.mFunctionDelete.dispatchEvent(n)}};Q=E(ta),go=new WeakMap,bo=new WeakMap,To=new WeakMap,m(Q,4,"mFunctionSelect",Js,Re,go),m(Q,4,"mFunctionAdd",qs,Re,bo),m(Q,4,"mFunctionDelete",_s,Re,To),m(Q,5,"functions",ea,Re),m(Q,5,"activeFunctionId",Qs,Re),Re=m(Q,0,"PotatnoFunctionList",na,Re),u(Q,1,Re)});var oa,ra=p(()=>{oa=`:host {\r
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
`});var sa,ia=p(()=>{sa=`<div class="tab-bar">\r
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
</div>`});var aa,la,ca,ua,pa,da,ma,ha,ya,H,Co,xo,Po,Io,we,fa=p(()=>{ue();ra();ia();fo();vo();ya=[j({selector:"potatno-panel-left",template:sa,style:oa})];we=class extends(ha=P,ma=[x],da=[x],pa=[x],ua=[S("node-drag-start")],ca=[S("function-select")],la=[S("function-add")],aa=[S("function-delete")],ha){constructor(){super(...arguments);g(this,"nodeDefinitions",u(H,24,this,[])),u(H,27,this);g(this,"functions",u(H,28,this,[])),u(H,31,this);g(this,"activeFunctionId",u(H,32,this,"")),u(H,35,this);k(this,Co,u(H,8,this)),u(H,11,this);k(this,xo,u(H,12,this)),u(H,15,this);k(this,Po,u(H,16,this)),u(H,19,this);k(this,Io,u(H,20,this)),u(H,23,this);g(this,"mActiveTabIndex",0)}get activeTabIndex(){return this.mActiveTabIndex}getTabClass(t){return t===this.mActiveTabIndex?"tab-button active":"tab-button"}onTabClick(t){this.mActiveTabIndex=t}onNodeDragStart(t){this.mNodeDragStart.dispatchEvent(t.value)}onFunctionSelect(t){this.mFunctionSelect.dispatchEvent(t.value)}onFunctionAdd(t){this.mFunctionAdd.dispatchEvent(void 0)}onFunctionDelete(t){this.mFunctionDelete.dispatchEvent(t.value)}};H=E(ha),Co=new WeakMap,xo=new WeakMap,Po=new WeakMap,Io=new WeakMap,m(H,4,"mNodeDragStart",ua,we,Co),m(H,4,"mFunctionSelect",ca,we,xo),m(H,4,"mFunctionAdd",la,we,Po),m(H,4,"mFunctionDelete",aa,we,Io),m(H,5,"nodeDefinitions",ma,we),m(H,5,"functions",da,we),m(H,5,"activeFunctionId",pa,we),we=m(H,0,"PotatnoPanelLeft",ya,we),u(H,1,we)});var ba,ga=p(()=>{ba=`:host {\r
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
`});var va,Ta=p(()=>{va=`<div class="properties-header">Properties</div>\r
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
`});var Ca,xa,Pa,Ia,wa,Ea,ka,Aa,Na,Da,Sa,U,wo,be,La=p(()=>{ue();ga();Ta();Sa=[j({selector:"potatno-panel-properties",template:va,style:ba})];be=class extends(Da=P,Na=[x],Aa=[x],ka=[x],Ea=[x],wa=[x],Ia=[x],Pa=[x],xa=[x],Ca=[S("properties-change")],Da){constructor(){super(...arguments);u(U,5,this);g(this,"functionName",u(U,12,this,"")),u(U,15,this);g(this,"functionInputs",u(U,16,this,[])),u(U,19,this);g(this,"functionOutputs",u(U,20,this,[])),u(U,23,this);g(this,"mFunctionImports",[]);g(this,"isSystem",u(U,24,this,!1)),u(U,27,this);g(this,"editableByUser",u(U,28,this,!1)),u(U,31,this);g(this,"mAvailableImports",[]);g(this,"mAvailableTypes",[]);g(this,"mCachedUnusedImports",[]);g(this,"mSelectedImport","");k(this,wo,u(U,8,this)),u(U,11,this)}set functionImports(t){this.mFunctionImports=t,this.rebuildUnusedImports()}get functionImports(){return this.mFunctionImports}get nameDisabled(){return this.isSystem}get portsDisabled(){return this.isSystem&&!this.editableByUser}set availableImports(t){this.mAvailableImports=t,this.rebuildUnusedImports()}get availableImports(){return this.mAvailableImports}set availableTypes(t){this.mAvailableTypes=t}get availableTypes(){return this.mAvailableTypes}validateName(t){return/^[a-zA-Z][a-zA-Z0-9_]*$/.test(t)}isNameDuplicate(t,n,r){if(n!=="function"&&t===this.functionName)return!0;for(let o=0;o<this.functionInputs.length;o++)if(!(n==="input"&&o===r)&&this.functionInputs[o].name===t)return!0;for(let o=0;o<this.functionOutputs.length;o++)if(!(n==="output"&&o===r)&&this.functionOutputs[o].name===t)return!0;return!1}onNameChange(t){let n=t.target,r=n.value,o=!this.validateName(r)||this.isNameDuplicate(r,"function");n.style.borderColor=o?"var(--pn-accent-danger)":"",this.functionName=r,this.mPropertiesChange.dispatchEvent({name:r})}onInputNameChange(t,n){let r=n.target,o=r.value,i=!this.validateName(o)||this.isNameDuplicate(o,"input",t);r.style.borderColor=i?"var(--pn-accent-danger)":"";let a=[...this.functionInputs];a[t]={...a[t],name:o},this.functionInputs=a,this.mPropertiesChange.dispatchEvent({inputs:a})}onInputTypeChange(t,n){let r=n.target.value,o=[...this.functionInputs];o[t]={...o[t],type:r},this.functionInputs=o,this.mPropertiesChange.dispatchEvent({inputs:o})}onOutputNameChange(t,n){let r=n.target,o=r.value,i=!this.validateName(o)||this.isNameDuplicate(o,"output",t);r.style.borderColor=i?"var(--pn-accent-danger)":"";let a=[...this.functionOutputs];a[t]={...a[t],name:o},this.functionOutputs=a,this.mPropertiesChange.dispatchEvent({outputs:a})}onOutputTypeChange(t,n){let r=n.target.value,o=[...this.functionOutputs];o[t]={...o[t],type:r},this.functionOutputs=o,this.mPropertiesChange.dispatchEvent({outputs:o})}onAddInput(){let t=this.mAvailableTypes.length>0?this.mAvailableTypes[0]:"number",n=[...this.functionInputs,{name:"new_input",type:t}];this.functionInputs=n,this.mPropertiesChange.dispatchEvent({inputs:n})}onDeleteInput(t){let n=[...this.functionInputs];n.splice(t,1),this.functionInputs=n,this.mPropertiesChange.dispatchEvent({inputs:n})}onAddOutput(){let t=this.mAvailableTypes.length>0?this.mAvailableTypes[0]:"number",n=[...this.functionOutputs,{name:"new_output",type:t}];this.functionOutputs=n,this.mPropertiesChange.dispatchEvent({outputs:n})}onDeleteOutput(t){let n=[...this.functionOutputs];n.splice(t,1),this.functionOutputs=n,this.mPropertiesChange.dispatchEvent({outputs:n})}get unusedImports(){return this.mCachedUnusedImports}onImportSelectChange(t){this.mSelectedImport=t.target.value}onAddSelectedImport(){let t=this.mSelectedImport||(this.mCachedUnusedImports.length>0?this.mCachedUnusedImports[0]:"");if(!t)return;let n=[...this.mFunctionImports,t];this.functionImports=n,this.mSelectedImport="",this.mPropertiesChange.dispatchEvent({imports:n})}onDeleteImport(t){let n=[...this.mFunctionImports];n.splice(t,1),this.functionImports=n,this.mPropertiesChange.dispatchEvent({imports:n})}rebuildUnusedImports(){let t=new Set(this.mFunctionImports);this.mCachedUnusedImports=this.mAvailableImports.filter(n=>!t.has(n))}};U=E(Da),wo=new WeakMap,m(U,3,"functionImports",Ea,be),m(U,3,"availableImports",Pa,be),m(U,3,"availableTypes",xa,be),m(U,4,"mPropertiesChange",Ca,be,wo),m(U,5,"functionName",Na,be),m(U,5,"functionInputs",Aa,be),m(U,5,"functionOutputs",ka,be),m(U,5,"isSystem",wa,be),m(U,5,"editableByUser",Ia,be),be=m(U,0,"PotatnoPanelProperties",Sa,be),u(U,1,be)});var Ra,Ma=p(()=>{Ra=`:host {\r
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
`});var Fa,Oa=p(()=>{Fa=`<div class="resize-handle" (pointerdown)="this.onResizePointerDown($event)"></div>\r
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
`});var Ba,Ga,Va,ja,Ua,$a,Te,Eo,ko,ze,za=p(()=>{ue();Ma();Oa();$a=[j({selector:"potatno-preview",template:Fa,style:Ra})];ze=class extends(Ua=P,ja=[x,pe("PreviewContent")],Va=[pe("PreviewContainer")],Ga=[x],Ba=[x],Ua){constructor(){super(...arguments);u(Te,5,this);k(this,Eo,u(Te,8,this)),u(Te,11,this);k(this,ko,u(Te,12,this)),u(Te,15,this);g(this,"errors",u(Te,16,this,[])),u(Te,19,this);g(this,"mDragging",!1);g(this,"mStartX",0);g(this,"mStartY",0);g(this,"mStartWidth",0);g(this,"mStartHeight",0)}get hasErrors(){return this.errors.length>0}setContent(t){let n=this.contentElement;for(;n.firstChild;)n.removeChild(n.firstChild);n.appendChild(t)}onResizePointerDown(t){t.preventDefault(),t.stopPropagation(),this.mDragging=!0,this.mStartX=t.clientX,this.mStartY=t.clientY;let n=this.containerElement;if(!n)return;this.mStartWidth=n.offsetWidth,this.mStartHeight=n.offsetHeight,t.target.setPointerCapture(t.pointerId);let r=i=>{if(!this.mDragging)return;let a=this.mStartX-i.clientX,l=this.mStartY-i.clientY,c=Math.max(200,this.mStartWidth+a),h=Math.max(150,this.mStartHeight+l);n.style.width=c+"px",n.style.height=h+"px"},o=i=>{this.mDragging=!1,i.target.releasePointerCapture(i.pointerId),document.removeEventListener("pointermove",r),document.removeEventListener("pointerup",o)};document.addEventListener("pointermove",r),document.addEventListener("pointerup",o)}};Te=E(Ua),Eo=new WeakMap,ko=new WeakMap,m(Te,4,"contentElement",ja,ze,Eo),m(Te,4,"containerElement",Va,ze,ko),m(Te,1,"setContent",Ba,ze),m(Te,5,"errors",Ga,ze),ze=m(Te,0,"PotatnoPreview",$a,ze),u(Te,1,ze)});var Ka,Ha=p(()=>{Ka=`:host {\r
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
`});var Wa,Xa=p(()=>{Wa=`<div #viewport class="viewport" (pointerdown)="this.onPointerDown($event)" (pointermove)="this.onPointerMove($event)" (pointerup)="this.onPointerUp($event)" (wheel)="this.onWheel($event)" (contextmenu)="this.onContextMenu($event)" (keydown)="this.onKeyDown($event)" tabindex="0">\r
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
`});var Za,Ya,_a,qa,Ja,Qa,el,tl,nl,rl,ol,il,sl,O,Ao,No,Do,So,Lo,Mo,Ro,oe,al=p(()=>{ue();co();po();Ha();Xa();sl=[j({selector:"potatno-canvas",template:Wa,style:Ka})];oe=class extends(il=P,ol=[x],rl=[x],nl=[x],tl=[x],el=[S("canvas-connect")],Qa=[S("canvas-delete")],Ja=[S("canvas-node-move")],qa=[S("canvas-node-select")],_a=[S("canvas-select")],Ya=[pe("svgLayer")],Za=[pe("viewport")],il){constructor(){super();g(this,"connections",u(O,36,this,[])),u(O,39,this);g(this,"gridSize",u(O,40,this,20)),u(O,43,this);g(this,"nodes",u(O,44,this,[])),u(O,47,this);g(this,"selectedNodeIds",u(O,48,this,new Set)),u(O,51,this);k(this,Ao,u(O,8,this)),u(O,11,this);k(this,No,u(O,12,this)),u(O,15,this);k(this,Do,u(O,16,this)),u(O,19,this);k(this,So,u(O,20,this)),u(O,23,this);k(this,Lo,u(O,24,this)),u(O,27,this);k(this,Mo,u(O,28,this)),u(O,31,this);k(this,Ro,u(O,32,this)),u(O,35,this);g(this,"mDragNodeId",null);g(this,"mDragStartWorldX",0);g(this,"mDragStartWorldY",0);g(this,"mInteraction");g(this,"mMode","idle");g(this,"mPointerId",null);g(this,"mRenderer");g(this,"mWireColor","var(--pn-accent-primary)");g(this,"mWirePortKind","");g(this,"mWireSourceNodeId","");g(this,"mWireSourcePortId","");g(this,"mWireStartWorld",{x:0,y:0});this.mInteraction=new Kt(this.gridSize),this.mRenderer=new Xt}get gridStyle(){let t=`transform: ${this.mInteraction.getTransformCss()}`,n=this.mInteraction.getGridBackgroundCss();return`${t}; ${n}`}get selectionBoxStyle(){let t=this.mInteraction.selectionStart,n=this.mInteraction.selectionEnd;if(!t||!n)return"display: none";let r=this.mInteraction.worldToScreen(t.x,t.y),o=this.mInteraction.worldToScreen(n.x,n.y),i=Math.min(r.x,o.x),a=Math.min(r.y,o.y),l=Math.abs(o.x-r.x),c=Math.abs(o.y-r.y);return`left: ${i}px; top: ${a}px; width: ${l}px; height: ${c}px`}get showSelectionBox(){return this.mMode==="selectingBox"&&this.mInteraction.selectionStart!==null&&this.mInteraction.selectionEnd!==null}onContextMenu(t){t.preventDefault()}onKeyDown(t){(t.key==="Delete"||t.key==="Backspace")&&this.selectedNodeIds.size>0&&this.mDeleteEvent.dispatchEvent({nodeIds:new Set(this.selectedNodeIds)})}onPointerDown(t){if(this.mMode!=="idle")return;let n=t.target,r=this.mViewport.getBoundingClientRect(),o=t.clientX-r.left,i=t.clientY-r.top;if(t.button===1){this.mMode="panning",this.mPointerId=t.pointerId,this.mViewport.setPointerCapture(t.pointerId),this.mViewport.classList.add("panning"),t.preventDefault();return}if(t.button===0){let a=n.closest("[data-port-id]");if(a){this.beginWireDrag(a,o,i),this.mPointerId=t.pointerId,this.mViewport.setPointerCapture(t.pointerId),t.preventDefault();return}let l=n.closest("[data-node-id]");if(l){this.beginNodeDrag(l,o,i,t.shiftKey||t.ctrlKey||t.metaKey),this.mPointerId=t.pointerId,this.mViewport.setPointerCapture(t.pointerId),t.preventDefault();return}this.beginSelectionBox(o,i),this.mPointerId=t.pointerId,this.mViewport.setPointerCapture(t.pointerId),t.preventDefault()}}onPointerMove(t){if(this.mPointerId!==t.pointerId)return;let n=this.mViewport.getBoundingClientRect(),r=t.clientX-n.left,o=t.clientY-n.top;switch(this.mMode){case"panning":this.mInteraction.pan(t.movementX,t.movementY),this.updateConnections();break;case"draggingNode":this.updateNodeDrag(r,o);break;case"draggingWire":this.updateWireDrag(r,o);break;case"selectingBox":this.updateSelectionBox(r,o);break}}onPointerUp(t){if(this.mPointerId!==t.pointerId)return;let n=t.target;switch(this.mMode){case"panning":this.mViewport.classList.remove("panning");break;case"draggingNode":this.endNodeDrag();break;case"draggingWire":this.endWireDrag(n);break;case"selectingBox":this.endSelectionBox();break}this.mPointerId!==null&&this.mViewport.releasePointerCapture(this.mPointerId),this.mPointerId=null,this.mMode="idle"}onWheel(t){t.preventDefault();let n=this.mViewport.getBoundingClientRect(),r=t.clientX-n.left,o=t.clientY-n.top;this.mInteraction.zoomAt(r,o,t.deltaY),this.updateConnections()}updateConnections(){this.mRenderer.renderConnections(this.mSvgLayer,this.connections)}beginNodeDrag(t,n,r,o){let i=t.dataset.nodeId;if(!i)return;this.mMode="draggingNode",this.mDragNodeId=i;let a=this.mInteraction.screenToWorld(n,r);this.mDragStartWorldX=a.x,this.mDragStartWorldY=a.y,this.mNodeSelectEvent.dispatchEvent({nodeId:i,additive:o})}beginSelectionBox(t,n){this.mMode="selectingBox";let r=this.mInteraction.screenToWorld(t,n);this.mInteraction.setSelectionStart(r.x,r.y),this.mInteraction.setSelectionEnd(r.x,r.y)}beginWireDrag(t,n,r){this.mMode="draggingWire",this.mWireSourceNodeId=t.dataset.nodeId??"",this.mWireSourcePortId=t.dataset.portId??"",this.mWirePortKind=t.dataset.portKind??"",this.mWireColor=t.dataset.portColor??"var(--pn-accent-primary)";let o=this.mInteraction.screenToWorld(n,r);this.mWireStartWorld={x:o.x,y:o.y}}endNodeDrag(){if(!this.mDragNodeId)return;let t=this.nodes.find(n=>n.id===this.mDragNodeId);if(t){let n=this.mInteraction.snapToGrid(t.x,t.y);this.mNodeMoveEvent.dispatchEvent({nodeId:this.mDragNodeId,newX:n.x,newY:n.y})}this.mDragNodeId=null}endSelectionBox(){let t=this.mInteraction.selectionStart,n=this.mInteraction.selectionEnd;if(t&&n){let r=Math.min(t.x,n.x),o=Math.min(t.y,n.y),i=Math.max(t.x,n.x),a=Math.max(t.y,n.y),l=new Set;for(let c of this.nodes){let h=c.x+c.width,d=c.y+c.height;c.x<i&&h>r&&c.y<a&&d>o&&l.add(c.id)}this.mSelectEvent.dispatchEvent({nodeIds:l})}this.mInteraction.clearSelection()}endWireDrag(t){this.mRenderer.clearTempConnection(this.mSvgLayer);let n=t.closest("[data-port-id]");if(n){let r=n.dataset.nodeId??"",o=n.dataset.portId??"";r&&o&&(r!==this.mWireSourceNodeId||o!==this.mWireSourcePortId)&&this.mConnectEvent.dispatchEvent({sourceNodeId:this.mWireSourceNodeId,sourcePortId:this.mWireSourcePortId,targetNodeId:r,targetPortId:o,portKind:this.mWirePortKind})}this.mWireSourceNodeId="",this.mWireSourcePortId="",this.mWirePortKind=""}updateNodeDrag(t,n){if(!this.mDragNodeId)return;let r=this.mInteraction.screenToWorld(t,n),o=r.x-this.mDragStartWorldX,i=r.y-this.mDragStartWorldY;this.mDragStartWorldX=r.x,this.mDragStartWorldY=r.y;let a=this.nodes.find(l=>l.id===this.mDragNodeId);a&&this.mNodeMoveEvent.dispatchEvent({nodeId:this.mDragNodeId,newX:a.x+o,newY:a.y+i}),this.updateConnections()}updateSelectionBox(t,n){let r=this.mInteraction.screenToWorld(t,n);this.mInteraction.setSelectionEnd(r.x,r.y)}updateWireDrag(t,n){let r=this.mInteraction.screenToWorld(t,n);this.mRenderer.renderTempConnection(this.mSvgLayer,this.mWireStartWorld,r,this.mWireColor)}};O=E(il),Ao=new WeakMap,No=new WeakMap,Do=new WeakMap,So=new WeakMap,Lo=new WeakMap,Mo=new WeakMap,Ro=new WeakMap,m(O,4,"mConnectEvent",el,oe,Ao),m(O,4,"mDeleteEvent",Qa,oe,No),m(O,4,"mNodeMoveEvent",Ja,oe,Do),m(O,4,"mNodeSelectEvent",qa,oe,So),m(O,4,"mSelectEvent",_a,oe,Lo),m(O,4,"mSvgLayer",Ya,oe,Mo),m(O,4,"mViewport",Za,oe,Ro),m(O,5,"connections",ol,oe),m(O,5,"gridSize",rl,oe),m(O,5,"nodes",nl,oe),m(O,5,"selectedNodeIds",tl,oe),oe=m(O,0,"PotatnoCanvas",sl,oe),u(O,1,oe)});var cl,ll=p(()=>{cl=`:host {\r
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
`});var pl,ul=p(()=>{pl=`$if(this.nodeData) {\r
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
`});var ml,dl=p(()=>{ml=`:host {\r
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
`});var yl,hl=p(()=>{yl=`<div [className]="this.portWrapperClasses" [title]="this.type">\r
    <div #portCircle [className]="this.portCircleClasses" style="--port-color: {{this.portColor}}"\r
         (pointerdown)="this.onPointerDown($event)"\r
         (pointerenter)="this.onPointerEnter($event)"\r
         (pointerleave)="this.onPointerLeave($event)">\r
    </div>\r
    <span class="port-label">{{this.name}}</span>\r
</div>\r
`});var fl,gl,bl,Tl,vl,Cl,xl,Pl,Il,wl,El,kl,Al,Nl,M,Oo,Fo,Bo,Go,te,Vo=p(()=>{ue();dl();hl();Nl=[j({selector:"potatno-port",template:yl,style:ml})];te=class extends(Al=P,kl=[x],El=[x],wl=[x],Il=[x],Pl=[x],xl=[x],Cl=[x],vl=[x],Tl=[S("port-drag-start")],bl=[S("port-hover")],gl=[S("port-leave")],fl=[pe("portCircle")],Al){constructor(){super(...arguments);g(this,"name",u(M,24,this,"")),u(M,27,this);g(this,"type",u(M,28,this,"")),u(M,31,this);g(this,"portId",u(M,32,this,"")),u(M,35,this);g(this,"nodeId",u(M,36,this,"")),u(M,39,this);g(this,"direction",u(M,40,this,"input")),u(M,43,this);g(this,"connected",u(M,44,this,!1)),u(M,47,this);g(this,"invalid",u(M,48,this,!1)),u(M,51,this);g(this,"portKind",u(M,52,this,"data")),u(M,55,this);k(this,Oo,u(M,8,this)),u(M,11,this);k(this,Fo,u(M,12,this)),u(M,15,this);k(this,Bo,u(M,16,this)),u(M,19,this);k(this,Go,u(M,20,this)),u(M,23,this)}get portWrapperClasses(){return this.direction==="output"?"port-wrapper direction-output":"port-wrapper direction-input"}get portCircleClasses(){let t=["port-circle"];return this.connected?t.push("connected"):t.push("disconnected"),this.invalid&&t.push("invalid"),t.push(this.direction==="output"?"direction-output":"direction-input"),t.join(" ")}get portColor(){return this.portKind==="flow"?"var(--pn-text-primary)":this.getTypeColor(this.type)}onPointerDown(t){t.stopPropagation(),t.preventDefault(),this.mPortDragStart.dispatchEvent({nodeId:this.nodeId,portId:this.portId,portKind:this.portKind,direction:this.direction,type:this.type,element:this.portCircleElement})}onPointerEnter(t){this.mPortHover.dispatchEvent({nodeId:this.nodeId,portId:this.portId,portKind:this.portKind,direction:this.direction,type:this.type,element:this.portCircleElement})}onPointerLeave(t){this.mPortLeave.dispatchEvent(void 0)}getTypeColor(t){let n=0;for(let i=0;i<t.length;i++)n=t.charCodeAt(i)+((n<<5)-n);return`hsl(${Math.abs(n)%256*137.508%360}, 70%, 60%)`}};M=E(Al),Oo=new WeakMap,Fo=new WeakMap,Bo=new WeakMap,Go=new WeakMap,m(M,4,"mPortDragStart",Tl,te,Oo),m(M,4,"mPortHover",bl,te,Fo),m(M,4,"mPortLeave",gl,te,Bo),m(M,4,"portCircleElement",fl,te,Go),m(M,5,"name",kl,te),m(M,5,"type",El,te),m(M,5,"portId",wl,te),m(M,5,"nodeId",Il,te),m(M,5,"direction",Pl,te),m(M,5,"connected",xl,te),m(M,5,"invalid",Cl,te),m(M,5,"portKind",vl,te),te=m(M,0,"PotatnoPortComponent",Nl,te),u(M,1,te)});var Dl,Sl,Ll,Ml,Rl,Ol,Fl,Bl,Gl,Vl,jl,Ul,$l,zl,R,jo,Uo,$o,zo,Ho,Ko,Xo,Wo,Zo,ne,Hl=p(()=>{ue();xt();ll();ul();Vo();zl=[j({selector:"potatno-node",template:pl,style:cl})];ne=class extends($l=P,Ul=[x],jl=[x],Vl=[x],Gl=[S("node-select")],Bl=[S("node-drag-start")],Fl=[S("port-drag-start")],Ol=[S("port-hover")],Rl=[S("port-leave")],Ml=[S("open-function")],Ll=[S("value-change")],Sl=[S("comment-change")],Dl=[S("resize-start")],$l){constructor(){super(...arguments);g(this,"nodeData",u(R,44,this,null)),u(R,47,this);g(this,"selected",u(R,48,this,!1)),u(R,51,this);g(this,"gridSize",u(R,52,this,20)),u(R,55,this);k(this,jo,u(R,8,this)),u(R,11,this);k(this,Uo,u(R,12,this)),u(R,15,this);k(this,$o,u(R,16,this)),u(R,19,this);k(this,zo,u(R,20,this)),u(R,23,this);k(this,Ho,u(R,24,this)),u(R,27,this);k(this,Ko,u(R,28,this)),u(R,31,this);k(this,Xo,u(R,32,this)),u(R,35,this);k(this,Wo,u(R,36,this)),u(R,39,this);k(this,Zo,u(R,40,this)),u(R,43,this)}get nodeStyle(){return this.nodeData?`left: ${this.nodeData.position.x*this.gridSize}px; top: ${this.nodeData.position.y*this.gridSize}px; width: ${this.nodeData.size.w*this.gridSize}px;`:""}get nodeId(){return this.nodeData?.id??""}get selectedClass(){return this.selected?"selected":""}get isComment(){return this.nodeData?.category==="comment"}get commentSizeStyle(){return this.nodeData?`height: ${this.nodeData.size.h*this.gridSize}px;`:""}get isValue(){return this.nodeData?.category==="value"}get isFunction(){return this.nodeData?.category==="function"}get showOpenButton(){return!1}get inputPorts(){return this.nodeData?.inputs??[]}get outputPorts(){return this.nodeData?.outputs??[]}get flowInputPorts(){return this.nodeData?.flowInputs??[]}get flowOutputPorts(){return this.nodeData?.flowOutputs??[]}onNodePointerDown(t){t.target.tagName?.toLowerCase()!=="potatno-port"&&(this.mNodeSelect.dispatchEvent({nodeId:this.nodeId,shiftKey:t.shiftKey}),this.mNodeDragStart.dispatchEvent({nodeId:this.nodeId,startX:t.clientX,startY:t.clientY}))}onPortDragStart(t){this.mPortDragStart.dispatchEvent(t.value)}onPortHover(t){this.mPortHover.dispatchEvent(t.value)}onPortLeave(t){this.mPortLeave.dispatchEvent(void 0)}onOpenFunction(t){t.stopPropagation(),this.mOpenFunction.dispatchEvent({definitionName:this.nodeData?.definitionName??""})}onValueInput(t){let n=t.target;this.mValueChange.dispatchEvent({nodeId:this.nodeId,property:"value",value:n.value})}onCommentInput(t){let n=t.target;this.mCommentChange.dispatchEvent({nodeId:this.nodeId,text:n.value})}onResizeStart(t){t.stopPropagation(),t.preventDefault(),this.mResizeStart.dispatchEvent({nodeId:this.nodeId,startX:t.clientX,startY:t.clientY})}};R=E($l),jo=new WeakMap,Uo=new WeakMap,$o=new WeakMap,zo=new WeakMap,Ho=new WeakMap,Ko=new WeakMap,Xo=new WeakMap,Wo=new WeakMap,Zo=new WeakMap,m(R,4,"mNodeSelect",Gl,ne,jo),m(R,4,"mNodeDragStart",Bl,ne,Uo),m(R,4,"mPortDragStart",Fl,ne,$o),m(R,4,"mPortHover",Ol,ne,zo),m(R,4,"mPortLeave",Rl,ne,Ho),m(R,4,"mOpenFunction",Ml,ne,Ko),m(R,4,"mValueChange",Ll,ne,Xo),m(R,4,"mCommentChange",Sl,ne,Wo),m(R,4,"mResizeStart",Dl,ne,Zo),m(R,5,"nodeData",Ul,ne),m(R,5,"selected",jl,ne),m(R,5,"gridSize",Vl,ne),ne=m(R,0,"PotatnoNodeComponent",zl,ne),u(R,1,ne)});var Xl,Kl=p(()=>{Xl=`.tabs-header {\r
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
`});var Zl,Wl=p(()=>{Zl=`<div class="tabs-header">\r
    $for(tab of this.tabs; index = $index) {\r
        <button [className]="this.getTabClass(this.index)" (click)="this.onTabClick(this.index)">{{this.tab}}</button>\r
    }\r
</div>\r
<div class="tabs-content">\r
    $slot\r
</div>\r
`});var Yl,_l,ql,Jl,Ql,Ee,Yo,rt,ec=p(()=>{ue();Kl();Wl();Ql=[j({selector:"potatno-tabs",template:Zl,style:Xl})];rt=class extends(Jl=P,ql=[x],_l=[x],Yl=[S("tab-change")],Jl){constructor(){super(...arguments);g(this,"tabs",u(Ee,12,this,[])),u(Ee,15,this);g(this,"activeIndex",u(Ee,16,this,0)),u(Ee,19,this);k(this,Yo,u(Ee,8,this)),u(Ee,11,this)}getTabClass(t){return t===this.activeIndex?"tab-button active":"tab-button"}onTabClick(t){this.activeIndex=t,this.mTabChange.dispatchEvent(t)}};Ee=E(Jl),Yo=new WeakMap,m(Ee,4,"mTabChange",Yl,rt,Yo),m(Ee,5,"tabs",ql,rt),m(Ee,5,"activeIndex",_l,rt),rt=m(Ee,0,"PotatnoTabs",Ql,rt),u(Ee,1,rt)});var nc,tc=p(()=>{nc=`.resize-handle {\r
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
`});var oc,rc=p(()=>{oc=`<div [className]="this.getHandleClass()" (pointerdown)="this.onPointerDown($event)"></div>\r
`});var ic,sc,ac,lc,He,_o,It,cc=p(()=>{ue();tc();rc();lc=[j({selector:"potatno-resize-handle",template:oc,style:nc})];It=class extends(ac=P,sc=[x],ic=[S("resize")],ac){constructor(){super(...arguments);g(this,"direction",u(He,12,this,"vertical")),u(He,15,this);k(this,_o,u(He,8,this)),u(He,11,this);g(this,"mDragging",!1);g(this,"mStartPosition",0)}getHandleClass(){return`resize-handle ${this.direction}`}onPointerDown(t){t.preventDefault(),this.mDragging=!0,this.mStartPosition=this.direction==="vertical"?t.clientX:t.clientY,t.target.setPointerCapture(t.pointerId);let n=o=>{if(!this.mDragging)return;let i=this.direction==="vertical"?o.clientX:o.clientY,a=i-this.mStartPosition;this.mStartPosition=i,this.mResize.dispatchEvent({delta:a})},r=o=>{this.mDragging=!1,o.target.releasePointerCapture(o.pointerId),document.removeEventListener("pointermove",n),document.removeEventListener("pointerup",r)};document.addEventListener("pointermove",n),document.addEventListener("pointerup",r)}};He=E(ac),_o=new WeakMap,m(He,4,"mResize",ic,It,_o),m(He,5,"direction",sc,It),It=m(He,0,"PotatnoResizeHandle",lc,It),u(He,1,It)});var pc,uc=p(()=>{pc=`.search-wrapper {\r
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
`});var mc,dc=p(()=>{mc=`<div class="search-wrapper">\r
    <svg class="search-icon" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">\r
        <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" stroke-width="1.5"/>\r
        <line x1="10.5" y1="10.5" x2="14.5" y2="14.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>\r
    </svg>\r
    <input class="search-field" type="text" [placeholder]="this.placeholder" [value]="this.value" (input)="this.onInput($event)"/>\r
</div>\r
`});var hc,yc,fc,gc,bc,ke,qo,ot,Tc=p(()=>{ue();uc();dc();bc=[j({selector:"potatno-search-input",template:mc,style:pc})];ot=class extends(gc=P,fc=[x],yc=[x],hc=[S("search-change")],gc){constructor(){super(...arguments);g(this,"placeholder",u(ke,12,this,"Search...")),u(ke,15,this);g(this,"value",u(ke,16,this,"")),u(ke,19,this);k(this,qo,u(ke,8,this)),u(ke,11,this)}onInput(t){let n=t.target;this.value=n.value,this.mSearchChange.dispatchEvent(this.value)}};ke=E(gc),qo=new WeakMap,m(ke,4,"mSearchChange",hc,ot,qo),m(ke,5,"placeholder",fc,ot),m(ke,5,"value",yc,ot),ot=m(ke,0,"PotatnoSearchInput",bc,ot),u(ke,1,ot)});var wt,G,Jo,Qo,vc,Cc,xc,Pc,Ic,wc,Ec,kc,Ac,Nc,Y,ei,ti,ni,ri,de,Dc=p(()=>{ue();fs();bs();lo();Is();ws();co();po();Rs();Os();xt();Ht();ho();ho();Fs();Bs();fo();vo();fa();La();za();al();Hl();Vo();ec();cc();Tc();wt=new Map,G=new Map,Jo=new Map,Qo=new Map;Nc=[j({selector:"potatno-code-editor",template:Ts,style:gs})];de=class extends(Ac=P,kc=[pe("svgLayer")],Ec=[pe("canvasWrapper")],wc=[pe("panelLeft")],Ic=[pe("panelRight")],Pc=[x],xc=[x],Cc=[x],vc=[x],Ac){constructor(){super();u(Y,5,this);g(this,"mInstanceKey");g(this,"mShowSelectionBox");g(this,"mSelectionBoxScreen");g(this,"mPreviewDebounceTimer");g(this,"mKeyboardHandler");g(this,"mResizeState");g(this,"mResizeMoveHandler");g(this,"mResizeUpHandler");g(this,"mCacheVersion");k(this,ei,u(Y,8,this)),u(Y,11,this);k(this,ti,u(Y,12,this)),u(Y,15,this);k(this,ni,u(Y,16,this)),u(Y,19,this);k(this,ri,u(Y,20,this)),u(Y,23,this);this.mInstanceKey=crypto.randomUUID(),Jo.set(this.mInstanceKey,new Set),Qo.set(this.mInstanceKey,{history:new tr,clipboard:new nr,interaction:new Kt(20),renderer:new Xt,hoveredPort:null,interactionState:{mode:"idle"},previewInitialized:!1,cachedData:{activeFunctionId:"",activeFunctionName:"",activeFunctionIsSystem:!1,activeFunctionEditableByUser:!1,errors:[],hasPreview:!1,nodeDefinitionList:[],functionList:[],availableImports:[],availableTypes:[],activeFunctionInputs:[],activeFunctionOutputs:[],activeFunctionImports:[],visibleNodes:[]}}),this.mShowSelectionBox=!1,this.mSelectionBoxScreen={x1:0,y1:0,x2:0,y2:0},this.mPreviewDebounceTimer=0,this.mKeyboardHandler=null,this.mResizeState=null,this.mResizeMoveHandler=null,this.mResizeUpHandler=null,this.mCacheVersion=0}get project(){return this.getProject()}set project(t){wt.set(this.mInstanceKey,t),this.rebuildCachedData()}get file(){return G.get(this.mInstanceKey)??null}set file(t){if(t){G.set(this.mInstanceKey,t);let n=wt.get(this.mInstanceKey);n&&t.functions.size===0&&this.initializeMainFunctions(t,n.configuration)}else G.delete(this.mInstanceKey);this.getSelectedIds().clear(),this.getInternals().history.clear(),this.getInternals().previewInitialized=!1,this.rebuildCachedData(),this.renderConnections(),this.initializePreview(),this.updatePreview()}get activeFunctionId(){return this.mCacheVersion,this.getInternals().cachedData.activeFunctionId}get interaction(){return this.getInternals().interaction}get showSelectionBox(){return this.mShowSelectionBox}get hasPreview(){return this.mCacheVersion,this.getInternals().cachedData.hasPreview}get editorErrors(){return this.mCacheVersion,this.getInternals().cachedData.errors}get gridBackgroundStyle(){return this.getInternals().interaction.getGridBackgroundCss()}get gridTransformStyle(){return"transform: "+this.getInternals().interaction.getTransformCss()}get selectionBoxStyle(){if(!this.mShowSelectionBox)return"display: none";let t=Math.min(this.mSelectionBoxScreen.x1,this.mSelectionBoxScreen.x2),n=Math.min(this.mSelectionBoxScreen.y1,this.mSelectionBoxScreen.y2),r=Math.abs(this.mSelectionBoxScreen.x2-this.mSelectionBoxScreen.x1),o=Math.abs(this.mSelectionBoxScreen.y2-this.mSelectionBoxScreen.y1);return`left: ${t}px; top: ${n}px; width: ${r}px; height: ${o}px`}get visibleNodes(){return this.mCacheVersion,this.getInternals().cachedData.visibleNodes}get nodeDefinitionList(){return this.mCacheVersion,this.getInternals().cachedData.nodeDefinitionList}get functionList(){return this.mCacheVersion,this.getInternals().cachedData.functionList}get activeFunctionName(){return this.mCacheVersion,this.getInternals().cachedData.activeFunctionName}get activeFunctionInputs(){return this.mCacheVersion,this.getInternals().cachedData.activeFunctionInputs}get activeFunctionOutputs(){return this.mCacheVersion,this.getInternals().cachedData.activeFunctionOutputs}get activeFunctionImports(){return this.mCacheVersion,this.getInternals().cachedData.activeFunctionImports}get activeFunctionIsSystem(){return this.mCacheVersion,this.getInternals().cachedData.activeFunctionIsSystem}get activeFunctionEditableByUser(){return this.mCacheVersion,this.getInternals().cachedData.activeFunctionEditableByUser}get availableImportsList(){return this.mCacheVersion,this.getInternals().cachedData.availableImports}get availableTypes(){return this.mCacheVersion,this.getInternals().cachedData.availableTypes}getProject(){return wt.get(this.mInstanceKey)}getFile(){return G.get(this.mInstanceKey)}getSelectedIds(){return Jo.get(this.mInstanceKey)}getInternals(){return Qo.get(this.mInstanceKey)}loadCode(t){let n=this.getProject(),o=new pr(n.configuration).deserialize(t);G.set(this.mInstanceKey,o),this.getInternals().history.clear(),this.getSelectedIds().clear(),this.getInternals().previewInitialized=!1,this.rebuildCachedData(),this.renderConnections(),this.initializePreview(),this.updatePreview()}generateCode(){let t=this.getProject(),n=G.get(this.mInstanceKey);return n?new An(t.configuration).serialize(n):""}onConnect(){this.mKeyboardHandler=t=>this.onKeyDown(t),document.addEventListener("keydown",this.mKeyboardHandler)}onDeconstruct(){this.mKeyboardHandler&&document.removeEventListener("keydown",this.mKeyboardHandler),wt.delete(this.mInstanceKey),G.delete(this.mInstanceKey),Jo.delete(this.mInstanceKey),Qo.delete(this.mInstanceKey)}onNodeDragFromLibrary(t){let n=t.value??t.detail?.value??t,r=this.getProject(),o=G.get(this.mInstanceKey);if(!o)return;let i=r.configuration.nodeDefinitions.get(n);if(!i){for(let I of o.functions.values())if(I.name===n&&!I.system){i={name:I.name,category:"function",inputs:[...I.inputs],outputs:[...I.outputs]};break}}if(!i)return;let a=o.activeFunction?.graph;if(!a)return;let l=this.getInternals(),c=this.canvasWrapper,h=c&&c.clientWidth||800,d=c&&c.clientHeight||600,y=l.interaction.screenToWorld(h/2,d/2),b=l.interaction.snapToGrid(y.x,y.y),N=new Nn(a,i,{x:b.x/l.interaction.gridSize,y:b.y/l.interaction.gridSize});l.history.push(N),this.rebuildCachedData(),this.renderConnections(),this.updatePreview()}onFunctionSelect(t){let n=t.value??t.detail?.value??t,r=G.get(this.mInstanceKey);r&&(r.setActiveFunction(n),this.getSelectedIds().clear(),this.rebuildCachedData(),this.renderConnections())}onFunctionAdd(){let t=G.get(this.mInstanceKey);if(!t)return;let n=this.getInternals().cachedData.functionList.length,r=new Ct(crypto.randomUUID(),`function_${n}`,`Function ${n}`,!1);t.addFunction(r),t.setActiveFunction(r.id),this.getSelectedIds().clear(),this.rebuildCachedData(),this.renderConnections()}onFunctionDelete(t){let n=t.value??t.detail?.value??t,r=G.get(this.mInstanceKey);r&&(r.removeFunction(n),this.getSelectedIds().clear(),this.rebuildCachedData(),this.renderConnections(),this.updatePreview())}onPropertiesChange(t){let n=G.get(this.mInstanceKey);if(!n)return;let r=n.activeFunction;if(!r)return;let o=t.value??t.detail?.value??t;o.name!==void 0&&(r.setName(o.name),r.setLabel(o.name)),o.inputs!==void 0&&r.setInputs(o.inputs),o.outputs!==void 0&&r.setOutputs(o.outputs),o.imports!==void 0&&r.setImports(o.imports),r.graph.validate(),this.rebuildCachedData(),this.renderConnections(),this.updatePreview()}onCanvasPointerDown(t){let n=this.getInternals();if(t.button===1){t.preventDefault(),n.interactionState={mode:"panning",startX:t.clientX,startY:t.clientY},t.currentTarget.setPointerCapture(t.pointerId);return}if(t.button===0){t.ctrlKey||(this.getSelectedIds().clear(),this.rebuildCachedData());let r=this.canvasWrapper.getBoundingClientRect(),o=t.clientX-r.left,i=t.clientY-r.top;n.interactionState={mode:"selecting",startX:o,startY:i},this.mSelectionBoxScreen={x1:o,y1:i,x2:o,y2:i},this.mShowSelectionBox=!1,t.currentTarget.setPointerCapture(t.pointerId)}}onCanvasPointerMove(t){let n=this.getInternals(),r=n.interactionState;if(r.mode==="panning"){let o=t.clientX-r.startX,i=t.clientY-r.startY;n.interaction.pan(o,i),r.startX=t.clientX,r.startY=t.clientY,this.renderConnections();return}if(r.mode==="dragging-node"){let o=G.get(this.mInstanceKey);if(!o)return;let i=(t.clientX-r.startX)/n.interaction.zoom,a=(t.clientY-r.startY)/n.interaction.zoom;for(let l of r.origins){let c=l.originX+i,h=l.originY+a,d=n.interaction.snapToGrid(c,h),y=o.activeFunction?.graph.getNode(l.nodeId);y&&(y.moveTo(d.x/n.interaction.gridSize,d.y/n.interaction.gridSize),this.updateNodePosition(l.nodeId))}this.renderConnections();return}if(r.mode==="dragging-wire"){let o=this.canvasWrapper.getBoundingClientRect(),i=(t.clientX-o.left-n.interaction.panX)/n.interaction.zoom,a=(t.clientY-o.top-n.interaction.panY)/n.interaction.zoom;n.renderer.renderTempConnection(this.svgLayer,{x:r.startX,y:r.startY},{x:i,y:a},"#bac2de");return}if(r.mode==="selecting"){let o=this.canvasWrapper.getBoundingClientRect();this.mSelectionBoxScreen.x2=t.clientX-o.left,this.mSelectionBoxScreen.y2=t.clientY-o.top;let i=Math.abs(this.mSelectionBoxScreen.x2-this.mSelectionBoxScreen.x1),a=Math.abs(this.mSelectionBoxScreen.y2-this.mSelectionBoxScreen.y1);(i>5||a>5)&&(this.mShowSelectionBox=!0);return}if(r.mode==="resizing-comment"){let o=G.get(this.mInstanceKey);if(!o)return;let i=(t.clientX-r.startX)/n.interaction.zoom,a=(t.clientY-r.startY)/n.interaction.zoom,l=n.interaction.gridSize,c=r.originalW+Math.round(i/l),h=r.originalH+Math.round(a/l),d=o.activeFunction?.graph.getNode(r.nodeId);d&&(d.resizeTo(c,h),this.updateNodeSize(r.nodeId));return}}onCanvasPointerUp(t){let n=this.getInternals();if(n.interactionState.mode==="dragging-node"&&(this.rebuildCachedData(),this.renderConnections(),this.updatePreview()),n.interactionState.mode==="dragging-wire"&&(n.renderer.clearTempConnection(this.svgLayer),n.hoveredPort)){let r=n.hoveredPort;if(n.interactionState.direction!==r.direction&&n.interactionState.portKind===r.portKind){let i=G.get(this.mInstanceKey)?.activeFunction?.graph;if(i){let a=n.interactionState.portKind==="data"?"data":"flow",l,c,h,d;n.interactionState.direction==="output"?(l=n.interactionState.sourceNodeId,c=n.interactionState.sourcePortId,h=r.nodeId,d=r.portId):(l=r.nodeId,c=r.portId,h=n.interactionState.sourceNodeId,d=n.interactionState.sourcePortId),i.addConnection(l,c,h,d,a),this.rebuildCachedData(),this.renderConnections(),this.updatePreview()}}}n.interactionState.mode==="selecting"&&(this.mShowSelectionBox=!1,this.selectNodesInBox()),n.interactionState.mode==="resizing-comment"&&this.rebuildCachedData(),n.interactionState={mode:"idle"},t.currentTarget.releasePointerCapture(t.pointerId)}onCanvasWheel(t){t.preventDefault();let n=this.canvasWrapper.getBoundingClientRect(),r=t.clientX-n.left,o=t.clientY-n.top;this.getInternals().interaction.zoomAt(r,o,t.deltaY>0?-.1:.1),this.renderConnections()}onContextMenu(t){t.preventDefault()}onNodePointerDown(t,n){let r=t.composedPath();for(let d of r)if(d.tagName?.toLowerCase()==="potatno-port")return;if(t.stopPropagation(),t.button!==0)return;let o=n.id,i=this.getInternals(),a=this.getSelectedIds(),l=G.get(this.mInstanceKey);if(!l)return;t.ctrlKey?a.has(o)?a.delete(o):a.add(o):a.has(o)||(a.clear(),a.add(o)),this.rebuildCachedData();let c=[],h=l.activeFunction?.graph;for(let d of a){let y=h?.getNode(d);y&&c.push({nodeId:d,originX:y.position.x*i.interaction.gridSize,originY:y.position.y*i.interaction.gridSize})}if(h){let d=h.getNode(o);if(d&&d.category==="comment"){let y=i.interaction.gridSize,b=d.position.x*y,N=d.position.y*y,I=b+d.size.w*y,T=N+d.size.h*y;for(let w of h.nodes.values()){if(w.id===o||a.has(w.id)||w.category==="comment")continue;let D=w.position.x*y,F=w.position.y*y;D>=b&&D<=I&&F>=N&&F<=T&&c.push({nodeId:w.id,originX:D,originY:F})}}}c.length>0&&(i.interactionState={mode:"dragging-node",nodeId:o,startX:t.clientX,startY:t.clientY,origins:c},this.canvasWrapper.setPointerCapture(t.pointerId))}onPortDragStart(t){let n=t.value??t.detail?.value??t,o=G.get(this.mInstanceKey)?.activeFunction?.graph;if(!o)return;let i=o.getNode(n.nodeId);if(!i)return;let a=this.getInternals(),l=a.interaction.gridSize,c=i.position.x*l,h=i.position.y*l,d=i.size.w*l,y=28,b=24,N,I;if(n.portKind==="flow")N=n.direction==="output"?c+d:c,I=h+y/2;else{let T=0;if(n.direction==="output"){let w=0;for(let D of i.outputs.values()){if(D.id===n.portId){T=w;break}w++}N=c+d}else{let w=0;for(let D of i.inputs.values()){if(D.id===n.portId){T=w;break}w++}N=c}I=h+y+(T+.5)*b}a.interactionState={mode:"dragging-wire",sourceNodeId:n.nodeId,sourcePortId:n.portId,portKind:n.portKind,direction:n.direction,type:n.type,startX:N,startY:I}}onPortHover(t){let n=t.value??t.detail?.value??t;this.getInternals().hoveredPort={nodeId:n.nodeId,portId:n.portId,portKind:n.portKind,direction:n.direction,type:n.type}}onPortLeave(){this.getInternals().hoveredPort=null}onNodeResizeStart(t,n){let r=t.value??t.detail?.value??t,i=G.get(this.mInstanceKey)?.activeFunction?.graph.getNode(r.nodeId);i&&(this.getInternals().interactionState={mode:"resizing-comment",nodeId:r.nodeId,startX:r.startX,startY:r.startY,originalW:i.size.w,originalH:i.size.h},this.canvasWrapper.setPointerCapture(t.pointerId??r.startX))}onCommentChange(t){let n=t.value??t.detail?.value??t,o=G.get(this.mInstanceKey)?.activeFunction?.graph.getNode(n.nodeId);if(o){let i=new Dn(o,"comment",n.text);this.getInternals().history.push(i),this.rebuildCachedData()}}onValueChange(t){let n=t.value??t.detail?.value??t,o=G.get(this.mInstanceKey)?.activeFunction?.graph.getNode(n.nodeId);if(o){let i=new Dn(o,n.property,n.value);this.getInternals().history.push(i),this.rebuildCachedData(),this.updatePreview()}}onKeyDown(t){if(t.key==="Delete"){this.deleteSelectedNodes();return}if(t.ctrlKey&&t.key==="z"){t.preventDefault(),this.getInternals().history.undo(),this.rebuildCachedData(),this.renderConnections(),this.updatePreview();return}if(t.ctrlKey&&(t.key==="y"||t.shiftKey&&t.key==="z")){t.preventDefault(),this.getInternals().history.redo(),this.rebuildCachedData(),this.renderConnections(),this.updatePreview();return}if(t.ctrlKey&&t.key==="c"){let r=G.get(this.mInstanceKey)?.activeFunction?.graph;r&&this.getInternals().clipboard.copy(r,this.getSelectedIds());return}if(t.ctrlKey&&t.key==="v"){this.pasteFromClipboard();return}}onResizeLeftStart(t){t.preventDefault(),this.startPanelResize("left",t)}onResizeRightStart(t){t.preventDefault(),this.startPanelResize("right",t)}startPanelResize(t,n){let r=t==="left"?this.panelLeft:this.panelRight;this.mResizeState={panel:t,startX:n.clientX,startWidth:r.offsetWidth},this.mResizeMoveHandler=o=>{if(!this.mResizeState)return;let i=t==="left"?o.clientX-this.mResizeState.startX:this.mResizeState.startX-o.clientX,a=Math.max(200,Math.min(500,this.mResizeState.startWidth+i));r.style.width=`${a}px`},this.mResizeUpHandler=()=>{this.mResizeMoveHandler&&document.removeEventListener("pointermove",this.mResizeMoveHandler),this.mResizeUpHandler&&document.removeEventListener("pointerup",this.mResizeUpHandler),this.mResizeState=null},document.addEventListener("pointermove",this.mResizeMoveHandler),document.addEventListener("pointerup",this.mResizeUpHandler)}initializeMainFunctions(t,n){for(let r of n.mainFunctions){let o=new Ct(crypto.randomUUID(),r.name,r.label,!0,r.editableByUser??!1);o.setInputs([...r.inputs]),o.setOutputs([...r.outputs]);for(let i of r.inputs){let a={name:i.name,category:"input",inputs:[],outputs:[{name:i.name,type:i.type}]};o.graph.addNode(a,{x:2,y:2+r.inputs.indexOf(i)*3},!0)}for(let i of r.outputs){let a={name:i.name,category:"output",inputs:[{name:i.name,type:i.type}],outputs:[]};o.graph.addNode(a,{x:30,y:2+r.outputs.indexOf(i)*3},!0)}t.addFunction(o)}}deleteSelectedNodes(){let n=G.get(this.mInstanceKey)?.activeFunction?.graph;if(!n)return;let r=[];for(let o of this.getSelectedIds()){let i=n.getNode(o);i&&!i.system&&r.push(new dr(n,o))}r.length>0&&(this.getInternals().history.push(new Sn("Delete nodes",r)),this.getSelectedIds().clear(),this.rebuildCachedData(),this.renderConnections(),this.updatePreview())}pasteFromClipboard(){let t=this.getInternals(),n=t.clipboard.getData();if(!n)return;let r=this.getProject(),i=G.get(this.mInstanceKey)?.activeFunction?.graph;if(!i)return;let a=[],l=[];for(let c of n.nodes){let h=r.configuration.nodeDefinitions.get(c.definitionName);if(h){let d=new Nn(i,h,{x:c.position.x+2,y:c.position.y+2});a.push(d),l.push(d)}}if(a.length>0){t.history.push(new Sn("Paste nodes",a));for(let c=0;c<l.length;c++){let h=l[c].node,d=n.nodes[c];if(h&&d.properties)for(let[y,b]of Object.entries(d.properties))h.properties.set(y,b)}for(let c of n.internalConnections){let h=l[c.sourceNodeIndex]?.node??null,d=l[c.targetNodeIndex]?.node??null;if(h&&d){let y="",b="",N=c.kind==="flow"?"flow":"data";if(N==="data"){for(let[I,T]of h.outputs)if(I===c.sourcePortName){y=T.id;break}for(let[I,T]of d.inputs)if(I===c.targetPortName){b=T.id;break}}else{for(let[I,T]of h.flowOutputs)if(I===c.sourcePortName){y=T.id;break}for(let[I,T]of d.flowInputs)if(I===c.targetPortName){b=T.id;break}}y&&b&&i.addConnection(h.id,y,d.id,b,N)}}this.getSelectedIds().clear();for(let c of l)c.node&&this.getSelectedIds().add(c.node.id);this.rebuildCachedData(),this.renderConnections(),this.updatePreview()}}selectNodesInBox(){let n=G.get(this.mInstanceKey)?.activeFunction?.graph;if(!n)return;let r=this.getInternals(),o=r.interaction.screenToWorld(Math.min(this.mSelectionBoxScreen.x1,this.mSelectionBoxScreen.x2),Math.min(this.mSelectionBoxScreen.y1,this.mSelectionBoxScreen.y2)),i=r.interaction.screenToWorld(Math.max(this.mSelectionBoxScreen.x1,this.mSelectionBoxScreen.x2),Math.max(this.mSelectionBoxScreen.y1,this.mSelectionBoxScreen.y2)),a=r.interaction.gridSize;for(let l of n.nodes.values()){let c=l.position.x*a,h=l.position.y*a,d=c+l.size.w*a,y=h+l.size.h*a;c<i.x&&d>o.x&&h<i.y&&y>o.y&&this.getSelectedIds().add(l.id)}this.rebuildCachedData()}renderConnections(){if(!this.svgLayer)return;let n=G.get(this.mInstanceKey)?.activeFunction?.graph;if(!n){this.getInternals().renderer.clearAll(this.svgLayer);return}let r=this.getInternals(),o=r.interaction.gridSize,i=28,a=24,l=[];for(let c of n.connections.values()){let h=n.getNode(c.sourceNodeId),d=n.getNode(c.targetNodeId);if(!h||!d)continue;let y=h.position.x*o,b=h.position.y*o,N=d.position.x*o,I=d.position.y*o,T=h.size.w*o,w,D,F,X;if(c.kind==="data"){let v=0,it=0;for(let fr of h.outputs.values()){if(fr.id===c.sourcePortId){v=it;break}it++}let oi=0;it=0;for(let fr of d.inputs.values()){if(fr.id===c.targetPortId){oi=it;break}it++}w=y+T,D=b+i+(v+.5)*a,F=N,X=I+i+(oi+.5)*a}else w=y+T,D=b+i/2,F=N,X=I+i/2;l.push({id:c.id,sourceX:w,sourceY:D,targetX:F,targetY:X,color:c.valid?"var(--pn-text-secondary)":"var(--pn-accent-danger)",valid:c.valid})}r.renderer.renderConnections(this.svgLayer,l)}initializePreview(){let t=wt.get(this.mInstanceKey);if(!t)return;let n=t.configuration.createPreview;if(!n)return;let r=this.getInternals();if(r.previewInitialized)return;let o=this.previewEl;if(o&&typeof o.getContainer=="function"){let i=o.getContainer();n(i),r.previewInitialized=!0}}updatePreview(){let t=wt.get(this.mInstanceKey);if(!t)return;let n=t.configuration.updatePreview;if(!n)return;let r=G.get(this.mInstanceKey);if(!r||this.getInternals().cachedData.errors.length>0)return;let i;try{let l=new An(t.configuration).serialize(r);i=this.stripMetadataComments(l,t.configuration.commentToken)}catch{return}clearTimeout(this.mPreviewDebounceTimer),this.mPreviewDebounceTimer=setTimeout(()=>{try{n(i)}catch{}},300)}stripMetadataComments(t,n){return t.split(`
`).filter(i=>{let a=i.trim();return!a.startsWith(`${n} __POTATNO_START:`)&&!a.startsWith(`${n} __POTATNO_END:`)}).join(`
`)}updateNodePosition(t){let r=G.get(this.mInstanceKey)?.activeFunction?.graph.getNode(t);if(!r)return;let o=this.getInternals().interaction.gridSize;for(let i of this.getInternals().cachedData.visibleNodes)if(i.id===t){i.position={x:r.position.x,y:r.position.y},i.pixelX=r.position.x*o,i.pixelY=r.position.y*o;break}}updateNodeSize(t){let r=G.get(this.mInstanceKey)?.activeFunction?.graph.getNode(t);if(r){for(let o of this.getInternals().cachedData.visibleNodes)if(o.id===t){o.size={w:r.size.w,h:r.size.h};break}}}validateProject(){let t=[],n=G.get(this.mInstanceKey);if(!n)return t;let r=/^[a-zA-Z][a-zA-Z0-9_]*$/,o=new Set;for(let a of n.functions.values()){o.has(a.name)&&t.push({message:`Duplicate function name "${a.name}".`,location:`Function "${a.name}"`}),o.add(a.name),r.test(a.name)||t.push({message:`Invalid function name "${a.name}". Must start with a letter and contain only letters, digits, and underscores.`,location:`Function "${a.name}"`});let l=new Set;for(let c of a.inputs)r.test(c.name)||t.push({message:`Invalid input name "${c.name}".`,location:`Function "${a.name}" > Inputs`}),l.has(c.name)&&t.push({message:`Duplicate input/output name "${c.name}".`,location:`Function "${a.name}" > Inputs`}),l.add(c.name);for(let c of a.outputs)r.test(c.name)||t.push({message:`Invalid output name "${c.name}".`,location:`Function "${a.name}" > Outputs`}),l.has(c.name)&&t.push({message:`Duplicate input/output name "${c.name}".`,location:`Function "${a.name}" > Outputs`}),l.add(c.name)}let i=n.activeFunction;if(!i)return t.push({message:"No active function selected.",location:"Editor"}),t;for(let a of i.graph.nodes.values())for(let l of a.inputs.values())!l.connectedTo&&!a.system&&t.push({message:`Input "${l.name}" on node "${a.definitionName}" is not connected.`,location:`Function "${i.name}" > Node "${a.definitionName}"`});for(let a of i.graph.connections.values())a.valid||t.push({message:"Type mismatch on connection.",location:`Function "${i.name}"`});return t}rebuildCachedData(){let t=wt.get(this.mInstanceKey),n=G.get(this.mInstanceKey),r=this.getInternals().cachedData;r.activeFunctionId=n?.activeFunctionId??"",r.hasPreview=t?.configuration.hasPreview??!1,r.errors=this.validateProject();let o=[];if(t)for(let c of t.configuration.nodeDefinitions.values())o.push({name:c.name,category:c.category});if(n)for(let c of n.functions.values())c.system||o.push({name:c.name,category:"function"});r.nodeDefinitionList=o;let i=[];if(n)for(let c of n.functions.values())i.push({id:c.id,name:c.name,label:c.label,system:c.system});r.functionList=i,r.availableImports=t?.configuration.globalValues.map(c=>c.name)??[];let a=new Set;if(t)for(let c of t.configuration.nodeDefinitions.values()){for(let h of c.inputs)a.add(h.type);for(let h of c.outputs)a.add(h.type)}r.availableTypes=[...a].sort();let l=n?.activeFunction;if(r.activeFunctionName=l?.name??"",r.activeFunctionIsSystem=l?.system??!1,r.activeFunctionEditableByUser=l?.editableByUser??!1,r.activeFunctionInputs=[...l?.inputs??[]],r.activeFunctionOutputs=[...l?.outputs??[]],r.activeFunctionImports=[...l?.imports??[]],l){let c=new Set,h=new Set;for(let y of l.graph.connections.values())c.add(y.sourcePortId),h.add(y.sourcePortId),h.add(y.targetPortId);let d=[];for(let y of l.graph.nodes.values()){let b=t?.configuration.nodeDefinitions.get(y.definitionName),N=rr[y.category]??{icon:"?",cssColor:"var(--pn-text-muted)",label:"Unknown"},I=[];for(let F of y.inputs.values())I.push({id:F.id,name:F.name,type:F.type,direction:F.direction,connectedTo:F.connectedTo});let T=[];for(let F of y.outputs.values()){let X=c.has(F.id);T.push({id:F.id,name:F.name,type:F.type,direction:F.direction,connectedTo:X?"connected":null})}let w=[];for(let F of y.flowInputs.values())w.push({id:F.id,name:F.name,direction:F.direction,connectedTo:h.has(F.id)?"connected":null});let D=[];for(let F of y.flowOutputs.values())D.push({id:F.id,name:F.name,direction:F.direction,connectedTo:h.has(F.id)?"connected":null});d.push({id:y.id,definitionName:y.definitionName,category:y.category,categoryColor:N.cssColor,categoryIcon:N.icon,label:y.definitionName,position:{x:y.position.x,y:y.position.y},size:{w:y.size.w,h:y.size.h},system:y.system,selected:this.getSelectedIds().has(y.id),inputs:I,outputs:T,flowInputs:w,flowOutputs:D,valueText:y.properties.get("value")??"",commentText:y.properties.get("comment")??"",hasDefinition:!!b,pixelX:y.position.x*this.getInternals().interaction.gridSize,pixelY:y.position.y*this.getInternals().interaction.gridSize})}r.visibleNodes=d}else r.visibleNodes=[];this.mCacheVersion++}};Y=E(Ac),ei=new WeakMap,ti=new WeakMap,ni=new WeakMap,ri=new WeakMap,m(Y,4,"svgLayer",kc,de,ei),m(Y,4,"canvasWrapper",Ec,de,ti),m(Y,4,"panelLeft",wc,de,ni),m(Y,4,"panelRight",Ic,de,ri),m(Y,3,"project",Pc,de),m(Y,3,"file",xc,de),m(Y,1,"loadCode",Cc,de),m(Y,1,"generateCode",vc,de),de=m(Y,0,"PotatnoCodeEditor",Nc,de),u(Y,1,de)});var Lc,Sc=p(()=>{Lc=`:host {\r
    display: block;\r
    width: 100%;\r
    height: 100%;\r
}\r
\r
potatno-code-editor {\r
    display: block;\r
    width: 100%;\r
    height: 100%;\r
}`});var Rc,Mc=p(()=>{Rc=`:host {\r
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
`});var mr,Oc=p(()=>{ue();Dc();Sc();Mc();mr=class extends st{mCodeEditor;mProject;get file(){return this.mCodeEditor.file}set file(e){this.mCodeEditor.file=e}get project(){return this.mProject}constructor(e){super("potatno-code",new Fe),this.mProject=e,this.addStyle(Rc),this.addStyle(Lc),this.mCodeEditor=this.addContent(de),this.mCodeEditor.project=e}}});var hr,Fc=p(()=>{hr=class{mCommentToken;mCreatePreview;mFunctionCodeGenerator;mGlobalValues;mMainFunctions;mNodeDefinitions;mUpdatePreview;get commentToken(){return this.mCommentToken}get createPreview(){return this.mCreatePreview}set createPreview(e){this.mCreatePreview=e}get functionCodeGenerator(){return this.mFunctionCodeGenerator}get globalValues(){return this.mGlobalValues}get hasPreview(){return this.mCreatePreview!==null}get mainFunctions(){return this.mMainFunctions}get nodeDefinitions(){return this.mNodeDefinitions}get updatePreview(){return this.mUpdatePreview}set updatePreview(e){this.mUpdatePreview=e}constructor(){this.mCommentToken="//",this.mNodeDefinitions=new Map,this.mMainFunctions=new Array,this.mGlobalValues=new Array,this.mCreatePreview=null,this.mUpdatePreview=null,this.mFunctionCodeGenerator=null}addGlobalValue(e){this.mGlobalValues.push(e)}addMainFunction(e){this.mMainFunctions.push(e)}addNodeDefinition(e){this.mNodeDefinitions.set(e.name,e)}setCommentToken(e){this.mCommentToken=e}setCreatePreview(e){this.mCreatePreview=e}setFunctionCodeGenerator(e){this.mFunctionCodeGenerator=e}setUpdatePreview(e){this.mUpdatePreview=e}}});var yr,Bc=p(()=>{Fc();yr=class{mConfiguration;get configuration(){return this.mConfiguration}constructor(){this.mConfiguration=new hr}defineNode(e){this.mConfiguration.addNodeDefinition(e)}defineMainFunction(e){this.mConfiguration.addMainFunction(e)}defineGlobalValue(e){this.mConfiguration.addGlobalValue(e)}setCommentToken(e){this.mConfiguration.setCommentToken(e)}setFunctionCodeGenerator(e){this.mConfiguration.setFunctionCodeGenerator(e)}setCreatePreview(e){this.mConfiguration.setCreatePreview(e)}setUpdatePreview(e){this.mConfiguration.setUpdatePreview(e)}}});var Ou={};var B,Oe,Gc,Vc=p(()=>{Oc();Bc();mo();xt();B=new yr;B.setCommentToken("//");B.defineGlobalValue({name:"Math_PI",type:"number",label:"Math.PI"});B.defineGlobalValue({name:"Math_E",type:"number",label:"Math.E"});B.defineNode({name:"Number Literal",category:"value",inputs:[],outputs:[{name:"value",type:"number"}],codeTemplate:"const ${output:value} = ${property:value};"});B.defineNode({name:"String Literal",category:"value",inputs:[],outputs:[{name:"value",type:"string"}],codeTemplate:'const ${output:value} = "${property:value}";'});B.defineNode({name:"Boolean Literal",category:"value",inputs:[],outputs:[{name:"value",type:"boolean"}],codeTemplate:"const ${output:value} = ${property:value};"});B.defineNode({name:"Add",category:"operator",inputs:[{name:"a",type:"number"},{name:"b",type:"number"}],outputs:[{name:"result",type:"number"}],codeTemplate:"const ${output:result} = ${input:a} + ${input:b};"});B.defineNode({name:"Subtract",category:"operator",inputs:[{name:"a",type:"number"},{name:"b",type:"number"}],outputs:[{name:"result",type:"number"}],codeTemplate:"const ${output:result} = ${input:a} - ${input:b};"});B.defineNode({name:"Multiply",category:"operator",inputs:[{name:"a",type:"number"},{name:"b",type:"number"}],outputs:[{name:"result",type:"number"}],codeTemplate:"const ${output:result} = ${input:a} * ${input:b};"});B.defineNode({name:"Divide",category:"operator",inputs:[{name:"a",type:"number"},{name:"b",type:"number"}],outputs:[{name:"result",type:"number"}],codeTemplate:"const ${output:result} = ${input:a} / ${input:b};"});B.defineNode({name:"Modulo",category:"operator",inputs:[{name:"a",type:"number"},{name:"b",type:"number"}],outputs:[{name:"result",type:"number"}],codeTemplate:"const ${output:result} = ${input:a} % ${input:b};"});B.defineNode({name:"Equal",category:"operator",inputs:[{name:"a",type:"number"},{name:"b",type:"number"}],outputs:[{name:"result",type:"boolean"}],codeTemplate:"const ${output:result} = ${input:a} === ${input:b};"});B.defineNode({name:"Not Equal",category:"operator",inputs:[{name:"a",type:"number"},{name:"b",type:"number"}],outputs:[{name:"result",type:"boolean"}],codeTemplate:"const ${output:result} = ${input:a} !== ${input:b};"});B.defineNode({name:"Less Than",category:"operator",inputs:[{name:"a",type:"number"},{name:"b",type:"number"}],outputs:[{name:"result",type:"boolean"}],codeTemplate:"const ${output:result} = ${input:a} < ${input:b};"});B.defineNode({name:"Greater Than",category:"operator",inputs:[{name:"a",type:"number"},{name:"b",type:"number"}],outputs:[{name:"result",type:"boolean"}],codeTemplate:"const ${output:result} = ${input:a} > ${input:b};"});B.defineNode({name:"And",category:"operator",inputs:[{name:"a",type:"boolean"},{name:"b",type:"boolean"}],outputs:[{name:"result",type:"boolean"}],codeTemplate:"const ${output:result} = ${input:a} && ${input:b};"});B.defineNode({name:"Or",category:"operator",inputs:[{name:"a",type:"boolean"},{name:"b",type:"boolean"}],outputs:[{name:"result",type:"boolean"}],codeTemplate:"const ${output:result} = ${input:a} || ${input:b};"});B.defineNode({name:"Not",category:"operator",inputs:[{name:"a",type:"boolean"}],outputs:[{name:"result",type:"boolean"}],codeTemplate:"const ${output:result} = !${input:a};"});B.defineNode({name:"Number to String",category:"type-conversion",inputs:[{name:"input",type:"number"}],outputs:[{name:"output",type:"string"}],codeTemplate:"const ${output:output} = String(${input:input});"});B.defineNode({name:"String to Number",category:"type-conversion",inputs:[{name:"input",type:"string"}],outputs:[{name:"output",type:"number"}],codeTemplate:"const ${output:output} = Number(${input:input});"});B.defineNode({name:"Boolean to String",category:"type-conversion",inputs:[{name:"input",type:"boolean"}],outputs:[{name:"output",type:"string"}],codeTemplate:"const ${output:output} = String(${input:input});"});B.defineNode({name:"If",category:"flow",inputs:[{name:"condition",type:"boolean"}],outputs:[],flowInputs:["exec"],flowOutputs:["then","else"],codeTemplate:`if (\${input:condition}) {
\${body:then}
} else {
\${body:else}
}`});B.defineNode({name:"While",category:"flow",inputs:[{name:"condition",type:"boolean"}],outputs:[],flowInputs:["exec"],flowOutputs:["body"],codeTemplate:"while (${input:condition}) {\n${body:body}\n}"});B.defineNode({name:"For Loop",category:"flow",inputs:[{name:"count",type:"number"}],outputs:[{name:"index",type:"number"}],flowInputs:["exec"],flowOutputs:["body"],codeTemplate:"for (let ${output:index} = 0; ${output:index} < ${input:count}; ${output:index}++) {\n${body:body}\n}"});B.defineNode({name:"Console Log",category:"function",inputs:[{name:"message",type:"string"}],outputs:[],codeTemplate:"console.log(${input:message});"});B.defineNode({name:"String Concat",category:"function",inputs:[{name:"a",type:"string"},{name:"b",type:"string"}],outputs:[{name:"result",type:"string"}],codeTemplate:"const ${output:result} = ${input:a} + ${input:b};"});B.defineNode({name:"Math.abs",category:"function",inputs:[{name:"value",type:"number"}],outputs:[{name:"result",type:"number"}],codeTemplate:"const ${output:result} = Math.abs(${input:value});"});B.defineNode({name:"Math.floor",category:"function",inputs:[{name:"value",type:"number"}],outputs:[{name:"result",type:"number"}],codeTemplate:"const ${output:result} = Math.floor(${input:value});"});B.defineNode({name:"Math.random",category:"function",inputs:[],outputs:[{name:"result",type:"number"}],codeTemplate:"const ${output:result} = Math.random();"});B.defineNode({name:"Comment",category:"comment",inputs:[],outputs:[]});B.setFunctionCodeGenerator(s=>{let e=s.inputs.map(n=>n.valueId).join(", "),t=s.outputs.length>0?`
    return ${s.outputs[0].valueId};`:"";return`function ${s.name}(${e}) {
${s.bodyCode}${t}
}`});B.defineMainFunction({name:"main",label:"Main",editableByUser:!0,inputs:[],outputs:[]});B.setCreatePreview(s=>{Oe=document.createElement("pre"),Oe.style.cssText='color: #cdd6f4; margin: 0; padding: 8px; font-family: "Cascadia Code", "Fira Code", monospace; font-size: 13px; white-space: pre-wrap; word-break: break-all;',s.appendChild(Oe)});B.setUpdatePreview(s=>{if(Oe)try{let e=`
            const __logs = [];
            const console = { log: function() { __logs.push(Array.prototype.slice.call(arguments).map(String).join(' ')); } };
            ${s}
            if (typeof main === 'function') { main(); }
            return __logs;
        `,n=new Function(e)();n.length>0?(Oe.textContent=n.join(`
`),Oe.style.color="#cdd6f4"):(Oe.textContent="(no output)",Oe.style.color="#6c7086")}catch(e){Oe.textContent=`Error: ${e.message??e}`,Oe.style.color="#f38ba8"}});Gc=new mr(B);Gc.appendTo(document.body);Gc.file=new Wt});(()=>{let s=new WebSocket("ws://127.0.0.1:8088");s.addEventListener("open",()=>{console.log("Refresh connection established")}),s.addEventListener("message",e=>{console.log("Bundle finished. Start refresh"),e.data==="REFRESH"&&window.location.reload()})})();Promise.resolve().then(()=>Vc());
//# sourceMappingURL=page.js.map
