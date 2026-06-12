(()=>{var $t=class f extends Array{static newListWith(...t){let e=new f;return e.push(...t),e}clear(){this.splice(0,this.length)}clone(){return f.newListWith(...this)}distinct(){return f.newListWith(...new Set(this))}equals(t){if(this===t)return!0;if(!t||this.length!==t.length)return!1;for(let e=0;e<this.length;++e)if(this[e]!==t[e])return!1;return!0}remove(t){let e=this.indexOf(t);if(e!==-1)return this.splice(e,1)[0]}replace(t,e){let o=this.indexOf(t);if(o!==-1){let c=this[o];return this[o]=e,c}}toString(){return`[${super.join(", ")}]`}};var A=class extends Error{mTarget;get target(){return this.mTarget}constructor(t,e,o){super(t,o),this.mTarget=e}};var k=class f extends Map{add(t,e){if(!this.has(t))this.set(t,e);else throw new A("Can't add duplicate key to dictionary.",this)}clone(){return new f(this)}getAllKeysOfValue(t){return[...this.entries()].filter(c=>c[1]===t).map(c=>c[0])}getOrDefault(t,e){let o=this.get(t);return typeof o<"u"?o:e}map(t){let e=new $t;for(let o of this){let c=t(o[0],o[1]);e.push(c)}return e}};var Ct=class f{mSize;mTopItem;get size(){return this.mSize}get top(){if(this.mTopItem)return this.mTopItem.value}constructor(){this.mTopItem=null,this.mSize=0}clone(){let t=new f;return t.mTopItem=this.mTopItem,t.mSize=this.mSize,t}*entries(){let t=this.mTopItem;for(;t!==null;)yield t.value,t=t.previous}flush(){let t=new Array;for(;this.mTopItem;)t.push(this.pop());return t}pop(){if(!this.mTopItem)return;let t=this.mTopItem.value;return this.mTopItem=this.mTopItem.previous,this.mSize--,t}push(t){let e={previous:this.mTopItem,value:t};this.mTopItem=e,this.mSize++}toArray(){return[...this.entries()]}};var ee=class{mCompareFunction;constructor(t){this.mCompareFunction=t}differencesOf(t,e){let o;if(t.length===0||e.length===0){if(o=new Array,t.length===0)for(let P=0;P<e.length;P++)o.push({changeState:Tt.Insert,item:e[P]});else for(let P=0;P<t.length;P++)o.push({changeState:Tt.Remove,item:t[P]});return o}let c={1:{x:0,history:[]}},p=P=>P-1,v=t.length,b=e.length,I;for(let P=0;P<v+b+1;P++)for(let a=-P;a<P+1;a+=2){let n=a===-P||a!==P&&c[a-1].x<c[a+1].x;if(n){let l=c[a+1];I=l.x,o=l.history}else{let l=c[a-1];I=l.x+1,o=l.history}o=o.slice();let u=I-a;for(1<=u&&u<=b&&n?o.push({changeState:Tt.Insert,item:e[p(u)]}):1<=I&&I<=v&&o.push({changeState:Tt.Remove,item:t[p(I)]});I<v&&u<b&&this.mCompareFunction(t[p(I+1)],e[p(u+1)]);)I+=1,u+=1,o.push({changeState:Tt.Keep,item:t[p(I)]});if(I>=v&&u>=b)return o;c[a]={x:I,history:o}}return new Array}},Tt=function(f){return f[f.Remove=1]="Remove",f[f.Insert=2]="Insert",f[f.Keep=3]="Keep",f}({});var re=class{mLabel;mId;mPortType;mDataType;mRegions;get label(){return this.mLabel}get id(){return this.mId}get portType(){return this.mPortType}get dataType(){return this.mDataType}get regions(){return this.mRegions}constructor(t){this.mLabel=t.label,this.mId=t.id,this.mPortType=t.portType,t.portType==="value"?this.mDataType=t.dataType:this.mDataType=null,this.mRegions={add:t.regions?.add??new Array}}};var mt=class{mId;mCategory;mLabel;mRegions;mCodeGenerator;mPortProvider;get id(){return this.mId}get category(){return this.mCategory}get inputs(){let t=!1,e=[];return this.mPortProvider.inputs(o=>{if(e.push(new re(o)),o.portType==="flow"){if(t)throw new A(`Node definition ${this.id} has multiple input flow ports, which is not allowed.`,this);t=!0}}),e}get label(){return this.mLabel}get outputs(){let t=[];return this.mPortProvider.outputs(e=>{t.push(new re(e))}),t}get regions(){return this.mRegions}get codeGenerator(){return this.mCodeGenerator}getPort(t){return[...this.inputs,...this.outputs].find(e=>e.id===t)}constructor(t){this.mId=t.id,this.mLabel=t.label,this.mCategory=t.category,this.mCodeGenerator=t.generators.code,this.mPortProvider=t.generators.ports,this.mRegions={add:t.regions?.add??new Array,allows:t.regions?.allows??new Array,requires:t.regions?.requires??new Array}}};var Vt=class extends mt{mFunction;get function(){return this.mFunction}get label(){return this.mFunction.label}constructor(t){let e=(c,p)=>v=>{v({label:c,id:c,portType:"flow"});for(let b of p)v({label:b.label,id:b.label,portType:"value",dataType:b.dataType})},o=t.project.getFunction(t.definitionId);super({id:`USERFUNCTION_${t.id}`,label:t.label,category:"user function",generators:{ports:{inputs:e("Input",t.inputs),outputs:e("Output",t.outputs)},code:c=>o?o.codeGenerator.value({function:t,inputs:c.inputs,outputs:c.outputs,code:c.code}):""}}),this.mFunction=t}};var ft=class{mLabel;mConnectedPorts;mDefinitionId;mDirection;mDirectValue;mDocument;mNode;mPortType;mProject;mDataType;get connectedPorts(){return this.mConnectedPorts}get direction(){return this.mDirection}get directValue(){return this.mDirectValue}get definitionId(){return this.mDefinitionId}get document(){return this.mDocument}get label(){return this.mLabel}set label(t){this.mLabel=t}get node(){return this.mNode}get portType(){return this.mPortType}get project(){return this.mProject}get dataType(){return this.mDataType}get resolvedDataType(){if(this.mPortType!=="value")throw new A("Port data type couldn't be resolved as it is no value port.",this);if(!this.mProject.types.isGenericType(this.mDataType??""))return this.mDataType;if(this.mDirection==="output"){let e=this.mNode.inputs.value.find(o=>o.dataType===this.mDataType);if(!e)throw new A("Port type couldn't be resolved as it has no resolving sibling port",this);return e.resolvedDataType}if(this.mConnectedPorts.size===0)throw new A("Port type couldn't be resolved as it has no resolving input port",this);return this.mConnectedPorts.values().next().value.resolvedDataType}constructor(t,e,o){if(o.portType==="flow"&&o.dataType!==null)throw new A("Flow ports cannot have a value type.",this);if(o.portType==="value"&&o.dataType===null)throw new A("Value ports must have a value type.",this);this.mProject=t,this.mDocument=e,this.mNode=o.node,this.mDefinitionId=o.definitionId,this.mLabel=o.label,this.mDataType=o.dataType,this.mDirection=o.direction,this.mPortType=o.portType,this.mConnectedPorts=new Set,this.mDirectValue=new Array,o.dataType&&!this.mProject.types.isGenericType(o.dataType)&&this.mDirectValue.push(...t.types.getType(o.dataType).default.string)}connect(t){if(this.mConnectedPorts.has(t))return;if(this.mPortType!==t.portType)throw new A(`Cannot connect port ${this.mDefinitionId} of node ${this.mNode.label} to port ${t.mDefinitionId} of node ${t.node.label} due to incompatible port types.`,this);if(this.mDirection===t.direction)throw new A(`Cannot connect port ${this.mDefinitionId} of node ${this.mNode.label} to port ${t.mDefinitionId} of node ${t.node.label} due to incompatible directions.`,this);if(!(this.mPortType==="flow"&&this.mDirection==="input"||this.mPortType==="value"&&this.mDirection==="output"))for(let o of Array.from(this.mConnectedPorts))this.disconnect(o);this.mConnectedPorts.add(t),t.connect(this)}disconnect(t){this.mConnectedPorts.has(t)&&(this.mConnectedPorts.delete(t),t.disconnect(this))}setDirectValue(t){if(this.mPortType!=="value")throw new A("Only value ports can have a direct value.",this);if(this.mProject.types.isGenericType(this.mDataType))throw new A("Generic value ports cannot have a direct value.",this);if(t.length!==this.mProject.types.getType(this.mDataType).default.string.length)throw new A("The provided value does not match the expected length of the default value for this port's type.",this);this.mDirectValue.splice(0,this.mDirectValue.length),this.mDirectValue.push(...t)}validate(){let t=new Array;if(this.mDirection==="output"){if(this.mPortType==="flow"&&this.mConnectedPorts.size>1&&t.push(new W(`Flow output port "${this.mDefinitionId}" on node "${this.mNode.label}" can only have one connection.`,this)),this.mPortType==="value"&&this.mProject.types.isGenericType(this.mDataType??"")){let e=this.mNode.inputs.value.filter(o=>o.dataType===this.mDataType);for(let o of e)o.connectedPorts.size===0&&t.push(new W(`Generic output port "${this.mDefinitionId}" on node "${this.mNode.label}" cannot resolve generic type "${this.mDataType}" because its input port "${o.definitionId}" is not connected.`,this))}return t}if(this.mDirection==="input"){if(this.mPortType==="flow")return this.mConnectedPorts.size===0&&t.push(new W(`Flow input port "${this.mDefinitionId}" on node "${this.mNode.label}" must have at least one connection.`,this)),t;if(this.mPortType==="value"){this.mConnectedPorts.size>1&&t.push(new W(`Value input port "${this.mDefinitionId}" on node "${this.mNode.label}" can only have one connection.`,this));for(let e of this.mConnectedPorts)e.resolvedDataType!==this.resolvedDataType&&t.push(new W(`Value input port "${this.mDefinitionId}" on node "${this.mNode.label}" expects type "${this.resolvedDataType}" but is connected to type "${e.resolvedDataType}".`,this));return t}}return t}};var bt=class{mCategory;mDefinitionId;mDocument;mFunction;mInputs;mLabel;mOutputs;mPreview;mTransformation;mProject;get definitionId(){return this.mDefinitionId}get document(){return this.mDocument}get function(){return this.mFunction}get inputs(){return this.mInputs}get outputs(){return this.mOutputs}get project(){return this.mProject}get transformation(){return this.mTransformation}get category(){return this.mCategory}get label(){return this.mLabel}set label(t){this.mLabel=t}get preview(){return this.mPreview}set preview(t){this.mPreview=t}get hasFlowPorts(){return this.mOutputs.flow.length>0||this.mInputs.flow.length>0}get hasValuePorts(){return this.mOutputs.value.length>0||this.mInputs.value.length>0}constructor(t,e,o,c){this.mCategory=c.category,this.mDocument=e,this.mDefinitionId=c.definitionId,this.mFunction=o,this.mLabel=c.label,this.mPreview=c.preview??null,this.mProject=t,this.mTransformation=c.transformation;let p=(v,b)=>{let I={direction:b,list:new Array,map:new Map,flow:new Array,value:new Array};for(let P of v){let a=new ft(this.mProject,this.mDocument,{definitionId:P.definitionId,direction:b,label:P.label,node:this,portType:P.portType,dataType:P.dataType});I.list.push(a),I.map.set(a.definitionId,a),(a.portType==="flow"?I.flow:I.value).push(a)}return I};this.mInputs=p(c.ports.input,"input"),this.mOutputs=p(c.ports.output,"output")}moveTo(t,e){this.mTransformation.x=t,this.mTransformation.y=e}resizeTo(t,e){this.mTransformation.width=Math.max(4,t),this.mTransformation.height=Math.max(4,e)}validate(t){let e=new Array,o=this.mFunction.nodeDefinitions.find(c=>c.id===this.mDefinitionId);if(!o)e.push(new W(`Node "${this.mLabel}" definition "${this.mDefinitionId}" could not be found.`,this));else{e.push(...this.resyncPorts(this.mInputs,o.inputs)),e.push(...this.resyncPorts(this.mOutputs,o.outputs));let c=new Set([...o.regions.requires,...o.regions.allows]);if(c.size>0)for(let p of t)c.has(p)||e.push(new W(`Node "${this.mLabel}" does not allow region "${p}".`,this));if(o.regions.requires.length>0)for(let p of o.regions.requires)t.has(p)||e.push(new W(`Node "${this.mLabel}" requires region "${p}" but it is not active.`,this))}for(let c of[...this.mInputs.list,...this.mOutputs.list])e.push(...c.validate());return e}resyncPorts(t,e){let o=new Array,c=new Set(e.map(p=>p.id));for(let p=0;p<e.length;p++){let v=e[p];if(!t.map.has(v.id)){this.addPort(t,v,p);continue}let b=t.map.get(v.id),I=b.portType!==v.portType,P=b.dataType!==v.dataType;if(!(!I&&!P)){if(b.connectedPorts.size>0&&I){o.push(new W(`Port "${b.label}" on node "${this.mLabel}" has a changed type.`,b));continue}this.replacePort(t,b,v)}}for(let p of t.list)if(!c.has(p.definitionId)){if(p.connectedPorts.size===0){this.removePort(t,p);continue}o.push(new W(`Port "${p.label}" on node "${this.mLabel}" no longer exists in its definition.`,p))}return o}addPort(t,e,o){let c=new ft(this.mProject,this.mDocument,{definitionId:e.id,direction:t.direction,label:e.label,node:this,portType:e.portType,dataType:e.dataType});return t.list.splice(o,0,c),t.map.set(c.definitionId,c),(c.portType==="flow"?t.flow:t.value).push(c),c}removePort(t,e){let o=t.list.indexOf(e);if(o===-1)throw new A(`Port "${e.label}" was not found and can not be removed.`,this);t.list.splice(o,1),t.map.delete(e.definitionId);let c=e.portType==="flow"?t.flow:t.value,p=c.indexOf(e);if(o===-1)throw new A(`Port "${e.label}" was not found in typed list and can not be removed.`,this);return c.splice(p,1),o}replacePort(t,e,o){let c=Array.from(e.connectedPorts);for(let b of Array.from(e.connectedPorts))e.disconnect(b);let p=this.removePort(t,e),v=this.addPort(t,o,p);for(let b of c)v.connect(b);return v}};var wt=class{mLabel;mDefinitionId;mDocument;mId;mImports;mInputs;mIsSystem;mNodes;mOutputs;mProject;get id(){return this.mId}get definitionId(){return this.mDefinitionId}get document(){return this.mDocument}get nodes(){return this.mNodes}get nodeDefinitions(){let t=this.mProject.getFunction(this.definitionId);if(!t)return[...this.mDocument.nodeDefinitions];let e=t.getNodeDefinitions(this);return[...this.mDocument.nodeDefinitions,...e.entry,...e.exit,...e.dynamic]}get imports(){return this.mImports}get inputs(){return this.mInputs}get label(){return this.mLabel}set label(t){this.mLabel=t}get outputs(){return this.mOutputs}get isSystem(){return this.mIsSystem}get project(){return this.mProject}constructor(t,e,o){this.mProject=t,this.mDocument=e,this.mLabel=o.label,this.mIsSystem=o.isSystem,this.mDefinitionId=o.definitionId,this.mId=o.id,this.mNodes=new Set,this.mInputs=new Array,this.mOutputs=new Array,this.mImports=new Array}addImport(t){this.mImports.includes(t)||this.mImports.push(t)}addInput(t){this.mInputs.some(e=>e.label===t.label)||this.mInputs.push(t)}addOutput(t){this.mOutputs.some(e=>e.label===t.label)||this.mOutputs.push(t)}addNode(t){this.mNodes.add(t)}addNodeByDefinition(t,e){let o=p=>({definitionId:p.id,label:p.label,portType:p.portType,dataType:p.dataType}),c=new bt(this.mProject,this.mDocument,this,{category:t.category,definitionId:t.id,ports:{input:t.inputs.map(o),output:t.outputs.map(o)},label:t.label,transformation:e});return this.mNodes.add(c),c}getExitNodes(){let t=this.mProject.getFunction(this.mDefinitionId);if(!t)throw new A(`Function definition not found for function "${this.mLabel}".`,this);let e=new Set(t.getNodeDefinitions(this).exit.map(o=>o.id));return[...this.mNodes].filter(o=>e.has(o.definitionId))}removeNode(t){for(let e of[...t.inputs.list,...t.outputs.list])for(let o of Array.from(e.connectedPorts))e.disconnect(o);this.mNodes.delete(t)}removeImport(t){let e=this.mImports.indexOf(t);e!==-1&&this.mImports.splice(e,1)}removeInput(t){let e=this.mInputs.findIndex(o=>o.label===t.label);e!==-1&&this.mInputs.splice(e,1)}removeOutput(t){let e=this.mOutputs.findIndex(o=>o.label===t.label);e!==-1&&this.mOutputs.splice(e,1)}validate(){let t=[],e=this.mProject.getFunction(this.mDefinitionId);e||t.push(new W(`Function "${this.mLabel}" definition "${this.mDefinitionId}" could not be found.`,this));let o=e?.getNodeDefinitions(this);o&&this.resyncFunction(o);let c=new Map,p=new Map;for(let I of this.mNodes)p.set(I,this.accumulateRegions(I,c,new Set,t));let v=new Set(o?.entry.map(I=>I.id)??new Array),b=new Map;for(let I of this.mNodes)t.push(...I.validate(p.get(I))),this.accumulateEntryDomains(I,v,b).size>1&&t.push(new W(`Node "${I.label}" is reachable from multiple entry nodes.`,I));return t}accumulateRegions(t,e,o,c){if(e.has(t))return e.get(t);if(o.has(t))return c.push(new W(`Node "${t.label}" is part of a connection cycle.`,t)),new Set;o.add(t);let p=new Set;for(let v of t.inputs.list)for(let b of v.connectedPorts){let I=b.node,P=this.accumulateRegions(I,e,o,c);for(let n of P)p.add(n);let a=this.nodeDefinitions.find(n=>n.id===I.definitionId);if(a){for(let u of a.regions.add)p.add(u);let n=a.getPort(b.definitionId);if(n)for(let u of n.regions.add)p.add(u)}}return e.set(t,p),p}accumulateEntryDomains(t,e,o){if(o.has(t))return o.get(t);let c=new Set;o.set(t,c);for(let p of t.inputs.list)for(let v of p.connectedPorts){let b=v.node;e.has(b.definitionId)&&c.add(b);for(let I of this.accumulateEntryDomains(b,e,o))c.add(I)}return c}resyncFunction(t){let e=[...t.entry,...t.exit],o=new Set(this.mNodes.values().map(v=>v.definitionId)),c=0,p=20;for(let v of e)o.has(v.id)||(this.addNodeByDefinition(v,{x:Math.floor(c/(e.length/2))*p+2,y:c*p+2-Math.floor(c/(e.length/2))*(e.length/2*p),width:0,height:0}),c++)}};var Mt=class{mFunctions;mFunctionNodeDefinitions;mProject;get functions(){return this.mFunctions}get nodeDefinitions(){return[...this.mFunctionNodeDefinitions.values(),...this.mProject.nodeDefinitions.values()]}get project(){return this.mProject}constructor(t){this.mProject=t,this.mFunctions=new Set,this.mFunctionNodeDefinitions=new Map}addFunction(t){this.mFunctions.add(t);let e=new Vt(t);this.mFunctionNodeDefinitions.set(e.id,e)}newFunction(t){let e=new wt(this.mProject,this,t);this.mFunctions.add(e);let o=new Vt(e);return this.mFunctionNodeDefinitions.set(o.id,o),e}removeFunction(t){if(!this.mFunctions.has(t))return!1;if(t.isSystem)throw new A("Cannot remove a system function.",this);this.mFunctions.delete(t);let e=this.mFunctionNodeDefinitions.values().find(o=>o.function===t);return e&&this.mFunctionNodeDefinitions.delete(e.id),!0}validate(){let t=[],e=this.mProject.entryPoint.id;this.mFunctions.values().some(o=>o.definitionId===e)||this.newFunction({definitionId:e,id:crypto.randomUUID(),isSystem:!0,label:this.mProject.entryPoint.label});for(let o of this.mFunctions)t.push(...o.validate());return t.push(...this.detectCrossFunctionRecursion()),t}detectCrossFunctionRecursion(){let t=[],e=new Map,o=b=>{if(!e.has(b)){let I=new Set;for(let P of b.nodes)this.mFunctionNodeDefinitions.has(P.definitionId)&&I.add(this.mFunctionNodeDefinitions.get(P.definitionId).function);e.set(b,I)}return e.get(b)},c=new Set,p=new Set,v=b=>{if(!c.has(b)){if(p.has(b)){t.push(new W(`Function "${b.label}" participates in a cross-function recursion cycle.`,b));return}p.add(b);for(let I of o(b))v(I);p.delete(b),c.add(b)}};for(let b of this.mFunctions)v(b);return t}},W=class{mMessage;mItem;get message(){return this.mMessage}get item(){return this.mItem}constructor(t,e){this.mMessage=t,this.mItem=e}};var st=class f{static mComponents=new WeakMap;static mConstructorSelector=new WeakMap;static mElements=new WeakMap;static ofComponent(t){let e=t.processorConstructor,o=f.mConstructorSelector.get(e);if(!o)throw new A(`Constructor "${e.name}" is not a registered custom element`,e);let c=f.mElements.get(t);if(!c)throw new A(`Component "${t}" is not a registered component`,t);return{selector:o,constructor:e,element:c,component:t,processor:t.processor}}static ofConstructor(t){let e=f.mConstructorSelector.get(t);if(!e)throw new A(`Constructor "${t.name}" is not a registered custom element`,t);let o=globalThis.customElements.get(e);if(!o)throw new A(`Constructor "${t.name}" is not a registered custom element`,t);return{selector:e,constructor:t,elementConstructor:o}}static ofElement(t){let e=f.mComponents.get(t);if(!e)throw new A(`Element "${t}" is not a PwbComponent.`,t);return f.ofComponent(e)}static ofProcessor(t){let e=f.mComponents.get(t);if(!e)throw new A("Processor is not a PwbComponent.",t);return f.ofComponent(e)}static registerComponent(t,e,o){f.mComponents.has(e)||f.mComponents.set(e,t),o&&!f.mComponents.has(o)&&f.mComponents.set(o,t),f.mElements.has(t)||f.mElements.set(t,e)}static registerConstructor(t,e){t&&!f.mConstructorSelector.has(t)&&f.mConstructorSelector.set(t,e)}};var oe=class f{static CONFIGURATION_ATTACHMENT=Symbol("PwbApplicationConfigurationAttachment");static new(t,e){let o=new f;t(o),e&&o.appendTo(e)}mContent;mElement;constructor(){this.mContent=new Array,this.mElement=document.createElement("div"),this.mElement.attachShadow({mode:"open"})}addContent(t){let e=st.ofConstructor(t).elementConstructor,o=st.ofElement(new e);return this.mContent.push(o.component),this.mElement.shadowRoot.appendChild(o.element),o.processor}addStyle(t){let e=document.createElement("style");e.textContent=t,this.mElement.shadowRoot.prepend(e)}appendTo(t){t.appendChild(this.mElement)}};var Xt=class{mCustomMetadata;constructor(){this.mCustomMetadata=new Map}getMetadata(t){return this.mCustomMetadata.get(t)??null}setMetadata(t,e){this.mCustomMetadata.set(t,e)}};var ne=class extends Xt{};var ie=class f extends Xt{static mPrivateMetadataKey=Symbol("Metadata");mDecoratorMetadataObject;mPropertyMetadata;constructor(t){super(),this.mDecoratorMetadataObject=t,this.mPropertyMetadata=new Map,t[f.mPrivateMetadataKey]=this}getInheritedMetadata(t){let e=new Array,o=this.mDecoratorMetadataObject;do{if(Object.hasOwn(o,f.mPrivateMetadataKey)){let p=o[f.mPrivateMetadataKey].getMetadata(t);p!==null&&e.push(p)}o=Object.getPrototypeOf(o)}while(o!==null);return e.reverse()}getProperty(t){return this.mPropertyMetadata.has(t)||this.mPropertyMetadata.set(t,new ne),this.mPropertyMetadata.get(t)}};Symbol.metadata??=Symbol("Symbol.metadata");var rt=class f{static mMetadataMapping=new Map;static add(t,e){return(o,c)=>{let p=f.forInternalDecorator(c.metadata);switch(c.kind){case"class":p.setMetadata(t,e);return;case"method":case"field":case"getter":case"setter":case"accessor":if(c.static)throw new Error("@Metadata.add not supported for statics.");p.getProperty(c.name).setMetadata(t,e);return}}}static forInternalDecorator(t){return f.mapMetadata(t)}static get(t){Object.hasOwn(t,Symbol.metadata)||f.polyfillMissingMetadata(t);let e=t[Symbol.metadata];return f.mapMetadata(e)}static init(){return(t,e)=>{f.forInternalDecorator(e.metadata)}}static mapMetadata(t){if(f.mMetadataMapping.has(t))return f.mMetadataMapping.get(t);let e=new ie(t);return f.mMetadataMapping.set(t,e),e}static polyfillMissingMetadata(t){let e=new Array,o=t;do e.push(o),o=Object.getPrototypeOf(o);while(o!==null);for(let c=e.length-1;c>=0;c--){let p=e[c];if(!Object.hasOwn(p,Symbol.metadata)){let v=null;c<e.length-2&&(v=e[c+1][Symbol.metadata]),p[Symbol.metadata]=Object.create(v,{})}}}};var O=class f{static mCurrentInjectionContext=null;static mInjectMode=new Map;static mInjectableConstructor=new Map;static mInjectableReplacement=new Map;static mInjectionConstructorIdentificationMetadataKey=Symbol("InjectionConstructorIdentification");static mSingletonMapping=new Map;static createObject(t,e,o){let[c,p]=typeof e=="object"&&e!==null?[!1,e]:[!!e,o??new Map],v=f.getInjectionIdentification(t);if(!f.mInjectableConstructor.has(v))throw new A(`Constructor "${t.name}" is not registered for injection and can not be built`,f);let b=c?"instanced":f.mInjectMode.get(v),I=new Map(p.entries().map(([n,u])=>[f.getInjectionIdentification(n),u])),P=f.mCurrentInjectionContext,a=new Map([...P?.localInjections.entries()??[],...I.entries()]);f.mCurrentInjectionContext={injectionMode:b,localInjections:a};try{if(!c&&b==="singleton"&&f.mSingletonMapping.has(v))return f.mSingletonMapping.get(v);let n=new t;return b==="singleton"&&!f.mSingletonMapping.has(v)&&f.mSingletonMapping.set(v,n),n}finally{f.mCurrentInjectionContext=P}}static injectable(t="instanced"){return(e,o)=>{f.registerInjectable(e,o.metadata,t)}}static registerInjectable(t,e,o){let c=f.getInjectionIdentification(t,e);f.mInjectableConstructor.set(c,t),f.mInjectMode.set(c,o)}static replaceInjectable(t,e){let o=f.getInjectionIdentification(t);if(!f.mInjectableConstructor.has(o))throw new A("Original constructor is not registered.",f);let c=f.getInjectionIdentification(e);if(!f.mInjectableConstructor.has(c))throw new A("Replacement constructor is not registered.",f);f.mInjectableReplacement.set(o,e)}static use(t){if(f.mCurrentInjectionContext===null)throw new A("Can't create object outside of an injection context.",f);let e=f.getInjectionIdentification(t);if(f.mCurrentInjectionContext.injectionMode!=="singleton"&&f.mCurrentInjectionContext.localInjections.has(e))return f.mCurrentInjectionContext.localInjections.get(e);let o=f.mInjectableReplacement.get(e);if(o||(o=f.mInjectableConstructor.get(e)),!o)throw new A(`Constructor "${t.name}" is not registered for injection and can not be built`,f);return f.createObject(o)}static getInjectionIdentification(t,e){let o=e?rt.forInternalDecorator(e):rt.get(t),c=o.getMetadata(f.mInjectionConstructorIdentificationMetadataKey);return c||(c=Symbol(t.name),o.setMetadata(f.mInjectionConstructorIdentificationMetadataKey,c)),c}};var X=function(f){return f[f.Read=1]="Read",f[f.ReadWrite=2]="ReadWrite",f[f.Write=3]="Write",f}({});var Et=class{mHooks;mInjections;mProcessor;mProcessorConstructor;get processor(){if(!this.mProcessor)throw new A("Processor is not created yet. Call setup to create processor.",this);return this.mProcessor}get processorConstructor(){return this.mProcessorConstructor}constructor(t){if(this.mProcessorConstructor=t.constructor,this.mProcessor=null,this.mInjections=new Map,this.mHooks={create:new Array},t.parent)for(let[e,o]of t.parent.mInjections.entries())this.setProcessorInjection(e,o)}call(t,...e){let o=Reflect.get(this.processor,t);return typeof o!="function"?null:o.apply(this.processor,e)}deconstruct(){}getProcessorInjection(t){return this.mInjections.get(t)}setProcessorInjection(t,e){if(this.mProcessor)throw new A("Cant add injections to after construction.",this);this.mInjections.set(t,e)}setup(){return this.mProcessor=this.createProcessor(),this}addConstructionHook(t){return this.mHooks.create.push(t),this}createProcessor(){let t=O.createObject(this.mProcessorConstructor,this.mInjections),e;for(;e=this.mHooks.create.pop();){let o=e.call(this,t);o&&(t=o)}return t}};var Nt=class f extends Et{constructor(t,e){super({constructor:t,parent:e}),this.setProcessorInjection(f,this)}deconstruct(){this.call("onDeconstruct"),super.deconstruct()}setup(){return super.setup(),this.call("onExecute"),this}onUpdate(){return!1}};var er=class f{static mInstance;mCoreEntityConstructor;mProcessorConstructorConfiguration;constructor(){if(f.mInstance)return f.mInstance;f.mInstance=this,this.mCoreEntityConstructor=new Map,this.mProcessorConstructorConfiguration=new Map}get(t){let e=this.mCoreEntityConstructor.get(t);if(!e)return new Array;let o=new Array;for(let c of e)o.push({processorConstructor:c,processorConfiguration:this.mProcessorConstructorConfiguration.get(c)});return o}register(t,e,o){this.mProcessorConstructorConfiguration.set(e,o);let c=t;do{if(!(c.prototype instanceof Et)&&c!==Et)break;this.mCoreEntityConstructor.has(c)||this.mCoreEntityConstructor.set(c,new Set),this.mCoreEntityConstructor.get(c).add(e)}while(c=Object.getPrototypeOf(c))}},at=new er;var Yt=class f extends Et{static mExtensionCache=new WeakMap;mExtensionList;constructor(t){super(t),this.mExtensionList=new Array}deconstruct(){for(let t of this.mExtensionList)t.deconstruct();super.deconstruct()}setup(){return super.setup(),this.executeExtensions(),this}executeExtensions(){let t=(()=>{if(!f.mExtensionCache.has(this.processorConstructor)){let c=at.get(Nt).filter(v=>{for(let b of v.processorConfiguration.targetRestrictions)if(this instanceof b||this.processorConstructor.prototype instanceof b||this.processorConstructor===b)return!0;return!1}),p={read:c.filter(v=>v.processorConfiguration.access===X.Read),write:c.filter(v=>v.processorConfiguration.access===X.Write),readWrite:c.filter(v=>v.processorConfiguration.access===X.ReadWrite)};f.mExtensionCache.set(this.processorConstructor,p)}return f.mExtensionCache.get(this.processorConstructor)})(),e=[...t.write,...t.readWrite,...t.read];for(let o of e)this.mExtensionList.push(new Nt(o.processorConstructor,this).setup())}};var At=class{mData;mInteractionType;mOrigin;get data(){return this.mData}get origin(){return this.mOrigin}get triggerType(){return this.mInteractionType}constructor(t,e,o){this.mInteractionType=t,this.mData=o,this.mOrigin=e}};var Lt=class f{static mCurrentZone=new f("Default");static get current(){return f.mCurrentZone}static create(t){return new f(t)}mInteractionListener;mName;mTriggerFilterBitmap;get name(){return this.mName}constructor(t){this.mName=t,this.mTriggerFilterBitmap=-1,this.mInteractionListener=new Map}addInteractionListener(t){return this.mInteractionListener.set(t,f.current),this}setTriggerRestriction(t){return this.mTriggerFilterBitmap=t,this}execute(t,...e){let o=f.mCurrentZone;f.mCurrentZone=this;try{return t(...e)}finally{f.mCurrentZone=o}}pushInteraction(t,e){if((this.mTriggerFilterBitmap&t)===0)return!1;if(this.mInteractionListener.size===0)return!0;let o=new At(t,this,e);for(let[c,p]of this.mInteractionListener.entries())p.execute(()=>{c.call(this,o)});return!0}removeInteractionListener(t){return t?(this.mInteractionListener.delete(t),this):(this.mInteractionListener.clear(),this)}};var U={get:1,set:2,manual:4};var be=class f{static ORIGINAL_TO_INTERACTION_MAPPING=new WeakMap;static PROXY_TO_ORIGINAL_MAPPING=new WeakMap;static UNTRACEABLE_FUNCTION_UPDATE_TRIGGER=(()=>{let t=new WeakMap;return t.set(Array.prototype.fill,U.set),t.set(Array.prototype.pop,U.get),t.set(Array.prototype.push,U.set),t.set(Array.prototype.shift,U.get),t.set(Array.prototype.unshift,U.set),t.set(Array.prototype.splice,U.set),t.set(Array.prototype.reverse,U.set),t.set(Array.prototype.sort,U.set),t.set(Array.prototype.concat,U.set),t.set(Map.prototype.clear,U.set),t.set(Map.prototype.delete,U.set),t.set(Map.prototype.set,U.set),t.set(Set.prototype.clear,U.set),t.set(Set.prototype.delete,U.set),t.set(Set.prototype.add,U.set),t})();static getOriginal(t){return f.PROXY_TO_ORIGINAL_MAPPING.get(t)??t}static getWrapper(t){let e=f.getOriginal(t);return f.ORIGINAL_TO_INTERACTION_MAPPING.get(e)}mProxyObject;mStateChangeCallback;get proxy(){return this.mProxyObject}constructor(t,e){let o=f.getWrapper(t);if(o)return o;this.mProxyObject=this.createProxyObject(t),this.mStateChangeCallback=e,f.PROXY_TO_ORIGINAL_MAPPING.set(this.mProxyObject,t),f.ORIGINAL_TO_INTERACTION_MAPPING.set(t,this)}convertToProxy(t){return t===null||typeof t!="object"&&typeof t!="function"?t:new f(t,this.mStateChangeCallback).proxy}createProxyObject(t){let e=(c,p,v)=>{let b=f.getOriginal(p);try{let I=c.call(b,...v);return this.convertToProxy(I)}finally{if(f.UNTRACEABLE_FUNCTION_UPDATE_TRIGGER.has(c)){let I=f.getWrapper(p);I&&I.dispatch(f.UNTRACEABLE_FUNCTION_UPDATE_TRIGGER.get(c))}}};return new Proxy(t,{apply:(c,p,v)=>{let b=c;try{let I=b.call(p,...v);return this.convertToProxy(I)}catch(I){if(!(I instanceof TypeError))throw I;return e(b,p,v)}},set:(c,p,v)=>{try{let b=v;return(b!==null&&typeof b=="object"||typeof b=="function")&&(b=f.getOriginal(b)),Reflect.set(c,p,b)}finally{this.dispatch(U.set)}},get:(c,p,v)=>{try{return this.convertToProxy(Reflect.get(c,p))}finally{this.dispatch(U.get)}},deleteProperty:(c,p)=>{try{return delete c[p]}finally{this.dispatch(U.set)}}})}dispatch(t){this.mStateChangeCallback(t)}};var z=class f{static reaction(t){let e=Lt.create("ComponentState reaction");e.addInteractionListener(o=>{(o.triggerType&U.set)!==0&&t()}),e.execute(()=>{t()})}static state(t){return(e,o)=>{if(o.static)throw new A("Event target is not for a static property.",f);let c=new WeakMap,p=(v,b)=>{c.set(v,new f(b,t))};return{init(v){return typeof v>"u"||p(this,v),v},set(v){c.has(this)?c.get(this).set(v):p(this,v)},get(){return c.has(this)||p(this,void 0),c.get(this).get()}}}}mLinkedZones;mLinkedZonesArray;mConfiguration;mValue;constructor(t,e){if(this.mLinkedZones=new Set,this.mLinkedZonesArray=new Array,this.mConfiguration={complexValue:e?.complexValue??!1,proxy:e?.proxy??!1},this.mConfiguration.proxy){if(typeof t!="object"||t===null)throw new A("Proxied component state value must be an object.",this);this.mValue=new be(t,o=>{switch(o){case U.set:return this.dispatchChange();case U.get:return this.linkCurrentZone()}}).proxy}else this.mValue=t}get(){return this.linkCurrentZone(),this.mValue}set(t){if(this.mConfiguration.proxy)throw new A("Proxy is not implemented yet.",this);!this.mConfiguration.complexValue&&this.mValue===t||(this.mValue=t,this.dispatchChange())}dispatchChange(){for(let t of this.mLinkedZonesArray)t.pushInteraction(U.set,this)}linkCurrentZone(){let t=Lt.current;this.mLinkedZones.has(t)||(this.mLinkedZones.add(t),this.mLinkedZonesArray.push(t))}};var Rt=class f{static mCurrentUpdateCycle=null;static openResheduledCycle(t,e){let o=!1;if(!f.mCurrentUpdateCycle){let c=performance.now();f.mCurrentUpdateCycle={initiator:t.initiator,startTime:c,forcedSync:t.forcedSync,runner:t.runner},o=!0}try{return e(f.mCurrentUpdateCycle)}finally{o&&(f.mCurrentUpdateCycle=null)}}static openUpdateCycle(t,e){let o=!1;if(!f.mCurrentUpdateCycle){let c=performance.now();f.mCurrentUpdateCycle={initiator:t.updater,startTime:c,forcedSync:t.runSync,runner:Symbol("Runner "+c)},o=!0}try{return e(f.mCurrentUpdateCycle)}finally{o&&(f.mCurrentUpdateCycle=null)}}static updateCycleRunId(t,e){if(t.initiator===e){let o=performance.now(),c=t;c.runner=Symbol("Runner "+o)}}static updateCyleStartTime(t){let e=performance.now(),o=t;o.startTime=e}};var we=class extends Error{mChain;get chain(){return this.mChain}constructor(t,e){let o=e.slice(-20).map(c=>c.toString()).join(`
`);super(`${t}: 
${o}`),this.mChain=[...e]}};var xe=class f{static mStackCap=100;static mFrameTime=100;static get stackCap(){return f.mStackCap}static set stackCap(t){f.mStackCap=t}static get frameTime(){return f.mFrameTime}static set frameTime(t){f.mFrameTime=t}mInteractionZone;mUpdateFunction;mUpdateRunCache;mUpdateStates;mManualComponentState;get zone(){return this.mInteractionZone}constructor(t){this.mUpdateRunCache=new WeakMap,this.mUpdateFunction=t.onUpdate,this.mManualComponentState=new z(Symbol("Manual Update")),this.mUpdateStates={chainCompleteHooks:new Ct,async:{hasSheduledTask:!1,hasRunningTask:!1,sheduledTaskIsResheduled:!1},sync:{running:!1},cycle:{chainedTask:null}},this.mInteractionZone=Lt.create("Update-Zone"),this.mInteractionZone.addInteractionListener(e=>{(e.triggerType&U.set)!==0&&this.runUpdateAsynchron(e,null)})}deconstruct(){this.mInteractionZone.removeInteractionListener()}async waitForUpdate(){return this.mUpdateStates.async.hasSheduledTask?new Promise((t,e)=>{this.mUpdateStates.chainCompleteHooks.push((o,c)=>{c?e(c):t(o)})}):!1}executeInZone(t){return this.mInteractionZone.execute(t)}update(){let t=new At(U.manual,this.mInteractionZone,this.mManualComponentState);return this.runUpdateSynchron(t)}updateAsync(){let t=new At(U.manual,this.mInteractionZone,this.mManualComponentState);this.runUpdateAsynchron(t,null)}executeTaskChain(t,e,o,c){if(c.length>f.stackCap)throw new we("Call loop detected",c);let p=performance.now();if(!e.forcedSync&&p-e.startTime>f.frameTime)throw new se;c.push(t);let v=this.mInteractionZone.execute(()=>this.mUpdateFunction.call(this))||o;if(Rt.updateCycleRunId(e,this),!this.mUpdateStates.cycle.chainedTask)return v;let b=this.mUpdateStates.cycle.chainedTask;return this.mUpdateStates.cycle.chainedTask=null,this.executeTaskChain(b,e,v,c)}releaseUpdateChainCompleteHooks(t,e){if(!this.mUpdateStates.chainCompleteHooks.top)return;let o;for(;o=this.mUpdateStates.chainCompleteHooks.pop();)o(t,e)}runUpdateAsynchron(t,e){if(this.mUpdateStates.async.hasRunningTask||this.mUpdateStates.async.sheduledTaskIsResheduled){this.mUpdateStates.cycle.chainedTask=t;return}if(this.mUpdateStates.async.hasSheduledTask)return;let o=c=>{this.mUpdateStates.async.hasRunningTask=!0,this.mUpdateStates.async.hasSheduledTask=!1,this.mUpdateStates.async.sheduledTaskIsResheduled=!1;let p=!1;try{this.runUpdateSynchron(t)}catch(v){v instanceof se&&c.initiator===this&&(p=!0)}finally{this.mUpdateStates.async.hasRunningTask=!1}p&&this.runUpdateAsynchron(t,c)};this.mUpdateStates.async.hasSheduledTask=!0,e&&(this.mUpdateStates.async.sheduledTaskIsResheduled=!0),globalThis.requestAnimationFrame(()=>{e?Rt.openResheduledCycle(e,o):Rt.openUpdateCycle({updater:this,runSync:!1},o)})}runUpdateSynchron(t){if(this.mUpdateStates.sync.running)return this.mUpdateStates.cycle.chainedTask=t,!1;this.mUpdateStates.sync.running=!0;try{let e=Rt.openUpdateCycle({updater:this,runSync:!0},o=>{if(this.mUpdateRunCache.has(o.runner))return Rt.updateCyleStartTime(o),this.mUpdateRunCache.get(o.runner);let c=this.executeTaskChain(t,o,!1,new Array);return this.mUpdateRunCache.set(o.runner,c),c});return this.releaseUpdateChainCompleteHooks(e),e}catch(e){throw e instanceof se||this.releaseUpdateChainCompleteHooks(!1,e),e}finally{this.mUpdateStates.sync.running=!1}}},se=class extends Error{constructor(){super("Update resheduled")}};var Te=class extends Yt{mUpdater;get updater(){return this.mUpdater}constructor(t){super(t),this.mUpdater=new xe({label:t.constructor.name,onUpdate:()=>this.onUpdate()})}call(t,...e){return this.mUpdater.executeInZone(()=>super.call(t,...e))}deconstruct(){this.mUpdater.deconstruct(),super.deconstruct()}createProcessor(){return this.mUpdater.executeInZone(()=>super.createProcessor())}};var zt=class{mExpression;mTemporaryValues;constructor(t,e,o){if(this.mTemporaryValues=new k,o.length>0)for(let c of o)this.mTemporaryValues.set(c,void 0);this.mExpression=this.createEvaluationFunction(t,this.mTemporaryValues).bind(e.store)}execute(){return this.mExpression()}setTemporaryValue(t,e){if(!this.mTemporaryValues.has(t))throw new A(`Temporary value "${t}" does not exist for this procedure.`,this);this.mTemporaryValues.set(t,e)}createEvaluationFunction(t,e){let o,c=`__${Math.random().toString(36).substring(2)}`;if(o="return function () {",e.size>0)for(let p of e.keys())o+=`const ${p} = ${c}.get('${p}');`;return o+=`return ${t};`,o+="};",new Function(c,o)(e)}};var xt=class{mDataLevel;get data(){return this.mDataLevel}constructor(t){this.mDataLevel=t}createExpressionProcedure(t,e){return new zt(t,this.data,e??[])}setTemporaryValue(t,e){this.data.setTemporaryValue(t,e)}};var dt=class{mComponent;mDataProxy;mParentLevel;mTemporaryValues;get store(){return this.mDataProxy}constructor(t){this.mTemporaryValues=new k,t instanceof B?(this.mParentLevel=null,this.mComponent=t):(this.mParentLevel=t,this.mComponent=t.mComponent),this.mDataProxy=this.createAccessProxy()}setTemporaryValue(t,e){this.mTemporaryValues.set(t,e)}updateLevelData(t){if(t.mParentLevel!==this.mParentLevel)throw new A("Can't update InstructionLevelData for a deeper level than it target data.",this);this.mTemporaryValues=t.mTemporaryValues}createAccessProxy(){return new Proxy(new Object,{get:(t,e)=>this.getValue(e),set:(t,e,o)=>(this.hasTemporaryValue(e)&&this.setTemporaryValue(e,o),e in this.mComponent.processor?(this.mComponent.processor[e]=o,!0):(this.setTemporaryValue(e,o),!0)),deleteProperty:()=>{throw new A("Deleting properties is not allowed",this)},ownKeys:()=>[...new Set([...Object.keys(this.mComponent.processor),...this.getTemporaryValuesList()])]})}getTemporaryValuesList(){let t=this.mTemporaryValues.map(e=>e);return this.mParentLevel&&t.push(...this.mParentLevel.getTemporaryValuesList()),t}getValue(t){if(this.mTemporaryValues.has(t))return this.mTemporaryValues.get(t);if(this.mParentLevel)return this.mParentLevel.getValue(t);if(t in this.mComponent.processor)return this.mComponent.processor[t]}hasTemporaryValue(t){return this.mTemporaryValues.has(t)?!0:this.mParentLevel?this.mParentLevel.hasTemporaryValue(t):!1}};var Bt=class f{mChildList;mInstruction;mInstructionType;get childList(){return this.mChildList}get instruction(){return this.mInstruction}get instructionType(){return this.mInstructionType}constructor(t,e){this.mChildList=Array(),this.mInstruction=e,this.mInstructionType=t}appendChild(...t){this.mChildList.push(...t)}clone(){let t=new f(this.instructionType,this.instruction);for(let e of this.mChildList)t.appendChild(e.clone());return t}equals(t){if(!(t instanceof f)||t.instruction!==this.instruction||t.instructionType!==this.instructionType||t.childList.length!==this.childList.length)return!1;for(let e=0;e<t.childList.length;e++)if(!t.childList[e].equals(this.childList[e]))return!1;return!0}removeChild(t){let e=this.mChildList.indexOf(t);if(e!==-1)return this.mChildList.splice(e,1)[0]}};var gt=class f{mExpression;get value(){return this.mExpression}constructor(t){this.mExpression=t}clone(){return new f(this.mExpression)}equals(t){return t instanceof f&&t.value===this.value}toString(){return`{{ ${this.mExpression} }}`}};var Dt=class f{mContainsExpression;mTextValue;mValues;get containsExpression(){return this.mContainsExpression}get values(){return this.mValues}constructor(){this.mTextValue="",this.mContainsExpression=!1,this.mValues=[]}addValue(...t){for(let e of t)(this.mContainsExpression===!0||e instanceof gt)&&(this.mContainsExpression=!0),this.mValues.push(e),this.mTextValue+=e.toString()}clone(){let t=new f;for(let e of this.values)typeof e=="string"?t.addValue(e):t.addValue(e.clone());return t}equals(t){if(!(t instanceof f)||t.values.length!==this.values.length)return!1;for(let e=0;e<this.values.length;e++){let o=this.values[e],c=t.values[e];if(o!==c&&(typeof o!=typeof c||typeof o=="string"&&o!==c||!c.equals(o)))return!1}return!0}toString(){return this.mTextValue}};var ae=class f{mName;mValue;get name(){return this.mName}get values(){return this.mValue}constructor(t){this.mName=t,this.mValue=new Dt}clone(){let t=new f(this.name);for(let e of this.values.values)typeof e=="string"?t.values.addValue(e):t.values.addValue(e.clone());return t}equals(t){return!(!(t instanceof f)||t.name!==this.name||!t.values.equals(this.values))}};var It=class f{mAttributeDictionary;mChildList;mTagName;get attributes(){return[...this.mAttributeDictionary.values()]}get childList(){return this.mChildList}get tagName(){return this.mTagName}constructor(t){this.mAttributeDictionary=new Map,this.mChildList=Array(),this.mTagName=t}appendChild(...t){this.mChildList.push(...t)}clone(){let t=new f(this.tagName);for(let e of this.mAttributeDictionary.values()){let o=t.setAttribute(e.name);for(let c of e.values.values)typeof c=="string"?o.addValue(c):o.addValue(c.clone())}for(let e of this.mChildList)t.appendChild(e.clone());return t}equals(t){if(!(t instanceof f)||t.tagName!==this.tagName||t.attributes.length!==this.mAttributeDictionary.size||t.childList.length!==this.mChildList.length)return!1;for(let e of t.mAttributeDictionary.values()){let o=this.mAttributeDictionary.get(e.name);if(!o||!o.equals(e))return!1}for(let e=0;e<t.childList.length;e++)if(!t.childList[e].equals(this.mChildList[e]))return!1;return!0}getAttribute(t){return this.mAttributeDictionary.get(t)?.values??null}removeAttribute(t){return this.mAttributeDictionary.delete(t)}removeChild(t){let e=this.mChildList.indexOf(t);if(e!==-1)return this.mChildList.splice(e,1)[0]}setAttribute(t){if(this.mAttributeDictionary.has(t))return this.mAttributeDictionary.get(t).values;let e=new ae(t);return this.mAttributeDictionary.set(t,e),e.values}};var lt=class f{mBodyElementList;get body(){return this.mBodyElementList}constructor(){this.mBodyElementList=new Array}appendChild(...t){this.mBodyElementList.push(...t)}clone(){let t=new f;for(let e of this.mBodyElementList)t.appendChild(e.clone());return t}equals(t){if(!(t instanceof f)||t.body.length!==this.mBodyElementList.length)return!1;for(let e=0;e<this.mBodyElementList.length;e++)if(!this.mBodyElementList[e].equals(t.body[e]))return!1;return!0}removeChild(t){let e=this.mBodyElementList.indexOf(t);if(e!==-1)return this.mBodyElementList.splice(e,1)[0]}};var ot=class{mComponentValues;mContent;mModules;mTemplate;get anchor(){return this.mContent.contentAnchor}get modules(){return this.mModules}get template(){return this.mTemplate}get values(){return this.mComponentValues}get content(){return this.mContent}constructor(t,e,o,c){this.mTemplate=t,this.mComponentValues=o,this.mContent=c,this.mModules=e,c.setCoreBuilder(this)}deconstruct(){this.content.deconstruct()}update(){let t=this.onUpdate(),e=!1,o=this.content.builders;if(o.length>0)for(let c=0;c<o.length;c++)e=o[c].update()||e;return t||e}createHtmlElement(t){let e=t.tagName;if(typeof e!="string")throw e;if(e.includes("-")){let c=globalThis.customElements.get(e);if(typeof c<"u")return new c}let o=t.getAttribute("xmlns");return o&&!o.containsExpression?document.createElementNS(o.values[0],e):document.createElement(e)}createTextNode(t){return document.createTextNode(t)}};var Wt=class{mChildBuilderList;mChildComponents;mContentAnchor;mContentBoundary;mLinkedContent;mRootChildList;get body(){return this.mRootChildList}get builders(){return this.mChildBuilderList}get contentAnchor(){return this.mContentAnchor}constructor(t){this.mChildBuilderList=new Array,this.mRootChildList=new Array,this.mChildComponents=new Map,this.mLinkedContent=new WeakSet,this.mContentAnchor=document.createComment(t),this.mContentBoundary={start:this.mContentAnchor,end:this.mContentAnchor}}deconstruct(){this.onDeconstruct();let t;for(;t=this.mChildBuilderList.pop();)t.deconstruct();for(let o of this.mChildComponents.values())o.deconstruct();this.mChildComponents.clear();let e;for(;e=this.mRootChildList.pop();)e instanceof ot||e.remove();this.contentAnchor.remove()}getBoundary(){let t=this.mContentBoundary.end instanceof ot?this.mContentBoundary.end.content.getBoundary().end:this.mContentBoundary.end;return{start:this.mContentBoundary.start,end:t}}insert(t,e,o){if(!this.mLinkedContent.has(o))throw new A("Can't add content to builder. Target is not part of builder.",this);let c=t instanceof ot?t.anchor:t;switch(e){case"After":{this.insertAfter(c,o);break}case"TopOf":{this.insertTop(c,o);break}case"BottomOf":{this.insertBottom(c,o);break}}this.mLinkedContent.add(t),t instanceof ot&&this.mChildBuilderList.push(t);let p=c.parentElement??c.getRootNode(),v=this.mContentAnchor.parentElement??this.mContentAnchor.getRootNode();if(p===v){let b=(()=>{switch(e){case"After":return this.mRootChildList.indexOf(o)+1;case"TopOf":return 0;case"BottomOf":return this.mRootChildList.length}})();b===this.mRootChildList.length&&(this.mContentBoundary.end=t),this.mRootChildList.splice(b+1,0,t)}}remove(t){if(!this.mLinkedContent.has(t))throw new A("Child node cant be deleted from builder when it not a child of them",this);if(this.mLinkedContent.delete(t),t instanceof ot){let o=this.mChildBuilderList.indexOf(t);o!==-1&&this.mChildBuilderList.splice(o,1),t.deconstruct()}else{let o=this.mChildComponents.get(t);o&&(o.deconstruct(),this.mChildComponents.delete(t)),t.remove()}let e=this.mRootChildList.indexOf(t);e!==-1&&(this.mRootChildList.splice(e,1),this.mContentBoundary.end=this.mRootChildList.at(-1)??this.mContentAnchor)}setCoreBuilder(t){this.mLinkedContent.add(t)}insertAfter(t,e){let o=e instanceof ot?e.content.getBoundary().end:e;(o.parentElement??o.getRootNode()).insertBefore(t,o.nextSibling)}insertBottom(t,e){if(e instanceof ot){this.insertAfter(t,e);return}if(e instanceof Element){e.appendChild(t);return}throw new A("Source node does not support child nodes.",this)}insertTop(t,e){if(e instanceof ot){this.insertAfter(t,e.anchor);return}if(e instanceof Element){e.prepend(t);return}throw new A("Source node does not support child nodes.",this)}};var Ee=class extends Wt{mAttributeModulesChangedOrder;mLinkedAttributeData;mLinkedAttributeExpressionModules;mLinkedAttributeModuleList;mLinkedExpressionModuleList;get linkedAttributeModules(){return this.mAttributeModulesChangedOrder&&(this.mAttributeModulesChangedOrder=!1,this.mLinkedAttributeModuleList.sort((t,e)=>t.accessMode-e.accessMode)),this.mLinkedAttributeModuleList}get linkedExpressionModules(){return this.mLinkedExpressionModuleList}constructor(t){super(t),this.mLinkedExpressionModuleList=new Array,this.mLinkedAttributeModuleList=new Array,this.mLinkedAttributeExpressionModules=new WeakMap,this.mLinkedAttributeData=new WeakMap,this.mAttributeModulesChangedOrder=!1}attributeOfLinkedExpressionModule(t){return this.mLinkedAttributeExpressionModules.get(t)}getLinkedAttributeData(t){if(!this.mLinkedAttributeData.has(t))throw new A("Attribute has no linked data.",this);return this.mLinkedAttributeData.get(t)}linkAttributeExpression(t,e){this.mLinkedAttributeExpressionModules.set(t,e)}linkAttributeModule(t){this.mLinkedAttributeModuleList.push(t),this.mAttributeModulesChangedOrder=!0}linkAttributeNodes(t,e,o){this.mLinkedAttributeData.set(t,{values:o,node:e})}linkExpressionModule(t){this.mLinkedExpressionModuleList.push(t)}onDeconstruct(){for(let t of this.mLinkedAttributeModuleList)t.deconstruct();for(let t of this.mLinkedExpressionModuleList)t.deconstruct()}};var De=class extends Wt{mInstructionModule;get instructionModule(){return this.mInstructionModule}constructor(t,e){super(e),this.mInstructionModule=t}onDeconstruct(){this.mInstructionModule.deconstruct()}};var Ie=class extends ot{constructor(t,e,o){let c=e.createInstructionModule(t,o);super(t,e,o,new De(c,`Instruction - {$${t.instructionType}}`))}onUpdate(){if(this.content.instructionModule.update()){let t=this.content.body;this.updateStaticBuilder(t,this.content.instructionModule.instructionResult.elementList)}return!1}insertNewContent(t,e){let o=new Zt(t.template,this.modules,t.dataLevel,`Child - {$${this.template.instructionType}}`);return e===null?this.content.insert(o,"TopOf",this):this.content.insert(o,"After",e),o}updateStaticBuilder(t,e){let c=new ee((b,I)=>I.template.equals(b.template)).differencesOf(t,e),p=0,v=null;for(let b=0;b<c.length;b++){let I=c[b];if(I.changeState===Tt.Remove)this.content.remove(I.item);else if(I.changeState===Tt.Insert)v=this.insertNewContent(I.item,v),p++;else{let P=e[p].dataLevel;I.item.values.updateLevelData(P),v=I.item,p++}}}};var Zt=class extends ot{mInitialized;constructor(t,e,o,c){super(t,e,o,new Ee(`Static - {${c}}`)),this.mInitialized=!1}onUpdate(){this.mInitialized||(this.mInitialized=!0,this.buildTemplate([this.template],this));let t=!1,e=this.content.linkedAttributeModules;for(let p=0;p<e.length;p++)t=e[p].update()||t;let o=!1,c=this.content.linkedExpressionModules;for(let p=0;p<c.length;p++){let v=c[p];if(v.update()){o=!0;let b=this.content.attributeOfLinkedExpressionModule(v);if(!b)continue;let I=this.content.getLinkedAttributeData(b),P=I.values.reduce((a,n)=>a+n.data,"");I.node.setAttribute(b.name,P)}}return t||o}buildInstructionTemplate(t,e){this.content.insert(new Ie(t,this.modules,new dt(this.values)),"BottomOf",e)}buildStaticTemplate(t,e){let o=this.createHtmlElement(t);this.content.insert(o,"BottomOf",e);for(let c of t.attributes){let p=this.modules.createAttributeModule(c,o,this.values);if(p){this.content.linkAttributeModule(p);continue}if(c.values.containsExpression){let v=new Array;for(let b of c.values.values){let I=this.createTextNode("");if(v.push(I),!(b instanceof gt)){I.data=b;continue}let P=this.modules.createExpressionModule(b,I,this.values);this.content.linkExpressionModule(P),this.content.linkAttributeExpression(P,c)}this.content.linkAttributeNodes(c,o,v);continue}o.setAttribute(c.name,c.values.toString())}this.content.insert(o,"BottomOf",e),this.buildTemplate(t.childList,o)}buildTemplate(t,e){for(let o of t)o instanceof lt?this.buildTemplate(o.body,e):o instanceof Dt?this.buildTextTemplate(o,e):o instanceof Bt?this.buildInstructionTemplate(o,e):o instanceof It&&this.buildStaticTemplate(o,e)}buildTextTemplate(t,e){for(let o of t.values){if(typeof o=="string"){this.content.insert(this.createTextNode(o),"BottomOf",e);continue}let c=this.createTextNode("");this.content.insert(c,"BottomOf",e);let p=this.modules.createExpressionModule(o,c,this.values);this.content.linkExpressionModule(p)}}};var le=class{mHtmlElement;mShadowRoot;get htmlElement(){return this.mHtmlElement}get shadowRoot(){return this.mShadowRoot}constructor(t){this.mHtmlElement=t,this.mShadowRoot=this.mHtmlElement.attachShadow({mode:"open"})}};var H=class{mDataLevel;get data(){return this.mDataLevel}constructor(t){this.mDataLevel=t}createExpressionProcedure(t,e){return new zt(t,this.data,e??[])}};var Ot=class extends Yt{constructor(t){super({constructor:t.constructor,parent:t.parent}),this.setProcessorInjection(H,new H(t.values))}deconstruct(){super.deconstruct(),this.call("onDeconstruct")}update(){return this.onUpdate()}};var Q=class{mValue;get value(){return this.mValue}constructor(t){this.mValue=t}};var Z=class{constructor(){throw new A("Reference should not be instanced.",this)}};var pt=class{constructor(){throw new A("Reference should not be instanced.",this)}};var _t=class f extends Ot{mLastResult;mTargetTextNode;constructor(t){super({constructor:t.constructor,parent:t.parent,values:t.values}),this.mTargetTextNode=t.targetNode,this.mLastResult=null,this.setProcessorInjection(f,this),this.setProcessorInjection(pt,t.targetTemplate.clone()),this.setProcessorInjection(Z,t.targetNode),this.setProcessorInjection(Q,new Q(t.targetTemplate.value))}onUpdate(){let t=this.call("onUpdate");t===null&&(t="");let e=this.mLastResult===null||this.mLastResult!==t;if(e){let o=this.mTargetTextNode;o.data=t,this.mLastResult=t}return e}};function rr(){return(f,t)=>{O.registerInjectable(f,t.metadata,"instanced"),at.register(_t,f,{})}}function Xi(){function f(a,n){return function(l){e(n,"addInitializer"),o(l,"An initializer"),a.push(l)}}function t(a,n,u,l,r,y,g,T,w){var d;switch(r){case 1:d="accessor";break;case 2:d="method";break;case 3:d="getter";break;case 4:d="setter";break;default:d="field"}var s={kind:d,name:g?"#"+n:n,static:y,private:g,metadata:T},m={v:!1};s.addInitializer=f(l,m);var i,h;r===0?g?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return a(w,s)}finally{m.v=!0}}function e(a,n){if(a.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(a,n){if(typeof a!="function")throw new TypeError(n+" must be a function")}function c(a,n){var u=typeof n;if(a===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function p(a,n,u,l,r,y,g,T,w){var d=u[0],s,m,i;g?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,S;if(typeof d=="function")h=t(d,l,s,T,r,y,g,w,i),h!==void 0&&(c(r,h),r===0?m=h:r===1?(m=h.init,x=h.get||i.get,S=h.set||i.set,i={get:x,set:S}):i=h);else for(var C=d.length-1;C>=0;C--){var M=d[C];if(h=t(M,l,s,T,r,y,g,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,S=h.set||i.set,i={get:x,set:S}):i=h,N!==void 0&&(m===void 0?m=N:typeof m=="function"?m=[m,N]:m.push(N))}}if(r===0||r===1){if(m===void 0)m=function(D,E){return E};else if(typeof m!="function"){var _=m;m=function(D,E){for(var L=E,R=0;R<_.length;R++)L=_[R].call(D,L);return L}}else{var $=m;m=function(D,E){return $.call(D,E)}}a.push(m)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),g?r===1?(a.push(function(D,E){return i.get.call(D,E)}),a.push(function(D,E){return i.set.call(D,E)})):r===2?a.push(i):a.push(function(D,E){return i.call(D,E)}):Object.defineProperty(n,l,s))}function v(a,n,u){for(var l=[],r,y,g=new Map,T=new Map,w=0;w<n.length;w++){var d=n[w];if(Array.isArray(d)){var s=d[1],m=d[2],i=d.length>3,h=s>=5,x,S;if(h?(x=a,s=s-5,y=y||[],S=y):(x=a.prototype,r=r||[],S=r),s!==0&&!i){var C=h?T:g,M=C.get(m)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+m);!M&&s>2?C.set(m,s):C.set(m,!0)}p(l,x,d,m,s,h,i,S,u)}}return b(l,r),b(l,y),l}function b(a,n){n&&a.push(function(u){for(var l=0;l<n.length;l++)n[l].call(u);return u})}function I(a,n,u){if(n.length>0){for(var l=[],r=a,y=a.name,g=n.length-1;g>=0;g--){var T={v:!1};try{var w=n[g](r,{kind:"class",name:y,addInitializer:f(l,T),metadata:u})}finally{T.v=!0}w!==void 0&&(c(10,w),r=w)}return[P(r,u),function(){for(var d=0;d<l.length;d++)l[d].call(r)}]}}function P(a,n){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,l,r){if(r!==void 0)var y=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(y===void 0?null:y),T=v(n,u,g);return l.length||P(n,g),{e:T,get c(){return I(n,l,g)}}}}function mr(f,t,e,o){return(mr=Xi())(f,t,e,o)}var dr,ur,or;dr=rr();var hr=class{static{({c:[or,ur]}=mr(this,[],[dr]))}constructor(t=O.use(H),e=O.use(Q)){this.mProcedure=t.createExpressionProcedure(e.value)}mProcedure;onUpdate(){let t=this.mProcedure.execute();return typeof t>"u"?null:t?.toString()}static{ur()}};var et=class{mName;mValue;get name(){return this.mName}get value(){return this.mValue}constructor(t,e){this.mName=t,this.mValue=e}};var vt=class f extends Ot{mAccessMode;get accessMode(){return this.mAccessMode}constructor(t){super({constructor:t.constructor,parent:t.parent,values:t.values}),this.mAccessMode=t.accessMode,this.setProcessorInjection(f,this),this.setProcessorInjection(pt,t.targetTemplate.clone()),this.setProcessorInjection(Z,t.targetNode),this.setProcessorInjection(et,new et(t.targetTemplate.name,t.targetTemplate.values.toString()))}onUpdate(){return this.call("onUpdate")??!1}};var ct=class{mElementList;mTemplates;mDataLevels;get elementList(){return this.mElementList}constructor(){this.mElementList=new Array,this.mTemplates=new Set,this.mDataLevels=new Set}addElement(t,e){if(this.mTemplates.has(t)||this.mDataLevels.has(e))throw new A("Can't add same template or values for multiple Elements.",this);this.mTemplates.add(t),this.mDataLevels.add(e),this.mElementList.push({template:t,dataLevel:e})}};var Ft=class f extends Ot{mLastResult;get instructionResult(){return this.mLastResult}constructor(t){super({constructor:t.constructor,parent:t.parent,values:t.values}),this.setProcessorInjection(f,this),this.setProcessorInjection(pt,t.targetTemplate.clone()),this.setProcessorInjection(Q,new Q(t.targetTemplate.instruction)),this.mLastResult=new ct}onUpdate(){let t=this.call("onUpdate");return t instanceof ct?(this.mLastResult=t,!0):!1}};var Se=class f{static mAttributeModuleCache=new k;static mExpressionModuleCache=new WeakMap;static mInstructionModuleCache=new k;mComponent;mExpressionModule;constructor(t,e){this.mExpressionModule=e??or,this.mComponent=t}createAttributeModule(t,e,o){let c=(()=>{let p=f.mAttributeModuleCache.get(t.name);if(p||p===null)return p;for(let v of at.get(vt))if(v.processorConfiguration.selector.test(t.name))return f.mAttributeModuleCache.set(t.name,v),v;return f.mAttributeModuleCache.set(t.name,null),null})();return c===null?null:new vt({accessMode:c.processorConfiguration.access,constructor:c.processorConstructor,parent:this.mComponent,targetNode:e,targetTemplate:t,values:o}).setup()}createExpressionModule(t,e,o){let c=(()=>{let p=f.mExpressionModuleCache.get(this.mExpressionModule);if(p)return p;let v=at.get(_t).find(b=>b.processorConstructor===this.mExpressionModule);if(!v)throw new A("An expression module could not be found.",this);return f.mExpressionModuleCache.set(this.mExpressionModule,v),v})();return new _t({constructor:c.processorConstructor,parent:this.mComponent,targetNode:e,targetTemplate:t,values:o}).setup()}createInstructionModule(t,e){let o=(()=>{let c=f.mInstructionModuleCache.get(t.instructionType);if(c)return c;for(let p of at.get(Ft))if(p.processorConfiguration.instructionType===t.instructionType)return f.mInstructionModuleCache.set(t.instructionType,p),p;throw new A(`Instruction module type "${t.instructionType}" not found.`,this)})();return new Ft({constructor:o.processorConstructor,parent:this.mComponent,targetTemplate:t,values:e}).setup()}};var Ut=class extends A{mColumnEnd;mColumnStart;mLineEnd;mLineStart;get columnEnd(){return this.mColumnEnd}get columnStart(){return this.mColumnStart}get lineEnd(){return this.mLineEnd}get lineStart(){return this.mLineStart}constructor(t,e,o,c,p,v,b){super(t,e,b),this.mColumnStart=o,this.mLineStart=c,this.mColumnEnd=p,this.mLineEnd=v}};var qt=class{mDependencyFetch;mDependencyFetchResolved;mLexer;mMeta;mPattern;mPatternDependencies;mType;get dependencies(){return this.mPatternDependencies}get dependenciesResolved(){return this.mDependencyFetchResolved}get lexer(){return this.mLexer}get meta(){return this.mMeta}get pattern(){return this.mPattern}constructor(t,e){if(this.mLexer=t,this.mType=e.type,this.mMeta=e.metadata,this.mPatternDependencies=new Array,this.mDependencyFetch=e.dependencyFetch??null,this.mDependencyFetchResolved=!e.dependencyFetch,this.mType==="split"&&!this.mDependencyFetch)throw new A("Split token with a start and end token, need inner token definitions.",this);if(this.mType==="single"&&this.mDependencyFetch)throw new A("Pattern does not allow inner token pattern.",this);this.mPattern=this.convertTokenPattern(this.mType,e.pattern)}isSplit(){return this.mType==="split"}resolveDependencies(){this.mDependencyFetchResolved||(this.mDependencyFetch(this),this.mDependencyFetchResolved=!0)}useChildPattern(t){if(this.mLexer!==t.lexer)throw new A("Can only add dependencies of the same lexer.",this);this.mPatternDependencies.push(t)}convertTokenPattern(t,e){if("single"in e){if(t==="split")throw new A("Can't use split pattern type with single pattern definition.",this);return{start:{regex:e.single.regex,types:e.single.types,validator:e.single.validator??null}}}else{if(t==="single")throw new A("Can't use single pattern type with split pattern definition.",this);return{start:{regex:e.start.regex,types:e.start.types,validator:e.start.validator??null},end:{regex:e.end.regex,types:e.end.types,validator:e.end.validator??null},innerType:e.innerType??null}}}};var Jt=class{mColumnNumber;mLineNumber;mMetas;mType;mValue;get columnNumber(){return this.mColumnNumber}get lineNumber(){return this.mLineNumber}get metas(){return[...this.mMetas]}get type(){return this.mType}get value(){return this.mValue}constructor(t,e,o,c){this.mValue=e,this.mColumnNumber=o,this.mLineNumber=c,this.mType=t,this.mMetas=new Set}addMeta(...t){for(let e of t)this.mMetas.add(e)}hasMeta(t){return this.mMetas.has(t)}};var ce=class{mRootPattern;mSettings;get errorType(){return this.mSettings.errorType}set errorType(t){this.mSettings.errorType=t}get trimWhitespace(){return this.mSettings.trimSpaces}set trimWhitespace(t){this.mSettings.trimSpaces=t}get validWhitespaces(){return[...this.mSettings.whiteSpaces].join("")}set validWhitespaces(t){this.mSettings.whiteSpaces=new Set(t.split(""))}constructor(){this.mSettings={errorType:null,trimSpaces:!0,whiteSpaces:new Set},this.mRootPattern=new qt(this,{type:"single",pattern:{single:{regex:/^/,types:{},validator:null}},metadata:[],dependencyFetch:null})}createTokenPattern(t,e){let o=b=>typeof b=="string"?{token:b}:b,c=b=>{let I=new Set(b.flags.split(""));return new RegExp(`^(?<token>${b.source})`,[...I].join(""))},p=new Array;t.meta&&(typeof t.meta=="string"?p.push(t.meta):p.push(...t.meta));let v;return"regex"in t.pattern?v={single:{regex:c(t.pattern.regex),types:o(t.pattern.type),validator:t.pattern.validator??null}}:v={start:{regex:c(t.pattern.start.regex),types:o(t.pattern.start.type),validator:t.pattern.start.validator??null},end:{regex:c(t.pattern.end.regex),types:o(t.pattern.end.type),validator:t.pattern.end.validator??null},innerType:t.pattern.innerType??null},new qt(this,{type:"regex"in t.pattern?"single":"split",pattern:v,metadata:p,dependencyFetch:e??null})}*tokenize(t,e){let o={data:t,cursor:{position:0,column:1,line:1},error:null,progressTracker:e??null};yield*this.tokenizeRecursionLayer(o,this.mRootPattern,new Array,null)}useRootTokenPattern(t){if(t.lexer!==this)throw new A("Token pattern must be created by this lexer.",this);this.mRootPattern.useChildPattern(t)}findNextStartToken(t,e,o,c){for(let p of e){let v=p.pattern.start,b=this.matchToken(p,v,t,o,c);if(b!==null)return{pattern:p,token:b}}return null}findTokenTypeOfMatch(t,e,o){for(let v in t.groups){let b=t.groups[v],I=e[v];if(!(!b||!I)){if(b.length!==t[0].length)throw new A("A group of a token pattern must match the whole token.",this);return I}}let c=new Array;for(let v in t.groups)t.groups[v]&&c.push(v);let p=new Array;for(let v in e)p.push(v);throw new A(`No token type found for any defined pattern regex group. Full: "${t[0]}", Matches: "${c.join(", ")}", Available: "${p.join(", ")}", Regex: "${o.source}"`,this)}*generateErrorToken(t,e){if(!t.error||!this.mSettings.errorType)return;let o=new Jt(this.mSettings.errorType,t.error.data,t.error.startColumn,t.error.startLine);o.addMeta(...e),t.error=null,yield o}generateToken(t,e,o,c,p,v){let b=o[0],I=this.findTokenTypeOfMatch(o,c,v),P=new Jt(p??I,b,t.cursor.column,t.cursor.line);return P.addMeta(...e),P}matchToken(t,e,o,c,p){let v=e.regex;v.lastIndex=0;let b=v.exec(o.data);if(!b||b.index!==0)return null;let I=this.generateToken(o,[...c,...t.meta],b,e.types,p,v);if(e.validator){let P=o.data.substring(I.value.length);if(!e.validator(I,P,o.cursor.position))return null}return this.moveCursor(o,I.value),I}moveCursor(t,e){let o=e.split(`
`);o.length>1&&(t.cursor.column=1),t.cursor.line+=o.length-1,t.cursor.column+=o.at(-1).length,t.cursor.position+=e.length,t.data=t.data.substring(e.length),this.trackProgress(t)}pushNextCharToErrorState(t){if(!this.mSettings.errorType)throw new Ut(`Unable to parse next token. No valid pattern found for "${t.data.substring(0,20)}".`,this,t.cursor.column,t.cursor.line,t.cursor.column,t.cursor.line);t.error||(t.error={data:"",startColumn:t.cursor.column,startLine:t.cursor.line});let e=t.data.charAt(0);t.error.data+=e,this.moveCursor(t,e)}skipNextWhitespace(t){let e=t.data.charAt(0);return!this.mSettings.trimSpaces||!this.mSettings.whiteSpaces.has(e)?!1:(this.moveCursor(t,e),!0)}*tokenizeRecursionLayer(t,e,o,c){let p=e.dependencies;for(;t.data.length>0;){if(!t.error&&this.skipNextWhitespace(t))continue;if(e.isSplit()){let I=this.matchToken(e,e.pattern.end,t,o,c);if(I!==null){yield*this.generateErrorToken(t,o),yield I;return}}let v=this.findNextStartToken(t,p,o,c);if(!v){this.pushNextCharToErrorState(t);continue}yield*this.generateErrorToken(t,o),yield v.token;let b=v.pattern;b.isSplit()&&(b.resolveDependencies(),yield*this.tokenizeRecursionLayer(t,b,[...o,...b.meta],c??b.pattern.innerType))}yield*this.generateErrorToken(t,o)}trackProgress(t){t.progressTracker!==null&&t.progressTracker(t.cursor.position,t.cursor.line,t.cursor.column)}};var Y=class extends Error{static PARSER_ERROR=Symbol("PARSER_ERROR");mTrace;get columnEnd(){return this.mTrace.top.range.columnEnd}get columnStart(){return this.mTrace.top.range.columnStart}get graph(){return this.mTrace.top.graph}get incidents(){return this.mTrace.incidents}get lineEnd(){return this.mTrace.top.range.lineEnd}get lineStart(){return this.mTrace.top.range.lineStart}constructor(t){super(t.top.message,{cause:t.top.cause}),this.mTrace=t}};var Pe=class{mIncidents;mTop;get incidents(){if(this.mIncidents===null)throw new A("A complete incident list is only available on debug mode.",this);return this.mIncidents}get top(){return this.mTop}constructor(t){this.mTop={message:"Unknown parser error",priority:0,graph:null,range:{lineStart:1,columnStart:1,lineEnd:1,columnEnd:1},cause:null},t?this.mIncidents=new Array:this.mIncidents=null}push(t,e,o,c,p,v,b=!1,I=null){let P;if(b?P=this.mTop.priority+1:P=p*1e4+v,this.mIncidents!==null){let a={message:t,priority:P,graph:e,range:{lineStart:o,columnStart:c,lineEnd:p,columnEnd:v},cause:I};this.mIncidents.push(a)}this.mTop&&P<this.mTop.priority||this.setTop({message:t,priority:P,graph:e,range:{lineStart:o,columnStart:c,lineEnd:p,columnEnd:v},cause:I})}setTop(t){this.mTop=t}};var Ce=class f{static MAX_JUNCTION_CIRCULAR_REFERENCES=1e3;mGraphStack;mIncidentTrace;mLastTokenPosition;mProcessStack;mTokenCache;mTokenGenerator;mTrimTokenCache;get currentGraph(){return this.mGraphStack.top.graph}get currentToken(){let t=this.mGraphStack.top;return this.mTokenCache[t.token.cursor]}get incidentTrace(){return this.mIncidentTrace}get processStack(){return this.mProcessStack}constructor(t,e,o){this.mTokenGenerator=t,this.mGraphStack=new Ct,this.mLastTokenPosition={column:1,line:1},this.mTokenCache=new Array,this.mProcessStack=new Ct,this.mTrimTokenCache=o,this.mIncidentTrace=new Pe(e),this.mGraphStack.push({graph:null,linear:!0,circularGraphs:new k,token:{start:0,cursor:-1}})}collapse(){let t=this.mGraphStack.top,e=this.mTokenCache.slice(t.token.cursor);e.length!==0&&e.at(-1)===null&&e.pop();for(let o of this.mTokenGenerator)e.push(o);return e}getGraphBoundingToken(){let t=this.mGraphStack.top,e=this.mTokenCache[t.token.start],o=this.mTokenCache[t.token.cursor-1];return e??=o,o??=e,[e??null,o??null]}getGraphPosition(){let t=this.mGraphStack.top,e,o;if(e=this.mTokenCache[t.token.start],o=this.mTokenCache[t.token.cursor-1],e??=o,o??=e,!e||!o)return{graph:t.graph,columnEnd:this.mLastTokenPosition.column,columnStart:this.mLastTokenPosition.column,lineEnd:this.mLastTokenPosition.line,lineStart:this.mLastTokenPosition.line};let c,p;if(o.value.includes(`
`)){let v=o.value.split(`
`);p=o.lineNumber+v.length-1,c=1+v[v.length-1].length}else c=o.columnNumber+o.value.length,p=o.lineNumber;return{graph:t.graph,lineStart:e.lineNumber,columnStart:e.columnNumber,lineEnd:p,columnEnd:c}}getTokenPosition(){let t=this.mGraphStack.top,e=this.currentToken;if(!e)return{graph:t.graph,columnEnd:this.mLastTokenPosition.column,columnStart:this.mLastTokenPosition.column,lineEnd:this.mLastTokenPosition.line,lineStart:this.mLastTokenPosition.line};let o,c;if(e.value.includes(`
`)){let p=e.value.split(`
`);c=e.lineNumber+p.length-1,o=1+p[p.length-1].length}else o=e.columnNumber+e.value.length,c=e.lineNumber;return{graph:t.graph,lineStart:e.lineNumber,columnStart:e.columnNumber,lineEnd:c,columnEnd:o}}graphIsCircular(t){let e=this.mGraphStack.top;if(!e.circularGraphs.has(t))return!1;if(t.isJunction){if(e.circularGraphs.get(t)>f.MAX_JUNCTION_CIRCULAR_REFERENCES)throw new A("Junction graph called circular too often.",this);return!1}return!0}moveNextToken(){let t=this.mGraphStack.top;if(t.circularGraphs.size>0&&(t.circularGraphs=new k),t.graph&&t.graph.isJunction)throw new A("Junction graph must not have own nodes.",this);if(t.token.cursor++,t.token.cursor<this.mTokenCache.length)return;let e=this.mTokenGenerator.next();if(e.done){this.mTokenCache.push(null);return}this.mLastTokenPosition.column=e.value.columnNumber,this.mLastTokenPosition.line=e.value.lineNumber,this.mTokenCache.push(e.value)}popGraphStack(t){let e=this.mGraphStack.pop(),o=this.mGraphStack.top;if(t&&(e.token.cursor=e.token.start),e.token.cursor!==e.token.start&&o.circularGraphs.size>0&&(o.circularGraphs=new k),!this.mTrimTokenCache){o.token.cursor=e.token.cursor;return}e.linear?(this.mTokenCache.splice(0,e.token.cursor),o.token.start=0,o.token.cursor=0):o.token.cursor=e.token.cursor}pushGraphStack(t,e){let o=this.mGraphStack.top,c={graph:t,linear:e&&o.linear,circularGraphs:new k(o.circularGraphs),token:{start:o.token.cursor,cursor:o.token.cursor}},p=c.circularGraphs.get(t)??0;c.circularGraphs.set(t,p+1),this.mGraphStack.push(c)}};var ue=class f{static NODE_NULL_RESULT=Symbol("FAILED_NODE_VALUE_PARSE");static NODE_VALUE_LIST_END_MEET=Symbol("FAILED_NODE_VALUE_PARSE");mConfiguration;mLexer;mRootPart;get lexer(){return this.mLexer}constructor(t,e){this.mLexer=t,this.mRootPart=null,this.mConfiguration={keepTraceIncidents:!1,trimTokenCache:!1,...e}}parse(t,e){if(this.mRootPart===null)throw new A("Parser has not root part set.",this);let o=new Ce(this.mLexer.tokenize(t,e),this.mConfiguration.keepTraceIncidents,this.mConfiguration.trimTokenCache),c=(()=>{try{return this.beginParseProcess(o,this.mRootPart)}catch(v){if(v instanceof Ut)return o.incidentTrace.push(v.message,o.currentGraph,v.lineStart,v.columnStart,v.lineEnd,v.columnEnd,!0,v),Y.PARSER_ERROR;let b=v instanceof Error?v.message:v.toString(),I=o.getGraphPosition();return o.incidentTrace.push(b,o.currentGraph,I.lineStart,I.columnStart,I.lineEnd,I.columnEnd,!0,v),Y.PARSER_ERROR}})();if(c===Y.PARSER_ERROR)throw new Y(o.incidentTrace);let p=o.collapse();if(p.length!==0){let v=p[0];if(o.incidentTrace.top.range.lineEnd===1&&o.incidentTrace.top.range.columnEnd===1){let b=`Tokens could not be parsed. Graph end meet without reaching last token. Current: "${v.value}" (${v.type})`;o.incidentTrace.push(b,this.mRootPart,v.lineNumber,v.columnNumber,v.lineNumber,v.columnNumber)}throw new Y(o.incidentTrace)}return c}setRootGraph(t){this.mRootPart=t}beginParseProcess(t,e){t.moveNextToken(),t.processStack.push({type:"graph-parse",parameter:{graph:e,linear:!0},state:0});let o=f.NODE_NULL_RESULT;for(;t.processStack.top;)o=this.processStack(t,t.processStack.top,o);return o}processChainedNodeParseProcess(t,e,o){switch(e.state){case 0:{let v=e.parameter.node.connections.next;return v===null?(t.processStack.pop(),{}):(e.state++,t.processStack.push({type:"node-parse",parameter:{node:v},state:0,values:{}}),f.NODE_NULL_RESULT)}case 1:{let c=o;return c===Y.PARSER_ERROR?(t.processStack.pop(),Y.PARSER_ERROR):(t.processStack.pop(),c)}}throw new A(`Invalid node next parse state "${e.state}".`,this)}processGraphParseProcess(t,e,o){let c=e.parameter.graph;switch(e.state){case 0:{if(t.graphIsCircular(c)){let v=t.getGraphPosition();return t.incidentTrace.push("Circular graph detected.",c,v.lineStart,v.columnStart,v.lineEnd,v.columnEnd),t.processStack.pop(),Y.PARSER_ERROR}let p=e.parameter.linear;return t.pushGraphStack(c,p),e.state++,t.processStack.push({type:"node-parse",parameter:{node:c.node},state:0,values:{}}),f.NODE_NULL_RESULT}case 1:{let p=o;if(p===Y.PARSER_ERROR)return t.popGraphStack(!0),t.processStack.pop(),Y.PARSER_ERROR;let v=c.convert(p,t);if(typeof v=="symbol"){let b=t.getGraphPosition();return t.incidentTrace.push(v.description??"Unknown data convert error",b.graph,b.lineStart,b.columnStart,b.lineEnd,b.columnEnd),t.popGraphStack(!0),t.processStack.pop(),Y.PARSER_ERROR}return t.popGraphStack(!1),t.processStack.pop(),v}}throw new A(`Invalid graph parse state "${e.state}".`,this)}processNodeParseProcess(t,e,o){let c=e.parameter.node;switch(e.state){case 0:return t.processStack.push({type:"node-value-parse",parameter:{node:c,valueIndex:0},state:0,values:{}}),e.state++,f.NODE_NULL_RESULT;case 1:{let p=o;return p===Y.PARSER_ERROR?(t.processStack.pop(),Y.PARSER_ERROR):(e.values.nodeValueResult=p,t.processStack.push({type:"node-next-parse",parameter:{node:c},state:0}),e.state++,f.NODE_NULL_RESULT)}case 2:{let p=o;if(p===Y.PARSER_ERROR)return t.processStack.pop(),Y.PARSER_ERROR;let v=c.mergeData(e.values.nodeValueResult,p);return t.processStack.pop(),v}}throw new A(`Invalid node parse state "${e.state}".`,this)}processNodeValueParseProcess(t,e,o){let c=e.parameter.node;switch(e.state){case 0:{if(o!==f.NODE_NULL_RESULT&&o!==Y.PARSER_ERROR)return e.values.parseResult=o,e.state++,f.NODE_NULL_RESULT;let p=e.parameter.valueIndex,v=c.connections;if(p>=v.values.length)return e.values.parseResult=f.NODE_VALUE_LIST_END_MEET,e.state++,f.NODE_NULL_RESULT;e.parameter.valueIndex++;let b=t.currentToken,I=v.values[p];if(typeof I=="string"){if(!b){if(v.required){let P=t.getTokenPosition();t.incidentTrace.push(`Unexpected end of statement. Token "${I}" expected.`,t.currentGraph,P.lineStart,P.columnStart,P.lineEnd,P.columnEnd)}return f.NODE_NULL_RESULT}if(I!==b.type){if(v.required){let P=t.getTokenPosition();t.incidentTrace.push(`Unexpected token "${b.value}". "${I}" expected`,t.currentGraph,P.lineStart,P.columnStart,P.lineEnd,P.columnEnd)}return f.NODE_NULL_RESULT}return t.moveNextToken(),b.value}else{let P=v.values.length===1||v.values.length===p+1;return t.processStack.push({type:"graph-parse",parameter:{graph:I,linear:P},state:0}),f.NODE_NULL_RESULT}}case 1:{let p=e.values.parseResult,v=c.connections;if(p===f.NODE_VALUE_LIST_END_MEET&&!v.required){t.processStack.pop();return}return p===f.NODE_VALUE_LIST_END_MEET?(t.processStack.pop(),Y.PARSER_ERROR):(t.processStack.pop(),p)}}throw new A(`Invalid node value parse state "${e.state}".`,this)}processStack(t,e,o){switch(e.type){case"graph-parse":return this.processGraphParseProcess(t,e,o);case"node-parse":return this.processNodeParseProcess(t,e,o);case"node-value-parse":return this.processNodeValueParseProcess(t,e,o);case"node-next-parse":return this.processChainedNodeParseProcess(t,e,o)}}};var q=class f{static define(t,e=!1){return new f(t,e)}mDataConverterList;mGraphCollector;mIsJunction;mResolvedGraphNode;get isJunction(){return this.mIsJunction}get node(){return this.mResolvedGraphNode||(this.mResolvedGraphNode=this.mGraphCollector().root),this.mResolvedGraphNode}constructor(t,e){this.mGraphCollector=t,this.mDataConverterList=new Array,this.mResolvedGraphNode=null,this.mIsJunction=e}convert(t,e){if(this.mDataConverterList.length===0)return t;let o=e.getGraphBoundingToken(),c=o[0]??void 0,p=o[1]??void 0;if(this.mDataConverterList.length===1)return this.mDataConverterList[0](t,c,p);let v=t;for(let b of this.mDataConverterList)if(v=b(v,c,p),typeof v=="symbol")return v;return v}converter(t){let e=new f(this.mGraphCollector,this.isJunction);return e.mDataConverterList.push(...this.mDataConverterList,t),e}};var G=class f{static new(){let t=new f("",!1,[]);return t.mRootNode=null,t}mConnections;mIdentifier;mRootNode;get configuration(){return{dataKey:this.mIdentifier.dataKey,isList:this.mIdentifier.type==="list",isRequired:this.mConnections.required,isBranch:this.mConnections.values.length>1}}get connections(){return this.mConnections}get root(){if(!this.mRootNode)throw new A("Staring nodes must be chained with another node to be used.",this);return this.mRootNode}constructor(t,e,o,c){if(t==="")this.mIdentifier={type:"empty",dataKey:"",mergeKey:""};else if(t.endsWith("[]"))this.mIdentifier={type:"list",mergeKey:"",dataKey:t.substring(0,t.length-2)};else if(t.includes("<-")){let v=t.split("<-");this.mIdentifier={type:"merge",dataKey:v[0],mergeKey:v[1]}}else this.mIdentifier={type:"single",mergeKey:"",dataKey:t};let p=o.map(v=>v instanceof f?q.define(()=>v):v);this.mConnections={required:e,values:p,next:null},c?this.mRootNode=c:this.mRootNode=this}mergeData(t,e){if(this.mIdentifier.type==="empty")return e;let o=e,c=typeof t>"u";if(this.mIdentifier.type==="single"){if(this.mIdentifier.dataKey in e)throw new A(`Graph path has a duplicate value identifier "${this.mIdentifier.dataKey}"`,this);return c||(o[this.mIdentifier.dataKey]=t),e}if(this.mIdentifier.type==="list"){let b;c?b=new Array:Array.isArray(t)?b=t:b=[t];let I=(()=>{if(this.mIdentifier.dataKey in e){let P=o[this.mIdentifier.dataKey];return Array.isArray(P)?(P.unshift(...b),P):(b.push(P),b)}return b})();return o[this.mIdentifier.dataKey]=I,e}if(c)return e;let p=(()=>{if(!this.mIdentifier.mergeKey)throw new A("Cant merge data without a merge key.",this);if(typeof t!="object"||t===null)throw new A("Node data must be an object when merge key is set.",this);if(!(this.mIdentifier.mergeKey in t))throw new A(`Node data does not contain merge key "${this.mIdentifier.mergeKey}"`,this);return t[this.mIdentifier.mergeKey]})();if(typeof p>"u")return e;let v=o[this.mIdentifier.dataKey];if(typeof v>"u")return o[this.mIdentifier.dataKey]=p,o;if(!Array.isArray(v))throw new A("Chain data merge value is not an array but should be.",this);return Array.isArray(p)?v.unshift(...p):v.unshift(p),e}optional(t,e){let o=typeof e>"u"?"":t,c=typeof e>"u"?t:e,p=new Array;Array.isArray(c)?p.push(...c):p.push(c);let v=new f(o,!1,p,this.mRootNode);return this.setChainedNode(v),v}required(t,e){let o=typeof e>"u"?"":t,c=typeof e>"u"?t:e,p=new Array;Array.isArray(c)?p.push(...c):p.push(c);let v=new f(o,!0,p,this.mRootNode);return this.setChainedNode(v),v}setChainedNode(t){if(this.mConnections.next!==null)throw new A("Node can only be chained to a single node.",this);this.mConnections.next=t}};var j={XmlIdentifier:"Identifier",XmlAssignment:"XmlAssignment",XmlValue:"XmlValue",XmlComment:"XmlComment",XmlOpenClosingBracket:"XmlOpenClosingBracket",XmlCloseBracket:"XmlCloseBracket",XmlOpenBracket:"XmlOpenBracket",XmlCloseClosingBracket:"XmlCloseClosingBracket",XmlExplicitValueIdentifier:"XmlExplicitValueIdentifier",ExpressionStart:"ExpressionStart",ExpressionEnd:"ExpressionEnd",ExpressionValue:"ExpressionValue",InstructionStart:"InstructionStart",InstructionInstructionValue:"InstructionInstructionValue",InstructionBodyStartBraket:"InstructionBodyStartBraket",InstructionBodyCloseBraket:"InstructionBodyCloseBraket",InstructionInstructionClosingBracket:"InstructionInstructionClosingBracket",InstructionInstructionOpeningBracket:"InstructionInstructionOpeningBracket"};var Me=class extends ce{constructor(){super(),this.validWhitespaces=` 
\r`,this.trimWhitespace=!0;let t=this.createTokenPattern({pattern:{regex:/(?:(?!}}).)*/,type:j.ExpressionValue}}),e=this.createTokenPattern({pattern:{start:{regex:/{{/,type:j.ExpressionStart},end:{regex:/}}/,type:j.ExpressionEnd}}},s=>{s.useChildPattern(t)}),o=this.createTokenPattern({pattern:{regex:/[^>\s\n="/]+/,type:j.XmlIdentifier}}),c=this.createTokenPattern({pattern:{regex:/(?:(?!{{|"|<).)+/,type:j.XmlValue}}),p=this.createTokenPattern({pattern:{regex:/<!--.*?-->/,type:j.XmlComment}}),v=this.createTokenPattern({pattern:{regex:/=/,type:j.XmlAssignment}}),b=this.createTokenPattern({pattern:{start:{regex:/"/,type:j.XmlExplicitValueIdentifier},end:{regex:/"/,type:j.XmlExplicitValueIdentifier}}},s=>{s.useChildPattern(e),s.useChildPattern(c)}),I=this.createTokenPattern({pattern:{start:{regex:/<\//,type:j.XmlOpenClosingBracket},end:{regex:/>/,type:j.XmlCloseBracket}}},s=>{s.useChildPattern(o)}),P=this.createTokenPattern({pattern:{start:{regex:/</,type:j.XmlOpenBracket},end:{regex:/(?<closeClosingBracket>\/>)|(?<closeBracket>>)/,type:{closeClosingBracket:j.XmlCloseClosingBracket,closeBracket:j.XmlCloseBracket}}}},s=>{s.useChildPattern(v),s.useChildPattern(o),s.useChildPattern(b)}),a=this.createTokenPattern({pattern:{regex:/[^()"'`/)]+/,type:j.InstructionInstructionValue}}),n=this.createTokenPattern({pattern:{innerType:j.InstructionInstructionValue,start:{regex:/\//,type:j.InstructionInstructionValue},end:{regex:/\//,type:j.InstructionInstructionValue}}},s=>{s.useChildPattern(l),s.useChildPattern(r),s.useChildPattern(y),s.useChildPattern(u),s.useChildPattern(a)}),u=this.createTokenPattern({pattern:{innerType:j.InstructionInstructionValue,start:{regex:/\(/,type:j.InstructionInstructionValue},end:{regex:/\)/,type:j.InstructionInstructionValue}}},s=>{s.useChildPattern(n),s.useChildPattern(l),s.useChildPattern(r),s.useChildPattern(y),s.useChildPattern(a)}),l=this.createTokenPattern({pattern:{innerType:j.InstructionInstructionValue,start:{regex:/"/,type:j.InstructionInstructionValue},end:{regex:/"/,type:j.InstructionInstructionValue}}},s=>{s.useChildPattern(n),s.useChildPattern(r),s.useChildPattern(y),s.useChildPattern(u),s.useChildPattern(a)}),r=this.createTokenPattern({pattern:{innerType:j.InstructionInstructionValue,start:{regex:/'/,type:j.InstructionInstructionValue},end:{regex:/'/,type:j.InstructionInstructionValue}}},s=>{s.useChildPattern(n),s.useChildPattern(l),s.useChildPattern(y),s.useChildPattern(u),s.useChildPattern(a)}),y=this.createTokenPattern({pattern:{innerType:j.InstructionInstructionValue,start:{regex:/`/,type:j.InstructionInstructionValue},end:{regex:/`/,type:j.InstructionInstructionValue}}},s=>{s.useChildPattern(n),s.useChildPattern(l),s.useChildPattern(r),s.useChildPattern(u),s.useChildPattern(a)}),g=this.createTokenPattern({pattern:{regex:/\$[^(\s\n/{]+/,type:j.InstructionStart}}),T=this.createTokenPattern({pattern:{start:{regex:/\(/,type:j.InstructionInstructionOpeningBracket},end:{regex:/\)/,type:j.InstructionInstructionClosingBracket}}},s=>{s.useChildPattern(n),s.useChildPattern(l),s.useChildPattern(r),s.useChildPattern(y),s.useChildPattern(u),s.useChildPattern(a)}),w=this.createTokenPattern({pattern:{start:{regex:/{/,type:j.InstructionBodyStartBraket},end:{regex:/}/,type:j.InstructionBodyCloseBraket}}},s=>{for(let m of d)s.useChildPattern(m)}),d=[p,I,P,b,e,g,T,w,c];for(let s of d)this.useRootTokenPattern(s)}};var he=class extends ue{constructor(){super(new Me),this.initGraph()}initGraph(){let t=q.define(()=>G.new().required(j.ExpressionStart).optional("value",j.ExpressionValue).required(j.ExpressionEnd)).converter(r=>new gt(r.value??"")),e=q.define(()=>{let r=e;return G.new().required("data[]",G.new().required("value",[t,G.new().required("text",j.XmlValue)])).optional("data<-data",r)}),o=q.define(()=>G.new().required("name",j.XmlIdentifier).optional("attributeValue",G.new().required(j.XmlAssignment).required(j.XmlExplicitValueIdentifier).optional("list<-data",e).required(j.XmlExplicitValueIdentifier))).converter(r=>{let y=new Array;if(r.attributeValue?.list)for(let g of r.attributeValue.list)g.value instanceof gt?y.push(g.value):y.push(g.value.text);return{name:r.name,values:y}}),c=q.define(()=>{let r=c;return G.new().required("data[]",o).optional("data<-data",r)}),p=q.define(()=>{let r=p;return G.new().required("data[]",G.new().required("value",[t,G.new().required("text",j.XmlValue),G.new().required(j.XmlExplicitValueIdentifier).required("text",j.XmlValue).required(j.XmlExplicitValueIdentifier)])).optional("data<-data",r)}),v=q.define(()=>G.new().required("list<-data",p)).converter(r=>{let y=new Dt;for(let g of r.list)g.value instanceof gt?y.addValue(g.value):y.addValue(g.value.text);return y}),b=q.define(()=>G.new().required(j.XmlComment)).converter(()=>null),I=q.define(()=>G.new().required(j.XmlOpenBracket).required("openingTagName",j.XmlIdentifier).optional("attributes<-data",c).required("closing",[G.new().required(j.XmlCloseClosingBracket),G.new().required(j.XmlCloseBracket).required("values",u).required(j.XmlOpenClosingBracket).required("closingTageName",j.XmlIdentifier).required(j.XmlCloseBracket)])).converter(r=>{if("closingTageName"in r.closing&&r.openingTagName!==r.closing.closingTageName)throw new A(`Opening (${r.openingTagName}) and closing tagname (${r.closing.closingTageName}) does not match`,this);let y=new It(r.openingTagName);if(r.attributes)for(let g of r.attributes)y.setAttribute(g.name).addValue(...g.values);return"values"in r.closing&&y.appendChild(...r.closing.values),y}),P=q.define(()=>{let r=P;return G.new().required("list[]",j.InstructionInstructionValue).optional("list<-list",r)}),a=q.define(()=>G.new().required("instructionName",j.InstructionStart).optional("instruction",G.new().required(j.InstructionInstructionOpeningBracket).required("value<-list",P).required(j.InstructionInstructionClosingBracket)).optional("body",G.new().required(j.InstructionBodyStartBraket).required("value",u).required(j.InstructionBodyCloseBraket))).converter(r=>{let y=r.instructionName.substring(1),g=r.instruction?.value.join("")??"",T=new Bt(y,g);return r.body&&T.appendChild(...r.body.value),T}),n=q.define(()=>{let r=n;return G.new().required("list[]",[b,I,a,v]).optional("list<-list",r)}),u=q.define(()=>{let r=n;return G.new().optional("list<-list",r)}).converter(r=>{let y=new Array;if(r.list)for(let g of r.list)g!==null&&y.push(g);return y}),l=q.define(()=>G.new().required("content",u)).converter(r=>{let y=new lt;return y.appendChild(...r.content),y});this.setRootGraph(l)}};var B=class f extends Te{static mTemplateCache=new k;static mXmlParser=new he;mComponentElement;mRootBuilder;get element(){return this.mComponentElement.htmlElement}constructor(t){super({constructor:t.processorConstructor,parent:null}),st.registerComponent(this,t.htmlElement),this.setProcessorInjection(f,this),this.addConstructionHook(o=>{st.registerComponent(this,this.mComponentElement.htmlElement,o)}),f.mTemplateCache.has(t.processorConstructor)||f.mTemplateCache.set(t.processorConstructor,f.mXmlParser.parse(t.templateString??""));let e=f.mTemplateCache.get(t.processorConstructor).clone();this.mComponentElement=new le(t.htmlElement),this.mRootBuilder=new Zt(e,new Se(this,t.expressionModule),new dt(this),"ROOT"),this.mComponentElement.shadowRoot.appendChild(this.mRootBuilder.anchor),this.setProcessorInjection(xt,new xt(this.mRootBuilder.values))}addStyle(t){let e=document.createElement("style");e.innerHTML=t,this.mComponentElement.shadowRoot.prepend(e)}attributeChanged(t,e,o){this.call("onAttributeChange",t,e,o)}connected(){this.call("onConnect")}deconstruct(){this.call("onDeconstruct"),this.mRootBuilder.deconstruct(),super.deconstruct()}disconnected(){this.call("onDisconnect")}onUpdate(){return this.mRootBuilder.update()?(this.call("onUpdate"),!0):!1}};function J(f){return(t,e)=>{O.registerInjectable(t,e.metadata,"instanced"),st.registerConstructor(t,f.selector);let o=class extends HTMLElement{mComponent;constructor(){super(),this.mComponent=new B({processorConstructor:t,templateString:f.template??null,expressionModule:f.expressionmodule,htmlElement:this}).setup(),f.style&&this.mComponent.addStyle(f.style),this.mComponent.updater.update()}connectedCallback(){this.mComponent.connected()}disconnectedCallback(){this.mComponent.disconnected()}};globalThis.customElements.define(f.selector,o)}}function Gt(f){return(t,e)=>{O.registerInjectable(t,e.metadata,"instanced"),at.register(Nt,t,{access:f.access,targetRestrictions:f.targetRestrictions})}}function yt(f){return(t,e)=>{O.registerInjectable(t,e.metadata,"instanced"),at.register(vt,t,{access:f.access,selector:f.selector})}}function St(f){return(t,e)=>{O.registerInjectable(t,e.metadata,"instanced"),at.register(Ft,t,{instructionType:f.instructionType})}}function Yi(){function f(a,n){return function(l){e(n,"addInitializer"),o(l,"An initializer"),a.push(l)}}function t(a,n,u,l,r,y,g,T,w){var d;switch(r){case 1:d="accessor";break;case 2:d="method";break;case 3:d="getter";break;case 4:d="setter";break;default:d="field"}var s={kind:d,name:g?"#"+n:n,static:y,private:g,metadata:T},m={v:!1};s.addInitializer=f(l,m);var i,h;r===0?g?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return a(w,s)}finally{m.v=!0}}function e(a,n){if(a.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(a,n){if(typeof a!="function")throw new TypeError(n+" must be a function")}function c(a,n){var u=typeof n;if(a===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function p(a,n,u,l,r,y,g,T,w){var d=u[0],s,m,i;g?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,S;if(typeof d=="function")h=t(d,l,s,T,r,y,g,w,i),h!==void 0&&(c(r,h),r===0?m=h:r===1?(m=h.init,x=h.get||i.get,S=h.set||i.set,i={get:x,set:S}):i=h);else for(var C=d.length-1;C>=0;C--){var M=d[C];if(h=t(M,l,s,T,r,y,g,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,S=h.set||i.set,i={get:x,set:S}):i=h,N!==void 0&&(m===void 0?m=N:typeof m=="function"?m=[m,N]:m.push(N))}}if(r===0||r===1){if(m===void 0)m=function(D,E){return E};else if(typeof m!="function"){var _=m;m=function(D,E){for(var L=E,R=0;R<_.length;R++)L=_[R].call(D,L);return L}}else{var $=m;m=function(D,E){return $.call(D,E)}}a.push(m)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),g?r===1?(a.push(function(D,E){return i.get.call(D,E)}),a.push(function(D,E){return i.set.call(D,E)})):r===2?a.push(i):a.push(function(D,E){return i.call(D,E)}):Object.defineProperty(n,l,s))}function v(a,n,u){for(var l=[],r,y,g=new Map,T=new Map,w=0;w<n.length;w++){var d=n[w];if(Array.isArray(d)){var s=d[1],m=d[2],i=d.length>3,h=s>=5,x,S;if(h?(x=a,s=s-5,y=y||[],S=y):(x=a.prototype,r=r||[],S=r),s!==0&&!i){var C=h?T:g,M=C.get(m)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+m);!M&&s>2?C.set(m,s):C.set(m,!0)}p(l,x,d,m,s,h,i,S,u)}}return b(l,r),b(l,y),l}function b(a,n){n&&a.push(function(u){for(var l=0;l<n.length;l++)n[l].call(u);return u})}function I(a,n,u){if(n.length>0){for(var l=[],r=a,y=a.name,g=n.length-1;g>=0;g--){var T={v:!1};try{var w=n[g](r,{kind:"class",name:y,addInitializer:f(l,T),metadata:u})}finally{T.v=!0}w!==void 0&&(c(10,w),r=w)}return[P(r,u),function(){for(var d=0;d<l.length;d++)l[d].call(r)}]}}function P(a,n){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,l,r){if(r!==void 0)var y=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(y===void 0?null:y),T=v(n,u,g);return l.length||P(n,g),{e:T,get c(){return I(n,l,g)}}}}function fr(f,t,e,o){return(fr=Yi())(f,t,e,o)}function Wi(f){return f}var gr,pr,me;gr=Gt({access:X.Read,targetRestrictions:[B]});new class extends Wi{constructor(){super(me),pr()}static{class f{static{({c:[me,pr]}=fr(this,[],[gr]))}static METADATA_USER_EVENT_LISTENER_PROPERIES="pwb:user_event_listener_properties";mEventListenerList;mTargetElement;constructor(e=O.use(B)){let o=new Array,c=e.processorConstructor;do{let p=rt.get(c).getMetadata(f.METADATA_USER_EVENT_LISTENER_PROPERIES);if(p)for(let v of p)o.push(v)}while(c=Object.getPrototypeOf(c));this.mEventListenerList=new Array,this.mTargetElement=e.element;for(let p of o){let[v,b]=p,I=Reflect.get(e.processor,v);I=I.bind(e.processor),this.mEventListenerList.push([b,I]),this.mTargetElement.addEventListener(b,I)}}onDeconstruct(){for(let e of this.mEventListenerList){let[o,c]=e;this.mTargetElement.removeEventListener(o,c)}}}}};var de=class extends window.Event{mValue;get value(){return this.mValue}constructor(t,e){super(t),this.mValue=e}};var pe=class{mElement;mEventName;constructor(t,e){this.mEventName=t,this.mElement=e}dispatchEvent(t){let e=new de(this.mEventName,t);this.mElement.dispatchEvent(e)}};function ut(f){return(t,e)=>{if(e.static)throw new A("Event target is not for a static property.",ut);let o=null;return{get(){if(!o){let c=(()=>{try{return st.ofProcessor(this).component}catch{throw new A("PwbComponentEvent target class is not a component.",this)}})();o=new pe(f,c.element)}return o}}}}function Zi(){function f(a,n){return function(l){e(n,"addInitializer"),o(l,"An initializer"),a.push(l)}}function t(a,n,u,l,r,y,g,T,w){var d;switch(r){case 1:d="accessor";break;case 2:d="method";break;case 3:d="getter";break;case 4:d="setter";break;default:d="field"}var s={kind:d,name:g?"#"+n:n,static:y,private:g,metadata:T},m={v:!1};s.addInitializer=f(l,m);var i,h;r===0?g?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return a(w,s)}finally{m.v=!0}}function e(a,n){if(a.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(a,n){if(typeof a!="function")throw new TypeError(n+" must be a function")}function c(a,n){var u=typeof n;if(a===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function p(a,n,u,l,r,y,g,T,w){var d=u[0],s,m,i;g?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,S;if(typeof d=="function")h=t(d,l,s,T,r,y,g,w,i),h!==void 0&&(c(r,h),r===0?m=h:r===1?(m=h.init,x=h.get||i.get,S=h.set||i.set,i={get:x,set:S}):i=h);else for(var C=d.length-1;C>=0;C--){var M=d[C];if(h=t(M,l,s,T,r,y,g,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,S=h.set||i.set,i={get:x,set:S}):i=h,N!==void 0&&(m===void 0?m=N:typeof m=="function"?m=[m,N]:m.push(N))}}if(r===0||r===1){if(m===void 0)m=function(D,E){return E};else if(typeof m!="function"){var _=m;m=function(D,E){for(var L=E,R=0;R<_.length;R++)L=_[R].call(D,L);return L}}else{var $=m;m=function(D,E){return $.call(D,E)}}a.push(m)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),g?r===1?(a.push(function(D,E){return i.get.call(D,E)}),a.push(function(D,E){return i.set.call(D,E)})):r===2?a.push(i):a.push(function(D,E){return i.call(D,E)}):Object.defineProperty(n,l,s))}function v(a,n,u){for(var l=[],r,y,g=new Map,T=new Map,w=0;w<n.length;w++){var d=n[w];if(Array.isArray(d)){var s=d[1],m=d[2],i=d.length>3,h=s>=5,x,S;if(h?(x=a,s=s-5,y=y||[],S=y):(x=a.prototype,r=r||[],S=r),s!==0&&!i){var C=h?T:g,M=C.get(m)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+m);!M&&s>2?C.set(m,s):C.set(m,!0)}p(l,x,d,m,s,h,i,S,u)}}return b(l,r),b(l,y),l}function b(a,n){n&&a.push(function(u){for(var l=0;l<n.length;l++)n[l].call(u);return u})}function I(a,n,u){if(n.length>0){for(var l=[],r=a,y=a.name,g=n.length-1;g>=0;g--){var T={v:!1};try{var w=n[g](r,{kind:"class",name:y,addInitializer:f(l,T),metadata:u})}finally{T.v=!0}w!==void 0&&(c(10,w),r=w)}return[P(r,u),function(){for(var d=0;d<l.length;d++)l[d].call(r)}]}}function P(a,n){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,l,r){if(r!==void 0)var y=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(y===void 0?null:y),T=v(n,u,g);return l.length||P(n,g),{e:T,get c(){return I(n,l,g)}}}}function yr(f,t,e,o){return(yr=Zi())(f,t,e,o)}function qi(f){return f}var br,vr,fe;br=Gt({access:X.ReadWrite,targetRestrictions:[B]});new class extends qi{constructor(){super(fe),vr()}static{class f{static{({c:[fe,vr]}=yr(this,[],[br]))}static METADATA_EXPORTED_PROPERTIES="pwb:exported_properties";mComponent;constructor(e=O.use(B)){this.mComponent=e;let o=new $t,c=e.processorConstructor;do{let v=rt.get(c).getMetadata(f.METADATA_EXPORTED_PROPERTIES);v&&o.push(...v)}while(c=Object.getPrototypeOf(c));let p=new Set(o);p.size>0&&this.connectExportedProperties(p)}connectExportedProperties(e){this.exportPropertyAsAttribute(e),this.patchHtmlAttributes(e)}exportPropertyAsAttribute(e){for(let o of e){let c={};c.enumerable=!0,c.configurable=!0,delete c.value,delete c.writable,c.set=p=>{Reflect.set(this.mComponent.processor,o,p)},c.get=()=>{let p=Reflect.get(this.mComponent.processor,o);return typeof p=="function"&&(p=p.bind(this.mComponent.processor)),p},Object.defineProperty(this.mComponent.element,o,c)}}patchHtmlAttributes(e){let o=this.mComponent.element.getAttribute;new MutationObserver(p=>{for(let v of p){let b=v.attributeName,I=o.call(this.mComponent.element,b);Reflect.set(this.mComponent.element,b,I),this.mComponent.attributeChanged(b,v.oldValue,I)}}).observe(this.mComponent.element,{attributeFilter:[...e],attributeOldValue:!0});for(let p of e)if(this.mComponent.element.hasAttribute(p)){let v=o.call(this.mComponent.element,p);this.mComponent.element.setAttribute(p,v)}this.mComponent.element.getAttribute=p=>e.has(p)?Reflect.get(this.mComponent.element,p):o.call(this.mComponent.element,p)}}}};function tt(f,t){if(t.static)throw new A("Event target is not for a static property.",tt);let e=rt.forInternalDecorator(t.metadata),o=e.getMetadata(fe.METADATA_EXPORTED_PROPERTIES)??new Array;o.push(t.name),e.setMetadata(fe.METADATA_EXPORTED_PROPERTIES,o)}function nt(f){return(t,e)=>{if(e.static)throw new A("Child decorator is not for a static property.",nt);return{get(){let p=(()=>{try{return st.ofProcessor(this).component}catch{throw new A("PwbChild target class is not a component.",this)}})().getProcessorInjection(xt).data.store[f];if(p instanceof Element)return p;throw new A(`Can't find child "${f}".`,this)}}}}function Ji(){function f(a,n){return function(l){e(n,"addInitializer"),o(l,"An initializer"),a.push(l)}}function t(a,n,u,l,r,y,g,T,w){var d;switch(r){case 1:d="accessor";break;case 2:d="method";break;case 3:d="getter";break;case 4:d="setter";break;default:d="field"}var s={kind:d,name:g?"#"+n:n,static:y,private:g,metadata:T},m={v:!1};s.addInitializer=f(l,m);var i,h;r===0?g?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return a(w,s)}finally{m.v=!0}}function e(a,n){if(a.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(a,n){if(typeof a!="function")throw new TypeError(n+" must be a function")}function c(a,n){var u=typeof n;if(a===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function p(a,n,u,l,r,y,g,T,w){var d=u[0],s,m,i;g?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,S;if(typeof d=="function")h=t(d,l,s,T,r,y,g,w,i),h!==void 0&&(c(r,h),r===0?m=h:r===1?(m=h.init,x=h.get||i.get,S=h.set||i.set,i={get:x,set:S}):i=h);else for(var C=d.length-1;C>=0;C--){var M=d[C];if(h=t(M,l,s,T,r,y,g,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,S=h.set||i.set,i={get:x,set:S}):i=h,N!==void 0&&(m===void 0?m=N:typeof m=="function"?m=[m,N]:m.push(N))}}if(r===0||r===1){if(m===void 0)m=function(D,E){return E};else if(typeof m!="function"){var _=m;m=function(D,E){for(var L=E,R=0;R<_.length;R++)L=_[R].call(D,L);return L}}else{var $=m;m=function(D,E){return $.call(D,E)}}a.push(m)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),g?r===1?(a.push(function(D,E){return i.get.call(D,E)}),a.push(function(D,E){return i.set.call(D,E)})):r===2?a.push(i):a.push(function(D,E){return i.call(D,E)}):Object.defineProperty(n,l,s))}function v(a,n,u){for(var l=[],r,y,g=new Map,T=new Map,w=0;w<n.length;w++){var d=n[w];if(Array.isArray(d)){var s=d[1],m=d[2],i=d.length>3,h=s>=5,x,S;if(h?(x=a,s=s-5,y=y||[],S=y):(x=a.prototype,r=r||[],S=r),s!==0&&!i){var C=h?T:g,M=C.get(m)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+m);!M&&s>2?C.set(m,s):C.set(m,!0)}p(l,x,d,m,s,h,i,S,u)}}return b(l,r),b(l,y),l}function b(a,n){n&&a.push(function(u){for(var l=0;l<n.length;l++)n[l].call(u);return u})}function I(a,n,u){if(n.length>0){for(var l=[],r=a,y=a.name,g=n.length-1;g>=0;g--){var T={v:!1};try{var w=n[g](r,{kind:"class",name:y,addInitializer:f(l,T),metadata:u})}finally{T.v=!0}w!==void 0&&(c(10,w),r=w)}return[P(r,u),function(){for(var d=0;d<l.length;d++)l[d].call(r)}]}}function P(a,n){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,l,r){if(r!==void 0)var y=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(y===void 0?null:y),T=v(n,u,g);return l.length||P(n,g),{e:T,get c(){return I(n,l,g)}}}}function Tr(f,t,e,o){return(Tr=Ji())(f,t,e,o)}var Er,wr,Ki;Er=St({instructionType:"dynamic-content"});var xr=class{static{({c:[Ki,wr]}=Tr(this,[],[Er]))}constructor(t=O.use(Q),e=O.use(H)){this.mModuleValues=e,this.mLastTemplate=null,this.mProcedure=this.mModuleValues.createExpressionProcedure(t.value)}mLastTemplate;mModuleValues;mProcedure;onUpdate(){let t=this.mProcedure.execute();if(!t||!(t instanceof lt))throw new A("Dynamic content method has a wrong result type.",this);if(this.mLastTemplate!==null&&this.mLastTemplate.equals(t))return null;let e=t.clone();this.mLastTemplate=e;let o=new ct;return o.addElement(e,new dt(this.mModuleValues.data)),o}static{wr()}};function Qi(){function f(a,n){return function(l){e(n,"addInitializer"),o(l,"An initializer"),a.push(l)}}function t(a,n,u,l,r,y,g,T,w){var d;switch(r){case 1:d="accessor";break;case 2:d="method";break;case 3:d="getter";break;case 4:d="setter";break;default:d="field"}var s={kind:d,name:g?"#"+n:n,static:y,private:g,metadata:T},m={v:!1};s.addInitializer=f(l,m);var i,h;r===0?g?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return a(w,s)}finally{m.v=!0}}function e(a,n){if(a.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(a,n){if(typeof a!="function")throw new TypeError(n+" must be a function")}function c(a,n){var u=typeof n;if(a===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function p(a,n,u,l,r,y,g,T,w){var d=u[0],s,m,i;g?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,S;if(typeof d=="function")h=t(d,l,s,T,r,y,g,w,i),h!==void 0&&(c(r,h),r===0?m=h:r===1?(m=h.init,x=h.get||i.get,S=h.set||i.set,i={get:x,set:S}):i=h);else for(var C=d.length-1;C>=0;C--){var M=d[C];if(h=t(M,l,s,T,r,y,g,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,S=h.set||i.set,i={get:x,set:S}):i=h,N!==void 0&&(m===void 0?m=N:typeof m=="function"?m=[m,N]:m.push(N))}}if(r===0||r===1){if(m===void 0)m=function(D,E){return E};else if(typeof m!="function"){var _=m;m=function(D,E){for(var L=E,R=0;R<_.length;R++)L=_[R].call(D,L);return L}}else{var $=m;m=function(D,E){return $.call(D,E)}}a.push(m)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),g?r===1?(a.push(function(D,E){return i.get.call(D,E)}),a.push(function(D,E){return i.set.call(D,E)})):r===2?a.push(i):a.push(function(D,E){return i.call(D,E)}):Object.defineProperty(n,l,s))}function v(a,n,u){for(var l=[],r,y,g=new Map,T=new Map,w=0;w<n.length;w++){var d=n[w];if(Array.isArray(d)){var s=d[1],m=d[2],i=d.length>3,h=s>=5,x,S;if(h?(x=a,s=s-5,y=y||[],S=y):(x=a.prototype,r=r||[],S=r),s!==0&&!i){var C=h?T:g,M=C.get(m)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+m);!M&&s>2?C.set(m,s):C.set(m,!0)}p(l,x,d,m,s,h,i,S,u)}}return b(l,r),b(l,y),l}function b(a,n){n&&a.push(function(u){for(var l=0;l<n.length;l++)n[l].call(u);return u})}function I(a,n,u){if(n.length>0){for(var l=[],r=a,y=a.name,g=n.length-1;g>=0;g--){var T={v:!1};try{var w=n[g](r,{kind:"class",name:y,addInitializer:f(l,T),metadata:u})}finally{T.v=!0}w!==void 0&&(c(10,w),r=w)}return[P(r,u),function(){for(var d=0;d<l.length;d++)l[d].call(r)}]}}function P(a,n){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,l,r){if(r!==void 0)var y=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(y===void 0?null:y),T=v(n,u,g);return l.length||P(n,g),{e:T,get c(){return I(n,l,g)}}}}function Sr(f,t,e,o){return(Sr=Qi())(f,t,e,o)}var Pr,Dr,ki;Pr=yt({access:X.Write,selector:/^\([[\w\-$]+\)$/});var Ir=class{static{({c:[ki,Dr]}=Sr(this,[],[Pr]))}constructor(t=O.use(Z),e=O.use(H),o=O.use(et)){this.mTarget=t,this.mEventName=o.name.substring(1,o.name.length-1);let c=e.createExpressionProcedure(o.value,["$event"]);this.mListener=p=>{c.setTemporaryValue("$event",p),c.execute()},this.mTarget.addEventListener(this.mEventName,this.mListener)}mEventName;mListener;mTarget;onDeconstruct(){this.mTarget.removeEventListener(this.mEventName,this.mListener)}static{Dr()}};function ts(){function f(a,n){return function(l){e(n,"addInitializer"),o(l,"An initializer"),a.push(l)}}function t(a,n,u,l,r,y,g,T,w){var d;switch(r){case 1:d="accessor";break;case 2:d="method";break;case 3:d="getter";break;case 4:d="setter";break;default:d="field"}var s={kind:d,name:g?"#"+n:n,static:y,private:g,metadata:T},m={v:!1};s.addInitializer=f(l,m);var i,h;r===0?g?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return a(w,s)}finally{m.v=!0}}function e(a,n){if(a.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(a,n){if(typeof a!="function")throw new TypeError(n+" must be a function")}function c(a,n){var u=typeof n;if(a===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function p(a,n,u,l,r,y,g,T,w){var d=u[0],s,m,i;g?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,S;if(typeof d=="function")h=t(d,l,s,T,r,y,g,w,i),h!==void 0&&(c(r,h),r===0?m=h:r===1?(m=h.init,x=h.get||i.get,S=h.set||i.set,i={get:x,set:S}):i=h);else for(var C=d.length-1;C>=0;C--){var M=d[C];if(h=t(M,l,s,T,r,y,g,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,S=h.set||i.set,i={get:x,set:S}):i=h,N!==void 0&&(m===void 0?m=N:typeof m=="function"?m=[m,N]:m.push(N))}}if(r===0||r===1){if(m===void 0)m=function(D,E){return E};else if(typeof m!="function"){var _=m;m=function(D,E){for(var L=E,R=0;R<_.length;R++)L=_[R].call(D,L);return L}}else{var $=m;m=function(D,E){return $.call(D,E)}}a.push(m)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),g?r===1?(a.push(function(D,E){return i.get.call(D,E)}),a.push(function(D,E){return i.set.call(D,E)})):r===2?a.push(i):a.push(function(D,E){return i.call(D,E)}):Object.defineProperty(n,l,s))}function v(a,n,u){for(var l=[],r,y,g=new Map,T=new Map,w=0;w<n.length;w++){var d=n[w];if(Array.isArray(d)){var s=d[1],m=d[2],i=d.length>3,h=s>=5,x,S;if(h?(x=a,s=s-5,y=y||[],S=y):(x=a.prototype,r=r||[],S=r),s!==0&&!i){var C=h?T:g,M=C.get(m)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+m);!M&&s>2?C.set(m,s):C.set(m,!0)}p(l,x,d,m,s,h,i,S,u)}}return b(l,r),b(l,y),l}function b(a,n){n&&a.push(function(u){for(var l=0;l<n.length;l++)n[l].call(u);return u})}function I(a,n,u){if(n.length>0){for(var l=[],r=a,y=a.name,g=n.length-1;g>=0;g--){var T={v:!1};try{var w=n[g](r,{kind:"class",name:y,addInitializer:f(l,T),metadata:u})}finally{T.v=!0}w!==void 0&&(c(10,w),r=w)}return[P(r,u),function(){for(var d=0;d<l.length;d++)l[d].call(r)}]}}function P(a,n){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,l,r){if(r!==void 0)var y=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(y===void 0?null:y),T=v(n,u,g);return l.length||P(n,g),{e:T,get c(){return I(n,l,g)}}}}function Nr(f,t,e,o){return(Nr=ts())(f,t,e,o)}var Ar,Cr,es;Ar=St({instructionType:"for"});var Mr=class{static{({c:[es,Cr]}=Nr(this,[],[Ar]))}constructor(t=O.use(pt),e=O.use(H),o=O.use(Q)){this.mTemplate=t,this.mModuleValues=e,this.mLastEntries=new Array;let c=o.value,v=new RegExp(/^\s*([a-zA-Z]+[a-zA-Z0-9]*)\s*of\s+([^;]+)\s*(;\s*([a-zA-Z]+[a-zA-Z0-9]*)\s*=\s*(.*)\s*)?$/).exec(c);if(!v)throw new A(`For-Parameter value has wrong format: ${c}`,this);let b=v[1],I=v[2],P=v[4]??null,a=v[5],n=this.mModuleValues.createExpressionProcedure(I),u=P?this.mModuleValues.createExpressionProcedure(a,["$index",b]):null;this.mExpression={iterateVariableName:b,iterateValueProcedure:n,indexExportVariableName:P,indexExportProcedure:u}}mExpression;mLastEntries;mModuleValues;mTemplate;onUpdate(){let t=new ct,e=this.mExpression.iterateValueProcedure.execute();if(typeof e=="object"&&e!==null||Array.isArray(e)){let o=Symbol.iterator in e?Object.entries([...e]):Object.entries(e);if(this.compareEntries(o,this.mLastEntries))return null;this.mLastEntries=o;for(let[c,p]of o)this.addTemplateForElement(t,this.mExpression,p,c);return t}else return null}addTemplateForElement=(t,e,o,c)=>{let p=new dt(this.mModuleValues.data);if(p.setTemporaryValue(e.iterateVariableName,o),e.indexExportProcedure&&e.indexExportVariableName){e.indexExportProcedure.setTemporaryValue("$index",c),e.indexExportProcedure.setTemporaryValue(e.iterateVariableName,o);let b=e.indexExportProcedure.execute();p.setTemporaryValue(e.indexExportVariableName,b)}let v=new lt;v.appendChild(...this.mTemplate.childList),t.addElement(v,p)};compareEntries(t,e){if(t.length!==e.length)return!1;for(let o=0;o<t.length;o++){let[c,p]=t[o],[v,b]=e[o];if(c!==v||p!==b)return!1}return!0}static{Cr()}};function rs(){function f(a,n){return function(l){e(n,"addInitializer"),o(l,"An initializer"),a.push(l)}}function t(a,n,u,l,r,y,g,T,w){var d;switch(r){case 1:d="accessor";break;case 2:d="method";break;case 3:d="getter";break;case 4:d="setter";break;default:d="field"}var s={kind:d,name:g?"#"+n:n,static:y,private:g,metadata:T},m={v:!1};s.addInitializer=f(l,m);var i,h;r===0?g?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return a(w,s)}finally{m.v=!0}}function e(a,n){if(a.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(a,n){if(typeof a!="function")throw new TypeError(n+" must be a function")}function c(a,n){var u=typeof n;if(a===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function p(a,n,u,l,r,y,g,T,w){var d=u[0],s,m,i;g?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,S;if(typeof d=="function")h=t(d,l,s,T,r,y,g,w,i),h!==void 0&&(c(r,h),r===0?m=h:r===1?(m=h.init,x=h.get||i.get,S=h.set||i.set,i={get:x,set:S}):i=h);else for(var C=d.length-1;C>=0;C--){var M=d[C];if(h=t(M,l,s,T,r,y,g,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,S=h.set||i.set,i={get:x,set:S}):i=h,N!==void 0&&(m===void 0?m=N:typeof m=="function"?m=[m,N]:m.push(N))}}if(r===0||r===1){if(m===void 0)m=function(D,E){return E};else if(typeof m!="function"){var _=m;m=function(D,E){for(var L=E,R=0;R<_.length;R++)L=_[R].call(D,L);return L}}else{var $=m;m=function(D,E){return $.call(D,E)}}a.push(m)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),g?r===1?(a.push(function(D,E){return i.get.call(D,E)}),a.push(function(D,E){return i.set.call(D,E)})):r===2?a.push(i):a.push(function(D,E){return i.call(D,E)}):Object.defineProperty(n,l,s))}function v(a,n,u){for(var l=[],r,y,g=new Map,T=new Map,w=0;w<n.length;w++){var d=n[w];if(Array.isArray(d)){var s=d[1],m=d[2],i=d.length>3,h=s>=5,x,S;if(h?(x=a,s=s-5,y=y||[],S=y):(x=a.prototype,r=r||[],S=r),s!==0&&!i){var C=h?T:g,M=C.get(m)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+m);!M&&s>2?C.set(m,s):C.set(m,!0)}p(l,x,d,m,s,h,i,S,u)}}return b(l,r),b(l,y),l}function b(a,n){n&&a.push(function(u){for(var l=0;l<n.length;l++)n[l].call(u);return u})}function I(a,n,u){if(n.length>0){for(var l=[],r=a,y=a.name,g=n.length-1;g>=0;g--){var T={v:!1};try{var w=n[g](r,{kind:"class",name:y,addInitializer:f(l,T),metadata:u})}finally{T.v=!0}w!==void 0&&(c(10,w),r=w)}return[P(r,u),function(){for(var d=0;d<l.length;d++)l[d].call(r)}]}}function P(a,n){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,l,r){if(r!==void 0)var y=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(y===void 0?null:y),T=v(n,u,g);return l.length||P(n,g),{e:T,get c(){return I(n,l,g)}}}}function Or(f,t,e,o){return(Or=rs())(f,t,e,o)}var _r,Lr,os;_r=St({instructionType:"if"});var Rr=class{static{({c:[os,Lr]}=Or(this,[],[_r]))}constructor(t=O.use(pt),e=O.use(H),o=O.use(Q)){this.mTemplateReference=t,this.mModuleValues=e,this.mProcedure=this.mModuleValues.createExpressionProcedure(o.value),this.mLastBoolean=!1}mLastBoolean;mModuleValues;mProcedure;mTemplateReference;onUpdate(){let t=this.mProcedure.execute();if(!!t!==this.mLastBoolean){this.mLastBoolean=!!t;let e=new ct;if(t){let o=new lt;o.appendChild(...this.mTemplateReference.childList),e.addElement(o,new dt(this.mModuleValues.data))}return e}else return null}static{Lr()}};function ns(){function f(a,n){return function(l){e(n,"addInitializer"),o(l,"An initializer"),a.push(l)}}function t(a,n,u,l,r,y,g,T,w){var d;switch(r){case 1:d="accessor";break;case 2:d="method";break;case 3:d="getter";break;case 4:d="setter";break;default:d="field"}var s={kind:d,name:g?"#"+n:n,static:y,private:g,metadata:T},m={v:!1};s.addInitializer=f(l,m);var i,h;r===0?g?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return a(w,s)}finally{m.v=!0}}function e(a,n){if(a.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(a,n){if(typeof a!="function")throw new TypeError(n+" must be a function")}function c(a,n){var u=typeof n;if(a===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function p(a,n,u,l,r,y,g,T,w){var d=u[0],s,m,i;g?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,S;if(typeof d=="function")h=t(d,l,s,T,r,y,g,w,i),h!==void 0&&(c(r,h),r===0?m=h:r===1?(m=h.init,x=h.get||i.get,S=h.set||i.set,i={get:x,set:S}):i=h);else for(var C=d.length-1;C>=0;C--){var M=d[C];if(h=t(M,l,s,T,r,y,g,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,S=h.set||i.set,i={get:x,set:S}):i=h,N!==void 0&&(m===void 0?m=N:typeof m=="function"?m=[m,N]:m.push(N))}}if(r===0||r===1){if(m===void 0)m=function(D,E){return E};else if(typeof m!="function"){var _=m;m=function(D,E){for(var L=E,R=0;R<_.length;R++)L=_[R].call(D,L);return L}}else{var $=m;m=function(D,E){return $.call(D,E)}}a.push(m)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),g?r===1?(a.push(function(D,E){return i.get.call(D,E)}),a.push(function(D,E){return i.set.call(D,E)})):r===2?a.push(i):a.push(function(D,E){return i.call(D,E)}):Object.defineProperty(n,l,s))}function v(a,n,u){for(var l=[],r,y,g=new Map,T=new Map,w=0;w<n.length;w++){var d=n[w];if(Array.isArray(d)){var s=d[1],m=d[2],i=d.length>3,h=s>=5,x,S;if(h?(x=a,s=s-5,y=y||[],S=y):(x=a.prototype,r=r||[],S=r),s!==0&&!i){var C=h?T:g,M=C.get(m)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+m);!M&&s>2?C.set(m,s):C.set(m,!0)}p(l,x,d,m,s,h,i,S,u)}}return b(l,r),b(l,y),l}function b(a,n){n&&a.push(function(u){for(var l=0;l<n.length;l++)n[l].call(u);return u})}function I(a,n,u){if(n.length>0){for(var l=[],r=a,y=a.name,g=n.length-1;g>=0;g--){var T={v:!1};try{var w=n[g](r,{kind:"class",name:y,addInitializer:f(l,T),metadata:u})}finally{T.v=!0}w!==void 0&&(c(10,w),r=w)}return[P(r,u),function(){for(var d=0;d<l.length;d++)l[d].call(r)}]}}function P(a,n){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,l,r){if(r!==void 0)var y=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(y===void 0?null:y),T=v(n,u,g);return l.length||P(n,g),{e:T,get c(){return I(n,l,g)}}}}function $r(f,t,e,o){return($r=ns())(f,t,e,o)}var Vr,Fr,is;Vr=yt({access:X.Read,selector:/^\[[\w$]+\]$/});var jr=class{static{({c:[is,Fr]}=$r(this,[],[Vr]))}constructor(t=O.use(Z),e=O.use(H),o=O.use(et)){this.mTarget=t,this.mProcedure=e.createExpressionProcedure(o.value),this.mTargetProperty=o.name.substring(1,o.name.length-1),this.mLastValue=Symbol("Uncomparable")}mLastValue;mProcedure;mTarget;mTargetProperty;onUpdate(){let t=this.mProcedure.execute();return t===this.mLastValue?!1:(this.mLastValue=t,Reflect.set(this.mTarget,this.mTargetProperty,t),!0)}static{Fr()}};function ss(){function f(a,n){return function(l){e(n,"addInitializer"),o(l,"An initializer"),a.push(l)}}function t(a,n,u,l,r,y,g,T,w){var d;switch(r){case 1:d="accessor";break;case 2:d="method";break;case 3:d="getter";break;case 4:d="setter";break;default:d="field"}var s={kind:d,name:g?"#"+n:n,static:y,private:g,metadata:T},m={v:!1};s.addInitializer=f(l,m);var i,h;r===0?g?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return a(w,s)}finally{m.v=!0}}function e(a,n){if(a.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(a,n){if(typeof a!="function")throw new TypeError(n+" must be a function")}function c(a,n){var u=typeof n;if(a===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function p(a,n,u,l,r,y,g,T,w){var d=u[0],s,m,i;g?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,S;if(typeof d=="function")h=t(d,l,s,T,r,y,g,w,i),h!==void 0&&(c(r,h),r===0?m=h:r===1?(m=h.init,x=h.get||i.get,S=h.set||i.set,i={get:x,set:S}):i=h);else for(var C=d.length-1;C>=0;C--){var M=d[C];if(h=t(M,l,s,T,r,y,g,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,S=h.set||i.set,i={get:x,set:S}):i=h,N!==void 0&&(m===void 0?m=N:typeof m=="function"?m=[m,N]:m.push(N))}}if(r===0||r===1){if(m===void 0)m=function(D,E){return E};else if(typeof m!="function"){var _=m;m=function(D,E){for(var L=E,R=0;R<_.length;R++)L=_[R].call(D,L);return L}}else{var $=m;m=function(D,E){return $.call(D,E)}}a.push(m)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),g?r===1?(a.push(function(D,E){return i.get.call(D,E)}),a.push(function(D,E){return i.set.call(D,E)})):r===2?a.push(i):a.push(function(D,E){return i.call(D,E)}):Object.defineProperty(n,l,s))}function v(a,n,u){for(var l=[],r,y,g=new Map,T=new Map,w=0;w<n.length;w++){var d=n[w];if(Array.isArray(d)){var s=d[1],m=d[2],i=d.length>3,h=s>=5,x,S;if(h?(x=a,s=s-5,y=y||[],S=y):(x=a.prototype,r=r||[],S=r),s!==0&&!i){var C=h?T:g,M=C.get(m)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+m);!M&&s>2?C.set(m,s):C.set(m,!0)}p(l,x,d,m,s,h,i,S,u)}}return b(l,r),b(l,y),l}function b(a,n){n&&a.push(function(u){for(var l=0;l<n.length;l++)n[l].call(u);return u})}function I(a,n,u){if(n.length>0){for(var l=[],r=a,y=a.name,g=n.length-1;g>=0;g--){var T={v:!1};try{var w=n[g](r,{kind:"class",name:y,addInitializer:f(l,T),metadata:u})}finally{T.v=!0}w!==void 0&&(c(10,w),r=w)}return[P(r,u),function(){for(var d=0;d<l.length;d++)l[d].call(r)}]}}function P(a,n){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,l,r){if(r!==void 0)var y=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(y===void 0?null:y),T=v(n,u,g);return l.length||P(n,g),{e:T,get c(){return I(n,l,g)}}}}function Ur(f,t,e,o){return(Ur=ss())(f,t,e,o)}var Gr,zr,as;Gr=yt({access:X.Write,selector:/^#[[\w$]+$/});var Br=class{static{({c:[as,zr]}=Ur(this,[],[Gr]))}constructor(t=O.use(Z),e=O.use(et),o=O.use(xt)){o.setTemporaryValue(e.name.substring(1),t)}static{zr()}};function ls(){function f(a,n){return function(l){e(n,"addInitializer"),o(l,"An initializer"),a.push(l)}}function t(a,n,u,l,r,y,g,T,w){var d;switch(r){case 1:d="accessor";break;case 2:d="method";break;case 3:d="getter";break;case 4:d="setter";break;default:d="field"}var s={kind:d,name:g?"#"+n:n,static:y,private:g,metadata:T},m={v:!1};s.addInitializer=f(l,m);var i,h;r===0?g?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return a(w,s)}finally{m.v=!0}}function e(a,n){if(a.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(a,n){if(typeof a!="function")throw new TypeError(n+" must be a function")}function c(a,n){var u=typeof n;if(a===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function p(a,n,u,l,r,y,g,T,w){var d=u[0],s,m,i;g?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,S;if(typeof d=="function")h=t(d,l,s,T,r,y,g,w,i),h!==void 0&&(c(r,h),r===0?m=h:r===1?(m=h.init,x=h.get||i.get,S=h.set||i.set,i={get:x,set:S}):i=h);else for(var C=d.length-1;C>=0;C--){var M=d[C];if(h=t(M,l,s,T,r,y,g,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,S=h.set||i.set,i={get:x,set:S}):i=h,N!==void 0&&(m===void 0?m=N:typeof m=="function"?m=[m,N]:m.push(N))}}if(r===0||r===1){if(m===void 0)m=function(D,E){return E};else if(typeof m!="function"){var _=m;m=function(D,E){for(var L=E,R=0;R<_.length;R++)L=_[R].call(D,L);return L}}else{var $=m;m=function(D,E){return $.call(D,E)}}a.push(m)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),g?r===1?(a.push(function(D,E){return i.get.call(D,E)}),a.push(function(D,E){return i.set.call(D,E)})):r===2?a.push(i):a.push(function(D,E){return i.call(D,E)}):Object.defineProperty(n,l,s))}function v(a,n,u){for(var l=[],r,y,g=new Map,T=new Map,w=0;w<n.length;w++){var d=n[w];if(Array.isArray(d)){var s=d[1],m=d[2],i=d.length>3,h=s>=5,x,S;if(h?(x=a,s=s-5,y=y||[],S=y):(x=a.prototype,r=r||[],S=r),s!==0&&!i){var C=h?T:g,M=C.get(m)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+m);!M&&s>2?C.set(m,s):C.set(m,!0)}p(l,x,d,m,s,h,i,S,u)}}return b(l,r),b(l,y),l}function b(a,n){n&&a.push(function(u){for(var l=0;l<n.length;l++)n[l].call(u);return u})}function I(a,n,u){if(n.length>0){for(var l=[],r=a,y=a.name,g=n.length-1;g>=0;g--){var T={v:!1};try{var w=n[g](r,{kind:"class",name:y,addInitializer:f(l,T),metadata:u})}finally{T.v=!0}w!==void 0&&(c(10,w),r=w)}return[P(r,u),function(){for(var d=0;d<l.length;d++)l[d].call(r)}]}}function P(a,n){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,l,r){if(r!==void 0)var y=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(y===void 0?null:y),T=v(n,u,g);return l.length||P(n,g),{e:T,get c(){return I(n,l,g)}}}}function Yr(f,t,e,o){return(Yr=ls())(f,t,e,o)}var Wr,Hr,cs;Wr=St({instructionType:"slot"});var Xr=class{static{({c:[cs,Hr]}=Yr(this,[],[Wr]))}constructor(t=O.use(H),e=O.use(Q)){this.mModuleValues=t,this.mSlotName=e.value,this.mIsSetup=!1}mIsSetup;mModuleValues;mSlotName;onUpdate(){if(this.mIsSetup)return null;this.mIsSetup=!0;let t=new It("slot");this.mSlotName!==""&&t.setAttribute("name").addValue(this.mSlotName);let e=new lt;e.appendChild(t);let o=new ct;return o.addElement(e,this.mModuleValues.data),o}static{Hr()}};function us(){function f(a,n){return function(l){e(n,"addInitializer"),o(l,"An initializer"),a.push(l)}}function t(a,n,u,l,r,y,g,T,w){var d;switch(r){case 1:d="accessor";break;case 2:d="method";break;case 3:d="getter";break;case 4:d="setter";break;default:d="field"}var s={kind:d,name:g?"#"+n:n,static:y,private:g,metadata:T},m={v:!1};s.addInitializer=f(l,m);var i,h;r===0?g?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return a(w,s)}finally{m.v=!0}}function e(a,n){if(a.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(a,n){if(typeof a!="function")throw new TypeError(n+" must be a function")}function c(a,n){var u=typeof n;if(a===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function p(a,n,u,l,r,y,g,T,w){var d=u[0],s,m,i;g?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,S;if(typeof d=="function")h=t(d,l,s,T,r,y,g,w,i),h!==void 0&&(c(r,h),r===0?m=h:r===1?(m=h.init,x=h.get||i.get,S=h.set||i.set,i={get:x,set:S}):i=h);else for(var C=d.length-1;C>=0;C--){var M=d[C];if(h=t(M,l,s,T,r,y,g,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,S=h.set||i.set,i={get:x,set:S}):i=h,N!==void 0&&(m===void 0?m=N:typeof m=="function"?m=[m,N]:m.push(N))}}if(r===0||r===1){if(m===void 0)m=function(D,E){return E};else if(typeof m!="function"){var _=m;m=function(D,E){for(var L=E,R=0;R<_.length;R++)L=_[R].call(D,L);return L}}else{var $=m;m=function(D,E){return $.call(D,E)}}a.push(m)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),g?r===1?(a.push(function(D,E){return i.get.call(D,E)}),a.push(function(D,E){return i.set.call(D,E)})):r===2?a.push(i):a.push(function(D,E){return i.call(D,E)}):Object.defineProperty(n,l,s))}function v(a,n,u){for(var l=[],r,y,g=new Map,T=new Map,w=0;w<n.length;w++){var d=n[w];if(Array.isArray(d)){var s=d[1],m=d[2],i=d.length>3,h=s>=5,x,S;if(h?(x=a,s=s-5,y=y||[],S=y):(x=a.prototype,r=r||[],S=r),s!==0&&!i){var C=h?T:g,M=C.get(m)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+m);!M&&s>2?C.set(m,s):C.set(m,!0)}p(l,x,d,m,s,h,i,S,u)}}return b(l,r),b(l,y),l}function b(a,n){n&&a.push(function(u){for(var l=0;l<n.length;l++)n[l].call(u);return u})}function I(a,n,u){if(n.length>0){for(var l=[],r=a,y=a.name,g=n.length-1;g>=0;g--){var T={v:!1};try{var w=n[g](r,{kind:"class",name:y,addInitializer:f(l,T),metadata:u})}finally{T.v=!0}w!==void 0&&(c(10,w),r=w)}return[P(r,u),function(){for(var d=0;d<l.length;d++)l[d].call(r)}]}}function P(a,n){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,l,r){if(r!==void 0)var y=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(y===void 0?null:y),T=v(n,u,g);return l.length||P(n,g),{e:T,get c(){return I(n,l,g)}}}}function Jr(f,t,e,o){return(Jr=us())(f,t,e,o)}var Kr,Zr,hs;Kr=yt({access:X.ReadWrite,selector:/^\[\([[\w$]+\)\]$/});var qr=class{static{({c:[hs,Zr]}=Jr(this,[],[Kr]))}constructor(t=O.use(B),e=O.use(Z),o=O.use(H),c=O.use(et)){this.mTargetNode=e,this.mAttributeKey=c.name.substring(2,c.name.length-2),this.mReadProcedure=o.createExpressionProcedure(c.value),this.mWriteProcedure=o.createExpressionProcedure(`${c.value} = $DATA;`,["$DATA"]),this.mLastDataValue=Symbol("Uncomparable");let p=v=>{this.mLastDataValue!==v&&t.updater.updateAsync()};this.mTargetNode.addEventListener("input",v=>{p(Reflect.get(this.mTargetNode,this.mAttributeKey))}),this.mTargetNode.addEventListener("change",v=>{p(Reflect.get(this.mTargetNode,this.mAttributeKey))})}mAttributeKey;mLastDataValue;mReadProcedure;mTargetNode;mWriteProcedure;onUpdate(){let t=this.mReadProcedure.execute();if(t!==this.mLastDataValue)return Reflect.set(this.mTargetNode,this.mAttributeKey,t),this.mLastDataValue=t,!0;let e=Reflect.get(this.mTargetNode,this.mAttributeKey);return e!==t?(this.mWriteProcedure.setTemporaryValue("$DATA",e),this.mWriteProcedure.execute(),this.mLastDataValue=e,!0):!1}static{Zr()}};function ms(){function f(a,n){return function(l){e(n,"addInitializer"),o(l,"An initializer"),a.push(l)}}function t(a,n,u,l,r,y,g,T,w){var d;switch(r){case 1:d="accessor";break;case 2:d="method";break;case 3:d="getter";break;case 4:d="setter";break;default:d="field"}var s={kind:d,name:g?"#"+n:n,static:y,private:g,metadata:T},m={v:!1};s.addInitializer=f(l,m);var i,h;r===0?g?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return a(w,s)}finally{m.v=!0}}function e(a,n){if(a.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(a,n){if(typeof a!="function")throw new TypeError(n+" must be a function")}function c(a,n){var u=typeof n;if(a===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function p(a,n,u,l,r,y,g,T,w){var d=u[0],s,m,i;g?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,S;if(typeof d=="function")h=t(d,l,s,T,r,y,g,w,i),h!==void 0&&(c(r,h),r===0?m=h:r===1?(m=h.init,x=h.get||i.get,S=h.set||i.set,i={get:x,set:S}):i=h);else for(var C=d.length-1;C>=0;C--){var M=d[C];if(h=t(M,l,s,T,r,y,g,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,S=h.set||i.set,i={get:x,set:S}):i=h,N!==void 0&&(m===void 0?m=N:typeof m=="function"?m=[m,N]:m.push(N))}}if(r===0||r===1){if(m===void 0)m=function(D,E){return E};else if(typeof m!="function"){var _=m;m=function(D,E){for(var L=E,R=0;R<_.length;R++)L=_[R].call(D,L);return L}}else{var $=m;m=function(D,E){return $.call(D,E)}}a.push(m)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),g?r===1?(a.push(function(D,E){return i.get.call(D,E)}),a.push(function(D,E){return i.set.call(D,E)})):r===2?a.push(i):a.push(function(D,E){return i.call(D,E)}):Object.defineProperty(n,l,s))}function v(a,n,u){for(var l=[],r,y,g=new Map,T=new Map,w=0;w<n.length;w++){var d=n[w];if(Array.isArray(d)){var s=d[1],m=d[2],i=d.length>3,h=s>=5,x,S;if(h?(x=a,s=s-5,y=y||[],S=y):(x=a.prototype,r=r||[],S=r),s!==0&&!i){var C=h?T:g,M=C.get(m)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+m);!M&&s>2?C.set(m,s):C.set(m,!0)}p(l,x,d,m,s,h,i,S,u)}}return b(l,r),b(l,y),l}function b(a,n){n&&a.push(function(u){for(var l=0;l<n.length;l++)n[l].call(u);return u})}function I(a,n,u){if(n.length>0){for(var l=[],r=a,y=a.name,g=n.length-1;g>=0;g--){var T={v:!1};try{var w=n[g](r,{kind:"class",name:y,addInitializer:f(l,T),metadata:u})}finally{T.v=!0}w!==void 0&&(c(10,w),r=w)}return[P(r,u),function(){for(var d=0;d<l.length;d++)l[d].call(r)}]}}function P(a,n){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,l,r){if(r!==void 0)var y=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(y===void 0?null:y),T=v(n,u,g);return l.length||P(n,g),{e:T,get c(){return I(n,l,g)}}}}function to(f,t,e,o){return(to=ms())(f,t,e,o)}var eo,Qr,ds;eo=Gt({access:X.Read,targetRestrictions:[vt]});var kr=class{static{({c:[ds,Qr]}=to(this,[],[eo]))}constructor(t=O.use(vt),e=O.use(Z)){let o=new Array,c=t.processorConstructor;do{let p=rt.get(c).getMetadata(me.METADATA_USER_EVENT_LISTENER_PROPERIES);if(p)for(let v of p)o.push(v)}while(c=Object.getPrototypeOf(c));this.mEventListenerList=new Array,this.mTargetElement=e;for(let p of o){let[v,b]=p,I=Reflect.get(t.processor,v);I=I.bind(t.processor),this.mEventListenerList.push([b,I]),this.mTargetElement.addEventListener(b,I)}}mEventListenerList;mTargetElement;onDeconstruct(){for(let t of this.mEventListenerList){let[e,o]=t;this.mTargetElement.removeEventListener(e,o)}}static{Qr()}};var Ne=class{mManager;mDocument;get document(){return this.mDocument}constructor(t){this.mManager=t,this.mDocument=null}setDocument(t){this.mDocument=t,this.mManager.integrity.revalidate(),this.mManager.dispatch(F.Document,this.mDocument),this.setDefaultActiveFunction()}removeFunction(t){let e=this.mDocument;if(!e)return;let o=null;for(let c of e.functions)if(c.id===t){o=c,e.removeFunction(c);break}o&&(this.mManager.dispatch(F.Function,o),this.setDefaultActiveFunction())}transformNode(t,e){let o={x:t.transformation.x,y:t.transformation.y,width:t.transformation.width,height:t.transformation.height,...e};t.moveTo(o.x,o.y),t.resizeTo(o.width,o.height),this.mManager.dispatch(F.NodeTransform,t)}addFunction(t){let e=this.mDocument,o=this.mManager.project;if(!e||!o||!o.userFunctions.has(t))return;let c=new wt(o,e,{definitionId:t,id:crypto.randomUUID(),isSystem:!1,label:`Function ${e.functions.size}`});e.addFunction(c),this.mManager.dispatch(F.Function,c),this.mManager.setActiveFunction(c.id)}addNode(t,e,o){let c=t.addNodeByDefinition(e,o);return this.mManager.dispatch(F.Node,c),c}removeNode(t){t.function.removeNode(t),this.mManager.dispatch(F.Node,t)}connectPorts(t,e){try{t.connect(e)}catch(o){return console.error("[PotatnoCodeUiManager] Connection failed:",o),!1}return this.mManager.dispatch(F.Connection,t),this.mManager.dispatch(F.Connection,e),!0}disconnectPorts(t,e){t.disconnect(e),this.mManager.dispatch(F.Connection,t),this.mManager.dispatch(F.Connection,e)}setPortDirectValue(t,e){t.setDirectValue(e),this.mManager.dispatch(F.Node,t)}updateNode(t,e){t&&(e(t),this.mManager.dispatch(F.Node,t))}setDefaultActiveFunction(){if(!this.mDocument||this.mDocument.functions.size===0)return;let t=(()=>{let e=[...this.mDocument.functions];return e.some(c=>c.id===this.mManager.activeFunctionId)?this.mManager.activeFunctionId:e[0].id})();this.mManager.activeFunctionId!==t&&this.mManager.setActiveFunction(t)}};var Ae=class{mProject;constructor(t){this.mProject=t}deserialize(t){let e=new Mt(this.mProject);for(let o of t.functions)e.addFunction(this.deserializeFunction(o,e));return e}deserializeFunction(t,e){let o=new wt(this.mProject,e,{definitionId:t.definitionId,id:t.id,label:t.label,isSystem:t.isSystem});for(let p of t.imports)o.addImport(p);for(let p of t.inputs)o.addInput({label:p.label,dataType:p.dataType});for(let p of t.outputs)o.addOutput({label:p.label,dataType:p.dataType});let c=new Map;for(let p of t.nodes)c.set(p.id,this.deserializeNode(p,o,e));for(let p of t.connections){if(!c.has(p.sourceNodeId)||!c.has(p.targetNodeId))continue;let v=c.get(p.sourceNodeId),b=c.get(p.targetNodeId),I=v.outputs.map.get(p.sourcePortId),P=b.inputs.map.get(p.targetPortId);!I||!P||I.connect(P)}return o}deserializeNode(t,e,o){let c=o.nodeDefinitions.find(v=>v.id===t.definitionId),p=(()=>{if(c)return e.addNodeByDefinition(c,t.transformation);let v=t.ports.filter(I=>I.direction==="input").map(I=>({dataType:I.dataType,definitionId:I.definitionId,label:I.label,portType:I.portType})),b=t.ports.filter(I=>I.direction==="output").map(I=>({dataType:I.dataType,definitionId:I.definitionId,label:I.label,portType:I.portType}));return new bt(this.mProject,o,e,{category:t.category,definitionId:t.definitionId,ports:{input:v,output:b},label:t.label,transformation:{...t.transformation}})})();p.label=t.label,e.addNode(p);for(let v of t.ports)if(v.portType==="value"&&v.directValue.length>0){let b=p.inputs.map.get(v.definitionId);b&&b.setDirectValue(v.directValue)}return p.preview=t.preview??null,p}};var Le=class{constructor(){}serialize(t){return{functions:[...t.functions].map(e=>this.serializeFunction(e))}}serializeFunction(t){let e=new Map;[...t.nodes].forEach((b,I)=>{e.set(b,`n${I}`)});let o=[...t.nodes].map(b=>this.serializeNode(b,e.get(b))),c=[];for(let b of t.nodes){let I=e.get(b);for(let P of b.outputs.list)for(let a of P.connectedPorts){let n=e.get(a.node);c.push({sourceNodeId:I,sourcePortId:P.definitionId,targetNodeId:n,targetPortId:a.definitionId})}}let p=t.inputs.map(b=>({label:b.label,dataType:b.dataType})),v=t.outputs.map(b=>({label:b.label,dataType:b.dataType}));return{id:t.id,label:t.label,isSystem:t.isSystem,definitionId:t.definitionId,inputs:p,outputs:v,imports:[...t.imports],nodes:o,connections:c}}serializeNode(t,e){let o=[...t.inputs.list,...t.outputs.list].map(p=>({definitionId:p.definitionId,label:p.label,direction:p.direction,portType:p.portType,dataType:p.portType==="value"?p.dataType:null,directValue:[...p.directValue]})),c=t.preview?structuredClone(t.preview):null;return{id:e,definitionId:t.definitionId,category:t.category,label:t.label,transformation:{...t.transformation},ports:o,preview:c}}};var Re=class f{static MAX_HISTORY_ITEMS=100;mManager;mSnapshots;mSnapshotIndex;get canRedo(){return this.mSnapshotIndex<this.mSnapshots.length-1}get canUndo(){return this.mSnapshotIndex>0}constructor(t){this.mManager=t,this.mSnapshotIndex=-1,this.mSnapshots=new Array;let e=0;this.mManager.subscribe(F.Any,null,()=>{globalThis.clearTimeout(e),e=globalThis.setTimeout(()=>{this.pushHistory()},1e3)})}undo(){if(!this.canUndo)return;let t=this.mSnapshots[--this.mSnapshotIndex],e=JSON.parse(t);this.restoreHistory(e)}redo(){if(!this.canRedo)return;let t=this.mSnapshots[++this.mSnapshotIndex],e=JSON.parse(t);this.restoreHistory(e)}clear(){this.mSnapshots.length=0,this.mSnapshotIndex=-1}pushHistory(){let t=this.mManager.graph.document;if(!t)return;this.mSnapshots.splice(this.mSnapshotIndex+1);let e=new Le().serialize(t),o=JSON.stringify(e);this.mSnapshots.length>0&&this.mSnapshots.at(-1)===o||(this.mSnapshotIndex=this.mSnapshots.push(o)-1,this.mSnapshots.length>f.MAX_HISTORY_ITEMS&&(this.mSnapshots.shift(),this.mSnapshotIndex--))}restoreHistory(t){let e=this.mManager.project;e&&this.mManager.graph.setDocument(new Ae(e).deserialize(t))}};var Oe=class{mErrorList;mErrorItems;mIsDirty;mManager;get errors(){return this.mIsDirty&&this.revalidate(),this.mErrorList}get errorItems(){return this.mIsDirty&&this.revalidate(),this.mErrorItems}get isValid(){return this.mIsDirty&&this.revalidate(),this.mErrorItems.size===0}constructor(t){this.mManager=t,this.mErrorList=new Array,this.mErrorItems=new Set,this.mIsDirty=!0;let e=0;this.mManager.subscribe(F.Any,null,()=>{this.mIsDirty=!0,globalThis.clearTimeout(e),e=globalThis.setTimeout(()=>{this.revalidate()},1e3)})}revalidate(){if(this.mIsDirty&&(this.mIsDirty=!1,!!this.mManager.graph.document)){this.mErrorList.splice(0,this.mErrorList.length),this.mErrorItems.clear();for(let t of this.mManager.graph.document.validate())switch(this.mErrorItems.add(t.item),!0){case t.item instanceof ft:{this.mErrorList.push({location:`Node "${t.item.node.label}"`,message:t.message});break}case t.item instanceof bt:{this.mErrorList.push({location:`Node "${t.item.label}"`,message:t.message});break}}}}};var it=class{static MAIN="MAIN";mBuild;mDefaultParameters;mFunction;mTypes;get defaultParameters(){return this.mDefaultParameters}get function(){return this.mFunction}get types(){return this.mTypes}constructor(t,e){this.mFunction=t,this.mDefaultParameters=e.defaultParameters,this.mTypes=e.types,this.mBuild=e.build}compile(t,e){return this.mBuild({defaultParameters:this.mDefaultParameters,function:this.mFunction,projectTypes:t.entryPoint.function.project.types},t,e)}};var _e=class{mDriverList;mDrivers;mManager;constructor(t){this.mManager=t,this.mDrivers=new WeakMap,this.mDriverList=new Array,this.mManager.subscribe(F.Document,null,()=>{this.mDriverList.splice(0,this.mDriverList.length)});let e=0,o=F.Connection|F.Function|F.Node;this.mManager.subscribe(o,null,()=>{globalThis.clearTimeout(e),e=globalThis.setTimeout(()=>this.refresh(),1e3)})}async execute(){await Promise.all(this.liveDrivers().map(async t=>{try{await t.execute()}catch(e){console.error("[PotatnoUiManagerPreview] Driver render failed:",e)}}))}functionDriver(t,e,o){let c=this.mManager.project;if(!c)return this.release(t),null;let p=o;return this.acquire(t,e,p,()=>{let v=c.getFunction(t.definitionId);if(!v)return null;if(p===it.MAIN)return c.preview.availablePreviews(v,it.MAIN).find(a=>a.display.id===e)?.createDriver(t)??null;let b=this.findFunctionOutputPort(t,p);return b?c.preview.availablePreviews(v,b.resolvedDataType).find(P=>P.display.id===e)?.createDriver(b)??null:null})}nodeDriver(t){let e=t.preview,o=e?t.outputs.map.get(e.portId):void 0;return!e||!o||o.portType!=="value"?(this.release(t),null):this.acquire(t,e.displayId,e.portId,()=>{let c=this.mManager.project,p=c?.getFunction(t.function.definitionId);return!c||!p?null:c.preview.availablePreviews(p,o.resolvedDataType).find(b=>b.display.id===e.displayId)?.createDriver(o)??null})}refresh(){if(this.mManager.integrity.isValid)for(let t of this.liveDrivers())t.refresh()}release(t){let e=this.mDrivers.get(t);e&&(this.mDrivers.delete(t),this.removeFromList(e.driver))}acquire(t,e,o,c){let p=this.mDrivers.get(t);if(p&&p.displayId===e&&p.target===o)return p.driver;let v=c();return v?(p&&this.removeFromList(p.driver),this.mDrivers.set(t,{driver:v,displayId:e,target:o}),this.mDriverList.push(new WeakRef(v)),this.mManager.integrity.isValid&&v.refresh(),v):(this.release(t),null)}findFunctionOutputPort(t,e){for(let o of t.getExitNodes()){let c=o.inputs.map.get(e);if(c&&c.portType==="value")return c}return null}liveDrivers(){let t=[];for(let e=this.mDriverList.length-1;e>=0;e--){let o=this.mDriverList[e].deref();o?t.push(o):this.mDriverList.splice(e,1)}return t}removeFromList(t){let e=this.mDriverList.findIndex(o=>o.deref()===t);e!==-1&&this.mDriverList.splice(e,1)}};function ps(){function f(a,n){return function(l){e(n,"addInitializer"),o(l,"An initializer"),a.push(l)}}function t(a,n,u,l,r,y,g,T,w){var d;switch(r){case 1:d="accessor";break;case 2:d="method";break;case 3:d="getter";break;case 4:d="setter";break;default:d="field"}var s={kind:d,name:g?"#"+n:n,static:y,private:g,metadata:T},m={v:!1};s.addInitializer=f(l,m);var i,h;r===0?g?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return a(w,s)}finally{m.v=!0}}function e(a,n){if(a.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(a,n){if(typeof a!="function")throw new TypeError(n+" must be a function")}function c(a,n){var u=typeof n;if(a===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function p(a,n,u,l,r,y,g,T,w){var d=u[0],s,m,i;g?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,S;if(typeof d=="function")h=t(d,l,s,T,r,y,g,w,i),h!==void 0&&(c(r,h),r===0?m=h:r===1?(m=h.init,x=h.get||i.get,S=h.set||i.set,i={get:x,set:S}):i=h);else for(var C=d.length-1;C>=0;C--){var M=d[C];if(h=t(M,l,s,T,r,y,g,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,S=h.set||i.set,i={get:x,set:S}):i=h,N!==void 0&&(m===void 0?m=N:typeof m=="function"?m=[m,N]:m.push(N))}}if(r===0||r===1){if(m===void 0)m=function(D,E){return E};else if(typeof m!="function"){var _=m;m=function(D,E){for(var L=E,R=0;R<_.length;R++)L=_[R].call(D,L);return L}}else{var $=m;m=function(D,E){return $.call(D,E)}}a.push(m)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),g?r===1?(a.push(function(D,E){return i.get.call(D,E)}),a.push(function(D,E){return i.set.call(D,E)})):r===2?a.push(i):a.push(function(D,E){return i.call(D,E)}):Object.defineProperty(n,l,s))}function v(a,n,u){for(var l=[],r,y,g=new Map,T=new Map,w=0;w<n.length;w++){var d=n[w];if(Array.isArray(d)){var s=d[1],m=d[2],i=d.length>3,h=s>=5,x,S;if(h?(x=a,s=s-5,y=y||[],S=y):(x=a.prototype,r=r||[],S=r),s!==0&&!i){var C=h?T:g,M=C.get(m)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+m);!M&&s>2?C.set(m,s):C.set(m,!0)}p(l,x,d,m,s,h,i,S,u)}}return b(l,r),b(l,y),l}function b(a,n){n&&a.push(function(u){for(var l=0;l<n.length;l++)n[l].call(u);return u})}function I(a,n,u){if(n.length>0){for(var l=[],r=a,y=a.name,g=n.length-1;g>=0;g--){var T={v:!1};try{var w=n[g](r,{kind:"class",name:y,addInitializer:f(l,T),metadata:u})}finally{T.v=!0}w!==void 0&&(c(10,w),r=w)}return[P(r,u),function(){for(var d=0;d<l.length;d++)l[d].call(r)}]}}function P(a,n){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,l,r){if(r!==void 0)var y=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(y===void 0?null:y),T=v(n,u,g);return l.length||P(n,g),{e:T,get c(){return I(n,l,g)}}}}function io(f,t,e,o){return(io=ps())(f,t,e,o)}var so,ro,oo,K;so=O.injectable("singleton");var no=class extends(oo=EventTarget){static{({c:[K,ro]}=io(this,[],[so],oo))}constructor(){super(),this.mIntegrity=new Oe(this),this.mGraph=new Ne(this),this.mHistory=new Re(this),this.mPreview=new _e(this),this.mActiveFunctionId="",this.mProject=null}mActiveFunctionId;mProject;mGraph;mHistory;mIntegrity;mPreview;get graph(){return this.mGraph}get history(){return this.mHistory}get integrity(){return this.mIntegrity}get activeFunction(){let t=this.mGraph.document;if(!t)return null;for(let e of t.functions)if(e.id===this.mActiveFunctionId)return e;return null}get activeFunctionId(){return this.mActiveFunctionId}get project(){return this.mProject}get preview(){return this.mPreview}deconstruct(){}initialize(t,e){this.mProject=t,this.mGraph.setDocument(e)}subscribe(t,e,o){let c=v=>{if(!e)return!0;let b=v;for(;b!==null;){if(e.has(b))return!0;switch(!0){case b instanceof ft:{b=b.node;break}case b instanceof bt:{b=b.function;break}case b instanceof wt:{b=b.document;break}default:b=null}}return!1},p=v=>{t!==F.Any&&(v.changeType&t)===0||e!==null&&!c(v.item)||o(v)};return this.addEventListener(ge.EVENT_TYPE,p),()=>{this.removeEventListener(ge.EVENT_TYPE,p)}}setActiveFunction(t){let e=this.mGraph.document;if(!(!e||this.mActiveFunctionId===t)){for(let o of e.functions)if(o.id===t){this.mActiveFunctionId=t,this.dispatch(F.ActiveFunction,o);return}}}updateFunctionProperties(t){let e=this.activeFunction;if(e){if(t.name!==void 0&&(e.label=t.name),t.inputs!==void 0){for(let o of[...e.inputs])e.removeInput(o);for(let o of t.inputs)e.addInput({dataType:o.type,label:o.name})}if(t.outputs!==void 0){for(let o of[...e.outputs])e.removeOutput(o);for(let o of t.outputs)e.addOutput({dataType:o.type,label:o.name})}if(t.imports!==void 0){let o=new Set(e.imports),c=new Set(t.imports);for(let p of[...e.imports])c.has(p)||e.removeImport(p);for(let p of t.imports)o.has(p)||e.addImport(p)}this.dispatch(F.Function,e)}}dispatch(t,e){this.dispatchEvent(new ge(t,e))}static{ro()}},F={Any:0,Connection:1,Document:2,Function:4,Node:8,NodeTransform:16,Preview:32,ActiveFunction:64},ge=class f extends Event{static EVENT_TYPE="PotatnoUiManagerChangeEvent";mChangeType;mEventItem;get changeType(){return this.mChangeType}get item(){return this.mEventItem}constructor(t,e){super(f.EVENT_TYPE),this.mChangeType=t,this.mEventItem=e}};var ao=`:host {\r
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
`;var lo=`<div class="editor-layout">
    <div #panelLeft class="panel-left">
        <potatno-function-list></potatno-function-list>
    </div>
    <div #resizeLeft class="resize-handle-left"
        (pointerdown)="this.onResizeLeftStart($event)">
    </div>
    <div class="center-area">
        <potatno-node-graph></potatno-node-graph>
        $if(this.hasPreview) {
            <div class="preview-wrapper">
                <potatno-preview></potatno-preview>
            </div>
        }
    </div>
    <div #resizeRight class="resize-handle-right"
        (pointerdown)="this.onResizeRightStart($event)">
    </div>
    <div #panelRight class="panel-right">
        <potatno-panel-properties></potatno-panel-properties>
    </div>
</div>
`;var co=`:host {\r
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
    box-sizing: border-box;\r
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
    box-sizing: border-box;\r
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
`;var uo=`<div class="function-list-content">\r
    $for(fn of this.functions) {\r
        <div [className]="this.getEntryClass(this.fn.id)" (click)="this.onFunctionSelect(this.fn.id)">\r
            <span class="function-icon">f</span>\r
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
`;function bs(){function f(a,n){return function(l){e(n,"addInitializer"),o(l,"An initializer"),a.push(l)}}function t(a,n,u,l,r,y,g,T,w){var d;switch(r){case 1:d="accessor";break;case 2:d="method";break;case 3:d="getter";break;case 4:d="setter";break;default:d="field"}var s={kind:d,name:g?"#"+n:n,static:y,private:g,metadata:T},m={v:!1};s.addInitializer=f(l,m);var i,h;r===0?g?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return a(w,s)}finally{m.v=!0}}function e(a,n){if(a.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(a,n){if(typeof a!="function")throw new TypeError(n+" must be a function")}function c(a,n){var u=typeof n;if(a===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function p(a,n,u,l,r,y,g,T,w){var d=u[0],s,m,i;g?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,S;if(typeof d=="function")h=t(d,l,s,T,r,y,g,w,i),h!==void 0&&(c(r,h),r===0?m=h:r===1?(m=h.init,x=h.get||i.get,S=h.set||i.set,i={get:x,set:S}):i=h);else for(var C=d.length-1;C>=0;C--){var M=d[C];if(h=t(M,l,s,T,r,y,g,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,S=h.set||i.set,i={get:x,set:S}):i=h,N!==void 0&&(m===void 0?m=N:typeof m=="function"?m=[m,N]:m.push(N))}}if(r===0||r===1){if(m===void 0)m=function(D,E){return E};else if(typeof m!="function"){var _=m;m=function(D,E){for(var L=E,R=0;R<_.length;R++)L=_[R].call(D,L);return L}}else{var $=m;m=function(D,E){return $.call(D,E)}}a.push(m)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),g?r===1?(a.push(function(D,E){return i.get.call(D,E)}),a.push(function(D,E){return i.set.call(D,E)})):r===2?a.push(i):a.push(function(D,E){return i.call(D,E)}):Object.defineProperty(n,l,s))}function v(a,n,u){for(var l=[],r,y,g=new Map,T=new Map,w=0;w<n.length;w++){var d=n[w];if(Array.isArray(d)){var s=d[1],m=d[2],i=d.length>3,h=s>=5,x,S;if(h?(x=a,s=s-5,y=y||[],S=y):(x=a.prototype,r=r||[],S=r),s!==0&&!i){var C=h?T:g,M=C.get(m)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+m);!M&&s>2?C.set(m,s):C.set(m,!0)}p(l,x,d,m,s,h,i,S,u)}}return b(l,r),b(l,y),l}function b(a,n){n&&a.push(function(u){for(var l=0;l<n.length;l++)n[l].call(u);return u})}function I(a,n,u){if(n.length>0){for(var l=[],r=a,y=a.name,g=n.length-1;g>=0;g--){var T={v:!1};try{var w=n[g](r,{kind:"class",name:y,addInitializer:f(l,T),metadata:u})}finally{T.v=!0}w!==void 0&&(c(10,w),r=w)}return[P(r,u),function(){for(var d=0;d<l.length;d++)l[d].call(r)}]}}function P(a,n){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,l,r){if(r!==void 0)var y=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(y===void 0?null:y),T=v(n,u,g);return l.length||P(n,g),{e:T,get c(){return I(n,l,g)}}}}function go(f,t,e,o){return(go=bs())(f,t,e,o)}var vo,ho,yo,mo,po,ws;vo=J({selector:"potatno-function-list",template:uo,style:co}),yo=z.state();var fo=class{static{({e:[mo,po],c:[ws,ho]}=go(this,[[yo,1,"mShowPopup"]],[vo]))}constructor(t=O.use(B),e=O.use(K)){this.mComponent=t,this.mManager=e,this.mUnsubscribe=null}mComponent;mManager;mUnsubscribe;#t=(po(this),mo(this,!1));get mShowPopup(){return this.#t}set mShowPopup(t){this.#t=t}get activeFunctionId(){return this.mManager.activeFunctionId}get functions(){let t=this.mManager.graph.document;if(!t)return[];let e=[];for(let o of t.functions)e.push({id:o.id,label:o.label,name:o.label,system:o.isSystem});return e}get hasUserFunctionDefinitions(){return this.userFunctionDefinitions.length>0}get showPopup(){return this.mShowPopup}get userFunctionDefinitions(){let t=this.mManager.project;return t?[...t.userFunctions.values()].map(e=>({id:e.id})):[]}closePopup(){this.mShowPopup=!1}getEntryClass(t){return t===this.activeFunctionId?"function-entry active":"function-entry"}onConnect(){this.mUnsubscribe=this.mManager.subscribe(F.Document|F.Function|F.ActiveFunction,null,()=>{this.mComponent.updater.update()})}onDeconstruct(){this.mUnsubscribe?.(),this.mUnsubscribe=null}onAddButtonClick(){let t=this.userFunctionDefinitions;t.length===1?this.mManager.graph.addFunction(t[0].id):this.mShowPopup=!this.mShowPopup}onDefinitionSelect(t){this.mShowPopup=!1,this.mManager.graph.addFunction(t)}onFunctionDelete(t,e){t.stopPropagation(),this.mManager.graph.removeFunction(e)}onFunctionSelect(t){this.mManager.setActiveFunction(t)}static{ho()}};var Fe=class f{static MAX_ZOOM=2;static MIN_ZOOM=.25;mGridSize;mPanX;mPanY;mSelectionEnd;mSelectionStart;mZoom;get gridSize(){return this.mGridSize}get panX(){return this.mPanX}get panY(){return this.mPanY}get selectionEnd(){return this.mSelectionEnd}get selectionStart(){return this.mSelectionStart}get zoom(){return this.mZoom}constructor(t=20){this.mGridSize=t,this.mPanX=0,this.mPanY=0,this.mZoom=1,this.mSelectionStart=null,this.mSelectionEnd=null}clearSelection(){this.mSelectionStart=null,this.mSelectionEnd=null}getGridBackgroundCss(){let t=this.mGridSize*this.mZoom,e=this.mPanX%t,o=this.mPanY%t,c=t*5,p=this.mPanX%c,v=this.mPanY%c;return[`background-size: ${t}px ${t}px, ${c}px ${c}px`,`background-position: ${e}px ${o}px, ${p}px ${v}px`,"background-image: radial-gradient(circle, var(--pn-grid-color) 1px, transparent 1px), radial-gradient(circle, var(--pn-grid-color) 1.5px, transparent 1.5px)"].join("; ")}getTransformCss(){return`translate(${this.mPanX}px, ${this.mPanY}px) scale(${this.mZoom})`}pan(t,e){this.mPanX+=t,this.mPanY+=e}screenToWorld(t,e){return{x:(t-this.mPanX)/this.mZoom,y:(e-this.mPanY)/this.mZoom}}setSelectionEnd(t,e){this.mSelectionEnd={x:t,y:e}}setSelectionStart(t,e){this.mSelectionStart={x:t,y:e}}snapToGrid(t,e){return{x:Math.round(t/this.mGridSize)*this.mGridSize,y:Math.round(e/this.mGridSize)*this.mGridSize}}worldToScreen(t,e){return{x:t*this.mZoom+this.mPanX,y:e*this.mZoom+this.mPanY}}zoomAt(t,e,o){let c=this.mZoom,p=1+o,v=this.mZoom*p;v=Math.max(f.MIN_ZOOM,Math.min(f.MAX_ZOOM,v));let b=(t-this.mPanX)/c,I=(e-this.mPanY)/c;this.mZoom=v,this.mPanX=t-b*this.mZoom,this.mPanY=e-I*this.mZoom}};var je=class{mData;get hasData(){return this.mData!==null}constructor(){this.mData=null}copy(t){let e=[],o=new Map;for(let v of t)o.set(v,e.length),e.push(v);if(e.length===0)return;let c=e.map(v=>{let b={};for(let[I,P]of v.inputs.map)P.portType==="value"&&P.directValue.length>0&&(b[I]=[...P.directValue]);return{definitionId:v.definitionId,transformation:{...v.transformation},label:v.label,inputDirectValues:b}}),p=[];for(let v of e){let b=o.get(v);for(let[I,P]of v.outputs.map)for(let a of P.connectedPorts){let n=o.get(a.node);n!==void 0&&p.push({sourceNodeIndex:b,sourcePortName:I,targetNodeIndex:n,targetPortName:a.label})}}this.mData={nodes:c,internalConnections:p}}paste(t,e,o,c){if(!this.mData)return[];let p=[];for(let v of this.mData.nodes){let b=t.project.nodeDefinitions.find(a=>a.id===v.definitionId)??e.nodeDefinitions.find(a=>a.id===v.definitionId);if(!b)continue;let I={x:v.transformation.x+o,y:v.transformation.y+c,width:v.transformation.width,height:v.transformation.height},P=t.addNodeByDefinition(b,I);P.label=v.label;for(let[a,n]of Object.entries(v.inputDirectValues)){let u=P.inputs.map.get(a);u&&u.setDirectValue(n)}p.push(P)}for(let v of this.mData.internalConnections){let b=p[v.sourceNodeIndex],I=p[v.targetNodeIndex];if(!b||!I)continue;let P=b.outputs.map.get(v.sourcePortName),a=I.inputs.map.get(v.targetPortName);P&&a&&P.connect(a)}return p}};function xs(){function f(a,n){return function(l){e(n,"addInitializer"),o(l,"An initializer"),a.push(l)}}function t(a,n,u,l,r,y,g,T,w){var d;switch(r){case 1:d="accessor";break;case 2:d="method";break;case 3:d="getter";break;case 4:d="setter";break;default:d="field"}var s={kind:d,name:g?"#"+n:n,static:y,private:g,metadata:T},m={v:!1};s.addInitializer=f(l,m);var i,h;r===0?g?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return a(w,s)}finally{m.v=!0}}function e(a,n){if(a.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(a,n){if(typeof a!="function")throw new TypeError(n+" must be a function")}function c(a,n){var u=typeof n;if(a===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function p(a,n,u,l,r,y,g,T,w){var d=u[0],s,m,i;g?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,S;if(typeof d=="function")h=t(d,l,s,T,r,y,g,w,i),h!==void 0&&(c(r,h),r===0?m=h:r===1?(m=h.init,x=h.get||i.get,S=h.set||i.set,i={get:x,set:S}):i=h);else for(var C=d.length-1;C>=0;C--){var M=d[C];if(h=t(M,l,s,T,r,y,g,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,S=h.set||i.set,i={get:x,set:S}):i=h,N!==void 0&&(m===void 0?m=N:typeof m=="function"?m=[m,N]:m.push(N))}}if(r===0||r===1){if(m===void 0)m=function(D,E){return E};else if(typeof m!="function"){var _=m;m=function(D,E){for(var L=E,R=0;R<_.length;R++)L=_[R].call(D,L);return L}}else{var $=m;m=function(D,E){return $.call(D,E)}}a.push(m)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),g?r===1?(a.push(function(D,E){return i.get.call(D,E)}),a.push(function(D,E){return i.set.call(D,E)})):r===2?a.push(i):a.push(function(D,E){return i.call(D,E)}):Object.defineProperty(n,l,s))}function v(a,n,u){for(var l=[],r,y,g=new Map,T=new Map,w=0;w<n.length;w++){var d=n[w];if(Array.isArray(d)){var s=d[1],m=d[2],i=d.length>3,h=s>=5,x,S;if(h?(x=a,s=s-5,y=y||[],S=y):(x=a.prototype,r=r||[],S=r),s!==0&&!i){var C=h?T:g,M=C.get(m)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+m);!M&&s>2?C.set(m,s):C.set(m,!0)}p(l,x,d,m,s,h,i,S,u)}}return b(l,r),b(l,y),l}function b(a,n){n&&a.push(function(u){for(var l=0;l<n.length;l++)n[l].call(u);return u})}function I(a,n,u){if(n.length>0){for(var l=[],r=a,y=a.name,g=n.length-1;g>=0;g--){var T={v:!1};try{var w=n[g](r,{kind:"class",name:y,addInitializer:f(l,T),metadata:u})}finally{T.v=!0}w!==void 0&&(c(10,w),r=w)}return[P(r,u),function(){for(var d=0;d<l.length;d++)l[d].call(r)}]}}function P(a,n){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,l,r){if(r!==void 0)var y=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(y===void 0?null:y),T=v(n,u,g);return l.length||P(n,g),{e:T,get c(){return I(n,l,g)}}}}function xo(f,t,e,o){return(xo=xs())(f,t,e,o)}var To,bo,Ht;To=O.injectable("singleton");var wo=class{static{({c:[Ht,bo]}=xo(this,[],[To]))}constructor(){this.mElements=new Map}mElements;entries(){return this.mElements.entries()}get(t){return this.mElements.get(t)}register(t,e){this.mElements.set(t,e)}unregister(t){this.mElements.delete(t)}static{bo()}};var Eo=`:host {\r
    display: flex;\r
    flex: 1;\r
    min-height: 0;\r
    min-width: 0;\r
    position: relative;\r
}\r
\r
.canvas-wrapper {\r
    background: var(--pn-bg-primary);\r
    cursor: default;\r
    flex: 1;\r
    min-height: 0;\r
    min-width: 0;\r
    overflow: hidden;\r
    position: relative;\r
}\r
\r
.grid-layer {\r
    height: 100%;\r
    left: 0;\r
    position: absolute;\r
    top: 0;\r
    transform-origin: 0 0;\r
    width: 100%;\r
}\r
\r
.temp-wire-layer {\r
    height: 100%;\r
    left: 0;\r
    overflow: visible;\r
    pointer-events: none;\r
    position: absolute;\r
    top: 0;\r
    width: 100%;\r
}\r
\r
.temp-wire {\r
    stroke: #bac2de;\r
    stroke-width: 2;\r
    opacity: 0.6;\r
    stroke-dasharray: 8 4;\r
    pointer-events: none;\r
}\r
\r
.node-layer {\r
    left: 0;\r
    position: absolute;\r
    top: 0;\r
}\r
\r
.node-position {\r
    position: absolute;\r
}\r
\r
.selection-box {\r
    background: var(--pn-selection-color);\r
    border: 1px solid var(--pn-accent-primary);\r
    pointer-events: none;\r
    position: absolute;\r
    z-index: 1000;\r
}\r
\r
\r
`;var Do=`<div #canvasWrapper class="canvas-wrapper"\r
    [style]="this.gridBackgroundStyle"\r
    (pointerdown)="this.onCanvasPointerDown($event)"\r
    (wheel)="this.onCanvasWheel($event)"\r
    (contextmenu)="this.onContextMenu($event)">\r
    <div #gridLayer class="grid-layer" [style]="this.gridTransformStyle">\r
        <potatno-connection-layer [interaction]="this.canvasInteraction"></potatno-connection-layer>\r
        $if(this.showTempConnection) {\r
            <svg class="temp-wire-layer" xmlns="http://www.w3.org/2000/svg">\r
                <path class="temp-wire" fill="none" d="{{this.tempWirePath}}"></path>\r
            </svg>\r
        }\r
        <div class="node-layer">\r
            $for(nodeState of this.visibleNodes) {\r
                <div class="node-position" style="left:{{this.nodeState.pixelX}}px;top:{{this.nodeState.pixelY}}px;width:{{this.nodeState.pixelW}}px">\r
                    <potatno-node\r
                        [nodeData]="this.nodeState.node"\r
                        [selected]="this.nodeState.selected"\r
                        [gridSize]="this.gridSize"\r
                        (pointerdown)="this.onNodePointerDown($event, this.nodeState.node)"\r
                        (port-drag-start)="this.onPortDragStart($event)"\r
                        (port-hover)="this.onPortHover($event)"\r
                        (port-leave)="this.onPortLeave()"\r
                        (resize-start)="this.onNodeResizeStart($event)">\r
                    </potatno-node>\r
                </div>\r
            }\r
        </div>\r
    </div>\r
    $if(this.showSelectionBox) {\r
        <div class="selection-box" [style]="this.selectionBoxStyle"></div>\r
    }\r
    <potatno-add-node-popup [open]="this.showAddNodePopup" [style]="this.addNodePopupStyle"\r
        (node-select)="this.onAddNodePopupNodeSelect($event)"\r
        (close)="this.onAddNodePopupClose()">\r
    </potatno-add-node-popup>\r
</div>\r
`;(function(f){f.Function="function",f.Comment="comment",f.Input="input",f.Output="output",f.Reroute="reroute"})(ht||(ht={}));var Pt=class f{static META={[ht.Function]:{icon:"f",cssColor:"var(--pn-accent-blue)",label:"Function"},[ht.Comment]:{icon:"\u{1F4AC}",cssColor:"var(--pn-accent-yellow)",label:"Comment"},[ht.Input]:{icon:"\u2192",cssColor:"var(--pn-accent-green)",label:"Input"},[ht.Output]:{icon:"\u2190",cssColor:"var(--pn-accent-red)",label:"Output"},[ht.Reroute]:{icon:"\u25C7",cssColor:"var(--pn-text-muted)",label:"Reroute"}};static get(t){let e=f.META[t];return e||{icon:"\u25C6",cssColor:`hsl(${f.hashStringToHue(t)}, 60%, 55%)`,label:t.charAt(0).toUpperCase()+t.slice(1)}}static hashStringToHue(t){let e=0;for(let o=0;o<t.length;o++)e=(e<<5)-e+t.charCodeAt(o),e=e&e;return Math.abs(e)%360}},ht;var Io=`:host {
    position: absolute;
    z-index: 1500;
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
    width: 280px;
}

.add-node-search {
    background: var(--pn-bg-surface);
    border: none;
    border-bottom: 1px solid var(--pn-border-default);
    box-sizing: border-box;
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
    box-sizing: border-box;
    color: var(--pn-text-primary);
    cursor: pointer;
    display: flex;
    font-family: var(--pn-font-family);
    font-size: var(--pn-font-size);
    gap: 8px;
    min-height: 28px;
    padding: 6px 10px;
    text-align: left;
    width: 100%;
}

.add-node-result:hover,
.add-node-result.selected {
    background: var(--pn-bg-elevated);
}

.add-node-result-border {
    width: 3px;
    height: 14px;
    border-radius: 2px;
    flex-shrink: 0;
}

.add-node-result-icon {
    flex-shrink: 0;
    width: 16px;
    text-align: center;
}

.add-node-result-name {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.add-node-result-category {
    color: var(--pn-text-muted);
    flex-shrink: 0;
    font-size: var(--pn-font-size-sm);
}

.add-node-empty {
    color: var(--pn-text-muted);
    font-family: var(--pn-font-family);
    font-size: var(--pn-font-size-sm);
    padding: 14px 10px;
    text-align: center;
}
`;var So=`$if(this.open) {
    <div class="add-node-popup"
        (pointerdown)="this.onRootPointerDown($event)"
        (wheel)="this.onRootWheel($event)"
        (contextmenu)="this.onRootContextMenu($event)">
        <input class="add-node-search" #searchInput type="text" placeholder="Search nodes..." [value]="this.searchValue" (input)="this.onSearchInput($event)" (keydown)="this.onSearchKeyDown($event)" />
        <div class="add-node-results">
            $for(entry of this.results) {
                <button [className]="this.getEntryClass(this.entry)" (pointerdown)="this.onEntryPointerDown($event, this.entry)">
                    <span class="add-node-result-border" style="background: {{this.getEntryColor(this.entry)}}"></span>
                    <span class="add-node-result-icon">{{this.getEntryIcon(this.entry)}}</span>
                    <span class="add-node-result-name">{{this.entry.name}}</span>
                    <span class="add-node-result-category">{{this.getEntryCategoryLabel(this.entry)}}</span>
                </button>
            }
            $if(this.results.length === 0) {
                <div class="add-node-empty">No matching nodes found.</div>
            }
        </div>
    </div>
}
`;function Ss(){function f(a,n){return function(l){e(n,"addInitializer"),o(l,"An initializer"),a.push(l)}}function t(a,n,u,l,r,y,g,T,w){var d;switch(r){case 1:d="accessor";break;case 2:d="method";break;case 3:d="getter";break;case 4:d="setter";break;default:d="field"}var s={kind:d,name:g?"#"+n:n,static:y,private:g,metadata:T},m={v:!1};s.addInitializer=f(l,m);var i,h;r===0?g?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return a(w,s)}finally{m.v=!0}}function e(a,n){if(a.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(a,n){if(typeof a!="function")throw new TypeError(n+" must be a function")}function c(a,n){var u=typeof n;if(a===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function p(a,n,u,l,r,y,g,T,w){var d=u[0],s,m,i;g?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,S;if(typeof d=="function")h=t(d,l,s,T,r,y,g,w,i),h!==void 0&&(c(r,h),r===0?m=h:r===1?(m=h.init,x=h.get||i.get,S=h.set||i.set,i={get:x,set:S}):i=h);else for(var C=d.length-1;C>=0;C--){var M=d[C];if(h=t(M,l,s,T,r,y,g,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,S=h.set||i.set,i={get:x,set:S}):i=h,N!==void 0&&(m===void 0?m=N:typeof m=="function"?m=[m,N]:m.push(N))}}if(r===0||r===1){if(m===void 0)m=function(D,E){return E};else if(typeof m!="function"){var _=m;m=function(D,E){for(var L=E,R=0;R<_.length;R++)L=_[R].call(D,L);return L}}else{var $=m;m=function(D,E){return $.call(D,E)}}a.push(m)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),g?r===1?(a.push(function(D,E){return i.get.call(D,E)}),a.push(function(D,E){return i.set.call(D,E)})):r===2?a.push(i):a.push(function(D,E){return i.call(D,E)}):Object.defineProperty(n,l,s))}function v(a,n,u){for(var l=[],r,y,g=new Map,T=new Map,w=0;w<n.length;w++){var d=n[w];if(Array.isArray(d)){var s=d[1],m=d[2],i=d.length>3,h=s>=5,x,S;if(h?(x=a,s=s-5,y=y||[],S=y):(x=a.prototype,r=r||[],S=r),s!==0&&!i){var C=h?T:g,M=C.get(m)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+m);!M&&s>2?C.set(m,s):C.set(m,!0)}p(l,x,d,m,s,h,i,S,u)}}return b(l,r),b(l,y),l}function b(a,n){n&&a.push(function(u){for(var l=0;l<n.length;l++)n[l].call(u);return u})}function I(a,n,u){if(n.length>0){for(var l=[],r=a,y=a.name,g=n.length-1;g>=0;g--){var T={v:!1};try{var w=n[g](r,{kind:"class",name:y,addInitializer:f(l,T),metadata:u})}finally{T.v=!0}w!==void 0&&(c(10,w),r=w)}return[P(r,u),function(){for(var d=0;d<l.length;d++)l[d].call(r)}]}}function P(a,n){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,l,r){if(r!==void 0)var y=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(y===void 0?null:y),T=v(n,u,g);return l.length||P(n,g),{e:T,get c(){return I(n,l,g)}}}}function _o(f,t,e,o){return(_o=Ss())(f,t,e,o)}var Fo,Po,jo,$o,Vo,zo,Bo,Co,Mo,No,Ao,Lo,Ro,Ps;Fo=J({selector:"potatno-add-node-popup",template:So,style:Io}),jo=z.state(),$o=z.state({complexValue:!0}),Vo=nt("searchInput"),zo=ut("node-select"),Bo=ut("close");var Oo=class{static{({e:[Co,Mo,No,Ao,Lo,Ro],c:[Ps,Po]}=_o(this,[[[tt,jo],1,"open"],[$o,1,"mFilteredEntries"],[Vo,1,"searchInput"],[zo,1,"mNodeSelect"],[Bo,1,"mClose"]],[Fo]))}constructor(t=O.use(K)){this.mManager=t,this.mSearchQuery="",this.mSelectedDefinitionId=null,this.mWasOpen=!1,this.mFilteredEntries=[]}mManager;mSearchQuery;mSelectedDefinitionId;mWasOpen;#t=(Ro(this),Co(this,!1));get open(){return this.#t}set open(t){this.#t=t}#e=Mo(this,[]);get mFilteredEntries(){return this.#e}set mFilteredEntries(t){this.#e=t}#r=No(this);get searchInput(){return this.#r}set searchInput(t){this.#r=t}#o=Ao(this);get mNodeSelect(){return this.#o}set mNodeSelect(t){this.#o=t}#n=Lo(this);get mClose(){return this.#n}set mClose(t){this.#n=t}get results(){return this.mFilteredEntries}get searchValue(){return this.mSearchQuery}getEntryClass(t){return t.id===this.mSelectedDefinitionId?"add-node-result selected":"add-node-result"}getEntryColor(t){return Pt.get(t.category).cssColor}getEntryIcon(t){return Pt.get(t.category).icon}getEntryCategoryLabel(t){return Pt.get(t.category).label}onConnect(){this.mWasOpen=this.open,this.open&&(this.rebuildResults(),this.focusSearchInput())}onUpdate(){this.open&&!this.mWasOpen&&(this.rebuildResults(),this.focusSearchInput()),this.mWasOpen=this.open}onSearchInput(t){t.target instanceof HTMLInputElement&&(this.mSearchQuery=t.target.value,this.rebuildResults())}onSearchKeyDown(t){if(t.key==="Escape"){t.preventDefault(),this.mClose.dispatchEvent(void 0);return}if(t.key==="Enter"){t.preventDefault(),this.emitSelectedEntry();return}(t.key==="ArrowDown"||t.key==="ArrowUp")&&(t.preventDefault(),this.moveSelection(t.key==="ArrowDown"?1:-1))}onEntryPointerDown(t,e){t.preventDefault(),t.stopPropagation(),this.mNodeSelect.dispatchEvent(e.definition)}onRootPointerDown(t){t.stopPropagation()}onRootWheel(t){t.stopPropagation()}onRootContextMenu(t){t.stopPropagation()}buildAvailableNodeDefinitionEntries(t){let e=[],o=new Set;if(!t)return e;let c=v=>{o.has(v.id)||(o.add(v.id),e.push({category:v.category,definition:v,id:v.id,name:v.label}))};for(let v of t.project.nodeDefinitions)c(v);for(let v of t.nodeDefinitions)c(v);let p=new Set(t.imports);for(let v of t.project.imports)if(p.has(v.label))for(let b of v.nodes)c(b);return e}emitSelectedEntry(){let t=this.mFilteredEntries.find(e=>e.id===this.mSelectedDefinitionId)??this.mFilteredEntries[0];t&&this.mNodeSelect.dispatchEvent(t.definition)}focusSearchInput(){requestAnimationFrame(()=>{try{this.searchInput.focus(),this.searchInput.select()}catch{}})}moveSelection(t){if(this.mFilteredEntries.length===0){this.mSelectedDefinitionId=null;return}let o=(Math.max(0,this.mFilteredEntries.findIndex(c=>c.id===this.mSelectedDefinitionId))+t+this.mFilteredEntries.length)%this.mFilteredEntries.length;this.mSelectedDefinitionId=this.mFilteredEntries[o].id,this.mFilteredEntries=[...this.mFilteredEntries]}rebuildResults(){let t=this.mSearchQuery.trim().toLowerCase();this.mFilteredEntries=this.buildAvailableNodeDefinitionEntries(this.mManager.activeFunction).filter(e=>!t||e.name.toLowerCase().includes(t)),this.mFilteredEntries.some(e=>e.id===this.mSelectedDefinitionId)||(this.mSelectedDefinitionId=this.mFilteredEntries[0]?.id??null)}static{Po()}};var nr="http://www.w3.org/2000/svg",ir="data-temp-connection";var $e=class{clearAll(t){let e=t.querySelectorAll("path");for(let o of e)o.remove()}clearTempConnection(t){let e=t.querySelector(`[${ir}]`);e&&e.remove()}generateBezierPath(t,e,o,c){let p=Math.abs(o-t),v=Math.max(p*.4,50),b=t+v,I=e,P=o-v;return`M ${t} ${e} C ${b} ${I}, ${P} ${c}, ${o} ${c}`}renderConnections(t,e){let o=t.querySelectorAll(`path:not([${ir}])`);for(let c of o)c.remove();for(let c of e){let p=this.generateBezierPath(c.sourceX,c.sourceY,c.targetX,c.targetY),v=document.createElementNS(nr,"path");v.setAttribute("d",p),v.setAttribute("fill","none"),v.setAttribute("data-connection-id",c.id),v.setAttribute("data-hit-area","true"),v.style.stroke="transparent",v.style.strokeWidth="12",v.style.pointerEvents="stroke",v.style.cursor="pointer",t.appendChild(v);let b=document.createElementNS(nr,"path");b.setAttribute("d",p),b.setAttribute("fill","none"),b.setAttribute("data-connection-id",c.id),b.style.stroke=c.valid?"#a6adc8":"#f38ba8",b.style.strokeWidth="2",b.style.pointerEvents="none",c.valid||b.setAttribute("stroke-dasharray","6 3"),t.appendChild(b)}}renderTempConnection(t,e,o,c){this.clearTempConnection(t);let p=document.createElementNS(nr,"path");p.setAttribute("d",this.generateBezierPath(e.x,e.y,o.x,o.y)),p.setAttribute("fill","none"),p.setAttribute(ir,"true"),p.style.stroke=c,p.style.strokeWidth="2",p.style.opacity="0.6",p.style.strokeDasharray="8 4",p.style.pointerEvents="none",t.appendChild(p)}};var Uo=`:host {
    position: absolute;
    inset: 0;
    pointer-events: none;
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
`;var Go=`<svg #svgLayer class="svg-layer" xmlns="http://www.w3.org/2000/svg" (contextmenu)="this.onContextMenu($event)"></svg>
`;function Ns(){function f(a,n){return function(l){e(n,"addInitializer"),o(l,"An initializer"),a.push(l)}}function t(a,n,u,l,r,y,g,T,w){var d;switch(r){case 1:d="accessor";break;case 2:d="method";break;case 3:d="getter";break;case 4:d="setter";break;default:d="field"}var s={kind:d,name:g?"#"+n:n,static:y,private:g,metadata:T},m={v:!1};s.addInitializer=f(l,m);var i,h;r===0?g?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return a(w,s)}finally{m.v=!0}}function e(a,n){if(a.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(a,n){if(typeof a!="function")throw new TypeError(n+" must be a function")}function c(a,n){var u=typeof n;if(a===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function p(a,n,u,l,r,y,g,T,w){var d=u[0],s,m,i;g?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,S;if(typeof d=="function")h=t(d,l,s,T,r,y,g,w,i),h!==void 0&&(c(r,h),r===0?m=h:r===1?(m=h.init,x=h.get||i.get,S=h.set||i.set,i={get:x,set:S}):i=h);else for(var C=d.length-1;C>=0;C--){var M=d[C];if(h=t(M,l,s,T,r,y,g,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,S=h.set||i.set,i={get:x,set:S}):i=h,N!==void 0&&(m===void 0?m=N:typeof m=="function"?m=[m,N]:m.push(N))}}if(r===0||r===1){if(m===void 0)m=function(D,E){return E};else if(typeof m!="function"){var _=m;m=function(D,E){for(var L=E,R=0;R<_.length;R++)L=_[R].call(D,L);return L}}else{var $=m;m=function(D,E){return $.call(D,E)}}a.push(m)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),g?r===1?(a.push(function(D,E){return i.get.call(D,E)}),a.push(function(D,E){return i.set.call(D,E)})):r===2?a.push(i):a.push(function(D,E){return i.call(D,E)}):Object.defineProperty(n,l,s))}function v(a,n,u){for(var l=[],r,y,g=new Map,T=new Map,w=0;w<n.length;w++){var d=n[w];if(Array.isArray(d)){var s=d[1],m=d[2],i=d.length>3,h=s>=5,x,S;if(h?(x=a,s=s-5,y=y||[],S=y):(x=a.prototype,r=r||[],S=r),s!==0&&!i){var C=h?T:g,M=C.get(m)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+m);!M&&s>2?C.set(m,s):C.set(m,!0)}p(l,x,d,m,s,h,i,S,u)}}return b(l,r),b(l,y),l}function b(a,n){n&&a.push(function(u){for(var l=0;l<n.length;l++)n[l].call(u);return u})}function I(a,n,u){if(n.length>0){for(var l=[],r=a,y=a.name,g=n.length-1;g>=0;g--){var T={v:!1};try{var w=n[g](r,{kind:"class",name:y,addInitializer:f(l,T),metadata:u})}finally{T.v=!0}w!==void 0&&(c(10,w),r=w)}return[P(r,u),function(){for(var d=0;d<l.length;d++)l[d].call(r)}]}}function P(a,n){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,l,r){if(r!==void 0)var y=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(y===void 0?null:y),T=v(n,u,g);return l.length||P(n,g),{e:T,get c(){return I(n,l,g)}}}}function qo(f,t,e,o){return(qo=Ns())(f,t,e,o)}var Jo,Ho,Ko,Qo,Xo,Yo,Wo,As;Jo=J({selector:"potatno-connection-layer",template:Go,style:Uo}),Ko=z.state(),Qo=nt("svgLayer");var Zo=class{static{({e:[Xo,Yo,Wo],c:[As,Ho]}=qo(this,[[[tt,Ko],1,"interaction"],[Qo,1,"svgLayer"]],[Jo]))}constructor(t=O.use(K),e=O.use(Ht)){this.mConnectionRegistry=new Map,this.mManager=t,this.mPendingRenderFrame=0,this.mPortRegistry=e,this.mRenderer=new $e,this.mUnsubscribe=null}mConnectionRegistry;mManager;mPendingRenderFrame;mPortRegistry;mRenderer;mUnsubscribe;#t=(Wo(this),Xo(this,null));get interaction(){return this.#t}set interaction(t){this.#t=t}#e=Yo(this);get svgLayer(){return this.#e}set svgLayer(t){this.#e=t}onConnect(){this.mUnsubscribe=this.mManager.subscribe(F.Document|F.Function|F.ActiveFunction|F.Node|F.NodeTransform|F.Connection,null,()=>{this.scheduleRender()}),this.scheduleRender()}onDeconstruct(){this.mUnsubscribe?.(),this.mUnsubscribe=null,this.mPendingRenderFrame!==0&&(cancelAnimationFrame(this.mPendingRenderFrame),this.mPendingRenderFrame=0)}onContextMenu(t){if(!(t.target instanceof Element))return;let e=t.target.getAttribute("data-connection-id");e&&(t.preventDefault(),t.stopPropagation(),this.deleteConnectionById(e))}deleteConnectionById(t){let e=this.mConnectionRegistry.get(t);if(!e)return;let o=e.sourcePort.node.outputs.map.get(e.sourcePort.definitionId)??e.sourcePort,c=e.targetPort.node.inputs.map.get(e.targetPort.definitionId)??e.targetPort;this.mManager.graph.disconnectPorts(o,c)}getPortPosition(t){let e=this.interaction?.zoom??1,o=this.interaction?.gridSize??20,c=this.mPortRegistry.get(t),p=this.getSvgLayerOrNull();if(c&&p){let g=p.getBoundingClientRect(),T=c.getBoundingClientRect();return{x:(T.left+T.width/2-g.left)/e,y:(T.top+T.height/2-g.top)/e}}let v=t.node,b=v.transformation.x*o,I=v.transformation.y*o,P=v.transformation.width*o,a=28,n=24,u=4,l=t.direction==="output"?v.outputs.list:v.inputs.list,r=0,y=0;for(let g of l){if(g===t){r=y;break}y++}return{x:t.direction==="output"?b+P:b,y:I+a+u+(r+.5)*n}}getSvgLayerOrNull(){try{return this.svgLayer}catch{return null}}renderConnections(){let t=this.getSvgLayerOrNull();if(!t)return;let e=this.mManager.activeFunction;if(!e){this.mRenderer.clearAll(t),this.mConnectionRegistry.clear();return}let o=this.mManager.integrity.errorItems,c=[];this.mConnectionRegistry.clear();let p=0;for(let v of e.nodes)for(let b of v.outputs.list)for(let I of b.connectedPorts){let P=`c${p++}`,a=this.getPortPosition(b),n=this.getPortPosition(I),u=o.has(b)||o.has(I);this.mConnectionRegistry.set(P,{sourcePort:b,targetPort:I}),c.push({color:"var(--pn-text-secondary)",id:P,sourceX:a.x,sourceY:a.y,targetX:n.x,targetY:n.y,valid:!u})}this.mRenderer.renderConnections(t,c)}scheduleRender(){this.mPendingRenderFrame===0&&(this.mPendingRenderFrame=requestAnimationFrame(()=>{this.mPendingRenderFrame=0,this.renderConnections()}))}static{Ho()}};function Ls(){function f(a,n){return function(l){e(n,"addInitializer"),o(l,"An initializer"),a.push(l)}}function t(a,n,u,l,r,y,g,T,w){var d;switch(r){case 1:d="accessor";break;case 2:d="method";break;case 3:d="getter";break;case 4:d="setter";break;default:d="field"}var s={kind:d,name:g?"#"+n:n,static:y,private:g,metadata:T},m={v:!1};s.addInitializer=f(l,m);var i,h;r===0?g?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return a(w,s)}finally{m.v=!0}}function e(a,n){if(a.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(a,n){if(typeof a!="function")throw new TypeError(n+" must be a function")}function c(a,n){var u=typeof n;if(a===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function p(a,n,u,l,r,y,g,T,w){var d=u[0],s,m,i;g?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,S;if(typeof d=="function")h=t(d,l,s,T,r,y,g,w,i),h!==void 0&&(c(r,h),r===0?m=h:r===1?(m=h.init,x=h.get||i.get,S=h.set||i.set,i={get:x,set:S}):i=h);else for(var C=d.length-1;C>=0;C--){var M=d[C];if(h=t(M,l,s,T,r,y,g,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,S=h.set||i.set,i={get:x,set:S}):i=h,N!==void 0&&(m===void 0?m=N:typeof m=="function"?m=[m,N]:m.push(N))}}if(r===0||r===1){if(m===void 0)m=function(D,E){return E};else if(typeof m!="function"){var _=m;m=function(D,E){for(var L=E,R=0;R<_.length;R++)L=_[R].call(D,L);return L}}else{var $=m;m=function(D,E){return $.call(D,E)}}a.push(m)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),g?r===1?(a.push(function(D,E){return i.get.call(D,E)}),a.push(function(D,E){return i.set.call(D,E)})):r===2?a.push(i):a.push(function(D,E){return i.call(D,E)}):Object.defineProperty(n,l,s))}function v(a,n,u){for(var l=[],r,y,g=new Map,T=new Map,w=0;w<n.length;w++){var d=n[w];if(Array.isArray(d)){var s=d[1],m=d[2],i=d.length>3,h=s>=5,x,S;if(h?(x=a,s=s-5,y=y||[],S=y):(x=a.prototype,r=r||[],S=r),s!==0&&!i){var C=h?T:g,M=C.get(m)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+m);!M&&s>2?C.set(m,s):C.set(m,!0)}p(l,x,d,m,s,h,i,S,u)}}return b(l,r),b(l,y),l}function b(a,n){n&&a.push(function(u){for(var l=0;l<n.length;l++)n[l].call(u);return u})}function I(a,n,u){if(n.length>0){for(var l=[],r=a,y=a.name,g=n.length-1;g>=0;g--){var T={v:!1};try{var w=n[g](r,{kind:"class",name:y,addInitializer:f(l,T),metadata:u})}finally{T.v=!0}w!==void 0&&(c(10,w),r=w)}return[P(r,u),function(){for(var d=0;d<l.length;d++)l[d].call(r)}]}}function P(a,n){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,l,r){if(r!==void 0)var y=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(y===void 0?null:y),T=v(n,u,g);return l.length||P(n,g),{e:T,get c(){return I(n,l,g)}}}}function en(f,t,e,o){return(en=Ls())(f,t,e,o)}var rn,ko,ve;rn=yt({access:X.Read,selector:/^potatno-preview$/});var tn=class{static{({c:[ve,ko]}=en(this,[],[rn]))}constructor(t=O.use(Z),e=O.use(H),o=O.use(et)){this.mTarget=t,this.mProcedure=e.createExpressionProcedure(o.value)}mProcedure;mTarget;onUpdate(){let t=this.mProcedure.execute();if(!t){let o=this.mTarget.childNodes.length>0;return o&&(this.mTarget.innerHTML=""),o}let e=t.element;return this.mTarget.contains(e)?!1:(this.mTarget.innerHTML="",this.mTarget.appendChild(e),!0)}static{ko()}};var on=`:host {\r
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
`;var nn=`<div [className]="this.portWrapperClasses" [title]="this.portTypeLabel" style="--port-color: {{this.portColor}}">
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
`;function _s(){function f(a,n){return function(l){e(n,"addInitializer"),o(l,"An initializer"),a.push(l)}}function t(a,n,u,l,r,y,g,T,w){var d;switch(r){case 1:d="accessor";break;case 2:d="method";break;case 3:d="getter";break;case 4:d="setter";break;default:d="field"}var s={kind:d,name:g?"#"+n:n,static:y,private:g,metadata:T},m={v:!1};s.addInitializer=f(l,m);var i,h;r===0?g?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return a(w,s)}finally{m.v=!0}}function e(a,n){if(a.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(a,n){if(typeof a!="function")throw new TypeError(n+" must be a function")}function c(a,n){var u=typeof n;if(a===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function p(a,n,u,l,r,y,g,T,w){var d=u[0],s,m,i;g?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,S;if(typeof d=="function")h=t(d,l,s,T,r,y,g,w,i),h!==void 0&&(c(r,h),r===0?m=h:r===1?(m=h.init,x=h.get||i.get,S=h.set||i.set,i={get:x,set:S}):i=h);else for(var C=d.length-1;C>=0;C--){var M=d[C];if(h=t(M,l,s,T,r,y,g,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,S=h.set||i.set,i={get:x,set:S}):i=h,N!==void 0&&(m===void 0?m=N:typeof m=="function"?m=[m,N]:m.push(N))}}if(r===0||r===1){if(m===void 0)m=function(D,E){return E};else if(typeof m!="function"){var _=m;m=function(D,E){for(var L=E,R=0;R<_.length;R++)L=_[R].call(D,L);return L}}else{var $=m;m=function(D,E){return $.call(D,E)}}a.push(m)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),g?r===1?(a.push(function(D,E){return i.get.call(D,E)}),a.push(function(D,E){return i.set.call(D,E)})):r===2?a.push(i):a.push(function(D,E){return i.call(D,E)}):Object.defineProperty(n,l,s))}function v(a,n,u){for(var l=[],r,y,g=new Map,T=new Map,w=0;w<n.length;w++){var d=n[w];if(Array.isArray(d)){var s=d[1],m=d[2],i=d.length>3,h=s>=5,x,S;if(h?(x=a,s=s-5,y=y||[],S=y):(x=a.prototype,r=r||[],S=r),s!==0&&!i){var C=h?T:g,M=C.get(m)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+m);!M&&s>2?C.set(m,s):C.set(m,!0)}p(l,x,d,m,s,h,i,S,u)}}return b(l,r),b(l,y),l}function b(a,n){n&&a.push(function(u){for(var l=0;l<n.length;l++)n[l].call(u);return u})}function I(a,n,u){if(n.length>0){for(var l=[],r=a,y=a.name,g=n.length-1;g>=0;g--){var T={v:!1};try{var w=n[g](r,{kind:"class",name:y,addInitializer:f(l,T),metadata:u})}finally{T.v=!0}w!==void 0&&(c(10,w),r=w)}return[P(r,u),function(){for(var d=0;d<l.length;d++)l[d].call(r)}]}}function P(a,n){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,l,r){if(r!==void 0)var y=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(y===void 0?null:y),T=v(n,u,g);return l.length||P(n,g),{e:T,get c(){return I(n,l,g)}}}}function fn(f,t,e,o){return(fn=_s())(f,t,e,o)}var gn,sn,vn,yn,bn,wn,xn,Tn,an,ln,cn,un,hn,mn,dn,sr;gn=J({selector:"potatno-port",template:nn,style:on}),vn=z.state(),yn=z.state(),bn=ut("port-drag-start"),wn=ut("port-hover"),xn=ut("port-leave"),Tn=nt("portCircle");var pn=class{static{({e:[an,ln,cn,un,hn,mn,dn],c:[sr,sn]}=fn(this,[[[tt,vn],1,"port"],[[tt,yn],1,"ownerNode"],[bn,1,"mPortDragStart"],[wn,1,"mPortHover"],[xn,1,"mPortLeave"],[Tn,1,"portCircleElement"]],[gn]))}constructor(t=O.use(B),e=O.use(K),o=O.use(Ht)){this.mComponent=t,this.mLastRegisteredPort=null,this.mManager=e,this.mPortRegistry=o,this.mUnsubscribe=null}mComponent;mLastRegisteredPort;mManager;mPortRegistry;mUnsubscribe;#t=(dn(this),an(this,null));get port(){return this.#t}set port(t){this.#t=t}#e=ln(this,null);get ownerNode(){return this.#e}set ownerNode(t){this.#e=t}#r=cn(this);get mPortDragStart(){return this.#r}set mPortDragStart(t){this.#r=t}#o=un(this);get mPortHover(){return this.#o}set mPortHover(t){this.#o=t}#n=hn(this);get mPortLeave(){return this.#n}set mPortLeave(t){this.#n=t}#i=mn(this);get portCircleElement(){return this.#i}set portCircleElement(t){this.#i=t}get hasError(){return this.port!==null&&this.mManager.integrity.errorItems.has(this.port)}get portName(){return this.port?.label??""}get portTypeLabel(){return this.port?.dataType??""}get portWrapperClasses(){return`port-wrapper ${this.port?.direction==="output"?"direction-output":"direction-input"}`}get portCircleClasses(){if(!this.port)return"port-circle disconnected direction-input";let t=["port-circle"];return t.push(this.port.connectedPorts.size>0?"connected":"disconnected"),t.push(this.port.direction==="output"?"direction-output":"direction-input"),this.hasError&&t.push("has-error"),t.join(" ")}get portColor(){if(!this.port||this.port.portType==="flow")return"var(--pn-text-primary)";if(this.port.node.project.types.isGenericType(this.port.dataType??"")){if(this.port.connectedPorts.size>0){let t=[...this.port.connectedPorts][0];return this.getTypeColor(t.dataType??"")}return"var(--pn-text-muted)"}return this.getTypeColor(this.port.dataType??"")}get showDirectValueInput(){return this.port?this.port.portType==="value"&&this.port.direction==="input"&&this.port.connectedPorts.size===0&&!this.port.node.project.types.isGenericType(this.port.dataType??""):!1}get directValueInputDefs(){return!this.port||this.port.portType!=="value"?[]:this.port.node.project.types.isGenericType(this.port.dataType??"")?[]:this.port.project.types.getType(this.port.dataType??"").inputs.map((e,o)=>({htmlType:e.type==="number"?"number":e.type==="boolean"?"checkbox":"text",index:o,name:e.name,value:this.port.directValue[o]??""}))}onConnect(){this.mUnsubscribe=this.mManager.subscribe(F.Connection|F.Node,null,()=>{this.mComponent.updater.update()})}onDeconstruct(){this.mUnsubscribe?.(),this.mUnsubscribe=null,this.mLastRegisteredPort&&(this.mPortRegistry.unregister(this.mLastRegisteredPort),this.mLastRegisteredPort=null)}onUpdate(){let t=this.port,e=this.ownerNode;if(!t||!e||t===this.mLastRegisteredPort)return;let o;try{o=this.portCircleElement}catch{return}this.mLastRegisteredPort&&this.mLastRegisteredPort!==t&&this.mPortRegistry.unregister(this.mLastRegisteredPort),this.mLastRegisteredPort=t,this.mPortRegistry.register(t,o),this.mManager.graph.transformNode(e,{})}onPointerDown(t){t.stopPropagation(),t.preventDefault(),!(!this.port||!this.ownerNode)&&this.mPortDragStart.dispatchEvent({node:this.ownerNode,port:this.port,element:this.portCircleElement})}onPointerEnter(t){!this.port||!this.ownerNode||this.mPortHover.dispatchEvent({node:this.ownerNode,port:this.port,element:this.portCircleElement})}onPointerLeave(t){this.mPortLeave.dispatchEvent(void 0)}onDirectValueInput(t,e){if(!this.port)return;let o=t.target,c=[...this.port.directValue];c[e]=o.type==="checkbox"?o.checked?"true":"false":o.value,this.mManager.graph.setPortDirectValue(this.port,c)}getTypeColor(t){let e=0;for(let c=0;c<t.length;c++)e=t.charCodeAt(c)+((e<<5)-e);return`hsl(${Math.abs(e)*137.508%360}, 70%, 60%)`}static{sn()}};var En=`:host {\r
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
.preview-eye-btn {\r
    background: none;\r
    border: 1px solid currentColor;\r
    border-radius: 3px;\r
    color: inherit;\r
    font-size: 9px;\r
    line-height: 1;\r
    padding: 1px 4px;\r
    cursor: pointer;\r
    opacity: 0.55;\r
    flex-shrink: 0;\r
}\r
\r
.preview-eye-btn:hover {\r
    opacity: 0.85;\r
}\r
\r
.preview-eye-btn.active {\r
    opacity: 1;\r
    background: rgba(255, 255, 255, 0.25);\r
}\r
\r
.preview-eye-wrapper {\r
    position: relative;\r
    display: inline-flex;\r
    flex-shrink: 0;\r
}\r
\r
.preview-port-menu {\r
    display: none;\r
    position: absolute;\r
    top: 100%;\r
    right: 0;\r
    z-index: 50;\r
    min-width: 96px;\r
    flex-direction: column;\r
    background: var(--pn-bg-elevated);\r
    border: 1px solid var(--pn-border-default);\r
    border-radius: 4px;\r
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);\r
    padding: 2px 0;\r
}\r
\r
.preview-eye-wrapper:hover .preview-port-menu {\r
    display: flex;\r
}\r
\r
.preview-port-item {\r
    background: none;\r
    border: none;\r
    color: var(--pn-text-primary);\r
    cursor: pointer;\r
    font-family: var(--pn-font-family);\r
    font-size: var(--pn-font-size-sm);\r
    padding: 3px 8px;\r
    text-align: left;\r
}\r
\r
.preview-port-item:hover {\r
    background: var(--pn-bg-surface);\r
}\r
\r
.preview-port-item.active {\r
    color: var(--pn-accent-primary);\r
}\r
\r
.preview-style-bar {\r
    display: flex;\r
    justify-content: flex-end;\r
    padding: 2px 4px 0;\r
}\r
\r
.preview-style-select {\r
    background: var(--pn-bg-surface);\r
    border: 1px solid var(--pn-border-default);\r
    border-radius: 3px;\r
    color: var(--pn-text-secondary);\r
    font-family: var(--pn-font-family);\r
    font-size: var(--pn-font-size-sm);\r
    padding: 0 2px;\r
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
`;var Dn=`$if(this.nodeData) {
    $if(this.isReroute) {
        <div class="node-reroute {{this.selectedClass}} {{this.hasErrorClass}}">
            <div class="reroute-inputs">
                $for(inPort of this.inputPorts) {
                    <potatno-port
                        [port]="this.inPort"
                        [ownerNode]="this.nodeData"
                        (port-drag-start)="this.onPortDragStart($event)"
                        (port-hover)="this.onPortHover($event)"
                        (port-leave)="this.onPortLeave($event)">
                    </potatno-port>
                }
            </div>
            <div class="reroute-dot"></div>
            <div class="reroute-outputs">
                $for(outPort of this.outputPorts) {
                    <potatno-port
                        [port]="this.outPort"
                        [ownerNode]="this.nodeData"
                        (port-drag-start)="this.onPortDragStart($event)"
                        (port-hover)="this.onPortHover($event)"
                        (port-leave)="this.onPortLeave($event)">
                    </potatno-port>
                }
            </div>
        </div>
    }
    $if(!this.isReroute) {
    $if(this.isComment) {
        <div class="node-comment {{this.selectedClass}} {{this.hasErrorClass}}"
             [style]="this.commentSizeStyle">
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
        <div class="node {{this.selectedClass}} {{this.hasErrorClass}}">
            <div class="node-header" style="background: {{this.categoryColor}}">
                <span class="node-icon">{{this.categoryIcon}}</span>
                <span class="node-label">{{this.nodeName}}</span>
                $if(this.showOpenButton) {
                    <button class="open-function-btn"
                            (click)="this.onOpenFunction($event)">
                        open
                    </button>
                }
                $if(this.canPreview) {
                    <div class="preview-eye-wrapper">
                        <button [className]="this.previewEyeClass">\u{1F441}</button>
                        <div class="preview-port-menu">
                            <button [className]="this.previewNoneClass"
                                    (click)="this.onClearPreview($event)">
                                None
                            </button>
                            $for(port of this.valueOutputPorts) {
                                <button [className]="this.previewPortClass(this.port)"
                                        (click)="this.onSelectPreviewPort($event, this.port)">
                                    {{this.port.label}}
                                </button>
                            }
                        </div>
                    </div>
                }
            </div>
            <div class="node-body">
                <div class="node-inputs">
                    $for(inPort of this.inputPorts) {
                        <potatno-port
                            [port]="this.inPort"
                            [ownerNode]="this.nodeData"
                            (port-drag-start)="this.onPortDragStart($event)"
                            (port-hover)="this.onPortHover($event)"
                            (port-leave)="this.onPortLeave($event)"
                            (port-element-ready)="this.onPortElementReady($event)">
                        </potatno-port>
                    }
                </div>
                <div class="node-outputs">
                    $for(outPort of this.outputPorts) {
                        <potatno-port
                            [port]="this.outPort"
                            [ownerNode]="this.nodeData"
                            (port-drag-start)="this.onPortDragStart($event)"
                            (port-hover)="this.onPortHover($event)"
                            (port-leave)="this.onPortLeave($event)"
                            (port-element-ready)="this.onPortElementReady($event)">
                        </potatno-port>
                    }
                </div>
            </div>
            $if(this.isPreviewActive) {
                <div class="preview-style-bar">
                    <select class="preview-style-select" (change)="this.onSelectPreviewStyle($event)">
                        $for(display of this.previewDisplays) {
                            <option [value]="this.display" [selected]="this.display === this.selectedDisplayId">{{this.display}}</option>
                        }
                    </select>
                </div>
            }
            <div class="node-preview" potatno-preview="this.previewDriver"></div>
        </div>
    }
    }
}
`;function $s(){function f(a,n){return function(l){e(n,"addInitializer"),o(l,"An initializer"),a.push(l)}}function t(a,n,u,l,r,y,g,T,w){var d;switch(r){case 1:d="accessor";break;case 2:d="method";break;case 3:d="getter";break;case 4:d="setter";break;default:d="field"}var s={kind:d,name:g?"#"+n:n,static:y,private:g,metadata:T},m={v:!1};s.addInitializer=f(l,m);var i,h;r===0?g?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return a(w,s)}finally{m.v=!0}}function e(a,n){if(a.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(a,n){if(typeof a!="function")throw new TypeError(n+" must be a function")}function c(a,n){var u=typeof n;if(a===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function p(a,n,u,l,r,y,g,T,w){var d=u[0],s,m,i;g?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,S;if(typeof d=="function")h=t(d,l,s,T,r,y,g,w,i),h!==void 0&&(c(r,h),r===0?m=h:r===1?(m=h.init,x=h.get||i.get,S=h.set||i.set,i={get:x,set:S}):i=h);else for(var C=d.length-1;C>=0;C--){var M=d[C];if(h=t(M,l,s,T,r,y,g,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,S=h.set||i.set,i={get:x,set:S}):i=h,N!==void 0&&(m===void 0?m=N:typeof m=="function"?m=[m,N]:m.push(N))}}if(r===0||r===1){if(m===void 0)m=function(D,E){return E};else if(typeof m!="function"){var _=m;m=function(D,E){for(var L=E,R=0;R<_.length;R++)L=_[R].call(D,L);return L}}else{var $=m;m=function(D,E){return $.call(D,E)}}a.push(m)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),g?r===1?(a.push(function(D,E){return i.get.call(D,E)}),a.push(function(D,E){return i.set.call(D,E)})):r===2?a.push(i):a.push(function(D,E){return i.call(D,E)}):Object.defineProperty(n,l,s))}function v(a,n,u){for(var l=[],r,y,g=new Map,T=new Map,w=0;w<n.length;w++){var d=n[w];if(Array.isArray(d)){var s=d[1],m=d[2],i=d.length>3,h=s>=5,x,S;if(h?(x=a,s=s-5,y=y||[],S=y):(x=a.prototype,r=r||[],S=r),s!==0&&!i){var C=h?T:g,M=C.get(m)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+m);!M&&s>2?C.set(m,s):C.set(m,!0)}p(l,x,d,m,s,h,i,S,u)}}return b(l,r),b(l,y),l}function b(a,n){n&&a.push(function(u){for(var l=0;l<n.length;l++)n[l].call(u);return u})}function I(a,n,u){if(n.length>0){for(var l=[],r=a,y=a.name,g=n.length-1;g>=0;g--){var T={v:!1};try{var w=n[g](r,{kind:"class",name:y,addInitializer:f(l,T),metadata:u})}finally{T.v=!0}w!==void 0&&(c(10,w),r=w)}return[P(r,u),function(){for(var d=0;d<l.length;d++)l[d].call(r)}]}}function P(a,n){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,l,r){if(r!==void 0)var y=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(y===void 0?null:y),T=v(n,u,g);return l.length||P(n,g),{e:T,get c(){return I(n,l,g)}}}}function _n(f,t,e,o){return(_n=$s())(f,t,e,o)}var Fn,In,jn,$n,Vn,zn,Bn,Un,Gn,Sn,Pn,Cn,Mn,Nn,An,Ln,Rn,Vs;Fn=J({selector:"potatno-node",template:Dn,style:En,modules:[ve],components:[sr]}),jn=z.state(),$n=z.state(),Vn=z.state(),zn=ut("port-drag-start"),Bn=ut("port-hover"),Un=ut("port-leave"),Gn=ut("resize-start");var On=class{static{({e:[Sn,Pn,Cn,Mn,Nn,An,Ln,Rn],c:[Vs,In]}=_n(this,[[[tt,jn],1,"nodeData"],[[tt,$n],1,"selected"],[[tt,Vn],1,"gridSize"],[zn,1,"mPortDragStart"],[Bn,1,"mPortHover"],[Un,1,"mPortLeave"],[Gn,1,"mResizeStart"]],[Fn]))}constructor(t=O.use(B),e=O.use(K)){this.mComponent=t,this.mManager=e,this.mUnsubscribe=null}mComponent;mManager;mUnsubscribe;#t=(Rn(this),Sn(this,null));get nodeData(){return this.#t}set nodeData(t){this.#t=t}#e=Pn(this,!1);get selected(){return this.#e}set selected(t){this.#e=t}#r=Cn(this,20);get gridSize(){return this.#r}set gridSize(t){this.#r=t}#o=Mn(this);get mPortDragStart(){return this.#o}set mPortDragStart(t){this.#o=t}#n=Nn(this);get mPortHover(){return this.#n}set mPortHover(t){this.#n=t}#i=An(this);get mPortLeave(){return this.#i}set mPortLeave(t){this.#i=t}#s=Ln(this);get mResizeStart(){return this.#s}set mResizeStart(t){this.#s=t}get selectedClass(){return this.selected?"selected":""}get hasErrorClass(){return this.nodeData!==null&&this.mManager.integrity.errorItems.has(this.nodeData)?"has-error":""}get isComment(){return this.nodeData?.category===ht.Comment}get isReroute(){return this.nodeData?.category===ht.Reroute}get isFunction(){return this.nodeData?.category===ht.Function}get showOpenButton(){return this.isFunction}get canPreview(){return this.valueOutputPorts.length>0}get isPreviewActive(){return this.nodeData?.preview!=null}get previewEyeClass(){return this.isPreviewActive?"preview-eye-btn active":"preview-eye-btn"}get previewDisplays(){if(!this.nodeData)return[];let t=this.nodeData.project,e=t.getFunction(this.nodeData.function.definitionId);if(!e)return[];let o=this.nodeData.preview,c=o?this.nodeData.outputs.map.get(o.portId):void 0;if(c&&c.portType==="value")return t.preview.availablePreviewTypes(e,c.resolvedDataType);let p=new Set;for(let v of this.valueOutputPorts)for(let b of t.preview.availablePreviewTypes(e,v.resolvedDataType))p.add(b);return[...p]}get previewDriver(){return this.nodeData?this.mManager.preview.nodeDriver(this.nodeData):null}get valueOutputPorts(){return this.nodeData?[...this.nodeData.outputs.value]:[]}get selectedDisplayId(){return this.nodeData?.preview?.displayId??""}get previewNoneClass(){return this.isPreviewActive?"preview-port-item":"preview-port-item active"}get categoryColor(){return this.nodeData?Pt.get(this.nodeData.category).cssColor:""}get categoryIcon(){return this.nodeData?Pt.get(this.nodeData.category).icon:""}get nodeLabel(){return this.nodeData?.label??""}get nodeName(){if(!this.nodeData)return"";let t=this.nodeData;return t.project.nodeDefinitions.find(o=>o.id===t.definitionId)?.label??t.label}get commentSizeStyle(){return this.nodeData?`height: ${this.nodeData.transformation.height*this.gridSize}px;`:""}get inputPorts(){return this.nodeData?[...this.nodeData.inputs.list]:[]}get outputPorts(){return this.nodeData?[...this.nodeData.outputs.list]:[]}isPreviewedPort(t){return this.nodeData?.preview?.portId===t.definitionId}previewPortClass(t){return this.isPreviewedPort(t)?"preview-port-item active":"preview-port-item"}onConnect(){this.mUnsubscribe=this.mManager.subscribe(F.Function|F.ActiveFunction|F.Node|F.Connection|F.Preview,null,()=>{this.mComponent.updater.update()})}onDeconstruct(){this.mUnsubscribe?.(),this.mUnsubscribe=null}onPortDragStart(t){this.mPortDragStart.dispatchEvent(t.value)}onPortHover(t){this.mPortHover.dispatchEvent(t.value)}onPortLeave(){this.mPortLeave.dispatchEvent(void 0)}onSelectPreviewPort(t,e){t.stopPropagation();let o=this.previewDisplaysForPort(e);this.mManager.graph.updateNode(this.nodeData,c=>{if(c.preview?.portId===e.definitionId){c.preview=null;return}let p=c.preview&&o.includes(c.preview.displayId)?c.preview.displayId:o[0];p&&(c.preview={portId:e.definitionId,displayId:p})})}previewDisplaysForPort(t){if(!this.nodeData)return[];let e=this.nodeData.project.getFunction(this.nodeData.function.definitionId);return e?this.nodeData.project.preview.availablePreviewTypes(e,t.resolvedDataType):[]}onClearPreview(t){t.stopPropagation(),this.mManager.graph.updateNode(this.nodeData,e=>{e.preview=null})}onSelectPreviewStyle(t){t.stopPropagation();let e=t.target.value;this.mManager.graph.updateNode(this.nodeData,o=>{o.preview&&(o.preview={portId:o.preview.portId,displayId:e})})}onOpenFunction(t){if(t.stopPropagation(),!this.nodeData)return;let e=this.nodeData.definitionId,o=e.startsWith("USERFUNCTION_")?e.slice(13):e;this.mManager.setActiveFunction(o)}onCommentInput(t){let e=t.target;this.mManager.graph.updateNode(this.nodeData,o=>{o.label=e.value})}onResizeStart(t){t.stopPropagation(),t.preventDefault(),this.nodeData&&this.mResizeStart.dispatchEvent({node:this.nodeData,startX:t.clientX,startY:t.clientY})}static{In()}};function zs(){function f(a,n){return function(l){e(n,"addInitializer"),o(l,"An initializer"),a.push(l)}}function t(a,n,u,l,r,y,g,T,w){var d;switch(r){case 1:d="accessor";break;case 2:d="method";break;case 3:d="getter";break;case 4:d="setter";break;default:d="field"}var s={kind:d,name:g?"#"+n:n,static:y,private:g,metadata:T},m={v:!1};s.addInitializer=f(l,m);var i,h;r===0?g?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return a(w,s)}finally{m.v=!0}}function e(a,n){if(a.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(a,n){if(typeof a!="function")throw new TypeError(n+" must be a function")}function c(a,n){var u=typeof n;if(a===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function p(a,n,u,l,r,y,g,T,w){var d=u[0],s,m,i;g?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,S;if(typeof d=="function")h=t(d,l,s,T,r,y,g,w,i),h!==void 0&&(c(r,h),r===0?m=h:r===1?(m=h.init,x=h.get||i.get,S=h.set||i.set,i={get:x,set:S}):i=h);else for(var C=d.length-1;C>=0;C--){var M=d[C];if(h=t(M,l,s,T,r,y,g,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,S=h.set||i.set,i={get:x,set:S}):i=h,N!==void 0&&(m===void 0?m=N:typeof m=="function"?m=[m,N]:m.push(N))}}if(r===0||r===1){if(m===void 0)m=function(D,E){return E};else if(typeof m!="function"){var _=m;m=function(D,E){for(var L=E,R=0;R<_.length;R++)L=_[R].call(D,L);return L}}else{var $=m;m=function(D,E){return $.call(D,E)}}a.push(m)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),g?r===1?(a.push(function(D,E){return i.get.call(D,E)}),a.push(function(D,E){return i.set.call(D,E)})):r===2?a.push(i):a.push(function(D,E){return i.call(D,E)}):Object.defineProperty(n,l,s))}function v(a,n,u){for(var l=[],r,y,g=new Map,T=new Map,w=0;w<n.length;w++){var d=n[w];if(Array.isArray(d)){var s=d[1],m=d[2],i=d.length>3,h=s>=5,x,S;if(h?(x=a,s=s-5,y=y||[],S=y):(x=a.prototype,r=r||[],S=r),s!==0&&!i){var C=h?T:g,M=C.get(m)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+m);!M&&s>2?C.set(m,s):C.set(m,!0)}p(l,x,d,m,s,h,i,S,u)}}return b(l,r),b(l,y),l}function b(a,n){n&&a.push(function(u){for(var l=0;l<n.length;l++)n[l].call(u);return u})}function I(a,n,u){if(n.length>0){for(var l=[],r=a,y=a.name,g=n.length-1;g>=0;g--){var T={v:!1};try{var w=n[g](r,{kind:"class",name:y,addInitializer:f(l,T),metadata:u})}finally{T.v=!0}w!==void 0&&(c(10,w),r=w)}return[P(r,u),function(){for(var d=0;d<l.length;d++)l[d].call(r)}]}}function P(a,n){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,l,r){if(r!==void 0)var y=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(y===void 0?null:y),T=v(n,u,g);return l.length||P(n,g),{e:T,get c(){return I(n,l,g)}}}}function ti(f,t,e,o){return(ti=zs())(f,t,e,o)}var ei,Hn,ri,oi,ni,ii,si,ai,li,Xn,Yn,Wn,Zn,qn,Jn,Kn,Qn,Bs;ei=J({selector:"potatno-node-graph",template:Do,style:Eo}),ri=z.state({complexValue:!0}),oi=z.state(),ni=z.state(),ii=z.state({complexValue:!0}),si=z.state({complexValue:!0}),ai=z.state({complexValue:!0}),li=nt("canvasWrapper");var kn=class{static{({e:[Xn,Yn,Wn,Zn,qn,Jn,Kn,Qn],c:[Bs,Hn]}=ti(this,[[ri,1,"mCachedGraphData"],[oi,1,"mTransformVersion"],[ni,1,"mShowSelectionBox"],[ii,1,"mSelectionBoxScreen"],[si,1,"mAddNodePopup"],[ai,1,"mTempConnection"],[li,1,"canvasWrapper"]],[ei]))}constructor(t=O.use(B),e=O.use(K),o=O.use(Ht)){this.mCachedGraphData={visibleNodes:[]},this.mClipboard=new je,this.mComponent=t,this.mDocumentPointerMoveHandler=null,this.mDocumentPointerUpHandler=null,this.mHoveredPort=null,this.mInteraction=new Fe(20),this.mInteractionState={mode:"idle"},this.mKeyboardHandler=null,this.mManager=e,this.mPortRegistry=o,this.mSelectedNodes=new Set,this.mUnsubscribe=null}mClipboard;mComponent;mInteraction;mManager;mPortRegistry;mSelectedNodes;mDocumentPointerMoveHandler;mDocumentPointerUpHandler;mHoveredPort;mInteractionState;mKeyboardHandler;mUnsubscribe;#t=(Qn(this),Xn(this));get mCachedGraphData(){return this.#t}set mCachedGraphData(t){this.#t=t}#e=Yn(this,0);get mTransformVersion(){return this.#e}set mTransformVersion(t){this.#e=t}#r=Wn(this,!1);get mShowSelectionBox(){return this.#r}set mShowSelectionBox(t){this.#r=t}#o=Zn(this,{x1:0,x2:0,y1:0,y2:0});get mSelectionBoxScreen(){return this.#o}set mSelectionBoxScreen(t){this.#o=t}#n=qn(this,null);get mAddNodePopup(){return this.#n}set mAddNodePopup(t){this.#n=t}#i=Jn(this,null);get mTempConnection(){return this.#i}set mTempConnection(t){this.#i=t}#s=Kn(this);get canvasWrapper(){return this.#s}set canvasWrapper(t){this.#s=t}get canvasInteraction(){return this.mInteraction}get showTempConnection(){return this.mTempConnection!==null}get tempWirePath(){let t=this.mTempConnection;return t?this.generateBezierPath(t.start.x,t.start.y,t.end.x,t.end.y):""}get gridBackgroundStyle(){return this.mTransformVersion,this.mInteraction.getGridBackgroundCss()}get gridTransformStyle(){return this.mTransformVersion,"transform: "+this.mInteraction.getTransformCss()}get gridSize(){return this.mInteraction.gridSize}get showSelectionBox(){return this.mShowSelectionBox}get selectionBoxStyle(){let t=Math.min(this.mSelectionBoxScreen.x1,this.mSelectionBoxScreen.x2),e=Math.min(this.mSelectionBoxScreen.y1,this.mSelectionBoxScreen.y2),o=Math.abs(this.mSelectionBoxScreen.x2-this.mSelectionBoxScreen.x1),c=Math.abs(this.mSelectionBoxScreen.y2-this.mSelectionBoxScreen.y1);return`left: ${t}px; top: ${e}px; width: ${o}px; height: ${c}px`}get visibleNodes(){return this.mCachedGraphData.visibleNodes}get showAddNodePopup(){return this.mAddNodePopup!==null}get addNodePopupStyle(){let t=this.mAddNodePopup;return t?`left: ${t.screenX}px; top: ${t.screenY}px`:""}onConnect(){this.mKeyboardHandler=t=>this.onKeyDown(t),document.addEventListener("keydown",this.mKeyboardHandler),this.mUnsubscribe=this.mManager.subscribe(F.Document|F.Function|F.ActiveFunction|F.Node|F.Connection,null,t=>{(t.changeType===F.Document||t.changeType===F.Function||t.changeType===F.ActiveFunction)&&this.resetForActiveFunction(),this.invalidateGraphContent(),this.mComponent.updater.update()}),this.invalidateGraphContent()}onDeconstruct(){this.stopDocumentPointerTracking(),this.mUnsubscribe?.(),this.mUnsubscribe=null,this.mKeyboardHandler&&(document.removeEventListener("keydown",this.mKeyboardHandler),this.mKeyboardHandler=null)}onCanvasPointerDown(t){if(this.closeAddNodePopup(),t.button===1){t.preventDefault(),this.mInteractionState={mode:"panning",startX:t.clientX,startY:t.clientY},this.startDocumentPointerTracking();return}if(t.button!==0)return;t.ctrlKey||(this.mSelectedNodes.clear(),this.invalidateNodeVisuals());let e=this.getLocalPointerPosition(t.clientX,t.clientY);this.mInteractionState={mode:"selecting"},this.mSelectionBoxScreen={x1:e.x,x2:e.x,y1:e.y,y2:e.y},this.mShowSelectionBox=!1,this.startDocumentPointerTracking()}onCanvasWheel(t){t.preventDefault();let e=this.getLocalPointerPosition(t.clientX,t.clientY);this.mInteraction.zoomAt(e.x,e.y,t.deltaY>0?-.1:.1),this.mTransformVersion++}onContextMenu(t){t.preventDefault(),!this.eventPathContainsGraphNode(t)&&this.openAddNodePopupAtPointer(t.clientX,t.clientY)}onNodePointerDown(t,e){for(let p of t.composedPath())if(p instanceof HTMLElement&&p.tagName.toLowerCase()==="potatno-port")return;if(t.stopPropagation(),this.closeAddNodePopup(),t.button!==0)return;t.ctrlKey?this.mSelectedNodes.has(e)?this.mSelectedNodes.delete(e):this.mSelectedNodes.add(e):this.mSelectedNodes.has(e)||(this.mSelectedNodes.clear(),this.mSelectedNodes.add(e)),this.invalidateNodeVisuals();let o=this.mInteraction.gridSize,c=new Map;for(let p of this.mSelectedNodes)c.set(p,{originX:p.transformation.x*o,originY:p.transformation.y*o});e.category===ht.Comment&&this.addCommentContainedNodeOrigins(e,c),this.mInteractionState={mode:"dragging-node",origins:c,startX:t.clientX,startY:t.clientY},this.startDocumentPointerTracking()}onPortDragStart(t){let e=this.canvasWrapper.getBoundingClientRect(),o=t.value.element.getBoundingClientRect(),c=(o.left+o.width/2-e.left-this.mInteraction.panX)/this.mInteraction.zoom,p=(o.top+o.height/2-e.top-this.mInteraction.panY)/this.mInteraction.zoom;this.closeAddNodePopup(),this.mInteractionState={mode:"dragging-wire",sourcePort:t.value.port,startX:c,startY:p},this.startDocumentPointerTracking()}onPortHover(t){this.mHoveredPort={node:t.value.node,port:t.value.port}}onPortLeave(){this.mHoveredPort=null}onNodeResizeStart(t){this.closeAddNodePopup(),this.mInteractionState={mode:"resizing-comment",node:t.value.node,originalH:t.value.node.transformation.height,originalW:t.value.node.transformation.width,startX:t.value.startX,startY:t.value.startY},this.startDocumentPointerTracking()}onAddNodePopupNodeSelect(t){this.insertNodeFromAddPopup(t.value)}onAddNodePopupClose(){this.closeAddNodePopup()}onDocumentPointerMove(t){let e=this.mInteractionState;if(e.mode==="panning"){this.mInteraction.pan(t.clientX-e.startX,t.clientY-e.startY),e.startX=t.clientX,e.startY=t.clientY,this.mTransformVersion++;return}if(e.mode==="dragging-node"){this.dragSelectedNodes(t,e);return}if(e.mode==="dragging-wire"){this.renderDraggedWire(t,e);return}if(e.mode==="selecting"){let o=this.getLocalPointerPosition(t.clientX,t.clientY);this.mSelectionBoxScreen={x1:this.mSelectionBoxScreen.x1,x2:o.x,y1:this.mSelectionBoxScreen.y1,y2:o.y},this.mShowSelectionBox=Math.abs(this.mSelectionBoxScreen.x2-this.mSelectionBoxScreen.x1)>5||Math.abs(this.mSelectionBoxScreen.y2-this.mSelectionBoxScreen.y1)>5;return}if(e.mode==="resizing-comment"){let o=this.mInteraction.gridSize,c=(t.clientX-e.startX)/this.mInteraction.zoom,p=(t.clientY-e.startY)/this.mInteraction.zoom;this.mManager.graph.transformNode(e.node,{width:e.originalW+Math.round(c/o),height:e.originalH+Math.round(p/o)}),this.rebuildVisibleNodePositions();return}}onDocumentPointerUp(t){let e=this.mInteractionState;e.mode==="dragging-wire"?this.completeWireDrag(t):e.mode==="selecting"&&(this.mShowSelectionBox=!1,this.selectNodesInBox()),this.mInteractionState={mode:"idle"},this.stopDocumentPointerTracking()}onKeyDown(t){if(!this.isTextEditingActive()){if(t.key==="Delete"){this.deleteSelectedNodes();return}if(t.ctrlKey&&t.key==="z"){t.preventDefault(),t.shiftKey?this.mManager.history.redo():this.mManager.history.undo();return}if(t.ctrlKey&&t.key==="y"){t.preventDefault(),this.mManager.history.redo();return}if(t.ctrlKey&&t.key==="c"){this.mClipboard.copy(this.mSelectedNodes);return}t.ctrlKey&&t.key==="v"&&(t.preventDefault(),this.pasteFromClipboard())}}addCommentContainedNodeOrigins(t,e){let o=this.mManager.activeFunction;if(!o)return;let c=this.mInteraction.gridSize,p=t.transformation.x*c,v=t.transformation.y*c,b=p+t.transformation.width*c,I=v+t.transformation.height*c;for(let P of o.nodes){if(P===t||this.mSelectedNodes.has(P)||P.category===ht.Comment)continue;let a=P.transformation.x*c,n=P.transformation.y*c;a>=p&&a<=b&&n>=v&&n<=I&&e.set(P,{originX:a,originY:n})}}closeAddNodePopup(){this.mAddNodePopup=null}completeWireDrag(t){if(this.mTempConnection=null,this.mInteractionState.mode!=="dragging-wire")return;let e=this.mInteractionState.sourcePort,o=this.mHoveredPort?.port??this.hitTestPort(t.clientX,t.clientY);!o||e===o||e.direction===o.direction||e.portType!==o.portType||this.mManager.graph.connectPorts(e,o)}hitTestPort(t,e){for(let[o,c]of this.mPortRegistry.entries()){let p=c.getBoundingClientRect();if(t>=p.left&&t<=p.right&&e>=p.top&&e<=p.bottom)return o}return null}deleteSelectedNodes(){for(let t of this.mSelectedNodes)this.mManager.graph.removeNode(t);this.mSelectedNodes.clear()}dragSelectedNodes(t,e){let o=this.mInteraction.zoom,c=this.mInteraction.gridSize,p=(t.clientX-e.startX)/o,v=(t.clientY-e.startY)/o;for(let[b,I]of e.origins){let P=this.mInteraction.snapToGrid(I.originX+p,I.originY+v);this.mManager.graph.transformNode(b,{x:Math.round(P.x/c),y:Math.round(P.y/c)})}this.rebuildVisibleNodePositions()}eventPathContainsGraphNode(t){for(let e of t.composedPath())if(e instanceof HTMLElement&&e.tagName.toLowerCase()==="potatno-node")return!0;return!1}generateBezierPath(t,e,o,c){let p=Math.max(Math.abs(o-t)*.4,50);return`M ${t} ${e} C ${t+p} ${e}, ${o-p} ${c}, ${o} ${c}`}getCanvasWrapperOrNull(){try{return this.canvasWrapper}catch{return null}}getLocalPointerPosition(t,e){let o=this.getCanvasWrapperOrNull();if(!o)return{x:0,y:0};let c=o.getBoundingClientRect();return{x:t-c.left,y:e-c.top}}getWorldPointerPosition(t,e){let o=this.getLocalPointerPosition(t,e);return this.mInteraction.screenToWorld(o.x,o.y)}invalidateGraphContent(){this.rebuildGraphData()}invalidateNodeVisuals(){this.rebuildGraphData()}insertNodeAt(t,e){if(!this.mManager.activeFunction)return;let o=this.mInteraction.gridSize,c=this.mInteraction.snapToGrid(e.x,e.y),p=this.mManager.graph.addNode(this.mManager.activeFunction,t,{height:4,width:10,x:Math.round(c.x/o),y:Math.round(c.y/o)});this.mSelectedNodes.clear(),this.mSelectedNodes.add(p),this.closeAddNodePopup()}insertNodeFromAddPopup(t){let e=this.mAddNodePopup;e&&this.insertNodeAt(t,{x:e.worldX,y:e.worldY})}isTextEditingActive(){let t=document.activeElement;return t instanceof HTMLInputElement||t instanceof HTMLTextAreaElement||t instanceof HTMLSelectElement}openAddNodePopupAtPointer(t,e){let o=this.getCanvasWrapperOrNull(),c=this.getLocalPointerPosition(t,e),p=this.mInteraction.screenToWorld(c.x,c.y),v=280,b=320,I=Math.max(0,(o?.clientWidth??v)-v-8),P=Math.max(0,(o?.clientHeight??b)-b-8);this.mAddNodePopup={screenX:Math.max(8,Math.min(c.x,I)),screenY:Math.max(8,Math.min(c.y,P)),worldX:p.x,worldY:p.y}}pasteFromClipboard(){let t=this.mManager.activeFunction;if(!t)return;let e=this.mClipboard.paste(t,t.document,2,2);if(e.length!==0){this.mSelectedNodes.clear();for(let o of e)this.mSelectedNodes.add(o)}}rebuildGraphData(){let t=[],e=this.mManager.activeFunction;if(e){let o=this.mInteraction.gridSize;for(let c of e.nodes)t.push({node:c,pixelW:c.transformation.width*o,pixelX:c.transformation.x*o,pixelY:c.transformation.y*o,selected:this.mSelectedNodes.has(c)})}this.mCachedGraphData={visibleNodes:t}}rebuildVisibleNodePositions(){let t=this.mInteraction.gridSize;this.mCachedGraphData={visibleNodes:this.mCachedGraphData.visibleNodes.map(e=>({node:e.node,pixelW:e.node.transformation.width*t,pixelX:e.node.transformation.x*t,pixelY:e.node.transformation.y*t,selected:e.selected}))}}renderDraggedWire(t,e){let o=this.getWorldPointerPosition(t.clientX,t.clientY);this.mTempConnection={start:{x:e.startX,y:e.startY},end:o}}resetForActiveFunction(){this.mHoveredPort=null,this.mInteractionState={mode:"idle"},this.mSelectedNodes.clear(),this.mTempConnection=null,this.stopDocumentPointerTracking(),this.closeAddNodePopup()}selectNodesInBox(){let t=this.mManager.activeFunction;if(!t)return;let e=this.mInteraction.screenToWorld(Math.min(this.mSelectionBoxScreen.x1,this.mSelectionBoxScreen.x2),Math.min(this.mSelectionBoxScreen.y1,this.mSelectionBoxScreen.y2)),o=this.mInteraction.screenToWorld(Math.max(this.mSelectionBoxScreen.x1,this.mSelectionBoxScreen.x2),Math.max(this.mSelectionBoxScreen.y1,this.mSelectionBoxScreen.y2)),c=this.mInteraction.gridSize;for(let p of t.nodes){let v=p.transformation.x*c,b=p.transformation.y*c,I=v+p.transformation.width*c,P=b+p.transformation.height*c;v<o.x&&I>e.x&&b<o.y&&P>e.y&&this.mSelectedNodes.add(p)}this.invalidateNodeVisuals()}startDocumentPointerTracking(){this.stopDocumentPointerTracking(),this.mDocumentPointerMoveHandler=t=>this.onDocumentPointerMove(t),this.mDocumentPointerUpHandler=t=>this.onDocumentPointerUp(t),document.addEventListener("pointermove",this.mDocumentPointerMoveHandler),document.addEventListener("pointerup",this.mDocumentPointerUpHandler)}stopDocumentPointerTracking(){this.mDocumentPointerMoveHandler&&(document.removeEventListener("pointermove",this.mDocumentPointerMoveHandler),this.mDocumentPointerMoveHandler=null),this.mDocumentPointerUpHandler&&(document.removeEventListener("pointerup",this.mDocumentPointerUpHandler),this.mDocumentPointerUpHandler=null)}static{Hn()}};var ci=`:host {\r
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
`;var ui=`<div class="properties-header">Properties</div>\r
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
`;function Hs(){function f(a,n){return function(l){e(n,"addInitializer"),o(l,"An initializer"),a.push(l)}}function t(a,n,u,l,r,y,g,T,w){var d;switch(r){case 1:d="accessor";break;case 2:d="method";break;case 3:d="getter";break;case 4:d="setter";break;default:d="field"}var s={kind:d,name:g?"#"+n:n,static:y,private:g,metadata:T},m={v:!1};s.addInitializer=f(l,m);var i,h;r===0?g?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return a(w,s)}finally{m.v=!0}}function e(a,n){if(a.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(a,n){if(typeof a!="function")throw new TypeError(n+" must be a function")}function c(a,n){var u=typeof n;if(a===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function p(a,n,u,l,r,y,g,T,w){var d=u[0],s,m,i;g?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,S;if(typeof d=="function")h=t(d,l,s,T,r,y,g,w,i),h!==void 0&&(c(r,h),r===0?m=h:r===1?(m=h.init,x=h.get||i.get,S=h.set||i.set,i={get:x,set:S}):i=h);else for(var C=d.length-1;C>=0;C--){var M=d[C];if(h=t(M,l,s,T,r,y,g,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,S=h.set||i.set,i={get:x,set:S}):i=h,N!==void 0&&(m===void 0?m=N:typeof m=="function"?m=[m,N]:m.push(N))}}if(r===0||r===1){if(m===void 0)m=function(D,E){return E};else if(typeof m!="function"){var _=m;m=function(D,E){for(var L=E,R=0;R<_.length;R++)L=_[R].call(D,L);return L}}else{var $=m;m=function(D,E){return $.call(D,E)}}a.push(m)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),g?r===1?(a.push(function(D,E){return i.get.call(D,E)}),a.push(function(D,E){return i.set.call(D,E)})):r===2?a.push(i):a.push(function(D,E){return i.call(D,E)}):Object.defineProperty(n,l,s))}function v(a,n,u){for(var l=[],r,y,g=new Map,T=new Map,w=0;w<n.length;w++){var d=n[w];if(Array.isArray(d)){var s=d[1],m=d[2],i=d.length>3,h=s>=5,x,S;if(h?(x=a,s=s-5,y=y||[],S=y):(x=a.prototype,r=r||[],S=r),s!==0&&!i){var C=h?T:g,M=C.get(m)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+m);!M&&s>2?C.set(m,s):C.set(m,!0)}p(l,x,d,m,s,h,i,S,u)}}return b(l,r),b(l,y),l}function b(a,n){n&&a.push(function(u){for(var l=0;l<n.length;l++)n[l].call(u);return u})}function I(a,n,u){if(n.length>0){for(var l=[],r=a,y=a.name,g=n.length-1;g>=0;g--){var T={v:!1};try{var w=n[g](r,{kind:"class",name:y,addInitializer:f(l,T),metadata:u})}finally{T.v=!0}w!==void 0&&(c(10,w),r=w)}return[P(r,u),function(){for(var d=0;d<l.length;d++)l[d].call(r)}]}}function P(a,n){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,l,r){if(r!==void 0)var y=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(y===void 0?null:y),T=v(n,u,g);return l.length||P(n,g),{e:T,get c(){return I(n,l,g)}}}}function di(f,t,e,o){return(di=Hs())(f,t,e,o)}var pi,hi,Xs;pi=J({selector:"potatno-panel-properties",template:ui,style:ci});var mi=class{static{({c:[Xs,hi]}=di(this,[],[pi]))}constructor(t=O.use(B),e=O.use(K)){this.mComponent=t,this.mManager=e,this.mSelectedImport="",this.mUnsubscribe=null}mComponent;mManager;mSelectedImport;mUnsubscribe;get availableImports(){return this.mManager.project?.imports.map(t=>t.label)??[]}get availableTypes(){let t=this.mManager.project;if(!t)return[];let e=new Set;for(let[o]of t.types.types)e.add(o);return[...e].sort()}get editableByUser(){let t=this.mManager.activeFunction;return t!==null&&!t.isSystem}get functionImports(){return[...this.mManager.activeFunction?.imports??[]]}get functionInputs(){return(this.mManager.activeFunction?.inputs??[]).map(t=>({name:t.label,type:t.dataType}))}get functionName(){return this.mManager.activeFunction?.label??""}get functionOutputs(){return(this.mManager.activeFunction?.outputs??[]).map(t=>({name:t.label,type:t.dataType}))}get isSystem(){return this.mManager.activeFunction?.isSystem??!1}get nameDisabled(){return this.isSystem}get portsDisabled(){return this.isSystem&&!this.editableByUser}get unusedImports(){let t=new Set(this.functionImports);return this.availableImports.filter(e=>!t.has(e))}onConnect(){this.mUnsubscribe=this.mManager.subscribe(F.Document|F.Function|F.ActiveFunction,null,()=>{this.mComponent.updater.update()})}onDeconstruct(){this.mUnsubscribe?.(),this.mUnsubscribe=null}onAddSelectedImport(){let t=this.unusedImports,e=this.mSelectedImport||(t.length>0?t[0]:"");e&&(this.mManager.updateFunctionProperties({imports:[...this.functionImports,e]}),this.mSelectedImport="")}onAddInput(){let t=this.availableTypes.length>0?this.availableTypes[0]:"number";this.mManager.updateFunctionProperties({inputs:[...this.functionInputs,{name:this.uniquePortName("new_input"),type:t}]})}onAddOutput(){let t=this.availableTypes.length>0?this.availableTypes[0]:"number";this.mManager.updateFunctionProperties({outputs:[...this.functionOutputs,{name:this.uniquePortName("new_output"),type:t}]})}onDeleteImport(t){let e=[...this.functionImports];e.splice(t,1),this.mManager.updateFunctionProperties({imports:e})}onDeleteInput(t){let e=[...this.functionInputs];e.splice(t,1),this.mManager.updateFunctionProperties({inputs:e})}onDeleteOutput(t){let e=[...this.functionOutputs];e.splice(t,1),this.mManager.updateFunctionProperties({outputs:e})}onImportSelectChange(t){this.mSelectedImport=t.target.value}onInputNameChange(t,e){let o=e.target,c=o.value,p=!this.validateName(c)||this.isNameDuplicate(c,"input",t);o.style.borderColor=p?"var(--pn-accent-danger)":"";let v=[...this.functionInputs];v[t]={...v[t],name:c},this.mManager.updateFunctionProperties({inputs:v})}onInputTypeChange(t,e){let o=e.target.value,c=[...this.functionInputs];c[t]={...c[t],type:o},this.mManager.updateFunctionProperties({inputs:c})}onNameChange(t){let e=t.target,o=e.value,c=!this.validateName(o)||this.isNameDuplicate(o,"function");e.style.borderColor=c?"var(--pn-accent-danger)":"",this.mManager.updateFunctionProperties({name:o})}onOutputNameChange(t,e){let o=e.target,c=o.value,p=!this.validateName(c)||this.isNameDuplicate(c,"output",t);o.style.borderColor=p?"var(--pn-accent-danger)":"";let v=[...this.functionOutputs];v[t]={...v[t],name:c},this.mManager.updateFunctionProperties({outputs:v})}onOutputTypeChange(t,e){let o=e.target.value,c=[...this.functionOutputs];c[t]={...c[t],type:o},this.mManager.updateFunctionProperties({outputs:c})}isNameDuplicate(t,e,o){if(e!=="function"&&t===this.functionName)return!0;let c=this.functionInputs;for(let v=0;v<c.length;v++)if(!(e==="input"&&v===o)&&c[v].name===t)return!0;let p=this.functionOutputs;for(let v=0;v<p.length;v++)if(!(e==="output"&&v===o)&&p[v].name===t)return!0;return!1}uniquePortName(t){if(!this.isNameDuplicate(t,"function"))return t;let e=2;for(;this.isNameDuplicate(`${t}_${e}`,"function");)e++;return`${t}_${e}`}validateName(t){return/^[a-zA-Z][a-zA-Z0-9_]*$/.test(t)}static{hi()}};var fi=`:host {\r
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
}\r
\r
.preview-tabs {\r
    display: flex;\r
    flex: 1;\r
    gap: 4px;\r
    margin-left: 12px;\r
    overflow-x: auto;\r
}\r
\r
.preview-selectors {\r
    display: flex;\r
    flex: 1;\r
    gap: 6px;\r
    margin-left: 12px;\r
    justify-content: flex-end;\r
}\r
\r
.preview-select {\r
    background: var(--pn-bg-surface);\r
    border: 1px solid var(--pn-border-default);\r
    border-radius: 3px;\r
    color: var(--pn-text-primary);\r
    font-family: var(--pn-font-family);\r
    font-size: var(--pn-font-size-sm);\r
    padding: 2px 4px;\r
    max-width: 45%;\r
}\r
\r
.preview-tab {\r
    appearance: none;\r
    border: 1px solid var(--pn-border-default);\r
    background: var(--pn-bg-primary);\r
    color: var(--pn-text-secondary);\r
    font-family: var(--pn-font-family);\r
    font-size: var(--pn-font-size-sm);\r
    padding: 2px 8px;\r
    border-radius: var(--pn-node-border-radius);\r
    cursor: pointer;\r
    white-space: nowrap;\r
}\r
\r
.preview-tab:hover {\r
    color: var(--pn-text-primary);\r
    border-color: var(--pn-accent-primary);\r
}\r
\r
.preview-tab.selected {\r
    color: var(--pn-text-primary);\r
    background: var(--pn-accent-primary);\r
    border-color: var(--pn-accent-primary);\r
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
`;var gi=`<div class="resize-handle" (pointerdown)="this.onResizePointerDown($event)"></div>
<div class="preview-container" #PreviewContainer>
    <div class="preview-header">
        $if(this.hasErrors) {
            <span class="preview-title error-title">Errors ({{this.errors.length}})</span>
        }
        $if(!this.hasErrors) {
            <span class="preview-title">Preview</span>
            <div class="preview-selectors">
                <select class="preview-select" (change)="this.onDisplaySelect($event)">
                    $for(display of this.displayOptions) {
                        <option [value]="this.display" [selected]="this.display === this.selectedDisplayId">{{this.display}}</option>
                    }
                </select>
                $if(this.showOutputSelector) {
                    <select class="preview-select" (change)="this.onOutputSelect($event)">
                        $for(output of this.outputOptions) {
                            <option [value]="this.output.id" [selected]="this.output.id === this.selectedOutputId">{{this.output.label}}</option>
                        }
                    </select>
                }
            </div>
        }
    </div>
    $if(this.hasErrors) {
        <div class="error-list">
            $for(error of this.errors) {
                <div class="error-item">
                    <span class="error-icon">!</span>
                    <div class="error-content">
                        <div class="error-message">{{this.error.message}}</div>
                        <div class="error-location">{{this.error.location}}</div>
                    </div>
                </div>
            }
        </div>
    }
    $if(!this.hasErrors) {
        <div class="preview-content" potatno-preview="this.previewDriver"></div>
    }
</div>
`;function Zs(){function f(a,n){return function(l){e(n,"addInitializer"),o(l,"An initializer"),a.push(l)}}function t(a,n,u,l,r,y,g,T,w){var d;switch(r){case 1:d="accessor";break;case 2:d="method";break;case 3:d="getter";break;case 4:d="setter";break;default:d="field"}var s={kind:d,name:g?"#"+n:n,static:y,private:g,metadata:T},m={v:!1};s.addInitializer=f(l,m);var i,h;r===0?g?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return a(w,s)}finally{m.v=!0}}function e(a,n){if(a.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(a,n){if(typeof a!="function")throw new TypeError(n+" must be a function")}function c(a,n){var u=typeof n;if(a===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function p(a,n,u,l,r,y,g,T,w){var d=u[0],s,m,i;g?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,S;if(typeof d=="function")h=t(d,l,s,T,r,y,g,w,i),h!==void 0&&(c(r,h),r===0?m=h:r===1?(m=h.init,x=h.get||i.get,S=h.set||i.set,i={get:x,set:S}):i=h);else for(var C=d.length-1;C>=0;C--){var M=d[C];if(h=t(M,l,s,T,r,y,g,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,S=h.set||i.set,i={get:x,set:S}):i=h,N!==void 0&&(m===void 0?m=N:typeof m=="function"?m=[m,N]:m.push(N))}}if(r===0||r===1){if(m===void 0)m=function(D,E){return E};else if(typeof m!="function"){var _=m;m=function(D,E){for(var L=E,R=0;R<_.length;R++)L=_[R].call(D,L);return L}}else{var $=m;m=function(D,E){return $.call(D,E)}}a.push(m)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),g?r===1?(a.push(function(D,E){return i.get.call(D,E)}),a.push(function(D,E){return i.set.call(D,E)})):r===2?a.push(i):a.push(function(D,E){return i.call(D,E)}):Object.defineProperty(n,l,s))}function v(a,n,u){for(var l=[],r,y,g=new Map,T=new Map,w=0;w<n.length;w++){var d=n[w];if(Array.isArray(d)){var s=d[1],m=d[2],i=d.length>3,h=s>=5,x,S;if(h?(x=a,s=s-5,y=y||[],S=y):(x=a.prototype,r=r||[],S=r),s!==0&&!i){var C=h?T:g,M=C.get(m)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+m);!M&&s>2?C.set(m,s):C.set(m,!0)}p(l,x,d,m,s,h,i,S,u)}}return b(l,r),b(l,y),l}function b(a,n){n&&a.push(function(u){for(var l=0;l<n.length;l++)n[l].call(u);return u})}function I(a,n,u){if(n.length>0){for(var l=[],r=a,y=a.name,g=n.length-1;g>=0;g--){var T={v:!1};try{var w=n[g](r,{kind:"class",name:y,addInitializer:f(l,T),metadata:u})}finally{T.v=!0}w!==void 0&&(c(10,w),r=w)}return[P(r,u),function(){for(var d=0;d<l.length;d++)l[d].call(r)}]}}function P(a,n){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,l,r){if(r!==void 0)var y=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(y===void 0?null:y),T=v(n,u,g);return l.length||P(n,g),{e:T,get c(){return I(n,l,g)}}}}function Ei(f,t,e,o){return(Ei=Zs())(f,t,e,o)}var Di,vi,Ii,Si,Pi,yi,bi,wi,xi,qs;Di=J({selector:"potatno-preview",template:gi,style:fi,modules:[ve]}),Ii=z.state(),Si=z.state(),Pi=nt("PreviewContainer");var Ti=class{static{({e:[yi,bi,wi,xi],c:[qs,vi]}=Ei(this,[[Ii,1,"mSelectedDisplayId"],[Si,1,"mSelectedOutputId"],[Pi,1,"containerElement"]],[Di]))}constructor(t=O.use(B),e=O.use(K)){this.mComponent=t,this.mDragging=!1,this.mManager=e,this.mStartHeight=0,this.mStartWidth=0,this.mStartX=0,this.mStartY=0,this.mTrackedFunction=null,this.mUnsubscribe=null}mComponent;mDragging;mManager;mStartHeight;mStartWidth;mStartX;mStartY;mTrackedFunction;mUnsubscribe;#t=(xi(this),yi(this,""));get mSelectedDisplayId(){return this.#t}set mSelectedDisplayId(t){this.#t=t}#e=bi(this,"");get mSelectedOutputId(){return this.#e}set mSelectedOutputId(t){this.#e=t}#r=wi(this);get containerElement(){return this.#r}set containerElement(t){this.#r=t}get displayOptions(){let t=this.mManager.activeFunction,e=this.mManager.project,o=t&&e?e.getFunction(t.definitionId):void 0;if(!t||!e||!o)return[];if(this.selectedOutputId===it.MAIN)return e.preview.availablePreviewTypes(o,it.MAIN);let c=this.findFunctionOutputPort(t,this.selectedOutputId);return c?e.preview.availablePreviewTypes(o,c.resolvedDataType):e.preview.availablePreviewTypes(o)}get errors(){return this.mManager.integrity.errors}get hasErrors(){return!this.mManager.integrity.isValid}get outputOptions(){let t=this.mManager.activeFunction,e=this.mManager.project,o=t&&e?e.getFunction(t.definitionId):void 0;if(!t||!e||!o)return[];let c=new Array;e.preview.availablePreviewTypes(o,it.MAIN).length>0&&c.push({id:it.MAIN,label:"Main"});let p=new Set;for(let v of t.getExitNodes())for(let b of v.inputs.value)p.has(b.definitionId)||e.preview.availablePreviewTypes(o,b.resolvedDataType).length!==0&&(p.add(b.definitionId),c.push({id:b.definitionId,label:b.label}));return c}get previewDriver(){let t=this.mManager.activeFunction;return t?this.mManager.preview.functionDriver(t,this.selectedDisplayId,this.selectedOutputId):null}get selectedDisplayId(){let t=this.displayOptions;return this.mSelectedDisplayId!==""&&t.includes(this.mSelectedDisplayId)?this.mSelectedDisplayId:t[0]??""}get selectedOutputId(){let t=this.outputOptions;return this.mSelectedOutputId!==""&&t.some(e=>e.id===this.mSelectedOutputId)?this.mSelectedOutputId:t[0]?.id??""}get showOutputSelector(){let t=this.mManager.activeFunction,e=this.mManager.project;return!t||!e?!1:this.outputOptions.length>1}onConnect(){this.mUnsubscribe=this.mManager.subscribe(F.Document|F.Function|F.ActiveFunction|F.Node|F.Connection,null,()=>{this.releaseSupersededDriver(),this.mComponent.updater.update()}),this.releaseSupersededDriver()}onDeconstruct(){this.mUnsubscribe?.(),this.mUnsubscribe=null}onDisplaySelect(t){this.mSelectedDisplayId=t.target.value}onOutputSelect(t){this.mSelectedOutputId=t.target.value}onResizePointerDown(t){t.preventDefault(),t.stopPropagation(),this.mDragging=!0,this.mStartX=t.clientX,this.mStartY=t.clientY;let e=this.containerElement;if(!e)return;this.mStartWidth=e.offsetWidth,this.mStartHeight=e.offsetHeight,t.target.setPointerCapture(t.pointerId);let o=p=>{if(!this.mDragging)return;let v=this.mStartX-p.clientX,b=this.mStartY-p.clientY;e.style.width=Math.max(200,this.mStartWidth+v)+"px",e.style.height=Math.max(150,this.mStartHeight+b)+"px"},c=p=>{this.mDragging=!1,p.target.releasePointerCapture(p.pointerId),document.removeEventListener("pointermove",o),document.removeEventListener("pointerup",c)};document.addEventListener("pointermove",o),document.addEventListener("pointerup",c)}releaseSupersededDriver(){let t=this.mManager.activeFunction;t!==this.mTrackedFunction&&(this.mTrackedFunction&&this.mManager.preview.release(this.mTrackedFunction),this.mTrackedFunction=t,this.mSelectedDisplayId="",this.mSelectedOutputId="")}findFunctionOutputPort(t,e){for(let o of t.getExitNodes()){let c=o.inputs.map.get(e);if(c&&c.portType==="value")return c}return null}static{vi()}};function Js(){function f(a,n){return function(l){e(n,"addInitializer"),o(l,"An initializer"),a.push(l)}}function t(a,n,u,l,r,y,g,T,w){var d;switch(r){case 1:d="accessor";break;case 2:d="method";break;case 3:d="getter";break;case 4:d="setter";break;default:d="field"}var s={kind:d,name:g?"#"+n:n,static:y,private:g,metadata:T},m={v:!1};s.addInitializer=f(l,m);var i,h;r===0?g?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return a(w,s)}finally{m.v=!0}}function e(a,n){if(a.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(a,n){if(typeof a!="function")throw new TypeError(n+" must be a function")}function c(a,n){var u=typeof n;if(a===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function p(a,n,u,l,r,y,g,T,w){var d=u[0],s,m,i;g?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,S;if(typeof d=="function")h=t(d,l,s,T,r,y,g,w,i),h!==void 0&&(c(r,h),r===0?m=h:r===1?(m=h.init,x=h.get||i.get,S=h.set||i.set,i={get:x,set:S}):i=h);else for(var C=d.length-1;C>=0;C--){var M=d[C];if(h=t(M,l,s,T,r,y,g,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,S=h.set||i.set,i={get:x,set:S}):i=h,N!==void 0&&(m===void 0?m=N:typeof m=="function"?m=[m,N]:m.push(N))}}if(r===0||r===1){if(m===void 0)m=function(D,E){return E};else if(typeof m!="function"){var _=m;m=function(D,E){for(var L=E,R=0;R<_.length;R++)L=_[R].call(D,L);return L}}else{var $=m;m=function(D,E){return $.call(D,E)}}a.push(m)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),g?r===1?(a.push(function(D,E){return i.get.call(D,E)}),a.push(function(D,E){return i.set.call(D,E)})):r===2?a.push(i):a.push(function(D,E){return i.call(D,E)}):Object.defineProperty(n,l,s))}function v(a,n,u){for(var l=[],r,y,g=new Map,T=new Map,w=0;w<n.length;w++){var d=n[w];if(Array.isArray(d)){var s=d[1],m=d[2],i=d.length>3,h=s>=5,x,S;if(h?(x=a,s=s-5,y=y||[],S=y):(x=a.prototype,r=r||[],S=r),s!==0&&!i){var C=h?T:g,M=C.get(m)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+m);!M&&s>2?C.set(m,s):C.set(m,!0)}p(l,x,d,m,s,h,i,S,u)}}return b(l,r),b(l,y),l}function b(a,n){n&&a.push(function(u){for(var l=0;l<n.length;l++)n[l].call(u);return u})}function I(a,n,u){if(n.length>0){for(var l=[],r=a,y=a.name,g=n.length-1;g>=0;g--){var T={v:!1};try{var w=n[g](r,{kind:"class",name:y,addInitializer:f(l,T),metadata:u})}finally{T.v=!0}w!==void 0&&(c(10,w),r=w)}return[P(r,u),function(){for(var d=0;d<l.length;d++)l[d].call(r)}]}}function P(a,n){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,l,r){if(r!==void 0)var y=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(y===void 0?null:y),T=v(n,u,g);return l.length||P(n,g),{e:T,get c(){return I(n,l,g)}}}}function Ri(f,t,e,o){return(Ri=Js())(f,t,e,o)}var Oi,Ci,_i,Fi,Mi,Ni,Ai,ar;Oi=J({selector:"potatno-code-editor",template:lo,style:ao}),_i=nt("panelLeft"),Fi=nt("panelRight");var Li=class{static{({e:[Mi,Ni,Ai],c:[ar,Ci]}=Ri(this,[[_i,1,"panelLeft"],[Fi,1,"panelRight"],[tt,4,"project"],[tt,4,"file"],[tt,2,"triggerPreviewUpdate"]],[Oi]))}constructor(t=O.use(B),e=O.use(K)){this.mComponent=t,this.mManager=e,this.mProject=null,this.mResizeMoveHandler=null,this.mResizeState=null,this.mResizeUpHandler=null,this.mUnsubscribe=null}mComponent;mManager;mProject;mResizeMoveHandler;mResizeState;mResizeUpHandler;mUnsubscribe;#t=(Ai(this),Mi(this));get panelLeft(){return this.#t}set panelLeft(t){this.#t=t}#e=Ni(this);get panelRight(){return this.#e}set panelRight(t){this.#e=t}get hasPreview(){let t=this.mManager.project,e=this.mManager.activeFunction;if(!t||!e)return!1;for(let o of t.preview.entries)if(o.executor.function.id===e.definitionId)return!0;return!1}get file(){return this.mManager.graph.document}set project(t){this.mProject=t}set file(t){this.mProject&&this.mManager.initialize(this.mProject,t)}triggerPreviewUpdate(){return this.mManager.preview.execute()}onConnect(){this.mUnsubscribe=this.mManager.subscribe(F.Document|F.Function|F.Preview,null,()=>{this.mComponent.updater.update()})}onDeconstruct(){this.mUnsubscribe?.(),this.mUnsubscribe=null,this.mManager.deconstruct(),this.stopPanelResize()}onResizeLeftStart(t){t.preventDefault(),this.startPanelResize("left",t)}onResizeRightStart(t){t.preventDefault(),this.startPanelResize("right",t)}startPanelResize(t,e){this.stopPanelResize();let o=t==="left"?this.panelLeft:this.panelRight;this.mResizeState={panel:t,startWidth:o.offsetWidth,startX:e.clientX};let c=v=>{if(!this.mResizeState)return;let b=t==="left"?v.clientX-this.mResizeState.startX:this.mResizeState.startX-v.clientX;o.style.width=`${Math.max(200,Math.min(500,this.mResizeState.startWidth+b))}px`},p=()=>{document.removeEventListener("pointermove",c),document.removeEventListener("pointerup",p),this.mResizeMoveHandler=null,this.mResizeState=null,this.mResizeUpHandler=null};this.mResizeMoveHandler=c,this.mResizeUpHandler=p,document.addEventListener("pointermove",c),document.addEventListener("pointerup",p)}stopPanelResize(){this.mResizeMoveHandler&&(document.removeEventListener("pointermove",this.mResizeMoveHandler),this.mResizeMoveHandler=null),this.mResizeUpHandler&&(document.removeEventListener("pointerup",this.mResizeUpHandler),this.mResizeUpHandler=null),this.mResizeState=null}static{Ci()}};var ji=`:host {\r
    display: block;\r
    width: 100%;\r
    height: 100%;\r
}\r
\r
potatno-code-editor {\r
    display: block;\r
    width: 100%;\r
    height: 100%;\r
}`;var $i=`:host {\r
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
`;var Ve=class extends oe{mCodeEditor;mProject;get document(){return this.mCodeEditor.file}set document(t){this.mCodeEditor.file=t}get project(){return this.mProject}constructor(t){super(),this.mProject=t,this.addStyle($i),this.addStyle(ji),this.mCodeEditor=this.addContent(ar),this.mCodeEditor.project=t,this.mCodeEditor.file=new Mt(t)}update(){return this.mCodeEditor.triggerPreviewUpdate()}};var Kt=class f extends mt{static DEFINITION_ID="23e9319b-3b62-4dd8-858a-17d97ddee94e";constructor(){super({id:f.DEFINITION_ID,label:"Flow Conjunction",category:"Conjunction",generators:{ports:{inputs:t=>{t({label:"in",id:"in",portType:"flow"})},outputs:t=>{t({label:"out",id:"out",portType:"flow"})}},code:()=>{throw new A("Conjunction node code generators should never be called.",f)}}})}};var Qt=class f extends mt{static DEFINITION_ID="a579584d-5d35-42b5-b2ba-3daddee488e0";constructor(){super({id:f.DEFINITION_ID,label:"Value Conjunction",category:"Conjunction",generators:{ports:{inputs:t=>{t({label:"in",id:"in",portType:"value",dataType:"<T>"})},outputs:t=>{t({label:"out",id:"out",portType:"value",dataType:"<T>"})}},code:()=>{throw new A("Conjunction node code generators should never be called.",f)}}})}};var ze=class{mDocument;mDependencies;mEntryPoint;get code(){return this.mDocument.project.generator.code(this)}get dependencies(){return this.mDependencies}get entryPoint(){return this.mEntryPoint}constructor(t,e,o){this.mDocument=t,this.mEntryPoint=e,this.mDependencies=o}};var Be=class{mFunction;mGraphs;get code(){let t=this.mFunction.project.getFunction(this.mFunction.definitionId);if(!t)throw new A("Function result has an invalid function definition id.",this);return t.codeGenerator.body(this)}get function(){return this.mFunction}get graphs(){return Array.from(this.mGraphs.values())}constructor(t){this.mFunction=t,this.mGraphs=new Map}addGraph(t){this.mGraphs.set(t.entryNode.definitionId,t)}graphResultOf(t){return this.mGraphs.get(t)}};var Ue=class{mBodyCode;mDependencies;mEntryNode;mExitNode;mPorts;get code(){return this.mBodyCode}get dependencies(){return this.mDependencies}get entryNode(){return this.mEntryNode}get exitNode(){return this.mExitNode}get ports(){return this.mPorts}constructor(t){this.mBodyCode=t.bodyCode,this.mDependencies=[...t.dependencies],this.mEntryNode=t.entryNode,this.mExitNode=t.exitNode,this.mPorts=t.portValues}};var Ge=class{mProject;constructor(t){this.mProject=t}generateDocument(t,e=!1){let o=[...t.functions].find(c=>c.isSystem);if(!o)throw new A("No entry point function found for code generation.",this);return this.generateFunction(o,e)}generateFunction(t,e=!1){return this.buildDocumentResult(t.document,t.getExitNodes(),e)}generateNode(t,e=!1){return this.buildDocumentResult(t.document,[t],e)}buildDocumentResult(t,e,o){if(t.validate().length>0)throw new A("Code generation exited. Code graph validation failed.",this);let p={counter:{valueIndex:0},debug:o,nodeDefinitions:new Map},v=this.generateFunctionWithDependencies(p,e,new Set),b=v.shift();return new ze(t,b,v)}generateFunctionWithDependencies(t,e,o){let c=new Array;if(e.length===0)return c;let p=e.at(0).function;o.add(p);let v=new Be(p);c.push(v);for(let b of e){let I=this.generateNodeCode(t,b);v.addGraph(I);for(let P of I.dependencies)o.has(P)||c.push(...this.generateFunctionWithDependencies(t,P.getExitNodes(),o))}return c.reverse()}generateNodeCode(t,e){let o={dependencies:new Array,scope:this.createScope(e,null)},c=this.walkBackward(t,o,e,null),p=c.codeOutput.join(" ");return new Ue({bodyCode:p,dependencies:o.dependencies,entryNode:c.lastGeneratedNode,exitNode:e,portValues:new Map(o.scope.values)})}createScope(t,e){return{values:new Map,remaining:this.countNodeEncounter(t,e)}}resolveInputValue(t,e,o){let c=this.resolveValueConjunctions(o);if(!c){if(this.mProject.types.isGenericType(o.dataType))throw new A("Generic value inputs must be allways connected",this);return{inputPort:{value:this.mProject.types.getType(o.dataType).convert([...o.directValue]),isDirectValue:!0},emitResult:null}}let p=c.node,v=(()=>{if(!p.hasFlowPorts){let b=e.scope.remaining.get(p);if(e.scope.remaining.set(p,b-1),b<=1)return this.emitNode(t,e,p,{})}return null})();return{inputPort:{value:this.getPortValue(t,e,c),isDirectValue:!1},emitResult:v}}getPortValue(t,e,o){return e.scope.values.has(o)||e.scope.values.set(o,this.mProject.generator.values.valueId(t.counter.valueIndex++)),e.scope.values.get(o)}getNodesInputFlowPorts(t){let e=new Array;for(let o of t.inputs.flow)e.push(...this.resolveFlowConjunctions(o));return[...new Set(e)]}resolveFlowConjunctions(t){let e=new Array;for(let o of t.connectedPorts){if(o.node.definitionId!==Kt.DEFINITION_ID){e.push(o);continue}let c=o.node.inputs.flow[0];!c||c.connectedPorts.size===0||e.push(...this.resolveFlowConjunctions(c))}return e}resolveValueConjunctions(t){if(t.connectedPorts.size===0)return null;let e=t.connectedPorts.values().next().value;if(e.node.definitionId!==Qt.DEFINITION_ID)return e;let o=e.node.inputs.value[0];return!o||o.connectedPorts.size===0?null:this.resolveValueConjunctions(o)}countNodeEncounter(t,e){let o=new Map,c=new Set,p=new Array(t);for(;p.length>0;){let v=p.pop();if(o.set(v,(o.get(v)??0)+1),!(v===e||c.has(v))){c.add(v);for(let b of v.inputs.flow)for(let I of this.resolveFlowConjunctions(b))p.push(I.node);for(let b of v.inputs.value){let I=this.resolveValueConjunctions(b);I&&p.push(I.node)}}}return o}walkBackward(t,e,o,c){let p={codeOutput:new Array,lastGeneratedNode:null,endFlowPort:null},v=null,b=o;for(;b!==null&&b!==c;){let I={};v!==null&&(I[v.definitionId]=p.codeOutput.join(" "),p.codeOutput=new Array);let P=p.codeOutput;p=this.emitNode(t,e,b,I),p.codeOutput=[...p.codeOutput,...P];let a=this.getNodesInputFlowPorts(b);if(a.length===0)break;a.length>1&&(p=this.handleFlowMerge(t,e,b,a,p.codeOutput),a=this.getNodesInputFlowPorts(p.lastGeneratedNode)),v=a[0]??null,b=v?.node??null}if(!p.lastGeneratedNode)throw new A(`Walk did not reach an entry node from exit "${o.label}".`,this);if(c&&b!==c)throw new A("Malformed graph. End node not reached",this);return p.endFlowPort=v,p}findBranchStartPoint(t){let e=this.getNodesInputFlowPorts(t),o=e.length,c=new Map,p=new Array,v=(b,I)=>{let P=(c.has(b)||c.set(b,new Set),c.get(b)),a=P.size;for(let n of I)P.add(n);return P.size>a&&p.push(b),P};for(let[b,I]of e.entries())v(I.node,[b]);for(;p.length>0;){let b=p.shift(),I=c.get(b);for(let P of this.getNodesInputFlowPorts(b))if(v(P.node,I).size===o)return P.node}throw new A("No common branch point found for merge node.",this)}handleFlowMerge(t,e,o,c,p){let v=p.join(" "),b=this.findBranchStartPoint(o),I={},P=e.scope;try{for(let a of c){e.scope=this.createScope(a.node,b);let n=this.walkBackward(t,e,a.node,b);I[n.endFlowPort.definitionId]=n.codeOutput.join(" ")}}finally{e.scope=P}return this.emitNode(t,e,b,I,v)}emitNode(t,e,o,c,p){if(!t.nodeDefinitions.get(o.function)){let u=new Map;for(let l of o.function.nodeDefinitions)u.set(l.id,l);t.nodeDefinitions.set(o.function,u)}let v=t.nodeDefinitions.get(o.function).get(o.definitionId);if(!v)throw new A(`Node definition "${o.definitionId}" not found for node "${o.label}".`,this);v instanceof Vt&&e.dependencies.push(v.function);let b={},I=new Array;for(let u of o.inputs.value){let l=this.resolveInputValue(t,e,u);b[u.definitionId]=l.inputPort,l.emitResult&&I.push(l.emitResult)}let P={};for(let u of o.outputs.list)P[u.definitionId]={value:this.getPortValue(t,e,u),code:{inner:c[u.definitionId]??""}};let a=v.codeGenerator({inputs:b,outputs:P,code:{next:p??""}});t.debug&&(a+=Object.values(P).reduce((u,l)=>u+this.mProject.generator.values.hook(l.value),""));let n=new Array;for(let u of I)n.push(...u.codeOutput);return n.push(a),{codeOutput:n,lastGeneratedNode:o,endFlowPort:null}}};var He=class{mCachedCallable;mDisplay;mElement;mExecutor;mSpecifiedParameters;mTarget;get element(){return this.mElement||(this.mElement=this.mDisplay.generate()),this.mElement}constructor(t,e,o){this.mDisplay=t,this.mExecutor=e,this.mTarget=o,this.mCachedCallable=null,this.mElement=null,this.mSpecifiedParameters={...this.mExecutor.defaultParameters}}async execute(){this.mCachedCallable&&await this.mDisplay.update(this.element,this.mCachedCallable)}refresh(){let t=this.mTarget,e=t instanceof ft?t.node.function:t,o=new Ge(e.project).generateFunction(e,!0),c=null;if(t instanceof ft){let b=t.direction==="input"?t.definitionId:this.resolvePortValueId(o,t);if(b===null){this.mCachedCallable=null;return}c={documentPort:t,value:b}}let p=this.mExecutor.compile(o,c);if(!this.mDisplay.allowsType(p.type)){this.mCachedCallable=null;return}let v=this.mDisplay.adapterFor(p.type);this.mCachedCallable=async b=>v(await p.execute({...this.mExecutor.defaultParameters,...this.mSpecifiedParameters,...b}))}specifyParameters(t){this.mSpecifiedParameters={...this.mSpecifiedParameters,...t}}resolvePortValueId(t,e){for(let o of[t.entryPoint,...t.dependencies])for(let c of o.graphs){let p=c.ports.get(e);if(p!==void 0)return p}return null}};var ye=class{mExecutor;mGenerate;mId;mTypeAdapter;mUpdate;get id(){return this.mId}get executor(){return this.mExecutor}constructor(t,e){this.mExecutor=t,this.mGenerate=e.generate,this.mId=e.id,this.mTypeAdapter=e.typeAdapter,this.mUpdate=e.update;for(let o of Object.keys(this.mTypeAdapter))if(!this.mExecutor.types.includes(o))throw new A(`Display "${this.mId}" declares type "${o}" that executor "${this.mExecutor.function.id}" does not support.`,this)}adapterFor(t){let e=this.mTypeAdapter[t];if(e===void 0)throw new A(`Display "${this.mId}" has no type adapter for type "${t}".`,this);return e}allowsType(t){return this.mTypeAdapter[t]!==void 0}createDriver(t){return new He(this,this.mExecutor,t)}generate(){return this.mGenerate()}update(t,e){return this.mUpdate(t,e)}};var V=class extends mt{constructor(t){super({id:t.id,label:t.label,category:t.category,regions:t.regions??null,generators:{ports:{inputs:e=>{for(let o of t.ports.inputs)e(o)},outputs:e=>{for(let o of t.ports.outputs)e(o)}},code:t.generators.code}})}};var kt=class{mId;mLabel;mNodes;get id(){return this.mId}get label(){return this.mLabel}get nodes(){return this.mNodes}constructor(t,e){this.mId=t,this.mLabel=e,this.mNodes=new Array}addNode(t){this.mNodes.push(t)}};var Xe=class extends kt{constructor(){super("Math","Math"),this.addNode(new V({id:"Math.PI",label:"Math.PI",category:"value",ports:{inputs:[],outputs:[{label:"value",id:"value",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.value.value} = Math.PI;`}})),this.addNode(new V({id:"Math.E",label:"Math.E",category:"value",ports:{inputs:[],outputs:[{label:"value",id:"value",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.value.value} = Math.E;`}})),this.addNode(new V({id:"Math.abs",label:"Math.abs",category:"Function",ports:{inputs:[{label:"value",id:"value",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = Math.abs(${t.inputs.value.value});`}})),this.addNode(new V({id:"Math.floor",label:"Math.floor",category:"Function",ports:{inputs:[{label:"value",id:"value",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = Math.floor(${t.inputs.value.value});`}})),this.addNode(new V({id:"Math.random",label:"Math.random",category:"Function",ports:{inputs:[],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = Math.random();`}})),this.addNode(new V({id:"Math.sin",label:"Math.sin",category:"Function",ports:{inputs:[{label:"value",id:"value",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = Math.sin(${t.inputs.value.value});`}})),this.addNode(new V({id:"Math.cos",label:"Math.cos",category:"Function",ports:{inputs:[{label:"value",id:"value",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = Math.cos(${t.inputs.value.value});`}}))}};var Ye=class extends kt{constructor(){super("Time","Time"),this.addNode(new V({id:"CurrentTime",label:"CurrentTime",category:"value",ports:{inputs:[],outputs:[{label:"seconds",id:"seconds",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.seconds.value} = (performance.now() / 1000);`}}))}};var We=class{mEntries;get entries(){return this.mEntries}constructor(){this.mEntries=new Array}addDisplay(t){let e=t,o=t.executor;this.mEntries.push({display:e,executor:o,createDriver:c=>e.createDriver(c)})}availablePreviews(t,e){return this.mEntries.filter(o=>o.executor.function.id===t.id&&o.executor.types.includes(e)&&o.display.allowsType(e))}availablePreviewTypes(t,e=null){let o=new Set;for(let c of this.mEntries)c.executor.function.id===t.id&&(e===null||c.executor.types.includes(e)&&c.display.allowsType(e))&&o.add(c.display.id);return[...o]}};var Ze=class{mCodeGenerator;mEntryPoint;mImports;mNodeDefinitions;mPreview;mTypes;mUserFunctions;get generator(){return this.mCodeGenerator}get entryPoint(){return this.mEntryPoint}get imports(){return this.mImports}get nodeDefinitions(){return Array.from(this.mNodeDefinitions.values())}get preview(){return this.mPreview}get types(){return this.mTypes}get userFunctions(){return this.mUserFunctions}constructor(t,e,o){this.mTypes=t,this.mCodeGenerator=o.generator,this.mPreview=new We,this.mNodeDefinitions=new Map,this.mImports=new Array,this.mUserFunctions=new Map,this.mEntryPoint=e,this.addNodeDefinition(new Kt),this.addNodeDefinition(new Qt)}addImport(t){this.mImports.push(t)}addNodeDefinition(t){this.mNodeDefinitions.set(t.id,t)}getFunction(t){return this.mEntryPoint.id===t?this.mEntryPoint:this.mUserFunctions.get(t)}setDynamicFunction(t){this.mUserFunctions.set(t.id,t)}};var te=class{mId;mLabel;mStatics;mNodesProvider;mCodeGenerator;get id(){return this.mId}get label(){return this.mLabel}get codeGenerator(){return this.mCodeGenerator}get statics(){return this.mStatics}constructor(t){this.mId=t.id,this.mLabel=t.label,this.mNodesProvider=t.nodes,this.mStatics=t.statics,this.mCodeGenerator=t.generator.code}getNodeDefinitions(t){let e=c=>{if(!c)return new Array;let p=new Array;return c(v=>{p.push(v)},t),p},o={};return Object.defineProperty(o,"entry",{get:()=>e(this.mNodesProvider.entry)}),Object.defineProperty(o,"exit",{get:()=>e(this.mNodesProvider.exit)}),Object.defineProperty(o,"dynamic",{get:()=>e(this.mNodesProvider.dynamic)}),o}},qe={none:0,imports:1,inputs:2,outputs:4};var Je=class extends te{constructor(){super({id:"pixelShader",label:"Pixel Shader",statics:qe.No,nodes:{entry:t=>{t(new V({id:"OnPixel",label:"OnPixel",category:"event",ports:{inputs:[],outputs:[{label:"exec",id:"exec",portType:"flow"},{label:"x",id:"x",portType:"value",dataType:"number"},{label:"y",id:"y",portType:"value",dataType:"number"}]},generators:{code:e=>{let o=e.outputs.x.value,c=e.outputs.y.value;return`(${o}, ${c}) => { ${e.outputs.exec.code.inner} }`}}}))},exit:t=>{t(new V({id:"PixelResult",label:"PixelResult",category:"Output",ports:{inputs:[{label:"exec",id:"exec",portType:"flow"},{label:"red",id:"red",portType:"value",dataType:"number"},{label:"green",id:"green",portType:"value",dataType:"number"},{label:"blue",id:"blue",portType:"value",dataType:"number"}],outputs:[]},generators:{code:e=>`return [${e.inputs.red.value}, ${e.inputs.green.value}, ${e.inputs.blue.value}];`}}))}},generator:{code:{body:t=>{let e=t.graphResultOf("OnPixel");return`const ${t.function.definitionId} = ${e?.code??"() => [0, 0, 0]"};`},value:t=>`${t.function.definitionId}()`}}})}};var Ke=class{mTypes;get types(){return this.mTypes}get typeNames(){return Array.from(this.mTypes.keys())}constructor(t){this.mTypes=new Map;for(let[e,o]of Object.entries(t))this.mTypes.set(e,{name:e,...o})}getDefaultValue(t){return this.getType(t).default.value}getType(t){if(!this.mTypes.has(t))throw new Error(`Type "${t}" is not defined in the project types definition.`);return this.mTypes.get(t)}isGenericType(t){return typeof t!="string"?!1:/^<[^>]+>$/.test(t)}};var Qe=class extends Ke{constructor(){super({number:{default:{string:["0"],value:0},convert:t=>{let e=t[0],o=parseFloat(e);if(isNaN(o))throw new Error(`Invalid number: "${e}"`);return o.toString()},inputs:[{name:"value",type:"number"}]},string:{default:{string:[""],value:""},convert:t=>t[0],inputs:[{name:"value",type:"string"}]},boolean:{default:{string:["false"],value:!1},convert:t=>{let e=t[0].toLowerCase();if(e==="true")return"true";if(e==="false")return"false";throw new Error(`Invalid boolean: "${t[0]}"`)},inputs:[{name:"value",type:"boolean"}]}})}};var ke=class extends te{constructor(){super({id:"Helper Function",label:"Helper Function",statics:qe.none,nodes:{entry:(t,e)=>{t(new mt({id:"HelperFunctionEntry",label:"Entry",category:"event",generators:{ports:{outputs:o=>{o({label:"exec",id:"exec",portType:"flow"});for(let c of e.inputs)o({label:c.label,id:c.label,portType:"value",dataType:c.dataType})},inputs:()=>{}},code:o=>`(${Object.entries(o.outputs).filter(([p])=>p!=="exec").map(([,p])=>p.value).join(", ")}) => { ${o.outputs.exec.code.inner} }`}}))},exit:(t,e)=>{t(new mt({id:"HelperFunctionReturn",label:"Return",category:"event",generators:{ports:{outputs:()=>{},inputs:o=>{o({label:"exec",id:"exec",portType:"flow"});for(let c of e.outputs)o({label:c.label,id:c.label,portType:"value",dataType:c.dataType})}},code:o=>`return { ${Object.entries(o.inputs).map(([p,v])=>`${p}: (${v.value})`).join(", ")} };`}}))}},generator:{code:{body:t=>{let e=`__fn_${t.function.id.replaceAll("-","_")}`,o=t.graphResultOf("HelperFunctionEntry");return`const ${e} = ${o?.code??"() => ({})"};`},value:t=>{let e=`__fn_${t.function.id.replaceAll("-","_")}`,o=Object.entries(t.inputs).map(([,v])=>v.value).join(", "),c=Object.entries(t.outputs).filter(([v])=>v!=="Output").map(([v,b])=>`${v}: ${b.value}`).join(", "),p=t.outputs.Output?.code.inner??"";return c===""?`${e}(${o}); ${p}`:`const { ${c} } = ${e}(${o}); ${p}`}}}})}};var tr=class extends Ze{mUserFunction;get userFunction(){return this.mUserFunction}constructor(){let t=new Qe,e=new Je,o=new ke;super(t,e,{generator:{code:c=>{let p="";for(let v of c.dependencies)p+=`${v.code}
`;return p+=c.entryPoint.code,p},values:{valueId:c=>`v_${c}`,hook:c=>`/*[${c}]*/`}}}),this.mUserFunction=o,this.setDynamicFunction(o),this.addBaseNodeDefinitions()}addBaseNodeDefinitions(){this.addNodeDefinition(new V({id:"Add",label:"Add",category:"operator",ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} + ${t.inputs.b.value};`}})),this.addNodeDefinition(new V({id:"Subtract",label:"Subtract",category:"operator",ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} - ${t.inputs.b.value};`}})),this.addNodeDefinition(new V({id:"Multiply",label:"Multiply",category:"operator",ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} * ${t.inputs.b.value};/*MULTIPLYHOOK_${t.outputs.result.value}*/`}})),this.addNodeDefinition(new V({id:"Divide",label:"Divide",category:"operator",ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} / ${t.inputs.b.value};`}})),this.addNodeDefinition(new V({id:"Modulo",label:"Modulo",category:"operator",ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} % ${t.inputs.b.value};`}})),this.addNodeDefinition(new V({id:"Equal",label:"Equal",category:"operator",ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"boolean"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} === ${t.inputs.b.value};`}})),this.addNodeDefinition(new V({id:"Not Equal",label:"Not Equal",category:"operator",ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"boolean"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} !== ${t.inputs.b.value};`}})),this.addNodeDefinition(new V({id:"Less Than",label:"Less Than",category:"operator",ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"boolean"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} < ${t.inputs.b.value};`}})),this.addNodeDefinition(new V({id:"Greater Than",label:"Greater Than",category:"operator",ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"boolean"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} > ${t.inputs.b.value};`}})),this.addNodeDefinition(new V({id:"And",label:"And",category:"operator",ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"boolean"},{label:"b",id:"b",portType:"value",dataType:"boolean"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"boolean"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} && ${t.inputs.b.value};`}})),this.addNodeDefinition(new V({id:"Or",label:"Or",category:"operator",ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"boolean"},{label:"b",id:"b",portType:"value",dataType:"boolean"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"boolean"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} || ${t.inputs.b.value};`}})),this.addNodeDefinition(new V({id:"Not",label:"Not",category:"operator",ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"boolean"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"boolean"}]},generators:{code:t=>`const ${t.outputs.result.value} = !${t.inputs.a.value};`}})),this.addNodeDefinition(new V({id:"Number to String",label:"Number to String",category:"type-conversion",ports:{inputs:[{label:"input",id:"input",portType:"value",dataType:"number"}],outputs:[{label:"output",id:"output",portType:"value",dataType:"string"}]},generators:{code:t=>`const ${t.outputs.output.value} = String(${t.inputs.input.value});`}})),this.addNodeDefinition(new V({id:"String to Number",label:"String to Number",category:"type-conversion",ports:{inputs:[{label:"input",id:"input",portType:"value",dataType:"string"}],outputs:[{label:"output",id:"output",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.output.value} = Number(${t.inputs.input.value});`}})),this.addNodeDefinition(new V({id:"Boolean to String",label:"Boolean to String",category:"type-conversion",ports:{inputs:[{label:"input",id:"input",portType:"value",dataType:"boolean"}],outputs:[{label:"output",id:"output",portType:"value",dataType:"string"}]},generators:{code:t=>`const ${t.outputs.output.value} = String(${t.inputs.input.value});`}})),this.addNodeDefinition(new V({id:"If",label:"If",category:"flow",ports:{inputs:[{label:"exec",id:"exec",portType:"flow"},{label:"condition",id:"condition",portType:"value",dataType:"boolean"}],outputs:[{label:"then",id:"then",portType:"flow"},{label:"else",id:"else",portType:"flow"}]},generators:{code:t=>`if (${t.inputs.condition.value}) {
${t.outputs.then.code.inner}
} else {
${t.outputs.else.code.inner}
}`}})),this.addNodeDefinition(new V({id:"While",label:"While",category:"flow",ports:{inputs:[{label:"exec",id:"exec",portType:"flow"},{label:"condition",id:"condition",portType:"value",dataType:"boolean"}],outputs:[{label:"body",id:"body",portType:"flow"}]},generators:{code:t=>`while (${t.inputs.condition.value}) {
${t.outputs.body.code.inner}
}`}})),this.addNodeDefinition(new V({id:"For Loop",label:"For Loop",category:"flow",ports:{inputs:[{label:"exec",id:"exec",portType:"flow"},{label:"count",id:"count",portType:"value",dataType:"number"}],outputs:[{label:"exec",id:"exec",portType:"flow"},{label:"index",id:"index",portType:"value",dataType:"number"}]},generators:{code:t=>`for (let ${t.outputs.index.value} = 0; ${t.outputs.index.value} < ${t.inputs.count.value}; ${t.outputs.index.value}++) {
${t.outputs.exec.code.inner}
}`}})),this.addNodeDefinition(new V({id:"Console Log",label:"Console Log",category:"Function",ports:{inputs:[{label:"message",id:"message",portType:"value",dataType:"string"}],outputs:[]},generators:{code:({inputs:t})=>`console.log(${t.message.value});`}})),this.addNodeDefinition(new V({id:"String Concat",label:"String Concat",category:"Function",ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"string"},{label:"b",id:"b",portType:"value",dataType:"string"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"string"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} + ${t.inputs.b.value};`}}))}};(()=>{let f=new WebSocket("ws://127.0.0.1:8088");f.addEventListener("open",()=>{console.log("Refresh connection established")}),f.addEventListener("message",t=>{console.log("Bundle finished. Start refresh"),t.data==="REFRESH"&&window.location.reload()})})();var jt=new tr;jt.addImport(new Xe);jt.addImport(new Ye);var Vi=48,zi=48,ks=new it(jt.entryPoint,{defaultParameters:{x:0,y:0},types:[it.MAIN,"number","string","boolean"],build:(f,t,e)=>{let o=t.code,c=f.function.id;if(!e){let I=new Function(`${o}
return ${c};`)();return{type:it.MAIN,execute:P=>I(P.x,P.y)}}let p=`/*[${e.value}]*/`,v=o.includes(p)?o.replace(p,`; return ${e.value};`):o,b=new Function(`${v}
return ${c};`)();return{type:e.documentPort.resolvedDataType,execute:I=>b(I.x,I.y)}}}),ta=new it(jt.userFunction,{defaultParameters:{x:0,y:0},types:["number","string","boolean"],build:(f,t,e)=>{if(!e)return{type:"number",execute:()=>0};let o=t.entryPoint.function,c=`__fn_${o.id.replaceAll("-","_")}`,p=o.inputs.map(I=>f.projectTypes.getDefaultValue(I.dataType)),v=e.value,b=new Function(`${t.code}
return ${c};`)();return{type:e.documentPort.resolvedDataType,execute:()=>{let I=b(...p);return I?I[v]:void 0}}}}),ea=new ye(ks,{id:"2dCanvas",generate:()=>{let f=document.createElement("canvas");return f.width=Vi,f.height=zi,f.style.width="100%",f.style.height="100%",f.style.imageRendering="pixelated",f},typeAdapter:{MAIN:f=>f,number:f=>[f,f,f],boolean:f=>{let t=f?1:0;return[t,t,t]}},update:async(f,t)=>{await Ui(f,t)}}),ra=new ye(ta,{id:"2dCanvas",generate:()=>{let f=document.createElement("canvas");return f.width=Vi,f.height=zi,f.style.width="100%",f.style.height="100%",f.style.imageRendering="pixelated",f},typeAdapter:{number:f=>[f,f,f],boolean:f=>{let t=f?1:0;return[t,t,t]}},update:async(f,t)=>{await Ui(f,t)}});jt.preview.addDisplay(ea);jt.preview.addDisplay(ra);var lr=new Ve(jt);lr.appendTo(document.body);lr.document=new Mt(jt);Bi();async function Bi(){try{await lr.update()}catch(f){console.error("[Page] Preview render pass failed:",f)}requestAnimationFrame(Bi)}async function Ui(f,t){let e=f.getContext("2d");if(!e)return;let o=f.width,c=f.height,p=e.createImageData(o,c),v=p.data;for(let b=0;b<c;b++)for(let I=0;I<o;I++){let P=I/o,a=b/c,n=await Promise.resolve(t({x:P,y:a})),u=(b*o+I)*4;v[u]=Math.floor(Math.max(0,Math.min(1,n[0]||0))*255),v[u+1]=Math.floor(Math.max(0,Math.min(1,n[1]||0))*255),v[u+2]=Math.floor(Math.max(0,Math.min(1,n[2]||0))*255),v[u+3]=255}e.putImageData(p,0,0)}})();
//# sourceMappingURL=page.js.map
