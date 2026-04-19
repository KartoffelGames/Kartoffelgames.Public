(()=>{var $t=class{mActiveFunctionId;mFunctions;get activeFunction(){return this.mFunctions.get(this.mActiveFunctionId)}get activeFunctionId(){return this.mActiveFunctionId}get functions(){return this.mFunctions}constructor(){this.mFunctions=new Map,this.mActiveFunctionId=""}addFunction(t){this.mFunctions.set(t.id,t),this.mActiveFunctionId||(this.mActiveFunctionId=t.id)}removeFunction(t){let r=this.mFunctions.get(t);if(!r||r.system)return!1;if(this.mFunctions.delete(t),this.mActiveFunctionId===t){let n=this.mFunctions.keys().next().value;this.mActiveFunctionId=n??""}return!0}setActiveFunction(t){return this.mFunctions.has(t)?(this.mActiveFunctionId=t,!0):!1}getFunction(t){return this.mFunctions.get(t)}};var R=function(h){return h.Function="function",h.Operator="operator",h.Value="value",h.Flow="flow",h.Comment="comment",h.TypeConversion="type-conversion",h.Input="input",h.Output="output",h.Event="event",h.Reroute="reroute",h.GetLocal="getlocal",h.SetLocal="setlocal",h}({}),jt=class h{static META={[R.Function]:{icon:"f",cssColor:"var(--pn-accent-blue)",label:"Function"},[R.Operator]:{icon:"\xB1",cssColor:"var(--pn-accent-green)",label:"Operator"},[R.Value]:{icon:"#",cssColor:"var(--pn-accent-peach)",label:"Value"},[R.Flow]:{icon:"\u27F3",cssColor:"var(--pn-accent-mauve)",label:"Flow"},[R.Comment]:{icon:"\u{1F4AC}",cssColor:"var(--pn-accent-yellow)",label:"Comment"},[R.TypeConversion]:{icon:"\u21C4",cssColor:"var(--pn-accent-teal)",label:"Type Conversion"},[R.Input]:{icon:"\u2192",cssColor:"var(--pn-accent-green)",label:"Input"},[R.Output]:{icon:"\u2190",cssColor:"var(--pn-accent-red)",label:"Output"},[R.Event]:{icon:"\u26A1",cssColor:"var(--pn-accent-danger)",label:"Event"},[R.Reroute]:{icon:"\u25C7",cssColor:"var(--pn-text-muted)",label:"Reroute"},[R.GetLocal]:{icon:"\u2193",cssColor:"var(--pn-accent-teal)",label:"Get Local"},[R.SetLocal]:{icon:"\u2191",cssColor:"var(--pn-accent-teal)",label:"Set Local"}};static get(t){return h.META[t]??{icon:"?",cssColor:"var(--pn-text-muted)",label:"Unknown"}}};var At=class h extends Array{static newListWith(...t){let r=new h;return r.push(...t),r}clear(){this.splice(0,this.length)}clone(){return h.newListWith(...this)}distinct(){return h.newListWith(...new Set(this))}equals(t){if(this===t)return!0;if(!t||this.length!==t.length)return!1;for(let r=0;r<this.length;++r)if(this[r]!==t[r])return!1;return!0}remove(t){let r=this.indexOf(t);if(r!==-1)return this.splice(r,1)[0]}replace(t,r){let n=this.indexOf(t);if(n!==-1){let u=this[n];return this[n]=r,u}}toString(){return`[${super.join(", ")}]`}};var A=class extends Error{mTarget;get target(){return this.mTarget}constructor(t,r,n){super(t,n),this.mTarget=r}};var k=class h extends Map{add(t,r){if(!this.has(t))this.set(t,r);else throw new A("Can't add duplicate key to dictionary.",this)}clone(){return new h(this)}getAllKeysOfValue(t){return[...this.entries()].filter(u=>u[1]===t).map(u=>u[0])}getOrDefault(t,r){let n=this.get(t);return typeof n<"u"?n:r}map(t){let r=new At;for(let n of this){let u=t(n[0],n[1]);r.push(u)}return r}};var Tt=class h{mSize;mTopItem;get size(){return this.mSize}get top(){if(this.mTopItem)return this.mTopItem.value}constructor(){this.mTopItem=null,this.mSize=0}clone(){let t=new h;return t.mTopItem=this.mTopItem,t.mSize=this.mSize,t}*entries(){let t=this.mTopItem;for(;t!==null;)yield t.value,t=t.previous}flush(){let t=new Array;for(;this.mTopItem;)t.push(this.pop());return t}pop(){if(!this.mTopItem)return;let t=this.mTopItem.value;return this.mTopItem=this.mTopItem.previous,this.mSize--,t}push(t){let r={previous:this.mTopItem,value:t};this.mTopItem=r,this.mSize++}toArray(){return[...this.entries()]}};var qt=class{mCompareFunction;constructor(t){this.mCompareFunction=t}differencesOf(t,r){let n;if(t.length===0||r.length===0){if(n=new Array,t.length===0)for(let E=0;E<r.length;E++)n.push({changeState:gt.Insert,item:r[E]});else for(let E=0;E<t.length;E++)n.push({changeState:gt.Remove,item:t[E]});return n}let u={1:{x:0,history:[]}},p=E=>E-1,v=t.length,b=r.length,x;for(let E=0;E<v+b+1;E++)for(let a=-E;a<E+1;a+=2){let o=a===-E||a!==E&&u[a-1].x<u[a+1].x;if(o){let l=u[a+1];x=l.x,n=l.history}else{let l=u[a-1];x=l.x+1,n=l.history}n=n.slice();let c=x-a;for(1<=c&&c<=b&&o?n.push({changeState:gt.Insert,item:r[p(c)]}):1<=x&&x<=v&&n.push({changeState:gt.Remove,item:t[p(x)]});x<v&&c<b&&this.mCompareFunction(t[p(x+1)],r[p(c+1)]);)x+=1,c+=1,n.push({changeState:gt.Keep,item:t[p(x)]});if(x>=v&&c>=b)return n;u[a]={x,history:n}}return new Array}},gt=function(h){return h[h.Remove=1]="Remove",h[h.Insert=2]="Insert",h[h.Keep=3]="Keep",h}({});var it=class h{static mComponents=new WeakMap;static mConstructorSelector=new WeakMap;static mElements=new WeakMap;static ofComponent(t){let r=t.processorConstructor,n=h.mConstructorSelector.get(r);if(!n)throw new A(`Constructor "${r.name}" is not a registered custom element`,r);let u=h.mElements.get(t);if(!u)throw new A(`Component "${t}" is not a registered component`,t);return{selector:n,constructor:r,element:u,component:t,processor:t.processor}}static ofConstructor(t){let r=h.mConstructorSelector.get(t);if(!r)throw new A(`Constructor "${t.name}" is not a registered custom element`,t);let n=globalThis.customElements.get(r);if(!n)throw new A(`Constructor "${t.name}" is not a registered custom element`,t);return{selector:r,constructor:t,elementConstructor:n}}static ofElement(t){let r=h.mComponents.get(t);if(!r)throw new A(`Element "${t}" is not a PwbComponent.`,t);return h.ofComponent(r)}static ofProcessor(t){let r=h.mComponents.get(t);if(!r)throw new A("Processor is not a PwbComponent.",t);return h.ofComponent(r)}static registerComponent(t,r,n){h.mComponents.has(r)||h.mComponents.set(r,t),n&&!h.mComponents.has(n)&&h.mComponents.set(n,t),h.mElements.has(t)||h.mElements.set(t,r)}static registerConstructor(t,r){t&&!h.mConstructorSelector.has(t)&&h.mConstructorSelector.set(t,r)}};var Kt=class h{static CONFIGURATION_ATTACHMENT=Symbol("PwbApplicationConfigurationAttachment");static new(t,r){let n=new h;t(n),r&&n.appendTo(r)}mContent;mElement;constructor(){this.mContent=new Array,this.mElement=document.createElement("div"),this.mElement.attachShadow({mode:"open"})}addContent(t){let r=it.ofConstructor(t).elementConstructor,n=it.ofElement(new r);return this.mContent.push(n.component),this.mElement.shadowRoot.appendChild(n.element),n.processor}addStyle(t){let r=document.createElement("style");r.textContent=t,this.mElement.shadowRoot.prepend(r)}appendTo(t){t.appendChild(this.mElement)}};var Gt=class{mCustomMetadata;constructor(){this.mCustomMetadata=new Map}getMetadata(t){return this.mCustomMetadata.get(t)??null}setMetadata(t,r){this.mCustomMetadata.set(t,r)}};var Jt=class extends Gt{};var Qt=class h extends Gt{static mPrivateMetadataKey=Symbol("Metadata");mDecoratorMetadataObject;mPropertyMetadata;constructor(t){super(),this.mDecoratorMetadataObject=t,this.mPropertyMetadata=new Map,t[h.mPrivateMetadataKey]=this}getInheritedMetadata(t){let r=new Array,n=this.mDecoratorMetadataObject;do{if(Object.hasOwn(n,h.mPrivateMetadataKey)){let p=n[h.mPrivateMetadataKey].getMetadata(t);p!==null&&r.push(p)}n=Object.getPrototypeOf(n)}while(n!==null);return r.reverse()}getProperty(t){return this.mPropertyMetadata.has(t)||this.mPropertyMetadata.set(t,new Jt),this.mPropertyMetadata.get(t)}};Symbol.metadata??=Symbol("Symbol.metadata");var rt=class h{static mMetadataMapping=new Map;static add(t,r){return(n,u)=>{let p=h.forInternalDecorator(u.metadata);switch(u.kind){case"class":p.setMetadata(t,r);return;case"method":case"field":case"getter":case"setter":case"accessor":if(u.static)throw new Error("@Metadata.add not supported for statics.");p.getProperty(u.name).setMetadata(t,r);return}}}static forInternalDecorator(t){return h.mapMetadata(t)}static get(t){Object.hasOwn(t,Symbol.metadata)||h.polyfillMissingMetadata(t);let r=t[Symbol.metadata];return h.mapMetadata(r)}static init(){return(t,r)=>{h.forInternalDecorator(r.metadata)}}static mapMetadata(t){if(h.mMetadataMapping.has(t))return h.mMetadataMapping.get(t);let r=new Qt(t);return h.mMetadataMapping.set(t,r),r}static polyfillMissingMetadata(t){let r=new Array,n=t;do r.push(n),n=Object.getPrototypeOf(n);while(n!==null);for(let u=r.length-1;u>=0;u--){let p=r[u];if(!Object.hasOwn(p,Symbol.metadata)){let v=null;u<r.length-2&&(v=r[u+1][Symbol.metadata]),p[Symbol.metadata]=Object.create(v,{})}}}};var z=class h{static mCurrentInjectionContext=null;static mInjectMode=new Map;static mInjectableConstructor=new Map;static mInjectableReplacement=new Map;static mInjectionConstructorIdentificationMetadataKey=Symbol("InjectionConstructorIdentification");static mSingletonMapping=new Map;static createObject(t,r,n){let[u,p]=typeof r=="object"&&r!==null?[!1,r]:[!!r,n??new Map],v=h.getInjectionIdentification(t);if(!h.mInjectableConstructor.has(v))throw new A(`Constructor "${t.name}" is not registered for injection and can not be built`,h);let b=u?"instanced":h.mInjectMode.get(v),x=new Map(p.entries().map(([o,c])=>[h.getInjectionIdentification(o),c])),E=h.mCurrentInjectionContext,a=new Map([...E?.localInjections.entries()??[],...x.entries()]);h.mCurrentInjectionContext={injectionMode:b,localInjections:a};try{if(!u&&b==="singleton"&&h.mSingletonMapping.has(v))return h.mSingletonMapping.get(v);let o=new t;return b==="singleton"&&!h.mSingletonMapping.has(v)&&h.mSingletonMapping.set(v,o),o}finally{h.mCurrentInjectionContext=E}}static injectable(t="instanced"){return(r,n)=>{h.registerInjectable(r,n.metadata,t)}}static registerInjectable(t,r,n){let u=h.getInjectionIdentification(t,r);h.mInjectableConstructor.set(u,t),h.mInjectMode.set(u,n)}static replaceInjectable(t,r){let n=h.getInjectionIdentification(t);if(!h.mInjectableConstructor.has(n))throw new A("Original constructor is not registered.",h);let u=h.getInjectionIdentification(r);if(!h.mInjectableConstructor.has(u))throw new A("Replacement constructor is not registered.",h);h.mInjectableReplacement.set(n,r)}static use(t){if(h.mCurrentInjectionContext===null)throw new A("Can't create object outside of an injection context.",h);let r=h.getInjectionIdentification(t);if(h.mCurrentInjectionContext.injectionMode!=="singleton"&&h.mCurrentInjectionContext.localInjections.has(r))return h.mCurrentInjectionContext.localInjections.get(r);let n=h.mInjectableReplacement.get(r);if(n||(n=h.mInjectableConstructor.get(r)),!n)throw new A(`Constructor "${t.name}" is not registered for injection and can not be built`,h);return h.createObject(n)}static getInjectionIdentification(t,r){let n=r?rt.forInternalDecorator(r):rt.get(t),u=n.getMetadata(h.mInjectionConstructorIdentificationMetadataKey);return u||(u=Symbol(t.name),n.setMetadata(h.mInjectionConstructorIdentificationMetadataKey,u)),u}};var It=class{mData;mInteractionType;mOrigin;get data(){return this.mData}get origin(){return this.mOrigin}get triggerType(){return this.mInteractionType}constructor(t,r,n){this.mInteractionType=t,this.mData=n,this.mOrigin=r}};var Ct=class h{static mCurrentZone=new h("Default");static get current(){return h.mCurrentZone}static create(t){return new h(t)}mInteractionListener;mName;mTriggerFilterBitmap;get name(){return this.mName}constructor(t){this.mName=t,this.mTriggerFilterBitmap=-1,this.mInteractionListener=new Map}addInteractionListener(t){return this.mInteractionListener.set(t,h.current),this}setTriggerRestriction(t){return this.mTriggerFilterBitmap=t,this}execute(t,...r){let n=h.mCurrentZone;h.mCurrentZone=this;try{return t(...r)}finally{h.mCurrentZone=n}}pushInteraction(t,r){if((this.mTriggerFilterBitmap&t)===0)return!1;if(this.mInteractionListener.size===0)return!0;let n=new It(t,this,r);for(let[u,p]of this.mInteractionListener.entries())p.execute(()=>{u.call(this,n)});return!0}removeInteractionListener(t){return t?(this.mInteractionListener.delete(t),this):(this.mInteractionListener.clear(),this)}};var K=function(h){return h[h.Read=1]="Read",h[h.ReadWrite=2]="ReadWrite",h[h.Write=3]="Write",h}({});var vt=class{mHooks;mInjections;mProcessor;mProcessorConstructor;get processor(){if(!this.mProcessor)throw new A("Processor is not created yet. Call setup to create processor.",this);return this.mProcessor}get processorConstructor(){return this.mProcessorConstructor}constructor(t){if(this.mProcessorConstructor=t.constructor,this.mProcessor=null,this.mInjections=new Map,this.mHooks={create:new Array},t.parent)for(let[r,n]of t.parent.mInjections.entries())this.setProcessorInjection(r,n)}call(t,...r){let n=Reflect.get(this.processor,t);return typeof n!="function"?null:n.apply(this.processor,r)}deconstruct(){}getProcessorInjection(t){return this.mInjections.get(t)}setProcessorInjection(t,r){if(this.mProcessor)throw new A("Cant add injections to after construction.",this);this.mInjections.set(t,r)}setup(){return this.mProcessor=this.createProcessor(),this}addConstructionHook(t){return this.mHooks.create.push(t),this}createProcessor(){let t=z.createObject(this.mProcessorConstructor,this.mInjections),r;for(;r=this.mHooks.create.pop();){let n=r.call(this,t);n&&(t=n)}return t}};var Et=class h extends vt{constructor(t,r){super({constructor:t,parent:r}),this.setProcessorInjection(h,this)}deconstruct(){this.call("onDeconstruct"),super.deconstruct()}setup(){return super.setup(),this.call("onExecute"),this}onUpdate(){return!1}};var He=class h{static mInstance;mCoreEntityConstructor;mProcessorConstructorConfiguration;constructor(){if(h.mInstance)return h.mInstance;h.mInstance=this,this.mCoreEntityConstructor=new Map,this.mProcessorConstructorConfiguration=new Map}get(t){let r=this.mCoreEntityConstructor.get(t);if(!r)return new Array;let n=new Array;for(let u of r)n.push({processorConstructor:u,processorConfiguration:this.mProcessorConstructorConfiguration.get(u)});return n}register(t,r,n){this.mProcessorConstructorConfiguration.set(r,n);let u=t;do{if(!(u.prototype instanceof vt)&&u!==vt)break;this.mCoreEntityConstructor.has(u)||this.mCoreEntityConstructor.set(u,new Set),this.mCoreEntityConstructor.get(u).add(r)}while(u=Object.getPrototypeOf(u))}},st=new He;var Ut=class h extends vt{static mExtensionCache=new WeakMap;mExtensionList;constructor(t){super(t),this.mExtensionList=new Array}deconstruct(){for(let t of this.mExtensionList)t.deconstruct();super.deconstruct()}setup(){return super.setup(),this.executeExtensions(),this}executeExtensions(){let t=(()=>{if(!h.mExtensionCache.has(this.processorConstructor)){let u=st.get(Et).filter(v=>{for(let b of v.processorConfiguration.targetRestrictions)if(this instanceof b||this.processorConstructor.prototype instanceof b||this.processorConstructor===b)return!0;return!1}),p={read:u.filter(v=>v.processorConfiguration.access===K.Read),write:u.filter(v=>v.processorConfiguration.access===K.Write),readWrite:u.filter(v=>v.processorConfiguration.access===K.ReadWrite)};h.mExtensionCache.set(this.processorConstructor,p)}return h.mExtensionCache.get(this.processorConstructor)})(),r=[...t.write,...t.readWrite,...t.read];for(let n of r)this.mExtensionList.push(new Et(n.processorConstructor,this).setup())}};var U={get:1,set:2,manual:4};var pe=class h{static ORIGINAL_TO_INTERACTION_MAPPING=new WeakMap;static PROXY_TO_ORIGINAL_MAPPING=new WeakMap;static UNTRACEABLE_FUNCTION_UPDATE_TRIGGER=(()=>{let t=new WeakMap;return t.set(Array.prototype.fill,U.set),t.set(Array.prototype.pop,U.get),t.set(Array.prototype.push,U.set),t.set(Array.prototype.shift,U.get),t.set(Array.prototype.unshift,U.set),t.set(Array.prototype.splice,U.set),t.set(Array.prototype.reverse,U.set),t.set(Array.prototype.sort,U.set),t.set(Array.prototype.concat,U.set),t.set(Map.prototype.clear,U.set),t.set(Map.prototype.delete,U.set),t.set(Map.prototype.set,U.set),t.set(Set.prototype.clear,U.set),t.set(Set.prototype.delete,U.set),t.set(Set.prototype.add,U.set),t})();static getOriginal(t){return h.PROXY_TO_ORIGINAL_MAPPING.get(t)??t}static getWrapper(t){let r=h.getOriginal(t);return h.ORIGINAL_TO_INTERACTION_MAPPING.get(r)}mProxyObject;mStateChangeCallback;get proxy(){return this.mProxyObject}constructor(t,r){let n=h.getWrapper(t);if(n)return n;this.mProxyObject=this.createProxyObject(t),this.mStateChangeCallback=r,h.PROXY_TO_ORIGINAL_MAPPING.set(this.mProxyObject,t),h.ORIGINAL_TO_INTERACTION_MAPPING.set(t,this)}convertToProxy(t){return t===null||typeof t!="object"&&typeof t!="function"?t:new h(t,this.mStateChangeCallback).proxy}createProxyObject(t){let r=(u,p,v)=>{let b=h.getOriginal(p);try{let x=u.call(b,...v);return this.convertToProxy(x)}finally{if(h.UNTRACEABLE_FUNCTION_UPDATE_TRIGGER.has(u)){let x=h.getWrapper(p);x&&x.dispatch(h.UNTRACEABLE_FUNCTION_UPDATE_TRIGGER.get(u))}}};return new Proxy(t,{apply:(u,p,v)=>{let b=u;try{let x=b.call(p,...v);return this.convertToProxy(x)}catch(x){if(!(x instanceof TypeError))throw x;return r(b,p,v)}},set:(u,p,v)=>{try{let b=v;return(b!==null&&typeof b=="object"||typeof b=="function")&&(b=h.getOriginal(b)),Reflect.set(u,p,b)}finally{this.dispatch(U.set)}},get:(u,p,v)=>{try{return this.convertToProxy(Reflect.get(u,p))}finally{this.dispatch(U.get)}},deleteProperty:(u,p)=>{try{return delete u[p]}finally{this.dispatch(U.set)}}})}dispatch(t){this.mStateChangeCallback(t)}};var V=class h{static reaction(t){let r=Ct.create("ComponentState reaction");r.addInteractionListener(n=>{(n.triggerType&U.set)!==0&&t()}),r.execute(()=>{t()})}static state(t){return(r,n)=>{if(n.static)throw new A("Event target is not for a static property.",h);let u,p=v=>{u=new h(v,t)};return{init(v){return typeof v>"u"||p(v),v},set(v){u?u.set(v):p(v)},get(){return u||p(void 0),u.get()}}}}mLinkedZones;mLinkedZonesArray;mConfiguration;mValue;constructor(t,r){if(this.mLinkedZones=new Set,this.mLinkedZonesArray=new Array,this.mConfiguration={complexValue:r?.complexValue??!1,proxy:r?.proxy??!1},this.mConfiguration.proxy){if(typeof t!="object"||t===null)throw new A("Proxied component state value must be an object.",this);this.mValue=new pe(t,n=>{switch(n){case U.set:return this.dispatchChange();case U.get:return this.linkCurrentZone()}}).proxy}else this.mValue=t}get(){return this.linkCurrentZone(),this.mValue}set(t){if(this.mConfiguration.proxy)throw new A("Proxy is not implemented yet.",this);!this.mConfiguration.complexValue&&this.mValue===t||(this.mValue=t,this.dispatchChange())}dispatchChange(){for(let t of this.mLinkedZonesArray)t.pushInteraction(U.set,this)}linkCurrentZone(){let t=Ct.current;this.mLinkedZones.has(t)||(this.mLinkedZones.add(t),this.mLinkedZonesArray.push(t))}};var St=class h{static mCurrentUpdateCycle=null;static openResheduledCycle(t,r){let n=!1;if(!h.mCurrentUpdateCycle){let u=performance.now();h.mCurrentUpdateCycle={initiator:t.initiator,startTime:u,forcedSync:t.forcedSync,runner:t.runner},n=!0}try{return r(h.mCurrentUpdateCycle)}finally{n&&(h.mCurrentUpdateCycle=null)}}static openUpdateCycle(t,r){let n=!1;if(!h.mCurrentUpdateCycle){let u=performance.now();h.mCurrentUpdateCycle={initiator:t.updater,startTime:u,forcedSync:t.runSync,runner:Symbol("Runner "+u)},n=!0}try{return r(h.mCurrentUpdateCycle)}finally{n&&(h.mCurrentUpdateCycle=null)}}static updateCycleRunId(t,r){if(t.initiator===r){let n=performance.now(),u=t;u.runner=Symbol("Runner "+n)}}static updateCyleStartTime(t){let r=performance.now(),n=t;n.startTime=r}};var ge=class extends Error{mChain;get chain(){return this.mChain}constructor(t,r){let n=r.slice(-20).map(u=>u.toString()).join(`
`);super(`${t}: 
${n}`),this.mChain=[...r]}};var ve=class h{static mStackCap=100;static mFrameTime=100;static get stackCap(){return h.mStackCap}static set stackCap(t){h.mStackCap=t}static get frameTime(){return h.mFrameTime}static set frameTime(t){h.mFrameTime=t}mInteractionZone;mUpdateFunction;mUpdateRunCache;mUpdateStates;mManualComponentState;get zone(){return this.mInteractionZone}constructor(t){this.mUpdateRunCache=new WeakMap,this.mUpdateFunction=t.onUpdate,this.mInteractionZone=t.zone,this.mManualComponentState=new V(Symbol("Manual Update")),this.mUpdateStates={chainCompleteHooks:new Tt,async:{hasSheduledTask:!1,hasRunningTask:!1,sheduledTaskIsResheduled:!1},sync:{running:!1},cycle:{chainedTask:null}},this.mInteractionZone.addInteractionListener(r=>{(r.triggerType&U.set)!==0&&this.runUpdateAsynchron(r,null)})}deconstruct(){this.mInteractionZone.removeInteractionListener()}async waitForUpdate(){return this.mUpdateStates.async.hasSheduledTask?new Promise((t,r)=>{this.mUpdateStates.chainCompleteHooks.push((n,u)=>{u?r(u):t(n)})}):!1}executeInZone(t){return this.mInteractionZone.execute(t)}update(){let t=new It(U.manual,this.mInteractionZone,this.mManualComponentState);return this.runUpdateSynchron(t)}updateAsync(){let t=new It(U.manual,this.mInteractionZone,this.mManualComponentState);this.runUpdateAsynchron(t,null)}executeTaskChain(t,r,n,u){if(u.length>h.stackCap)throw new ge("Call loop detected",u);let p=performance.now();if(!r.forcedSync&&p-r.startTime>h.frameTime)throw new kt;u.push(t);let v=this.mInteractionZone.execute(()=>this.mUpdateFunction.call(this))||n;if(St.updateCycleRunId(r,this),!this.mUpdateStates.cycle.chainedTask)return v;let b=this.mUpdateStates.cycle.chainedTask;return this.mUpdateStates.cycle.chainedTask=null,this.executeTaskChain(b,r,v,u)}releaseUpdateChainCompleteHooks(t,r){if(!this.mUpdateStates.chainCompleteHooks.top)return;let n;for(;n=this.mUpdateStates.chainCompleteHooks.pop();)n(t,r)}runUpdateAsynchron(t,r){if(this.mUpdateStates.async.hasRunningTask||this.mUpdateStates.async.sheduledTaskIsResheduled){this.mUpdateStates.cycle.chainedTask=t;return}if(this.mUpdateStates.async.hasSheduledTask)return;let n=u=>{this.mUpdateStates.async.hasRunningTask=!0,this.mUpdateStates.async.hasSheduledTask=!1,this.mUpdateStates.async.sheduledTaskIsResheduled=!1;let p=!1;try{this.runUpdateSynchron(t)}catch(v){v instanceof kt&&u.initiator===this&&(p=!0)}finally{this.mUpdateStates.async.hasRunningTask=!1}p&&this.runUpdateAsynchron(t,u)};this.mUpdateStates.async.hasSheduledTask=!0,r&&(this.mUpdateStates.async.sheduledTaskIsResheduled=!0),globalThis.requestAnimationFrame(()=>{r?St.openResheduledCycle(r,n):St.openUpdateCycle({updater:this,runSync:!1},n)})}runUpdateSynchron(t){if(this.mUpdateStates.sync.running)return this.mUpdateStates.cycle.chainedTask=t,!1;this.mUpdateStates.sync.running=!0;try{let r=St.openUpdateCycle({updater:this,runSync:!0},n=>{if(this.mUpdateRunCache.has(n.runner))return St.updateCyleStartTime(n),this.mUpdateRunCache.get(n.runner);let u=this.executeTaskChain(t,n,!1,new Array);return this.mUpdateRunCache.set(n.runner,u),u});return this.releaseUpdateChainCompleteHooks(r),r}catch(r){throw r instanceof kt||this.releaseUpdateChainCompleteHooks(!1,r),r}finally{this.mUpdateStates.sync.running=!1}}},kt=class extends Error{constructor(){super("Update resheduled")}};var ye=class extends Ut{mUpdater;get updater(){return this.mUpdater}constructor(t){super(t);let r=Ct.create(`${t.constructor.name}-Update-Zone`);this.mUpdater=new ve({label:t.constructor.name,zone:r,onUpdate:()=>this.onUpdate()})}call(t,...r){return this.mUpdater.executeInZone(()=>super.call(t,...r))}deconstruct(){this.mUpdater.deconstruct(),super.deconstruct()}createProcessor(){return this.mUpdater.executeInZone(()=>super.createProcessor())}};var Lt=class{mExpression;mTemporaryValues;constructor(t,r,n){if(this.mTemporaryValues=new k,n.length>0)for(let u of n)this.mTemporaryValues.set(u,void 0);this.mExpression=this.createEvaluationFunction(t,this.mTemporaryValues).bind(r.store)}execute(){return this.mExpression()}setTemporaryValue(t,r){if(!this.mTemporaryValues.has(t))throw new A(`Temporary value "${t}" does not exist for this procedure.`,this);this.mTemporaryValues.set(t,r)}createEvaluationFunction(t,r){let n,u=`__${Math.random().toString(36).substring(2)}`;if(n="return function () {",r.size>0)for(let p of r.keys())n+=`const ${p} = ${u}.get('${p}');`;return n+=`return ${t};`,n+="};",new Function(u,n)(r)}};var pt=class{mDataLevel;get data(){return this.mDataLevel}constructor(t){this.mDataLevel=t}createExpressionProcedure(t,r){return new Lt(t,this.data,r??[])}setTemporaryValue(t,r){this.data.setTemporaryValue(t,r)}};var dt=class{mComponent;mDataProxy;mParentLevel;mTemporaryValues;get store(){return this.mDataProxy}constructor(t){this.mTemporaryValues=new k,t instanceof ot?(this.mParentLevel=null,this.mComponent=t):(this.mParentLevel=t,this.mComponent=t.mComponent),this.mDataProxy=this.createAccessProxy()}setTemporaryValue(t,r){this.mTemporaryValues.set(t,r)}updateLevelData(t){if(t.mParentLevel!==this.mParentLevel)throw new A("Can't update InstructionLevelData for a deeper level than it target data.",this);this.mTemporaryValues=t.mTemporaryValues}createAccessProxy(){return new Proxy(new Object,{get:(t,r)=>this.getValue(r),set:(t,r,n)=>(this.hasTemporaryValue(r)&&this.setTemporaryValue(r,n),r in this.mComponent.processor?(this.mComponent.processor[r]=n,!0):(this.setTemporaryValue(r,n),!0)),deleteProperty:()=>{throw new A("Deleting properties is not allowed",this)},ownKeys:()=>[...new Set([...Object.keys(this.mComponent.processor),...this.getTemporaryValuesList()])]})}getTemporaryValuesList(){let t=this.mTemporaryValues.map(r=>r);return this.mParentLevel&&t.push(...this.mParentLevel.getTemporaryValuesList()),t}getValue(t){if(this.mTemporaryValues.has(t))return this.mTemporaryValues.get(t);if(this.mParentLevel)return this.mParentLevel.getValue(t);if(t in this.mComponent.processor)return this.mComponent.processor[t]}hasTemporaryValue(t){return this.mTemporaryValues.has(t)?!0:this.mParentLevel?this.mParentLevel.hasTemporaryValue(t):!1}};var Ot=class h{mChildList;mInstruction;mInstructionType;get childList(){return this.mChildList}get instruction(){return this.mInstruction}get instructionType(){return this.mInstructionType}constructor(t,r){this.mChildList=Array(),this.mInstruction=r,this.mInstructionType=t}appendChild(...t){this.mChildList.push(...t)}clone(){let t=new h(this.instructionType,this.instruction);for(let r of this.mChildList)t.appendChild(r.clone());return t}equals(t){if(!(t instanceof h)||t.instruction!==this.instruction||t.instructionType!==this.instructionType||t.childList.length!==this.childList.length)return!1;for(let r=0;r<t.childList.length;r++)if(!t.childList[r].equals(this.childList[r]))return!1;return!0}removeChild(t){let r=this.mChildList.indexOf(t);if(r!==-1)return this.mChildList.splice(r,1)[0]}};var ft=class h{mExpression;get value(){return this.mExpression}constructor(t){this.mExpression=t}clone(){return new h(this.mExpression)}equals(t){return t instanceof h&&t.value===this.value}toString(){return`{{ ${this.mExpression} }}`}};var yt=class h{mContainsExpression;mTextValue;mValues;get containsExpression(){return this.mContainsExpression}get values(){return this.mValues}constructor(){this.mTextValue="",this.mContainsExpression=!1,this.mValues=[]}addValue(...t){for(let r of t)(this.mContainsExpression===!0||r instanceof ft)&&(this.mContainsExpression=!0),this.mValues.push(r),this.mTextValue+=r.toString()}clone(){let t=new h;for(let r of this.values)typeof r=="string"?t.addValue(r):t.addValue(r.clone());return t}equals(t){if(!(t instanceof h)||t.values.length!==this.values.length)return!1;for(let r=0;r<this.values.length;r++){let n=this.values[r],u=t.values[r];if(n!==u&&(typeof n!=typeof u||typeof n=="string"&&n!==u||!u.equals(n)))return!1}return!0}toString(){return this.mTextValue}};var te=class h{mName;mValue;get name(){return this.mName}get values(){return this.mValue}constructor(t){this.mName=t,this.mValue=new yt}clone(){let t=new h(this.name);for(let r of this.values.values)typeof r=="string"?t.values.addValue(r):t.values.addValue(r.clone());return t}equals(t){return!(!(t instanceof h)||t.name!==this.name||!t.values.equals(this.values))}};var bt=class h{mAttributeDictionary;mChildList;mTagName;get attributes(){return[...this.mAttributeDictionary.values()]}get childList(){return this.mChildList}get tagName(){return this.mTagName}constructor(t){this.mAttributeDictionary=new Map,this.mChildList=Array(),this.mTagName=t}appendChild(...t){this.mChildList.push(...t)}clone(){let t=new h(this.tagName);for(let r of this.mAttributeDictionary.values()){let n=t.setAttribute(r.name);for(let u of r.values.values)typeof u=="string"?n.addValue(u):n.addValue(u.clone())}for(let r of this.mChildList)t.appendChild(r.clone());return t}equals(t){if(!(t instanceof h)||t.tagName!==this.tagName||t.attributes.length!==this.mAttributeDictionary.size||t.childList.length!==this.mChildList.length)return!1;for(let r of t.mAttributeDictionary.values()){let n=this.mAttributeDictionary.get(r.name);if(!n||!n.equals(r))return!1}for(let r=0;r<t.childList.length;r++)if(!t.childList[r].equals(this.mChildList[r]))return!1;return!0}getAttribute(t){return this.mAttributeDictionary.get(t)?.values??null}removeAttribute(t){return this.mAttributeDictionary.delete(t)}removeChild(t){let r=this.mChildList.indexOf(t);if(r!==-1)return this.mChildList.splice(r,1)[0]}setAttribute(t){if(this.mAttributeDictionary.has(t))return this.mAttributeDictionary.get(t).values;let r=new te(t);return this.mAttributeDictionary.set(t,r),r.values}};var at=class h{mBodyElementList;get body(){return this.mBodyElementList}constructor(){this.mBodyElementList=new Array}appendChild(...t){this.mBodyElementList.push(...t)}clone(){let t=new h;for(let r of this.mBodyElementList)t.appendChild(r.clone());return t}equals(t){if(!(t instanceof h)||t.body.length!==this.mBodyElementList.length)return!1;for(let r=0;r<this.mBodyElementList.length;r++)if(!this.mBodyElementList[r].equals(t.body[r]))return!1;return!0}removeChild(t){let r=this.mBodyElementList.indexOf(t);if(r!==-1)return this.mBodyElementList.splice(r,1)[0]}};var nt=class{mComponentValues;mContent;mModules;mTemplate;get anchor(){return this.mContent.contentAnchor}get modules(){return this.mModules}get template(){return this.mTemplate}get values(){return this.mComponentValues}get content(){return this.mContent}constructor(t,r,n,u){this.mTemplate=t,this.mComponentValues=n,this.mContent=u,this.mModules=r,u.setCoreBuilder(this)}deconstruct(){this.content.deconstruct()}update(){let t=this.onUpdate(),r=!1,n=this.content.builders;if(n.length>0)for(let u=0;u<n.length;u++)r=n[u].update()||r;return t||r}createHtmlElement(t){let r=t.tagName;if(typeof r!="string")throw r;if(r.includes("-")){let u=globalThis.customElements.get(r);if(typeof u<"u")return new u}let n=t.getAttribute("xmlns");return n&&!n.containsExpression?document.createElementNS(n.values[0],r):document.createElement(r)}createTextNode(t){return document.createTextNode(t)}};var Xt=class{mChildBuilderList;mChildComponents;mContentAnchor;mContentBoundary;mLinkedContent;mRootChildList;get body(){return this.mRootChildList}get builders(){return this.mChildBuilderList}get contentAnchor(){return this.mContentAnchor}constructor(t){this.mChildBuilderList=new Array,this.mRootChildList=new Array,this.mChildComponents=new Map,this.mLinkedContent=new WeakSet,this.mContentAnchor=document.createComment(t),this.mContentBoundary={start:this.mContentAnchor,end:this.mContentAnchor}}deconstruct(){this.onDeconstruct();let t;for(;t=this.mChildBuilderList.pop();)t.deconstruct();for(let n of this.mChildComponents.values())n.deconstruct();this.mChildComponents.clear();let r;for(;r=this.mRootChildList.pop();)r instanceof nt||r.remove();this.contentAnchor.remove()}getBoundary(){let t=this.mContentBoundary.end instanceof nt?this.mContentBoundary.end.content.getBoundary().end:this.mContentBoundary.end;return{start:this.mContentBoundary.start,end:t}}insert(t,r,n){if(!this.mLinkedContent.has(n))throw new A("Can't add content to builder. Target is not part of builder.",this);let u=t instanceof nt?t.anchor:t;switch(r){case"After":{this.insertAfter(u,n);break}case"TopOf":{this.insertTop(u,n);break}case"BottomOf":{this.insertBottom(u,n);break}}this.mLinkedContent.add(t),t instanceof nt&&this.mChildBuilderList.push(t);let p=u.parentElement??u.getRootNode(),v=this.mContentAnchor.parentElement??this.mContentAnchor.getRootNode();if(p===v){let b=(()=>{switch(r){case"After":return this.mRootChildList.indexOf(n)+1;case"TopOf":return 0;case"BottomOf":return this.mRootChildList.length}})();b===this.mRootChildList.length&&(this.mContentBoundary.end=t),this.mRootChildList.splice(b+1,0,t)}}remove(t){if(!this.mLinkedContent.has(t))throw new A("Child node cant be deleted from builder when it not a child of them",this);if(this.mLinkedContent.delete(t),t instanceof nt){let n=this.mChildBuilderList.indexOf(t);n!==-1&&this.mChildBuilderList.splice(n,1),t.deconstruct()}else{let n=this.mChildComponents.get(t);n&&(n.deconstruct(),this.mChildComponents.delete(t)),t.remove()}let r=this.mRootChildList.indexOf(t);r!==-1&&(this.mRootChildList.splice(r,1),this.mContentBoundary.end=this.mRootChildList.at(-1)??this.mContentAnchor)}setCoreBuilder(t){this.mLinkedContent.add(t)}insertAfter(t,r){let n=r instanceof nt?r.content.getBoundary().end:r;(n.parentElement??n.getRootNode()).insertBefore(t,n.nextSibling)}insertBottom(t,r){if(r instanceof nt){this.insertAfter(t,r);return}if(r instanceof Element){r.appendChild(t);return}throw new A("Source node does not support child nodes.",this)}insertTop(t,r){if(r instanceof nt){this.insertAfter(t,r.anchor);return}if(r instanceof Element){r.prepend(t);return}throw new A("Source node does not support child nodes.",this)}};var be=class extends Xt{mAttributeModulesChangedOrder;mLinkedAttributeData;mLinkedAttributeExpressionModules;mLinkedAttributeModuleList;mLinkedExpressionModuleList;get linkedAttributeModules(){return this.mAttributeModulesChangedOrder&&(this.mAttributeModulesChangedOrder=!1,this.mLinkedAttributeModuleList.sort((t,r)=>t.accessMode-r.accessMode)),this.mLinkedAttributeModuleList}get linkedExpressionModules(){return this.mLinkedExpressionModuleList}constructor(t){super(t),this.mLinkedExpressionModuleList=new Array,this.mLinkedAttributeModuleList=new Array,this.mLinkedAttributeExpressionModules=new WeakMap,this.mLinkedAttributeData=new WeakMap,this.mAttributeModulesChangedOrder=!1}attributeOfLinkedExpressionModule(t){return this.mLinkedAttributeExpressionModules.get(t)}getLinkedAttributeData(t){if(!this.mLinkedAttributeData.has(t))throw new A("Attribute has no linked data.",this);return this.mLinkedAttributeData.get(t)}linkAttributeExpression(t,r){this.mLinkedAttributeExpressionModules.set(t,r)}linkAttributeModule(t){this.mLinkedAttributeModuleList.push(t),this.mAttributeModulesChangedOrder=!0}linkAttributeNodes(t,r,n){this.mLinkedAttributeData.set(t,{values:n,node:r})}linkExpressionModule(t){this.mLinkedExpressionModuleList.push(t)}onDeconstruct(){for(let t of this.mLinkedAttributeModuleList)t.deconstruct();for(let t of this.mLinkedExpressionModuleList)t.deconstruct()}};var we=class extends Xt{mInstructionModule;get instructionModule(){return this.mInstructionModule}constructor(t,r){super(r),this.mInstructionModule=t}onDeconstruct(){this.mInstructionModule.deconstruct()}};var xe=class extends nt{constructor(t,r,n){let u=r.createInstructionModule(t,n);super(t,r,n,new we(u,`Instruction - {$${t.instructionType}}`))}onUpdate(){if(this.content.instructionModule.update()){let t=this.content.body;this.updateStaticBuilder(t,this.content.instructionModule.instructionResult.elementList)}return!1}insertNewContent(t,r){let n=new Ht(t.template,this.modules,t.dataLevel,`Child - {$${this.template.instructionType}}`);return r===null?this.content.insert(n,"TopOf",this):this.content.insert(n,"After",r),n}updateStaticBuilder(t,r){let u=new qt((b,x)=>x.template.equals(b.template)).differencesOf(t,r),p=0,v=null;for(let b=0;b<u.length;b++){let x=u[b];if(x.changeState===gt.Remove)this.content.remove(x.item);else if(x.changeState===gt.Insert)v=this.insertNewContent(x.item,v),p++;else{let E=r[p].dataLevel;x.item.values.updateLevelData(E),v=x.item,p++}}}};var Ht=class extends nt{mInitialized;constructor(t,r,n,u){super(t,r,n,new be(`Static - {${u}}`)),this.mInitialized=!1}onUpdate(){this.mInitialized||(this.mInitialized=!0,this.buildTemplate([this.template],this));let t=!1,r=this.content.linkedAttributeModules;for(let p=0;p<r.length;p++)t=r[p].update()||t;let n=!1,u=this.content.linkedExpressionModules;for(let p=0;p<u.length;p++){let v=u[p];if(v.update()){n=!0;let b=this.content.attributeOfLinkedExpressionModule(v);if(!b)continue;let x=this.content.getLinkedAttributeData(b),E=x.values.reduce((a,o)=>a+o.data,"");x.node.setAttribute(b.name,E)}}return t||n}buildInstructionTemplate(t,r){this.content.insert(new xe(t,this.modules,new dt(this.values)),"BottomOf",r)}buildStaticTemplate(t,r){let n=this.createHtmlElement(t);this.content.insert(n,"BottomOf",r);for(let u of t.attributes){let p=this.modules.createAttributeModule(u,n,this.values);if(p){this.content.linkAttributeModule(p);continue}if(u.values.containsExpression){let v=new Array;for(let b of u.values.values){let x=this.createTextNode("");if(v.push(x),!(b instanceof ft)){x.data=b;continue}let E=this.modules.createExpressionModule(b,x,this.values);this.content.linkExpressionModule(E),this.content.linkAttributeExpression(E,u)}this.content.linkAttributeNodes(u,n,v);continue}n.setAttribute(u.name,u.values.toString())}this.content.insert(n,"BottomOf",r),this.buildTemplate(t.childList,n)}buildTemplate(t,r){for(let n of t)n instanceof at?this.buildTemplate(n.body,r):n instanceof yt?this.buildTextTemplate(n,r):n instanceof Ot?this.buildInstructionTemplate(n,r):n instanceof bt&&this.buildStaticTemplate(n,r)}buildTextTemplate(t,r){for(let n of t.values){if(typeof n=="string"){this.content.insert(this.createTextNode(n),"BottomOf",r);continue}let u=this.createTextNode("");this.content.insert(u,"BottomOf",r);let p=this.modules.createExpressionModule(n,u,this.values);this.content.linkExpressionModule(p)}}};var ee=class{mHtmlElement;mShadowRoot;get htmlElement(){return this.mHtmlElement}get shadowRoot(){return this.mShadowRoot}constructor(t){this.mHtmlElement=t,this.mShadowRoot=this.mHtmlElement.attachShadow({mode:"open"})}};var Y=class{mDataLevel;get data(){return this.mDataLevel}constructor(t){this.mDataLevel=t}createExpressionProcedure(t,r){return new Lt(t,this.data,r??[])}};var Dt=class extends Ut{constructor(t){super({constructor:t.constructor,parent:t.parent}),this.setProcessorInjection(Y,new Y(t.values))}deconstruct(){super.deconstruct(),this.call("onDeconstruct")}update(){return this.onUpdate()}};var Q=class{mValue;get value(){return this.mValue}constructor(t){this.mValue=t}};var tt=class{constructor(){throw new A("Reference should not be instanced.",this)}};var ht=class{constructor(){throw new A("Reference should not be instanced.",this)}};var _t=class h extends Dt{mLastResult;mTargetTextNode;constructor(t){super({constructor:t.constructor,parent:t.parent,values:t.values}),this.mTargetTextNode=t.targetNode,this.mLastResult=null,this.setProcessorInjection(h,this),this.setProcessorInjection(ht,t.targetTemplate.clone()),this.setProcessorInjection(tt,t.targetNode),this.setProcessorInjection(Q,new Q(t.targetTemplate.value))}onUpdate(){let t=this.call("onUpdate");t===null&&(t="");let r=this.mLastResult===null||this.mLastResult!==t;if(r){let n=this.mTargetTextNode;n.data=t,this.mLastResult=t}return r}};function Ye(){return(h,t)=>{z.registerInjectable(h,t.metadata,"instanced"),st.register(_t,h,{})}}function Ks(){function h(a,o){return function(l){r(o,"addInitializer"),n(l,"An initializer"),a.push(l)}}function t(a,o,c,l,e,y,g,T,w){var m;switch(e){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var i={kind:m,name:g?"#"+o:o,static:y,private:g,metadata:T},f={v:!1};i.addInitializer=h(l,f);var s,d;e===0?g?(s=c.get,d=c.set):(s=function(){return this[o]},d=function(I){this[o]=I}):e===2?s=function(){return c.value}:((e===1||e===3)&&(s=function(){return c.get.call(this)}),(e===1||e===4)&&(d=function(I){c.set.call(this,I)})),i.access=s&&d?{get:s,set:d}:s?{get:s}:{set:d};try{return a(w,i)}finally{f.v=!0}}function r(a,o){if(a.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(a,o){if(typeof a!="function")throw new TypeError(o+" must be a function")}function u(a,o){var c=typeof o;if(a===1){if(c!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(c!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function p(a,o,c,l,e,y,g,T,w){var m=c[0],i,f,s;g?e===0||e===1?i={get:c[3],set:c[4]}:e===3?i={get:c[3]}:e===4?i={set:c[3]}:i={value:c[3]}:e!==0&&(i=Object.getOwnPropertyDescriptor(o,l)),e===1?s={get:i.get,set:i.set}:e===2?s=i.value:e===3?s=i.get:e===4&&(s=i.set);var d,I,D;if(typeof m=="function")d=t(m,l,i,T,e,y,g,w,s),d!==void 0&&(u(e,d),e===0?f=d:e===1?(f=d.init,I=d.get||s.get,D=d.set||s.set,s={get:I,set:D}):s=d);else for(var _=m.length-1;_>=0;_--){var P=m[_];if(d=t(P,l,i,T,e,y,g,w,s),d!==void 0){u(e,d);var N;e===0?N=d:e===1?(N=d.init,I=d.get||s.get,D=d.set||s.set,s={get:I,set:D}):s=d,N!==void 0&&(f===void 0?f=N:typeof f=="function"?f=[f,N]:f.push(N))}}if(e===0||e===1){if(f===void 0)f=function(S,C){return C};else if(typeof f!="function"){var M=f;f=function(S,C){for(var L=C,O=0;O<M.length;O++)L=M[O].call(S,L);return L}}else{var $=f;f=function(S,C){return $.call(S,C)}}a.push(f)}e!==0&&(e===1?(i.get=s.get,i.set=s.set):e===2?i.value=s:e===3?i.get=s:e===4&&(i.set=s),g?e===1?(a.push(function(S,C){return s.get.call(S,C)}),a.push(function(S,C){return s.set.call(S,C)})):e===2?a.push(s):a.push(function(S,C){return s.call(S,C)}):Object.defineProperty(o,l,i))}function v(a,o,c){for(var l=[],e,y,g=new Map,T=new Map,w=0;w<o.length;w++){var m=o[w];if(Array.isArray(m)){var i=m[1],f=m[2],s=m.length>3,d=i>=5,I,D;if(d?(I=a,i=i-5,y=y||[],D=y):(I=a.prototype,e=e||[],D=e),i!==0&&!s){var _=d?T:g,P=_.get(f)||0;if(P===!0||P===3&&i!==4||P===4&&i!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!P&&i>2?_.set(f,i):_.set(f,!0)}p(l,I,m,f,i,d,s,D,c)}}return b(l,e),b(l,y),l}function b(a,o){o&&a.push(function(c){for(var l=0;l<o.length;l++)o[l].call(c);return c})}function x(a,o,c){if(o.length>0){for(var l=[],e=a,y=a.name,g=o.length-1;g>=0;g--){var T={v:!1};try{var w=o[g](e,{kind:"class",name:y,addInitializer:h(l,T),metadata:c})}finally{T.v=!0}w!==void 0&&(u(10,w),e=w)}return[E(e,c),function(){for(var m=0;m<l.length;m++)l[m].call(e)}]}}function E(a,o){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,c,l,e){if(e!==void 0)var y=e[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(y===void 0?null:y),T=v(o,c,g);return l.length||E(o,g),{e:T,get c(){return x(o,l,g)}}}}function er(h,t,r,n){return(er=Ks())(h,t,r,n)}var rr,ke,We;rr=Ye();var tr=class{static{({c:[We,ke]}=er(this,[],[rr]))}constructor(t=z.use(Y),r=z.use(Q)){this.mProcedure=t.createExpressionProcedure(r.value)}mProcedure;onUpdate(){let t=this.mProcedure.execute();return typeof t>"u"?null:t?.toString()}static{ke()}};var lt=class{mName;mValue;get name(){return this.mName}get value(){return this.mValue}constructor(t,r){this.mName=t,this.mValue=r}};var mt=class h extends Dt{mAccessMode;get accessMode(){return this.mAccessMode}constructor(t){super({constructor:t.constructor,parent:t.parent,values:t.values}),this.mAccessMode=t.accessMode,this.setProcessorInjection(h,this),this.setProcessorInjection(ht,t.targetTemplate.clone()),this.setProcessorInjection(tt,t.targetNode),this.setProcessorInjection(lt,new lt(t.targetTemplate.name,t.targetTemplate.values.toString()))}onUpdate(){return this.call("onUpdate")??!1}};var ct=class{mElementList;mTemplates;mDataLevels;get elementList(){return this.mElementList}constructor(){this.mElementList=new Array,this.mTemplates=new Set,this.mDataLevels=new Set}addElement(t,r){if(this.mTemplates.has(t)||this.mDataLevels.has(r))throw new A("Can't add same template or values for multiple Elements.",this);this.mTemplates.add(t),this.mDataLevels.add(r),this.mElementList.push({template:t,dataLevel:r})}};var Pt=class h extends Dt{mLastResult;get instructionResult(){return this.mLastResult}constructor(t){super({constructor:t.constructor,parent:t.parent,values:t.values}),this.setProcessorInjection(h,this),this.setProcessorInjection(ht,t.targetTemplate.clone()),this.setProcessorInjection(Q,new Q(t.targetTemplate.instruction)),this.mLastResult=new ct}onUpdate(){let t=this.call("onUpdate");return t instanceof ct?(this.mLastResult=t,!0):!1}};var Te=class h{static mAttributeModuleCache=new k;static mExpressionModuleCache=new WeakMap;static mInstructionModuleCache=new k;mComponent;mExpressionModule;constructor(t,r){this.mExpressionModule=r??We,this.mComponent=t}createAttributeModule(t,r,n){let u=(()=>{let p=h.mAttributeModuleCache.get(t.name);if(p||p===null)return p;for(let v of st.get(mt))if(v.processorConfiguration.selector.test(t.name))return h.mAttributeModuleCache.set(t.name,v),v;return h.mAttributeModuleCache.set(t.name,null),null})();return u===null?null:new mt({accessMode:u.processorConfiguration.access,constructor:u.processorConstructor,parent:this.mComponent,targetNode:r,targetTemplate:t,values:n}).setup()}createExpressionModule(t,r,n){let u=(()=>{let p=h.mExpressionModuleCache.get(this.mExpressionModule);if(p)return p;let v=st.get(_t).find(b=>b.processorConstructor===this.mExpressionModule);if(!v)throw new A("An expression module could not be found.",this);return h.mExpressionModuleCache.set(this.mExpressionModule,v),v})();return new _t({constructor:u.processorConstructor,parent:this.mComponent,targetNode:r,targetTemplate:t,values:n}).setup()}createInstructionModule(t,r){let n=(()=>{let u=h.mInstructionModuleCache.get(t.instructionType);if(u)return u;for(let p of st.get(Pt))if(p.processorConfiguration.instructionType===t.instructionType)return h.mInstructionModuleCache.set(t.instructionType,p),p;throw new A(`Instruction module type "${t.instructionType}" not found.`,this)})();return new Pt({constructor:n.processorConstructor,parent:this.mComponent,targetTemplate:t,values:r}).setup()}};var Rt=class extends A{mColumnEnd;mColumnStart;mLineEnd;mLineStart;get columnEnd(){return this.mColumnEnd}get columnStart(){return this.mColumnStart}get lineEnd(){return this.mLineEnd}get lineStart(){return this.mLineStart}constructor(t,r,n,u,p,v,b){super(t,r,b),this.mColumnStart=n,this.mLineStart=u,this.mColumnEnd=p,this.mLineEnd=v}};var Yt=class{mDependencyFetch;mDependencyFetchResolved;mLexer;mMeta;mPattern;mPatternDependencies;mType;get dependencies(){return this.mPatternDependencies}get dependenciesResolved(){return this.mDependencyFetchResolved}get lexer(){return this.mLexer}get meta(){return this.mMeta}get pattern(){return this.mPattern}constructor(t,r){if(this.mLexer=t,this.mType=r.type,this.mMeta=r.metadata,this.mPatternDependencies=new Array,this.mDependencyFetch=r.dependencyFetch??null,this.mDependencyFetchResolved=!r.dependencyFetch,this.mType==="split"&&!this.mDependencyFetch)throw new A("Split token with a start and end token, need inner token definitions.",this);if(this.mType==="single"&&this.mDependencyFetch)throw new A("Pattern does not allow inner token pattern.",this);this.mPattern=this.convertTokenPattern(this.mType,r.pattern)}isSplit(){return this.mType==="split"}resolveDependencies(){this.mDependencyFetchResolved||(this.mDependencyFetch(this),this.mDependencyFetchResolved=!0)}useChildPattern(t){if(this.mLexer!==t.lexer)throw new A("Can only add dependencies of the same lexer.",this);this.mPatternDependencies.push(t)}convertTokenPattern(t,r){if("single"in r){if(t==="split")throw new A("Can't use split pattern type with single pattern definition.",this);return{start:{regex:r.single.regex,types:r.single.types,validator:r.single.validator??null}}}else{if(t==="single")throw new A("Can't use single pattern type with split pattern definition.",this);return{start:{regex:r.start.regex,types:r.start.types,validator:r.start.validator??null},end:{regex:r.end.regex,types:r.end.types,validator:r.end.validator??null},innerType:r.innerType??null}}}};var Wt=class{mColumnNumber;mLineNumber;mMetas;mType;mValue;get columnNumber(){return this.mColumnNumber}get lineNumber(){return this.mLineNumber}get metas(){return[...this.mMetas]}get type(){return this.mType}get value(){return this.mValue}constructor(t,r,n,u){this.mValue=r,this.mColumnNumber=n,this.mLineNumber=u,this.mType=t,this.mMetas=new Set}addMeta(...t){for(let r of t)this.mMetas.add(r)}hasMeta(t){return this.mMetas.has(t)}};var re=class{mRootPattern;mSettings;get errorType(){return this.mSettings.errorType}set errorType(t){this.mSettings.errorType=t}get trimWhitespace(){return this.mSettings.trimSpaces}set trimWhitespace(t){this.mSettings.trimSpaces=t}get validWhitespaces(){return[...this.mSettings.whiteSpaces].join("")}set validWhitespaces(t){this.mSettings.whiteSpaces=new Set(t.split(""))}constructor(){this.mSettings={errorType:null,trimSpaces:!0,whiteSpaces:new Set},this.mRootPattern=new Yt(this,{type:"single",pattern:{single:{regex:/^/,types:{},validator:null}},metadata:[],dependencyFetch:null})}createTokenPattern(t,r){let n=b=>typeof b=="string"?{token:b}:b,u=b=>{let x=new Set(b.flags.split(""));return new RegExp(`^(?<token>${b.source})`,[...x].join(""))},p=new Array;t.meta&&(typeof t.meta=="string"?p.push(t.meta):p.push(...t.meta));let v;return"regex"in t.pattern?v={single:{regex:u(t.pattern.regex),types:n(t.pattern.type),validator:t.pattern.validator??null}}:v={start:{regex:u(t.pattern.start.regex),types:n(t.pattern.start.type),validator:t.pattern.start.validator??null},end:{regex:u(t.pattern.end.regex),types:n(t.pattern.end.type),validator:t.pattern.end.validator??null},innerType:t.pattern.innerType??null},new Yt(this,{type:"regex"in t.pattern?"single":"split",pattern:v,metadata:p,dependencyFetch:r??null})}*tokenize(t,r){let n={data:t,cursor:{position:0,column:1,line:1},error:null,progressTracker:r??null};yield*this.tokenizeRecursionLayer(n,this.mRootPattern,new Array,null)}useRootTokenPattern(t){if(t.lexer!==this)throw new A("Token pattern must be created by this lexer.",this);this.mRootPattern.useChildPattern(t)}findNextStartToken(t,r,n,u){for(let p of r){let v=p.pattern.start,b=this.matchToken(p,v,t,n,u);if(b!==null)return{pattern:p,token:b}}return null}findTokenTypeOfMatch(t,r,n){for(let v in t.groups){let b=t.groups[v],x=r[v];if(!(!b||!x)){if(b.length!==t[0].length)throw new A("A group of a token pattern must match the whole token.",this);return x}}let u=new Array;for(let v in t.groups)t.groups[v]&&u.push(v);let p=new Array;for(let v in r)p.push(v);throw new A(`No token type found for any defined pattern regex group. Full: "${t[0]}", Matches: "${u.join(", ")}", Available: "${p.join(", ")}", Regex: "${n.source}"`,this)}*generateErrorToken(t,r){if(!t.error||!this.mSettings.errorType)return;let n=new Wt(this.mSettings.errorType,t.error.data,t.error.startColumn,t.error.startLine);n.addMeta(...r),t.error=null,yield n}generateToken(t,r,n,u,p,v){let b=n[0],x=this.findTokenTypeOfMatch(n,u,v),E=new Wt(p??x,b,t.cursor.column,t.cursor.line);return E.addMeta(...r),E}matchToken(t,r,n,u,p){let v=r.regex;v.lastIndex=0;let b=v.exec(n.data);if(!b||b.index!==0)return null;let x=this.generateToken(n,[...u,...t.meta],b,r.types,p,v);if(r.validator){let E=n.data.substring(x.value.length);if(!r.validator(x,E,n.cursor.position))return null}return this.moveCursor(n,x.value),x}moveCursor(t,r){let n=r.split(`
`);n.length>1&&(t.cursor.column=1),t.cursor.line+=n.length-1,t.cursor.column+=n.at(-1).length,t.cursor.position+=r.length,t.data=t.data.substring(r.length),this.trackProgress(t)}pushNextCharToErrorState(t){if(!this.mSettings.errorType)throw new Rt(`Unable to parse next token. No valid pattern found for "${t.data.substring(0,20)}".`,this,t.cursor.column,t.cursor.line,t.cursor.column,t.cursor.line);t.error||(t.error={data:"",startColumn:t.cursor.column,startLine:t.cursor.line});let r=t.data.charAt(0);t.error.data+=r,this.moveCursor(t,r)}skipNextWhitespace(t){let r=t.data.charAt(0);return!this.mSettings.trimSpaces||!this.mSettings.whiteSpaces.has(r)?!1:(this.moveCursor(t,r),!0)}*tokenizeRecursionLayer(t,r,n,u){let p=r.dependencies;for(;t.data.length>0;){if(!t.error&&this.skipNextWhitespace(t))continue;if(r.isSplit()){let x=this.matchToken(r,r.pattern.end,t,n,u);if(x!==null){yield*this.generateErrorToken(t,n),yield x;return}}let v=this.findNextStartToken(t,p,n,u);if(!v){this.pushNextCharToErrorState(t);continue}yield*this.generateErrorToken(t,n),yield v.token;let b=v.pattern;b.isSplit()&&(b.resolveDependencies(),yield*this.tokenizeRecursionLayer(t,b,[...n,...b.meta],u??b.pattern.innerType))}yield*this.generateErrorToken(t,n)}trackProgress(t){t.progressTracker!==null&&t.progressTracker(t.cursor.position,t.cursor.line,t.cursor.column)}};var Z=class extends Error{static PARSER_ERROR=Symbol("PARSER_ERROR");mTrace;get columnEnd(){return this.mTrace.top.range.columnEnd}get columnStart(){return this.mTrace.top.range.columnStart}get graph(){return this.mTrace.top.graph}get incidents(){return this.mTrace.incidents}get lineEnd(){return this.mTrace.top.range.lineEnd}get lineStart(){return this.mTrace.top.range.lineStart}constructor(t){super(t.top.message,{cause:t.top.cause}),this.mTrace=t}};var Ie=class{mIncidents;mTop;get incidents(){if(this.mIncidents===null)throw new A("A complete incident list is only available on debug mode.",this);return this.mIncidents}get top(){return this.mTop}constructor(t){this.mTop={message:"Unknown parser error",priority:0,graph:null,range:{lineStart:1,columnStart:1,lineEnd:1,columnEnd:1},cause:null},t?this.mIncidents=new Array:this.mIncidents=null}push(t,r,n,u,p,v,b=!1,x=null){let E;if(b?E=this.mTop.priority+1:E=p*1e4+v,this.mIncidents!==null){let a={message:t,priority:E,graph:r,range:{lineStart:n,columnStart:u,lineEnd:p,columnEnd:v},cause:x};this.mIncidents.push(a)}this.mTop&&E<this.mTop.priority||this.setTop({message:t,priority:E,graph:r,range:{lineStart:n,columnStart:u,lineEnd:p,columnEnd:v},cause:x})}setTop(t){this.mTop=t}};var Ce=class h{static MAX_JUNCTION_CIRCULAR_REFERENCES=1e3;mGraphStack;mIncidentTrace;mLastTokenPosition;mProcessStack;mTokenCache;mTokenGenerator;mTrimTokenCache;get currentGraph(){return this.mGraphStack.top.graph}get currentToken(){let t=this.mGraphStack.top;return this.mTokenCache[t.token.cursor]}get incidentTrace(){return this.mIncidentTrace}get processStack(){return this.mProcessStack}constructor(t,r,n){this.mTokenGenerator=t,this.mGraphStack=new Tt,this.mLastTokenPosition={column:1,line:1},this.mTokenCache=new Array,this.mProcessStack=new Tt,this.mTrimTokenCache=n,this.mIncidentTrace=new Ie(r),this.mGraphStack.push({graph:null,linear:!0,circularGraphs:new k,token:{start:0,cursor:-1}})}collapse(){let t=this.mGraphStack.top,r=this.mTokenCache.slice(t.token.cursor);r.length!==0&&r.at(-1)===null&&r.pop();for(let n of this.mTokenGenerator)r.push(n);return r}getGraphBoundingToken(){let t=this.mGraphStack.top,r=this.mTokenCache[t.token.start],n=this.mTokenCache[t.token.cursor-1];return r??=n,n??=r,[r??null,n??null]}getGraphPosition(){let t=this.mGraphStack.top,r,n;if(r=this.mTokenCache[t.token.start],n=this.mTokenCache[t.token.cursor-1],r??=n,n??=r,!r||!n)return{graph:t.graph,columnEnd:this.mLastTokenPosition.column,columnStart:this.mLastTokenPosition.column,lineEnd:this.mLastTokenPosition.line,lineStart:this.mLastTokenPosition.line};let u,p;if(n.value.includes(`
`)){let v=n.value.split(`
`);p=n.lineNumber+v.length-1,u=1+v[v.length-1].length}else u=n.columnNumber+n.value.length,p=n.lineNumber;return{graph:t.graph,lineStart:r.lineNumber,columnStart:r.columnNumber,lineEnd:p,columnEnd:u}}getTokenPosition(){let t=this.mGraphStack.top,r=this.currentToken;if(!r)return{graph:t.graph,columnEnd:this.mLastTokenPosition.column,columnStart:this.mLastTokenPosition.column,lineEnd:this.mLastTokenPosition.line,lineStart:this.mLastTokenPosition.line};let n,u;if(r.value.includes(`
`)){let p=r.value.split(`
`);u=r.lineNumber+p.length-1,n=1+p[p.length-1].length}else n=r.columnNumber+r.value.length,u=r.lineNumber;return{graph:t.graph,lineStart:r.lineNumber,columnStart:r.columnNumber,lineEnd:u,columnEnd:n}}graphIsCircular(t){let r=this.mGraphStack.top;if(!r.circularGraphs.has(t))return!1;if(t.isJunction){if(r.circularGraphs.get(t)>h.MAX_JUNCTION_CIRCULAR_REFERENCES)throw new A("Junction graph called circular too often.",this);return!1}return!0}moveNextToken(){let t=this.mGraphStack.top;if(t.circularGraphs.size>0&&(t.circularGraphs=new k),t.graph&&t.graph.isJunction)throw new A("Junction graph must not have own nodes.",this);if(t.token.cursor++,t.token.cursor<this.mTokenCache.length)return;let r=this.mTokenGenerator.next();if(r.done){this.mTokenCache.push(null);return}this.mLastTokenPosition.column=r.value.columnNumber,this.mLastTokenPosition.line=r.value.lineNumber,this.mTokenCache.push(r.value)}popGraphStack(t){let r=this.mGraphStack.pop(),n=this.mGraphStack.top;if(t&&(r.token.cursor=r.token.start),r.token.cursor!==r.token.start&&n.circularGraphs.size>0&&(n.circularGraphs=new k),!this.mTrimTokenCache){n.token.cursor=r.token.cursor;return}r.linear?(this.mTokenCache.splice(0,r.token.cursor),n.token.start=0,n.token.cursor=0):n.token.cursor=r.token.cursor}pushGraphStack(t,r){let n=this.mGraphStack.top,u={graph:t,linear:r&&n.linear,circularGraphs:new k(n.circularGraphs),token:{start:n.token.cursor,cursor:n.token.cursor}},p=u.circularGraphs.get(t)??0;u.circularGraphs.set(t,p+1),this.mGraphStack.push(u)}};var oe=class h{static NODE_NULL_RESULT=Symbol("FAILED_NODE_VALUE_PARSE");static NODE_VALUE_LIST_END_MEET=Symbol("FAILED_NODE_VALUE_PARSE");mConfiguration;mLexer;mRootPart;get lexer(){return this.mLexer}constructor(t,r){this.mLexer=t,this.mRootPart=null,this.mConfiguration={keepTraceIncidents:!1,trimTokenCache:!1,...r}}parse(t,r){if(this.mRootPart===null)throw new A("Parser has not root part set.",this);let n=new Ce(this.mLexer.tokenize(t,r),this.mConfiguration.keepTraceIncidents,this.mConfiguration.trimTokenCache),u=(()=>{try{return this.beginParseProcess(n,this.mRootPart)}catch(v){if(v instanceof Rt)return n.incidentTrace.push(v.message,n.currentGraph,v.lineStart,v.columnStart,v.lineEnd,v.columnEnd,!0,v),Z.PARSER_ERROR;let b=v instanceof Error?v.message:v.toString(),x=n.getGraphPosition();return n.incidentTrace.push(b,n.currentGraph,x.lineStart,x.columnStart,x.lineEnd,x.columnEnd,!0,v),Z.PARSER_ERROR}})();if(u===Z.PARSER_ERROR)throw new Z(n.incidentTrace);let p=n.collapse();if(p.length!==0){let v=p[0];if(n.incidentTrace.top.range.lineEnd===1&&n.incidentTrace.top.range.columnEnd===1){let b=`Tokens could not be parsed. Graph end meet without reaching last token. Current: "${v.value}" (${v.type})`;n.incidentTrace.push(b,this.mRootPart,v.lineNumber,v.columnNumber,v.lineNumber,v.columnNumber)}throw new Z(n.incidentTrace)}return u}setRootGraph(t){this.mRootPart=t}beginParseProcess(t,r){t.moveNextToken(),t.processStack.push({type:"graph-parse",parameter:{graph:r,linear:!0},state:0});let n=h.NODE_NULL_RESULT;for(;t.processStack.top;)n=this.processStack(t,t.processStack.top,n);return n}processChainedNodeParseProcess(t,r,n){switch(r.state){case 0:{let v=r.parameter.node.connections.next;return v===null?(t.processStack.pop(),{}):(r.state++,t.processStack.push({type:"node-parse",parameter:{node:v},state:0,values:{}}),h.NODE_NULL_RESULT)}case 1:{let u=n;return u===Z.PARSER_ERROR?(t.processStack.pop(),Z.PARSER_ERROR):(t.processStack.pop(),u)}}throw new A(`Invalid node next parse state "${r.state}".`,this)}processGraphParseProcess(t,r,n){let u=r.parameter.graph;switch(r.state){case 0:{if(t.graphIsCircular(u)){let v=t.getGraphPosition();return t.incidentTrace.push("Circular graph detected.",u,v.lineStart,v.columnStart,v.lineEnd,v.columnEnd),t.processStack.pop(),Z.PARSER_ERROR}let p=r.parameter.linear;return t.pushGraphStack(u,p),r.state++,t.processStack.push({type:"node-parse",parameter:{node:u.node},state:0,values:{}}),h.NODE_NULL_RESULT}case 1:{let p=n;if(p===Z.PARSER_ERROR)return t.popGraphStack(!0),t.processStack.pop(),Z.PARSER_ERROR;let v=u.convert(p,t);if(typeof v=="symbol"){let b=t.getGraphPosition();return t.incidentTrace.push(v.description??"Unknown data convert error",b.graph,b.lineStart,b.columnStart,b.lineEnd,b.columnEnd),t.popGraphStack(!0),t.processStack.pop(),Z.PARSER_ERROR}return t.popGraphStack(!1),t.processStack.pop(),v}}throw new A(`Invalid graph parse state "${r.state}".`,this)}processNodeParseProcess(t,r,n){let u=r.parameter.node;switch(r.state){case 0:return t.processStack.push({type:"node-value-parse",parameter:{node:u,valueIndex:0},state:0,values:{}}),r.state++,h.NODE_NULL_RESULT;case 1:{let p=n;return p===Z.PARSER_ERROR?(t.processStack.pop(),Z.PARSER_ERROR):(r.values.nodeValueResult=p,t.processStack.push({type:"node-next-parse",parameter:{node:u},state:0}),r.state++,h.NODE_NULL_RESULT)}case 2:{let p=n;if(p===Z.PARSER_ERROR)return t.processStack.pop(),Z.PARSER_ERROR;let v=u.mergeData(r.values.nodeValueResult,p);return t.processStack.pop(),v}}throw new A(`Invalid node parse state "${r.state}".`,this)}processNodeValueParseProcess(t,r,n){let u=r.parameter.node;switch(r.state){case 0:{if(n!==h.NODE_NULL_RESULT&&n!==Z.PARSER_ERROR)return r.values.parseResult=n,r.state++,h.NODE_NULL_RESULT;let p=r.parameter.valueIndex,v=u.connections;if(p>=v.values.length)return r.values.parseResult=h.NODE_VALUE_LIST_END_MEET,r.state++,h.NODE_NULL_RESULT;r.parameter.valueIndex++;let b=t.currentToken,x=v.values[p];if(typeof x=="string"){if(!b){if(v.required){let E=t.getTokenPosition();t.incidentTrace.push(`Unexpected end of statement. Token "${x}" expected.`,t.currentGraph,E.lineStart,E.columnStart,E.lineEnd,E.columnEnd)}return h.NODE_NULL_RESULT}if(x!==b.type){if(v.required){let E=t.getTokenPosition();t.incidentTrace.push(`Unexpected token "${b.value}". "${x}" expected`,t.currentGraph,E.lineStart,E.columnStart,E.lineEnd,E.columnEnd)}return h.NODE_NULL_RESULT}return t.moveNextToken(),b.value}else{let E=v.values.length===1||v.values.length===p+1;return t.processStack.push({type:"graph-parse",parameter:{graph:x,linear:E},state:0}),h.NODE_NULL_RESULT}}case 1:{let p=r.values.parseResult,v=u.connections;if(p===h.NODE_VALUE_LIST_END_MEET&&!v.required){t.processStack.pop();return}return p===h.NODE_VALUE_LIST_END_MEET?(t.processStack.pop(),Z.PARSER_ERROR):(t.processStack.pop(),p)}}throw new A(`Invalid node value parse state "${r.state}".`,this)}processStack(t,r,n){switch(r.type){case"graph-parse":return this.processGraphParseProcess(t,r,n);case"node-parse":return this.processNodeParseProcess(t,r,n);case"node-value-parse":return this.processNodeValueParseProcess(t,r,n);case"node-next-parse":return this.processChainedNodeParseProcess(t,r,n)}}};var J=class h{static define(t,r=!1){return new h(t,r)}mDataConverterList;mGraphCollector;mIsJunction;mResolvedGraphNode;get isJunction(){return this.mIsJunction}get node(){return this.mResolvedGraphNode||(this.mResolvedGraphNode=this.mGraphCollector().root),this.mResolvedGraphNode}constructor(t,r){this.mGraphCollector=t,this.mDataConverterList=new Array,this.mResolvedGraphNode=null,this.mIsJunction=r}convert(t,r){if(this.mDataConverterList.length===0)return t;let n=r.getGraphBoundingToken(),u=n[0]??void 0,p=n[1]??void 0;if(this.mDataConverterList.length===1)return this.mDataConverterList[0](t,u,p);let v=t;for(let b of this.mDataConverterList)if(v=b(v,u,p),typeof v=="symbol")return v;return v}converter(t){let r=new h(this.mGraphCollector,this.isJunction);return r.mDataConverterList.push(...this.mDataConverterList,t),r}};var X=class h{static new(){let t=new h("",!1,[]);return t.mRootNode=null,t}mConnections;mIdentifier;mRootNode;get configuration(){return{dataKey:this.mIdentifier.dataKey,isList:this.mIdentifier.type==="list",isRequired:this.mConnections.required,isBranch:this.mConnections.values.length>1}}get connections(){return this.mConnections}get root(){if(!this.mRootNode)throw new A("Staring nodes must be chained with another node to be used.",this);return this.mRootNode}constructor(t,r,n,u){if(t==="")this.mIdentifier={type:"empty",dataKey:"",mergeKey:""};else if(t.endsWith("[]"))this.mIdentifier={type:"list",mergeKey:"",dataKey:t.substring(0,t.length-2)};else if(t.includes("<-")){let v=t.split("<-");this.mIdentifier={type:"merge",dataKey:v[0],mergeKey:v[1]}}else this.mIdentifier={type:"single",mergeKey:"",dataKey:t};let p=n.map(v=>v instanceof h?J.define(()=>v):v);this.mConnections={required:r,values:p,next:null},u?this.mRootNode=u:this.mRootNode=this}mergeData(t,r){if(this.mIdentifier.type==="empty")return r;let n=r,u=typeof t>"u";if(this.mIdentifier.type==="single"){if(this.mIdentifier.dataKey in r)throw new A(`Graph path has a duplicate value identifier "${this.mIdentifier.dataKey}"`,this);return u||(n[this.mIdentifier.dataKey]=t),r}if(this.mIdentifier.type==="list"){let b;u?b=new Array:Array.isArray(t)?b=t:b=[t];let x=(()=>{if(this.mIdentifier.dataKey in r){let E=n[this.mIdentifier.dataKey];return Array.isArray(E)?(E.unshift(...b),E):(b.push(E),b)}return b})();return n[this.mIdentifier.dataKey]=x,r}if(u)return r;let p=(()=>{if(!this.mIdentifier.mergeKey)throw new A("Cant merge data without a merge key.",this);if(typeof t!="object"||t===null)throw new A("Node data must be an object when merge key is set.",this);if(!(this.mIdentifier.mergeKey in t))throw new A(`Node data does not contain merge key "${this.mIdentifier.mergeKey}"`,this);return t[this.mIdentifier.mergeKey]})();if(typeof p>"u")return r;let v=n[this.mIdentifier.dataKey];if(typeof v>"u")return n[this.mIdentifier.dataKey]=p,n;if(!Array.isArray(v))throw new A("Chain data merge value is not an array but should be.",this);return Array.isArray(p)?v.unshift(...p):v.unshift(p),r}optional(t,r){let n=typeof r>"u"?"":t,u=typeof r>"u"?t:r,p=new Array;Array.isArray(u)?p.push(...u):p.push(u);let v=new h(n,!1,p,this.mRootNode);return this.setChainedNode(v),v}required(t,r){let n=typeof r>"u"?"":t,u=typeof r>"u"?t:r,p=new Array;Array.isArray(u)?p.push(...u):p.push(u);let v=new h(n,!0,p,this.mRootNode);return this.setChainedNode(v),v}setChainedNode(t){if(this.mConnections.next!==null)throw new A("Node can only be chained to a single node.",this);this.mConnections.next=t}};var F={XmlIdentifier:"Identifier",XmlAssignment:"XmlAssignment",XmlValue:"XmlValue",XmlComment:"XmlComment",XmlOpenClosingBracket:"XmlOpenClosingBracket",XmlCloseBracket:"XmlCloseBracket",XmlOpenBracket:"XmlOpenBracket",XmlCloseClosingBracket:"XmlCloseClosingBracket",XmlExplicitValueIdentifier:"XmlExplicitValueIdentifier",ExpressionStart:"ExpressionStart",ExpressionEnd:"ExpressionEnd",ExpressionValue:"ExpressionValue",InstructionStart:"InstructionStart",InstructionInstructionValue:"InstructionInstructionValue",InstructionBodyStartBraket:"InstructionBodyStartBraket",InstructionBodyCloseBraket:"InstructionBodyCloseBraket",InstructionInstructionClosingBracket:"InstructionInstructionClosingBracket",InstructionInstructionOpeningBracket:"InstructionInstructionOpeningBracket"};var Ee=class extends re{constructor(){super(),this.validWhitespaces=` 
\r`,this.trimWhitespace=!0;let t=this.createTokenPattern({pattern:{regex:/(?:(?!}}).)*/,type:F.ExpressionValue}}),r=this.createTokenPattern({pattern:{start:{regex:/{{/,type:F.ExpressionStart},end:{regex:/}}/,type:F.ExpressionEnd}}},i=>{i.useChildPattern(t)}),n=this.createTokenPattern({pattern:{regex:/[^>\s\n="/]+/,type:F.XmlIdentifier}}),u=this.createTokenPattern({pattern:{regex:/(?:(?!{{|"|<).)+/,type:F.XmlValue}}),p=this.createTokenPattern({pattern:{regex:/<!--.*?-->/,type:F.XmlComment}}),v=this.createTokenPattern({pattern:{regex:/=/,type:F.XmlAssignment}}),b=this.createTokenPattern({pattern:{start:{regex:/"/,type:F.XmlExplicitValueIdentifier},end:{regex:/"/,type:F.XmlExplicitValueIdentifier}}},i=>{i.useChildPattern(r),i.useChildPattern(u)}),x=this.createTokenPattern({pattern:{start:{regex:/<\//,type:F.XmlOpenClosingBracket},end:{regex:/>/,type:F.XmlCloseBracket}}},i=>{i.useChildPattern(n)}),E=this.createTokenPattern({pattern:{start:{regex:/</,type:F.XmlOpenBracket},end:{regex:/(?<closeClosingBracket>\/>)|(?<closeBracket>>)/,type:{closeClosingBracket:F.XmlCloseClosingBracket,closeBracket:F.XmlCloseBracket}}}},i=>{i.useChildPattern(v),i.useChildPattern(n),i.useChildPattern(b)}),a=this.createTokenPattern({pattern:{regex:/[^()"'`/)]+/,type:F.InstructionInstructionValue}}),o=this.createTokenPattern({pattern:{innerType:F.InstructionInstructionValue,start:{regex:/\//,type:F.InstructionInstructionValue},end:{regex:/\//,type:F.InstructionInstructionValue}}},i=>{i.useChildPattern(l),i.useChildPattern(e),i.useChildPattern(y),i.useChildPattern(c),i.useChildPattern(a)}),c=this.createTokenPattern({pattern:{innerType:F.InstructionInstructionValue,start:{regex:/\(/,type:F.InstructionInstructionValue},end:{regex:/\)/,type:F.InstructionInstructionValue}}},i=>{i.useChildPattern(o),i.useChildPattern(l),i.useChildPattern(e),i.useChildPattern(y),i.useChildPattern(a)}),l=this.createTokenPattern({pattern:{innerType:F.InstructionInstructionValue,start:{regex:/"/,type:F.InstructionInstructionValue},end:{regex:/"/,type:F.InstructionInstructionValue}}},i=>{i.useChildPattern(o),i.useChildPattern(e),i.useChildPattern(y),i.useChildPattern(c),i.useChildPattern(a)}),e=this.createTokenPattern({pattern:{innerType:F.InstructionInstructionValue,start:{regex:/'/,type:F.InstructionInstructionValue},end:{regex:/'/,type:F.InstructionInstructionValue}}},i=>{i.useChildPattern(o),i.useChildPattern(l),i.useChildPattern(y),i.useChildPattern(c),i.useChildPattern(a)}),y=this.createTokenPattern({pattern:{innerType:F.InstructionInstructionValue,start:{regex:/`/,type:F.InstructionInstructionValue},end:{regex:/`/,type:F.InstructionInstructionValue}}},i=>{i.useChildPattern(o),i.useChildPattern(l),i.useChildPattern(e),i.useChildPattern(c),i.useChildPattern(a)}),g=this.createTokenPattern({pattern:{regex:/\$[^(\s\n/{]+/,type:F.InstructionStart}}),T=this.createTokenPattern({pattern:{start:{regex:/\(/,type:F.InstructionInstructionOpeningBracket},end:{regex:/\)/,type:F.InstructionInstructionClosingBracket}}},i=>{i.useChildPattern(o),i.useChildPattern(l),i.useChildPattern(e),i.useChildPattern(y),i.useChildPattern(c),i.useChildPattern(a)}),w=this.createTokenPattern({pattern:{start:{regex:/{/,type:F.InstructionBodyStartBraket},end:{regex:/}/,type:F.InstructionBodyCloseBraket}}},i=>{for(let f of m)i.useChildPattern(f)}),m=[p,x,E,b,r,g,T,w,u];for(let i of m)this.useRootTokenPattern(i)}};var ne=class extends oe{constructor(){super(new Ee),this.initGraph()}initGraph(){let t=J.define(()=>X.new().required(F.ExpressionStart).optional("value",F.ExpressionValue).required(F.ExpressionEnd)).converter(e=>new ft(e.value??"")),r=J.define(()=>{let e=r;return X.new().required("data[]",X.new().required("value",[t,X.new().required("text",F.XmlValue)])).optional("data<-data",e)}),n=J.define(()=>X.new().required("name",F.XmlIdentifier).optional("attributeValue",X.new().required(F.XmlAssignment).required(F.XmlExplicitValueIdentifier).optional("list<-data",r).required(F.XmlExplicitValueIdentifier))).converter(e=>{let y=new Array;if(e.attributeValue?.list)for(let g of e.attributeValue.list)g.value instanceof ft?y.push(g.value):y.push(g.value.text);return{name:e.name,values:y}}),u=J.define(()=>{let e=u;return X.new().required("data[]",n).optional("data<-data",e)}),p=J.define(()=>{let e=p;return X.new().required("data[]",X.new().required("value",[t,X.new().required("text",F.XmlValue),X.new().required(F.XmlExplicitValueIdentifier).required("text",F.XmlValue).required(F.XmlExplicitValueIdentifier)])).optional("data<-data",e)}),v=J.define(()=>X.new().required("list<-data",p)).converter(e=>{let y=new yt;for(let g of e.list)g.value instanceof ft?y.addValue(g.value):y.addValue(g.value.text);return y}),b=J.define(()=>X.new().required(F.XmlComment)).converter(()=>null),x=J.define(()=>X.new().required(F.XmlOpenBracket).required("openingTagName",F.XmlIdentifier).optional("attributes<-data",u).required("closing",[X.new().required(F.XmlCloseClosingBracket),X.new().required(F.XmlCloseBracket).required("values",c).required(F.XmlOpenClosingBracket).required("closingTageName",F.XmlIdentifier).required(F.XmlCloseBracket)])).converter(e=>{if("closingTageName"in e.closing&&e.openingTagName!==e.closing.closingTageName)throw new A(`Opening (${e.openingTagName}) and closing tagname (${e.closing.closingTageName}) does not match`,this);let y=new bt(e.openingTagName);if(e.attributes)for(let g of e.attributes)y.setAttribute(g.name).addValue(...g.values);return"values"in e.closing&&y.appendChild(...e.closing.values),y}),E=J.define(()=>{let e=E;return X.new().required("list[]",F.InstructionInstructionValue).optional("list<-list",e)}),a=J.define(()=>X.new().required("instructionName",F.InstructionStart).optional("instruction",X.new().required(F.InstructionInstructionOpeningBracket).required("value<-list",E).required(F.InstructionInstructionClosingBracket)).optional("body",X.new().required(F.InstructionBodyStartBraket).required("value",c).required(F.InstructionBodyCloseBraket))).converter(e=>{let y=e.instructionName.substring(1),g=e.instruction?.value.join("")??"",T=new Ot(y,g);return e.body&&T.appendChild(...e.body.value),T}),o=J.define(()=>{let e=o;return X.new().required("list[]",[b,x,a,v]).optional("list<-list",e)}),c=J.define(()=>{let e=o;return X.new().optional("list<-list",e)}).converter(e=>{let y=new Array;if(e.list)for(let g of e.list)g!==null&&y.push(g);return y}),l=J.define(()=>X.new().required("content",c)).converter(e=>{let y=new at;return y.appendChild(...e.content),y});this.setRootGraph(l)}};var ot=class h extends ye{static mTemplateCache=new k;static mXmlParser=new ne;mComponentElement;mRootBuilder;get element(){return this.mComponentElement.htmlElement}constructor(t){super({constructor:t.processorConstructor,parent:null}),it.registerComponent(this,t.htmlElement),this.setProcessorInjection(h,this),this.addConstructionHook(n=>{it.registerComponent(this,this.mComponentElement.htmlElement,n)}),h.mTemplateCache.has(t.processorConstructor)||h.mTemplateCache.set(t.processorConstructor,h.mXmlParser.parse(t.templateString??""));let r=h.mTemplateCache.get(t.processorConstructor).clone();this.mComponentElement=new ee(t.htmlElement),this.mRootBuilder=new Ht(r,new Te(this,t.expressionModule),new dt(this),"ROOT"),this.mComponentElement.shadowRoot.appendChild(this.mRootBuilder.anchor),this.setProcessorInjection(pt,new pt(this.mRootBuilder.values))}addStyle(t){let r=document.createElement("style");r.innerHTML=t,this.mComponentElement.shadowRoot.prepend(r)}attributeChanged(t,r,n){this.call("onAttributeChange",t,r,n)}connected(){this.call("onConnect")}deconstruct(){this.call("onDeconstruct"),this.mRootBuilder.deconstruct(),super.deconstruct()}disconnected(){this.call("onDisconnect")}onUpdate(){return this.mRootBuilder.update()?(this.call("onUpdate"),!0):!1}};function W(h){return(t,r)=>{z.registerInjectable(t,r.metadata,"instanced"),it.registerConstructor(t,h.selector);let n=class extends HTMLElement{mComponent;constructor(){super(),this.mComponent=new ot({processorConstructor:t,templateString:h.template??null,expressionModule:h.expressionmodule,htmlElement:this}).setup(),h.style&&this.mComponent.addStyle(h.style),this.mComponent.updater.update()}connectedCallback(){this.mComponent.connected()}disconnectedCallback(){this.mComponent.disconnected()}};globalThis.customElements.define(h.selector,n)}}function Mt(h){return(t,r)=>{z.registerInjectable(t,r.metadata,"instanced"),st.register(Et,t,{access:h.access,targetRestrictions:h.targetRestrictions})}}function wt(h){return(t,r)=>{z.registerInjectable(t,r.metadata,"instanced"),st.register(mt,t,{access:h.access,selector:h.selector})}}function xt(h){return(t,r)=>{z.registerInjectable(t,r.metadata,"instanced"),st.register(Pt,t,{instructionType:h.instructionType})}}function Js(){function h(a,o){return function(l){r(o,"addInitializer"),n(l,"An initializer"),a.push(l)}}function t(a,o,c,l,e,y,g,T,w){var m;switch(e){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var i={kind:m,name:g?"#"+o:o,static:y,private:g,metadata:T},f={v:!1};i.addInitializer=h(l,f);var s,d;e===0?g?(s=c.get,d=c.set):(s=function(){return this[o]},d=function(I){this[o]=I}):e===2?s=function(){return c.value}:((e===1||e===3)&&(s=function(){return c.get.call(this)}),(e===1||e===4)&&(d=function(I){c.set.call(this,I)})),i.access=s&&d?{get:s,set:d}:s?{get:s}:{set:d};try{return a(w,i)}finally{f.v=!0}}function r(a,o){if(a.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(a,o){if(typeof a!="function")throw new TypeError(o+" must be a function")}function u(a,o){var c=typeof o;if(a===1){if(c!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(c!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function p(a,o,c,l,e,y,g,T,w){var m=c[0],i,f,s;g?e===0||e===1?i={get:c[3],set:c[4]}:e===3?i={get:c[3]}:e===4?i={set:c[3]}:i={value:c[3]}:e!==0&&(i=Object.getOwnPropertyDescriptor(o,l)),e===1?s={get:i.get,set:i.set}:e===2?s=i.value:e===3?s=i.get:e===4&&(s=i.set);var d,I,D;if(typeof m=="function")d=t(m,l,i,T,e,y,g,w,s),d!==void 0&&(u(e,d),e===0?f=d:e===1?(f=d.init,I=d.get||s.get,D=d.set||s.set,s={get:I,set:D}):s=d);else for(var _=m.length-1;_>=0;_--){var P=m[_];if(d=t(P,l,i,T,e,y,g,w,s),d!==void 0){u(e,d);var N;e===0?N=d:e===1?(N=d.init,I=d.get||s.get,D=d.set||s.set,s={get:I,set:D}):s=d,N!==void 0&&(f===void 0?f=N:typeof f=="function"?f=[f,N]:f.push(N))}}if(e===0||e===1){if(f===void 0)f=function(S,C){return C};else if(typeof f!="function"){var M=f;f=function(S,C){for(var L=C,O=0;O<M.length;O++)L=M[O].call(S,L);return L}}else{var $=f;f=function(S,C){return $.call(S,C)}}a.push(f)}e!==0&&(e===1?(i.get=s.get,i.set=s.set):e===2?i.value=s:e===3?i.get=s:e===4&&(i.set=s),g?e===1?(a.push(function(S,C){return s.get.call(S,C)}),a.push(function(S,C){return s.set.call(S,C)})):e===2?a.push(s):a.push(function(S,C){return s.call(S,C)}):Object.defineProperty(o,l,i))}function v(a,o,c){for(var l=[],e,y,g=new Map,T=new Map,w=0;w<o.length;w++){var m=o[w];if(Array.isArray(m)){var i=m[1],f=m[2],s=m.length>3,d=i>=5,I,D;if(d?(I=a,i=i-5,y=y||[],D=y):(I=a.prototype,e=e||[],D=e),i!==0&&!s){var _=d?T:g,P=_.get(f)||0;if(P===!0||P===3&&i!==4||P===4&&i!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!P&&i>2?_.set(f,i):_.set(f,!0)}p(l,I,m,f,i,d,s,D,c)}}return b(l,e),b(l,y),l}function b(a,o){o&&a.push(function(c){for(var l=0;l<o.length;l++)o[l].call(c);return c})}function x(a,o,c){if(o.length>0){for(var l=[],e=a,y=a.name,g=o.length-1;g>=0;g--){var T={v:!1};try{var w=o[g](e,{kind:"class",name:y,addInitializer:h(l,T),metadata:c})}finally{T.v=!0}w!==void 0&&(u(10,w),e=w)}return[E(e,c),function(){for(var m=0;m<l.length;m++)l[m].call(e)}]}}function E(a,o){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,c,l,e){if(e!==void 0)var y=e[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(y===void 0?null:y),T=v(o,c,g);return l.length||E(o,g),{e:T,get c(){return x(o,l,g)}}}}function nr(h,t,r,n){return(nr=Js())(h,t,r,n)}function Qs(h){return h}var ir,or,ie;ir=Mt({access:K.Read,targetRestrictions:[ot]});new class extends Qs{constructor(){super(ie),or()}static{class h{static{({c:[ie,or]}=nr(this,[],[ir]))}static METADATA_USER_EVENT_LISTENER_PROPERIES="pwb:user_event_listener_properties";mEventListenerList;mTargetElement;constructor(r=z.use(ot)){let n=new Array,u=r.processorConstructor;do{let p=rt.get(u).getMetadata(h.METADATA_USER_EVENT_LISTENER_PROPERIES);if(p)for(let v of p)n.push(v)}while(u=Object.getPrototypeOf(u));this.mEventListenerList=new Array,this.mTargetElement=r.element;for(let p of n){let[v,b]=p,x=Reflect.get(r.processor,v);x=x.bind(r.processor),this.mEventListenerList.push([b,x]),this.mTargetElement.addEventListener(b,x)}}onDeconstruct(){for(let r of this.mEventListenerList){let[n,u]=r;this.mTargetElement.removeEventListener(n,u)}}}}};var se=class extends window.Event{mValue;get value(){return this.mValue}constructor(t,r){super(t),this.mValue=r}};var ae=class{mElement;mEventName;constructor(t,r){this.mEventName=t,this.mElement=r}dispatchEvent(t){let r=new se(this.mEventName,t);this.mElement.dispatchEvent(r)}};function j(h){return(t,r)=>{if(r.static)throw new A("Event target is not for a static property.",j);let n=null;return{get(){if(!n){let u=(()=>{try{return it.ofProcessor(this).component}catch{throw new A("PwbComponentEvent target class is not a component.",this)}})();n=new ae(h,u.element)}return n}}}}function ks(){function h(a,o){return function(l){r(o,"addInitializer"),n(l,"An initializer"),a.push(l)}}function t(a,o,c,l,e,y,g,T,w){var m;switch(e){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var i={kind:m,name:g?"#"+o:o,static:y,private:g,metadata:T},f={v:!1};i.addInitializer=h(l,f);var s,d;e===0?g?(s=c.get,d=c.set):(s=function(){return this[o]},d=function(I){this[o]=I}):e===2?s=function(){return c.value}:((e===1||e===3)&&(s=function(){return c.get.call(this)}),(e===1||e===4)&&(d=function(I){c.set.call(this,I)})),i.access=s&&d?{get:s,set:d}:s?{get:s}:{set:d};try{return a(w,i)}finally{f.v=!0}}function r(a,o){if(a.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(a,o){if(typeof a!="function")throw new TypeError(o+" must be a function")}function u(a,o){var c=typeof o;if(a===1){if(c!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(c!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function p(a,o,c,l,e,y,g,T,w){var m=c[0],i,f,s;g?e===0||e===1?i={get:c[3],set:c[4]}:e===3?i={get:c[3]}:e===4?i={set:c[3]}:i={value:c[3]}:e!==0&&(i=Object.getOwnPropertyDescriptor(o,l)),e===1?s={get:i.get,set:i.set}:e===2?s=i.value:e===3?s=i.get:e===4&&(s=i.set);var d,I,D;if(typeof m=="function")d=t(m,l,i,T,e,y,g,w,s),d!==void 0&&(u(e,d),e===0?f=d:e===1?(f=d.init,I=d.get||s.get,D=d.set||s.set,s={get:I,set:D}):s=d);else for(var _=m.length-1;_>=0;_--){var P=m[_];if(d=t(P,l,i,T,e,y,g,w,s),d!==void 0){u(e,d);var N;e===0?N=d:e===1?(N=d.init,I=d.get||s.get,D=d.set||s.set,s={get:I,set:D}):s=d,N!==void 0&&(f===void 0?f=N:typeof f=="function"?f=[f,N]:f.push(N))}}if(e===0||e===1){if(f===void 0)f=function(S,C){return C};else if(typeof f!="function"){var M=f;f=function(S,C){for(var L=C,O=0;O<M.length;O++)L=M[O].call(S,L);return L}}else{var $=f;f=function(S,C){return $.call(S,C)}}a.push(f)}e!==0&&(e===1?(i.get=s.get,i.set=s.set):e===2?i.value=s:e===3?i.get=s:e===4&&(i.set=s),g?e===1?(a.push(function(S,C){return s.get.call(S,C)}),a.push(function(S,C){return s.set.call(S,C)})):e===2?a.push(s):a.push(function(S,C){return s.call(S,C)}):Object.defineProperty(o,l,i))}function v(a,o,c){for(var l=[],e,y,g=new Map,T=new Map,w=0;w<o.length;w++){var m=o[w];if(Array.isArray(m)){var i=m[1],f=m[2],s=m.length>3,d=i>=5,I,D;if(d?(I=a,i=i-5,y=y||[],D=y):(I=a.prototype,e=e||[],D=e),i!==0&&!s){var _=d?T:g,P=_.get(f)||0;if(P===!0||P===3&&i!==4||P===4&&i!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!P&&i>2?_.set(f,i):_.set(f,!0)}p(l,I,m,f,i,d,s,D,c)}}return b(l,e),b(l,y),l}function b(a,o){o&&a.push(function(c){for(var l=0;l<o.length;l++)o[l].call(c);return c})}function x(a,o,c){if(o.length>0){for(var l=[],e=a,y=a.name,g=o.length-1;g>=0;g--){var T={v:!1};try{var w=o[g](e,{kind:"class",name:y,addInitializer:h(l,T),metadata:c})}finally{T.v=!0}w!==void 0&&(u(10,w),e=w)}return[E(e,c),function(){for(var m=0;m<l.length;m++)l[m].call(e)}]}}function E(a,o){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,c,l,e){if(e!==void 0)var y=e[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(y===void 0?null:y),T=v(o,c,g);return l.length||E(o,g),{e:T,get c(){return x(o,l,g)}}}}function ar(h,t,r,n){return(ar=ks())(h,t,r,n)}function ta(h){return h}var lr,sr,le;lr=Mt({access:K.ReadWrite,targetRestrictions:[ot]});new class extends ta{constructor(){super(le),sr()}static{class h{static{({c:[le,sr]}=ar(this,[],[lr]))}static METADATA_EXPORTED_PROPERTIES="pwb:exported_properties";mComponent;constructor(r=z.use(ot)){this.mComponent=r;let n=new At,u=r.processorConstructor;do{let v=rt.get(u).getMetadata(h.METADATA_EXPORTED_PROPERTIES);v&&n.push(...v)}while(u=Object.getPrototypeOf(u));let p=new Set(n);p.size>0&&this.connectExportedProperties(p)}connectExportedProperties(r){this.exportPropertyAsAttribute(r),this.patchHtmlAttributes(r)}exportPropertyAsAttribute(r){for(let n of r){let u={};u.enumerable=!0,u.configurable=!0,delete u.value,delete u.writable,u.set=p=>{Reflect.set(this.mComponent.processor,n,p)},u.get=()=>{let p=Reflect.get(this.mComponent.processor,n);return typeof p=="function"&&(p=p.bind(this.mComponent.processor)),p},Object.defineProperty(this.mComponent.element,n,u)}}patchHtmlAttributes(r){let n=this.mComponent.element.getAttribute;new MutationObserver(p=>{for(let v of p){let b=v.attributeName,x=n.call(this.mComponent.element,b);Reflect.set(this.mComponent.element,b,x),this.mComponent.attributeChanged(b,v.oldValue,x)}}).observe(this.mComponent.element,{attributeFilter:[...r],attributeOldValue:!0});for(let p of r)if(this.mComponent.element.hasAttribute(p)){let v=n.call(this.mComponent.element,p);this.mComponent.element.setAttribute(p,v)}this.mComponent.element.getAttribute=p=>r.has(p)?Reflect.get(this.mComponent.element,p):n.call(this.mComponent.element,p)}}}};function B(h,t){if(t.static)throw new A("Event target is not for a static property.",B);let r=rt.forInternalDecorator(t.metadata),n=r.getMetadata(le.METADATA_EXPORTED_PROPERTIES)??new Array;n.push(t.name),r.setMetadata(le.METADATA_EXPORTED_PROPERTIES,n)}function ut(h){return(t,r)=>{if(r.static)throw new A("Child decorator is not for a static property.",ut);return{get(){let p=(()=>{try{return it.ofProcessor(this).component}catch{throw new A("PwbChild target class is not a component.",this)}})().getProcessorInjection(pt).data.store[h];if(p instanceof Element)return p;throw new A(`Can't find child "${h}".`,this)}}}}function ea(){function h(a,o){return function(l){r(o,"addInitializer"),n(l,"An initializer"),a.push(l)}}function t(a,o,c,l,e,y,g,T,w){var m;switch(e){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var i={kind:m,name:g?"#"+o:o,static:y,private:g,metadata:T},f={v:!1};i.addInitializer=h(l,f);var s,d;e===0?g?(s=c.get,d=c.set):(s=function(){return this[o]},d=function(I){this[o]=I}):e===2?s=function(){return c.value}:((e===1||e===3)&&(s=function(){return c.get.call(this)}),(e===1||e===4)&&(d=function(I){c.set.call(this,I)})),i.access=s&&d?{get:s,set:d}:s?{get:s}:{set:d};try{return a(w,i)}finally{f.v=!0}}function r(a,o){if(a.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(a,o){if(typeof a!="function")throw new TypeError(o+" must be a function")}function u(a,o){var c=typeof o;if(a===1){if(c!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(c!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function p(a,o,c,l,e,y,g,T,w){var m=c[0],i,f,s;g?e===0||e===1?i={get:c[3],set:c[4]}:e===3?i={get:c[3]}:e===4?i={set:c[3]}:i={value:c[3]}:e!==0&&(i=Object.getOwnPropertyDescriptor(o,l)),e===1?s={get:i.get,set:i.set}:e===2?s=i.value:e===3?s=i.get:e===4&&(s=i.set);var d,I,D;if(typeof m=="function")d=t(m,l,i,T,e,y,g,w,s),d!==void 0&&(u(e,d),e===0?f=d:e===1?(f=d.init,I=d.get||s.get,D=d.set||s.set,s={get:I,set:D}):s=d);else for(var _=m.length-1;_>=0;_--){var P=m[_];if(d=t(P,l,i,T,e,y,g,w,s),d!==void 0){u(e,d);var N;e===0?N=d:e===1?(N=d.init,I=d.get||s.get,D=d.set||s.set,s={get:I,set:D}):s=d,N!==void 0&&(f===void 0?f=N:typeof f=="function"?f=[f,N]:f.push(N))}}if(e===0||e===1){if(f===void 0)f=function(S,C){return C};else if(typeof f!="function"){var M=f;f=function(S,C){for(var L=C,O=0;O<M.length;O++)L=M[O].call(S,L);return L}}else{var $=f;f=function(S,C){return $.call(S,C)}}a.push(f)}e!==0&&(e===1?(i.get=s.get,i.set=s.set):e===2?i.value=s:e===3?i.get=s:e===4&&(i.set=s),g?e===1?(a.push(function(S,C){return s.get.call(S,C)}),a.push(function(S,C){return s.set.call(S,C)})):e===2?a.push(s):a.push(function(S,C){return s.call(S,C)}):Object.defineProperty(o,l,i))}function v(a,o,c){for(var l=[],e,y,g=new Map,T=new Map,w=0;w<o.length;w++){var m=o[w];if(Array.isArray(m)){var i=m[1],f=m[2],s=m.length>3,d=i>=5,I,D;if(d?(I=a,i=i-5,y=y||[],D=y):(I=a.prototype,e=e||[],D=e),i!==0&&!s){var _=d?T:g,P=_.get(f)||0;if(P===!0||P===3&&i!==4||P===4&&i!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!P&&i>2?_.set(f,i):_.set(f,!0)}p(l,I,m,f,i,d,s,D,c)}}return b(l,e),b(l,y),l}function b(a,o){o&&a.push(function(c){for(var l=0;l<o.length;l++)o[l].call(c);return c})}function x(a,o,c){if(o.length>0){for(var l=[],e=a,y=a.name,g=o.length-1;g>=0;g--){var T={v:!1};try{var w=o[g](e,{kind:"class",name:y,addInitializer:h(l,T),metadata:c})}finally{T.v=!0}w!==void 0&&(u(10,w),e=w)}return[E(e,c),function(){for(var m=0;m<l.length;m++)l[m].call(e)}]}}function E(a,o){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,c,l,e){if(e!==void 0)var y=e[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(y===void 0?null:y),T=v(o,c,g);return l.length||E(o,g),{e:T,get c(){return x(o,l,g)}}}}function dr(h,t,r,n){return(dr=ea())(h,t,r,n)}var hr,cr,ra;hr=xt({instructionType:"dynamic-content"});var ur=class{static{({c:[ra,cr]}=dr(this,[],[hr]))}constructor(t=z.use(Q),r=z.use(Y)){this.mModuleValues=r,this.mLastTemplate=null,this.mProcedure=this.mModuleValues.createExpressionProcedure(t.value)}mLastTemplate;mModuleValues;mProcedure;onUpdate(){let t=this.mProcedure.execute();if(!t||!(t instanceof at))throw new A("Dynamic content method has a wrong result type.",this);if(this.mLastTemplate!==null&&this.mLastTemplate.equals(t))return null;let r=t.clone();this.mLastTemplate=r;let n=new ct;return n.addElement(r,new dt(this.mModuleValues.data)),n}static{cr()}};function oa(){function h(a,o){return function(l){r(o,"addInitializer"),n(l,"An initializer"),a.push(l)}}function t(a,o,c,l,e,y,g,T,w){var m;switch(e){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var i={kind:m,name:g?"#"+o:o,static:y,private:g,metadata:T},f={v:!1};i.addInitializer=h(l,f);var s,d;e===0?g?(s=c.get,d=c.set):(s=function(){return this[o]},d=function(I){this[o]=I}):e===2?s=function(){return c.value}:((e===1||e===3)&&(s=function(){return c.get.call(this)}),(e===1||e===4)&&(d=function(I){c.set.call(this,I)})),i.access=s&&d?{get:s,set:d}:s?{get:s}:{set:d};try{return a(w,i)}finally{f.v=!0}}function r(a,o){if(a.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(a,o){if(typeof a!="function")throw new TypeError(o+" must be a function")}function u(a,o){var c=typeof o;if(a===1){if(c!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(c!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function p(a,o,c,l,e,y,g,T,w){var m=c[0],i,f,s;g?e===0||e===1?i={get:c[3],set:c[4]}:e===3?i={get:c[3]}:e===4?i={set:c[3]}:i={value:c[3]}:e!==0&&(i=Object.getOwnPropertyDescriptor(o,l)),e===1?s={get:i.get,set:i.set}:e===2?s=i.value:e===3?s=i.get:e===4&&(s=i.set);var d,I,D;if(typeof m=="function")d=t(m,l,i,T,e,y,g,w,s),d!==void 0&&(u(e,d),e===0?f=d:e===1?(f=d.init,I=d.get||s.get,D=d.set||s.set,s={get:I,set:D}):s=d);else for(var _=m.length-1;_>=0;_--){var P=m[_];if(d=t(P,l,i,T,e,y,g,w,s),d!==void 0){u(e,d);var N;e===0?N=d:e===1?(N=d.init,I=d.get||s.get,D=d.set||s.set,s={get:I,set:D}):s=d,N!==void 0&&(f===void 0?f=N:typeof f=="function"?f=[f,N]:f.push(N))}}if(e===0||e===1){if(f===void 0)f=function(S,C){return C};else if(typeof f!="function"){var M=f;f=function(S,C){for(var L=C,O=0;O<M.length;O++)L=M[O].call(S,L);return L}}else{var $=f;f=function(S,C){return $.call(S,C)}}a.push(f)}e!==0&&(e===1?(i.get=s.get,i.set=s.set):e===2?i.value=s:e===3?i.get=s:e===4&&(i.set=s),g?e===1?(a.push(function(S,C){return s.get.call(S,C)}),a.push(function(S,C){return s.set.call(S,C)})):e===2?a.push(s):a.push(function(S,C){return s.call(S,C)}):Object.defineProperty(o,l,i))}function v(a,o,c){for(var l=[],e,y,g=new Map,T=new Map,w=0;w<o.length;w++){var m=o[w];if(Array.isArray(m)){var i=m[1],f=m[2],s=m.length>3,d=i>=5,I,D;if(d?(I=a,i=i-5,y=y||[],D=y):(I=a.prototype,e=e||[],D=e),i!==0&&!s){var _=d?T:g,P=_.get(f)||0;if(P===!0||P===3&&i!==4||P===4&&i!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!P&&i>2?_.set(f,i):_.set(f,!0)}p(l,I,m,f,i,d,s,D,c)}}return b(l,e),b(l,y),l}function b(a,o){o&&a.push(function(c){for(var l=0;l<o.length;l++)o[l].call(c);return c})}function x(a,o,c){if(o.length>0){for(var l=[],e=a,y=a.name,g=o.length-1;g>=0;g--){var T={v:!1};try{var w=o[g](e,{kind:"class",name:y,addInitializer:h(l,T),metadata:c})}finally{T.v=!0}w!==void 0&&(u(10,w),e=w)}return[E(e,c),function(){for(var m=0;m<l.length;m++)l[m].call(e)}]}}function E(a,o){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,c,l,e){if(e!==void 0)var y=e[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(y===void 0?null:y),T=v(o,c,g);return l.length||E(o,g),{e:T,get c(){return x(o,l,g)}}}}function pr(h,t,r,n){return(pr=oa())(h,t,r,n)}var gr,fr,na;gr=wt({access:K.Write,selector:/^\([[\w\-$]+\)$/});var mr=class{static{({c:[na,fr]}=pr(this,[],[gr]))}constructor(t=z.use(tt),r=z.use(Y),n=z.use(lt)){this.mTarget=t,this.mEventName=n.name.substring(1,n.name.length-1);let u=r.createExpressionProcedure(n.value,["$event"]);this.mListener=p=>{u.setTemporaryValue("$event",p),u.execute()},this.mTarget.addEventListener(this.mEventName,this.mListener)}mEventName;mListener;mTarget;onDeconstruct(){this.mTarget.removeEventListener(this.mEventName,this.mListener)}static{fr()}};function ia(){function h(a,o){return function(l){r(o,"addInitializer"),n(l,"An initializer"),a.push(l)}}function t(a,o,c,l,e,y,g,T,w){var m;switch(e){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var i={kind:m,name:g?"#"+o:o,static:y,private:g,metadata:T},f={v:!1};i.addInitializer=h(l,f);var s,d;e===0?g?(s=c.get,d=c.set):(s=function(){return this[o]},d=function(I){this[o]=I}):e===2?s=function(){return c.value}:((e===1||e===3)&&(s=function(){return c.get.call(this)}),(e===1||e===4)&&(d=function(I){c.set.call(this,I)})),i.access=s&&d?{get:s,set:d}:s?{get:s}:{set:d};try{return a(w,i)}finally{f.v=!0}}function r(a,o){if(a.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(a,o){if(typeof a!="function")throw new TypeError(o+" must be a function")}function u(a,o){var c=typeof o;if(a===1){if(c!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(c!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function p(a,o,c,l,e,y,g,T,w){var m=c[0],i,f,s;g?e===0||e===1?i={get:c[3],set:c[4]}:e===3?i={get:c[3]}:e===4?i={set:c[3]}:i={value:c[3]}:e!==0&&(i=Object.getOwnPropertyDescriptor(o,l)),e===1?s={get:i.get,set:i.set}:e===2?s=i.value:e===3?s=i.get:e===4&&(s=i.set);var d,I,D;if(typeof m=="function")d=t(m,l,i,T,e,y,g,w,s),d!==void 0&&(u(e,d),e===0?f=d:e===1?(f=d.init,I=d.get||s.get,D=d.set||s.set,s={get:I,set:D}):s=d);else for(var _=m.length-1;_>=0;_--){var P=m[_];if(d=t(P,l,i,T,e,y,g,w,s),d!==void 0){u(e,d);var N;e===0?N=d:e===1?(N=d.init,I=d.get||s.get,D=d.set||s.set,s={get:I,set:D}):s=d,N!==void 0&&(f===void 0?f=N:typeof f=="function"?f=[f,N]:f.push(N))}}if(e===0||e===1){if(f===void 0)f=function(S,C){return C};else if(typeof f!="function"){var M=f;f=function(S,C){for(var L=C,O=0;O<M.length;O++)L=M[O].call(S,L);return L}}else{var $=f;f=function(S,C){return $.call(S,C)}}a.push(f)}e!==0&&(e===1?(i.get=s.get,i.set=s.set):e===2?i.value=s:e===3?i.get=s:e===4&&(i.set=s),g?e===1?(a.push(function(S,C){return s.get.call(S,C)}),a.push(function(S,C){return s.set.call(S,C)})):e===2?a.push(s):a.push(function(S,C){return s.call(S,C)}):Object.defineProperty(o,l,i))}function v(a,o,c){for(var l=[],e,y,g=new Map,T=new Map,w=0;w<o.length;w++){var m=o[w];if(Array.isArray(m)){var i=m[1],f=m[2],s=m.length>3,d=i>=5,I,D;if(d?(I=a,i=i-5,y=y||[],D=y):(I=a.prototype,e=e||[],D=e),i!==0&&!s){var _=d?T:g,P=_.get(f)||0;if(P===!0||P===3&&i!==4||P===4&&i!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!P&&i>2?_.set(f,i):_.set(f,!0)}p(l,I,m,f,i,d,s,D,c)}}return b(l,e),b(l,y),l}function b(a,o){o&&a.push(function(c){for(var l=0;l<o.length;l++)o[l].call(c);return c})}function x(a,o,c){if(o.length>0){for(var l=[],e=a,y=a.name,g=o.length-1;g>=0;g--){var T={v:!1};try{var w=o[g](e,{kind:"class",name:y,addInitializer:h(l,T),metadata:c})}finally{T.v=!0}w!==void 0&&(u(10,w),e=w)}return[E(e,c),function(){for(var m=0;m<l.length;m++)l[m].call(e)}]}}function E(a,o){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,c,l,e){if(e!==void 0)var y=e[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(y===void 0?null:y),T=v(o,c,g);return l.length||E(o,g),{e:T,get c(){return x(o,l,g)}}}}function br(h,t,r,n){return(br=ia())(h,t,r,n)}var wr,vr,sa;wr=xt({instructionType:"for"});var yr=class{static{({c:[sa,vr]}=br(this,[],[wr]))}constructor(t=z.use(ht),r=z.use(Y),n=z.use(Q)){this.mTemplate=t,this.mModuleValues=r,this.mLastEntries=new Array;let u=n.value,v=new RegExp(/^\s*([a-zA-Z]+[a-zA-Z0-9]*)\s*of\s+([^;]+)\s*(;\s*([a-zA-Z]+[a-zA-Z0-9]*)\s*=\s*(.*)\s*)?$/).exec(u);if(!v)throw new A(`For-Parameter value has wrong format: ${u}`,this);let b=v[1],x=v[2],E=v[4]??null,a=v[5],o=this.mModuleValues.createExpressionProcedure(x),c=E?this.mModuleValues.createExpressionProcedure(a,["$index",b]):null;this.mExpression={iterateVariableName:b,iterateValueProcedure:o,indexExportVariableName:E,indexExportProcedure:c}}mExpression;mLastEntries;mModuleValues;mTemplate;onUpdate(){let t=new ct,r=this.mExpression.iterateValueProcedure.execute();if(typeof r=="object"&&r!==null||Array.isArray(r)){let n=Symbol.iterator in r?Object.entries([...r]):Object.entries(r);if(this.compareEntries(n,this.mLastEntries))return null;this.mLastEntries=n;for(let[u,p]of n)this.addTemplateForElement(t,this.mExpression,p,u);return t}else return null}addTemplateForElement=(t,r,n,u)=>{let p=new dt(this.mModuleValues.data);if(p.setTemporaryValue(r.iterateVariableName,n),r.indexExportProcedure&&r.indexExportVariableName){r.indexExportProcedure.setTemporaryValue("$index",u),r.indexExportProcedure.setTemporaryValue(r.iterateVariableName,n);let b=r.indexExportProcedure.execute();p.setTemporaryValue(r.indexExportVariableName,b)}let v=new at;v.appendChild(...this.mTemplate.childList),t.addElement(v,p)};compareEntries(t,r){if(t.length!==r.length)return!1;for(let n=0;n<t.length;n++){let[u,p]=t[n],[v,b]=r[n];if(u!==v||p!==b)return!1}return!0}static{vr()}};function aa(){function h(a,o){return function(l){r(o,"addInitializer"),n(l,"An initializer"),a.push(l)}}function t(a,o,c,l,e,y,g,T,w){var m;switch(e){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var i={kind:m,name:g?"#"+o:o,static:y,private:g,metadata:T},f={v:!1};i.addInitializer=h(l,f);var s,d;e===0?g?(s=c.get,d=c.set):(s=function(){return this[o]},d=function(I){this[o]=I}):e===2?s=function(){return c.value}:((e===1||e===3)&&(s=function(){return c.get.call(this)}),(e===1||e===4)&&(d=function(I){c.set.call(this,I)})),i.access=s&&d?{get:s,set:d}:s?{get:s}:{set:d};try{return a(w,i)}finally{f.v=!0}}function r(a,o){if(a.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(a,o){if(typeof a!="function")throw new TypeError(o+" must be a function")}function u(a,o){var c=typeof o;if(a===1){if(c!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(c!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function p(a,o,c,l,e,y,g,T,w){var m=c[0],i,f,s;g?e===0||e===1?i={get:c[3],set:c[4]}:e===3?i={get:c[3]}:e===4?i={set:c[3]}:i={value:c[3]}:e!==0&&(i=Object.getOwnPropertyDescriptor(o,l)),e===1?s={get:i.get,set:i.set}:e===2?s=i.value:e===3?s=i.get:e===4&&(s=i.set);var d,I,D;if(typeof m=="function")d=t(m,l,i,T,e,y,g,w,s),d!==void 0&&(u(e,d),e===0?f=d:e===1?(f=d.init,I=d.get||s.get,D=d.set||s.set,s={get:I,set:D}):s=d);else for(var _=m.length-1;_>=0;_--){var P=m[_];if(d=t(P,l,i,T,e,y,g,w,s),d!==void 0){u(e,d);var N;e===0?N=d:e===1?(N=d.init,I=d.get||s.get,D=d.set||s.set,s={get:I,set:D}):s=d,N!==void 0&&(f===void 0?f=N:typeof f=="function"?f=[f,N]:f.push(N))}}if(e===0||e===1){if(f===void 0)f=function(S,C){return C};else if(typeof f!="function"){var M=f;f=function(S,C){for(var L=C,O=0;O<M.length;O++)L=M[O].call(S,L);return L}}else{var $=f;f=function(S,C){return $.call(S,C)}}a.push(f)}e!==0&&(e===1?(i.get=s.get,i.set=s.set):e===2?i.value=s:e===3?i.get=s:e===4&&(i.set=s),g?e===1?(a.push(function(S,C){return s.get.call(S,C)}),a.push(function(S,C){return s.set.call(S,C)})):e===2?a.push(s):a.push(function(S,C){return s.call(S,C)}):Object.defineProperty(o,l,i))}function v(a,o,c){for(var l=[],e,y,g=new Map,T=new Map,w=0;w<o.length;w++){var m=o[w];if(Array.isArray(m)){var i=m[1],f=m[2],s=m.length>3,d=i>=5,I,D;if(d?(I=a,i=i-5,y=y||[],D=y):(I=a.prototype,e=e||[],D=e),i!==0&&!s){var _=d?T:g,P=_.get(f)||0;if(P===!0||P===3&&i!==4||P===4&&i!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!P&&i>2?_.set(f,i):_.set(f,!0)}p(l,I,m,f,i,d,s,D,c)}}return b(l,e),b(l,y),l}function b(a,o){o&&a.push(function(c){for(var l=0;l<o.length;l++)o[l].call(c);return c})}function x(a,o,c){if(o.length>0){for(var l=[],e=a,y=a.name,g=o.length-1;g>=0;g--){var T={v:!1};try{var w=o[g](e,{kind:"class",name:y,addInitializer:h(l,T),metadata:c})}finally{T.v=!0}w!==void 0&&(u(10,w),e=w)}return[E(e,c),function(){for(var m=0;m<l.length;m++)l[m].call(e)}]}}function E(a,o){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,c,l,e){if(e!==void 0)var y=e[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(y===void 0?null:y),T=v(o,c,g);return l.length||E(o,g),{e:T,get c(){return x(o,l,g)}}}}function Ir(h,t,r,n){return(Ir=aa())(h,t,r,n)}var Cr,xr,la;Cr=xt({instructionType:"if"});var Tr=class{static{({c:[la,xr]}=Ir(this,[],[Cr]))}constructor(t=z.use(ht),r=z.use(Y),n=z.use(Q)){this.mTemplateReference=t,this.mModuleValues=r,this.mProcedure=this.mModuleValues.createExpressionProcedure(n.value),this.mLastBoolean=!1}mLastBoolean;mModuleValues;mProcedure;mTemplateReference;onUpdate(){let t=this.mProcedure.execute();if(!!t!==this.mLastBoolean){this.mLastBoolean=!!t;let r=new ct;if(t){let n=new at;n.appendChild(...this.mTemplateReference.childList),r.addElement(n,new dt(this.mModuleValues.data))}return r}else return null}static{xr()}};function ca(){function h(a,o){return function(l){r(o,"addInitializer"),n(l,"An initializer"),a.push(l)}}function t(a,o,c,l,e,y,g,T,w){var m;switch(e){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var i={kind:m,name:g?"#"+o:o,static:y,private:g,metadata:T},f={v:!1};i.addInitializer=h(l,f);var s,d;e===0?g?(s=c.get,d=c.set):(s=function(){return this[o]},d=function(I){this[o]=I}):e===2?s=function(){return c.value}:((e===1||e===3)&&(s=function(){return c.get.call(this)}),(e===1||e===4)&&(d=function(I){c.set.call(this,I)})),i.access=s&&d?{get:s,set:d}:s?{get:s}:{set:d};try{return a(w,i)}finally{f.v=!0}}function r(a,o){if(a.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(a,o){if(typeof a!="function")throw new TypeError(o+" must be a function")}function u(a,o){var c=typeof o;if(a===1){if(c!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(c!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function p(a,o,c,l,e,y,g,T,w){var m=c[0],i,f,s;g?e===0||e===1?i={get:c[3],set:c[4]}:e===3?i={get:c[3]}:e===4?i={set:c[3]}:i={value:c[3]}:e!==0&&(i=Object.getOwnPropertyDescriptor(o,l)),e===1?s={get:i.get,set:i.set}:e===2?s=i.value:e===3?s=i.get:e===4&&(s=i.set);var d,I,D;if(typeof m=="function")d=t(m,l,i,T,e,y,g,w,s),d!==void 0&&(u(e,d),e===0?f=d:e===1?(f=d.init,I=d.get||s.get,D=d.set||s.set,s={get:I,set:D}):s=d);else for(var _=m.length-1;_>=0;_--){var P=m[_];if(d=t(P,l,i,T,e,y,g,w,s),d!==void 0){u(e,d);var N;e===0?N=d:e===1?(N=d.init,I=d.get||s.get,D=d.set||s.set,s={get:I,set:D}):s=d,N!==void 0&&(f===void 0?f=N:typeof f=="function"?f=[f,N]:f.push(N))}}if(e===0||e===1){if(f===void 0)f=function(S,C){return C};else if(typeof f!="function"){var M=f;f=function(S,C){for(var L=C,O=0;O<M.length;O++)L=M[O].call(S,L);return L}}else{var $=f;f=function(S,C){return $.call(S,C)}}a.push(f)}e!==0&&(e===1?(i.get=s.get,i.set=s.set):e===2?i.value=s:e===3?i.get=s:e===4&&(i.set=s),g?e===1?(a.push(function(S,C){return s.get.call(S,C)}),a.push(function(S,C){return s.set.call(S,C)})):e===2?a.push(s):a.push(function(S,C){return s.call(S,C)}):Object.defineProperty(o,l,i))}function v(a,o,c){for(var l=[],e,y,g=new Map,T=new Map,w=0;w<o.length;w++){var m=o[w];if(Array.isArray(m)){var i=m[1],f=m[2],s=m.length>3,d=i>=5,I,D;if(d?(I=a,i=i-5,y=y||[],D=y):(I=a.prototype,e=e||[],D=e),i!==0&&!s){var _=d?T:g,P=_.get(f)||0;if(P===!0||P===3&&i!==4||P===4&&i!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!P&&i>2?_.set(f,i):_.set(f,!0)}p(l,I,m,f,i,d,s,D,c)}}return b(l,e),b(l,y),l}function b(a,o){o&&a.push(function(c){for(var l=0;l<o.length;l++)o[l].call(c);return c})}function x(a,o,c){if(o.length>0){for(var l=[],e=a,y=a.name,g=o.length-1;g>=0;g--){var T={v:!1};try{var w=o[g](e,{kind:"class",name:y,addInitializer:h(l,T),metadata:c})}finally{T.v=!0}w!==void 0&&(u(10,w),e=w)}return[E(e,c),function(){for(var m=0;m<l.length;m++)l[m].call(e)}]}}function E(a,o){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,c,l,e){if(e!==void 0)var y=e[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(y===void 0?null:y),T=v(o,c,g);return l.length||E(o,g),{e:T,get c(){return x(o,l,g)}}}}function Dr(h,t,r,n){return(Dr=ca())(h,t,r,n)}var _r,Er,ua;_r=wt({access:K.Read,selector:/^\[[\w$]+\]$/});var Sr=class{static{({c:[ua,Er]}=Dr(this,[],[_r]))}constructor(t=z.use(tt),r=z.use(Y),n=z.use(lt)){this.mTarget=t,this.mProcedure=r.createExpressionProcedure(n.value),this.mTargetProperty=n.name.substring(1,n.name.length-1),this.mLastValue=Symbol("Uncomparable")}mLastValue;mProcedure;mTarget;mTargetProperty;onUpdate(){let t=this.mProcedure.execute();return t===this.mLastValue?!1:(this.mLastValue=t,Reflect.set(this.mTarget,this.mTargetProperty,t),!0)}static{Er()}};function da(){function h(a,o){return function(l){r(o,"addInitializer"),n(l,"An initializer"),a.push(l)}}function t(a,o,c,l,e,y,g,T,w){var m;switch(e){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var i={kind:m,name:g?"#"+o:o,static:y,private:g,metadata:T},f={v:!1};i.addInitializer=h(l,f);var s,d;e===0?g?(s=c.get,d=c.set):(s=function(){return this[o]},d=function(I){this[o]=I}):e===2?s=function(){return c.value}:((e===1||e===3)&&(s=function(){return c.get.call(this)}),(e===1||e===4)&&(d=function(I){c.set.call(this,I)})),i.access=s&&d?{get:s,set:d}:s?{get:s}:{set:d};try{return a(w,i)}finally{f.v=!0}}function r(a,o){if(a.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(a,o){if(typeof a!="function")throw new TypeError(o+" must be a function")}function u(a,o){var c=typeof o;if(a===1){if(c!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(c!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function p(a,o,c,l,e,y,g,T,w){var m=c[0],i,f,s;g?e===0||e===1?i={get:c[3],set:c[4]}:e===3?i={get:c[3]}:e===4?i={set:c[3]}:i={value:c[3]}:e!==0&&(i=Object.getOwnPropertyDescriptor(o,l)),e===1?s={get:i.get,set:i.set}:e===2?s=i.value:e===3?s=i.get:e===4&&(s=i.set);var d,I,D;if(typeof m=="function")d=t(m,l,i,T,e,y,g,w,s),d!==void 0&&(u(e,d),e===0?f=d:e===1?(f=d.init,I=d.get||s.get,D=d.set||s.set,s={get:I,set:D}):s=d);else for(var _=m.length-1;_>=0;_--){var P=m[_];if(d=t(P,l,i,T,e,y,g,w,s),d!==void 0){u(e,d);var N;e===0?N=d:e===1?(N=d.init,I=d.get||s.get,D=d.set||s.set,s={get:I,set:D}):s=d,N!==void 0&&(f===void 0?f=N:typeof f=="function"?f=[f,N]:f.push(N))}}if(e===0||e===1){if(f===void 0)f=function(S,C){return C};else if(typeof f!="function"){var M=f;f=function(S,C){for(var L=C,O=0;O<M.length;O++)L=M[O].call(S,L);return L}}else{var $=f;f=function(S,C){return $.call(S,C)}}a.push(f)}e!==0&&(e===1?(i.get=s.get,i.set=s.set):e===2?i.value=s:e===3?i.get=s:e===4&&(i.set=s),g?e===1?(a.push(function(S,C){return s.get.call(S,C)}),a.push(function(S,C){return s.set.call(S,C)})):e===2?a.push(s):a.push(function(S,C){return s.call(S,C)}):Object.defineProperty(o,l,i))}function v(a,o,c){for(var l=[],e,y,g=new Map,T=new Map,w=0;w<o.length;w++){var m=o[w];if(Array.isArray(m)){var i=m[1],f=m[2],s=m.length>3,d=i>=5,I,D;if(d?(I=a,i=i-5,y=y||[],D=y):(I=a.prototype,e=e||[],D=e),i!==0&&!s){var _=d?T:g,P=_.get(f)||0;if(P===!0||P===3&&i!==4||P===4&&i!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!P&&i>2?_.set(f,i):_.set(f,!0)}p(l,I,m,f,i,d,s,D,c)}}return b(l,e),b(l,y),l}function b(a,o){o&&a.push(function(c){for(var l=0;l<o.length;l++)o[l].call(c);return c})}function x(a,o,c){if(o.length>0){for(var l=[],e=a,y=a.name,g=o.length-1;g>=0;g--){var T={v:!1};try{var w=o[g](e,{kind:"class",name:y,addInitializer:h(l,T),metadata:c})}finally{T.v=!0}w!==void 0&&(u(10,w),e=w)}return[E(e,c),function(){for(var m=0;m<l.length;m++)l[m].call(e)}]}}function E(a,o){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,c,l,e){if(e!==void 0)var y=e[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(y===void 0?null:y),T=v(o,c,g);return l.length||E(o,g),{e:T,get c(){return x(o,l,g)}}}}function Ar(h,t,r,n){return(Ar=da())(h,t,r,n)}var Lr,Pr,ha;Lr=wt({access:K.Write,selector:/^#[[\w$]+$/});var Nr=class{static{({c:[ha,Pr]}=Ar(this,[],[Lr]))}constructor(t=z.use(tt),r=z.use(lt),n=z.use(pt)){n.setTemporaryValue(r.name.substring(1),t)}static{Pr()}};function fa(){function h(a,o){return function(l){r(o,"addInitializer"),n(l,"An initializer"),a.push(l)}}function t(a,o,c,l,e,y,g,T,w){var m;switch(e){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var i={kind:m,name:g?"#"+o:o,static:y,private:g,metadata:T},f={v:!1};i.addInitializer=h(l,f);var s,d;e===0?g?(s=c.get,d=c.set):(s=function(){return this[o]},d=function(I){this[o]=I}):e===2?s=function(){return c.value}:((e===1||e===3)&&(s=function(){return c.get.call(this)}),(e===1||e===4)&&(d=function(I){c.set.call(this,I)})),i.access=s&&d?{get:s,set:d}:s?{get:s}:{set:d};try{return a(w,i)}finally{f.v=!0}}function r(a,o){if(a.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(a,o){if(typeof a!="function")throw new TypeError(o+" must be a function")}function u(a,o){var c=typeof o;if(a===1){if(c!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(c!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function p(a,o,c,l,e,y,g,T,w){var m=c[0],i,f,s;g?e===0||e===1?i={get:c[3],set:c[4]}:e===3?i={get:c[3]}:e===4?i={set:c[3]}:i={value:c[3]}:e!==0&&(i=Object.getOwnPropertyDescriptor(o,l)),e===1?s={get:i.get,set:i.set}:e===2?s=i.value:e===3?s=i.get:e===4&&(s=i.set);var d,I,D;if(typeof m=="function")d=t(m,l,i,T,e,y,g,w,s),d!==void 0&&(u(e,d),e===0?f=d:e===1?(f=d.init,I=d.get||s.get,D=d.set||s.set,s={get:I,set:D}):s=d);else for(var _=m.length-1;_>=0;_--){var P=m[_];if(d=t(P,l,i,T,e,y,g,w,s),d!==void 0){u(e,d);var N;e===0?N=d:e===1?(N=d.init,I=d.get||s.get,D=d.set||s.set,s={get:I,set:D}):s=d,N!==void 0&&(f===void 0?f=N:typeof f=="function"?f=[f,N]:f.push(N))}}if(e===0||e===1){if(f===void 0)f=function(S,C){return C};else if(typeof f!="function"){var M=f;f=function(S,C){for(var L=C,O=0;O<M.length;O++)L=M[O].call(S,L);return L}}else{var $=f;f=function(S,C){return $.call(S,C)}}a.push(f)}e!==0&&(e===1?(i.get=s.get,i.set=s.set):e===2?i.value=s:e===3?i.get=s:e===4&&(i.set=s),g?e===1?(a.push(function(S,C){return s.get.call(S,C)}),a.push(function(S,C){return s.set.call(S,C)})):e===2?a.push(s):a.push(function(S,C){return s.call(S,C)}):Object.defineProperty(o,l,i))}function v(a,o,c){for(var l=[],e,y,g=new Map,T=new Map,w=0;w<o.length;w++){var m=o[w];if(Array.isArray(m)){var i=m[1],f=m[2],s=m.length>3,d=i>=5,I,D;if(d?(I=a,i=i-5,y=y||[],D=y):(I=a.prototype,e=e||[],D=e),i!==0&&!s){var _=d?T:g,P=_.get(f)||0;if(P===!0||P===3&&i!==4||P===4&&i!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!P&&i>2?_.set(f,i):_.set(f,!0)}p(l,I,m,f,i,d,s,D,c)}}return b(l,e),b(l,y),l}function b(a,o){o&&a.push(function(c){for(var l=0;l<o.length;l++)o[l].call(c);return c})}function x(a,o,c){if(o.length>0){for(var l=[],e=a,y=a.name,g=o.length-1;g>=0;g--){var T={v:!1};try{var w=o[g](e,{kind:"class",name:y,addInitializer:h(l,T),metadata:c})}finally{T.v=!0}w!==void 0&&(u(10,w),e=w)}return[E(e,c),function(){for(var m=0;m<l.length;m++)l[m].call(e)}]}}function E(a,o){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,c,l,e){if(e!==void 0)var y=e[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(y===void 0?null:y),T=v(o,c,g);return l.length||E(o,g),{e:T,get c(){return x(o,l,g)}}}}function Mr(h,t,r,n){return(Mr=fa())(h,t,r,n)}var Fr,Or,ma;Fr=xt({instructionType:"slot"});var Rr=class{static{({c:[ma,Or]}=Mr(this,[],[Fr]))}constructor(t=z.use(Y),r=z.use(Q)){this.mModuleValues=t,this.mSlotName=r.value,this.mIsSetup=!1}mIsSetup;mModuleValues;mSlotName;onUpdate(){if(this.mIsSetup)return null;this.mIsSetup=!0;let t=new bt("slot");this.mSlotName!==""&&t.setAttribute("name").addValue(this.mSlotName);let r=new at;r.appendChild(t);let n=new ct;return n.addElement(r,this.mModuleValues.data),n}static{Or()}};function pa(){function h(a,o){return function(l){r(o,"addInitializer"),n(l,"An initializer"),a.push(l)}}function t(a,o,c,l,e,y,g,T,w){var m;switch(e){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var i={kind:m,name:g?"#"+o:o,static:y,private:g,metadata:T},f={v:!1};i.addInitializer=h(l,f);var s,d;e===0?g?(s=c.get,d=c.set):(s=function(){return this[o]},d=function(I){this[o]=I}):e===2?s=function(){return c.value}:((e===1||e===3)&&(s=function(){return c.get.call(this)}),(e===1||e===4)&&(d=function(I){c.set.call(this,I)})),i.access=s&&d?{get:s,set:d}:s?{get:s}:{set:d};try{return a(w,i)}finally{f.v=!0}}function r(a,o){if(a.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(a,o){if(typeof a!="function")throw new TypeError(o+" must be a function")}function u(a,o){var c=typeof o;if(a===1){if(c!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(c!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function p(a,o,c,l,e,y,g,T,w){var m=c[0],i,f,s;g?e===0||e===1?i={get:c[3],set:c[4]}:e===3?i={get:c[3]}:e===4?i={set:c[3]}:i={value:c[3]}:e!==0&&(i=Object.getOwnPropertyDescriptor(o,l)),e===1?s={get:i.get,set:i.set}:e===2?s=i.value:e===3?s=i.get:e===4&&(s=i.set);var d,I,D;if(typeof m=="function")d=t(m,l,i,T,e,y,g,w,s),d!==void 0&&(u(e,d),e===0?f=d:e===1?(f=d.init,I=d.get||s.get,D=d.set||s.set,s={get:I,set:D}):s=d);else for(var _=m.length-1;_>=0;_--){var P=m[_];if(d=t(P,l,i,T,e,y,g,w,s),d!==void 0){u(e,d);var N;e===0?N=d:e===1?(N=d.init,I=d.get||s.get,D=d.set||s.set,s={get:I,set:D}):s=d,N!==void 0&&(f===void 0?f=N:typeof f=="function"?f=[f,N]:f.push(N))}}if(e===0||e===1){if(f===void 0)f=function(S,C){return C};else if(typeof f!="function"){var M=f;f=function(S,C){for(var L=C,O=0;O<M.length;O++)L=M[O].call(S,L);return L}}else{var $=f;f=function(S,C){return $.call(S,C)}}a.push(f)}e!==0&&(e===1?(i.get=s.get,i.set=s.set):e===2?i.value=s:e===3?i.get=s:e===4&&(i.set=s),g?e===1?(a.push(function(S,C){return s.get.call(S,C)}),a.push(function(S,C){return s.set.call(S,C)})):e===2?a.push(s):a.push(function(S,C){return s.call(S,C)}):Object.defineProperty(o,l,i))}function v(a,o,c){for(var l=[],e,y,g=new Map,T=new Map,w=0;w<o.length;w++){var m=o[w];if(Array.isArray(m)){var i=m[1],f=m[2],s=m.length>3,d=i>=5,I,D;if(d?(I=a,i=i-5,y=y||[],D=y):(I=a.prototype,e=e||[],D=e),i!==0&&!s){var _=d?T:g,P=_.get(f)||0;if(P===!0||P===3&&i!==4||P===4&&i!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!P&&i>2?_.set(f,i):_.set(f,!0)}p(l,I,m,f,i,d,s,D,c)}}return b(l,e),b(l,y),l}function b(a,o){o&&a.push(function(c){for(var l=0;l<o.length;l++)o[l].call(c);return c})}function x(a,o,c){if(o.length>0){for(var l=[],e=a,y=a.name,g=o.length-1;g>=0;g--){var T={v:!1};try{var w=o[g](e,{kind:"class",name:y,addInitializer:h(l,T),metadata:c})}finally{T.v=!0}w!==void 0&&(u(10,w),e=w)}return[E(e,c),function(){for(var m=0;m<l.length;m++)l[m].call(e)}]}}function E(a,o){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,c,l,e){if(e!==void 0)var y=e[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(y===void 0?null:y),T=v(o,c,g);return l.length||E(o,g),{e:T,get c(){return x(o,l,g)}}}}function Br(h,t,r,n){return(Br=pa())(h,t,r,n)}var $r,zr,ga;$r=wt({access:K.ReadWrite,selector:/^\[\([[\w$]+\)\]$/});var Vr=class{static{({c:[ga,zr]}=Br(this,[],[$r]))}constructor(t=z.use(ot),r=z.use(tt),n=z.use(Y),u=z.use(lt)){this.mTargetNode=r,this.mAttributeKey=u.name.substring(2,u.name.length-2),this.mReadProcedure=n.createExpressionProcedure(u.value),this.mWriteProcedure=n.createExpressionProcedure(`${u.value} = $DATA;`,["$DATA"]),this.mLastDataValue=Symbol("Uncomparable");let p=v=>{this.mLastDataValue!==v&&t.updater.updateAsync()};this.mTargetNode.addEventListener("input",v=>{p(Reflect.get(this.mTargetNode,this.mAttributeKey))}),this.mTargetNode.addEventListener("change",v=>{p(Reflect.get(this.mTargetNode,this.mAttributeKey))})}mAttributeKey;mLastDataValue;mReadProcedure;mTargetNode;mWriteProcedure;onUpdate(){let t=this.mReadProcedure.execute();if(t!==this.mLastDataValue)return Reflect.set(this.mTargetNode,this.mAttributeKey,t),this.mLastDataValue=t,!0;let r=Reflect.get(this.mTargetNode,this.mAttributeKey);return r!==t?(this.mWriteProcedure.setTemporaryValue("$DATA",r),this.mWriteProcedure.execute(),this.mLastDataValue=r,!0):!1}static{zr()}};function va(){function h(a,o){return function(l){r(o,"addInitializer"),n(l,"An initializer"),a.push(l)}}function t(a,o,c,l,e,y,g,T,w){var m;switch(e){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var i={kind:m,name:g?"#"+o:o,static:y,private:g,metadata:T},f={v:!1};i.addInitializer=h(l,f);var s,d;e===0?g?(s=c.get,d=c.set):(s=function(){return this[o]},d=function(I){this[o]=I}):e===2?s=function(){return c.value}:((e===1||e===3)&&(s=function(){return c.get.call(this)}),(e===1||e===4)&&(d=function(I){c.set.call(this,I)})),i.access=s&&d?{get:s,set:d}:s?{get:s}:{set:d};try{return a(w,i)}finally{f.v=!0}}function r(a,o){if(a.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(a,o){if(typeof a!="function")throw new TypeError(o+" must be a function")}function u(a,o){var c=typeof o;if(a===1){if(c!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(c!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function p(a,o,c,l,e,y,g,T,w){var m=c[0],i,f,s;g?e===0||e===1?i={get:c[3],set:c[4]}:e===3?i={get:c[3]}:e===4?i={set:c[3]}:i={value:c[3]}:e!==0&&(i=Object.getOwnPropertyDescriptor(o,l)),e===1?s={get:i.get,set:i.set}:e===2?s=i.value:e===3?s=i.get:e===4&&(s=i.set);var d,I,D;if(typeof m=="function")d=t(m,l,i,T,e,y,g,w,s),d!==void 0&&(u(e,d),e===0?f=d:e===1?(f=d.init,I=d.get||s.get,D=d.set||s.set,s={get:I,set:D}):s=d);else for(var _=m.length-1;_>=0;_--){var P=m[_];if(d=t(P,l,i,T,e,y,g,w,s),d!==void 0){u(e,d);var N;e===0?N=d:e===1?(N=d.init,I=d.get||s.get,D=d.set||s.set,s={get:I,set:D}):s=d,N!==void 0&&(f===void 0?f=N:typeof f=="function"?f=[f,N]:f.push(N))}}if(e===0||e===1){if(f===void 0)f=function(S,C){return C};else if(typeof f!="function"){var M=f;f=function(S,C){for(var L=C,O=0;O<M.length;O++)L=M[O].call(S,L);return L}}else{var $=f;f=function(S,C){return $.call(S,C)}}a.push(f)}e!==0&&(e===1?(i.get=s.get,i.set=s.set):e===2?i.value=s:e===3?i.get=s:e===4&&(i.set=s),g?e===1?(a.push(function(S,C){return s.get.call(S,C)}),a.push(function(S,C){return s.set.call(S,C)})):e===2?a.push(s):a.push(function(S,C){return s.call(S,C)}):Object.defineProperty(o,l,i))}function v(a,o,c){for(var l=[],e,y,g=new Map,T=new Map,w=0;w<o.length;w++){var m=o[w];if(Array.isArray(m)){var i=m[1],f=m[2],s=m.length>3,d=i>=5,I,D;if(d?(I=a,i=i-5,y=y||[],D=y):(I=a.prototype,e=e||[],D=e),i!==0&&!s){var _=d?T:g,P=_.get(f)||0;if(P===!0||P===3&&i!==4||P===4&&i!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!P&&i>2?_.set(f,i):_.set(f,!0)}p(l,I,m,f,i,d,s,D,c)}}return b(l,e),b(l,y),l}function b(a,o){o&&a.push(function(c){for(var l=0;l<o.length;l++)o[l].call(c);return c})}function x(a,o,c){if(o.length>0){for(var l=[],e=a,y=a.name,g=o.length-1;g>=0;g--){var T={v:!1};try{var w=o[g](e,{kind:"class",name:y,addInitializer:h(l,T),metadata:c})}finally{T.v=!0}w!==void 0&&(u(10,w),e=w)}return[E(e,c),function(){for(var m=0;m<l.length;m++)l[m].call(e)}]}}function E(a,o){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,c,l,e){if(e!==void 0)var y=e[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(y===void 0?null:y),T=v(o,c,g);return l.length||E(o,g),{e:T,get c(){return x(o,l,g)}}}}function Ur(h,t,r,n){return(Ur=va())(h,t,r,n)}var Xr,jr,ya;Xr=Mt({access:K.Read,targetRestrictions:[mt]});var Gr=class{static{({c:[ya,jr]}=Ur(this,[],[Xr]))}constructor(t=z.use(mt),r=z.use(tt)){let n=new Array,u=t.processorConstructor;do{let p=rt.get(u).getMetadata(ie.METADATA_USER_EVENT_LISTENER_PROPERIES);if(p)for(let v of p)n.push(v)}while(u=Object.getPrototypeOf(u));this.mEventListenerList=new Array,this.mTargetElement=r;for(let p of n){let[v,b]=p,x=Reflect.get(t.processor,v);x=x.bind(t.processor),this.mEventListenerList.push([b,x]),this.mTargetElement.addEventListener(b,x)}}mEventListenerList;mTargetElement;onDeconstruct(){for(let t of this.mEventListenerList){let[r,n]=t;this.mTargetElement.removeEventListener(r,n)}}static{jr()}};var q=function(h){return h.Data="data",h.Flow="flow",h}({});var Ft=class{id;kind;sourceNodeId;sourcePortId;targetNodeId;targetPortId;mValid;get valid(){return this.mValid}set valid(t){this.mValid=t}constructor(t,r,n,u,p,v){this.id=t,this.sourceNodeId=r,this.sourcePortId=n,this.targetNodeId=u,this.targetPortId=p,this.kind=v,this.mValid=!0}};var ce=function(h){return h.Input="input",h.Output="output",h}({});var ue=class{direction;id;name;mConnectedTo;get connectedTo(){return this.mConnectedTo}set connectedTo(t){this.mConnectedTo=t}constructor(t,r,n){this.id=t,this.name=r,this.direction=n,this.mConnectedTo=null}};var de=class{direction;id;name;type;valueId;mConnectedTo;get connectedTo(){return this.mConnectedTo}set connectedTo(t){this.mConnectedTo=t}constructor(t,r,n,u,p){this.id=t,this.name=r,this.type=n,this.direction=u,this.valueId=p,this.mConnectedTo=null}};var zt=class h{category;definitionId;flowInputs;flowOutputs;id;inputs;outputs;properties;system;mPosition;mSize;get position(){return this.mPosition}get size(){return this.mSize}constructor(t,r,n,u){this.id=t,this.definitionId=r.id,this.category=r.category,this.system=u,this.mPosition={x:n.x,y:n.y},this.mSize={w:8,h:4},this.properties=new Map,this.inputs=new Map,this.flowInputs=new Map;for(let[p,v]of Object.entries(r.inputs))if(v.nodeType==="flow"){let b=h.generatePortId();this.flowInputs.set(p,new ue(b,p,ce.Input))}else{let b=h.generatePortId(),x=h.generateValueId(r.category),E=h.getPortDataType(v);this.inputs.set(p,new de(b,p,E,ce.Input,x))}this.outputs=new Map,this.flowOutputs=new Map;for(let[p,v]of Object.entries(r.outputs))if(v.nodeType==="flow"){let b=h.generatePortId();this.flowOutputs.set(p,new ue(b,p,ce.Output))}else{let b=h.generatePortId(),x=h.generateValueId(r.category),E=h.getPortDataType(v);this.outputs.set(p,new de(b,p,E,ce.Output,x))}}moveTo(t,r){this.mPosition={x:t,y:r}}resizeTo(t,r){this.mSize={w:Math.max(4,t),h:Math.max(2,r)}}static getPortDataType(t){return t.nodeType==="value"||t.nodeType==="input"?t.dataType:""}static generatePortId(){return crypto.randomUUID().substring(0,8)}static generateValueId(t){let r=crypto.randomUUID().replace(/-/g,"").substring(0,12);return`${String(t).replace(/[^a-zA-Z0-9]/g,"")}_${r}`}};var Se=class{mConnections;mNodes;get connections(){return this.mConnections}get nodes(){return this.mNodes}constructor(){this.mNodes=new Map,this.mConnections=new Map}addNode(t,r,n=!1){let u=crypto.randomUUID(),p=new zt(u,t,r,n);return this.mNodes.set(u,p),p}addExistingNode(t){this.mNodes.set(t.id,t)}removeNode(t){let r=new Array;for(let[n,u]of this.mConnections)(u.sourceNodeId===t||u.targetNodeId===t)&&(r.push(u),this.mConnections.delete(n));return this.mNodes.delete(t),r}addConnection(t,r,n,u,p){let v=this.mNodes.get(t),b=this.mNodes.get(n);if(!v||!b||t===n)return null;if(p===q.Data){let x=this.findDataPortById(v,r),E=this.findDataPortById(b,u);if(!x||!E)return null;let a=x.type===E.type;for(let[l,e]of this.mConnections)if(e.targetNodeId===n&&e.targetPortId===u&&e.kind===q.Data){this.mConnections.delete(l);break}E.connectedTo=x.valueId;let o=crypto.randomUUID(),c=new Ft(o,t,r,n,u,p);return c.valid=a,this.mConnections.set(o,c),c}else{let x=this.findFlowPortById(v,r),E=this.findFlowPortById(b,u);if(!x||!E)return null;for(let[c,l]of this.mConnections)if(l.sourceNodeId===t&&l.sourcePortId===r&&l.kind===q.Flow){this.mConnections.delete(c);break}x.connectedTo=E.id,E.connectedTo=x.id;let a=crypto.randomUUID(),o=new Ft(a,t,r,n,u,p);return this.mConnections.set(a,o),o}}addExistingConnection(t){this.mConnections.set(t.id,t)}removeConnection(t){let r=this.mConnections.get(t);if(!r)return null;let n=this.mNodes.get(r.targetNodeId);if(n)if(r.kind===q.Data){let u=this.findDataPortById(n,r.targetPortId);u&&(u.connectedTo=null)}else{let u=this.mNodes.get(r.sourceNodeId),p=u?this.findFlowPortById(u,r.sourcePortId):null,v=this.findFlowPortById(n,r.targetPortId);p&&(p.connectedTo=null),v&&(v.connectedTo=null)}return this.mConnections.delete(t),r}validate(){let t=new Array;for(let r of this.mConnections.values()){if(r.kind!==q.Data)continue;let n=this.mNodes.get(r.sourceNodeId),u=this.mNodes.get(r.targetNodeId);if(!n||!u){r.valid=!1,t.push(r);continue}let p=this.findDataPortById(n,r.sourcePortId),v=this.findDataPortById(u,r.targetPortId);if(!p||!v){r.valid=!1,t.push(r);continue}let b=p.type===v.type;r.valid=b,b||t.push(r)}return t}getNode(t){return this.mNodes.get(t)}getConnection(t){return this.mConnections.get(t)}getConnectionsForNode(t){let r=new Array;for(let n of this.mConnections.values())(n.sourceNodeId===t||n.targetNodeId===t)&&r.push(n);return r}findDataPortById(t,r){for(let n of t.inputs.values())if(n.id===r)return n;for(let n of t.outputs.values())if(n.id===r)return n;return null}findFlowPortById(t,r){for(let n of t.flowInputs.values())if(n.id===r)return n;for(let n of t.flowOutputs.values())if(n.id===r)return n;return null}};var Vt=class{editableByUser;graph;id;system;mImports;mInputs;mLabel;mLocalVariables;mName;mOutputs;get imports(){return this.mImports}get inputs(){return this.mInputs}get localVariables(){return this.mLocalVariables}get label(){return this.mLabel}get name(){return this.mName}get outputs(){return this.mOutputs}constructor(t,r,n,u,p=!1){this.id=t,this.mName=r,this.mLabel=n,this.system=u,this.editableByUser=p,this.graph=new Se,this.mInputs={},this.mOutputs={},this.mImports=new Array,this.mLocalVariables=new Array}setName(t){this.mName=t}setLabel(t){this.mLabel=t}setInputs(t){this.mInputs={...t}}setOutputs(t){this.mOutputs={...t}}setImports(t){this.mImports=[...t]}addImport(t){this.mImports.includes(t)||this.mImports.push(t)}removeImport(t){let r=this.mImports.indexOf(t);r!==-1&&this.mImports.splice(r,1)}addInput(t,r){this.mInputs[t]=r}removeInput(t){delete this.mInputs[t]}addOutput(t,r){this.mOutputs[t]=r}removeOutput(t){delete this.mOutputs[t]}addLocalVariable(t,r){this.mLocalVariables.push({name:t,type:r})}removeLocalVariable(t){this.mLocalVariables.splice(t,1)}setLocalVariables(t){this.mLocalVariables=[...t]}};var De=class{mProject;constructor(t){this.mProject=t}deserialize(t){let r=new $t,n=this.parseMetadataComment(t);if(!n)return r;for(let p of n.functions){let v=this.reconstructFunction(p);this.reconstructNodes(v,p.nodes),this.restoreAllPortData(v,p.nodes),this.reconstructConnections(v,p.connections),r.addFunction(v)}let u=r.functions.keys().next().value;return u&&r.setActiveFunction(u),r}parseMetadataComment(t){let n=`${this.mProject.commentToken} #potatno `,u=t.split(`
`);for(let p=u.length-1;p>=0;p--){let v=u[p].trim();if(v.startsWith(n)){let b=v.substring(n.length);try{return JSON.parse(b)}catch{return null}}}return null}reconstructFunction(t){let r=new Vt(t.id,t.name,t.label,t.system,t.editableByUser);return t.inputs&&typeof t.inputs=="object"&&r.setInputs(t.inputs),t.outputs&&typeof t.outputs=="object"&&r.setOutputs(t.outputs),Array.isArray(t.imports)&&r.setImports(t.imports),r}reconstructNodes(t,r){for(let n of r){let u=n.category,p=this.mProject.nodeDefinitions.get(n.nodeDefinitionId);if(p){let v=new zt(n.id,p,n.position??{x:0,y:0},n.system??!1);if(n.size&&v.resizeTo(n.size.w,n.size.h),n.properties)for(let[b,x]of Object.entries(n.properties))v.properties.set(b,x);t.graph.addExistingNode(v)}else if(u===R.Input||u===R.Output){let v={};for(let a of n.inputs??[])v[a.name]={nodeType:"value",dataType:a.type};let b={};for(let a of n.outputs??[])b[a.name]={nodeType:"value",dataType:a.type};let x=this.mProject.nodeDefinitions.get(n.nodeDefinitionId),E=new zt(n.id,x,n.position??{x:0,y:0},n.system??!0);if(n.size&&E.resizeTo(n.size.w,n.size.h),n.properties)for(let[a,o]of Object.entries(n.properties))E.properties.set(a,o);t.graph.addExistingNode(E)}}}restoreAllPortData(t,r){for(let n of r){let u=t.graph.getNode(n.id);if(u){if(Array.isArray(n.inputs))for(let p of n.inputs){let v=u.inputs.get(p.name);v&&p.connectedTo&&(v.connectedTo=p.connectedTo)}if(Array.isArray(n.flowInputs))for(let p of n.flowInputs){let v=u.flowInputs.get(p.name);v&&p.connectedTo&&(v.connectedTo=p.connectedTo)}if(Array.isArray(n.flowOutputs))for(let p of n.flowOutputs){let v=u.flowOutputs.get(p.name);v&&p.connectedTo&&(v.connectedTo=p.connectedTo)}}}}reconstructConnections(t,r){for(let n of r){let u=n.kind===q.Flow?q.Flow:q.Data,p=new Ft(n.id,n.sourceNodeId,n.sourcePortId,n.targetNodeId,n.targetPortId,u);p.valid=n.valid??!0,t.graph.addExistingConnection(p)}}};var et=class{mBody;mInputs;mOutputs;mProperties;get body(){return this.mBody}get inputs(){return this.mInputs}get outputs(){return this.mOutputs}get properties(){return this.mProperties}constructor(){this.mInputs=new Map,this.mOutputs=new Map,this.mBody=new Map,this.mProperties=new Map}buildContext(){let t={};for(let[n,u]of this.mInputs)switch(u.nodeType){case"flow":t[n]={code:""};break;case"input":t[n]={value:this.mProperties.get(n)??"",valueId:u.valueId};break;case"value":t[n]={valueId:u.valueId};break}let r={};for(let[n,u]of this.mOutputs)switch(u.nodeType){case"flow":{let p=this.mBody.get(n);r[n]={code:p?.code??""};break}case"input":r[n]={value:this.mProperties.get(n)??"",valueId:u.valueId};break;case"value":r[n]={valueId:u.valueId};break}return{inputs:t,outputs:r}}};var _e=class extends et{get commentText(){return this.properties.get("comment")??""}set commentText(t){this.properties.set("comment",t)}generateCode(){return""}};var Nt=class extends et{mCodeGenerator;constructor(t){super(),this.mCodeGenerator=t}generateCode(){return this.mCodeGenerator(this.buildContext())}};var Pe=class extends Nt{};var Ne=class extends et{generateCode(){return""}};var Ae=class extends et{generateCode(){return""}};var Le=class extends et{generateCode(){return""}};var Oe=class extends et{generateCode(){return""}};var Re=class extends et{generateCode(){let t=this.properties.get("variableName")??"undefined",n=this.inputs.values().next().value?.valueId??"undefined";return`${t} = ${n};`}};var Me=class extends Nt{get value(){return this.properties.get("value")??""}set value(t){this.properties.set("value",t)}};var Zt=class{bodyCode;inputs;name;outputs;constructor(){this.name="",this.bodyCode="",this.inputs=new Array,this.outputs=new Array}};var Bt=class h{mConfig;constructor(t){this.mConfig=t}generateFunctionCode(t){let r=t.graph,n=this.generateGraphCode(r),u=[];for(let v of t.localVariables)u.push(`    let ${v.name};`);u.length>0&&(n=u.join(`
`)+`
`+n);let p=new Zt;p.name=t.name,p.bodyCode=n;for(let[v,b]of Object.entries(t.inputs)){let x=this.findInputNodeValueId(r,v),E=h.getPortDataType(b);p.inputs.push({name:v,type:E,valueId:x})}for(let[v,b]of Object.entries(t.outputs)){let x=this.findOutputNodeValueId(r,v),E=h.getPortDataType(b);p.outputs.push({name:v,type:E,valueId:x})}return this.mConfig.entryPoint.codeGenerator?this.mConfig.entryPoint.codeGenerator(p):n}generateFunctionCodeWithIntermediates(t,r){let n=t.graph,u=this.topologicalSort(n),p=new Array,v=new Map,b="",x=[];for(let e of t.localVariables)x.push(`    let ${e.name};`);x.length>0&&(b=x.join(`
`)+`
`);let E=[];for(let[e,y]of Object.entries(t.inputs)){let g=this.findInputNodeValueId(n,e),T=h.getPortDataType(y);E.push({name:e,type:T,valueId:g})}let a=[];for(let[e,y]of Object.entries(t.outputs)){let g=this.findOutputNodeValueId(n,e),T=h.getPortDataType(y);a.push({name:e,type:T,valueId:g})}for(let e of u){if(e.category===R.Input||e.category===R.Output||e.category===R.Reroute||e.category===R.GetLocal||!this.mConfig.nodeDefinitions.get(e.definitionId))continue;let g=this.buildCodeNode(n,e);for(let[w,m]of e.flowOutputs)if(m.connectedTo){let i=this.generateFlowBodyCode(n,m.connectedTo);g.body.set(w,{code:i})}else g.body.set(w,{code:""});let T=g.generateCode();if(p.push(T),r.has(e.id)){let w=b+p.join(`
`),m=new Zt;m.name=t.name,m.bodyCode=w;for(let f of E)m.inputs.push({...f});for(let f of a)m.outputs.push({...f});let i;this.mConfig.entryPoint.codeGenerator?i=this.mConfig.entryPoint.codeGenerator(m):i=w,v.set(e.id,{intermediateCode:i,context:g.buildContext(),codeFunction:m})}}let o=b+p.join(`
`),c=new Zt;c.name=t.name,c.bodyCode=o;for(let e of E)c.inputs.push({...e});for(let e of a)c.outputs.push({...e});let l;return this.mConfig.entryPoint.codeGenerator?l=this.mConfig.entryPoint.codeGenerator(c):l=o,{fullCode:l,codeFunction:c,nodeIntermediates:v}}generateProjectCode(t){let r=new Array;for(let n of t.values())r.push(this.generateFunctionCode(n));return r.join(`

`)}generateGraphCode(t){let r=this.topologicalSort(t),n=new Array;for(let u of r){if(u.category===R.Input||u.category===R.Output||u.category===R.Reroute||u.category===R.GetLocal||!this.mConfig.nodeDefinitions.get(u.definitionId))continue;let v=this.buildCodeNode(t,u);for(let[x,E]of u.flowOutputs)if(E.connectedTo){let a=this.generateFlowBodyCode(t,E.connectedTo);v.body.set(x,{code:a})}else v.body.set(x,{code:""});let b=v.generateCode();n.push(b)}return n.join(`
`)}generateFlowBodyCode(t,r){let n=new Array,u=r;for(;u;){let p=this.findNodeByFlowPortId(t,u);if(!p||!this.mConfig.nodeDefinitions.get(p.definitionId))break;let b=this.buildCodeNode(t,p);for(let[E,a]of p.flowOutputs)if(a.connectedTo){let o=this.generateFlowBodyCode(t,a.connectedTo);b.body.set(E,{code:o})}else b.body.set(E,{code:""});let x=b.generateCode();n.push(x),u=null}return n.join(`
`)}buildCodeNode(t,r){let n=this.mConfig.nodeDefinitions.get(r.definitionId),u=n?.codeGenerator??(()=>""),p=this.createNodeForCategory(r.category,u),v=n?Object.fromEntries(Object.entries(n.inputs)):{},b=n?Object.fromEntries(Object.entries(n.outputs)):{};for(let[x,E]of r.inputs){let a=this.resolveRerouteChain(t,E.connectedTo??E.valueId),o=v[x]?.nodeType??"value";p.inputs.set(x,{name:x,type:E.type,valueId:a,nodeType:o})}for(let[x]of r.flowInputs)p.inputs.set(x,{name:x,type:"",valueId:"",nodeType:"flow"});for(let[x,E]of r.outputs){let a=b[x]?.nodeType??"value";p.outputs.set(x,{name:x,type:E.type,valueId:E.valueId,nodeType:a})}for(let[x]of r.flowOutputs)p.outputs.set(x,{name:x,type:"",valueId:"",nodeType:"flow"});for(let[x,E]of r.properties)p.properties.set(x,E);if(r.category===R.GetLocal){let x=r.properties.get("variableName")??"",E=p.outputs.values().next().value;E&&x&&p.outputs.set(E.name,{name:E.name,type:E.type,valueId:x,nodeType:E.nodeType})}return p}createNodeForCategory(t,r){switch(t){case R.Comment:return new _e;case R.Input:return new Ae;case R.Output:return new Le;case R.Value:return new Me(r);case R.Flow:return new Pe(r);case R.Reroute:return new Oe;case R.GetLocal:return new Ne;case R.SetLocal:return new Re;default:return new Nt(r)}}topologicalSort(t){let r=new Set,n=new Array,u=new Map;for(let v of t.nodes.values())u.set(v.id,new Set);for(let v of t.connections.values())if(v.kind===q.Data){let b=u.get(v.targetNodeId);b&&b.add(v.sourceNodeId)}let p=v=>{if(r.has(v))return;r.add(v);let b=u.get(v);if(b)for(let E of b)p(E);let x=t.getNode(v);x&&n.push(x)};for(let v of t.nodes.keys())p(v);return n}findInputNodeValueId(t,r){for(let n of t.nodes.values())if(n.category===R.Input&&n.definitionId===r){let u=n.outputs.values().next().value;if(u)return u.valueId}return r}findOutputNodeValueId(t,r){for(let n of t.nodes.values())if(n.category===R.Output&&n.definitionId===r){let u=n.inputs.values().next().value;return u&&u.connectedTo?this.resolveRerouteChain(t,u.connectedTo):u?.valueId??r}return r}resolveRerouteChain(t,r){for(let n of t.nodes.values())for(let u of n.outputs.values())if(u.valueId===r&&n.category===R.Reroute){let p=n.inputs.values().next().value;return p&&p.connectedTo?this.resolveRerouteChain(t,p.connectedTo):p?.valueId??r}return r}findNodeByFlowPortId(t,r){for(let n of t.nodes.values()){for(let u of n.flowInputs.values())if(u.id===r)return n;for(let u of n.flowOutputs.values())if(u.id===r)return n}return null}static getPortDataType(t){return t.nodeType==="value"||t.nodeType==="input"?t.dataType:""}};var Fe=class{mConfig;constructor(t){this.mConfig=t}serialize(t){let n=new Bt(this.mConfig).generateProjectCode(t.functions),u=this.buildMetadata(t),v=`${this.mConfig.commentToken} #potatno ${JSON.stringify(u)}`;return`${n}
${v}`}serializeFunction(t){let n=new Bt(this.mConfig).generateFunctionCode(t),u={functions:[this.serializeFunctionData(t)]},v=`${this.mConfig.commentToken} #potatno ${JSON.stringify(u)}`;return`${n}
${v}`}buildMetadata(t){let r=new Array;for(let n of t.functions.values())r.push(this.serializeFunctionData(n));return{functions:r}}serializeFunctionData(t){let r=new Array,n=new Array;for(let u of t.graph.nodes.values())r.push(this.serializeNode(u));for(let u of t.graph.connections.values())n.push(this.serializeConnection(u));return{id:t.id,name:t.name,label:t.label,system:t.system,editableByUser:t.editableByUser,inputs:{...t.inputs},outputs:{...t.outputs},imports:[...t.imports],nodes:r,connections:n}}serializeNode(t){let r=new Array;for(let[b,x]of t.inputs)r.push({name:b,type:x.type,id:x.id,valueId:x.valueId,connectedTo:x.connectedTo});let n=new Array;for(let[b,x]of t.outputs)n.push({name:b,type:x.type,id:x.id,valueId:x.valueId});let u=new Array;for(let[b,x]of t.flowInputs)u.push({name:b,id:x.id,connectedTo:x.connectedTo});let p=new Array;for(let[b,x]of t.flowOutputs)p.push({name:b,id:x.id,connectedTo:x.connectedTo});let v={};for(let[b,x]of t.properties)v[b]=x;return{id:t.id,type:t.definitionId,category:t.category,position:t.position,size:t.size,system:t.system,properties:v,inputs:r,outputs:n,flowInputs:u,flowOutputs:p}}serializeConnection(t){return{id:t.id,kind:t.kind,sourceNodeId:t.sourceNodeId,sourcePortId:t.sourcePortId,targetNodeId:t.targetNodeId,targetPortId:t.targetPortId,valid:t.valid}}};var G=class h{static create(t){return new h(t)}mId;mCategory;mInputs;mLabel;mOutputs;mCodeGenerator;mPreview;get id(){return this.mId}get category(){return this.mCategory}get inputs(){return this.mInputs}get label(){return this.mLabel}get outputs(){return this.mOutputs}get codeGenerator(){return this.mCodeGenerator}get preview(){return this.mPreview}constructor(t){this.mId=t.id,this.mLabel=t.label??t.id,this.mCategory=t.category,this.mInputs=t.inputs??{},this.mOutputs=t.outputs??{},this.mCodeGenerator=t.codeGenerator,this.mPreview=t.preview??null}};var ze=class h{static MAX_ZOOM=2;static MIN_ZOOM=.25;mGridSize;mPanX;mPanY;mSelectionEnd;mSelectionStart;mZoom;get gridSize(){return this.mGridSize}get panX(){return this.mPanX}get panY(){return this.mPanY}get selectionEnd(){return this.mSelectionEnd}get selectionStart(){return this.mSelectionStart}get zoom(){return this.mZoom}constructor(t=20){this.mGridSize=t,this.mPanX=0,this.mPanY=0,this.mZoom=1,this.mSelectionStart=null,this.mSelectionEnd=null}clearSelection(){this.mSelectionStart=null,this.mSelectionEnd=null}getGridBackgroundCss(){let t=this.mGridSize*this.mZoom,r=this.mPanX%t,n=this.mPanY%t,u=t*5,p=this.mPanX%u,v=this.mPanY%u;return[`background-size: ${t}px ${t}px, ${u}px ${u}px`,`background-position: ${r}px ${n}px, ${p}px ${v}px`,"background-image: radial-gradient(circle, var(--pn-grid-color) 1px, transparent 1px), radial-gradient(circle, var(--pn-grid-color) 1.5px, transparent 1.5px)"].join("; ")}getTransformCss(){return`translate(${this.mPanX}px, ${this.mPanY}px) scale(${this.mZoom})`}pan(t,r){this.mPanX+=t,this.mPanY+=r}screenToWorld(t,r){return{x:(t-this.mPanX)/this.mZoom,y:(r-this.mPanY)/this.mZoom}}setSelectionEnd(t,r){this.mSelectionEnd={x:t,y:r}}setSelectionStart(t,r){this.mSelectionStart={x:t,y:r}}snapToGrid(t,r){return{x:Math.round(t/this.mGridSize)*this.mGridSize,y:Math.round(r/this.mGridSize)*this.mGridSize}}worldToScreen(t,r){return{x:t*this.mZoom+this.mPanX,y:r*this.mZoom+this.mPanY}}zoomAt(t,r,n){let u=this.mZoom,p=1+n,v=this.mZoom*p;v=Math.max(h.MIN_ZOOM,Math.min(h.MAX_ZOOM,v));let b=(t-this.mPanX)/u,x=(r-this.mPanY)/u;this.mZoom=v,this.mPanX=t-b*this.mZoom,this.mPanY=r-x*this.mZoom}};var Ze="http://www.w3.org/2000/svg",qe="data-temp-connection";var Ve=class{clearAll(t){let r=t.querySelectorAll("path");for(let n of r)n.remove()}clearTempConnection(t){let r=t.querySelector(`[${qe}]`);r&&r.remove()}generateBezierPath(t,r,n,u){let p=Math.abs(n-t),v=Math.max(p*.4,50),b=t+v,x=r,E=n-v;return`M ${t} ${r} C ${b} ${x}, ${E} ${u}, ${n} ${u}`}renderConnections(t,r){let n=t.querySelectorAll(`path:not([${qe}])`);for(let u of n)u.remove();for(let u of r){let p=this.generateBezierPath(u.sourceX,u.sourceY,u.targetX,u.targetY),v=document.createElementNS(Ze,"path");v.setAttribute("d",p),v.setAttribute("fill","none"),v.setAttribute("data-connection-id",u.id),v.setAttribute("data-hit-area","true"),v.style.stroke="transparent",v.style.strokeWidth="12",v.style.pointerEvents="stroke",v.style.cursor="pointer",t.appendChild(v);let b=document.createElementNS(Ze,"path");b.setAttribute("d",p),b.setAttribute("fill","none"),b.setAttribute("data-connection-id",u.id),b.style.stroke=u.valid?"#a6adc8":"#f38ba8",b.style.strokeWidth="2",b.style.pointerEvents="none",u.valid||b.setAttribute("stroke-dasharray","6 3"),t.appendChild(b)}}renderTempConnection(t,r,n,u){this.clearTempConnection(t);let p=document.createElementNS(Ze,"path");p.setAttribute("d",this.generateBezierPath(r.x,r.y,n.x,n.y)),p.setAttribute("fill","none"),p.setAttribute(qe,"true"),p.style.stroke=u,p.style.strokeWidth="2",p.style.opacity="0.6",p.style.strokeDasharray="8 4",p.style.pointerEvents="none",t.appendChild(p)}};var Be=class{mData;get hasData(){return this.mData!==null}constructor(){this.mData=null}copy(t,r){let n=new Array,u=new Map;for(let b of r){let x=t.getNode(b);x&&!x.system&&(u.set(x.id,n.length),n.push(x))}if(n.length===0)return;let p=n.map(b=>{let x={};for(let[a,o]of b.properties)x[a]=o;let E=new Array;for(let[a,o]of b.inputs)o.connectedTo&&E.push({portName:a,connectedValueId:o.connectedTo});return{definitionName:b.definitionId,position:{...b.position},size:{...b.size},properties:x,inputConnections:E}}),v=[];for(let b of t.connections.values()){let x=u.get(b.sourceNodeId),E=u.get(b.targetNodeId);if(x!==void 0&&E!==void 0){let a=n[x],o=n[E],c="",l="",e;if(b.kind===q.Data){e="data";for(let[y,g]of a.outputs)if(g.id===b.sourcePortId){c=y;break}for(let[y,g]of o.inputs)if(g.id===b.targetPortId){l=y;break}}else{e="flow";for(let[y,g]of a.flowOutputs)if(g.id===b.sourcePortId){c=y;break}for(let[y,g]of o.flowInputs)if(g.id===b.targetPortId){l=y;break}}c&&l&&v.push({sourceNodeIndex:x,sourcePortName:c,targetNodeIndex:E,targetPortName:l,kind:e})}}this.mData={nodes:p,internalConnections:v}}getData(){return this.mData}};var he=class{description;mActions;constructor(t,r){this.description=t,this.mActions=r}apply(){for(let t of this.mActions)t.apply()}revert(){for(let t=this.mActions.length-1;t>=0;t--)this.mActions[t].revert()}};var $e=class{mMaxSize;mRedoStack;mUndoStack;get canRedo(){return this.mRedoStack.length>0}get canUndo(){return this.mUndoStack.length>0}constructor(t=100){this.mUndoStack=new Array,this.mRedoStack=new Array,this.mMaxSize=t}push(t){t.apply(),this.mUndoStack.push(t),this.mRedoStack.length=0,this.mUndoStack.length>this.mMaxSize&&this.mUndoStack.shift()}undo(){let t=this.mUndoStack.pop();t&&(t.revert(),this.mRedoStack.push(t))}redo(){let t=this.mRedoStack.pop();t&&(t.apply(),this.mUndoStack.push(t))}clear(){this.mUndoStack.length=0,this.mRedoStack.length=0}};var fe=class{description;mDefinition;mGraph;mNode;mPosition;mSystem;get node(){return this.mNode}constructor(t,r,n,u=!1){this.description=`Add node: ${r.id}`,this.mGraph=t,this.mDefinition=r,this.mPosition=n,this.mSystem=u,this.mNode=null}apply(){this.mNode?this.mGraph.addExistingNode(this.mNode):this.mNode=this.mGraph.addNode(this.mDefinition,this.mPosition,this.mSystem)}revert(){this.mNode&&this.mGraph.removeNode(this.mNode.id)}},je=class{description;mGraph;mNodeId;mRemovedConnections;mRemovedNode;constructor(t,r){this.description="Remove node",this.mGraph=t,this.mNodeId=r,this.mRemovedNode=null,this.mRemovedConnections=new Array}apply(){this.mRemovedNode=this.mGraph.getNode(this.mNodeId)??null,this.mRemovedConnections=this.mGraph.removeNode(this.mNodeId)}revert(){if(this.mRemovedNode){this.mGraph.addExistingNode(this.mRemovedNode);for(let t of this.mRemovedConnections)this.mGraph.addExistingConnection(t)}}};var me=class{description;mNewValue;mNode;mOldValue;mPropertyName;constructor(t,r,n){this.description=`Change property: ${r}`,this.mNode=t,this.mPropertyName=r,this.mNewValue=n,this.mOldValue=t.properties.get(r)??""}apply(){this.mOldValue=this.mNode.properties.get(this.mPropertyName)??"",this.mNode.properties.set(this.mPropertyName,this.mNewValue)}revert(){this.mOldValue===""?this.mNode.properties.delete(this.mPropertyName):this.mNode.properties.set(this.mPropertyName,this.mOldValue)}};var Hr=`:host {\r
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
`;var Yr=`<div class="editor-layout">\r
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
                                [previewElement]="this.getPreviewElementForNode(this.nodeRender.id)"\r
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
</div>`;var Wr=`:host {\r
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
`;var Zr=`<div class="function-list-content">\r
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
</div>`;function Ia(){function h(a,o){return function(l){r(o,"addInitializer"),n(l,"An initializer"),a.push(l)}}function t(a,o,c,l,e,y,g,T,w){var m;switch(e){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var i={kind:m,name:g?"#"+o:o,static:y,private:g,metadata:T},f={v:!1};i.addInitializer=h(l,f);var s,d;e===0?g?(s=c.get,d=c.set):(s=function(){return this[o]},d=function(I){this[o]=I}):e===2?s=function(){return c.value}:((e===1||e===3)&&(s=function(){return c.get.call(this)}),(e===1||e===4)&&(d=function(I){c.set.call(this,I)})),i.access=s&&d?{get:s,set:d}:s?{get:s}:{set:d};try{return a(w,i)}finally{f.v=!0}}function r(a,o){if(a.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(a,o){if(typeof a!="function")throw new TypeError(o+" must be a function")}function u(a,o){var c=typeof o;if(a===1){if(c!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(c!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function p(a,o,c,l,e,y,g,T,w){var m=c[0],i,f,s;g?e===0||e===1?i={get:c[3],set:c[4]}:e===3?i={get:c[3]}:e===4?i={set:c[3]}:i={value:c[3]}:e!==0&&(i=Object.getOwnPropertyDescriptor(o,l)),e===1?s={get:i.get,set:i.set}:e===2?s=i.value:e===3?s=i.get:e===4&&(s=i.set);var d,I,D;if(typeof m=="function")d=t(m,l,i,T,e,y,g,w,s),d!==void 0&&(u(e,d),e===0?f=d:e===1?(f=d.init,I=d.get||s.get,D=d.set||s.set,s={get:I,set:D}):s=d);else for(var _=m.length-1;_>=0;_--){var P=m[_];if(d=t(P,l,i,T,e,y,g,w,s),d!==void 0){u(e,d);var N;e===0?N=d:e===1?(N=d.init,I=d.get||s.get,D=d.set||s.set,s={get:I,set:D}):s=d,N!==void 0&&(f===void 0?f=N:typeof f=="function"?f=[f,N]:f.push(N))}}if(e===0||e===1){if(f===void 0)f=function(S,C){return C};else if(typeof f!="function"){var M=f;f=function(S,C){for(var L=C,O=0;O<M.length;O++)L=M[O].call(S,L);return L}}else{var $=f;f=function(S,C){return $.call(S,C)}}a.push(f)}e!==0&&(e===1?(i.get=s.get,i.set=s.set):e===2?i.value=s:e===3?i.get=s:e===4&&(i.set=s),g?e===1?(a.push(function(S,C){return s.get.call(S,C)}),a.push(function(S,C){return s.set.call(S,C)})):e===2?a.push(s):a.push(function(S,C){return s.call(S,C)}):Object.defineProperty(o,l,i))}function v(a,o,c){for(var l=[],e,y,g=new Map,T=new Map,w=0;w<o.length;w++){var m=o[w];if(Array.isArray(m)){var i=m[1],f=m[2],s=m.length>3,d=i>=5,I,D;if(d?(I=a,i=i-5,y=y||[],D=y):(I=a.prototype,e=e||[],D=e),i!==0&&!s){var _=d?T:g,P=_.get(f)||0;if(P===!0||P===3&&i!==4||P===4&&i!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!P&&i>2?_.set(f,i):_.set(f,!0)}p(l,I,m,f,i,d,s,D,c)}}return b(l,e),b(l,y),l}function b(a,o){o&&a.push(function(c){for(var l=0;l<o.length;l++)o[l].call(c);return c})}function x(a,o,c){if(o.length>0){for(var l=[],e=a,y=a.name,g=o.length-1;g>=0;g--){var T={v:!1};try{var w=o[g](e,{kind:"class",name:y,addInitializer:h(l,T),metadata:c})}finally{T.v=!0}w!==void 0&&(u(10,w),e=w)}return[E(e,c),function(){for(var m=0;m<l.length;m++)l[m].call(e)}]}}function E(a,o){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,c,l,e){if(e!==void 0)var y=e[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(y===void 0?null:y),T=v(o,c,g);return l.length||E(o,g),{e:T,get c(){return x(o,l,g)}}}}function oo(h,t,r,n){return(oo=Ia())(h,t,r,n)}var no,qr,io,so,ao,lo,co,Kr,Jr,Qr,kr,to,eo,Ca;no=W({selector:"potatno-function-list",template:Zr,style:Wr}),io=V.state(),so=V.state(),ao=j("function-select"),lo=j("function-add"),co=j("function-delete");var ro=class{static{({e:[Kr,Jr,Qr,kr,to,eo],c:[Ca,qr]}=oo(this,[[[B,io],1,"functions"],[[B,so],1,"activeFunctionId"],[ao,1,"mFunctionSelect"],[lo,1,"mFunctionAdd"],[co,1,"mFunctionDelete"]],[no]))}#t=(eo(this),Kr(this,[]));get functions(){return this.#t}set functions(t){this.#t=t}#e=Jr(this,"");get activeFunctionId(){return this.#e}set activeFunctionId(t){this.#e=t}#r=Qr(this);get mFunctionSelect(){return this.#r}set mFunctionSelect(t){this.#r=t}#o=kr(this);get mFunctionAdd(){return this.#o}set mFunctionAdd(t){this.#o=t}#n=to(this);get mFunctionDelete(){return this.#n}set mFunctionDelete(t){this.#n=t}getEntryClass(t){return t===this.activeFunctionId?"function-entry active":"function-entry"}onFunctionSelect(t){this.mFunctionSelect.dispatchEvent(t)}onFunctionAdd(){this.mFunctionAdd.dispatchEvent(void 0)}onFunctionDelete(t,r){t.stopPropagation(),this.mFunctionDelete.dispatchEvent(r)}static{qr()}};var uo=`:host {\r
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
`;var ho=`$if(this.nodeData) {\r
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
`;var fo=`:host {\r
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
`;var mo=`<div [className]="this.portWrapperClasses" [title]="this.type">\r
    <div #portCircle [className]="this.portCircleClasses" style="--port-color: {{this.portColor}}"\r
         (pointerdown)="this.onPointerDown($event)"\r
         (pointerenter)="this.onPointerEnter($event)"\r
         (pointerleave)="this.onPointerLeave($event)">\r
    </div>\r
    <span class="port-label">{{this.name}}</span>\r
</div>\r
`;function Pa(){function h(a,o){return function(l){r(o,"addInitializer"),n(l,"An initializer"),a.push(l)}}function t(a,o,c,l,e,y,g,T,w){var m;switch(e){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var i={kind:m,name:g?"#"+o:o,static:y,private:g,metadata:T},f={v:!1};i.addInitializer=h(l,f);var s,d;e===0?g?(s=c.get,d=c.set):(s=function(){return this[o]},d=function(I){this[o]=I}):e===2?s=function(){return c.value}:((e===1||e===3)&&(s=function(){return c.get.call(this)}),(e===1||e===4)&&(d=function(I){c.set.call(this,I)})),i.access=s&&d?{get:s,set:d}:s?{get:s}:{set:d};try{return a(w,i)}finally{f.v=!0}}function r(a,o){if(a.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(a,o){if(typeof a!="function")throw new TypeError(o+" must be a function")}function u(a,o){var c=typeof o;if(a===1){if(c!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(c!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function p(a,o,c,l,e,y,g,T,w){var m=c[0],i,f,s;g?e===0||e===1?i={get:c[3],set:c[4]}:e===3?i={get:c[3]}:e===4?i={set:c[3]}:i={value:c[3]}:e!==0&&(i=Object.getOwnPropertyDescriptor(o,l)),e===1?s={get:i.get,set:i.set}:e===2?s=i.value:e===3?s=i.get:e===4&&(s=i.set);var d,I,D;if(typeof m=="function")d=t(m,l,i,T,e,y,g,w,s),d!==void 0&&(u(e,d),e===0?f=d:e===1?(f=d.init,I=d.get||s.get,D=d.set||s.set,s={get:I,set:D}):s=d);else for(var _=m.length-1;_>=0;_--){var P=m[_];if(d=t(P,l,i,T,e,y,g,w,s),d!==void 0){u(e,d);var N;e===0?N=d:e===1?(N=d.init,I=d.get||s.get,D=d.set||s.set,s={get:I,set:D}):s=d,N!==void 0&&(f===void 0?f=N:typeof f=="function"?f=[f,N]:f.push(N))}}if(e===0||e===1){if(f===void 0)f=function(S,C){return C};else if(typeof f!="function"){var M=f;f=function(S,C){for(var L=C,O=0;O<M.length;O++)L=M[O].call(S,L);return L}}else{var $=f;f=function(S,C){return $.call(S,C)}}a.push(f)}e!==0&&(e===1?(i.get=s.get,i.set=s.set):e===2?i.value=s:e===3?i.get=s:e===4&&(i.set=s),g?e===1?(a.push(function(S,C){return s.get.call(S,C)}),a.push(function(S,C){return s.set.call(S,C)})):e===2?a.push(s):a.push(function(S,C){return s.call(S,C)}):Object.defineProperty(o,l,i))}function v(a,o,c){for(var l=[],e,y,g=new Map,T=new Map,w=0;w<o.length;w++){var m=o[w];if(Array.isArray(m)){var i=m[1],f=m[2],s=m.length>3,d=i>=5,I,D;if(d?(I=a,i=i-5,y=y||[],D=y):(I=a.prototype,e=e||[],D=e),i!==0&&!s){var _=d?T:g,P=_.get(f)||0;if(P===!0||P===3&&i!==4||P===4&&i!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!P&&i>2?_.set(f,i):_.set(f,!0)}p(l,I,m,f,i,d,s,D,c)}}return b(l,e),b(l,y),l}function b(a,o){o&&a.push(function(c){for(var l=0;l<o.length;l++)o[l].call(c);return c})}function x(a,o,c){if(o.length>0){for(var l=[],e=a,y=a.name,g=o.length-1;g>=0;g--){var T={v:!1};try{var w=o[g](e,{kind:"class",name:y,addInitializer:h(l,T),metadata:c})}finally{T.v=!0}w!==void 0&&(u(10,w),e=w)}return[E(e,c),function(){for(var m=0;m<l.length;m++)l[m].call(e)}]}}function E(a,o){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,c,l,e){if(e!==void 0)var y=e[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(y===void 0?null:y),T=v(o,c,g);return l.length||E(o,g),{e:T,get c(){return x(o,l,g)}}}}function No(h,t,r,n){return(No=Pa())(h,t,r,n)}var Ao,po,Lo,Oo,Ro,Mo,Fo,zo,Vo,Bo,$o,jo,Go,Uo,go,vo,yo,bo,wo,xo,To,Io,Co,Eo,So,Do,_o,Na;Ao=W({selector:"potatno-port",template:mo,style:fo}),Lo=V.state(),Oo=V.state(),Ro=V.state(),Mo=V.state(),Fo=V.state(),zo=V.state(),Vo=V.state(),Bo=V.state(),$o=j("port-drag-start"),jo=j("port-hover"),Go=j("port-leave"),Uo=ut("portCircle");var Po=class{static{({e:[go,vo,yo,bo,wo,xo,To,Io,Co,Eo,So,Do,_o],c:[Na,po]}=No(this,[[[B,Lo],1,"name"],[[B,Oo],1,"type"],[[B,Ro],1,"portId"],[[B,Mo],1,"nodeId"],[[B,Fo],1,"direction"],[[B,zo],1,"connected"],[[B,Vo],1,"invalid"],[[B,Bo],1,"portKind"],[$o,1,"mPortDragStart"],[jo,1,"mPortHover"],[Go,1,"mPortLeave"],[Uo,1,"portCircleElement"]],[Ao]))}#t=(_o(this),go(this,""));get name(){return this.#t}set name(t){this.#t=t}#e=vo(this,"");get type(){return this.#e}set type(t){this.#e=t}#r=yo(this,"");get portId(){return this.#r}set portId(t){this.#r=t}#o=bo(this,"");get nodeId(){return this.#o}set nodeId(t){this.#o=t}#n=wo(this,"input");get direction(){return this.#n}set direction(t){this.#n=t}#i=xo(this,!1);get connected(){return this.#i}set connected(t){this.#i=t}#s=To(this,!1);get invalid(){return this.#s}set invalid(t){this.#s=t}#a=Io(this,"data");get portKind(){return this.#a}set portKind(t){this.#a=t}#l=Co(this);get mPortDragStart(){return this.#l}set mPortDragStart(t){this.#l=t}#c=Eo(this);get mPortHover(){return this.#c}set mPortHover(t){this.#c=t}#u=So(this);get mPortLeave(){return this.#u}set mPortLeave(t){this.#u=t}#d=Do(this);get portCircleElement(){return this.#d}set portCircleElement(t){this.#d=t}get portWrapperClasses(){return this.direction==="output"?"port-wrapper direction-output":"port-wrapper direction-input"}get portCircleClasses(){let t=["port-circle"];return this.connected?t.push("connected"):t.push("disconnected"),this.invalid&&t.push("invalid"),t.push(this.direction==="output"?"direction-output":"direction-input"),t.join(" ")}get portColor(){return this.portKind==="flow"?"var(--pn-text-primary)":this.getTypeColor(this.type)}onPointerDown(t){t.stopPropagation(),t.preventDefault(),this.mPortDragStart.dispatchEvent({nodeId:this.nodeId,portId:this.portId,portKind:this.portKind,direction:this.direction,type:this.type,element:this.portCircleElement})}onPointerEnter(t){this.mPortHover.dispatchEvent({nodeId:this.nodeId,portId:this.portId,portKind:this.portKind,direction:this.direction,type:this.type,element:this.portCircleElement})}onPointerLeave(t){this.mPortLeave.dispatchEvent(void 0)}getTypeColor(t){let r=0;for(let p=0;p<t.length;p++)r=t.charCodeAt(p)+((r<<5)-r);return`hsl(${Math.abs(r)%256*137.508%360}, 70%, 60%)`}static{po()}};function Aa(){function h(a,o){return function(l){r(o,"addInitializer"),n(l,"An initializer"),a.push(l)}}function t(a,o,c,l,e,y,g,T,w){var m;switch(e){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var i={kind:m,name:g?"#"+o:o,static:y,private:g,metadata:T},f={v:!1};i.addInitializer=h(l,f);var s,d;e===0?g?(s=c.get,d=c.set):(s=function(){return this[o]},d=function(I){this[o]=I}):e===2?s=function(){return c.value}:((e===1||e===3)&&(s=function(){return c.get.call(this)}),(e===1||e===4)&&(d=function(I){c.set.call(this,I)})),i.access=s&&d?{get:s,set:d}:s?{get:s}:{set:d};try{return a(w,i)}finally{f.v=!0}}function r(a,o){if(a.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(a,o){if(typeof a!="function")throw new TypeError(o+" must be a function")}function u(a,o){var c=typeof o;if(a===1){if(c!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(c!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function p(a,o,c,l,e,y,g,T,w){var m=c[0],i,f,s;g?e===0||e===1?i={get:c[3],set:c[4]}:e===3?i={get:c[3]}:e===4?i={set:c[3]}:i={value:c[3]}:e!==0&&(i=Object.getOwnPropertyDescriptor(o,l)),e===1?s={get:i.get,set:i.set}:e===2?s=i.value:e===3?s=i.get:e===4&&(s=i.set);var d,I,D;if(typeof m=="function")d=t(m,l,i,T,e,y,g,w,s),d!==void 0&&(u(e,d),e===0?f=d:e===1?(f=d.init,I=d.get||s.get,D=d.set||s.set,s={get:I,set:D}):s=d);else for(var _=m.length-1;_>=0;_--){var P=m[_];if(d=t(P,l,i,T,e,y,g,w,s),d!==void 0){u(e,d);var N;e===0?N=d:e===1?(N=d.init,I=d.get||s.get,D=d.set||s.set,s={get:I,set:D}):s=d,N!==void 0&&(f===void 0?f=N:typeof f=="function"?f=[f,N]:f.push(N))}}if(e===0||e===1){if(f===void 0)f=function(S,C){return C};else if(typeof f!="function"){var M=f;f=function(S,C){for(var L=C,O=0;O<M.length;O++)L=M[O].call(S,L);return L}}else{var $=f;f=function(S,C){return $.call(S,C)}}a.push(f)}e!==0&&(e===1?(i.get=s.get,i.set=s.set):e===2?i.value=s:e===3?i.get=s:e===4&&(i.set=s),g?e===1?(a.push(function(S,C){return s.get.call(S,C)}),a.push(function(S,C){return s.set.call(S,C)})):e===2?a.push(s):a.push(function(S,C){return s.call(S,C)}):Object.defineProperty(o,l,i))}function v(a,o,c){for(var l=[],e,y,g=new Map,T=new Map,w=0;w<o.length;w++){var m=o[w];if(Array.isArray(m)){var i=m[1],f=m[2],s=m.length>3,d=i>=5,I,D;if(d?(I=a,i=i-5,y=y||[],D=y):(I=a.prototype,e=e||[],D=e),i!==0&&!s){var _=d?T:g,P=_.get(f)||0;if(P===!0||P===3&&i!==4||P===4&&i!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!P&&i>2?_.set(f,i):_.set(f,!0)}p(l,I,m,f,i,d,s,D,c)}}return b(l,e),b(l,y),l}function b(a,o){o&&a.push(function(c){for(var l=0;l<o.length;l++)o[l].call(c);return c})}function x(a,o,c){if(o.length>0){for(var l=[],e=a,y=a.name,g=o.length-1;g>=0;g--){var T={v:!1};try{var w=o[g](e,{kind:"class",name:y,addInitializer:h(l,T),metadata:c})}finally{T.v=!0}w!==void 0&&(u(10,w),e=w)}return[E(e,c),function(){for(var m=0;m<l.length;m++)l[m].call(e)}]}}function E(a,o){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,c,l,e){if(e!==void 0)var y=e[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(y===void 0?null:y),T=v(o,c,g);return l.length||E(o,g),{e:T,get c(){return x(o,l,g)}}}}function ln(h,t,r,n){return(ln=Aa())(h,t,r,n)}var cn,Xo,un,dn,hn,fn,mn,pn,gn,vn,yn,bn,wn,xn,Tn,Ho,Yo,Wo,Zo,qo,Ko,Jo,Qo,ko,tn,en,rn,on,nn,sn,La;cn=W({selector:"potatno-node",template:ho,style:uo}),un=V.state(),dn=V.state(),hn=V.state(),fn=ut("NodePreview"),mn=j("node-select"),pn=j("node-drag-start"),gn=j("port-drag-start"),vn=j("port-hover"),yn=j("port-leave"),bn=j("open-function"),wn=j("value-change"),xn=j("comment-change"),Tn=j("resize-start");var an=class{static{({e:[Ho,Yo,Wo,Zo,qo,Ko,Jo,Qo,ko,tn,en,rn,on,nn,sn],c:[La,Xo]}=ln(this,[[[B,un],1,"nodeData"],[[B,dn],1,"selected"],[[B,hn],1,"gridSize"],[fn,1,"mPreviewContainer"],[mn,1,"mNodeSelect"],[pn,1,"mNodeDragStart"],[gn,1,"mPortDragStart"],[vn,1,"mPortHover"],[yn,1,"mPortLeave"],[bn,1,"mOpenFunction"],[wn,1,"mValueChange"],[xn,1,"mCommentChange"],[Tn,1,"mResizeStart"],[B,0,"previewElement"]],[cn]))}#t=(sn(this),Ho(this,null));get nodeData(){return this.#t}set nodeData(t){this.#t=t}#e=Yo(this,!1);get selected(){return this.#e}set selected(t){this.#e=t}#r=Wo(this,20);get gridSize(){return this.#r}set gridSize(t){this.#r=t}previewElement=nn(this,null);#o=Zo(this);get mPreviewContainer(){return this.#o}set mPreviewContainer(t){this.#o=t}#n=qo(this);get mNodeSelect(){return this.#n}set mNodeSelect(t){this.#n=t}#i=Ko(this);get mNodeDragStart(){return this.#i}set mNodeDragStart(t){this.#i=t}#s=Jo(this);get mPortDragStart(){return this.#s}set mPortDragStart(t){this.#s=t}#a=Qo(this);get mPortHover(){return this.#a}set mPortHover(t){this.#a=t}#l=ko(this);get mPortLeave(){return this.#l}set mPortLeave(t){this.#l=t}#c=tn(this);get mOpenFunction(){return this.#c}set mOpenFunction(t){this.#c=t}#u=en(this);get mValueChange(){return this.#u}set mValueChange(t){this.#u=t}#d=rn(this);get mCommentChange(){return this.#d}set mCommentChange(t){this.#d=t}#h=on(this);get mResizeStart(){return this.#h}set mResizeStart(t){this.#h=t}get nodeStyle(){return this.nodeData?`left: ${this.nodeData.position.x*this.gridSize}px; top: ${this.nodeData.position.y*this.gridSize}px; width: ${this.nodeData.size.w*this.gridSize}px;`:""}get nodeId(){return this.nodeData?.id??""}get selectedClass(){return this.selected?"selected":""}get isComment(){return this.nodeData?.category===R.Comment}get isReroute(){return this.nodeData?.category===R.Reroute}get commentSizeStyle(){return this.nodeData?`height: ${this.nodeData.size.h*this.gridSize}px;`:""}get isValue(){return this.nodeData?.category===R.Value}get isFunction(){return this.nodeData?.category===R.Function}get showOpenButton(){return!1}get inputPorts(){return this.nodeData?.inputs??[]}get outputPorts(){return this.nodeData?.outputs??[]}get flowInputPorts(){return this.nodeData?.flowInputs??[]}get flowOutputPorts(){return this.nodeData?.flowOutputs??[]}get hasPreviewElement(){return!!this.previewElement}onUpdate(){let t=this.previewElement;if(!t)return;let r;try{r=this.mPreviewContainer}catch{return}t.parentElement!==r&&(r.innerHTML="",r.appendChild(t))}onNodePointerDown(t){t.target.tagName?.toLowerCase()!=="potatno-port"&&(this.mNodeSelect.dispatchEvent({nodeId:this.nodeId,shiftKey:t.shiftKey}),this.mNodeDragStart.dispatchEvent({nodeId:this.nodeId,startX:t.clientX,startY:t.clientY}))}onPortDragStart(t){this.mPortDragStart.dispatchEvent(t.value)}onPortHover(t){this.mPortHover.dispatchEvent(t.value)}onPortLeave(t){this.mPortLeave.dispatchEvent(void 0)}onOpenFunction(t){t.stopPropagation(),this.mOpenFunction.dispatchEvent({definitionName:this.nodeData?.definitionName??""})}onValueInput(t){let r=t.target;this.mValueChange.dispatchEvent({nodeId:this.nodeId,property:"value",value:r.value})}onCommentInput(t){let r=t.target;this.mCommentChange.dispatchEvent({nodeId:this.nodeId,text:r.value})}onResizeStart(t){t.stopPropagation(),t.preventDefault(),this.mResizeStart.dispatchEvent({nodeId:this.nodeId,startX:t.clientX,startY:t.clientY})}static{Xo()}};var In=`:host {\r
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
`;var Cn=`<div class="search-wrapper">\r
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
</div>`;function Ma(){function h(a,o){return function(l){r(o,"addInitializer"),n(l,"An initializer"),a.push(l)}}function t(a,o,c,l,e,y,g,T,w){var m;switch(e){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var i={kind:m,name:g?"#"+o:o,static:y,private:g,metadata:T},f={v:!1};i.addInitializer=h(l,f);var s,d;e===0?g?(s=c.get,d=c.set):(s=function(){return this[o]},d=function(I){this[o]=I}):e===2?s=function(){return c.value}:((e===1||e===3)&&(s=function(){return c.get.call(this)}),(e===1||e===4)&&(d=function(I){c.set.call(this,I)})),i.access=s&&d?{get:s,set:d}:s?{get:s}:{set:d};try{return a(w,i)}finally{f.v=!0}}function r(a,o){if(a.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(a,o){if(typeof a!="function")throw new TypeError(o+" must be a function")}function u(a,o){var c=typeof o;if(a===1){if(c!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(c!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function p(a,o,c,l,e,y,g,T,w){var m=c[0],i,f,s;g?e===0||e===1?i={get:c[3],set:c[4]}:e===3?i={get:c[3]}:e===4?i={set:c[3]}:i={value:c[3]}:e!==0&&(i=Object.getOwnPropertyDescriptor(o,l)),e===1?s={get:i.get,set:i.set}:e===2?s=i.value:e===3?s=i.get:e===4&&(s=i.set);var d,I,D;if(typeof m=="function")d=t(m,l,i,T,e,y,g,w,s),d!==void 0&&(u(e,d),e===0?f=d:e===1?(f=d.init,I=d.get||s.get,D=d.set||s.set,s={get:I,set:D}):s=d);else for(var _=m.length-1;_>=0;_--){var P=m[_];if(d=t(P,l,i,T,e,y,g,w,s),d!==void 0){u(e,d);var N;e===0?N=d:e===1?(N=d.init,I=d.get||s.get,D=d.set||s.set,s={get:I,set:D}):s=d,N!==void 0&&(f===void 0?f=N:typeof f=="function"?f=[f,N]:f.push(N))}}if(e===0||e===1){if(f===void 0)f=function(S,C){return C};else if(typeof f!="function"){var M=f;f=function(S,C){for(var L=C,O=0;O<M.length;O++)L=M[O].call(S,L);return L}}else{var $=f;f=function(S,C){return $.call(S,C)}}a.push(f)}e!==0&&(e===1?(i.get=s.get,i.set=s.set):e===2?i.value=s:e===3?i.get=s:e===4&&(i.set=s),g?e===1?(a.push(function(S,C){return s.get.call(S,C)}),a.push(function(S,C){return s.set.call(S,C)})):e===2?a.push(s):a.push(function(S,C){return s.call(S,C)}):Object.defineProperty(o,l,i))}function v(a,o,c){for(var l=[],e,y,g=new Map,T=new Map,w=0;w<o.length;w++){var m=o[w];if(Array.isArray(m)){var i=m[1],f=m[2],s=m.length>3,d=i>=5,I,D;if(d?(I=a,i=i-5,y=y||[],D=y):(I=a.prototype,e=e||[],D=e),i!==0&&!s){var _=d?T:g,P=_.get(f)||0;if(P===!0||P===3&&i!==4||P===4&&i!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!P&&i>2?_.set(f,i):_.set(f,!0)}p(l,I,m,f,i,d,s,D,c)}}return b(l,e),b(l,y),l}function b(a,o){o&&a.push(function(c){for(var l=0;l<o.length;l++)o[l].call(c);return c})}function x(a,o,c){if(o.length>0){for(var l=[],e=a,y=a.name,g=o.length-1;g>=0;g--){var T={v:!1};try{var w=o[g](e,{kind:"class",name:y,addInitializer:h(l,T),metadata:c})}finally{T.v=!0}w!==void 0&&(u(10,w),e=w)}return[E(e,c),function(){for(var m=0;m<l.length;m++)l[m].call(e)}]}}function E(a,o){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,c,l,e){if(e!==void 0)var y=e[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(y===void 0?null:y),T=v(o,c,g);return l.length||E(o,g),{e:T,get c(){return x(o,l,g)}}}}function Nn(h,t,r,n){return(Nn=Ma())(h,t,r,n)}var An,En,Ln,On,Sn,Dn,_n,Fa;An=W({selector:"potatno-node-library",template:Cn,style:In}),Ln=V.state(),On=j("node-drag-start");var Pn=class{static{({e:[Sn,Dn,_n],c:[Fa,En]}=Nn(this,[[Ln,1,"mCachedFilteredGroups"],[On,1,"mNodeDragStart"],[B,4,"nodeDefinitions"]],[An]))}mNodeDefinitions=(_n(this),[]);#t=Sn(this,[]);get mCachedFilteredGroups(){return this.#t}set mCachedFilteredGroups(t){this.#t=t}#e=Dn(this);get mNodeDragStart(){return this.#e}set mNodeDragStart(t){this.#e=t}mSearchQuery="";mCollapsedCategories={};set nodeDefinitions(t){this.mNodeDefinitions=t,this.rebuildFilteredGroups()}get nodeDefinitions(){return this.mNodeDefinitions}get filteredGroups(){return this.mCachedFilteredGroups}rebuildFilteredGroups(){let t=this.mSearchQuery.toLowerCase(),r=new Map;for(let p of this.mNodeDefinitions){if(t&&!p.name.toLowerCase().includes(t))continue;let v=r.get(p.category);v||(v=[],r.set(p.category,v)),v.push(p)}let n=[],u=Object.values(R);for(let p of u){let v=r.get(p);if(v&&v.length>0){let b=jt.get(p);n.push({category:p,icon:b.icon,label:b.label,cssColor:b.cssColor,nodes:v})}}this.mCachedFilteredGroups=n}onSearchInput(t){this.mSearchQuery=t.target.value,this.rebuildFilteredGroups()}toggleCategory(t){this.mCollapsedCategories[t]=!this.mCollapsedCategories[t],this.rebuildFilteredGroups()}isCategoryCollapsed(t){return!!this.mCollapsedCategories[t]}getToggleClass(t){return this.mCollapsedCategories[t]?"category-toggle collapsed":"category-toggle"}onNodeMouseDown(t){this.mNodeDragStart.dispatchEvent(t)}static{En()}};var Rn=`:host {\r
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
`;var Mn=`<div class="tab-bar">\r
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
</div>`;function Ba(){function h(a,o){return function(l){r(o,"addInitializer"),n(l,"An initializer"),a.push(l)}}function t(a,o,c,l,e,y,g,T,w){var m;switch(e){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var i={kind:m,name:g?"#"+o:o,static:y,private:g,metadata:T},f={v:!1};i.addInitializer=h(l,f);var s,d;e===0?g?(s=c.get,d=c.set):(s=function(){return this[o]},d=function(I){this[o]=I}):e===2?s=function(){return c.value}:((e===1||e===3)&&(s=function(){return c.get.call(this)}),(e===1||e===4)&&(d=function(I){c.set.call(this,I)})),i.access=s&&d?{get:s,set:d}:s?{get:s}:{set:d};try{return a(w,i)}finally{f.v=!0}}function r(a,o){if(a.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(a,o){if(typeof a!="function")throw new TypeError(o+" must be a function")}function u(a,o){var c=typeof o;if(a===1){if(c!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(c!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function p(a,o,c,l,e,y,g,T,w){var m=c[0],i,f,s;g?e===0||e===1?i={get:c[3],set:c[4]}:e===3?i={get:c[3]}:e===4?i={set:c[3]}:i={value:c[3]}:e!==0&&(i=Object.getOwnPropertyDescriptor(o,l)),e===1?s={get:i.get,set:i.set}:e===2?s=i.value:e===3?s=i.get:e===4&&(s=i.set);var d,I,D;if(typeof m=="function")d=t(m,l,i,T,e,y,g,w,s),d!==void 0&&(u(e,d),e===0?f=d:e===1?(f=d.init,I=d.get||s.get,D=d.set||s.set,s={get:I,set:D}):s=d);else for(var _=m.length-1;_>=0;_--){var P=m[_];if(d=t(P,l,i,T,e,y,g,w,s),d!==void 0){u(e,d);var N;e===0?N=d:e===1?(N=d.init,I=d.get||s.get,D=d.set||s.set,s={get:I,set:D}):s=d,N!==void 0&&(f===void 0?f=N:typeof f=="function"?f=[f,N]:f.push(N))}}if(e===0||e===1){if(f===void 0)f=function(S,C){return C};else if(typeof f!="function"){var M=f;f=function(S,C){for(var L=C,O=0;O<M.length;O++)L=M[O].call(S,L);return L}}else{var $=f;f=function(S,C){return $.call(S,C)}}a.push(f)}e!==0&&(e===1?(i.get=s.get,i.set=s.set):e===2?i.value=s:e===3?i.get=s:e===4&&(i.set=s),g?e===1?(a.push(function(S,C){return s.get.call(S,C)}),a.push(function(S,C){return s.set.call(S,C)})):e===2?a.push(s):a.push(function(S,C){return s.call(S,C)}):Object.defineProperty(o,l,i))}function v(a,o,c){for(var l=[],e,y,g=new Map,T=new Map,w=0;w<o.length;w++){var m=o[w];if(Array.isArray(m)){var i=m[1],f=m[2],s=m.length>3,d=i>=5,I,D;if(d?(I=a,i=i-5,y=y||[],D=y):(I=a.prototype,e=e||[],D=e),i!==0&&!s){var _=d?T:g,P=_.get(f)||0;if(P===!0||P===3&&i!==4||P===4&&i!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!P&&i>2?_.set(f,i):_.set(f,!0)}p(l,I,m,f,i,d,s,D,c)}}return b(l,e),b(l,y),l}function b(a,o){o&&a.push(function(c){for(var l=0;l<o.length;l++)o[l].call(c);return c})}function x(a,o,c){if(o.length>0){for(var l=[],e=a,y=a.name,g=o.length-1;g>=0;g--){var T={v:!1};try{var w=o[g](e,{kind:"class",name:y,addInitializer:h(l,T),metadata:c})}finally{T.v=!0}w!==void 0&&(u(10,w),e=w)}return[E(e,c),function(){for(var m=0;m<l.length;m++)l[m].call(e)}]}}function E(a,o){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,c,l,e){if(e!==void 0)var y=e[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(y===void 0?null:y),T=v(o,c,g);return l.length||E(o,g),{e:T,get c(){return x(o,l,g)}}}}function Wn(h,t,r,n){return(Wn=Ba())(h,t,r,n)}var Zn,Fn,qn,Kn,Jn,Qn,kn,ti,ei,ri,zn,Vn,Bn,$n,jn,Gn,Un,Xn,Hn,$a;Zn=W({selector:"potatno-panel-left",template:Mn,style:Rn}),qn=V.state(),Kn=V.state(),Jn=V.state(),Qn=j("node-drag-start"),kn=j("function-select"),ti=j("function-add"),ei=j("function-delete"),ri=V.state();var Yn=class{static{({e:[zn,Vn,Bn,$n,jn,Gn,Un,Xn,Hn],c:[$a,Fn]}=Wn(this,[[[B,qn],1,"nodeDefinitions"],[[B,Kn],1,"functions"],[[B,Jn],1,"activeFunctionId"],[Qn,1,"mNodeDragStart"],[kn,1,"mFunctionSelect"],[ti,1,"mFunctionAdd"],[ei,1,"mFunctionDelete"],[ri,1,"mActiveTabIndex"]],[Zn]))}#t=(Hn(this),zn(this,[]));get nodeDefinitions(){return this.#t}set nodeDefinitions(t){this.#t=t}#e=Vn(this,[]);get functions(){return this.#e}set functions(t){this.#e=t}#r=Bn(this,"");get activeFunctionId(){return this.#r}set activeFunctionId(t){this.#r=t}#o=$n(this);get mNodeDragStart(){return this.#o}set mNodeDragStart(t){this.#o=t}#n=jn(this);get mFunctionSelect(){return this.#n}set mFunctionSelect(t){this.#n=t}#i=Gn(this);get mFunctionAdd(){return this.#i}set mFunctionAdd(t){this.#i=t}#s=Un(this);get mFunctionDelete(){return this.#s}set mFunctionDelete(t){this.#s=t}#a=Xn(this,0);get mActiveTabIndex(){return this.#a}set mActiveTabIndex(t){this.#a=t}get activeTabIndex(){return this.mActiveTabIndex}getTabClass(t){return t===this.mActiveTabIndex?"tab-button active":"tab-button"}onTabClick(t){this.mActiveTabIndex=t}onNodeDragStart(t){this.mNodeDragStart.dispatchEvent(t.value)}onFunctionSelect(t){this.mFunctionSelect.dispatchEvent(t.value)}onFunctionAdd(t){this.mFunctionAdd.dispatchEvent(void 0)}onFunctionDelete(t){this.mFunctionDelete.dispatchEvent(t.value)}static{Fn()}};var oi=`:host {\r
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
`;var ni=`<div class="properties-header">Properties</div>\r
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
`;function Ua(){function h(a,o){return function(l){r(o,"addInitializer"),n(l,"An initializer"),a.push(l)}}function t(a,o,c,l,e,y,g,T,w){var m;switch(e){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var i={kind:m,name:g?"#"+o:o,static:y,private:g,metadata:T},f={v:!1};i.addInitializer=h(l,f);var s,d;e===0?g?(s=c.get,d=c.set):(s=function(){return this[o]},d=function(I){this[o]=I}):e===2?s=function(){return c.value}:((e===1||e===3)&&(s=function(){return c.get.call(this)}),(e===1||e===4)&&(d=function(I){c.set.call(this,I)})),i.access=s&&d?{get:s,set:d}:s?{get:s}:{set:d};try{return a(w,i)}finally{f.v=!0}}function r(a,o){if(a.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(a,o){if(typeof a!="function")throw new TypeError(o+" must be a function")}function u(a,o){var c=typeof o;if(a===1){if(c!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(c!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function p(a,o,c,l,e,y,g,T,w){var m=c[0],i,f,s;g?e===0||e===1?i={get:c[3],set:c[4]}:e===3?i={get:c[3]}:e===4?i={set:c[3]}:i={value:c[3]}:e!==0&&(i=Object.getOwnPropertyDescriptor(o,l)),e===1?s={get:i.get,set:i.set}:e===2?s=i.value:e===3?s=i.get:e===4&&(s=i.set);var d,I,D;if(typeof m=="function")d=t(m,l,i,T,e,y,g,w,s),d!==void 0&&(u(e,d),e===0?f=d:e===1?(f=d.init,I=d.get||s.get,D=d.set||s.set,s={get:I,set:D}):s=d);else for(var _=m.length-1;_>=0;_--){var P=m[_];if(d=t(P,l,i,T,e,y,g,w,s),d!==void 0){u(e,d);var N;e===0?N=d:e===1?(N=d.init,I=d.get||s.get,D=d.set||s.set,s={get:I,set:D}):s=d,N!==void 0&&(f===void 0?f=N:typeof f=="function"?f=[f,N]:f.push(N))}}if(e===0||e===1){if(f===void 0)f=function(S,C){return C};else if(typeof f!="function"){var M=f;f=function(S,C){for(var L=C,O=0;O<M.length;O++)L=M[O].call(S,L);return L}}else{var $=f;f=function(S,C){return $.call(S,C)}}a.push(f)}e!==0&&(e===1?(i.get=s.get,i.set=s.set):e===2?i.value=s:e===3?i.get=s:e===4&&(i.set=s),g?e===1?(a.push(function(S,C){return s.get.call(S,C)}),a.push(function(S,C){return s.set.call(S,C)})):e===2?a.push(s):a.push(function(S,C){return s.call(S,C)}):Object.defineProperty(o,l,i))}function v(a,o,c){for(var l=[],e,y,g=new Map,T=new Map,w=0;w<o.length;w++){var m=o[w];if(Array.isArray(m)){var i=m[1],f=m[2],s=m.length>3,d=i>=5,I,D;if(d?(I=a,i=i-5,y=y||[],D=y):(I=a.prototype,e=e||[],D=e),i!==0&&!s){var _=d?T:g,P=_.get(f)||0;if(P===!0||P===3&&i!==4||P===4&&i!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!P&&i>2?_.set(f,i):_.set(f,!0)}p(l,I,m,f,i,d,s,D,c)}}return b(l,e),b(l,y),l}function b(a,o){o&&a.push(function(c){for(var l=0;l<o.length;l++)o[l].call(c);return c})}function x(a,o,c){if(o.length>0){for(var l=[],e=a,y=a.name,g=o.length-1;g>=0;g--){var T={v:!1};try{var w=o[g](e,{kind:"class",name:y,addInitializer:h(l,T),metadata:c})}finally{T.v=!0}w!==void 0&&(u(10,w),e=w)}return[E(e,c),function(){for(var m=0;m<l.length;m++)l[m].call(e)}]}}function E(a,o){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,c,l,e){if(e!==void 0)var y=e[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(y===void 0?null:y),T=v(o,c,g);return l.length||E(o,g),{e:T,get c(){return x(o,l,g)}}}}function yi(h,t,r,n){return(yi=Ua())(h,t,r,n)}var bi,ii,wi,xi,Ti,Ii,Ci,Ei,Si,Di,_i,Pi,si,ai,li,ci,ui,di,hi,fi,mi,pi,gi,Xa;bi=W({selector:"potatno-panel-properties",template:ni,style:oi}),wi=V.state(),xi=V.state(),Ti=V.state(),Ii=V.state(),Ci=V.state(),Ei=V.state(),Si=V.state(),Di=V.state(),_i=V.state(),Pi=j("properties-change");var vi=class{static{({e:[si,ai,li,ci,ui,di,hi,fi,mi,pi,gi],c:[Xa,ii]}=yi(this,[[[B,wi],1,"functionName"],[[B,xi],1,"functionInputs"],[[B,Ti],1,"functionOutputs"],[Ii,1,"mFunctionImports"],[B,4,"functionImports"],[[B,Ci],1,"isSystem"],[[B,Ei],1,"editableByUser"],[Si,1,"mAvailableImports"],[B,4,"availableImports"],[Di,1,"mAvailableTypes"],[B,4,"availableTypes"],[_i,1,"mCachedUnusedImports"],[Pi,1,"mPropertiesChange"]],[bi]))}#t=(gi(this),si(this,""));get functionName(){return this.#t}set functionName(t){this.#t=t}#e=ai(this,[]);get functionInputs(){return this.#e}set functionInputs(t){this.#e=t}#r=li(this,[]);get functionOutputs(){return this.#r}set functionOutputs(t){this.#r=t}#o=ci(this,[]);get mFunctionImports(){return this.#o}set mFunctionImports(t){this.#o=t}set functionImports(t){this.mFunctionImports=t,this.rebuildUnusedImports()}get functionImports(){return this.mFunctionImports}#n=ui(this,!1);get isSystem(){return this.#n}set isSystem(t){this.#n=t}#i=di(this,!1);get editableByUser(){return this.#i}set editableByUser(t){this.#i=t}get nameDisabled(){return this.isSystem}get portsDisabled(){return this.isSystem&&!this.editableByUser}#s=hi(this,[]);get mAvailableImports(){return this.#s}set mAvailableImports(t){this.#s=t}set availableImports(t){this.mAvailableImports=t,this.rebuildUnusedImports()}get availableImports(){return this.mAvailableImports}#a=fi(this,[]);get mAvailableTypes(){return this.#a}set mAvailableTypes(t){this.#a=t}set availableTypes(t){this.mAvailableTypes=t}get availableTypes(){return this.mAvailableTypes}#l=mi(this,[]);get mCachedUnusedImports(){return this.#l}set mCachedUnusedImports(t){this.#l=t}mSelectedImport="";#c=pi(this);get mPropertiesChange(){return this.#c}set mPropertiesChange(t){this.#c=t}validateName(t){return/^[a-zA-Z][a-zA-Z0-9_]*$/.test(t)}isNameDuplicate(t,r,n){if(r!=="function"&&t===this.functionName)return!0;for(let u=0;u<this.functionInputs.length;u++)if(!(r==="input"&&u===n)&&this.functionInputs[u].name===t)return!0;for(let u=0;u<this.functionOutputs.length;u++)if(!(r==="output"&&u===n)&&this.functionOutputs[u].name===t)return!0;return!1}onNameChange(t){let r=t.target,n=r.value,u=!this.validateName(n)||this.isNameDuplicate(n,"function");r.style.borderColor=u?"var(--pn-accent-danger)":"",this.functionName=n,this.mPropertiesChange.dispatchEvent({name:n})}onInputNameChange(t,r){let n=r.target,u=n.value,p=!this.validateName(u)||this.isNameDuplicate(u,"input",t);n.style.borderColor=p?"var(--pn-accent-danger)":"";let v=[...this.functionInputs];v[t]={...v[t],name:u},this.functionInputs=v,this.mPropertiesChange.dispatchEvent({inputs:v})}onInputTypeChange(t,r){let n=r.target.value,u=[...this.functionInputs];u[t]={...u[t],type:n},this.functionInputs=u,this.mPropertiesChange.dispatchEvent({inputs:u})}onOutputNameChange(t,r){let n=r.target,u=n.value,p=!this.validateName(u)||this.isNameDuplicate(u,"output",t);n.style.borderColor=p?"var(--pn-accent-danger)":"";let v=[...this.functionOutputs];v[t]={...v[t],name:u},this.functionOutputs=v,this.mPropertiesChange.dispatchEvent({outputs:v})}onOutputTypeChange(t,r){let n=r.target.value,u=[...this.functionOutputs];u[t]={...u[t],type:n},this.functionOutputs=u,this.mPropertiesChange.dispatchEvent({outputs:u})}onAddInput(){let t=this.mAvailableTypes.length>0?this.mAvailableTypes[0]:"number",r=[...this.functionInputs,{name:"new_input",type:t}];this.functionInputs=r,this.mPropertiesChange.dispatchEvent({inputs:r})}onDeleteInput(t){let r=[...this.functionInputs];r.splice(t,1),this.functionInputs=r,this.mPropertiesChange.dispatchEvent({inputs:r})}onAddOutput(){let t=this.mAvailableTypes.length>0?this.mAvailableTypes[0]:"number",r=[...this.functionOutputs,{name:"new_output",type:t}];this.functionOutputs=r,this.mPropertiesChange.dispatchEvent({outputs:r})}onDeleteOutput(t){let r=[...this.functionOutputs];r.splice(t,1),this.functionOutputs=r,this.mPropertiesChange.dispatchEvent({outputs:r})}get unusedImports(){return this.mCachedUnusedImports}onImportSelectChange(t){this.mSelectedImport=t.target.value}onAddSelectedImport(){let t=this.mSelectedImport||(this.mCachedUnusedImports.length>0?this.mCachedUnusedImports[0]:"");if(!t)return;let r=[...this.mFunctionImports,t];this.functionImports=r,this.mSelectedImport="",this.mPropertiesChange.dispatchEvent({imports:r})}onDeleteImport(t){let r=[...this.mFunctionImports];r.splice(t,1),this.functionImports=r,this.mPropertiesChange.dispatchEvent({imports:r})}rebuildUnusedImports(){let t=new Set(this.mFunctionImports);this.mCachedUnusedImports=this.mAvailableImports.filter(r=>!t.has(r))}static{ii()}};var Ni=`:host {\r
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
`;var Ai=`<div class="resize-handle" (pointerdown)="this.onResizePointerDown($event)"></div>\r
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
`;function Wa(){function h(a,o){return function(l){r(o,"addInitializer"),n(l,"An initializer"),a.push(l)}}function t(a,o,c,l,e,y,g,T,w){var m;switch(e){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var i={kind:m,name:g?"#"+o:o,static:y,private:g,metadata:T},f={v:!1};i.addInitializer=h(l,f);var s,d;e===0?g?(s=c.get,d=c.set):(s=function(){return this[o]},d=function(I){this[o]=I}):e===2?s=function(){return c.value}:((e===1||e===3)&&(s=function(){return c.get.call(this)}),(e===1||e===4)&&(d=function(I){c.set.call(this,I)})),i.access=s&&d?{get:s,set:d}:s?{get:s}:{set:d};try{return a(w,i)}finally{f.v=!0}}function r(a,o){if(a.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(a,o){if(typeof a!="function")throw new TypeError(o+" must be a function")}function u(a,o){var c=typeof o;if(a===1){if(c!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(c!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function p(a,o,c,l,e,y,g,T,w){var m=c[0],i,f,s;g?e===0||e===1?i={get:c[3],set:c[4]}:e===3?i={get:c[3]}:e===4?i={set:c[3]}:i={value:c[3]}:e!==0&&(i=Object.getOwnPropertyDescriptor(o,l)),e===1?s={get:i.get,set:i.set}:e===2?s=i.value:e===3?s=i.get:e===4&&(s=i.set);var d,I,D;if(typeof m=="function")d=t(m,l,i,T,e,y,g,w,s),d!==void 0&&(u(e,d),e===0?f=d:e===1?(f=d.init,I=d.get||s.get,D=d.set||s.set,s={get:I,set:D}):s=d);else for(var _=m.length-1;_>=0;_--){var P=m[_];if(d=t(P,l,i,T,e,y,g,w,s),d!==void 0){u(e,d);var N;e===0?N=d:e===1?(N=d.init,I=d.get||s.get,D=d.set||s.set,s={get:I,set:D}):s=d,N!==void 0&&(f===void 0?f=N:typeof f=="function"?f=[f,N]:f.push(N))}}if(e===0||e===1){if(f===void 0)f=function(S,C){return C};else if(typeof f!="function"){var M=f;f=function(S,C){for(var L=C,O=0;O<M.length;O++)L=M[O].call(S,L);return L}}else{var $=f;f=function(S,C){return $.call(S,C)}}a.push(f)}e!==0&&(e===1?(i.get=s.get,i.set=s.set):e===2?i.value=s:e===3?i.get=s:e===4&&(i.set=s),g?e===1?(a.push(function(S,C){return s.get.call(S,C)}),a.push(function(S,C){return s.set.call(S,C)})):e===2?a.push(s):a.push(function(S,C){return s.call(S,C)}):Object.defineProperty(o,l,i))}function v(a,o,c){for(var l=[],e,y,g=new Map,T=new Map,w=0;w<o.length;w++){var m=o[w];if(Array.isArray(m)){var i=m[1],f=m[2],s=m.length>3,d=i>=5,I,D;if(d?(I=a,i=i-5,y=y||[],D=y):(I=a.prototype,e=e||[],D=e),i!==0&&!s){var _=d?T:g,P=_.get(f)||0;if(P===!0||P===3&&i!==4||P===4&&i!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!P&&i>2?_.set(f,i):_.set(f,!0)}p(l,I,m,f,i,d,s,D,c)}}return b(l,e),b(l,y),l}function b(a,o){o&&a.push(function(c){for(var l=0;l<o.length;l++)o[l].call(c);return c})}function x(a,o,c){if(o.length>0){for(var l=[],e=a,y=a.name,g=o.length-1;g>=0;g--){var T={v:!1};try{var w=o[g](e,{kind:"class",name:y,addInitializer:h(l,T),metadata:c})}finally{T.v=!0}w!==void 0&&(u(10,w),e=w)}return[E(e,c),function(){for(var m=0;m<l.length;m++)l[m].call(e)}]}}function E(a,o){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,c,l,e){if(e!==void 0)var y=e[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(y===void 0?null:y),T=v(o,c,g);return l.length||E(o,g),{e:T,get c(){return x(o,l,g)}}}}function Vi(h,t,r,n){return(Vi=Wa())(h,t,r,n)}var Bi,Li,$i,ji,Gi,Oi,Ri,Mi,Fi,Za;Bi=W({selector:"potatno-preview",template:Ai,style:Ni}),$i=ut("PreviewContent"),ji=ut("PreviewContainer"),Gi=V.state();var zi=class{static{({e:[Oi,Ri,Mi,Fi],c:[Za,Li]}=Vi(this,[[[B,$i],1,"contentElement"],[ji,1,"containerElement"],[[B,Gi],1,"errors"],[B,2,"getContainer"],[B,2,"setContent"]],[Bi]))}#t=(Fi(this),Oi(this));get contentElement(){return this.#t}set contentElement(t){this.#t=t}#e=Ri(this);get containerElement(){return this.#e}set containerElement(t){this.#e=t}#r=Mi(this,[]);get errors(){return this.#r}set errors(t){this.#r=t}get hasErrors(){return this.errors.length>0}mDragging=!1;mStartX=0;mStartY=0;mStartWidth=0;mStartHeight=0;getContainer(){return this.contentElement}setContent(t){let r=this.contentElement;for(;r.firstChild;)r.removeChild(r.firstChild);r.appendChild(t)}onResizePointerDown(t){t.preventDefault(),t.stopPropagation(),this.mDragging=!0,this.mStartX=t.clientX,this.mStartY=t.clientY;let r=this.containerElement;if(!r)return;this.mStartWidth=r.offsetWidth,this.mStartHeight=r.offsetHeight,t.target.setPointerCapture(t.pointerId);let n=p=>{if(!this.mDragging)return;let v=this.mStartX-p.clientX,b=this.mStartY-p.clientY,x=Math.max(200,this.mStartWidth+v),E=Math.max(150,this.mStartHeight+b);r.style.width=x+"px",r.style.height=E+"px"},u=p=>{this.mDragging=!1,p.target.releasePointerCapture(p.pointerId),document.removeEventListener("pointermove",n),document.removeEventListener("pointerup",u)};document.addEventListener("pointermove",n),document.addEventListener("pointerup",u)}static{Li()}};var Ui=`.resize-handle {\r
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
`;var Xi=`<div [className]="this.getHandleClass()" (pointerdown)="this.onPointerDown($event)"></div>\r
`;function Ja(){function h(a,o){return function(l){r(o,"addInitializer"),n(l,"An initializer"),a.push(l)}}function t(a,o,c,l,e,y,g,T,w){var m;switch(e){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var i={kind:m,name:g?"#"+o:o,static:y,private:g,metadata:T},f={v:!1};i.addInitializer=h(l,f);var s,d;e===0?g?(s=c.get,d=c.set):(s=function(){return this[o]},d=function(I){this[o]=I}):e===2?s=function(){return c.value}:((e===1||e===3)&&(s=function(){return c.get.call(this)}),(e===1||e===4)&&(d=function(I){c.set.call(this,I)})),i.access=s&&d?{get:s,set:d}:s?{get:s}:{set:d};try{return a(w,i)}finally{f.v=!0}}function r(a,o){if(a.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(a,o){if(typeof a!="function")throw new TypeError(o+" must be a function")}function u(a,o){var c=typeof o;if(a===1){if(c!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(c!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function p(a,o,c,l,e,y,g,T,w){var m=c[0],i,f,s;g?e===0||e===1?i={get:c[3],set:c[4]}:e===3?i={get:c[3]}:e===4?i={set:c[3]}:i={value:c[3]}:e!==0&&(i=Object.getOwnPropertyDescriptor(o,l)),e===1?s={get:i.get,set:i.set}:e===2?s=i.value:e===3?s=i.get:e===4&&(s=i.set);var d,I,D;if(typeof m=="function")d=t(m,l,i,T,e,y,g,w,s),d!==void 0&&(u(e,d),e===0?f=d:e===1?(f=d.init,I=d.get||s.get,D=d.set||s.set,s={get:I,set:D}):s=d);else for(var _=m.length-1;_>=0;_--){var P=m[_];if(d=t(P,l,i,T,e,y,g,w,s),d!==void 0){u(e,d);var N;e===0?N=d:e===1?(N=d.init,I=d.get||s.get,D=d.set||s.set,s={get:I,set:D}):s=d,N!==void 0&&(f===void 0?f=N:typeof f=="function"?f=[f,N]:f.push(N))}}if(e===0||e===1){if(f===void 0)f=function(S,C){return C};else if(typeof f!="function"){var M=f;f=function(S,C){for(var L=C,O=0;O<M.length;O++)L=M[O].call(S,L);return L}}else{var $=f;f=function(S,C){return $.call(S,C)}}a.push(f)}e!==0&&(e===1?(i.get=s.get,i.set=s.set):e===2?i.value=s:e===3?i.get=s:e===4&&(i.set=s),g?e===1?(a.push(function(S,C){return s.get.call(S,C)}),a.push(function(S,C){return s.set.call(S,C)})):e===2?a.push(s):a.push(function(S,C){return s.call(S,C)}):Object.defineProperty(o,l,i))}function v(a,o,c){for(var l=[],e,y,g=new Map,T=new Map,w=0;w<o.length;w++){var m=o[w];if(Array.isArray(m)){var i=m[1],f=m[2],s=m.length>3,d=i>=5,I,D;if(d?(I=a,i=i-5,y=y||[],D=y):(I=a.prototype,e=e||[],D=e),i!==0&&!s){var _=d?T:g,P=_.get(f)||0;if(P===!0||P===3&&i!==4||P===4&&i!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!P&&i>2?_.set(f,i):_.set(f,!0)}p(l,I,m,f,i,d,s,D,c)}}return b(l,e),b(l,y),l}function b(a,o){o&&a.push(function(c){for(var l=0;l<o.length;l++)o[l].call(c);return c})}function x(a,o,c){if(o.length>0){for(var l=[],e=a,y=a.name,g=o.length-1;g>=0;g--){var T={v:!1};try{var w=o[g](e,{kind:"class",name:y,addInitializer:h(l,T),metadata:c})}finally{T.v=!0}w!==void 0&&(u(10,w),e=w)}return[E(e,c),function(){for(var m=0;m<l.length;m++)l[m].call(e)}]}}function E(a,o){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,c,l,e){if(e!==void 0)var y=e[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(y===void 0?null:y),T=v(o,c,g);return l.length||E(o,g),{e:T,get c(){return x(o,l,g)}}}}function Ki(h,t,r,n){return(Ki=Ja())(h,t,r,n)}var Ji,Hi,Qi,ki,Yi,Wi,Zi,Qa;Ji=W({selector:"potatno-resize-handle",template:Xi,style:Ui}),Qi=V.state(),ki=j("resize");var qi=class{static{({e:[Yi,Wi,Zi],c:[Qa,Hi]}=Ki(this,[[[B,Qi],1,"direction"],[ki,1,"mResize"]],[Ji]))}#t=(Zi(this),Yi(this,"vertical"));get direction(){return this.#t}set direction(t){this.#t=t}#e=Wi(this);get mResize(){return this.#e}set mResize(t){this.#e=t}mDragging=!1;mStartPosition=0;getHandleClass(){return`resize-handle ${this.direction}`}onPointerDown(t){t.preventDefault(),this.mDragging=!0,this.mStartPosition=this.direction==="vertical"?t.clientX:t.clientY,t.target.setPointerCapture(t.pointerId);let r=u=>{if(!this.mDragging)return;let p=this.direction==="vertical"?u.clientX:u.clientY,v=p-this.mStartPosition;this.mStartPosition=p,this.mResize.dispatchEvent({delta:v})},n=u=>{this.mDragging=!1,u.target.releasePointerCapture(u.pointerId),document.removeEventListener("pointermove",r),document.removeEventListener("pointerup",n)};document.addEventListener("pointermove",r),document.addEventListener("pointerup",n)}static{Hi()}};var ts=`.search-wrapper {\r
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
`;var es=`<div class="search-wrapper">\r
    <svg class="search-icon" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">\r
        <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" stroke-width="1.5"/>\r
        <line x1="10.5" y1="10.5" x2="14.5" y2="14.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>\r
    </svg>\r
    <input class="search-field" type="text" [placeholder]="this.placeholder" [value]="this.value" (input)="this.onInput($event)"/>\r
</div>\r
`;function el(){function h(a,o){return function(l){r(o,"addInitializer"),n(l,"An initializer"),a.push(l)}}function t(a,o,c,l,e,y,g,T,w){var m;switch(e){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var i={kind:m,name:g?"#"+o:o,static:y,private:g,metadata:T},f={v:!1};i.addInitializer=h(l,f);var s,d;e===0?g?(s=c.get,d=c.set):(s=function(){return this[o]},d=function(I){this[o]=I}):e===2?s=function(){return c.value}:((e===1||e===3)&&(s=function(){return c.get.call(this)}),(e===1||e===4)&&(d=function(I){c.set.call(this,I)})),i.access=s&&d?{get:s,set:d}:s?{get:s}:{set:d};try{return a(w,i)}finally{f.v=!0}}function r(a,o){if(a.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(a,o){if(typeof a!="function")throw new TypeError(o+" must be a function")}function u(a,o){var c=typeof o;if(a===1){if(c!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(c!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function p(a,o,c,l,e,y,g,T,w){var m=c[0],i,f,s;g?e===0||e===1?i={get:c[3],set:c[4]}:e===3?i={get:c[3]}:e===4?i={set:c[3]}:i={value:c[3]}:e!==0&&(i=Object.getOwnPropertyDescriptor(o,l)),e===1?s={get:i.get,set:i.set}:e===2?s=i.value:e===3?s=i.get:e===4&&(s=i.set);var d,I,D;if(typeof m=="function")d=t(m,l,i,T,e,y,g,w,s),d!==void 0&&(u(e,d),e===0?f=d:e===1?(f=d.init,I=d.get||s.get,D=d.set||s.set,s={get:I,set:D}):s=d);else for(var _=m.length-1;_>=0;_--){var P=m[_];if(d=t(P,l,i,T,e,y,g,w,s),d!==void 0){u(e,d);var N;e===0?N=d:e===1?(N=d.init,I=d.get||s.get,D=d.set||s.set,s={get:I,set:D}):s=d,N!==void 0&&(f===void 0?f=N:typeof f=="function"?f=[f,N]:f.push(N))}}if(e===0||e===1){if(f===void 0)f=function(S,C){return C};else if(typeof f!="function"){var M=f;f=function(S,C){for(var L=C,O=0;O<M.length;O++)L=M[O].call(S,L);return L}}else{var $=f;f=function(S,C){return $.call(S,C)}}a.push(f)}e!==0&&(e===1?(i.get=s.get,i.set=s.set):e===2?i.value=s:e===3?i.get=s:e===4&&(i.set=s),g?e===1?(a.push(function(S,C){return s.get.call(S,C)}),a.push(function(S,C){return s.set.call(S,C)})):e===2?a.push(s):a.push(function(S,C){return s.call(S,C)}):Object.defineProperty(o,l,i))}function v(a,o,c){for(var l=[],e,y,g=new Map,T=new Map,w=0;w<o.length;w++){var m=o[w];if(Array.isArray(m)){var i=m[1],f=m[2],s=m.length>3,d=i>=5,I,D;if(d?(I=a,i=i-5,y=y||[],D=y):(I=a.prototype,e=e||[],D=e),i!==0&&!s){var _=d?T:g,P=_.get(f)||0;if(P===!0||P===3&&i!==4||P===4&&i!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!P&&i>2?_.set(f,i):_.set(f,!0)}p(l,I,m,f,i,d,s,D,c)}}return b(l,e),b(l,y),l}function b(a,o){o&&a.push(function(c){for(var l=0;l<o.length;l++)o[l].call(c);return c})}function x(a,o,c){if(o.length>0){for(var l=[],e=a,y=a.name,g=o.length-1;g>=0;g--){var T={v:!1};try{var w=o[g](e,{kind:"class",name:y,addInitializer:h(l,T),metadata:c})}finally{T.v=!0}w!==void 0&&(u(10,w),e=w)}return[E(e,c),function(){for(var m=0;m<l.length;m++)l[m].call(e)}]}}function E(a,o){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,c,l,e){if(e!==void 0)var y=e[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(y===void 0?null:y),T=v(o,c,g);return l.length||E(o,g),{e:T,get c(){return x(o,l,g)}}}}function ls(h,t,r,n){return(ls=el())(h,t,r,n)}var cs,rs,us,ds,hs,os,ns,is,ss,rl;cs=W({selector:"potatno-search-input",template:es,style:ts}),us=V.state(),ds=V.state(),hs=j("search-change");var as=class{static{({e:[os,ns,is,ss],c:[rl,rs]}=ls(this,[[[B,us],1,"placeholder"],[[B,ds],1,"value"],[hs,1,"mSearchChange"]],[cs]))}#t=(ss(this),os(this,"Search..."));get placeholder(){return this.#t}set placeholder(t){this.#t=t}#e=ns(this,"");get value(){return this.#e}set value(t){this.#e=t}#r=is(this);get mSearchChange(){return this.#r}set mSearchChange(t){this.#r=t}onInput(t){let r=t.target;this.value=r.value,this.mSearchChange.dispatchEvent(this.value)}static{rs()}};var fs=`.tabs-header {\r
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
`;var ms=`<div class="tabs-header">\r
    $for(tab of this.tabs; index = $index) {\r
        <button [className]="this.getTabClass(this.index)" (click)="this.onTabClick(this.index)">{{this.tab}}</button>\r
    }\r
</div>\r
<div class="tabs-content">\r
    $slot\r
</div>\r
`;function il(){function h(a,o){return function(l){r(o,"addInitializer"),n(l,"An initializer"),a.push(l)}}function t(a,o,c,l,e,y,g,T,w){var m;switch(e){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var i={kind:m,name:g?"#"+o:o,static:y,private:g,metadata:T},f={v:!1};i.addInitializer=h(l,f);var s,d;e===0?g?(s=c.get,d=c.set):(s=function(){return this[o]},d=function(I){this[o]=I}):e===2?s=function(){return c.value}:((e===1||e===3)&&(s=function(){return c.get.call(this)}),(e===1||e===4)&&(d=function(I){c.set.call(this,I)})),i.access=s&&d?{get:s,set:d}:s?{get:s}:{set:d};try{return a(w,i)}finally{f.v=!0}}function r(a,o){if(a.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(a,o){if(typeof a!="function")throw new TypeError(o+" must be a function")}function u(a,o){var c=typeof o;if(a===1){if(c!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(c!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function p(a,o,c,l,e,y,g,T,w){var m=c[0],i,f,s;g?e===0||e===1?i={get:c[3],set:c[4]}:e===3?i={get:c[3]}:e===4?i={set:c[3]}:i={value:c[3]}:e!==0&&(i=Object.getOwnPropertyDescriptor(o,l)),e===1?s={get:i.get,set:i.set}:e===2?s=i.value:e===3?s=i.get:e===4&&(s=i.set);var d,I,D;if(typeof m=="function")d=t(m,l,i,T,e,y,g,w,s),d!==void 0&&(u(e,d),e===0?f=d:e===1?(f=d.init,I=d.get||s.get,D=d.set||s.set,s={get:I,set:D}):s=d);else for(var _=m.length-1;_>=0;_--){var P=m[_];if(d=t(P,l,i,T,e,y,g,w,s),d!==void 0){u(e,d);var N;e===0?N=d:e===1?(N=d.init,I=d.get||s.get,D=d.set||s.set,s={get:I,set:D}):s=d,N!==void 0&&(f===void 0?f=N:typeof f=="function"?f=[f,N]:f.push(N))}}if(e===0||e===1){if(f===void 0)f=function(S,C){return C};else if(typeof f!="function"){var M=f;f=function(S,C){for(var L=C,O=0;O<M.length;O++)L=M[O].call(S,L);return L}}else{var $=f;f=function(S,C){return $.call(S,C)}}a.push(f)}e!==0&&(e===1?(i.get=s.get,i.set=s.set):e===2?i.value=s:e===3?i.get=s:e===4&&(i.set=s),g?e===1?(a.push(function(S,C){return s.get.call(S,C)}),a.push(function(S,C){return s.set.call(S,C)})):e===2?a.push(s):a.push(function(S,C){return s.call(S,C)}):Object.defineProperty(o,l,i))}function v(a,o,c){for(var l=[],e,y,g=new Map,T=new Map,w=0;w<o.length;w++){var m=o[w];if(Array.isArray(m)){var i=m[1],f=m[2],s=m.length>3,d=i>=5,I,D;if(d?(I=a,i=i-5,y=y||[],D=y):(I=a.prototype,e=e||[],D=e),i!==0&&!s){var _=d?T:g,P=_.get(f)||0;if(P===!0||P===3&&i!==4||P===4&&i!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!P&&i>2?_.set(f,i):_.set(f,!0)}p(l,I,m,f,i,d,s,D,c)}}return b(l,e),b(l,y),l}function b(a,o){o&&a.push(function(c){for(var l=0;l<o.length;l++)o[l].call(c);return c})}function x(a,o,c){if(o.length>0){for(var l=[],e=a,y=a.name,g=o.length-1;g>=0;g--){var T={v:!1};try{var w=o[g](e,{kind:"class",name:y,addInitializer:h(l,T),metadata:c})}finally{T.v=!0}w!==void 0&&(u(10,w),e=w)}return[E(e,c),function(){for(var m=0;m<l.length;m++)l[m].call(e)}]}}function E(a,o){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,c,l,e){if(e!==void 0)var y=e[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(y===void 0?null:y),T=v(o,c,g);return l.length||E(o,g),{e:T,get c(){return x(o,l,g)}}}}function xs(h,t,r,n){return(xs=il())(h,t,r,n)}var Ts,ps,Is,Cs,Es,gs,vs,ys,bs,sl;Ts=W({selector:"potatno-tabs",template:ms,style:fs}),Is=V.state(),Cs=V.state(),Es=j("tab-change");var ws=class{static{({e:[gs,vs,ys,bs],c:[sl,ps]}=xs(this,[[[B,Is],1,"tabs"],[[B,Cs],1,"activeIndex"],[Es,1,"mTabChange"]],[Ts]))}#t=(bs(this),gs(this,[]));get tabs(){return this.#t}set tabs(t){this.#t=t}#e=vs(this,0);get activeIndex(){return this.#e}set activeIndex(t){this.#e=t}#r=ys(this);get mTabChange(){return this.#r}set mTabChange(t){this.#r=t}getTabClass(t){return t===this.activeIndex?"tab-button active":"tab-button"}onTabClick(t){this.activeIndex=t,this.mTabChange.dispatchEvent(t)}static{ps()}};function al(){function h(a,o){return function(l){r(o,"addInitializer"),n(l,"An initializer"),a.push(l)}}function t(a,o,c,l,e,y,g,T,w){var m;switch(e){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var i={kind:m,name:g?"#"+o:o,static:y,private:g,metadata:T},f={v:!1};i.addInitializer=h(l,f);var s,d;e===0?g?(s=c.get,d=c.set):(s=function(){return this[o]},d=function(I){this[o]=I}):e===2?s=function(){return c.value}:((e===1||e===3)&&(s=function(){return c.get.call(this)}),(e===1||e===4)&&(d=function(I){c.set.call(this,I)})),i.access=s&&d?{get:s,set:d}:s?{get:s}:{set:d};try{return a(w,i)}finally{f.v=!0}}function r(a,o){if(a.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(a,o){if(typeof a!="function")throw new TypeError(o+" must be a function")}function u(a,o){var c=typeof o;if(a===1){if(c!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(c!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function p(a,o,c,l,e,y,g,T,w){var m=c[0],i,f,s;g?e===0||e===1?i={get:c[3],set:c[4]}:e===3?i={get:c[3]}:e===4?i={set:c[3]}:i={value:c[3]}:e!==0&&(i=Object.getOwnPropertyDescriptor(o,l)),e===1?s={get:i.get,set:i.set}:e===2?s=i.value:e===3?s=i.get:e===4&&(s=i.set);var d,I,D;if(typeof m=="function")d=t(m,l,i,T,e,y,g,w,s),d!==void 0&&(u(e,d),e===0?f=d:e===1?(f=d.init,I=d.get||s.get,D=d.set||s.set,s={get:I,set:D}):s=d);else for(var _=m.length-1;_>=0;_--){var P=m[_];if(d=t(P,l,i,T,e,y,g,w,s),d!==void 0){u(e,d);var N;e===0?N=d:e===1?(N=d.init,I=d.get||s.get,D=d.set||s.set,s={get:I,set:D}):s=d,N!==void 0&&(f===void 0?f=N:typeof f=="function"?f=[f,N]:f.push(N))}}if(e===0||e===1){if(f===void 0)f=function(S,C){return C};else if(typeof f!="function"){var M=f;f=function(S,C){for(var L=C,O=0;O<M.length;O++)L=M[O].call(S,L);return L}}else{var $=f;f=function(S,C){return $.call(S,C)}}a.push(f)}e!==0&&(e===1?(i.get=s.get,i.set=s.set):e===2?i.value=s:e===3?i.get=s:e===4&&(i.set=s),g?e===1?(a.push(function(S,C){return s.get.call(S,C)}),a.push(function(S,C){return s.set.call(S,C)})):e===2?a.push(s):a.push(function(S,C){return s.call(S,C)}):Object.defineProperty(o,l,i))}function v(a,o,c){for(var l=[],e,y,g=new Map,T=new Map,w=0;w<o.length;w++){var m=o[w];if(Array.isArray(m)){var i=m[1],f=m[2],s=m.length>3,d=i>=5,I,D;if(d?(I=a,i=i-5,y=y||[],D=y):(I=a.prototype,e=e||[],D=e),i!==0&&!s){var _=d?T:g,P=_.get(f)||0;if(P===!0||P===3&&i!==4||P===4&&i!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!P&&i>2?_.set(f,i):_.set(f,!0)}p(l,I,m,f,i,d,s,D,c)}}return b(l,e),b(l,y),l}function b(a,o){o&&a.push(function(c){for(var l=0;l<o.length;l++)o[l].call(c);return c})}function x(a,o,c){if(o.length>0){for(var l=[],e=a,y=a.name,g=o.length-1;g>=0;g--){var T={v:!1};try{var w=o[g](e,{kind:"class",name:y,addInitializer:h(l,T),metadata:c})}finally{T.v=!0}w!==void 0&&(u(10,w),e=w)}return[E(e,c),function(){for(var m=0;m<l.length;m++)l[m].call(e)}]}}function E(a,o){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,c,l,e){if(e!==void 0)var y=e[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(y===void 0?null:y),T=v(o,c,g);return l.length||E(o,g),{e:T,get c(){return x(o,l,g)}}}}function Fs(h,t,r,n){return(Fs=al())(h,t,r,n)}var zs,Ss,Vs,Bs,$s,js,Gs,Us,Xs,Ds,_s,Ps,Ns,As,Ls,Os,Rs,Ke;zs=W({selector:"potatno-code-editor",template:Yr,style:Hr}),Vs=V.state({complexValue:!0}),Bs=V.state(),$s=V.state(),js=ut("svgLayer"),Gs=ut("canvasWrapper"),Us=ut("panelLeft"),Xs=ut("panelRight");var Ms=class{static{({e:[Ds,_s,Ps,Ns,As,Ls,Os,Rs],c:[Ke,Ss]}=Fs(this,[[Vs,1,"mCachedData"],[Bs,1,"mShowSelectionBox"],[$s,1,"mTransformVersion"],[js,1,"svgLayer"],[Gs,1,"canvasWrapper"],[Us,1,"panelLeft"],[Xs,1,"panelRight"],[B,4,"project"],[B,4,"file"],[B,2,"loadCode"],[B,2,"generateCode"]],[zs]))}constructor(){this.mInternals={history:new $e,clipboard:new Be,interaction:new ze(20),renderer:new Ve,hoveredPort:null,interactionState:{mode:"idle"},previewInitialized:!1,previewElements:new Map,previewDataCache:new Map,entryPointPreviewElement:null,previewDirty:!0,cachedCodeResult:null},this.mCachedData={activeFunctionId:"",activeFunctionName:"",activeFunctionIsSystem:!1,activeFunctionEditableByUser:!1,errors:[],hasPreview:!1,nodeDefinitionList:[],functionList:[],availableImports:[],availableTypes:[],activeFunctionInputs:[],activeFunctionOutputs:[],activeFunctionImports:[],visibleNodes:[]},this.mSelectionBoxScreen={x1:0,y1:0,x2:0,y2:0},this.mPreviewDebounceTimer=0,this.mKeyboardHandler=null,this.mResizeState=null,this.mResizeMoveHandler=null,this.mResizeUpHandler=null}mProject;mFile;mSelectedIds=(Rs(this),new Set);mInternals;mSelectionBoxScreen;mPreviewDebounceTimer;mKeyboardHandler;mResizeState;mResizeMoveHandler;mResizeUpHandler;#t=Ds(this);get mCachedData(){return this.#t}set mCachedData(t){this.#t=t}#e=_s(this,!1);get mShowSelectionBox(){return this.#e}set mShowSelectionBox(t){this.#e=t}#r=Ps(this,0);get mTransformVersion(){return this.#r}set mTransformVersion(t){this.#r=t}#o=Ns(this);get svgLayer(){return this.#o}set svgLayer(t){this.#o=t}#n=As(this);get canvasWrapper(){return this.#n}set canvasWrapper(t){this.#n=t}#i=Ls(this);get panelLeft(){return this.#i}set panelLeft(t){this.#i=t}#s=Os(this);get panelRight(){return this.#s}set panelRight(t){this.#s=t}get project(){return this.mProject}set project(t){this.mProject=t,this.rebuildCachedData()}get file(){return this.mFile??null}set file(t){if(t){this.mFile=t;let r=this.mProject;r&&t.functions.size===0&&this.initializeMainFunctions(t,r)}else this.mFile=void 0;this.mSelectedIds.clear(),this.mInternals.history.clear(),this.mInternals.previewInitialized=!1,this.rebuildCachedData(),this.renderConnections(),this.initializePreview(),this.updatePreview()}get activeFunctionId(){return this.mCachedData.activeFunctionId}get interaction(){return this.mInternals.interaction}get showSelectionBox(){return this.mShowSelectionBox}get hasPreview(){return this.mCachedData.hasPreview}get editorErrors(){return this.mCachedData.errors}get gridBackgroundStyle(){return this.mTransformVersion,this.mInternals.interaction.getGridBackgroundCss()}get gridTransformStyle(){return this.mTransformVersion,"transform: "+this.mInternals.interaction.getTransformCss()}get selectionBoxStyle(){if(!this.mShowSelectionBox)return"display: none";let t=Math.min(this.mSelectionBoxScreen.x1,this.mSelectionBoxScreen.x2),r=Math.min(this.mSelectionBoxScreen.y1,this.mSelectionBoxScreen.y2),n=Math.abs(this.mSelectionBoxScreen.x2-this.mSelectionBoxScreen.x1),u=Math.abs(this.mSelectionBoxScreen.y2-this.mSelectionBoxScreen.y1);return`left: ${t}px; top: ${r}px; width: ${n}px; height: ${u}px`}get visibleNodes(){return this.mCachedData.visibleNodes}get nodeDefinitionList(){return this.mCachedData.nodeDefinitionList}get functionList(){return this.mCachedData.functionList}get activeFunctionName(){return this.mCachedData.activeFunctionName}get activeFunctionInputs(){return this.mCachedData.activeFunctionInputs}get activeFunctionOutputs(){return this.mCachedData.activeFunctionOutputs}get activeFunctionImports(){return this.mCachedData.activeFunctionImports}get activeFunctionIsSystem(){return this.mCachedData.activeFunctionIsSystem}get activeFunctionEditableByUser(){return this.mCachedData.activeFunctionEditableByUser}get availableImportsList(){return this.mCachedData.availableImports}get availableTypes(){return this.mCachedData.availableTypes}getPreviewElementForNode(t){return this.mInternals.previewElements.get(t)??null}loadCode(t){let r=this.mProject,u=new De(r).deserialize(t);this.mFile=u,this.mInternals.history.clear(),this.mSelectedIds.clear(),this.mInternals.previewInitialized=!1,this.rebuildCachedData(),this.renderConnections(),this.initializePreview(),this.updatePreview()}generateCode(){let t=this.mProject,r=this.mFile;return r?new Fe(t).serialize(r):""}onConnect(){this.mKeyboardHandler=t=>this.onKeyDown(t),document.addEventListener("keydown",this.mKeyboardHandler)}onDeconstruct(){this.mKeyboardHandler&&document.removeEventListener("keydown",this.mKeyboardHandler)}onNodeDragFromLibrary(t){let r=t.value??t.detail?.value??t,n=this.mProject,u=this.mFile;if(!u)return;let p=n.nodeDefinitions.get(r);if(!p){for(let e of u.functions.values())if(e.name===r&&!e.system){p=G.create({id:e.name,category:R.Function,inputs:{...e.inputs},outputs:{...e.outputs},codeGenerator:()=>""});break}}if(!p){let e=u.activeFunction;if(e){let y=new Set(e.imports);for(let g of n.imports)if(y.has(g.name)){for(let T of g.nodes)if(T.id===r){p=T;break}if(p)break}}}if(!p)return;let v=u.activeFunction?.graph;if(!v)return;let b=this.mInternals,x=this.canvasWrapper,E=x&&x.clientWidth||800,a=x&&x.clientHeight||600,o=b.interaction.screenToWorld(E/2,a/2),c=b.interaction.snapToGrid(o.x,o.y),l=new fe(v,p,{x:c.x/b.interaction.gridSize,y:c.y/b.interaction.gridSize});b.history.push(l),this.rebuildCachedData(),this.renderConnections(),this.updatePreview()}onFunctionSelect(t){let r=t.value??t.detail?.value??t,n=this.mFile;n&&(n.setActiveFunction(r),this.mSelectedIds.clear(),this.rebuildCachedData(),this.renderConnections())}onFunctionAdd(){let t=this.mFile;if(!t)return;let r=this.mCachedData.functionList.length,n=new Vt(crypto.randomUUID(),`function_${r}`,`Function ${r}`,!1);t.addFunction(n),t.setActiveFunction(n.id),this.mSelectedIds.clear(),this.rebuildCachedData(),this.renderConnections()}onFunctionDelete(t){let r=t.value??t.detail?.value??t,n=this.mFile;n&&(n.removeFunction(r),this.mSelectedIds.clear(),this.rebuildCachedData(),this.renderConnections(),this.updatePreview())}onPropertiesChange(t){let r=this.mFile;if(!r)return;let n=r.activeFunction;if(!n)return;let u=t.value??t.detail?.value??t;u.name!==void 0&&(n.setName(u.name),n.setLabel(u.name)),u.inputs!==void 0&&n.setInputs(u.inputs),u.outputs!==void 0&&n.setOutputs(u.outputs),u.imports!==void 0&&n.setImports(u.imports),n.graph.validate(),this.rebuildCachedData(),this.renderConnections(),this.updatePreview()}onCanvasPointerDown(t){let r=this.mInternals;if(t.button===1){t.preventDefault(),r.interactionState={mode:"panning",startX:t.clientX,startY:t.clientY},t.currentTarget.setPointerCapture(t.pointerId);return}if(t.button===0){t.ctrlKey||(this.mSelectedIds.clear(),this.rebuildCachedData());let n=this.canvasWrapper.getBoundingClientRect(),u=t.clientX-n.left,p=t.clientY-n.top;r.interactionState={mode:"selecting",startX:u,startY:p},this.mSelectionBoxScreen={x1:u,y1:p,x2:u,y2:p},this.mShowSelectionBox=!1,t.currentTarget.setPointerCapture(t.pointerId)}}onCanvasPointerMove(t){let r=this.mInternals,n=r.interactionState;if(n.mode==="panning"){let u=t.clientX-n.startX,p=t.clientY-n.startY;r.interaction.pan(u,p),n.startX=t.clientX,n.startY=t.clientY,this.mTransformVersion++,this.renderConnections();return}if(n.mode==="dragging-node"){let u=this.mFile;if(!u)return;let p=(t.clientX-n.startX)/r.interaction.zoom,v=(t.clientY-n.startY)/r.interaction.zoom;for(let b of n.origins){let x=b.originX+p,E=b.originY+v,a=r.interaction.snapToGrid(x,E),o=u.activeFunction?.graph.getNode(b.nodeId);o&&(o.moveTo(a.x/r.interaction.gridSize,a.y/r.interaction.gridSize),this.updateNodePosition(b.nodeId))}this.renderConnections();return}if(n.mode==="dragging-wire"){let u=this.canvasWrapper.getBoundingClientRect(),p=(t.clientX-u.left-r.interaction.panX)/r.interaction.zoom,v=(t.clientY-u.top-r.interaction.panY)/r.interaction.zoom;r.renderer.renderTempConnection(this.svgLayer,{x:n.startX,y:n.startY},{x:p,y:v},"#bac2de");return}if(n.mode==="selecting"){let u=this.canvasWrapper.getBoundingClientRect();this.mSelectionBoxScreen.x2=t.clientX-u.left,this.mSelectionBoxScreen.y2=t.clientY-u.top;let p=Math.abs(this.mSelectionBoxScreen.x2-this.mSelectionBoxScreen.x1),v=Math.abs(this.mSelectionBoxScreen.y2-this.mSelectionBoxScreen.y1);(p>5||v>5)&&(this.mShowSelectionBox=!0);return}if(n.mode==="resizing-comment"){let u=this.mFile;if(!u)return;let p=(t.clientX-n.startX)/r.interaction.zoom,v=(t.clientY-n.startY)/r.interaction.zoom,b=r.interaction.gridSize,x=n.originalW+Math.round(p/b),E=n.originalH+Math.round(v/b),a=u.activeFunction?.graph.getNode(n.nodeId);a&&(a.resizeTo(x,E),this.updateNodeSize(n.nodeId));return}}onCanvasPointerUp(t){let r=this.mInternals;if(r.interactionState.mode==="dragging-node"&&(this.rebuildCachedData(),this.renderConnections(),this.updatePreview()),r.interactionState.mode==="dragging-wire"&&(r.renderer.clearTempConnection(this.svgLayer),r.hoveredPort)){let n=r.hoveredPort;if(r.interactionState.direction!==n.direction&&r.interactionState.portKind===n.portKind){let p=this.mFile?.activeFunction?.graph;if(p){let v=r.interactionState.portKind==="data"?q.Data:q.Flow,b,x,E,a;r.interactionState.direction==="output"?(b=r.interactionState.sourceNodeId,x=r.interactionState.sourcePortId,E=n.nodeId,a=n.portId):(b=n.nodeId,x=n.portId,E=r.interactionState.sourceNodeId,a=r.interactionState.sourcePortId),p.addConnection(b,x,E,a,v),this.rebuildCachedData(),this.renderConnections(),this.updatePreview()}}}r.interactionState.mode==="selecting"&&(this.mShowSelectionBox=!1,this.selectNodesInBox()),r.interactionState.mode==="resizing-comment"&&this.rebuildCachedData(),r.interactionState={mode:"idle"},t.currentTarget.releasePointerCapture(t.pointerId)}onCanvasWheel(t){t.preventDefault();let r=this.canvasWrapper.getBoundingClientRect(),n=t.clientX-r.left,u=t.clientY-r.top;this.mInternals.interaction.zoomAt(n,u,t.deltaY>0?-.1:.1),this.mTransformVersion++,this.renderConnections()}onContextMenu(t){t.preventDefault();let r=t.target;if(r.hasAttribute?.("data-hit-area")){let n=r.getAttribute("data-connection-id");if(n){let p=this.mFile?.activeFunction?.graph;p&&(p.removeConnection(n),this.rebuildCachedData(),this.renderConnections(),this.updatePreview())}}}onNodePointerDown(t,r){let n=t.composedPath();for(let a of n)if(a.tagName?.toLowerCase()==="potatno-port")return;if(t.stopPropagation(),t.button!==0)return;let u=r.id,p=this.mInternals,v=this.mSelectedIds,b=this.mFile;if(!b)return;t.ctrlKey?v.has(u)?v.delete(u):v.add(u):v.has(u)||(v.clear(),v.add(u)),this.rebuildCachedData();let x=[],E=b.activeFunction?.graph;for(let a of v){let o=E?.getNode(a);o&&x.push({nodeId:a,originX:o.position.x*p.interaction.gridSize,originY:o.position.y*p.interaction.gridSize})}if(E){let a=E.getNode(u);if(a&&a.category===R.Comment){let o=p.interaction.gridSize,c=a.position.x*o,l=a.position.y*o,e=c+a.size.w*o,y=l+a.size.h*o;for(let g of E.nodes.values()){if(g.id===u||v.has(g.id)||g.category===R.Comment)continue;let T=g.position.x*o,w=g.position.y*o;T>=c&&T<=e&&w>=l&&w<=y&&x.push({nodeId:g.id,originX:T,originY:w})}}}x.length>0&&(p.interactionState={mode:"dragging-node",nodeId:u,startX:t.clientX,startY:t.clientY,origins:x},this.canvasWrapper.setPointerCapture(t.pointerId))}onPortDragStart(t){let r=t.value??t.detail?.value??t,u=this.mFile?.activeFunction?.graph;if(!u)return;let p=u.getNode(r.nodeId);if(!p)return;let v=this.mInternals,b=v.interaction.gridSize,x=p.position.x*b,E=p.position.y*b,a=p.size.w*b,o=28,c=24,l=4,e,y;if(r.portKind==="flow")e=r.direction==="output"?x+a:x,y=E+o/2;else{let g=0;if(r.direction==="output"){let T=0;for(let w of p.outputs.values()){if(w.id===r.portId){g=T;break}T++}e=x+a}else{let T=0;for(let w of p.inputs.values()){if(w.id===r.portId){g=T;break}T++}e=x}y=E+o+l+(g+.5)*c}v.interactionState={mode:"dragging-wire",sourceNodeId:r.nodeId,sourcePortId:r.portId,portKind:r.portKind,direction:r.direction,type:r.type,startX:e,startY:y}}onPortHover(t){let r=t.value??t.detail?.value??t;this.mInternals.hoveredPort={nodeId:r.nodeId,portId:r.portId,portKind:r.portKind,direction:r.direction,type:r.type}}onPortLeave(){this.mInternals.hoveredPort=null}onNodeResizeStart(t,r){let n=t.value??t.detail?.value??t,p=this.mFile?.activeFunction?.graph.getNode(n.nodeId);p&&(this.mInternals.interactionState={mode:"resizing-comment",nodeId:n.nodeId,startX:n.startX,startY:n.startY,originalW:p.size.w,originalH:p.size.h},this.canvasWrapper.setPointerCapture(t.pointerId??n.startX))}onCommentChange(t){let r=t.value??t.detail?.value??t,u=this.mFile?.activeFunction?.graph.getNode(r.nodeId);if(u){let p=new me(u,"comment",r.text);this.mInternals.history.push(p),this.rebuildCachedData()}}onValueChange(t){let r=t.value??t.detail?.value??t,u=this.mFile?.activeFunction?.graph.getNode(r.nodeId);if(u){let p=new me(u,r.property,r.value);this.mInternals.history.push(p),this.rebuildCachedData(),this.updatePreview()}}onKeyDown(t){if(t.key==="Delete"){this.deleteSelectedNodes();return}if(t.ctrlKey&&t.key==="z"){t.preventDefault(),this.mInternals.history.undo(),this.rebuildCachedData(),this.renderConnections(),this.updatePreview();return}if(t.ctrlKey&&(t.key==="y"||t.shiftKey&&t.key==="z")){t.preventDefault(),this.mInternals.history.redo(),this.rebuildCachedData(),this.renderConnections(),this.updatePreview();return}if(t.ctrlKey&&t.key==="c"){let n=this.mFile?.activeFunction?.graph;n&&this.mInternals.clipboard.copy(n,this.mSelectedIds);return}if(t.ctrlKey&&t.key==="v"){this.pasteFromClipboard();return}}onResizeLeftStart(t){t.preventDefault(),this.startPanelResize("left",t)}onResizeRightStart(t){t.preventDefault(),this.startPanelResize("right",t)}startPanelResize(t,r){let n=t==="left"?this.panelLeft:this.panelRight;this.mResizeState={panel:t,startX:r.clientX,startWidth:n.offsetWidth},this.mResizeMoveHandler=u=>{if(!this.mResizeState)return;let p=t==="left"?u.clientX-this.mResizeState.startX:this.mResizeState.startX-u.clientX,v=Math.max(200,Math.min(500,this.mResizeState.startWidth+p));n.style.width=`${v}px`},this.mResizeUpHandler=()=>{this.mResizeMoveHandler&&document.removeEventListener("pointermove",this.mResizeMoveHandler),this.mResizeUpHandler&&document.removeEventListener("pointerup",this.mResizeUpHandler),this.mResizeState=null},document.addEventListener("pointermove",this.mResizeMoveHandler),document.addEventListener("pointerup",this.mResizeUpHandler)}initializeMainFunctions(t,r){let n=r.entryPoint;if(!n)return;let u=new Vt(crypto.randomUUID(),n.id,"Main or something",!0,n.statics.inputs||n.statics.outputs),p=n.nodes.static;for(let b=0;b<p.length;b++){let x=p[b];u.graph.addNode(x,{x:2+b*12,y:2},!0),r.nodeDefinitions.has(x.id)||r.addNodeDefinition(x)}let v=n.nodes.dynamic;for(let b of v)r.nodeDefinitions.has(b.id)||r.addNodeDefinition(b);if(n.statics.imports)for(let b of r.imports)u.addImport(b.name);t.addFunction(u)}deleteSelectedNodes(){let r=this.mFile?.activeFunction?.graph;if(!r)return;let n=[];for(let u of this.mSelectedIds){let p=r.getNode(u);p&&!p.system&&n.push(new je(r,u))}n.length>0&&(this.mInternals.history.push(new he("Delete nodes",n)),this.mSelectedIds.clear(),this.rebuildCachedData(),this.renderConnections(),this.updatePreview())}pasteFromClipboard(){let t=this.mInternals,r=t.clipboard.getData();if(!r)return;let n=this.mProject,p=this.mFile?.activeFunction?.graph;if(!p)return;let v=[],b=[];for(let x of r.nodes){let E=n.nodeDefinitions.get(x.definitionName);if(E){let a=new fe(p,E,{x:x.position.x+2,y:x.position.y+2});v.push(a),b.push(a)}}if(v.length>0){t.history.push(new he("Paste nodes",v));for(let x=0;x<b.length;x++){let E=b[x].node,a=r.nodes[x];if(E&&a.properties)for(let[o,c]of Object.entries(a.properties))E.properties.set(o,c)}for(let x of r.internalConnections){let E=b[x.sourceNodeIndex]?.node??null,a=b[x.targetNodeIndex]?.node??null;if(E&&a){let o="",c="",l=x.kind==="flow"?q.Flow:q.Data;if(l===q.Data){for(let[e,y]of E.outputs)if(e===x.sourcePortName){o=y.id;break}for(let[e,y]of a.inputs)if(e===x.targetPortName){c=y.id;break}}else{for(let[e,y]of E.flowOutputs)if(e===x.sourcePortName){o=y.id;break}for(let[e,y]of a.flowInputs)if(e===x.targetPortName){c=y.id;break}}o&&c&&p.addConnection(E.id,o,a.id,c,l)}}this.mSelectedIds.clear();for(let x of b)x.node&&this.mSelectedIds.add(x.node.id);this.rebuildCachedData(),this.renderConnections(),this.updatePreview()}}selectNodesInBox(){let r=this.mFile?.activeFunction?.graph;if(!r)return;let n=this.mInternals,u=n.interaction.screenToWorld(Math.min(this.mSelectionBoxScreen.x1,this.mSelectionBoxScreen.x2),Math.min(this.mSelectionBoxScreen.y1,this.mSelectionBoxScreen.y2)),p=n.interaction.screenToWorld(Math.max(this.mSelectionBoxScreen.x1,this.mSelectionBoxScreen.x2),Math.max(this.mSelectionBoxScreen.y1,this.mSelectionBoxScreen.y2)),v=n.interaction.gridSize;for(let b of r.nodes.values()){let x=b.position.x*v,E=b.position.y*v,a=x+b.size.w*v,o=E+b.size.h*v;x<p.x&&a>u.x&&E<p.y&&o>u.y&&this.mSelectedIds.add(b.id)}this.rebuildCachedData()}renderConnections(){if(!this.svgLayer)return;let r=this.mFile?.activeFunction?.graph;if(!r){this.mInternals.renderer.clearAll(this.svgLayer);return}let n=this.mInternals,u=n.interaction.gridSize,p=28,v=24,b=4,x=[];for(let E of r.connections.values()){let a=r.getNode(E.sourceNodeId),o=r.getNode(E.targetNodeId);if(!a||!o)continue;let c=a.position.x*u,l=a.position.y*u,e=o.position.x*u,y=o.position.y*u,g=a.size.w*u,T,w,m,i;if(E.kind===q.Data){let f=0,s=0;for(let I of a.outputs.values()){if(I.id===E.sourcePortId){f=s;break}s++}let d=0;s=0;for(let I of o.inputs.values()){if(I.id===E.targetPortId){d=s;break}s++}T=c+g,w=l+p+b+(f+.5)*v,m=e,i=y+p+b+(d+.5)*v}else T=c+g,w=l+p/2,m=e,i=y+p/2;x.push({id:E.id,sourceX:T,sourceY:w,targetX:m,targetY:i,color:E.valid?"var(--pn-text-secondary)":"var(--pn-accent-danger)",valid:E.valid})}n.renderer.renderConnections(this.svgLayer,x)}initializePreview(){let t=this.mProject;if(!t)return;let r=t.entryPoint.preview;if(!r)return;let n=this.mInternals;if(n.previewInitialized)return;let u=r.generatePreview();n.entryPointPreviewElement=u;let p=this.previewEl;p&&typeof p.getContainer=="function"&&(p.getContainer().appendChild(u),n.previewInitialized=!0)}updatePreview(){!this.mProject||!this.mFile||(this.mInternals.previewDirty=!0,clearTimeout(this.mPreviewDebounceTimer),this.mPreviewDebounceTimer=setTimeout(()=>{this.evaluatePreview({})},300))}updateNodePosition(t){let n=this.mFile?.activeFunction?.graph.getNode(t);if(!n)return;let u=this.mInternals.interaction.gridSize;for(let p of this.mCachedData.visibleNodes)if(p.id===t){p.position={x:n.position.x,y:n.position.y},p.pixelX=n.position.x*u,p.pixelY=n.position.y*u;break}this.mCachedData=this.mCachedData}updateNodeSize(t){let n=this.mFile?.activeFunction?.graph.getNode(t);if(n){for(let u of this.mCachedData.visibleNodes)if(u.id===t){u.size={w:n.size.w,h:n.size.h};break}this.mCachedData=this.mCachedData}}validateProject(){let t=[],r=this.mFile;if(!r)return t;let n=/^[a-zA-Z][a-zA-Z0-9_]*$/,u=new Set;for(let v of r.functions.values()){u.has(v.name)&&t.push({message:`Duplicate function name "${v.name}".`,location:`Function "${v.name}"`}),u.add(v.name),n.test(v.name)||t.push({message:`Invalid function name "${v.name}". Must start with a letter and contain only letters, digits, and underscores.`,location:`Function "${v.name}"`});let b=new Set;for(let x of Object.keys(v.inputs))n.test(x)||t.push({message:`Invalid input name "${x}".`,location:`Function "${v.name}" > Inputs`}),b.has(x)&&t.push({message:`Duplicate input/output name "${x}".`,location:`Function "${v.name}" > Inputs`}),b.add(x);for(let x of Object.keys(v.outputs))n.test(x)||t.push({message:`Invalid output name "${x}".`,location:`Function "${v.name}" > Outputs`}),b.has(x)&&t.push({message:`Duplicate input/output name "${x}".`,location:`Function "${v.name}" > Outputs`}),b.add(x)}let p=r.activeFunction;if(!p)return t.push({message:"No active function selected.",location:"Editor"}),t;for(let v of p.graph.nodes.values())for(let b of v.inputs.values())!b.connectedTo&&!v.system&&t.push({message:`Input "${b.name}" on node "${v.definitionId}" is not connected.`,location:`Function "${p.name}" > Node "${v.definitionId}"`,blocking:!1});for(let v of p.graph.connections.values())v.valid||t.push({message:"Type mismatch on connection.",location:`Function "${p.name}"`});return t}rebuildCachedData(){let t=this.mProject,r=this.mFile,n=new Map(this.mCachedData.visibleNodes.map(E=>[E.id,E])),u={activeFunctionId:"",activeFunctionName:"",activeFunctionIsSystem:!1,activeFunctionEditableByUser:!1,errors:[],hasPreview:!1,nodeDefinitionList:[],functionList:[],availableImports:[],availableTypes:[],activeFunctionInputs:[],activeFunctionOutputs:[],activeFunctionImports:[],visibleNodes:[]};u.activeFunctionId=r?.activeFunctionId??"",u.hasPreview=!!t?.entryPoint.preview,u.errors=this.validateProject();let p=[];if(t)for(let E of t.nodeDefinitions.values())p.push({name:E.id,category:E.category});if(r)for(let E of r.functions.values())E.system||p.push({name:E.name,category:R.Function});u.nodeDefinitionList=p;let v=[];if(r)for(let E of r.functions.values())v.push({id:E.id,name:E.name,label:E.label,system:E.system});if(u.functionList=v,t&&r){let E=r.activeFunction;if(E){let a=new Set(E.imports);for(let o of t.imports)if(a.has(o.name))for(let c of o.nodes)p.push({name:c.id,category:c.category})}}u.availableImports=t?.imports.map(E=>E.name)??[];let b=new Set;if(t)for(let E of t.nodeDefinitions.values()){let a=E;for(let o of Object.values(a.inputs))(o.nodeType==="value"||o.nodeType==="input")&&b.add(o.dataType);for(let o of Object.values(a.outputs))(o.nodeType==="value"||o.nodeType==="input")&&b.add(o.dataType)}u.availableTypes=[...b].sort();let x=r?.activeFunction;if(u.activeFunctionName=x?.name??"",u.activeFunctionIsSystem=x?.system??!1,u.activeFunctionEditableByUser=x?.editableByUser??!1,u.activeFunctionInputs=x?Object.entries(x.inputs).map(([E,a])=>({name:E,type:a.nodeType==="value"||a.nodeType==="input"?a.dataType:""})):[],u.activeFunctionOutputs=x?Object.entries(x.outputs).map(([E,a])=>({name:E,type:a.nodeType==="value"||a.nodeType==="input"?a.dataType:""})):[],u.activeFunctionImports=[...x?.imports??[]],x){let E=new Set,a=new Set;for(let c of x.graph.connections.values())E.add(c.sourcePortId),a.add(c.sourcePortId),a.add(c.targetPortId);let o=[];for(let c of x.graph.nodes.values()){let l=t?.nodeDefinitions.get(c.definitionId),e=jt.get(c.category),y=[];for(let i of c.inputs.values())y.push({id:i.id,name:i.name,type:i.type,direction:i.direction,connectedTo:i.connectedTo});let g=[];for(let i of c.outputs.values()){let f=E.has(i.id);g.push({id:i.id,name:i.name,type:i.type,direction:i.direction,connectedTo:f?"connected":null})}let T=[];for(let i of c.flowInputs.values())T.push({id:i.id,name:i.name,direction:i.direction,connectedTo:a.has(i.id)?"connected":null});let w=[];for(let i of c.flowOutputs.values())w.push({id:i.id,name:i.name,direction:i.direction,connectedTo:a.has(i.id)?"connected":null});let m={id:c.id,definitionName:c.definitionId,category:c.category,categoryColor:e.cssColor,categoryIcon:e.icon,label:c.definitionId,position:{x:c.position.x,y:c.position.y},size:{w:c.size.w,h:c.size.h},system:c.system,selected:this.mSelectedIds.has(c.id),inputs:y,outputs:g,flowInputs:T,flowOutputs:w,valueText:c.properties.get("value")??"",commentText:c.properties.get("comment")??"",hasDefinition:!!l,pixelX:c.position.x*this.mInternals.interaction.gridSize,pixelY:c.position.y*this.mInternals.interaction.gridSize};o.push(this.reuseNodeRenderData(n.get(c.id),m)),this.getOrCreatePreviewElement(c.id,l)}u.visibleNodes=o}this.mCachedData=u}reuseNodeRenderData(t,r){return!t||t.definitionName!==r.definitionName||t.category!==r.category||t.categoryColor!==r.categoryColor||t.categoryIcon!==r.categoryIcon||t.label!==r.label||t.system!==r.system||t.selected!==r.selected||t.hasDefinition!==r.hasDefinition||t.valueText!==r.valueText||t.commentText!==r.commentText||t.pixelX!==r.pixelX||t.pixelY!==r.pixelY||t.position.x!==r.position.x||t.position.y!==r.position.y||t.size.w!==r.size.w||t.size.h!==r.size.h||!this.areDataPortsEqual(t.inputs,r.inputs)||!this.areDataPortsEqual(t.outputs,r.outputs)||!this.areFlowPortsEqual(t.flowInputs,r.flowInputs)||!this.areFlowPortsEqual(t.flowOutputs,r.flowOutputs)?r:t}areDataPortsEqual(t,r){if(t.length!==r.length)return!1;for(let n=0;n<t.length;n++){let u=t[n],p=r[n];if(u.id!==p.id||u.name!==p.name||u.type!==p.type||u.direction!==p.direction||u.connectedTo!==p.connectedTo)return!1}return!0}areFlowPortsEqual(t,r){if(t.length!==r.length)return!1;for(let n=0;n<t.length;n++){let u=t[n],p=r[n];if(u.id!==p.id||u.name!==p.name||u.direction!==p.direction||u.connectedTo!==p.connectedTo)return!1}return!0}getOrCreatePreviewElement(t,r){if(!r?.preview)return null;let n=this.mInternals,u=n.previewElements.get(t);if(u)return u;let p=r.preview.generatePreview();return p instanceof HTMLElement?(n.previewElements.set(t,p),p):null}evaluatePreview(t){let r=this.mProject,n=this.mFile,u=this.mInternals;if(!r||!n||!u.previewDirty||(u.previewDirty=!1,this.mCachedData.errors.some(c=>c.blocking!==!1)))return null;let b;for(let c of n.functions.values())if(c.system){b=c;break}if(!b)return null;let x=new Set,E=b.graph;for(let c of E.nodes.values())r.nodeDefinitions.get(c.definitionId)?.preview&&x.add(c.id);let a;try{a=new Bt(r).generateFunctionCodeWithIntermediates(b,x)}catch{return null}u.cachedCodeResult=a;let o=r.entryPoint.preview;if(o&&u.entryPointPreviewElement)try{o.updatePreview(u.entryPointPreviewElement,a.codeFunction,t,a.fullCode)}catch{}for(let[c,l]of a.nodeIntermediates){let e=u.previewElements.get(c);if(!e)continue;let y=E.getNode(c);if(!y)continue;let g=r.nodeDefinitions.get(y.definitionId);if(g?.preview)try{g.preview.updatePreview(e,l.context,l.codeFunction,t,l.intermediateCode)}catch{}}return null}static{Ss()}};var Hs=`:host {\r
    display: block;\r
    width: 100%;\r
    height: 100%;\r
}\r
\r
potatno-code-editor {\r
    display: block;\r
    width: 100%;\r
    height: 100%;\r
}`;var Ys=`:host {\r
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
`;var Ge=class extends Kt{mCodeEditor;mProject;get file(){return this.mCodeEditor.file}set file(t){this.mCodeEditor.file=t}get project(){return this.mProject}constructor(t){super(),this.mProject=t,this.addStyle(Ys),this.addStyle(Hs),this.mCodeEditor=this.addContent(Ke),this.mCodeEditor.project=t}update(t){return this.mCodeEditor.evaluatePreview(t)}};var Ue=class h{static create(t){return new h(t)}mId;mPreview;mStatics;mNodes;mCodeGenerator;get id(){return this.mId}get codeGenerator(){return this.mCodeGenerator}get nodes(){return this.mNodes}get preview(){return this.mPreview}get statics(){return this.mStatics}constructor(t){this.mId=t.id,this.mNodes={static:t.nodes?.static??[],dynamic:t.nodes?.dynamic??[]},this.mPreview=t.preview??null,this.mStatics={imports:t.statics.imports??!1,inputs:t.statics.inputs??!1,outputs:t.statics.outputs??!1},this.mCodeGenerator=t.codeGenerator}};var Xe=class{mCommentToken;mImports;mEntryPoint;mNodeDefinitions;mValidTypes;get commentToken(){return this.mCommentToken}get imports(){return this.mImports}get entryPoint(){return this.mEntryPoint}get nodeDefinitions(){return this.mNodeDefinitions}constructor(t){this.mCommentToken=t.commentToken,this.mValidTypes=new Map;for(let[r,n]of Object.entries(t.types))this.mValidTypes.set(r,n);this.mNodeDefinitions=new Map,this.mImports=new Array,this.mEntryPoint=t.entryPoint}addImport(t){this.mImports.push(t)}addNodeDefinition(t){this.mNodeDefinitions.set(t.id,t)}hasType(t){return this.mValidTypes.has(t)}};(()=>{let h=new WebSocket("ws://127.0.0.1:8088");h.addEventListener("open",()=>{console.log("Refresh connection established")}),h.addEventListener("message",t=>{console.log("Bundle finished. Start refresh"),t.data==="REFRESH"&&window.location.reload()})})();var ul={number:0,string:"",boolean:!1},H=new Xe({commentToken:"//",types:ul,entryPoint:Ue.create({id:"pixelShader",statics:{imports:!0,inputs:!0,outputs:!1},nodes:{static:[G.create({id:"OnPixel",category:R.Event,inputs:{},outputs:{x:{nodeType:"value",dataType:"number"},y:{nodeType:"value",dataType:"number"}},codeGenerator:h=>`const ${h.outputs.x.valueId} = __pixel_x;
const ${h.outputs.y.valueId} = __pixel_y;`}),G.create({id:"PixelResult",category:R.Output,inputs:{red:{nodeType:"value",dataType:"number"},green:{nodeType:"value",dataType:"number"},blue:{nodeType:"value",dataType:"number"}},outputs:{},codeGenerator:h=>`__pixel_r = ${h.inputs.red.valueId};
__pixel_g = ${h.inputs.green.valueId};
__pixel_b = ${h.inputs.blue.valueId};`})]},codeGenerator:h=>{let t=h.inputs.map(n=>n.valueId).join(", "),r=t?`__pixel_x, __pixel_y, ${t}`:"__pixel_x, __pixel_y";return`function ${h.name}(${r}) {
let __pixel_r = 0, __pixel_g = 0, __pixel_b = 0;
${h.bodyCode}
return [__pixel_r, __pixel_g, __pixel_b];
}`},preview:{generatePreview:()=>{let h=document.createElement("canvas");return h.width=100,h.height=100,h.style.cssText="width: 100px; height: 100px; image-rendering: pixelated; background: #000;",h},updatePreview:(h,t,r,n)=>{let u=h.getContext("2d"),p=u.createImageData(h.width,h.height),v=Function(n+`
return `+t.name+";")();for(let b=0;b<p.height;b++)for(let x=0;x<p.width;x++){let E=v(x/p.width,b/p.height),a=(b*p.width+x)*4;p.data[a]=Math.max(0,Math.min(255,Math.round(E[0]*255))),p.data[a+1]=Math.max(0,Math.min(255,Math.round(E[1]*255))),p.data[a+2]=Math.max(0,Math.min(255,Math.round(E[2]*255))),p.data[a+3]=255}u.putImageData(p,0,0)}}})});H.addImport({name:"Math",nodes:[G.create({id:"Math.PI",category:R.Value,inputs:{},outputs:{value:{nodeType:"value",dataType:"number"}},codeGenerator:h=>`const ${h.outputs.value.valueId} = Math.PI;`}),G.create({id:"Math.E",category:R.Value,inputs:{},outputs:{value:{nodeType:"value",dataType:"number"}},codeGenerator:h=>`const ${h.outputs.value.valueId} = Math.E;`}),G.create({id:"Math.abs",category:R.Function,inputs:{value:{nodeType:"value",dataType:"number"}},outputs:{result:{nodeType:"value",dataType:"number"}},codeGenerator:h=>`const ${h.outputs.result.valueId} = Math.abs(${h.inputs.value.valueId});`}),G.create({id:"Math.floor",category:R.Function,inputs:{value:{nodeType:"value",dataType:"number"}},outputs:{result:{nodeType:"value",dataType:"number"}},codeGenerator:h=>`const ${h.outputs.result.valueId} = Math.floor(${h.inputs.value.valueId});`}),G.create({id:"Math.random",category:R.Function,inputs:{},outputs:{result:{nodeType:"value",dataType:"number"}},codeGenerator:h=>`const ${h.outputs.result.valueId} = Math.random();`})]});H.addNodeDefinition(G.create({id:"Number Literal",category:R.Value,inputs:{},outputs:{value:{nodeType:"input",inputType:"number",dataType:"number"}},codeGenerator:h=>`const ${h.outputs.value.valueId} = ${h.outputs.value.value};`}));H.addNodeDefinition(G.create({id:"String Literal",category:R.Value,inputs:{},outputs:{value:{nodeType:"input",inputType:"string",dataType:"string"}},codeGenerator:h=>`const ${h.outputs.value.valueId} = "${h.outputs.value.value}";`}));H.addNodeDefinition(G.create({id:"Boolean Literal",category:R.Value,inputs:{},outputs:{value:{nodeType:"input",inputType:"boolean",dataType:"boolean"}},codeGenerator:h=>`const ${h.outputs.value.valueId} = ${h.outputs.value.value?"true":"false"};`}));H.addNodeDefinition(G.create({id:"Add",category:R.Operator,inputs:{a:{nodeType:"value",dataType:"number"},b:{nodeType:"value",dataType:"number"}},outputs:{result:{nodeType:"value",dataType:"number"}},codeGenerator:h=>`const ${h.outputs.result.valueId} = ${h.inputs.a.valueId} + ${h.inputs.b.valueId};`}));H.addNodeDefinition(G.create({id:"Subtract",category:R.Operator,inputs:{a:{nodeType:"value",dataType:"number"},b:{nodeType:"value",dataType:"number"}},outputs:{result:{nodeType:"value",dataType:"number"}},codeGenerator:h=>`const ${h.outputs.result.valueId} = ${h.inputs.a.valueId} - ${h.inputs.b.valueId};`}));H.addNodeDefinition(G.create({id:"Multiply",category:R.Operator,inputs:{a:{nodeType:"value",dataType:"number"},b:{nodeType:"value",dataType:"number"}},outputs:{result:{nodeType:"value",dataType:"number"}},codeGenerator:h=>`const ${h.outputs.result.valueId} = ${h.inputs.a.valueId} * ${h.inputs.b.valueId};/*MULTIPLYHOOK_${h.outputs.result.valueId}*/`,preview:{generatePreview:()=>{let h=document.createElement("canvas");return h.width=50,h.height=50,h.style.cssText="width: 50px; height: 50px; image-rendering: pixelated; border: 1px solid rgba(255,255,255,0.1); border-radius: 2px;",h},updatePreview:(h,t,r,n,u)=>{let p=h.getContext("2d"),v=p.createImageData(h.width,h.height),b=u.replace(`/*MULTIPLYHOOK_${t.outputs.result.valueId}*/`,`return ${t.outputs.result.valueId};`),x=Function(b+`
return `+r.name+";")();for(let E=0;E<v.height;E++)for(let a=0;a<v.width;a++){let o=x(a/v.width,E/v.height),c=(E*v.width+a)*4;v.data[c]=Math.max(0,Math.min(255,Math.round(o*255))),v.data[c+1]=Math.max(0,Math.min(255,Math.round(o*255))),v.data[c+2]=Math.max(0,Math.min(255,Math.round(o*255))),v.data[c+3]=255}p.putImageData(v,0,0)}}}));H.addNodeDefinition(G.create({id:"Divide",category:R.Operator,inputs:{a:{nodeType:"value",dataType:"number"},b:{nodeType:"value",dataType:"number"}},outputs:{result:{nodeType:"value",dataType:"number"}},codeGenerator:h=>`const ${h.outputs.result.valueId} = ${h.inputs.a.valueId} / ${h.inputs.b.valueId};`}));H.addNodeDefinition(G.create({id:"Modulo",category:R.Operator,inputs:{a:{nodeType:"value",dataType:"number"},b:{nodeType:"value",dataType:"number"}},outputs:{result:{nodeType:"value",dataType:"number"}},codeGenerator:h=>`const ${h.outputs.result.valueId} = ${h.inputs.a.valueId} % ${h.inputs.b.valueId};`}));H.addNodeDefinition(G.create({id:"Equal",category:R.Operator,inputs:{a:{nodeType:"value",dataType:"number"},b:{nodeType:"value",dataType:"number"}},outputs:{result:{nodeType:"value",dataType:"boolean"}},codeGenerator:h=>`const ${h.outputs.result.valueId} = ${h.inputs.a.valueId} === ${h.inputs.b.valueId};`}));H.addNodeDefinition(G.create({id:"Not Equal",category:R.Operator,inputs:{a:{nodeType:"value",dataType:"number"},b:{nodeType:"value",dataType:"number"}},outputs:{result:{nodeType:"value",dataType:"boolean"}},codeGenerator:h=>`const ${h.outputs.result.valueId} = ${h.inputs.a.valueId} !== ${h.inputs.b.valueId};`}));H.addNodeDefinition(G.create({id:"Less Than",category:R.Operator,inputs:{a:{nodeType:"value",dataType:"number"},b:{nodeType:"value",dataType:"number"}},outputs:{result:{nodeType:"value",dataType:"boolean"}},codeGenerator:h=>`const ${h.outputs.result.valueId} = ${h.inputs.a.valueId} < ${h.inputs.b.valueId};`}));H.addNodeDefinition(G.create({id:"Greater Than",category:R.Operator,inputs:{a:{nodeType:"value",dataType:"number"},b:{nodeType:"value",dataType:"number"}},outputs:{result:{nodeType:"value",dataType:"boolean"}},codeGenerator:h=>`const ${h.outputs.result.valueId} = ${h.inputs.a.valueId} > ${h.inputs.b.valueId};`}));H.addNodeDefinition(G.create({id:"And",category:R.Operator,inputs:{a:{nodeType:"value",dataType:"boolean"},b:{nodeType:"value",dataType:"boolean"}},outputs:{result:{nodeType:"value",dataType:"boolean"}},codeGenerator:h=>`const ${h.outputs.result.valueId} = ${h.inputs.a.valueId} && ${h.inputs.b.valueId};`}));H.addNodeDefinition(G.create({id:"Or",category:R.Operator,inputs:{a:{nodeType:"value",dataType:"boolean"},b:{nodeType:"value",dataType:"boolean"}},outputs:{result:{nodeType:"value",dataType:"boolean"}},codeGenerator:h=>`const ${h.outputs.result.valueId} = ${h.inputs.a.valueId} || ${h.inputs.b.valueId};`}));H.addNodeDefinition(G.create({id:"Not",category:R.Operator,inputs:{a:{nodeType:"value",dataType:"boolean"}},outputs:{result:{nodeType:"value",dataType:"boolean"}},codeGenerator:h=>`const ${h.outputs.result.valueId} = !${h.inputs.a.valueId};`}));H.addNodeDefinition(G.create({id:"Number to String",category:R.TypeConversion,inputs:{input:{nodeType:"value",dataType:"number"}},outputs:{output:{nodeType:"value",dataType:"string"}},codeGenerator:h=>`const ${h.outputs.output.valueId} = String(${h.inputs.input.valueId});`}));H.addNodeDefinition(G.create({id:"String to Number",category:R.TypeConversion,inputs:{input:{nodeType:"value",dataType:"string"}},outputs:{output:{nodeType:"value",dataType:"number"}},codeGenerator:h=>`const ${h.outputs.output.valueId} = Number(${h.inputs.input.valueId});`}));H.addNodeDefinition(G.create({id:"Boolean to String",category:R.TypeConversion,inputs:{input:{nodeType:"value",dataType:"boolean"}},outputs:{output:{nodeType:"value",dataType:"string"}},codeGenerator:h=>`const ${h.outputs.output.valueId} = String(${h.inputs.input.valueId});`}));H.addNodeDefinition(G.create({id:"If",category:R.Flow,inputs:{exec:{nodeType:"flow"},condition:{nodeType:"value",dataType:"boolean"}},outputs:{then:{nodeType:"flow"},else:{nodeType:"flow"}},codeGenerator:h=>`if (${h.inputs.condition.valueId}) {
${h.outputs.then.code}
} else {
${h.outputs.else.code}
}`}));H.addNodeDefinition(G.create({id:"While",category:R.Flow,inputs:{exec:{nodeType:"flow"},condition:{nodeType:"value",dataType:"boolean"}},outputs:{body:{nodeType:"flow"}},codeGenerator:h=>`while (${h.inputs.condition.valueId}) {
${h.outputs.body.code}
}`}));H.addNodeDefinition(G.create({id:"For Loop",category:R.Flow,inputs:{exec:{nodeType:"flow"},count:{nodeType:"value",dataType:"number"}},outputs:{exec:{nodeType:"flow"},index:{nodeType:"value",dataType:"number"}},codeGenerator:h=>`for (let ${h.outputs.index.valueId} = 0; ${h.outputs.index.valueId} < ${h.inputs.count.valueId}; ${h.outputs.index.valueId}++) {
${h.outputs.exec.code}
}`}));H.addNodeDefinition(G.create({id:"Console Log",category:R.Function,inputs:{message:{nodeType:"value",dataType:"string"}},outputs:{},codeGenerator:({inputs:h})=>`console.log(${h.message.valueId});`}));H.addNodeDefinition(G.create({id:"String Concat",category:R.Function,inputs:{a:{nodeType:"value",dataType:"string"},b:{nodeType:"value",dataType:"string"}},outputs:{result:{nodeType:"value",dataType:"string"}},codeGenerator:h=>`const ${h.outputs.result.valueId} = ${h.inputs.a.valueId} + ${h.inputs.b.valueId};`}));var Je=new Ge(H);Je.appendTo(document.body);Je.file=new $t;function Ws(){Je.update({}),requestAnimationFrame(Ws)}Ws();})();
//# sourceMappingURL=page.js.map
