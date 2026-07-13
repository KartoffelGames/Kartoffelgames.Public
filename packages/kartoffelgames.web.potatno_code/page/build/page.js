(()=>{var zt=class f extends Array{static newListWith(...t){let e=new f;return e.push(...t),e}clear(){this.splice(0,this.length)}clone(){return f.newListWith(...this)}distinct(){return f.newListWith(...new Set(this))}equals(t){if(this===t)return!0;if(!t||this.length!==t.length)return!1;for(let e=0;e<this.length;++e)if(this[e]!==t[e])return!1;return!0}remove(t){let e=this.indexOf(t);if(e!==-1)return this.splice(e,1)[0]}replace(t,e){let o=this.indexOf(t);if(o!==-1){let c=this[o];return this[o]=e,c}}toString(){return`[${super.join(", ")}]`}};var A=class extends Error{mTarget;get target(){return this.mTarget}constructor(t,e,o){super(t,o),this.mTarget=e}};var k=class f extends Map{add(t,e){if(!this.has(t))this.set(t,e);else throw new A("Can't add duplicate key to dictionary.",this)}clone(){return new f(this)}getAllKeysOfValue(t){return[...this.entries()].filter(c=>c[1]===t).map(c=>c[0])}getOrDefault(t,e){let o=this.get(t);return typeof o<"u"?o:e}map(t){let e=new zt;for(let o of this){let c=t(o[0],o[1]);e.push(c)}return e}};var Pt=class f{mSize;mTopItem;get size(){return this.mSize}get top(){if(this.mTopItem)return this.mTopItem.value}constructor(){this.mTopItem=null,this.mSize=0}clone(){let t=new f;return t.mTopItem=this.mTopItem,t.mSize=this.mSize,t}*entries(){let t=this.mTopItem;for(;t!==null;)yield t.value,t=t.previous}flush(){let t=new Array;for(;this.mTopItem;)t.push(this.pop());return t}pop(){if(!this.mTopItem)return;let t=this.mTopItem.value;return this.mTopItem=this.mTopItem.previous,this.mSize--,t}push(t){let e={previous:this.mTopItem,value:t};this.mTopItem=e,this.mSize++}toArray(){return[...this.entries()]}};var ie=class{mCompareFunction;constructor(t){this.mCompareFunction=t}differencesOf(t,e){let o;if(t.length===0||e.length===0){if(o=new Array,t.length===0)for(let S=0;S<e.length;S++)o.push({changeState:Tt.Insert,item:e[S]});else for(let S=0;S<t.length;S++)o.push({changeState:Tt.Remove,item:t[S]});return o}let c={1:{x:0,history:[]}},m=S=>S-1,v=t.length,y=e.length,T;for(let S=0;S<v+y+1;S++)for(let l=-S;l<S+1;l+=2){let n=l===-S||l!==S&&c[l-1].x<c[l+1].x;if(n){let a=c[l+1];T=a.x,o=a.history}else{let a=c[l-1];T=a.x+1,o=a.history}o=o.slice();let u=T-l;for(1<=u&&u<=y&&n?o.push({changeState:Tt.Insert,item:e[m(u)]}):1<=T&&T<=v&&o.push({changeState:Tt.Remove,item:t[m(T)]});T<v&&u<y&&this.mCompareFunction(t[m(T+1)],e[m(u+1)]);)T+=1,u+=1,o.push({changeState:Tt.Keep,item:t[m(T)]});if(T>=v&&u>=y)return o;c[l]={x:T,history:o}}return new Array}},Tt=function(f){return f[f.Remove=1]="Remove",f[f.Insert=2]="Insert",f[f.Keep=3]="Keep",f}({});var se=class{mNodeCache;constructor(){this.mNodeCache=new Map}start(t,e){let o=this.readFromCache(t),c=this.readFromCache(e),m=new sr;m.set(o,0);let v=new Map;v.set(o,0);let y=new Map,T=new Array;for(;m.length!==0;){let S=m.popLowest();if(T.push(S),S===c)return{path:[...this.pathTracer(S,y)].reverse(),processedNodes:T};for(let l of this.getNeighborNodes(S)){let n=(v.get(S)??Number.POSITIVE_INFINITY)+this.costOfTraversal(l,{startNode:o,endNode:c,path:this.pathTracer(S,y)}),u=v.get(l)??Number.POSITIVE_INFINITY;if(n>=u)continue;y.set(l,S),v.set(l,n);let a=n+this.heuristic(l,{startNode:o,endNode:c,path:this.pathTracer(S,y)});m.set(l,a)}}return{path:new Array,processedNodes:T}}getNeighborNodes(t){return this.neighborNodes(t).map(e=>this.readFromCache(e))}*pathTracer(t,e){let o=t;for(;yield o,!!e.has(o);)o=e.get(o)}readFromCache(t){let e=this.nodeId(t);return this.mNodeCache.has(e)?this.mNodeCache.get(e):(this.mNodeCache.set(e,t),t)}},sr=class{mExistingNodes;mList;mLowestCost;mLowestCostCounter;get length(){return this.mList.length}constructor(){this.mList=new Array,this.mExistingNodes=new Map,this.mLowestCost=Number.POSITIVE_INFINITY,this.mLowestCostCounter=0}popLowest(){if(this.mList.length===0)throw new A("Can not read next node from an empty priority list.",this);let[t,e]=(()=>{let v=null,y=0;for(let T=this.mList.length-1;T>-1;T--){let S=this.mList[T];if(S.cost===this.mLowestCost)return[S,0];(v===null||S.cost<v.cost)&&(v=S,y=0),S.cost===v.cost&&y++}if(v===null)throw new A("Lowest could not be found. Data is corrupted.",this);return[v,y]})();t.cost<this.mLowestCost&&(this.mLowestCost=t.cost,this.mLowestCostCounter=e),t.cost===this.mLowestCost&&this.mLowestCostCounter--,this.mLowestCostCounter<1&&(this.mLowestCost=Number.POSITIVE_INFINITY,this.mLowestCostCounter=0);let o=this.mExistingNodes.get(t.node),c=this.mList.length-1,m=this.mList[c];return this.mList[c]=t,this.mList[o]=m,this.mExistingNodes.set(m.node,o),this.mExistingNodes.delete(t.node),this.mList.pop().node}set(t,e){if(this.mLowestCostCounter>0&&e<this.mLowestCost&&(this.mLowestCost=e,this.mLowestCostCounter=0),e===this.mLowestCost&&this.mLowestCostCounter++,this.mExistingNodes.has(t)){let o=this.mExistingNodes.get(t),c=this.mList[o];if(c.cost===e){e===this.mLowestCost&&this.mLowestCostCounter--;return}c.cost=e;return}this.mList.push({cost:e,node:t}),this.mExistingNodes.set(t,this.mList.length-1)}};var ae=class{mDataType;mId;mLabel;mPortType;mRegions;get dataType(){return this.mDataType}get id(){return this.mId}get label(){return this.mLabel}get portType(){return this.mPortType}get regions(){return this.mRegions}constructor(t){this.mLabel=t.label,this.mId=t.id,this.mPortType=t.portType,t.portType==="value"?this.mDataType=t.dataType:this.mDataType=null,this.mRegions={add:t.regions?.add??new Array}}};var ut=class{mCategory;mCodeGenerator;mId;mLabel;mPortProvider;mRegions;get category(){return this.mCategory}get codeGenerator(){return this.mCodeGenerator}get id(){return this.mId}get inputs(){let t=!1,e=[];return this.mPortProvider.inputs(o=>{if(e.push(new ae(o)),o.portType==="flow"){if(t)throw new A(`Node definition ${this.id} has multiple input flow ports, which is not allowed.`,this);t=!0}}),e}get label(){return this.mLabel}get outputs(){let t=[];return this.mPortProvider.outputs(e=>{t.push(new ae(e))}),t}get regions(){return this.mRegions}constructor(t){this.mId=t.id,this.mLabel=t.label,this.mCategory={name:t.category.name,icon:t.category.icon??"\u25C6"},this.mCodeGenerator=t.generators.code,this.mPortProvider=t.generators.ports,this.mRegions={add:t.regions?.add??new Array,allows:t.regions?.allows??new Array,requires:t.regions?.requires??new Array}}getPort(t){return[...this.inputs,...this.outputs].find(e=>e.id===t)}};var Mt=class extends ut{mFunction;get function(){return this.mFunction}get label(){return this.mFunction.label}constructor(t){let e=(c,m,v)=>y=>{v.length===0&&y({label:c,id:c,portType:"flow"});for(let T of m)y({label:T.label,id:T.label,portType:"value",dataType:T.dataType})},o=t.project.getFunction(t.definitionId);super({id:`USERFUNCTION_${t.id}`,label:t.label,category:{name:"user function",icon:"\u0192"},generators:{ports:{inputs:e("Input",t.inputs,t.outputs),outputs:e("Output",t.outputs,t.outputs)},code:c=>o?o.codeGenerator.value({function:t,inputs:c.inputs,outputs:c.outputs,code:c.code}):""}}),this.mFunction=t}};var pt=class{mAffectedItems;mErrors;get affectedItems(){return this.mAffectedItems}get errors(){return this.mErrors}constructor(){this.mErrors=new Array,this.mAffectedItems=new Set}addAffectedItem(t){this.mAffectedItems.add(t)}merge(t){this.mErrors.push(...t.mErrors);for(let e of t.mAffectedItems)this.mAffectedItems.add(e);return this}pushError(...t){this.mErrors.push(...t)}},Z=class{mItem;mMessage;get item(){return this.mItem}get message(){return this.mMessage}constructor(t,e){this.mMessage=t,this.mItem=e}};var ht=class{mConnectedPorts;mDataType;mDefinitionId;mDirectValue;mDirection;mDocument;mLabel;mNode;mPortType;mProject;get connectedPorts(){return this.mConnectedPorts}get dataType(){return this.mDataType}get definitionId(){return this.mDefinitionId}get directValue(){return this.mDirectValue}get direction(){return this.mDirection}get document(){return this.mDocument}get label(){return this.mLabel}set label(t){this.mLabel=t}get node(){return this.mNode}get portType(){return this.mPortType}get project(){return this.mProject}get resolvedDataType(){if(this.mPortType!=="value")throw new A("Port data type couldn't be resolved as it is no value port.",this);if(!this.mProject.types.isGenericType(this.mDataType??""))return this.mDataType;if(this.mDirection==="output"){let e=this.mNode.inputs.value.find(o=>o.dataType===this.mDataType);if(!e)throw new A("Port type couldn't be resolved as it has no resolving sibling port",this);return e.resolvedDataType}return this.mConnectedPorts.size===0?this.mDataType:this.mConnectedPorts.values().next().value.resolvedDataType}constructor(t,e,o){if(o.portType==="flow"&&o.dataType!==null)throw new A("Flow ports cannot have a value type.",this);if(o.portType==="value"&&o.dataType===null)throw new A("Value ports must have a value type.",this);this.mProject=t,this.mDocument=e,this.mNode=o.node,this.mDefinitionId=o.definitionId,this.mLabel=o.label,this.mDataType=o.dataType,this.mDirection=o.direction,this.mPortType=o.portType,this.mConnectedPorts=new Set,this.mDirectValue=new Array,o.dataType&&!this.mProject.types.isGenericType(o.dataType)&&this.mDirectValue.push(...t.types.getType(o.dataType).default.string)}connect(t){if(this.mConnectedPorts.has(t))return;if(this.mPortType!==t.portType)throw new A(`Cannot connect port ${this.mDefinitionId} of node ${this.mNode.label} to port ${t.mDefinitionId} of node ${t.node.label} due to incompatible port types.`,this);if(this.mDirection===t.direction)throw new A(`Cannot connect port ${this.mDefinitionId} of node ${this.mNode.label} to port ${t.mDefinitionId} of node ${t.node.label} due to incompatible directions.`,this);if(!(this.mPortType==="flow"&&this.mDirection==="input"||this.mPortType==="value"&&this.mDirection==="output"))for(let o of Array.from(this.mConnectedPorts))this.disconnect(o);this.mConnectedPorts.add(t),t.connect(this)}disconnect(t){this.mConnectedPorts.has(t)&&(this.mConnectedPorts.delete(t),t.disconnect(this))}setDirectValue(t){if(this.mPortType!=="value")throw new A("Only value ports can have a direct value.",this);if(this.mProject.types.isGenericType(this.mDataType))throw new A("Generic value ports cannot have a direct value.",this);if(t.length!==this.mProject.types.getType(this.mDataType).default.string.length)throw new A("The provided value does not match the expected length of the default value for this port's type.",this);this.mDirectValue.splice(0,this.mDirectValue.length),this.mDirectValue.push(...t)}validate(){let t=new pt;if(this.mDirection==="output"){if(this.mPortType==="flow"&&this.mConnectedPorts.size>1&&t.pushError(new Z(`Flow output port "${this.mDefinitionId}" on node "${this.mNode.label}" can only have one connection.`,this)),this.mPortType==="value"&&this.mProject.types.isGenericType(this.mDataType??"")){let e=this.mNode.inputs.value.filter(o=>o.dataType===this.mDataType);for(let o of e)o.connectedPorts.size===0&&t.pushError(new Z(`Generic output port "${this.mDefinitionId}" on node "${this.mNode.label}" cannot resolve generic type "${this.mDataType}" because its input port "${o.definitionId}" is not connected.`,this))}return t}if(this.mDirection==="input"){if(this.mPortType==="flow")return this.mConnectedPorts.size===0&&t.pushError(new Z(`Flow input port "${this.mDefinitionId}" on node "${this.mNode.label}" must have at least one connection.`,this)),t;if(this.mPortType==="value"){this.mConnectedPorts.size>1&&t.pushError(new Z(`Value input port "${this.mDefinitionId}" on node "${this.mNode.label}" can only have one connection.`,this));for(let e of this.mConnectedPorts)e.resolvedDataType!==this.resolvedDataType&&t.pushError(new Z(`Value input port "${this.mDefinitionId}" on node "${this.mNode.label}" expects type "${this.resolvedDataType}" but is connected to type "${e.resolvedDataType}".`,this));return t}}return t}};var Dt=class{mDefinitionId;mDocument;mFunction;mInputs;mLabel;mOutputs;mPreview;mProject;mTransformation;get definitionId(){return this.mDefinitionId}get document(){return this.mDocument}get function(){return this.mFunction}get hasFlowPorts(){return this.mOutputs.flow.length>0||this.mInputs.flow.length>0}get hasValuePorts(){return this.mOutputs.value.length>0||this.mInputs.value.length>0}get inputs(){return this.mInputs}get label(){return this.mLabel}set label(t){this.mLabel=t}get outputs(){return this.mOutputs}get preview(){return this.mPreview}set preview(t){this.mPreview=t}get project(){return this.mProject}get transformation(){return this.mTransformation}constructor(t,e,o,c){this.mDocument=e,this.mDefinitionId=c.definitionId,this.mFunction=o,this.mLabel=c.label,this.mPreview=c.preview??null,this.mProject=t,this.mTransformation={x:0,y:0,width:0,height:0};let m=(v,y)=>{let T={direction:y,list:new Array,map:new Map,flow:new Array,value:new Array};for(let S of v){let l=new ht(this.mProject,this.mDocument,{definitionId:S.definitionId,direction:y,label:S.label,node:this,portType:S.portType,dataType:S.dataType});T.list.push(l),T.map.set(l.definitionId,l),(l.portType==="flow"?T.flow:T.value).push(l)}return T};this.mInputs=m(c.ports.input,"input"),this.mOutputs=m(c.ports.output,"output"),this.resizeTo(c.transformation.width,c.transformation.height),this.moveTo(c.transformation.x,c.transformation.y)}moveTo(t,e){this.mTransformation.x=t,this.mTransformation.y=e}resizeTo(t,e){this.mTransformation.width=Math.max(6,t);let o=1+Math.max(this.mInputs.list.length,this.mOutputs.list.length);this.mTransformation.height=Math.max(o,e)}validate(t){let e=new pt,o=t??new Set,c=this.mFunction.nodeDefinitions.find(m=>m.id===this.mDefinitionId);if(!c)e.pushError(new Z(`Node "${this.mLabel}" definition "${this.mDefinitionId}" could not be found.`,this));else{e.merge(this.resyncPorts(this.mInputs,c.inputs)),e.merge(this.resyncPorts(this.mOutputs,c.outputs));let m=new Set([...c.regions.requires,...c.regions.allows]);if(m.size>0)for(let v of o)m.has(v)||e.pushError(new Z(`Node "${this.mLabel}" does not allow region "${v}".`,this));if(c.regions.requires.length>0)for(let v of c.regions.requires)o.has(v)||e.pushError(new Z(`Node "${this.mLabel}" requires region "${v}" but it is not active.`,this))}for(let m of[...this.mInputs.list,...this.mOutputs.list])e.merge(m.validate());return this.resizeTo(this.transformation.width,this.transformation.height),e}addPort(t,e,o){let c=new ht(this.mProject,this.mDocument,{definitionId:e.id,direction:t.direction,label:e.label,node:this,portType:e.portType,dataType:e.dataType});return t.list.splice(o,0,c),t.map.set(c.definitionId,c),(c.portType==="flow"?t.flow:t.value).push(c),c}removePort(t,e){let o=t.list.indexOf(e);if(o===-1)throw new A(`Port "${e.label}" was not found and can not be removed.`,this);t.list.splice(o,1),t.map.delete(e.definitionId);let c=e.portType==="flow"?t.flow:t.value,m=c.indexOf(e);if(o===-1)throw new A(`Port "${e.label}" was not found in typed list and can not be removed.`,this);return c.splice(m,1),o}replacePort(t,e,o){let c=Array.from(e.connectedPorts);for(let y of Array.from(e.connectedPorts))e.disconnect(y);let m=this.removePort(t,e),v=this.addPort(t,o,m);for(let y of c)v.connect(y);return v}resyncPorts(t,e){let o=new pt,c=new Set(e.map(m=>m.id));for(let m=0;m<e.length;m++){let v=e[m];if(!t.map.has(v.id)){let n=this.addPort(t,v,m);o.addAffectedItem(n);continue}let y=t.map.get(v.id),T=y.portType!==v.portType,S=y.dataType!==v.dataType;if(!T&&!S)continue;if(y.connectedPorts.size>0&&T){o.pushError(new Z(`Port "${y.label}" on node "${this.mLabel}" has a changed type.`,y));continue}let l=this.replacePort(t,y,v);o.addAffectedItem(y),o.addAffectedItem(l)}for(let m of t.list)if(!c.has(m.definitionId)){if(m.connectedPorts.size===0){o.addAffectedItem(m),this.removePort(t,m);continue}o.pushError(new Z(`Port "${m.label}" on node "${this.mLabel}" no longer exists in its definition.`,m))}return o}};var bt=class{mDefinitionId;mDocument;mId;mImportIds;mInputs;mIsSystem;mLabel;mNodes;mOutputs;mProject;get definitionId(){return this.mDefinitionId}get document(){return this.mDocument}get dynamicNodeDefinitions(){let t=this.mProject.getFunction(this.definitionId);if(!t)return[...this.mDocument.nodeDefinitions];let e=t.getNodeDefinitions(this),o=this.mProject.imports.filter(c=>this.mImportIds.has(c.id)).flatMap(c=>c.nodes);return[...this.mDocument.nodeDefinitions,...o,...e.dynamic]}get id(){return this.mId}get imports(){return this.mImportIds}get inputs(){return this.mInputs}get isSystem(){return this.mIsSystem}get label(){return this.mLabel}set label(t){this.mLabel=t}get nodeDefinitions(){let t=this.mProject.getFunction(this.definitionId);if(!t)return this.dynamicNodeDefinitions;let e=t.getNodeDefinitions(this);return[...this.dynamicNodeDefinitions,...e.entry,...e.exit]}get nodes(){return this.mNodes}get outputs(){return this.mOutputs}get project(){return this.mProject}constructor(t,e,o){this.mProject=t,this.mDocument=e,this.mLabel=o.label,this.mIsSystem=o.isSystem,this.mDefinitionId=o.definitionId,this.mId=o.id,this.mNodes=new Set,this.mInputs=new Array,this.mOutputs=new Array,this.mImportIds=new Set}addImport(t){if(!this.project.imports.some(o=>o.id===t))throw new A(`Project does not contain import ${t}`,this);this.mImportIds.add(t)}addInput(t){this.mInputs.some(e=>e.label===t.label)||this.mInputs.push(t)}addNode(t){this.mNodes.add(t)}addNodeByDefinition(t,e){let o=m=>({definitionId:m.id,label:m.label,portType:m.portType,dataType:m.dataType}),c=new Dt(this.mProject,this.mDocument,this,{definitionId:t.id,ports:{input:t.inputs.map(o),output:t.outputs.map(o)},label:t.label,transformation:e});return this.mNodes.add(c),c}addOutput(t){this.mOutputs.some(e=>e.label===t.label)||this.mOutputs.push(t)}getExitNodes(){let t=this.mProject.getFunction(this.mDefinitionId);if(!t)throw new A(`Function definition not found for function "${this.mLabel}".`,this);let e=new Set(t.getNodeDefinitions(this).exit.map(o=>o.id));return[...this.mNodes].filter(o=>e.has(o.definitionId))}removeImport(t){this.mImportIds.delete(t)}removeInput(t){let e=this.mInputs.findIndex(o=>o.label===t.label);e!==-1&&this.mInputs.splice(e,1)}removeNode(t){for(let e of[...t.inputs.list,...t.outputs.list])for(let o of Array.from(e.connectedPorts))e.disconnect(o);this.mNodes.delete(t)}removeOutput(t){let e=this.mOutputs.findIndex(o=>o.label===t.label);e!==-1&&this.mOutputs.splice(e,1)}validate(){let t=new pt,e=this.mProject.getFunction(this.mDefinitionId);e||t.pushError(new Z(`Function "${this.mLabel}" definition "${this.mDefinitionId}" could not be found.`,this));let o=e?.getNodeDefinitions(this);o&&this.resyncFunction(o,t);let c=this.collectRegions(this.mNodes,t),m=new Set(o?.entry.map(y=>y.id)??new Array),v=new Map;for(let y of this.mNodes)t.merge(y.validate(c.get(y))),this.collectEntryDomains(y,m,v).size>1&&t.pushError(new Z(`Node "${y.label}" is reachable from multiple entry nodes.`,y));return t}collectEntryDomains(t,e,o){if(o.has(t))return o.get(t);let c=new Set;o.set(t,c);for(let m of t.inputs.list)for(let v of m.connectedPorts){let y=v.node;e.has(y.definitionId)&&c.add(y);for(let T of this.collectEntryDomains(y,e,o))c.add(T)}return c}collectRegions(t,e){let o=new Map;for(let y of this.nodeDefinitions)o.set(y.id,y);let c=(()=>{let y=new Map;return(T,S)=>{if(!y.has(T.id)){let l=new Map;for(let n of T.outputs)l.set(n.id,n.regions.add);y.set(T.id,l)}return[...y.get(T.id).get(S)??new Array,...T.regions.add]}})(),m=(()=>{let y=new Map;return(T,S)=>{if(y.has(T))return y.get(T);if(S.has(T))return e.pushError(new Z(`Node "${T.label}" is part of a connection cycle.`,T)),new Set;S.add(T);let l=new Set;for(let n of T.inputs.list)for(let u of n.connectedPorts){let a=u.node;for(let r of m(a,S))l.add(r);if(o.has(a.definitionId))for(let r of c(o.get(a.definitionId),u.definitionId))l.add(r)}return y.set(T,l),l}})(),v=new Map;for(let y of t)v.set(y,m(y,new Set));return v}resyncFunction(t,e){let o=[...t.entry,...t.exit],c=new Set(this.mNodes.values().map(y=>y.definitionId)),m=0,v=20;for(let y of o){if(c.has(y.id))continue;let T=this.addNodeByDefinition(y,{x:Math.floor(m/(o.length/2))*v+2,y:m*v+2-Math.floor(m/(o.length/2))*(o.length/2*v),width:0,height:0});e.addAffectedItem(T),m++}}};var Nt=class{mFunctionNodeDefinitions;mFunctions;mProject;get functions(){return this.mFunctions}get nodeDefinitions(){return[...this.mFunctionNodeDefinitions.values(),...this.mProject.nodeDefinitions.values()]}get project(){return this.mProject}constructor(t){this.mProject=t,this.mFunctions=new Array,this.mFunctionNodeDefinitions=new Map}addFunction(t){let e=this.mFunctions.indexOf(t);e!==-1&&this.mFunctions.splice(e,1),this.mFunctions.push(t);let o=new Mt(t);return this.mFunctionNodeDefinitions.set(o.id,o),t}newFunction(t){return this.addFunction(new bt(this.mProject,this,t))}removeFunction(t){if(t.isSystem)throw new A("Cannot remove a system function.",this);let e=this.mFunctions.indexOf(t);if(e===-1)return!1;this.mFunctions.splice(e,1);for(let o of this.mFunctionNodeDefinitions.values())o.function===t&&this.mFunctionNodeDefinitions.delete(o.id);return!0}validate(){let t=new pt,e=this.mProject.entryPoint.id;if(!this.mFunctions.values().some(o=>o.definitionId===e)){let o=this.newFunction({definitionId:e,id:crypto.randomUUID(),isSystem:!0,label:this.mProject.entryPoint.label});t.addAffectedItem(o)}for(let o of this.mFunctions)t.merge(o.validate());return t.pushError(...this.detectCrossFunctionRecursion()),t}detectCrossFunctionRecursion(){let t=[],e=new Map,o=y=>{if(!e.has(y)){let T=new Set;for(let S of y.nodes)this.mFunctionNodeDefinitions.has(S.definitionId)&&T.add(this.mFunctionNodeDefinitions.get(S.definitionId).function);e.set(y,T)}return e.get(y)},c=new Set,m=new Set,v=y=>{if(!c.has(y)){if(m.has(y)){t.push(new Z(`Function "${y.label}" participates in a cross-function recursion cycle.`,y));return}m.add(y);for(let T of o(y))v(T);m.delete(y),c.add(y)}};for(let y of this.mFunctions)v(y);return t}};var tt=class f{static mComponents=new WeakMap;static mConstructorSelector=new WeakMap;static mElements=new WeakMap;static elementIsComponent(t){return f.mComponents.has(t)}static ofComponent(t){let e=t.processorConstructor,o=f.mConstructorSelector.get(e);if(!o)throw new A(`Constructor "${e.name}" is not a registered custom element`,e);let c=f.mElements.get(t);if(!c)throw new A(`Component "${t}" is not a registered component`,t);return{selector:o,constructor:e,element:c,component:t,processor:t.processor}}static ofConstructor(t){let e=f.mConstructorSelector.get(t);if(!e)throw new A(`Constructor "${t.name}" is not a registered custom element`,t);let o=globalThis.customElements.get(e);if(!o)throw new A(`Constructor "${t.name}" is not a registered custom element`,t);return{selector:e,constructor:t,elementConstructor:o}}static ofElement(t){let e=f.mComponents.get(t);if(!e)throw new A(`Element "${t}" is not a PwbComponent.`,t);return f.ofComponent(e)}static ofProcessor(t){let e=f.mComponents.get(t);if(!e)throw new A("Processor is not a PwbComponent.",t);return f.ofComponent(e)}static registerComponent(t,e,o){f.mComponents.has(e)||f.mComponents.set(e,t),o&&!f.mComponents.has(o)&&f.mComponents.set(o,t),f.mElements.has(t)||f.mElements.set(t,e)}static registerConstructor(t,e){t&&!f.mConstructorSelector.has(t)&&f.mConstructorSelector.set(t,e)}};var le=class f{static CONFIGURATION_ATTACHMENT=Symbol("PwbApplicationConfigurationAttachment");static new(t,e){let o=new f;t(o),e&&o.appendTo(e)}mContent;mCurrentTarget;mFragment;constructor(){this.mContent=new Array,this.mFragment=document.createDocumentFragment(),this.mCurrentTarget=null}addContent(t){let e=tt.ofConstructor(t).elementConstructor,o=tt.ofElement(new e);return this.mContent.push(o.component),this.mFragment.appendChild(o.element),this.updateTarget(),o.processor}addStyle(t){let e=document.createElement("style");e.textContent=t,this.mFragment.prepend(e)}appendTo(t){this.mCurrentTarget=t,this.updateTarget()}updateTarget(){this.mCurrentTarget&&(this.mCurrentTarget.shadowRoot||this.mCurrentTarget.attachShadow({mode:"open"}),this.mCurrentTarget.shadowRoot.appendChild(this.mFragment))}};var Ut=class{mCustomMetadata;constructor(){this.mCustomMetadata=new Map}getMetadata(t){return this.mCustomMetadata.get(t)??null}setMetadata(t,e){this.mCustomMetadata.set(t,e)}};var ce=class extends Ut{};var ue=class f extends Ut{static mPrivateMetadataKey=Symbol("Metadata");mDecoratorMetadataObject;mPropertyMetadata;constructor(t){super(),this.mDecoratorMetadataObject=t,this.mPropertyMetadata=new Map,t[f.mPrivateMetadataKey]=this}getInheritedMetadata(t){let e=new Array,o=this.mDecoratorMetadataObject;do{if(Object.hasOwn(o,f.mPrivateMetadataKey)){let m=o[f.mPrivateMetadataKey].getMetadata(t);m!==null&&e.push(m)}o=Object.getPrototypeOf(o)}while(o!==null);return e.reverse()}getProperty(t){return this.mPropertyMetadata.has(t)||this.mPropertyMetadata.set(t,new ce),this.mPropertyMetadata.get(t)}};Symbol.metadata??=Symbol("Symbol.metadata");var nt=class f{static mMetadataMapping=new Map;static add(t,e){return(o,c)=>{let m=f.forInternalDecorator(c.metadata);switch(c.kind){case"class":m.setMetadata(t,e);return;case"method":case"field":case"getter":case"setter":case"accessor":if(c.static)throw new Error("@Metadata.add not supported for statics.");m.getProperty(c.name).setMetadata(t,e);return}}}static forInternalDecorator(t){return f.mapMetadata(t)}static get(t){Object.hasOwn(t,Symbol.metadata)||f.polyfillMissingMetadata(t);let e=t[Symbol.metadata];return f.mapMetadata(e)}static init(){return(t,e)=>{f.forInternalDecorator(e.metadata)}}static mapMetadata(t){if(f.mMetadataMapping.has(t))return f.mMetadataMapping.get(t);let e=new ue(t);return f.mMetadataMapping.set(t,e),e}static polyfillMissingMetadata(t){let e=new Array,o=t;do e.push(o),o=Object.getPrototypeOf(o);while(o!==null);for(let c=e.length-1;c>=0;c--){let m=e[c];if(!Object.hasOwn(m,Symbol.metadata)){let v=null;c<e.length-2&&(v=e[c+1][Symbol.metadata]),m[Symbol.metadata]=Object.create(v,{})}}}};var O=class f{static mCurrentInjectionContext=null;static mInjectMode=new Map;static mInjectableConstructor=new Map;static mInjectableReplacement=new Map;static mInjectionConstructorIdentificationMetadataKey=Symbol("InjectionConstructorIdentification");static mSingletonMapping=new Map;static createObject(t,e,o){let[c,m]=typeof e=="object"&&e!==null?[!1,e]:[!!e,o??new Map],v=f.getInjectionIdentification(t);if(!f.mInjectableConstructor.has(v))throw new A(`Constructor "${t.name}" is not registered for injection and can not be built`,f);let y=c?"instanced":f.mInjectMode.get(v),T=new Map(m.entries().map(([n,u])=>[f.getInjectionIdentification(n),u])),S=f.mCurrentInjectionContext,l=new Map([...S?.localInjections.entries()??[],...T.entries()]);f.mCurrentInjectionContext={injectionMode:y,localInjections:l};try{if(!c&&y==="singleton"&&f.mSingletonMapping.has(v))return f.mSingletonMapping.get(v);let n=new t;return y==="singleton"&&!f.mSingletonMapping.has(v)&&f.mSingletonMapping.set(v,n),n}finally{f.mCurrentInjectionContext=S}}static injectable(t="instanced"){return(e,o)=>{f.registerInjectable(e,o.metadata,t)}}static registerInjectable(t,e,o){let c=f.getInjectionIdentification(t,e);f.mInjectableConstructor.set(c,t),f.mInjectMode.set(c,o)}static replaceInjectable(t,e){let o=f.getInjectionIdentification(t);if(!f.mInjectableConstructor.has(o))throw new A("Original constructor is not registered.",f);let c=f.getInjectionIdentification(e);if(!f.mInjectableConstructor.has(c))throw new A("Replacement constructor is not registered.",f);f.mInjectableReplacement.set(o,e)}static use(t){if(f.mCurrentInjectionContext===null)throw new A("Can't create object outside of an injection context.",f);let e=f.getInjectionIdentification(t);if(f.mCurrentInjectionContext.injectionMode!=="singleton"&&f.mCurrentInjectionContext.localInjections.has(e))return f.mCurrentInjectionContext.localInjections.get(e);let o=f.mInjectableReplacement.get(e);if(o||(o=f.mInjectableConstructor.get(e)),!o)throw new A(`Constructor "${t.name}" is not registered for injection and can not be built`,f);return f.createObject(o)}static getInjectionIdentification(t,e){let o=e?nt.forInternalDecorator(e):nt.get(t),c=o.getMetadata(f.mInjectionConstructorIdentificationMetadataKey);return c||(c=Symbol(t.name),o.setMetadata(f.mInjectionConstructorIdentificationMetadataKey,c)),c}};var X=function(f){return f[f.Read=1]="Read",f[f.ReadWrite=2]="ReadWrite",f[f.Write=3]="Write",f}({});var Et=class{mHooks;mInjections;mProcessor;mProcessorConstructor;get processor(){if(!this.mProcessor)throw new A("Processor is not created yet. Call setup to create processor.",this);return this.mProcessor}get processorConstructor(){return this.mProcessorConstructor}constructor(t){if(this.mProcessorConstructor=t.constructor,this.mProcessor=null,this.mInjections=new Map,this.mHooks={create:new Array},t.parent)for(let[e,o]of t.parent.mInjections.entries())this.setProcessorInjection(e,o)}deconstruct(){}getProcessorInjection(t){return this.mInjections.get(t)}setProcessorInjection(t,e){if(this.mProcessor)throw new A("Cant add injections to after construction.",this);this.mInjections.set(t,e)}setup(){return this.mProcessor=this.createProcessor(),this}addConstructionHook(t){return this.mHooks.create.push(t),this}call(t,...e){let o=Reflect.get(this.processor,t);return typeof o!="function"?null:o.apply(this.processor,e)}createProcessor(){let t=O.createObject(this.mProcessorConstructor,this.mInjections),e;for(;e=this.mHooks.create.pop();){let o=e.call(this,t);o&&(t=o)}return t}};var At=class f extends Et{constructor(t,e){super({constructor:t,parent:e}),this.setProcessorInjection(f,this)}deconstruct(){this.call("onDeconstruct"),super.deconstruct()}setup(){return super.setup(),this.call("onExecute"),this}onUpdate(){return!1}};var ar=class f{static mInstance;mCoreEntityConstructor;mProcessorConstructorConfiguration;constructor(){if(f.mInstance)return f.mInstance;f.mInstance=this,this.mCoreEntityConstructor=new Map,this.mProcessorConstructorConfiguration=new Map}get(t){let e=this.mCoreEntityConstructor.get(t);if(!e)return new Array;let o=new Array;for(let c of e)o.push({processorConstructor:c,processorConfiguration:this.mProcessorConstructorConfiguration.get(c)});return o}register(t,e,o){this.mProcessorConstructorConfiguration.set(e,o);let c=t;do{if(!(c.prototype instanceof Et)&&c!==Et)break;this.mCoreEntityConstructor.has(c)||this.mCoreEntityConstructor.set(c,new Set),this.mCoreEntityConstructor.get(c).add(e)}while(c=Object.getPrototypeOf(c))}},at=new ar;var Ht=class f extends Et{static mExtensionCache=new WeakMap;mExtensionList;constructor(t){super(t),this.mExtensionList=new Array}deconstruct(){for(let t of this.mExtensionList)t.deconstruct();super.deconstruct()}setup(){return super.setup(),this.executeExtensions(),this}executeExtensions(){let t=(()=>{if(!f.mExtensionCache.has(this.processorConstructor)){let c=at.get(At).filter(v=>{for(let y of v.processorConfiguration.targetRestrictions)if(this instanceof y||this.processorConstructor.prototype instanceof y||this.processorConstructor===y)return!0;return!1}),m={read:c.filter(v=>v.processorConfiguration.access===X.Read),write:c.filter(v=>v.processorConfiguration.access===X.Write),readWrite:c.filter(v=>v.processorConfiguration.access===X.ReadWrite)};f.mExtensionCache.set(this.processorConstructor,m)}return f.mExtensionCache.get(this.processorConstructor)})(),e=[...t.write,...t.readWrite,...t.read];for(let o of e)this.mExtensionList.push(new At(o.processorConstructor,this).setup())}};var Lt=class{mData;mInteractionType;mOrigin;get data(){return this.mData}get origin(){return this.mOrigin}get triggerType(){return this.mInteractionType}constructor(t,e,o){this.mInteractionType=t,this.mData=o,this.mOrigin=e}};var Rt=class f{static mCurrentZone=new f("Default");static get current(){return f.mCurrentZone}static create(t){return new f(t)}mInteractionListener;mName;mTriggerFilterBitmap;get name(){return this.mName}constructor(t){this.mName=t,this.mTriggerFilterBitmap=-1,this.mInteractionListener=new Map}addInteractionListener(t){return this.mInteractionListener.set(t,f.current),this}execute(t,...e){let o=f.mCurrentZone;f.mCurrentZone=this;try{return t(...e)}finally{f.mCurrentZone=o}}pushInteraction(t,e){if((this.mTriggerFilterBitmap&t)===0)return!1;if(this.mInteractionListener.size===0)return!0;let o=new Lt(t,this,e);for(let[c,m]of this.mInteractionListener.entries())m.execute(()=>{c.call(this,o)});return!0}removeInteractionListener(t){return t?(this.mInteractionListener.delete(t),this):(this.mInteractionListener.clear(),this)}setTriggerRestriction(t){return this.mTriggerFilterBitmap=t,this}};var G={get:1,set:2,manual:4};var Se=class f{static ORIGINAL_TO_INTERACTION_MAPPING=new WeakMap;static PROXY_TO_ORIGINAL_MAPPING=new WeakMap;static UNTRACEABLE_FUNCTION_UPDATE_TRIGGER=(()=>{let t=new WeakMap;return t.set(Array.prototype.fill,G.set),t.set(Array.prototype.pop,G.get),t.set(Array.prototype.push,G.set),t.set(Array.prototype.shift,G.get),t.set(Array.prototype.unshift,G.set),t.set(Array.prototype.splice,G.set),t.set(Array.prototype.reverse,G.set),t.set(Array.prototype.sort,G.set),t.set(Array.prototype.concat,G.set),t.set(Map.prototype.clear,G.set),t.set(Map.prototype.delete,G.set),t.set(Map.prototype.set,G.set),t.set(Set.prototype.clear,G.set),t.set(Set.prototype.delete,G.set),t.set(Set.prototype.add,G.set),t})();static getOriginal(t){return f.PROXY_TO_ORIGINAL_MAPPING.get(t)??t}static getWrapper(t){let e=f.getOriginal(t);return f.ORIGINAL_TO_INTERACTION_MAPPING.get(e)}mProxyObject;mStateChangeCallback;get proxy(){return this.mProxyObject}constructor(t,e){let o=f.getWrapper(t);if(o)return o;this.mProxyObject=this.createProxyObject(t),this.mStateChangeCallback=e,f.PROXY_TO_ORIGINAL_MAPPING.set(this.mProxyObject,t),f.ORIGINAL_TO_INTERACTION_MAPPING.set(t,this)}convertToProxy(t){return t===null||typeof t!="object"&&typeof t!="function"?t:new f(t,this.mStateChangeCallback).proxy}createProxyObject(t){let e=(c,m,v)=>{let y=f.getOriginal(m);try{let T=c.call(y,...v);return this.convertToProxy(T)}finally{if(f.UNTRACEABLE_FUNCTION_UPDATE_TRIGGER.has(c)){let T=f.getWrapper(m);T&&T.dispatch(f.UNTRACEABLE_FUNCTION_UPDATE_TRIGGER.get(c))}}};return new Proxy(t,{apply:(c,m,v)=>{let y=c;try{let T=y.call(m,...v);return this.convertToProxy(T)}catch(T){if(!(T instanceof TypeError))throw T;return e(y,m,v)}},set:(c,m,v)=>{try{let y=v;return(y!==null&&typeof y=="object"||typeof y=="function")&&(y=f.getOriginal(y)),Reflect.set(c,m,y)}finally{this.dispatch(G.set)}},get:(c,m,v)=>{try{return this.convertToProxy(Reflect.get(c,m))}finally{this.dispatch(G.get)}},deleteProperty:(c,m)=>{try{return delete c[m]}finally{this.dispatch(G.set)}}})}dispatch(t){this.mStateChangeCallback(t)}};var B=class f{static reaction(t){let e=Rt.create("ComponentState reaction");e.addInteractionListener(o=>{(o.triggerType&G.set)!==0&&t()}),e.execute(()=>{t()})}static state(t){return(e,o)=>{if(o.static)throw new A("Event target is not for a static property.",f);let c=new WeakMap,m=(v,y)=>{c.set(v,new f(y,t))};return{init(v){return typeof v>"u"||m(this,v),v},set(v){c.has(this)?c.get(this).set(v):m(this,v)},get(){return c.has(this)||m(this,void 0),c.get(this).get()}}}}mConfiguration;mLinkedZones;mLinkedZonesArray;mValue;constructor(t,e){if(this.mLinkedZones=new Set,this.mLinkedZonesArray=new Array,this.mConfiguration={complexValue:e?.complexValue??!1,proxy:e?.proxy??!1},this.mConfiguration.proxy){if(typeof t!="object"||t===null)throw new A("Proxied component state value must be an object.",this);this.mValue=new Se(t,o=>{switch(o){case G.set:return this.dispatchChange();case G.get:return this.linkCurrentZone()}}).proxy}else this.mValue=t}get(){return this.linkCurrentZone(),this.mValue}set(t){if(this.mConfiguration.proxy)throw new A("Proxy is not implemented yet.",this);!this.mConfiguration.complexValue&&this.mValue===t||(this.mValue=t,this.dispatchChange())}dispatchChange(){for(let t of this.mLinkedZonesArray)t.pushInteraction(G.set,this)}linkCurrentZone(){let t=Rt.current;this.mLinkedZones.has(t)||(this.mLinkedZones.add(t),this.mLinkedZonesArray.push(t))}};var Ot=class f{static mCurrentUpdateCycle=null;static openResheduledCycle(t,e){let o=!1;if(!f.mCurrentUpdateCycle){let c=performance.now();f.mCurrentUpdateCycle={initiator:t.initiator,startTime:c,forcedSync:t.forcedSync,runner:t.runner},o=!0}try{return e(f.mCurrentUpdateCycle)}finally{o&&(f.mCurrentUpdateCycle=null)}}static openUpdateCycle(t,e){let o=!1;if(!f.mCurrentUpdateCycle){let c=performance.now();f.mCurrentUpdateCycle={initiator:t.updater,startTime:c,forcedSync:t.runSync,runner:Symbol("Runner "+c)},o=!0}try{return e(f.mCurrentUpdateCycle)}finally{o&&(f.mCurrentUpdateCycle=null)}}static updateCycleRunId(t,e){if(t.initiator===e){let o=performance.now(),c=t;c.runner=Symbol("Runner "+o)}}static updateCyleStartTime(t){let e=performance.now(),o=t;o.startTime=e}};var Ce=class extends Error{mChain;get chain(){return this.mChain}constructor(t,e){let o=e.slice(-20).map(c=>c.toString()).join(`
`);super(`${t}: 
${o}`),this.mChain=[...e]}};var Pe=class f{static mFrameTime=100;static mStackCap=100;static get frameTime(){return f.mFrameTime}static set frameTime(t){f.mFrameTime=t}static get stackCap(){return f.mStackCap}static set stackCap(t){f.mStackCap=t}mInteractionZone;mManualComponentState;mUpdateFunction;mUpdateRunCache;mUpdateStates;get zone(){return this.mInteractionZone}constructor(t){this.mUpdateRunCache=new WeakMap,this.mUpdateFunction=t.onUpdate,this.mManualComponentState=new B(Symbol("Manual Update")),this.mUpdateStates={chainCompleteHooks:new Pt,async:{hasSheduledTask:!1,hasRunningTask:!1,sheduledTaskIsResheduled:!1},sync:{running:!1},cycle:{chainedTask:null}},this.mInteractionZone=Rt.create("Update-Zone"),this.mInteractionZone.addInteractionListener(e=>{(e.triggerType&G.set)!==0&&this.runUpdateAsynchron(e,null)})}deconstruct(){this.mInteractionZone.removeInteractionListener()}executeInZone(t){return this.mInteractionZone.execute(t)}update(){let t=new Lt(G.manual,this.mInteractionZone,this.mManualComponentState);return this.runUpdateSynchron(t)}updateAsync(){let t=new Lt(G.manual,this.mInteractionZone,this.mManualComponentState);this.runUpdateAsynchron(t,null)}async waitForUpdate(){return this.mUpdateStates.async.hasSheduledTask?new Promise((t,e)=>{this.mUpdateStates.chainCompleteHooks.push((o,c)=>{c?e(c):t(o)})}):!1}executeTaskChain(t,e,o,c){if(c.length>f.stackCap)throw new Ce("Call loop detected",c);let m=performance.now();if(!e.forcedSync&&m-e.startTime>f.frameTime)throw new he;c.push(t);let v=this.mInteractionZone.execute(()=>this.mUpdateFunction.call(this))||o;if(Ot.updateCycleRunId(e,this),!this.mUpdateStates.cycle.chainedTask)return v;let y=this.mUpdateStates.cycle.chainedTask;return this.mUpdateStates.cycle.chainedTask=null,this.executeTaskChain(y,e,v,c)}releaseUpdateChainCompleteHooks(t,e){if(!this.mUpdateStates.chainCompleteHooks.top)return;let o;for(;o=this.mUpdateStates.chainCompleteHooks.pop();)o(t,e)}runUpdateAsynchron(t,e){if(this.mUpdateStates.async.hasRunningTask||this.mUpdateStates.async.sheduledTaskIsResheduled){this.mUpdateStates.cycle.chainedTask=t;return}if(this.mUpdateStates.async.hasSheduledTask)return;let o=c=>{this.mUpdateStates.async.hasRunningTask=!0,this.mUpdateStates.async.hasSheduledTask=!1,this.mUpdateStates.async.sheduledTaskIsResheduled=!1;let m=!1;try{this.runUpdateSynchron(t)}catch(v){v instanceof he&&c.initiator===this&&(m=!0)}finally{this.mUpdateStates.async.hasRunningTask=!1}m&&this.runUpdateAsynchron(t,c)};this.mUpdateStates.async.hasSheduledTask=!0,e&&(this.mUpdateStates.async.sheduledTaskIsResheduled=!0),globalThis.requestAnimationFrame(()=>{e?Ot.openResheduledCycle(e,o):Ot.openUpdateCycle({updater:this,runSync:!1},o)})}runUpdateSynchron(t){if(this.mUpdateStates.sync.running)return this.mUpdateStates.cycle.chainedTask=t,!1;this.mUpdateStates.sync.running=!0;try{let e=Ot.openUpdateCycle({updater:this,runSync:!0},o=>{if(this.mUpdateRunCache.has(o.runner))return Ot.updateCyleStartTime(o),this.mUpdateRunCache.get(o.runner);let c=this.executeTaskChain(t,o,!1,new Array);return this.mUpdateRunCache.set(o.runner,c),c});return this.releaseUpdateChainCompleteHooks(e),e}catch(e){throw e instanceof he||this.releaseUpdateChainCompleteHooks(!1,e),e}finally{this.mUpdateStates.sync.running=!1}}},he=class extends Error{constructor(){super("Update resheduled")}};var Me=class extends Ht{mUpdater;get updater(){return this.mUpdater}constructor(t){super(t),this.mUpdater=new Pe({label:t.constructor.name,onUpdate:()=>this.onUpdate()})}call(t,...e){return this.mUpdater.executeInZone(()=>super.call(t,...e))}deconstruct(){this.mUpdater.deconstruct(),super.deconstruct()}createProcessor(){return this.mUpdater.executeInZone(()=>super.createProcessor())}};var Vt=class{mExpression;mTemporaryValues;constructor(t,e,o){if(this.mTemporaryValues=new k,o.length>0)for(let c of o)this.mTemporaryValues.set(c,void 0);this.mExpression=this.createEvaluationFunction(t,this.mTemporaryValues).bind(e.store)}execute(){return this.mExpression()}setTemporaryValue(t,e){if(!this.mTemporaryValues.has(t))throw new A(`Temporary value "${t}" does not exist for this procedure.`,this);this.mTemporaryValues.set(t,e)}createEvaluationFunction(t,e){let o,c=`__${Math.random().toString(36).substring(2)}`;if(o="return function () {",e.size>0)for(let m of e.keys())o+=`const ${m} = ${c}.get('${m}');`;return o+=`return ${t};`,o+="};",new Function(c,o)(e)}};var wt=class{mDataLevel;get data(){return this.mDataLevel}constructor(t){this.mDataLevel=t}createExpressionProcedure(t,e){return new Vt(t,this.data,e??[])}setTemporaryValue(t,e){this.data.setTemporaryValue(t,e)}};var dt=class{mComponent;mDataProxy;mParentLevel;mTemporaryValues;get store(){return this.mDataProxy}constructor(t){this.mTemporaryValues=new k,t instanceof $?(this.mParentLevel=null,this.mComponent=t):(this.mParentLevel=t,this.mComponent=t.mComponent),this.mDataProxy=this.createAccessProxy()}deleteTemporaryValue(t){this.mTemporaryValues.delete(t)}setTemporaryValue(t,e){this.mTemporaryValues.set(t,e)}updateLevelData(t){if(t.mParentLevel!==this.mParentLevel)throw new A("Can't update InstructionLevelData for a deeper level than it target data.",this);this.mTemporaryValues=t.mTemporaryValues}createAccessProxy(){return new Proxy(new Object,{get:(t,e)=>this.getValue(e),set:(t,e,o)=>(this.hasTemporaryValue(e)&&this.setTemporaryValue(e,o),e in this.mComponent.processor?(this.mComponent.processor[e]=o,!0):(this.setTemporaryValue(e,o),!0)),deleteProperty:()=>{throw new A("Deleting properties is not allowed",this)},ownKeys:()=>[...new Set([...Object.keys(this.mComponent.processor),...this.getTemporaryValuesList()])]})}getTemporaryValuesList(){let t=this.mTemporaryValues.map(e=>e);return this.mParentLevel&&t.push(...this.mParentLevel.getTemporaryValuesList()),t}getValue(t){if(this.mTemporaryValues.has(t))return this.mTemporaryValues.get(t);if(this.mParentLevel)return this.mParentLevel.getValue(t);if(t in this.mComponent.processor)return this.mComponent.processor[t]}hasTemporaryValue(t){return this.mTemporaryValues.has(t)?!0:this.mParentLevel?this.mParentLevel.hasTemporaryValue(t):!1}};var $t=class f{mChildList;mInstruction;mInstructionType;get childList(){return this.mChildList}get instruction(){return this.mInstruction}get instructionType(){return this.mInstructionType}constructor(t,e){this.mChildList=Array(),this.mInstruction=e,this.mInstructionType=t}appendChild(...t){this.mChildList.push(...t)}clone(){let t=new f(this.instructionType,this.instruction);for(let e of this.mChildList)t.appendChild(e.clone());return t}equals(t){if(!(t instanceof f)||t.instruction!==this.instruction||t.instructionType!==this.instructionType||t.childList.length!==this.childList.length)return!1;for(let e=0;e<t.childList.length;e++)if(!t.childList[e].equals(this.childList[e]))return!1;return!0}removeChild(t){let e=this.mChildList.indexOf(t);if(e!==-1)return this.mChildList.splice(e,1)[0]}};var gt=class f{mExpression;get value(){return this.mExpression}constructor(t){this.mExpression=t}clone(){return new f(this.mExpression)}equals(t){return t instanceof f&&t.value===this.value}toString(){return`{{ ${this.mExpression} }}`}};var It=class f{mContainsExpression;mTextValue;mValues;get containsExpression(){return this.mContainsExpression}get values(){return this.mValues}constructor(){this.mTextValue="",this.mContainsExpression=!1,this.mValues=[]}addValue(...t){for(let e of t)(this.mContainsExpression===!0||e instanceof gt)&&(this.mContainsExpression=!0),this.mValues.push(e),this.mTextValue+=e.toString()}clone(){let t=new f;for(let e of this.values)typeof e=="string"?t.addValue(e):t.addValue(e.clone());return t}equals(t){if(!(t instanceof f)||t.values.length!==this.values.length)return!1;for(let e=0;e<this.values.length;e++){let o=this.values[e],c=t.values[e];if(o!==c&&(typeof o!=typeof c||typeof o=="string"&&o!==c||!c.equals(o)))return!1}return!0}toString(){return this.mTextValue}};var de=class f{mName;mValue;get name(){return this.mName}get values(){return this.mValue}constructor(t){this.mName=t,this.mValue=new It}clone(){let t=new f(this.name);for(let e of this.values.values)typeof e=="string"?t.values.addValue(e):t.values.addValue(e.clone());return t}equals(t){return!(!(t instanceof f)||t.name!==this.name||!t.values.equals(this.values))}};var St=class f{mAttributeDictionary;mChildList;mTagName;get attributes(){return[...this.mAttributeDictionary.values()]}get childList(){return this.mChildList}get tagName(){return this.mTagName}constructor(t){this.mAttributeDictionary=new Map,this.mChildList=Array(),this.mTagName=t}appendChild(...t){this.mChildList.push(...t)}clone(){let t=new f(this.tagName);for(let e of this.mAttributeDictionary.values()){let o=t.setAttribute(e.name);for(let c of e.values.values)typeof c=="string"?o.addValue(c):o.addValue(c.clone())}for(let e of this.mChildList)t.appendChild(e.clone());return t}equals(t){if(!(t instanceof f)||t.tagName!==this.tagName||t.attributes.length!==this.mAttributeDictionary.size||t.childList.length!==this.mChildList.length)return!1;for(let e of t.mAttributeDictionary.values()){let o=this.mAttributeDictionary.get(e.name);if(!o||!o.equals(e))return!1}for(let e=0;e<t.childList.length;e++)if(!t.childList[e].equals(this.mChildList[e]))return!1;return!0}getAttribute(t){return this.mAttributeDictionary.get(t)?.values??null}removeAttribute(t){return this.mAttributeDictionary.delete(t)}removeChild(t){let e=this.mChildList.indexOf(t);if(e!==-1)return this.mChildList.splice(e,1)[0]}setAttribute(t){if(this.mAttributeDictionary.has(t))return this.mAttributeDictionary.get(t).values;let e=new de(t);return this.mAttributeDictionary.set(t,e),e.values}};var lt=class f{mBodyElementList;get body(){return this.mBodyElementList}constructor(){this.mBodyElementList=new Array}appendChild(...t){this.mBodyElementList.push(...t)}clone(){let t=new f;for(let e of this.mBodyElementList)t.appendChild(e.clone());return t}equals(t){if(!(t instanceof f)||t.body.length!==this.mBodyElementList.length)return!1;for(let e=0;e<this.mBodyElementList.length;e++)if(!this.mBodyElementList[e].equals(t.body[e]))return!1;return!0}removeChild(t){let e=this.mBodyElementList.indexOf(t);if(e!==-1)return this.mBodyElementList.splice(e,1)[0]}};var it=class{mComponentValues;mContent;mModules;mTemplate;get anchor(){return this.mContent.contentAnchor}get content(){return this.mContent}get modules(){return this.mModules}get template(){return this.mTemplate}get values(){return this.mComponentValues}constructor(t,e,o,c){this.mTemplate=t,this.mComponentValues=o,this.mContent=c,this.mModules=e,c.setCoreBuilder(this)}deconstruct(){this.content.deconstruct()}update(){let t=this.onUpdate(),e=!1,o=this.content.builders;if(o.length>0)for(let c=0;c<o.length;c++)e=o[c].update()||e;return t||e}createHtmlElement(t){let e=t.tagName;if(typeof e!="string")throw e;if(e.includes("-")){let c=globalThis.customElements.get(e);if(typeof c<"u")return new c}let o=t.getAttribute("xmlns");return o&&!o.containsExpression?document.createElementNS(o.values[0],e):document.createElement(e)}createTextNode(t){return document.createTextNode(t)}};var Xt=class{mChildBuilderList;mChildComponents;mContentAnchor;mContentBoundary;mLinkedContent;mRootChildList;get body(){return this.mRootChildList}get builders(){return this.mChildBuilderList}get contentAnchor(){return this.mContentAnchor}constructor(t){this.mChildBuilderList=new Array,this.mRootChildList=new Array,this.mChildComponents=new Map,this.mLinkedContent=new WeakSet,this.mContentAnchor=document.createComment(t),this.mContentBoundary={start:this.mContentAnchor,end:this.mContentAnchor}}deconstruct(){this.onDeconstruct();let t;for(;t=this.mChildBuilderList.pop();)t.deconstruct();for(let o of this.mChildComponents.values())o.deconstruct();this.mChildComponents.clear();let e;for(;e=this.mRootChildList.pop();)e instanceof it||e.remove();this.contentAnchor.remove()}getBoundary(){let t=this.mContentBoundary.end instanceof it?this.mContentBoundary.end.content.getBoundary().end:this.mContentBoundary.end;return{start:this.mContentBoundary.start,end:t}}insert(t,e,o){if(!this.mLinkedContent.has(o))throw new A("Can't add content to builder. Target is not part of builder.",this);let c=t instanceof it?t.anchor:t;switch(e){case"After":{this.insertAfter(c,o);break}case"TopOf":{this.insertTop(c,o);break}case"BottomOf":{this.insertBottom(c,o);break}}this.mLinkedContent.add(t),t instanceof it?this.mChildBuilderList.push(t):this.addChildComponent(t);let m=c.parentElement??c.getRootNode(),v=this.mContentAnchor.parentElement??this.mContentAnchor.getRootNode();if(m===v){let y=(()=>{switch(e){case"After":return this.mRootChildList.indexOf(o)+1;case"TopOf":return 0;case"BottomOf":return this.mRootChildList.length}})();y===this.mRootChildList.length&&(this.mContentBoundary.end=t),this.mRootChildList.splice(y+1,0,t)}}remove(t){if(!this.mLinkedContent.has(t))throw new A("Child node cant be deleted from builder when it not a child of them",this);if(this.mLinkedContent.delete(t),t instanceof it){let o=this.mChildBuilderList.indexOf(t);o!==-1&&this.mChildBuilderList.splice(o,1),t.deconstruct()}else{let o=this.mChildComponents.get(t);o&&(o.deconstruct(),this.mChildComponents.delete(t)),t.remove()}let e=this.mRootChildList.indexOf(t);e!==-1&&(this.mRootChildList.splice(e,1),this.mContentBoundary.end=this.mRootChildList.at(-1)??this.mContentAnchor)}setCoreBuilder(t){this.mLinkedContent.add(t)}addChildComponent(t){tt.elementIsComponent(t)&&this.mChildComponents.set(t,tt.ofElement(t).component)}insertAfter(t,e){let o=e instanceof it?e.content.getBoundary().end:e;(o.parentElement??o.getRootNode()).insertBefore(t,o.nextSibling)}insertBottom(t,e){if(e instanceof it){this.insertAfter(t,e);return}if(e instanceof Element){e.appendChild(t);return}throw new A("Source node does not support child nodes.",this)}insertTop(t,e){if(e instanceof it){this.insertAfter(t,e.anchor);return}if(e instanceof Element){e.prepend(t);return}throw new A("Source node does not support child nodes.",this)}};var Ne=class extends Xt{mAttributeModulesChangedOrder;mLinkedAttributeData;mLinkedAttributeExpressionModules;mLinkedAttributeModuleList;mLinkedExpressionModuleList;get linkedAttributeModules(){return this.mAttributeModulesChangedOrder&&(this.mAttributeModulesChangedOrder=!1,this.mLinkedAttributeModuleList.sort((t,e)=>t.accessMode-e.accessMode)),this.mLinkedAttributeModuleList}get linkedExpressionModules(){return this.mLinkedExpressionModuleList}constructor(t){super(t),this.mLinkedExpressionModuleList=new Array,this.mLinkedAttributeModuleList=new Array,this.mLinkedAttributeExpressionModules=new WeakMap,this.mLinkedAttributeData=new WeakMap,this.mAttributeModulesChangedOrder=!1}attributeOfLinkedExpressionModule(t){return this.mLinkedAttributeExpressionModules.get(t)}getLinkedAttributeData(t){if(!this.mLinkedAttributeData.has(t))throw new A("Attribute has no linked data.",this);return this.mLinkedAttributeData.get(t)}linkAttributeExpression(t,e){this.mLinkedAttributeExpressionModules.set(t,e)}linkAttributeModule(t){this.mLinkedAttributeModuleList.push(t),this.mAttributeModulesChangedOrder=!0}linkAttributeNodes(t,e,o){this.mLinkedAttributeData.set(t,{values:o,node:e})}linkExpressionModule(t){this.mLinkedExpressionModuleList.push(t)}onDeconstruct(){for(let t of this.mLinkedAttributeModuleList)t.deconstruct();for(let t of this.mLinkedExpressionModuleList)t.deconstruct()}};var Ae=class extends Xt{mInstructionModule;get instructionModule(){return this.mInstructionModule}constructor(t,e){super(e),this.mInstructionModule=t}onDeconstruct(){this.mInstructionModule.deconstruct()}};var Le=class extends it{constructor(t,e,o){let c=e.createInstructionModule(t,o);super(t,e,o,new Ae(c,`Instruction - {$${t.instructionType}}`))}onUpdate(){if(this.content.instructionModule.update()){let t=this.content.body;this.updateStaticBuilder(t,this.content.instructionModule.instructionResult.elementList)}return!1}insertNewContent(t,e){let o=new Yt(t.template,this.modules,t.dataLevel,`Child - {$${this.template.instructionType}}`);return e===null?this.content.insert(o,"TopOf",this):this.content.insert(o,"After",e),o}updateStaticBuilder(t,e){let c=new ie((y,T)=>T.template.equals(y.template)).differencesOf(t,e),m=0,v=null;for(let y=0;y<c.length;y++){let T=c[y];if(T.changeState===Tt.Remove)this.content.remove(T.item);else if(T.changeState===Tt.Insert)v=this.insertNewContent(T.item,v),m++;else{let S=e[m].dataLevel;T.item.values.updateLevelData(S),v=T.item,m++}}}};var Yt=class extends it{mInitialized;constructor(t,e,o,c){super(t,e,o,new Ne(`Static - {${c}}`)),this.mInitialized=!1}onUpdate(){this.mInitialized||(this.mInitialized=!0,this.buildTemplate([this.template],this));let t=!1,e=this.content.linkedAttributeModules;for(let m=0;m<e.length;m++)t=e[m].update()||t;let o=!1,c=this.content.linkedExpressionModules;for(let m=0;m<c.length;m++){let v=c[m];if(v.update()){o=!0;let y=this.content.attributeOfLinkedExpressionModule(v);if(!y)continue;let T=this.content.getLinkedAttributeData(y),S=T.values.reduce((l,n)=>l+n.data,"");T.node.setAttribute(y.name,S)}}return t||o}buildInstructionTemplate(t,e){this.content.insert(new Le(t,this.modules,new dt(this.values)),"BottomOf",e)}buildStaticTemplate(t,e){let o=this.createHtmlElement(t);this.content.insert(o,"BottomOf",e);for(let c of t.attributes){let m=this.modules.createAttributeModule(c,o,this.values);if(m){this.content.linkAttributeModule(m);continue}if(c.values.containsExpression){let v=new Array;for(let y of c.values.values){let T=this.createTextNode("");if(v.push(T),!(y instanceof gt)){T.data=y;continue}let S=this.modules.createExpressionModule(y,T,this.values);this.content.linkExpressionModule(S),this.content.linkAttributeExpression(S,c)}this.content.linkAttributeNodes(c,o,v);continue}o.setAttribute(c.name,c.values.toString())}this.content.insert(o,"BottomOf",e),this.buildTemplate(t.childList,o)}buildTemplate(t,e){for(let o of t)o instanceof lt?this.buildTemplate(o.body,e):o instanceof It?this.buildTextTemplate(o,e):o instanceof $t?this.buildInstructionTemplate(o,e):o instanceof St&&this.buildStaticTemplate(o,e)}buildTextTemplate(t,e){for(let o of t.values){if(typeof o=="string"){this.content.insert(this.createTextNode(o),"BottomOf",e);continue}let c=this.createTextNode("");this.content.insert(c,"BottomOf",e);let m=this.modules.createExpressionModule(o,c,this.values);this.content.linkExpressionModule(m)}}};var me=class{mHtmlElement;mShadowRoot;get htmlElement(){return this.mHtmlElement}get shadowRoot(){return this.mShadowRoot}constructor(t){this.mHtmlElement=t,this.mShadowRoot=this.mHtmlElement.attachShadow({mode:"open"})}};var H=class{mDataLevel;get data(){return this.mDataLevel}constructor(t){this.mDataLevel=t}createExpressionProcedure(t,e){return new Vt(t,this.data,e??[])}};var _t=class extends Ht{constructor(t){super({constructor:t.constructor,parent:t.parent}),this.setProcessorInjection(H,new H(t.values))}deconstruct(){super.deconstruct(),this.call("onDeconstruct")}update(){return this.onUpdate()}};var Q=class{mValue;get value(){return this.mValue}constructor(t){this.mValue=t}};var q=class{constructor(){throw new A("Reference should not be instanced.",this)}};var mt=class{constructor(){throw new A("Reference should not be instanced.",this)}};var Ft=class f extends _t{mLastResult;mTargetTextNode;constructor(t){super({constructor:t.constructor,parent:t.parent,values:t.values}),this.mTargetTextNode=t.targetNode,this.mLastResult=null,this.setProcessorInjection(f,this),this.setProcessorInjection(mt,t.targetTemplate.clone()),this.setProcessorInjection(q,t.targetNode),this.setProcessorInjection(Q,new Q(t.targetTemplate.value))}onUpdate(){let t=this.call("onUpdate");t===null&&(t="");let e=this.mLastResult===null||this.mLastResult!==t;if(e){let o=this.mTargetTextNode;o.data=t,this.mLastResult=t}return e}};function lr(){return(f,t)=>{O.registerInjectable(f,t.metadata,"instanced"),at.register(Ft,f,{})}}function _i(){function f(l,n){return function(a){e(n,"addInitializer"),o(a,"An initializer"),l.push(a)}}function t(l,n,u,a,r,b,g,D,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:g?"#"+n:n,static:b,private:g,metadata:D},d={v:!1};s.addInitializer=f(a,d);var i,h;r===0?g?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return l(w,s)}finally{d.v=!0}}function e(l,n){if(l.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(l,n){if(typeof l!="function")throw new TypeError(n+" must be a function")}function c(l,n){var u=typeof n;if(l===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var a;throw l===0?a="field":l===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function m(l,n,u,a,r,b,g,D,w){var p=u[0],s,d,i;g?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,C;if(typeof p=="function")h=t(p,a,s,D,r,b,g,w,i),h!==void 0&&(c(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h);else for(var P=p.length-1;P>=0;P--){var M=p[P];if(h=t(M,a,s,D,r,b,g,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(I,E){return E};else if(typeof d!="function"){var F=d;d=function(I,E){for(var L=E,R=0;R<F.length;R++)L=F[R].call(I,L);return L}}else{var z=d;d=function(I,E){return z.call(I,E)}}l.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),g?r===1?(l.push(function(I,E){return i.get.call(I,E)}),l.push(function(I,E){return i.set.call(I,E)})):r===2?l.push(i):l.push(function(I,E){return i.call(I,E)}):Object.defineProperty(n,a,s))}function v(l,n,u){for(var a=[],r,b,g=new Map,D=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,C;if(h?(x=l,s=s-5,b=b||[],C=b):(x=l.prototype,r=r||[],C=r),s!==0&&!i){var P=h?D:g,M=P.get(d)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!M&&s>2?P.set(d,s):P.set(d,!0)}m(a,x,p,d,s,h,i,C,u)}}return y(a,r),y(a,b),a}function y(l,n){n&&l.push(function(u){for(var a=0;a<n.length;a++)n[a].call(u);return u})}function T(l,n,u){if(n.length>0){for(var a=[],r=l,b=l.name,g=n.length-1;g>=0;g--){var D={v:!1};try{var w=n[g](r,{kind:"class",name:b,addInitializer:f(a,D),metadata:u})}finally{D.v=!0}w!==void 0&&(c(10,w),r=w)}return[S(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function S(l,n){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,a,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(b===void 0?null:b),D=v(n,u,g);return a.length||S(n,g),{e:D,get c(){return T(n,a,g)}}}}function yr(f,t,e,o){return(yr=_i())(f,t,e,o)}var br,gr,cr;br=lr();var vr=class{static{({c:[cr,gr]}=yr(this,[],[br]))}constructor(t=O.use(H),e=O.use(Q)){this.mProcedure=t.createExpressionProcedure(e.value)}mProcedure;onUpdate(){let t=this.mProcedure.execute();return typeof t>"u"?null:t?.toString()}static{gr()}};var et=class{mName;mValue;get name(){return this.mName}get value(){return this.mValue}constructor(t,e){this.mName=t,this.mValue=e}};var vt=class f extends _t{mAccessMode;get accessMode(){return this.mAccessMode}constructor(t){super({constructor:t.constructor,parent:t.parent,values:t.values}),this.mAccessMode=t.accessMode,this.setProcessorInjection(f,this),this.setProcessorInjection(mt,t.targetTemplate.clone()),this.setProcessorInjection(q,t.targetNode),this.setProcessorInjection(et,new et(t.targetTemplate.name,t.targetTemplate.values.toString()))}onUpdate(){return this.call("onUpdate")??!1}};var ct=class{mDataLevels;mElementList;mTemplates;get elementList(){return this.mElementList}constructor(){this.mElementList=new Array,this.mTemplates=new Set,this.mDataLevels=new Set}addElement(t,e){if(this.mTemplates.has(t)||this.mDataLevels.has(e))throw new A("Can't add same template or values for multiple Elements.",this);this.mTemplates.add(t),this.mDataLevels.add(e),this.mElementList.push({template:t,dataLevel:e})}};var jt=class f extends _t{mLastResult;get instructionResult(){return this.mLastResult}constructor(t){super({constructor:t.constructor,parent:t.parent,values:t.values}),this.setProcessorInjection(f,this),this.setProcessorInjection(mt,t.targetTemplate.clone()),this.setProcessorInjection(Q,new Q(t.targetTemplate.instruction)),this.mLastResult=new ct}onUpdate(){let t=this.call("onUpdate");return t instanceof ct?(this.mLastResult=t,!0):!1}};var Re=class f{static mAttributeModuleCache=new k;static mExpressionModuleCache=new WeakMap;static mInstructionModuleCache=new k;mComponent;mExpressionModule;constructor(t,e){this.mExpressionModule=e??cr,this.mComponent=t}createAttributeModule(t,e,o){let c=(()=>{let m=f.mAttributeModuleCache.get(t.name);if(m||m===null)return m;for(let v of at.get(vt))if(v.processorConfiguration.selector.test(t.name))return f.mAttributeModuleCache.set(t.name,v),v;return f.mAttributeModuleCache.set(t.name,null),null})();return c===null?null:new vt({accessMode:c.processorConfiguration.access,constructor:c.processorConstructor,parent:this.mComponent,targetNode:e,targetTemplate:t,values:o}).setup()}createExpressionModule(t,e,o){let c=(()=>{let m=f.mExpressionModuleCache.get(this.mExpressionModule);if(m)return m;let v=at.get(Ft).find(y=>y.processorConstructor===this.mExpressionModule);if(!v)throw new A("An expression module could not be found.",this);return f.mExpressionModuleCache.set(this.mExpressionModule,v),v})();return new Ft({constructor:c.processorConstructor,parent:this.mComponent,targetNode:e,targetTemplate:t,values:o}).setup()}createInstructionModule(t,e){let o=(()=>{let c=f.mInstructionModuleCache.get(t.instructionType);if(c)return c;for(let m of at.get(jt))if(m.processorConfiguration.instructionType===t.instructionType)return f.mInstructionModuleCache.set(t.instructionType,m),m;throw new A(`Instruction module type "${t.instructionType}" not found.`,this)})();return new jt({constructor:o.processorConstructor,parent:this.mComponent,targetTemplate:t,values:e}).setup()}};var Gt=class extends A{mColumnEnd;mColumnStart;mLineEnd;mLineStart;get columnEnd(){return this.mColumnEnd}get columnStart(){return this.mColumnStart}get lineEnd(){return this.mLineEnd}get lineStart(){return this.mLineStart}constructor(t,e,o,c,m,v,y){super(t,e,y),this.mColumnStart=o,this.mLineStart=c,this.mColumnEnd=m,this.mLineEnd=v}};var Wt=class{mDependencyFetch;mDependencyFetchResolved;mLexer;mMeta;mPattern;mPatternDependencies;mType;get dependencies(){return this.mPatternDependencies}get dependenciesResolved(){return this.mDependencyFetchResolved}get lexer(){return this.mLexer}get meta(){return this.mMeta}get pattern(){return this.mPattern}constructor(t,e){if(this.mLexer=t,this.mType=e.type,this.mMeta=e.metadata,this.mPatternDependencies=new Array,this.mDependencyFetch=e.dependencyFetch??null,this.mDependencyFetchResolved=!e.dependencyFetch,this.mType==="split"&&!this.mDependencyFetch)throw new A("Split token with a start and end token, need inner token definitions.",this);if(this.mType==="single"&&this.mDependencyFetch)throw new A("Pattern does not allow inner token pattern.",this);this.mPattern=this.convertTokenPattern(this.mType,e.pattern)}isSplit(){return this.mType==="split"}resolveDependencies(){this.mDependencyFetchResolved||(this.mDependencyFetch(this),this.mDependencyFetchResolved=!0)}useChildPattern(t){if(this.mLexer!==t.lexer)throw new A("Can only add dependencies of the same lexer.",this);this.mPatternDependencies.push(t)}convertTokenPattern(t,e){if("single"in e){if(t==="split")throw new A("Can't use split pattern type with single pattern definition.",this);return{start:{regex:e.single.regex,types:e.single.types,validator:e.single.validator??null}}}else{if(t==="single")throw new A("Can't use single pattern type with split pattern definition.",this);return{start:{regex:e.start.regex,types:e.start.types,validator:e.start.validator??null},end:{regex:e.end.regex,types:e.end.types,validator:e.end.validator??null},innerType:e.innerType??null}}}};var Zt=class{mColumnNumber;mLineNumber;mMetas;mType;mValue;get columnNumber(){return this.mColumnNumber}get lineNumber(){return this.mLineNumber}get metas(){return[...this.mMetas]}get type(){return this.mType}get value(){return this.mValue}constructor(t,e,o,c){this.mValue=e,this.mColumnNumber=o,this.mLineNumber=c,this.mType=t,this.mMetas=new Set}addMeta(...t){for(let e of t)this.mMetas.add(e)}hasMeta(t){return this.mMetas.has(t)}};var fe=class{mRootPattern;mSettings;get errorType(){return this.mSettings.errorType}set errorType(t){this.mSettings.errorType=t}get trimWhitespace(){return this.mSettings.trimSpaces}set trimWhitespace(t){this.mSettings.trimSpaces=t}get validWhitespaces(){return[...this.mSettings.whiteSpaces].join("")}set validWhitespaces(t){this.mSettings.whiteSpaces=new Set(t.split(""))}constructor(){this.mSettings={errorType:null,trimSpaces:!0,whiteSpaces:new Set},this.mRootPattern=new Wt(this,{type:"single",pattern:{single:{regex:/^/,types:{},validator:null}},metadata:[],dependencyFetch:null})}createTokenPattern(t,e){let o=y=>typeof y=="string"?{token:y}:y,c=y=>{let T=new Set(y.flags.split(""));return new RegExp(`^(?<token>${y.source})`,[...T].join(""))},m=new Array;t.meta&&(typeof t.meta=="string"?m.push(t.meta):m.push(...t.meta));let v;return"regex"in t.pattern?v={single:{regex:c(t.pattern.regex),types:o(t.pattern.type),validator:t.pattern.validator??null}}:v={start:{regex:c(t.pattern.start.regex),types:o(t.pattern.start.type),validator:t.pattern.start.validator??null},end:{regex:c(t.pattern.end.regex),types:o(t.pattern.end.type),validator:t.pattern.end.validator??null},innerType:t.pattern.innerType??null},new Wt(this,{type:"regex"in t.pattern?"single":"split",pattern:v,metadata:m,dependencyFetch:e??null})}*tokenize(t,e){let o={data:t,cursor:{position:0,column:1,line:1},error:null,progressTracker:e??null};yield*this.tokenizeRecursionLayer(o,this.mRootPattern,new Array,null)}useRootTokenPattern(t){if(t.lexer!==this)throw new A("Token pattern must be created by this lexer.",this);this.mRootPattern.useChildPattern(t)}findNextStartToken(t,e,o,c){for(let m of e){let v=m.pattern.start,y=this.matchToken(m,v,t,o,c);if(y!==null)return{pattern:m,token:y}}return null}findTokenTypeOfMatch(t,e,o){for(let v in t.groups){let y=t.groups[v],T=e[v];if(!(!y||!T)){if(y.length!==t[0].length)throw new A("A group of a token pattern must match the whole token.",this);return T}}let c=new Array;for(let v in t.groups)t.groups[v]&&c.push(v);let m=new Array;for(let v in e)m.push(v);throw new A(`No token type found for any defined pattern regex group. Full: "${t[0]}", Matches: "${c.join(", ")}", Available: "${m.join(", ")}", Regex: "${o.source}"`,this)}*generateErrorToken(t,e){if(!t.error||!this.mSettings.errorType)return;let o=new Zt(this.mSettings.errorType,t.error.data,t.error.startColumn,t.error.startLine);o.addMeta(...e),t.error=null,yield o}generateToken(t,e,o,c,m,v){let y=o[0],T=this.findTokenTypeOfMatch(o,c,v),S=new Zt(m??T,y,t.cursor.column,t.cursor.line);return S.addMeta(...e),S}matchToken(t,e,o,c,m){let v=e.regex;v.lastIndex=0;let y=v.exec(o.data);if(!y||y.index!==0)return null;let T=this.generateToken(o,[...c,...t.meta],y,e.types,m,v);if(e.validator){let S=o.data.substring(T.value.length);if(!e.validator(T,S,o.cursor.position))return null}return this.moveCursor(o,T.value),T}moveCursor(t,e){let o=e.split(`
`);o.length>1&&(t.cursor.column=1),t.cursor.line+=o.length-1,t.cursor.column+=o.at(-1).length,t.cursor.position+=e.length,t.data=t.data.substring(e.length),this.trackProgress(t)}pushNextCharToErrorState(t){if(!this.mSettings.errorType)throw new Gt(`Unable to parse next token. No valid pattern found for "${t.data.substring(0,20)}".`,this,t.cursor.column,t.cursor.line,t.cursor.column,t.cursor.line);t.error||(t.error={data:"",startColumn:t.cursor.column,startLine:t.cursor.line});let e=t.data.charAt(0);t.error.data+=e,this.moveCursor(t,e)}skipNextWhitespace(t){let e=t.data.charAt(0);return!this.mSettings.trimSpaces||!this.mSettings.whiteSpaces.has(e)?!1:(this.moveCursor(t,e),!0)}*tokenizeRecursionLayer(t,e,o,c){let m=e.dependencies;for(;t.data.length>0;){if(!t.error&&this.skipNextWhitespace(t))continue;if(e.isSplit()){let T=this.matchToken(e,e.pattern.end,t,o,c);if(T!==null){yield*this.generateErrorToken(t,o),yield T;return}}let v=this.findNextStartToken(t,m,o,c);if(!v){this.pushNextCharToErrorState(t);continue}yield*this.generateErrorToken(t,o),yield v.token;let y=v.pattern;y.isSplit()&&(y.resolveDependencies(),yield*this.tokenizeRecursionLayer(t,y,[...o,...y.meta],c??y.pattern.innerType))}yield*this.generateErrorToken(t,o)}trackProgress(t){t.progressTracker!==null&&t.progressTracker(t.cursor.position,t.cursor.line,t.cursor.column)}};var Y=class extends Error{static PARSER_ERROR=Symbol("PARSER_ERROR");mTrace;get columnEnd(){return this.mTrace.top.range.columnEnd}get columnStart(){return this.mTrace.top.range.columnStart}get graph(){return this.mTrace.top.graph}get incidents(){return this.mTrace.incidents}get lineEnd(){return this.mTrace.top.range.lineEnd}get lineStart(){return this.mTrace.top.range.lineStart}constructor(t){super(t.top.message,{cause:t.top.cause}),this.mTrace=t}};var Oe=class{mIncidents;mTop;get incidents(){if(this.mIncidents===null)throw new A("A complete incident list is only available on debug mode.",this);return this.mIncidents}get top(){return this.mTop}constructor(t){this.mTop={message:"Unknown parser error",priority:0,graph:null,range:{lineStart:1,columnStart:1,lineEnd:1,columnEnd:1},cause:null},t?this.mIncidents=new Array:this.mIncidents=null}push(t,e,o,c,m,v,y=!1,T=null){let S;if(y?S=this.mTop.priority+1:S=m*1e4+v,this.mIncidents!==null){let l={message:t,priority:S,graph:e,range:{lineStart:o,columnStart:c,lineEnd:m,columnEnd:v},cause:T};this.mIncidents.push(l)}this.mTop&&S<this.mTop.priority||this.setTop({message:t,priority:S,graph:e,range:{lineStart:o,columnStart:c,lineEnd:m,columnEnd:v},cause:T})}setTop(t){this.mTop=t}};var _e=class f{static MAX_JUNCTION_CIRCULAR_REFERENCES=1e3;mGraphStack;mIncidentTrace;mLastTokenPosition;mProcessStack;mTokenCache;mTokenGenerator;mTrimTokenCache;get currentGraph(){return this.mGraphStack.top.graph}get currentToken(){let t=this.mGraphStack.top;return this.mTokenCache[t.token.cursor]}get incidentTrace(){return this.mIncidentTrace}get processStack(){return this.mProcessStack}constructor(t,e,o){this.mTokenGenerator=t,this.mGraphStack=new Pt,this.mLastTokenPosition={column:1,line:1},this.mTokenCache=new Array,this.mProcessStack=new Pt,this.mTrimTokenCache=o,this.mIncidentTrace=new Oe(e),this.mGraphStack.push({graph:null,linear:!0,circularGraphs:new k,token:{start:0,cursor:-1}})}collapse(){let t=this.mGraphStack.top,e=this.mTokenCache.slice(t.token.cursor);e.length!==0&&e.at(-1)===null&&e.pop();for(let o of this.mTokenGenerator)e.push(o);return e}getGraphBoundingToken(){let t=this.mGraphStack.top,e=this.mTokenCache[t.token.start],o=this.mTokenCache[t.token.cursor-1];return e??=o,o??=e,[e??null,o??null]}getGraphPosition(){let t=this.mGraphStack.top,e,o;if(e=this.mTokenCache[t.token.start],o=this.mTokenCache[t.token.cursor-1],e??=o,o??=e,!e||!o)return{graph:t.graph,columnEnd:this.mLastTokenPosition.column,columnStart:this.mLastTokenPosition.column,lineEnd:this.mLastTokenPosition.line,lineStart:this.mLastTokenPosition.line};let c,m;if(o.value.includes(`
`)){let v=o.value.split(`
`);m=o.lineNumber+v.length-1,c=1+v[v.length-1].length}else c=o.columnNumber+o.value.length,m=o.lineNumber;return{graph:t.graph,lineStart:e.lineNumber,columnStart:e.columnNumber,lineEnd:m,columnEnd:c}}getTokenPosition(){let t=this.mGraphStack.top,e=this.currentToken;if(!e)return{graph:t.graph,columnEnd:this.mLastTokenPosition.column,columnStart:this.mLastTokenPosition.column,lineEnd:this.mLastTokenPosition.line,lineStart:this.mLastTokenPosition.line};let o,c;if(e.value.includes(`
`)){let m=e.value.split(`
`);c=e.lineNumber+m.length-1,o=1+m[m.length-1].length}else o=e.columnNumber+e.value.length,c=e.lineNumber;return{graph:t.graph,lineStart:e.lineNumber,columnStart:e.columnNumber,lineEnd:c,columnEnd:o}}graphIsCircular(t){let e=this.mGraphStack.top;if(!e.circularGraphs.has(t))return!1;if(t.isJunction){if(e.circularGraphs.get(t)>f.MAX_JUNCTION_CIRCULAR_REFERENCES)throw new A("Junction graph called circular too often.",this);return!1}return!0}moveNextToken(){let t=this.mGraphStack.top;if(t.circularGraphs.size>0&&(t.circularGraphs=new k),t.graph&&t.graph.isJunction)throw new A("Junction graph must not have own nodes.",this);if(t.token.cursor++,t.token.cursor<this.mTokenCache.length)return;let e=this.mTokenGenerator.next();if(e.done){this.mTokenCache.push(null);return}this.mLastTokenPosition.column=e.value.columnNumber,this.mLastTokenPosition.line=e.value.lineNumber,this.mTokenCache.push(e.value)}popGraphStack(t){let e=this.mGraphStack.pop(),o=this.mGraphStack.top;if(t&&(e.token.cursor=e.token.start),e.token.cursor!==e.token.start&&o.circularGraphs.size>0&&(o.circularGraphs=new k),!this.mTrimTokenCache){o.token.cursor=e.token.cursor;return}e.linear?(this.mTokenCache.splice(0,e.token.cursor),o.token.start=0,o.token.cursor=0):o.token.cursor=e.token.cursor}pushGraphStack(t,e){let o=this.mGraphStack.top,c={graph:t,linear:e&&o.linear,circularGraphs:new k(o.circularGraphs),token:{start:o.token.cursor,cursor:o.token.cursor}},m=c.circularGraphs.get(t)??0;c.circularGraphs.set(t,m+1),this.mGraphStack.push(c)}};var pe=class f{static NODE_NULL_RESULT=Symbol("FAILED_NODE_VALUE_PARSE");static NODE_VALUE_LIST_END_MEET=Symbol("FAILED_NODE_VALUE_PARSE");mConfiguration;mLexer;mRootPart;get lexer(){return this.mLexer}constructor(t,e){this.mLexer=t,this.mRootPart=null,this.mConfiguration={keepTraceIncidents:!1,trimTokenCache:!1,...e}}parse(t,e){if(this.mRootPart===null)throw new A("Parser has not root part set.",this);let o=new _e(this.mLexer.tokenize(t,e),this.mConfiguration.keepTraceIncidents,this.mConfiguration.trimTokenCache),c=(()=>{try{return this.beginParseProcess(o,this.mRootPart)}catch(v){if(v instanceof Gt)return o.incidentTrace.push(v.message,o.currentGraph,v.lineStart,v.columnStart,v.lineEnd,v.columnEnd,!0,v),Y.PARSER_ERROR;let y=v instanceof Error?v.message:v.toString(),T=o.getGraphPosition();return o.incidentTrace.push(y,o.currentGraph,T.lineStart,T.columnStart,T.lineEnd,T.columnEnd,!0,v),Y.PARSER_ERROR}})();if(c===Y.PARSER_ERROR)throw new Y(o.incidentTrace);let m=o.collapse();if(m.length!==0){let v=m[0];if(o.incidentTrace.top.range.lineEnd===1&&o.incidentTrace.top.range.columnEnd===1){let y=`Tokens could not be parsed. Graph end meet without reaching last token. Current: "${v.value}" (${v.type})`;o.incidentTrace.push(y,this.mRootPart,v.lineNumber,v.columnNumber,v.lineNumber,v.columnNumber)}throw new Y(o.incidentTrace)}return c}setRootGraph(t){this.mRootPart=t}beginParseProcess(t,e){t.moveNextToken(),t.processStack.push({type:"graph-parse",parameter:{graph:e,linear:!0},state:0});let o=f.NODE_NULL_RESULT;for(;t.processStack.top;)o=this.processStack(t,t.processStack.top,o);return o}processChainedNodeParseProcess(t,e,o){switch(e.state){case 0:{let v=e.parameter.node.connections.next;return v===null?(t.processStack.pop(),{}):(e.state++,t.processStack.push({type:"node-parse",parameter:{node:v},state:0,values:{}}),f.NODE_NULL_RESULT)}case 1:{let c=o;return c===Y.PARSER_ERROR?(t.processStack.pop(),Y.PARSER_ERROR):(t.processStack.pop(),c)}}throw new A(`Invalid node next parse state "${e.state}".`,this)}processGraphParseProcess(t,e,o){let c=e.parameter.graph;switch(e.state){case 0:{if(t.graphIsCircular(c)){let v=t.getGraphPosition();return t.incidentTrace.push("Circular graph detected.",c,v.lineStart,v.columnStart,v.lineEnd,v.columnEnd),t.processStack.pop(),Y.PARSER_ERROR}let m=e.parameter.linear;return t.pushGraphStack(c,m),e.state++,t.processStack.push({type:"node-parse",parameter:{node:c.node},state:0,values:{}}),f.NODE_NULL_RESULT}case 1:{let m=o;if(m===Y.PARSER_ERROR)return t.popGraphStack(!0),t.processStack.pop(),Y.PARSER_ERROR;let v=c.convert(m,t);if(typeof v=="symbol"){let y=t.getGraphPosition();return t.incidentTrace.push(v.description??"Unknown data convert error",y.graph,y.lineStart,y.columnStart,y.lineEnd,y.columnEnd),t.popGraphStack(!0),t.processStack.pop(),Y.PARSER_ERROR}return t.popGraphStack(!1),t.processStack.pop(),v}}throw new A(`Invalid graph parse state "${e.state}".`,this)}processNodeParseProcess(t,e,o){let c=e.parameter.node;switch(e.state){case 0:return t.processStack.push({type:"node-value-parse",parameter:{node:c,valueIndex:0},state:0,values:{}}),e.state++,f.NODE_NULL_RESULT;case 1:{let m=o;return m===Y.PARSER_ERROR?(t.processStack.pop(),Y.PARSER_ERROR):(e.values.nodeValueResult=m,t.processStack.push({type:"node-next-parse",parameter:{node:c},state:0}),e.state++,f.NODE_NULL_RESULT)}case 2:{let m=o;if(m===Y.PARSER_ERROR)return t.processStack.pop(),Y.PARSER_ERROR;let v=c.mergeData(e.values.nodeValueResult,m);return t.processStack.pop(),v}}throw new A(`Invalid node parse state "${e.state}".`,this)}processNodeValueParseProcess(t,e,o){let c=e.parameter.node;switch(e.state){case 0:{if(o!==f.NODE_NULL_RESULT&&o!==Y.PARSER_ERROR)return e.values.parseResult=o,e.state++,f.NODE_NULL_RESULT;let m=e.parameter.valueIndex,v=c.connections;if(m>=v.values.length)return e.values.parseResult=f.NODE_VALUE_LIST_END_MEET,e.state++,f.NODE_NULL_RESULT;e.parameter.valueIndex++;let y=t.currentToken,T=v.values[m];if(typeof T=="string"){if(!y){if(v.required){let S=t.getTokenPosition();t.incidentTrace.push(`Unexpected end of statement. Token "${T}" expected.`,t.currentGraph,S.lineStart,S.columnStart,S.lineEnd,S.columnEnd)}return f.NODE_NULL_RESULT}if(T!==y.type){if(v.required){let S=t.getTokenPosition();t.incidentTrace.push(`Unexpected token "${y.value}". "${T}" expected`,t.currentGraph,S.lineStart,S.columnStart,S.lineEnd,S.columnEnd)}return f.NODE_NULL_RESULT}return t.moveNextToken(),y.value}else{let S=v.values.length===1||v.values.length===m+1;return t.processStack.push({type:"graph-parse",parameter:{graph:T,linear:S},state:0}),f.NODE_NULL_RESULT}}case 1:{let m=e.values.parseResult,v=c.connections;if(m===f.NODE_VALUE_LIST_END_MEET&&!v.required){t.processStack.pop();return}return m===f.NODE_VALUE_LIST_END_MEET?(t.processStack.pop(),Y.PARSER_ERROR):(t.processStack.pop(),m)}}throw new A(`Invalid node value parse state "${e.state}".`,this)}processStack(t,e,o){switch(e.type){case"graph-parse":return this.processGraphParseProcess(t,e,o);case"node-parse":return this.processNodeParseProcess(t,e,o);case"node-value-parse":return this.processNodeValueParseProcess(t,e,o);case"node-next-parse":return this.processChainedNodeParseProcess(t,e,o)}}};var J=class f{static define(t,e=!1){return new f(t,e)}mDataConverterList;mGraphCollector;mIsJunction;mResolvedGraphNode;get isJunction(){return this.mIsJunction}get node(){return this.mResolvedGraphNode||(this.mResolvedGraphNode=this.mGraphCollector().root),this.mResolvedGraphNode}constructor(t,e){this.mGraphCollector=t,this.mDataConverterList=new Array,this.mResolvedGraphNode=null,this.mIsJunction=e}convert(t,e){if(this.mDataConverterList.length===0)return t;let o=e.getGraphBoundingToken(),c=o[0]??void 0,m=o[1]??void 0;if(this.mDataConverterList.length===1)return this.mDataConverterList[0](t,c,m);let v=t;for(let y of this.mDataConverterList)if(v=y(v,c,m),typeof v=="symbol")return v;return v}converter(t){let e=new f(this.mGraphCollector,this.isJunction);return e.mDataConverterList.push(...this.mDataConverterList,t),e}};var U=class f{static new(){let t=new f("",!1,[]);return t.mRootNode=null,t}mConnections;mIdentifier;mRootNode;get configuration(){return{dataKey:this.mIdentifier.dataKey,isList:this.mIdentifier.type==="list",isRequired:this.mConnections.required,isBranch:this.mConnections.values.length>1}}get connections(){return this.mConnections}get root(){if(!this.mRootNode)throw new A("Staring nodes must be chained with another node to be used.",this);return this.mRootNode}constructor(t,e,o,c){if(t==="")this.mIdentifier={type:"empty",dataKey:"",mergeKey:""};else if(t.endsWith("[]"))this.mIdentifier={type:"list",mergeKey:"",dataKey:t.substring(0,t.length-2)};else if(t.includes("<-")){let v=t.split("<-");this.mIdentifier={type:"merge",dataKey:v[0],mergeKey:v[1]}}else this.mIdentifier={type:"single",mergeKey:"",dataKey:t};let m=o.map(v=>v instanceof f?J.define(()=>v):v);this.mConnections={required:e,values:m,next:null},c?this.mRootNode=c:this.mRootNode=this}mergeData(t,e){if(this.mIdentifier.type==="empty")return e;let o=e,c=typeof t>"u";if(this.mIdentifier.type==="single"){if(this.mIdentifier.dataKey in e)throw new A(`Graph path has a duplicate value identifier "${this.mIdentifier.dataKey}"`,this);return c||(o[this.mIdentifier.dataKey]=t),e}if(this.mIdentifier.type==="list"){let y;c?y=new Array:Array.isArray(t)?y=t:y=[t];let T=(()=>{if(this.mIdentifier.dataKey in e){let S=o[this.mIdentifier.dataKey];return Array.isArray(S)?(S.unshift(...y),S):(y.push(S),y)}return y})();return o[this.mIdentifier.dataKey]=T,e}if(c)return e;let m=(()=>{if(!this.mIdentifier.mergeKey)throw new A("Cant merge data without a merge key.",this);if(typeof t!="object"||t===null)throw new A("Node data must be an object when merge key is set.",this);if(!(this.mIdentifier.mergeKey in t))throw new A(`Node data does not contain merge key "${this.mIdentifier.mergeKey}"`,this);return t[this.mIdentifier.mergeKey]})();if(typeof m>"u")return e;let v=o[this.mIdentifier.dataKey];if(typeof v>"u")return o[this.mIdentifier.dataKey]=m,o;if(!Array.isArray(v))throw new A("Chain data merge value is not an array but should be.",this);return Array.isArray(m)?v.unshift(...m):v.unshift(m),e}optional(t,e){let o=typeof e>"u"?"":t,c=typeof e>"u"?t:e,m=new Array;Array.isArray(c)?m.push(...c):m.push(c);let v=new f(o,!1,m,this.mRootNode);return this.setChainedNode(v),v}required(t,e){let o=typeof e>"u"?"":t,c=typeof e>"u"?t:e,m=new Array;Array.isArray(c)?m.push(...c):m.push(c);let v=new f(o,!0,m,this.mRootNode);return this.setChainedNode(v),v}setChainedNode(t){if(this.mConnections.next!==null)throw new A("Node can only be chained to a single node.",this);this.mConnections.next=t}};var j={XmlIdentifier:"Identifier",XmlAssignment:"XmlAssignment",XmlValue:"XmlValue",XmlComment:"XmlComment",XmlOpenClosingBracket:"XmlOpenClosingBracket",XmlCloseBracket:"XmlCloseBracket",XmlOpenBracket:"XmlOpenBracket",XmlCloseClosingBracket:"XmlCloseClosingBracket",XmlExplicitValueIdentifier:"XmlExplicitValueIdentifier",ExpressionStart:"ExpressionStart",ExpressionEnd:"ExpressionEnd",ExpressionValue:"ExpressionValue",InstructionStart:"InstructionStart",InstructionInstructionValue:"InstructionInstructionValue",InstructionBodyStartBraket:"InstructionBodyStartBraket",InstructionBodyCloseBraket:"InstructionBodyCloseBraket",InstructionInstructionClosingBracket:"InstructionInstructionClosingBracket",InstructionInstructionOpeningBracket:"InstructionInstructionOpeningBracket"};var Fe=class extends fe{constructor(){super(),this.validWhitespaces=` 
\r`,this.trimWhitespace=!0;let t=this.createTokenPattern({pattern:{regex:/(?:(?!}}).)*/,type:j.ExpressionValue}}),e=this.createTokenPattern({pattern:{start:{regex:/{{/,type:j.ExpressionStart},end:{regex:/}}/,type:j.ExpressionEnd}}},s=>{s.useChildPattern(t)}),o=this.createTokenPattern({pattern:{regex:/[^>\s\n="/]+/,type:j.XmlIdentifier}}),c=this.createTokenPattern({pattern:{regex:/(?:(?!{{|"|<).)+/,type:j.XmlValue}}),m=this.createTokenPattern({pattern:{regex:/<!--.*?-->/,type:j.XmlComment}}),v=this.createTokenPattern({pattern:{regex:/=/,type:j.XmlAssignment}}),y=this.createTokenPattern({pattern:{start:{regex:/"/,type:j.XmlExplicitValueIdentifier},end:{regex:/"/,type:j.XmlExplicitValueIdentifier}}},s=>{s.useChildPattern(e),s.useChildPattern(c)}),T=this.createTokenPattern({pattern:{start:{regex:/<\//,type:j.XmlOpenClosingBracket},end:{regex:/>/,type:j.XmlCloseBracket}}},s=>{s.useChildPattern(o)}),S=this.createTokenPattern({pattern:{start:{regex:/</,type:j.XmlOpenBracket},end:{regex:/(?<closeClosingBracket>\/>)|(?<closeBracket>>)/,type:{closeClosingBracket:j.XmlCloseClosingBracket,closeBracket:j.XmlCloseBracket}}}},s=>{s.useChildPattern(v),s.useChildPattern(o),s.useChildPattern(y)}),l=this.createTokenPattern({pattern:{regex:/[^()"'`/)]+/,type:j.InstructionInstructionValue}}),n=this.createTokenPattern({pattern:{innerType:j.InstructionInstructionValue,start:{regex:/\//,type:j.InstructionInstructionValue},end:{regex:/\//,type:j.InstructionInstructionValue}}},s=>{s.useChildPattern(a),s.useChildPattern(r),s.useChildPattern(b),s.useChildPattern(u),s.useChildPattern(l)}),u=this.createTokenPattern({pattern:{innerType:j.InstructionInstructionValue,start:{regex:/\(/,type:j.InstructionInstructionValue},end:{regex:/\)/,type:j.InstructionInstructionValue}}},s=>{s.useChildPattern(n),s.useChildPattern(a),s.useChildPattern(r),s.useChildPattern(b),s.useChildPattern(l)}),a=this.createTokenPattern({pattern:{innerType:j.InstructionInstructionValue,start:{regex:/"/,type:j.InstructionInstructionValue},end:{regex:/"/,type:j.InstructionInstructionValue}}},s=>{s.useChildPattern(n),s.useChildPattern(r),s.useChildPattern(b),s.useChildPattern(u),s.useChildPattern(l)}),r=this.createTokenPattern({pattern:{innerType:j.InstructionInstructionValue,start:{regex:/'/,type:j.InstructionInstructionValue},end:{regex:/'/,type:j.InstructionInstructionValue}}},s=>{s.useChildPattern(n),s.useChildPattern(a),s.useChildPattern(b),s.useChildPattern(u),s.useChildPattern(l)}),b=this.createTokenPattern({pattern:{innerType:j.InstructionInstructionValue,start:{regex:/`/,type:j.InstructionInstructionValue},end:{regex:/`/,type:j.InstructionInstructionValue}}},s=>{s.useChildPattern(n),s.useChildPattern(a),s.useChildPattern(r),s.useChildPattern(u),s.useChildPattern(l)}),g=this.createTokenPattern({pattern:{regex:/\$[^(\s\n/{]+/,type:j.InstructionStart}}),D=this.createTokenPattern({pattern:{start:{regex:/\(/,type:j.InstructionInstructionOpeningBracket},end:{regex:/\)/,type:j.InstructionInstructionClosingBracket}}},s=>{s.useChildPattern(n),s.useChildPattern(a),s.useChildPattern(r),s.useChildPattern(b),s.useChildPattern(u),s.useChildPattern(l)}),w=this.createTokenPattern({pattern:{start:{regex:/{/,type:j.InstructionBodyStartBraket},end:{regex:/}/,type:j.InstructionBodyCloseBraket}}},s=>{for(let d of p)s.useChildPattern(d)}),p=[m,T,S,y,e,g,D,w,c];for(let s of p)this.useRootTokenPattern(s)}};var ge=class extends pe{constructor(){super(new Fe),this.initGraph()}initGraph(){let t=J.define(()=>U.new().required(j.ExpressionStart).optional("value",j.ExpressionValue).required(j.ExpressionEnd)).converter(r=>new gt(r.value??"")),e=J.define(()=>{let r=e;return U.new().required("data[]",U.new().required("value",[t,U.new().required("text",j.XmlValue)])).optional("data<-data",r)}),o=J.define(()=>U.new().required("name",j.XmlIdentifier).optional("attributeValue",U.new().required(j.XmlAssignment).required(j.XmlExplicitValueIdentifier).optional("list<-data",e).required(j.XmlExplicitValueIdentifier))).converter(r=>{let b=new Array;if(r.attributeValue?.list)for(let g of r.attributeValue.list)g.value instanceof gt?b.push(g.value):b.push(g.value.text);return{name:r.name,values:b}}),c=J.define(()=>{let r=c;return U.new().required("data[]",o).optional("data<-data",r)}),m=J.define(()=>{let r=m;return U.new().required("data[]",U.new().required("value",[t,U.new().required("text",j.XmlValue),U.new().required(j.XmlExplicitValueIdentifier).required("text",j.XmlValue).required(j.XmlExplicitValueIdentifier)])).optional("data<-data",r)}),v=J.define(()=>U.new().required("list<-data",m)).converter(r=>{let b=new It;for(let g of r.list)g.value instanceof gt?b.addValue(g.value):b.addValue(g.value.text);return b}),y=J.define(()=>U.new().required(j.XmlComment)).converter(()=>null),T=J.define(()=>U.new().required(j.XmlOpenBracket).required("openingTagName",j.XmlIdentifier).optional("attributes<-data",c).required("closing",[U.new().required(j.XmlCloseClosingBracket),U.new().required(j.XmlCloseBracket).required("values",u).required(j.XmlOpenClosingBracket).required("closingTageName",j.XmlIdentifier).required(j.XmlCloseBracket)])).converter(r=>{if("closingTageName"in r.closing&&r.openingTagName!==r.closing.closingTageName)throw new A(`Opening (${r.openingTagName}) and closing tagname (${r.closing.closingTageName}) does not match`,this);let b=new St(r.openingTagName);if(r.attributes)for(let g of r.attributes)b.setAttribute(g.name).addValue(...g.values);return"values"in r.closing&&b.appendChild(...r.closing.values),b}),S=J.define(()=>{let r=S;return U.new().required("list[]",j.InstructionInstructionValue).optional("list<-list",r)}),l=J.define(()=>U.new().required("instructionName",j.InstructionStart).optional("instruction",U.new().required(j.InstructionInstructionOpeningBracket).required("value<-list",S).required(j.InstructionInstructionClosingBracket)).optional("body",U.new().required(j.InstructionBodyStartBraket).required("value",u).required(j.InstructionBodyCloseBraket))).converter(r=>{let b=r.instructionName.substring(1),g=r.instruction?.value.join("")??"",D=new $t(b,g);return r.body&&D.appendChild(...r.body.value),D}),n=J.define(()=>{let r=n;return U.new().required("list[]",[y,T,l,v]).optional("list<-list",r)}),u=J.define(()=>{let r=n;return U.new().optional("list<-list",r)}).converter(r=>{let b=new Array;if(r.list)for(let g of r.list)g!==null&&b.push(g);return b}),a=J.define(()=>U.new().required("content",u)).converter(r=>{let b=new lt;return b.appendChild(...r.content),b});this.setRootGraph(a)}};var $=class f extends Me{static mTemplateCache=new k;static mXmlParser=new ge;mComponentElement;mRootBuilder;get element(){return this.mComponentElement.htmlElement}constructor(t){super({constructor:t.processorConstructor,parent:null}),tt.registerComponent(this,t.htmlElement),this.setProcessorInjection(f,this),this.addConstructionHook(o=>{tt.registerComponent(this,this.mComponentElement.htmlElement,o)}),f.mTemplateCache.has(t.processorConstructor)||f.mTemplateCache.set(t.processorConstructor,f.mXmlParser.parse(t.templateString??""));let e=f.mTemplateCache.get(t.processorConstructor).clone();this.mComponentElement=new me(t.htmlElement),this.mRootBuilder=new Yt(e,new Re(this,t.expressionModule),new dt(this),"ROOT"),this.mComponentElement.shadowRoot.appendChild(this.mRootBuilder.anchor),this.setProcessorInjection(wt,new wt(this.mRootBuilder.values))}addStyle(t){let e=document.createElement("style");e.innerHTML=t,this.mComponentElement.shadowRoot.prepend(e)}attributeChanged(t,e,o){this.call("onAttributeChange",t,e,o)}connected(){this.call("onConnect")}deconstruct(){this.call("onDeconstruct"),this.mRootBuilder.deconstruct(),super.deconstruct()}disconnected(){this.call("onDisconnect")}onUpdate(){return this.mRootBuilder.update()?(this.call("onUpdate"),!0):!1}};function W(f){return(t,e)=>{O.registerInjectable(t,e.metadata,"instanced"),tt.registerConstructor(t,f.selector);let o=class extends HTMLElement{mComponent;constructor(){super(),this.mComponent=new $({processorConstructor:t,templateString:f.template??null,expressionModule:f.expressionmodule,htmlElement:this}).setup(),f.style&&this.mComponent.addStyle(f.style),this.mComponent.updater.update()}connectedCallback(){this.mComponent.connected()}disconnectedCallback(){this.mComponent.disconnected()}};globalThis.customElements.define(f.selector,o)}}function Bt(f){return(t,e)=>{O.registerInjectable(t,e.metadata,"instanced"),at.register(At,t,{access:f.access,targetRestrictions:f.targetRestrictions})}}function yt(f){return(t,e)=>{O.registerInjectable(t,e.metadata,"instanced"),at.register(vt,t,{access:f.access,selector:f.selector})}}function Ct(f){return(t,e)=>{O.registerInjectable(t,e.metadata,"instanced"),at.register(jt,t,{instructionType:f.instructionType})}}function Fi(){function f(l,n){return function(a){e(n,"addInitializer"),o(a,"An initializer"),l.push(a)}}function t(l,n,u,a,r,b,g,D,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:g?"#"+n:n,static:b,private:g,metadata:D},d={v:!1};s.addInitializer=f(a,d);var i,h;r===0?g?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return l(w,s)}finally{d.v=!0}}function e(l,n){if(l.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(l,n){if(typeof l!="function")throw new TypeError(n+" must be a function")}function c(l,n){var u=typeof n;if(l===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var a;throw l===0?a="field":l===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function m(l,n,u,a,r,b,g,D,w){var p=u[0],s,d,i;g?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,C;if(typeof p=="function")h=t(p,a,s,D,r,b,g,w,i),h!==void 0&&(c(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h);else for(var P=p.length-1;P>=0;P--){var M=p[P];if(h=t(M,a,s,D,r,b,g,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(I,E){return E};else if(typeof d!="function"){var F=d;d=function(I,E){for(var L=E,R=0;R<F.length;R++)L=F[R].call(I,L);return L}}else{var z=d;d=function(I,E){return z.call(I,E)}}l.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),g?r===1?(l.push(function(I,E){return i.get.call(I,E)}),l.push(function(I,E){return i.set.call(I,E)})):r===2?l.push(i):l.push(function(I,E){return i.call(I,E)}):Object.defineProperty(n,a,s))}function v(l,n,u){for(var a=[],r,b,g=new Map,D=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,C;if(h?(x=l,s=s-5,b=b||[],C=b):(x=l.prototype,r=r||[],C=r),s!==0&&!i){var P=h?D:g,M=P.get(d)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!M&&s>2?P.set(d,s):P.set(d,!0)}m(a,x,p,d,s,h,i,C,u)}}return y(a,r),y(a,b),a}function y(l,n){n&&l.push(function(u){for(var a=0;a<n.length;a++)n[a].call(u);return u})}function T(l,n,u){if(n.length>0){for(var a=[],r=l,b=l.name,g=n.length-1;g>=0;g--){var D={v:!1};try{var w=n[g](r,{kind:"class",name:b,addInitializer:f(a,D),metadata:u})}finally{D.v=!0}w!==void 0&&(c(10,w),r=w)}return[S(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function S(l,n){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,a,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(b===void 0?null:b),D=v(n,u,g);return a.length||S(n,g),{e:D,get c(){return T(n,a,g)}}}}function xr(f,t,e,o){return(xr=Fi())(f,t,e,o)}function ji(f){return f}var Tr,wr,ve;Tr=Bt({access:X.Read,targetRestrictions:[$]});new class extends ji{constructor(){super(ve),wr()}static{class f{static{({c:[ve,wr]}=xr(this,[],[Tr]))}static METADATA_USER_EVENT_LISTENER_PROPERIES="pwb:user_event_listener_properties";mEventListenerList;mTargetElement;constructor(e=O.use($)){let o=new Array,c=e.processorConstructor;do{let m=nt.get(c).getMetadata(f.METADATA_USER_EVENT_LISTENER_PROPERIES);if(m)for(let v of m)o.push(v)}while(c=Object.getPrototypeOf(c));this.mEventListenerList=new Array,this.mTargetElement=e.element;for(let m of o){let[v,y]=m,T=Reflect.get(e.processor,v);T=T.bind(e.processor),this.mEventListenerList.push([y,T]),this.mTargetElement.addEventListener(y,T)}}onDeconstruct(){for(let e of this.mEventListenerList){let[o,c]=e;this.mTargetElement.removeEventListener(o,c)}}}}};var ye=class extends window.Event{mValue;get value(){return this.mValue}constructor(t,e){super(t),this.mValue=e}};var be=class{mElement;mEventName;constructor(t,e){this.mEventName=t,this.mElement=e}dispatchEvent(t){let e=new ye(this.mEventName,t);this.mElement.dispatchEvent(e)}};function qt(f){return(t,e)=>{if(e.static)throw new A("Event target is not for a static property.",qt);let o=new WeakMap;return{get(){if(!o.has(this)){let c=(()=>{try{return tt.ofProcessor(this).component}catch{throw new A("PwbComponentEvent target class is not a component.",this)}})();o.set(this,new be(f,c.element))}return o.get(this)}}}}function zi(){function f(l,n){return function(a){e(n,"addInitializer"),o(a,"An initializer"),l.push(a)}}function t(l,n,u,a,r,b,g,D,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:g?"#"+n:n,static:b,private:g,metadata:D},d={v:!1};s.addInitializer=f(a,d);var i,h;r===0?g?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return l(w,s)}finally{d.v=!0}}function e(l,n){if(l.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(l,n){if(typeof l!="function")throw new TypeError(n+" must be a function")}function c(l,n){var u=typeof n;if(l===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var a;throw l===0?a="field":l===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function m(l,n,u,a,r,b,g,D,w){var p=u[0],s,d,i;g?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,C;if(typeof p=="function")h=t(p,a,s,D,r,b,g,w,i),h!==void 0&&(c(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h);else for(var P=p.length-1;P>=0;P--){var M=p[P];if(h=t(M,a,s,D,r,b,g,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(I,E){return E};else if(typeof d!="function"){var F=d;d=function(I,E){for(var L=E,R=0;R<F.length;R++)L=F[R].call(I,L);return L}}else{var z=d;d=function(I,E){return z.call(I,E)}}l.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),g?r===1?(l.push(function(I,E){return i.get.call(I,E)}),l.push(function(I,E){return i.set.call(I,E)})):r===2?l.push(i):l.push(function(I,E){return i.call(I,E)}):Object.defineProperty(n,a,s))}function v(l,n,u){for(var a=[],r,b,g=new Map,D=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,C;if(h?(x=l,s=s-5,b=b||[],C=b):(x=l.prototype,r=r||[],C=r),s!==0&&!i){var P=h?D:g,M=P.get(d)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!M&&s>2?P.set(d,s):P.set(d,!0)}m(a,x,p,d,s,h,i,C,u)}}return y(a,r),y(a,b),a}function y(l,n){n&&l.push(function(u){for(var a=0;a<n.length;a++)n[a].call(u);return u})}function T(l,n,u){if(n.length>0){for(var a=[],r=l,b=l.name,g=n.length-1;g>=0;g--){var D={v:!1};try{var w=n[g](r,{kind:"class",name:b,addInitializer:f(a,D),metadata:u})}finally{D.v=!0}w!==void 0&&(c(10,w),r=w)}return[S(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function S(l,n){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,a,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(b===void 0?null:b),D=v(n,u,g);return a.length||S(n,g),{e:D,get c(){return T(n,a,g)}}}}function Er(f,t,e,o){return(Er=zi())(f,t,e,o)}function Vi(f){return f}var Ir,Dr,we;Ir=Bt({access:X.ReadWrite,targetRestrictions:[$]});new class extends Vi{constructor(){super(we),Dr()}static{class f{static{({c:[we,Dr]}=Er(this,[],[Ir]))}static METADATA_EXPORTED_PROPERTIES="pwb:exported_properties";mComponent;constructor(e=O.use($)){this.mComponent=e;let o=new zt,c=e.processorConstructor;do{let v=nt.get(c).getMetadata(f.METADATA_EXPORTED_PROPERTIES);v&&o.push(...v)}while(c=Object.getPrototypeOf(c));let m=new Set(o);m.size>0&&this.connectExportedProperties(m)}connectExportedProperties(e){this.exportPropertyAsAttribute(e),this.patchHtmlAttributes(e)}exportPropertyAsAttribute(e){for(let o of e){let c={};c.enumerable=!0,c.configurable=!0,delete c.value,delete c.writable,c.set=m=>{Reflect.set(this.mComponent.processor,o,m)},c.get=()=>{let m=Reflect.get(this.mComponent.processor,o);return typeof m=="function"&&(m=m.bind(this.mComponent.processor)),m},Object.defineProperty(this.mComponent.element,o,c)}}patchHtmlAttributes(e){let o=this.mComponent.element.getAttribute;new MutationObserver(m=>{for(let v of m){let y=v.attributeName,T=o.call(this.mComponent.element,y);Reflect.set(this.mComponent.element,y,T),this.mComponent.attributeChanged(y,v.oldValue,T)}}).observe(this.mComponent.element,{attributeFilter:[...e],attributeOldValue:!0});for(let m of e)if(this.mComponent.element.hasAttribute(m)){let v=o.call(this.mComponent.element,m);this.mComponent.element.setAttribute(m,v)}this.mComponent.element.getAttribute=m=>e.has(m)?Reflect.get(this.mComponent.element,m):o.call(this.mComponent.element,m)}}}};function rt(f,t){if(t.static)throw new A("Event target is not for a static property.",rt);let e=nt.forInternalDecorator(t.metadata),o=e.getMetadata(we.METADATA_EXPORTED_PROPERTIES)??new Array;o.push(t.name),e.setMetadata(we.METADATA_EXPORTED_PROPERTIES,o)}function ft(f){return(t,e)=>{if(e.static)throw new A("Child decorator is not for a static property.",ft);return{get(){let m=(()=>{try{return tt.ofProcessor(this).component}catch{throw new A("PwbChild target class is not a component.",this)}})().getProcessorInjection(wt).data.store[f];if(m instanceof Element)return m;throw new A(`Can't find child "${f}".`,this)}}}}function $i(){function f(l,n){return function(a){e(n,"addInitializer"),o(a,"An initializer"),l.push(a)}}function t(l,n,u,a,r,b,g,D,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:g?"#"+n:n,static:b,private:g,metadata:D},d={v:!1};s.addInitializer=f(a,d);var i,h;r===0?g?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return l(w,s)}finally{d.v=!0}}function e(l,n){if(l.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(l,n){if(typeof l!="function")throw new TypeError(n+" must be a function")}function c(l,n){var u=typeof n;if(l===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var a;throw l===0?a="field":l===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function m(l,n,u,a,r,b,g,D,w){var p=u[0],s,d,i;g?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,C;if(typeof p=="function")h=t(p,a,s,D,r,b,g,w,i),h!==void 0&&(c(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h);else for(var P=p.length-1;P>=0;P--){var M=p[P];if(h=t(M,a,s,D,r,b,g,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(I,E){return E};else if(typeof d!="function"){var F=d;d=function(I,E){for(var L=E,R=0;R<F.length;R++)L=F[R].call(I,L);return L}}else{var z=d;d=function(I,E){return z.call(I,E)}}l.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),g?r===1?(l.push(function(I,E){return i.get.call(I,E)}),l.push(function(I,E){return i.set.call(I,E)})):r===2?l.push(i):l.push(function(I,E){return i.call(I,E)}):Object.defineProperty(n,a,s))}function v(l,n,u){for(var a=[],r,b,g=new Map,D=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,C;if(h?(x=l,s=s-5,b=b||[],C=b):(x=l.prototype,r=r||[],C=r),s!==0&&!i){var P=h?D:g,M=P.get(d)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!M&&s>2?P.set(d,s):P.set(d,!0)}m(a,x,p,d,s,h,i,C,u)}}return y(a,r),y(a,b),a}function y(l,n){n&&l.push(function(u){for(var a=0;a<n.length;a++)n[a].call(u);return u})}function T(l,n,u){if(n.length>0){for(var a=[],r=l,b=l.name,g=n.length-1;g>=0;g--){var D={v:!1};try{var w=n[g](r,{kind:"class",name:b,addInitializer:f(a,D),metadata:u})}finally{D.v=!0}w!==void 0&&(c(10,w),r=w)}return[S(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function S(l,n){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,a,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(b===void 0?null:b),D=v(n,u,g);return a.length||S(n,g),{e:D,get c(){return T(n,a,g)}}}}function Pr(f,t,e,o){return(Pr=$i())(f,t,e,o)}var Mr,Sr,Gi;Mr=Ct({instructionType:"dynamic-content"});var Cr=class{static{({c:[Gi,Sr]}=Pr(this,[],[Mr]))}constructor(t=O.use(Q),e=O.use(H)){this.mModuleValues=e,this.mLastTemplate=null,this.mProcedure=this.mModuleValues.createExpressionProcedure(t.value)}mLastTemplate;mModuleValues;mProcedure;onUpdate(){let t=this.mProcedure.execute();if(!t||!(t instanceof lt))throw new A("Dynamic content method has a wrong result type.",this);if(this.mLastTemplate!==null&&this.mLastTemplate.equals(t))return null;let e=t.clone();this.mLastTemplate=e;let o=new ct;return o.addElement(e,new dt(this.mModuleValues.data)),o}static{Sr()}};function Bi(){function f(l,n){return function(a){e(n,"addInitializer"),o(a,"An initializer"),l.push(a)}}function t(l,n,u,a,r,b,g,D,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:g?"#"+n:n,static:b,private:g,metadata:D},d={v:!1};s.addInitializer=f(a,d);var i,h;r===0?g?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return l(w,s)}finally{d.v=!0}}function e(l,n){if(l.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(l,n){if(typeof l!="function")throw new TypeError(n+" must be a function")}function c(l,n){var u=typeof n;if(l===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var a;throw l===0?a="field":l===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function m(l,n,u,a,r,b,g,D,w){var p=u[0],s,d,i;g?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,C;if(typeof p=="function")h=t(p,a,s,D,r,b,g,w,i),h!==void 0&&(c(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h);else for(var P=p.length-1;P>=0;P--){var M=p[P];if(h=t(M,a,s,D,r,b,g,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(I,E){return E};else if(typeof d!="function"){var F=d;d=function(I,E){for(var L=E,R=0;R<F.length;R++)L=F[R].call(I,L);return L}}else{var z=d;d=function(I,E){return z.call(I,E)}}l.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),g?r===1?(l.push(function(I,E){return i.get.call(I,E)}),l.push(function(I,E){return i.set.call(I,E)})):r===2?l.push(i):l.push(function(I,E){return i.call(I,E)}):Object.defineProperty(n,a,s))}function v(l,n,u){for(var a=[],r,b,g=new Map,D=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,C;if(h?(x=l,s=s-5,b=b||[],C=b):(x=l.prototype,r=r||[],C=r),s!==0&&!i){var P=h?D:g,M=P.get(d)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!M&&s>2?P.set(d,s):P.set(d,!0)}m(a,x,p,d,s,h,i,C,u)}}return y(a,r),y(a,b),a}function y(l,n){n&&l.push(function(u){for(var a=0;a<n.length;a++)n[a].call(u);return u})}function T(l,n,u){if(n.length>0){for(var a=[],r=l,b=l.name,g=n.length-1;g>=0;g--){var D={v:!1};try{var w=n[g](r,{kind:"class",name:b,addInitializer:f(a,D),metadata:u})}finally{D.v=!0}w!==void 0&&(c(10,w),r=w)}return[S(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function S(l,n){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,a,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(b===void 0?null:b),D=v(n,u,g);return a.length||S(n,g),{e:D,get c(){return T(n,a,g)}}}}function Lr(f,t,e,o){return(Lr=Bi())(f,t,e,o)}var Rr,Nr,Ui;Rr=yt({access:X.Write,selector:/^\([[\w\-$]+\)$/});var Ar=class{static{({c:[Ui,Nr]}=Lr(this,[],[Rr]))}constructor(t=O.use(q),e=O.use(H),o=O.use(et)){this.mTarget=t,this.mEventName=o.name.substring(1,o.name.length-1);let c=e.createExpressionProcedure(o.value,["$event"]);this.mListener=m=>{c.setTemporaryValue("$event",m),c.execute()},this.mTarget.addEventListener(this.mEventName,this.mListener)}mEventName;mListener;mTarget;onDeconstruct(){this.mTarget.removeEventListener(this.mEventName,this.mListener)}static{Nr()}};function Hi(){function f(l,n){return function(a){e(n,"addInitializer"),o(a,"An initializer"),l.push(a)}}function t(l,n,u,a,r,b,g,D,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:g?"#"+n:n,static:b,private:g,metadata:D},d={v:!1};s.addInitializer=f(a,d);var i,h;r===0?g?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return l(w,s)}finally{d.v=!0}}function e(l,n){if(l.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(l,n){if(typeof l!="function")throw new TypeError(n+" must be a function")}function c(l,n){var u=typeof n;if(l===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var a;throw l===0?a="field":l===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function m(l,n,u,a,r,b,g,D,w){var p=u[0],s,d,i;g?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,C;if(typeof p=="function")h=t(p,a,s,D,r,b,g,w,i),h!==void 0&&(c(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h);else for(var P=p.length-1;P>=0;P--){var M=p[P];if(h=t(M,a,s,D,r,b,g,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(I,E){return E};else if(typeof d!="function"){var F=d;d=function(I,E){for(var L=E,R=0;R<F.length;R++)L=F[R].call(I,L);return L}}else{var z=d;d=function(I,E){return z.call(I,E)}}l.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),g?r===1?(l.push(function(I,E){return i.get.call(I,E)}),l.push(function(I,E){return i.set.call(I,E)})):r===2?l.push(i):l.push(function(I,E){return i.call(I,E)}):Object.defineProperty(n,a,s))}function v(l,n,u){for(var a=[],r,b,g=new Map,D=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,C;if(h?(x=l,s=s-5,b=b||[],C=b):(x=l.prototype,r=r||[],C=r),s!==0&&!i){var P=h?D:g,M=P.get(d)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!M&&s>2?P.set(d,s):P.set(d,!0)}m(a,x,p,d,s,h,i,C,u)}}return y(a,r),y(a,b),a}function y(l,n){n&&l.push(function(u){for(var a=0;a<n.length;a++)n[a].call(u);return u})}function T(l,n,u){if(n.length>0){for(var a=[],r=l,b=l.name,g=n.length-1;g>=0;g--){var D={v:!1};try{var w=n[g](r,{kind:"class",name:b,addInitializer:f(a,D),metadata:u})}finally{D.v=!0}w!==void 0&&(c(10,w),r=w)}return[S(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function S(l,n){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,a,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(b===void 0?null:b),D=v(n,u,g);return a.length||S(n,g),{e:D,get c(){return T(n,a,g)}}}}function Fr(f,t,e,o){return(Fr=Hi())(f,t,e,o)}var jr,Or,Xi;jr=Ct({instructionType:"for"});var _r=class{static{({c:[Xi,Or]}=Fr(this,[],[jr]))}constructor(t=O.use(mt),e=O.use(H),o=O.use(Q)){this.mTemplate=t,this.mModuleValues=e,this.mLastEntries=new Array;let c=o.value,v=new RegExp(/^\s*([a-zA-Z]+[a-zA-Z0-9]*)\s*of\s+([^;]+)\s*(;\s*([a-zA-Z]+[a-zA-Z0-9]*)\s*=\s*(.*)\s*)?$/).exec(c);if(!v)throw new A(`For-Parameter value has wrong format: ${c}`,this);let y=v[1],T=v[2],S=v[4]??null,l=v[5],n=this.mModuleValues.createExpressionProcedure(T),u=S?this.mModuleValues.createExpressionProcedure(l,["$index",y]):null;this.mExpression={iterateVariableName:y,iterateValueProcedure:n,indexExportVariableName:S,indexExportProcedure:u}}mExpression;mLastEntries;mModuleValues;mTemplate;onUpdate(){let t=new ct,e=this.mExpression.iterateValueProcedure.execute();if(typeof e=="object"&&e!==null||Array.isArray(e)){let o=Symbol.iterator in e?Object.entries([...e]):Object.entries(e);if(this.compareEntries(o,this.mLastEntries))return null;this.mLastEntries=o;for(let[c,m]of o)this.addTemplateForElement(t,this.mExpression,m,c);return t}else return null}addTemplateForElement=(t,e,o,c)=>{let m=new dt(this.mModuleValues.data);if(m.setTemporaryValue(e.iterateVariableName,o),e.indexExportProcedure&&e.indexExportVariableName){e.indexExportProcedure.setTemporaryValue("$index",c),e.indexExportProcedure.setTemporaryValue(e.iterateVariableName,o);let y=e.indexExportProcedure.execute();m.setTemporaryValue(e.indexExportVariableName,y)}let v=new lt;v.appendChild(...this.mTemplate.childList),t.addElement(v,m)};compareEntries(t,e){if(t.length!==e.length)return!1;for(let o=0;o<t.length;o++){let[c,m]=t[o],[v,y]=e[o];if(c!==v||m!==y)return!1}return!0}static{Or()}};function Yi(){function f(l,n){return function(a){e(n,"addInitializer"),o(a,"An initializer"),l.push(a)}}function t(l,n,u,a,r,b,g,D,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:g?"#"+n:n,static:b,private:g,metadata:D},d={v:!1};s.addInitializer=f(a,d);var i,h;r===0?g?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return l(w,s)}finally{d.v=!0}}function e(l,n){if(l.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(l,n){if(typeof l!="function")throw new TypeError(n+" must be a function")}function c(l,n){var u=typeof n;if(l===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var a;throw l===0?a="field":l===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function m(l,n,u,a,r,b,g,D,w){var p=u[0],s,d,i;g?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,C;if(typeof p=="function")h=t(p,a,s,D,r,b,g,w,i),h!==void 0&&(c(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h);else for(var P=p.length-1;P>=0;P--){var M=p[P];if(h=t(M,a,s,D,r,b,g,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(I,E){return E};else if(typeof d!="function"){var F=d;d=function(I,E){for(var L=E,R=0;R<F.length;R++)L=F[R].call(I,L);return L}}else{var z=d;d=function(I,E){return z.call(I,E)}}l.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),g?r===1?(l.push(function(I,E){return i.get.call(I,E)}),l.push(function(I,E){return i.set.call(I,E)})):r===2?l.push(i):l.push(function(I,E){return i.call(I,E)}):Object.defineProperty(n,a,s))}function v(l,n,u){for(var a=[],r,b,g=new Map,D=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,C;if(h?(x=l,s=s-5,b=b||[],C=b):(x=l.prototype,r=r||[],C=r),s!==0&&!i){var P=h?D:g,M=P.get(d)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!M&&s>2?P.set(d,s):P.set(d,!0)}m(a,x,p,d,s,h,i,C,u)}}return y(a,r),y(a,b),a}function y(l,n){n&&l.push(function(u){for(var a=0;a<n.length;a++)n[a].call(u);return u})}function T(l,n,u){if(n.length>0){for(var a=[],r=l,b=l.name,g=n.length-1;g>=0;g--){var D={v:!1};try{var w=n[g](r,{kind:"class",name:b,addInitializer:f(a,D),metadata:u})}finally{D.v=!0}w!==void 0&&(c(10,w),r=w)}return[S(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function S(l,n){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,a,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(b===void 0?null:b),D=v(n,u,g);return a.length||S(n,g),{e:D,get c(){return T(n,a,g)}}}}function $r(f,t,e,o){return($r=Yi())(f,t,e,o)}var Gr,zr,Wi;Gr=Ct({instructionType:"if"});var Vr=class{static{({c:[Wi,zr]}=$r(this,[],[Gr]))}constructor(t=O.use(mt),e=O.use(H),o=O.use(Q)){this.mTemplateReference=t,this.mModuleValues=e,this.mProcedure=this.mModuleValues.createExpressionProcedure(o.value),this.mLastBoolean=!1}mLastBoolean;mModuleValues;mProcedure;mTemplateReference;onUpdate(){let t=this.mProcedure.execute();if(!!t!==this.mLastBoolean){this.mLastBoolean=!!t;let e=new ct;if(t){let o=new lt;o.appendChild(...this.mTemplateReference.childList),e.addElement(o,new dt(this.mModuleValues.data))}return e}else return null}static{zr()}};function Zi(){function f(l,n){return function(a){e(n,"addInitializer"),o(a,"An initializer"),l.push(a)}}function t(l,n,u,a,r,b,g,D,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:g?"#"+n:n,static:b,private:g,metadata:D},d={v:!1};s.addInitializer=f(a,d);var i,h;r===0?g?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return l(w,s)}finally{d.v=!0}}function e(l,n){if(l.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(l,n){if(typeof l!="function")throw new TypeError(n+" must be a function")}function c(l,n){var u=typeof n;if(l===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var a;throw l===0?a="field":l===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function m(l,n,u,a,r,b,g,D,w){var p=u[0],s,d,i;g?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,C;if(typeof p=="function")h=t(p,a,s,D,r,b,g,w,i),h!==void 0&&(c(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h);else for(var P=p.length-1;P>=0;P--){var M=p[P];if(h=t(M,a,s,D,r,b,g,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(I,E){return E};else if(typeof d!="function"){var F=d;d=function(I,E){for(var L=E,R=0;R<F.length;R++)L=F[R].call(I,L);return L}}else{var z=d;d=function(I,E){return z.call(I,E)}}l.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),g?r===1?(l.push(function(I,E){return i.get.call(I,E)}),l.push(function(I,E){return i.set.call(I,E)})):r===2?l.push(i):l.push(function(I,E){return i.call(I,E)}):Object.defineProperty(n,a,s))}function v(l,n,u){for(var a=[],r,b,g=new Map,D=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,C;if(h?(x=l,s=s-5,b=b||[],C=b):(x=l.prototype,r=r||[],C=r),s!==0&&!i){var P=h?D:g,M=P.get(d)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!M&&s>2?P.set(d,s):P.set(d,!0)}m(a,x,p,d,s,h,i,C,u)}}return y(a,r),y(a,b),a}function y(l,n){n&&l.push(function(u){for(var a=0;a<n.length;a++)n[a].call(u);return u})}function T(l,n,u){if(n.length>0){for(var a=[],r=l,b=l.name,g=n.length-1;g>=0;g--){var D={v:!1};try{var w=n[g](r,{kind:"class",name:b,addInitializer:f(a,D),metadata:u})}finally{D.v=!0}w!==void 0&&(c(10,w),r=w)}return[S(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function S(l,n){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,a,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(b===void 0?null:b),D=v(n,u,g);return a.length||S(n,g),{e:D,get c(){return T(n,a,g)}}}}function Hr(f,t,e,o){return(Hr=Zi())(f,t,e,o)}var Xr,Br,qi;Xr=yt({access:X.Read,selector:/^\[[\w$]+\]$/});var Ur=class{static{({c:[qi,Br]}=Hr(this,[],[Xr]))}constructor(t=O.use(q),e=O.use(H),o=O.use(et)){this.mTarget=t,this.mProcedure=e.createExpressionProcedure(o.value),this.mTargetProperty=o.name.substring(1,o.name.length-1),this.mLastValue=Symbol("Uncomparable")}mLastValue;mProcedure;mTarget;mTargetProperty;onUpdate(){let t=this.mProcedure.execute();return t===this.mLastValue?!1:(this.mLastValue=t,Reflect.set(this.mTarget,this.mTargetProperty,t),!0)}static{Br()}};function Ji(){function f(l,n){return function(a){e(n,"addInitializer"),o(a,"An initializer"),l.push(a)}}function t(l,n,u,a,r,b,g,D,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:g?"#"+n:n,static:b,private:g,metadata:D},d={v:!1};s.addInitializer=f(a,d);var i,h;r===0?g?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return l(w,s)}finally{d.v=!0}}function e(l,n){if(l.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(l,n){if(typeof l!="function")throw new TypeError(n+" must be a function")}function c(l,n){var u=typeof n;if(l===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var a;throw l===0?a="field":l===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function m(l,n,u,a,r,b,g,D,w){var p=u[0],s,d,i;g?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,C;if(typeof p=="function")h=t(p,a,s,D,r,b,g,w,i),h!==void 0&&(c(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h);else for(var P=p.length-1;P>=0;P--){var M=p[P];if(h=t(M,a,s,D,r,b,g,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(I,E){return E};else if(typeof d!="function"){var F=d;d=function(I,E){for(var L=E,R=0;R<F.length;R++)L=F[R].call(I,L);return L}}else{var z=d;d=function(I,E){return z.call(I,E)}}l.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),g?r===1?(l.push(function(I,E){return i.get.call(I,E)}),l.push(function(I,E){return i.set.call(I,E)})):r===2?l.push(i):l.push(function(I,E){return i.call(I,E)}):Object.defineProperty(n,a,s))}function v(l,n,u){for(var a=[],r,b,g=new Map,D=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,C;if(h?(x=l,s=s-5,b=b||[],C=b):(x=l.prototype,r=r||[],C=r),s!==0&&!i){var P=h?D:g,M=P.get(d)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!M&&s>2?P.set(d,s):P.set(d,!0)}m(a,x,p,d,s,h,i,C,u)}}return y(a,r),y(a,b),a}function y(l,n){n&&l.push(function(u){for(var a=0;a<n.length;a++)n[a].call(u);return u})}function T(l,n,u){if(n.length>0){for(var a=[],r=l,b=l.name,g=n.length-1;g>=0;g--){var D={v:!1};try{var w=n[g](r,{kind:"class",name:b,addInitializer:f(a,D),metadata:u})}finally{D.v=!0}w!==void 0&&(c(10,w),r=w)}return[S(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function S(l,n){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,a,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(b===void 0?null:b),D=v(n,u,g);return a.length||S(n,g),{e:D,get c(){return T(n,a,g)}}}}function Zr(f,t,e,o){return(Zr=Ji())(f,t,e,o)}var qr,Yr,Ki;qr=yt({access:X.Write,selector:/^#[[\w$]+$/});var Wr=class{static{({c:[Ki,Yr]}=Zr(this,[],[qr]))}constructor(t=O.use(q),e=O.use(et),o=O.use(wt)){this.mChildName=e.name.substring(1),this.mComponentScopeValue=o,this.mTargetNode=t,this.mComponentScopeValue.setTemporaryValue(this.mChildName,this.mTargetNode)}mChildName;mComponentScopeValue;mTargetNode;onDeconstruct(){this.mComponentScopeValue.data.store[this.mChildName]===this.mTargetNode&&this.mComponentScopeValue.data.deleteTemporaryValue(this.mChildName)}static{Yr()}};function Qi(){function f(l,n){return function(a){e(n,"addInitializer"),o(a,"An initializer"),l.push(a)}}function t(l,n,u,a,r,b,g,D,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:g?"#"+n:n,static:b,private:g,metadata:D},d={v:!1};s.addInitializer=f(a,d);var i,h;r===0?g?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return l(w,s)}finally{d.v=!0}}function e(l,n){if(l.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(l,n){if(typeof l!="function")throw new TypeError(n+" must be a function")}function c(l,n){var u=typeof n;if(l===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var a;throw l===0?a="field":l===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function m(l,n,u,a,r,b,g,D,w){var p=u[0],s,d,i;g?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,C;if(typeof p=="function")h=t(p,a,s,D,r,b,g,w,i),h!==void 0&&(c(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h);else for(var P=p.length-1;P>=0;P--){var M=p[P];if(h=t(M,a,s,D,r,b,g,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(I,E){return E};else if(typeof d!="function"){var F=d;d=function(I,E){for(var L=E,R=0;R<F.length;R++)L=F[R].call(I,L);return L}}else{var z=d;d=function(I,E){return z.call(I,E)}}l.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),g?r===1?(l.push(function(I,E){return i.get.call(I,E)}),l.push(function(I,E){return i.set.call(I,E)})):r===2?l.push(i):l.push(function(I,E){return i.call(I,E)}):Object.defineProperty(n,a,s))}function v(l,n,u){for(var a=[],r,b,g=new Map,D=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,C;if(h?(x=l,s=s-5,b=b||[],C=b):(x=l.prototype,r=r||[],C=r),s!==0&&!i){var P=h?D:g,M=P.get(d)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!M&&s>2?P.set(d,s):P.set(d,!0)}m(a,x,p,d,s,h,i,C,u)}}return y(a,r),y(a,b),a}function y(l,n){n&&l.push(function(u){for(var a=0;a<n.length;a++)n[a].call(u);return u})}function T(l,n,u){if(n.length>0){for(var a=[],r=l,b=l.name,g=n.length-1;g>=0;g--){var D={v:!1};try{var w=n[g](r,{kind:"class",name:b,addInitializer:f(a,D),metadata:u})}finally{D.v=!0}w!==void 0&&(c(10,w),r=w)}return[S(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function S(l,n){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,a,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(b===void 0?null:b),D=v(n,u,g);return a.length||S(n,g),{e:D,get c(){return T(n,a,g)}}}}function Qr(f,t,e,o){return(Qr=Qi())(f,t,e,o)}var kr,Jr,ki;kr=Ct({instructionType:"slot"});var Kr=class{static{({c:[ki,Jr]}=Qr(this,[],[kr]))}constructor(t=O.use(H),e=O.use(Q)){this.mModuleValues=t,this.mSlotName=e.value,this.mIsSetup=!1}mIsSetup;mModuleValues;mSlotName;onUpdate(){if(this.mIsSetup)return null;this.mIsSetup=!0;let t=new St("slot");this.mSlotName!==""&&t.setAttribute("name").addValue(this.mSlotName);let e=new lt;e.appendChild(t);let o=new ct;return o.addElement(e,this.mModuleValues.data),o}static{Jr()}};function ts(){function f(l,n){return function(a){e(n,"addInitializer"),o(a,"An initializer"),l.push(a)}}function t(l,n,u,a,r,b,g,D,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:g?"#"+n:n,static:b,private:g,metadata:D},d={v:!1};s.addInitializer=f(a,d);var i,h;r===0?g?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return l(w,s)}finally{d.v=!0}}function e(l,n){if(l.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(l,n){if(typeof l!="function")throw new TypeError(n+" must be a function")}function c(l,n){var u=typeof n;if(l===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var a;throw l===0?a="field":l===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function m(l,n,u,a,r,b,g,D,w){var p=u[0],s,d,i;g?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,C;if(typeof p=="function")h=t(p,a,s,D,r,b,g,w,i),h!==void 0&&(c(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h);else for(var P=p.length-1;P>=0;P--){var M=p[P];if(h=t(M,a,s,D,r,b,g,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(I,E){return E};else if(typeof d!="function"){var F=d;d=function(I,E){for(var L=E,R=0;R<F.length;R++)L=F[R].call(I,L);return L}}else{var z=d;d=function(I,E){return z.call(I,E)}}l.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),g?r===1?(l.push(function(I,E){return i.get.call(I,E)}),l.push(function(I,E){return i.set.call(I,E)})):r===2?l.push(i):l.push(function(I,E){return i.call(I,E)}):Object.defineProperty(n,a,s))}function v(l,n,u){for(var a=[],r,b,g=new Map,D=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,C;if(h?(x=l,s=s-5,b=b||[],C=b):(x=l.prototype,r=r||[],C=r),s!==0&&!i){var P=h?D:g,M=P.get(d)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!M&&s>2?P.set(d,s):P.set(d,!0)}m(a,x,p,d,s,h,i,C,u)}}return y(a,r),y(a,b),a}function y(l,n){n&&l.push(function(u){for(var a=0;a<n.length;a++)n[a].call(u);return u})}function T(l,n,u){if(n.length>0){for(var a=[],r=l,b=l.name,g=n.length-1;g>=0;g--){var D={v:!1};try{var w=n[g](r,{kind:"class",name:b,addInitializer:f(a,D),metadata:u})}finally{D.v=!0}w!==void 0&&(c(10,w),r=w)}return[S(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function S(l,n){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,a,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(b===void 0?null:b),D=v(n,u,g);return a.length||S(n,g),{e:D,get c(){return T(n,a,g)}}}}function ro(f,t,e,o){return(ro=ts())(f,t,e,o)}var oo,to,es;oo=yt({access:X.ReadWrite,selector:/^\[\([[\w$]+\)\]$/});var eo=class{static{({c:[es,to]}=ro(this,[],[oo]))}constructor(t=O.use($),e=O.use(q),o=O.use(H),c=O.use(et)){this.mTargetNode=e,this.mAttributeKey=c.name.substring(2,c.name.length-2),this.mReadProcedure=o.createExpressionProcedure(c.value),this.mWriteProcedure=o.createExpressionProcedure(`${c.value} = $DATA;`,["$DATA"]),this.mLastDataValue=Symbol("Uncomparable");let m=v=>{this.mLastDataValue!==v&&t.updater.updateAsync()};this.mTargetNode.addEventListener("input",v=>{m(Reflect.get(this.mTargetNode,this.mAttributeKey))}),this.mTargetNode.addEventListener("change",v=>{m(Reflect.get(this.mTargetNode,this.mAttributeKey))})}mAttributeKey;mLastDataValue;mReadProcedure;mTargetNode;mWriteProcedure;onUpdate(){let t=this.mReadProcedure.execute();if(t!==this.mLastDataValue)return Reflect.set(this.mTargetNode,this.mAttributeKey,t),this.mLastDataValue=t,!0;let e=Reflect.get(this.mTargetNode,this.mAttributeKey);return e!==t?(this.mWriteProcedure.setTemporaryValue("$DATA",e),this.mWriteProcedure.execute(),this.mLastDataValue=e,!0):!1}static{to()}};function rs(){function f(l,n){return function(a){e(n,"addInitializer"),o(a,"An initializer"),l.push(a)}}function t(l,n,u,a,r,b,g,D,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:g?"#"+n:n,static:b,private:g,metadata:D},d={v:!1};s.addInitializer=f(a,d);var i,h;r===0?g?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return l(w,s)}finally{d.v=!0}}function e(l,n){if(l.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(l,n){if(typeof l!="function")throw new TypeError(n+" must be a function")}function c(l,n){var u=typeof n;if(l===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var a;throw l===0?a="field":l===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function m(l,n,u,a,r,b,g,D,w){var p=u[0],s,d,i;g?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,C;if(typeof p=="function")h=t(p,a,s,D,r,b,g,w,i),h!==void 0&&(c(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h);else for(var P=p.length-1;P>=0;P--){var M=p[P];if(h=t(M,a,s,D,r,b,g,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(I,E){return E};else if(typeof d!="function"){var F=d;d=function(I,E){for(var L=E,R=0;R<F.length;R++)L=F[R].call(I,L);return L}}else{var z=d;d=function(I,E){return z.call(I,E)}}l.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),g?r===1?(l.push(function(I,E){return i.get.call(I,E)}),l.push(function(I,E){return i.set.call(I,E)})):r===2?l.push(i):l.push(function(I,E){return i.call(I,E)}):Object.defineProperty(n,a,s))}function v(l,n,u){for(var a=[],r,b,g=new Map,D=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,C;if(h?(x=l,s=s-5,b=b||[],C=b):(x=l.prototype,r=r||[],C=r),s!==0&&!i){var P=h?D:g,M=P.get(d)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!M&&s>2?P.set(d,s):P.set(d,!0)}m(a,x,p,d,s,h,i,C,u)}}return y(a,r),y(a,b),a}function y(l,n){n&&l.push(function(u){for(var a=0;a<n.length;a++)n[a].call(u);return u})}function T(l,n,u){if(n.length>0){for(var a=[],r=l,b=l.name,g=n.length-1;g>=0;g--){var D={v:!1};try{var w=n[g](r,{kind:"class",name:b,addInitializer:f(a,D),metadata:u})}finally{D.v=!0}w!==void 0&&(c(10,w),r=w)}return[S(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function S(l,n){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,a,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(b===void 0?null:b),D=v(n,u,g);return a.length||S(n,g),{e:D,get c(){return T(n,a,g)}}}}function so(f,t,e,o){return(so=rs())(f,t,e,o)}var ao,no,os;ao=Bt({access:X.Read,targetRestrictions:[vt]});var io=class{static{({c:[os,no]}=so(this,[],[ao]))}constructor(t=O.use(vt),e=O.use(q)){let o=new Array,c=t.processorConstructor;do{let m=nt.get(c).getMetadata(ve.METADATA_USER_EVENT_LISTENER_PROPERIES);if(m)for(let v of m)o.push(v)}while(c=Object.getPrototypeOf(c));this.mEventListenerList=new Array,this.mTargetElement=e;for(let m of o){let[v,y]=m,T=Reflect.get(t.processor,v);T=T.bind(t.processor),this.mEventListenerList.push([y,T]),this.mTargetElement.addEventListener(y,T)}}mEventListenerList;mTargetElement;onDeconstruct(){for(let t of this.mEventListenerList){let[e,o]=t;this.mTargetElement.removeEventListener(e,o)}}static{no()}};var lo=`:host {\r
    display: block;\r
    width: 100%;\r
    height: 100%;\r
}\r
\r
potatno-code-editor {\r
    display: block;\r
    width: 100%;\r
    height: 100%;\r
}`;var Jt=class{mProject;constructor(t){this.mProject=t}deserialize(t){let e=new Nt(this.mProject);for(let o of t.functions)e.addFunction(this.deserializeFunction(o,e));return e}deserializeFunction(t,e){let o=new bt(this.mProject,e,{definitionId:t.definitionId,id:t.id,label:t.label,isSystem:t.isSystem});for(let m of t.imports)o.addImport(m);for(let m of t.inputs)o.addInput({label:m.label,dataType:m.dataType});for(let m of t.outputs)o.addOutput({label:m.label,dataType:m.dataType});let c=new Map;for(let m of t.nodes)c.set(m.id,this.deserializeNode(m,o,e));for(let m of t.connections){if(!c.has(m.sourceNodeId)||!c.has(m.targetNodeId))continue;let v=c.get(m.sourceNodeId),y=c.get(m.targetNodeId),T=v.outputs.map.get(m.sourcePortId),S=y.inputs.map.get(m.targetPortId);!T||!S||T.connect(S)}return o}deserializeNode(t,e,o){let c=o.nodeDefinitions.find(v=>v.id===t.definitionId),m=(()=>{if(c)return e.addNodeByDefinition(c,t.transformation);let v=t.ports.filter(T=>T.direction==="input").map(T=>({dataType:T.dataType,definitionId:T.definitionId,label:T.label,portType:T.portType})),y=t.ports.filter(T=>T.direction==="output").map(T=>({dataType:T.dataType,definitionId:T.definitionId,label:T.label,portType:T.portType}));return new Dt(this.mProject,o,e,{definitionId:t.definitionId,ports:{input:v,output:y},label:t.label,transformation:{...t.transformation}})})();m.label=t.label,e.addNode(m);for(let v of t.ports)if(v.portType==="value"&&v.directValue.length>0){let y=m.inputs.map.get(v.definitionId);y&&y.setDirectValue(v.directValue)}return m.preview=t.preview??null,m}};var Kt=class{constructor(){}serialize(t){return{functions:[...t.functions].map(e=>this.serializeFunction(e))}}serializeFunction(t){let e=new Map;[...t.nodes].forEach((y,T)=>{e.set(y,`n${T}`)});let o=[...t.nodes].map(y=>this.serializeNode(y,e.get(y))),c=[];for(let y of t.nodes){let T=e.get(y);for(let S of y.outputs.list)for(let l of S.connectedPorts){let n=e.get(l.node);c.push({sourceNodeId:T,sourcePortId:S.definitionId,targetNodeId:n,targetPortId:l.definitionId})}}let m=t.inputs.map(y=>({label:y.label,dataType:y.dataType})),v=t.outputs.map(y=>({label:y.label,dataType:y.dataType}));return{id:t.id,label:t.label,isSystem:t.isSystem,definitionId:t.definitionId,inputs:m,outputs:v,imports:[...t.imports],nodes:o,connections:c}}serializeNode(t,e){let o=[...t.inputs.list,...t.outputs.list].map(m=>({definitionId:m.definitionId,label:m.label,direction:m.direction,portType:m.portType,dataType:m.portType==="value"?m.dataType:null,directValue:[...m.directValue]})),c=t.preview?structuredClone(t.preview):null;return{id:e,definitionId:t.definitionId,label:t.label,transformation:{...t.transformation},ports:o,preview:c}}};var co=`:host {\r
    /* Globals */\r
    --potatno-grid-size: 25px;\r
    \r
    /* Font */\r
    --potatno-font-size: 0.75rem;\r
    --potatno-font-size-big: 0.8rem;\r
    --potatno-font-size-small: 0.7rem;\r
    --potatno-font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;\r
\r
    /* Main colors */\r
    --potatno-color-background: #1e1e2e;\r
    --potatno-color-background-dark: #181825;\r
    --potatno-color-background-light: #2a2a3c;\r
    --potatno-color-text: #a6adc8;\r
    --potatno-color-accent: #89b4fa;\r
    --potatno-color-border: #45475a;\r
\r
    /* Supporting colors */\r
    --potatno-color-error: #f38ba8;\r
    --potatno-color-shadow: rgba(0, 0, 0, 0.3);\r
\r
    /* Scrollbar */\r
    --potatno-color-scrollbar-thumb: #45475a;\r
    --potatno-color-scrollbar-track: transparent;\r
\r
\r
\r
\r
\r
    /* Text */\r
    --pn-text-muted: #6c7086;\r
\r
    /* Node category colors */\r
    --pn-cat-comment: #6c7086;\r
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
    /* Node */\r
    --pn-node-button-font-size: 9px;\r
    --pn-node-font-size: var(--potatno-font-size-small);\r
    --pn-node-header-height: var(--pn-grid-size);\r
    --pn-node-port-body-size: 9px;\r
    --pn-node-port-gap: var(--pn-grid-size);\r
    --pn-node-port-tip-size: 5px;\r
}`;var Qt=class{mCodeGenerator;mId;mLabel;mNodesProvider;mStatics;get codeGenerator(){return this.mCodeGenerator}get id(){return this.mId}get label(){return this.mLabel}get statics(){return this.mStatics}constructor(t){this.mId=t.id,this.mLabel=t.label,this.mNodesProvider=t.nodes,this.mStatics=t.statics,this.mCodeGenerator=t.generator.code}getNodeDefinitions(t){let e=c=>{if(!c)return new Array;let m=new Array;return c(v=>{m.push(v)},t),m},o={};return Object.defineProperty(o,"entry",{get:()=>e(this.mNodesProvider.entry)}),Object.defineProperty(o,"exit",{get:()=>e(this.mNodesProvider.exit)}),Object.defineProperty(o,"dynamic",{get:()=>e(this.mNodesProvider.dynamic)}),o}},ot={none:0,imports:1,inputs:2,outputs:4};var je=class f{static PASTE_OFFSET=2;mClipboardNodes;mManager;constructor(t){this.mManager=t,this.mClipboardNodes=new Array}copy(t){if(t.size===0)return;let e=[...t],o=new Map;for(let c=0;c<e.length;c++){let m=e[c],v=m.inputs.value.map(T=>({definitionId:T.definitionId,values:[...T.directValue]})),y={...m.transformation};y.x+=f.PASTE_OFFSET,y.y+=f.PASTE_OFFSET,o.set(m,{connections:new Array,definitionId:m.definitionId,id:c,portDirectValues:v,label:m.label,transformation:y})}for(let[c,m]of o)for(let v of c.outputs.list)for(let y of v.connectedPorts){let T=o.get(y.node);T&&m.connections.push({sourcePortName:v.definitionId,targetNodeId:T.id,targetPortName:y.definitionId})}this.mClipboardNodes=[...o.values()]}paste(){if(this.mClipboardNodes.length===0)return new Array;let t=this.mManager.activeFunction;if(!t)return[];let e=new Map;for(let o of this.mClipboardNodes){let c=t.dynamicNodeDefinitions.find(v=>v.id===o.definitionId);if(!c)continue;let m=this.mManager.graph.addNode(t,c,o.transformation);this.mManager.graph.updateNode(m,v=>{v.label=o.label;for(let y of o.portDirectValues)v.inputs.map.has(y.definitionId)&&v.inputs.map.get(y.definitionId).setDirectValue(y.values)}),e.set(o.id,m)}for(let o of this.mClipboardNodes){let c=e.get(o.id);if(c)for(let m of o.connections){let v=e.get(m.targetNodeId);if(!v)continue;let y=c.outputs.map.get(m.sourcePortName),T=v.inputs.map.get(m.targetPortName);!y||!T||this.mManager.graph.connectPorts(y,T)}}return[...e.values()]}};var ze=class extends se{mGridNodeArea;mGridPaths;mNodeArea;mPathArea;constructor(){super(),this.mGridNodeArea=new WeakMap,this.mNodeArea=new Map,this.mGridPaths=new WeakMap,this.mPathArea=new Map}clear(t){t==="all"&&this.mNodeArea.clear(),this.mPathArea.clear()}getPath(t,e){let o=t.direction==="input"&&t.portType==="value"||t.direction==="output"&&t.portType==="flow"?t:e;return this.mGridPaths.get(o)??new Array}removeNodeArea(t){if(!this.mGridNodeArea.has(t))return;let e=this.mGridNodeArea.get(t);for(let o of e){let c=(this.mNodeArea.get(o)??0)-1;c<1?this.mNodeArea.delete(o):this.mNodeArea.set(o,c)}this.mGridNodeArea.delete(t)}updateNodeArea(t){this.removeNodeArea(t);let e=t.transformation.x,o=t.transformation.y,c=t.transformation.width,m=t.transformation.height,v=new Array;for(let y=0;y<c;y++)for(let T=0;T<m;T++){let S=`${y+e}|${T+o}`,l=(this.mNodeArea.get(S)??0)+1;this.mNodeArea.set(S,l),v.push(S)}this.mGridNodeArea.set(t,v)}updatePath(t,e,o){if(t.direction==="input"&&t.portType!=="value"||t.direction==="output"&&t.portType!=="flow")throw new A("Start port must be an input-value or an output-flow node.",this);this.removePathArea(t);let c=this.start(e,o);this.mGridPaths.set(t,c.path);let m=this.nodeId(e),v=this.nodeId(o);for(let y of c.path){let T=this.nodeId(y),S=this.mPathArea.has(T)?this.mPathArea.get(T):{ports:new Map,entryPoints:new Set};S.ports.set(t,[m,v]),S.entryPoints.add(m),S.entryPoints.add(v),this.mPathArea.set(T,S)}}costOfTraversal(t,e){let o=this.nodeId(t),c=1;this.mNodeArea.has(o)&&t!==e.endNode&&(c*=20);let m=e.path.next().value;if(this.mPathArea.has(o)){let l=this.mPathArea.get(o),n=this.nodeId(e.startNode),u=this.nodeId(e.endNode);if(l.entryPoints.has(n)||l.entryPoints.has(u))c*=.2;else if(c*=5,m){let a=this.nodeId(m);this.mPathArea.has(a)&&(c*=20)}}if(m){let l=t.y===m.y;(t===e.endNode||m===e.startNode)&&!l&&(c*=100);let n=e.path.next().value;n&&(t.x===n.x||t.y===n.y)&&(c*=.7)}let v=Math.abs(t.x-e.startNode.x),y=Math.abs(t.x-e.endNode.x),T=v<=y;(T&&t.y===e.startNode.y||!T&&t.y===e.endNode.y)&&(c*=.5);let S=e.endNode.x+e.startNode.x>>1;return t.x===S&&(c*=.5),c}heuristic(t,e){return(Math.abs(t.x-e.endNode.x)+Math.abs(t.y-e.endNode.y))*.5}neighborNodes(t){return[{x:t.x,y:t.y-1},{x:t.x-1,y:t.y},{x:t.x+1,y:t.y},{x:t.x,y:t.y+1}]}nodeId(t){return`${t.x}|${t.y}`}removePathArea(t){if(!this.mGridPaths.has(t))return;let e=this.mGridPaths.get(t);for(let o of e){let c=this.nodeId(o),m=this.mPathArea.get(c);if(!m)continue;let v=m.ports.get(t);v&&(m.ports.delete(t),m.entryPoints.delete(v[0]),m.entryPoints.delete(v[1]),m.ports.size===0?this.mPathArea.delete(c):this.mPathArea.set(c,m))}this.mGridPaths.delete(t)}};var Ve=class{mGridElement;mManager;mPathFinder;set gridElement(t){this.mGridElement=t}constructor(t){this.mManager=t,this.mGridElement=null,this.mPathFinder=new ze,this.mManager.subscribe(_.Node|_.SpecialActiveFunction,e=>{if((e.changeType&_.SpecialActiveFunction)>0){if(!this.mManager.activeFunction)return;this.mPathFinder.clear("all");for(let o of this.mManager.activeFunction.nodes)this.mPathFinder.updateNodeArea(o);this.updatePaths();return}(e.changeType&_.Node)>0&&((e.changeType&_.NodeDelete)>0?this.mPathFinder.removeNodeArea(e.item):this.mPathFinder.updateNodeArea(e.item)),this.updatePaths()}),this.mManager.subscribe(_.Connection,()=>{this.updatePaths()})}createTemporaryPath(t,e){let o=y=>y instanceof ht?this.getPortGridPoint(y):y,c=o(t),m=o(e),v=this.mPathFinder.start(c,m).path;return this.createSvgPath(v)}getConnectionPath(t,e){let o=this.mPathFinder.getPath(t,e);return this.createSvgPath(o)}getPortGridPoint(t){let e=t.node,o=t.direction==="input"?e.inputs.list:e.outputs.list,c=(()=>{let v=0;for(;v<o.length&&o[v]!==t;v++);return v})(),m=t.direction==="input"?e.transformation.x:e.transformation.x+e.transformation.width-1;return{y:e.transformation.y+1+c,x:m}}pixelToGridSpace(t,e){let o=t,c=e;if(this.mGridElement){let m=this.mGridElement.getBoundingClientRect();o-=m.left,c-=m.top}return o-=this.mManager.grid.panX,c-=this.mManager.grid.panY,o/=this.mManager.grid.zoom,c/=this.mManager.grid.zoom,{x:Math.floor(o/this.mManager.grid.gridSize),y:Math.floor(c/this.mManager.grid.gridSize)}}createGridCellPath(t,e,o){let c=this.getGridPosition(t,e),m=this.getGridPosition(t,o),v={x:e==="bottom"||e==="top"?c.x:m.x,y:e==="left"||e==="right"?c.y:m.y};return`M ${c.x},${c.y} Q ${v.x},${v.y} ${m.x},${m.y}`}createPath(t,e){let[o,c]=t.direction==="input"&&t.portType==="value"||t.direction==="output"&&t.portType==="flow"?[t,e]:[e,t],m=this.getPortGridPoint(o),v=this.getPortGridPoint(c);this.mPathFinder.updatePath(o,m,v)}createSvgPath(t){let e=(c,m)=>{let v=m.x-c.x,y=m.y-c.y;switch(!0){case(v===0&&y===1):return"bottom";case(v===0&&y===-1):return"top";case(v===-1&&y===0):return"left";case(v===1&&y===0):return"right";default:throw new A("Missformed path. Path points are not directly next to each other.",this)}},o="";for(let c=1;c<t.length-1;c++){let m=t[c],v=t[c-1],y=t[c+1],T=e(m,v),S=e(m,y);o+=this.createGridCellPath(m,T,S)}return o}getGridPosition(t,e){let o={x:t.x*this.mManager.grid.gridSize+this.mManager.grid.gridSize/2,y:t.y*this.mManager.grid.gridSize+this.mManager.grid.gridSize/2},c=this.mManager.grid.gridSize/2;switch(e){case"top":o.y-=c;break;case"right":o.x+=c;break;case"bottom":o.y+=c;break;case"left":o.x-=c;break}return o}updatePaths(){this.mPathFinder.clear("path");let t=this.mManager.activeFunction;if(t)for(let e of t.nodes){for(let o of e.outputs.flow){let c=o.connectedPorts.values().next().value;c&&this.createPath(o,c)}for(let o of e.inputs.value){let c=o.connectedPorts.values().next().value;c&&this.createPath(o,c)}}}};var $e=class{mDocument;mManager;get document(){return this.mDocument}constructor(t){this.mManager=t,this.mDocument=null}addFunction(t){let e=this.mDocument;if(!e||!e.project.userFunctions.has(t))return;let o=new bt(e.project,e,{definitionId:t,id:crypto.randomUUID(),isSystem:!1,label:`Function_${e.functions.length}`});e.addFunction(o),e.validate(),this.mManager.dispatch(_.FunctionAdd,o),this.mManager.setActiveFunction(o)}addNode(t,e,o){let c=t.addNodeByDefinition(e,o);return this.mManager.dispatch(_.NodeAdd,c),c}connectPorts(t,e){try{t.connect(e)}catch{return!1}return this.mManager.dispatch(_.ConnectionAdd,t),this.mManager.dispatch(_.ConnectionAdd,e),!0}disconnectPorts(t,e){t.disconnect(e),this.mManager.dispatch(_.ConnectionDelete,t),this.mManager.dispatch(_.ConnectionDelete,e)}removeFunction(t){let e=this.mDocument;if(!e)return;let o=null;for(let c of e.functions)if(c.id===t){o=c,e.removeFunction(c);break}o&&(this.mManager.dispatch(_.FunctionDelete,o),this.setDefaultActiveFunction())}removeNode(t){t.function.removeNode(t),this.mManager.dispatch(_.NodeDelete,t)}setDocument(t){this.mDocument=t,this.mDocument.validate(),this.mManager.dispatch(_.Document,this.mDocument),this.setDefaultActiveFunction()}setPortDirectValue(t,e){t.setDirectValue(e),this.mManager.dispatch(_.NodeUpdate,t.node)}transformNode(t,e){let o={x:t.transformation.x,y:t.transformation.y,width:t.transformation.width,height:t.transformation.height,...e};t.moveTo(o.x,o.y),t.resizeTo(o.width,o.height),this.mManager.dispatch(_.NodeTransform,t)}updateNode(t,e){t&&(e(t),this.mManager.dispatch(_.NodeUpdate,t))}setDefaultActiveFunction(){if(!this.mDocument||this.mDocument.functions.length===0)return;let t=(()=>{let e=[...this.mDocument.functions];if(!this.mManager.activeFunction)return e[0];let o=e.find(c=>c.id===this.mManager.activeFunction.id);return o||e[0]})();this.mManager.activeFunction!==t&&this.mManager.setActiveFunction(t)}};var Ge=class f{static GRID_SIZE=25;static MAX_ZOOM=2;static MIN_ZOOM=.25;mPanX;mPanY;mZoom;get gridSize(){return f.GRID_SIZE}get panX(){return this.mPanX}get panY(){return this.mPanY}get zoom(){return this.mZoom}constructor(){this.mPanX=0,this.mPanY=0,this.mZoom=1}getGridBackgroundCss(){let t=f.GRID_SIZE*this.mZoom,e=this.mPanX%t,o=this.mPanY%t;return[`background-size: ${t}px ${t}px`,`background-position: ${e}px ${o}px`,'background-image: url("data:image/svg+xml,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 viewBox%3D%220 0 100 100%22%3E%3Cpath d%3D%22M0 0h18M0 0v18M100 0H82M100 0v18M0 100h18M0 100V82M100 100H82M100 100V82%22 stroke%3D%22%23313244%22 stroke-width%3D%225%22 stroke-linecap%3D%22round%22%2F%3E%3C%2Fsvg%3E")'].join("; ")}getTransformCss(){return`translate(${this.mPanX}px, ${this.mPanY}px) scale(${this.mZoom})`}pan(t,e){this.mPanX+=t,this.mPanY+=e}screenToWorld(t,e){return{x:(t-this.mPanX)/this.mZoom,y:(e-this.mPanY)/this.mZoom}}snapToGrid(t,e){return{x:Math.round(t/f.GRID_SIZE)*f.GRID_SIZE,y:Math.round(e/f.GRID_SIZE)*f.GRID_SIZE}}zoomAt(t,e,o){let c=this.mZoom,m=1+o,v=this.mZoom*m;v=Math.max(f.MIN_ZOOM,Math.min(f.MAX_ZOOM,v));let y=(t-this.mPanX)/c,T=(e-this.mPanY)/c;this.mZoom=v,this.mPanX=t-y*this.mZoom,this.mPanY=e-T*this.mZoom}};var Be=class f{static MAX_HISTORY_ITEMS=100;mManager;mSnapshotIndex;mSnapshots;get canRedo(){return this.mSnapshotIndex<this.mSnapshots.length-1}get canUndo(){return this.mSnapshotIndex>0}constructor(t){this.mManager=t,this.mSnapshotIndex=-1,this.mSnapshots=new Array;let e=0;this.mManager.subscribe(_.Any,()=>{globalThis.clearTimeout(e),e=globalThis.setTimeout(()=>{this.pushHistory()},1e3)})}clear(){this.mSnapshots.length=0,this.mSnapshotIndex=-1}redo(){if(!this.canRedo)return;let t=this.mSnapshots[++this.mSnapshotIndex],e=JSON.parse(t);this.restoreHistory(e)}undo(){if(!this.canUndo)return;let t=this.mSnapshots[--this.mSnapshotIndex],e=JSON.parse(t);this.restoreHistory(e)}pushHistory(){let t=this.mManager.graph.document;if(!t)return;this.mSnapshots.splice(this.mSnapshotIndex+1);let e=new Kt().serialize(t),o=JSON.stringify(e);this.mSnapshots.length>0&&this.mSnapshots.at(-1)===o||(this.mSnapshotIndex=this.mSnapshots.push(o)-1,this.mSnapshots.length>f.MAX_HISTORY_ITEMS&&(this.mSnapshots.shift(),this.mSnapshotIndex--))}restoreHistory(t){let e=this.mManager.project;e&&this.mManager.graph.setDocument(new Jt(e).deserialize(t))}};var Ue=class{mErrorItems;mErrorList;mIsDirty;mManager;get errorItems(){return this.mIsDirty&&this.revalidate(),this.mErrorItems}get errors(){return this.mIsDirty&&this.revalidate(),this.mErrorList}get isValid(){return this.mIsDirty&&this.revalidate(),this.mErrorItems.size===0}constructor(t){this.mManager=t,this.mErrorList=new Array,this.mErrorItems=new Set,this.mIsDirty=!0;let e=0;this.mManager.subscribe(_.Any,()=>{this.mIsDirty=!0,globalThis.clearTimeout(e),e=globalThis.setTimeout(()=>{this.mIsDirty&&(this.revalidate(),this.mIsDirty=!1)},1e3)})}revalidate(){if(!this.mManager.graph.document)return;this.mErrorList.splice(0,this.mErrorList.length),this.mErrorItems.clear();let t=this.mManager.graph.document.validate();for(let e of t.errors)switch(this.mErrorItems.add(e.item),!0){case e.item instanceof ht:{this.mErrorList.push({location:`Node "${e.item.node.label}"`,message:e.message});break}case e.item instanceof Dt:{this.mErrorList.push({location:`Node "${e.item.label}"`,message:e.message});break}}for(let e of t.affectedItems)switch(!0){case e instanceof ht:{this.mManager.dispatch(_.PortAdd|_.PortUpdate,e),this.mManager.dispatch(_.NodeUpdate,e.node);break}case e instanceof Dt:{this.mManager.dispatch(_.NodeAdd|_.NodeUpdate|_.NodeTransform,e);break}case e instanceof bt:{this.mManager.dispatch(_.FunctionAdd|_.FunctionUpdate,e);break}}}};var He=class{mDriverActivity;mDriverElements;mDriverList;mDrivers;mElementDriver;mManager;mPreviewIntersection;constructor(t){this.mManager=t,this.mDriverList=new Array,this.mDrivers=new WeakMap,this.mDriverActivity=new WeakMap,this.mDriverElements=new WeakMap,this.mElementDriver=new WeakMap,this.mManager.subscribe(_.Document,()=>{this.mDriverList.splice(0,this.mDriverList.length)});let e=0,o=_.Connection|_.Function|_.Node;this.mManager.subscribe(o,()=>{globalThis.clearTimeout(e),e=globalThis.setTimeout(()=>this.refresh(),1e3)}),this.mPreviewIntersection=new IntersectionObserver(c=>{for(let m of c){let v=this.mElementDriver.get(m.target);if(!v)continue;let y=v.deref();y&&this.mDriverActivity.set(y,m.isIntersecting)}})}async execute(){let t=this.mDriverList.map(async e=>{let o=e.deref();if(o&&this.mDriverActivity.get(o))try{await o.execute()}catch(c){console.error("[PotatnoUiManagerPreview] Driver render failed:",c)}});await Promise.all(t)}refresh(){if(this.mManager.integrity.isValid)for(let t=this.mDriverList.length-1;t>=0;t--){let e=this.mDriverList[t].deref();if(!e){this.unregister(this.mDriverList[t]);continue}e.refresh()}}requestDriver(t,e){let o=this.mDrivers.get(t);if(o&&o.display.id===e)return o;let c=t.project.preview.getDisplay(e);if(!c)throw new A(`Preview has no display for "${e}".`,this);let m=c.createDriver(t);return this.register(t,m),this.mManager.integrity.isValid&&m.refresh(),m}register(t,e){this.mDrivers.set(t,e);let o=new WeakRef(e);this.mDriverList.push(o);let c=e.element;this.mDriverElements.set(o,c),this.mElementDriver.set(c,o),this.mPreviewIntersection.observe(c)}unregister(t){let e=this.mDriverList.indexOf(t);if(e===-1)return;this.mDriverList.splice(e,1);let o=this.mDriverElements.get(t);o&&this.mPreviewIntersection.unobserve(o)}};function ss(){function f(l,n){return function(a){e(n,"addInitializer"),o(a,"An initializer"),l.push(a)}}function t(l,n,u,a,r,b,g,D,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:g?"#"+n:n,static:b,private:g,metadata:D},d={v:!1};s.addInitializer=f(a,d);var i,h;r===0?g?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return l(w,s)}finally{d.v=!0}}function e(l,n){if(l.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(l,n){if(typeof l!="function")throw new TypeError(n+" must be a function")}function c(l,n){var u=typeof n;if(l===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var a;throw l===0?a="field":l===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function m(l,n,u,a,r,b,g,D,w){var p=u[0],s,d,i;g?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,C;if(typeof p=="function")h=t(p,a,s,D,r,b,g,w,i),h!==void 0&&(c(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h);else for(var P=p.length-1;P>=0;P--){var M=p[P];if(h=t(M,a,s,D,r,b,g,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(I,E){return E};else if(typeof d!="function"){var F=d;d=function(I,E){for(var L=E,R=0;R<F.length;R++)L=F[R].call(I,L);return L}}else{var z=d;d=function(I,E){return z.call(I,E)}}l.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),g?r===1?(l.push(function(I,E){return i.get.call(I,E)}),l.push(function(I,E){return i.set.call(I,E)})):r===2?l.push(i):l.push(function(I,E){return i.call(I,E)}):Object.defineProperty(n,a,s))}function v(l,n,u){for(var a=[],r,b,g=new Map,D=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,C;if(h?(x=l,s=s-5,b=b||[],C=b):(x=l.prototype,r=r||[],C=r),s!==0&&!i){var P=h?D:g,M=P.get(d)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!M&&s>2?P.set(d,s):P.set(d,!0)}m(a,x,p,d,s,h,i,C,u)}}return y(a,r),y(a,b),a}function y(l,n){n&&l.push(function(u){for(var a=0;a<n.length;a++)n[a].call(u);return u})}function T(l,n,u){if(n.length>0){for(var a=[],r=l,b=l.name,g=n.length-1;g>=0;g--){var D={v:!1};try{var w=n[g](r,{kind:"class",name:b,addInitializer:f(a,D),metadata:u})}finally{D.v=!0}w!==void 0&&(c(10,w),r=w)}return[S(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function S(l,n){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,a,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(b===void 0?null:b),D=v(n,u,g);return a.length||S(n,g),{e:D,get c(){return T(n,a,g)}}}}function fo(f,t,e,o){return(fo=ss())(f,t,e,o)}var po,uo,ho,K;po=O.injectable("singleton");var mo=class extends(ho=EventTarget){static{({c:[K,uo]}=fo(this,[],[po],ho))}constructor(){super(),this.mClipboard=new je(this),this.mIntegrity=new Ue(this),this.mConnections=new Ve(this),this.mGraph=new $e(this),this.mHistory=new Be(this),this.mPreview=new He(this),this.mGrid=new Ge,this.mProject=null,this.mActiveFunction=null,this.mEventBuffer=new Map,this.mEventBufferDispatchRequest=-1}mActiveFunction;mClipboard;mConnections;mEventBuffer;mEventBufferDispatchRequest;mGraph;mGrid;mHistory;mIntegrity;mPreview;mProject;get activeFunction(){return this.mActiveFunction}get clipboard(){return this.mClipboard}get connections(){return this.mConnections}get graph(){return this.mGraph}get grid(){return this.mGrid}get history(){return this.mHistory}get integrity(){return this.mIntegrity}get preview(){return this.mPreview}get project(){return this.mProject}dispatch(t,e){let o=this.mEventBuffer.get(e)??0;this.mEventBuffer.set(e,o|t),this.mEventBufferDispatchRequest!==-1&&globalThis.cancelAnimationFrame(this.mEventBufferDispatchRequest),this.mEventBufferDispatchRequest=requestAnimationFrame(()=>{this.mEventBufferDispatchRequest=-1;for(let[c,m]of this.mEventBuffer)this.dispatchEvent(new xe(m,c));this.mEventBuffer.clear()})}generateStringColor(t){let e=(()=>{let c=0;for(let m=0;m<t.length;m++)c=t.charCodeAt(m)+((c<<5)-c);return c})();return`hsl(${Math.abs(e)*137.508%360}, 70%, 60%)`}initialize(t,e){this.mProject=t,this.mGraph.setDocument(e)}setActiveFunction(t){!this.mGraph.document||!this.mGraph.document.functions.find(o=>o===o)||(this.mActiveFunction=t,this.dispatch(_.SpecialActiveFunction,t))}subscribe(t,e){let o=c=>{t!==_.Any&&(c.changeType&t)===0||e(c)};return this.addEventListener(xe.EVENT_TYPE,o),()=>{this.removeEventListener(xe.EVENT_TYPE,o)}}updateFunctionProperties(t){let e=this.activeFunction;if(!e)return;let c=e.project.getFunction(e.definitionId)?.statics??ot.imports|ot.inputs|ot.outputs;if(t.name!==void 0&&(e.label=t.name),t.inputs!==void 0&&(c&ot.inputs)===0){for(let m of[...e.inputs])e.removeInput(m);for(let m of t.inputs)e.addInput({dataType:m.type,label:m.name})}if(t.outputs!==void 0&&(c&ot.outputs)===0){for(let m of[...e.outputs])e.removeOutput(m);for(let m of t.outputs)e.addOutput({dataType:m.type,label:m.name})}if(t.imports!==void 0&&(c&ot.imports)===0){let m=new Set(e.imports),v=new Set(t.imports);for(let y of[...e.imports])v.has(y)||e.removeImport(y);for(let y of t.imports)m.has(y)||e.addImport(y)}this.dispatch(_.FunctionUpdate,e)}static{uo()}},_={Any:16777215,Connection:15,ConnectionAdd:1,ConnectionUpdate:2,ConnectionDelete:4,Document:240,Function:3840,FunctionAdd:256,FunctionUpdate:512,FunctionDelete:1024,Node:61440,NodeAdd:4096,NodeUpdate:8192,NodeDelete:16384,NodeTransform:32768,Port:983040,PortAdd:65536,PortUpdate:131072,PortDelete:262144,Special:15728640,SpecialActiveFunction:1048576},xe=class f extends Event{static EVENT_TYPE="PotatnoUiManagerChangeEvent";mChangeType;mEventItem;get changeType(){return this.mChangeType}get item(){return this.mEventItem}constructor(t,e){super(f.EVENT_TYPE),this.mChangeType=t,this.mEventItem=e}};var go=`:host {\r
    display: flex;\r
    width: 100%;\r
    height: 100%;\r
    font-family: var(--potatno-font-family);\r
    color: var(--potatno-color-text);\r
    background: var(--potatno-color-background);\r
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
    background: var(--potatno-color-background-dark);\r
    border-right: 1px solid var(--potatno-color-border);\r
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
    background: var(--potatno-color-accent);\r
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
\r
    /* Preview should never overflow the graph window. Set gap to 12px on all sides. */\r
    max-width: calc(100% - 24px);\r
    max-height: calc(100% - 24px);\r
}\r
\r
potatno-node-graph {\r
    flex: 1;\r
    min-height: 0;\r
    min-width: 0;\r
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
    background: var(--potatno-color-accent);\r
}\r
\r
.panel-right {\r
    width: var(--pn-panel-width);\r
    min-width: var(--pn-panel-min-width);\r
    max-width: var(--pn-panel-max-width);\r
    background: var(--potatno-color-background-dark);\r
    border-left: 1px solid var(--potatno-color-border);\r
    display: flex;\r
    flex-direction: column;\r
    overflow: hidden;\r
    flex-shrink: 0;\r
}`;var vo=`<div class="editor-layout">
    <potatno-function-list></potatno-function-list>
    
    <div class="center-area">
        <potatno-node-graph></potatno-node-graph>
        $if(this.hasPreview) {
            <potatno-preview class="preview-wrapper"></potatno-preview>
        }
    </div>
    <div #resizeRight class="resize-handle-right"
        (pointerdown)="this.onResizeRightStart($event)">
    </div>
    <div #panelRight class="panel-right">
        <potatno-panel-properties></potatno-panel-properties>
    </div>
</div>
`;var yo=`:host {\r
    display: flex;\r
    flex-direction: column;\r
    height: 100%;\r
    overflow: hidden;\r
}\r
\r
.resize-box {\r
    height: 100%;\r
    background-color: var(--potatno-color-background);\r
\r
    /* Globaly restrict to max size of parent. */\r
    max-width: 500px;\r
    min-width: 200px;\r
\r
    /* Hopefully that cascade into all childs. */\r
    font-family: var(--potatno-font-family);\r
    font-size: var(--potatno-font-size);\r
}\r
\r
.function-list {\r
    flex: 1;\r
    overflow: hidden auto;\r
\r
    scrollbar-color: var(--potatno-color-scrollbar-thumb) var(--potatno-color-scrollbar-track);\r
    scrollbar-width: thin;\r
}\r
\r
.function-item {\r
    display: flex;\r
    box-sizing: border-box;\r
    width: 100%;\r
    min-height: 34px;\r
    padding: 5px 12px 5px 9px;\r
    align-items: center;\r
    text-align: left;\r
    color: var(--potatno-color-text);\r
    cursor: pointer;\r
\r
    &.active {\r
        background: var(--potatno-color-background-light);\r
    }\r
\r
    .function-item__icon {\r
        display: flex;\r
        align-items: center;\r
        width: 1ch;\r
        height: 25px;\r
        padding: 0 10px;\r
\r
        text-align: center;\r
        font-weight: bold;\r
\r
        /* Border defined to mark selected. */\r
        border-left: 3px solid var(--potatno-color-accent);\r
        border-color: color-mix(in srgb, var(--potatno-color-text) 25%, var(--potatno-color-background));\r
        transition: border-color 0.1s;\r
\r
        /* Both colors are hardcoded and dont represent any theme */\r
        &[data-type=u] {\r
            color: #008000;\r
        }\r
\r
        &[data-type=s] {\r
            color: #ffd700;\r
        }\r
\r
        /* Add type as text. */\r
        &::before {\r
            content: attr(data-type);\r
            text-transform: uppercase;\r
        }\r
\r
        .function-item:hover & {\r
            border-color: var(--potatno-color-text);\r
        }\r
\r
        .function-item.active & {\r
            border-color: var(--potatno-color-accent);\r
        }\r
    }\r
\r
    .function-item__name {\r
        flex: 1;\r
        overflow: hidden;\r
        text-overflow: ellipsis;\r
        white-space: nowrap;\r
    }\r
\r
    .function-item__delete {\r
        display: flex;\r
        width: 18px;\r
        height: 18px;\r
        align-items: center;\r
        justify-content: center;\r
        border-radius: 2px;\r
        font-size: 11px;\r
        cursor: pointer;\r
\r
        /* Cool hover transitions... It literally sucks. */\r
        color: var(--potatno-color-text);\r
        transition: background-color 0.1s, color 0.1s;\r
\r
        &:hover {\r
            background-color: color-mix(in srgb, var(--potatno-color-error) 75%, var(--potatno-color-background));\r
        }\r
    }\r
}\r
\r
.list-actions {\r
    position: relative;\r
    padding: 8px;\r
    border-top: 1px solid var(--potatno-color-border);\r
}\r
\r
.add-action {\r
    display: flex;\r
    box-sizing: border-box;\r
    align-items: center;\r
    justify-content: center;\r
    gap: 6px;\r
    padding: 8px 12px;\r
    border: 1px dashed var(--potatno-color-border);\r
    border-radius: 2px;\r
    color: var(--potatno-color-text);\r
    background-color: var(--potatno-color-background-light);\r
    cursor: pointer;\r
\r
    transition: border-color 0.15s, color 0.15s;\r
\r
    &:hover {\r
        border-color: var(--potatno-color-accent);\r
        color: var(--potatno-color-accent);\r
    }\r
}\r
\r
.popup {\r
    position: absolute;\r
    bottom: calc(100% + 8px);\r
    left: 8px;\r
    right: 8px;\r
    background-color: var(--potatno-color-background-light);\r
    border: 1px solid var(--potatno-color-border);\r
    border-radius: 2px;\r
    box-shadow: 0 4px 12px var(--potatno-color-shadow);\r
\r
    overflow: hidden;\r
\r
    /* Fullview overlay. */\r
    .popup__overlay {\r
        position: fixed;\r
        top: 0;\r
        left: 0;\r
        right: 0;\r
        bottom: 0;\r
        z-index: 99;\r
    }\r
\r
    .popup__header {\r
        padding: 6px 12px;\r
        color: var(--potatno-color-text);\r
        border-bottom: 3px solid var(--potatno-color-border);\r
        user-select: none;\r
    }\r
\r
    .popup__item {\r
        display: flex;\r
        align-items: center;\r
        padding: 5px 12px 5px 9px;\r
        color: var(--potatno-color-text);\r
        cursor: pointer;\r
        transition: color 0.1s;\r
\r
        /* Only set it to relative so the z-index has an effect */\r
        position: relative;\r
        z-index: 100;\r
\r
        &:hover {\r
            color: var(--potatno-color-accent);\r
        }\r
\r
        .icon {\r
            box-sizing: border-box;\r
            height: 24px;\r
\r
            /* Manually centering shitty function "icon" by offsetting 2px */\r
            padding: 2px 10px 0 10px;\r
\r
            /* Border defined to mark selected. */\r
            border-left: 3px solid color-mix(in srgb, var(--potatno-color-text) 25%, var(--potatno-color-background));\r
            transition: border-color 0.1s;\r
\r
            .popup__item:hover & {\r
                border-color: var(--potatno-color-accent);\r
            }\r
        }\r
    }\r
}`;var bo=`<potatno-resize-box class="resize-box" right="true">\r
    <div class="function-list">\r
        $for(functionItem of this.documentFunctions) {\r
            <div class="function-item {{ this.functionItem.id === this.activeFunctionId ? 'active' : '' }}" (click)="this.selectFunction(this.functionItem)">\r
                <div class="function-item__icon" data-type="{{ this.functionItem.isSystem ? 's' : 'u' }}" title="{{ this.functionItem.isSystem ? 'System' : 'User' }}"/>\r
                <div class="function-item__name">{{this.functionItem.label}}</div>\r
\r
                $if(!this.functionItem.isSystem) {\r
                    <div class="function-item__delete" (click)="this.deleteFunction(this.functionItem)">\u2715</div>\r
                }\r
            </div>\r
        }\r
    </div>\r
\r
    $if(this.userFunctionDefinitions.length > 0) {\r
        <div class="list-actions">\r
            $if(this.showPopup) {\r
                <div class="popup">\r
                    <div class="popup__header">Select Function Type</div>\r
                    $for(functionDefinition of this.userFunctionDefinitions) {\r
                        <div class="popup__item" (click)="this.createFunction(this.functionDefinition)">\r
                            <div class="icon">\u0192</div>\r
                            <div>{{this.functionDefinition.label}}</div>\r
                        </div>\r
                    }\r
\r
                    <div class="popup__overlay" (click)="this.showPopup = !this.showPopup"></div>\r
                </div>\r
            }\r
            \r
            <div class="add-action" (click)="this.showPopup = !this.showPopup">\r
                <div>+</div>\r
                <div>Add Function</div>\r
            </div>\r
        </div>\r
    }\r
</potatno-resize-box>\r
`;function hs(){function f(l,n){return function(a){e(n,"addInitializer"),o(a,"An initializer"),l.push(a)}}function t(l,n,u,a,r,b,g,D,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:g?"#"+n:n,static:b,private:g,metadata:D},d={v:!1};s.addInitializer=f(a,d);var i,h;r===0?g?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return l(w,s)}finally{d.v=!0}}function e(l,n){if(l.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(l,n){if(typeof l!="function")throw new TypeError(n+" must be a function")}function c(l,n){var u=typeof n;if(l===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var a;throw l===0?a="field":l===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function m(l,n,u,a,r,b,g,D,w){var p=u[0],s,d,i;g?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,C;if(typeof p=="function")h=t(p,a,s,D,r,b,g,w,i),h!==void 0&&(c(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h);else for(var P=p.length-1;P>=0;P--){var M=p[P];if(h=t(M,a,s,D,r,b,g,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(I,E){return E};else if(typeof d!="function"){var F=d;d=function(I,E){for(var L=E,R=0;R<F.length;R++)L=F[R].call(I,L);return L}}else{var z=d;d=function(I,E){return z.call(I,E)}}l.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),g?r===1?(l.push(function(I,E){return i.get.call(I,E)}),l.push(function(I,E){return i.set.call(I,E)})):r===2?l.push(i):l.push(function(I,E){return i.call(I,E)}):Object.defineProperty(n,a,s))}function v(l,n,u){for(var a=[],r,b,g=new Map,D=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,C;if(h?(x=l,s=s-5,b=b||[],C=b):(x=l.prototype,r=r||[],C=r),s!==0&&!i){var P=h?D:g,M=P.get(d)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!M&&s>2?P.set(d,s):P.set(d,!0)}m(a,x,p,d,s,h,i,C,u)}}return y(a,r),y(a,b),a}function y(l,n){n&&l.push(function(u){for(var a=0;a<n.length;a++)n[a].call(u);return u})}function T(l,n,u){if(n.length>0){for(var a=[],r=l,b=l.name,g=n.length-1;g>=0;g--){var D={v:!1};try{var w=n[g](r,{kind:"class",name:b,addInitializer:f(a,D),metadata:u})}finally{D.v=!0}w!==void 0&&(c(10,w),r=w)}return[S(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function S(l,n){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,a,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(b===void 0?null:b),D=v(n,u,g);return a.length||S(n,g),{e:D,get c(){return T(n,a,g)}}}}function Io(f,t,e,o){return(Io=hs())(f,t,e,o)}var So,wo,Co,Po,xo,To,Do,ds;So=W({selector:"potatno-function-list",template:bo,style:yo}),Co=B.state({complexValue:!0}),Po=B.state();var Eo=class{static{({e:[xo,To,Do],c:[ds,wo]}=Io(this,[[Co,1,"documentFunctions"],[Po,1,"showPopup"]],[So]))}constructor(t=O.use(K)){this.mManager=t,this.documentFunctions=new Array,this.showPopup=!1,this.mUnsubscribe=this.mManager.subscribe(_.Document|_.Function|_.SpecialActiveFunction,()=>{this.documentFunctions=this.mManager.graph.document?.functions.map(e=>({id:e.id,label:e.label,isSystem:e.isSystem,function:e}))??new Array})}mManager;mUnsubscribe;#t=(Do(this),xo(this));get documentFunctions(){return this.#t}set documentFunctions(t){this.#t=t}#e=To(this);get showPopup(){return this.#e}set showPopup(t){this.#e=t}get activeFunctionId(){return this.mManager.activeFunction?.id??""}get userFunctionDefinitions(){return this.mManager.project?[...this.mManager.project.userFunctions.values()]:new Array}createFunction(t){this.showPopup=!1,this.mManager.graph.addFunction(t.id)}deleteFunction(t){this.mManager.graph.removeFunction(t.id)}onDeconstruct(){this.mUnsubscribe()}selectFunction(t){this.mManager.setActiveFunction(t.function)}static{wo()}};var Mo=`:host {
    position: absolute;
    z-index: 200;
}

.selection-popup {
    display: flex;
    flex-direction: column;
    max-height: 320px;
    width: 280px;

    border: 1px solid var(--potatno-color-border);
    border-radius: 6px;

    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.28);
    background-color: var(--potatno-color-background-dark);
    overflow: hidden;

    /* Font should cascade into child ... except inputs :( */
    font-family: var(--potatno-font-family);
    font-size: var(--potatno-font-size);

    .selection-popup__search {
        width: 100%;
        box-sizing: border-box;
        padding: 8px 10px;
        outline: none;

        border: none;
        border-bottom: 1px solid var(--potatno-color-border);

        color: var(--potatno-color-accent);
        background-color: var(--potatno-color-background-light);

        font-family: var(--potatno-font-family);
        font-size: var(--potatno-font-size);

        &:focus {
            border-bottom-color: var(--potatno-color-accent);
        }
    }

    .selection-popup__results {
        max-height: 280px;
        overflow-x: hidden;
        overflow-y: auto;
        padding: 4px 0;
    }

    .selection-popup__result {
        --item-color: var(--potatno-color-text);

        display: flex;
        box-sizing: border-box;
        width: 100%;
        padding: 5px 9px;
        gap: 8px;
        align-items: center;
        color: var(--potatno-color-accent);
        text-align: left;
        cursor: pointer;

        &:hover,
        &.selected {
            background-color: var(--potatno-color-background-light);
        }

        .selection-popup__result-icon {
            flex-shrink: 0;
            padding: 0 0 0 10px;
            width: 16px;
            
            border-left: 3px solid var(--item-color);
        }

        .selection-popup__result-label {
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .selection-popup__result-category {
            flex-shrink: 0;
            font-size: var(--potatno-font-size-small);
            text-transform: capitalize;

            /* Darken text color by mixing in the background colorl */
            color: color-mix(in srgb, var(--potatno-color-text) 50%, var(--potatno-color-background-dark));
        }
    }

    .selection-popup__empty {
        padding: 14px 10px;
        text-align: center;
        font-size: var(--potatno-font-size-small);

        /* Darken text color by mixing in the background colorl */
        color: color-mix(in srgb, var(--potatno-color-text) 50%, var(--potatno-color-background-dark));
    }
}`;var No=`<div class="selection-popup" (pointerdown)="this.stopPropagation($event)" (wheel)="this.stopPropagation($event)" (contextmenu)="this.stopPropagation($event)">
    <input #searchInput type="text" placeholder="Search nodes..." class="selection-popup__search" [(value)]="this.searchValue" (keydown)="this.onKeyDown($event)" />
    <div class="selection-popup__results">
        $for(entry of this.results) {
            <div class="selection-popup__result {{this.entry.definition.id === this.selectedDefinitionId ? 'selected' : ''}}" (click)="this.sendSelectedEntry(this.entry.definition.id)" style="--item-color: {{this.entry.color}}">
                <span class="selection-popup__result-icon">{{this.entry.icon}}</span>
                <span class="selection-popup__result-label">{{this.entry.label}}</span>
                <span class="selection-popup__result-category">{{this.entry.category}}</span>
            </div>
        }
        $if(this.results.length === 0) {
            <div class="selection-popup__empty">No matching nodes found.</div>
        }
    </div>
</div>
`;function ps(){function f(l,n){return function(a){e(n,"addInitializer"),o(a,"An initializer"),l.push(a)}}function t(l,n,u,a,r,b,g,D,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:g?"#"+n:n,static:b,private:g,metadata:D},d={v:!1};s.addInitializer=f(a,d);var i,h;r===0?g?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return l(w,s)}finally{d.v=!0}}function e(l,n){if(l.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(l,n){if(typeof l!="function")throw new TypeError(n+" must be a function")}function c(l,n){var u=typeof n;if(l===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var a;throw l===0?a="field":l===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function m(l,n,u,a,r,b,g,D,w){var p=u[0],s,d,i;g?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,C;if(typeof p=="function")h=t(p,a,s,D,r,b,g,w,i),h!==void 0&&(c(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h);else for(var P=p.length-1;P>=0;P--){var M=p[P];if(h=t(M,a,s,D,r,b,g,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(I,E){return E};else if(typeof d!="function"){var F=d;d=function(I,E){for(var L=E,R=0;R<F.length;R++)L=F[R].call(I,L);return L}}else{var z=d;d=function(I,E){return z.call(I,E)}}l.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),g?r===1?(l.push(function(I,E){return i.get.call(I,E)}),l.push(function(I,E){return i.set.call(I,E)})):r===2?l.push(i):l.push(function(I,E){return i.call(I,E)}):Object.defineProperty(n,a,s))}function v(l,n,u){for(var a=[],r,b,g=new Map,D=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,C;if(h?(x=l,s=s-5,b=b||[],C=b):(x=l.prototype,r=r||[],C=r),s!==0&&!i){var P=h?D:g,M=P.get(d)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!M&&s>2?P.set(d,s):P.set(d,!0)}m(a,x,p,d,s,h,i,C,u)}}return y(a,r),y(a,b),a}function y(l,n){n&&l.push(function(u){for(var a=0;a<n.length;a++)n[a].call(u);return u})}function T(l,n,u){if(n.length>0){for(var a=[],r=l,b=l.name,g=n.length-1;g>=0;g--){var D={v:!1};try{var w=n[g](r,{kind:"class",name:b,addInitializer:f(a,D),metadata:u})}finally{D.v=!0}w!==void 0&&(c(10,w),r=w)}return[S(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function S(l,n){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,a,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(b===void 0?null:b),D=v(n,u,g);return a.length||S(n,g),{e:D,get c(){return T(n,a,g)}}}}function Vo(f,t,e,o){return(Vo=ps())(f,t,e,o)}var $o,Ao,Go,Bo,Uo,Ho,Xo,Lo,Ro,Oo,_o,Fo,jo,ur;$o=W({selector:"potatno-node-selection-popup",template:No,style:Mo}),Go=B.state({complexValue:!0}),Bo=ft("searchInput"),Uo=qt("node-select"),Ho=B.state(),Xo=B.state();var zo=class{static{({e:[Lo,Ro,Oo,_o,Fo,jo],c:[ur,Ao]}=Vo(this,[[Go,1,"results"],[Bo,1,"searchInput"],[Uo,1,"mNodeSelect"],[Ho,1,"searchValue"],[Xo,1,"selectedDefinitionId"]],[$o]))}constructor(t=O.use($),e=O.use(K)){this.mManager=e,this.mComponent=t,this.selectedDefinitionId=null,this.results=new Array,this.searchValue=""}mComponent;mManager;#t=(jo(this),Lo(this));get results(){return this.#t}set results(t){this.#t=t}#e=Ro(this);get searchInput(){return this.#e}set searchInput(t){this.#e=t}#r=Oo(this);get mNodeSelect(){return this.#r}set mNodeSelect(t){this.#r=t}#o=_o(this);get searchValue(){return this.#o}set searchValue(t){this.#o=t}#n=Fo(this);get selectedDefinitionId(){return this.#n}set selectedDefinitionId(t){this.#n=t}onConnect(){this.searchInput.focus()}onKeyDown(t){if(this.results.length!==0){if(t.key==="ArrowDown"||t.key==="ArrowUp"){t.preventDefault();let e=this.results.findIndex(m=>m.definition.id===this.selectedDefinitionId);e=Math.max(0,e);let o=t.key==="ArrowDown"?1:-1,c=(e+o+this.results.length)%this.results.length;this.selectedDefinitionId=this.results[c].definition.id;return}t.key==="Enter"&&this.sendSelectedEntry(this.selectedDefinitionId)}}onUpdate(){this.rebuildResults();let t=this.mComponent.element.shadowRoot.querySelector(".selection-popup__result.selected");t&&t.scrollIntoView()}stopPropagation(t){t.stopPropagation()}rebuildResults(){if(!this.mManager.activeFunction){this.results=new Array;return}let t=this.mManager.activeFunction.dynamicNodeDefinitions.map(o=>({category:o.category.name,definition:o,label:o.label.toLowerCase(),color:this.mManager.generateStringColor(o.category.name),icon:o.category.icon})),e=this.searchValue.trim().toLowerCase();this.results=t.filter(o=>o.label.includes(e)),this.results.some(o=>o.definition.id===this.selectedDefinitionId)||(this.selectedDefinitionId=this.results[0]?.definition.id??null)}sendSelectedEntry(t){if(t===null)return;let e=this.results.find(o=>o.definition.id===t);e&&this.mNodeSelect.dispatchEvent(e.definition)}static{Ao()}};var Yo=`:host {\r
    position: absolute;\r
    top: 0;\r
    left: 0;\r
    height: 1px;\r
    width: 1px;\r
    overflow: visible;\r
    pointer-events: none;\r
}\r
\r
.svg-layer {\r
    position: absolute;\r
    top: 0;\r
    left: 0;\r
\r
    /* For chrome the svg needs at least one pixel to show the drawn inner paths */\r
    height: 1px;\r
    width: 1px;\r
\r
    overflow: visible;\r
    pointer-events: none;\r
\r
    .path {\r
        /* Color set in code. When not set, its a flow port*/\r
        stroke: var(--path-color, var(--potatno-color-text));\r
\r
        fill: none;\r
        stroke-linecap: round;\r
        stroke-linejoin: round;\r
        stroke-width: 2px;\r
        pointer-events: none;\r
        \r
        &.path--invalid {\r
            stroke: var(--potatno-color-error) !important;\r
            stroke-dasharray: 6 3;\r
        }\r
\r
        &.path--mouse-target {\r
            stroke: transparent;\r
            stroke-width: 12px;\r
            pointer-events: stroke;\r
            cursor: pointer;\r
        }\r
    }\r
}\r
`;var Wo=`<svg #svgLayer class="svg-layer" xmlns="http://www.w3.org/2000/svg" (contextmenu)="this.onConnectionDelete($event)"></svg>
`;function ys(){function f(l,n){return function(a){e(n,"addInitializer"),o(a,"An initializer"),l.push(a)}}function t(l,n,u,a,r,b,g,D,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:g?"#"+n:n,static:b,private:g,metadata:D},d={v:!1};s.addInitializer=f(a,d);var i,h;r===0?g?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return l(w,s)}finally{d.v=!0}}function e(l,n){if(l.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(l,n){if(typeof l!="function")throw new TypeError(n+" must be a function")}function c(l,n){var u=typeof n;if(l===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var a;throw l===0?a="field":l===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function m(l,n,u,a,r,b,g,D,w){var p=u[0],s,d,i;g?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,C;if(typeof p=="function")h=t(p,a,s,D,r,b,g,w,i),h!==void 0&&(c(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h);else for(var P=p.length-1;P>=0;P--){var M=p[P];if(h=t(M,a,s,D,r,b,g,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(I,E){return E};else if(typeof d!="function"){var F=d;d=function(I,E){for(var L=E,R=0;R<F.length;R++)L=F[R].call(I,L);return L}}else{var z=d;d=function(I,E){return z.call(I,E)}}l.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),g?r===1?(l.push(function(I,E){return i.get.call(I,E)}),l.push(function(I,E){return i.set.call(I,E)})):r===2?l.push(i):l.push(function(I,E){return i.call(I,E)}):Object.defineProperty(n,a,s))}function v(l,n,u){for(var a=[],r,b,g=new Map,D=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,C;if(h?(x=l,s=s-5,b=b||[],C=b):(x=l.prototype,r=r||[],C=r),s!==0&&!i){var P=h?D:g,M=P.get(d)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!M&&s>2?P.set(d,s):P.set(d,!0)}m(a,x,p,d,s,h,i,C,u)}}return y(a,r),y(a,b),a}function y(l,n){n&&l.push(function(u){for(var a=0;a<n.length;a++)n[a].call(u);return u})}function T(l,n,u){if(n.length>0){for(var a=[],r=l,b=l.name,g=n.length-1;g>=0;g--){var D={v:!1};try{var w=n[g](r,{kind:"class",name:b,addInitializer:f(a,D),metadata:u})}finally{D.v=!0}w!==void 0&&(c(10,w),r=w)}return[S(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function S(l,n){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,a,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(b===void 0?null:b),D=v(n,u,g);return a.length||S(n,g),{e:D,get c(){return T(n,a,g)}}}}function Qo(f,t,e,o){return(Qo=ys())(f,t,e,o)}var ko,Zo,tn,qo,Jo,hr;ko=W({selector:"potatno-connection-layer",template:Wo,style:Yo}),tn=ft("svgLayer");var Ko=class{static{({e:[qo,Jo],c:[hr,Zo]}=Qo(this,[[tn,1,"svgLayer"]],[ko]))}constructor(t=O.use(K)){this.mConnectionRegistry=new Map,this.mManager=t;let e=0;this.mUnsubscribe=this.mManager.subscribe(_.SpecialActiveFunction|_.Node|_.Connection,()=>{e===0&&(e=requestAnimationFrame(()=>{e=0,this.renderConnections()}))})}mConnectionRegistry;mManager;mUnsubscribe;#t=(Jo(this),qo(this));get svgLayer(){return this.#t}set svgLayer(t){this.#t=t}onConnectionDelete(t){if(!(t.target instanceof Element))return;let e=parseInt(t.target.getAttribute("data-connection-id")??"");if(isNaN(e))return;t.preventDefault(),t.stopPropagation();let o=this.mConnectionRegistry.get(e);o&&this.mManager.graph.disconnectPorts(o.sourcePort,o.targetPort)}onDeconstruct(){this.mUnsubscribe()}renderConnectionPath(t,e,o,c,m){let v="http://www.w3.org/2000/svg",y=this.mManager.connections.getConnectionPath(o,c),T=document.createElementNS(v,"path");T.classList.add("path"),T.classList.toggle(".path--invalid",!m),T.setAttribute("d",y),o.portType==="value"&&T.style.setProperty("--path-color",this.mManager.generateStringColor(o.resolvedDataType));let S=document.createElementNS(v,"path");S.classList.add("path","path--mouse-target"),S.setAttribute("d",y),S.setAttribute("data-connection-id",e.toString()),t.appendChild(T),t.appendChild(S)}renderConnections(){this.svgLayer.innerHTML="",this.mConnectionRegistry.clear();let t=this.mManager.activeFunction;if(!t)return;let e=this.mManager.integrity.errorItems,o=0;for(let c of t.nodes)for(let m of c.outputs.list)for(let v of m.connectedPorts){let y=o++;this.mConnectionRegistry.set(y,{sourcePort:m,targetPort:v});let T=e.has(m)||e.has(v);this.renderConnectionPath(this.svgLayer,y,m,v,!T)}}static{Zo()}};function bs(){function f(l,n){return function(a){e(n,"addInitializer"),o(a,"An initializer"),l.push(a)}}function t(l,n,u,a,r,b,g,D,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:g?"#"+n:n,static:b,private:g,metadata:D},d={v:!1};s.addInitializer=f(a,d);var i,h;r===0?g?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return l(w,s)}finally{d.v=!0}}function e(l,n){if(l.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(l,n){if(typeof l!="function")throw new TypeError(n+" must be a function")}function c(l,n){var u=typeof n;if(l===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var a;throw l===0?a="field":l===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function m(l,n,u,a,r,b,g,D,w){var p=u[0],s,d,i;g?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,C;if(typeof p=="function")h=t(p,a,s,D,r,b,g,w,i),h!==void 0&&(c(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h);else for(var P=p.length-1;P>=0;P--){var M=p[P];if(h=t(M,a,s,D,r,b,g,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(I,E){return E};else if(typeof d!="function"){var F=d;d=function(I,E){for(var L=E,R=0;R<F.length;R++)L=F[R].call(I,L);return L}}else{var z=d;d=function(I,E){return z.call(I,E)}}l.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),g?r===1?(l.push(function(I,E){return i.get.call(I,E)}),l.push(function(I,E){return i.set.call(I,E)})):r===2?l.push(i):l.push(function(I,E){return i.call(I,E)}):Object.defineProperty(n,a,s))}function v(l,n,u){for(var a=[],r,b,g=new Map,D=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,C;if(h?(x=l,s=s-5,b=b||[],C=b):(x=l.prototype,r=r||[],C=r),s!==0&&!i){var P=h?D:g,M=P.get(d)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!M&&s>2?P.set(d,s):P.set(d,!0)}m(a,x,p,d,s,h,i,C,u)}}return y(a,r),y(a,b),a}function y(l,n){n&&l.push(function(u){for(var a=0;a<n.length;a++)n[a].call(u);return u})}function T(l,n,u){if(n.length>0){for(var a=[],r=l,b=l.name,g=n.length-1;g>=0;g--){var D={v:!1};try{var w=n[g](r,{kind:"class",name:b,addInitializer:f(a,D),metadata:u})}finally{D.v=!0}w!==void 0&&(c(10,w),r=w)}return[S(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function S(l,n){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,a,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(b===void 0?null:b),D=v(n,u,g);return a.length||S(n,g),{e:D,get c(){return T(n,a,g)}}}}function on(f,t,e,o){return(on=bs())(f,t,e,o)}var nn,en,Te;nn=yt({access:X.Read,selector:/^potatno-preview$/});var rn=class{static{({c:[Te,en]}=on(this,[],[nn]))}constructor(t=O.use(q),e=O.use(H),o=O.use(et)){this.mTarget=t,this.mProcedure=e.createExpressionProcedure(o.value)}mProcedure;mTarget;onUpdate(){let t=this.mProcedure.execute();if(!t){let o=this.mTarget.childNodes.length>0;return o&&(this.mTarget.innerHTML=""),o}let e=t.element;return this.mTarget.contains(e)?!1:(this.mTarget.innerHTML="",this.mTarget.appendChild(e),!0)}static{en()}};(function(f){f.Function="function",f.Comment="comment",f.Input="input",f.Output="output",f.Reroute="reroute"})(kt||(kt={}));var kt;var sn=`:host {\r
    display: block;\r
    position: relative;\r
\r
    --potatno-port-value-size: 5px;\r
    --potatno-port-flow-size: 15px;\r
    --potatno-port-handle-width: max(var(--potatno-port-value-size), var(--potatno-port-flow-size));\r
}\r
\r
.port-wrapper {\r
    --potatno-port-color: var(--type-color);\r
    height: var(--potatno-grid-size);\r
    position: relative;\r
}\r
\r
.port-drag-connetion {\r
    position: absolute;\r
    top: 0;\r
    height: 1px;\r
    width: 1px;\r
    overflow: visible;\r
    pointer-events: none;\r
\r
    /* While dragging should stay above all nodes. */\r
    z-index: 200;\r
\r
    .output & {\r
        right: 0;\r
    }\r
\r
    .input & {\r
        left: 0;\r
    }\r
\r
    path {\r
        fill: none;\r
        opacity: 0.6;\r
        pointer-events: none;\r
        stroke: var(--potatno-port-color);\r
        stroke-dasharray: 8 4;\r
        stroke-linecap: round;\r
        stroke-linejoin: round;\r
        stroke-width: 2;\r
    }\r
}\r
\r
.port-values {\r
    --potatno-port-values-line-length: 15px;\r
\r
    position: absolute;\r
    top: 50%;\r
    right: 100%;\r
    transform: translateY(-50%);\r
\r
    display: flex;\r
    flex-direction: column;\r
    align-items: flex-end;\r
    justify-content: center;\r
    gap: 2px;\r
\r
    height: 100%;\r
    padding-right: var(--potatno-port-values-line-length);\r
    pointer-events: all;\r
    z-index: 10;\r
\r
    &::after {\r
        content: '';\r
        position: absolute;\r
        right: 0;\r
        height: 1px;\r
        width: var(--potatno-port-values-line-length);\r
        pointer-events: none;\r
        background-color: var(--potatno-port-color);\r
    }\r
\r
    .port-values__field {\r
        position: relative;\r
        display: flex;\r
        min-width: 40px;\r
        padding: 2px 4px;\r
        margin: 2px 0;\r
        justify-content: center;\r
        gap: 3px;\r
\r
        border: 1px solid var(--potatno-port-color);\r
        border-radius: 2px;\r
\r
        background: color-mix(in srgb, var(--potatno-port-color) 12%, var(--potatno-color-background));\r
        white-space: nowrap;\r
    }\r
\r
    .port-values__label {\r
        color: var(--potatno-port-color);\r
        font-size: var(--potatno-font-size);\r
        user-select: none;\r
        white-space: nowrap;\r
    }\r
\r
    .port-values__input {\r
        padding: 1px 3px;\r
        width: 40px;\r
        border: 1px solid color-mix(in srgb, var(--potatno-port-color) 35%, transparent);\r
        border-radius: 2px;\r
        color: var(--potatno-color-text);\r
        background: color-mix(in srgb, var(--potatno-port-color) 8%, var(--potatno-color-background));\r
        box-sizing: border-box;\r
        font-size: var(--potatno-font-size-small);\r
        appearance: textfield;\r
\r
        &:focus {\r
            border-color: var(--potatno-port-color);\r
            box-shadow: 0 0 0 1px color-mix(in srgb, var(--potatno-port-color) 30%, transparent);\r
            outline: none;\r
        }\r
\r
        &[type='checkbox'] {\r
            margin: 0;\r
            accent-color: var(--potatno-port-color);\r
            cursor: pointer;\r
        }\r
    }\r
}\r
\r
.port {\r
    align-items: center;\r
    cursor: crosshair;\r
    display: flex;\r
    height: 100%;\r
    position: relative;\r
\r
    /* Reverse port handle and label position on output ports */\r
    .output & {\r
        flex-direction: row-reverse;\r
    }\r
\r
    .port__label {\r
        flex: 1;\r
        color: var(--potatno-color-text);\r
        font-size: var(--potatno-font-size);\r
        user-select: none;\r
        white-space: nowrap;\r
        overflow: hidden;\r
        text-overflow: ellipsis;\r
\r
        .output & {\r
            text-align: end;\r
        }\r
\r
        .input & {\r
            text-align: start;\r
        }\r
    }\r
\r
    /* Small hover animation for ports, hover values excluded */\r
    .output &:hover .port-handle {\r
        transform: translateX(1px);\r
    }\r
\r
    .input &:hover .port-handle {\r
        transform: translateX(-1px);\r
    }\r
\r
    .port__handle {\r
        position: relative;\r
        display: flex;\r
        width: var(--potatno-port-handle-width);\r
        z-index: 99;\r
        align-items: center;\r
        justify-content: center;\r
\r
        .output & {\r
            transform: translateX(calc(var(--potatno-port-handle-width) / 2));\r
        }\r
\r
        .input & {\r
            transform: translateX(calc(var(--potatno-port-handle-width) / -2));\r
        }\r
\r
        .port-handle {\r
            position: relative;\r
            transition: transform 0.1s ease-in-out;\r
\r
            &.flow {\r
                display: flex;\r
\r
                &::before {\r
                    content: '';\r
\r
                    height: calc((var(--potatno-port-flow-size) / 3) * 2);\r
                    width: calc((var(--potatno-port-flow-size) / 3) * 2);\r
\r
                    background: var(--potatno-port-color);\r
                    border-radius: 2px;\r
                }\r
\r
                &::after {\r
                    content: '';\r
                    position: relative;\r
                    height: 0;\r
                    width: 0;\r
\r
                    border-bottom: calc(var(--potatno-port-flow-size) / 3) solid transparent;\r
                    border-top: calc(var(--potatno-port-flow-size) / 3) solid transparent;\r
                }\r
\r
                &.connected::before {\r
                    background: var(--potatno-port-color);\r
                }\r
\r
                &:not(.connected)::before {\r
                    background: color-mix(in srgb, var(--potatno-port-color) 30%, var(--potatno-color-background));\r
                }\r
\r
                &.error::before {\r
                    background: var(--potatno-color-error);\r
                }\r
\r
                .output & {\r
                    &::after {\r
                        right: 1px;\r
                        border-left: var(--pn-node-port-tip-size) solid var(--potatno-port-color);\r
                    }\r
\r
                    &.connected::after {\r
                        border-left-color: var(--potatno-port-color);\r
                    }\r
\r
                    &:not(.connected)::after {\r
                        border-left-color: color-mix(in srgb, var(--potatno-port-color) 30%, var(--potatno-color-background));\r
                    }\r
\r
                    &.error::after {\r
                        border-left-color: var(--potatno-color-error);\r
                    }\r
                }\r
\r
                .input & {\r
                    flex-direction: row-reverse;\r
\r
                    &::after {\r
                        left: 1px;\r
                        border-right: var(--pn-node-port-tip-size) solid var(--potatno-port-color);\r
                    }\r
\r
                    &.connected::after {\r
                        border-right-color: var(--potatno-port-color);\r
                    }\r
\r
                    &:not(.connected)::after {\r
                        border-right-color: color-mix(in srgb, var(--potatno-port-color, ) 30%, var(--potatno-color-background));\r
                    }\r
\r
                    &.error::after {\r
                        border-right-color: var(--potatno-color-error);\r
                    }\r
                }\r
            }\r
\r
            &.value {\r
                background: var(--potatno-port-color);\r
                border: 1px solid var(--potatno-port-color);\r
                border-radius: 50%;\r
                height: calc(var(--potatno-port-value-size) - 1px);\r
                width: calc(var(--potatno-port-value-size) - 1px);\r
\r
                &.connected {\r
                    background: var(--potatno-port-color);\r
                }\r
\r
                &:not(.connected) {\r
                    background: color-mix(in srgb, var(--potatno-port-color) 30%, var(--potatno-color-background));\r
                }\r
\r
                &.error {\r
                    background: var(--potatno-color-error);\r
                }\r
            }\r
\r
            &.error {\r
                filter: drop-shadow(0 0 4px var(--potatno-color-error));\r
            }\r
        }\r
    }\r
}`;var an=`<div class="port-wrapper {{this.portDirection}}" style="--type-color: {{this.portColor}}" (dragover)="this.onDragOver($event)" (drop)="this.onDrop($event)">\r
\r
    <!-- Actual port handle. -->\r
    <div class="port" draggable="true" [title]="this.portType" (dragstart)="this.onDragStart($event)" (dragend)="this.onDragEnd($event)" (pointerdown)="this.stopEventPropagation($event)">\r
        <div class="port__handle">\r
            <div class="port-handle {{this.portHandleClasses}}"></div>\r
        </div>\r
        <div class="port__label">{{this.portName}}</div>\r
    </div>\r
\r
    <svg #dragConnection class="port-drag-connetion" xmlns="http://www.w3.org/2000/svg"></svg>\r
\r
    $if(this.showValueInput) {\r
        <div class="port-values" (pointerdown)="this.stopEventPropagation($event)">\r
\r
            <div class="port-values__field">\r
                $for(inputDefinition of this.inputDefinitions) {\r
                    \r
                    <!-- Skip labels when its the only label -->\r
                    $if(this.inputDefinition.totalCount > 1) {\r
                        <span class="port-values__label">{{this.inputDefinition.name}}</span>\r
                    }\r
                    <input [type]="this.inputDefinition.htmlType" class="port-values__input" [value]="this.inputDefinition.value" (change)="this.onDirectValueInput($event, this.inputDefinition.index)"/>\r
                    \r
                }\r
            </div>\r
\r
        </div>\r
    }\r
\r
</div>\r
`;function Ts(){function f(l,n){return function(a){e(n,"addInitializer"),o(a,"An initializer"),l.push(a)}}function t(l,n,u,a,r,b,g,D,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:g?"#"+n:n,static:b,private:g,metadata:D},d={v:!1};s.addInitializer=f(a,d);var i,h;r===0?g?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return l(w,s)}finally{d.v=!0}}function e(l,n){if(l.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(l,n){if(typeof l!="function")throw new TypeError(n+" must be a function")}function c(l,n){var u=typeof n;if(l===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var a;throw l===0?a="field":l===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function m(l,n,u,a,r,b,g,D,w){var p=u[0],s,d,i;g?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,C;if(typeof p=="function")h=t(p,a,s,D,r,b,g,w,i),h!==void 0&&(c(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h);else for(var P=p.length-1;P>=0;P--){var M=p[P];if(h=t(M,a,s,D,r,b,g,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(I,E){return E};else if(typeof d!="function"){var F=d;d=function(I,E){for(var L=E,R=0;R<F.length;R++)L=F[R].call(I,L);return L}}else{var z=d;d=function(I,E){return z.call(I,E)}}l.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),g?r===1?(l.push(function(I,E){return i.get.call(I,E)}),l.push(function(I,E){return i.set.call(I,E)})):r===2?l.push(i):l.push(function(I,E){return i.call(I,E)}):Object.defineProperty(n,a,s))}function v(l,n,u){for(var a=[],r,b,g=new Map,D=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,C;if(h?(x=l,s=s-5,b=b||[],C=b):(x=l.prototype,r=r||[],C=r),s!==0&&!i){var P=h?D:g,M=P.get(d)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!M&&s>2?P.set(d,s):P.set(d,!0)}m(a,x,p,d,s,h,i,C,u)}}return y(a,r),y(a,b),a}function y(l,n){n&&l.push(function(u){for(var a=0;a<n.length;a++)n[a].call(u);return u})}function T(l,n,u){if(n.length>0){for(var a=[],r=l,b=l.name,g=n.length-1;g>=0;g--){var D={v:!1};try{var w=n[g](r,{kind:"class",name:b,addInitializer:f(a,D),metadata:u})}finally{D.v=!0}w!==void 0&&(c(10,w),r=w)}return[S(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function S(l,n){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,a,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(b===void 0?null:b),D=v(n,u,g);return a.length||S(n,g),{e:D,get c(){return T(n,a,g)}}}}function hn(f,t,e,o){return(hn=Ts())(f,t,e,o)}function Ds(f){return f}var dn,ln,mn,cn,un,Xe;dn=W({selector:"potatno-port",template:an,style:sn}),mn=ft("dragConnection");new class extends Ds{constructor(){super(Xe),ln()}static{class f{static{({e:[cn,un],c:[Xe,ln]}=hn(this,[[mn,1,"dragConnectionSvg"],[rt,3,"port"]],[dn]))}static DRAG_MIME_TYPE="application/x-potatno-port";static mDraggedPortInformation;mComponent;mDragPositionEventHandler;mManager;mPort;mUnsubscribe;get dragPositionEventHandler(){return this.mDragPositionEventHandler}#t=(un(this),cn(this));get dragConnectionSvg(){return this.#t}set dragConnectionSvg(e){this.#t=e}get hasError(){return this.port===null?!1:this.mManager.integrity.errorItems.has(this.port)}get inputDefinitions(){if(!this.port)return new Array;let e=this.port.project.types.getType(this.port.resolvedDataType);return e.inputs.map((o,c)=>({htmlType:(()=>{switch(o.type){case"boolean":return"checkbox";case"number":return"number";case"string":return"text"}})(),index:c,name:o.name,value:this.port.directValue[c]??"",totalCount:e.inputs.length}))}get port(){return this.mPort}set port(e){if(this.mPort!==e){if(e===null)throw new A("A null port cant be assigned.",this);this.mPort=e,this.mComponent.updater.updateAsync()}}get portColor(){return!this.port||this.port.portType==="flow"?"var(--potatno-color-text)":this.mManager.generateStringColor(this.port.resolvedDataType)}get portDirection(){return this.port?.direction??"output"}get portHandleClasses(){if(!this.port)return"";let e=[this.port.portType];return this.port.connectedPorts.size>0&&e.push("connected"),this.hasError&&e.push("error"),e.join(" ")}get portName(){return this.port?.label??""}get portType(){return!this.port||this.port.portType!=="value"?"":this.port.resolvedDataType??""}get showValueInput(){return!this.port||this.port.portType!=="value"||this.port.direction!=="input"||this.port.connectedPorts.size>0||f.mDraggedPortInformation&&f.mDraggedPortInformation.port===this.port?!1:!this.port.node.project.types.isGenericType(this.port.dataType??"")}constructor(e=O.use($),o=O.use(K)){this.mComponent=e,this.mManager=o,this.mPort=null,this.mDragPositionEventHandler=c=>{f.mDraggedPortInformation&&f.mDraggedPortInformation.port===this.port&&(performance.now()-c.timeStamp>100||this.renderDragWire(c.clientX,c.clientY))},this.mUnsubscribe=this.mManager.subscribe(_.Connection,()=>{this.mComponent.updater.updateAsync()})}onConnect(){document.addEventListener("dragover",this.mDragPositionEventHandler,{capture:!0})}onDeconstruct(){this.mUnsubscribe(),document.removeEventListener("dragover",this.mDragPositionEventHandler,{capture:!0})}onDirectValueInput(e,o){if(!this.port)return;let c=e.target,m=[...this.port.directValue];m[o]=c.type==="checkbox"?c.checked?"true":"false":c.value,this.mManager.graph.setPortDirectValue(this.port,m)}onDragEnd(e){e.stopPropagation(),e.preventDefault(),this.dragConnectionSvg.innerHTML="",this.mComponent.updater.updateAsync()}onDragOver(e){this.draggedPortCanConnect(e.dataTransfer)&&(e.preventDefault(),e.stopPropagation(),e.dataTransfer&&(e.dataTransfer.dropEffect="link"))}onDragStart(e){if(!this.port||!e.dataTransfer){e.preventDefault();return}e.stopPropagation(),e.dataTransfer.effectAllowed="link",e.dataTransfer.setData(f.DRAG_MIME_TYPE,this.port.definitionId),e.dataTransfer.setDragImage(document.createElement("div"),0,0);let o=this.mManager.connections.getPortGridPoint(this.port);this.port.direction==="input"&&(o.x-=1),f.mDraggedPortInformation={port:this.port,portPosition:{x:o.x+1,y:o.y},lastPointerGridPosition:{x:0,y:0}},this.mComponent.updater.updateAsync()}onDrop(e){if(!this.draggedPortCanConnect(e.dataTransfer)||(e.preventDefault(),e.stopPropagation(),!f.mDraggedPortInformation)||!this.port)return;let o=f.mDraggedPortInformation.port;this.mManager.graph.connectPorts(o,this.port)}stopEventPropagation(e){e.stopPropagation()}createDragPath(e,o){if(!this.port)return"";let c=this.mManager.connections.pixelToGridSpace(e,o);return this.mManager.connections.createTemporaryPath(this.port,c)}draggedPortCanConnect(e){if(!this.port||!f.mDraggedPortInformation||!e||!e.types.includes(f.DRAG_MIME_TYPE))return!1;let o=f.mDraggedPortInformation.port;return o!==this.port&&o.direction!==this.port.direction&&o.portType===this.port.portType}renderDragWire(e,o){if(!f.mDraggedPortInformation)return;let c=this.dragConnectionSvg.firstChild;c||(c=document.createElementNS("http://www.w3.org/2000/svg","path"),this.dragConnectionSvg.appendChild(c));let m=this.mManager.connections.pixelToGridSpace(e,o);if(m.x===f.mDraggedPortInformation.lastPointerGridPosition.x&&m.y===f.mDraggedPortInformation.lastPointerGridPosition.y)return;f.mDraggedPortInformation.lastPointerGridPosition.x=m.x,f.mDraggedPortInformation.lastPointerGridPosition.y=m.y;let v=f.mDraggedPortInformation.portPosition,y=v.x*this.mManager.grid.gridSize,T=v.y*this.mManager.grid.gridSize;this.dragConnectionSvg.style.setProperty("transform",`translate(${-y}px, ${-T}px)`),c.setAttribute("d",this.createDragPath(e,o))}}}};var fn=`:host {\r
    display: block;\r
    height: 100%;\r
    width: 100%;\r
    font-family: var(--potatno-font-family);\r
    font-size: var(--potatno-font-size);\r
\r
    --node-border-radius: 2px;\r
}\r
\r
/* \u2500\u2500 Standard node container \u2500\u2500 */\r
\r
.node {\r
    box-sizing: border-box;\r
    display: flex;\r
    flex-direction: column;\r
    min-height: 100%;\r
    background: var(--potatno-color-background);\r
    \r
    border-radius: var(--node-border-radius);\r
    box-shadow: 0 2px 8px var(--potatno-color-shadow);\r
    overflow: visible;\r
    user-select: none;\r
\r
    /* Add border and adjust global position for it. */\r
    border: 1px solid var(--potatno-color-border);\r
    transform: translate(-1px, -1px);\r
}\r
\r
.node.selected {\r
      border-color: var(--potatno-color-accent);\r
    box-shadow: 0 0 0 1px var(--potatno-color-accent), 0 2px 8px var(--potatno-color-shadow);\r
}\r
\r
.node.has-error,\r
.node.has-error.selected {\r
    border-color: var(--potatno-color-error, #f38ba8);\r
    box-shadow: 0 0 0 1px var(--potatno-color-error, #f38ba8), 0 2px 8px var(--potatno-color-shadow);\r
}\r
\r
/* \u2500\u2500 Header bar \u2500\u2500 */\r
\r
.node-header {\r
    display: flex;\r
    align-items: center;\r
    height: var(--pn-node-header-height);\r
    padding: 0 var(--pn-grid-size);\r
    gap: var(--pn-grid-half-size);\r
    border-radius: var(--node-border-radius) var(--node-border-radius) 0 0;\r
    color: #fff;\r
    font-weight: 600;\r
    font-size: var(--pn-node-font-size);\r
    line-height: var(--pn-grid-size);\r
    cursor: grab;\r
    --port-label-color: rgba(255, 255, 255, 0.9);\r
}\r
\r
.node-header:active {\r
    cursor: grabbing;\r
}\r
\r
.node-icon {\r
    font-size: var(--pn-node-font-size);\r
    flex-shrink: 0;\r
    line-height: var(--pn-grid-size);\r
}\r
\r
.node-label {\r
    flex: 1;\r
    line-height: var(--pn-grid-size);\r
    white-space: nowrap;\r
    overflow: hidden;\r
    text-overflow: ellipsis;\r
}\r
\r
/* \u2500\u2500 Body with data ports \u2500\u2500 */\r
\r
.node-body {\r
    display: flex;\r
    flex: 1 0 auto;\r
    justify-content: space-between;\r
    min-height: calc(100% - var(--pn-node-header-height));\r
    padding: 0;\r
    gap: 0 20px;\r
}\r
\r
.node-ports {\r
    flex: 1;\r
    display: flex;\r
    flex-direction: column;\r
    align-items: stretch;\r
    min-width: 0;\r
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
    background: var(--potatno-color-background-dark);\r
    border: 1px solid var(--potatno-color-border);\r
    border-radius: 3px;\r
    color: var(--potatno-color-text);\r
    font-family: var(--potatno-font-family);\r
    font-size: var(--potatno-font-size-small);\r
    padding: 2px 6px;\r
    outline: none;\r
    box-sizing: border-box;\r
}\r
\r
.node-value-input input:focus {\r
    border-color: var(--potatno-color-accent);\r
}\r
\r
/* \u2500\u2500 Open-function button \u2500\u2500 */\r
\r
.open-function-btn {\r
    background: none;\r
    border: 1px solid currentColor;\r
    border-radius: 3px;\r
    color: inherit;\r
    font-size: var(--pn-node-button-font-size);\r
    height: var(--pn-grid-size);\r
    line-height: 1;\r
    padding: 0 3px;\r
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
    font-size: var(--pn-node-button-font-size);\r
    height: var(--pn-grid-size);\r
    line-height: 1;\r
    padding: 0 3px;\r
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
    background: var(--potatno-color-background-light);\r
    border: 1px solid var(--potatno-color-border);\r
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
    color: var(--potatno-color-accent);\r
    cursor: pointer;\r
    font-family: var(--potatno-font-family);\r
    font-size: var(--potatno-font-size-small);\r
    padding: 3px 8px;\r
    text-align: left;\r
}\r
\r
.preview-port-item:hover {\r
    background: var(--potatno-color-background-light);\r
}\r
\r
.preview-port-item.active {\r
    color: var(--potatno-color-accent);\r
}\r
\r
.preview-style-bar {\r
    display: flex;\r
    justify-content: flex-end;\r
    padding: 2px 4px 0;\r
}\r
\r
.preview-style-select {\r
    background: var(--potatno-color-background-light);\r
    border: 1px solid var(--potatno-color-border);\r
    border-radius: 3px;\r
    color: var(--potatno-color-text);\r
    font-family: var(--potatno-font-family);\r
    font-size: var(--potatno-font-size-small);\r
    padding: 0 2px;\r
}\r
\r
/* \u2500\u2500 Comment node \u2500\u2500 */\r
\r
.node-comment {\r
    box-sizing: border-box;\r
    height: 100%;\r
    background: rgba(108, 112, 134, 0.1);\r
    border: 1px dashed var(--pn-cat-comment);\r
    border-radius: var(--node-border-radius);\r
    min-width: 120px;\r
    min-height: 60px;\r
    position: relative;\r
    user-select: none;\r
}\r
\r
.node-comment.selected {\r
    border-color: var(--potatno-color-accent);\r
}\r
\r
.comment-header {\r
    display: flex;\r
    align-items: center;\r
    gap: 4px;\r
    height: var(--pn-node-header-height);\r
    padding: 0 var(--pn-grid-size);\r
    color: var(--pn-text-muted);\r
    font-size: var(--pn-node-font-size);\r
    line-height: var(--pn-grid-size);\r
    cursor: grab;\r
}\r
\r
.comment-header:active {\r
    cursor: grabbing;\r
}\r
\r
.comment-body {\r
    box-sizing: border-box;\r
    height: calc(100% - var(--pn-node-header-height));\r
    padding: 0 var(--pn-grid-size) var(--pn-grid-size) var(--pn-grid-size);\r
}\r
\r
.comment-body textarea {\r
    height: 100%;\r
    width: 100%;\r
    min-height: 32px;\r
    background: transparent;\r
    border: none;\r
    color: var(--potatno-color-text);\r
    font-family: var(--potatno-font-family);\r
    font-size: var(--potatno-font-size-small);\r
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
    background: var(--potatno-color-background-dark);\r
    overflow: hidden;\r
}\r
\r
.node-preview:empty {\r
    display: none;\r
}\r
\r
.node-preview:not(:empty) {\r
    padding: 6px;\r
    border-top: 1px solid var(--potatno-color-border);\r
}\r
\r
/* \u2500\u2500 Reroute node \u2500\u2500 */\r
\r
.node-reroute {\r
    display: flex;\r
    align-items: center;\r
    gap: 0;\r
    height: 100%;\r
    user-select: none;\r
}\r
\r
.node-reroute.selected .reroute-dot {\r
    box-shadow: 0 0 0 2px var(--potatno-color-accent);\r
}\r
\r
.reroute-dot {\r
    width: var(--pn-grid-size);\r
    height: var(--pn-grid-size);\r
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
`;var pn=`$if(this.nodeData) {
    $if(this.isReroute) {
        <div class="node-reroute {{this.selectedClass}} {{this.hasErrorClass}}">
            <div class="reroute-inputs">
                $for(inPort of this.inputPorts) {
                    <potatno-port
                        [port]="this.inPort">
                    </potatno-port>
                }
            </div>
            <div class="reroute-dot"></div>
            <div class="reroute-outputs">
                $for(outPort of this.outputPorts) {
                    <potatno-port
                        [port]="this.outPort">
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
                $if(this.inputPorts.length > 0) {
                    <div class="node-ports">    
                        $for(inPort of this.inputPorts) {
                            <potatno-port
                                [port]="this.inPort">
                            </potatno-port>
                        }   
                    </div>
                }

                $if(this.outputPorts.length > 0) {
                    <div class="node-ports">
                        $for(outPort of this.outputPorts) {
                            <potatno-port
                                [port]="this.outPort">
                            </potatno-port>
                        }
                    </div>
                }
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
`;function Ss(){function f(l,n){return function(a){e(n,"addInitializer"),o(a,"An initializer"),l.push(a)}}function t(l,n,u,a,r,b,g,D,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:g?"#"+n:n,static:b,private:g,metadata:D},d={v:!1};s.addInitializer=f(a,d);var i,h;r===0?g?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return l(w,s)}finally{d.v=!0}}function e(l,n){if(l.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(l,n){if(typeof l!="function")throw new TypeError(n+" must be a function")}function c(l,n){var u=typeof n;if(l===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var a;throw l===0?a="field":l===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function m(l,n,u,a,r,b,g,D,w){var p=u[0],s,d,i;g?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,C;if(typeof p=="function")h=t(p,a,s,D,r,b,g,w,i),h!==void 0&&(c(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h);else for(var P=p.length-1;P>=0;P--){var M=p[P];if(h=t(M,a,s,D,r,b,g,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(I,E){return E};else if(typeof d!="function"){var F=d;d=function(I,E){for(var L=E,R=0;R<F.length;R++)L=F[R].call(I,L);return L}}else{var z=d;d=function(I,E){return z.call(I,E)}}l.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),g?r===1?(l.push(function(I,E){return i.get.call(I,E)}),l.push(function(I,E){return i.set.call(I,E)})):r===2?l.push(i):l.push(function(I,E){return i.call(I,E)}):Object.defineProperty(n,a,s))}function v(l,n,u){for(var a=[],r,b,g=new Map,D=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,C;if(h?(x=l,s=s-5,b=b||[],C=b):(x=l.prototype,r=r||[],C=r),s!==0&&!i){var P=h?D:g,M=P.get(d)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!M&&s>2?P.set(d,s):P.set(d,!0)}m(a,x,p,d,s,h,i,C,u)}}return y(a,r),y(a,b),a}function y(l,n){n&&l.push(function(u){for(var a=0;a<n.length;a++)n[a].call(u);return u})}function T(l,n,u){if(n.length>0){for(var a=[],r=l,b=l.name,g=n.length-1;g>=0;g--){var D={v:!1};try{var w=n[g](r,{kind:"class",name:b,addInitializer:f(a,D),metadata:u})}finally{D.v=!0}w!==void 0&&(c(10,w),r=w)}return[S(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function S(l,n){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,a,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(b===void 0?null:b),D=v(n,u,g);return a.length||S(n,g),{e:D,get c(){return T(n,a,g)}}}}function Tn(f,t,e,o){return(Tn=Ss())(f,t,e,o)}var Dn,gn,En,In,Sn,vn,yn,bn,wn,dr;Dn=W({selector:"potatno-node",template:pn,style:fn,modules:[Te],components:[Xe]}),En=B.state(),In=B.state(),Sn=qt("resize-start");var xn=class{static{({e:[vn,yn,bn,wn],c:[dr,gn]}=Tn(this,[[[rt,En],1,"nodeData"],[[rt,In],1,"selected"],[Sn,1,"mResizeStart"]],[Dn]))}constructor(t=O.use($),e=O.use(K)){this.mComponent=t,this.mManager=e,this.mUnsubscribe=null,this.mNodeDefinition=null}mComponent;mManager;mUnsubscribe;mNodeDefinition;#t=(wn(this),vn(this,null));get nodeData(){return this.#t}set nodeData(t){this.#t=t}#e=yn(this,!1);get selected(){return this.#e}set selected(t){this.#e=t}#r=bn(this);get mResizeStart(){return this.#r}set mResizeStart(t){this.#r=t}get selectedClass(){return this.selected?"selected":""}get hasErrorClass(){return this.nodeData!==null&&this.mManager.integrity.errorItems.has(this.nodeData)?"has-error":""}get isComment(){return this.nodeDefinition?.category.name===kt.Comment}get isReroute(){return this.nodeDefinition?.category.name===kt.Reroute}get isFunction(){return this.nodeDefinition?.category.name===kt.Function}get showOpenButton(){return this.isFunction}get canPreview(){return this.valueOutputPorts.length>0}get isPreviewActive(){return this.nodeData?.preview!==null}get previewEyeClass(){return this.isPreviewActive?"preview-eye-btn active":"preview-eye-btn"}get previewDisplays(){if(!this.nodeData)return[];let t=this.nodeData.project,e=t.getFunction(this.nodeData.function.definitionId);if(!e)return[];let o=this.nodeData.preview,c=o?this.nodeData.outputs.map.get(o.portId):void 0;if(c&&c.portType==="value")return this.createDisplayOptions(t,t.preview.availableDisplays(e,c.resolvedDataType));let m=new Set;for(let v of this.valueOutputPorts)for(let y of t.preview.availableDisplays(e,v.resolvedDataType))m.add(y);return this.createDisplayOptions(t,[...m])}get previewDriver(){let t=this.nodeData?.preview;if(!this.nodeData||!t)return null;let e=this.nodeData.outputs.map.get(t.portId);return e?this.mManager.preview.requestDriver(e,t.displayId):null}get valueOutputPorts(){return this.nodeData?[...this.nodeData.outputs.value]:[]}get selectedDisplayId(){return this.nodeData?.preview?.displayId??""}get previewNoneClass(){return this.isPreviewActive?"preview-port-item":"preview-port-item active"}get categoryColor(){return this.nodeData?this.mManager.generateStringColor(this.nodeDefinition?.category.name??""):""}get categoryIcon(){return this.nodeData?this.nodeDefinition?.category.icon??"":""}get nodeLabel(){return this.nodeData?.label??""}get nodeName(){if(!this.nodeData)return"";let t=this.nodeData;return t.project.nodeDefinitions.find(o=>o.id===t.definitionId)?.label??t.label}get nodeGridStyle(){let t=this.mManager.grid.gridSize;return`--pn-grid-size: ${t}px; --pn-grid-half-size: ${t/2}px; --pn-node-port-gap: ${t}px;`}get inputPorts(){return this.nodeData?this.nodeData.inputs.list:new Array}get outputPorts(){return this.nodeData?this.nodeData.outputs.list:new Array}get nodeDefinition(){if(!this.nodeData)return null;if(this.mNodeDefinition&&this.mNodeDefinition.id==this.nodeData.definitionId)return this.mNodeDefinition;if(!this.mManager.activeFunction)return null;let t=this.mManager.activeFunction.nodeDefinitions.find(e=>e.id===this.nodeData.definitionId);return t?(this.mNodeDefinition=t,t):null}isPreviewedPort(t){return this.nodeData?.preview?.portId===t.definitionId}previewPortClass(t){return this.isPreviewedPort(t)?"preview-port-item active":"preview-port-item"}onConnect(){this.mUnsubscribe=this.mManager.subscribe(_.Function|_.SpecialActiveFunction|_.Node|_.Connection,()=>{this.mComponent.updater.updateAsync()})}onDeconstruct(){this.mUnsubscribe?.(),this.mUnsubscribe=null}onSelectPreviewPort(t,e){t.stopPropagation();let o=this.previewDisplaysForPort(e);this.mManager.graph.updateNode(this.nodeData,c=>{if(c.preview?.portId===e.definitionId){c.preview=null;return}let m=c.preview&&o.includes(c.preview.displayId)?c.preview.displayId:o[0];m&&(c.preview={portId:e.definitionId,displayId:m})})}previewDisplaysForPort(t){if(!this.nodeData)return[];let e=this.nodeData.project.getFunction(this.nodeData.function.definitionId);return e?this.nodeData.project.preview.availableDisplays(e,t.resolvedDataType):[]}onClearPreview(t){t.stopPropagation(),this.mManager.graph.updateNode(this.nodeData,e=>{e.preview=null})}onSelectPreviewStyle(t){t.stopPropagation();let e=t.target.value;this.mManager.graph.updateNode(this.nodeData,o=>{o.preview&&(o.preview={portId:o.preview.portId,displayId:e})})}createDisplayOptions(t,e){return e.map(o=>({id:o,label:t.preview.getDisplay(o)?.name??o}))}onOpenFunction(t){if(t.stopPropagation(),!this.nodeData||!this.mManager.graph.document)return;let e=this.nodeData.definitionId,o=this.mManager.graph.document.nodeDefinitions.find(c=>c.id===e);o instanceof Mt&&this.mManager.setActiveFunction(o.function)}onCommentInput(t){let e=t.target;this.mManager.graph.updateNode(this.nodeData,o=>{o.label=e.value})}onResizeStart(t){t.stopPropagation(),t.preventDefault(),this.nodeData&&this.mResizeStart.dispatchEvent({node:this.nodeData,startX:t.clientX,startY:t.clientY})}static{gn()}};var Cn=`:host {\r
    display: flex;\r
    flex: 1;\r
    min-height: 0;\r
    min-width: 0;\r
    position: relative;\r
}\r
\r
.canvas-wrapper {\r
    background: var(--potatno-color-background);\r
    cursor: default;\r
    flex: 1;\r
    min-height: 0;\r
    min-width: 0;\r
    overflow: hidden;\r
    position: relative;\r
}\r
\r
.grid-layer {\r
    position: absolute;\r
    top: 0;\r
    left: 0;\r
    transform-origin: 0 0;\r
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
.selection-box {\r
    background: var(--pn-selection-color);\r
    border: 1px solid var(--potatno-color-accent);\r
    pointer-events: none;\r
    position: absolute;\r
    z-index: 1000;\r
}\r
\r
\r
`;var Pn=`<div #canvasWrapper class="canvas-wrapper" [style]="this.gridBackgroundStyle" (pointerdown)="this.onCanvasPointerDown($event)" (wheel)="this.onCanvasWheel($event)" (contextmenu)="this.onContextMenu($event)">\r
    <div #gridLayer class="grid-layer" [style]="this.gridTransformStyle">\r
        <potatno-connection-layer></potatno-connection-layer>\r
        <div class="node-layer">\r
            $for(nodeState of this.visibleNodes) {\r
                <div class="node-position" style="left:{{this.nodeState.pixelX}}px; top:{{this.nodeState.pixelY}}px; width:{{this.nodeState.pixelW}}px; height:{{this.nodeState.pixelH}}px;">\r
                    <potatno-node [nodeData]="this.nodeState.node" [selected]="this.nodeState.selected" (pointerdown)="this.onNodePointerDown($event, this.nodeState.node)" (resize-start)="this.onNodeResizeStart($event)"/>\r
                </div>\r
            }\r
        </div>\r
    </div>\r
    $if(this.showSelectionBox) {\r
        <div class="selection-box" [style]="this.selectionBoxStyle"></div>\r
    }\r
\r
    $if(this.showAddNodePopup) {\r
        <potatno-node-selection-popup [style]="this.addNodePopupStyle" (node-select)="this.onAddNodePopupNodeSelect($event)"/>\r
    }\r
</div>\r
`;function Ms(){function f(l,n){return function(a){e(n,"addInitializer"),o(a,"An initializer"),l.push(a)}}function t(l,n,u,a,r,b,g,D,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:g?"#"+n:n,static:b,private:g,metadata:D},d={v:!1};s.addInitializer=f(a,d);var i,h;r===0?g?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return l(w,s)}finally{d.v=!0}}function e(l,n){if(l.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(l,n){if(typeof l!="function")throw new TypeError(n+" must be a function")}function c(l,n){var u=typeof n;if(l===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var a;throw l===0?a="field":l===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function m(l,n,u,a,r,b,g,D,w){var p=u[0],s,d,i;g?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,C;if(typeof p=="function")h=t(p,a,s,D,r,b,g,w,i),h!==void 0&&(c(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h);else for(var P=p.length-1;P>=0;P--){var M=p[P];if(h=t(M,a,s,D,r,b,g,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(I,E){return E};else if(typeof d!="function"){var F=d;d=function(I,E){for(var L=E,R=0;R<F.length;R++)L=F[R].call(I,L);return L}}else{var z=d;d=function(I,E){return z.call(I,E)}}l.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),g?r===1?(l.push(function(I,E){return i.get.call(I,E)}),l.push(function(I,E){return i.set.call(I,E)})):r===2?l.push(i):l.push(function(I,E){return i.call(I,E)}):Object.defineProperty(n,a,s))}function v(l,n,u){for(var a=[],r,b,g=new Map,D=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,C;if(h?(x=l,s=s-5,b=b||[],C=b):(x=l.prototype,r=r||[],C=r),s!==0&&!i){var P=h?D:g,M=P.get(d)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!M&&s>2?P.set(d,s):P.set(d,!0)}m(a,x,p,d,s,h,i,C,u)}}return y(a,r),y(a,b),a}function y(l,n){n&&l.push(function(u){for(var a=0;a<n.length;a++)n[a].call(u);return u})}function T(l,n,u){if(n.length>0){for(var a=[],r=l,b=l.name,g=n.length-1;g>=0;g--){var D={v:!1};try{var w=n[g](r,{kind:"class",name:b,addInitializer:f(a,D),metadata:u})}finally{D.v=!0}w!==void 0&&(c(10,w),r=w)}return[S(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function S(l,n){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,a,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(b===void 0?null:b),D=v(n,u,g);return a.length||S(n,g),{e:D,get c(){return T(n,a,g)}}}}function zn(f,t,e,o){return(zn=Ms())(f,t,e,o)}var Vn,Mn,$n,Gn,Bn,Un,Hn,Xn,Nn,An,Ln,Rn,On,_n,Fn,Ns;Vn=W({selector:"potatno-node-graph",template:Pn,style:Cn,components:[ur,dr,hr]}),$n=B.state({complexValue:!0}),Gn=B.state(),Bn=B.state(),Un=B.state({complexValue:!0}),Hn=B.state({complexValue:!0}),Xn=ft("canvasWrapper");var jn=class{static{({e:[Nn,An,Ln,Rn,On,_n,Fn],c:[Ns,Mn]}=zn(this,[[$n,1,"mCachedGraphData"],[Gn,1,"mTransformVersion"],[Bn,1,"mShowSelectionBox"],[Un,1,"mSelectionBoxScreen"],[Hn,1,"mAddNodePopup"],[Xn,1,"canvasWrapper"]],[Vn]))}constructor(t=O.use($),e=O.use(K)){this.mCachedGraphData={visibleNodes:[]},this.mComponent=t,this.mDocumentPointerMoveHandler=null,this.mDocumentPointerUpHandler=null,this.mInteractionState={mode:"idle"},this.mKeyboardHandler=null,this.mManager=e,this.mSelectedNodes=new Set,this.mUnsubscribe=null}mComponent;mManager;mSelectedNodes;mDocumentPointerMoveHandler;mDocumentPointerUpHandler;mInteractionState;mKeyboardHandler;mUnsubscribe;#t=(Fn(this),Nn(this));get mCachedGraphData(){return this.#t}set mCachedGraphData(t){this.#t=t}#e=An(this,0);get mTransformVersion(){return this.#e}set mTransformVersion(t){this.#e=t}#r=Ln(this,!1);get mShowSelectionBox(){return this.#r}set mShowSelectionBox(t){this.#r=t}#o=Rn(this,{x1:0,x2:0,y1:0,y2:0});get mSelectionBoxScreen(){return this.#o}set mSelectionBoxScreen(t){this.#o=t}#n=On(this,null);get mAddNodePopup(){return this.#n}set mAddNodePopup(t){this.#n=t}#i=_n(this);get canvasWrapper(){return this.#i}set canvasWrapper(t){this.#i=t}get gridBackgroundStyle(){return this.mTransformVersion,this.mManager.grid.getGridBackgroundCss()}get gridTransformStyle(){return this.mTransformVersion,"transform: "+this.mManager.grid.getTransformCss()}get gridSize(){return this.mManager.grid.gridSize}get showSelectionBox(){return this.mShowSelectionBox}get selectionBoxStyle(){let t=Math.min(this.mSelectionBoxScreen.x1,this.mSelectionBoxScreen.x2),e=Math.min(this.mSelectionBoxScreen.y1,this.mSelectionBoxScreen.y2),o=Math.abs(this.mSelectionBoxScreen.x2-this.mSelectionBoxScreen.x1),c=Math.abs(this.mSelectionBoxScreen.y2-this.mSelectionBoxScreen.y1);return`left: ${t}px; top: ${e}px; width: ${o}px; height: ${c}px`}get visibleNodes(){return this.mCachedGraphData.visibleNodes}get showAddNodePopup(){return this.mAddNodePopup!==null}get addNodePopupStyle(){let t=this.mAddNodePopup;return t?`left: ${t.screenX}px; top: ${t.screenY}px`:""}onConnect(){this.mManager.connections.gridElement=this.mComponent.element,this.mKeyboardHandler=t=>this.onKeyDown(t),document.addEventListener("keydown",this.mKeyboardHandler),this.mUnsubscribe=this.mManager.subscribe(_.Document|_.Function|_.SpecialActiveFunction|_.Node|_.Connection,t=>{((t.changeType&_.Document)>0||(t.changeType&_.Function)>0||(t.changeType&_.SpecialActiveFunction)>0)&&this.resetForActiveFunction(),this.invalidateGraphContent(),this.mComponent.updater.updateAsync()}),this.invalidateGraphContent()}onDeconstruct(){this.stopDocumentPointerTracking(),this.mUnsubscribe?.(),this.mUnsubscribe=null,this.mKeyboardHandler&&(document.removeEventListener("keydown",this.mKeyboardHandler),this.mKeyboardHandler=null)}onCanvasPointerDown(t){if(this.closeAddNodePopup(),t.button===1){t.preventDefault(),this.mInteractionState={mode:"panning",startX:t.clientX,startY:t.clientY},this.startDocumentPointerTracking();return}if(t.button!==0)return;t.ctrlKey||(this.mSelectedNodes.clear(),this.invalidateNodeVisuals());let e=this.getLocalPointerPosition(t.clientX,t.clientY);this.mInteractionState={mode:"selecting"},this.mSelectionBoxScreen={x1:e.x,x2:e.x,y1:e.y,y2:e.y},this.mShowSelectionBox=!1,this.startDocumentPointerTracking()}onCanvasWheel(t){t.preventDefault();let e=this.getLocalPointerPosition(t.clientX,t.clientY);this.mManager.grid.zoomAt(e.x,e.y,t.deltaY>0?-.1:.1),this.mTransformVersion++}onContextMenu(t){t.preventDefault(),!this.eventPathContainsGraphNode(t)&&this.openAddNodePopupAtPointer(t.clientX,t.clientY)}onNodePointerDown(t,e){for(let m of t.composedPath())if(m instanceof HTMLElement&&m.tagName.toLowerCase()==="potatno-port")return;if(t.stopPropagation(),this.closeAddNodePopup(),t.button!==0)return;t.ctrlKey?this.mSelectedNodes.has(e)?this.mSelectedNodes.delete(e):this.mSelectedNodes.add(e):this.mSelectedNodes.has(e)||(this.mSelectedNodes.clear(),this.mSelectedNodes.add(e)),this.invalidateNodeVisuals();let o=this.mManager.grid.gridSize,c=new Map;for(let m of this.mSelectedNodes)c.set(m,{originX:m.transformation.x*o,originY:m.transformation.y*o});this.mInteractionState={mode:"dragging-node",origins:c,startX:t.clientX,startY:t.clientY},this.startDocumentPointerTracking()}onNodeResizeStart(t){this.closeAddNodePopup(),this.mInteractionState={mode:"resizing-comment",node:t.value.node,originalH:t.value.node.transformation.height,originalW:t.value.node.transformation.width,startX:t.value.startX,startY:t.value.startY},this.startDocumentPointerTracking()}onAddNodePopupNodeSelect(t){this.insertNodeFromAddPopup(t.value)}onAddNodePopupClose(){this.closeAddNodePopup()}onDocumentPointerMove(t){let e=this.mInteractionState;if(e.mode==="panning"){this.mManager.grid.pan(t.clientX-e.startX,t.clientY-e.startY),e.startX=t.clientX,e.startY=t.clientY,this.mTransformVersion++;return}if(e.mode==="dragging-node"){this.dragSelectedNodes(t,e);return}if(e.mode==="selecting"){let o=this.getLocalPointerPosition(t.clientX,t.clientY);this.mSelectionBoxScreen={x1:this.mSelectionBoxScreen.x1,x2:o.x,y1:this.mSelectionBoxScreen.y1,y2:o.y},this.mShowSelectionBox=Math.abs(this.mSelectionBoxScreen.x2-this.mSelectionBoxScreen.x1)>5||Math.abs(this.mSelectionBoxScreen.y2-this.mSelectionBoxScreen.y1)>5;return}if(e.mode==="resizing-comment"){let o=this.mManager.grid.gridSize,c=(t.clientX-e.startX)/this.mManager.grid.zoom,m=(t.clientY-e.startY)/this.mManager.grid.zoom;this.mManager.graph.transformNode(e.node,{width:e.originalW+Math.round(c/o),height:e.originalH+Math.round(m/o)}),this.rebuildVisibleNodePositions();return}}onDocumentPointerUp(){this.mInteractionState.mode==="selecting"&&(this.mShowSelectionBox=!1,this.selectNodesInBox()),this.mInteractionState={mode:"idle"},this.stopDocumentPointerTracking()}onKeyDown(t){if(!this.isTextEditingActive()){if(t.key==="Escape"&&this.mAddNodePopup&&this.closeAddNodePopup(),t.key==="Delete"){this.deleteSelectedNodes();return}if(t.ctrlKey&&t.key==="z"){t.preventDefault(),t.shiftKey?this.mManager.history.redo():this.mManager.history.undo();return}if(t.ctrlKey&&t.key==="y"){t.preventDefault(),this.mManager.history.redo();return}if(t.ctrlKey&&t.key==="c"){this.mManager.clipboard.copy(this.mSelectedNodes);return}t.ctrlKey&&t.key==="v"&&(t.preventDefault(),this.pasteFromClipboard())}}addCommentContainedNodeOrigins(t,e){let o=this.mManager.activeFunction;if(!o)return;let c=this.mManager.grid.gridSize,m=t.transformation.x*c,v=t.transformation.y*c,y=m+t.transformation.width*c,T=v+t.transformation.height*c;for(let S of o.nodes){if(S===t||this.mSelectedNodes.has(S))continue;let l=S.transformation.x*c,n=S.transformation.y*c;l>=m&&l<=y&&n>=v&&n<=T&&e.set(S,{originX:l,originY:n})}}closeAddNodePopup(){this.mAddNodePopup=null}calculateNodeGridHeight(t){return 1+Math.max(t.inputs.list.length,t.outputs.list.length,1)}deleteSelectedNodes(){for(let t of this.mSelectedNodes)this.mManager.graph.removeNode(t);this.mSelectedNodes.clear()}dragSelectedNodes(t,e){let o=this.mManager.grid.zoom,c=this.mManager.grid.gridSize,m=(t.clientX-e.startX)/o,v=(t.clientY-e.startY)/o;for(let[y,T]of e.origins){let S=this.mManager.grid.snapToGrid(T.originX+m,T.originY+v);this.mManager.graph.transformNode(y,{x:Math.round(S.x/c),y:Math.round(S.y/c)})}this.rebuildVisibleNodePositions()}eventPathContainsGraphNode(t){for(let e of t.composedPath())if(e instanceof HTMLElement&&e.tagName.toLowerCase()==="potatno-node")return!0;return!1}getCanvasWrapperOrNull(){try{return this.canvasWrapper}catch{return null}}getLocalPointerPosition(t,e){let o=this.getCanvasWrapperOrNull();if(!o)return{x:0,y:0};let c=o.getBoundingClientRect();return{x:t-c.left,y:e-c.top}}invalidateGraphContent(){this.rebuildGraphData()}invalidateNodeVisuals(){this.rebuildGraphData()}insertNodeAt(t,e){if(!this.mManager.activeFunction)return;let o=this.mManager.grid.gridSize,c=this.mManager.grid.snapToGrid(e.x,e.y),m=this.mManager.graph.addNode(this.mManager.activeFunction,t,{x:Math.round(c.x/o),y:Math.round(c.y/o),height:0,width:0});this.mSelectedNodes.clear(),this.mSelectedNodes.add(m),this.closeAddNodePopup()}insertNodeFromAddPopup(t){let e=this.mAddNodePopup;e&&this.insertNodeAt(t,{x:e.worldX,y:e.worldY})}isTextEditingActive(){let t=document.activeElement;return t instanceof HTMLInputElement||t instanceof HTMLTextAreaElement||t instanceof HTMLSelectElement}openAddNodePopupAtPointer(t,e){let o=this.getCanvasWrapperOrNull(),c=this.getLocalPointerPosition(t,e),m=this.mManager.grid.screenToWorld(c.x,c.y),v=280,y=320,T=Math.max(0,(o?.clientWidth??v)-v-8),S=Math.max(0,(o?.clientHeight??y)-y-8);this.mAddNodePopup={screenX:Math.max(8,Math.min(c.x,T)),screenY:Math.max(8,Math.min(c.y,S)),worldX:m.x,worldY:m.y}}pasteFromClipboard(){if(!this.mManager.activeFunction)return;let e=this.mManager.clipboard.paste();if(e.length!==0){this.mSelectedNodes.clear();for(let o of e)this.mSelectedNodes.add(o)}}rebuildGraphData(){let t=[],e=this.mManager.activeFunction;if(e){let o=this.mManager.grid.gridSize;for(let c of e.nodes){let m=Math.max(c.transformation.height,this.calculateNodeGridHeight(c));t.push({node:c,pixelH:m*o,pixelW:c.transformation.width*o,pixelX:c.transformation.x*o,pixelY:c.transformation.y*o,selected:this.mSelectedNodes.has(c)})}}this.mCachedGraphData={visibleNodes:t}}rebuildVisibleNodePositions(){let t=this.mManager.grid.gridSize;this.mCachedGraphData={visibleNodes:this.mCachedGraphData.visibleNodes.map(e=>({node:e.node,pixelH:Math.max(e.node.transformation.height,this.calculateNodeGridHeight(e.node))*t,pixelW:e.node.transformation.width*t,pixelX:e.node.transformation.x*t,pixelY:e.node.transformation.y*t,selected:e.selected}))}}resetForActiveFunction(){this.mInteractionState={mode:"idle"},this.mSelectedNodes.clear(),this.stopDocumentPointerTracking(),this.closeAddNodePopup()}selectNodesInBox(){let t=this.mManager.activeFunction;if(!t)return;let e=this.mManager.grid.screenToWorld(Math.min(this.mSelectionBoxScreen.x1,this.mSelectionBoxScreen.x2),Math.min(this.mSelectionBoxScreen.y1,this.mSelectionBoxScreen.y2)),o=this.mManager.grid.screenToWorld(Math.max(this.mSelectionBoxScreen.x1,this.mSelectionBoxScreen.x2),Math.max(this.mSelectionBoxScreen.y1,this.mSelectionBoxScreen.y2)),c=this.mManager.grid.gridSize;for(let m of t.nodes){let v=m.transformation.x*c,y=m.transformation.y*c,T=v+m.transformation.width*c,S=y+m.transformation.height*c;v<o.x&&T>e.x&&y<o.y&&S>e.y&&this.mSelectedNodes.add(m)}this.invalidateNodeVisuals()}startDocumentPointerTracking(){this.stopDocumentPointerTracking(),this.mDocumentPointerMoveHandler=t=>this.onDocumentPointerMove(t),this.mDocumentPointerUpHandler=()=>this.onDocumentPointerUp(),document.addEventListener("pointermove",this.mDocumentPointerMoveHandler),document.addEventListener("pointerup",this.mDocumentPointerUpHandler)}stopDocumentPointerTracking(){this.mDocumentPointerMoveHandler&&(document.removeEventListener("pointermove",this.mDocumentPointerMoveHandler),this.mDocumentPointerMoveHandler=null),this.mDocumentPointerUpHandler&&(document.removeEventListener("pointerup",this.mDocumentPointerUpHandler),this.mDocumentPointerUpHandler=null)}static{Mn()}};var Yn=`:host {\r
    display: flex;\r
    flex-direction: column;\r
    height: 100%;\r
    overflow: hidden;\r
}\r
\r
.properties-header {\r
    padding: 10px 12px;\r
    font-family: var(--potatno-font-family);\r
    font-size: var(--potatno-font-size-big);\r
    font-weight: 600;\r
    color: var(--potatno-color-text);\r
    border-bottom: 1px solid var(--potatno-color-border);\r
    background: var(--potatno-color-background-dark);\r
    flex-shrink: 0;\r
}\r
\r
.properties-content {\r
    flex: 1;\r
    overflow-y: auto;\r
    overflow-x: hidden;\r
    padding: 8px 0;\r
\r
    scrollbar-color: var(--potatno-color-scrollbar-thumb) var(--potatno-color-scrollbar-track);\r
    scrollbar-width: thin;\r
}\r
\r
.section {\r
    padding: 8px 12px;\r
    border-bottom: 1px solid var(--potatno-color-border);\r
}\r
\r
.section:last-child {\r
    border-bottom: none;\r
}\r
\r
.section-label {\r
    font-family: var(--potatno-font-family);\r
    font-size: var(--potatno-font-size-small);\r
    color: var(--pn-text-muted);\r
    text-transform: uppercase;\r
    letter-spacing: 0.5px;\r
    margin-bottom: 6px;\r
}\r
\r
.name-input {\r
    width: 100%;\r
    background: var(--potatno-color-background-light);\r
    border: 1px solid var(--potatno-color-border);\r
    border-radius: 4px;\r
    color: var(--potatno-color-accent);\r
    font-family: var(--potatno-font-family);\r
    font-size: var(--potatno-font-size);\r
    padding: 5px 8px;\r
    outline: none;\r
    transition: border-color 0.15s;\r
    box-sizing: border-box;\r
}\r
\r
.name-input:focus {\r
    border-color: var(--potatno-color-accent);\r
}\r
\r
.name-input:invalid {\r
    border-color: var(--potatno-color-error);\r
    outline-color: var(--potatno-color-error);\r
}\r
\r
.name-input:disabled {\r
    color: var(--pn-text-muted);\r
    background: var(--potatno-color-background-dark);\r
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
    background: var(--potatno-color-background-light);\r
    border: 1px solid var(--potatno-color-border);\r
    border-radius: 4px;\r
    color: var(--potatno-color-text);\r
    font-family: var(--potatno-font-family);\r
    font-size: var(--potatno-font-size-small);\r
    padding: 4px 6px;\r
    outline: none;\r
    transition: border-color 0.15s;\r
    min-width: 0;\r
}\r
\r
.port-name-input:focus {\r
    border-color: var(--potatno-color-accent);\r
}\r
\r
.port-name-input:invalid {\r
    border-color: var(--potatno-color-error);\r
    outline-color: var(--potatno-color-error);\r
}\r
\r
.port-name-input:disabled {\r
    color: var(--pn-text-muted);\r
    background: var(--potatno-color-background-dark);\r
    cursor: not-allowed;\r
}\r
\r
.port-type-input {\r
    width: 70px;\r
    background: var(--potatno-color-background-light);\r
    border: 1px solid var(--potatno-color-border);\r
    border-radius: 4px;\r
    color: var(--potatno-color-text);\r
    font-family: var(--potatno-font-family);\r
    font-size: var(--potatno-font-size-small);\r
    padding: 4px 6px;\r
    outline: none;\r
    transition: border-color 0.15s;\r
    flex-shrink: 0;\r
}\r
\r
.port-type-input:focus {\r
    border-color: var(--potatno-color-accent);\r
}\r
\r
.port-type-input:disabled {\r
    color: var(--pn-text-muted);\r
    background: var(--potatno-color-background-dark);\r
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
    font-size: var(--potatno-font-size-small);\r
    cursor: pointer;\r
    flex-shrink: 0;\r
    transition: background 0.1s, color 0.1s;\r
    padding: 0;\r
    line-height: 1;\r
}\r
\r
.port-delete-button:hover {\r
    background: var(--potatno-color-error);\r
    color: var(--potatno-color-text);\r
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
    font-family: var(--potatno-font-family);\r
    font-size: var(--potatno-font-size-small);\r
    color: var(--potatno-color-text);\r
    padding: 4px 6px;\r
    overflow: hidden;\r
    text-overflow: ellipsis;\r
    white-space: nowrap;\r
}\r
\r
.import-select {\r
    flex: 1;\r
    background: var(--potatno-color-background-light);\r
    border: 1px solid var(--potatno-color-border);\r
    border-radius: 4px;\r
    color: var(--potatno-color-text);\r
    font-family: var(--potatno-font-family);\r
    font-size: var(--potatno-font-size-small);\r
    padding: 4px 6px;\r
    outline: none;\r
    transition: border-color 0.15s;\r
    min-width: 0;\r
}\r
\r
.import-select:focus {\r
    border-color: var(--potatno-color-accent);\r
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
    border: 1px dashed var(--potatno-color-border);\r
    border-radius: 4px;\r
    color: var(--potatno-color-text);\r
    font-family: var(--potatno-font-family);\r
    font-size: var(--potatno-font-size-small);\r
    cursor: pointer;\r
    transition: background 0.15s, border-color 0.15s, color 0.15s;\r
}\r
\r
.add-button:hover {\r
    background: var(--potatno-color-background-light);\r
    border-color: var(--potatno-color-accent);\r
    color: var(--potatno-color-text);\r
}\r
\r
.empty-note {\r
    color: var(--pn-text-muted);\r
    font-family: var(--potatno-font-family);\r
    font-size: var(--potatno-font-size-small);\r
    font-style: italic;\r
    padding: 4px 0;\r
}\r
`;var Wn=`<div class="properties-header">Properties</div>\r
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
`;function Rs(){function f(l,n){return function(a){e(n,"addInitializer"),o(a,"An initializer"),l.push(a)}}function t(l,n,u,a,r,b,g,D,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:g?"#"+n:n,static:b,private:g,metadata:D},d={v:!1};s.addInitializer=f(a,d);var i,h;r===0?g?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return l(w,s)}finally{d.v=!0}}function e(l,n){if(l.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(l,n){if(typeof l!="function")throw new TypeError(n+" must be a function")}function c(l,n){var u=typeof n;if(l===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var a;throw l===0?a="field":l===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function m(l,n,u,a,r,b,g,D,w){var p=u[0],s,d,i;g?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,C;if(typeof p=="function")h=t(p,a,s,D,r,b,g,w,i),h!==void 0&&(c(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h);else for(var P=p.length-1;P>=0;P--){var M=p[P];if(h=t(M,a,s,D,r,b,g,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(I,E){return E};else if(typeof d!="function"){var F=d;d=function(I,E){for(var L=E,R=0;R<F.length;R++)L=F[R].call(I,L);return L}}else{var z=d;d=function(I,E){return z.call(I,E)}}l.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),g?r===1?(l.push(function(I,E){return i.get.call(I,E)}),l.push(function(I,E){return i.set.call(I,E)})):r===2?l.push(i):l.push(function(I,E){return i.call(I,E)}):Object.defineProperty(n,a,s))}function v(l,n,u){for(var a=[],r,b,g=new Map,D=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,C;if(h?(x=l,s=s-5,b=b||[],C=b):(x=l.prototype,r=r||[],C=r),s!==0&&!i){var P=h?D:g,M=P.get(d)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!M&&s>2?P.set(d,s):P.set(d,!0)}m(a,x,p,d,s,h,i,C,u)}}return y(a,r),y(a,b),a}function y(l,n){n&&l.push(function(u){for(var a=0;a<n.length;a++)n[a].call(u);return u})}function T(l,n,u){if(n.length>0){for(var a=[],r=l,b=l.name,g=n.length-1;g>=0;g--){var D={v:!1};try{var w=n[g](r,{kind:"class",name:b,addInitializer:f(a,D),metadata:u})}finally{D.v=!0}w!==void 0&&(c(10,w),r=w)}return[S(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function S(l,n){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,a,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(b===void 0?null:b),D=v(n,u,g);return a.length||S(n,g),{e:D,get c(){return T(n,a,g)}}}}function Jn(f,t,e,o){return(Jn=Rs())(f,t,e,o)}var Kn,Zn,Os;Kn=W({selector:"potatno-panel-properties",template:Wn,style:Yn});var qn=class{static{({c:[Os,Zn]}=Jn(this,[],[Kn]))}constructor(t=O.use($),e=O.use(K)){this.mComponent=t,this.mManager=e,this.mSelectedImportId="",this.mUnsubscribe=null}mComponent;mManager;mSelectedImportId;mUnsubscribe;get availableImports(){return this.mManager.project?.imports.map(t=>({id:t.id,label:t.label}))??[]}get availableTypes(){let t=this.mManager.project;if(!t)return[];let e=new Set;for(let[o]of t.types.types)e.add(o);return[...e].sort()}get functionImportIds(){return[...this.mManager.activeFunction?.imports??[]]}get functionImports(){let t=new Map(this.availableImports.map(e=>[e.id,e]));return this.functionImportIds.map(e=>t.get(e)??{id:e,label:e})}get functionInputs(){return(this.mManager.activeFunction?.inputs??[]).map(t=>({name:t.label,type:t.dataType}))}get functionName(){return this.mManager.activeFunction?.label??""}get functionOutputs(){return(this.mManager.activeFunction?.outputs??[]).map(t=>({name:t.label,type:t.dataType}))}get isSystem(){return this.mManager.activeFunction?.isSystem??!1}get nameDisabled(){return this.isSystem}get importsDisabled(){return this.hasStaticFlag(ot.imports)}get inputsDisabled(){return this.hasStaticFlag(ot.inputs)}get outputsDisabled(){return this.hasStaticFlag(ot.outputs)}get unusedImports(){let t=new Set(this.functionImportIds);return this.availableImports.filter(e=>!t.has(e.id))}onConnect(){this.mUnsubscribe=this.mManager.subscribe(_.Document|_.Function|_.SpecialActiveFunction,()=>{this.mComponent.updater.updateAsync()})}onDeconstruct(){this.mUnsubscribe?.(),this.mUnsubscribe=null}onAddSelectedImport(){let t=this.unusedImports,e=this.mSelectedImportId||(t.length>0?t[0].id:"");e&&(this.mManager.updateFunctionProperties({imports:[...this.functionImportIds,e]}),this.mSelectedImportId="")}onAddInput(){let t=this.availableTypes.length>0?this.availableTypes[0]:"number";this.mManager.updateFunctionProperties({inputs:[...this.functionInputs,{name:this.uniquePortName("new_input"),type:t}]})}onAddOutput(){let t=this.availableTypes.length>0?this.availableTypes[0]:"number";this.mManager.updateFunctionProperties({outputs:[...this.functionOutputs,{name:this.uniquePortName("new_output"),type:t}]})}onDeleteImport(t){let e=[...this.functionImportIds];e.splice(t,1),this.mManager.updateFunctionProperties({imports:e})}onDeleteInput(t){let e=[...this.functionInputs];e.splice(t,1),this.mManager.updateFunctionProperties({inputs:e})}onDeleteOutput(t){let e=[...this.functionOutputs];e.splice(t,1),this.mManager.updateFunctionProperties({outputs:e})}onImportSelectChange(t){this.mSelectedImportId=t.target.value}onInputNameChange(t,e){let o=e.target,c=o.value,m=!this.validateName(c)||this.isNameDuplicate(c,"input",t);o.style.borderColor=m?"var(--potatno-color-error)":"";let v=[...this.functionInputs];v[t]={...v[t],name:c},this.mManager.updateFunctionProperties({inputs:v})}onInputTypeChange(t,e){let o=e.target.value,c=[...this.functionInputs];c[t]={...c[t],type:o},this.mManager.updateFunctionProperties({inputs:c})}onNameChange(t){let e=t.target,o=e.value,c=!this.validateName(o)||this.isNameDuplicate(o,"function");e.style.borderColor=c?"var(--potatno-color-error)":"",this.mManager.updateFunctionProperties({name:o})}onOutputNameChange(t,e){let o=e.target,c=o.value,m=!this.validateName(c)||this.isNameDuplicate(c,"output",t);o.style.borderColor=m?"var(--potatno-color-error)":"";let v=[...this.functionOutputs];v[t]={...v[t],name:c},this.mManager.updateFunctionProperties({outputs:v})}onOutputTypeChange(t,e){let o=e.target.value,c=[...this.functionOutputs];c[t]={...c[t],type:o},this.mManager.updateFunctionProperties({outputs:c})}isNameDuplicate(t,e,o){if(e!=="function"&&t===this.functionName)return!0;let c=this.functionInputs;for(let v=0;v<c.length;v++)if(!(e==="input"&&v===o)&&c[v].name===t)return!0;let m=this.functionOutputs;for(let v=0;v<m.length;v++)if(!(e==="output"&&v===o)&&m[v].name===t)return!0;return!1}hasStaticFlag(t){let e=this.mManager.activeFunction;if(!e)return!0;let o=e.project.getFunction(e.definitionId);return o?(o.statics&t)!==0:!0}uniquePortName(t){if(!this.isNameDuplicate(t,"function"))return t;let e=2;for(;this.isNameDuplicate(`${t}_${e}`,"function");)e++;return`${t}_${e}`}validateName(t){return/^[a-zA-Z][a-zA-Z0-9_]*$/.test(t)}static{Zn()}};var st=class{static MAIN="MAIN";mBuild;mDefaultParameters;mFunction;mTypes;get defaultParameters(){return this.mDefaultParameters}get function(){return this.mFunction}get types(){return this.mTypes}constructor(t,e){this.mFunction=t,this.mDefaultParameters=e.defaultParameters,this.mTypes=new Set(e.types),this.mBuild=e.build}compile(t,e){return this.mBuild({defaultParameters:this.mDefaultParameters,function:this.mFunction,projectTypes:t.entryPoint.function.project.types},t,e)}};var Qn=`:host {\r
    display: block;\r
    position: relative;\r
}\r
\r
.container {\r
    display: flex;\r
    flex-direction: column;\r
\r
    box-sizing: border-box;\r
    height: 100%;\r
    width: 100%;\r
\r
    /* Adjust for handle width */\r
    &.top {\r
        padding-top: 2px;\r
    }\r
\r
    &.right {\r
        padding-right: 2px;\r
    }\r
\r
    &.bottom {\r
        padding-bottom: 2px;\r
    }\r
\r
    &.left {\r
        padding-left: 2px;\r
    }\r
}\r
\r
.resize-handle {\r
    position: absolute;\r
    transition: border-color 0.15s;\r
\r
    /*\r
     * General handle size and cursor for any direction.\r
     */\r
\r
    &.corner {\r
        /* Handle size */\r
        width: 10px;\r
        height: 10px;\r
\r
        &.top.left,\r
        &.bottom.right {\r
            cursor: nwse-resize;\r
        }\r
\r
        &.top.right,\r
        &.bottom.left {\r
            cursor: nesw-resize;\r
        }\r
    }\r
\r
    &.vertical {\r
        /* Size by spanning top and bottom instead of height */\r
        top: 0px;\r
        bottom: 0px;\r
\r
        /* Handle size */\r
        width: 10px;\r
\r
        cursor: ew-resize;\r
\r
        &.hasPrevious {\r
            top: 15px;\r
        }\r
\r
        &.hasNext {\r
            bottom: 15px;\r
        }\r
    }\r
\r
    &.horizontal {\r
        /* Size by spanning left and right instead of height */\r
        left: 0px;\r
        right: 0px;\r
\r
        /* Handle size */\r
        height: 10px;\r
\r
        cursor: ns-resize;\r
\r
        &.hasPrevious {\r
            left: 15px;\r
        }\r
\r
        &.hasNext {\r
            right: 15px;\r
        }\r
    }\r
\r
    /*\r
     * Move border into direction.\r
     */\r
\r
    &.top {\r
        top: 0px;\r
        border-top: 2px solid color-mix(in srgb, var(--potatno-color-text) 30%, var(--potatno-color-background));\r
    }\r
\r
    &.right {\r
        right: 0px;\r
        border-right: 2px solid color-mix(in srgb, var(--potatno-color-text) 30%, var(--potatno-color-background));\r
    }\r
\r
    &.bottom {\r
        bottom: 0px;\r
        border-bottom: 2px solid color-mix(in srgb, var(--potatno-color-text) 30%, var(--potatno-color-background));\r
    }\r
\r
    &.left {\r
        left: 0px;\r
        border-left: 2px solid color-mix(in srgb, var(--potatno-color-text) 30%, var(--potatno-color-background));\r
    }\r
\r
    /*\r
     * Just animations.\r
     */\r
\r
    &:hover {\r
        border-color: var(--potatno-color-accent);\r
    }\r
}`;var kn=`<!-- In order of top-left clockwise. Needed for styling -->
$if(this.top && this.left) {
    <div class="resize-handle corner top left" (pointerdown)="this.resizeCorner($event)"></div>
}
$if(this.top) {
    <div class="resize-handle horizontal top {{this.left ? 'hasPrevious' : ''}} {{this.right ? 'hasNext' : ''}}" (pointerdown)="this.resizeHorizontal($event)"></div>
}
$if(this.top && this.right) {
    <div class="resize-handle corner top right" (pointerdown)="this.resizeCorner($event)"></div>
}
$if(this.right) {
    <div class="resize-handle vertical right {{this.top ? 'hasPrevious' : ''}} {{this.bottom ? 'hasNext' : ''}}" (pointerdown)="this.resizeVertical($event)"></div>
}
$if(this.bottom && this.right) {
    <div class="resize-handle corner bottom right" (pointerdown)="this.resizeCorner($event)"></div>
}
$if(this.bottom) {
    <div class="resize-handle horizontal bottom {{this.left ? 'hasPrevious' : ''}} {{this.right ? 'hasNext' : ''}}" (pointerdown)="this.resizeHorizontal($event)"></div>
}
$if(this.bottom && this.left) {
    <div class="resize-handle corner bottom left" (pointerdown)="this.resizeCorner($event)"></div>
}
$if(this.left) {
    <div class="resize-handle vertical left {{this.top ? 'hasPrevious' : ''}} {{this.bottom ? 'hasNext' : ''}}" (pointerdown)="this.resizeVertical($event)"></div>
}

<div class="container {{this.top ? 'top ' : ''}}{{this.bottom ? 'bottom ' : ''}}{{this.left ? 'left ' : ''}}{{this.right ? 'right' : ''}}">
    $slot
</div>
`;function js(){function f(l,n){return function(a){e(n,"addInitializer"),o(a,"An initializer"),l.push(a)}}function t(l,n,u,a,r,b,g,D,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:g?"#"+n:n,static:b,private:g,metadata:D},d={v:!1};s.addInitializer=f(a,d);var i,h;r===0?g?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return l(w,s)}finally{d.v=!0}}function e(l,n){if(l.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(l,n){if(typeof l!="function")throw new TypeError(n+" must be a function")}function c(l,n){var u=typeof n;if(l===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var a;throw l===0?a="field":l===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function m(l,n,u,a,r,b,g,D,w){var p=u[0],s,d,i;g?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,C;if(typeof p=="function")h=t(p,a,s,D,r,b,g,w,i),h!==void 0&&(c(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h);else for(var P=p.length-1;P>=0;P--){var M=p[P];if(h=t(M,a,s,D,r,b,g,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(I,E){return E};else if(typeof d!="function"){var F=d;d=function(I,E){for(var L=E,R=0;R<F.length;R++)L=F[R].call(I,L);return L}}else{var z=d;d=function(I,E){return z.call(I,E)}}l.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),g?r===1?(l.push(function(I,E){return i.get.call(I,E)}),l.push(function(I,E){return i.set.call(I,E)})):r===2?l.push(i):l.push(function(I,E){return i.call(I,E)}):Object.defineProperty(n,a,s))}function v(l,n,u){for(var a=[],r,b,g=new Map,D=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,C;if(h?(x=l,s=s-5,b=b||[],C=b):(x=l.prototype,r=r||[],C=r),s!==0&&!i){var P=h?D:g,M=P.get(d)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!M&&s>2?P.set(d,s):P.set(d,!0)}m(a,x,p,d,s,h,i,C,u)}}return y(a,r),y(a,b),a}function y(l,n){n&&l.push(function(u){for(var a=0;a<n.length;a++)n[a].call(u);return u})}function T(l,n,u){if(n.length>0){for(var a=[],r=l,b=l.name,g=n.length-1;g>=0;g--){var D={v:!1};try{var w=n[g](r,{kind:"class",name:b,addInitializer:f(a,D),metadata:u})}finally{D.v=!0}w!==void 0&&(c(10,w),r=w)}return[S(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function S(l,n){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,a,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(b===void 0?null:b),D=v(n,u,g);return a.length||S(n,g),{e:D,get c(){return T(n,a,g)}}}}function ni(f,t,e,o){return(ni=js())(f,t,e,o)}var ii,ti,si,ei,ri,mr;ii=W({selector:"potatno-resize-box",template:kn,style:Qn}),si=B.state({proxy:!0});var oi=class{static{({e:[ei,ri],c:[mr,ti]}=ni(this,[[si,1,"enabledDirections"],[rt,3,"bottom"],[rt,3,"left"],[rt,3,"right"],[rt,3,"top"]],[ii]))}constructor(t=O.use($)){this.mComponentElement=t.element,this.enabledDirections={top:!1,right:!1,bottom:!1,left:!1}}mComponentElement;#t=(ri(this),ei(this));get enabledDirections(){return this.#t}set enabledDirections(t){this.#t=t}get bottom(){return this.enabledDirections.bottom}set bottom(t){this.enabledDirections.bottom=this.parseBoolean(t)}get left(){return this.enabledDirections.left}set left(t){this.enabledDirections.left=this.parseBoolean(t)}get right(){return this.enabledDirections.right}set right(t){this.enabledDirections.right=this.parseBoolean(t)}get top(){return this.enabledDirections.top}set top(t){this.enabledDirections.top=this.parseBoolean(t)}resizeCorner(t){this.handleResize(t,"both")}resizeHorizontal(t){this.handleResize(t,"horizontal")}resizeVertical(t){this.handleResize(t,"vertical")}handleResize(t,e){t.preventDefault(),t.stopPropagation();let o=this.mComponentElement.getBoundingClientRect(),c=o.width,m=o.height,v=t.clientX,y=t.clientY,T=1;Math.abs(v-o.left)<Math.abs(v-o.right)&&(T=-1);let S=1;Math.abs(y-o.top)<Math.abs(y-o.bottom)&&(S=-1);let l=u=>{let a=(u.clientX-v)*T,r=(u.clientY-y)*S,b=c+a,g=m+r;e==="horizontal"&&(b=c),e==="vertical"&&(g=m),this.updateComponentSize(b,g)},n=()=>{document.removeEventListener("pointermove",l),document.removeEventListener("pointerup",n)};document.addEventListener("pointermove",l),document.addEventListener("pointerup",n)}parseBoolean(t){return!!(()=>{if(typeof t=="string"){let o=t.toLowerCase();if(["true","false"].includes(o))return o==="true"}return t})()}updateComponentSize(t,e){(this.enabledDirections.left||this.enabledDirections.right)&&this.mComponentElement.style.setProperty("width",`${t}px`),(this.enabledDirections.top||this.enabledDirections.bottom)&&this.mComponentElement.style.setProperty("height",`${e}px`)}static{ti()}};var ai=`:host {\r
    /* Somehow this needs to be flex or we get an nasty overflow. */\r
    display: flex;\r
    flex-direction: column;\r
}\r
\r
.resize-box {\r
    /* Set min sizes to restrict resizing. */\r
    min-height: 150px;\r
    min-width: 200px;\r
\r
    /* Globaly restrict to max size of parent. */\r
    max-width: 100%;\r
    max-height: 100%;\r
\r
    background: var(--potatno-color-background);\r
    border: 1px solid var(--potatno-color-border);\r
    border-width: 0 1px 1px 0;\r
    box-shadow: 0 4px 12px var(--potatno-color-shadow);\r
}\r
\r
.header {\r
    display: flex;\r
    align-items: center;\r
    justify-content: space-between;\r
    border-bottom: 1px solid var(--potatno-color-border);\r
    background: var(--potatno-color-background-light);\r
    overflow: hidden;\r
\r
    .header__tabs {\r
        display: flex;\r
\r
        /* Cascaded into childs. */\r
        font-family: var(--potatno-font-family);\r
        font-size: var(--potatno-font-size-small);\r
        text-transform: uppercase;\r
        color: var(--potatno-color-text);\r
\r
        .tab {\r
            --tab-selected-color: color-mix(in srgb, var(--potatno-color-accent) 25%, transparent);\r
            --tab-selected-background: linear-gradient(1deg, var(--tab-selected-color) 0%, transparent 45%);\r
\r
            margin: 3px;\r
            padding: 7px 15px 7px 15px;\r
            border-radius: 2px;\r
            cursor: pointer;\r
            \r
            &:hover {\r
                background: var(--tab-selected-background);\r
            }\r
\r
            &:active {\r
                background: var(--tab-selected-color);\r
            }\r
\r
            &.selected {\r
                background: var(--tab-selected-color);\r
\r
                /* The background gets lighter, the color should too. */\r
                color: color-mix(in srgb, var(--potatno-color-text) 75%, #fff);\r
            }\r
\r
            &.tab--error {\r
                color: var(--potatno-color-error);\r
            }\r
        }\r
    }\r
\r
    .header__selectors {\r
        display: flex;\r
        gap: 6px;\r
        padding: 0px 12px;\r
\r
        >select {\r
            padding: 4px 8px;\r
\r
            font-family: var(--potatno-font-family);\r
            font-size: var(--potatno-font-size-small);\r
\r
            background: var(--potatno-color-background-light);\r
            color: var(--potatno-color-text);\r
\r
            border: 1px solid var(--potatno-color-border);\r
            border-radius: 3px;\r
        }\r
    }\r
}\r
\r
.content {\r
    flex: 1;\r
    padding: 4px;\r
    background: var(--potatno-color-background);\r
    overflow: auto;\r
\r
    scrollbar-color: var(--potatno-color-scrollbar-thumb) var(--potatno-color-scrollbar-track);\r
    scrollbar-width: thin;\r
}\r
\r
.error-item {\r
    display: flex;\r
    align-items: stretch;\r
    padding: 5px;\r
\r
    .error-item__icon {\r
        display: flex;\r
        align-items: center;\r
\r
        color: var(--potatno-color-error);\r
        font-size: 18px;\r
        font-weight: bold;\r
        padding: 0 10px 0 10px;\r
\r
        border-left: 3px solid var(--potatno-color-error);\r
    }\r
\r
    .error-item__content {\r
        flex: 1;\r
    }\r
\r
    .error-item__message {\r
        color: var(--potatno-color-text);\r
        font-size: var(--potatno-font-size);\r
    }\r
\r
    .error-item__location {\r
        font-size: var(--potatno-font-size-small);\r
        margin-top: 2px;\r
\r
        /* Darken text color by mixing in the background color */\r
        color: color-mix(in srgb, var(--potatno-color-text) 50%, var(--potatno-color-background));\r
    }\r
}`;var li=`<potatno-resize-box class="resize-box" left="true" top="true">
    <div class="header">
        $if(this.errors.length > 0) {
            <div class="header__tabs">
                <div class="tab tab--error selected">Errors ({{this.errors.length}})</div>
            </div>
        }

        $if(this.errors.length === 0) {
            <div class="header__tabs">
                <div class="tab {{ this.selectedTab === 'preview' ? 'selected' : '' }}" (click)="this.selectedTab = 'preview'">Preview</div>
                <div class="tab {{ this.selectedTab === 'code' ? 'selected' : '' }}" (click)="this.selectedTab = 'code'">Code</div>
            </div>
            <div class="header__selectors">

                $if(this.displayOptions.size > 0) {
                    <select class="preview-select" (change)="this.selectedDisplayId = $event.target.value">
                        $for(display of this.displayOptions) {
                            <option [value]="this.display[0]" [selected]="this.display[0] === this.selectedDisplayId">{{this.display[1]}}</option>
                        }
                    </select>
                }

                $if(this.outputOptions.size > 0) {
                    <select class="preview-select" (change)="this.selectedOutputId = $event.target.value">
                        $for(output of this.outputOptions) {
                            <option [value]="this.output[0]" [selected]="this.output[0] === this.selectedOutputId">{{this.output[1].label}}</option>
                        }
                    </select>
                }

            </div>
        }
    </div>

    <div class="content">
        $if(this.errors.length > 0) {
            $for(error of this.errors) {
                <div class="error-item">
                    <div class="error-item__icon">!</div>
                    <div class="error-item__content">
                        <div class="error-item__message">{{this.error.message}}</div>
                        <div class="error-item__location">{{this.error.location}}</div>
                    </div>
                </div>
            }
        }

        $if(this.errors.length === 0) {
            $if(this.selectedTab === 'preview') {
                <div class="content__preview-display" potatno-preview="this.previewDriver"></div>
            }

            $if(this.selectedTab === 'code') {
                <div class="content__preview-code">
                    <pre><code>{{ this.previewCode }}</code></pre>
                </div>
            }
        }
    </div>
    
</potatno-resize-box>
`;var te=class f extends ut{static DEFINITION_ID="23e9319b-3b62-4dd8-858a-17d97ddee94e";constructor(){super({id:f.DEFINITION_ID,label:"Flow Conjunction",category:{name:"Conjunction",icon:"\u25C7"},generators:{ports:{inputs:t=>{t({label:"in",id:"in",portType:"flow"})},outputs:t=>{t({label:"out",id:"out",portType:"flow"})}},code:()=>{throw new A("Conjunction node code generators should never be called.",f)}}})}};var ee=class f extends ut{static DEFINITION_ID="a579584d-5d35-42b5-b2ba-3daddee488e0";constructor(){super({id:f.DEFINITION_ID,label:"Value Conjunction",category:{name:"Conjunction",icon:"\u25C7"},generators:{ports:{inputs:t=>{t({label:"in",id:"in",portType:"value",dataType:"<T>"})},outputs:t=>{t({label:"out",id:"out",portType:"value",dataType:"<T>"})}},code:()=>{throw new A("Conjunction node code generators should never be called.",f)}}})}};var Ye=class{mDependencies;mDocument;mEntryPoint;get code(){return this.mDocument.project.generator.code(this)}get dependencies(){return this.mDependencies}get entryPoint(){return this.mEntryPoint}constructor(t,e,o){this.mDocument=t,this.mEntryPoint=e,this.mDependencies=o}};var We=class{mFunction;mGraphs;get code(){let t=this.mFunction.project.getFunction(this.mFunction.definitionId);if(!t)throw new A("Function result has an invalid function definition id.",this);return t.codeGenerator.body(this)}get function(){return this.mFunction}get graphs(){return Array.from(this.mGraphs.values())}constructor(t){this.mFunction=t,this.mGraphs=new Map}addGraph(t){this.mGraphs.set(t.entryNode.definitionId,t)}graphResultOf(t){return this.mGraphs.get(t)}};var Ze=class{mBodyCode;mDependencies;mEntryNode;mExitNode;mNodeIds;mPorts;get code(){return this.mBodyCode}get dependencies(){return this.mDependencies}get entryNode(){return this.mEntryNode}get exitNode(){return this.mExitNode}get nodes(){return this.mNodeIds}get ports(){return this.mPorts}constructor(t){this.mBodyCode=t.bodyCode,this.mDependencies=[...t.dependencies],this.mEntryNode=t.entryNode,this.mExitNode=t.exitNode,this.mNodeIds=t.nodeIds,this.mPorts=t.portValues}};var re=class{mProject;constructor(t){this.mProject=t}generateDocument(t,e=!1){let o=[...t.functions].find(c=>c.isSystem);if(!o)throw new A("No entry point function found for code generation.",this);return this.generateFunction(o,e)}generateFunction(t,e=!1){return this.buildDocumentResult(t.document,t.getExitNodes(),e)}generateNode(t,e=!1){return this.buildDocumentResult(t.document,[t],e)}buildDocumentResult(t,e,o){if(t.validate().errors.length>0)throw new A("Code generation exited. Code graph validation failed.",this);let m={counter:{nodeIndex:0,portIndex:0},debug:o,nodeDefinitions:new Map},v=this.generateFunctionWithDependencies(m,e,new Set),y=v.shift();return new Ye(t,y,v)}countNodeEncounter(t,e){let o=new Map,c=new Set,m=new Array(t);for(;m.length>0;){let v=m.pop();if(o.set(v,(o.get(v)??0)+1),!(v===e||c.has(v))){c.add(v);for(let y of v.inputs.flow)for(let T of this.resolveFlowConjunctions(y))m.push(T.node);for(let y of v.inputs.value){let T=this.resolveValueConjunctions(y);T&&m.push(T.node)}}}return o}createScope(t,e){return{emittedNodes:new Set,remaining:this.countNodeEncounter(t,e)}}emitNode(t,e,o,c,m){if(!t.nodeDefinitions.get(o.function)){let a=new Map;for(let r of o.function.nodeDefinitions)a.set(r.id,r);t.nodeDefinitions.set(o.function,a)}let v=t.nodeDefinitions.get(o.function).get(o.definitionId);if(!v)throw new A(`Node definition "${o.definitionId}" not found for node "${o.label}".`,this);v instanceof Mt&&e.dependencies.push(v.function);let y={},T=new Array;for(let a of o.inputs.value){let r=this.resolveInputValue(t,e,a);y[a.definitionId]=r.inputPort,e.ports.set(a,r.inputPort.value),r.emitResult&&T.push(r.emitResult)}let S={};for(let a of o.outputs.list)S[a.definitionId]={value:this.generatePortValue(t,e,a),code:{inner:c[a.definitionId]??""}};let l=v.codeGenerator({inputs:y,outputs:S,code:{next:m??""}}),n=this.getGeneratedNodeId(t,e,o);t.debug&&(l=this.mProject.generator.values.hook(`start-${n}`)+l+this.mProject.generator.values.hook(`end-${n}`));let u=new Array;for(let a of T)u.push(...a.codeOutput);return u.push(l),{codeOutput:u,lastGeneratedNode:o,endFlowPort:null}}findBranchStartPoint(t){let e=this.getNodesInputFlowPorts(t),o=e.length,c=new Map,m=new Array,v=(y,T)=>{let S=(c.has(y)||c.set(y,new Set),c.get(y)),l=S.size;for(let n of T)S.add(n);return S.size>l&&m.push(y),S};for(let[y,T]of e.entries())v(T.node,[y]);for(;m.length>0;){let y=m.shift(),T=c.get(y);for(let S of this.getNodesInputFlowPorts(y))if(v(S.node,T).size===o)return S.node}throw new A("No common branch point found for merge node.",this)}generateFunctionWithDependencies(t,e,o){let c=new Array;if(e.length===0)return c;let m=e.at(0).function;o.add(m);let v=new We(m);c.push(v);for(let y of e){let T=this.generateNodeCode(t,y);v.addGraph(T);for(let S of T.dependencies)o.has(S)||c.push(...this.generateFunctionWithDependencies(t,S.getExitNodes(),o))}return c.reverse()}generateNodeCode(t,e){let o={dependencies:new Array,nodes:new Map,ports:new Map,scope:this.createScope(e,null)},c=this.walkBackward(t,o,e,null),m=c.codeOutput.join(" ");return new Ze({bodyCode:m,dependencies:o.dependencies,entryNode:c.lastGeneratedNode,exitNode:e,nodeIds:new Map(o.nodes),portValues:new Map(o.ports)})}generatePortValue(t,e,o){return e.ports.has(o)||e.ports.set(o,this.mProject.generator.values.valueId(t.counter.portIndex++)),e.ports.get(o)}getGeneratedNodeId(t,e,o){if(!e.nodes.has(o)){let m=(++t.counter.nodeIndex).toString(16).toUpperCase().padStart(8,"0");e.nodes.set(o,m)}return e.nodes.get(o)}getNodesInputFlowPorts(t){let e=new Array;for(let o of t.inputs.flow)e.push(...this.resolveFlowConjunctions(o));return[...new Set(e)]}handleFlowMerge(t,e,o,c,m){let v=m.join(" "),y=this.findBranchStartPoint(o),T={},S=e.scope;try{for(let l of c){e.scope=this.createScope(l.node,y);let n=this.walkBackward(t,e,l.node,y);T[n.endFlowPort.definitionId]=n.codeOutput.join(" ")}}finally{e.scope=S}return this.emitNode(t,e,y,T,v)}resolveFlowConjunctions(t){let e=new Array;for(let o of t.connectedPorts){if(o.node.definitionId!==te.DEFINITION_ID){e.push(o);continue}let c=o.node.inputs.flow[0];!c||c.connectedPorts.size===0||e.push(...this.resolveFlowConjunctions(c))}return e}resolveInputValue(t,e,o){let c=this.resolveValueConjunctions(o);if(!c){if(this.mProject.types.isGenericType(o.dataType))throw new A("Generic value inputs must be allways connected",this);return{inputPort:{value:this.mProject.types.getType(o.dataType).convert([...o.directValue]),isDirectValue:!0},emitResult:null}}let m=c.node,v=!m.hasFlowPorts,y=(()=>{if(!m.hasFlowPorts){if(e.scope.emittedNodes.has(m))return null;let T=e.scope.remaining.get(m);if(v&&(T=0),e.scope.remaining.set(m,T),T<=0)return e.scope.emittedNodes.add(m),this.emitNode(t,e,m,{})}return null})();return{inputPort:{value:this.generatePortValue(t,e,c),isDirectValue:!1},emitResult:y}}resolveValueConjunctions(t){if(t.connectedPorts.size===0)return null;let e=t.connectedPorts.values().next().value;if(e.node.definitionId!==ee.DEFINITION_ID)return e;let o=e.node.inputs.value[0];return!o||o.connectedPorts.size===0?null:this.resolveValueConjunctions(o)}walkBackward(t,e,o,c){let m={codeOutput:new Array,lastGeneratedNode:null,endFlowPort:null},v=null,y=o;for(;y!==null&&y!==c;){let T={};v!==null&&(T[v.definitionId]=m.codeOutput.join(" "),m.codeOutput=new Array);let S=m.codeOutput;m=this.emitNode(t,e,y,T),m.codeOutput=[...m.codeOutput,...S];let l=this.getNodesInputFlowPorts(y);if(l.length===0)break;l.length>1&&(m=this.handleFlowMerge(t,e,y,l,m.codeOutput),l=this.getNodesInputFlowPorts(m.lastGeneratedNode)),v=l[0]??null,y=v?.node??null}if(!m.lastGeneratedNode)throw new A(`Walk did not reach an entry node from exit "${o.label}".`,this);if(c&&y!==c)throw new A("Malformed graph. End node not reached",this);return m.endFlowPort=v,m}};function $s(){function f(l,n){return function(a){e(n,"addInitializer"),o(a,"An initializer"),l.push(a)}}function t(l,n,u,a,r,b,g,D,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:g?"#"+n:n,static:b,private:g,metadata:D},d={v:!1};s.addInitializer=f(a,d);var i,h;r===0?g?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return l(w,s)}finally{d.v=!0}}function e(l,n){if(l.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(l,n){if(typeof l!="function")throw new TypeError(n+" must be a function")}function c(l,n){var u=typeof n;if(l===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var a;throw l===0?a="field":l===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function m(l,n,u,a,r,b,g,D,w){var p=u[0],s,d,i;g?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,C;if(typeof p=="function")h=t(p,a,s,D,r,b,g,w,i),h!==void 0&&(c(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h);else for(var P=p.length-1;P>=0;P--){var M=p[P];if(h=t(M,a,s,D,r,b,g,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(I,E){return E};else if(typeof d!="function"){var F=d;d=function(I,E){for(var L=E,R=0;R<F.length;R++)L=F[R].call(I,L);return L}}else{var z=d;d=function(I,E){return z.call(I,E)}}l.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),g?r===1?(l.push(function(I,E){return i.get.call(I,E)}),l.push(function(I,E){return i.set.call(I,E)})):r===2?l.push(i):l.push(function(I,E){return i.call(I,E)}):Object.defineProperty(n,a,s))}function v(l,n,u){for(var a=[],r,b,g=new Map,D=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,C;if(h?(x=l,s=s-5,b=b||[],C=b):(x=l.prototype,r=r||[],C=r),s!==0&&!i){var P=h?D:g,M=P.get(d)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!M&&s>2?P.set(d,s):P.set(d,!0)}m(a,x,p,d,s,h,i,C,u)}}return y(a,r),y(a,b),a}function y(l,n){n&&l.push(function(u){for(var a=0;a<n.length;a++)n[a].call(u);return u})}function T(l,n,u){if(n.length>0){for(var a=[],r=l,b=l.name,g=n.length-1;g>=0;g--){var D={v:!1};try{var w=n[g](r,{kind:"class",name:b,addInitializer:f(a,D),metadata:u})}finally{D.v=!0}w!==void 0&&(c(10,w),r=w)}return[S(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function S(l,n){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,a,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(b===void 0?null:b),D=v(n,u,g);return a.length||S(n,g),{e:D,get c(){return T(n,a,g)}}}}function gi(f,t,e,o){return(gi=$s())(f,t,e,o)}var vi,ci,yi,bi,wi,xi,ui,hi,di,mi,fi,Gs;vi=W({selector:"potatno-preview",template:li,style:ai,modules:[Te,mr]}),yi=B.state(),bi=B.state(),wi=B.state(),xi=B.state();var pi=class{static{({e:[ui,hi,di,mi,fi],c:[Gs,ci]}=gi(this,[[yi,1,"mSelectedDisplayId"],[bi,1,"mSelectedOutputId"],[wi,1,"selectedTab"],[xi,1,"previewCode"]],[vi]))}constructor(t=O.use($),e=O.use(K)){this.mComponent=t,this.mManager=e,this.mSelectedDisplayId="",this.mSelectedOutputId="",this.selectedTab="preview",this.previewCode="";let o=_.NodeUpdate|_.NodeAdd|_.NodeDelete;this.mPreviewTargets=this.findFunctionPreviewTargets(),this.mUnsubscribeOutputFetch=this.mManager.subscribe(_.SpecialActiveFunction|o,()=>{this.mPreviewTargets=this.findFunctionPreviewTargets()}),this.mUnsubscribeErrorResolve=this.mManager.subscribe(_.SpecialActiveFunction|o|_.Connection,()=>{this.mComponent.updater.updateAsync()});let c=0;this.mManager.subscribe(_.Any,()=>{globalThis.clearTimeout(c),c=globalThis.setTimeout(()=>{this.previewCode=this.generateFunctionCode()},1e3)})}mComponent;mManager;mPreviewTargets;mUnsubscribeErrorResolve;mUnsubscribeOutputFetch;#t=(fi(this),ui(this));get mSelectedDisplayId(){return this.#t}set mSelectedDisplayId(t){this.#t=t}#e=hi(this);get mSelectedOutputId(){return this.#e}set mSelectedOutputId(t){this.#e=t}#r=di(this);get selectedTab(){return this.#r}set selectedTab(t){this.#r=t}#o=mi(this);get previewCode(){return this.#o}set previewCode(t){this.#o=t}get displayOptions(){let t=this.mPreviewTargets.get(this.selectedOutputId);return t?t.displays:new Map}get errors(){return this.mManager.integrity.errors}get outputOptions(){return this.mPreviewTargets}get previewDriver(){let t=this.mPreviewTargets.get(this.selectedOutputId);return t?this.mManager.preview.requestDriver(t.target,this.selectedDisplayId):null}get selectedDisplayId(){let t=this.displayOptions;if(!t.has(this.mSelectedDisplayId)){let e=t.keys().next().value;typeof e<"u"&&(this.mSelectedDisplayId=e)}return this.mSelectedDisplayId}set selectedDisplayId(t){this.mSelectedDisplayId=t}get selectedOutputId(){let t=this.outputOptions;if(!t.has(this.mSelectedOutputId)){let e=t.keys().next().value;typeof e<"u"&&(this.mSelectedOutputId=e)}return this.mSelectedOutputId}set selectedOutputId(t){this.mSelectedOutputId=t}onDeconstruct(){this.mUnsubscribeErrorResolve(),this.mUnsubscribeOutputFetch()}findFunctionPreviewTargets(){let t=new Map;if(!this.mManager.activeFunction)return t;let e=this.mManager.activeFunction,o=e.project.getFunction(e.definitionId);if(!o)return t;let c=y=>{let T=new Map;for(let S of y)T.set(S,e.project.preview.getDisplay(S).name);return T},m=e.project.preview.availableDisplays(o,st.MAIN);m.length>0&&t.set(st.MAIN,{label:st.MAIN,target:e,displays:c(m)});let v=new Map;for(let y of e.getExitNodes())for(let T of y.inputs.value){let S=T.resolvedDataType;v.has(S)||v.set(S,T.project.preview.availableDisplays(o,S));let l=v.get(S);l.length!==0&&t.set(T.definitionId,{label:T.label,target:T,displays:c(l)})}return t}generateFunctionCode(){if(!this.mManager.integrity.isValid||!this.mManager.activeFunction)return"";let t=this.mManager.activeFunction;return new re(t.project).generateFunction(t,!1).code}static{ci()}};function Bs(){function f(l,n){return function(a){e(n,"addInitializer"),o(a,"An initializer"),l.push(a)}}function t(l,n,u,a,r,b,g,D,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:g?"#"+n:n,static:b,private:g,metadata:D},d={v:!1};s.addInitializer=f(a,d);var i,h;r===0?g?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return l(w,s)}finally{d.v=!0}}function e(l,n){if(l.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(l,n){if(typeof l!="function")throw new TypeError(n+" must be a function")}function c(l,n){var u=typeof n;if(l===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var a;throw l===0?a="field":l===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function m(l,n,u,a,r,b,g,D,w){var p=u[0],s,d,i;g?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,C;if(typeof p=="function")h=t(p,a,s,D,r,b,g,w,i),h!==void 0&&(c(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h);else for(var P=p.length-1;P>=0;P--){var M=p[P];if(h=t(M,a,s,D,r,b,g,w,i),h!==void 0){c(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(I,E){return E};else if(typeof d!="function"){var F=d;d=function(I,E){for(var L=E,R=0;R<F.length;R++)L=F[R].call(I,L);return L}}else{var z=d;d=function(I,E){return z.call(I,E)}}l.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),g?r===1?(l.push(function(I,E){return i.get.call(I,E)}),l.push(function(I,E){return i.set.call(I,E)})):r===2?l.push(i):l.push(function(I,E){return i.call(I,E)}):Object.defineProperty(n,a,s))}function v(l,n,u){for(var a=[],r,b,g=new Map,D=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,C;if(h?(x=l,s=s-5,b=b||[],C=b):(x=l.prototype,r=r||[],C=r),s!==0&&!i){var P=h?D:g,M=P.get(d)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!M&&s>2?P.set(d,s):P.set(d,!0)}m(a,x,p,d,s,h,i,C,u)}}return y(a,r),y(a,b),a}function y(l,n){n&&l.push(function(u){for(var a=0;a<n.length;a++)n[a].call(u);return u})}function T(l,n,u){if(n.length>0){for(var a=[],r=l,b=l.name,g=n.length-1;g>=0;g--){var D={v:!1};try{var w=n[g](r,{kind:"class",name:b,addInitializer:f(a,D),metadata:u})}finally{D.v=!0}w!==void 0&&(c(10,w),r=w)}return[S(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function S(l,n){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,a,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(b===void 0?null:b),D=v(n,u,g);return a.length||S(n,g),{e:D,get c(){return T(n,a,g)}}}}function Si(f,t,e,o){return(Si=Bs())(f,t,e,o)}var Ci,Ti,Pi,Di,Ei,fr;Ci=W({selector:"potatno-code-editor",template:vo,style:go}),Pi=ft("panelRight");var Ii=class{static{({e:[Di,Ei],c:[fr,Ti]}=Si(this,[[Pi,1,"panelRight"],[rt,4,"project"],[rt,4,"document"],[rt,2,"triggerPreviewUpdate"]],[Ci]))}constructor(t=O.use($),e=O.use(K)){this.mComponent=t,this.mManager=e,this.mProject=null,this.mResizeMoveHandler=null,this.mResizeState=null,this.mResizeUpHandler=null,this.mUnsubscribe=null}mComponent;mManager;mProject;mResizeMoveHandler;mResizeState;mResizeUpHandler;mUnsubscribe;#t=(Ei(this),Di(this));get panelRight(){return this.#t}set panelRight(t){this.#t=t}get hasPreview(){let t=this.mManager.activeFunction;if(!t)return!1;let e=t.project.getFunction(t.definitionId);return e?t.project.preview.availableDisplays(e).length>0:!1}get document(){return this.mManager.graph.document}set project(t){this.mProject=t}set document(t){this.mProject&&this.mManager.initialize(this.mProject,t)}async triggerPreviewUpdate(){return this.mManager.preview.execute()}onConnect(){this.mUnsubscribe=this.mManager.subscribe(_.Document|_.Function|_.SpecialActiveFunction,()=>{this.mComponent.updater.updateAsync()})}onDeconstruct(){this.mUnsubscribe?.(),this.mUnsubscribe=null,this.stopPanelResize()}onResizeLeftStart(t){t.preventDefault(),this.startPanelResize("left",t)}onResizeRightStart(t){t.preventDefault(),this.startPanelResize("right",t)}startPanelResize(t,e){this.stopPanelResize();let o=t==="left"?this.panelRight:this.panelRight;this.mResizeState={panel:t,startWidth:o.offsetWidth,startX:e.clientX};let c=v=>{if(!this.mResizeState)return;let y=t==="left"?v.clientX-this.mResizeState.startX:this.mResizeState.startX-v.clientX;o.style.width=`${Math.max(200,Math.min(500,this.mResizeState.startWidth+y))}px`},m=()=>{document.removeEventListener("pointermove",c),document.removeEventListener("pointerup",m),this.mResizeMoveHandler=null,this.mResizeState=null,this.mResizeUpHandler=null};this.mResizeMoveHandler=c,this.mResizeUpHandler=m,document.addEventListener("pointermove",c),document.addEventListener("pointerup",m)}stopPanelResize(){this.mResizeMoveHandler&&(document.removeEventListener("pointermove",this.mResizeMoveHandler),this.mResizeMoveHandler=null),this.mResizeUpHandler&&(document.removeEventListener("pointerup",this.mResizeUpHandler),this.mResizeUpHandler=null),this.mResizeState=null}static{Ti()}};var qe=class extends le{mCodeEditor;mProject;get document(){return this.mCodeEditor.document}set document(t){this.mCodeEditor.document=t}get project(){return this.mProject}constructor(t){super(),this.mProject=t,this.addStyle(co),this.addStyle(lo),this.mCodeEditor=this.addContent(fr),this.mCodeEditor.project=t,this.mCodeEditor.document=new Nt(t)}load(t){let e=JSON.parse(t);if(!Array.isArray(e.functions))throw new A("Could not load document. Document has a wrong format.",this);let o=new Jt(this.mProject).deserialize(e);this.document=o}save(){let t=new Kt().serialize(this.document);return JSON.stringify(t)}async update(){return this.mCodeEditor.triggerPreviewUpdate()}};var V=class extends ut{constructor(t){super({id:t.id,label:t.label,category:t.category,regions:t.regions??null,generators:{ports:{inputs:e=>{for(let o of t.ports.inputs)e(o)},outputs:e=>{for(let o of t.ports.outputs)e(o)}},code:t.generators.code}})}};var Je=class{mDisplays;get displayIds(){return[...this.mDisplays.keys()]}constructor(){this.mDisplays=new Map}addDisplay(t){this.mDisplays.set(t.id,t)}availableDisplays(t,e=null){let o=new Array;for(let[c,m]of this.mDisplays)m.executor.function.id===t.id&&(e===null||m.allowsType(e))&&o.push(c);return o}getDisplay(t){return this.mDisplays.get(t)??null}};var Ke=class{mCodeGenerator;mEntryPoint;mImports;mNodeDefinitions;mPreview;mTypes;mUserFunctions;get entryPoint(){return this.mEntryPoint}get generator(){return this.mCodeGenerator}get imports(){return this.mImports}get nodeDefinitions(){return Array.from(this.mNodeDefinitions.values())}get preview(){return this.mPreview}get types(){return this.mTypes}get userFunctions(){return this.mUserFunctions}constructor(t,e,o){this.mTypes=t,this.mCodeGenerator=o.generator,this.mPreview=new Je,this.mNodeDefinitions=new Map,this.mImports=new Array,this.mUserFunctions=new Map,this.mEntryPoint=e,this.addNodeDefinition(new te),this.addNodeDefinition(new ee)}addImport(t){this.mImports.push(t)}addNodeDefinition(t){this.mNodeDefinitions.set(t.id,t)}getFunction(t){return this.mEntryPoint.id===t?this.mEntryPoint:this.mUserFunctions.get(t)}setDynamicFunction(t){this.mUserFunctions.set(t.id,t)}};var Qe=class{mTypes;get typeNames(){return Array.from(this.mTypes.keys())}get types(){return this.mTypes}constructor(t){this.mTypes=new Map;for(let[e,o]of Object.entries(t))this.mTypes.set(e,{name:e,...o})}getDefaultValue(t){return this.getType(t).default.value}getType(t){if(!this.mTypes.has(t))throw new Error(`Type "${t}" is not defined in the project types definition.`);return this.mTypes.get(t)}isGenericType(t){return typeof t!="string"?!1:/^<[^>]+>$/.test(t)}};var ke=class extends Qe{constructor(){super({number:{default:{string:["0"],value:0},convert:t=>{let e=t[0],o=parseFloat(e);if(isNaN(o))throw new Error(`Invalid number: "${e}"`);return o.toString()},inputs:[{name:"value",type:"number"}]},string:{default:{string:[""],value:""},convert:t=>t[0],inputs:[{name:"value",type:"string"}]},boolean:{default:{string:["false"],value:!1},convert:t=>{let e=t[0].toLowerCase();if(e==="true")return"true";if(e==="false")return"false";throw new Error(`Invalid boolean: "${t[0]}"`)},inputs:[{name:"value",type:"boolean"}]}})}};var tr=class extends Qt{constructor(){super({id:"pixelShader",label:"Pixel Shader",statics:ot.inputs|ot.outputs,nodes:{entry:t=>{t(new V({id:"OnPixel",label:"OnPixel",category:{name:"event"},ports:{inputs:[],outputs:[{label:"exec",id:"exec",portType:"flow"},{label:"x",id:"x",portType:"value",dataType:"number"},{label:"y",id:"y",portType:"value",dataType:"number"}]},generators:{code:e=>{let o=e.outputs.x.value,c=e.outputs.y.value;return`(${o}, ${c}) => { ${e.outputs.exec.code.inner} }`}}}))},exit:t=>{t(new V({id:"PixelResult",label:"PixelResult",category:{name:"Output"},ports:{inputs:[{label:"exec",id:"exec",portType:"flow"},{label:"red",id:"red",portType:"value",dataType:"number"},{label:"green",id:"green",portType:"value",dataType:"number"},{label:"blue",id:"blue",portType:"value",dataType:"number"}],outputs:[]},generators:{code:e=>`return [${e.inputs.red.value}, ${e.inputs.green.value}, ${e.inputs.blue.value}];`}}))}},generator:{code:{body:t=>{let e=t.graphResultOf("OnPixel");return`const ${t.function.definitionId} = ${e?.code??"() => [0, 0, 0]"};`},value:t=>`${t.function.definitionId}()`}}})}};var er=class extends Qt{constructor(){super({id:"Helper Function",label:"Helper Function",statics:ot.none,nodes:{entry:(t,e)=>{t(new ut({id:"HelperFunctionEntry",label:"Entry",category:{name:"event"},generators:{ports:{outputs:o=>{o({label:"exec",id:"exec",portType:"flow"});for(let c of e.inputs)o({label:c.label,id:c.label,portType:"value",dataType:c.dataType})},inputs:()=>{}},code:o=>`(${Object.entries(o.outputs).filter(([m])=>m!=="exec").map(([,m])=>m.value).join(", ")}) => { ${o.outputs.exec.code.inner} }`}}))},exit:(t,e)=>{t(new ut({id:"HelperFunctionReturn",label:"Return",category:{name:"event"},generators:{ports:{outputs:()=>{},inputs:o=>{o({label:"exec",id:"exec",portType:"flow"});for(let c of e.outputs)o({label:c.label,id:c.label,portType:"value",dataType:c.dataType})}},code:o=>`return { ${Object.entries(o.inputs).map(([m,v])=>`${m}: (${v.value})`).join(", ")} };`}}))}},generator:{code:{body:t=>{let e=`__fn_${t.function.id.replaceAll("-","_")}`,o=t.graphResultOf("HelperFunctionEntry");return`const ${e} = ${o?.code??"() => ({})"};`},value:t=>{let e=`__fn_${t.function.id.replaceAll("-","_")}`,o=Object.entries(t.inputs).map(([,v])=>v.value).join(", "),c=Object.entries(t.outputs).filter(([v])=>v!=="Output").map(([v,y])=>`${v}: ${y.value}`).join(", "),m=t.outputs.Output?.code.inner??"";return c===""?`${e}(${o}); ${m}`:`const { ${c} } = ${e}(${o}); ${m}`}}}})}};var rr=class extends Ke{mUserFunction;get userFunction(){return this.mUserFunction}constructor(){let t=new ke,e=new tr,o=new er;super(t,e,{generator:{code:c=>{let m="";for(let v of c.dependencies)m+=`${v.code}
`;return m+=c.entryPoint.code,m},values:{valueId:c=>`v_${c}`,hook:c=>`/*[${c}]*/`}}}),this.mUserFunction=o,this.setDynamicFunction(o),this.addBaseNodeDefinitions()}addBaseNodeDefinitions(){this.addNodeDefinition(new V({id:"Add",label:"Add",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} + ${t.inputs.b.value};`}})),this.addNodeDefinition(new V({id:"Subtract",label:"Subtract",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} - ${t.inputs.b.value};`}})),this.addNodeDefinition(new V({id:"Multiply",label:"Multiply",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} * ${t.inputs.b.value};/*MULTIPLYHOOK_${t.outputs.result.value}*/`}})),this.addNodeDefinition(new V({id:"Divide",label:"Divide",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} / ${t.inputs.b.value};`}})),this.addNodeDefinition(new V({id:"Modulo",label:"Modulo",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} % ${t.inputs.b.value};`}})),this.addNodeDefinition(new V({id:"Equal",label:"Equal",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"boolean"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} === ${t.inputs.b.value};`}})),this.addNodeDefinition(new V({id:"Not Equal",label:"Not Equal",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"boolean"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} !== ${t.inputs.b.value};`}})),this.addNodeDefinition(new V({id:"Less Than",label:"Less Than",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"boolean"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} < ${t.inputs.b.value};`}})),this.addNodeDefinition(new V({id:"Greater Than",label:"Greater Than",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"boolean"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} > ${t.inputs.b.value};`}})),this.addNodeDefinition(new V({id:"And",label:"And",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"boolean"},{label:"b",id:"b",portType:"value",dataType:"boolean"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"boolean"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} && ${t.inputs.b.value};`}})),this.addNodeDefinition(new V({id:"Or",label:"Or",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"boolean"},{label:"b",id:"b",portType:"value",dataType:"boolean"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"boolean"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} || ${t.inputs.b.value};`}})),this.addNodeDefinition(new V({id:"Not",label:"Not",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"boolean"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"boolean"}]},generators:{code:t=>`const ${t.outputs.result.value} = !${t.inputs.a.value};`}})),this.addNodeDefinition(new V({id:"Number to String",label:"Number to String",category:{name:"type-conversion"},ports:{inputs:[{label:"input",id:"input",portType:"value",dataType:"number"}],outputs:[{label:"output",id:"output",portType:"value",dataType:"string"}]},generators:{code:t=>`const ${t.outputs.output.value} = String(${t.inputs.input.value});`}})),this.addNodeDefinition(new V({id:"String to Number",label:"String to Number",category:{name:"type-conversion"},ports:{inputs:[{label:"input",id:"input",portType:"value",dataType:"string"}],outputs:[{label:"output",id:"output",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.output.value} = Number(${t.inputs.input.value});`}})),this.addNodeDefinition(new V({id:"Boolean to String",label:"Boolean to String",category:{name:"type-conversion"},ports:{inputs:[{label:"input",id:"input",portType:"value",dataType:"boolean"}],outputs:[{label:"output",id:"output",portType:"value",dataType:"string"}]},generators:{code:t=>`const ${t.outputs.output.value} = String(${t.inputs.input.value});`}})),this.addNodeDefinition(new V({id:"If",label:"If",category:{name:"flow"},ports:{inputs:[{label:"exec",id:"exec",portType:"flow"},{label:"condition",id:"condition",portType:"value",dataType:"boolean"}],outputs:[{label:"then",id:"then",portType:"flow"},{label:"else",id:"else",portType:"flow"}]},generators:{code:t=>`if (${t.inputs.condition.value}) {
${t.outputs.then.code.inner}
} else {
${t.outputs.else.code.inner}
}`}})),this.addNodeDefinition(new V({id:"While",label:"While",category:{name:"flow"},ports:{inputs:[{label:"exec",id:"exec",portType:"flow"},{label:"condition",id:"condition",portType:"value",dataType:"boolean"}],outputs:[{label:"body",id:"body",portType:"flow"}]},generators:{code:t=>`while (${t.inputs.condition.value}) {
${t.outputs.body.code.inner}
}`}})),this.addNodeDefinition(new V({id:"For Loop",label:"For Loop",category:{name:"flow"},ports:{inputs:[{label:"exec",id:"exec",portType:"flow"},{label:"count",id:"count",portType:"value",dataType:"number"}],outputs:[{label:"exec",id:"exec",portType:"flow"},{label:"index",id:"index",portType:"value",dataType:"number"}]},generators:{code:t=>`for (let ${t.outputs.index.value} = 0; ${t.outputs.index.value} < ${t.inputs.count.value}; ${t.outputs.index.value}++) {
${t.outputs.exec.code.inner}
}`}})),this.addNodeDefinition(new V({id:"Console Log",label:"Console Log",category:{name:"Function"},ports:{inputs:[{label:"message",id:"message",portType:"value",dataType:"string"}],outputs:[]},generators:{code:t=>`console.log(${t.inputs.message.value});`}})),this.addNodeDefinition(new V({id:"String Concat",label:"String Concat",category:{name:"Function"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"string"},{label:"b",id:"b",portType:"value",dataType:"string"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"string"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} + ${t.inputs.b.value};`}}))}};var oe=class{mId;mLabel;mNodes;get id(){return this.mId}get label(){return this.mLabel}get nodes(){return this.mNodes}constructor(t,e){this.mId=t,this.mLabel=e,this.mNodes=new Array}addNode(t){this.mNodes.push(t)}};var or=class extends oe{constructor(){super("Math","Math"),this.addNode(new V({id:"Math.PI",label:"Math.PI",category:{name:"value"},ports:{inputs:[],outputs:[{label:"value",id:"value",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.value.value} = Math.PI;`}})),this.addNode(new V({id:"Math.E",label:"Math.E",category:{name:"value"},ports:{inputs:[],outputs:[{label:"value",id:"value",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.value.value} = Math.E;`}})),this.addNode(new V({id:"Math.abs",label:"Math.abs",category:{name:"Function"},ports:{inputs:[{label:"value",id:"value",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = Math.abs(${t.inputs.value.value});`}})),this.addNode(new V({id:"Math.floor",label:"Math.floor",category:{name:"Function"},ports:{inputs:[{label:"value",id:"value",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = Math.floor(${t.inputs.value.value});`}})),this.addNode(new V({id:"Math.random",label:"Math.random",category:{name:"Function"},ports:{inputs:[],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = Math.random();`}})),this.addNode(new V({id:"Math.sin",label:"Math.sin",category:{name:"Function"},ports:{inputs:[{label:"value",id:"value",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = Math.sin(${t.inputs.value.value});`}})),this.addNode(new V({id:"Math.cos",label:"Math.cos",category:{name:"Function"},ports:{inputs:[{label:"value",id:"value",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = Math.cos(${t.inputs.value.value});`}}))}};var nr=class extends oe{constructor(){super("Time","Time"),this.addNode(new V({id:"CurrentTime",label:"CurrentTime",category:{name:"value"},ports:{inputs:[],outputs:[{label:"seconds",id:"seconds",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.seconds.value} = (performance.now() / 1000);`}}))}};var ir=class{mCachedCallable;mDisplay;mElement;mSpecifiedParameters;mTarget;get display(){return this.mDisplay}get element(){return this.mElement||(this.mElement=this.mDisplay.generate()),this.mElement}constructor(t,e){this.mDisplay=t,this.mTarget=e,this.mCachedCallable=null,this.mElement=null,this.mSpecifiedParameters={...this.mDisplay.executor.defaultParameters}}async execute(){this.mCachedCallable&&await this.mDisplay.update(this.element,this.mCachedCallable)}refresh(){let t=this.mTarget instanceof ht?this.mTarget.node.function:this.mTarget,e=(()=>{try{return new re(t.project).generateFunction(t,!0)}catch{return null}})();if(!e){this.mCachedCallable=null;return}let o=null;if(this.mTarget instanceof ht&&(o=this.resolvePortTarget(e,this.mTarget),!o)){this.mCachedCallable=null;return}let c=this.mDisplay.executor.compile(e,o);if(!this.mDisplay.allowsType(c.type)){this.mCachedCallable=null;return}let m=this.mDisplay.adapterFor(c.type);this.mCachedCallable=async v=>m(await c.execute({...this.mDisplay.executor.defaultParameters,...this.mSpecifiedParameters,...v}))}specifyParameters(t){this.mSpecifiedParameters={...this.mSpecifiedParameters,...t}}resolvePortTarget(t,e){let[o,c]=(()=>{for(let v of t.entryPoint.graphs)if(v.ports.has(e)&&v.nodes.has(e.node))return[v.ports.get(e),v.nodes.get(e.node)];return[null,null]})();if(!o||!c)return null;let m=e.direction==="input"?"start":"end";return{documentPort:e,nodeHook:e.project.generator.values.hook(`${m}-${c}`),value:o}}};var ne=class{mExecutor;mGenerate;mId;mName;mTypeAdapters;mUpdate;get executor(){return this.mExecutor}get id(){return`${this.mId}-${this.mExecutor.function.id}`}get name(){return this.mName}constructor(t,e){this.mId=e.id,this.mName=e.name,this.mExecutor=t,this.mGenerate=e.generate,this.mUpdate=e.update,this.mTypeAdapters=new Map;for(let[o,c]of Object.entries(e.typeAdapter))this.mExecutor.types.has(o)&&this.mTypeAdapters.set(o,c)}adapterFor(t){let e=t;if(!this.mTypeAdapters.has(e))throw new A(`Display "${this.mId}" has no type adapter for type "${t}".`,this);return this.mTypeAdapters.get(e)}allowsType(t){return this.mTypeAdapters.has(t)}createDriver(t){return new ir(this,t)}generate(){return this.mGenerate()}update(t,e){return this.mUpdate(t,e)}};var De=class f extends ne{static MATRIX_SIZE=3;static VALUE_LENGTH=5;constructor(t){super(t,{id:"matrix",name:"Matrix 3x3",generate:()=>{let e=document.createElement("div");return e.style.boxSizing="border-box",e.style.display="grid",e.style.gap="2px",e.style.gridTemplateColumns=`repeat(${f.MATRIX_SIZE}, minmax(0, 1fr))`,e.style.height="100%",e.style.width="100%",e.style.fontFamily="var(--potatno-font-family)",e.style.fontSize="var(--potatno-font-size-small)",e},typeAdapter:{[st.MAIN]:e=>e.map(o=>this.formatPreviewValue(o)),number:e=>[this.formatPreviewValue(e)],string:e=>[this.formatPreviewValue(e)],boolean:e=>[this.formatPreviewValue(e)]},update:async(e,o)=>{await this.updateMatrixPreview(e,o)}})}formatPreviewValue(t){if(typeof t=="number"){if(!Number.isFinite(t))return t.toString().slice(0,f.VALUE_LENGTH);let e=Math.trunc(Math.abs(t)).toString().length,o=Math.max(0,f.VALUE_LENGTH-e-(t<0?1:0)-1);return t.toFixed(o).slice(0,f.VALUE_LENGTH)}return String(t).slice(0,f.VALUE_LENGTH)}async updateMatrixPreview(t,e){for(;t.children.length<f.MATRIX_SIZE*f.MATRIX_SIZE;){let o=document.createElement("div");o.style.alignItems="center",o.style.background="var(--potatno-color-background-dark)",o.style.border="1px solid var(--potatno-color-border)",o.style.boxSizing="border-box",o.style.color="var(--pn-text-primary)",o.style.display="flex",o.style.justifyContent="center",o.style.minWidth="0",o.style.overflow="hidden",o.style.padding="2px",o.style.textOverflow="clip",o.style.whiteSpace="pre-line",t.append(o)}for(let o=0;o<f.MATRIX_SIZE;o++)for(let c=0;c<f.MATRIX_SIZE;c++){let m=o*f.MATRIX_SIZE+c,v=f.MATRIX_SIZE===1?0:c/(f.MATRIX_SIZE-1),y=f.MATRIX_SIZE===1?0:o/(f.MATRIX_SIZE-1),T=await Promise.resolve(e({x:v,y}));t.children[m].textContent=T.join(`
`)}}};var Ee=class f extends ne{static PREVIEW_HEIGHT=48;static PREVIEW_WIDTH=48;constructor(t){super(t,{id:"2dCanvas",name:"Canvas 2D",generate:()=>{let e=document.createElement("canvas");return e.width=f.PREVIEW_WIDTH,e.height=f.PREVIEW_HEIGHT,e.style.width="100%",e.style.height="100%",e.style.imageRendering="pixelated",e},typeAdapter:{[st.MAIN]:e=>e,number:e=>[e,e,e],boolean:e=>{let o=e?1:0;return[o,o,o]}},update:async(e,o)=>{await this.updateCanvasPreview(e,o)}})}async updateCanvasPreview(t,e){let o=t.getContext("2d");if(!o)return;let c=t.width,m=t.height,v=o.createImageData(c,m),y=v.data;for(let T=0;T<m;T++)for(let S=0;S<c;S++){let l=S/c,n=T/m,u=await Promise.resolve(e({x:l,y:n})),a=(T*c+S)*4;y[a]=Math.floor(Math.max(0,Math.min(1,u[0]||0))*255),y[a+1]=Math.floor(Math.max(0,Math.min(1,u[1]||0))*255),y[a+2]=Math.floor(Math.max(0,Math.min(1,u[2]||0))*255),y[a+3]=255}o.putImageData(v,0,0)}};(()=>{let f=new WebSocket("ws://127.0.0.1:8088");f.addEventListener("open",()=>{console.log("Refresh connection established")}),f.addEventListener("message",t=>{console.log("Bundle finished. Start refresh"),t.data==="REFRESH"&&window.location.reload()})})();var xt=new rr;xt.addImport(new or);xt.addImport(new nr);var Mi=new st(xt.entryPoint,{defaultParameters:{x:0,y:0},types:[st.MAIN,"number","string","boolean"],build:(f,t,e)=>{let o=t.code,c=f.function.id;if(!e){let y=new Function(`${o}
return ${c};`)();return{type:st.MAIN,execute:T=>y(T.x,T.y)}}let m=o.replace(e.nodeHook,`; return ${e.value};`),v=new Function(`${m}
return ${c};`)();return{type:e.documentPort.resolvedDataType,execute:y=>v(y.x,y.y)}}}),Ni=new st(xt.userFunction,{defaultParameters:{x:0,y:0},types:["number","string","boolean"],build:(f,t,e)=>{if(!e)return{type:"number",execute:()=>0};let o=t.entryPoint.function,c=`__fn_${o.id.replaceAll("-","_")}`,m=o.inputs.map(T=>f.projectTypes.getDefaultValue(T.dataType)),v=t.code.replace(e.nodeHook,`return ${e.value};`),y=new Function(`${v}
return ${c};`)();return{type:e.documentPort.resolvedDataType,execute:()=>y(...m)}}});xt.preview.addDisplay(new Ee(Mi));xt.preview.addDisplay(new Ee(Ni));xt.preview.addDisplay(new De(Mi));xt.preview.addDisplay(new De(Ni));var Us=document.getElementById("application-root"),Ie=new qe(xt);Ie.appendTo(Us);Ie.document=new Nt(xt);Ai();async function Ai(){try{await Ie.update()}catch(f){}requestAnimationFrame(Ai)}document.getElementById("load-button").addEventListener("click",Hs);document.getElementById("save-button").addEventListener("click",Xs);var Li="potatno-code-document.json";async function Hs(){if(window.confirm("Load saved document?"))try{let o=await(await(await navigator.storage.getDirectory()).getFileHandle(Li)).getFile();Ie.load(await o.text())}catch{window.alert("Could not load document.")}}async function Xs(){if(window.confirm("Override saved document?"))try{let o=await(await(await navigator.storage.getDirectory()).getFileHandle(Li,{create:!0})).createWritable();await o.write(Ie.save()),await o.close()}catch{window.alert("Could not save document.")}}})();
//# sourceMappingURL=page.js.map
