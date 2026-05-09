(()=>{var Mt=class m extends Array{static newListWith(...t){let e=new m;return e.push(...t),e}clear(){this.splice(0,this.length)}clone(){return m.newListWith(...this)}distinct(){return m.newListWith(...new Set(this))}equals(t){if(this===t)return!0;if(!t||this.length!==t.length)return!1;for(let e=0;e<this.length;++e)if(this[e]!==t[e])return!1;return!0}remove(t){let e=this.indexOf(t);if(e!==-1)return this.splice(e,1)[0]}replace(t,e){let n=this.indexOf(t);if(n!==-1){let c=this[n];return this[n]=e,c}}toString(){return`[${super.join(", ")}]`}};var A=class extends Error{mTarget;get target(){return this.mTarget}constructor(t,e,n){super(t,n),this.mTarget=e}};var Q=class m extends Map{add(t,e){if(!this.has(t))this.set(t,e);else throw new A("Can't add duplicate key to dictionary.",this)}clone(){return new m(this)}getAllKeysOfValue(t){return[...this.entries()].filter(c=>c[1]===t).map(c=>c[0])}getOrDefault(t,e){let n=this.get(t);return typeof n<"u"?n:e}map(t){let e=new Mt;for(let n of this){let c=t(n[0],n[1]);e.push(c)}return e}};var Ct=class m{mSize;mTopItem;get size(){return this.mSize}get top(){if(this.mTopItem)return this.mTopItem.value}constructor(){this.mTopItem=null,this.mSize=0}clone(){let t=new m;return t.mTopItem=this.mTopItem,t.mSize=this.mSize,t}*entries(){let t=this.mTopItem;for(;t!==null;)yield t.value,t=t.previous}flush(){let t=new Array;for(;this.mTopItem;)t.push(this.pop());return t}pop(){if(!this.mTopItem)return;let t=this.mTopItem.value;return this.mTopItem=this.mTopItem.previous,this.mSize--,t}push(t){let e={previous:this.mTopItem,value:t};this.mTopItem=e,this.mSize++}toArray(){return[...this.entries()]}};var Jt=class{mCompareFunction;constructor(t){this.mCompareFunction=t}differencesOf(t,e){let n;if(t.length===0||e.length===0){if(n=new Array,t.length===0)for(let D=0;D<e.length;D++)n.push({changeState:gt.Insert,item:e[D]});else for(let D=0;D<t.length;D++)n.push({changeState:gt.Remove,item:t[D]});return n}let c={1:{x:0,history:[]}},f=D=>D-1,g=t.length,y=e.length,I;for(let D=0;D<g+y+1;D++)for(let l=-D;l<D+1;l+=2){let o=l===-D||l!==D&&c[l-1].x<c[l+1].x;if(o){let a=c[l+1];I=a.x,n=a.history}else{let a=c[l-1];I=a.x+1,n=a.history}n=n.slice();let u=I-l;for(1<=u&&u<=y&&o?n.push({changeState:gt.Insert,item:e[f(u)]}):1<=I&&I<=g&&n.push({changeState:gt.Remove,item:t[f(I)]});I<g&&u<y&&this.mCompareFunction(t[f(I+1)],e[f(u+1)]);)I+=1,u+=1,n.push({changeState:gt.Keep,item:t[f(I)]});if(I>=g&&u>=y)return n;c[l]={x:I,history:n}}return new Array}},gt=function(m){return m[m.Remove=1]="Remove",m[m.Insert=2]="Insert",m[m.Keep=3]="Keep",m}({});var Kt=class m{static new(t){return new m(t)}mLabel;mId;mPortType;mDataType;mRegions;get label(){return this.mLabel}get id(){return this.mId}get portType(){return this.mPortType}get dataType(){return this.mDataType}get regions(){return this.mRegions}constructor(t){this.mLabel=t.label,this.mId=t.id,this.mPortType=t.portType,t.portType==="value"?this.mDataType=t.dataType:this.mDataType=null,this.mRegions={add:t.regions?.add??new Array}}};var pt=class{mId;mCategory;mLabel;mRegions;mCodeGenerator;mPortProvider;mPreviewGenerator;get id(){return this.mId}get category(){return this.mCategory}get inputs(){return this.mPortProvider.inputs().map(t=>Kt.new(t))}get label(){return this.mLabel}get outputs(){return this.mPortProvider.outputs().map(t=>Kt.new(t))}get regions(){return this.mRegions}get codeGenerator(){return this.mCodeGenerator}get preview(){return this.mPreviewGenerator}getPort(t){return[...this.inputs,...this.outputs].find(e=>e.id===t)}constructor(t){this.mId=t.id,this.mLabel=t.label,this.mCategory=t.category,this.mCodeGenerator=t.generators.code,this.mPortProvider=t.generators.ports,this.mPreviewGenerator=t.generators.preview??null,this.mRegions={add:t.regions?.add??new Array,allows:t.regions?.allows??new Array,requires:t.regions?.requires??new Array}}};var Qt=class m extends pt{static new(t){return new m(t)}mFunction;get function(){return this.mFunction}constructor(t){let e=()=>{let f=t.inputs.map(g=>({label:g.label,id:g.label,portType:"value",dataType:g.dataType}));return f.unshift({label:"Input",id:"Input",portType:"flow"}),f},n=()=>{let f=t.outputs.map(g=>({label:g.label,id:g.label,portType:"value",dataType:g.dataType}));return f.unshift({label:"Output",id:"Output",portType:"flow"}),f},c=t.project.getFunction(t.definitionId);super({id:`USERFUNCTION_${t.id}`,label:t.label,category:"user function",generators:{ports:{inputs:e,outputs:n},code:c?.codeGenerator.value??(()=>""),preview:null}}),this.mFunction=t}};var vt=class{mLabel;mConnectedPorts;mDefinitionId;mDirection;mDirectValue;mDocument;mNode;mPortType;mProject;mValueType;get connectedPorts(){return this.mConnectedPorts}get direction(){return this.mDirection}get directValue(){return this.mDirectValue}get definitionId(){return this.mDefinitionId}get document(){return this.mDocument}get label(){return this.mLabel}set label(t){this.mLabel=t}get node(){return this.mNode}get portType(){return this.mPortType}get project(){return this.mProject}get dataType(){return this.mValueType??""}get resolvedDataType(){if(this.mPortType!=="value")return this.dataType;if(!this.mProject.types.isGenericType(this.mValueType??""))return this.dataType;if(this.mDirection==="output"){let t=this.mNode.inputs.values().find(e=>e.dataType===this.mValueType);return t?t.resolvedDataType:this.dataType}return this.mDirection==="input"?this.mConnectedPorts.size===0?this.dataType:this.mConnectedPorts.values().next().value.resolvedDataType:this.dataType}constructor(t,e,n){if(n.portType==="flow"&&n.dataType!==null)throw new A("Flow ports cannot have a value type.",this);if(n.portType==="value"&&n.dataType===null)throw new A("Value ports must have a value type.",this);this.mProject=t,this.mDocument=e,this.mNode=n.node,this.mDefinitionId=n.definitionId,this.mLabel=n.label,this.mValueType=n.dataType,this.mDirection=n.direction,this.mPortType=n.portType,this.mConnectedPorts=new Set,this.mDirectValue=new Array,n.dataType&&!this.mProject.types.isGenericType(n.dataType)&&this.mDirectValue.push(...t.types.getType(n.dataType).defaultValue)}connect(t){if(this.mConnectedPorts.has(t))return;if(this.mPortType!==t.portType)throw new A(`Cannot connect port ${this.mDefinitionId} of node ${this.mNode.label} to port ${t.mDefinitionId} of node ${t.node.label} due to incompatible port types.`,this);if(this.mDirection===t.direction)throw new A(`Cannot connect port ${this.mDefinitionId} of node ${this.mNode.label} to port ${t.mDefinitionId} of node ${t.node.label} due to incompatible directions.`,this);if(!(this.mPortType==="flow"&&this.mDirection==="input"||this.mPortType==="value"&&this.mDirection==="output"))for(let n of Array.from(this.mConnectedPorts))this.disconnect(n);this.mConnectedPorts.add(t),t.connect(this)}disconnect(t){this.mConnectedPorts.has(t)&&(this.mConnectedPorts.delete(t),t.disconnect(this))}setDirectValue(t){if(this.mPortType!=="value")throw new A("Only value ports can have a direct value.",this);if(this.mProject.types.isGenericType(this.mValueType))throw new A("Generic value ports cannot have a direct value.",this);if(t.length!==this.mProject.types.getType(this.mValueType).defaultValue.length)throw new A("The provided value does not match the expected length of the default value for this port's type.",this);this.mDirectValue.splice(0,this.mDirectValue.length),this.mDirectValue.push(...t)}validate(){let t=new Array;if(this.mDirection==="output"){if(this.mPortType==="flow"&&this.mConnectedPorts.size>1&&t.push(new k(`Flow output port "${this.mDefinitionId}" on node "${this.mNode.label}" can only have one connection.`,this)),this.mPortType==="value"&&this.mProject.types.isGenericType(this.mValueType??"")){let e=this.mNode.inputs.values().filter(n=>n.dataType===this.mValueType);for(let n of e)n.connectedPorts.size===0&&t.push(new k(`Generic output port "${this.mDefinitionId}" on node "${this.mNode.label}" cannot resolve generic type "${this.mValueType}" because its input port "${n.definitionId}" is not connected.`,this))}return t}if(this.mDirection==="input"){if(this.mPortType==="flow")return this.mConnectedPorts.size===0&&t.push(new k(`Flow input port "${this.mDefinitionId}" on node "${this.mNode.label}" must have at least one connection.`,this)),t;if(this.mPortType==="value"){this.mConnectedPorts.size>1&&t.push(new k(`Value input port "${this.mDefinitionId}" on node "${this.mNode.label}" can only have one connection.`,this));for(let e of this.mConnectedPorts)e.resolvedDataType!==this.resolvedDataType&&t.push(new k(`Value input port "${this.mDefinitionId}" on node "${this.mNode.label}" expects type "${this.resolvedDataType}" but is connected to type "${e.resolvedDataType}".`,this));return t}}return t}};var It=class{mCategory;mDefinitionId;mDocument;mFunction;mInputs;mLabel;mOutputs;mIsSystem;mTransformation;mProject;get definitionId(){return this.mDefinitionId}get document(){return this.mDocument}get inputs(){return this.mInputs}get outputs(){return this.mOutputs}get project(){return this.mProject}get transformation(){return this.mTransformation}get category(){return this.mCategory}get label(){return this.mLabel}set label(t){this.mLabel=t}get isSystem(){return this.mIsSystem}constructor(t,e,n,c){this.mCategory=c.category,this.mDocument=e,this.mDefinitionId=c.definitionId,this.mFunction=n,this.mIsSystem=c.isSystem,this.mLabel=c.label,this.mProject=t,this.mTransformation=c.transformation,this.mInputs=new Map;for(let f of c.ports.input)this.mInputs.set(f.definitionId,new vt(this.mProject,this.mDocument,{definitionId:f.definitionId,direction:"input",label:f.label,node:this,portType:f.portType,dataType:f.dataType}));this.mOutputs=new Map;for(let f of c.ports.output)this.mOutputs.set(f.definitionId,new vt(this.mProject,this.mDocument,{definitionId:f.definitionId,direction:"output",label:f.label,node:this,portType:f.portType,dataType:f.dataType}))}moveTo(t,e){this.mTransformation.x=t,this.mTransformation.y=e}resizeTo(t,e){this.mTransformation.width=Math.max(4,t),this.mTransformation.height=Math.max(2,e)}validate(t){let e=new Array,n=this.mFunction.nodeDefinitions.find(c=>c.id===this.mDefinitionId);if(!n)e.push(new k(`Node "${this.mLabel}" definition "${this.mDefinitionId}" could not be found.`,this));else{e.push(...this.resyncPorts(this.mInputs,n.inputs,"input")),e.push(...this.resyncPorts(this.mOutputs,n.outputs,"output"));let c=new Set([...n.regions.requires,...n.regions.allows]);if(c.size>0)for(let f of t)c.has(f)||e.push(new k(`Node "${this.mLabel}" does not allow region "${f}".`,this));if(n.regions.requires.length>0)for(let f of n.regions.requires)t.has(f)||e.push(new k(`Node "${this.mLabel}" requires region "${f}" but it is not active.`,this))}for(let c of[...this.mInputs.values(),...this.mOutputs.values()])e.push(...c.validate());return e}resyncPorts(t,e,n){let c=new Array,f=new Set(e.map(g=>g.id));for(let g of e){if(!t.has(g.id)){t.set(g.id,new vt(this.mProject,this.mDocument,{definitionId:g.id,direction:n,label:g.label,node:this,portType:g.portType,dataType:g.dataType}));continue}let y=t.get(g.id),I=y.portType!==g.portType,D=y.dataType!==g.dataType;if(!(!I&&!D)){if(y.connectedPorts.size>0||I){c.push(new k(`Port "${y.label}" on node "${this.mLabel}" has a changed type.`,y));continue}this.replacePort(t,y,g,n)}}for(let[g,y]of t.entries())if(!f.has(g)){if(y.connectedPorts.size===0){t.delete(g);continue}c.push(new k(`Port "${y.label}" on node "${this.mLabel}" no longer exists in its definition.`,y))}return c}replacePort(t,e,n,c){let f=Array.from(e.connectedPorts);for(let y of Array.from(e.connectedPorts))e.disconnect(y);let g=new vt(this.mProject,this.mDocument,{definitionId:n.id,direction:c,label:n.label,node:this,portType:n.portType,dataType:n.dataType});t.set(n.id,g);for(let y of f)g.connect(y);return g}};var yt=class{mLabel;mDefinitionId;mDocument;mId;mImports;mInputs;mIsSystem;mNodes;mOutputs;mProject;get id(){return this.mId}get definitionId(){return this.mDefinitionId}get document(){return this.mDocument}get nodes(){return this.mNodes}get nodeDefinitions(){let t=this.mProject.getFunction(this.definitionId);return[...this.mDocument.nodeDefinitions,...t?.getNodeDefinitions(this)??new Array]}get imports(){return this.mImports}get inputs(){return this.mInputs}get label(){return this.mLabel}set label(t){this.mLabel=t}get outputs(){return this.mOutputs}get isSystem(){return this.mIsSystem}get project(){return this.mProject}constructor(t,e,n){this.mProject=t,this.mDocument=e,this.mLabel=n.label,this.mIsSystem=n.isSystem,this.mDefinitionId=n.definitionId,this.mId=n.id,this.mNodes=new Set,this.mInputs=new Array,this.mOutputs=new Array,this.mImports=new Array}addImport(t){this.mImports.includes(t)||this.mImports.push(t)}addInput(t){this.mInputs.some(e=>e.label===t.label)||this.mInputs.push(t)}addOutput(t){this.mOutputs.some(e=>e.label===t.label)||this.mOutputs.push(t)}addNode(t){this.mNodes.add(t)}newNode(t,e,n=!1){let c=g=>({definitionId:g.id,label:g.label,portType:g.portType,dataType:g.dataType}),f=new It(this.mProject,this.mDocument,this,{category:t.category,definitionId:t.id,ports:{input:t.inputs.map(c),output:t.outputs.map(c)},isSystem:n,label:t.label,transformation:e});return this.mNodes.add(f),f}removeNode(t){for(let e of[...t.inputs.values(),...t.outputs.values()])for(let n of Array.from(e.connectedPorts))e.disconnect(n);this.mNodes.delete(t)}removeImport(t){let e=this.mImports.indexOf(t);e!==-1&&this.mImports.splice(e,1)}removeInput(t){let e=this.mInputs.findIndex(n=>n.label===t.label);e!==-1&&this.mInputs.splice(e,1)}removeOutput(t){let e=this.mOutputs.findIndex(n=>n.label===t.label);e!==-1&&this.mOutputs.splice(e,1)}validate(){let t=[];this.mProject.getFunction(this.mDefinitionId)||t.push(new k(`Function "${this.mLabel}" definition "${this.mDefinitionId}" could not be found.`,this));let n=new Map,c=new Map;for(let f of this.mNodes)c.set(f,this.accumulateRegions(f,n,new Set,t));for(let f of this.mNodes)t.push(...f.validate(c.get(f)));return t}accumulateRegions(t,e,n,c){if(e.has(t))return e.get(t);if(n.has(t))return c.push(new k(`Node "${t.label}" is part of a connection cycle.`,t)),new Set;n.add(t);let f=new Set;for(let g of t.inputs.values())for(let y of g.connectedPorts){let I=y.node,D=this.accumulateRegions(I,e,n,c);for(let o of D)f.add(o);let l=this.nodeDefinitions.find(o=>o.id===I.definitionId);if(l){for(let u of l.regions.add)f.add(u);let o=l.getPort(y.definitionId);if(o)for(let u of o.regions.add)f.add(u)}}return e.set(t,f),f}};var Gt=class{mFunctions;mFunctionNodeDefinitions;mProject;get functions(){return this.mFunctions}get nodeDefinitions(){return[...this.mFunctionNodeDefinitions.values(),...this.mProject.nodeDefinitions.values()]}get project(){return this.mProject}constructor(t){this.mProject=t,this.mFunctions=new Set,this.mFunctionNodeDefinitions=new Map}addFunction(t){this.mFunctions.add(t);let e=Qt.new(t);this.mFunctionNodeDefinitions.set(e.id,e)}newFunction(t){let e=new yt(this.mProject,this,t);this.mFunctions.add(e);let n=Qt.new(e);return this.mFunctionNodeDefinitions.set(n.id,n),e}removeFunction(t){if(!this.mFunctions.has(t))return!1;if(t.isSystem)throw new A("Cannot remove a system function.",this);this.mFunctions.delete(t);let e=this.mFunctionNodeDefinitions.values().find(n=>n.function===t);return e&&this.mFunctionNodeDefinitions.delete(e.id),!0}validate(){let t=[];for(let e of this.mFunctions)t.push(...e.validate());return t}},k=class{mMessage;mItem;get message(){return this.mMessage}get item(){return this.mItem}constructor(t,e){this.mMessage=t,this.mItem=e}};(function(m){m.Function="function",m.Comment="comment",m.Input="input",m.Output="output",m.Reroute="reroute"})(z||(z={}));var Ot=class m{static META={[z.Function]:{icon:"f",cssColor:"var(--pn-accent-blue)",label:"Function"},[z.Comment]:{icon:"\u{1F4AC}",cssColor:"var(--pn-accent-yellow)",label:"Comment"},[z.Input]:{icon:"\u2192",cssColor:"var(--pn-accent-green)",label:"Input"},[z.Output]:{icon:"\u2190",cssColor:"var(--pn-accent-red)",label:"Output"},[z.Reroute]:{icon:"\u25C7",cssColor:"var(--pn-text-muted)",label:"Reroute"}};static get(t){let e=m.META[t];return e||{icon:"\u25C6",cssColor:`hsl(${m.hashStringToHue(t)}, 60%, 55%)`,label:t.charAt(0).toUpperCase()+t.slice(1)}}static hashStringToHue(t){let e=0;for(let n=0;n<t.length;n++)e=(e<<5)-e+t.charCodeAt(n),e=e&e;return Math.abs(e)%360}},z;var it=class m{static mComponents=new WeakMap;static mConstructorSelector=new WeakMap;static mElements=new WeakMap;static ofComponent(t){let e=t.processorConstructor,n=m.mConstructorSelector.get(e);if(!n)throw new A(`Constructor "${e.name}" is not a registered custom element`,e);let c=m.mElements.get(t);if(!c)throw new A(`Component "${t}" is not a registered component`,t);return{selector:n,constructor:e,element:c,component:t,processor:t.processor}}static ofConstructor(t){let e=m.mConstructorSelector.get(t);if(!e)throw new A(`Constructor "${t.name}" is not a registered custom element`,t);let n=globalThis.customElements.get(e);if(!n)throw new A(`Constructor "${t.name}" is not a registered custom element`,t);return{selector:e,constructor:t,elementConstructor:n}}static ofElement(t){let e=m.mComponents.get(t);if(!e)throw new A(`Element "${t}" is not a PwbComponent.`,t);return m.ofComponent(e)}static ofProcessor(t){let e=m.mComponents.get(t);if(!e)throw new A("Processor is not a PwbComponent.",t);return m.ofComponent(e)}static registerComponent(t,e,n){m.mComponents.has(e)||m.mComponents.set(e,t),n&&!m.mComponents.has(n)&&m.mComponents.set(n,t),m.mElements.has(t)||m.mElements.set(t,e)}static registerConstructor(t,e){t&&!m.mConstructorSelector.has(t)&&m.mConstructorSelector.set(t,e)}};var kt=class m{static CONFIGURATION_ATTACHMENT=Symbol("PwbApplicationConfigurationAttachment");static new(t,e){let n=new m;t(n),e&&n.appendTo(e)}mContent;mElement;constructor(){this.mContent=new Array,this.mElement=document.createElement("div"),this.mElement.attachShadow({mode:"open"})}addContent(t){let e=it.ofConstructor(t).elementConstructor,n=it.ofElement(new e);return this.mContent.push(n.component),this.mElement.shadowRoot.appendChild(n.element),n.processor}addStyle(t){let e=document.createElement("style");e.textContent=t,this.mElement.shadowRoot.prepend(e)}appendTo(t){t.appendChild(this.mElement)}};var Bt=class{mCustomMetadata;constructor(){this.mCustomMetadata=new Map}getMetadata(t){return this.mCustomMetadata.get(t)??null}setMetadata(t,e){this.mCustomMetadata.set(t,e)}};var te=class extends Bt{};var ee=class m extends Bt{static mPrivateMetadataKey=Symbol("Metadata");mDecoratorMetadataObject;mPropertyMetadata;constructor(t){super(),this.mDecoratorMetadataObject=t,this.mPropertyMetadata=new Map,t[m.mPrivateMetadataKey]=this}getInheritedMetadata(t){let e=new Array,n=this.mDecoratorMetadataObject;do{if(Object.hasOwn(n,m.mPrivateMetadataKey)){let f=n[m.mPrivateMetadataKey].getMetadata(t);f!==null&&e.push(f)}n=Object.getPrototypeOf(n)}while(n!==null);return e.reverse()}getProperty(t){return this.mPropertyMetadata.has(t)||this.mPropertyMetadata.set(t,new te),this.mPropertyMetadata.get(t)}};Symbol.metadata??=Symbol("Symbol.metadata");var et=class m{static mMetadataMapping=new Map;static add(t,e){return(n,c)=>{let f=m.forInternalDecorator(c.metadata);switch(c.kind){case"class":f.setMetadata(t,e);return;case"method":case"field":case"getter":case"setter":case"accessor":if(c.static)throw new Error("@Metadata.add not supported for statics.");f.getProperty(c.name).setMetadata(t,e);return}}}static forInternalDecorator(t){return m.mapMetadata(t)}static get(t){Object.hasOwn(t,Symbol.metadata)||m.polyfillMissingMetadata(t);let e=t[Symbol.metadata];return m.mapMetadata(e)}static init(){return(t,e)=>{m.forInternalDecorator(e.metadata)}}static mapMetadata(t){if(m.mMetadataMapping.has(t))return m.mMetadataMapping.get(t);let e=new ee(t);return m.mMetadataMapping.set(t,e),e}static polyfillMissingMetadata(t){let e=new Array,n=t;do e.push(n),n=Object.getPrototypeOf(n);while(n!==null);for(let c=e.length-1;c>=0;c--){let f=e[c];if(!Object.hasOwn(f,Symbol.metadata)){let g=null;c<e.length-2&&(g=e[c+1][Symbol.metadata]),f[Symbol.metadata]=Object.create(g,{})}}}};var $=class m{static mCurrentInjectionContext=null;static mInjectMode=new Map;static mInjectableConstructor=new Map;static mInjectableReplacement=new Map;static mInjectionConstructorIdentificationMetadataKey=Symbol("InjectionConstructorIdentification");static mSingletonMapping=new Map;static createObject(t,e,n){let[c,f]=typeof e=="object"&&e!==null?[!1,e]:[!!e,n??new Map],g=m.getInjectionIdentification(t);if(!m.mInjectableConstructor.has(g))throw new A(`Constructor "${t.name}" is not registered for injection and can not be built`,m);let y=c?"instanced":m.mInjectMode.get(g),I=new Map(f.entries().map(([o,u])=>[m.getInjectionIdentification(o),u])),D=m.mCurrentInjectionContext,l=new Map([...D?.localInjections.entries()??[],...I.entries()]);m.mCurrentInjectionContext={injectionMode:y,localInjections:l};try{if(!c&&y==="singleton"&&m.mSingletonMapping.has(g))return m.mSingletonMapping.get(g);let o=new t;return y==="singleton"&&!m.mSingletonMapping.has(g)&&m.mSingletonMapping.set(g,o),o}finally{m.mCurrentInjectionContext=D}}static injectable(t="instanced"){return(e,n)=>{m.registerInjectable(e,n.metadata,t)}}static registerInjectable(t,e,n){let c=m.getInjectionIdentification(t,e);m.mInjectableConstructor.set(c,t),m.mInjectMode.set(c,n)}static replaceInjectable(t,e){let n=m.getInjectionIdentification(t);if(!m.mInjectableConstructor.has(n))throw new A("Original constructor is not registered.",m);let c=m.getInjectionIdentification(e);if(!m.mInjectableConstructor.has(c))throw new A("Replacement constructor is not registered.",m);m.mInjectableReplacement.set(n,e)}static use(t){if(m.mCurrentInjectionContext===null)throw new A("Can't create object outside of an injection context.",m);let e=m.getInjectionIdentification(t);if(m.mCurrentInjectionContext.injectionMode!=="singleton"&&m.mCurrentInjectionContext.localInjections.has(e))return m.mCurrentInjectionContext.localInjections.get(e);let n=m.mInjectableReplacement.get(e);if(n||(n=m.mInjectableConstructor.get(e)),!n)throw new A(`Constructor "${t.name}" is not registered for injection and can not be built`,m);return m.createObject(n)}static getInjectionIdentification(t,e){let n=e?et.forInternalDecorator(e):et.get(t),c=n.getMetadata(m.mInjectionConstructorIdentificationMetadataKey);return c||(c=Symbol(t.name),n.setMetadata(m.mInjectionConstructorIdentificationMetadataKey,c)),c}};var St=class{mData;mInteractionType;mOrigin;get data(){return this.mData}get origin(){return this.mOrigin}get triggerType(){return this.mInteractionType}constructor(t,e,n){this.mInteractionType=t,this.mData=n,this.mOrigin=e}};var Dt=class m{static mCurrentZone=new m("Default");static get current(){return m.mCurrentZone}static create(t){return new m(t)}mInteractionListener;mName;mTriggerFilterBitmap;get name(){return this.mName}constructor(t){this.mName=t,this.mTriggerFilterBitmap=-1,this.mInteractionListener=new Map}addInteractionListener(t){return this.mInteractionListener.set(t,m.current),this}setTriggerRestriction(t){return this.mTriggerFilterBitmap=t,this}execute(t,...e){let n=m.mCurrentZone;m.mCurrentZone=this;try{return t(...e)}finally{m.mCurrentZone=n}}pushInteraction(t,e){if((this.mTriggerFilterBitmap&t)===0)return!1;if(this.mInteractionListener.size===0)return!0;let n=new St(t,this,e);for(let[c,f]of this.mInteractionListener.entries())f.execute(()=>{c.call(this,n)});return!0}removeInteractionListener(t){return t?(this.mInteractionListener.delete(t),this):(this.mInteractionListener.clear(),this)}};var q=function(m){return m[m.Read=1]="Read",m[m.ReadWrite=2]="ReadWrite",m[m.Write=3]="Write",m}({});var bt=class{mHooks;mInjections;mProcessor;mProcessorConstructor;get processor(){if(!this.mProcessor)throw new A("Processor is not created yet. Call setup to create processor.",this);return this.mProcessor}get processorConstructor(){return this.mProcessorConstructor}constructor(t){if(this.mProcessorConstructor=t.constructor,this.mProcessor=null,this.mInjections=new Map,this.mHooks={create:new Array},t.parent)for(let[e,n]of t.parent.mInjections.entries())this.setProcessorInjection(e,n)}call(t,...e){let n=Reflect.get(this.processor,t);return typeof n!="function"?null:n.apply(this.processor,e)}deconstruct(){}getProcessorInjection(t){return this.mInjections.get(t)}setProcessorInjection(t,e){if(this.mProcessor)throw new A("Cant add injections to after construction.",this);this.mInjections.set(t,e)}setup(){return this.mProcessor=this.createProcessor(),this}addConstructionHook(t){return this.mHooks.create.push(t),this}createProcessor(){let t=$.createObject(this.mProcessorConstructor,this.mInjections),e;for(;e=this.mHooks.create.pop();){let n=e.call(this,t);n&&(t=n)}return t}};var _t=class m extends bt{constructor(t,e){super({constructor:t,parent:e}),this.setProcessorInjection(m,this)}deconstruct(){this.call("onDeconstruct"),super.deconstruct()}setup(){return super.setup(),this.call("onExecute"),this}onUpdate(){return!1}};var $e=class m{static mInstance;mCoreEntityConstructor;mProcessorConstructorConfiguration;constructor(){if(m.mInstance)return m.mInstance;m.mInstance=this,this.mCoreEntityConstructor=new Map,this.mProcessorConstructorConfiguration=new Map}get(t){let e=this.mCoreEntityConstructor.get(t);if(!e)return new Array;let n=new Array;for(let c of e)n.push({processorConstructor:c,processorConfiguration:this.mProcessorConstructorConfiguration.get(c)});return n}register(t,e,n){this.mProcessorConstructorConfiguration.set(e,n);let c=t;do{if(!(c.prototype instanceof bt)&&c!==bt)break;this.mCoreEntityConstructor.has(c)||this.mCoreEntityConstructor.set(c,new Set),this.mCoreEntityConstructor.get(c).add(e)}while(c=Object.getPrototypeOf(c))}},st=new $e;var Ut=class m extends bt{static mExtensionCache=new WeakMap;mExtensionList;constructor(t){super(t),this.mExtensionList=new Array}deconstruct(){for(let t of this.mExtensionList)t.deconstruct();super.deconstruct()}setup(){return super.setup(),this.executeExtensions(),this}executeExtensions(){let t=(()=>{if(!m.mExtensionCache.has(this.processorConstructor)){let c=st.get(_t).filter(g=>{for(let y of g.processorConfiguration.targetRestrictions)if(this instanceof y||this.processorConstructor.prototype instanceof y||this.processorConstructor===y)return!0;return!1}),f={read:c.filter(g=>g.processorConfiguration.access===q.Read),write:c.filter(g=>g.processorConfiguration.access===q.Write),readWrite:c.filter(g=>g.processorConfiguration.access===q.ReadWrite)};m.mExtensionCache.set(this.processorConstructor,f)}return m.mExtensionCache.get(this.processorConstructor)})(),e=[...t.write,...t.readWrite,...t.read];for(let n of e)this.mExtensionList.push(new _t(n.processorConstructor,this).setup())}};var U={get:1,set:2,manual:4};var ge=class m{static ORIGINAL_TO_INTERACTION_MAPPING=new WeakMap;static PROXY_TO_ORIGINAL_MAPPING=new WeakMap;static UNTRACEABLE_FUNCTION_UPDATE_TRIGGER=(()=>{let t=new WeakMap;return t.set(Array.prototype.fill,U.set),t.set(Array.prototype.pop,U.get),t.set(Array.prototype.push,U.set),t.set(Array.prototype.shift,U.get),t.set(Array.prototype.unshift,U.set),t.set(Array.prototype.splice,U.set),t.set(Array.prototype.reverse,U.set),t.set(Array.prototype.sort,U.set),t.set(Array.prototype.concat,U.set),t.set(Map.prototype.clear,U.set),t.set(Map.prototype.delete,U.set),t.set(Map.prototype.set,U.set),t.set(Set.prototype.clear,U.set),t.set(Set.prototype.delete,U.set),t.set(Set.prototype.add,U.set),t})();static getOriginal(t){return m.PROXY_TO_ORIGINAL_MAPPING.get(t)??t}static getWrapper(t){let e=m.getOriginal(t);return m.ORIGINAL_TO_INTERACTION_MAPPING.get(e)}mProxyObject;mStateChangeCallback;get proxy(){return this.mProxyObject}constructor(t,e){let n=m.getWrapper(t);if(n)return n;this.mProxyObject=this.createProxyObject(t),this.mStateChangeCallback=e,m.PROXY_TO_ORIGINAL_MAPPING.set(this.mProxyObject,t),m.ORIGINAL_TO_INTERACTION_MAPPING.set(t,this)}convertToProxy(t){return t===null||typeof t!="object"&&typeof t!="function"?t:new m(t,this.mStateChangeCallback).proxy}createProxyObject(t){let e=(c,f,g)=>{let y=m.getOriginal(f);try{let I=c.call(y,...g);return this.convertToProxy(I)}finally{if(m.UNTRACEABLE_FUNCTION_UPDATE_TRIGGER.has(c)){let I=m.getWrapper(f);I&&I.dispatch(m.UNTRACEABLE_FUNCTION_UPDATE_TRIGGER.get(c))}}};return new Proxy(t,{apply:(c,f,g)=>{let y=c;try{let I=y.call(f,...g);return this.convertToProxy(I)}catch(I){if(!(I instanceof TypeError))throw I;return e(y,f,g)}},set:(c,f,g)=>{try{let y=g;return(y!==null&&typeof y=="object"||typeof y=="function")&&(y=m.getOriginal(y)),Reflect.set(c,f,y)}finally{this.dispatch(U.set)}},get:(c,f,g)=>{try{return this.convertToProxy(Reflect.get(c,f))}finally{this.dispatch(U.get)}},deleteProperty:(c,f)=>{try{return delete c[f]}finally{this.dispatch(U.set)}}})}dispatch(t){this.mStateChangeCallback(t)}};var O=class m{static reaction(t){let e=Dt.create("ComponentState reaction");e.addInteractionListener(n=>{(n.triggerType&U.set)!==0&&t()}),e.execute(()=>{t()})}static state(t){return(e,n)=>{if(n.static)throw new A("Event target is not for a static property.",m);let c=new WeakMap,f=(g,y)=>{c.set(g,new m(y,t))};return{init(g){return typeof g>"u"||f(this,g),g},set(g){c.has(this)?c.get(this).set(g):f(this,g)},get(){return c.has(this)||f(this,void 0),c.get(this).get()}}}}mLinkedZones;mLinkedZonesArray;mConfiguration;mValue;constructor(t,e){if(this.mLinkedZones=new Set,this.mLinkedZonesArray=new Array,this.mConfiguration={complexValue:e?.complexValue??!1,proxy:e?.proxy??!1},this.mConfiguration.proxy){if(typeof t!="object"||t===null)throw new A("Proxied component state value must be an object.",this);this.mValue=new ge(t,n=>{switch(n){case U.set:return this.dispatchChange();case U.get:return this.linkCurrentZone()}}).proxy}else this.mValue=t}get(){return this.linkCurrentZone(),this.mValue}set(t){if(this.mConfiguration.proxy)throw new A("Proxy is not implemented yet.",this);!this.mConfiguration.complexValue&&this.mValue===t||(this.mValue=t,this.dispatchChange())}dispatchChange(){for(let t of this.mLinkedZonesArray)t.pushInteraction(U.set,this)}linkCurrentZone(){let t=Dt.current;this.mLinkedZones.has(t)||(this.mLinkedZones.add(t),this.mLinkedZonesArray.push(t))}};var Pt=class m{static mCurrentUpdateCycle=null;static openResheduledCycle(t,e){let n=!1;if(!m.mCurrentUpdateCycle){let c=performance.now();m.mCurrentUpdateCycle={initiator:t.initiator,startTime:c,forcedSync:t.forcedSync,runner:t.runner},n=!0}try{return e(m.mCurrentUpdateCycle)}finally{n&&(m.mCurrentUpdateCycle=null)}}static openUpdateCycle(t,e){let n=!1;if(!m.mCurrentUpdateCycle){let c=performance.now();m.mCurrentUpdateCycle={initiator:t.updater,startTime:c,forcedSync:t.runSync,runner:Symbol("Runner "+c)},n=!0}try{return e(m.mCurrentUpdateCycle)}finally{n&&(m.mCurrentUpdateCycle=null)}}static updateCycleRunId(t,e){if(t.initiator===e){let n=performance.now(),c=t;c.runner=Symbol("Runner "+n)}}static updateCyleStartTime(t){let e=performance.now(),n=t;n.startTime=e}};var ve=class extends Error{mChain;get chain(){return this.mChain}constructor(t,e){let n=e.slice(-20).map(c=>c.toString()).join(`
`);super(`${t}: 
${n}`),this.mChain=[...e]}};var ye=class m{static mStackCap=100;static mFrameTime=100;static get stackCap(){return m.mStackCap}static set stackCap(t){m.mStackCap=t}static get frameTime(){return m.mFrameTime}static set frameTime(t){m.mFrameTime=t}mInteractionZone;mUpdateFunction;mUpdateRunCache;mUpdateStates;mManualComponentState;get zone(){return this.mInteractionZone}constructor(t){this.mUpdateRunCache=new WeakMap,this.mUpdateFunction=t.onUpdate,this.mInteractionZone=t.zone,this.mManualComponentState=new O(Symbol("Manual Update")),this.mUpdateStates={chainCompleteHooks:new Ct,async:{hasSheduledTask:!1,hasRunningTask:!1,sheduledTaskIsResheduled:!1},sync:{running:!1},cycle:{chainedTask:null}},this.mInteractionZone.addInteractionListener(e=>{(e.triggerType&U.set)!==0&&this.runUpdateAsynchron(e,null)})}deconstruct(){this.mInteractionZone.removeInteractionListener()}async waitForUpdate(){return this.mUpdateStates.async.hasSheduledTask?new Promise((t,e)=>{this.mUpdateStates.chainCompleteHooks.push((n,c)=>{c?e(c):t(n)})}):!1}executeInZone(t){return this.mInteractionZone.execute(t)}update(){let t=new St(U.manual,this.mInteractionZone,this.mManualComponentState);return this.runUpdateSynchron(t)}updateAsync(){let t=new St(U.manual,this.mInteractionZone,this.mManualComponentState);this.runUpdateAsynchron(t,null)}executeTaskChain(t,e,n,c){if(c.length>m.stackCap)throw new ve("Call loop detected",c);let f=performance.now();if(!e.forcedSync&&f-e.startTime>m.frameTime)throw new re;c.push(t);let g=this.mInteractionZone.execute(()=>this.mUpdateFunction.call(this))||n;if(Pt.updateCycleRunId(e,this),!this.mUpdateStates.cycle.chainedTask)return g;let y=this.mUpdateStates.cycle.chainedTask;return this.mUpdateStates.cycle.chainedTask=null,this.executeTaskChain(y,e,g,c)}releaseUpdateChainCompleteHooks(t,e){if(!this.mUpdateStates.chainCompleteHooks.top)return;let n;for(;n=this.mUpdateStates.chainCompleteHooks.pop();)n(t,e)}runUpdateAsynchron(t,e){if(this.mUpdateStates.async.hasRunningTask||this.mUpdateStates.async.sheduledTaskIsResheduled){this.mUpdateStates.cycle.chainedTask=t;return}if(this.mUpdateStates.async.hasSheduledTask)return;let n=c=>{this.mUpdateStates.async.hasRunningTask=!0,this.mUpdateStates.async.hasSheduledTask=!1,this.mUpdateStates.async.sheduledTaskIsResheduled=!1;let f=!1;try{this.runUpdateSynchron(t)}catch(g){g instanceof re&&c.initiator===this&&(f=!0)}finally{this.mUpdateStates.async.hasRunningTask=!1}f&&this.runUpdateAsynchron(t,c)};this.mUpdateStates.async.hasSheduledTask=!0,e&&(this.mUpdateStates.async.sheduledTaskIsResheduled=!0),globalThis.requestAnimationFrame(()=>{e?Pt.openResheduledCycle(e,n):Pt.openUpdateCycle({updater:this,runSync:!1},n)})}runUpdateSynchron(t){if(this.mUpdateStates.sync.running)return this.mUpdateStates.cycle.chainedTask=t,!1;this.mUpdateStates.sync.running=!0;try{let e=Pt.openUpdateCycle({updater:this,runSync:!0},n=>{if(this.mUpdateRunCache.has(n.runner))return Pt.updateCyleStartTime(n),this.mUpdateRunCache.get(n.runner);let c=this.executeTaskChain(t,n,!1,new Array);return this.mUpdateRunCache.set(n.runner,c),c});return this.releaseUpdateChainCompleteHooks(e),e}catch(e){throw e instanceof re||this.releaseUpdateChainCompleteHooks(!1,e),e}finally{this.mUpdateStates.sync.running=!1}}},re=class extends Error{constructor(){super("Update resheduled")}};var be=class extends Ut{mUpdater;get updater(){return this.mUpdater}constructor(t){super(t);let e=Dt.create(`${t.constructor.name}-Update-Zone`);this.mUpdater=new ye({label:t.constructor.name,zone:e,onUpdate:()=>this.onUpdate()})}call(t,...e){return this.mUpdater.executeInZone(()=>super.call(t,...e))}deconstruct(){this.mUpdater.deconstruct(),super.deconstruct()}createProcessor(){return this.mUpdater.executeInZone(()=>super.createProcessor())}};var Ft=class{mExpression;mTemporaryValues;constructor(t,e,n){if(this.mTemporaryValues=new Q,n.length>0)for(let c of n)this.mTemporaryValues.set(c,void 0);this.mExpression=this.createEvaluationFunction(t,this.mTemporaryValues).bind(e.store)}execute(){return this.mExpression()}setTemporaryValue(t,e){if(!this.mTemporaryValues.has(t))throw new A(`Temporary value "${t}" does not exist for this procedure.`,this);this.mTemporaryValues.set(t,e)}createEvaluationFunction(t,e){let n,c=`__${Math.random().toString(36).substring(2)}`;if(n="return function () {",e.size>0)for(let f of e.keys())n+=`const ${f} = ${c}.get('${f}');`;return n+=`return ${t};`,n+="};",new Function(c,n)(e)}};var ft=class{mDataLevel;get data(){return this.mDataLevel}constructor(t){this.mDataLevel=t}createExpressionProcedure(t,e){return new Ft(t,this.data,e??[])}setTemporaryValue(t,e){this.data.setTemporaryValue(t,e)}};var ut=class{mComponent;mDataProxy;mParentLevel;mTemporaryValues;get store(){return this.mDataProxy}constructor(t){this.mTemporaryValues=new Q,t instanceof rt?(this.mParentLevel=null,this.mComponent=t):(this.mParentLevel=t,this.mComponent=t.mComponent),this.mDataProxy=this.createAccessProxy()}setTemporaryValue(t,e){this.mTemporaryValues.set(t,e)}updateLevelData(t){if(t.mParentLevel!==this.mParentLevel)throw new A("Can't update InstructionLevelData for a deeper level than it target data.",this);this.mTemporaryValues=t.mTemporaryValues}createAccessProxy(){return new Proxy(new Object,{get:(t,e)=>this.getValue(e),set:(t,e,n)=>(this.hasTemporaryValue(e)&&this.setTemporaryValue(e,n),e in this.mComponent.processor?(this.mComponent.processor[e]=n,!0):(this.setTemporaryValue(e,n),!0)),deleteProperty:()=>{throw new A("Deleting properties is not allowed",this)},ownKeys:()=>[...new Set([...Object.keys(this.mComponent.processor),...this.getTemporaryValuesList()])]})}getTemporaryValuesList(){let t=this.mTemporaryValues.map(e=>e);return this.mParentLevel&&t.push(...this.mParentLevel.getTemporaryValuesList()),t}getValue(t){if(this.mTemporaryValues.has(t))return this.mTemporaryValues.get(t);if(this.mParentLevel)return this.mParentLevel.getValue(t);if(t in this.mComponent.processor)return this.mComponent.processor[t]}hasTemporaryValue(t){return this.mTemporaryValues.has(t)?!0:this.mParentLevel?this.mParentLevel.hasTemporaryValue(t):!1}};var Vt=class m{mChildList;mInstruction;mInstructionType;get childList(){return this.mChildList}get instruction(){return this.mInstruction}get instructionType(){return this.mInstructionType}constructor(t,e){this.mChildList=Array(),this.mInstruction=e,this.mInstructionType=t}appendChild(...t){this.mChildList.push(...t)}clone(){let t=new m(this.instructionType,this.instruction);for(let e of this.mChildList)t.appendChild(e.clone());return t}equals(t){if(!(t instanceof m)||t.instruction!==this.instruction||t.instructionType!==this.instructionType||t.childList.length!==this.childList.length)return!1;for(let e=0;e<t.childList.length;e++)if(!t.childList[e].equals(this.childList[e]))return!1;return!0}removeChild(t){let e=this.mChildList.indexOf(t);if(e!==-1)return this.mChildList.splice(e,1)[0]}};var dt=class m{mExpression;get value(){return this.mExpression}constructor(t){this.mExpression=t}clone(){return new m(this.mExpression)}equals(t){return t instanceof m&&t.value===this.value}toString(){return`{{ ${this.mExpression} }}`}};var wt=class m{mContainsExpression;mTextValue;mValues;get containsExpression(){return this.mContainsExpression}get values(){return this.mValues}constructor(){this.mTextValue="",this.mContainsExpression=!1,this.mValues=[]}addValue(...t){for(let e of t)(this.mContainsExpression===!0||e instanceof dt)&&(this.mContainsExpression=!0),this.mValues.push(e),this.mTextValue+=e.toString()}clone(){let t=new m;for(let e of this.values)typeof e=="string"?t.addValue(e):t.addValue(e.clone());return t}equals(t){if(!(t instanceof m)||t.values.length!==this.values.length)return!1;for(let e=0;e<this.values.length;e++){let n=this.values[e],c=t.values[e];if(n!==c&&(typeof n!=typeof c||typeof n=="string"&&n!==c||!c.equals(n)))return!1}return!0}toString(){return this.mTextValue}};var oe=class m{mName;mValue;get name(){return this.mName}get values(){return this.mValue}constructor(t){this.mName=t,this.mValue=new wt}clone(){let t=new m(this.name);for(let e of this.values.values)typeof e=="string"?t.values.addValue(e):t.values.addValue(e.clone());return t}equals(t){return!(!(t instanceof m)||t.name!==this.name||!t.values.equals(this.values))}};var xt=class m{mAttributeDictionary;mChildList;mTagName;get attributes(){return[...this.mAttributeDictionary.values()]}get childList(){return this.mChildList}get tagName(){return this.mTagName}constructor(t){this.mAttributeDictionary=new Map,this.mChildList=Array(),this.mTagName=t}appendChild(...t){this.mChildList.push(...t)}clone(){let t=new m(this.tagName);for(let e of this.mAttributeDictionary.values()){let n=t.setAttribute(e.name);for(let c of e.values.values)typeof c=="string"?n.addValue(c):n.addValue(c.clone())}for(let e of this.mChildList)t.appendChild(e.clone());return t}equals(t){if(!(t instanceof m)||t.tagName!==this.tagName||t.attributes.length!==this.mAttributeDictionary.size||t.childList.length!==this.mChildList.length)return!1;for(let e of t.mAttributeDictionary.values()){let n=this.mAttributeDictionary.get(e.name);if(!n||!n.equals(e))return!1}for(let e=0;e<t.childList.length;e++)if(!t.childList[e].equals(this.mChildList[e]))return!1;return!0}getAttribute(t){return this.mAttributeDictionary.get(t)?.values??null}removeAttribute(t){return this.mAttributeDictionary.delete(t)}removeChild(t){let e=this.mChildList.indexOf(t);if(e!==-1)return this.mChildList.splice(e,1)[0]}setAttribute(t){if(this.mAttributeDictionary.has(t))return this.mAttributeDictionary.get(t).values;let e=new oe(t);return this.mAttributeDictionary.set(t,e),e.values}};var at=class m{mBodyElementList;get body(){return this.mBodyElementList}constructor(){this.mBodyElementList=new Array}appendChild(...t){this.mBodyElementList.push(...t)}clone(){let t=new m;for(let e of this.mBodyElementList)t.appendChild(e.clone());return t}equals(t){if(!(t instanceof m)||t.body.length!==this.mBodyElementList.length)return!1;for(let e=0;e<this.mBodyElementList.length;e++)if(!this.mBodyElementList[e].equals(t.body[e]))return!1;return!0}removeChild(t){let e=this.mBodyElementList.indexOf(t);if(e!==-1)return this.mBodyElementList.splice(e,1)[0]}};var ot=class{mComponentValues;mContent;mModules;mTemplate;get anchor(){return this.mContent.contentAnchor}get modules(){return this.mModules}get template(){return this.mTemplate}get values(){return this.mComponentValues}get content(){return this.mContent}constructor(t,e,n,c){this.mTemplate=t,this.mComponentValues=n,this.mContent=c,this.mModules=e,c.setCoreBuilder(this)}deconstruct(){this.content.deconstruct()}update(){let t=this.onUpdate(),e=!1,n=this.content.builders;if(n.length>0)for(let c=0;c<n.length;c++)e=n[c].update()||e;return t||e}createHtmlElement(t){let e=t.tagName;if(typeof e!="string")throw e;if(e.includes("-")){let c=globalThis.customElements.get(e);if(typeof c<"u")return new c}let n=t.getAttribute("xmlns");return n&&!n.containsExpression?document.createElementNS(n.values[0],e):document.createElement(e)}createTextNode(t){return document.createTextNode(t)}};var Ht=class{mChildBuilderList;mChildComponents;mContentAnchor;mContentBoundary;mLinkedContent;mRootChildList;get body(){return this.mRootChildList}get builders(){return this.mChildBuilderList}get contentAnchor(){return this.mContentAnchor}constructor(t){this.mChildBuilderList=new Array,this.mRootChildList=new Array,this.mChildComponents=new Map,this.mLinkedContent=new WeakSet,this.mContentAnchor=document.createComment(t),this.mContentBoundary={start:this.mContentAnchor,end:this.mContentAnchor}}deconstruct(){this.onDeconstruct();let t;for(;t=this.mChildBuilderList.pop();)t.deconstruct();for(let n of this.mChildComponents.values())n.deconstruct();this.mChildComponents.clear();let e;for(;e=this.mRootChildList.pop();)e instanceof ot||e.remove();this.contentAnchor.remove()}getBoundary(){let t=this.mContentBoundary.end instanceof ot?this.mContentBoundary.end.content.getBoundary().end:this.mContentBoundary.end;return{start:this.mContentBoundary.start,end:t}}insert(t,e,n){if(!this.mLinkedContent.has(n))throw new A("Can't add content to builder. Target is not part of builder.",this);let c=t instanceof ot?t.anchor:t;switch(e){case"After":{this.insertAfter(c,n);break}case"TopOf":{this.insertTop(c,n);break}case"BottomOf":{this.insertBottom(c,n);break}}this.mLinkedContent.add(t),t instanceof ot&&this.mChildBuilderList.push(t);let f=c.parentElement??c.getRootNode(),g=this.mContentAnchor.parentElement??this.mContentAnchor.getRootNode();if(f===g){let y=(()=>{switch(e){case"After":return this.mRootChildList.indexOf(n)+1;case"TopOf":return 0;case"BottomOf":return this.mRootChildList.length}})();y===this.mRootChildList.length&&(this.mContentBoundary.end=t),this.mRootChildList.splice(y+1,0,t)}}remove(t){if(!this.mLinkedContent.has(t))throw new A("Child node cant be deleted from builder when it not a child of them",this);if(this.mLinkedContent.delete(t),t instanceof ot){let n=this.mChildBuilderList.indexOf(t);n!==-1&&this.mChildBuilderList.splice(n,1),t.deconstruct()}else{let n=this.mChildComponents.get(t);n&&(n.deconstruct(),this.mChildComponents.delete(t)),t.remove()}let e=this.mRootChildList.indexOf(t);e!==-1&&(this.mRootChildList.splice(e,1),this.mContentBoundary.end=this.mRootChildList.at(-1)??this.mContentAnchor)}setCoreBuilder(t){this.mLinkedContent.add(t)}insertAfter(t,e){let n=e instanceof ot?e.content.getBoundary().end:e;(n.parentElement??n.getRootNode()).insertBefore(t,n.nextSibling)}insertBottom(t,e){if(e instanceof ot){this.insertAfter(t,e);return}if(e instanceof Element){e.appendChild(t);return}throw new A("Source node does not support child nodes.",this)}insertTop(t,e){if(e instanceof ot){this.insertAfter(t,e.anchor);return}if(e instanceof Element){e.prepend(t);return}throw new A("Source node does not support child nodes.",this)}};var we=class extends Ht{mAttributeModulesChangedOrder;mLinkedAttributeData;mLinkedAttributeExpressionModules;mLinkedAttributeModuleList;mLinkedExpressionModuleList;get linkedAttributeModules(){return this.mAttributeModulesChangedOrder&&(this.mAttributeModulesChangedOrder=!1,this.mLinkedAttributeModuleList.sort((t,e)=>t.accessMode-e.accessMode)),this.mLinkedAttributeModuleList}get linkedExpressionModules(){return this.mLinkedExpressionModuleList}constructor(t){super(t),this.mLinkedExpressionModuleList=new Array,this.mLinkedAttributeModuleList=new Array,this.mLinkedAttributeExpressionModules=new WeakMap,this.mLinkedAttributeData=new WeakMap,this.mAttributeModulesChangedOrder=!1}attributeOfLinkedExpressionModule(t){return this.mLinkedAttributeExpressionModules.get(t)}getLinkedAttributeData(t){if(!this.mLinkedAttributeData.has(t))throw new A("Attribute has no linked data.",this);return this.mLinkedAttributeData.get(t)}linkAttributeExpression(t,e){this.mLinkedAttributeExpressionModules.set(t,e)}linkAttributeModule(t){this.mLinkedAttributeModuleList.push(t),this.mAttributeModulesChangedOrder=!0}linkAttributeNodes(t,e,n){this.mLinkedAttributeData.set(t,{values:n,node:e})}linkExpressionModule(t){this.mLinkedExpressionModuleList.push(t)}onDeconstruct(){for(let t of this.mLinkedAttributeModuleList)t.deconstruct();for(let t of this.mLinkedExpressionModuleList)t.deconstruct()}};var xe=class extends Ht{mInstructionModule;get instructionModule(){return this.mInstructionModule}constructor(t,e){super(e),this.mInstructionModule=t}onDeconstruct(){this.mInstructionModule.deconstruct()}};var Te=class extends ot{constructor(t,e,n){let c=e.createInstructionModule(t,n);super(t,e,n,new xe(c,`Instruction - {$${t.instructionType}}`))}onUpdate(){if(this.content.instructionModule.update()){let t=this.content.body;this.updateStaticBuilder(t,this.content.instructionModule.instructionResult.elementList)}return!1}insertNewContent(t,e){let n=new Xt(t.template,this.modules,t.dataLevel,`Child - {$${this.template.instructionType}}`);return e===null?this.content.insert(n,"TopOf",this):this.content.insert(n,"After",e),n}updateStaticBuilder(t,e){let c=new Jt((y,I)=>I.template.equals(y.template)).differencesOf(t,e),f=0,g=null;for(let y=0;y<c.length;y++){let I=c[y];if(I.changeState===gt.Remove)this.content.remove(I.item);else if(I.changeState===gt.Insert)g=this.insertNewContent(I.item,g),f++;else{let D=e[f].dataLevel;I.item.values.updateLevelData(D),g=I.item,f++}}}};var Xt=class extends ot{mInitialized;constructor(t,e,n,c){super(t,e,n,new we(`Static - {${c}}`)),this.mInitialized=!1}onUpdate(){this.mInitialized||(this.mInitialized=!0,this.buildTemplate([this.template],this));let t=!1,e=this.content.linkedAttributeModules;for(let f=0;f<e.length;f++)t=e[f].update()||t;let n=!1,c=this.content.linkedExpressionModules;for(let f=0;f<c.length;f++){let g=c[f];if(g.update()){n=!0;let y=this.content.attributeOfLinkedExpressionModule(g);if(!y)continue;let I=this.content.getLinkedAttributeData(y),D=I.values.reduce((l,o)=>l+o.data,"");I.node.setAttribute(y.name,D)}}return t||n}buildInstructionTemplate(t,e){this.content.insert(new Te(t,this.modules,new ut(this.values)),"BottomOf",e)}buildStaticTemplate(t,e){let n=this.createHtmlElement(t);this.content.insert(n,"BottomOf",e);for(let c of t.attributes){let f=this.modules.createAttributeModule(c,n,this.values);if(f){this.content.linkAttributeModule(f);continue}if(c.values.containsExpression){let g=new Array;for(let y of c.values.values){let I=this.createTextNode("");if(g.push(I),!(y instanceof dt)){I.data=y;continue}let D=this.modules.createExpressionModule(y,I,this.values);this.content.linkExpressionModule(D),this.content.linkAttributeExpression(D,c)}this.content.linkAttributeNodes(c,n,g);continue}n.setAttribute(c.name,c.values.toString())}this.content.insert(n,"BottomOf",e),this.buildTemplate(t.childList,n)}buildTemplate(t,e){for(let n of t)n instanceof at?this.buildTemplate(n.body,e):n instanceof wt?this.buildTextTemplate(n,e):n instanceof Vt?this.buildInstructionTemplate(n,e):n instanceof xt&&this.buildStaticTemplate(n,e)}buildTextTemplate(t,e){for(let n of t.values){if(typeof n=="string"){this.content.insert(this.createTextNode(n),"BottomOf",e);continue}let c=this.createTextNode("");this.content.insert(c,"BottomOf",e);let f=this.modules.createExpressionModule(n,c,this.values);this.content.linkExpressionModule(f)}}};var ne=class{mHtmlElement;mShadowRoot;get htmlElement(){return this.mHtmlElement}get shadowRoot(){return this.mShadowRoot}constructor(t){this.mHtmlElement=t,this.mShadowRoot=this.mHtmlElement.attachShadow({mode:"open"})}};var W=class{mDataLevel;get data(){return this.mDataLevel}constructor(t){this.mDataLevel=t}createExpressionProcedure(t,e){return new Ft(t,this.data,e??[])}};var Nt=class extends Ut{constructor(t){super({constructor:t.constructor,parent:t.parent}),this.setProcessorInjection(W,new W(t.values))}deconstruct(){super.deconstruct(),this.call("onDeconstruct")}update(){return this.onUpdate()}};var K=class{mValue;get value(){return this.mValue}constructor(t){this.mValue=t}};var tt=class{constructor(){throw new A("Reference should not be instanced.",this)}};var ht=class{constructor(){throw new A("Reference should not be instanced.",this)}};var At=class m extends Nt{mLastResult;mTargetTextNode;constructor(t){super({constructor:t.constructor,parent:t.parent,values:t.values}),this.mTargetTextNode=t.targetNode,this.mLastResult=null,this.setProcessorInjection(m,this),this.setProcessorInjection(ht,t.targetTemplate.clone()),this.setProcessorInjection(tt,t.targetNode),this.setProcessorInjection(K,new K(t.targetTemplate.value))}onUpdate(){let t=this.call("onUpdate");t===null&&(t="");let e=this.mLastResult===null||this.mLastResult!==t;if(e){let n=this.mTargetTextNode;n.data=t,this.mLastResult=t}return e}};function je(){return(m,t)=>{$.registerInjectable(m,t.metadata,"instanced"),st.register(At,m,{})}}function Aa(){function m(l,o){return function(a){e(o,"addInitializer"),n(a,"An initializer"),l.push(a)}}function t(l,o,u,a,r,b,v,T,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+o:o,static:b,private:v,metadata:T},d={v:!1};s.addInitializer=m(a,d);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[o]},h=function(x){this[o]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return l(w,s)}finally{d.v=!0}}function e(l,o){if(l.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(l,o){if(typeof l!="function")throw new TypeError(o+" must be a function")}function c(l,o){var u=typeof o;if(l===1){if(u!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(u!=="function"){var a;throw l===0?a="field":l===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function f(l,o,u,a,r,b,v,T,w){var p=u[0],s,d,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,S;if(typeof p=="function")h=t(p,a,s,T,r,b,v,w,i),h!==void 0&&(c(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,S=h.set||i.set,i={get:x,set:S}):i=h);else for(var _=p.length-1;_>=0;_--){var P=p[_];if(h=t(P,a,s,T,r,b,v,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,S=h.set||i.set,i={get:x,set:S}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(C,E){return E};else if(typeof d!="function"){var M=d;d=function(C,E){for(var R=E,L=0;L<M.length;L++)R=M[L].call(C,R);return R}}else{var j=d;d=function(C,E){return j.call(C,E)}}l.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(l.push(function(C,E){return i.get.call(C,E)}),l.push(function(C,E){return i.set.call(C,E)})):r===2?l.push(i):l.push(function(C,E){return i.call(C,E)}):Object.defineProperty(o,a,s))}function g(l,o,u){for(var a=[],r,b,v=new Map,T=new Map,w=0;w<o.length;w++){var p=o[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,S;if(h?(x=l,s=s-5,b=b||[],S=b):(x=l.prototype,r=r||[],S=r),s!==0&&!i){var _=h?T:v,P=_.get(d)||0;if(P===!0||P===3&&s!==4||P===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!P&&s>2?_.set(d,s):_.set(d,!0)}f(a,x,p,d,s,h,i,S,u)}}return y(a,r),y(a,b),a}function y(l,o){o&&l.push(function(u){for(var a=0;a<o.length;a++)o[a].call(u);return u})}function I(l,o,u){if(o.length>0){for(var a=[],r=l,b=l.name,v=o.length-1;v>=0;v--){var T={v:!1};try{var w=o[v](r,{kind:"class",name:b,addInitializer:m(a,T),metadata:u})}finally{T.v=!0}w!==void 0&&(c(10,w),r=w)}return[D(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function D(l,o){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,u,a,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),T=g(o,u,v);return a.length||D(o,v),{e:T,get c(){return I(o,a,v)}}}}function qe(m,t,e,n){return(qe=Aa())(m,t,e,n)}var Je,We,ze;Je=je();var Ze=class{static{({c:[ze,We]}=qe(this,[],[Je]))}constructor(t=$.use(W),e=$.use(K)){this.mProcedure=t.createExpressionProcedure(e.value)}mProcedure;onUpdate(){let t=this.mProcedure.execute();return typeof t>"u"?null:t?.toString()}static{We()}};var lt=class{mName;mValue;get name(){return this.mName}get value(){return this.mValue}constructor(t,e){this.mName=t,this.mValue=e}};var mt=class m extends Nt{mAccessMode;get accessMode(){return this.mAccessMode}constructor(t){super({constructor:t.constructor,parent:t.parent,values:t.values}),this.mAccessMode=t.accessMode,this.setProcessorInjection(m,this),this.setProcessorInjection(ht,t.targetTemplate.clone()),this.setProcessorInjection(tt,t.targetNode),this.setProcessorInjection(lt,new lt(t.targetTemplate.name,t.targetTemplate.values.toString()))}onUpdate(){return this.call("onUpdate")??!1}};var ct=class{mElementList;mTemplates;mDataLevels;get elementList(){return this.mElementList}constructor(){this.mElementList=new Array,this.mTemplates=new Set,this.mDataLevels=new Set}addElement(t,e){if(this.mTemplates.has(t)||this.mDataLevels.has(e))throw new A("Can't add same template or values for multiple Elements.",this);this.mTemplates.add(t),this.mDataLevels.add(e),this.mElementList.push({template:t,dataLevel:e})}};var Rt=class m extends Nt{mLastResult;get instructionResult(){return this.mLastResult}constructor(t){super({constructor:t.constructor,parent:t.parent,values:t.values}),this.setProcessorInjection(m,this),this.setProcessorInjection(ht,t.targetTemplate.clone()),this.setProcessorInjection(K,new K(t.targetTemplate.instruction)),this.mLastResult=new ct}onUpdate(){let t=this.call("onUpdate");return t instanceof ct?(this.mLastResult=t,!0):!1}};var Ee=class m{static mAttributeModuleCache=new Q;static mExpressionModuleCache=new WeakMap;static mInstructionModuleCache=new Q;mComponent;mExpressionModule;constructor(t,e){this.mExpressionModule=e??ze,this.mComponent=t}createAttributeModule(t,e,n){let c=(()=>{let f=m.mAttributeModuleCache.get(t.name);if(f||f===null)return f;for(let g of st.get(mt))if(g.processorConfiguration.selector.test(t.name))return m.mAttributeModuleCache.set(t.name,g),g;return m.mAttributeModuleCache.set(t.name,null),null})();return c===null?null:new mt({accessMode:c.processorConfiguration.access,constructor:c.processorConstructor,parent:this.mComponent,targetNode:e,targetTemplate:t,values:n}).setup()}createExpressionModule(t,e,n){let c=(()=>{let f=m.mExpressionModuleCache.get(this.mExpressionModule);if(f)return f;let g=st.get(At).find(y=>y.processorConstructor===this.mExpressionModule);if(!g)throw new A("An expression module could not be found.",this);return m.mExpressionModuleCache.set(this.mExpressionModule,g),g})();return new At({constructor:c.processorConstructor,parent:this.mComponent,targetNode:e,targetTemplate:t,values:n}).setup()}createInstructionModule(t,e){let n=(()=>{let c=m.mInstructionModuleCache.get(t.instructionType);if(c)return c;for(let f of st.get(Rt))if(f.processorConfiguration.instructionType===t.instructionType)return m.mInstructionModuleCache.set(t.instructionType,f),f;throw new A(`Instruction module type "${t.instructionType}" not found.`,this)})();return new Rt({constructor:n.processorConstructor,parent:this.mComponent,targetTemplate:t,values:e}).setup()}};var $t=class extends A{mColumnEnd;mColumnStart;mLineEnd;mLineStart;get columnEnd(){return this.mColumnEnd}get columnStart(){return this.mColumnStart}get lineEnd(){return this.mLineEnd}get lineStart(){return this.mLineStart}constructor(t,e,n,c,f,g,y){super(t,e,y),this.mColumnStart=n,this.mLineStart=c,this.mColumnEnd=f,this.mLineEnd=g}};var Yt=class{mDependencyFetch;mDependencyFetchResolved;mLexer;mMeta;mPattern;mPatternDependencies;mType;get dependencies(){return this.mPatternDependencies}get dependenciesResolved(){return this.mDependencyFetchResolved}get lexer(){return this.mLexer}get meta(){return this.mMeta}get pattern(){return this.mPattern}constructor(t,e){if(this.mLexer=t,this.mType=e.type,this.mMeta=e.metadata,this.mPatternDependencies=new Array,this.mDependencyFetch=e.dependencyFetch??null,this.mDependencyFetchResolved=!e.dependencyFetch,this.mType==="split"&&!this.mDependencyFetch)throw new A("Split token with a start and end token, need inner token definitions.",this);if(this.mType==="single"&&this.mDependencyFetch)throw new A("Pattern does not allow inner token pattern.",this);this.mPattern=this.convertTokenPattern(this.mType,e.pattern)}isSplit(){return this.mType==="split"}resolveDependencies(){this.mDependencyFetchResolved||(this.mDependencyFetch(this),this.mDependencyFetchResolved=!0)}useChildPattern(t){if(this.mLexer!==t.lexer)throw new A("Can only add dependencies of the same lexer.",this);this.mPatternDependencies.push(t)}convertTokenPattern(t,e){if("single"in e){if(t==="split")throw new A("Can't use split pattern type with single pattern definition.",this);return{start:{regex:e.single.regex,types:e.single.types,validator:e.single.validator??null}}}else{if(t==="single")throw new A("Can't use single pattern type with split pattern definition.",this);return{start:{regex:e.start.regex,types:e.start.types,validator:e.start.validator??null},end:{regex:e.end.regex,types:e.end.types,validator:e.end.validator??null},innerType:e.innerType??null}}}};var Wt=class{mColumnNumber;mLineNumber;mMetas;mType;mValue;get columnNumber(){return this.mColumnNumber}get lineNumber(){return this.mLineNumber}get metas(){return[...this.mMetas]}get type(){return this.mType}get value(){return this.mValue}constructor(t,e,n,c){this.mValue=e,this.mColumnNumber=n,this.mLineNumber=c,this.mType=t,this.mMetas=new Set}addMeta(...t){for(let e of t)this.mMetas.add(e)}hasMeta(t){return this.mMetas.has(t)}};var ie=class{mRootPattern;mSettings;get errorType(){return this.mSettings.errorType}set errorType(t){this.mSettings.errorType=t}get trimWhitespace(){return this.mSettings.trimSpaces}set trimWhitespace(t){this.mSettings.trimSpaces=t}get validWhitespaces(){return[...this.mSettings.whiteSpaces].join("")}set validWhitespaces(t){this.mSettings.whiteSpaces=new Set(t.split(""))}constructor(){this.mSettings={errorType:null,trimSpaces:!0,whiteSpaces:new Set},this.mRootPattern=new Yt(this,{type:"single",pattern:{single:{regex:/^/,types:{},validator:null}},metadata:[],dependencyFetch:null})}createTokenPattern(t,e){let n=y=>typeof y=="string"?{token:y}:y,c=y=>{let I=new Set(y.flags.split(""));return new RegExp(`^(?<token>${y.source})`,[...I].join(""))},f=new Array;t.meta&&(typeof t.meta=="string"?f.push(t.meta):f.push(...t.meta));let g;return"regex"in t.pattern?g={single:{regex:c(t.pattern.regex),types:n(t.pattern.type),validator:t.pattern.validator??null}}:g={start:{regex:c(t.pattern.start.regex),types:n(t.pattern.start.type),validator:t.pattern.start.validator??null},end:{regex:c(t.pattern.end.regex),types:n(t.pattern.end.type),validator:t.pattern.end.validator??null},innerType:t.pattern.innerType??null},new Yt(this,{type:"regex"in t.pattern?"single":"split",pattern:g,metadata:f,dependencyFetch:e??null})}*tokenize(t,e){let n={data:t,cursor:{position:0,column:1,line:1},error:null,progressTracker:e??null};yield*this.tokenizeRecursionLayer(n,this.mRootPattern,new Array,null)}useRootTokenPattern(t){if(t.lexer!==this)throw new A("Token pattern must be created by this lexer.",this);this.mRootPattern.useChildPattern(t)}findNextStartToken(t,e,n,c){for(let f of e){let g=f.pattern.start,y=this.matchToken(f,g,t,n,c);if(y!==null)return{pattern:f,token:y}}return null}findTokenTypeOfMatch(t,e,n){for(let g in t.groups){let y=t.groups[g],I=e[g];if(!(!y||!I)){if(y.length!==t[0].length)throw new A("A group of a token pattern must match the whole token.",this);return I}}let c=new Array;for(let g in t.groups)t.groups[g]&&c.push(g);let f=new Array;for(let g in e)f.push(g);throw new A(`No token type found for any defined pattern regex group. Full: "${t[0]}", Matches: "${c.join(", ")}", Available: "${f.join(", ")}", Regex: "${n.source}"`,this)}*generateErrorToken(t,e){if(!t.error||!this.mSettings.errorType)return;let n=new Wt(this.mSettings.errorType,t.error.data,t.error.startColumn,t.error.startLine);n.addMeta(...e),t.error=null,yield n}generateToken(t,e,n,c,f,g){let y=n[0],I=this.findTokenTypeOfMatch(n,c,g),D=new Wt(f??I,y,t.cursor.column,t.cursor.line);return D.addMeta(...e),D}matchToken(t,e,n,c,f){let g=e.regex;g.lastIndex=0;let y=g.exec(n.data);if(!y||y.index!==0)return null;let I=this.generateToken(n,[...c,...t.meta],y,e.types,f,g);if(e.validator){let D=n.data.substring(I.value.length);if(!e.validator(I,D,n.cursor.position))return null}return this.moveCursor(n,I.value),I}moveCursor(t,e){let n=e.split(`
`);n.length>1&&(t.cursor.column=1),t.cursor.line+=n.length-1,t.cursor.column+=n.at(-1).length,t.cursor.position+=e.length,t.data=t.data.substring(e.length),this.trackProgress(t)}pushNextCharToErrorState(t){if(!this.mSettings.errorType)throw new $t(`Unable to parse next token. No valid pattern found for "${t.data.substring(0,20)}".`,this,t.cursor.column,t.cursor.line,t.cursor.column,t.cursor.line);t.error||(t.error={data:"",startColumn:t.cursor.column,startLine:t.cursor.line});let e=t.data.charAt(0);t.error.data+=e,this.moveCursor(t,e)}skipNextWhitespace(t){let e=t.data.charAt(0);return!this.mSettings.trimSpaces||!this.mSettings.whiteSpaces.has(e)?!1:(this.moveCursor(t,e),!0)}*tokenizeRecursionLayer(t,e,n,c){let f=e.dependencies;for(;t.data.length>0;){if(!t.error&&this.skipNextWhitespace(t))continue;if(e.isSplit()){let I=this.matchToken(e,e.pattern.end,t,n,c);if(I!==null){yield*this.generateErrorToken(t,n),yield I;return}}let g=this.findNextStartToken(t,f,n,c);if(!g){this.pushNextCharToErrorState(t);continue}yield*this.generateErrorToken(t,n),yield g.token;let y=g.pattern;y.isSplit()&&(y.resolveDependencies(),yield*this.tokenizeRecursionLayer(t,y,[...n,...y.meta],c??y.pattern.innerType))}yield*this.generateErrorToken(t,n)}trackProgress(t){t.progressTracker!==null&&t.progressTracker(t.cursor.position,t.cursor.line,t.cursor.column)}};var Z=class extends Error{static PARSER_ERROR=Symbol("PARSER_ERROR");mTrace;get columnEnd(){return this.mTrace.top.range.columnEnd}get columnStart(){return this.mTrace.top.range.columnStart}get graph(){return this.mTrace.top.graph}get incidents(){return this.mTrace.incidents}get lineEnd(){return this.mTrace.top.range.lineEnd}get lineStart(){return this.mTrace.top.range.lineStart}constructor(t){super(t.top.message,{cause:t.top.cause}),this.mTrace=t}};var Ce=class{mIncidents;mTop;get incidents(){if(this.mIncidents===null)throw new A("A complete incident list is only available on debug mode.",this);return this.mIncidents}get top(){return this.mTop}constructor(t){this.mTop={message:"Unknown parser error",priority:0,graph:null,range:{lineStart:1,columnStart:1,lineEnd:1,columnEnd:1},cause:null},t?this.mIncidents=new Array:this.mIncidents=null}push(t,e,n,c,f,g,y=!1,I=null){let D;if(y?D=this.mTop.priority+1:D=f*1e4+g,this.mIncidents!==null){let l={message:t,priority:D,graph:e,range:{lineStart:n,columnStart:c,lineEnd:f,columnEnd:g},cause:I};this.mIncidents.push(l)}this.mTop&&D<this.mTop.priority||this.setTop({message:t,priority:D,graph:e,range:{lineStart:n,columnStart:c,lineEnd:f,columnEnd:g},cause:I})}setTop(t){this.mTop=t}};var Ie=class m{static MAX_JUNCTION_CIRCULAR_REFERENCES=1e3;mGraphStack;mIncidentTrace;mLastTokenPosition;mProcessStack;mTokenCache;mTokenGenerator;mTrimTokenCache;get currentGraph(){return this.mGraphStack.top.graph}get currentToken(){let t=this.mGraphStack.top;return this.mTokenCache[t.token.cursor]}get incidentTrace(){return this.mIncidentTrace}get processStack(){return this.mProcessStack}constructor(t,e,n){this.mTokenGenerator=t,this.mGraphStack=new Ct,this.mLastTokenPosition={column:1,line:1},this.mTokenCache=new Array,this.mProcessStack=new Ct,this.mTrimTokenCache=n,this.mIncidentTrace=new Ce(e),this.mGraphStack.push({graph:null,linear:!0,circularGraphs:new Q,token:{start:0,cursor:-1}})}collapse(){let t=this.mGraphStack.top,e=this.mTokenCache.slice(t.token.cursor);e.length!==0&&e.at(-1)===null&&e.pop();for(let n of this.mTokenGenerator)e.push(n);return e}getGraphBoundingToken(){let t=this.mGraphStack.top,e=this.mTokenCache[t.token.start],n=this.mTokenCache[t.token.cursor-1];return e??=n,n??=e,[e??null,n??null]}getGraphPosition(){let t=this.mGraphStack.top,e,n;if(e=this.mTokenCache[t.token.start],n=this.mTokenCache[t.token.cursor-1],e??=n,n??=e,!e||!n)return{graph:t.graph,columnEnd:this.mLastTokenPosition.column,columnStart:this.mLastTokenPosition.column,lineEnd:this.mLastTokenPosition.line,lineStart:this.mLastTokenPosition.line};let c,f;if(n.value.includes(`
`)){let g=n.value.split(`
`);f=n.lineNumber+g.length-1,c=1+g[g.length-1].length}else c=n.columnNumber+n.value.length,f=n.lineNumber;return{graph:t.graph,lineStart:e.lineNumber,columnStart:e.columnNumber,lineEnd:f,columnEnd:c}}getTokenPosition(){let t=this.mGraphStack.top,e=this.currentToken;if(!e)return{graph:t.graph,columnEnd:this.mLastTokenPosition.column,columnStart:this.mLastTokenPosition.column,lineEnd:this.mLastTokenPosition.line,lineStart:this.mLastTokenPosition.line};let n,c;if(e.value.includes(`
`)){let f=e.value.split(`
`);c=e.lineNumber+f.length-1,n=1+f[f.length-1].length}else n=e.columnNumber+e.value.length,c=e.lineNumber;return{graph:t.graph,lineStart:e.lineNumber,columnStart:e.columnNumber,lineEnd:c,columnEnd:n}}graphIsCircular(t){let e=this.mGraphStack.top;if(!e.circularGraphs.has(t))return!1;if(t.isJunction){if(e.circularGraphs.get(t)>m.MAX_JUNCTION_CIRCULAR_REFERENCES)throw new A("Junction graph called circular too often.",this);return!1}return!0}moveNextToken(){let t=this.mGraphStack.top;if(t.circularGraphs.size>0&&(t.circularGraphs=new Q),t.graph&&t.graph.isJunction)throw new A("Junction graph must not have own nodes.",this);if(t.token.cursor++,t.token.cursor<this.mTokenCache.length)return;let e=this.mTokenGenerator.next();if(e.done){this.mTokenCache.push(null);return}this.mLastTokenPosition.column=e.value.columnNumber,this.mLastTokenPosition.line=e.value.lineNumber,this.mTokenCache.push(e.value)}popGraphStack(t){let e=this.mGraphStack.pop(),n=this.mGraphStack.top;if(t&&(e.token.cursor=e.token.start),e.token.cursor!==e.token.start&&n.circularGraphs.size>0&&(n.circularGraphs=new Q),!this.mTrimTokenCache){n.token.cursor=e.token.cursor;return}e.linear?(this.mTokenCache.splice(0,e.token.cursor),n.token.start=0,n.token.cursor=0):n.token.cursor=e.token.cursor}pushGraphStack(t,e){let n=this.mGraphStack.top,c={graph:t,linear:e&&n.linear,circularGraphs:new Q(n.circularGraphs),token:{start:n.token.cursor,cursor:n.token.cursor}},f=c.circularGraphs.get(t)??0;c.circularGraphs.set(t,f+1),this.mGraphStack.push(c)}};var se=class m{static NODE_NULL_RESULT=Symbol("FAILED_NODE_VALUE_PARSE");static NODE_VALUE_LIST_END_MEET=Symbol("FAILED_NODE_VALUE_PARSE");mConfiguration;mLexer;mRootPart;get lexer(){return this.mLexer}constructor(t,e){this.mLexer=t,this.mRootPart=null,this.mConfiguration={keepTraceIncidents:!1,trimTokenCache:!1,...e}}parse(t,e){if(this.mRootPart===null)throw new A("Parser has not root part set.",this);let n=new Ie(this.mLexer.tokenize(t,e),this.mConfiguration.keepTraceIncidents,this.mConfiguration.trimTokenCache),c=(()=>{try{return this.beginParseProcess(n,this.mRootPart)}catch(g){if(g instanceof $t)return n.incidentTrace.push(g.message,n.currentGraph,g.lineStart,g.columnStart,g.lineEnd,g.columnEnd,!0,g),Z.PARSER_ERROR;let y=g instanceof Error?g.message:g.toString(),I=n.getGraphPosition();return n.incidentTrace.push(y,n.currentGraph,I.lineStart,I.columnStart,I.lineEnd,I.columnEnd,!0,g),Z.PARSER_ERROR}})();if(c===Z.PARSER_ERROR)throw new Z(n.incidentTrace);let f=n.collapse();if(f.length!==0){let g=f[0];if(n.incidentTrace.top.range.lineEnd===1&&n.incidentTrace.top.range.columnEnd===1){let y=`Tokens could not be parsed. Graph end meet without reaching last token. Current: "${g.value}" (${g.type})`;n.incidentTrace.push(y,this.mRootPart,g.lineNumber,g.columnNumber,g.lineNumber,g.columnNumber)}throw new Z(n.incidentTrace)}return c}setRootGraph(t){this.mRootPart=t}beginParseProcess(t,e){t.moveNextToken(),t.processStack.push({type:"graph-parse",parameter:{graph:e,linear:!0},state:0});let n=m.NODE_NULL_RESULT;for(;t.processStack.top;)n=this.processStack(t,t.processStack.top,n);return n}processChainedNodeParseProcess(t,e,n){switch(e.state){case 0:{let g=e.parameter.node.connections.next;return g===null?(t.processStack.pop(),{}):(e.state++,t.processStack.push({type:"node-parse",parameter:{node:g},state:0,values:{}}),m.NODE_NULL_RESULT)}case 1:{let c=n;return c===Z.PARSER_ERROR?(t.processStack.pop(),Z.PARSER_ERROR):(t.processStack.pop(),c)}}throw new A(`Invalid node next parse state "${e.state}".`,this)}processGraphParseProcess(t,e,n){let c=e.parameter.graph;switch(e.state){case 0:{if(t.graphIsCircular(c)){let g=t.getGraphPosition();return t.incidentTrace.push("Circular graph detected.",c,g.lineStart,g.columnStart,g.lineEnd,g.columnEnd),t.processStack.pop(),Z.PARSER_ERROR}let f=e.parameter.linear;return t.pushGraphStack(c,f),e.state++,t.processStack.push({type:"node-parse",parameter:{node:c.node},state:0,values:{}}),m.NODE_NULL_RESULT}case 1:{let f=n;if(f===Z.PARSER_ERROR)return t.popGraphStack(!0),t.processStack.pop(),Z.PARSER_ERROR;let g=c.convert(f,t);if(typeof g=="symbol"){let y=t.getGraphPosition();return t.incidentTrace.push(g.description??"Unknown data convert error",y.graph,y.lineStart,y.columnStart,y.lineEnd,y.columnEnd),t.popGraphStack(!0),t.processStack.pop(),Z.PARSER_ERROR}return t.popGraphStack(!1),t.processStack.pop(),g}}throw new A(`Invalid graph parse state "${e.state}".`,this)}processNodeParseProcess(t,e,n){let c=e.parameter.node;switch(e.state){case 0:return t.processStack.push({type:"node-value-parse",parameter:{node:c,valueIndex:0},state:0,values:{}}),e.state++,m.NODE_NULL_RESULT;case 1:{let f=n;return f===Z.PARSER_ERROR?(t.processStack.pop(),Z.PARSER_ERROR):(e.values.nodeValueResult=f,t.processStack.push({type:"node-next-parse",parameter:{node:c},state:0}),e.state++,m.NODE_NULL_RESULT)}case 2:{let f=n;if(f===Z.PARSER_ERROR)return t.processStack.pop(),Z.PARSER_ERROR;let g=c.mergeData(e.values.nodeValueResult,f);return t.processStack.pop(),g}}throw new A(`Invalid node parse state "${e.state}".`,this)}processNodeValueParseProcess(t,e,n){let c=e.parameter.node;switch(e.state){case 0:{if(n!==m.NODE_NULL_RESULT&&n!==Z.PARSER_ERROR)return e.values.parseResult=n,e.state++,m.NODE_NULL_RESULT;let f=e.parameter.valueIndex,g=c.connections;if(f>=g.values.length)return e.values.parseResult=m.NODE_VALUE_LIST_END_MEET,e.state++,m.NODE_NULL_RESULT;e.parameter.valueIndex++;let y=t.currentToken,I=g.values[f];if(typeof I=="string"){if(!y){if(g.required){let D=t.getTokenPosition();t.incidentTrace.push(`Unexpected end of statement. Token "${I}" expected.`,t.currentGraph,D.lineStart,D.columnStart,D.lineEnd,D.columnEnd)}return m.NODE_NULL_RESULT}if(I!==y.type){if(g.required){let D=t.getTokenPosition();t.incidentTrace.push(`Unexpected token "${y.value}". "${I}" expected`,t.currentGraph,D.lineStart,D.columnStart,D.lineEnd,D.columnEnd)}return m.NODE_NULL_RESULT}return t.moveNextToken(),y.value}else{let D=g.values.length===1||g.values.length===f+1;return t.processStack.push({type:"graph-parse",parameter:{graph:I,linear:D},state:0}),m.NODE_NULL_RESULT}}case 1:{let f=e.values.parseResult,g=c.connections;if(f===m.NODE_VALUE_LIST_END_MEET&&!g.required){t.processStack.pop();return}return f===m.NODE_VALUE_LIST_END_MEET?(t.processStack.pop(),Z.PARSER_ERROR):(t.processStack.pop(),f)}}throw new A(`Invalid node value parse state "${e.state}".`,this)}processStack(t,e,n){switch(e.type){case"graph-parse":return this.processGraphParseProcess(t,e,n);case"node-parse":return this.processNodeParseProcess(t,e,n);case"node-value-parse":return this.processNodeValueParseProcess(t,e,n);case"node-next-parse":return this.processChainedNodeParseProcess(t,e,n)}}};var J=class m{static define(t,e=!1){return new m(t,e)}mDataConverterList;mGraphCollector;mIsJunction;mResolvedGraphNode;get isJunction(){return this.mIsJunction}get node(){return this.mResolvedGraphNode||(this.mResolvedGraphNode=this.mGraphCollector().root),this.mResolvedGraphNode}constructor(t,e){this.mGraphCollector=t,this.mDataConverterList=new Array,this.mResolvedGraphNode=null,this.mIsJunction=e}convert(t,e){if(this.mDataConverterList.length===0)return t;let n=e.getGraphBoundingToken(),c=n[0]??void 0,f=n[1]??void 0;if(this.mDataConverterList.length===1)return this.mDataConverterList[0](t,c,f);let g=t;for(let y of this.mDataConverterList)if(g=y(g,c,f),typeof g=="symbol")return g;return g}converter(t){let e=new m(this.mGraphCollector,this.isJunction);return e.mDataConverterList.push(...this.mDataConverterList,t),e}};var H=class m{static new(){let t=new m("",!1,[]);return t.mRootNode=null,t}mConnections;mIdentifier;mRootNode;get configuration(){return{dataKey:this.mIdentifier.dataKey,isList:this.mIdentifier.type==="list",isRequired:this.mConnections.required,isBranch:this.mConnections.values.length>1}}get connections(){return this.mConnections}get root(){if(!this.mRootNode)throw new A("Staring nodes must be chained with another node to be used.",this);return this.mRootNode}constructor(t,e,n,c){if(t==="")this.mIdentifier={type:"empty",dataKey:"",mergeKey:""};else if(t.endsWith("[]"))this.mIdentifier={type:"list",mergeKey:"",dataKey:t.substring(0,t.length-2)};else if(t.includes("<-")){let g=t.split("<-");this.mIdentifier={type:"merge",dataKey:g[0],mergeKey:g[1]}}else this.mIdentifier={type:"single",mergeKey:"",dataKey:t};let f=n.map(g=>g instanceof m?J.define(()=>g):g);this.mConnections={required:e,values:f,next:null},c?this.mRootNode=c:this.mRootNode=this}mergeData(t,e){if(this.mIdentifier.type==="empty")return e;let n=e,c=typeof t>"u";if(this.mIdentifier.type==="single"){if(this.mIdentifier.dataKey in e)throw new A(`Graph path has a duplicate value identifier "${this.mIdentifier.dataKey}"`,this);return c||(n[this.mIdentifier.dataKey]=t),e}if(this.mIdentifier.type==="list"){let y;c?y=new Array:Array.isArray(t)?y=t:y=[t];let I=(()=>{if(this.mIdentifier.dataKey in e){let D=n[this.mIdentifier.dataKey];return Array.isArray(D)?(D.unshift(...y),D):(y.push(D),y)}return y})();return n[this.mIdentifier.dataKey]=I,e}if(c)return e;let f=(()=>{if(!this.mIdentifier.mergeKey)throw new A("Cant merge data without a merge key.",this);if(typeof t!="object"||t===null)throw new A("Node data must be an object when merge key is set.",this);if(!(this.mIdentifier.mergeKey in t))throw new A(`Node data does not contain merge key "${this.mIdentifier.mergeKey}"`,this);return t[this.mIdentifier.mergeKey]})();if(typeof f>"u")return e;let g=n[this.mIdentifier.dataKey];if(typeof g>"u")return n[this.mIdentifier.dataKey]=f,n;if(!Array.isArray(g))throw new A("Chain data merge value is not an array but should be.",this);return Array.isArray(f)?g.unshift(...f):g.unshift(f),e}optional(t,e){let n=typeof e>"u"?"":t,c=typeof e>"u"?t:e,f=new Array;Array.isArray(c)?f.push(...c):f.push(c);let g=new m(n,!1,f,this.mRootNode);return this.setChainedNode(g),g}required(t,e){let n=typeof e>"u"?"":t,c=typeof e>"u"?t:e,f=new Array;Array.isArray(c)?f.push(...c):f.push(c);let g=new m(n,!0,f,this.mRootNode);return this.setChainedNode(g),g}setChainedNode(t){if(this.mConnections.next!==null)throw new A("Node can only be chained to a single node.",this);this.mConnections.next=t}};var V={XmlIdentifier:"Identifier",XmlAssignment:"XmlAssignment",XmlValue:"XmlValue",XmlComment:"XmlComment",XmlOpenClosingBracket:"XmlOpenClosingBracket",XmlCloseBracket:"XmlCloseBracket",XmlOpenBracket:"XmlOpenBracket",XmlCloseClosingBracket:"XmlCloseClosingBracket",XmlExplicitValueIdentifier:"XmlExplicitValueIdentifier",ExpressionStart:"ExpressionStart",ExpressionEnd:"ExpressionEnd",ExpressionValue:"ExpressionValue",InstructionStart:"InstructionStart",InstructionInstructionValue:"InstructionInstructionValue",InstructionBodyStartBraket:"InstructionBodyStartBraket",InstructionBodyCloseBraket:"InstructionBodyCloseBraket",InstructionInstructionClosingBracket:"InstructionInstructionClosingBracket",InstructionInstructionOpeningBracket:"InstructionInstructionOpeningBracket"};var Se=class extends ie{constructor(){super(),this.validWhitespaces=` 
\r`,this.trimWhitespace=!0;let t=this.createTokenPattern({pattern:{regex:/(?:(?!}}).)*/,type:V.ExpressionValue}}),e=this.createTokenPattern({pattern:{start:{regex:/{{/,type:V.ExpressionStart},end:{regex:/}}/,type:V.ExpressionEnd}}},s=>{s.useChildPattern(t)}),n=this.createTokenPattern({pattern:{regex:/[^>\s\n="/]+/,type:V.XmlIdentifier}}),c=this.createTokenPattern({pattern:{regex:/(?:(?!{{|"|<).)+/,type:V.XmlValue}}),f=this.createTokenPattern({pattern:{regex:/<!--.*?-->/,type:V.XmlComment}}),g=this.createTokenPattern({pattern:{regex:/=/,type:V.XmlAssignment}}),y=this.createTokenPattern({pattern:{start:{regex:/"/,type:V.XmlExplicitValueIdentifier},end:{regex:/"/,type:V.XmlExplicitValueIdentifier}}},s=>{s.useChildPattern(e),s.useChildPattern(c)}),I=this.createTokenPattern({pattern:{start:{regex:/<\//,type:V.XmlOpenClosingBracket},end:{regex:/>/,type:V.XmlCloseBracket}}},s=>{s.useChildPattern(n)}),D=this.createTokenPattern({pattern:{start:{regex:/</,type:V.XmlOpenBracket},end:{regex:/(?<closeClosingBracket>\/>)|(?<closeBracket>>)/,type:{closeClosingBracket:V.XmlCloseClosingBracket,closeBracket:V.XmlCloseBracket}}}},s=>{s.useChildPattern(g),s.useChildPattern(n),s.useChildPattern(y)}),l=this.createTokenPattern({pattern:{regex:/[^()"'`/)]+/,type:V.InstructionInstructionValue}}),o=this.createTokenPattern({pattern:{innerType:V.InstructionInstructionValue,start:{regex:/\//,type:V.InstructionInstructionValue},end:{regex:/\//,type:V.InstructionInstructionValue}}},s=>{s.useChildPattern(a),s.useChildPattern(r),s.useChildPattern(b),s.useChildPattern(u),s.useChildPattern(l)}),u=this.createTokenPattern({pattern:{innerType:V.InstructionInstructionValue,start:{regex:/\(/,type:V.InstructionInstructionValue},end:{regex:/\)/,type:V.InstructionInstructionValue}}},s=>{s.useChildPattern(o),s.useChildPattern(a),s.useChildPattern(r),s.useChildPattern(b),s.useChildPattern(l)}),a=this.createTokenPattern({pattern:{innerType:V.InstructionInstructionValue,start:{regex:/"/,type:V.InstructionInstructionValue},end:{regex:/"/,type:V.InstructionInstructionValue}}},s=>{s.useChildPattern(o),s.useChildPattern(r),s.useChildPattern(b),s.useChildPattern(u),s.useChildPattern(l)}),r=this.createTokenPattern({pattern:{innerType:V.InstructionInstructionValue,start:{regex:/'/,type:V.InstructionInstructionValue},end:{regex:/'/,type:V.InstructionInstructionValue}}},s=>{s.useChildPattern(o),s.useChildPattern(a),s.useChildPattern(b),s.useChildPattern(u),s.useChildPattern(l)}),b=this.createTokenPattern({pattern:{innerType:V.InstructionInstructionValue,start:{regex:/`/,type:V.InstructionInstructionValue},end:{regex:/`/,type:V.InstructionInstructionValue}}},s=>{s.useChildPattern(o),s.useChildPattern(a),s.useChildPattern(r),s.useChildPattern(u),s.useChildPattern(l)}),v=this.createTokenPattern({pattern:{regex:/\$[^(\s\n/{]+/,type:V.InstructionStart}}),T=this.createTokenPattern({pattern:{start:{regex:/\(/,type:V.InstructionInstructionOpeningBracket},end:{regex:/\)/,type:V.InstructionInstructionClosingBracket}}},s=>{s.useChildPattern(o),s.useChildPattern(a),s.useChildPattern(r),s.useChildPattern(b),s.useChildPattern(u),s.useChildPattern(l)}),w=this.createTokenPattern({pattern:{start:{regex:/{/,type:V.InstructionBodyStartBraket},end:{regex:/}/,type:V.InstructionBodyCloseBraket}}},s=>{for(let d of p)s.useChildPattern(d)}),p=[f,I,D,y,e,v,T,w,c];for(let s of p)this.useRootTokenPattern(s)}};var ae=class extends se{constructor(){super(new Se),this.initGraph()}initGraph(){let t=J.define(()=>H.new().required(V.ExpressionStart).optional("value",V.ExpressionValue).required(V.ExpressionEnd)).converter(r=>new dt(r.value??"")),e=J.define(()=>{let r=e;return H.new().required("data[]",H.new().required("value",[t,H.new().required("text",V.XmlValue)])).optional("data<-data",r)}),n=J.define(()=>H.new().required("name",V.XmlIdentifier).optional("attributeValue",H.new().required(V.XmlAssignment).required(V.XmlExplicitValueIdentifier).optional("list<-data",e).required(V.XmlExplicitValueIdentifier))).converter(r=>{let b=new Array;if(r.attributeValue?.list)for(let v of r.attributeValue.list)v.value instanceof dt?b.push(v.value):b.push(v.value.text);return{name:r.name,values:b}}),c=J.define(()=>{let r=c;return H.new().required("data[]",n).optional("data<-data",r)}),f=J.define(()=>{let r=f;return H.new().required("data[]",H.new().required("value",[t,H.new().required("text",V.XmlValue),H.new().required(V.XmlExplicitValueIdentifier).required("text",V.XmlValue).required(V.XmlExplicitValueIdentifier)])).optional("data<-data",r)}),g=J.define(()=>H.new().required("list<-data",f)).converter(r=>{let b=new wt;for(let v of r.list)v.value instanceof dt?b.addValue(v.value):b.addValue(v.value.text);return b}),y=J.define(()=>H.new().required(V.XmlComment)).converter(()=>null),I=J.define(()=>H.new().required(V.XmlOpenBracket).required("openingTagName",V.XmlIdentifier).optional("attributes<-data",c).required("closing",[H.new().required(V.XmlCloseClosingBracket),H.new().required(V.XmlCloseBracket).required("values",u).required(V.XmlOpenClosingBracket).required("closingTageName",V.XmlIdentifier).required(V.XmlCloseBracket)])).converter(r=>{if("closingTageName"in r.closing&&r.openingTagName!==r.closing.closingTageName)throw new A(`Opening (${r.openingTagName}) and closing tagname (${r.closing.closingTageName}) does not match`,this);let b=new xt(r.openingTagName);if(r.attributes)for(let v of r.attributes)b.setAttribute(v.name).addValue(...v.values);return"values"in r.closing&&b.appendChild(...r.closing.values),b}),D=J.define(()=>{let r=D;return H.new().required("list[]",V.InstructionInstructionValue).optional("list<-list",r)}),l=J.define(()=>H.new().required("instructionName",V.InstructionStart).optional("instruction",H.new().required(V.InstructionInstructionOpeningBracket).required("value<-list",D).required(V.InstructionInstructionClosingBracket)).optional("body",H.new().required(V.InstructionBodyStartBraket).required("value",u).required(V.InstructionBodyCloseBraket))).converter(r=>{let b=r.instructionName.substring(1),v=r.instruction?.value.join("")??"",T=new Vt(b,v);return r.body&&T.appendChild(...r.body.value),T}),o=J.define(()=>{let r=o;return H.new().required("list[]",[y,I,l,g]).optional("list<-list",r)}),u=J.define(()=>{let r=o;return H.new().optional("list<-list",r)}).converter(r=>{let b=new Array;if(r.list)for(let v of r.list)v!==null&&b.push(v);return b}),a=J.define(()=>H.new().required("content",u)).converter(r=>{let b=new at;return b.appendChild(...r.content),b});this.setRootGraph(a)}};var rt=class m extends be{static mTemplateCache=new Q;static mXmlParser=new ae;mComponentElement;mRootBuilder;get element(){return this.mComponentElement.htmlElement}constructor(t){super({constructor:t.processorConstructor,parent:null}),it.registerComponent(this,t.htmlElement),this.setProcessorInjection(m,this),this.addConstructionHook(n=>{it.registerComponent(this,this.mComponentElement.htmlElement,n)}),m.mTemplateCache.has(t.processorConstructor)||m.mTemplateCache.set(t.processorConstructor,m.mXmlParser.parse(t.templateString??""));let e=m.mTemplateCache.get(t.processorConstructor).clone();this.mComponentElement=new ne(t.htmlElement),this.mRootBuilder=new Xt(e,new Ee(this,t.expressionModule),new ut(this),"ROOT"),this.mComponentElement.shadowRoot.appendChild(this.mRootBuilder.anchor),this.setProcessorInjection(ft,new ft(this.mRootBuilder.values))}addStyle(t){let e=document.createElement("style");e.innerHTML=t,this.mComponentElement.shadowRoot.prepend(e)}attributeChanged(t,e,n){this.call("onAttributeChange",t,e,n)}connected(){this.call("onConnect")}deconstruct(){this.call("onDeconstruct"),this.mRootBuilder.deconstruct(),super.deconstruct()}disconnected(){this.call("onDisconnect")}onUpdate(){return this.mRootBuilder.update()?(this.call("onUpdate"),!0):!1}};function X(m){return(t,e)=>{$.registerInjectable(t,e.metadata,"instanced"),it.registerConstructor(t,m.selector);let n=class extends HTMLElement{mComponent;constructor(){super(),this.mComponent=new rt({processorConstructor:t,templateString:m.template??null,expressionModule:m.expressionmodule,htmlElement:this}).setup(),m.style&&this.mComponent.addStyle(m.style),this.mComponent.updater.update()}connectedCallback(){this.mComponent.connected()}disconnectedCallback(){this.mComponent.disconnected()}};globalThis.customElements.define(m.selector,n)}}function jt(m){return(t,e)=>{$.registerInjectable(t,e.metadata,"instanced"),st.register(_t,t,{access:m.access,targetRestrictions:m.targetRestrictions})}}function Tt(m){return(t,e)=>{$.registerInjectable(t,e.metadata,"instanced"),st.register(mt,t,{access:m.access,selector:m.selector})}}function Et(m){return(t,e)=>{$.registerInjectable(t,e.metadata,"instanced"),st.register(Rt,t,{instructionType:m.instructionType})}}function Ra(){function m(l,o){return function(a){e(o,"addInitializer"),n(a,"An initializer"),l.push(a)}}function t(l,o,u,a,r,b,v,T,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+o:o,static:b,private:v,metadata:T},d={v:!1};s.addInitializer=m(a,d);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[o]},h=function(x){this[o]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return l(w,s)}finally{d.v=!0}}function e(l,o){if(l.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(l,o){if(typeof l!="function")throw new TypeError(o+" must be a function")}function c(l,o){var u=typeof o;if(l===1){if(u!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(u!=="function"){var a;throw l===0?a="field":l===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function f(l,o,u,a,r,b,v,T,w){var p=u[0],s,d,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,S;if(typeof p=="function")h=t(p,a,s,T,r,b,v,w,i),h!==void 0&&(c(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,S=h.set||i.set,i={get:x,set:S}):i=h);else for(var _=p.length-1;_>=0;_--){var P=p[_];if(h=t(P,a,s,T,r,b,v,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,S=h.set||i.set,i={get:x,set:S}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(C,E){return E};else if(typeof d!="function"){var M=d;d=function(C,E){for(var R=E,L=0;L<M.length;L++)R=M[L].call(C,R);return R}}else{var j=d;d=function(C,E){return j.call(C,E)}}l.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(l.push(function(C,E){return i.get.call(C,E)}),l.push(function(C,E){return i.set.call(C,E)})):r===2?l.push(i):l.push(function(C,E){return i.call(C,E)}):Object.defineProperty(o,a,s))}function g(l,o,u){for(var a=[],r,b,v=new Map,T=new Map,w=0;w<o.length;w++){var p=o[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,S;if(h?(x=l,s=s-5,b=b||[],S=b):(x=l.prototype,r=r||[],S=r),s!==0&&!i){var _=h?T:v,P=_.get(d)||0;if(P===!0||P===3&&s!==4||P===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!P&&s>2?_.set(d,s):_.set(d,!0)}f(a,x,p,d,s,h,i,S,u)}}return y(a,r),y(a,b),a}function y(l,o){o&&l.push(function(u){for(var a=0;a<o.length;a++)o[a].call(u);return u})}function I(l,o,u){if(o.length>0){for(var a=[],r=l,b=l.name,v=o.length-1;v>=0;v--){var T={v:!1};try{var w=o[v](r,{kind:"class",name:b,addInitializer:m(a,T),metadata:u})}finally{T.v=!0}w!==void 0&&(c(10,w),r=w)}return[D(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function D(l,o){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,u,a,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),T=g(o,u,v);return a.length||D(o,v),{e:T,get c(){return I(o,a,v)}}}}function Qe(m,t,e,n){return(Qe=Ra())(m,t,e,n)}function La(m){return m}var ke,Ke,le;ke=jt({access:q.Read,targetRestrictions:[rt]});new class extends La{constructor(){super(le),Ke()}static{class m{static{({c:[le,Ke]}=Qe(this,[],[ke]))}static METADATA_USER_EVENT_LISTENER_PROPERIES="pwb:user_event_listener_properties";mEventListenerList;mTargetElement;constructor(e=$.use(rt)){let n=new Array,c=e.processorConstructor;do{let f=et.get(c).getMetadata(m.METADATA_USER_EVENT_LISTENER_PROPERIES);if(f)for(let g of f)n.push(g)}while(c=Object.getPrototypeOf(c));this.mEventListenerList=new Array,this.mTargetElement=e.element;for(let f of n){let[g,y]=f,I=Reflect.get(e.processor,g);I=I.bind(e.processor),this.mEventListenerList.push([y,I]),this.mTargetElement.addEventListener(y,I)}}onDeconstruct(){for(let e of this.mEventListenerList){let[n,c]=e;this.mTargetElement.removeEventListener(n,c)}}}}};var ce=class extends window.Event{mValue;get value(){return this.mValue}constructor(t,e){super(t),this.mValue=e}};var ue=class{mElement;mEventName;constructor(t,e){this.mEventName=t,this.mElement=e}dispatchEvent(t){let e=new ce(this.mEventName,t);this.mElement.dispatchEvent(e)}};function G(m){return(t,e)=>{if(e.static)throw new A("Event target is not for a static property.",G);let n=null;return{get(){if(!n){let c=(()=>{try{return it.ofProcessor(this).component}catch{throw new A("PwbComponentEvent target class is not a component.",this)}})();n=new ue(m,c.element)}return n}}}}function Ma(){function m(l,o){return function(a){e(o,"addInitializer"),n(a,"An initializer"),l.push(a)}}function t(l,o,u,a,r,b,v,T,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+o:o,static:b,private:v,metadata:T},d={v:!1};s.addInitializer=m(a,d);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[o]},h=function(x){this[o]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return l(w,s)}finally{d.v=!0}}function e(l,o){if(l.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(l,o){if(typeof l!="function")throw new TypeError(o+" must be a function")}function c(l,o){var u=typeof o;if(l===1){if(u!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(u!=="function"){var a;throw l===0?a="field":l===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function f(l,o,u,a,r,b,v,T,w){var p=u[0],s,d,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,S;if(typeof p=="function")h=t(p,a,s,T,r,b,v,w,i),h!==void 0&&(c(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,S=h.set||i.set,i={get:x,set:S}):i=h);else for(var _=p.length-1;_>=0;_--){var P=p[_];if(h=t(P,a,s,T,r,b,v,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,S=h.set||i.set,i={get:x,set:S}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(C,E){return E};else if(typeof d!="function"){var M=d;d=function(C,E){for(var R=E,L=0;L<M.length;L++)R=M[L].call(C,R);return R}}else{var j=d;d=function(C,E){return j.call(C,E)}}l.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(l.push(function(C,E){return i.get.call(C,E)}),l.push(function(C,E){return i.set.call(C,E)})):r===2?l.push(i):l.push(function(C,E){return i.call(C,E)}):Object.defineProperty(o,a,s))}function g(l,o,u){for(var a=[],r,b,v=new Map,T=new Map,w=0;w<o.length;w++){var p=o[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,S;if(h?(x=l,s=s-5,b=b||[],S=b):(x=l.prototype,r=r||[],S=r),s!==0&&!i){var _=h?T:v,P=_.get(d)||0;if(P===!0||P===3&&s!==4||P===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!P&&s>2?_.set(d,s):_.set(d,!0)}f(a,x,p,d,s,h,i,S,u)}}return y(a,r),y(a,b),a}function y(l,o){o&&l.push(function(u){for(var a=0;a<o.length;a++)o[a].call(u);return u})}function I(l,o,u){if(o.length>0){for(var a=[],r=l,b=l.name,v=o.length-1;v>=0;v--){var T={v:!1};try{var w=o[v](r,{kind:"class",name:b,addInitializer:m(a,T),metadata:u})}finally{T.v=!0}w!==void 0&&(c(10,w),r=w)}return[D(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function D(l,o){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,u,a,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),T=g(o,u,v);return a.length||D(o,v),{e:T,get c(){return I(o,a,v)}}}}function er(m,t,e,n){return(er=Ma())(m,t,e,n)}function Oa(m){return m}var rr,tr,he;rr=jt({access:q.ReadWrite,targetRestrictions:[rt]});new class extends Oa{constructor(){super(he),tr()}static{class m{static{({c:[he,tr]}=er(this,[],[rr]))}static METADATA_EXPORTED_PROPERTIES="pwb:exported_properties";mComponent;constructor(e=$.use(rt)){this.mComponent=e;let n=new Mt,c=e.processorConstructor;do{let g=et.get(c).getMetadata(m.METADATA_EXPORTED_PROPERTIES);g&&n.push(...g)}while(c=Object.getPrototypeOf(c));let f=new Set(n);f.size>0&&this.connectExportedProperties(f)}connectExportedProperties(e){this.exportPropertyAsAttribute(e),this.patchHtmlAttributes(e)}exportPropertyAsAttribute(e){for(let n of e){let c={};c.enumerable=!0,c.configurable=!0,delete c.value,delete c.writable,c.set=f=>{Reflect.set(this.mComponent.processor,n,f)},c.get=()=>{let f=Reflect.get(this.mComponent.processor,n);return typeof f=="function"&&(f=f.bind(this.mComponent.processor)),f},Object.defineProperty(this.mComponent.element,n,c)}}patchHtmlAttributes(e){let n=this.mComponent.element.getAttribute;new MutationObserver(f=>{for(let g of f){let y=g.attributeName,I=n.call(this.mComponent.element,y);Reflect.set(this.mComponent.element,y,I),this.mComponent.attributeChanged(y,g.oldValue,I)}}).observe(this.mComponent.element,{attributeFilter:[...e],attributeOldValue:!0});for(let f of e)if(this.mComponent.element.hasAttribute(f)){let g=n.call(this.mComponent.element,f);this.mComponent.element.setAttribute(f,g)}this.mComponent.element.getAttribute=f=>e.has(f)?Reflect.get(this.mComponent.element,f):n.call(this.mComponent.element,f)}}}};function F(m,t){if(t.static)throw new A("Event target is not for a static property.",F);let e=et.forInternalDecorator(t.metadata),n=e.getMetadata(he.METADATA_EXPORTED_PROPERTIES)??new Array;n.push(t.name),e.setMetadata(he.METADATA_EXPORTED_PROPERTIES,n)}function nt(m){return(t,e)=>{if(e.static)throw new A("Child decorator is not for a static property.",nt);return{get(){let f=(()=>{try{return it.ofProcessor(this).component}catch{throw new A("PwbChild target class is not a component.",this)}})().getProcessorInjection(ft).data.store[m];if(f instanceof Element)return f;throw new A(`Can't find child "${m}".`,this)}}}}function Fa(){function m(l,o){return function(a){e(o,"addInitializer"),n(a,"An initializer"),l.push(a)}}function t(l,o,u,a,r,b,v,T,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+o:o,static:b,private:v,metadata:T},d={v:!1};s.addInitializer=m(a,d);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[o]},h=function(x){this[o]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return l(w,s)}finally{d.v=!0}}function e(l,o){if(l.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(l,o){if(typeof l!="function")throw new TypeError(o+" must be a function")}function c(l,o){var u=typeof o;if(l===1){if(u!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(u!=="function"){var a;throw l===0?a="field":l===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function f(l,o,u,a,r,b,v,T,w){var p=u[0],s,d,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,S;if(typeof p=="function")h=t(p,a,s,T,r,b,v,w,i),h!==void 0&&(c(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,S=h.set||i.set,i={get:x,set:S}):i=h);else for(var _=p.length-1;_>=0;_--){var P=p[_];if(h=t(P,a,s,T,r,b,v,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,S=h.set||i.set,i={get:x,set:S}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(C,E){return E};else if(typeof d!="function"){var M=d;d=function(C,E){for(var R=E,L=0;L<M.length;L++)R=M[L].call(C,R);return R}}else{var j=d;d=function(C,E){return j.call(C,E)}}l.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(l.push(function(C,E){return i.get.call(C,E)}),l.push(function(C,E){return i.set.call(C,E)})):r===2?l.push(i):l.push(function(C,E){return i.call(C,E)}):Object.defineProperty(o,a,s))}function g(l,o,u){for(var a=[],r,b,v=new Map,T=new Map,w=0;w<o.length;w++){var p=o[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,S;if(h?(x=l,s=s-5,b=b||[],S=b):(x=l.prototype,r=r||[],S=r),s!==0&&!i){var _=h?T:v,P=_.get(d)||0;if(P===!0||P===3&&s!==4||P===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!P&&s>2?_.set(d,s):_.set(d,!0)}f(a,x,p,d,s,h,i,S,u)}}return y(a,r),y(a,b),a}function y(l,o){o&&l.push(function(u){for(var a=0;a<o.length;a++)o[a].call(u);return u})}function I(l,o,u){if(o.length>0){for(var a=[],r=l,b=l.name,v=o.length-1;v>=0;v--){var T={v:!1};try{var w=o[v](r,{kind:"class",name:b,addInitializer:m(a,T),metadata:u})}finally{T.v=!0}w!==void 0&&(c(10,w),r=w)}return[D(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function D(l,o){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,u,a,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),T=g(o,u,v);return a.length||D(o,v),{e:T,get c(){return I(o,a,v)}}}}function ir(m,t,e,n){return(ir=Fa())(m,t,e,n)}var sr,or,Va;sr=Et({instructionType:"dynamic-content"});var nr=class{static{({c:[Va,or]}=ir(this,[],[sr]))}constructor(t=$.use(K),e=$.use(W)){this.mModuleValues=e,this.mLastTemplate=null,this.mProcedure=this.mModuleValues.createExpressionProcedure(t.value)}mLastTemplate;mModuleValues;mProcedure;onUpdate(){let t=this.mProcedure.execute();if(!t||!(t instanceof at))throw new A("Dynamic content method has a wrong result type.",this);if(this.mLastTemplate!==null&&this.mLastTemplate.equals(t))return null;let e=t.clone();this.mLastTemplate=e;let n=new ct;return n.addElement(e,new ut(this.mModuleValues.data)),n}static{or()}};function $a(){function m(l,o){return function(a){e(o,"addInitializer"),n(a,"An initializer"),l.push(a)}}function t(l,o,u,a,r,b,v,T,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+o:o,static:b,private:v,metadata:T},d={v:!1};s.addInitializer=m(a,d);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[o]},h=function(x){this[o]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return l(w,s)}finally{d.v=!0}}function e(l,o){if(l.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(l,o){if(typeof l!="function")throw new TypeError(o+" must be a function")}function c(l,o){var u=typeof o;if(l===1){if(u!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(u!=="function"){var a;throw l===0?a="field":l===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function f(l,o,u,a,r,b,v,T,w){var p=u[0],s,d,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,S;if(typeof p=="function")h=t(p,a,s,T,r,b,v,w,i),h!==void 0&&(c(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,S=h.set||i.set,i={get:x,set:S}):i=h);else for(var _=p.length-1;_>=0;_--){var P=p[_];if(h=t(P,a,s,T,r,b,v,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,S=h.set||i.set,i={get:x,set:S}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(C,E){return E};else if(typeof d!="function"){var M=d;d=function(C,E){for(var R=E,L=0;L<M.length;L++)R=M[L].call(C,R);return R}}else{var j=d;d=function(C,E){return j.call(C,E)}}l.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(l.push(function(C,E){return i.get.call(C,E)}),l.push(function(C,E){return i.set.call(C,E)})):r===2?l.push(i):l.push(function(C,E){return i.call(C,E)}):Object.defineProperty(o,a,s))}function g(l,o,u){for(var a=[],r,b,v=new Map,T=new Map,w=0;w<o.length;w++){var p=o[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,S;if(h?(x=l,s=s-5,b=b||[],S=b):(x=l.prototype,r=r||[],S=r),s!==0&&!i){var _=h?T:v,P=_.get(d)||0;if(P===!0||P===3&&s!==4||P===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!P&&s>2?_.set(d,s):_.set(d,!0)}f(a,x,p,d,s,h,i,S,u)}}return y(a,r),y(a,b),a}function y(l,o){o&&l.push(function(u){for(var a=0;a<o.length;a++)o[a].call(u);return u})}function I(l,o,u){if(o.length>0){for(var a=[],r=l,b=l.name,v=o.length-1;v>=0;v--){var T={v:!1};try{var w=o[v](r,{kind:"class",name:b,addInitializer:m(a,T),metadata:u})}finally{T.v=!0}w!==void 0&&(c(10,w),r=w)}return[D(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function D(l,o){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,u,a,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),T=g(o,u,v);return a.length||D(o,v),{e:T,get c(){return I(o,a,v)}}}}function cr(m,t,e,n){return(cr=$a())(m,t,e,n)}var ur,ar,ja;ur=Tt({access:q.Write,selector:/^\([[\w\-$]+\)$/});var lr=class{static{({c:[ja,ar]}=cr(this,[],[ur]))}constructor(t=$.use(tt),e=$.use(W),n=$.use(lt)){this.mTarget=t,this.mEventName=n.name.substring(1,n.name.length-1);let c=e.createExpressionProcedure(n.value,["$event"]);this.mListener=f=>{c.setTemporaryValue("$event",f),c.execute()},this.mTarget.addEventListener(this.mEventName,this.mListener)}mEventName;mListener;mTarget;onDeconstruct(){this.mTarget.removeEventListener(this.mEventName,this.mListener)}static{ar()}};function za(){function m(l,o){return function(a){e(o,"addInitializer"),n(a,"An initializer"),l.push(a)}}function t(l,o,u,a,r,b,v,T,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+o:o,static:b,private:v,metadata:T},d={v:!1};s.addInitializer=m(a,d);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[o]},h=function(x){this[o]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return l(w,s)}finally{d.v=!0}}function e(l,o){if(l.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(l,o){if(typeof l!="function")throw new TypeError(o+" must be a function")}function c(l,o){var u=typeof o;if(l===1){if(u!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(u!=="function"){var a;throw l===0?a="field":l===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function f(l,o,u,a,r,b,v,T,w){var p=u[0],s,d,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,S;if(typeof p=="function")h=t(p,a,s,T,r,b,v,w,i),h!==void 0&&(c(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,S=h.set||i.set,i={get:x,set:S}):i=h);else for(var _=p.length-1;_>=0;_--){var P=p[_];if(h=t(P,a,s,T,r,b,v,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,S=h.set||i.set,i={get:x,set:S}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(C,E){return E};else if(typeof d!="function"){var M=d;d=function(C,E){for(var R=E,L=0;L<M.length;L++)R=M[L].call(C,R);return R}}else{var j=d;d=function(C,E){return j.call(C,E)}}l.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(l.push(function(C,E){return i.get.call(C,E)}),l.push(function(C,E){return i.set.call(C,E)})):r===2?l.push(i):l.push(function(C,E){return i.call(C,E)}):Object.defineProperty(o,a,s))}function g(l,o,u){for(var a=[],r,b,v=new Map,T=new Map,w=0;w<o.length;w++){var p=o[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,S;if(h?(x=l,s=s-5,b=b||[],S=b):(x=l.prototype,r=r||[],S=r),s!==0&&!i){var _=h?T:v,P=_.get(d)||0;if(P===!0||P===3&&s!==4||P===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!P&&s>2?_.set(d,s):_.set(d,!0)}f(a,x,p,d,s,h,i,S,u)}}return y(a,r),y(a,b),a}function y(l,o){o&&l.push(function(u){for(var a=0;a<o.length;a++)o[a].call(u);return u})}function I(l,o,u){if(o.length>0){for(var a=[],r=l,b=l.name,v=o.length-1;v>=0;v--){var T={v:!1};try{var w=o[v](r,{kind:"class",name:b,addInitializer:m(a,T),metadata:u})}finally{T.v=!0}w!==void 0&&(c(10,w),r=w)}return[D(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function D(l,o){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,u,a,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),T=g(o,u,v);return a.length||D(o,v),{e:T,get c(){return I(o,a,v)}}}}function mr(m,t,e,n){return(mr=za())(m,t,e,n)}var pr,hr,Ga;pr=Et({instructionType:"for"});var dr=class{static{({c:[Ga,hr]}=mr(this,[],[pr]))}constructor(t=$.use(ht),e=$.use(W),n=$.use(K)){this.mTemplate=t,this.mModuleValues=e,this.mLastEntries=new Array;let c=n.value,g=new RegExp(/^\s*([a-zA-Z]+[a-zA-Z0-9]*)\s*of\s+([^;]+)\s*(;\s*([a-zA-Z]+[a-zA-Z0-9]*)\s*=\s*(.*)\s*)?$/).exec(c);if(!g)throw new A(`For-Parameter value has wrong format: ${c}`,this);let y=g[1],I=g[2],D=g[4]??null,l=g[5],o=this.mModuleValues.createExpressionProcedure(I),u=D?this.mModuleValues.createExpressionProcedure(l,["$index",y]):null;this.mExpression={iterateVariableName:y,iterateValueProcedure:o,indexExportVariableName:D,indexExportProcedure:u}}mExpression;mLastEntries;mModuleValues;mTemplate;onUpdate(){let t=new ct,e=this.mExpression.iterateValueProcedure.execute();if(typeof e=="object"&&e!==null||Array.isArray(e)){let n=Symbol.iterator in e?Object.entries([...e]):Object.entries(e);if(this.compareEntries(n,this.mLastEntries))return null;this.mLastEntries=n;for(let[c,f]of n)this.addTemplateForElement(t,this.mExpression,f,c);return t}else return null}addTemplateForElement=(t,e,n,c)=>{let f=new ut(this.mModuleValues.data);if(f.setTemporaryValue(e.iterateVariableName,n),e.indexExportProcedure&&e.indexExportVariableName){e.indexExportProcedure.setTemporaryValue("$index",c),e.indexExportProcedure.setTemporaryValue(e.iterateVariableName,n);let y=e.indexExportProcedure.execute();f.setTemporaryValue(e.indexExportVariableName,y)}let g=new at;g.appendChild(...this.mTemplate.childList),t.addElement(g,f)};compareEntries(t,e){if(t.length!==e.length)return!1;for(let n=0;n<t.length;n++){let[c,f]=t[n],[g,y]=e[n];if(c!==g||f!==y)return!1}return!0}static{hr()}};function Ba(){function m(l,o){return function(a){e(o,"addInitializer"),n(a,"An initializer"),l.push(a)}}function t(l,o,u,a,r,b,v,T,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+o:o,static:b,private:v,metadata:T},d={v:!1};s.addInitializer=m(a,d);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[o]},h=function(x){this[o]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return l(w,s)}finally{d.v=!0}}function e(l,o){if(l.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(l,o){if(typeof l!="function")throw new TypeError(o+" must be a function")}function c(l,o){var u=typeof o;if(l===1){if(u!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(u!=="function"){var a;throw l===0?a="field":l===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function f(l,o,u,a,r,b,v,T,w){var p=u[0],s,d,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,S;if(typeof p=="function")h=t(p,a,s,T,r,b,v,w,i),h!==void 0&&(c(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,S=h.set||i.set,i={get:x,set:S}):i=h);else for(var _=p.length-1;_>=0;_--){var P=p[_];if(h=t(P,a,s,T,r,b,v,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,S=h.set||i.set,i={get:x,set:S}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(C,E){return E};else if(typeof d!="function"){var M=d;d=function(C,E){for(var R=E,L=0;L<M.length;L++)R=M[L].call(C,R);return R}}else{var j=d;d=function(C,E){return j.call(C,E)}}l.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(l.push(function(C,E){return i.get.call(C,E)}),l.push(function(C,E){return i.set.call(C,E)})):r===2?l.push(i):l.push(function(C,E){return i.call(C,E)}):Object.defineProperty(o,a,s))}function g(l,o,u){for(var a=[],r,b,v=new Map,T=new Map,w=0;w<o.length;w++){var p=o[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,S;if(h?(x=l,s=s-5,b=b||[],S=b):(x=l.prototype,r=r||[],S=r),s!==0&&!i){var _=h?T:v,P=_.get(d)||0;if(P===!0||P===3&&s!==4||P===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!P&&s>2?_.set(d,s):_.set(d,!0)}f(a,x,p,d,s,h,i,S,u)}}return y(a,r),y(a,b),a}function y(l,o){o&&l.push(function(u){for(var a=0;a<o.length;a++)o[a].call(u);return u})}function I(l,o,u){if(o.length>0){for(var a=[],r=l,b=l.name,v=o.length-1;v>=0;v--){var T={v:!1};try{var w=o[v](r,{kind:"class",name:b,addInitializer:m(a,T),metadata:u})}finally{T.v=!0}w!==void 0&&(c(10,w),r=w)}return[D(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function D(l,o){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,u,a,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),T=g(o,u,v);return a.length||D(o,v),{e:T,get c(){return I(o,a,v)}}}}function vr(m,t,e,n){return(vr=Ba())(m,t,e,n)}var yr,fr,Ua;yr=Et({instructionType:"if"});var gr=class{static{({c:[Ua,fr]}=vr(this,[],[yr]))}constructor(t=$.use(ht),e=$.use(W),n=$.use(K)){this.mTemplateReference=t,this.mModuleValues=e,this.mProcedure=this.mModuleValues.createExpressionProcedure(n.value),this.mLastBoolean=!1}mLastBoolean;mModuleValues;mProcedure;mTemplateReference;onUpdate(){let t=this.mProcedure.execute();if(!!t!==this.mLastBoolean){this.mLastBoolean=!!t;let e=new ct;if(t){let n=new at;n.appendChild(...this.mTemplateReference.childList),e.addElement(n,new ut(this.mModuleValues.data))}return e}else return null}static{fr()}};function Ha(){function m(l,o){return function(a){e(o,"addInitializer"),n(a,"An initializer"),l.push(a)}}function t(l,o,u,a,r,b,v,T,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+o:o,static:b,private:v,metadata:T},d={v:!1};s.addInitializer=m(a,d);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[o]},h=function(x){this[o]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return l(w,s)}finally{d.v=!0}}function e(l,o){if(l.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(l,o){if(typeof l!="function")throw new TypeError(o+" must be a function")}function c(l,o){var u=typeof o;if(l===1){if(u!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(u!=="function"){var a;throw l===0?a="field":l===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function f(l,o,u,a,r,b,v,T,w){var p=u[0],s,d,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,S;if(typeof p=="function")h=t(p,a,s,T,r,b,v,w,i),h!==void 0&&(c(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,S=h.set||i.set,i={get:x,set:S}):i=h);else for(var _=p.length-1;_>=0;_--){var P=p[_];if(h=t(P,a,s,T,r,b,v,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,S=h.set||i.set,i={get:x,set:S}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(C,E){return E};else if(typeof d!="function"){var M=d;d=function(C,E){for(var R=E,L=0;L<M.length;L++)R=M[L].call(C,R);return R}}else{var j=d;d=function(C,E){return j.call(C,E)}}l.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(l.push(function(C,E){return i.get.call(C,E)}),l.push(function(C,E){return i.set.call(C,E)})):r===2?l.push(i):l.push(function(C,E){return i.call(C,E)}):Object.defineProperty(o,a,s))}function g(l,o,u){for(var a=[],r,b,v=new Map,T=new Map,w=0;w<o.length;w++){var p=o[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,S;if(h?(x=l,s=s-5,b=b||[],S=b):(x=l.prototype,r=r||[],S=r),s!==0&&!i){var _=h?T:v,P=_.get(d)||0;if(P===!0||P===3&&s!==4||P===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!P&&s>2?_.set(d,s):_.set(d,!0)}f(a,x,p,d,s,h,i,S,u)}}return y(a,r),y(a,b),a}function y(l,o){o&&l.push(function(u){for(var a=0;a<o.length;a++)o[a].call(u);return u})}function I(l,o,u){if(o.length>0){for(var a=[],r=l,b=l.name,v=o.length-1;v>=0;v--){var T={v:!1};try{var w=o[v](r,{kind:"class",name:b,addInitializer:m(a,T),metadata:u})}finally{T.v=!0}w!==void 0&&(c(10,w),r=w)}return[D(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function D(l,o){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,u,a,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),T=g(o,u,v);return a.length||D(o,v),{e:T,get c(){return I(o,a,v)}}}}function xr(m,t,e,n){return(xr=Ha())(m,t,e,n)}var Tr,br,Xa;Tr=Tt({access:q.Read,selector:/^\[[\w$]+\]$/});var wr=class{static{({c:[Xa,br]}=xr(this,[],[Tr]))}constructor(t=$.use(tt),e=$.use(W),n=$.use(lt)){this.mTarget=t,this.mProcedure=e.createExpressionProcedure(n.value),this.mTargetProperty=n.name.substring(1,n.name.length-1),this.mLastValue=Symbol("Uncomparable")}mLastValue;mProcedure;mTarget;mTargetProperty;onUpdate(){let t=this.mProcedure.execute();return t===this.mLastValue?!1:(this.mLastValue=t,Reflect.set(this.mTarget,this.mTargetProperty,t),!0)}static{br()}};function Ya(){function m(l,o){return function(a){e(o,"addInitializer"),n(a,"An initializer"),l.push(a)}}function t(l,o,u,a,r,b,v,T,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+o:o,static:b,private:v,metadata:T},d={v:!1};s.addInitializer=m(a,d);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[o]},h=function(x){this[o]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return l(w,s)}finally{d.v=!0}}function e(l,o){if(l.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(l,o){if(typeof l!="function")throw new TypeError(o+" must be a function")}function c(l,o){var u=typeof o;if(l===1){if(u!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(u!=="function"){var a;throw l===0?a="field":l===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function f(l,o,u,a,r,b,v,T,w){var p=u[0],s,d,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,S;if(typeof p=="function")h=t(p,a,s,T,r,b,v,w,i),h!==void 0&&(c(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,S=h.set||i.set,i={get:x,set:S}):i=h);else for(var _=p.length-1;_>=0;_--){var P=p[_];if(h=t(P,a,s,T,r,b,v,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,S=h.set||i.set,i={get:x,set:S}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(C,E){return E};else if(typeof d!="function"){var M=d;d=function(C,E){for(var R=E,L=0;L<M.length;L++)R=M[L].call(C,R);return R}}else{var j=d;d=function(C,E){return j.call(C,E)}}l.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(l.push(function(C,E){return i.get.call(C,E)}),l.push(function(C,E){return i.set.call(C,E)})):r===2?l.push(i):l.push(function(C,E){return i.call(C,E)}):Object.defineProperty(o,a,s))}function g(l,o,u){for(var a=[],r,b,v=new Map,T=new Map,w=0;w<o.length;w++){var p=o[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,S;if(h?(x=l,s=s-5,b=b||[],S=b):(x=l.prototype,r=r||[],S=r),s!==0&&!i){var _=h?T:v,P=_.get(d)||0;if(P===!0||P===3&&s!==4||P===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!P&&s>2?_.set(d,s):_.set(d,!0)}f(a,x,p,d,s,h,i,S,u)}}return y(a,r),y(a,b),a}function y(l,o){o&&l.push(function(u){for(var a=0;a<o.length;a++)o[a].call(u);return u})}function I(l,o,u){if(o.length>0){for(var a=[],r=l,b=l.name,v=o.length-1;v>=0;v--){var T={v:!1};try{var w=o[v](r,{kind:"class",name:b,addInitializer:m(a,T),metadata:u})}finally{T.v=!0}w!==void 0&&(c(10,w),r=w)}return[D(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function D(l,o){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,u,a,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),T=g(o,u,v);return a.length||D(o,v),{e:T,get c(){return I(o,a,v)}}}}function Ir(m,t,e,n){return(Ir=Ya())(m,t,e,n)}var Sr,Er,Wa;Sr=Tt({access:q.Write,selector:/^#[[\w$]+$/});var Cr=class{static{({c:[Wa,Er]}=Ir(this,[],[Sr]))}constructor(t=$.use(tt),e=$.use(lt),n=$.use(ft)){n.setTemporaryValue(e.name.substring(1),t)}static{Er()}};function Za(){function m(l,o){return function(a){e(o,"addInitializer"),n(a,"An initializer"),l.push(a)}}function t(l,o,u,a,r,b,v,T,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+o:o,static:b,private:v,metadata:T},d={v:!1};s.addInitializer=m(a,d);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[o]},h=function(x){this[o]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return l(w,s)}finally{d.v=!0}}function e(l,o){if(l.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(l,o){if(typeof l!="function")throw new TypeError(o+" must be a function")}function c(l,o){var u=typeof o;if(l===1){if(u!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(u!=="function"){var a;throw l===0?a="field":l===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function f(l,o,u,a,r,b,v,T,w){var p=u[0],s,d,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,S;if(typeof p=="function")h=t(p,a,s,T,r,b,v,w,i),h!==void 0&&(c(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,S=h.set||i.set,i={get:x,set:S}):i=h);else for(var _=p.length-1;_>=0;_--){var P=p[_];if(h=t(P,a,s,T,r,b,v,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,S=h.set||i.set,i={get:x,set:S}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(C,E){return E};else if(typeof d!="function"){var M=d;d=function(C,E){for(var R=E,L=0;L<M.length;L++)R=M[L].call(C,R);return R}}else{var j=d;d=function(C,E){return j.call(C,E)}}l.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(l.push(function(C,E){return i.get.call(C,E)}),l.push(function(C,E){return i.set.call(C,E)})):r===2?l.push(i):l.push(function(C,E){return i.call(C,E)}):Object.defineProperty(o,a,s))}function g(l,o,u){for(var a=[],r,b,v=new Map,T=new Map,w=0;w<o.length;w++){var p=o[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,S;if(h?(x=l,s=s-5,b=b||[],S=b):(x=l.prototype,r=r||[],S=r),s!==0&&!i){var _=h?T:v,P=_.get(d)||0;if(P===!0||P===3&&s!==4||P===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!P&&s>2?_.set(d,s):_.set(d,!0)}f(a,x,p,d,s,h,i,S,u)}}return y(a,r),y(a,b),a}function y(l,o){o&&l.push(function(u){for(var a=0;a<o.length;a++)o[a].call(u);return u})}function I(l,o,u){if(o.length>0){for(var a=[],r=l,b=l.name,v=o.length-1;v>=0;v--){var T={v:!1};try{var w=o[v](r,{kind:"class",name:b,addInitializer:m(a,T),metadata:u})}finally{T.v=!0}w!==void 0&&(c(10,w),r=w)}return[D(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function D(l,o){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,u,a,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),T=g(o,u,v);return a.length||D(o,v),{e:T,get c(){return I(o,a,v)}}}}function Pr(m,t,e,n){return(Pr=Za())(m,t,e,n)}var Nr,Dr,qa;Nr=Et({instructionType:"slot"});var _r=class{static{({c:[qa,Dr]}=Pr(this,[],[Nr]))}constructor(t=$.use(W),e=$.use(K)){this.mModuleValues=t,this.mSlotName=e.value,this.mIsSetup=!1}mIsSetup;mModuleValues;mSlotName;onUpdate(){if(this.mIsSetup)return null;this.mIsSetup=!0;let t=new xt("slot");this.mSlotName!==""&&t.setAttribute("name").addValue(this.mSlotName);let e=new at;e.appendChild(t);let n=new ct;return n.addElement(e,this.mModuleValues.data),n}static{Dr()}};function Ja(){function m(l,o){return function(a){e(o,"addInitializer"),n(a,"An initializer"),l.push(a)}}function t(l,o,u,a,r,b,v,T,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+o:o,static:b,private:v,metadata:T},d={v:!1};s.addInitializer=m(a,d);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[o]},h=function(x){this[o]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return l(w,s)}finally{d.v=!0}}function e(l,o){if(l.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(l,o){if(typeof l!="function")throw new TypeError(o+" must be a function")}function c(l,o){var u=typeof o;if(l===1){if(u!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(u!=="function"){var a;throw l===0?a="field":l===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function f(l,o,u,a,r,b,v,T,w){var p=u[0],s,d,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,S;if(typeof p=="function")h=t(p,a,s,T,r,b,v,w,i),h!==void 0&&(c(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,S=h.set||i.set,i={get:x,set:S}):i=h);else for(var _=p.length-1;_>=0;_--){var P=p[_];if(h=t(P,a,s,T,r,b,v,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,S=h.set||i.set,i={get:x,set:S}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(C,E){return E};else if(typeof d!="function"){var M=d;d=function(C,E){for(var R=E,L=0;L<M.length;L++)R=M[L].call(C,R);return R}}else{var j=d;d=function(C,E){return j.call(C,E)}}l.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(l.push(function(C,E){return i.get.call(C,E)}),l.push(function(C,E){return i.set.call(C,E)})):r===2?l.push(i):l.push(function(C,E){return i.call(C,E)}):Object.defineProperty(o,a,s))}function g(l,o,u){for(var a=[],r,b,v=new Map,T=new Map,w=0;w<o.length;w++){var p=o[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,S;if(h?(x=l,s=s-5,b=b||[],S=b):(x=l.prototype,r=r||[],S=r),s!==0&&!i){var _=h?T:v,P=_.get(d)||0;if(P===!0||P===3&&s!==4||P===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!P&&s>2?_.set(d,s):_.set(d,!0)}f(a,x,p,d,s,h,i,S,u)}}return y(a,r),y(a,b),a}function y(l,o){o&&l.push(function(u){for(var a=0;a<o.length;a++)o[a].call(u);return u})}function I(l,o,u){if(o.length>0){for(var a=[],r=l,b=l.name,v=o.length-1;v>=0;v--){var T={v:!1};try{var w=o[v](r,{kind:"class",name:b,addInitializer:m(a,T),metadata:u})}finally{T.v=!0}w!==void 0&&(c(10,w),r=w)}return[D(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function D(l,o){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,u,a,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),T=g(o,u,v);return a.length||D(o,v),{e:T,get c(){return I(o,a,v)}}}}function Lr(m,t,e,n){return(Lr=Ja())(m,t,e,n)}var Mr,Ar,Ka;Mr=Tt({access:q.ReadWrite,selector:/^\[\([[\w$]+\)\]$/});var Rr=class{static{({c:[Ka,Ar]}=Lr(this,[],[Mr]))}constructor(t=$.use(rt),e=$.use(tt),n=$.use(W),c=$.use(lt)){this.mTargetNode=e,this.mAttributeKey=c.name.substring(2,c.name.length-2),this.mReadProcedure=n.createExpressionProcedure(c.value),this.mWriteProcedure=n.createExpressionProcedure(`${c.value} = $DATA;`,["$DATA"]),this.mLastDataValue=Symbol("Uncomparable");let f=g=>{this.mLastDataValue!==g&&t.updater.updateAsync()};this.mTargetNode.addEventListener("input",g=>{f(Reflect.get(this.mTargetNode,this.mAttributeKey))}),this.mTargetNode.addEventListener("change",g=>{f(Reflect.get(this.mTargetNode,this.mAttributeKey))})}mAttributeKey;mLastDataValue;mReadProcedure;mTargetNode;mWriteProcedure;onUpdate(){let t=this.mReadProcedure.execute();if(t!==this.mLastDataValue)return Reflect.set(this.mTargetNode,this.mAttributeKey,t),this.mLastDataValue=t,!0;let e=Reflect.get(this.mTargetNode,this.mAttributeKey);return e!==t?(this.mWriteProcedure.setTemporaryValue("$DATA",e),this.mWriteProcedure.execute(),this.mLastDataValue=e,!0):!1}static{Ar()}};function Qa(){function m(l,o){return function(a){e(o,"addInitializer"),n(a,"An initializer"),l.push(a)}}function t(l,o,u,a,r,b,v,T,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+o:o,static:b,private:v,metadata:T},d={v:!1};s.addInitializer=m(a,d);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[o]},h=function(x){this[o]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return l(w,s)}finally{d.v=!0}}function e(l,o){if(l.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(l,o){if(typeof l!="function")throw new TypeError(o+" must be a function")}function c(l,o){var u=typeof o;if(l===1){if(u!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(u!=="function"){var a;throw l===0?a="field":l===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function f(l,o,u,a,r,b,v,T,w){var p=u[0],s,d,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,S;if(typeof p=="function")h=t(p,a,s,T,r,b,v,w,i),h!==void 0&&(c(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,S=h.set||i.set,i={get:x,set:S}):i=h);else for(var _=p.length-1;_>=0;_--){var P=p[_];if(h=t(P,a,s,T,r,b,v,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,S=h.set||i.set,i={get:x,set:S}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(C,E){return E};else if(typeof d!="function"){var M=d;d=function(C,E){for(var R=E,L=0;L<M.length;L++)R=M[L].call(C,R);return R}}else{var j=d;d=function(C,E){return j.call(C,E)}}l.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(l.push(function(C,E){return i.get.call(C,E)}),l.push(function(C,E){return i.set.call(C,E)})):r===2?l.push(i):l.push(function(C,E){return i.call(C,E)}):Object.defineProperty(o,a,s))}function g(l,o,u){for(var a=[],r,b,v=new Map,T=new Map,w=0;w<o.length;w++){var p=o[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,S;if(h?(x=l,s=s-5,b=b||[],S=b):(x=l.prototype,r=r||[],S=r),s!==0&&!i){var _=h?T:v,P=_.get(d)||0;if(P===!0||P===3&&s!==4||P===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!P&&s>2?_.set(d,s):_.set(d,!0)}f(a,x,p,d,s,h,i,S,u)}}return y(a,r),y(a,b),a}function y(l,o){o&&l.push(function(u){for(var a=0;a<o.length;a++)o[a].call(u);return u})}function I(l,o,u){if(o.length>0){for(var a=[],r=l,b=l.name,v=o.length-1;v>=0;v--){var T={v:!1};try{var w=o[v](r,{kind:"class",name:b,addInitializer:m(a,T),metadata:u})}finally{T.v=!0}w!==void 0&&(c(10,w),r=w)}return[D(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function D(l,o){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,u,a,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),T=g(o,u,v);return a.length||D(o,v),{e:T,get c(){return I(o,a,v)}}}}function Vr(m,t,e,n){return(Vr=Qa())(m,t,e,n)}var $r,Or,ka;$r=jt({access:q.Read,targetRestrictions:[mt]});var Fr=class{static{({c:[ka,Or]}=Vr(this,[],[$r]))}constructor(t=$.use(mt),e=$.use(tt)){let n=new Array,c=t.processorConstructor;do{let f=et.get(c).getMetadata(le.METADATA_USER_EVENT_LISTENER_PROPERIES);if(f)for(let g of f)n.push(g)}while(c=Object.getPrototypeOf(c));this.mEventListenerList=new Array,this.mTargetElement=e;for(let f of n){let[g,y]=f,I=Reflect.get(t.processor,g);I=I.bind(t.processor),this.mEventListenerList.push([y,I]),this.mTargetElement.addEventListener(y,I)}}mEventListenerList;mTargetElement;onDeconstruct(){for(let t of this.mEventListenerList){let[e,n]=t;this.mTargetElement.removeEventListener(e,n)}}static{Or()}};var Zt=class{mBody;mInputs;mOutputs;get body(){return this.mBody}get inputs(){return this.mInputs}get outputs(){return this.mOutputs}constructor(){this.mInputs=new Map,this.mOutputs=new Map,this.mBody=new Map}generateCode(){return""}buildContext(){let t={};for(let[n,c]of this.mInputs)c.nodeType==="flow"?t[n]={valueId:"",code:{inner:"",next:""}}:t[n]={valueId:c.valueId,code:{inner:"",next:""}};let e={};for(let[n,c]of this.mOutputs)if(c.nodeType==="flow"){let f=this.mBody.get(n);e[n]={valueId:"",code:{inner:f?.code??"",next:""}}}else e[n]={valueId:c.valueId,code:{inner:"",next:""}};return{inputs:t,outputs:e}}};var De=class extends Zt{mCodeGenerator;constructor(t){super(),this.mCodeGenerator=t}generateCode(){return this.mCodeGenerator(this.buildContext())}};var de=class{bodyCode;imports;inputs;name;outputs;constructor(){this.name="",this.bodyCode="",this.imports=new Array,this.inputs=new Array,this.outputs=new Array}};var _e=class{mProject;constructor(t){this.mProject=t}generate(t){let e=this.findUsedFunctions(t);return""}findUsedFunctions(t){let e=[...t.functions].find(y=>y.isSystem);if(!e)throw new A("No entry point function found for code generation.",this);let n=new Map;for(let y of t.functions)n.set(y.id,y);let c=new Set,f=new Array;f.push(e);let g=new Set;for(g.add(e);f.length>0;){let y=f.pop();c.add(y);for(let I of y.nodes)if(n.has(I.definitionId)){let D=n.get(I.definitionId);g.add(D),c.has(D)||f.push(D)}}return[...g].sort((y,I)=>y.isSystem===I.isSystem?0:y.isSystem?1:-1)}generateFunctionCode(t){let e=this.mProject.getFunction(t.definitionId),n=t.nodes,c=this.buildValueIdMap(n),f=this.generateGraphCode(n,c),g=this.buildCodeFunction(t,n,c,f),y=e?.codeGenerator.body;return y?y(g):f}generateFunctionCodeWithIntermediates(t,e){let n=this.mProject.getFunction(t.definitionId),c=t.nodes,f=this.buildValueIdMap(c),g=this.topologicalSort(c),y=[],I=new Map,D=this.collectFunctionInputs(t,c,f),l=this.collectFunctionOutputs(t,c,f);for(let r of g){let b=r.category;if(b===z.Input||b===z.Output||b===z.Reroute||b===z.Comment)continue;let v=this.buildCodeNode(r,f);if(this.attachFlowBodies(r,v,f),y.push(v.generateCode()),e.has(r)){let T=y.join(`
`),w=new de;w.name=t.label,w.bodyCode=T;for(let s of t.imports)w.imports.push(s);for(let s of D)w.inputs.push({...s});for(let s of l)w.outputs.push({...s});let p=n?.codeGenerator.body?n.codeGenerator.body(w):T;I.set(r,{intermediateCode:p,context:v.buildContext(),codeFunction:w})}}let o=y.join(`
`),u=this.buildCodeFunction(t,c,f,o);return{fullCode:n?.codeGenerator.body?n.codeGenerator.body(u):o,codeFunction:u,nodeIntermediates:I}}generateProjectCode(t){return[...t.values()].map(e=>this.generateFunctionCode(e)).join(`

`)}buildValueIdMap(t){let e=new Map,n=0;for(let c of t)for(let f of[...c.inputs.values(),...c.outputs.values()])e.set(f,`_v${n++}`);return e}buildCodeFunction(t,e,n,c){let f=new de;f.name=t.label,f.bodyCode=c;for(let g of t.imports)f.imports.push(g);for(let g of this.collectFunctionInputs(t,e,n))f.inputs.push(g);for(let g of this.collectFunctionOutputs(t,e,n))f.outputs.push(g);return f}collectFunctionInputs(t,e,n){return t.inputs.map(c=>({name:c.label,type:c.dataType,valueId:this.findInputNodeValueId(e,c.label,n)}))}collectFunctionOutputs(t,e,n){return t.outputs.map(c=>({name:c.label,type:c.dataType,valueId:this.findOutputNodeValueId(e,c.label,n)}))}generateGraphCode(t,e){let n=[];for(let c of this.topologicalSort(t)){let f=c.category;if(f===z.Input||f===z.Output||f===z.Reroute||f===z.Comment)continue;let g=this.buildCodeNode(c,e);this.attachFlowBodies(c,g,e),n.push(g.generateCode())}return n.join(`
`)}attachFlowBodies(t,e,n){for(let[c,f]of t.outputs){if(f.portType!=="flow")continue;let g=[...f.connectedPorts][0];e.body.set(c,{code:g?this.generateFlowBodyCode(g,n):""})}}generateFlowBodyCode(t,e){let n=t.node;if(!this.mProject.nodeDefinitions.find(f=>f.id===n.definitionId)&&n.category!=="function")return"";let c=this.buildCodeNode(n,e);return this.attachFlowBodies(n,c,e),c.generateCode()}buildCodeNode(t,e){let c=this.mProject.nodeDefinitions.find(g=>g.id===t.definitionId)?.codeGenerator??(()=>""),f=this.createNodeForCategory(t.category,c);for(let[g,y]of t.inputs)if(y.portType==="value"){let I=[...y.connectedPorts][0],D=I?this.resolveRerouteChain(I,e):e.get(y)??g;f.inputs.set(g,{name:g,type:y.dataType,valueId:D,nodeType:"value"})}else f.inputs.set(g,{name:g,type:"",valueId:"",nodeType:"flow"});for(let[g,y]of t.outputs)y.portType==="value"?f.outputs.set(g,{name:g,type:y.dataType,valueId:e.get(y)??g,nodeType:"value"}):f.outputs.set(g,{name:g,type:"",valueId:"",nodeType:"flow"});return f}createNodeForCategory(t,e){switch(t){case z.Comment:case z.Input:case z.Output:case z.Reroute:return new Zt;default:return new De(e)}}topologicalSort(t){let e=new Set,n=[],c=new Map;for(let g of t)c.set(g,new Set);for(let g of t)for(let y of g.inputs.values())if(y.portType==="value")for(let I of y.connectedPorts)c.get(g)?.add(I.node);let f=g=>{if(!e.has(g)){e.add(g);for(let y of c.get(g)??[])f(y);n.push(g)}};for(let g of t)f(g);return n}findInputNodeValueId(t,e,n){for(let c of t)if(c.category===z.Input&&c.definitionId===e){for(let f of c.outputs.values())if(f.portType==="value")return n.get(f)??e}return e}findOutputNodeValueId(t,e,n){for(let c of t)if(c.category===z.Output&&c.definitionId===e){for(let f of c.inputs.values())if(f.portType==="value"){let g=[...f.connectedPorts][0];return g?this.resolveRerouteChain(g,n):n.get(f)??e}}return e}resolveRerouteChain(t,e){if(t.node.category===z.Reroute){for(let n of t.node.inputs.values())if(n.portType==="value"){let c=[...n.connectedPorts][0];return c?this.resolveRerouteChain(c,e):e.get(n)??""}}return e.get(t)??""}};var me=class m{static new(t,e){return new m(e)}mId;mLabel;mPreviewGenerator;mStatics;mNodesProvider;mCodeGenerator;get id(){return this.mId}get label(){return this.mLabel}get codeGenerator(){return this.mCodeGenerator}get preview(){return this.mPreviewGenerator}get statics(){return this.mStatics}constructor(t){this.mId=t.id,this.mLabel=t.label,this.mNodesProvider=t.nodes,this.mPreviewGenerator=t.generator.preview??null,this.mStatics=t.statics,this.mCodeGenerator=t.generator.code}getNodeDefinitions(t){if(!this.mNodesProvider.dynamic)return new Array;let e=new Array;return this.mNodesProvider.dynamic(n=>{e.push(n)},t),e}getPrefilledNodes(t){if(this.mNodesProvider.prefilled){let e=new Array;return this.mNodesProvider.prefilled(n=>{e.push(n)},t),e}return new Array}},zt={none:0,imports:1,inputs:2,outputs:4};var pe=class{mProject;constructor(t){this.mProject=t}deserialize(t){let e=new Gt(this.mProject);for(let n of t.functions)e.addFunction(this.deserializeFunction(n,e));return e}deserializeFunction(t,e){let n=new yt(this.mProject,e,{definitionId:t.definitionId,id:t.id,label:t.label,isSystem:t.isSystem});for(let f of t.imports)n.addImport(f);for(let f of t.inputs)n.addInput({label:f.label,dataType:f.dataType});for(let f of t.outputs)n.addOutput({label:f.label,dataType:f.dataType});let c=new Map;for(let f of t.nodes){let g=this.deserializeNode(f,n,e);c.set(f.id,g)}for(let f of t.connections){let g=c.get(f.sourceNodeId),y=c.get(f.targetNodeId);if(!g||!y)continue;let I=g.outputs.get(f.sourcePortId),D=y.inputs.get(f.targetPortId);!I||!D||I.connect(D)}return n}deserializeNode(t,e,n){let c=this.mProject.nodeDefinitions.find(g=>g.id===t.definitionId)??n.nodeDefinitions.find(g=>g.id===t.definitionId),f;if(c)f=e.newNode(c,{...t.transformation},t.isSystem);else{let g=t.ports.filter(I=>I.direction==="input").map(I=>({dataType:I.dataType,definitionId:I.definitionId,label:I.label,portType:I.portType})),y=t.ports.filter(I=>I.direction==="output").map(I=>({dataType:I.dataType,definitionId:I.definitionId,label:I.label,portType:I.portType}));f=new It(this.mProject,n,e,{category:t.category,definitionId:t.definitionId,ports:{input:g,output:y},isSystem:t.isSystem,label:t.label,transformation:{...t.transformation}}),e.addNode(f)}f.label=t.label;for(let g of t.ports)if(g.portType==="value"&&g.directValue.length>0){let y=f.inputs.get(g.definitionId);y&&y.setDirectValue(g.directValue)}return f}};var fe=class{constructor(){}serialize(t){return{functions:[...t.functions].map(e=>this.serializeFunction(e))}}serializeFunction(t){let e=new Map;t.nodes.forEach((y,I)=>{e.set(y,`n${I}`)});let n=[...t.nodes].map(y=>this.serializeNode(y,e.get(y))),c=[];for(let y of t.nodes){let I=e.get(y);for(let D of y.outputs.values())for(let l of D.connectedPorts){let o=e.get(l.node);c.push({sourceNodeId:I,sourcePortId:D.definitionId,targetNodeId:o,targetPortId:l.definitionId})}}let f=t.inputs.map(y=>({label:y.label,dataType:y.dataType})),g=t.outputs.map(y=>({label:y.label,dataType:y.dataType}));return{id:t.id,label:t.label,isSystem:t.isSystem,definitionId:t.definitionId,inputs:f,outputs:g,imports:[...t.imports],nodes:n,connections:c}}serializeNode(t,e){let n=[...t.inputs.values(),...t.outputs.values()].map(c=>({definitionId:c.definitionId,label:c.label,direction:c.direction,portType:c.portType,dataType:c.portType==="value"?c.dataType:null,directValue:[...c.directValue]}));return{id:e,definitionId:t.definitionId,category:t.category,label:t.label,isSystem:t.isSystem,transformation:{...t.transformation},ports:n}}};var Pe=class{mMaxSize;mCurrentIndex;mSnapshots;get canRedo(){return this.mCurrentIndex<this.mSnapshots.length-1}get canUndo(){return this.mCurrentIndex>0}constructor(t=100){this.mSnapshots=new Array,this.mCurrentIndex=-1,this.mMaxSize=t}push(t){this.mSnapshots.splice(this.mCurrentIndex+1),this.mSnapshots.push(t),this.mCurrentIndex=this.mSnapshots.length-1,this.mSnapshots.length>this.mMaxSize&&(this.mSnapshots.shift(),this.mCurrentIndex=this.mSnapshots.length-1)}undo(){return this.canUndo?(this.mCurrentIndex--,this.mSnapshots[this.mCurrentIndex]):null}redo(){return this.canRedo?(this.mCurrentIndex++,this.mSnapshots[this.mCurrentIndex]):null}clear(){this.mSnapshots.length=0,this.mCurrentIndex=-1}};var jr=`:host {\r
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
`;var zr=`<div class="editor-layout">
    <div #panelLeft class="panel-left">
        <potatno-panel-left
            [activeFunction]="this.activeFunction"
            [functions]="this.functionList"
            [activeFunctionId]="this.activeFunctionId"
            [userFunctionDefinitions]="this.userFunctionDefinitions"
            [nodeLibraryRefreshVersion]="this.nodeLibraryRefreshVersion"
            (function-select)="this.onFunctionSelect($event)"
            (function-add)="this.onFunctionAdd($event)"
            (function-delete)="this.onFunctionDelete($event)">
        </potatno-panel-left>
    </div>
    <div #resizeLeft class="resize-handle-left"
        (pointerdown)="this.onResizeLeftStart($event)">
    </div>
    <div class="center-area">
        <potatno-node-graph
            [activeFunction]="this.activeFunction"
            [refreshVersion]="this.graphRefreshVersion"
            [previewResult]="this.graphPreviewResult"
            [previewUpdateVersion]="this.previewUpdateVersion"
            [errorNodes]="this.graphErrorNodes"
            [errorPorts]="this.graphErrorPorts"
            (graph-change)="this.onGraphChange($event)"
            (open-function)="this.onGraphOpenFunction($event)"
            (undo-request)="this.onGraphUndoRequest($event)"
            (redo-request)="this.onGraphRedoRequest($event)">
        </potatno-node-graph>
        $if(this.hasPreview) {
            <div class="preview-wrapper">
                <potatno-preview #previewEl [errors]="this.editorErrors" [previewContent]="this.entryPreviewElement"></potatno-preview>
            </div>
        }
    </div>
    <div #resizeRight class="resize-handle-right"
        (pointerdown)="this.onResizeRightStart($event)">
    </div>
    <div #panelRight class="panel-right">
        <potatno-panel-properties
            [functionName]="this.activeFunctionName"
            [functionInputs]="this.activeFunctionInputs"
            [functionOutputs]="this.activeFunctionOutputs"
            [functionImports]="this.activeFunctionImports"
            [isSystem]="this.activeFunctionIsSystem"
            [editableByUser]="this.activeFunctionEditableByUser"
            [availableImports]="this.availableImportsList"
            [availableTypes]="this.availableTypes"
            (properties-change)="this.onPropertiesChange($event)">
        </potatno-panel-properties>
    </div>
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
`;function nl(){function m(l,o){return function(a){e(o,"addInitializer"),n(a,"An initializer"),l.push(a)}}function t(l,o,u,a,r,b,v,T,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+o:o,static:b,private:v,metadata:T},d={v:!1};s.addInitializer=m(a,d);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[o]},h=function(x){this[o]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return l(w,s)}finally{d.v=!0}}function e(l,o){if(l.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(l,o){if(typeof l!="function")throw new TypeError(o+" must be a function")}function c(l,o){var u=typeof o;if(l===1){if(u!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(u!=="function"){var a;throw l===0?a="field":l===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function f(l,o,u,a,r,b,v,T,w){var p=u[0],s,d,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,S;if(typeof p=="function")h=t(p,a,s,T,r,b,v,w,i),h!==void 0&&(c(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,S=h.set||i.set,i={get:x,set:S}):i=h);else for(var _=p.length-1;_>=0;_--){var P=p[_];if(h=t(P,a,s,T,r,b,v,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,S=h.set||i.set,i={get:x,set:S}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(C,E){return E};else if(typeof d!="function"){var M=d;d=function(C,E){for(var R=E,L=0;L<M.length;L++)R=M[L].call(C,R);return R}}else{var j=d;d=function(C,E){return j.call(C,E)}}l.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(l.push(function(C,E){return i.get.call(C,E)}),l.push(function(C,E){return i.set.call(C,E)})):r===2?l.push(i):l.push(function(C,E){return i.call(C,E)}):Object.defineProperty(o,a,s))}function g(l,o,u){for(var a=[],r,b,v=new Map,T=new Map,w=0;w<o.length;w++){var p=o[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,S;if(h?(x=l,s=s-5,b=b||[],S=b):(x=l.prototype,r=r||[],S=r),s!==0&&!i){var _=h?T:v,P=_.get(d)||0;if(P===!0||P===3&&s!==4||P===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!P&&s>2?_.set(d,s):_.set(d,!0)}f(a,x,p,d,s,h,i,S,u)}}return y(a,r),y(a,b),a}function y(l,o){o&&l.push(function(u){for(var a=0;a<o.length;a++)o[a].call(u);return u})}function I(l,o,u){if(o.length>0){for(var a=[],r=l,b=l.name,v=o.length-1;v>=0;v--){var T={v:!1};try{var w=o[v](r,{kind:"class",name:b,addInitializer:m(a,T),metadata:u})}finally{T.v=!0}w!==void 0&&(c(10,w),r=w)}return[D(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function D(l,o){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,u,a,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),T=g(o,u,v);return a.length||D(o,v),{e:T,get c(){return I(o,a,v)}}}}function kr(m,t,e,n){return(kr=nl())(m,t,e,n)}var to,Ur,eo,ro,oo,no,io,so,ao,Hr,Xr,Yr,Wr,Zr,qr,Jr,Kr,il;to=X({selector:"potatno-function-list",template:Br,style:Gr}),eo=O.state(),ro=O.state(),oo=O.state(),no=O.state(),io=G("function-select"),so=G("function-add"),ao=G("function-delete");var Qr=class{static{({e:[Hr,Xr,Yr,Wr,Zr,qr,Jr,Kr],c:[il,Ur]}=kr(this,[[[F,eo],1,"functions"],[[F,ro],1,"activeFunctionId"],[[F,oo],1,"userFunctionDefinitions"],[no,1,"mShowPopup"],[io,1,"mFunctionSelect"],[so,1,"mFunctionAdd"],[ao,1,"mFunctionDelete"]],[to]))}#t=(Kr(this),Hr(this,[]));get functions(){return this.#t}set functions(t){this.#t=t}#e=Xr(this,"");get activeFunctionId(){return this.#e}set activeFunctionId(t){this.#e=t}#r=Yr(this,[]);get userFunctionDefinitions(){return this.#r}set userFunctionDefinitions(t){this.#r=t}#o=Wr(this,!1);get mShowPopup(){return this.#o}set mShowPopup(t){this.#o=t}#n=Zr(this);get mFunctionSelect(){return this.#n}set mFunctionSelect(t){this.#n=t}#i=qr(this);get mFunctionAdd(){return this.#i}set mFunctionAdd(t){this.#i=t}#s=Jr(this);get mFunctionDelete(){return this.#s}set mFunctionDelete(t){this.#s=t}get hasUserFunctionDefinitions(){return this.userFunctionDefinitions.length>0}get showPopup(){return this.mShowPopup}getEntryClass(t){return t===this.activeFunctionId?"function-entry active":"function-entry"}onFunctionSelect(t){this.mFunctionSelect.dispatchEvent(t)}onAddButtonClick(){this.userFunctionDefinitions.length===1?this.mFunctionAdd.dispatchEvent(this.userFunctionDefinitions[0].id):this.mShowPopup=!this.mShowPopup}onDefinitionSelect(t){this.mShowPopup=!1,this.mFunctionAdd.dispatchEvent(t)}closePopup(){this.mShowPopup=!1}onFunctionDelete(t,e){t.stopPropagation(),this.mFunctionDelete.dispatchEvent(e)}static{Ur()}};var Ne=class m{static MAX_ZOOM=2;static MIN_ZOOM=.25;mGridSize;mPanX;mPanY;mSelectionEnd;mSelectionStart;mZoom;get gridSize(){return this.mGridSize}get panX(){return this.mPanX}get panY(){return this.mPanY}get selectionEnd(){return this.mSelectionEnd}get selectionStart(){return this.mSelectionStart}get zoom(){return this.mZoom}constructor(t=20){this.mGridSize=t,this.mPanX=0,this.mPanY=0,this.mZoom=1,this.mSelectionStart=null,this.mSelectionEnd=null}clearSelection(){this.mSelectionStart=null,this.mSelectionEnd=null}getGridBackgroundCss(){let t=this.mGridSize*this.mZoom,e=this.mPanX%t,n=this.mPanY%t,c=t*5,f=this.mPanX%c,g=this.mPanY%c;return[`background-size: ${t}px ${t}px, ${c}px ${c}px`,`background-position: ${e}px ${n}px, ${f}px ${g}px`,"background-image: radial-gradient(circle, var(--pn-grid-color) 1px, transparent 1px), radial-gradient(circle, var(--pn-grid-color) 1.5px, transparent 1.5px)"].join("; ")}getTransformCss(){return`translate(${this.mPanX}px, ${this.mPanY}px) scale(${this.mZoom})`}pan(t,e){this.mPanX+=t,this.mPanY+=e}screenToWorld(t,e){return{x:(t-this.mPanX)/this.mZoom,y:(e-this.mPanY)/this.mZoom}}setSelectionEnd(t,e){this.mSelectionEnd={x:t,y:e}}setSelectionStart(t,e){this.mSelectionStart={x:t,y:e}}snapToGrid(t,e){return{x:Math.round(t/this.mGridSize)*this.mGridSize,y:Math.round(e/this.mGridSize)*this.mGridSize}}worldToScreen(t,e){return{x:t*this.mZoom+this.mPanX,y:e*this.mZoom+this.mPanY}}zoomAt(t,e,n){let c=this.mZoom,f=1+n,g=this.mZoom*f;g=Math.max(m.MIN_ZOOM,Math.min(m.MAX_ZOOM,g));let y=(t-this.mPanX)/c,I=(e-this.mPanY)/c;this.mZoom=g,this.mPanX=t-y*this.mZoom,this.mPanY=e-I*this.mZoom}};var Ge="http://www.w3.org/2000/svg",Be="data-temp-connection";var Ae=class{clearAll(t){let e=t.querySelectorAll("path");for(let n of e)n.remove()}clearTempConnection(t){let e=t.querySelector(`[${Be}]`);e&&e.remove()}generateBezierPath(t,e,n,c){let f=Math.abs(n-t),g=Math.max(f*.4,50),y=t+g,I=e,D=n-g;return`M ${t} ${e} C ${y} ${I}, ${D} ${c}, ${n} ${c}`}renderConnections(t,e){let n=t.querySelectorAll(`path:not([${Be}])`);for(let c of n)c.remove();for(let c of e){let f=this.generateBezierPath(c.sourceX,c.sourceY,c.targetX,c.targetY),g=document.createElementNS(Ge,"path");g.setAttribute("d",f),g.setAttribute("fill","none"),g.setAttribute("data-connection-id",c.id),g.setAttribute("data-hit-area","true"),g.style.stroke="transparent",g.style.strokeWidth="12",g.style.pointerEvents="stroke",g.style.cursor="pointer",t.appendChild(g);let y=document.createElementNS(Ge,"path");y.setAttribute("d",f),y.setAttribute("fill","none"),y.setAttribute("data-connection-id",c.id),y.style.stroke=c.valid?"#a6adc8":"#f38ba8",y.style.strokeWidth="2",y.style.pointerEvents="none",c.valid||y.setAttribute("stroke-dasharray","6 3"),t.appendChild(y)}}renderTempConnection(t,e,n,c){this.clearTempConnection(t);let f=document.createElementNS(Ge,"path");f.setAttribute("d",this.generateBezierPath(e.x,e.y,n.x,n.y)),f.setAttribute("fill","none"),f.setAttribute(Be,"true"),f.style.stroke=c,f.style.strokeWidth="2",f.style.opacity="0.6",f.style.strokeDasharray="8 4",f.style.pointerEvents="none",t.appendChild(f)}};var Re=class{mData;get hasData(){return this.mData!==null}constructor(){this.mData=null}copy(t){let e=[],n=new Map;for(let g of t)g.isSystem||(n.set(g,e.length),e.push(g));if(e.length===0)return;let c=e.map(g=>{let y={};for(let[I,D]of g.inputs)D.portType==="value"&&D.directValue.length>0&&(y[I]=[...D.directValue]);return{definitionId:g.definitionId,transformation:{...g.transformation},label:g.label,inputDirectValues:y}}),f=[];for(let g of e){let y=n.get(g);for(let[I,D]of g.outputs)for(let l of D.connectedPorts){let o=n.get(l.node);o!==void 0&&f.push({sourceNodeIndex:y,sourcePortName:I,targetNodeIndex:o,targetPortName:l.label})}}this.mData={nodes:c,internalConnections:f}}paste(t,e,n,c){if(!this.mData)return[];let f=[];for(let g of this.mData.nodes){let y=t.project.nodeDefinitions.find(l=>l.id===g.definitionId)??e.nodeDefinitions.find(l=>l.id===g.definitionId);if(!y)continue;let I={x:g.transformation.x+n,y:g.transformation.y+c,width:g.transformation.width,height:g.transformation.height},D=t.newNode(y,I,!1);D.label=g.label;for(let[l,o]of Object.entries(g.inputDirectValues)){let u=D.inputs.get(l);u&&u.setDirectValue(o)}f.push(D)}for(let g of this.mData.internalConnections){let y=f[g.sourceNodeIndex],I=f[g.targetNodeIndex];if(!y||!I)continue;let D=y.outputs.get(g.sourcePortName),l=I.inputs.get(g.targetPortName);D&&l&&D.connect(l)}return f}};var Lt=class m{static mListeners=new Set;static mInsertListeners=new Set;static requestInsert(t){for(let e of m.mInsertListeners)e(t)}static startDrag(t){for(let e of m.mListeners)e(t)}static subscribe(t){return m.mListeners.add(t),()=>{m.mListeners.delete(t)}}static subscribeInsert(t){return m.mInsertListeners.add(t),()=>{m.mInsertListeners.delete(t)}}};function qt(m){let t=[],e=new Set;if(!m)return t;let n=f=>{e.has(f.id)||(e.add(f.id),t.push({category:f.category,definition:f,id:f.id,name:f.label}))};for(let f of m.project.nodeDefinitions)n(f);for(let f of m.nodeDefinitions)n(f);let c=new Set(m.imports);for(let f of m.project.imports)if(c.has(f.label))for(let g of f.nodes)n(g);return t}var lo=`:host {
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
                        [hasError]="this.nodeState.hasError"
                        [errorPorts]="this.nodeState.errorPorts"
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
.node.has-error,\r
.node.has-error.selected {\r
    border-color: var(--pn-accent-danger, #f38ba8);\r
    box-shadow: 0 0 0 1px var(--pn-accent-danger, #f38ba8), 0 2px 8px var(--pn-node-shadow);\r
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
        <div class="node-reroute {{this.selectedClass}} {{this.hasErrorClass}}"
             (pointerdown)="this.onNodePointerDown($event)">
            <div class="reroute-inputs">
                $for(inPort of this.inputPorts) {
                    <potatno-port
                        [port]="this.inPort"
                        [ownerNode]="this.nodeData"
                        [portVersion]="this.connectionVersion"
                        [hasError]="this.isPortError(this.inPort)"
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
                        [hasError]="this.isPortError(this.outPort)"
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
        <div class="node-comment {{this.selectedClass}} {{this.hasErrorClass}}"
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
        <div class="node {{this.selectedClass}} {{this.hasErrorClass}}"
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
                            [hasError]="this.isPortError(this.inPort)"
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
                            [hasError]="this.isPortError(this.outPort)"
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
/* Has-error: red glow (validation error from graph) */\r
.port-circle.has-error::before { background: var(--pn-accent-danger, #f38ba8); }\r
.port-circle.has-error.direction-output::after { border-left-color: var(--pn-accent-danger, #f38ba8); }\r
.port-circle.has-error.direction-input::after { border-right-color: var(--pn-accent-danger, #f38ba8); }\r
.port-circle.has-error { filter: drop-shadow(0 0 4px var(--pn-accent-danger, #f38ba8)); }\r
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
`;function dl(){function m(l,o){return function(a){e(o,"addInitializer"),n(a,"An initializer"),l.push(a)}}function t(l,o,u,a,r,b,v,T,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+o:o,static:b,private:v,metadata:T},d={v:!1};s.addInitializer=m(a,d);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[o]},h=function(x){this[o]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return l(w,s)}finally{d.v=!0}}function e(l,o){if(l.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(l,o){if(typeof l!="function")throw new TypeError(o+" must be a function")}function c(l,o){var u=typeof o;if(l===1){if(u!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(u!=="function"){var a;throw l===0?a="field":l===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function f(l,o,u,a,r,b,v,T,w){var p=u[0],s,d,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,S;if(typeof p=="function")h=t(p,a,s,T,r,b,v,w,i),h!==void 0&&(c(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,S=h.set||i.set,i={get:x,set:S}):i=h);else for(var _=p.length-1;_>=0;_--){var P=p[_];if(h=t(P,a,s,T,r,b,v,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,S=h.set||i.set,i={get:x,set:S}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(C,E){return E};else if(typeof d!="function"){var M=d;d=function(C,E){for(var R=E,L=0;L<M.length;L++)R=M[L].call(C,R);return R}}else{var j=d;d=function(C,E){return j.call(C,E)}}l.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(l.push(function(C,E){return i.get.call(C,E)}),l.push(function(C,E){return i.set.call(C,E)})):r===2?l.push(i):l.push(function(C,E){return i.call(C,E)}):Object.defineProperty(o,a,s))}function g(l,o,u){for(var a=[],r,b,v=new Map,T=new Map,w=0;w<o.length;w++){var p=o[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,S;if(h?(x=l,s=s-5,b=b||[],S=b):(x=l.prototype,r=r||[],S=r),s!==0&&!i){var _=h?T:v,P=_.get(d)||0;if(P===!0||P===3&&s!==4||P===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!P&&s>2?_.set(d,s):_.set(d,!0)}f(a,x,p,d,s,h,i,S,u)}}return y(a,r),y(a,b),a}function y(l,o){o&&l.push(function(u){for(var a=0;a<o.length;a++)o[a].call(u);return u})}function I(l,o,u){if(o.length>0){for(var a=[],r=l,b=l.name,v=o.length-1;v>=0;v--){var T={v:!1};try{var w=o[v](r,{kind:"class",name:b,addInitializer:m(a,T),metadata:u})}finally{T.v=!0}w!==void 0&&(c(10,w),r=w)}return[D(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function D(l,o){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,u,a,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),T=g(o,u,v);return a.length||D(o,v),{e:T,get c(){return I(o,a,v)}}}}function _o(m,t,e,n){return(_o=dl())(m,t,e,n)}var Po,fo,No,Ao,Ro,Lo,Mo,Oo,Fo,Vo,$o,jo,go,vo,yo,bo,wo,xo,To,Eo,Co,Io,So,ml;Po=X({selector:"potatno-port",template:po,style:mo}),No=O.state(),Ao=O.state(),Ro=O.state(),Lo=O.state(),Mo=G("port-drag-start"),Oo=G("port-hover"),Fo=G("port-leave"),Vo=G("direct-value-change"),$o=G("port-element-ready"),jo=nt("portCircle");var Do=class{static{({e:[go,vo,yo,bo,wo,xo,To,Eo,Co,Io,So],c:[ml,fo]}=_o(this,[[[F,No],1,"port"],[[F,Ao],1,"portVersion"],[[F,Ro],1,"ownerNode"],[[F,Lo],1,"hasError"],[Mo,1,"mPortDragStart"],[Oo,1,"mPortHover"],[Fo,1,"mPortLeave"],[Vo,1,"mDirectValueChange"],[$o,1,"mPortElementReady"],[jo,1,"portCircleElement"]],[Po]))}#t=(So(this),go(this,null));get port(){return this.#t}set port(t){this.#t=t}#e=vo(this,0);get portVersion(){return this.#e}set portVersion(t){this.#e=t}#r=yo(this,null);get ownerNode(){return this.#r}set ownerNode(t){this.#r=t}#o=bo(this,!1);get hasError(){return this.#o}set hasError(t){this.#o=t}#n=wo(this);get mPortDragStart(){return this.#n}set mPortDragStart(t){this.#n=t}#i=xo(this);get mPortHover(){return this.#i}set mPortHover(t){this.#i=t}#s=To(this);get mPortLeave(){return this.#s}set mPortLeave(t){this.#s=t}#a=Eo(this);get mDirectValueChange(){return this.#a}set mDirectValueChange(t){this.#a=t}#l=Co(this);get mPortElementReady(){return this.#l}set mPortElementReady(t){this.#l=t}#c=Io(this);get portCircleElement(){return this.#c}set portCircleElement(t){this.#c=t}mLastRegisteredPort=null;get portName(){return this.port?.label??""}get portTypeLabel(){return this.port?.dataType??""}get portWrapperClasses(){return`port-wrapper ${this.port?.direction==="output"?"direction-output":"direction-input"}`}get portCircleClasses(){if(!this.port)return"port-circle disconnected direction-input";let t=["port-circle"];return t.push(this.port.connectedPorts.size>0?"connected":"disconnected"),t.push(this.port.direction==="output"?"direction-output":"direction-input"),this.hasError&&t.push("has-error"),t.join(" ")}get portColor(){if(!this.port||this.port.portType==="flow")return"var(--pn-text-primary)";if(this.port.node.project.types.isGenericType(this.port.dataType)){if(this.port.connectedPorts.size>0){let t=[...this.port.connectedPorts][0];return this.getTypeColor(t.dataType)}return"var(--pn-text-muted)"}return this.getTypeColor(this.port.dataType)}get showDirectValueInput(){return this.portVersion,this.port?this.port.portType==="value"&&this.port.direction==="input"&&this.port.connectedPorts.size===0&&!this.port.node.project.types.isGenericType(this.port.dataType):!1}get directValueInputDefs(){return!this.port||this.port.portType!=="value"?[]:this.port.node.project.types.isGenericType(this.port.dataType)?[]:this.port.project.types.getType(this.port.dataType).inputs.map((e,n)=>({htmlType:e.type==="number"?"number":e.type==="boolean"?"checkbox":"text",index:n,name:e.name,value:this.port.directValue[n]??""}))}onUpdate(){if(!this.port||!this.ownerNode||this.port===this.mLastRegisteredPort)return;let t;try{t=this.portCircleElement}catch{return}this.mLastRegisteredPort=this.port,this.mPortElementReady.dispatchEvent({node:this.ownerNode,port:this.port,element:t})}onPointerDown(t){t.stopPropagation(),t.preventDefault(),!(!this.port||!this.ownerNode)&&this.mPortDragStart.dispatchEvent({node:this.ownerNode,port:this.port,element:this.portCircleElement})}onPointerEnter(t){!this.port||!this.ownerNode||this.mPortHover.dispatchEvent({node:this.ownerNode,port:this.port,element:this.portCircleElement})}onPointerLeave(t){this.mPortLeave.dispatchEvent(void 0)}onDirectValueInput(t,e){if(!this.port)return;let n=t.target,c=[...this.port.directValue];c[e]=n.type==="checkbox"?n.checked?"true":"false":n.value,this.port.setDirectValue(c),this.mDirectValueChange.dispatchEvent({port:this.port,values:c})}getTypeColor(t){let e=0;for(let c=0;c<t.length;c++)e=t.charCodeAt(c)+((e<<5)-e);return`hsl(${Math.abs(e)*137.508%360}, 70%, 60%)`}static{fo()}};function pl(){function m(l,o){return function(a){e(o,"addInitializer"),n(a,"An initializer"),l.push(a)}}function t(l,o,u,a,r,b,v,T,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+o:o,static:b,private:v,metadata:T},d={v:!1};s.addInitializer=m(a,d);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[o]},h=function(x){this[o]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return l(w,s)}finally{d.v=!0}}function e(l,o){if(l.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(l,o){if(typeof l!="function")throw new TypeError(o+" must be a function")}function c(l,o){var u=typeof o;if(l===1){if(u!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(u!=="function"){var a;throw l===0?a="field":l===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function f(l,o,u,a,r,b,v,T,w){var p=u[0],s,d,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,S;if(typeof p=="function")h=t(p,a,s,T,r,b,v,w,i),h!==void 0&&(c(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,S=h.set||i.set,i={get:x,set:S}):i=h);else for(var _=p.length-1;_>=0;_--){var P=p[_];if(h=t(P,a,s,T,r,b,v,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,S=h.set||i.set,i={get:x,set:S}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(C,E){return E};else if(typeof d!="function"){var M=d;d=function(C,E){for(var R=E,L=0;L<M.length;L++)R=M[L].call(C,R);return R}}else{var j=d;d=function(C,E){return j.call(C,E)}}l.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(l.push(function(C,E){return i.get.call(C,E)}),l.push(function(C,E){return i.set.call(C,E)})):r===2?l.push(i):l.push(function(C,E){return i.call(C,E)}):Object.defineProperty(o,a,s))}function g(l,o,u){for(var a=[],r,b,v=new Map,T=new Map,w=0;w<o.length;w++){var p=o[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,S;if(h?(x=l,s=s-5,b=b||[],S=b):(x=l.prototype,r=r||[],S=r),s!==0&&!i){var _=h?T:v,P=_.get(d)||0;if(P===!0||P===3&&s!==4||P===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!P&&s>2?_.set(d,s):_.set(d,!0)}f(a,x,p,d,s,h,i,S,u)}}return y(a,r),y(a,b),a}function y(l,o){o&&l.push(function(u){for(var a=0;a<o.length;a++)o[a].call(u);return u})}function I(l,o,u){if(o.length>0){for(var a=[],r=l,b=l.name,v=o.length-1;v>=0;v--){var T={v:!1};try{var w=o[v](r,{kind:"class",name:b,addInitializer:m(a,T),metadata:u})}finally{T.v=!0}w!==void 0&&(c(10,w),r=w)}return[D(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function D(l,o){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,u,a,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),T=g(o,u,v);return a.length||D(o,v),{e:T,get c(){return I(o,a,v)}}}}function ln(m,t,e,n){return(ln=pl())(m,t,e,n)}var cn,zo,un,hn,dn,mn,pn,fn,gn,vn,yn,bn,wn,xn,Tn,En,Cn,In,Sn,Go,Bo,Uo,Ho,Xo,Yo,Wo,Zo,qo,Jo,Ko,Qo,ko,tn,en,rn,on,nn,sn,fl;cn=X({selector:"potatno-node",template:ho,style:uo}),un=O.state(),hn=O.state(),dn=O.state(),mn=O.state(),pn=O.state({complexValue:!0}),fn=O.state(),gn=nt("NodePreview"),vn=G("node-select"),yn=G("node-drag-start"),bn=G("port-drag-start"),wn=G("port-hover"),xn=G("port-leave"),Tn=G("open-function"),En=G("comment-change"),Cn=G("resize-start"),In=G("direct-value-change"),Sn=G("port-element-ready");var an=class{static{({e:[Go,Bo,Uo,Ho,Xo,Yo,Wo,Zo,qo,Jo,Ko,Qo,ko,tn,en,rn,on,nn,sn],c:[fl,zo]}=ln(this,[[[F,un],1,"nodeData"],[[F,hn],1,"connectionVersion"],[[F,dn],1,"selected"],[[F,mn],1,"hasError"],[[F,pn],1,"errorPorts"],[[F,fn],1,"gridSize"],[gn,1,"mPreviewContainer"],[vn,1,"mNodeSelect"],[yn,1,"mNodeDragStart"],[bn,1,"mPortDragStart"],[wn,1,"mPortHover"],[xn,1,"mPortLeave"],[Tn,1,"mOpenFunction"],[En,1,"mCommentChange"],[Cn,1,"mResizeStart"],[In,1,"mDirectValueChange"],[Sn,1,"mPortElementReady"],[F,0,"previewElement"]],[cn]))}#t=(sn(this),Go(this,null));get nodeData(){return this.#t}set nodeData(t){this.#t=t}#e=Bo(this,0);get connectionVersion(){return this.#e}set connectionVersion(t){this.#e=t}#r=Uo(this,!1);get selected(){return this.#r}set selected(t){this.#r=t}#o=Ho(this,!1);get hasError(){return this.#o}set hasError(t){this.#o=t}#n=Xo(this,new Set);get errorPorts(){return this.#n}set errorPorts(t){this.#n=t}#i=Yo(this,20);get gridSize(){return this.#i}set gridSize(t){this.#i=t}previewElement=nn(this,null);#s=Wo(this);get mPreviewContainer(){return this.#s}set mPreviewContainer(t){this.#s=t}#a=Zo(this);get mNodeSelect(){return this.#a}set mNodeSelect(t){this.#a=t}#l=qo(this);get mNodeDragStart(){return this.#l}set mNodeDragStart(t){this.#l=t}#c=Jo(this);get mPortDragStart(){return this.#c}set mPortDragStart(t){this.#c=t}#u=Ko(this);get mPortHover(){return this.#u}set mPortHover(t){this.#u=t}#h=Qo(this);get mPortLeave(){return this.#h}set mPortLeave(t){this.#h=t}#d=ko(this);get mOpenFunction(){return this.#d}set mOpenFunction(t){this.#d=t}#m=tn(this);get mCommentChange(){return this.#m}set mCommentChange(t){this.#m=t}#p=en(this);get mResizeStart(){return this.#p}set mResizeStart(t){this.#p=t}#f=rn(this);get mDirectValueChange(){return this.#f}set mDirectValueChange(t){this.#f=t}#g=on(this);get mPortElementReady(){return this.#g}set mPortElementReady(t){this.#g=t}get selectedClass(){return this.selected?"selected":""}get hasErrorClass(){return this.hasError?"has-error":""}isPortError(t){return this.errorPorts.has(t)}get isComment(){return this.nodeData?.category===z.Comment}get isReroute(){return this.nodeData?.category===z.Reroute}get isFunction(){return this.nodeData?.category===z.Function}get showOpenButton(){return this.nodeData?this.isFunction&&!this.nodeData.isSystem:!1}get categoryColor(){return this.nodeData?Ot.get(this.nodeData.category).cssColor:""}get categoryIcon(){return this.nodeData?Ot.get(this.nodeData.category).icon:""}get nodeLabel(){return this.nodeData?.label??""}get nodeName(){if(!this.nodeData)return"";let t=this.nodeData;return t.project.nodeDefinitions.find(n=>n.id===t.definitionId)?.label??t.label}get commentSizeStyle(){return this.nodeData?`height: ${this.nodeData.transformation.height*this.gridSize}px;`:""}get inputPorts(){return this.nodeData?[...this.nodeData.inputs.values()]:[]}get outputPorts(){return this.nodeData?[...this.nodeData.outputs.values()]:[]}onUpdate(){let t=this.previewElement;if(!t)return;let e;try{e=this.mPreviewContainer}catch{return}t.parentElement!==e&&(e.innerHTML="",e.appendChild(t))}onNodePointerDown(t){t.target.tagName?.toLowerCase()!=="potatno-port"&&this.nodeData&&(this.mNodeSelect.dispatchEvent({node:this.nodeData,shiftKey:t.shiftKey}),this.mNodeDragStart.dispatchEvent({node:this.nodeData,startX:t.clientX,startY:t.clientY}))}onPortDragStart(t){this.mPortDragStart.dispatchEvent(t.value)}onPortHover(t){this.mPortHover.dispatchEvent(t.value)}onPortLeave(t){this.mPortLeave.dispatchEvent(void 0)}onDirectValueChange(t){this.mDirectValueChange.dispatchEvent(t.value)}onPortElementReady(t){this.mPortElementReady.dispatchEvent(t.value)}onOpenFunction(t){t.stopPropagation(),this.nodeData&&this.mOpenFunction.dispatchEvent({node:this.nodeData})}onCommentInput(t){let e=t.target;this.nodeData&&(this.nodeData.label=e.value,this.mCommentChange.dispatchEvent({node:this.nodeData,text:e.value}))}onResizeStart(t){t.stopPropagation(),t.preventDefault(),this.nodeData&&this.mResizeStart.dispatchEvent({node:this.nodeData,startX:t.clientX,startY:t.clientY})}static{zo()}};function gl(){function m(l,o){return function(a){e(o,"addInitializer"),n(a,"An initializer"),l.push(a)}}function t(l,o,u,a,r,b,v,T,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+o:o,static:b,private:v,metadata:T},d={v:!1};s.addInitializer=m(a,d);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[o]},h=function(x){this[o]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return l(w,s)}finally{d.v=!0}}function e(l,o){if(l.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(l,o){if(typeof l!="function")throw new TypeError(o+" must be a function")}function c(l,o){var u=typeof o;if(l===1){if(u!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(u!=="function"){var a;throw l===0?a="field":l===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function f(l,o,u,a,r,b,v,T,w){var p=u[0],s,d,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,S;if(typeof p=="function")h=t(p,a,s,T,r,b,v,w,i),h!==void 0&&(c(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,S=h.set||i.set,i={get:x,set:S}):i=h);else for(var _=p.length-1;_>=0;_--){var P=p[_];if(h=t(P,a,s,T,r,b,v,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,S=h.set||i.set,i={get:x,set:S}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(C,E){return E};else if(typeof d!="function"){var M=d;d=function(C,E){for(var R=E,L=0;L<M.length;L++)R=M[L].call(C,R);return R}}else{var j=d;d=function(C,E){return j.call(C,E)}}l.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(l.push(function(C,E){return i.get.call(C,E)}),l.push(function(C,E){return i.set.call(C,E)})):r===2?l.push(i):l.push(function(C,E){return i.call(C,E)}):Object.defineProperty(o,a,s))}function g(l,o,u){for(var a=[],r,b,v=new Map,T=new Map,w=0;w<o.length;w++){var p=o[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,S;if(h?(x=l,s=s-5,b=b||[],S=b):(x=l.prototype,r=r||[],S=r),s!==0&&!i){var _=h?T:v,P=_.get(d)||0;if(P===!0||P===3&&s!==4||P===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!P&&s>2?_.set(d,s):_.set(d,!0)}f(a,x,p,d,s,h,i,S,u)}}return y(a,r),y(a,b),a}function y(l,o){o&&l.push(function(u){for(var a=0;a<o.length;a++)o[a].call(u);return u})}function I(l,o,u){if(o.length>0){for(var a=[],r=l,b=l.name,v=o.length-1;v>=0;v--){var T={v:!1};try{var w=o[v](r,{kind:"class",name:b,addInitializer:m(a,T),metadata:u})}finally{T.v=!0}w!==void 0&&(c(10,w),r=w)}return[D(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function D(l,o){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,u,a,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),T=g(o,u,v);return a.length||D(o,v),{e:T,get c(){return I(o,a,v)}}}}function Bn(m,t,e,n){return(Bn=gl())(m,t,e,n)}var Un,Dn,Hn,Xn,Yn,Wn,Zn,qn,Jn,Kn,Qn,kn,ti,ei,_n,Pn,Nn,An,Rn,Ln,Mn,On,Fn,Vn,$n,jn,zn,vl;Un=X({selector:"potatno-node-graph",template:co,style:lo}),Hn=O.state({complexValue:!0}),Xn=O.state(),Yn=O.state(),Wn=O.state({complexValue:!0}),Zn=O.state({complexValue:!0}),qn=O.state({complexValue:!0}),Jn=nt("svgLayer"),Kn=nt("canvasWrapper"),Qn=G("graph-change"),kn=G("open-function"),ti=G("undo-request"),ei=G("redo-request");var Gn=class{static{({e:[_n,Pn,Nn,An,Rn,Ln,Mn,On,Fn,Vn,$n,jn,zn],c:[vl,Dn]}=Bn(this,[[Hn,1,"mCachedGraphData"],[Xn,1,"mTransformVersion"],[Yn,1,"mShowSelectionBox"],[Wn,1,"mAddNodePopup"],[Zn,1,"mFilteredAddNodeEntries"],[qn,1,"mLibraryDragIndicator"],[Jn,1,"svgLayer"],[Kn,1,"canvasWrapper"],[Qn,1,"mGraphChange"],[kn,1,"mOpenFunction"],[ti,1,"mUndoRequest"],[ei,1,"mRedoRequest"],[F,4,"activeFunction"],[F,4,"refreshVersion"],[F,4,"previewResult"],[F,4,"previewUpdateVersion"],[F,4,"errorNodes"],[F,4,"errorPorts"]],[Un]))}constructor(){this.mActiveFunction=null,this.mAddNodeSearchQuery="",this.mAddNodeSelectedDefinitionId=null,this.mCachedGraphData={visibleNodes:[]},this.mClipboard=new Re,this.mConnectionRegistry=new Map,this.mConnectionVersion=0,this.mDocumentPointerMoveHandler=null,this.mDocumentPointerUpHandler=null,this.mErrorNodes=new Set,this.mErrorPorts=new Set,this.mHoveredPort=null,this.mInteraction=new Ne(20),this.mInteractionState={mode:"idle"},this.mKeyboardHandler=null,this.mLibraryDragUnsubscribe=null,this.mLibraryInsertUnsubscribe=null,this.mPendingConnectionRenderFrame=0,this.mPortElementRegistry=new Map,this.mPreviewElements=new Map,this.mPreviewResult=null,this.mPreviewUpdateVersion=0,this.mRefreshVersion=0,this.mRenderer=new Ae,this.mSelectedNodes=new Set,this.mSelectionBoxScreen={x1:0,x2:0,y1:0,y2:0}}mClipboard;mConnectionRegistry;mInteraction;mPortElementRegistry;mPreviewElements;mRenderer;mSelectedNodes;mActiveFunction;mErrorNodes;mErrorPorts;mAddNodeSearchQuery;mAddNodeSelectedDefinitionId;mConnectionVersion;mDocumentPointerMoveHandler;mDocumentPointerUpHandler;mHoveredPort;mInteractionState;mKeyboardHandler;mLibraryDragUnsubscribe;mLibraryInsertUnsubscribe;mPendingConnectionRenderFrame;mPreviewResult;mPreviewUpdateVersion;mRefreshVersion;mSelectionBoxScreen;#t=(zn(this),_n(this));get mCachedGraphData(){return this.#t}set mCachedGraphData(t){this.#t=t}#e=Pn(this,0);get mTransformVersion(){return this.#e}set mTransformVersion(t){this.#e=t}#r=Nn(this,!1);get mShowSelectionBox(){return this.#r}set mShowSelectionBox(t){this.#r=t}#o=An(this,null);get mAddNodePopup(){return this.#o}set mAddNodePopup(t){this.#o=t}#n=Rn(this,[]);get mFilteredAddNodeEntries(){return this.#n}set mFilteredAddNodeEntries(t){this.#n=t}#i=Ln(this,null);get mLibraryDragIndicator(){return this.#i}set mLibraryDragIndicator(t){this.#i=t}#s=Mn(this);get svgLayer(){return this.#s}set svgLayer(t){this.#s=t}#a=On(this);get canvasWrapper(){return this.#a}set canvasWrapper(t){this.#a=t}#l=Fn(this);get mGraphChange(){return this.#l}set mGraphChange(t){this.#l=t}#c=Vn(this);get mOpenFunction(){return this.#c}set mOpenFunction(t){this.#c=t}#u=$n(this);get mUndoRequest(){return this.#u}set mUndoRequest(t){this.#u=t}#h=jn(this);get mRedoRequest(){return this.#h}set mRedoRequest(t){this.#h=t}set activeFunction(t){if(this.mActiveFunction===t)return;this.mActiveFunction=t,this.mErrorNodes=new Set,this.mErrorPorts=new Set,this.mHoveredPort=null,this.mInteractionState={mode:"idle"},this.mLibraryDragIndicator=null,this.mPortElementRegistry.clear(),this.mPreviewElements.clear(),this.mSelectedNodes.clear(),this.stopDocumentPointerTracking(),this.closeAddNodePopup();let e=this.getSvgLayerOrNull();e&&this.mRenderer.clearAll(e),this.invalidateGraphContent(),this.updatePreviewElementsFromResult()}get activeFunction(){return this.mActiveFunction}set refreshVersion(t){this.mRefreshVersion!==t&&(this.mRefreshVersion=t,this.invalidateGraphContent(),this.updatePreviewElementsFromResult())}get refreshVersion(){return this.mRefreshVersion}set previewResult(t){this.mPreviewResult!==t&&(this.mPreviewResult=t,this.updatePreviewElementsFromResult())}get previewResult(){return this.mPreviewResult}set previewUpdateVersion(t){this.mPreviewUpdateVersion!==t&&(this.mPreviewUpdateVersion=t,this.updatePreviewElementsFromResult())}get previewUpdateVersion(){return this.mPreviewUpdateVersion}set errorNodes(t){this.mErrorNodes=t??new Set,this.invalidateGraphContent()}set errorPorts(t){this.mErrorPorts=t??new Set,this.invalidateGraphContent()}get gridBackgroundStyle(){return this.mTransformVersion,this.mInteraction.getGridBackgroundCss()}get gridTransformStyle(){return this.mTransformVersion,"transform: "+this.mInteraction.getTransformCss()}get gridSize(){return this.mInteraction.gridSize}get showSelectionBox(){return this.mShowSelectionBox}get selectionBoxStyle(){let t=Math.min(this.mSelectionBoxScreen.x1,this.mSelectionBoxScreen.x2),e=Math.min(this.mSelectionBoxScreen.y1,this.mSelectionBoxScreen.y2),n=Math.abs(this.mSelectionBoxScreen.x2-this.mSelectionBoxScreen.x1),c=Math.abs(this.mSelectionBoxScreen.y2-this.mSelectionBoxScreen.y1);return`left: ${t}px; top: ${e}px; width: ${n}px; height: ${c}px`}get visibleNodes(){return this.mCachedGraphData.visibleNodes}get showAddNodePopup(){return this.mAddNodePopup!==null}get addNodePopupStyle(){let t=this.mAddNodePopup;return t?`left: ${t.screenX}px; top: ${t.screenY}px`:""}get addNodeSearchValue(){return this.mAddNodeSearchQuery}get addNodeResults(){return this.mFilteredAddNodeEntries}get hasLibraryDragIndicator(){return this.mLibraryDragIndicator!==null}get libraryDragIndicatorStyle(){let t=this.mLibraryDragIndicator;return t?`left: ${t.clientX}px; top: ${t.clientY}px`:""}get libraryDragLabel(){return this.mLibraryDragIndicator?.label??""}getPreviewElementForNode(t){return this.mPreviewElements.get(t)??null}getAddNodeEntryClass(t){return t.id===this.mAddNodeSelectedDefinitionId?"add-node-result selected":"add-node-result"}onConnect(){this.mLibraryDragUnsubscribe=Lt.subscribe(t=>this.startLibraryDrag(t)),this.mLibraryInsertUnsubscribe=Lt.subscribeInsert(t=>this.insertLibraryNodeAtViewportCenter(t)),this.mKeyboardHandler=t=>this.onKeyDown(t),document.addEventListener("keydown",this.mKeyboardHandler),this.invalidateGraphContent()}onDeconstruct(){this.stopDocumentPointerTracking(),this.mKeyboardHandler&&(document.removeEventListener("keydown",this.mKeyboardHandler),this.mKeyboardHandler=null),this.mLibraryDragUnsubscribe&&(this.mLibraryDragUnsubscribe(),this.mLibraryDragUnsubscribe=null),this.mLibraryInsertUnsubscribe&&(this.mLibraryInsertUnsubscribe(),this.mLibraryInsertUnsubscribe=null),this.mPendingConnectionRenderFrame!==0&&(cancelAnimationFrame(this.mPendingConnectionRenderFrame),this.mPendingConnectionRenderFrame=0)}onCanvasPointerDown(t){if(this.closeAddNodePopup(),t.button===1){t.preventDefault(),this.mInteractionState={mode:"panning",startX:t.clientX,startY:t.clientY},this.startDocumentPointerTracking();return}if(t.button!==0)return;t.ctrlKey||(this.mSelectedNodes.clear(),this.invalidateNodeVisuals());let e=this.getLocalPointerPosition(t.clientX,t.clientY);this.mInteractionState={mode:"selecting"},this.mSelectionBoxScreen={x1:e.x,x2:e.x,y1:e.y,y2:e.y},this.mShowSelectionBox=!1,this.startDocumentPointerTracking()}onCanvasWheel(t){t.preventDefault();let e=this.getLocalPointerPosition(t.clientX,t.clientY);this.mInteraction.zoomAt(e.x,e.y,t.deltaY>0?-.1:.1),this.mTransformVersion++,this.scheduleConnectionRender()}onContextMenu(t){if(t.preventDefault(),t.target instanceof Element&&t.target.hasAttribute("data-hit-area")){let e=t.target.getAttribute("data-connection-id");e&&this.deleteConnectionById(e);return}this.eventPathContainsGraphNode(t)||this.eventPathContainsAddNodePopup(t)||this.openAddNodePopupAtPointer(t.clientX,t.clientY)}onNodePointerDown(t,e){for(let f of t.composedPath())if(f instanceof HTMLElement&&f.tagName.toLowerCase()==="potatno-port")return;if(t.stopPropagation(),this.closeAddNodePopup(),t.button!==0)return;t.ctrlKey?this.mSelectedNodes.has(e)?this.mSelectedNodes.delete(e):this.mSelectedNodes.add(e):this.mSelectedNodes.has(e)||(this.mSelectedNodes.clear(),this.mSelectedNodes.add(e)),this.invalidateNodeVisuals();let n=this.mInteraction.gridSize,c=new Map;for(let f of this.mSelectedNodes)c.set(f,{originX:f.transformation.x*n,originY:f.transformation.y*n});e.category===z.Comment&&this.addCommentContainedNodeOrigins(e,c),this.mInteractionState={mode:"dragging-node",origins:c,startX:t.clientX,startY:t.clientY},this.startDocumentPointerTracking()}onPortDragStart(t){let e=this.canvasWrapper.getBoundingClientRect(),n=t.value.element.getBoundingClientRect(),c=(n.left+n.width/2-e.left-this.mInteraction.panX)/this.mInteraction.zoom,f=(n.top+n.height/2-e.top-this.mInteraction.panY)/this.mInteraction.zoom;this.closeAddNodePopup(),this.mInteractionState={mode:"dragging-wire",sourcePort:t.value.port,startX:c,startY:f},this.startDocumentPointerTracking()}onPortHover(t){this.mHoveredPort={node:t.value.node,port:t.value.port}}onPortLeave(){this.mHoveredPort=null}onPortElementReady(t){this.mPortElementRegistry.set(t.value.port,t.value.element)}onNodeResizeStart(t){this.closeAddNodePopup(),this.mInteractionState={mode:"resizing-comment",node:t.value.node,originalH:t.value.node.transformation.height,originalW:t.value.node.transformation.width,startX:t.value.startX,startY:t.value.startY},this.startDocumentPointerTracking()}onCommentChange(t){this.emitGraphChange(!1,!1)}onDirectValueChange(t){this.emitGraphChange(!0,!1)}onOpenFunction(t){let e=t.value.node.definitionId;this.mOpenFunction.dispatchEvent({functionId:e.startsWith("USERFUNCTION_")?e.slice(13):e})}onAddNodePopupPointerDown(t){t.stopPropagation()}onAddNodeSearchInput(t){t.target instanceof HTMLInputElement&&(this.mAddNodeSearchQuery=t.target.value,this.rebuildAddNodeResults())}onAddNodeSearchKeyDown(t){if(t.key==="Escape"){t.preventDefault(),this.closeAddNodePopup();return}if(t.key==="Enter"){t.preventDefault(),this.insertSelectedAddNode();return}(t.key==="ArrowDown"||t.key==="ArrowUp")&&(t.preventDefault(),this.moveAddNodeSelection(t.key==="ArrowDown"?1:-1))}onAddNodeEntryPointerDown(t,e){t.preventDefault(),t.stopPropagation(),this.insertNodeFromAddPopup(e.definition)}onDocumentPointerMove(t){let e=this.mInteractionState;if(e.mode==="panning"){this.mInteraction.pan(t.clientX-e.startX,t.clientY-e.startY),e.startX=t.clientX,e.startY=t.clientY,this.mTransformVersion++,this.scheduleConnectionRender();return}if(e.mode==="dragging-node"){this.dragSelectedNodes(t,e);return}if(e.mode==="dragging-wire"){this.renderDraggedWire(t,e);return}if(e.mode==="selecting"){let n=this.getLocalPointerPosition(t.clientX,t.clientY);this.mSelectionBoxScreen.x2=n.x,this.mSelectionBoxScreen.y2=n.y,this.mShowSelectionBox=Math.abs(this.mSelectionBoxScreen.x2-this.mSelectionBoxScreen.x1)>5||Math.abs(this.mSelectionBoxScreen.y2-this.mSelectionBoxScreen.y1)>5;return}if(e.mode==="resizing-comment"){let n=this.mInteraction.gridSize,c=(t.clientX-e.startX)/this.mInteraction.zoom,f=(t.clientY-e.startY)/this.mInteraction.zoom;e.node.resizeTo(e.originalW+Math.round(c/n),e.originalH+Math.round(f/n)),this.rebuildVisibleNodePositions();return}e.mode==="library-drag"&&(this.mLibraryDragIndicator={clientX:t.clientX,clientY:t.clientY,label:e.label})}onDocumentPointerUp(t){let e=this.mInteractionState;e.mode==="dragging-node"?this.emitGraphChange(!0,!1):e.mode==="dragging-wire"?this.completeWireDrag():e.mode==="selecting"?(this.mShowSelectionBox=!1,this.selectNodesInBox()):e.mode==="resizing-comment"?this.emitGraphChange(!1,!1):e.mode==="library-drag"&&this.finishLibraryDrag(t,e),this.mInteractionState={mode:"idle"},this.stopDocumentPointerTracking()}onKeyDown(t){if(!this.isTextEditingActive()){if(t.key==="Delete"){this.deleteSelectedNodes();return}if(t.ctrlKey&&t.key==="z"){t.preventDefault(),t.shiftKey?this.mRedoRequest.dispatchEvent(void 0):this.mUndoRequest.dispatchEvent(void 0);return}if(t.ctrlKey&&t.key==="y"){t.preventDefault(),this.mRedoRequest.dispatchEvent(void 0);return}if(t.ctrlKey&&t.key==="c"){this.mClipboard.copy(this.mSelectedNodes);return}t.ctrlKey&&t.key==="v"&&(t.preventDefault(),this.pasteFromClipboard())}}addCommentContainedNodeOrigins(t,e){let n=this.mActiveFunction;if(!n)return;let c=this.mInteraction.gridSize,f=t.transformation.x*c,g=t.transformation.y*c,y=f+t.transformation.width*c,I=g+t.transformation.height*c;for(let D of n.nodes){if(D===t||this.mSelectedNodes.has(D)||D.category===z.Comment)continue;let l=D.transformation.x*c,o=D.transformation.y*c;l>=f&&l<=y&&o>=g&&o<=I&&e.set(D,{originX:l,originY:o})}}closeAddNodePopup(){this.mAddNodePopup=null,this.mAddNodeSearchQuery="",this.mAddNodeSelectedDefinitionId=null,this.mFilteredAddNodeEntries=[]}completeWireDrag(){let t=this.getSvgLayerOrNull();if(t&&this.mRenderer.clearTempConnection(t),this.mInteractionState.mode!=="dragging-wire")return;let e=this.mInteractionState.sourcePort,n=this.mHoveredPort?.port??null;if(!(!n||e===n)&&!(e.direction===n.direction||e.portType!==n.portType))try{e.connect(n),this.mConnectionVersion++,this.invalidateGraphContent(),this.emitGraphChange(!0,!1)}catch(c){console.error("[NodeGraph] Connection failed:",c)}}deleteConnectionById(t){let e=this.mConnectionRegistry.get(t);e&&(e.sourcePort.disconnect(e.targetPort),this.mConnectionVersion++,this.invalidateGraphContent(),this.emitGraphChange(!0,!1))}deleteSelectedNodes(){let t=this.mActiveFunction;if(!t)return;let e=!1;for(let n of[...this.mSelectedNodes])n.isSystem||(t.removeNode(n),this.mSelectedNodes.delete(n),e=!0);e&&(this.mConnectionVersion++,this.invalidateGraphContent(),this.emitGraphChange(!0,!1))}dragSelectedNodes(t,e){let n=this.mInteraction.zoom,c=this.mInteraction.gridSize,f=(t.clientX-e.startX)/n,g=(t.clientY-e.startY)/n;for(let[y,I]of e.origins){let D=this.mInteraction.snapToGrid(I.originX+f,I.originY+g);y.moveTo(Math.round(D.x/c),Math.round(D.y/c))}this.rebuildVisibleNodePositions(),this.scheduleConnectionRender()}emitGraphChange(t,e){this.mGraphChange.dispatchEvent({affectsLibrary:e,affectsPreview:t})}eventPathContainsAddNodePopup(t){for(let e of t.composedPath())if(e instanceof HTMLElement&&e.classList.contains("add-node-popup"))return!0;return!1}eventPathContainsGraphNode(t){for(let e of t.composedPath())if(e instanceof HTMLElement&&e.tagName.toLowerCase()==="potatno-node")return!0;return!1}focusAddNodeSearchInput(){requestAnimationFrame(()=>{let e=this.getCanvasWrapperOrNull()?.querySelector(".add-node-search")??null;e?.focus(),e?.select()})}finishLibraryDrag(t,e){if(this.mLibraryDragIndicator=null,!this.isPointerInsideCanvas(t.clientX,t.clientY))return;let n=this.getNodeDefinitionEntryById(e.definitionId);if(!n)return;let c=this.getWorldPointerPosition(t.clientX,t.clientY);this.insertNodeAt(n.definition,c)}getCanvasWrapperOrNull(){try{return this.canvasWrapper}catch{return null}}getNodeDefinitionEntryById(t){return qt(this.mActiveFunction).find(e=>e.id===t)??null}getLocalPointerPosition(t,e){let n=this.getCanvasWrapperOrNull();if(!n)return{x:0,y:0};let c=n.getBoundingClientRect();return{x:t-c.left,y:e-c.top}}getPortPosition(t){let e=this.mPortElementRegistry.get(t),n=this.getCanvasWrapperOrNull();if(e&&n){let b=n.getBoundingClientRect(),v=e.getBoundingClientRect();return{x:(v.left+v.width/2-b.left-this.mInteraction.panX)/this.mInteraction.zoom,y:(v.top+v.height/2-b.top-this.mInteraction.panY)/this.mInteraction.zoom}}let c=t.node,f=this.mInteraction.gridSize,g=c.transformation.x*f,y=c.transformation.y*f,I=c.transformation.width*f,D=28,l=24,o=4,u=t.direction==="output"?c.outputs:c.inputs,a=0,r=0;for(let b of u.values()){if(b===t){a=r;break}r++}return{x:t.direction==="output"?g+I:g,y:y+D+o+(a+.5)*l}}getSvgLayerOrNull(){try{return this.svgLayer}catch{return null}}getWorldPointerPosition(t,e){let n=this.getLocalPointerPosition(t,e);return this.mInteraction.screenToWorld(n.x,n.y)}invalidateGraphContent(){this.rebuildGraphData(),this.scheduleConnectionRender()}invalidateNodeVisuals(){this.rebuildGraphData()}insertNodeAt(t,e){let n=this.mActiveFunction;if(!n)return;let c=this.mInteraction.gridSize,f=this.mInteraction.snapToGrid(e.x,e.y),g=n.newNode(t,{height:4,width:10,x:Math.round(f.x/c),y:Math.round(f.y/c)});this.mSelectedNodes.clear(),this.mSelectedNodes.add(g),this.closeAddNodePopup(),this.invalidateGraphContent(),this.emitGraphChange(!0,!1)}insertLibraryNodeAtViewportCenter(t){let e=this.getNodeDefinitionEntryById(t.definitionId),n=this.getCanvasWrapperOrNull();!e||!n||(this.mInteractionState={mode:"idle"},this.mLibraryDragIndicator=null,this.stopDocumentPointerTracking(),this.insertNodeAt(e.definition,this.mInteraction.screenToWorld(n.clientWidth/2,n.clientHeight/2)))}insertSelectedAddNode(){let t=this.mFilteredAddNodeEntries.find(e=>e.id===this.mAddNodeSelectedDefinitionId)??this.mFilteredAddNodeEntries[0];t&&this.insertNodeFromAddPopup(t.definition)}insertNodeFromAddPopup(t){let e=this.mAddNodePopup;e&&this.insertNodeAt(t,{x:e.worldX,y:e.worldY})}isTextEditingActive(){let t=document.activeElement;return t instanceof HTMLInputElement||t instanceof HTMLTextAreaElement||t instanceof HTMLSelectElement}isPointerInsideCanvas(t,e){let n=this.getCanvasWrapperOrNull();if(!n)return!1;let c=n.getBoundingClientRect();return t>=c.left&&t<=c.right&&e>=c.top&&e<=c.bottom}moveAddNodeSelection(t){if(this.mFilteredAddNodeEntries.length===0){this.mAddNodeSelectedDefinitionId=null;return}let n=(Math.max(0,this.mFilteredAddNodeEntries.findIndex(c=>c.id===this.mAddNodeSelectedDefinitionId))+t+this.mFilteredAddNodeEntries.length)%this.mFilteredAddNodeEntries.length;this.mAddNodeSelectedDefinitionId=this.mFilteredAddNodeEntries[n].id,this.mFilteredAddNodeEntries=[...this.mFilteredAddNodeEntries]}openAddNodePopupAtPointer(t,e){let n=this.getCanvasWrapperOrNull(),c=this.getLocalPointerPosition(t,e),f=this.mInteraction.screenToWorld(c.x,c.y),g=280,y=320,I=Math.max(0,(n?.clientWidth??g)-g-8),D=Math.max(0,(n?.clientHeight??y)-y-8);this.mAddNodePopup={screenX:Math.max(8,Math.min(c.x,I)),screenY:Math.max(8,Math.min(c.y,D)),worldX:f.x,worldY:f.y},this.mAddNodeSearchQuery="",this.rebuildAddNodeResults(),this.focusAddNodeSearchInput()}pasteFromClipboard(){let t=this.mActiveFunction;if(!t)return;let e=this.mClipboard.paste(t,t.document,2,2);if(e.length!==0){this.mSelectedNodes.clear();for(let n of e)this.mSelectedNodes.add(n);this.mConnectionVersion++,this.invalidateGraphContent(),this.emitGraphChange(!0,!1)}}rebuildAddNodeResults(){let t=this.mAddNodeSearchQuery.trim().toLowerCase();this.mFilteredAddNodeEntries=qt(this.mActiveFunction).filter(e=>!t||e.name.toLowerCase().includes(t)),this.mFilteredAddNodeEntries.some(e=>e.id===this.mAddNodeSelectedDefinitionId)||(this.mAddNodeSelectedDefinitionId=this.mFilteredAddNodeEntries[0]?.id??null)}rebuildGraphData(){let t=[],e=this.mActiveFunction;if(e){let n=this.mInteraction.gridSize;for(let c of e.nodes)this.ensurePreviewElementForNode(c),t.push({connectionVersion:this.mConnectionVersion,errorPorts:this.mErrorPorts,hasError:this.mErrorNodes.has(c),node:c,pixelW:c.transformation.width*n,pixelX:c.transformation.x*n,pixelY:c.transformation.y*n,selected:this.mSelectedNodes.has(c)})}this.mCachedGraphData={visibleNodes:t}}rebuildVisibleNodePositions(){let t=this.mInteraction.gridSize;this.mCachedGraphData={visibleNodes:this.mCachedGraphData.visibleNodes.map(e=>({connectionVersion:e.connectionVersion,errorPorts:e.errorPorts,hasError:e.hasError,node:e.node,pixelW:e.node.transformation.width*t,pixelX:e.node.transformation.x*t,pixelY:e.node.transformation.y*t,selected:e.selected}))}}renderConnections(){let t=this.getSvgLayerOrNull();if(!t)return;let e=this.mActiveFunction;if(!e){this.mRenderer.clearAll(t),this.mConnectionRegistry.clear();return}let n=[];this.mConnectionRegistry.clear();let c=0;for(let f of e.nodes)for(let g of f.outputs.values())for(let y of g.connectedPorts){let I=`c${c++}`,D=this.getPortPosition(g),l=this.getPortPosition(y),o=this.mErrorPorts.has(g)||this.mErrorPorts.has(y);this.mConnectionRegistry.set(I,{sourcePort:g,targetPort:y}),n.push({color:"var(--pn-text-secondary)",id:I,sourceX:D.x,sourceY:D.y,targetX:l.x,targetY:l.y,valid:!o})}this.mRenderer.renderConnections(t,n)}renderDraggedWire(t,e){let n=this.getSvgLayerOrNull();if(!n)return;let c=this.getWorldPointerPosition(t.clientX,t.clientY);this.mRenderer.renderTempConnection(n,{x:e.startX,y:e.startY},c,"#bac2de")}scheduleConnectionRender(){this.mPendingConnectionRenderFrame===0&&(this.mPendingConnectionRenderFrame=requestAnimationFrame(()=>{this.mPendingConnectionRenderFrame=0,this.renderConnections()}))}selectNodesInBox(){let t=this.mActiveFunction;if(!t)return;let e=this.mInteraction.screenToWorld(Math.min(this.mSelectionBoxScreen.x1,this.mSelectionBoxScreen.x2),Math.min(this.mSelectionBoxScreen.y1,this.mSelectionBoxScreen.y2)),n=this.mInteraction.screenToWorld(Math.max(this.mSelectionBoxScreen.x1,this.mSelectionBoxScreen.x2),Math.max(this.mSelectionBoxScreen.y1,this.mSelectionBoxScreen.y2)),c=this.mInteraction.gridSize;for(let f of t.nodes){let g=f.transformation.x*c,y=f.transformation.y*c,I=g+f.transformation.width*c,D=y+f.transformation.height*c;g<n.x&&I>e.x&&y<n.y&&D>e.y&&this.mSelectedNodes.add(f)}this.invalidateNodeVisuals()}startDocumentPointerTracking(){this.stopDocumentPointerTracking(),this.mDocumentPointerMoveHandler=t=>this.onDocumentPointerMove(t),this.mDocumentPointerUpHandler=t=>this.onDocumentPointerUp(t),document.addEventListener("pointermove",this.mDocumentPointerMoveHandler),document.addEventListener("pointerup",this.mDocumentPointerUpHandler)}startLibraryDrag(t){this.mActiveFunction&&(this.closeAddNodePopup(),this.mInteractionState={definitionId:t.definitionId,label:t.label,mode:"library-drag"},this.mLibraryDragIndicator={clientX:t.clientX,clientY:t.clientY,label:t.label},this.startDocumentPointerTracking())}stopDocumentPointerTracking(){this.mDocumentPointerMoveHandler&&(document.removeEventListener("pointermove",this.mDocumentPointerMoveHandler),this.mDocumentPointerMoveHandler=null),this.mDocumentPointerUpHandler&&(document.removeEventListener("pointerup",this.mDocumentPointerUpHandler),this.mDocumentPointerUpHandler=null)}ensurePreviewElementForNode(t){if(this.mPreviewElements.has(t))return;let e=this.getNodeDefinitionEntryById(t.definitionId)?.definition??null;if(!e?.preview)return;let n=e.preview.generate();n instanceof HTMLElement&&this.mPreviewElements.set(t,n)}updatePreviewElementsFromResult(){let t=this.mPreviewResult,e=this.mActiveFunction;if(!(!t||!e))for(let[n,c]of t.nodeIntermediates){let f=this.mPreviewElements.get(n);if(!f)continue;let g=qt(e).find(y=>y.id===n.definitionId)?.definition??null;if(g?.preview)try{g.preview.update(f,c.context,c.codeFunction,{},c.intermediateCode)}catch(y){console.error("[NodeGraph] Node preview update failed:",y)}}}static{Dn()}};var ri=`:host {\r
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
`;var oi=`<div class="search-wrapper">\r
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
`;function wl(){function m(l,o){return function(a){e(o,"addInitializer"),n(a,"An initializer"),l.push(a)}}function t(l,o,u,a,r,b,v,T,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+o:o,static:b,private:v,metadata:T},d={v:!1};s.addInitializer=m(a,d);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[o]},h=function(x){this[o]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return l(w,s)}finally{d.v=!0}}function e(l,o){if(l.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(l,o){if(typeof l!="function")throw new TypeError(o+" must be a function")}function c(l,o){var u=typeof o;if(l===1){if(u!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(u!=="function"){var a;throw l===0?a="field":l===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function f(l,o,u,a,r,b,v,T,w){var p=u[0],s,d,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,S;if(typeof p=="function")h=t(p,a,s,T,r,b,v,w,i),h!==void 0&&(c(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,S=h.set||i.set,i={get:x,set:S}):i=h);else for(var _=p.length-1;_>=0;_--){var P=p[_];if(h=t(P,a,s,T,r,b,v,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,S=h.set||i.set,i={get:x,set:S}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(C,E){return E};else if(typeof d!="function"){var M=d;d=function(C,E){for(var R=E,L=0;L<M.length;L++)R=M[L].call(C,R);return R}}else{var j=d;d=function(C,E){return j.call(C,E)}}l.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(l.push(function(C,E){return i.get.call(C,E)}),l.push(function(C,E){return i.set.call(C,E)})):r===2?l.push(i):l.push(function(C,E){return i.call(C,E)}):Object.defineProperty(o,a,s))}function g(l,o,u){for(var a=[],r,b,v=new Map,T=new Map,w=0;w<o.length;w++){var p=o[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,S;if(h?(x=l,s=s-5,b=b||[],S=b):(x=l.prototype,r=r||[],S=r),s!==0&&!i){var _=h?T:v,P=_.get(d)||0;if(P===!0||P===3&&s!==4||P===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!P&&s>2?_.set(d,s):_.set(d,!0)}f(a,x,p,d,s,h,i,S,u)}}return y(a,r),y(a,b),a}function y(l,o){o&&l.push(function(u){for(var a=0;a<o.length;a++)o[a].call(u);return u})}function I(l,o,u){if(o.length>0){for(var a=[],r=l,b=l.name,v=o.length-1;v>=0;v--){var T={v:!1};try{var w=o[v](r,{kind:"class",name:b,addInitializer:m(a,T),metadata:u})}finally{T.v=!0}w!==void 0&&(c(10,w),r=w)}return[D(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function D(l,o){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,u,a,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),T=g(o,u,v);return a.length||D(o,v),{e:T,get c(){return I(o,a,v)}}}}function li(m,t,e,n){return(li=wl())(m,t,e,n)}var ci,ni,ui,ii,si,xl;ci=X({selector:"potatno-node-library",template:oi,style:ri}),ui=O.state();var ai=class{static{({e:[ii,si],c:[xl,ni]}=li(this,[[ui,1,"mCachedFilteredGroups"],[F,4,"activeFunction"],[F,4,"refreshVersion"]],[ci]))}mActiveFunction=(si(this),null);mCollapsedCategories={};mNodeDefinitions=[];mRefreshVersion=0;mSearchQuery="";#t=ii(this,[]);get mCachedFilteredGroups(){return this.#t}set mCachedFilteredGroups(t){this.#t=t}set activeFunction(t){this.mActiveFunction!==t&&(this.mActiveFunction=t,this.refreshNodeDefinitions())}get activeFunction(){return this.mActiveFunction}set refreshVersion(t){this.mRefreshVersion!==t&&(this.mRefreshVersion=t,this.refreshNodeDefinitions())}get refreshVersion(){return this.mRefreshVersion}get filteredGroups(){return this.mCachedFilteredGroups}onSearchInput(t){t.target instanceof HTMLInputElement&&(this.mSearchQuery=t.target.value,this.rebuildFilteredGroups())}toggleCategory(t){this.mCollapsedCategories[t]=!this.mCollapsedCategories[t],this.rebuildFilteredGroups()}isCategoryCollapsed(t){return this.mCollapsedCategories[t]===!0}getToggleClass(t){return this.mCollapsedCategories[t]?"category-toggle collapsed":"category-toggle"}onNodePointerDown(t,e){t.button===0&&Lt.startDrag({clientX:t.clientX,clientY:t.clientY,definitionId:e.id,label:e.name})}onNodeClick(t,e){t.preventDefault(),Lt.requestInsert({definitionId:e.id,label:e.name})}refreshNodeDefinitions(){this.mNodeDefinitions=qt(this.mActiveFunction),this.rebuildFilteredGroups()}rebuildFilteredGroups(){let t=this.mSearchQuery.toLowerCase(),e=new Map,n=new Array;for(let f of this.mNodeDefinitions){if(t&&!f.name.toLowerCase().includes(t))continue;let g=e.get(f.category);g||(g=[],e.set(f.category,g),n.push(f.category)),g.push(f)}let c=[];for(let f of n){let g=e.get(f);if(g&&g.length>0){let y=Ot.get(f);c.push({category:f,cssColor:y.cssColor,icon:y.icon,label:y.label,nodes:g})}}this.mCachedFilteredGroups=c}static{ni()}};var hi=`:host {\r
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
`;var di=`<div class="tab-bar">\r
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
`;function Cl(){function m(l,o){return function(a){e(o,"addInitializer"),n(a,"An initializer"),l.push(a)}}function t(l,o,u,a,r,b,v,T,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+o:o,static:b,private:v,metadata:T},d={v:!1};s.addInitializer=m(a,d);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[o]},h=function(x){this[o]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return l(w,s)}finally{d.v=!0}}function e(l,o){if(l.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(l,o){if(typeof l!="function")throw new TypeError(o+" must be a function")}function c(l,o){var u=typeof o;if(l===1){if(u!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(u!=="function"){var a;throw l===0?a="field":l===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function f(l,o,u,a,r,b,v,T,w){var p=u[0],s,d,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,S;if(typeof p=="function")h=t(p,a,s,T,r,b,v,w,i),h!==void 0&&(c(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,S=h.set||i.set,i={get:x,set:S}):i=h);else for(var _=p.length-1;_>=0;_--){var P=p[_];if(h=t(P,a,s,T,r,b,v,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,S=h.set||i.set,i={get:x,set:S}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(C,E){return E};else if(typeof d!="function"){var M=d;d=function(C,E){for(var R=E,L=0;L<M.length;L++)R=M[L].call(C,R);return R}}else{var j=d;d=function(C,E){return j.call(C,E)}}l.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(l.push(function(C,E){return i.get.call(C,E)}),l.push(function(C,E){return i.set.call(C,E)})):r===2?l.push(i):l.push(function(C,E){return i.call(C,E)}):Object.defineProperty(o,a,s))}function g(l,o,u){for(var a=[],r,b,v=new Map,T=new Map,w=0;w<o.length;w++){var p=o[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,S;if(h?(x=l,s=s-5,b=b||[],S=b):(x=l.prototype,r=r||[],S=r),s!==0&&!i){var _=h?T:v,P=_.get(d)||0;if(P===!0||P===3&&s!==4||P===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!P&&s>2?_.set(d,s):_.set(d,!0)}f(a,x,p,d,s,h,i,S,u)}}return y(a,r),y(a,b),a}function y(l,o){o&&l.push(function(u){for(var a=0;a<o.length;a++)o[a].call(u);return u})}function I(l,o,u){if(o.length>0){for(var a=[],r=l,b=l.name,v=o.length-1;v>=0;v--){var T={v:!1};try{var w=o[v](r,{kind:"class",name:b,addInitializer:m(a,T),metadata:u})}finally{T.v=!0}w!==void 0&&(c(10,w),r=w)}return[D(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function D(l,o){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,u,a,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),T=g(o,u,v);return a.length||D(o,v),{e:T,get c(){return I(o,a,v)}}}}function Ii(m,t,e,n){return(Ii=Cl())(m,t,e,n)}var Si,mi,Di,_i,Pi,Ni,Ai,Ri,Li,Mi,Oi,pi,fi,gi,vi,yi,bi,wi,xi,Ti,Ei,Il;Si=X({selector:"potatno-panel-left",template:di,style:hi}),Di=O.state(),_i=O.state(),Pi=O.state(),Ni=O.state(),Ai=O.state(),Ri=O.state(),Li=G("function-select"),Mi=G("function-add"),Oi=G("function-delete");var Ci=class{static{({e:[pi,fi,gi,vi,yi,bi,wi,xi,Ti,Ei],c:[Il,mi]}=Ii(this,[[[F,Di],1,"functions"],[[F,_i],1,"activeFunctionId"],[[F,Pi],1,"userFunctionDefinitions"],[[F,Ni],1,"nodeLibraryRefreshVersion"],[Ai,1,"mActiveTabIndex"],[Ri,1,"mLibraryShownRefreshVersion"],[Li,1,"mFunctionSelect"],[Mi,1,"mFunctionAdd"],[Oi,1,"mFunctionDelete"],[F,4,"activeFunction"]],[Si]))}mActiveFunction=(Ei(this),null);#t=pi(this,[]);get functions(){return this.#t}set functions(t){this.#t=t}#e=fi(this,"");get activeFunctionId(){return this.#e}set activeFunctionId(t){this.#e=t}#r=gi(this,[]);get userFunctionDefinitions(){return this.#r}set userFunctionDefinitions(t){this.#r=t}#o=vi(this,0);get nodeLibraryRefreshVersion(){return this.#o}set nodeLibraryRefreshVersion(t){this.#o=t}#n=yi(this,0);get mActiveTabIndex(){return this.#n}set mActiveTabIndex(t){this.#n=t}#i=bi(this,0);get mLibraryShownRefreshVersion(){return this.#i}set mLibraryShownRefreshVersion(t){this.#i=t}#s=wi(this);get mFunctionSelect(){return this.#s}set mFunctionSelect(t){this.#s=t}#a=xi(this);get mFunctionAdd(){return this.#a}set mFunctionAdd(t){this.#a=t}#l=Ti(this);get mFunctionDelete(){return this.#l}set mFunctionDelete(t){this.#l=t}set activeFunction(t){this.mActiveFunction!==t&&(this.mActiveFunction=t,this.mLibraryShownRefreshVersion++)}get activeFunction(){return this.mActiveFunction}get activeTabIndex(){return this.mActiveTabIndex}get libraryRefreshVersion(){return this.nodeLibraryRefreshVersion+this.mLibraryShownRefreshVersion}getTabClass(t){return t===this.mActiveTabIndex?"tab-button active":"tab-button"}onTabClick(t){let e=this.mActiveTabIndex!==0;this.mActiveTabIndex=t,t===0&&e&&this.mLibraryShownRefreshVersion++}onFunctionSelect(t){this.mFunctionSelect.dispatchEvent(t.value)}onFunctionAdd(t){this.mFunctionAdd.dispatchEvent(t.value)}onFunctionDelete(t){this.mFunctionDelete.dispatchEvent(t.value)}static{mi()}};var Fi=`:host {\r
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
`;var Vi=`<div class="properties-header">Properties</div>\r
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
`;function _l(){function m(l,o){return function(a){e(o,"addInitializer"),n(a,"An initializer"),l.push(a)}}function t(l,o,u,a,r,b,v,T,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+o:o,static:b,private:v,metadata:T},d={v:!1};s.addInitializer=m(a,d);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[o]},h=function(x){this[o]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return l(w,s)}finally{d.v=!0}}function e(l,o){if(l.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(l,o){if(typeof l!="function")throw new TypeError(o+" must be a function")}function c(l,o){var u=typeof o;if(l===1){if(u!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(u!=="function"){var a;throw l===0?a="field":l===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function f(l,o,u,a,r,b,v,T,w){var p=u[0],s,d,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,S;if(typeof p=="function")h=t(p,a,s,T,r,b,v,w,i),h!==void 0&&(c(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,S=h.set||i.set,i={get:x,set:S}):i=h);else for(var _=p.length-1;_>=0;_--){var P=p[_];if(h=t(P,a,s,T,r,b,v,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,S=h.set||i.set,i={get:x,set:S}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(C,E){return E};else if(typeof d!="function"){var M=d;d=function(C,E){for(var R=E,L=0;L<M.length;L++)R=M[L].call(C,R);return R}}else{var j=d;d=function(C,E){return j.call(C,E)}}l.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(l.push(function(C,E){return i.get.call(C,E)}),l.push(function(C,E){return i.set.call(C,E)})):r===2?l.push(i):l.push(function(C,E){return i.call(C,E)}):Object.defineProperty(o,a,s))}function g(l,o,u){for(var a=[],r,b,v=new Map,T=new Map,w=0;w<o.length;w++){var p=o[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,S;if(h?(x=l,s=s-5,b=b||[],S=b):(x=l.prototype,r=r||[],S=r),s!==0&&!i){var _=h?T:v,P=_.get(d)||0;if(P===!0||P===3&&s!==4||P===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!P&&s>2?_.set(d,s):_.set(d,!0)}f(a,x,p,d,s,h,i,S,u)}}return y(a,r),y(a,b),a}function y(l,o){o&&l.push(function(u){for(var a=0;a<o.length;a++)o[a].call(u);return u})}function I(l,o,u){if(o.length>0){for(var a=[],r=l,b=l.name,v=o.length-1;v>=0;v--){var T={v:!1};try{var w=o[v](r,{kind:"class",name:b,addInitializer:m(a,T),metadata:u})}finally{T.v=!0}w!==void 0&&(c(10,w),r=w)}return[D(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function D(l,o){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,u,a,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),T=g(o,u,v);return a.length||D(o,v),{e:T,get c(){return I(o,a,v)}}}}function Ki(m,t,e,n){return(Ki=_l())(m,t,e,n)}var Qi,$i,ki,ts,es,rs,os,ns,is,ss,as,ls,ji,zi,Gi,Bi,Ui,Hi,Xi,Yi,Wi,Zi,qi,Pl;Qi=X({selector:"potatno-panel-properties",template:Vi,style:Fi}),ki=O.state(),ts=O.state(),es=O.state(),rs=O.state(),os=O.state(),ns=O.state(),is=O.state(),ss=O.state(),as=O.state(),ls=G("properties-change");var Ji=class{static{({e:[ji,zi,Gi,Bi,Ui,Hi,Xi,Yi,Wi,Zi,qi],c:[Pl,$i]}=Ki(this,[[[F,ki],1,"functionName"],[[F,ts],1,"functionInputs"],[[F,es],1,"functionOutputs"],[rs,1,"mFunctionImports"],[F,4,"functionImports"],[[F,os],1,"isSystem"],[[F,ns],1,"editableByUser"],[is,1,"mAvailableImports"],[F,4,"availableImports"],[ss,1,"mAvailableTypes"],[F,4,"availableTypes"],[as,1,"mCachedUnusedImports"],[ls,1,"mPropertiesChange"]],[Qi]))}#t=(qi(this),ji(this,""));get functionName(){return this.#t}set functionName(t){this.#t=t}#e=zi(this,[]);get functionInputs(){return this.#e}set functionInputs(t){this.#e=t}#r=Gi(this,[]);get functionOutputs(){return this.#r}set functionOutputs(t){this.#r=t}#o=Bi(this,[]);get mFunctionImports(){return this.#o}set mFunctionImports(t){this.#o=t}set functionImports(t){this.mFunctionImports=t,this.rebuildUnusedImports()}get functionImports(){return this.mFunctionImports}#n=Ui(this,!1);get isSystem(){return this.#n}set isSystem(t){this.#n=t}#i=Hi(this,!1);get editableByUser(){return this.#i}set editableByUser(t){this.#i=t}get nameDisabled(){return this.isSystem}get portsDisabled(){return this.isSystem&&!this.editableByUser}#s=Xi(this,[]);get mAvailableImports(){return this.#s}set mAvailableImports(t){this.#s=t}set availableImports(t){this.mAvailableImports=t,this.rebuildUnusedImports()}get availableImports(){return this.mAvailableImports}#a=Yi(this,[]);get mAvailableTypes(){return this.#a}set mAvailableTypes(t){this.#a=t}set availableTypes(t){this.mAvailableTypes=t}get availableTypes(){return this.mAvailableTypes}#l=Wi(this,[]);get mCachedUnusedImports(){return this.#l}set mCachedUnusedImports(t){this.#l=t}mSelectedImport="";#c=Zi(this);get mPropertiesChange(){return this.#c}set mPropertiesChange(t){this.#c=t}validateName(t){return/^[a-zA-Z][a-zA-Z0-9_]*$/.test(t)}isNameDuplicate(t,e,n){if(e!=="function"&&t===this.functionName)return!0;for(let c=0;c<this.functionInputs.length;c++)if(!(e==="input"&&c===n)&&this.functionInputs[c].name===t)return!0;for(let c=0;c<this.functionOutputs.length;c++)if(!(e==="output"&&c===n)&&this.functionOutputs[c].name===t)return!0;return!1}onNameChange(t){let e=t.target,n=e.value,c=!this.validateName(n)||this.isNameDuplicate(n,"function");e.style.borderColor=c?"var(--pn-accent-danger)":"",this.functionName=n,this.mPropertiesChange.dispatchEvent({name:n})}onInputNameChange(t,e){let n=e.target,c=n.value,f=!this.validateName(c)||this.isNameDuplicate(c,"input",t);n.style.borderColor=f?"var(--pn-accent-danger)":"";let g=[...this.functionInputs];g[t]={...g[t],name:c},this.functionInputs=g,this.mPropertiesChange.dispatchEvent({inputs:g})}onInputTypeChange(t,e){let n=e.target.value,c=[...this.functionInputs];c[t]={...c[t],type:n},this.functionInputs=c,this.mPropertiesChange.dispatchEvent({inputs:c})}onOutputNameChange(t,e){let n=e.target,c=n.value,f=!this.validateName(c)||this.isNameDuplicate(c,"output",t);n.style.borderColor=f?"var(--pn-accent-danger)":"";let g=[...this.functionOutputs];g[t]={...g[t],name:c},this.functionOutputs=g,this.mPropertiesChange.dispatchEvent({outputs:g})}onOutputTypeChange(t,e){let n=e.target.value,c=[...this.functionOutputs];c[t]={...c[t],type:n},this.functionOutputs=c,this.mPropertiesChange.dispatchEvent({outputs:c})}onAddInput(){let t=this.mAvailableTypes.length>0?this.mAvailableTypes[0]:"number",e=[...this.functionInputs,{name:"new_input",type:t}];this.functionInputs=e,this.mPropertiesChange.dispatchEvent({inputs:e})}onDeleteInput(t){let e=[...this.functionInputs];e.splice(t,1),this.functionInputs=e,this.mPropertiesChange.dispatchEvent({inputs:e})}onAddOutput(){let t=this.mAvailableTypes.length>0?this.mAvailableTypes[0]:"number",e=[...this.functionOutputs,{name:"new_output",type:t}];this.functionOutputs=e,this.mPropertiesChange.dispatchEvent({outputs:e})}onDeleteOutput(t){let e=[...this.functionOutputs];e.splice(t,1),this.functionOutputs=e,this.mPropertiesChange.dispatchEvent({outputs:e})}get unusedImports(){return this.mCachedUnusedImports}onImportSelectChange(t){this.mSelectedImport=t.target.value}onAddSelectedImport(){let t=this.mSelectedImport||(this.mCachedUnusedImports.length>0?this.mCachedUnusedImports[0]:"");if(!t)return;let e=[...this.mFunctionImports,t];this.functionImports=e,this.mSelectedImport="",this.mPropertiesChange.dispatchEvent({imports:e})}onDeleteImport(t){let e=[...this.mFunctionImports];e.splice(t,1),this.functionImports=e,this.mPropertiesChange.dispatchEvent({imports:e})}rebuildUnusedImports(){let t=new Set(this.mFunctionImports);this.mCachedUnusedImports=this.mAvailableImports.filter(e=>!t.has(e))}static{$i()}};var cs=`:host {\r
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
`;var us=`<div class="resize-handle" (pointerdown)="this.onResizePointerDown($event)"></div>\r
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
`;function Rl(){function m(l,o){return function(a){e(o,"addInitializer"),n(a,"An initializer"),l.push(a)}}function t(l,o,u,a,r,b,v,T,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+o:o,static:b,private:v,metadata:T},d={v:!1};s.addInitializer=m(a,d);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[o]},h=function(x){this[o]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return l(w,s)}finally{d.v=!0}}function e(l,o){if(l.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(l,o){if(typeof l!="function")throw new TypeError(o+" must be a function")}function c(l,o){var u=typeof o;if(l===1){if(u!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(u!=="function"){var a;throw l===0?a="field":l===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function f(l,o,u,a,r,b,v,T,w){var p=u[0],s,d,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,S;if(typeof p=="function")h=t(p,a,s,T,r,b,v,w,i),h!==void 0&&(c(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,S=h.set||i.set,i={get:x,set:S}):i=h);else for(var _=p.length-1;_>=0;_--){var P=p[_];if(h=t(P,a,s,T,r,b,v,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,S=h.set||i.set,i={get:x,set:S}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(C,E){return E};else if(typeof d!="function"){var M=d;d=function(C,E){for(var R=E,L=0;L<M.length;L++)R=M[L].call(C,R);return R}}else{var j=d;d=function(C,E){return j.call(C,E)}}l.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(l.push(function(C,E){return i.get.call(C,E)}),l.push(function(C,E){return i.set.call(C,E)})):r===2?l.push(i):l.push(function(C,E){return i.call(C,E)}):Object.defineProperty(o,a,s))}function g(l,o,u){for(var a=[],r,b,v=new Map,T=new Map,w=0;w<o.length;w++){var p=o[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,S;if(h?(x=l,s=s-5,b=b||[],S=b):(x=l.prototype,r=r||[],S=r),s!==0&&!i){var _=h?T:v,P=_.get(d)||0;if(P===!0||P===3&&s!==4||P===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!P&&s>2?_.set(d,s):_.set(d,!0)}f(a,x,p,d,s,h,i,S,u)}}return y(a,r),y(a,b),a}function y(l,o){o&&l.push(function(u){for(var a=0;a<o.length;a++)o[a].call(u);return u})}function I(l,o,u){if(o.length>0){for(var a=[],r=l,b=l.name,v=o.length-1;v>=0;v--){var T={v:!1};try{var w=o[v](r,{kind:"class",name:b,addInitializer:m(a,T),metadata:u})}finally{T.v=!0}w!==void 0&&(c(10,w),r=w)}return[D(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function D(l,o){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,u,a,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),T=g(o,u,v);return a.length||D(o,v),{e:T,get c(){return I(o,a,v)}}}}function vs(m,t,e,n){return(vs=Rl())(m,t,e,n)}var ys,hs,bs,ws,xs,ds,ms,ps,fs,Ll;ys=X({selector:"potatno-preview",template:us,style:cs}),bs=nt("PreviewContent"),ws=nt("PreviewContainer"),xs=O.state();var gs=class{static{({e:[ds,ms,ps,fs],c:[Ll,hs]}=vs(this,[[[F,bs],1,"contentElement"],[ws,1,"containerElement"],[[F,xs],1,"errors"],[F,4,"previewContent"],[F,2,"getContainer"],[F,2,"setContent"]],[ys]))}#t=(fs(this),ds(this));get contentElement(){return this.#t}set contentElement(t){this.#t=t}#e=ms(this);get containerElement(){return this.#e}set containerElement(t){this.#e=t}#r=ps(this,[]);get errors(){return this.#r}set errors(t){this.#r=t}get hasErrors(){return this.errors.length>0}mDragging=!1;mStartX=0;mStartY=0;mStartWidth=0;mStartHeight=0;mStoredElement=null;set previewContent(t){console.log("[Preview] previewContent setter called with:",t),this.mStoredElement=t,this.tryAppendStoredElement()}onUpdate(){this.tryAppendStoredElement()}tryAppendStoredElement(){if(!this.mStoredElement)return;let t;try{t=this.contentElement}catch(e){console.error("[Preview] contentElement not accessible:",e);return}if(console.log("[Preview] tryAppendStoredElement - container:",t,"element:",this.mStoredElement,"contains:",t.contains(this.mStoredElement)),!t.contains(this.mStoredElement)){for(;t.firstChild;)t.removeChild(t.firstChild);t.appendChild(this.mStoredElement),console.log("[Preview] element appended to container")}}getContainer(){return this.contentElement}setContent(t){let e=this.contentElement;for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(t)}onResizePointerDown(t){t.preventDefault(),t.stopPropagation(),this.mDragging=!0,this.mStartX=t.clientX,this.mStartY=t.clientY;let e=this.containerElement;if(!e)return;this.mStartWidth=e.offsetWidth,this.mStartHeight=e.offsetHeight,t.target.setPointerCapture(t.pointerId);let n=f=>{if(!this.mDragging)return;let g=this.mStartX-f.clientX,y=this.mStartY-f.clientY,I=Math.max(200,this.mStartWidth+g),D=Math.max(150,this.mStartHeight+y);e.style.width=I+"px",e.style.height=D+"px"},c=f=>{this.mDragging=!1,f.target.releasePointerCapture(f.pointerId),document.removeEventListener("pointermove",n),document.removeEventListener("pointerup",c)};document.addEventListener("pointermove",n),document.addEventListener("pointerup",c)}static{hs()}};var Ts=`.resize-handle {\r
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
`;var Es=`<div [className]="this.getHandleClass()" (pointerdown)="this.onPointerDown($event)"></div>\r
`;function Fl(){function m(l,o){return function(a){e(o,"addInitializer"),n(a,"An initializer"),l.push(a)}}function t(l,o,u,a,r,b,v,T,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+o:o,static:b,private:v,metadata:T},d={v:!1};s.addInitializer=m(a,d);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[o]},h=function(x){this[o]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return l(w,s)}finally{d.v=!0}}function e(l,o){if(l.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(l,o){if(typeof l!="function")throw new TypeError(o+" must be a function")}function c(l,o){var u=typeof o;if(l===1){if(u!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(u!=="function"){var a;throw l===0?a="field":l===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function f(l,o,u,a,r,b,v,T,w){var p=u[0],s,d,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,S;if(typeof p=="function")h=t(p,a,s,T,r,b,v,w,i),h!==void 0&&(c(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,S=h.set||i.set,i={get:x,set:S}):i=h);else for(var _=p.length-1;_>=0;_--){var P=p[_];if(h=t(P,a,s,T,r,b,v,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,S=h.set||i.set,i={get:x,set:S}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(C,E){return E};else if(typeof d!="function"){var M=d;d=function(C,E){for(var R=E,L=0;L<M.length;L++)R=M[L].call(C,R);return R}}else{var j=d;d=function(C,E){return j.call(C,E)}}l.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(l.push(function(C,E){return i.get.call(C,E)}),l.push(function(C,E){return i.set.call(C,E)})):r===2?l.push(i):l.push(function(C,E){return i.call(C,E)}):Object.defineProperty(o,a,s))}function g(l,o,u){for(var a=[],r,b,v=new Map,T=new Map,w=0;w<o.length;w++){var p=o[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,S;if(h?(x=l,s=s-5,b=b||[],S=b):(x=l.prototype,r=r||[],S=r),s!==0&&!i){var _=h?T:v,P=_.get(d)||0;if(P===!0||P===3&&s!==4||P===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!P&&s>2?_.set(d,s):_.set(d,!0)}f(a,x,p,d,s,h,i,S,u)}}return y(a,r),y(a,b),a}function y(l,o){o&&l.push(function(u){for(var a=0;a<o.length;a++)o[a].call(u);return u})}function I(l,o,u){if(o.length>0){for(var a=[],r=l,b=l.name,v=o.length-1;v>=0;v--){var T={v:!1};try{var w=o[v](r,{kind:"class",name:b,addInitializer:m(a,T),metadata:u})}finally{T.v=!0}w!==void 0&&(c(10,w),r=w)}return[D(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function D(l,o){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,u,a,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),T=g(o,u,v);return a.length||D(o,v),{e:T,get c(){return I(o,a,v)}}}}function Ps(m,t,e,n){return(Ps=Fl())(m,t,e,n)}var Ns,Cs,As,Rs,Is,Ss,Ds,Vl;Ns=X({selector:"potatno-resize-handle",template:Es,style:Ts}),As=O.state(),Rs=G("resize");var _s=class{static{({e:[Is,Ss,Ds],c:[Vl,Cs]}=Ps(this,[[[F,As],1,"direction"],[Rs,1,"mResize"]],[Ns]))}#t=(Ds(this),Is(this,"vertical"));get direction(){return this.#t}set direction(t){this.#t=t}#e=Ss(this);get mResize(){return this.#e}set mResize(t){this.#e=t}mDragging=!1;mStartPosition=0;getHandleClass(){return`resize-handle ${this.direction}`}onPointerDown(t){t.preventDefault(),this.mDragging=!0,this.mStartPosition=this.direction==="vertical"?t.clientX:t.clientY,t.target.setPointerCapture(t.pointerId);let e=c=>{if(!this.mDragging)return;let f=this.direction==="vertical"?c.clientX:c.clientY,g=f-this.mStartPosition;this.mStartPosition=f,this.mResize.dispatchEvent({delta:g})},n=c=>{this.mDragging=!1,c.target.releasePointerCapture(c.pointerId),document.removeEventListener("pointermove",e),document.removeEventListener("pointerup",n)};document.addEventListener("pointermove",e),document.addEventListener("pointerup",n)}static{Cs()}};var Ls=`.search-wrapper {\r
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
`;var Ms=`<div class="search-wrapper">\r
    <svg class="search-icon" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">\r
        <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" stroke-width="1.5"/>\r
        <line x1="10.5" y1="10.5" x2="14.5" y2="14.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>\r
    </svg>\r
    <input class="search-field" type="text" [placeholder]="this.placeholder" [value]="this.value" (input)="this.onInput($event)"/>\r
</div>\r
`;function zl(){function m(l,o){return function(a){e(o,"addInitializer"),n(a,"An initializer"),l.push(a)}}function t(l,o,u,a,r,b,v,T,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+o:o,static:b,private:v,metadata:T},d={v:!1};s.addInitializer=m(a,d);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[o]},h=function(x){this[o]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return l(w,s)}finally{d.v=!0}}function e(l,o){if(l.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(l,o){if(typeof l!="function")throw new TypeError(o+" must be a function")}function c(l,o){var u=typeof o;if(l===1){if(u!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(u!=="function"){var a;throw l===0?a="field":l===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function f(l,o,u,a,r,b,v,T,w){var p=u[0],s,d,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,S;if(typeof p=="function")h=t(p,a,s,T,r,b,v,w,i),h!==void 0&&(c(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,S=h.set||i.set,i={get:x,set:S}):i=h);else for(var _=p.length-1;_>=0;_--){var P=p[_];if(h=t(P,a,s,T,r,b,v,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,S=h.set||i.set,i={get:x,set:S}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(C,E){return E};else if(typeof d!="function"){var M=d;d=function(C,E){for(var R=E,L=0;L<M.length;L++)R=M[L].call(C,R);return R}}else{var j=d;d=function(C,E){return j.call(C,E)}}l.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(l.push(function(C,E){return i.get.call(C,E)}),l.push(function(C,E){return i.set.call(C,E)})):r===2?l.push(i):l.push(function(C,E){return i.call(C,E)}):Object.defineProperty(o,a,s))}function g(l,o,u){for(var a=[],r,b,v=new Map,T=new Map,w=0;w<o.length;w++){var p=o[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,S;if(h?(x=l,s=s-5,b=b||[],S=b):(x=l.prototype,r=r||[],S=r),s!==0&&!i){var _=h?T:v,P=_.get(d)||0;if(P===!0||P===3&&s!==4||P===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!P&&s>2?_.set(d,s):_.set(d,!0)}f(a,x,p,d,s,h,i,S,u)}}return y(a,r),y(a,b),a}function y(l,o){o&&l.push(function(u){for(var a=0;a<o.length;a++)o[a].call(u);return u})}function I(l,o,u){if(o.length>0){for(var a=[],r=l,b=l.name,v=o.length-1;v>=0;v--){var T={v:!1};try{var w=o[v](r,{kind:"class",name:b,addInitializer:m(a,T),metadata:u})}finally{T.v=!0}w!==void 0&&(c(10,w),r=w)}return[D(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function D(l,o){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,u,a,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),T=g(o,u,v);return a.length||D(o,v),{e:T,get c(){return I(o,a,v)}}}}function Gs(m,t,e,n){return(Gs=zl())(m,t,e,n)}var Bs,Os,Us,Hs,Xs,Fs,Vs,$s,js,Gl;Bs=X({selector:"potatno-search-input",template:Ms,style:Ls}),Us=O.state(),Hs=O.state(),Xs=G("search-change");var zs=class{static{({e:[Fs,Vs,$s,js],c:[Gl,Os]}=Gs(this,[[[F,Us],1,"placeholder"],[[F,Hs],1,"value"],[Xs,1,"mSearchChange"]],[Bs]))}#t=(js(this),Fs(this,"Search..."));get placeholder(){return this.#t}set placeholder(t){this.#t=t}#e=Vs(this,"");get value(){return this.#e}set value(t){this.#e=t}#r=$s(this);get mSearchChange(){return this.#r}set mSearchChange(t){this.#r=t}onInput(t){let e=t.target;this.value=e.value,this.mSearchChange.dispatchEvent(this.value)}static{Os()}};var Ys=`.tabs-header {\r
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
`;var Ws=`<div class="tabs-header">\r
    $for(tab of this.tabs; index = $index) {\r
        <button [className]="this.getTabClass(this.index)" (click)="this.onTabClick(this.index)">{{this.tab}}</button>\r
    }\r
</div>\r
<div class="tabs-content">\r
    $slot\r
</div>\r
`;function Hl(){function m(l,o){return function(a){e(o,"addInitializer"),n(a,"An initializer"),l.push(a)}}function t(l,o,u,a,r,b,v,T,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+o:o,static:b,private:v,metadata:T},d={v:!1};s.addInitializer=m(a,d);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[o]},h=function(x){this[o]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return l(w,s)}finally{d.v=!0}}function e(l,o){if(l.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(l,o){if(typeof l!="function")throw new TypeError(o+" must be a function")}function c(l,o){var u=typeof o;if(l===1){if(u!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(u!=="function"){var a;throw l===0?a="field":l===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function f(l,o,u,a,r,b,v,T,w){var p=u[0],s,d,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,S;if(typeof p=="function")h=t(p,a,s,T,r,b,v,w,i),h!==void 0&&(c(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,S=h.set||i.set,i={get:x,set:S}):i=h);else for(var _=p.length-1;_>=0;_--){var P=p[_];if(h=t(P,a,s,T,r,b,v,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,S=h.set||i.set,i={get:x,set:S}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(C,E){return E};else if(typeof d!="function"){var M=d;d=function(C,E){for(var R=E,L=0;L<M.length;L++)R=M[L].call(C,R);return R}}else{var j=d;d=function(C,E){return j.call(C,E)}}l.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(l.push(function(C,E){return i.get.call(C,E)}),l.push(function(C,E){return i.set.call(C,E)})):r===2?l.push(i):l.push(function(C,E){return i.call(C,E)}):Object.defineProperty(o,a,s))}function g(l,o,u){for(var a=[],r,b,v=new Map,T=new Map,w=0;w<o.length;w++){var p=o[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,S;if(h?(x=l,s=s-5,b=b||[],S=b):(x=l.prototype,r=r||[],S=r),s!==0&&!i){var _=h?T:v,P=_.get(d)||0;if(P===!0||P===3&&s!==4||P===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!P&&s>2?_.set(d,s):_.set(d,!0)}f(a,x,p,d,s,h,i,S,u)}}return y(a,r),y(a,b),a}function y(l,o){o&&l.push(function(u){for(var a=0;a<o.length;a++)o[a].call(u);return u})}function I(l,o,u){if(o.length>0){for(var a=[],r=l,b=l.name,v=o.length-1;v>=0;v--){var T={v:!1};try{var w=o[v](r,{kind:"class",name:b,addInitializer:m(a,T),metadata:u})}finally{T.v=!0}w!==void 0&&(c(10,w),r=w)}return[D(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function D(l,o){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,u,a,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),T=g(o,u,v);return a.length||D(o,v),{e:T,get c(){return I(o,a,v)}}}}function ta(m,t,e,n){return(ta=Hl())(m,t,e,n)}var ea,Zs,ra,oa,na,qs,Js,Ks,Qs,Xl;ea=X({selector:"potatno-tabs",template:Ws,style:Ys}),ra=O.state(),oa=O.state(),na=G("tab-change");var ks=class{static{({e:[qs,Js,Ks,Qs],c:[Xl,Zs]}=ta(this,[[[F,ra],1,"tabs"],[[F,oa],1,"activeIndex"],[na,1,"mTabChange"]],[ea]))}#t=(Qs(this),qs(this,[]));get tabs(){return this.#t}set tabs(t){this.#t=t}#e=Js(this,0);get activeIndex(){return this.#e}set activeIndex(t){this.#e=t}#r=Ks(this);get mTabChange(){return this.#r}set mTabChange(t){this.#r=t}getTabClass(t){return t===this.activeIndex?"tab-button active":"tab-button"}onTabClick(t){this.activeIndex=t,this.mTabChange.dispatchEvent(t)}static{Zs()}};function Yl(){function m(l,o){return function(a){e(o,"addInitializer"),n(a,"An initializer"),l.push(a)}}function t(l,o,u,a,r,b,v,T,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+o:o,static:b,private:v,metadata:T},d={v:!1};s.addInitializer=m(a,d);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[o]},h=function(x){this[o]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return l(w,s)}finally{d.v=!0}}function e(l,o){if(l.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(l,o){if(typeof l!="function")throw new TypeError(o+" must be a function")}function c(l,o){var u=typeof o;if(l===1){if(u!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(u!=="function"){var a;throw l===0?a="field":l===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function f(l,o,u,a,r,b,v,T,w){var p=u[0],s,d,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,S;if(typeof p=="function")h=t(p,a,s,T,r,b,v,w,i),h!==void 0&&(c(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,S=h.set||i.set,i={get:x,set:S}):i=h);else for(var _=p.length-1;_>=0;_--){var P=p[_];if(h=t(P,a,s,T,r,b,v,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,S=h.set||i.set,i={get:x,set:S}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(C,E){return E};else if(typeof d!="function"){var M=d;d=function(C,E){for(var R=E,L=0;L<M.length;L++)R=M[L].call(C,R);return R}}else{var j=d;d=function(C,E){return j.call(C,E)}}l.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(l.push(function(C,E){return i.get.call(C,E)}),l.push(function(C,E){return i.set.call(C,E)})):r===2?l.push(i):l.push(function(C,E){return i.call(C,E)}):Object.defineProperty(o,a,s))}function g(l,o,u){for(var a=[],r,b,v=new Map,T=new Map,w=0;w<o.length;w++){var p=o[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,S;if(h?(x=l,s=s-5,b=b||[],S=b):(x=l.prototype,r=r||[],S=r),s!==0&&!i){var _=h?T:v,P=_.get(d)||0;if(P===!0||P===3&&s!==4||P===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!P&&s>2?_.set(d,s):_.set(d,!0)}f(a,x,p,d,s,h,i,S,u)}}return y(a,r),y(a,b),a}function y(l,o){o&&l.push(function(u){for(var a=0;a<o.length;a++)o[a].call(u);return u})}function I(l,o,u){if(o.length>0){for(var a=[],r=l,b=l.name,v=o.length-1;v>=0;v--){var T={v:!1};try{var w=o[v](r,{kind:"class",name:b,addInitializer:m(a,T),metadata:u})}finally{T.v=!0}w!==void 0&&(c(10,w),r=w)}return[D(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function D(l,o){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,u,a,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),T=g(o,u,v);return a.length||D(o,v),{e:T,get c(){return I(o,a,v)}}}}function ga(m,t,e,n){return(ga=Yl())(m,t,e,n)}var va,ia,ya,ba,wa,xa,Ta,Ea,Ca,Ia,sa,aa,la,ca,ua,ha,da,ma,pa,Ue;va=X({selector:"potatno-code-editor",template:zr,style:jr}),ya=O.state({complexValue:!0}),ba=O.state(),wa=O.state({complexValue:!0}),xa=O.state(),Ta=O.state(),Ea=O.state(),Ca=nt("panelLeft"),Ia=nt("panelRight");var fa=class{static{({e:[sa,aa,la,ca,ua,ha,da,ma,pa],c:[Ue,ia]}=ga(this,[[ya,1,"mCachedData"],[ba,1,"mEntryPointPreviewElement"],[wa,1,"mGraphPreviewResult"],[xa,1,"mGraphRefreshVersion"],[Ta,1,"mNodeLibraryRefreshVersion"],[Ea,1,"mPreviewUpdateVersion"],[Ca,1,"panelLeft"],[Ia,1,"panelRight"],[F,4,"project"],[F,4,"file"],[F,2,"loadCode"],[F,2,"generateCode"],[F,2,"triggerPreviewUpdate"]],[va]))}constructor(){this.mCachedData=this.createEmptyCachedData(),this.mHistory=new Pe,this.mHistoryDebounceTimer=null,this.mPreviewDebounceTimer=null,this.mPreviewDirty=!0,this.mResizeMoveHandler=null,this.mResizeState=null,this.mResizeUpHandler=null}mHistory;mActiveFunctionId=(pa(this),"");mFile;mHistoryDebounceTimer;mPreviewDebounceTimer;mPreviewDirty;mProject;mResizeMoveHandler;mResizeState;mResizeUpHandler;#t=sa(this);get mCachedData(){return this.#t}set mCachedData(t){this.#t=t}#e=aa(this,null);get mEntryPointPreviewElement(){return this.#e}set mEntryPointPreviewElement(t){this.#e=t}#r=la(this,null);get mGraphPreviewResult(){return this.#r}set mGraphPreviewResult(t){this.#r=t}#o=ca(this,0);get mGraphRefreshVersion(){return this.#o}set mGraphRefreshVersion(t){this.#o=t}#n=ua(this,0);get mNodeLibraryRefreshVersion(){return this.#n}set mNodeLibraryRefreshVersion(t){this.#n=t}#i=ha(this,0);get mPreviewUpdateVersion(){return this.#i}set mPreviewUpdateVersion(t){this.#i=t}#s=da(this);get panelLeft(){return this.#s}set panelLeft(t){this.#s=t}#a=ma(this);get panelRight(){return this.#a}set panelRight(t){this.#a=t}get activeFunction(){let t=this.mFile;if(!t)return null;for(let e of t.functions)if(e.id===this.mActiveFunctionId)return e;return null}get activeFunctionId(){return this.mActiveFunctionId}get activeFunctionName(){return this.mCachedData.activeFunctionName}get activeFunctionInputs(){return this.mCachedData.activeFunctionInputs}get activeFunctionOutputs(){return this.mCachedData.activeFunctionOutputs}get activeFunctionImports(){return this.mCachedData.activeFunctionImports}get activeFunctionIsSystem(){return this.mCachedData.activeFunctionIsSystem}get activeFunctionEditableByUser(){return this.mCachedData.activeFunctionEditableByUser}get availableImportsList(){return this.mCachedData.availableImports}get availableTypes(){return this.mCachedData.availableTypes}get editorErrors(){return this.mCachedData.errors}get graphErrorNodes(){return this.mCachedData.graphErrorNodes}get graphErrorPorts(){return this.mCachedData.graphErrorPorts}get entryPreviewElement(){return this.mEntryPointPreviewElement}get functionList(){return this.mCachedData.functionList}get graphPreviewResult(){return this.mGraphPreviewResult}get graphRefreshVersion(){return this.mGraphRefreshVersion}get hasPreview(){return this.mCachedData.hasPreview}get nodeLibraryRefreshVersion(){return this.mNodeLibraryRefreshVersion}get previewUpdateVersion(){return this.mPreviewUpdateVersion}get userFunctionDefinitions(){let t=this.mProject;return t?[...t.userFunctions.values()].map(e=>({id:e.id})):[]}get file(){return this.mFile??null}set project(t){this.mProject=t,this.rebuildCachedData(),this.refreshNodeLibrary()}set file(t){if(t){this.mFile=t;let e=this.mProject;e&&t.functions.size===0&&this.initializeMainFunctions(t,e),this.mActiveFunctionId=[...t.functions][0]?.id??""}else this.mFile=void 0,this.mActiveFunctionId="";this.mHistory.clear(),this.mGraphPreviewResult=null,this.mEntryPointPreviewElement=null,this.rebuildCachedData(),this.refreshGraph(),this.refreshNodeLibrary(),this.schedulePreviewUpdate()}loadCode(t){let e=this.mProject;if(!e)return;let c=new pe(e).deserialize(t);this.mFile=c,this.mActiveFunctionId=[...c.functions][0]?.id??"",this.mHistory.clear(),this.mGraphPreviewResult=null,this.mEntryPointPreviewElement=null,this.rebuildCachedData(),this.refreshGraph(),this.refreshNodeLibrary(),this.schedulePreviewUpdate()}generateCode(){let t=this.mFile;return t?new fe().serialize(t):null}triggerPreviewUpdate(){this.updatePreviewsFromCache()}onDeconstruct(){this.mHistoryDebounceTimer!==null&&(clearTimeout(this.mHistoryDebounceTimer),this.mHistoryDebounceTimer=null),this.mPreviewDebounceTimer!==null&&(clearTimeout(this.mPreviewDebounceTimer),this.mPreviewDebounceTimer=null),this.stopPanelResize()}onFunctionSelect(t){this.activateFunction(t.value)}onFunctionAdd(t){let e=t.value,n=this.mFile,c=this.mProject;if(!n||!c)return;let f=c.userFunctions.get(e);if(!f)return;let g=new yt(c,n,{definitionId:f.id,id:crypto.randomUUID(),isSystem:!1,label:`Function ${n.functions.size}`});f.getPrefilledNodes(g).forEach((y,I)=>{g.newNode(y,{height:4,width:10,x:2+I*12,y:2},!0),c.nodeDefinitions.some(D=>D.id===y.id)||c.addNodeDefinition(y)});for(let y of f.getNodeDefinitions(g))c.nodeDefinitions.some(I=>I.id===y.id)||c.addNodeDefinition(y);if((f.statics&zt.imports)!==0)for(let y of c.imports)g.addImport(y.label);n.addFunction(g),this.mActiveFunctionId=g.id,this.scheduleHistorySnapshot(),this.rebuildCachedData(),this.refreshGraph(),this.refreshNodeLibrary()}onFunctionDelete(t){let e=t.value,n=this.mFile;if(n){for(let c of n.functions)if(c.id===e){n.removeFunction(c);break}this.mActiveFunctionId===e&&(this.mActiveFunctionId=[...n.functions][0]?.id??""),this.scheduleHistorySnapshot(),this.rebuildCachedData(),this.refreshGraph(),this.refreshNodeLibrary(),this.schedulePreviewUpdate()}}onPropertiesChange(t){let e=this.activeFunction;if(!e)return;let n=t.value,c=!1;if(n.name!==void 0&&(e.label=n.name),n.inputs!==void 0){let f=new Set(e.inputs.map(y=>y.label)),g=new Set(n.inputs.map(y=>y.name));for(let y of[...e.inputs])g.has(y.label)||e.removeInput(y);for(let y of n.inputs)f.has(y.name)||e.addInput({dataType:y.type,label:y.name});c=!0}if(n.outputs!==void 0){let f=new Set(e.outputs.map(y=>y.label)),g=new Set(n.outputs.map(y=>y.name));for(let y of[...e.outputs])g.has(y.label)||e.removeOutput(y);for(let y of n.outputs)f.has(y.name)||e.addOutput({dataType:y.type,label:y.name});c=!0}if(n.imports!==void 0){let f=new Set(e.imports),g=new Set(n.imports);for(let y of[...e.imports])g.has(y)||e.removeImport(y);for(let y of n.imports)f.has(y)||e.addImport(y);c=!0}this.scheduleHistorySnapshot(),this.rebuildCachedData(),this.refreshGraph(),c&&this.refreshNodeLibrary(),this.schedulePreviewUpdate()}onGraphChange(t){this.scheduleHistorySnapshot(),this.rebuildCachedData(),t.value.affectsLibrary&&this.refreshNodeLibrary(),t.value.affectsPreview&&this.schedulePreviewUpdate()}onGraphOpenFunction(t){this.activateFunction(t.value.functionId)}onGraphUndoRequest(t){let e=this.mHistory.undo();e&&this.restoreSnapshot(e)}onGraphRedoRequest(t){let e=this.mHistory.redo();e&&this.restoreSnapshot(e)}onResizeLeftStart(t){t.preventDefault(),this.startPanelResize("left",t)}onResizeRightStart(t){t.preventDefault(),this.startPanelResize("right",t)}activateFunction(t){let e=this.mFile;if(e){for(let n of e.functions)if(n.id===t){this.mActiveFunctionId=t,this.rebuildCachedData(),this.refreshGraph(),this.refreshNodeLibrary();return}}}createEmptyCachedData(){return{activeFunctionEditableByUser:!1,activeFunctionId:"",activeFunctionImports:[],activeFunctionInputs:[],activeFunctionIsSystem:!1,activeFunctionName:"",activeFunctionOutputs:[],availableImports:[],availableTypes:[],errors:[],functionList:[],graphErrorNodes:new Set,graphErrorPorts:new Set,hasPreview:!1}}evaluatePreview(){let t=this.mProject,e=this.mFile;if(!t||!e||!this.mPreviewDirty)return;this.mPreviewDirty=!1;let n;for(let y of e.functions)if(y.isSystem){n=y;break}if(!n)return;let c=new Set;for(let y of this.getAvailableDefinitionsForFunction(n))y.preview&&c.add(y.id);let f=new Set;for(let y of n.nodes)c.has(y.definitionId)&&f.add(y);let g=t.entryPoint.preview;g&&!this.mEntryPointPreviewElement&&(this.mEntryPointPreviewElement=g.generate());try{let y=new _e(t);this.mGraphPreviewResult=y.generateFunctionCodeWithIntermediates(n,f),this.updatePreviewsFromCache()}catch(y){console.error("[Editor] Preview code generation failed:",y)}}getAvailableDefinitionsForFunction(t){let e=[],n=new Set,c=g=>{n.has(g.id)||(n.add(g.id),e.push(g))};for(let g of t.project.nodeDefinitions)c(g);for(let g of t.nodeDefinitions)c(g);let f=new Set(t.imports);for(let g of t.project.imports)if(f.has(g.label))for(let y of g.nodes)c(y);return e}initializeMainFunctions(t,e){let n=e.entryPoint;if(!n)return;let c=new yt(e,t,{definitionId:n.id,id:crypto.randomUUID(),isSystem:!0,label:"Main"});n.getPrefilledNodes(c).forEach((f,g)=>{c.newNode(f,{height:4,width:10,x:2+g*12,y:2},!0),e.nodeDefinitions.some(y=>y.id===f.id)||e.addNodeDefinition(f)});for(let f of n.getNodeDefinitions(c))e.nodeDefinitions.some(g=>g.id===f.id)||e.addNodeDefinition(f);if((n.statics&zt.imports)!==0)for(let f of e.imports)c.addImport(f.label);t.addFunction(c)}pushHistorySnapshot(){let t=this.mFile;if(!t)return;let e=new fe;this.mHistory.push(e.serialize(t))}rebuildCachedData(){let t=this.mProject,e=this.mFile,n=this.activeFunction,c=this.createEmptyCachedData();if(c.activeFunctionId=this.mActiveFunctionId,c.hasPreview=t?.entryPoint.preview!==null&&t?.entryPoint.preview!==void 0,e){let f=new Set,g=new Set;for(let y of e.validate())y.item instanceof vt?(c.errors.push({location:`Node "${y.item.node.label}"`,message:y.message}),g.add(y.item),f.add(y.item.node)):y.item instanceof It&&f.add(y.item);c.graphErrorNodes=f,c.graphErrorPorts=g;for(let y of e.functions)c.functionList.push({id:y.id,label:y.label,name:y.label,system:y.isSystem})}if(c.availableImports=t?.imports.map(f=>f.label)??[],t){let f=new Set;for(let[g]of t.types.types)f.add(g);c.availableTypes=[...f].sort()}n&&(c.activeFunctionEditableByUser=!n.isSystem,c.activeFunctionImports=[...n.imports],c.activeFunctionInputs=n.inputs.map(f=>({name:f.label,type:f.dataType})),c.activeFunctionIsSystem=n.isSystem,c.activeFunctionName=n.label,c.activeFunctionOutputs=n.outputs.map(f=>({name:f.label,type:f.dataType}))),this.mCachedData=c}refreshGraph(){this.mGraphRefreshVersion++}refreshNodeLibrary(){this.mNodeLibraryRefreshVersion++}restoreSnapshot(t){let e=this.mProject;if(!e)return;let n=new pe(e);this.mFile=n.deserialize(t),[...this.mFile.functions].some(c=>c.id===this.mActiveFunctionId)||(this.mActiveFunctionId=[...this.mFile.functions][0]?.id??""),this.mGraphPreviewResult=null,this.mEntryPointPreviewElement=null,this.rebuildCachedData(),this.refreshGraph(),this.refreshNodeLibrary(),this.schedulePreviewUpdate()}scheduleHistorySnapshot(){this.mHistoryDebounceTimer!==null&&clearTimeout(this.mHistoryDebounceTimer),this.mHistoryDebounceTimer=setTimeout(()=>{this.mHistoryDebounceTimer=null,this.pushHistorySnapshot()},500)}schedulePreviewUpdate(){this.mPreviewDirty=!0,this.mPreviewDebounceTimer!==null&&clearTimeout(this.mPreviewDebounceTimer),this.mPreviewDebounceTimer=setTimeout(()=>{this.mPreviewDebounceTimer=null,this.evaluatePreview()},300)}startPanelResize(t,e){let n=t==="left"?this.panelLeft:this.panelRight;this.mResizeState={panel:t,startWidth:n.offsetWidth,startX:e.clientX};let c=g=>{if(!this.mResizeState)return;let y=t==="left"?g.clientX-this.mResizeState.startX:this.mResizeState.startX-g.clientX;n.style.width=`${Math.max(200,Math.min(500,this.mResizeState.startWidth+y))}px`},f=()=>{document.removeEventListener("pointermove",c),document.removeEventListener("pointerup",f),this.mResizeMoveHandler=null,this.mResizeState=null,this.mResizeUpHandler=null};this.stopPanelResize(),this.mResizeMoveHandler=c,this.mResizeUpHandler=f,document.addEventListener("pointermove",c),document.addEventListener("pointerup",f)}stopPanelResize(){this.mResizeMoveHandler&&(document.removeEventListener("pointermove",this.mResizeMoveHandler),this.mResizeMoveHandler=null),this.mResizeUpHandler&&(document.removeEventListener("pointerup",this.mResizeUpHandler),this.mResizeUpHandler=null),this.mResizeState=null}updatePreviewsFromCache(){let t=this.mProject,e=this.mGraphPreviewResult;if(!t||!e)return;let n=t.entryPoint.preview;if(n&&this.mEntryPointPreviewElement)try{n.update(this.mEntryPointPreviewElement,e.codeFunction,{},e.fullCode)}catch(c){console.error("[Editor] Entry preview update failed:",c)}this.mPreviewUpdateVersion++}static{ia()}};var Sa=`:host {\r
    display: block;\r
    width: 100%;\r
    height: 100%;\r
}\r
\r
potatno-code-editor {\r
    display: block;\r
    width: 100%;\r
    height: 100%;\r
}`;var Da=`:host {\r
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
`;var Le=class extends kt{mCodeEditor;mProject;get document(){return this.mCodeEditor.file}set document(t){this.mCodeEditor.file=t}get project(){return this.mProject}constructor(t){super(),this.mProject=t,this.addStyle(Da),this.addStyle(Sa),this.mCodeEditor=this.addContent(Ue),this.mCodeEditor.project=t}update(){this.mCodeEditor.triggerPreviewUpdate()}};var B=class m extends pt{static new(t){return new m(t)}constructor(t){super({id:t.id,label:t.label,category:t.category,regions:t.regions??null,generators:{ports:{inputs:()=>t.ports.inputs??[],outputs:()=>t.ports.outputs??[]},code:t.generators.code,preview:t.generators.preview??null}})}};var Me=class m{static new(t){return new m(t)}mTypes;get types(){return this.mTypes}get typeNames(){return Array.from(this.mTypes.keys())}constructor(t){this.mTypes=new Map;for(let[e,n]of Object.entries(t))this.mTypes.set(e,{name:e,...n})}getType(t){if(!this.mTypes.has(t))throw new Error(`Type "${t}" is not defined in the project types definition.`);return this.mTypes.get(t)}isGenericType(t){return/^<[^>]+>$/.test(t)}};var Oe=class m extends pt{static new(){return new m}constructor(){super({id:"3f7c1a2b-5d4e-4890-b6f8-9a0c3e7d2f1b",label:"Flow Conjunction",category:z.Reroute,generators:{ports:{inputs:()=>[{label:"in",id:"in",portType:"flow"}],outputs:()=>[{label:"out",id:"out",portType:"flow"}]},code:()=>{throw new A("Conjunction node code generators should never be called.",m)}}})}};var Fe=class m extends pt{static new(){return new m}constructor(){super({id:"8b2e4a6c-1f3d-4750-a9e2-7c5b0d8f3e4a",label:"Value Conjunction",category:z.Reroute,generators:{ports:{inputs:()=>[{label:"in",id:"in",portType:"value",dataType:"<T>"}],outputs:()=>[{label:"out",id:"out",portType:"value",dataType:"<T>"}]},code:()=>{throw new A("Conjunction node code generators should never be called.",m)}}})}};var Ve=class m{static new(t){return new m(t)}mEntryPoint;mImports;mNodeDefinitions;mTypes;mUserFunctions;get entryPoint(){return this.mEntryPoint}get imports(){return this.mImports}get nodeDefinitions(){return Array.from(this.mNodeDefinitions.values())}get types(){return this.mTypes}get userFunctions(){return this.mUserFunctions}constructor(t){this.mEntryPoint=t.entryPoint,this.mTypes=t.types,this.mNodeDefinitions=new Map,this.mImports=new Array,this.mUserFunctions=new Map,this.addNodeDefinition(Oe.new()),this.addNodeDefinition(Fe.new())}addImport(t){this.mImports.push(t)}addNodeDefinition(t){this.mNodeDefinitions.set(t.id,t)}addUserFunction(t){this.mUserFunctions.set(t.id,t)}getFunction(t){return this.mEntryPoint.id===t?this.mEntryPoint:this.mUserFunctions.get(t)}};(()=>{let m=new WebSocket("ws://127.0.0.1:8088");m.addEventListener("open",()=>{console.log("Refresh connection established")}),m.addEventListener("message",t=>{console.log("Bundle finished. Start refresh"),t.data==="REFRESH"&&window.location.reload()})})();var He=Me.new({number:{defaultValue:["0"],convert:m=>{let t=m[0],e=parseFloat(t);if(isNaN(e))throw new Error(`Invalid number: "${t}"`);return e.toString()},inputs:[{name:"value",type:"number"}]},string:{defaultValue:[""],convert:m=>m[0],inputs:[{name:"value",type:"string"}]},boolean:{defaultValue:["false"],convert:m=>{let t=m[0].toLowerCase();if(t==="true")return"true";if(t==="false")return"false";throw new Error(`Invalid boolean: "${m[0]}"`)},inputs:[{name:"value",type:"boolean"}]}}),Y=Ve.new({types:He,entryPoint:me.new(He,{id:"pixelShader",label:"Pixel Shader",statics:zt.imports|zt.inputs,nodes:{prefilled:m=>{m(B.new({id:"OnPixel",label:"OnPixel",category:"event",ports:{inputs:[],outputs:[{label:"exec",id:"exec",portType:"flow"},{label:"x",id:"x",portType:"value",dataType:"number"},{label:"y",id:"y",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.x.valueId} = __pixel_x;
const ${t.outputs.y.valueId} = __pixel_y;`}})),m(B.new({id:"PixelResult",label:"PixelResult",category:z.Output,ports:{inputs:[{label:"exec",id:"exec",portType:"flow"},{label:"red",id:"red",portType:"value",dataType:"number"},{label:"green",id:"green",portType:"value",dataType:"number"},{label:"blue",id:"blue",portType:"value",dataType:"number"}],outputs:[]},generators:{code:t=>`__pixel_r = ${t.inputs.red.valueId};
__pixel_g = ${t.inputs.green.valueId};
__pixel_b = ${t.inputs.blue.valueId};`}}))}},generator:{code:{body:m=>{let t=m.inputs.map(n=>n.valueId).join(", "),e=t?`__pixel_x, __pixel_y, ${t}`:"__pixel_x, __pixel_y";return`function ${m.name}(${e}) {
let __pixel_r = 0, __pixel_g = 0, __pixel_b = 0;
${m.bodyCode}
return [__pixel_r, __pixel_g, __pixel_b];
}`},value:m=>`${m.inputs}`},preview:{generate:()=>{let m=document.createElement("canvas");return m.width=100,m.height=100,m.style.cssText="width: 100px; height: 100px; image-rendering: pixelated; background: #000;",m},update:(m,t,e,n)=>{let c=m,f=c.getContext("2d"),g=f.createImageData(c.width,c.height),y=Function(n+`
return `+t.name+";")();for(let I=0;I<g.height;I++)for(let D=0;D<g.width;D++){let l=y(D/g.width,I/g.height),o=(I*g.width+D)*4;g.data[o]=Math.max(0,Math.min(255,Math.round(l[0]*255))),g.data[o+1]=Math.max(0,Math.min(255,Math.round(l[1]*255))),g.data[o+2]=Math.max(0,Math.min(255,Math.round(l[2]*255))),g.data[o+3]=255}f.putImageData(g,0,0)}}}})});Y.addImport({id:"Math",label:"Math",nodes:[B.new({id:"Math.PI",label:"Math.PI",category:"value",ports:{inputs:[],outputs:[{label:"value",id:"value",portType:"value",dataType:"number"}]},generators:{code:m=>`const ${m.outputs.value.valueId} = Math.PI;`}}),B.new({id:"Math.E",label:"Math.E",category:"value",ports:{inputs:[],outputs:[{label:"value",id:"value",portType:"value",dataType:"number"}]},generators:{code:m=>`const ${m.outputs.value.valueId} = Math.E;`}}),B.new({id:"Math.abs",label:"Math.abs",category:z.Function,ports:{inputs:[{label:"value",id:"value",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:m=>`const ${m.outputs.result.valueId} = Math.abs(${m.inputs.value.valueId});`}}),B.new({id:"Math.floor",label:"Math.floor",category:z.Function,ports:{inputs:[{label:"value",id:"value",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:m=>`const ${m.outputs.result.valueId} = Math.floor(${m.inputs.value.valueId});`}}),B.new({id:"Math.random",label:"Math.random",category:z.Function,ports:{inputs:[],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:m=>`const ${m.outputs.result.valueId} = Math.random();`}})]});Y.addNodeDefinition(B.new({id:"Add",label:"Add",category:"operator",ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:m=>`const ${m.outputs.result.valueId} = ${m.inputs.a.valueId} + ${m.inputs.b.valueId};`}}));Y.addNodeDefinition(B.new({id:"Subtract",label:"Subtract",category:"operator",ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:m=>`const ${m.outputs.result.valueId} = ${m.inputs.a.valueId} - ${m.inputs.b.valueId};`}}));Y.addNodeDefinition(B.new({id:"Multiply",label:"Multiply",category:"operator",ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:m=>`const ${m.outputs.result.valueId} = ${m.inputs.a.valueId} * ${m.inputs.b.valueId};/*MULTIPLYHOOK_${m.outputs.result.valueId}*/`,preview:{generate:()=>{let m=document.createElement("canvas");return m.width=50,m.height=50,m.style.cssText="width: 50px; height: 50px; image-rendering: pixelated; border: 1px solid rgba(255,255,255,0.1); border-radius: 2px;",m},update:(m,t,e,n,c)=>{let f=m,g=f.getContext("2d"),y=g.createImageData(f.width,f.height),I=c.replace(`/*MULTIPLYHOOK_${t.outputs.result.valueId}*/`,`return ${t.outputs.result.valueId};`),D=Function(I+`
return `+e.name+";")();for(let l=0;l<y.height;l++)for(let o=0;o<y.width;o++){let u=D(o/y.width,l/y.height),a=(l*y.width+o)*4;y.data[a]=Math.max(0,Math.min(255,Math.round(u*255))),y.data[a+1]=Math.max(0,Math.min(255,Math.round(u*255))),y.data[a+2]=Math.max(0,Math.min(255,Math.round(u*255))),y.data[a+3]=255}g.putImageData(y,0,0)}}}}));Y.addNodeDefinition(B.new({id:"Divide",label:"Divide",category:"operator",ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:m=>`const ${m.outputs.result.valueId} = ${m.inputs.a.valueId} / ${m.inputs.b.valueId};`}}));Y.addNodeDefinition(B.new({id:"Modulo",label:"Modulo",category:"operator",ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:m=>`const ${m.outputs.result.valueId} = ${m.inputs.a.valueId} % ${m.inputs.b.valueId};`}}));Y.addNodeDefinition(B.new({id:"Equal",label:"Equal",category:"operator",ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"boolean"}]},generators:{code:m=>`const ${m.outputs.result.valueId} = ${m.inputs.a.valueId} === ${m.inputs.b.valueId};`}}));Y.addNodeDefinition(B.new({id:"Not Equal",label:"Not Equal",category:"operator",ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"boolean"}]},generators:{code:m=>`const ${m.outputs.result.valueId} = ${m.inputs.a.valueId} !== ${m.inputs.b.valueId};`}}));Y.addNodeDefinition(B.new({id:"Less Than",label:"Less Than",category:"operator",ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"boolean"}]},generators:{code:m=>`const ${m.outputs.result.valueId} = ${m.inputs.a.valueId} < ${m.inputs.b.valueId};`}}));Y.addNodeDefinition(B.new({id:"Greater Than",label:"Greater Than",category:"operator",ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"boolean"}]},generators:{code:m=>`const ${m.outputs.result.valueId} = ${m.inputs.a.valueId} > ${m.inputs.b.valueId};`}}));Y.addNodeDefinition(B.new({id:"And",label:"And",category:"operator",ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"boolean"},{label:"b",id:"b",portType:"value",dataType:"boolean"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"boolean"}]},generators:{code:m=>`const ${m.outputs.result.valueId} = ${m.inputs.a.valueId} && ${m.inputs.b.valueId};`}}));Y.addNodeDefinition(B.new({id:"Or",label:"Or",category:"operator",ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"boolean"},{label:"b",id:"b",portType:"value",dataType:"boolean"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"boolean"}]},generators:{code:m=>`const ${m.outputs.result.valueId} = ${m.inputs.a.valueId} || ${m.inputs.b.valueId};`}}));Y.addNodeDefinition(B.new({id:"Not",label:"Not",category:"operator",ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"boolean"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"boolean"}]},generators:{code:m=>`const ${m.outputs.result.valueId} = !${m.inputs.a.valueId};`}}));Y.addNodeDefinition(B.new({id:"Number to String",label:"Number to String",category:"type-conversion",ports:{inputs:[{label:"input",id:"input",portType:"value",dataType:"number"}],outputs:[{label:"output",id:"output",portType:"value",dataType:"string"}]},generators:{code:m=>`const ${m.outputs.output.valueId} = String(${m.inputs.input.valueId});`}}));Y.addNodeDefinition(B.new({id:"String to Number",label:"String to Number",category:"type-conversion",ports:{inputs:[{label:"input",id:"input",portType:"value",dataType:"string"}],outputs:[{label:"output",id:"output",portType:"value",dataType:"number"}]},generators:{code:m=>`const ${m.outputs.output.valueId} = Number(${m.inputs.input.valueId});`}}));Y.addNodeDefinition(B.new({id:"Boolean to String",label:"Boolean to String",category:"type-conversion",ports:{inputs:[{label:"input",id:"input",portType:"value",dataType:"boolean"}],outputs:[{label:"output",id:"output",portType:"value",dataType:"string"}]},generators:{code:m=>`const ${m.outputs.output.valueId} = String(${m.inputs.input.valueId});`}}));Y.addNodeDefinition(B.new({id:"If",label:"If",category:"flow",ports:{inputs:[{label:"exec",id:"exec",portType:"flow"},{label:"condition",id:"condition",portType:"value",dataType:"boolean"}],outputs:[{label:"then",id:"then",portType:"flow"},{label:"else",id:"else",portType:"flow"}]},generators:{code:m=>`if (${m.inputs.condition.valueId}) {
${m.outputs.then.code.inner}
} else {
${m.outputs.else.code.inner}
}`}}));Y.addNodeDefinition(B.new({id:"While",label:"While",category:"flow",ports:{inputs:[{label:"exec",id:"exec",portType:"flow"},{label:"condition",id:"condition",portType:"value",dataType:"boolean"}],outputs:[{label:"body",id:"body",portType:"flow"}]},generators:{code:m=>`while (${m.inputs.condition.valueId}) {
${m.outputs.body.code.inner}
}`}}));Y.addNodeDefinition(B.new({id:"For Loop",label:"For Loop",category:"flow",ports:{inputs:[{label:"exec",id:"exec",portType:"flow"},{label:"count",id:"count",portType:"value",dataType:"number"}],outputs:[{label:"exec",id:"exec",portType:"flow"},{label:"index",id:"index",portType:"value",dataType:"number"}]},generators:{code:m=>`for (let ${m.outputs.index.valueId} = 0; ${m.outputs.index.valueId} < ${m.inputs.count.valueId}; ${m.outputs.index.valueId}++) {
${m.outputs.exec.code.inner}
}`}}));Y.addNodeDefinition(B.new({id:"Console Log",label:"Console Log",category:z.Function,ports:{inputs:[{label:"message",id:"message",portType:"value",dataType:"string"}],outputs:[]},generators:{code:({inputs:m})=>`console.log(${m.message.valueId});`}}));Y.addNodeDefinition(B.new({id:"String Concat",label:"String Concat",category:z.Function,ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"string"},{label:"b",id:"b",portType:"value",dataType:"string"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"string"}]},generators:{code:m=>`const ${m.outputs.result.valueId} = ${m.inputs.a.valueId} + ${m.inputs.b.valueId};`}}));Y.addUserFunction(me.new(He,{id:"Helper Function",label:"Helper Function",statics:zt.none,nodes:{},generator:{code:{body:m=>{let t=m.inputs.map(c=>c.valueId).join(", "),e=m.outputs.map(c=>c.valueId).join(", "),n=m.bodyCode;return e&&(n+=`
return ${m.outputs.length>1?`[${e}]`:e};`),`function ${m.name}(${t}) {
${n}
}`},value:m=>{let t=Object.values(m.inputs).map(n=>n.valueId).join(", ");return`const ${Object.values(m.outputs).map(n=>n.valueId)[0]??"_unused"} = ${m.inputs}(${t});`}}}}));var Xe=new Le(Y);Xe.appendTo(document.body);Xe.document=new Gt(Y);function _a(){Xe.update(),requestAnimationFrame(_a)}_a();})();
//# sourceMappingURL=page.js.map
