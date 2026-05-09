(()=>{var Le=class m extends Array{static newListWith(...e){let t=new m;return t.push(...e),t}clear(){this.splice(0,this.length)}clone(){return m.newListWith(...this)}distinct(){return m.newListWith(...new Set(this))}equals(e){if(this===e)return!0;if(!e||this.length!==e.length)return!1;for(let t=0;t<this.length;++t)if(this[t]!==e[t])return!1;return!0}remove(e){let t=this.indexOf(e);if(t!==-1)return this.splice(t,1)[0]}replace(e,t){let n=this.indexOf(e);if(n!==-1){let c=this[n];return this[n]=t,c}}toString(){return`[${super.join(", ")}]`}};var A=class extends Error{mTarget;get target(){return this.mTarget}constructor(e,t,n){super(e,n),this.mTarget=t}};var Q=class m extends Map{add(e,t){if(!this.has(e))this.set(e,t);else throw new A("Can't add duplicate key to dictionary.",this)}clone(){return new m(this)}getAllKeysOfValue(e){return[...this.entries()].filter(c=>c[1]===e).map(c=>c[0])}getOrDefault(e,t){let n=this.get(e);return typeof n<"u"?n:t}map(e){let t=new Le;for(let n of this){let c=e(n[0],n[1]);t.push(c)}return t}};var Ce=class m{mSize;mTopItem;get size(){return this.mSize}get top(){if(this.mTopItem)return this.mTopItem.value}constructor(){this.mTopItem=null,this.mSize=0}clone(){let e=new m;return e.mTopItem=this.mTopItem,e.mSize=this.mSize,e}*entries(){let e=this.mTopItem;for(;e!==null;)yield e.value,e=e.previous}flush(){let e=new Array;for(;this.mTopItem;)e.push(this.pop());return e}pop(){if(!this.mTopItem)return;let e=this.mTopItem.value;return this.mTopItem=this.mTopItem.previous,this.mSize--,e}push(e){let t={previous:this.mTopItem,value:e};this.mTopItem=t,this.mSize++}toArray(){return[...this.entries()]}};var Je=class{mCompareFunction;constructor(e){this.mCompareFunction=e}differencesOf(e,t){let n;if(e.length===0||t.length===0){if(n=new Array,e.length===0)for(let S=0;S<t.length;S++)n.push({changeState:ge.Insert,item:t[S]});else for(let S=0;S<e.length;S++)n.push({changeState:ge.Remove,item:e[S]});return n}let c={1:{x:0,history:[]}},f=S=>S-1,g=e.length,b=t.length,I;for(let S=0;S<g+b+1;S++)for(let l=-S;l<S+1;l+=2){let o=l===-S||l!==S&&c[l-1].x<c[l+1].x;if(o){let a=c[l+1];I=a.x,n=a.history}else{let a=c[l-1];I=a.x+1,n=a.history}n=n.slice();let u=I-l;for(1<=u&&u<=b&&o?n.push({changeState:ge.Insert,item:t[f(u)]}):1<=I&&I<=g&&n.push({changeState:ge.Remove,item:e[f(I)]});I<g&&u<b&&this.mCompareFunction(e[f(I+1)],t[f(u+1)]);)I+=1,u+=1,n.push({changeState:ge.Keep,item:e[f(I)]});if(I>=g&&u>=b)return n;c[l]={x:I,history:n}}return new Array}},ge=function(m){return m[m.Remove=1]="Remove",m[m.Insert=2]="Insert",m[m.Keep=3]="Keep",m}({});var Ke=class m{static new(e){return new m(e)}mLabel;mId;mPortType;mDataType;mRegions;get label(){return this.mLabel}get id(){return this.mId}get portType(){return this.mPortType}get dataType(){return this.mDataType}get regions(){return this.mRegions}constructor(e){this.mLabel=e.label,this.mId=e.id,this.mPortType=e.portType,e.portType==="value"?this.mDataType=e.dataType:this.mDataType=null,this.mRegions={add:e.regions?.add??new Array}}};var pe=class{mId;mCategory;mLabel;mRegions;mCodeGenerator;mPortProvider;mPreviewGenerator;get id(){return this.mId}get category(){return this.mCategory}get inputs(){return this.mPortProvider.inputs().map(e=>Ke.new(e))}get label(){return this.mLabel}get outputs(){return this.mPortProvider.outputs().map(e=>Ke.new(e))}get regions(){return this.mRegions}get codeGenerator(){return this.mCodeGenerator}get preview(){return this.mPreviewGenerator}getPort(e){return[...this.inputs,...this.outputs].find(t=>t.id===e)}constructor(e){this.mId=e.id,this.mLabel=e.label,this.mCategory=e.category,this.mCodeGenerator=e.generators.code,this.mPortProvider=e.generators.ports,this.mPreviewGenerator=e.generators.preview??null,this.mRegions={add:e.regions?.add??new Array,allows:e.regions?.allows??new Array,requires:e.regions?.requires??new Array}}};var Qe=class m extends pe{static new(e){return new m(e)}mFunction;get function(){return this.mFunction}constructor(e){let t=()=>{let f=e.inputs.map(g=>({label:g.label,id:g.label,portType:"value",dataType:g.dataType}));return f.unshift({label:"Input",id:"Input",portType:"flow"}),f},n=()=>{let f=e.outputs.map(g=>({label:g.label,id:g.label,portType:"value",dataType:g.dataType}));return f.unshift({label:"Output",id:"Output",portType:"flow"}),f},c=e.project.getFunction(e.definitionId);super({id:`USERFUNCTION_${e.id}`,label:e.label,category:"user function",generators:{ports:{inputs:t,outputs:n},code:c?.codeGenerator.value??(()=>""),preview:null}}),this.mFunction=e}};var ve=class{mLabel;mConnectedPorts;mDefinitionId;mDirection;mDirectValue;mDocument;mNode;mPortType;mProject;mValueType;get connectedPorts(){return this.mConnectedPorts}get direction(){return this.mDirection}get directValue(){return this.mDirectValue}get definitionId(){return this.mDefinitionId}get document(){return this.mDocument}get label(){return this.mLabel}set label(e){this.mLabel=e}get node(){return this.mNode}get portType(){return this.mPortType}get project(){return this.mProject}get dataType(){return this.mValueType??""}get resolvedDataType(){if(this.mPortType!=="value")return this.dataType;if(!this.mProject.types.isGenericType(this.mValueType??""))return this.dataType;if(this.mDirection==="output"){let e=this.mNode.inputs.values().find(t=>t.dataType===this.mValueType);return e?e.resolvedDataType:this.dataType}return this.mDirection==="input"?this.mConnectedPorts.size===0?this.dataType:this.mConnectedPorts.values().next().value.resolvedDataType:this.dataType}constructor(e,t,n){if(n.portType==="flow"&&n.dataType!==null)throw new A("Flow ports cannot have a value type.",this);if(n.portType==="value"&&n.dataType===null)throw new A("Value ports must have a value type.",this);this.mProject=e,this.mDocument=t,this.mNode=n.node,this.mDefinitionId=n.definitionId,this.mLabel=n.label,this.mValueType=n.dataType,this.mDirection=n.direction,this.mPortType=n.portType,this.mConnectedPorts=new Set,this.mDirectValue=new Array,n.dataType&&!this.mProject.types.isGenericType(n.dataType)&&this.mDirectValue.push(...e.types.getType(n.dataType).defaultValue)}connect(e){if(this.mConnectedPorts.has(e))return;if(this.mPortType!==e.portType)throw new A(`Cannot connect port ${this.mDefinitionId} of node ${this.mNode.label} to port ${e.mDefinitionId} of node ${e.node.label} due to incompatible port types.`,this);if(this.mDirection===e.direction)throw new A(`Cannot connect port ${this.mDefinitionId} of node ${this.mNode.label} to port ${e.mDefinitionId} of node ${e.node.label} due to incompatible directions.`,this);if(!(this.mPortType==="flow"&&this.mDirection==="input"||this.mPortType==="value"&&this.mDirection==="output"))for(let n of Array.from(this.mConnectedPorts))this.disconnect(n);this.mConnectedPorts.add(e),e.connect(this)}disconnect(e){this.mConnectedPorts.has(e)&&(this.mConnectedPorts.delete(e),e.disconnect(this))}setDirectValue(e){if(this.mPortType!=="value")throw new A("Only value ports can have a direct value.",this);if(this.mProject.types.isGenericType(this.mValueType))throw new A("Generic value ports cannot have a direct value.",this);if(e.length!==this.mProject.types.getType(this.mValueType).defaultValue.length)throw new A("The provided value does not match the expected length of the default value for this port's type.",this);this.mDirectValue.splice(0,this.mDirectValue.length),this.mDirectValue.push(...e)}validate(){let e=new Array;if(this.mDirection==="output"){if(this.mPortType==="flow"&&this.mConnectedPorts.size>1&&e.push(new k(`Flow output port "${this.mDefinitionId}" on node "${this.mNode.label}" can only have one connection.`,this)),this.mPortType==="value"&&this.mProject.types.isGenericType(this.mValueType??"")){let t=this.mNode.inputs.values().filter(n=>n.dataType===this.mValueType);for(let n of t)n.connectedPorts.size===0&&e.push(new k(`Generic output port "${this.mDefinitionId}" on node "${this.mNode.label}" cannot resolve generic type "${this.mValueType}" because its input port "${n.definitionId}" is not connected.`,this))}return e}if(this.mDirection==="input"){if(this.mPortType==="flow")return this.mConnectedPorts.size===0&&e.push(new k(`Flow input port "${this.mDefinitionId}" on node "${this.mNode.label}" must have at least one connection.`,this)),e;if(this.mPortType==="value"){this.mConnectedPorts.size>1&&e.push(new k(`Value input port "${this.mDefinitionId}" on node "${this.mNode.label}" can only have one connection.`,this));for(let t of this.mConnectedPorts)t.resolvedDataType!==this.resolvedDataType&&e.push(new k(`Value input port "${this.mDefinitionId}" on node "${this.mNode.label}" expects type "${this.resolvedDataType}" but is connected to type "${t.resolvedDataType}".`,this));return e}}return e}};var ze=class{mCategory;mDefinitionId;mDocument;mFunction;mInputs;mLabel;mOutputs;mIsSystem;mTransformation;mProject;get definitionId(){return this.mDefinitionId}get document(){return this.mDocument}get inputs(){return this.mInputs}get outputs(){return this.mOutputs}get project(){return this.mProject}get transformation(){return this.mTransformation}get category(){return this.mCategory}get label(){return this.mLabel}set label(e){this.mLabel=e}get isSystem(){return this.mIsSystem}constructor(e,t,n,c){this.mCategory=c.category,this.mDocument=t,this.mDefinitionId=c.definitionId,this.mFunction=n,this.mIsSystem=c.isSystem,this.mLabel=c.label,this.mProject=e,this.mTransformation=c.transformation,this.mInputs=new Map;for(let f of c.ports.input)this.mInputs.set(f.definitionId,new ve(this.mProject,this.mDocument,{definitionId:f.definitionId,direction:"input",label:f.label,node:this,portType:f.portType,dataType:f.dataType}));this.mOutputs=new Map;for(let f of c.ports.output)this.mOutputs.set(f.definitionId,new ve(this.mProject,this.mDocument,{definitionId:f.definitionId,direction:"output",label:f.label,node:this,portType:f.portType,dataType:f.dataType}))}moveTo(e,t){this.mTransformation.x=e,this.mTransformation.y=t}resizeTo(e,t){this.mTransformation.width=Math.max(4,e),this.mTransformation.height=Math.max(2,t)}validate(e){let t=new Array,n=this.mFunction.nodeDefinitions.find(c=>c.id===this.mDefinitionId);if(!n)t.push(new k(`Node "${this.mLabel}" definition "${this.mDefinitionId}" could not be found.`,this));else{t.push(...this.resyncPorts(this.mInputs,n.inputs,"input")),t.push(...this.resyncPorts(this.mOutputs,n.outputs,"output"));let c=new Set([...n.regions.requires,...n.regions.allows]);if(c.size>0)for(let f of e)c.has(f)||t.push(new k(`Node "${this.mLabel}" does not allow region "${f}".`,this));if(n.regions.requires.length>0)for(let f of n.regions.requires)e.has(f)||t.push(new k(`Node "${this.mLabel}" requires region "${f}" but it is not active.`,this))}for(let c of[...this.mInputs.values(),...this.mOutputs.values()])t.push(...c.validate());return t}resyncPorts(e,t,n){let c=new Array,f=new Set(t.map(g=>g.id));for(let g of t){if(!e.has(g.id)){e.set(g.id,new ve(this.mProject,this.mDocument,{definitionId:g.id,direction:n,label:g.label,node:this,portType:g.portType,dataType:g.dataType}));continue}let b=e.get(g.id),I=b.portType!==g.portType,S=b.dataType!==g.dataType;if(!(!I&&!S)){if(b.connectedPorts.size>0||I){c.push(new k(`Port "${b.label}" on node "${this.mLabel}" has a changed type.`,b));continue}this.replacePort(e,b,g,n)}}for(let[g,b]of e.entries())if(!f.has(g)){if(b.connectedPorts.size===0){e.delete(g);continue}c.push(new k(`Port "${b.label}" on node "${this.mLabel}" no longer exists in its definition.`,b))}return c}replacePort(e,t,n,c){let f=Array.from(t.connectedPorts);for(let b of Array.from(t.connectedPorts))t.disconnect(b);let g=new ve(this.mProject,this.mDocument,{definitionId:n.id,direction:c,label:n.label,node:this,portType:n.portType,dataType:n.dataType});e.set(n.id,g);for(let b of f)g.connect(b);return g}};var ye=class{mLabel;mDefinitionId;mDocument;mId;mImports;mInputs;mIsSystem;mNodes;mOutputs;mProject;get id(){return this.mId}get definitionId(){return this.mDefinitionId}get document(){return this.mDocument}get nodes(){return this.mNodes}get nodeDefinitions(){let e=this.mProject.getFunction(this.definitionId);return[...this.mDocument.nodeDefinitions,...e?.getNodeDefinitions(this)??new Array]}get imports(){return this.mImports}get inputs(){return this.mInputs}get label(){return this.mLabel}set label(e){this.mLabel=e}get outputs(){return this.mOutputs}get isSystem(){return this.mIsSystem}get project(){return this.mProject}constructor(e,t,n){this.mProject=e,this.mDocument=t,this.mLabel=n.label,this.mIsSystem=n.isSystem,this.mDefinitionId=n.definitionId,this.mId=n.id,this.mNodes=new Set,this.mInputs=new Array,this.mOutputs=new Array,this.mImports=new Array}addImport(e){this.mImports.includes(e)||this.mImports.push(e)}addInput(e){this.mInputs.some(t=>t.label===e.label)||this.mInputs.push(e)}addOutput(e){this.mOutputs.some(t=>t.label===e.label)||this.mOutputs.push(e)}addNode(e){this.mNodes.add(e)}newNode(e,t,n=!1){let c=g=>({definitionId:g.id,label:g.label,portType:g.portType,dataType:g.dataType}),f=new ze(this.mProject,this.mDocument,this,{category:e.category,definitionId:e.id,ports:{input:e.inputs.map(c),output:e.outputs.map(c)},isSystem:n,label:e.label,transformation:t});return this.mNodes.add(f),f}removeNode(e){for(let t of[...e.inputs.values(),...e.outputs.values()])for(let n of Array.from(t.connectedPorts))t.disconnect(n);this.mNodes.delete(e)}removeImport(e){let t=this.mImports.indexOf(e);t!==-1&&this.mImports.splice(t,1)}removeInput(e){let t=this.mInputs.findIndex(n=>n.label===e.label);t!==-1&&this.mInputs.splice(t,1)}removeOutput(e){let t=this.mOutputs.findIndex(n=>n.label===e.label);t!==-1&&this.mOutputs.splice(t,1)}validate(){let e=[];this.mProject.getFunction(this.mDefinitionId)||e.push(new k(`Function "${this.mLabel}" definition "${this.mDefinitionId}" could not be found.`,this));let n=new Map,c=new Map;for(let f of this.mNodes)c.set(f,this.accumulateRegions(f,n,new Set,e));for(let f of this.mNodes)e.push(...f.validate(c.get(f)));return e}accumulateRegions(e,t,n,c){if(t.has(e))return t.get(e);if(n.has(e))return c.push(new k(`Node "${e.label}" is part of a connection cycle.`,e)),new Set;n.add(e);let f=new Set;for(let g of e.inputs.values())for(let b of g.connectedPorts){let I=b.node,S=this.accumulateRegions(I,t,n,c);for(let o of S)f.add(o);let l=this.nodeDefinitions.find(o=>o.id===I.definitionId);if(l){for(let u of l.regions.add)f.add(u);let o=l.getPort(b.definitionId);if(o)for(let u of o.regions.add)f.add(u)}}return t.set(e,f),f}};var Ge=class{mFunctions;mFunctionNodeDefinitions;mProject;get functions(){return this.mFunctions}get nodeDefinitions(){return[...this.mFunctionNodeDefinitions.values(),...this.mProject.nodeDefinitions.values()]}get project(){return this.mProject}constructor(e){this.mProject=e,this.mFunctions=new Set,this.mFunctionNodeDefinitions=new Map}addFunction(e){this.mFunctions.add(e);let t=Qe.new(e);this.mFunctionNodeDefinitions.set(t.id,t)}newFunction(e){let t=new ye(this.mProject,this,e);this.mFunctions.add(t);let n=Qe.new(t);return this.mFunctionNodeDefinitions.set(n.id,n),t}removeFunction(e){if(!this.mFunctions.has(e))return!1;if(e.isSystem)throw new A("Cannot remove a system function.",this);this.mFunctions.delete(e);let t=this.mFunctionNodeDefinitions.values().find(n=>n.function===e);return t&&this.mFunctionNodeDefinitions.delete(t.id),!0}validate(){let e=[];for(let t of this.mFunctions)e.push(...t.validate());return e}},k=class{mMessage;mItem;get message(){return this.mMessage}get item(){return this.mItem}constructor(e,t){this.mMessage=e,this.mItem=t}};(function(m){m.Function="function",m.Comment="comment",m.Input="input",m.Output="output",m.Reroute="reroute"})(z||(z={}));var Me=class m{static META={[z.Function]:{icon:"f",cssColor:"var(--pn-accent-blue)",label:"Function"},[z.Comment]:{icon:"\u{1F4AC}",cssColor:"var(--pn-accent-yellow)",label:"Comment"},[z.Input]:{icon:"\u2192",cssColor:"var(--pn-accent-green)",label:"Input"},[z.Output]:{icon:"\u2190",cssColor:"var(--pn-accent-red)",label:"Output"},[z.Reroute]:{icon:"\u25C7",cssColor:"var(--pn-text-muted)",label:"Reroute"}};static get(e){let t=m.META[e];return t||{icon:"\u25C6",cssColor:`hsl(${m.hashStringToHue(e)}, 60%, 55%)`,label:e.charAt(0).toUpperCase()+e.slice(1)}}static hashStringToHue(e){let t=0;for(let n=0;n<e.length;n++)t=(t<<5)-t+e.charCodeAt(n),t=t&t;return Math.abs(t)%360}},z;var ie=class m{static mComponents=new WeakMap;static mConstructorSelector=new WeakMap;static mElements=new WeakMap;static ofComponent(e){let t=e.processorConstructor,n=m.mConstructorSelector.get(t);if(!n)throw new A(`Constructor "${t.name}" is not a registered custom element`,t);let c=m.mElements.get(e);if(!c)throw new A(`Component "${e}" is not a registered component`,e);return{selector:n,constructor:t,element:c,component:e,processor:e.processor}}static ofConstructor(e){let t=m.mConstructorSelector.get(e);if(!t)throw new A(`Constructor "${e.name}" is not a registered custom element`,e);let n=globalThis.customElements.get(t);if(!n)throw new A(`Constructor "${e.name}" is not a registered custom element`,e);return{selector:t,constructor:e,elementConstructor:n}}static ofElement(e){let t=m.mComponents.get(e);if(!t)throw new A(`Element "${e}" is not a PwbComponent.`,e);return m.ofComponent(t)}static ofProcessor(e){let t=m.mComponents.get(e);if(!t)throw new A("Processor is not a PwbComponent.",e);return m.ofComponent(t)}static registerComponent(e,t,n){m.mComponents.has(t)||m.mComponents.set(t,e),n&&!m.mComponents.has(n)&&m.mComponents.set(n,e),m.mElements.has(e)||m.mElements.set(e,t)}static registerConstructor(e,t){e&&!m.mConstructorSelector.has(e)&&m.mConstructorSelector.set(e,t)}};var ke=class m{static CONFIGURATION_ATTACHMENT=Symbol("PwbApplicationConfigurationAttachment");static new(e,t){let n=new m;e(n),t&&n.appendTo(t)}mContent;mElement;constructor(){this.mContent=new Array,this.mElement=document.createElement("div"),this.mElement.attachShadow({mode:"open"})}addContent(e){let t=ie.ofConstructor(e).elementConstructor,n=ie.ofElement(new t);return this.mContent.push(n.component),this.mElement.shadowRoot.appendChild(n.element),n.processor}addStyle(e){let t=document.createElement("style");t.textContent=e,this.mElement.shadowRoot.prepend(t)}appendTo(e){e.appendChild(this.mElement)}};var Be=class{mCustomMetadata;constructor(){this.mCustomMetadata=new Map}getMetadata(e){return this.mCustomMetadata.get(e)??null}setMetadata(e,t){this.mCustomMetadata.set(e,t)}};var et=class extends Be{};var tt=class m extends Be{static mPrivateMetadataKey=Symbol("Metadata");mDecoratorMetadataObject;mPropertyMetadata;constructor(e){super(),this.mDecoratorMetadataObject=e,this.mPropertyMetadata=new Map,e[m.mPrivateMetadataKey]=this}getInheritedMetadata(e){let t=new Array,n=this.mDecoratorMetadataObject;do{if(Object.hasOwn(n,m.mPrivateMetadataKey)){let f=n[m.mPrivateMetadataKey].getMetadata(e);f!==null&&t.push(f)}n=Object.getPrototypeOf(n)}while(n!==null);return t.reverse()}getProperty(e){return this.mPropertyMetadata.has(e)||this.mPropertyMetadata.set(e,new et),this.mPropertyMetadata.get(e)}};Symbol.metadata??=Symbol("Symbol.metadata");var te=class m{static mMetadataMapping=new Map;static add(e,t){return(n,c)=>{let f=m.forInternalDecorator(c.metadata);switch(c.kind){case"class":f.setMetadata(e,t);return;case"method":case"field":case"getter":case"setter":case"accessor":if(c.static)throw new Error("@Metadata.add not supported for statics.");f.getProperty(c.name).setMetadata(e,t);return}}}static forInternalDecorator(e){return m.mapMetadata(e)}static get(e){Object.hasOwn(e,Symbol.metadata)||m.polyfillMissingMetadata(e);let t=e[Symbol.metadata];return m.mapMetadata(t)}static init(){return(e,t)=>{m.forInternalDecorator(t.metadata)}}static mapMetadata(e){if(m.mMetadataMapping.has(e))return m.mMetadataMapping.get(e);let t=new tt(e);return m.mMetadataMapping.set(e,t),t}static polyfillMissingMetadata(e){let t=new Array,n=e;do t.push(n),n=Object.getPrototypeOf(n);while(n!==null);for(let c=t.length-1;c>=0;c--){let f=t[c];if(!Object.hasOwn(f,Symbol.metadata)){let g=null;c<t.length-2&&(g=t[c+1][Symbol.metadata]),f[Symbol.metadata]=Object.create(g,{})}}}};var $=class m{static mCurrentInjectionContext=null;static mInjectMode=new Map;static mInjectableConstructor=new Map;static mInjectableReplacement=new Map;static mInjectionConstructorIdentificationMetadataKey=Symbol("InjectionConstructorIdentification");static mSingletonMapping=new Map;static createObject(e,t,n){let[c,f]=typeof t=="object"&&t!==null?[!1,t]:[!!t,n??new Map],g=m.getInjectionIdentification(e);if(!m.mInjectableConstructor.has(g))throw new A(`Constructor "${e.name}" is not registered for injection and can not be built`,m);let b=c?"instanced":m.mInjectMode.get(g),I=new Map(f.entries().map(([o,u])=>[m.getInjectionIdentification(o),u])),S=m.mCurrentInjectionContext,l=new Map([...S?.localInjections.entries()??[],...I.entries()]);m.mCurrentInjectionContext={injectionMode:b,localInjections:l};try{if(!c&&b==="singleton"&&m.mSingletonMapping.has(g))return m.mSingletonMapping.get(g);let o=new e;return b==="singleton"&&!m.mSingletonMapping.has(g)&&m.mSingletonMapping.set(g,o),o}finally{m.mCurrentInjectionContext=S}}static injectable(e="instanced"){return(t,n)=>{m.registerInjectable(t,n.metadata,e)}}static registerInjectable(e,t,n){let c=m.getInjectionIdentification(e,t);m.mInjectableConstructor.set(c,e),m.mInjectMode.set(c,n)}static replaceInjectable(e,t){let n=m.getInjectionIdentification(e);if(!m.mInjectableConstructor.has(n))throw new A("Original constructor is not registered.",m);let c=m.getInjectionIdentification(t);if(!m.mInjectableConstructor.has(c))throw new A("Replacement constructor is not registered.",m);m.mInjectableReplacement.set(n,t)}static use(e){if(m.mCurrentInjectionContext===null)throw new A("Can't create object outside of an injection context.",m);let t=m.getInjectionIdentification(e);if(m.mCurrentInjectionContext.injectionMode!=="singleton"&&m.mCurrentInjectionContext.localInjections.has(t))return m.mCurrentInjectionContext.localInjections.get(t);let n=m.mInjectableReplacement.get(t);if(n||(n=m.mInjectableConstructor.get(t)),!n)throw new A(`Constructor "${e.name}" is not registered for injection and can not be built`,m);return m.createObject(n)}static getInjectionIdentification(e,t){let n=t?te.forInternalDecorator(t):te.get(e),c=n.getMetadata(m.mInjectionConstructorIdentificationMetadataKey);return c||(c=Symbol(e.name),n.setMetadata(m.mInjectionConstructorIdentificationMetadataKey,c)),c}};var Ie=class{mData;mInteractionType;mOrigin;get data(){return this.mData}get origin(){return this.mOrigin}get triggerType(){return this.mInteractionType}constructor(e,t,n){this.mInteractionType=e,this.mData=n,this.mOrigin=t}};var De=class m{static mCurrentZone=new m("Default");static get current(){return m.mCurrentZone}static create(e){return new m(e)}mInteractionListener;mName;mTriggerFilterBitmap;get name(){return this.mName}constructor(e){this.mName=e,this.mTriggerFilterBitmap=-1,this.mInteractionListener=new Map}addInteractionListener(e){return this.mInteractionListener.set(e,m.current),this}setTriggerRestriction(e){return this.mTriggerFilterBitmap=e,this}execute(e,...t){let n=m.mCurrentZone;m.mCurrentZone=this;try{return e(...t)}finally{m.mCurrentZone=n}}pushInteraction(e,t){if((this.mTriggerFilterBitmap&e)===0)return!1;if(this.mInteractionListener.size===0)return!0;let n=new Ie(e,this,t);for(let[c,f]of this.mInteractionListener.entries())f.execute(()=>{c.call(this,n)});return!0}removeInteractionListener(e){return e?(this.mInteractionListener.delete(e),this):(this.mInteractionListener.clear(),this)}};var q=function(m){return m[m.Read=1]="Read",m[m.ReadWrite=2]="ReadWrite",m[m.Write=3]="Write",m}({});var be=class{mHooks;mInjections;mProcessor;mProcessorConstructor;get processor(){if(!this.mProcessor)throw new A("Processor is not created yet. Call setup to create processor.",this);return this.mProcessor}get processorConstructor(){return this.mProcessorConstructor}constructor(e){if(this.mProcessorConstructor=e.constructor,this.mProcessor=null,this.mInjections=new Map,this.mHooks={create:new Array},e.parent)for(let[t,n]of e.parent.mInjections.entries())this.setProcessorInjection(t,n)}call(e,...t){let n=Reflect.get(this.processor,e);return typeof n!="function"?null:n.apply(this.processor,t)}deconstruct(){}getProcessorInjection(e){return this.mInjections.get(e)}setProcessorInjection(e,t){if(this.mProcessor)throw new A("Cant add injections to after construction.",this);this.mInjections.set(e,t)}setup(){return this.mProcessor=this.createProcessor(),this}addConstructionHook(e){return this.mHooks.create.push(e),this}createProcessor(){let e=$.createObject(this.mProcessorConstructor,this.mInjections),t;for(;t=this.mHooks.create.pop();){let n=t.call(this,e);n&&(e=n)}return e}};var Se=class m extends be{constructor(e,t){super({constructor:e,parent:t}),this.setProcessorInjection(m,this)}deconstruct(){this.call("onDeconstruct"),super.deconstruct()}setup(){return super.setup(),this.call("onExecute"),this}onUpdate(){return!1}};var $t=class m{static mInstance;mCoreEntityConstructor;mProcessorConstructorConfiguration;constructor(){if(m.mInstance)return m.mInstance;m.mInstance=this,this.mCoreEntityConstructor=new Map,this.mProcessorConstructorConfiguration=new Map}get(e){let t=this.mCoreEntityConstructor.get(e);if(!t)return new Array;let n=new Array;for(let c of t)n.push({processorConstructor:c,processorConfiguration:this.mProcessorConstructorConfiguration.get(c)});return n}register(e,t,n){this.mProcessorConstructorConfiguration.set(t,n);let c=e;do{if(!(c.prototype instanceof be)&&c!==be)break;this.mCoreEntityConstructor.has(c)||this.mCoreEntityConstructor.set(c,new Set),this.mCoreEntityConstructor.get(c).add(t)}while(c=Object.getPrototypeOf(c))}},se=new $t;var Ue=class m extends be{static mExtensionCache=new WeakMap;mExtensionList;constructor(e){super(e),this.mExtensionList=new Array}deconstruct(){for(let e of this.mExtensionList)e.deconstruct();super.deconstruct()}setup(){return super.setup(),this.executeExtensions(),this}executeExtensions(){let e=(()=>{if(!m.mExtensionCache.has(this.processorConstructor)){let c=se.get(Se).filter(g=>{for(let b of g.processorConfiguration.targetRestrictions)if(this instanceof b||this.processorConstructor.prototype instanceof b||this.processorConstructor===b)return!0;return!1}),f={read:c.filter(g=>g.processorConfiguration.access===q.Read),write:c.filter(g=>g.processorConfiguration.access===q.Write),readWrite:c.filter(g=>g.processorConfiguration.access===q.ReadWrite)};m.mExtensionCache.set(this.processorConstructor,f)}return m.mExtensionCache.get(this.processorConstructor)})(),t=[...e.write,...e.readWrite,...e.read];for(let n of t)this.mExtensionList.push(new Se(n.processorConstructor,this).setup())}};var U={get:1,set:2,manual:4};var gt=class m{static ORIGINAL_TO_INTERACTION_MAPPING=new WeakMap;static PROXY_TO_ORIGINAL_MAPPING=new WeakMap;static UNTRACEABLE_FUNCTION_UPDATE_TRIGGER=(()=>{let e=new WeakMap;return e.set(Array.prototype.fill,U.set),e.set(Array.prototype.pop,U.get),e.set(Array.prototype.push,U.set),e.set(Array.prototype.shift,U.get),e.set(Array.prototype.unshift,U.set),e.set(Array.prototype.splice,U.set),e.set(Array.prototype.reverse,U.set),e.set(Array.prototype.sort,U.set),e.set(Array.prototype.concat,U.set),e.set(Map.prototype.clear,U.set),e.set(Map.prototype.delete,U.set),e.set(Map.prototype.set,U.set),e.set(Set.prototype.clear,U.set),e.set(Set.prototype.delete,U.set),e.set(Set.prototype.add,U.set),e})();static getOriginal(e){return m.PROXY_TO_ORIGINAL_MAPPING.get(e)??e}static getWrapper(e){let t=m.getOriginal(e);return m.ORIGINAL_TO_INTERACTION_MAPPING.get(t)}mProxyObject;mStateChangeCallback;get proxy(){return this.mProxyObject}constructor(e,t){let n=m.getWrapper(e);if(n)return n;this.mProxyObject=this.createProxyObject(e),this.mStateChangeCallback=t,m.PROXY_TO_ORIGINAL_MAPPING.set(this.mProxyObject,e),m.ORIGINAL_TO_INTERACTION_MAPPING.set(e,this)}convertToProxy(e){return e===null||typeof e!="object"&&typeof e!="function"?e:new m(e,this.mStateChangeCallback).proxy}createProxyObject(e){let t=(c,f,g)=>{let b=m.getOriginal(f);try{let I=c.call(b,...g);return this.convertToProxy(I)}finally{if(m.UNTRACEABLE_FUNCTION_UPDATE_TRIGGER.has(c)){let I=m.getWrapper(f);I&&I.dispatch(m.UNTRACEABLE_FUNCTION_UPDATE_TRIGGER.get(c))}}};return new Proxy(e,{apply:(c,f,g)=>{let b=c;try{let I=b.call(f,...g);return this.convertToProxy(I)}catch(I){if(!(I instanceof TypeError))throw I;return t(b,f,g)}},set:(c,f,g)=>{try{let b=g;return(b!==null&&typeof b=="object"||typeof b=="function")&&(b=m.getOriginal(b)),Reflect.set(c,f,b)}finally{this.dispatch(U.set)}},get:(c,f,g)=>{try{return this.convertToProxy(Reflect.get(c,f))}finally{this.dispatch(U.get)}},deleteProperty:(c,f)=>{try{return delete c[f]}finally{this.dispatch(U.set)}}})}dispatch(e){this.mStateChangeCallback(e)}};var F=class m{static reaction(e){let t=De.create("ComponentState reaction");t.addInteractionListener(n=>{(n.triggerType&U.set)!==0&&e()}),t.execute(()=>{e()})}static state(e){return(t,n)=>{if(n.static)throw new A("Event target is not for a static property.",m);let c=new WeakMap,f=(g,b)=>{c.set(g,new m(b,e))};return{init(g){return typeof g>"u"||f(this,g),g},set(g){c.has(this)?c.get(this).set(g):f(this,g)},get(){return c.has(this)||f(this,void 0),c.get(this).get()}}}}mLinkedZones;mLinkedZonesArray;mConfiguration;mValue;constructor(e,t){if(this.mLinkedZones=new Set,this.mLinkedZonesArray=new Array,this.mConfiguration={complexValue:t?.complexValue??!1,proxy:t?.proxy??!1},this.mConfiguration.proxy){if(typeof e!="object"||e===null)throw new A("Proxied component state value must be an object.",this);this.mValue=new gt(e,n=>{switch(n){case U.set:return this.dispatchChange();case U.get:return this.linkCurrentZone()}}).proxy}else this.mValue=e}get(){return this.linkCurrentZone(),this.mValue}set(e){if(this.mConfiguration.proxy)throw new A("Proxy is not implemented yet.",this);!this.mConfiguration.complexValue&&this.mValue===e||(this.mValue=e,this.dispatchChange())}dispatchChange(){for(let e of this.mLinkedZonesArray)e.pushInteraction(U.set,this)}linkCurrentZone(){let e=De.current;this.mLinkedZones.has(e)||(this.mLinkedZones.add(e),this.mLinkedZonesArray.push(e))}};var _e=class m{static mCurrentUpdateCycle=null;static openResheduledCycle(e,t){let n=!1;if(!m.mCurrentUpdateCycle){let c=performance.now();m.mCurrentUpdateCycle={initiator:e.initiator,startTime:c,forcedSync:e.forcedSync,runner:e.runner},n=!0}try{return t(m.mCurrentUpdateCycle)}finally{n&&(m.mCurrentUpdateCycle=null)}}static openUpdateCycle(e,t){let n=!1;if(!m.mCurrentUpdateCycle){let c=performance.now();m.mCurrentUpdateCycle={initiator:e.updater,startTime:c,forcedSync:e.runSync,runner:Symbol("Runner "+c)},n=!0}try{return t(m.mCurrentUpdateCycle)}finally{n&&(m.mCurrentUpdateCycle=null)}}static updateCycleRunId(e,t){if(e.initiator===t){let n=performance.now(),c=e;c.runner=Symbol("Runner "+n)}}static updateCyleStartTime(e){let t=performance.now(),n=e;n.startTime=t}};var vt=class extends Error{mChain;get chain(){return this.mChain}constructor(e,t){let n=t.slice(-20).map(c=>c.toString()).join(`
`);super(`${e}: 
${n}`),this.mChain=[...t]}};var yt=class m{static mStackCap=100;static mFrameTime=100;static get stackCap(){return m.mStackCap}static set stackCap(e){m.mStackCap=e}static get frameTime(){return m.mFrameTime}static set frameTime(e){m.mFrameTime=e}mInteractionZone;mUpdateFunction;mUpdateRunCache;mUpdateStates;mManualComponentState;get zone(){return this.mInteractionZone}constructor(e){this.mUpdateRunCache=new WeakMap,this.mUpdateFunction=e.onUpdate,this.mInteractionZone=e.zone,this.mManualComponentState=new F(Symbol("Manual Update")),this.mUpdateStates={chainCompleteHooks:new Ce,async:{hasSheduledTask:!1,hasRunningTask:!1,sheduledTaskIsResheduled:!1},sync:{running:!1},cycle:{chainedTask:null}},this.mInteractionZone.addInteractionListener(t=>{(t.triggerType&U.set)!==0&&this.runUpdateAsynchron(t,null)})}deconstruct(){this.mInteractionZone.removeInteractionListener()}async waitForUpdate(){return this.mUpdateStates.async.hasSheduledTask?new Promise((e,t)=>{this.mUpdateStates.chainCompleteHooks.push((n,c)=>{c?t(c):e(n)})}):!1}executeInZone(e){return this.mInteractionZone.execute(e)}update(){let e=new Ie(U.manual,this.mInteractionZone,this.mManualComponentState);return this.runUpdateSynchron(e)}updateAsync(){let e=new Ie(U.manual,this.mInteractionZone,this.mManualComponentState);this.runUpdateAsynchron(e,null)}executeTaskChain(e,t,n,c){if(c.length>m.stackCap)throw new vt("Call loop detected",c);let f=performance.now();if(!t.forcedSync&&f-t.startTime>m.frameTime)throw new rt;c.push(e);let g=this.mInteractionZone.execute(()=>this.mUpdateFunction.call(this))||n;if(_e.updateCycleRunId(t,this),!this.mUpdateStates.cycle.chainedTask)return g;let b=this.mUpdateStates.cycle.chainedTask;return this.mUpdateStates.cycle.chainedTask=null,this.executeTaskChain(b,t,g,c)}releaseUpdateChainCompleteHooks(e,t){if(!this.mUpdateStates.chainCompleteHooks.top)return;let n;for(;n=this.mUpdateStates.chainCompleteHooks.pop();)n(e,t)}runUpdateAsynchron(e,t){if(this.mUpdateStates.async.hasRunningTask||this.mUpdateStates.async.sheduledTaskIsResheduled){this.mUpdateStates.cycle.chainedTask=e;return}if(this.mUpdateStates.async.hasSheduledTask)return;let n=c=>{this.mUpdateStates.async.hasRunningTask=!0,this.mUpdateStates.async.hasSheduledTask=!1,this.mUpdateStates.async.sheduledTaskIsResheduled=!1;let f=!1;try{this.runUpdateSynchron(e)}catch(g){g instanceof rt&&c.initiator===this&&(f=!0)}finally{this.mUpdateStates.async.hasRunningTask=!1}f&&this.runUpdateAsynchron(e,c)};this.mUpdateStates.async.hasSheduledTask=!0,t&&(this.mUpdateStates.async.sheduledTaskIsResheduled=!0),globalThis.requestAnimationFrame(()=>{t?_e.openResheduledCycle(t,n):_e.openUpdateCycle({updater:this,runSync:!1},n)})}runUpdateSynchron(e){if(this.mUpdateStates.sync.running)return this.mUpdateStates.cycle.chainedTask=e,!1;this.mUpdateStates.sync.running=!0;try{let t=_e.openUpdateCycle({updater:this,runSync:!0},n=>{if(this.mUpdateRunCache.has(n.runner))return _e.updateCyleStartTime(n),this.mUpdateRunCache.get(n.runner);let c=this.executeTaskChain(e,n,!1,new Array);return this.mUpdateRunCache.set(n.runner,c),c});return this.releaseUpdateChainCompleteHooks(t),t}catch(t){throw t instanceof rt||this.releaseUpdateChainCompleteHooks(!1,t),t}finally{this.mUpdateStates.sync.running=!1}}},rt=class extends Error{constructor(){super("Update resheduled")}};var bt=class extends Ue{mUpdater;get updater(){return this.mUpdater}constructor(e){super(e);let t=De.create(`${e.constructor.name}-Update-Zone`);this.mUpdater=new yt({label:e.constructor.name,zone:t,onUpdate:()=>this.onUpdate()})}call(e,...t){return this.mUpdater.executeInZone(()=>super.call(e,...t))}deconstruct(){this.mUpdater.deconstruct(),super.deconstruct()}createProcessor(){return this.mUpdater.executeInZone(()=>super.createProcessor())}};var Oe=class{mExpression;mTemporaryValues;constructor(e,t,n){if(this.mTemporaryValues=new Q,n.length>0)for(let c of n)this.mTemporaryValues.set(c,void 0);this.mExpression=this.createEvaluationFunction(e,this.mTemporaryValues).bind(t.store)}execute(){return this.mExpression()}setTemporaryValue(e,t){if(!this.mTemporaryValues.has(e))throw new A(`Temporary value "${e}" does not exist for this procedure.`,this);this.mTemporaryValues.set(e,t)}createEvaluationFunction(e,t){let n,c=`__${Math.random().toString(36).substring(2)}`;if(n="return function () {",t.size>0)for(let f of t.keys())n+=`const ${f} = ${c}.get('${f}');`;return n+=`return ${e};`,n+="};",new Function(c,n)(t)}};var fe=class{mDataLevel;get data(){return this.mDataLevel}constructor(e){this.mDataLevel=e}createExpressionProcedure(e,t){return new Oe(e,this.data,t??[])}setTemporaryValue(e,t){this.data.setTemporaryValue(e,t)}};var ue=class{mComponent;mDataProxy;mParentLevel;mTemporaryValues;get store(){return this.mDataProxy}constructor(e){this.mTemporaryValues=new Q,e instanceof re?(this.mParentLevel=null,this.mComponent=e):(this.mParentLevel=e,this.mComponent=e.mComponent),this.mDataProxy=this.createAccessProxy()}setTemporaryValue(e,t){this.mTemporaryValues.set(e,t)}updateLevelData(e){if(e.mParentLevel!==this.mParentLevel)throw new A("Can't update InstructionLevelData for a deeper level than it target data.",this);this.mTemporaryValues=e.mTemporaryValues}createAccessProxy(){return new Proxy(new Object,{get:(e,t)=>this.getValue(t),set:(e,t,n)=>(this.hasTemporaryValue(t)&&this.setTemporaryValue(t,n),t in this.mComponent.processor?(this.mComponent.processor[t]=n,!0):(this.setTemporaryValue(t,n),!0)),deleteProperty:()=>{throw new A("Deleting properties is not allowed",this)},ownKeys:()=>[...new Set([...Object.keys(this.mComponent.processor),...this.getTemporaryValuesList()])]})}getTemporaryValuesList(){let e=this.mTemporaryValues.map(t=>t);return this.mParentLevel&&e.push(...this.mParentLevel.getTemporaryValuesList()),e}getValue(e){if(this.mTemporaryValues.has(e))return this.mTemporaryValues.get(e);if(this.mParentLevel)return this.mParentLevel.getValue(e);if(e in this.mComponent.processor)return this.mComponent.processor[e]}hasTemporaryValue(e){return this.mTemporaryValues.has(e)?!0:this.mParentLevel?this.mParentLevel.hasTemporaryValue(e):!1}};var Fe=class m{mChildList;mInstruction;mInstructionType;get childList(){return this.mChildList}get instruction(){return this.mInstruction}get instructionType(){return this.mInstructionType}constructor(e,t){this.mChildList=Array(),this.mInstruction=t,this.mInstructionType=e}appendChild(...e){this.mChildList.push(...e)}clone(){let e=new m(this.instructionType,this.instruction);for(let t of this.mChildList)e.appendChild(t.clone());return e}equals(e){if(!(e instanceof m)||e.instruction!==this.instruction||e.instructionType!==this.instructionType||e.childList.length!==this.childList.length)return!1;for(let t=0;t<e.childList.length;t++)if(!e.childList[t].equals(this.childList[t]))return!1;return!0}removeChild(e){let t=this.mChildList.indexOf(e);if(t!==-1)return this.mChildList.splice(t,1)[0]}};var de=class m{mExpression;get value(){return this.mExpression}constructor(e){this.mExpression=e}clone(){return new m(this.mExpression)}equals(e){return e instanceof m&&e.value===this.value}toString(){return`{{ ${this.mExpression} }}`}};var we=class m{mContainsExpression;mTextValue;mValues;get containsExpression(){return this.mContainsExpression}get values(){return this.mValues}constructor(){this.mTextValue="",this.mContainsExpression=!1,this.mValues=[]}addValue(...e){for(let t of e)(this.mContainsExpression===!0||t instanceof de)&&(this.mContainsExpression=!0),this.mValues.push(t),this.mTextValue+=t.toString()}clone(){let e=new m;for(let t of this.values)typeof t=="string"?e.addValue(t):e.addValue(t.clone());return e}equals(e){if(!(e instanceof m)||e.values.length!==this.values.length)return!1;for(let t=0;t<this.values.length;t++){let n=this.values[t],c=e.values[t];if(n!==c&&(typeof n!=typeof c||typeof n=="string"&&n!==c||!c.equals(n)))return!1}return!0}toString(){return this.mTextValue}};var ot=class m{mName;mValue;get name(){return this.mName}get values(){return this.mValue}constructor(e){this.mName=e,this.mValue=new we}clone(){let e=new m(this.name);for(let t of this.values.values)typeof t=="string"?e.values.addValue(t):e.values.addValue(t.clone());return e}equals(e){return!(!(e instanceof m)||e.name!==this.name||!e.values.equals(this.values))}};var xe=class m{mAttributeDictionary;mChildList;mTagName;get attributes(){return[...this.mAttributeDictionary.values()]}get childList(){return this.mChildList}get tagName(){return this.mTagName}constructor(e){this.mAttributeDictionary=new Map,this.mChildList=Array(),this.mTagName=e}appendChild(...e){this.mChildList.push(...e)}clone(){let e=new m(this.tagName);for(let t of this.mAttributeDictionary.values()){let n=e.setAttribute(t.name);for(let c of t.values.values)typeof c=="string"?n.addValue(c):n.addValue(c.clone())}for(let t of this.mChildList)e.appendChild(t.clone());return e}equals(e){if(!(e instanceof m)||e.tagName!==this.tagName||e.attributes.length!==this.mAttributeDictionary.size||e.childList.length!==this.mChildList.length)return!1;for(let t of e.mAttributeDictionary.values()){let n=this.mAttributeDictionary.get(t.name);if(!n||!n.equals(t))return!1}for(let t=0;t<e.childList.length;t++)if(!e.childList[t].equals(this.mChildList[t]))return!1;return!0}getAttribute(e){return this.mAttributeDictionary.get(e)?.values??null}removeAttribute(e){return this.mAttributeDictionary.delete(e)}removeChild(e){let t=this.mChildList.indexOf(e);if(t!==-1)return this.mChildList.splice(t,1)[0]}setAttribute(e){if(this.mAttributeDictionary.has(e))return this.mAttributeDictionary.get(e).values;let t=new ot(e);return this.mAttributeDictionary.set(e,t),t.values}};var ae=class m{mBodyElementList;get body(){return this.mBodyElementList}constructor(){this.mBodyElementList=new Array}appendChild(...e){this.mBodyElementList.push(...e)}clone(){let e=new m;for(let t of this.mBodyElementList)e.appendChild(t.clone());return e}equals(e){if(!(e instanceof m)||e.body.length!==this.mBodyElementList.length)return!1;for(let t=0;t<this.mBodyElementList.length;t++)if(!this.mBodyElementList[t].equals(e.body[t]))return!1;return!0}removeChild(e){let t=this.mBodyElementList.indexOf(e);if(t!==-1)return this.mBodyElementList.splice(t,1)[0]}};var oe=class{mComponentValues;mContent;mModules;mTemplate;get anchor(){return this.mContent.contentAnchor}get modules(){return this.mModules}get template(){return this.mTemplate}get values(){return this.mComponentValues}get content(){return this.mContent}constructor(e,t,n,c){this.mTemplate=e,this.mComponentValues=n,this.mContent=c,this.mModules=t,c.setCoreBuilder(this)}deconstruct(){this.content.deconstruct()}update(){let e=this.onUpdate(),t=!1,n=this.content.builders;if(n.length>0)for(let c=0;c<n.length;c++)t=n[c].update()||t;return e||t}createHtmlElement(e){let t=e.tagName;if(typeof t!="string")throw t;if(t.includes("-")){let c=globalThis.customElements.get(t);if(typeof c<"u")return new c}let n=e.getAttribute("xmlns");return n&&!n.containsExpression?document.createElementNS(n.values[0],t):document.createElement(t)}createTextNode(e){return document.createTextNode(e)}};var He=class{mChildBuilderList;mChildComponents;mContentAnchor;mContentBoundary;mLinkedContent;mRootChildList;get body(){return this.mRootChildList}get builders(){return this.mChildBuilderList}get contentAnchor(){return this.mContentAnchor}constructor(e){this.mChildBuilderList=new Array,this.mRootChildList=new Array,this.mChildComponents=new Map,this.mLinkedContent=new WeakSet,this.mContentAnchor=document.createComment(e),this.mContentBoundary={start:this.mContentAnchor,end:this.mContentAnchor}}deconstruct(){this.onDeconstruct();let e;for(;e=this.mChildBuilderList.pop();)e.deconstruct();for(let n of this.mChildComponents.values())n.deconstruct();this.mChildComponents.clear();let t;for(;t=this.mRootChildList.pop();)t instanceof oe||t.remove();this.contentAnchor.remove()}getBoundary(){let e=this.mContentBoundary.end instanceof oe?this.mContentBoundary.end.content.getBoundary().end:this.mContentBoundary.end;return{start:this.mContentBoundary.start,end:e}}insert(e,t,n){if(!this.mLinkedContent.has(n))throw new A("Can't add content to builder. Target is not part of builder.",this);let c=e instanceof oe?e.anchor:e;switch(t){case"After":{this.insertAfter(c,n);break}case"TopOf":{this.insertTop(c,n);break}case"BottomOf":{this.insertBottom(c,n);break}}this.mLinkedContent.add(e),e instanceof oe&&this.mChildBuilderList.push(e);let f=c.parentElement??c.getRootNode(),g=this.mContentAnchor.parentElement??this.mContentAnchor.getRootNode();if(f===g){let b=(()=>{switch(t){case"After":return this.mRootChildList.indexOf(n)+1;case"TopOf":return 0;case"BottomOf":return this.mRootChildList.length}})();b===this.mRootChildList.length&&(this.mContentBoundary.end=e),this.mRootChildList.splice(b+1,0,e)}}remove(e){if(!this.mLinkedContent.has(e))throw new A("Child node cant be deleted from builder when it not a child of them",this);if(this.mLinkedContent.delete(e),e instanceof oe){let n=this.mChildBuilderList.indexOf(e);n!==-1&&this.mChildBuilderList.splice(n,1),e.deconstruct()}else{let n=this.mChildComponents.get(e);n&&(n.deconstruct(),this.mChildComponents.delete(e)),e.remove()}let t=this.mRootChildList.indexOf(e);t!==-1&&(this.mRootChildList.splice(t,1),this.mContentBoundary.end=this.mRootChildList.at(-1)??this.mContentAnchor)}setCoreBuilder(e){this.mLinkedContent.add(e)}insertAfter(e,t){let n=t instanceof oe?t.content.getBoundary().end:t;(n.parentElement??n.getRootNode()).insertBefore(e,n.nextSibling)}insertBottom(e,t){if(t instanceof oe){this.insertAfter(e,t);return}if(t instanceof Element){t.appendChild(e);return}throw new A("Source node does not support child nodes.",this)}insertTop(e,t){if(t instanceof oe){this.insertAfter(e,t.anchor);return}if(t instanceof Element){t.prepend(e);return}throw new A("Source node does not support child nodes.",this)}};var wt=class extends He{mAttributeModulesChangedOrder;mLinkedAttributeData;mLinkedAttributeExpressionModules;mLinkedAttributeModuleList;mLinkedExpressionModuleList;get linkedAttributeModules(){return this.mAttributeModulesChangedOrder&&(this.mAttributeModulesChangedOrder=!1,this.mLinkedAttributeModuleList.sort((e,t)=>e.accessMode-t.accessMode)),this.mLinkedAttributeModuleList}get linkedExpressionModules(){return this.mLinkedExpressionModuleList}constructor(e){super(e),this.mLinkedExpressionModuleList=new Array,this.mLinkedAttributeModuleList=new Array,this.mLinkedAttributeExpressionModules=new WeakMap,this.mLinkedAttributeData=new WeakMap,this.mAttributeModulesChangedOrder=!1}attributeOfLinkedExpressionModule(e){return this.mLinkedAttributeExpressionModules.get(e)}getLinkedAttributeData(e){if(!this.mLinkedAttributeData.has(e))throw new A("Attribute has no linked data.",this);return this.mLinkedAttributeData.get(e)}linkAttributeExpression(e,t){this.mLinkedAttributeExpressionModules.set(e,t)}linkAttributeModule(e){this.mLinkedAttributeModuleList.push(e),this.mAttributeModulesChangedOrder=!0}linkAttributeNodes(e,t,n){this.mLinkedAttributeData.set(e,{values:n,node:t})}linkExpressionModule(e){this.mLinkedExpressionModuleList.push(e)}onDeconstruct(){for(let e of this.mLinkedAttributeModuleList)e.deconstruct();for(let e of this.mLinkedExpressionModuleList)e.deconstruct()}};var xt=class extends He{mInstructionModule;get instructionModule(){return this.mInstructionModule}constructor(e,t){super(t),this.mInstructionModule=e}onDeconstruct(){this.mInstructionModule.deconstruct()}};var Tt=class extends oe{constructor(e,t,n){let c=t.createInstructionModule(e,n);super(e,t,n,new xt(c,`Instruction - {$${e.instructionType}}`))}onUpdate(){if(this.content.instructionModule.update()){let e=this.content.body;this.updateStaticBuilder(e,this.content.instructionModule.instructionResult.elementList)}return!1}insertNewContent(e,t){let n=new Xe(e.template,this.modules,e.dataLevel,`Child - {$${this.template.instructionType}}`);return t===null?this.content.insert(n,"TopOf",this):this.content.insert(n,"After",t),n}updateStaticBuilder(e,t){let c=new Je((b,I)=>I.template.equals(b.template)).differencesOf(e,t),f=0,g=null;for(let b=0;b<c.length;b++){let I=c[b];if(I.changeState===ge.Remove)this.content.remove(I.item);else if(I.changeState===ge.Insert)g=this.insertNewContent(I.item,g),f++;else{let S=t[f].dataLevel;I.item.values.updateLevelData(S),g=I.item,f++}}}};var Xe=class extends oe{mInitialized;constructor(e,t,n,c){super(e,t,n,new wt(`Static - {${c}}`)),this.mInitialized=!1}onUpdate(){this.mInitialized||(this.mInitialized=!0,this.buildTemplate([this.template],this));let e=!1,t=this.content.linkedAttributeModules;for(let f=0;f<t.length;f++)e=t[f].update()||e;let n=!1,c=this.content.linkedExpressionModules;for(let f=0;f<c.length;f++){let g=c[f];if(g.update()){n=!0;let b=this.content.attributeOfLinkedExpressionModule(g);if(!b)continue;let I=this.content.getLinkedAttributeData(b),S=I.values.reduce((l,o)=>l+o.data,"");I.node.setAttribute(b.name,S)}}return e||n}buildInstructionTemplate(e,t){this.content.insert(new Tt(e,this.modules,new ue(this.values)),"BottomOf",t)}buildStaticTemplate(e,t){let n=this.createHtmlElement(e);this.content.insert(n,"BottomOf",t);for(let c of e.attributes){let f=this.modules.createAttributeModule(c,n,this.values);if(f){this.content.linkAttributeModule(f);continue}if(c.values.containsExpression){let g=new Array;for(let b of c.values.values){let I=this.createTextNode("");if(g.push(I),!(b instanceof de)){I.data=b;continue}let S=this.modules.createExpressionModule(b,I,this.values);this.content.linkExpressionModule(S),this.content.linkAttributeExpression(S,c)}this.content.linkAttributeNodes(c,n,g);continue}n.setAttribute(c.name,c.values.toString())}this.content.insert(n,"BottomOf",t),this.buildTemplate(e.childList,n)}buildTemplate(e,t){for(let n of e)n instanceof ae?this.buildTemplate(n.body,t):n instanceof we?this.buildTextTemplate(n,t):n instanceof Fe?this.buildInstructionTemplate(n,t):n instanceof xe&&this.buildStaticTemplate(n,t)}buildTextTemplate(e,t){for(let n of e.values){if(typeof n=="string"){this.content.insert(this.createTextNode(n),"BottomOf",t);continue}let c=this.createTextNode("");this.content.insert(c,"BottomOf",t);let f=this.modules.createExpressionModule(n,c,this.values);this.content.linkExpressionModule(f)}}};var nt=class{mHtmlElement;mShadowRoot;get htmlElement(){return this.mHtmlElement}get shadowRoot(){return this.mShadowRoot}constructor(e){this.mHtmlElement=e,this.mShadowRoot=this.mHtmlElement.attachShadow({mode:"open"})}};var W=class{mDataLevel;get data(){return this.mDataLevel}constructor(e){this.mDataLevel=e}createExpressionProcedure(e,t){return new Oe(e,this.data,t??[])}};var Pe=class extends Ue{constructor(e){super({constructor:e.constructor,parent:e.parent}),this.setProcessorInjection(W,new W(e.values))}deconstruct(){super.deconstruct(),this.call("onDeconstruct")}update(){return this.onUpdate()}};var K=class{mValue;get value(){return this.mValue}constructor(e){this.mValue=e}};var ee=class{constructor(){throw new A("Reference should not be instanced.",this)}};var he=class{constructor(){throw new A("Reference should not be instanced.",this)}};var Ne=class m extends Pe{mLastResult;mTargetTextNode;constructor(e){super({constructor:e.constructor,parent:e.parent,values:e.values}),this.mTargetTextNode=e.targetNode,this.mLastResult=null,this.setProcessorInjection(m,this),this.setProcessorInjection(he,e.targetTemplate.clone()),this.setProcessorInjection(ee,e.targetNode),this.setProcessorInjection(K,new K(e.targetTemplate.value))}onUpdate(){let e=this.call("onUpdate");e===null&&(e="");let t=this.mLastResult===null||this.mLastResult!==e;if(t){let n=this.mTargetTextNode;n.data=e,this.mLastResult=e}return t}};function jt(){return(m,e)=>{$.registerInjectable(m,e.metadata,"instanced"),se.register(Ne,m,{})}}function Ia(){function m(l,o){return function(a){t(o,"addInitializer"),n(a,"An initializer"),l.push(a)}}function e(l,o,u,a,r,y,v,T,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+o:o,static:y,private:v,metadata:T},d={v:!1};s.addInitializer=m(a,d);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[o]},h=function(x){this[o]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return l(w,s)}finally{d.v=!0}}function t(l,o){if(l.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(l,o){if(typeof l!="function")throw new TypeError(o+" must be a function")}function c(l,o){var u=typeof o;if(l===1){if(u!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(u!=="function"){var a;throw l===0?a="field":l===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function f(l,o,u,a,r,y,v,T,w){var p=u[0],s,d,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,D;if(typeof p=="function")h=e(p,a,s,T,r,y,v,w,i),h!==void 0&&(c(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,D=h.set||i.set,i={get:x,set:D}):i=h);else for(var _=p.length-1;_>=0;_--){var P=p[_];if(h=e(P,a,s,T,r,y,v,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,D=h.set||i.set,i={get:x,set:D}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(C,E){return E};else if(typeof d!="function"){var M=d;d=function(C,E){for(var R=E,L=0;L<M.length;L++)R=M[L].call(C,R);return R}}else{var j=d;d=function(C,E){return j.call(C,E)}}l.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(l.push(function(C,E){return i.get.call(C,E)}),l.push(function(C,E){return i.set.call(C,E)})):r===2?l.push(i):l.push(function(C,E){return i.call(C,E)}):Object.defineProperty(o,a,s))}function g(l,o,u){for(var a=[],r,y,v=new Map,T=new Map,w=0;w<o.length;w++){var p=o[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,D;if(h?(x=l,s=s-5,y=y||[],D=y):(x=l.prototype,r=r||[],D=r),s!==0&&!i){var _=h?T:v,P=_.get(d)||0;if(P===!0||P===3&&s!==4||P===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!P&&s>2?_.set(d,s):_.set(d,!0)}f(a,x,p,d,s,h,i,D,u)}}return b(a,r),b(a,y),a}function b(l,o){o&&l.push(function(u){for(var a=0;a<o.length;a++)o[a].call(u);return u})}function I(l,o,u){if(o.length>0){for(var a=[],r=l,y=l.name,v=o.length-1;v>=0;v--){var T={v:!1};try{var w=o[v](r,{kind:"class",name:y,addInitializer:m(a,T),metadata:u})}finally{T.v=!0}w!==void 0&&(c(10,w),r=w)}return[S(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function S(l,o){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,u,a,r){if(r!==void 0)var y=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(y===void 0?null:y),T=g(o,u,v);return a.length||S(o,v),{e:T,get c(){return I(o,a,v)}}}}function qt(m,e,t,n){return(qt=Ia())(m,e,t,n)}var Jt,Wt,zt;Jt=jt();var Zt=class{static{({c:[zt,Wt]}=qt(this,[],[Jt]))}constructor(e=$.use(W),t=$.use(K)){this.mProcedure=e.createExpressionProcedure(t.value)}mProcedure;onUpdate(){let e=this.mProcedure.execute();return typeof e>"u"?null:e?.toString()}static{Wt()}};var le=class{mName;mValue;get name(){return this.mName}get value(){return this.mValue}constructor(e,t){this.mName=e,this.mValue=t}};var me=class m extends Pe{mAccessMode;get accessMode(){return this.mAccessMode}constructor(e){super({constructor:e.constructor,parent:e.parent,values:e.values}),this.mAccessMode=e.accessMode,this.setProcessorInjection(m,this),this.setProcessorInjection(he,e.targetTemplate.clone()),this.setProcessorInjection(ee,e.targetNode),this.setProcessorInjection(le,new le(e.targetTemplate.name,e.targetTemplate.values.toString()))}onUpdate(){return this.call("onUpdate")??!1}};var ce=class{mElementList;mTemplates;mDataLevels;get elementList(){return this.mElementList}constructor(){this.mElementList=new Array,this.mTemplates=new Set,this.mDataLevels=new Set}addElement(e,t){if(this.mTemplates.has(e)||this.mDataLevels.has(t))throw new A("Can't add same template or values for multiple Elements.",this);this.mTemplates.add(e),this.mDataLevels.add(t),this.mElementList.push({template:e,dataLevel:t})}};var Ae=class m extends Pe{mLastResult;get instructionResult(){return this.mLastResult}constructor(e){super({constructor:e.constructor,parent:e.parent,values:e.values}),this.setProcessorInjection(m,this),this.setProcessorInjection(he,e.targetTemplate.clone()),this.setProcessorInjection(K,new K(e.targetTemplate.instruction)),this.mLastResult=new ce}onUpdate(){let e=this.call("onUpdate");return e instanceof ce?(this.mLastResult=e,!0):!1}};var Et=class m{static mAttributeModuleCache=new Q;static mExpressionModuleCache=new WeakMap;static mInstructionModuleCache=new Q;mComponent;mExpressionModule;constructor(e,t){this.mExpressionModule=t??zt,this.mComponent=e}createAttributeModule(e,t,n){let c=(()=>{let f=m.mAttributeModuleCache.get(e.name);if(f||f===null)return f;for(let g of se.get(me))if(g.processorConfiguration.selector.test(e.name))return m.mAttributeModuleCache.set(e.name,g),g;return m.mAttributeModuleCache.set(e.name,null),null})();return c===null?null:new me({accessMode:c.processorConfiguration.access,constructor:c.processorConstructor,parent:this.mComponent,targetNode:t,targetTemplate:e,values:n}).setup()}createExpressionModule(e,t,n){let c=(()=>{let f=m.mExpressionModuleCache.get(this.mExpressionModule);if(f)return f;let g=se.get(Ne).find(b=>b.processorConstructor===this.mExpressionModule);if(!g)throw new A("An expression module could not be found.",this);return m.mExpressionModuleCache.set(this.mExpressionModule,g),g})();return new Ne({constructor:c.processorConstructor,parent:this.mComponent,targetNode:t,targetTemplate:e,values:n}).setup()}createInstructionModule(e,t){let n=(()=>{let c=m.mInstructionModuleCache.get(e.instructionType);if(c)return c;for(let f of se.get(Ae))if(f.processorConfiguration.instructionType===e.instructionType)return m.mInstructionModuleCache.set(e.instructionType,f),f;throw new A(`Instruction module type "${e.instructionType}" not found.`,this)})();return new Ae({constructor:n.processorConstructor,parent:this.mComponent,targetTemplate:e,values:t}).setup()}};var Ve=class extends A{mColumnEnd;mColumnStart;mLineEnd;mLineStart;get columnEnd(){return this.mColumnEnd}get columnStart(){return this.mColumnStart}get lineEnd(){return this.mLineEnd}get lineStart(){return this.mLineStart}constructor(e,t,n,c,f,g,b){super(e,t,b),this.mColumnStart=n,this.mLineStart=c,this.mColumnEnd=f,this.mLineEnd=g}};var Ye=class{mDependencyFetch;mDependencyFetchResolved;mLexer;mMeta;mPattern;mPatternDependencies;mType;get dependencies(){return this.mPatternDependencies}get dependenciesResolved(){return this.mDependencyFetchResolved}get lexer(){return this.mLexer}get meta(){return this.mMeta}get pattern(){return this.mPattern}constructor(e,t){if(this.mLexer=e,this.mType=t.type,this.mMeta=t.metadata,this.mPatternDependencies=new Array,this.mDependencyFetch=t.dependencyFetch??null,this.mDependencyFetchResolved=!t.dependencyFetch,this.mType==="split"&&!this.mDependencyFetch)throw new A("Split token with a start and end token, need inner token definitions.",this);if(this.mType==="single"&&this.mDependencyFetch)throw new A("Pattern does not allow inner token pattern.",this);this.mPattern=this.convertTokenPattern(this.mType,t.pattern)}isSplit(){return this.mType==="split"}resolveDependencies(){this.mDependencyFetchResolved||(this.mDependencyFetch(this),this.mDependencyFetchResolved=!0)}useChildPattern(e){if(this.mLexer!==e.lexer)throw new A("Can only add dependencies of the same lexer.",this);this.mPatternDependencies.push(e)}convertTokenPattern(e,t){if("single"in t){if(e==="split")throw new A("Can't use split pattern type with single pattern definition.",this);return{start:{regex:t.single.regex,types:t.single.types,validator:t.single.validator??null}}}else{if(e==="single")throw new A("Can't use single pattern type with split pattern definition.",this);return{start:{regex:t.start.regex,types:t.start.types,validator:t.start.validator??null},end:{regex:t.end.regex,types:t.end.types,validator:t.end.validator??null},innerType:t.innerType??null}}}};var We=class{mColumnNumber;mLineNumber;mMetas;mType;mValue;get columnNumber(){return this.mColumnNumber}get lineNumber(){return this.mLineNumber}get metas(){return[...this.mMetas]}get type(){return this.mType}get value(){return this.mValue}constructor(e,t,n,c){this.mValue=t,this.mColumnNumber=n,this.mLineNumber=c,this.mType=e,this.mMetas=new Set}addMeta(...e){for(let t of e)this.mMetas.add(t)}hasMeta(e){return this.mMetas.has(e)}};var it=class{mRootPattern;mSettings;get errorType(){return this.mSettings.errorType}set errorType(e){this.mSettings.errorType=e}get trimWhitespace(){return this.mSettings.trimSpaces}set trimWhitespace(e){this.mSettings.trimSpaces=e}get validWhitespaces(){return[...this.mSettings.whiteSpaces].join("")}set validWhitespaces(e){this.mSettings.whiteSpaces=new Set(e.split(""))}constructor(){this.mSettings={errorType:null,trimSpaces:!0,whiteSpaces:new Set},this.mRootPattern=new Ye(this,{type:"single",pattern:{single:{regex:/^/,types:{},validator:null}},metadata:[],dependencyFetch:null})}createTokenPattern(e,t){let n=b=>typeof b=="string"?{token:b}:b,c=b=>{let I=new Set(b.flags.split(""));return new RegExp(`^(?<token>${b.source})`,[...I].join(""))},f=new Array;e.meta&&(typeof e.meta=="string"?f.push(e.meta):f.push(...e.meta));let g;return"regex"in e.pattern?g={single:{regex:c(e.pattern.regex),types:n(e.pattern.type),validator:e.pattern.validator??null}}:g={start:{regex:c(e.pattern.start.regex),types:n(e.pattern.start.type),validator:e.pattern.start.validator??null},end:{regex:c(e.pattern.end.regex),types:n(e.pattern.end.type),validator:e.pattern.end.validator??null},innerType:e.pattern.innerType??null},new Ye(this,{type:"regex"in e.pattern?"single":"split",pattern:g,metadata:f,dependencyFetch:t??null})}*tokenize(e,t){let n={data:e,cursor:{position:0,column:1,line:1},error:null,progressTracker:t??null};yield*this.tokenizeRecursionLayer(n,this.mRootPattern,new Array,null)}useRootTokenPattern(e){if(e.lexer!==this)throw new A("Token pattern must be created by this lexer.",this);this.mRootPattern.useChildPattern(e)}findNextStartToken(e,t,n,c){for(let f of t){let g=f.pattern.start,b=this.matchToken(f,g,e,n,c);if(b!==null)return{pattern:f,token:b}}return null}findTokenTypeOfMatch(e,t,n){for(let g in e.groups){let b=e.groups[g],I=t[g];if(!(!b||!I)){if(b.length!==e[0].length)throw new A("A group of a token pattern must match the whole token.",this);return I}}let c=new Array;for(let g in e.groups)e.groups[g]&&c.push(g);let f=new Array;for(let g in t)f.push(g);throw new A(`No token type found for any defined pattern regex group. Full: "${e[0]}", Matches: "${c.join(", ")}", Available: "${f.join(", ")}", Regex: "${n.source}"`,this)}*generateErrorToken(e,t){if(!e.error||!this.mSettings.errorType)return;let n=new We(this.mSettings.errorType,e.error.data,e.error.startColumn,e.error.startLine);n.addMeta(...t),e.error=null,yield n}generateToken(e,t,n,c,f,g){let b=n[0],I=this.findTokenTypeOfMatch(n,c,g),S=new We(f??I,b,e.cursor.column,e.cursor.line);return S.addMeta(...t),S}matchToken(e,t,n,c,f){let g=t.regex;g.lastIndex=0;let b=g.exec(n.data);if(!b||b.index!==0)return null;let I=this.generateToken(n,[...c,...e.meta],b,t.types,f,g);if(t.validator){let S=n.data.substring(I.value.length);if(!t.validator(I,S,n.cursor.position))return null}return this.moveCursor(n,I.value),I}moveCursor(e,t){let n=t.split(`
`);n.length>1&&(e.cursor.column=1),e.cursor.line+=n.length-1,e.cursor.column+=n.at(-1).length,e.cursor.position+=t.length,e.data=e.data.substring(t.length),this.trackProgress(e)}pushNextCharToErrorState(e){if(!this.mSettings.errorType)throw new Ve(`Unable to parse next token. No valid pattern found for "${e.data.substring(0,20)}".`,this,e.cursor.column,e.cursor.line,e.cursor.column,e.cursor.line);e.error||(e.error={data:"",startColumn:e.cursor.column,startLine:e.cursor.line});let t=e.data.charAt(0);e.error.data+=t,this.moveCursor(e,t)}skipNextWhitespace(e){let t=e.data.charAt(0);return!this.mSettings.trimSpaces||!this.mSettings.whiteSpaces.has(t)?!1:(this.moveCursor(e,t),!0)}*tokenizeRecursionLayer(e,t,n,c){let f=t.dependencies;for(;e.data.length>0;){if(!e.error&&this.skipNextWhitespace(e))continue;if(t.isSplit()){let I=this.matchToken(t,t.pattern.end,e,n,c);if(I!==null){yield*this.generateErrorToken(e,n),yield I;return}}let g=this.findNextStartToken(e,f,n,c);if(!g){this.pushNextCharToErrorState(e);continue}yield*this.generateErrorToken(e,n),yield g.token;let b=g.pattern;b.isSplit()&&(b.resolveDependencies(),yield*this.tokenizeRecursionLayer(e,b,[...n,...b.meta],c??b.pattern.innerType))}yield*this.generateErrorToken(e,n)}trackProgress(e){e.progressTracker!==null&&e.progressTracker(e.cursor.position,e.cursor.line,e.cursor.column)}};var Z=class extends Error{static PARSER_ERROR=Symbol("PARSER_ERROR");mTrace;get columnEnd(){return this.mTrace.top.range.columnEnd}get columnStart(){return this.mTrace.top.range.columnStart}get graph(){return this.mTrace.top.graph}get incidents(){return this.mTrace.incidents}get lineEnd(){return this.mTrace.top.range.lineEnd}get lineStart(){return this.mTrace.top.range.lineStart}constructor(e){super(e.top.message,{cause:e.top.cause}),this.mTrace=e}};var Ct=class{mIncidents;mTop;get incidents(){if(this.mIncidents===null)throw new A("A complete incident list is only available on debug mode.",this);return this.mIncidents}get top(){return this.mTop}constructor(e){this.mTop={message:"Unknown parser error",priority:0,graph:null,range:{lineStart:1,columnStart:1,lineEnd:1,columnEnd:1},cause:null},e?this.mIncidents=new Array:this.mIncidents=null}push(e,t,n,c,f,g,b=!1,I=null){let S;if(b?S=this.mTop.priority+1:S=f*1e4+g,this.mIncidents!==null){let l={message:e,priority:S,graph:t,range:{lineStart:n,columnStart:c,lineEnd:f,columnEnd:g},cause:I};this.mIncidents.push(l)}this.mTop&&S<this.mTop.priority||this.setTop({message:e,priority:S,graph:t,range:{lineStart:n,columnStart:c,lineEnd:f,columnEnd:g},cause:I})}setTop(e){this.mTop=e}};var It=class m{static MAX_JUNCTION_CIRCULAR_REFERENCES=1e3;mGraphStack;mIncidentTrace;mLastTokenPosition;mProcessStack;mTokenCache;mTokenGenerator;mTrimTokenCache;get currentGraph(){return this.mGraphStack.top.graph}get currentToken(){let e=this.mGraphStack.top;return this.mTokenCache[e.token.cursor]}get incidentTrace(){return this.mIncidentTrace}get processStack(){return this.mProcessStack}constructor(e,t,n){this.mTokenGenerator=e,this.mGraphStack=new Ce,this.mLastTokenPosition={column:1,line:1},this.mTokenCache=new Array,this.mProcessStack=new Ce,this.mTrimTokenCache=n,this.mIncidentTrace=new Ct(t),this.mGraphStack.push({graph:null,linear:!0,circularGraphs:new Q,token:{start:0,cursor:-1}})}collapse(){let e=this.mGraphStack.top,t=this.mTokenCache.slice(e.token.cursor);t.length!==0&&t.at(-1)===null&&t.pop();for(let n of this.mTokenGenerator)t.push(n);return t}getGraphBoundingToken(){let e=this.mGraphStack.top,t=this.mTokenCache[e.token.start],n=this.mTokenCache[e.token.cursor-1];return t??=n,n??=t,[t??null,n??null]}getGraphPosition(){let e=this.mGraphStack.top,t,n;if(t=this.mTokenCache[e.token.start],n=this.mTokenCache[e.token.cursor-1],t??=n,n??=t,!t||!n)return{graph:e.graph,columnEnd:this.mLastTokenPosition.column,columnStart:this.mLastTokenPosition.column,lineEnd:this.mLastTokenPosition.line,lineStart:this.mLastTokenPosition.line};let c,f;if(n.value.includes(`
`)){let g=n.value.split(`
`);f=n.lineNumber+g.length-1,c=1+g[g.length-1].length}else c=n.columnNumber+n.value.length,f=n.lineNumber;return{graph:e.graph,lineStart:t.lineNumber,columnStart:t.columnNumber,lineEnd:f,columnEnd:c}}getTokenPosition(){let e=this.mGraphStack.top,t=this.currentToken;if(!t)return{graph:e.graph,columnEnd:this.mLastTokenPosition.column,columnStart:this.mLastTokenPosition.column,lineEnd:this.mLastTokenPosition.line,lineStart:this.mLastTokenPosition.line};let n,c;if(t.value.includes(`
`)){let f=t.value.split(`
`);c=t.lineNumber+f.length-1,n=1+f[f.length-1].length}else n=t.columnNumber+t.value.length,c=t.lineNumber;return{graph:e.graph,lineStart:t.lineNumber,columnStart:t.columnNumber,lineEnd:c,columnEnd:n}}graphIsCircular(e){let t=this.mGraphStack.top;if(!t.circularGraphs.has(e))return!1;if(e.isJunction){if(t.circularGraphs.get(e)>m.MAX_JUNCTION_CIRCULAR_REFERENCES)throw new A("Junction graph called circular too often.",this);return!1}return!0}moveNextToken(){let e=this.mGraphStack.top;if(e.circularGraphs.size>0&&(e.circularGraphs=new Q),e.graph&&e.graph.isJunction)throw new A("Junction graph must not have own nodes.",this);if(e.token.cursor++,e.token.cursor<this.mTokenCache.length)return;let t=this.mTokenGenerator.next();if(t.done){this.mTokenCache.push(null);return}this.mLastTokenPosition.column=t.value.columnNumber,this.mLastTokenPosition.line=t.value.lineNumber,this.mTokenCache.push(t.value)}popGraphStack(e){let t=this.mGraphStack.pop(),n=this.mGraphStack.top;if(e&&(t.token.cursor=t.token.start),t.token.cursor!==t.token.start&&n.circularGraphs.size>0&&(n.circularGraphs=new Q),!this.mTrimTokenCache){n.token.cursor=t.token.cursor;return}t.linear?(this.mTokenCache.splice(0,t.token.cursor),n.token.start=0,n.token.cursor=0):n.token.cursor=t.token.cursor}pushGraphStack(e,t){let n=this.mGraphStack.top,c={graph:e,linear:t&&n.linear,circularGraphs:new Q(n.circularGraphs),token:{start:n.token.cursor,cursor:n.token.cursor}},f=c.circularGraphs.get(e)??0;c.circularGraphs.set(e,f+1),this.mGraphStack.push(c)}};var st=class m{static NODE_NULL_RESULT=Symbol("FAILED_NODE_VALUE_PARSE");static NODE_VALUE_LIST_END_MEET=Symbol("FAILED_NODE_VALUE_PARSE");mConfiguration;mLexer;mRootPart;get lexer(){return this.mLexer}constructor(e,t){this.mLexer=e,this.mRootPart=null,this.mConfiguration={keepTraceIncidents:!1,trimTokenCache:!1,...t}}parse(e,t){if(this.mRootPart===null)throw new A("Parser has not root part set.",this);let n=new It(this.mLexer.tokenize(e,t),this.mConfiguration.keepTraceIncidents,this.mConfiguration.trimTokenCache),c=(()=>{try{return this.beginParseProcess(n,this.mRootPart)}catch(g){if(g instanceof Ve)return n.incidentTrace.push(g.message,n.currentGraph,g.lineStart,g.columnStart,g.lineEnd,g.columnEnd,!0,g),Z.PARSER_ERROR;let b=g instanceof Error?g.message:g.toString(),I=n.getGraphPosition();return n.incidentTrace.push(b,n.currentGraph,I.lineStart,I.columnStart,I.lineEnd,I.columnEnd,!0,g),Z.PARSER_ERROR}})();if(c===Z.PARSER_ERROR)throw new Z(n.incidentTrace);let f=n.collapse();if(f.length!==0){let g=f[0];if(n.incidentTrace.top.range.lineEnd===1&&n.incidentTrace.top.range.columnEnd===1){let b=`Tokens could not be parsed. Graph end meet without reaching last token. Current: "${g.value}" (${g.type})`;n.incidentTrace.push(b,this.mRootPart,g.lineNumber,g.columnNumber,g.lineNumber,g.columnNumber)}throw new Z(n.incidentTrace)}return c}setRootGraph(e){this.mRootPart=e}beginParseProcess(e,t){e.moveNextToken(),e.processStack.push({type:"graph-parse",parameter:{graph:t,linear:!0},state:0});let n=m.NODE_NULL_RESULT;for(;e.processStack.top;)n=this.processStack(e,e.processStack.top,n);return n}processChainedNodeParseProcess(e,t,n){switch(t.state){case 0:{let g=t.parameter.node.connections.next;return g===null?(e.processStack.pop(),{}):(t.state++,e.processStack.push({type:"node-parse",parameter:{node:g},state:0,values:{}}),m.NODE_NULL_RESULT)}case 1:{let c=n;return c===Z.PARSER_ERROR?(e.processStack.pop(),Z.PARSER_ERROR):(e.processStack.pop(),c)}}throw new A(`Invalid node next parse state "${t.state}".`,this)}processGraphParseProcess(e,t,n){let c=t.parameter.graph;switch(t.state){case 0:{if(e.graphIsCircular(c)){let g=e.getGraphPosition();return e.incidentTrace.push("Circular graph detected.",c,g.lineStart,g.columnStart,g.lineEnd,g.columnEnd),e.processStack.pop(),Z.PARSER_ERROR}let f=t.parameter.linear;return e.pushGraphStack(c,f),t.state++,e.processStack.push({type:"node-parse",parameter:{node:c.node},state:0,values:{}}),m.NODE_NULL_RESULT}case 1:{let f=n;if(f===Z.PARSER_ERROR)return e.popGraphStack(!0),e.processStack.pop(),Z.PARSER_ERROR;let g=c.convert(f,e);if(typeof g=="symbol"){let b=e.getGraphPosition();return e.incidentTrace.push(g.description??"Unknown data convert error",b.graph,b.lineStart,b.columnStart,b.lineEnd,b.columnEnd),e.popGraphStack(!0),e.processStack.pop(),Z.PARSER_ERROR}return e.popGraphStack(!1),e.processStack.pop(),g}}throw new A(`Invalid graph parse state "${t.state}".`,this)}processNodeParseProcess(e,t,n){let c=t.parameter.node;switch(t.state){case 0:return e.processStack.push({type:"node-value-parse",parameter:{node:c,valueIndex:0},state:0,values:{}}),t.state++,m.NODE_NULL_RESULT;case 1:{let f=n;return f===Z.PARSER_ERROR?(e.processStack.pop(),Z.PARSER_ERROR):(t.values.nodeValueResult=f,e.processStack.push({type:"node-next-parse",parameter:{node:c},state:0}),t.state++,m.NODE_NULL_RESULT)}case 2:{let f=n;if(f===Z.PARSER_ERROR)return e.processStack.pop(),Z.PARSER_ERROR;let g=c.mergeData(t.values.nodeValueResult,f);return e.processStack.pop(),g}}throw new A(`Invalid node parse state "${t.state}".`,this)}processNodeValueParseProcess(e,t,n){let c=t.parameter.node;switch(t.state){case 0:{if(n!==m.NODE_NULL_RESULT&&n!==Z.PARSER_ERROR)return t.values.parseResult=n,t.state++,m.NODE_NULL_RESULT;let f=t.parameter.valueIndex,g=c.connections;if(f>=g.values.length)return t.values.parseResult=m.NODE_VALUE_LIST_END_MEET,t.state++,m.NODE_NULL_RESULT;t.parameter.valueIndex++;let b=e.currentToken,I=g.values[f];if(typeof I=="string"){if(!b){if(g.required){let S=e.getTokenPosition();e.incidentTrace.push(`Unexpected end of statement. Token "${I}" expected.`,e.currentGraph,S.lineStart,S.columnStart,S.lineEnd,S.columnEnd)}return m.NODE_NULL_RESULT}if(I!==b.type){if(g.required){let S=e.getTokenPosition();e.incidentTrace.push(`Unexpected token "${b.value}". "${I}" expected`,e.currentGraph,S.lineStart,S.columnStart,S.lineEnd,S.columnEnd)}return m.NODE_NULL_RESULT}return e.moveNextToken(),b.value}else{let S=g.values.length===1||g.values.length===f+1;return e.processStack.push({type:"graph-parse",parameter:{graph:I,linear:S},state:0}),m.NODE_NULL_RESULT}}case 1:{let f=t.values.parseResult,g=c.connections;if(f===m.NODE_VALUE_LIST_END_MEET&&!g.required){e.processStack.pop();return}return f===m.NODE_VALUE_LIST_END_MEET?(e.processStack.pop(),Z.PARSER_ERROR):(e.processStack.pop(),f)}}throw new A(`Invalid node value parse state "${t.state}".`,this)}processStack(e,t,n){switch(t.type){case"graph-parse":return this.processGraphParseProcess(e,t,n);case"node-parse":return this.processNodeParseProcess(e,t,n);case"node-value-parse":return this.processNodeValueParseProcess(e,t,n);case"node-next-parse":return this.processChainedNodeParseProcess(e,t,n)}}};var J=class m{static define(e,t=!1){return new m(e,t)}mDataConverterList;mGraphCollector;mIsJunction;mResolvedGraphNode;get isJunction(){return this.mIsJunction}get node(){return this.mResolvedGraphNode||(this.mResolvedGraphNode=this.mGraphCollector().root),this.mResolvedGraphNode}constructor(e,t){this.mGraphCollector=e,this.mDataConverterList=new Array,this.mResolvedGraphNode=null,this.mIsJunction=t}convert(e,t){if(this.mDataConverterList.length===0)return e;let n=t.getGraphBoundingToken(),c=n[0]??void 0,f=n[1]??void 0;if(this.mDataConverterList.length===1)return this.mDataConverterList[0](e,c,f);let g=e;for(let b of this.mDataConverterList)if(g=b(g,c,f),typeof g=="symbol")return g;return g}converter(e){let t=new m(this.mGraphCollector,this.isJunction);return t.mDataConverterList.push(...this.mDataConverterList,e),t}};var H=class m{static new(){let e=new m("",!1,[]);return e.mRootNode=null,e}mConnections;mIdentifier;mRootNode;get configuration(){return{dataKey:this.mIdentifier.dataKey,isList:this.mIdentifier.type==="list",isRequired:this.mConnections.required,isBranch:this.mConnections.values.length>1}}get connections(){return this.mConnections}get root(){if(!this.mRootNode)throw new A("Staring nodes must be chained with another node to be used.",this);return this.mRootNode}constructor(e,t,n,c){if(e==="")this.mIdentifier={type:"empty",dataKey:"",mergeKey:""};else if(e.endsWith("[]"))this.mIdentifier={type:"list",mergeKey:"",dataKey:e.substring(0,e.length-2)};else if(e.includes("<-")){let g=e.split("<-");this.mIdentifier={type:"merge",dataKey:g[0],mergeKey:g[1]}}else this.mIdentifier={type:"single",mergeKey:"",dataKey:e};let f=n.map(g=>g instanceof m?J.define(()=>g):g);this.mConnections={required:t,values:f,next:null},c?this.mRootNode=c:this.mRootNode=this}mergeData(e,t){if(this.mIdentifier.type==="empty")return t;let n=t,c=typeof e>"u";if(this.mIdentifier.type==="single"){if(this.mIdentifier.dataKey in t)throw new A(`Graph path has a duplicate value identifier "${this.mIdentifier.dataKey}"`,this);return c||(n[this.mIdentifier.dataKey]=e),t}if(this.mIdentifier.type==="list"){let b;c?b=new Array:Array.isArray(e)?b=e:b=[e];let I=(()=>{if(this.mIdentifier.dataKey in t){let S=n[this.mIdentifier.dataKey];return Array.isArray(S)?(S.unshift(...b),S):(b.push(S),b)}return b})();return n[this.mIdentifier.dataKey]=I,t}if(c)return t;let f=(()=>{if(!this.mIdentifier.mergeKey)throw new A("Cant merge data without a merge key.",this);if(typeof e!="object"||e===null)throw new A("Node data must be an object when merge key is set.",this);if(!(this.mIdentifier.mergeKey in e))throw new A(`Node data does not contain merge key "${this.mIdentifier.mergeKey}"`,this);return e[this.mIdentifier.mergeKey]})();if(typeof f>"u")return t;let g=n[this.mIdentifier.dataKey];if(typeof g>"u")return n[this.mIdentifier.dataKey]=f,n;if(!Array.isArray(g))throw new A("Chain data merge value is not an array but should be.",this);return Array.isArray(f)?g.unshift(...f):g.unshift(f),t}optional(e,t){let n=typeof t>"u"?"":e,c=typeof t>"u"?e:t,f=new Array;Array.isArray(c)?f.push(...c):f.push(c);let g=new m(n,!1,f,this.mRootNode);return this.setChainedNode(g),g}required(e,t){let n=typeof t>"u"?"":e,c=typeof t>"u"?e:t,f=new Array;Array.isArray(c)?f.push(...c):f.push(c);let g=new m(n,!0,f,this.mRootNode);return this.setChainedNode(g),g}setChainedNode(e){if(this.mConnections.next!==null)throw new A("Node can only be chained to a single node.",this);this.mConnections.next=e}};var O={XmlIdentifier:"Identifier",XmlAssignment:"XmlAssignment",XmlValue:"XmlValue",XmlComment:"XmlComment",XmlOpenClosingBracket:"XmlOpenClosingBracket",XmlCloseBracket:"XmlCloseBracket",XmlOpenBracket:"XmlOpenBracket",XmlCloseClosingBracket:"XmlCloseClosingBracket",XmlExplicitValueIdentifier:"XmlExplicitValueIdentifier",ExpressionStart:"ExpressionStart",ExpressionEnd:"ExpressionEnd",ExpressionValue:"ExpressionValue",InstructionStart:"InstructionStart",InstructionInstructionValue:"InstructionInstructionValue",InstructionBodyStartBraket:"InstructionBodyStartBraket",InstructionBodyCloseBraket:"InstructionBodyCloseBraket",InstructionInstructionClosingBracket:"InstructionInstructionClosingBracket",InstructionInstructionOpeningBracket:"InstructionInstructionOpeningBracket"};var Dt=class extends it{constructor(){super(),this.validWhitespaces=` 
\r`,this.trimWhitespace=!0;let e=this.createTokenPattern({pattern:{regex:/(?:(?!}}).)*/,type:O.ExpressionValue}}),t=this.createTokenPattern({pattern:{start:{regex:/{{/,type:O.ExpressionStart},end:{regex:/}}/,type:O.ExpressionEnd}}},s=>{s.useChildPattern(e)}),n=this.createTokenPattern({pattern:{regex:/[^>\s\n="/]+/,type:O.XmlIdentifier}}),c=this.createTokenPattern({pattern:{regex:/(?:(?!{{|"|<).)+/,type:O.XmlValue}}),f=this.createTokenPattern({pattern:{regex:/<!--.*?-->/,type:O.XmlComment}}),g=this.createTokenPattern({pattern:{regex:/=/,type:O.XmlAssignment}}),b=this.createTokenPattern({pattern:{start:{regex:/"/,type:O.XmlExplicitValueIdentifier},end:{regex:/"/,type:O.XmlExplicitValueIdentifier}}},s=>{s.useChildPattern(t),s.useChildPattern(c)}),I=this.createTokenPattern({pattern:{start:{regex:/<\//,type:O.XmlOpenClosingBracket},end:{regex:/>/,type:O.XmlCloseBracket}}},s=>{s.useChildPattern(n)}),S=this.createTokenPattern({pattern:{start:{regex:/</,type:O.XmlOpenBracket},end:{regex:/(?<closeClosingBracket>\/>)|(?<closeBracket>>)/,type:{closeClosingBracket:O.XmlCloseClosingBracket,closeBracket:O.XmlCloseBracket}}}},s=>{s.useChildPattern(g),s.useChildPattern(n),s.useChildPattern(b)}),l=this.createTokenPattern({pattern:{regex:/[^()"'`/)]+/,type:O.InstructionInstructionValue}}),o=this.createTokenPattern({pattern:{innerType:O.InstructionInstructionValue,start:{regex:/\//,type:O.InstructionInstructionValue},end:{regex:/\//,type:O.InstructionInstructionValue}}},s=>{s.useChildPattern(a),s.useChildPattern(r),s.useChildPattern(y),s.useChildPattern(u),s.useChildPattern(l)}),u=this.createTokenPattern({pattern:{innerType:O.InstructionInstructionValue,start:{regex:/\(/,type:O.InstructionInstructionValue},end:{regex:/\)/,type:O.InstructionInstructionValue}}},s=>{s.useChildPattern(o),s.useChildPattern(a),s.useChildPattern(r),s.useChildPattern(y),s.useChildPattern(l)}),a=this.createTokenPattern({pattern:{innerType:O.InstructionInstructionValue,start:{regex:/"/,type:O.InstructionInstructionValue},end:{regex:/"/,type:O.InstructionInstructionValue}}},s=>{s.useChildPattern(o),s.useChildPattern(r),s.useChildPattern(y),s.useChildPattern(u),s.useChildPattern(l)}),r=this.createTokenPattern({pattern:{innerType:O.InstructionInstructionValue,start:{regex:/'/,type:O.InstructionInstructionValue},end:{regex:/'/,type:O.InstructionInstructionValue}}},s=>{s.useChildPattern(o),s.useChildPattern(a),s.useChildPattern(y),s.useChildPattern(u),s.useChildPattern(l)}),y=this.createTokenPattern({pattern:{innerType:O.InstructionInstructionValue,start:{regex:/`/,type:O.InstructionInstructionValue},end:{regex:/`/,type:O.InstructionInstructionValue}}},s=>{s.useChildPattern(o),s.useChildPattern(a),s.useChildPattern(r),s.useChildPattern(u),s.useChildPattern(l)}),v=this.createTokenPattern({pattern:{regex:/\$[^(\s\n/{]+/,type:O.InstructionStart}}),T=this.createTokenPattern({pattern:{start:{regex:/\(/,type:O.InstructionInstructionOpeningBracket},end:{regex:/\)/,type:O.InstructionInstructionClosingBracket}}},s=>{s.useChildPattern(o),s.useChildPattern(a),s.useChildPattern(r),s.useChildPattern(y),s.useChildPattern(u),s.useChildPattern(l)}),w=this.createTokenPattern({pattern:{start:{regex:/{/,type:O.InstructionBodyStartBraket},end:{regex:/}/,type:O.InstructionBodyCloseBraket}}},s=>{for(let d of p)s.useChildPattern(d)}),p=[f,I,S,b,t,v,T,w,c];for(let s of p)this.useRootTokenPattern(s)}};var at=class extends st{constructor(){super(new Dt),this.initGraph()}initGraph(){let e=J.define(()=>H.new().required(O.ExpressionStart).optional("value",O.ExpressionValue).required(O.ExpressionEnd)).converter(r=>new de(r.value??"")),t=J.define(()=>{let r=t;return H.new().required("data[]",H.new().required("value",[e,H.new().required("text",O.XmlValue)])).optional("data<-data",r)}),n=J.define(()=>H.new().required("name",O.XmlIdentifier).optional("attributeValue",H.new().required(O.XmlAssignment).required(O.XmlExplicitValueIdentifier).optional("list<-data",t).required(O.XmlExplicitValueIdentifier))).converter(r=>{let y=new Array;if(r.attributeValue?.list)for(let v of r.attributeValue.list)v.value instanceof de?y.push(v.value):y.push(v.value.text);return{name:r.name,values:y}}),c=J.define(()=>{let r=c;return H.new().required("data[]",n).optional("data<-data",r)}),f=J.define(()=>{let r=f;return H.new().required("data[]",H.new().required("value",[e,H.new().required("text",O.XmlValue),H.new().required(O.XmlExplicitValueIdentifier).required("text",O.XmlValue).required(O.XmlExplicitValueIdentifier)])).optional("data<-data",r)}),g=J.define(()=>H.new().required("list<-data",f)).converter(r=>{let y=new we;for(let v of r.list)v.value instanceof de?y.addValue(v.value):y.addValue(v.value.text);return y}),b=J.define(()=>H.new().required(O.XmlComment)).converter(()=>null),I=J.define(()=>H.new().required(O.XmlOpenBracket).required("openingTagName",O.XmlIdentifier).optional("attributes<-data",c).required("closing",[H.new().required(O.XmlCloseClosingBracket),H.new().required(O.XmlCloseBracket).required("values",u).required(O.XmlOpenClosingBracket).required("closingTageName",O.XmlIdentifier).required(O.XmlCloseBracket)])).converter(r=>{if("closingTageName"in r.closing&&r.openingTagName!==r.closing.closingTageName)throw new A(`Opening (${r.openingTagName}) and closing tagname (${r.closing.closingTageName}) does not match`,this);let y=new xe(r.openingTagName);if(r.attributes)for(let v of r.attributes)y.setAttribute(v.name).addValue(...v.values);return"values"in r.closing&&y.appendChild(...r.closing.values),y}),S=J.define(()=>{let r=S;return H.new().required("list[]",O.InstructionInstructionValue).optional("list<-list",r)}),l=J.define(()=>H.new().required("instructionName",O.InstructionStart).optional("instruction",H.new().required(O.InstructionInstructionOpeningBracket).required("value<-list",S).required(O.InstructionInstructionClosingBracket)).optional("body",H.new().required(O.InstructionBodyStartBraket).required("value",u).required(O.InstructionBodyCloseBraket))).converter(r=>{let y=r.instructionName.substring(1),v=r.instruction?.value.join("")??"",T=new Fe(y,v);return r.body&&T.appendChild(...r.body.value),T}),o=J.define(()=>{let r=o;return H.new().required("list[]",[b,I,l,g]).optional("list<-list",r)}),u=J.define(()=>{let r=o;return H.new().optional("list<-list",r)}).converter(r=>{let y=new Array;if(r.list)for(let v of r.list)v!==null&&y.push(v);return y}),a=J.define(()=>H.new().required("content",u)).converter(r=>{let y=new ae;return y.appendChild(...r.content),y});this.setRootGraph(a)}};var re=class m extends bt{static mTemplateCache=new Q;static mXmlParser=new at;mComponentElement;mRootBuilder;get element(){return this.mComponentElement.htmlElement}constructor(e){super({constructor:e.processorConstructor,parent:null}),ie.registerComponent(this,e.htmlElement),this.setProcessorInjection(m,this),this.addConstructionHook(n=>{ie.registerComponent(this,this.mComponentElement.htmlElement,n)}),m.mTemplateCache.has(e.processorConstructor)||m.mTemplateCache.set(e.processorConstructor,m.mXmlParser.parse(e.templateString??""));let t=m.mTemplateCache.get(e.processorConstructor).clone();this.mComponentElement=new nt(e.htmlElement),this.mRootBuilder=new Xe(t,new Et(this,e.expressionModule),new ue(this),"ROOT"),this.mComponentElement.shadowRoot.appendChild(this.mRootBuilder.anchor),this.setProcessorInjection(fe,new fe(this.mRootBuilder.values))}addStyle(e){let t=document.createElement("style");t.innerHTML=e,this.mComponentElement.shadowRoot.prepend(t)}attributeChanged(e,t,n){this.call("onAttributeChange",e,t,n)}connected(){this.call("onConnect")}deconstruct(){this.call("onDeconstruct"),this.mRootBuilder.deconstruct(),super.deconstruct()}disconnected(){this.call("onDisconnect")}onUpdate(){return this.mRootBuilder.update()?(this.call("onUpdate"),!0):!1}};function X(m){return(e,t)=>{$.registerInjectable(e,t.metadata,"instanced"),ie.registerConstructor(e,m.selector);let n=class extends HTMLElement{mComponent;constructor(){super(),this.mComponent=new re({processorConstructor:e,templateString:m.template??null,expressionModule:m.expressionmodule,htmlElement:this}).setup(),m.style&&this.mComponent.addStyle(m.style),this.mComponent.updater.update()}connectedCallback(){this.mComponent.connected()}disconnectedCallback(){this.mComponent.disconnected()}};globalThis.customElements.define(m.selector,n)}}function $e(m){return(e,t)=>{$.registerInjectable(e,t.metadata,"instanced"),se.register(Se,e,{access:m.access,targetRestrictions:m.targetRestrictions})}}function Te(m){return(e,t)=>{$.registerInjectable(e,t.metadata,"instanced"),se.register(me,e,{access:m.access,selector:m.selector})}}function Ee(m){return(e,t)=>{$.registerInjectable(e,t.metadata,"instanced"),se.register(Ae,e,{instructionType:m.instructionType})}}function Da(){function m(l,o){return function(a){t(o,"addInitializer"),n(a,"An initializer"),l.push(a)}}function e(l,o,u,a,r,y,v,T,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+o:o,static:y,private:v,metadata:T},d={v:!1};s.addInitializer=m(a,d);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[o]},h=function(x){this[o]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return l(w,s)}finally{d.v=!0}}function t(l,o){if(l.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(l,o){if(typeof l!="function")throw new TypeError(o+" must be a function")}function c(l,o){var u=typeof o;if(l===1){if(u!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(u!=="function"){var a;throw l===0?a="field":l===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function f(l,o,u,a,r,y,v,T,w){var p=u[0],s,d,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,D;if(typeof p=="function")h=e(p,a,s,T,r,y,v,w,i),h!==void 0&&(c(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,D=h.set||i.set,i={get:x,set:D}):i=h);else for(var _=p.length-1;_>=0;_--){var P=p[_];if(h=e(P,a,s,T,r,y,v,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,D=h.set||i.set,i={get:x,set:D}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(C,E){return E};else if(typeof d!="function"){var M=d;d=function(C,E){for(var R=E,L=0;L<M.length;L++)R=M[L].call(C,R);return R}}else{var j=d;d=function(C,E){return j.call(C,E)}}l.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(l.push(function(C,E){return i.get.call(C,E)}),l.push(function(C,E){return i.set.call(C,E)})):r===2?l.push(i):l.push(function(C,E){return i.call(C,E)}):Object.defineProperty(o,a,s))}function g(l,o,u){for(var a=[],r,y,v=new Map,T=new Map,w=0;w<o.length;w++){var p=o[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,D;if(h?(x=l,s=s-5,y=y||[],D=y):(x=l.prototype,r=r||[],D=r),s!==0&&!i){var _=h?T:v,P=_.get(d)||0;if(P===!0||P===3&&s!==4||P===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!P&&s>2?_.set(d,s):_.set(d,!0)}f(a,x,p,d,s,h,i,D,u)}}return b(a,r),b(a,y),a}function b(l,o){o&&l.push(function(u){for(var a=0;a<o.length;a++)o[a].call(u);return u})}function I(l,o,u){if(o.length>0){for(var a=[],r=l,y=l.name,v=o.length-1;v>=0;v--){var T={v:!1};try{var w=o[v](r,{kind:"class",name:y,addInitializer:m(a,T),metadata:u})}finally{T.v=!0}w!==void 0&&(c(10,w),r=w)}return[S(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function S(l,o){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,u,a,r){if(r!==void 0)var y=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(y===void 0?null:y),T=g(o,u,v);return a.length||S(o,v),{e:T,get c(){return I(o,a,v)}}}}function Qt(m,e,t,n){return(Qt=Da())(m,e,t,n)}function Sa(m){return m}var kt,Kt,lt;kt=$e({access:q.Read,targetRestrictions:[re]});new class extends Sa{constructor(){super(lt),Kt()}static{class m{static{({c:[lt,Kt]}=Qt(this,[],[kt]))}static METADATA_USER_EVENT_LISTENER_PROPERIES="pwb:user_event_listener_properties";mEventListenerList;mTargetElement;constructor(t=$.use(re)){let n=new Array,c=t.processorConstructor;do{let f=te.get(c).getMetadata(m.METADATA_USER_EVENT_LISTENER_PROPERIES);if(f)for(let g of f)n.push(g)}while(c=Object.getPrototypeOf(c));this.mEventListenerList=new Array,this.mTargetElement=t.element;for(let f of n){let[g,b]=f,I=Reflect.get(t.processor,g);I=I.bind(t.processor),this.mEventListenerList.push([b,I]),this.mTargetElement.addEventListener(b,I)}}onDeconstruct(){for(let t of this.mEventListenerList){let[n,c]=t;this.mTargetElement.removeEventListener(n,c)}}}}};var ct=class extends window.Event{mValue;get value(){return this.mValue}constructor(e,t){super(e),this.mValue=t}};var ut=class{mElement;mEventName;constructor(e,t){this.mEventName=e,this.mElement=t}dispatchEvent(e){let t=new ct(this.mEventName,e);this.mElement.dispatchEvent(t)}};function G(m){return(e,t)=>{if(t.static)throw new A("Event target is not for a static property.",G);let n=null;return{get(){if(!n){let c=(()=>{try{return ie.ofProcessor(this).component}catch{throw new A("PwbComponentEvent target class is not a component.",this)}})();n=new ut(m,c.element)}return n}}}}function _a(){function m(l,o){return function(a){t(o,"addInitializer"),n(a,"An initializer"),l.push(a)}}function e(l,o,u,a,r,y,v,T,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+o:o,static:y,private:v,metadata:T},d={v:!1};s.addInitializer=m(a,d);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[o]},h=function(x){this[o]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return l(w,s)}finally{d.v=!0}}function t(l,o){if(l.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(l,o){if(typeof l!="function")throw new TypeError(o+" must be a function")}function c(l,o){var u=typeof o;if(l===1){if(u!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(u!=="function"){var a;throw l===0?a="field":l===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function f(l,o,u,a,r,y,v,T,w){var p=u[0],s,d,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,D;if(typeof p=="function")h=e(p,a,s,T,r,y,v,w,i),h!==void 0&&(c(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,D=h.set||i.set,i={get:x,set:D}):i=h);else for(var _=p.length-1;_>=0;_--){var P=p[_];if(h=e(P,a,s,T,r,y,v,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,D=h.set||i.set,i={get:x,set:D}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(C,E){return E};else if(typeof d!="function"){var M=d;d=function(C,E){for(var R=E,L=0;L<M.length;L++)R=M[L].call(C,R);return R}}else{var j=d;d=function(C,E){return j.call(C,E)}}l.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(l.push(function(C,E){return i.get.call(C,E)}),l.push(function(C,E){return i.set.call(C,E)})):r===2?l.push(i):l.push(function(C,E){return i.call(C,E)}):Object.defineProperty(o,a,s))}function g(l,o,u){for(var a=[],r,y,v=new Map,T=new Map,w=0;w<o.length;w++){var p=o[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,D;if(h?(x=l,s=s-5,y=y||[],D=y):(x=l.prototype,r=r||[],D=r),s!==0&&!i){var _=h?T:v,P=_.get(d)||0;if(P===!0||P===3&&s!==4||P===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!P&&s>2?_.set(d,s):_.set(d,!0)}f(a,x,p,d,s,h,i,D,u)}}return b(a,r),b(a,y),a}function b(l,o){o&&l.push(function(u){for(var a=0;a<o.length;a++)o[a].call(u);return u})}function I(l,o,u){if(o.length>0){for(var a=[],r=l,y=l.name,v=o.length-1;v>=0;v--){var T={v:!1};try{var w=o[v](r,{kind:"class",name:y,addInitializer:m(a,T),metadata:u})}finally{T.v=!0}w!==void 0&&(c(10,w),r=w)}return[S(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function S(l,o){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,u,a,r){if(r!==void 0)var y=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(y===void 0?null:y),T=g(o,u,v);return a.length||S(o,v),{e:T,get c(){return I(o,a,v)}}}}function tr(m,e,t,n){return(tr=_a())(m,e,t,n)}function Pa(m){return m}var rr,er,ht;rr=$e({access:q.ReadWrite,targetRestrictions:[re]});new class extends Pa{constructor(){super(ht),er()}static{class m{static{({c:[ht,er]}=tr(this,[],[rr]))}static METADATA_EXPORTED_PROPERTIES="pwb:exported_properties";mComponent;constructor(t=$.use(re)){this.mComponent=t;let n=new Le,c=t.processorConstructor;do{let g=te.get(c).getMetadata(m.METADATA_EXPORTED_PROPERTIES);g&&n.push(...g)}while(c=Object.getPrototypeOf(c));let f=new Set(n);f.size>0&&this.connectExportedProperties(f)}connectExportedProperties(t){this.exportPropertyAsAttribute(t),this.patchHtmlAttributes(t)}exportPropertyAsAttribute(t){for(let n of t){let c={};c.enumerable=!0,c.configurable=!0,delete c.value,delete c.writable,c.set=f=>{Reflect.set(this.mComponent.processor,n,f)},c.get=()=>{let f=Reflect.get(this.mComponent.processor,n);return typeof f=="function"&&(f=f.bind(this.mComponent.processor)),f},Object.defineProperty(this.mComponent.element,n,c)}}patchHtmlAttributes(t){let n=this.mComponent.element.getAttribute;new MutationObserver(f=>{for(let g of f){let b=g.attributeName,I=n.call(this.mComponent.element,b);Reflect.set(this.mComponent.element,b,I),this.mComponent.attributeChanged(b,g.oldValue,I)}}).observe(this.mComponent.element,{attributeFilter:[...t],attributeOldValue:!0});for(let f of t)if(this.mComponent.element.hasAttribute(f)){let g=n.call(this.mComponent.element,f);this.mComponent.element.setAttribute(f,g)}this.mComponent.element.getAttribute=f=>t.has(f)?Reflect.get(this.mComponent.element,f):n.call(this.mComponent.element,f)}}}};function V(m,e){if(e.static)throw new A("Event target is not for a static property.",V);let t=te.forInternalDecorator(e.metadata),n=t.getMetadata(ht.METADATA_EXPORTED_PROPERTIES)??new Array;n.push(e.name),t.setMetadata(ht.METADATA_EXPORTED_PROPERTIES,n)}function ne(m){return(e,t)=>{if(t.static)throw new A("Child decorator is not for a static property.",ne);return{get(){let f=(()=>{try{return ie.ofProcessor(this).component}catch{throw new A("PwbChild target class is not a component.",this)}})().getProcessorInjection(fe).data.store[m];if(f instanceof Element)return f;throw new A(`Can't find child "${m}".`,this)}}}}function Na(){function m(l,o){return function(a){t(o,"addInitializer"),n(a,"An initializer"),l.push(a)}}function e(l,o,u,a,r,y,v,T,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+o:o,static:y,private:v,metadata:T},d={v:!1};s.addInitializer=m(a,d);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[o]},h=function(x){this[o]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return l(w,s)}finally{d.v=!0}}function t(l,o){if(l.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(l,o){if(typeof l!="function")throw new TypeError(o+" must be a function")}function c(l,o){var u=typeof o;if(l===1){if(u!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(u!=="function"){var a;throw l===0?a="field":l===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function f(l,o,u,a,r,y,v,T,w){var p=u[0],s,d,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,D;if(typeof p=="function")h=e(p,a,s,T,r,y,v,w,i),h!==void 0&&(c(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,D=h.set||i.set,i={get:x,set:D}):i=h);else for(var _=p.length-1;_>=0;_--){var P=p[_];if(h=e(P,a,s,T,r,y,v,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,D=h.set||i.set,i={get:x,set:D}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(C,E){return E};else if(typeof d!="function"){var M=d;d=function(C,E){for(var R=E,L=0;L<M.length;L++)R=M[L].call(C,R);return R}}else{var j=d;d=function(C,E){return j.call(C,E)}}l.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(l.push(function(C,E){return i.get.call(C,E)}),l.push(function(C,E){return i.set.call(C,E)})):r===2?l.push(i):l.push(function(C,E){return i.call(C,E)}):Object.defineProperty(o,a,s))}function g(l,o,u){for(var a=[],r,y,v=new Map,T=new Map,w=0;w<o.length;w++){var p=o[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,D;if(h?(x=l,s=s-5,y=y||[],D=y):(x=l.prototype,r=r||[],D=r),s!==0&&!i){var _=h?T:v,P=_.get(d)||0;if(P===!0||P===3&&s!==4||P===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!P&&s>2?_.set(d,s):_.set(d,!0)}f(a,x,p,d,s,h,i,D,u)}}return b(a,r),b(a,y),a}function b(l,o){o&&l.push(function(u){for(var a=0;a<o.length;a++)o[a].call(u);return u})}function I(l,o,u){if(o.length>0){for(var a=[],r=l,y=l.name,v=o.length-1;v>=0;v--){var T={v:!1};try{var w=o[v](r,{kind:"class",name:y,addInitializer:m(a,T),metadata:u})}finally{T.v=!0}w!==void 0&&(c(10,w),r=w)}return[S(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function S(l,o){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,u,a,r){if(r!==void 0)var y=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(y===void 0?null:y),T=g(o,u,v);return a.length||S(o,v),{e:T,get c(){return I(o,a,v)}}}}function ir(m,e,t,n){return(ir=Na())(m,e,t,n)}var sr,or,Aa;sr=Ee({instructionType:"dynamic-content"});var nr=class{static{({c:[Aa,or]}=ir(this,[],[sr]))}constructor(e=$.use(K),t=$.use(W)){this.mModuleValues=t,this.mLastTemplate=null,this.mProcedure=this.mModuleValues.createExpressionProcedure(e.value)}mLastTemplate;mModuleValues;mProcedure;onUpdate(){let e=this.mProcedure.execute();if(!e||!(e instanceof ae))throw new A("Dynamic content method has a wrong result type.",this);if(this.mLastTemplate!==null&&this.mLastTemplate.equals(e))return null;let t=e.clone();this.mLastTemplate=t;let n=new ce;return n.addElement(t,new ue(this.mModuleValues.data)),n}static{or()}};function Ra(){function m(l,o){return function(a){t(o,"addInitializer"),n(a,"An initializer"),l.push(a)}}function e(l,o,u,a,r,y,v,T,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+o:o,static:y,private:v,metadata:T},d={v:!1};s.addInitializer=m(a,d);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[o]},h=function(x){this[o]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return l(w,s)}finally{d.v=!0}}function t(l,o){if(l.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(l,o){if(typeof l!="function")throw new TypeError(o+" must be a function")}function c(l,o){var u=typeof o;if(l===1){if(u!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(u!=="function"){var a;throw l===0?a="field":l===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function f(l,o,u,a,r,y,v,T,w){var p=u[0],s,d,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,D;if(typeof p=="function")h=e(p,a,s,T,r,y,v,w,i),h!==void 0&&(c(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,D=h.set||i.set,i={get:x,set:D}):i=h);else for(var _=p.length-1;_>=0;_--){var P=p[_];if(h=e(P,a,s,T,r,y,v,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,D=h.set||i.set,i={get:x,set:D}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(C,E){return E};else if(typeof d!="function"){var M=d;d=function(C,E){for(var R=E,L=0;L<M.length;L++)R=M[L].call(C,R);return R}}else{var j=d;d=function(C,E){return j.call(C,E)}}l.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(l.push(function(C,E){return i.get.call(C,E)}),l.push(function(C,E){return i.set.call(C,E)})):r===2?l.push(i):l.push(function(C,E){return i.call(C,E)}):Object.defineProperty(o,a,s))}function g(l,o,u){for(var a=[],r,y,v=new Map,T=new Map,w=0;w<o.length;w++){var p=o[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,D;if(h?(x=l,s=s-5,y=y||[],D=y):(x=l.prototype,r=r||[],D=r),s!==0&&!i){var _=h?T:v,P=_.get(d)||0;if(P===!0||P===3&&s!==4||P===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!P&&s>2?_.set(d,s):_.set(d,!0)}f(a,x,p,d,s,h,i,D,u)}}return b(a,r),b(a,y),a}function b(l,o){o&&l.push(function(u){for(var a=0;a<o.length;a++)o[a].call(u);return u})}function I(l,o,u){if(o.length>0){for(var a=[],r=l,y=l.name,v=o.length-1;v>=0;v--){var T={v:!1};try{var w=o[v](r,{kind:"class",name:y,addInitializer:m(a,T),metadata:u})}finally{T.v=!0}w!==void 0&&(c(10,w),r=w)}return[S(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function S(l,o){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,u,a,r){if(r!==void 0)var y=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(y===void 0?null:y),T=g(o,u,v);return a.length||S(o,v),{e:T,get c(){return I(o,a,v)}}}}function cr(m,e,t,n){return(cr=Ra())(m,e,t,n)}var ur,ar,La;ur=Te({access:q.Write,selector:/^\([[\w\-$]+\)$/});var lr=class{static{({c:[La,ar]}=cr(this,[],[ur]))}constructor(e=$.use(ee),t=$.use(W),n=$.use(le)){this.mTarget=e,this.mEventName=n.name.substring(1,n.name.length-1);let c=t.createExpressionProcedure(n.value,["$event"]);this.mListener=f=>{c.setTemporaryValue("$event",f),c.execute()},this.mTarget.addEventListener(this.mEventName,this.mListener)}mEventName;mListener;mTarget;onDeconstruct(){this.mTarget.removeEventListener(this.mEventName,this.mListener)}static{ar()}};function Ma(){function m(l,o){return function(a){t(o,"addInitializer"),n(a,"An initializer"),l.push(a)}}function e(l,o,u,a,r,y,v,T,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+o:o,static:y,private:v,metadata:T},d={v:!1};s.addInitializer=m(a,d);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[o]},h=function(x){this[o]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return l(w,s)}finally{d.v=!0}}function t(l,o){if(l.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(l,o){if(typeof l!="function")throw new TypeError(o+" must be a function")}function c(l,o){var u=typeof o;if(l===1){if(u!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(u!=="function"){var a;throw l===0?a="field":l===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function f(l,o,u,a,r,y,v,T,w){var p=u[0],s,d,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,D;if(typeof p=="function")h=e(p,a,s,T,r,y,v,w,i),h!==void 0&&(c(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,D=h.set||i.set,i={get:x,set:D}):i=h);else for(var _=p.length-1;_>=0;_--){var P=p[_];if(h=e(P,a,s,T,r,y,v,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,D=h.set||i.set,i={get:x,set:D}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(C,E){return E};else if(typeof d!="function"){var M=d;d=function(C,E){for(var R=E,L=0;L<M.length;L++)R=M[L].call(C,R);return R}}else{var j=d;d=function(C,E){return j.call(C,E)}}l.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(l.push(function(C,E){return i.get.call(C,E)}),l.push(function(C,E){return i.set.call(C,E)})):r===2?l.push(i):l.push(function(C,E){return i.call(C,E)}):Object.defineProperty(o,a,s))}function g(l,o,u){for(var a=[],r,y,v=new Map,T=new Map,w=0;w<o.length;w++){var p=o[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,D;if(h?(x=l,s=s-5,y=y||[],D=y):(x=l.prototype,r=r||[],D=r),s!==0&&!i){var _=h?T:v,P=_.get(d)||0;if(P===!0||P===3&&s!==4||P===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!P&&s>2?_.set(d,s):_.set(d,!0)}f(a,x,p,d,s,h,i,D,u)}}return b(a,r),b(a,y),a}function b(l,o){o&&l.push(function(u){for(var a=0;a<o.length;a++)o[a].call(u);return u})}function I(l,o,u){if(o.length>0){for(var a=[],r=l,y=l.name,v=o.length-1;v>=0;v--){var T={v:!1};try{var w=o[v](r,{kind:"class",name:y,addInitializer:m(a,T),metadata:u})}finally{T.v=!0}w!==void 0&&(c(10,w),r=w)}return[S(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function S(l,o){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,u,a,r){if(r!==void 0)var y=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(y===void 0?null:y),T=g(o,u,v);return a.length||S(o,v),{e:T,get c(){return I(o,a,v)}}}}function mr(m,e,t,n){return(mr=Ma())(m,e,t,n)}var pr,hr,Oa;pr=Ee({instructionType:"for"});var dr=class{static{({c:[Oa,hr]}=mr(this,[],[pr]))}constructor(e=$.use(he),t=$.use(W),n=$.use(K)){this.mTemplate=e,this.mModuleValues=t,this.mLastEntries=new Array;let c=n.value,g=new RegExp(/^\s*([a-zA-Z]+[a-zA-Z0-9]*)\s*of\s+([^;]+)\s*(;\s*([a-zA-Z]+[a-zA-Z0-9]*)\s*=\s*(.*)\s*)?$/).exec(c);if(!g)throw new A(`For-Parameter value has wrong format: ${c}`,this);let b=g[1],I=g[2],S=g[4]??null,l=g[5],o=this.mModuleValues.createExpressionProcedure(I),u=S?this.mModuleValues.createExpressionProcedure(l,["$index",b]):null;this.mExpression={iterateVariableName:b,iterateValueProcedure:o,indexExportVariableName:S,indexExportProcedure:u}}mExpression;mLastEntries;mModuleValues;mTemplate;onUpdate(){let e=new ce,t=this.mExpression.iterateValueProcedure.execute();if(typeof t=="object"&&t!==null||Array.isArray(t)){let n=Symbol.iterator in t?Object.entries([...t]):Object.entries(t);if(this.compareEntries(n,this.mLastEntries))return null;this.mLastEntries=n;for(let[c,f]of n)this.addTemplateForElement(e,this.mExpression,f,c);return e}else return null}addTemplateForElement=(e,t,n,c)=>{let f=new ue(this.mModuleValues.data);if(f.setTemporaryValue(t.iterateVariableName,n),t.indexExportProcedure&&t.indexExportVariableName){t.indexExportProcedure.setTemporaryValue("$index",c),t.indexExportProcedure.setTemporaryValue(t.iterateVariableName,n);let b=t.indexExportProcedure.execute();f.setTemporaryValue(t.indexExportVariableName,b)}let g=new ae;g.appendChild(...this.mTemplate.childList),e.addElement(g,f)};compareEntries(e,t){if(e.length!==t.length)return!1;for(let n=0;n<e.length;n++){let[c,f]=e[n],[g,b]=t[n];if(c!==g||f!==b)return!1}return!0}static{hr()}};function Fa(){function m(l,o){return function(a){t(o,"addInitializer"),n(a,"An initializer"),l.push(a)}}function e(l,o,u,a,r,y,v,T,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+o:o,static:y,private:v,metadata:T},d={v:!1};s.addInitializer=m(a,d);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[o]},h=function(x){this[o]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return l(w,s)}finally{d.v=!0}}function t(l,o){if(l.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(l,o){if(typeof l!="function")throw new TypeError(o+" must be a function")}function c(l,o){var u=typeof o;if(l===1){if(u!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(u!=="function"){var a;throw l===0?a="field":l===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function f(l,o,u,a,r,y,v,T,w){var p=u[0],s,d,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,D;if(typeof p=="function")h=e(p,a,s,T,r,y,v,w,i),h!==void 0&&(c(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,D=h.set||i.set,i={get:x,set:D}):i=h);else for(var _=p.length-1;_>=0;_--){var P=p[_];if(h=e(P,a,s,T,r,y,v,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,D=h.set||i.set,i={get:x,set:D}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(C,E){return E};else if(typeof d!="function"){var M=d;d=function(C,E){for(var R=E,L=0;L<M.length;L++)R=M[L].call(C,R);return R}}else{var j=d;d=function(C,E){return j.call(C,E)}}l.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(l.push(function(C,E){return i.get.call(C,E)}),l.push(function(C,E){return i.set.call(C,E)})):r===2?l.push(i):l.push(function(C,E){return i.call(C,E)}):Object.defineProperty(o,a,s))}function g(l,o,u){for(var a=[],r,y,v=new Map,T=new Map,w=0;w<o.length;w++){var p=o[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,D;if(h?(x=l,s=s-5,y=y||[],D=y):(x=l.prototype,r=r||[],D=r),s!==0&&!i){var _=h?T:v,P=_.get(d)||0;if(P===!0||P===3&&s!==4||P===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!P&&s>2?_.set(d,s):_.set(d,!0)}f(a,x,p,d,s,h,i,D,u)}}return b(a,r),b(a,y),a}function b(l,o){o&&l.push(function(u){for(var a=0;a<o.length;a++)o[a].call(u);return u})}function I(l,o,u){if(o.length>0){for(var a=[],r=l,y=l.name,v=o.length-1;v>=0;v--){var T={v:!1};try{var w=o[v](r,{kind:"class",name:y,addInitializer:m(a,T),metadata:u})}finally{T.v=!0}w!==void 0&&(c(10,w),r=w)}return[S(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function S(l,o){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,u,a,r){if(r!==void 0)var y=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(y===void 0?null:y),T=g(o,u,v);return a.length||S(o,v),{e:T,get c(){return I(o,a,v)}}}}function vr(m,e,t,n){return(vr=Fa())(m,e,t,n)}var yr,fr,Va;yr=Ee({instructionType:"if"});var gr=class{static{({c:[Va,fr]}=vr(this,[],[yr]))}constructor(e=$.use(he),t=$.use(W),n=$.use(K)){this.mTemplateReference=e,this.mModuleValues=t,this.mProcedure=this.mModuleValues.createExpressionProcedure(n.value),this.mLastBoolean=!1}mLastBoolean;mModuleValues;mProcedure;mTemplateReference;onUpdate(){let e=this.mProcedure.execute();if(!!e!==this.mLastBoolean){this.mLastBoolean=!!e;let t=new ce;if(e){let n=new ae;n.appendChild(...this.mTemplateReference.childList),t.addElement(n,new ue(this.mModuleValues.data))}return t}else return null}static{fr()}};function $a(){function m(l,o){return function(a){t(o,"addInitializer"),n(a,"An initializer"),l.push(a)}}function e(l,o,u,a,r,y,v,T,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+o:o,static:y,private:v,metadata:T},d={v:!1};s.addInitializer=m(a,d);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[o]},h=function(x){this[o]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return l(w,s)}finally{d.v=!0}}function t(l,o){if(l.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(l,o){if(typeof l!="function")throw new TypeError(o+" must be a function")}function c(l,o){var u=typeof o;if(l===1){if(u!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(u!=="function"){var a;throw l===0?a="field":l===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function f(l,o,u,a,r,y,v,T,w){var p=u[0],s,d,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,D;if(typeof p=="function")h=e(p,a,s,T,r,y,v,w,i),h!==void 0&&(c(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,D=h.set||i.set,i={get:x,set:D}):i=h);else for(var _=p.length-1;_>=0;_--){var P=p[_];if(h=e(P,a,s,T,r,y,v,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,D=h.set||i.set,i={get:x,set:D}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(C,E){return E};else if(typeof d!="function"){var M=d;d=function(C,E){for(var R=E,L=0;L<M.length;L++)R=M[L].call(C,R);return R}}else{var j=d;d=function(C,E){return j.call(C,E)}}l.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(l.push(function(C,E){return i.get.call(C,E)}),l.push(function(C,E){return i.set.call(C,E)})):r===2?l.push(i):l.push(function(C,E){return i.call(C,E)}):Object.defineProperty(o,a,s))}function g(l,o,u){for(var a=[],r,y,v=new Map,T=new Map,w=0;w<o.length;w++){var p=o[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,D;if(h?(x=l,s=s-5,y=y||[],D=y):(x=l.prototype,r=r||[],D=r),s!==0&&!i){var _=h?T:v,P=_.get(d)||0;if(P===!0||P===3&&s!==4||P===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!P&&s>2?_.set(d,s):_.set(d,!0)}f(a,x,p,d,s,h,i,D,u)}}return b(a,r),b(a,y),a}function b(l,o){o&&l.push(function(u){for(var a=0;a<o.length;a++)o[a].call(u);return u})}function I(l,o,u){if(o.length>0){for(var a=[],r=l,y=l.name,v=o.length-1;v>=0;v--){var T={v:!1};try{var w=o[v](r,{kind:"class",name:y,addInitializer:m(a,T),metadata:u})}finally{T.v=!0}w!==void 0&&(c(10,w),r=w)}return[S(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function S(l,o){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,u,a,r){if(r!==void 0)var y=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(y===void 0?null:y),T=g(o,u,v);return a.length||S(o,v),{e:T,get c(){return I(o,a,v)}}}}function xr(m,e,t,n){return(xr=$a())(m,e,t,n)}var Tr,br,ja;Tr=Te({access:q.Read,selector:/^\[[\w$]+\]$/});var wr=class{static{({c:[ja,br]}=xr(this,[],[Tr]))}constructor(e=$.use(ee),t=$.use(W),n=$.use(le)){this.mTarget=e,this.mProcedure=t.createExpressionProcedure(n.value),this.mTargetProperty=n.name.substring(1,n.name.length-1),this.mLastValue=Symbol("Uncomparable")}mLastValue;mProcedure;mTarget;mTargetProperty;onUpdate(){let e=this.mProcedure.execute();return e===this.mLastValue?!1:(this.mLastValue=e,Reflect.set(this.mTarget,this.mTargetProperty,e),!0)}static{br()}};function za(){function m(l,o){return function(a){t(o,"addInitializer"),n(a,"An initializer"),l.push(a)}}function e(l,o,u,a,r,y,v,T,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+o:o,static:y,private:v,metadata:T},d={v:!1};s.addInitializer=m(a,d);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[o]},h=function(x){this[o]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return l(w,s)}finally{d.v=!0}}function t(l,o){if(l.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(l,o){if(typeof l!="function")throw new TypeError(o+" must be a function")}function c(l,o){var u=typeof o;if(l===1){if(u!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(u!=="function"){var a;throw l===0?a="field":l===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function f(l,o,u,a,r,y,v,T,w){var p=u[0],s,d,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,D;if(typeof p=="function")h=e(p,a,s,T,r,y,v,w,i),h!==void 0&&(c(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,D=h.set||i.set,i={get:x,set:D}):i=h);else for(var _=p.length-1;_>=0;_--){var P=p[_];if(h=e(P,a,s,T,r,y,v,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,D=h.set||i.set,i={get:x,set:D}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(C,E){return E};else if(typeof d!="function"){var M=d;d=function(C,E){for(var R=E,L=0;L<M.length;L++)R=M[L].call(C,R);return R}}else{var j=d;d=function(C,E){return j.call(C,E)}}l.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(l.push(function(C,E){return i.get.call(C,E)}),l.push(function(C,E){return i.set.call(C,E)})):r===2?l.push(i):l.push(function(C,E){return i.call(C,E)}):Object.defineProperty(o,a,s))}function g(l,o,u){for(var a=[],r,y,v=new Map,T=new Map,w=0;w<o.length;w++){var p=o[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,D;if(h?(x=l,s=s-5,y=y||[],D=y):(x=l.prototype,r=r||[],D=r),s!==0&&!i){var _=h?T:v,P=_.get(d)||0;if(P===!0||P===3&&s!==4||P===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!P&&s>2?_.set(d,s):_.set(d,!0)}f(a,x,p,d,s,h,i,D,u)}}return b(a,r),b(a,y),a}function b(l,o){o&&l.push(function(u){for(var a=0;a<o.length;a++)o[a].call(u);return u})}function I(l,o,u){if(o.length>0){for(var a=[],r=l,y=l.name,v=o.length-1;v>=0;v--){var T={v:!1};try{var w=o[v](r,{kind:"class",name:y,addInitializer:m(a,T),metadata:u})}finally{T.v=!0}w!==void 0&&(c(10,w),r=w)}return[S(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function S(l,o){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,u,a,r){if(r!==void 0)var y=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(y===void 0?null:y),T=g(o,u,v);return a.length||S(o,v),{e:T,get c(){return I(o,a,v)}}}}function Ir(m,e,t,n){return(Ir=za())(m,e,t,n)}var Dr,Er,Ga;Dr=Te({access:q.Write,selector:/^#[[\w$]+$/});var Cr=class{static{({c:[Ga,Er]}=Ir(this,[],[Dr]))}constructor(e=$.use(ee),t=$.use(le),n=$.use(fe)){n.setTemporaryValue(t.name.substring(1),e)}static{Er()}};function Ba(){function m(l,o){return function(a){t(o,"addInitializer"),n(a,"An initializer"),l.push(a)}}function e(l,o,u,a,r,y,v,T,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+o:o,static:y,private:v,metadata:T},d={v:!1};s.addInitializer=m(a,d);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[o]},h=function(x){this[o]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return l(w,s)}finally{d.v=!0}}function t(l,o){if(l.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(l,o){if(typeof l!="function")throw new TypeError(o+" must be a function")}function c(l,o){var u=typeof o;if(l===1){if(u!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(u!=="function"){var a;throw l===0?a="field":l===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function f(l,o,u,a,r,y,v,T,w){var p=u[0],s,d,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,D;if(typeof p=="function")h=e(p,a,s,T,r,y,v,w,i),h!==void 0&&(c(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,D=h.set||i.set,i={get:x,set:D}):i=h);else for(var _=p.length-1;_>=0;_--){var P=p[_];if(h=e(P,a,s,T,r,y,v,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,D=h.set||i.set,i={get:x,set:D}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(C,E){return E};else if(typeof d!="function"){var M=d;d=function(C,E){for(var R=E,L=0;L<M.length;L++)R=M[L].call(C,R);return R}}else{var j=d;d=function(C,E){return j.call(C,E)}}l.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(l.push(function(C,E){return i.get.call(C,E)}),l.push(function(C,E){return i.set.call(C,E)})):r===2?l.push(i):l.push(function(C,E){return i.call(C,E)}):Object.defineProperty(o,a,s))}function g(l,o,u){for(var a=[],r,y,v=new Map,T=new Map,w=0;w<o.length;w++){var p=o[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,D;if(h?(x=l,s=s-5,y=y||[],D=y):(x=l.prototype,r=r||[],D=r),s!==0&&!i){var _=h?T:v,P=_.get(d)||0;if(P===!0||P===3&&s!==4||P===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!P&&s>2?_.set(d,s):_.set(d,!0)}f(a,x,p,d,s,h,i,D,u)}}return b(a,r),b(a,y),a}function b(l,o){o&&l.push(function(u){for(var a=0;a<o.length;a++)o[a].call(u);return u})}function I(l,o,u){if(o.length>0){for(var a=[],r=l,y=l.name,v=o.length-1;v>=0;v--){var T={v:!1};try{var w=o[v](r,{kind:"class",name:y,addInitializer:m(a,T),metadata:u})}finally{T.v=!0}w!==void 0&&(c(10,w),r=w)}return[S(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function S(l,o){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,u,a,r){if(r!==void 0)var y=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(y===void 0?null:y),T=g(o,u,v);return a.length||S(o,v),{e:T,get c(){return I(o,a,v)}}}}function Pr(m,e,t,n){return(Pr=Ba())(m,e,t,n)}var Nr,Sr,Ua;Nr=Ee({instructionType:"slot"});var _r=class{static{({c:[Ua,Sr]}=Pr(this,[],[Nr]))}constructor(e=$.use(W),t=$.use(K)){this.mModuleValues=e,this.mSlotName=t.value,this.mIsSetup=!1}mIsSetup;mModuleValues;mSlotName;onUpdate(){if(this.mIsSetup)return null;this.mIsSetup=!0;let e=new xe("slot");this.mSlotName!==""&&e.setAttribute("name").addValue(this.mSlotName);let t=new ae;t.appendChild(e);let n=new ce;return n.addElement(t,this.mModuleValues.data),n}static{Sr()}};function Ha(){function m(l,o){return function(a){t(o,"addInitializer"),n(a,"An initializer"),l.push(a)}}function e(l,o,u,a,r,y,v,T,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+o:o,static:y,private:v,metadata:T},d={v:!1};s.addInitializer=m(a,d);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[o]},h=function(x){this[o]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return l(w,s)}finally{d.v=!0}}function t(l,o){if(l.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(l,o){if(typeof l!="function")throw new TypeError(o+" must be a function")}function c(l,o){var u=typeof o;if(l===1){if(u!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(u!=="function"){var a;throw l===0?a="field":l===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function f(l,o,u,a,r,y,v,T,w){var p=u[0],s,d,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,D;if(typeof p=="function")h=e(p,a,s,T,r,y,v,w,i),h!==void 0&&(c(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,D=h.set||i.set,i={get:x,set:D}):i=h);else for(var _=p.length-1;_>=0;_--){var P=p[_];if(h=e(P,a,s,T,r,y,v,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,D=h.set||i.set,i={get:x,set:D}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(C,E){return E};else if(typeof d!="function"){var M=d;d=function(C,E){for(var R=E,L=0;L<M.length;L++)R=M[L].call(C,R);return R}}else{var j=d;d=function(C,E){return j.call(C,E)}}l.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(l.push(function(C,E){return i.get.call(C,E)}),l.push(function(C,E){return i.set.call(C,E)})):r===2?l.push(i):l.push(function(C,E){return i.call(C,E)}):Object.defineProperty(o,a,s))}function g(l,o,u){for(var a=[],r,y,v=new Map,T=new Map,w=0;w<o.length;w++){var p=o[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,D;if(h?(x=l,s=s-5,y=y||[],D=y):(x=l.prototype,r=r||[],D=r),s!==0&&!i){var _=h?T:v,P=_.get(d)||0;if(P===!0||P===3&&s!==4||P===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!P&&s>2?_.set(d,s):_.set(d,!0)}f(a,x,p,d,s,h,i,D,u)}}return b(a,r),b(a,y),a}function b(l,o){o&&l.push(function(u){for(var a=0;a<o.length;a++)o[a].call(u);return u})}function I(l,o,u){if(o.length>0){for(var a=[],r=l,y=l.name,v=o.length-1;v>=0;v--){var T={v:!1};try{var w=o[v](r,{kind:"class",name:y,addInitializer:m(a,T),metadata:u})}finally{T.v=!0}w!==void 0&&(c(10,w),r=w)}return[S(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function S(l,o){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,u,a,r){if(r!==void 0)var y=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(y===void 0?null:y),T=g(o,u,v);return a.length||S(o,v),{e:T,get c(){return I(o,a,v)}}}}function Lr(m,e,t,n){return(Lr=Ha())(m,e,t,n)}var Mr,Ar,Xa;Mr=Te({access:q.ReadWrite,selector:/^\[\([[\w$]+\)\]$/});var Rr=class{static{({c:[Xa,Ar]}=Lr(this,[],[Mr]))}constructor(e=$.use(re),t=$.use(ee),n=$.use(W),c=$.use(le)){this.mTargetNode=t,this.mAttributeKey=c.name.substring(2,c.name.length-2),this.mReadProcedure=n.createExpressionProcedure(c.value),this.mWriteProcedure=n.createExpressionProcedure(`${c.value} = $DATA;`,["$DATA"]),this.mLastDataValue=Symbol("Uncomparable");let f=g=>{this.mLastDataValue!==g&&e.updater.updateAsync()};this.mTargetNode.addEventListener("input",g=>{f(Reflect.get(this.mTargetNode,this.mAttributeKey))}),this.mTargetNode.addEventListener("change",g=>{f(Reflect.get(this.mTargetNode,this.mAttributeKey))})}mAttributeKey;mLastDataValue;mReadProcedure;mTargetNode;mWriteProcedure;onUpdate(){let e=this.mReadProcedure.execute();if(e!==this.mLastDataValue)return Reflect.set(this.mTargetNode,this.mAttributeKey,e),this.mLastDataValue=e,!0;let t=Reflect.get(this.mTargetNode,this.mAttributeKey);return t!==e?(this.mWriteProcedure.setTemporaryValue("$DATA",t),this.mWriteProcedure.execute(),this.mLastDataValue=t,!0):!1}static{Ar()}};function Ya(){function m(l,o){return function(a){t(o,"addInitializer"),n(a,"An initializer"),l.push(a)}}function e(l,o,u,a,r,y,v,T,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+o:o,static:y,private:v,metadata:T},d={v:!1};s.addInitializer=m(a,d);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[o]},h=function(x){this[o]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return l(w,s)}finally{d.v=!0}}function t(l,o){if(l.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(l,o){if(typeof l!="function")throw new TypeError(o+" must be a function")}function c(l,o){var u=typeof o;if(l===1){if(u!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(u!=="function"){var a;throw l===0?a="field":l===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function f(l,o,u,a,r,y,v,T,w){var p=u[0],s,d,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,D;if(typeof p=="function")h=e(p,a,s,T,r,y,v,w,i),h!==void 0&&(c(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,D=h.set||i.set,i={get:x,set:D}):i=h);else for(var _=p.length-1;_>=0;_--){var P=p[_];if(h=e(P,a,s,T,r,y,v,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,D=h.set||i.set,i={get:x,set:D}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(C,E){return E};else if(typeof d!="function"){var M=d;d=function(C,E){for(var R=E,L=0;L<M.length;L++)R=M[L].call(C,R);return R}}else{var j=d;d=function(C,E){return j.call(C,E)}}l.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(l.push(function(C,E){return i.get.call(C,E)}),l.push(function(C,E){return i.set.call(C,E)})):r===2?l.push(i):l.push(function(C,E){return i.call(C,E)}):Object.defineProperty(o,a,s))}function g(l,o,u){for(var a=[],r,y,v=new Map,T=new Map,w=0;w<o.length;w++){var p=o[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,D;if(h?(x=l,s=s-5,y=y||[],D=y):(x=l.prototype,r=r||[],D=r),s!==0&&!i){var _=h?T:v,P=_.get(d)||0;if(P===!0||P===3&&s!==4||P===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!P&&s>2?_.set(d,s):_.set(d,!0)}f(a,x,p,d,s,h,i,D,u)}}return b(a,r),b(a,y),a}function b(l,o){o&&l.push(function(u){for(var a=0;a<o.length;a++)o[a].call(u);return u})}function I(l,o,u){if(o.length>0){for(var a=[],r=l,y=l.name,v=o.length-1;v>=0;v--){var T={v:!1};try{var w=o[v](r,{kind:"class",name:y,addInitializer:m(a,T),metadata:u})}finally{T.v=!0}w!==void 0&&(c(10,w),r=w)}return[S(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function S(l,o){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,u,a,r){if(r!==void 0)var y=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(y===void 0?null:y),T=g(o,u,v);return a.length||S(o,v),{e:T,get c(){return I(o,a,v)}}}}function Vr(m,e,t,n){return(Vr=Ya())(m,e,t,n)}var $r,Or,Wa;$r=$e({access:q.Read,targetRestrictions:[me]});var Fr=class{static{({c:[Wa,Or]}=Vr(this,[],[$r]))}constructor(e=$.use(me),t=$.use(ee)){let n=new Array,c=e.processorConstructor;do{let f=te.get(c).getMetadata(lt.METADATA_USER_EVENT_LISTENER_PROPERIES);if(f)for(let g of f)n.push(g)}while(c=Object.getPrototypeOf(c));this.mEventListenerList=new Array,this.mTargetElement=t;for(let f of n){let[g,b]=f,I=Reflect.get(e.processor,g);I=I.bind(e.processor),this.mEventListenerList.push([b,I]),this.mTargetElement.addEventListener(b,I)}}mEventListenerList;mTargetElement;onDeconstruct(){for(let e of this.mEventListenerList){let[t,n]=e;this.mTargetElement.removeEventListener(t,n)}}static{Or()}};var Ze=class{mBody;mInputs;mOutputs;get body(){return this.mBody}get inputs(){return this.mInputs}get outputs(){return this.mOutputs}constructor(){this.mInputs=new Map,this.mOutputs=new Map,this.mBody=new Map}generateCode(){return""}buildContext(){let e={};for(let[n,c]of this.mInputs)c.nodeType==="flow"?e[n]={valueId:"",code:{inner:"",next:""}}:e[n]={valueId:c.valueId,code:{inner:"",next:""}};let t={};for(let[n,c]of this.mOutputs)if(c.nodeType==="flow"){let f=this.mBody.get(n);t[n]={valueId:"",code:{inner:f?.code??"",next:""}}}else t[n]={valueId:c.valueId,code:{inner:"",next:""}};return{inputs:e,outputs:t}}};var St=class extends Ze{mCodeGenerator;constructor(e){super(),this.mCodeGenerator=e}generateCode(){return this.mCodeGenerator(this.buildContext())}};var dt=class{bodyCode;imports;inputs;name;outputs;constructor(){this.name="",this.bodyCode="",this.imports=new Array,this.inputs=new Array,this.outputs=new Array}};var _t=class{mProject;constructor(e){this.mProject=e}generate(e){let t=this.findUsedFunctions(e);return""}findUsedFunctions(e){let t=[...e.functions].find(b=>b.isSystem);if(!t)throw new A("No entry point function found for code generation.",this);let n=new Map;for(let b of e.functions)n.set(b.id,b);let c=new Set,f=new Array;f.push(t);let g=new Set;for(g.add(t);f.length>0;){let b=f.pop();c.add(b);for(let I of b.nodes)if(n.has(I.definitionId)){let S=n.get(I.definitionId);g.add(S),c.has(S)||f.push(S)}}return[...g].sort((b,I)=>b.isSystem===I.isSystem?0:b.isSystem?1:-1)}generateFunctionCode(e){let t=this.mProject.getFunction(e.definitionId),n=e.nodes,c=this.buildValueIdMap(n),f=this.generateGraphCode(n,c),g=this.buildCodeFunction(e,n,c,f),b=t?.codeGenerator.body;return b?b(g):f}generateFunctionCodeWithIntermediates(e,t){let n=this.mProject.getFunction(e.definitionId),c=e.nodes,f=this.buildValueIdMap(c),g=this.topologicalSort(c),b=[],I=new Map,S=this.collectFunctionInputs(e,c,f),l=this.collectFunctionOutputs(e,c,f);for(let r of g){let y=r.category;if(y===z.Input||y===z.Output||y===z.Reroute||y===z.Comment)continue;let v=this.buildCodeNode(r,f);if(this.attachFlowBodies(r,v,f),b.push(v.generateCode()),t.has(r)){let T=b.join(`
`),w=new dt;w.name=e.label,w.bodyCode=T;for(let s of e.imports)w.imports.push(s);for(let s of S)w.inputs.push({...s});for(let s of l)w.outputs.push({...s});let p=n?.codeGenerator.body?n.codeGenerator.body(w):T;I.set(r,{intermediateCode:p,context:v.buildContext(),codeFunction:w})}}let o=b.join(`
`),u=this.buildCodeFunction(e,c,f,o);return{fullCode:n?.codeGenerator.body?n.codeGenerator.body(u):o,codeFunction:u,nodeIntermediates:I}}generateProjectCode(e){return[...e.values()].map(t=>this.generateFunctionCode(t)).join(`

`)}buildValueIdMap(e){let t=new Map,n=0;for(let c of e)for(let f of[...c.inputs.values(),...c.outputs.values()])t.set(f,`_v${n++}`);return t}buildCodeFunction(e,t,n,c){let f=new dt;f.name=e.label,f.bodyCode=c;for(let g of e.imports)f.imports.push(g);for(let g of this.collectFunctionInputs(e,t,n))f.inputs.push(g);for(let g of this.collectFunctionOutputs(e,t,n))f.outputs.push(g);return f}collectFunctionInputs(e,t,n){return e.inputs.map(c=>({name:c.label,type:c.dataType,valueId:this.findInputNodeValueId(t,c.label,n)}))}collectFunctionOutputs(e,t,n){return e.outputs.map(c=>({name:c.label,type:c.dataType,valueId:this.findOutputNodeValueId(t,c.label,n)}))}generateGraphCode(e,t){let n=[];for(let c of this.topologicalSort(e)){let f=c.category;if(f===z.Input||f===z.Output||f===z.Reroute||f===z.Comment)continue;let g=this.buildCodeNode(c,t);this.attachFlowBodies(c,g,t),n.push(g.generateCode())}return n.join(`
`)}attachFlowBodies(e,t,n){for(let[c,f]of e.outputs){if(f.portType!=="flow")continue;let g=[...f.connectedPorts][0];t.body.set(c,{code:g?this.generateFlowBodyCode(g,n):""})}}generateFlowBodyCode(e,t){let n=e.node;if(!this.mProject.nodeDefinitions.find(f=>f.id===n.definitionId)&&n.category!=="function")return"";let c=this.buildCodeNode(n,t);return this.attachFlowBodies(n,c,t),c.generateCode()}buildCodeNode(e,t){let c=this.mProject.nodeDefinitions.find(g=>g.id===e.definitionId)?.codeGenerator??(()=>""),f=this.createNodeForCategory(e.category,c);for(let[g,b]of e.inputs)if(b.portType==="value"){let I=[...b.connectedPorts][0],S=I?this.resolveRerouteChain(I,t):t.get(b)??g;f.inputs.set(g,{name:g,type:b.dataType,valueId:S,nodeType:"value"})}else f.inputs.set(g,{name:g,type:"",valueId:"",nodeType:"flow"});for(let[g,b]of e.outputs)b.portType==="value"?f.outputs.set(g,{name:g,type:b.dataType,valueId:t.get(b)??g,nodeType:"value"}):f.outputs.set(g,{name:g,type:"",valueId:"",nodeType:"flow"});return f}createNodeForCategory(e,t){switch(e){case z.Comment:case z.Input:case z.Output:case z.Reroute:return new Ze;default:return new St(t)}}topologicalSort(e){let t=new Set,n=[],c=new Map;for(let g of e)c.set(g,new Set);for(let g of e)for(let b of g.inputs.values())if(b.portType==="value")for(let I of b.connectedPorts)c.get(g)?.add(I.node);let f=g=>{if(!t.has(g)){t.add(g);for(let b of c.get(g)??[])f(b);n.push(g)}};for(let g of e)f(g);return n}findInputNodeValueId(e,t,n){for(let c of e)if(c.category===z.Input&&c.definitionId===t){for(let f of c.outputs.values())if(f.portType==="value")return n.get(f)??t}return t}findOutputNodeValueId(e,t,n){for(let c of e)if(c.category===z.Output&&c.definitionId===t){for(let f of c.inputs.values())if(f.portType==="value"){let g=[...f.connectedPorts][0];return g?this.resolveRerouteChain(g,n):n.get(f)??t}}return t}resolveRerouteChain(e,t){if(e.node.category===z.Reroute){for(let n of e.node.inputs.values())if(n.portType==="value"){let c=[...n.connectedPorts][0];return c?this.resolveRerouteChain(c,t):t.get(n)??""}}return t.get(e)??""}};var mt=class m{static new(e,t){return new m(t)}mId;mLabel;mPreviewGenerator;mStatics;mNodesProvider;mCodeGenerator;get id(){return this.mId}get label(){return this.mLabel}get codeGenerator(){return this.mCodeGenerator}get preview(){return this.mPreviewGenerator}get statics(){return this.mStatics}constructor(e){this.mId=e.id,this.mLabel=e.label,this.mNodesProvider=e.nodes,this.mPreviewGenerator=e.generator.preview??null,this.mStatics=e.statics,this.mCodeGenerator=e.generator.code}getNodeDefinitions(e){if(!this.mNodesProvider.dynamic)return new Array;let t=new Array;return this.mNodesProvider.dynamic(n=>{t.push(n)},e),t}getPrefilledNodes(e){if(this.mNodesProvider.prefilled){let t=new Array;return this.mNodesProvider.prefilled(n=>{t.push(n)},e),t}return new Array}},je={none:0,imports:1,inputs:2,outputs:4};var pt=class{mProject;constructor(e){this.mProject=e}deserialize(e){let t=new Ge(this.mProject);for(let n of e.functions)t.addFunction(this.deserializeFunction(n,t));return t}deserializeFunction(e,t){let n=new ye(this.mProject,t,{definitionId:e.definitionId,id:e.id,label:e.label,isSystem:e.isSystem});for(let f of e.imports)n.addImport(f);for(let f of e.inputs)n.addInput({label:f.label,dataType:f.dataType});for(let f of e.outputs)n.addOutput({label:f.label,dataType:f.dataType});let c=new Map;for(let f of e.nodes){let g=this.deserializeNode(f,n,t);c.set(f.id,g)}for(let f of e.connections){let g=c.get(f.sourceNodeId),b=c.get(f.targetNodeId);if(!g||!b)continue;let I=g.outputs.get(f.sourcePortId),S=b.inputs.get(f.targetPortId);!I||!S||I.connect(S)}return n}deserializeNode(e,t,n){let c=this.mProject.nodeDefinitions.find(g=>g.id===e.definitionId)??n.nodeDefinitions.find(g=>g.id===e.definitionId),f;if(c)f=t.newNode(c,{...e.transformation},e.isSystem);else{let g=e.ports.filter(I=>I.direction==="input").map(I=>({dataType:I.dataType,definitionId:I.definitionId,label:I.label,portType:I.portType})),b=e.ports.filter(I=>I.direction==="output").map(I=>({dataType:I.dataType,definitionId:I.definitionId,label:I.label,portType:I.portType}));f=new ze(this.mProject,n,t,{category:e.category,definitionId:e.definitionId,ports:{input:g,output:b},isSystem:e.isSystem,label:e.label,transformation:{...e.transformation}}),t.addNode(f)}f.label=e.label;for(let g of e.ports)if(g.portType==="value"&&g.directValue.length>0){let b=f.inputs.get(g.definitionId);b&&b.setDirectValue(g.directValue)}return f}};var ft=class{constructor(){}serialize(e){return{functions:[...e.functions].map(t=>this.serializeFunction(t))}}serializeFunction(e){let t=new Map;e.nodes.forEach((b,I)=>{t.set(b,`n${I}`)});let n=[...e.nodes].map(b=>this.serializeNode(b,t.get(b))),c=[];for(let b of e.nodes){let I=t.get(b);for(let S of b.outputs.values())for(let l of S.connectedPorts){let o=t.get(l.node);c.push({sourceNodeId:I,sourcePortId:S.definitionId,targetNodeId:o,targetPortId:l.definitionId})}}let f=e.inputs.map(b=>({label:b.label,dataType:b.dataType})),g=e.outputs.map(b=>({label:b.label,dataType:b.dataType}));return{id:e.id,label:e.label,isSystem:e.isSystem,definitionId:e.definitionId,inputs:f,outputs:g,imports:[...e.imports],nodes:n,connections:c}}serializeNode(e,t){let n=[...e.inputs.values(),...e.outputs.values()].map(c=>({definitionId:c.definitionId,label:c.label,direction:c.direction,portType:c.portType,dataType:c.portType==="value"?c.dataType:null,directValue:[...c.directValue]}));return{id:t,definitionId:e.definitionId,category:e.category,label:e.label,isSystem:e.isSystem,transformation:{...e.transformation},ports:n}}};var Pt=class{mMaxSize;mCurrentIndex;mSnapshots;get canRedo(){return this.mCurrentIndex<this.mSnapshots.length-1}get canUndo(){return this.mCurrentIndex>0}constructor(e=100){this.mSnapshots=new Array,this.mCurrentIndex=-1,this.mMaxSize=e}push(e){this.mSnapshots.splice(this.mCurrentIndex+1),this.mSnapshots.push(e),this.mCurrentIndex=this.mSnapshots.length-1,this.mSnapshots.length>this.mMaxSize&&(this.mSnapshots.shift(),this.mCurrentIndex=this.mSnapshots.length-1)}undo(){return this.canUndo?(this.mCurrentIndex--,this.mSnapshots[this.mCurrentIndex]):null}redo(){return this.canRedo?(this.mCurrentIndex++,this.mSnapshots[this.mCurrentIndex]):null}clear(){this.mSnapshots.length=0,this.mCurrentIndex=-1}};var jr=`:host {\r
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
.preview-wrapper {
    position: absolute;
    bottom: 12px;
    right: 12px;
    z-index: 100;
}

potatno-node-graph {
    flex: 1;
    min-height: 0;
    min-width: 0;
}
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
.panel-right {
    width: var(--pn-panel-width);
    min-width: var(--pn-panel-min-width);
    max-width: var(--pn-panel-max-width);
    background: var(--pn-bg-secondary);
    border-left: 1px solid var(--pn-border-default);\r
    display: flex;\r
    flex-direction: column;\r
    overflow: hidden;
    flex-shrink: 0;
}
`;var zr=`<div class="editor-layout">\r
    <div #panelLeft class="panel-left">\r
        <potatno-panel-left
            [activeFunction]="this.activeFunction"
            [functions]="this.functionList"
            [activeFunctionId]="this.activeFunctionId"
            [userFunctionDefinitions]="this.userFunctionDefinitions"
            [nodeLibraryRefreshVersion]="this.nodeLibraryRefreshVersion"
            (function-select)="this.onFunctionSelect($event)"
            (function-add)="this.onFunctionAdd($event)"
            (function-delete)="this.onFunctionDelete($event)">
        </potatno-panel-left>\r
    </div>\r
    <div #resizeLeft class="resize-handle-left"\r
        (pointerdown)="this.onResizeLeftStart($event)">\r
    </div>
    <div class="center-area">
        <potatno-node-graph
            [activeFunction]="this.activeFunction"
            [refreshVersion]="this.graphRefreshVersion"
            [previewResult]="this.graphPreviewResult"
            [previewUpdateVersion]="this.previewUpdateVersion"
            (graph-change)="this.onGraphChange($event)"
            (open-function)="this.onGraphOpenFunction($event)"
            (undo-request)="this.onGraphUndoRequest($event)"
            (redo-request)="this.onGraphRedoRequest($event)">
        </potatno-node-graph>
        $if(this.hasPreview) {
            <div class="preview-wrapper">
                <potatno-preview #previewEl [errors]="this.editorErrors" [previewContent]="this.entryPreviewElement"></potatno-preview>
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
</div>
`;var Gr=`:host {\r
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
`;var Br=`<div class="function-list-content">\r
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
`;function Qa(){function m(l,o){return function(a){t(o,"addInitializer"),n(a,"An initializer"),l.push(a)}}function e(l,o,u,a,r,y,v,T,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+o:o,static:y,private:v,metadata:T},d={v:!1};s.addInitializer=m(a,d);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[o]},h=function(x){this[o]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return l(w,s)}finally{d.v=!0}}function t(l,o){if(l.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(l,o){if(typeof l!="function")throw new TypeError(o+" must be a function")}function c(l,o){var u=typeof o;if(l===1){if(u!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(u!=="function"){var a;throw l===0?a="field":l===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function f(l,o,u,a,r,y,v,T,w){var p=u[0],s,d,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,D;if(typeof p=="function")h=e(p,a,s,T,r,y,v,w,i),h!==void 0&&(c(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,D=h.set||i.set,i={get:x,set:D}):i=h);else for(var _=p.length-1;_>=0;_--){var P=p[_];if(h=e(P,a,s,T,r,y,v,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,D=h.set||i.set,i={get:x,set:D}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(C,E){return E};else if(typeof d!="function"){var M=d;d=function(C,E){for(var R=E,L=0;L<M.length;L++)R=M[L].call(C,R);return R}}else{var j=d;d=function(C,E){return j.call(C,E)}}l.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(l.push(function(C,E){return i.get.call(C,E)}),l.push(function(C,E){return i.set.call(C,E)})):r===2?l.push(i):l.push(function(C,E){return i.call(C,E)}):Object.defineProperty(o,a,s))}function g(l,o,u){for(var a=[],r,y,v=new Map,T=new Map,w=0;w<o.length;w++){var p=o[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,D;if(h?(x=l,s=s-5,y=y||[],D=y):(x=l.prototype,r=r||[],D=r),s!==0&&!i){var _=h?T:v,P=_.get(d)||0;if(P===!0||P===3&&s!==4||P===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!P&&s>2?_.set(d,s):_.set(d,!0)}f(a,x,p,d,s,h,i,D,u)}}return b(a,r),b(a,y),a}function b(l,o){o&&l.push(function(u){for(var a=0;a<o.length;a++)o[a].call(u);return u})}function I(l,o,u){if(o.length>0){for(var a=[],r=l,y=l.name,v=o.length-1;v>=0;v--){var T={v:!1};try{var w=o[v](r,{kind:"class",name:y,addInitializer:m(a,T),metadata:u})}finally{T.v=!0}w!==void 0&&(c(10,w),r=w)}return[S(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function S(l,o){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,u,a,r){if(r!==void 0)var y=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(y===void 0?null:y),T=g(o,u,v);return a.length||S(o,v),{e:T,get c(){return I(o,a,v)}}}}function kr(m,e,t,n){return(kr=Qa())(m,e,t,n)}var eo,Ur,to,ro,oo,no,io,so,ao,Hr,Xr,Yr,Wr,Zr,qr,Jr,Kr,ka;eo=X({selector:"potatno-function-list",template:Br,style:Gr}),to=F.state(),ro=F.state(),oo=F.state(),no=F.state(),io=G("function-select"),so=G("function-add"),ao=G("function-delete");var Qr=class{static{({e:[Hr,Xr,Yr,Wr,Zr,qr,Jr,Kr],c:[ka,Ur]}=kr(this,[[[V,to],1,"functions"],[[V,ro],1,"activeFunctionId"],[[V,oo],1,"userFunctionDefinitions"],[no,1,"mShowPopup"],[io,1,"mFunctionSelect"],[so,1,"mFunctionAdd"],[ao,1,"mFunctionDelete"]],[eo]))}#e=(Kr(this),Hr(this,[]));get functions(){return this.#e}set functions(e){this.#e=e}#t=Xr(this,"");get activeFunctionId(){return this.#t}set activeFunctionId(e){this.#t=e}#r=Yr(this,[]);get userFunctionDefinitions(){return this.#r}set userFunctionDefinitions(e){this.#r=e}#o=Wr(this,!1);get mShowPopup(){return this.#o}set mShowPopup(e){this.#o=e}#n=Zr(this);get mFunctionSelect(){return this.#n}set mFunctionSelect(e){this.#n=e}#i=qr(this);get mFunctionAdd(){return this.#i}set mFunctionAdd(e){this.#i=e}#s=Jr(this);get mFunctionDelete(){return this.#s}set mFunctionDelete(e){this.#s=e}get hasUserFunctionDefinitions(){return this.userFunctionDefinitions.length>0}get showPopup(){return this.mShowPopup}getEntryClass(e){return e===this.activeFunctionId?"function-entry active":"function-entry"}onFunctionSelect(e){this.mFunctionSelect.dispatchEvent(e)}onAddButtonClick(){this.userFunctionDefinitions.length===1?this.mFunctionAdd.dispatchEvent(this.userFunctionDefinitions[0].id):this.mShowPopup=!this.mShowPopup}onDefinitionSelect(e){this.mShowPopup=!1,this.mFunctionAdd.dispatchEvent(e)}closePopup(){this.mShowPopup=!1}onFunctionDelete(e,t){e.stopPropagation(),this.mFunctionDelete.dispatchEvent(t)}static{Ur()}};var Nt=class m{static MAX_ZOOM=2;static MIN_ZOOM=.25;mGridSize;mPanX;mPanY;mSelectionEnd;mSelectionStart;mZoom;get gridSize(){return this.mGridSize}get panX(){return this.mPanX}get panY(){return this.mPanY}get selectionEnd(){return this.mSelectionEnd}get selectionStart(){return this.mSelectionStart}get zoom(){return this.mZoom}constructor(e=20){this.mGridSize=e,this.mPanX=0,this.mPanY=0,this.mZoom=1,this.mSelectionStart=null,this.mSelectionEnd=null}clearSelection(){this.mSelectionStart=null,this.mSelectionEnd=null}getGridBackgroundCss(){let e=this.mGridSize*this.mZoom,t=this.mPanX%e,n=this.mPanY%e,c=e*5,f=this.mPanX%c,g=this.mPanY%c;return[`background-size: ${e}px ${e}px, ${c}px ${c}px`,`background-position: ${t}px ${n}px, ${f}px ${g}px`,"background-image: radial-gradient(circle, var(--pn-grid-color) 1px, transparent 1px), radial-gradient(circle, var(--pn-grid-color) 1.5px, transparent 1.5px)"].join("; ")}getTransformCss(){return`translate(${this.mPanX}px, ${this.mPanY}px) scale(${this.mZoom})`}pan(e,t){this.mPanX+=e,this.mPanY+=t}screenToWorld(e,t){return{x:(e-this.mPanX)/this.mZoom,y:(t-this.mPanY)/this.mZoom}}setSelectionEnd(e,t){this.mSelectionEnd={x:e,y:t}}setSelectionStart(e,t){this.mSelectionStart={x:e,y:t}}snapToGrid(e,t){return{x:Math.round(e/this.mGridSize)*this.mGridSize,y:Math.round(t/this.mGridSize)*this.mGridSize}}worldToScreen(e,t){return{x:e*this.mZoom+this.mPanX,y:t*this.mZoom+this.mPanY}}zoomAt(e,t,n){let c=this.mZoom,f=1+n,g=this.mZoom*f;g=Math.max(m.MIN_ZOOM,Math.min(m.MAX_ZOOM,g));let b=(e-this.mPanX)/c,I=(t-this.mPanY)/c;this.mZoom=g,this.mPanX=e-b*this.mZoom,this.mPanY=t-I*this.mZoom}};var Gt="http://www.w3.org/2000/svg",Bt="data-temp-connection";var At=class{clearAll(e){let t=e.querySelectorAll("path");for(let n of t)n.remove()}clearTempConnection(e){let t=e.querySelector(`[${Bt}]`);t&&t.remove()}generateBezierPath(e,t,n,c){let f=Math.abs(n-e),g=Math.max(f*.4,50),b=e+g,I=t,S=n-g;return`M ${e} ${t} C ${b} ${I}, ${S} ${c}, ${n} ${c}`}renderConnections(e,t){let n=e.querySelectorAll(`path:not([${Bt}])`);for(let c of n)c.remove();for(let c of t){let f=this.generateBezierPath(c.sourceX,c.sourceY,c.targetX,c.targetY),g=document.createElementNS(Gt,"path");g.setAttribute("d",f),g.setAttribute("fill","none"),g.setAttribute("data-connection-id",c.id),g.setAttribute("data-hit-area","true"),g.style.stroke="transparent",g.style.strokeWidth="12",g.style.pointerEvents="stroke",g.style.cursor="pointer",e.appendChild(g);let b=document.createElementNS(Gt,"path");b.setAttribute("d",f),b.setAttribute("fill","none"),b.setAttribute("data-connection-id",c.id),b.style.stroke=c.valid?"#a6adc8":"#f38ba8",b.style.strokeWidth="2",b.style.pointerEvents="none",c.valid||b.setAttribute("stroke-dasharray","6 3"),e.appendChild(b)}}renderTempConnection(e,t,n,c){this.clearTempConnection(e);let f=document.createElementNS(Gt,"path");f.setAttribute("d",this.generateBezierPath(t.x,t.y,n.x,n.y)),f.setAttribute("fill","none"),f.setAttribute(Bt,"true"),f.style.stroke=c,f.style.strokeWidth="2",f.style.opacity="0.6",f.style.strokeDasharray="8 4",f.style.pointerEvents="none",e.appendChild(f)}};var Rt=class{mData;get hasData(){return this.mData!==null}constructor(){this.mData=null}copy(e){let t=[],n=new Map;for(let g of e)g.isSystem||(n.set(g,t.length),t.push(g));if(t.length===0)return;let c=t.map(g=>{let b={};for(let[I,S]of g.inputs)S.portType==="value"&&S.directValue.length>0&&(b[I]=[...S.directValue]);return{definitionId:g.definitionId,transformation:{...g.transformation},label:g.label,inputDirectValues:b}}),f=[];for(let g of t){let b=n.get(g);for(let[I,S]of g.outputs)for(let l of S.connectedPorts){let o=n.get(l.node);o!==void 0&&f.push({sourceNodeIndex:b,sourcePortName:I,targetNodeIndex:o,targetPortName:l.label})}}this.mData={nodes:c,internalConnections:f}}paste(e,t,n,c){if(!this.mData)return[];let f=[];for(let g of this.mData.nodes){let b=e.project.nodeDefinitions.find(l=>l.id===g.definitionId)??t.nodeDefinitions.find(l=>l.id===g.definitionId);if(!b)continue;let I={x:g.transformation.x+n,y:g.transformation.y+c,width:g.transformation.width,height:g.transformation.height},S=e.newNode(b,I,!1);S.label=g.label;for(let[l,o]of Object.entries(g.inputDirectValues)){let u=S.inputs.get(l);u&&u.setDirectValue(o)}f.push(S)}for(let g of this.mData.internalConnections){let b=f[g.sourceNodeIndex],I=f[g.targetNodeIndex];if(!b||!I)continue;let S=b.outputs.get(g.sourcePortName),l=I.inputs.get(g.targetPortName);S&&l&&S.connect(l)}return f}};var Re=class m{static mListeners=new Set;static mInsertListeners=new Set;static requestInsert(e){for(let t of m.mInsertListeners)t(e)}static startDrag(e){for(let t of m.mListeners)t(e)}static subscribe(e){return m.mListeners.add(e),()=>{m.mListeners.delete(e)}}static subscribeInsert(e){return m.mInsertListeners.add(e),()=>{m.mInsertListeners.delete(e)}}};function qe(m){let e=[],t=new Set;if(!m)return e;let n=f=>{t.has(f.id)||(t.add(f.id),e.push({category:f.category,definition:f,id:f.id,name:f.label}))};for(let f of m.project.nodeDefinitions)n(f);for(let f of m.nodeDefinitions)n(f);let c=new Set(m.imports);for(let f of m.project.imports)if(c.has(f.label))for(let g of f.nodes)n(g);return e}var lo=`:host {
    display: flex;
    flex: 1;
    min-height: 0;
    min-width: 0;
    position: relative;
}

.canvas-wrapper {
    background: var(--pn-bg-primary);
    cursor: default;
    flex: 1;
    min-height: 0;
    min-width: 0;
    overflow: hidden;
    position: relative;
}

.grid-layer {
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    transform-origin: 0 0;
    width: 100%;
}

.svg-layer {
    height: 100%;
    left: 0;
    overflow: visible;
    pointer-events: none;
    position: absolute;
    top: 0;
    width: 100%;
}

.svg-layer path[data-hit-area] {
    pointer-events: stroke;
}

.node-layer {
    left: 0;
    position: absolute;
    top: 0;
}

.node-position {
    position: absolute;
}

.selection-box {
    background: var(--pn-selection-color);
    border: 1px solid var(--pn-accent-primary);
    pointer-events: none;
    position: absolute;
    z-index: 1000;
}

.add-node-popup {
    background: var(--pn-bg-secondary);
    border: 1px solid var(--pn-border-default);
    border-radius: 6px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.28);
    display: flex;
    flex-direction: column;
    max-height: 320px;
    overflow: hidden;
    position: absolute;
    width: 280px;
    z-index: 1500;
}

.add-node-search {
    background: var(--pn-bg-surface);
    border: none;
    border-bottom: 1px solid var(--pn-border-default);
    color: var(--pn-text-primary);
    font-family: var(--pn-font-family);
    font-size: var(--pn-font-size);
    outline: none;
    padding: 8px 10px;
    width: 100%;
}

.add-node-search:focus {
    border-bottom-color: var(--pn-accent-primary);
}

.add-node-results {
    max-height: 280px;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 4px 0;
}

.add-node-result {
    align-items: center;
    background: transparent;
    border: none;
    color: var(--pn-text-primary);
    cursor: pointer;
    display: flex;
    font-family: var(--pn-font-family);
    font-size: var(--pn-font-size);
    min-height: 28px;
    padding: 6px 10px;
    text-align: left;
    width: 100%;
}

.add-node-result:hover,
.add-node-result.selected {
    background: var(--pn-bg-elevated);
}

.add-node-empty {
    color: var(--pn-text-muted);
    font-family: var(--pn-font-family);
    font-size: var(--pn-font-size-sm);
    padding: 14px 10px;
    text-align: center;
}

.library-drag-indicator {
    background: var(--pn-bg-elevated);
    border: 1px solid var(--pn-accent-primary);
    border-radius: 4px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.24);
    color: var(--pn-text-primary);
    font-family: var(--pn-font-family);
    font-size: var(--pn-font-size);
    max-width: 220px;
    overflow: hidden;
    padding: 6px 10px;
    pointer-events: none;
    position: fixed;
    text-overflow: ellipsis;
    top: 0;
    transform: translate(12px, 12px);
    white-space: nowrap;
    z-index: 3000;
}
`;var co=`<div #canvasWrapper class="canvas-wrapper"
    [style]="this.gridBackgroundStyle"
    (pointerdown)="this.onCanvasPointerDown($event)"
    (wheel)="this.onCanvasWheel($event)"
    (contextmenu)="this.onContextMenu($event)">
    <div #gridLayer class="grid-layer" [style]="this.gridTransformStyle">
        <svg #svgLayer class="svg-layer" xmlns="http://www.w3.org/2000/svg"></svg>
        <div class="node-layer">
            $for(nodeState of this.visibleNodes) {
                <div class="node-position" style="left:{{this.nodeState.pixelX}}px;top:{{this.nodeState.pixelY}}px;width:{{this.nodeState.pixelW}}px">
                    <potatno-node
                        [nodeData]="this.nodeState.node"
                        [selected]="this.nodeState.selected"
                        [gridSize]="this.gridSize"
                        [connectionVersion]="this.nodeState.connectionVersion"
                        [previewElement]="this.getPreviewElementForNode(this.nodeState.node)"
                        (pointerdown)="this.onNodePointerDown($event, this.nodeState.node)"
                        (port-drag-start)="this.onPortDragStart($event)"
                        (port-hover)="this.onPortHover($event)"
                        (port-leave)="this.onPortLeave()"
                        (port-element-ready)="this.onPortElementReady($event)"
                        (resize-start)="this.onNodeResizeStart($event)"
                        (comment-change)="this.onCommentChange($event)"
                        (open-function)="this.onOpenFunction($event)"
                        (direct-value-change)="this.onDirectValueChange($event)">
                    </potatno-node>
                </div>
            }
        </div>
    </div>
    $if(this.showSelectionBox) {
        <div class="selection-box" [style]="this.selectionBoxStyle"></div>
    }
    $if(this.showAddNodePopup) {
        <div class="add-node-popup" [style]="this.addNodePopupStyle" (pointerdown)="this.onAddNodePopupPointerDown($event)">
            <input class="add-node-search" type="text" placeholder="Search nodes..." [value]="this.addNodeSearchValue" (input)="this.onAddNodeSearchInput($event)" (keydown)="this.onAddNodeSearchKeyDown($event)" />
            <div class="add-node-results">
                $for(entry of this.addNodeResults) {
                    <button [className]="this.getAddNodeEntryClass(this.entry)" (pointerdown)="this.onAddNodeEntryPointerDown($event, this.entry)">
                        <span>{{this.entry.name}}</span>
                    </button>
                }
                $if(this.addNodeResults.length === 0) {
                    <div class="add-node-empty">No matching nodes found.</div>
                }
            </div>
        </div>
    }
</div>
$if(this.hasLibraryDragIndicator) {
    <div class="library-drag-indicator" [style]="this.libraryDragIndicatorStyle">
        {{this.libraryDragLabel}}
    </div>
}
`;var uo=`:host {\r
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
`;var ho=`$if(this.nodeData) {
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
                        (direct-value-change)="this.onDirectValueChange($event)"
                        (port-element-ready)="this.onPortElementReady($event)">
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
                        (direct-value-change)="this.onDirectValueChange($event)"
                        (port-element-ready)="this.onPortElementReady($event)">
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
                <span class="node-icon">{{this.categoryIcon}}</span>
                <span class="node-label">{{this.nodeName}}</span>
                $if(this.showOpenButton) {
                    <button class="open-function-btn"
                            (click)="this.onOpenFunction($event)">
                        open
                    </button>
                }
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
                            (direct-value-change)="this.onDirectValueChange($event)"
                            (port-element-ready)="this.onPortElementReady($event)">
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
                            (direct-value-change)="this.onDirectValueChange($event)"
                            (port-element-ready)="this.onPortElementReady($event)">
                        </potatno-port>
                    }
                </div>
            </div>
            <div class="node-preview" #NodePreview></div>
        </div>
    }
    }
}
`;var mo=`:host {\r
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
`;var po=`<div [className]="this.portWrapperClasses" [title]="this.portTypeLabel" style="--port-color: {{this.portColor}}">
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
`;function sl(){function m(l,o){return function(a){t(o,"addInitializer"),n(a,"An initializer"),l.push(a)}}function e(l,o,u,a,r,y,v,T,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+o:o,static:y,private:v,metadata:T},d={v:!1};s.addInitializer=m(a,d);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[o]},h=function(x){this[o]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return l(w,s)}finally{d.v=!0}}function t(l,o){if(l.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(l,o){if(typeof l!="function")throw new TypeError(o+" must be a function")}function c(l,o){var u=typeof o;if(l===1){if(u!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(u!=="function"){var a;throw l===0?a="field":l===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function f(l,o,u,a,r,y,v,T,w){var p=u[0],s,d,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,D;if(typeof p=="function")h=e(p,a,s,T,r,y,v,w,i),h!==void 0&&(c(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,D=h.set||i.set,i={get:x,set:D}):i=h);else for(var _=p.length-1;_>=0;_--){var P=p[_];if(h=e(P,a,s,T,r,y,v,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,D=h.set||i.set,i={get:x,set:D}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(C,E){return E};else if(typeof d!="function"){var M=d;d=function(C,E){for(var R=E,L=0;L<M.length;L++)R=M[L].call(C,R);return R}}else{var j=d;d=function(C,E){return j.call(C,E)}}l.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(l.push(function(C,E){return i.get.call(C,E)}),l.push(function(C,E){return i.set.call(C,E)})):r===2?l.push(i):l.push(function(C,E){return i.call(C,E)}):Object.defineProperty(o,a,s))}function g(l,o,u){for(var a=[],r,y,v=new Map,T=new Map,w=0;w<o.length;w++){var p=o[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,D;if(h?(x=l,s=s-5,y=y||[],D=y):(x=l.prototype,r=r||[],D=r),s!==0&&!i){var _=h?T:v,P=_.get(d)||0;if(P===!0||P===3&&s!==4||P===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!P&&s>2?_.set(d,s):_.set(d,!0)}f(a,x,p,d,s,h,i,D,u)}}return b(a,r),b(a,y),a}function b(l,o){o&&l.push(function(u){for(var a=0;a<o.length;a++)o[a].call(u);return u})}function I(l,o,u){if(o.length>0){for(var a=[],r=l,y=l.name,v=o.length-1;v>=0;v--){var T={v:!1};try{var w=o[v](r,{kind:"class",name:y,addInitializer:m(a,T),metadata:u})}finally{T.v=!0}w!==void 0&&(c(10,w),r=w)}return[S(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function S(l,o){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,u,a,r){if(r!==void 0)var y=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(y===void 0?null:y),T=g(o,u,v);return a.length||S(o,v),{e:T,get c(){return I(o,a,v)}}}}function So(m,e,t,n){return(So=sl())(m,e,t,n)}var _o,fo,Po,No,Ao,Ro,Lo,Mo,Oo,Fo,Vo,go,vo,yo,bo,wo,xo,To,Eo,Co,Io,al;_o=X({selector:"potatno-port",template:po,style:mo}),Po=F.state(),No=F.state(),Ao=F.state(),Ro=G("port-drag-start"),Lo=G("port-hover"),Mo=G("port-leave"),Oo=G("direct-value-change"),Fo=G("port-element-ready"),Vo=ne("portCircle");var Do=class{static{({e:[go,vo,yo,bo,wo,xo,To,Eo,Co,Io],c:[al,fo]}=So(this,[[[V,Po],1,"port"],[[V,No],1,"portVersion"],[[V,Ao],1,"ownerNode"],[Ro,1,"mPortDragStart"],[Lo,1,"mPortHover"],[Mo,1,"mPortLeave"],[Oo,1,"mDirectValueChange"],[Fo,1,"mPortElementReady"],[Vo,1,"portCircleElement"]],[_o]))}#e=(Io(this),go(this,null));get port(){return this.#e}set port(e){this.#e=e}#t=vo(this,0);get portVersion(){return this.#t}set portVersion(e){this.#t=e}#r=yo(this,null);get ownerNode(){return this.#r}set ownerNode(e){this.#r=e}#o=bo(this);get mPortDragStart(){return this.#o}set mPortDragStart(e){this.#o=e}#n=wo(this);get mPortHover(){return this.#n}set mPortHover(e){this.#n=e}#i=xo(this);get mPortLeave(){return this.#i}set mPortLeave(e){this.#i=e}#s=To(this);get mDirectValueChange(){return this.#s}set mDirectValueChange(e){this.#s=e}#a=Eo(this);get mPortElementReady(){return this.#a}set mPortElementReady(e){this.#a=e}#l=Co(this);get portCircleElement(){return this.#l}set portCircleElement(e){this.#l=e}mLastRegisteredPort=null;get portName(){return this.port?.label??""}get portTypeLabel(){return this.port?.dataType??""}get portWrapperClasses(){return`port-wrapper ${this.port?.direction==="output"?"direction-output":"direction-input"}`}get portCircleClasses(){if(!this.port)return"port-circle disconnected direction-input";let e=["port-circle"];return e.push(this.port.connectedPorts.size>0?"connected":"disconnected"),e.push(this.port.direction==="output"?"direction-output":"direction-input"),e.join(" ")}get portColor(){if(!this.port||this.port.portType==="flow")return"var(--pn-text-primary)";if(this.port.node.project.types.isGenericType(this.port.dataType)){if(this.port.connectedPorts.size>0){let e=[...this.port.connectedPorts][0];return this.getTypeColor(e.dataType)}return"var(--pn-text-muted)"}return this.getTypeColor(this.port.dataType)}get showDirectValueInput(){return this.portVersion,this.port?this.port.portType==="value"&&this.port.direction==="input"&&this.port.connectedPorts.size===0&&!this.port.node.project.types.isGenericType(this.port.dataType):!1}get directValueInputDefs(){return!this.port||this.port.portType!=="value"?[]:this.port.node.project.types.isGenericType(this.port.dataType)?[]:this.port.project.types.getType(this.port.dataType).inputs.map((t,n)=>({htmlType:t.type==="number"?"number":t.type==="boolean"?"checkbox":"text",index:n,name:t.name,value:this.port.directValue[n]??""}))}onUpdate(){if(!this.port||!this.ownerNode||this.port===this.mLastRegisteredPort)return;let e;try{e=this.portCircleElement}catch{return}this.mLastRegisteredPort=this.port,this.mPortElementReady.dispatchEvent({node:this.ownerNode,port:this.port,element:e})}onPointerDown(e){e.stopPropagation(),e.preventDefault(),!(!this.port||!this.ownerNode)&&this.mPortDragStart.dispatchEvent({node:this.ownerNode,port:this.port,element:this.portCircleElement})}onPointerEnter(e){!this.port||!this.ownerNode||this.mPortHover.dispatchEvent({node:this.ownerNode,port:this.port,element:this.portCircleElement})}onPointerLeave(e){this.mPortLeave.dispatchEvent(void 0)}onDirectValueInput(e,t){if(!this.port)return;let n=e.target,c=[...this.port.directValue];c[t]=n.type==="checkbox"?n.checked?"true":"false":n.value,this.port.setDirectValue(c),this.mDirectValueChange.dispatchEvent({port:this.port,values:c})}getTypeColor(e){let t=0;for(let c=0;c<e.length;c++)t=e.charCodeAt(c)+((t<<5)-t);return`hsl(${Math.abs(t)*137.508%360}, 70%, 60%)`}static{fo()}};function ll(){function m(l,o){return function(a){t(o,"addInitializer"),n(a,"An initializer"),l.push(a)}}function e(l,o,u,a,r,y,v,T,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+o:o,static:y,private:v,metadata:T},d={v:!1};s.addInitializer=m(a,d);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[o]},h=function(x){this[o]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return l(w,s)}finally{d.v=!0}}function t(l,o){if(l.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(l,o){if(typeof l!="function")throw new TypeError(o+" must be a function")}function c(l,o){var u=typeof o;if(l===1){if(u!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(u!=="function"){var a;throw l===0?a="field":l===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function f(l,o,u,a,r,y,v,T,w){var p=u[0],s,d,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,D;if(typeof p=="function")h=e(p,a,s,T,r,y,v,w,i),h!==void 0&&(c(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,D=h.set||i.set,i={get:x,set:D}):i=h);else for(var _=p.length-1;_>=0;_--){var P=p[_];if(h=e(P,a,s,T,r,y,v,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,D=h.set||i.set,i={get:x,set:D}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(C,E){return E};else if(typeof d!="function"){var M=d;d=function(C,E){for(var R=E,L=0;L<M.length;L++)R=M[L].call(C,R);return R}}else{var j=d;d=function(C,E){return j.call(C,E)}}l.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(l.push(function(C,E){return i.get.call(C,E)}),l.push(function(C,E){return i.set.call(C,E)})):r===2?l.push(i):l.push(function(C,E){return i.call(C,E)}):Object.defineProperty(o,a,s))}function g(l,o,u){for(var a=[],r,y,v=new Map,T=new Map,w=0;w<o.length;w++){var p=o[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,D;if(h?(x=l,s=s-5,y=y||[],D=y):(x=l.prototype,r=r||[],D=r),s!==0&&!i){var _=h?T:v,P=_.get(d)||0;if(P===!0||P===3&&s!==4||P===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!P&&s>2?_.set(d,s):_.set(d,!0)}f(a,x,p,d,s,h,i,D,u)}}return b(a,r),b(a,y),a}function b(l,o){o&&l.push(function(u){for(var a=0;a<o.length;a++)o[a].call(u);return u})}function I(l,o,u){if(o.length>0){for(var a=[],r=l,y=l.name,v=o.length-1;v>=0;v--){var T={v:!1};try{var w=o[v](r,{kind:"class",name:y,addInitializer:m(a,T),metadata:u})}finally{T.v=!0}w!==void 0&&(c(10,w),r=w)}return[S(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function S(l,o){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,u,a,r){if(r!==void 0)var y=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(y===void 0?null:y),T=g(o,u,v);return a.length||S(o,v),{e:T,get c(){return I(o,a,v)}}}}function on(m,e,t,n){return(on=ll())(m,e,t,n)}var nn,$o,sn,an,ln,cn,un,hn,dn,mn,pn,fn,gn,vn,yn,bn,wn,jo,zo,Go,Bo,Uo,Ho,Xo,Yo,Wo,Zo,qo,Jo,Ko,Qo,ko,en,tn,cl;nn=X({selector:"potatno-node",template:ho,style:uo}),sn=F.state(),an=F.state(),ln=F.state(),cn=F.state(),un=ne("NodePreview"),hn=G("node-select"),dn=G("node-drag-start"),mn=G("port-drag-start"),pn=G("port-hover"),fn=G("port-leave"),gn=G("open-function"),vn=G("comment-change"),yn=G("resize-start"),bn=G("direct-value-change"),wn=G("port-element-ready");var rn=class{static{({e:[jo,zo,Go,Bo,Uo,Ho,Xo,Yo,Wo,Zo,qo,Jo,Ko,Qo,ko,en,tn],c:[cl,$o]}=on(this,[[[V,sn],1,"nodeData"],[[V,an],1,"connectionVersion"],[[V,ln],1,"selected"],[[V,cn],1,"gridSize"],[un,1,"mPreviewContainer"],[hn,1,"mNodeSelect"],[dn,1,"mNodeDragStart"],[mn,1,"mPortDragStart"],[pn,1,"mPortHover"],[fn,1,"mPortLeave"],[gn,1,"mOpenFunction"],[vn,1,"mCommentChange"],[yn,1,"mResizeStart"],[bn,1,"mDirectValueChange"],[wn,1,"mPortElementReady"],[V,0,"previewElement"]],[nn]))}#e=(tn(this),jo(this,null));get nodeData(){return this.#e}set nodeData(e){this.#e=e}#t=zo(this,0);get connectionVersion(){return this.#t}set connectionVersion(e){this.#t=e}#r=Go(this,!1);get selected(){return this.#r}set selected(e){this.#r=e}#o=Bo(this,20);get gridSize(){return this.#o}set gridSize(e){this.#o=e}previewElement=en(this,null);#n=Uo(this);get mPreviewContainer(){return this.#n}set mPreviewContainer(e){this.#n=e}#i=Ho(this);get mNodeSelect(){return this.#i}set mNodeSelect(e){this.#i=e}#s=Xo(this);get mNodeDragStart(){return this.#s}set mNodeDragStart(e){this.#s=e}#a=Yo(this);get mPortDragStart(){return this.#a}set mPortDragStart(e){this.#a=e}#l=Wo(this);get mPortHover(){return this.#l}set mPortHover(e){this.#l=e}#c=Zo(this);get mPortLeave(){return this.#c}set mPortLeave(e){this.#c=e}#u=qo(this);get mOpenFunction(){return this.#u}set mOpenFunction(e){this.#u=e}#h=Jo(this);get mCommentChange(){return this.#h}set mCommentChange(e){this.#h=e}#d=Ko(this);get mResizeStart(){return this.#d}set mResizeStart(e){this.#d=e}#m=Qo(this);get mDirectValueChange(){return this.#m}set mDirectValueChange(e){this.#m=e}#p=ko(this);get mPortElementReady(){return this.#p}set mPortElementReady(e){this.#p=e}get selectedClass(){return this.selected?"selected":""}get isComment(){return this.nodeData?.category===z.Comment}get isReroute(){return this.nodeData?.category===z.Reroute}get isFunction(){return this.nodeData?.category===z.Function}get showOpenButton(){return this.nodeData?this.isFunction&&!this.nodeData.isSystem:!1}get categoryColor(){return this.nodeData?Me.get(this.nodeData.category).cssColor:""}get categoryIcon(){return this.nodeData?Me.get(this.nodeData.category).icon:""}get nodeLabel(){return this.nodeData?.label??""}get nodeName(){if(!this.nodeData)return"";let e=this.nodeData;return e.project.nodeDefinitions.find(n=>n.id===e.definitionId)?.label??e.label}get commentSizeStyle(){return this.nodeData?`height: ${this.nodeData.transformation.height*this.gridSize}px;`:""}get inputPorts(){return this.nodeData?[...this.nodeData.inputs.values()]:[]}get outputPorts(){return this.nodeData?[...this.nodeData.outputs.values()]:[]}onUpdate(){let e=this.previewElement;if(!e)return;let t;try{t=this.mPreviewContainer}catch{return}e.parentElement!==t&&(t.innerHTML="",t.appendChild(e))}onNodePointerDown(e){e.target.tagName?.toLowerCase()!=="potatno-port"&&this.nodeData&&(this.mNodeSelect.dispatchEvent({node:this.nodeData,shiftKey:e.shiftKey}),this.mNodeDragStart.dispatchEvent({node:this.nodeData,startX:e.clientX,startY:e.clientY}))}onPortDragStart(e){this.mPortDragStart.dispatchEvent(e.value)}onPortHover(e){this.mPortHover.dispatchEvent(e.value)}onPortLeave(e){this.mPortLeave.dispatchEvent(void 0)}onDirectValueChange(e){this.mDirectValueChange.dispatchEvent(e.value)}onPortElementReady(e){this.mPortElementReady.dispatchEvent(e.value)}onOpenFunction(e){e.stopPropagation(),this.nodeData&&this.mOpenFunction.dispatchEvent({node:this.nodeData})}onCommentInput(e){let t=e.target;this.nodeData&&(this.nodeData.label=t.value,this.mCommentChange.dispatchEvent({node:this.nodeData,text:t.value}))}onResizeStart(e){e.stopPropagation(),e.preventDefault(),this.nodeData&&this.mResizeStart.dispatchEvent({node:this.nodeData,startX:e.clientX,startY:e.clientY})}static{$o()}};function ul(){function m(l,o){return function(a){t(o,"addInitializer"),n(a,"An initializer"),l.push(a)}}function e(l,o,u,a,r,y,v,T,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+o:o,static:y,private:v,metadata:T},d={v:!1};s.addInitializer=m(a,d);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[o]},h=function(x){this[o]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return l(w,s)}finally{d.v=!0}}function t(l,o){if(l.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(l,o){if(typeof l!="function")throw new TypeError(o+" must be a function")}function c(l,o){var u=typeof o;if(l===1){if(u!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(u!=="function"){var a;throw l===0?a="field":l===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function f(l,o,u,a,r,y,v,T,w){var p=u[0],s,d,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,D;if(typeof p=="function")h=e(p,a,s,T,r,y,v,w,i),h!==void 0&&(c(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,D=h.set||i.set,i={get:x,set:D}):i=h);else for(var _=p.length-1;_>=0;_--){var P=p[_];if(h=e(P,a,s,T,r,y,v,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,D=h.set||i.set,i={get:x,set:D}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(C,E){return E};else if(typeof d!="function"){var M=d;d=function(C,E){for(var R=E,L=0;L<M.length;L++)R=M[L].call(C,R);return R}}else{var j=d;d=function(C,E){return j.call(C,E)}}l.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(l.push(function(C,E){return i.get.call(C,E)}),l.push(function(C,E){return i.set.call(C,E)})):r===2?l.push(i):l.push(function(C,E){return i.call(C,E)}):Object.defineProperty(o,a,s))}function g(l,o,u){for(var a=[],r,y,v=new Map,T=new Map,w=0;w<o.length;w++){var p=o[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,D;if(h?(x=l,s=s-5,y=y||[],D=y):(x=l.prototype,r=r||[],D=r),s!==0&&!i){var _=h?T:v,P=_.get(d)||0;if(P===!0||P===3&&s!==4||P===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!P&&s>2?_.set(d,s):_.set(d,!0)}f(a,x,p,d,s,h,i,D,u)}}return b(a,r),b(a,y),a}function b(l,o){o&&l.push(function(u){for(var a=0;a<o.length;a++)o[a].call(u);return u})}function I(l,o,u){if(o.length>0){for(var a=[],r=l,y=l.name,v=o.length-1;v>=0;v--){var T={v:!1};try{var w=o[v](r,{kind:"class",name:y,addInitializer:m(a,T),metadata:u})}finally{T.v=!0}w!==void 0&&(c(10,w),r=w)}return[S(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function S(l,o){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,u,a,r){if(r!==void 0)var y=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(y===void 0?null:y),T=g(o,u,v);return a.length||S(o,v),{e:T,get c(){return I(o,a,v)}}}}function Fn(m,e,t,n){return(Fn=ul())(m,e,t,n)}var Vn,xn,$n,jn,zn,Gn,Bn,Un,Hn,Xn,Yn,Wn,Zn,qn,Tn,En,Cn,In,Dn,Sn,_n,Pn,Nn,An,Rn,Ln,Mn,hl;Vn=X({selector:"potatno-node-graph",template:co,style:lo}),$n=F.state({complexValue:!0}),jn=F.state(),zn=F.state(),Gn=F.state({complexValue:!0}),Bn=F.state({complexValue:!0}),Un=F.state({complexValue:!0}),Hn=ne("svgLayer"),Xn=ne("canvasWrapper"),Yn=G("graph-change"),Wn=G("open-function"),Zn=G("undo-request"),qn=G("redo-request");var On=class{static{({e:[Tn,En,Cn,In,Dn,Sn,_n,Pn,Nn,An,Rn,Ln,Mn],c:[hl,xn]}=Fn(this,[[$n,1,"mCachedGraphData"],[jn,1,"mTransformVersion"],[zn,1,"mShowSelectionBox"],[Gn,1,"mAddNodePopup"],[Bn,1,"mFilteredAddNodeEntries"],[Un,1,"mLibraryDragIndicator"],[Hn,1,"svgLayer"],[Xn,1,"canvasWrapper"],[Yn,1,"mGraphChange"],[Wn,1,"mOpenFunction"],[Zn,1,"mUndoRequest"],[qn,1,"mRedoRequest"],[V,4,"activeFunction"],[V,4,"refreshVersion"],[V,4,"previewResult"],[V,4,"previewUpdateVersion"]],[Vn]))}constructor(){this.mActiveFunction=null,this.mAddNodeSearchQuery="",this.mAddNodeSelectedDefinitionId=null,this.mCachedGraphData={visibleNodes:[]},this.mClipboard=new Rt,this.mConnectionRegistry=new Map,this.mConnectionVersion=0,this.mDocumentPointerMoveHandler=null,this.mDocumentPointerUpHandler=null,this.mHoveredPort=null,this.mInteraction=new Nt(20),this.mInteractionState={mode:"idle"},this.mKeyboardHandler=null,this.mLibraryDragUnsubscribe=null,this.mLibraryInsertUnsubscribe=null,this.mPendingConnectionRenderFrame=0,this.mPortElementRegistry=new Map,this.mPreviewElements=new Map,this.mPreviewResult=null,this.mPreviewUpdateVersion=0,this.mRefreshVersion=0,this.mRenderer=new At,this.mSelectedNodes=new Set,this.mSelectionBoxScreen={x1:0,x2:0,y1:0,y2:0}}mClipboard;mConnectionRegistry;mInteraction;mPortElementRegistry;mPreviewElements;mRenderer;mSelectedNodes;mActiveFunction;mAddNodeSearchQuery;mAddNodeSelectedDefinitionId;mConnectionVersion;mDocumentPointerMoveHandler;mDocumentPointerUpHandler;mHoveredPort;mInteractionState;mKeyboardHandler;mLibraryDragUnsubscribe;mLibraryInsertUnsubscribe;mPendingConnectionRenderFrame;mPreviewResult;mPreviewUpdateVersion;mRefreshVersion;mSelectionBoxScreen;#e=(Mn(this),Tn(this));get mCachedGraphData(){return this.#e}set mCachedGraphData(e){this.#e=e}#t=En(this,0);get mTransformVersion(){return this.#t}set mTransformVersion(e){this.#t=e}#r=Cn(this,!1);get mShowSelectionBox(){return this.#r}set mShowSelectionBox(e){this.#r=e}#o=In(this,null);get mAddNodePopup(){return this.#o}set mAddNodePopup(e){this.#o=e}#n=Dn(this,[]);get mFilteredAddNodeEntries(){return this.#n}set mFilteredAddNodeEntries(e){this.#n=e}#i=Sn(this,null);get mLibraryDragIndicator(){return this.#i}set mLibraryDragIndicator(e){this.#i=e}#s=_n(this);get svgLayer(){return this.#s}set svgLayer(e){this.#s=e}#a=Pn(this);get canvasWrapper(){return this.#a}set canvasWrapper(e){this.#a=e}#l=Nn(this);get mGraphChange(){return this.#l}set mGraphChange(e){this.#l=e}#c=An(this);get mOpenFunction(){return this.#c}set mOpenFunction(e){this.#c=e}#u=Rn(this);get mUndoRequest(){return this.#u}set mUndoRequest(e){this.#u=e}#h=Ln(this);get mRedoRequest(){return this.#h}set mRedoRequest(e){this.#h=e}set activeFunction(e){if(this.mActiveFunction===e)return;this.mActiveFunction=e,this.mHoveredPort=null,this.mInteractionState={mode:"idle"},this.mLibraryDragIndicator=null,this.mPortElementRegistry.clear(),this.mPreviewElements.clear(),this.mSelectedNodes.clear(),this.stopDocumentPointerTracking(),this.closeAddNodePopup();let t=this.getSvgLayerOrNull();t&&this.mRenderer.clearAll(t),this.invalidateGraphContent(),this.updatePreviewElementsFromResult()}get activeFunction(){return this.mActiveFunction}set refreshVersion(e){this.mRefreshVersion!==e&&(this.mRefreshVersion=e,this.invalidateGraphContent(),this.updatePreviewElementsFromResult())}get refreshVersion(){return this.mRefreshVersion}set previewResult(e){this.mPreviewResult!==e&&(this.mPreviewResult=e,this.updatePreviewElementsFromResult())}get previewResult(){return this.mPreviewResult}set previewUpdateVersion(e){this.mPreviewUpdateVersion!==e&&(this.mPreviewUpdateVersion=e,this.updatePreviewElementsFromResult())}get previewUpdateVersion(){return this.mPreviewUpdateVersion}get gridBackgroundStyle(){return this.mTransformVersion,this.mInteraction.getGridBackgroundCss()}get gridTransformStyle(){return this.mTransformVersion,"transform: "+this.mInteraction.getTransformCss()}get gridSize(){return this.mInteraction.gridSize}get showSelectionBox(){return this.mShowSelectionBox}get selectionBoxStyle(){let e=Math.min(this.mSelectionBoxScreen.x1,this.mSelectionBoxScreen.x2),t=Math.min(this.mSelectionBoxScreen.y1,this.mSelectionBoxScreen.y2),n=Math.abs(this.mSelectionBoxScreen.x2-this.mSelectionBoxScreen.x1),c=Math.abs(this.mSelectionBoxScreen.y2-this.mSelectionBoxScreen.y1);return`left: ${e}px; top: ${t}px; width: ${n}px; height: ${c}px`}get visibleNodes(){return this.mCachedGraphData.visibleNodes}get showAddNodePopup(){return this.mAddNodePopup!==null}get addNodePopupStyle(){let e=this.mAddNodePopup;return e?`left: ${e.screenX}px; top: ${e.screenY}px`:""}get addNodeSearchValue(){return this.mAddNodeSearchQuery}get addNodeResults(){return this.mFilteredAddNodeEntries}get hasLibraryDragIndicator(){return this.mLibraryDragIndicator!==null}get libraryDragIndicatorStyle(){let e=this.mLibraryDragIndicator;return e?`left: ${e.clientX}px; top: ${e.clientY}px`:""}get libraryDragLabel(){return this.mLibraryDragIndicator?.label??""}getPreviewElementForNode(e){return this.mPreviewElements.get(e)??null}getAddNodeEntryClass(e){return e.id===this.mAddNodeSelectedDefinitionId?"add-node-result selected":"add-node-result"}onConnect(){this.mLibraryDragUnsubscribe=Re.subscribe(e=>this.startLibraryDrag(e)),this.mLibraryInsertUnsubscribe=Re.subscribeInsert(e=>this.insertLibraryNodeAtViewportCenter(e)),this.mKeyboardHandler=e=>this.onKeyDown(e),document.addEventListener("keydown",this.mKeyboardHandler),this.invalidateGraphContent()}onDeconstruct(){this.stopDocumentPointerTracking(),this.mKeyboardHandler&&(document.removeEventListener("keydown",this.mKeyboardHandler),this.mKeyboardHandler=null),this.mLibraryDragUnsubscribe&&(this.mLibraryDragUnsubscribe(),this.mLibraryDragUnsubscribe=null),this.mLibraryInsertUnsubscribe&&(this.mLibraryInsertUnsubscribe(),this.mLibraryInsertUnsubscribe=null),this.mPendingConnectionRenderFrame!==0&&(cancelAnimationFrame(this.mPendingConnectionRenderFrame),this.mPendingConnectionRenderFrame=0)}onCanvasPointerDown(e){if(this.closeAddNodePopup(),e.button===1){e.preventDefault(),this.mInteractionState={mode:"panning",startX:e.clientX,startY:e.clientY},this.startDocumentPointerTracking();return}if(e.button!==0)return;e.ctrlKey||(this.mSelectedNodes.clear(),this.invalidateNodeVisuals());let t=this.getLocalPointerPosition(e.clientX,e.clientY);this.mInteractionState={mode:"selecting"},this.mSelectionBoxScreen={x1:t.x,x2:t.x,y1:t.y,y2:t.y},this.mShowSelectionBox=!1,this.startDocumentPointerTracking()}onCanvasWheel(e){e.preventDefault();let t=this.getLocalPointerPosition(e.clientX,e.clientY);this.mInteraction.zoomAt(t.x,t.y,e.deltaY>0?-.1:.1),this.mTransformVersion++,this.scheduleConnectionRender()}onContextMenu(e){if(e.preventDefault(),e.target instanceof Element&&e.target.hasAttribute("data-hit-area")){let t=e.target.getAttribute("data-connection-id");t&&this.deleteConnectionById(t);return}this.eventPathContainsGraphNode(e)||this.eventPathContainsAddNodePopup(e)||this.openAddNodePopupAtPointer(e.clientX,e.clientY)}onNodePointerDown(e,t){for(let f of e.composedPath())if(f instanceof HTMLElement&&f.tagName.toLowerCase()==="potatno-port")return;if(e.stopPropagation(),this.closeAddNodePopup(),e.button!==0)return;e.ctrlKey?this.mSelectedNodes.has(t)?this.mSelectedNodes.delete(t):this.mSelectedNodes.add(t):this.mSelectedNodes.has(t)||(this.mSelectedNodes.clear(),this.mSelectedNodes.add(t)),this.invalidateNodeVisuals();let n=this.mInteraction.gridSize,c=new Map;for(let f of this.mSelectedNodes)c.set(f,{originX:f.transformation.x*n,originY:f.transformation.y*n});t.category===z.Comment&&this.addCommentContainedNodeOrigins(t,c),this.mInteractionState={mode:"dragging-node",origins:c,startX:e.clientX,startY:e.clientY},this.startDocumentPointerTracking()}onPortDragStart(e){let t=this.canvasWrapper.getBoundingClientRect(),n=e.value.element.getBoundingClientRect(),c=(n.left+n.width/2-t.left-this.mInteraction.panX)/this.mInteraction.zoom,f=(n.top+n.height/2-t.top-this.mInteraction.panY)/this.mInteraction.zoom;this.closeAddNodePopup(),this.mInteractionState={mode:"dragging-wire",sourcePort:e.value.port,startX:c,startY:f},this.startDocumentPointerTracking()}onPortHover(e){this.mHoveredPort={node:e.value.node,port:e.value.port}}onPortLeave(){this.mHoveredPort=null}onPortElementReady(e){this.mPortElementRegistry.set(e.value.port,e.value.element)}onNodeResizeStart(e){this.closeAddNodePopup(),this.mInteractionState={mode:"resizing-comment",node:e.value.node,originalH:e.value.node.transformation.height,originalW:e.value.node.transformation.width,startX:e.value.startX,startY:e.value.startY},this.startDocumentPointerTracking()}onCommentChange(e){this.emitGraphChange(!1,!1)}onDirectValueChange(e){this.emitGraphChange(!0,!1)}onOpenFunction(e){let t=e.value.node.definitionId;this.mOpenFunction.dispatchEvent({functionId:t.startsWith("USERFUNCTION_")?t.slice(13):t})}onAddNodePopupPointerDown(e){e.stopPropagation()}onAddNodeSearchInput(e){e.target instanceof HTMLInputElement&&(this.mAddNodeSearchQuery=e.target.value,this.rebuildAddNodeResults())}onAddNodeSearchKeyDown(e){if(e.key==="Escape"){e.preventDefault(),this.closeAddNodePopup();return}if(e.key==="Enter"){e.preventDefault(),this.insertSelectedAddNode();return}(e.key==="ArrowDown"||e.key==="ArrowUp")&&(e.preventDefault(),this.moveAddNodeSelection(e.key==="ArrowDown"?1:-1))}onAddNodeEntryPointerDown(e,t){e.preventDefault(),e.stopPropagation(),this.insertNodeFromAddPopup(t.definition)}onDocumentPointerMove(e){let t=this.mInteractionState;if(t.mode==="panning"){this.mInteraction.pan(e.clientX-t.startX,e.clientY-t.startY),t.startX=e.clientX,t.startY=e.clientY,this.mTransformVersion++,this.scheduleConnectionRender();return}if(t.mode==="dragging-node"){this.dragSelectedNodes(e,t);return}if(t.mode==="dragging-wire"){this.renderDraggedWire(e,t);return}if(t.mode==="selecting"){let n=this.getLocalPointerPosition(e.clientX,e.clientY);this.mSelectionBoxScreen.x2=n.x,this.mSelectionBoxScreen.y2=n.y,this.mShowSelectionBox=Math.abs(this.mSelectionBoxScreen.x2-this.mSelectionBoxScreen.x1)>5||Math.abs(this.mSelectionBoxScreen.y2-this.mSelectionBoxScreen.y1)>5;return}if(t.mode==="resizing-comment"){let n=this.mInteraction.gridSize,c=(e.clientX-t.startX)/this.mInteraction.zoom,f=(e.clientY-t.startY)/this.mInteraction.zoom;t.node.resizeTo(t.originalW+Math.round(c/n),t.originalH+Math.round(f/n)),this.rebuildVisibleNodePositions();return}t.mode==="library-drag"&&(this.mLibraryDragIndicator={clientX:e.clientX,clientY:e.clientY,label:t.label})}onDocumentPointerUp(e){let t=this.mInteractionState;t.mode==="dragging-node"?this.emitGraphChange(!0,!1):t.mode==="dragging-wire"?this.completeWireDrag():t.mode==="selecting"?(this.mShowSelectionBox=!1,this.selectNodesInBox()):t.mode==="resizing-comment"?this.emitGraphChange(!1,!1):t.mode==="library-drag"&&this.finishLibraryDrag(e,t),this.mInteractionState={mode:"idle"},this.stopDocumentPointerTracking()}onKeyDown(e){if(!this.isTextEditingActive()){if(e.key==="Delete"){this.deleteSelectedNodes();return}if(e.ctrlKey&&e.key==="z"){e.preventDefault(),e.shiftKey?this.mRedoRequest.dispatchEvent(void 0):this.mUndoRequest.dispatchEvent(void 0);return}if(e.ctrlKey&&e.key==="y"){e.preventDefault(),this.mRedoRequest.dispatchEvent(void 0);return}if(e.ctrlKey&&e.key==="c"){this.mClipboard.copy(this.mSelectedNodes);return}e.ctrlKey&&e.key==="v"&&(e.preventDefault(),this.pasteFromClipboard())}}addCommentContainedNodeOrigins(e,t){let n=this.mActiveFunction;if(!n)return;let c=this.mInteraction.gridSize,f=e.transformation.x*c,g=e.transformation.y*c,b=f+e.transformation.width*c,I=g+e.transformation.height*c;for(let S of n.nodes){if(S===e||this.mSelectedNodes.has(S)||S.category===z.Comment)continue;let l=S.transformation.x*c,o=S.transformation.y*c;l>=f&&l<=b&&o>=g&&o<=I&&t.set(S,{originX:l,originY:o})}}closeAddNodePopup(){this.mAddNodePopup=null,this.mAddNodeSearchQuery="",this.mAddNodeSelectedDefinitionId=null,this.mFilteredAddNodeEntries=[]}completeWireDrag(){let e=this.getSvgLayerOrNull();if(e&&this.mRenderer.clearTempConnection(e),this.mInteractionState.mode!=="dragging-wire")return;let t=this.mInteractionState.sourcePort,n=this.mHoveredPort?.port??null;if(!(!n||t===n)&&!(t.direction===n.direction||t.portType!==n.portType))try{t.connect(n),this.mConnectionVersion++,this.invalidateGraphContent(),this.emitGraphChange(!0,!1)}catch(c){console.error("[NodeGraph] Connection failed:",c)}}deleteConnectionById(e){let t=this.mConnectionRegistry.get(e);t&&(t.sourcePort.disconnect(t.targetPort),this.mConnectionVersion++,this.invalidateGraphContent(),this.emitGraphChange(!0,!1))}deleteSelectedNodes(){let e=this.mActiveFunction;if(!e)return;let t=!1;for(let n of[...this.mSelectedNodes])n.isSystem||(e.removeNode(n),this.mSelectedNodes.delete(n),t=!0);t&&(this.mConnectionVersion++,this.invalidateGraphContent(),this.emitGraphChange(!0,!1))}dragSelectedNodes(e,t){let n=this.mInteraction.zoom,c=this.mInteraction.gridSize,f=(e.clientX-t.startX)/n,g=(e.clientY-t.startY)/n;for(let[b,I]of t.origins){let S=this.mInteraction.snapToGrid(I.originX+f,I.originY+g);b.moveTo(Math.round(S.x/c),Math.round(S.y/c))}this.rebuildVisibleNodePositions(),this.scheduleConnectionRender()}emitGraphChange(e,t){this.mGraphChange.dispatchEvent({affectsLibrary:t,affectsPreview:e})}eventPathContainsAddNodePopup(e){for(let t of e.composedPath())if(t instanceof HTMLElement&&t.classList.contains("add-node-popup"))return!0;return!1}eventPathContainsGraphNode(e){for(let t of e.composedPath())if(t instanceof HTMLElement&&t.tagName.toLowerCase()==="potatno-node")return!0;return!1}focusAddNodeSearchInput(){requestAnimationFrame(()=>{let t=this.getCanvasWrapperOrNull()?.querySelector(".add-node-search")??null;t?.focus(),t?.select()})}finishLibraryDrag(e,t){if(this.mLibraryDragIndicator=null,!this.isPointerInsideCanvas(e.clientX,e.clientY))return;let n=this.getNodeDefinitionEntryById(t.definitionId);if(!n)return;let c=this.getWorldPointerPosition(e.clientX,e.clientY);this.insertNodeAt(n.definition,c)}getCanvasWrapperOrNull(){try{return this.canvasWrapper}catch{return null}}getNodeDefinitionEntryById(e){return qe(this.mActiveFunction).find(t=>t.id===e)??null}getLocalPointerPosition(e,t){let n=this.getCanvasWrapperOrNull();if(!n)return{x:0,y:0};let c=n.getBoundingClientRect();return{x:e-c.left,y:t-c.top}}getPortPosition(e){let t=this.mPortElementRegistry.get(e),n=this.getCanvasWrapperOrNull();if(t&&n){let y=n.getBoundingClientRect(),v=t.getBoundingClientRect();return{x:(v.left+v.width/2-y.left-this.mInteraction.panX)/this.mInteraction.zoom,y:(v.top+v.height/2-y.top-this.mInteraction.panY)/this.mInteraction.zoom}}let c=e.node,f=this.mInteraction.gridSize,g=c.transformation.x*f,b=c.transformation.y*f,I=c.transformation.width*f,S=28,l=24,o=4,u=e.direction==="output"?c.outputs:c.inputs,a=0,r=0;for(let y of u.values()){if(y===e){a=r;break}r++}return{x:e.direction==="output"?g+I:g,y:b+S+o+(a+.5)*l}}getSvgLayerOrNull(){try{return this.svgLayer}catch{return null}}getWorldPointerPosition(e,t){let n=this.getLocalPointerPosition(e,t);return this.mInteraction.screenToWorld(n.x,n.y)}invalidateGraphContent(){this.rebuildGraphData(),this.scheduleConnectionRender()}invalidateNodeVisuals(){this.rebuildGraphData()}insertNodeAt(e,t){let n=this.mActiveFunction;if(!n)return;let c=this.mInteraction.gridSize,f=this.mInteraction.snapToGrid(t.x,t.y),g=n.newNode(e,{height:4,width:10,x:Math.round(f.x/c),y:Math.round(f.y/c)});this.mSelectedNodes.clear(),this.mSelectedNodes.add(g),this.closeAddNodePopup(),this.invalidateGraphContent(),this.emitGraphChange(!0,!1)}insertLibraryNodeAtViewportCenter(e){let t=this.getNodeDefinitionEntryById(e.definitionId),n=this.getCanvasWrapperOrNull();!t||!n||(this.mInteractionState={mode:"idle"},this.mLibraryDragIndicator=null,this.stopDocumentPointerTracking(),this.insertNodeAt(t.definition,this.mInteraction.screenToWorld(n.clientWidth/2,n.clientHeight/2)))}insertSelectedAddNode(){let e=this.mFilteredAddNodeEntries.find(t=>t.id===this.mAddNodeSelectedDefinitionId)??this.mFilteredAddNodeEntries[0];e&&this.insertNodeFromAddPopup(e.definition)}insertNodeFromAddPopup(e){let t=this.mAddNodePopup;t&&this.insertNodeAt(e,{x:t.worldX,y:t.worldY})}isTextEditingActive(){let e=document.activeElement;return e instanceof HTMLInputElement||e instanceof HTMLTextAreaElement||e instanceof HTMLSelectElement}isPointerInsideCanvas(e,t){let n=this.getCanvasWrapperOrNull();if(!n)return!1;let c=n.getBoundingClientRect();return e>=c.left&&e<=c.right&&t>=c.top&&t<=c.bottom}moveAddNodeSelection(e){if(this.mFilteredAddNodeEntries.length===0){this.mAddNodeSelectedDefinitionId=null;return}let n=(Math.max(0,this.mFilteredAddNodeEntries.findIndex(c=>c.id===this.mAddNodeSelectedDefinitionId))+e+this.mFilteredAddNodeEntries.length)%this.mFilteredAddNodeEntries.length;this.mAddNodeSelectedDefinitionId=this.mFilteredAddNodeEntries[n].id,this.mFilteredAddNodeEntries=[...this.mFilteredAddNodeEntries]}openAddNodePopupAtPointer(e,t){let n=this.getCanvasWrapperOrNull(),c=this.getLocalPointerPosition(e,t),f=this.mInteraction.screenToWorld(c.x,c.y),g=280,b=320,I=Math.max(0,(n?.clientWidth??g)-g-8),S=Math.max(0,(n?.clientHeight??b)-b-8);this.mAddNodePopup={screenX:Math.max(8,Math.min(c.x,I)),screenY:Math.max(8,Math.min(c.y,S)),worldX:f.x,worldY:f.y},this.mAddNodeSearchQuery="",this.rebuildAddNodeResults(),this.focusAddNodeSearchInput()}pasteFromClipboard(){let e=this.mActiveFunction;if(!e)return;let t=this.mClipboard.paste(e,e.document,2,2);if(t.length!==0){this.mSelectedNodes.clear();for(let n of t)this.mSelectedNodes.add(n);this.mConnectionVersion++,this.invalidateGraphContent(),this.emitGraphChange(!0,!1)}}rebuildAddNodeResults(){let e=this.mAddNodeSearchQuery.trim().toLowerCase();this.mFilteredAddNodeEntries=qe(this.mActiveFunction).filter(t=>!e||t.name.toLowerCase().includes(e)),this.mFilteredAddNodeEntries.some(t=>t.id===this.mAddNodeSelectedDefinitionId)||(this.mAddNodeSelectedDefinitionId=this.mFilteredAddNodeEntries[0]?.id??null)}rebuildGraphData(){let e=[],t=this.mActiveFunction;if(t){let n=this.mInteraction.gridSize;for(let c of t.nodes)this.ensurePreviewElementForNode(c),e.push({connectionVersion:this.mConnectionVersion,node:c,pixelW:c.transformation.width*n,pixelX:c.transformation.x*n,pixelY:c.transformation.y*n,selected:this.mSelectedNodes.has(c)})}this.mCachedGraphData={visibleNodes:e}}rebuildVisibleNodePositions(){let e=this.mInteraction.gridSize;this.mCachedGraphData={visibleNodes:this.mCachedGraphData.visibleNodes.map(t=>({connectionVersion:t.connectionVersion,node:t.node,pixelW:t.node.transformation.width*e,pixelX:t.node.transformation.x*e,pixelY:t.node.transformation.y*e,selected:t.selected}))}}renderConnections(){let e=this.getSvgLayerOrNull();if(!e)return;let t=this.mActiveFunction;if(!t){this.mRenderer.clearAll(e),this.mConnectionRegistry.clear();return}let n=[];this.mConnectionRegistry.clear();let c=0;for(let f of t.nodes)for(let g of f.outputs.values())for(let b of g.connectedPorts){let I=`c${c++}`,S=this.getPortPosition(g),l=this.getPortPosition(b);this.mConnectionRegistry.set(I,{sourcePort:g,targetPort:b}),n.push({color:"var(--pn-text-secondary)",id:I,sourceX:S.x,sourceY:S.y,targetX:l.x,targetY:l.y,valid:!0})}this.mRenderer.renderConnections(e,n)}renderDraggedWire(e,t){let n=this.getSvgLayerOrNull();if(!n)return;let c=this.getWorldPointerPosition(e.clientX,e.clientY);this.mRenderer.renderTempConnection(n,{x:t.startX,y:t.startY},c,"#bac2de")}scheduleConnectionRender(){this.mPendingConnectionRenderFrame===0&&(this.mPendingConnectionRenderFrame=requestAnimationFrame(()=>{this.mPendingConnectionRenderFrame=0,this.renderConnections()}))}selectNodesInBox(){let e=this.mActiveFunction;if(!e)return;let t=this.mInteraction.screenToWorld(Math.min(this.mSelectionBoxScreen.x1,this.mSelectionBoxScreen.x2),Math.min(this.mSelectionBoxScreen.y1,this.mSelectionBoxScreen.y2)),n=this.mInteraction.screenToWorld(Math.max(this.mSelectionBoxScreen.x1,this.mSelectionBoxScreen.x2),Math.max(this.mSelectionBoxScreen.y1,this.mSelectionBoxScreen.y2)),c=this.mInteraction.gridSize;for(let f of e.nodes){let g=f.transformation.x*c,b=f.transformation.y*c,I=g+f.transformation.width*c,S=b+f.transformation.height*c;g<n.x&&I>t.x&&b<n.y&&S>t.y&&this.mSelectedNodes.add(f)}this.invalidateNodeVisuals()}startDocumentPointerTracking(){this.stopDocumentPointerTracking(),this.mDocumentPointerMoveHandler=e=>this.onDocumentPointerMove(e),this.mDocumentPointerUpHandler=e=>this.onDocumentPointerUp(e),document.addEventListener("pointermove",this.mDocumentPointerMoveHandler),document.addEventListener("pointerup",this.mDocumentPointerUpHandler)}startLibraryDrag(e){this.mActiveFunction&&(this.closeAddNodePopup(),this.mInteractionState={definitionId:e.definitionId,label:e.label,mode:"library-drag"},this.mLibraryDragIndicator={clientX:e.clientX,clientY:e.clientY,label:e.label},this.startDocumentPointerTracking())}stopDocumentPointerTracking(){this.mDocumentPointerMoveHandler&&(document.removeEventListener("pointermove",this.mDocumentPointerMoveHandler),this.mDocumentPointerMoveHandler=null),this.mDocumentPointerUpHandler&&(document.removeEventListener("pointerup",this.mDocumentPointerUpHandler),this.mDocumentPointerUpHandler=null)}ensurePreviewElementForNode(e){if(this.mPreviewElements.has(e))return;let t=this.getNodeDefinitionEntryById(e.definitionId)?.definition??null;if(!t?.preview)return;let n=t.preview.generate();n instanceof HTMLElement&&this.mPreviewElements.set(e,n)}updatePreviewElementsFromResult(){let e=this.mPreviewResult,t=this.mActiveFunction;if(!(!e||!t))for(let[n,c]of e.nodeIntermediates){let f=this.mPreviewElements.get(n);if(!f)continue;let g=qe(t).find(b=>b.id===n.definitionId)?.definition??null;if(g?.preview)try{g.preview.update(f,c.context,c.codeFunction,{},c.intermediateCode)}catch(b){console.error("[NodeGraph] Node preview update failed:",b)}}}static{xn()}};var Jn=`:host {\r
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
`;var Kn=`<div class="search-wrapper">\r
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
                        <div class="node-entry" (pointerdown)="this.onNodePointerDown($event, this.node)" (click)="this.onNodeClick($event, this.node)">{{this.node.name}}</div>
                    }\r
                </div>\r
            }\r
        </div>\r
    }\r
    $if(this.filteredGroups.length === 0) {\r
        <div class="empty-message">No matching nodes found.</div>\r
    }\r
</div>
`;function pl(){function m(l,o){return function(a){t(o,"addInitializer"),n(a,"An initializer"),l.push(a)}}function e(l,o,u,a,r,y,v,T,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+o:o,static:y,private:v,metadata:T},d={v:!1};s.addInitializer=m(a,d);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[o]},h=function(x){this[o]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return l(w,s)}finally{d.v=!0}}function t(l,o){if(l.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(l,o){if(typeof l!="function")throw new TypeError(o+" must be a function")}function c(l,o){var u=typeof o;if(l===1){if(u!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(u!=="function"){var a;throw l===0?a="field":l===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function f(l,o,u,a,r,y,v,T,w){var p=u[0],s,d,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,D;if(typeof p=="function")h=e(p,a,s,T,r,y,v,w,i),h!==void 0&&(c(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,D=h.set||i.set,i={get:x,set:D}):i=h);else for(var _=p.length-1;_>=0;_--){var P=p[_];if(h=e(P,a,s,T,r,y,v,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,D=h.set||i.set,i={get:x,set:D}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(C,E){return E};else if(typeof d!="function"){var M=d;d=function(C,E){for(var R=E,L=0;L<M.length;L++)R=M[L].call(C,R);return R}}else{var j=d;d=function(C,E){return j.call(C,E)}}l.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(l.push(function(C,E){return i.get.call(C,E)}),l.push(function(C,E){return i.set.call(C,E)})):r===2?l.push(i):l.push(function(C,E){return i.call(C,E)}):Object.defineProperty(o,a,s))}function g(l,o,u){for(var a=[],r,y,v=new Map,T=new Map,w=0;w<o.length;w++){var p=o[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,D;if(h?(x=l,s=s-5,y=y||[],D=y):(x=l.prototype,r=r||[],D=r),s!==0&&!i){var _=h?T:v,P=_.get(d)||0;if(P===!0||P===3&&s!==4||P===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!P&&s>2?_.set(d,s):_.set(d,!0)}f(a,x,p,d,s,h,i,D,u)}}return b(a,r),b(a,y),a}function b(l,o){o&&l.push(function(u){for(var a=0;a<o.length;a++)o[a].call(u);return u})}function I(l,o,u){if(o.length>0){for(var a=[],r=l,y=l.name,v=o.length-1;v>=0;v--){var T={v:!1};try{var w=o[v](r,{kind:"class",name:y,addInitializer:m(a,T),metadata:u})}finally{T.v=!0}w!==void 0&&(c(10,w),r=w)}return[S(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function S(l,o){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,u,a,r){if(r!==void 0)var y=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(y===void 0?null:y),T=g(o,u,v);return a.length||S(o,v),{e:T,get c(){return I(o,a,v)}}}}function ri(m,e,t,n){return(ri=pl())(m,e,t,n)}var oi,Qn,ni,kn,ei,fl;oi=X({selector:"potatno-node-library",template:Kn,style:Jn}),ni=F.state();var ti=class{static{({e:[kn,ei],c:[fl,Qn]}=ri(this,[[ni,1,"mCachedFilteredGroups"],[V,4,"activeFunction"],[V,4,"refreshVersion"]],[oi]))}mActiveFunction=(ei(this),null);mCollapsedCategories={};mNodeDefinitions=[];mRefreshVersion=0;mSearchQuery="";#e=kn(this,[]);get mCachedFilteredGroups(){return this.#e}set mCachedFilteredGroups(e){this.#e=e}set activeFunction(e){this.mActiveFunction!==e&&(this.mActiveFunction=e,this.refreshNodeDefinitions())}get activeFunction(){return this.mActiveFunction}set refreshVersion(e){this.mRefreshVersion!==e&&(this.mRefreshVersion=e,this.refreshNodeDefinitions())}get refreshVersion(){return this.mRefreshVersion}get filteredGroups(){return this.mCachedFilteredGroups}onSearchInput(e){e.target instanceof HTMLInputElement&&(this.mSearchQuery=e.target.value,this.rebuildFilteredGroups())}toggleCategory(e){this.mCollapsedCategories[e]=!this.mCollapsedCategories[e],this.rebuildFilteredGroups()}isCategoryCollapsed(e){return this.mCollapsedCategories[e]===!0}getToggleClass(e){return this.mCollapsedCategories[e]?"category-toggle collapsed":"category-toggle"}onNodePointerDown(e,t){e.button===0&&Re.startDrag({clientX:e.clientX,clientY:e.clientY,definitionId:t.id,label:t.name})}onNodeClick(e,t){e.preventDefault(),Re.requestInsert({definitionId:t.id,label:t.name})}refreshNodeDefinitions(){this.mNodeDefinitions=qe(this.mActiveFunction),this.rebuildFilteredGroups()}rebuildFilteredGroups(){let e=this.mSearchQuery.toLowerCase(),t=new Map,n=new Array;for(let f of this.mNodeDefinitions){if(e&&!f.name.toLowerCase().includes(e))continue;let g=t.get(f.category);g||(g=[],t.set(f.category,g),n.push(f.category)),g.push(f)}let c=[];for(let f of n){let g=t.get(f);if(g&&g.length>0){let b=Me.get(f);c.push({category:f,cssColor:b.cssColor,icon:b.icon,label:b.label,nodes:g})}}this.mCachedFilteredGroups=c}static{Qn()}};var ii=`:host {\r
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
`;var si=`<div class="tab-bar">\r
    <button [className]="this.getTabClass(0)" (click)="this.onTabClick(0)">Nodes</button>\r
    <button [className]="this.getTabClass(1)" (click)="this.onTabClick(1)">Functions</button>\r
</div>\r
<div class="tab-content">
    $if(this.activeTabIndex === 0) {
        <potatno-node-library [activeFunction]="this.activeFunction" [refreshVersion]="this.libraryRefreshVersion"></potatno-node-library>
    }
    $if(this.activeTabIndex === 1) {\r
        <potatno-function-list [functions]="this.functions" [activeFunctionId]="this.activeFunctionId" [userFunctionDefinitions]="this.userFunctionDefinitions" (function-select)="this.onFunctionSelect($event)" (function-add)="this.onFunctionAdd($event)" (function-delete)="this.onFunctionDelete($event)"></potatno-function-list>\r
    }\r
</div>
`;function yl(){function m(l,o){return function(a){t(o,"addInitializer"),n(a,"An initializer"),l.push(a)}}function e(l,o,u,a,r,y,v,T,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+o:o,static:y,private:v,metadata:T},d={v:!1};s.addInitializer=m(a,d);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[o]},h=function(x){this[o]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return l(w,s)}finally{d.v=!0}}function t(l,o){if(l.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(l,o){if(typeof l!="function")throw new TypeError(o+" must be a function")}function c(l,o){var u=typeof o;if(l===1){if(u!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(u!=="function"){var a;throw l===0?a="field":l===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function f(l,o,u,a,r,y,v,T,w){var p=u[0],s,d,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,D;if(typeof p=="function")h=e(p,a,s,T,r,y,v,w,i),h!==void 0&&(c(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,D=h.set||i.set,i={get:x,set:D}):i=h);else for(var _=p.length-1;_>=0;_--){var P=p[_];if(h=e(P,a,s,T,r,y,v,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,D=h.set||i.set,i={get:x,set:D}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(C,E){return E};else if(typeof d!="function"){var M=d;d=function(C,E){for(var R=E,L=0;L<M.length;L++)R=M[L].call(C,R);return R}}else{var j=d;d=function(C,E){return j.call(C,E)}}l.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(l.push(function(C,E){return i.get.call(C,E)}),l.push(function(C,E){return i.set.call(C,E)})):r===2?l.push(i):l.push(function(C,E){return i.call(C,E)}):Object.defineProperty(o,a,s))}function g(l,o,u){for(var a=[],r,y,v=new Map,T=new Map,w=0;w<o.length;w++){var p=o[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,D;if(h?(x=l,s=s-5,y=y||[],D=y):(x=l.prototype,r=r||[],D=r),s!==0&&!i){var _=h?T:v,P=_.get(d)||0;if(P===!0||P===3&&s!==4||P===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!P&&s>2?_.set(d,s):_.set(d,!0)}f(a,x,p,d,s,h,i,D,u)}}return b(a,r),b(a,y),a}function b(l,o){o&&l.push(function(u){for(var a=0;a<o.length;a++)o[a].call(u);return u})}function I(l,o,u){if(o.length>0){for(var a=[],r=l,y=l.name,v=o.length-1;v>=0;v--){var T={v:!1};try{var w=o[v](r,{kind:"class",name:y,addInitializer:m(a,T),metadata:u})}finally{T.v=!0}w!==void 0&&(c(10,w),r=w)}return[S(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function S(l,o){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,u,a,r){if(r!==void 0)var y=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(y===void 0?null:y),T=g(o,u,v);return a.length||S(o,v),{e:T,get c(){return I(o,a,v)}}}}function bi(m,e,t,n){return(bi=yl())(m,e,t,n)}var wi,ai,xi,Ti,Ei,Ci,Ii,Di,Si,_i,Pi,li,ci,ui,hi,di,mi,pi,fi,gi,vi,bl;wi=X({selector:"potatno-panel-left",template:si,style:ii}),xi=F.state(),Ti=F.state(),Ei=F.state(),Ci=F.state(),Ii=F.state(),Di=F.state(),Si=G("function-select"),_i=G("function-add"),Pi=G("function-delete");var yi=class{static{({e:[li,ci,ui,hi,di,mi,pi,fi,gi,vi],c:[bl,ai]}=bi(this,[[[V,xi],1,"functions"],[[V,Ti],1,"activeFunctionId"],[[V,Ei],1,"userFunctionDefinitions"],[[V,Ci],1,"nodeLibraryRefreshVersion"],[Ii,1,"mActiveTabIndex"],[Di,1,"mLibraryShownRefreshVersion"],[Si,1,"mFunctionSelect"],[_i,1,"mFunctionAdd"],[Pi,1,"mFunctionDelete"],[V,4,"activeFunction"]],[wi]))}mActiveFunction=(vi(this),null);#e=li(this,[]);get functions(){return this.#e}set functions(e){this.#e=e}#t=ci(this,"");get activeFunctionId(){return this.#t}set activeFunctionId(e){this.#t=e}#r=ui(this,[]);get userFunctionDefinitions(){return this.#r}set userFunctionDefinitions(e){this.#r=e}#o=hi(this,0);get nodeLibraryRefreshVersion(){return this.#o}set nodeLibraryRefreshVersion(e){this.#o=e}#n=di(this,0);get mActiveTabIndex(){return this.#n}set mActiveTabIndex(e){this.#n=e}#i=mi(this,0);get mLibraryShownRefreshVersion(){return this.#i}set mLibraryShownRefreshVersion(e){this.#i=e}#s=pi(this);get mFunctionSelect(){return this.#s}set mFunctionSelect(e){this.#s=e}#a=fi(this);get mFunctionAdd(){return this.#a}set mFunctionAdd(e){this.#a=e}#l=gi(this);get mFunctionDelete(){return this.#l}set mFunctionDelete(e){this.#l=e}set activeFunction(e){this.mActiveFunction!==e&&(this.mActiveFunction=e,this.mLibraryShownRefreshVersion++)}get activeFunction(){return this.mActiveFunction}get activeTabIndex(){return this.mActiveTabIndex}get libraryRefreshVersion(){return this.nodeLibraryRefreshVersion+this.mLibraryShownRefreshVersion}getTabClass(e){return e===this.mActiveTabIndex?"tab-button active":"tab-button"}onTabClick(e){let t=this.mActiveTabIndex!==0;this.mActiveTabIndex=e,e===0&&t&&this.mLibraryShownRefreshVersion++}onFunctionSelect(e){this.mFunctionSelect.dispatchEvent(e.value)}onFunctionAdd(e){this.mFunctionAdd.dispatchEvent(e.value)}onFunctionDelete(e){this.mFunctionDelete.dispatchEvent(e.value)}static{ai()}};var Ni=`:host {\r
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
`;var Ai=`<div class="properties-header">Properties</div>\r
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
`;function Tl(){function m(l,o){return function(a){t(o,"addInitializer"),n(a,"An initializer"),l.push(a)}}function e(l,o,u,a,r,y,v,T,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+o:o,static:y,private:v,metadata:T},d={v:!1};s.addInitializer=m(a,d);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[o]},h=function(x){this[o]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return l(w,s)}finally{d.v=!0}}function t(l,o){if(l.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(l,o){if(typeof l!="function")throw new TypeError(o+" must be a function")}function c(l,o){var u=typeof o;if(l===1){if(u!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(u!=="function"){var a;throw l===0?a="field":l===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function f(l,o,u,a,r,y,v,T,w){var p=u[0],s,d,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,D;if(typeof p=="function")h=e(p,a,s,T,r,y,v,w,i),h!==void 0&&(c(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,D=h.set||i.set,i={get:x,set:D}):i=h);else for(var _=p.length-1;_>=0;_--){var P=p[_];if(h=e(P,a,s,T,r,y,v,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,D=h.set||i.set,i={get:x,set:D}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(C,E){return E};else if(typeof d!="function"){var M=d;d=function(C,E){for(var R=E,L=0;L<M.length;L++)R=M[L].call(C,R);return R}}else{var j=d;d=function(C,E){return j.call(C,E)}}l.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(l.push(function(C,E){return i.get.call(C,E)}),l.push(function(C,E){return i.set.call(C,E)})):r===2?l.push(i):l.push(function(C,E){return i.call(C,E)}):Object.defineProperty(o,a,s))}function g(l,o,u){for(var a=[],r,y,v=new Map,T=new Map,w=0;w<o.length;w++){var p=o[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,D;if(h?(x=l,s=s-5,y=y||[],D=y):(x=l.prototype,r=r||[],D=r),s!==0&&!i){var _=h?T:v,P=_.get(d)||0;if(P===!0||P===3&&s!==4||P===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!P&&s>2?_.set(d,s):_.set(d,!0)}f(a,x,p,d,s,h,i,D,u)}}return b(a,r),b(a,y),a}function b(l,o){o&&l.push(function(u){for(var a=0;a<o.length;a++)o[a].call(u);return u})}function I(l,o,u){if(o.length>0){for(var a=[],r=l,y=l.name,v=o.length-1;v>=0;v--){var T={v:!1};try{var w=o[v](r,{kind:"class",name:y,addInitializer:m(a,T),metadata:u})}finally{T.v=!0}w!==void 0&&(c(10,w),r=w)}return[S(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function S(l,o){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,u,a,r){if(r!==void 0)var y=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(y===void 0?null:y),T=g(o,u,v);return a.length||S(o,v),{e:T,get c(){return I(o,a,v)}}}}function Xi(m,e,t,n){return(Xi=Tl())(m,e,t,n)}var Yi,Ri,Wi,Zi,qi,Ji,Ki,Qi,ki,es,ts,rs,Li,Mi,Oi,Fi,Vi,$i,ji,zi,Gi,Bi,Ui,El;Yi=X({selector:"potatno-panel-properties",template:Ai,style:Ni}),Wi=F.state(),Zi=F.state(),qi=F.state(),Ji=F.state(),Ki=F.state(),Qi=F.state(),ki=F.state(),es=F.state(),ts=F.state(),rs=G("properties-change");var Hi=class{static{({e:[Li,Mi,Oi,Fi,Vi,$i,ji,zi,Gi,Bi,Ui],c:[El,Ri]}=Xi(this,[[[V,Wi],1,"functionName"],[[V,Zi],1,"functionInputs"],[[V,qi],1,"functionOutputs"],[Ji,1,"mFunctionImports"],[V,4,"functionImports"],[[V,Ki],1,"isSystem"],[[V,Qi],1,"editableByUser"],[ki,1,"mAvailableImports"],[V,4,"availableImports"],[es,1,"mAvailableTypes"],[V,4,"availableTypes"],[ts,1,"mCachedUnusedImports"],[rs,1,"mPropertiesChange"]],[Yi]))}#e=(Ui(this),Li(this,""));get functionName(){return this.#e}set functionName(e){this.#e=e}#t=Mi(this,[]);get functionInputs(){return this.#t}set functionInputs(e){this.#t=e}#r=Oi(this,[]);get functionOutputs(){return this.#r}set functionOutputs(e){this.#r=e}#o=Fi(this,[]);get mFunctionImports(){return this.#o}set mFunctionImports(e){this.#o=e}set functionImports(e){this.mFunctionImports=e,this.rebuildUnusedImports()}get functionImports(){return this.mFunctionImports}#n=Vi(this,!1);get isSystem(){return this.#n}set isSystem(e){this.#n=e}#i=$i(this,!1);get editableByUser(){return this.#i}set editableByUser(e){this.#i=e}get nameDisabled(){return this.isSystem}get portsDisabled(){return this.isSystem&&!this.editableByUser}#s=ji(this,[]);get mAvailableImports(){return this.#s}set mAvailableImports(e){this.#s=e}set availableImports(e){this.mAvailableImports=e,this.rebuildUnusedImports()}get availableImports(){return this.mAvailableImports}#a=zi(this,[]);get mAvailableTypes(){return this.#a}set mAvailableTypes(e){this.#a=e}set availableTypes(e){this.mAvailableTypes=e}get availableTypes(){return this.mAvailableTypes}#l=Gi(this,[]);get mCachedUnusedImports(){return this.#l}set mCachedUnusedImports(e){this.#l=e}mSelectedImport="";#c=Bi(this);get mPropertiesChange(){return this.#c}set mPropertiesChange(e){this.#c=e}validateName(e){return/^[a-zA-Z][a-zA-Z0-9_]*$/.test(e)}isNameDuplicate(e,t,n){if(t!=="function"&&e===this.functionName)return!0;for(let c=0;c<this.functionInputs.length;c++)if(!(t==="input"&&c===n)&&this.functionInputs[c].name===e)return!0;for(let c=0;c<this.functionOutputs.length;c++)if(!(t==="output"&&c===n)&&this.functionOutputs[c].name===e)return!0;return!1}onNameChange(e){let t=e.target,n=t.value,c=!this.validateName(n)||this.isNameDuplicate(n,"function");t.style.borderColor=c?"var(--pn-accent-danger)":"",this.functionName=n,this.mPropertiesChange.dispatchEvent({name:n})}onInputNameChange(e,t){let n=t.target,c=n.value,f=!this.validateName(c)||this.isNameDuplicate(c,"input",e);n.style.borderColor=f?"var(--pn-accent-danger)":"";let g=[...this.functionInputs];g[e]={...g[e],name:c},this.functionInputs=g,this.mPropertiesChange.dispatchEvent({inputs:g})}onInputTypeChange(e,t){let n=t.target.value,c=[...this.functionInputs];c[e]={...c[e],type:n},this.functionInputs=c,this.mPropertiesChange.dispatchEvent({inputs:c})}onOutputNameChange(e,t){let n=t.target,c=n.value,f=!this.validateName(c)||this.isNameDuplicate(c,"output",e);n.style.borderColor=f?"var(--pn-accent-danger)":"";let g=[...this.functionOutputs];g[e]={...g[e],name:c},this.functionOutputs=g,this.mPropertiesChange.dispatchEvent({outputs:g})}onOutputTypeChange(e,t){let n=t.target.value,c=[...this.functionOutputs];c[e]={...c[e],type:n},this.functionOutputs=c,this.mPropertiesChange.dispatchEvent({outputs:c})}onAddInput(){let e=this.mAvailableTypes.length>0?this.mAvailableTypes[0]:"number",t=[...this.functionInputs,{name:"new_input",type:e}];this.functionInputs=t,this.mPropertiesChange.dispatchEvent({inputs:t})}onDeleteInput(e){let t=[...this.functionInputs];t.splice(e,1),this.functionInputs=t,this.mPropertiesChange.dispatchEvent({inputs:t})}onAddOutput(){let e=this.mAvailableTypes.length>0?this.mAvailableTypes[0]:"number",t=[...this.functionOutputs,{name:"new_output",type:e}];this.functionOutputs=t,this.mPropertiesChange.dispatchEvent({outputs:t})}onDeleteOutput(e){let t=[...this.functionOutputs];t.splice(e,1),this.functionOutputs=t,this.mPropertiesChange.dispatchEvent({outputs:t})}get unusedImports(){return this.mCachedUnusedImports}onImportSelectChange(e){this.mSelectedImport=e.target.value}onAddSelectedImport(){let e=this.mSelectedImport||(this.mCachedUnusedImports.length>0?this.mCachedUnusedImports[0]:"");if(!e)return;let t=[...this.mFunctionImports,e];this.functionImports=t,this.mSelectedImport="",this.mPropertiesChange.dispatchEvent({imports:t})}onDeleteImport(e){let t=[...this.mFunctionImports];t.splice(e,1),this.functionImports=t,this.mPropertiesChange.dispatchEvent({imports:t})}rebuildUnusedImports(){let e=new Set(this.mFunctionImports);this.mCachedUnusedImports=this.mAvailableImports.filter(t=>!e.has(t))}static{Ri()}};var os=`:host {\r
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
`;var ns=`<div class="resize-handle" (pointerdown)="this.onResizePointerDown($event)"></div>\r
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
`;function Dl(){function m(l,o){return function(a){t(o,"addInitializer"),n(a,"An initializer"),l.push(a)}}function e(l,o,u,a,r,y,v,T,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+o:o,static:y,private:v,metadata:T},d={v:!1};s.addInitializer=m(a,d);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[o]},h=function(x){this[o]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return l(w,s)}finally{d.v=!0}}function t(l,o){if(l.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(l,o){if(typeof l!="function")throw new TypeError(o+" must be a function")}function c(l,o){var u=typeof o;if(l===1){if(u!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(u!=="function"){var a;throw l===0?a="field":l===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function f(l,o,u,a,r,y,v,T,w){var p=u[0],s,d,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,D;if(typeof p=="function")h=e(p,a,s,T,r,y,v,w,i),h!==void 0&&(c(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,D=h.set||i.set,i={get:x,set:D}):i=h);else for(var _=p.length-1;_>=0;_--){var P=p[_];if(h=e(P,a,s,T,r,y,v,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,D=h.set||i.set,i={get:x,set:D}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(C,E){return E};else if(typeof d!="function"){var M=d;d=function(C,E){for(var R=E,L=0;L<M.length;L++)R=M[L].call(C,R);return R}}else{var j=d;d=function(C,E){return j.call(C,E)}}l.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(l.push(function(C,E){return i.get.call(C,E)}),l.push(function(C,E){return i.set.call(C,E)})):r===2?l.push(i):l.push(function(C,E){return i.call(C,E)}):Object.defineProperty(o,a,s))}function g(l,o,u){for(var a=[],r,y,v=new Map,T=new Map,w=0;w<o.length;w++){var p=o[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,D;if(h?(x=l,s=s-5,y=y||[],D=y):(x=l.prototype,r=r||[],D=r),s!==0&&!i){var _=h?T:v,P=_.get(d)||0;if(P===!0||P===3&&s!==4||P===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!P&&s>2?_.set(d,s):_.set(d,!0)}f(a,x,p,d,s,h,i,D,u)}}return b(a,r),b(a,y),a}function b(l,o){o&&l.push(function(u){for(var a=0;a<o.length;a++)o[a].call(u);return u})}function I(l,o,u){if(o.length>0){for(var a=[],r=l,y=l.name,v=o.length-1;v>=0;v--){var T={v:!1};try{var w=o[v](r,{kind:"class",name:y,addInitializer:m(a,T),metadata:u})}finally{T.v=!0}w!==void 0&&(c(10,w),r=w)}return[S(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function S(l,o){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,u,a,r){if(r!==void 0)var y=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(y===void 0?null:y),T=g(o,u,v);return a.length||S(o,v),{e:T,get c(){return I(o,a,v)}}}}function hs(m,e,t,n){return(hs=Dl())(m,e,t,n)}var ds,is,ms,ps,fs,ss,as,ls,cs,Sl;ds=X({selector:"potatno-preview",template:ns,style:os}),ms=ne("PreviewContent"),ps=ne("PreviewContainer"),fs=F.state();var us=class{static{({e:[ss,as,ls,cs],c:[Sl,is]}=hs(this,[[[V,ms],1,"contentElement"],[ps,1,"containerElement"],[[V,fs],1,"errors"],[V,4,"previewContent"],[V,2,"getContainer"],[V,2,"setContent"]],[ds]))}#e=(cs(this),ss(this));get contentElement(){return this.#e}set contentElement(e){this.#e=e}#t=as(this);get containerElement(){return this.#t}set containerElement(e){this.#t=e}#r=ls(this,[]);get errors(){return this.#r}set errors(e){this.#r=e}get hasErrors(){return this.errors.length>0}mDragging=!1;mStartX=0;mStartY=0;mStartWidth=0;mStartHeight=0;mStoredElement=null;set previewContent(e){console.log("[Preview] previewContent setter called with:",e),this.mStoredElement=e,this.tryAppendStoredElement()}onUpdate(){this.tryAppendStoredElement()}tryAppendStoredElement(){if(!this.mStoredElement)return;let e;try{e=this.contentElement}catch(t){console.error("[Preview] contentElement not accessible:",t);return}if(console.log("[Preview] tryAppendStoredElement - container:",e,"element:",this.mStoredElement,"contains:",e.contains(this.mStoredElement)),!e.contains(this.mStoredElement)){for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(this.mStoredElement),console.log("[Preview] element appended to container")}}getContainer(){return this.contentElement}setContent(e){let t=this.contentElement;for(;t.firstChild;)t.removeChild(t.firstChild);t.appendChild(e)}onResizePointerDown(e){e.preventDefault(),e.stopPropagation(),this.mDragging=!0,this.mStartX=e.clientX,this.mStartY=e.clientY;let t=this.containerElement;if(!t)return;this.mStartWidth=t.offsetWidth,this.mStartHeight=t.offsetHeight,e.target.setPointerCapture(e.pointerId);let n=f=>{if(!this.mDragging)return;let g=this.mStartX-f.clientX,b=this.mStartY-f.clientY,I=Math.max(200,this.mStartWidth+g),S=Math.max(150,this.mStartHeight+b);t.style.width=I+"px",t.style.height=S+"px"},c=f=>{this.mDragging=!1,f.target.releasePointerCapture(f.pointerId),document.removeEventListener("pointermove",n),document.removeEventListener("pointerup",c)};document.addEventListener("pointermove",n),document.addEventListener("pointerup",c)}static{is()}};var gs=`.resize-handle {\r
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
`;var vs=`<div [className]="this.getHandleClass()" (pointerdown)="this.onPointerDown($event)"></div>\r
`;function Nl(){function m(l,o){return function(a){t(o,"addInitializer"),n(a,"An initializer"),l.push(a)}}function e(l,o,u,a,r,y,v,T,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+o:o,static:y,private:v,metadata:T},d={v:!1};s.addInitializer=m(a,d);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[o]},h=function(x){this[o]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return l(w,s)}finally{d.v=!0}}function t(l,o){if(l.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(l,o){if(typeof l!="function")throw new TypeError(o+" must be a function")}function c(l,o){var u=typeof o;if(l===1){if(u!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(u!=="function"){var a;throw l===0?a="field":l===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function f(l,o,u,a,r,y,v,T,w){var p=u[0],s,d,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,D;if(typeof p=="function")h=e(p,a,s,T,r,y,v,w,i),h!==void 0&&(c(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,D=h.set||i.set,i={get:x,set:D}):i=h);else for(var _=p.length-1;_>=0;_--){var P=p[_];if(h=e(P,a,s,T,r,y,v,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,D=h.set||i.set,i={get:x,set:D}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(C,E){return E};else if(typeof d!="function"){var M=d;d=function(C,E){for(var R=E,L=0;L<M.length;L++)R=M[L].call(C,R);return R}}else{var j=d;d=function(C,E){return j.call(C,E)}}l.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(l.push(function(C,E){return i.get.call(C,E)}),l.push(function(C,E){return i.set.call(C,E)})):r===2?l.push(i):l.push(function(C,E){return i.call(C,E)}):Object.defineProperty(o,a,s))}function g(l,o,u){for(var a=[],r,y,v=new Map,T=new Map,w=0;w<o.length;w++){var p=o[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,D;if(h?(x=l,s=s-5,y=y||[],D=y):(x=l.prototype,r=r||[],D=r),s!==0&&!i){var _=h?T:v,P=_.get(d)||0;if(P===!0||P===3&&s!==4||P===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!P&&s>2?_.set(d,s):_.set(d,!0)}f(a,x,p,d,s,h,i,D,u)}}return b(a,r),b(a,y),a}function b(l,o){o&&l.push(function(u){for(var a=0;a<o.length;a++)o[a].call(u);return u})}function I(l,o,u){if(o.length>0){for(var a=[],r=l,y=l.name,v=o.length-1;v>=0;v--){var T={v:!1};try{var w=o[v](r,{kind:"class",name:y,addInitializer:m(a,T),metadata:u})}finally{T.v=!0}w!==void 0&&(c(10,w),r=w)}return[S(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function S(l,o){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,u,a,r){if(r!==void 0)var y=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(y===void 0?null:y),T=g(o,u,v);return a.length||S(o,v),{e:T,get c(){return I(o,a,v)}}}}function Es(m,e,t,n){return(Es=Nl())(m,e,t,n)}var Cs,ys,Is,Ds,bs,ws,xs,Al;Cs=X({selector:"potatno-resize-handle",template:vs,style:gs}),Is=F.state(),Ds=G("resize");var Ts=class{static{({e:[bs,ws,xs],c:[Al,ys]}=Es(this,[[[V,Is],1,"direction"],[Ds,1,"mResize"]],[Cs]))}#e=(xs(this),bs(this,"vertical"));get direction(){return this.#e}set direction(e){this.#e=e}#t=ws(this);get mResize(){return this.#t}set mResize(e){this.#t=e}mDragging=!1;mStartPosition=0;getHandleClass(){return`resize-handle ${this.direction}`}onPointerDown(e){e.preventDefault(),this.mDragging=!0,this.mStartPosition=this.direction==="vertical"?e.clientX:e.clientY,e.target.setPointerCapture(e.pointerId);let t=c=>{if(!this.mDragging)return;let f=this.direction==="vertical"?c.clientX:c.clientY,g=f-this.mStartPosition;this.mStartPosition=f,this.mResize.dispatchEvent({delta:g})},n=c=>{this.mDragging=!1,c.target.releasePointerCapture(c.pointerId),document.removeEventListener("pointermove",t),document.removeEventListener("pointerup",n)};document.addEventListener("pointermove",t),document.addEventListener("pointerup",n)}static{ys()}};var Ss=`.search-wrapper {\r
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
`;var _s=`<div class="search-wrapper">\r
    <svg class="search-icon" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">\r
        <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" stroke-width="1.5"/>\r
        <line x1="10.5" y1="10.5" x2="14.5" y2="14.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>\r
    </svg>\r
    <input class="search-field" type="text" [placeholder]="this.placeholder" [value]="this.value" (input)="this.onInput($event)"/>\r
</div>\r
`;function Ml(){function m(l,o){return function(a){t(o,"addInitializer"),n(a,"An initializer"),l.push(a)}}function e(l,o,u,a,r,y,v,T,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+o:o,static:y,private:v,metadata:T},d={v:!1};s.addInitializer=m(a,d);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[o]},h=function(x){this[o]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return l(w,s)}finally{d.v=!0}}function t(l,o){if(l.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(l,o){if(typeof l!="function")throw new TypeError(o+" must be a function")}function c(l,o){var u=typeof o;if(l===1){if(u!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(u!=="function"){var a;throw l===0?a="field":l===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function f(l,o,u,a,r,y,v,T,w){var p=u[0],s,d,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,D;if(typeof p=="function")h=e(p,a,s,T,r,y,v,w,i),h!==void 0&&(c(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,D=h.set||i.set,i={get:x,set:D}):i=h);else for(var _=p.length-1;_>=0;_--){var P=p[_];if(h=e(P,a,s,T,r,y,v,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,D=h.set||i.set,i={get:x,set:D}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(C,E){return E};else if(typeof d!="function"){var M=d;d=function(C,E){for(var R=E,L=0;L<M.length;L++)R=M[L].call(C,R);return R}}else{var j=d;d=function(C,E){return j.call(C,E)}}l.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(l.push(function(C,E){return i.get.call(C,E)}),l.push(function(C,E){return i.set.call(C,E)})):r===2?l.push(i):l.push(function(C,E){return i.call(C,E)}):Object.defineProperty(o,a,s))}function g(l,o,u){for(var a=[],r,y,v=new Map,T=new Map,w=0;w<o.length;w++){var p=o[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,D;if(h?(x=l,s=s-5,y=y||[],D=y):(x=l.prototype,r=r||[],D=r),s!==0&&!i){var _=h?T:v,P=_.get(d)||0;if(P===!0||P===3&&s!==4||P===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!P&&s>2?_.set(d,s):_.set(d,!0)}f(a,x,p,d,s,h,i,D,u)}}return b(a,r),b(a,y),a}function b(l,o){o&&l.push(function(u){for(var a=0;a<o.length;a++)o[a].call(u);return u})}function I(l,o,u){if(o.length>0){for(var a=[],r=l,y=l.name,v=o.length-1;v>=0;v--){var T={v:!1};try{var w=o[v](r,{kind:"class",name:y,addInitializer:m(a,T),metadata:u})}finally{T.v=!0}w!==void 0&&(c(10,w),r=w)}return[S(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function S(l,o){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,u,a,r){if(r!==void 0)var y=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(y===void 0?null:y),T=g(o,u,v);return a.length||S(o,v),{e:T,get c(){return I(o,a,v)}}}}function Os(m,e,t,n){return(Os=Ml())(m,e,t,n)}var Fs,Ps,Vs,$s,js,Ns,As,Rs,Ls,Ol;Fs=X({selector:"potatno-search-input",template:_s,style:Ss}),Vs=F.state(),$s=F.state(),js=G("search-change");var Ms=class{static{({e:[Ns,As,Rs,Ls],c:[Ol,Ps]}=Os(this,[[[V,Vs],1,"placeholder"],[[V,$s],1,"value"],[js,1,"mSearchChange"]],[Fs]))}#e=(Ls(this),Ns(this,"Search..."));get placeholder(){return this.#e}set placeholder(e){this.#e=e}#t=As(this,"");get value(){return this.#t}set value(e){this.#t=e}#r=Rs(this);get mSearchChange(){return this.#r}set mSearchChange(e){this.#r=e}onInput(e){let t=e.target;this.value=t.value,this.mSearchChange.dispatchEvent(this.value)}static{Ps()}};var zs=`.tabs-header {\r
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
`;var Gs=`<div class="tabs-header">\r
    $for(tab of this.tabs; index = $index) {\r
        <button [className]="this.getTabClass(this.index)" (click)="this.onTabClick(this.index)">{{this.tab}}</button>\r
    }\r
</div>\r
<div class="tabs-content">\r
    $slot\r
</div>\r
`;function $l(){function m(l,o){return function(a){t(o,"addInitializer"),n(a,"An initializer"),l.push(a)}}function e(l,o,u,a,r,y,v,T,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+o:o,static:y,private:v,metadata:T},d={v:!1};s.addInitializer=m(a,d);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[o]},h=function(x){this[o]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return l(w,s)}finally{d.v=!0}}function t(l,o){if(l.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(l,o){if(typeof l!="function")throw new TypeError(o+" must be a function")}function c(l,o){var u=typeof o;if(l===1){if(u!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(u!=="function"){var a;throw l===0?a="field":l===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function f(l,o,u,a,r,y,v,T,w){var p=u[0],s,d,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,D;if(typeof p=="function")h=e(p,a,s,T,r,y,v,w,i),h!==void 0&&(c(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,D=h.set||i.set,i={get:x,set:D}):i=h);else for(var _=p.length-1;_>=0;_--){var P=p[_];if(h=e(P,a,s,T,r,y,v,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,D=h.set||i.set,i={get:x,set:D}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(C,E){return E};else if(typeof d!="function"){var M=d;d=function(C,E){for(var R=E,L=0;L<M.length;L++)R=M[L].call(C,R);return R}}else{var j=d;d=function(C,E){return j.call(C,E)}}l.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(l.push(function(C,E){return i.get.call(C,E)}),l.push(function(C,E){return i.set.call(C,E)})):r===2?l.push(i):l.push(function(C,E){return i.call(C,E)}):Object.defineProperty(o,a,s))}function g(l,o,u){for(var a=[],r,y,v=new Map,T=new Map,w=0;w<o.length;w++){var p=o[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,D;if(h?(x=l,s=s-5,y=y||[],D=y):(x=l.prototype,r=r||[],D=r),s!==0&&!i){var _=h?T:v,P=_.get(d)||0;if(P===!0||P===3&&s!==4||P===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!P&&s>2?_.set(d,s):_.set(d,!0)}f(a,x,p,d,s,h,i,D,u)}}return b(a,r),b(a,y),a}function b(l,o){o&&l.push(function(u){for(var a=0;a<o.length;a++)o[a].call(u);return u})}function I(l,o,u){if(o.length>0){for(var a=[],r=l,y=l.name,v=o.length-1;v>=0;v--){var T={v:!1};try{var w=o[v](r,{kind:"class",name:y,addInitializer:m(a,T),metadata:u})}finally{T.v=!0}w!==void 0&&(c(10,w),r=w)}return[S(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function S(l,o){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,u,a,r){if(r!==void 0)var y=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(y===void 0?null:y),T=g(o,u,v);return a.length||S(o,v),{e:T,get c(){return I(o,a,v)}}}}function Zs(m,e,t,n){return(Zs=$l())(m,e,t,n)}var qs,Bs,Js,Ks,Qs,Us,Hs,Xs,Ys,jl;qs=X({selector:"potatno-tabs",template:Gs,style:zs}),Js=F.state(),Ks=F.state(),Qs=G("tab-change");var Ws=class{static{({e:[Us,Hs,Xs,Ys],c:[jl,Bs]}=Zs(this,[[[V,Js],1,"tabs"],[[V,Ks],1,"activeIndex"],[Qs,1,"mTabChange"]],[qs]))}#e=(Ys(this),Us(this,[]));get tabs(){return this.#e}set tabs(e){this.#e=e}#t=Hs(this,0);get activeIndex(){return this.#t}set activeIndex(e){this.#t=e}#r=Xs(this);get mTabChange(){return this.#r}set mTabChange(e){this.#r=e}getTabClass(e){return e===this.activeIndex?"tab-button active":"tab-button"}onTabClick(e){this.activeIndex=e,this.mTabChange.dispatchEvent(e)}static{Bs()}};function zl(){function m(l,o){return function(a){t(o,"addInitializer"),n(a,"An initializer"),l.push(a)}}function e(l,o,u,a,r,y,v,T,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+o:o,static:y,private:v,metadata:T},d={v:!1};s.addInitializer=m(a,d);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[o]},h=function(x){this[o]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return l(w,s)}finally{d.v=!0}}function t(l,o){if(l.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(l,o){if(typeof l!="function")throw new TypeError(o+" must be a function")}function c(l,o){var u=typeof o;if(l===1){if(u!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(u!=="function"){var a;throw l===0?a="field":l===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function f(l,o,u,a,r,y,v,T,w){var p=u[0],s,d,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,D;if(typeof p=="function")h=e(p,a,s,T,r,y,v,w,i),h!==void 0&&(c(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,D=h.set||i.set,i={get:x,set:D}):i=h);else for(var _=p.length-1;_>=0;_--){var P=p[_];if(h=e(P,a,s,T,r,y,v,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,D=h.set||i.set,i={get:x,set:D}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(C,E){return E};else if(typeof d!="function"){var M=d;d=function(C,E){for(var R=E,L=0;L<M.length;L++)R=M[L].call(C,R);return R}}else{var j=d;d=function(C,E){return j.call(C,E)}}l.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(l.push(function(C,E){return i.get.call(C,E)}),l.push(function(C,E){return i.set.call(C,E)})):r===2?l.push(i):l.push(function(C,E){return i.call(C,E)}):Object.defineProperty(o,a,s))}function g(l,o,u){for(var a=[],r,y,v=new Map,T=new Map,w=0;w<o.length;w++){var p=o[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,D;if(h?(x=l,s=s-5,y=y||[],D=y):(x=l.prototype,r=r||[],D=r),s!==0&&!i){var _=h?T:v,P=_.get(d)||0;if(P===!0||P===3&&s!==4||P===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!P&&s>2?_.set(d,s):_.set(d,!0)}f(a,x,p,d,s,h,i,D,u)}}return b(a,r),b(a,y),a}function b(l,o){o&&l.push(function(u){for(var a=0;a<o.length;a++)o[a].call(u);return u})}function I(l,o,u){if(o.length>0){for(var a=[],r=l,y=l.name,v=o.length-1;v>=0;v--){var T={v:!1};try{var w=o[v](r,{kind:"class",name:y,addInitializer:m(a,T),metadata:u})}finally{T.v=!0}w!==void 0&&(c(10,w),r=w)}return[S(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function S(l,o){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,u,a,r){if(r!==void 0)var y=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(y===void 0?null:y),T=g(o,u,v);return a.length||S(o,v),{e:T,get c(){return I(o,a,v)}}}}function ua(m,e,t,n){return(ua=zl())(m,e,t,n)}var ha,ks,da,ma,pa,fa,ga,va,ya,ba,ea,ta,ra,oa,na,ia,sa,aa,la,Ut;ha=X({selector:"potatno-code-editor",template:zr,style:jr}),da=F.state({complexValue:!0}),ma=F.state(),pa=F.state({complexValue:!0}),fa=F.state(),ga=F.state(),va=F.state(),ya=ne("panelLeft"),ba=ne("panelRight");var ca=class{static{({e:[ea,ta,ra,oa,na,ia,sa,aa,la],c:[Ut,ks]}=ua(this,[[da,1,"mCachedData"],[ma,1,"mEntryPointPreviewElement"],[pa,1,"mGraphPreviewResult"],[fa,1,"mGraphRefreshVersion"],[ga,1,"mNodeLibraryRefreshVersion"],[va,1,"mPreviewUpdateVersion"],[ya,1,"panelLeft"],[ba,1,"panelRight"],[V,4,"project"],[V,4,"file"],[V,2,"loadCode"],[V,2,"generateCode"],[V,2,"triggerPreviewUpdate"]],[ha]))}constructor(){this.mCachedData=this.createEmptyCachedData(),this.mHistory=new Pt,this.mHistoryDebounceTimer=null,this.mPreviewDebounceTimer=null,this.mPreviewDirty=!0,this.mResizeMoveHandler=null,this.mResizeState=null,this.mResizeUpHandler=null}mHistory;mActiveFunctionId=(la(this),"");mFile;mHistoryDebounceTimer;mPreviewDebounceTimer;mPreviewDirty;mProject;mResizeMoveHandler;mResizeState;mResizeUpHandler;#e=ea(this);get mCachedData(){return this.#e}set mCachedData(e){this.#e=e}#t=ta(this,null);get mEntryPointPreviewElement(){return this.#t}set mEntryPointPreviewElement(e){this.#t=e}#r=ra(this,null);get mGraphPreviewResult(){return this.#r}set mGraphPreviewResult(e){this.#r=e}#o=oa(this,0);get mGraphRefreshVersion(){return this.#o}set mGraphRefreshVersion(e){this.#o=e}#n=na(this,0);get mNodeLibraryRefreshVersion(){return this.#n}set mNodeLibraryRefreshVersion(e){this.#n=e}#i=ia(this,0);get mPreviewUpdateVersion(){return this.#i}set mPreviewUpdateVersion(e){this.#i=e}#s=sa(this);get panelLeft(){return this.#s}set panelLeft(e){this.#s=e}#a=aa(this);get panelRight(){return this.#a}set panelRight(e){this.#a=e}get activeFunction(){let e=this.mFile;if(!e)return null;for(let t of e.functions)if(t.id===this.mActiveFunctionId)return t;return null}get activeFunctionId(){return this.mActiveFunctionId}get activeFunctionName(){return this.mCachedData.activeFunctionName}get activeFunctionInputs(){return this.mCachedData.activeFunctionInputs}get activeFunctionOutputs(){return this.mCachedData.activeFunctionOutputs}get activeFunctionImports(){return this.mCachedData.activeFunctionImports}get activeFunctionIsSystem(){return this.mCachedData.activeFunctionIsSystem}get activeFunctionEditableByUser(){return this.mCachedData.activeFunctionEditableByUser}get availableImportsList(){return this.mCachedData.availableImports}get availableTypes(){return this.mCachedData.availableTypes}get editorErrors(){return this.mCachedData.errors}get entryPreviewElement(){return this.mEntryPointPreviewElement}get functionList(){return this.mCachedData.functionList}get graphPreviewResult(){return this.mGraphPreviewResult}get graphRefreshVersion(){return this.mGraphRefreshVersion}get hasPreview(){return this.mCachedData.hasPreview}get nodeLibraryRefreshVersion(){return this.mNodeLibraryRefreshVersion}get previewUpdateVersion(){return this.mPreviewUpdateVersion}get userFunctionDefinitions(){let e=this.mProject;return e?[...e.userFunctions.values()].map(t=>({id:t.id})):[]}get file(){return this.mFile??null}set project(e){this.mProject=e,this.rebuildCachedData(),this.refreshNodeLibrary()}set file(e){if(e){this.mFile=e;let t=this.mProject;t&&e.functions.size===0&&this.initializeMainFunctions(e,t),this.mActiveFunctionId=[...e.functions][0]?.id??""}else this.mFile=void 0,this.mActiveFunctionId="";this.mHistory.clear(),this.mGraphPreviewResult=null,this.mEntryPointPreviewElement=null,this.rebuildCachedData(),this.refreshGraph(),this.refreshNodeLibrary(),this.schedulePreviewUpdate()}loadCode(e){let t=this.mProject;if(!t)return;let c=new pt(t).deserialize(e);this.mFile=c,this.mActiveFunctionId=[...c.functions][0]?.id??"",this.mHistory.clear(),this.mGraphPreviewResult=null,this.mEntryPointPreviewElement=null,this.rebuildCachedData(),this.refreshGraph(),this.refreshNodeLibrary(),this.schedulePreviewUpdate()}generateCode(){let e=this.mFile;return e?new ft().serialize(e):null}triggerPreviewUpdate(){this.updatePreviewsFromCache()}onDeconstruct(){this.mHistoryDebounceTimer!==null&&(clearTimeout(this.mHistoryDebounceTimer),this.mHistoryDebounceTimer=null),this.mPreviewDebounceTimer!==null&&(clearTimeout(this.mPreviewDebounceTimer),this.mPreviewDebounceTimer=null),this.stopPanelResize()}onFunctionSelect(e){this.activateFunction(e.value)}onFunctionAdd(e){let t=e.value,n=this.mFile,c=this.mProject;if(!n||!c)return;let f=c.userFunctions.get(t);if(!f)return;let g=new ye(c,n,{definitionId:f.id,id:crypto.randomUUID(),isSystem:!1,label:`Function ${n.functions.size}`});f.getPrefilledNodes(g).forEach((b,I)=>{g.newNode(b,{height:4,width:10,x:2+I*12,y:2},!0),c.nodeDefinitions.some(S=>S.id===b.id)||c.addNodeDefinition(b)});for(let b of f.getNodeDefinitions(g))c.nodeDefinitions.some(I=>I.id===b.id)||c.addNodeDefinition(b);if((f.statics&je.imports)!==0)for(let b of c.imports)g.addImport(b.label);n.addFunction(g),this.mActiveFunctionId=g.id,this.scheduleHistorySnapshot(),this.rebuildCachedData(),this.refreshGraph(),this.refreshNodeLibrary()}onFunctionDelete(e){let t=e.value,n=this.mFile;if(n){for(let c of n.functions)if(c.id===t){n.removeFunction(c);break}this.mActiveFunctionId===t&&(this.mActiveFunctionId=[...n.functions][0]?.id??""),this.scheduleHistorySnapshot(),this.rebuildCachedData(),this.refreshGraph(),this.refreshNodeLibrary(),this.schedulePreviewUpdate()}}onPropertiesChange(e){let t=this.activeFunction;if(!t)return;let n=e.value,c=!1;if(n.name!==void 0&&(t.label=n.name),n.inputs!==void 0){let f=new Set(t.inputs.map(b=>b.label)),g=new Set(n.inputs.map(b=>b.name));for(let b of[...t.inputs])g.has(b.label)||t.removeInput(b);for(let b of n.inputs)f.has(b.name)||t.addInput({dataType:b.type,label:b.name});c=!0}if(n.outputs!==void 0){let f=new Set(t.outputs.map(b=>b.label)),g=new Set(n.outputs.map(b=>b.name));for(let b of[...t.outputs])g.has(b.label)||t.removeOutput(b);for(let b of n.outputs)f.has(b.name)||t.addOutput({dataType:b.type,label:b.name});c=!0}if(n.imports!==void 0){let f=new Set(t.imports),g=new Set(n.imports);for(let b of[...t.imports])g.has(b)||t.removeImport(b);for(let b of n.imports)f.has(b)||t.addImport(b);c=!0}this.scheduleHistorySnapshot(),this.rebuildCachedData(),this.refreshGraph(),c&&this.refreshNodeLibrary(),this.schedulePreviewUpdate()}onGraphChange(e){this.scheduleHistorySnapshot(),this.rebuildCachedData(),e.value.affectsLibrary&&this.refreshNodeLibrary(),e.value.affectsPreview&&this.schedulePreviewUpdate()}onGraphOpenFunction(e){this.activateFunction(e.value.functionId)}onGraphUndoRequest(e){let t=this.mHistory.undo();t&&this.restoreSnapshot(t)}onGraphRedoRequest(e){let t=this.mHistory.redo();t&&this.restoreSnapshot(t)}onResizeLeftStart(e){e.preventDefault(),this.startPanelResize("left",e)}onResizeRightStart(e){e.preventDefault(),this.startPanelResize("right",e)}activateFunction(e){let t=this.mFile;if(t){for(let n of t.functions)if(n.id===e){this.mActiveFunctionId=e,this.rebuildCachedData(),this.refreshGraph(),this.refreshNodeLibrary();return}}}createEmptyCachedData(){return{activeFunctionEditableByUser:!1,activeFunctionId:"",activeFunctionImports:[],activeFunctionInputs:[],activeFunctionIsSystem:!1,activeFunctionName:"",activeFunctionOutputs:[],availableImports:[],availableTypes:[],errors:[],functionList:[],hasPreview:!1}}evaluatePreview(){let e=this.mProject,t=this.mFile;if(!e||!t||!this.mPreviewDirty)return;this.mPreviewDirty=!1;let n;for(let b of t.functions)if(b.isSystem){n=b;break}if(!n)return;let c=new Set;for(let b of this.getAvailableDefinitionsForFunction(n))b.preview&&c.add(b.id);let f=new Set;for(let b of n.nodes)c.has(b.definitionId)&&f.add(b);let g=e.entryPoint.preview;g&&!this.mEntryPointPreviewElement&&(this.mEntryPointPreviewElement=g.generate());try{let b=new _t(e);this.mGraphPreviewResult=b.generateFunctionCodeWithIntermediates(n,f),this.updatePreviewsFromCache()}catch(b){console.error("[Editor] Preview code generation failed:",b)}}getAvailableDefinitionsForFunction(e){let t=[],n=new Set,c=g=>{n.has(g.id)||(n.add(g.id),t.push(g))};for(let g of e.project.nodeDefinitions)c(g);for(let g of e.nodeDefinitions)c(g);let f=new Set(e.imports);for(let g of e.project.imports)if(f.has(g.label))for(let b of g.nodes)c(b);return t}initializeMainFunctions(e,t){let n=t.entryPoint;if(!n)return;let c=new ye(t,e,{definitionId:n.id,id:crypto.randomUUID(),isSystem:!0,label:"Main"});n.getPrefilledNodes(c).forEach((f,g)=>{c.newNode(f,{height:4,width:10,x:2+g*12,y:2},!0),t.nodeDefinitions.some(b=>b.id===f.id)||t.addNodeDefinition(f)});for(let f of n.getNodeDefinitions(c))t.nodeDefinitions.some(g=>g.id===f.id)||t.addNodeDefinition(f);if((n.statics&je.imports)!==0)for(let f of t.imports)c.addImport(f.label);e.addFunction(c)}pushHistorySnapshot(){let e=this.mFile;if(!e)return;let t=new ft;this.mHistory.push(t.serialize(e))}rebuildCachedData(){let e=this.mProject,t=this.mFile,n=this.activeFunction,c=this.createEmptyCachedData();if(c.activeFunctionId=this.mActiveFunctionId,c.hasPreview=e?.entryPoint.preview!==null&&e?.entryPoint.preview!==void 0,t){for(let f of t.validate())f.item instanceof ve&&c.errors.push({location:`Node "${f.item.node.label}"`,message:f.message});for(let f of t.functions)c.functionList.push({id:f.id,label:f.label,name:f.label,system:f.isSystem})}if(c.availableImports=e?.imports.map(f=>f.label)??[],e){let f=new Set;for(let[g]of e.types.types)f.add(g);c.availableTypes=[...f].sort()}n&&(c.activeFunctionEditableByUser=!n.isSystem,c.activeFunctionImports=[...n.imports],c.activeFunctionInputs=n.inputs.map(f=>({name:f.label,type:f.dataType})),c.activeFunctionIsSystem=n.isSystem,c.activeFunctionName=n.label,c.activeFunctionOutputs=n.outputs.map(f=>({name:f.label,type:f.dataType}))),this.mCachedData=c}refreshGraph(){this.mGraphRefreshVersion++}refreshNodeLibrary(){this.mNodeLibraryRefreshVersion++}restoreSnapshot(e){let t=this.mProject;if(!t)return;let n=new pt(t);this.mFile=n.deserialize(e),[...this.mFile.functions].some(c=>c.id===this.mActiveFunctionId)||(this.mActiveFunctionId=[...this.mFile.functions][0]?.id??""),this.mGraphPreviewResult=null,this.mEntryPointPreviewElement=null,this.rebuildCachedData(),this.refreshGraph(),this.refreshNodeLibrary(),this.schedulePreviewUpdate()}scheduleHistorySnapshot(){this.mHistoryDebounceTimer!==null&&clearTimeout(this.mHistoryDebounceTimer),this.mHistoryDebounceTimer=setTimeout(()=>{this.mHistoryDebounceTimer=null,this.pushHistorySnapshot()},500)}schedulePreviewUpdate(){this.mPreviewDirty=!0,this.mPreviewDebounceTimer!==null&&clearTimeout(this.mPreviewDebounceTimer),this.mPreviewDebounceTimer=setTimeout(()=>{this.mPreviewDebounceTimer=null,this.evaluatePreview()},300)}startPanelResize(e,t){let n=e==="left"?this.panelLeft:this.panelRight;this.mResizeState={panel:e,startWidth:n.offsetWidth,startX:t.clientX};let c=g=>{if(!this.mResizeState)return;let b=e==="left"?g.clientX-this.mResizeState.startX:this.mResizeState.startX-g.clientX;n.style.width=`${Math.max(200,Math.min(500,this.mResizeState.startWidth+b))}px`},f=()=>{document.removeEventListener("pointermove",c),document.removeEventListener("pointerup",f),this.mResizeMoveHandler=null,this.mResizeState=null,this.mResizeUpHandler=null};this.stopPanelResize(),this.mResizeMoveHandler=c,this.mResizeUpHandler=f,document.addEventListener("pointermove",c),document.addEventListener("pointerup",f)}stopPanelResize(){this.mResizeMoveHandler&&(document.removeEventListener("pointermove",this.mResizeMoveHandler),this.mResizeMoveHandler=null),this.mResizeUpHandler&&(document.removeEventListener("pointerup",this.mResizeUpHandler),this.mResizeUpHandler=null),this.mResizeState=null}updatePreviewsFromCache(){let e=this.mProject,t=this.mGraphPreviewResult;if(!e||!t)return;let n=e.entryPoint.preview;if(n&&this.mEntryPointPreviewElement)try{n.update(this.mEntryPointPreviewElement,t.codeFunction,{},t.fullCode)}catch(c){console.error("[Editor] Entry preview update failed:",c)}this.mPreviewUpdateVersion++}static{ks()}};var wa=`:host {\r
    display: block;\r
    width: 100%;\r
    height: 100%;\r
}\r
\r
potatno-code-editor {\r
    display: block;\r
    width: 100%;\r
    height: 100%;\r
}`;var xa=`:host {\r
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
`;var Lt=class extends ke{mCodeEditor;mProject;get document(){return this.mCodeEditor.file}set document(e){this.mCodeEditor.file=e}get project(){return this.mProject}constructor(e){super(),this.mProject=e,this.addStyle(xa),this.addStyle(wa),this.mCodeEditor=this.addContent(Ut),this.mCodeEditor.project=e}update(){this.mCodeEditor.triggerPreviewUpdate()}};var B=class m extends pe{static new(e){return new m(e)}constructor(e){super({id:e.id,label:e.label,category:e.category,regions:e.regions??null,generators:{ports:{inputs:()=>e.ports.inputs??[],outputs:()=>e.ports.outputs??[]},code:e.generators.code,preview:e.generators.preview??null}})}};var Mt=class m{static new(e){return new m(e)}mTypes;get types(){return this.mTypes}get typeNames(){return Array.from(this.mTypes.keys())}constructor(e){this.mTypes=new Map;for(let[t,n]of Object.entries(e))this.mTypes.set(t,{name:t,...n})}getType(e){if(!this.mTypes.has(e))throw new Error(`Type "${e}" is not defined in the project types definition.`);return this.mTypes.get(e)}isGenericType(e){return/^<[^>]+>$/.test(e)}};var Ot=class m extends pe{static new(){return new m}constructor(){super({id:"3f7c1a2b-5d4e-4890-b6f8-9a0c3e7d2f1b",label:"Flow Conjunction",category:z.Reroute,generators:{ports:{inputs:()=>[{label:"in",id:"in",portType:"flow"}],outputs:()=>[{label:"out",id:"out",portType:"flow"}]},code:()=>{throw new A("Conjunction node code generators should never be called.",m)}}})}};var Ft=class m extends pe{static new(){return new m}constructor(){super({id:"8b2e4a6c-1f3d-4750-a9e2-7c5b0d8f3e4a",label:"Value Conjunction",category:z.Reroute,generators:{ports:{inputs:()=>[{label:"in",id:"in",portType:"value",dataType:"<T>"}],outputs:()=>[{label:"out",id:"out",portType:"value",dataType:"<T>"}]},code:()=>{throw new A("Conjunction node code generators should never be called.",m)}}})}};var Vt=class m{static new(e){return new m(e)}mEntryPoint;mImports;mNodeDefinitions;mTypes;mUserFunctions;get entryPoint(){return this.mEntryPoint}get imports(){return this.mImports}get nodeDefinitions(){return Array.from(this.mNodeDefinitions.values())}get types(){return this.mTypes}get userFunctions(){return this.mUserFunctions}constructor(e){this.mEntryPoint=e.entryPoint,this.mTypes=e.types,this.mNodeDefinitions=new Map,this.mImports=new Array,this.mUserFunctions=new Map,this.addNodeDefinition(Ot.new()),this.addNodeDefinition(Ft.new())}addImport(e){this.mImports.push(e)}addNodeDefinition(e){this.mNodeDefinitions.set(e.id,e)}addUserFunction(e){this.mUserFunctions.set(e.id,e)}getFunction(e){return this.mEntryPoint.id===e?this.mEntryPoint:this.mUserFunctions.get(e)}};(()=>{let m=new WebSocket("ws://127.0.0.1:8088");m.addEventListener("open",()=>{console.log("Refresh connection established")}),m.addEventListener("message",e=>{console.log("Bundle finished. Start refresh"),e.data==="REFRESH"&&window.location.reload()})})();var Ht=Mt.new({number:{defaultValue:["0"],convert:m=>{let e=m[0],t=parseFloat(e);if(isNaN(t))throw new Error(`Invalid number: "${e}"`);return t.toString()},inputs:[{name:"value",type:"number"}]},string:{defaultValue:[""],convert:m=>m[0],inputs:[{name:"value",type:"string"}]},boolean:{defaultValue:["false"],convert:m=>{let e=m[0].toLowerCase();if(e==="true")return"true";if(e==="false")return"false";throw new Error(`Invalid boolean: "${m[0]}"`)},inputs:[{name:"value",type:"boolean"}]}}),Y=Vt.new({types:Ht,entryPoint:mt.new(Ht,{id:"pixelShader",label:"Pixel Shader",statics:je.imports|je.inputs,nodes:{prefilled:m=>{m(B.new({id:"OnPixel",label:"OnPixel",category:"event",ports:{inputs:[],outputs:[{label:"exec",id:"exec",portType:"flow"},{label:"x",id:"x",portType:"value",dataType:"number"},{label:"y",id:"y",portType:"value",dataType:"number"}]},generators:{code:e=>`const ${e.outputs.x.valueId} = __pixel_x;
const ${e.outputs.y.valueId} = __pixel_y;`}})),m(B.new({id:"PixelResult",label:"PixelResult",category:z.Output,ports:{inputs:[{label:"exec",id:"exec",portType:"flow"},{label:"red",id:"red",portType:"value",dataType:"number"},{label:"green",id:"green",portType:"value",dataType:"number"},{label:"blue",id:"blue",portType:"value",dataType:"number"}],outputs:[]},generators:{code:e=>`__pixel_r = ${e.inputs.red.valueId};
__pixel_g = ${e.inputs.green.valueId};
__pixel_b = ${e.inputs.blue.valueId};`}}))}},generator:{code:{body:m=>{let e=m.inputs.map(n=>n.valueId).join(", "),t=e?`__pixel_x, __pixel_y, ${e}`:"__pixel_x, __pixel_y";return`function ${m.name}(${t}) {
let __pixel_r = 0, __pixel_g = 0, __pixel_b = 0;
${m.bodyCode}
return [__pixel_r, __pixel_g, __pixel_b];
}`},value:m=>`${m.inputs}`},preview:{generate:()=>{let m=document.createElement("canvas");return m.width=100,m.height=100,m.style.cssText="width: 100px; height: 100px; image-rendering: pixelated; background: #000;",m},update:(m,e,t,n)=>{let c=m,f=c.getContext("2d"),g=f.createImageData(c.width,c.height),b=Function(n+`
return `+e.name+";")();for(let I=0;I<g.height;I++)for(let S=0;S<g.width;S++){let l=b(S/g.width,I/g.height),o=(I*g.width+S)*4;g.data[o]=Math.max(0,Math.min(255,Math.round(l[0]*255))),g.data[o+1]=Math.max(0,Math.min(255,Math.round(l[1]*255))),g.data[o+2]=Math.max(0,Math.min(255,Math.round(l[2]*255))),g.data[o+3]=255}f.putImageData(g,0,0)}}}})});Y.addImport({id:"Math",label:"Math",nodes:[B.new({id:"Math.PI",label:"Math.PI",category:"value",ports:{inputs:[],outputs:[{label:"value",id:"value",portType:"value",dataType:"number"}]},generators:{code:m=>`const ${m.outputs.value.valueId} = Math.PI;`}}),B.new({id:"Math.E",label:"Math.E",category:"value",ports:{inputs:[],outputs:[{label:"value",id:"value",portType:"value",dataType:"number"}]},generators:{code:m=>`const ${m.outputs.value.valueId} = Math.E;`}}),B.new({id:"Math.abs",label:"Math.abs",category:z.Function,ports:{inputs:[{label:"value",id:"value",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:m=>`const ${m.outputs.result.valueId} = Math.abs(${m.inputs.value.valueId});`}}),B.new({id:"Math.floor",label:"Math.floor",category:z.Function,ports:{inputs:[{label:"value",id:"value",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:m=>`const ${m.outputs.result.valueId} = Math.floor(${m.inputs.value.valueId});`}}),B.new({id:"Math.random",label:"Math.random",category:z.Function,ports:{inputs:[],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:m=>`const ${m.outputs.result.valueId} = Math.random();`}})]});Y.addNodeDefinition(B.new({id:"Add",label:"Add",category:"operator",ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:m=>`const ${m.outputs.result.valueId} = ${m.inputs.a.valueId} + ${m.inputs.b.valueId};`}}));Y.addNodeDefinition(B.new({id:"Subtract",label:"Subtract",category:"operator",ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:m=>`const ${m.outputs.result.valueId} = ${m.inputs.a.valueId} - ${m.inputs.b.valueId};`}}));Y.addNodeDefinition(B.new({id:"Multiply",label:"Multiply",category:"operator",ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:m=>`const ${m.outputs.result.valueId} = ${m.inputs.a.valueId} * ${m.inputs.b.valueId};/*MULTIPLYHOOK_${m.outputs.result.valueId}*/`,preview:{generate:()=>{let m=document.createElement("canvas");return m.width=50,m.height=50,m.style.cssText="width: 50px; height: 50px; image-rendering: pixelated; border: 1px solid rgba(255,255,255,0.1); border-radius: 2px;",m},update:(m,e,t,n,c)=>{let f=m,g=f.getContext("2d"),b=g.createImageData(f.width,f.height),I=c.replace(`/*MULTIPLYHOOK_${e.outputs.result.valueId}*/`,`return ${e.outputs.result.valueId};`),S=Function(I+`
return `+t.name+";")();for(let l=0;l<b.height;l++)for(let o=0;o<b.width;o++){let u=S(o/b.width,l/b.height),a=(l*b.width+o)*4;b.data[a]=Math.max(0,Math.min(255,Math.round(u*255))),b.data[a+1]=Math.max(0,Math.min(255,Math.round(u*255))),b.data[a+2]=Math.max(0,Math.min(255,Math.round(u*255))),b.data[a+3]=255}g.putImageData(b,0,0)}}}}));Y.addNodeDefinition(B.new({id:"Divide",label:"Divide",category:"operator",ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:m=>`const ${m.outputs.result.valueId} = ${m.inputs.a.valueId} / ${m.inputs.b.valueId};`}}));Y.addNodeDefinition(B.new({id:"Modulo",label:"Modulo",category:"operator",ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:m=>`const ${m.outputs.result.valueId} = ${m.inputs.a.valueId} % ${m.inputs.b.valueId};`}}));Y.addNodeDefinition(B.new({id:"Equal",label:"Equal",category:"operator",ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"boolean"}]},generators:{code:m=>`const ${m.outputs.result.valueId} = ${m.inputs.a.valueId} === ${m.inputs.b.valueId};`}}));Y.addNodeDefinition(B.new({id:"Not Equal",label:"Not Equal",category:"operator",ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"boolean"}]},generators:{code:m=>`const ${m.outputs.result.valueId} = ${m.inputs.a.valueId} !== ${m.inputs.b.valueId};`}}));Y.addNodeDefinition(B.new({id:"Less Than",label:"Less Than",category:"operator",ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"boolean"}]},generators:{code:m=>`const ${m.outputs.result.valueId} = ${m.inputs.a.valueId} < ${m.inputs.b.valueId};`}}));Y.addNodeDefinition(B.new({id:"Greater Than",label:"Greater Than",category:"operator",ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"boolean"}]},generators:{code:m=>`const ${m.outputs.result.valueId} = ${m.inputs.a.valueId} > ${m.inputs.b.valueId};`}}));Y.addNodeDefinition(B.new({id:"And",label:"And",category:"operator",ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"boolean"},{label:"b",id:"b",portType:"value",dataType:"boolean"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"boolean"}]},generators:{code:m=>`const ${m.outputs.result.valueId} = ${m.inputs.a.valueId} && ${m.inputs.b.valueId};`}}));Y.addNodeDefinition(B.new({id:"Or",label:"Or",category:"operator",ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"boolean"},{label:"b",id:"b",portType:"value",dataType:"boolean"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"boolean"}]},generators:{code:m=>`const ${m.outputs.result.valueId} = ${m.inputs.a.valueId} || ${m.inputs.b.valueId};`}}));Y.addNodeDefinition(B.new({id:"Not",label:"Not",category:"operator",ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"boolean"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"boolean"}]},generators:{code:m=>`const ${m.outputs.result.valueId} = !${m.inputs.a.valueId};`}}));Y.addNodeDefinition(B.new({id:"Number to String",label:"Number to String",category:"type-conversion",ports:{inputs:[{label:"input",id:"input",portType:"value",dataType:"number"}],outputs:[{label:"output",id:"output",portType:"value",dataType:"string"}]},generators:{code:m=>`const ${m.outputs.output.valueId} = String(${m.inputs.input.valueId});`}}));Y.addNodeDefinition(B.new({id:"String to Number",label:"String to Number",category:"type-conversion",ports:{inputs:[{label:"input",id:"input",portType:"value",dataType:"string"}],outputs:[{label:"output",id:"output",portType:"value",dataType:"number"}]},generators:{code:m=>`const ${m.outputs.output.valueId} = Number(${m.inputs.input.valueId});`}}));Y.addNodeDefinition(B.new({id:"Boolean to String",label:"Boolean to String",category:"type-conversion",ports:{inputs:[{label:"input",id:"input",portType:"value",dataType:"boolean"}],outputs:[{label:"output",id:"output",portType:"value",dataType:"string"}]},generators:{code:m=>`const ${m.outputs.output.valueId} = String(${m.inputs.input.valueId});`}}));Y.addNodeDefinition(B.new({id:"If",label:"If",category:"flow",ports:{inputs:[{label:"exec",id:"exec",portType:"flow"},{label:"condition",id:"condition",portType:"value",dataType:"boolean"}],outputs:[{label:"then",id:"then",portType:"flow"},{label:"else",id:"else",portType:"flow"}]},generators:{code:m=>`if (${m.inputs.condition.valueId}) {
${m.outputs.then.code.inner}
} else {
${m.outputs.else.code.inner}
}`}}));Y.addNodeDefinition(B.new({id:"While",label:"While",category:"flow",ports:{inputs:[{label:"exec",id:"exec",portType:"flow"},{label:"condition",id:"condition",portType:"value",dataType:"boolean"}],outputs:[{label:"body",id:"body",portType:"flow"}]},generators:{code:m=>`while (${m.inputs.condition.valueId}) {
${m.outputs.body.code.inner}
}`}}));Y.addNodeDefinition(B.new({id:"For Loop",label:"For Loop",category:"flow",ports:{inputs:[{label:"exec",id:"exec",portType:"flow"},{label:"count",id:"count",portType:"value",dataType:"number"}],outputs:[{label:"exec",id:"exec",portType:"flow"},{label:"index",id:"index",portType:"value",dataType:"number"}]},generators:{code:m=>`for (let ${m.outputs.index.valueId} = 0; ${m.outputs.index.valueId} < ${m.inputs.count.valueId}; ${m.outputs.index.valueId}++) {
${m.outputs.exec.code.inner}
}`}}));Y.addNodeDefinition(B.new({id:"Console Log",label:"Console Log",category:z.Function,ports:{inputs:[{label:"message",id:"message",portType:"value",dataType:"string"}],outputs:[]},generators:{code:({inputs:m})=>`console.log(${m.message.valueId});`}}));Y.addNodeDefinition(B.new({id:"String Concat",label:"String Concat",category:z.Function,ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"string"},{label:"b",id:"b",portType:"value",dataType:"string"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"string"}]},generators:{code:m=>`const ${m.outputs.result.valueId} = ${m.inputs.a.valueId} + ${m.inputs.b.valueId};`}}));Y.addUserFunction(mt.new(Ht,{id:"Helper Function",label:"Helper Function",statics:je.none,nodes:{},generator:{code:{body:m=>{let e=m.inputs.map(c=>c.valueId).join(", "),t=m.outputs.map(c=>c.valueId).join(", "),n=m.bodyCode;return t&&(n+=`
return ${m.outputs.length>1?`[${t}]`:t};`),`function ${m.name}(${e}) {
${n}
}`},value:m=>{let e=Object.values(m.inputs).map(n=>n.valueId).join(", ");return`const ${Object.values(m.outputs).map(n=>n.valueId)[0]??"_unused"} = ${m.inputs}(${e});`}}}}));var Xt=new Lt(Y);Xt.appendTo(document.body);Xt.document=new Ge(Y);function Ta(){Xt.update(),requestAnimationFrame(Ta)}Ta();})();
//# sourceMappingURL=page.js.map
