(()=>{var Bt=class f extends Array{static newListWith(...t){let e=new f;return e.push(...t),e}clear(){this.splice(0,this.length)}clone(){return f.newListWith(...this)}distinct(){return f.newListWith(...new Set(this))}equals(t){if(this===t)return!0;if(!t||this.length!==t.length)return!1;for(let e=0;e<this.length;++e)if(this[e]!==t[e])return!1;return!0}remove(t){let e=this.indexOf(t);if(e!==-1)return this.splice(e,1)[0]}replace(t,e){let o=this.indexOf(t);if(o!==-1){let c=this[o];return this[o]=e,c}}toString(){return`[${super.join(", ")}]`}};var A=class extends Error{mTarget;get target(){return this.mTarget}constructor(t,e,o){super(t,o),this.mTarget=e}};var et=class f extends Map{add(t,e){if(!this.has(t))this.set(t,e);else throw new A("Can't add duplicate key to dictionary.",this)}clone(){return new f(this)}getAllKeysOfValue(t){return[...this.entries()].filter(c=>c[1]===t).map(c=>c[0])}getOrDefault(t,e){let o=this.get(t);return typeof o<"u"?o:e}map(t){let e=new Bt;for(let o of this){let c=t(o[0],o[1]);e.push(c)}return e}};var Rt=class f{mSize;mTopItem;get size(){return this.mSize}get top(){if(this.mTopItem)return this.mTopItem.value}constructor(){this.mTopItem=null,this.mSize=0}clone(){let t=new f;return t.mTopItem=this.mTopItem,t.mSize=this.mSize,t}*entries(){let t=this.mTopItem;for(;t!==null;)yield t.value,t=t.previous}flush(){let t=new Array;for(;this.mTopItem;)t.push(this.pop());return t}pop(){if(!this.mTopItem)return;let t=this.mTopItem.value;return this.mTopItem=this.mTopItem.previous,this.mSize--,t}push(t){let e={previous:this.mTopItem,value:t};this.mTopItem=e,this.mSize++}toArray(){return[...this.entries()]}};var ne=class{mCompareFunction;constructor(t){this.mCompareFunction=t}differencesOf(t,e){let o;if(t.length===0||e.length===0){if(o=new Array,t.length===0)for(let S=0;S<e.length;S++)o.push({changeState:St.Insert,item:e[S]});else for(let S=0;S<t.length;S++)o.push({changeState:St.Remove,item:t[S]});return o}let c={1:{x:0,history:[]}},m=S=>S-1,g=t.length,y=e.length,E;for(let S=0;S<g+y+1;S++)for(let l=-S;l<S+1;l+=2){let n=l===-S||l!==S&&c[l-1].x<c[l+1].x;if(n){let a=c[l+1];E=a.x,o=a.history}else{let a=c[l-1];E=a.x+1,o=a.history}o=o.slice();let u=E-l;for(1<=u&&u<=y&&n?o.push({changeState:St.Insert,item:e[m(u)]}):1<=E&&E<=g&&o.push({changeState:St.Remove,item:t[m(E)]});E<g&&u<y&&this.mCompareFunction(t[m(E+1)],e[m(u+1)]);)E+=1,u+=1,o.push({changeState:St.Keep,item:t[m(E)]});if(E>=g&&u>=y)return o;c[l]={x:E,history:o}}return new Array}},St=function(f){return f[f.Remove=1]="Remove",f[f.Insert=2]="Insert",f[f.Keep=3]="Keep",f}({});var ie=class{mDataType;mId;mLabel;mPortType;mRegions;get dataType(){return this.mDataType}get id(){return this.mId}get label(){return this.mLabel}get portType(){return this.mPortType}get regions(){return this.mRegions}constructor(t){this.mLabel=t.label,this.mId=t.id,this.mPortType=t.portType,t.portType==="value"?this.mDataType=t.dataType:this.mDataType=null,this.mRegions={add:t.regions?.add??new Array}}};var pt=class{mCategory;mCodeGenerator;mId;mLabel;mPortProvider;mRegions;get category(){return this.mCategory}get codeGenerator(){return this.mCodeGenerator}get id(){return this.mId}get inputs(){let t=!1,e=[];return this.mPortProvider.inputs(o=>{if(e.push(new ie(o)),o.portType==="flow"){if(t)throw new A(`Node definition ${this.id} has multiple input flow ports, which is not allowed.`,this);t=!0}}),e}get label(){return this.mLabel}get outputs(){let t=[];return this.mPortProvider.outputs(e=>{t.push(new ie(e))}),t}get regions(){return this.mRegions}constructor(t){this.mId=t.id,this.mLabel=t.label,this.mCategory=t.category,this.mCodeGenerator=t.generators.code,this.mPortProvider=t.generators.ports,this.mRegions={add:t.regions?.add??new Array,allows:t.regions?.allows??new Array,requires:t.regions?.requires??new Array}}getPort(t){return[...this.inputs,...this.outputs].find(e=>e.id===t)}};var Gt=class extends pt{mFunction;get function(){return this.mFunction}get label(){return this.mFunction.label}constructor(t){let e=(c,m,g)=>y=>{g.length===0&&y({label:c,id:c,portType:"flow"});for(let E of m)y({label:E.label,id:E.label,portType:"value",dataType:E.dataType})},o=t.project.getFunction(t.definitionId);super({id:`USERFUNCTION_${t.id}`,label:t.label,category:"user function",generators:{ports:{inputs:e("Input",t.inputs,t.outputs),outputs:e("Output",t.outputs,t.outputs)},code:c=>o?o.codeGenerator.value({function:t,inputs:c.inputs,outputs:c.outputs,code:c.code}):""}}),this.mFunction=t}};var bt=class{mErrors;mAffectedItems;get affectedItems(){return this.mAffectedItems}get errors(){return this.mErrors}constructor(){this.mErrors=new Array,this.mAffectedItems=new Set}pushError(...t){this.mErrors.push(...t)}addAffectedItem(t){this.mAffectedItems.add(t)}merge(t){this.mErrors.push(...t.mErrors);for(let e of t.mAffectedItems)this.mAffectedItems.add(e);return this}},Y=class{mItem;mMessage;get item(){return this.mItem}get message(){return this.mMessage}constructor(t,e){this.mMessage=t,this.mItem=e}};var ft=class{mConnectedPorts;mDataType;mDefinitionId;mDirectValue;mDirection;mDocument;mLabel;mNode;mPortType;mProject;get connectedPorts(){return this.mConnectedPorts}get dataType(){return this.mDataType}get definitionId(){return this.mDefinitionId}get directValue(){return this.mDirectValue}get direction(){return this.mDirection}get document(){return this.mDocument}get label(){return this.mLabel}set label(t){this.mLabel=t}get node(){return this.mNode}get portType(){return this.mPortType}get project(){return this.mProject}get resolvedDataType(){if(this.mPortType!=="value")throw new A("Port data type couldn't be resolved as it is no value port.",this);if(!this.mProject.types.isGenericType(this.mDataType??""))return this.mDataType;if(this.mDirection==="output"){let e=this.mNode.inputs.value.find(o=>o.dataType===this.mDataType);if(!e)throw new A("Port type couldn't be resolved as it has no resolving sibling port",this);return e.resolvedDataType}if(this.mConnectedPorts.size===0)throw new A("Port type couldn't be resolved as it has no resolving input port",this);return this.mConnectedPorts.values().next().value.resolvedDataType}constructor(t,e,o){if(o.portType==="flow"&&o.dataType!==null)throw new A("Flow ports cannot have a value type.",this);if(o.portType==="value"&&o.dataType===null)throw new A("Value ports must have a value type.",this);this.mProject=t,this.mDocument=e,this.mNode=o.node,this.mDefinitionId=o.definitionId,this.mLabel=o.label,this.mDataType=o.dataType,this.mDirection=o.direction,this.mPortType=o.portType,this.mConnectedPorts=new Set,this.mDirectValue=new Array,o.dataType&&!this.mProject.types.isGenericType(o.dataType)&&this.mDirectValue.push(...t.types.getType(o.dataType).default.string)}connect(t){if(this.mConnectedPorts.has(t))return;if(this.mPortType!==t.portType)throw new A(`Cannot connect port ${this.mDefinitionId} of node ${this.mNode.label} to port ${t.mDefinitionId} of node ${t.node.label} due to incompatible port types.`,this);if(this.mDirection===t.direction)throw new A(`Cannot connect port ${this.mDefinitionId} of node ${this.mNode.label} to port ${t.mDefinitionId} of node ${t.node.label} due to incompatible directions.`,this);if(!(this.mPortType==="flow"&&this.mDirection==="input"||this.mPortType==="value"&&this.mDirection==="output"))for(let o of Array.from(this.mConnectedPorts))this.disconnect(o);this.mConnectedPorts.add(t),t.connect(this)}disconnect(t){this.mConnectedPorts.has(t)&&(this.mConnectedPorts.delete(t),t.disconnect(this))}setDirectValue(t){if(this.mPortType!=="value")throw new A("Only value ports can have a direct value.",this);if(this.mProject.types.isGenericType(this.mDataType))throw new A("Generic value ports cannot have a direct value.",this);if(t.length!==this.mProject.types.getType(this.mDataType).default.string.length)throw new A("The provided value does not match the expected length of the default value for this port's type.",this);this.mDirectValue.splice(0,this.mDirectValue.length),this.mDirectValue.push(...t)}validate(){let t=new bt;if(this.mDirection==="output"){if(this.mPortType==="flow"&&this.mConnectedPorts.size>1&&t.pushError(new Y(`Flow output port "${this.mDefinitionId}" on node "${this.mNode.label}" can only have one connection.`,this)),this.mPortType==="value"&&this.mProject.types.isGenericType(this.mDataType??"")){let e=this.mNode.inputs.value.filter(o=>o.dataType===this.mDataType);for(let o of e)o.connectedPorts.size===0&&t.pushError(new Y(`Generic output port "${this.mDefinitionId}" on node "${this.mNode.label}" cannot resolve generic type "${this.mDataType}" because its input port "${o.definitionId}" is not connected.`,this))}return t}if(this.mDirection==="input"){if(this.mPortType==="flow")return this.mConnectedPorts.size===0&&t.pushError(new Y(`Flow input port "${this.mDefinitionId}" on node "${this.mNode.label}" must have at least one connection.`,this)),t;if(this.mPortType==="value"){this.mConnectedPorts.size>1&&t.pushError(new Y(`Value input port "${this.mDefinitionId}" on node "${this.mNode.label}" can only have one connection.`,this));for(let e of this.mConnectedPorts)e.resolvedDataType!==this.resolvedDataType&&t.pushError(new Y(`Value input port "${this.mDefinitionId}" on node "${this.mNode.label}" expects type "${this.resolvedDataType}" but is connected to type "${e.resolvedDataType}".`,this));return t}}return t}};var wt=class{mCategory;mDefinitionId;mDocument;mFunction;mInputs;mLabel;mOutputs;mPreview;mProject;mTransformation;get category(){return this.mCategory}get definitionId(){return this.mDefinitionId}get document(){return this.mDocument}get function(){return this.mFunction}get hasFlowPorts(){return this.mOutputs.flow.length>0||this.mInputs.flow.length>0}get hasValuePorts(){return this.mOutputs.value.length>0||this.mInputs.value.length>0}get inputs(){return this.mInputs}get label(){return this.mLabel}set label(t){this.mLabel=t}get outputs(){return this.mOutputs}get preview(){return this.mPreview}set preview(t){this.mPreview=t}get project(){return this.mProject}get transformation(){return this.mTransformation}constructor(t,e,o,c){this.mCategory=c.category,this.mDocument=e,this.mDefinitionId=c.definitionId,this.mFunction=o,this.mLabel=c.label,this.mPreview=c.preview??null,this.mProject=t,this.mTransformation=c.transformation;let m=(g,y)=>{let E={direction:y,list:new Array,map:new Map,flow:new Array,value:new Array};for(let S of g){let l=new ft(this.mProject,this.mDocument,{definitionId:S.definitionId,direction:y,label:S.label,node:this,portType:S.portType,dataType:S.dataType});E.list.push(l),E.map.set(l.definitionId,l),(l.portType==="flow"?E.flow:E.value).push(l)}return E};this.mInputs=m(c.ports.input,"input"),this.mOutputs=m(c.ports.output,"output")}moveTo(t,e){this.mTransformation.x=t,this.mTransformation.y=e}resizeTo(t,e){this.mTransformation.width=Math.max(4,t),this.mTransformation.height=Math.max(4,e)}validate(t){let e=new bt,o=t??new Set,c=this.mFunction.nodeDefinitions.find(m=>m.id===this.mDefinitionId);if(!c)e.pushError(new Y(`Node "${this.mLabel}" definition "${this.mDefinitionId}" could not be found.`,this));else{e.merge(this.resyncPorts(this.mInputs,c.inputs)),e.merge(this.resyncPorts(this.mOutputs,c.outputs));let m=new Set([...c.regions.requires,...c.regions.allows]);if(m.size>0)for(let g of o)m.has(g)||e.pushError(new Y(`Node "${this.mLabel}" does not allow region "${g}".`,this));if(c.regions.requires.length>0)for(let g of c.regions.requires)o.has(g)||e.pushError(new Y(`Node "${this.mLabel}" requires region "${g}" but it is not active.`,this))}for(let m of[...this.mInputs.list,...this.mOutputs.list])e.merge(m.validate());return e}addPort(t,e,o){let c=new ft(this.mProject,this.mDocument,{definitionId:e.id,direction:t.direction,label:e.label,node:this,portType:e.portType,dataType:e.dataType});return t.list.splice(o,0,c),t.map.set(c.definitionId,c),(c.portType==="flow"?t.flow:t.value).push(c),c}removePort(t,e){let o=t.list.indexOf(e);if(o===-1)throw new A(`Port "${e.label}" was not found and can not be removed.`,this);t.list.splice(o,1),t.map.delete(e.definitionId);let c=e.portType==="flow"?t.flow:t.value,m=c.indexOf(e);if(o===-1)throw new A(`Port "${e.label}" was not found in typed list and can not be removed.`,this);return c.splice(m,1),o}replacePort(t,e,o){let c=Array.from(e.connectedPorts);for(let y of Array.from(e.connectedPorts))e.disconnect(y);let m=this.removePort(t,e),g=this.addPort(t,o,m);for(let y of c)g.connect(y);return g}resyncPorts(t,e){let o=new bt,c=new Set(e.map(m=>m.id));for(let m=0;m<e.length;m++){let g=e[m];if(!t.map.has(g.id)){let n=this.addPort(t,g,m);o.addAffectedItem(n);continue}let y=t.map.get(g.id),E=y.portType!==g.portType,S=y.dataType!==g.dataType;if(!E&&!S)continue;if(y.connectedPorts.size>0&&E){o.pushError(new Y(`Port "${y.label}" on node "${this.mLabel}" has a changed type.`,y));continue}let l=this.replacePort(t,y,g);o.addAffectedItem(y),o.addAffectedItem(l)}for(let m of t.list)if(!c.has(m.definitionId)){if(m.connectedPorts.size===0){o.addAffectedItem(m),this.removePort(t,m);continue}o.pushError(new Y(`Port "${m.label}" on node "${this.mLabel}" no longer exists in its definition.`,m))}return o}};var yt=class{mDefinitionId;mDocument;mId;mImportIds;mInputs;mIsSystem;mLabel;mNodes;mOutputs;mProject;get definitionId(){return this.mDefinitionId}get document(){return this.mDocument}get dynamicNodeDefinitions(){let t=this.mProject.getFunction(this.definitionId);if(!t)return[...this.mDocument.nodeDefinitions];let e=t.getNodeDefinitions(this),o=this.mProject.imports.filter(c=>this.mImportIds.has(c.id)).flatMap(c=>c.nodes);return[...this.mDocument.nodeDefinitions,...o,...e.dynamic]}get id(){return this.mId}get imports(){return this.mImportIds}get inputs(){return this.mInputs}get isSystem(){return this.mIsSystem}get label(){return this.mLabel}set label(t){this.mLabel=t}get nodeDefinitions(){let t=this.mProject.getFunction(this.definitionId);if(!t)return this.dynamicNodeDefinitions;let e=t.getNodeDefinitions(this);return[...this.dynamicNodeDefinitions,...e.entry,...e.exit]}get nodes(){return this.mNodes}get outputs(){return this.mOutputs}get project(){return this.mProject}constructor(t,e,o){this.mProject=t,this.mDocument=e,this.mLabel=o.label,this.mIsSystem=o.isSystem,this.mDefinitionId=o.definitionId,this.mId=o.id,this.mNodes=new Set,this.mInputs=new Array,this.mOutputs=new Array,this.mImportIds=new Set}addImport(t){if(!this.project.imports.some(o=>o.id===t))throw new A(`Project does not contain import ${t}`,this);this.mImportIds.add(t)}addInput(t){this.mInputs.some(e=>e.label===t.label)||this.mInputs.push(t)}addNode(t){this.mNodes.add(t)}addNodeByDefinition(t,e){let o=m=>({definitionId:m.id,label:m.label,portType:m.portType,dataType:m.dataType}),c=new wt(this.mProject,this.mDocument,this,{category:t.category,definitionId:t.id,ports:{input:t.inputs.map(o),output:t.outputs.map(o)},label:t.label,transformation:e});return this.mNodes.add(c),c}addOutput(t){this.mOutputs.some(e=>e.label===t.label)||this.mOutputs.push(t)}getExitNodes(){let t=this.mProject.getFunction(this.mDefinitionId);if(!t)throw new A(`Function definition not found for function "${this.mLabel}".`,this);let e=new Set(t.getNodeDefinitions(this).exit.map(o=>o.id));return[...this.mNodes].filter(o=>e.has(o.definitionId))}removeImport(t){this.mImportIds.delete(t)}removeInput(t){let e=this.mInputs.findIndex(o=>o.label===t.label);e!==-1&&this.mInputs.splice(e,1)}removeNode(t){for(let e of[...t.inputs.list,...t.outputs.list])for(let o of Array.from(e.connectedPorts))e.disconnect(o);this.mNodes.delete(t)}removeOutput(t){let e=this.mOutputs.findIndex(o=>o.label===t.label);e!==-1&&this.mOutputs.splice(e,1)}validate(){let t=new bt,e=this.mProject.getFunction(this.mDefinitionId);e||t.pushError(new Y(`Function "${this.mLabel}" definition "${this.mDefinitionId}" could not be found.`,this));let o=e?.getNodeDefinitions(this);o&&this.resyncFunction(o,t);let c=this.collectRegions(this.mNodes,t),m=new Set(o?.entry.map(y=>y.id)??new Array),g=new Map;for(let y of this.mNodes)t.merge(y.validate(c.get(y))),this.collectEntryDomains(y,m,g).size>1&&t.pushError(new Y(`Node "${y.label}" is reachable from multiple entry nodes.`,y));return t}collectEntryDomains(t,e,o){if(o.has(t))return o.get(t);let c=new Set;o.set(t,c);for(let m of t.inputs.list)for(let g of m.connectedPorts){let y=g.node;e.has(y.definitionId)&&c.add(y);for(let E of this.collectEntryDomains(y,e,o))c.add(E)}return c}collectRegions(t,e){let o=new Map;for(let y of this.nodeDefinitions)o.set(y.id,y);let c=(()=>{let y=new Map;return(E,S)=>{if(!y.has(E.id)){let l=new Map;for(let n of E.outputs)l.set(n.id,n.regions.add);y.set(E.id,l)}return[...y.get(E.id).get(S)??new Array,...E.regions.add]}})(),m=(()=>{let y=new Map;return(E,S)=>{if(y.has(E))return y.get(E);if(S.has(E))return e.pushError(new Y(`Node "${E.label}" is part of a connection cycle.`,E)),new Set;S.add(E);let l=new Set;for(let n of E.inputs.list)for(let u of n.connectedPorts){let a=u.node;for(let r of m(a,S))l.add(r);if(o.has(a.definitionId))for(let r of c(o.get(a.definitionId),u.definitionId))l.add(r)}return y.set(E,l),l}})(),g=new Map;for(let y of t)g.set(y,m(y,new Set));return g}resyncFunction(t,e){let o=[...t.entry,...t.exit],c=new Set(this.mNodes.values().map(y=>y.definitionId)),m=0,g=20;for(let y of o){if(c.has(y.id))continue;let E=this.addNodeByDefinition(y,{x:Math.floor(m/(o.length/2))*g+2,y:m*g+2-Math.floor(m/(o.length/2))*(o.length/2*g),width:0,height:0});e.addAffectedItem(E),m++}}};var Lt=class{mFunctionNodeDefinitions;mFunctions;mProject;get functions(){return this.mFunctions}get nodeDefinitions(){return[...this.mFunctionNodeDefinitions.values(),...this.mProject.nodeDefinitions.values()]}get project(){return this.mProject}constructor(t){this.mProject=t,this.mFunctions=new Set,this.mFunctionNodeDefinitions=new Map}addFunction(t){this.mFunctions.add(t);let e=new Gt(t);this.mFunctionNodeDefinitions.set(e.id,e)}newFunction(t){let e=new yt(this.mProject,this,t);this.mFunctions.add(e);let o=new Gt(e);return this.mFunctionNodeDefinitions.set(o.id,o),e}removeFunction(t){if(!this.mFunctions.has(t))return!1;if(t.isSystem)throw new A("Cannot remove a system function.",this);this.mFunctions.delete(t);let e=this.mFunctionNodeDefinitions.values().find(o=>o.function===t);return e&&this.mFunctionNodeDefinitions.delete(e.id),!0}validate(){let t=new bt,e=this.mProject.entryPoint.id;if(!this.mFunctions.values().some(o=>o.definitionId===e)){let o=this.newFunction({definitionId:e,id:crypto.randomUUID(),isSystem:!0,label:this.mProject.entryPoint.label});t.addAffectedItem(o)}for(let o of this.mFunctions)t.merge(o.validate());return t.pushError(...this.detectCrossFunctionRecursion()),t}detectCrossFunctionRecursion(){let t=[],e=new Map,o=y=>{if(!e.has(y)){let E=new Set;for(let S of y.nodes)this.mFunctionNodeDefinitions.has(S.definitionId)&&E.add(this.mFunctionNodeDefinitions.get(S.definitionId).function);e.set(y,E)}return e.get(y)},c=new Set,m=new Set,g=y=>{if(!c.has(y)){if(m.has(y)){t.push(new Y(`Function "${y.label}" participates in a cross-function recursion cycle.`,y));return}m.add(y);for(let E of o(y))g(E);m.delete(y),c.add(y)}};for(let y of this.mFunctions)g(y);return t}};var ct=class f{static mComponents=new WeakMap;static mConstructorSelector=new WeakMap;static mElements=new WeakMap;static ofComponent(t){let e=t.processorConstructor,o=f.mConstructorSelector.get(e);if(!o)throw new A(`Constructor "${e.name}" is not a registered custom element`,e);let c=f.mElements.get(t);if(!c)throw new A(`Component "${t}" is not a registered component`,t);return{selector:o,constructor:e,element:c,component:t,processor:t.processor}}static ofConstructor(t){let e=f.mConstructorSelector.get(t);if(!e)throw new A(`Constructor "${t.name}" is not a registered custom element`,t);let o=globalThis.customElements.get(e);if(!o)throw new A(`Constructor "${t.name}" is not a registered custom element`,t);return{selector:e,constructor:t,elementConstructor:o}}static ofElement(t){let e=f.mComponents.get(t);if(!e)throw new A(`Element "${t}" is not a PwbComponent.`,t);return f.ofComponent(e)}static ofProcessor(t){let e=f.mComponents.get(t);if(!e)throw new A("Processor is not a PwbComponent.",t);return f.ofComponent(e)}static registerComponent(t,e,o){f.mComponents.has(e)||f.mComponents.set(e,t),o&&!f.mComponents.has(o)&&f.mComponents.set(o,t),f.mElements.has(t)||f.mElements.set(t,e)}static registerConstructor(t,e){t&&!f.mConstructorSelector.has(t)&&f.mConstructorSelector.set(t,e)}};var se=class f{static CONFIGURATION_ATTACHMENT=Symbol("PwbApplicationConfigurationAttachment");static new(t,e){let o=new f;t(o),e&&o.appendTo(e)}mContent;mElement;constructor(){this.mContent=new Array,this.mElement=document.createElement("div"),this.mElement.attachShadow({mode:"open"})}addContent(t){let e=ct.ofConstructor(t).elementConstructor,o=ct.ofElement(new e);return this.mContent.push(o.component),this.mElement.shadowRoot.appendChild(o.element),o.processor}addStyle(t){let e=document.createElement("style");e.textContent=t,this.mElement.shadowRoot.prepend(e)}appendTo(t){t.appendChild(this.mElement)}};var Yt=class{mCustomMetadata;constructor(){this.mCustomMetadata=new Map}getMetadata(t){return this.mCustomMetadata.get(t)??null}setMetadata(t,e){this.mCustomMetadata.set(t,e)}};var ae=class extends Yt{};var le=class f extends Yt{static mPrivateMetadataKey=Symbol("Metadata");mDecoratorMetadataObject;mPropertyMetadata;constructor(t){super(),this.mDecoratorMetadataObject=t,this.mPropertyMetadata=new Map,t[f.mPrivateMetadataKey]=this}getInheritedMetadata(t){let e=new Array,o=this.mDecoratorMetadataObject;do{if(Object.hasOwn(o,f.mPrivateMetadataKey)){let m=o[f.mPrivateMetadataKey].getMetadata(t);m!==null&&e.push(m)}o=Object.getPrototypeOf(o)}while(o!==null);return e.reverse()}getProperty(t){return this.mPropertyMetadata.has(t)||this.mPropertyMetadata.set(t,new ae),this.mPropertyMetadata.get(t)}};Symbol.metadata??=Symbol("Symbol.metadata");var at=class f{static mMetadataMapping=new Map;static add(t,e){return(o,c)=>{let m=f.forInternalDecorator(c.metadata);switch(c.kind){case"class":m.setMetadata(t,e);return;case"method":case"field":case"getter":case"setter":case"accessor":if(c.static)throw new Error("@Metadata.add not supported for statics.");m.getProperty(c.name).setMetadata(t,e);return}}}static forInternalDecorator(t){return f.mapMetadata(t)}static get(t){Object.hasOwn(t,Symbol.metadata)||f.polyfillMissingMetadata(t);let e=t[Symbol.metadata];return f.mapMetadata(e)}static init(){return(t,e)=>{f.forInternalDecorator(e.metadata)}}static mapMetadata(t){if(f.mMetadataMapping.has(t))return f.mMetadataMapping.get(t);let e=new le(t);return f.mMetadataMapping.set(t,e),e}static polyfillMissingMetadata(t){let e=new Array,o=t;do e.push(o),o=Object.getPrototypeOf(o);while(o!==null);for(let c=e.length-1;c>=0;c--){let m=e[c];if(!Object.hasOwn(m,Symbol.metadata)){let g=null;c<e.length-2&&(g=e[c+1][Symbol.metadata]),m[Symbol.metadata]=Object.create(g,{})}}}};var O=class f{static mCurrentInjectionContext=null;static mInjectMode=new Map;static mInjectableConstructor=new Map;static mInjectableReplacement=new Map;static mInjectionConstructorIdentificationMetadataKey=Symbol("InjectionConstructorIdentification");static mSingletonMapping=new Map;static createObject(t,e,o){let[c,m]=typeof e=="object"&&e!==null?[!1,e]:[!!e,o??new Map],g=f.getInjectionIdentification(t);if(!f.mInjectableConstructor.has(g))throw new A(`Constructor "${t.name}" is not registered for injection and can not be built`,f);let y=c?"instanced":f.mInjectMode.get(g),E=new Map(m.entries().map(([n,u])=>[f.getInjectionIdentification(n),u])),S=f.mCurrentInjectionContext,l=new Map([...S?.localInjections.entries()??[],...E.entries()]);f.mCurrentInjectionContext={injectionMode:y,localInjections:l};try{if(!c&&y==="singleton"&&f.mSingletonMapping.has(g))return f.mSingletonMapping.get(g);let n=new t;return y==="singleton"&&!f.mSingletonMapping.has(g)&&f.mSingletonMapping.set(g,n),n}finally{f.mCurrentInjectionContext=S}}static injectable(t="instanced"){return(e,o)=>{f.registerInjectable(e,o.metadata,t)}}static registerInjectable(t,e,o){let c=f.getInjectionIdentification(t,e);f.mInjectableConstructor.set(c,t),f.mInjectMode.set(c,o)}static replaceInjectable(t,e){let o=f.getInjectionIdentification(t);if(!f.mInjectableConstructor.has(o))throw new A("Original constructor is not registered.",f);let c=f.getInjectionIdentification(e);if(!f.mInjectableConstructor.has(c))throw new A("Replacement constructor is not registered.",f);f.mInjectableReplacement.set(o,e)}static use(t){if(f.mCurrentInjectionContext===null)throw new A("Can't create object outside of an injection context.",f);let e=f.getInjectionIdentification(t);if(f.mCurrentInjectionContext.injectionMode!=="singleton"&&f.mCurrentInjectionContext.localInjections.has(e))return f.mCurrentInjectionContext.localInjections.get(e);let o=f.mInjectableReplacement.get(e);if(o||(o=f.mInjectableConstructor.get(e)),!o)throw new A(`Constructor "${t.name}" is not registered for injection and can not be built`,f);return f.createObject(o)}static getInjectionIdentification(t,e){let o=e?at.forInternalDecorator(e):at.get(t),c=o.getMetadata(f.mInjectionConstructorIdentificationMetadataKey);return c||(c=Symbol(t.name),o.setMetadata(f.mInjectionConstructorIdentificationMetadataKey,c)),c}};var X=function(f){return f[f.Read=1]="Read",f[f.ReadWrite=2]="ReadWrite",f[f.Write=3]="Write",f}({});var Pt=class{mHooks;mInjections;mProcessor;mProcessorConstructor;get processor(){if(!this.mProcessor)throw new A("Processor is not created yet. Call setup to create processor.",this);return this.mProcessor}get processorConstructor(){return this.mProcessorConstructor}constructor(t){if(this.mProcessorConstructor=t.constructor,this.mProcessor=null,this.mInjections=new Map,this.mHooks={create:new Array},t.parent)for(let[e,o]of t.parent.mInjections.entries())this.setProcessorInjection(e,o)}call(t,...e){let o=Reflect.get(this.processor,t);return typeof o!="function"?null:o.apply(this.processor,e)}deconstruct(){}getProcessorInjection(t){return this.mInjections.get(t)}setProcessorInjection(t,e){if(this.mProcessor)throw new A("Cant add injections to after construction.",this);this.mInjections.set(t,e)}setup(){return this.mProcessor=this.createProcessor(),this}addConstructionHook(t){return this.mHooks.create.push(t),this}createProcessor(){let t=O.createObject(this.mProcessorConstructor,this.mInjections),e;for(;e=this.mHooks.create.pop();){let o=e.call(this,t);o&&(t=o)}return t}};var Ot=class f extends Pt{constructor(t,e){super({constructor:t,parent:e}),this.setProcessorInjection(f,this)}deconstruct(){this.call("onDeconstruct"),super.deconstruct()}setup(){return super.setup(),this.call("onExecute"),this}onUpdate(){return!1}};var or=class f{static mInstance;mCoreEntityConstructor;mProcessorConstructorConfiguration;constructor(){if(f.mInstance)return f.mInstance;f.mInstance=this,this.mCoreEntityConstructor=new Map,this.mProcessorConstructorConfiguration=new Map}get(t){let e=this.mCoreEntityConstructor.get(t);if(!e)return new Array;let o=new Array;for(let c of e)o.push({processorConstructor:c,processorConfiguration:this.mProcessorConstructorConfiguration.get(c)});return o}register(t,e,o){this.mProcessorConstructorConfiguration.set(e,o);let c=t;do{if(!(c.prototype instanceof Pt)&&c!==Pt)break;this.mCoreEntityConstructor.has(c)||this.mCoreEntityConstructor.set(c,new Set),this.mCoreEntityConstructor.get(c).add(e)}while(c=Object.getPrototypeOf(c))}},ut=new or;var Zt=class f extends Pt{static mExtensionCache=new WeakMap;mExtensionList;constructor(t){super(t),this.mExtensionList=new Array}deconstruct(){for(let t of this.mExtensionList)t.deconstruct();super.deconstruct()}setup(){return super.setup(),this.executeExtensions(),this}executeExtensions(){let t=(()=>{if(!f.mExtensionCache.has(this.processorConstructor)){let c=ut.get(Ot).filter(g=>{for(let y of g.processorConfiguration.targetRestrictions)if(this instanceof y||this.processorConstructor.prototype instanceof y||this.processorConstructor===y)return!0;return!1}),m={read:c.filter(g=>g.processorConfiguration.access===X.Read),write:c.filter(g=>g.processorConfiguration.access===X.Write),readWrite:c.filter(g=>g.processorConfiguration.access===X.ReadWrite)};f.mExtensionCache.set(this.processorConstructor,m)}return f.mExtensionCache.get(this.processorConstructor)})(),e=[...t.write,...t.readWrite,...t.read];for(let o of e)this.mExtensionList.push(new Ot(o.processorConstructor,this).setup())}};var _t=class{mData;mInteractionType;mOrigin;get data(){return this.mData}get origin(){return this.mOrigin}get triggerType(){return this.mInteractionType}constructor(t,e,o){this.mInteractionType=t,this.mData=o,this.mOrigin=e}};var Ft=class f{static mCurrentZone=new f("Default");static get current(){return f.mCurrentZone}static create(t){return new f(t)}mInteractionListener;mName;mTriggerFilterBitmap;get name(){return this.mName}constructor(t){this.mName=t,this.mTriggerFilterBitmap=-1,this.mInteractionListener=new Map}addInteractionListener(t){return this.mInteractionListener.set(t,f.current),this}setTriggerRestriction(t){return this.mTriggerFilterBitmap=t,this}execute(t,...e){let o=f.mCurrentZone;f.mCurrentZone=this;try{return t(...e)}finally{f.mCurrentZone=o}}pushInteraction(t,e){if((this.mTriggerFilterBitmap&t)===0)return!1;if(this.mInteractionListener.size===0)return!0;let o=new _t(t,this,e);for(let[c,m]of this.mInteractionListener.entries())m.execute(()=>{c.call(this,o)});return!0}removeInteractionListener(t){return t?(this.mInteractionListener.delete(t),this):(this.mInteractionListener.clear(),this)}};var B={get:1,set:2,manual:4};var Ee=class f{static ORIGINAL_TO_INTERACTION_MAPPING=new WeakMap;static PROXY_TO_ORIGINAL_MAPPING=new WeakMap;static UNTRACEABLE_FUNCTION_UPDATE_TRIGGER=(()=>{let t=new WeakMap;return t.set(Array.prototype.fill,B.set),t.set(Array.prototype.pop,B.get),t.set(Array.prototype.push,B.set),t.set(Array.prototype.shift,B.get),t.set(Array.prototype.unshift,B.set),t.set(Array.prototype.splice,B.set),t.set(Array.prototype.reverse,B.set),t.set(Array.prototype.sort,B.set),t.set(Array.prototype.concat,B.set),t.set(Map.prototype.clear,B.set),t.set(Map.prototype.delete,B.set),t.set(Map.prototype.set,B.set),t.set(Set.prototype.clear,B.set),t.set(Set.prototype.delete,B.set),t.set(Set.prototype.add,B.set),t})();static getOriginal(t){return f.PROXY_TO_ORIGINAL_MAPPING.get(t)??t}static getWrapper(t){let e=f.getOriginal(t);return f.ORIGINAL_TO_INTERACTION_MAPPING.get(e)}mProxyObject;mStateChangeCallback;get proxy(){return this.mProxyObject}constructor(t,e){let o=f.getWrapper(t);if(o)return o;this.mProxyObject=this.createProxyObject(t),this.mStateChangeCallback=e,f.PROXY_TO_ORIGINAL_MAPPING.set(this.mProxyObject,t),f.ORIGINAL_TO_INTERACTION_MAPPING.set(t,this)}convertToProxy(t){return t===null||typeof t!="object"&&typeof t!="function"?t:new f(t,this.mStateChangeCallback).proxy}createProxyObject(t){let e=(c,m,g)=>{let y=f.getOriginal(m);try{let E=c.call(y,...g);return this.convertToProxy(E)}finally{if(f.UNTRACEABLE_FUNCTION_UPDATE_TRIGGER.has(c)){let E=f.getWrapper(m);E&&E.dispatch(f.UNTRACEABLE_FUNCTION_UPDATE_TRIGGER.get(c))}}};return new Proxy(t,{apply:(c,m,g)=>{let y=c;try{let E=y.call(m,...g);return this.convertToProxy(E)}catch(E){if(!(E instanceof TypeError))throw E;return e(y,m,g)}},set:(c,m,g)=>{try{let y=g;return(y!==null&&typeof y=="object"||typeof y=="function")&&(y=f.getOriginal(y)),Reflect.set(c,m,y)}finally{this.dispatch(B.set)}},get:(c,m,g)=>{try{return this.convertToProxy(Reflect.get(c,m))}finally{this.dispatch(B.get)}},deleteProperty:(c,m)=>{try{return delete c[m]}finally{this.dispatch(B.set)}}})}dispatch(t){this.mStateChangeCallback(t)}};var G=class f{static reaction(t){let e=Ft.create("ComponentState reaction");e.addInteractionListener(o=>{(o.triggerType&B.set)!==0&&t()}),e.execute(()=>{t()})}static state(t){return(e,o)=>{if(o.static)throw new A("Event target is not for a static property.",f);let c=new WeakMap,m=(g,y)=>{c.set(g,new f(y,t))};return{init(g){return typeof g>"u"||m(this,g),g},set(g){c.has(this)?c.get(this).set(g):m(this,g)},get(){return c.has(this)||m(this,void 0),c.get(this).get()}}}}mLinkedZones;mLinkedZonesArray;mConfiguration;mValue;constructor(t,e){if(this.mLinkedZones=new Set,this.mLinkedZonesArray=new Array,this.mConfiguration={complexValue:e?.complexValue??!1,proxy:e?.proxy??!1},this.mConfiguration.proxy){if(typeof t!="object"||t===null)throw new A("Proxied component state value must be an object.",this);this.mValue=new Ee(t,o=>{switch(o){case B.set:return this.dispatchChange();case B.get:return this.linkCurrentZone()}}).proxy}else this.mValue=t}get(){return this.linkCurrentZone(),this.mValue}set(t){if(this.mConfiguration.proxy)throw new A("Proxy is not implemented yet.",this);!this.mConfiguration.complexValue&&this.mValue===t||(this.mValue=t,this.dispatchChange())}dispatchChange(){for(let t of this.mLinkedZonesArray)t.pushInteraction(B.set,this)}linkCurrentZone(){let t=Ft.current;this.mLinkedZones.has(t)||(this.mLinkedZones.add(t),this.mLinkedZonesArray.push(t))}};var jt=class f{static mCurrentUpdateCycle=null;static openResheduledCycle(t,e){let o=!1;if(!f.mCurrentUpdateCycle){let c=performance.now();f.mCurrentUpdateCycle={initiator:t.initiator,startTime:c,forcedSync:t.forcedSync,runner:t.runner},o=!0}try{return e(f.mCurrentUpdateCycle)}finally{o&&(f.mCurrentUpdateCycle=null)}}static openUpdateCycle(t,e){let o=!1;if(!f.mCurrentUpdateCycle){let c=performance.now();f.mCurrentUpdateCycle={initiator:t.updater,startTime:c,forcedSync:t.runSync,runner:Symbol("Runner "+c)},o=!0}try{return e(f.mCurrentUpdateCycle)}finally{o&&(f.mCurrentUpdateCycle=null)}}static updateCycleRunId(t,e){if(t.initiator===e){let o=performance.now(),c=t;c.runner=Symbol("Runner "+o)}}static updateCyleStartTime(t){let e=performance.now(),o=t;o.startTime=e}};var De=class extends Error{mChain;get chain(){return this.mChain}constructor(t,e){let o=e.slice(-20).map(c=>c.toString()).join(`
`);super(`${t}: 
${o}`),this.mChain=[...e]}};var Ie=class f{static mStackCap=100;static mFrameTime=100;static get stackCap(){return f.mStackCap}static set stackCap(t){f.mStackCap=t}static get frameTime(){return f.mFrameTime}static set frameTime(t){f.mFrameTime=t}mInteractionZone;mUpdateFunction;mUpdateRunCache;mUpdateStates;mManualComponentState;get zone(){return this.mInteractionZone}constructor(t){this.mUpdateRunCache=new WeakMap,this.mUpdateFunction=t.onUpdate,this.mManualComponentState=new G(Symbol("Manual Update")),this.mUpdateStates={chainCompleteHooks:new Rt,async:{hasSheduledTask:!1,hasRunningTask:!1,sheduledTaskIsResheduled:!1},sync:{running:!1},cycle:{chainedTask:null}},this.mInteractionZone=Ft.create("Update-Zone"),this.mInteractionZone.addInteractionListener(e=>{(e.triggerType&B.set)!==0&&this.runUpdateAsynchron(e,null)})}deconstruct(){this.mInteractionZone.removeInteractionListener()}async waitForUpdate(){return this.mUpdateStates.async.hasSheduledTask?new Promise((t,e)=>{this.mUpdateStates.chainCompleteHooks.push((o,c)=>{c?e(c):t(o)})}):!1}executeInZone(t){return this.mInteractionZone.execute(t)}update(){let t=new _t(B.manual,this.mInteractionZone,this.mManualComponentState);return this.runUpdateSynchron(t)}updateAsync(){let t=new _t(B.manual,this.mInteractionZone,this.mManualComponentState);this.runUpdateAsynchron(t,null)}executeTaskChain(t,e,o,c){if(c.length>f.stackCap)throw new De("Call loop detected",c);let m=performance.now();if(!e.forcedSync&&m-e.startTime>f.frameTime)throw new ce;c.push(t);let g=this.mInteractionZone.execute(()=>this.mUpdateFunction.call(this))||o;if(jt.updateCycleRunId(e,this),!this.mUpdateStates.cycle.chainedTask)return g;let y=this.mUpdateStates.cycle.chainedTask;return this.mUpdateStates.cycle.chainedTask=null,this.executeTaskChain(y,e,g,c)}releaseUpdateChainCompleteHooks(t,e){if(!this.mUpdateStates.chainCompleteHooks.top)return;let o;for(;o=this.mUpdateStates.chainCompleteHooks.pop();)o(t,e)}runUpdateAsynchron(t,e){if(this.mUpdateStates.async.hasRunningTask||this.mUpdateStates.async.sheduledTaskIsResheduled){this.mUpdateStates.cycle.chainedTask=t;return}if(this.mUpdateStates.async.hasSheduledTask)return;let o=c=>{this.mUpdateStates.async.hasRunningTask=!0,this.mUpdateStates.async.hasSheduledTask=!1,this.mUpdateStates.async.sheduledTaskIsResheduled=!1;let m=!1;try{this.runUpdateSynchron(t)}catch(g){g instanceof ce&&c.initiator===this&&(m=!0)}finally{this.mUpdateStates.async.hasRunningTask=!1}m&&this.runUpdateAsynchron(t,c)};this.mUpdateStates.async.hasSheduledTask=!0,e&&(this.mUpdateStates.async.sheduledTaskIsResheduled=!0),globalThis.requestAnimationFrame(()=>{e?jt.openResheduledCycle(e,o):jt.openUpdateCycle({updater:this,runSync:!1},o)})}runUpdateSynchron(t){if(this.mUpdateStates.sync.running)return this.mUpdateStates.cycle.chainedTask=t,!1;this.mUpdateStates.sync.running=!0;try{let e=jt.openUpdateCycle({updater:this,runSync:!0},o=>{if(this.mUpdateRunCache.has(o.runner))return jt.updateCyleStartTime(o),this.mUpdateRunCache.get(o.runner);let c=this.executeTaskChain(t,o,!1,new Array);return this.mUpdateRunCache.set(o.runner,c),c});return this.releaseUpdateChainCompleteHooks(e),e}catch(e){throw e instanceof ce||this.releaseUpdateChainCompleteHooks(!1,e),e}finally{this.mUpdateStates.sync.running=!1}}},ce=class extends Error{constructor(){super("Update resheduled")}};var Se=class extends Zt{mUpdater;get updater(){return this.mUpdater}constructor(t){super(t),this.mUpdater=new Ie({label:t.constructor.name,onUpdate:()=>this.onUpdate()})}call(t,...e){return this.mUpdater.executeInZone(()=>super.call(t,...e))}deconstruct(){this.mUpdater.deconstruct(),super.deconstruct()}createProcessor(){return this.mUpdater.executeInZone(()=>super.createProcessor())}};var Ut=class{mExpression;mTemporaryValues;constructor(t,e,o){if(this.mTemporaryValues=new et,o.length>0)for(let c of o)this.mTemporaryValues.set(c,void 0);this.mExpression=this.createEvaluationFunction(t,this.mTemporaryValues).bind(e.store)}execute(){return this.mExpression()}setTemporaryValue(t,e){if(!this.mTemporaryValues.has(t))throw new A(`Temporary value "${t}" does not exist for this procedure.`,this);this.mTemporaryValues.set(t,e)}createEvaluationFunction(t,e){let o,c=`__${Math.random().toString(36).substring(2)}`;if(o="return function () {",e.size>0)for(let m of e.keys())o+=`const ${m} = ${c}.get('${m}');`;return o+=`return ${t};`,o+="};",new Function(c,o)(e)}};var Dt=class{mDataLevel;get data(){return this.mDataLevel}constructor(t){this.mDataLevel=t}createExpressionProcedure(t,e){return new Ut(t,this.data,e??[])}setTemporaryValue(t,e){this.data.setTemporaryValue(t,e)}};var gt=class{mComponent;mDataProxy;mParentLevel;mTemporaryValues;get store(){return this.mDataProxy}constructor(t){this.mTemporaryValues=new et,t instanceof z?(this.mParentLevel=null,this.mComponent=t):(this.mParentLevel=t,this.mComponent=t.mComponent),this.mDataProxy=this.createAccessProxy()}setTemporaryValue(t,e){this.mTemporaryValues.set(t,e)}updateLevelData(t){if(t.mParentLevel!==this.mParentLevel)throw new A("Can't update InstructionLevelData for a deeper level than it target data.",this);this.mTemporaryValues=t.mTemporaryValues}createAccessProxy(){return new Proxy(new Object,{get:(t,e)=>this.getValue(e),set:(t,e,o)=>(this.hasTemporaryValue(e)&&this.setTemporaryValue(e,o),e in this.mComponent.processor?(this.mComponent.processor[e]=o,!0):(this.setTemporaryValue(e,o),!0)),deleteProperty:()=>{throw new A("Deleting properties is not allowed",this)},ownKeys:()=>[...new Set([...Object.keys(this.mComponent.processor),...this.getTemporaryValuesList()])]})}getTemporaryValuesList(){let t=this.mTemporaryValues.map(e=>e);return this.mParentLevel&&t.push(...this.mParentLevel.getTemporaryValuesList()),t}getValue(t){if(this.mTemporaryValues.has(t))return this.mTemporaryValues.get(t);if(this.mParentLevel)return this.mParentLevel.getValue(t);if(t in this.mComponent.processor)return this.mComponent.processor[t]}hasTemporaryValue(t){return this.mTemporaryValues.has(t)?!0:this.mParentLevel?this.mParentLevel.hasTemporaryValue(t):!1}};var Ht=class f{mChildList;mInstruction;mInstructionType;get childList(){return this.mChildList}get instruction(){return this.mInstruction}get instructionType(){return this.mInstructionType}constructor(t,e){this.mChildList=Array(),this.mInstruction=e,this.mInstructionType=t}appendChild(...t){this.mChildList.push(...t)}clone(){let t=new f(this.instructionType,this.instruction);for(let e of this.mChildList)t.appendChild(e.clone());return t}equals(t){if(!(t instanceof f)||t.instruction!==this.instruction||t.instructionType!==this.instructionType||t.childList.length!==this.childList.length)return!1;for(let e=0;e<t.childList.length;e++)if(!t.childList[e].equals(this.childList[e]))return!1;return!0}removeChild(t){let e=this.mChildList.indexOf(t);if(e!==-1)return this.mChildList.splice(e,1)[0]}};var xt=class f{mExpression;get value(){return this.mExpression}constructor(t){this.mExpression=t}clone(){return new f(this.mExpression)}equals(t){return t instanceof f&&t.value===this.value}toString(){return`{{ ${this.mExpression} }}`}};var Ct=class f{mContainsExpression;mTextValue;mValues;get containsExpression(){return this.mContainsExpression}get values(){return this.mValues}constructor(){this.mTextValue="",this.mContainsExpression=!1,this.mValues=[]}addValue(...t){for(let e of t)(this.mContainsExpression===!0||e instanceof xt)&&(this.mContainsExpression=!0),this.mValues.push(e),this.mTextValue+=e.toString()}clone(){let t=new f;for(let e of this.values)typeof e=="string"?t.addValue(e):t.addValue(e.clone());return t}equals(t){if(!(t instanceof f)||t.values.length!==this.values.length)return!1;for(let e=0;e<this.values.length;e++){let o=this.values[e],c=t.values[e];if(o!==c&&(typeof o!=typeof c||typeof o=="string"&&o!==c||!c.equals(o)))return!1}return!0}toString(){return this.mTextValue}};var ue=class f{mName;mValue;get name(){return this.mName}get values(){return this.mValue}constructor(t){this.mName=t,this.mValue=new Ct}clone(){let t=new f(this.name);for(let e of this.values.values)typeof e=="string"?t.values.addValue(e):t.values.addValue(e.clone());return t}equals(t){return!(!(t instanceof f)||t.name!==this.name||!t.values.equals(this.values))}};var Mt=class f{mAttributeDictionary;mChildList;mTagName;get attributes(){return[...this.mAttributeDictionary.values()]}get childList(){return this.mChildList}get tagName(){return this.mTagName}constructor(t){this.mAttributeDictionary=new Map,this.mChildList=Array(),this.mTagName=t}appendChild(...t){this.mChildList.push(...t)}clone(){let t=new f(this.tagName);for(let e of this.mAttributeDictionary.values()){let o=t.setAttribute(e.name);for(let c of e.values.values)typeof c=="string"?o.addValue(c):o.addValue(c.clone())}for(let e of this.mChildList)t.appendChild(e.clone());return t}equals(t){if(!(t instanceof f)||t.tagName!==this.tagName||t.attributes.length!==this.mAttributeDictionary.size||t.childList.length!==this.mChildList.length)return!1;for(let e of t.mAttributeDictionary.values()){let o=this.mAttributeDictionary.get(e.name);if(!o||!o.equals(e))return!1}for(let e=0;e<t.childList.length;e++)if(!t.childList[e].equals(this.mChildList[e]))return!1;return!0}getAttribute(t){return this.mAttributeDictionary.get(t)?.values??null}removeAttribute(t){return this.mAttributeDictionary.delete(t)}removeChild(t){let e=this.mChildList.indexOf(t);if(e!==-1)return this.mChildList.splice(e,1)[0]}setAttribute(t){if(this.mAttributeDictionary.has(t))return this.mAttributeDictionary.get(t).values;let e=new ue(t);return this.mAttributeDictionary.set(t,e),e.values}};var ht=class f{mBodyElementList;get body(){return this.mBodyElementList}constructor(){this.mBodyElementList=new Array}appendChild(...t){this.mBodyElementList.push(...t)}clone(){let t=new f;for(let e of this.mBodyElementList)t.appendChild(e.clone());return t}equals(t){if(!(t instanceof f)||t.body.length!==this.mBodyElementList.length)return!1;for(let e=0;e<this.mBodyElementList.length;e++)if(!this.mBodyElementList[e].equals(t.body[e]))return!1;return!0}removeChild(t){let e=this.mBodyElementList.indexOf(t);if(e!==-1)return this.mBodyElementList.splice(e,1)[0]}};var lt=class{mComponentValues;mContent;mModules;mTemplate;get anchor(){return this.mContent.contentAnchor}get modules(){return this.mModules}get template(){return this.mTemplate}get values(){return this.mComponentValues}get content(){return this.mContent}constructor(t,e,o,c){this.mTemplate=t,this.mComponentValues=o,this.mContent=c,this.mModules=e,c.setCoreBuilder(this)}deconstruct(){this.content.deconstruct()}update(){let t=this.onUpdate(),e=!1,o=this.content.builders;if(o.length>0)for(let c=0;c<o.length;c++)e=o[c].update()||e;return t||e}createHtmlElement(t){let e=t.tagName;if(typeof e!="string")throw e;if(e.includes("-")){let c=globalThis.customElements.get(e);if(typeof c<"u")return new c}let o=t.getAttribute("xmlns");return o&&!o.containsExpression?document.createElementNS(o.values[0],e):document.createElement(e)}createTextNode(t){return document.createTextNode(t)}};var qt=class{mChildBuilderList;mChildComponents;mContentAnchor;mContentBoundary;mLinkedContent;mRootChildList;get body(){return this.mRootChildList}get builders(){return this.mChildBuilderList}get contentAnchor(){return this.mContentAnchor}constructor(t){this.mChildBuilderList=new Array,this.mRootChildList=new Array,this.mChildComponents=new Map,this.mLinkedContent=new WeakSet,this.mContentAnchor=document.createComment(t),this.mContentBoundary={start:this.mContentAnchor,end:this.mContentAnchor}}deconstruct(){this.onDeconstruct();let t;for(;t=this.mChildBuilderList.pop();)t.deconstruct();for(let o of this.mChildComponents.values())o.deconstruct();this.mChildComponents.clear();let e;for(;e=this.mRootChildList.pop();)e instanceof lt||e.remove();this.contentAnchor.remove()}getBoundary(){let t=this.mContentBoundary.end instanceof lt?this.mContentBoundary.end.content.getBoundary().end:this.mContentBoundary.end;return{start:this.mContentBoundary.start,end:t}}insert(t,e,o){if(!this.mLinkedContent.has(o))throw new A("Can't add content to builder. Target is not part of builder.",this);let c=t instanceof lt?t.anchor:t;switch(e){case"After":{this.insertAfter(c,o);break}case"TopOf":{this.insertTop(c,o);break}case"BottomOf":{this.insertBottom(c,o);break}}this.mLinkedContent.add(t),t instanceof lt&&this.mChildBuilderList.push(t);let m=c.parentElement??c.getRootNode(),g=this.mContentAnchor.parentElement??this.mContentAnchor.getRootNode();if(m===g){let y=(()=>{switch(e){case"After":return this.mRootChildList.indexOf(o)+1;case"TopOf":return 0;case"BottomOf":return this.mRootChildList.length}})();y===this.mRootChildList.length&&(this.mContentBoundary.end=t),this.mRootChildList.splice(y+1,0,t)}}remove(t){if(!this.mLinkedContent.has(t))throw new A("Child node cant be deleted from builder when it not a child of them",this);if(this.mLinkedContent.delete(t),t instanceof lt){let o=this.mChildBuilderList.indexOf(t);o!==-1&&this.mChildBuilderList.splice(o,1),t.deconstruct()}else{let o=this.mChildComponents.get(t);o&&(o.deconstruct(),this.mChildComponents.delete(t)),t.remove()}let e=this.mRootChildList.indexOf(t);e!==-1&&(this.mRootChildList.splice(e,1),this.mContentBoundary.end=this.mRootChildList.at(-1)??this.mContentAnchor)}setCoreBuilder(t){this.mLinkedContent.add(t)}insertAfter(t,e){let o=e instanceof lt?e.content.getBoundary().end:e;(o.parentElement??o.getRootNode()).insertBefore(t,o.nextSibling)}insertBottom(t,e){if(e instanceof lt){this.insertAfter(t,e);return}if(e instanceof Element){e.appendChild(t);return}throw new A("Source node does not support child nodes.",this)}insertTop(t,e){if(e instanceof lt){this.insertAfter(t,e.anchor);return}if(e instanceof Element){e.prepend(t);return}throw new A("Source node does not support child nodes.",this)}};var Pe=class extends qt{mAttributeModulesChangedOrder;mLinkedAttributeData;mLinkedAttributeExpressionModules;mLinkedAttributeModuleList;mLinkedExpressionModuleList;get linkedAttributeModules(){return this.mAttributeModulesChangedOrder&&(this.mAttributeModulesChangedOrder=!1,this.mLinkedAttributeModuleList.sort((t,e)=>t.accessMode-e.accessMode)),this.mLinkedAttributeModuleList}get linkedExpressionModules(){return this.mLinkedExpressionModuleList}constructor(t){super(t),this.mLinkedExpressionModuleList=new Array,this.mLinkedAttributeModuleList=new Array,this.mLinkedAttributeExpressionModules=new WeakMap,this.mLinkedAttributeData=new WeakMap,this.mAttributeModulesChangedOrder=!1}attributeOfLinkedExpressionModule(t){return this.mLinkedAttributeExpressionModules.get(t)}getLinkedAttributeData(t){if(!this.mLinkedAttributeData.has(t))throw new A("Attribute has no linked data.",this);return this.mLinkedAttributeData.get(t)}linkAttributeExpression(t,e){this.mLinkedAttributeExpressionModules.set(t,e)}linkAttributeModule(t){this.mLinkedAttributeModuleList.push(t),this.mAttributeModulesChangedOrder=!0}linkAttributeNodes(t,e,o){this.mLinkedAttributeData.set(t,{values:o,node:e})}linkExpressionModule(t){this.mLinkedExpressionModuleList.push(t)}onDeconstruct(){for(let t of this.mLinkedAttributeModuleList)t.deconstruct();for(let t of this.mLinkedExpressionModuleList)t.deconstruct()}};var Ce=class extends qt{mInstructionModule;get instructionModule(){return this.mInstructionModule}constructor(t,e){super(e),this.mInstructionModule=t}onDeconstruct(){this.mInstructionModule.deconstruct()}};var Me=class extends lt{constructor(t,e,o){let c=e.createInstructionModule(t,o);super(t,e,o,new Ce(c,`Instruction - {$${t.instructionType}}`))}onUpdate(){if(this.content.instructionModule.update()){let t=this.content.body;this.updateStaticBuilder(t,this.content.instructionModule.instructionResult.elementList)}return!1}insertNewContent(t,e){let o=new Jt(t.template,this.modules,t.dataLevel,`Child - {$${this.template.instructionType}}`);return e===null?this.content.insert(o,"TopOf",this):this.content.insert(o,"After",e),o}updateStaticBuilder(t,e){let c=new ne((y,E)=>E.template.equals(y.template)).differencesOf(t,e),m=0,g=null;for(let y=0;y<c.length;y++){let E=c[y];if(E.changeState===St.Remove)this.content.remove(E.item);else if(E.changeState===St.Insert)g=this.insertNewContent(E.item,g),m++;else{let S=e[m].dataLevel;E.item.values.updateLevelData(S),g=E.item,m++}}}};var Jt=class extends lt{mInitialized;constructor(t,e,o,c){super(t,e,o,new Pe(`Static - {${c}}`)),this.mInitialized=!1}onUpdate(){this.mInitialized||(this.mInitialized=!0,this.buildTemplate([this.template],this));let t=!1,e=this.content.linkedAttributeModules;for(let m=0;m<e.length;m++)t=e[m].update()||t;let o=!1,c=this.content.linkedExpressionModules;for(let m=0;m<c.length;m++){let g=c[m];if(g.update()){o=!0;let y=this.content.attributeOfLinkedExpressionModule(g);if(!y)continue;let E=this.content.getLinkedAttributeData(y),S=E.values.reduce((l,n)=>l+n.data,"");E.node.setAttribute(y.name,S)}}return t||o}buildInstructionTemplate(t,e){this.content.insert(new Me(t,this.modules,new gt(this.values)),"BottomOf",e)}buildStaticTemplate(t,e){let o=this.createHtmlElement(t);this.content.insert(o,"BottomOf",e);for(let c of t.attributes){let m=this.modules.createAttributeModule(c,o,this.values);if(m){this.content.linkAttributeModule(m);continue}if(c.values.containsExpression){let g=new Array;for(let y of c.values.values){let E=this.createTextNode("");if(g.push(E),!(y instanceof xt)){E.data=y;continue}let S=this.modules.createExpressionModule(y,E,this.values);this.content.linkExpressionModule(S),this.content.linkAttributeExpression(S,c)}this.content.linkAttributeNodes(c,o,g);continue}o.setAttribute(c.name,c.values.toString())}this.content.insert(o,"BottomOf",e),this.buildTemplate(t.childList,o)}buildTemplate(t,e){for(let o of t)o instanceof ht?this.buildTemplate(o.body,e):o instanceof Ct?this.buildTextTemplate(o,e):o instanceof Ht?this.buildInstructionTemplate(o,e):o instanceof Mt&&this.buildStaticTemplate(o,e)}buildTextTemplate(t,e){for(let o of t.values){if(typeof o=="string"){this.content.insert(this.createTextNode(o),"BottomOf",e);continue}let c=this.createTextNode("");this.content.insert(c,"BottomOf",e);let m=this.modules.createExpressionModule(o,c,this.values);this.content.linkExpressionModule(m)}}};var he=class{mHtmlElement;mShadowRoot;get htmlElement(){return this.mHtmlElement}get shadowRoot(){return this.mShadowRoot}constructor(t){this.mHtmlElement=t,this.mShadowRoot=this.mHtmlElement.attachShadow({mode:"open"})}};var H=class{mDataLevel;get data(){return this.mDataLevel}constructor(t){this.mDataLevel=t}createExpressionProcedure(t,e){return new Ut(t,this.data,e??[])}};var $t=class extends Zt{constructor(t){super({constructor:t.constructor,parent:t.parent}),this.setProcessorInjection(H,new H(t.values))}deconstruct(){super.deconstruct(),this.call("onDeconstruct")}update(){return this.onUpdate()}};var k=class{mValue;get value(){return this.mValue}constructor(t){this.mValue=t}};var q=class{constructor(){throw new A("Reference should not be instanced.",this)}};var vt=class{constructor(){throw new A("Reference should not be instanced.",this)}};var Vt=class f extends $t{mLastResult;mTargetTextNode;constructor(t){super({constructor:t.constructor,parent:t.parent,values:t.values}),this.mTargetTextNode=t.targetNode,this.mLastResult=null,this.setProcessorInjection(f,this),this.setProcessorInjection(vt,t.targetTemplate.clone()),this.setProcessorInjection(q,t.targetNode),this.setProcessorInjection(k,new k(t.targetTemplate.value))}onUpdate(){let t=this.call("onUpdate");t===null&&(t="");let e=this.mLastResult===null||this.mLastResult!==t;if(e){let o=this.mTargetTextNode;o.data=t,this.mLastResult=t}return e}};function nr(){return(f,t)=>{O.registerInjectable(f,t.metadata,"instanced"),ut.register(Vt,f,{})}}function Gi(){function f(l,n){return function(a){e(n,"addInitializer"),o(a,"An initializer"),l.push(a)}}function t(l,n,u,a,r,b,v,T,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+n:n,static:b,private:v,metadata:T},d={v:!1};s.addInitializer=f(a,d);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return l(w,s)}finally{d.v=!0}}function e(l,n){if(l.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(l,n){if(typeof l!="function")throw new TypeError(n+" must be a function")}function c(l,n){var u=typeof n;if(l===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var a;throw l===0?a="field":l===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function m(l,n,u,a,r,b,v,T,w){var p=u[0],s,d,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,P;if(typeof p=="function")h=t(p,a,s,T,r,b,v,w,i),h!==void 0&&(c(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,P=h.set||i.set,i={get:x,set:P}):i=h);else for(var C=p.length-1;C>=0;C--){var M=p[C];if(h=t(M,a,s,T,r,b,v,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,P=h.set||i.set,i={get:x,set:P}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(I,D){return D};else if(typeof d!="function"){var F=d;d=function(I,D){for(var R=D,L=0;L<F.length;L++)R=F[L].call(I,R);return R}}else{var $=d;d=function(I,D){return $.call(I,D)}}l.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(l.push(function(I,D){return i.get.call(I,D)}),l.push(function(I,D){return i.set.call(I,D)})):r===2?l.push(i):l.push(function(I,D){return i.call(I,D)}):Object.defineProperty(n,a,s))}function g(l,n,u){for(var a=[],r,b,v=new Map,T=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,P;if(h?(x=l,s=s-5,b=b||[],P=b):(x=l.prototype,r=r||[],P=r),s!==0&&!i){var C=h?T:v,M=C.get(d)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!M&&s>2?C.set(d,s):C.set(d,!0)}m(a,x,p,d,s,h,i,P,u)}}return y(a,r),y(a,b),a}function y(l,n){n&&l.push(function(u){for(var a=0;a<n.length;a++)n[a].call(u);return u})}function E(l,n,u){if(n.length>0){for(var a=[],r=l,b=l.name,v=n.length-1;v>=0;v--){var T={v:!1};try{var w=n[v](r,{kind:"class",name:b,addInitializer:f(a,T),metadata:u})}finally{T.v=!0}w!==void 0&&(c(10,w),r=w)}return[S(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function S(l,n){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,a,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),T=g(n,u,v);return a.length||S(n,v),{e:T,get c(){return E(n,a,v)}}}}function pr(f,t,e,o){return(pr=Gi())(f,t,e,o)}var fr,dr,ir;fr=nr();var mr=class{static{({c:[ir,dr]}=pr(this,[],[fr]))}constructor(t=O.use(H),e=O.use(k)){this.mProcedure=t.createExpressionProcedure(e.value)}mProcedure;onUpdate(){let t=this.mProcedure.execute();return typeof t>"u"?null:t?.toString()}static{dr()}};var ot=class{mName;mValue;get name(){return this.mName}get value(){return this.mValue}constructor(t,e){this.mName=t,this.mValue=e}};var Tt=class f extends $t{mAccessMode;get accessMode(){return this.mAccessMode}constructor(t){super({constructor:t.constructor,parent:t.parent,values:t.values}),this.mAccessMode=t.accessMode,this.setProcessorInjection(f,this),this.setProcessorInjection(vt,t.targetTemplate.clone()),this.setProcessorInjection(q,t.targetNode),this.setProcessorInjection(ot,new ot(t.targetTemplate.name,t.targetTemplate.values.toString()))}onUpdate(){return this.call("onUpdate")??!1}};var dt=class{mElementList;mTemplates;mDataLevels;get elementList(){return this.mElementList}constructor(){this.mElementList=new Array,this.mTemplates=new Set,this.mDataLevels=new Set}addElement(t,e){if(this.mTemplates.has(t)||this.mDataLevels.has(e))throw new A("Can't add same template or values for multiple Elements.",this);this.mTemplates.add(t),this.mDataLevels.add(e),this.mElementList.push({template:t,dataLevel:e})}};var zt=class f extends $t{mLastResult;get instructionResult(){return this.mLastResult}constructor(t){super({constructor:t.constructor,parent:t.parent,values:t.values}),this.setProcessorInjection(f,this),this.setProcessorInjection(vt,t.targetTemplate.clone()),this.setProcessorInjection(k,new k(t.targetTemplate.instruction)),this.mLastResult=new dt}onUpdate(){let t=this.call("onUpdate");return t instanceof dt?(this.mLastResult=t,!0):!1}};var Ne=class f{static mAttributeModuleCache=new et;static mExpressionModuleCache=new WeakMap;static mInstructionModuleCache=new et;mComponent;mExpressionModule;constructor(t,e){this.mExpressionModule=e??ir,this.mComponent=t}createAttributeModule(t,e,o){let c=(()=>{let m=f.mAttributeModuleCache.get(t.name);if(m||m===null)return m;for(let g of ut.get(Tt))if(g.processorConfiguration.selector.test(t.name))return f.mAttributeModuleCache.set(t.name,g),g;return f.mAttributeModuleCache.set(t.name,null),null})();return c===null?null:new Tt({accessMode:c.processorConfiguration.access,constructor:c.processorConstructor,parent:this.mComponent,targetNode:e,targetTemplate:t,values:o}).setup()}createExpressionModule(t,e,o){let c=(()=>{let m=f.mExpressionModuleCache.get(this.mExpressionModule);if(m)return m;let g=ut.get(Vt).find(y=>y.processorConstructor===this.mExpressionModule);if(!g)throw new A("An expression module could not be found.",this);return f.mExpressionModuleCache.set(this.mExpressionModule,g),g})();return new Vt({constructor:c.processorConstructor,parent:this.mComponent,targetNode:e,targetTemplate:t,values:o}).setup()}createInstructionModule(t,e){let o=(()=>{let c=f.mInstructionModuleCache.get(t.instructionType);if(c)return c;for(let m of ut.get(zt))if(m.processorConfiguration.instructionType===t.instructionType)return f.mInstructionModuleCache.set(t.instructionType,m),m;throw new A(`Instruction module type "${t.instructionType}" not found.`,this)})();return new zt({constructor:o.processorConstructor,parent:this.mComponent,targetTemplate:t,values:e}).setup()}};var Xt=class extends A{mColumnEnd;mColumnStart;mLineEnd;mLineStart;get columnEnd(){return this.mColumnEnd}get columnStart(){return this.mColumnStart}get lineEnd(){return this.mLineEnd}get lineStart(){return this.mLineStart}constructor(t,e,o,c,m,g,y){super(t,e,y),this.mColumnStart=o,this.mLineStart=c,this.mColumnEnd=m,this.mLineEnd=g}};var Kt=class{mDependencyFetch;mDependencyFetchResolved;mLexer;mMeta;mPattern;mPatternDependencies;mType;get dependencies(){return this.mPatternDependencies}get dependenciesResolved(){return this.mDependencyFetchResolved}get lexer(){return this.mLexer}get meta(){return this.mMeta}get pattern(){return this.mPattern}constructor(t,e){if(this.mLexer=t,this.mType=e.type,this.mMeta=e.metadata,this.mPatternDependencies=new Array,this.mDependencyFetch=e.dependencyFetch??null,this.mDependencyFetchResolved=!e.dependencyFetch,this.mType==="split"&&!this.mDependencyFetch)throw new A("Split token with a start and end token, need inner token definitions.",this);if(this.mType==="single"&&this.mDependencyFetch)throw new A("Pattern does not allow inner token pattern.",this);this.mPattern=this.convertTokenPattern(this.mType,e.pattern)}isSplit(){return this.mType==="split"}resolveDependencies(){this.mDependencyFetchResolved||(this.mDependencyFetch(this),this.mDependencyFetchResolved=!0)}useChildPattern(t){if(this.mLexer!==t.lexer)throw new A("Can only add dependencies of the same lexer.",this);this.mPatternDependencies.push(t)}convertTokenPattern(t,e){if("single"in e){if(t==="split")throw new A("Can't use split pattern type with single pattern definition.",this);return{start:{regex:e.single.regex,types:e.single.types,validator:e.single.validator??null}}}else{if(t==="single")throw new A("Can't use single pattern type with split pattern definition.",this);return{start:{regex:e.start.regex,types:e.start.types,validator:e.start.validator??null},end:{regex:e.end.regex,types:e.end.types,validator:e.end.validator??null},innerType:e.innerType??null}}}};var Qt=class{mColumnNumber;mLineNumber;mMetas;mType;mValue;get columnNumber(){return this.mColumnNumber}get lineNumber(){return this.mLineNumber}get metas(){return[...this.mMetas]}get type(){return this.mType}get value(){return this.mValue}constructor(t,e,o,c){this.mValue=e,this.mColumnNumber=o,this.mLineNumber=c,this.mType=t,this.mMetas=new Set}addMeta(...t){for(let e of t)this.mMetas.add(e)}hasMeta(t){return this.mMetas.has(t)}};var de=class{mRootPattern;mSettings;get errorType(){return this.mSettings.errorType}set errorType(t){this.mSettings.errorType=t}get trimWhitespace(){return this.mSettings.trimSpaces}set trimWhitespace(t){this.mSettings.trimSpaces=t}get validWhitespaces(){return[...this.mSettings.whiteSpaces].join("")}set validWhitespaces(t){this.mSettings.whiteSpaces=new Set(t.split(""))}constructor(){this.mSettings={errorType:null,trimSpaces:!0,whiteSpaces:new Set},this.mRootPattern=new Kt(this,{type:"single",pattern:{single:{regex:/^/,types:{},validator:null}},metadata:[],dependencyFetch:null})}createTokenPattern(t,e){let o=y=>typeof y=="string"?{token:y}:y,c=y=>{let E=new Set(y.flags.split(""));return new RegExp(`^(?<token>${y.source})`,[...E].join(""))},m=new Array;t.meta&&(typeof t.meta=="string"?m.push(t.meta):m.push(...t.meta));let g;return"regex"in t.pattern?g={single:{regex:c(t.pattern.regex),types:o(t.pattern.type),validator:t.pattern.validator??null}}:g={start:{regex:c(t.pattern.start.regex),types:o(t.pattern.start.type),validator:t.pattern.start.validator??null},end:{regex:c(t.pattern.end.regex),types:o(t.pattern.end.type),validator:t.pattern.end.validator??null},innerType:t.pattern.innerType??null},new Kt(this,{type:"regex"in t.pattern?"single":"split",pattern:g,metadata:m,dependencyFetch:e??null})}*tokenize(t,e){let o={data:t,cursor:{position:0,column:1,line:1},error:null,progressTracker:e??null};yield*this.tokenizeRecursionLayer(o,this.mRootPattern,new Array,null)}useRootTokenPattern(t){if(t.lexer!==this)throw new A("Token pattern must be created by this lexer.",this);this.mRootPattern.useChildPattern(t)}findNextStartToken(t,e,o,c){for(let m of e){let g=m.pattern.start,y=this.matchToken(m,g,t,o,c);if(y!==null)return{pattern:m,token:y}}return null}findTokenTypeOfMatch(t,e,o){for(let g in t.groups){let y=t.groups[g],E=e[g];if(!(!y||!E)){if(y.length!==t[0].length)throw new A("A group of a token pattern must match the whole token.",this);return E}}let c=new Array;for(let g in t.groups)t.groups[g]&&c.push(g);let m=new Array;for(let g in e)m.push(g);throw new A(`No token type found for any defined pattern regex group. Full: "${t[0]}", Matches: "${c.join(", ")}", Available: "${m.join(", ")}", Regex: "${o.source}"`,this)}*generateErrorToken(t,e){if(!t.error||!this.mSettings.errorType)return;let o=new Qt(this.mSettings.errorType,t.error.data,t.error.startColumn,t.error.startLine);o.addMeta(...e),t.error=null,yield o}generateToken(t,e,o,c,m,g){let y=o[0],E=this.findTokenTypeOfMatch(o,c,g),S=new Qt(m??E,y,t.cursor.column,t.cursor.line);return S.addMeta(...e),S}matchToken(t,e,o,c,m){let g=e.regex;g.lastIndex=0;let y=g.exec(o.data);if(!y||y.index!==0)return null;let E=this.generateToken(o,[...c,...t.meta],y,e.types,m,g);if(e.validator){let S=o.data.substring(E.value.length);if(!e.validator(E,S,o.cursor.position))return null}return this.moveCursor(o,E.value),E}moveCursor(t,e){let o=e.split(`
`);o.length>1&&(t.cursor.column=1),t.cursor.line+=o.length-1,t.cursor.column+=o.at(-1).length,t.cursor.position+=e.length,t.data=t.data.substring(e.length),this.trackProgress(t)}pushNextCharToErrorState(t){if(!this.mSettings.errorType)throw new Xt(`Unable to parse next token. No valid pattern found for "${t.data.substring(0,20)}".`,this,t.cursor.column,t.cursor.line,t.cursor.column,t.cursor.line);t.error||(t.error={data:"",startColumn:t.cursor.column,startLine:t.cursor.line});let e=t.data.charAt(0);t.error.data+=e,this.moveCursor(t,e)}skipNextWhitespace(t){let e=t.data.charAt(0);return!this.mSettings.trimSpaces||!this.mSettings.whiteSpaces.has(e)?!1:(this.moveCursor(t,e),!0)}*tokenizeRecursionLayer(t,e,o,c){let m=e.dependencies;for(;t.data.length>0;){if(!t.error&&this.skipNextWhitespace(t))continue;if(e.isSplit()){let E=this.matchToken(e,e.pattern.end,t,o,c);if(E!==null){yield*this.generateErrorToken(t,o),yield E;return}}let g=this.findNextStartToken(t,m,o,c);if(!g){this.pushNextCharToErrorState(t);continue}yield*this.generateErrorToken(t,o),yield g.token;let y=g.pattern;y.isSplit()&&(y.resolveDependencies(),yield*this.tokenizeRecursionLayer(t,y,[...o,...y.meta],c??y.pattern.innerType))}yield*this.generateErrorToken(t,o)}trackProgress(t){t.progressTracker!==null&&t.progressTracker(t.cursor.position,t.cursor.line,t.cursor.column)}};var W=class extends Error{static PARSER_ERROR=Symbol("PARSER_ERROR");mTrace;get columnEnd(){return this.mTrace.top.range.columnEnd}get columnStart(){return this.mTrace.top.range.columnStart}get graph(){return this.mTrace.top.graph}get incidents(){return this.mTrace.incidents}get lineEnd(){return this.mTrace.top.range.lineEnd}get lineStart(){return this.mTrace.top.range.lineStart}constructor(t){super(t.top.message,{cause:t.top.cause}),this.mTrace=t}};var Ae=class{mIncidents;mTop;get incidents(){if(this.mIncidents===null)throw new A("A complete incident list is only available on debug mode.",this);return this.mIncidents}get top(){return this.mTop}constructor(t){this.mTop={message:"Unknown parser error",priority:0,graph:null,range:{lineStart:1,columnStart:1,lineEnd:1,columnEnd:1},cause:null},t?this.mIncidents=new Array:this.mIncidents=null}push(t,e,o,c,m,g,y=!1,E=null){let S;if(y?S=this.mTop.priority+1:S=m*1e4+g,this.mIncidents!==null){let l={message:t,priority:S,graph:e,range:{lineStart:o,columnStart:c,lineEnd:m,columnEnd:g},cause:E};this.mIncidents.push(l)}this.mTop&&S<this.mTop.priority||this.setTop({message:t,priority:S,graph:e,range:{lineStart:o,columnStart:c,lineEnd:m,columnEnd:g},cause:E})}setTop(t){this.mTop=t}};var Re=class f{static MAX_JUNCTION_CIRCULAR_REFERENCES=1e3;mGraphStack;mIncidentTrace;mLastTokenPosition;mProcessStack;mTokenCache;mTokenGenerator;mTrimTokenCache;get currentGraph(){return this.mGraphStack.top.graph}get currentToken(){let t=this.mGraphStack.top;return this.mTokenCache[t.token.cursor]}get incidentTrace(){return this.mIncidentTrace}get processStack(){return this.mProcessStack}constructor(t,e,o){this.mTokenGenerator=t,this.mGraphStack=new Rt,this.mLastTokenPosition={column:1,line:1},this.mTokenCache=new Array,this.mProcessStack=new Rt,this.mTrimTokenCache=o,this.mIncidentTrace=new Ae(e),this.mGraphStack.push({graph:null,linear:!0,circularGraphs:new et,token:{start:0,cursor:-1}})}collapse(){let t=this.mGraphStack.top,e=this.mTokenCache.slice(t.token.cursor);e.length!==0&&e.at(-1)===null&&e.pop();for(let o of this.mTokenGenerator)e.push(o);return e}getGraphBoundingToken(){let t=this.mGraphStack.top,e=this.mTokenCache[t.token.start],o=this.mTokenCache[t.token.cursor-1];return e??=o,o??=e,[e??null,o??null]}getGraphPosition(){let t=this.mGraphStack.top,e,o;if(e=this.mTokenCache[t.token.start],o=this.mTokenCache[t.token.cursor-1],e??=o,o??=e,!e||!o)return{graph:t.graph,columnEnd:this.mLastTokenPosition.column,columnStart:this.mLastTokenPosition.column,lineEnd:this.mLastTokenPosition.line,lineStart:this.mLastTokenPosition.line};let c,m;if(o.value.includes(`
`)){let g=o.value.split(`
`);m=o.lineNumber+g.length-1,c=1+g[g.length-1].length}else c=o.columnNumber+o.value.length,m=o.lineNumber;return{graph:t.graph,lineStart:e.lineNumber,columnStart:e.columnNumber,lineEnd:m,columnEnd:c}}getTokenPosition(){let t=this.mGraphStack.top,e=this.currentToken;if(!e)return{graph:t.graph,columnEnd:this.mLastTokenPosition.column,columnStart:this.mLastTokenPosition.column,lineEnd:this.mLastTokenPosition.line,lineStart:this.mLastTokenPosition.line};let o,c;if(e.value.includes(`
`)){let m=e.value.split(`
`);c=e.lineNumber+m.length-1,o=1+m[m.length-1].length}else o=e.columnNumber+e.value.length,c=e.lineNumber;return{graph:t.graph,lineStart:e.lineNumber,columnStart:e.columnNumber,lineEnd:c,columnEnd:o}}graphIsCircular(t){let e=this.mGraphStack.top;if(!e.circularGraphs.has(t))return!1;if(t.isJunction){if(e.circularGraphs.get(t)>f.MAX_JUNCTION_CIRCULAR_REFERENCES)throw new A("Junction graph called circular too often.",this);return!1}return!0}moveNextToken(){let t=this.mGraphStack.top;if(t.circularGraphs.size>0&&(t.circularGraphs=new et),t.graph&&t.graph.isJunction)throw new A("Junction graph must not have own nodes.",this);if(t.token.cursor++,t.token.cursor<this.mTokenCache.length)return;let e=this.mTokenGenerator.next();if(e.done){this.mTokenCache.push(null);return}this.mLastTokenPosition.column=e.value.columnNumber,this.mLastTokenPosition.line=e.value.lineNumber,this.mTokenCache.push(e.value)}popGraphStack(t){let e=this.mGraphStack.pop(),o=this.mGraphStack.top;if(t&&(e.token.cursor=e.token.start),e.token.cursor!==e.token.start&&o.circularGraphs.size>0&&(o.circularGraphs=new et),!this.mTrimTokenCache){o.token.cursor=e.token.cursor;return}e.linear?(this.mTokenCache.splice(0,e.token.cursor),o.token.start=0,o.token.cursor=0):o.token.cursor=e.token.cursor}pushGraphStack(t,e){let o=this.mGraphStack.top,c={graph:t,linear:e&&o.linear,circularGraphs:new et(o.circularGraphs),token:{start:o.token.cursor,cursor:o.token.cursor}},m=c.circularGraphs.get(t)??0;c.circularGraphs.set(t,m+1),this.mGraphStack.push(c)}};var me=class f{static NODE_NULL_RESULT=Symbol("FAILED_NODE_VALUE_PARSE");static NODE_VALUE_LIST_END_MEET=Symbol("FAILED_NODE_VALUE_PARSE");mConfiguration;mLexer;mRootPart;get lexer(){return this.mLexer}constructor(t,e){this.mLexer=t,this.mRootPart=null,this.mConfiguration={keepTraceIncidents:!1,trimTokenCache:!1,...e}}parse(t,e){if(this.mRootPart===null)throw new A("Parser has not root part set.",this);let o=new Re(this.mLexer.tokenize(t,e),this.mConfiguration.keepTraceIncidents,this.mConfiguration.trimTokenCache),c=(()=>{try{return this.beginParseProcess(o,this.mRootPart)}catch(g){if(g instanceof Xt)return o.incidentTrace.push(g.message,o.currentGraph,g.lineStart,g.columnStart,g.lineEnd,g.columnEnd,!0,g),W.PARSER_ERROR;let y=g instanceof Error?g.message:g.toString(),E=o.getGraphPosition();return o.incidentTrace.push(y,o.currentGraph,E.lineStart,E.columnStart,E.lineEnd,E.columnEnd,!0,g),W.PARSER_ERROR}})();if(c===W.PARSER_ERROR)throw new W(o.incidentTrace);let m=o.collapse();if(m.length!==0){let g=m[0];if(o.incidentTrace.top.range.lineEnd===1&&o.incidentTrace.top.range.columnEnd===1){let y=`Tokens could not be parsed. Graph end meet without reaching last token. Current: "${g.value}" (${g.type})`;o.incidentTrace.push(y,this.mRootPart,g.lineNumber,g.columnNumber,g.lineNumber,g.columnNumber)}throw new W(o.incidentTrace)}return c}setRootGraph(t){this.mRootPart=t}beginParseProcess(t,e){t.moveNextToken(),t.processStack.push({type:"graph-parse",parameter:{graph:e,linear:!0},state:0});let o=f.NODE_NULL_RESULT;for(;t.processStack.top;)o=this.processStack(t,t.processStack.top,o);return o}processChainedNodeParseProcess(t,e,o){switch(e.state){case 0:{let g=e.parameter.node.connections.next;return g===null?(t.processStack.pop(),{}):(e.state++,t.processStack.push({type:"node-parse",parameter:{node:g},state:0,values:{}}),f.NODE_NULL_RESULT)}case 1:{let c=o;return c===W.PARSER_ERROR?(t.processStack.pop(),W.PARSER_ERROR):(t.processStack.pop(),c)}}throw new A(`Invalid node next parse state "${e.state}".`,this)}processGraphParseProcess(t,e,o){let c=e.parameter.graph;switch(e.state){case 0:{if(t.graphIsCircular(c)){let g=t.getGraphPosition();return t.incidentTrace.push("Circular graph detected.",c,g.lineStart,g.columnStart,g.lineEnd,g.columnEnd),t.processStack.pop(),W.PARSER_ERROR}let m=e.parameter.linear;return t.pushGraphStack(c,m),e.state++,t.processStack.push({type:"node-parse",parameter:{node:c.node},state:0,values:{}}),f.NODE_NULL_RESULT}case 1:{let m=o;if(m===W.PARSER_ERROR)return t.popGraphStack(!0),t.processStack.pop(),W.PARSER_ERROR;let g=c.convert(m,t);if(typeof g=="symbol"){let y=t.getGraphPosition();return t.incidentTrace.push(g.description??"Unknown data convert error",y.graph,y.lineStart,y.columnStart,y.lineEnd,y.columnEnd),t.popGraphStack(!0),t.processStack.pop(),W.PARSER_ERROR}return t.popGraphStack(!1),t.processStack.pop(),g}}throw new A(`Invalid graph parse state "${e.state}".`,this)}processNodeParseProcess(t,e,o){let c=e.parameter.node;switch(e.state){case 0:return t.processStack.push({type:"node-value-parse",parameter:{node:c,valueIndex:0},state:0,values:{}}),e.state++,f.NODE_NULL_RESULT;case 1:{let m=o;return m===W.PARSER_ERROR?(t.processStack.pop(),W.PARSER_ERROR):(e.values.nodeValueResult=m,t.processStack.push({type:"node-next-parse",parameter:{node:c},state:0}),e.state++,f.NODE_NULL_RESULT)}case 2:{let m=o;if(m===W.PARSER_ERROR)return t.processStack.pop(),W.PARSER_ERROR;let g=c.mergeData(e.values.nodeValueResult,m);return t.processStack.pop(),g}}throw new A(`Invalid node parse state "${e.state}".`,this)}processNodeValueParseProcess(t,e,o){let c=e.parameter.node;switch(e.state){case 0:{if(o!==f.NODE_NULL_RESULT&&o!==W.PARSER_ERROR)return e.values.parseResult=o,e.state++,f.NODE_NULL_RESULT;let m=e.parameter.valueIndex,g=c.connections;if(m>=g.values.length)return e.values.parseResult=f.NODE_VALUE_LIST_END_MEET,e.state++,f.NODE_NULL_RESULT;e.parameter.valueIndex++;let y=t.currentToken,E=g.values[m];if(typeof E=="string"){if(!y){if(g.required){let S=t.getTokenPosition();t.incidentTrace.push(`Unexpected end of statement. Token "${E}" expected.`,t.currentGraph,S.lineStart,S.columnStart,S.lineEnd,S.columnEnd)}return f.NODE_NULL_RESULT}if(E!==y.type){if(g.required){let S=t.getTokenPosition();t.incidentTrace.push(`Unexpected token "${y.value}". "${E}" expected`,t.currentGraph,S.lineStart,S.columnStart,S.lineEnd,S.columnEnd)}return f.NODE_NULL_RESULT}return t.moveNextToken(),y.value}else{let S=g.values.length===1||g.values.length===m+1;return t.processStack.push({type:"graph-parse",parameter:{graph:E,linear:S},state:0}),f.NODE_NULL_RESULT}}case 1:{let m=e.values.parseResult,g=c.connections;if(m===f.NODE_VALUE_LIST_END_MEET&&!g.required){t.processStack.pop();return}return m===f.NODE_VALUE_LIST_END_MEET?(t.processStack.pop(),W.PARSER_ERROR):(t.processStack.pop(),m)}}throw new A(`Invalid node value parse state "${e.state}".`,this)}processStack(t,e,o){switch(e.type){case"graph-parse":return this.processGraphParseProcess(t,e,o);case"node-parse":return this.processNodeParseProcess(t,e,o);case"node-value-parse":return this.processNodeValueParseProcess(t,e,o);case"node-next-parse":return this.processChainedNodeParseProcess(t,e,o)}}};var J=class f{static define(t,e=!1){return new f(t,e)}mDataConverterList;mGraphCollector;mIsJunction;mResolvedGraphNode;get isJunction(){return this.mIsJunction}get node(){return this.mResolvedGraphNode||(this.mResolvedGraphNode=this.mGraphCollector().root),this.mResolvedGraphNode}constructor(t,e){this.mGraphCollector=t,this.mDataConverterList=new Array,this.mResolvedGraphNode=null,this.mIsJunction=e}convert(t,e){if(this.mDataConverterList.length===0)return t;let o=e.getGraphBoundingToken(),c=o[0]??void 0,m=o[1]??void 0;if(this.mDataConverterList.length===1)return this.mDataConverterList[0](t,c,m);let g=t;for(let y of this.mDataConverterList)if(g=y(g,c,m),typeof g=="symbol")return g;return g}converter(t){let e=new f(this.mGraphCollector,this.isJunction);return e.mDataConverterList.push(...this.mDataConverterList,t),e}};var U=class f{static new(){let t=new f("",!1,[]);return t.mRootNode=null,t}mConnections;mIdentifier;mRootNode;get configuration(){return{dataKey:this.mIdentifier.dataKey,isList:this.mIdentifier.type==="list",isRequired:this.mConnections.required,isBranch:this.mConnections.values.length>1}}get connections(){return this.mConnections}get root(){if(!this.mRootNode)throw new A("Staring nodes must be chained with another node to be used.",this);return this.mRootNode}constructor(t,e,o,c){if(t==="")this.mIdentifier={type:"empty",dataKey:"",mergeKey:""};else if(t.endsWith("[]"))this.mIdentifier={type:"list",mergeKey:"",dataKey:t.substring(0,t.length-2)};else if(t.includes("<-")){let g=t.split("<-");this.mIdentifier={type:"merge",dataKey:g[0],mergeKey:g[1]}}else this.mIdentifier={type:"single",mergeKey:"",dataKey:t};let m=o.map(g=>g instanceof f?J.define(()=>g):g);this.mConnections={required:e,values:m,next:null},c?this.mRootNode=c:this.mRootNode=this}mergeData(t,e){if(this.mIdentifier.type==="empty")return e;let o=e,c=typeof t>"u";if(this.mIdentifier.type==="single"){if(this.mIdentifier.dataKey in e)throw new A(`Graph path has a duplicate value identifier "${this.mIdentifier.dataKey}"`,this);return c||(o[this.mIdentifier.dataKey]=t),e}if(this.mIdentifier.type==="list"){let y;c?y=new Array:Array.isArray(t)?y=t:y=[t];let E=(()=>{if(this.mIdentifier.dataKey in e){let S=o[this.mIdentifier.dataKey];return Array.isArray(S)?(S.unshift(...y),S):(y.push(S),y)}return y})();return o[this.mIdentifier.dataKey]=E,e}if(c)return e;let m=(()=>{if(!this.mIdentifier.mergeKey)throw new A("Cant merge data without a merge key.",this);if(typeof t!="object"||t===null)throw new A("Node data must be an object when merge key is set.",this);if(!(this.mIdentifier.mergeKey in t))throw new A(`Node data does not contain merge key "${this.mIdentifier.mergeKey}"`,this);return t[this.mIdentifier.mergeKey]})();if(typeof m>"u")return e;let g=o[this.mIdentifier.dataKey];if(typeof g>"u")return o[this.mIdentifier.dataKey]=m,o;if(!Array.isArray(g))throw new A("Chain data merge value is not an array but should be.",this);return Array.isArray(m)?g.unshift(...m):g.unshift(m),e}optional(t,e){let o=typeof e>"u"?"":t,c=typeof e>"u"?t:e,m=new Array;Array.isArray(c)?m.push(...c):m.push(c);let g=new f(o,!1,m,this.mRootNode);return this.setChainedNode(g),g}required(t,e){let o=typeof e>"u"?"":t,c=typeof e>"u"?t:e,m=new Array;Array.isArray(c)?m.push(...c):m.push(c);let g=new f(o,!0,m,this.mRootNode);return this.setChainedNode(g),g}setChainedNode(t){if(this.mConnections.next!==null)throw new A("Node can only be chained to a single node.",this);this.mConnections.next=t}};var j={XmlIdentifier:"Identifier",XmlAssignment:"XmlAssignment",XmlValue:"XmlValue",XmlComment:"XmlComment",XmlOpenClosingBracket:"XmlOpenClosingBracket",XmlCloseBracket:"XmlCloseBracket",XmlOpenBracket:"XmlOpenBracket",XmlCloseClosingBracket:"XmlCloseClosingBracket",XmlExplicitValueIdentifier:"XmlExplicitValueIdentifier",ExpressionStart:"ExpressionStart",ExpressionEnd:"ExpressionEnd",ExpressionValue:"ExpressionValue",InstructionStart:"InstructionStart",InstructionInstructionValue:"InstructionInstructionValue",InstructionBodyStartBraket:"InstructionBodyStartBraket",InstructionBodyCloseBraket:"InstructionBodyCloseBraket",InstructionInstructionClosingBracket:"InstructionInstructionClosingBracket",InstructionInstructionOpeningBracket:"InstructionInstructionOpeningBracket"};var Le=class extends de{constructor(){super(),this.validWhitespaces=` 
\r`,this.trimWhitespace=!0;let t=this.createTokenPattern({pattern:{regex:/(?:(?!}}).)*/,type:j.ExpressionValue}}),e=this.createTokenPattern({pattern:{start:{regex:/{{/,type:j.ExpressionStart},end:{regex:/}}/,type:j.ExpressionEnd}}},s=>{s.useChildPattern(t)}),o=this.createTokenPattern({pattern:{regex:/[^>\s\n="/]+/,type:j.XmlIdentifier}}),c=this.createTokenPattern({pattern:{regex:/(?:(?!{{|"|<).)+/,type:j.XmlValue}}),m=this.createTokenPattern({pattern:{regex:/<!--.*?-->/,type:j.XmlComment}}),g=this.createTokenPattern({pattern:{regex:/=/,type:j.XmlAssignment}}),y=this.createTokenPattern({pattern:{start:{regex:/"/,type:j.XmlExplicitValueIdentifier},end:{regex:/"/,type:j.XmlExplicitValueIdentifier}}},s=>{s.useChildPattern(e),s.useChildPattern(c)}),E=this.createTokenPattern({pattern:{start:{regex:/<\//,type:j.XmlOpenClosingBracket},end:{regex:/>/,type:j.XmlCloseBracket}}},s=>{s.useChildPattern(o)}),S=this.createTokenPattern({pattern:{start:{regex:/</,type:j.XmlOpenBracket},end:{regex:/(?<closeClosingBracket>\/>)|(?<closeBracket>>)/,type:{closeClosingBracket:j.XmlCloseClosingBracket,closeBracket:j.XmlCloseBracket}}}},s=>{s.useChildPattern(g),s.useChildPattern(o),s.useChildPattern(y)}),l=this.createTokenPattern({pattern:{regex:/[^()"'`/)]+/,type:j.InstructionInstructionValue}}),n=this.createTokenPattern({pattern:{innerType:j.InstructionInstructionValue,start:{regex:/\//,type:j.InstructionInstructionValue},end:{regex:/\//,type:j.InstructionInstructionValue}}},s=>{s.useChildPattern(a),s.useChildPattern(r),s.useChildPattern(b),s.useChildPattern(u),s.useChildPattern(l)}),u=this.createTokenPattern({pattern:{innerType:j.InstructionInstructionValue,start:{regex:/\(/,type:j.InstructionInstructionValue},end:{regex:/\)/,type:j.InstructionInstructionValue}}},s=>{s.useChildPattern(n),s.useChildPattern(a),s.useChildPattern(r),s.useChildPattern(b),s.useChildPattern(l)}),a=this.createTokenPattern({pattern:{innerType:j.InstructionInstructionValue,start:{regex:/"/,type:j.InstructionInstructionValue},end:{regex:/"/,type:j.InstructionInstructionValue}}},s=>{s.useChildPattern(n),s.useChildPattern(r),s.useChildPattern(b),s.useChildPattern(u),s.useChildPattern(l)}),r=this.createTokenPattern({pattern:{innerType:j.InstructionInstructionValue,start:{regex:/'/,type:j.InstructionInstructionValue},end:{regex:/'/,type:j.InstructionInstructionValue}}},s=>{s.useChildPattern(n),s.useChildPattern(a),s.useChildPattern(b),s.useChildPattern(u),s.useChildPattern(l)}),b=this.createTokenPattern({pattern:{innerType:j.InstructionInstructionValue,start:{regex:/`/,type:j.InstructionInstructionValue},end:{regex:/`/,type:j.InstructionInstructionValue}}},s=>{s.useChildPattern(n),s.useChildPattern(a),s.useChildPattern(r),s.useChildPattern(u),s.useChildPattern(l)}),v=this.createTokenPattern({pattern:{regex:/\$[^(\s\n/{]+/,type:j.InstructionStart}}),T=this.createTokenPattern({pattern:{start:{regex:/\(/,type:j.InstructionInstructionOpeningBracket},end:{regex:/\)/,type:j.InstructionInstructionClosingBracket}}},s=>{s.useChildPattern(n),s.useChildPattern(a),s.useChildPattern(r),s.useChildPattern(b),s.useChildPattern(u),s.useChildPattern(l)}),w=this.createTokenPattern({pattern:{start:{regex:/{/,type:j.InstructionBodyStartBraket},end:{regex:/}/,type:j.InstructionBodyCloseBraket}}},s=>{for(let d of p)s.useChildPattern(d)}),p=[m,E,S,y,e,v,T,w,c];for(let s of p)this.useRootTokenPattern(s)}};var pe=class extends me{constructor(){super(new Le),this.initGraph()}initGraph(){let t=J.define(()=>U.new().required(j.ExpressionStart).optional("value",j.ExpressionValue).required(j.ExpressionEnd)).converter(r=>new xt(r.value??"")),e=J.define(()=>{let r=e;return U.new().required("data[]",U.new().required("value",[t,U.new().required("text",j.XmlValue)])).optional("data<-data",r)}),o=J.define(()=>U.new().required("name",j.XmlIdentifier).optional("attributeValue",U.new().required(j.XmlAssignment).required(j.XmlExplicitValueIdentifier).optional("list<-data",e).required(j.XmlExplicitValueIdentifier))).converter(r=>{let b=new Array;if(r.attributeValue?.list)for(let v of r.attributeValue.list)v.value instanceof xt?b.push(v.value):b.push(v.value.text);return{name:r.name,values:b}}),c=J.define(()=>{let r=c;return U.new().required("data[]",o).optional("data<-data",r)}),m=J.define(()=>{let r=m;return U.new().required("data[]",U.new().required("value",[t,U.new().required("text",j.XmlValue),U.new().required(j.XmlExplicitValueIdentifier).required("text",j.XmlValue).required(j.XmlExplicitValueIdentifier)])).optional("data<-data",r)}),g=J.define(()=>U.new().required("list<-data",m)).converter(r=>{let b=new Ct;for(let v of r.list)v.value instanceof xt?b.addValue(v.value):b.addValue(v.value.text);return b}),y=J.define(()=>U.new().required(j.XmlComment)).converter(()=>null),E=J.define(()=>U.new().required(j.XmlOpenBracket).required("openingTagName",j.XmlIdentifier).optional("attributes<-data",c).required("closing",[U.new().required(j.XmlCloseClosingBracket),U.new().required(j.XmlCloseBracket).required("values",u).required(j.XmlOpenClosingBracket).required("closingTageName",j.XmlIdentifier).required(j.XmlCloseBracket)])).converter(r=>{if("closingTageName"in r.closing&&r.openingTagName!==r.closing.closingTageName)throw new A(`Opening (${r.openingTagName}) and closing tagname (${r.closing.closingTageName}) does not match`,this);let b=new Mt(r.openingTagName);if(r.attributes)for(let v of r.attributes)b.setAttribute(v.name).addValue(...v.values);return"values"in r.closing&&b.appendChild(...r.closing.values),b}),S=J.define(()=>{let r=S;return U.new().required("list[]",j.InstructionInstructionValue).optional("list<-list",r)}),l=J.define(()=>U.new().required("instructionName",j.InstructionStart).optional("instruction",U.new().required(j.InstructionInstructionOpeningBracket).required("value<-list",S).required(j.InstructionInstructionClosingBracket)).optional("body",U.new().required(j.InstructionBodyStartBraket).required("value",u).required(j.InstructionBodyCloseBraket))).converter(r=>{let b=r.instructionName.substring(1),v=r.instruction?.value.join("")??"",T=new Ht(b,v);return r.body&&T.appendChild(...r.body.value),T}),n=J.define(()=>{let r=n;return U.new().required("list[]",[y,E,l,g]).optional("list<-list",r)}),u=J.define(()=>{let r=n;return U.new().optional("list<-list",r)}).converter(r=>{let b=new Array;if(r.list)for(let v of r.list)v!==null&&b.push(v);return b}),a=J.define(()=>U.new().required("content",u)).converter(r=>{let b=new ht;return b.appendChild(...r.content),b});this.setRootGraph(a)}};var z=class f extends Se{static mTemplateCache=new et;static mXmlParser=new pe;mComponentElement;mRootBuilder;get element(){return this.mComponentElement.htmlElement}constructor(t){super({constructor:t.processorConstructor,parent:null}),ct.registerComponent(this,t.htmlElement),this.setProcessorInjection(f,this),this.addConstructionHook(o=>{ct.registerComponent(this,this.mComponentElement.htmlElement,o)}),f.mTemplateCache.has(t.processorConstructor)||f.mTemplateCache.set(t.processorConstructor,f.mXmlParser.parse(t.templateString??""));let e=f.mTemplateCache.get(t.processorConstructor).clone();this.mComponentElement=new he(t.htmlElement),this.mRootBuilder=new Jt(e,new Ne(this,t.expressionModule),new gt(this),"ROOT"),this.mComponentElement.shadowRoot.appendChild(this.mRootBuilder.anchor),this.setProcessorInjection(Dt,new Dt(this.mRootBuilder.values))}addStyle(t){let e=document.createElement("style");e.innerHTML=t,this.mComponentElement.shadowRoot.prepend(e)}attributeChanged(t,e,o){this.call("onAttributeChange",t,e,o)}connected(){this.call("onConnect")}deconstruct(){this.call("onDeconstruct"),this.mRootBuilder.deconstruct(),super.deconstruct()}disconnected(){this.call("onDisconnect")}onUpdate(){return this.mRootBuilder.update()?(this.call("onUpdate"),!0):!1}};function K(f){return(t,e)=>{O.registerInjectable(t,e.metadata,"instanced"),ct.registerConstructor(t,f.selector);let o=class extends HTMLElement{mComponent;constructor(){super(),this.mComponent=new z({processorConstructor:t,templateString:f.template??null,expressionModule:f.expressionmodule,htmlElement:this}).setup(),f.style&&this.mComponent.addStyle(f.style),this.mComponent.updater.update()}connectedCallback(){this.mComponent.connected()}disconnectedCallback(){this.mComponent.disconnected()}};globalThis.customElements.define(f.selector,o)}}function Wt(f){return(t,e)=>{O.registerInjectable(t,e.metadata,"instanced"),ut.register(Ot,t,{access:f.access,targetRestrictions:f.targetRestrictions})}}function Et(f){return(t,e)=>{O.registerInjectable(t,e.metadata,"instanced"),ut.register(Tt,t,{access:f.access,selector:f.selector})}}function Nt(f){return(t,e)=>{O.registerInjectable(t,e.metadata,"instanced"),ut.register(zt,t,{instructionType:f.instructionType})}}function Ui(){function f(l,n){return function(a){e(n,"addInitializer"),o(a,"An initializer"),l.push(a)}}function t(l,n,u,a,r,b,v,T,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+n:n,static:b,private:v,metadata:T},d={v:!1};s.addInitializer=f(a,d);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return l(w,s)}finally{d.v=!0}}function e(l,n){if(l.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(l,n){if(typeof l!="function")throw new TypeError(n+" must be a function")}function c(l,n){var u=typeof n;if(l===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var a;throw l===0?a="field":l===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function m(l,n,u,a,r,b,v,T,w){var p=u[0],s,d,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,P;if(typeof p=="function")h=t(p,a,s,T,r,b,v,w,i),h!==void 0&&(c(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,P=h.set||i.set,i={get:x,set:P}):i=h);else for(var C=p.length-1;C>=0;C--){var M=p[C];if(h=t(M,a,s,T,r,b,v,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,P=h.set||i.set,i={get:x,set:P}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(I,D){return D};else if(typeof d!="function"){var F=d;d=function(I,D){for(var R=D,L=0;L<F.length;L++)R=F[L].call(I,R);return R}}else{var $=d;d=function(I,D){return $.call(I,D)}}l.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(l.push(function(I,D){return i.get.call(I,D)}),l.push(function(I,D){return i.set.call(I,D)})):r===2?l.push(i):l.push(function(I,D){return i.call(I,D)}):Object.defineProperty(n,a,s))}function g(l,n,u){for(var a=[],r,b,v=new Map,T=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,P;if(h?(x=l,s=s-5,b=b||[],P=b):(x=l.prototype,r=r||[],P=r),s!==0&&!i){var C=h?T:v,M=C.get(d)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!M&&s>2?C.set(d,s):C.set(d,!0)}m(a,x,p,d,s,h,i,P,u)}}return y(a,r),y(a,b),a}function y(l,n){n&&l.push(function(u){for(var a=0;a<n.length;a++)n[a].call(u);return u})}function E(l,n,u){if(n.length>0){for(var a=[],r=l,b=l.name,v=n.length-1;v>=0;v--){var T={v:!1};try{var w=n[v](r,{kind:"class",name:b,addInitializer:f(a,T),metadata:u})}finally{T.v=!0}w!==void 0&&(c(10,w),r=w)}return[S(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function S(l,n){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,a,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),T=g(n,u,v);return a.length||S(n,v),{e:T,get c(){return E(n,a,v)}}}}function vr(f,t,e,o){return(vr=Ui())(f,t,e,o)}function Hi(f){return f}var yr,gr,fe;yr=Wt({access:X.Read,targetRestrictions:[z]});new class extends Hi{constructor(){super(fe),gr()}static{class f{static{({c:[fe,gr]}=vr(this,[],[yr]))}static METADATA_USER_EVENT_LISTENER_PROPERIES="pwb:user_event_listener_properties";mEventListenerList;mTargetElement;constructor(e=O.use(z)){let o=new Array,c=e.processorConstructor;do{let m=at.get(c).getMetadata(f.METADATA_USER_EVENT_LISTENER_PROPERIES);if(m)for(let g of m)o.push(g)}while(c=Object.getPrototypeOf(c));this.mEventListenerList=new Array,this.mTargetElement=e.element;for(let m of o){let[g,y]=m,E=Reflect.get(e.processor,g);E=E.bind(e.processor),this.mEventListenerList.push([y,E]),this.mTargetElement.addEventListener(y,E)}}onDeconstruct(){for(let e of this.mEventListenerList){let[o,c]=e;this.mTargetElement.removeEventListener(o,c)}}}}};var ge=class extends window.Event{mValue;get value(){return this.mValue}constructor(t,e){super(t),this.mValue=e}};var ve=class{mElement;mEventName;constructor(t,e){this.mEventName=t,this.mElement=e}dispatchEvent(t){let e=new ge(this.mEventName,t);this.mElement.dispatchEvent(e)}};function mt(f){return(t,e)=>{if(e.static)throw new A("Event target is not for a static property.",mt);let o=null;return{get(){if(!o){let c=(()=>{try{return ct.ofProcessor(this).component}catch{throw new A("PwbComponentEvent target class is not a component.",this)}})();o=new ve(f,c.element)}return o}}}}function Xi(){function f(l,n){return function(a){e(n,"addInitializer"),o(a,"An initializer"),l.push(a)}}function t(l,n,u,a,r,b,v,T,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+n:n,static:b,private:v,metadata:T},d={v:!1};s.addInitializer=f(a,d);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return l(w,s)}finally{d.v=!0}}function e(l,n){if(l.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(l,n){if(typeof l!="function")throw new TypeError(n+" must be a function")}function c(l,n){var u=typeof n;if(l===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var a;throw l===0?a="field":l===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function m(l,n,u,a,r,b,v,T,w){var p=u[0],s,d,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,P;if(typeof p=="function")h=t(p,a,s,T,r,b,v,w,i),h!==void 0&&(c(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,P=h.set||i.set,i={get:x,set:P}):i=h);else for(var C=p.length-1;C>=0;C--){var M=p[C];if(h=t(M,a,s,T,r,b,v,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,P=h.set||i.set,i={get:x,set:P}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(I,D){return D};else if(typeof d!="function"){var F=d;d=function(I,D){for(var R=D,L=0;L<F.length;L++)R=F[L].call(I,R);return R}}else{var $=d;d=function(I,D){return $.call(I,D)}}l.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(l.push(function(I,D){return i.get.call(I,D)}),l.push(function(I,D){return i.set.call(I,D)})):r===2?l.push(i):l.push(function(I,D){return i.call(I,D)}):Object.defineProperty(n,a,s))}function g(l,n,u){for(var a=[],r,b,v=new Map,T=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,P;if(h?(x=l,s=s-5,b=b||[],P=b):(x=l.prototype,r=r||[],P=r),s!==0&&!i){var C=h?T:v,M=C.get(d)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!M&&s>2?C.set(d,s):C.set(d,!0)}m(a,x,p,d,s,h,i,P,u)}}return y(a,r),y(a,b),a}function y(l,n){n&&l.push(function(u){for(var a=0;a<n.length;a++)n[a].call(u);return u})}function E(l,n,u){if(n.length>0){for(var a=[],r=l,b=l.name,v=n.length-1;v>=0;v--){var T={v:!1};try{var w=n[v](r,{kind:"class",name:b,addInitializer:f(a,T),metadata:u})}finally{T.v=!0}w!==void 0&&(c(10,w),r=w)}return[S(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function S(l,n){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,a,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),T=g(n,u,v);return a.length||S(n,v),{e:T,get c(){return E(n,a,v)}}}}function wr(f,t,e,o){return(wr=Xi())(f,t,e,o)}function Wi(f){return f}var xr,br,ye;xr=Wt({access:X.ReadWrite,targetRestrictions:[z]});new class extends Wi{constructor(){super(ye),br()}static{class f{static{({c:[ye,br]}=wr(this,[],[xr]))}static METADATA_EXPORTED_PROPERTIES="pwb:exported_properties";mComponent;constructor(e=O.use(z)){this.mComponent=e;let o=new Bt,c=e.processorConstructor;do{let g=at.get(c).getMetadata(f.METADATA_EXPORTED_PROPERTIES);g&&o.push(...g)}while(c=Object.getPrototypeOf(c));let m=new Set(o);m.size>0&&this.connectExportedProperties(m)}connectExportedProperties(e){this.exportPropertyAsAttribute(e),this.patchHtmlAttributes(e)}exportPropertyAsAttribute(e){for(let o of e){let c={};c.enumerable=!0,c.configurable=!0,delete c.value,delete c.writable,c.set=m=>{Reflect.set(this.mComponent.processor,o,m)},c.get=()=>{let m=Reflect.get(this.mComponent.processor,o);return typeof m=="function"&&(m=m.bind(this.mComponent.processor)),m},Object.defineProperty(this.mComponent.element,o,c)}}patchHtmlAttributes(e){let o=this.mComponent.element.getAttribute;new MutationObserver(m=>{for(let g of m){let y=g.attributeName,E=o.call(this.mComponent.element,y);Reflect.set(this.mComponent.element,y,E),this.mComponent.attributeChanged(y,g.oldValue,E)}}).observe(this.mComponent.element,{attributeFilter:[...e],attributeOldValue:!0});for(let m of e)if(this.mComponent.element.hasAttribute(m)){let g=o.call(this.mComponent.element,m);this.mComponent.element.setAttribute(m,g)}this.mComponent.element.getAttribute=m=>e.has(m)?Reflect.get(this.mComponent.element,m):o.call(this.mComponent.element,m)}}}};function tt(f,t){if(t.static)throw new A("Event target is not for a static property.",tt);let e=at.forInternalDecorator(t.metadata),o=e.getMetadata(ye.METADATA_EXPORTED_PROPERTIES)??new Array;o.push(t.name),e.setMetadata(ye.METADATA_EXPORTED_PROPERTIES,o)}function nt(f){return(t,e)=>{if(e.static)throw new A("Child decorator is not for a static property.",nt);return{get(){let m=(()=>{try{return ct.ofProcessor(this).component}catch{throw new A("PwbChild target class is not a component.",this)}})().getProcessorInjection(Dt).data.store[f];if(m instanceof Element)return m;throw new A(`Can't find child "${f}".`,this)}}}}function Yi(){function f(l,n){return function(a){e(n,"addInitializer"),o(a,"An initializer"),l.push(a)}}function t(l,n,u,a,r,b,v,T,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+n:n,static:b,private:v,metadata:T},d={v:!1};s.addInitializer=f(a,d);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return l(w,s)}finally{d.v=!0}}function e(l,n){if(l.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(l,n){if(typeof l!="function")throw new TypeError(n+" must be a function")}function c(l,n){var u=typeof n;if(l===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var a;throw l===0?a="field":l===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function m(l,n,u,a,r,b,v,T,w){var p=u[0],s,d,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,P;if(typeof p=="function")h=t(p,a,s,T,r,b,v,w,i),h!==void 0&&(c(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,P=h.set||i.set,i={get:x,set:P}):i=h);else for(var C=p.length-1;C>=0;C--){var M=p[C];if(h=t(M,a,s,T,r,b,v,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,P=h.set||i.set,i={get:x,set:P}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(I,D){return D};else if(typeof d!="function"){var F=d;d=function(I,D){for(var R=D,L=0;L<F.length;L++)R=F[L].call(I,R);return R}}else{var $=d;d=function(I,D){return $.call(I,D)}}l.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(l.push(function(I,D){return i.get.call(I,D)}),l.push(function(I,D){return i.set.call(I,D)})):r===2?l.push(i):l.push(function(I,D){return i.call(I,D)}):Object.defineProperty(n,a,s))}function g(l,n,u){for(var a=[],r,b,v=new Map,T=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,P;if(h?(x=l,s=s-5,b=b||[],P=b):(x=l.prototype,r=r||[],P=r),s!==0&&!i){var C=h?T:v,M=C.get(d)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!M&&s>2?C.set(d,s):C.set(d,!0)}m(a,x,p,d,s,h,i,P,u)}}return y(a,r),y(a,b),a}function y(l,n){n&&l.push(function(u){for(var a=0;a<n.length;a++)n[a].call(u);return u})}function E(l,n,u){if(n.length>0){for(var a=[],r=l,b=l.name,v=n.length-1;v>=0;v--){var T={v:!1};try{var w=n[v](r,{kind:"class",name:b,addInitializer:f(a,T),metadata:u})}finally{T.v=!0}w!==void 0&&(c(10,w),r=w)}return[S(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function S(l,n){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,a,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),T=g(n,u,v);return a.length||S(n,v),{e:T,get c(){return E(n,a,v)}}}}function Dr(f,t,e,o){return(Dr=Yi())(f,t,e,o)}var Ir,Tr,Zi;Ir=Nt({instructionType:"dynamic-content"});var Er=class{static{({c:[Zi,Tr]}=Dr(this,[],[Ir]))}constructor(t=O.use(k),e=O.use(H)){this.mModuleValues=e,this.mLastTemplate=null,this.mProcedure=this.mModuleValues.createExpressionProcedure(t.value)}mLastTemplate;mModuleValues;mProcedure;onUpdate(){let t=this.mProcedure.execute();if(!t||!(t instanceof ht))throw new A("Dynamic content method has a wrong result type.",this);if(this.mLastTemplate!==null&&this.mLastTemplate.equals(t))return null;let e=t.clone();this.mLastTemplate=e;let o=new dt;return o.addElement(e,new gt(this.mModuleValues.data)),o}static{Tr()}};function qi(){function f(l,n){return function(a){e(n,"addInitializer"),o(a,"An initializer"),l.push(a)}}function t(l,n,u,a,r,b,v,T,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+n:n,static:b,private:v,metadata:T},d={v:!1};s.addInitializer=f(a,d);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return l(w,s)}finally{d.v=!0}}function e(l,n){if(l.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(l,n){if(typeof l!="function")throw new TypeError(n+" must be a function")}function c(l,n){var u=typeof n;if(l===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var a;throw l===0?a="field":l===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function m(l,n,u,a,r,b,v,T,w){var p=u[0],s,d,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,P;if(typeof p=="function")h=t(p,a,s,T,r,b,v,w,i),h!==void 0&&(c(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,P=h.set||i.set,i={get:x,set:P}):i=h);else for(var C=p.length-1;C>=0;C--){var M=p[C];if(h=t(M,a,s,T,r,b,v,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,P=h.set||i.set,i={get:x,set:P}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(I,D){return D};else if(typeof d!="function"){var F=d;d=function(I,D){for(var R=D,L=0;L<F.length;L++)R=F[L].call(I,R);return R}}else{var $=d;d=function(I,D){return $.call(I,D)}}l.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(l.push(function(I,D){return i.get.call(I,D)}),l.push(function(I,D){return i.set.call(I,D)})):r===2?l.push(i):l.push(function(I,D){return i.call(I,D)}):Object.defineProperty(n,a,s))}function g(l,n,u){for(var a=[],r,b,v=new Map,T=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,P;if(h?(x=l,s=s-5,b=b||[],P=b):(x=l.prototype,r=r||[],P=r),s!==0&&!i){var C=h?T:v,M=C.get(d)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!M&&s>2?C.set(d,s):C.set(d,!0)}m(a,x,p,d,s,h,i,P,u)}}return y(a,r),y(a,b),a}function y(l,n){n&&l.push(function(u){for(var a=0;a<n.length;a++)n[a].call(u);return u})}function E(l,n,u){if(n.length>0){for(var a=[],r=l,b=l.name,v=n.length-1;v>=0;v--){var T={v:!1};try{var w=n[v](r,{kind:"class",name:b,addInitializer:f(a,T),metadata:u})}finally{T.v=!0}w!==void 0&&(c(10,w),r=w)}return[S(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function S(l,n){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,a,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),T=g(n,u,v);return a.length||S(n,v),{e:T,get c(){return E(n,a,v)}}}}function Cr(f,t,e,o){return(Cr=qi())(f,t,e,o)}var Mr,Sr,Ji;Mr=Et({access:X.Write,selector:/^\([[\w\-$]+\)$/});var Pr=class{static{({c:[Ji,Sr]}=Cr(this,[],[Mr]))}constructor(t=O.use(q),e=O.use(H),o=O.use(ot)){this.mTarget=t,this.mEventName=o.name.substring(1,o.name.length-1);let c=e.createExpressionProcedure(o.value,["$event"]);this.mListener=m=>{c.setTemporaryValue("$event",m),c.execute()},this.mTarget.addEventListener(this.mEventName,this.mListener)}mEventName;mListener;mTarget;onDeconstruct(){this.mTarget.removeEventListener(this.mEventName,this.mListener)}static{Sr()}};function Ki(){function f(l,n){return function(a){e(n,"addInitializer"),o(a,"An initializer"),l.push(a)}}function t(l,n,u,a,r,b,v,T,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+n:n,static:b,private:v,metadata:T},d={v:!1};s.addInitializer=f(a,d);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return l(w,s)}finally{d.v=!0}}function e(l,n){if(l.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(l,n){if(typeof l!="function")throw new TypeError(n+" must be a function")}function c(l,n){var u=typeof n;if(l===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var a;throw l===0?a="field":l===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function m(l,n,u,a,r,b,v,T,w){var p=u[0],s,d,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,P;if(typeof p=="function")h=t(p,a,s,T,r,b,v,w,i),h!==void 0&&(c(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,P=h.set||i.set,i={get:x,set:P}):i=h);else for(var C=p.length-1;C>=0;C--){var M=p[C];if(h=t(M,a,s,T,r,b,v,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,P=h.set||i.set,i={get:x,set:P}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(I,D){return D};else if(typeof d!="function"){var F=d;d=function(I,D){for(var R=D,L=0;L<F.length;L++)R=F[L].call(I,R);return R}}else{var $=d;d=function(I,D){return $.call(I,D)}}l.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(l.push(function(I,D){return i.get.call(I,D)}),l.push(function(I,D){return i.set.call(I,D)})):r===2?l.push(i):l.push(function(I,D){return i.call(I,D)}):Object.defineProperty(n,a,s))}function g(l,n,u){for(var a=[],r,b,v=new Map,T=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,P;if(h?(x=l,s=s-5,b=b||[],P=b):(x=l.prototype,r=r||[],P=r),s!==0&&!i){var C=h?T:v,M=C.get(d)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!M&&s>2?C.set(d,s):C.set(d,!0)}m(a,x,p,d,s,h,i,P,u)}}return y(a,r),y(a,b),a}function y(l,n){n&&l.push(function(u){for(var a=0;a<n.length;a++)n[a].call(u);return u})}function E(l,n,u){if(n.length>0){for(var a=[],r=l,b=l.name,v=n.length-1;v>=0;v--){var T={v:!1};try{var w=n[v](r,{kind:"class",name:b,addInitializer:f(a,T),metadata:u})}finally{T.v=!0}w!==void 0&&(c(10,w),r=w)}return[S(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function S(l,n){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,a,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),T=g(n,u,v);return a.length||S(n,v),{e:T,get c(){return E(n,a,v)}}}}function Rr(f,t,e,o){return(Rr=Ki())(f,t,e,o)}var Lr,Nr,Qi;Lr=Nt({instructionType:"for"});var Ar=class{static{({c:[Qi,Nr]}=Rr(this,[],[Lr]))}constructor(t=O.use(vt),e=O.use(H),o=O.use(k)){this.mTemplate=t,this.mModuleValues=e,this.mLastEntries=new Array;let c=o.value,g=new RegExp(/^\s*([a-zA-Z]+[a-zA-Z0-9]*)\s*of\s+([^;]+)\s*(;\s*([a-zA-Z]+[a-zA-Z0-9]*)\s*=\s*(.*)\s*)?$/).exec(c);if(!g)throw new A(`For-Parameter value has wrong format: ${c}`,this);let y=g[1],E=g[2],S=g[4]??null,l=g[5],n=this.mModuleValues.createExpressionProcedure(E),u=S?this.mModuleValues.createExpressionProcedure(l,["$index",y]):null;this.mExpression={iterateVariableName:y,iterateValueProcedure:n,indexExportVariableName:S,indexExportProcedure:u}}mExpression;mLastEntries;mModuleValues;mTemplate;onUpdate(){let t=new dt,e=this.mExpression.iterateValueProcedure.execute();if(typeof e=="object"&&e!==null||Array.isArray(e)){let o=Symbol.iterator in e?Object.entries([...e]):Object.entries(e);if(this.compareEntries(o,this.mLastEntries))return null;this.mLastEntries=o;for(let[c,m]of o)this.addTemplateForElement(t,this.mExpression,m,c);return t}else return null}addTemplateForElement=(t,e,o,c)=>{let m=new gt(this.mModuleValues.data);if(m.setTemporaryValue(e.iterateVariableName,o),e.indexExportProcedure&&e.indexExportVariableName){e.indexExportProcedure.setTemporaryValue("$index",c),e.indexExportProcedure.setTemporaryValue(e.iterateVariableName,o);let y=e.indexExportProcedure.execute();m.setTemporaryValue(e.indexExportVariableName,y)}let g=new ht;g.appendChild(...this.mTemplate.childList),t.addElement(g,m)};compareEntries(t,e){if(t.length!==e.length)return!1;for(let o=0;o<t.length;o++){let[c,m]=t[o],[g,y]=e[o];if(c!==g||m!==y)return!1}return!0}static{Nr()}};function ki(){function f(l,n){return function(a){e(n,"addInitializer"),o(a,"An initializer"),l.push(a)}}function t(l,n,u,a,r,b,v,T,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+n:n,static:b,private:v,metadata:T},d={v:!1};s.addInitializer=f(a,d);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return l(w,s)}finally{d.v=!0}}function e(l,n){if(l.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(l,n){if(typeof l!="function")throw new TypeError(n+" must be a function")}function c(l,n){var u=typeof n;if(l===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var a;throw l===0?a="field":l===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function m(l,n,u,a,r,b,v,T,w){var p=u[0],s,d,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,P;if(typeof p=="function")h=t(p,a,s,T,r,b,v,w,i),h!==void 0&&(c(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,P=h.set||i.set,i={get:x,set:P}):i=h);else for(var C=p.length-1;C>=0;C--){var M=p[C];if(h=t(M,a,s,T,r,b,v,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,P=h.set||i.set,i={get:x,set:P}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(I,D){return D};else if(typeof d!="function"){var F=d;d=function(I,D){for(var R=D,L=0;L<F.length;L++)R=F[L].call(I,R);return R}}else{var $=d;d=function(I,D){return $.call(I,D)}}l.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(l.push(function(I,D){return i.get.call(I,D)}),l.push(function(I,D){return i.set.call(I,D)})):r===2?l.push(i):l.push(function(I,D){return i.call(I,D)}):Object.defineProperty(n,a,s))}function g(l,n,u){for(var a=[],r,b,v=new Map,T=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,P;if(h?(x=l,s=s-5,b=b||[],P=b):(x=l.prototype,r=r||[],P=r),s!==0&&!i){var C=h?T:v,M=C.get(d)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!M&&s>2?C.set(d,s):C.set(d,!0)}m(a,x,p,d,s,h,i,P,u)}}return y(a,r),y(a,b),a}function y(l,n){n&&l.push(function(u){for(var a=0;a<n.length;a++)n[a].call(u);return u})}function E(l,n,u){if(n.length>0){for(var a=[],r=l,b=l.name,v=n.length-1;v>=0;v--){var T={v:!1};try{var w=n[v](r,{kind:"class",name:b,addInitializer:f(a,T),metadata:u})}finally{T.v=!0}w!==void 0&&(c(10,w),r=w)}return[S(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function S(l,n){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,a,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),T=g(n,u,v);return a.length||S(n,v),{e:T,get c(){return E(n,a,v)}}}}function Fr(f,t,e,o){return(Fr=ki())(f,t,e,o)}var jr,Or,ts;jr=Nt({instructionType:"if"});var _r=class{static{({c:[ts,Or]}=Fr(this,[],[jr]))}constructor(t=O.use(vt),e=O.use(H),o=O.use(k)){this.mTemplateReference=t,this.mModuleValues=e,this.mProcedure=this.mModuleValues.createExpressionProcedure(o.value),this.mLastBoolean=!1}mLastBoolean;mModuleValues;mProcedure;mTemplateReference;onUpdate(){let t=this.mProcedure.execute();if(!!t!==this.mLastBoolean){this.mLastBoolean=!!t;let e=new dt;if(t){let o=new ht;o.appendChild(...this.mTemplateReference.childList),e.addElement(o,new gt(this.mModuleValues.data))}return e}else return null}static{Or()}};function es(){function f(l,n){return function(a){e(n,"addInitializer"),o(a,"An initializer"),l.push(a)}}function t(l,n,u,a,r,b,v,T,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+n:n,static:b,private:v,metadata:T},d={v:!1};s.addInitializer=f(a,d);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return l(w,s)}finally{d.v=!0}}function e(l,n){if(l.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(l,n){if(typeof l!="function")throw new TypeError(n+" must be a function")}function c(l,n){var u=typeof n;if(l===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var a;throw l===0?a="field":l===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function m(l,n,u,a,r,b,v,T,w){var p=u[0],s,d,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,P;if(typeof p=="function")h=t(p,a,s,T,r,b,v,w,i),h!==void 0&&(c(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,P=h.set||i.set,i={get:x,set:P}):i=h);else for(var C=p.length-1;C>=0;C--){var M=p[C];if(h=t(M,a,s,T,r,b,v,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,P=h.set||i.set,i={get:x,set:P}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(I,D){return D};else if(typeof d!="function"){var F=d;d=function(I,D){for(var R=D,L=0;L<F.length;L++)R=F[L].call(I,R);return R}}else{var $=d;d=function(I,D){return $.call(I,D)}}l.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(l.push(function(I,D){return i.get.call(I,D)}),l.push(function(I,D){return i.set.call(I,D)})):r===2?l.push(i):l.push(function(I,D){return i.call(I,D)}):Object.defineProperty(n,a,s))}function g(l,n,u){for(var a=[],r,b,v=new Map,T=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,P;if(h?(x=l,s=s-5,b=b||[],P=b):(x=l.prototype,r=r||[],P=r),s!==0&&!i){var C=h?T:v,M=C.get(d)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!M&&s>2?C.set(d,s):C.set(d,!0)}m(a,x,p,d,s,h,i,P,u)}}return y(a,r),y(a,b),a}function y(l,n){n&&l.push(function(u){for(var a=0;a<n.length;a++)n[a].call(u);return u})}function E(l,n,u){if(n.length>0){for(var a=[],r=l,b=l.name,v=n.length-1;v>=0;v--){var T={v:!1};try{var w=n[v](r,{kind:"class",name:b,addInitializer:f(a,T),metadata:u})}finally{T.v=!0}w!==void 0&&(c(10,w),r=w)}return[S(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function S(l,n){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,a,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),T=g(n,u,v);return a.length||S(n,v),{e:T,get c(){return E(n,a,v)}}}}function zr(f,t,e,o){return(zr=es())(f,t,e,o)}var Br,$r,rs;Br=Et({access:X.Read,selector:/^\[[\w$]+\]$/});var Vr=class{static{({c:[rs,$r]}=zr(this,[],[Br]))}constructor(t=O.use(q),e=O.use(H),o=O.use(ot)){this.mTarget=t,this.mProcedure=e.createExpressionProcedure(o.value),this.mTargetProperty=o.name.substring(1,o.name.length-1),this.mLastValue=Symbol("Uncomparable")}mLastValue;mProcedure;mTarget;mTargetProperty;onUpdate(){let t=this.mProcedure.execute();return t===this.mLastValue?!1:(this.mLastValue=t,Reflect.set(this.mTarget,this.mTargetProperty,t),!0)}static{$r()}};function os(){function f(l,n){return function(a){e(n,"addInitializer"),o(a,"An initializer"),l.push(a)}}function t(l,n,u,a,r,b,v,T,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+n:n,static:b,private:v,metadata:T},d={v:!1};s.addInitializer=f(a,d);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return l(w,s)}finally{d.v=!0}}function e(l,n){if(l.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(l,n){if(typeof l!="function")throw new TypeError(n+" must be a function")}function c(l,n){var u=typeof n;if(l===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var a;throw l===0?a="field":l===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function m(l,n,u,a,r,b,v,T,w){var p=u[0],s,d,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,P;if(typeof p=="function")h=t(p,a,s,T,r,b,v,w,i),h!==void 0&&(c(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,P=h.set||i.set,i={get:x,set:P}):i=h);else for(var C=p.length-1;C>=0;C--){var M=p[C];if(h=t(M,a,s,T,r,b,v,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,P=h.set||i.set,i={get:x,set:P}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(I,D){return D};else if(typeof d!="function"){var F=d;d=function(I,D){for(var R=D,L=0;L<F.length;L++)R=F[L].call(I,R);return R}}else{var $=d;d=function(I,D){return $.call(I,D)}}l.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(l.push(function(I,D){return i.get.call(I,D)}),l.push(function(I,D){return i.set.call(I,D)})):r===2?l.push(i):l.push(function(I,D){return i.call(I,D)}):Object.defineProperty(n,a,s))}function g(l,n,u){for(var a=[],r,b,v=new Map,T=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,P;if(h?(x=l,s=s-5,b=b||[],P=b):(x=l.prototype,r=r||[],P=r),s!==0&&!i){var C=h?T:v,M=C.get(d)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!M&&s>2?C.set(d,s):C.set(d,!0)}m(a,x,p,d,s,h,i,P,u)}}return y(a,r),y(a,b),a}function y(l,n){n&&l.push(function(u){for(var a=0;a<n.length;a++)n[a].call(u);return u})}function E(l,n,u){if(n.length>0){for(var a=[],r=l,b=l.name,v=n.length-1;v>=0;v--){var T={v:!1};try{var w=n[v](r,{kind:"class",name:b,addInitializer:f(a,T),metadata:u})}finally{T.v=!0}w!==void 0&&(c(10,w),r=w)}return[S(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function S(l,n){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,a,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),T=g(n,u,v);return a.length||S(n,v),{e:T,get c(){return E(n,a,v)}}}}function Hr(f,t,e,o){return(Hr=os())(f,t,e,o)}var Xr,Gr,ns;Xr=Et({access:X.Write,selector:/^#[[\w$]+$/});var Ur=class{static{({c:[ns,Gr]}=Hr(this,[],[Xr]))}constructor(t=O.use(q),e=O.use(ot),o=O.use(Dt)){o.setTemporaryValue(e.name.substring(1),t)}static{Gr()}};function is(){function f(l,n){return function(a){e(n,"addInitializer"),o(a,"An initializer"),l.push(a)}}function t(l,n,u,a,r,b,v,T,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+n:n,static:b,private:v,metadata:T},d={v:!1};s.addInitializer=f(a,d);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return l(w,s)}finally{d.v=!0}}function e(l,n){if(l.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(l,n){if(typeof l!="function")throw new TypeError(n+" must be a function")}function c(l,n){var u=typeof n;if(l===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var a;throw l===0?a="field":l===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function m(l,n,u,a,r,b,v,T,w){var p=u[0],s,d,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,P;if(typeof p=="function")h=t(p,a,s,T,r,b,v,w,i),h!==void 0&&(c(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,P=h.set||i.set,i={get:x,set:P}):i=h);else for(var C=p.length-1;C>=0;C--){var M=p[C];if(h=t(M,a,s,T,r,b,v,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,P=h.set||i.set,i={get:x,set:P}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(I,D){return D};else if(typeof d!="function"){var F=d;d=function(I,D){for(var R=D,L=0;L<F.length;L++)R=F[L].call(I,R);return R}}else{var $=d;d=function(I,D){return $.call(I,D)}}l.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(l.push(function(I,D){return i.get.call(I,D)}),l.push(function(I,D){return i.set.call(I,D)})):r===2?l.push(i):l.push(function(I,D){return i.call(I,D)}):Object.defineProperty(n,a,s))}function g(l,n,u){for(var a=[],r,b,v=new Map,T=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,P;if(h?(x=l,s=s-5,b=b||[],P=b):(x=l.prototype,r=r||[],P=r),s!==0&&!i){var C=h?T:v,M=C.get(d)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!M&&s>2?C.set(d,s):C.set(d,!0)}m(a,x,p,d,s,h,i,P,u)}}return y(a,r),y(a,b),a}function y(l,n){n&&l.push(function(u){for(var a=0;a<n.length;a++)n[a].call(u);return u})}function E(l,n,u){if(n.length>0){for(var a=[],r=l,b=l.name,v=n.length-1;v>=0;v--){var T={v:!1};try{var w=n[v](r,{kind:"class",name:b,addInitializer:f(a,T),metadata:u})}finally{T.v=!0}w!==void 0&&(c(10,w),r=w)}return[S(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function S(l,n){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,a,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),T=g(n,u,v);return a.length||S(n,v),{e:T,get c(){return E(n,a,v)}}}}function Zr(f,t,e,o){return(Zr=is())(f,t,e,o)}var qr,Wr,ss;qr=Nt({instructionType:"slot"});var Yr=class{static{({c:[ss,Wr]}=Zr(this,[],[qr]))}constructor(t=O.use(H),e=O.use(k)){this.mModuleValues=t,this.mSlotName=e.value,this.mIsSetup=!1}mIsSetup;mModuleValues;mSlotName;onUpdate(){if(this.mIsSetup)return null;this.mIsSetup=!0;let t=new Mt("slot");this.mSlotName!==""&&t.setAttribute("name").addValue(this.mSlotName);let e=new ht;e.appendChild(t);let o=new dt;return o.addElement(e,this.mModuleValues.data),o}static{Wr()}};function as(){function f(l,n){return function(a){e(n,"addInitializer"),o(a,"An initializer"),l.push(a)}}function t(l,n,u,a,r,b,v,T,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+n:n,static:b,private:v,metadata:T},d={v:!1};s.addInitializer=f(a,d);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return l(w,s)}finally{d.v=!0}}function e(l,n){if(l.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(l,n){if(typeof l!="function")throw new TypeError(n+" must be a function")}function c(l,n){var u=typeof n;if(l===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var a;throw l===0?a="field":l===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function m(l,n,u,a,r,b,v,T,w){var p=u[0],s,d,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,P;if(typeof p=="function")h=t(p,a,s,T,r,b,v,w,i),h!==void 0&&(c(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,P=h.set||i.set,i={get:x,set:P}):i=h);else for(var C=p.length-1;C>=0;C--){var M=p[C];if(h=t(M,a,s,T,r,b,v,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,P=h.set||i.set,i={get:x,set:P}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(I,D){return D};else if(typeof d!="function"){var F=d;d=function(I,D){for(var R=D,L=0;L<F.length;L++)R=F[L].call(I,R);return R}}else{var $=d;d=function(I,D){return $.call(I,D)}}l.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(l.push(function(I,D){return i.get.call(I,D)}),l.push(function(I,D){return i.set.call(I,D)})):r===2?l.push(i):l.push(function(I,D){return i.call(I,D)}):Object.defineProperty(n,a,s))}function g(l,n,u){for(var a=[],r,b,v=new Map,T=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,P;if(h?(x=l,s=s-5,b=b||[],P=b):(x=l.prototype,r=r||[],P=r),s!==0&&!i){var C=h?T:v,M=C.get(d)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!M&&s>2?C.set(d,s):C.set(d,!0)}m(a,x,p,d,s,h,i,P,u)}}return y(a,r),y(a,b),a}function y(l,n){n&&l.push(function(u){for(var a=0;a<n.length;a++)n[a].call(u);return u})}function E(l,n,u){if(n.length>0){for(var a=[],r=l,b=l.name,v=n.length-1;v>=0;v--){var T={v:!1};try{var w=n[v](r,{kind:"class",name:b,addInitializer:f(a,T),metadata:u})}finally{T.v=!0}w!==void 0&&(c(10,w),r=w)}return[S(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function S(l,n){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,a,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),T=g(n,u,v);return a.length||S(n,v),{e:T,get c(){return E(n,a,v)}}}}function Qr(f,t,e,o){return(Qr=as())(f,t,e,o)}var kr,Jr,ls;kr=Et({access:X.ReadWrite,selector:/^\[\([[\w$]+\)\]$/});var Kr=class{static{({c:[ls,Jr]}=Qr(this,[],[kr]))}constructor(t=O.use(z),e=O.use(q),o=O.use(H),c=O.use(ot)){this.mTargetNode=e,this.mAttributeKey=c.name.substring(2,c.name.length-2),this.mReadProcedure=o.createExpressionProcedure(c.value),this.mWriteProcedure=o.createExpressionProcedure(`${c.value} = $DATA;`,["$DATA"]),this.mLastDataValue=Symbol("Uncomparable");let m=g=>{this.mLastDataValue!==g&&t.updater.updateAsync()};this.mTargetNode.addEventListener("input",g=>{m(Reflect.get(this.mTargetNode,this.mAttributeKey))}),this.mTargetNode.addEventListener("change",g=>{m(Reflect.get(this.mTargetNode,this.mAttributeKey))})}mAttributeKey;mLastDataValue;mReadProcedure;mTargetNode;mWriteProcedure;onUpdate(){let t=this.mReadProcedure.execute();if(t!==this.mLastDataValue)return Reflect.set(this.mTargetNode,this.mAttributeKey,t),this.mLastDataValue=t,!0;let e=Reflect.get(this.mTargetNode,this.mAttributeKey);return e!==t?(this.mWriteProcedure.setTemporaryValue("$DATA",e),this.mWriteProcedure.execute(),this.mLastDataValue=e,!0):!1}static{Jr()}};function cs(){function f(l,n){return function(a){e(n,"addInitializer"),o(a,"An initializer"),l.push(a)}}function t(l,n,u,a,r,b,v,T,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+n:n,static:b,private:v,metadata:T},d={v:!1};s.addInitializer=f(a,d);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return l(w,s)}finally{d.v=!0}}function e(l,n){if(l.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(l,n){if(typeof l!="function")throw new TypeError(n+" must be a function")}function c(l,n){var u=typeof n;if(l===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var a;throw l===0?a="field":l===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function m(l,n,u,a,r,b,v,T,w){var p=u[0],s,d,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,P;if(typeof p=="function")h=t(p,a,s,T,r,b,v,w,i),h!==void 0&&(c(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,P=h.set||i.set,i={get:x,set:P}):i=h);else for(var C=p.length-1;C>=0;C--){var M=p[C];if(h=t(M,a,s,T,r,b,v,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,P=h.set||i.set,i={get:x,set:P}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(I,D){return D};else if(typeof d!="function"){var F=d;d=function(I,D){for(var R=D,L=0;L<F.length;L++)R=F[L].call(I,R);return R}}else{var $=d;d=function(I,D){return $.call(I,D)}}l.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(l.push(function(I,D){return i.get.call(I,D)}),l.push(function(I,D){return i.set.call(I,D)})):r===2?l.push(i):l.push(function(I,D){return i.call(I,D)}):Object.defineProperty(n,a,s))}function g(l,n,u){for(var a=[],r,b,v=new Map,T=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,P;if(h?(x=l,s=s-5,b=b||[],P=b):(x=l.prototype,r=r||[],P=r),s!==0&&!i){var C=h?T:v,M=C.get(d)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!M&&s>2?C.set(d,s):C.set(d,!0)}m(a,x,p,d,s,h,i,P,u)}}return y(a,r),y(a,b),a}function y(l,n){n&&l.push(function(u){for(var a=0;a<n.length;a++)n[a].call(u);return u})}function E(l,n,u){if(n.length>0){for(var a=[],r=l,b=l.name,v=n.length-1;v>=0;v--){var T={v:!1};try{var w=n[v](r,{kind:"class",name:b,addInitializer:f(a,T),metadata:u})}finally{T.v=!0}w!==void 0&&(c(10,w),r=w)}return[S(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function S(l,n){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,a,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),T=g(n,u,v);return a.length||S(n,v),{e:T,get c(){return E(n,a,v)}}}}function ro(f,t,e,o){return(ro=cs())(f,t,e,o)}var oo,to,us;oo=Wt({access:X.Read,targetRestrictions:[Tt]});var eo=class{static{({c:[us,to]}=ro(this,[],[oo]))}constructor(t=O.use(Tt),e=O.use(q)){let o=new Array,c=t.processorConstructor;do{let m=at.get(c).getMetadata(fe.METADATA_USER_EVENT_LISTENER_PROPERIES);if(m)for(let g of m)o.push(g)}while(c=Object.getPrototypeOf(c));this.mEventListenerList=new Array,this.mTargetElement=e;for(let m of o){let[g,y]=m,E=Reflect.get(t.processor,g);E=E.bind(t.processor),this.mEventListenerList.push([y,E]),this.mTargetElement.addEventListener(y,E)}}mEventListenerList;mTargetElement;onDeconstruct(){for(let t of this.mEventListenerList){let[e,o]=t;this.mTargetElement.removeEventListener(e,o)}}static{to()}};var kt=class{mCodeGenerator;mId;mLabel;mNodesProvider;mStatics;get codeGenerator(){return this.mCodeGenerator}get id(){return this.mId}get label(){return this.mLabel}get statics(){return this.mStatics}constructor(t){this.mId=t.id,this.mLabel=t.label,this.mNodesProvider=t.nodes,this.mStatics=t.statics,this.mCodeGenerator=t.generator.code}getNodeDefinitions(t){let e=c=>{if(!c)return new Array;let m=new Array;return c(g=>{m.push(g)},t),m},o={};return Object.defineProperty(o,"entry",{get:()=>e(this.mNodesProvider.entry)}),Object.defineProperty(o,"exit",{get:()=>e(this.mNodesProvider.exit)}),Object.defineProperty(o,"dynamic",{get:()=>e(this.mNodesProvider.dynamic)}),o}},it={none:0,imports:1,inputs:2,outputs:4};var Z=class f{static GRID_SIZE=25;mElementPorts;mHitElementPorts;mPortElements;mPortHitElements;get gridSize(){return f.GRID_SIZE}constructor(){this.mElementPorts=new WeakMap,this.mHitElementPorts=new WeakMap,this.mPortElements=new WeakMap,this.mPortHitElements=new WeakMap}getPortElement(t){let e=this.mPortElements.get(t);if(!(!e||this.mElementPorts.get(e)!==t))return e}getPortFromPosition(t,e){for(let o of document.elementsFromPoint(t,e)){if(!(o instanceof HTMLElement))continue;let c=this.mHitElementPorts.get(o);if(c&&this.mPortHitElements.get(c)===o)return c;let m=this.mElementPorts.get(o);if(m&&this.mPortElements.get(m)===o)return m}return null}registerPortElement(t,e,o){this.mElementPorts.set(e,t),this.mPortElements.set(t,e),o&&(this.mHitElementPorts.set(o,t),this.mPortHitElements.set(t,o))}};var Oe=class{mManager;mDocument;get document(){return this.mDocument}constructor(t){this.mManager=t,this.mDocument=null}setDocument(t){this.mDocument=t,this.mDocument.validate(),this.mManager.dispatch(_.Document,this.mDocument),this.setDefaultActiveFunction()}removeFunction(t){let e=this.mDocument;if(!e)return;let o=null;for(let c of e.functions)if(c.id===t){o=c,e.removeFunction(c);break}o&&(this.mManager.dispatch(_.FunctionDelete,o),this.setDefaultActiveFunction())}transformNode(t,e){let o={x:t.transformation.x,y:t.transformation.y,width:t.transformation.width,height:t.transformation.height,...e};t.moveTo(o.x,o.y),t.resizeTo(o.width,o.height),this.mManager.dispatch(_.NodeTransform,t)}addFunction(t){let e=this.mDocument,o=this.mManager.project;if(!e||!o||!o.userFunctions.has(t))return;let c=new yt(o,e,{definitionId:t,id:crypto.randomUUID(),isSystem:!1,label:`Function ${e.functions.size}`});e.addFunction(c),e.validate(),this.mManager.dispatch(_.FunctionAdd,c),this.mManager.setActiveFunction(c.id)}addNode(t,e,o){let c=t.addNodeByDefinition(e,o);return this.mManager.dispatch(_.NodeAdd,c),c}removeNode(t){t.function.removeNode(t),this.mManager.dispatch(_.NodeDelete,t)}connectPorts(t,e){try{t.connect(e)}catch(o){return console.error("[PotatnoCodeUiManager] Connection failed:",o),!1}return this.mManager.dispatch(_.ConnectionAdd,t),this.mManager.dispatch(_.ConnectionAdd,e),!0}disconnectPorts(t,e){t.disconnect(e),this.mManager.dispatch(_.ConnectionDelete,t),this.mManager.dispatch(_.ConnectionDelete,e)}setPortDirectValue(t,e){t.setDirectValue(e),this.mManager.dispatch(_.NodeUpdate,t)}updateNode(t,e){t&&(e(t),this.mManager.dispatch(_.NodeUpdate,t))}setDefaultActiveFunction(){if(!this.mDocument||this.mDocument.functions.size===0)return;let t=(()=>{let e=[...this.mDocument.functions];return e.some(c=>c.id===this.mManager.activeFunctionId)?this.mManager.activeFunctionId:e[0].id})();this.mManager.activeFunctionId!==t&&this.mManager.setActiveFunction(t)}};var _e=class{mProject;constructor(t){this.mProject=t}deserialize(t){let e=new Lt(this.mProject);for(let o of t.functions)e.addFunction(this.deserializeFunction(o,e));return e}deserializeFunction(t,e){let o=new yt(this.mProject,e,{definitionId:t.definitionId,id:t.id,label:t.label,isSystem:t.isSystem});for(let m of t.imports)o.addImport(m);for(let m of t.inputs)o.addInput({label:m.label,dataType:m.dataType});for(let m of t.outputs)o.addOutput({label:m.label,dataType:m.dataType});let c=new Map;for(let m of t.nodes)c.set(m.id,this.deserializeNode(m,o,e));for(let m of t.connections){if(!c.has(m.sourceNodeId)||!c.has(m.targetNodeId))continue;let g=c.get(m.sourceNodeId),y=c.get(m.targetNodeId),E=g.outputs.map.get(m.sourcePortId),S=y.inputs.map.get(m.targetPortId);!E||!S||E.connect(S)}return o}deserializeNode(t,e,o){let c=o.nodeDefinitions.find(g=>g.id===t.definitionId),m=(()=>{if(c)return e.addNodeByDefinition(c,t.transformation);let g=t.ports.filter(E=>E.direction==="input").map(E=>({dataType:E.dataType,definitionId:E.definitionId,label:E.label,portType:E.portType})),y=t.ports.filter(E=>E.direction==="output").map(E=>({dataType:E.dataType,definitionId:E.definitionId,label:E.label,portType:E.portType}));return new wt(this.mProject,o,e,{category:t.category,definitionId:t.definitionId,ports:{input:g,output:y},label:t.label,transformation:{...t.transformation}})})();m.label=t.label,e.addNode(m);for(let g of t.ports)if(g.portType==="value"&&g.directValue.length>0){let y=m.inputs.map.get(g.definitionId);y&&y.setDirectValue(g.directValue)}return m.preview=t.preview??null,m}};var Fe=class{constructor(){}serialize(t){return{functions:[...t.functions].map(e=>this.serializeFunction(e))}}serializeFunction(t){let e=new Map;[...t.nodes].forEach((y,E)=>{e.set(y,`n${E}`)});let o=[...t.nodes].map(y=>this.serializeNode(y,e.get(y))),c=[];for(let y of t.nodes){let E=e.get(y);for(let S of y.outputs.list)for(let l of S.connectedPorts){let n=e.get(l.node);c.push({sourceNodeId:E,sourcePortId:S.definitionId,targetNodeId:n,targetPortId:l.definitionId})}}let m=t.inputs.map(y=>({label:y.label,dataType:y.dataType})),g=t.outputs.map(y=>({label:y.label,dataType:y.dataType}));return{id:t.id,label:t.label,isSystem:t.isSystem,definitionId:t.definitionId,inputs:m,outputs:g,imports:[...t.imports],nodes:o,connections:c}}serializeNode(t,e){let o=[...t.inputs.list,...t.outputs.list].map(m=>({definitionId:m.definitionId,label:m.label,direction:m.direction,portType:m.portType,dataType:m.portType==="value"?m.dataType:null,directValue:[...m.directValue]})),c=t.preview?structuredClone(t.preview):null;return{id:e,definitionId:t.definitionId,category:t.category,label:t.label,transformation:{...t.transformation},ports:o,preview:c}}};var je=class f{static MAX_HISTORY_ITEMS=100;mManager;mSnapshots;mSnapshotIndex;get canRedo(){return this.mSnapshotIndex<this.mSnapshots.length-1}get canUndo(){return this.mSnapshotIndex>0}constructor(t){this.mManager=t,this.mSnapshotIndex=-1,this.mSnapshots=new Array;let e=0;this.mManager.subscribe(_.Any,null,()=>{globalThis.clearTimeout(e),e=globalThis.setTimeout(()=>{this.pushHistory()},1e3)})}undo(){if(!this.canUndo)return;let t=this.mSnapshots[--this.mSnapshotIndex],e=JSON.parse(t);this.restoreHistory(e)}redo(){if(!this.canRedo)return;let t=this.mSnapshots[++this.mSnapshotIndex],e=JSON.parse(t);this.restoreHistory(e)}clear(){this.mSnapshots.length=0,this.mSnapshotIndex=-1}pushHistory(){let t=this.mManager.graph.document;if(!t)return;this.mSnapshots.splice(this.mSnapshotIndex+1);let e=new Fe().serialize(t),o=JSON.stringify(e);this.mSnapshots.length>0&&this.mSnapshots.at(-1)===o||(this.mSnapshotIndex=this.mSnapshots.push(o)-1,this.mSnapshots.length>f.MAX_HISTORY_ITEMS&&(this.mSnapshots.shift(),this.mSnapshotIndex--))}restoreHistory(t){let e=this.mManager.project;e&&this.mManager.graph.setDocument(new _e(e).deserialize(t))}};var $e=class{mErrorList;mErrorItems;mIsDirty;mManager;get errors(){return this.mIsDirty&&this.revalidate(),this.mErrorList}get errorItems(){return this.mIsDirty&&this.revalidate(),this.mErrorItems}get isValid(){return this.mIsDirty&&this.revalidate(),this.mErrorItems.size===0}constructor(t){this.mManager=t,this.mErrorList=new Array,this.mErrorItems=new Set,this.mIsDirty=!0;let e=0;this.mManager.subscribe(_.Any,null,()=>{this.mIsDirty=!0,globalThis.clearTimeout(e),e=globalThis.setTimeout(()=>{this.mIsDirty&&(this.revalidate(),this.mIsDirty=!1)},1e3)})}revalidate(){if(!this.mManager.graph.document)return;this.mErrorList.splice(0,this.mErrorList.length),this.mErrorItems.clear();let t=this.mManager.graph.document.validate();for(let e of t.errors)switch(this.mErrorItems.add(e.item),!0){case e.item instanceof ft:{this.mErrorList.push({location:`Node "${e.item.node.label}"`,message:e.message});break}case e.item instanceof wt:{this.mErrorList.push({location:`Node "${e.item.label}"`,message:e.message});break}}for(let e of t.affectedItems)switch(!0){case e instanceof ft:{this.mManager.dispatch(_.PortAdd|_.PortUpdate|_.PortDelete,e);break}case e instanceof wt:{this.mManager.dispatch(_.NodeAdd|_.NodeUpdate|_.NodeDelete,e);break}case e instanceof yt:{this.mManager.dispatch(_.FunctionAdd|_.FunctionUpdate|_.FunctionDelete,e);break}}}};var Ve=class{mDriverList;mElementDriver;mDriverElements;mDriverActivity;mDrivers;mManager;mPreviewIntersection;constructor(t){this.mManager=t,this.mDriverList=new Array,this.mDrivers=new WeakMap,this.mDriverActivity=new WeakMap,this.mDriverElements=new WeakMap,this.mElementDriver=new WeakMap,this.mManager.subscribe(_.Document,null,()=>{this.mDriverList.splice(0,this.mDriverList.length)});let e=0,o=_.Connection|_.Function|_.Node;this.mManager.subscribe(o,null,()=>{globalThis.clearTimeout(e),e=globalThis.setTimeout(()=>this.refresh(),1e3)}),this.mPreviewIntersection=new IntersectionObserver(c=>{for(let m of c){let g=this.mElementDriver.get(m.target);if(!g)continue;let y=g.deref();y&&this.mDriverActivity.set(y,m.isIntersecting)}})}async execute(){let t=this.mDriverList.map(async e=>{let o=e.deref();if(o&&this.mDriverActivity.get(o))try{await o.execute()}catch(c){console.error("[PotatnoUiManagerPreview] Driver render failed:",c)}});await Promise.all(t)}refresh(){if(this.mManager.integrity.isValid)for(let t=this.mDriverList.length-1;t>=0;t--){let e=this.mDriverList[t].deref();if(!e){this.unregister(this.mDriverList[t]);continue}e.refresh()}}unregister(t){let e=this.mDriverList.indexOf(t);if(e===-1)return;this.mDriverList.splice(e,1);let o=this.mDriverElements.get(t);o&&this.mPreviewIntersection.unobserve(o)}register(t,e){this.mDrivers.set(t,e);let o=new WeakRef(e);this.mDriverList.push(o);let c=e.element;this.mDriverElements.set(o,c),this.mElementDriver.set(c,o),this.mPreviewIntersection.observe(c)}requestDriver(t,e){let o=this.mDrivers.get(t);if(o&&o.display.id===e)return o;if(!this.mManager.project)return null;let c=this.mManager.project.preview.getDisplay(e);if(!c)throw new A(`Preview has no display for "${e}".`,this);let m=c.createDriver(t);return this.register(t,m),this.mManager.integrity.isValid&&m.refresh(),m}};function hs(){function f(l,n){return function(a){e(n,"addInitializer"),o(a,"An initializer"),l.push(a)}}function t(l,n,u,a,r,b,v,T,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+n:n,static:b,private:v,metadata:T},d={v:!1};s.addInitializer=f(a,d);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return l(w,s)}finally{d.v=!0}}function e(l,n){if(l.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(l,n){if(typeof l!="function")throw new TypeError(n+" must be a function")}function c(l,n){var u=typeof n;if(l===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var a;throw l===0?a="field":l===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function m(l,n,u,a,r,b,v,T,w){var p=u[0],s,d,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,P;if(typeof p=="function")h=t(p,a,s,T,r,b,v,w,i),h!==void 0&&(c(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,P=h.set||i.set,i={get:x,set:P}):i=h);else for(var C=p.length-1;C>=0;C--){var M=p[C];if(h=t(M,a,s,T,r,b,v,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,P=h.set||i.set,i={get:x,set:P}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(I,D){return D};else if(typeof d!="function"){var F=d;d=function(I,D){for(var R=D,L=0;L<F.length;L++)R=F[L].call(I,R);return R}}else{var $=d;d=function(I,D){return $.call(I,D)}}l.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(l.push(function(I,D){return i.get.call(I,D)}),l.push(function(I,D){return i.set.call(I,D)})):r===2?l.push(i):l.push(function(I,D){return i.call(I,D)}):Object.defineProperty(n,a,s))}function g(l,n,u){for(var a=[],r,b,v=new Map,T=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,P;if(h?(x=l,s=s-5,b=b||[],P=b):(x=l.prototype,r=r||[],P=r),s!==0&&!i){var C=h?T:v,M=C.get(d)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!M&&s>2?C.set(d,s):C.set(d,!0)}m(a,x,p,d,s,h,i,P,u)}}return y(a,r),y(a,b),a}function y(l,n){n&&l.push(function(u){for(var a=0;a<n.length;a++)n[a].call(u);return u})}function E(l,n,u){if(n.length>0){for(var a=[],r=l,b=l.name,v=n.length-1;v>=0;v--){var T={v:!1};try{var w=n[v](r,{kind:"class",name:b,addInitializer:f(a,T),metadata:u})}finally{T.v=!0}w!==void 0&&(c(10,w),r=w)}return[S(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function S(l,n){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,a,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),T=g(n,u,v);return a.length||S(n,v),{e:T,get c(){return E(n,a,v)}}}}function ao(f,t,e,o){return(ao=hs())(f,t,e,o)}var lo,no,io,Q;lo=O.injectable("singleton");var so=class extends(io=EventTarget){static{({c:[Q,no]}=ao(this,[],[lo],io))}constructor(){super(),this.mIntegrity=new $e(this),this.mGrid=new Z,this.mGraph=new Oe(this),this.mHistory=new je(this),this.mPreview=new Ve(this),this.mActiveFunctionId="",this.mProject=null,this.mEventBuffer=new Map,this.mEventBufferDispatchRequest=-1}mActiveFunctionId;mProject;mEventBufferDispatchRequest;mEventBuffer;mGrid;mGraph;mHistory;mIntegrity;mPreview;get grid(){return this.mGrid}get graph(){return this.mGraph}get history(){return this.mHistory}get integrity(){return this.mIntegrity}get activeFunction(){let t=this.mGraph.document;if(!t)return null;for(let e of t.functions)if(e.id===this.mActiveFunctionId)return e;return null}get activeFunctionId(){return this.mActiveFunctionId}get project(){return this.mProject}get preview(){return this.mPreview}deconstruct(){}initialize(t,e){this.mProject=t,this.mGraph.setDocument(e)}subscribe(t,e,o){let c=g=>{if(!e)return!0;let y=g;for(;y!==null;){if(e.has(y))return!0;switch(!0){case y instanceof ft:{y=y.node;break}case y instanceof wt:{y=y.function;break}case y instanceof yt:{y=y.document;break}default:y=null}}return!1},m=g=>{t!==_.Any&&(g.changeType&t)===0||e!==null&&!c(g.item)||o(g)};return this.addEventListener(be.EVENT_TYPE,m),()=>{this.removeEventListener(be.EVENT_TYPE,m)}}setActiveFunction(t){let e=this.mGraph.document;if(!(!e||this.mActiveFunctionId===t)){for(let o of e.functions)if(o.id===t){this.mActiveFunctionId=t,this.dispatch(_.SpecialActiveFunction,o);return}}}updateFunctionProperties(t){let e=this.activeFunction;if(!e)return;let c=e.project.getFunction(e.definitionId)?.statics??it.imports|it.inputs|it.outputs;if(t.name!==void 0&&(e.label=t.name),t.inputs!==void 0&&(c&it.inputs)===0){for(let m of[...e.inputs])e.removeInput(m);for(let m of t.inputs)e.addInput({dataType:m.type,label:m.name})}if(t.outputs!==void 0&&(c&it.outputs)===0){for(let m of[...e.outputs])e.removeOutput(m);for(let m of t.outputs)e.addOutput({dataType:m.type,label:m.name})}if(t.imports!==void 0&&(c&it.imports)===0){let m=new Set(e.imports),g=new Set(t.imports);for(let y of[...e.imports])g.has(y)||e.removeImport(y);for(let y of t.imports)m.has(y)||e.addImport(y)}this.dispatch(_.FunctionUpdate,e)}dispatch(t,e){let o=this.mEventBuffer.get(e)??0;this.mEventBuffer.set(e,o|t),this.mEventBufferDispatchRequest!==-1&&globalThis.cancelAnimationFrame(this.mEventBufferDispatchRequest),this.mEventBufferDispatchRequest=requestAnimationFrame(()=>{this.mEventBufferDispatchRequest=-1;for(let[c,m]of this.mEventBuffer)this.dispatchEvent(new be(m,c));this.mEventBuffer.clear()})}static{no()}},_={Any:16777215,Connection:15,ConnectionAdd:1,ConnectionUpdate:2,ConnectionDelete:4,Document:240,Function:3840,FunctionAdd:256,FunctionUpdate:512,FunctionDelete:1024,Node:61440,NodeAdd:4096,NodeUpdate:8192,NodeDelete:16384,NodeTransform:32768,Port:983040,PortAdd:65536,PortUpdate:131072,PortDelete:262144,Special:15728640,SpecialActiveFunction:1048576},be=class f extends Event{static EVENT_TYPE="PotatnoUiManagerChangeEvent";mChangeType;mEventItem;get changeType(){return this.mChangeType}get item(){return this.mEventItem}constructor(t,e){super(f.EVENT_TYPE),this.mChangeType=t,this.mEventItem=e}};var co=`:host {\r
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
`;var uo=`<div class="editor-layout">
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
`;var ho=`:host {\r
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
`;var mo=`<div class="function-list-content">\r
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
`;function gs(){function f(l,n){return function(a){e(n,"addInitializer"),o(a,"An initializer"),l.push(a)}}function t(l,n,u,a,r,b,v,T,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+n:n,static:b,private:v,metadata:T},d={v:!1};s.addInitializer=f(a,d);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return l(w,s)}finally{d.v=!0}}function e(l,n){if(l.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(l,n){if(typeof l!="function")throw new TypeError(n+" must be a function")}function c(l,n){var u=typeof n;if(l===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var a;throw l===0?a="field":l===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function m(l,n,u,a,r,b,v,T,w){var p=u[0],s,d,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,P;if(typeof p=="function")h=t(p,a,s,T,r,b,v,w,i),h!==void 0&&(c(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,P=h.set||i.set,i={get:x,set:P}):i=h);else for(var C=p.length-1;C>=0;C--){var M=p[C];if(h=t(M,a,s,T,r,b,v,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,P=h.set||i.set,i={get:x,set:P}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(I,D){return D};else if(typeof d!="function"){var F=d;d=function(I,D){for(var R=D,L=0;L<F.length;L++)R=F[L].call(I,R);return R}}else{var $=d;d=function(I,D){return $.call(I,D)}}l.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(l.push(function(I,D){return i.get.call(I,D)}),l.push(function(I,D){return i.set.call(I,D)})):r===2?l.push(i):l.push(function(I,D){return i.call(I,D)}):Object.defineProperty(n,a,s))}function g(l,n,u){for(var a=[],r,b,v=new Map,T=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,P;if(h?(x=l,s=s-5,b=b||[],P=b):(x=l.prototype,r=r||[],P=r),s!==0&&!i){var C=h?T:v,M=C.get(d)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!M&&s>2?C.set(d,s):C.set(d,!0)}m(a,x,p,d,s,h,i,P,u)}}return y(a,r),y(a,b),a}function y(l,n){n&&l.push(function(u){for(var a=0;a<n.length;a++)n[a].call(u);return u})}function E(l,n,u){if(n.length>0){for(var a=[],r=l,b=l.name,v=n.length-1;v>=0;v--){var T={v:!1};try{var w=n[v](r,{kind:"class",name:b,addInitializer:f(a,T),metadata:u})}finally{T.v=!0}w!==void 0&&(c(10,w),r=w)}return[S(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function S(l,n){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,a,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),T=g(n,u,v);return a.length||S(n,v),{e:T,get c(){return E(n,a,v)}}}}function yo(f,t,e,o){return(yo=gs())(f,t,e,o)}var bo,po,wo,fo,go,vs;bo=K({selector:"potatno-function-list",template:mo,style:ho}),wo=G.state();var vo=class{static{({e:[fo,go],c:[vs,po]}=yo(this,[[wo,1,"mShowPopup"]],[bo]))}constructor(t=O.use(z),e=O.use(Q)){this.mComponent=t,this.mManager=e,this.mUnsubscribe=null}mComponent;mManager;mUnsubscribe;#t=(go(this),fo(this,!1));get mShowPopup(){return this.#t}set mShowPopup(t){this.#t=t}get activeFunctionId(){return this.mManager.activeFunctionId}get functions(){let t=this.mManager.graph.document;if(!t)return[];let e=[];for(let o of t.functions)e.push({id:o.id,label:o.label,name:o.label,system:o.isSystem});return e}get hasUserFunctionDefinitions(){return this.userFunctionDefinitions.length>0}get showPopup(){return this.mShowPopup}get userFunctionDefinitions(){let t=this.mManager.project;return t?[...t.userFunctions.values()].map(e=>({id:e.id})):[]}closePopup(){this.mShowPopup=!1}getEntryClass(t){return t===this.activeFunctionId?"function-entry active":"function-entry"}onConnect(){this.mUnsubscribe=this.mManager.subscribe(_.Document|_.Function|_.SpecialActiveFunction,null,()=>{this.mComponent.updater.update()})}onDeconstruct(){this.mUnsubscribe?.(),this.mUnsubscribe=null}onAddButtonClick(){let t=this.userFunctionDefinitions;t.length===1?this.mManager.graph.addFunction(t[0].id):this.mShowPopup=!this.mShowPopup}onDefinitionSelect(t){this.mShowPopup=!1,this.mManager.graph.addFunction(t)}onFunctionDelete(t,e){t.stopPropagation(),this.mManager.graph.removeFunction(e)}onFunctionSelect(t){this.mManager.setActiveFunction(t)}static{po()}};var ze=class f{static MAX_ZOOM=2;static MIN_ZOOM=.25;mPanX;mPanY;mZoom;get panX(){return this.mPanX}get panY(){return this.mPanY}get zoom(){return this.mZoom}constructor(){this.mPanX=0,this.mPanY=0,this.mZoom=1}getGridBackgroundCss(){let t=Z.GRID_SIZE*this.mZoom,e=this.mPanX%t,o=this.mPanY%t;return[`background-size: ${t}px ${t}px`,`background-position: ${e}px ${o}px`,'background-image: url("data:image/svg+xml,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 viewBox%3D%220 0 100 100%22%3E%3Cpath d%3D%22M0 0h18M0 0v18M100 0H82M100 0v18M0 100h18M0 100V82M100 100H82M100 100V82%22 stroke%3D%22%23313244%22 stroke-width%3D%225%22 stroke-linecap%3D%22round%22%2F%3E%3C%2Fsvg%3E")'].join("; ")}getTransformCss(){return`translate(${this.mPanX}px, ${this.mPanY}px) scale(${this.mZoom})`}pan(t,e){this.mPanX+=t,this.mPanY+=e}screenToWorld(t,e){return{x:(t-this.mPanX)/this.mZoom,y:(e-this.mPanY)/this.mZoom}}snapToGrid(t,e){return{x:Math.round(t/Z.GRID_SIZE)*Z.GRID_SIZE,y:Math.round(e/Z.GRID_SIZE)*Z.GRID_SIZE}}zoomAt(t,e,o){let c=this.mZoom,m=1+o,g=this.mZoom*m;g=Math.max(f.MIN_ZOOM,Math.min(f.MAX_ZOOM,g));let y=(t-this.mPanX)/c,E=(e-this.mPanY)/c;this.mZoom=g,this.mPanX=t-y*this.mZoom,this.mPanY=e-E*this.mZoom}};var Be=class{mData;get hasData(){return this.mData!==null}constructor(){this.mData=null}copy(t){let e=[],o=new Map;for(let g of t)o.set(g,e.length),e.push(g);if(e.length===0)return;let c=e.map(g=>{let y={};for(let[E,S]of g.inputs.map)S.portType==="value"&&S.directValue.length>0&&(y[E]=[...S.directValue]);return{definitionId:g.definitionId,transformation:{...g.transformation},label:g.label,inputDirectValues:y}}),m=[];for(let g of e){let y=o.get(g);for(let[E,S]of g.outputs.map)for(let l of S.connectedPorts){let n=o.get(l.node);n!==void 0&&m.push({sourceNodeIndex:y,sourcePortName:E,targetNodeIndex:n,targetPortName:l.label})}}this.mData={nodes:c,internalConnections:m}}paste(t,e,o,c){if(!this.mData)return[];let m=[];for(let g of this.mData.nodes){let y=t.project.nodeDefinitions.find(l=>l.id===g.definitionId)??e.nodeDefinitions.find(l=>l.id===g.definitionId);if(!y)continue;let E={x:g.transformation.x+o,y:g.transformation.y+c,width:g.transformation.width,height:g.transformation.height},S=t.addNodeByDefinition(y,E);S.label=g.label;for(let[l,n]of Object.entries(g.inputDirectValues)){let u=S.inputs.map.get(l);u&&u.setDirectValue(n)}m.push(S)}for(let g of this.mData.internalConnections){let y=m[g.sourceNodeIndex],E=m[g.targetNodeIndex];if(!y||!E)continue;let S=y.outputs.map.get(g.sourcePortName),l=E.inputs.map.get(g.targetPortName);S&&l&&S.connect(l)}return m}};var xo=`:host {\r
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
.node-layer {
    left: 0;
    position: absolute;
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
`;var To=`<div #canvasWrapper class="canvas-wrapper"
    [style]="this.gridBackgroundStyle"
    (pointerdown)="this.onCanvasPointerDown($event)"
    (wheel)="this.onCanvasWheel($event)"
    (contextmenu)="this.onContextMenu($event)">
    <div #gridLayer class="grid-layer" [style]="this.gridTransformStyle">
        <potatno-connection-layer [interaction]="this.canvasInteraction" [tempConnection]="this.tempConnection"></potatno-connection-layer>
        <div class="node-layer">
            $for(nodeState of this.visibleNodes) {
                <div class="node-position" style="left:{{this.nodeState.pixelX}}px;top:{{this.nodeState.pixelY}}px;width:{{this.nodeState.pixelW}}px;height:{{this.nodeState.pixelH}}px">
                    <potatno-node
                        [nodeData]="this.nodeState.node"
                        [selected]="this.nodeState.selected"
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
`;(function(f){f.Function="function",f.Comment="comment",f.Input="input",f.Output="output",f.Reroute="reroute"})(st||(st={}));var At=class f{static META={[st.Function]:{icon:"f",cssColor:"var(--pn-accent-blue)",label:"Function"},[st.Comment]:{icon:"\u{1F4AC}",cssColor:"var(--pn-accent-yellow)",label:"Comment"},[st.Input]:{icon:"\u2192",cssColor:"var(--pn-accent-green)",label:"Input"},[st.Output]:{icon:"\u2190",cssColor:"var(--pn-accent-red)",label:"Output"},[st.Reroute]:{icon:"\u25C7",cssColor:"var(--pn-text-muted)",label:"Reroute"}};static get(t){let e=f.META[t];return e||{icon:"\u25C6",cssColor:`hsl(${f.hashStringToHue(t)}, 60%, 55%)`,label:t.charAt(0).toUpperCase()+t.slice(1)}}static hashStringToHue(t){let e=0;for(let o=0;o<t.length;o++)e=(e<<5)-e+t.charCodeAt(o),e=e&e;return Math.abs(e)%360}},st;var Eo=`:host {
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
`;var Do=`$if(this.open) {
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
`;function Ts(){function f(l,n){return function(a){e(n,"addInitializer"),o(a,"An initializer"),l.push(a)}}function t(l,n,u,a,r,b,v,T,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+n:n,static:b,private:v,metadata:T},d={v:!1};s.addInitializer=f(a,d);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return l(w,s)}finally{d.v=!0}}function e(l,n){if(l.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(l,n){if(typeof l!="function")throw new TypeError(n+" must be a function")}function c(l,n){var u=typeof n;if(l===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var a;throw l===0?a="field":l===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function m(l,n,u,a,r,b,v,T,w){var p=u[0],s,d,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,P;if(typeof p=="function")h=t(p,a,s,T,r,b,v,w,i),h!==void 0&&(c(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,P=h.set||i.set,i={get:x,set:P}):i=h);else for(var C=p.length-1;C>=0;C--){var M=p[C];if(h=t(M,a,s,T,r,b,v,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,P=h.set||i.set,i={get:x,set:P}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(I,D){return D};else if(typeof d!="function"){var F=d;d=function(I,D){for(var R=D,L=0;L<F.length;L++)R=F[L].call(I,R);return R}}else{var $=d;d=function(I,D){return $.call(I,D)}}l.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(l.push(function(I,D){return i.get.call(I,D)}),l.push(function(I,D){return i.set.call(I,D)})):r===2?l.push(i):l.push(function(I,D){return i.call(I,D)}):Object.defineProperty(n,a,s))}function g(l,n,u){for(var a=[],r,b,v=new Map,T=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,P;if(h?(x=l,s=s-5,b=b||[],P=b):(x=l.prototype,r=r||[],P=r),s!==0&&!i){var C=h?T:v,M=C.get(d)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!M&&s>2?C.set(d,s):C.set(d,!0)}m(a,x,p,d,s,h,i,P,u)}}return y(a,r),y(a,b),a}function y(l,n){n&&l.push(function(u){for(var a=0;a<n.length;a++)n[a].call(u);return u})}function E(l,n,u){if(n.length>0){for(var a=[],r=l,b=l.name,v=n.length-1;v>=0;v--){var T={v:!1};try{var w=n[v](r,{kind:"class",name:b,addInitializer:f(a,T),metadata:u})}finally{T.v=!0}w!==void 0&&(c(10,w),r=w)}return[S(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function S(l,n){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,a,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),T=g(n,u,v);return a.length||S(n,v),{e:T,get c(){return E(n,a,v)}}}}function Lo(f,t,e,o){return(Lo=Ts())(f,t,e,o)}var Oo,Io,_o,Fo,jo,$o,Vo,So,Po,Co,Mo,No,Ao,Es;Oo=K({selector:"potatno-add-node-popup",template:Do,style:Eo}),_o=G.state(),Fo=G.state({complexValue:!0}),jo=nt("searchInput"),$o=mt("node-select"),Vo=mt("close");var Ro=class{static{({e:[So,Po,Co,Mo,No,Ao],c:[Es,Io]}=Lo(this,[[[tt,_o],1,"open"],[Fo,1,"mFilteredEntries"],[jo,1,"searchInput"],[$o,1,"mNodeSelect"],[Vo,1,"mClose"]],[Oo]))}constructor(t=O.use(Q)){this.mManager=t,this.mSearchQuery="",this.mSelectedDefinitionId=null,this.mWasOpen=!1,this.mFilteredEntries=[]}mManager;mSearchQuery;mSelectedDefinitionId;mWasOpen;#t=(Ao(this),So(this,!1));get open(){return this.#t}set open(t){this.#t=t}#e=Po(this,[]);get mFilteredEntries(){return this.#e}set mFilteredEntries(t){this.#e=t}#r=Co(this);get searchInput(){return this.#r}set searchInput(t){this.#r=t}#o=Mo(this);get mNodeSelect(){return this.#o}set mNodeSelect(t){this.#o=t}#n=No(this);get mClose(){return this.#n}set mClose(t){this.#n=t}get results(){return this.mFilteredEntries}get searchValue(){return this.mSearchQuery}getEntryClass(t){return t.id===this.mSelectedDefinitionId?"add-node-result selected":"add-node-result"}getEntryColor(t){return At.get(t.category).cssColor}getEntryIcon(t){return At.get(t.category).icon}getEntryCategoryLabel(t){return At.get(t.category).label}onConnect(){this.mWasOpen=this.open,this.open&&(this.rebuildResults(),this.focusSearchInput())}onUpdate(){this.open&&!this.mWasOpen&&(this.rebuildResults(),this.focusSearchInput()),this.mWasOpen=this.open}onSearchInput(t){t.target instanceof HTMLInputElement&&(this.mSearchQuery=t.target.value,this.rebuildResults())}onSearchKeyDown(t){if(t.key==="Escape"){t.preventDefault(),this.mClose.dispatchEvent(void 0);return}if(t.key==="Enter"){t.preventDefault(),this.emitSelectedEntry();return}(t.key==="ArrowDown"||t.key==="ArrowUp")&&(t.preventDefault(),this.moveSelection(t.key==="ArrowDown"?1:-1))}onEntryPointerDown(t,e){t.preventDefault(),t.stopPropagation(),this.mNodeSelect.dispatchEvent(e.definition)}onRootPointerDown(t){t.stopPropagation()}onRootWheel(t){t.stopPropagation()}onRootContextMenu(t){t.stopPropagation()}buildAvailableNodeDefinitionEntries(t){return t?t.dynamicNodeDefinitions.map(e=>({category:e.category,definition:e,id:e.id,name:e.label})):new Array}emitSelectedEntry(){let t=this.mFilteredEntries.find(e=>e.id===this.mSelectedDefinitionId)??this.mFilteredEntries[0];t&&this.mNodeSelect.dispatchEvent(t.definition)}focusSearchInput(){requestAnimationFrame(()=>{try{this.searchInput.focus(),this.searchInput.select()}catch{}})}moveSelection(t){if(this.mFilteredEntries.length===0){this.mSelectedDefinitionId=null;return}let o=(Math.max(0,this.mFilteredEntries.findIndex(c=>c.id===this.mSelectedDefinitionId))+t+this.mFilteredEntries.length)%this.mFilteredEntries.length;this.mSelectedDefinitionId=this.mFilteredEntries[o].id,this.mFilteredEntries=[...this.mFilteredEntries]}rebuildResults(){let t=this.mSearchQuery.trim().toLowerCase();this.mFilteredEntries=this.buildAvailableNodeDefinitionEntries(this.mManager.activeFunction).filter(e=>!t||e.name.toLowerCase().includes(t)),this.mFilteredEntries.some(e=>e.id===this.mSelectedDefinitionId)||(this.mSelectedDefinitionId=this.mFilteredEntries[0]?.id??null)}static{Io()}};var zo=`:host {
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
`;var Bo=`<svg #svgLayer class="svg-layer" xmlns="http://www.w3.org/2000/svg" (contextmenu)="this.onContextMenu($event)"></svg>
`;function Ss(){function f(l,n){return function(a){e(n,"addInitializer"),o(a,"An initializer"),l.push(a)}}function t(l,n,u,a,r,b,v,T,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+n:n,static:b,private:v,metadata:T},d={v:!1};s.addInitializer=f(a,d);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return l(w,s)}finally{d.v=!0}}function e(l,n){if(l.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(l,n){if(typeof l!="function")throw new TypeError(n+" must be a function")}function c(l,n){var u=typeof n;if(l===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var a;throw l===0?a="field":l===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function m(l,n,u,a,r,b,v,T,w){var p=u[0],s,d,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,P;if(typeof p=="function")h=t(p,a,s,T,r,b,v,w,i),h!==void 0&&(c(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,P=h.set||i.set,i={get:x,set:P}):i=h);else for(var C=p.length-1;C>=0;C--){var M=p[C];if(h=t(M,a,s,T,r,b,v,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,P=h.set||i.set,i={get:x,set:P}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(I,D){return D};else if(typeof d!="function"){var F=d;d=function(I,D){for(var R=D,L=0;L<F.length;L++)R=F[L].call(I,R);return R}}else{var $=d;d=function(I,D){return $.call(I,D)}}l.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(l.push(function(I,D){return i.get.call(I,D)}),l.push(function(I,D){return i.set.call(I,D)})):r===2?l.push(i):l.push(function(I,D){return i.call(I,D)}):Object.defineProperty(n,a,s))}function g(l,n,u){for(var a=[],r,b,v=new Map,T=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,P;if(h?(x=l,s=s-5,b=b||[],P=b):(x=l.prototype,r=r||[],P=r),s!==0&&!i){var C=h?T:v,M=C.get(d)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!M&&s>2?C.set(d,s):C.set(d,!0)}m(a,x,p,d,s,h,i,P,u)}}return y(a,r),y(a,b),a}function y(l,n){n&&l.push(function(u){for(var a=0;a<n.length;a++)n[a].call(u);return u})}function E(l,n,u){if(n.length>0){for(var a=[],r=l,b=l.name,v=n.length-1;v>=0;v--){var T={v:!1};try{var w=n[v](r,{kind:"class",name:b,addInitializer:f(a,T),metadata:u})}finally{T.v=!0}w!==void 0&&(c(10,w),r=w)}return[S(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function S(l,n){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,a,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),T=g(n,u,v);return a.length||S(n,v),{e:T,get c(){return E(n,a,v)}}}}function Zo(f,t,e,o){return(Zo=Ss())(f,t,e,o)}var qo,Go,Jo,Ko,Qo,Uo,Ho,Xo,Wo,Ps=12,sr="http://www.w3.org/2000/svg",ar="data-temp-connection",Cs;qo=K({selector:"potatno-connection-layer",template:Bo,style:zo}),Jo=G.state(),Ko=G.state({complexValue:!0}),Qo=nt("svgLayer");var Yo=class{static{({e:[Uo,Ho,Xo,Wo],c:[Cs,Go]}=Zo(this,[[[tt,Jo],1,"interaction"],[[tt,Ko],1,"tempConnection"],[Qo,1,"svgLayer"]],[qo]))}constructor(t=O.use(Q)){this.mConnectionRegistry=new Map,this.mManager=t,this.mPendingRenderFrame=0,this.mUnsubscribe=null}mConnectionRegistry;mManager;mPendingRenderFrame;mUnsubscribe;#t=(Wo(this),Uo(this,null));get interaction(){return this.#t}set interaction(t){this.#t=t}#e=Ho(this,null);get tempConnection(){return this.#e}set tempConnection(t){this.#e=t}#r=Xo(this);get svgLayer(){return this.#r}set svgLayer(t){this.#r=t}onConnect(){this.mUnsubscribe=this.mManager.subscribe(_.Document|_.Function|_.SpecialActiveFunction|_.Node|_.NodeTransform|_.Connection,null,()=>{this.scheduleRender()}),this.scheduleRender()}onDeconstruct(){this.mUnsubscribe?.(),this.mUnsubscribe=null,this.mPendingRenderFrame!==0&&(cancelAnimationFrame(this.mPendingRenderFrame),this.mPendingRenderFrame=0)}onUpdate(){this.renderTempConnection()}onContextMenu(t){if(!(t.target instanceof Element))return;let e=t.target.getAttribute("data-connection-id");e&&(t.preventDefault(),t.stopPropagation(),this.deleteConnectionById(e))}clearPaths(t,e){let o=e?"path":`path:not([${ar}])`,c=t.querySelectorAll(o);for(let m of c)m.remove()}deleteConnectionById(t){let e=this.mConnectionRegistry.get(t);if(!e)return;let o=e.sourcePort.node.outputs.map.get(e.sourcePort.definitionId)??e.sourcePort,c=e.targetPort.node.inputs.map.get(e.targetPort.definitionId)??e.targetPort;this.mManager.graph.disconnectPorts(o,c)}generateGridPath(t,e,o){let c=this.mManager.grid.gridSize,m=e.x>=t.x?1:-1,g={x:this.snapToGridCenter(t.x+m*c),y:this.snapToGridCenter(t.y)},y={x:this.snapToGridCenter(e.x-m*c),y:this.snapToGridCenter(e.y)},E=Math.min(g.x,y.x),S=Math.max(g.x,y.x),l=this.snapToGridCenter(g.x+(y.x-g.x)/2),n=this.getSourceConnectionLaneOffset(o)*m,u=Math.max(E,Math.min(S,this.snapToGridCenter(l+n)));return this.generateRoundedPath([t,g,{x:u,y:g.y},{x:u,y:y.y},y,e])}getSourceConnectionLaneOffset(t){if(!t||t.direction!=="output")return 0;let e=t.node.outputs.list,o=e.indexOf(t);return o===-1?0:(e.length-o-1)*this.mManager.grid.gridSize}generateRoundedPath(t){let e=this.mManager.grid.gridSize,o=Math.min(8,e/3),c=[];for(let y of t){let E=c[c.length-1];(!E||E.x!==y.x||E.y!==y.y)&&c.push(y)}if(c.length<2)return"";let m=`M ${c[0].x} ${c[0].y}`;for(let y=1;y<c.length-1;y++){let E=c[y-1],S=c[y],l=c[y+1],n=Math.hypot(S.x-E.x,S.y-E.y),u=Math.hypot(l.x-S.x,l.y-S.y),a=Math.min(o,n/2,u/2);if(a<=0){m+=` L ${S.x} ${S.y}`;continue}let r=this.moveTowards(S,E,a),b=this.moveTowards(S,l,a);m+=` L ${r.x} ${r.y} Q ${S.x} ${S.y} ${b.x} ${b.y}`}let g=c[c.length-1];return`${m} L ${g.x} ${g.y}`}getSvgLayerOrNull(){try{return this.svgLayer}catch{return null}}getPortPosition(t){let e=this.interaction?.zoom??1,o=this.mManager.grid.gridSize,c=this.mManager.grid.getPortElement(t),m=this.getSvgLayerOrNull();if(c&&m){let u=m.getBoundingClientRect(),a=c.getBoundingClientRect();return{x:this.snapToGridCenter((a.left+a.width/2-u.left)/e),y:this.snapToGridCenter((a.top+a.height/2-u.top)/e)}}let g=t.node,y=g.transformation.x*o,E=g.transformation.y*o,S=g.transformation.width*o,l=t.direction==="output"?g.outputs.list:g.inputs.list,n=0;for(let u of l){if(u===t)break;n++}return{x:t.direction==="output"?y+S-o/2:y+o/2,y:E+o+(n+.5)*o}}moveTowards(t,e,o){let c=Math.hypot(e.x-t.x,e.y-t.y);return c===0?t:{x:t.x+(e.x-t.x)/c*o,y:t.y+(e.y-t.y)/c*o}}renderConnections(){let t=this.getSvgLayerOrNull();if(!t)return;let e=this.mManager.activeFunction;if(!e){this.clearPaths(t,!0),this.mConnectionRegistry.clear();return}this.clearPaths(t,!1),this.mConnectionRegistry.clear();let o=this.mManager.integrity.errorItems,c=0;for(let m of e.nodes)for(let g of m.outputs.list)for(let y of g.connectedPorts){let E=`c${c++}`,S=this.getPortPosition(g),l=this.getPortPosition(y),n=o.has(g)||o.has(y);this.mConnectionRegistry.set(E,{sourcePort:g,targetPort:y}),this.renderConnectionPath(t,E,g,S,l,!n)}this.renderTempConnection()}renderConnectionPath(t,e,o,c,m,g){let y=this.generateGridPath(c,m,o),E=document.createElementNS(sr,"path");E.setAttribute("d",y),E.setAttribute("data-connection-id",e),E.setAttribute("data-hit-area","true"),E.setAttribute("fill","none"),E.style.cursor="pointer",E.style.pointerEvents="stroke",E.style.stroke="transparent",E.style.strokeLinecap="round",E.style.strokeLinejoin="round",E.style.strokeWidth=`${Ps}`,t.appendChild(E);let S=document.createElementNS(sr,"path");S.setAttribute("d",y),S.setAttribute("data-connection-id",e),S.setAttribute("fill","none"),S.style.pointerEvents="none",S.style.stroke=g?"#a6adc8":"#f38ba8",S.style.strokeLinecap="round",S.style.strokeLinejoin="round",S.style.strokeWidth="2",g||S.setAttribute("stroke-dasharray","6 3"),t.appendChild(S)}renderTempConnection(){let t=this.getSvgLayerOrNull();if(!t)return;let e=t.querySelector(`[${ar}]`);e&&e.remove();let o=this.tempConnection;if(!o)return;let c=document.createElementNS(sr,"path");c.setAttribute("d",this.generateGridPath(o.start,o.end,null)),c.setAttribute("fill","none"),c.setAttribute(ar,"true"),c.style.opacity="0.6",c.style.pointerEvents="none",c.style.stroke="#bac2de",c.style.strokeDasharray="8 4",c.style.strokeLinecap="round",c.style.strokeLinejoin="round",c.style.strokeWidth="2",t.appendChild(c)}scheduleRender(){this.mPendingRenderFrame===0&&(this.mPendingRenderFrame=requestAnimationFrame(()=>{this.mPendingRenderFrame=0,this.renderConnections()}))}snapToGridCenter(t){let e=this.mManager.grid.gridSize;return Math.round((t-e/2)/e)*e+e/2}static{Go()}};function Ms(){function f(l,n){return function(a){e(n,"addInitializer"),o(a,"An initializer"),l.push(a)}}function t(l,n,u,a,r,b,v,T,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+n:n,static:b,private:v,metadata:T},d={v:!1};s.addInitializer=f(a,d);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return l(w,s)}finally{d.v=!0}}function e(l,n){if(l.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(l,n){if(typeof l!="function")throw new TypeError(n+" must be a function")}function c(l,n){var u=typeof n;if(l===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var a;throw l===0?a="field":l===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function m(l,n,u,a,r,b,v,T,w){var p=u[0],s,d,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,P;if(typeof p=="function")h=t(p,a,s,T,r,b,v,w,i),h!==void 0&&(c(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,P=h.set||i.set,i={get:x,set:P}):i=h);else for(var C=p.length-1;C>=0;C--){var M=p[C];if(h=t(M,a,s,T,r,b,v,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,P=h.set||i.set,i={get:x,set:P}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(I,D){return D};else if(typeof d!="function"){var F=d;d=function(I,D){for(var R=D,L=0;L<F.length;L++)R=F[L].call(I,R);return R}}else{var $=d;d=function(I,D){return $.call(I,D)}}l.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(l.push(function(I,D){return i.get.call(I,D)}),l.push(function(I,D){return i.set.call(I,D)})):r===2?l.push(i):l.push(function(I,D){return i.call(I,D)}):Object.defineProperty(n,a,s))}function g(l,n,u){for(var a=[],r,b,v=new Map,T=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,P;if(h?(x=l,s=s-5,b=b||[],P=b):(x=l.prototype,r=r||[],P=r),s!==0&&!i){var C=h?T:v,M=C.get(d)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!M&&s>2?C.set(d,s):C.set(d,!0)}m(a,x,p,d,s,h,i,P,u)}}return y(a,r),y(a,b),a}function y(l,n){n&&l.push(function(u){for(var a=0;a<n.length;a++)n[a].call(u);return u})}function E(l,n,u){if(n.length>0){for(var a=[],r=l,b=l.name,v=n.length-1;v>=0;v--){var T={v:!1};try{var w=n[v](r,{kind:"class",name:b,addInitializer:f(a,T),metadata:u})}finally{T.v=!0}w!==void 0&&(c(10,w),r=w)}return[S(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function S(l,n){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,a,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),T=g(n,u,v);return a.length||S(n,v),{e:T,get c(){return E(n,a,v)}}}}function en(f,t,e,o){return(en=Ms())(f,t,e,o)}var rn,ko,we;rn=Et({access:X.Read,selector:/^potatno-preview$/});var tn=class{static{({c:[we,ko]}=en(this,[],[rn]))}constructor(t=O.use(q),e=O.use(H),o=O.use(ot)){this.mTarget=t,this.mProcedure=e.createExpressionProcedure(o.value)}mProcedure;mTarget;onUpdate(){let t=this.mProcedure.execute();if(!t){let o=this.mTarget.childNodes.length>0;return o&&(this.mTarget.innerHTML=""),o}let e=t.element;return this.mTarget.contains(e)?!1:(this.mTarget.innerHTML="",this.mTarget.appendChild(e),!0)}static{ko()}};var on=`:host {\r
    display: block;\r
    position: relative;\r
}\r
\r
.port-wrapper {
    cursor: crosshair;
    display: flex;
    align-items: center;
    gap: 6px;
    height: var(--pn-node-port-gap);
    position: relative;
}
\r
.port-wrapper.direction-output {\r
    flex-direction: row-reverse;\r
}\r
\r
.port-circle {
    width: var(--pn-node-port-size);
    height: var(--pn-node-port-size);
    position: relative;
    flex-shrink: 0;
    transition: transform 0.1s;
}

.port-wrapper:hover .port-circle {
    transform: scale(1.3);
}

/* Rectangle body */
.port-circle.port-type-flow::before {
    content: '';
    position: absolute;
    top: 0;
    width: var(--pn-node-port-body-size);
    height: 100%;
    background: var(--port-color, var(--pn-text-muted));
}

/* Triangle tip */
.port-circle.port-type-flow::after {
    content: '';
    position: absolute;
    top: 0;\r
    width: 0;\r
    height: 0;\r
    border-top: var(--pn-node-port-half-size) solid transparent;
    border-bottom: var(--pn-node-port-half-size) solid transparent;
}

/* Output: arrow points right */
.port-circle.port-type-flow.direction-output::before {
    left: 0;
    border-radius: 3px 0 0 3px;
}
.port-circle.port-type-flow.direction-output::after {
    left: var(--pn-node-port-body-size);
    border-left: var(--pn-node-port-tip-size) solid var(--port-color, var(--pn-text-muted));
}

/* Input: arrow points left */
.port-circle.port-type-flow.direction-input::before {
    right: 0;
    border-radius: 0 3px 3px 0;
}
.port-circle.port-type-flow.direction-input::after {
    right: var(--pn-node-port-body-size);
    border-right: var(--pn-node-port-tip-size) solid var(--port-color, var(--pn-text-muted));
}

/* Value ports: smaller circular shape */
.port-circle.port-type-value {
    align-self: center;
    background: var(--port-color, var(--pn-text-muted));
    border-radius: 50%;
    height: var(--pn-node-value-port-size);
    width: var(--pn-node-value-port-size);
}

/* Connected: solid fill (default) */
.port-circle.port-type-flow.connected::before { background: var(--port-color, var(--pn-text-muted)); }
.port-circle.port-type-flow.connected.direction-output::after { border-left-color: var(--port-color, var(--pn-text-muted)); }
.port-circle.port-type-flow.connected.direction-input::after { border-right-color: var(--port-color, var(--pn-text-muted)); }
.port-circle.port-type-value.connected { background: var(--port-color, var(--pn-text-muted)); }

/* Disconnected: dimmed */
.port-circle.port-type-flow.disconnected::before { background: color-mix(in srgb, var(--port-color, var(--pn-text-muted)) 30%, var(--pn-node-bg)); }
.port-circle.port-type-flow.disconnected.direction-output::after { border-left-color: color-mix(in srgb, var(--port-color, var(--pn-text-muted)) 30%, var(--pn-node-bg)); }
.port-circle.port-type-flow.disconnected.direction-input::after { border-right-color: color-mix(in srgb, var(--port-color, var(--pn-text-muted)) 30%, var(--pn-node-bg)); }
.port-circle.port-type-value.disconnected { background: color-mix(in srgb, var(--port-color, var(--pn-text-muted)) 30%, var(--pn-node-bg)); }

/* Invalid: red glow */
.port-circle.port-type-flow.invalid::before { background: var(--pn-accent-danger); }
.port-circle.port-type-flow.invalid.direction-output::after { border-left-color: var(--pn-accent-danger); }
.port-circle.port-type-flow.invalid.direction-input::after { border-right-color: var(--pn-accent-danger); }
.port-circle.port-type-value.invalid { background: var(--pn-accent-danger); }
.port-circle.invalid { filter: drop-shadow(0 0 4px var(--pn-accent-danger)); }

/* Has-error: red glow (validation error from graph) */
.port-circle.port-type-flow.has-error::before { background: var(--pn-accent-danger, #f38ba8); }
.port-circle.port-type-flow.has-error.direction-output::after { border-left-color: var(--pn-accent-danger, #f38ba8); }
.port-circle.port-type-flow.has-error.direction-input::after { border-right-color: var(--pn-accent-danger, #f38ba8); }
.port-circle.port-type-value.has-error { background: var(--pn-accent-danger, #f38ba8); }
.port-circle.has-error { filter: drop-shadow(0 0 4px var(--pn-accent-danger, #f38ba8)); }
\r
.port-label {
    color: var(--port-label-color, var(--pn-text-secondary));
    font-size: var(--pn-font-size-sm);
    line-height: var(--pn-node-port-gap);
    white-space: nowrap;
    user-select: none;
}
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
`;var nn=`<div #portWrapper [className]="this.portWrapperClasses"
     [title]="this.portTypeLabel"
     style="--port-color: {{this.portColor}}"
     (pointerdown)="this.onPointerDown($event)"
     (pointerenter)="this.onPointerEnter()"
     (pointerleave)="this.onPointerLeave()">
    <div #portCircle [className]="this.portCircleClasses">
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
`;function Rs(){function f(l,n){return function(a){e(n,"addInitializer"),o(a,"An initializer"),l.push(a)}}function t(l,n,u,a,r,b,v,T,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+n:n,static:b,private:v,metadata:T},d={v:!1};s.addInitializer=f(a,d);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return l(w,s)}finally{d.v=!0}}function e(l,n){if(l.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(l,n){if(typeof l!="function")throw new TypeError(n+" must be a function")}function c(l,n){var u=typeof n;if(l===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var a;throw l===0?a="field":l===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function m(l,n,u,a,r,b,v,T,w){var p=u[0],s,d,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,P;if(typeof p=="function")h=t(p,a,s,T,r,b,v,w,i),h!==void 0&&(c(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,P=h.set||i.set,i={get:x,set:P}):i=h);else for(var C=p.length-1;C>=0;C--){var M=p[C];if(h=t(M,a,s,T,r,b,v,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,P=h.set||i.set,i={get:x,set:P}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(I,D){return D};else if(typeof d!="function"){var F=d;d=function(I,D){for(var R=D,L=0;L<F.length;L++)R=F[L].call(I,R);return R}}else{var $=d;d=function(I,D){return $.call(I,D)}}l.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(l.push(function(I,D){return i.get.call(I,D)}),l.push(function(I,D){return i.set.call(I,D)})):r===2?l.push(i):l.push(function(I,D){return i.call(I,D)}):Object.defineProperty(n,a,s))}function g(l,n,u){for(var a=[],r,b,v=new Map,T=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,P;if(h?(x=l,s=s-5,b=b||[],P=b):(x=l.prototype,r=r||[],P=r),s!==0&&!i){var C=h?T:v,M=C.get(d)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!M&&s>2?C.set(d,s):C.set(d,!0)}m(a,x,p,d,s,h,i,P,u)}}return y(a,r),y(a,b),a}function y(l,n){n&&l.push(function(u){for(var a=0;a<n.length;a++)n[a].call(u);return u})}function E(l,n,u){if(n.length>0){for(var a=[],r=l,b=l.name,v=n.length-1;v>=0;v--){var T={v:!1};try{var w=n[v](r,{kind:"class",name:b,addInitializer:f(a,T),metadata:u})}finally{T.v=!0}w!==void 0&&(c(10,w),r=w)}return[S(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function S(l,n){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,a,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),T=g(n,u,v);return a.length||S(n,v),{e:T,get c(){return E(n,a,v)}}}}function gn(f,t,e,o){return(gn=Rs())(f,t,e,o)}var vn,sn,yn,bn,wn,xn,Tn,En,Dn,an,ln,cn,un,hn,dn,mn,pn,lr;vn=K({selector:"potatno-port",template:nn,style:on}),yn=G.state(),bn=G.state(),wn=mt("port-drag-start"),xn=mt("port-hover"),Tn=mt("port-leave"),En=nt("portCircle"),Dn=nt("portWrapper");var fn=class{static{({e:[an,ln,cn,un,hn,dn,mn,pn],c:[lr,sn]}=gn(this,[[[tt,yn],1,"port"],[[tt,bn],1,"ownerNode"],[wn,1,"mPortDragStart"],[xn,1,"mPortHover"],[Tn,1,"mPortLeave"],[En,1,"portCircleElement"],[Dn,1,"portWrapperElement"]],[vn]))}constructor(t=O.use(z),e=O.use(Q)){this.mComponent=t,this.mLastRegisteredElement=null,this.mLastRegisteredHitElement=null,this.mLastRegisteredPort=null,this.mManager=e,this.mUnsubscribe=null}mComponent;mLastRegisteredElement;mLastRegisteredHitElement;mLastRegisteredPort;mManager;mUnsubscribe;#t=(pn(this),an(this,null));get port(){return this.#t}set port(t){this.#t=t}#e=ln(this,null);get ownerNode(){return this.#e}set ownerNode(t){this.#e=t}#r=cn(this);get mPortDragStart(){return this.#r}set mPortDragStart(t){this.#r=t}#o=un(this);get mPortHover(){return this.#o}set mPortHover(t){this.#o=t}#n=hn(this);get mPortLeave(){return this.#n}set mPortLeave(t){this.#n=t}#i=dn(this);get portCircleElement(){return this.#i}set portCircleElement(t){this.#i=t}#s=mn(this);get portWrapperElement(){return this.#s}set portWrapperElement(t){this.#s=t}get hasError(){return this.port!==null&&this.mManager.integrity.errorItems.has(this.port)}get portName(){return this.port?.label??""}get portTypeLabel(){return this.port?.dataType??""}get portWrapperClasses(){return`port-wrapper ${this.port?.direction==="output"?"direction-output":"direction-input"}`}get portCircleClasses(){if(!this.port)return"port-circle disconnected direction-input";let t=["port-circle"];return t.push(this.port.connectedPorts.size>0?"connected":"disconnected"),t.push(this.port.direction==="output"?"direction-output":"direction-input"),t.push(this.port.portType==="value"?"port-type-value":"port-type-flow"),this.hasError&&t.push("has-error"),t.join(" ")}get portColor(){if(!this.port||this.port.portType==="flow")return"var(--pn-text-primary)";if(this.port.node.project.types.isGenericType(this.port.dataType??"")){if(this.port.connectedPorts.size>0){let t=[...this.port.connectedPorts][0];return this.getTypeColor(t.dataType??"")}return"var(--pn-text-muted)"}return this.getTypeColor(this.port.dataType??"")}get showDirectValueInput(){return this.port?this.port.portType==="value"&&this.port.direction==="input"&&this.port.connectedPorts.size===0&&!this.port.node.project.types.isGenericType(this.port.dataType??""):!1}get directValueInputDefs(){return!this.port||this.port.portType!=="value"?[]:this.port.node.project.types.isGenericType(this.port.dataType??"")?[]:this.port.project.types.getType(this.port.dataType??"").inputs.map((e,o)=>({htmlType:e.type==="number"?"number":e.type==="boolean"?"checkbox":"text",index:o,name:e.name,value:this.port.directValue[o]??""}))}onConnect(){this.mUnsubscribe=this.mManager.subscribe(_.Connection|_.Node,null,()=>{this.mComponent.updater.update()})}onDeconstruct(){this.mUnsubscribe?.(),this.mUnsubscribe=null}onUpdate(){let t=this.port,e=this.ownerNode;if(!t||!e)return;let o,c;try{o=this.portCircleElement,c=this.portWrapperElement}catch{return}t===this.mLastRegisteredPort&&o===this.mLastRegisteredElement&&c===this.mLastRegisteredHitElement||(this.mLastRegisteredElement=o,this.mLastRegisteredHitElement=c,this.mLastRegisteredPort=t,this.mManager.grid.registerPortElement(t,o,c),this.mManager.graph.transformNode(e,{}))}onPointerDown(t){t.stopPropagation(),t.preventDefault(),!(!this.port||!this.ownerNode)&&this.mPortDragStart.dispatchEvent({node:this.ownerNode,port:this.port,element:this.portCircleElement})}onPointerEnter(){!this.port||!this.ownerNode||this.mPortHover.dispatchEvent({node:this.ownerNode,port:this.port,element:this.portCircleElement})}onPointerLeave(){this.mPortLeave.dispatchEvent(void 0)}onDirectValueInput(t,e){if(!this.port)return;let o=t.target,c=[...this.port.directValue];c[e]=o.type==="checkbox"?o.checked?"true":"false":o.value,this.mManager.graph.setPortDirectValue(this.port,c)}getTypeColor(t){let e=0;for(let c=0;c<t.length;c++)e=t.charCodeAt(c)+((e<<5)-e);return`hsl(${Math.abs(e)*137.508%360}, 70%, 60%)`}static{sn()}};var In=`:host {
    display: block;
    height: 100%;
    width: 100%;
    font-family: var(--pn-font-family);
    font-size: var(--pn-font-size);
}
\r
/* \u2500\u2500 Standard node container \u2500\u2500 */\r
\r
.node {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    min-height: 100%;
    min-width: var(--pn-node-min-width);
    background: var(--pn-node-bg);
    border: 1px solid var(--pn-node-border);
    border-radius: var(--pn-node-border-radius);
    box-shadow: 0 2px 8px var(--pn-node-shadow);
    overflow: visible;
    user-select: none;
}
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
.node-header {
    display: flex;
    align-items: center;
    height: var(--pn-node-header-height);
    padding: 0 var(--pn-grid-size);
    gap: var(--pn-grid-half-size);
    border-radius: var(--pn-node-border-radius) var(--pn-node-border-radius) 0 0;
    color: #fff;
    font-weight: 600;
    font-size: var(--pn-node-font-size);
    line-height: var(--pn-grid-size);
    cursor: grab;
    --port-label-color: rgba(255, 255, 255, 0.9);
}
\r
.node-header:active {\r
    cursor: grabbing;\r
}\r
\r
.node-icon {
    font-size: var(--pn-node-font-size);
    flex-shrink: 0;
    line-height: var(--pn-grid-size);
}

.node-label {
    flex: 1;
    line-height: var(--pn-grid-size);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}\r
\r
/* \u2500\u2500 Body with data ports \u2500\u2500 */\r
\r
.node-body {
    display: flex;
    flex: 1 0 auto;
    justify-content: space-between;
    min-height: calc(100% - var(--pn-node-header-height));
    padding: 0;
}
\r
.node-inputs,\r
.node-outputs {\r
    display: flex;\r
    flex-direction: column;\r
}\r
\r
.node-inputs {
    align-items: flex-start;
    margin-left: var(--pn-node-port-cell-offset);
}

.node-outputs {
    align-items: flex-end;
    margin-left: auto;
    margin-right: var(--pn-node-port-cell-offset);
}
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
.open-function-btn {
    background: none;\r
    border: 1px solid currentColor;\r
    border-radius: 3px;\r
    color: inherit;\r
    font-size: var(--pn-node-button-font-size);
    height: var(--pn-grid-size);
    line-height: 1;
    padding: 0 3px;
    cursor: pointer;\r
    opacity: 0.7;\r
    flex-shrink: 0;\r
}\r
\r
.open-function-btn:hover {\r
    opacity: 1;\r
}\r
\r
.preview-eye-btn {
    background: none;\r
    border: 1px solid currentColor;\r
    border-radius: 3px;\r
    color: inherit;\r
    font-size: var(--pn-node-button-font-size);
    height: var(--pn-grid-size);
    line-height: 1;
    padding: 0 3px;
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
.node-comment {
    box-sizing: border-box;
    height: 100%;
    background: rgba(108, 112, 134, 0.1);
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
.comment-header {
    display: flex;
    align-items: center;
    gap: 4px;
    height: var(--pn-node-header-height);
    padding: 0 var(--pn-grid-size);
    color: var(--pn-text-muted);
    font-size: var(--pn-node-font-size);
    line-height: var(--pn-grid-size);
    cursor: grab;
}
\r
.comment-header:active {\r
    cursor: grabbing;\r
}\r
\r
.comment-body {
    box-sizing: border-box;
    height: calc(100% - var(--pn-node-header-height));
    padding: 0 var(--pn-grid-size) var(--pn-grid-size) var(--pn-grid-size);
}

.comment-body textarea {
    height: 100%;
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
.node-preview {
    background: var(--pn-bg-secondary);
    overflow: hidden;
}
\r
.node-preview:empty {\r
    display: none;\r
}\r
\r
.node-preview:not(:empty) {
    padding: 6px;
    border-top: 1px solid var(--pn-node-border);
}
\r
/* \u2500\u2500 Reroute node \u2500\u2500 */\r
\r
.node-reroute {
    display: flex;
    align-items: center;
    gap: 0;
    height: 100%;
    user-select: none;
}
\r
.node-reroute.selected .reroute-dot {\r
    box-shadow: 0 0 0 2px var(--pn-node-border-selected);\r
}\r
\r
.reroute-dot {
    width: var(--pn-grid-size);
    height: var(--pn-grid-size);
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
.reroute-inputs {
    margin-right: var(--pn-node-port-cell-offset);
}

.reroute-outputs {
    margin-left: var(--pn-node-port-cell-offset);
}
`;var Sn=`$if(this.nodeData) {
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
        <div class="node-comment {{this.selectedClass}} {{this.hasErrorClass}}">
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
                            <option [value]="this.display.id" [selected]="this.display.id === this.selectedDisplayId">{{this.display.label}}</option>
                        }
                    </select>
                </div>
            }
            <div class="node-preview" potatno-preview="this.previewDriver"></div>
        </div>
    }
    }
}
`;function _s(){function f(l,n){return function(a){e(n,"addInitializer"),o(a,"An initializer"),l.push(a)}}function t(l,n,u,a,r,b,v,T,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+n:n,static:b,private:v,metadata:T},d={v:!1};s.addInitializer=f(a,d);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return l(w,s)}finally{d.v=!0}}function e(l,n){if(l.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(l,n){if(typeof l!="function")throw new TypeError(n+" must be a function")}function c(l,n){var u=typeof n;if(l===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var a;throw l===0?a="field":l===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function m(l,n,u,a,r,b,v,T,w){var p=u[0],s,d,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,P;if(typeof p=="function")h=t(p,a,s,T,r,b,v,w,i),h!==void 0&&(c(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,P=h.set||i.set,i={get:x,set:P}):i=h);else for(var C=p.length-1;C>=0;C--){var M=p[C];if(h=t(M,a,s,T,r,b,v,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,P=h.set||i.set,i={get:x,set:P}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(I,D){return D};else if(typeof d!="function"){var F=d;d=function(I,D){for(var R=D,L=0;L<F.length;L++)R=F[L].call(I,R);return R}}else{var $=d;d=function(I,D){return $.call(I,D)}}l.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(l.push(function(I,D){return i.get.call(I,D)}),l.push(function(I,D){return i.set.call(I,D)})):r===2?l.push(i):l.push(function(I,D){return i.call(I,D)}):Object.defineProperty(n,a,s))}function g(l,n,u){for(var a=[],r,b,v=new Map,T=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,P;if(h?(x=l,s=s-5,b=b||[],P=b):(x=l.prototype,r=r||[],P=r),s!==0&&!i){var C=h?T:v,M=C.get(d)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!M&&s>2?C.set(d,s):C.set(d,!0)}m(a,x,p,d,s,h,i,P,u)}}return y(a,r),y(a,b),a}function y(l,n){n&&l.push(function(u){for(var a=0;a<n.length;a++)n[a].call(u);return u})}function E(l,n,u){if(n.length>0){for(var a=[],r=l,b=l.name,v=n.length-1;v>=0;v--){var T={v:!1};try{var w=n[v](r,{kind:"class",name:b,addInitializer:f(a,T),metadata:u})}finally{T.v=!0}w!==void 0&&(c(10,w),r=w)}return[S(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function S(l,n){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,a,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),T=g(n,u,v);return a.length||S(n,v),{e:T,get c(){return E(n,a,v)}}}}function jn(f,t,e,o){return(jn=_s())(f,t,e,o)}var $n,Pn,Vn,zn,Bn,Gn,Un,Hn,Xn,Cn,Mn,Nn,An,Rn,Ln,On,_n,Fs;$n=K({selector:"potatno-node",template:Sn,style:In,modules:[we],components:[lr]}),Vn=G.state(),zn=G.state(),Bn=G.state(),Gn=mt("port-drag-start"),Un=mt("port-hover"),Hn=mt("port-leave"),Xn=mt("resize-start");var Fn=class{static{({e:[Cn,Mn,Nn,An,Rn,Ln,On,_n],c:[Fs,Pn]}=jn(this,[[[tt,Vn],1,"nodeData"],[[tt,zn],1,"selected"],[[tt,Bn],1,"gridSize"],[Gn,1,"mPortDragStart"],[Un,1,"mPortHover"],[Hn,1,"mPortLeave"],[Xn,1,"mResizeStart"]],[$n]))}constructor(t=O.use(z),e=O.use(Q)){this.mComponent=t,this.mManager=e,this.mUnsubscribe=null}mComponent;mManager;mUnsubscribe;#t=(_n(this),Cn(this,null));get nodeData(){return this.#t}set nodeData(t){this.#t=t}#e=Mn(this,!1);get selected(){return this.#e}set selected(t){this.#e=t}#r=Nn(this,20);get gridSize(){return this.#r}set gridSize(t){this.#r=t}#o=An(this);get mPortDragStart(){return this.#o}set mPortDragStart(t){this.#o=t}#n=Rn(this);get mPortHover(){return this.#n}set mPortHover(t){this.#n=t}#i=Ln(this);get mPortLeave(){return this.#i}set mPortLeave(t){this.#i=t}#s=On(this);get mResizeStart(){return this.#s}set mResizeStart(t){this.#s=t}get selectedClass(){return this.selected?"selected":""}get hasErrorClass(){return this.nodeData!==null&&this.mManager.integrity.errorItems.has(this.nodeData)?"has-error":""}get isComment(){return this.nodeData?.category===st.Comment}get isReroute(){return this.nodeData?.category===st.Reroute}get isFunction(){return this.nodeData?.category===st.Function}get showOpenButton(){return this.isFunction}get canPreview(){return this.valueOutputPorts.length>0}get isPreviewActive(){return this.nodeData?.preview!=null}get previewEyeClass(){return this.isPreviewActive?"preview-eye-btn active":"preview-eye-btn"}get previewDisplays(){if(!this.nodeData)return[];let t=this.nodeData.project,e=t.getFunction(this.nodeData.function.definitionId);if(!e)return[];let o=this.nodeData.preview,c=o?this.nodeData.outputs.map.get(o.portId):void 0;if(c&&c.portType==="value")return this.createDisplayOptions(t,t.preview.availableDisplays(e,c.resolvedDataType));let m=new Set;for(let g of this.valueOutputPorts)for(let y of t.preview.availableDisplays(e,g.resolvedDataType))m.add(y);return this.createDisplayOptions(t,[...m])}get previewDriver(){let t=this.nodeData?.preview;if(!this.nodeData||!t)return null;let e=this.nodeData.outputs.map.get(t.portId);return e?this.mManager.preview.requestDriver(e,t.displayId):null}get valueOutputPorts(){return this.nodeData?[...this.nodeData.outputs.value]:[]}get selectedDisplayId(){return this.nodeData?.preview?.displayId??""}get previewNoneClass(){return this.isPreviewActive?"preview-port-item":"preview-port-item active"}get categoryColor(){return this.nodeData?At.get(this.nodeData.category).cssColor:""}get categoryIcon(){return this.nodeData?At.get(this.nodeData.category).icon:""}get nodeLabel(){return this.nodeData?.label??""}get nodeName(){if(!this.nodeData)return"";let t=this.nodeData;return t.project.nodeDefinitions.find(o=>o.id===t.definitionId)?.label??t.label}get nodeGridStyle(){let t=this.gridSize;return`--pn-grid-size: ${t}px; --pn-grid-half-size: ${t/2}px; --pn-node-port-cell-offset: ${t/2-7}px; --pn-node-port-gap: ${t}px;`}get inputPorts(){return this.nodeData?[...this.nodeData.inputs.list]:[]}get outputPorts(){return this.nodeData?[...this.nodeData.outputs.list]:[]}isPreviewedPort(t){return this.nodeData?.preview?.portId===t.definitionId}previewPortClass(t){return this.isPreviewedPort(t)?"preview-port-item active":"preview-port-item"}onConnect(){this.mUnsubscribe=this.mManager.subscribe(_.Function|_.SpecialActiveFunction|_.Node|_.Connection,null,()=>{this.mComponent.updater.update()})}onDeconstruct(){this.mUnsubscribe?.(),this.mUnsubscribe=null}onPortDragStart(t){this.mPortDragStart.dispatchEvent(t.value)}onPortHover(t){this.mPortHover.dispatchEvent(t.value)}onPortLeave(){this.mPortLeave.dispatchEvent(void 0)}onSelectPreviewPort(t,e){t.stopPropagation();let o=this.previewDisplaysForPort(e);this.mManager.graph.updateNode(this.nodeData,c=>{if(c.preview?.portId===e.definitionId){c.preview=null;return}let m=c.preview&&o.includes(c.preview.displayId)?c.preview.displayId:o[0];m&&(c.preview={portId:e.definitionId,displayId:m})})}previewDisplaysForPort(t){if(!this.nodeData)return[];let e=this.nodeData.project.getFunction(this.nodeData.function.definitionId);return e?this.nodeData.project.preview.availableDisplays(e,t.resolvedDataType):[]}onClearPreview(t){t.stopPropagation(),this.mManager.graph.updateNode(this.nodeData,e=>{e.preview=null})}onSelectPreviewStyle(t){t.stopPropagation();let e=t.target.value;this.mManager.graph.updateNode(this.nodeData,o=>{o.preview&&(o.preview={portId:o.preview.portId,displayId:e})})}createDisplayOptions(t,e){return e.map(o=>({id:o,label:t.preview.getDisplay(o)?.name??o}))}onOpenFunction(t){if(t.stopPropagation(),!this.nodeData)return;let e=this.nodeData.definitionId,o=e.startsWith("USERFUNCTION_")?e.slice(13):e;this.mManager.setActiveFunction(o)}onCommentInput(t){let e=t.target;this.mManager.graph.updateNode(this.nodeData,o=>{o.label=e.value})}onResizeStart(t){t.stopPropagation(),t.preventDefault(),this.nodeData&&this.mResizeStart.dispatchEvent({node:this.nodeData,startX:t.clientX,startY:t.clientY})}static{Pn()}};function js(){function f(l,n){return function(a){e(n,"addInitializer"),o(a,"An initializer"),l.push(a)}}function t(l,n,u,a,r,b,v,T,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+n:n,static:b,private:v,metadata:T},d={v:!1};s.addInitializer=f(a,d);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return l(w,s)}finally{d.v=!0}}function e(l,n){if(l.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(l,n){if(typeof l!="function")throw new TypeError(n+" must be a function")}function c(l,n){var u=typeof n;if(l===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var a;throw l===0?a="field":l===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function m(l,n,u,a,r,b,v,T,w){var p=u[0],s,d,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,P;if(typeof p=="function")h=t(p,a,s,T,r,b,v,w,i),h!==void 0&&(c(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,P=h.set||i.set,i={get:x,set:P}):i=h);else for(var C=p.length-1;C>=0;C--){var M=p[C];if(h=t(M,a,s,T,r,b,v,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,P=h.set||i.set,i={get:x,set:P}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(I,D){return D};else if(typeof d!="function"){var F=d;d=function(I,D){for(var R=D,L=0;L<F.length;L++)R=F[L].call(I,R);return R}}else{var $=d;d=function(I,D){return $.call(I,D)}}l.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(l.push(function(I,D){return i.get.call(I,D)}),l.push(function(I,D){return i.set.call(I,D)})):r===2?l.push(i):l.push(function(I,D){return i.call(I,D)}):Object.defineProperty(n,a,s))}function g(l,n,u){for(var a=[],r,b,v=new Map,T=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,P;if(h?(x=l,s=s-5,b=b||[],P=b):(x=l.prototype,r=r||[],P=r),s!==0&&!i){var C=h?T:v,M=C.get(d)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!M&&s>2?C.set(d,s):C.set(d,!0)}m(a,x,p,d,s,h,i,P,u)}}return y(a,r),y(a,b),a}function y(l,n){n&&l.push(function(u){for(var a=0;a<n.length;a++)n[a].call(u);return u})}function E(l,n,u){if(n.length>0){for(var a=[],r=l,b=l.name,v=n.length-1;v>=0;v--){var T={v:!1};try{var w=n[v](r,{kind:"class",name:b,addInitializer:f(a,T),metadata:u})}finally{T.v=!0}w!==void 0&&(c(10,w),r=w)}return[S(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function S(l,n){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,a,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),T=g(n,u,v);return a.length||S(n,v),{e:T,get c(){return E(n,a,v)}}}}function ri(f,t,e,o){return(ri=js())(f,t,e,o)}var oi,Wn,ni,ii,si,ai,li,ci,ui,Yn,Zn,qn,Jn,Kn,Qn,kn,ti,$s;oi=K({selector:"potatno-node-graph",template:To,style:xo}),ni=G.state({complexValue:!0}),ii=G.state(),si=G.state(),ai=G.state({complexValue:!0}),li=G.state({complexValue:!0}),ci=G.state({complexValue:!0}),ui=nt("canvasWrapper");var ei=class{static{({e:[Yn,Zn,qn,Jn,Kn,Qn,kn,ti],c:[$s,Wn]}=ri(this,[[ni,1,"mCachedGraphData"],[ii,1,"mTransformVersion"],[si,1,"mShowSelectionBox"],[ai,1,"mSelectionBoxScreen"],[li,1,"mAddNodePopup"],[ci,1,"mTempConnection"],[ui,1,"canvasWrapper"]],[oi]))}constructor(t=O.use(z),e=O.use(Q)){this.mCachedGraphData={visibleNodes:[]},this.mClipboard=new Be,this.mComponent=t,this.mDocumentPointerMoveHandler=null,this.mDocumentPointerUpHandler=null,this.mHoveredPort=null,this.mInteraction=new ze,this.mInteractionState={mode:"idle"},this.mKeyboardHandler=null,this.mManager=e,this.mSelectedNodes=new Set,this.mUnsubscribe=null}mClipboard;mComponent;mInteraction;mManager;mSelectedNodes;mDocumentPointerMoveHandler;mDocumentPointerUpHandler;mHoveredPort;mInteractionState;mKeyboardHandler;mUnsubscribe;#t=(ti(this),Yn(this));get mCachedGraphData(){return this.#t}set mCachedGraphData(t){this.#t=t}#e=Zn(this,0);get mTransformVersion(){return this.#e}set mTransformVersion(t){this.#e=t}#r=qn(this,!1);get mShowSelectionBox(){return this.#r}set mShowSelectionBox(t){this.#r=t}#o=Jn(this,{x1:0,x2:0,y1:0,y2:0});get mSelectionBoxScreen(){return this.#o}set mSelectionBoxScreen(t){this.#o=t}#n=Kn(this,null);get mAddNodePopup(){return this.#n}set mAddNodePopup(t){this.#n=t}#i=Qn(this,null);get mTempConnection(){return this.#i}set mTempConnection(t){this.#i=t}#s=kn(this);get canvasWrapper(){return this.#s}set canvasWrapper(t){this.#s=t}get canvasInteraction(){return this.mInteraction}get gridBackgroundStyle(){return this.mTransformVersion,this.mInteraction.getGridBackgroundCss()}get gridTransformStyle(){return this.mTransformVersion,"transform: "+this.mInteraction.getTransformCss()}get gridSize(){return Z.GRID_SIZE}get tempConnection(){return this.mTempConnection}get showSelectionBox(){return this.mShowSelectionBox}get selectionBoxStyle(){let t=Math.min(this.mSelectionBoxScreen.x1,this.mSelectionBoxScreen.x2),e=Math.min(this.mSelectionBoxScreen.y1,this.mSelectionBoxScreen.y2),o=Math.abs(this.mSelectionBoxScreen.x2-this.mSelectionBoxScreen.x1),c=Math.abs(this.mSelectionBoxScreen.y2-this.mSelectionBoxScreen.y1);return`left: ${t}px; top: ${e}px; width: ${o}px; height: ${c}px`}get visibleNodes(){return this.mCachedGraphData.visibleNodes}get showAddNodePopup(){return this.mAddNodePopup!==null}get addNodePopupStyle(){let t=this.mAddNodePopup;return t?`left: ${t.screenX}px; top: ${t.screenY}px`:""}onConnect(){this.mKeyboardHandler=t=>this.onKeyDown(t),document.addEventListener("keydown",this.mKeyboardHandler),this.mUnsubscribe=this.mManager.subscribe(_.Document|_.Function|_.SpecialActiveFunction|_.Node|_.Connection,null,t=>{((t.changeType&_.Document)>0||(t.changeType&_.Function)>0||(t.changeType&_.SpecialActiveFunction)>0)&&this.resetForActiveFunction(),this.invalidateGraphContent(),this.mComponent.updater.update()}),this.invalidateGraphContent()}onDeconstruct(){this.stopDocumentPointerTracking(),this.mUnsubscribe?.(),this.mUnsubscribe=null,this.mKeyboardHandler&&(document.removeEventListener("keydown",this.mKeyboardHandler),this.mKeyboardHandler=null)}onCanvasPointerDown(t){if(this.closeAddNodePopup(),t.button===1){t.preventDefault(),this.mInteractionState={mode:"panning",startX:t.clientX,startY:t.clientY},this.startDocumentPointerTracking();return}if(t.button!==0)return;t.ctrlKey||(this.mSelectedNodes.clear(),this.invalidateNodeVisuals());let e=this.getLocalPointerPosition(t.clientX,t.clientY);this.mInteractionState={mode:"selecting"},this.mSelectionBoxScreen={x1:e.x,x2:e.x,y1:e.y,y2:e.y},this.mShowSelectionBox=!1,this.startDocumentPointerTracking()}onCanvasWheel(t){t.preventDefault();let e=this.getLocalPointerPosition(t.clientX,t.clientY);this.mInteraction.zoomAt(e.x,e.y,t.deltaY>0?-.1:.1),this.mTransformVersion++}onContextMenu(t){t.preventDefault(),!this.eventPathContainsGraphNode(t)&&this.openAddNodePopupAtPointer(t.clientX,t.clientY)}onNodePointerDown(t,e){for(let m of t.composedPath())if(m instanceof HTMLElement&&m.tagName.toLowerCase()==="potatno-port")return;if(t.stopPropagation(),this.closeAddNodePopup(),t.button!==0)return;t.ctrlKey?this.mSelectedNodes.has(e)?this.mSelectedNodes.delete(e):this.mSelectedNodes.add(e):this.mSelectedNodes.has(e)||(this.mSelectedNodes.clear(),this.mSelectedNodes.add(e)),this.invalidateNodeVisuals();let o=Z.GRID_SIZE,c=new Map;for(let m of this.mSelectedNodes)c.set(m,{originX:m.transformation.x*o,originY:m.transformation.y*o});e.category===st.Comment&&this.addCommentContainedNodeOrigins(e,c),this.mInteractionState={mode:"dragging-node",origins:c,startX:t.clientX,startY:t.clientY},this.startDocumentPointerTracking()}onPortDragStart(t){let e=this.canvasWrapper.getBoundingClientRect(),o=t.value.element.getBoundingClientRect(),c=(o.left+o.width/2-e.left-this.mInteraction.panX)/this.mInteraction.zoom,m=(o.top+o.height/2-e.top-this.mInteraction.panY)/this.mInteraction.zoom;this.closeAddNodePopup(),this.mInteractionState={mode:"dragging-wire",sourcePort:t.value.port,startX:c,startY:m},this.startDocumentPointerTracking()}onPortHover(t){this.mHoveredPort={node:t.value.node,port:t.value.port}}onPortLeave(){this.mHoveredPort=null}onNodeResizeStart(t){this.closeAddNodePopup(),this.mInteractionState={mode:"resizing-comment",node:t.value.node,originalH:t.value.node.transformation.height,originalW:t.value.node.transformation.width,startX:t.value.startX,startY:t.value.startY},this.startDocumentPointerTracking()}onAddNodePopupNodeSelect(t){this.insertNodeFromAddPopup(t.value)}onAddNodePopupClose(){this.closeAddNodePopup()}onDocumentPointerMove(t){let e=this.mInteractionState;if(e.mode==="panning"){this.mInteraction.pan(t.clientX-e.startX,t.clientY-e.startY),e.startX=t.clientX,e.startY=t.clientY,this.mTransformVersion++;return}if(e.mode==="dragging-node"){this.dragSelectedNodes(t,e);return}if(e.mode==="dragging-wire"){this.renderDraggedWire(t,e);return}if(e.mode==="selecting"){let o=this.getLocalPointerPosition(t.clientX,t.clientY);this.mSelectionBoxScreen={x1:this.mSelectionBoxScreen.x1,x2:o.x,y1:this.mSelectionBoxScreen.y1,y2:o.y},this.mShowSelectionBox=Math.abs(this.mSelectionBoxScreen.x2-this.mSelectionBoxScreen.x1)>5||Math.abs(this.mSelectionBoxScreen.y2-this.mSelectionBoxScreen.y1)>5;return}if(e.mode==="resizing-comment"){let o=Z.GRID_SIZE,c=(t.clientX-e.startX)/this.mInteraction.zoom,m=(t.clientY-e.startY)/this.mInteraction.zoom;this.mManager.graph.transformNode(e.node,{width:e.originalW+Math.round(c/o),height:e.originalH+Math.round(m/o)}),this.rebuildVisibleNodePositions();return}}onDocumentPointerUp(t){let e=this.mInteractionState;e.mode==="dragging-wire"?this.completeWireDrag(t):e.mode==="selecting"&&(this.mShowSelectionBox=!1,this.selectNodesInBox()),this.mInteractionState={mode:"idle"},this.stopDocumentPointerTracking()}onKeyDown(t){if(!this.isTextEditingActive()){if(t.key==="Delete"){this.deleteSelectedNodes();return}if(t.ctrlKey&&t.key==="z"){t.preventDefault(),t.shiftKey?this.mManager.history.redo():this.mManager.history.undo();return}if(t.ctrlKey&&t.key==="y"){t.preventDefault(),this.mManager.history.redo();return}if(t.ctrlKey&&t.key==="c"){this.mClipboard.copy(this.mSelectedNodes);return}t.ctrlKey&&t.key==="v"&&(t.preventDefault(),this.pasteFromClipboard())}}addCommentContainedNodeOrigins(t,e){let o=this.mManager.activeFunction;if(!o)return;let c=Z.GRID_SIZE,m=t.transformation.x*c,g=t.transformation.y*c,y=m+t.transformation.width*c,E=g+t.transformation.height*c;for(let S of o.nodes){if(S===t||this.mSelectedNodes.has(S)||S.category===st.Comment)continue;let l=S.transformation.x*c,n=S.transformation.y*c;l>=m&&l<=y&&n>=g&&n<=E&&e.set(S,{originX:l,originY:n})}}closeAddNodePopup(){this.mAddNodePopup=null}completeWireDrag(t){if(this.mTempConnection=null,this.mInteractionState.mode!=="dragging-wire")return;let e=this.mInteractionState.sourcePort,o=this.mHoveredPort?.port??this.hitTestPort(t.clientX,t.clientY);!o||e===o||e.direction===o.direction||e.portType!==o.portType||this.mManager.graph.connectPorts(e,o)}hitTestPort(t,e){return this.mManager.grid.getPortFromPosition(t,e)}calculateNodeGridHeight(t){return t.category===st.Comment?t.transformation.height:t.category===st.Reroute?2:1+Math.max(t.inputs.list.length,t.outputs.list.length,1)}deleteSelectedNodes(){for(let t of this.mSelectedNodes)this.mManager.graph.removeNode(t);this.mSelectedNodes.clear()}dragSelectedNodes(t,e){let o=this.mInteraction.zoom,c=Z.GRID_SIZE,m=(t.clientX-e.startX)/o,g=(t.clientY-e.startY)/o;for(let[y,E]of e.origins){let S=this.mInteraction.snapToGrid(E.originX+m,E.originY+g);this.mManager.graph.transformNode(y,{x:Math.round(S.x/c),y:Math.round(S.y/c)})}this.rebuildVisibleNodePositions()}eventPathContainsGraphNode(t){for(let e of t.composedPath())if(e instanceof HTMLElement&&e.tagName.toLowerCase()==="potatno-node")return!0;return!1}getCanvasWrapperOrNull(){try{return this.canvasWrapper}catch{return null}}getLocalPointerPosition(t,e){let o=this.getCanvasWrapperOrNull();if(!o)return{x:0,y:0};let c=o.getBoundingClientRect();return{x:t-c.left,y:e-c.top}}getWorldPointerPosition(t,e){let o=this.getLocalPointerPosition(t,e);return this.mInteraction.screenToWorld(o.x,o.y)}invalidateGraphContent(){this.rebuildGraphData()}invalidateNodeVisuals(){this.rebuildGraphData()}insertNodeAt(t,e){if(!this.mManager.activeFunction)return;let o=Z.GRID_SIZE,c=this.mInteraction.snapToGrid(e.x,e.y),m=this.mManager.graph.addNode(this.mManager.activeFunction,t,{height:4,width:10,x:Math.round(c.x/o),y:Math.round(c.y/o)});this.mSelectedNodes.clear(),this.mSelectedNodes.add(m),this.closeAddNodePopup()}insertNodeFromAddPopup(t){let e=this.mAddNodePopup;e&&this.insertNodeAt(t,{x:e.worldX,y:e.worldY})}isTextEditingActive(){let t=document.activeElement;return t instanceof HTMLInputElement||t instanceof HTMLTextAreaElement||t instanceof HTMLSelectElement}openAddNodePopupAtPointer(t,e){let o=this.getCanvasWrapperOrNull(),c=this.getLocalPointerPosition(t,e),m=this.mInteraction.screenToWorld(c.x,c.y),g=280,y=320,E=Math.max(0,(o?.clientWidth??g)-g-8),S=Math.max(0,(o?.clientHeight??y)-y-8);this.mAddNodePopup={screenX:Math.max(8,Math.min(c.x,E)),screenY:Math.max(8,Math.min(c.y,S)),worldX:m.x,worldY:m.y}}pasteFromClipboard(){let t=this.mManager.activeFunction;if(!t)return;let e=this.mClipboard.paste(t,t.document,2,2);if(e.length!==0){this.mSelectedNodes.clear();for(let o of e)this.mSelectedNodes.add(o)}}rebuildGraphData(){let t=[],e=this.mManager.activeFunction;if(e){let o=Z.GRID_SIZE;for(let c of e.nodes){let m=Math.max(c.transformation.height,this.calculateNodeGridHeight(c));t.push({node:c,pixelH:m*o,pixelW:c.transformation.width*o,pixelX:c.transformation.x*o,pixelY:c.transformation.y*o,selected:this.mSelectedNodes.has(c)})}}this.mCachedGraphData={visibleNodes:t}}rebuildVisibleNodePositions(){let t=Z.GRID_SIZE;this.mCachedGraphData={visibleNodes:this.mCachedGraphData.visibleNodes.map(e=>({node:e.node,pixelH:Math.max(e.node.transformation.height,this.calculateNodeGridHeight(e.node))*t,pixelW:e.node.transformation.width*t,pixelX:e.node.transformation.x*t,pixelY:e.node.transformation.y*t,selected:e.selected}))}}renderDraggedWire(t,e){let o=this.getWorldPointerPosition(t.clientX,t.clientY);this.mTempConnection={start:{x:e.startX,y:e.startY},end:o}}resetForActiveFunction(){this.mHoveredPort=null,this.mInteractionState={mode:"idle"},this.mSelectedNodes.clear(),this.mTempConnection=null,this.stopDocumentPointerTracking(),this.closeAddNodePopup()}selectNodesInBox(){let t=this.mManager.activeFunction;if(!t)return;let e=this.mInteraction.screenToWorld(Math.min(this.mSelectionBoxScreen.x1,this.mSelectionBoxScreen.x2),Math.min(this.mSelectionBoxScreen.y1,this.mSelectionBoxScreen.y2)),o=this.mInteraction.screenToWorld(Math.max(this.mSelectionBoxScreen.x1,this.mSelectionBoxScreen.x2),Math.max(this.mSelectionBoxScreen.y1,this.mSelectionBoxScreen.y2)),c=Z.GRID_SIZE;for(let m of t.nodes){let g=m.transformation.x*c,y=m.transformation.y*c,E=g+m.transformation.width*c,S=y+m.transformation.height*c;g<o.x&&E>e.x&&y<o.y&&S>e.y&&this.mSelectedNodes.add(m)}this.invalidateNodeVisuals()}startDocumentPointerTracking(){this.stopDocumentPointerTracking(),this.mDocumentPointerMoveHandler=t=>this.onDocumentPointerMove(t),this.mDocumentPointerUpHandler=t=>this.onDocumentPointerUp(t),document.addEventListener("pointermove",this.mDocumentPointerMoveHandler),document.addEventListener("pointerup",this.mDocumentPointerUpHandler)}stopDocumentPointerTracking(){this.mDocumentPointerMoveHandler&&(document.removeEventListener("pointermove",this.mDocumentPointerMoveHandler),this.mDocumentPointerMoveHandler=null),this.mDocumentPointerUpHandler&&(document.removeEventListener("pointerup",this.mDocumentPointerUpHandler),this.mDocumentPointerUpHandler=null)}static{Wn()}};var hi=`:host {\r
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
`;var di=`<div class="properties-header">Properties</div>\r
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
                    <input class="port-name-input" type="text" [value]="this.input.name" [disabled]="this.inputsDisabled" pattern="[a-zA-Z][a-zA-Z0-9_]*" title="Must start with a letter, use only letters, digits, underscores" (change)="this.onInputNameChange(this.index, $event)" />
                    <select class="port-type-input" [disabled]="this.inputsDisabled" (change)="this.onInputTypeChange(this.index, $event)">
                        $for(t of this.availableTypes) {\r
                            <option [value]="this.t" [selected]="this.t === this.input.type">{{this.t}}</option>\r
                        }\r
                    </select>\r
                    $if(!this.inputsDisabled) {
                        <button class="port-delete-button" (click)="this.onDeleteInput(this.index)">\u2715</button>\r
                    }\r
                </div>\r
            }\r
            $if(this.functionInputs.length === 0) {\r
                <div class="empty-note">No inputs defined.</div>\r
            }\r
        </div>\r
        $if(!this.inputsDisabled) {
            <button class="add-button" (click)="this.onAddInput()">+ Add Input</button>\r
        }\r
    </div>\r
\r
    <div class="section">\r
        <div class="section-label">Outputs</div>\r
        <div class="port-list">\r
            $for(output of this.functionOutputs; index = $index) {\r
                <div class="port-entry">\r
                    <input class="port-name-input" type="text" [value]="this.output.name" [disabled]="this.outputsDisabled" pattern="[a-zA-Z][a-zA-Z0-9_]*" title="Must start with a letter, use only letters, digits, underscores" (change)="this.onOutputNameChange(this.index, $event)" />
                    <select class="port-type-input" [disabled]="this.outputsDisabled" (change)="this.onOutputTypeChange(this.index, $event)">
                        $for(t of this.availableTypes) {\r
                            <option [value]="this.t" [selected]="this.t === this.output.type">{{this.t}}</option>\r
                        }\r
                    </select>\r
                    $if(!this.outputsDisabled) {
                        <button class="port-delete-button" (click)="this.onDeleteOutput(this.index)">\u2715</button>\r
                    }\r
                </div>\r
            }\r
            $if(this.functionOutputs.length === 0) {\r
                <div class="empty-note">No outputs defined.</div>\r
            }\r
        </div>\r
        $if(!this.outputsDisabled) {
            <button class="add-button" (click)="this.onAddOutput()">+ Add Output</button>\r
        }\r
    </div>\r
\r
    <div class="section">\r
        <div class="section-label">Imports</div>\r
        <div class="port-list">\r
            $for(imp of this.functionImports; index = $index) {\r
                <div class="import-entry">\r
                    <span class="import-name">{{this.imp.label}}</span>
                    $if(!this.importsDisabled) {
                        <button class="port-delete-button" (click)="this.onDeleteImport(this.index)">\u2715</button>\r
                    }\r
                </div>\r
            }\r
            $if(this.functionImports.length === 0) {\r
                <div class="empty-note">No imports added.</div>\r
            }\r
        </div>\r
        $if(!this.importsDisabled) {
            $if(this.unusedImports.length > 0) {\r
                <div class="add-import-row">\r
                    <select class="import-select" (change)="this.onImportSelectChange($event)">\r
                        $for(avail of this.unusedImports) {\r
                            <option [value]="this.avail.id">{{this.avail.label}}</option>
                        }\r
                    </select>\r
                    <button class="add-button" (click)="this.onAddSelectedImport()">+ Add</button>\r
                </div>\r
            }\r
        }\r
    </div>\r
</div>\r
`;function Bs(){function f(l,n){return function(a){e(n,"addInitializer"),o(a,"An initializer"),l.push(a)}}function t(l,n,u,a,r,b,v,T,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+n:n,static:b,private:v,metadata:T},d={v:!1};s.addInitializer=f(a,d);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return l(w,s)}finally{d.v=!0}}function e(l,n){if(l.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(l,n){if(typeof l!="function")throw new TypeError(n+" must be a function")}function c(l,n){var u=typeof n;if(l===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var a;throw l===0?a="field":l===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function m(l,n,u,a,r,b,v,T,w){var p=u[0],s,d,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,P;if(typeof p=="function")h=t(p,a,s,T,r,b,v,w,i),h!==void 0&&(c(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,P=h.set||i.set,i={get:x,set:P}):i=h);else for(var C=p.length-1;C>=0;C--){var M=p[C];if(h=t(M,a,s,T,r,b,v,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,P=h.set||i.set,i={get:x,set:P}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(I,D){return D};else if(typeof d!="function"){var F=d;d=function(I,D){for(var R=D,L=0;L<F.length;L++)R=F[L].call(I,R);return R}}else{var $=d;d=function(I,D){return $.call(I,D)}}l.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(l.push(function(I,D){return i.get.call(I,D)}),l.push(function(I,D){return i.set.call(I,D)})):r===2?l.push(i):l.push(function(I,D){return i.call(I,D)}):Object.defineProperty(n,a,s))}function g(l,n,u){for(var a=[],r,b,v=new Map,T=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,P;if(h?(x=l,s=s-5,b=b||[],P=b):(x=l.prototype,r=r||[],P=r),s!==0&&!i){var C=h?T:v,M=C.get(d)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!M&&s>2?C.set(d,s):C.set(d,!0)}m(a,x,p,d,s,h,i,P,u)}}return y(a,r),y(a,b),a}function y(l,n){n&&l.push(function(u){for(var a=0;a<n.length;a++)n[a].call(u);return u})}function E(l,n,u){if(n.length>0){for(var a=[],r=l,b=l.name,v=n.length-1;v>=0;v--){var T={v:!1};try{var w=n[v](r,{kind:"class",name:b,addInitializer:f(a,T),metadata:u})}finally{T.v=!0}w!==void 0&&(c(10,w),r=w)}return[S(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function S(l,n){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,a,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),T=g(n,u,v);return a.length||S(n,v),{e:T,get c(){return E(n,a,v)}}}}function fi(f,t,e,o){return(fi=Bs())(f,t,e,o)}var gi,mi,Gs;gi=K({selector:"potatno-panel-properties",template:di,style:hi});var pi=class{static{({c:[Gs,mi]}=fi(this,[],[gi]))}constructor(t=O.use(z),e=O.use(Q)){this.mComponent=t,this.mManager=e,this.mSelectedImportId="",this.mUnsubscribe=null}mComponent;mManager;mSelectedImportId;mUnsubscribe;get availableImports(){return this.mManager.project?.imports.map(t=>({id:t.id,label:t.label}))??[]}get availableTypes(){let t=this.mManager.project;if(!t)return[];let e=new Set;for(let[o]of t.types.types)e.add(o);return[...e].sort()}get functionImportIds(){return[...this.mManager.activeFunction?.imports??[]]}get functionImports(){let t=new Map(this.availableImports.map(e=>[e.id,e]));return this.functionImportIds.map(e=>t.get(e)??{id:e,label:e})}get functionInputs(){return(this.mManager.activeFunction?.inputs??[]).map(t=>({name:t.label,type:t.dataType}))}get functionName(){return this.mManager.activeFunction?.label??""}get functionOutputs(){return(this.mManager.activeFunction?.outputs??[]).map(t=>({name:t.label,type:t.dataType}))}get isSystem(){return this.mManager.activeFunction?.isSystem??!1}get nameDisabled(){return this.isSystem}get importsDisabled(){return this.hasStaticFlag(it.imports)}get inputsDisabled(){return this.hasStaticFlag(it.inputs)}get outputsDisabled(){return this.hasStaticFlag(it.outputs)}get unusedImports(){let t=new Set(this.functionImportIds);return this.availableImports.filter(e=>!t.has(e.id))}onConnect(){this.mUnsubscribe=this.mManager.subscribe(_.Document|_.Function|_.SpecialActiveFunction,null,()=>{this.mComponent.updater.update()})}onDeconstruct(){this.mUnsubscribe?.(),this.mUnsubscribe=null}onAddSelectedImport(){let t=this.unusedImports,e=this.mSelectedImportId||(t.length>0?t[0].id:"");e&&(this.mManager.updateFunctionProperties({imports:[...this.functionImportIds,e]}),this.mSelectedImportId="")}onAddInput(){let t=this.availableTypes.length>0?this.availableTypes[0]:"number";this.mManager.updateFunctionProperties({inputs:[...this.functionInputs,{name:this.uniquePortName("new_input"),type:t}]})}onAddOutput(){let t=this.availableTypes.length>0?this.availableTypes[0]:"number";this.mManager.updateFunctionProperties({outputs:[...this.functionOutputs,{name:this.uniquePortName("new_output"),type:t}]})}onDeleteImport(t){let e=[...this.functionImportIds];e.splice(t,1),this.mManager.updateFunctionProperties({imports:e})}onDeleteInput(t){let e=[...this.functionInputs];e.splice(t,1),this.mManager.updateFunctionProperties({inputs:e})}onDeleteOutput(t){let e=[...this.functionOutputs];e.splice(t,1),this.mManager.updateFunctionProperties({outputs:e})}onImportSelectChange(t){this.mSelectedImportId=t.target.value}onInputNameChange(t,e){let o=e.target,c=o.value,m=!this.validateName(c)||this.isNameDuplicate(c,"input",t);o.style.borderColor=m?"var(--pn-accent-danger)":"";let g=[...this.functionInputs];g[t]={...g[t],name:c},this.mManager.updateFunctionProperties({inputs:g})}onInputTypeChange(t,e){let o=e.target.value,c=[...this.functionInputs];c[t]={...c[t],type:o},this.mManager.updateFunctionProperties({inputs:c})}onNameChange(t){let e=t.target,o=e.value,c=!this.validateName(o)||this.isNameDuplicate(o,"function");e.style.borderColor=c?"var(--pn-accent-danger)":"",this.mManager.updateFunctionProperties({name:o})}onOutputNameChange(t,e){let o=e.target,c=o.value,m=!this.validateName(c)||this.isNameDuplicate(c,"output",t);o.style.borderColor=m?"var(--pn-accent-danger)":"";let g=[...this.functionOutputs];g[t]={...g[t],name:c},this.mManager.updateFunctionProperties({outputs:g})}onOutputTypeChange(t,e){let o=e.target.value,c=[...this.functionOutputs];c[t]={...c[t],type:o},this.mManager.updateFunctionProperties({outputs:c})}isNameDuplicate(t,e,o){if(e!=="function"&&t===this.functionName)return!0;let c=this.functionInputs;for(let g=0;g<c.length;g++)if(!(e==="input"&&g===o)&&c[g].name===t)return!0;let m=this.functionOutputs;for(let g=0;g<m.length;g++)if(!(e==="output"&&g===o)&&m[g].name===t)return!0;return!1}hasStaticFlag(t){let e=this.mManager.activeFunction;if(!e)return!0;let o=e.project.getFunction(e.definitionId);return o?(o.statics&t)!==0:!0}uniquePortName(t){if(!this.isNameDuplicate(t,"function"))return t;let e=2;for(;this.isNameDuplicate(`${t}_${e}`,"function");)e++;return`${t}_${e}`}validateName(t){return/^[a-zA-Z][a-zA-Z0-9_]*$/.test(t)}static{mi()}};var rt=class{static MAIN="MAIN";mBuild;mDefaultParameters;mFunction;mTypes;get defaultParameters(){return this.mDefaultParameters}get function(){return this.mFunction}get types(){return this.mTypes}constructor(t,e){this.mFunction=t,this.mDefaultParameters=e.defaultParameters,this.mTypes=new Set(e.types),this.mBuild=e.build}compile(t,e){return this.mBuild({defaultParameters:this.mDefaultParameters,function:this.mFunction,projectTypes:t.entryPoint.function.project.types},t,e)}};var vi=`:host {\r
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
`;var yi=`<div class="resize-handle" (pointerdown)="this.onResizePointerDown($event)"></div>
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
                        <option [value]="this.display.id" [selected]="this.display.id === this.selectedDisplayId">{{this.display.label}}</option>
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
`;function Xs(){function f(l,n){return function(a){e(n,"addInitializer"),o(a,"An initializer"),l.push(a)}}function t(l,n,u,a,r,b,v,T,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+n:n,static:b,private:v,metadata:T},d={v:!1};s.addInitializer=f(a,d);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return l(w,s)}finally{d.v=!0}}function e(l,n){if(l.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(l,n){if(typeof l!="function")throw new TypeError(n+" must be a function")}function c(l,n){var u=typeof n;if(l===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var a;throw l===0?a="field":l===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function m(l,n,u,a,r,b,v,T,w){var p=u[0],s,d,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,P;if(typeof p=="function")h=t(p,a,s,T,r,b,v,w,i),h!==void 0&&(c(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,P=h.set||i.set,i={get:x,set:P}):i=h);else for(var C=p.length-1;C>=0;C--){var M=p[C];if(h=t(M,a,s,T,r,b,v,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,P=h.set||i.set,i={get:x,set:P}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(I,D){return D};else if(typeof d!="function"){var F=d;d=function(I,D){for(var R=D,L=0;L<F.length;L++)R=F[L].call(I,R);return R}}else{var $=d;d=function(I,D){return $.call(I,D)}}l.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(l.push(function(I,D){return i.get.call(I,D)}),l.push(function(I,D){return i.set.call(I,D)})):r===2?l.push(i):l.push(function(I,D){return i.call(I,D)}):Object.defineProperty(n,a,s))}function g(l,n,u){for(var a=[],r,b,v=new Map,T=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,P;if(h?(x=l,s=s-5,b=b||[],P=b):(x=l.prototype,r=r||[],P=r),s!==0&&!i){var C=h?T:v,M=C.get(d)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!M&&s>2?C.set(d,s):C.set(d,!0)}m(a,x,p,d,s,h,i,P,u)}}return y(a,r),y(a,b),a}function y(l,n){n&&l.push(function(u){for(var a=0;a<n.length;a++)n[a].call(u);return u})}function E(l,n,u){if(n.length>0){for(var a=[],r=l,b=l.name,v=n.length-1;v>=0;v--){var T={v:!1};try{var w=n[v](r,{kind:"class",name:b,addInitializer:f(a,T),metadata:u})}finally{T.v=!0}w!==void 0&&(c(10,w),r=w)}return[S(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function S(l,n){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,a,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),T=g(n,u,v);return a.length||S(n,v),{e:T,get c(){return E(n,a,v)}}}}function Ei(f,t,e,o){return(Ei=Xs())(f,t,e,o)}var Di,bi,Ii,wi,xi,Ws;Di=K({selector:"potatno-preview",template:yi,style:vi,modules:[we]}),Ii=nt("PreviewContainer");var Ti=class{static{({e:[wi,xi],c:[Ws,bi]}=Ei(this,[[Ii,1,"containerElement"]],[Di]))}constructor(t=O.use(z),e=O.use(Q)){this.mComponent=t,this.mDragging=!1,this.mManager=e,this.mSelectedDisplayId="",this.mSelectedOutputId="",this.mStartHeight=0,this.mStartWidth=0,this.mStartX=0,this.mStartY=0,this.mTrackedFunction=null,this.mUnsubscribe=null}mComponent;mDragging;mManager;mStartHeight;mStartWidth;mStartX;mStartY;mTrackedFunction;mUnsubscribe;mSelectedDisplayId;mSelectedOutputId;#t=(xi(this),wi(this));get containerElement(){return this.#t}set containerElement(t){this.#t=t}get displayOptions(){let t=this.mManager.activeFunction,e=this.mManager.project,o=t&&e?e.getFunction(t.definitionId):void 0;return!t||!e||!o?new Array:this.createDisplayOptions(e,this.availableDisplayIds(e,o,t,this.selectedOutputId))}get errors(){return this.mManager.integrity.errors}get hasErrors(){return!this.mManager.integrity.isValid}get outputOptions(){let t=this.mManager.activeFunction,e=this.mManager.project,o=t&&e?e.getFunction(t.definitionId):void 0;if(!t||!e||!o)return[];let c=new Array;e.preview.availableDisplays(o,rt.MAIN).length>0&&c.push({id:rt.MAIN,label:"Main"});let m=new Set;for(let g of t.getExitNodes())for(let y of g.inputs.value)m.has(y.definitionId)||e.preview.availableDisplays(o,y.resolvedDataType).length!==0&&(m.add(y.definitionId),c.push({id:y.definitionId,label:y.label}));return c}get previewDriver(){let t=this.mManager.activeFunction;if(!t)return null;if(this.selectedOutputId===rt.MAIN)return this.mManager.preview.requestDriver(t,this.selectedDisplayId);let e=this.findFunctionOutputPort(t,this.selectedOutputId);return e?this.mManager.preview.requestDriver(e,this.selectedDisplayId):null}get selectedDisplayId(){let t=this.displayOptions;return this.mSelectedDisplayId!==""&&t.some(e=>e.id===this.mSelectedDisplayId)?this.mSelectedDisplayId:t.at(0)?.id??""}get selectedOutputId(){let t=this.outputOptions;return this.mSelectedOutputId!==""&&t.some(e=>e.id===this.mSelectedOutputId)?this.mSelectedOutputId:t[0]?.id??""}get showOutputSelector(){let t=this.mManager.activeFunction,e=this.mManager.project;return!t||!e?!1:this.outputOptions.length>0}onConnect(){this.mUnsubscribe=this.mManager.subscribe(_.Document|_.Function|_.SpecialActiveFunction|_.Node|_.Connection,null,()=>{this.mComponent.updater.update()})}onDeconstruct(){this.mUnsubscribe?.(),this.mUnsubscribe=null}onDisplaySelect(t){this.mSelectedDisplayId=t.target.value,this.mComponent.updater.update()}onOutputSelect(t){this.mSelectedOutputId=t.target.value,this.mComponent.updater.update()}onResizePointerDown(t){t.preventDefault(),t.stopPropagation(),this.mDragging=!0,this.mStartX=t.clientX,this.mStartY=t.clientY;let e=this.containerElement;if(!e)return;this.mStartWidth=e.offsetWidth,this.mStartHeight=e.offsetHeight,t.target.setPointerCapture(t.pointerId);let o=m=>{if(!this.mDragging)return;let g=this.mStartX-m.clientX,y=this.mStartY-m.clientY;e.style.width=Math.max(200,this.mStartWidth+g)+"px",e.style.height=Math.max(150,this.mStartHeight+y)+"px"},c=m=>{this.mDragging=!1,m.target.releasePointerCapture(m.pointerId),document.removeEventListener("pointermove",o),document.removeEventListener("pointerup",c)};document.addEventListener("pointermove",o),document.addEventListener("pointerup",c)}availableDisplayIds(t,e,o,c){if(c===rt.MAIN)return t.preview.availableDisplays(e,rt.MAIN);let m=this.findFunctionOutputPort(o,c);return m?t.preview.availableDisplays(e,m.resolvedDataType):t.preview.availableDisplays(e)}createDisplayOptions(t,e){return e.map(o=>({id:o,label:t.preview.getDisplay(o)?.name??o}))}findFunctionOutputPort(t,e){for(let o of t.getExitNodes()){let c=o.inputs.map.get(e);if(c&&c.portType==="value")return c}return null}static{bi()}};function Ys(){function f(l,n){return function(a){e(n,"addInitializer"),o(a,"An initializer"),l.push(a)}}function t(l,n,u,a,r,b,v,T,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+n:n,static:b,private:v,metadata:T},d={v:!1};s.addInitializer=f(a,d);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return l(w,s)}finally{d.v=!0}}function e(l,n){if(l.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(l,n){if(typeof l!="function")throw new TypeError(n+" must be a function")}function c(l,n){var u=typeof n;if(l===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var a;throw l===0?a="field":l===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function m(l,n,u,a,r,b,v,T,w){var p=u[0],s,d,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,P;if(typeof p=="function")h=t(p,a,s,T,r,b,v,w,i),h!==void 0&&(c(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,P=h.set||i.set,i={get:x,set:P}):i=h);else for(var C=p.length-1;C>=0;C--){var M=p[C];if(h=t(M,a,s,T,r,b,v,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,P=h.set||i.set,i={get:x,set:P}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(I,D){return D};else if(typeof d!="function"){var F=d;d=function(I,D){for(var R=D,L=0;L<F.length;L++)R=F[L].call(I,R);return R}}else{var $=d;d=function(I,D){return $.call(I,D)}}l.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(l.push(function(I,D){return i.get.call(I,D)}),l.push(function(I,D){return i.set.call(I,D)})):r===2?l.push(i):l.push(function(I,D){return i.call(I,D)}):Object.defineProperty(n,a,s))}function g(l,n,u){for(var a=[],r,b,v=new Map,T=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,P;if(h?(x=l,s=s-5,b=b||[],P=b):(x=l.prototype,r=r||[],P=r),s!==0&&!i){var C=h?T:v,M=C.get(d)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!M&&s>2?C.set(d,s):C.set(d,!0)}m(a,x,p,d,s,h,i,P,u)}}return y(a,r),y(a,b),a}function y(l,n){n&&l.push(function(u){for(var a=0;a<n.length;a++)n[a].call(u);return u})}function E(l,n,u){if(n.length>0){for(var a=[],r=l,b=l.name,v=n.length-1;v>=0;v--){var T={v:!1};try{var w=n[v](r,{kind:"class",name:b,addInitializer:f(a,T),metadata:u})}finally{T.v=!0}w!==void 0&&(c(10,w),r=w)}return[S(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function S(l,n){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,a,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),T=g(n,u,v);return a.length||S(n,v),{e:T,get c(){return E(n,a,v)}}}}function Ai(f,t,e,o){return(Ai=Ys())(f,t,e,o)}var Ri,Si,Li,Oi,Pi,Ci,Mi,cr;Ri=K({selector:"potatno-code-editor",template:uo,style:co}),Li=nt("panelLeft"),Oi=nt("panelRight");var Ni=class{static{({e:[Pi,Ci,Mi],c:[cr,Si]}=Ai(this,[[Li,1,"panelLeft"],[Oi,1,"panelRight"],[tt,4,"project"],[tt,4,"file"],[tt,2,"triggerPreviewUpdate"]],[Ri]))}constructor(t=O.use(z),e=O.use(Q)){this.mComponent=t,this.mManager=e,this.mProject=null,this.mResizeMoveHandler=null,this.mResizeState=null,this.mResizeUpHandler=null,this.mUnsubscribe=null}mComponent;mManager;mProject;mResizeMoveHandler;mResizeState;mResizeUpHandler;mUnsubscribe;#t=(Mi(this),Pi(this));get panelLeft(){return this.#t}set panelLeft(t){this.#t=t}#e=Ci(this);get panelRight(){return this.#e}set panelRight(t){this.#e=t}get hasPreview(){let t=this.mManager.project,e=this.mManager.activeFunction;if(!t||!e)return!1;let o=t.getFunction(e.definitionId);return o?t.preview.availableDisplays(o).length>0:!1}get file(){return this.mManager.graph.document}set project(t){this.mProject=t}set file(t){this.mProject&&this.mManager.initialize(this.mProject,t)}triggerPreviewUpdate(){return this.mManager.preview.execute()}onConnect(){this.mUnsubscribe=this.mManager.subscribe(_.Document|_.Function|_.SpecialActiveFunction,null,()=>{this.mComponent.updater.update()})}onDeconstruct(){this.mUnsubscribe?.(),this.mUnsubscribe=null,this.mManager.deconstruct(),this.stopPanelResize()}onResizeLeftStart(t){t.preventDefault(),this.startPanelResize("left",t)}onResizeRightStart(t){t.preventDefault(),this.startPanelResize("right",t)}startPanelResize(t,e){this.stopPanelResize();let o=t==="left"?this.panelLeft:this.panelRight;this.mResizeState={panel:t,startWidth:o.offsetWidth,startX:e.clientX};let c=g=>{if(!this.mResizeState)return;let y=t==="left"?g.clientX-this.mResizeState.startX:this.mResizeState.startX-g.clientX;o.style.width=`${Math.max(200,Math.min(500,this.mResizeState.startWidth+y))}px`},m=()=>{document.removeEventListener("pointermove",c),document.removeEventListener("pointerup",m),this.mResizeMoveHandler=null,this.mResizeState=null,this.mResizeUpHandler=null};this.mResizeMoveHandler=c,this.mResizeUpHandler=m,document.addEventListener("pointermove",c),document.addEventListener("pointerup",m)}stopPanelResize(){this.mResizeMoveHandler&&(document.removeEventListener("pointermove",this.mResizeMoveHandler),this.mResizeMoveHandler=null),this.mResizeUpHandler&&(document.removeEventListener("pointerup",this.mResizeUpHandler),this.mResizeUpHandler=null),this.mResizeState=null}static{Si()}};var _i=`:host {\r
    display: block;\r
    width: 100%;\r
    height: 100%;\r
}\r
\r
potatno-code-editor {\r
    display: block;\r
    width: 100%;\r
    height: 100%;\r
}`;var Fi=`:host {\r
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
    --pn-grid-half-size: 5px;\r
    --pn-grid-line-color: rgba(69, 71, 90, 0.22);\r
    --pn-grid-size: 25px;\r
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
    --pn-node-button-font-size: 9px;\r
    --pn-node-font-size: var(--pn-font-size-sm);\r
    --pn-node-header-height: var(--pn-grid-size);\r
    --pn-node-min-width: 160px;\r
    --pn-node-port-body-size: 9px;\r
    --pn-node-port-cell-offset: -10px;
    --pn-node-port-gap: var(--pn-grid-size);\r
    --pn-node-port-half-size: 7px;
    --pn-node-port-size: 14px;
    --pn-node-port-tip-size: 5px;
    --pn-node-value-port-size: 10px;
    --pn-node-border-radius: 6px;\r
\r
    /* Font */\r
    --pn-font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;\r
    --pn-font-mono: 'Cascadia Code', 'Fira Code', 'Consolas', monospace;\r
    --pn-font-size-sm: 11px;\r
    --pn-font-size: 13px;\r
    --pn-font-size-lg: 14px;\r
}\r
`;var Ge=class extends se{mCodeEditor;mProject;get document(){return this.mCodeEditor.file}set document(t){this.mCodeEditor.file=t}get project(){return this.mProject}constructor(t){super(),this.mProject=t,this.addStyle(Fi),this.addStyle(_i),this.mCodeEditor=this.addContent(cr),this.mCodeEditor.project=t,this.mCodeEditor.file=new Lt(t)}async update(){return this.mCodeEditor.triggerPreviewUpdate()}};var V=class extends pt{constructor(t){super({id:t.id,label:t.label,category:t.category,regions:t.regions??null,generators:{ports:{inputs:e=>{for(let o of t.ports.inputs)e(o)},outputs:e=>{for(let o of t.ports.outputs)e(o)}},code:t.generators.code}})}};var Ue=class{mDisplays;get displayIds(){return[...this.mDisplays.keys()]}constructor(){this.mDisplays=new Map}addDisplay(t){this.mDisplays.set(t.id,t)}availableDisplays(t,e=null){let o=new Array;for(let[c,m]of this.mDisplays)m.executor.function.id===t.id&&(e===null||m.allowsType(e))&&o.push(c);return o}getDisplay(t){return this.mDisplays.get(t)??null}};var te=class f extends pt{static DEFINITION_ID="23e9319b-3b62-4dd8-858a-17d97ddee94e";constructor(){super({id:f.DEFINITION_ID,label:"Flow Conjunction",category:"Conjunction",generators:{ports:{inputs:t=>{t({label:"in",id:"in",portType:"flow"})},outputs:t=>{t({label:"out",id:"out",portType:"flow"})}},code:()=>{throw new A("Conjunction node code generators should never be called.",f)}}})}};var ee=class f extends pt{static DEFINITION_ID="a579584d-5d35-42b5-b2ba-3daddee488e0";constructor(){super({id:f.DEFINITION_ID,label:"Value Conjunction",category:"Conjunction",generators:{ports:{inputs:t=>{t({label:"in",id:"in",portType:"value",dataType:"<T>"})},outputs:t=>{t({label:"out",id:"out",portType:"value",dataType:"<T>"})}},code:()=>{throw new A("Conjunction node code generators should never be called.",f)}}})}};var He=class{mCodeGenerator;mEntryPoint;mImports;mNodeDefinitions;mPreview;mTypes;mUserFunctions;get entryPoint(){return this.mEntryPoint}get generator(){return this.mCodeGenerator}get imports(){return this.mImports}get nodeDefinitions(){return Array.from(this.mNodeDefinitions.values())}get preview(){return this.mPreview}get types(){return this.mTypes}get userFunctions(){return this.mUserFunctions}constructor(t,e,o){this.mTypes=t,this.mCodeGenerator=o.generator,this.mPreview=new Ue,this.mNodeDefinitions=new Map,this.mImports=new Array,this.mUserFunctions=new Map,this.mEntryPoint=e,this.addNodeDefinition(new te),this.addNodeDefinition(new ee)}addImport(t){this.mImports.push(t)}addNodeDefinition(t){this.mNodeDefinitions.set(t.id,t)}getFunction(t){return this.mEntryPoint.id===t?this.mEntryPoint:this.mUserFunctions.get(t)}setDynamicFunction(t){this.mUserFunctions.set(t.id,t)}};var Xe=class extends kt{constructor(){super({id:"pixelShader",label:"Pixel Shader",statics:it.inputs|it.outputs,nodes:{entry:t=>{t(new V({id:"OnPixel",label:"OnPixel",category:"event",ports:{inputs:[],outputs:[{label:"exec",id:"exec",portType:"flow"},{label:"x",id:"x",portType:"value",dataType:"number"},{label:"y",id:"y",portType:"value",dataType:"number"}]},generators:{code:e=>{let o=e.outputs.x.value,c=e.outputs.y.value;return`(${o}, ${c}) => { ${e.outputs.exec.code.inner} }`}}}))},exit:t=>{t(new V({id:"PixelResult",label:"PixelResult",category:"Output",ports:{inputs:[{label:"exec",id:"exec",portType:"flow"},{label:"red",id:"red",portType:"value",dataType:"number"},{label:"green",id:"green",portType:"value",dataType:"number"},{label:"blue",id:"blue",portType:"value",dataType:"number"}],outputs:[]},generators:{code:e=>`return [${e.inputs.red.value}, ${e.inputs.green.value}, ${e.inputs.blue.value}];`}}))}},generator:{code:{body:t=>{let e=t.graphResultOf("OnPixel");return`const ${t.function.definitionId} = ${e?.code??"() => [0, 0, 0]"};`},value:t=>`${t.function.definitionId}()`}}})}};var We=class{mTypes;get typeNames(){return Array.from(this.mTypes.keys())}get types(){return this.mTypes}constructor(t){this.mTypes=new Map;for(let[e,o]of Object.entries(t))this.mTypes.set(e,{name:e,...o})}getDefaultValue(t){return this.getType(t).default.value}getType(t){if(!this.mTypes.has(t))throw new Error(`Type "${t}" is not defined in the project types definition.`);return this.mTypes.get(t)}isGenericType(t){return typeof t!="string"?!1:/^<[^>]+>$/.test(t)}};var Ye=class extends We{constructor(){super({number:{default:{string:["0"],value:0},convert:t=>{let e=t[0],o=parseFloat(e);if(isNaN(o))throw new Error(`Invalid number: "${e}"`);return o.toString()},inputs:[{name:"value",type:"number"}]},string:{default:{string:[""],value:""},convert:t=>t[0],inputs:[{name:"value",type:"string"}]},boolean:{default:{string:["false"],value:!1},convert:t=>{let e=t[0].toLowerCase();if(e==="true")return"true";if(e==="false")return"false";throw new Error(`Invalid boolean: "${t[0]}"`)},inputs:[{name:"value",type:"boolean"}]}})}};var Ze=class extends kt{constructor(){super({id:"Helper Function",label:"Helper Function",statics:it.none,nodes:{entry:(t,e)=>{t(new pt({id:"HelperFunctionEntry",label:"Entry",category:"event",generators:{ports:{outputs:o=>{o({label:"exec",id:"exec",portType:"flow"});for(let c of e.inputs)o({label:c.label,id:c.label,portType:"value",dataType:c.dataType})},inputs:()=>{}},code:o=>`(${Object.entries(o.outputs).filter(([m])=>m!=="exec").map(([,m])=>m.value).join(", ")}) => { ${o.outputs.exec.code.inner} }`}}))},exit:(t,e)=>{t(new pt({id:"HelperFunctionReturn",label:"Return",category:"event",generators:{ports:{outputs:()=>{},inputs:o=>{o({label:"exec",id:"exec",portType:"flow"});for(let c of e.outputs)o({label:c.label,id:c.label,portType:"value",dataType:c.dataType})}},code:o=>`return { ${Object.entries(o.inputs).map(([m,g])=>`${m}: (${g.value})`).join(", ")} };`}}))}},generator:{code:{body:t=>{let e=`__fn_${t.function.id.replaceAll("-","_")}`,o=t.graphResultOf("HelperFunctionEntry");return`const ${e} = ${o?.code??"() => ({})"};`},value:t=>{let e=`__fn_${t.function.id.replaceAll("-","_")}`,o=Object.entries(t.inputs).map(([,g])=>g.value).join(", "),c=Object.entries(t.outputs).filter(([g])=>g!=="Output").map(([g,y])=>`${g}: ${y.value}`).join(", "),m=t.outputs.Output?.code.inner??"";return c===""?`${e}(${o}); ${m}`:`const { ${c} } = ${e}(${o}); ${m}`}}}})}};var qe=class extends He{mUserFunction;get userFunction(){return this.mUserFunction}constructor(){let t=new Ye,e=new Xe,o=new Ze;super(t,e,{generator:{code:c=>{let m="";for(let g of c.dependencies)m+=`${g.code}
`;return m+=c.entryPoint.code,m},values:{valueId:c=>`v_${c}`,hook:c=>`/*[${c}]*/`}}}),this.mUserFunction=o,this.setDynamicFunction(o),this.addBaseNodeDefinitions()}addBaseNodeDefinitions(){this.addNodeDefinition(new V({id:"Add",label:"Add",category:"operator",ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} + ${t.inputs.b.value};`}})),this.addNodeDefinition(new V({id:"Subtract",label:"Subtract",category:"operator",ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} - ${t.inputs.b.value};`}})),this.addNodeDefinition(new V({id:"Multiply",label:"Multiply",category:"operator",ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} * ${t.inputs.b.value};/*MULTIPLYHOOK_${t.outputs.result.value}*/`}})),this.addNodeDefinition(new V({id:"Divide",label:"Divide",category:"operator",ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} / ${t.inputs.b.value};`}})),this.addNodeDefinition(new V({id:"Modulo",label:"Modulo",category:"operator",ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} % ${t.inputs.b.value};`}})),this.addNodeDefinition(new V({id:"Equal",label:"Equal",category:"operator",ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"boolean"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} === ${t.inputs.b.value};`}})),this.addNodeDefinition(new V({id:"Not Equal",label:"Not Equal",category:"operator",ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"boolean"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} !== ${t.inputs.b.value};`}})),this.addNodeDefinition(new V({id:"Less Than",label:"Less Than",category:"operator",ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"boolean"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} < ${t.inputs.b.value};`}})),this.addNodeDefinition(new V({id:"Greater Than",label:"Greater Than",category:"operator",ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"boolean"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} > ${t.inputs.b.value};`}})),this.addNodeDefinition(new V({id:"And",label:"And",category:"operator",ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"boolean"},{label:"b",id:"b",portType:"value",dataType:"boolean"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"boolean"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} && ${t.inputs.b.value};`}})),this.addNodeDefinition(new V({id:"Or",label:"Or",category:"operator",ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"boolean"},{label:"b",id:"b",portType:"value",dataType:"boolean"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"boolean"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} || ${t.inputs.b.value};`}})),this.addNodeDefinition(new V({id:"Not",label:"Not",category:"operator",ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"boolean"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"boolean"}]},generators:{code:t=>`const ${t.outputs.result.value} = !${t.inputs.a.value};`}})),this.addNodeDefinition(new V({id:"Number to String",label:"Number to String",category:"type-conversion",ports:{inputs:[{label:"input",id:"input",portType:"value",dataType:"number"}],outputs:[{label:"output",id:"output",portType:"value",dataType:"string"}]},generators:{code:t=>`const ${t.outputs.output.value} = String(${t.inputs.input.value});`}})),this.addNodeDefinition(new V({id:"String to Number",label:"String to Number",category:"type-conversion",ports:{inputs:[{label:"input",id:"input",portType:"value",dataType:"string"}],outputs:[{label:"output",id:"output",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.output.value} = Number(${t.inputs.input.value});`}})),this.addNodeDefinition(new V({id:"Boolean to String",label:"Boolean to String",category:"type-conversion",ports:{inputs:[{label:"input",id:"input",portType:"value",dataType:"boolean"}],outputs:[{label:"output",id:"output",portType:"value",dataType:"string"}]},generators:{code:t=>`const ${t.outputs.output.value} = String(${t.inputs.input.value});`}})),this.addNodeDefinition(new V({id:"If",label:"If",category:"flow",ports:{inputs:[{label:"exec",id:"exec",portType:"flow"},{label:"condition",id:"condition",portType:"value",dataType:"boolean"}],outputs:[{label:"then",id:"then",portType:"flow"},{label:"else",id:"else",portType:"flow"}]},generators:{code:t=>`if (${t.inputs.condition.value}) {
${t.outputs.then.code.inner}
} else {
${t.outputs.else.code.inner}
}`}})),this.addNodeDefinition(new V({id:"While",label:"While",category:"flow",ports:{inputs:[{label:"exec",id:"exec",portType:"flow"},{label:"condition",id:"condition",portType:"value",dataType:"boolean"}],outputs:[{label:"body",id:"body",portType:"flow"}]},generators:{code:t=>`while (${t.inputs.condition.value}) {
${t.outputs.body.code.inner}
}`}})),this.addNodeDefinition(new V({id:"For Loop",label:"For Loop",category:"flow",ports:{inputs:[{label:"exec",id:"exec",portType:"flow"},{label:"count",id:"count",portType:"value",dataType:"number"}],outputs:[{label:"exec",id:"exec",portType:"flow"},{label:"index",id:"index",portType:"value",dataType:"number"}]},generators:{code:t=>`for (let ${t.outputs.index.value} = 0; ${t.outputs.index.value} < ${t.inputs.count.value}; ${t.outputs.index.value}++) {
${t.outputs.exec.code.inner}
}`}})),this.addNodeDefinition(new V({id:"Console Log",label:"Console Log",category:"Function",ports:{inputs:[{label:"message",id:"message",portType:"value",dataType:"string"}],outputs:[]},generators:{code:t=>`console.log(${t.inputs.message.value});`}})),this.addNodeDefinition(new V({id:"String Concat",label:"String Concat",category:"Function",ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"string"},{label:"b",id:"b",portType:"value",dataType:"string"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"string"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} + ${t.inputs.b.value};`}}))}};var re=class{mId;mLabel;mNodes;get id(){return this.mId}get label(){return this.mLabel}get nodes(){return this.mNodes}constructor(t,e){this.mId=t,this.mLabel=e,this.mNodes=new Array}addNode(t){this.mNodes.push(t)}};var Je=class extends re{constructor(){super("Math","Math"),this.addNode(new V({id:"Math.PI",label:"Math.PI",category:"value",ports:{inputs:[],outputs:[{label:"value",id:"value",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.value.value} = Math.PI;`}})),this.addNode(new V({id:"Math.E",label:"Math.E",category:"value",ports:{inputs:[],outputs:[{label:"value",id:"value",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.value.value} = Math.E;`}})),this.addNode(new V({id:"Math.abs",label:"Math.abs",category:"Function",ports:{inputs:[{label:"value",id:"value",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = Math.abs(${t.inputs.value.value});`}})),this.addNode(new V({id:"Math.floor",label:"Math.floor",category:"Function",ports:{inputs:[{label:"value",id:"value",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = Math.floor(${t.inputs.value.value});`}})),this.addNode(new V({id:"Math.random",label:"Math.random",category:"Function",ports:{inputs:[],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = Math.random();`}})),this.addNode(new V({id:"Math.sin",label:"Math.sin",category:"Function",ports:{inputs:[{label:"value",id:"value",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = Math.sin(${t.inputs.value.value});`}})),this.addNode(new V({id:"Math.cos",label:"Math.cos",category:"Function",ports:{inputs:[{label:"value",id:"value",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = Math.cos(${t.inputs.value.value});`}}))}};var Ke=class extends re{constructor(){super("Time","Time"),this.addNode(new V({id:"CurrentTime",label:"CurrentTime",category:"value",ports:{inputs:[],outputs:[{label:"seconds",id:"seconds",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.seconds.value} = (performance.now() / 1000);`}}))}};var Qe=class{mDependencies;mDocument;mEntryPoint;get code(){return this.mDocument.project.generator.code(this)}get dependencies(){return this.mDependencies}get entryPoint(){return this.mEntryPoint}constructor(t,e,o){this.mDocument=t,this.mEntryPoint=e,this.mDependencies=o}};var ke=class{mFunction;mGraphs;get code(){let t=this.mFunction.project.getFunction(this.mFunction.definitionId);if(!t)throw new A("Function result has an invalid function definition id.",this);return t.codeGenerator.body(this)}get function(){return this.mFunction}get graphs(){return Array.from(this.mGraphs.values())}constructor(t){this.mFunction=t,this.mGraphs=new Map}addGraph(t){this.mGraphs.set(t.entryNode.definitionId,t)}graphResultOf(t){return this.mGraphs.get(t)}};var tr=class{mBodyCode;mDependencies;mEntryNode;mExitNode;mNodeIds;mPorts;get code(){return this.mBodyCode}get dependencies(){return this.mDependencies}get entryNode(){return this.mEntryNode}get exitNode(){return this.mExitNode}get nodes(){return this.mNodeIds}get ports(){return this.mPorts}constructor(t){this.mBodyCode=t.bodyCode,this.mDependencies=[...t.dependencies],this.mEntryNode=t.entryNode,this.mExitNode=t.exitNode,this.mNodeIds=t.nodeIds,this.mPorts=t.portValues}};var er=class{mProject;constructor(t){this.mProject=t}generateDocument(t,e=!1){let o=[...t.functions].find(c=>c.isSystem);if(!o)throw new A("No entry point function found for code generation.",this);return this.generateFunction(o,e)}generateFunction(t,e=!1){return this.buildDocumentResult(t.document,t.getExitNodes(),e)}generateNode(t,e=!1){return this.buildDocumentResult(t.document,[t],e)}buildDocumentResult(t,e,o){if(t.validate().errors.length>0)throw new A("Code generation exited. Code graph validation failed.",this);let m={counter:{nodeIndex:0,portIndex:0},debug:o,nodeDefinitions:new Map},g=this.generateFunctionWithDependencies(m,e,new Set),y=g.shift();return new Qe(t,y,g)}countNodeEncounter(t,e){let o=new Map,c=new Set,m=new Array(t);for(;m.length>0;){let g=m.pop();if(o.set(g,(o.get(g)??0)+1),!(g===e||c.has(g))){c.add(g);for(let y of g.inputs.flow)for(let E of this.resolveFlowConjunctions(y))m.push(E.node);for(let y of g.inputs.value){let E=this.resolveValueConjunctions(y);E&&m.push(E.node)}}}return o}createScope(t,e){return{remaining:this.countNodeEncounter(t,e)}}emitNode(t,e,o,c,m){if(!t.nodeDefinitions.get(o.function)){let a=new Map;for(let r of o.function.nodeDefinitions)a.set(r.id,r);t.nodeDefinitions.set(o.function,a)}let g=t.nodeDefinitions.get(o.function).get(o.definitionId);if(!g)throw new A(`Node definition "${o.definitionId}" not found for node "${o.label}".`,this);g instanceof Gt&&e.dependencies.push(g.function);let y={},E=new Array;for(let a of o.inputs.value){let r=this.resolveInputValue(t,e,a);y[a.definitionId]=r.inputPort,this.setPortValue(e,a,r.inputPort.value),r.emitResult&&E.push(r.emitResult)}let S={};for(let a of o.outputs.list)S[a.definitionId]={value:this.generatePortValue(t,e,a),code:{inner:c[a.definitionId]??""}};let l=g.codeGenerator({inputs:y,outputs:S,code:{next:m??""}}),n=this.getGeneratedNodeId(t,e,o);t.debug&&(l=this.mProject.generator.values.hook(`start-${n}`)+l+this.mProject.generator.values.hook(`end-${n}`));let u=new Array;for(let a of E)u.push(...a.codeOutput);return u.push(l),{codeOutput:u,lastGeneratedNode:o,endFlowPort:null}}findBranchStartPoint(t){let e=this.getNodesInputFlowPorts(t),o=e.length,c=new Map,m=new Array,g=(y,E)=>{let S=(c.has(y)||c.set(y,new Set),c.get(y)),l=S.size;for(let n of E)S.add(n);return S.size>l&&m.push(y),S};for(let[y,E]of e.entries())g(E.node,[y]);for(;m.length>0;){let y=m.shift(),E=c.get(y);for(let S of this.getNodesInputFlowPorts(y))if(g(S.node,E).size===o)return S.node}throw new A("No common branch point found for merge node.",this)}generateFunctionWithDependencies(t,e,o){let c=new Array;if(e.length===0)return c;let m=e.at(0).function;o.add(m);let g=new ke(m);c.push(g);for(let y of e){let E=this.generateNodeCode(t,y);g.addGraph(E);for(let S of E.dependencies)o.has(S)||c.push(...this.generateFunctionWithDependencies(t,S.getExitNodes(),o))}return c.reverse()}generateNodeCode(t,e){let o={dependencies:new Array,nodes:new Map,ports:new Map,scope:this.createScope(e,null)},c=this.walkBackward(t,o,e,null),m=c.codeOutput.join(" ");return new tr({bodyCode:m,dependencies:o.dependencies,entryNode:c.lastGeneratedNode,exitNode:e,nodeIds:new Map(o.nodes),portValues:new Map(o.ports)})}generatePortValue(t,e,o){return e.ports.has(o)||this.setPortValue(e,o,this.mProject.generator.values.valueId(t.counter.portIndex++)),e.ports.get(o)}getGeneratedNodeId(t,e,o){if(!e.nodes.has(o)){let m=(++t.counter.nodeIndex).toString(16).toUpperCase().padStart(8,"0");e.nodes.set(o,m)}return e.nodes.get(o)}getNodesInputFlowPorts(t){let e=new Array;for(let o of t.inputs.flow)e.push(...this.resolveFlowConjunctions(o));return[...new Set(e)]}handleFlowMerge(t,e,o,c,m){let g=m.join(" "),y=this.findBranchStartPoint(o),E={},S=e.scope;try{for(let l of c){e.scope=this.createScope(l.node,y);let n=this.walkBackward(t,e,l.node,y);E[n.endFlowPort.definitionId]=n.codeOutput.join(" ")}}finally{e.scope=S}return this.emitNode(t,e,y,E,g)}resolveFlowConjunctions(t){let e=new Array;for(let o of t.connectedPorts){if(o.node.definitionId!==te.DEFINITION_ID){e.push(o);continue}let c=o.node.inputs.flow[0];!c||c.connectedPorts.size===0||e.push(...this.resolveFlowConjunctions(c))}return e}resolveInputValue(t,e,o){let c=this.resolveValueConjunctions(o);if(!c){if(this.mProject.types.isGenericType(o.dataType))throw new A("Generic value inputs must be allways connected",this);return{inputPort:{value:this.mProject.types.getType(o.dataType).convert([...o.directValue]),isDirectValue:!0},emitResult:null}}let m=c.node,g=(()=>{if(!m.hasFlowPorts){let y=e.scope.remaining.get(m);if(e.scope.remaining.set(m,y-1),y<=1)return this.emitNode(t,e,m,{})}return null})();return{inputPort:{value:this.generatePortValue(t,e,c),isDirectValue:!1},emitResult:g}}resolveValueConjunctions(t){if(t.connectedPorts.size===0)return null;let e=t.connectedPorts.values().next().value;if(e.node.definitionId!==ee.DEFINITION_ID)return e;let o=e.node.inputs.value[0];return!o||o.connectedPorts.size===0?null:this.resolveValueConjunctions(o)}setPortValue(t,e,o){t.ports.set(e,o)}walkBackward(t,e,o,c){let m={codeOutput:new Array,lastGeneratedNode:null,endFlowPort:null},g=null,y=o;for(;y!==null&&y!==c;){let E={};g!==null&&(E[g.definitionId]=m.codeOutput.join(" "),m.codeOutput=new Array);let S=m.codeOutput;m=this.emitNode(t,e,y,E),m.codeOutput=[...m.codeOutput,...S];let l=this.getNodesInputFlowPorts(y);if(l.length===0)break;l.length>1&&(m=this.handleFlowMerge(t,e,y,l,m.codeOutput),l=this.getNodesInputFlowPorts(m.lastGeneratedNode)),g=l[0]??null,y=g?.node??null}if(!m.lastGeneratedNode)throw new A(`Walk did not reach an entry node from exit "${o.label}".`,this);if(c&&y!==c)throw new A("Malformed graph. End node not reached",this);return m.endFlowPort=g,m}};var rr=class{mCachedCallable;mDisplay;mElement;mSpecifiedParameters;mTarget;get display(){return this.mDisplay}get element(){return this.mElement||(this.mElement=this.mDisplay.generate()),this.mElement}constructor(t,e){this.mDisplay=t,this.mTarget=e,this.mCachedCallable=null,this.mElement=null,this.mSpecifiedParameters={...this.mDisplay.executor.defaultParameters}}async execute(){this.mCachedCallable&&await this.mDisplay.update(this.element,this.mCachedCallable)}refresh(){let t=this.mTarget instanceof ft?this.mTarget.node.function:this.mTarget,e=(()=>{try{return new er(t.project).generateFunction(t,!0)}catch{return null}})();if(!e){this.mCachedCallable=null;return}let o=null;if(this.mTarget instanceof ft&&(o=this.resolvePortTarget(e,this.mTarget),!o)){this.mCachedCallable=null;return}let c=this.mDisplay.executor.compile(e,o);if(!this.mDisplay.allowsType(c.type)){this.mCachedCallable=null;return}let m=this.mDisplay.adapterFor(c.type);this.mCachedCallable=async g=>m(await c.execute({...this.mDisplay.executor.defaultParameters,...this.mSpecifiedParameters,...g}))}specifyParameters(t){this.mSpecifiedParameters={...this.mSpecifiedParameters,...t}}resolvePortTarget(t,e){let[o,c]=(()=>{for(let g of t.entryPoint.graphs)if(g.ports.has(e)&&g.nodes.has(e.node))return[g.ports.get(e),g.nodes.get(e.node)];return[null,null]})();if(!o||!c)return null;let m=e.direction==="input"?"start":"end";return{documentPort:e,nodeHook:e.project.generator.values.hook(`${m}-${c}`),value:o}}};var oe=class{mExecutor;mGenerate;mId;mName;mTypeAdapters;mUpdate;get executor(){return this.mExecutor}get id(){return`${this.mId}-${this.mExecutor.function.id}`}get name(){return this.mName}constructor(t,e){this.mId=e.id,this.mName=e.name,this.mExecutor=t,this.mGenerate=e.generate,this.mUpdate=e.update,this.mTypeAdapters=new Map;for(let[o,c]of Object.entries(e.typeAdapter))this.mExecutor.types.has(o)&&this.mTypeAdapters.set(o,c)}adapterFor(t){let e=t;if(!this.mTypeAdapters.has(e))throw new A(`Display "${this.mId}" has no type adapter for type "${t}".`,this);return this.mTypeAdapters.get(e)}allowsType(t){return this.mTypeAdapters.has(t)}createDriver(t){return new rr(this,t)}generate(){return this.mGenerate()}update(t,e){return this.mUpdate(t,e)}};var xe=class f extends oe{static MATRIX_SIZE=3;static VALUE_LENGTH=5;constructor(t){super(t,{id:"matrix",name:"Matrix 3x3",generate:()=>{let e=document.createElement("div");return e.style.boxSizing="border-box",e.style.display="grid",e.style.gap="2px",e.style.gridTemplateColumns=`repeat(${f.MATRIX_SIZE}, minmax(0, 1fr))`,e.style.height="100%",e.style.width="100%",e.style.fontFamily="var(--pn-font-mono)",e.style.fontSize="var(--pn-font-size-sm)",e},typeAdapter:{[rt.MAIN]:e=>e.map(o=>this.formatPreviewValue(o)),number:e=>[this.formatPreviewValue(e)],string:e=>[this.formatPreviewValue(e)],boolean:e=>[this.formatPreviewValue(e)]},update:async(e,o)=>{await this.updateMatrixPreview(e,o)}})}formatPreviewValue(t){if(typeof t=="number"){if(!Number.isFinite(t))return t.toString().slice(0,f.VALUE_LENGTH);let e=Math.trunc(Math.abs(t)).toString().length,o=Math.max(0,f.VALUE_LENGTH-e-(t<0?1:0)-1);return t.toFixed(o).slice(0,f.VALUE_LENGTH)}return String(t).slice(0,f.VALUE_LENGTH)}async updateMatrixPreview(t,e){for(;t.children.length<f.MATRIX_SIZE*f.MATRIX_SIZE;){let o=document.createElement("div");o.style.alignItems="center",o.style.background="var(--pn-bg-secondary)",o.style.border="1px solid var(--pn-border-default)",o.style.boxSizing="border-box",o.style.color="var(--pn-text-primary)",o.style.display="flex",o.style.justifyContent="center",o.style.minWidth="0",o.style.overflow="hidden",o.style.padding="2px",o.style.textOverflow="clip",o.style.whiteSpace="pre-line",t.append(o)}for(let o=0;o<f.MATRIX_SIZE;o++)for(let c=0;c<f.MATRIX_SIZE;c++){let m=o*f.MATRIX_SIZE+c,g=f.MATRIX_SIZE===1?0:c/(f.MATRIX_SIZE-1),y=f.MATRIX_SIZE===1?0:o/(f.MATRIX_SIZE-1),E=await Promise.resolve(e({x:g,y}));t.children[m].textContent=E.join(`
`)}}};var Te=class f extends oe{static PREVIEW_HEIGHT=48;static PREVIEW_WIDTH=48;constructor(t){super(t,{id:"2dCanvas",name:"Canvas 2D",generate:()=>{let e=document.createElement("canvas");return e.width=f.PREVIEW_WIDTH,e.height=f.PREVIEW_HEIGHT,e.style.width="100%",e.style.height="100%",e.style.imageRendering="pixelated",e},typeAdapter:{[rt.MAIN]:e=>e,number:e=>[e,e,e],boolean:e=>{let o=e?1:0;return[o,o,o]}},update:async(e,o)=>{await this.updateCanvasPreview(e,o)}})}async updateCanvasPreview(t,e){let o=t.getContext("2d");if(!o)return;let c=t.width,m=t.height,g=o.createImageData(c,m),y=g.data;for(let E=0;E<m;E++)for(let S=0;S<c;S++){let l=S/c,n=E/m,u=await Promise.resolve(e({x:l,y:n})),a=(E*c+S)*4;y[a]=Math.floor(Math.max(0,Math.min(1,u[0]||0))*255),y[a+1]=Math.floor(Math.max(0,Math.min(1,u[1]||0))*255),y[a+2]=Math.floor(Math.max(0,Math.min(1,u[2]||0))*255),y[a+3]=255}o.putImageData(g,0,0)}};(()=>{let f=new WebSocket("ws://127.0.0.1:8088");f.addEventListener("open",()=>{console.log("Refresh connection established")}),f.addEventListener("message",t=>{console.log("Bundle finished. Start refresh"),t.data==="REFRESH"&&window.location.reload()})})();var It=new qe;It.addImport(new Je);It.addImport(new Ke);var ji=new rt(It.entryPoint,{defaultParameters:{x:0,y:0},types:[rt.MAIN,"number","string","boolean"],build:(f,t,e)=>{let o=t.code,c=f.function.id;if(!e){let y=new Function(`${o}
return ${c};`)();return{type:rt.MAIN,execute:E=>y(E.x,E.y)}}let m=o.replace(e.nodeHook,`; return ${e.value};`),g=new Function(`${m}
return ${c};`)();return{type:e.documentPort.resolvedDataType,execute:y=>g(y.x,y.y)}}}),$i=new rt(It.userFunction,{defaultParameters:{x:0,y:0},types:["number","string","boolean"],build:(f,t,e)=>{if(!e)return{type:"number",execute:()=>0};let o=t.entryPoint.function,c=`__fn_${o.id.replaceAll("-","_")}`,m=o.inputs.map(E=>f.projectTypes.getDefaultValue(E.dataType)),g=t.code.replace(e.nodeHook,`return ${e.value};`),y=new Function(`${g}
return ${c};`)();return{type:e.documentPort.resolvedDataType,execute:()=>y(...m)}}});It.preview.addDisplay(new Te(ji));It.preview.addDisplay(new Te($i));It.preview.addDisplay(new xe(ji));It.preview.addDisplay(new xe($i));var ur=new Ge(It);ur.appendTo(document.body);ur.document=new Lt(It);Vi();async function Vi(){try{await ur.update()}catch(f){}requestAnimationFrame(Vi)}})();
//# sourceMappingURL=page.js.map
