(()=>{var Pt=class p extends Array{static newListWith(...t){let r=new p;return r.push(...t),r}clear(){this.splice(0,this.length)}clone(){return p.newListWith(...this)}distinct(){return p.newListWith(...new Set(this))}equals(t){if(this===t)return!0;if(!t||this.length!==t.length)return!1;for(let r=0;r<this.length;++r)if(this[r]!==t[r])return!1;return!0}remove(t){let r=this.indexOf(t);if(r!==-1)return this.splice(r,1)[0]}replace(t,r){let n=this.indexOf(t);if(n!==-1){let u=this[n];return this[n]=r,u}}toString(){return`[${super.join(", ")}]`}};var A=class extends Error{mTarget;get target(){return this.mTarget}constructor(t,r,n){super(t,n),this.mTarget=r}};var Q=class p extends Map{add(t,r){if(!this.has(t))this.set(t,r);else throw new A("Can't add duplicate key to dictionary.",this)}clone(){return new p(this)}getAllKeysOfValue(t){return[...this.entries()].filter(u=>u[1]===t).map(u=>u[0])}getOrDefault(t,r){let n=this.get(t);return typeof n<"u"?n:r}map(t){let r=new Pt;for(let n of this){let u=t(n[0],n[1]);r.push(u)}return r}};var xt=class p{mSize;mTopItem;get size(){return this.mSize}get top(){if(this.mTopItem)return this.mTopItem.value}constructor(){this.mTopItem=null,this.mSize=0}clone(){let t=new p;return t.mTopItem=this.mTopItem,t.mSize=this.mSize,t}*entries(){let t=this.mTopItem;for(;t!==null;)yield t.value,t=t.previous}flush(){let t=new Array;for(;this.mTopItem;)t.push(this.pop());return t}pop(){if(!this.mTopItem)return;let t=this.mTopItem.value;return this.mTopItem=this.mTopItem.previous,this.mSize--,t}push(t){let r={previous:this.mTopItem,value:t};this.mTopItem=r,this.mSize++}toArray(){return[...this.entries()]}};var Yt=class{mCompareFunction;constructor(t){this.mCompareFunction=t}differencesOf(t,r){let n;if(t.length===0||r.length===0){if(n=new Array,t.length===0)for(let D=0;D<r.length;D++)n.push({changeState:dt.Insert,item:r[D]});else for(let D=0;D<t.length;D++)n.push({changeState:dt.Remove,item:t[D]});return n}let u={1:{x:0,history:[]}},d=D=>D-1,v=t.length,w=r.length,S;for(let D=0;D<v+w+1;D++)for(let a=-D;a<D+1;a+=2){let o=a===-D||a!==D&&u[a-1].x<u[a+1].x;if(o){let l=u[a+1];S=l.x,n=l.history}else{let l=u[a-1];S=l.x+1,n=l.history}n=n.slice();let c=S-a;for(1<=c&&c<=w&&o?n.push({changeState:dt.Insert,item:r[d(c)]}):1<=S&&S<=v&&n.push({changeState:dt.Remove,item:t[d(S)]});S<v&&c<w&&this.mCompareFunction(t[d(S+1)],r[d(c+1)]);)S+=1,c+=1,n.push({changeState:dt.Keep,item:t[d(S)]});if(S>=v&&c>=w)return n;u[a]={x:S,history:n}}return new Array}},dt=function(p){return p[p.Remove=1]="Remove",p[p.Insert=2]="Insert",p[p.Keep=3]="Keep",p}({});var pt=class{mName;mPortType;mDataType;get name(){return this.mName}get portType(){return this.mPortType}get dataType(){return this.mDataType}constructor(t,r,n){if(this.mName=t,this.mPortType=r,r==="value"&&!n)throw new A(`Data type must be specified for value port '${t}'.`,this);if(r==="flow"&&n)throw new A(`Data type must not be specified for flow port '${t}'.`,this);this.mDataType=n??null}};var Ft=class{mFunctions;mFunctionNodeDefinitions;mProject;get functions(){return this.mFunctions}get functionNodeDefinitions(){return this.mFunctionNodeDefinitions}get project(){return this.mProject}constructor(t){this.mProject=t,this.mFunctions=new Set,this.mFunctionNodeDefinitions=new Map}addFunction(t){this.mFunctions.add(t),this.mFunctionNodeDefinitions.set(t.id,new Ae(t))}removeFunction(t){if(!this.mFunctions.has(t))return!1;if(t.isSystem)throw new A("Cannot remove a system function.",this);return this.mFunctions.delete(t),this.mFunctionNodeDefinitions.delete(t.id),!0}validate(){let t=[];for(let r of this.mFunctions)t.push(...r.validate());return t}},Ae=class{mFunction;get id(){return this.mFunction.id}get category(){return"function"}get label(){return this.mFunction.label}get inputs(){let t=this.mFunction.inputs.map(r=>new pt(r.name,"value",r.dataType));return t.push(new pt("Input","flow")),t}get outputs(){let t=this.mFunction.outputs.map(r=>new pt(r.name,"value",r.dataType));return t.push(new pt("Output","flow")),t}get codeGenerator(){return this.mFunction.definition.codeGenerator.valueGenerator}get preview(){return null}constructor(t){this.mFunction=t}};var ot=class p{static mComponents=new WeakMap;static mConstructorSelector=new WeakMap;static mElements=new WeakMap;static ofComponent(t){let r=t.processorConstructor,n=p.mConstructorSelector.get(r);if(!n)throw new A(`Constructor "${r.name}" is not a registered custom element`,r);let u=p.mElements.get(t);if(!u)throw new A(`Component "${t}" is not a registered component`,t);return{selector:n,constructor:r,element:u,component:t,processor:t.processor}}static ofConstructor(t){let r=p.mConstructorSelector.get(t);if(!r)throw new A(`Constructor "${t.name}" is not a registered custom element`,t);let n=globalThis.customElements.get(r);if(!n)throw new A(`Constructor "${t.name}" is not a registered custom element`,t);return{selector:r,constructor:t,elementConstructor:n}}static ofElement(t){let r=p.mComponents.get(t);if(!r)throw new A(`Element "${t}" is not a PwbComponent.`,t);return p.ofComponent(r)}static ofProcessor(t){let r=p.mComponents.get(t);if(!r)throw new A("Processor is not a PwbComponent.",t);return p.ofComponent(r)}static registerComponent(t,r,n){p.mComponents.has(r)||p.mComponents.set(r,t),n&&!p.mComponents.has(n)&&p.mComponents.set(n,t),p.mElements.has(t)||p.mElements.set(t,r)}static registerConstructor(t,r){t&&!p.mConstructorSelector.has(t)&&p.mConstructorSelector.set(t,r)}};var Wt=class p{static CONFIGURATION_ATTACHMENT=Symbol("PwbApplicationConfigurationAttachment");static new(t,r){let n=new p;t(n),r&&n.appendTo(r)}mContent;mElement;constructor(){this.mContent=new Array,this.mElement=document.createElement("div"),this.mElement.attachShadow({mode:"open"})}addContent(t){let r=ot.ofConstructor(t).elementConstructor,n=ot.ofElement(new r);return this.mContent.push(n.component),this.mElement.shadowRoot.appendChild(n.element),n.processor}addStyle(t){let r=document.createElement("style");r.textContent=t,this.mElement.shadowRoot.prepend(r)}appendTo(t){t.appendChild(this.mElement)}};var Vt=class{mCustomMetadata;constructor(){this.mCustomMetadata=new Map}getMetadata(t){return this.mCustomMetadata.get(t)??null}setMetadata(t,r){this.mCustomMetadata.set(t,r)}};var Zt=class extends Vt{};var qt=class p extends Vt{static mPrivateMetadataKey=Symbol("Metadata");mDecoratorMetadataObject;mPropertyMetadata;constructor(t){super(),this.mDecoratorMetadataObject=t,this.mPropertyMetadata=new Map,t[p.mPrivateMetadataKey]=this}getInheritedMetadata(t){let r=new Array,n=this.mDecoratorMetadataObject;do{if(Object.hasOwn(n,p.mPrivateMetadataKey)){let d=n[p.mPrivateMetadataKey].getMetadata(t);d!==null&&r.push(d)}n=Object.getPrototypeOf(n)}while(n!==null);return r.reverse()}getProperty(t){return this.mPropertyMetadata.has(t)||this.mPropertyMetadata.set(t,new Zt),this.mPropertyMetadata.get(t)}};Symbol.metadata??=Symbol("Symbol.metadata");var tt=class p{static mMetadataMapping=new Map;static add(t,r){return(n,u)=>{let d=p.forInternalDecorator(u.metadata);switch(u.kind){case"class":d.setMetadata(t,r);return;case"method":case"field":case"getter":case"setter":case"accessor":if(u.static)throw new Error("@Metadata.add not supported for statics.");d.getProperty(u.name).setMetadata(t,r);return}}}static forInternalDecorator(t){return p.mapMetadata(t)}static get(t){Object.hasOwn(t,Symbol.metadata)||p.polyfillMissingMetadata(t);let r=t[Symbol.metadata];return p.mapMetadata(r)}static init(){return(t,r)=>{p.forInternalDecorator(r.metadata)}}static mapMetadata(t){if(p.mMetadataMapping.has(t))return p.mMetadataMapping.get(t);let r=new qt(t);return p.mMetadataMapping.set(t,r),r}static polyfillMissingMetadata(t){let r=new Array,n=t;do r.push(n),n=Object.getPrototypeOf(n);while(n!==null);for(let u=r.length-1;u>=0;u--){let d=r[u];if(!Object.hasOwn(d,Symbol.metadata)){let v=null;u<r.length-2&&(v=r[u+1][Symbol.metadata]),d[Symbol.metadata]=Object.create(v,{})}}}};var F=class p{static mCurrentInjectionContext=null;static mInjectMode=new Map;static mInjectableConstructor=new Map;static mInjectableReplacement=new Map;static mInjectionConstructorIdentificationMetadataKey=Symbol("InjectionConstructorIdentification");static mSingletonMapping=new Map;static createObject(t,r,n){let[u,d]=typeof r=="object"&&r!==null?[!1,r]:[!!r,n??new Map],v=p.getInjectionIdentification(t);if(!p.mInjectableConstructor.has(v))throw new A(`Constructor "${t.name}" is not registered for injection and can not be built`,p);let w=u?"instanced":p.mInjectMode.get(v),S=new Map(d.entries().map(([o,c])=>[p.getInjectionIdentification(o),c])),D=p.mCurrentInjectionContext,a=new Map([...D?.localInjections.entries()??[],...S.entries()]);p.mCurrentInjectionContext={injectionMode:w,localInjections:a};try{if(!u&&w==="singleton"&&p.mSingletonMapping.has(v))return p.mSingletonMapping.get(v);let o=new t;return w==="singleton"&&!p.mSingletonMapping.has(v)&&p.mSingletonMapping.set(v,o),o}finally{p.mCurrentInjectionContext=D}}static injectable(t="instanced"){return(r,n)=>{p.registerInjectable(r,n.metadata,t)}}static registerInjectable(t,r,n){let u=p.getInjectionIdentification(t,r);p.mInjectableConstructor.set(u,t),p.mInjectMode.set(u,n)}static replaceInjectable(t,r){let n=p.getInjectionIdentification(t);if(!p.mInjectableConstructor.has(n))throw new A("Original constructor is not registered.",p);let u=p.getInjectionIdentification(r);if(!p.mInjectableConstructor.has(u))throw new A("Replacement constructor is not registered.",p);p.mInjectableReplacement.set(n,r)}static use(t){if(p.mCurrentInjectionContext===null)throw new A("Can't create object outside of an injection context.",p);let r=p.getInjectionIdentification(t);if(p.mCurrentInjectionContext.injectionMode!=="singleton"&&p.mCurrentInjectionContext.localInjections.has(r))return p.mCurrentInjectionContext.localInjections.get(r);let n=p.mInjectableReplacement.get(r);if(n||(n=p.mInjectableConstructor.get(r)),!n)throw new A(`Constructor "${t.name}" is not registered for injection and can not be built`,p);return p.createObject(n)}static getInjectionIdentification(t,r){let n=r?tt.forInternalDecorator(r):tt.get(t),u=n.getMetadata(p.mInjectionConstructorIdentificationMetadataKey);return u||(u=Symbol(t.name),n.setMetadata(p.mInjectionConstructorIdentificationMetadataKey,u)),u}};var Tt=class{mData;mInteractionType;mOrigin;get data(){return this.mData}get origin(){return this.mOrigin}get triggerType(){return this.mInteractionType}constructor(t,r,n){this.mInteractionType=t,this.mData=n,this.mOrigin=r}};var Et=class p{static mCurrentZone=new p("Default");static get current(){return p.mCurrentZone}static create(t){return new p(t)}mInteractionListener;mName;mTriggerFilterBitmap;get name(){return this.mName}constructor(t){this.mName=t,this.mTriggerFilterBitmap=-1,this.mInteractionListener=new Map}addInteractionListener(t){return this.mInteractionListener.set(t,p.current),this}setTriggerRestriction(t){return this.mTriggerFilterBitmap=t,this}execute(t,...r){let n=p.mCurrentZone;p.mCurrentZone=this;try{return t(...r)}finally{p.mCurrentZone=n}}pushInteraction(t,r){if((this.mTriggerFilterBitmap&t)===0)return!1;if(this.mInteractionListener.size===0)return!0;let n=new Tt(t,this,r);for(let[u,d]of this.mInteractionListener.entries())d.execute(()=>{u.call(this,n)});return!0}removeInteractionListener(t){return t?(this.mInteractionListener.delete(t),this):(this.mInteractionListener.clear(),this)}};var q=function(p){return p[p.Read=1]="Read",p[p.ReadWrite=2]="ReadWrite",p[p.Write=3]="Write",p}({});var vt=class{mHooks;mInjections;mProcessor;mProcessorConstructor;get processor(){if(!this.mProcessor)throw new A("Processor is not created yet. Call setup to create processor.",this);return this.mProcessor}get processorConstructor(){return this.mProcessorConstructor}constructor(t){if(this.mProcessorConstructor=t.constructor,this.mProcessor=null,this.mInjections=new Map,this.mHooks={create:new Array},t.parent)for(let[r,n]of t.parent.mInjections.entries())this.setProcessorInjection(r,n)}call(t,...r){let n=Reflect.get(this.processor,t);return typeof n!="function"?null:n.apply(this.processor,r)}deconstruct(){}getProcessorInjection(t){return this.mInjections.get(t)}setProcessorInjection(t,r){if(this.mProcessor)throw new A("Cant add injections to after construction.",this);this.mInjections.set(t,r)}setup(){return this.mProcessor=this.createProcessor(),this}addConstructionHook(t){return this.mHooks.create.push(t),this}createProcessor(){let t=F.createObject(this.mProcessorConstructor,this.mInjections),r;for(;r=this.mHooks.create.pop();){let n=r.call(this,t);n&&(t=n)}return t}};var Ct=class p extends vt{constructor(t,r){super({constructor:t,parent:r}),this.setProcessorInjection(p,this)}deconstruct(){this.call("onDeconstruct"),super.deconstruct()}setup(){return super.setup(),this.call("onExecute"),this}onUpdate(){return!1}};var Le=class p{static mInstance;mCoreEntityConstructor;mProcessorConstructorConfiguration;constructor(){if(p.mInstance)return p.mInstance;p.mInstance=this,this.mCoreEntityConstructor=new Map,this.mProcessorConstructorConfiguration=new Map}get(t){let r=this.mCoreEntityConstructor.get(t);if(!r)return new Array;let n=new Array;for(let u of r)n.push({processorConstructor:u,processorConfiguration:this.mProcessorConstructorConfiguration.get(u)});return n}register(t,r,n){this.mProcessorConstructorConfiguration.set(r,n);let u=t;do{if(!(u.prototype instanceof vt)&&u!==vt)break;this.mCoreEntityConstructor.has(u)||this.mCoreEntityConstructor.set(u,new Set),this.mCoreEntityConstructor.get(u).add(r)}while(u=Object.getPrototypeOf(u))}},nt=new Le;var $t=class p extends vt{static mExtensionCache=new WeakMap;mExtensionList;constructor(t){super(t),this.mExtensionList=new Array}deconstruct(){for(let t of this.mExtensionList)t.deconstruct();super.deconstruct()}setup(){return super.setup(),this.executeExtensions(),this}executeExtensions(){let t=(()=>{if(!p.mExtensionCache.has(this.processorConstructor)){let u=nt.get(Ct).filter(v=>{for(let w of v.processorConfiguration.targetRestrictions)if(this instanceof w||this.processorConstructor.prototype instanceof w||this.processorConstructor===w)return!0;return!1}),d={read:u.filter(v=>v.processorConfiguration.access===q.Read),write:u.filter(v=>v.processorConfiguration.access===q.Write),readWrite:u.filter(v=>v.processorConfiguration.access===q.ReadWrite)};p.mExtensionCache.set(this.processorConstructor,d)}return p.mExtensionCache.get(this.processorConstructor)})(),r=[...t.write,...t.readWrite,...t.read];for(let n of r)this.mExtensionList.push(new Ct(n.processorConstructor,this).setup())}};var U={get:1,set:2,manual:4};var he=class p{static ORIGINAL_TO_INTERACTION_MAPPING=new WeakMap;static PROXY_TO_ORIGINAL_MAPPING=new WeakMap;static UNTRACEABLE_FUNCTION_UPDATE_TRIGGER=(()=>{let t=new WeakMap;return t.set(Array.prototype.fill,U.set),t.set(Array.prototype.pop,U.get),t.set(Array.prototype.push,U.set),t.set(Array.prototype.shift,U.get),t.set(Array.prototype.unshift,U.set),t.set(Array.prototype.splice,U.set),t.set(Array.prototype.reverse,U.set),t.set(Array.prototype.sort,U.set),t.set(Array.prototype.concat,U.set),t.set(Map.prototype.clear,U.set),t.set(Map.prototype.delete,U.set),t.set(Map.prototype.set,U.set),t.set(Set.prototype.clear,U.set),t.set(Set.prototype.delete,U.set),t.set(Set.prototype.add,U.set),t})();static getOriginal(t){return p.PROXY_TO_ORIGINAL_MAPPING.get(t)??t}static getWrapper(t){let r=p.getOriginal(t);return p.ORIGINAL_TO_INTERACTION_MAPPING.get(r)}mProxyObject;mStateChangeCallback;get proxy(){return this.mProxyObject}constructor(t,r){let n=p.getWrapper(t);if(n)return n;this.mProxyObject=this.createProxyObject(t),this.mStateChangeCallback=r,p.PROXY_TO_ORIGINAL_MAPPING.set(this.mProxyObject,t),p.ORIGINAL_TO_INTERACTION_MAPPING.set(t,this)}convertToProxy(t){return t===null||typeof t!="object"&&typeof t!="function"?t:new p(t,this.mStateChangeCallback).proxy}createProxyObject(t){let r=(u,d,v)=>{let w=p.getOriginal(d);try{let S=u.call(w,...v);return this.convertToProxy(S)}finally{if(p.UNTRACEABLE_FUNCTION_UPDATE_TRIGGER.has(u)){let S=p.getWrapper(d);S&&S.dispatch(p.UNTRACEABLE_FUNCTION_UPDATE_TRIGGER.get(u))}}};return new Proxy(t,{apply:(u,d,v)=>{let w=u;try{let S=w.call(d,...v);return this.convertToProxy(S)}catch(S){if(!(S instanceof TypeError))throw S;return r(w,d,v)}},set:(u,d,v)=>{try{let w=v;return(w!==null&&typeof w=="object"||typeof w=="function")&&(w=p.getOriginal(w)),Reflect.set(u,d,w)}finally{this.dispatch(U.set)}},get:(u,d,v)=>{try{return this.convertToProxy(Reflect.get(u,d))}finally{this.dispatch(U.get)}},deleteProperty:(u,d)=>{try{return delete u[d]}finally{this.dispatch(U.set)}}})}dispatch(t){this.mStateChangeCallback(t)}};var V=class p{static reaction(t){let r=Et.create("ComponentState reaction");r.addInteractionListener(n=>{(n.triggerType&U.set)!==0&&t()}),r.execute(()=>{t()})}static state(t){return(r,n)=>{if(n.static)throw new A("Event target is not for a static property.",p);let u=new WeakMap,d=(v,w)=>{u.set(v,new p(w,t))};return{init(v){return typeof v>"u"||d(this,v),v},set(v){u.has(this)?u.get(this).set(v):d(this,v)},get(){return u.has(this)||d(this,void 0),u.get(this).get()}}}}mLinkedZones;mLinkedZonesArray;mConfiguration;mValue;constructor(t,r){if(this.mLinkedZones=new Set,this.mLinkedZonesArray=new Array,this.mConfiguration={complexValue:r?.complexValue??!1,proxy:r?.proxy??!1},this.mConfiguration.proxy){if(typeof t!="object"||t===null)throw new A("Proxied component state value must be an object.",this);this.mValue=new he(t,n=>{switch(n){case U.set:return this.dispatchChange();case U.get:return this.linkCurrentZone()}}).proxy}else this.mValue=t}get(){return this.linkCurrentZone(),this.mValue}set(t){if(this.mConfiguration.proxy)throw new A("Proxy is not implemented yet.",this);!this.mConfiguration.complexValue&&this.mValue===t||(this.mValue=t,this.dispatchChange())}dispatchChange(){for(let t of this.mLinkedZonesArray)t.pushInteraction(U.set,this)}linkCurrentZone(){let t=Et.current;this.mLinkedZones.has(t)||(this.mLinkedZones.add(t),this.mLinkedZonesArray.push(t))}};var St=class p{static mCurrentUpdateCycle=null;static openResheduledCycle(t,r){let n=!1;if(!p.mCurrentUpdateCycle){let u=performance.now();p.mCurrentUpdateCycle={initiator:t.initiator,startTime:u,forcedSync:t.forcedSync,runner:t.runner},n=!0}try{return r(p.mCurrentUpdateCycle)}finally{n&&(p.mCurrentUpdateCycle=null)}}static openUpdateCycle(t,r){let n=!1;if(!p.mCurrentUpdateCycle){let u=performance.now();p.mCurrentUpdateCycle={initiator:t.updater,startTime:u,forcedSync:t.runSync,runner:Symbol("Runner "+u)},n=!0}try{return r(p.mCurrentUpdateCycle)}finally{n&&(p.mCurrentUpdateCycle=null)}}static updateCycleRunId(t,r){if(t.initiator===r){let n=performance.now(),u=t;u.runner=Symbol("Runner "+n)}}static updateCyleStartTime(t){let r=performance.now(),n=t;n.startTime=r}};var me=class extends Error{mChain;get chain(){return this.mChain}constructor(t,r){let n=r.slice(-20).map(u=>u.toString()).join(`
`);super(`${t}: 
${n}`),this.mChain=[...r]}};var pe=class p{static mStackCap=100;static mFrameTime=100;static get stackCap(){return p.mStackCap}static set stackCap(t){p.mStackCap=t}static get frameTime(){return p.mFrameTime}static set frameTime(t){p.mFrameTime=t}mInteractionZone;mUpdateFunction;mUpdateRunCache;mUpdateStates;mManualComponentState;get zone(){return this.mInteractionZone}constructor(t){this.mUpdateRunCache=new WeakMap,this.mUpdateFunction=t.onUpdate,this.mInteractionZone=t.zone,this.mManualComponentState=new V(Symbol("Manual Update")),this.mUpdateStates={chainCompleteHooks:new xt,async:{hasSheduledTask:!1,hasRunningTask:!1,sheduledTaskIsResheduled:!1},sync:{running:!1},cycle:{chainedTask:null}},this.mInteractionZone.addInteractionListener(r=>{(r.triggerType&U.set)!==0&&this.runUpdateAsynchron(r,null)})}deconstruct(){this.mInteractionZone.removeInteractionListener()}async waitForUpdate(){return this.mUpdateStates.async.hasSheduledTask?new Promise((t,r)=>{this.mUpdateStates.chainCompleteHooks.push((n,u)=>{u?r(u):t(n)})}):!1}executeInZone(t){return this.mInteractionZone.execute(t)}update(){let t=new Tt(U.manual,this.mInteractionZone,this.mManualComponentState);return this.runUpdateSynchron(t)}updateAsync(){let t=new Tt(U.manual,this.mInteractionZone,this.mManualComponentState);this.runUpdateAsynchron(t,null)}executeTaskChain(t,r,n,u){if(u.length>p.stackCap)throw new me("Call loop detected",u);let d=performance.now();if(!r.forcedSync&&d-r.startTime>p.frameTime)throw new Jt;u.push(t);let v=this.mInteractionZone.execute(()=>this.mUpdateFunction.call(this))||n;if(St.updateCycleRunId(r,this),!this.mUpdateStates.cycle.chainedTask)return v;let w=this.mUpdateStates.cycle.chainedTask;return this.mUpdateStates.cycle.chainedTask=null,this.executeTaskChain(w,r,v,u)}releaseUpdateChainCompleteHooks(t,r){if(!this.mUpdateStates.chainCompleteHooks.top)return;let n;for(;n=this.mUpdateStates.chainCompleteHooks.pop();)n(t,r)}runUpdateAsynchron(t,r){if(this.mUpdateStates.async.hasRunningTask||this.mUpdateStates.async.sheduledTaskIsResheduled){this.mUpdateStates.cycle.chainedTask=t;return}if(this.mUpdateStates.async.hasSheduledTask)return;let n=u=>{this.mUpdateStates.async.hasRunningTask=!0,this.mUpdateStates.async.hasSheduledTask=!1,this.mUpdateStates.async.sheduledTaskIsResheduled=!1;let d=!1;try{this.runUpdateSynchron(t)}catch(v){v instanceof Jt&&u.initiator===this&&(d=!0)}finally{this.mUpdateStates.async.hasRunningTask=!1}d&&this.runUpdateAsynchron(t,u)};this.mUpdateStates.async.hasSheduledTask=!0,r&&(this.mUpdateStates.async.sheduledTaskIsResheduled=!0),globalThis.requestAnimationFrame(()=>{r?St.openResheduledCycle(r,n):St.openUpdateCycle({updater:this,runSync:!1},n)})}runUpdateSynchron(t){if(this.mUpdateStates.sync.running)return this.mUpdateStates.cycle.chainedTask=t,!1;this.mUpdateStates.sync.running=!0;try{let r=St.openUpdateCycle({updater:this,runSync:!0},n=>{if(this.mUpdateRunCache.has(n.runner))return St.updateCyleStartTime(n),this.mUpdateRunCache.get(n.runner);let u=this.executeTaskChain(t,n,!1,new Array);return this.mUpdateRunCache.set(n.runner,u),u});return this.releaseUpdateChainCompleteHooks(r),r}catch(r){throw r instanceof Jt||this.releaseUpdateChainCompleteHooks(!1,r),r}finally{this.mUpdateStates.sync.running=!1}}},Jt=class extends Error{constructor(){super("Update resheduled")}};var fe=class extends $t{mUpdater;get updater(){return this.mUpdater}constructor(t){super(t);let r=Et.create(`${t.constructor.name}-Update-Zone`);this.mUpdater=new pe({label:t.constructor.name,zone:r,onUpdate:()=>this.onUpdate()})}call(t,...r){return this.mUpdater.executeInZone(()=>super.call(t,...r))}deconstruct(){this.mUpdater.deconstruct(),super.deconstruct()}createProcessor(){return this.mUpdater.executeInZone(()=>super.createProcessor())}};var Nt=class{mExpression;mTemporaryValues;constructor(t,r,n){if(this.mTemporaryValues=new Q,n.length>0)for(let u of n)this.mTemporaryValues.set(u,void 0);this.mExpression=this.createEvaluationFunction(t,this.mTemporaryValues).bind(r.store)}execute(){return this.mExpression()}setTemporaryValue(t,r){if(!this.mTemporaryValues.has(t))throw new A(`Temporary value "${t}" does not exist for this procedure.`,this);this.mTemporaryValues.set(t,r)}createEvaluationFunction(t,r){let n,u=`__${Math.random().toString(36).substring(2)}`;if(n="return function () {",r.size>0)for(let d of r.keys())n+=`const ${d} = ${u}.get('${d}');`;return n+=`return ${t};`,n+="};",new Function(u,n)(r)}};var ft=class{mDataLevel;get data(){return this.mDataLevel}constructor(t){this.mDataLevel=t}createExpressionProcedure(t,r){return new Nt(t,this.data,r??[])}setTemporaryValue(t,r){this.data.setTemporaryValue(t,r)}};var ct=class{mComponent;mDataProxy;mParentLevel;mTemporaryValues;get store(){return this.mDataProxy}constructor(t){this.mTemporaryValues=new Q,t instanceof et?(this.mParentLevel=null,this.mComponent=t):(this.mParentLevel=t,this.mComponent=t.mComponent),this.mDataProxy=this.createAccessProxy()}setTemporaryValue(t,r){this.mTemporaryValues.set(t,r)}updateLevelData(t){if(t.mParentLevel!==this.mParentLevel)throw new A("Can't update InstructionLevelData for a deeper level than it target data.",this);this.mTemporaryValues=t.mTemporaryValues}createAccessProxy(){return new Proxy(new Object,{get:(t,r)=>this.getValue(r),set:(t,r,n)=>(this.hasTemporaryValue(r)&&this.setTemporaryValue(r,n),r in this.mComponent.processor?(this.mComponent.processor[r]=n,!0):(this.setTemporaryValue(r,n),!0)),deleteProperty:()=>{throw new A("Deleting properties is not allowed",this)},ownKeys:()=>[...new Set([...Object.keys(this.mComponent.processor),...this.getTemporaryValuesList()])]})}getTemporaryValuesList(){let t=this.mTemporaryValues.map(r=>r);return this.mParentLevel&&t.push(...this.mParentLevel.getTemporaryValuesList()),t}getValue(t){if(this.mTemporaryValues.has(t))return this.mTemporaryValues.get(t);if(this.mParentLevel)return this.mParentLevel.getValue(t);if(t in this.mComponent.processor)return this.mComponent.processor[t]}hasTemporaryValue(t){return this.mTemporaryValues.has(t)?!0:this.mParentLevel?this.mParentLevel.hasTemporaryValue(t):!1}};var At=class p{mChildList;mInstruction;mInstructionType;get childList(){return this.mChildList}get instruction(){return this.mInstruction}get instructionType(){return this.mInstructionType}constructor(t,r){this.mChildList=Array(),this.mInstruction=r,this.mInstructionType=t}appendChild(...t){this.mChildList.push(...t)}clone(){let t=new p(this.instructionType,this.instruction);for(let r of this.mChildList)t.appendChild(r.clone());return t}equals(t){if(!(t instanceof p)||t.instruction!==this.instruction||t.instructionType!==this.instructionType||t.childList.length!==this.childList.length)return!1;for(let r=0;r<t.childList.length;r++)if(!t.childList[r].equals(this.childList[r]))return!1;return!0}removeChild(t){let r=this.mChildList.indexOf(t);if(r!==-1)return this.mChildList.splice(r,1)[0]}};var ht=class p{mExpression;get value(){return this.mExpression}constructor(t){this.mExpression=t}clone(){return new p(this.mExpression)}equals(t){return t instanceof p&&t.value===this.value}toString(){return`{{ ${this.mExpression} }}`}};var gt=class p{mContainsExpression;mTextValue;mValues;get containsExpression(){return this.mContainsExpression}get values(){return this.mValues}constructor(){this.mTextValue="",this.mContainsExpression=!1,this.mValues=[]}addValue(...t){for(let r of t)(this.mContainsExpression===!0||r instanceof ht)&&(this.mContainsExpression=!0),this.mValues.push(r),this.mTextValue+=r.toString()}clone(){let t=new p;for(let r of this.values)typeof r=="string"?t.addValue(r):t.addValue(r.clone());return t}equals(t){if(!(t instanceof p)||t.values.length!==this.values.length)return!1;for(let r=0;r<this.values.length;r++){let n=this.values[r],u=t.values[r];if(n!==u&&(typeof n!=typeof u||typeof n=="string"&&n!==u||!u.equals(n)))return!1}return!0}toString(){return this.mTextValue}};var Kt=class p{mName;mValue;get name(){return this.mName}get values(){return this.mValue}constructor(t){this.mName=t,this.mValue=new gt}clone(){let t=new p(this.name);for(let r of this.values.values)typeof r=="string"?t.values.addValue(r):t.values.addValue(r.clone());return t}equals(t){return!(!(t instanceof p)||t.name!==this.name||!t.values.equals(this.values))}};var yt=class p{mAttributeDictionary;mChildList;mTagName;get attributes(){return[...this.mAttributeDictionary.values()]}get childList(){return this.mChildList}get tagName(){return this.mTagName}constructor(t){this.mAttributeDictionary=new Map,this.mChildList=Array(),this.mTagName=t}appendChild(...t){this.mChildList.push(...t)}clone(){let t=new p(this.tagName);for(let r of this.mAttributeDictionary.values()){let n=t.setAttribute(r.name);for(let u of r.values.values)typeof u=="string"?n.addValue(u):n.addValue(u.clone())}for(let r of this.mChildList)t.appendChild(r.clone());return t}equals(t){if(!(t instanceof p)||t.tagName!==this.tagName||t.attributes.length!==this.mAttributeDictionary.size||t.childList.length!==this.mChildList.length)return!1;for(let r of t.mAttributeDictionary.values()){let n=this.mAttributeDictionary.get(r.name);if(!n||!n.equals(r))return!1}for(let r=0;r<t.childList.length;r++)if(!t.childList[r].equals(this.mChildList[r]))return!1;return!0}getAttribute(t){return this.mAttributeDictionary.get(t)?.values??null}removeAttribute(t){return this.mAttributeDictionary.delete(t)}removeChild(t){let r=this.mChildList.indexOf(t);if(r!==-1)return this.mChildList.splice(r,1)[0]}setAttribute(t){if(this.mAttributeDictionary.has(t))return this.mAttributeDictionary.get(t).values;let r=new Kt(t);return this.mAttributeDictionary.set(t,r),r.values}};var it=class p{mBodyElementList;get body(){return this.mBodyElementList}constructor(){this.mBodyElementList=new Array}appendChild(...t){this.mBodyElementList.push(...t)}clone(){let t=new p;for(let r of this.mBodyElementList)t.appendChild(r.clone());return t}equals(t){if(!(t instanceof p)||t.body.length!==this.mBodyElementList.length)return!1;for(let r=0;r<this.mBodyElementList.length;r++)if(!this.mBodyElementList[r].equals(t.body[r]))return!1;return!0}removeChild(t){let r=this.mBodyElementList.indexOf(t);if(r!==-1)return this.mBodyElementList.splice(r,1)[0]}};var rt=class{mComponentValues;mContent;mModules;mTemplate;get anchor(){return this.mContent.contentAnchor}get modules(){return this.mModules}get template(){return this.mTemplate}get values(){return this.mComponentValues}get content(){return this.mContent}constructor(t,r,n,u){this.mTemplate=t,this.mComponentValues=n,this.mContent=u,this.mModules=r,u.setCoreBuilder(this)}deconstruct(){this.content.deconstruct()}update(){let t=this.onUpdate(),r=!1,n=this.content.builders;if(n.length>0)for(let u=0;u<n.length;u++)r=n[u].update()||r;return t||r}createHtmlElement(t){let r=t.tagName;if(typeof r!="string")throw r;if(r.includes("-")){let u=globalThis.customElements.get(r);if(typeof u<"u")return new u}let n=t.getAttribute("xmlns");return n&&!n.containsExpression?document.createElementNS(n.values[0],r):document.createElement(r)}createTextNode(t){return document.createTextNode(t)}};var Bt=class{mChildBuilderList;mChildComponents;mContentAnchor;mContentBoundary;mLinkedContent;mRootChildList;get body(){return this.mRootChildList}get builders(){return this.mChildBuilderList}get contentAnchor(){return this.mContentAnchor}constructor(t){this.mChildBuilderList=new Array,this.mRootChildList=new Array,this.mChildComponents=new Map,this.mLinkedContent=new WeakSet,this.mContentAnchor=document.createComment(t),this.mContentBoundary={start:this.mContentAnchor,end:this.mContentAnchor}}deconstruct(){this.onDeconstruct();let t;for(;t=this.mChildBuilderList.pop();)t.deconstruct();for(let n of this.mChildComponents.values())n.deconstruct();this.mChildComponents.clear();let r;for(;r=this.mRootChildList.pop();)r instanceof rt||r.remove();this.contentAnchor.remove()}getBoundary(){let t=this.mContentBoundary.end instanceof rt?this.mContentBoundary.end.content.getBoundary().end:this.mContentBoundary.end;return{start:this.mContentBoundary.start,end:t}}insert(t,r,n){if(!this.mLinkedContent.has(n))throw new A("Can't add content to builder. Target is not part of builder.",this);let u=t instanceof rt?t.anchor:t;switch(r){case"After":{this.insertAfter(u,n);break}case"TopOf":{this.insertTop(u,n);break}case"BottomOf":{this.insertBottom(u,n);break}}this.mLinkedContent.add(t),t instanceof rt&&this.mChildBuilderList.push(t);let d=u.parentElement??u.getRootNode(),v=this.mContentAnchor.parentElement??this.mContentAnchor.getRootNode();if(d===v){let w=(()=>{switch(r){case"After":return this.mRootChildList.indexOf(n)+1;case"TopOf":return 0;case"BottomOf":return this.mRootChildList.length}})();w===this.mRootChildList.length&&(this.mContentBoundary.end=t),this.mRootChildList.splice(w+1,0,t)}}remove(t){if(!this.mLinkedContent.has(t))throw new A("Child node cant be deleted from builder when it not a child of them",this);if(this.mLinkedContent.delete(t),t instanceof rt){let n=this.mChildBuilderList.indexOf(t);n!==-1&&this.mChildBuilderList.splice(n,1),t.deconstruct()}else{let n=this.mChildComponents.get(t);n&&(n.deconstruct(),this.mChildComponents.delete(t)),t.remove()}let r=this.mRootChildList.indexOf(t);r!==-1&&(this.mRootChildList.splice(r,1),this.mContentBoundary.end=this.mRootChildList.at(-1)??this.mContentAnchor)}setCoreBuilder(t){this.mLinkedContent.add(t)}insertAfter(t,r){let n=r instanceof rt?r.content.getBoundary().end:r;(n.parentElement??n.getRootNode()).insertBefore(t,n.nextSibling)}insertBottom(t,r){if(r instanceof rt){this.insertAfter(t,r);return}if(r instanceof Element){r.appendChild(t);return}throw new A("Source node does not support child nodes.",this)}insertTop(t,r){if(r instanceof rt){this.insertAfter(t,r.anchor);return}if(r instanceof Element){r.prepend(t);return}throw new A("Source node does not support child nodes.",this)}};var de=class extends Bt{mAttributeModulesChangedOrder;mLinkedAttributeData;mLinkedAttributeExpressionModules;mLinkedAttributeModuleList;mLinkedExpressionModuleList;get linkedAttributeModules(){return this.mAttributeModulesChangedOrder&&(this.mAttributeModulesChangedOrder=!1,this.mLinkedAttributeModuleList.sort((t,r)=>t.accessMode-r.accessMode)),this.mLinkedAttributeModuleList}get linkedExpressionModules(){return this.mLinkedExpressionModuleList}constructor(t){super(t),this.mLinkedExpressionModuleList=new Array,this.mLinkedAttributeModuleList=new Array,this.mLinkedAttributeExpressionModules=new WeakMap,this.mLinkedAttributeData=new WeakMap,this.mAttributeModulesChangedOrder=!1}attributeOfLinkedExpressionModule(t){return this.mLinkedAttributeExpressionModules.get(t)}getLinkedAttributeData(t){if(!this.mLinkedAttributeData.has(t))throw new A("Attribute has no linked data.",this);return this.mLinkedAttributeData.get(t)}linkAttributeExpression(t,r){this.mLinkedAttributeExpressionModules.set(t,r)}linkAttributeModule(t){this.mLinkedAttributeModuleList.push(t),this.mAttributeModulesChangedOrder=!0}linkAttributeNodes(t,r,n){this.mLinkedAttributeData.set(t,{values:n,node:r})}linkExpressionModule(t){this.mLinkedExpressionModuleList.push(t)}onDeconstruct(){for(let t of this.mLinkedAttributeModuleList)t.deconstruct();for(let t of this.mLinkedExpressionModuleList)t.deconstruct()}};var ve=class extends Bt{mInstructionModule;get instructionModule(){return this.mInstructionModule}constructor(t,r){super(r),this.mInstructionModule=t}onDeconstruct(){this.mInstructionModule.deconstruct()}};var ge=class extends rt{constructor(t,r,n){let u=r.createInstructionModule(t,n);super(t,r,n,new ve(u,`Instruction - {$${t.instructionType}}`))}onUpdate(){if(this.content.instructionModule.update()){let t=this.content.body;this.updateStaticBuilder(t,this.content.instructionModule.instructionResult.elementList)}return!1}insertNewContent(t,r){let n=new jt(t.template,this.modules,t.dataLevel,`Child - {$${this.template.instructionType}}`);return r===null?this.content.insert(n,"TopOf",this):this.content.insert(n,"After",r),n}updateStaticBuilder(t,r){let u=new Yt((w,S)=>S.template.equals(w.template)).differencesOf(t,r),d=0,v=null;for(let w=0;w<u.length;w++){let S=u[w];if(S.changeState===dt.Remove)this.content.remove(S.item);else if(S.changeState===dt.Insert)v=this.insertNewContent(S.item,v),d++;else{let D=r[d].dataLevel;S.item.values.updateLevelData(D),v=S.item,d++}}}};var jt=class extends rt{mInitialized;constructor(t,r,n,u){super(t,r,n,new de(`Static - {${u}}`)),this.mInitialized=!1}onUpdate(){this.mInitialized||(this.mInitialized=!0,this.buildTemplate([this.template],this));let t=!1,r=this.content.linkedAttributeModules;for(let d=0;d<r.length;d++)t=r[d].update()||t;let n=!1,u=this.content.linkedExpressionModules;for(let d=0;d<u.length;d++){let v=u[d];if(v.update()){n=!0;let w=this.content.attributeOfLinkedExpressionModule(v);if(!w)continue;let S=this.content.getLinkedAttributeData(w),D=S.values.reduce((a,o)=>a+o.data,"");S.node.setAttribute(w.name,D)}}return t||n}buildInstructionTemplate(t,r){this.content.insert(new ge(t,this.modules,new ct(this.values)),"BottomOf",r)}buildStaticTemplate(t,r){let n=this.createHtmlElement(t);this.content.insert(n,"BottomOf",r);for(let u of t.attributes){let d=this.modules.createAttributeModule(u,n,this.values);if(d){this.content.linkAttributeModule(d);continue}if(u.values.containsExpression){let v=new Array;for(let w of u.values.values){let S=this.createTextNode("");if(v.push(S),!(w instanceof ht)){S.data=w;continue}let D=this.modules.createExpressionModule(w,S,this.values);this.content.linkExpressionModule(D),this.content.linkAttributeExpression(D,u)}this.content.linkAttributeNodes(u,n,v);continue}n.setAttribute(u.name,u.values.toString())}this.content.insert(n,"BottomOf",r),this.buildTemplate(t.childList,n)}buildTemplate(t,r){for(let n of t)n instanceof it?this.buildTemplate(n.body,r):n instanceof gt?this.buildTextTemplate(n,r):n instanceof At?this.buildInstructionTemplate(n,r):n instanceof yt&&this.buildStaticTemplate(n,r)}buildTextTemplate(t,r){for(let n of t.values){if(typeof n=="string"){this.content.insert(this.createTextNode(n),"BottomOf",r);continue}let u=this.createTextNode("");this.content.insert(u,"BottomOf",r);let d=this.modules.createExpressionModule(n,u,this.values);this.content.linkExpressionModule(d)}}};var Qt=class{mHtmlElement;mShadowRoot;get htmlElement(){return this.mHtmlElement}get shadowRoot(){return this.mShadowRoot}constructor(t){this.mHtmlElement=t,this.mShadowRoot=this.mHtmlElement.attachShadow({mode:"open"})}};var Y=class{mDataLevel;get data(){return this.mDataLevel}constructor(t){this.mDataLevel=t}createExpressionProcedure(t,r){return new Nt(t,this.data,r??[])}};var It=class extends $t{constructor(t){super({constructor:t.constructor,parent:t.parent}),this.setProcessorInjection(Y,new Y(t.values))}deconstruct(){super.deconstruct(),this.call("onDeconstruct")}update(){return this.onUpdate()}};var K=class{mValue;get value(){return this.mValue}constructor(t){this.mValue=t}};var k=class{constructor(){throw new A("Reference should not be instanced.",this)}};var ut=class{constructor(){throw new A("Reference should not be instanced.",this)}};var Dt=class p extends It{mLastResult;mTargetTextNode;constructor(t){super({constructor:t.constructor,parent:t.parent,values:t.values}),this.mTargetTextNode=t.targetNode,this.mLastResult=null,this.setProcessorInjection(p,this),this.setProcessorInjection(ut,t.targetTemplate.clone()),this.setProcessorInjection(k,t.targetNode),this.setProcessorInjection(K,new K(t.targetTemplate.value))}onUpdate(){let t=this.call("onUpdate");t===null&&(t="");let r=this.mLastResult===null||this.mLastResult!==t;if(r){let n=this.mTargetTextNode;n.data=t,this.mLastResult=t}return r}};function Re(){return(p,t)=>{F.registerInjectable(p,t.metadata,"instanced"),nt.register(Dt,p,{})}}function Bs(){function p(a,o){return function(l){r(o,"addInitializer"),n(l,"An initializer"),a.push(l)}}function t(a,o,c,l,e,y,g,T,b){var f;switch(e){case 1:f="accessor";break;case 2:f="method";break;case 3:f="getter";break;case 4:f="setter";break;default:f="field"}var s={kind:f,name:g?"#"+o:o,static:y,private:g,metadata:T},m={v:!1};s.addInitializer=p(l,m);var i,h;e===0?g?(i=c.get,h=c.set):(i=function(){return this[o]},h=function(x){this[o]=x}):e===2?i=function(){return c.value}:((e===1||e===3)&&(i=function(){return c.get.call(this)}),(e===1||e===4)&&(h=function(x){c.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return a(b,s)}finally{m.v=!0}}function r(a,o){if(a.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(a,o){if(typeof a!="function")throw new TypeError(o+" must be a function")}function u(a,o){var c=typeof o;if(a===1){if(c!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(c!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function d(a,o,c,l,e,y,g,T,b){var f=c[0],s,m,i;g?e===0||e===1?s={get:c[3],set:c[4]}:e===3?s={get:c[3]}:e===4?s={set:c[3]}:s={value:c[3]}:e!==0&&(s=Object.getOwnPropertyDescriptor(o,l)),e===1?i={get:s.get,set:s.set}:e===2?i=s.value:e===3?i=s.get:e===4&&(i=s.set);var h,x,I;if(typeof f=="function")h=t(f,l,s,T,e,y,g,b,i),h!==void 0&&(u(e,h),e===0?m=h:e===1?(m=h.init,x=h.get||i.get,I=h.set||i.set,i={get:x,set:I}):i=h);else for(var _=f.length-1;_>=0;_--){var P=f[_];if(h=t(P,l,s,T,e,y,g,b,i),h!==void 0){u(e,h);var N;e===0?N=h:e===1?(N=h.init,x=h.get||i.get,I=h.set||i.set,i={get:x,set:I}):i=h,N!==void 0&&(m===void 0?m=N:typeof m=="function"?m=[m,N]:m.push(N))}}if(e===0||e===1){if(m===void 0)m=function(C,E){return E};else if(typeof m!="function"){var M=m;m=function(C,E){for(var L=E,R=0;R<M.length;R++)L=M[R].call(C,L);return L}}else{var B=m;m=function(C,E){return B.call(C,E)}}a.push(m)}e!==0&&(e===1?(s.get=i.get,s.set=i.set):e===2?s.value=i:e===3?s.get=i:e===4&&(s.set=i),g?e===1?(a.push(function(C,E){return i.get.call(C,E)}),a.push(function(C,E){return i.set.call(C,E)})):e===2?a.push(i):a.push(function(C,E){return i.call(C,E)}):Object.defineProperty(o,l,s))}function v(a,o,c){for(var l=[],e,y,g=new Map,T=new Map,b=0;b<o.length;b++){var f=o[b];if(Array.isArray(f)){var s=f[1],m=f[2],i=f.length>3,h=s>=5,x,I;if(h?(x=a,s=s-5,y=y||[],I=y):(x=a.prototype,e=e||[],I=e),s!==0&&!i){var _=h?T:g,P=_.get(m)||0;if(P===!0||P===3&&s!==4||P===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+m);!P&&s>2?_.set(m,s):_.set(m,!0)}d(l,x,f,m,s,h,i,I,c)}}return w(l,e),w(l,y),l}function w(a,o){o&&a.push(function(c){for(var l=0;l<o.length;l++)o[l].call(c);return c})}function S(a,o,c){if(o.length>0){for(var l=[],e=a,y=a.name,g=o.length-1;g>=0;g--){var T={v:!1};try{var b=o[g](e,{kind:"class",name:y,addInitializer:p(l,T),metadata:c})}finally{T.v=!0}b!==void 0&&(u(10,b),e=b)}return[D(e,c),function(){for(var f=0;f<l.length;f++)l[f].call(e)}]}}function D(a,o){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,c,l,e){if(e!==void 0)var y=e[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(y===void 0?null:y),T=v(o,c,g);return l.length||D(o,g),{e:T,get c(){return S(o,l,g)}}}}function Ge(p,t,r,n){return(Ge=Bs())(p,t,r,n)}var Ue,je,Me;Ue=Re();var ze=class{static{({c:[Me,je]}=Ge(this,[],[Ue]))}constructor(t=F.use(Y),r=F.use(K)){this.mProcedure=t.createExpressionProcedure(r.value)}mProcedure;onUpdate(){let t=this.mProcedure.execute();return typeof t>"u"?null:t?.toString()}static{je()}};var st=class{mName;mValue;get name(){return this.mName}get value(){return this.mValue}constructor(t,r){this.mName=t,this.mValue=r}};var mt=class p extends It{mAccessMode;get accessMode(){return this.mAccessMode}constructor(t){super({constructor:t.constructor,parent:t.parent,values:t.values}),this.mAccessMode=t.accessMode,this.setProcessorInjection(p,this),this.setProcessorInjection(ut,t.targetTemplate.clone()),this.setProcessorInjection(k,t.targetNode),this.setProcessorInjection(st,new st(t.targetTemplate.name,t.targetTemplate.values.toString()))}onUpdate(){return this.call("onUpdate")??!1}};var at=class{mElementList;mTemplates;mDataLevels;get elementList(){return this.mElementList}constructor(){this.mElementList=new Array,this.mTemplates=new Set,this.mDataLevels=new Set}addElement(t,r){if(this.mTemplates.has(t)||this.mDataLevels.has(r))throw new A("Can't add same template or values for multiple Elements.",this);this.mTemplates.add(t),this.mDataLevels.add(r),this.mElementList.push({template:t,dataLevel:r})}};var _t=class p extends It{mLastResult;get instructionResult(){return this.mLastResult}constructor(t){super({constructor:t.constructor,parent:t.parent,values:t.values}),this.setProcessorInjection(p,this),this.setProcessorInjection(ut,t.targetTemplate.clone()),this.setProcessorInjection(K,new K(t.targetTemplate.instruction)),this.mLastResult=new at}onUpdate(){let t=this.call("onUpdate");return t instanceof at?(this.mLastResult=t,!0):!1}};var ye=class p{static mAttributeModuleCache=new Q;static mExpressionModuleCache=new WeakMap;static mInstructionModuleCache=new Q;mComponent;mExpressionModule;constructor(t,r){this.mExpressionModule=r??Me,this.mComponent=t}createAttributeModule(t,r,n){let u=(()=>{let d=p.mAttributeModuleCache.get(t.name);if(d||d===null)return d;for(let v of nt.get(mt))if(v.processorConfiguration.selector.test(t.name))return p.mAttributeModuleCache.set(t.name,v),v;return p.mAttributeModuleCache.set(t.name,null),null})();return u===null?null:new mt({accessMode:u.processorConfiguration.access,constructor:u.processorConstructor,parent:this.mComponent,targetNode:r,targetTemplate:t,values:n}).setup()}createExpressionModule(t,r,n){let u=(()=>{let d=p.mExpressionModuleCache.get(this.mExpressionModule);if(d)return d;let v=nt.get(Dt).find(w=>w.processorConstructor===this.mExpressionModule);if(!v)throw new A("An expression module could not be found.",this);return p.mExpressionModuleCache.set(this.mExpressionModule,v),v})();return new Dt({constructor:u.processorConstructor,parent:this.mComponent,targetNode:r,targetTemplate:t,values:n}).setup()}createInstructionModule(t,r){let n=(()=>{let u=p.mInstructionModuleCache.get(t.instructionType);if(u)return u;for(let d of nt.get(_t))if(d.processorConfiguration.instructionType===t.instructionType)return p.mInstructionModuleCache.set(t.instructionType,d),d;throw new A(`Instruction module type "${t.instructionType}" not found.`,this)})();return new _t({constructor:n.processorConstructor,parent:this.mComponent,targetTemplate:t,values:r}).setup()}};var Lt=class extends A{mColumnEnd;mColumnStart;mLineEnd;mLineStart;get columnEnd(){return this.mColumnEnd}get columnStart(){return this.mColumnStart}get lineEnd(){return this.mLineEnd}get lineStart(){return this.mLineStart}constructor(t,r,n,u,d,v,w){super(t,r,w),this.mColumnStart=n,this.mLineStart=u,this.mColumnEnd=d,this.mLineEnd=v}};var zt=class{mDependencyFetch;mDependencyFetchResolved;mLexer;mMeta;mPattern;mPatternDependencies;mType;get dependencies(){return this.mPatternDependencies}get dependenciesResolved(){return this.mDependencyFetchResolved}get lexer(){return this.mLexer}get meta(){return this.mMeta}get pattern(){return this.mPattern}constructor(t,r){if(this.mLexer=t,this.mType=r.type,this.mMeta=r.metadata,this.mPatternDependencies=new Array,this.mDependencyFetch=r.dependencyFetch??null,this.mDependencyFetchResolved=!r.dependencyFetch,this.mType==="split"&&!this.mDependencyFetch)throw new A("Split token with a start and end token, need inner token definitions.",this);if(this.mType==="single"&&this.mDependencyFetch)throw new A("Pattern does not allow inner token pattern.",this);this.mPattern=this.convertTokenPattern(this.mType,r.pattern)}isSplit(){return this.mType==="split"}resolveDependencies(){this.mDependencyFetchResolved||(this.mDependencyFetch(this),this.mDependencyFetchResolved=!0)}useChildPattern(t){if(this.mLexer!==t.lexer)throw new A("Can only add dependencies of the same lexer.",this);this.mPatternDependencies.push(t)}convertTokenPattern(t,r){if("single"in r){if(t==="split")throw new A("Can't use split pattern type with single pattern definition.",this);return{start:{regex:r.single.regex,types:r.single.types,validator:r.single.validator??null}}}else{if(t==="single")throw new A("Can't use single pattern type with split pattern definition.",this);return{start:{regex:r.start.regex,types:r.start.types,validator:r.start.validator??null},end:{regex:r.end.regex,types:r.end.types,validator:r.end.validator??null},innerType:r.innerType??null}}}};var Gt=class{mColumnNumber;mLineNumber;mMetas;mType;mValue;get columnNumber(){return this.mColumnNumber}get lineNumber(){return this.mLineNumber}get metas(){return[...this.mMetas]}get type(){return this.mType}get value(){return this.mValue}constructor(t,r,n,u){this.mValue=r,this.mColumnNumber=n,this.mLineNumber=u,this.mType=t,this.mMetas=new Set}addMeta(...t){for(let r of t)this.mMetas.add(r)}hasMeta(t){return this.mMetas.has(t)}};var kt=class{mRootPattern;mSettings;get errorType(){return this.mSettings.errorType}set errorType(t){this.mSettings.errorType=t}get trimWhitespace(){return this.mSettings.trimSpaces}set trimWhitespace(t){this.mSettings.trimSpaces=t}get validWhitespaces(){return[...this.mSettings.whiteSpaces].join("")}set validWhitespaces(t){this.mSettings.whiteSpaces=new Set(t.split(""))}constructor(){this.mSettings={errorType:null,trimSpaces:!0,whiteSpaces:new Set},this.mRootPattern=new zt(this,{type:"single",pattern:{single:{regex:/^/,types:{},validator:null}},metadata:[],dependencyFetch:null})}createTokenPattern(t,r){let n=w=>typeof w=="string"?{token:w}:w,u=w=>{let S=new Set(w.flags.split(""));return new RegExp(`^(?<token>${w.source})`,[...S].join(""))},d=new Array;t.meta&&(typeof t.meta=="string"?d.push(t.meta):d.push(...t.meta));let v;return"regex"in t.pattern?v={single:{regex:u(t.pattern.regex),types:n(t.pattern.type),validator:t.pattern.validator??null}}:v={start:{regex:u(t.pattern.start.regex),types:n(t.pattern.start.type),validator:t.pattern.start.validator??null},end:{regex:u(t.pattern.end.regex),types:n(t.pattern.end.type),validator:t.pattern.end.validator??null},innerType:t.pattern.innerType??null},new zt(this,{type:"regex"in t.pattern?"single":"split",pattern:v,metadata:d,dependencyFetch:r??null})}*tokenize(t,r){let n={data:t,cursor:{position:0,column:1,line:1},error:null,progressTracker:r??null};yield*this.tokenizeRecursionLayer(n,this.mRootPattern,new Array,null)}useRootTokenPattern(t){if(t.lexer!==this)throw new A("Token pattern must be created by this lexer.",this);this.mRootPattern.useChildPattern(t)}findNextStartToken(t,r,n,u){for(let d of r){let v=d.pattern.start,w=this.matchToken(d,v,t,n,u);if(w!==null)return{pattern:d,token:w}}return null}findTokenTypeOfMatch(t,r,n){for(let v in t.groups){let w=t.groups[v],S=r[v];if(!(!w||!S)){if(w.length!==t[0].length)throw new A("A group of a token pattern must match the whole token.",this);return S}}let u=new Array;for(let v in t.groups)t.groups[v]&&u.push(v);let d=new Array;for(let v in r)d.push(v);throw new A(`No token type found for any defined pattern regex group. Full: "${t[0]}", Matches: "${u.join(", ")}", Available: "${d.join(", ")}", Regex: "${n.source}"`,this)}*generateErrorToken(t,r){if(!t.error||!this.mSettings.errorType)return;let n=new Gt(this.mSettings.errorType,t.error.data,t.error.startColumn,t.error.startLine);n.addMeta(...r),t.error=null,yield n}generateToken(t,r,n,u,d,v){let w=n[0],S=this.findTokenTypeOfMatch(n,u,v),D=new Gt(d??S,w,t.cursor.column,t.cursor.line);return D.addMeta(...r),D}matchToken(t,r,n,u,d){let v=r.regex;v.lastIndex=0;let w=v.exec(n.data);if(!w||w.index!==0)return null;let S=this.generateToken(n,[...u,...t.meta],w,r.types,d,v);if(r.validator){let D=n.data.substring(S.value.length);if(!r.validator(S,D,n.cursor.position))return null}return this.moveCursor(n,S.value),S}moveCursor(t,r){let n=r.split(`
`);n.length>1&&(t.cursor.column=1),t.cursor.line+=n.length-1,t.cursor.column+=n.at(-1).length,t.cursor.position+=r.length,t.data=t.data.substring(r.length),this.trackProgress(t)}pushNextCharToErrorState(t){if(!this.mSettings.errorType)throw new Lt(`Unable to parse next token. No valid pattern found for "${t.data.substring(0,20)}".`,this,t.cursor.column,t.cursor.line,t.cursor.column,t.cursor.line);t.error||(t.error={data:"",startColumn:t.cursor.column,startLine:t.cursor.line});let r=t.data.charAt(0);t.error.data+=r,this.moveCursor(t,r)}skipNextWhitespace(t){let r=t.data.charAt(0);return!this.mSettings.trimSpaces||!this.mSettings.whiteSpaces.has(r)?!1:(this.moveCursor(t,r),!0)}*tokenizeRecursionLayer(t,r,n,u){let d=r.dependencies;for(;t.data.length>0;){if(!t.error&&this.skipNextWhitespace(t))continue;if(r.isSplit()){let S=this.matchToken(r,r.pattern.end,t,n,u);if(S!==null){yield*this.generateErrorToken(t,n),yield S;return}}let v=this.findNextStartToken(t,d,n,u);if(!v){this.pushNextCharToErrorState(t);continue}yield*this.generateErrorToken(t,n),yield v.token;let w=v.pattern;w.isSplit()&&(w.resolveDependencies(),yield*this.tokenizeRecursionLayer(t,w,[...n,...w.meta],u??w.pattern.innerType))}yield*this.generateErrorToken(t,n)}trackProgress(t){t.progressTracker!==null&&t.progressTracker(t.cursor.position,t.cursor.line,t.cursor.column)}};var Z=class extends Error{static PARSER_ERROR=Symbol("PARSER_ERROR");mTrace;get columnEnd(){return this.mTrace.top.range.columnEnd}get columnStart(){return this.mTrace.top.range.columnStart}get graph(){return this.mTrace.top.graph}get incidents(){return this.mTrace.incidents}get lineEnd(){return this.mTrace.top.range.lineEnd}get lineStart(){return this.mTrace.top.range.lineStart}constructor(t){super(t.top.message,{cause:t.top.cause}),this.mTrace=t}};var be=class{mIncidents;mTop;get incidents(){if(this.mIncidents===null)throw new A("A complete incident list is only available on debug mode.",this);return this.mIncidents}get top(){return this.mTop}constructor(t){this.mTop={message:"Unknown parser error",priority:0,graph:null,range:{lineStart:1,columnStart:1,lineEnd:1,columnEnd:1},cause:null},t?this.mIncidents=new Array:this.mIncidents=null}push(t,r,n,u,d,v,w=!1,S=null){let D;if(w?D=this.mTop.priority+1:D=d*1e4+v,this.mIncidents!==null){let a={message:t,priority:D,graph:r,range:{lineStart:n,columnStart:u,lineEnd:d,columnEnd:v},cause:S};this.mIncidents.push(a)}this.mTop&&D<this.mTop.priority||this.setTop({message:t,priority:D,graph:r,range:{lineStart:n,columnStart:u,lineEnd:d,columnEnd:v},cause:S})}setTop(t){this.mTop=t}};var we=class p{static MAX_JUNCTION_CIRCULAR_REFERENCES=1e3;mGraphStack;mIncidentTrace;mLastTokenPosition;mProcessStack;mTokenCache;mTokenGenerator;mTrimTokenCache;get currentGraph(){return this.mGraphStack.top.graph}get currentToken(){let t=this.mGraphStack.top;return this.mTokenCache[t.token.cursor]}get incidentTrace(){return this.mIncidentTrace}get processStack(){return this.mProcessStack}constructor(t,r,n){this.mTokenGenerator=t,this.mGraphStack=new xt,this.mLastTokenPosition={column:1,line:1},this.mTokenCache=new Array,this.mProcessStack=new xt,this.mTrimTokenCache=n,this.mIncidentTrace=new be(r),this.mGraphStack.push({graph:null,linear:!0,circularGraphs:new Q,token:{start:0,cursor:-1}})}collapse(){let t=this.mGraphStack.top,r=this.mTokenCache.slice(t.token.cursor);r.length!==0&&r.at(-1)===null&&r.pop();for(let n of this.mTokenGenerator)r.push(n);return r}getGraphBoundingToken(){let t=this.mGraphStack.top,r=this.mTokenCache[t.token.start],n=this.mTokenCache[t.token.cursor-1];return r??=n,n??=r,[r??null,n??null]}getGraphPosition(){let t=this.mGraphStack.top,r,n;if(r=this.mTokenCache[t.token.start],n=this.mTokenCache[t.token.cursor-1],r??=n,n??=r,!r||!n)return{graph:t.graph,columnEnd:this.mLastTokenPosition.column,columnStart:this.mLastTokenPosition.column,lineEnd:this.mLastTokenPosition.line,lineStart:this.mLastTokenPosition.line};let u,d;if(n.value.includes(`
`)){let v=n.value.split(`
`);d=n.lineNumber+v.length-1,u=1+v[v.length-1].length}else u=n.columnNumber+n.value.length,d=n.lineNumber;return{graph:t.graph,lineStart:r.lineNumber,columnStart:r.columnNumber,lineEnd:d,columnEnd:u}}getTokenPosition(){let t=this.mGraphStack.top,r=this.currentToken;if(!r)return{graph:t.graph,columnEnd:this.mLastTokenPosition.column,columnStart:this.mLastTokenPosition.column,lineEnd:this.mLastTokenPosition.line,lineStart:this.mLastTokenPosition.line};let n,u;if(r.value.includes(`
`)){let d=r.value.split(`
`);u=r.lineNumber+d.length-1,n=1+d[d.length-1].length}else n=r.columnNumber+r.value.length,u=r.lineNumber;return{graph:t.graph,lineStart:r.lineNumber,columnStart:r.columnNumber,lineEnd:u,columnEnd:n}}graphIsCircular(t){let r=this.mGraphStack.top;if(!r.circularGraphs.has(t))return!1;if(t.isJunction){if(r.circularGraphs.get(t)>p.MAX_JUNCTION_CIRCULAR_REFERENCES)throw new A("Junction graph called circular too often.",this);return!1}return!0}moveNextToken(){let t=this.mGraphStack.top;if(t.circularGraphs.size>0&&(t.circularGraphs=new Q),t.graph&&t.graph.isJunction)throw new A("Junction graph must not have own nodes.",this);if(t.token.cursor++,t.token.cursor<this.mTokenCache.length)return;let r=this.mTokenGenerator.next();if(r.done){this.mTokenCache.push(null);return}this.mLastTokenPosition.column=r.value.columnNumber,this.mLastTokenPosition.line=r.value.lineNumber,this.mTokenCache.push(r.value)}popGraphStack(t){let r=this.mGraphStack.pop(),n=this.mGraphStack.top;if(t&&(r.token.cursor=r.token.start),r.token.cursor!==r.token.start&&n.circularGraphs.size>0&&(n.circularGraphs=new Q),!this.mTrimTokenCache){n.token.cursor=r.token.cursor;return}r.linear?(this.mTokenCache.splice(0,r.token.cursor),n.token.start=0,n.token.cursor=0):n.token.cursor=r.token.cursor}pushGraphStack(t,r){let n=this.mGraphStack.top,u={graph:t,linear:r&&n.linear,circularGraphs:new Q(n.circularGraphs),token:{start:n.token.cursor,cursor:n.token.cursor}},d=u.circularGraphs.get(t)??0;u.circularGraphs.set(t,d+1),this.mGraphStack.push(u)}};var te=class p{static NODE_NULL_RESULT=Symbol("FAILED_NODE_VALUE_PARSE");static NODE_VALUE_LIST_END_MEET=Symbol("FAILED_NODE_VALUE_PARSE");mConfiguration;mLexer;mRootPart;get lexer(){return this.mLexer}constructor(t,r){this.mLexer=t,this.mRootPart=null,this.mConfiguration={keepTraceIncidents:!1,trimTokenCache:!1,...r}}parse(t,r){if(this.mRootPart===null)throw new A("Parser has not root part set.",this);let n=new we(this.mLexer.tokenize(t,r),this.mConfiguration.keepTraceIncidents,this.mConfiguration.trimTokenCache),u=(()=>{try{return this.beginParseProcess(n,this.mRootPart)}catch(v){if(v instanceof Lt)return n.incidentTrace.push(v.message,n.currentGraph,v.lineStart,v.columnStart,v.lineEnd,v.columnEnd,!0,v),Z.PARSER_ERROR;let w=v instanceof Error?v.message:v.toString(),S=n.getGraphPosition();return n.incidentTrace.push(w,n.currentGraph,S.lineStart,S.columnStart,S.lineEnd,S.columnEnd,!0,v),Z.PARSER_ERROR}})();if(u===Z.PARSER_ERROR)throw new Z(n.incidentTrace);let d=n.collapse();if(d.length!==0){let v=d[0];if(n.incidentTrace.top.range.lineEnd===1&&n.incidentTrace.top.range.columnEnd===1){let w=`Tokens could not be parsed. Graph end meet without reaching last token. Current: "${v.value}" (${v.type})`;n.incidentTrace.push(w,this.mRootPart,v.lineNumber,v.columnNumber,v.lineNumber,v.columnNumber)}throw new Z(n.incidentTrace)}return u}setRootGraph(t){this.mRootPart=t}beginParseProcess(t,r){t.moveNextToken(),t.processStack.push({type:"graph-parse",parameter:{graph:r,linear:!0},state:0});let n=p.NODE_NULL_RESULT;for(;t.processStack.top;)n=this.processStack(t,t.processStack.top,n);return n}processChainedNodeParseProcess(t,r,n){switch(r.state){case 0:{let v=r.parameter.node.connections.next;return v===null?(t.processStack.pop(),{}):(r.state++,t.processStack.push({type:"node-parse",parameter:{node:v},state:0,values:{}}),p.NODE_NULL_RESULT)}case 1:{let u=n;return u===Z.PARSER_ERROR?(t.processStack.pop(),Z.PARSER_ERROR):(t.processStack.pop(),u)}}throw new A(`Invalid node next parse state "${r.state}".`,this)}processGraphParseProcess(t,r,n){let u=r.parameter.graph;switch(r.state){case 0:{if(t.graphIsCircular(u)){let v=t.getGraphPosition();return t.incidentTrace.push("Circular graph detected.",u,v.lineStart,v.columnStart,v.lineEnd,v.columnEnd),t.processStack.pop(),Z.PARSER_ERROR}let d=r.parameter.linear;return t.pushGraphStack(u,d),r.state++,t.processStack.push({type:"node-parse",parameter:{node:u.node},state:0,values:{}}),p.NODE_NULL_RESULT}case 1:{let d=n;if(d===Z.PARSER_ERROR)return t.popGraphStack(!0),t.processStack.pop(),Z.PARSER_ERROR;let v=u.convert(d,t);if(typeof v=="symbol"){let w=t.getGraphPosition();return t.incidentTrace.push(v.description??"Unknown data convert error",w.graph,w.lineStart,w.columnStart,w.lineEnd,w.columnEnd),t.popGraphStack(!0),t.processStack.pop(),Z.PARSER_ERROR}return t.popGraphStack(!1),t.processStack.pop(),v}}throw new A(`Invalid graph parse state "${r.state}".`,this)}processNodeParseProcess(t,r,n){let u=r.parameter.node;switch(r.state){case 0:return t.processStack.push({type:"node-value-parse",parameter:{node:u,valueIndex:0},state:0,values:{}}),r.state++,p.NODE_NULL_RESULT;case 1:{let d=n;return d===Z.PARSER_ERROR?(t.processStack.pop(),Z.PARSER_ERROR):(r.values.nodeValueResult=d,t.processStack.push({type:"node-next-parse",parameter:{node:u},state:0}),r.state++,p.NODE_NULL_RESULT)}case 2:{let d=n;if(d===Z.PARSER_ERROR)return t.processStack.pop(),Z.PARSER_ERROR;let v=u.mergeData(r.values.nodeValueResult,d);return t.processStack.pop(),v}}throw new A(`Invalid node parse state "${r.state}".`,this)}processNodeValueParseProcess(t,r,n){let u=r.parameter.node;switch(r.state){case 0:{if(n!==p.NODE_NULL_RESULT&&n!==Z.PARSER_ERROR)return r.values.parseResult=n,r.state++,p.NODE_NULL_RESULT;let d=r.parameter.valueIndex,v=u.connections;if(d>=v.values.length)return r.values.parseResult=p.NODE_VALUE_LIST_END_MEET,r.state++,p.NODE_NULL_RESULT;r.parameter.valueIndex++;let w=t.currentToken,S=v.values[d];if(typeof S=="string"){if(!w){if(v.required){let D=t.getTokenPosition();t.incidentTrace.push(`Unexpected end of statement. Token "${S}" expected.`,t.currentGraph,D.lineStart,D.columnStart,D.lineEnd,D.columnEnd)}return p.NODE_NULL_RESULT}if(S!==w.type){if(v.required){let D=t.getTokenPosition();t.incidentTrace.push(`Unexpected token "${w.value}". "${S}" expected`,t.currentGraph,D.lineStart,D.columnStart,D.lineEnd,D.columnEnd)}return p.NODE_NULL_RESULT}return t.moveNextToken(),w.value}else{let D=v.values.length===1||v.values.length===d+1;return t.processStack.push({type:"graph-parse",parameter:{graph:S,linear:D},state:0}),p.NODE_NULL_RESULT}}case 1:{let d=r.values.parseResult,v=u.connections;if(d===p.NODE_VALUE_LIST_END_MEET&&!v.required){t.processStack.pop();return}return d===p.NODE_VALUE_LIST_END_MEET?(t.processStack.pop(),Z.PARSER_ERROR):(t.processStack.pop(),d)}}throw new A(`Invalid node value parse state "${r.state}".`,this)}processStack(t,r,n){switch(r.type){case"graph-parse":return this.processGraphParseProcess(t,r,n);case"node-parse":return this.processNodeParseProcess(t,r,n);case"node-value-parse":return this.processNodeValueParseProcess(t,r,n);case"node-next-parse":return this.processChainedNodeParseProcess(t,r,n)}}};var J=class p{static define(t,r=!1){return new p(t,r)}mDataConverterList;mGraphCollector;mIsJunction;mResolvedGraphNode;get isJunction(){return this.mIsJunction}get node(){return this.mResolvedGraphNode||(this.mResolvedGraphNode=this.mGraphCollector().root),this.mResolvedGraphNode}constructor(t,r){this.mGraphCollector=t,this.mDataConverterList=new Array,this.mResolvedGraphNode=null,this.mIsJunction=r}convert(t,r){if(this.mDataConverterList.length===0)return t;let n=r.getGraphBoundingToken(),u=n[0]??void 0,d=n[1]??void 0;if(this.mDataConverterList.length===1)return this.mDataConverterList[0](t,u,d);let v=t;for(let w of this.mDataConverterList)if(v=w(v,u,d),typeof v=="symbol")return v;return v}converter(t){let r=new p(this.mGraphCollector,this.isJunction);return r.mDataConverterList.push(...this.mDataConverterList,t),r}};var X=class p{static new(){let t=new p("",!1,[]);return t.mRootNode=null,t}mConnections;mIdentifier;mRootNode;get configuration(){return{dataKey:this.mIdentifier.dataKey,isList:this.mIdentifier.type==="list",isRequired:this.mConnections.required,isBranch:this.mConnections.values.length>1}}get connections(){return this.mConnections}get root(){if(!this.mRootNode)throw new A("Staring nodes must be chained with another node to be used.",this);return this.mRootNode}constructor(t,r,n,u){if(t==="")this.mIdentifier={type:"empty",dataKey:"",mergeKey:""};else if(t.endsWith("[]"))this.mIdentifier={type:"list",mergeKey:"",dataKey:t.substring(0,t.length-2)};else if(t.includes("<-")){let v=t.split("<-");this.mIdentifier={type:"merge",dataKey:v[0],mergeKey:v[1]}}else this.mIdentifier={type:"single",mergeKey:"",dataKey:t};let d=n.map(v=>v instanceof p?J.define(()=>v):v);this.mConnections={required:r,values:d,next:null},u?this.mRootNode=u:this.mRootNode=this}mergeData(t,r){if(this.mIdentifier.type==="empty")return r;let n=r,u=typeof t>"u";if(this.mIdentifier.type==="single"){if(this.mIdentifier.dataKey in r)throw new A(`Graph path has a duplicate value identifier "${this.mIdentifier.dataKey}"`,this);return u||(n[this.mIdentifier.dataKey]=t),r}if(this.mIdentifier.type==="list"){let w;u?w=new Array:Array.isArray(t)?w=t:w=[t];let S=(()=>{if(this.mIdentifier.dataKey in r){let D=n[this.mIdentifier.dataKey];return Array.isArray(D)?(D.unshift(...w),D):(w.push(D),w)}return w})();return n[this.mIdentifier.dataKey]=S,r}if(u)return r;let d=(()=>{if(!this.mIdentifier.mergeKey)throw new A("Cant merge data without a merge key.",this);if(typeof t!="object"||t===null)throw new A("Node data must be an object when merge key is set.",this);if(!(this.mIdentifier.mergeKey in t))throw new A(`Node data does not contain merge key "${this.mIdentifier.mergeKey}"`,this);return t[this.mIdentifier.mergeKey]})();if(typeof d>"u")return r;let v=n[this.mIdentifier.dataKey];if(typeof v>"u")return n[this.mIdentifier.dataKey]=d,n;if(!Array.isArray(v))throw new A("Chain data merge value is not an array but should be.",this);return Array.isArray(d)?v.unshift(...d):v.unshift(d),r}optional(t,r){let n=typeof r>"u"?"":t,u=typeof r>"u"?t:r,d=new Array;Array.isArray(u)?d.push(...u):d.push(u);let v=new p(n,!1,d,this.mRootNode);return this.setChainedNode(v),v}required(t,r){let n=typeof r>"u"?"":t,u=typeof r>"u"?t:r,d=new Array;Array.isArray(u)?d.push(...u):d.push(u);let v=new p(n,!0,d,this.mRootNode);return this.setChainedNode(v),v}setChainedNode(t){if(this.mConnections.next!==null)throw new A("Node can only be chained to a single node.",this);this.mConnections.next=t}};var O={XmlIdentifier:"Identifier",XmlAssignment:"XmlAssignment",XmlValue:"XmlValue",XmlComment:"XmlComment",XmlOpenClosingBracket:"XmlOpenClosingBracket",XmlCloseBracket:"XmlCloseBracket",XmlOpenBracket:"XmlOpenBracket",XmlCloseClosingBracket:"XmlCloseClosingBracket",XmlExplicitValueIdentifier:"XmlExplicitValueIdentifier",ExpressionStart:"ExpressionStart",ExpressionEnd:"ExpressionEnd",ExpressionValue:"ExpressionValue",InstructionStart:"InstructionStart",InstructionInstructionValue:"InstructionInstructionValue",InstructionBodyStartBraket:"InstructionBodyStartBraket",InstructionBodyCloseBraket:"InstructionBodyCloseBraket",InstructionInstructionClosingBracket:"InstructionInstructionClosingBracket",InstructionInstructionOpeningBracket:"InstructionInstructionOpeningBracket"};var xe=class extends kt{constructor(){super(),this.validWhitespaces=` 
\r`,this.trimWhitespace=!0;let t=this.createTokenPattern({pattern:{regex:/(?:(?!}}).)*/,type:O.ExpressionValue}}),r=this.createTokenPattern({pattern:{start:{regex:/{{/,type:O.ExpressionStart},end:{regex:/}}/,type:O.ExpressionEnd}}},s=>{s.useChildPattern(t)}),n=this.createTokenPattern({pattern:{regex:/[^>\s\n="/]+/,type:O.XmlIdentifier}}),u=this.createTokenPattern({pattern:{regex:/(?:(?!{{|"|<).)+/,type:O.XmlValue}}),d=this.createTokenPattern({pattern:{regex:/<!--.*?-->/,type:O.XmlComment}}),v=this.createTokenPattern({pattern:{regex:/=/,type:O.XmlAssignment}}),w=this.createTokenPattern({pattern:{start:{regex:/"/,type:O.XmlExplicitValueIdentifier},end:{regex:/"/,type:O.XmlExplicitValueIdentifier}}},s=>{s.useChildPattern(r),s.useChildPattern(u)}),S=this.createTokenPattern({pattern:{start:{regex:/<\//,type:O.XmlOpenClosingBracket},end:{regex:/>/,type:O.XmlCloseBracket}}},s=>{s.useChildPattern(n)}),D=this.createTokenPattern({pattern:{start:{regex:/</,type:O.XmlOpenBracket},end:{regex:/(?<closeClosingBracket>\/>)|(?<closeBracket>>)/,type:{closeClosingBracket:O.XmlCloseClosingBracket,closeBracket:O.XmlCloseBracket}}}},s=>{s.useChildPattern(v),s.useChildPattern(n),s.useChildPattern(w)}),a=this.createTokenPattern({pattern:{regex:/[^()"'`/)]+/,type:O.InstructionInstructionValue}}),o=this.createTokenPattern({pattern:{innerType:O.InstructionInstructionValue,start:{regex:/\//,type:O.InstructionInstructionValue},end:{regex:/\//,type:O.InstructionInstructionValue}}},s=>{s.useChildPattern(l),s.useChildPattern(e),s.useChildPattern(y),s.useChildPattern(c),s.useChildPattern(a)}),c=this.createTokenPattern({pattern:{innerType:O.InstructionInstructionValue,start:{regex:/\(/,type:O.InstructionInstructionValue},end:{regex:/\)/,type:O.InstructionInstructionValue}}},s=>{s.useChildPattern(o),s.useChildPattern(l),s.useChildPattern(e),s.useChildPattern(y),s.useChildPattern(a)}),l=this.createTokenPattern({pattern:{innerType:O.InstructionInstructionValue,start:{regex:/"/,type:O.InstructionInstructionValue},end:{regex:/"/,type:O.InstructionInstructionValue}}},s=>{s.useChildPattern(o),s.useChildPattern(e),s.useChildPattern(y),s.useChildPattern(c),s.useChildPattern(a)}),e=this.createTokenPattern({pattern:{innerType:O.InstructionInstructionValue,start:{regex:/'/,type:O.InstructionInstructionValue},end:{regex:/'/,type:O.InstructionInstructionValue}}},s=>{s.useChildPattern(o),s.useChildPattern(l),s.useChildPattern(y),s.useChildPattern(c),s.useChildPattern(a)}),y=this.createTokenPattern({pattern:{innerType:O.InstructionInstructionValue,start:{regex:/`/,type:O.InstructionInstructionValue},end:{regex:/`/,type:O.InstructionInstructionValue}}},s=>{s.useChildPattern(o),s.useChildPattern(l),s.useChildPattern(e),s.useChildPattern(c),s.useChildPattern(a)}),g=this.createTokenPattern({pattern:{regex:/\$[^(\s\n/{]+/,type:O.InstructionStart}}),T=this.createTokenPattern({pattern:{start:{regex:/\(/,type:O.InstructionInstructionOpeningBracket},end:{regex:/\)/,type:O.InstructionInstructionClosingBracket}}},s=>{s.useChildPattern(o),s.useChildPattern(l),s.useChildPattern(e),s.useChildPattern(y),s.useChildPattern(c),s.useChildPattern(a)}),b=this.createTokenPattern({pattern:{start:{regex:/{/,type:O.InstructionBodyStartBraket},end:{regex:/}/,type:O.InstructionBodyCloseBraket}}},s=>{for(let m of f)s.useChildPattern(m)}),f=[d,S,D,w,r,g,T,b,u];for(let s of f)this.useRootTokenPattern(s)}};var ee=class extends te{constructor(){super(new xe),this.initGraph()}initGraph(){let t=J.define(()=>X.new().required(O.ExpressionStart).optional("value",O.ExpressionValue).required(O.ExpressionEnd)).converter(e=>new ht(e.value??"")),r=J.define(()=>{let e=r;return X.new().required("data[]",X.new().required("value",[t,X.new().required("text",O.XmlValue)])).optional("data<-data",e)}),n=J.define(()=>X.new().required("name",O.XmlIdentifier).optional("attributeValue",X.new().required(O.XmlAssignment).required(O.XmlExplicitValueIdentifier).optional("list<-data",r).required(O.XmlExplicitValueIdentifier))).converter(e=>{let y=new Array;if(e.attributeValue?.list)for(let g of e.attributeValue.list)g.value instanceof ht?y.push(g.value):y.push(g.value.text);return{name:e.name,values:y}}),u=J.define(()=>{let e=u;return X.new().required("data[]",n).optional("data<-data",e)}),d=J.define(()=>{let e=d;return X.new().required("data[]",X.new().required("value",[t,X.new().required("text",O.XmlValue),X.new().required(O.XmlExplicitValueIdentifier).required("text",O.XmlValue).required(O.XmlExplicitValueIdentifier)])).optional("data<-data",e)}),v=J.define(()=>X.new().required("list<-data",d)).converter(e=>{let y=new gt;for(let g of e.list)g.value instanceof ht?y.addValue(g.value):y.addValue(g.value.text);return y}),w=J.define(()=>X.new().required(O.XmlComment)).converter(()=>null),S=J.define(()=>X.new().required(O.XmlOpenBracket).required("openingTagName",O.XmlIdentifier).optional("attributes<-data",u).required("closing",[X.new().required(O.XmlCloseClosingBracket),X.new().required(O.XmlCloseBracket).required("values",c).required(O.XmlOpenClosingBracket).required("closingTageName",O.XmlIdentifier).required(O.XmlCloseBracket)])).converter(e=>{if("closingTageName"in e.closing&&e.openingTagName!==e.closing.closingTageName)throw new A(`Opening (${e.openingTagName}) and closing tagname (${e.closing.closingTageName}) does not match`,this);let y=new yt(e.openingTagName);if(e.attributes)for(let g of e.attributes)y.setAttribute(g.name).addValue(...g.values);return"values"in e.closing&&y.appendChild(...e.closing.values),y}),D=J.define(()=>{let e=D;return X.new().required("list[]",O.InstructionInstructionValue).optional("list<-list",e)}),a=J.define(()=>X.new().required("instructionName",O.InstructionStart).optional("instruction",X.new().required(O.InstructionInstructionOpeningBracket).required("value<-list",D).required(O.InstructionInstructionClosingBracket)).optional("body",X.new().required(O.InstructionBodyStartBraket).required("value",c).required(O.InstructionBodyCloseBraket))).converter(e=>{let y=e.instructionName.substring(1),g=e.instruction?.value.join("")??"",T=new At(y,g);return e.body&&T.appendChild(...e.body.value),T}),o=J.define(()=>{let e=o;return X.new().required("list[]",[w,S,a,v]).optional("list<-list",e)}),c=J.define(()=>{let e=o;return X.new().optional("list<-list",e)}).converter(e=>{let y=new Array;if(e.list)for(let g of e.list)g!==null&&y.push(g);return y}),l=J.define(()=>X.new().required("content",c)).converter(e=>{let y=new it;return y.appendChild(...e.content),y});this.setRootGraph(l)}};var et=class p extends fe{static mTemplateCache=new Q;static mXmlParser=new ee;mComponentElement;mRootBuilder;get element(){return this.mComponentElement.htmlElement}constructor(t){super({constructor:t.processorConstructor,parent:null}),ot.registerComponent(this,t.htmlElement),this.setProcessorInjection(p,this),this.addConstructionHook(n=>{ot.registerComponent(this,this.mComponentElement.htmlElement,n)}),p.mTemplateCache.has(t.processorConstructor)||p.mTemplateCache.set(t.processorConstructor,p.mXmlParser.parse(t.templateString??""));let r=p.mTemplateCache.get(t.processorConstructor).clone();this.mComponentElement=new Qt(t.htmlElement),this.mRootBuilder=new jt(r,new ye(this,t.expressionModule),new ct(this),"ROOT"),this.mComponentElement.shadowRoot.appendChild(this.mRootBuilder.anchor),this.setProcessorInjection(ft,new ft(this.mRootBuilder.values))}addStyle(t){let r=document.createElement("style");r.innerHTML=t,this.mComponentElement.shadowRoot.prepend(r)}attributeChanged(t,r,n){this.call("onAttributeChange",t,r,n)}connected(){this.call("onConnect")}deconstruct(){this.call("onDeconstruct"),this.mRootBuilder.deconstruct(),super.deconstruct()}disconnected(){this.call("onDisconnect")}onUpdate(){return this.mRootBuilder.update()?(this.call("onUpdate"),!0):!1}};function W(p){return(t,r)=>{F.registerInjectable(t,r.metadata,"instanced"),ot.registerConstructor(t,p.selector);let n=class extends HTMLElement{mComponent;constructor(){super(),this.mComponent=new et({processorConstructor:t,templateString:p.template??null,expressionModule:p.expressionmodule,htmlElement:this}).setup(),p.style&&this.mComponent.addStyle(p.style),this.mComponent.updater.update()}connectedCallback(){this.mComponent.connected()}disconnectedCallback(){this.mComponent.disconnected()}};globalThis.customElements.define(p.selector,n)}}function Rt(p){return(t,r)=>{F.registerInjectable(t,r.metadata,"instanced"),nt.register(Ct,t,{access:p.access,targetRestrictions:p.targetRestrictions})}}function bt(p){return(t,r)=>{F.registerInjectable(t,r.metadata,"instanced"),nt.register(mt,t,{access:p.access,selector:p.selector})}}function wt(p){return(t,r)=>{F.registerInjectable(t,r.metadata,"instanced"),nt.register(_t,t,{instructionType:p.instructionType})}}function js(){function p(a,o){return function(l){r(o,"addInitializer"),n(l,"An initializer"),a.push(l)}}function t(a,o,c,l,e,y,g,T,b){var f;switch(e){case 1:f="accessor";break;case 2:f="method";break;case 3:f="getter";break;case 4:f="setter";break;default:f="field"}var s={kind:f,name:g?"#"+o:o,static:y,private:g,metadata:T},m={v:!1};s.addInitializer=p(l,m);var i,h;e===0?g?(i=c.get,h=c.set):(i=function(){return this[o]},h=function(x){this[o]=x}):e===2?i=function(){return c.value}:((e===1||e===3)&&(i=function(){return c.get.call(this)}),(e===1||e===4)&&(h=function(x){c.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return a(b,s)}finally{m.v=!0}}function r(a,o){if(a.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(a,o){if(typeof a!="function")throw new TypeError(o+" must be a function")}function u(a,o){var c=typeof o;if(a===1){if(c!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(c!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function d(a,o,c,l,e,y,g,T,b){var f=c[0],s,m,i;g?e===0||e===1?s={get:c[3],set:c[4]}:e===3?s={get:c[3]}:e===4?s={set:c[3]}:s={value:c[3]}:e!==0&&(s=Object.getOwnPropertyDescriptor(o,l)),e===1?i={get:s.get,set:s.set}:e===2?i=s.value:e===3?i=s.get:e===4&&(i=s.set);var h,x,I;if(typeof f=="function")h=t(f,l,s,T,e,y,g,b,i),h!==void 0&&(u(e,h),e===0?m=h:e===1?(m=h.init,x=h.get||i.get,I=h.set||i.set,i={get:x,set:I}):i=h);else for(var _=f.length-1;_>=0;_--){var P=f[_];if(h=t(P,l,s,T,e,y,g,b,i),h!==void 0){u(e,h);var N;e===0?N=h:e===1?(N=h.init,x=h.get||i.get,I=h.set||i.set,i={get:x,set:I}):i=h,N!==void 0&&(m===void 0?m=N:typeof m=="function"?m=[m,N]:m.push(N))}}if(e===0||e===1){if(m===void 0)m=function(C,E){return E};else if(typeof m!="function"){var M=m;m=function(C,E){for(var L=E,R=0;R<M.length;R++)L=M[R].call(C,L);return L}}else{var B=m;m=function(C,E){return B.call(C,E)}}a.push(m)}e!==0&&(e===1?(s.get=i.get,s.set=i.set):e===2?s.value=i:e===3?s.get=i:e===4&&(s.set=i),g?e===1?(a.push(function(C,E){return i.get.call(C,E)}),a.push(function(C,E){return i.set.call(C,E)})):e===2?a.push(i):a.push(function(C,E){return i.call(C,E)}):Object.defineProperty(o,l,s))}function v(a,o,c){for(var l=[],e,y,g=new Map,T=new Map,b=0;b<o.length;b++){var f=o[b];if(Array.isArray(f)){var s=f[1],m=f[2],i=f.length>3,h=s>=5,x,I;if(h?(x=a,s=s-5,y=y||[],I=y):(x=a.prototype,e=e||[],I=e),s!==0&&!i){var _=h?T:g,P=_.get(m)||0;if(P===!0||P===3&&s!==4||P===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+m);!P&&s>2?_.set(m,s):_.set(m,!0)}d(l,x,f,m,s,h,i,I,c)}}return w(l,e),w(l,y),l}function w(a,o){o&&a.push(function(c){for(var l=0;l<o.length;l++)o[l].call(c);return c})}function S(a,o,c){if(o.length>0){for(var l=[],e=a,y=a.name,g=o.length-1;g>=0;g--){var T={v:!1};try{var b=o[g](e,{kind:"class",name:y,addInitializer:p(l,T),metadata:c})}finally{T.v=!0}b!==void 0&&(u(10,b),e=b)}return[D(e,c),function(){for(var f=0;f<l.length;f++)l[f].call(e)}]}}function D(a,o){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,c,l,e){if(e!==void 0)var y=e[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(y===void 0?null:y),T=v(o,c,g);return l.length||D(o,g),{e:T,get c(){return S(o,l,g)}}}}function He(p,t,r,n){return(He=js())(p,t,r,n)}function zs(p){return p}var Ye,Xe,re;Ye=Rt({access:q.Read,targetRestrictions:[et]});new class extends zs{constructor(){super(re),Xe()}static{class p{static{({c:[re,Xe]}=He(this,[],[Ye]))}static METADATA_USER_EVENT_LISTENER_PROPERIES="pwb:user_event_listener_properties";mEventListenerList;mTargetElement;constructor(r=F.use(et)){let n=new Array,u=r.processorConstructor;do{let d=tt.get(u).getMetadata(p.METADATA_USER_EVENT_LISTENER_PROPERIES);if(d)for(let v of d)n.push(v)}while(u=Object.getPrototypeOf(u));this.mEventListenerList=new Array,this.mTargetElement=r.element;for(let d of n){let[v,w]=d,S=Reflect.get(r.processor,v);S=S.bind(r.processor),this.mEventListenerList.push([w,S]),this.mTargetElement.addEventListener(w,S)}}onDeconstruct(){for(let r of this.mEventListenerList){let[n,u]=r;this.mTargetElement.removeEventListener(n,u)}}}}};var oe=class extends window.Event{mValue;get value(){return this.mValue}constructor(t,r){super(t),this.mValue=r}};var ne=class{mElement;mEventName;constructor(t,r){this.mEventName=t,this.mElement=r}dispatchEvent(t){let r=new oe(this.mEventName,t);this.mElement.dispatchEvent(r)}};function z(p){return(t,r)=>{if(r.static)throw new A("Event target is not for a static property.",z);let n=null;return{get(){if(!n){let u=(()=>{try{return ot.ofProcessor(this).component}catch{throw new A("PwbComponentEvent target class is not a component.",this)}})();n=new ne(p,u.element)}return n}}}}function Gs(){function p(a,o){return function(l){r(o,"addInitializer"),n(l,"An initializer"),a.push(l)}}function t(a,o,c,l,e,y,g,T,b){var f;switch(e){case 1:f="accessor";break;case 2:f="method";break;case 3:f="getter";break;case 4:f="setter";break;default:f="field"}var s={kind:f,name:g?"#"+o:o,static:y,private:g,metadata:T},m={v:!1};s.addInitializer=p(l,m);var i,h;e===0?g?(i=c.get,h=c.set):(i=function(){return this[o]},h=function(x){this[o]=x}):e===2?i=function(){return c.value}:((e===1||e===3)&&(i=function(){return c.get.call(this)}),(e===1||e===4)&&(h=function(x){c.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return a(b,s)}finally{m.v=!0}}function r(a,o){if(a.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(a,o){if(typeof a!="function")throw new TypeError(o+" must be a function")}function u(a,o){var c=typeof o;if(a===1){if(c!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(c!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function d(a,o,c,l,e,y,g,T,b){var f=c[0],s,m,i;g?e===0||e===1?s={get:c[3],set:c[4]}:e===3?s={get:c[3]}:e===4?s={set:c[3]}:s={value:c[3]}:e!==0&&(s=Object.getOwnPropertyDescriptor(o,l)),e===1?i={get:s.get,set:s.set}:e===2?i=s.value:e===3?i=s.get:e===4&&(i=s.set);var h,x,I;if(typeof f=="function")h=t(f,l,s,T,e,y,g,b,i),h!==void 0&&(u(e,h),e===0?m=h:e===1?(m=h.init,x=h.get||i.get,I=h.set||i.set,i={get:x,set:I}):i=h);else for(var _=f.length-1;_>=0;_--){var P=f[_];if(h=t(P,l,s,T,e,y,g,b,i),h!==void 0){u(e,h);var N;e===0?N=h:e===1?(N=h.init,x=h.get||i.get,I=h.set||i.set,i={get:x,set:I}):i=h,N!==void 0&&(m===void 0?m=N:typeof m=="function"?m=[m,N]:m.push(N))}}if(e===0||e===1){if(m===void 0)m=function(C,E){return E};else if(typeof m!="function"){var M=m;m=function(C,E){for(var L=E,R=0;R<M.length;R++)L=M[R].call(C,L);return L}}else{var B=m;m=function(C,E){return B.call(C,E)}}a.push(m)}e!==0&&(e===1?(s.get=i.get,s.set=i.set):e===2?s.value=i:e===3?s.get=i:e===4&&(s.set=i),g?e===1?(a.push(function(C,E){return i.get.call(C,E)}),a.push(function(C,E){return i.set.call(C,E)})):e===2?a.push(i):a.push(function(C,E){return i.call(C,E)}):Object.defineProperty(o,l,s))}function v(a,o,c){for(var l=[],e,y,g=new Map,T=new Map,b=0;b<o.length;b++){var f=o[b];if(Array.isArray(f)){var s=f[1],m=f[2],i=f.length>3,h=s>=5,x,I;if(h?(x=a,s=s-5,y=y||[],I=y):(x=a.prototype,e=e||[],I=e),s!==0&&!i){var _=h?T:g,P=_.get(m)||0;if(P===!0||P===3&&s!==4||P===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+m);!P&&s>2?_.set(m,s):_.set(m,!0)}d(l,x,f,m,s,h,i,I,c)}}return w(l,e),w(l,y),l}function w(a,o){o&&a.push(function(c){for(var l=0;l<o.length;l++)o[l].call(c);return c})}function S(a,o,c){if(o.length>0){for(var l=[],e=a,y=a.name,g=o.length-1;g>=0;g--){var T={v:!1};try{var b=o[g](e,{kind:"class",name:y,addInitializer:p(l,T),metadata:c})}finally{T.v=!0}b!==void 0&&(u(10,b),e=b)}return[D(e,c),function(){for(var f=0;f<l.length;f++)l[f].call(e)}]}}function D(a,o){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,c,l,e){if(e!==void 0)var y=e[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(y===void 0?null:y),T=v(o,c,g);return l.length||D(o,g),{e:T,get c(){return S(o,l,g)}}}}function Ze(p,t,r,n){return(Ze=Gs())(p,t,r,n)}function Us(p){return p}var qe,We,ie;qe=Rt({access:q.ReadWrite,targetRestrictions:[et]});new class extends Us{constructor(){super(ie),We()}static{class p{static{({c:[ie,We]}=Ze(this,[],[qe]))}static METADATA_EXPORTED_PROPERTIES="pwb:exported_properties";mComponent;constructor(r=F.use(et)){this.mComponent=r;let n=new Pt,u=r.processorConstructor;do{let v=tt.get(u).getMetadata(p.METADATA_EXPORTED_PROPERTIES);v&&n.push(...v)}while(u=Object.getPrototypeOf(u));let d=new Set(n);d.size>0&&this.connectExportedProperties(d)}connectExportedProperties(r){this.exportPropertyAsAttribute(r),this.patchHtmlAttributes(r)}exportPropertyAsAttribute(r){for(let n of r){let u={};u.enumerable=!0,u.configurable=!0,delete u.value,delete u.writable,u.set=d=>{Reflect.set(this.mComponent.processor,n,d)},u.get=()=>{let d=Reflect.get(this.mComponent.processor,n);return typeof d=="function"&&(d=d.bind(this.mComponent.processor)),d},Object.defineProperty(this.mComponent.element,n,u)}}patchHtmlAttributes(r){let n=this.mComponent.element.getAttribute;new MutationObserver(d=>{for(let v of d){let w=v.attributeName,S=n.call(this.mComponent.element,w);Reflect.set(this.mComponent.element,w,S),this.mComponent.attributeChanged(w,v.oldValue,S)}}).observe(this.mComponent.element,{attributeFilter:[...r],attributeOldValue:!0});for(let d of r)if(this.mComponent.element.hasAttribute(d)){let v=n.call(this.mComponent.element,d);this.mComponent.element.setAttribute(d,v)}this.mComponent.element.getAttribute=d=>r.has(d)?Reflect.get(this.mComponent.element,d):n.call(this.mComponent.element,d)}}}};function $(p,t){if(t.static)throw new A("Event target is not for a static property.",$);let r=tt.forInternalDecorator(t.metadata),n=r.getMetadata(ie.METADATA_EXPORTED_PROPERTIES)??new Array;n.push(t.name),r.setMetadata(ie.METADATA_EXPORTED_PROPERTIES,n)}function lt(p){return(t,r)=>{if(r.static)throw new A("Child decorator is not for a static property.",lt);return{get(){let d=(()=>{try{return ot.ofProcessor(this).component}catch{throw new A("PwbChild target class is not a component.",this)}})().getProcessorInjection(ft).data.store[p];if(d instanceof Element)return d;throw new A(`Can't find child "${p}".`,this)}}}}function Xs(){function p(a,o){return function(l){r(o,"addInitializer"),n(l,"An initializer"),a.push(l)}}function t(a,o,c,l,e,y,g,T,b){var f;switch(e){case 1:f="accessor";break;case 2:f="method";break;case 3:f="getter";break;case 4:f="setter";break;default:f="field"}var s={kind:f,name:g?"#"+o:o,static:y,private:g,metadata:T},m={v:!1};s.addInitializer=p(l,m);var i,h;e===0?g?(i=c.get,h=c.set):(i=function(){return this[o]},h=function(x){this[o]=x}):e===2?i=function(){return c.value}:((e===1||e===3)&&(i=function(){return c.get.call(this)}),(e===1||e===4)&&(h=function(x){c.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return a(b,s)}finally{m.v=!0}}function r(a,o){if(a.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(a,o){if(typeof a!="function")throw new TypeError(o+" must be a function")}function u(a,o){var c=typeof o;if(a===1){if(c!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(c!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function d(a,o,c,l,e,y,g,T,b){var f=c[0],s,m,i;g?e===0||e===1?s={get:c[3],set:c[4]}:e===3?s={get:c[3]}:e===4?s={set:c[3]}:s={value:c[3]}:e!==0&&(s=Object.getOwnPropertyDescriptor(o,l)),e===1?i={get:s.get,set:s.set}:e===2?i=s.value:e===3?i=s.get:e===4&&(i=s.set);var h,x,I;if(typeof f=="function")h=t(f,l,s,T,e,y,g,b,i),h!==void 0&&(u(e,h),e===0?m=h:e===1?(m=h.init,x=h.get||i.get,I=h.set||i.set,i={get:x,set:I}):i=h);else for(var _=f.length-1;_>=0;_--){var P=f[_];if(h=t(P,l,s,T,e,y,g,b,i),h!==void 0){u(e,h);var N;e===0?N=h:e===1?(N=h.init,x=h.get||i.get,I=h.set||i.set,i={get:x,set:I}):i=h,N!==void 0&&(m===void 0?m=N:typeof m=="function"?m=[m,N]:m.push(N))}}if(e===0||e===1){if(m===void 0)m=function(C,E){return E};else if(typeof m!="function"){var M=m;m=function(C,E){for(var L=E,R=0;R<M.length;R++)L=M[R].call(C,L);return L}}else{var B=m;m=function(C,E){return B.call(C,E)}}a.push(m)}e!==0&&(e===1?(s.get=i.get,s.set=i.set):e===2?s.value=i:e===3?s.get=i:e===4&&(s.set=i),g?e===1?(a.push(function(C,E){return i.get.call(C,E)}),a.push(function(C,E){return i.set.call(C,E)})):e===2?a.push(i):a.push(function(C,E){return i.call(C,E)}):Object.defineProperty(o,l,s))}function v(a,o,c){for(var l=[],e,y,g=new Map,T=new Map,b=0;b<o.length;b++){var f=o[b];if(Array.isArray(f)){var s=f[1],m=f[2],i=f.length>3,h=s>=5,x,I;if(h?(x=a,s=s-5,y=y||[],I=y):(x=a.prototype,e=e||[],I=e),s!==0&&!i){var _=h?T:g,P=_.get(m)||0;if(P===!0||P===3&&s!==4||P===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+m);!P&&s>2?_.set(m,s):_.set(m,!0)}d(l,x,f,m,s,h,i,I,c)}}return w(l,e),w(l,y),l}function w(a,o){o&&a.push(function(c){for(var l=0;l<o.length;l++)o[l].call(c);return c})}function S(a,o,c){if(o.length>0){for(var l=[],e=a,y=a.name,g=o.length-1;g>=0;g--){var T={v:!1};try{var b=o[g](e,{kind:"class",name:y,addInitializer:p(l,T),metadata:c})}finally{T.v=!0}b!==void 0&&(u(10,b),e=b)}return[D(e,c),function(){for(var f=0;f<l.length;f++)l[f].call(e)}]}}function D(a,o){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,c,l,e){if(e!==void 0)var y=e[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(y===void 0?null:y),T=v(o,c,g);return l.length||D(o,g),{e:T,get c(){return S(o,l,g)}}}}function Qe(p,t,r,n){return(Qe=Xs())(p,t,r,n)}var ke,Je,Hs;ke=wt({instructionType:"dynamic-content"});var Ke=class{static{({c:[Hs,Je]}=Qe(this,[],[ke]))}constructor(t=F.use(K),r=F.use(Y)){this.mModuleValues=r,this.mLastTemplate=null,this.mProcedure=this.mModuleValues.createExpressionProcedure(t.value)}mLastTemplate;mModuleValues;mProcedure;onUpdate(){let t=this.mProcedure.execute();if(!t||!(t instanceof it))throw new A("Dynamic content method has a wrong result type.",this);if(this.mLastTemplate!==null&&this.mLastTemplate.equals(t))return null;let r=t.clone();this.mLastTemplate=r;let n=new at;return n.addElement(r,new ct(this.mModuleValues.data)),n}static{Je()}};function Ys(){function p(a,o){return function(l){r(o,"addInitializer"),n(l,"An initializer"),a.push(l)}}function t(a,o,c,l,e,y,g,T,b){var f;switch(e){case 1:f="accessor";break;case 2:f="method";break;case 3:f="getter";break;case 4:f="setter";break;default:f="field"}var s={kind:f,name:g?"#"+o:o,static:y,private:g,metadata:T},m={v:!1};s.addInitializer=p(l,m);var i,h;e===0?g?(i=c.get,h=c.set):(i=function(){return this[o]},h=function(x){this[o]=x}):e===2?i=function(){return c.value}:((e===1||e===3)&&(i=function(){return c.get.call(this)}),(e===1||e===4)&&(h=function(x){c.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return a(b,s)}finally{m.v=!0}}function r(a,o){if(a.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(a,o){if(typeof a!="function")throw new TypeError(o+" must be a function")}function u(a,o){var c=typeof o;if(a===1){if(c!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(c!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function d(a,o,c,l,e,y,g,T,b){var f=c[0],s,m,i;g?e===0||e===1?s={get:c[3],set:c[4]}:e===3?s={get:c[3]}:e===4?s={set:c[3]}:s={value:c[3]}:e!==0&&(s=Object.getOwnPropertyDescriptor(o,l)),e===1?i={get:s.get,set:s.set}:e===2?i=s.value:e===3?i=s.get:e===4&&(i=s.set);var h,x,I;if(typeof f=="function")h=t(f,l,s,T,e,y,g,b,i),h!==void 0&&(u(e,h),e===0?m=h:e===1?(m=h.init,x=h.get||i.get,I=h.set||i.set,i={get:x,set:I}):i=h);else for(var _=f.length-1;_>=0;_--){var P=f[_];if(h=t(P,l,s,T,e,y,g,b,i),h!==void 0){u(e,h);var N;e===0?N=h:e===1?(N=h.init,x=h.get||i.get,I=h.set||i.set,i={get:x,set:I}):i=h,N!==void 0&&(m===void 0?m=N:typeof m=="function"?m=[m,N]:m.push(N))}}if(e===0||e===1){if(m===void 0)m=function(C,E){return E};else if(typeof m!="function"){var M=m;m=function(C,E){for(var L=E,R=0;R<M.length;R++)L=M[R].call(C,L);return L}}else{var B=m;m=function(C,E){return B.call(C,E)}}a.push(m)}e!==0&&(e===1?(s.get=i.get,s.set=i.set):e===2?s.value=i:e===3?s.get=i:e===4&&(s.set=i),g?e===1?(a.push(function(C,E){return i.get.call(C,E)}),a.push(function(C,E){return i.set.call(C,E)})):e===2?a.push(i):a.push(function(C,E){return i.call(C,E)}):Object.defineProperty(o,l,s))}function v(a,o,c){for(var l=[],e,y,g=new Map,T=new Map,b=0;b<o.length;b++){var f=o[b];if(Array.isArray(f)){var s=f[1],m=f[2],i=f.length>3,h=s>=5,x,I;if(h?(x=a,s=s-5,y=y||[],I=y):(x=a.prototype,e=e||[],I=e),s!==0&&!i){var _=h?T:g,P=_.get(m)||0;if(P===!0||P===3&&s!==4||P===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+m);!P&&s>2?_.set(m,s):_.set(m,!0)}d(l,x,f,m,s,h,i,I,c)}}return w(l,e),w(l,y),l}function w(a,o){o&&a.push(function(c){for(var l=0;l<o.length;l++)o[l].call(c);return c})}function S(a,o,c){if(o.length>0){for(var l=[],e=a,y=a.name,g=o.length-1;g>=0;g--){var T={v:!1};try{var b=o[g](e,{kind:"class",name:y,addInitializer:p(l,T),metadata:c})}finally{T.v=!0}b!==void 0&&(u(10,b),e=b)}return[D(e,c),function(){for(var f=0;f<l.length;f++)l[f].call(e)}]}}function D(a,o){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,c,l,e){if(e!==void 0)var y=e[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(y===void 0?null:y),T=v(o,c,g);return l.length||D(o,g),{e:T,get c(){return S(o,l,g)}}}}function rr(p,t,r,n){return(rr=Ys())(p,t,r,n)}var or,tr,Ws;or=bt({access:q.Write,selector:/^\([[\w\-$]+\)$/});var er=class{static{({c:[Ws,tr]}=rr(this,[],[or]))}constructor(t=F.use(k),r=F.use(Y),n=F.use(st)){this.mTarget=t,this.mEventName=n.name.substring(1,n.name.length-1);let u=r.createExpressionProcedure(n.value,["$event"]);this.mListener=d=>{u.setTemporaryValue("$event",d),u.execute()},this.mTarget.addEventListener(this.mEventName,this.mListener)}mEventName;mListener;mTarget;onDeconstruct(){this.mTarget.removeEventListener(this.mEventName,this.mListener)}static{tr()}};function Zs(){function p(a,o){return function(l){r(o,"addInitializer"),n(l,"An initializer"),a.push(l)}}function t(a,o,c,l,e,y,g,T,b){var f;switch(e){case 1:f="accessor";break;case 2:f="method";break;case 3:f="getter";break;case 4:f="setter";break;default:f="field"}var s={kind:f,name:g?"#"+o:o,static:y,private:g,metadata:T},m={v:!1};s.addInitializer=p(l,m);var i,h;e===0?g?(i=c.get,h=c.set):(i=function(){return this[o]},h=function(x){this[o]=x}):e===2?i=function(){return c.value}:((e===1||e===3)&&(i=function(){return c.get.call(this)}),(e===1||e===4)&&(h=function(x){c.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return a(b,s)}finally{m.v=!0}}function r(a,o){if(a.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(a,o){if(typeof a!="function")throw new TypeError(o+" must be a function")}function u(a,o){var c=typeof o;if(a===1){if(c!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(c!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function d(a,o,c,l,e,y,g,T,b){var f=c[0],s,m,i;g?e===0||e===1?s={get:c[3],set:c[4]}:e===3?s={get:c[3]}:e===4?s={set:c[3]}:s={value:c[3]}:e!==0&&(s=Object.getOwnPropertyDescriptor(o,l)),e===1?i={get:s.get,set:s.set}:e===2?i=s.value:e===3?i=s.get:e===4&&(i=s.set);var h,x,I;if(typeof f=="function")h=t(f,l,s,T,e,y,g,b,i),h!==void 0&&(u(e,h),e===0?m=h:e===1?(m=h.init,x=h.get||i.get,I=h.set||i.set,i={get:x,set:I}):i=h);else for(var _=f.length-1;_>=0;_--){var P=f[_];if(h=t(P,l,s,T,e,y,g,b,i),h!==void 0){u(e,h);var N;e===0?N=h:e===1?(N=h.init,x=h.get||i.get,I=h.set||i.set,i={get:x,set:I}):i=h,N!==void 0&&(m===void 0?m=N:typeof m=="function"?m=[m,N]:m.push(N))}}if(e===0||e===1){if(m===void 0)m=function(C,E){return E};else if(typeof m!="function"){var M=m;m=function(C,E){for(var L=E,R=0;R<M.length;R++)L=M[R].call(C,L);return L}}else{var B=m;m=function(C,E){return B.call(C,E)}}a.push(m)}e!==0&&(e===1?(s.get=i.get,s.set=i.set):e===2?s.value=i:e===3?s.get=i:e===4&&(s.set=i),g?e===1?(a.push(function(C,E){return i.get.call(C,E)}),a.push(function(C,E){return i.set.call(C,E)})):e===2?a.push(i):a.push(function(C,E){return i.call(C,E)}):Object.defineProperty(o,l,s))}function v(a,o,c){for(var l=[],e,y,g=new Map,T=new Map,b=0;b<o.length;b++){var f=o[b];if(Array.isArray(f)){var s=f[1],m=f[2],i=f.length>3,h=s>=5,x,I;if(h?(x=a,s=s-5,y=y||[],I=y):(x=a.prototype,e=e||[],I=e),s!==0&&!i){var _=h?T:g,P=_.get(m)||0;if(P===!0||P===3&&s!==4||P===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+m);!P&&s>2?_.set(m,s):_.set(m,!0)}d(l,x,f,m,s,h,i,I,c)}}return w(l,e),w(l,y),l}function w(a,o){o&&a.push(function(c){for(var l=0;l<o.length;l++)o[l].call(c);return c})}function S(a,o,c){if(o.length>0){for(var l=[],e=a,y=a.name,g=o.length-1;g>=0;g--){var T={v:!1};try{var b=o[g](e,{kind:"class",name:y,addInitializer:p(l,T),metadata:c})}finally{T.v=!0}b!==void 0&&(u(10,b),e=b)}return[D(e,c),function(){for(var f=0;f<l.length;f++)l[f].call(e)}]}}function D(a,o){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,c,l,e){if(e!==void 0)var y=e[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(y===void 0?null:y),T=v(o,c,g);return l.length||D(o,g),{e:T,get c(){return S(o,l,g)}}}}function sr(p,t,r,n){return(sr=Zs())(p,t,r,n)}var ar,nr,qs;ar=wt({instructionType:"for"});var ir=class{static{({c:[qs,nr]}=sr(this,[],[ar]))}constructor(t=F.use(ut),r=F.use(Y),n=F.use(K)){this.mTemplate=t,this.mModuleValues=r,this.mLastEntries=new Array;let u=n.value,v=new RegExp(/^\s*([a-zA-Z]+[a-zA-Z0-9]*)\s*of\s+([^;]+)\s*(;\s*([a-zA-Z]+[a-zA-Z0-9]*)\s*=\s*(.*)\s*)?$/).exec(u);if(!v)throw new A(`For-Parameter value has wrong format: ${u}`,this);let w=v[1],S=v[2],D=v[4]??null,a=v[5],o=this.mModuleValues.createExpressionProcedure(S),c=D?this.mModuleValues.createExpressionProcedure(a,["$index",w]):null;this.mExpression={iterateVariableName:w,iterateValueProcedure:o,indexExportVariableName:D,indexExportProcedure:c}}mExpression;mLastEntries;mModuleValues;mTemplate;onUpdate(){let t=new at,r=this.mExpression.iterateValueProcedure.execute();if(typeof r=="object"&&r!==null||Array.isArray(r)){let n=Symbol.iterator in r?Object.entries([...r]):Object.entries(r);if(this.compareEntries(n,this.mLastEntries))return null;this.mLastEntries=n;for(let[u,d]of n)this.addTemplateForElement(t,this.mExpression,d,u);return t}else return null}addTemplateForElement=(t,r,n,u)=>{let d=new ct(this.mModuleValues.data);if(d.setTemporaryValue(r.iterateVariableName,n),r.indexExportProcedure&&r.indexExportVariableName){r.indexExportProcedure.setTemporaryValue("$index",u),r.indexExportProcedure.setTemporaryValue(r.iterateVariableName,n);let w=r.indexExportProcedure.execute();d.setTemporaryValue(r.indexExportVariableName,w)}let v=new it;v.appendChild(...this.mTemplate.childList),t.addElement(v,d)};compareEntries(t,r){if(t.length!==r.length)return!1;for(let n=0;n<t.length;n++){let[u,d]=t[n],[v,w]=r[n];if(u!==v||d!==w)return!1}return!0}static{nr()}};function Js(){function p(a,o){return function(l){r(o,"addInitializer"),n(l,"An initializer"),a.push(l)}}function t(a,o,c,l,e,y,g,T,b){var f;switch(e){case 1:f="accessor";break;case 2:f="method";break;case 3:f="getter";break;case 4:f="setter";break;default:f="field"}var s={kind:f,name:g?"#"+o:o,static:y,private:g,metadata:T},m={v:!1};s.addInitializer=p(l,m);var i,h;e===0?g?(i=c.get,h=c.set):(i=function(){return this[o]},h=function(x){this[o]=x}):e===2?i=function(){return c.value}:((e===1||e===3)&&(i=function(){return c.get.call(this)}),(e===1||e===4)&&(h=function(x){c.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return a(b,s)}finally{m.v=!0}}function r(a,o){if(a.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(a,o){if(typeof a!="function")throw new TypeError(o+" must be a function")}function u(a,o){var c=typeof o;if(a===1){if(c!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(c!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function d(a,o,c,l,e,y,g,T,b){var f=c[0],s,m,i;g?e===0||e===1?s={get:c[3],set:c[4]}:e===3?s={get:c[3]}:e===4?s={set:c[3]}:s={value:c[3]}:e!==0&&(s=Object.getOwnPropertyDescriptor(o,l)),e===1?i={get:s.get,set:s.set}:e===2?i=s.value:e===3?i=s.get:e===4&&(i=s.set);var h,x,I;if(typeof f=="function")h=t(f,l,s,T,e,y,g,b,i),h!==void 0&&(u(e,h),e===0?m=h:e===1?(m=h.init,x=h.get||i.get,I=h.set||i.set,i={get:x,set:I}):i=h);else for(var _=f.length-1;_>=0;_--){var P=f[_];if(h=t(P,l,s,T,e,y,g,b,i),h!==void 0){u(e,h);var N;e===0?N=h:e===1?(N=h.init,x=h.get||i.get,I=h.set||i.set,i={get:x,set:I}):i=h,N!==void 0&&(m===void 0?m=N:typeof m=="function"?m=[m,N]:m.push(N))}}if(e===0||e===1){if(m===void 0)m=function(C,E){return E};else if(typeof m!="function"){var M=m;m=function(C,E){for(var L=E,R=0;R<M.length;R++)L=M[R].call(C,L);return L}}else{var B=m;m=function(C,E){return B.call(C,E)}}a.push(m)}e!==0&&(e===1?(s.get=i.get,s.set=i.set):e===2?s.value=i:e===3?s.get=i:e===4&&(s.set=i),g?e===1?(a.push(function(C,E){return i.get.call(C,E)}),a.push(function(C,E){return i.set.call(C,E)})):e===2?a.push(i):a.push(function(C,E){return i.call(C,E)}):Object.defineProperty(o,l,s))}function v(a,o,c){for(var l=[],e,y,g=new Map,T=new Map,b=0;b<o.length;b++){var f=o[b];if(Array.isArray(f)){var s=f[1],m=f[2],i=f.length>3,h=s>=5,x,I;if(h?(x=a,s=s-5,y=y||[],I=y):(x=a.prototype,e=e||[],I=e),s!==0&&!i){var _=h?T:g,P=_.get(m)||0;if(P===!0||P===3&&s!==4||P===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+m);!P&&s>2?_.set(m,s):_.set(m,!0)}d(l,x,f,m,s,h,i,I,c)}}return w(l,e),w(l,y),l}function w(a,o){o&&a.push(function(c){for(var l=0;l<o.length;l++)o[l].call(c);return c})}function S(a,o,c){if(o.length>0){for(var l=[],e=a,y=a.name,g=o.length-1;g>=0;g--){var T={v:!1};try{var b=o[g](e,{kind:"class",name:y,addInitializer:p(l,T),metadata:c})}finally{T.v=!0}b!==void 0&&(u(10,b),e=b)}return[D(e,c),function(){for(var f=0;f<l.length;f++)l[f].call(e)}]}}function D(a,o){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,c,l,e){if(e!==void 0)var y=e[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(y===void 0?null:y),T=v(o,c,g);return l.length||D(o,g),{e:T,get c(){return S(o,l,g)}}}}function ur(p,t,r,n){return(ur=Js())(p,t,r,n)}var hr,lr,Ks;hr=wt({instructionType:"if"});var cr=class{static{({c:[Ks,lr]}=ur(this,[],[hr]))}constructor(t=F.use(ut),r=F.use(Y),n=F.use(K)){this.mTemplateReference=t,this.mModuleValues=r,this.mProcedure=this.mModuleValues.createExpressionProcedure(n.value),this.mLastBoolean=!1}mLastBoolean;mModuleValues;mProcedure;mTemplateReference;onUpdate(){let t=this.mProcedure.execute();if(!!t!==this.mLastBoolean){this.mLastBoolean=!!t;let r=new at;if(t){let n=new it;n.appendChild(...this.mTemplateReference.childList),r.addElement(n,new ct(this.mModuleValues.data))}return r}else return null}static{lr()}};function Qs(){function p(a,o){return function(l){r(o,"addInitializer"),n(l,"An initializer"),a.push(l)}}function t(a,o,c,l,e,y,g,T,b){var f;switch(e){case 1:f="accessor";break;case 2:f="method";break;case 3:f="getter";break;case 4:f="setter";break;default:f="field"}var s={kind:f,name:g?"#"+o:o,static:y,private:g,metadata:T},m={v:!1};s.addInitializer=p(l,m);var i,h;e===0?g?(i=c.get,h=c.set):(i=function(){return this[o]},h=function(x){this[o]=x}):e===2?i=function(){return c.value}:((e===1||e===3)&&(i=function(){return c.get.call(this)}),(e===1||e===4)&&(h=function(x){c.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return a(b,s)}finally{m.v=!0}}function r(a,o){if(a.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(a,o){if(typeof a!="function")throw new TypeError(o+" must be a function")}function u(a,o){var c=typeof o;if(a===1){if(c!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(c!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function d(a,o,c,l,e,y,g,T,b){var f=c[0],s,m,i;g?e===0||e===1?s={get:c[3],set:c[4]}:e===3?s={get:c[3]}:e===4?s={set:c[3]}:s={value:c[3]}:e!==0&&(s=Object.getOwnPropertyDescriptor(o,l)),e===1?i={get:s.get,set:s.set}:e===2?i=s.value:e===3?i=s.get:e===4&&(i=s.set);var h,x,I;if(typeof f=="function")h=t(f,l,s,T,e,y,g,b,i),h!==void 0&&(u(e,h),e===0?m=h:e===1?(m=h.init,x=h.get||i.get,I=h.set||i.set,i={get:x,set:I}):i=h);else for(var _=f.length-1;_>=0;_--){var P=f[_];if(h=t(P,l,s,T,e,y,g,b,i),h!==void 0){u(e,h);var N;e===0?N=h:e===1?(N=h.init,x=h.get||i.get,I=h.set||i.set,i={get:x,set:I}):i=h,N!==void 0&&(m===void 0?m=N:typeof m=="function"?m=[m,N]:m.push(N))}}if(e===0||e===1){if(m===void 0)m=function(C,E){return E};else if(typeof m!="function"){var M=m;m=function(C,E){for(var L=E,R=0;R<M.length;R++)L=M[R].call(C,L);return L}}else{var B=m;m=function(C,E){return B.call(C,E)}}a.push(m)}e!==0&&(e===1?(s.get=i.get,s.set=i.set):e===2?s.value=i:e===3?s.get=i:e===4&&(s.set=i),g?e===1?(a.push(function(C,E){return i.get.call(C,E)}),a.push(function(C,E){return i.set.call(C,E)})):e===2?a.push(i):a.push(function(C,E){return i.call(C,E)}):Object.defineProperty(o,l,s))}function v(a,o,c){for(var l=[],e,y,g=new Map,T=new Map,b=0;b<o.length;b++){var f=o[b];if(Array.isArray(f)){var s=f[1],m=f[2],i=f.length>3,h=s>=5,x,I;if(h?(x=a,s=s-5,y=y||[],I=y):(x=a.prototype,e=e||[],I=e),s!==0&&!i){var _=h?T:g,P=_.get(m)||0;if(P===!0||P===3&&s!==4||P===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+m);!P&&s>2?_.set(m,s):_.set(m,!0)}d(l,x,f,m,s,h,i,I,c)}}return w(l,e),w(l,y),l}function w(a,o){o&&a.push(function(c){for(var l=0;l<o.length;l++)o[l].call(c);return c})}function S(a,o,c){if(o.length>0){for(var l=[],e=a,y=a.name,g=o.length-1;g>=0;g--){var T={v:!1};try{var b=o[g](e,{kind:"class",name:y,addInitializer:p(l,T),metadata:c})}finally{T.v=!0}b!==void 0&&(u(10,b),e=b)}return[D(e,c),function(){for(var f=0;f<l.length;f++)l[f].call(e)}]}}function D(a,o){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,c,l,e){if(e!==void 0)var y=e[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(y===void 0?null:y),T=v(o,c,g);return l.length||D(o,g),{e:T,get c(){return S(o,l,g)}}}}function fr(p,t,r,n){return(fr=Qs())(p,t,r,n)}var dr,mr,ks;dr=bt({access:q.Read,selector:/^\[[\w$]+\]$/});var pr=class{static{({c:[ks,mr]}=fr(this,[],[dr]))}constructor(t=F.use(k),r=F.use(Y),n=F.use(st)){this.mTarget=t,this.mProcedure=r.createExpressionProcedure(n.value),this.mTargetProperty=n.name.substring(1,n.name.length-1),this.mLastValue=Symbol("Uncomparable")}mLastValue;mProcedure;mTarget;mTargetProperty;onUpdate(){let t=this.mProcedure.execute();return t===this.mLastValue?!1:(this.mLastValue=t,Reflect.set(this.mTarget,this.mTargetProperty,t),!0)}static{mr()}};function ta(){function p(a,o){return function(l){r(o,"addInitializer"),n(l,"An initializer"),a.push(l)}}function t(a,o,c,l,e,y,g,T,b){var f;switch(e){case 1:f="accessor";break;case 2:f="method";break;case 3:f="getter";break;case 4:f="setter";break;default:f="field"}var s={kind:f,name:g?"#"+o:o,static:y,private:g,metadata:T},m={v:!1};s.addInitializer=p(l,m);var i,h;e===0?g?(i=c.get,h=c.set):(i=function(){return this[o]},h=function(x){this[o]=x}):e===2?i=function(){return c.value}:((e===1||e===3)&&(i=function(){return c.get.call(this)}),(e===1||e===4)&&(h=function(x){c.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return a(b,s)}finally{m.v=!0}}function r(a,o){if(a.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(a,o){if(typeof a!="function")throw new TypeError(o+" must be a function")}function u(a,o){var c=typeof o;if(a===1){if(c!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(c!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function d(a,o,c,l,e,y,g,T,b){var f=c[0],s,m,i;g?e===0||e===1?s={get:c[3],set:c[4]}:e===3?s={get:c[3]}:e===4?s={set:c[3]}:s={value:c[3]}:e!==0&&(s=Object.getOwnPropertyDescriptor(o,l)),e===1?i={get:s.get,set:s.set}:e===2?i=s.value:e===3?i=s.get:e===4&&(i=s.set);var h,x,I;if(typeof f=="function")h=t(f,l,s,T,e,y,g,b,i),h!==void 0&&(u(e,h),e===0?m=h:e===1?(m=h.init,x=h.get||i.get,I=h.set||i.set,i={get:x,set:I}):i=h);else for(var _=f.length-1;_>=0;_--){var P=f[_];if(h=t(P,l,s,T,e,y,g,b,i),h!==void 0){u(e,h);var N;e===0?N=h:e===1?(N=h.init,x=h.get||i.get,I=h.set||i.set,i={get:x,set:I}):i=h,N!==void 0&&(m===void 0?m=N:typeof m=="function"?m=[m,N]:m.push(N))}}if(e===0||e===1){if(m===void 0)m=function(C,E){return E};else if(typeof m!="function"){var M=m;m=function(C,E){for(var L=E,R=0;R<M.length;R++)L=M[R].call(C,L);return L}}else{var B=m;m=function(C,E){return B.call(C,E)}}a.push(m)}e!==0&&(e===1?(s.get=i.get,s.set=i.set):e===2?s.value=i:e===3?s.get=i:e===4&&(s.set=i),g?e===1?(a.push(function(C,E){return i.get.call(C,E)}),a.push(function(C,E){return i.set.call(C,E)})):e===2?a.push(i):a.push(function(C,E){return i.call(C,E)}):Object.defineProperty(o,l,s))}function v(a,o,c){for(var l=[],e,y,g=new Map,T=new Map,b=0;b<o.length;b++){var f=o[b];if(Array.isArray(f)){var s=f[1],m=f[2],i=f.length>3,h=s>=5,x,I;if(h?(x=a,s=s-5,y=y||[],I=y):(x=a.prototype,e=e||[],I=e),s!==0&&!i){var _=h?T:g,P=_.get(m)||0;if(P===!0||P===3&&s!==4||P===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+m);!P&&s>2?_.set(m,s):_.set(m,!0)}d(l,x,f,m,s,h,i,I,c)}}return w(l,e),w(l,y),l}function w(a,o){o&&a.push(function(c){for(var l=0;l<o.length;l++)o[l].call(c);return c})}function S(a,o,c){if(o.length>0){for(var l=[],e=a,y=a.name,g=o.length-1;g>=0;g--){var T={v:!1};try{var b=o[g](e,{kind:"class",name:y,addInitializer:p(l,T),metadata:c})}finally{T.v=!0}b!==void 0&&(u(10,b),e=b)}return[D(e,c),function(){for(var f=0;f<l.length;f++)l[f].call(e)}]}}function D(a,o){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,c,l,e){if(e!==void 0)var y=e[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(y===void 0?null:y),T=v(o,c,g);return l.length||D(o,g),{e:T,get c(){return S(o,l,g)}}}}function yr(p,t,r,n){return(yr=ta())(p,t,r,n)}var br,vr,ea;br=bt({access:q.Write,selector:/^#[[\w$]+$/});var gr=class{static{({c:[ea,vr]}=yr(this,[],[br]))}constructor(t=F.use(k),r=F.use(st),n=F.use(ft)){n.setTemporaryValue(r.name.substring(1),t)}static{vr()}};function ra(){function p(a,o){return function(l){r(o,"addInitializer"),n(l,"An initializer"),a.push(l)}}function t(a,o,c,l,e,y,g,T,b){var f;switch(e){case 1:f="accessor";break;case 2:f="method";break;case 3:f="getter";break;case 4:f="setter";break;default:f="field"}var s={kind:f,name:g?"#"+o:o,static:y,private:g,metadata:T},m={v:!1};s.addInitializer=p(l,m);var i,h;e===0?g?(i=c.get,h=c.set):(i=function(){return this[o]},h=function(x){this[o]=x}):e===2?i=function(){return c.value}:((e===1||e===3)&&(i=function(){return c.get.call(this)}),(e===1||e===4)&&(h=function(x){c.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return a(b,s)}finally{m.v=!0}}function r(a,o){if(a.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(a,o){if(typeof a!="function")throw new TypeError(o+" must be a function")}function u(a,o){var c=typeof o;if(a===1){if(c!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(c!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function d(a,o,c,l,e,y,g,T,b){var f=c[0],s,m,i;g?e===0||e===1?s={get:c[3],set:c[4]}:e===3?s={get:c[3]}:e===4?s={set:c[3]}:s={value:c[3]}:e!==0&&(s=Object.getOwnPropertyDescriptor(o,l)),e===1?i={get:s.get,set:s.set}:e===2?i=s.value:e===3?i=s.get:e===4&&(i=s.set);var h,x,I;if(typeof f=="function")h=t(f,l,s,T,e,y,g,b,i),h!==void 0&&(u(e,h),e===0?m=h:e===1?(m=h.init,x=h.get||i.get,I=h.set||i.set,i={get:x,set:I}):i=h);else for(var _=f.length-1;_>=0;_--){var P=f[_];if(h=t(P,l,s,T,e,y,g,b,i),h!==void 0){u(e,h);var N;e===0?N=h:e===1?(N=h.init,x=h.get||i.get,I=h.set||i.set,i={get:x,set:I}):i=h,N!==void 0&&(m===void 0?m=N:typeof m=="function"?m=[m,N]:m.push(N))}}if(e===0||e===1){if(m===void 0)m=function(C,E){return E};else if(typeof m!="function"){var M=m;m=function(C,E){for(var L=E,R=0;R<M.length;R++)L=M[R].call(C,L);return L}}else{var B=m;m=function(C,E){return B.call(C,E)}}a.push(m)}e!==0&&(e===1?(s.get=i.get,s.set=i.set):e===2?s.value=i:e===3?s.get=i:e===4&&(s.set=i),g?e===1?(a.push(function(C,E){return i.get.call(C,E)}),a.push(function(C,E){return i.set.call(C,E)})):e===2?a.push(i):a.push(function(C,E){return i.call(C,E)}):Object.defineProperty(o,l,s))}function v(a,o,c){for(var l=[],e,y,g=new Map,T=new Map,b=0;b<o.length;b++){var f=o[b];if(Array.isArray(f)){var s=f[1],m=f[2],i=f.length>3,h=s>=5,x,I;if(h?(x=a,s=s-5,y=y||[],I=y):(x=a.prototype,e=e||[],I=e),s!==0&&!i){var _=h?T:g,P=_.get(m)||0;if(P===!0||P===3&&s!==4||P===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+m);!P&&s>2?_.set(m,s):_.set(m,!0)}d(l,x,f,m,s,h,i,I,c)}}return w(l,e),w(l,y),l}function w(a,o){o&&a.push(function(c){for(var l=0;l<o.length;l++)o[l].call(c);return c})}function S(a,o,c){if(o.length>0){for(var l=[],e=a,y=a.name,g=o.length-1;g>=0;g--){var T={v:!1};try{var b=o[g](e,{kind:"class",name:y,addInitializer:p(l,T),metadata:c})}finally{T.v=!0}b!==void 0&&(u(10,b),e=b)}return[D(e,c),function(){for(var f=0;f<l.length;f++)l[f].call(e)}]}}function D(a,o){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,c,l,e){if(e!==void 0)var y=e[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(y===void 0?null:y),T=v(o,c,g);return l.length||D(o,g),{e:T,get c(){return S(o,l,g)}}}}function Tr(p,t,r,n){return(Tr=ra())(p,t,r,n)}var Er,wr,oa;Er=wt({instructionType:"slot"});var xr=class{static{({c:[oa,wr]}=Tr(this,[],[Er]))}constructor(t=F.use(Y),r=F.use(K)){this.mModuleValues=t,this.mSlotName=r.value,this.mIsSetup=!1}mIsSetup;mModuleValues;mSlotName;onUpdate(){if(this.mIsSetup)return null;this.mIsSetup=!0;let t=new yt("slot");this.mSlotName!==""&&t.setAttribute("name").addValue(this.mSlotName);let r=new it;r.appendChild(t);let n=new at;return n.addElement(r,this.mModuleValues.data),n}static{wr()}};function na(){function p(a,o){return function(l){r(o,"addInitializer"),n(l,"An initializer"),a.push(l)}}function t(a,o,c,l,e,y,g,T,b){var f;switch(e){case 1:f="accessor";break;case 2:f="method";break;case 3:f="getter";break;case 4:f="setter";break;default:f="field"}var s={kind:f,name:g?"#"+o:o,static:y,private:g,metadata:T},m={v:!1};s.addInitializer=p(l,m);var i,h;e===0?g?(i=c.get,h=c.set):(i=function(){return this[o]},h=function(x){this[o]=x}):e===2?i=function(){return c.value}:((e===1||e===3)&&(i=function(){return c.get.call(this)}),(e===1||e===4)&&(h=function(x){c.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return a(b,s)}finally{m.v=!0}}function r(a,o){if(a.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(a,o){if(typeof a!="function")throw new TypeError(o+" must be a function")}function u(a,o){var c=typeof o;if(a===1){if(c!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(c!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function d(a,o,c,l,e,y,g,T,b){var f=c[0],s,m,i;g?e===0||e===1?s={get:c[3],set:c[4]}:e===3?s={get:c[3]}:e===4?s={set:c[3]}:s={value:c[3]}:e!==0&&(s=Object.getOwnPropertyDescriptor(o,l)),e===1?i={get:s.get,set:s.set}:e===2?i=s.value:e===3?i=s.get:e===4&&(i=s.set);var h,x,I;if(typeof f=="function")h=t(f,l,s,T,e,y,g,b,i),h!==void 0&&(u(e,h),e===0?m=h:e===1?(m=h.init,x=h.get||i.get,I=h.set||i.set,i={get:x,set:I}):i=h);else for(var _=f.length-1;_>=0;_--){var P=f[_];if(h=t(P,l,s,T,e,y,g,b,i),h!==void 0){u(e,h);var N;e===0?N=h:e===1?(N=h.init,x=h.get||i.get,I=h.set||i.set,i={get:x,set:I}):i=h,N!==void 0&&(m===void 0?m=N:typeof m=="function"?m=[m,N]:m.push(N))}}if(e===0||e===1){if(m===void 0)m=function(C,E){return E};else if(typeof m!="function"){var M=m;m=function(C,E){for(var L=E,R=0;R<M.length;R++)L=M[R].call(C,L);return L}}else{var B=m;m=function(C,E){return B.call(C,E)}}a.push(m)}e!==0&&(e===1?(s.get=i.get,s.set=i.set):e===2?s.value=i:e===3?s.get=i:e===4&&(s.set=i),g?e===1?(a.push(function(C,E){return i.get.call(C,E)}),a.push(function(C,E){return i.set.call(C,E)})):e===2?a.push(i):a.push(function(C,E){return i.call(C,E)}):Object.defineProperty(o,l,s))}function v(a,o,c){for(var l=[],e,y,g=new Map,T=new Map,b=0;b<o.length;b++){var f=o[b];if(Array.isArray(f)){var s=f[1],m=f[2],i=f.length>3,h=s>=5,x,I;if(h?(x=a,s=s-5,y=y||[],I=y):(x=a.prototype,e=e||[],I=e),s!==0&&!i){var _=h?T:g,P=_.get(m)||0;if(P===!0||P===3&&s!==4||P===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+m);!P&&s>2?_.set(m,s):_.set(m,!0)}d(l,x,f,m,s,h,i,I,c)}}return w(l,e),w(l,y),l}function w(a,o){o&&a.push(function(c){for(var l=0;l<o.length;l++)o[l].call(c);return c})}function S(a,o,c){if(o.length>0){for(var l=[],e=a,y=a.name,g=o.length-1;g>=0;g--){var T={v:!1};try{var b=o[g](e,{kind:"class",name:y,addInitializer:p(l,T),metadata:c})}finally{T.v=!0}b!==void 0&&(u(10,b),e=b)}return[D(e,c),function(){for(var f=0;f<l.length;f++)l[f].call(e)}]}}function D(a,o){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,c,l,e){if(e!==void 0)var y=e[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(y===void 0?null:y),T=v(o,c,g);return l.length||D(o,g),{e:T,get c(){return S(o,l,g)}}}}function Ir(p,t,r,n){return(Ir=na())(p,t,r,n)}var Dr,Cr,ia;Dr=bt({access:q.ReadWrite,selector:/^\[\([[\w$]+\)\]$/});var Sr=class{static{({c:[ia,Cr]}=Ir(this,[],[Dr]))}constructor(t=F.use(et),r=F.use(k),n=F.use(Y),u=F.use(st)){this.mTargetNode=r,this.mAttributeKey=u.name.substring(2,u.name.length-2),this.mReadProcedure=n.createExpressionProcedure(u.value),this.mWriteProcedure=n.createExpressionProcedure(`${u.value} = $DATA;`,["$DATA"]),this.mLastDataValue=Symbol("Uncomparable");let d=v=>{this.mLastDataValue!==v&&t.updater.updateAsync()};this.mTargetNode.addEventListener("input",v=>{d(Reflect.get(this.mTargetNode,this.mAttributeKey))}),this.mTargetNode.addEventListener("change",v=>{d(Reflect.get(this.mTargetNode,this.mAttributeKey))})}mAttributeKey;mLastDataValue;mReadProcedure;mTargetNode;mWriteProcedure;onUpdate(){let t=this.mReadProcedure.execute();if(t!==this.mLastDataValue)return Reflect.set(this.mTargetNode,this.mAttributeKey,t),this.mLastDataValue=t,!0;let r=Reflect.get(this.mTargetNode,this.mAttributeKey);return r!==t?(this.mWriteProcedure.setTemporaryValue("$DATA",r),this.mWriteProcedure.execute(),this.mLastDataValue=r,!0):!1}static{Cr()}};function sa(){function p(a,o){return function(l){r(o,"addInitializer"),n(l,"An initializer"),a.push(l)}}function t(a,o,c,l,e,y,g,T,b){var f;switch(e){case 1:f="accessor";break;case 2:f="method";break;case 3:f="getter";break;case 4:f="setter";break;default:f="field"}var s={kind:f,name:g?"#"+o:o,static:y,private:g,metadata:T},m={v:!1};s.addInitializer=p(l,m);var i,h;e===0?g?(i=c.get,h=c.set):(i=function(){return this[o]},h=function(x){this[o]=x}):e===2?i=function(){return c.value}:((e===1||e===3)&&(i=function(){return c.get.call(this)}),(e===1||e===4)&&(h=function(x){c.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return a(b,s)}finally{m.v=!0}}function r(a,o){if(a.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(a,o){if(typeof a!="function")throw new TypeError(o+" must be a function")}function u(a,o){var c=typeof o;if(a===1){if(c!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(c!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function d(a,o,c,l,e,y,g,T,b){var f=c[0],s,m,i;g?e===0||e===1?s={get:c[3],set:c[4]}:e===3?s={get:c[3]}:e===4?s={set:c[3]}:s={value:c[3]}:e!==0&&(s=Object.getOwnPropertyDescriptor(o,l)),e===1?i={get:s.get,set:s.set}:e===2?i=s.value:e===3?i=s.get:e===4&&(i=s.set);var h,x,I;if(typeof f=="function")h=t(f,l,s,T,e,y,g,b,i),h!==void 0&&(u(e,h),e===0?m=h:e===1?(m=h.init,x=h.get||i.get,I=h.set||i.set,i={get:x,set:I}):i=h);else for(var _=f.length-1;_>=0;_--){var P=f[_];if(h=t(P,l,s,T,e,y,g,b,i),h!==void 0){u(e,h);var N;e===0?N=h:e===1?(N=h.init,x=h.get||i.get,I=h.set||i.set,i={get:x,set:I}):i=h,N!==void 0&&(m===void 0?m=N:typeof m=="function"?m=[m,N]:m.push(N))}}if(e===0||e===1){if(m===void 0)m=function(C,E){return E};else if(typeof m!="function"){var M=m;m=function(C,E){for(var L=E,R=0;R<M.length;R++)L=M[R].call(C,L);return L}}else{var B=m;m=function(C,E){return B.call(C,E)}}a.push(m)}e!==0&&(e===1?(s.get=i.get,s.set=i.set):e===2?s.value=i:e===3?s.get=i:e===4&&(s.set=i),g?e===1?(a.push(function(C,E){return i.get.call(C,E)}),a.push(function(C,E){return i.set.call(C,E)})):e===2?a.push(i):a.push(function(C,E){return i.call(C,E)}):Object.defineProperty(o,l,s))}function v(a,o,c){for(var l=[],e,y,g=new Map,T=new Map,b=0;b<o.length;b++){var f=o[b];if(Array.isArray(f)){var s=f[1],m=f[2],i=f.length>3,h=s>=5,x,I;if(h?(x=a,s=s-5,y=y||[],I=y):(x=a.prototype,e=e||[],I=e),s!==0&&!i){var _=h?T:g,P=_.get(m)||0;if(P===!0||P===3&&s!==4||P===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+m);!P&&s>2?_.set(m,s):_.set(m,!0)}d(l,x,f,m,s,h,i,I,c)}}return w(l,e),w(l,y),l}function w(a,o){o&&a.push(function(c){for(var l=0;l<o.length;l++)o[l].call(c);return c})}function S(a,o,c){if(o.length>0){for(var l=[],e=a,y=a.name,g=o.length-1;g>=0;g--){var T={v:!1};try{var b=o[g](e,{kind:"class",name:y,addInitializer:p(l,T),metadata:c})}finally{T.v=!0}b!==void 0&&(u(10,b),e=b)}return[D(e,c),function(){for(var f=0;f<l.length;f++)l[f].call(e)}]}}function D(a,o){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,c,l,e){if(e!==void 0)var y=e[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(y===void 0?null:y),T=v(o,c,g);return l.length||D(o,g),{e:T,get c(){return S(o,l,g)}}}}function Nr(p,t,r,n){return(Nr=sa())(p,t,r,n)}var Ar,_r,aa;Ar=Rt({access:q.Read,targetRestrictions:[mt]});var Pr=class{static{({c:[aa,_r]}=Nr(this,[],[Ar]))}constructor(t=F.use(mt),r=F.use(k)){let n=new Array,u=t.processorConstructor;do{let d=tt.get(u).getMetadata(re.METADATA_USER_EVENT_LISTENER_PROPERIES);if(d)for(let v of d)n.push(v)}while(u=Object.getPrototypeOf(u));this.mEventListenerList=new Array,this.mTargetElement=r;for(let d of n){let[v,w]=d,S=Reflect.get(t.processor,v);S=S.bind(t.processor),this.mEventListenerList.push([w,S]),this.mTargetElement.addEventListener(w,S)}}mEventListenerList;mTargetElement;onDeconstruct(){for(let t of this.mEventListenerList){let[r,n]=t;this.mTargetElement.removeEventListener(r,n)}}static{_r()}};(function(p){p.Function="function",p.Comment="comment",p.Input="input",p.Output="output",p.Reroute="reroute"})(j||(j={}));var Mt=class p{static META={[j.Function]:{icon:"f",cssColor:"var(--pn-accent-blue)",label:"Function"},[j.Comment]:{icon:"\u{1F4AC}",cssColor:"var(--pn-accent-yellow)",label:"Comment"},[j.Input]:{icon:"\u2192",cssColor:"var(--pn-accent-green)",label:"Input"},[j.Output]:{icon:"\u2190",cssColor:"var(--pn-accent-red)",label:"Output"},[j.Reroute]:{icon:"\u25C7",cssColor:"var(--pn-text-muted)",label:"Reroute"}};static get(t){let r=p.META[t];return r||{icon:"\u25C6",cssColor:`hsl(${p.hashStringToHue(t)}, 60%, 55%)`,label:t.charAt(0).toUpperCase()+t.slice(1)}}static hashStringToHue(t){let r=0;for(let n=0;n<t.length;n++)r=(r<<5)-r+t.charCodeAt(n),r=r&r;return Math.abs(r)%360}},j;var se=class{mConnectedPorts;mDirection;mName;mValueType;mPortType;mNode;mDirectValue;mProject;get connectedPorts(){return this.mConnectedPorts}get direction(){return this.mDirection}get directValue(){return this.mDirectValue}get name(){return this.mName}get node(){return this.mNode}get portType(){return this.mPortType}get project(){return this.mProject}get type(){return this.mValueType??""}constructor(t,r,n,u,d,v){if(d==="flow"&&v!==null)throw new A("Flow ports cannot have a value type.",this);if(d==="value"&&v===null)throw new A("Value ports must have a value type.",this);this.mProject=t,this.mNode=r,this.mName=n,this.mValueType=v,this.mDirection=u,this.mPortType=d,this.mConnectedPorts=new Set,this.mDirectValue=new Array,v&&this.mDirectValue.push(...t.types.getType(v).defaultValue)}connect(t){if(this.mConnectedPorts.has(t))return;if(this.mPortType!==t.portType)throw new A(`Cannot connect port ${this.mName} of node ${this.mNode.name} to port ${t.mName} of node ${t.node.name} due to incompatible port types.`,this);if(this.mDirection===t.direction)throw new A(`Cannot connect port ${this.mName} of node ${this.mNode.name} to port ${t.mName} of node ${t.node.name} due to incompatible directions.`,this);if(!(this.mPortType==="flow"&&this.mDirection==="input"||this.mPortType==="value"&&this.mDirection==="output"))for(let n of Array.from(this.mConnectedPorts))this.disconnect(n);this.mConnectedPorts.add(t),t.connect(this)}disconnect(t){this.mConnectedPorts.has(t)&&(this.mConnectedPorts.delete(t),t.disconnect(this))}setDirectValue(t){if(this.mPortType!=="value")throw new A("Only value ports can have a direct value.",this);if(t.length!==this.mProject.types.getType(this.mValueType).defaultValue.length)throw new A("The provided value does not match the expected length of the default value for this port's type.",this);this.mDirectValue.splice(0,this.mDirectValue.length),this.mDirectValue.push(...t)}validate(){let t=new Array;if(this.mDirection==="output")return this.mPortType==="flow"&&this.mConnectedPorts.size>1&&t.push(new Ut(`Flow output port "${this.mName}" on node "${this.mNode.name}" can only have one connection.`,this)),t;if(this.mDirection==="input"){if(this.mPortType==="flow")return this.mConnectedPorts.size===0&&t.push(new Ut(`Flow input port "${this.mName}" on node "${this.mNode.name}" must have at least one connection.`,this)),t;if(this.mPortType==="value"){this.mConnectedPorts.size>1&&t.push(new Ut(`Value input port "${this.mName}" on node "${this.mNode.name}" can only have one connection.`,this));for(let r of this.mConnectedPorts)r.type!==this.mValueType&&t.push(new Ut(`Value input port "${this.mName}" on node "${this.mNode.name}" expects type "${this.mValueType}" but is connected to type "${r.type}".`,this));return t}}return t}},Ut=class{mMessage;mPort;get message(){return this.mMessage}get port(){return this.mPort}constructor(t,r){this.mMessage=t,this.mPort=r}};var Xt=class{mDefinition;mInputs;mLabel;mOutputs;mIsSystem;mTransformation;mProject;get definition(){return this.mDefinition}get inputs(){return this.mInputs}get outputs(){return this.mOutputs}get project(){return this.mProject}get transformation(){return this.mTransformation}get name(){return this.mDefinition.label}get label(){return this.mLabel}set label(t){this.mLabel=t}get isSystem(){return this.mIsSystem}constructor(t,r,n,u){this.mProject=t,this.mDefinition=r,this.mIsSystem=u,this.mTransformation=n,this.mLabel=r.label,this.mInputs=new Map;for(let d of r.inputs)this.mInputs.set(d.name,new se(t,this,d.name,"input",d.portType,d.dataType));this.mOutputs=new Map;for(let d of r.outputs)this.mOutputs.set(d.name,new se(t,this,d.name,"output",d.portType,d.dataType))}moveTo(t,r){this.mTransformation.x=t,this.mTransformation.y=r}resizeTo(t,r){this.mTransformation.width=Math.max(4,t),this.mTransformation.height=Math.max(2,r)}validate(){let t=[];for(let r of[...this.mInputs.values(),...this.mOutputs.values()])t.push(...r.validate());return t}};var Ot=class{mDefinition;mId;mIsSystem;mImports;mInputs;mLabel;mOutputs;mNodes;mProject;get id(){return this.mId}get nodes(){return this.mNodes}get definition(){return this.mDefinition}get imports(){return this.mImports}get inputs(){return this.mInputs}get label(){return this.mLabel}set label(t){this.mLabel=t}get outputs(){return this.mOutputs}get isSystem(){return this.mIsSystem}get project(){return this.mProject}constructor(t,r,n,u,d){this.mProject=t,this.mLabel=u,this.mIsSystem=d,this.mDefinition=r,this.mId=n,this.mNodes=new Set,this.mInputs=new Array,this.mOutputs=new Array,this.mImports=new Array}addImport(t){this.mImports.includes(t)||this.mImports.push(t)}addInput(t){this.mInputs.some(r=>r.name===t.name)||this.mInputs.push(t)}addOutput(t){this.mOutputs.some(r=>r.name===t.name)||this.mOutputs.push(t)}addNode(t){this.mNodes.add(t)}newNode(t,r,n=!1){let u=new Xt(this.mProject,t,r,n);return this.mNodes.add(u),u}removeNode(t){for(let r of[...t.inputs.values(),...t.outputs.values()])for(let n of Array.from(r.connectedPorts))r.disconnect(n);this.mNodes.delete(t)}removeImport(t){let r=this.mImports.indexOf(t);r!==-1&&this.mImports.splice(r,1)}removeInput(t){let r=this.mInputs.findIndex(n=>n.name===t.name);r!==-1&&this.mInputs.splice(r,1)}removeOutput(t){let r=this.mOutputs.findIndex(n=>n.name===t.name);r!==-1&&this.mOutputs.splice(r,1)}validate(){let t=[];for(let r of this.mNodes)t.push(...r.validate());return t}};var ae=class{mProject;constructor(t){this.mProject=t}deserialize(t){let r=new Ft(this.mProject);for(let n of t.functions)r.addFunction(this.deserializeFunction(n,r));return r}deserializeFunction(t,r){let n=this.findFunctionDefinition(t.definitionId),u=new Ot(this.mProject,n,t.id,t.name,t.isSystem);for(let v of t.imports)u.addImport(v);for(let v of t.inputs)u.addInput({name:v.name,dataType:v.dataType});for(let v of t.outputs)u.addOutput({name:v.name,dataType:v.dataType});let d=new Map;for(let v of t.nodes){let w=this.deserializeNode(v,r);d.set(v.id,w),u.addNode(w)}for(let v of t.connections){let w=d.get(v.sourceNodeId),S=d.get(v.targetNodeId);if(!w||!S)continue;let D=w.outputs.get(v.sourcePortName),a=S.inputs.get(v.targetPortName);!D||!a||D.connect(a)}return u}deserializeNode(t,r){let n=this.mProject.nodeDefinitions.get(t.definitionId)??r.functionNodeDefinitions.get(t.definitionId);if(!n)throw new Error(`Node definition not found: "${t.definitionId}"`);let u=new Xt(this.mProject,n,{...t.transformation},t.isSystem);u.label=t.label;for(let d of t.ports)if(d.portType==="value"&&d.directValue.length>0){let v=u.inputs.get(d.name);v&&v.setDirectValue(d.directValue)}return u}findFunctionDefinition(t){if(this.mProject.entryPoint.id===t)return this.mProject.entryPoint;let r=this.mProject.userFunctions.get(t);return r||this.mProject.entryPoint}};var Ht=class{mBody;mInputs;mOutputs;get body(){return this.mBody}get inputs(){return this.mInputs}get outputs(){return this.mOutputs}constructor(){this.mInputs=new Map,this.mOutputs=new Map,this.mBody=new Map}generateCode(){return""}buildContext(){let t={};for(let[n,u]of this.mInputs)u.nodeType==="flow"?t[n]={code:""}:t[n]={valueId:u.valueId};let r={};for(let[n,u]of this.mOutputs)if(u.nodeType==="flow"){let d=this.mBody.get(n);r[n]={code:d?.code??""}}else r[n]={valueId:u.valueId};return{inputs:t,outputs:r}}};var Te=class extends Ht{mCodeGenerator;constructor(t){super(),this.mCodeGenerator=t}generateCode(){return this.mCodeGenerator(this.buildContext())}};var le=class{bodyCode;imports;inputs;name;outputs;constructor(){this.name="",this.bodyCode="",this.imports=new Array,this.inputs=new Array,this.outputs=new Array}};var Ee=class{mConfig;constructor(t){this.mConfig=t}generateFunctionCode(t){let r=t.definition,n=t.nodes,u=this.buildValueIdMap(n),d=this.generateGraphCode(n,u),v=this.buildCodeFunction(t,n,u,d),w=r.codeGenerator.codeGenerator;return w?w(v):d}generateFunctionCodeWithIntermediates(t,r){let n=t.definition,u=t.nodes,d=this.buildValueIdMap(u),v=this.topologicalSort(u),w=[],S=new Map,D=this.collectFunctionInputs(t,u,d),a=this.collectFunctionOutputs(t,u,d);for(let e of v){let y=e.definition.category;if(y===j.Input||y===j.Output||y===j.Reroute||y===j.Comment)continue;let g=this.buildCodeNode(e,d);if(this.attachFlowBodies(e,g,d),w.push(g.generateCode()),r.has(e)){let T=w.join(`
`),b=new le;b.name=t.label,b.bodyCode=T;for(let s of t.imports)b.imports.push(s);for(let s of D)b.inputs.push({...s});for(let s of a)b.outputs.push({...s});let f=n.codeGenerator.codeGenerator?n.codeGenerator.codeGenerator(b):T;S.set(e,{intermediateCode:f,context:g.buildContext(),codeFunction:b})}}let o=w.join(`
`),c=this.buildCodeFunction(t,u,d,o);return{fullCode:n.codeGenerator.codeGenerator?n.codeGenerator.codeGenerator(c):o,codeFunction:c,nodeIntermediates:S}}generateProjectCode(t){return[...t.values()].map(r=>this.generateFunctionCode(r)).join(`

`)}buildValueIdMap(t){let r=new Map,n=0;for(let u of t)for(let d of[...u.inputs.values(),...u.outputs.values()])r.set(d,`_v${n++}`);return r}buildCodeFunction(t,r,n,u){let d=new le;d.name=t.label,d.bodyCode=u;for(let v of t.imports)d.imports.push(v);for(let v of this.collectFunctionInputs(t,r,n))d.inputs.push(v);for(let v of this.collectFunctionOutputs(t,r,n))d.outputs.push(v);return d}collectFunctionInputs(t,r,n){return t.inputs.map(u=>({name:u.name,type:u.dataType,valueId:this.findInputNodeValueId(r,u.name,n)}))}collectFunctionOutputs(t,r,n){return t.outputs.map(u=>({name:u.name,type:u.dataType,valueId:this.findOutputNodeValueId(r,u.name,n)}))}generateGraphCode(t,r){let n=[];for(let u of this.topologicalSort(t)){let d=u.definition.category;if(d===j.Input||d===j.Output||d===j.Reroute||d===j.Comment)continue;let v=this.buildCodeNode(u,r);this.attachFlowBodies(u,v,r),n.push(v.generateCode())}return n.join(`
`)}attachFlowBodies(t,r,n){for(let[u,d]of t.outputs){if(d.portType!=="flow")continue;let v=[...d.connectedPorts][0];r.body.set(u,{code:v?this.generateFlowBodyCode(v,n):""})}}generateFlowBodyCode(t,r){let n=t.node;if(!this.mConfig.nodeDefinitions.get(n.definition.id)&&n.definition.category!=="function")return"";let u=this.buildCodeNode(n,r);return this.attachFlowBodies(n,u,r),u.generateCode()}buildCodeNode(t,r){let n=t.definition.codeGenerator,u=this.createNodeForCategory(t.definition.category,n);for(let[d,v]of t.inputs)if(v.portType==="value"){let w=[...v.connectedPorts][0],S=w?this.resolveRerouteChain(w,r):r.get(v)??d;u.inputs.set(d,{name:d,type:v.type,valueId:S,nodeType:"value"})}else u.inputs.set(d,{name:d,type:"",valueId:"",nodeType:"flow"});for(let[d,v]of t.outputs)v.portType==="value"?u.outputs.set(d,{name:d,type:v.type,valueId:r.get(v)??d,nodeType:"value"}):u.outputs.set(d,{name:d,type:"",valueId:"",nodeType:"flow"});return u}createNodeForCategory(t,r){switch(t){case j.Comment:case j.Input:case j.Output:case j.Reroute:return new Ht;default:return new Te(r)}}topologicalSort(t){let r=new Set,n=[],u=new Map;for(let v of t)u.set(v,new Set);for(let v of t)for(let w of v.inputs.values())if(w.portType==="value")for(let S of w.connectedPorts)u.get(v)?.add(S.node);let d=v=>{if(!r.has(v)){r.add(v);for(let w of u.get(v)??[])d(w);n.push(v)}};for(let v of t)d(v);return n}findInputNodeValueId(t,r,n){for(let u of t)if(u.definition.category===j.Input&&u.definition.id===r){for(let d of u.outputs.values())if(d.portType==="value")return n.get(d)??r}return r}findOutputNodeValueId(t,r,n){for(let u of t)if(u.definition.category===j.Output&&u.definition.id===r){for(let d of u.inputs.values())if(d.portType==="value"){let v=[...d.connectedPorts][0];return v?this.resolveRerouteChain(v,n):n.get(d)??r}}return r}resolveRerouteChain(t,r){if(t.node.definition.category===j.Reroute){for(let n of t.node.inputs.values())if(n.portType==="value"){let u=[...n.connectedPorts][0];return u?this.resolveRerouteChain(u,r):r.get(n)??""}}return r.get(t)??""}};var ce=class{constructor(){}serialize(t){return{functions:[...t.functions].map(r=>this.serializeFunction(r))}}serializeFunction(t){let r=new Map;[...t.nodes].forEach((w,S)=>{r.set(w,`n${S}`)});let n=[...t.nodes].map(w=>this.serializeNode(w,r.get(w))),u=[];for(let w of t.nodes){let S=r.get(w);for(let D of w.outputs.values())for(let a of D.connectedPorts){let o=r.get(a.node);u.push({sourceNodeId:S,sourcePortName:D.name,targetNodeId:o,targetPortName:a.name})}}let d=t.inputs.map(w=>({name:w.name,dataType:w.dataType})),v=t.outputs.map(w=>({name:w.name,dataType:w.dataType}));return{id:t.id,name:t.label,isSystem:t.isSystem,definitionId:t.definition.id,inputs:d,outputs:v,imports:[...t.imports],nodes:n,connections:u}}serializeNode(t,r){let n=[...t.inputs.values(),...t.outputs.values()].map(u=>({name:u.name,direction:u.direction,portType:u.portType,dataType:u.portType==="value"?u.type:null,directValue:[...u.directValue]}));return{id:r,definitionId:t.definition.id,label:t.label,isSystem:t.isSystem,transformation:{...t.transformation},ports:n}}};var Ce=class p{static MAX_ZOOM=2;static MIN_ZOOM=.25;mGridSize;mPanX;mPanY;mSelectionEnd;mSelectionStart;mZoom;get gridSize(){return this.mGridSize}get panX(){return this.mPanX}get panY(){return this.mPanY}get selectionEnd(){return this.mSelectionEnd}get selectionStart(){return this.mSelectionStart}get zoom(){return this.mZoom}constructor(t=20){this.mGridSize=t,this.mPanX=0,this.mPanY=0,this.mZoom=1,this.mSelectionStart=null,this.mSelectionEnd=null}clearSelection(){this.mSelectionStart=null,this.mSelectionEnd=null}getGridBackgroundCss(){let t=this.mGridSize*this.mZoom,r=this.mPanX%t,n=this.mPanY%t,u=t*5,d=this.mPanX%u,v=this.mPanY%u;return[`background-size: ${t}px ${t}px, ${u}px ${u}px`,`background-position: ${r}px ${n}px, ${d}px ${v}px`,"background-image: radial-gradient(circle, var(--pn-grid-color) 1px, transparent 1px), radial-gradient(circle, var(--pn-grid-color) 1.5px, transparent 1.5px)"].join("; ")}getTransformCss(){return`translate(${this.mPanX}px, ${this.mPanY}px) scale(${this.mZoom})`}pan(t,r){this.mPanX+=t,this.mPanY+=r}screenToWorld(t,r){return{x:(t-this.mPanX)/this.mZoom,y:(r-this.mPanY)/this.mZoom}}setSelectionEnd(t,r){this.mSelectionEnd={x:t,y:r}}setSelectionStart(t,r){this.mSelectionStart={x:t,y:r}}snapToGrid(t,r){return{x:Math.round(t/this.mGridSize)*this.mGridSize,y:Math.round(r/this.mGridSize)*this.mGridSize}}worldToScreen(t,r){return{x:t*this.mZoom+this.mPanX,y:r*this.mZoom+this.mPanY}}zoomAt(t,r,n){let u=this.mZoom,d=1+n,v=this.mZoom*d;v=Math.max(p.MIN_ZOOM,Math.min(p.MAX_ZOOM,v));let w=(t-this.mPanX)/u,S=(r-this.mPanY)/u;this.mZoom=v,this.mPanX=t-w*this.mZoom,this.mPanY=r-S*this.mZoom}};var Oe="http://www.w3.org/2000/svg",Fe="data-temp-connection";var Se=class{clearAll(t){let r=t.querySelectorAll("path");for(let n of r)n.remove()}clearTempConnection(t){let r=t.querySelector(`[${Fe}]`);r&&r.remove()}generateBezierPath(t,r,n,u){let d=Math.abs(n-t),v=Math.max(d*.4,50),w=t+v,S=r,D=n-v;return`M ${t} ${r} C ${w} ${S}, ${D} ${u}, ${n} ${u}`}renderConnections(t,r){let n=t.querySelectorAll(`path:not([${Fe}])`);for(let u of n)u.remove();for(let u of r){let d=this.generateBezierPath(u.sourceX,u.sourceY,u.targetX,u.targetY),v=document.createElementNS(Oe,"path");v.setAttribute("d",d),v.setAttribute("fill","none"),v.setAttribute("data-connection-id",u.id),v.setAttribute("data-hit-area","true"),v.style.stroke="transparent",v.style.strokeWidth="12",v.style.pointerEvents="stroke",v.style.cursor="pointer",t.appendChild(v);let w=document.createElementNS(Oe,"path");w.setAttribute("d",d),w.setAttribute("fill","none"),w.setAttribute("data-connection-id",u.id),w.style.stroke=u.valid?"#a6adc8":"#f38ba8",w.style.strokeWidth="2",w.style.pointerEvents="none",u.valid||w.setAttribute("stroke-dasharray","6 3"),t.appendChild(w)}}renderTempConnection(t,r,n,u){this.clearTempConnection(t);let d=document.createElementNS(Oe,"path");d.setAttribute("d",this.generateBezierPath(r.x,r.y,n.x,n.y)),d.setAttribute("fill","none"),d.setAttribute(Fe,"true"),d.style.stroke=u,d.style.strokeWidth="2",d.style.opacity="0.6",d.style.strokeDasharray="8 4",d.style.pointerEvents="none",t.appendChild(d)}};var Ie=class{mData;get hasData(){return this.mData!==null}constructor(){this.mData=null}copy(t){let r=[],n=new Map;for(let v of t)v.isSystem||(n.set(v,r.length),r.push(v));if(r.length===0)return;let u=r.map(v=>{let w={};for(let[S,D]of v.inputs)D.portType==="value"&&D.directValue.length>0&&(w[S]=[...D.directValue]);return{definitionId:v.definition.id,transformation:{...v.transformation},label:v.label,inputDirectValues:w}}),d=[];for(let v of r){let w=n.get(v);for(let[S,D]of v.outputs)for(let a of D.connectedPorts){let o=n.get(a.node);o!==void 0&&d.push({sourceNodeIndex:w,sourcePortName:S,targetNodeIndex:o,targetPortName:a.name})}}this.mData={nodes:u,internalConnections:d}}paste(t,r,n,u){if(!this.mData)return[];let d=[];for(let v of this.mData.nodes){let w=t.project.nodeDefinitions.get(v.definitionId)??r.functionNodeDefinitions.get(v.definitionId);if(!w)continue;let S={x:v.transformation.x+n,y:v.transformation.y+u,width:v.transformation.width,height:v.transformation.height},D=t.newNode(w,S,!1);D.label=v.label;for(let[a,o]of Object.entries(v.inputDirectValues)){let c=D.inputs.get(a);c&&c.setDirectValue(o)}d.push(D)}for(let v of this.mData.internalConnections){let w=d[v.sourceNodeIndex],S=d[v.targetNodeIndex];if(!w||!S)continue;let D=w.outputs.get(v.sourcePortName),a=S.inputs.get(v.targetPortName);D&&a&&D.connect(a)}return d}};var De=class{mMaxSize;mCurrentIndex;mSnapshots;get canRedo(){return this.mCurrentIndex<this.mSnapshots.length-1}get canUndo(){return this.mCurrentIndex>0}constructor(t=100){this.mSnapshots=new Array,this.mCurrentIndex=-1,this.mMaxSize=t}push(t){this.mSnapshots.splice(this.mCurrentIndex+1),this.mSnapshots.push(t),this.mCurrentIndex=this.mSnapshots.length-1,this.mSnapshots.length>this.mMaxSize&&(this.mSnapshots.shift(),this.mCurrentIndex=this.mSnapshots.length-1)}undo(){return this.canUndo?(this.mCurrentIndex--,this.mSnapshots[this.mCurrentIndex]):null}redo(){return this.canRedo?(this.mCurrentIndex++,this.mSnapshots[this.mCurrentIndex]):null}clear(){this.mSnapshots.length=0,this.mCurrentIndex=-1}};var Lr=`:host {\r
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
`;var Rr=`<div class="editor-layout">\r
    <div #panelLeft class="panel-left">\r
        <potatno-panel-left\r
            [nodeDefinitions]="this.nodeDefinitionList"\r
            [functions]="this.functionList"\r
            [activeFunctionId]="this.activeFunctionId"\r
            [userFunctionDefinitions]="this.userFunctionDefinitions"\r
            (node-drag-start)="this.onNodeDragFromLibrary($event)"\r
            (function-select)="this.onFunctionSelect($event)"\r
            (function-add)="this.onFunctionAdd($event)"\r
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
                    $for(nodeState of this.visibleNodes) {\r
                        <div class="node-position" style="left:{{this.nodeState.pixelX}}px;top:{{this.nodeState.pixelY}}px;width:{{this.nodeState.pixelW}}px">\r
                            <potatno-node\r
                                [nodeData]="this.nodeState.node"\r
                                [selected]="this.nodeState.selected"\r
                                [gridSize]="this.interaction.gridSize"\r
                                [connectionVersion]="this.nodeState.connectionVersion"\r
                                [previewElement]="this.getPreviewElementForNode(this.nodeState.node)"\r
                                (pointerdown)="this.onNodePointerDown($event, this.nodeState.node)"\r
                                (port-drag-start)="this.onPortDragStart($event)"\r
                                (port-hover)="this.onPortHover($event)"\r
                                (port-leave)="this.onPortLeave($event)"\r
                                (resize-start)="this.onNodeResizeStart($event)"\r
                                (comment-change)="this.onCommentChange($event)"\r
                                (open-function)="this.onOpenFunction($event)"\r
                                (direct-value-change)="this.onDirectValueChange($event)">\r
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
                <potatno-preview #previewEl [errors]="this.editorErrors" [previewContent]="this.entryPreviewElement"></potatno-preview>\r
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
</div>`;var Mr=`:host {\r
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
    position: relative;\r
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
\r
.popup-overlay {\r
    position: fixed;\r
    top: 0;\r
    left: 0;\r
    right: 0;\r
    bottom: 0;\r
    z-index: 99;\r
}\r
\r
.popup {\r
    position: absolute;\r
    bottom: 100%;\r
    left: 8px;\r
    right: 8px;\r
    margin-bottom: 4px;\r
    background: var(--pn-bg-surface);\r
    border: 1px solid var(--pn-border-default);\r
    border-radius: 6px;\r
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);\r
    z-index: 100;\r
    overflow: hidden;\r
}\r
\r
.popup-header {\r
    padding: 8px 12px;\r
    font-family: var(--pn-font-family);\r
    font-size: var(--pn-font-size-sm);\r
    color: var(--pn-text-muted);\r
    border-bottom: 1px solid var(--pn-border-default);\r
    user-select: none;\r
}\r
\r
.popup-item {\r
    display: flex;\r
    align-items: center;\r
    gap: 8px;\r
    width: 100%;\r
    padding: 8px 12px;\r
    background: transparent;\r
    border: none;\r
    color: var(--pn-text-primary);\r
    font-family: var(--pn-font-family);\r
    font-size: var(--pn-font-size);\r
    cursor: pointer;\r
    transition: background 0.1s;\r
    text-align: left;\r
}\r
\r
.popup-item:hover {\r
    background: var(--pn-bg-elevated);\r
}\r
`;var Or=`<div class="function-list-content">\r
    $for(fn of this.functions) {\r
        <div [className]="this.getEntryClass(this.fn.id)" (click)="this.onFunctionSelect(this.fn.id)">\r
            <span class="function-icon">f</span>\r
            $if(this.fn.system) {\r
                <span class="lock-icon">&#128274;</span>\r
            }\r
            <span class="function-name">{{this.fn.label}}</span>\r
            $if(!this.fn.system) {\r
                <button class="delete-button" (click)="this.onFunctionDelete($event, this.fn.id)">&#10005;</button>\r
            }\r
        </div>\r
    }\r
</div>\r
$if(this.hasUserFunctionDefinitions) {\r
    <div class="add-button-wrapper">\r
        <button class="add-button" (click)="this.onAddButtonClick()">\r
            <span class="add-icon">+</span>\r
            <span>Add Function</span>\r
        </button>\r
        $if(this.showPopup) {\r
            <div class="popup-overlay" (click)="this.closePopup()"></div>\r
            <div class="popup">\r
                <div class="popup-header">Select Function Type</div>\r
                $for(def of this.userFunctionDefinitions) {\r
                    <button class="popup-item" (click)="this.onDefinitionSelect(this.def.id)">\r
                        <span class="function-icon">f</span>\r
                        <span>{{this.def.id}}</span>\r
                    </button>\r
                }\r
            </div>\r
        }\r
    </div>\r
}\r
`;function ma(){function p(a,o){return function(l){r(o,"addInitializer"),n(l,"An initializer"),a.push(l)}}function t(a,o,c,l,e,y,g,T,b){var f;switch(e){case 1:f="accessor";break;case 2:f="method";break;case 3:f="getter";break;case 4:f="setter";break;default:f="field"}var s={kind:f,name:g?"#"+o:o,static:y,private:g,metadata:T},m={v:!1};s.addInitializer=p(l,m);var i,h;e===0?g?(i=c.get,h=c.set):(i=function(){return this[o]},h=function(x){this[o]=x}):e===2?i=function(){return c.value}:((e===1||e===3)&&(i=function(){return c.get.call(this)}),(e===1||e===4)&&(h=function(x){c.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return a(b,s)}finally{m.v=!0}}function r(a,o){if(a.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(a,o){if(typeof a!="function")throw new TypeError(o+" must be a function")}function u(a,o){var c=typeof o;if(a===1){if(c!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(c!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function d(a,o,c,l,e,y,g,T,b){var f=c[0],s,m,i;g?e===0||e===1?s={get:c[3],set:c[4]}:e===3?s={get:c[3]}:e===4?s={set:c[3]}:s={value:c[3]}:e!==0&&(s=Object.getOwnPropertyDescriptor(o,l)),e===1?i={get:s.get,set:s.set}:e===2?i=s.value:e===3?i=s.get:e===4&&(i=s.set);var h,x,I;if(typeof f=="function")h=t(f,l,s,T,e,y,g,b,i),h!==void 0&&(u(e,h),e===0?m=h:e===1?(m=h.init,x=h.get||i.get,I=h.set||i.set,i={get:x,set:I}):i=h);else for(var _=f.length-1;_>=0;_--){var P=f[_];if(h=t(P,l,s,T,e,y,g,b,i),h!==void 0){u(e,h);var N;e===0?N=h:e===1?(N=h.init,x=h.get||i.get,I=h.set||i.set,i={get:x,set:I}):i=h,N!==void 0&&(m===void 0?m=N:typeof m=="function"?m=[m,N]:m.push(N))}}if(e===0||e===1){if(m===void 0)m=function(C,E){return E};else if(typeof m!="function"){var M=m;m=function(C,E){for(var L=E,R=0;R<M.length;R++)L=M[R].call(C,L);return L}}else{var B=m;m=function(C,E){return B.call(C,E)}}a.push(m)}e!==0&&(e===1?(s.get=i.get,s.set=i.set):e===2?s.value=i:e===3?s.get=i:e===4&&(s.set=i),g?e===1?(a.push(function(C,E){return i.get.call(C,E)}),a.push(function(C,E){return i.set.call(C,E)})):e===2?a.push(i):a.push(function(C,E){return i.call(C,E)}):Object.defineProperty(o,l,s))}function v(a,o,c){for(var l=[],e,y,g=new Map,T=new Map,b=0;b<o.length;b++){var f=o[b];if(Array.isArray(f)){var s=f[1],m=f[2],i=f.length>3,h=s>=5,x,I;if(h?(x=a,s=s-5,y=y||[],I=y):(x=a.prototype,e=e||[],I=e),s!==0&&!i){var _=h?T:g,P=_.get(m)||0;if(P===!0||P===3&&s!==4||P===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+m);!P&&s>2?_.set(m,s):_.set(m,!0)}d(l,x,f,m,s,h,i,I,c)}}return w(l,e),w(l,y),l}function w(a,o){o&&a.push(function(c){for(var l=0;l<o.length;l++)o[l].call(c);return c})}function S(a,o,c){if(o.length>0){for(var l=[],e=a,y=a.name,g=o.length-1;g>=0;g--){var T={v:!1};try{var b=o[g](e,{kind:"class",name:y,addInitializer:p(l,T),metadata:c})}finally{T.v=!0}b!==void 0&&(u(10,b),e=b)}return[D(e,c),function(){for(var f=0;f<l.length;f++)l[f].call(e)}]}}function D(a,o){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,c,l,e){if(e!==void 0)var y=e[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(y===void 0?null:y),T=v(o,c,g);return l.length||D(o,g),{e:T,get c(){return S(o,l,g)}}}}function Yr(p,t,r,n){return(Yr=ma())(p,t,r,n)}var Wr,Fr,Zr,qr,Jr,Kr,Qr,kr,to,Vr,$r,Br,jr,zr,Gr,Ur,Xr,pa;Wr=W({selector:"potatno-function-list",template:Or,style:Mr}),Zr=V.state(),qr=V.state(),Jr=V.state(),Kr=V.state(),Qr=z("function-select"),kr=z("function-add"),to=z("function-delete");var Hr=class{static{({e:[Vr,$r,Br,jr,zr,Gr,Ur,Xr],c:[pa,Fr]}=Yr(this,[[[$,Zr],1,"functions"],[[$,qr],1,"activeFunctionId"],[[$,Jr],1,"userFunctionDefinitions"],[Kr,1,"mShowPopup"],[Qr,1,"mFunctionSelect"],[kr,1,"mFunctionAdd"],[to,1,"mFunctionDelete"]],[Wr]))}#t=(Xr(this),Vr(this,[]));get functions(){return this.#t}set functions(t){this.#t=t}#e=$r(this,"");get activeFunctionId(){return this.#e}set activeFunctionId(t){this.#e=t}#r=Br(this,[]);get userFunctionDefinitions(){return this.#r}set userFunctionDefinitions(t){this.#r=t}#o=jr(this,!1);get mShowPopup(){return this.#o}set mShowPopup(t){this.#o=t}#n=zr(this);get mFunctionSelect(){return this.#n}set mFunctionSelect(t){this.#n=t}#i=Gr(this);get mFunctionAdd(){return this.#i}set mFunctionAdd(t){this.#i=t}#s=Ur(this);get mFunctionDelete(){return this.#s}set mFunctionDelete(t){this.#s=t}get hasUserFunctionDefinitions(){return this.userFunctionDefinitions.length>0}get showPopup(){return this.mShowPopup}getEntryClass(t){return t===this.activeFunctionId?"function-entry active":"function-entry"}onFunctionSelect(t){this.mFunctionSelect.dispatchEvent(t)}onAddButtonClick(){this.userFunctionDefinitions.length===1?this.mFunctionAdd.dispatchEvent(this.userFunctionDefinitions[0].id):this.mShowPopup=!this.mShowPopup}onDefinitionSelect(t){this.mShowPopup=!1,this.mFunctionAdd.dispatchEvent(t)}closePopup(){this.mShowPopup=!1}onFunctionDelete(t,r){t.stopPropagation(),this.mFunctionDelete.dispatchEvent(r)}static{Fr()}};var eo=`:host {\r
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
`;var ro=`$if(this.nodeData) {
    $if(this.isReroute) {
        <div class="node-reroute {{this.selectedClass}}"
             (pointerdown)="this.onNodePointerDown($event)">
            <div class="reroute-inputs">
                $for(inPort of this.inputPorts) {
                    <potatno-port
                        [port]="this.inPort"
                        [ownerNode]="this.nodeData"
                        [portVersion]="this.connectionVersion"
                        (port-drag-start)="this.onPortDragStart($event)"
                        (port-hover)="this.onPortHover($event)"
                        (port-leave)="this.onPortLeave($event)"
                        (direct-value-change)="this.onDirectValueChange($event)">
                    </potatno-port>
                }
            </div>
            <div class="reroute-dot"></div>
            <div class="reroute-outputs">
                $for(outPort of this.outputPorts) {
                    <potatno-port
                        [port]="this.outPort"
                        [ownerNode]="this.nodeData"
                        [portVersion]="this.connectionVersion"
                        (port-drag-start)="this.onPortDragStart($event)"
                        (port-hover)="this.onPortHover($event)"
                        (port-leave)="this.onPortLeave($event)"
                        (direct-value-change)="this.onDirectValueChange($event)">
                    </potatno-port>
                }
            </div>
        </div>
    }
    $if(!this.isReroute) {
    $if(this.isComment) {
        <div class="node-comment {{this.selectedClass}}"
             [style]="this.commentSizeStyle"
             (pointerdown)="this.onNodePointerDown($event)">
            <div class="comment-header">
                <span class="node-icon">{{this.categoryIcon}}</span>
                <span class="node-label">{{this.nodeName}}</span>
            </div>
            <div class="comment-body">
                <textarea [value]="this.nodeLabel"
                          (input)="this.onCommentInput($event)">
                </textarea>
            </div>
            <div class="resize-handle"
                 (pointerdown)="this.onResizeStart($event)">
            </div>
        </div>
    }
    $if(!this.isComment) {
        <div class="node {{this.selectedClass}}"
             (pointerdown)="this.onNodePointerDown($event)">
            <div class="node-header" style="background: {{this.categoryColor}}">
                <div class="header-flow-inputs">
                    $for(flowIn of this.flowInputPorts) {
                        <potatno-port
                            [port]="this.flowIn"
                            [ownerNode]="this.nodeData"
                            [portVersion]="this.connectionVersion"
                            (port-drag-start)="this.onPortDragStart($event)"
                            (port-hover)="this.onPortHover($event)"
                            (port-leave)="this.onPortLeave($event)"
                            (direct-value-change)="this.onDirectValueChange($event)">
                        </potatno-port>
                    }
                </div>
                <span class="node-icon">{{this.categoryIcon}}</span>
                <span class="node-label">{{this.nodeName}}</span>
                $if(this.showOpenButton) {
                    <button class="open-function-btn"
                            (click)="this.onOpenFunction($event)">
                        open
                    </button>
                }
                <div class="header-flow-outputs">
                    $for(flowOut of this.flowOutputPorts) {
                        <potatno-port
                            [port]="this.flowOut"
                            [ownerNode]="this.nodeData"
                            [portVersion]="this.connectionVersion"
                            (port-drag-start)="this.onPortDragStart($event)"
                            (port-hover)="this.onPortHover($event)"
                            (port-leave)="this.onPortLeave($event)"
                            (direct-value-change)="this.onDirectValueChange($event)">
                        </potatno-port>
                    }
                </div>
            </div>
            <div class="node-body">
                <div class="node-inputs">
                    $for(inPort of this.inputPorts) {
                        <potatno-port
                            [port]="this.inPort"
                            [ownerNode]="this.nodeData"
                            [portVersion]="this.connectionVersion"
                            (port-drag-start)="this.onPortDragStart($event)"
                            (port-hover)="this.onPortHover($event)"
                            (port-leave)="this.onPortLeave($event)"
                            (direct-value-change)="this.onDirectValueChange($event)">
                        </potatno-port>
                    }
                </div>
                <div class="node-outputs">
                    $for(outPort of this.outputPorts) {
                        <potatno-port
                            [port]="this.outPort"
                            [ownerNode]="this.nodeData"
                            [portVersion]="this.connectionVersion"
                            (port-drag-start)="this.onPortDragStart($event)"
                            (port-hover)="this.onPortHover($event)"
                            (port-leave)="this.onPortLeave($event)"
                            (direct-value-change)="this.onDirectValueChange($event)">
                        </potatno-port>
                    }
                </div>
            </div>
            <div class="node-preview" #NodePreview></div>
        </div>
    }
    }
}
`;var oo=`:host {\r
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
\r
/* \u2500\u2500 Direct value inputs \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */\r
\r
.direct-value-inputs {\r
    position: absolute;\r
    /* Place the right edge of this element at the left edge of the port circle\r
       so the inputs body does not overlap the port circle at all. */\r
    right: 100%;\r
    top: 50%;\r
    transform: translateY(-50%);\r
    display: flex;\r
    flex-direction: column;\r
    gap: 2px;\r
    align-items: flex-end;\r
    padding-right: 4px;\r
    pointer-events: all;\r
    z-index: 10;\r
}\r
\r
.direct-value-field {\r
    display: flex;\r
    align-items: center;\r
    gap: 3px;\r
    background: color-mix(in srgb, var(--port-color, var(--pn-text-muted)) 12%, var(--pn-node-bg));\r
    border: 1px solid color-mix(in srgb, var(--port-color, var(--pn-text-muted)) 40%, transparent);\r
    border-radius: 3px 0 0 3px;\r
    border-right: none;\r
    padding: 2px 6px 2px 4px;\r
    position: relative;\r
    white-space: nowrap;\r
}\r
\r
/* Arrow tip pointing right toward the port circle */\r
.direct-value-field::after {\r
    content: '';\r
    position: absolute;\r
    right: -7px;\r
    top: 50%;\r
    transform: translateY(-50%);\r
    width: 0;\r
    height: 0;\r
    border-top: 7px solid transparent;\r
    border-bottom: 7px solid transparent;\r
    border-left: 7px solid color-mix(in srgb, var(--port-color, var(--pn-text-muted)) 40%, transparent);\r
    pointer-events: none;\r
}\r
\r
.direct-value-label {\r
    font-size: var(--pn-font-size-xs, 10px);\r
    color: color-mix(in srgb, var(--port-color, var(--pn-text-muted)) 80%, var(--pn-text-secondary));\r
    white-space: nowrap;\r
    user-select: none;\r
    flex-shrink: 0;\r
}\r
\r
.direct-value-input {\r
    background: color-mix(in srgb, var(--port-color, var(--pn-text-muted)) 8%, var(--pn-node-bg, #1e1e1e));\r
    border: 1px solid color-mix(in srgb, var(--port-color, var(--pn-text-muted)) 35%, transparent);\r
    border-radius: 2px;\r
    color: var(--pn-text-primary);\r
    font-size: var(--pn-font-size-sm);\r
    padding: 1px 3px;\r
    width: 60px;\r
    min-width: 30px;\r
    max-width: 90px;\r
    box-sizing: border-box;\r
}\r
\r
.direct-value-input:focus {\r
    outline: none;\r
    border-color: var(--port-color, var(--pn-text-muted));\r
    box-shadow: 0 0 0 1px color-mix(in srgb, var(--port-color, var(--pn-text-muted)) 30%, transparent);\r
}\r
\r
.direct-value-input[type='checkbox'] {\r
    width: auto;\r
    min-width: auto;\r
    accent-color: var(--port-color, var(--pn-text-muted));\r
    cursor: pointer;\r
}\r
`;var no=`<div [className]="this.portWrapperClasses" [title]="this.portTypeLabel" style="--port-color: {{this.portColor}}">
    <div #portCircle [className]="this.portCircleClasses"
         (pointerdown)="this.onPointerDown($event)"
         (pointerenter)="this.onPointerEnter($event)"
         (pointerleave)="this.onPointerLeave($event)">
    </div>
    <span class="port-label">{{this.portName}}</span>
    $if(this.showDirectValueInput) {
        <div class="direct-value-inputs" (pointerdown)="$event.stopPropagation()">
            $for(inputDef of this.directValueInputDefs) {
                <div class="direct-value-field">
                    <span class="direct-value-label">{{this.inputDef.name}}</span>
                    <input [type]="this.inputDef.htmlType"
                           class="direct-value-input"
                           [value]="this.inputDef.value"
                           (input)="this.onDirectValueInput($event, this.inputDef.index)"/>
                </div>
            }
        </div>
    }
</div>
`;function ya(){function p(a,o){return function(l){r(o,"addInitializer"),n(l,"An initializer"),a.push(l)}}function t(a,o,c,l,e,y,g,T,b){var f;switch(e){case 1:f="accessor";break;case 2:f="method";break;case 3:f="getter";break;case 4:f="setter";break;default:f="field"}var s={kind:f,name:g?"#"+o:o,static:y,private:g,metadata:T},m={v:!1};s.addInitializer=p(l,m);var i,h;e===0?g?(i=c.get,h=c.set):(i=function(){return this[o]},h=function(x){this[o]=x}):e===2?i=function(){return c.value}:((e===1||e===3)&&(i=function(){return c.get.call(this)}),(e===1||e===4)&&(h=function(x){c.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return a(b,s)}finally{m.v=!0}}function r(a,o){if(a.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(a,o){if(typeof a!="function")throw new TypeError(o+" must be a function")}function u(a,o){var c=typeof o;if(a===1){if(c!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(c!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function d(a,o,c,l,e,y,g,T,b){var f=c[0],s,m,i;g?e===0||e===1?s={get:c[3],set:c[4]}:e===3?s={get:c[3]}:e===4?s={set:c[3]}:s={value:c[3]}:e!==0&&(s=Object.getOwnPropertyDescriptor(o,l)),e===1?i={get:s.get,set:s.set}:e===2?i=s.value:e===3?i=s.get:e===4&&(i=s.set);var h,x,I;if(typeof f=="function")h=t(f,l,s,T,e,y,g,b,i),h!==void 0&&(u(e,h),e===0?m=h:e===1?(m=h.init,x=h.get||i.get,I=h.set||i.set,i={get:x,set:I}):i=h);else for(var _=f.length-1;_>=0;_--){var P=f[_];if(h=t(P,l,s,T,e,y,g,b,i),h!==void 0){u(e,h);var N;e===0?N=h:e===1?(N=h.init,x=h.get||i.get,I=h.set||i.set,i={get:x,set:I}):i=h,N!==void 0&&(m===void 0?m=N:typeof m=="function"?m=[m,N]:m.push(N))}}if(e===0||e===1){if(m===void 0)m=function(C,E){return E};else if(typeof m!="function"){var M=m;m=function(C,E){for(var L=E,R=0;R<M.length;R++)L=M[R].call(C,L);return L}}else{var B=m;m=function(C,E){return B.call(C,E)}}a.push(m)}e!==0&&(e===1?(s.get=i.get,s.set=i.set):e===2?s.value=i:e===3?s.get=i:e===4&&(s.set=i),g?e===1?(a.push(function(C,E){return i.get.call(C,E)}),a.push(function(C,E){return i.set.call(C,E)})):e===2?a.push(i):a.push(function(C,E){return i.call(C,E)}):Object.defineProperty(o,l,s))}function v(a,o,c){for(var l=[],e,y,g=new Map,T=new Map,b=0;b<o.length;b++){var f=o[b];if(Array.isArray(f)){var s=f[1],m=f[2],i=f.length>3,h=s>=5,x,I;if(h?(x=a,s=s-5,y=y||[],I=y):(x=a.prototype,e=e||[],I=e),s!==0&&!i){var _=h?T:g,P=_.get(m)||0;if(P===!0||P===3&&s!==4||P===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+m);!P&&s>2?_.set(m,s):_.set(m,!0)}d(l,x,f,m,s,h,i,I,c)}}return w(l,e),w(l,y),l}function w(a,o){o&&a.push(function(c){for(var l=0;l<o.length;l++)o[l].call(c);return c})}function S(a,o,c){if(o.length>0){for(var l=[],e=a,y=a.name,g=o.length-1;g>=0;g--){var T={v:!1};try{var b=o[g](e,{kind:"class",name:y,addInitializer:p(l,T),metadata:c})}finally{T.v=!0}b!==void 0&&(u(10,b),e=b)}return[D(e,c),function(){for(var f=0;f<l.length;f++)l[f].call(e)}]}}function D(a,o){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,c,l,e){if(e!==void 0)var y=e[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(y===void 0?null:y),T=v(o,c,g);return l.length||D(o,g),{e:T,get c(){return S(o,l,g)}}}}function go(p,t,r,n){return(go=ya())(p,t,r,n)}var yo,io,bo,wo,xo,To,Eo,Co,So,Io,so,ao,lo,co,uo,ho,mo,po,fo,ba;yo=W({selector:"potatno-port",template:no,style:oo}),bo=V.state(),wo=V.state(),xo=V.state(),To=z("port-drag-start"),Eo=z("port-hover"),Co=z("port-leave"),So=z("direct-value-change"),Io=lt("portCircle");var vo=class{static{({e:[so,ao,lo,co,uo,ho,mo,po,fo],c:[ba,io]}=go(this,[[[$,bo],1,"port"],[[$,wo],1,"portVersion"],[[$,xo],1,"ownerNode"],[To,1,"mPortDragStart"],[Eo,1,"mPortHover"],[Co,1,"mPortLeave"],[So,1,"mDirectValueChange"],[Io,1,"portCircleElement"]],[yo]))}#t=(fo(this),so(this,null));get port(){return this.#t}set port(t){this.#t=t}#e=ao(this,0);get portVersion(){return this.#e}set portVersion(t){this.#e=t}#r=lo(this,null);get ownerNode(){return this.#r}set ownerNode(t){this.#r=t}#o=co(this);get mPortDragStart(){return this.#o}set mPortDragStart(t){this.#o=t}#n=uo(this);get mPortHover(){return this.#n}set mPortHover(t){this.#n=t}#i=ho(this);get mPortLeave(){return this.#i}set mPortLeave(t){this.#i=t}#s=mo(this);get mDirectValueChange(){return this.#s}set mDirectValueChange(t){this.#s=t}#a=po(this);get portCircleElement(){return this.#a}set portCircleElement(t){this.#a=t}get portName(){return this.port?.name??""}get portTypeLabel(){return this.port?.type??""}get portWrapperClasses(){return`port-wrapper ${this.port?.direction==="output"?"direction-output":"direction-input"}`}get portCircleClasses(){if(!this.port)return"port-circle disconnected direction-input";let t=["port-circle"];return t.push(this.port.connectedPorts.size>0?"connected":"disconnected"),t.push(this.port.direction==="output"?"direction-output":"direction-input"),t.join(" ")}get portColor(){return!this.port||this.port.portType==="flow"?"var(--pn-text-primary)":this.getTypeColor(this.port.type)}get showDirectValueInput(){return this.portVersion,this.port?this.port.portType==="value"&&this.port.direction==="input"&&this.port.connectedPorts.size===0:!1}get directValueInputDefs(){return!this.port||this.port.portType!=="value"?[]:this.port.project.types.getType(this.port.type).inputs.map((r,n)=>({htmlType:r.type==="number"?"number":r.type==="boolean"?"checkbox":"text",index:n,name:r.name,value:this.port.directValue[n]??""}))}onPointerDown(t){t.stopPropagation(),t.preventDefault(),!(!this.port||!this.ownerNode)&&this.mPortDragStart.dispatchEvent({node:this.ownerNode,port:this.port,element:this.portCircleElement})}onPointerEnter(t){!this.port||!this.ownerNode||this.mPortHover.dispatchEvent({node:this.ownerNode,port:this.port,element:this.portCircleElement})}onPointerLeave(t){this.mPortLeave.dispatchEvent(void 0)}onDirectValueInput(t,r){if(!this.port)return;let n=t.target,u=[...this.port.directValue];u[r]=n.type==="checkbox"?n.checked?"true":"false":n.value,this.port.setDirectValue(u),this.mDirectValueChange.dispatchEvent({port:this.port,values:u})}getTypeColor(t){let r=0;for(let u=0;u<t.length;u++)r=t.charCodeAt(u)+((r<<5)-r);return`hsl(${Math.abs(r)*137.508%360}, 70%, 60%)`}static{io()}};function wa(){function p(a,o){return function(l){r(o,"addInitializer"),n(l,"An initializer"),a.push(l)}}function t(a,o,c,l,e,y,g,T,b){var f;switch(e){case 1:f="accessor";break;case 2:f="method";break;case 3:f="getter";break;case 4:f="setter";break;default:f="field"}var s={kind:f,name:g?"#"+o:o,static:y,private:g,metadata:T},m={v:!1};s.addInitializer=p(l,m);var i,h;e===0?g?(i=c.get,h=c.set):(i=function(){return this[o]},h=function(x){this[o]=x}):e===2?i=function(){return c.value}:((e===1||e===3)&&(i=function(){return c.get.call(this)}),(e===1||e===4)&&(h=function(x){c.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return a(b,s)}finally{m.v=!0}}function r(a,o){if(a.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(a,o){if(typeof a!="function")throw new TypeError(o+" must be a function")}function u(a,o){var c=typeof o;if(a===1){if(c!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(c!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function d(a,o,c,l,e,y,g,T,b){var f=c[0],s,m,i;g?e===0||e===1?s={get:c[3],set:c[4]}:e===3?s={get:c[3]}:e===4?s={set:c[3]}:s={value:c[3]}:e!==0&&(s=Object.getOwnPropertyDescriptor(o,l)),e===1?i={get:s.get,set:s.set}:e===2?i=s.value:e===3?i=s.get:e===4&&(i=s.set);var h,x,I;if(typeof f=="function")h=t(f,l,s,T,e,y,g,b,i),h!==void 0&&(u(e,h),e===0?m=h:e===1?(m=h.init,x=h.get||i.get,I=h.set||i.set,i={get:x,set:I}):i=h);else for(var _=f.length-1;_>=0;_--){var P=f[_];if(h=t(P,l,s,T,e,y,g,b,i),h!==void 0){u(e,h);var N;e===0?N=h:e===1?(N=h.init,x=h.get||i.get,I=h.set||i.set,i={get:x,set:I}):i=h,N!==void 0&&(m===void 0?m=N:typeof m=="function"?m=[m,N]:m.push(N))}}if(e===0||e===1){if(m===void 0)m=function(C,E){return E};else if(typeof m!="function"){var M=m;m=function(C,E){for(var L=E,R=0;R<M.length;R++)L=M[R].call(C,L);return L}}else{var B=m;m=function(C,E){return B.call(C,E)}}a.push(m)}e!==0&&(e===1?(s.get=i.get,s.set=i.set):e===2?s.value=i:e===3?s.get=i:e===4&&(s.set=i),g?e===1?(a.push(function(C,E){return i.get.call(C,E)}),a.push(function(C,E){return i.set.call(C,E)})):e===2?a.push(i):a.push(function(C,E){return i.call(C,E)}):Object.defineProperty(o,l,s))}function v(a,o,c){for(var l=[],e,y,g=new Map,T=new Map,b=0;b<o.length;b++){var f=o[b];if(Array.isArray(f)){var s=f[1],m=f[2],i=f.length>3,h=s>=5,x,I;if(h?(x=a,s=s-5,y=y||[],I=y):(x=a.prototype,e=e||[],I=e),s!==0&&!i){var _=h?T:g,P=_.get(m)||0;if(P===!0||P===3&&s!==4||P===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+m);!P&&s>2?_.set(m,s):_.set(m,!0)}d(l,x,f,m,s,h,i,I,c)}}return w(l,e),w(l,y),l}function w(a,o){o&&a.push(function(c){for(var l=0;l<o.length;l++)o[l].call(c);return c})}function S(a,o,c){if(o.length>0){for(var l=[],e=a,y=a.name,g=o.length-1;g>=0;g--){var T={v:!1};try{var b=o[g](e,{kind:"class",name:y,addInitializer:p(l,T),metadata:c})}finally{T.v=!0}b!==void 0&&(u(10,b),e=b)}return[D(e,c),function(){for(var f=0;f<l.length;f++)l[f].call(e)}]}}function D(a,o){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,c,l,e){if(e!==void 0)var y=e[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(y===void 0?null:y),T=v(o,c,g);return l.length||D(o,g),{e:T,get c(){return S(o,l,g)}}}}function Ho(p,t,r,n){return(Ho=wa())(p,t,r,n)}var Yo,Do,Wo,Zo,qo,Jo,Ko,Qo,ko,tn,en,rn,on,nn,sn,an,_o,Po,No,Ao,Lo,Ro,Mo,Oo,Fo,Vo,$o,Bo,jo,zo,Go,Uo,xa;Yo=W({selector:"potatno-node",template:ro,style:eo}),Wo=V.state(),Zo=V.state(),qo=V.state(),Jo=V.state(),Ko=lt("NodePreview"),Qo=z("node-select"),ko=z("node-drag-start"),tn=z("port-drag-start"),en=z("port-hover"),rn=z("port-leave"),on=z("open-function"),nn=z("comment-change"),sn=z("resize-start"),an=z("direct-value-change");var Xo=class{static{({e:[_o,Po,No,Ao,Lo,Ro,Mo,Oo,Fo,Vo,$o,Bo,jo,zo,Go,Uo],c:[xa,Do]}=Ho(this,[[[$,Wo],1,"nodeData"],[[$,Zo],1,"connectionVersion"],[[$,qo],1,"selected"],[[$,Jo],1,"gridSize"],[Ko,1,"mPreviewContainer"],[Qo,1,"mNodeSelect"],[ko,1,"mNodeDragStart"],[tn,1,"mPortDragStart"],[en,1,"mPortHover"],[rn,1,"mPortLeave"],[on,1,"mOpenFunction"],[nn,1,"mCommentChange"],[sn,1,"mResizeStart"],[an,1,"mDirectValueChange"],[$,0,"previewElement"]],[Yo]))}#t=(Uo(this),_o(this,null));get nodeData(){return this.#t}set nodeData(t){this.#t=t}#e=Po(this,0);get connectionVersion(){return this.#e}set connectionVersion(t){this.#e=t}#r=No(this,!1);get selected(){return this.#r}set selected(t){this.#r=t}#o=Ao(this,20);get gridSize(){return this.#o}set gridSize(t){this.#o=t}previewElement=Go(this,null);#n=Lo(this);get mPreviewContainer(){return this.#n}set mPreviewContainer(t){this.#n=t}#i=Ro(this);get mNodeSelect(){return this.#i}set mNodeSelect(t){this.#i=t}#s=Mo(this);get mNodeDragStart(){return this.#s}set mNodeDragStart(t){this.#s=t}#a=Oo(this);get mPortDragStart(){return this.#a}set mPortDragStart(t){this.#a=t}#l=Fo(this);get mPortHover(){return this.#l}set mPortHover(t){this.#l=t}#c=Vo(this);get mPortLeave(){return this.#c}set mPortLeave(t){this.#c=t}#u=$o(this);get mOpenFunction(){return this.#u}set mOpenFunction(t){this.#u=t}#h=Bo(this);get mCommentChange(){return this.#h}set mCommentChange(t){this.#h=t}#m=jo(this);get mResizeStart(){return this.#m}set mResizeStart(t){this.#m=t}#p=zo(this);get mDirectValueChange(){return this.#p}set mDirectValueChange(t){this.#p=t}get selectedClass(){return this.selected?"selected":""}get isComment(){return this.nodeData?.definition.category===j.Comment}get isReroute(){return this.nodeData?.definition.category===j.Reroute}get isFunction(){return this.nodeData?.definition.category===j.Function}get showOpenButton(){return this.nodeData?this.isFunction&&!this.nodeData.isSystem:!1}get categoryColor(){return this.nodeData?Mt.get(this.nodeData.definition.category).cssColor:""}get categoryIcon(){return this.nodeData?Mt.get(this.nodeData.definition.category).icon:""}get nodeLabel(){return this.nodeData?.label??""}get nodeName(){return this.nodeData?.name??""}get commentSizeStyle(){return this.nodeData?`height: ${this.nodeData.transformation.height*this.gridSize}px;`:""}get inputPorts(){return this.nodeData?[...this.nodeData.inputs.values()].filter(t=>t.portType==="value"):[]}get outputPorts(){return this.nodeData?[...this.nodeData.outputs.values()].filter(t=>t.portType==="value"):[]}get flowInputPorts(){return this.nodeData?[...this.nodeData.inputs.values()].filter(t=>t.portType==="flow"):[]}get flowOutputPorts(){return this.nodeData?[...this.nodeData.outputs.values()].filter(t=>t.portType==="flow"):[]}onUpdate(){let t=this.previewElement;if(!t)return;let r;try{r=this.mPreviewContainer}catch{return}t.parentElement!==r&&(r.innerHTML="",r.appendChild(t))}onNodePointerDown(t){t.target.tagName?.toLowerCase()!=="potatno-port"&&this.nodeData&&(this.mNodeSelect.dispatchEvent({node:this.nodeData,shiftKey:t.shiftKey}),this.mNodeDragStart.dispatchEvent({node:this.nodeData,startX:t.clientX,startY:t.clientY}))}onPortDragStart(t){this.mPortDragStart.dispatchEvent(t.value)}onPortHover(t){this.mPortHover.dispatchEvent(t.value)}onPortLeave(t){this.mPortLeave.dispatchEvent(void 0)}onDirectValueChange(t){this.mDirectValueChange.dispatchEvent(t.value)}onOpenFunction(t){t.stopPropagation(),this.nodeData&&this.mOpenFunction.dispatchEvent({node:this.nodeData})}onCommentInput(t){let r=t.target;this.nodeData&&(this.nodeData.label=r.value,this.mCommentChange.dispatchEvent({node:this.nodeData,text:r.value}))}onResizeStart(t){t.stopPropagation(),t.preventDefault(),this.nodeData&&this.mResizeStart.dispatchEvent({node:this.nodeData,startX:t.clientX,startY:t.clientY})}static{Do()}};var ln=`:host {\r
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
`;var cn=`<div class="search-wrapper">\r
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
</div>`;function Ca(){function p(a,o){return function(l){r(o,"addInitializer"),n(l,"An initializer"),a.push(l)}}function t(a,o,c,l,e,y,g,T,b){var f;switch(e){case 1:f="accessor";break;case 2:f="method";break;case 3:f="getter";break;case 4:f="setter";break;default:f="field"}var s={kind:f,name:g?"#"+o:o,static:y,private:g,metadata:T},m={v:!1};s.addInitializer=p(l,m);var i,h;e===0?g?(i=c.get,h=c.set):(i=function(){return this[o]},h=function(x){this[o]=x}):e===2?i=function(){return c.value}:((e===1||e===3)&&(i=function(){return c.get.call(this)}),(e===1||e===4)&&(h=function(x){c.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return a(b,s)}finally{m.v=!0}}function r(a,o){if(a.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(a,o){if(typeof a!="function")throw new TypeError(o+" must be a function")}function u(a,o){var c=typeof o;if(a===1){if(c!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(c!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function d(a,o,c,l,e,y,g,T,b){var f=c[0],s,m,i;g?e===0||e===1?s={get:c[3],set:c[4]}:e===3?s={get:c[3]}:e===4?s={set:c[3]}:s={value:c[3]}:e!==0&&(s=Object.getOwnPropertyDescriptor(o,l)),e===1?i={get:s.get,set:s.set}:e===2?i=s.value:e===3?i=s.get:e===4&&(i=s.set);var h,x,I;if(typeof f=="function")h=t(f,l,s,T,e,y,g,b,i),h!==void 0&&(u(e,h),e===0?m=h:e===1?(m=h.init,x=h.get||i.get,I=h.set||i.set,i={get:x,set:I}):i=h);else for(var _=f.length-1;_>=0;_--){var P=f[_];if(h=t(P,l,s,T,e,y,g,b,i),h!==void 0){u(e,h);var N;e===0?N=h:e===1?(N=h.init,x=h.get||i.get,I=h.set||i.set,i={get:x,set:I}):i=h,N!==void 0&&(m===void 0?m=N:typeof m=="function"?m=[m,N]:m.push(N))}}if(e===0||e===1){if(m===void 0)m=function(C,E){return E};else if(typeof m!="function"){var M=m;m=function(C,E){for(var L=E,R=0;R<M.length;R++)L=M[R].call(C,L);return L}}else{var B=m;m=function(C,E){return B.call(C,E)}}a.push(m)}e!==0&&(e===1?(s.get=i.get,s.set=i.set):e===2?s.value=i:e===3?s.get=i:e===4&&(s.set=i),g?e===1?(a.push(function(C,E){return i.get.call(C,E)}),a.push(function(C,E){return i.set.call(C,E)})):e===2?a.push(i):a.push(function(C,E){return i.call(C,E)}):Object.defineProperty(o,l,s))}function v(a,o,c){for(var l=[],e,y,g=new Map,T=new Map,b=0;b<o.length;b++){var f=o[b];if(Array.isArray(f)){var s=f[1],m=f[2],i=f.length>3,h=s>=5,x,I;if(h?(x=a,s=s-5,y=y||[],I=y):(x=a.prototype,e=e||[],I=e),s!==0&&!i){var _=h?T:g,P=_.get(m)||0;if(P===!0||P===3&&s!==4||P===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+m);!P&&s>2?_.set(m,s):_.set(m,!0)}d(l,x,f,m,s,h,i,I,c)}}return w(l,e),w(l,y),l}function w(a,o){o&&a.push(function(c){for(var l=0;l<o.length;l++)o[l].call(c);return c})}function S(a,o,c){if(o.length>0){for(var l=[],e=a,y=a.name,g=o.length-1;g>=0;g--){var T={v:!1};try{var b=o[g](e,{kind:"class",name:y,addInitializer:p(l,T),metadata:c})}finally{T.v=!0}b!==void 0&&(u(10,b),e=b)}return[D(e,c),function(){for(var f=0;f<l.length;f++)l[f].call(e)}]}}function D(a,o){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,c,l,e){if(e!==void 0)var y=e[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(y===void 0?null:y),T=v(o,c,g);return l.length||D(o,g),{e:T,get c(){return S(o,l,g)}}}}function dn(p,t,r,n){return(dn=Ca())(p,t,r,n)}var vn,un,gn,yn,hn,mn,pn,Sa;vn=W({selector:"potatno-node-library",template:cn,style:ln}),gn=V.state(),yn=z("node-drag-start");var fn=class{static{({e:[hn,mn,pn],c:[Sa,un]}=dn(this,[[gn,1,"mCachedFilteredGroups"],[yn,1,"mNodeDragStart"],[$,4,"nodeDefinitions"]],[vn]))}mNodeDefinitions=(pn(this),[]);#t=hn(this,[]);get mCachedFilteredGroups(){return this.#t}set mCachedFilteredGroups(t){this.#t=t}#e=mn(this);get mNodeDragStart(){return this.#e}set mNodeDragStart(t){this.#e=t}mSearchQuery="";mCollapsedCategories={};set nodeDefinitions(t){this.mNodeDefinitions=t,this.rebuildFilteredGroups()}get nodeDefinitions(){return this.mNodeDefinitions}get filteredGroups(){return this.mCachedFilteredGroups}rebuildFilteredGroups(){let t=this.mSearchQuery.toLowerCase(),r=new Map,n=new Array;for(let d of this.mNodeDefinitions){if(t&&!d.name.toLowerCase().includes(t))continue;let v=r.get(d.category);v||(v=[],r.set(d.category,v),n.push(d.category)),v.push(d)}let u=[];for(let d of n){let v=r.get(d);if(v&&v.length>0){let w=Mt.get(d);u.push({category:d,icon:w.icon,label:w.label,cssColor:w.cssColor,nodes:v})}}this.mCachedFilteredGroups=u}onSearchInput(t){this.mSearchQuery=t.target.value,this.rebuildFilteredGroups()}toggleCategory(t){this.mCollapsedCategories[t]=!this.mCollapsedCategories[t],this.rebuildFilteredGroups()}isCategoryCollapsed(t){return!!this.mCollapsedCategories[t]}getToggleClass(t){return this.mCollapsedCategories[t]?"category-toggle collapsed":"category-toggle"}onNodeMouseDown(t){this.mNodeDragStart.dispatchEvent(t)}static{un()}};var bn=`:host {\r
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
`;var wn=`<div class="tab-bar">\r
    <button [className]="this.getTabClass(0)" (click)="this.onTabClick(0)">Nodes</button>\r
    <button [className]="this.getTabClass(1)" (click)="this.onTabClick(1)">Functions</button>\r
</div>\r
<div class="tab-content">\r
    $if(this.activeTabIndex === 0) {\r
        <potatno-node-library [nodeDefinitions]="this.nodeDefinitions" (node-drag-start)="this.onNodeDragStart($event)"></potatno-node-library>\r
    }\r
    $if(this.activeTabIndex === 1) {\r
        <potatno-function-list [functions]="this.functions" [activeFunctionId]="this.activeFunctionId" [userFunctionDefinitions]="this.userFunctionDefinitions" (function-select)="this.onFunctionSelect($event)" (function-add)="this.onFunctionAdd($event)" (function-delete)="this.onFunctionDelete($event)"></potatno-function-list>\r
    }\r
</div>`;function _a(){function p(a,o){return function(l){r(o,"addInitializer"),n(l,"An initializer"),a.push(l)}}function t(a,o,c,l,e,y,g,T,b){var f;switch(e){case 1:f="accessor";break;case 2:f="method";break;case 3:f="getter";break;case 4:f="setter";break;default:f="field"}var s={kind:f,name:g?"#"+o:o,static:y,private:g,metadata:T},m={v:!1};s.addInitializer=p(l,m);var i,h;e===0?g?(i=c.get,h=c.set):(i=function(){return this[o]},h=function(x){this[o]=x}):e===2?i=function(){return c.value}:((e===1||e===3)&&(i=function(){return c.get.call(this)}),(e===1||e===4)&&(h=function(x){c.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return a(b,s)}finally{m.v=!0}}function r(a,o){if(a.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(a,o){if(typeof a!="function")throw new TypeError(o+" must be a function")}function u(a,o){var c=typeof o;if(a===1){if(c!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(c!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function d(a,o,c,l,e,y,g,T,b){var f=c[0],s,m,i;g?e===0||e===1?s={get:c[3],set:c[4]}:e===3?s={get:c[3]}:e===4?s={set:c[3]}:s={value:c[3]}:e!==0&&(s=Object.getOwnPropertyDescriptor(o,l)),e===1?i={get:s.get,set:s.set}:e===2?i=s.value:e===3?i=s.get:e===4&&(i=s.set);var h,x,I;if(typeof f=="function")h=t(f,l,s,T,e,y,g,b,i),h!==void 0&&(u(e,h),e===0?m=h:e===1?(m=h.init,x=h.get||i.get,I=h.set||i.set,i={get:x,set:I}):i=h);else for(var _=f.length-1;_>=0;_--){var P=f[_];if(h=t(P,l,s,T,e,y,g,b,i),h!==void 0){u(e,h);var N;e===0?N=h:e===1?(N=h.init,x=h.get||i.get,I=h.set||i.set,i={get:x,set:I}):i=h,N!==void 0&&(m===void 0?m=N:typeof m=="function"?m=[m,N]:m.push(N))}}if(e===0||e===1){if(m===void 0)m=function(C,E){return E};else if(typeof m!="function"){var M=m;m=function(C,E){for(var L=E,R=0;R<M.length;R++)L=M[R].call(C,L);return L}}else{var B=m;m=function(C,E){return B.call(C,E)}}a.push(m)}e!==0&&(e===1?(s.get=i.get,s.set=i.set):e===2?s.value=i:e===3?s.get=i:e===4&&(s.set=i),g?e===1?(a.push(function(C,E){return i.get.call(C,E)}),a.push(function(C,E){return i.set.call(C,E)})):e===2?a.push(i):a.push(function(C,E){return i.call(C,E)}):Object.defineProperty(o,l,s))}function v(a,o,c){for(var l=[],e,y,g=new Map,T=new Map,b=0;b<o.length;b++){var f=o[b];if(Array.isArray(f)){var s=f[1],m=f[2],i=f.length>3,h=s>=5,x,I;if(h?(x=a,s=s-5,y=y||[],I=y):(x=a.prototype,e=e||[],I=e),s!==0&&!i){var _=h?T:g,P=_.get(m)||0;if(P===!0||P===3&&s!==4||P===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+m);!P&&s>2?_.set(m,s):_.set(m,!0)}d(l,x,f,m,s,h,i,I,c)}}return w(l,e),w(l,y),l}function w(a,o){o&&a.push(function(c){for(var l=0;l<o.length;l++)o[l].call(c);return c})}function S(a,o,c){if(o.length>0){for(var l=[],e=a,y=a.name,g=o.length-1;g>=0;g--){var T={v:!1};try{var b=o[g](e,{kind:"class",name:y,addInitializer:p(l,T),metadata:c})}finally{T.v=!0}b!==void 0&&(u(10,b),e=b)}return[D(e,c),function(){for(var f=0;f<l.length;f++)l[f].call(e)}]}}function D(a,o){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,c,l,e){if(e!==void 0)var y=e[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(y===void 0?null:y),T=v(o,c,g);return l.length||D(o,g),{e:T,get c(){return S(o,l,g)}}}}function Rn(p,t,r,n){return(Rn=_a())(p,t,r,n)}var Mn,xn,On,Fn,Vn,$n,Bn,jn,zn,Gn,Un,Tn,En,Cn,Sn,In,Dn,_n,Pn,Nn,An,Pa;Mn=W({selector:"potatno-panel-left",template:wn,style:bn}),On=V.state(),Fn=V.state(),Vn=V.state(),$n=V.state(),Bn=z("node-drag-start"),jn=z("function-select"),zn=z("function-add"),Gn=z("function-delete"),Un=V.state();var Ln=class{static{({e:[Tn,En,Cn,Sn,In,Dn,_n,Pn,Nn,An],c:[Pa,xn]}=Rn(this,[[[$,On],1,"nodeDefinitions"],[[$,Fn],1,"functions"],[[$,Vn],1,"activeFunctionId"],[[$,$n],1,"userFunctionDefinitions"],[Bn,1,"mNodeDragStart"],[jn,1,"mFunctionSelect"],[zn,1,"mFunctionAdd"],[Gn,1,"mFunctionDelete"],[Un,1,"mActiveTabIndex"]],[Mn]))}#t=(An(this),Tn(this,[]));get nodeDefinitions(){return this.#t}set nodeDefinitions(t){this.#t=t}#e=En(this,[]);get functions(){return this.#e}set functions(t){this.#e=t}#r=Cn(this,"");get activeFunctionId(){return this.#r}set activeFunctionId(t){this.#r=t}#o=Sn(this,[]);get userFunctionDefinitions(){return this.#o}set userFunctionDefinitions(t){this.#o=t}#n=In(this);get mNodeDragStart(){return this.#n}set mNodeDragStart(t){this.#n=t}#i=Dn(this);get mFunctionSelect(){return this.#i}set mFunctionSelect(t){this.#i=t}#s=_n(this);get mFunctionAdd(){return this.#s}set mFunctionAdd(t){this.#s=t}#a=Pn(this);get mFunctionDelete(){return this.#a}set mFunctionDelete(t){this.#a=t}#l=Nn(this,0);get mActiveTabIndex(){return this.#l}set mActiveTabIndex(t){this.#l=t}get activeTabIndex(){return this.mActiveTabIndex}getTabClass(t){return t===this.mActiveTabIndex?"tab-button active":"tab-button"}onTabClick(t){this.mActiveTabIndex=t}onNodeDragStart(t){this.mNodeDragStart.dispatchEvent(t.value)}onFunctionSelect(t){this.mFunctionSelect.dispatchEvent(t.value)}onFunctionAdd(t){this.mFunctionAdd.dispatchEvent(t.value)}onFunctionDelete(t){this.mFunctionDelete.dispatchEvent(t.value)}static{xn()}};var Xn=`:host {\r
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
`;var Hn=`<div class="properties-header">Properties</div>\r
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
`;function La(){function p(a,o){return function(l){r(o,"addInitializer"),n(l,"An initializer"),a.push(l)}}function t(a,o,c,l,e,y,g,T,b){var f;switch(e){case 1:f="accessor";break;case 2:f="method";break;case 3:f="getter";break;case 4:f="setter";break;default:f="field"}var s={kind:f,name:g?"#"+o:o,static:y,private:g,metadata:T},m={v:!1};s.addInitializer=p(l,m);var i,h;e===0?g?(i=c.get,h=c.set):(i=function(){return this[o]},h=function(x){this[o]=x}):e===2?i=function(){return c.value}:((e===1||e===3)&&(i=function(){return c.get.call(this)}),(e===1||e===4)&&(h=function(x){c.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return a(b,s)}finally{m.v=!0}}function r(a,o){if(a.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(a,o){if(typeof a!="function")throw new TypeError(o+" must be a function")}function u(a,o){var c=typeof o;if(a===1){if(c!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(c!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function d(a,o,c,l,e,y,g,T,b){var f=c[0],s,m,i;g?e===0||e===1?s={get:c[3],set:c[4]}:e===3?s={get:c[3]}:e===4?s={set:c[3]}:s={value:c[3]}:e!==0&&(s=Object.getOwnPropertyDescriptor(o,l)),e===1?i={get:s.get,set:s.set}:e===2?i=s.value:e===3?i=s.get:e===4&&(i=s.set);var h,x,I;if(typeof f=="function")h=t(f,l,s,T,e,y,g,b,i),h!==void 0&&(u(e,h),e===0?m=h:e===1?(m=h.init,x=h.get||i.get,I=h.set||i.set,i={get:x,set:I}):i=h);else for(var _=f.length-1;_>=0;_--){var P=f[_];if(h=t(P,l,s,T,e,y,g,b,i),h!==void 0){u(e,h);var N;e===0?N=h:e===1?(N=h.init,x=h.get||i.get,I=h.set||i.set,i={get:x,set:I}):i=h,N!==void 0&&(m===void 0?m=N:typeof m=="function"?m=[m,N]:m.push(N))}}if(e===0||e===1){if(m===void 0)m=function(C,E){return E};else if(typeof m!="function"){var M=m;m=function(C,E){for(var L=E,R=0;R<M.length;R++)L=M[R].call(C,L);return L}}else{var B=m;m=function(C,E){return B.call(C,E)}}a.push(m)}e!==0&&(e===1?(s.get=i.get,s.set=i.set):e===2?s.value=i:e===3?s.get=i:e===4&&(s.set=i),g?e===1?(a.push(function(C,E){return i.get.call(C,E)}),a.push(function(C,E){return i.set.call(C,E)})):e===2?a.push(i):a.push(function(C,E){return i.call(C,E)}):Object.defineProperty(o,l,s))}function v(a,o,c){for(var l=[],e,y,g=new Map,T=new Map,b=0;b<o.length;b++){var f=o[b];if(Array.isArray(f)){var s=f[1],m=f[2],i=f.length>3,h=s>=5,x,I;if(h?(x=a,s=s-5,y=y||[],I=y):(x=a.prototype,e=e||[],I=e),s!==0&&!i){var _=h?T:g,P=_.get(m)||0;if(P===!0||P===3&&s!==4||P===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+m);!P&&s>2?_.set(m,s):_.set(m,!0)}d(l,x,f,m,s,h,i,I,c)}}return w(l,e),w(l,y),l}function w(a,o){o&&a.push(function(c){for(var l=0;l<o.length;l++)o[l].call(c);return c})}function S(a,o,c){if(o.length>0){for(var l=[],e=a,y=a.name,g=o.length-1;g>=0;g--){var T={v:!1};try{var b=o[g](e,{kind:"class",name:y,addInitializer:p(l,T),metadata:c})}finally{T.v=!0}b!==void 0&&(u(10,b),e=b)}return[D(e,c),function(){for(var f=0;f<l.length;f++)l[f].call(e)}]}}function D(a,o){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,c,l,e){if(e!==void 0)var y=e[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(y===void 0?null:y),T=v(o,c,g);return l.length||D(o,g),{e:T,get c(){return S(o,l,g)}}}}function ii(p,t,r,n){return(ii=La())(p,t,r,n)}var si,Yn,ai,li,ci,ui,hi,mi,pi,fi,di,vi,Wn,Zn,qn,Jn,Kn,Qn,kn,ti,ei,ri,oi,Ra;si=W({selector:"potatno-panel-properties",template:Hn,style:Xn}),ai=V.state(),li=V.state(),ci=V.state(),ui=V.state(),hi=V.state(),mi=V.state(),pi=V.state(),fi=V.state(),di=V.state(),vi=z("properties-change");var ni=class{static{({e:[Wn,Zn,qn,Jn,Kn,Qn,kn,ti,ei,ri,oi],c:[Ra,Yn]}=ii(this,[[[$,ai],1,"functionName"],[[$,li],1,"functionInputs"],[[$,ci],1,"functionOutputs"],[ui,1,"mFunctionImports"],[$,4,"functionImports"],[[$,hi],1,"isSystem"],[[$,mi],1,"editableByUser"],[pi,1,"mAvailableImports"],[$,4,"availableImports"],[fi,1,"mAvailableTypes"],[$,4,"availableTypes"],[di,1,"mCachedUnusedImports"],[vi,1,"mPropertiesChange"]],[si]))}#t=(oi(this),Wn(this,""));get functionName(){return this.#t}set functionName(t){this.#t=t}#e=Zn(this,[]);get functionInputs(){return this.#e}set functionInputs(t){this.#e=t}#r=qn(this,[]);get functionOutputs(){return this.#r}set functionOutputs(t){this.#r=t}#o=Jn(this,[]);get mFunctionImports(){return this.#o}set mFunctionImports(t){this.#o=t}set functionImports(t){this.mFunctionImports=t,this.rebuildUnusedImports()}get functionImports(){return this.mFunctionImports}#n=Kn(this,!1);get isSystem(){return this.#n}set isSystem(t){this.#n=t}#i=Qn(this,!1);get editableByUser(){return this.#i}set editableByUser(t){this.#i=t}get nameDisabled(){return this.isSystem}get portsDisabled(){return this.isSystem&&!this.editableByUser}#s=kn(this,[]);get mAvailableImports(){return this.#s}set mAvailableImports(t){this.#s=t}set availableImports(t){this.mAvailableImports=t,this.rebuildUnusedImports()}get availableImports(){return this.mAvailableImports}#a=ti(this,[]);get mAvailableTypes(){return this.#a}set mAvailableTypes(t){this.#a=t}set availableTypes(t){this.mAvailableTypes=t}get availableTypes(){return this.mAvailableTypes}#l=ei(this,[]);get mCachedUnusedImports(){return this.#l}set mCachedUnusedImports(t){this.#l=t}mSelectedImport="";#c=ri(this);get mPropertiesChange(){return this.#c}set mPropertiesChange(t){this.#c=t}validateName(t){return/^[a-zA-Z][a-zA-Z0-9_]*$/.test(t)}isNameDuplicate(t,r,n){if(r!=="function"&&t===this.functionName)return!0;for(let u=0;u<this.functionInputs.length;u++)if(!(r==="input"&&u===n)&&this.functionInputs[u].name===t)return!0;for(let u=0;u<this.functionOutputs.length;u++)if(!(r==="output"&&u===n)&&this.functionOutputs[u].name===t)return!0;return!1}onNameChange(t){let r=t.target,n=r.value,u=!this.validateName(n)||this.isNameDuplicate(n,"function");r.style.borderColor=u?"var(--pn-accent-danger)":"",this.functionName=n,this.mPropertiesChange.dispatchEvent({name:n})}onInputNameChange(t,r){let n=r.target,u=n.value,d=!this.validateName(u)||this.isNameDuplicate(u,"input",t);n.style.borderColor=d?"var(--pn-accent-danger)":"";let v=[...this.functionInputs];v[t]={...v[t],name:u},this.functionInputs=v,this.mPropertiesChange.dispatchEvent({inputs:v})}onInputTypeChange(t,r){let n=r.target.value,u=[...this.functionInputs];u[t]={...u[t],type:n},this.functionInputs=u,this.mPropertiesChange.dispatchEvent({inputs:u})}onOutputNameChange(t,r){let n=r.target,u=n.value,d=!this.validateName(u)||this.isNameDuplicate(u,"output",t);n.style.borderColor=d?"var(--pn-accent-danger)":"";let v=[...this.functionOutputs];v[t]={...v[t],name:u},this.functionOutputs=v,this.mPropertiesChange.dispatchEvent({outputs:v})}onOutputTypeChange(t,r){let n=r.target.value,u=[...this.functionOutputs];u[t]={...u[t],type:n},this.functionOutputs=u,this.mPropertiesChange.dispatchEvent({outputs:u})}onAddInput(){let t=this.mAvailableTypes.length>0?this.mAvailableTypes[0]:"number",r=[...this.functionInputs,{name:"new_input",type:t}];this.functionInputs=r,this.mPropertiesChange.dispatchEvent({inputs:r})}onDeleteInput(t){let r=[...this.functionInputs];r.splice(t,1),this.functionInputs=r,this.mPropertiesChange.dispatchEvent({inputs:r})}onAddOutput(){let t=this.mAvailableTypes.length>0?this.mAvailableTypes[0]:"number",r=[...this.functionOutputs,{name:"new_output",type:t}];this.functionOutputs=r,this.mPropertiesChange.dispatchEvent({outputs:r})}onDeleteOutput(t){let r=[...this.functionOutputs];r.splice(t,1),this.functionOutputs=r,this.mPropertiesChange.dispatchEvent({outputs:r})}get unusedImports(){return this.mCachedUnusedImports}onImportSelectChange(t){this.mSelectedImport=t.target.value}onAddSelectedImport(){let t=this.mSelectedImport||(this.mCachedUnusedImports.length>0?this.mCachedUnusedImports[0]:"");if(!t)return;let r=[...this.mFunctionImports,t];this.functionImports=r,this.mSelectedImport="",this.mPropertiesChange.dispatchEvent({imports:r})}onDeleteImport(t){let r=[...this.mFunctionImports];r.splice(t,1),this.functionImports=r,this.mPropertiesChange.dispatchEvent({imports:r})}rebuildUnusedImports(){let t=new Set(this.mFunctionImports);this.mCachedUnusedImports=this.mAvailableImports.filter(r=>!t.has(r))}static{Yn()}};var gi=`:host {\r
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
`;var yi=`<div class="resize-handle" (pointerdown)="this.onResizePointerDown($event)"></div>\r
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
`;function Fa(){function p(a,o){return function(l){r(o,"addInitializer"),n(l,"An initializer"),a.push(l)}}function t(a,o,c,l,e,y,g,T,b){var f;switch(e){case 1:f="accessor";break;case 2:f="method";break;case 3:f="getter";break;case 4:f="setter";break;default:f="field"}var s={kind:f,name:g?"#"+o:o,static:y,private:g,metadata:T},m={v:!1};s.addInitializer=p(l,m);var i,h;e===0?g?(i=c.get,h=c.set):(i=function(){return this[o]},h=function(x){this[o]=x}):e===2?i=function(){return c.value}:((e===1||e===3)&&(i=function(){return c.get.call(this)}),(e===1||e===4)&&(h=function(x){c.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return a(b,s)}finally{m.v=!0}}function r(a,o){if(a.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(a,o){if(typeof a!="function")throw new TypeError(o+" must be a function")}function u(a,o){var c=typeof o;if(a===1){if(c!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(c!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function d(a,o,c,l,e,y,g,T,b){var f=c[0],s,m,i;g?e===0||e===1?s={get:c[3],set:c[4]}:e===3?s={get:c[3]}:e===4?s={set:c[3]}:s={value:c[3]}:e!==0&&(s=Object.getOwnPropertyDescriptor(o,l)),e===1?i={get:s.get,set:s.set}:e===2?i=s.value:e===3?i=s.get:e===4&&(i=s.set);var h,x,I;if(typeof f=="function")h=t(f,l,s,T,e,y,g,b,i),h!==void 0&&(u(e,h),e===0?m=h:e===1?(m=h.init,x=h.get||i.get,I=h.set||i.set,i={get:x,set:I}):i=h);else for(var _=f.length-1;_>=0;_--){var P=f[_];if(h=t(P,l,s,T,e,y,g,b,i),h!==void 0){u(e,h);var N;e===0?N=h:e===1?(N=h.init,x=h.get||i.get,I=h.set||i.set,i={get:x,set:I}):i=h,N!==void 0&&(m===void 0?m=N:typeof m=="function"?m=[m,N]:m.push(N))}}if(e===0||e===1){if(m===void 0)m=function(C,E){return E};else if(typeof m!="function"){var M=m;m=function(C,E){for(var L=E,R=0;R<M.length;R++)L=M[R].call(C,L);return L}}else{var B=m;m=function(C,E){return B.call(C,E)}}a.push(m)}e!==0&&(e===1?(s.get=i.get,s.set=i.set):e===2?s.value=i:e===3?s.get=i:e===4&&(s.set=i),g?e===1?(a.push(function(C,E){return i.get.call(C,E)}),a.push(function(C,E){return i.set.call(C,E)})):e===2?a.push(i):a.push(function(C,E){return i.call(C,E)}):Object.defineProperty(o,l,s))}function v(a,o,c){for(var l=[],e,y,g=new Map,T=new Map,b=0;b<o.length;b++){var f=o[b];if(Array.isArray(f)){var s=f[1],m=f[2],i=f.length>3,h=s>=5,x,I;if(h?(x=a,s=s-5,y=y||[],I=y):(x=a.prototype,e=e||[],I=e),s!==0&&!i){var _=h?T:g,P=_.get(m)||0;if(P===!0||P===3&&s!==4||P===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+m);!P&&s>2?_.set(m,s):_.set(m,!0)}d(l,x,f,m,s,h,i,I,c)}}return w(l,e),w(l,y),l}function w(a,o){o&&a.push(function(c){for(var l=0;l<o.length;l++)o[l].call(c);return c})}function S(a,o,c){if(o.length>0){for(var l=[],e=a,y=a.name,g=o.length-1;g>=0;g--){var T={v:!1};try{var b=o[g](e,{kind:"class",name:y,addInitializer:p(l,T),metadata:c})}finally{T.v=!0}b!==void 0&&(u(10,b),e=b)}return[D(e,c),function(){for(var f=0;f<l.length;f++)l[f].call(e)}]}}function D(a,o){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,c,l,e){if(e!==void 0)var y=e[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(y===void 0?null:y),T=v(o,c,g);return l.length||D(o,g),{e:T,get c(){return S(o,l,g)}}}}function Si(p,t,r,n){return(Si=Fa())(p,t,r,n)}var Ii,bi,Di,_i,Pi,wi,xi,Ti,Ei,Va;Ii=W({selector:"potatno-preview",template:yi,style:gi}),Di=lt("PreviewContent"),_i=lt("PreviewContainer"),Pi=V.state();var Ci=class{static{({e:[wi,xi,Ti,Ei],c:[Va,bi]}=Si(this,[[[$,Di],1,"contentElement"],[_i,1,"containerElement"],[[$,Pi],1,"errors"],[$,4,"previewContent"],[$,2,"getContainer"],[$,2,"setContent"]],[Ii]))}#t=(Ei(this),wi(this));get contentElement(){return this.#t}set contentElement(t){this.#t=t}#e=xi(this);get containerElement(){return this.#e}set containerElement(t){this.#e=t}#r=Ti(this,[]);get errors(){return this.#r}set errors(t){this.#r=t}get hasErrors(){return this.errors.length>0}mDragging=!1;mStartX=0;mStartY=0;mStartWidth=0;mStartHeight=0;mStoredElement=null;set previewContent(t){console.log("[Preview] previewContent setter called with:",t),this.mStoredElement=t,this.tryAppendStoredElement()}onUpdate(){this.tryAppendStoredElement()}tryAppendStoredElement(){if(!this.mStoredElement)return;let t;try{t=this.contentElement}catch(r){console.error("[Preview] contentElement not accessible:",r);return}if(console.log("[Preview] tryAppendStoredElement - container:",t,"element:",this.mStoredElement,"contains:",t.contains(this.mStoredElement)),!t.contains(this.mStoredElement)){for(;t.firstChild;)t.removeChild(t.firstChild);t.appendChild(this.mStoredElement),console.log("[Preview] element appended to container")}}getContainer(){return this.contentElement}setContent(t){let r=this.contentElement;for(;r.firstChild;)r.removeChild(r.firstChild);r.appendChild(t)}onResizePointerDown(t){t.preventDefault(),t.stopPropagation(),this.mDragging=!0,this.mStartX=t.clientX,this.mStartY=t.clientY;let r=this.containerElement;if(!r)return;this.mStartWidth=r.offsetWidth,this.mStartHeight=r.offsetHeight,t.target.setPointerCapture(t.pointerId);let n=d=>{if(!this.mDragging)return;let v=this.mStartX-d.clientX,w=this.mStartY-d.clientY,S=Math.max(200,this.mStartWidth+v),D=Math.max(150,this.mStartHeight+w);r.style.width=S+"px",r.style.height=D+"px"},u=d=>{this.mDragging=!1,d.target.releasePointerCapture(d.pointerId),document.removeEventListener("pointermove",n),document.removeEventListener("pointerup",u)};document.addEventListener("pointermove",n),document.addEventListener("pointerup",u)}static{bi()}};var Ni=`.resize-handle {\r
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
`;var Ai=`<div [className]="this.getHandleClass()" (pointerdown)="this.onPointerDown($event)"></div>\r
`;function ja(){function p(a,o){return function(l){r(o,"addInitializer"),n(l,"An initializer"),a.push(l)}}function t(a,o,c,l,e,y,g,T,b){var f;switch(e){case 1:f="accessor";break;case 2:f="method";break;case 3:f="getter";break;case 4:f="setter";break;default:f="field"}var s={kind:f,name:g?"#"+o:o,static:y,private:g,metadata:T},m={v:!1};s.addInitializer=p(l,m);var i,h;e===0?g?(i=c.get,h=c.set):(i=function(){return this[o]},h=function(x){this[o]=x}):e===2?i=function(){return c.value}:((e===1||e===3)&&(i=function(){return c.get.call(this)}),(e===1||e===4)&&(h=function(x){c.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return a(b,s)}finally{m.v=!0}}function r(a,o){if(a.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(a,o){if(typeof a!="function")throw new TypeError(o+" must be a function")}function u(a,o){var c=typeof o;if(a===1){if(c!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(c!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function d(a,o,c,l,e,y,g,T,b){var f=c[0],s,m,i;g?e===0||e===1?s={get:c[3],set:c[4]}:e===3?s={get:c[3]}:e===4?s={set:c[3]}:s={value:c[3]}:e!==0&&(s=Object.getOwnPropertyDescriptor(o,l)),e===1?i={get:s.get,set:s.set}:e===2?i=s.value:e===3?i=s.get:e===4&&(i=s.set);var h,x,I;if(typeof f=="function")h=t(f,l,s,T,e,y,g,b,i),h!==void 0&&(u(e,h),e===0?m=h:e===1?(m=h.init,x=h.get||i.get,I=h.set||i.set,i={get:x,set:I}):i=h);else for(var _=f.length-1;_>=0;_--){var P=f[_];if(h=t(P,l,s,T,e,y,g,b,i),h!==void 0){u(e,h);var N;e===0?N=h:e===1?(N=h.init,x=h.get||i.get,I=h.set||i.set,i={get:x,set:I}):i=h,N!==void 0&&(m===void 0?m=N:typeof m=="function"?m=[m,N]:m.push(N))}}if(e===0||e===1){if(m===void 0)m=function(C,E){return E};else if(typeof m!="function"){var M=m;m=function(C,E){for(var L=E,R=0;R<M.length;R++)L=M[R].call(C,L);return L}}else{var B=m;m=function(C,E){return B.call(C,E)}}a.push(m)}e!==0&&(e===1?(s.get=i.get,s.set=i.set):e===2?s.value=i:e===3?s.get=i:e===4&&(s.set=i),g?e===1?(a.push(function(C,E){return i.get.call(C,E)}),a.push(function(C,E){return i.set.call(C,E)})):e===2?a.push(i):a.push(function(C,E){return i.call(C,E)}):Object.defineProperty(o,l,s))}function v(a,o,c){for(var l=[],e,y,g=new Map,T=new Map,b=0;b<o.length;b++){var f=o[b];if(Array.isArray(f)){var s=f[1],m=f[2],i=f.length>3,h=s>=5,x,I;if(h?(x=a,s=s-5,y=y||[],I=y):(x=a.prototype,e=e||[],I=e),s!==0&&!i){var _=h?T:g,P=_.get(m)||0;if(P===!0||P===3&&s!==4||P===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+m);!P&&s>2?_.set(m,s):_.set(m,!0)}d(l,x,f,m,s,h,i,I,c)}}return w(l,e),w(l,y),l}function w(a,o){o&&a.push(function(c){for(var l=0;l<o.length;l++)o[l].call(c);return c})}function S(a,o,c){if(o.length>0){for(var l=[],e=a,y=a.name,g=o.length-1;g>=0;g--){var T={v:!1};try{var b=o[g](e,{kind:"class",name:y,addInitializer:p(l,T),metadata:c})}finally{T.v=!0}b!==void 0&&(u(10,b),e=b)}return[D(e,c),function(){for(var f=0;f<l.length;f++)l[f].call(e)}]}}function D(a,o){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,c,l,e){if(e!==void 0)var y=e[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(y===void 0?null:y),T=v(o,c,g);return l.length||D(o,g),{e:T,get c(){return S(o,l,g)}}}}function Vi(p,t,r,n){return(Vi=ja())(p,t,r,n)}var $i,Li,Bi,ji,Ri,Mi,Oi,za;$i=W({selector:"potatno-resize-handle",template:Ai,style:Ni}),Bi=V.state(),ji=z("resize");var Fi=class{static{({e:[Ri,Mi,Oi],c:[za,Li]}=Vi(this,[[[$,Bi],1,"direction"],[ji,1,"mResize"]],[$i]))}#t=(Oi(this),Ri(this,"vertical"));get direction(){return this.#t}set direction(t){this.#t=t}#e=Mi(this);get mResize(){return this.#e}set mResize(t){this.#e=t}mDragging=!1;mStartPosition=0;getHandleClass(){return`resize-handle ${this.direction}`}onPointerDown(t){t.preventDefault(),this.mDragging=!0,this.mStartPosition=this.direction==="vertical"?t.clientX:t.clientY,t.target.setPointerCapture(t.pointerId);let r=u=>{if(!this.mDragging)return;let d=this.direction==="vertical"?u.clientX:u.clientY,v=d-this.mStartPosition;this.mStartPosition=d,this.mResize.dispatchEvent({delta:v})},n=u=>{this.mDragging=!1,u.target.releasePointerCapture(u.pointerId),document.removeEventListener("pointermove",r),document.removeEventListener("pointerup",n)};document.addEventListener("pointermove",r),document.addEventListener("pointerup",n)}static{Li()}};var zi=`.search-wrapper {\r
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
`;var Gi=`<div class="search-wrapper">\r
    <svg class="search-icon" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">\r
        <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" stroke-width="1.5"/>\r
        <line x1="10.5" y1="10.5" x2="14.5" y2="14.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>\r
    </svg>\r
    <input class="search-field" type="text" [placeholder]="this.placeholder" [value]="this.value" (input)="this.onInput($event)"/>\r
</div>\r
`;function Xa(){function p(a,o){return function(l){r(o,"addInitializer"),n(l,"An initializer"),a.push(l)}}function t(a,o,c,l,e,y,g,T,b){var f;switch(e){case 1:f="accessor";break;case 2:f="method";break;case 3:f="getter";break;case 4:f="setter";break;default:f="field"}var s={kind:f,name:g?"#"+o:o,static:y,private:g,metadata:T},m={v:!1};s.addInitializer=p(l,m);var i,h;e===0?g?(i=c.get,h=c.set):(i=function(){return this[o]},h=function(x){this[o]=x}):e===2?i=function(){return c.value}:((e===1||e===3)&&(i=function(){return c.get.call(this)}),(e===1||e===4)&&(h=function(x){c.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return a(b,s)}finally{m.v=!0}}function r(a,o){if(a.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(a,o){if(typeof a!="function")throw new TypeError(o+" must be a function")}function u(a,o){var c=typeof o;if(a===1){if(c!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(c!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function d(a,o,c,l,e,y,g,T,b){var f=c[0],s,m,i;g?e===0||e===1?s={get:c[3],set:c[4]}:e===3?s={get:c[3]}:e===4?s={set:c[3]}:s={value:c[3]}:e!==0&&(s=Object.getOwnPropertyDescriptor(o,l)),e===1?i={get:s.get,set:s.set}:e===2?i=s.value:e===3?i=s.get:e===4&&(i=s.set);var h,x,I;if(typeof f=="function")h=t(f,l,s,T,e,y,g,b,i),h!==void 0&&(u(e,h),e===0?m=h:e===1?(m=h.init,x=h.get||i.get,I=h.set||i.set,i={get:x,set:I}):i=h);else for(var _=f.length-1;_>=0;_--){var P=f[_];if(h=t(P,l,s,T,e,y,g,b,i),h!==void 0){u(e,h);var N;e===0?N=h:e===1?(N=h.init,x=h.get||i.get,I=h.set||i.set,i={get:x,set:I}):i=h,N!==void 0&&(m===void 0?m=N:typeof m=="function"?m=[m,N]:m.push(N))}}if(e===0||e===1){if(m===void 0)m=function(C,E){return E};else if(typeof m!="function"){var M=m;m=function(C,E){for(var L=E,R=0;R<M.length;R++)L=M[R].call(C,L);return L}}else{var B=m;m=function(C,E){return B.call(C,E)}}a.push(m)}e!==0&&(e===1?(s.get=i.get,s.set=i.set):e===2?s.value=i:e===3?s.get=i:e===4&&(s.set=i),g?e===1?(a.push(function(C,E){return i.get.call(C,E)}),a.push(function(C,E){return i.set.call(C,E)})):e===2?a.push(i):a.push(function(C,E){return i.call(C,E)}):Object.defineProperty(o,l,s))}function v(a,o,c){for(var l=[],e,y,g=new Map,T=new Map,b=0;b<o.length;b++){var f=o[b];if(Array.isArray(f)){var s=f[1],m=f[2],i=f.length>3,h=s>=5,x,I;if(h?(x=a,s=s-5,y=y||[],I=y):(x=a.prototype,e=e||[],I=e),s!==0&&!i){var _=h?T:g,P=_.get(m)||0;if(P===!0||P===3&&s!==4||P===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+m);!P&&s>2?_.set(m,s):_.set(m,!0)}d(l,x,f,m,s,h,i,I,c)}}return w(l,e),w(l,y),l}function w(a,o){o&&a.push(function(c){for(var l=0;l<o.length;l++)o[l].call(c);return c})}function S(a,o,c){if(o.length>0){for(var l=[],e=a,y=a.name,g=o.length-1;g>=0;g--){var T={v:!1};try{var b=o[g](e,{kind:"class",name:y,addInitializer:p(l,T),metadata:c})}finally{T.v=!0}b!==void 0&&(u(10,b),e=b)}return[D(e,c),function(){for(var f=0;f<l.length;f++)l[f].call(e)}]}}function D(a,o){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,c,l,e){if(e!==void 0)var y=e[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(y===void 0?null:y),T=v(o,c,g);return l.length||D(o,g),{e:T,get c(){return S(o,l,g)}}}}function qi(p,t,r,n){return(qi=Xa())(p,t,r,n)}var Ji,Ui,Ki,Qi,ki,Xi,Hi,Yi,Wi,Ha;Ji=W({selector:"potatno-search-input",template:Gi,style:zi}),Ki=V.state(),Qi=V.state(),ki=z("search-change");var Zi=class{static{({e:[Xi,Hi,Yi,Wi],c:[Ha,Ui]}=qi(this,[[[$,Ki],1,"placeholder"],[[$,Qi],1,"value"],[ki,1,"mSearchChange"]],[Ji]))}#t=(Wi(this),Xi(this,"Search..."));get placeholder(){return this.#t}set placeholder(t){this.#t=t}#e=Hi(this,"");get value(){return this.#e}set value(t){this.#e=t}#r=Yi(this);get mSearchChange(){return this.#r}set mSearchChange(t){this.#r=t}onInput(t){let r=t.target;this.value=r.value,this.mSearchChange.dispatchEvent(this.value)}static{Ui()}};var ts=`.tabs-header {\r
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
`;var es=`<div class="tabs-header">\r
    $for(tab of this.tabs; index = $index) {\r
        <button [className]="this.getTabClass(this.index)" (click)="this.onTabClick(this.index)">{{this.tab}}</button>\r
    }\r
</div>\r
<div class="tabs-content">\r
    $slot\r
</div>\r
`;function Za(){function p(a,o){return function(l){r(o,"addInitializer"),n(l,"An initializer"),a.push(l)}}function t(a,o,c,l,e,y,g,T,b){var f;switch(e){case 1:f="accessor";break;case 2:f="method";break;case 3:f="getter";break;case 4:f="setter";break;default:f="field"}var s={kind:f,name:g?"#"+o:o,static:y,private:g,metadata:T},m={v:!1};s.addInitializer=p(l,m);var i,h;e===0?g?(i=c.get,h=c.set):(i=function(){return this[o]},h=function(x){this[o]=x}):e===2?i=function(){return c.value}:((e===1||e===3)&&(i=function(){return c.get.call(this)}),(e===1||e===4)&&(h=function(x){c.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return a(b,s)}finally{m.v=!0}}function r(a,o){if(a.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(a,o){if(typeof a!="function")throw new TypeError(o+" must be a function")}function u(a,o){var c=typeof o;if(a===1){if(c!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(c!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function d(a,o,c,l,e,y,g,T,b){var f=c[0],s,m,i;g?e===0||e===1?s={get:c[3],set:c[4]}:e===3?s={get:c[3]}:e===4?s={set:c[3]}:s={value:c[3]}:e!==0&&(s=Object.getOwnPropertyDescriptor(o,l)),e===1?i={get:s.get,set:s.set}:e===2?i=s.value:e===3?i=s.get:e===4&&(i=s.set);var h,x,I;if(typeof f=="function")h=t(f,l,s,T,e,y,g,b,i),h!==void 0&&(u(e,h),e===0?m=h:e===1?(m=h.init,x=h.get||i.get,I=h.set||i.set,i={get:x,set:I}):i=h);else for(var _=f.length-1;_>=0;_--){var P=f[_];if(h=t(P,l,s,T,e,y,g,b,i),h!==void 0){u(e,h);var N;e===0?N=h:e===1?(N=h.init,x=h.get||i.get,I=h.set||i.set,i={get:x,set:I}):i=h,N!==void 0&&(m===void 0?m=N:typeof m=="function"?m=[m,N]:m.push(N))}}if(e===0||e===1){if(m===void 0)m=function(C,E){return E};else if(typeof m!="function"){var M=m;m=function(C,E){for(var L=E,R=0;R<M.length;R++)L=M[R].call(C,L);return L}}else{var B=m;m=function(C,E){return B.call(C,E)}}a.push(m)}e!==0&&(e===1?(s.get=i.get,s.set=i.set):e===2?s.value=i:e===3?s.get=i:e===4&&(s.set=i),g?e===1?(a.push(function(C,E){return i.get.call(C,E)}),a.push(function(C,E){return i.set.call(C,E)})):e===2?a.push(i):a.push(function(C,E){return i.call(C,E)}):Object.defineProperty(o,l,s))}function v(a,o,c){for(var l=[],e,y,g=new Map,T=new Map,b=0;b<o.length;b++){var f=o[b];if(Array.isArray(f)){var s=f[1],m=f[2],i=f.length>3,h=s>=5,x,I;if(h?(x=a,s=s-5,y=y||[],I=y):(x=a.prototype,e=e||[],I=e),s!==0&&!i){var _=h?T:g,P=_.get(m)||0;if(P===!0||P===3&&s!==4||P===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+m);!P&&s>2?_.set(m,s):_.set(m,!0)}d(l,x,f,m,s,h,i,I,c)}}return w(l,e),w(l,y),l}function w(a,o){o&&a.push(function(c){for(var l=0;l<o.length;l++)o[l].call(c);return c})}function S(a,o,c){if(o.length>0){for(var l=[],e=a,y=a.name,g=o.length-1;g>=0;g--){var T={v:!1};try{var b=o[g](e,{kind:"class",name:y,addInitializer:p(l,T),metadata:c})}finally{T.v=!0}b!==void 0&&(u(10,b),e=b)}return[D(e,c),function(){for(var f=0;f<l.length;f++)l[f].call(e)}]}}function D(a,o){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,c,l,e){if(e!==void 0)var y=e[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(y===void 0?null:y),T=v(o,c,g);return l.length||D(o,g),{e:T,get c(){return S(o,l,g)}}}}function ls(p,t,r,n){return(ls=Za())(p,t,r,n)}var cs,rs,us,hs,ms,os,ns,is,ss,qa;cs=W({selector:"potatno-tabs",template:es,style:ts}),us=V.state(),hs=V.state(),ms=z("tab-change");var as=class{static{({e:[os,ns,is,ss],c:[qa,rs]}=ls(this,[[[$,us],1,"tabs"],[[$,hs],1,"activeIndex"],[ms,1,"mTabChange"]],[cs]))}#t=(ss(this),os(this,[]));get tabs(){return this.#t}set tabs(t){this.#t=t}#e=ns(this,0);get activeIndex(){return this.#e}set activeIndex(t){this.#e=t}#r=is(this);get mTabChange(){return this.#r}set mTabChange(t){this.#r=t}getTabClass(t){return t===this.activeIndex?"tab-button active":"tab-button"}onTabClick(t){this.activeIndex=t,this.mTabChange.dispatchEvent(t)}static{rs()}};function Ja(){function p(a,o){return function(l){r(o,"addInitializer"),n(l,"An initializer"),a.push(l)}}function t(a,o,c,l,e,y,g,T,b){var f;switch(e){case 1:f="accessor";break;case 2:f="method";break;case 3:f="getter";break;case 4:f="setter";break;default:f="field"}var s={kind:f,name:g?"#"+o:o,static:y,private:g,metadata:T},m={v:!1};s.addInitializer=p(l,m);var i,h;e===0?g?(i=c.get,h=c.set):(i=function(){return this[o]},h=function(x){this[o]=x}):e===2?i=function(){return c.value}:((e===1||e===3)&&(i=function(){return c.get.call(this)}),(e===1||e===4)&&(h=function(x){c.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return a(b,s)}finally{m.v=!0}}function r(a,o){if(a.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(a,o){if(typeof a!="function")throw new TypeError(o+" must be a function")}function u(a,o){var c=typeof o;if(a===1){if(c!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(c!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function d(a,o,c,l,e,y,g,T,b){var f=c[0],s,m,i;g?e===0||e===1?s={get:c[3],set:c[4]}:e===3?s={get:c[3]}:e===4?s={set:c[3]}:s={value:c[3]}:e!==0&&(s=Object.getOwnPropertyDescriptor(o,l)),e===1?i={get:s.get,set:s.set}:e===2?i=s.value:e===3?i=s.get:e===4&&(i=s.set);var h,x,I;if(typeof f=="function")h=t(f,l,s,T,e,y,g,b,i),h!==void 0&&(u(e,h),e===0?m=h:e===1?(m=h.init,x=h.get||i.get,I=h.set||i.set,i={get:x,set:I}):i=h);else for(var _=f.length-1;_>=0;_--){var P=f[_];if(h=t(P,l,s,T,e,y,g,b,i),h!==void 0){u(e,h);var N;e===0?N=h:e===1?(N=h.init,x=h.get||i.get,I=h.set||i.set,i={get:x,set:I}):i=h,N!==void 0&&(m===void 0?m=N:typeof m=="function"?m=[m,N]:m.push(N))}}if(e===0||e===1){if(m===void 0)m=function(C,E){return E};else if(typeof m!="function"){var M=m;m=function(C,E){for(var L=E,R=0;R<M.length;R++)L=M[R].call(C,L);return L}}else{var B=m;m=function(C,E){return B.call(C,E)}}a.push(m)}e!==0&&(e===1?(s.get=i.get,s.set=i.set):e===2?s.value=i:e===3?s.get=i:e===4&&(s.set=i),g?e===1?(a.push(function(C,E){return i.get.call(C,E)}),a.push(function(C,E){return i.set.call(C,E)})):e===2?a.push(i):a.push(function(C,E){return i.call(C,E)}):Object.defineProperty(o,l,s))}function v(a,o,c){for(var l=[],e,y,g=new Map,T=new Map,b=0;b<o.length;b++){var f=o[b];if(Array.isArray(f)){var s=f[1],m=f[2],i=f.length>3,h=s>=5,x,I;if(h?(x=a,s=s-5,y=y||[],I=y):(x=a.prototype,e=e||[],I=e),s!==0&&!i){var _=h?T:g,P=_.get(m)||0;if(P===!0||P===3&&s!==4||P===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+m);!P&&s>2?_.set(m,s):_.set(m,!0)}d(l,x,f,m,s,h,i,I,c)}}return w(l,e),w(l,y),l}function w(a,o){o&&a.push(function(c){for(var l=0;l<o.length;l++)o[l].call(c);return c})}function S(a,o,c){if(o.length>0){for(var l=[],e=a,y=a.name,g=o.length-1;g>=0;g--){var T={v:!1};try{var b=o[g](e,{kind:"class",name:y,addInitializer:p(l,T),metadata:c})}finally{T.v=!0}b!==void 0&&(u(10,b),e=b)}return[D(e,c),function(){for(var f=0;f<l.length;f++)l[f].call(e)}]}}function D(a,o){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,c,l,e){if(e!==void 0)var y=e[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(y===void 0?null:y),T=v(o,c,g);return l.length||D(o,g),{e:T,get c(){return S(o,l,g)}}}}function Cs(p,t,r,n){return(Cs=Ja())(p,t,r,n)}var Ss,ps,Is,Ds,_s,Ps,Ns,As,Ls,Rs,fs,ds,vs,gs,ys,bs,ws,xs,Ts,Ve;Ss=W({selector:"potatno-code-editor",template:Rr,style:Lr}),Is=V.state({complexValue:!0}),Ds=V.state(),_s=V.state(),Ps=V.state(),Ns=lt("svgLayer"),As=lt("canvasWrapper"),Ls=lt("panelLeft"),Rs=lt("panelRight");var Es=class{static{({e:[fs,ds,vs,gs,ys,bs,ws,xs,Ts],c:[Ve,ps]}=Cs(this,[[Is,1,"mCachedData"],[Ds,1,"mShowSelectionBox"],[_s,1,"mTransformVersion"],[Ps,1,"mEntryPointPreviewElement"],[Ns,1,"svgLayer"],[As,1,"canvasWrapper"],[Ls,1,"panelLeft"],[Rs,1,"panelRight"],[$,4,"project"],[$,4,"file"],[$,2,"loadCode"],[$,2,"generateCode"],[$,2,"triggerPreviewUpdate"]],[Ss]))}constructor(){this.mInternals={history:new De,clipboard:new Ie,interaction:new Ce(20),renderer:new Se,hoveredPort:null,interactionState:{mode:"idle"},previewElements:new Map,entryPointPreviewElement:null,previewDirty:!0,cachedCodeResult:null},this.mCachedData=this.createEmptyCachedData(),this.mSelectionBoxScreen={x1:0,y1:0,x2:0,y2:0},this.mKeyboardHandler=null,this.mResizeState=null,this.mResizeMoveHandler=null,this.mResizeUpHandler=null}mProject;mFile;mActiveFunctionId=(Ts(this),"");mSelectedNodes=new Set;mInternals;mSelectionBoxScreen;mHistoryDebounceTimer=0;mPreviewDebounceTimer=0;mConnectionVersion=0;mKeyboardHandler;mResizeState;mResizeMoveHandler;mResizeUpHandler;mConnectionRegistry=new Map;#t=fs(this);get mCachedData(){return this.#t}set mCachedData(t){this.#t=t}#e=ds(this,!1);get mShowSelectionBox(){return this.#e}set mShowSelectionBox(t){this.#e=t}#r=vs(this,0);get mTransformVersion(){return this.#r}set mTransformVersion(t){this.#r=t}#o=gs(this,null);get mEntryPointPreviewElement(){return this.#o}set mEntryPointPreviewElement(t){this.#o=t}#n=ys(this);get svgLayer(){return this.#n}set svgLayer(t){this.#n=t}#i=bs(this);get canvasWrapper(){return this.#i}set canvasWrapper(t){this.#i=t}#s=ws(this);get panelLeft(){return this.#s}set panelLeft(t){this.#s=t}#a=xs(this);get panelRight(){return this.#a}set panelRight(t){this.#a=t}get activeFunction(){if(!this.mFile)return null;for(let t of this.mFile.functions)if(t.id===this.mActiveFunctionId)return t;return null}get activeFunctionId(){return this.mActiveFunctionId}get interaction(){return this.mInternals.interaction}get showSelectionBox(){return this.mShowSelectionBox}get hasPreview(){return this.mCachedData.hasPreview}get entryPreviewElement(){return this.mEntryPointPreviewElement}get editorErrors(){return this.mCachedData.errors}get gridBackgroundStyle(){return this.mTransformVersion,this.mInternals.interaction.getGridBackgroundCss()}get gridTransformStyle(){return this.mTransformVersion,"transform: "+this.mInternals.interaction.getTransformCss()}get selectionBoxStyle(){let t=Math.min(this.mSelectionBoxScreen.x1,this.mSelectionBoxScreen.x2),r=Math.min(this.mSelectionBoxScreen.y1,this.mSelectionBoxScreen.y2),n=Math.abs(this.mSelectionBoxScreen.x2-this.mSelectionBoxScreen.x1),u=Math.abs(this.mSelectionBoxScreen.y2-this.mSelectionBoxScreen.y1);return`left: ${t}px; top: ${r}px; width: ${n}px; height: ${u}px`}get visibleNodes(){return this.mCachedData.visibleNodes}get nodeDefinitionList(){return this.mCachedData.nodeDefinitionList}get functionList(){return this.mCachedData.functionList}get userFunctionDefinitions(){let t=this.mProject;return t?[...t.userFunctions.values()].map(r=>({id:r.id})):[]}get activeFunctionName(){return this.mCachedData.activeFunctionName}get activeFunctionInputs(){return this.mCachedData.activeFunctionInputs}get activeFunctionOutputs(){return this.mCachedData.activeFunctionOutputs}get activeFunctionImports(){return this.mCachedData.activeFunctionImports}get activeFunctionIsSystem(){return this.mCachedData.activeFunctionIsSystem}get activeFunctionEditableByUser(){return this.mCachedData.activeFunctionEditableByUser}get availableImportsList(){return this.mCachedData.availableImports}get availableTypes(){return this.mCachedData.availableTypes}getPreviewElementForNode(t){return this.mInternals.previewElements.get(t)??null}set project(t){this.mProject=t,this.rebuildCachedData()}set file(t){if(t){this.mFile=t;let r=this.mProject;r&&t.functions.size===0&&this.initializeMainFunctions(t,r),this.mActiveFunctionId=[...t.functions][0]?.id??""}else this.mFile=void 0,this.mActiveFunctionId="";this.mSelectedNodes.clear(),this.mInternals.history.clear(),this.mInternals.previewElements.clear(),this.rebuildCachedData();try{this.renderConnections()}catch(r){console.warn("[Editor] renderConnections skipped (component not yet rendered):",r)}this.schedulePreviewUpdate()}loadCode(t){let r=this.mProject,u=new ae(r).deserialize(t);this.mFile=u,this.mActiveFunctionId=[...u.functions][0]?.id??"",this.mInternals.history.clear(),this.mSelectedNodes.clear(),this.mInternals.previewElements.clear(),this.rebuildCachedData();try{this.renderConnections()}catch(d){console.warn("[Editor] renderConnections skipped (component not yet rendered):",d)}this.schedulePreviewUpdate()}generateCode(){return this.mFile?new ce().serialize(this.mFile):null}triggerPreviewUpdate(){this.updateNodePreviewsFromCache()}onConnect(){this.mKeyboardHandler=t=>this.onKeyDown(t),document.addEventListener("keydown",this.mKeyboardHandler)}onDeconstruct(){this.mKeyboardHandler&&document.removeEventListener("keydown",this.mKeyboardHandler)}onNodeDragFromLibrary(t){let r=t.value,n=this.mFile,u=this.mProject,d=this.activeFunction;if(!n||!u||!d)return;let v=u.nodeDefinitions.get(r)??n.functionNodeDefinitions.get(r);if(!v)return;let w=this.canvasWrapper,S=w?.clientWidth??800,D=w?.clientHeight??600,a=this.mInternals.interaction.screenToWorld(S/2,D/2),o=this.mInternals.interaction.snapToGrid(a.x,a.y),c=this.mInternals.interaction.gridSize;d.newNode(v,{x:Math.round(o.x/c),y:Math.round(o.y/c),width:10,height:4}),this.scheduleHistorySnapshot(),this.rebuildCachedData(),this.renderConnections(),this.schedulePreviewUpdate()}onFunctionSelect(t){this.mActiveFunctionId=t.value,this.mSelectedNodes.clear(),this.rebuildCachedData(),this.renderConnections()}onFunctionAdd(t){let r=t.value,n=this.mFile,u=this.mProject;if(!n||!u)return;let d=u.userFunctions.get(r);if(!d)return;let v=n.functions.size,w=new Ot(u,d,crypto.randomUUID(),`Function ${v}`,!1);d.nodes.static.forEach((S,D)=>{w.newNode(S,{x:2+D*12,y:2,width:10,height:4},!0),u.nodeDefinitions.has(S.id)||u.addNodeDefinition(S)});for(let S of d.nodes.dynamic)u.nodeDefinitions.has(S.id)||u.addNodeDefinition(S);if(d.statics.imports)for(let S of u.imports)w.addImport(S.name);n.addFunction(w),this.mActiveFunctionId=w.id,this.mSelectedNodes.clear(),this.scheduleHistorySnapshot(),this.rebuildCachedData(),this.renderConnections()}onFunctionDelete(t){let r=t.value,n=this.mFile;if(n){for(let u of n.functions)if(u.id===r){n.removeFunction(u);break}this.mActiveFunctionId===r&&(this.mActiveFunctionId=[...n.functions][0]?.id??""),this.mSelectedNodes.clear(),this.scheduleHistorySnapshot(),this.rebuildCachedData(),this.renderConnections(),this.schedulePreviewUpdate()}}onPropertiesChange(t){let r=this.activeFunction;if(!r)return;let n=t.value;if(n.name!==void 0&&(r.label=n.name),n.inputs!==void 0){let u=new Set(r.inputs.map(v=>v.name)),d=new Set(n.inputs.map(v=>v.name));for(let v of[...r.inputs])d.has(v.name)||r.removeInput(v);for(let v of n.inputs)u.has(v.name)||r.addInput({name:v.name,dataType:v.type})}if(n.outputs!==void 0){let u=new Set(r.outputs.map(v=>v.name)),d=new Set(n.outputs.map(v=>v.name));for(let v of[...r.outputs])d.has(v.name)||r.removeOutput(v);for(let v of n.outputs)u.has(v.name)||r.addOutput({name:v.name,dataType:v.type})}if(n.imports!==void 0){let u=new Set(r.imports),d=new Set(n.imports);for(let v of[...r.imports])d.has(v)||r.removeImport(v);for(let v of n.imports)u.has(v)||r.addImport(v)}this.scheduleHistorySnapshot(),this.rebuildCachedData(),this.renderConnections(),this.schedulePreviewUpdate()}onCanvasPointerDown(t){let r=this.mInternals;if(t.button===1){t.preventDefault(),r.interactionState={mode:"panning",startX:t.clientX,startY:t.clientY},t.currentTarget.setPointerCapture(t.pointerId);return}if(t.button===0){t.ctrlKey||(this.mSelectedNodes.clear(),this.rebuildCachedData());let n=this.canvasWrapper.getBoundingClientRect(),u=t.clientX-n.left,d=t.clientY-n.top;r.interactionState={mode:"selecting",startX:u,startY:d},this.mSelectionBoxScreen={x1:u,y1:d,x2:u,y2:d},this.mShowSelectionBox=!1,t.currentTarget.setPointerCapture(t.pointerId)}}onCanvasPointerMove(t){let r=this.mInternals,n=r.interactionState;if(n.mode==="panning"){let u=t.clientX-n.startX,d=t.clientY-n.startY;r.interaction.pan(u,d),n.startX=t.clientX,n.startY=t.clientY,this.mTransformVersion++,this.renderConnections();return}if(n.mode==="dragging-node"){if(!this.activeFunction)return;let d=r.interaction.zoom,v=r.interaction.gridSize,w=(t.clientX-n.startX)/d,S=(t.clientY-n.startY)/d;for(let[D,a]of n.origins){let o=r.interaction.snapToGrid(a.originX+w,a.originY+S);D.moveTo(Math.round(o.x/v),Math.round(o.y/v))}this.rebuildVisibleNodePositions(),this.renderConnections();return}if(n.mode==="dragging-wire"){let u=this.canvasWrapper.getBoundingClientRect(),d=(t.clientX-u.left-r.interaction.panX)/r.interaction.zoom,v=(t.clientY-u.top-r.interaction.panY)/r.interaction.zoom;r.renderer.renderTempConnection(this.svgLayer,{x:n.startX,y:n.startY},{x:d,y:v},"#bac2de");return}if(n.mode==="selecting"){let u=this.canvasWrapper.getBoundingClientRect();this.mSelectionBoxScreen.x2=t.clientX-u.left,this.mSelectionBoxScreen.y2=t.clientY-u.top;let d=Math.abs(this.mSelectionBoxScreen.x2-this.mSelectionBoxScreen.x1),v=Math.abs(this.mSelectionBoxScreen.y2-this.mSelectionBoxScreen.y1);(d>5||v>5)&&(this.mShowSelectionBox=!0);return}if(n.mode==="resizing-comment"){let u=r.interaction.gridSize,d=(t.clientX-n.startX)/r.interaction.zoom,v=(t.clientY-n.startY)/r.interaction.zoom,w=n.originalW+Math.round(d/u),S=n.originalH+Math.round(v/u);n.node.resizeTo(w,S),this.rebuildVisibleNodePositions();return}}onCanvasPointerUp(t){let r=this.mInternals;if(r.interactionState.mode==="dragging-node"&&(this.scheduleHistorySnapshot(),this.rebuildCachedData(),this.renderConnections(),this.schedulePreviewUpdate()),r.interactionState.mode==="dragging-wire"){r.renderer.clearTempConnection(this.svgLayer);let n=r.interactionState.sourcePort,u=r.hoveredPort?.port??null;if(n&&u&&n!==u&&n.direction!==u.direction&&n.portType===u.portType)try{n.connect(u),this.mConnectionVersion++,this.scheduleHistorySnapshot(),this.rebuildCachedData(),this.renderConnections(),this.schedulePreviewUpdate()}catch(d){console.error("[Editor] Connection failed:",d)}}r.interactionState.mode==="selecting"&&(this.mShowSelectionBox=!1,this.selectNodesInBox()),r.interactionState.mode==="resizing-comment"&&(this.scheduleHistorySnapshot(),this.rebuildCachedData()),r.interactionState={mode:"idle"},t.currentTarget.releasePointerCapture(t.pointerId)}onCanvasWheel(t){t.preventDefault();let r=this.canvasWrapper.getBoundingClientRect();this.mInternals.interaction.zoomAt(t.clientX-r.left,t.clientY-r.top,t.deltaY>0?-.1:.1),this.mTransformVersion++,this.renderConnections()}onContextMenu(t){t.preventDefault();let r=t.target;if(r.hasAttribute?.("data-hit-area")){let n=r.getAttribute("data-connection-id");if(n){let u=this.mConnectionRegistry.get(n);u&&(u.sourcePort.disconnect(u.targetPort),this.mConnectionVersion++,this.scheduleHistorySnapshot(),this.rebuildCachedData(),this.renderConnections(),this.schedulePreviewUpdate())}}}onNodePointerDown(t,r){for(let d of t.composedPath())if(d.tagName?.toLowerCase()==="potatno-port")return;if(t.stopPropagation(),t.button!==0)return;t.ctrlKey?this.mSelectedNodes.has(r)?this.mSelectedNodes.delete(r):this.mSelectedNodes.add(r):this.mSelectedNodes.has(r)||(this.mSelectedNodes.clear(),this.mSelectedNodes.add(r)),this.rebuildCachedData();let n=this.mInternals.interaction.gridSize,u=new Map;for(let d of this.mSelectedNodes)u.set(d,{originX:d.transformation.x*n,originY:d.transformation.y*n});if(r.definition.category===j.Comment){let d=this.activeFunction;if(d){let v=r.transformation.x*n,w=r.transformation.y*n,S=v+r.transformation.width*n,D=w+r.transformation.height*n;for(let a of d.nodes){if(a===r||this.mSelectedNodes.has(a)||a.definition.category===j.Comment)continue;let o=a.transformation.x*n,c=a.transformation.y*n;o>=v&&o<=S&&c>=w&&c<=D&&u.set(a,{originX:o,originY:c})}}}this.mInternals.interactionState={mode:"dragging-node",draggedNode:r,startX:t.clientX,startY:t.clientY,origins:u},this.canvasWrapper.setPointerCapture(t.pointerId)}onPortDragStart(t){let r=t.value,n=this.canvasWrapper.getBoundingClientRect(),u=r.element.getBoundingClientRect(),d=(u.left+u.width/2-n.left-this.mInternals.interaction.panX)/this.mInternals.interaction.zoom,v=(u.top+u.height/2-n.top-this.mInternals.interaction.panY)/this.mInternals.interaction.zoom;this.mInternals.interactionState={mode:"dragging-wire",sourcePort:r.port,startX:d,startY:v}}onPortHover(t){this.mInternals.hoveredPort={node:t.value.node,port:t.value.port}}onPortLeave(){this.mInternals.hoveredPort=null}onNodeResizeStart(t){let r=t.value,n=this.mInternals.interaction.gridSize;this.mInternals.interactionState={mode:"resizing-comment",node:r.node,startX:r.startX,startY:r.startY,originalW:r.node.transformation.width,originalH:r.node.transformation.height},this.canvasWrapper.setPointerCapture(n)}onCommentChange(t){this.scheduleHistorySnapshot()}onDirectValueChange(t){this.scheduleHistorySnapshot(),this.schedulePreviewUpdate()}onOpenFunction(t){let r=t.value.node.definition.id;if(this.mFile){for(let n of this.mFile.functions)if(n.id===r){this.mActiveFunctionId=r,this.mSelectedNodes.clear(),this.rebuildCachedData(),this.renderConnections();return}}}onResizeLeftStart(t){t.preventDefault(),this.startPanelResize("left",t)}onResizeRightStart(t){t.preventDefault(),this.startPanelResize("right",t)}onKeyDown(t){if(t.key==="Delete"){this.deleteSelectedNodes();return}if(t.ctrlKey&&t.key==="z"){t.preventDefault();let r=this.mInternals.history.undo();r&&this.restoreSnapshot(r);return}if(t.ctrlKey&&(t.key==="y"||t.shiftKey&&t.key==="z")){t.preventDefault();let r=this.mInternals.history.redo();r&&this.restoreSnapshot(r);return}if(t.ctrlKey&&t.key==="c"){this.mInternals.clipboard.copy(this.mSelectedNodes);return}if(t.ctrlKey&&t.key==="v"){this.pasteFromClipboard();return}}initializeMainFunctions(t,r){let n=r.entryPoint;if(!n)return;let u=new Ot(r,n,crypto.randomUUID(),"Main",!0);n.nodes.static.forEach((d,v)=>{u.newNode(d,{x:2+v*12,y:2,width:10,height:4},!0),r.nodeDefinitions.has(d.id)||r.addNodeDefinition(d)});for(let d of n.nodes.dynamic)r.nodeDefinitions.has(d.id)||r.addNodeDefinition(d);if(n.statics.imports)for(let d of r.imports)u.addImport(d.name);t.addFunction(u)}deleteSelectedNodes(){let t=this.activeFunction;if(!t)return;let r=!1;for(let n of[...this.mSelectedNodes])n.isSystem||(t.removeNode(n),this.mSelectedNodes.delete(n),r=!0);r&&(this.scheduleHistorySnapshot(),this.rebuildCachedData(),this.renderConnections(),this.schedulePreviewUpdate())}pasteFromClipboard(){let t=this.activeFunction,r=this.mFile;if(!t||!r)return;let n=this.mInternals.clipboard.paste(t,r,2,2);if(n.length>0){this.mSelectedNodes.clear();for(let u of n)this.mSelectedNodes.add(u);this.scheduleHistorySnapshot(),this.rebuildCachedData(),this.renderConnections(),this.schedulePreviewUpdate()}}selectNodesInBox(){let t=this.activeFunction;if(!t)return;let r=this.mInternals,n=r.interaction.screenToWorld(Math.min(this.mSelectionBoxScreen.x1,this.mSelectionBoxScreen.x2),Math.min(this.mSelectionBoxScreen.y1,this.mSelectionBoxScreen.y2)),u=r.interaction.screenToWorld(Math.max(this.mSelectionBoxScreen.x1,this.mSelectionBoxScreen.x2),Math.max(this.mSelectionBoxScreen.y1,this.mSelectionBoxScreen.y2)),d=r.interaction.gridSize;for(let v of t.nodes){let w=v.transformation.x*d,S=v.transformation.y*d,D=w+v.transformation.width*d,a=S+v.transformation.height*d;w<u.x&&D>n.x&&S<u.y&&a>n.y&&this.mSelectedNodes.add(v)}this.rebuildCachedData()}renderConnections(){if(!this.svgLayer)return;let t=this.activeFunction;if(!t){this.mInternals.renderer.clearAll(this.svgLayer),this.mConnectionRegistry.clear();return}this.mConnectionRegistry.clear();let r=[],n=0;for(let u of t.nodes)for(let d of u.outputs.values())for(let v of d.connectedPorts){let w=`c${n++}`;this.mConnectionRegistry.set(w,{sourcePort:d,targetPort:v});let S=this.getPortPosition(d),D=this.getPortPosition(v);r.push({id:w,sourceX:S.x,sourceY:S.y,targetX:D.x,targetY:D.y,color:"var(--pn-text-secondary)",valid:!0})}this.mInternals.renderer.renderConnections(this.svgLayer,r)}getPortPosition(t){let r=t.node,n=this.mInternals.interaction.gridSize,u=r.transformation.x*n,d=r.transformation.y*n,v=r.transformation.width*n,w=28,S=24,D=4;if(t.portType==="flow")return{x:t.direction==="output"?u+v:u,y:d+w/2};let a=t.direction==="output"?r.outputs:r.inputs,o=0,c=0;for(let e of a.values())if(e.portType==="value"){if(e===t){o=c;break}c++}return{x:t.direction==="output"?u+v:u,y:d+w+D+(o+.5)*S}}scheduleHistorySnapshot(){clearTimeout(this.mHistoryDebounceTimer),this.mHistoryDebounceTimer=setTimeout(()=>{this.pushHistorySnapshot()},500)}pushHistorySnapshot(){if(!this.mFile)return;let r=new ce().serialize(this.mFile);this.mInternals.history.push(r)}restoreSnapshot(t){if(!this.mProject)return;let r=new ae(this.mProject);this.mFile=r.deserialize(t),[...this.mFile.functions].find(u=>u.id===this.mActiveFunctionId)||(this.mActiveFunctionId=[...this.mFile.functions][0]?.id??""),this.mSelectedNodes.clear(),this.mInternals.previewElements.clear(),this.rebuildCachedData(),this.renderConnections(),this.schedulePreviewUpdate()}schedulePreviewUpdate(){this.mInternals.previewDirty=!0,clearTimeout(this.mPreviewDebounceTimer),this.mPreviewDebounceTimer=setTimeout(()=>this.evaluatePreview(),300)}evaluatePreview(){let t=this.mProject,r=this.mFile,n=this.mInternals;if(console.log("[Preview] evaluatePreview called",{hasProject:!!t,hasFile:!!r,dirty:n.previewDirty}),!t||!r||!n.previewDirty){console.log("[Preview] early return - missing project/file or not dirty");return}n.previewDirty=!1;let u;for(let S of r.functions)if(S.isSystem){u=S;break}if(!u){console.log("[Preview] no system (entry) function found");return}let d=new Set;for(let S of u.nodes)t.nodeDefinitions.get(S.definition.id)?.preview&&d.add(S);for(let S of d)if(!n.previewElements.has(S)){let D=t.nodeDefinitions.get(S.definition.id);if(D?.preview){let a=D.preview.generatePreview();a instanceof HTMLElement&&n.previewElements.set(S,a)}}let v=t.entryPoint.preview;console.log("[Preview] entryPoint.preview:",v),v&&(n.entryPointPreviewElement||(n.entryPointPreviewElement=v.generatePreview(),console.log("[Preview] generated entry preview element:",n.entryPointPreviewElement),this.mEntryPointPreviewElement=n.entryPointPreviewElement,console.log("[Preview] mEntryPointPreviewElement set")));let w;try{w=new Ee(t).generateFunctionCodeWithIntermediates(u,d)}catch(S){console.error("[Preview] Code generation failed:",S);return}n.cachedCodeResult=w,this.updateNodePreviewsFromCache()}updateNodePreviewsFromCache(){let t=this.mProject,r=this.mInternals,n=r.cachedCodeResult;if(!t||!n)return;let u=t.entryPoint.preview;if(u&&r.entryPointPreviewElement)try{u.updatePreview(r.entryPointPreviewElement,n.codeFunction,{},n.fullCode)}catch(d){console.error("[Preview] updatePreview (entry point) failed:",d)}for(let[d,v]of n.nodeIntermediates){let w=r.previewElements.get(d);if(!w)continue;let S=t.nodeDefinitions.get(d.definition.id);if(S?.preview)try{S.preview.updatePreview(w,v.context,v.codeFunction,{},v.intermediateCode)}catch(D){console.error("[Preview] updatePreview (node) failed:",D)}}}startPanelResize(t,r){let n=t==="left"?this.panelLeft:this.panelRight;this.mResizeState={panel:t,startX:r.clientX,startWidth:n.offsetWidth},this.mResizeMoveHandler=u=>{if(!this.mResizeState)return;let d=t==="left"?u.clientX-this.mResizeState.startX:this.mResizeState.startX-u.clientX;n.style.width=`${Math.max(200,Math.min(500,this.mResizeState.startWidth+d))}px`},this.mResizeUpHandler=()=>{document.removeEventListener("pointermove",this.mResizeMoveHandler),document.removeEventListener("pointerup",this.mResizeUpHandler),this.mResizeState=null},document.addEventListener("pointermove",this.mResizeMoveHandler),document.addEventListener("pointerup",this.mResizeUpHandler)}rebuildCachedData(){let t=this.mProject,r=this.mFile,n=this.activeFunction,u=this.createEmptyCachedData();if(u.activeFunctionId=this.mActiveFunctionId,u.hasPreview=!!t?.entryPoint.preview,r)for(let d of r.validate())u.errors.push({message:d.message,location:`Node "${d.port.node.name}"`});if(t)for(let d of t.nodeDefinitions.values())u.nodeDefinitionList.push({name:d.id,category:d.category});if(r)for(let d of r.functionNodeDefinitions.values())u.nodeDefinitionList.push({name:d.id,category:d.category});if(t&&n){let d=new Set(n.imports);for(let v of t.imports)if(d.has(v.name))for(let w of v.nodes)u.nodeDefinitionList.push({name:w.id,category:w.category})}if(r)for(let d of r.functions)u.functionList.push({id:d.id,name:d.label,label:d.label,system:d.isSystem});if(u.availableImports=t?.imports.map(d=>d.name)??[],t){let d=new Set;for(let[v]of t.types.types)d.add(v);u.availableTypes=[...d].sort()}if(n){u.activeFunctionName=n.label,u.activeFunctionIsSystem=n.isSystem,u.activeFunctionEditableByUser=!n.isSystem,u.activeFunctionInputs=n.inputs.map(v=>({name:v.name,type:v.dataType})),u.activeFunctionOutputs=n.outputs.map(v=>({name:v.name,type:v.dataType})),u.activeFunctionImports=[...n.imports];let d=this.mInternals.interaction.gridSize;for(let v of n.nodes){if(t){let w=t.nodeDefinitions.get(v.definition.id);if(w?.preview&&!this.mInternals.previewElements.has(v)){let S=w.preview.generatePreview();S instanceof HTMLElement&&this.mInternals.previewElements.set(v,S)}}u.visibleNodes.push({node:v,selected:this.mSelectedNodes.has(v),pixelX:v.transformation.x*d,pixelY:v.transformation.y*d,pixelW:v.transformation.width*d,connectionVersion:this.mConnectionVersion})}}this.mCachedData=u}rebuildVisibleNodePositions(){let t=this.mInternals.interaction.gridSize;for(let r of this.mCachedData.visibleNodes)r.pixelX=r.node.transformation.x*t,r.pixelY=r.node.transformation.y*t,r.pixelW=r.node.transformation.width*t;this.mCachedData=this.mCachedData}createEmptyCachedData(){return{activeFunctionId:"",activeFunctionName:"",activeFunctionIsSystem:!1,activeFunctionEditableByUser:!1,errors:[],hasPreview:!1,nodeDefinitionList:[],functionList:[],availableImports:[],availableTypes:[],activeFunctionInputs:[],activeFunctionOutputs:[],activeFunctionImports:[],visibleNodes:[]}}static{ps()}};var Ms=`:host {\r
    display: block;\r
    width: 100%;\r
    height: 100%;\r
}\r
\r
potatno-code-editor {\r
    display: block;\r
    width: 100%;\r
    height: 100%;\r
}`;var Os=`:host {\r
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
`;var _e=class extends Wt{mCodeEditor;mProject;get file(){return this.mCodeEditor.file}set file(t){this.mCodeEditor.file=t}get project(){return this.mProject}constructor(t){super(),this.mProject=t,this.addStyle(Os),this.addStyle(Ms),this.mCodeEditor=this.addContent(Ve),this.mCodeEditor.project=t}update(){this.mCodeEditor.triggerPreviewUpdate()}};var ue=class p{static create(t){return new p(t)}mId;mPreview;mStatics;mNodes;mGeneratorConfig;get id(){return this.mId}get codeGenerator(){return this.mGeneratorConfig}get nodes(){return this.mNodes}get preview(){return this.mPreview}get statics(){return this.mStatics}constructor(t){this.mId=t.id,this.mNodes={static:t.nodes?.static??[],dynamic:t.nodes?.dynamic??[]},this.mPreview=t.preview??null,this.mStatics={imports:t.statics.imports??!1,inputs:t.statics.inputs??!1,outputs:t.statics.outputs??!1},this.mGeneratorConfig=t.codeGenerator}};var G=class p{static create(t){return new p(t)}mId;mCategory;mInputs;mLabel;mOutputs;mCodeGenerator;mPreview;get id(){return this.mId}get category(){return this.mCategory}get inputs(){return this.mInputs}get label(){return this.mLabel}get outputs(){return this.mOutputs}get codeGenerator(){return this.mCodeGenerator}get preview(){return this.mPreview}constructor(t){this.mId=t.id,this.mLabel=t.label??t.id,this.mCategory=t.category,this.mCodeGenerator=t.codeGenerator,this.mPreview=t.preview??null,this.mInputs=Object.entries(t.inputs??{}).map(([r,n])=>new pt(r,n.portType,"dataType"in n?n.dataType:void 0)),this.mOutputs=Object.entries(t.outputs??{}).map(([r,n])=>new pt(r,n.portType,"dataType"in n?n.dataType:void 0))}};var Pe=class{mEntryPoint;mImports;mNodeDefinitions;mTypes;mUserFunctions;get entryPoint(){return this.mEntryPoint}get imports(){return this.mImports}get nodeDefinitions(){return this.mNodeDefinitions}get types(){return this.mTypes}get userFunctions(){return this.mUserFunctions}constructor(t){this.mEntryPoint=t.entryPoint,this.mTypes=t.types,this.mNodeDefinitions=new Map,this.mImports=new Array,this.mUserFunctions=new Map}addImport(t){this.mImports.push(t)}addNodeDefinition(t){this.mNodeDefinitions.set(t.id,t)}addUserFunction(t){this.mUserFunctions.set(t.id,t)}};var Ne=class{mTypes;get types(){return this.mTypes}constructor(t){this.mTypes=new Map;for(let[r,n]of Object.entries(t))this.mTypes.set(r,{name:r,...n})}getType(t){if(!this.mTypes.has(t))throw new Error(`Type "${t}" is not defined in the project types definition.`);return this.mTypes.get(t)}};(()=>{let p=new WebSocket("ws://127.0.0.1:8088");p.addEventListener("open",()=>{console.log("Refresh connection established")}),p.addEventListener("message",t=>{console.log("Bundle finished. Start refresh"),t.data==="REFRESH"&&window.location.reload()})})();var ka=new Ne({number:{defaultValue:["0"],convert:p=>{let t=p[0],r=parseFloat(t);if(isNaN(r))throw new Error(`Invalid number: "${t}"`);return r.toString()},inputs:[{name:"value",type:"number"}]},string:{defaultValue:[""],convert:p=>p[0],inputs:[{name:"value",type:"string"}]},boolean:{defaultValue:["false"],convert:p=>{let t=p[0].toLowerCase();if(t==="true")return"true";if(t==="false")return"false";throw new Error(`Invalid boolean: "${p[0]}"`)},inputs:[{name:"value",type:"boolean"}]}}),H=new Pe({types:ka,entryPoint:ue.create({id:"pixelShader",statics:{imports:!0,inputs:!0,outputs:!1},nodes:{static:[G.create({id:"OnPixel",category:"event",inputs:{},outputs:{x:{portType:"value",dataType:"number"},y:{portType:"value",dataType:"number"}},codeGenerator:p=>`const ${p.outputs.x.valueId} = __pixel_x;
const ${p.outputs.y.valueId} = __pixel_y;`}),G.create({id:"PixelResult",category:j.Output,inputs:{red:{portType:"value",dataType:"number"},green:{portType:"value",dataType:"number"},blue:{portType:"value",dataType:"number"}},outputs:{},codeGenerator:p=>`__pixel_r = ${p.inputs.red.valueId};
__pixel_g = ${p.inputs.green.valueId};
__pixel_b = ${p.inputs.blue.valueId};`})]},codeGenerator:{codeGenerator:p=>{let t=p.inputs.map(n=>n.valueId).join(", "),r=t?`__pixel_x, __pixel_y, ${t}`:"__pixel_x, __pixel_y";return`function ${p.name}(${r}) {
let __pixel_r = 0, __pixel_g = 0, __pixel_b = 0;
${p.bodyCode}
return [__pixel_r, __pixel_g, __pixel_b];
}`},valueGenerator:p=>`${p.inputs}`},preview:{generatePreview:()=>{let p=document.createElement("canvas");return p.width=100,p.height=100,p.style.cssText="width: 100px; height: 100px; image-rendering: pixelated; background: #000;",p},updatePreview:(p,t,r,n)=>{let u=p.getContext("2d"),d=u.createImageData(p.width,p.height),v=Function(n+`
return `+t.name+";")();for(let w=0;w<d.height;w++)for(let S=0;S<d.width;S++){let D=v(S/d.width,w/d.height),a=(w*d.width+S)*4;d.data[a]=Math.max(0,Math.min(255,Math.round(D[0]*255))),d.data[a+1]=Math.max(0,Math.min(255,Math.round(D[1]*255))),d.data[a+2]=Math.max(0,Math.min(255,Math.round(D[2]*255))),d.data[a+3]=255}u.putImageData(d,0,0)}}})});H.addImport({name:"Math",nodes:[G.create({id:"Math.PI",category:"value",inputs:{},outputs:{value:{portType:"value",dataType:"number"}},codeGenerator:p=>`const ${p.outputs.value.valueId} = Math.PI;`}),G.create({id:"Math.E",category:"value",inputs:{},outputs:{value:{portType:"value",dataType:"number"}},codeGenerator:p=>`const ${p.outputs.value.valueId} = Math.E;`}),G.create({id:"Math.abs",category:j.Function,inputs:{value:{portType:"value",dataType:"number"}},outputs:{result:{portType:"value",dataType:"number"}},codeGenerator:p=>`const ${p.outputs.result.valueId} = Math.abs(${p.inputs.value.valueId});`}),G.create({id:"Math.floor",category:j.Function,inputs:{value:{portType:"value",dataType:"number"}},outputs:{result:{portType:"value",dataType:"number"}},codeGenerator:p=>`const ${p.outputs.result.valueId} = Math.floor(${p.inputs.value.valueId});`}),G.create({id:"Math.random",category:j.Function,inputs:{},outputs:{result:{portType:"value",dataType:"number"}},codeGenerator:p=>`const ${p.outputs.result.valueId} = Math.random();`})]});H.addNodeDefinition(G.create({id:"Add",category:"operator",inputs:{a:{portType:"value",dataType:"number"},b:{portType:"value",dataType:"number"}},outputs:{result:{portType:"value",dataType:"number"}},codeGenerator:p=>`const ${p.outputs.result.valueId} = ${p.inputs.a.valueId} + ${p.inputs.b.valueId};`}));H.addNodeDefinition(G.create({id:"Subtract",category:"operator",inputs:{a:{portType:"value",dataType:"number"},b:{portType:"value",dataType:"number"}},outputs:{result:{portType:"value",dataType:"number"}},codeGenerator:p=>`const ${p.outputs.result.valueId} = ${p.inputs.a.valueId} - ${p.inputs.b.valueId};`}));H.addNodeDefinition(G.create({id:"Multiply",category:"operator",inputs:{a:{portType:"value",dataType:"number"},b:{portType:"value",dataType:"number"}},outputs:{result:{portType:"value",dataType:"number"}},codeGenerator:p=>`const ${p.outputs.result.valueId} = ${p.inputs.a.valueId} * ${p.inputs.b.valueId};/*MULTIPLYHOOK_${p.outputs.result.valueId}*/`,preview:{generatePreview:()=>{let p=document.createElement("canvas");return p.width=50,p.height=50,p.style.cssText="width: 50px; height: 50px; image-rendering: pixelated; border: 1px solid rgba(255,255,255,0.1); border-radius: 2px;",p},updatePreview:(p,t,r,n,u)=>{let d=p.getContext("2d"),v=d.createImageData(p.width,p.height),w=u.replace(`/*MULTIPLYHOOK_${t.outputs.result.valueId}*/`,`return ${t.outputs.result.valueId};`),S=Function(w+`
return `+r.name+";")();for(let D=0;D<v.height;D++)for(let a=0;a<v.width;a++){let o=S(a/v.width,D/v.height),c=(D*v.width+a)*4;v.data[c]=Math.max(0,Math.min(255,Math.round(o*255))),v.data[c+1]=Math.max(0,Math.min(255,Math.round(o*255))),v.data[c+2]=Math.max(0,Math.min(255,Math.round(o*255))),v.data[c+3]=255}d.putImageData(v,0,0)}}}));H.addNodeDefinition(G.create({id:"Divide",category:"operator",inputs:{a:{portType:"value",dataType:"number"},b:{portType:"value",dataType:"number"}},outputs:{result:{portType:"value",dataType:"number"}},codeGenerator:p=>`const ${p.outputs.result.valueId} = ${p.inputs.a.valueId} / ${p.inputs.b.valueId};`}));H.addNodeDefinition(G.create({id:"Modulo",category:"operator",inputs:{a:{portType:"value",dataType:"number"},b:{portType:"value",dataType:"number"}},outputs:{result:{portType:"value",dataType:"number"}},codeGenerator:p=>`const ${p.outputs.result.valueId} = ${p.inputs.a.valueId} % ${p.inputs.b.valueId};`}));H.addNodeDefinition(G.create({id:"Equal",category:"operator",inputs:{a:{portType:"value",dataType:"number"},b:{portType:"value",dataType:"number"}},outputs:{result:{portType:"value",dataType:"boolean"}},codeGenerator:p=>`const ${p.outputs.result.valueId} = ${p.inputs.a.valueId} === ${p.inputs.b.valueId};`}));H.addNodeDefinition(G.create({id:"Not Equal",category:"operator",inputs:{a:{portType:"value",dataType:"number"},b:{portType:"value",dataType:"number"}},outputs:{result:{portType:"value",dataType:"boolean"}},codeGenerator:p=>`const ${p.outputs.result.valueId} = ${p.inputs.a.valueId} !== ${p.inputs.b.valueId};`}));H.addNodeDefinition(G.create({id:"Less Than",category:"operator",inputs:{a:{portType:"value",dataType:"number"},b:{portType:"value",dataType:"number"}},outputs:{result:{portType:"value",dataType:"boolean"}},codeGenerator:p=>`const ${p.outputs.result.valueId} = ${p.inputs.a.valueId} < ${p.inputs.b.valueId};`}));H.addNodeDefinition(G.create({id:"Greater Than",category:"operator",inputs:{a:{portType:"value",dataType:"number"},b:{portType:"value",dataType:"number"}},outputs:{result:{portType:"value",dataType:"boolean"}},codeGenerator:p=>`const ${p.outputs.result.valueId} = ${p.inputs.a.valueId} > ${p.inputs.b.valueId};`}));H.addNodeDefinition(G.create({id:"And",category:"operator",inputs:{a:{portType:"value",dataType:"boolean"},b:{portType:"value",dataType:"boolean"}},outputs:{result:{portType:"value",dataType:"boolean"}},codeGenerator:p=>`const ${p.outputs.result.valueId} = ${p.inputs.a.valueId} && ${p.inputs.b.valueId};`}));H.addNodeDefinition(G.create({id:"Or",category:"operator",inputs:{a:{portType:"value",dataType:"boolean"},b:{portType:"value",dataType:"boolean"}},outputs:{result:{portType:"value",dataType:"boolean"}},codeGenerator:p=>`const ${p.outputs.result.valueId} = ${p.inputs.a.valueId} || ${p.inputs.b.valueId};`}));H.addNodeDefinition(G.create({id:"Not",category:"operator",inputs:{a:{portType:"value",dataType:"boolean"}},outputs:{result:{portType:"value",dataType:"boolean"}},codeGenerator:p=>`const ${p.outputs.result.valueId} = !${p.inputs.a.valueId};`}));H.addNodeDefinition(G.create({id:"Number to String",category:"type-conversion",inputs:{input:{portType:"value",dataType:"number"}},outputs:{output:{portType:"value",dataType:"string"}},codeGenerator:p=>`const ${p.outputs.output.valueId} = String(${p.inputs.input.valueId});`}));H.addNodeDefinition(G.create({id:"String to Number",category:"type-conversion",inputs:{input:{portType:"value",dataType:"string"}},outputs:{output:{portType:"value",dataType:"number"}},codeGenerator:p=>`const ${p.outputs.output.valueId} = Number(${p.inputs.input.valueId});`}));H.addNodeDefinition(G.create({id:"Boolean to String",category:"type-conversion",inputs:{input:{portType:"value",dataType:"boolean"}},outputs:{output:{portType:"value",dataType:"string"}},codeGenerator:p=>`const ${p.outputs.output.valueId} = String(${p.inputs.input.valueId});`}));H.addNodeDefinition(G.create({id:"If",category:"flow",inputs:{exec:{portType:"flow"},condition:{portType:"value",dataType:"boolean"}},outputs:{then:{portType:"flow"},else:{portType:"flow"}},codeGenerator:p=>`if (${p.inputs.condition.valueId}) {
${p.outputs.then.code}
} else {
${p.outputs.else.code}
}`}));H.addNodeDefinition(G.create({id:"While",category:"flow",inputs:{exec:{portType:"flow"},condition:{portType:"value",dataType:"boolean"}},outputs:{body:{portType:"flow"}},codeGenerator:p=>`while (${p.inputs.condition.valueId}) {
${p.outputs.body.code}
}`}));H.addNodeDefinition(G.create({id:"For Loop",category:"flow",inputs:{exec:{portType:"flow"},count:{portType:"value",dataType:"number"}},outputs:{exec:{portType:"flow"},index:{portType:"value",dataType:"number"}},codeGenerator:p=>`for (let ${p.outputs.index.valueId} = 0; ${p.outputs.index.valueId} < ${p.inputs.count.valueId}; ${p.outputs.index.valueId}++) {
${p.outputs.exec.code}
}`}));H.addNodeDefinition(G.create({id:"Console Log",category:j.Function,inputs:{message:{portType:"value",dataType:"string"}},outputs:{},codeGenerator:({inputs:p})=>`console.log(${p.message.valueId});`}));H.addNodeDefinition(G.create({id:"String Concat",category:j.Function,inputs:{a:{portType:"value",dataType:"string"},b:{portType:"value",dataType:"string"}},outputs:{result:{portType:"value",dataType:"string"}},codeGenerator:p=>`const ${p.outputs.result.valueId} = ${p.inputs.a.valueId} + ${p.inputs.b.valueId};`}));H.addUserFunction(ue.create({id:"Helper Function",statics:{imports:!1,inputs:!1,outputs:!1},codeGenerator:{codeGenerator:p=>{let t=p.inputs.map(u=>u.valueId).join(", "),r=p.outputs.map(u=>u.valueId).join(", "),n=p.bodyCode;return r&&(n+=`
return ${p.outputs.length>1?`[${r}]`:r};`),`function ${p.name}(${t}) {
${n}
}`},valueGenerator:p=>{let t=Object.values(p.inputs).map(n=>n.valueId).join(", ");return`const ${Object.values(p.outputs).map(n=>n.valueId)[0]??"_unused"} = ${p.inputs}(${t});`}}}));var $e=new _e(H);$e.appendTo(document.body);$e.file=new Ft(H);function Fs(){$e.update(),requestAnimationFrame(Fs)}Fs();})();
//# sourceMappingURL=page.js.map
