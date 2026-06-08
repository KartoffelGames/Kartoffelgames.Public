(()=>{var jt=class h extends Array{static newListWith(...t){let e=new h;return e.push(...t),e}clear(){this.splice(0,this.length)}clone(){return h.newListWith(...this)}distinct(){return h.newListWith(...new Set(this))}equals(t){if(this===t)return!0;if(!t||this.length!==t.length)return!1;for(let e=0;e<this.length;++e)if(this[e]!==t[e])return!1;return!0}remove(t){let e=this.indexOf(t);if(e!==-1)return this.splice(e,1)[0]}replace(t,e){let n=this.indexOf(t);if(n!==-1){let p=this[n];return this[n]=e,p}}toString(){return`[${super.join(", ")}]`}};var A=class extends Error{mTarget;get target(){return this.mTarget}constructor(t,e,n){super(t,n),this.mTarget=e}};var tt=class h extends Map{add(t,e){if(!this.has(t))this.set(t,e);else throw new A("Can't add duplicate key to dictionary.",this)}clone(){return new h(this)}getAllKeysOfValue(t){return[...this.entries()].filter(p=>p[1]===t).map(p=>p[0])}getOrDefault(t,e){let n=this.get(t);return typeof n<"u"?n:e}map(t){let e=new jt;for(let n of this){let p=t(n[0],n[1]);e.push(p)}return e}};var Pt=class h{mSize;mTopItem;get size(){return this.mSize}get top(){if(this.mTopItem)return this.mTopItem.value}constructor(){this.mTopItem=null,this.mSize=0}clone(){let t=new h;return t.mTopItem=this.mTopItem,t.mSize=this.mSize,t}*entries(){let t=this.mTopItem;for(;t!==null;)yield t.value,t=t.previous}flush(){let t=new Array;for(;this.mTopItem;)t.push(this.pop());return t}pop(){if(!this.mTopItem)return;let t=this.mTopItem.value;return this.mTopItem=this.mTopItem.previous,this.mSize--,t}push(t){let e={previous:this.mTopItem,value:t};this.mTopItem=e,this.mSize++}toArray(){return[...this.entries()]}};var Jt=class{mCompareFunction;constructor(t){this.mCompareFunction=t}differencesOf(t,e){let n;if(t.length===0||e.length===0){if(n=new Array,t.length===0)for(let C=0;C<e.length;C++)n.push({changeState:xt.Insert,item:e[C]});else for(let C=0;C<t.length;C++)n.push({changeState:xt.Remove,item:t[C]});return n}let p={1:{x:0,history:[]}},g=C=>C-1,v=t.length,b=e.length,S;for(let C=0;C<v+b+1;C++)for(let a=-C;a<C+1;a+=2){let o=a===-C||a!==C&&p[a-1].x<p[a+1].x;if(o){let l=p[a+1];S=l.x,n=l.history}else{let l=p[a-1];S=l.x+1,n=l.history}n=n.slice();let c=S-a;for(1<=c&&c<=b&&o?n.push({changeState:xt.Insert,item:e[g(c)]}):1<=S&&S<=v&&n.push({changeState:xt.Remove,item:t[g(S)]});S<v&&c<b&&this.mCompareFunction(t[g(S+1)],e[g(c+1)]);)S+=1,c+=1,n.push({changeState:xt.Keep,item:t[g(S)]});if(S>=v&&c>=b)return n;p[a]={x:S,history:n}}return new Array}},xt=function(h){return h[h.Remove=1]="Remove",h[h.Insert=2]="Insert",h[h.Keep=3]="Keep",h}({});var Kt=class h{static new(t){return new h(t)}mLabel;mId;mPortType;mDataType;mRegions;get label(){return this.mLabel}get id(){return this.mId}get portType(){return this.mPortType}get dataType(){return this.mDataType}get regions(){return this.mRegions}constructor(t){this.mLabel=t.label,this.mId=t.id,this.mPortType=t.portType,t.portType==="value"?this.mDataType=t.dataType:this.mDataType=null,this.mRegions={add:t.regions?.add??new Array}}};var mt=class h{static newNode(t){return new h(t)}mId;mCategory;mLabel;mRegions;mCodeGenerator;mPortProvider;get id(){return this.mId}get category(){return this.mCategory}get inputs(){let t=!1,e=[];return this.mPortProvider.inputs(n=>{if(e.push(Kt.new(n)),n.portType==="flow"){if(t)throw new A(`Node definition ${this.id} has multiple input flow ports, which is not allowed.`,this);t=!0}}),e}get label(){return this.mLabel}get outputs(){let t=[];return this.mPortProvider.outputs(e=>{t.push(Kt.new(e))}),t}get regions(){return this.mRegions}get codeGenerator(){return this.mCodeGenerator}getPort(t){return[...this.inputs,...this.outputs].find(e=>e.id===t)}constructor(t){this.mId=t.id,this.mLabel=t.label,this.mCategory=t.category,this.mCodeGenerator=t.generators.code,this.mPortProvider=t.generators.ports,this.mRegions={add:t.regions?.add??new Array,allows:t.regions?.allows??new Array,requires:t.regions?.requires??new Array}}};var Qt=class h extends mt{static newFunctionNode(t){return new h(t)}mFunction;get function(){return this.mFunction}get label(){return this.mFunction.label}constructor(t){let e=(p,g)=>v=>{v({label:p,id:p,portType:"flow"});for(let b of g)v({label:b.label,id:b.label,portType:"value",dataType:b.dataType})},n=t.project.getFunction(t.definitionId);super({id:`USERFUNCTION_${t.id}`,label:t.label,category:"user function",generators:{ports:{inputs:e("Input",t.inputs),outputs:e("Output",t.outputs)},code:p=>n?n.codeGenerator.value({function:t,inputs:p.inputs,outputs:p.outputs,code:p.code}):""}}),this.mFunction=t}};var Tt=class{mLabel;mConnectedPorts;mDefinitionId;mDirection;mDirectValue;mDocument;mNode;mPortType;mProject;mDataType;get connectedPorts(){return this.mConnectedPorts}get direction(){return this.mDirection}get directValue(){return this.mDirectValue}get definitionId(){return this.mDefinitionId}get document(){return this.mDocument}get label(){return this.mLabel}set label(t){this.mLabel=t}get node(){return this.mNode}get portType(){return this.mPortType}get project(){return this.mProject}get dataType(){return this.mDataType}get resolvedDataType(){if(this.mPortType!=="value")return"";if(!this.mProject.types.isGenericType(this.mDataType??""))return this.mDataType;if(this.mDirection==="output"){let t=this.mNode.inputs.value.find(e=>e.dataType===this.mDataType);return t?t.resolvedDataType:this.mDataType}return this.mDirection==="input"?this.mConnectedPorts.size===0?this.mDataType:this.mConnectedPorts.values().next().value.resolvedDataType:this.mDataType}constructor(t,e,n){if(n.portType==="flow"&&n.dataType!==null)throw new A("Flow ports cannot have a value type.",this);if(n.portType==="value"&&n.dataType===null)throw new A("Value ports must have a value type.",this);this.mProject=t,this.mDocument=e,this.mNode=n.node,this.mDefinitionId=n.definitionId,this.mLabel=n.label,this.mDataType=n.dataType,this.mDirection=n.direction,this.mPortType=n.portType,this.mConnectedPorts=new Set,this.mDirectValue=new Array,n.dataType&&!this.mProject.types.isGenericType(n.dataType)&&this.mDirectValue.push(...t.types.getType(n.dataType).default.string)}connect(t){if(this.mConnectedPorts.has(t))return;if(this.mPortType!==t.portType)throw new A(`Cannot connect port ${this.mDefinitionId} of node ${this.mNode.label} to port ${t.mDefinitionId} of node ${t.node.label} due to incompatible port types.`,this);if(this.mDirection===t.direction)throw new A(`Cannot connect port ${this.mDefinitionId} of node ${this.mNode.label} to port ${t.mDefinitionId} of node ${t.node.label} due to incompatible directions.`,this);if(!(this.mPortType==="flow"&&this.mDirection==="input"||this.mPortType==="value"&&this.mDirection==="output"))for(let n of Array.from(this.mConnectedPorts))this.disconnect(n);this.mConnectedPorts.add(t),t.connect(this)}disconnect(t){this.mConnectedPorts.has(t)&&(this.mConnectedPorts.delete(t),t.disconnect(this))}setDirectValue(t){if(this.mPortType!=="value")throw new A("Only value ports can have a direct value.",this);if(this.mProject.types.isGenericType(this.mDataType))throw new A("Generic value ports cannot have a direct value.",this);if(t.length!==this.mProject.types.getType(this.mDataType).default.string.length)throw new A("The provided value does not match the expected length of the default value for this port's type.",this);this.mDirectValue.splice(0,this.mDirectValue.length),this.mDirectValue.push(...t)}validate(){let t=new Array;if(this.mDirection==="output"){if(this.mPortType==="flow"&&this.mConnectedPorts.size>1&&t.push(new Z(`Flow output port "${this.mDefinitionId}" on node "${this.mNode.label}" can only have one connection.`,this)),this.mPortType==="value"&&this.mProject.types.isGenericType(this.mDataType??"")){let e=this.mNode.inputs.value.filter(n=>n.dataType===this.mDataType);for(let n of e)n.connectedPorts.size===0&&t.push(new Z(`Generic output port "${this.mDefinitionId}" on node "${this.mNode.label}" cannot resolve generic type "${this.mDataType}" because its input port "${n.definitionId}" is not connected.`,this))}return t}if(this.mDirection==="input"){if(this.mPortType==="flow")return this.mConnectedPorts.size===0&&t.push(new Z(`Flow input port "${this.mDefinitionId}" on node "${this.mNode.label}" must have at least one connection.`,this)),t;if(this.mPortType==="value"){this.mConnectedPorts.size>1&&t.push(new Z(`Value input port "${this.mDefinitionId}" on node "${this.mNode.label}" can only have one connection.`,this));for(let e of this.mConnectedPorts)e.resolvedDataType!==this.resolvedDataType&&t.push(new Z(`Value input port "${this.mDefinitionId}" on node "${this.mNode.label}" expects type "${this.resolvedDataType}" but is connected to type "${e.resolvedDataType}".`,this));return t}}return t}};var yt=class{mCategory;mDefinitionId;mDocument;mFunction;mInputs;mLabel;mOutputs;mPreview;mTransformation;mProject;get definitionId(){return this.mDefinitionId}get document(){return this.mDocument}get function(){return this.mFunction}get inputs(){return this.mInputs}get outputs(){return this.mOutputs}get project(){return this.mProject}get transformation(){return this.mTransformation}get category(){return this.mCategory}get label(){return this.mLabel}set label(t){this.mLabel=t}get preview(){return this.mPreview}set preview(t){this.mPreview=t}get hasFlowPorts(){return this.mOutputs.flow.length>0||this.mInputs.flow.length>0}get hasValuePorts(){return this.mOutputs.value.length>0||this.mInputs.value.length>0}constructor(t,e,n,p){this.mCategory=p.category,this.mDocument=e,this.mDefinitionId=p.definitionId,this.mFunction=n,this.mLabel=p.label,this.mPreview=p.preview??null,this.mProject=t,this.mTransformation=p.transformation;let g=(v,b)=>{let S={direction:b,list:new Array,map:new Map,flow:new Array,value:new Array};for(let C of v){let a=new Tt(this.mProject,this.mDocument,{definitionId:C.definitionId,direction:b,label:C.label,node:this,portType:C.portType,dataType:C.dataType});S.list.push(a),S.map.set(a.definitionId,a),(a.portType==="flow"?S.flow:S.value).push(a)}return S};this.mInputs=g(p.ports.input,"input"),this.mOutputs=g(p.ports.output,"output")}moveTo(t,e){this.mTransformation.x=t,this.mTransformation.y=e}resizeTo(t,e){this.mTransformation.width=Math.max(4,t),this.mTransformation.height=Math.max(4,e)}validate(t){let e=new Array,n=this.mFunction.nodeDefinitions.find(p=>p.id===this.mDefinitionId);if(!n)e.push(new Z(`Node "${this.mLabel}" definition "${this.mDefinitionId}" could not be found.`,this));else{e.push(...this.resyncPorts(this.mInputs,n.inputs)),e.push(...this.resyncPorts(this.mOutputs,n.outputs));let p=new Set([...n.regions.requires,...n.regions.allows]);if(p.size>0)for(let g of t)p.has(g)||e.push(new Z(`Node "${this.mLabel}" does not allow region "${g}".`,this));if(n.regions.requires.length>0)for(let g of n.regions.requires)t.has(g)||e.push(new Z(`Node "${this.mLabel}" requires region "${g}" but it is not active.`,this))}for(let p of[...this.mInputs.list,...this.mOutputs.list])e.push(...p.validate());return e}resyncPorts(t,e){let n=new Array,p=new Set(e.map(g=>g.id));for(let g=0;g<e.length;g++){let v=e[g];if(!t.map.has(v.id)){this.addPort(t,v,g);continue}let b=t.map.get(v.id),S=b.portType!==v.portType,C=b.dataType!==v.dataType;if(!(!S&&!C)){if(b.connectedPorts.size>0&&S){n.push(new Z(`Port "${b.label}" on node "${this.mLabel}" has a changed type.`,b));continue}this.replacePort(t,b,v)}}for(let g of t.list)if(!p.has(g.definitionId)){if(g.connectedPorts.size===0){this.removePort(t,g);continue}n.push(new Z(`Port "${g.label}" on node "${this.mLabel}" no longer exists in its definition.`,g))}return n}addPort(t,e,n){let p=new Tt(this.mProject,this.mDocument,{definitionId:e.id,direction:t.direction,label:e.label,node:this,portType:e.portType,dataType:e.dataType});return t.list.splice(n,0,p),t.map.set(p.definitionId,p),(p.portType==="flow"?t.flow:t.value).push(p),p}removePort(t,e){let n=t.list.indexOf(e);if(n===-1)throw new A(`Port "${e.label}" was not found and can not be removed.`,this);t.list.splice(n,1),t.map.delete(e.definitionId);let p=e.portType==="flow"?t.flow:t.value,g=p.indexOf(e);if(n===-1)throw new A(`Port "${e.label}" was not found in typed list and can not be removed.`,this);return p.splice(g,1),n}replacePort(t,e,n){let p=Array.from(e.connectedPorts);for(let b of Array.from(e.connectedPorts))e.disconnect(b);let g=this.removePort(t,e),v=this.addPort(t,n,g);for(let b of p)v.connect(b);return v}};var bt=class{mLabel;mDefinitionId;mDocument;mId;mImports;mInputs;mIsSystem;mNodes;mOutputs;mProject;get id(){return this.mId}get definitionId(){return this.mDefinitionId}get document(){return this.mDocument}get nodes(){return this.mNodes}get nodeDefinitions(){let t=this.mProject.getFunction(this.definitionId);if(!t)return[...this.mDocument.nodeDefinitions];let e=t.getNodeDefinitions(this);return[...this.mDocument.nodeDefinitions,...e.entry,...e.exit,...e.dynamic]}get imports(){return this.mImports}get inputs(){return this.mInputs}get label(){return this.mLabel}set label(t){this.mLabel=t}get outputs(){return this.mOutputs}get isSystem(){return this.mIsSystem}get project(){return this.mProject}constructor(t,e,n){this.mProject=t,this.mDocument=e,this.mLabel=n.label,this.mIsSystem=n.isSystem,this.mDefinitionId=n.definitionId,this.mId=n.id,this.mNodes=new Set,this.mInputs=new Array,this.mOutputs=new Array,this.mImports=new Array}addImport(t){this.mImports.includes(t)||this.mImports.push(t)}addInput(t){this.mInputs.some(e=>e.label===t.label)||this.mInputs.push(t)}addOutput(t){this.mOutputs.some(e=>e.label===t.label)||this.mOutputs.push(t)}addNode(t){this.mNodes.add(t)}addNodeByDefinition(t,e){let n=g=>({definitionId:g.id,label:g.label,portType:g.portType,dataType:g.dataType}),p=new yt(this.mProject,this.mDocument,this,{category:t.category,definitionId:t.id,ports:{input:t.inputs.map(n),output:t.outputs.map(n)},label:t.label,transformation:e});return this.mNodes.add(p),p}getExitNodes(){let t=this.mProject.getFunction(this.mDefinitionId);if(!t)throw new A(`Function definition not found for function "${this.mLabel}".`,this);let e=new Set(t.getNodeDefinitions(this).exit.map(n=>n.id));return[...this.mNodes].filter(n=>e.has(n.definitionId))}removeNode(t){for(let e of[...t.inputs.list,...t.outputs.list])for(let n of Array.from(e.connectedPorts))e.disconnect(n);this.mNodes.delete(t)}removeImport(t){let e=this.mImports.indexOf(t);e!==-1&&this.mImports.splice(e,1)}removeInput(t){let e=this.mInputs.findIndex(n=>n.label===t.label);e!==-1&&this.mInputs.splice(e,1)}removeOutput(t){let e=this.mOutputs.findIndex(n=>n.label===t.label);e!==-1&&this.mOutputs.splice(e,1)}validate(){let t=[],e=this.mProject.getFunction(this.mDefinitionId);e||t.push(new Z(`Function "${this.mLabel}" definition "${this.mDefinitionId}" could not be found.`,this));let n=e?.getNodeDefinitions(this);n&&this.resyncFunction(n);let p=new Map,g=new Map;for(let S of this.mNodes)g.set(S,this.accumulateRegions(S,p,new Set,t));let v=new Set(n?.entry.map(S=>S.id)??new Array),b=new Map;for(let S of this.mNodes)t.push(...S.validate(g.get(S))),this.accumulateEntryDomains(S,v,b).size>1&&t.push(new Z(`Node "${S.label}" is reachable from multiple entry nodes.`,S));return t}accumulateRegions(t,e,n,p){if(e.has(t))return e.get(t);if(n.has(t))return p.push(new Z(`Node "${t.label}" is part of a connection cycle.`,t)),new Set;n.add(t);let g=new Set;for(let v of t.inputs.list)for(let b of v.connectedPorts){let S=b.node,C=this.accumulateRegions(S,e,n,p);for(let o of C)g.add(o);let a=this.nodeDefinitions.find(o=>o.id===S.definitionId);if(a){for(let c of a.regions.add)g.add(c);let o=a.getPort(b.definitionId);if(o)for(let c of o.regions.add)g.add(c)}}return e.set(t,g),g}accumulateEntryDomains(t,e,n){if(n.has(t))return n.get(t);let p=new Set;n.set(t,p);for(let g of t.inputs.list)for(let v of g.connectedPorts){let b=v.node;e.has(b.definitionId)&&p.add(b);for(let S of this.accumulateEntryDomains(b,e,n))p.add(S)}return p}resyncFunction(t){let e=[...t.entry,...t.exit],n=new Set(this.mNodes.values().map(v=>v.definitionId)),p=0,g=20;for(let v of e)n.has(v.id)||(this.addNodeByDefinition(v,{x:Math.floor(p/(e.length/2))*g+2,y:p*g+2-Math.floor(p/(e.length/2))*(e.length/2*g),width:0,height:0}),p++)}};var Mt=class{mFunctions;mFunctionNodeDefinitions;mProject;get functions(){return this.mFunctions}get nodeDefinitions(){return[...this.mFunctionNodeDefinitions.values(),...this.mProject.nodeDefinitions.values()]}get project(){return this.mProject}constructor(t){this.mProject=t,this.mFunctions=new Set,this.mFunctionNodeDefinitions=new Map}addFunction(t){this.mFunctions.add(t);let e=Qt.newFunctionNode(t);this.mFunctionNodeDefinitions.set(e.id,e)}newFunction(t){let e=new bt(this.mProject,this,t);this.mFunctions.add(e);let n=Qt.newFunctionNode(e);return this.mFunctionNodeDefinitions.set(n.id,n),e}removeFunction(t){if(!this.mFunctions.has(t))return!1;if(t.isSystem)throw new A("Cannot remove a system function.",this);this.mFunctions.delete(t);let e=this.mFunctionNodeDefinitions.values().find(n=>n.function===t);return e&&this.mFunctionNodeDefinitions.delete(e.id),!0}validate(){let t=[],e=this.mProject.entryPoint.id;this.mFunctions.values().some(n=>n.definitionId===e)||this.newFunction({definitionId:e,id:crypto.randomUUID(),isSystem:!0,label:this.mProject.entryPoint.label});for(let n of this.mFunctions)t.push(...n.validate());return t.push(...this.detectCrossFunctionRecursion()),t}detectCrossFunctionRecursion(){let t=[],e=new Map,n=b=>{if(!e.has(b)){let S=new Set;for(let C of b.nodes)this.mFunctionNodeDefinitions.has(C.definitionId)&&S.add(this.mFunctionNodeDefinitions.get(C.definitionId).function);e.set(b,S)}return e.get(b)},p=new Set,g=new Set,v=b=>{if(!p.has(b)){if(g.has(b)){t.push(new Z(`Function "${b.label}" participates in a cross-function recursion cycle.`,b));return}g.add(b);for(let S of n(b))v(S);g.delete(b),p.add(b)}};for(let b of this.mFunctions)v(b);return t}},Z=class{mMessage;mItem;get message(){return this.mMessage}get item(){return this.mItem}constructor(t,e){this.mMessage=t,this.mItem=e}};var st=class h{static mComponents=new WeakMap;static mConstructorSelector=new WeakMap;static mElements=new WeakMap;static ofComponent(t){let e=t.processorConstructor,n=h.mConstructorSelector.get(e);if(!n)throw new A(`Constructor "${e.name}" is not a registered custom element`,e);let p=h.mElements.get(t);if(!p)throw new A(`Component "${t}" is not a registered component`,t);return{selector:n,constructor:e,element:p,component:t,processor:t.processor}}static ofConstructor(t){let e=h.mConstructorSelector.get(t);if(!e)throw new A(`Constructor "${t.name}" is not a registered custom element`,t);let n=globalThis.customElements.get(e);if(!n)throw new A(`Constructor "${t.name}" is not a registered custom element`,t);return{selector:e,constructor:t,elementConstructor:n}}static ofElement(t){let e=h.mComponents.get(t);if(!e)throw new A(`Element "${t}" is not a PwbComponent.`,t);return h.ofComponent(e)}static ofProcessor(t){let e=h.mComponents.get(t);if(!e)throw new A("Processor is not a PwbComponent.",t);return h.ofComponent(e)}static registerComponent(t,e,n){h.mComponents.has(e)||h.mComponents.set(e,t),n&&!h.mComponents.has(n)&&h.mComponents.set(n,t),h.mElements.has(t)||h.mElements.set(t,e)}static registerConstructor(t,e){t&&!h.mConstructorSelector.has(t)&&h.mConstructorSelector.set(t,e)}};var kt=class h{static CONFIGURATION_ATTACHMENT=Symbol("PwbApplicationConfigurationAttachment");static new(t,e){let n=new h;t(n),e&&n.appendTo(e)}mContent;mElement;constructor(){this.mContent=new Array,this.mElement=document.createElement("div"),this.mElement.attachShadow({mode:"open"})}addContent(t){let e=st.ofConstructor(t).elementConstructor,n=st.ofElement(new e);return this.mContent.push(n.component),this.mElement.shadowRoot.appendChild(n.element),n.processor}addStyle(t){let e=document.createElement("style");e.textContent=t,this.mElement.shadowRoot.prepend(e)}appendTo(t){t.appendChild(this.mElement)}};var Ht=class{mCustomMetadata;constructor(){this.mCustomMetadata=new Map}getMetadata(t){return this.mCustomMetadata.get(t)??null}setMetadata(t,e){this.mCustomMetadata.set(t,e)}};var te=class extends Ht{};var ee=class h extends Ht{static mPrivateMetadataKey=Symbol("Metadata");mDecoratorMetadataObject;mPropertyMetadata;constructor(t){super(),this.mDecoratorMetadataObject=t,this.mPropertyMetadata=new Map,t[h.mPrivateMetadataKey]=this}getInheritedMetadata(t){let e=new Array,n=this.mDecoratorMetadataObject;do{if(Object.hasOwn(n,h.mPrivateMetadataKey)){let g=n[h.mPrivateMetadataKey].getMetadata(t);g!==null&&e.push(g)}n=Object.getPrototypeOf(n)}while(n!==null);return e.reverse()}getProperty(t){return this.mPropertyMetadata.has(t)||this.mPropertyMetadata.set(t,new te),this.mPropertyMetadata.get(t)}};Symbol.metadata??=Symbol("Symbol.metadata");var ot=class h{static mMetadataMapping=new Map;static add(t,e){return(n,p)=>{let g=h.forInternalDecorator(p.metadata);switch(p.kind){case"class":g.setMetadata(t,e);return;case"method":case"field":case"getter":case"setter":case"accessor":if(p.static)throw new Error("@Metadata.add not supported for statics.");g.getProperty(p.name).setMetadata(t,e);return}}}static forInternalDecorator(t){return h.mapMetadata(t)}static get(t){Object.hasOwn(t,Symbol.metadata)||h.polyfillMissingMetadata(t);let e=t[Symbol.metadata];return h.mapMetadata(e)}static init(){return(t,e)=>{h.forInternalDecorator(e.metadata)}}static mapMetadata(t){if(h.mMetadataMapping.has(t))return h.mMetadataMapping.get(t);let e=new ee(t);return h.mMetadataMapping.set(t,e),e}static polyfillMissingMetadata(t){let e=new Array,n=t;do e.push(n),n=Object.getPrototypeOf(n);while(n!==null);for(let p=e.length-1;p>=0;p--){let g=e[p];if(!Object.hasOwn(g,Symbol.metadata)){let v=null;p<e.length-2&&(v=e[p+1][Symbol.metadata]),g[Symbol.metadata]=Object.create(v,{})}}}};var O=class h{static mCurrentInjectionContext=null;static mInjectMode=new Map;static mInjectableConstructor=new Map;static mInjectableReplacement=new Map;static mInjectionConstructorIdentificationMetadataKey=Symbol("InjectionConstructorIdentification");static mSingletonMapping=new Map;static createObject(t,e,n){let[p,g]=typeof e=="object"&&e!==null?[!1,e]:[!!e,n??new Map],v=h.getInjectionIdentification(t);if(!h.mInjectableConstructor.has(v))throw new A(`Constructor "${t.name}" is not registered for injection and can not be built`,h);let b=p?"instanced":h.mInjectMode.get(v),S=new Map(g.entries().map(([o,c])=>[h.getInjectionIdentification(o),c])),C=h.mCurrentInjectionContext,a=new Map([...C?.localInjections.entries()??[],...S.entries()]);h.mCurrentInjectionContext={injectionMode:b,localInjections:a};try{if(!p&&b==="singleton"&&h.mSingletonMapping.has(v))return h.mSingletonMapping.get(v);let o=new t;return b==="singleton"&&!h.mSingletonMapping.has(v)&&h.mSingletonMapping.set(v,o),o}finally{h.mCurrentInjectionContext=C}}static injectable(t="instanced"){return(e,n)=>{h.registerInjectable(e,n.metadata,t)}}static registerInjectable(t,e,n){let p=h.getInjectionIdentification(t,e);h.mInjectableConstructor.set(p,t),h.mInjectMode.set(p,n)}static replaceInjectable(t,e){let n=h.getInjectionIdentification(t);if(!h.mInjectableConstructor.has(n))throw new A("Original constructor is not registered.",h);let p=h.getInjectionIdentification(e);if(!h.mInjectableConstructor.has(p))throw new A("Replacement constructor is not registered.",h);h.mInjectableReplacement.set(n,e)}static use(t){if(h.mCurrentInjectionContext===null)throw new A("Can't create object outside of an injection context.",h);let e=h.getInjectionIdentification(t);if(h.mCurrentInjectionContext.injectionMode!=="singleton"&&h.mCurrentInjectionContext.localInjections.has(e))return h.mCurrentInjectionContext.localInjections.get(e);let n=h.mInjectableReplacement.get(e);if(n||(n=h.mInjectableConstructor.get(e)),!n)throw new A(`Constructor "${t.name}" is not registered for injection and can not be built`,h);return h.createObject(n)}static getInjectionIdentification(t,e){let n=e?ot.forInternalDecorator(e):ot.get(t),p=n.getMetadata(h.mInjectionConstructorIdentificationMetadataKey);return p||(p=Symbol(t.name),n.setMetadata(h.mInjectionConstructorIdentificationMetadataKey,p)),p}};var Y=function(h){return h[h.Read=1]="Read",h[h.ReadWrite=2]="ReadWrite",h[h.Write=3]="Write",h}({});var Et=class{mHooks;mInjections;mProcessor;mProcessorConstructor;get processor(){if(!this.mProcessor)throw new A("Processor is not created yet. Call setup to create processor.",this);return this.mProcessor}get processorConstructor(){return this.mProcessorConstructor}constructor(t){if(this.mProcessorConstructor=t.constructor,this.mProcessor=null,this.mInjections=new Map,this.mHooks={create:new Array},t.parent)for(let[e,n]of t.parent.mInjections.entries())this.setProcessorInjection(e,n)}call(t,...e){let n=Reflect.get(this.processor,t);return typeof n!="function"?null:n.apply(this.processor,e)}deconstruct(){}getProcessorInjection(t){return this.mInjections.get(t)}setProcessorInjection(t,e){if(this.mProcessor)throw new A("Cant add injections to after construction.",this);this.mInjections.set(t,e)}setup(){return this.mProcessor=this.createProcessor(),this}addConstructionHook(t){return this.mHooks.create.push(t),this}createProcessor(){let t=O.createObject(this.mProcessorConstructor,this.mInjections),e;for(;e=this.mHooks.create.pop();){let n=e.call(this,t);n&&(t=n)}return t}};var Nt=class h extends Et{constructor(t,e){super({constructor:t,parent:e}),this.setProcessorInjection(h,this)}deconstruct(){this.call("onDeconstruct"),super.deconstruct()}setup(){return super.setup(),this.call("onExecute"),this}onUpdate(){return!1}};var He=class h{static mInstance;mCoreEntityConstructor;mProcessorConstructorConfiguration;constructor(){if(h.mInstance)return h.mInstance;h.mInstance=this,this.mCoreEntityConstructor=new Map,this.mProcessorConstructorConfiguration=new Map}get(t){let e=this.mCoreEntityConstructor.get(t);if(!e)return new Array;let n=new Array;for(let p of e)n.push({processorConstructor:p,processorConfiguration:this.mProcessorConstructorConfiguration.get(p)});return n}register(t,e,n){this.mProcessorConstructorConfiguration.set(e,n);let p=t;do{if(!(p.prototype instanceof Et)&&p!==Et)break;this.mCoreEntityConstructor.has(p)||this.mCoreEntityConstructor.set(p,new Set),this.mCoreEntityConstructor.get(p).add(e)}while(p=Object.getPrototypeOf(p))}},at=new He;var Xt=class h extends Et{static mExtensionCache=new WeakMap;mExtensionList;constructor(t){super(t),this.mExtensionList=new Array}deconstruct(){for(let t of this.mExtensionList)t.deconstruct();super.deconstruct()}setup(){return super.setup(),this.executeExtensions(),this}executeExtensions(){let t=(()=>{if(!h.mExtensionCache.has(this.processorConstructor)){let p=at.get(Nt).filter(v=>{for(let b of v.processorConfiguration.targetRestrictions)if(this instanceof b||this.processorConstructor.prototype instanceof b||this.processorConstructor===b)return!0;return!1}),g={read:p.filter(v=>v.processorConfiguration.access===Y.Read),write:p.filter(v=>v.processorConfiguration.access===Y.Write),readWrite:p.filter(v=>v.processorConfiguration.access===Y.ReadWrite)};h.mExtensionCache.set(this.processorConstructor,g)}return h.mExtensionCache.get(this.processorConstructor)})(),e=[...t.write,...t.readWrite,...t.read];for(let n of e)this.mExtensionList.push(new Nt(n.processorConstructor,this).setup())}};var At=class{mData;mInteractionType;mOrigin;get data(){return this.mData}get origin(){return this.mOrigin}get triggerType(){return this.mInteractionType}constructor(t,e,n){this.mInteractionType=t,this.mData=n,this.mOrigin=e}};var Rt=class h{static mCurrentZone=new h("Default");static get current(){return h.mCurrentZone}static create(t){return new h(t)}mInteractionListener;mName;mTriggerFilterBitmap;get name(){return this.mName}constructor(t){this.mName=t,this.mTriggerFilterBitmap=-1,this.mInteractionListener=new Map}addInteractionListener(t){return this.mInteractionListener.set(t,h.current),this}setTriggerRestriction(t){return this.mTriggerFilterBitmap=t,this}execute(t,...e){let n=h.mCurrentZone;h.mCurrentZone=this;try{return t(...e)}finally{h.mCurrentZone=n}}pushInteraction(t,e){if((this.mTriggerFilterBitmap&t)===0)return!1;if(this.mInteractionListener.size===0)return!0;let n=new At(t,this,e);for(let[p,g]of this.mInteractionListener.entries())g.execute(()=>{p.call(this,n)});return!0}removeInteractionListener(t){return t?(this.mInteractionListener.delete(t),this):(this.mInteractionListener.clear(),this)}};var B={get:1,set:2,manual:4};var ge=class h{static ORIGINAL_TO_INTERACTION_MAPPING=new WeakMap;static PROXY_TO_ORIGINAL_MAPPING=new WeakMap;static UNTRACEABLE_FUNCTION_UPDATE_TRIGGER=(()=>{let t=new WeakMap;return t.set(Array.prototype.fill,B.set),t.set(Array.prototype.pop,B.get),t.set(Array.prototype.push,B.set),t.set(Array.prototype.shift,B.get),t.set(Array.prototype.unshift,B.set),t.set(Array.prototype.splice,B.set),t.set(Array.prototype.reverse,B.set),t.set(Array.prototype.sort,B.set),t.set(Array.prototype.concat,B.set),t.set(Map.prototype.clear,B.set),t.set(Map.prototype.delete,B.set),t.set(Map.prototype.set,B.set),t.set(Set.prototype.clear,B.set),t.set(Set.prototype.delete,B.set),t.set(Set.prototype.add,B.set),t})();static getOriginal(t){return h.PROXY_TO_ORIGINAL_MAPPING.get(t)??t}static getWrapper(t){let e=h.getOriginal(t);return h.ORIGINAL_TO_INTERACTION_MAPPING.get(e)}mProxyObject;mStateChangeCallback;get proxy(){return this.mProxyObject}constructor(t,e){let n=h.getWrapper(t);if(n)return n;this.mProxyObject=this.createProxyObject(t),this.mStateChangeCallback=e,h.PROXY_TO_ORIGINAL_MAPPING.set(this.mProxyObject,t),h.ORIGINAL_TO_INTERACTION_MAPPING.set(t,this)}convertToProxy(t){return t===null||typeof t!="object"&&typeof t!="function"?t:new h(t,this.mStateChangeCallback).proxy}createProxyObject(t){let e=(p,g,v)=>{let b=h.getOriginal(g);try{let S=p.call(b,...v);return this.convertToProxy(S)}finally{if(h.UNTRACEABLE_FUNCTION_UPDATE_TRIGGER.has(p)){let S=h.getWrapper(g);S&&S.dispatch(h.UNTRACEABLE_FUNCTION_UPDATE_TRIGGER.get(p))}}};return new Proxy(t,{apply:(p,g,v)=>{let b=p;try{let S=b.call(g,...v);return this.convertToProxy(S)}catch(S){if(!(S instanceof TypeError))throw S;return e(b,g,v)}},set:(p,g,v)=>{try{let b=v;return(b!==null&&typeof b=="object"||typeof b=="function")&&(b=h.getOriginal(b)),Reflect.set(p,g,b)}finally{this.dispatch(B.set)}},get:(p,g,v)=>{try{return this.convertToProxy(Reflect.get(p,g))}finally{this.dispatch(B.get)}},deleteProperty:(p,g)=>{try{return delete p[g]}finally{this.dispatch(B.set)}}})}dispatch(t){this.mStateChangeCallback(t)}};var U=class h{static reaction(t){let e=Rt.create("ComponentState reaction");e.addInteractionListener(n=>{(n.triggerType&B.set)!==0&&t()}),e.execute(()=>{t()})}static state(t){return(e,n)=>{if(n.static)throw new A("Event target is not for a static property.",h);let p=new WeakMap,g=(v,b)=>{p.set(v,new h(b,t))};return{init(v){return typeof v>"u"||g(this,v),v},set(v){p.has(this)?p.get(this).set(v):g(this,v)},get(){return p.has(this)||g(this,void 0),p.get(this).get()}}}}mLinkedZones;mLinkedZonesArray;mConfiguration;mValue;constructor(t,e){if(this.mLinkedZones=new Set,this.mLinkedZonesArray=new Array,this.mConfiguration={complexValue:e?.complexValue??!1,proxy:e?.proxy??!1},this.mConfiguration.proxy){if(typeof t!="object"||t===null)throw new A("Proxied component state value must be an object.",this);this.mValue=new ge(t,n=>{switch(n){case B.set:return this.dispatchChange();case B.get:return this.linkCurrentZone()}}).proxy}else this.mValue=t}get(){return this.linkCurrentZone(),this.mValue}set(t){if(this.mConfiguration.proxy)throw new A("Proxy is not implemented yet.",this);!this.mConfiguration.complexValue&&this.mValue===t||(this.mValue=t,this.dispatchChange())}dispatchChange(){for(let t of this.mLinkedZonesArray)t.pushInteraction(B.set,this)}linkCurrentZone(){let t=Rt.current;this.mLinkedZones.has(t)||(this.mLinkedZones.add(t),this.mLinkedZonesArray.push(t))}};var Lt=class h{static mCurrentUpdateCycle=null;static openResheduledCycle(t,e){let n=!1;if(!h.mCurrentUpdateCycle){let p=performance.now();h.mCurrentUpdateCycle={initiator:t.initiator,startTime:p,forcedSync:t.forcedSync,runner:t.runner},n=!0}try{return e(h.mCurrentUpdateCycle)}finally{n&&(h.mCurrentUpdateCycle=null)}}static openUpdateCycle(t,e){let n=!1;if(!h.mCurrentUpdateCycle){let p=performance.now();h.mCurrentUpdateCycle={initiator:t.updater,startTime:p,forcedSync:t.runSync,runner:Symbol("Runner "+p)},n=!0}try{return e(h.mCurrentUpdateCycle)}finally{n&&(h.mCurrentUpdateCycle=null)}}static updateCycleRunId(t,e){if(t.initiator===e){let n=performance.now(),p=t;p.runner=Symbol("Runner "+n)}}static updateCyleStartTime(t){let e=performance.now(),n=t;n.startTime=e}};var ve=class extends Error{mChain;get chain(){return this.mChain}constructor(t,e){let n=e.slice(-20).map(p=>p.toString()).join(`
`);super(`${t}: 
${n}`),this.mChain=[...e]}};var ye=class h{static mStackCap=100;static mFrameTime=100;static get stackCap(){return h.mStackCap}static set stackCap(t){h.mStackCap=t}static get frameTime(){return h.mFrameTime}static set frameTime(t){h.mFrameTime=t}mInteractionZone;mUpdateFunction;mUpdateRunCache;mUpdateStates;mManualComponentState;get zone(){return this.mInteractionZone}constructor(t){this.mUpdateRunCache=new WeakMap,this.mUpdateFunction=t.onUpdate,this.mManualComponentState=new U(Symbol("Manual Update")),this.mUpdateStates={chainCompleteHooks:new Pt,async:{hasSheduledTask:!1,hasRunningTask:!1,sheduledTaskIsResheduled:!1},sync:{running:!1},cycle:{chainedTask:null}},this.mInteractionZone=Rt.create("Update-Zone"),this.mInteractionZone.addInteractionListener(e=>{(e.triggerType&B.set)!==0&&this.runUpdateAsynchron(e,null)})}deconstruct(){this.mInteractionZone.removeInteractionListener()}async waitForUpdate(){return this.mUpdateStates.async.hasSheduledTask?new Promise((t,e)=>{this.mUpdateStates.chainCompleteHooks.push((n,p)=>{p?e(p):t(n)})}):!1}executeInZone(t){return this.mInteractionZone.execute(t)}update(){let t=new At(B.manual,this.mInteractionZone,this.mManualComponentState);return this.runUpdateSynchron(t)}updateAsync(){let t=new At(B.manual,this.mInteractionZone,this.mManualComponentState);this.runUpdateAsynchron(t,null)}executeTaskChain(t,e,n,p){if(p.length>h.stackCap)throw new ve("Call loop detected",p);let g=performance.now();if(!e.forcedSync&&g-e.startTime>h.frameTime)throw new re;p.push(t);let v=this.mInteractionZone.execute(()=>this.mUpdateFunction.call(this))||n;if(Lt.updateCycleRunId(e,this),!this.mUpdateStates.cycle.chainedTask)return v;let b=this.mUpdateStates.cycle.chainedTask;return this.mUpdateStates.cycle.chainedTask=null,this.executeTaskChain(b,e,v,p)}releaseUpdateChainCompleteHooks(t,e){if(!this.mUpdateStates.chainCompleteHooks.top)return;let n;for(;n=this.mUpdateStates.chainCompleteHooks.pop();)n(t,e)}runUpdateAsynchron(t,e){if(this.mUpdateStates.async.hasRunningTask||this.mUpdateStates.async.sheduledTaskIsResheduled){this.mUpdateStates.cycle.chainedTask=t;return}if(this.mUpdateStates.async.hasSheduledTask)return;let n=p=>{this.mUpdateStates.async.hasRunningTask=!0,this.mUpdateStates.async.hasSheduledTask=!1,this.mUpdateStates.async.sheduledTaskIsResheduled=!1;let g=!1;try{this.runUpdateSynchron(t)}catch(v){v instanceof re&&p.initiator===this&&(g=!0)}finally{this.mUpdateStates.async.hasRunningTask=!1}g&&this.runUpdateAsynchron(t,p)};this.mUpdateStates.async.hasSheduledTask=!0,e&&(this.mUpdateStates.async.sheduledTaskIsResheduled=!0),globalThis.requestAnimationFrame(()=>{e?Lt.openResheduledCycle(e,n):Lt.openUpdateCycle({updater:this,runSync:!1},n)})}runUpdateSynchron(t){if(this.mUpdateStates.sync.running)return this.mUpdateStates.cycle.chainedTask=t,!1;this.mUpdateStates.sync.running=!0;try{let e=Lt.openUpdateCycle({updater:this,runSync:!0},n=>{if(this.mUpdateRunCache.has(n.runner))return Lt.updateCyleStartTime(n),this.mUpdateRunCache.get(n.runner);let p=this.executeTaskChain(t,n,!1,new Array);return this.mUpdateRunCache.set(n.runner,p),p});return this.releaseUpdateChainCompleteHooks(e),e}catch(e){throw e instanceof re||this.releaseUpdateChainCompleteHooks(!1,e),e}finally{this.mUpdateStates.sync.running=!1}}},re=class extends Error{constructor(){super("Update resheduled")}};var be=class extends Xt{mUpdater;get updater(){return this.mUpdater}constructor(t){super(t),this.mUpdater=new ye({label:t.constructor.name,onUpdate:()=>this.onUpdate()})}call(t,...e){return this.mUpdater.executeInZone(()=>super.call(t,...e))}deconstruct(){this.mUpdater.deconstruct(),super.deconstruct()}createProcessor(){return this.mUpdater.executeInZone(()=>super.createProcessor())}};var $t=class{mExpression;mTemporaryValues;constructor(t,e,n){if(this.mTemporaryValues=new tt,n.length>0)for(let p of n)this.mTemporaryValues.set(p,void 0);this.mExpression=this.createEvaluationFunction(t,this.mTemporaryValues).bind(e.store)}execute(){return this.mExpression()}setTemporaryValue(t,e){if(!this.mTemporaryValues.has(t))throw new A(`Temporary value "${t}" does not exist for this procedure.`,this);this.mTemporaryValues.set(t,e)}createEvaluationFunction(t,e){let n,p=`__${Math.random().toString(36).substring(2)}`;if(n="return function () {",e.size>0)for(let g of e.keys())n+=`const ${g} = ${p}.get('${g}');`;return n+=`return ${t};`,n+="};",new Function(p,n)(e)}};var wt=class{mDataLevel;get data(){return this.mDataLevel}constructor(t){this.mDataLevel=t}createExpressionProcedure(t,e){return new $t(t,this.data,e??[])}setTemporaryValue(t,e){this.data.setTemporaryValue(t,e)}};var pt=class{mComponent;mDataProxy;mParentLevel;mTemporaryValues;get store(){return this.mDataProxy}constructor(t){this.mTemporaryValues=new tt,t instanceof z?(this.mParentLevel=null,this.mComponent=t):(this.mParentLevel=t,this.mComponent=t.mComponent),this.mDataProxy=this.createAccessProxy()}setTemporaryValue(t,e){this.mTemporaryValues.set(t,e)}updateLevelData(t){if(t.mParentLevel!==this.mParentLevel)throw new A("Can't update InstructionLevelData for a deeper level than it target data.",this);this.mTemporaryValues=t.mTemporaryValues}createAccessProxy(){return new Proxy(new Object,{get:(t,e)=>this.getValue(e),set:(t,e,n)=>(this.hasTemporaryValue(e)&&this.setTemporaryValue(e,n),e in this.mComponent.processor?(this.mComponent.processor[e]=n,!0):(this.setTemporaryValue(e,n),!0)),deleteProperty:()=>{throw new A("Deleting properties is not allowed",this)},ownKeys:()=>[...new Set([...Object.keys(this.mComponent.processor),...this.getTemporaryValuesList()])]})}getTemporaryValuesList(){let t=this.mTemporaryValues.map(e=>e);return this.mParentLevel&&t.push(...this.mParentLevel.getTemporaryValuesList()),t}getValue(t){if(this.mTemporaryValues.has(t))return this.mTemporaryValues.get(t);if(this.mParentLevel)return this.mParentLevel.getValue(t);if(t in this.mComponent.processor)return this.mComponent.processor[t]}hasTemporaryValue(t){return this.mTemporaryValues.has(t)?!0:this.mParentLevel?this.mParentLevel.hasTemporaryValue(t):!1}};var Vt=class h{mChildList;mInstruction;mInstructionType;get childList(){return this.mChildList}get instruction(){return this.mInstruction}get instructionType(){return this.mInstructionType}constructor(t,e){this.mChildList=Array(),this.mInstruction=e,this.mInstructionType=t}appendChild(...t){this.mChildList.push(...t)}clone(){let t=new h(this.instructionType,this.instruction);for(let e of this.mChildList)t.appendChild(e.clone());return t}equals(t){if(!(t instanceof h)||t.instruction!==this.instruction||t.instructionType!==this.instructionType||t.childList.length!==this.childList.length)return!1;for(let e=0;e<t.childList.length;e++)if(!t.childList[e].equals(this.childList[e]))return!1;return!0}removeChild(t){let e=this.mChildList.indexOf(t);if(e!==-1)return this.mChildList.splice(e,1)[0]}};var ft=class h{mExpression;get value(){return this.mExpression}constructor(t){this.mExpression=t}clone(){return new h(this.mExpression)}equals(t){return t instanceof h&&t.value===this.value}toString(){return`{{ ${this.mExpression} }}`}};var Dt=class h{mContainsExpression;mTextValue;mValues;get containsExpression(){return this.mContainsExpression}get values(){return this.mValues}constructor(){this.mTextValue="",this.mContainsExpression=!1,this.mValues=[]}addValue(...t){for(let e of t)(this.mContainsExpression===!0||e instanceof ft)&&(this.mContainsExpression=!0),this.mValues.push(e),this.mTextValue+=e.toString()}clone(){let t=new h;for(let e of this.values)typeof e=="string"?t.addValue(e):t.addValue(e.clone());return t}equals(t){if(!(t instanceof h)||t.values.length!==this.values.length)return!1;for(let e=0;e<this.values.length;e++){let n=this.values[e],p=t.values[e];if(n!==p&&(typeof n!=typeof p||typeof n=="string"&&n!==p||!p.equals(n)))return!1}return!0}toString(){return this.mTextValue}};var oe=class h{mName;mValue;get name(){return this.mName}get values(){return this.mValue}constructor(t){this.mName=t,this.mValue=new Dt}clone(){let t=new h(this.name);for(let e of this.values.values)typeof e=="string"?t.values.addValue(e):t.values.addValue(e.clone());return t}equals(t){return!(!(t instanceof h)||t.name!==this.name||!t.values.equals(this.values))}};var St=class h{mAttributeDictionary;mChildList;mTagName;get attributes(){return[...this.mAttributeDictionary.values()]}get childList(){return this.mChildList}get tagName(){return this.mTagName}constructor(t){this.mAttributeDictionary=new Map,this.mChildList=Array(),this.mTagName=t}appendChild(...t){this.mChildList.push(...t)}clone(){let t=new h(this.tagName);for(let e of this.mAttributeDictionary.values()){let n=t.setAttribute(e.name);for(let p of e.values.values)typeof p=="string"?n.addValue(p):n.addValue(p.clone())}for(let e of this.mChildList)t.appendChild(e.clone());return t}equals(t){if(!(t instanceof h)||t.tagName!==this.tagName||t.attributes.length!==this.mAttributeDictionary.size||t.childList.length!==this.mChildList.length)return!1;for(let e of t.mAttributeDictionary.values()){let n=this.mAttributeDictionary.get(e.name);if(!n||!n.equals(e))return!1}for(let e=0;e<t.childList.length;e++)if(!t.childList[e].equals(this.mChildList[e]))return!1;return!0}getAttribute(t){return this.mAttributeDictionary.get(t)?.values??null}removeAttribute(t){return this.mAttributeDictionary.delete(t)}removeChild(t){let e=this.mChildList.indexOf(t);if(e!==-1)return this.mChildList.splice(e,1)[0]}setAttribute(t){if(this.mAttributeDictionary.has(t))return this.mAttributeDictionary.get(t).values;let e=new oe(t);return this.mAttributeDictionary.set(t,e),e.values}};var lt=class h{mBodyElementList;get body(){return this.mBodyElementList}constructor(){this.mBodyElementList=new Array}appendChild(...t){this.mBodyElementList.push(...t)}clone(){let t=new h;for(let e of this.mBodyElementList)t.appendChild(e.clone());return t}equals(t){if(!(t instanceof h)||t.body.length!==this.mBodyElementList.length)return!1;for(let e=0;e<this.mBodyElementList.length;e++)if(!this.mBodyElementList[e].equals(t.body[e]))return!1;return!0}removeChild(t){let e=this.mBodyElementList.indexOf(t);if(e!==-1)return this.mBodyElementList.splice(e,1)[0]}};var nt=class{mComponentValues;mContent;mModules;mTemplate;get anchor(){return this.mContent.contentAnchor}get modules(){return this.mModules}get template(){return this.mTemplate}get values(){return this.mComponentValues}get content(){return this.mContent}constructor(t,e,n,p){this.mTemplate=t,this.mComponentValues=n,this.mContent=p,this.mModules=e,p.setCoreBuilder(this)}deconstruct(){this.content.deconstruct()}update(){let t=this.onUpdate(),e=!1,n=this.content.builders;if(n.length>0)for(let p=0;p<n.length;p++)e=n[p].update()||e;return t||e}createHtmlElement(t){let e=t.tagName;if(typeof e!="string")throw e;if(e.includes("-")){let p=globalThis.customElements.get(e);if(typeof p<"u")return new p}let n=t.getAttribute("xmlns");return n&&!n.containsExpression?document.createElementNS(n.values[0],e):document.createElement(e)}createTextNode(t){return document.createTextNode(t)}};var Yt=class{mChildBuilderList;mChildComponents;mContentAnchor;mContentBoundary;mLinkedContent;mRootChildList;get body(){return this.mRootChildList}get builders(){return this.mChildBuilderList}get contentAnchor(){return this.mContentAnchor}constructor(t){this.mChildBuilderList=new Array,this.mRootChildList=new Array,this.mChildComponents=new Map,this.mLinkedContent=new WeakSet,this.mContentAnchor=document.createComment(t),this.mContentBoundary={start:this.mContentAnchor,end:this.mContentAnchor}}deconstruct(){this.onDeconstruct();let t;for(;t=this.mChildBuilderList.pop();)t.deconstruct();for(let n of this.mChildComponents.values())n.deconstruct();this.mChildComponents.clear();let e;for(;e=this.mRootChildList.pop();)e instanceof nt||e.remove();this.contentAnchor.remove()}getBoundary(){let t=this.mContentBoundary.end instanceof nt?this.mContentBoundary.end.content.getBoundary().end:this.mContentBoundary.end;return{start:this.mContentBoundary.start,end:t}}insert(t,e,n){if(!this.mLinkedContent.has(n))throw new A("Can't add content to builder. Target is not part of builder.",this);let p=t instanceof nt?t.anchor:t;switch(e){case"After":{this.insertAfter(p,n);break}case"TopOf":{this.insertTop(p,n);break}case"BottomOf":{this.insertBottom(p,n);break}}this.mLinkedContent.add(t),t instanceof nt&&this.mChildBuilderList.push(t);let g=p.parentElement??p.getRootNode(),v=this.mContentAnchor.parentElement??this.mContentAnchor.getRootNode();if(g===v){let b=(()=>{switch(e){case"After":return this.mRootChildList.indexOf(n)+1;case"TopOf":return 0;case"BottomOf":return this.mRootChildList.length}})();b===this.mRootChildList.length&&(this.mContentBoundary.end=t),this.mRootChildList.splice(b+1,0,t)}}remove(t){if(!this.mLinkedContent.has(t))throw new A("Child node cant be deleted from builder when it not a child of them",this);if(this.mLinkedContent.delete(t),t instanceof nt){let n=this.mChildBuilderList.indexOf(t);n!==-1&&this.mChildBuilderList.splice(n,1),t.deconstruct()}else{let n=this.mChildComponents.get(t);n&&(n.deconstruct(),this.mChildComponents.delete(t)),t.remove()}let e=this.mRootChildList.indexOf(t);e!==-1&&(this.mRootChildList.splice(e,1),this.mContentBoundary.end=this.mRootChildList.at(-1)??this.mContentAnchor)}setCoreBuilder(t){this.mLinkedContent.add(t)}insertAfter(t,e){let n=e instanceof nt?e.content.getBoundary().end:e;(n.parentElement??n.getRootNode()).insertBefore(t,n.nextSibling)}insertBottom(t,e){if(e instanceof nt){this.insertAfter(t,e);return}if(e instanceof Element){e.appendChild(t);return}throw new A("Source node does not support child nodes.",this)}insertTop(t,e){if(e instanceof nt){this.insertAfter(t,e.anchor);return}if(e instanceof Element){e.prepend(t);return}throw new A("Source node does not support child nodes.",this)}};var we=class extends Yt{mAttributeModulesChangedOrder;mLinkedAttributeData;mLinkedAttributeExpressionModules;mLinkedAttributeModuleList;mLinkedExpressionModuleList;get linkedAttributeModules(){return this.mAttributeModulesChangedOrder&&(this.mAttributeModulesChangedOrder=!1,this.mLinkedAttributeModuleList.sort((t,e)=>t.accessMode-e.accessMode)),this.mLinkedAttributeModuleList}get linkedExpressionModules(){return this.mLinkedExpressionModuleList}constructor(t){super(t),this.mLinkedExpressionModuleList=new Array,this.mLinkedAttributeModuleList=new Array,this.mLinkedAttributeExpressionModules=new WeakMap,this.mLinkedAttributeData=new WeakMap,this.mAttributeModulesChangedOrder=!1}attributeOfLinkedExpressionModule(t){return this.mLinkedAttributeExpressionModules.get(t)}getLinkedAttributeData(t){if(!this.mLinkedAttributeData.has(t))throw new A("Attribute has no linked data.",this);return this.mLinkedAttributeData.get(t)}linkAttributeExpression(t,e){this.mLinkedAttributeExpressionModules.set(t,e)}linkAttributeModule(t){this.mLinkedAttributeModuleList.push(t),this.mAttributeModulesChangedOrder=!0}linkAttributeNodes(t,e,n){this.mLinkedAttributeData.set(t,{values:n,node:e})}linkExpressionModule(t){this.mLinkedExpressionModuleList.push(t)}onDeconstruct(){for(let t of this.mLinkedAttributeModuleList)t.deconstruct();for(let t of this.mLinkedExpressionModuleList)t.deconstruct()}};var xe=class extends Yt{mInstructionModule;get instructionModule(){return this.mInstructionModule}constructor(t,e){super(e),this.mInstructionModule=t}onDeconstruct(){this.mInstructionModule.deconstruct()}};var Te=class extends nt{constructor(t,e,n){let p=e.createInstructionModule(t,n);super(t,e,n,new xe(p,`Instruction - {$${t.instructionType}}`))}onUpdate(){if(this.content.instructionModule.update()){let t=this.content.body;this.updateStaticBuilder(t,this.content.instructionModule.instructionResult.elementList)}return!1}insertNewContent(t,e){let n=new Wt(t.template,this.modules,t.dataLevel,`Child - {$${this.template.instructionType}}`);return e===null?this.content.insert(n,"TopOf",this):this.content.insert(n,"After",e),n}updateStaticBuilder(t,e){let p=new Jt((b,S)=>S.template.equals(b.template)).differencesOf(t,e),g=0,v=null;for(let b=0;b<p.length;b++){let S=p[b];if(S.changeState===xt.Remove)this.content.remove(S.item);else if(S.changeState===xt.Insert)v=this.insertNewContent(S.item,v),g++;else{let C=e[g].dataLevel;S.item.values.updateLevelData(C),v=S.item,g++}}}};var Wt=class extends nt{mInitialized;constructor(t,e,n,p){super(t,e,n,new we(`Static - {${p}}`)),this.mInitialized=!1}onUpdate(){this.mInitialized||(this.mInitialized=!0,this.buildTemplate([this.template],this));let t=!1,e=this.content.linkedAttributeModules;for(let g=0;g<e.length;g++)t=e[g].update()||t;let n=!1,p=this.content.linkedExpressionModules;for(let g=0;g<p.length;g++){let v=p[g];if(v.update()){n=!0;let b=this.content.attributeOfLinkedExpressionModule(v);if(!b)continue;let S=this.content.getLinkedAttributeData(b),C=S.values.reduce((a,o)=>a+o.data,"");S.node.setAttribute(b.name,C)}}return t||n}buildInstructionTemplate(t,e){this.content.insert(new Te(t,this.modules,new pt(this.values)),"BottomOf",e)}buildStaticTemplate(t,e){let n=this.createHtmlElement(t);this.content.insert(n,"BottomOf",e);for(let p of t.attributes){let g=this.modules.createAttributeModule(p,n,this.values);if(g){this.content.linkAttributeModule(g);continue}if(p.values.containsExpression){let v=new Array;for(let b of p.values.values){let S=this.createTextNode("");if(v.push(S),!(b instanceof ft)){S.data=b;continue}let C=this.modules.createExpressionModule(b,S,this.values);this.content.linkExpressionModule(C),this.content.linkAttributeExpression(C,p)}this.content.linkAttributeNodes(p,n,v);continue}n.setAttribute(p.name,p.values.toString())}this.content.insert(n,"BottomOf",e),this.buildTemplate(t.childList,n)}buildTemplate(t,e){for(let n of t)n instanceof lt?this.buildTemplate(n.body,e):n instanceof Dt?this.buildTextTemplate(n,e):n instanceof Vt?this.buildInstructionTemplate(n,e):n instanceof St&&this.buildStaticTemplate(n,e)}buildTextTemplate(t,e){for(let n of t.values){if(typeof n=="string"){this.content.insert(this.createTextNode(n),"BottomOf",e);continue}let p=this.createTextNode("");this.content.insert(p,"BottomOf",e);let g=this.modules.createExpressionModule(n,p,this.values);this.content.linkExpressionModule(g)}}};var ne=class{mHtmlElement;mShadowRoot;get htmlElement(){return this.mHtmlElement}get shadowRoot(){return this.mShadowRoot}constructor(t){this.mHtmlElement=t,this.mShadowRoot=this.mHtmlElement.attachShadow({mode:"open"})}};var H=class{mDataLevel;get data(){return this.mDataLevel}constructor(t){this.mDataLevel=t}createExpressionProcedure(t,e){return new $t(t,this.data,e??[])}};var Ot=class extends Xt{constructor(t){super({constructor:t.constructor,parent:t.parent}),this.setProcessorInjection(H,new H(t.values))}deconstruct(){super.deconstruct(),this.call("onDeconstruct")}update(){return this.onUpdate()}};var k=class{mValue;get value(){return this.mValue}constructor(t){this.mValue=t}};var q=class{constructor(){throw new A("Reference should not be instanced.",this)}};var dt=class{constructor(){throw new A("Reference should not be instanced.",this)}};var _t=class h extends Ot{mLastResult;mTargetTextNode;constructor(t){super({constructor:t.constructor,parent:t.parent,values:t.values}),this.mTargetTextNode=t.targetNode,this.mLastResult=null,this.setProcessorInjection(h,this),this.setProcessorInjection(dt,t.targetTemplate.clone()),this.setProcessorInjection(q,t.targetNode),this.setProcessorInjection(k,new k(t.targetTemplate.value))}onUpdate(){let t=this.call("onUpdate");t===null&&(t="");let e=this.mLastResult===null||this.mLastResult!==t;if(e){let n=this.mTargetTextNode;n.data=t,this.mLastResult=t}return e}};function Xe(){return(h,t)=>{O.registerInjectable(h,t.metadata,"instanced"),at.register(_t,h,{})}}function Li(){function h(a,o){return function(l){e(o,"addInitializer"),n(l,"An initializer"),a.push(l)}}function t(a,o,c,l,r,y,f,T,w){var d;switch(r){case 1:d="accessor";break;case 2:d="method";break;case 3:d="getter";break;case 4:d="setter";break;default:d="field"}var s={kind:d,name:f?"#"+o:o,static:y,private:f,metadata:T},m={v:!1};s.addInitializer=h(l,m);var i,u;r===0?f?(i=c.get,u=c.set):(i=function(){return this[o]},u=function(x){this[o]=x}):r===2?i=function(){return c.value}:((r===1||r===3)&&(i=function(){return c.get.call(this)}),(r===1||r===4)&&(u=function(x){c.set.call(this,x)})),s.access=i&&u?{get:i,set:u}:i?{get:i}:{set:u};try{return a(w,s)}finally{m.v=!0}}function e(a,o){if(a.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(a,o){if(typeof a!="function")throw new TypeError(o+" must be a function")}function p(a,o){var c=typeof o;if(a===1){if(c!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(c!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function g(a,o,c,l,r,y,f,T,w){var d=c[0],s,m,i;f?r===0||r===1?s={get:c[3],set:c[4]}:r===3?s={get:c[3]}:r===4?s={set:c[3]}:s={value:c[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,l)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var u,x,I;if(typeof d=="function")u=t(d,l,s,T,r,y,f,w,i),u!==void 0&&(p(r,u),r===0?m=u:r===1?(m=u.init,x=u.get||i.get,I=u.set||i.set,i={get:x,set:I}):i=u);else for(var P=d.length-1;P>=0;P--){var M=d[P];if(u=t(M,l,s,T,r,y,f,w,i),u!==void 0){p(r,u);var N;r===0?N=u:r===1?(N=u.init,x=u.get||i.get,I=u.set||i.set,i={get:x,set:I}):i=u,N!==void 0&&(m===void 0?m=N:typeof m=="function"?m=[m,N]:m.push(N))}}if(r===0||r===1){if(m===void 0)m=function(D,E){return E};else if(typeof m!="function"){var _=m;m=function(D,E){for(var R=E,L=0;L<_.length;L++)R=_[L].call(D,R);return R}}else{var $=m;m=function(D,E){return $.call(D,E)}}a.push(m)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),f?r===1?(a.push(function(D,E){return i.get.call(D,E)}),a.push(function(D,E){return i.set.call(D,E)})):r===2?a.push(i):a.push(function(D,E){return i.call(D,E)}):Object.defineProperty(o,l,s))}function v(a,o,c){for(var l=[],r,y,f=new Map,T=new Map,w=0;w<o.length;w++){var d=o[w];if(Array.isArray(d)){var s=d[1],m=d[2],i=d.length>3,u=s>=5,x,I;if(u?(x=a,s=s-5,y=y||[],I=y):(x=a.prototype,r=r||[],I=r),s!==0&&!i){var P=u?T:f,M=P.get(m)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+m);!M&&s>2?P.set(m,s):P.set(m,!0)}g(l,x,d,m,s,u,i,I,c)}}return b(l,r),b(l,y),l}function b(a,o){o&&a.push(function(c){for(var l=0;l<o.length;l++)o[l].call(c);return c})}function S(a,o,c){if(o.length>0){for(var l=[],r=a,y=a.name,f=o.length-1;f>=0;f--){var T={v:!1};try{var w=o[f](r,{kind:"class",name:y,addInitializer:h(l,T),metadata:c})}finally{T.v=!0}w!==void 0&&(p(10,w),r=w)}return[C(r,c),function(){for(var d=0;d<l.length;d++)l[d].call(r)}]}}function C(a,o){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,c,l,r){if(r!==void 0)var y=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var f=Object.create(y===void 0?null:y),T=v(o,c,f);return l.length||C(o,f),{e:T,get c(){return S(o,l,f)}}}}function rr(h,t,e,n){return(rr=Li())(h,t,e,n)}var or,tr,Ye;or=Xe();var er=class{static{({c:[Ye,tr]}=rr(this,[],[or]))}constructor(t=O.use(H),e=O.use(k)){this.mProcedure=t.createExpressionProcedure(e.value)}mProcedure;onUpdate(){let t=this.mProcedure.execute();return typeof t>"u"?null:t?.toString()}static{tr()}};var rt=class{mName;mValue;get name(){return this.mName}get value(){return this.mValue}constructor(t,e){this.mName=t,this.mValue=e}};var gt=class h extends Ot{mAccessMode;get accessMode(){return this.mAccessMode}constructor(t){super({constructor:t.constructor,parent:t.parent,values:t.values}),this.mAccessMode=t.accessMode,this.setProcessorInjection(h,this),this.setProcessorInjection(dt,t.targetTemplate.clone()),this.setProcessorInjection(q,t.targetNode),this.setProcessorInjection(rt,new rt(t.targetTemplate.name,t.targetTemplate.values.toString()))}onUpdate(){return this.call("onUpdate")??!1}};var ct=class{mElementList;mTemplates;mDataLevels;get elementList(){return this.mElementList}constructor(){this.mElementList=new Array,this.mTemplates=new Set,this.mDataLevels=new Set}addElement(t,e){if(this.mTemplates.has(t)||this.mDataLevels.has(e))throw new A("Can't add same template or values for multiple Elements.",this);this.mTemplates.add(t),this.mDataLevels.add(e),this.mElementList.push({template:t,dataLevel:e})}};var Ft=class h extends Ot{mLastResult;get instructionResult(){return this.mLastResult}constructor(t){super({constructor:t.constructor,parent:t.parent,values:t.values}),this.setProcessorInjection(h,this),this.setProcessorInjection(dt,t.targetTemplate.clone()),this.setProcessorInjection(k,new k(t.targetTemplate.instruction)),this.mLastResult=new ct}onUpdate(){let t=this.call("onUpdate");return t instanceof ct?(this.mLastResult=t,!0):!1}};var Ee=class h{static mAttributeModuleCache=new tt;static mExpressionModuleCache=new WeakMap;static mInstructionModuleCache=new tt;mComponent;mExpressionModule;constructor(t,e){this.mExpressionModule=e??Ye,this.mComponent=t}createAttributeModule(t,e,n){let p=(()=>{let g=h.mAttributeModuleCache.get(t.name);if(g||g===null)return g;for(let v of at.get(gt))if(v.processorConfiguration.selector.test(t.name))return h.mAttributeModuleCache.set(t.name,v),v;return h.mAttributeModuleCache.set(t.name,null),null})();return p===null?null:new gt({accessMode:p.processorConfiguration.access,constructor:p.processorConstructor,parent:this.mComponent,targetNode:e,targetTemplate:t,values:n}).setup()}createExpressionModule(t,e,n){let p=(()=>{let g=h.mExpressionModuleCache.get(this.mExpressionModule);if(g)return g;let v=at.get(_t).find(b=>b.processorConstructor===this.mExpressionModule);if(!v)throw new A("An expression module could not be found.",this);return h.mExpressionModuleCache.set(this.mExpressionModule,v),v})();return new _t({constructor:p.processorConstructor,parent:this.mComponent,targetNode:e,targetTemplate:t,values:n}).setup()}createInstructionModule(t,e){let n=(()=>{let p=h.mInstructionModuleCache.get(t.instructionType);if(p)return p;for(let g of at.get(Ft))if(g.processorConfiguration.instructionType===t.instructionType)return h.mInstructionModuleCache.set(t.instructionType,g),g;throw new A(`Instruction module type "${t.instructionType}" not found.`,this)})();return new Ft({constructor:n.processorConstructor,parent:this.mComponent,targetTemplate:t,values:e}).setup()}};var zt=class extends A{mColumnEnd;mColumnStart;mLineEnd;mLineStart;get columnEnd(){return this.mColumnEnd}get columnStart(){return this.mColumnStart}get lineEnd(){return this.mLineEnd}get lineStart(){return this.mLineStart}constructor(t,e,n,p,g,v,b){super(t,e,b),this.mColumnStart=n,this.mLineStart=p,this.mColumnEnd=g,this.mLineEnd=v}};var Zt=class{mDependencyFetch;mDependencyFetchResolved;mLexer;mMeta;mPattern;mPatternDependencies;mType;get dependencies(){return this.mPatternDependencies}get dependenciesResolved(){return this.mDependencyFetchResolved}get lexer(){return this.mLexer}get meta(){return this.mMeta}get pattern(){return this.mPattern}constructor(t,e){if(this.mLexer=t,this.mType=e.type,this.mMeta=e.metadata,this.mPatternDependencies=new Array,this.mDependencyFetch=e.dependencyFetch??null,this.mDependencyFetchResolved=!e.dependencyFetch,this.mType==="split"&&!this.mDependencyFetch)throw new A("Split token with a start and end token, need inner token definitions.",this);if(this.mType==="single"&&this.mDependencyFetch)throw new A("Pattern does not allow inner token pattern.",this);this.mPattern=this.convertTokenPattern(this.mType,e.pattern)}isSplit(){return this.mType==="split"}resolveDependencies(){this.mDependencyFetchResolved||(this.mDependencyFetch(this),this.mDependencyFetchResolved=!0)}useChildPattern(t){if(this.mLexer!==t.lexer)throw new A("Can only add dependencies of the same lexer.",this);this.mPatternDependencies.push(t)}convertTokenPattern(t,e){if("single"in e){if(t==="split")throw new A("Can't use split pattern type with single pattern definition.",this);return{start:{regex:e.single.regex,types:e.single.types,validator:e.single.validator??null}}}else{if(t==="single")throw new A("Can't use single pattern type with split pattern definition.",this);return{start:{regex:e.start.regex,types:e.start.types,validator:e.start.validator??null},end:{regex:e.end.regex,types:e.end.types,validator:e.end.validator??null},innerType:e.innerType??null}}}};var qt=class{mColumnNumber;mLineNumber;mMetas;mType;mValue;get columnNumber(){return this.mColumnNumber}get lineNumber(){return this.mLineNumber}get metas(){return[...this.mMetas]}get type(){return this.mType}get value(){return this.mValue}constructor(t,e,n,p){this.mValue=e,this.mColumnNumber=n,this.mLineNumber=p,this.mType=t,this.mMetas=new Set}addMeta(...t){for(let e of t)this.mMetas.add(e)}hasMeta(t){return this.mMetas.has(t)}};var ie=class{mRootPattern;mSettings;get errorType(){return this.mSettings.errorType}set errorType(t){this.mSettings.errorType=t}get trimWhitespace(){return this.mSettings.trimSpaces}set trimWhitespace(t){this.mSettings.trimSpaces=t}get validWhitespaces(){return[...this.mSettings.whiteSpaces].join("")}set validWhitespaces(t){this.mSettings.whiteSpaces=new Set(t.split(""))}constructor(){this.mSettings={errorType:null,trimSpaces:!0,whiteSpaces:new Set},this.mRootPattern=new Zt(this,{type:"single",pattern:{single:{regex:/^/,types:{},validator:null}},metadata:[],dependencyFetch:null})}createTokenPattern(t,e){let n=b=>typeof b=="string"?{token:b}:b,p=b=>{let S=new Set(b.flags.split(""));return new RegExp(`^(?<token>${b.source})`,[...S].join(""))},g=new Array;t.meta&&(typeof t.meta=="string"?g.push(t.meta):g.push(...t.meta));let v;return"regex"in t.pattern?v={single:{regex:p(t.pattern.regex),types:n(t.pattern.type),validator:t.pattern.validator??null}}:v={start:{regex:p(t.pattern.start.regex),types:n(t.pattern.start.type),validator:t.pattern.start.validator??null},end:{regex:p(t.pattern.end.regex),types:n(t.pattern.end.type),validator:t.pattern.end.validator??null},innerType:t.pattern.innerType??null},new Zt(this,{type:"regex"in t.pattern?"single":"split",pattern:v,metadata:g,dependencyFetch:e??null})}*tokenize(t,e){let n={data:t,cursor:{position:0,column:1,line:1},error:null,progressTracker:e??null};yield*this.tokenizeRecursionLayer(n,this.mRootPattern,new Array,null)}useRootTokenPattern(t){if(t.lexer!==this)throw new A("Token pattern must be created by this lexer.",this);this.mRootPattern.useChildPattern(t)}findNextStartToken(t,e,n,p){for(let g of e){let v=g.pattern.start,b=this.matchToken(g,v,t,n,p);if(b!==null)return{pattern:g,token:b}}return null}findTokenTypeOfMatch(t,e,n){for(let v in t.groups){let b=t.groups[v],S=e[v];if(!(!b||!S)){if(b.length!==t[0].length)throw new A("A group of a token pattern must match the whole token.",this);return S}}let p=new Array;for(let v in t.groups)t.groups[v]&&p.push(v);let g=new Array;for(let v in e)g.push(v);throw new A(`No token type found for any defined pattern regex group. Full: "${t[0]}", Matches: "${p.join(", ")}", Available: "${g.join(", ")}", Regex: "${n.source}"`,this)}*generateErrorToken(t,e){if(!t.error||!this.mSettings.errorType)return;let n=new qt(this.mSettings.errorType,t.error.data,t.error.startColumn,t.error.startLine);n.addMeta(...e),t.error=null,yield n}generateToken(t,e,n,p,g,v){let b=n[0],S=this.findTokenTypeOfMatch(n,p,v),C=new qt(g??S,b,t.cursor.column,t.cursor.line);return C.addMeta(...e),C}matchToken(t,e,n,p,g){let v=e.regex;v.lastIndex=0;let b=v.exec(n.data);if(!b||b.index!==0)return null;let S=this.generateToken(n,[...p,...t.meta],b,e.types,g,v);if(e.validator){let C=n.data.substring(S.value.length);if(!e.validator(S,C,n.cursor.position))return null}return this.moveCursor(n,S.value),S}moveCursor(t,e){let n=e.split(`
`);n.length>1&&(t.cursor.column=1),t.cursor.line+=n.length-1,t.cursor.column+=n.at(-1).length,t.cursor.position+=e.length,t.data=t.data.substring(e.length),this.trackProgress(t)}pushNextCharToErrorState(t){if(!this.mSettings.errorType)throw new zt(`Unable to parse next token. No valid pattern found for "${t.data.substring(0,20)}".`,this,t.cursor.column,t.cursor.line,t.cursor.column,t.cursor.line);t.error||(t.error={data:"",startColumn:t.cursor.column,startLine:t.cursor.line});let e=t.data.charAt(0);t.error.data+=e,this.moveCursor(t,e)}skipNextWhitespace(t){let e=t.data.charAt(0);return!this.mSettings.trimSpaces||!this.mSettings.whiteSpaces.has(e)?!1:(this.moveCursor(t,e),!0)}*tokenizeRecursionLayer(t,e,n,p){let g=e.dependencies;for(;t.data.length>0;){if(!t.error&&this.skipNextWhitespace(t))continue;if(e.isSplit()){let S=this.matchToken(e,e.pattern.end,t,n,p);if(S!==null){yield*this.generateErrorToken(t,n),yield S;return}}let v=this.findNextStartToken(t,g,n,p);if(!v){this.pushNextCharToErrorState(t);continue}yield*this.generateErrorToken(t,n),yield v.token;let b=v.pattern;b.isSplit()&&(b.resolveDependencies(),yield*this.tokenizeRecursionLayer(t,b,[...n,...b.meta],p??b.pattern.innerType))}yield*this.generateErrorToken(t,n)}trackProgress(t){t.progressTracker!==null&&t.progressTracker(t.cursor.position,t.cursor.line,t.cursor.column)}};var W=class extends Error{static PARSER_ERROR=Symbol("PARSER_ERROR");mTrace;get columnEnd(){return this.mTrace.top.range.columnEnd}get columnStart(){return this.mTrace.top.range.columnStart}get graph(){return this.mTrace.top.graph}get incidents(){return this.mTrace.incidents}get lineEnd(){return this.mTrace.top.range.lineEnd}get lineStart(){return this.mTrace.top.range.lineStart}constructor(t){super(t.top.message,{cause:t.top.cause}),this.mTrace=t}};var De=class{mIncidents;mTop;get incidents(){if(this.mIncidents===null)throw new A("A complete incident list is only available on debug mode.",this);return this.mIncidents}get top(){return this.mTop}constructor(t){this.mTop={message:"Unknown parser error",priority:0,graph:null,range:{lineStart:1,columnStart:1,lineEnd:1,columnEnd:1},cause:null},t?this.mIncidents=new Array:this.mIncidents=null}push(t,e,n,p,g,v,b=!1,S=null){let C;if(b?C=this.mTop.priority+1:C=g*1e4+v,this.mIncidents!==null){let a={message:t,priority:C,graph:e,range:{lineStart:n,columnStart:p,lineEnd:g,columnEnd:v},cause:S};this.mIncidents.push(a)}this.mTop&&C<this.mTop.priority||this.setTop({message:t,priority:C,graph:e,range:{lineStart:n,columnStart:p,lineEnd:g,columnEnd:v},cause:S})}setTop(t){this.mTop=t}};var Se=class h{static MAX_JUNCTION_CIRCULAR_REFERENCES=1e3;mGraphStack;mIncidentTrace;mLastTokenPosition;mProcessStack;mTokenCache;mTokenGenerator;mTrimTokenCache;get currentGraph(){return this.mGraphStack.top.graph}get currentToken(){let t=this.mGraphStack.top;return this.mTokenCache[t.token.cursor]}get incidentTrace(){return this.mIncidentTrace}get processStack(){return this.mProcessStack}constructor(t,e,n){this.mTokenGenerator=t,this.mGraphStack=new Pt,this.mLastTokenPosition={column:1,line:1},this.mTokenCache=new Array,this.mProcessStack=new Pt,this.mTrimTokenCache=n,this.mIncidentTrace=new De(e),this.mGraphStack.push({graph:null,linear:!0,circularGraphs:new tt,token:{start:0,cursor:-1}})}collapse(){let t=this.mGraphStack.top,e=this.mTokenCache.slice(t.token.cursor);e.length!==0&&e.at(-1)===null&&e.pop();for(let n of this.mTokenGenerator)e.push(n);return e}getGraphBoundingToken(){let t=this.mGraphStack.top,e=this.mTokenCache[t.token.start],n=this.mTokenCache[t.token.cursor-1];return e??=n,n??=e,[e??null,n??null]}getGraphPosition(){let t=this.mGraphStack.top,e,n;if(e=this.mTokenCache[t.token.start],n=this.mTokenCache[t.token.cursor-1],e??=n,n??=e,!e||!n)return{graph:t.graph,columnEnd:this.mLastTokenPosition.column,columnStart:this.mLastTokenPosition.column,lineEnd:this.mLastTokenPosition.line,lineStart:this.mLastTokenPosition.line};let p,g;if(n.value.includes(`
`)){let v=n.value.split(`
`);g=n.lineNumber+v.length-1,p=1+v[v.length-1].length}else p=n.columnNumber+n.value.length,g=n.lineNumber;return{graph:t.graph,lineStart:e.lineNumber,columnStart:e.columnNumber,lineEnd:g,columnEnd:p}}getTokenPosition(){let t=this.mGraphStack.top,e=this.currentToken;if(!e)return{graph:t.graph,columnEnd:this.mLastTokenPosition.column,columnStart:this.mLastTokenPosition.column,lineEnd:this.mLastTokenPosition.line,lineStart:this.mLastTokenPosition.line};let n,p;if(e.value.includes(`
`)){let g=e.value.split(`
`);p=e.lineNumber+g.length-1,n=1+g[g.length-1].length}else n=e.columnNumber+e.value.length,p=e.lineNumber;return{graph:t.graph,lineStart:e.lineNumber,columnStart:e.columnNumber,lineEnd:p,columnEnd:n}}graphIsCircular(t){let e=this.mGraphStack.top;if(!e.circularGraphs.has(t))return!1;if(t.isJunction){if(e.circularGraphs.get(t)>h.MAX_JUNCTION_CIRCULAR_REFERENCES)throw new A("Junction graph called circular too often.",this);return!1}return!0}moveNextToken(){let t=this.mGraphStack.top;if(t.circularGraphs.size>0&&(t.circularGraphs=new tt),t.graph&&t.graph.isJunction)throw new A("Junction graph must not have own nodes.",this);if(t.token.cursor++,t.token.cursor<this.mTokenCache.length)return;let e=this.mTokenGenerator.next();if(e.done){this.mTokenCache.push(null);return}this.mLastTokenPosition.column=e.value.columnNumber,this.mLastTokenPosition.line=e.value.lineNumber,this.mTokenCache.push(e.value)}popGraphStack(t){let e=this.mGraphStack.pop(),n=this.mGraphStack.top;if(t&&(e.token.cursor=e.token.start),e.token.cursor!==e.token.start&&n.circularGraphs.size>0&&(n.circularGraphs=new tt),!this.mTrimTokenCache){n.token.cursor=e.token.cursor;return}e.linear?(this.mTokenCache.splice(0,e.token.cursor),n.token.start=0,n.token.cursor=0):n.token.cursor=e.token.cursor}pushGraphStack(t,e){let n=this.mGraphStack.top,p={graph:t,linear:e&&n.linear,circularGraphs:new tt(n.circularGraphs),token:{start:n.token.cursor,cursor:n.token.cursor}},g=p.circularGraphs.get(t)??0;p.circularGraphs.set(t,g+1),this.mGraphStack.push(p)}};var se=class h{static NODE_NULL_RESULT=Symbol("FAILED_NODE_VALUE_PARSE");static NODE_VALUE_LIST_END_MEET=Symbol("FAILED_NODE_VALUE_PARSE");mConfiguration;mLexer;mRootPart;get lexer(){return this.mLexer}constructor(t,e){this.mLexer=t,this.mRootPart=null,this.mConfiguration={keepTraceIncidents:!1,trimTokenCache:!1,...e}}parse(t,e){if(this.mRootPart===null)throw new A("Parser has not root part set.",this);let n=new Se(this.mLexer.tokenize(t,e),this.mConfiguration.keepTraceIncidents,this.mConfiguration.trimTokenCache),p=(()=>{try{return this.beginParseProcess(n,this.mRootPart)}catch(v){if(v instanceof zt)return n.incidentTrace.push(v.message,n.currentGraph,v.lineStart,v.columnStart,v.lineEnd,v.columnEnd,!0,v),W.PARSER_ERROR;let b=v instanceof Error?v.message:v.toString(),S=n.getGraphPosition();return n.incidentTrace.push(b,n.currentGraph,S.lineStart,S.columnStart,S.lineEnd,S.columnEnd,!0,v),W.PARSER_ERROR}})();if(p===W.PARSER_ERROR)throw new W(n.incidentTrace);let g=n.collapse();if(g.length!==0){let v=g[0];if(n.incidentTrace.top.range.lineEnd===1&&n.incidentTrace.top.range.columnEnd===1){let b=`Tokens could not be parsed. Graph end meet without reaching last token. Current: "${v.value}" (${v.type})`;n.incidentTrace.push(b,this.mRootPart,v.lineNumber,v.columnNumber,v.lineNumber,v.columnNumber)}throw new W(n.incidentTrace)}return p}setRootGraph(t){this.mRootPart=t}beginParseProcess(t,e){t.moveNextToken(),t.processStack.push({type:"graph-parse",parameter:{graph:e,linear:!0},state:0});let n=h.NODE_NULL_RESULT;for(;t.processStack.top;)n=this.processStack(t,t.processStack.top,n);return n}processChainedNodeParseProcess(t,e,n){switch(e.state){case 0:{let v=e.parameter.node.connections.next;return v===null?(t.processStack.pop(),{}):(e.state++,t.processStack.push({type:"node-parse",parameter:{node:v},state:0,values:{}}),h.NODE_NULL_RESULT)}case 1:{let p=n;return p===W.PARSER_ERROR?(t.processStack.pop(),W.PARSER_ERROR):(t.processStack.pop(),p)}}throw new A(`Invalid node next parse state "${e.state}".`,this)}processGraphParseProcess(t,e,n){let p=e.parameter.graph;switch(e.state){case 0:{if(t.graphIsCircular(p)){let v=t.getGraphPosition();return t.incidentTrace.push("Circular graph detected.",p,v.lineStart,v.columnStart,v.lineEnd,v.columnEnd),t.processStack.pop(),W.PARSER_ERROR}let g=e.parameter.linear;return t.pushGraphStack(p,g),e.state++,t.processStack.push({type:"node-parse",parameter:{node:p.node},state:0,values:{}}),h.NODE_NULL_RESULT}case 1:{let g=n;if(g===W.PARSER_ERROR)return t.popGraphStack(!0),t.processStack.pop(),W.PARSER_ERROR;let v=p.convert(g,t);if(typeof v=="symbol"){let b=t.getGraphPosition();return t.incidentTrace.push(v.description??"Unknown data convert error",b.graph,b.lineStart,b.columnStart,b.lineEnd,b.columnEnd),t.popGraphStack(!0),t.processStack.pop(),W.PARSER_ERROR}return t.popGraphStack(!1),t.processStack.pop(),v}}throw new A(`Invalid graph parse state "${e.state}".`,this)}processNodeParseProcess(t,e,n){let p=e.parameter.node;switch(e.state){case 0:return t.processStack.push({type:"node-value-parse",parameter:{node:p,valueIndex:0},state:0,values:{}}),e.state++,h.NODE_NULL_RESULT;case 1:{let g=n;return g===W.PARSER_ERROR?(t.processStack.pop(),W.PARSER_ERROR):(e.values.nodeValueResult=g,t.processStack.push({type:"node-next-parse",parameter:{node:p},state:0}),e.state++,h.NODE_NULL_RESULT)}case 2:{let g=n;if(g===W.PARSER_ERROR)return t.processStack.pop(),W.PARSER_ERROR;let v=p.mergeData(e.values.nodeValueResult,g);return t.processStack.pop(),v}}throw new A(`Invalid node parse state "${e.state}".`,this)}processNodeValueParseProcess(t,e,n){let p=e.parameter.node;switch(e.state){case 0:{if(n!==h.NODE_NULL_RESULT&&n!==W.PARSER_ERROR)return e.values.parseResult=n,e.state++,h.NODE_NULL_RESULT;let g=e.parameter.valueIndex,v=p.connections;if(g>=v.values.length)return e.values.parseResult=h.NODE_VALUE_LIST_END_MEET,e.state++,h.NODE_NULL_RESULT;e.parameter.valueIndex++;let b=t.currentToken,S=v.values[g];if(typeof S=="string"){if(!b){if(v.required){let C=t.getTokenPosition();t.incidentTrace.push(`Unexpected end of statement. Token "${S}" expected.`,t.currentGraph,C.lineStart,C.columnStart,C.lineEnd,C.columnEnd)}return h.NODE_NULL_RESULT}if(S!==b.type){if(v.required){let C=t.getTokenPosition();t.incidentTrace.push(`Unexpected token "${b.value}". "${S}" expected`,t.currentGraph,C.lineStart,C.columnStart,C.lineEnd,C.columnEnd)}return h.NODE_NULL_RESULT}return t.moveNextToken(),b.value}else{let C=v.values.length===1||v.values.length===g+1;return t.processStack.push({type:"graph-parse",parameter:{graph:S,linear:C},state:0}),h.NODE_NULL_RESULT}}case 1:{let g=e.values.parseResult,v=p.connections;if(g===h.NODE_VALUE_LIST_END_MEET&&!v.required){t.processStack.pop();return}return g===h.NODE_VALUE_LIST_END_MEET?(t.processStack.pop(),W.PARSER_ERROR):(t.processStack.pop(),g)}}throw new A(`Invalid node value parse state "${e.state}".`,this)}processStack(t,e,n){switch(e.type){case"graph-parse":return this.processGraphParseProcess(t,e,n);case"node-parse":return this.processNodeParseProcess(t,e,n);case"node-value-parse":return this.processNodeValueParseProcess(t,e,n);case"node-next-parse":return this.processChainedNodeParseProcess(t,e,n)}}};var J=class h{static define(t,e=!1){return new h(t,e)}mDataConverterList;mGraphCollector;mIsJunction;mResolvedGraphNode;get isJunction(){return this.mIsJunction}get node(){return this.mResolvedGraphNode||(this.mResolvedGraphNode=this.mGraphCollector().root),this.mResolvedGraphNode}constructor(t,e){this.mGraphCollector=t,this.mDataConverterList=new Array,this.mResolvedGraphNode=null,this.mIsJunction=e}convert(t,e){if(this.mDataConverterList.length===0)return t;let n=e.getGraphBoundingToken(),p=n[0]??void 0,g=n[1]??void 0;if(this.mDataConverterList.length===1)return this.mDataConverterList[0](t,p,g);let v=t;for(let b of this.mDataConverterList)if(v=b(v,p,g),typeof v=="symbol")return v;return v}converter(t){let e=new h(this.mGraphCollector,this.isJunction);return e.mDataConverterList.push(...this.mDataConverterList,t),e}};var G=class h{static new(){let t=new h("",!1,[]);return t.mRootNode=null,t}mConnections;mIdentifier;mRootNode;get configuration(){return{dataKey:this.mIdentifier.dataKey,isList:this.mIdentifier.type==="list",isRequired:this.mConnections.required,isBranch:this.mConnections.values.length>1}}get connections(){return this.mConnections}get root(){if(!this.mRootNode)throw new A("Staring nodes must be chained with another node to be used.",this);return this.mRootNode}constructor(t,e,n,p){if(t==="")this.mIdentifier={type:"empty",dataKey:"",mergeKey:""};else if(t.endsWith("[]"))this.mIdentifier={type:"list",mergeKey:"",dataKey:t.substring(0,t.length-2)};else if(t.includes("<-")){let v=t.split("<-");this.mIdentifier={type:"merge",dataKey:v[0],mergeKey:v[1]}}else this.mIdentifier={type:"single",mergeKey:"",dataKey:t};let g=n.map(v=>v instanceof h?J.define(()=>v):v);this.mConnections={required:e,values:g,next:null},p?this.mRootNode=p:this.mRootNode=this}mergeData(t,e){if(this.mIdentifier.type==="empty")return e;let n=e,p=typeof t>"u";if(this.mIdentifier.type==="single"){if(this.mIdentifier.dataKey in e)throw new A(`Graph path has a duplicate value identifier "${this.mIdentifier.dataKey}"`,this);return p||(n[this.mIdentifier.dataKey]=t),e}if(this.mIdentifier.type==="list"){let b;p?b=new Array:Array.isArray(t)?b=t:b=[t];let S=(()=>{if(this.mIdentifier.dataKey in e){let C=n[this.mIdentifier.dataKey];return Array.isArray(C)?(C.unshift(...b),C):(b.push(C),b)}return b})();return n[this.mIdentifier.dataKey]=S,e}if(p)return e;let g=(()=>{if(!this.mIdentifier.mergeKey)throw new A("Cant merge data without a merge key.",this);if(typeof t!="object"||t===null)throw new A("Node data must be an object when merge key is set.",this);if(!(this.mIdentifier.mergeKey in t))throw new A(`Node data does not contain merge key "${this.mIdentifier.mergeKey}"`,this);return t[this.mIdentifier.mergeKey]})();if(typeof g>"u")return e;let v=n[this.mIdentifier.dataKey];if(typeof v>"u")return n[this.mIdentifier.dataKey]=g,n;if(!Array.isArray(v))throw new A("Chain data merge value is not an array but should be.",this);return Array.isArray(g)?v.unshift(...g):v.unshift(g),e}optional(t,e){let n=typeof e>"u"?"":t,p=typeof e>"u"?t:e,g=new Array;Array.isArray(p)?g.push(...p):g.push(p);let v=new h(n,!1,g,this.mRootNode);return this.setChainedNode(v),v}required(t,e){let n=typeof e>"u"?"":t,p=typeof e>"u"?t:e,g=new Array;Array.isArray(p)?g.push(...p):g.push(p);let v=new h(n,!0,g,this.mRootNode);return this.setChainedNode(v),v}setChainedNode(t){if(this.mConnections.next!==null)throw new A("Node can only be chained to a single node.",this);this.mConnections.next=t}};var j={XmlIdentifier:"Identifier",XmlAssignment:"XmlAssignment",XmlValue:"XmlValue",XmlComment:"XmlComment",XmlOpenClosingBracket:"XmlOpenClosingBracket",XmlCloseBracket:"XmlCloseBracket",XmlOpenBracket:"XmlOpenBracket",XmlCloseClosingBracket:"XmlCloseClosingBracket",XmlExplicitValueIdentifier:"XmlExplicitValueIdentifier",ExpressionStart:"ExpressionStart",ExpressionEnd:"ExpressionEnd",ExpressionValue:"ExpressionValue",InstructionStart:"InstructionStart",InstructionInstructionValue:"InstructionInstructionValue",InstructionBodyStartBraket:"InstructionBodyStartBraket",InstructionBodyCloseBraket:"InstructionBodyCloseBraket",InstructionInstructionClosingBracket:"InstructionInstructionClosingBracket",InstructionInstructionOpeningBracket:"InstructionInstructionOpeningBracket"};var Ie=class extends ie{constructor(){super(),this.validWhitespaces=` 
\r`,this.trimWhitespace=!0;let t=this.createTokenPattern({pattern:{regex:/(?:(?!}}).)*/,type:j.ExpressionValue}}),e=this.createTokenPattern({pattern:{start:{regex:/{{/,type:j.ExpressionStart},end:{regex:/}}/,type:j.ExpressionEnd}}},s=>{s.useChildPattern(t)}),n=this.createTokenPattern({pattern:{regex:/[^>\s\n="/]+/,type:j.XmlIdentifier}}),p=this.createTokenPattern({pattern:{regex:/(?:(?!{{|"|<).)+/,type:j.XmlValue}}),g=this.createTokenPattern({pattern:{regex:/<!--.*?-->/,type:j.XmlComment}}),v=this.createTokenPattern({pattern:{regex:/=/,type:j.XmlAssignment}}),b=this.createTokenPattern({pattern:{start:{regex:/"/,type:j.XmlExplicitValueIdentifier},end:{regex:/"/,type:j.XmlExplicitValueIdentifier}}},s=>{s.useChildPattern(e),s.useChildPattern(p)}),S=this.createTokenPattern({pattern:{start:{regex:/<\//,type:j.XmlOpenClosingBracket},end:{regex:/>/,type:j.XmlCloseBracket}}},s=>{s.useChildPattern(n)}),C=this.createTokenPattern({pattern:{start:{regex:/</,type:j.XmlOpenBracket},end:{regex:/(?<closeClosingBracket>\/>)|(?<closeBracket>>)/,type:{closeClosingBracket:j.XmlCloseClosingBracket,closeBracket:j.XmlCloseBracket}}}},s=>{s.useChildPattern(v),s.useChildPattern(n),s.useChildPattern(b)}),a=this.createTokenPattern({pattern:{regex:/[^()"'`/)]+/,type:j.InstructionInstructionValue}}),o=this.createTokenPattern({pattern:{innerType:j.InstructionInstructionValue,start:{regex:/\//,type:j.InstructionInstructionValue},end:{regex:/\//,type:j.InstructionInstructionValue}}},s=>{s.useChildPattern(l),s.useChildPattern(r),s.useChildPattern(y),s.useChildPattern(c),s.useChildPattern(a)}),c=this.createTokenPattern({pattern:{innerType:j.InstructionInstructionValue,start:{regex:/\(/,type:j.InstructionInstructionValue},end:{regex:/\)/,type:j.InstructionInstructionValue}}},s=>{s.useChildPattern(o),s.useChildPattern(l),s.useChildPattern(r),s.useChildPattern(y),s.useChildPattern(a)}),l=this.createTokenPattern({pattern:{innerType:j.InstructionInstructionValue,start:{regex:/"/,type:j.InstructionInstructionValue},end:{regex:/"/,type:j.InstructionInstructionValue}}},s=>{s.useChildPattern(o),s.useChildPattern(r),s.useChildPattern(y),s.useChildPattern(c),s.useChildPattern(a)}),r=this.createTokenPattern({pattern:{innerType:j.InstructionInstructionValue,start:{regex:/'/,type:j.InstructionInstructionValue},end:{regex:/'/,type:j.InstructionInstructionValue}}},s=>{s.useChildPattern(o),s.useChildPattern(l),s.useChildPattern(y),s.useChildPattern(c),s.useChildPattern(a)}),y=this.createTokenPattern({pattern:{innerType:j.InstructionInstructionValue,start:{regex:/`/,type:j.InstructionInstructionValue},end:{regex:/`/,type:j.InstructionInstructionValue}}},s=>{s.useChildPattern(o),s.useChildPattern(l),s.useChildPattern(r),s.useChildPattern(c),s.useChildPattern(a)}),f=this.createTokenPattern({pattern:{regex:/\$[^(\s\n/{]+/,type:j.InstructionStart}}),T=this.createTokenPattern({pattern:{start:{regex:/\(/,type:j.InstructionInstructionOpeningBracket},end:{regex:/\)/,type:j.InstructionInstructionClosingBracket}}},s=>{s.useChildPattern(o),s.useChildPattern(l),s.useChildPattern(r),s.useChildPattern(y),s.useChildPattern(c),s.useChildPattern(a)}),w=this.createTokenPattern({pattern:{start:{regex:/{/,type:j.InstructionBodyStartBraket},end:{regex:/}/,type:j.InstructionBodyCloseBraket}}},s=>{for(let m of d)s.useChildPattern(m)}),d=[g,S,C,b,e,f,T,w,p];for(let s of d)this.useRootTokenPattern(s)}};var ae=class extends se{constructor(){super(new Ie),this.initGraph()}initGraph(){let t=J.define(()=>G.new().required(j.ExpressionStart).optional("value",j.ExpressionValue).required(j.ExpressionEnd)).converter(r=>new ft(r.value??"")),e=J.define(()=>{let r=e;return G.new().required("data[]",G.new().required("value",[t,G.new().required("text",j.XmlValue)])).optional("data<-data",r)}),n=J.define(()=>G.new().required("name",j.XmlIdentifier).optional("attributeValue",G.new().required(j.XmlAssignment).required(j.XmlExplicitValueIdentifier).optional("list<-data",e).required(j.XmlExplicitValueIdentifier))).converter(r=>{let y=new Array;if(r.attributeValue?.list)for(let f of r.attributeValue.list)f.value instanceof ft?y.push(f.value):y.push(f.value.text);return{name:r.name,values:y}}),p=J.define(()=>{let r=p;return G.new().required("data[]",n).optional("data<-data",r)}),g=J.define(()=>{let r=g;return G.new().required("data[]",G.new().required("value",[t,G.new().required("text",j.XmlValue),G.new().required(j.XmlExplicitValueIdentifier).required("text",j.XmlValue).required(j.XmlExplicitValueIdentifier)])).optional("data<-data",r)}),v=J.define(()=>G.new().required("list<-data",g)).converter(r=>{let y=new Dt;for(let f of r.list)f.value instanceof ft?y.addValue(f.value):y.addValue(f.value.text);return y}),b=J.define(()=>G.new().required(j.XmlComment)).converter(()=>null),S=J.define(()=>G.new().required(j.XmlOpenBracket).required("openingTagName",j.XmlIdentifier).optional("attributes<-data",p).required("closing",[G.new().required(j.XmlCloseClosingBracket),G.new().required(j.XmlCloseBracket).required("values",c).required(j.XmlOpenClosingBracket).required("closingTageName",j.XmlIdentifier).required(j.XmlCloseBracket)])).converter(r=>{if("closingTageName"in r.closing&&r.openingTagName!==r.closing.closingTageName)throw new A(`Opening (${r.openingTagName}) and closing tagname (${r.closing.closingTageName}) does not match`,this);let y=new St(r.openingTagName);if(r.attributes)for(let f of r.attributes)y.setAttribute(f.name).addValue(...f.values);return"values"in r.closing&&y.appendChild(...r.closing.values),y}),C=J.define(()=>{let r=C;return G.new().required("list[]",j.InstructionInstructionValue).optional("list<-list",r)}),a=J.define(()=>G.new().required("instructionName",j.InstructionStart).optional("instruction",G.new().required(j.InstructionInstructionOpeningBracket).required("value<-list",C).required(j.InstructionInstructionClosingBracket)).optional("body",G.new().required(j.InstructionBodyStartBraket).required("value",c).required(j.InstructionBodyCloseBraket))).converter(r=>{let y=r.instructionName.substring(1),f=r.instruction?.value.join("")??"",T=new Vt(y,f);return r.body&&T.appendChild(...r.body.value),T}),o=J.define(()=>{let r=o;return G.new().required("list[]",[b,S,a,v]).optional("list<-list",r)}),c=J.define(()=>{let r=o;return G.new().optional("list<-list",r)}).converter(r=>{let y=new Array;if(r.list)for(let f of r.list)f!==null&&y.push(f);return y}),l=J.define(()=>G.new().required("content",c)).converter(r=>{let y=new lt;return y.appendChild(...r.content),y});this.setRootGraph(l)}};var z=class h extends be{static mTemplateCache=new tt;static mXmlParser=new ae;mComponentElement;mRootBuilder;get element(){return this.mComponentElement.htmlElement}constructor(t){super({constructor:t.processorConstructor,parent:null}),st.registerComponent(this,t.htmlElement),this.setProcessorInjection(h,this),this.addConstructionHook(n=>{st.registerComponent(this,this.mComponentElement.htmlElement,n)}),h.mTemplateCache.has(t.processorConstructor)||h.mTemplateCache.set(t.processorConstructor,h.mXmlParser.parse(t.templateString??""));let e=h.mTemplateCache.get(t.processorConstructor).clone();this.mComponentElement=new ne(t.htmlElement),this.mRootBuilder=new Wt(e,new Ee(this,t.expressionModule),new pt(this),"ROOT"),this.mComponentElement.shadowRoot.appendChild(this.mRootBuilder.anchor),this.setProcessorInjection(wt,new wt(this.mRootBuilder.values))}addStyle(t){let e=document.createElement("style");e.innerHTML=t,this.mComponentElement.shadowRoot.prepend(e)}attributeChanged(t,e,n){this.call("onAttributeChange",t,e,n)}connected(){this.call("onConnect")}deconstruct(){this.call("onDeconstruct"),this.mRootBuilder.deconstruct(),super.deconstruct()}disconnected(){this.call("onDisconnect")}onUpdate(){return this.mRootBuilder.update()?(this.call("onUpdate"),!0):!1}};function K(h){return(t,e)=>{O.registerInjectable(t,e.metadata,"instanced"),st.registerConstructor(t,h.selector);let n=class extends HTMLElement{mComponent;constructor(){super(),this.mComponent=new z({processorConstructor:t,templateString:h.template??null,expressionModule:h.expressionmodule,htmlElement:this}).setup(),h.style&&this.mComponent.addStyle(h.style),this.mComponent.updater.update()}connectedCallback(){this.mComponent.connected()}disconnectedCallback(){this.mComponent.disconnected()}};globalThis.customElements.define(h.selector,n)}}function Bt(h){return(t,e)=>{O.registerInjectable(t,e.metadata,"instanced"),at.register(Nt,t,{access:h.access,targetRestrictions:h.targetRestrictions})}}function vt(h){return(t,e)=>{O.registerInjectable(t,e.metadata,"instanced"),at.register(gt,t,{access:h.access,selector:h.selector})}}function It(h){return(t,e)=>{O.registerInjectable(t,e.metadata,"instanced"),at.register(Ft,t,{instructionType:h.instructionType})}}function Oi(){function h(a,o){return function(l){e(o,"addInitializer"),n(l,"An initializer"),a.push(l)}}function t(a,o,c,l,r,y,f,T,w){var d;switch(r){case 1:d="accessor";break;case 2:d="method";break;case 3:d="getter";break;case 4:d="setter";break;default:d="field"}var s={kind:d,name:f?"#"+o:o,static:y,private:f,metadata:T},m={v:!1};s.addInitializer=h(l,m);var i,u;r===0?f?(i=c.get,u=c.set):(i=function(){return this[o]},u=function(x){this[o]=x}):r===2?i=function(){return c.value}:((r===1||r===3)&&(i=function(){return c.get.call(this)}),(r===1||r===4)&&(u=function(x){c.set.call(this,x)})),s.access=i&&u?{get:i,set:u}:i?{get:i}:{set:u};try{return a(w,s)}finally{m.v=!0}}function e(a,o){if(a.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(a,o){if(typeof a!="function")throw new TypeError(o+" must be a function")}function p(a,o){var c=typeof o;if(a===1){if(c!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(c!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function g(a,o,c,l,r,y,f,T,w){var d=c[0],s,m,i;f?r===0||r===1?s={get:c[3],set:c[4]}:r===3?s={get:c[3]}:r===4?s={set:c[3]}:s={value:c[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,l)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var u,x,I;if(typeof d=="function")u=t(d,l,s,T,r,y,f,w,i),u!==void 0&&(p(r,u),r===0?m=u:r===1?(m=u.init,x=u.get||i.get,I=u.set||i.set,i={get:x,set:I}):i=u);else for(var P=d.length-1;P>=0;P--){var M=d[P];if(u=t(M,l,s,T,r,y,f,w,i),u!==void 0){p(r,u);var N;r===0?N=u:r===1?(N=u.init,x=u.get||i.get,I=u.set||i.set,i={get:x,set:I}):i=u,N!==void 0&&(m===void 0?m=N:typeof m=="function"?m=[m,N]:m.push(N))}}if(r===0||r===1){if(m===void 0)m=function(D,E){return E};else if(typeof m!="function"){var _=m;m=function(D,E){for(var R=E,L=0;L<_.length;L++)R=_[L].call(D,R);return R}}else{var $=m;m=function(D,E){return $.call(D,E)}}a.push(m)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),f?r===1?(a.push(function(D,E){return i.get.call(D,E)}),a.push(function(D,E){return i.set.call(D,E)})):r===2?a.push(i):a.push(function(D,E){return i.call(D,E)}):Object.defineProperty(o,l,s))}function v(a,o,c){for(var l=[],r,y,f=new Map,T=new Map,w=0;w<o.length;w++){var d=o[w];if(Array.isArray(d)){var s=d[1],m=d[2],i=d.length>3,u=s>=5,x,I;if(u?(x=a,s=s-5,y=y||[],I=y):(x=a.prototype,r=r||[],I=r),s!==0&&!i){var P=u?T:f,M=P.get(m)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+m);!M&&s>2?P.set(m,s):P.set(m,!0)}g(l,x,d,m,s,u,i,I,c)}}return b(l,r),b(l,y),l}function b(a,o){o&&a.push(function(c){for(var l=0;l<o.length;l++)o[l].call(c);return c})}function S(a,o,c){if(o.length>0){for(var l=[],r=a,y=a.name,f=o.length-1;f>=0;f--){var T={v:!1};try{var w=o[f](r,{kind:"class",name:y,addInitializer:h(l,T),metadata:c})}finally{T.v=!0}w!==void 0&&(p(10,w),r=w)}return[C(r,c),function(){for(var d=0;d<l.length;d++)l[d].call(r)}]}}function C(a,o){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,c,l,r){if(r!==void 0)var y=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var f=Object.create(y===void 0?null:y),T=v(o,c,f);return l.length||C(o,f),{e:T,get c(){return S(o,l,f)}}}}function ir(h,t,e,n){return(ir=Oi())(h,t,e,n)}function _i(h){return h}var sr,nr,le;sr=Bt({access:Y.Read,targetRestrictions:[z]});new class extends _i{constructor(){super(le),nr()}static{class h{static{({c:[le,nr]}=ir(this,[],[sr]))}static METADATA_USER_EVENT_LISTENER_PROPERIES="pwb:user_event_listener_properties";mEventListenerList;mTargetElement;constructor(e=O.use(z)){let n=new Array,p=e.processorConstructor;do{let g=ot.get(p).getMetadata(h.METADATA_USER_EVENT_LISTENER_PROPERIES);if(g)for(let v of g)n.push(v)}while(p=Object.getPrototypeOf(p));this.mEventListenerList=new Array,this.mTargetElement=e.element;for(let g of n){let[v,b]=g,S=Reflect.get(e.processor,v);S=S.bind(e.processor),this.mEventListenerList.push([b,S]),this.mTargetElement.addEventListener(b,S)}}onDeconstruct(){for(let e of this.mEventListenerList){let[n,p]=e;this.mTargetElement.removeEventListener(n,p)}}}}};var ce=class extends window.Event{mValue;get value(){return this.mValue}constructor(t,e){super(t),this.mValue=e}};var ue=class{mElement;mEventName;constructor(t,e){this.mEventName=t,this.mElement=e}dispatchEvent(t){let e=new ce(this.mEventName,t);this.mElement.dispatchEvent(e)}};function ut(h){return(t,e)=>{if(e.static)throw new A("Event target is not for a static property.",ut);let n=null;return{get(){if(!n){let p=(()=>{try{return st.ofProcessor(this).component}catch{throw new A("PwbComponentEvent target class is not a component.",this)}})();n=new ue(h,p.element)}return n}}}}function Fi(){function h(a,o){return function(l){e(o,"addInitializer"),n(l,"An initializer"),a.push(l)}}function t(a,o,c,l,r,y,f,T,w){var d;switch(r){case 1:d="accessor";break;case 2:d="method";break;case 3:d="getter";break;case 4:d="setter";break;default:d="field"}var s={kind:d,name:f?"#"+o:o,static:y,private:f,metadata:T},m={v:!1};s.addInitializer=h(l,m);var i,u;r===0?f?(i=c.get,u=c.set):(i=function(){return this[o]},u=function(x){this[o]=x}):r===2?i=function(){return c.value}:((r===1||r===3)&&(i=function(){return c.get.call(this)}),(r===1||r===4)&&(u=function(x){c.set.call(this,x)})),s.access=i&&u?{get:i,set:u}:i?{get:i}:{set:u};try{return a(w,s)}finally{m.v=!0}}function e(a,o){if(a.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(a,o){if(typeof a!="function")throw new TypeError(o+" must be a function")}function p(a,o){var c=typeof o;if(a===1){if(c!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(c!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function g(a,o,c,l,r,y,f,T,w){var d=c[0],s,m,i;f?r===0||r===1?s={get:c[3],set:c[4]}:r===3?s={get:c[3]}:r===4?s={set:c[3]}:s={value:c[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,l)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var u,x,I;if(typeof d=="function")u=t(d,l,s,T,r,y,f,w,i),u!==void 0&&(p(r,u),r===0?m=u:r===1?(m=u.init,x=u.get||i.get,I=u.set||i.set,i={get:x,set:I}):i=u);else for(var P=d.length-1;P>=0;P--){var M=d[P];if(u=t(M,l,s,T,r,y,f,w,i),u!==void 0){p(r,u);var N;r===0?N=u:r===1?(N=u.init,x=u.get||i.get,I=u.set||i.set,i={get:x,set:I}):i=u,N!==void 0&&(m===void 0?m=N:typeof m=="function"?m=[m,N]:m.push(N))}}if(r===0||r===1){if(m===void 0)m=function(D,E){return E};else if(typeof m!="function"){var _=m;m=function(D,E){for(var R=E,L=0;L<_.length;L++)R=_[L].call(D,R);return R}}else{var $=m;m=function(D,E){return $.call(D,E)}}a.push(m)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),f?r===1?(a.push(function(D,E){return i.get.call(D,E)}),a.push(function(D,E){return i.set.call(D,E)})):r===2?a.push(i):a.push(function(D,E){return i.call(D,E)}):Object.defineProperty(o,l,s))}function v(a,o,c){for(var l=[],r,y,f=new Map,T=new Map,w=0;w<o.length;w++){var d=o[w];if(Array.isArray(d)){var s=d[1],m=d[2],i=d.length>3,u=s>=5,x,I;if(u?(x=a,s=s-5,y=y||[],I=y):(x=a.prototype,r=r||[],I=r),s!==0&&!i){var P=u?T:f,M=P.get(m)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+m);!M&&s>2?P.set(m,s):P.set(m,!0)}g(l,x,d,m,s,u,i,I,c)}}return b(l,r),b(l,y),l}function b(a,o){o&&a.push(function(c){for(var l=0;l<o.length;l++)o[l].call(c);return c})}function S(a,o,c){if(o.length>0){for(var l=[],r=a,y=a.name,f=o.length-1;f>=0;f--){var T={v:!1};try{var w=o[f](r,{kind:"class",name:y,addInitializer:h(l,T),metadata:c})}finally{T.v=!0}w!==void 0&&(p(10,w),r=w)}return[C(r,c),function(){for(var d=0;d<l.length;d++)l[d].call(r)}]}}function C(a,o){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,c,l,r){if(r!==void 0)var y=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var f=Object.create(y===void 0?null:y),T=v(o,c,f);return l.length||C(o,f),{e:T,get c(){return S(o,l,f)}}}}function lr(h,t,e,n){return(lr=Fi())(h,t,e,n)}function ji(h){return h}var cr,ar,he;cr=Bt({access:Y.ReadWrite,targetRestrictions:[z]});new class extends ji{constructor(){super(he),ar()}static{class h{static{({c:[he,ar]}=lr(this,[],[cr]))}static METADATA_EXPORTED_PROPERTIES="pwb:exported_properties";mComponent;constructor(e=O.use(z)){this.mComponent=e;let n=new jt,p=e.processorConstructor;do{let v=ot.get(p).getMetadata(h.METADATA_EXPORTED_PROPERTIES);v&&n.push(...v)}while(p=Object.getPrototypeOf(p));let g=new Set(n);g.size>0&&this.connectExportedProperties(g)}connectExportedProperties(e){this.exportPropertyAsAttribute(e),this.patchHtmlAttributes(e)}exportPropertyAsAttribute(e){for(let n of e){let p={};p.enumerable=!0,p.configurable=!0,delete p.value,delete p.writable,p.set=g=>{Reflect.set(this.mComponent.processor,n,g)},p.get=()=>{let g=Reflect.get(this.mComponent.processor,n);return typeof g=="function"&&(g=g.bind(this.mComponent.processor)),g},Object.defineProperty(this.mComponent.element,n,p)}}patchHtmlAttributes(e){let n=this.mComponent.element.getAttribute;new MutationObserver(g=>{for(let v of g){let b=v.attributeName,S=n.call(this.mComponent.element,b);Reflect.set(this.mComponent.element,b,S),this.mComponent.attributeChanged(b,v.oldValue,S)}}).observe(this.mComponent.element,{attributeFilter:[...e],attributeOldValue:!0});for(let g of e)if(this.mComponent.element.hasAttribute(g)){let v=n.call(this.mComponent.element,g);this.mComponent.element.setAttribute(g,v)}this.mComponent.element.getAttribute=g=>e.has(g)?Reflect.get(this.mComponent.element,g):n.call(this.mComponent.element,g)}}}};function et(h,t){if(t.static)throw new A("Event target is not for a static property.",et);let e=ot.forInternalDecorator(t.metadata),n=e.getMetadata(he.METADATA_EXPORTED_PROPERTIES)??new Array;n.push(t.name),e.setMetadata(he.METADATA_EXPORTED_PROPERTIES,n)}function it(h){return(t,e)=>{if(e.static)throw new A("Child decorator is not for a static property.",it);return{get(){let g=(()=>{try{return st.ofProcessor(this).component}catch{throw new A("PwbChild target class is not a component.",this)}})().getProcessorInjection(wt).data.store[h];if(g instanceof Element)return g;throw new A(`Can't find child "${h}".`,this)}}}}function $i(){function h(a,o){return function(l){e(o,"addInitializer"),n(l,"An initializer"),a.push(l)}}function t(a,o,c,l,r,y,f,T,w){var d;switch(r){case 1:d="accessor";break;case 2:d="method";break;case 3:d="getter";break;case 4:d="setter";break;default:d="field"}var s={kind:d,name:f?"#"+o:o,static:y,private:f,metadata:T},m={v:!1};s.addInitializer=h(l,m);var i,u;r===0?f?(i=c.get,u=c.set):(i=function(){return this[o]},u=function(x){this[o]=x}):r===2?i=function(){return c.value}:((r===1||r===3)&&(i=function(){return c.get.call(this)}),(r===1||r===4)&&(u=function(x){c.set.call(this,x)})),s.access=i&&u?{get:i,set:u}:i?{get:i}:{set:u};try{return a(w,s)}finally{m.v=!0}}function e(a,o){if(a.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(a,o){if(typeof a!="function")throw new TypeError(o+" must be a function")}function p(a,o){var c=typeof o;if(a===1){if(c!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(c!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function g(a,o,c,l,r,y,f,T,w){var d=c[0],s,m,i;f?r===0||r===1?s={get:c[3],set:c[4]}:r===3?s={get:c[3]}:r===4?s={set:c[3]}:s={value:c[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,l)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var u,x,I;if(typeof d=="function")u=t(d,l,s,T,r,y,f,w,i),u!==void 0&&(p(r,u),r===0?m=u:r===1?(m=u.init,x=u.get||i.get,I=u.set||i.set,i={get:x,set:I}):i=u);else for(var P=d.length-1;P>=0;P--){var M=d[P];if(u=t(M,l,s,T,r,y,f,w,i),u!==void 0){p(r,u);var N;r===0?N=u:r===1?(N=u.init,x=u.get||i.get,I=u.set||i.set,i={get:x,set:I}):i=u,N!==void 0&&(m===void 0?m=N:typeof m=="function"?m=[m,N]:m.push(N))}}if(r===0||r===1){if(m===void 0)m=function(D,E){return E};else if(typeof m!="function"){var _=m;m=function(D,E){for(var R=E,L=0;L<_.length;L++)R=_[L].call(D,R);return R}}else{var $=m;m=function(D,E){return $.call(D,E)}}a.push(m)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),f?r===1?(a.push(function(D,E){return i.get.call(D,E)}),a.push(function(D,E){return i.set.call(D,E)})):r===2?a.push(i):a.push(function(D,E){return i.call(D,E)}):Object.defineProperty(o,l,s))}function v(a,o,c){for(var l=[],r,y,f=new Map,T=new Map,w=0;w<o.length;w++){var d=o[w];if(Array.isArray(d)){var s=d[1],m=d[2],i=d.length>3,u=s>=5,x,I;if(u?(x=a,s=s-5,y=y||[],I=y):(x=a.prototype,r=r||[],I=r),s!==0&&!i){var P=u?T:f,M=P.get(m)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+m);!M&&s>2?P.set(m,s):P.set(m,!0)}g(l,x,d,m,s,u,i,I,c)}}return b(l,r),b(l,y),l}function b(a,o){o&&a.push(function(c){for(var l=0;l<o.length;l++)o[l].call(c);return c})}function S(a,o,c){if(o.length>0){for(var l=[],r=a,y=a.name,f=o.length-1;f>=0;f--){var T={v:!1};try{var w=o[f](r,{kind:"class",name:y,addInitializer:h(l,T),metadata:c})}finally{T.v=!0}w!==void 0&&(p(10,w),r=w)}return[C(r,c),function(){for(var d=0;d<l.length;d++)l[d].call(r)}]}}function C(a,o){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,c,l,r){if(r!==void 0)var y=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var f=Object.create(y===void 0?null:y),T=v(o,c,f);return l.length||C(o,f),{e:T,get c(){return S(o,l,f)}}}}function mr(h,t,e,n){return(mr=$i())(h,t,e,n)}var pr,ur,Vi;pr=It({instructionType:"dynamic-content"});var hr=class{static{({c:[Vi,ur]}=mr(this,[],[pr]))}constructor(t=O.use(k),e=O.use(H)){this.mModuleValues=e,this.mLastTemplate=null,this.mProcedure=this.mModuleValues.createExpressionProcedure(t.value)}mLastTemplate;mModuleValues;mProcedure;onUpdate(){let t=this.mProcedure.execute();if(!t||!(t instanceof lt))throw new A("Dynamic content method has a wrong result type.",this);if(this.mLastTemplate!==null&&this.mLastTemplate.equals(t))return null;let e=t.clone();this.mLastTemplate=e;let n=new ct;return n.addElement(e,new pt(this.mModuleValues.data)),n}static{ur()}};function zi(){function h(a,o){return function(l){e(o,"addInitializer"),n(l,"An initializer"),a.push(l)}}function t(a,o,c,l,r,y,f,T,w){var d;switch(r){case 1:d="accessor";break;case 2:d="method";break;case 3:d="getter";break;case 4:d="setter";break;default:d="field"}var s={kind:d,name:f?"#"+o:o,static:y,private:f,metadata:T},m={v:!1};s.addInitializer=h(l,m);var i,u;r===0?f?(i=c.get,u=c.set):(i=function(){return this[o]},u=function(x){this[o]=x}):r===2?i=function(){return c.value}:((r===1||r===3)&&(i=function(){return c.get.call(this)}),(r===1||r===4)&&(u=function(x){c.set.call(this,x)})),s.access=i&&u?{get:i,set:u}:i?{get:i}:{set:u};try{return a(w,s)}finally{m.v=!0}}function e(a,o){if(a.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(a,o){if(typeof a!="function")throw new TypeError(o+" must be a function")}function p(a,o){var c=typeof o;if(a===1){if(c!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(c!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function g(a,o,c,l,r,y,f,T,w){var d=c[0],s,m,i;f?r===0||r===1?s={get:c[3],set:c[4]}:r===3?s={get:c[3]}:r===4?s={set:c[3]}:s={value:c[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,l)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var u,x,I;if(typeof d=="function")u=t(d,l,s,T,r,y,f,w,i),u!==void 0&&(p(r,u),r===0?m=u:r===1?(m=u.init,x=u.get||i.get,I=u.set||i.set,i={get:x,set:I}):i=u);else for(var P=d.length-1;P>=0;P--){var M=d[P];if(u=t(M,l,s,T,r,y,f,w,i),u!==void 0){p(r,u);var N;r===0?N=u:r===1?(N=u.init,x=u.get||i.get,I=u.set||i.set,i={get:x,set:I}):i=u,N!==void 0&&(m===void 0?m=N:typeof m=="function"?m=[m,N]:m.push(N))}}if(r===0||r===1){if(m===void 0)m=function(D,E){return E};else if(typeof m!="function"){var _=m;m=function(D,E){for(var R=E,L=0;L<_.length;L++)R=_[L].call(D,R);return R}}else{var $=m;m=function(D,E){return $.call(D,E)}}a.push(m)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),f?r===1?(a.push(function(D,E){return i.get.call(D,E)}),a.push(function(D,E){return i.set.call(D,E)})):r===2?a.push(i):a.push(function(D,E){return i.call(D,E)}):Object.defineProperty(o,l,s))}function v(a,o,c){for(var l=[],r,y,f=new Map,T=new Map,w=0;w<o.length;w++){var d=o[w];if(Array.isArray(d)){var s=d[1],m=d[2],i=d.length>3,u=s>=5,x,I;if(u?(x=a,s=s-5,y=y||[],I=y):(x=a.prototype,r=r||[],I=r),s!==0&&!i){var P=u?T:f,M=P.get(m)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+m);!M&&s>2?P.set(m,s):P.set(m,!0)}g(l,x,d,m,s,u,i,I,c)}}return b(l,r),b(l,y),l}function b(a,o){o&&a.push(function(c){for(var l=0;l<o.length;l++)o[l].call(c);return c})}function S(a,o,c){if(o.length>0){for(var l=[],r=a,y=a.name,f=o.length-1;f>=0;f--){var T={v:!1};try{var w=o[f](r,{kind:"class",name:y,addInitializer:h(l,T),metadata:c})}finally{T.v=!0}w!==void 0&&(p(10,w),r=w)}return[C(r,c),function(){for(var d=0;d<l.length;d++)l[d].call(r)}]}}function C(a,o){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,c,l,r){if(r!==void 0)var y=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var f=Object.create(y===void 0?null:y),T=v(o,c,f);return l.length||C(o,f),{e:T,get c(){return S(o,l,f)}}}}function gr(h,t,e,n){return(gr=zi())(h,t,e,n)}var vr,dr,Bi;vr=vt({access:Y.Write,selector:/^\([[\w\-$]+\)$/});var fr=class{static{({c:[Bi,dr]}=gr(this,[],[vr]))}constructor(t=O.use(q),e=O.use(H),n=O.use(rt)){this.mTarget=t,this.mEventName=n.name.substring(1,n.name.length-1);let p=e.createExpressionProcedure(n.value,["$event"]);this.mListener=g=>{p.setTemporaryValue("$event",g),p.execute()},this.mTarget.addEventListener(this.mEventName,this.mListener)}mEventName;mListener;mTarget;onDeconstruct(){this.mTarget.removeEventListener(this.mEventName,this.mListener)}static{dr()}};function Ui(){function h(a,o){return function(l){e(o,"addInitializer"),n(l,"An initializer"),a.push(l)}}function t(a,o,c,l,r,y,f,T,w){var d;switch(r){case 1:d="accessor";break;case 2:d="method";break;case 3:d="getter";break;case 4:d="setter";break;default:d="field"}var s={kind:d,name:f?"#"+o:o,static:y,private:f,metadata:T},m={v:!1};s.addInitializer=h(l,m);var i,u;r===0?f?(i=c.get,u=c.set):(i=function(){return this[o]},u=function(x){this[o]=x}):r===2?i=function(){return c.value}:((r===1||r===3)&&(i=function(){return c.get.call(this)}),(r===1||r===4)&&(u=function(x){c.set.call(this,x)})),s.access=i&&u?{get:i,set:u}:i?{get:i}:{set:u};try{return a(w,s)}finally{m.v=!0}}function e(a,o){if(a.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(a,o){if(typeof a!="function")throw new TypeError(o+" must be a function")}function p(a,o){var c=typeof o;if(a===1){if(c!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(c!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function g(a,o,c,l,r,y,f,T,w){var d=c[0],s,m,i;f?r===0||r===1?s={get:c[3],set:c[4]}:r===3?s={get:c[3]}:r===4?s={set:c[3]}:s={value:c[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,l)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var u,x,I;if(typeof d=="function")u=t(d,l,s,T,r,y,f,w,i),u!==void 0&&(p(r,u),r===0?m=u:r===1?(m=u.init,x=u.get||i.get,I=u.set||i.set,i={get:x,set:I}):i=u);else for(var P=d.length-1;P>=0;P--){var M=d[P];if(u=t(M,l,s,T,r,y,f,w,i),u!==void 0){p(r,u);var N;r===0?N=u:r===1?(N=u.init,x=u.get||i.get,I=u.set||i.set,i={get:x,set:I}):i=u,N!==void 0&&(m===void 0?m=N:typeof m=="function"?m=[m,N]:m.push(N))}}if(r===0||r===1){if(m===void 0)m=function(D,E){return E};else if(typeof m!="function"){var _=m;m=function(D,E){for(var R=E,L=0;L<_.length;L++)R=_[L].call(D,R);return R}}else{var $=m;m=function(D,E){return $.call(D,E)}}a.push(m)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),f?r===1?(a.push(function(D,E){return i.get.call(D,E)}),a.push(function(D,E){return i.set.call(D,E)})):r===2?a.push(i):a.push(function(D,E){return i.call(D,E)}):Object.defineProperty(o,l,s))}function v(a,o,c){for(var l=[],r,y,f=new Map,T=new Map,w=0;w<o.length;w++){var d=o[w];if(Array.isArray(d)){var s=d[1],m=d[2],i=d.length>3,u=s>=5,x,I;if(u?(x=a,s=s-5,y=y||[],I=y):(x=a.prototype,r=r||[],I=r),s!==0&&!i){var P=u?T:f,M=P.get(m)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+m);!M&&s>2?P.set(m,s):P.set(m,!0)}g(l,x,d,m,s,u,i,I,c)}}return b(l,r),b(l,y),l}function b(a,o){o&&a.push(function(c){for(var l=0;l<o.length;l++)o[l].call(c);return c})}function S(a,o,c){if(o.length>0){for(var l=[],r=a,y=a.name,f=o.length-1;f>=0;f--){var T={v:!1};try{var w=o[f](r,{kind:"class",name:y,addInitializer:h(l,T),metadata:c})}finally{T.v=!0}w!==void 0&&(p(10,w),r=w)}return[C(r,c),function(){for(var d=0;d<l.length;d++)l[d].call(r)}]}}function C(a,o){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,c,l,r){if(r!==void 0)var y=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var f=Object.create(y===void 0?null:y),T=v(o,c,f);return l.length||C(o,f),{e:T,get c(){return S(o,l,f)}}}}function wr(h,t,e,n){return(wr=Ui())(h,t,e,n)}var xr,yr,Gi;xr=It({instructionType:"for"});var br=class{static{({c:[Gi,yr]}=wr(this,[],[xr]))}constructor(t=O.use(dt),e=O.use(H),n=O.use(k)){this.mTemplate=t,this.mModuleValues=e,this.mLastEntries=new Array;let p=n.value,v=new RegExp(/^\s*([a-zA-Z]+[a-zA-Z0-9]*)\s*of\s+([^;]+)\s*(;\s*([a-zA-Z]+[a-zA-Z0-9]*)\s*=\s*(.*)\s*)?$/).exec(p);if(!v)throw new A(`For-Parameter value has wrong format: ${p}`,this);let b=v[1],S=v[2],C=v[4]??null,a=v[5],o=this.mModuleValues.createExpressionProcedure(S),c=C?this.mModuleValues.createExpressionProcedure(a,["$index",b]):null;this.mExpression={iterateVariableName:b,iterateValueProcedure:o,indexExportVariableName:C,indexExportProcedure:c}}mExpression;mLastEntries;mModuleValues;mTemplate;onUpdate(){let t=new ct,e=this.mExpression.iterateValueProcedure.execute();if(typeof e=="object"&&e!==null||Array.isArray(e)){let n=Symbol.iterator in e?Object.entries([...e]):Object.entries(e);if(this.compareEntries(n,this.mLastEntries))return null;this.mLastEntries=n;for(let[p,g]of n)this.addTemplateForElement(t,this.mExpression,g,p);return t}else return null}addTemplateForElement=(t,e,n,p)=>{let g=new pt(this.mModuleValues.data);if(g.setTemporaryValue(e.iterateVariableName,n),e.indexExportProcedure&&e.indexExportVariableName){e.indexExportProcedure.setTemporaryValue("$index",p),e.indexExportProcedure.setTemporaryValue(e.iterateVariableName,n);let b=e.indexExportProcedure.execute();g.setTemporaryValue(e.indexExportVariableName,b)}let v=new lt;v.appendChild(...this.mTemplate.childList),t.addElement(v,g)};compareEntries(t,e){if(t.length!==e.length)return!1;for(let n=0;n<t.length;n++){let[p,g]=t[n],[v,b]=e[n];if(p!==v||g!==b)return!1}return!0}static{yr()}};function Hi(){function h(a,o){return function(l){e(o,"addInitializer"),n(l,"An initializer"),a.push(l)}}function t(a,o,c,l,r,y,f,T,w){var d;switch(r){case 1:d="accessor";break;case 2:d="method";break;case 3:d="getter";break;case 4:d="setter";break;default:d="field"}var s={kind:d,name:f?"#"+o:o,static:y,private:f,metadata:T},m={v:!1};s.addInitializer=h(l,m);var i,u;r===0?f?(i=c.get,u=c.set):(i=function(){return this[o]},u=function(x){this[o]=x}):r===2?i=function(){return c.value}:((r===1||r===3)&&(i=function(){return c.get.call(this)}),(r===1||r===4)&&(u=function(x){c.set.call(this,x)})),s.access=i&&u?{get:i,set:u}:i?{get:i}:{set:u};try{return a(w,s)}finally{m.v=!0}}function e(a,o){if(a.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(a,o){if(typeof a!="function")throw new TypeError(o+" must be a function")}function p(a,o){var c=typeof o;if(a===1){if(c!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(c!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function g(a,o,c,l,r,y,f,T,w){var d=c[0],s,m,i;f?r===0||r===1?s={get:c[3],set:c[4]}:r===3?s={get:c[3]}:r===4?s={set:c[3]}:s={value:c[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,l)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var u,x,I;if(typeof d=="function")u=t(d,l,s,T,r,y,f,w,i),u!==void 0&&(p(r,u),r===0?m=u:r===1?(m=u.init,x=u.get||i.get,I=u.set||i.set,i={get:x,set:I}):i=u);else for(var P=d.length-1;P>=0;P--){var M=d[P];if(u=t(M,l,s,T,r,y,f,w,i),u!==void 0){p(r,u);var N;r===0?N=u:r===1?(N=u.init,x=u.get||i.get,I=u.set||i.set,i={get:x,set:I}):i=u,N!==void 0&&(m===void 0?m=N:typeof m=="function"?m=[m,N]:m.push(N))}}if(r===0||r===1){if(m===void 0)m=function(D,E){return E};else if(typeof m!="function"){var _=m;m=function(D,E){for(var R=E,L=0;L<_.length;L++)R=_[L].call(D,R);return R}}else{var $=m;m=function(D,E){return $.call(D,E)}}a.push(m)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),f?r===1?(a.push(function(D,E){return i.get.call(D,E)}),a.push(function(D,E){return i.set.call(D,E)})):r===2?a.push(i):a.push(function(D,E){return i.call(D,E)}):Object.defineProperty(o,l,s))}function v(a,o,c){for(var l=[],r,y,f=new Map,T=new Map,w=0;w<o.length;w++){var d=o[w];if(Array.isArray(d)){var s=d[1],m=d[2],i=d.length>3,u=s>=5,x,I;if(u?(x=a,s=s-5,y=y||[],I=y):(x=a.prototype,r=r||[],I=r),s!==0&&!i){var P=u?T:f,M=P.get(m)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+m);!M&&s>2?P.set(m,s):P.set(m,!0)}g(l,x,d,m,s,u,i,I,c)}}return b(l,r),b(l,y),l}function b(a,o){o&&a.push(function(c){for(var l=0;l<o.length;l++)o[l].call(c);return c})}function S(a,o,c){if(o.length>0){for(var l=[],r=a,y=a.name,f=o.length-1;f>=0;f--){var T={v:!1};try{var w=o[f](r,{kind:"class",name:y,addInitializer:h(l,T),metadata:c})}finally{T.v=!0}w!==void 0&&(p(10,w),r=w)}return[C(r,c),function(){for(var d=0;d<l.length;d++)l[d].call(r)}]}}function C(a,o){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,c,l,r){if(r!==void 0)var y=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var f=Object.create(y===void 0?null:y),T=v(o,c,f);return l.length||C(o,f),{e:T,get c(){return S(o,l,f)}}}}function Dr(h,t,e,n){return(Dr=Hi())(h,t,e,n)}var Sr,Tr,Xi;Sr=It({instructionType:"if"});var Er=class{static{({c:[Xi,Tr]}=Dr(this,[],[Sr]))}constructor(t=O.use(dt),e=O.use(H),n=O.use(k)){this.mTemplateReference=t,this.mModuleValues=e,this.mProcedure=this.mModuleValues.createExpressionProcedure(n.value),this.mLastBoolean=!1}mLastBoolean;mModuleValues;mProcedure;mTemplateReference;onUpdate(){let t=this.mProcedure.execute();if(!!t!==this.mLastBoolean){this.mLastBoolean=!!t;let e=new ct;if(t){let n=new lt;n.appendChild(...this.mTemplateReference.childList),e.addElement(n,new pt(this.mModuleValues.data))}return e}else return null}static{Tr()}};function Yi(){function h(a,o){return function(l){e(o,"addInitializer"),n(l,"An initializer"),a.push(l)}}function t(a,o,c,l,r,y,f,T,w){var d;switch(r){case 1:d="accessor";break;case 2:d="method";break;case 3:d="getter";break;case 4:d="setter";break;default:d="field"}var s={kind:d,name:f?"#"+o:o,static:y,private:f,metadata:T},m={v:!1};s.addInitializer=h(l,m);var i,u;r===0?f?(i=c.get,u=c.set):(i=function(){return this[o]},u=function(x){this[o]=x}):r===2?i=function(){return c.value}:((r===1||r===3)&&(i=function(){return c.get.call(this)}),(r===1||r===4)&&(u=function(x){c.set.call(this,x)})),s.access=i&&u?{get:i,set:u}:i?{get:i}:{set:u};try{return a(w,s)}finally{m.v=!0}}function e(a,o){if(a.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(a,o){if(typeof a!="function")throw new TypeError(o+" must be a function")}function p(a,o){var c=typeof o;if(a===1){if(c!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(c!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function g(a,o,c,l,r,y,f,T,w){var d=c[0],s,m,i;f?r===0||r===1?s={get:c[3],set:c[4]}:r===3?s={get:c[3]}:r===4?s={set:c[3]}:s={value:c[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,l)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var u,x,I;if(typeof d=="function")u=t(d,l,s,T,r,y,f,w,i),u!==void 0&&(p(r,u),r===0?m=u:r===1?(m=u.init,x=u.get||i.get,I=u.set||i.set,i={get:x,set:I}):i=u);else for(var P=d.length-1;P>=0;P--){var M=d[P];if(u=t(M,l,s,T,r,y,f,w,i),u!==void 0){p(r,u);var N;r===0?N=u:r===1?(N=u.init,x=u.get||i.get,I=u.set||i.set,i={get:x,set:I}):i=u,N!==void 0&&(m===void 0?m=N:typeof m=="function"?m=[m,N]:m.push(N))}}if(r===0||r===1){if(m===void 0)m=function(D,E){return E};else if(typeof m!="function"){var _=m;m=function(D,E){for(var R=E,L=0;L<_.length;L++)R=_[L].call(D,R);return R}}else{var $=m;m=function(D,E){return $.call(D,E)}}a.push(m)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),f?r===1?(a.push(function(D,E){return i.get.call(D,E)}),a.push(function(D,E){return i.set.call(D,E)})):r===2?a.push(i):a.push(function(D,E){return i.call(D,E)}):Object.defineProperty(o,l,s))}function v(a,o,c){for(var l=[],r,y,f=new Map,T=new Map,w=0;w<o.length;w++){var d=o[w];if(Array.isArray(d)){var s=d[1],m=d[2],i=d.length>3,u=s>=5,x,I;if(u?(x=a,s=s-5,y=y||[],I=y):(x=a.prototype,r=r||[],I=r),s!==0&&!i){var P=u?T:f,M=P.get(m)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+m);!M&&s>2?P.set(m,s):P.set(m,!0)}g(l,x,d,m,s,u,i,I,c)}}return b(l,r),b(l,y),l}function b(a,o){o&&a.push(function(c){for(var l=0;l<o.length;l++)o[l].call(c);return c})}function S(a,o,c){if(o.length>0){for(var l=[],r=a,y=a.name,f=o.length-1;f>=0;f--){var T={v:!1};try{var w=o[f](r,{kind:"class",name:y,addInitializer:h(l,T),metadata:c})}finally{T.v=!0}w!==void 0&&(p(10,w),r=w)}return[C(r,c),function(){for(var d=0;d<l.length;d++)l[d].call(r)}]}}function C(a,o){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,c,l,r){if(r!==void 0)var y=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var f=Object.create(y===void 0?null:y),T=v(o,c,f);return l.length||C(o,f),{e:T,get c(){return S(o,l,f)}}}}function Pr(h,t,e,n){return(Pr=Yi())(h,t,e,n)}var Mr,Ir,Wi;Mr=vt({access:Y.Read,selector:/^\[[\w$]+\]$/});var Cr=class{static{({c:[Wi,Ir]}=Pr(this,[],[Mr]))}constructor(t=O.use(q),e=O.use(H),n=O.use(rt)){this.mTarget=t,this.mProcedure=e.createExpressionProcedure(n.value),this.mTargetProperty=n.name.substring(1,n.name.length-1),this.mLastValue=Symbol("Uncomparable")}mLastValue;mProcedure;mTarget;mTargetProperty;onUpdate(){let t=this.mProcedure.execute();return t===this.mLastValue?!1:(this.mLastValue=t,Reflect.set(this.mTarget,this.mTargetProperty,t),!0)}static{Ir()}};function Zi(){function h(a,o){return function(l){e(o,"addInitializer"),n(l,"An initializer"),a.push(l)}}function t(a,o,c,l,r,y,f,T,w){var d;switch(r){case 1:d="accessor";break;case 2:d="method";break;case 3:d="getter";break;case 4:d="setter";break;default:d="field"}var s={kind:d,name:f?"#"+o:o,static:y,private:f,metadata:T},m={v:!1};s.addInitializer=h(l,m);var i,u;r===0?f?(i=c.get,u=c.set):(i=function(){return this[o]},u=function(x){this[o]=x}):r===2?i=function(){return c.value}:((r===1||r===3)&&(i=function(){return c.get.call(this)}),(r===1||r===4)&&(u=function(x){c.set.call(this,x)})),s.access=i&&u?{get:i,set:u}:i?{get:i}:{set:u};try{return a(w,s)}finally{m.v=!0}}function e(a,o){if(a.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(a,o){if(typeof a!="function")throw new TypeError(o+" must be a function")}function p(a,o){var c=typeof o;if(a===1){if(c!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(c!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function g(a,o,c,l,r,y,f,T,w){var d=c[0],s,m,i;f?r===0||r===1?s={get:c[3],set:c[4]}:r===3?s={get:c[3]}:r===4?s={set:c[3]}:s={value:c[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,l)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var u,x,I;if(typeof d=="function")u=t(d,l,s,T,r,y,f,w,i),u!==void 0&&(p(r,u),r===0?m=u:r===1?(m=u.init,x=u.get||i.get,I=u.set||i.set,i={get:x,set:I}):i=u);else for(var P=d.length-1;P>=0;P--){var M=d[P];if(u=t(M,l,s,T,r,y,f,w,i),u!==void 0){p(r,u);var N;r===0?N=u:r===1?(N=u.init,x=u.get||i.get,I=u.set||i.set,i={get:x,set:I}):i=u,N!==void 0&&(m===void 0?m=N:typeof m=="function"?m=[m,N]:m.push(N))}}if(r===0||r===1){if(m===void 0)m=function(D,E){return E};else if(typeof m!="function"){var _=m;m=function(D,E){for(var R=E,L=0;L<_.length;L++)R=_[L].call(D,R);return R}}else{var $=m;m=function(D,E){return $.call(D,E)}}a.push(m)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),f?r===1?(a.push(function(D,E){return i.get.call(D,E)}),a.push(function(D,E){return i.set.call(D,E)})):r===2?a.push(i):a.push(function(D,E){return i.call(D,E)}):Object.defineProperty(o,l,s))}function v(a,o,c){for(var l=[],r,y,f=new Map,T=new Map,w=0;w<o.length;w++){var d=o[w];if(Array.isArray(d)){var s=d[1],m=d[2],i=d.length>3,u=s>=5,x,I;if(u?(x=a,s=s-5,y=y||[],I=y):(x=a.prototype,r=r||[],I=r),s!==0&&!i){var P=u?T:f,M=P.get(m)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+m);!M&&s>2?P.set(m,s):P.set(m,!0)}g(l,x,d,m,s,u,i,I,c)}}return b(l,r),b(l,y),l}function b(a,o){o&&a.push(function(c){for(var l=0;l<o.length;l++)o[l].call(c);return c})}function S(a,o,c){if(o.length>0){for(var l=[],r=a,y=a.name,f=o.length-1;f>=0;f--){var T={v:!1};try{var w=o[f](r,{kind:"class",name:y,addInitializer:h(l,T),metadata:c})}finally{T.v=!0}w!==void 0&&(p(10,w),r=w)}return[C(r,c),function(){for(var d=0;d<l.length;d++)l[d].call(r)}]}}function C(a,o){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,c,l,r){if(r!==void 0)var y=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var f=Object.create(y===void 0?null:y),T=v(o,c,f);return l.length||C(o,f),{e:T,get c(){return S(o,l,f)}}}}function Rr(h,t,e,n){return(Rr=Zi())(h,t,e,n)}var Lr,Nr,qi;Lr=vt({access:Y.Write,selector:/^#[[\w$]+$/});var Ar=class{static{({c:[qi,Nr]}=Rr(this,[],[Lr]))}constructor(t=O.use(q),e=O.use(rt),n=O.use(wt)){n.setTemporaryValue(e.name.substring(1),t)}static{Nr()}};function Ji(){function h(a,o){return function(l){e(o,"addInitializer"),n(l,"An initializer"),a.push(l)}}function t(a,o,c,l,r,y,f,T,w){var d;switch(r){case 1:d="accessor";break;case 2:d="method";break;case 3:d="getter";break;case 4:d="setter";break;default:d="field"}var s={kind:d,name:f?"#"+o:o,static:y,private:f,metadata:T},m={v:!1};s.addInitializer=h(l,m);var i,u;r===0?f?(i=c.get,u=c.set):(i=function(){return this[o]},u=function(x){this[o]=x}):r===2?i=function(){return c.value}:((r===1||r===3)&&(i=function(){return c.get.call(this)}),(r===1||r===4)&&(u=function(x){c.set.call(this,x)})),s.access=i&&u?{get:i,set:u}:i?{get:i}:{set:u};try{return a(w,s)}finally{m.v=!0}}function e(a,o){if(a.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(a,o){if(typeof a!="function")throw new TypeError(o+" must be a function")}function p(a,o){var c=typeof o;if(a===1){if(c!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(c!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function g(a,o,c,l,r,y,f,T,w){var d=c[0],s,m,i;f?r===0||r===1?s={get:c[3],set:c[4]}:r===3?s={get:c[3]}:r===4?s={set:c[3]}:s={value:c[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,l)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var u,x,I;if(typeof d=="function")u=t(d,l,s,T,r,y,f,w,i),u!==void 0&&(p(r,u),r===0?m=u:r===1?(m=u.init,x=u.get||i.get,I=u.set||i.set,i={get:x,set:I}):i=u);else for(var P=d.length-1;P>=0;P--){var M=d[P];if(u=t(M,l,s,T,r,y,f,w,i),u!==void 0){p(r,u);var N;r===0?N=u:r===1?(N=u.init,x=u.get||i.get,I=u.set||i.set,i={get:x,set:I}):i=u,N!==void 0&&(m===void 0?m=N:typeof m=="function"?m=[m,N]:m.push(N))}}if(r===0||r===1){if(m===void 0)m=function(D,E){return E};else if(typeof m!="function"){var _=m;m=function(D,E){for(var R=E,L=0;L<_.length;L++)R=_[L].call(D,R);return R}}else{var $=m;m=function(D,E){return $.call(D,E)}}a.push(m)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),f?r===1?(a.push(function(D,E){return i.get.call(D,E)}),a.push(function(D,E){return i.set.call(D,E)})):r===2?a.push(i):a.push(function(D,E){return i.call(D,E)}):Object.defineProperty(o,l,s))}function v(a,o,c){for(var l=[],r,y,f=new Map,T=new Map,w=0;w<o.length;w++){var d=o[w];if(Array.isArray(d)){var s=d[1],m=d[2],i=d.length>3,u=s>=5,x,I;if(u?(x=a,s=s-5,y=y||[],I=y):(x=a.prototype,r=r||[],I=r),s!==0&&!i){var P=u?T:f,M=P.get(m)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+m);!M&&s>2?P.set(m,s):P.set(m,!0)}g(l,x,d,m,s,u,i,I,c)}}return b(l,r),b(l,y),l}function b(a,o){o&&a.push(function(c){for(var l=0;l<o.length;l++)o[l].call(c);return c})}function S(a,o,c){if(o.length>0){for(var l=[],r=a,y=a.name,f=o.length-1;f>=0;f--){var T={v:!1};try{var w=o[f](r,{kind:"class",name:y,addInitializer:h(l,T),metadata:c})}finally{T.v=!0}w!==void 0&&(p(10,w),r=w)}return[C(r,c),function(){for(var d=0;d<l.length;d++)l[d].call(r)}]}}function C(a,o){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,c,l,r){if(r!==void 0)var y=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var f=Object.create(y===void 0?null:y),T=v(o,c,f);return l.length||C(o,f),{e:T,get c(){return S(o,l,f)}}}}function Fr(h,t,e,n){return(Fr=Ji())(h,t,e,n)}var jr,Or,Ki;jr=It({instructionType:"slot"});var _r=class{static{({c:[Ki,Or]}=Fr(this,[],[jr]))}constructor(t=O.use(H),e=O.use(k)){this.mModuleValues=t,this.mSlotName=e.value,this.mIsSetup=!1}mIsSetup;mModuleValues;mSlotName;onUpdate(){if(this.mIsSetup)return null;this.mIsSetup=!0;let t=new St("slot");this.mSlotName!==""&&t.setAttribute("name").addValue(this.mSlotName);let e=new lt;e.appendChild(t);let n=new ct;return n.addElement(e,this.mModuleValues.data),n}static{Or()}};function Qi(){function h(a,o){return function(l){e(o,"addInitializer"),n(l,"An initializer"),a.push(l)}}function t(a,o,c,l,r,y,f,T,w){var d;switch(r){case 1:d="accessor";break;case 2:d="method";break;case 3:d="getter";break;case 4:d="setter";break;default:d="field"}var s={kind:d,name:f?"#"+o:o,static:y,private:f,metadata:T},m={v:!1};s.addInitializer=h(l,m);var i,u;r===0?f?(i=c.get,u=c.set):(i=function(){return this[o]},u=function(x){this[o]=x}):r===2?i=function(){return c.value}:((r===1||r===3)&&(i=function(){return c.get.call(this)}),(r===1||r===4)&&(u=function(x){c.set.call(this,x)})),s.access=i&&u?{get:i,set:u}:i?{get:i}:{set:u};try{return a(w,s)}finally{m.v=!0}}function e(a,o){if(a.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(a,o){if(typeof a!="function")throw new TypeError(o+" must be a function")}function p(a,o){var c=typeof o;if(a===1){if(c!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(c!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function g(a,o,c,l,r,y,f,T,w){var d=c[0],s,m,i;f?r===0||r===1?s={get:c[3],set:c[4]}:r===3?s={get:c[3]}:r===4?s={set:c[3]}:s={value:c[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,l)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var u,x,I;if(typeof d=="function")u=t(d,l,s,T,r,y,f,w,i),u!==void 0&&(p(r,u),r===0?m=u:r===1?(m=u.init,x=u.get||i.get,I=u.set||i.set,i={get:x,set:I}):i=u);else for(var P=d.length-1;P>=0;P--){var M=d[P];if(u=t(M,l,s,T,r,y,f,w,i),u!==void 0){p(r,u);var N;r===0?N=u:r===1?(N=u.init,x=u.get||i.get,I=u.set||i.set,i={get:x,set:I}):i=u,N!==void 0&&(m===void 0?m=N:typeof m=="function"?m=[m,N]:m.push(N))}}if(r===0||r===1){if(m===void 0)m=function(D,E){return E};else if(typeof m!="function"){var _=m;m=function(D,E){for(var R=E,L=0;L<_.length;L++)R=_[L].call(D,R);return R}}else{var $=m;m=function(D,E){return $.call(D,E)}}a.push(m)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),f?r===1?(a.push(function(D,E){return i.get.call(D,E)}),a.push(function(D,E){return i.set.call(D,E)})):r===2?a.push(i):a.push(function(D,E){return i.call(D,E)}):Object.defineProperty(o,l,s))}function v(a,o,c){for(var l=[],r,y,f=new Map,T=new Map,w=0;w<o.length;w++){var d=o[w];if(Array.isArray(d)){var s=d[1],m=d[2],i=d.length>3,u=s>=5,x,I;if(u?(x=a,s=s-5,y=y||[],I=y):(x=a.prototype,r=r||[],I=r),s!==0&&!i){var P=u?T:f,M=P.get(m)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+m);!M&&s>2?P.set(m,s):P.set(m,!0)}g(l,x,d,m,s,u,i,I,c)}}return b(l,r),b(l,y),l}function b(a,o){o&&a.push(function(c){for(var l=0;l<o.length;l++)o[l].call(c);return c})}function S(a,o,c){if(o.length>0){for(var l=[],r=a,y=a.name,f=o.length-1;f>=0;f--){var T={v:!1};try{var w=o[f](r,{kind:"class",name:y,addInitializer:h(l,T),metadata:c})}finally{T.v=!0}w!==void 0&&(p(10,w),r=w)}return[C(r,c),function(){for(var d=0;d<l.length;d++)l[d].call(r)}]}}function C(a,o){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,c,l,r){if(r!==void 0)var y=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var f=Object.create(y===void 0?null:y),T=v(o,c,f);return l.length||C(o,f),{e:T,get c(){return S(o,l,f)}}}}function zr(h,t,e,n){return(zr=Qi())(h,t,e,n)}var Br,$r,ki;Br=vt({access:Y.ReadWrite,selector:/^\[\([[\w$]+\)\]$/});var Vr=class{static{({c:[ki,$r]}=zr(this,[],[Br]))}constructor(t=O.use(z),e=O.use(q),n=O.use(H),p=O.use(rt)){this.mTargetNode=e,this.mAttributeKey=p.name.substring(2,p.name.length-2),this.mReadProcedure=n.createExpressionProcedure(p.value),this.mWriteProcedure=n.createExpressionProcedure(`${p.value} = $DATA;`,["$DATA"]),this.mLastDataValue=Symbol("Uncomparable");let g=v=>{this.mLastDataValue!==v&&t.updater.updateAsync()};this.mTargetNode.addEventListener("input",v=>{g(Reflect.get(this.mTargetNode,this.mAttributeKey))}),this.mTargetNode.addEventListener("change",v=>{g(Reflect.get(this.mTargetNode,this.mAttributeKey))})}mAttributeKey;mLastDataValue;mReadProcedure;mTargetNode;mWriteProcedure;onUpdate(){let t=this.mReadProcedure.execute();if(t!==this.mLastDataValue)return Reflect.set(this.mTargetNode,this.mAttributeKey,t),this.mLastDataValue=t,!0;let e=Reflect.get(this.mTargetNode,this.mAttributeKey);return e!==t?(this.mWriteProcedure.setTemporaryValue("$DATA",e),this.mWriteProcedure.execute(),this.mLastDataValue=e,!0):!1}static{$r()}};function ts(){function h(a,o){return function(l){e(o,"addInitializer"),n(l,"An initializer"),a.push(l)}}function t(a,o,c,l,r,y,f,T,w){var d;switch(r){case 1:d="accessor";break;case 2:d="method";break;case 3:d="getter";break;case 4:d="setter";break;default:d="field"}var s={kind:d,name:f?"#"+o:o,static:y,private:f,metadata:T},m={v:!1};s.addInitializer=h(l,m);var i,u;r===0?f?(i=c.get,u=c.set):(i=function(){return this[o]},u=function(x){this[o]=x}):r===2?i=function(){return c.value}:((r===1||r===3)&&(i=function(){return c.get.call(this)}),(r===1||r===4)&&(u=function(x){c.set.call(this,x)})),s.access=i&&u?{get:i,set:u}:i?{get:i}:{set:u};try{return a(w,s)}finally{m.v=!0}}function e(a,o){if(a.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(a,o){if(typeof a!="function")throw new TypeError(o+" must be a function")}function p(a,o){var c=typeof o;if(a===1){if(c!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(c!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function g(a,o,c,l,r,y,f,T,w){var d=c[0],s,m,i;f?r===0||r===1?s={get:c[3],set:c[4]}:r===3?s={get:c[3]}:r===4?s={set:c[3]}:s={value:c[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,l)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var u,x,I;if(typeof d=="function")u=t(d,l,s,T,r,y,f,w,i),u!==void 0&&(p(r,u),r===0?m=u:r===1?(m=u.init,x=u.get||i.get,I=u.set||i.set,i={get:x,set:I}):i=u);else for(var P=d.length-1;P>=0;P--){var M=d[P];if(u=t(M,l,s,T,r,y,f,w,i),u!==void 0){p(r,u);var N;r===0?N=u:r===1?(N=u.init,x=u.get||i.get,I=u.set||i.set,i={get:x,set:I}):i=u,N!==void 0&&(m===void 0?m=N:typeof m=="function"?m=[m,N]:m.push(N))}}if(r===0||r===1){if(m===void 0)m=function(D,E){return E};else if(typeof m!="function"){var _=m;m=function(D,E){for(var R=E,L=0;L<_.length;L++)R=_[L].call(D,R);return R}}else{var $=m;m=function(D,E){return $.call(D,E)}}a.push(m)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),f?r===1?(a.push(function(D,E){return i.get.call(D,E)}),a.push(function(D,E){return i.set.call(D,E)})):r===2?a.push(i):a.push(function(D,E){return i.call(D,E)}):Object.defineProperty(o,l,s))}function v(a,o,c){for(var l=[],r,y,f=new Map,T=new Map,w=0;w<o.length;w++){var d=o[w];if(Array.isArray(d)){var s=d[1],m=d[2],i=d.length>3,u=s>=5,x,I;if(u?(x=a,s=s-5,y=y||[],I=y):(x=a.prototype,r=r||[],I=r),s!==0&&!i){var P=u?T:f,M=P.get(m)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+m);!M&&s>2?P.set(m,s):P.set(m,!0)}g(l,x,d,m,s,u,i,I,c)}}return b(l,r),b(l,y),l}function b(a,o){o&&a.push(function(c){for(var l=0;l<o.length;l++)o[l].call(c);return c})}function S(a,o,c){if(o.length>0){for(var l=[],r=a,y=a.name,f=o.length-1;f>=0;f--){var T={v:!1};try{var w=o[f](r,{kind:"class",name:y,addInitializer:h(l,T),metadata:c})}finally{T.v=!0}w!==void 0&&(p(10,w),r=w)}return[C(r,c),function(){for(var d=0;d<l.length;d++)l[d].call(r)}]}}function C(a,o){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,c,l,r){if(r!==void 0)var y=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var f=Object.create(y===void 0?null:y),T=v(o,c,f);return l.length||C(o,f),{e:T,get c(){return S(o,l,f)}}}}function Hr(h,t,e,n){return(Hr=ts())(h,t,e,n)}var Xr,Ur,es;Xr=Bt({access:Y.Read,targetRestrictions:[gt]});var Gr=class{static{({c:[es,Ur]}=Hr(this,[],[Xr]))}constructor(t=O.use(gt),e=O.use(q)){let n=new Array,p=t.processorConstructor;do{let g=ot.get(p).getMetadata(le.METADATA_USER_EVENT_LISTENER_PROPERIES);if(g)for(let v of g)n.push(v)}while(p=Object.getPrototypeOf(p));this.mEventListenerList=new Array,this.mTargetElement=e;for(let g of n){let[v,b]=g,S=Reflect.get(t.processor,v);S=S.bind(t.processor),this.mEventListenerList.push([b,S]),this.mTargetElement.addEventListener(b,S)}}mEventListenerList;mTargetElement;onDeconstruct(){for(let t of this.mEventListenerList){let[e,n]=t;this.mTargetElement.removeEventListener(e,n)}}static{Ur()}};var Ce=class{mManager;mDocument;get document(){return this.mDocument}constructor(t){this.mManager=t,this.mDocument=null}setDocument(t){this.mDocument=t,this.mManager.integrity.revalidate(),this.mManager.dispatch(F.Document,this.mDocument),this.setDefaultActiveFunction()}removeFunction(t){let e=this.mDocument;if(!e)return;let n=null;for(let p of e.functions)if(p.id===t){n=p,e.removeFunction(p);break}n&&(this.mManager.dispatch(F.Function,n),this.setDefaultActiveFunction())}transformNode(t,e){let n={x:t.transformation.x,y:t.transformation.y,width:t.transformation.width,height:t.transformation.height,...e};t.moveTo(n.x,n.y),t.resizeTo(n.width,n.height),this.mManager.dispatch(F.NodeTransform,t)}addFunction(t){let e=this.mDocument,n=this.mManager.project;if(!e||!n||!n.userFunctions.has(t))return;let p=new bt(n,e,{definitionId:t,id:crypto.randomUUID(),isSystem:!1,label:`Function ${e.functions.size}`});e.addFunction(p),this.mManager.dispatch(F.Function,p),this.mManager.setActiveFunction(p.id)}addNode(t,e,n){let p=t.addNodeByDefinition(e,n);return this.mManager.dispatch(F.Node,p),p}removeNode(t){t.function.removeNode(t),this.mManager.dispatch(F.Node,t)}connectPorts(t,e){try{t.connect(e)}catch(n){return console.error("[PotatnoCodeUiManager] Connection failed:",n),!1}return this.mManager.dispatch(F.Connection,t),this.mManager.dispatch(F.Connection,e),!0}disconnectPorts(t,e){t.disconnect(e),this.mManager.dispatch(F.Connection,t),this.mManager.dispatch(F.Connection,e)}setPortDirectValue(t,e){t.setDirectValue(e),this.mManager.dispatch(F.Node,t)}updateNode(t,e){t&&(e(t),this.mManager.dispatch(F.Node,t))}setDefaultActiveFunction(){if(!this.mDocument||this.mDocument.functions.size===0)return;let t=(()=>{let e=[...this.mDocument.functions];return e.some(p=>p.id===this.mManager.activeFunctionId)?this.mManager.activeFunctionId:e[0].id})();this.mManager.activeFunctionId!==t&&this.mManager.setActiveFunction(t)}};var Pe=class{mProject;constructor(t){this.mProject=t}deserialize(t){let e=new Mt(this.mProject);for(let n of t.functions)e.addFunction(this.deserializeFunction(n,e));return e}deserializeFunction(t,e){let n=new bt(this.mProject,e,{definitionId:t.definitionId,id:t.id,label:t.label,isSystem:t.isSystem});for(let g of t.imports)n.addImport(g);for(let g of t.inputs)n.addInput({label:g.label,dataType:g.dataType});for(let g of t.outputs)n.addOutput({label:g.label,dataType:g.dataType});let p=new Map;for(let g of t.nodes)p.set(g.id,this.deserializeNode(g,n,e));for(let g of t.connections){if(!p.has(g.sourceNodeId)||!p.has(g.targetNodeId))continue;let v=p.get(g.sourceNodeId),b=p.get(g.targetNodeId),S=v.outputs.map.get(g.sourcePortId),C=b.inputs.map.get(g.targetPortId);!S||!C||S.connect(C)}return n}deserializeNode(t,e,n){let p=n.nodeDefinitions.find(v=>v.id===t.definitionId),g=(()=>{if(p)return e.addNodeByDefinition(p,t.transformation);let v=t.ports.filter(S=>S.direction==="input").map(S=>({dataType:S.dataType,definitionId:S.definitionId,label:S.label,portType:S.portType})),b=t.ports.filter(S=>S.direction==="output").map(S=>({dataType:S.dataType,definitionId:S.definitionId,label:S.label,portType:S.portType}));return new yt(this.mProject,n,e,{category:t.category,definitionId:t.definitionId,ports:{input:v,output:b},label:t.label,transformation:{...t.transformation}})})();g.label=t.label,e.addNode(g);for(let v of t.ports)if(v.portType==="value"&&v.directValue.length>0){let b=g.inputs.map.get(v.definitionId);b&&b.setDirectValue(v.directValue)}return g.preview=t.preview??null,g}};var Me=class{constructor(){}serialize(t){return{functions:[...t.functions].map(e=>this.serializeFunction(e))}}serializeFunction(t){let e=new Map;[...t.nodes].forEach((b,S)=>{e.set(b,`n${S}`)});let n=[...t.nodes].map(b=>this.serializeNode(b,e.get(b))),p=[];for(let b of t.nodes){let S=e.get(b);for(let C of b.outputs.list)for(let a of C.connectedPorts){let o=e.get(a.node);p.push({sourceNodeId:S,sourcePortId:C.definitionId,targetNodeId:o,targetPortId:a.definitionId})}}let g=t.inputs.map(b=>({label:b.label,dataType:b.dataType})),v=t.outputs.map(b=>({label:b.label,dataType:b.dataType}));return{id:t.id,label:t.label,isSystem:t.isSystem,definitionId:t.definitionId,inputs:g,outputs:v,imports:[...t.imports],nodes:n,connections:p}}serializeNode(t,e){let n=[...t.inputs.list,...t.outputs.list].map(g=>({definitionId:g.definitionId,label:g.label,direction:g.direction,portType:g.portType,dataType:g.portType==="value"?g.dataType:null,directValue:[...g.directValue]})),p=t.preview?structuredClone(t.preview):null;return{id:e,definitionId:t.definitionId,category:t.category,label:t.label,transformation:{...t.transformation},ports:n,preview:p}}};var Ne=class h{static MAX_HISTORY_ITEMS=100;mManager;mSnapshots;mSnapshotIndex;get canRedo(){return this.mSnapshotIndex<this.mSnapshots.length-1}get canUndo(){return this.mSnapshotIndex>0}constructor(t){this.mManager=t,this.mSnapshotIndex=-1,this.mSnapshots=new Array;let e=0;this.mManager.subscribe(F.Any,null,()=>{globalThis.clearTimeout(e),e=globalThis.setTimeout(()=>{this.pushHistory()},1e3)})}undo(){if(!this.canUndo)return;let t=this.mSnapshots[--this.mSnapshotIndex],e=JSON.parse(t);this.restoreHistory(e)}redo(){if(!this.canRedo)return;let t=this.mSnapshots[++this.mSnapshotIndex],e=JSON.parse(t);this.restoreHistory(e)}clear(){this.mSnapshots.length=0,this.mSnapshotIndex=-1}pushHistory(){let t=this.mManager.graph.document;if(!t)return;this.mSnapshots.splice(this.mSnapshotIndex+1);let e=new Me().serialize(t),n=JSON.stringify(e);this.mSnapshots.length>0&&this.mSnapshots.at(-1)===n||(this.mSnapshotIndex=this.mSnapshots.push(n)-1,this.mSnapshots.length>h.MAX_HISTORY_ITEMS&&(this.mSnapshots.shift(),this.mSnapshotIndex--))}restoreHistory(t){let e=this.mManager.project;e&&this.mManager.graph.setDocument(new Pe(e).deserialize(t))}};var Ae=class{mErrorList;mErrorItems;mIsDirty;mManager;get errors(){return this.mIsDirty&&this.revalidate(),this.mErrorList}get errorItems(){return this.mIsDirty&&this.revalidate(),this.mErrorItems}get isValid(){return this.mIsDirty&&this.revalidate(),this.mErrorItems.size===0}constructor(t){this.mManager=t,this.mErrorList=new Array,this.mErrorItems=new Set,this.mIsDirty=!0;let e=0;this.mManager.subscribe(F.Any,null,()=>{this.mIsDirty=!0,globalThis.clearTimeout(e),e=globalThis.setTimeout(()=>{this.revalidate()},1e3)})}revalidate(){if(this.mIsDirty&&(this.mIsDirty=!1,!!this.mManager.graph.document)){this.mErrorList.splice(0,this.mErrorList.length),this.mErrorItems.clear();for(let t of this.mManager.graph.document.validate())switch(this.mErrorItems.add(t.item),!0){case t.item instanceof Tt:{this.mErrorList.push({location:`Node "${t.item.node.label}"`,message:t.message});break}case t.item instanceof yt:{this.mErrorList.push({location:`Node "${t.item.label}"`,message:t.message});break}}}}};function rs(){function h(a,o){return function(l){e(o,"addInitializer"),n(l,"An initializer"),a.push(l)}}function t(a,o,c,l,r,y,f,T,w){var d;switch(r){case 1:d="accessor";break;case 2:d="method";break;case 3:d="getter";break;case 4:d="setter";break;default:d="field"}var s={kind:d,name:f?"#"+o:o,static:y,private:f,metadata:T},m={v:!1};s.addInitializer=h(l,m);var i,u;r===0?f?(i=c.get,u=c.set):(i=function(){return this[o]},u=function(x){this[o]=x}):r===2?i=function(){return c.value}:((r===1||r===3)&&(i=function(){return c.get.call(this)}),(r===1||r===4)&&(u=function(x){c.set.call(this,x)})),s.access=i&&u?{get:i,set:u}:i?{get:i}:{set:u};try{return a(w,s)}finally{m.v=!0}}function e(a,o){if(a.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(a,o){if(typeof a!="function")throw new TypeError(o+" must be a function")}function p(a,o){var c=typeof o;if(a===1){if(c!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(c!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function g(a,o,c,l,r,y,f,T,w){var d=c[0],s,m,i;f?r===0||r===1?s={get:c[3],set:c[4]}:r===3?s={get:c[3]}:r===4?s={set:c[3]}:s={value:c[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,l)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var u,x,I;if(typeof d=="function")u=t(d,l,s,T,r,y,f,w,i),u!==void 0&&(p(r,u),r===0?m=u:r===1?(m=u.init,x=u.get||i.get,I=u.set||i.set,i={get:x,set:I}):i=u);else for(var P=d.length-1;P>=0;P--){var M=d[P];if(u=t(M,l,s,T,r,y,f,w,i),u!==void 0){p(r,u);var N;r===0?N=u:r===1?(N=u.init,x=u.get||i.get,I=u.set||i.set,i={get:x,set:I}):i=u,N!==void 0&&(m===void 0?m=N:typeof m=="function"?m=[m,N]:m.push(N))}}if(r===0||r===1){if(m===void 0)m=function(D,E){return E};else if(typeof m!="function"){var _=m;m=function(D,E){for(var R=E,L=0;L<_.length;L++)R=_[L].call(D,R);return R}}else{var $=m;m=function(D,E){return $.call(D,E)}}a.push(m)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),f?r===1?(a.push(function(D,E){return i.get.call(D,E)}),a.push(function(D,E){return i.set.call(D,E)})):r===2?a.push(i):a.push(function(D,E){return i.call(D,E)}):Object.defineProperty(o,l,s))}function v(a,o,c){for(var l=[],r,y,f=new Map,T=new Map,w=0;w<o.length;w++){var d=o[w];if(Array.isArray(d)){var s=d[1],m=d[2],i=d.length>3,u=s>=5,x,I;if(u?(x=a,s=s-5,y=y||[],I=y):(x=a.prototype,r=r||[],I=r),s!==0&&!i){var P=u?T:f,M=P.get(m)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+m);!M&&s>2?P.set(m,s):P.set(m,!0)}g(l,x,d,m,s,u,i,I,c)}}return b(l,r),b(l,y),l}function b(a,o){o&&a.push(function(c){for(var l=0;l<o.length;l++)o[l].call(c);return c})}function S(a,o,c){if(o.length>0){for(var l=[],r=a,y=a.name,f=o.length-1;f>=0;f--){var T={v:!1};try{var w=o[f](r,{kind:"class",name:y,addInitializer:h(l,T),metadata:c})}finally{T.v=!0}w!==void 0&&(p(10,w),r=w)}return[C(r,c),function(){for(var d=0;d<l.length;d++)l[d].call(r)}]}}function C(a,o){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,c,l,r){if(r!==void 0)var y=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var f=Object.create(y===void 0?null:y),T=v(o,c,f);return l.length||C(o,f),{e:T,get c(){return S(o,l,f)}}}}function qr(h,t,e,n){return(qr=rs())(h,t,e,n)}var Jr,Yr,Wr,Q;Jr=O.injectable("singleton");var Zr=class extends(Wr=EventTarget){static{({c:[Q,Yr]}=qr(this,[],[Jr],Wr))}constructor(){super(),this.mIntegrity=new Ae(this),this.mGraph=new Ce(this),this.mHistory=new Ne(this),this.mActiveFunctionId="",this.mPreviewManager=null,this.mProject=null}mActiveFunctionId;mPreviewManager;mProject;mGraph;mHistory;mIntegrity;get graph(){return this.mGraph}get history(){return this.mHistory}get integrity(){return this.mIntegrity}get activeFunction(){let t=this.mGraph.document;if(!t)return null;for(let e of t.functions)if(e.id===this.mActiveFunctionId)return e;return null}get activeFunctionId(){return this.mActiveFunctionId}get project(){return this.mProject}get previewManager(){return this.mPreviewManager}get previewTabs(){return this.mPreviewManager?.previewTabs??[]}deconstruct(){this.mPreviewManager?.dispose()}getNodePreviewDriver(t){return this.mPreviewManager?.getNodeDescriptor(t)?.driver??null}getPreviewDisplaysForNode(t){return this.mPreviewManager?.getPreviewDisplaysForNode(t)??[]}initialize(t,e){this.mProject=t,this.mGraph.setDocument(e)}subscribe(t,e,n){let p=v=>{if(!e)return!0;let b=v;for(;b!==null;){if(e.has(b))return!0;switch(!0){case b instanceof Tt:{b=b.node;break}case b instanceof yt:{b=b.function;break}case b instanceof bt:{b=b.document;break}default:b=null}}return!1},g=v=>{t!==F.Any&&(v.changeType&t)===0||e!==null&&!p(v.item)||n(v)};return this.addEventListener(me.EVENT_TYPE,g),()=>{this.removeEventListener(me.EVENT_TYPE,g)}}setActiveFunction(t){let e=this.mGraph.document;if(!(!e||this.mActiveFunctionId===t)){for(let n of e.functions)if(n.id===t){this.mActiveFunctionId=t,this.mPreviewManager?.setActiveFunction(n),this.dispatch(F.ActiveFunction,n);return}}}setPreviewDisplay(t){this.mPreviewManager?.setActivePreviewDisplay(t),this.mPreviewManager?.update()}setPreviewOutput(t){this.mPreviewManager?.setActivePreviewOutput(t),this.mPreviewManager?.update()}setNodePreview(t,e){if(e===""||t.preview?.portId===e)t.preview=null;else{let n=this.getPreviewDisplaysForNode(t),p=t.preview&&n.includes(t.preview.displayId)?t.preview.displayId:n[0];if(!p)return;t.preview={portId:e,displayId:p}}this.dispatch(F.Node,t)}setNodePreviewDisplay(t,e){t.preview&&(t.preview={portId:t.preview.portId,displayId:e},this.dispatch(F.Node,t))}triggerPreviewUpdate(){let t=this.mIntegrity.errors.length>0;return this.mPreviewManager?.render(t)??Promise.resolve()}updateFunctionProperties(t){let e=this.activeFunction;if(e){if(t.name!==void 0&&(e.label=t.name),t.inputs!==void 0){for(let n of[...e.inputs])e.removeInput(n);for(let n of t.inputs)e.addInput({dataType:n.type,label:n.name})}if(t.outputs!==void 0){for(let n of[...e.outputs])e.removeOutput(n);for(let n of t.outputs)e.addOutput({dataType:n.type,label:n.name})}if(t.imports!==void 0){let n=new Set(e.imports),p=new Set(t.imports);for(let g of[...e.imports])p.has(g)||e.removeImport(g);for(let g of t.imports)n.has(g)||e.addImport(g)}this.dispatch(F.Function,e)}}dispatch(t,e){this.dispatchEvent(new me(t,e))}static{Yr()}},F={Any:0,Connection:1,Document:2,Function:4,Node:8,NodeTransform:16,Preview:32,ActiveFunction:64},me=class h extends Event{static EVENT_TYPE="PotatnoUiManagerChangeEvent";mChangeType;mEventItem;get changeType(){return this.mChangeType}get item(){return this.mEventItem}constructor(t,e){super(h.EVENT_TYPE),this.mChangeType=t,this.mEventItem=e}};var Kr=`:host {\r
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
`;var Qr=`<div class="editor-layout">
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
`;var kr=`:host {\r
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
`;var to=`<div class="function-list-content">\r
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
`;function as(){function h(a,o){return function(l){e(o,"addInitializer"),n(l,"An initializer"),a.push(l)}}function t(a,o,c,l,r,y,f,T,w){var d;switch(r){case 1:d="accessor";break;case 2:d="method";break;case 3:d="getter";break;case 4:d="setter";break;default:d="field"}var s={kind:d,name:f?"#"+o:o,static:y,private:f,metadata:T},m={v:!1};s.addInitializer=h(l,m);var i,u;r===0?f?(i=c.get,u=c.set):(i=function(){return this[o]},u=function(x){this[o]=x}):r===2?i=function(){return c.value}:((r===1||r===3)&&(i=function(){return c.get.call(this)}),(r===1||r===4)&&(u=function(x){c.set.call(this,x)})),s.access=i&&u?{get:i,set:u}:i?{get:i}:{set:u};try{return a(w,s)}finally{m.v=!0}}function e(a,o){if(a.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(a,o){if(typeof a!="function")throw new TypeError(o+" must be a function")}function p(a,o){var c=typeof o;if(a===1){if(c!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(c!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function g(a,o,c,l,r,y,f,T,w){var d=c[0],s,m,i;f?r===0||r===1?s={get:c[3],set:c[4]}:r===3?s={get:c[3]}:r===4?s={set:c[3]}:s={value:c[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,l)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var u,x,I;if(typeof d=="function")u=t(d,l,s,T,r,y,f,w,i),u!==void 0&&(p(r,u),r===0?m=u:r===1?(m=u.init,x=u.get||i.get,I=u.set||i.set,i={get:x,set:I}):i=u);else for(var P=d.length-1;P>=0;P--){var M=d[P];if(u=t(M,l,s,T,r,y,f,w,i),u!==void 0){p(r,u);var N;r===0?N=u:r===1?(N=u.init,x=u.get||i.get,I=u.set||i.set,i={get:x,set:I}):i=u,N!==void 0&&(m===void 0?m=N:typeof m=="function"?m=[m,N]:m.push(N))}}if(r===0||r===1){if(m===void 0)m=function(D,E){return E};else if(typeof m!="function"){var _=m;m=function(D,E){for(var R=E,L=0;L<_.length;L++)R=_[L].call(D,R);return R}}else{var $=m;m=function(D,E){return $.call(D,E)}}a.push(m)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),f?r===1?(a.push(function(D,E){return i.get.call(D,E)}),a.push(function(D,E){return i.set.call(D,E)})):r===2?a.push(i):a.push(function(D,E){return i.call(D,E)}):Object.defineProperty(o,l,s))}function v(a,o,c){for(var l=[],r,y,f=new Map,T=new Map,w=0;w<o.length;w++){var d=o[w];if(Array.isArray(d)){var s=d[1],m=d[2],i=d.length>3,u=s>=5,x,I;if(u?(x=a,s=s-5,y=y||[],I=y):(x=a.prototype,r=r||[],I=r),s!==0&&!i){var P=u?T:f,M=P.get(m)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+m);!M&&s>2?P.set(m,s):P.set(m,!0)}g(l,x,d,m,s,u,i,I,c)}}return b(l,r),b(l,y),l}function b(a,o){o&&a.push(function(c){for(var l=0;l<o.length;l++)o[l].call(c);return c})}function S(a,o,c){if(o.length>0){for(var l=[],r=a,y=a.name,f=o.length-1;f>=0;f--){var T={v:!1};try{var w=o[f](r,{kind:"class",name:y,addInitializer:h(l,T),metadata:c})}finally{T.v=!0}w!==void 0&&(p(10,w),r=w)}return[C(r,c),function(){for(var d=0;d<l.length;d++)l[d].call(r)}]}}function C(a,o){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,c,l,r){if(r!==void 0)var y=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var f=Object.create(y===void 0?null:y),T=v(o,c,f);return l.length||C(o,f),{e:T,get c(){return S(o,l,f)}}}}function io(h,t,e,n){return(io=as())(h,t,e,n)}var so,eo,ao,ro,oo,ls;so=K({selector:"potatno-function-list",template:to,style:kr}),ao=U.state();var no=class{static{({e:[ro,oo],c:[ls,eo]}=io(this,[[ao,1,"mShowPopup"]],[so]))}constructor(t=O.use(z),e=O.use(Q)){this.mComponent=t,this.mManager=e,this.mUnsubscribe=null}mComponent;mManager;mUnsubscribe;#t=(oo(this),ro(this,!1));get mShowPopup(){return this.#t}set mShowPopup(t){this.#t=t}get activeFunctionId(){return this.mManager.activeFunctionId}get functions(){let t=this.mManager.graph.document;if(!t)return[];let e=[];for(let n of t.functions)e.push({id:n.id,label:n.label,name:n.label,system:n.isSystem});return e}get hasUserFunctionDefinitions(){return this.userFunctionDefinitions.length>0}get showPopup(){return this.mShowPopup}get userFunctionDefinitions(){let t=this.mManager.project;return t?[...t.userFunctions.values()].map(e=>({id:e.id})):[]}closePopup(){this.mShowPopup=!1}getEntryClass(t){return t===this.activeFunctionId?"function-entry active":"function-entry"}onConnect(){this.mUnsubscribe=this.mManager.subscribe(F.Document|F.Function|F.ActiveFunction,null,()=>{this.mComponent.updater.update()})}onDeconstruct(){this.mUnsubscribe?.(),this.mUnsubscribe=null}onAddButtonClick(){let t=this.userFunctionDefinitions;t.length===1?this.mManager.graph.addFunction(t[0].id):this.mShowPopup=!this.mShowPopup}onDefinitionSelect(t){this.mShowPopup=!1,this.mManager.graph.addFunction(t)}onFunctionDelete(t,e){t.stopPropagation(),this.mManager.graph.removeFunction(e)}onFunctionSelect(t){this.mManager.setActiveFunction(t)}static{eo()}};var Re=class h{static MAX_ZOOM=2;static MIN_ZOOM=.25;mGridSize;mPanX;mPanY;mSelectionEnd;mSelectionStart;mZoom;get gridSize(){return this.mGridSize}get panX(){return this.mPanX}get panY(){return this.mPanY}get selectionEnd(){return this.mSelectionEnd}get selectionStart(){return this.mSelectionStart}get zoom(){return this.mZoom}constructor(t=20){this.mGridSize=t,this.mPanX=0,this.mPanY=0,this.mZoom=1,this.mSelectionStart=null,this.mSelectionEnd=null}clearSelection(){this.mSelectionStart=null,this.mSelectionEnd=null}getGridBackgroundCss(){let t=this.mGridSize*this.mZoom,e=this.mPanX%t,n=this.mPanY%t,p=t*5,g=this.mPanX%p,v=this.mPanY%p;return[`background-size: ${t}px ${t}px, ${p}px ${p}px`,`background-position: ${e}px ${n}px, ${g}px ${v}px`,"background-image: radial-gradient(circle, var(--pn-grid-color) 1px, transparent 1px), radial-gradient(circle, var(--pn-grid-color) 1.5px, transparent 1.5px)"].join("; ")}getTransformCss(){return`translate(${this.mPanX}px, ${this.mPanY}px) scale(${this.mZoom})`}pan(t,e){this.mPanX+=t,this.mPanY+=e}screenToWorld(t,e){return{x:(t-this.mPanX)/this.mZoom,y:(e-this.mPanY)/this.mZoom}}setSelectionEnd(t,e){this.mSelectionEnd={x:t,y:e}}setSelectionStart(t,e){this.mSelectionStart={x:t,y:e}}snapToGrid(t,e){return{x:Math.round(t/this.mGridSize)*this.mGridSize,y:Math.round(e/this.mGridSize)*this.mGridSize}}worldToScreen(t,e){return{x:t*this.mZoom+this.mPanX,y:e*this.mZoom+this.mPanY}}zoomAt(t,e,n){let p=this.mZoom,g=1+n,v=this.mZoom*g;v=Math.max(h.MIN_ZOOM,Math.min(h.MAX_ZOOM,v));let b=(t-this.mPanX)/p,S=(e-this.mPanY)/p;this.mZoom=v,this.mPanX=t-b*this.mZoom,this.mPanY=e-S*this.mZoom}};var Le=class{mData;get hasData(){return this.mData!==null}constructor(){this.mData=null}copy(t){let e=[],n=new Map;for(let v of t)n.set(v,e.length),e.push(v);if(e.length===0)return;let p=e.map(v=>{let b={};for(let[S,C]of v.inputs.map)C.portType==="value"&&C.directValue.length>0&&(b[S]=[...C.directValue]);return{definitionId:v.definitionId,transformation:{...v.transformation},label:v.label,inputDirectValues:b}}),g=[];for(let v of e){let b=n.get(v);for(let[S,C]of v.outputs.map)for(let a of C.connectedPorts){let o=n.get(a.node);o!==void 0&&g.push({sourceNodeIndex:b,sourcePortName:S,targetNodeIndex:o,targetPortName:a.label})}}this.mData={nodes:p,internalConnections:g}}paste(t,e,n,p){if(!this.mData)return[];let g=[];for(let v of this.mData.nodes){let b=t.project.nodeDefinitions.find(a=>a.id===v.definitionId)??e.nodeDefinitions.find(a=>a.id===v.definitionId);if(!b)continue;let S={x:v.transformation.x+n,y:v.transformation.y+p,width:v.transformation.width,height:v.transformation.height},C=t.addNodeByDefinition(b,S);C.label=v.label;for(let[a,o]of Object.entries(v.inputDirectValues)){let c=C.inputs.map.get(a);c&&c.setDirectValue(o)}g.push(C)}for(let v of this.mData.internalConnections){let b=g[v.sourceNodeIndex],S=g[v.targetNodeIndex];if(!b||!S)continue;let C=b.outputs.map.get(v.sourcePortName),a=S.inputs.map.get(v.targetPortName);C&&a&&C.connect(a)}return g}};function cs(){function h(a,o){return function(l){e(o,"addInitializer"),n(l,"An initializer"),a.push(l)}}function t(a,o,c,l,r,y,f,T,w){var d;switch(r){case 1:d="accessor";break;case 2:d="method";break;case 3:d="getter";break;case 4:d="setter";break;default:d="field"}var s={kind:d,name:f?"#"+o:o,static:y,private:f,metadata:T},m={v:!1};s.addInitializer=h(l,m);var i,u;r===0?f?(i=c.get,u=c.set):(i=function(){return this[o]},u=function(x){this[o]=x}):r===2?i=function(){return c.value}:((r===1||r===3)&&(i=function(){return c.get.call(this)}),(r===1||r===4)&&(u=function(x){c.set.call(this,x)})),s.access=i&&u?{get:i,set:u}:i?{get:i}:{set:u};try{return a(w,s)}finally{m.v=!0}}function e(a,o){if(a.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(a,o){if(typeof a!="function")throw new TypeError(o+" must be a function")}function p(a,o){var c=typeof o;if(a===1){if(c!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(c!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function g(a,o,c,l,r,y,f,T,w){var d=c[0],s,m,i;f?r===0||r===1?s={get:c[3],set:c[4]}:r===3?s={get:c[3]}:r===4?s={set:c[3]}:s={value:c[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,l)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var u,x,I;if(typeof d=="function")u=t(d,l,s,T,r,y,f,w,i),u!==void 0&&(p(r,u),r===0?m=u:r===1?(m=u.init,x=u.get||i.get,I=u.set||i.set,i={get:x,set:I}):i=u);else for(var P=d.length-1;P>=0;P--){var M=d[P];if(u=t(M,l,s,T,r,y,f,w,i),u!==void 0){p(r,u);var N;r===0?N=u:r===1?(N=u.init,x=u.get||i.get,I=u.set||i.set,i={get:x,set:I}):i=u,N!==void 0&&(m===void 0?m=N:typeof m=="function"?m=[m,N]:m.push(N))}}if(r===0||r===1){if(m===void 0)m=function(D,E){return E};else if(typeof m!="function"){var _=m;m=function(D,E){for(var R=E,L=0;L<_.length;L++)R=_[L].call(D,R);return R}}else{var $=m;m=function(D,E){return $.call(D,E)}}a.push(m)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),f?r===1?(a.push(function(D,E){return i.get.call(D,E)}),a.push(function(D,E){return i.set.call(D,E)})):r===2?a.push(i):a.push(function(D,E){return i.call(D,E)}):Object.defineProperty(o,l,s))}function v(a,o,c){for(var l=[],r,y,f=new Map,T=new Map,w=0;w<o.length;w++){var d=o[w];if(Array.isArray(d)){var s=d[1],m=d[2],i=d.length>3,u=s>=5,x,I;if(u?(x=a,s=s-5,y=y||[],I=y):(x=a.prototype,r=r||[],I=r),s!==0&&!i){var P=u?T:f,M=P.get(m)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+m);!M&&s>2?P.set(m,s):P.set(m,!0)}g(l,x,d,m,s,u,i,I,c)}}return b(l,r),b(l,y),l}function b(a,o){o&&a.push(function(c){for(var l=0;l<o.length;l++)o[l].call(c);return c})}function S(a,o,c){if(o.length>0){for(var l=[],r=a,y=a.name,f=o.length-1;f>=0;f--){var T={v:!1};try{var w=o[f](r,{kind:"class",name:y,addInitializer:h(l,T),metadata:c})}finally{T.v=!0}w!==void 0&&(p(10,w),r=w)}return[C(r,c),function(){for(var d=0;d<l.length;d++)l[d].call(r)}]}}function C(a,o){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,c,l,r){if(r!==void 0)var y=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var f=Object.create(y===void 0?null:y),T=v(o,c,f);return l.length||C(o,f),{e:T,get c(){return S(o,l,f)}}}}function uo(h,t,e,n){return(uo=cs())(h,t,e,n)}var ho,lo,Ut;ho=O.injectable("singleton");var co=class{static{({c:[Ut,lo]}=uo(this,[],[ho]))}constructor(){this.mElements=new Map}mElements;entries(){return this.mElements.entries()}get(t){return this.mElements.get(t)}register(t,e){this.mElements.set(t,e)}unregister(t){this.mElements.delete(t)}static{lo()}};var mo=`:host {\r
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
`;var po=`<div #canvasWrapper class="canvas-wrapper"\r
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
`;(function(h){h.Function="function",h.Comment="comment",h.Input="input",h.Output="output",h.Reroute="reroute"})(ht||(ht={}));var Ct=class h{static META={[ht.Function]:{icon:"f",cssColor:"var(--pn-accent-blue)",label:"Function"},[ht.Comment]:{icon:"\u{1F4AC}",cssColor:"var(--pn-accent-yellow)",label:"Comment"},[ht.Input]:{icon:"\u2192",cssColor:"var(--pn-accent-green)",label:"Input"},[ht.Output]:{icon:"\u2190",cssColor:"var(--pn-accent-red)",label:"Output"},[ht.Reroute]:{icon:"\u25C7",cssColor:"var(--pn-text-muted)",label:"Reroute"}};static get(t){let e=h.META[t];return e||{icon:"\u25C6",cssColor:`hsl(${h.hashStringToHue(t)}, 60%, 55%)`,label:t.charAt(0).toUpperCase()+t.slice(1)}}static hashStringToHue(t){let e=0;for(let n=0;n<t.length;n++)e=(e<<5)-e+t.charCodeAt(n),e=e&e;return Math.abs(e)%360}},ht;var fo=`:host {
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
`;var go=`$if(this.open) {
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
`;function ds(){function h(a,o){return function(l){e(o,"addInitializer"),n(l,"An initializer"),a.push(l)}}function t(a,o,c,l,r,y,f,T,w){var d;switch(r){case 1:d="accessor";break;case 2:d="method";break;case 3:d="getter";break;case 4:d="setter";break;default:d="field"}var s={kind:d,name:f?"#"+o:o,static:y,private:f,metadata:T},m={v:!1};s.addInitializer=h(l,m);var i,u;r===0?f?(i=c.get,u=c.set):(i=function(){return this[o]},u=function(x){this[o]=x}):r===2?i=function(){return c.value}:((r===1||r===3)&&(i=function(){return c.get.call(this)}),(r===1||r===4)&&(u=function(x){c.set.call(this,x)})),s.access=i&&u?{get:i,set:u}:i?{get:i}:{set:u};try{return a(w,s)}finally{m.v=!0}}function e(a,o){if(a.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(a,o){if(typeof a!="function")throw new TypeError(o+" must be a function")}function p(a,o){var c=typeof o;if(a===1){if(c!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(c!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function g(a,o,c,l,r,y,f,T,w){var d=c[0],s,m,i;f?r===0||r===1?s={get:c[3],set:c[4]}:r===3?s={get:c[3]}:r===4?s={set:c[3]}:s={value:c[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,l)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var u,x,I;if(typeof d=="function")u=t(d,l,s,T,r,y,f,w,i),u!==void 0&&(p(r,u),r===0?m=u:r===1?(m=u.init,x=u.get||i.get,I=u.set||i.set,i={get:x,set:I}):i=u);else for(var P=d.length-1;P>=0;P--){var M=d[P];if(u=t(M,l,s,T,r,y,f,w,i),u!==void 0){p(r,u);var N;r===0?N=u:r===1?(N=u.init,x=u.get||i.get,I=u.set||i.set,i={get:x,set:I}):i=u,N!==void 0&&(m===void 0?m=N:typeof m=="function"?m=[m,N]:m.push(N))}}if(r===0||r===1){if(m===void 0)m=function(D,E){return E};else if(typeof m!="function"){var _=m;m=function(D,E){for(var R=E,L=0;L<_.length;L++)R=_[L].call(D,R);return R}}else{var $=m;m=function(D,E){return $.call(D,E)}}a.push(m)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),f?r===1?(a.push(function(D,E){return i.get.call(D,E)}),a.push(function(D,E){return i.set.call(D,E)})):r===2?a.push(i):a.push(function(D,E){return i.call(D,E)}):Object.defineProperty(o,l,s))}function v(a,o,c){for(var l=[],r,y,f=new Map,T=new Map,w=0;w<o.length;w++){var d=o[w];if(Array.isArray(d)){var s=d[1],m=d[2],i=d.length>3,u=s>=5,x,I;if(u?(x=a,s=s-5,y=y||[],I=y):(x=a.prototype,r=r||[],I=r),s!==0&&!i){var P=u?T:f,M=P.get(m)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+m);!M&&s>2?P.set(m,s):P.set(m,!0)}g(l,x,d,m,s,u,i,I,c)}}return b(l,r),b(l,y),l}function b(a,o){o&&a.push(function(c){for(var l=0;l<o.length;l++)o[l].call(c);return c})}function S(a,o,c){if(o.length>0){for(var l=[],r=a,y=a.name,f=o.length-1;f>=0;f--){var T={v:!1};try{var w=o[f](r,{kind:"class",name:y,addInitializer:h(l,T),metadata:c})}finally{T.v=!0}w!==void 0&&(p(10,w),r=w)}return[C(r,c),function(){for(var d=0;d<l.length;d++)l[d].call(r)}]}}function C(a,o){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,c,l,r){if(r!==void 0)var y=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var f=Object.create(y===void 0?null:y),T=v(o,c,f);return l.length||C(o,f),{e:T,get c(){return S(o,l,f)}}}}function So(h,t,e,n){return(So=ds())(h,t,e,n)}var Io,vo,Co,Po,Mo,No,Ao,yo,bo,wo,xo,To,Eo,fs;Io=K({selector:"potatno-add-node-popup",template:go,style:fo}),Co=U.state(),Po=U.state({complexValue:!0}),Mo=it("searchInput"),No=ut("node-select"),Ao=ut("close");var Do=class{static{({e:[yo,bo,wo,xo,To,Eo],c:[fs,vo]}=So(this,[[[et,Co],1,"open"],[Po,1,"mFilteredEntries"],[Mo,1,"searchInput"],[No,1,"mNodeSelect"],[Ao,1,"mClose"]],[Io]))}constructor(t=O.use(Q)){this.mManager=t,this.mSearchQuery="",this.mSelectedDefinitionId=null,this.mWasOpen=!1,this.mFilteredEntries=[]}mManager;mSearchQuery;mSelectedDefinitionId;mWasOpen;#t=(Eo(this),yo(this,!1));get open(){return this.#t}set open(t){this.#t=t}#e=bo(this,[]);get mFilteredEntries(){return this.#e}set mFilteredEntries(t){this.#e=t}#r=wo(this);get searchInput(){return this.#r}set searchInput(t){this.#r=t}#o=xo(this);get mNodeSelect(){return this.#o}set mNodeSelect(t){this.#o=t}#n=To(this);get mClose(){return this.#n}set mClose(t){this.#n=t}get results(){return this.mFilteredEntries}get searchValue(){return this.mSearchQuery}getEntryClass(t){return t.id===this.mSelectedDefinitionId?"add-node-result selected":"add-node-result"}getEntryColor(t){return Ct.get(t.category).cssColor}getEntryIcon(t){return Ct.get(t.category).icon}getEntryCategoryLabel(t){return Ct.get(t.category).label}onConnect(){this.mWasOpen=this.open,this.open&&(this.rebuildResults(),this.focusSearchInput())}onUpdate(){this.open&&!this.mWasOpen&&(this.rebuildResults(),this.focusSearchInput()),this.mWasOpen=this.open}onSearchInput(t){t.target instanceof HTMLInputElement&&(this.mSearchQuery=t.target.value,this.rebuildResults())}onSearchKeyDown(t){if(t.key==="Escape"){t.preventDefault(),this.mClose.dispatchEvent(void 0);return}if(t.key==="Enter"){t.preventDefault(),this.emitSelectedEntry();return}(t.key==="ArrowDown"||t.key==="ArrowUp")&&(t.preventDefault(),this.moveSelection(t.key==="ArrowDown"?1:-1))}onEntryPointerDown(t,e){t.preventDefault(),t.stopPropagation(),this.mNodeSelect.dispatchEvent(e.definition)}onRootPointerDown(t){t.stopPropagation()}onRootWheel(t){t.stopPropagation()}onRootContextMenu(t){t.stopPropagation()}buildAvailableNodeDefinitionEntries(t){let e=[],n=new Set;if(!t)return e;let p=v=>{n.has(v.id)||(n.add(v.id),e.push({category:v.category,definition:v,id:v.id,name:v.label}))};for(let v of t.project.nodeDefinitions)p(v);for(let v of t.nodeDefinitions)p(v);let g=new Set(t.imports);for(let v of t.project.imports)if(g.has(v.label))for(let b of v.nodes)p(b);return e}emitSelectedEntry(){let t=this.mFilteredEntries.find(e=>e.id===this.mSelectedDefinitionId)??this.mFilteredEntries[0];t&&this.mNodeSelect.dispatchEvent(t.definition)}focusSearchInput(){requestAnimationFrame(()=>{try{this.searchInput.focus(),this.searchInput.select()}catch{}})}moveSelection(t){if(this.mFilteredEntries.length===0){this.mSelectedDefinitionId=null;return}let n=(Math.max(0,this.mFilteredEntries.findIndex(p=>p.id===this.mSelectedDefinitionId))+t+this.mFilteredEntries.length)%this.mFilteredEntries.length;this.mSelectedDefinitionId=this.mFilteredEntries[n].id,this.mFilteredEntries=[...this.mFilteredEntries]}rebuildResults(){let t=this.mSearchQuery.trim().toLowerCase();this.mFilteredEntries=this.buildAvailableNodeDefinitionEntries(this.mManager.activeFunction).filter(e=>!t||e.name.toLowerCase().includes(t)),this.mFilteredEntries.some(e=>e.id===this.mSelectedDefinitionId)||(this.mSelectedDefinitionId=this.mFilteredEntries[0]?.id??null)}static{vo()}};var We="http://www.w3.org/2000/svg",Ze="data-temp-connection";var Oe=class{clearAll(t){let e=t.querySelectorAll("path");for(let n of e)n.remove()}clearTempConnection(t){let e=t.querySelector(`[${Ze}]`);e&&e.remove()}generateBezierPath(t,e,n,p){let g=Math.abs(n-t),v=Math.max(g*.4,50),b=t+v,S=e,C=n-v;return`M ${t} ${e} C ${b} ${S}, ${C} ${p}, ${n} ${p}`}renderConnections(t,e){let n=t.querySelectorAll(`path:not([${Ze}])`);for(let p of n)p.remove();for(let p of e){let g=this.generateBezierPath(p.sourceX,p.sourceY,p.targetX,p.targetY),v=document.createElementNS(We,"path");v.setAttribute("d",g),v.setAttribute("fill","none"),v.setAttribute("data-connection-id",p.id),v.setAttribute("data-hit-area","true"),v.style.stroke="transparent",v.style.strokeWidth="12",v.style.pointerEvents="stroke",v.style.cursor="pointer",t.appendChild(v);let b=document.createElementNS(We,"path");b.setAttribute("d",g),b.setAttribute("fill","none"),b.setAttribute("data-connection-id",p.id),b.style.stroke=p.valid?"#a6adc8":"#f38ba8",b.style.strokeWidth="2",b.style.pointerEvents="none",p.valid||b.setAttribute("stroke-dasharray","6 3"),t.appendChild(b)}}renderTempConnection(t,e,n,p){this.clearTempConnection(t);let g=document.createElementNS(We,"path");g.setAttribute("d",this.generateBezierPath(e.x,e.y,n.x,n.y)),g.setAttribute("fill","none"),g.setAttribute(Ze,"true"),g.style.stroke=p,g.style.strokeWidth="2",g.style.opacity="0.6",g.style.strokeDasharray="8 4",g.style.pointerEvents="none",t.appendChild(g)}};var Ro=`:host {
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
`;var Lo=`<svg #svgLayer class="svg-layer" xmlns="http://www.w3.org/2000/svg" (contextmenu)="this.onContextMenu($event)"></svg>
`;function ys(){function h(a,o){return function(l){e(o,"addInitializer"),n(l,"An initializer"),a.push(l)}}function t(a,o,c,l,r,y,f,T,w){var d;switch(r){case 1:d="accessor";break;case 2:d="method";break;case 3:d="getter";break;case 4:d="setter";break;default:d="field"}var s={kind:d,name:f?"#"+o:o,static:y,private:f,metadata:T},m={v:!1};s.addInitializer=h(l,m);var i,u;r===0?f?(i=c.get,u=c.set):(i=function(){return this[o]},u=function(x){this[o]=x}):r===2?i=function(){return c.value}:((r===1||r===3)&&(i=function(){return c.get.call(this)}),(r===1||r===4)&&(u=function(x){c.set.call(this,x)})),s.access=i&&u?{get:i,set:u}:i?{get:i}:{set:u};try{return a(w,s)}finally{m.v=!0}}function e(a,o){if(a.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(a,o){if(typeof a!="function")throw new TypeError(o+" must be a function")}function p(a,o){var c=typeof o;if(a===1){if(c!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(c!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function g(a,o,c,l,r,y,f,T,w){var d=c[0],s,m,i;f?r===0||r===1?s={get:c[3],set:c[4]}:r===3?s={get:c[3]}:r===4?s={set:c[3]}:s={value:c[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,l)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var u,x,I;if(typeof d=="function")u=t(d,l,s,T,r,y,f,w,i),u!==void 0&&(p(r,u),r===0?m=u:r===1?(m=u.init,x=u.get||i.get,I=u.set||i.set,i={get:x,set:I}):i=u);else for(var P=d.length-1;P>=0;P--){var M=d[P];if(u=t(M,l,s,T,r,y,f,w,i),u!==void 0){p(r,u);var N;r===0?N=u:r===1?(N=u.init,x=u.get||i.get,I=u.set||i.set,i={get:x,set:I}):i=u,N!==void 0&&(m===void 0?m=N:typeof m=="function"?m=[m,N]:m.push(N))}}if(r===0||r===1){if(m===void 0)m=function(D,E){return E};else if(typeof m!="function"){var _=m;m=function(D,E){for(var R=E,L=0;L<_.length;L++)R=_[L].call(D,R);return R}}else{var $=m;m=function(D,E){return $.call(D,E)}}a.push(m)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),f?r===1?(a.push(function(D,E){return i.get.call(D,E)}),a.push(function(D,E){return i.set.call(D,E)})):r===2?a.push(i):a.push(function(D,E){return i.call(D,E)}):Object.defineProperty(o,l,s))}function v(a,o,c){for(var l=[],r,y,f=new Map,T=new Map,w=0;w<o.length;w++){var d=o[w];if(Array.isArray(d)){var s=d[1],m=d[2],i=d.length>3,u=s>=5,x,I;if(u?(x=a,s=s-5,y=y||[],I=y):(x=a.prototype,r=r||[],I=r),s!==0&&!i){var P=u?T:f,M=P.get(m)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+m);!M&&s>2?P.set(m,s):P.set(m,!0)}g(l,x,d,m,s,u,i,I,c)}}return b(l,r),b(l,y),l}function b(a,o){o&&a.push(function(c){for(var l=0;l<o.length;l++)o[l].call(c);return c})}function S(a,o,c){if(o.length>0){for(var l=[],r=a,y=a.name,f=o.length-1;f>=0;f--){var T={v:!1};try{var w=o[f](r,{kind:"class",name:y,addInitializer:h(l,T),metadata:c})}finally{T.v=!0}w!==void 0&&(p(10,w),r=w)}return[C(r,c),function(){for(var d=0;d<l.length;d++)l[d].call(r)}]}}function C(a,o){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,c,l,r){if(r!==void 0)var y=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var f=Object.create(y===void 0?null:y),T=v(o,c,f);return l.length||C(o,f),{e:T,get c(){return S(o,l,f)}}}}function Vo(h,t,e,n){return(Vo=ys())(h,t,e,n)}var zo,Oo,Bo,Uo,_o,Fo,jo,bs;zo=K({selector:"potatno-connection-layer",template:Lo,style:Ro}),Bo=U.state(),Uo=it("svgLayer");var $o=class{static{({e:[_o,Fo,jo],c:[bs,Oo]}=Vo(this,[[[et,Bo],1,"interaction"],[Uo,1,"svgLayer"]],[zo]))}constructor(t=O.use(Q),e=O.use(Ut)){this.mConnectionRegistry=new Map,this.mManager=t,this.mPendingRenderFrame=0,this.mPortRegistry=e,this.mRenderer=new Oe,this.mUnsubscribe=null}mConnectionRegistry;mManager;mPendingRenderFrame;mPortRegistry;mRenderer;mUnsubscribe;#t=(jo(this),_o(this,null));get interaction(){return this.#t}set interaction(t){this.#t=t}#e=Fo(this);get svgLayer(){return this.#e}set svgLayer(t){this.#e=t}onConnect(){this.mUnsubscribe=this.mManager.subscribe(F.Document|F.Function|F.ActiveFunction|F.Node|F.NodeTransform|F.Connection,null,()=>{this.scheduleRender()}),this.scheduleRender()}onDeconstruct(){this.mUnsubscribe?.(),this.mUnsubscribe=null,this.mPendingRenderFrame!==0&&(cancelAnimationFrame(this.mPendingRenderFrame),this.mPendingRenderFrame=0)}onContextMenu(t){if(!(t.target instanceof Element))return;let e=t.target.getAttribute("data-connection-id");e&&(t.preventDefault(),t.stopPropagation(),this.deleteConnectionById(e))}deleteConnectionById(t){let e=this.mConnectionRegistry.get(t);if(!e)return;let n=e.sourcePort.node.outputs.map.get(e.sourcePort.definitionId)??e.sourcePort,p=e.targetPort.node.inputs.map.get(e.targetPort.definitionId)??e.targetPort;this.mManager.graph.disconnectPorts(n,p)}getPortPosition(t){let e=this.interaction?.zoom??1,n=this.interaction?.gridSize??20,p=this.mPortRegistry.get(t),g=this.getSvgLayerOrNull();if(p&&g){let f=g.getBoundingClientRect(),T=p.getBoundingClientRect();return{x:(T.left+T.width/2-f.left)/e,y:(T.top+T.height/2-f.top)/e}}let v=t.node,b=v.transformation.x*n,S=v.transformation.y*n,C=v.transformation.width*n,a=28,o=24,c=4,l=t.direction==="output"?v.outputs.list:v.inputs.list,r=0,y=0;for(let f of l){if(f===t){r=y;break}y++}return{x:t.direction==="output"?b+C:b,y:S+a+c+(r+.5)*o}}getSvgLayerOrNull(){try{return this.svgLayer}catch{return null}}renderConnections(){let t=this.getSvgLayerOrNull();if(!t)return;let e=this.mManager.activeFunction;if(!e){this.mRenderer.clearAll(t),this.mConnectionRegistry.clear();return}let n=this.mManager.integrity.errorItems,p=[];this.mConnectionRegistry.clear();let g=0;for(let v of e.nodes)for(let b of v.outputs.list)for(let S of b.connectedPorts){let C=`c${g++}`,a=this.getPortPosition(b),o=this.getPortPosition(S),c=n.has(b)||n.has(S);this.mConnectionRegistry.set(C,{sourcePort:b,targetPort:S}),p.push({color:"var(--pn-text-secondary)",id:C,sourceX:a.x,sourceY:a.y,targetX:o.x,targetY:o.y,valid:!c})}this.mRenderer.renderConnections(t,p)}scheduleRender(){this.mPendingRenderFrame===0&&(this.mPendingRenderFrame=requestAnimationFrame(()=>{this.mPendingRenderFrame=0,this.renderConnections()}))}static{Oo()}};function ws(){function h(a,o){return function(l){e(o,"addInitializer"),n(l,"An initializer"),a.push(l)}}function t(a,o,c,l,r,y,f,T,w){var d;switch(r){case 1:d="accessor";break;case 2:d="method";break;case 3:d="getter";break;case 4:d="setter";break;default:d="field"}var s={kind:d,name:f?"#"+o:o,static:y,private:f,metadata:T},m={v:!1};s.addInitializer=h(l,m);var i,u;r===0?f?(i=c.get,u=c.set):(i=function(){return this[o]},u=function(x){this[o]=x}):r===2?i=function(){return c.value}:((r===1||r===3)&&(i=function(){return c.get.call(this)}),(r===1||r===4)&&(u=function(x){c.set.call(this,x)})),s.access=i&&u?{get:i,set:u}:i?{get:i}:{set:u};try{return a(w,s)}finally{m.v=!0}}function e(a,o){if(a.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(a,o){if(typeof a!="function")throw new TypeError(o+" must be a function")}function p(a,o){var c=typeof o;if(a===1){if(c!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(c!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function g(a,o,c,l,r,y,f,T,w){var d=c[0],s,m,i;f?r===0||r===1?s={get:c[3],set:c[4]}:r===3?s={get:c[3]}:r===4?s={set:c[3]}:s={value:c[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,l)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var u,x,I;if(typeof d=="function")u=t(d,l,s,T,r,y,f,w,i),u!==void 0&&(p(r,u),r===0?m=u:r===1?(m=u.init,x=u.get||i.get,I=u.set||i.set,i={get:x,set:I}):i=u);else for(var P=d.length-1;P>=0;P--){var M=d[P];if(u=t(M,l,s,T,r,y,f,w,i),u!==void 0){p(r,u);var N;r===0?N=u:r===1?(N=u.init,x=u.get||i.get,I=u.set||i.set,i={get:x,set:I}):i=u,N!==void 0&&(m===void 0?m=N:typeof m=="function"?m=[m,N]:m.push(N))}}if(r===0||r===1){if(m===void 0)m=function(D,E){return E};else if(typeof m!="function"){var _=m;m=function(D,E){for(var R=E,L=0;L<_.length;L++)R=_[L].call(D,R);return R}}else{var $=m;m=function(D,E){return $.call(D,E)}}a.push(m)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),f?r===1?(a.push(function(D,E){return i.get.call(D,E)}),a.push(function(D,E){return i.set.call(D,E)})):r===2?a.push(i):a.push(function(D,E){return i.call(D,E)}):Object.defineProperty(o,l,s))}function v(a,o,c){for(var l=[],r,y,f=new Map,T=new Map,w=0;w<o.length;w++){var d=o[w];if(Array.isArray(d)){var s=d[1],m=d[2],i=d.length>3,u=s>=5,x,I;if(u?(x=a,s=s-5,y=y||[],I=y):(x=a.prototype,r=r||[],I=r),s!==0&&!i){var P=u?T:f,M=P.get(m)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+m);!M&&s>2?P.set(m,s):P.set(m,!0)}g(l,x,d,m,s,u,i,I,c)}}return b(l,r),b(l,y),l}function b(a,o){o&&a.push(function(c){for(var l=0;l<o.length;l++)o[l].call(c);return c})}function S(a,o,c){if(o.length>0){for(var l=[],r=a,y=a.name,f=o.length-1;f>=0;f--){var T={v:!1};try{var w=o[f](r,{kind:"class",name:y,addInitializer:h(l,T),metadata:c})}finally{T.v=!0}w!==void 0&&(p(10,w),r=w)}return[C(r,c),function(){for(var d=0;d<l.length;d++)l[d].call(r)}]}}function C(a,o){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,c,l,r){if(r!==void 0)var y=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var f=Object.create(y===void 0?null:y),T=v(o,c,f);return l.length||C(o,f),{e:T,get c(){return S(o,l,f)}}}}function Xo(h,t,e,n){return(Xo=ws())(h,t,e,n)}var Yo,Go,pe;Yo=vt({access:Y.Read,selector:/^potatno-preview$/});var Ho=class{static{({c:[pe,Go]}=Xo(this,[],[Yo]))}constructor(t=O.use(q),e=O.use(H),n=O.use(rt)){this.mTarget=t,this.mProcedure=e.createExpressionProcedure(n.value)}mTarget;mProcedure;onUpdate(){let t=this.mProcedure.execute();if(!t){let n=this.mTarget.childNodes.length>0;return n&&(this.mTarget.innerHTML=""),n}let e=t.element;return this.mTarget.contains(e)?!1:(this.mTarget.innerHTML="",this.mTarget.appendChild(e),!0)}static{Go()}};var Wo=`:host {\r
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
`;var Zo=`<div [className]="this.portWrapperClasses" [title]="this.portTypeLabel" style="--port-color: {{this.portColor}}">
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
`;function Es(){function h(a,o){return function(l){e(o,"addInitializer"),n(l,"An initializer"),a.push(l)}}function t(a,o,c,l,r,y,f,T,w){var d;switch(r){case 1:d="accessor";break;case 2:d="method";break;case 3:d="getter";break;case 4:d="setter";break;default:d="field"}var s={kind:d,name:f?"#"+o:o,static:y,private:f,metadata:T},m={v:!1};s.addInitializer=h(l,m);var i,u;r===0?f?(i=c.get,u=c.set):(i=function(){return this[o]},u=function(x){this[o]=x}):r===2?i=function(){return c.value}:((r===1||r===3)&&(i=function(){return c.get.call(this)}),(r===1||r===4)&&(u=function(x){c.set.call(this,x)})),s.access=i&&u?{get:i,set:u}:i?{get:i}:{set:u};try{return a(w,s)}finally{m.v=!0}}function e(a,o){if(a.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(a,o){if(typeof a!="function")throw new TypeError(o+" must be a function")}function p(a,o){var c=typeof o;if(a===1){if(c!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(c!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function g(a,o,c,l,r,y,f,T,w){var d=c[0],s,m,i;f?r===0||r===1?s={get:c[3],set:c[4]}:r===3?s={get:c[3]}:r===4?s={set:c[3]}:s={value:c[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,l)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var u,x,I;if(typeof d=="function")u=t(d,l,s,T,r,y,f,w,i),u!==void 0&&(p(r,u),r===0?m=u:r===1?(m=u.init,x=u.get||i.get,I=u.set||i.set,i={get:x,set:I}):i=u);else for(var P=d.length-1;P>=0;P--){var M=d[P];if(u=t(M,l,s,T,r,y,f,w,i),u!==void 0){p(r,u);var N;r===0?N=u:r===1?(N=u.init,x=u.get||i.get,I=u.set||i.set,i={get:x,set:I}):i=u,N!==void 0&&(m===void 0?m=N:typeof m=="function"?m=[m,N]:m.push(N))}}if(r===0||r===1){if(m===void 0)m=function(D,E){return E};else if(typeof m!="function"){var _=m;m=function(D,E){for(var R=E,L=0;L<_.length;L++)R=_[L].call(D,R);return R}}else{var $=m;m=function(D,E){return $.call(D,E)}}a.push(m)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),f?r===1?(a.push(function(D,E){return i.get.call(D,E)}),a.push(function(D,E){return i.set.call(D,E)})):r===2?a.push(i):a.push(function(D,E){return i.call(D,E)}):Object.defineProperty(o,l,s))}function v(a,o,c){for(var l=[],r,y,f=new Map,T=new Map,w=0;w<o.length;w++){var d=o[w];if(Array.isArray(d)){var s=d[1],m=d[2],i=d.length>3,u=s>=5,x,I;if(u?(x=a,s=s-5,y=y||[],I=y):(x=a.prototype,r=r||[],I=r),s!==0&&!i){var P=u?T:f,M=P.get(m)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+m);!M&&s>2?P.set(m,s):P.set(m,!0)}g(l,x,d,m,s,u,i,I,c)}}return b(l,r),b(l,y),l}function b(a,o){o&&a.push(function(c){for(var l=0;l<o.length;l++)o[l].call(c);return c})}function S(a,o,c){if(o.length>0){for(var l=[],r=a,y=a.name,f=o.length-1;f>=0;f--){var T={v:!1};try{var w=o[f](r,{kind:"class",name:y,addInitializer:h(l,T),metadata:c})}finally{T.v=!0}w!==void 0&&(p(10,w),r=w)}return[C(r,c),function(){for(var d=0;d<l.length;d++)l[d].call(r)}]}}function C(a,o){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,c,l,r){if(r!==void 0)var y=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var f=Object.create(y===void 0?null:y),T=v(o,c,f);return l.length||C(o,f),{e:T,get c(){return S(o,l,f)}}}}function nn(h,t,e,n){return(nn=Es())(h,t,e,n)}var sn,qo,an,ln,cn,un,hn,mn,Jo,Ko,Qo,ko,tn,en,rn,qe;sn=K({selector:"potatno-port",template:Zo,style:Wo}),an=U.state(),ln=U.state(),cn=ut("port-drag-start"),un=ut("port-hover"),hn=ut("port-leave"),mn=it("portCircle");var on=class{static{({e:[Jo,Ko,Qo,ko,tn,en,rn],c:[qe,qo]}=nn(this,[[[et,an],1,"port"],[[et,ln],1,"ownerNode"],[cn,1,"mPortDragStart"],[un,1,"mPortHover"],[hn,1,"mPortLeave"],[mn,1,"portCircleElement"]],[sn]))}constructor(t=O.use(z),e=O.use(Q),n=O.use(Ut)){this.mComponent=t,this.mLastRegisteredPort=null,this.mManager=e,this.mPortRegistry=n,this.mUnsubscribe=null}mComponent;mLastRegisteredPort;mManager;mPortRegistry;mUnsubscribe;#t=(rn(this),Jo(this,null));get port(){return this.#t}set port(t){this.#t=t}#e=Ko(this,null);get ownerNode(){return this.#e}set ownerNode(t){this.#e=t}#r=Qo(this);get mPortDragStart(){return this.#r}set mPortDragStart(t){this.#r=t}#o=ko(this);get mPortHover(){return this.#o}set mPortHover(t){this.#o=t}#n=tn(this);get mPortLeave(){return this.#n}set mPortLeave(t){this.#n=t}#i=en(this);get portCircleElement(){return this.#i}set portCircleElement(t){this.#i=t}get hasError(){return this.port!==null&&this.mManager.integrity.errorItems.has(this.port)}get portName(){return this.port?.label??""}get portTypeLabel(){return this.port?.dataType??""}get portWrapperClasses(){return`port-wrapper ${this.port?.direction==="output"?"direction-output":"direction-input"}`}get portCircleClasses(){if(!this.port)return"port-circle disconnected direction-input";let t=["port-circle"];return t.push(this.port.connectedPorts.size>0?"connected":"disconnected"),t.push(this.port.direction==="output"?"direction-output":"direction-input"),this.hasError&&t.push("has-error"),t.join(" ")}get portColor(){if(!this.port||this.port.portType==="flow")return"var(--pn-text-primary)";if(this.port.node.project.types.isGenericType(this.port.dataType??"")){if(this.port.connectedPorts.size>0){let t=[...this.port.connectedPorts][0];return this.getTypeColor(t.dataType??"")}return"var(--pn-text-muted)"}return this.getTypeColor(this.port.dataType??"")}get showDirectValueInput(){return this.port?this.port.portType==="value"&&this.port.direction==="input"&&this.port.connectedPorts.size===0&&!this.port.node.project.types.isGenericType(this.port.dataType??""):!1}get directValueInputDefs(){return!this.port||this.port.portType!=="value"?[]:this.port.node.project.types.isGenericType(this.port.dataType??"")?[]:this.port.project.types.getType(this.port.dataType??"").inputs.map((e,n)=>({htmlType:e.type==="number"?"number":e.type==="boolean"?"checkbox":"text",index:n,name:e.name,value:this.port.directValue[n]??""}))}onConnect(){this.mUnsubscribe=this.mManager.subscribe(F.Connection|F.Node,null,()=>{this.mComponent.updater.update()})}onDeconstruct(){this.mUnsubscribe?.(),this.mUnsubscribe=null,this.mLastRegisteredPort&&(this.mPortRegistry.unregister(this.mLastRegisteredPort),this.mLastRegisteredPort=null)}onUpdate(){let t=this.port,e=this.ownerNode;if(!t||!e||t===this.mLastRegisteredPort)return;let n;try{n=this.portCircleElement}catch{return}this.mLastRegisteredPort&&this.mLastRegisteredPort!==t&&this.mPortRegistry.unregister(this.mLastRegisteredPort),this.mLastRegisteredPort=t,this.mPortRegistry.register(t,n),this.mManager.graph.transformNode(e,{})}onPointerDown(t){t.stopPropagation(),t.preventDefault(),!(!this.port||!this.ownerNode)&&this.mPortDragStart.dispatchEvent({node:this.ownerNode,port:this.port,element:this.portCircleElement})}onPointerEnter(t){!this.port||!this.ownerNode||this.mPortHover.dispatchEvent({node:this.ownerNode,port:this.port,element:this.portCircleElement})}onPointerLeave(t){this.mPortLeave.dispatchEvent(void 0)}onDirectValueInput(t,e){if(!this.port)return;let n=t.target,p=[...this.port.directValue];p[e]=n.type==="checkbox"?n.checked?"true":"false":n.value,this.mManager.graph.setPortDirectValue(this.port,p)}getTypeColor(t){let e=0;for(let p=0;p<t.length;p++)e=t.charCodeAt(p)+((e<<5)-e);return`hsl(${Math.abs(e)*137.508%360}, 70%, 60%)`}static{qo()}};var pn=`:host {\r
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
`;var dn=`$if(this.nodeData) {
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
`;function Is(){function h(a,o){return function(l){e(o,"addInitializer"),n(l,"An initializer"),a.push(l)}}function t(a,o,c,l,r,y,f,T,w){var d;switch(r){case 1:d="accessor";break;case 2:d="method";break;case 3:d="getter";break;case 4:d="setter";break;default:d="field"}var s={kind:d,name:f?"#"+o:o,static:y,private:f,metadata:T},m={v:!1};s.addInitializer=h(l,m);var i,u;r===0?f?(i=c.get,u=c.set):(i=function(){return this[o]},u=function(x){this[o]=x}):r===2?i=function(){return c.value}:((r===1||r===3)&&(i=function(){return c.get.call(this)}),(r===1||r===4)&&(u=function(x){c.set.call(this,x)})),s.access=i&&u?{get:i,set:u}:i?{get:i}:{set:u};try{return a(w,s)}finally{m.v=!0}}function e(a,o){if(a.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(a,o){if(typeof a!="function")throw new TypeError(o+" must be a function")}function p(a,o){var c=typeof o;if(a===1){if(c!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(c!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function g(a,o,c,l,r,y,f,T,w){var d=c[0],s,m,i;f?r===0||r===1?s={get:c[3],set:c[4]}:r===3?s={get:c[3]}:r===4?s={set:c[3]}:s={value:c[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,l)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var u,x,I;if(typeof d=="function")u=t(d,l,s,T,r,y,f,w,i),u!==void 0&&(p(r,u),r===0?m=u:r===1?(m=u.init,x=u.get||i.get,I=u.set||i.set,i={get:x,set:I}):i=u);else for(var P=d.length-1;P>=0;P--){var M=d[P];if(u=t(M,l,s,T,r,y,f,w,i),u!==void 0){p(r,u);var N;r===0?N=u:r===1?(N=u.init,x=u.get||i.get,I=u.set||i.set,i={get:x,set:I}):i=u,N!==void 0&&(m===void 0?m=N:typeof m=="function"?m=[m,N]:m.push(N))}}if(r===0||r===1){if(m===void 0)m=function(D,E){return E};else if(typeof m!="function"){var _=m;m=function(D,E){for(var R=E,L=0;L<_.length;L++)R=_[L].call(D,R);return R}}else{var $=m;m=function(D,E){return $.call(D,E)}}a.push(m)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),f?r===1?(a.push(function(D,E){return i.get.call(D,E)}),a.push(function(D,E){return i.set.call(D,E)})):r===2?a.push(i):a.push(function(D,E){return i.call(D,E)}):Object.defineProperty(o,l,s))}function v(a,o,c){for(var l=[],r,y,f=new Map,T=new Map,w=0;w<o.length;w++){var d=o[w];if(Array.isArray(d)){var s=d[1],m=d[2],i=d.length>3,u=s>=5,x,I;if(u?(x=a,s=s-5,y=y||[],I=y):(x=a.prototype,r=r||[],I=r),s!==0&&!i){var P=u?T:f,M=P.get(m)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+m);!M&&s>2?P.set(m,s):P.set(m,!0)}g(l,x,d,m,s,u,i,I,c)}}return b(l,r),b(l,y),l}function b(a,o){o&&a.push(function(c){for(var l=0;l<o.length;l++)o[l].call(c);return c})}function S(a,o,c){if(o.length>0){for(var l=[],r=a,y=a.name,f=o.length-1;f>=0;f--){var T={v:!1};try{var w=o[f](r,{kind:"class",name:y,addInitializer:h(l,T),metadata:c})}finally{T.v=!0}w!==void 0&&(p(10,w),r=w)}return[C(r,c),function(){for(var d=0;d<l.length;d++)l[d].call(r)}]}}function C(a,o){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,c,l,r){if(r!==void 0)var y=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var f=Object.create(y===void 0?null:y),T=v(o,c,f);return l.length||C(o,f),{e:T,get c(){return S(o,l,f)}}}}function Sn(h,t,e,n){return(Sn=Is())(h,t,e,n)}var In,fn,Cn,Pn,Mn,Nn,An,Rn,Ln,gn,vn,yn,bn,wn,xn,Tn,En,Cs;In=K({selector:"potatno-node",template:dn,style:pn,modules:[pe],components:[qe]}),Cn=U.state(),Pn=U.state(),Mn=U.state(),Nn=ut("port-drag-start"),An=ut("port-hover"),Rn=ut("port-leave"),Ln=ut("resize-start");var Dn=class{static{({e:[gn,vn,yn,bn,wn,xn,Tn,En],c:[Cs,fn]}=Sn(this,[[[et,Cn],1,"nodeData"],[[et,Pn],1,"selected"],[[et,Mn],1,"gridSize"],[Nn,1,"mPortDragStart"],[An,1,"mPortHover"],[Rn,1,"mPortLeave"],[Ln,1,"mResizeStart"]],[In]))}constructor(t=O.use(z),e=O.use(Q)){this.mComponent=t,this.mManager=e,this.mUnsubscribe=null}mComponent;mManager;mUnsubscribe;#t=(En(this),gn(this,null));get nodeData(){return this.#t}set nodeData(t){this.#t=t}#e=vn(this,!1);get selected(){return this.#e}set selected(t){this.#e=t}#r=yn(this,20);get gridSize(){return this.#r}set gridSize(t){this.#r=t}#o=bn(this);get mPortDragStart(){return this.#o}set mPortDragStart(t){this.#o=t}#n=wn(this);get mPortHover(){return this.#n}set mPortHover(t){this.#n=t}#i=xn(this);get mPortLeave(){return this.#i}set mPortLeave(t){this.#i=t}#s=Tn(this);get mResizeStart(){return this.#s}set mResizeStart(t){this.#s=t}get selectedClass(){return this.selected?"selected":""}get hasErrorClass(){return this.nodeData!==null&&this.mManager.integrity.errorItems.has(this.nodeData)?"has-error":""}get isComment(){return this.nodeData?.category===ht.Comment}get isReroute(){return this.nodeData?.category===ht.Reroute}get isFunction(){return this.nodeData?.category===ht.Function}get showOpenButton(){return this.isFunction}get canPreview(){return this.valueOutputPorts.length>0}get isPreviewActive(){return this.nodeData?.preview!=null}get previewEyeClass(){return this.isPreviewActive?"preview-eye-btn active":"preview-eye-btn"}get previewDisplays(){return this.nodeData?this.mManager.getPreviewDisplaysForNode(this.nodeData):[]}get previewDriver(){return this.nodeData?this.mManager.getNodePreviewDriver(this.nodeData):null}get valueOutputPorts(){return this.nodeData?[...this.nodeData.outputs.value]:[]}get selectedDisplayId(){return this.nodeData?.preview?.displayId??""}get previewNoneClass(){return this.isPreviewActive?"preview-port-item":"preview-port-item active"}get categoryColor(){return this.nodeData?Ct.get(this.nodeData.category).cssColor:""}get categoryIcon(){return this.nodeData?Ct.get(this.nodeData.category).icon:""}get nodeLabel(){return this.nodeData?.label??""}get nodeName(){if(!this.nodeData)return"";let t=this.nodeData;return t.project.nodeDefinitions.find(n=>n.id===t.definitionId)?.label??t.label}get commentSizeStyle(){return this.nodeData?`height: ${this.nodeData.transformation.height*this.gridSize}px;`:""}get inputPorts(){return this.nodeData?[...this.nodeData.inputs.list]:[]}get outputPorts(){return this.nodeData?[...this.nodeData.outputs.list]:[]}isPreviewedPort(t){return this.nodeData?.preview?.portId===t.definitionId}previewPortClass(t){return this.isPreviewedPort(t)?"preview-port-item active":"preview-port-item"}onConnect(){this.mUnsubscribe=this.mManager.subscribe(F.Function|F.ActiveFunction|F.Node|F.Connection|F.Preview,null,()=>{this.mComponent.updater.update()})}onDeconstruct(){this.mUnsubscribe?.(),this.mUnsubscribe=null}onPortDragStart(t){this.mPortDragStart.dispatchEvent(t.value)}onPortHover(t){this.mPortHover.dispatchEvent(t.value)}onPortLeave(){this.mPortLeave.dispatchEvent(void 0)}onSelectPreviewPort(t,e){t.stopPropagation(),this.nodeData&&this.mManager.setNodePreview(this.nodeData,e.definitionId)}onClearPreview(t){t.stopPropagation(),this.nodeData&&this.mManager.setNodePreview(this.nodeData,"")}onSelectPreviewStyle(t){t.stopPropagation(),this.nodeData&&this.mManager.setNodePreviewDisplay(this.nodeData,t.target.value)}onOpenFunction(t){if(t.stopPropagation(),!this.nodeData)return;let e=this.nodeData.definitionId,n=e.startsWith("USERFUNCTION_")?e.slice(13):e;this.mManager.setActiveFunction(n)}onCommentInput(t){let e=t.target;this.mManager.graph.updateNode(this.nodeData,n=>{n.label=e.value})}onResizeStart(t){t.stopPropagation(),t.preventDefault(),this.nodeData&&this.mResizeStart.dispatchEvent({node:this.nodeData,startX:t.clientX,startY:t.clientY})}static{fn()}};function Ps(){function h(a,o){return function(l){e(o,"addInitializer"),n(l,"An initializer"),a.push(l)}}function t(a,o,c,l,r,y,f,T,w){var d;switch(r){case 1:d="accessor";break;case 2:d="method";break;case 3:d="getter";break;case 4:d="setter";break;default:d="field"}var s={kind:d,name:f?"#"+o:o,static:y,private:f,metadata:T},m={v:!1};s.addInitializer=h(l,m);var i,u;r===0?f?(i=c.get,u=c.set):(i=function(){return this[o]},u=function(x){this[o]=x}):r===2?i=function(){return c.value}:((r===1||r===3)&&(i=function(){return c.get.call(this)}),(r===1||r===4)&&(u=function(x){c.set.call(this,x)})),s.access=i&&u?{get:i,set:u}:i?{get:i}:{set:u};try{return a(w,s)}finally{m.v=!0}}function e(a,o){if(a.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(a,o){if(typeof a!="function")throw new TypeError(o+" must be a function")}function p(a,o){var c=typeof o;if(a===1){if(c!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(c!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function g(a,o,c,l,r,y,f,T,w){var d=c[0],s,m,i;f?r===0||r===1?s={get:c[3],set:c[4]}:r===3?s={get:c[3]}:r===4?s={set:c[3]}:s={value:c[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,l)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var u,x,I;if(typeof d=="function")u=t(d,l,s,T,r,y,f,w,i),u!==void 0&&(p(r,u),r===0?m=u:r===1?(m=u.init,x=u.get||i.get,I=u.set||i.set,i={get:x,set:I}):i=u);else for(var P=d.length-1;P>=0;P--){var M=d[P];if(u=t(M,l,s,T,r,y,f,w,i),u!==void 0){p(r,u);var N;r===0?N=u:r===1?(N=u.init,x=u.get||i.get,I=u.set||i.set,i={get:x,set:I}):i=u,N!==void 0&&(m===void 0?m=N:typeof m=="function"?m=[m,N]:m.push(N))}}if(r===0||r===1){if(m===void 0)m=function(D,E){return E};else if(typeof m!="function"){var _=m;m=function(D,E){for(var R=E,L=0;L<_.length;L++)R=_[L].call(D,R);return R}}else{var $=m;m=function(D,E){return $.call(D,E)}}a.push(m)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),f?r===1?(a.push(function(D,E){return i.get.call(D,E)}),a.push(function(D,E){return i.set.call(D,E)})):r===2?a.push(i):a.push(function(D,E){return i.call(D,E)}):Object.defineProperty(o,l,s))}function v(a,o,c){for(var l=[],r,y,f=new Map,T=new Map,w=0;w<o.length;w++){var d=o[w];if(Array.isArray(d)){var s=d[1],m=d[2],i=d.length>3,u=s>=5,x,I;if(u?(x=a,s=s-5,y=y||[],I=y):(x=a.prototype,r=r||[],I=r),s!==0&&!i){var P=u?T:f,M=P.get(m)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+m);!M&&s>2?P.set(m,s):P.set(m,!0)}g(l,x,d,m,s,u,i,I,c)}}return b(l,r),b(l,y),l}function b(a,o){o&&a.push(function(c){for(var l=0;l<o.length;l++)o[l].call(c);return c})}function S(a,o,c){if(o.length>0){for(var l=[],r=a,y=a.name,f=o.length-1;f>=0;f--){var T={v:!1};try{var w=o[f](r,{kind:"class",name:y,addInitializer:h(l,T),metadata:c})}finally{T.v=!0}w!==void 0&&(p(10,w),r=w)}return[C(r,c),function(){for(var d=0;d<l.length;d++)l[d].call(r)}]}}function C(a,o){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,c,l,r){if(r!==void 0)var y=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var f=Object.create(y===void 0?null:y),T=v(o,c,f);return l.length||C(o,f),{e:T,get c(){return S(o,l,f)}}}}function Hn(h,t,e,n){return(Hn=Ps())(h,t,e,n)}var Xn,On,Yn,Wn,Zn,qn,Jn,Kn,Qn,_n,Fn,jn,$n,Vn,zn,Bn,Un,Ms;Xn=K({selector:"potatno-node-graph",template:po,style:mo}),Yn=U.state({complexValue:!0}),Wn=U.state(),Zn=U.state(),qn=U.state({complexValue:!0}),Jn=U.state({complexValue:!0}),Kn=U.state({complexValue:!0}),Qn=it("canvasWrapper");var Gn=class{static{({e:[_n,Fn,jn,$n,Vn,zn,Bn,Un],c:[Ms,On]}=Hn(this,[[Yn,1,"mCachedGraphData"],[Wn,1,"mTransformVersion"],[Zn,1,"mShowSelectionBox"],[qn,1,"mSelectionBoxScreen"],[Jn,1,"mAddNodePopup"],[Kn,1,"mTempConnection"],[Qn,1,"canvasWrapper"]],[Xn]))}constructor(t=O.use(z),e=O.use(Q),n=O.use(Ut)){this.mCachedGraphData={visibleNodes:[]},this.mClipboard=new Le,this.mComponent=t,this.mDocumentPointerMoveHandler=null,this.mDocumentPointerUpHandler=null,this.mHoveredPort=null,this.mInteraction=new Re(20),this.mInteractionState={mode:"idle"},this.mKeyboardHandler=null,this.mManager=e,this.mPortRegistry=n,this.mSelectedNodes=new Set,this.mUnsubscribe=null}mClipboard;mComponent;mInteraction;mManager;mPortRegistry;mSelectedNodes;mDocumentPointerMoveHandler;mDocumentPointerUpHandler;mHoveredPort;mInteractionState;mKeyboardHandler;mUnsubscribe;#t=(Un(this),_n(this));get mCachedGraphData(){return this.#t}set mCachedGraphData(t){this.#t=t}#e=Fn(this,0);get mTransformVersion(){return this.#e}set mTransformVersion(t){this.#e=t}#r=jn(this,!1);get mShowSelectionBox(){return this.#r}set mShowSelectionBox(t){this.#r=t}#o=$n(this,{x1:0,x2:0,y1:0,y2:0});get mSelectionBoxScreen(){return this.#o}set mSelectionBoxScreen(t){this.#o=t}#n=Vn(this,null);get mAddNodePopup(){return this.#n}set mAddNodePopup(t){this.#n=t}#i=zn(this,null);get mTempConnection(){return this.#i}set mTempConnection(t){this.#i=t}#s=Bn(this);get canvasWrapper(){return this.#s}set canvasWrapper(t){this.#s=t}get canvasInteraction(){return this.mInteraction}get showTempConnection(){return this.mTempConnection!==null}get tempWirePath(){let t=this.mTempConnection;return t?this.generateBezierPath(t.start.x,t.start.y,t.end.x,t.end.y):""}get gridBackgroundStyle(){return this.mTransformVersion,this.mInteraction.getGridBackgroundCss()}get gridTransformStyle(){return this.mTransformVersion,"transform: "+this.mInteraction.getTransformCss()}get gridSize(){return this.mInteraction.gridSize}get showSelectionBox(){return this.mShowSelectionBox}get selectionBoxStyle(){let t=Math.min(this.mSelectionBoxScreen.x1,this.mSelectionBoxScreen.x2),e=Math.min(this.mSelectionBoxScreen.y1,this.mSelectionBoxScreen.y2),n=Math.abs(this.mSelectionBoxScreen.x2-this.mSelectionBoxScreen.x1),p=Math.abs(this.mSelectionBoxScreen.y2-this.mSelectionBoxScreen.y1);return`left: ${t}px; top: ${e}px; width: ${n}px; height: ${p}px`}get visibleNodes(){return this.mCachedGraphData.visibleNodes}get showAddNodePopup(){return this.mAddNodePopup!==null}get addNodePopupStyle(){let t=this.mAddNodePopup;return t?`left: ${t.screenX}px; top: ${t.screenY}px`:""}onConnect(){this.mKeyboardHandler=t=>this.onKeyDown(t),document.addEventListener("keydown",this.mKeyboardHandler),this.mUnsubscribe=this.mManager.subscribe(F.Document|F.Function|F.ActiveFunction|F.Node|F.Connection,null,t=>{(t.changeType===F.Document||t.changeType===F.Function||t.changeType===F.ActiveFunction)&&this.resetForActiveFunction(),this.invalidateGraphContent(),this.mComponent.updater.update()}),this.invalidateGraphContent()}onDeconstruct(){this.stopDocumentPointerTracking(),this.mUnsubscribe?.(),this.mUnsubscribe=null,this.mKeyboardHandler&&(document.removeEventListener("keydown",this.mKeyboardHandler),this.mKeyboardHandler=null)}onCanvasPointerDown(t){if(this.closeAddNodePopup(),t.button===1){t.preventDefault(),this.mInteractionState={mode:"panning",startX:t.clientX,startY:t.clientY},this.startDocumentPointerTracking();return}if(t.button!==0)return;t.ctrlKey||(this.mSelectedNodes.clear(),this.invalidateNodeVisuals());let e=this.getLocalPointerPosition(t.clientX,t.clientY);this.mInteractionState={mode:"selecting"},this.mSelectionBoxScreen={x1:e.x,x2:e.x,y1:e.y,y2:e.y},this.mShowSelectionBox=!1,this.startDocumentPointerTracking()}onCanvasWheel(t){t.preventDefault();let e=this.getLocalPointerPosition(t.clientX,t.clientY);this.mInteraction.zoomAt(e.x,e.y,t.deltaY>0?-.1:.1),this.mTransformVersion++}onContextMenu(t){t.preventDefault(),!this.eventPathContainsGraphNode(t)&&this.openAddNodePopupAtPointer(t.clientX,t.clientY)}onNodePointerDown(t,e){for(let g of t.composedPath())if(g instanceof HTMLElement&&g.tagName.toLowerCase()==="potatno-port")return;if(t.stopPropagation(),this.closeAddNodePopup(),t.button!==0)return;t.ctrlKey?this.mSelectedNodes.has(e)?this.mSelectedNodes.delete(e):this.mSelectedNodes.add(e):this.mSelectedNodes.has(e)||(this.mSelectedNodes.clear(),this.mSelectedNodes.add(e)),this.invalidateNodeVisuals();let n=this.mInteraction.gridSize,p=new Map;for(let g of this.mSelectedNodes)p.set(g,{originX:g.transformation.x*n,originY:g.transformation.y*n});e.category===ht.Comment&&this.addCommentContainedNodeOrigins(e,p),this.mInteractionState={mode:"dragging-node",origins:p,startX:t.clientX,startY:t.clientY},this.startDocumentPointerTracking()}onPortDragStart(t){let e=this.canvasWrapper.getBoundingClientRect(),n=t.value.element.getBoundingClientRect(),p=(n.left+n.width/2-e.left-this.mInteraction.panX)/this.mInteraction.zoom,g=(n.top+n.height/2-e.top-this.mInteraction.panY)/this.mInteraction.zoom;this.closeAddNodePopup(),this.mInteractionState={mode:"dragging-wire",sourcePort:t.value.port,startX:p,startY:g},this.startDocumentPointerTracking()}onPortHover(t){this.mHoveredPort={node:t.value.node,port:t.value.port}}onPortLeave(){this.mHoveredPort=null}onNodeResizeStart(t){this.closeAddNodePopup(),this.mInteractionState={mode:"resizing-comment",node:t.value.node,originalH:t.value.node.transformation.height,originalW:t.value.node.transformation.width,startX:t.value.startX,startY:t.value.startY},this.startDocumentPointerTracking()}onAddNodePopupNodeSelect(t){this.insertNodeFromAddPopup(t.value)}onAddNodePopupClose(){this.closeAddNodePopup()}onDocumentPointerMove(t){let e=this.mInteractionState;if(e.mode==="panning"){this.mInteraction.pan(t.clientX-e.startX,t.clientY-e.startY),e.startX=t.clientX,e.startY=t.clientY,this.mTransformVersion++;return}if(e.mode==="dragging-node"){this.dragSelectedNodes(t,e);return}if(e.mode==="dragging-wire"){this.renderDraggedWire(t,e);return}if(e.mode==="selecting"){let n=this.getLocalPointerPosition(t.clientX,t.clientY);this.mSelectionBoxScreen={x1:this.mSelectionBoxScreen.x1,x2:n.x,y1:this.mSelectionBoxScreen.y1,y2:n.y},this.mShowSelectionBox=Math.abs(this.mSelectionBoxScreen.x2-this.mSelectionBoxScreen.x1)>5||Math.abs(this.mSelectionBoxScreen.y2-this.mSelectionBoxScreen.y1)>5;return}if(e.mode==="resizing-comment"){let n=this.mInteraction.gridSize,p=(t.clientX-e.startX)/this.mInteraction.zoom,g=(t.clientY-e.startY)/this.mInteraction.zoom;e.node.resizeTo(e.originalW+Math.round(p/n),e.originalH+Math.round(g/n)),this.rebuildVisibleNodePositions();return}}onDocumentPointerUp(t){let e=this.mInteractionState;e.mode==="dragging-wire"?this.completeWireDrag(t):e.mode==="selecting"&&(this.mShowSelectionBox=!1,this.selectNodesInBox()),this.mInteractionState={mode:"idle"},this.stopDocumentPointerTracking()}onKeyDown(t){if(!this.isTextEditingActive()){if(t.key==="Delete"){this.deleteSelectedNodes();return}if(t.ctrlKey&&t.key==="z"){t.preventDefault(),t.shiftKey?this.mManager.history.redo():this.mManager.history.undo();return}if(t.ctrlKey&&t.key==="y"){t.preventDefault(),this.mManager.history.redo();return}if(t.ctrlKey&&t.key==="c"){this.mClipboard.copy(this.mSelectedNodes);return}t.ctrlKey&&t.key==="v"&&(t.preventDefault(),this.pasteFromClipboard())}}addCommentContainedNodeOrigins(t,e){let n=this.mManager.activeFunction;if(!n)return;let p=this.mInteraction.gridSize,g=t.transformation.x*p,v=t.transformation.y*p,b=g+t.transformation.width*p,S=v+t.transformation.height*p;for(let C of n.nodes){if(C===t||this.mSelectedNodes.has(C)||C.category===ht.Comment)continue;let a=C.transformation.x*p,o=C.transformation.y*p;a>=g&&a<=b&&o>=v&&o<=S&&e.set(C,{originX:a,originY:o})}}closeAddNodePopup(){this.mAddNodePopup=null}completeWireDrag(t){if(this.mTempConnection=null,this.mInteractionState.mode!=="dragging-wire")return;let e=this.mInteractionState.sourcePort,n=this.mHoveredPort?.port??this.hitTestPort(t.clientX,t.clientY);!n||e===n||e.direction===n.direction||e.portType!==n.portType||this.mManager.graph.connectPorts(e,n)}hitTestPort(t,e){for(let[n,p]of this.mPortRegistry.entries()){let g=p.getBoundingClientRect();if(t>=g.left&&t<=g.right&&e>=g.top&&e<=g.bottom)return n}return null}deleteSelectedNodes(){for(let t of this.mSelectedNodes)this.mManager.graph.removeNode(t);this.mSelectedNodes.clear()}dragSelectedNodes(t,e){let n=this.mInteraction.zoom,p=this.mInteraction.gridSize,g=(t.clientX-e.startX)/n,v=(t.clientY-e.startY)/n;for(let[b,S]of e.origins){let C=this.mInteraction.snapToGrid(S.originX+g,S.originY+v);this.mManager.graph.transformNode(b,{x:Math.round(C.x/p),y:Math.round(C.y/p)})}this.rebuildVisibleNodePositions()}eventPathContainsGraphNode(t){for(let e of t.composedPath())if(e instanceof HTMLElement&&e.tagName.toLowerCase()==="potatno-node")return!0;return!1}generateBezierPath(t,e,n,p){let g=Math.max(Math.abs(n-t)*.4,50);return`M ${t} ${e} C ${t+g} ${e}, ${n-g} ${p}, ${n} ${p}`}getCanvasWrapperOrNull(){try{return this.canvasWrapper}catch{return null}}getLocalPointerPosition(t,e){let n=this.getCanvasWrapperOrNull();if(!n)return{x:0,y:0};let p=n.getBoundingClientRect();return{x:t-p.left,y:e-p.top}}getWorldPointerPosition(t,e){let n=this.getLocalPointerPosition(t,e);return this.mInteraction.screenToWorld(n.x,n.y)}invalidateGraphContent(){this.rebuildGraphData()}invalidateNodeVisuals(){this.rebuildGraphData()}insertNodeAt(t,e){if(!this.mManager.activeFunction)return;let n=this.mInteraction.gridSize,p=this.mInteraction.snapToGrid(e.x,e.y),g=this.mManager.graph.addNode(this.mManager.activeFunction,t,{height:4,width:10,x:Math.round(p.x/n),y:Math.round(p.y/n)});this.mSelectedNodes.clear(),this.mSelectedNodes.add(g),this.closeAddNodePopup()}insertNodeFromAddPopup(t){let e=this.mAddNodePopup;e&&this.insertNodeAt(t,{x:e.worldX,y:e.worldY})}isTextEditingActive(){let t=document.activeElement;return t instanceof HTMLInputElement||t instanceof HTMLTextAreaElement||t instanceof HTMLSelectElement}openAddNodePopupAtPointer(t,e){let n=this.getCanvasWrapperOrNull(),p=this.getLocalPointerPosition(t,e),g=this.mInteraction.screenToWorld(p.x,p.y),v=280,b=320,S=Math.max(0,(n?.clientWidth??v)-v-8),C=Math.max(0,(n?.clientHeight??b)-b-8);this.mAddNodePopup={screenX:Math.max(8,Math.min(p.x,S)),screenY:Math.max(8,Math.min(p.y,C)),worldX:g.x,worldY:g.y}}pasteFromClipboard(){let t=this.mManager.activeFunction;if(!t)return;let e=this.mClipboard.paste(t,t.document,2,2);if(e.length!==0){this.mSelectedNodes.clear();for(let n of e)this.mSelectedNodes.add(n)}}rebuildGraphData(){let t=[],e=this.mManager.activeFunction;if(e){let n=this.mInteraction.gridSize;for(let p of e.nodes)t.push({node:p,pixelW:p.transformation.width*n,pixelX:p.transformation.x*n,pixelY:p.transformation.y*n,selected:this.mSelectedNodes.has(p)})}this.mCachedGraphData={visibleNodes:t}}rebuildVisibleNodePositions(){let t=this.mInteraction.gridSize;this.mCachedGraphData={visibleNodes:this.mCachedGraphData.visibleNodes.map(e=>({node:e.node,pixelW:e.node.transformation.width*t,pixelX:e.node.transformation.x*t,pixelY:e.node.transformation.y*t,selected:e.selected}))}}renderDraggedWire(t,e){let n=this.getWorldPointerPosition(t.clientX,t.clientY);this.mTempConnection={start:{x:e.startX,y:e.startY},end:n}}resetForActiveFunction(){this.mHoveredPort=null,this.mInteractionState={mode:"idle"},this.mSelectedNodes.clear(),this.mTempConnection=null,this.stopDocumentPointerTracking(),this.closeAddNodePopup()}selectNodesInBox(){let t=this.mManager.activeFunction;if(!t)return;let e=this.mInteraction.screenToWorld(Math.min(this.mSelectionBoxScreen.x1,this.mSelectionBoxScreen.x2),Math.min(this.mSelectionBoxScreen.y1,this.mSelectionBoxScreen.y2)),n=this.mInteraction.screenToWorld(Math.max(this.mSelectionBoxScreen.x1,this.mSelectionBoxScreen.x2),Math.max(this.mSelectionBoxScreen.y1,this.mSelectionBoxScreen.y2)),p=this.mInteraction.gridSize;for(let g of t.nodes){let v=g.transformation.x*p,b=g.transformation.y*p,S=v+g.transformation.width*p,C=b+g.transformation.height*p;v<n.x&&S>e.x&&b<n.y&&C>e.y&&this.mSelectedNodes.add(g)}this.invalidateNodeVisuals()}startDocumentPointerTracking(){this.stopDocumentPointerTracking(),this.mDocumentPointerMoveHandler=t=>this.onDocumentPointerMove(t),this.mDocumentPointerUpHandler=t=>this.onDocumentPointerUp(t),document.addEventListener("pointermove",this.mDocumentPointerMoveHandler),document.addEventListener("pointerup",this.mDocumentPointerUpHandler)}stopDocumentPointerTracking(){this.mDocumentPointerMoveHandler&&(document.removeEventListener("pointermove",this.mDocumentPointerMoveHandler),this.mDocumentPointerMoveHandler=null),this.mDocumentPointerUpHandler&&(document.removeEventListener("pointerup",this.mDocumentPointerUpHandler),this.mDocumentPointerUpHandler=null)}static{On()}};var kn=`:host {\r
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
`;var ti=`<div class="properties-header">Properties</div>\r
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
`;function Rs(){function h(a,o){return function(l){e(o,"addInitializer"),n(l,"An initializer"),a.push(l)}}function t(a,o,c,l,r,y,f,T,w){var d;switch(r){case 1:d="accessor";break;case 2:d="method";break;case 3:d="getter";break;case 4:d="setter";break;default:d="field"}var s={kind:d,name:f?"#"+o:o,static:y,private:f,metadata:T},m={v:!1};s.addInitializer=h(l,m);var i,u;r===0?f?(i=c.get,u=c.set):(i=function(){return this[o]},u=function(x){this[o]=x}):r===2?i=function(){return c.value}:((r===1||r===3)&&(i=function(){return c.get.call(this)}),(r===1||r===4)&&(u=function(x){c.set.call(this,x)})),s.access=i&&u?{get:i,set:u}:i?{get:i}:{set:u};try{return a(w,s)}finally{m.v=!0}}function e(a,o){if(a.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(a,o){if(typeof a!="function")throw new TypeError(o+" must be a function")}function p(a,o){var c=typeof o;if(a===1){if(c!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(c!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function g(a,o,c,l,r,y,f,T,w){var d=c[0],s,m,i;f?r===0||r===1?s={get:c[3],set:c[4]}:r===3?s={get:c[3]}:r===4?s={set:c[3]}:s={value:c[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,l)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var u,x,I;if(typeof d=="function")u=t(d,l,s,T,r,y,f,w,i),u!==void 0&&(p(r,u),r===0?m=u:r===1?(m=u.init,x=u.get||i.get,I=u.set||i.set,i={get:x,set:I}):i=u);else for(var P=d.length-1;P>=0;P--){var M=d[P];if(u=t(M,l,s,T,r,y,f,w,i),u!==void 0){p(r,u);var N;r===0?N=u:r===1?(N=u.init,x=u.get||i.get,I=u.set||i.set,i={get:x,set:I}):i=u,N!==void 0&&(m===void 0?m=N:typeof m=="function"?m=[m,N]:m.push(N))}}if(r===0||r===1){if(m===void 0)m=function(D,E){return E};else if(typeof m!="function"){var _=m;m=function(D,E){for(var R=E,L=0;L<_.length;L++)R=_[L].call(D,R);return R}}else{var $=m;m=function(D,E){return $.call(D,E)}}a.push(m)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),f?r===1?(a.push(function(D,E){return i.get.call(D,E)}),a.push(function(D,E){return i.set.call(D,E)})):r===2?a.push(i):a.push(function(D,E){return i.call(D,E)}):Object.defineProperty(o,l,s))}function v(a,o,c){for(var l=[],r,y,f=new Map,T=new Map,w=0;w<o.length;w++){var d=o[w];if(Array.isArray(d)){var s=d[1],m=d[2],i=d.length>3,u=s>=5,x,I;if(u?(x=a,s=s-5,y=y||[],I=y):(x=a.prototype,r=r||[],I=r),s!==0&&!i){var P=u?T:f,M=P.get(m)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+m);!M&&s>2?P.set(m,s):P.set(m,!0)}g(l,x,d,m,s,u,i,I,c)}}return b(l,r),b(l,y),l}function b(a,o){o&&a.push(function(c){for(var l=0;l<o.length;l++)o[l].call(c);return c})}function S(a,o,c){if(o.length>0){for(var l=[],r=a,y=a.name,f=o.length-1;f>=0;f--){var T={v:!1};try{var w=o[f](r,{kind:"class",name:y,addInitializer:h(l,T),metadata:c})}finally{T.v=!0}w!==void 0&&(p(10,w),r=w)}return[C(r,c),function(){for(var d=0;d<l.length;d++)l[d].call(r)}]}}function C(a,o){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,c,l,r){if(r!==void 0)var y=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var f=Object.create(y===void 0?null:y),T=v(o,c,f);return l.length||C(o,f),{e:T,get c(){return S(o,l,f)}}}}function oi(h,t,e,n){return(oi=Rs())(h,t,e,n)}var ni,ei,Ls;ni=K({selector:"potatno-panel-properties",template:ti,style:kn});var ri=class{static{({c:[Ls,ei]}=oi(this,[],[ni]))}constructor(t=O.use(z),e=O.use(Q)){this.mComponent=t,this.mManager=e,this.mSelectedImport="",this.mUnsubscribe=null}mComponent;mManager;mSelectedImport;mUnsubscribe;get availableImports(){return this.mManager.project?.imports.map(t=>t.label)??[]}get availableTypes(){let t=this.mManager.project;if(!t)return[];let e=new Set;for(let[n]of t.types.types)e.add(n);return[...e].sort()}get editableByUser(){let t=this.mManager.activeFunction;return t!==null&&!t.isSystem}get functionImports(){return[...this.mManager.activeFunction?.imports??[]]}get functionInputs(){return(this.mManager.activeFunction?.inputs??[]).map(t=>({name:t.label,type:t.dataType}))}get functionName(){return this.mManager.activeFunction?.label??""}get functionOutputs(){return(this.mManager.activeFunction?.outputs??[]).map(t=>({name:t.label,type:t.dataType}))}get isSystem(){return this.mManager.activeFunction?.isSystem??!1}get nameDisabled(){return this.isSystem}get portsDisabled(){return this.isSystem&&!this.editableByUser}get unusedImports(){let t=new Set(this.functionImports);return this.availableImports.filter(e=>!t.has(e))}onConnect(){this.mUnsubscribe=this.mManager.subscribe(F.Document|F.Function|F.ActiveFunction,null,()=>{this.mComponent.updater.update()})}onDeconstruct(){this.mUnsubscribe?.(),this.mUnsubscribe=null}onAddSelectedImport(){let t=this.unusedImports,e=this.mSelectedImport||(t.length>0?t[0]:"");e&&(this.mManager.updateFunctionProperties({imports:[...this.functionImports,e]}),this.mSelectedImport="")}onAddInput(){let t=this.availableTypes.length>0?this.availableTypes[0]:"number";this.mManager.updateFunctionProperties({inputs:[...this.functionInputs,{name:this.uniquePortName("new_input"),type:t}]})}onAddOutput(){let t=this.availableTypes.length>0?this.availableTypes[0]:"number";this.mManager.updateFunctionProperties({outputs:[...this.functionOutputs,{name:this.uniquePortName("new_output"),type:t}]})}onDeleteImport(t){let e=[...this.functionImports];e.splice(t,1),this.mManager.updateFunctionProperties({imports:e})}onDeleteInput(t){let e=[...this.functionInputs];e.splice(t,1),this.mManager.updateFunctionProperties({inputs:e})}onDeleteOutput(t){let e=[...this.functionOutputs];e.splice(t,1),this.mManager.updateFunctionProperties({outputs:e})}onImportSelectChange(t){this.mSelectedImport=t.target.value}onInputNameChange(t,e){let n=e.target,p=n.value,g=!this.validateName(p)||this.isNameDuplicate(p,"input",t);n.style.borderColor=g?"var(--pn-accent-danger)":"";let v=[...this.functionInputs];v[t]={...v[t],name:p},this.mManager.updateFunctionProperties({inputs:v})}onInputTypeChange(t,e){let n=e.target.value,p=[...this.functionInputs];p[t]={...p[t],type:n},this.mManager.updateFunctionProperties({inputs:p})}onNameChange(t){let e=t.target,n=e.value,p=!this.validateName(n)||this.isNameDuplicate(n,"function");e.style.borderColor=p?"var(--pn-accent-danger)":"",this.mManager.updateFunctionProperties({name:n})}onOutputNameChange(t,e){let n=e.target,p=n.value,g=!this.validateName(p)||this.isNameDuplicate(p,"output",t);n.style.borderColor=g?"var(--pn-accent-danger)":"";let v=[...this.functionOutputs];v[t]={...v[t],name:p},this.mManager.updateFunctionProperties({outputs:v})}onOutputTypeChange(t,e){let n=e.target.value,p=[...this.functionOutputs];p[t]={...p[t],type:n},this.mManager.updateFunctionProperties({outputs:p})}isNameDuplicate(t,e,n){if(e!=="function"&&t===this.functionName)return!0;let p=this.functionInputs;for(let v=0;v<p.length;v++)if(!(e==="input"&&v===n)&&p[v].name===t)return!0;let g=this.functionOutputs;for(let v=0;v<g.length;v++)if(!(e==="output"&&v===n)&&g[v].name===t)return!0;return!1}uniquePortName(t){if(!this.isNameDuplicate(t,"function"))return t;let e=2;for(;this.isNameDuplicate(`${t}_${e}`,"function");)e++;return`${t}_${e}`}validateName(t){return/^[a-zA-Z][a-zA-Z0-9_]*$/.test(t)}static{ei()}};var ii=`:host {\r
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
`;var si=`<div class="resize-handle" (pointerdown)="this.onResizePointerDown($event)"></div>\r
<div class="preview-container" #PreviewContainer>\r
    <div class="preview-header">\r
        $if(this.hasErrors) {\r
            <span class="preview-title error-title">Errors ({{this.errors.length}})</span>\r
        }\r
        $if(!this.hasErrors) {\r
            <span class="preview-title">Preview</span>\r
            $if(this.showSelectors) {\r
                <div class="preview-selectors">\r
                    <select class="preview-select" (change)="this.onDisplaySelect($event)">\r
                        $for(display of this.displayOptions) {\r
                            <option [value]="this.display" [selected]="this.display === this.selectedDisplayId">{{this.display}}</option>\r
                        }\r
                    </select>\r
                    <select class="preview-select" (change)="this.onOutputSelect($event)">\r
                        $for(output of this.outputOptions) {\r
                            <option [value]="this.output.id" [selected]="this.output.id === this.selectedOutputId">{{this.output.label}}</option>\r
                        }\r
                    </select>\r
                </div>\r
            }\r
            $if(!this.showSelectors) {\r
                $if(this.hasDescriptors) {\r
                    <div class="preview-tabs">\r
                        $for(tab of this.tabs) {\r
                            <button type="button"\r
                                class="{{this.tabClass(this.tab)}}"\r
                                (click)="this.onTabSelect(this.tab.id)">\r
                                {{this.tab.label}}\r
                            </button>\r
                        }\r
                    </div>\r
                }\r
            }\r
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
        <div class="preview-content" potatno-preview="this.activeTabDriver"></div>\r
    }\r
</div>\r
`;function Fs(){function h(a,o){return function(l){e(o,"addInitializer"),n(l,"An initializer"),a.push(l)}}function t(a,o,c,l,r,y,f,T,w){var d;switch(r){case 1:d="accessor";break;case 2:d="method";break;case 3:d="getter";break;case 4:d="setter";break;default:d="field"}var s={kind:d,name:f?"#"+o:o,static:y,private:f,metadata:T},m={v:!1};s.addInitializer=h(l,m);var i,u;r===0?f?(i=c.get,u=c.set):(i=function(){return this[o]},u=function(x){this[o]=x}):r===2?i=function(){return c.value}:((r===1||r===3)&&(i=function(){return c.get.call(this)}),(r===1||r===4)&&(u=function(x){c.set.call(this,x)})),s.access=i&&u?{get:i,set:u}:i?{get:i}:{set:u};try{return a(w,s)}finally{m.v=!0}}function e(a,o){if(a.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(a,o){if(typeof a!="function")throw new TypeError(o+" must be a function")}function p(a,o){var c=typeof o;if(a===1){if(c!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(c!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function g(a,o,c,l,r,y,f,T,w){var d=c[0],s,m,i;f?r===0||r===1?s={get:c[3],set:c[4]}:r===3?s={get:c[3]}:r===4?s={set:c[3]}:s={value:c[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,l)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var u,x,I;if(typeof d=="function")u=t(d,l,s,T,r,y,f,w,i),u!==void 0&&(p(r,u),r===0?m=u:r===1?(m=u.init,x=u.get||i.get,I=u.set||i.set,i={get:x,set:I}):i=u);else for(var P=d.length-1;P>=0;P--){var M=d[P];if(u=t(M,l,s,T,r,y,f,w,i),u!==void 0){p(r,u);var N;r===0?N=u:r===1?(N=u.init,x=u.get||i.get,I=u.set||i.set,i={get:x,set:I}):i=u,N!==void 0&&(m===void 0?m=N:typeof m=="function"?m=[m,N]:m.push(N))}}if(r===0||r===1){if(m===void 0)m=function(D,E){return E};else if(typeof m!="function"){var _=m;m=function(D,E){for(var R=E,L=0;L<_.length;L++)R=_[L].call(D,R);return R}}else{var $=m;m=function(D,E){return $.call(D,E)}}a.push(m)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),f?r===1?(a.push(function(D,E){return i.get.call(D,E)}),a.push(function(D,E){return i.set.call(D,E)})):r===2?a.push(i):a.push(function(D,E){return i.call(D,E)}):Object.defineProperty(o,l,s))}function v(a,o,c){for(var l=[],r,y,f=new Map,T=new Map,w=0;w<o.length;w++){var d=o[w];if(Array.isArray(d)){var s=d[1],m=d[2],i=d.length>3,u=s>=5,x,I;if(u?(x=a,s=s-5,y=y||[],I=y):(x=a.prototype,r=r||[],I=r),s!==0&&!i){var P=u?T:f,M=P.get(m)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+m);!M&&s>2?P.set(m,s):P.set(m,!0)}g(l,x,d,m,s,u,i,I,c)}}return b(l,r),b(l,y),l}function b(a,o){o&&a.push(function(c){for(var l=0;l<o.length;l++)o[l].call(c);return c})}function S(a,o,c){if(o.length>0){for(var l=[],r=a,y=a.name,f=o.length-1;f>=0;f--){var T={v:!1};try{var w=o[f](r,{kind:"class",name:y,addInitializer:h(l,T),metadata:c})}finally{T.v=!0}w!==void 0&&(p(10,w),r=w)}return[C(r,c),function(){for(var d=0;d<l.length;d++)l[d].call(r)}]}}function C(a,o){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,c,l,r){if(r!==void 0)var y=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var f=Object.create(y===void 0?null:y),T=v(o,c,f);return l.length||C(o,f),{e:T,get c(){return S(o,l,f)}}}}function mi(h,t,e,n){return(mi=Fs())(h,t,e,n)}var pi,ai,di,fi,li,ci,ui,js;pi=K({selector:"potatno-preview",template:si,style:ii,modules:[pe]}),di=U.state(),fi=it("PreviewContainer");var hi=class{static{({e:[li,ci,ui],c:[js,ai]}=mi(this,[[di,1,"mActiveTabId"],[fi,1,"containerElement"]],[pi]))}constructor(t=O.use(z),e=O.use(Q)){this.mComponent=t,this.mDragging=!1,this.mManager=e,this.mStartHeight=0,this.mStartWidth=0,this.mStartX=0,this.mStartY=0,this.mUnsubscribe=null}mComponent;mDragging;mManager;mStartHeight;mStartWidth;mStartX;mStartY;mUnsubscribe;#t=(ui(this),li(this,null));get mActiveTabId(){return this.#t}set mActiveTabId(t){this.#t=t}#e=ci(this);get containerElement(){return this.#e}set containerElement(t){this.#e=t}get activeTabDriver(){return this.tabs.find(t=>t.id===this.mActiveTabId)?.driver??null}get displayOptions(){return this.mManager.previewManager?.getActivePreviewDisplays()??[]}get errors(){return this.mManager.integrity.errors}get hasDescriptors(){return this.mManager.previewTabs.length>0}get hasErrors(){return!this.mManager.integrity.isValid}get outputOptions(){return this.mManager.previewManager?.getActivePreviewOutputs()??[]}get selectedDisplayId(){return this.mManager.previewManager?.activePreviewDisplayId??""}get selectedOutputId(){return this.mManager.previewManager?.activePreviewOutputId??""}get showSelectors(){return this.mManager.previewManager?.activePreviewIsUserFunction??!1}get tabs(){return this.mManager.previewTabs}onConnect(){this.mUnsubscribe=this.mManager.subscribe(F.Document|F.Function|F.ActiveFunction|F.Node|F.Connection|F.Preview,null,()=>{this.reconcileActiveTab(),this.mComponent.updater.update()}),this.reconcileActiveTab()}onDeconstruct(){this.mUnsubscribe?.(),this.mUnsubscribe=null}onDisplaySelect(t){this.mManager.setPreviewDisplay(t.target.value)}onOutputSelect(t){this.mManager.setPreviewOutput(t.target.value)}onResizePointerDown(t){t.preventDefault(),t.stopPropagation(),this.mDragging=!0,this.mStartX=t.clientX,this.mStartY=t.clientY;let e=this.containerElement;if(!e)return;this.mStartWidth=e.offsetWidth,this.mStartHeight=e.offsetHeight,t.target.setPointerCapture(t.pointerId);let n=g=>{if(!this.mDragging)return;let v=this.mStartX-g.clientX,b=this.mStartY-g.clientY;e.style.width=Math.max(200,this.mStartWidth+v)+"px",e.style.height=Math.max(150,this.mStartHeight+b)+"px"},p=g=>{this.mDragging=!1,g.target.releasePointerCapture(g.pointerId),document.removeEventListener("pointermove",n),document.removeEventListener("pointerup",p)};document.addEventListener("pointermove",n),document.addEventListener("pointerup",p)}onTabSelect(t){this.mActiveTabId!==t&&(this.mActiveTabId=t)}tabClass(t){return t.id===this.mActiveTabId?"preview-tab selected":"preview-tab"}reconcileActiveTab(){let t=this.tabs;this.mActiveTabId!==null&&t.some(n=>n.id===this.mActiveTabId)||(this.mActiveTabId=t[0]?.id??null)}static{ai()}};function $s(){function h(a,o){return function(l){e(o,"addInitializer"),n(l,"An initializer"),a.push(l)}}function t(a,o,c,l,r,y,f,T,w){var d;switch(r){case 1:d="accessor";break;case 2:d="method";break;case 3:d="getter";break;case 4:d="setter";break;default:d="field"}var s={kind:d,name:f?"#"+o:o,static:y,private:f,metadata:T},m={v:!1};s.addInitializer=h(l,m);var i,u;r===0?f?(i=c.get,u=c.set):(i=function(){return this[o]},u=function(x){this[o]=x}):r===2?i=function(){return c.value}:((r===1||r===3)&&(i=function(){return c.get.call(this)}),(r===1||r===4)&&(u=function(x){c.set.call(this,x)})),s.access=i&&u?{get:i,set:u}:i?{get:i}:{set:u};try{return a(w,s)}finally{m.v=!0}}function e(a,o){if(a.v)throw new Error("attempted to call "+o+" after decoration was finished")}function n(a,o){if(typeof a!="function")throw new TypeError(o+" must be a function")}function p(a,o){var c=typeof o;if(a===1){if(c!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&n(o.get,"accessor.get"),o.set!==void 0&&n(o.set,"accessor.set"),o.init!==void 0&&n(o.init,"accessor.init")}else if(c!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function g(a,o,c,l,r,y,f,T,w){var d=c[0],s,m,i;f?r===0||r===1?s={get:c[3],set:c[4]}:r===3?s={get:c[3]}:r===4?s={set:c[3]}:s={value:c[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,l)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var u,x,I;if(typeof d=="function")u=t(d,l,s,T,r,y,f,w,i),u!==void 0&&(p(r,u),r===0?m=u:r===1?(m=u.init,x=u.get||i.get,I=u.set||i.set,i={get:x,set:I}):i=u);else for(var P=d.length-1;P>=0;P--){var M=d[P];if(u=t(M,l,s,T,r,y,f,w,i),u!==void 0){p(r,u);var N;r===0?N=u:r===1?(N=u.init,x=u.get||i.get,I=u.set||i.set,i={get:x,set:I}):i=u,N!==void 0&&(m===void 0?m=N:typeof m=="function"?m=[m,N]:m.push(N))}}if(r===0||r===1){if(m===void 0)m=function(D,E){return E};else if(typeof m!="function"){var _=m;m=function(D,E){for(var R=E,L=0;L<_.length;L++)R=_[L].call(D,R);return R}}else{var $=m;m=function(D,E){return $.call(D,E)}}a.push(m)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),f?r===1?(a.push(function(D,E){return i.get.call(D,E)}),a.push(function(D,E){return i.set.call(D,E)})):r===2?a.push(i):a.push(function(D,E){return i.call(D,E)}):Object.defineProperty(o,l,s))}function v(a,o,c){for(var l=[],r,y,f=new Map,T=new Map,w=0;w<o.length;w++){var d=o[w];if(Array.isArray(d)){var s=d[1],m=d[2],i=d.length>3,u=s>=5,x,I;if(u?(x=a,s=s-5,y=y||[],I=y):(x=a.prototype,r=r||[],I=r),s!==0&&!i){var P=u?T:f,M=P.get(m)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+m);!M&&s>2?P.set(m,s):P.set(m,!0)}g(l,x,d,m,s,u,i,I,c)}}return b(l,r),b(l,y),l}function b(a,o){o&&a.push(function(c){for(var l=0;l<o.length;l++)o[l].call(c);return c})}function S(a,o,c){if(o.length>0){for(var l=[],r=a,y=a.name,f=o.length-1;f>=0;f--){var T={v:!1};try{var w=o[f](r,{kind:"class",name:y,addInitializer:h(l,T),metadata:c})}finally{T.v=!0}w!==void 0&&(p(10,w),r=w)}return[C(r,c),function(){for(var d=0;d<l.length;d++)l[d].call(r)}]}}function C(a,o){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,c,l,r){if(r!==void 0)var y=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var f=Object.create(y===void 0?null:y),T=v(o,c,f);return l.length||C(o,f),{e:T,get c(){return S(o,l,f)}}}}function xi(h,t,e,n){return(xi=$s())(h,t,e,n)}var Ti,gi,Ei,Di,vi,yi,bi,Je;Ti=K({selector:"potatno-code-editor",template:Qr,style:Kr}),Ei=it("panelLeft"),Di=it("panelRight");var wi=class{static{({e:[vi,yi,bi],c:[Je,gi]}=xi(this,[[Ei,1,"panelLeft"],[Di,1,"panelRight"],[et,4,"project"],[et,4,"file"],[et,2,"triggerPreviewUpdate"]],[Ti]))}constructor(t=O.use(z),e=O.use(Q)){this.mComponent=t,this.mManager=e,this.mProject=null,this.mResizeMoveHandler=null,this.mResizeState=null,this.mResizeUpHandler=null,this.mUnsubscribe=null}mComponent;mManager;mProject;mResizeMoveHandler;mResizeState;mResizeUpHandler;mUnsubscribe;#t=(bi(this),vi(this));get panelLeft(){return this.#t}set panelLeft(t){this.#t=t}#e=yi(this);get panelRight(){return this.#e}set panelRight(t){this.#e=t}get hasPreview(){let t=this.mManager.project,e=this.mManager.activeFunction;if(!t||!e||!t.previews)return!1;for(let n of t.previews.entries)if(n.executorFunctionId===e.definitionId)return!0;return!1}get file(){return this.mManager.graph.document}set project(t){this.mProject=t}set file(t){this.mProject&&this.mManager.initialize(this.mProject,t)}triggerPreviewUpdate(){return this.mManager.triggerPreviewUpdate()}onConnect(){this.mUnsubscribe=this.mManager.subscribe(F.Document|F.Function|F.Preview,null,()=>{this.mComponent.updater.update()})}onDeconstruct(){this.mUnsubscribe?.(),this.mUnsubscribe=null,this.mManager.deconstruct(),this.stopPanelResize()}onResizeLeftStart(t){t.preventDefault(),this.startPanelResize("left",t)}onResizeRightStart(t){t.preventDefault(),this.startPanelResize("right",t)}startPanelResize(t,e){this.stopPanelResize();let n=t==="left"?this.panelLeft:this.panelRight;this.mResizeState={panel:t,startWidth:n.offsetWidth,startX:e.clientX};let p=v=>{if(!this.mResizeState)return;let b=t==="left"?v.clientX-this.mResizeState.startX:this.mResizeState.startX-v.clientX;n.style.width=`${Math.max(200,Math.min(500,this.mResizeState.startWidth+b))}px`},g=()=>{document.removeEventListener("pointermove",p),document.removeEventListener("pointerup",g),this.mResizeMoveHandler=null,this.mResizeState=null,this.mResizeUpHandler=null};this.mResizeMoveHandler=p,this.mResizeUpHandler=g,document.addEventListener("pointermove",p),document.addEventListener("pointerup",g)}stopPanelResize(){this.mResizeMoveHandler&&(document.removeEventListener("pointermove",this.mResizeMoveHandler),this.mResizeMoveHandler=null),this.mResizeUpHandler&&(document.removeEventListener("pointerup",this.mResizeUpHandler),this.mResizeUpHandler=null),this.mResizeState=null}static{gi()}};var Si=`:host {\r
    display: block;\r
    width: 100%;\r
    height: 100%;\r
}\r
\r
potatno-code-editor {\r
    display: block;\r
    width: 100%;\r
    height: 100%;\r
}`;var Ii=`:host {\r
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
`;var _e=class extends kt{mCodeEditor;mProject;get document(){return this.mCodeEditor.file}set document(t){this.mCodeEditor.file=t}get project(){return this.mProject}constructor(t){super(),this.mProject=t,this.addStyle(Ii),this.addStyle(Si),this.mCodeEditor=this.addContent(Je),this.mCodeEditor.project=t,this.mCodeEditor.file=new Mt(t)}update(){return this.mCodeEditor.triggerPreviewUpdate()}};var Fe=class h{static new(t,e){return new h(e)}mDefaultResult;mExpectedParameters;mGenerate;mId;mTypeAdapter;mUpdate;get defaultResult(){return this.mDefaultResult}get expectedParameters(){return this.mExpectedParameters}get id(){return this.mId}get typeAdapter(){return this.mTypeAdapter}constructor(t){this.mDefaultResult=t.defaultResult,this.mExpectedParameters=t.expectedParameters,this.mGenerate=t.generate,this.mId=t.id,this.mTypeAdapter=t.typeAdapter,this.mUpdate=t.update}adapterFor(t){return this.mTypeAdapter[t]}generate(){return this.mGenerate()}update(t,e){return this.mUpdate(t,e)}};var de=class h{static new(t,e,n){return new h(t,e,n)}mBuildFunction;mBuildNode;mFunction;mParameters;mProjectTypes;get function(){return this.mFunction}get parameters(){return this.mParameters}get projectTypes(){return this.mProjectTypes}constructor(t,e,n){this.mProjectTypes=t,this.mFunction=e,this.mParameters=n.parameters,this.mBuildFunction=n.buildFunction,this.mBuildNode=n.buildNode}compileFunction(t){return this.mBuildFunction(this.buildContext(),t)}compileNode(t,e){return this.mBuildNode(this.buildContext(),t,e)}buildContext(){return{function:this.mFunction,parameters:this.mParameters,projectTypes:this.mProjectTypes}}};var je=class{mCachedCallable;mDisplay;mElement;mExecutor;mFunctionResultProvider;mNodeResultProvider;mPortTarget;get dataType(){return this.mPortTarget?this.mPortTarget.documentPort.dataType:null}get element(){return this.mElement||(this.mElement=this.mDisplay.generate()),this.mElement}get portTarget(){return this.mPortTarget}constructor(t){this.mDisplay=t.display,this.mExecutor=t.executor,this.mCachedCallable=null,this.mElement=null,t.portTarget===null?(this.mPortTarget=null,this.mFunctionResultProvider=t.generatorResultProvider,this.mNodeResultProvider=null):(this.mPortTarget=t.portTarget,this.mFunctionResultProvider=null,this.mNodeResultProvider=t.generatorResultProvider)}invalidateCache(){this.mCachedCallable=null}async render(t=!0){if(!this.mCachedCallable){if(!t)return;this.mCachedCallable=this.compileCachedCallable()}await Promise.resolve(this.mDisplay.update(this.element,this.mCachedCallable))}compileCachedCallable(){if(this.mFunctionResultProvider!==null)return this.mExecutor.compileFunction(this.mFunctionResultProvider());let t=this.mNodeResultProvider(),e=this.mExecutor.compileNode(t,this.mPortTarget),n=this.mPortTarget.documentPort.resolvedDataType,g=this.mDisplay.adapterFor(n)??(v=>v);return async v=>{let b=await Promise.resolve(e(v));return g(b)}}};var $e=class h{static new(t){return new h(t)}mEntries;mProjectTypes;get entries(){return this.mEntries}get projectTypes(){return this.mProjectTypes}constructor(t){this.mProjectTypes=t,this.mEntries=new Array}addDisplay(t,e){this.mEntries.push({displayId:t.id,executorFunctionId:e.function.id,createDriver:n=>new je({display:t,executor:e,...n})})}};var V=class h extends mt{static newStaticNode(t){return new h(t)}constructor(t){super({id:t.id,label:t.label,category:t.category,regions:t.regions??null,generators:{ports:{inputs:e=>{for(let n of t.ports.inputs)e(n)},outputs:e=>{for(let n of t.ports.outputs)e(n)}},code:t.generators.code}})}};var fe=class h{static new(t,e){return new h(e)}mId;mLabel;mStatics;mNodesProvider;mCodeGenerator;get id(){return this.mId}get label(){return this.mLabel}get codeGenerator(){return this.mCodeGenerator}get statics(){return this.mStatics}constructor(t){this.mId=t.id,this.mLabel=t.label,this.mNodesProvider=t.nodes,this.mStatics=t.statics,this.mCodeGenerator=t.generator.code}getNodeDefinitions(t){let e=p=>{if(!p)return new Array;let g=new Array;return p(v=>{g.push(v)},t),g},n={};return Object.defineProperty(n,"entry",{get:()=>e(this.mNodesProvider.entry)}),Object.defineProperty(n,"exit",{get:()=>e(this.mNodesProvider.exit)}),Object.defineProperty(n,"dynamic",{get:()=>e(this.mNodesProvider.dynamic)}),n}},Ve={none:0,imports:1,inputs:2,outputs:4};var ze=class h{static new(t){return new h(t)}mTypes;get types(){return this.mTypes}get typeNames(){return Array.from(this.mTypes.keys())}constructor(t){this.mTypes=new Map;for(let[e,n]of Object.entries(t))this.mTypes.set(e,{name:e,...n})}getDefaultValue(t){return this.getType(t).default.value}getType(t){if(!this.mTypes.has(t))throw new Error(`Type "${t}" is not defined in the project types definition.`);return this.mTypes.get(t)}isGenericType(t){return/^<[^>]+>$/.test(t)}};var Be=class h extends mt{static DEFINITION_ID="23e9319b-3b62-4dd8-858a-17d97ddee94e";static newConjunctionNode(){return new h}constructor(){super({id:h.DEFINITION_ID,label:"Flow Conjunction",category:"Conjunction",generators:{ports:{inputs:t=>{t({label:"in",id:"in",portType:"flow"})},outputs:t=>{t({label:"out",id:"out",portType:"flow"})}},code:()=>{throw new A("Conjunction node code generators should never be called.",h)}}})}};var Ue=class h extends mt{static DEFINITION_ID="a579584d-5d35-42b5-b2ba-3daddee488e0";static newConjunctionNode(){return new h}constructor(){super({id:h.DEFINITION_ID,label:"Value Conjunction",category:"Conjunction",generators:{ports:{inputs:t=>{t({label:"in",id:"in",portType:"value",dataType:"<T>"})},outputs:t=>{t({label:"out",id:"out",portType:"value",dataType:"<T>"})}},code:()=>{throw new A("Conjunction node code generators should never be called.",h)}}})}};var Ge=class h{static new(t){return new h(t)}mCodeGenerator;mEntryPoint;mImports;mNodeDefinitions;mPreviews;mTypes;mUserFunctions;get generator(){return this.mCodeGenerator}get entryPoint(){return this.mEntryPoint}get imports(){return this.mImports}get nodeDefinitions(){return Array.from(this.mNodeDefinitions.values())}get previews(){return this.mPreviews}get types(){return this.mTypes}get userFunctions(){return this.mUserFunctions}constructor(t){if(this.mTypes=t.types,this.mCodeGenerator=t.generator,this.mPreviews=t.previews??null,this.mNodeDefinitions=new Map,this.mImports=new Array,this.mUserFunctions=new Map,this.mEntryPoint=t.functions.entry,t.functions.dynamic)for(let e of t.functions.dynamic)this.mUserFunctions.set(e.id,e);this.addNodeDefinition(Be.newConjunctionNode()),this.addNodeDefinition(Ue.newConjunctionNode())}addImport(t){this.mImports.push(t)}addNodeDefinition(t){this.mNodeDefinitions.set(t.id,t)}getFunction(t){return this.mEntryPoint.id===t?this.mEntryPoint:this.mUserFunctions.get(t)}};(()=>{let h=new WebSocket("ws://127.0.0.1:8088");h.addEventListener("open",()=>{console.log("Refresh connection established")}),h.addEventListener("message",t=>{console.log("Bundle finished. Start refresh"),t.data==="REFRESH"&&window.location.reload()})})();var Gt=ze.new({number:{default:{string:["0"],value:0},convert:h=>{let t=h[0],e=parseFloat(t);if(isNaN(e))throw new Error(`Invalid number: "${t}"`);return e.toString()},inputs:[{name:"value",type:"number"}]},string:{default:{string:[""],value:""},convert:h=>h[0],inputs:[{name:"value",type:"string"}]},boolean:{default:{string:["false"],value:!1},convert:h=>{let t=h[0].toLowerCase();if(t==="true")return"true";if(t==="false")return"false";throw new Error(`Invalid boolean: "${h[0]}"`)},inputs:[{name:"value",type:"boolean"}]}}),Ci=fe.new(Gt,{id:"pixelShader",label:"Pixel Shader",statics:Ve.imports|Ve.inputs,nodes:{entry:h=>{h(V.newStaticNode({id:"OnPixel",label:"OnPixel",category:"event",ports:{inputs:[],outputs:[{label:"exec",id:"exec",portType:"flow"},{label:"x",id:"x",portType:"value",dataType:"number"},{label:"y",id:"y",portType:"value",dataType:"number"}]},generators:{code:t=>{let e=t.outputs.x.value,n=t.outputs.y.value;return`(${e}, ${n}) => { ${t.outputs.exec.code.inner} }`}}}))},exit:h=>{h(V.newStaticNode({id:"PixelResult",label:"PixelResult",category:"Output",ports:{inputs:[{label:"exec",id:"exec",portType:"flow"},{label:"red",id:"red",portType:"value",dataType:"number"},{label:"green",id:"green",portType:"value",dataType:"number"},{label:"blue",id:"blue",portType:"value",dataType:"number"}],outputs:[]},generators:{code:t=>`return [${t.inputs.red.value}, ${t.inputs.green.value}, ${t.inputs.blue.value}];`}}))}},generator:{code:{body:h=>{let t=h.graphResultOf("OnPixel");return`const ${h.function.definitionId} = ${t?.code??"() => [0, 0, 0]"};`},value:h=>`${h.function.definitionId}()`}}}),Pi=fe.new(Gt,{id:"Helper Function",label:"Helper Function",statics:Ve.none,nodes:{entry:(h,t)=>{h(mt.newNode({id:"HelperFunctionEntry",label:"Entry",category:"event",generators:{ports:{outputs:e=>{e({label:"exec",id:"exec",portType:"flow"});for(let n of t.inputs)e({label:n.label,id:n.label,portType:"value",dataType:n.dataType})},inputs:()=>{}},code:e=>`(${Object.entries(e.outputs).filter(([p])=>p!=="exec").map(([,p])=>p.value).join(", ")}) => { ${e.outputs.exec.code.inner} }`}}))},exit:(h,t)=>{h(mt.newNode({id:"HelperFunctionReturn",label:"Return",category:"event",generators:{ports:{outputs:()=>{},inputs:e=>{e({label:"exec",id:"exec",portType:"flow"});for(let n of t.outputs)e({label:n.label,id:n.label,portType:"value",dataType:n.dataType})}},code:e=>`return { ${Object.entries(e.inputs).map(([p,g])=>`${p}: (${g.value})`).join(", ")} };`}}))}},generator:{code:{body:h=>{let t=`__fn_${h.function.id.replaceAll("-","_")}`,e=h.graphResultOf("HelperFunctionEntry");return`const ${t} = ${e?.code??"() => ({})"};`},value:h=>{let t=`__fn_${h.function.id.replaceAll("-","_")}`,e=Object.entries(h.inputs).map(([,g])=>g.value).join(", "),n=Object.entries(h.outputs).filter(([g])=>g!=="Output").map(([g,v])=>`${g}: ${v.value}`).join(", "),p=h.outputs.Output?.code.inner??"";return n===""?`${t}(${e}); ${p}`:`const { ${n} } = ${t}(${e}); ${p}`}}}}),Bs=48,Us=48,Gs=de.new(Gt,Ci,{parameters:{x:0,y:0},buildFunction:(h,t)=>{let e=t.code,n=h.function.id,p=new Function(`${e}
return ${n};`)();return g=>p(g.x,g.y)},buildNode:(h,t,e)=>{let n=t.code,p=h.function.id,g=`/*[${e.value}]*/`,v=n.includes(g)?n.replace(g,`; return ${e.value};`):n,b=new Function(`${v}
return ${p};`)();return S=>b(S.x,S.y)}}),Hs=de.new(Gt,Pi,{parameters:{x:0,y:0},buildFunction:()=>()=>[0,0,0],buildNode:(h,t,e)=>{let n=t.entryPoint.function,p=`__fn_${n.id.replaceAll("-","_")}`,g=h.projectTypes,v=n.inputs.map(C=>g.getDefaultValue(C.dataType)),b=e.value,S=new Function(`${t.code}
return ${p};`)();return()=>{let C=S(...v);return C?C[b]:void 0}}}),Mi=Fe.new(Gt,{id:"2dCanvas",expectedParameters:{x:0,y:0},defaultResult:[0,0,0],generate:()=>{let h=document.createElement("canvas");return h.width=Bs,h.height=Us,h.style.width="100%",h.style.height="100%",h.style.imageRendering="pixelated",h},typeAdapter:{number:h=>[h,h,h]},update:async(h,t)=>{let e=h.getContext("2d");if(!e)return;let n=h.width,p=h.height,g=e.createImageData(n,p),v=g.data;for(let b=0;b<p;b++)for(let S=0;S<n;S++){let C=S/n,a=b/p,o=await Promise.resolve(t({x:C,y:a})),c=(b*n+S)*4;v[c]=Math.floor(Math.max(0,Math.min(1,o[0]||0))*255),v[c+1]=Math.floor(Math.max(0,Math.min(1,o[1]||0))*255),v[c+2]=Math.floor(Math.max(0,Math.min(1,o[2]||0))*255),v[c+3]=255}e.putImageData(g,0,0)}}),Ke=$e.new(Gt);Ke.addDisplay(Mi,Gs);Ke.addDisplay(Mi,Hs);var X=Ge.new({types:Gt,previews:Ke,functions:{entry:Ci,dynamic:[Pi]},generator:{code:h=>{let t="";for(let e of h.dependencies)t+=`${e.code}
`;return t+=h.entryPoint.code,t},values:{valueId:h=>`v_${h}`,hook:h=>`/*[${h}]*/`}}});X.addImport({id:"Math",label:"Math",nodes:[V.newStaticNode({id:"Math.PI",label:"Math.PI",category:"value",ports:{inputs:[],outputs:[{label:"value",id:"value",portType:"value",dataType:"number"}]},generators:{code:h=>`const ${h.outputs.value.value} = Math.PI;`}}),V.newStaticNode({id:"Math.E",label:"Math.E",category:"value",ports:{inputs:[],outputs:[{label:"value",id:"value",portType:"value",dataType:"number"}]},generators:{code:h=>`const ${h.outputs.value.value} = Math.E;`}}),V.newStaticNode({id:"Math.abs",label:"Math.abs",category:"Function",ports:{inputs:[{label:"value",id:"value",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:h=>`const ${h.outputs.result.value} = Math.abs(${h.inputs.value.value});`}}),V.newStaticNode({id:"Math.floor",label:"Math.floor",category:"Function",ports:{inputs:[{label:"value",id:"value",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:h=>`const ${h.outputs.result.value} = Math.floor(${h.inputs.value.value});`}}),V.newStaticNode({id:"Math.random",label:"Math.random",category:"Function",ports:{inputs:[],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:h=>`const ${h.outputs.result.value} = Math.random();`}}),V.newStaticNode({id:"Math.sin",label:"Math.sin",category:"Function",ports:{inputs:[{label:"value",id:"value",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:h=>`const ${h.outputs.result.value} = Math.sin(${h.inputs.value.value});`}}),V.newStaticNode({id:"Math.cos",label:"Math.cos",category:"Function",ports:{inputs:[{label:"value",id:"value",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:h=>`const ${h.outputs.result.value} = Math.cos(${h.inputs.value.value});`}})]});X.addImport({id:"Time",label:"Time",nodes:[V.newStaticNode({id:"CurrentTime",label:"CurrentTime",category:"value",ports:{inputs:[],outputs:[{label:"seconds",id:"seconds",portType:"value",dataType:"number"}]},generators:{code:h=>`const ${h.outputs.seconds.value} = (performance.now() / 1000);`}})]});X.addNodeDefinition(V.newStaticNode({id:"Add",label:"Add",category:"operator",ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:h=>`const ${h.outputs.result.value} = ${h.inputs.a.value} + ${h.inputs.b.value};`}}));X.addNodeDefinition(V.newStaticNode({id:"Subtract",label:"Subtract",category:"operator",ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:h=>`const ${h.outputs.result.value} = ${h.inputs.a.value} - ${h.inputs.b.value};`}}));X.addNodeDefinition(V.newStaticNode({id:"Multiply",label:"Multiply",category:"operator",ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:h=>`const ${h.outputs.result.value} = ${h.inputs.a.value} * ${h.inputs.b.value};/*MULTIPLYHOOK_${h.outputs.result.value}*/`}}));X.addNodeDefinition(V.newStaticNode({id:"Divide",label:"Divide",category:"operator",ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:h=>`const ${h.outputs.result.value} = ${h.inputs.a.value} / ${h.inputs.b.value};`}}));X.addNodeDefinition(V.newStaticNode({id:"Modulo",label:"Modulo",category:"operator",ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:h=>`const ${h.outputs.result.value} = ${h.inputs.a.value} % ${h.inputs.b.value};`}}));X.addNodeDefinition(V.newStaticNode({id:"Equal",label:"Equal",category:"operator",ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"boolean"}]},generators:{code:h=>`const ${h.outputs.result.value} = ${h.inputs.a.value} === ${h.inputs.b.value};`}}));X.addNodeDefinition(V.newStaticNode({id:"Not Equal",label:"Not Equal",category:"operator",ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"boolean"}]},generators:{code:h=>`const ${h.outputs.result.value} = ${h.inputs.a.value} !== ${h.inputs.b.value};`}}));X.addNodeDefinition(V.newStaticNode({id:"Less Than",label:"Less Than",category:"operator",ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"boolean"}]},generators:{code:h=>`const ${h.outputs.result.value} = ${h.inputs.a.value} < ${h.inputs.b.value};`}}));X.addNodeDefinition(V.newStaticNode({id:"Greater Than",label:"Greater Than",category:"operator",ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"boolean"}]},generators:{code:h=>`const ${h.outputs.result.value} = ${h.inputs.a.value} > ${h.inputs.b.value};`}}));X.addNodeDefinition(V.newStaticNode({id:"And",label:"And",category:"operator",ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"boolean"},{label:"b",id:"b",portType:"value",dataType:"boolean"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"boolean"}]},generators:{code:h=>`const ${h.outputs.result.value} = ${h.inputs.a.value} && ${h.inputs.b.value};`}}));X.addNodeDefinition(V.newStaticNode({id:"Or",label:"Or",category:"operator",ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"boolean"},{label:"b",id:"b",portType:"value",dataType:"boolean"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"boolean"}]},generators:{code:h=>`const ${h.outputs.result.value} = ${h.inputs.a.value} || ${h.inputs.b.value};`}}));X.addNodeDefinition(V.newStaticNode({id:"Not",label:"Not",category:"operator",ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"boolean"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"boolean"}]},generators:{code:h=>`const ${h.outputs.result.value} = !${h.inputs.a.value};`}}));X.addNodeDefinition(V.newStaticNode({id:"Number to String",label:"Number to String",category:"type-conversion",ports:{inputs:[{label:"input",id:"input",portType:"value",dataType:"number"}],outputs:[{label:"output",id:"output",portType:"value",dataType:"string"}]},generators:{code:h=>`const ${h.outputs.output.value} = String(${h.inputs.input.value});`}}));X.addNodeDefinition(V.newStaticNode({id:"String to Number",label:"String to Number",category:"type-conversion",ports:{inputs:[{label:"input",id:"input",portType:"value",dataType:"string"}],outputs:[{label:"output",id:"output",portType:"value",dataType:"number"}]},generators:{code:h=>`const ${h.outputs.output.value} = Number(${h.inputs.input.value});`}}));X.addNodeDefinition(V.newStaticNode({id:"Boolean to String",label:"Boolean to String",category:"type-conversion",ports:{inputs:[{label:"input",id:"input",portType:"value",dataType:"boolean"}],outputs:[{label:"output",id:"output",portType:"value",dataType:"string"}]},generators:{code:h=>`const ${h.outputs.output.value} = String(${h.inputs.input.value});`}}));X.addNodeDefinition(V.newStaticNode({id:"If",label:"If",category:"flow",ports:{inputs:[{label:"exec",id:"exec",portType:"flow"},{label:"condition",id:"condition",portType:"value",dataType:"boolean"}],outputs:[{label:"then",id:"then",portType:"flow"},{label:"else",id:"else",portType:"flow"}]},generators:{code:h=>`if (${h.inputs.condition.value}) {
${h.outputs.then.code.inner}
} else {
${h.outputs.else.code.inner}
}`}}));X.addNodeDefinition(V.newStaticNode({id:"While",label:"While",category:"flow",ports:{inputs:[{label:"exec",id:"exec",portType:"flow"},{label:"condition",id:"condition",portType:"value",dataType:"boolean"}],outputs:[{label:"body",id:"body",portType:"flow"}]},generators:{code:h=>`while (${h.inputs.condition.value}) {
${h.outputs.body.code.inner}
}`}}));X.addNodeDefinition(V.newStaticNode({id:"For Loop",label:"For Loop",category:"flow",ports:{inputs:[{label:"exec",id:"exec",portType:"flow"},{label:"count",id:"count",portType:"value",dataType:"number"}],outputs:[{label:"exec",id:"exec",portType:"flow"},{label:"index",id:"index",portType:"value",dataType:"number"}]},generators:{code:h=>`for (let ${h.outputs.index.value} = 0; ${h.outputs.index.value} < ${h.inputs.count.value}; ${h.outputs.index.value}++) {
${h.outputs.exec.code.inner}
}`}}));X.addNodeDefinition(V.newStaticNode({id:"Console Log",label:"Console Log",category:"Function",ports:{inputs:[{label:"message",id:"message",portType:"value",dataType:"string"}],outputs:[]},generators:{code:({inputs:h})=>`console.log(${h.message.value});`}}));X.addNodeDefinition(V.newStaticNode({id:"String Concat",label:"String Concat",category:"Function",ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"string"},{label:"b",id:"b",portType:"value",dataType:"string"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"string"}]},generators:{code:h=>`const ${h.outputs.result.value} = ${h.inputs.a.value} + ${h.inputs.b.value};`}}));var Qe=new _e(X);Qe.appendTo(document.body);Qe.document=new Mt(X);async function Ni(){try{await Qe.update()}catch(h){console.error("[Page] Preview render pass failed:",h)}requestAnimationFrame(Ni)}Ni();})();
//# sourceMappingURL=page.js.map
