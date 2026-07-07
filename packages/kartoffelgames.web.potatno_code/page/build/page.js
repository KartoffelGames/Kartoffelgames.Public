(()=>{var jt=class f extends Array{static newListWith(...t){let e=new f;return e.push(...t),e}clear(){this.splice(0,this.length)}clone(){return f.newListWith(...this)}distinct(){return f.newListWith(...new Set(this))}equals(t){if(this===t)return!0;if(!t||this.length!==t.length)return!1;for(let e=0;e<this.length;++e)if(this[e]!==t[e])return!1;return!0}remove(t){let e=this.indexOf(t);if(e!==-1)return this.splice(e,1)[0]}replace(t,e){let r=this.indexOf(t);if(r!==-1){let a=this[r];return this[r]=e,a}}toString(){return`[${super.join(", ")}]`}};var A=class extends Error{mTarget;get target(){return this.mTarget}constructor(t,e,r){super(t,r),this.mTarget=e}};var k=class f extends Map{add(t,e){if(!this.has(t))this.set(t,e);else throw new A("Can't add duplicate key to dictionary.",this)}clone(){return new f(this)}getAllKeysOfValue(t){return[...this.entries()].filter(a=>a[1]===t).map(a=>a[0])}getOrDefault(t,e){let r=this.get(t);return typeof r<"u"?r:e}map(t){let e=new jt;for(let r of this){let a=t(r[0],r[1]);e.push(a)}return e}};var Pt=class f{mSize;mTopItem;get size(){return this.mSize}get top(){if(this.mTopItem)return this.mTopItem.value}constructor(){this.mTopItem=null,this.mSize=0}clone(){let t=new f;return t.mTopItem=this.mTopItem,t.mSize=this.mSize,t}*entries(){let t=this.mTopItem;for(;t!==null;)yield t.value,t=t.previous}flush(){let t=new Array;for(;this.mTopItem;)t.push(this.pop());return t}pop(){if(!this.mTopItem)return;let t=this.mTopItem.value;return this.mTopItem=this.mTopItem.previous,this.mSize--,t}push(t){let e={previous:this.mTopItem,value:t};this.mTopItem=e,this.mSize++}toArray(){return[...this.entries()]}};var ne=class{mCompareFunction;constructor(t){this.mCompareFunction=t}differencesOf(t,e){let r;if(t.length===0||e.length===0){if(r=new Array,t.length===0)for(let S=0;S<e.length;S++)r.push({changeState:Dt.Insert,item:e[S]});else for(let S=0;S<t.length;S++)r.push({changeState:Dt.Remove,item:t[S]});return r}let a={1:{x:0,history:[]}},m=S=>S-1,g=t.length,y=e.length,T;for(let S=0;S<g+y+1;S++)for(let c=-S;c<S+1;c+=2){let n=c===-S||c!==S&&a[c-1].x<a[c+1].x;if(n){let l=a[c+1];T=l.x,r=l.history}else{let l=a[c-1];T=l.x+1,r=l.history}r=r.slice();let u=T-c;for(1<=u&&u<=y&&n?r.push({changeState:Dt.Insert,item:e[m(u)]}):1<=T&&T<=g&&r.push({changeState:Dt.Remove,item:t[m(T)]});T<g&&u<y&&this.mCompareFunction(t[m(T+1)],e[m(u+1)]);)T+=1,u+=1,r.push({changeState:Dt.Keep,item:t[m(T)]});if(T>=g&&u>=y)return r;a[c]={x:T,history:r}}return new Array}},Dt=function(f){return f[f.Remove=1]="Remove",f[f.Insert=2]="Insert",f[f.Keep=3]="Keep",f}({});var ie=class{mNodeCache;constructor(){this.mNodeCache=new Map}start(t,e){let r=this.readFromCache(t),a=this.readFromCache(e),m=new sr;m.set(r,0);let g=new Map;g.set(r,0);let y=new Map,T=new Array;for(;m.length!==0;){let S=m.popLowest();if(T.push(S),S===a)return{path:[...this.pathTracer(S,y)].reverse(),processedNodes:T};for(let c of this.getNeighborNodes(S)){let n=(g.get(S)??Number.POSITIVE_INFINITY)+this.costOfTraversal(c,{startNode:r,endNode:a,path:this.pathTracer(S,y)}),u=g.get(c)??Number.POSITIVE_INFINITY;if(n>=u)continue;y.set(c,S),g.set(c,n);let l=n+this.heuristic(c,{startNode:r,endNode:a,path:this.pathTracer(S,y)});m.set(c,l)}}return{path:new Array,processedNodes:T}}getNeighborNodes(t){return this.neighborNodes(t).map(e=>this.readFromCache(e))}*pathTracer(t,e){let r=t;for(;yield r,!!e.has(r);)r=e.get(r)}readFromCache(t){let e=this.nodeId(t);return this.mNodeCache.has(e)?this.mNodeCache.get(e):(this.mNodeCache.set(e,t),t)}},sr=class{mExistingNodes;mList;mLowestCost;mLowestCostCounter;get length(){return this.mList.length}constructor(){this.mList=new Array,this.mExistingNodes=new Map,this.mLowestCost=Number.POSITIVE_INFINITY,this.mLowestCostCounter=0}popLowest(){if(this.mList.length===0)throw new A("Can not read next node from an empty priority list.",this);let[t,e]=(()=>{let g=null,y=0;for(let T=this.mList.length-1;T>-1;T--){let S=this.mList[T];if(S.cost===this.mLowestCost)return[S,0];(g===null||S.cost<g.cost)&&(g=S,y=0),S.cost===g.cost&&y++}if(g===null)throw new A("Lowest could not be found. Data is corrupted.",this);return[g,y]})();t.cost<this.mLowestCost&&(this.mLowestCost=t.cost,this.mLowestCostCounter=e),t.cost===this.mLowestCost&&this.mLowestCostCounter--,this.mLowestCostCounter<1&&(this.mLowestCost=Number.POSITIVE_INFINITY,this.mLowestCostCounter=0);let r=this.mExistingNodes.get(t.node),a=this.mList.length-1,m=this.mList[a];return this.mList[a]=t,this.mList[r]=m,this.mExistingNodes.set(m.node,r),this.mExistingNodes.delete(t.node),this.mList.pop().node}set(t,e){if(this.mLowestCostCounter>0&&e<this.mLowestCost&&(this.mLowestCost=e,this.mLowestCostCounter=0),e===this.mLowestCost&&this.mLowestCostCounter++,this.mExistingNodes.has(t)){let r=this.mExistingNodes.get(t),a=this.mList[r];if(a.cost===e){e===this.mLowestCost&&this.mLowestCostCounter--;return}a.cost=e;return}this.mList.push({cost:e,node:t}),this.mExistingNodes.set(t,this.mList.length-1)}};var se=class{mDataType;mId;mLabel;mPortType;mRegions;get dataType(){return this.mDataType}get id(){return this.mId}get label(){return this.mLabel}get portType(){return this.mPortType}get regions(){return this.mRegions}constructor(t){this.mLabel=t.label,this.mId=t.id,this.mPortType=t.portType,t.portType==="value"?this.mDataType=t.dataType:this.mDataType=null,this.mRegions={add:t.regions?.add??new Array}}};var ht=class{mCategory;mCodeGenerator;mId;mLabel;mPortProvider;mRegions;get category(){return this.mCategory}get codeGenerator(){return this.mCodeGenerator}get id(){return this.mId}get inputs(){let t=!1,e=[];return this.mPortProvider.inputs(r=>{if(e.push(new se(r)),r.portType==="flow"){if(t)throw new A(`Node definition ${this.id} has multiple input flow ports, which is not allowed.`,this);t=!0}}),e}get label(){return this.mLabel}get outputs(){let t=[];return this.mPortProvider.outputs(e=>{t.push(new se(e))}),t}get regions(){return this.mRegions}constructor(t){this.mId=t.id,this.mLabel=t.label,this.mCategory={name:t.category.name,icon:t.category.icon??"\u25C6"},this.mCodeGenerator=t.generators.code,this.mPortProvider=t.generators.ports,this.mRegions={add:t.regions?.add??new Array,allows:t.regions?.allows??new Array,requires:t.regions?.requires??new Array}}getPort(t){return[...this.inputs,...this.outputs].find(e=>e.id===t)}};var Vt=class extends ht{mFunction;get function(){return this.mFunction}get label(){return this.mFunction.label}constructor(t){let e=(a,m,g)=>y=>{g.length===0&&y({label:a,id:a,portType:"flow"});for(let T of m)y({label:T.label,id:T.label,portType:"value",dataType:T.dataType})},r=t.project.getFunction(t.definitionId);super({id:`USERFUNCTION_${t.id}`,label:t.label,category:{name:"user function",icon:"\u0192"},generators:{ports:{inputs:e("Input",t.inputs,t.outputs),outputs:e("Output",t.outputs,t.outputs)},code:a=>r?r.codeGenerator.value({function:t,inputs:a.inputs,outputs:a.outputs,code:a.code}):""}}),this.mFunction=t}};var pt=class{mAffectedItems;mErrors;get affectedItems(){return this.mAffectedItems}get errors(){return this.mErrors}constructor(){this.mErrors=new Array,this.mAffectedItems=new Set}addAffectedItem(t){this.mAffectedItems.add(t)}merge(t){this.mErrors.push(...t.mErrors);for(let e of t.mAffectedItems)this.mAffectedItems.add(e);return this}pushError(...t){this.mErrors.push(...t)}},Y=class{mItem;mMessage;get item(){return this.mItem}get message(){return this.mMessage}constructor(t,e){this.mMessage=t,this.mItem=e}};var nt=class{mConnectedPorts;mDataType;mDefinitionId;mDirectValue;mDirection;mDocument;mLabel;mNode;mPortType;mProject;get connectedPorts(){return this.mConnectedPorts}get dataType(){return this.mDataType}get definitionId(){return this.mDefinitionId}get directValue(){return this.mDirectValue}get direction(){return this.mDirection}get document(){return this.mDocument}get label(){return this.mLabel}set label(t){this.mLabel=t}get node(){return this.mNode}get portType(){return this.mPortType}get project(){return this.mProject}get resolvedDataType(){if(this.mPortType!=="value")throw new A("Port data type couldn't be resolved as it is no value port.",this);if(!this.mProject.types.isGenericType(this.mDataType??""))return this.mDataType;if(this.mDirection==="output"){let e=this.mNode.inputs.value.find(r=>r.dataType===this.mDataType);if(!e)throw new A("Port type couldn't be resolved as it has no resolving sibling port",this);return e.resolvedDataType}return this.mConnectedPorts.size===0?this.mDataType:this.mConnectedPorts.values().next().value.resolvedDataType}constructor(t,e,r){if(r.portType==="flow"&&r.dataType!==null)throw new A("Flow ports cannot have a value type.",this);if(r.portType==="value"&&r.dataType===null)throw new A("Value ports must have a value type.",this);this.mProject=t,this.mDocument=e,this.mNode=r.node,this.mDefinitionId=r.definitionId,this.mLabel=r.label,this.mDataType=r.dataType,this.mDirection=r.direction,this.mPortType=r.portType,this.mConnectedPorts=new Set,this.mDirectValue=new Array,r.dataType&&!this.mProject.types.isGenericType(r.dataType)&&this.mDirectValue.push(...t.types.getType(r.dataType).default.string)}connect(t){if(this.mConnectedPorts.has(t))return;if(this.mPortType!==t.portType)throw new A(`Cannot connect port ${this.mDefinitionId} of node ${this.mNode.label} to port ${t.mDefinitionId} of node ${t.node.label} due to incompatible port types.`,this);if(this.mDirection===t.direction)throw new A(`Cannot connect port ${this.mDefinitionId} of node ${this.mNode.label} to port ${t.mDefinitionId} of node ${t.node.label} due to incompatible directions.`,this);if(!(this.mPortType==="flow"&&this.mDirection==="input"||this.mPortType==="value"&&this.mDirection==="output"))for(let r of Array.from(this.mConnectedPorts))this.disconnect(r);this.mConnectedPorts.add(t),t.connect(this)}disconnect(t){this.mConnectedPorts.has(t)&&(this.mConnectedPorts.delete(t),t.disconnect(this))}setDirectValue(t){if(this.mPortType!=="value")throw new A("Only value ports can have a direct value.",this);if(this.mProject.types.isGenericType(this.mDataType))throw new A("Generic value ports cannot have a direct value.",this);if(t.length!==this.mProject.types.getType(this.mDataType).default.string.length)throw new A("The provided value does not match the expected length of the default value for this port's type.",this);this.mDirectValue.splice(0,this.mDirectValue.length),this.mDirectValue.push(...t)}validate(){let t=new pt;if(this.mDirection==="output"){if(this.mPortType==="flow"&&this.mConnectedPorts.size>1&&t.pushError(new Y(`Flow output port "${this.mDefinitionId}" on node "${this.mNode.label}" can only have one connection.`,this)),this.mPortType==="value"&&this.mProject.types.isGenericType(this.mDataType??"")){let e=this.mNode.inputs.value.filter(r=>r.dataType===this.mDataType);for(let r of e)r.connectedPorts.size===0&&t.pushError(new Y(`Generic output port "${this.mDefinitionId}" on node "${this.mNode.label}" cannot resolve generic type "${this.mDataType}" because its input port "${r.definitionId}" is not connected.`,this))}return t}if(this.mDirection==="input"){if(this.mPortType==="flow")return this.mConnectedPorts.size===0&&t.pushError(new Y(`Flow input port "${this.mDefinitionId}" on node "${this.mNode.label}" must have at least one connection.`,this)),t;if(this.mPortType==="value"){this.mConnectedPorts.size>1&&t.pushError(new Y(`Value input port "${this.mDefinitionId}" on node "${this.mNode.label}" can only have one connection.`,this));for(let e of this.mConnectedPorts)e.resolvedDataType!==this.resolvedDataType&&t.pushError(new Y(`Value input port "${this.mDefinitionId}" on node "${this.mNode.label}" expects type "${this.resolvedDataType}" but is connected to type "${e.resolvedDataType}".`,this));return t}}return t}};var gt=class{mDefinitionId;mDocument;mFunction;mInputs;mLabel;mOutputs;mPreview;mProject;mTransformation;get definitionId(){return this.mDefinitionId}get document(){return this.mDocument}get function(){return this.mFunction}get hasFlowPorts(){return this.mOutputs.flow.length>0||this.mInputs.flow.length>0}get hasValuePorts(){return this.mOutputs.value.length>0||this.mInputs.value.length>0}get inputs(){return this.mInputs}get label(){return this.mLabel}set label(t){this.mLabel=t}get outputs(){return this.mOutputs}get preview(){return this.mPreview}set preview(t){this.mPreview=t}get project(){return this.mProject}get transformation(){return this.mTransformation}constructor(t,e,r,a){this.mDocument=e,this.mDefinitionId=a.definitionId,this.mFunction=r,this.mLabel=a.label,this.mPreview=a.preview??null,this.mProject=t,this.mTransformation={x:0,y:0,width:0,height:0};let m=(g,y)=>{let T={direction:y,list:new Array,map:new Map,flow:new Array,value:new Array};for(let S of g){let c=new nt(this.mProject,this.mDocument,{definitionId:S.definitionId,direction:y,label:S.label,node:this,portType:S.portType,dataType:S.dataType});T.list.push(c),T.map.set(c.definitionId,c),(c.portType==="flow"?T.flow:T.value).push(c)}return T};this.mInputs=m(a.ports.input,"input"),this.mOutputs=m(a.ports.output,"output"),this.resizeTo(a.transformation.width,a.transformation.height),this.moveTo(a.transformation.x,a.transformation.y)}moveTo(t,e){this.mTransformation.x=t,this.mTransformation.y=e}resizeTo(t,e){this.mTransformation.width=Math.max(6,t);let r=1+Math.max(this.mInputs.list.length,this.mOutputs.list.length);this.mTransformation.height=Math.max(r,e)}validate(t){let e=new pt,r=t??new Set,a=this.mFunction.nodeDefinitions.find(m=>m.id===this.mDefinitionId);if(!a)e.pushError(new Y(`Node "${this.mLabel}" definition "${this.mDefinitionId}" could not be found.`,this));else{e.merge(this.resyncPorts(this.mInputs,a.inputs)),e.merge(this.resyncPorts(this.mOutputs,a.outputs));let m=new Set([...a.regions.requires,...a.regions.allows]);if(m.size>0)for(let g of r)m.has(g)||e.pushError(new Y(`Node "${this.mLabel}" does not allow region "${g}".`,this));if(a.regions.requires.length>0)for(let g of a.regions.requires)r.has(g)||e.pushError(new Y(`Node "${this.mLabel}" requires region "${g}" but it is not active.`,this))}for(let m of[...this.mInputs.list,...this.mOutputs.list])e.merge(m.validate());return this.resizeTo(this.transformation.width,this.transformation.height),e}addPort(t,e,r){let a=new nt(this.mProject,this.mDocument,{definitionId:e.id,direction:t.direction,label:e.label,node:this,portType:e.portType,dataType:e.dataType});return t.list.splice(r,0,a),t.map.set(a.definitionId,a),(a.portType==="flow"?t.flow:t.value).push(a),a}removePort(t,e){let r=t.list.indexOf(e);if(r===-1)throw new A(`Port "${e.label}" was not found and can not be removed.`,this);t.list.splice(r,1),t.map.delete(e.definitionId);let a=e.portType==="flow"?t.flow:t.value,m=a.indexOf(e);if(r===-1)throw new A(`Port "${e.label}" was not found in typed list and can not be removed.`,this);return a.splice(m,1),r}replacePort(t,e,r){let a=Array.from(e.connectedPorts);for(let y of Array.from(e.connectedPorts))e.disconnect(y);let m=this.removePort(t,e),g=this.addPort(t,r,m);for(let y of a)g.connect(y);return g}resyncPorts(t,e){let r=new pt,a=new Set(e.map(m=>m.id));for(let m=0;m<e.length;m++){let g=e[m];if(!t.map.has(g.id)){let n=this.addPort(t,g,m);r.addAffectedItem(n);continue}let y=t.map.get(g.id),T=y.portType!==g.portType,S=y.dataType!==g.dataType;if(!T&&!S)continue;if(y.connectedPorts.size>0&&T){r.pushError(new Y(`Port "${y.label}" on node "${this.mLabel}" has a changed type.`,y));continue}let c=this.replacePort(t,y,g);r.addAffectedItem(y),r.addAffectedItem(c)}for(let m of t.list)if(!a.has(m.definitionId)){if(m.connectedPorts.size===0){r.addAffectedItem(m),this.removePort(t,m);continue}r.pushError(new Y(`Port "${m.label}" on node "${this.mLabel}" no longer exists in its definition.`,m))}return r}};var ft=class{mDefinitionId;mDocument;mId;mImportIds;mInputs;mIsSystem;mLabel;mNodes;mOutputs;mProject;get definitionId(){return this.mDefinitionId}get document(){return this.mDocument}get dynamicNodeDefinitions(){let t=this.mProject.getFunction(this.definitionId);if(!t)return[...this.mDocument.nodeDefinitions];let e=t.getNodeDefinitions(this),r=this.mProject.imports.filter(a=>this.mImportIds.has(a.id)).flatMap(a=>a.nodes);return[...this.mDocument.nodeDefinitions,...r,...e.dynamic]}get id(){return this.mId}get imports(){return this.mImportIds}get inputs(){return this.mInputs}get isSystem(){return this.mIsSystem}get label(){return this.mLabel}set label(t){this.mLabel=t}get nodeDefinitions(){let t=this.mProject.getFunction(this.definitionId);if(!t)return this.dynamicNodeDefinitions;let e=t.getNodeDefinitions(this);return[...this.dynamicNodeDefinitions,...e.entry,...e.exit]}get nodes(){return this.mNodes}get outputs(){return this.mOutputs}get project(){return this.mProject}constructor(t,e,r){this.mProject=t,this.mDocument=e,this.mLabel=r.label,this.mIsSystem=r.isSystem,this.mDefinitionId=r.definitionId,this.mId=r.id,this.mNodes=new Set,this.mInputs=new Array,this.mOutputs=new Array,this.mImportIds=new Set}addImport(t){if(!this.project.imports.some(r=>r.id===t))throw new A(`Project does not contain import ${t}`,this);this.mImportIds.add(t)}addInput(t){this.mInputs.some(e=>e.label===t.label)||this.mInputs.push(t)}addNode(t){this.mNodes.add(t)}addNodeByDefinition(t,e){let r=m=>({definitionId:m.id,label:m.label,portType:m.portType,dataType:m.dataType}),a=new gt(this.mProject,this.mDocument,this,{definitionId:t.id,ports:{input:t.inputs.map(r),output:t.outputs.map(r)},label:t.label,transformation:e});return this.mNodes.add(a),a}addOutput(t){this.mOutputs.some(e=>e.label===t.label)||this.mOutputs.push(t)}getExitNodes(){let t=this.mProject.getFunction(this.mDefinitionId);if(!t)throw new A(`Function definition not found for function "${this.mLabel}".`,this);let e=new Set(t.getNodeDefinitions(this).exit.map(r=>r.id));return[...this.mNodes].filter(r=>e.has(r.definitionId))}removeImport(t){this.mImportIds.delete(t)}removeInput(t){let e=this.mInputs.findIndex(r=>r.label===t.label);e!==-1&&this.mInputs.splice(e,1)}removeNode(t){for(let e of[...t.inputs.list,...t.outputs.list])for(let r of Array.from(e.connectedPorts))e.disconnect(r);this.mNodes.delete(t)}removeOutput(t){let e=this.mOutputs.findIndex(r=>r.label===t.label);e!==-1&&this.mOutputs.splice(e,1)}validate(){let t=new pt,e=this.mProject.getFunction(this.mDefinitionId);e||t.pushError(new Y(`Function "${this.mLabel}" definition "${this.mDefinitionId}" could not be found.`,this));let r=e?.getNodeDefinitions(this);r&&this.resyncFunction(r,t);let a=this.collectRegions(this.mNodes,t),m=new Set(r?.entry.map(y=>y.id)??new Array),g=new Map;for(let y of this.mNodes)t.merge(y.validate(a.get(y))),this.collectEntryDomains(y,m,g).size>1&&t.pushError(new Y(`Node "${y.label}" is reachable from multiple entry nodes.`,y));return t}collectEntryDomains(t,e,r){if(r.has(t))return r.get(t);let a=new Set;r.set(t,a);for(let m of t.inputs.list)for(let g of m.connectedPorts){let y=g.node;e.has(y.definitionId)&&a.add(y);for(let T of this.collectEntryDomains(y,e,r))a.add(T)}return a}collectRegions(t,e){let r=new Map;for(let y of this.nodeDefinitions)r.set(y.id,y);let a=(()=>{let y=new Map;return(T,S)=>{if(!y.has(T.id)){let c=new Map;for(let n of T.outputs)c.set(n.id,n.regions.add);y.set(T.id,c)}return[...y.get(T.id).get(S)??new Array,...T.regions.add]}})(),m=(()=>{let y=new Map;return(T,S)=>{if(y.has(T))return y.get(T);if(S.has(T))return e.pushError(new Y(`Node "${T.label}" is part of a connection cycle.`,T)),new Set;S.add(T);let c=new Set;for(let n of T.inputs.list)for(let u of n.connectedPorts){let l=u.node;for(let o of m(l,S))c.add(o);if(r.has(l.definitionId))for(let o of a(r.get(l.definitionId),u.definitionId))c.add(o)}return y.set(T,c),c}})(),g=new Map;for(let y of t)g.set(y,m(y,new Set));return g}resyncFunction(t,e){let r=[...t.entry,...t.exit],a=new Set(this.mNodes.values().map(y=>y.definitionId)),m=0,g=20;for(let y of r){if(a.has(y.id))continue;let T=this.addNodeByDefinition(y,{x:Math.floor(m/(r.length/2))*g+2,y:m*g+2-Math.floor(m/(r.length/2))*(r.length/2*g),width:0,height:0});e.addAffectedItem(T),m++}}};var Mt=class{mFunctionNodeDefinitions;mFunctions;mProject;get functions(){return this.mFunctions}get nodeDefinitions(){return[...this.mFunctionNodeDefinitions.values(),...this.mProject.nodeDefinitions.values()]}get project(){return this.mProject}constructor(t){this.mProject=t,this.mFunctions=new Set,this.mFunctionNodeDefinitions=new Map}addFunction(t){this.mFunctions.add(t);let e=new Vt(t);this.mFunctionNodeDefinitions.set(e.id,e)}newFunction(t){let e=new ft(this.mProject,this,t);this.mFunctions.add(e);let r=new Vt(e);return this.mFunctionNodeDefinitions.set(r.id,r),e}removeFunction(t){if(!this.mFunctions.has(t))return!1;if(t.isSystem)throw new A("Cannot remove a system function.",this);this.mFunctions.delete(t);let e=this.mFunctionNodeDefinitions.values().find(r=>r.function===t);return e&&this.mFunctionNodeDefinitions.delete(e.id),!0}validate(){let t=new pt,e=this.mProject.entryPoint.id;if(!this.mFunctions.values().some(r=>r.definitionId===e)){let r=this.newFunction({definitionId:e,id:crypto.randomUUID(),isSystem:!0,label:this.mProject.entryPoint.label});t.addAffectedItem(r)}for(let r of this.mFunctions)t.merge(r.validate());return t.pushError(...this.detectCrossFunctionRecursion()),t}detectCrossFunctionRecursion(){let t=[],e=new Map,r=y=>{if(!e.has(y)){let T=new Set;for(let S of y.nodes)this.mFunctionNodeDefinitions.has(S.definitionId)&&T.add(this.mFunctionNodeDefinitions.get(S.definitionId).function);e.set(y,T)}return e.get(y)},a=new Set,m=new Set,g=y=>{if(!a.has(y)){if(m.has(y)){t.push(new Y(`Function "${y.label}" participates in a cross-function recursion cycle.`,y));return}m.add(y);for(let T of r(y))g(T);m.delete(y),a.add(y)}};for(let y of this.mFunctions)g(y);return t}};var tt=class f{static mComponents=new WeakMap;static mConstructorSelector=new WeakMap;static mElements=new WeakMap;static elementIsComponent(t){return f.mComponents.has(t)}static ofComponent(t){let e=t.processorConstructor,r=f.mConstructorSelector.get(e);if(!r)throw new A(`Constructor "${e.name}" is not a registered custom element`,e);let a=f.mElements.get(t);if(!a)throw new A(`Component "${t}" is not a registered component`,t);return{selector:r,constructor:e,element:a,component:t,processor:t.processor}}static ofConstructor(t){let e=f.mConstructorSelector.get(t);if(!e)throw new A(`Constructor "${t.name}" is not a registered custom element`,t);let r=globalThis.customElements.get(e);if(!r)throw new A(`Constructor "${t.name}" is not a registered custom element`,t);return{selector:e,constructor:t,elementConstructor:r}}static ofElement(t){let e=f.mComponents.get(t);if(!e)throw new A(`Element "${t}" is not a PwbComponent.`,t);return f.ofComponent(e)}static ofProcessor(t){let e=f.mComponents.get(t);if(!e)throw new A("Processor is not a PwbComponent.",t);return f.ofComponent(e)}static registerComponent(t,e,r){f.mComponents.has(e)||f.mComponents.set(e,t),r&&!f.mComponents.has(r)&&f.mComponents.set(r,t),f.mElements.has(t)||f.mElements.set(t,e)}static registerConstructor(t,e){t&&!f.mConstructorSelector.has(t)&&f.mConstructorSelector.set(t,e)}};var ae=class f{static CONFIGURATION_ATTACHMENT=Symbol("PwbApplicationConfigurationAttachment");static new(t,e){let r=new f;t(r),e&&r.appendTo(e)}mContent;mFragment;mCurrentTarget;constructor(){this.mContent=new Array,this.mFragment=document.createDocumentFragment(),this.mCurrentTarget=null}addContent(t){let e=tt.ofConstructor(t).elementConstructor,r=tt.ofElement(new e);return this.mContent.push(r.component),this.mFragment.appendChild(r.element),this.updateTarget(),r.processor}addStyle(t){let e=document.createElement("style");e.textContent=t,this.mFragment.prepend(e)}appendTo(t){this.mCurrentTarget=t,this.updateTarget()}updateTarget(){this.mCurrentTarget&&(this.mCurrentTarget.shadowRoot||this.mCurrentTarget.attachShadow({mode:"open"}),this.mCurrentTarget.shadowRoot.appendChild(this.mFragment))}};var Ut=class{mCustomMetadata;constructor(){this.mCustomMetadata=new Map}getMetadata(t){return this.mCustomMetadata.get(t)??null}setMetadata(t,e){this.mCustomMetadata.set(t,e)}};var le=class extends Ut{};var ce=class f extends Ut{static mPrivateMetadataKey=Symbol("Metadata");mDecoratorMetadataObject;mPropertyMetadata;constructor(t){super(),this.mDecoratorMetadataObject=t,this.mPropertyMetadata=new Map,t[f.mPrivateMetadataKey]=this}getInheritedMetadata(t){let e=new Array,r=this.mDecoratorMetadataObject;do{if(Object.hasOwn(r,f.mPrivateMetadataKey)){let m=r[f.mPrivateMetadataKey].getMetadata(t);m!==null&&e.push(m)}r=Object.getPrototypeOf(r)}while(r!==null);return e.reverse()}getProperty(t){return this.mPropertyMetadata.has(t)||this.mPropertyMetadata.set(t,new le),this.mPropertyMetadata.get(t)}};Symbol.metadata??=Symbol("Symbol.metadata");var it=class f{static mMetadataMapping=new Map;static add(t,e){return(r,a)=>{let m=f.forInternalDecorator(a.metadata);switch(a.kind){case"class":m.setMetadata(t,e);return;case"method":case"field":case"getter":case"setter":case"accessor":if(a.static)throw new Error("@Metadata.add not supported for statics.");m.getProperty(a.name).setMetadata(t,e);return}}}static forInternalDecorator(t){return f.mapMetadata(t)}static get(t){Object.hasOwn(t,Symbol.metadata)||f.polyfillMissingMetadata(t);let e=t[Symbol.metadata];return f.mapMetadata(e)}static init(){return(t,e)=>{f.forInternalDecorator(e.metadata)}}static mapMetadata(t){if(f.mMetadataMapping.has(t))return f.mMetadataMapping.get(t);let e=new ce(t);return f.mMetadataMapping.set(t,e),e}static polyfillMissingMetadata(t){let e=new Array,r=t;do e.push(r),r=Object.getPrototypeOf(r);while(r!==null);for(let a=e.length-1;a>=0;a--){let m=e[a];if(!Object.hasOwn(m,Symbol.metadata)){let g=null;a<e.length-2&&(g=e[a+1][Symbol.metadata]),m[Symbol.metadata]=Object.create(g,{})}}}};var O=class f{static mCurrentInjectionContext=null;static mInjectMode=new Map;static mInjectableConstructor=new Map;static mInjectableReplacement=new Map;static mInjectionConstructorIdentificationMetadataKey=Symbol("InjectionConstructorIdentification");static mSingletonMapping=new Map;static createObject(t,e,r){let[a,m]=typeof e=="object"&&e!==null?[!1,e]:[!!e,r??new Map],g=f.getInjectionIdentification(t);if(!f.mInjectableConstructor.has(g))throw new A(`Constructor "${t.name}" is not registered for injection and can not be built`,f);let y=a?"instanced":f.mInjectMode.get(g),T=new Map(m.entries().map(([n,u])=>[f.getInjectionIdentification(n),u])),S=f.mCurrentInjectionContext,c=new Map([...S?.localInjections.entries()??[],...T.entries()]);f.mCurrentInjectionContext={injectionMode:y,localInjections:c};try{if(!a&&y==="singleton"&&f.mSingletonMapping.has(g))return f.mSingletonMapping.get(g);let n=new t;return y==="singleton"&&!f.mSingletonMapping.has(g)&&f.mSingletonMapping.set(g,n),n}finally{f.mCurrentInjectionContext=S}}static injectable(t="instanced"){return(e,r)=>{f.registerInjectable(e,r.metadata,t)}}static registerInjectable(t,e,r){let a=f.getInjectionIdentification(t,e);f.mInjectableConstructor.set(a,t),f.mInjectMode.set(a,r)}static replaceInjectable(t,e){let r=f.getInjectionIdentification(t);if(!f.mInjectableConstructor.has(r))throw new A("Original constructor is not registered.",f);let a=f.getInjectionIdentification(e);if(!f.mInjectableConstructor.has(a))throw new A("Replacement constructor is not registered.",f);f.mInjectableReplacement.set(r,e)}static use(t){if(f.mCurrentInjectionContext===null)throw new A("Can't create object outside of an injection context.",f);let e=f.getInjectionIdentification(t);if(f.mCurrentInjectionContext.injectionMode!=="singleton"&&f.mCurrentInjectionContext.localInjections.has(e))return f.mCurrentInjectionContext.localInjections.get(e);let r=f.mInjectableReplacement.get(e);if(r||(r=f.mInjectableConstructor.get(e)),!r)throw new A(`Constructor "${t.name}" is not registered for injection and can not be built`,f);return f.createObject(r)}static getInjectionIdentification(t,e){let r=e?it.forInternalDecorator(e):it.get(t),a=r.getMetadata(f.mInjectionConstructorIdentificationMetadataKey);return a||(a=Symbol(t.name),r.setMetadata(f.mInjectionConstructorIdentificationMetadataKey,a)),a}};var H=function(f){return f[f.Read=1]="Read",f[f.ReadWrite=2]="ReadWrite",f[f.Write=3]="Write",f}({});var Et=class{mHooks;mInjections;mProcessor;mProcessorConstructor;get processor(){if(!this.mProcessor)throw new A("Processor is not created yet. Call setup to create processor.",this);return this.mProcessor}get processorConstructor(){return this.mProcessorConstructor}constructor(t){if(this.mProcessorConstructor=t.constructor,this.mProcessor=null,this.mInjections=new Map,this.mHooks={create:new Array},t.parent)for(let[e,r]of t.parent.mInjections.entries())this.setProcessorInjection(e,r)}deconstruct(){}getProcessorInjection(t){return this.mInjections.get(t)}setProcessorInjection(t,e){if(this.mProcessor)throw new A("Cant add injections to after construction.",this);this.mInjections.set(t,e)}setup(){return this.mProcessor=this.createProcessor(),this}addConstructionHook(t){return this.mHooks.create.push(t),this}call(t,...e){let r=Reflect.get(this.processor,t);return typeof r!="function"?null:r.apply(this.processor,e)}createProcessor(){let t=O.createObject(this.mProcessorConstructor,this.mInjections),e;for(;e=this.mHooks.create.pop();){let r=e.call(this,t);r&&(t=r)}return t}};var Nt=class f extends Et{constructor(t,e){super({constructor:t,parent:e}),this.setProcessorInjection(f,this)}deconstruct(){this.call("onDeconstruct"),super.deconstruct()}setup(){return super.setup(),this.call("onExecute"),this}onUpdate(){return!1}};var ar=class f{static mInstance;mCoreEntityConstructor;mProcessorConstructorConfiguration;constructor(){if(f.mInstance)return f.mInstance;f.mInstance=this,this.mCoreEntityConstructor=new Map,this.mProcessorConstructorConfiguration=new Map}get(t){let e=this.mCoreEntityConstructor.get(t);if(!e)return new Array;let r=new Array;for(let a of e)r.push({processorConstructor:a,processorConfiguration:this.mProcessorConstructorConfiguration.get(a)});return r}register(t,e,r){this.mProcessorConstructorConfiguration.set(e,r);let a=t;do{if(!(a.prototype instanceof Et)&&a!==Et)break;this.mCoreEntityConstructor.has(a)||this.mCoreEntityConstructor.set(a,new Set),this.mCoreEntityConstructor.get(a).add(e)}while(a=Object.getPrototypeOf(a))}},lt=new ar;var Ht=class f extends Et{static mExtensionCache=new WeakMap;mExtensionList;constructor(t){super(t),this.mExtensionList=new Array}deconstruct(){for(let t of this.mExtensionList)t.deconstruct();super.deconstruct()}setup(){return super.setup(),this.executeExtensions(),this}executeExtensions(){let t=(()=>{if(!f.mExtensionCache.has(this.processorConstructor)){let a=lt.get(Nt).filter(g=>{for(let y of g.processorConfiguration.targetRestrictions)if(this instanceof y||this.processorConstructor.prototype instanceof y||this.processorConstructor===y)return!0;return!1}),m={read:a.filter(g=>g.processorConfiguration.access===H.Read),write:a.filter(g=>g.processorConfiguration.access===H.Write),readWrite:a.filter(g=>g.processorConfiguration.access===H.ReadWrite)};f.mExtensionCache.set(this.processorConstructor,m)}return f.mExtensionCache.get(this.processorConstructor)})(),e=[...t.write,...t.readWrite,...t.read];for(let r of e)this.mExtensionList.push(new Nt(r.processorConstructor,this).setup())}};var At=class{mData;mInteractionType;mOrigin;get data(){return this.mData}get origin(){return this.mOrigin}get triggerType(){return this.mInteractionType}constructor(t,e,r){this.mInteractionType=t,this.mData=r,this.mOrigin=e}};var Lt=class f{static mCurrentZone=new f("Default");static get current(){return f.mCurrentZone}static create(t){return new f(t)}mInteractionListener;mName;mTriggerFilterBitmap;get name(){return this.mName}constructor(t){this.mName=t,this.mTriggerFilterBitmap=-1,this.mInteractionListener=new Map}addInteractionListener(t){return this.mInteractionListener.set(t,f.current),this}execute(t,...e){let r=f.mCurrentZone;f.mCurrentZone=this;try{return t(...e)}finally{f.mCurrentZone=r}}pushInteraction(t,e){if((this.mTriggerFilterBitmap&t)===0)return!1;if(this.mInteractionListener.size===0)return!0;let r=new At(t,this,e);for(let[a,m]of this.mInteractionListener.entries())m.execute(()=>{a.call(this,r)});return!0}removeInteractionListener(t){return t?(this.mInteractionListener.delete(t),this):(this.mInteractionListener.clear(),this)}setTriggerRestriction(t){return this.mTriggerFilterBitmap=t,this}};var G={get:1,set:2,manual:4};var Ie=class f{static ORIGINAL_TO_INTERACTION_MAPPING=new WeakMap;static PROXY_TO_ORIGINAL_MAPPING=new WeakMap;static UNTRACEABLE_FUNCTION_UPDATE_TRIGGER=(()=>{let t=new WeakMap;return t.set(Array.prototype.fill,G.set),t.set(Array.prototype.pop,G.get),t.set(Array.prototype.push,G.set),t.set(Array.prototype.shift,G.get),t.set(Array.prototype.unshift,G.set),t.set(Array.prototype.splice,G.set),t.set(Array.prototype.reverse,G.set),t.set(Array.prototype.sort,G.set),t.set(Array.prototype.concat,G.set),t.set(Map.prototype.clear,G.set),t.set(Map.prototype.delete,G.set),t.set(Map.prototype.set,G.set),t.set(Set.prototype.clear,G.set),t.set(Set.prototype.delete,G.set),t.set(Set.prototype.add,G.set),t})();static getOriginal(t){return f.PROXY_TO_ORIGINAL_MAPPING.get(t)??t}static getWrapper(t){let e=f.getOriginal(t);return f.ORIGINAL_TO_INTERACTION_MAPPING.get(e)}mProxyObject;mStateChangeCallback;get proxy(){return this.mProxyObject}constructor(t,e){let r=f.getWrapper(t);if(r)return r;this.mProxyObject=this.createProxyObject(t),this.mStateChangeCallback=e,f.PROXY_TO_ORIGINAL_MAPPING.set(this.mProxyObject,t),f.ORIGINAL_TO_INTERACTION_MAPPING.set(t,this)}convertToProxy(t){return t===null||typeof t!="object"&&typeof t!="function"?t:new f(t,this.mStateChangeCallback).proxy}createProxyObject(t){let e=(a,m,g)=>{let y=f.getOriginal(m);try{let T=a.call(y,...g);return this.convertToProxy(T)}finally{if(f.UNTRACEABLE_FUNCTION_UPDATE_TRIGGER.has(a)){let T=f.getWrapper(m);T&&T.dispatch(f.UNTRACEABLE_FUNCTION_UPDATE_TRIGGER.get(a))}}};return new Proxy(t,{apply:(a,m,g)=>{let y=a;try{let T=y.call(m,...g);return this.convertToProxy(T)}catch(T){if(!(T instanceof TypeError))throw T;return e(y,m,g)}},set:(a,m,g)=>{try{let y=g;return(y!==null&&typeof y=="object"||typeof y=="function")&&(y=f.getOriginal(y)),Reflect.set(a,m,y)}finally{this.dispatch(G.set)}},get:(a,m,g)=>{try{return this.convertToProxy(Reflect.get(a,m))}finally{this.dispatch(G.get)}},deleteProperty:(a,m)=>{try{return delete a[m]}finally{this.dispatch(G.set)}}})}dispatch(t){this.mStateChangeCallback(t)}};var W=class f{static reaction(t){let e=Lt.create("ComponentState reaction");e.addInteractionListener(r=>{(r.triggerType&G.set)!==0&&t()}),e.execute(()=>{t()})}static state(t){return(e,r)=>{if(r.static)throw new A("Event target is not for a static property.",f);let a=new WeakMap,m=(g,y)=>{a.set(g,new f(y,t))};return{init(g){return typeof g>"u"||m(this,g),g},set(g){a.has(this)?a.get(this).set(g):m(this,g)},get(){return a.has(this)||m(this,void 0),a.get(this).get()}}}}mConfiguration;mLinkedZones;mLinkedZonesArray;mValue;constructor(t,e){if(this.mLinkedZones=new Set,this.mLinkedZonesArray=new Array,this.mConfiguration={complexValue:e?.complexValue??!1,proxy:e?.proxy??!1},this.mConfiguration.proxy){if(typeof t!="object"||t===null)throw new A("Proxied component state value must be an object.",this);this.mValue=new Ie(t,r=>{switch(r){case G.set:return this.dispatchChange();case G.get:return this.linkCurrentZone()}}).proxy}else this.mValue=t}get(){return this.linkCurrentZone(),this.mValue}set(t){if(this.mConfiguration.proxy)throw new A("Proxy is not implemented yet.",this);!this.mConfiguration.complexValue&&this.mValue===t||(this.mValue=t,this.dispatchChange())}dispatchChange(){for(let t of this.mLinkedZonesArray)t.pushInteraction(G.set,this)}linkCurrentZone(){let t=Lt.current;this.mLinkedZones.has(t)||(this.mLinkedZones.add(t),this.mLinkedZonesArray.push(t))}};var Rt=class f{static mCurrentUpdateCycle=null;static openResheduledCycle(t,e){let r=!1;if(!f.mCurrentUpdateCycle){let a=performance.now();f.mCurrentUpdateCycle={initiator:t.initiator,startTime:a,forcedSync:t.forcedSync,runner:t.runner},r=!0}try{return e(f.mCurrentUpdateCycle)}finally{r&&(f.mCurrentUpdateCycle=null)}}static openUpdateCycle(t,e){let r=!1;if(!f.mCurrentUpdateCycle){let a=performance.now();f.mCurrentUpdateCycle={initiator:t.updater,startTime:a,forcedSync:t.runSync,runner:Symbol("Runner "+a)},r=!0}try{return e(f.mCurrentUpdateCycle)}finally{r&&(f.mCurrentUpdateCycle=null)}}static updateCycleRunId(t,e){if(t.initiator===e){let r=performance.now(),a=t;a.runner=Symbol("Runner "+r)}}static updateCyleStartTime(t){let e=performance.now(),r=t;r.startTime=e}};var Se=class extends Error{mChain;get chain(){return this.mChain}constructor(t,e){let r=e.slice(-20).map(a=>a.toString()).join(`
`);super(`${t}: 
${r}`),this.mChain=[...e]}};var Ce=class f{static mFrameTime=100;static mStackCap=100;static get frameTime(){return f.mFrameTime}static set frameTime(t){f.mFrameTime=t}static get stackCap(){return f.mStackCap}static set stackCap(t){f.mStackCap=t}mInteractionZone;mManualComponentState;mUpdateFunction;mUpdateRunCache;mUpdateStates;get zone(){return this.mInteractionZone}constructor(t){this.mUpdateRunCache=new WeakMap,this.mUpdateFunction=t.onUpdate,this.mManualComponentState=new W(Symbol("Manual Update")),this.mUpdateStates={chainCompleteHooks:new Pt,async:{hasSheduledTask:!1,hasRunningTask:!1,sheduledTaskIsResheduled:!1},sync:{running:!1},cycle:{chainedTask:null}},this.mInteractionZone=Lt.create("Update-Zone"),this.mInteractionZone.addInteractionListener(e=>{(e.triggerType&G.set)!==0&&this.runUpdateAsynchron(e,null)})}deconstruct(){this.mInteractionZone.removeInteractionListener()}executeInZone(t){return this.mInteractionZone.execute(t)}update(){let t=new At(G.manual,this.mInteractionZone,this.mManualComponentState);return this.runUpdateSynchron(t)}updateAsync(){let t=new At(G.manual,this.mInteractionZone,this.mManualComponentState);this.runUpdateAsynchron(t,null)}async waitForUpdate(){return this.mUpdateStates.async.hasSheduledTask?new Promise((t,e)=>{this.mUpdateStates.chainCompleteHooks.push((r,a)=>{a?e(a):t(r)})}):!1}executeTaskChain(t,e,r,a){if(a.length>f.stackCap)throw new Se("Call loop detected",a);let m=performance.now();if(!e.forcedSync&&m-e.startTime>f.frameTime)throw new ue;a.push(t);let g=this.mInteractionZone.execute(()=>this.mUpdateFunction.call(this))||r;if(Rt.updateCycleRunId(e,this),!this.mUpdateStates.cycle.chainedTask)return g;let y=this.mUpdateStates.cycle.chainedTask;return this.mUpdateStates.cycle.chainedTask=null,this.executeTaskChain(y,e,g,a)}releaseUpdateChainCompleteHooks(t,e){if(!this.mUpdateStates.chainCompleteHooks.top)return;let r;for(;r=this.mUpdateStates.chainCompleteHooks.pop();)r(t,e)}runUpdateAsynchron(t,e){if(this.mUpdateStates.async.hasRunningTask||this.mUpdateStates.async.sheduledTaskIsResheduled){this.mUpdateStates.cycle.chainedTask=t;return}if(this.mUpdateStates.async.hasSheduledTask)return;let r=a=>{this.mUpdateStates.async.hasRunningTask=!0,this.mUpdateStates.async.hasSheduledTask=!1,this.mUpdateStates.async.sheduledTaskIsResheduled=!1;let m=!1;try{this.runUpdateSynchron(t)}catch(g){g instanceof ue&&a.initiator===this&&(m=!0)}finally{this.mUpdateStates.async.hasRunningTask=!1}m&&this.runUpdateAsynchron(t,a)};this.mUpdateStates.async.hasSheduledTask=!0,e&&(this.mUpdateStates.async.sheduledTaskIsResheduled=!0),globalThis.requestAnimationFrame(()=>{e?Rt.openResheduledCycle(e,r):Rt.openUpdateCycle({updater:this,runSync:!1},r)})}runUpdateSynchron(t){if(this.mUpdateStates.sync.running)return this.mUpdateStates.cycle.chainedTask=t,!1;this.mUpdateStates.sync.running=!0;try{let e=Rt.openUpdateCycle({updater:this,runSync:!0},r=>{if(this.mUpdateRunCache.has(r.runner))return Rt.updateCyleStartTime(r),this.mUpdateRunCache.get(r.runner);let a=this.executeTaskChain(t,r,!1,new Array);return this.mUpdateRunCache.set(r.runner,a),a});return this.releaseUpdateChainCompleteHooks(e),e}catch(e){throw e instanceof ue||this.releaseUpdateChainCompleteHooks(!1,e),e}finally{this.mUpdateStates.sync.running=!1}}},ue=class extends Error{constructor(){super("Update resheduled")}};var Pe=class extends Ht{mUpdater;get updater(){return this.mUpdater}constructor(t){super(t),this.mUpdater=new Ce({label:t.constructor.name,onUpdate:()=>this.onUpdate()})}call(t,...e){return this.mUpdater.executeInZone(()=>super.call(t,...e))}deconstruct(){this.mUpdater.deconstruct(),super.deconstruct()}createProcessor(){return this.mUpdater.executeInZone(()=>super.createProcessor())}};var zt=class{mExpression;mTemporaryValues;constructor(t,e,r){if(this.mTemporaryValues=new k,r.length>0)for(let a of r)this.mTemporaryValues.set(a,void 0);this.mExpression=this.createEvaluationFunction(t,this.mTemporaryValues).bind(e.store)}execute(){return this.mExpression()}setTemporaryValue(t,e){if(!this.mTemporaryValues.has(t))throw new A(`Temporary value "${t}" does not exist for this procedure.`,this);this.mTemporaryValues.set(t,e)}createEvaluationFunction(t,e){let r,a=`__${Math.random().toString(36).substring(2)}`;if(r="return function () {",e.size>0)for(let m of e.keys())r+=`const ${m} = ${a}.get('${m}');`;return r+=`return ${t};`,r+="};",new Function(a,r)(e)}};var xt=class{mDataLevel;get data(){return this.mDataLevel}constructor(t){this.mDataLevel=t}createExpressionProcedure(t,e){return new zt(t,this.data,e??[])}setTemporaryValue(t,e){this.data.setTemporaryValue(t,e)}};var dt=class{mComponent;mDataProxy;mParentLevel;mTemporaryValues;get store(){return this.mDataProxy}constructor(t){this.mTemporaryValues=new k,t instanceof $?(this.mParentLevel=null,this.mComponent=t):(this.mParentLevel=t,this.mComponent=t.mComponent),this.mDataProxy=this.createAccessProxy()}deleteTemporaryValue(t){this.mTemporaryValues.delete(t)}setTemporaryValue(t,e){this.mTemporaryValues.set(t,e)}updateLevelData(t){if(t.mParentLevel!==this.mParentLevel)throw new A("Can't update InstructionLevelData for a deeper level than it target data.",this);this.mTemporaryValues=t.mTemporaryValues}createAccessProxy(){return new Proxy(new Object,{get:(t,e)=>this.getValue(e),set:(t,e,r)=>(this.hasTemporaryValue(e)&&this.setTemporaryValue(e,r),e in this.mComponent.processor?(this.mComponent.processor[e]=r,!0):(this.setTemporaryValue(e,r),!0)),deleteProperty:()=>{throw new A("Deleting properties is not allowed",this)},ownKeys:()=>[...new Set([...Object.keys(this.mComponent.processor),...this.getTemporaryValuesList()])]})}getTemporaryValuesList(){let t=this.mTemporaryValues.map(e=>e);return this.mParentLevel&&t.push(...this.mParentLevel.getTemporaryValuesList()),t}getValue(t){if(this.mTemporaryValues.has(t))return this.mTemporaryValues.get(t);if(this.mParentLevel)return this.mParentLevel.getValue(t);if(t in this.mComponent.processor)return this.mComponent.processor[t]}hasTemporaryValue(t){return this.mTemporaryValues.has(t)?!0:this.mParentLevel?this.mParentLevel.hasTemporaryValue(t):!1}};var $t=class f{mChildList;mInstruction;mInstructionType;get childList(){return this.mChildList}get instruction(){return this.mInstruction}get instructionType(){return this.mInstructionType}constructor(t,e){this.mChildList=Array(),this.mInstruction=e,this.mInstructionType=t}appendChild(...t){this.mChildList.push(...t)}clone(){let t=new f(this.instructionType,this.instruction);for(let e of this.mChildList)t.appendChild(e.clone());return t}equals(t){if(!(t instanceof f)||t.instruction!==this.instruction||t.instructionType!==this.instructionType||t.childList.length!==this.childList.length)return!1;for(let e=0;e<t.childList.length;e++)if(!t.childList[e].equals(this.childList[e]))return!1;return!0}removeChild(t){let e=this.mChildList.indexOf(t);if(e!==-1)return this.mChildList.splice(e,1)[0]}};var vt=class f{mExpression;get value(){return this.mExpression}constructor(t){this.mExpression=t}clone(){return new f(this.mExpression)}equals(t){return t instanceof f&&t.value===this.value}toString(){return`{{ ${this.mExpression} }}`}};var It=class f{mContainsExpression;mTextValue;mValues;get containsExpression(){return this.mContainsExpression}get values(){return this.mValues}constructor(){this.mTextValue="",this.mContainsExpression=!1,this.mValues=[]}addValue(...t){for(let e of t)(this.mContainsExpression===!0||e instanceof vt)&&(this.mContainsExpression=!0),this.mValues.push(e),this.mTextValue+=e.toString()}clone(){let t=new f;for(let e of this.values)typeof e=="string"?t.addValue(e):t.addValue(e.clone());return t}equals(t){if(!(t instanceof f)||t.values.length!==this.values.length)return!1;for(let e=0;e<this.values.length;e++){let r=this.values[e],a=t.values[e];if(r!==a&&(typeof r!=typeof a||typeof r=="string"&&r!==a||!a.equals(r)))return!1}return!0}toString(){return this.mTextValue}};var he=class f{mName;mValue;get name(){return this.mName}get values(){return this.mValue}constructor(t){this.mName=t,this.mValue=new It}clone(){let t=new f(this.name);for(let e of this.values.values)typeof e=="string"?t.values.addValue(e):t.values.addValue(e.clone());return t}equals(t){return!(!(t instanceof f)||t.name!==this.name||!t.values.equals(this.values))}};var St=class f{mAttributeDictionary;mChildList;mTagName;get attributes(){return[...this.mAttributeDictionary.values()]}get childList(){return this.mChildList}get tagName(){return this.mTagName}constructor(t){this.mAttributeDictionary=new Map,this.mChildList=Array(),this.mTagName=t}appendChild(...t){this.mChildList.push(...t)}clone(){let t=new f(this.tagName);for(let e of this.mAttributeDictionary.values()){let r=t.setAttribute(e.name);for(let a of e.values.values)typeof a=="string"?r.addValue(a):r.addValue(a.clone())}for(let e of this.mChildList)t.appendChild(e.clone());return t}equals(t){if(!(t instanceof f)||t.tagName!==this.tagName||t.attributes.length!==this.mAttributeDictionary.size||t.childList.length!==this.mChildList.length)return!1;for(let e of t.mAttributeDictionary.values()){let r=this.mAttributeDictionary.get(e.name);if(!r||!r.equals(e))return!1}for(let e=0;e<t.childList.length;e++)if(!t.childList[e].equals(this.mChildList[e]))return!1;return!0}getAttribute(t){return this.mAttributeDictionary.get(t)?.values??null}removeAttribute(t){return this.mAttributeDictionary.delete(t)}removeChild(t){let e=this.mChildList.indexOf(t);if(e!==-1)return this.mChildList.splice(e,1)[0]}setAttribute(t){if(this.mAttributeDictionary.has(t))return this.mAttributeDictionary.get(t).values;let e=new he(t);return this.mAttributeDictionary.set(t,e),e.values}};var ct=class f{mBodyElementList;get body(){return this.mBodyElementList}constructor(){this.mBodyElementList=new Array}appendChild(...t){this.mBodyElementList.push(...t)}clone(){let t=new f;for(let e of this.mBodyElementList)t.appendChild(e.clone());return t}equals(t){if(!(t instanceof f)||t.body.length!==this.mBodyElementList.length)return!1;for(let e=0;e<this.mBodyElementList.length;e++)if(!this.mBodyElementList[e].equals(t.body[e]))return!1;return!0}removeChild(t){let e=this.mBodyElementList.indexOf(t);if(e!==-1)return this.mBodyElementList.splice(e,1)[0]}};var st=class{mComponentValues;mContent;mModules;mTemplate;get anchor(){return this.mContent.contentAnchor}get content(){return this.mContent}get modules(){return this.mModules}get template(){return this.mTemplate}get values(){return this.mComponentValues}constructor(t,e,r,a){this.mTemplate=t,this.mComponentValues=r,this.mContent=a,this.mModules=e,a.setCoreBuilder(this)}deconstruct(){this.content.deconstruct()}update(){let t=this.onUpdate(),e=!1,r=this.content.builders;if(r.length>0)for(let a=0;a<r.length;a++)e=r[a].update()||e;return t||e}createHtmlElement(t){let e=t.tagName;if(typeof e!="string")throw e;if(e.includes("-")){let a=globalThis.customElements.get(e);if(typeof a<"u")return new a}let r=t.getAttribute("xmlns");return r&&!r.containsExpression?document.createElementNS(r.values[0],e):document.createElement(e)}createTextNode(t){return document.createTextNode(t)}};var Xt=class{mChildBuilderList;mChildComponents;mContentAnchor;mContentBoundary;mLinkedContent;mRootChildList;get body(){return this.mRootChildList}get builders(){return this.mChildBuilderList}get contentAnchor(){return this.mContentAnchor}constructor(t){this.mChildBuilderList=new Array,this.mRootChildList=new Array,this.mChildComponents=new Map,this.mLinkedContent=new WeakSet,this.mContentAnchor=document.createComment(t),this.mContentBoundary={start:this.mContentAnchor,end:this.mContentAnchor}}deconstruct(){this.onDeconstruct();let t;for(;t=this.mChildBuilderList.pop();)t.deconstruct();for(let r of this.mChildComponents.values())r.deconstruct();this.mChildComponents.clear();let e;for(;e=this.mRootChildList.pop();)e instanceof st||e.remove();this.contentAnchor.remove()}getBoundary(){let t=this.mContentBoundary.end instanceof st?this.mContentBoundary.end.content.getBoundary().end:this.mContentBoundary.end;return{start:this.mContentBoundary.start,end:t}}insert(t,e,r){if(!this.mLinkedContent.has(r))throw new A("Can't add content to builder. Target is not part of builder.",this);let a=t instanceof st?t.anchor:t;switch(e){case"After":{this.insertAfter(a,r);break}case"TopOf":{this.insertTop(a,r);break}case"BottomOf":{this.insertBottom(a,r);break}}this.mLinkedContent.add(t),t instanceof st?this.mChildBuilderList.push(t):this.addChildComponent(t);let m=a.parentElement??a.getRootNode(),g=this.mContentAnchor.parentElement??this.mContentAnchor.getRootNode();if(m===g){let y=(()=>{switch(e){case"After":return this.mRootChildList.indexOf(r)+1;case"TopOf":return 0;case"BottomOf":return this.mRootChildList.length}})();y===this.mRootChildList.length&&(this.mContentBoundary.end=t),this.mRootChildList.splice(y+1,0,t)}}remove(t){if(!this.mLinkedContent.has(t))throw new A("Child node cant be deleted from builder when it not a child of them",this);if(this.mLinkedContent.delete(t),t instanceof st){let r=this.mChildBuilderList.indexOf(t);r!==-1&&this.mChildBuilderList.splice(r,1),t.deconstruct()}else{let r=this.mChildComponents.get(t);r&&(r.deconstruct(),this.mChildComponents.delete(t)),t.remove()}let e=this.mRootChildList.indexOf(t);e!==-1&&(this.mRootChildList.splice(e,1),this.mContentBoundary.end=this.mRootChildList.at(-1)??this.mContentAnchor)}setCoreBuilder(t){this.mLinkedContent.add(t)}addChildComponent(t){tt.elementIsComponent(t)&&this.mChildComponents.set(t,tt.ofElement(t).component)}insertAfter(t,e){let r=e instanceof st?e.content.getBoundary().end:e;(r.parentElement??r.getRootNode()).insertBefore(t,r.nextSibling)}insertBottom(t,e){if(e instanceof st){this.insertAfter(t,e);return}if(e instanceof Element){e.appendChild(t);return}throw new A("Source node does not support child nodes.",this)}insertTop(t,e){if(e instanceof st){this.insertAfter(t,e.anchor);return}if(e instanceof Element){e.prepend(t);return}throw new A("Source node does not support child nodes.",this)}};var Me=class extends Xt{mAttributeModulesChangedOrder;mLinkedAttributeData;mLinkedAttributeExpressionModules;mLinkedAttributeModuleList;mLinkedExpressionModuleList;get linkedAttributeModules(){return this.mAttributeModulesChangedOrder&&(this.mAttributeModulesChangedOrder=!1,this.mLinkedAttributeModuleList.sort((t,e)=>t.accessMode-e.accessMode)),this.mLinkedAttributeModuleList}get linkedExpressionModules(){return this.mLinkedExpressionModuleList}constructor(t){super(t),this.mLinkedExpressionModuleList=new Array,this.mLinkedAttributeModuleList=new Array,this.mLinkedAttributeExpressionModules=new WeakMap,this.mLinkedAttributeData=new WeakMap,this.mAttributeModulesChangedOrder=!1}attributeOfLinkedExpressionModule(t){return this.mLinkedAttributeExpressionModules.get(t)}getLinkedAttributeData(t){if(!this.mLinkedAttributeData.has(t))throw new A("Attribute has no linked data.",this);return this.mLinkedAttributeData.get(t)}linkAttributeExpression(t,e){this.mLinkedAttributeExpressionModules.set(t,e)}linkAttributeModule(t){this.mLinkedAttributeModuleList.push(t),this.mAttributeModulesChangedOrder=!0}linkAttributeNodes(t,e,r){this.mLinkedAttributeData.set(t,{values:r,node:e})}linkExpressionModule(t){this.mLinkedExpressionModuleList.push(t)}onDeconstruct(){for(let t of this.mLinkedAttributeModuleList)t.deconstruct();for(let t of this.mLinkedExpressionModuleList)t.deconstruct()}};var Ne=class extends Xt{mInstructionModule;get instructionModule(){return this.mInstructionModule}constructor(t,e){super(e),this.mInstructionModule=t}onDeconstruct(){this.mInstructionModule.deconstruct()}};var Ae=class extends st{constructor(t,e,r){let a=e.createInstructionModule(t,r);super(t,e,r,new Ne(a,`Instruction - {$${t.instructionType}}`))}onUpdate(){if(this.content.instructionModule.update()){let t=this.content.body;this.updateStaticBuilder(t,this.content.instructionModule.instructionResult.elementList)}return!1}insertNewContent(t,e){let r=new Yt(t.template,this.modules,t.dataLevel,`Child - {$${this.template.instructionType}}`);return e===null?this.content.insert(r,"TopOf",this):this.content.insert(r,"After",e),r}updateStaticBuilder(t,e){let a=new ne((y,T)=>T.template.equals(y.template)).differencesOf(t,e),m=0,g=null;for(let y=0;y<a.length;y++){let T=a[y];if(T.changeState===Dt.Remove)this.content.remove(T.item);else if(T.changeState===Dt.Insert)g=this.insertNewContent(T.item,g),m++;else{let S=e[m].dataLevel;T.item.values.updateLevelData(S),g=T.item,m++}}}};var Yt=class extends st{mInitialized;constructor(t,e,r,a){super(t,e,r,new Me(`Static - {${a}}`)),this.mInitialized=!1}onUpdate(){this.mInitialized||(this.mInitialized=!0,this.buildTemplate([this.template],this));let t=!1,e=this.content.linkedAttributeModules;for(let m=0;m<e.length;m++)t=e[m].update()||t;let r=!1,a=this.content.linkedExpressionModules;for(let m=0;m<a.length;m++){let g=a[m];if(g.update()){r=!0;let y=this.content.attributeOfLinkedExpressionModule(g);if(!y)continue;let T=this.content.getLinkedAttributeData(y),S=T.values.reduce((c,n)=>c+n.data,"");T.node.setAttribute(y.name,S)}}return t||r}buildInstructionTemplate(t,e){this.content.insert(new Ae(t,this.modules,new dt(this.values)),"BottomOf",e)}buildStaticTemplate(t,e){let r=this.createHtmlElement(t);this.content.insert(r,"BottomOf",e);for(let a of t.attributes){let m=this.modules.createAttributeModule(a,r,this.values);if(m){this.content.linkAttributeModule(m);continue}if(a.values.containsExpression){let g=new Array;for(let y of a.values.values){let T=this.createTextNode("");if(g.push(T),!(y instanceof vt)){T.data=y;continue}let S=this.modules.createExpressionModule(y,T,this.values);this.content.linkExpressionModule(S),this.content.linkAttributeExpression(S,a)}this.content.linkAttributeNodes(a,r,g);continue}r.setAttribute(a.name,a.values.toString())}this.content.insert(r,"BottomOf",e),this.buildTemplate(t.childList,r)}buildTemplate(t,e){for(let r of t)r instanceof ct?this.buildTemplate(r.body,e):r instanceof It?this.buildTextTemplate(r,e):r instanceof $t?this.buildInstructionTemplate(r,e):r instanceof St&&this.buildStaticTemplate(r,e)}buildTextTemplate(t,e){for(let r of t.values){if(typeof r=="string"){this.content.insert(this.createTextNode(r),"BottomOf",e);continue}let a=this.createTextNode("");this.content.insert(a,"BottomOf",e);let m=this.modules.createExpressionModule(r,a,this.values);this.content.linkExpressionModule(m)}}};var de=class{mHtmlElement;mShadowRoot;get htmlElement(){return this.mHtmlElement}get shadowRoot(){return this.mShadowRoot}constructor(t){this.mHtmlElement=t,this.mShadowRoot=this.mHtmlElement.attachShadow({mode:"open"})}};var U=class{mDataLevel;get data(){return this.mDataLevel}constructor(t){this.mDataLevel=t}createExpressionProcedure(t,e){return new zt(t,this.data,e??[])}};var Ot=class extends Ht{constructor(t){super({constructor:t.constructor,parent:t.parent}),this.setProcessorInjection(U,new U(t.values))}deconstruct(){super.deconstruct(),this.call("onDeconstruct")}update(){return this.onUpdate()}};var Q=class{mValue;get value(){return this.mValue}constructor(t){this.mValue=t}};var Z=class{constructor(){throw new A("Reference should not be instanced.",this)}};var mt=class{constructor(){throw new A("Reference should not be instanced.",this)}};var Ft=class f extends Ot{mLastResult;mTargetTextNode;constructor(t){super({constructor:t.constructor,parent:t.parent,values:t.values}),this.mTargetTextNode=t.targetNode,this.mLastResult=null,this.setProcessorInjection(f,this),this.setProcessorInjection(mt,t.targetTemplate.clone()),this.setProcessorInjection(Z,t.targetNode),this.setProcessorInjection(Q,new Q(t.targetTemplate.value))}onUpdate(){let t=this.call("onUpdate");t===null&&(t="");let e=this.mLastResult===null||this.mLastResult!==t;if(e){let r=this.mTargetTextNode;r.data=t,this.mLastResult=t}return e}};function lr(){return(f,t)=>{O.registerInjectable(f,t.metadata,"instanced"),lt.register(Ft,f,{})}}function bi(){function f(c,n){return function(l){e(n,"addInitializer"),r(l,"An initializer"),c.push(l)}}function t(c,n,u,l,o,b,v,D,w){var p;switch(o){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+n:n,static:b,private:v,metadata:D},d={v:!1};s.addInitializer=f(l,d);var i,h;o===0?v?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):o===2?i=function(){return u.value}:((o===1||o===3)&&(i=function(){return u.get.call(this)}),(o===1||o===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return c(w,s)}finally{d.v=!0}}function e(c,n){if(c.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(c,n){if(typeof c!="function")throw new TypeError(n+" must be a function")}function a(c,n){var u=typeof n;if(c===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(u!=="function"){var l;throw c===0?l="field":c===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function m(c,n,u,l,o,b,v,D,w){var p=u[0],s,d,i;v?o===0||o===1?s={get:u[3],set:u[4]}:o===3?s={get:u[3]}:o===4?s={set:u[3]}:s={value:u[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var h,x,C;if(typeof p=="function")h=t(p,l,s,D,o,b,v,w,i),h!==void 0&&(a(o,h),o===0?d=h:o===1?(d=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h);else for(var P=p.length-1;P>=0;P--){var M=p[P];if(h=t(M,l,s,D,o,b,v,w,i),h!==void 0){a(o,h);var N;o===0?N=h:o===1?(N=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(o===0||o===1){if(d===void 0)d=function(I,E){return E};else if(typeof d!="function"){var _=d;d=function(I,E){for(var L=E,R=0;R<_.length;R++)L=_[R].call(I,L);return L}}else{var V=d;d=function(I,E){return V.call(I,E)}}c.push(d)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),v?o===1?(c.push(function(I,E){return i.get.call(I,E)}),c.push(function(I,E){return i.set.call(I,E)})):o===2?c.push(i):c.push(function(I,E){return i.call(I,E)}):Object.defineProperty(n,l,s))}function g(c,n,u){for(var l=[],o,b,v=new Map,D=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,C;if(h?(x=c,s=s-5,b=b||[],C=b):(x=c.prototype,o=o||[],C=o),s!==0&&!i){var P=h?D:v,M=P.get(d)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!M&&s>2?P.set(d,s):P.set(d,!0)}m(l,x,p,d,s,h,i,C,u)}}return y(l,o),y(l,b),l}function y(c,n){n&&c.push(function(u){for(var l=0;l<n.length;l++)n[l].call(u);return u})}function T(c,n,u){if(n.length>0){for(var l=[],o=c,b=c.name,v=n.length-1;v>=0;v--){var D={v:!1};try{var w=n[v](o,{kind:"class",name:b,addInitializer:f(l,D),metadata:u})}finally{D.v=!0}w!==void 0&&(a(10,w),o=w)}return[S(o,u),function(){for(var p=0;p<l.length;p++)l[p].call(o)}]}}function S(c,n){return Object.defineProperty(c,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,l,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),D=g(n,u,v);return l.length||S(n,v),{e:D,get c(){return T(n,l,v)}}}}function vr(f,t,e,r){return(vr=bi())(f,t,e,r)}var yr,pr,cr;yr=lr();var gr=class{static{({c:[cr,pr]}=vr(this,[],[yr]))}constructor(t=O.use(U),e=O.use(Q)){this.mProcedure=t.createExpressionProcedure(e.value)}mProcedure;onUpdate(){let t=this.mProcedure.execute();return typeof t>"u"?null:t?.toString()}static{pr()}};var rt=class{mName;mValue;get name(){return this.mName}get value(){return this.mValue}constructor(t,e){this.mName=t,this.mValue=e}};var yt=class f extends Ot{mAccessMode;get accessMode(){return this.mAccessMode}constructor(t){super({constructor:t.constructor,parent:t.parent,values:t.values}),this.mAccessMode=t.accessMode,this.setProcessorInjection(f,this),this.setProcessorInjection(mt,t.targetTemplate.clone()),this.setProcessorInjection(Z,t.targetNode),this.setProcessorInjection(rt,new rt(t.targetTemplate.name,t.targetTemplate.values.toString()))}onUpdate(){return this.call("onUpdate")??!1}};var ut=class{mDataLevels;mElementList;mTemplates;get elementList(){return this.mElementList}constructor(){this.mElementList=new Array,this.mTemplates=new Set,this.mDataLevels=new Set}addElement(t,e){if(this.mTemplates.has(t)||this.mDataLevels.has(e))throw new A("Can't add same template or values for multiple Elements.",this);this.mTemplates.add(t),this.mDataLevels.add(e),this.mElementList.push({template:t,dataLevel:e})}};var _t=class f extends Ot{mLastResult;get instructionResult(){return this.mLastResult}constructor(t){super({constructor:t.constructor,parent:t.parent,values:t.values}),this.setProcessorInjection(f,this),this.setProcessorInjection(mt,t.targetTemplate.clone()),this.setProcessorInjection(Q,new Q(t.targetTemplate.instruction)),this.mLastResult=new ut}onUpdate(){let t=this.call("onUpdate");return t instanceof ut?(this.mLastResult=t,!0):!1}};var Le=class f{static mAttributeModuleCache=new k;static mExpressionModuleCache=new WeakMap;static mInstructionModuleCache=new k;mComponent;mExpressionModule;constructor(t,e){this.mExpressionModule=e??cr,this.mComponent=t}createAttributeModule(t,e,r){let a=(()=>{let m=f.mAttributeModuleCache.get(t.name);if(m||m===null)return m;for(let g of lt.get(yt))if(g.processorConfiguration.selector.test(t.name))return f.mAttributeModuleCache.set(t.name,g),g;return f.mAttributeModuleCache.set(t.name,null),null})();return a===null?null:new yt({accessMode:a.processorConfiguration.access,constructor:a.processorConstructor,parent:this.mComponent,targetNode:e,targetTemplate:t,values:r}).setup()}createExpressionModule(t,e,r){let a=(()=>{let m=f.mExpressionModuleCache.get(this.mExpressionModule);if(m)return m;let g=lt.get(Ft).find(y=>y.processorConstructor===this.mExpressionModule);if(!g)throw new A("An expression module could not be found.",this);return f.mExpressionModuleCache.set(this.mExpressionModule,g),g})();return new Ft({constructor:a.processorConstructor,parent:this.mComponent,targetNode:e,targetTemplate:t,values:r}).setup()}createInstructionModule(t,e){let r=(()=>{let a=f.mInstructionModuleCache.get(t.instructionType);if(a)return a;for(let m of lt.get(_t))if(m.processorConfiguration.instructionType===t.instructionType)return f.mInstructionModuleCache.set(t.instructionType,m),m;throw new A(`Instruction module type "${t.instructionType}" not found.`,this)})();return new _t({constructor:r.processorConstructor,parent:this.mComponent,targetTemplate:t,values:e}).setup()}};var Gt=class extends A{mColumnEnd;mColumnStart;mLineEnd;mLineStart;get columnEnd(){return this.mColumnEnd}get columnStart(){return this.mColumnStart}get lineEnd(){return this.mLineEnd}get lineStart(){return this.mLineStart}constructor(t,e,r,a,m,g,y){super(t,e,y),this.mColumnStart=r,this.mLineStart=a,this.mColumnEnd=m,this.mLineEnd=g}};var Wt=class{mDependencyFetch;mDependencyFetchResolved;mLexer;mMeta;mPattern;mPatternDependencies;mType;get dependencies(){return this.mPatternDependencies}get dependenciesResolved(){return this.mDependencyFetchResolved}get lexer(){return this.mLexer}get meta(){return this.mMeta}get pattern(){return this.mPattern}constructor(t,e){if(this.mLexer=t,this.mType=e.type,this.mMeta=e.metadata,this.mPatternDependencies=new Array,this.mDependencyFetch=e.dependencyFetch??null,this.mDependencyFetchResolved=!e.dependencyFetch,this.mType==="split"&&!this.mDependencyFetch)throw new A("Split token with a start and end token, need inner token definitions.",this);if(this.mType==="single"&&this.mDependencyFetch)throw new A("Pattern does not allow inner token pattern.",this);this.mPattern=this.convertTokenPattern(this.mType,e.pattern)}isSplit(){return this.mType==="split"}resolveDependencies(){this.mDependencyFetchResolved||(this.mDependencyFetch(this),this.mDependencyFetchResolved=!0)}useChildPattern(t){if(this.mLexer!==t.lexer)throw new A("Can only add dependencies of the same lexer.",this);this.mPatternDependencies.push(t)}convertTokenPattern(t,e){if("single"in e){if(t==="split")throw new A("Can't use split pattern type with single pattern definition.",this);return{start:{regex:e.single.regex,types:e.single.types,validator:e.single.validator??null}}}else{if(t==="single")throw new A("Can't use single pattern type with split pattern definition.",this);return{start:{regex:e.start.regex,types:e.start.types,validator:e.start.validator??null},end:{regex:e.end.regex,types:e.end.types,validator:e.end.validator??null},innerType:e.innerType??null}}}};var Zt=class{mColumnNumber;mLineNumber;mMetas;mType;mValue;get columnNumber(){return this.mColumnNumber}get lineNumber(){return this.mLineNumber}get metas(){return[...this.mMetas]}get type(){return this.mType}get value(){return this.mValue}constructor(t,e,r,a){this.mValue=e,this.mColumnNumber=r,this.mLineNumber=a,this.mType=t,this.mMetas=new Set}addMeta(...t){for(let e of t)this.mMetas.add(e)}hasMeta(t){return this.mMetas.has(t)}};var me=class{mRootPattern;mSettings;get errorType(){return this.mSettings.errorType}set errorType(t){this.mSettings.errorType=t}get trimWhitespace(){return this.mSettings.trimSpaces}set trimWhitespace(t){this.mSettings.trimSpaces=t}get validWhitespaces(){return[...this.mSettings.whiteSpaces].join("")}set validWhitespaces(t){this.mSettings.whiteSpaces=new Set(t.split(""))}constructor(){this.mSettings={errorType:null,trimSpaces:!0,whiteSpaces:new Set},this.mRootPattern=new Wt(this,{type:"single",pattern:{single:{regex:/^/,types:{},validator:null}},metadata:[],dependencyFetch:null})}createTokenPattern(t,e){let r=y=>typeof y=="string"?{token:y}:y,a=y=>{let T=new Set(y.flags.split(""));return new RegExp(`^(?<token>${y.source})`,[...T].join(""))},m=new Array;t.meta&&(typeof t.meta=="string"?m.push(t.meta):m.push(...t.meta));let g;return"regex"in t.pattern?g={single:{regex:a(t.pattern.regex),types:r(t.pattern.type),validator:t.pattern.validator??null}}:g={start:{regex:a(t.pattern.start.regex),types:r(t.pattern.start.type),validator:t.pattern.start.validator??null},end:{regex:a(t.pattern.end.regex),types:r(t.pattern.end.type),validator:t.pattern.end.validator??null},innerType:t.pattern.innerType??null},new Wt(this,{type:"regex"in t.pattern?"single":"split",pattern:g,metadata:m,dependencyFetch:e??null})}*tokenize(t,e){let r={data:t,cursor:{position:0,column:1,line:1},error:null,progressTracker:e??null};yield*this.tokenizeRecursionLayer(r,this.mRootPattern,new Array,null)}useRootTokenPattern(t){if(t.lexer!==this)throw new A("Token pattern must be created by this lexer.",this);this.mRootPattern.useChildPattern(t)}findNextStartToken(t,e,r,a){for(let m of e){let g=m.pattern.start,y=this.matchToken(m,g,t,r,a);if(y!==null)return{pattern:m,token:y}}return null}findTokenTypeOfMatch(t,e,r){for(let g in t.groups){let y=t.groups[g],T=e[g];if(!(!y||!T)){if(y.length!==t[0].length)throw new A("A group of a token pattern must match the whole token.",this);return T}}let a=new Array;for(let g in t.groups)t.groups[g]&&a.push(g);let m=new Array;for(let g in e)m.push(g);throw new A(`No token type found for any defined pattern regex group. Full: "${t[0]}", Matches: "${a.join(", ")}", Available: "${m.join(", ")}", Regex: "${r.source}"`,this)}*generateErrorToken(t,e){if(!t.error||!this.mSettings.errorType)return;let r=new Zt(this.mSettings.errorType,t.error.data,t.error.startColumn,t.error.startLine);r.addMeta(...e),t.error=null,yield r}generateToken(t,e,r,a,m,g){let y=r[0],T=this.findTokenTypeOfMatch(r,a,g),S=new Zt(m??T,y,t.cursor.column,t.cursor.line);return S.addMeta(...e),S}matchToken(t,e,r,a,m){let g=e.regex;g.lastIndex=0;let y=g.exec(r.data);if(!y||y.index!==0)return null;let T=this.generateToken(r,[...a,...t.meta],y,e.types,m,g);if(e.validator){let S=r.data.substring(T.value.length);if(!e.validator(T,S,r.cursor.position))return null}return this.moveCursor(r,T.value),T}moveCursor(t,e){let r=e.split(`
`);r.length>1&&(t.cursor.column=1),t.cursor.line+=r.length-1,t.cursor.column+=r.at(-1).length,t.cursor.position+=e.length,t.data=t.data.substring(e.length),this.trackProgress(t)}pushNextCharToErrorState(t){if(!this.mSettings.errorType)throw new Gt(`Unable to parse next token. No valid pattern found for "${t.data.substring(0,20)}".`,this,t.cursor.column,t.cursor.line,t.cursor.column,t.cursor.line);t.error||(t.error={data:"",startColumn:t.cursor.column,startLine:t.cursor.line});let e=t.data.charAt(0);t.error.data+=e,this.moveCursor(t,e)}skipNextWhitespace(t){let e=t.data.charAt(0);return!this.mSettings.trimSpaces||!this.mSettings.whiteSpaces.has(e)?!1:(this.moveCursor(t,e),!0)}*tokenizeRecursionLayer(t,e,r,a){let m=e.dependencies;for(;t.data.length>0;){if(!t.error&&this.skipNextWhitespace(t))continue;if(e.isSplit()){let T=this.matchToken(e,e.pattern.end,t,r,a);if(T!==null){yield*this.generateErrorToken(t,r),yield T;return}}let g=this.findNextStartToken(t,m,r,a);if(!g){this.pushNextCharToErrorState(t);continue}yield*this.generateErrorToken(t,r),yield g.token;let y=g.pattern;y.isSplit()&&(y.resolveDependencies(),yield*this.tokenizeRecursionLayer(t,y,[...r,...y.meta],a??y.pattern.innerType))}yield*this.generateErrorToken(t,r)}trackProgress(t){t.progressTracker!==null&&t.progressTracker(t.cursor.position,t.cursor.line,t.cursor.column)}};var X=class extends Error{static PARSER_ERROR=Symbol("PARSER_ERROR");mTrace;get columnEnd(){return this.mTrace.top.range.columnEnd}get columnStart(){return this.mTrace.top.range.columnStart}get graph(){return this.mTrace.top.graph}get incidents(){return this.mTrace.incidents}get lineEnd(){return this.mTrace.top.range.lineEnd}get lineStart(){return this.mTrace.top.range.lineStart}constructor(t){super(t.top.message,{cause:t.top.cause}),this.mTrace=t}};var Re=class{mIncidents;mTop;get incidents(){if(this.mIncidents===null)throw new A("A complete incident list is only available on debug mode.",this);return this.mIncidents}get top(){return this.mTop}constructor(t){this.mTop={message:"Unknown parser error",priority:0,graph:null,range:{lineStart:1,columnStart:1,lineEnd:1,columnEnd:1},cause:null},t?this.mIncidents=new Array:this.mIncidents=null}push(t,e,r,a,m,g,y=!1,T=null){let S;if(y?S=this.mTop.priority+1:S=m*1e4+g,this.mIncidents!==null){let c={message:t,priority:S,graph:e,range:{lineStart:r,columnStart:a,lineEnd:m,columnEnd:g},cause:T};this.mIncidents.push(c)}this.mTop&&S<this.mTop.priority||this.setTop({message:t,priority:S,graph:e,range:{lineStart:r,columnStart:a,lineEnd:m,columnEnd:g},cause:T})}setTop(t){this.mTop=t}};var Oe=class f{static MAX_JUNCTION_CIRCULAR_REFERENCES=1e3;mGraphStack;mIncidentTrace;mLastTokenPosition;mProcessStack;mTokenCache;mTokenGenerator;mTrimTokenCache;get currentGraph(){return this.mGraphStack.top.graph}get currentToken(){let t=this.mGraphStack.top;return this.mTokenCache[t.token.cursor]}get incidentTrace(){return this.mIncidentTrace}get processStack(){return this.mProcessStack}constructor(t,e,r){this.mTokenGenerator=t,this.mGraphStack=new Pt,this.mLastTokenPosition={column:1,line:1},this.mTokenCache=new Array,this.mProcessStack=new Pt,this.mTrimTokenCache=r,this.mIncidentTrace=new Re(e),this.mGraphStack.push({graph:null,linear:!0,circularGraphs:new k,token:{start:0,cursor:-1}})}collapse(){let t=this.mGraphStack.top,e=this.mTokenCache.slice(t.token.cursor);e.length!==0&&e.at(-1)===null&&e.pop();for(let r of this.mTokenGenerator)e.push(r);return e}getGraphBoundingToken(){let t=this.mGraphStack.top,e=this.mTokenCache[t.token.start],r=this.mTokenCache[t.token.cursor-1];return e??=r,r??=e,[e??null,r??null]}getGraphPosition(){let t=this.mGraphStack.top,e,r;if(e=this.mTokenCache[t.token.start],r=this.mTokenCache[t.token.cursor-1],e??=r,r??=e,!e||!r)return{graph:t.graph,columnEnd:this.mLastTokenPosition.column,columnStart:this.mLastTokenPosition.column,lineEnd:this.mLastTokenPosition.line,lineStart:this.mLastTokenPosition.line};let a,m;if(r.value.includes(`
`)){let g=r.value.split(`
`);m=r.lineNumber+g.length-1,a=1+g[g.length-1].length}else a=r.columnNumber+r.value.length,m=r.lineNumber;return{graph:t.graph,lineStart:e.lineNumber,columnStart:e.columnNumber,lineEnd:m,columnEnd:a}}getTokenPosition(){let t=this.mGraphStack.top,e=this.currentToken;if(!e)return{graph:t.graph,columnEnd:this.mLastTokenPosition.column,columnStart:this.mLastTokenPosition.column,lineEnd:this.mLastTokenPosition.line,lineStart:this.mLastTokenPosition.line};let r,a;if(e.value.includes(`
`)){let m=e.value.split(`
`);a=e.lineNumber+m.length-1,r=1+m[m.length-1].length}else r=e.columnNumber+e.value.length,a=e.lineNumber;return{graph:t.graph,lineStart:e.lineNumber,columnStart:e.columnNumber,lineEnd:a,columnEnd:r}}graphIsCircular(t){let e=this.mGraphStack.top;if(!e.circularGraphs.has(t))return!1;if(t.isJunction){if(e.circularGraphs.get(t)>f.MAX_JUNCTION_CIRCULAR_REFERENCES)throw new A("Junction graph called circular too often.",this);return!1}return!0}moveNextToken(){let t=this.mGraphStack.top;if(t.circularGraphs.size>0&&(t.circularGraphs=new k),t.graph&&t.graph.isJunction)throw new A("Junction graph must not have own nodes.",this);if(t.token.cursor++,t.token.cursor<this.mTokenCache.length)return;let e=this.mTokenGenerator.next();if(e.done){this.mTokenCache.push(null);return}this.mLastTokenPosition.column=e.value.columnNumber,this.mLastTokenPosition.line=e.value.lineNumber,this.mTokenCache.push(e.value)}popGraphStack(t){let e=this.mGraphStack.pop(),r=this.mGraphStack.top;if(t&&(e.token.cursor=e.token.start),e.token.cursor!==e.token.start&&r.circularGraphs.size>0&&(r.circularGraphs=new k),!this.mTrimTokenCache){r.token.cursor=e.token.cursor;return}e.linear?(this.mTokenCache.splice(0,e.token.cursor),r.token.start=0,r.token.cursor=0):r.token.cursor=e.token.cursor}pushGraphStack(t,e){let r=this.mGraphStack.top,a={graph:t,linear:e&&r.linear,circularGraphs:new k(r.circularGraphs),token:{start:r.token.cursor,cursor:r.token.cursor}},m=a.circularGraphs.get(t)??0;a.circularGraphs.set(t,m+1),this.mGraphStack.push(a)}};var fe=class f{static NODE_NULL_RESULT=Symbol("FAILED_NODE_VALUE_PARSE");static NODE_VALUE_LIST_END_MEET=Symbol("FAILED_NODE_VALUE_PARSE");mConfiguration;mLexer;mRootPart;get lexer(){return this.mLexer}constructor(t,e){this.mLexer=t,this.mRootPart=null,this.mConfiguration={keepTraceIncidents:!1,trimTokenCache:!1,...e}}parse(t,e){if(this.mRootPart===null)throw new A("Parser has not root part set.",this);let r=new Oe(this.mLexer.tokenize(t,e),this.mConfiguration.keepTraceIncidents,this.mConfiguration.trimTokenCache),a=(()=>{try{return this.beginParseProcess(r,this.mRootPart)}catch(g){if(g instanceof Gt)return r.incidentTrace.push(g.message,r.currentGraph,g.lineStart,g.columnStart,g.lineEnd,g.columnEnd,!0,g),X.PARSER_ERROR;let y=g instanceof Error?g.message:g.toString(),T=r.getGraphPosition();return r.incidentTrace.push(y,r.currentGraph,T.lineStart,T.columnStart,T.lineEnd,T.columnEnd,!0,g),X.PARSER_ERROR}})();if(a===X.PARSER_ERROR)throw new X(r.incidentTrace);let m=r.collapse();if(m.length!==0){let g=m[0];if(r.incidentTrace.top.range.lineEnd===1&&r.incidentTrace.top.range.columnEnd===1){let y=`Tokens could not be parsed. Graph end meet without reaching last token. Current: "${g.value}" (${g.type})`;r.incidentTrace.push(y,this.mRootPart,g.lineNumber,g.columnNumber,g.lineNumber,g.columnNumber)}throw new X(r.incidentTrace)}return a}setRootGraph(t){this.mRootPart=t}beginParseProcess(t,e){t.moveNextToken(),t.processStack.push({type:"graph-parse",parameter:{graph:e,linear:!0},state:0});let r=f.NODE_NULL_RESULT;for(;t.processStack.top;)r=this.processStack(t,t.processStack.top,r);return r}processChainedNodeParseProcess(t,e,r){switch(e.state){case 0:{let g=e.parameter.node.connections.next;return g===null?(t.processStack.pop(),{}):(e.state++,t.processStack.push({type:"node-parse",parameter:{node:g},state:0,values:{}}),f.NODE_NULL_RESULT)}case 1:{let a=r;return a===X.PARSER_ERROR?(t.processStack.pop(),X.PARSER_ERROR):(t.processStack.pop(),a)}}throw new A(`Invalid node next parse state "${e.state}".`,this)}processGraphParseProcess(t,e,r){let a=e.parameter.graph;switch(e.state){case 0:{if(t.graphIsCircular(a)){let g=t.getGraphPosition();return t.incidentTrace.push("Circular graph detected.",a,g.lineStart,g.columnStart,g.lineEnd,g.columnEnd),t.processStack.pop(),X.PARSER_ERROR}let m=e.parameter.linear;return t.pushGraphStack(a,m),e.state++,t.processStack.push({type:"node-parse",parameter:{node:a.node},state:0,values:{}}),f.NODE_NULL_RESULT}case 1:{let m=r;if(m===X.PARSER_ERROR)return t.popGraphStack(!0),t.processStack.pop(),X.PARSER_ERROR;let g=a.convert(m,t);if(typeof g=="symbol"){let y=t.getGraphPosition();return t.incidentTrace.push(g.description??"Unknown data convert error",y.graph,y.lineStart,y.columnStart,y.lineEnd,y.columnEnd),t.popGraphStack(!0),t.processStack.pop(),X.PARSER_ERROR}return t.popGraphStack(!1),t.processStack.pop(),g}}throw new A(`Invalid graph parse state "${e.state}".`,this)}processNodeParseProcess(t,e,r){let a=e.parameter.node;switch(e.state){case 0:return t.processStack.push({type:"node-value-parse",parameter:{node:a,valueIndex:0},state:0,values:{}}),e.state++,f.NODE_NULL_RESULT;case 1:{let m=r;return m===X.PARSER_ERROR?(t.processStack.pop(),X.PARSER_ERROR):(e.values.nodeValueResult=m,t.processStack.push({type:"node-next-parse",parameter:{node:a},state:0}),e.state++,f.NODE_NULL_RESULT)}case 2:{let m=r;if(m===X.PARSER_ERROR)return t.processStack.pop(),X.PARSER_ERROR;let g=a.mergeData(e.values.nodeValueResult,m);return t.processStack.pop(),g}}throw new A(`Invalid node parse state "${e.state}".`,this)}processNodeValueParseProcess(t,e,r){let a=e.parameter.node;switch(e.state){case 0:{if(r!==f.NODE_NULL_RESULT&&r!==X.PARSER_ERROR)return e.values.parseResult=r,e.state++,f.NODE_NULL_RESULT;let m=e.parameter.valueIndex,g=a.connections;if(m>=g.values.length)return e.values.parseResult=f.NODE_VALUE_LIST_END_MEET,e.state++,f.NODE_NULL_RESULT;e.parameter.valueIndex++;let y=t.currentToken,T=g.values[m];if(typeof T=="string"){if(!y){if(g.required){let S=t.getTokenPosition();t.incidentTrace.push(`Unexpected end of statement. Token "${T}" expected.`,t.currentGraph,S.lineStart,S.columnStart,S.lineEnd,S.columnEnd)}return f.NODE_NULL_RESULT}if(T!==y.type){if(g.required){let S=t.getTokenPosition();t.incidentTrace.push(`Unexpected token "${y.value}". "${T}" expected`,t.currentGraph,S.lineStart,S.columnStart,S.lineEnd,S.columnEnd)}return f.NODE_NULL_RESULT}return t.moveNextToken(),y.value}else{let S=g.values.length===1||g.values.length===m+1;return t.processStack.push({type:"graph-parse",parameter:{graph:T,linear:S},state:0}),f.NODE_NULL_RESULT}}case 1:{let m=e.values.parseResult,g=a.connections;if(m===f.NODE_VALUE_LIST_END_MEET&&!g.required){t.processStack.pop();return}return m===f.NODE_VALUE_LIST_END_MEET?(t.processStack.pop(),X.PARSER_ERROR):(t.processStack.pop(),m)}}throw new A(`Invalid node value parse state "${e.state}".`,this)}processStack(t,e,r){switch(e.type){case"graph-parse":return this.processGraphParseProcess(t,e,r);case"node-parse":return this.processNodeParseProcess(t,e,r);case"node-value-parse":return this.processNodeValueParseProcess(t,e,r);case"node-next-parse":return this.processChainedNodeParseProcess(t,e,r)}}};var q=class f{static define(t,e=!1){return new f(t,e)}mDataConverterList;mGraphCollector;mIsJunction;mResolvedGraphNode;get isJunction(){return this.mIsJunction}get node(){return this.mResolvedGraphNode||(this.mResolvedGraphNode=this.mGraphCollector().root),this.mResolvedGraphNode}constructor(t,e){this.mGraphCollector=t,this.mDataConverterList=new Array,this.mResolvedGraphNode=null,this.mIsJunction=e}convert(t,e){if(this.mDataConverterList.length===0)return t;let r=e.getGraphBoundingToken(),a=r[0]??void 0,m=r[1]??void 0;if(this.mDataConverterList.length===1)return this.mDataConverterList[0](t,a,m);let g=t;for(let y of this.mDataConverterList)if(g=y(g,a,m),typeof g=="symbol")return g;return g}converter(t){let e=new f(this.mGraphCollector,this.isJunction);return e.mDataConverterList.push(...this.mDataConverterList,t),e}};var B=class f{static new(){let t=new f("",!1,[]);return t.mRootNode=null,t}mConnections;mIdentifier;mRootNode;get configuration(){return{dataKey:this.mIdentifier.dataKey,isList:this.mIdentifier.type==="list",isRequired:this.mConnections.required,isBranch:this.mConnections.values.length>1}}get connections(){return this.mConnections}get root(){if(!this.mRootNode)throw new A("Staring nodes must be chained with another node to be used.",this);return this.mRootNode}constructor(t,e,r,a){if(t==="")this.mIdentifier={type:"empty",dataKey:"",mergeKey:""};else if(t.endsWith("[]"))this.mIdentifier={type:"list",mergeKey:"",dataKey:t.substring(0,t.length-2)};else if(t.includes("<-")){let g=t.split("<-");this.mIdentifier={type:"merge",dataKey:g[0],mergeKey:g[1]}}else this.mIdentifier={type:"single",mergeKey:"",dataKey:t};let m=r.map(g=>g instanceof f?q.define(()=>g):g);this.mConnections={required:e,values:m,next:null},a?this.mRootNode=a:this.mRootNode=this}mergeData(t,e){if(this.mIdentifier.type==="empty")return e;let r=e,a=typeof t>"u";if(this.mIdentifier.type==="single"){if(this.mIdentifier.dataKey in e)throw new A(`Graph path has a duplicate value identifier "${this.mIdentifier.dataKey}"`,this);return a||(r[this.mIdentifier.dataKey]=t),e}if(this.mIdentifier.type==="list"){let y;a?y=new Array:Array.isArray(t)?y=t:y=[t];let T=(()=>{if(this.mIdentifier.dataKey in e){let S=r[this.mIdentifier.dataKey];return Array.isArray(S)?(S.unshift(...y),S):(y.push(S),y)}return y})();return r[this.mIdentifier.dataKey]=T,e}if(a)return e;let m=(()=>{if(!this.mIdentifier.mergeKey)throw new A("Cant merge data without a merge key.",this);if(typeof t!="object"||t===null)throw new A("Node data must be an object when merge key is set.",this);if(!(this.mIdentifier.mergeKey in t))throw new A(`Node data does not contain merge key "${this.mIdentifier.mergeKey}"`,this);return t[this.mIdentifier.mergeKey]})();if(typeof m>"u")return e;let g=r[this.mIdentifier.dataKey];if(typeof g>"u")return r[this.mIdentifier.dataKey]=m,r;if(!Array.isArray(g))throw new A("Chain data merge value is not an array but should be.",this);return Array.isArray(m)?g.unshift(...m):g.unshift(m),e}optional(t,e){let r=typeof e>"u"?"":t,a=typeof e>"u"?t:e,m=new Array;Array.isArray(a)?m.push(...a):m.push(a);let g=new f(r,!1,m,this.mRootNode);return this.setChainedNode(g),g}required(t,e){let r=typeof e>"u"?"":t,a=typeof e>"u"?t:e,m=new Array;Array.isArray(a)?m.push(...a):m.push(a);let g=new f(r,!0,m,this.mRootNode);return this.setChainedNode(g),g}setChainedNode(t){if(this.mConnections.next!==null)throw new A("Node can only be chained to a single node.",this);this.mConnections.next=t}};var j={XmlIdentifier:"Identifier",XmlAssignment:"XmlAssignment",XmlValue:"XmlValue",XmlComment:"XmlComment",XmlOpenClosingBracket:"XmlOpenClosingBracket",XmlCloseBracket:"XmlCloseBracket",XmlOpenBracket:"XmlOpenBracket",XmlCloseClosingBracket:"XmlCloseClosingBracket",XmlExplicitValueIdentifier:"XmlExplicitValueIdentifier",ExpressionStart:"ExpressionStart",ExpressionEnd:"ExpressionEnd",ExpressionValue:"ExpressionValue",InstructionStart:"InstructionStart",InstructionInstructionValue:"InstructionInstructionValue",InstructionBodyStartBraket:"InstructionBodyStartBraket",InstructionBodyCloseBraket:"InstructionBodyCloseBraket",InstructionInstructionClosingBracket:"InstructionInstructionClosingBracket",InstructionInstructionOpeningBracket:"InstructionInstructionOpeningBracket"};var Fe=class extends me{constructor(){super(),this.validWhitespaces=` 
\r`,this.trimWhitespace=!0;let t=this.createTokenPattern({pattern:{regex:/(?:(?!}}).)*/,type:j.ExpressionValue}}),e=this.createTokenPattern({pattern:{start:{regex:/{{/,type:j.ExpressionStart},end:{regex:/}}/,type:j.ExpressionEnd}}},s=>{s.useChildPattern(t)}),r=this.createTokenPattern({pattern:{regex:/[^>\s\n="/]+/,type:j.XmlIdentifier}}),a=this.createTokenPattern({pattern:{regex:/(?:(?!{{|"|<).)+/,type:j.XmlValue}}),m=this.createTokenPattern({pattern:{regex:/<!--.*?-->/,type:j.XmlComment}}),g=this.createTokenPattern({pattern:{regex:/=/,type:j.XmlAssignment}}),y=this.createTokenPattern({pattern:{start:{regex:/"/,type:j.XmlExplicitValueIdentifier},end:{regex:/"/,type:j.XmlExplicitValueIdentifier}}},s=>{s.useChildPattern(e),s.useChildPattern(a)}),T=this.createTokenPattern({pattern:{start:{regex:/<\//,type:j.XmlOpenClosingBracket},end:{regex:/>/,type:j.XmlCloseBracket}}},s=>{s.useChildPattern(r)}),S=this.createTokenPattern({pattern:{start:{regex:/</,type:j.XmlOpenBracket},end:{regex:/(?<closeClosingBracket>\/>)|(?<closeBracket>>)/,type:{closeClosingBracket:j.XmlCloseClosingBracket,closeBracket:j.XmlCloseBracket}}}},s=>{s.useChildPattern(g),s.useChildPattern(r),s.useChildPattern(y)}),c=this.createTokenPattern({pattern:{regex:/[^()"'`/)]+/,type:j.InstructionInstructionValue}}),n=this.createTokenPattern({pattern:{innerType:j.InstructionInstructionValue,start:{regex:/\//,type:j.InstructionInstructionValue},end:{regex:/\//,type:j.InstructionInstructionValue}}},s=>{s.useChildPattern(l),s.useChildPattern(o),s.useChildPattern(b),s.useChildPattern(u),s.useChildPattern(c)}),u=this.createTokenPattern({pattern:{innerType:j.InstructionInstructionValue,start:{regex:/\(/,type:j.InstructionInstructionValue},end:{regex:/\)/,type:j.InstructionInstructionValue}}},s=>{s.useChildPattern(n),s.useChildPattern(l),s.useChildPattern(o),s.useChildPattern(b),s.useChildPattern(c)}),l=this.createTokenPattern({pattern:{innerType:j.InstructionInstructionValue,start:{regex:/"/,type:j.InstructionInstructionValue},end:{regex:/"/,type:j.InstructionInstructionValue}}},s=>{s.useChildPattern(n),s.useChildPattern(o),s.useChildPattern(b),s.useChildPattern(u),s.useChildPattern(c)}),o=this.createTokenPattern({pattern:{innerType:j.InstructionInstructionValue,start:{regex:/'/,type:j.InstructionInstructionValue},end:{regex:/'/,type:j.InstructionInstructionValue}}},s=>{s.useChildPattern(n),s.useChildPattern(l),s.useChildPattern(b),s.useChildPattern(u),s.useChildPattern(c)}),b=this.createTokenPattern({pattern:{innerType:j.InstructionInstructionValue,start:{regex:/`/,type:j.InstructionInstructionValue},end:{regex:/`/,type:j.InstructionInstructionValue}}},s=>{s.useChildPattern(n),s.useChildPattern(l),s.useChildPattern(o),s.useChildPattern(u),s.useChildPattern(c)}),v=this.createTokenPattern({pattern:{regex:/\$[^(\s\n/{]+/,type:j.InstructionStart}}),D=this.createTokenPattern({pattern:{start:{regex:/\(/,type:j.InstructionInstructionOpeningBracket},end:{regex:/\)/,type:j.InstructionInstructionClosingBracket}}},s=>{s.useChildPattern(n),s.useChildPattern(l),s.useChildPattern(o),s.useChildPattern(b),s.useChildPattern(u),s.useChildPattern(c)}),w=this.createTokenPattern({pattern:{start:{regex:/{/,type:j.InstructionBodyStartBraket},end:{regex:/}/,type:j.InstructionBodyCloseBraket}}},s=>{for(let d of p)s.useChildPattern(d)}),p=[m,T,S,y,e,v,D,w,a];for(let s of p)this.useRootTokenPattern(s)}};var pe=class extends fe{constructor(){super(new Fe),this.initGraph()}initGraph(){let t=q.define(()=>B.new().required(j.ExpressionStart).optional("value",j.ExpressionValue).required(j.ExpressionEnd)).converter(o=>new vt(o.value??"")),e=q.define(()=>{let o=e;return B.new().required("data[]",B.new().required("value",[t,B.new().required("text",j.XmlValue)])).optional("data<-data",o)}),r=q.define(()=>B.new().required("name",j.XmlIdentifier).optional("attributeValue",B.new().required(j.XmlAssignment).required(j.XmlExplicitValueIdentifier).optional("list<-data",e).required(j.XmlExplicitValueIdentifier))).converter(o=>{let b=new Array;if(o.attributeValue?.list)for(let v of o.attributeValue.list)v.value instanceof vt?b.push(v.value):b.push(v.value.text);return{name:o.name,values:b}}),a=q.define(()=>{let o=a;return B.new().required("data[]",r).optional("data<-data",o)}),m=q.define(()=>{let o=m;return B.new().required("data[]",B.new().required("value",[t,B.new().required("text",j.XmlValue),B.new().required(j.XmlExplicitValueIdentifier).required("text",j.XmlValue).required(j.XmlExplicitValueIdentifier)])).optional("data<-data",o)}),g=q.define(()=>B.new().required("list<-data",m)).converter(o=>{let b=new It;for(let v of o.list)v.value instanceof vt?b.addValue(v.value):b.addValue(v.value.text);return b}),y=q.define(()=>B.new().required(j.XmlComment)).converter(()=>null),T=q.define(()=>B.new().required(j.XmlOpenBracket).required("openingTagName",j.XmlIdentifier).optional("attributes<-data",a).required("closing",[B.new().required(j.XmlCloseClosingBracket),B.new().required(j.XmlCloseBracket).required("values",u).required(j.XmlOpenClosingBracket).required("closingTageName",j.XmlIdentifier).required(j.XmlCloseBracket)])).converter(o=>{if("closingTageName"in o.closing&&o.openingTagName!==o.closing.closingTageName)throw new A(`Opening (${o.openingTagName}) and closing tagname (${o.closing.closingTageName}) does not match`,this);let b=new St(o.openingTagName);if(o.attributes)for(let v of o.attributes)b.setAttribute(v.name).addValue(...v.values);return"values"in o.closing&&b.appendChild(...o.closing.values),b}),S=q.define(()=>{let o=S;return B.new().required("list[]",j.InstructionInstructionValue).optional("list<-list",o)}),c=q.define(()=>B.new().required("instructionName",j.InstructionStart).optional("instruction",B.new().required(j.InstructionInstructionOpeningBracket).required("value<-list",S).required(j.InstructionInstructionClosingBracket)).optional("body",B.new().required(j.InstructionBodyStartBraket).required("value",u).required(j.InstructionBodyCloseBraket))).converter(o=>{let b=o.instructionName.substring(1),v=o.instruction?.value.join("")??"",D=new $t(b,v);return o.body&&D.appendChild(...o.body.value),D}),n=q.define(()=>{let o=n;return B.new().required("list[]",[y,T,c,g]).optional("list<-list",o)}),u=q.define(()=>{let o=n;return B.new().optional("list<-list",o)}).converter(o=>{let b=new Array;if(o.list)for(let v of o.list)v!==null&&b.push(v);return b}),l=q.define(()=>B.new().required("content",u)).converter(o=>{let b=new ct;return b.appendChild(...o.content),b});this.setRootGraph(l)}};var $=class f extends Pe{static mTemplateCache=new k;static mXmlParser=new pe;mComponentElement;mRootBuilder;get element(){return this.mComponentElement.htmlElement}constructor(t){super({constructor:t.processorConstructor,parent:null}),tt.registerComponent(this,t.htmlElement),this.setProcessorInjection(f,this),this.addConstructionHook(r=>{tt.registerComponent(this,this.mComponentElement.htmlElement,r)}),f.mTemplateCache.has(t.processorConstructor)||f.mTemplateCache.set(t.processorConstructor,f.mXmlParser.parse(t.templateString??""));let e=f.mTemplateCache.get(t.processorConstructor).clone();this.mComponentElement=new de(t.htmlElement),this.mRootBuilder=new Yt(e,new Le(this,t.expressionModule),new dt(this),"ROOT"),this.mComponentElement.shadowRoot.appendChild(this.mRootBuilder.anchor),this.setProcessorInjection(xt,new xt(this.mRootBuilder.values))}addStyle(t){let e=document.createElement("style");e.innerHTML=t,this.mComponentElement.shadowRoot.prepend(e)}attributeChanged(t,e,r){this.call("onAttributeChange",t,e,r)}connected(){this.call("onConnect")}deconstruct(){this.call("onDeconstruct"),this.mRootBuilder.deconstruct(),super.deconstruct()}disconnected(){this.call("onDisconnect")}onUpdate(){return this.mRootBuilder.update()?(this.call("onUpdate"),!0):!1}};function J(f){return(t,e)=>{O.registerInjectable(t,e.metadata,"instanced"),tt.registerConstructor(t,f.selector);let r=class extends HTMLElement{mComponent;constructor(){super(),this.mComponent=new $({processorConstructor:t,templateString:f.template??null,expressionModule:f.expressionmodule,htmlElement:this}).setup(),f.style&&this.mComponent.addStyle(f.style),this.mComponent.updater.update()}connectedCallback(){this.mComponent.connected()}disconnectedCallback(){this.mComponent.disconnected()}};globalThis.customElements.define(f.selector,r)}}function Bt(f){return(t,e)=>{O.registerInjectable(t,e.metadata,"instanced"),lt.register(Nt,t,{access:f.access,targetRestrictions:f.targetRestrictions})}}function bt(f){return(t,e)=>{O.registerInjectable(t,e.metadata,"instanced"),lt.register(yt,t,{access:f.access,selector:f.selector})}}function Ct(f){return(t,e)=>{O.registerInjectable(t,e.metadata,"instanced"),lt.register(_t,t,{instructionType:f.instructionType})}}function wi(){function f(c,n){return function(l){e(n,"addInitializer"),r(l,"An initializer"),c.push(l)}}function t(c,n,u,l,o,b,v,D,w){var p;switch(o){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+n:n,static:b,private:v,metadata:D},d={v:!1};s.addInitializer=f(l,d);var i,h;o===0?v?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):o===2?i=function(){return u.value}:((o===1||o===3)&&(i=function(){return u.get.call(this)}),(o===1||o===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return c(w,s)}finally{d.v=!0}}function e(c,n){if(c.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(c,n){if(typeof c!="function")throw new TypeError(n+" must be a function")}function a(c,n){var u=typeof n;if(c===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(u!=="function"){var l;throw c===0?l="field":c===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function m(c,n,u,l,o,b,v,D,w){var p=u[0],s,d,i;v?o===0||o===1?s={get:u[3],set:u[4]}:o===3?s={get:u[3]}:o===4?s={set:u[3]}:s={value:u[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var h,x,C;if(typeof p=="function")h=t(p,l,s,D,o,b,v,w,i),h!==void 0&&(a(o,h),o===0?d=h:o===1?(d=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h);else for(var P=p.length-1;P>=0;P--){var M=p[P];if(h=t(M,l,s,D,o,b,v,w,i),h!==void 0){a(o,h);var N;o===0?N=h:o===1?(N=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(o===0||o===1){if(d===void 0)d=function(I,E){return E};else if(typeof d!="function"){var _=d;d=function(I,E){for(var L=E,R=0;R<_.length;R++)L=_[R].call(I,L);return L}}else{var V=d;d=function(I,E){return V.call(I,E)}}c.push(d)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),v?o===1?(c.push(function(I,E){return i.get.call(I,E)}),c.push(function(I,E){return i.set.call(I,E)})):o===2?c.push(i):c.push(function(I,E){return i.call(I,E)}):Object.defineProperty(n,l,s))}function g(c,n,u){for(var l=[],o,b,v=new Map,D=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,C;if(h?(x=c,s=s-5,b=b||[],C=b):(x=c.prototype,o=o||[],C=o),s!==0&&!i){var P=h?D:v,M=P.get(d)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!M&&s>2?P.set(d,s):P.set(d,!0)}m(l,x,p,d,s,h,i,C,u)}}return y(l,o),y(l,b),l}function y(c,n){n&&c.push(function(u){for(var l=0;l<n.length;l++)n[l].call(u);return u})}function T(c,n,u){if(n.length>0){for(var l=[],o=c,b=c.name,v=n.length-1;v>=0;v--){var D={v:!1};try{var w=n[v](o,{kind:"class",name:b,addInitializer:f(l,D),metadata:u})}finally{D.v=!0}w!==void 0&&(a(10,w),o=w)}return[S(o,u),function(){for(var p=0;p<l.length;p++)l[p].call(o)}]}}function S(c,n){return Object.defineProperty(c,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,l,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),D=g(n,u,v);return l.length||S(n,v),{e:D,get c(){return T(n,l,v)}}}}function wr(f,t,e,r){return(wr=wi())(f,t,e,r)}function xi(f){return f}var xr,br,ge;xr=Bt({access:H.Read,targetRestrictions:[$]});new class extends xi{constructor(){super(ge),br()}static{class f{static{({c:[ge,br]}=wr(this,[],[xr]))}static METADATA_USER_EVENT_LISTENER_PROPERIES="pwb:user_event_listener_properties";mEventListenerList;mTargetElement;constructor(e=O.use($)){let r=new Array,a=e.processorConstructor;do{let m=it.get(a).getMetadata(f.METADATA_USER_EVENT_LISTENER_PROPERIES);if(m)for(let g of m)r.push(g)}while(a=Object.getPrototypeOf(a));this.mEventListenerList=new Array,this.mTargetElement=e.element;for(let m of r){let[g,y]=m,T=Reflect.get(e.processor,g);T=T.bind(e.processor),this.mEventListenerList.push([y,T]),this.mTargetElement.addEventListener(y,T)}}onDeconstruct(){for(let e of this.mEventListenerList){let[r,a]=e;this.mTargetElement.removeEventListener(r,a)}}}}};var ve=class extends window.Event{mValue;get value(){return this.mValue}constructor(t,e){super(t),this.mValue=e}};var ye=class{mElement;mEventName;constructor(t,e){this.mEventName=t,this.mElement=e}dispatchEvent(t){let e=new ve(this.mEventName,t);this.mElement.dispatchEvent(e)}};function qt(f){return(t,e)=>{if(e.static)throw new A("Event target is not for a static property.",qt);let r=new WeakMap;return{get(){if(!r.has(this)){let a=(()=>{try{return tt.ofProcessor(this).component}catch{throw new A("PwbComponentEvent target class is not a component.",this)}})();r.set(this,new ye(f,a.element))}return r.get(this)}}}}function Ti(){function f(c,n){return function(l){e(n,"addInitializer"),r(l,"An initializer"),c.push(l)}}function t(c,n,u,l,o,b,v,D,w){var p;switch(o){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+n:n,static:b,private:v,metadata:D},d={v:!1};s.addInitializer=f(l,d);var i,h;o===0?v?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):o===2?i=function(){return u.value}:((o===1||o===3)&&(i=function(){return u.get.call(this)}),(o===1||o===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return c(w,s)}finally{d.v=!0}}function e(c,n){if(c.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(c,n){if(typeof c!="function")throw new TypeError(n+" must be a function")}function a(c,n){var u=typeof n;if(c===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(u!=="function"){var l;throw c===0?l="field":c===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function m(c,n,u,l,o,b,v,D,w){var p=u[0],s,d,i;v?o===0||o===1?s={get:u[3],set:u[4]}:o===3?s={get:u[3]}:o===4?s={set:u[3]}:s={value:u[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var h,x,C;if(typeof p=="function")h=t(p,l,s,D,o,b,v,w,i),h!==void 0&&(a(o,h),o===0?d=h:o===1?(d=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h);else for(var P=p.length-1;P>=0;P--){var M=p[P];if(h=t(M,l,s,D,o,b,v,w,i),h!==void 0){a(o,h);var N;o===0?N=h:o===1?(N=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(o===0||o===1){if(d===void 0)d=function(I,E){return E};else if(typeof d!="function"){var _=d;d=function(I,E){for(var L=E,R=0;R<_.length;R++)L=_[R].call(I,L);return L}}else{var V=d;d=function(I,E){return V.call(I,E)}}c.push(d)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),v?o===1?(c.push(function(I,E){return i.get.call(I,E)}),c.push(function(I,E){return i.set.call(I,E)})):o===2?c.push(i):c.push(function(I,E){return i.call(I,E)}):Object.defineProperty(n,l,s))}function g(c,n,u){for(var l=[],o,b,v=new Map,D=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,C;if(h?(x=c,s=s-5,b=b||[],C=b):(x=c.prototype,o=o||[],C=o),s!==0&&!i){var P=h?D:v,M=P.get(d)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!M&&s>2?P.set(d,s):P.set(d,!0)}m(l,x,p,d,s,h,i,C,u)}}return y(l,o),y(l,b),l}function y(c,n){n&&c.push(function(u){for(var l=0;l<n.length;l++)n[l].call(u);return u})}function T(c,n,u){if(n.length>0){for(var l=[],o=c,b=c.name,v=n.length-1;v>=0;v--){var D={v:!1};try{var w=n[v](o,{kind:"class",name:b,addInitializer:f(l,D),metadata:u})}finally{D.v=!0}w!==void 0&&(a(10,w),o=w)}return[S(o,u),function(){for(var p=0;p<l.length;p++)l[p].call(o)}]}}function S(c,n){return Object.defineProperty(c,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,l,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),D=g(n,u,v);return l.length||S(n,v),{e:D,get c(){return T(n,l,v)}}}}function Dr(f,t,e,r){return(Dr=Ti())(f,t,e,r)}function Di(f){return f}var Er,Tr,be;Er=Bt({access:H.ReadWrite,targetRestrictions:[$]});new class extends Di{constructor(){super(be),Tr()}static{class f{static{({c:[be,Tr]}=Dr(this,[],[Er]))}static METADATA_EXPORTED_PROPERTIES="pwb:exported_properties";mComponent;constructor(e=O.use($)){this.mComponent=e;let r=new jt,a=e.processorConstructor;do{let g=it.get(a).getMetadata(f.METADATA_EXPORTED_PROPERTIES);g&&r.push(...g)}while(a=Object.getPrototypeOf(a));let m=new Set(r);m.size>0&&this.connectExportedProperties(m)}connectExportedProperties(e){this.exportPropertyAsAttribute(e),this.patchHtmlAttributes(e)}exportPropertyAsAttribute(e){for(let r of e){let a={};a.enumerable=!0,a.configurable=!0,delete a.value,delete a.writable,a.set=m=>{Reflect.set(this.mComponent.processor,r,m)},a.get=()=>{let m=Reflect.get(this.mComponent.processor,r);return typeof m=="function"&&(m=m.bind(this.mComponent.processor)),m},Object.defineProperty(this.mComponent.element,r,a)}}patchHtmlAttributes(e){let r=this.mComponent.element.getAttribute;new MutationObserver(m=>{for(let g of m){let y=g.attributeName,T=r.call(this.mComponent.element,y);Reflect.set(this.mComponent.element,y,T),this.mComponent.attributeChanged(y,g.oldValue,T)}}).observe(this.mComponent.element,{attributeFilter:[...e],attributeOldValue:!0});for(let m of e)if(this.mComponent.element.hasAttribute(m)){let g=r.call(this.mComponent.element,m);this.mComponent.element.setAttribute(m,g)}this.mComponent.element.getAttribute=m=>e.has(m)?Reflect.get(this.mComponent.element,m):r.call(this.mComponent.element,m)}}}};function wt(f,t){if(t.static)throw new A("Event target is not for a static property.",wt);let e=it.forInternalDecorator(t.metadata),r=e.getMetadata(be.METADATA_EXPORTED_PROPERTIES)??new Array;r.push(t.name),e.setMetadata(be.METADATA_EXPORTED_PROPERTIES,r)}function at(f){return(t,e)=>{if(e.static)throw new A("Child decorator is not for a static property.",at);return{get(){let m=(()=>{try{return tt.ofProcessor(this).component}catch{throw new A("PwbChild target class is not a component.",this)}})().getProcessorInjection(xt).data.store[f];if(m instanceof Element)return m;throw new A(`Can't find child "${f}".`,this)}}}}function Ei(){function f(c,n){return function(l){e(n,"addInitializer"),r(l,"An initializer"),c.push(l)}}function t(c,n,u,l,o,b,v,D,w){var p;switch(o){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+n:n,static:b,private:v,metadata:D},d={v:!1};s.addInitializer=f(l,d);var i,h;o===0?v?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):o===2?i=function(){return u.value}:((o===1||o===3)&&(i=function(){return u.get.call(this)}),(o===1||o===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return c(w,s)}finally{d.v=!0}}function e(c,n){if(c.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(c,n){if(typeof c!="function")throw new TypeError(n+" must be a function")}function a(c,n){var u=typeof n;if(c===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(u!=="function"){var l;throw c===0?l="field":c===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function m(c,n,u,l,o,b,v,D,w){var p=u[0],s,d,i;v?o===0||o===1?s={get:u[3],set:u[4]}:o===3?s={get:u[3]}:o===4?s={set:u[3]}:s={value:u[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var h,x,C;if(typeof p=="function")h=t(p,l,s,D,o,b,v,w,i),h!==void 0&&(a(o,h),o===0?d=h:o===1?(d=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h);else for(var P=p.length-1;P>=0;P--){var M=p[P];if(h=t(M,l,s,D,o,b,v,w,i),h!==void 0){a(o,h);var N;o===0?N=h:o===1?(N=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(o===0||o===1){if(d===void 0)d=function(I,E){return E};else if(typeof d!="function"){var _=d;d=function(I,E){for(var L=E,R=0;R<_.length;R++)L=_[R].call(I,L);return L}}else{var V=d;d=function(I,E){return V.call(I,E)}}c.push(d)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),v?o===1?(c.push(function(I,E){return i.get.call(I,E)}),c.push(function(I,E){return i.set.call(I,E)})):o===2?c.push(i):c.push(function(I,E){return i.call(I,E)}):Object.defineProperty(n,l,s))}function g(c,n,u){for(var l=[],o,b,v=new Map,D=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,C;if(h?(x=c,s=s-5,b=b||[],C=b):(x=c.prototype,o=o||[],C=o),s!==0&&!i){var P=h?D:v,M=P.get(d)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!M&&s>2?P.set(d,s):P.set(d,!0)}m(l,x,p,d,s,h,i,C,u)}}return y(l,o),y(l,b),l}function y(c,n){n&&c.push(function(u){for(var l=0;l<n.length;l++)n[l].call(u);return u})}function T(c,n,u){if(n.length>0){for(var l=[],o=c,b=c.name,v=n.length-1;v>=0;v--){var D={v:!1};try{var w=n[v](o,{kind:"class",name:b,addInitializer:f(l,D),metadata:u})}finally{D.v=!0}w!==void 0&&(a(10,w),o=w)}return[S(o,u),function(){for(var p=0;p<l.length;p++)l[p].call(o)}]}}function S(c,n){return Object.defineProperty(c,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,l,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),D=g(n,u,v);return l.length||S(n,v),{e:D,get c(){return T(n,l,v)}}}}function Cr(f,t,e,r){return(Cr=Ei())(f,t,e,r)}var Pr,Ir,Ii;Pr=Ct({instructionType:"dynamic-content"});var Sr=class{static{({c:[Ii,Ir]}=Cr(this,[],[Pr]))}constructor(t=O.use(Q),e=O.use(U)){this.mModuleValues=e,this.mLastTemplate=null,this.mProcedure=this.mModuleValues.createExpressionProcedure(t.value)}mLastTemplate;mModuleValues;mProcedure;onUpdate(){let t=this.mProcedure.execute();if(!t||!(t instanceof ct))throw new A("Dynamic content method has a wrong result type.",this);if(this.mLastTemplate!==null&&this.mLastTemplate.equals(t))return null;let e=t.clone();this.mLastTemplate=e;let r=new ut;return r.addElement(e,new dt(this.mModuleValues.data)),r}static{Ir()}};function Si(){function f(c,n){return function(l){e(n,"addInitializer"),r(l,"An initializer"),c.push(l)}}function t(c,n,u,l,o,b,v,D,w){var p;switch(o){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+n:n,static:b,private:v,metadata:D},d={v:!1};s.addInitializer=f(l,d);var i,h;o===0?v?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):o===2?i=function(){return u.value}:((o===1||o===3)&&(i=function(){return u.get.call(this)}),(o===1||o===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return c(w,s)}finally{d.v=!0}}function e(c,n){if(c.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(c,n){if(typeof c!="function")throw new TypeError(n+" must be a function")}function a(c,n){var u=typeof n;if(c===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(u!=="function"){var l;throw c===0?l="field":c===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function m(c,n,u,l,o,b,v,D,w){var p=u[0],s,d,i;v?o===0||o===1?s={get:u[3],set:u[4]}:o===3?s={get:u[3]}:o===4?s={set:u[3]}:s={value:u[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var h,x,C;if(typeof p=="function")h=t(p,l,s,D,o,b,v,w,i),h!==void 0&&(a(o,h),o===0?d=h:o===1?(d=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h);else for(var P=p.length-1;P>=0;P--){var M=p[P];if(h=t(M,l,s,D,o,b,v,w,i),h!==void 0){a(o,h);var N;o===0?N=h:o===1?(N=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(o===0||o===1){if(d===void 0)d=function(I,E){return E};else if(typeof d!="function"){var _=d;d=function(I,E){for(var L=E,R=0;R<_.length;R++)L=_[R].call(I,L);return L}}else{var V=d;d=function(I,E){return V.call(I,E)}}c.push(d)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),v?o===1?(c.push(function(I,E){return i.get.call(I,E)}),c.push(function(I,E){return i.set.call(I,E)})):o===2?c.push(i):c.push(function(I,E){return i.call(I,E)}):Object.defineProperty(n,l,s))}function g(c,n,u){for(var l=[],o,b,v=new Map,D=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,C;if(h?(x=c,s=s-5,b=b||[],C=b):(x=c.prototype,o=o||[],C=o),s!==0&&!i){var P=h?D:v,M=P.get(d)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!M&&s>2?P.set(d,s):P.set(d,!0)}m(l,x,p,d,s,h,i,C,u)}}return y(l,o),y(l,b),l}function y(c,n){n&&c.push(function(u){for(var l=0;l<n.length;l++)n[l].call(u);return u})}function T(c,n,u){if(n.length>0){for(var l=[],o=c,b=c.name,v=n.length-1;v>=0;v--){var D={v:!1};try{var w=n[v](o,{kind:"class",name:b,addInitializer:f(l,D),metadata:u})}finally{D.v=!0}w!==void 0&&(a(10,w),o=w)}return[S(o,u),function(){for(var p=0;p<l.length;p++)l[p].call(o)}]}}function S(c,n){return Object.defineProperty(c,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,l,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),D=g(n,u,v);return l.length||S(n,v),{e:D,get c(){return T(n,l,v)}}}}function Ar(f,t,e,r){return(Ar=Si())(f,t,e,r)}var Lr,Mr,Ci;Lr=bt({access:H.Write,selector:/^\([[\w\-$]+\)$/});var Nr=class{static{({c:[Ci,Mr]}=Ar(this,[],[Lr]))}constructor(t=O.use(Z),e=O.use(U),r=O.use(rt)){this.mTarget=t,this.mEventName=r.name.substring(1,r.name.length-1);let a=e.createExpressionProcedure(r.value,["$event"]);this.mListener=m=>{a.setTemporaryValue("$event",m),a.execute()},this.mTarget.addEventListener(this.mEventName,this.mListener)}mEventName;mListener;mTarget;onDeconstruct(){this.mTarget.removeEventListener(this.mEventName,this.mListener)}static{Mr()}};function Pi(){function f(c,n){return function(l){e(n,"addInitializer"),r(l,"An initializer"),c.push(l)}}function t(c,n,u,l,o,b,v,D,w){var p;switch(o){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+n:n,static:b,private:v,metadata:D},d={v:!1};s.addInitializer=f(l,d);var i,h;o===0?v?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):o===2?i=function(){return u.value}:((o===1||o===3)&&(i=function(){return u.get.call(this)}),(o===1||o===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return c(w,s)}finally{d.v=!0}}function e(c,n){if(c.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(c,n){if(typeof c!="function")throw new TypeError(n+" must be a function")}function a(c,n){var u=typeof n;if(c===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(u!=="function"){var l;throw c===0?l="field":c===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function m(c,n,u,l,o,b,v,D,w){var p=u[0],s,d,i;v?o===0||o===1?s={get:u[3],set:u[4]}:o===3?s={get:u[3]}:o===4?s={set:u[3]}:s={value:u[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var h,x,C;if(typeof p=="function")h=t(p,l,s,D,o,b,v,w,i),h!==void 0&&(a(o,h),o===0?d=h:o===1?(d=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h);else for(var P=p.length-1;P>=0;P--){var M=p[P];if(h=t(M,l,s,D,o,b,v,w,i),h!==void 0){a(o,h);var N;o===0?N=h:o===1?(N=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(o===0||o===1){if(d===void 0)d=function(I,E){return E};else if(typeof d!="function"){var _=d;d=function(I,E){for(var L=E,R=0;R<_.length;R++)L=_[R].call(I,L);return L}}else{var V=d;d=function(I,E){return V.call(I,E)}}c.push(d)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),v?o===1?(c.push(function(I,E){return i.get.call(I,E)}),c.push(function(I,E){return i.set.call(I,E)})):o===2?c.push(i):c.push(function(I,E){return i.call(I,E)}):Object.defineProperty(n,l,s))}function g(c,n,u){for(var l=[],o,b,v=new Map,D=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,C;if(h?(x=c,s=s-5,b=b||[],C=b):(x=c.prototype,o=o||[],C=o),s!==0&&!i){var P=h?D:v,M=P.get(d)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!M&&s>2?P.set(d,s):P.set(d,!0)}m(l,x,p,d,s,h,i,C,u)}}return y(l,o),y(l,b),l}function y(c,n){n&&c.push(function(u){for(var l=0;l<n.length;l++)n[l].call(u);return u})}function T(c,n,u){if(n.length>0){for(var l=[],o=c,b=c.name,v=n.length-1;v>=0;v--){var D={v:!1};try{var w=n[v](o,{kind:"class",name:b,addInitializer:f(l,D),metadata:u})}finally{D.v=!0}w!==void 0&&(a(10,w),o=w)}return[S(o,u),function(){for(var p=0;p<l.length;p++)l[p].call(o)}]}}function S(c,n){return Object.defineProperty(c,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,l,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),D=g(n,u,v);return l.length||S(n,v),{e:D,get c(){return T(n,l,v)}}}}function Fr(f,t,e,r){return(Fr=Pi())(f,t,e,r)}var _r,Rr,Mi;_r=Ct({instructionType:"for"});var Or=class{static{({c:[Mi,Rr]}=Fr(this,[],[_r]))}constructor(t=O.use(mt),e=O.use(U),r=O.use(Q)){this.mTemplate=t,this.mModuleValues=e,this.mLastEntries=new Array;let a=r.value,g=new RegExp(/^\s*([a-zA-Z]+[a-zA-Z0-9]*)\s*of\s+([^;]+)\s*(;\s*([a-zA-Z]+[a-zA-Z0-9]*)\s*=\s*(.*)\s*)?$/).exec(a);if(!g)throw new A(`For-Parameter value has wrong format: ${a}`,this);let y=g[1],T=g[2],S=g[4]??null,c=g[5],n=this.mModuleValues.createExpressionProcedure(T),u=S?this.mModuleValues.createExpressionProcedure(c,["$index",y]):null;this.mExpression={iterateVariableName:y,iterateValueProcedure:n,indexExportVariableName:S,indexExportProcedure:u}}mExpression;mLastEntries;mModuleValues;mTemplate;onUpdate(){let t=new ut,e=this.mExpression.iterateValueProcedure.execute();if(typeof e=="object"&&e!==null||Array.isArray(e)){let r=Symbol.iterator in e?Object.entries([...e]):Object.entries(e);if(this.compareEntries(r,this.mLastEntries))return null;this.mLastEntries=r;for(let[a,m]of r)this.addTemplateForElement(t,this.mExpression,m,a);return t}else return null}addTemplateForElement=(t,e,r,a)=>{let m=new dt(this.mModuleValues.data);if(m.setTemporaryValue(e.iterateVariableName,r),e.indexExportProcedure&&e.indexExportVariableName){e.indexExportProcedure.setTemporaryValue("$index",a),e.indexExportProcedure.setTemporaryValue(e.iterateVariableName,r);let y=e.indexExportProcedure.execute();m.setTemporaryValue(e.indexExportVariableName,y)}let g=new ct;g.appendChild(...this.mTemplate.childList),t.addElement(g,m)};compareEntries(t,e){if(t.length!==e.length)return!1;for(let r=0;r<t.length;r++){let[a,m]=t[r],[g,y]=e[r];if(a!==g||m!==y)return!1}return!0}static{Rr()}};function Ni(){function f(c,n){return function(l){e(n,"addInitializer"),r(l,"An initializer"),c.push(l)}}function t(c,n,u,l,o,b,v,D,w){var p;switch(o){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+n:n,static:b,private:v,metadata:D},d={v:!1};s.addInitializer=f(l,d);var i,h;o===0?v?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):o===2?i=function(){return u.value}:((o===1||o===3)&&(i=function(){return u.get.call(this)}),(o===1||o===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return c(w,s)}finally{d.v=!0}}function e(c,n){if(c.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(c,n){if(typeof c!="function")throw new TypeError(n+" must be a function")}function a(c,n){var u=typeof n;if(c===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(u!=="function"){var l;throw c===0?l="field":c===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function m(c,n,u,l,o,b,v,D,w){var p=u[0],s,d,i;v?o===0||o===1?s={get:u[3],set:u[4]}:o===3?s={get:u[3]}:o===4?s={set:u[3]}:s={value:u[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var h,x,C;if(typeof p=="function")h=t(p,l,s,D,o,b,v,w,i),h!==void 0&&(a(o,h),o===0?d=h:o===1?(d=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h);else for(var P=p.length-1;P>=0;P--){var M=p[P];if(h=t(M,l,s,D,o,b,v,w,i),h!==void 0){a(o,h);var N;o===0?N=h:o===1?(N=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(o===0||o===1){if(d===void 0)d=function(I,E){return E};else if(typeof d!="function"){var _=d;d=function(I,E){for(var L=E,R=0;R<_.length;R++)L=_[R].call(I,L);return L}}else{var V=d;d=function(I,E){return V.call(I,E)}}c.push(d)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),v?o===1?(c.push(function(I,E){return i.get.call(I,E)}),c.push(function(I,E){return i.set.call(I,E)})):o===2?c.push(i):c.push(function(I,E){return i.call(I,E)}):Object.defineProperty(n,l,s))}function g(c,n,u){for(var l=[],o,b,v=new Map,D=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,C;if(h?(x=c,s=s-5,b=b||[],C=b):(x=c.prototype,o=o||[],C=o),s!==0&&!i){var P=h?D:v,M=P.get(d)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!M&&s>2?P.set(d,s):P.set(d,!0)}m(l,x,p,d,s,h,i,C,u)}}return y(l,o),y(l,b),l}function y(c,n){n&&c.push(function(u){for(var l=0;l<n.length;l++)n[l].call(u);return u})}function T(c,n,u){if(n.length>0){for(var l=[],o=c,b=c.name,v=n.length-1;v>=0;v--){var D={v:!1};try{var w=n[v](o,{kind:"class",name:b,addInitializer:f(l,D),metadata:u})}finally{D.v=!0}w!==void 0&&(a(10,w),o=w)}return[S(o,u),function(){for(var p=0;p<l.length;p++)l[p].call(o)}]}}function S(c,n){return Object.defineProperty(c,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,l,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),D=g(n,u,v);return l.length||S(n,v),{e:D,get c(){return T(n,l,v)}}}}function zr(f,t,e,r){return(zr=Ni())(f,t,e,r)}var $r,jr,Ai;$r=Ct({instructionType:"if"});var Vr=class{static{({c:[Ai,jr]}=zr(this,[],[$r]))}constructor(t=O.use(mt),e=O.use(U),r=O.use(Q)){this.mTemplateReference=t,this.mModuleValues=e,this.mProcedure=this.mModuleValues.createExpressionProcedure(r.value),this.mLastBoolean=!1}mLastBoolean;mModuleValues;mProcedure;mTemplateReference;onUpdate(){let t=this.mProcedure.execute();if(!!t!==this.mLastBoolean){this.mLastBoolean=!!t;let e=new ut;if(t){let r=new ct;r.appendChild(...this.mTemplateReference.childList),e.addElement(r,new dt(this.mModuleValues.data))}return e}else return null}static{jr()}};function Li(){function f(c,n){return function(l){e(n,"addInitializer"),r(l,"An initializer"),c.push(l)}}function t(c,n,u,l,o,b,v,D,w){var p;switch(o){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+n:n,static:b,private:v,metadata:D},d={v:!1};s.addInitializer=f(l,d);var i,h;o===0?v?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):o===2?i=function(){return u.value}:((o===1||o===3)&&(i=function(){return u.get.call(this)}),(o===1||o===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return c(w,s)}finally{d.v=!0}}function e(c,n){if(c.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(c,n){if(typeof c!="function")throw new TypeError(n+" must be a function")}function a(c,n){var u=typeof n;if(c===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(u!=="function"){var l;throw c===0?l="field":c===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function m(c,n,u,l,o,b,v,D,w){var p=u[0],s,d,i;v?o===0||o===1?s={get:u[3],set:u[4]}:o===3?s={get:u[3]}:o===4?s={set:u[3]}:s={value:u[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var h,x,C;if(typeof p=="function")h=t(p,l,s,D,o,b,v,w,i),h!==void 0&&(a(o,h),o===0?d=h:o===1?(d=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h);else for(var P=p.length-1;P>=0;P--){var M=p[P];if(h=t(M,l,s,D,o,b,v,w,i),h!==void 0){a(o,h);var N;o===0?N=h:o===1?(N=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(o===0||o===1){if(d===void 0)d=function(I,E){return E};else if(typeof d!="function"){var _=d;d=function(I,E){for(var L=E,R=0;R<_.length;R++)L=_[R].call(I,L);return L}}else{var V=d;d=function(I,E){return V.call(I,E)}}c.push(d)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),v?o===1?(c.push(function(I,E){return i.get.call(I,E)}),c.push(function(I,E){return i.set.call(I,E)})):o===2?c.push(i):c.push(function(I,E){return i.call(I,E)}):Object.defineProperty(n,l,s))}function g(c,n,u){for(var l=[],o,b,v=new Map,D=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,C;if(h?(x=c,s=s-5,b=b||[],C=b):(x=c.prototype,o=o||[],C=o),s!==0&&!i){var P=h?D:v,M=P.get(d)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!M&&s>2?P.set(d,s):P.set(d,!0)}m(l,x,p,d,s,h,i,C,u)}}return y(l,o),y(l,b),l}function y(c,n){n&&c.push(function(u){for(var l=0;l<n.length;l++)n[l].call(u);return u})}function T(c,n,u){if(n.length>0){for(var l=[],o=c,b=c.name,v=n.length-1;v>=0;v--){var D={v:!1};try{var w=n[v](o,{kind:"class",name:b,addInitializer:f(l,D),metadata:u})}finally{D.v=!0}w!==void 0&&(a(10,w),o=w)}return[S(o,u),function(){for(var p=0;p<l.length;p++)l[p].call(o)}]}}function S(c,n){return Object.defineProperty(c,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,l,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),D=g(n,u,v);return l.length||S(n,v),{e:D,get c(){return T(n,l,v)}}}}function Ur(f,t,e,r){return(Ur=Li())(f,t,e,r)}var Hr,Gr,Ri;Hr=bt({access:H.Read,selector:/^\[[\w$]+\]$/});var Br=class{static{({c:[Ri,Gr]}=Ur(this,[],[Hr]))}constructor(t=O.use(Z),e=O.use(U),r=O.use(rt)){this.mTarget=t,this.mProcedure=e.createExpressionProcedure(r.value),this.mTargetProperty=r.name.substring(1,r.name.length-1),this.mLastValue=Symbol("Uncomparable")}mLastValue;mProcedure;mTarget;mTargetProperty;onUpdate(){let t=this.mProcedure.execute();return t===this.mLastValue?!1:(this.mLastValue=t,Reflect.set(this.mTarget,this.mTargetProperty,t),!0)}static{Gr()}};function Oi(){function f(c,n){return function(l){e(n,"addInitializer"),r(l,"An initializer"),c.push(l)}}function t(c,n,u,l,o,b,v,D,w){var p;switch(o){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+n:n,static:b,private:v,metadata:D},d={v:!1};s.addInitializer=f(l,d);var i,h;o===0?v?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):o===2?i=function(){return u.value}:((o===1||o===3)&&(i=function(){return u.get.call(this)}),(o===1||o===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return c(w,s)}finally{d.v=!0}}function e(c,n){if(c.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(c,n){if(typeof c!="function")throw new TypeError(n+" must be a function")}function a(c,n){var u=typeof n;if(c===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(u!=="function"){var l;throw c===0?l="field":c===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function m(c,n,u,l,o,b,v,D,w){var p=u[0],s,d,i;v?o===0||o===1?s={get:u[3],set:u[4]}:o===3?s={get:u[3]}:o===4?s={set:u[3]}:s={value:u[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var h,x,C;if(typeof p=="function")h=t(p,l,s,D,o,b,v,w,i),h!==void 0&&(a(o,h),o===0?d=h:o===1?(d=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h);else for(var P=p.length-1;P>=0;P--){var M=p[P];if(h=t(M,l,s,D,o,b,v,w,i),h!==void 0){a(o,h);var N;o===0?N=h:o===1?(N=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(o===0||o===1){if(d===void 0)d=function(I,E){return E};else if(typeof d!="function"){var _=d;d=function(I,E){for(var L=E,R=0;R<_.length;R++)L=_[R].call(I,L);return L}}else{var V=d;d=function(I,E){return V.call(I,E)}}c.push(d)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),v?o===1?(c.push(function(I,E){return i.get.call(I,E)}),c.push(function(I,E){return i.set.call(I,E)})):o===2?c.push(i):c.push(function(I,E){return i.call(I,E)}):Object.defineProperty(n,l,s))}function g(c,n,u){for(var l=[],o,b,v=new Map,D=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,C;if(h?(x=c,s=s-5,b=b||[],C=b):(x=c.prototype,o=o||[],C=o),s!==0&&!i){var P=h?D:v,M=P.get(d)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!M&&s>2?P.set(d,s):P.set(d,!0)}m(l,x,p,d,s,h,i,C,u)}}return y(l,o),y(l,b),l}function y(c,n){n&&c.push(function(u){for(var l=0;l<n.length;l++)n[l].call(u);return u})}function T(c,n,u){if(n.length>0){for(var l=[],o=c,b=c.name,v=n.length-1;v>=0;v--){var D={v:!1};try{var w=n[v](o,{kind:"class",name:b,addInitializer:f(l,D),metadata:u})}finally{D.v=!0}w!==void 0&&(a(10,w),o=w)}return[S(o,u),function(){for(var p=0;p<l.length;p++)l[p].call(o)}]}}function S(c,n){return Object.defineProperty(c,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,l,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),D=g(n,u,v);return l.length||S(n,v),{e:D,get c(){return T(n,l,v)}}}}function Wr(f,t,e,r){return(Wr=Oi())(f,t,e,r)}var Zr,Xr,Fi;Zr=bt({access:H.Write,selector:/^#[[\w$]+$/});var Yr=class{static{({c:[Fi,Xr]}=Wr(this,[],[Zr]))}constructor(t=O.use(Z),e=O.use(rt),r=O.use(xt)){this.mChildName=e.name.substring(1),this.mComponentScopeValue=r,this.mTargetNode=t,this.mComponentScopeValue.setTemporaryValue(this.mChildName,this.mTargetNode)}mChildName;mComponentScopeValue;mTargetNode;onDeconstruct(){this.mComponentScopeValue.data.store[this.mChildName]===this.mTargetNode&&this.mComponentScopeValue.data.deleteTemporaryValue(this.mChildName)}static{Xr()}};function _i(){function f(c,n){return function(l){e(n,"addInitializer"),r(l,"An initializer"),c.push(l)}}function t(c,n,u,l,o,b,v,D,w){var p;switch(o){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+n:n,static:b,private:v,metadata:D},d={v:!1};s.addInitializer=f(l,d);var i,h;o===0?v?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):o===2?i=function(){return u.value}:((o===1||o===3)&&(i=function(){return u.get.call(this)}),(o===1||o===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return c(w,s)}finally{d.v=!0}}function e(c,n){if(c.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(c,n){if(typeof c!="function")throw new TypeError(n+" must be a function")}function a(c,n){var u=typeof n;if(c===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(u!=="function"){var l;throw c===0?l="field":c===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function m(c,n,u,l,o,b,v,D,w){var p=u[0],s,d,i;v?o===0||o===1?s={get:u[3],set:u[4]}:o===3?s={get:u[3]}:o===4?s={set:u[3]}:s={value:u[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var h,x,C;if(typeof p=="function")h=t(p,l,s,D,o,b,v,w,i),h!==void 0&&(a(o,h),o===0?d=h:o===1?(d=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h);else for(var P=p.length-1;P>=0;P--){var M=p[P];if(h=t(M,l,s,D,o,b,v,w,i),h!==void 0){a(o,h);var N;o===0?N=h:o===1?(N=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(o===0||o===1){if(d===void 0)d=function(I,E){return E};else if(typeof d!="function"){var _=d;d=function(I,E){for(var L=E,R=0;R<_.length;R++)L=_[R].call(I,L);return L}}else{var V=d;d=function(I,E){return V.call(I,E)}}c.push(d)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),v?o===1?(c.push(function(I,E){return i.get.call(I,E)}),c.push(function(I,E){return i.set.call(I,E)})):o===2?c.push(i):c.push(function(I,E){return i.call(I,E)}):Object.defineProperty(n,l,s))}function g(c,n,u){for(var l=[],o,b,v=new Map,D=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,C;if(h?(x=c,s=s-5,b=b||[],C=b):(x=c.prototype,o=o||[],C=o),s!==0&&!i){var P=h?D:v,M=P.get(d)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!M&&s>2?P.set(d,s):P.set(d,!0)}m(l,x,p,d,s,h,i,C,u)}}return y(l,o),y(l,b),l}function y(c,n){n&&c.push(function(u){for(var l=0;l<n.length;l++)n[l].call(u);return u})}function T(c,n,u){if(n.length>0){for(var l=[],o=c,b=c.name,v=n.length-1;v>=0;v--){var D={v:!1};try{var w=n[v](o,{kind:"class",name:b,addInitializer:f(l,D),metadata:u})}finally{D.v=!0}w!==void 0&&(a(10,w),o=w)}return[S(o,u),function(){for(var p=0;p<l.length;p++)l[p].call(o)}]}}function S(c,n){return Object.defineProperty(c,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,l,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),D=g(n,u,v);return l.length||S(n,v),{e:D,get c(){return T(n,l,v)}}}}function Kr(f,t,e,r){return(Kr=_i())(f,t,e,r)}var Qr,qr,ji;Qr=Ct({instructionType:"slot"});var Jr=class{static{({c:[ji,qr]}=Kr(this,[],[Qr]))}constructor(t=O.use(U),e=O.use(Q)){this.mModuleValues=t,this.mSlotName=e.value,this.mIsSetup=!1}mIsSetup;mModuleValues;mSlotName;onUpdate(){if(this.mIsSetup)return null;this.mIsSetup=!0;let t=new St("slot");this.mSlotName!==""&&t.setAttribute("name").addValue(this.mSlotName);let e=new ct;e.appendChild(t);let r=new ut;return r.addElement(e,this.mModuleValues.data),r}static{qr()}};function Vi(){function f(c,n){return function(l){e(n,"addInitializer"),r(l,"An initializer"),c.push(l)}}function t(c,n,u,l,o,b,v,D,w){var p;switch(o){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+n:n,static:b,private:v,metadata:D},d={v:!1};s.addInitializer=f(l,d);var i,h;o===0?v?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):o===2?i=function(){return u.value}:((o===1||o===3)&&(i=function(){return u.get.call(this)}),(o===1||o===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return c(w,s)}finally{d.v=!0}}function e(c,n){if(c.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(c,n){if(typeof c!="function")throw new TypeError(n+" must be a function")}function a(c,n){var u=typeof n;if(c===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(u!=="function"){var l;throw c===0?l="field":c===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function m(c,n,u,l,o,b,v,D,w){var p=u[0],s,d,i;v?o===0||o===1?s={get:u[3],set:u[4]}:o===3?s={get:u[3]}:o===4?s={set:u[3]}:s={value:u[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var h,x,C;if(typeof p=="function")h=t(p,l,s,D,o,b,v,w,i),h!==void 0&&(a(o,h),o===0?d=h:o===1?(d=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h);else for(var P=p.length-1;P>=0;P--){var M=p[P];if(h=t(M,l,s,D,o,b,v,w,i),h!==void 0){a(o,h);var N;o===0?N=h:o===1?(N=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(o===0||o===1){if(d===void 0)d=function(I,E){return E};else if(typeof d!="function"){var _=d;d=function(I,E){for(var L=E,R=0;R<_.length;R++)L=_[R].call(I,L);return L}}else{var V=d;d=function(I,E){return V.call(I,E)}}c.push(d)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),v?o===1?(c.push(function(I,E){return i.get.call(I,E)}),c.push(function(I,E){return i.set.call(I,E)})):o===2?c.push(i):c.push(function(I,E){return i.call(I,E)}):Object.defineProperty(n,l,s))}function g(c,n,u){for(var l=[],o,b,v=new Map,D=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,C;if(h?(x=c,s=s-5,b=b||[],C=b):(x=c.prototype,o=o||[],C=o),s!==0&&!i){var P=h?D:v,M=P.get(d)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!M&&s>2?P.set(d,s):P.set(d,!0)}m(l,x,p,d,s,h,i,C,u)}}return y(l,o),y(l,b),l}function y(c,n){n&&c.push(function(u){for(var l=0;l<n.length;l++)n[l].call(u);return u})}function T(c,n,u){if(n.length>0){for(var l=[],o=c,b=c.name,v=n.length-1;v>=0;v--){var D={v:!1};try{var w=n[v](o,{kind:"class",name:b,addInitializer:f(l,D),metadata:u})}finally{D.v=!0}w!==void 0&&(a(10,w),o=w)}return[S(o,u),function(){for(var p=0;p<l.length;p++)l[p].call(o)}]}}function S(c,n){return Object.defineProperty(c,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,l,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),D=g(n,u,v);return l.length||S(n,v),{e:D,get c(){return T(n,l,v)}}}}function eo(f,t,e,r){return(eo=Vi())(f,t,e,r)}var ro,kr,zi;ro=bt({access:H.ReadWrite,selector:/^\[\([[\w$]+\)\]$/});var to=class{static{({c:[zi,kr]}=eo(this,[],[ro]))}constructor(t=O.use($),e=O.use(Z),r=O.use(U),a=O.use(rt)){this.mTargetNode=e,this.mAttributeKey=a.name.substring(2,a.name.length-2),this.mReadProcedure=r.createExpressionProcedure(a.value),this.mWriteProcedure=r.createExpressionProcedure(`${a.value} = $DATA;`,["$DATA"]),this.mLastDataValue=Symbol("Uncomparable");let m=g=>{this.mLastDataValue!==g&&t.updater.updateAsync()};this.mTargetNode.addEventListener("input",g=>{m(Reflect.get(this.mTargetNode,this.mAttributeKey))}),this.mTargetNode.addEventListener("change",g=>{m(Reflect.get(this.mTargetNode,this.mAttributeKey))})}mAttributeKey;mLastDataValue;mReadProcedure;mTargetNode;mWriteProcedure;onUpdate(){let t=this.mReadProcedure.execute();if(t!==this.mLastDataValue)return Reflect.set(this.mTargetNode,this.mAttributeKey,t),this.mLastDataValue=t,!0;let e=Reflect.get(this.mTargetNode,this.mAttributeKey);return e!==t?(this.mWriteProcedure.setTemporaryValue("$DATA",e),this.mWriteProcedure.execute(),this.mLastDataValue=e,!0):!1}static{kr()}};function $i(){function f(c,n){return function(l){e(n,"addInitializer"),r(l,"An initializer"),c.push(l)}}function t(c,n,u,l,o,b,v,D,w){var p;switch(o){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+n:n,static:b,private:v,metadata:D},d={v:!1};s.addInitializer=f(l,d);var i,h;o===0?v?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):o===2?i=function(){return u.value}:((o===1||o===3)&&(i=function(){return u.get.call(this)}),(o===1||o===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return c(w,s)}finally{d.v=!0}}function e(c,n){if(c.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(c,n){if(typeof c!="function")throw new TypeError(n+" must be a function")}function a(c,n){var u=typeof n;if(c===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(u!=="function"){var l;throw c===0?l="field":c===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function m(c,n,u,l,o,b,v,D,w){var p=u[0],s,d,i;v?o===0||o===1?s={get:u[3],set:u[4]}:o===3?s={get:u[3]}:o===4?s={set:u[3]}:s={value:u[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var h,x,C;if(typeof p=="function")h=t(p,l,s,D,o,b,v,w,i),h!==void 0&&(a(o,h),o===0?d=h:o===1?(d=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h);else for(var P=p.length-1;P>=0;P--){var M=p[P];if(h=t(M,l,s,D,o,b,v,w,i),h!==void 0){a(o,h);var N;o===0?N=h:o===1?(N=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(o===0||o===1){if(d===void 0)d=function(I,E){return E};else if(typeof d!="function"){var _=d;d=function(I,E){for(var L=E,R=0;R<_.length;R++)L=_[R].call(I,L);return L}}else{var V=d;d=function(I,E){return V.call(I,E)}}c.push(d)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),v?o===1?(c.push(function(I,E){return i.get.call(I,E)}),c.push(function(I,E){return i.set.call(I,E)})):o===2?c.push(i):c.push(function(I,E){return i.call(I,E)}):Object.defineProperty(n,l,s))}function g(c,n,u){for(var l=[],o,b,v=new Map,D=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,C;if(h?(x=c,s=s-5,b=b||[],C=b):(x=c.prototype,o=o||[],C=o),s!==0&&!i){var P=h?D:v,M=P.get(d)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!M&&s>2?P.set(d,s):P.set(d,!0)}m(l,x,p,d,s,h,i,C,u)}}return y(l,o),y(l,b),l}function y(c,n){n&&c.push(function(u){for(var l=0;l<n.length;l++)n[l].call(u);return u})}function T(c,n,u){if(n.length>0){for(var l=[],o=c,b=c.name,v=n.length-1;v>=0;v--){var D={v:!1};try{var w=n[v](o,{kind:"class",name:b,addInitializer:f(l,D),metadata:u})}finally{D.v=!0}w!==void 0&&(a(10,w),o=w)}return[S(o,u),function(){for(var p=0;p<l.length;p++)l[p].call(o)}]}}function S(c,n){return Object.defineProperty(c,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,l,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),D=g(n,u,v);return l.length||S(n,v),{e:D,get c(){return T(n,l,v)}}}}function io(f,t,e,r){return(io=$i())(f,t,e,r)}var so,oo,Gi;so=Bt({access:H.Read,targetRestrictions:[yt]});var no=class{static{({c:[Gi,oo]}=io(this,[],[so]))}constructor(t=O.use(yt),e=O.use(Z)){let r=new Array,a=t.processorConstructor;do{let m=it.get(a).getMetadata(ge.METADATA_USER_EVENT_LISTENER_PROPERIES);if(m)for(let g of m)r.push(g)}while(a=Object.getPrototypeOf(a));this.mEventListenerList=new Array,this.mTargetElement=e;for(let m of r){let[g,y]=m,T=Reflect.get(t.processor,g);T=T.bind(t.processor),this.mEventListenerList.push([y,T]),this.mTargetElement.addEventListener(y,T)}}mEventListenerList;mTargetElement;onDeconstruct(){for(let t of this.mEventListenerList){let[e,r]=t;this.mTargetElement.removeEventListener(e,r)}}static{oo()}};var ao=`:host {\r
    display: block;\r
    width: 100%;\r
    height: 100%;\r
}\r
\r
potatno-code-editor {\r
    display: block;\r
    width: 100%;\r
    height: 100%;\r
}`;var Jt=class{mProject;constructor(t){this.mProject=t}deserialize(t){let e=new Mt(this.mProject);for(let r of t.functions)e.addFunction(this.deserializeFunction(r,e));return e}deserializeFunction(t,e){let r=new ft(this.mProject,e,{definitionId:t.definitionId,id:t.id,label:t.label,isSystem:t.isSystem});for(let m of t.imports)r.addImport(m);for(let m of t.inputs)r.addInput({label:m.label,dataType:m.dataType});for(let m of t.outputs)r.addOutput({label:m.label,dataType:m.dataType});let a=new Map;for(let m of t.nodes)a.set(m.id,this.deserializeNode(m,r,e));for(let m of t.connections){if(!a.has(m.sourceNodeId)||!a.has(m.targetNodeId))continue;let g=a.get(m.sourceNodeId),y=a.get(m.targetNodeId),T=g.outputs.map.get(m.sourcePortId),S=y.inputs.map.get(m.targetPortId);!T||!S||T.connect(S)}return r}deserializeNode(t,e,r){let a=r.nodeDefinitions.find(g=>g.id===t.definitionId),m=(()=>{if(a)return e.addNodeByDefinition(a,t.transformation);let g=t.ports.filter(T=>T.direction==="input").map(T=>({dataType:T.dataType,definitionId:T.definitionId,label:T.label,portType:T.portType})),y=t.ports.filter(T=>T.direction==="output").map(T=>({dataType:T.dataType,definitionId:T.definitionId,label:T.label,portType:T.portType}));return new gt(this.mProject,r,e,{definitionId:t.definitionId,ports:{input:g,output:y},label:t.label,transformation:{...t.transformation}})})();m.label=t.label,e.addNode(m);for(let g of t.ports)if(g.portType==="value"&&g.directValue.length>0){let y=m.inputs.map.get(g.definitionId);y&&y.setDirectValue(g.directValue)}return m.preview=t.preview??null,m}};var Kt=class{constructor(){}serialize(t){return{functions:[...t.functions].map(e=>this.serializeFunction(e))}}serializeFunction(t){let e=new Map;[...t.nodes].forEach((y,T)=>{e.set(y,`n${T}`)});let r=[...t.nodes].map(y=>this.serializeNode(y,e.get(y))),a=[];for(let y of t.nodes){let T=e.get(y);for(let S of y.outputs.list)for(let c of S.connectedPorts){let n=e.get(c.node);a.push({sourceNodeId:T,sourcePortId:S.definitionId,targetNodeId:n,targetPortId:c.definitionId})}}let m=t.inputs.map(y=>({label:y.label,dataType:y.dataType})),g=t.outputs.map(y=>({label:y.label,dataType:y.dataType}));return{id:t.id,label:t.label,isSystem:t.isSystem,definitionId:t.definitionId,inputs:m,outputs:g,imports:[...t.imports],nodes:r,connections:a}}serializeNode(t,e){let r=[...t.inputs.list,...t.outputs.list].map(m=>({definitionId:m.definitionId,label:m.label,direction:m.direction,portType:m.portType,dataType:m.portType==="value"?m.dataType:null,directValue:[...m.directValue]})),a=t.preview?structuredClone(t.preview):null;return{id:e,definitionId:t.definitionId,label:t.label,transformation:{...t.transformation},ports:r,preview:a}}};var lo=`:host {\r
    /* Globals */\r
    --potatno-grid-size: 25px;\r
    --potatno-font-size: 12px;\r
\r
    /* Main colors */\r
    --potatno-color-background: #1e1e2e;\r
    --potatno-color-text: #a6adc8;\r
    --potatno-color-accent: #89b4fa;\r
\r
    /* Supporting colors */\r
    --potatno-color-error: #f38ba8;\r
\r
\r
\r
\r
\r
\r
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
    --pn-node-border: #45475a;\r
    --pn-node-border-selected: #89b4fa;\r
    --pn-node-shadow: rgba(0, 0, 0, 0.3);\r
    --pn-node-button-font-size: 9px;\r
    --pn-node-font-size: var(--pn-font-size-sm);\r
    --pn-node-header-height: var(--pn-grid-size);\r
    --pn-node-port-body-size: 9px;\r
    --pn-node-port-gap: var(--pn-grid-size);\r
    --pn-node-port-tip-size: 5px;\r
\r
    /* Font */\r
    --pn-font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;\r
    --pn-font-mono: 'Cascadia Code', 'Fira Code', 'Consolas', monospace;\r
    --pn-font-size-sm: 11px;\r
    --pn-font-size: 13px;\r
    --pn-font-size-lg: 14px;\r
}`;var Qt=class{mCodeGenerator;mId;mLabel;mNodesProvider;mStatics;get codeGenerator(){return this.mCodeGenerator}get id(){return this.mId}get label(){return this.mLabel}get statics(){return this.mStatics}constructor(t){this.mId=t.id,this.mLabel=t.label,this.mNodesProvider=t.nodes,this.mStatics=t.statics,this.mCodeGenerator=t.generator.code}getNodeDefinitions(t){let e=a=>{if(!a)return new Array;let m=new Array;return a(g=>{m.push(g)},t),m},r={};return Object.defineProperty(r,"entry",{get:()=>e(this.mNodesProvider.entry)}),Object.defineProperty(r,"exit",{get:()=>e(this.mNodesProvider.exit)}),Object.defineProperty(r,"dynamic",{get:()=>e(this.mNodesProvider.dynamic)}),r}},ot={none:0,imports:1,inputs:2,outputs:4};var _e=class f{static PASTE_OFFSET=2;mClipboardNodes;mManager;constructor(t){this.mManager=t,this.mClipboardNodes=new Array}copy(t){if(t.size===0)return;let e=[...t],r=new Map;for(let a=0;a<e.length;a++){let m=e[a],g=m.inputs.value.map(T=>({definitionId:T.definitionId,values:[...T.directValue]})),y={...m.transformation};y.x+=f.PASTE_OFFSET,y.y+=f.PASTE_OFFSET,r.set(m,{connections:new Array,definitionId:m.definitionId,id:a,portDirectValues:g,label:m.label,transformation:y})}for(let[a,m]of r)for(let g of a.outputs.list)for(let y of g.connectedPorts){let T=r.get(y.node);T&&m.connections.push({sourcePortName:g.definitionId,targetNodeId:T.id,targetPortName:y.definitionId})}this.mClipboardNodes=[...r.values()]}paste(){if(this.mClipboardNodes.length===0)return new Array;let t=this.mManager.activeFunction;if(!t)return[];let e=new Map;for(let r of this.mClipboardNodes){let a=t.dynamicNodeDefinitions.find(g=>g.id===r.definitionId);if(!a)continue;let m=this.mManager.graph.addNode(t,a,r.transformation);this.mManager.graph.updateNode(m,g=>{g.label=r.label;for(let y of r.portDirectValues)g.inputs.map.has(y.definitionId)&&g.inputs.map.get(y.definitionId).setDirectValue(y.values)}),e.set(r.id,m)}for(let r of this.mClipboardNodes){let a=e.get(r.id);if(a)for(let m of r.connections){let g=e.get(m.targetNodeId);if(!g)continue;let y=a.outputs.map.get(m.sourcePortName),T=g.inputs.map.get(m.targetPortName);!y||!T||this.mManager.graph.connectPorts(y,T)}}return[...e.values()]}};var je=class extends ie{mGridNodeArea;mGridPaths;mNodeArea;mPathArea;constructor(){super(),this.mGridNodeArea=new WeakMap,this.mNodeArea=new Map,this.mGridPaths=new WeakMap,this.mPathArea=new Map}clear(t){t==="all"&&this.mNodeArea.clear(),this.mPathArea.clear()}getPath(t,e){let r=t.direction==="input"&&t.portType==="value"||t.direction==="output"&&t.portType==="flow"?t:e;return this.mGridPaths.get(r)??new Array}removeNodeArea(t){if(!this.mGridNodeArea.has(t))return;let e=this.mGridNodeArea.get(t);for(let r of e){let a=(this.mNodeArea.get(r)??0)-1;a<1?this.mNodeArea.delete(r):this.mNodeArea.set(r,a)}this.mGridNodeArea.delete(t)}updateNodeArea(t){this.removeNodeArea(t);let e=t.transformation.x,r=t.transformation.y,a=t.transformation.width,m=t.transformation.height,g=new Array;for(let y=0;y<a;y++)for(let T=0;T<m;T++){let S=`${y+e}|${T+r}`,c=(this.mNodeArea.get(S)??0)+1;this.mNodeArea.set(S,c),g.push(S)}this.mGridNodeArea.set(t,g)}updatePath(t,e,r){if(t.direction==="input"&&t.portType!=="value"||t.direction==="output"&&t.portType!=="flow")throw new A("Start port must be an input-value or an output-flow node.",this);this.removePathArea(t);let a=this.start(e,r);this.mGridPaths.set(t,a.path);let m=this.nodeId(e),g=this.nodeId(r);for(let y of a.path){let T=this.nodeId(y),S=this.mPathArea.has(T)?this.mPathArea.get(T):{ports:new Map,entryPoints:new Set};S.ports.set(t,[m,g]),S.entryPoints.add(m),S.entryPoints.add(g),this.mPathArea.set(T,S)}}costOfTraversal(t,e){let r=this.nodeId(t),a=1;this.mNodeArea.has(r)&&t!==e.endNode&&(a*=20);let m=e.path.next().value;if(this.mPathArea.has(r)){let c=this.mPathArea.get(r),n=this.nodeId(e.startNode),u=this.nodeId(e.endNode);if(c.entryPoints.has(n)||c.entryPoints.has(u))a*=.2;else if(a*=5,m){let l=this.nodeId(m);this.mPathArea.has(l)&&(a*=20)}}if(m){let c=t.y===m.y;(t===e.endNode||m===e.startNode)&&!c&&(a*=100);let n=e.path.next().value;n&&(t.x===n.x||t.y===n.y)&&(a*=.7)}let g=Math.abs(t.x-e.startNode.x),y=Math.abs(t.x-e.endNode.x),T=g<=y;(T&&t.y===e.startNode.y||!T&&t.y===e.endNode.y)&&(a*=.5);let S=e.endNode.x+e.startNode.x>>1;return t.x===S&&(a*=.5),a}heuristic(t,e){return(Math.abs(t.x-e.endNode.x)+Math.abs(t.y-e.endNode.y))*.5}neighborNodes(t){return[{x:t.x,y:t.y-1},{x:t.x-1,y:t.y},{x:t.x+1,y:t.y},{x:t.x,y:t.y+1}]}nodeId(t){return`${t.x}|${t.y}`}removePathArea(t){if(!this.mGridPaths.has(t))return;let e=this.mGridPaths.get(t);for(let r of e){let a=this.nodeId(r),m=this.mPathArea.get(a);if(!m)continue;let g=m.ports.get(t);g&&(m.ports.delete(t),m.entryPoints.delete(g[0]),m.entryPoints.delete(g[1]),m.ports.size===0?this.mPathArea.delete(a):this.mPathArea.set(a,m))}this.mGridPaths.delete(t)}};var Ve=class{mGridElement;mManager;mPathFinder;set gridElement(t){this.mGridElement=t}constructor(t){this.mManager=t,this.mGridElement=null,this.mPathFinder=new je,this.mManager.subscribe(F.Node|F.SpecialActiveFunction,null,e=>{if((e.changeType&F.SpecialActiveFunction)>0){if(!this.mManager.activeFunction)return;this.mPathFinder.clear("all");for(let r of this.mManager.activeFunction.nodes)this.mPathFinder.updateNodeArea(r);this.updatePaths();return}(e.changeType&F.Node)>0&&((e.changeType&F.NodeDelete)>0?this.mPathFinder.removeNodeArea(e.item):this.mPathFinder.updateNodeArea(e.item)),this.updatePaths()}),this.mManager.subscribe(F.Connection,null,()=>{this.updatePaths()})}createTemporaryPath(t,e){let r=y=>y instanceof nt?this.getPortGridPoint(y):y,a=r(t),m=r(e),g=this.mPathFinder.start(a,m).path;return this.createSvgPath(g)}getConnectionPath(t,e){let r=this.mPathFinder.getPath(t,e);return this.createSvgPath(r)}getPortGridPoint(t){let e=t.node,r=t.direction==="input"?e.inputs.list:e.outputs.list,a=(()=>{let g=0;for(;g<r.length&&r[g]!==t;g++);return g})(),m=t.direction==="input"?e.transformation.x:e.transformation.x+e.transformation.width-1;return{y:e.transformation.y+1+a,x:m}}pixelToGridSpace(t,e){let r=t,a=e;if(this.mGridElement){let m=this.mGridElement.getBoundingClientRect();r-=m.left,a-=m.top}return r-=this.mManager.grid.panX,a-=this.mManager.grid.panY,r/=this.mManager.grid.zoom,a/=this.mManager.grid.zoom,{x:Math.floor(r/this.mManager.grid.gridSize),y:Math.floor(a/this.mManager.grid.gridSize)}}createGridCellPath(t,e,r){let a=this.getGridPosition(t,e),m=this.getGridPosition(t,r),g={x:e==="bottom"||e==="top"?a.x:m.x,y:e==="left"||e==="right"?a.y:m.y};return`M ${a.x},${a.y} Q ${g.x},${g.y} ${m.x},${m.y}`}createPath(t,e){let[r,a]=t.direction==="input"&&t.portType==="value"||t.direction==="output"&&t.portType==="flow"?[t,e]:[e,t],m=this.getPortGridPoint(r),g=this.getPortGridPoint(a);this.mPathFinder.updatePath(r,m,g)}createSvgPath(t){let e=(a,m)=>{let g=m.x-a.x,y=m.y-a.y;switch(!0){case(g===0&&y===1):return"bottom";case(g===0&&y===-1):return"top";case(g===-1&&y===0):return"left";case(g===1&&y===0):return"right";default:throw new A("Missformed path. Path points are not directly next to each other.",this)}},r="";for(let a=1;a<t.length-1;a++){let m=t[a],g=t[a-1],y=t[a+1],T=e(m,g),S=e(m,y);r+=this.createGridCellPath(m,T,S)}return r}getGridPosition(t,e){let r={x:t.x*this.mManager.grid.gridSize+this.mManager.grid.gridSize/2,y:t.y*this.mManager.grid.gridSize+this.mManager.grid.gridSize/2},a=this.mManager.grid.gridSize/2;switch(e){case"top":r.y-=a;break;case"right":r.x+=a;break;case"bottom":r.y+=a;break;case"left":r.x-=a;break}return r}updatePaths(){this.mPathFinder.clear("path");let t=this.mManager.activeFunction;if(t)for(let e of t.nodes){for(let r of e.outputs.flow){let a=r.connectedPorts.values().next().value;a&&this.createPath(r,a)}for(let r of e.inputs.value){let a=r.connectedPorts.values().next().value;a&&this.createPath(r,a)}}}};var ze=class{mDocument;mManager;get document(){return this.mDocument}constructor(t){this.mManager=t,this.mDocument=null}addFunction(t){let e=this.mDocument,r=this.mManager.project;if(!e||!r||!r.userFunctions.has(t))return;let a=new ft(r,e,{definitionId:t,id:crypto.randomUUID(),isSystem:!1,label:`Function ${e.functions.size}`});e.addFunction(a),e.validate(),this.mManager.dispatch(F.FunctionAdd,a),this.mManager.setActiveFunction(a.id)}addNode(t,e,r){let a=t.addNodeByDefinition(e,r);return this.mManager.dispatch(F.NodeAdd,a),a}connectPorts(t,e){try{t.connect(e)}catch{return!1}return this.mManager.dispatch(F.ConnectionAdd,t),this.mManager.dispatch(F.ConnectionAdd,e),!0}disconnectPorts(t,e){t.disconnect(e),this.mManager.dispatch(F.ConnectionDelete,t),this.mManager.dispatch(F.ConnectionDelete,e)}removeFunction(t){let e=this.mDocument;if(!e)return;let r=null;for(let a of e.functions)if(a.id===t){r=a,e.removeFunction(a);break}r&&(this.mManager.dispatch(F.FunctionDelete,r),this.setDefaultActiveFunction())}removeNode(t){t.function.removeNode(t),this.mManager.dispatch(F.NodeDelete,t)}setDocument(t){this.mDocument=t,this.mDocument.validate(),this.mManager.dispatch(F.Document,this.mDocument),this.setDefaultActiveFunction()}setPortDirectValue(t,e){t.setDirectValue(e),this.mManager.dispatch(F.NodeUpdate,t.node)}transformNode(t,e){let r={x:t.transformation.x,y:t.transformation.y,width:t.transformation.width,height:t.transformation.height,...e};t.moveTo(r.x,r.y),t.resizeTo(r.width,r.height),this.mManager.dispatch(F.NodeTransform,t)}updateNode(t,e){t&&(e(t),this.mManager.dispatch(F.NodeUpdate,t))}setDefaultActiveFunction(){if(!this.mDocument||this.mDocument.functions.size===0)return;let t=(()=>{let e=[...this.mDocument.functions];return e.some(a=>a.id===this.mManager.activeFunctionId)?this.mManager.activeFunctionId:e[0].id})();this.mManager.activeFunctionId!==t&&this.mManager.setActiveFunction(t)}};var $e=class f{static GRID_SIZE=25;static MAX_ZOOM=2;static MIN_ZOOM=.25;mPanX;mPanY;mZoom;get gridSize(){return f.GRID_SIZE}get panX(){return this.mPanX}get panY(){return this.mPanY}get zoom(){return this.mZoom}constructor(){this.mPanX=0,this.mPanY=0,this.mZoom=1}getGridBackgroundCss(){let t=f.GRID_SIZE*this.mZoom,e=this.mPanX%t,r=this.mPanY%t;return[`background-size: ${t}px ${t}px`,`background-position: ${e}px ${r}px`,'background-image: url("data:image/svg+xml,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 viewBox%3D%220 0 100 100%22%3E%3Cpath d%3D%22M0 0h18M0 0v18M100 0H82M100 0v18M0 100h18M0 100V82M100 100H82M100 100V82%22 stroke%3D%22%23313244%22 stroke-width%3D%225%22 stroke-linecap%3D%22round%22%2F%3E%3C%2Fsvg%3E")'].join("; ")}getTransformCss(){return`translate(${this.mPanX}px, ${this.mPanY}px) scale(${this.mZoom})`}pan(t,e){this.mPanX+=t,this.mPanY+=e}screenToWorld(t,e){return{x:(t-this.mPanX)/this.mZoom,y:(e-this.mPanY)/this.mZoom}}snapToGrid(t,e){return{x:Math.round(t/f.GRID_SIZE)*f.GRID_SIZE,y:Math.round(e/f.GRID_SIZE)*f.GRID_SIZE}}zoomAt(t,e,r){let a=this.mZoom,m=1+r,g=this.mZoom*m;g=Math.max(f.MIN_ZOOM,Math.min(f.MAX_ZOOM,g));let y=(t-this.mPanX)/a,T=(e-this.mPanY)/a;this.mZoom=g,this.mPanX=t-y*this.mZoom,this.mPanY=e-T*this.mZoom}};var Ge=class f{static MAX_HISTORY_ITEMS=100;mManager;mSnapshotIndex;mSnapshots;get canRedo(){return this.mSnapshotIndex<this.mSnapshots.length-1}get canUndo(){return this.mSnapshotIndex>0}constructor(t){this.mManager=t,this.mSnapshotIndex=-1,this.mSnapshots=new Array;let e=0;this.mManager.subscribe(F.Any,null,()=>{globalThis.clearTimeout(e),e=globalThis.setTimeout(()=>{this.pushHistory()},1e3)})}clear(){this.mSnapshots.length=0,this.mSnapshotIndex=-1}redo(){if(!this.canRedo)return;let t=this.mSnapshots[++this.mSnapshotIndex],e=JSON.parse(t);this.restoreHistory(e)}undo(){if(!this.canUndo)return;let t=this.mSnapshots[--this.mSnapshotIndex],e=JSON.parse(t);this.restoreHistory(e)}pushHistory(){let t=this.mManager.graph.document;if(!t)return;this.mSnapshots.splice(this.mSnapshotIndex+1);let e=new Kt().serialize(t),r=JSON.stringify(e);this.mSnapshots.length>0&&this.mSnapshots.at(-1)===r||(this.mSnapshotIndex=this.mSnapshots.push(r)-1,this.mSnapshots.length>f.MAX_HISTORY_ITEMS&&(this.mSnapshots.shift(),this.mSnapshotIndex--))}restoreHistory(t){let e=this.mManager.project;e&&this.mManager.graph.setDocument(new Jt(e).deserialize(t))}};var Be=class{mErrorItems;mErrorList;mIsDirty;mManager;get errorItems(){return this.mIsDirty&&this.revalidate(),this.mErrorItems}get errors(){return this.mIsDirty&&this.revalidate(),this.mErrorList}get isValid(){return this.mIsDirty&&this.revalidate(),this.mErrorItems.size===0}constructor(t){this.mManager=t,this.mErrorList=new Array,this.mErrorItems=new Set,this.mIsDirty=!0;let e=0;this.mManager.subscribe(F.Any,null,()=>{this.mIsDirty=!0,globalThis.clearTimeout(e),e=globalThis.setTimeout(()=>{this.mIsDirty&&(this.revalidate(),this.mIsDirty=!1)},1e3)})}revalidate(){if(!this.mManager.graph.document)return;this.mErrorList.splice(0,this.mErrorList.length),this.mErrorItems.clear();let t=this.mManager.graph.document.validate();for(let e of t.errors)switch(this.mErrorItems.add(e.item),!0){case e.item instanceof nt:{this.mErrorList.push({location:`Node "${e.item.node.label}"`,message:e.message});break}case e.item instanceof gt:{this.mErrorList.push({location:`Node "${e.item.label}"`,message:e.message});break}}for(let e of t.affectedItems)switch(!0){case e instanceof nt:{this.mManager.dispatch(F.PortAdd|F.PortUpdate,e);break}case e instanceof gt:{this.mManager.dispatch(F.NodeAdd|F.NodeUpdate|F.NodeTransform,e);break}case e instanceof ft:{this.mManager.dispatch(F.FunctionAdd|F.FunctionUpdate,e);break}}}};var Ue=class{mDriverActivity;mDriverElements;mDriverList;mDrivers;mElementDriver;mManager;mPreviewIntersection;constructor(t){this.mManager=t,this.mDriverList=new Array,this.mDrivers=new WeakMap,this.mDriverActivity=new WeakMap,this.mDriverElements=new WeakMap,this.mElementDriver=new WeakMap,this.mManager.subscribe(F.Document,null,()=>{this.mDriverList.splice(0,this.mDriverList.length)});let e=0,r=F.Connection|F.Function|F.Node;this.mManager.subscribe(r,null,()=>{globalThis.clearTimeout(e),e=globalThis.setTimeout(()=>this.refresh(),1e3)}),this.mPreviewIntersection=new IntersectionObserver(a=>{for(let m of a){let g=this.mElementDriver.get(m.target);if(!g)continue;let y=g.deref();y&&this.mDriverActivity.set(y,m.isIntersecting)}})}async execute(){let t=this.mDriverList.map(async e=>{let r=e.deref();if(r&&this.mDriverActivity.get(r))try{await r.execute()}catch(a){console.error("[PotatnoUiManagerPreview] Driver render failed:",a)}});await Promise.all(t)}refresh(){if(this.mManager.integrity.isValid)for(let t=this.mDriverList.length-1;t>=0;t--){let e=this.mDriverList[t].deref();if(!e){this.unregister(this.mDriverList[t]);continue}e.refresh()}}requestDriver(t,e){let r=this.mDrivers.get(t);if(r&&r.display.id===e)return r;if(!this.mManager.project)return null;let a=this.mManager.project.preview.getDisplay(e);if(!a)throw new A(`Preview has no display for "${e}".`,this);let m=a.createDriver(t);return this.register(t,m),this.mManager.integrity.isValid&&m.refresh(),m}register(t,e){this.mDrivers.set(t,e);let r=new WeakRef(e);this.mDriverList.push(r);let a=e.element;this.mDriverElements.set(r,a),this.mElementDriver.set(a,r),this.mPreviewIntersection.observe(a)}unregister(t){let e=this.mDriverList.indexOf(t);if(e===-1)return;this.mDriverList.splice(e,1);let r=this.mDriverElements.get(t);r&&this.mPreviewIntersection.unobserve(r)}};function Hi(){function f(c,n){return function(l){e(n,"addInitializer"),r(l,"An initializer"),c.push(l)}}function t(c,n,u,l,o,b,v,D,w){var p;switch(o){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+n:n,static:b,private:v,metadata:D},d={v:!1};s.addInitializer=f(l,d);var i,h;o===0?v?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):o===2?i=function(){return u.value}:((o===1||o===3)&&(i=function(){return u.get.call(this)}),(o===1||o===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return c(w,s)}finally{d.v=!0}}function e(c,n){if(c.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(c,n){if(typeof c!="function")throw new TypeError(n+" must be a function")}function a(c,n){var u=typeof n;if(c===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(u!=="function"){var l;throw c===0?l="field":c===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function m(c,n,u,l,o,b,v,D,w){var p=u[0],s,d,i;v?o===0||o===1?s={get:u[3],set:u[4]}:o===3?s={get:u[3]}:o===4?s={set:u[3]}:s={value:u[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var h,x,C;if(typeof p=="function")h=t(p,l,s,D,o,b,v,w,i),h!==void 0&&(a(o,h),o===0?d=h:o===1?(d=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h);else for(var P=p.length-1;P>=0;P--){var M=p[P];if(h=t(M,l,s,D,o,b,v,w,i),h!==void 0){a(o,h);var N;o===0?N=h:o===1?(N=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(o===0||o===1){if(d===void 0)d=function(I,E){return E};else if(typeof d!="function"){var _=d;d=function(I,E){for(var L=E,R=0;R<_.length;R++)L=_[R].call(I,L);return L}}else{var V=d;d=function(I,E){return V.call(I,E)}}c.push(d)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),v?o===1?(c.push(function(I,E){return i.get.call(I,E)}),c.push(function(I,E){return i.set.call(I,E)})):o===2?c.push(i):c.push(function(I,E){return i.call(I,E)}):Object.defineProperty(n,l,s))}function g(c,n,u){for(var l=[],o,b,v=new Map,D=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,C;if(h?(x=c,s=s-5,b=b||[],C=b):(x=c.prototype,o=o||[],C=o),s!==0&&!i){var P=h?D:v,M=P.get(d)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!M&&s>2?P.set(d,s):P.set(d,!0)}m(l,x,p,d,s,h,i,C,u)}}return y(l,o),y(l,b),l}function y(c,n){n&&c.push(function(u){for(var l=0;l<n.length;l++)n[l].call(u);return u})}function T(c,n,u){if(n.length>0){for(var l=[],o=c,b=c.name,v=n.length-1;v>=0;v--){var D={v:!1};try{var w=n[v](o,{kind:"class",name:b,addInitializer:f(l,D),metadata:u})}finally{D.v=!0}w!==void 0&&(a(10,w),o=w)}return[S(o,u),function(){for(var p=0;p<l.length;p++)l[p].call(o)}]}}function S(c,n){return Object.defineProperty(c,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,l,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),D=g(n,u,v);return l.length||S(n,v),{e:D,get c(){return T(n,l,v)}}}}function mo(f,t,e,r){return(mo=Hi())(f,t,e,r)}var fo,co,uo,K;fo=O.injectable("singleton");var ho=class extends(uo=EventTarget){static{({c:[K,co]}=mo(this,[],[fo],uo))}constructor(){super(),this.mClipboard=new _e(this),this.mIntegrity=new Be(this),this.mConnections=new Ve(this),this.mGraph=new ze(this),this.mHistory=new Ge(this),this.mPreview=new Ue(this),this.mGrid=new $e,this.mActiveFunctionId="",this.mProject=null,this.mEventBuffer=new Map,this.mEventBufferDispatchRequest=-1}mActiveFunctionId;mClipboard;mConnections;mEventBuffer;mEventBufferDispatchRequest;mGraph;mGrid;mHistory;mIntegrity;mPreview;mProject;get activeFunction(){let t=this.mGraph.document;if(!t)return null;for(let e of t.functions)if(e.id===this.mActiveFunctionId)return e;return null}get activeFunctionId(){return this.mActiveFunctionId}get clipboard(){return this.mClipboard}get connections(){return this.mConnections}get graph(){return this.mGraph}get grid(){return this.mGrid}get history(){return this.mHistory}get integrity(){return this.mIntegrity}get preview(){return this.mPreview}get project(){return this.mProject}dispatch(t,e){let r=this.mEventBuffer.get(e)??0;this.mEventBuffer.set(e,r|t),this.mEventBufferDispatchRequest!==-1&&globalThis.cancelAnimationFrame(this.mEventBufferDispatchRequest),this.mEventBufferDispatchRequest=requestAnimationFrame(()=>{this.mEventBufferDispatchRequest=-1;for(let[a,m]of this.mEventBuffer)this.dispatchEvent(new we(m,a));this.mEventBuffer.clear()})}generateStringColor(t){let e=(()=>{let a=0;for(let m=0;m<t.length;m++)a=t.charCodeAt(m)+((a<<5)-a);return a})();return`hsl(${Math.abs(e)*137.508%360}, 70%, 60%)`}initialize(t,e){this.mProject=t,this.mGraph.setDocument(e)}setActiveFunction(t){let e=this.mGraph.document;if(!(!e||this.mActiveFunctionId===t)){for(let r of e.functions)if(r.id===t){this.mActiveFunctionId=t,this.dispatch(F.SpecialActiveFunction,r);return}}}subscribe(t,e,r){let a=g=>{if(!e)return!0;let y=g;for(;y!==null;){if(e.has(y))return!0;switch(!0){case y instanceof nt:{y=y.node;break}case y instanceof gt:{y=y.function;break}case y instanceof ft:{y=y.document;break}default:y=null}}return!1},m=g=>{t!==F.Any&&(g.changeType&t)===0||e!==null&&!a(g.item)||r(g)};return this.addEventListener(we.EVENT_TYPE,m),()=>{this.removeEventListener(we.EVENT_TYPE,m)}}updateFunctionProperties(t){let e=this.activeFunction;if(!e)return;let a=e.project.getFunction(e.definitionId)?.statics??ot.imports|ot.inputs|ot.outputs;if(t.name!==void 0&&(e.label=t.name),t.inputs!==void 0&&(a&ot.inputs)===0){for(let m of[...e.inputs])e.removeInput(m);for(let m of t.inputs)e.addInput({dataType:m.type,label:m.name})}if(t.outputs!==void 0&&(a&ot.outputs)===0){for(let m of[...e.outputs])e.removeOutput(m);for(let m of t.outputs)e.addOutput({dataType:m.type,label:m.name})}if(t.imports!==void 0&&(a&ot.imports)===0){let m=new Set(e.imports),g=new Set(t.imports);for(let y of[...e.imports])g.has(y)||e.removeImport(y);for(let y of t.imports)m.has(y)||e.addImport(y)}this.dispatch(F.FunctionUpdate,e)}static{co()}},F={Any:16777215,Connection:15,ConnectionAdd:1,ConnectionUpdate:2,ConnectionDelete:4,Document:240,Function:3840,FunctionAdd:256,FunctionUpdate:512,FunctionDelete:1024,Node:61440,NodeAdd:4096,NodeUpdate:8192,NodeDelete:16384,NodeTransform:32768,Port:983040,PortAdd:65536,PortUpdate:131072,PortDelete:262144,Special:15728640,SpecialActiveFunction:1048576},we=class f extends Event{static EVENT_TYPE="PotatnoUiManagerChangeEvent";mChangeType;mEventItem;get changeType(){return this.mChangeType}get item(){return this.mEventItem}constructor(t,e){super(f.EVENT_TYPE),this.mChangeType=t,this.mEventItem=e}};var po=`:host {\r
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
    background: var(--pn-bg-secondary);\r
    border-left: 1px solid var(--pn-border-default);\r
    display: flex;\r
    flex-direction: column;\r
    overflow: hidden;\r
    flex-shrink: 0;\r
}\r
`;var go=`<div class="editor-layout">
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
`;var vo=`:host {\r
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
    color: var(--potatno-color-accent);\r
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
    border-left: 2px solid var(--potatno-color-accent);\r
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
    background: var(--potatno-color-error);\r
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
    border-color: var(--potatno-color-accent);\r
    color: var(--potatno-color-accent);\r
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
`;var yo=`<div class="function-list-content">\r
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
`;function qi(){function f(c,n){return function(l){e(n,"addInitializer"),r(l,"An initializer"),c.push(l)}}function t(c,n,u,l,o,b,v,D,w){var p;switch(o){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+n:n,static:b,private:v,metadata:D},d={v:!1};s.addInitializer=f(l,d);var i,h;o===0?v?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):o===2?i=function(){return u.value}:((o===1||o===3)&&(i=function(){return u.get.call(this)}),(o===1||o===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return c(w,s)}finally{d.v=!0}}function e(c,n){if(c.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(c,n){if(typeof c!="function")throw new TypeError(n+" must be a function")}function a(c,n){var u=typeof n;if(c===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(u!=="function"){var l;throw c===0?l="field":c===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function m(c,n,u,l,o,b,v,D,w){var p=u[0],s,d,i;v?o===0||o===1?s={get:u[3],set:u[4]}:o===3?s={get:u[3]}:o===4?s={set:u[3]}:s={value:u[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var h,x,C;if(typeof p=="function")h=t(p,l,s,D,o,b,v,w,i),h!==void 0&&(a(o,h),o===0?d=h:o===1?(d=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h);else for(var P=p.length-1;P>=0;P--){var M=p[P];if(h=t(M,l,s,D,o,b,v,w,i),h!==void 0){a(o,h);var N;o===0?N=h:o===1?(N=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(o===0||o===1){if(d===void 0)d=function(I,E){return E};else if(typeof d!="function"){var _=d;d=function(I,E){for(var L=E,R=0;R<_.length;R++)L=_[R].call(I,L);return L}}else{var V=d;d=function(I,E){return V.call(I,E)}}c.push(d)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),v?o===1?(c.push(function(I,E){return i.get.call(I,E)}),c.push(function(I,E){return i.set.call(I,E)})):o===2?c.push(i):c.push(function(I,E){return i.call(I,E)}):Object.defineProperty(n,l,s))}function g(c,n,u){for(var l=[],o,b,v=new Map,D=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,C;if(h?(x=c,s=s-5,b=b||[],C=b):(x=c.prototype,o=o||[],C=o),s!==0&&!i){var P=h?D:v,M=P.get(d)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!M&&s>2?P.set(d,s):P.set(d,!0)}m(l,x,p,d,s,h,i,C,u)}}return y(l,o),y(l,b),l}function y(c,n){n&&c.push(function(u){for(var l=0;l<n.length;l++)n[l].call(u);return u})}function T(c,n,u){if(n.length>0){for(var l=[],o=c,b=c.name,v=n.length-1;v>=0;v--){var D={v:!1};try{var w=n[v](o,{kind:"class",name:b,addInitializer:f(l,D),metadata:u})}finally{D.v=!0}w!==void 0&&(a(10,w),o=w)}return[S(o,u),function(){for(var p=0;p<l.length;p++)l[p].call(o)}]}}function S(c,n){return Object.defineProperty(c,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,l,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),D=g(n,u,v);return l.length||S(n,v),{e:D,get c(){return T(n,l,v)}}}}function Do(f,t,e,r){return(Do=qi())(f,t,e,r)}var Eo,bo,Io,wo,xo,Ji;Eo=J({selector:"potatno-function-list",template:yo,style:vo}),Io=W.state();var To=class{static{({e:[wo,xo],c:[Ji,bo]}=Do(this,[[Io,1,"mShowPopup"]],[Eo]))}constructor(t=O.use($),e=O.use(K)){this.mComponent=t,this.mManager=e,this.mUnsubscribe=null}mComponent;mManager;mUnsubscribe;#t=(xo(this),wo(this,!1));get mShowPopup(){return this.#t}set mShowPopup(t){this.#t=t}get activeFunctionId(){return this.mManager.activeFunctionId}get functions(){let t=this.mManager.graph.document;if(!t)return[];let e=[];for(let r of t.functions)e.push({id:r.id,label:r.label,name:r.label,system:r.isSystem});return e}get hasUserFunctionDefinitions(){return this.userFunctionDefinitions.length>0}get showPopup(){return this.mShowPopup}get userFunctionDefinitions(){let t=this.mManager.project;return t?[...t.userFunctions.values()].map(e=>({id:e.id})):[]}closePopup(){this.mShowPopup=!1}getEntryClass(t){return t===this.activeFunctionId?"function-entry active":"function-entry"}onConnect(){this.mUnsubscribe=this.mManager.subscribe(F.Document|F.Function|F.SpecialActiveFunction,null,()=>{this.mComponent.updater.updateAsync()})}onDeconstruct(){this.mUnsubscribe?.(),this.mUnsubscribe=null}onAddButtonClick(){let t=this.userFunctionDefinitions;t.length===1?this.mManager.graph.addFunction(t[0].id):this.mShowPopup=!this.mShowPopup}onDefinitionSelect(t){this.mShowPopup=!1,this.mManager.graph.addFunction(t)}onFunctionDelete(t,e){t.stopPropagation(),this.mManager.graph.removeFunction(e)}onFunctionSelect(t){this.mManager.setActiveFunction(t)}static{bo()}};var So=`:host {
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
    color: var(--potatno-color-accent);
    font-family: var(--pn-font-family);
    font-size: var(--pn-font-size);
    outline: none;
    padding: 8px 10px;
    width: 100%;
}

.add-node-search:focus {
    border-bottom-color: var(--potatno-color-accent);
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
    color: var(--potatno-color-accent);
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

.add-node-result-label {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.add-node-result-category {
    color: var(--pn-text-muted);
    flex-shrink: 0;
    font-size: var(--pn-font-size-sm);
    text-transform: capitalize;
}

.add-node-empty {
    color: var(--pn-text-muted);
    font-family: var(--pn-font-family);
    font-size: var(--pn-font-size-sm);
    padding: 14px 10px;
    text-align: center;
}
`;var Co=`<div class="add-node-popup" (pointerdown)="this.stopPropagation($event)" (wheel)="this.stopPropagation($event)" (contextmenu)="this.stopPropagation($event)">
    <input #searchInput type="text" placeholder="Search nodes..." class="add-node-search" [(value)]="this.searchValue" (keydown)="this.onKeyDown($event)" />
    <div class="add-node-results">
        $for(entry of this.results) {
            <div class="add-node-result {{this.entry.definition.id === this.selectedDefinitionId ? 'selected' : ''}}" (click)="this.sendSelectedEntry(this.entry.definition.id)">
                <span class="add-node-result-border" style="background: {{this.entry.color}}"></span>
                <span class="add-node-result-icon">{{this.entry.icon}}</span>
                <span class="add-node-result-label">{{this.entry.label}}</span>
                <span class="add-node-result-category">{{this.entry.category}}</span>
            </div>
        }
        $if(this.results.length === 0) {
            <div class="add-node-empty">No matching nodes found.</div>
        }
    </div>
</div>
`;function ki(){function f(c,n){return function(l){e(n,"addInitializer"),r(l,"An initializer"),c.push(l)}}function t(c,n,u,l,o,b,v,D,w){var p;switch(o){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+n:n,static:b,private:v,metadata:D},d={v:!1};s.addInitializer=f(l,d);var i,h;o===0?v?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):o===2?i=function(){return u.value}:((o===1||o===3)&&(i=function(){return u.get.call(this)}),(o===1||o===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return c(w,s)}finally{d.v=!0}}function e(c,n){if(c.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(c,n){if(typeof c!="function")throw new TypeError(n+" must be a function")}function a(c,n){var u=typeof n;if(c===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(u!=="function"){var l;throw c===0?l="field":c===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function m(c,n,u,l,o,b,v,D,w){var p=u[0],s,d,i;v?o===0||o===1?s={get:u[3],set:u[4]}:o===3?s={get:u[3]}:o===4?s={set:u[3]}:s={value:u[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var h,x,C;if(typeof p=="function")h=t(p,l,s,D,o,b,v,w,i),h!==void 0&&(a(o,h),o===0?d=h:o===1?(d=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h);else for(var P=p.length-1;P>=0;P--){var M=p[P];if(h=t(M,l,s,D,o,b,v,w,i),h!==void 0){a(o,h);var N;o===0?N=h:o===1?(N=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(o===0||o===1){if(d===void 0)d=function(I,E){return E};else if(typeof d!="function"){var _=d;d=function(I,E){for(var L=E,R=0;R<_.length;R++)L=_[R].call(I,L);return L}}else{var V=d;d=function(I,E){return V.call(I,E)}}c.push(d)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),v?o===1?(c.push(function(I,E){return i.get.call(I,E)}),c.push(function(I,E){return i.set.call(I,E)})):o===2?c.push(i):c.push(function(I,E){return i.call(I,E)}):Object.defineProperty(n,l,s))}function g(c,n,u){for(var l=[],o,b,v=new Map,D=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,C;if(h?(x=c,s=s-5,b=b||[],C=b):(x=c.prototype,o=o||[],C=o),s!==0&&!i){var P=h?D:v,M=P.get(d)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!M&&s>2?P.set(d,s):P.set(d,!0)}m(l,x,p,d,s,h,i,C,u)}}return y(l,o),y(l,b),l}function y(c,n){n&&c.push(function(u){for(var l=0;l<n.length;l++)n[l].call(u);return u})}function T(c,n,u){if(n.length>0){for(var l=[],o=c,b=c.name,v=n.length-1;v>=0;v--){var D={v:!1};try{var w=n[v](o,{kind:"class",name:b,addInitializer:f(l,D),metadata:u})}finally{D.v=!0}w!==void 0&&(a(10,w),o=w)}return[S(o,u),function(){for(var p=0;p<l.length;p++)l[p].call(o)}]}}function S(c,n){return Object.defineProperty(c,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,l,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),D=g(n,u,v);return l.length||S(n,v),{e:D,get c(){return T(n,l,v)}}}}function _o(f,t,e,r){return(_o=ki())(f,t,e,r)}var jo,Po,Vo,zo,$o,Go,Bo,Mo,No,Ao,Lo,Ro,Oo,ur;jo=J({selector:"potatno-node-selection-popup",template:Co,style:So}),Vo=W.state({complexValue:!0}),zo=at("searchInput"),$o=qt("node-select"),Go=W.state(),Bo=W.state();var Fo=class{static{({e:[Mo,No,Ao,Lo,Ro,Oo],c:[ur,Po]}=_o(this,[[Vo,1,"results"],[zo,1,"searchInput"],[$o,1,"mNodeSelect"],[Go,1,"searchValue"],[Bo,1,"selectedDefinitionId"]],[jo]))}constructor(t=O.use(K)){this.mManager=t,this.selectedDefinitionId=null,this.results=new Array,this.searchValue=""}mManager;#t=(Oo(this),Mo(this));get results(){return this.#t}set results(t){this.#t=t}#e=No(this);get searchInput(){return this.#e}set searchInput(t){this.#e=t}#r=Ao(this);get mNodeSelect(){return this.#r}set mNodeSelect(t){this.#r=t}#o=Lo(this);get searchValue(){return this.#o}set searchValue(t){this.#o=t}#n=Ro(this);get selectedDefinitionId(){return this.#n}set selectedDefinitionId(t){this.#n=t}onConnect(){this.searchInput.focus()}onUpdate(){this.rebuildResults()}onKeyDown(t){if(this.results.length!==0){if(t.key==="ArrowDown"||t.key==="ArrowUp"){t.preventDefault();let e=this.results.findIndex(m=>m.definition.id===this.selectedDefinitionId);e=Math.max(0,e);let r=t.key==="ArrowDown"?1:-1,a=(e+r+this.results.length)%this.results.length;this.selectedDefinitionId=this.results[a].definition.id;return}t.key==="Enter"&&this.sendSelectedEntry(this.selectedDefinitionId)}}stopPropagation(t){t.stopPropagation()}sendSelectedEntry(t){if(t===null)return;let e=this.results.find(r=>r.definition.id===t);e&&this.mNodeSelect.dispatchEvent(e.definition)}rebuildResults(){if(!this.mManager.activeFunction){this.results=new Array;return}let t=this.mManager.activeFunction.dynamicNodeDefinitions.map(r=>({category:r.category.name,definition:r,label:r.label.toLowerCase(),color:this.mManager.generateStringColor(r.category.name),icon:r.category.icon})),e=this.searchValue.trim().toLowerCase();this.results=t.filter(r=>r.label.includes(e)),this.results.some(r=>r.definition.id===this.selectedDefinitionId)||(this.selectedDefinitionId=this.results[0]?.definition.id??null)}static{Po()}};var Uo=`:host {\r
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
`;var Ho=`<svg #svgLayer class="svg-layer" xmlns="http://www.w3.org/2000/svg" (contextmenu)="this.onConnectionDelete($event)"></svg>
`;function rs(){function f(c,n){return function(l){e(n,"addInitializer"),r(l,"An initializer"),c.push(l)}}function t(c,n,u,l,o,b,v,D,w){var p;switch(o){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+n:n,static:b,private:v,metadata:D},d={v:!1};s.addInitializer=f(l,d);var i,h;o===0?v?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):o===2?i=function(){return u.value}:((o===1||o===3)&&(i=function(){return u.get.call(this)}),(o===1||o===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return c(w,s)}finally{d.v=!0}}function e(c,n){if(c.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(c,n){if(typeof c!="function")throw new TypeError(n+" must be a function")}function a(c,n){var u=typeof n;if(c===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(u!=="function"){var l;throw c===0?l="field":c===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function m(c,n,u,l,o,b,v,D,w){var p=u[0],s,d,i;v?o===0||o===1?s={get:u[3],set:u[4]}:o===3?s={get:u[3]}:o===4?s={set:u[3]}:s={value:u[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var h,x,C;if(typeof p=="function")h=t(p,l,s,D,o,b,v,w,i),h!==void 0&&(a(o,h),o===0?d=h:o===1?(d=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h);else for(var P=p.length-1;P>=0;P--){var M=p[P];if(h=t(M,l,s,D,o,b,v,w,i),h!==void 0){a(o,h);var N;o===0?N=h:o===1?(N=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(o===0||o===1){if(d===void 0)d=function(I,E){return E};else if(typeof d!="function"){var _=d;d=function(I,E){for(var L=E,R=0;R<_.length;R++)L=_[R].call(I,L);return L}}else{var V=d;d=function(I,E){return V.call(I,E)}}c.push(d)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),v?o===1?(c.push(function(I,E){return i.get.call(I,E)}),c.push(function(I,E){return i.set.call(I,E)})):o===2?c.push(i):c.push(function(I,E){return i.call(I,E)}):Object.defineProperty(n,l,s))}function g(c,n,u){for(var l=[],o,b,v=new Map,D=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,C;if(h?(x=c,s=s-5,b=b||[],C=b):(x=c.prototype,o=o||[],C=o),s!==0&&!i){var P=h?D:v,M=P.get(d)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!M&&s>2?P.set(d,s):P.set(d,!0)}m(l,x,p,d,s,h,i,C,u)}}return y(l,o),y(l,b),l}function y(c,n){n&&c.push(function(u){for(var l=0;l<n.length;l++)n[l].call(u);return u})}function T(c,n,u){if(n.length>0){for(var l=[],o=c,b=c.name,v=n.length-1;v>=0;v--){var D={v:!1};try{var w=n[v](o,{kind:"class",name:b,addInitializer:f(l,D),metadata:u})}finally{D.v=!0}w!==void 0&&(a(10,w),o=w)}return[S(o,u),function(){for(var p=0;p<l.length;p++)l[p].call(o)}]}}function S(c,n){return Object.defineProperty(c,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,l,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),D=g(n,u,v);return l.length||S(n,v),{e:D,get c(){return T(n,l,v)}}}}function qo(f,t,e,r){return(qo=rs())(f,t,e,r)}var Jo,Xo,Ko,Yo,Wo,hr;Jo=J({selector:"potatno-connection-layer",template:Ho,style:Uo}),Ko=at("svgLayer");var Zo=class{static{({e:[Yo,Wo],c:[hr,Xo]}=qo(this,[[Ko,1,"svgLayer"]],[Jo]))}constructor(t=O.use(K)){this.mConnectionRegistry=new Map,this.mManager=t;let e=0;this.mUnsubscribe=this.mManager.subscribe(F.SpecialActiveFunction|F.Node|F.Connection,null,()=>{e===0&&(e=requestAnimationFrame(()=>{e=0,this.renderConnections()}))})}mConnectionRegistry;mManager;mUnsubscribe;#t=(Wo(this),Yo(this));get svgLayer(){return this.#t}set svgLayer(t){this.#t=t}onConnectionDelete(t){if(!(t.target instanceof Element))return;let e=parseInt(t.target.getAttribute("data-connection-id")??"");if(isNaN(e))return;t.preventDefault(),t.stopPropagation();let r=this.mConnectionRegistry.get(e);r&&this.mManager.graph.disconnectPorts(r.sourcePort,r.targetPort)}onDeconstruct(){this.mUnsubscribe()}renderConnectionPath(t,e,r,a,m){let g="http://www.w3.org/2000/svg",y=this.mManager.connections.getConnectionPath(r,a),T=document.createElementNS(g,"path");T.classList.add("path"),T.classList.toggle(".path--invalid",!m),T.setAttribute("d",y),r.portType==="value"&&T.style.setProperty("--path-color",this.mManager.generateStringColor(r.resolvedDataType));let S=document.createElementNS(g,"path");S.classList.add("path","path--mouse-target"),S.setAttribute("d",y),S.setAttribute("data-connection-id",e.toString()),t.appendChild(T),t.appendChild(S)}renderConnections(){this.svgLayer.innerHTML="",this.mConnectionRegistry.clear();let t=this.mManager.activeFunction;if(!t)return;let e=this.mManager.integrity.errorItems,r=0;for(let a of t.nodes)for(let m of a.outputs.list)for(let g of m.connectedPorts){let y=r++;this.mConnectionRegistry.set(y,{sourcePort:m,targetPort:g});let T=e.has(m)||e.has(g);this.renderConnectionPath(this.svgLayer,y,m,g,!T)}}static{Xo()}};function os(){function f(c,n){return function(l){e(n,"addInitializer"),r(l,"An initializer"),c.push(l)}}function t(c,n,u,l,o,b,v,D,w){var p;switch(o){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+n:n,static:b,private:v,metadata:D},d={v:!1};s.addInitializer=f(l,d);var i,h;o===0?v?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):o===2?i=function(){return u.value}:((o===1||o===3)&&(i=function(){return u.get.call(this)}),(o===1||o===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return c(w,s)}finally{d.v=!0}}function e(c,n){if(c.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(c,n){if(typeof c!="function")throw new TypeError(n+" must be a function")}function a(c,n){var u=typeof n;if(c===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(u!=="function"){var l;throw c===0?l="field":c===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function m(c,n,u,l,o,b,v,D,w){var p=u[0],s,d,i;v?o===0||o===1?s={get:u[3],set:u[4]}:o===3?s={get:u[3]}:o===4?s={set:u[3]}:s={value:u[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var h,x,C;if(typeof p=="function")h=t(p,l,s,D,o,b,v,w,i),h!==void 0&&(a(o,h),o===0?d=h:o===1?(d=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h);else for(var P=p.length-1;P>=0;P--){var M=p[P];if(h=t(M,l,s,D,o,b,v,w,i),h!==void 0){a(o,h);var N;o===0?N=h:o===1?(N=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(o===0||o===1){if(d===void 0)d=function(I,E){return E};else if(typeof d!="function"){var _=d;d=function(I,E){for(var L=E,R=0;R<_.length;R++)L=_[R].call(I,L);return L}}else{var V=d;d=function(I,E){return V.call(I,E)}}c.push(d)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),v?o===1?(c.push(function(I,E){return i.get.call(I,E)}),c.push(function(I,E){return i.set.call(I,E)})):o===2?c.push(i):c.push(function(I,E){return i.call(I,E)}):Object.defineProperty(n,l,s))}function g(c,n,u){for(var l=[],o,b,v=new Map,D=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,C;if(h?(x=c,s=s-5,b=b||[],C=b):(x=c.prototype,o=o||[],C=o),s!==0&&!i){var P=h?D:v,M=P.get(d)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!M&&s>2?P.set(d,s):P.set(d,!0)}m(l,x,p,d,s,h,i,C,u)}}return y(l,o),y(l,b),l}function y(c,n){n&&c.push(function(u){for(var l=0;l<n.length;l++)n[l].call(u);return u})}function T(c,n,u){if(n.length>0){for(var l=[],o=c,b=c.name,v=n.length-1;v>=0;v--){var D={v:!1};try{var w=n[v](o,{kind:"class",name:b,addInitializer:f(l,D),metadata:u})}finally{D.v=!0}w!==void 0&&(a(10,w),o=w)}return[S(o,u),function(){for(var p=0;p<l.length;p++)l[p].call(o)}]}}function S(c,n){return Object.defineProperty(c,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,l,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),D=g(n,u,v);return l.length||S(n,v),{e:D,get c(){return T(n,l,v)}}}}function tn(f,t,e,r){return(tn=os())(f,t,e,r)}var en,Qo,xe;en=bt({access:H.Read,selector:/^potatno-preview$/});var ko=class{static{({c:[xe,Qo]}=tn(this,[],[en]))}constructor(t=O.use(Z),e=O.use(U),r=O.use(rt)){this.mTarget=t,this.mProcedure=e.createExpressionProcedure(r.value)}mProcedure;mTarget;onUpdate(){let t=this.mProcedure.execute();if(!t){let r=this.mTarget.childNodes.length>0;return r&&(this.mTarget.innerHTML=""),r}let e=t.element;return this.mTarget.contains(e)?!1:(this.mTarget.innerHTML="",this.mTarget.appendChild(e),!0)}static{Qo()}};(function(f){f.Function="function",f.Comment="comment",f.Input="input",f.Output="output",f.Reroute="reroute"})(kt||(kt={}));var kt;var rn=`:host {\r
    display: block;\r
    position: relative;\r
\r
    --potatno-port-value-size: 5px;\r
    --potatno-port-flow-size: 15px;\r
    --potatno-port-handle-width: max(var(--potatno-port-value-size), var(--potatno-port-flow-size));\r
}\r
\r
.port-wrapper {\r
    ---potatno-port-color: var(--type-color);\r
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
        stroke: var(---potatno-port-color);\r
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
        background-color: var(---potatno-port-color);\r
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
        border: 1px solid var(---potatno-port-color);\r
        border-radius: 2px;\r
\r
        background: color-mix(in srgb, var(---potatno-port-color) 12%, var(--potatno-color-background));\r
        white-space: nowrap;\r
    }\r
\r
    .port-values__label {\r
        color: var(---potatno-port-color);\r
        font-size: var(--potatno-font-size);\r
        user-select: none;\r
        white-space: nowrap;\r
    }\r
\r
    .port-values__input {\r
        padding: 1px 3px;\r
        width: 40px;\r
        border: 1px solid color-mix(in srgb, var(---potatno-port-color) 35%, transparent);\r
        border-radius: 2px;\r
        color: var(--pn-text-primary);\r
        background: color-mix(in srgb, var(---potatno-port-color) 8%, var(--potatno-color-background));\r
        box-sizing: border-box;\r
        font-size: var(--pn-font-size-sm);\r
        appearance: textfield;\r
\r
        &:focus {\r
            border-color: var(---potatno-port-color);\r
            box-shadow: 0 0 0 1px color-mix(in srgb, var(---potatno-port-color) 30%, transparent);\r
            outline: none;\r
        }\r
\r
        &[type='checkbox'] {\r
            margin: 0;\r
            accent-color: var(---potatno-port-color);\r
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
                    background: var(---potatno-port-color);\r
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
                    background: var(---potatno-port-color);\r
                }\r
\r
                &:not(.connected)::before {\r
                    background: color-mix(in srgb, var(---potatno-port-color) 30%, var(--potatno-color-background));\r
                }\r
\r
                &.error::before {\r
                    background: var(--potatno-color-error);\r
                }\r
\r
                .output & {\r
                    &::after {\r
                        right: 1px;\r
                        border-left: var(--pn-node-port-tip-size) solid var(---potatno-port-color);\r
                    }\r
\r
                    &.connected::after {\r
                        border-left-color: var(---potatno-port-color);\r
                    }\r
\r
                    &:not(.connected)::after {\r
                        border-left-color: color-mix(in srgb, var(---potatno-port-color) 30%, var(--potatno-color-background));\r
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
                        border-right: var(--pn-node-port-tip-size) solid var(---potatno-port-color);\r
                    }\r
\r
                    &.connected::after {\r
                        border-right-color: var(---potatno-port-color);\r
                    }\r
\r
                    &:not(.connected)::after {\r
                        border-right-color: color-mix(in srgb, var(---potatno-port-color, ) 30%, var(--potatno-color-background));\r
                    }\r
\r
                    &.error::after {\r
                        border-right-color: var(--potatno-color-error);\r
                    }\r
                }\r
            }\r
\r
            &.value {\r
                background: var(---potatno-port-color);\r
                border: 1px solid var(---potatno-port-color);\r
                border-radius: 50%;\r
                height: calc(var(--potatno-port-value-size) - 1px);\r
                width: calc(var(--potatno-port-value-size) - 1px);\r
\r
                &.connected {\r
                    background: var(---potatno-port-color);\r
                }\r
\r
                &:not(.connected) {\r
                    background: color-mix(in srgb, var(---potatno-port-color) 30%, var(--potatno-color-background));\r
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
}`;var on=`<div class="port-wrapper {{this.portDirection}}" style="--type-color: {{this.portColor}}" (dragover)="this.onDragOver($event)" (drop)="this.onDrop($event)">\r
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
`;function ss(){function f(c,n){return function(l){e(n,"addInitializer"),r(l,"An initializer"),c.push(l)}}function t(c,n,u,l,o,b,v,D,w){var p;switch(o){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+n:n,static:b,private:v,metadata:D},d={v:!1};s.addInitializer=f(l,d);var i,h;o===0?v?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):o===2?i=function(){return u.value}:((o===1||o===3)&&(i=function(){return u.get.call(this)}),(o===1||o===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return c(w,s)}finally{d.v=!0}}function e(c,n){if(c.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(c,n){if(typeof c!="function")throw new TypeError(n+" must be a function")}function a(c,n){var u=typeof n;if(c===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(u!=="function"){var l;throw c===0?l="field":c===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function m(c,n,u,l,o,b,v,D,w){var p=u[0],s,d,i;v?o===0||o===1?s={get:u[3],set:u[4]}:o===3?s={get:u[3]}:o===4?s={set:u[3]}:s={value:u[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var h,x,C;if(typeof p=="function")h=t(p,l,s,D,o,b,v,w,i),h!==void 0&&(a(o,h),o===0?d=h:o===1?(d=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h);else for(var P=p.length-1;P>=0;P--){var M=p[P];if(h=t(M,l,s,D,o,b,v,w,i),h!==void 0){a(o,h);var N;o===0?N=h:o===1?(N=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(o===0||o===1){if(d===void 0)d=function(I,E){return E};else if(typeof d!="function"){var _=d;d=function(I,E){for(var L=E,R=0;R<_.length;R++)L=_[R].call(I,L);return L}}else{var V=d;d=function(I,E){return V.call(I,E)}}c.push(d)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),v?o===1?(c.push(function(I,E){return i.get.call(I,E)}),c.push(function(I,E){return i.set.call(I,E)})):o===2?c.push(i):c.push(function(I,E){return i.call(I,E)}):Object.defineProperty(n,l,s))}function g(c,n,u){for(var l=[],o,b,v=new Map,D=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,C;if(h?(x=c,s=s-5,b=b||[],C=b):(x=c.prototype,o=o||[],C=o),s!==0&&!i){var P=h?D:v,M=P.get(d)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!M&&s>2?P.set(d,s):P.set(d,!0)}m(l,x,p,d,s,h,i,C,u)}}return y(l,o),y(l,b),l}function y(c,n){n&&c.push(function(u){for(var l=0;l<n.length;l++)n[l].call(u);return u})}function T(c,n,u){if(n.length>0){for(var l=[],o=c,b=c.name,v=n.length-1;v>=0;v--){var D={v:!1};try{var w=n[v](o,{kind:"class",name:b,addInitializer:f(l,D),metadata:u})}finally{D.v=!0}w!==void 0&&(a(10,w),o=w)}return[S(o,u),function(){for(var p=0;p<l.length;p++)l[p].call(o)}]}}function S(c,n){return Object.defineProperty(c,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,l,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),D=g(n,u,v);return l.length||S(n,v),{e:D,get c(){return T(n,l,v)}}}}function ln(f,t,e,r){return(ln=ss())(f,t,e,r)}function as(f){return f}var cn,nn,un,sn,an,He;cn=J({selector:"potatno-port",template:on,style:rn}),un=at("dragConnection");new class extends as{constructor(){super(He),nn()}static{class f{static{({e:[sn,an],c:[He,nn]}=ln(this,[[un,1,"dragConnectionSvg"],[wt,3,"port"]],[cn]))}static DRAG_MIME_TYPE="application/x-potatno-port";static mDraggedPortInformation;mComponent;mDragPositionEventHandler;mManager;mPort;mUnsubscribe;get dragPositionEventHandler(){return this.mDragPositionEventHandler}#t=(an(this),sn(this));get dragConnectionSvg(){return this.#t}set dragConnectionSvg(e){this.#t=e}get hasError(){return this.port===null?!1:this.mManager.integrity.errorItems.has(this.port)}get inputDefinitions(){if(!this.port)return new Array;let e=this.port.project.types.getType(this.port.resolvedDataType);return e.inputs.map((r,a)=>({htmlType:(()=>{switch(r.type){case"boolean":return"checkbox";case"number":return"number";case"string":return"text"}})(),index:a,name:r.name,value:this.port.directValue[a]??"",totalCount:e.inputs.length}))}get port(){return this.mPort}set port(e){if(this.mPort!==e){if(e===null)throw new A("A null port cant be assigned.",this);this.mPort=e,this.mComponent.updater.updateAsync()}}get portColor(){return!this.port||this.port.portType==="flow"?"var(--potatno-color-text)":this.mManager.generateStringColor(this.port.resolvedDataType)}get portDirection(){return this.port?.direction??"output"}get portHandleClasses(){if(!this.port)return"";let e=[this.port.portType];return this.port.connectedPorts.size>0&&e.push("connected"),this.hasError&&e.push("error"),e.join(" ")}get portName(){return this.port?.label??""}get portType(){return!this.port||this.port.portType!=="value"?"":this.port.resolvedDataType??""}get showValueInput(){return!this.port||this.port.portType!=="value"||this.port.direction!=="input"||this.port.connectedPorts.size>0||f.mDraggedPortInformation&&f.mDraggedPortInformation.port===this.port?!1:!this.port.node.project.types.isGenericType(this.port.dataType??"")}constructor(e=O.use($),r=O.use(K)){this.mComponent=e,this.mManager=r,this.mPort=null,this.mUnsubscribe=null,this.mDragPositionEventHandler=a=>{f.mDraggedPortInformation&&f.mDraggedPortInformation.port===this.port&&this.renderDragWire(a.clientX,a.clientY)}}onConnect(){this.mUnsubscribe=this.mManager.subscribe(F.Connection|F.Node,null,()=>{this.mComponent.updater.updateAsync()}),document.addEventListener("dragover",this.mDragPositionEventHandler,{capture:!0})}onDeconstruct(){this.mUnsubscribe?.(),this.mUnsubscribe=null,document.removeEventListener("dragover",this.mDragPositionEventHandler,{capture:!0})}onDirectValueInput(e,r){if(!this.port)return;let a=e.target,m=[...this.port.directValue];m[r]=a.type==="checkbox"?a.checked?"true":"false":a.value,this.mManager.graph.setPortDirectValue(this.port,m)}onDragEnd(e){e.stopPropagation(),e.preventDefault(),this.dragConnectionSvg.innerHTML="",this.mComponent.updater.updateAsync()}onDragOver(e){this.draggedPortCanConnect(e.dataTransfer)&&(e.preventDefault(),e.stopPropagation(),e.dataTransfer&&(e.dataTransfer.dropEffect="link"))}onDragStart(e){if(!this.port||!e.dataTransfer){e.preventDefault();return}e.stopPropagation(),e.dataTransfer.effectAllowed="link",e.dataTransfer.setData(f.DRAG_MIME_TYPE,this.port.definitionId),e.dataTransfer.setDragImage(document.createElement("div"),0,0);let r=this.mManager.connections.getPortGridPoint(this.port);this.port.direction==="input"&&(r.x-=1),f.mDraggedPortInformation={port:this.port,portPosition:{x:r.x+1,y:r.y},lastPointerGridPosition:{x:0,y:0}},this.mComponent.updater.updateAsync()}onDrop(e){if(!this.draggedPortCanConnect(e.dataTransfer)||(e.preventDefault(),e.stopPropagation(),!f.mDraggedPortInformation)||!this.port)return;let r=f.mDraggedPortInformation.port;this.mManager.graph.connectPorts(r,this.port)}stopEventPropagation(e){e.stopPropagation()}createDragPath(e,r){if(!this.port)return"";let a=this.mManager.connections.pixelToGridSpace(e,r);return this.mManager.connections.createTemporaryPath(this.port,a)}draggedPortCanConnect(e){if(!this.port||!f.mDraggedPortInformation||!e||!e.types.includes(f.DRAG_MIME_TYPE))return!1;let r=f.mDraggedPortInformation.port;return r!==this.port&&r.direction!==this.port.direction&&r.portType===this.port.portType}renderDragWire(e,r){if(!f.mDraggedPortInformation)return;let a=this.dragConnectionSvg.firstChild;a||(a=document.createElementNS("http://www.w3.org/2000/svg","path"),this.dragConnectionSvg.appendChild(a));let m=this.mManager.connections.pixelToGridSpace(e,r);if(m.x===f.mDraggedPortInformation.lastPointerGridPosition.x&&m.y===f.mDraggedPortInformation.lastPointerGridPosition.y)return;f.mDraggedPortInformation.lastPointerGridPosition.x=m.x,f.mDraggedPortInformation.lastPointerGridPosition.y=m.y;let g=f.mDraggedPortInformation.portPosition,y=g.x*this.mManager.grid.gridSize,T=g.y*this.mManager.grid.gridSize;this.dragConnectionSvg.style.setProperty("transform",`translate(${-y}px, ${-T}px)`),a.setAttribute("d",this.createDragPath(e,r))}}}};var hn=`:host {\r
    display: block;\r
    height: 100%;\r
    width: 100%;\r
    font-family: var(--pn-font-family);\r
    font-size: var(--pn-font-size);\r
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
    box-shadow: 0 2px 8px var(--pn-node-shadow);\r
    overflow: visible;\r
    user-select: none;\r
\r
    /* Add border and adjust global position for it. */\r
    border: 1px solid var(--pn-node-border);\r
    transform: translate(-1px, -1px);\r
}\r
\r
.node.selected {\r
    border-color: var(--pn-node-border-selected);\r
    box-shadow: 0 0 0 1px var(--pn-node-border-selected), 0 2px 8px var(--pn-node-shadow);\r
}\r
\r
.node.has-error,\r
.node.has-error.selected {\r
    border-color: var(--potatno-color-error, #f38ba8);\r
    box-shadow: 0 0 0 1px var(--potatno-color-error, #f38ba8), 0 2px 8px var(--pn-node-shadow);\r
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
    color: var(--potatno-color-accent);\r
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
    border-color: var(--pn-node-border-selected);\r
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
    background: var(--pn-bg-secondary);\r
    overflow: hidden;\r
}\r
\r
.node-preview:empty {\r
    display: none;\r
}\r
\r
.node-preview:not(:empty) {\r
    padding: 6px;\r
    border-top: 1px solid var(--pn-node-border);\r
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
    box-shadow: 0 0 0 2px var(--pn-node-border-selected);\r
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
`;var dn=`$if(this.nodeData) {
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
`;function us(){function f(c,n){return function(l){e(n,"addInitializer"),r(l,"An initializer"),c.push(l)}}function t(c,n,u,l,o,b,v,D,w){var p;switch(o){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+n:n,static:b,private:v,metadata:D},d={v:!1};s.addInitializer=f(l,d);var i,h;o===0?v?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):o===2?i=function(){return u.value}:((o===1||o===3)&&(i=function(){return u.get.call(this)}),(o===1||o===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return c(w,s)}finally{d.v=!0}}function e(c,n){if(c.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(c,n){if(typeof c!="function")throw new TypeError(n+" must be a function")}function a(c,n){var u=typeof n;if(c===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(u!=="function"){var l;throw c===0?l="field":c===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function m(c,n,u,l,o,b,v,D,w){var p=u[0],s,d,i;v?o===0||o===1?s={get:u[3],set:u[4]}:o===3?s={get:u[3]}:o===4?s={set:u[3]}:s={value:u[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var h,x,C;if(typeof p=="function")h=t(p,l,s,D,o,b,v,w,i),h!==void 0&&(a(o,h),o===0?d=h:o===1?(d=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h);else for(var P=p.length-1;P>=0;P--){var M=p[P];if(h=t(M,l,s,D,o,b,v,w,i),h!==void 0){a(o,h);var N;o===0?N=h:o===1?(N=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(o===0||o===1){if(d===void 0)d=function(I,E){return E};else if(typeof d!="function"){var _=d;d=function(I,E){for(var L=E,R=0;R<_.length;R++)L=_[R].call(I,L);return L}}else{var V=d;d=function(I,E){return V.call(I,E)}}c.push(d)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),v?o===1?(c.push(function(I,E){return i.get.call(I,E)}),c.push(function(I,E){return i.set.call(I,E)})):o===2?c.push(i):c.push(function(I,E){return i.call(I,E)}):Object.defineProperty(n,l,s))}function g(c,n,u){for(var l=[],o,b,v=new Map,D=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,C;if(h?(x=c,s=s-5,b=b||[],C=b):(x=c.prototype,o=o||[],C=o),s!==0&&!i){var P=h?D:v,M=P.get(d)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!M&&s>2?P.set(d,s):P.set(d,!0)}m(l,x,p,d,s,h,i,C,u)}}return y(l,o),y(l,b),l}function y(c,n){n&&c.push(function(u){for(var l=0;l<n.length;l++)n[l].call(u);return u})}function T(c,n,u){if(n.length>0){for(var l=[],o=c,b=c.name,v=n.length-1;v>=0;v--){var D={v:!1};try{var w=n[v](o,{kind:"class",name:b,addInitializer:f(l,D),metadata:u})}finally{D.v=!0}w!==void 0&&(a(10,w),o=w)}return[S(o,u),function(){for(var p=0;p<l.length;p++)l[p].call(o)}]}}function S(c,n){return Object.defineProperty(c,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,l,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),D=g(n,u,v);return l.length||S(n,v),{e:D,get c(){return T(n,l,v)}}}}function bn(f,t,e,r){return(bn=us())(f,t,e,r)}var wn,mn,xn,Tn,Dn,fn,pn,gn,vn,dr;wn=J({selector:"potatno-node",template:dn,style:hn,modules:[xe],components:[He]}),xn=W.state(),Tn=W.state(),Dn=qt("resize-start");var yn=class{static{({e:[fn,pn,gn,vn],c:[dr,mn]}=bn(this,[[[wt,xn],1,"nodeData"],[[wt,Tn],1,"selected"],[Dn,1,"mResizeStart"]],[wn]))}constructor(t=O.use($),e=O.use(K)){this.mComponent=t,this.mManager=e,this.mUnsubscribe=null,this.mNodeDefinition=null}mComponent;mManager;mUnsubscribe;mNodeDefinition;#t=(vn(this),fn(this,null));get nodeData(){return this.#t}set nodeData(t){this.#t=t}#e=pn(this,!1);get selected(){return this.#e}set selected(t){this.#e=t}#r=gn(this);get mResizeStart(){return this.#r}set mResizeStart(t){this.#r=t}get selectedClass(){return this.selected?"selected":""}get hasErrorClass(){return this.nodeData!==null&&this.mManager.integrity.errorItems.has(this.nodeData)?"has-error":""}get isComment(){return this.nodeDefinition?.category.name===kt.Comment}get isReroute(){return this.nodeDefinition?.category.name===kt.Reroute}get isFunction(){return this.nodeDefinition?.category.name===kt.Function}get showOpenButton(){return this.isFunction}get canPreview(){return this.valueOutputPorts.length>0}get isPreviewActive(){return this.nodeData?.preview!=null}get previewEyeClass(){return this.isPreviewActive?"preview-eye-btn active":"preview-eye-btn"}get previewDisplays(){if(!this.nodeData)return[];let t=this.nodeData.project,e=t.getFunction(this.nodeData.function.definitionId);if(!e)return[];let r=this.nodeData.preview,a=r?this.nodeData.outputs.map.get(r.portId):void 0;if(a&&a.portType==="value")return this.createDisplayOptions(t,t.preview.availableDisplays(e,a.resolvedDataType));let m=new Set;for(let g of this.valueOutputPorts)for(let y of t.preview.availableDisplays(e,g.resolvedDataType))m.add(y);return this.createDisplayOptions(t,[...m])}get previewDriver(){let t=this.nodeData?.preview;if(!this.nodeData||!t)return null;let e=this.nodeData.outputs.map.get(t.portId);return e?this.mManager.preview.requestDriver(e,t.displayId):null}get valueOutputPorts(){return this.nodeData?[...this.nodeData.outputs.value]:[]}get selectedDisplayId(){return this.nodeData?.preview?.displayId??""}get previewNoneClass(){return this.isPreviewActive?"preview-port-item":"preview-port-item active"}get categoryColor(){return this.nodeData?this.mManager.generateStringColor(this.nodeDefinition?.category.name??""):""}get categoryIcon(){return this.nodeData?this.nodeDefinition?.category.icon??"":""}get nodeLabel(){return this.nodeData?.label??""}get nodeName(){if(!this.nodeData)return"";let t=this.nodeData;return t.project.nodeDefinitions.find(r=>r.id===t.definitionId)?.label??t.label}get nodeGridStyle(){let t=this.mManager.grid.gridSize;return`--pn-grid-size: ${t}px; --pn-grid-half-size: ${t/2}px; --pn-node-port-gap: ${t}px;`}get inputPorts(){return this.nodeData?this.nodeData.inputs.list:new Array}get outputPorts(){return this.nodeData?this.nodeData.outputs.list:new Array}get nodeDefinition(){if(!this.nodeData)return null;let t=this.nodeData;return(!this.mNodeDefinition||this.mNodeDefinition.id!==t.definitionId)&&(this.mNodeDefinition=t.project.nodeDefinitions.find(e=>e.id===t.definitionId)??null),this.mNodeDefinition}isPreviewedPort(t){return this.nodeData?.preview?.portId===t.definitionId}previewPortClass(t){return this.isPreviewedPort(t)?"preview-port-item active":"preview-port-item"}onConnect(){this.mUnsubscribe=this.mManager.subscribe(F.Function|F.SpecialActiveFunction|F.Node|F.Connection,null,()=>{this.mComponent.updater.updateAsync()})}onDeconstruct(){this.mUnsubscribe?.(),this.mUnsubscribe=null}onSelectPreviewPort(t,e){t.stopPropagation();let r=this.previewDisplaysForPort(e);this.mManager.graph.updateNode(this.nodeData,a=>{if(a.preview?.portId===e.definitionId){a.preview=null;return}let m=a.preview&&r.includes(a.preview.displayId)?a.preview.displayId:r[0];m&&(a.preview={portId:e.definitionId,displayId:m})})}previewDisplaysForPort(t){if(!this.nodeData)return[];let e=this.nodeData.project.getFunction(this.nodeData.function.definitionId);return e?this.nodeData.project.preview.availableDisplays(e,t.resolvedDataType):[]}onClearPreview(t){t.stopPropagation(),this.mManager.graph.updateNode(this.nodeData,e=>{e.preview=null})}onSelectPreviewStyle(t){t.stopPropagation();let e=t.target.value;this.mManager.graph.updateNode(this.nodeData,r=>{r.preview&&(r.preview={portId:r.preview.portId,displayId:e})})}createDisplayOptions(t,e){return e.map(r=>({id:r,label:t.preview.getDisplay(r)?.name??r}))}onOpenFunction(t){if(t.stopPropagation(),!this.nodeData)return;let e=this.nodeData.definitionId,r=e.startsWith("USERFUNCTION_")?e.slice(13):e;this.mManager.setActiveFunction(r)}onCommentInput(t){let e=t.target;this.mManager.graph.updateNode(this.nodeData,r=>{r.label=e.value})}onResizeStart(t){t.stopPropagation(),t.preventDefault(),this.nodeData&&this.mResizeStart.dispatchEvent({node:this.nodeData,startX:t.clientX,startY:t.clientY})}static{mn()}};var En=`:host {\r
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
`;var In=`<div #canvasWrapper class="canvas-wrapper" [style]="this.gridBackgroundStyle" (pointerdown)="this.onCanvasPointerDown($event)" (wheel)="this.onCanvasWheel($event)" (contextmenu)="this.onContextMenu($event)">\r
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
`;function ms(){function f(c,n){return function(l){e(n,"addInitializer"),r(l,"An initializer"),c.push(l)}}function t(c,n,u,l,o,b,v,D,w){var p;switch(o){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+n:n,static:b,private:v,metadata:D},d={v:!1};s.addInitializer=f(l,d);var i,h;o===0?v?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):o===2?i=function(){return u.value}:((o===1||o===3)&&(i=function(){return u.get.call(this)}),(o===1||o===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return c(w,s)}finally{d.v=!0}}function e(c,n){if(c.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(c,n){if(typeof c!="function")throw new TypeError(n+" must be a function")}function a(c,n){var u=typeof n;if(c===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(u!=="function"){var l;throw c===0?l="field":c===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function m(c,n,u,l,o,b,v,D,w){var p=u[0],s,d,i;v?o===0||o===1?s={get:u[3],set:u[4]}:o===3?s={get:u[3]}:o===4?s={set:u[3]}:s={value:u[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var h,x,C;if(typeof p=="function")h=t(p,l,s,D,o,b,v,w,i),h!==void 0&&(a(o,h),o===0?d=h:o===1?(d=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h);else for(var P=p.length-1;P>=0;P--){var M=p[P];if(h=t(M,l,s,D,o,b,v,w,i),h!==void 0){a(o,h);var N;o===0?N=h:o===1?(N=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(o===0||o===1){if(d===void 0)d=function(I,E){return E};else if(typeof d!="function"){var _=d;d=function(I,E){for(var L=E,R=0;R<_.length;R++)L=_[R].call(I,L);return L}}else{var V=d;d=function(I,E){return V.call(I,E)}}c.push(d)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),v?o===1?(c.push(function(I,E){return i.get.call(I,E)}),c.push(function(I,E){return i.set.call(I,E)})):o===2?c.push(i):c.push(function(I,E){return i.call(I,E)}):Object.defineProperty(n,l,s))}function g(c,n,u){for(var l=[],o,b,v=new Map,D=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,C;if(h?(x=c,s=s-5,b=b||[],C=b):(x=c.prototype,o=o||[],C=o),s!==0&&!i){var P=h?D:v,M=P.get(d)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!M&&s>2?P.set(d,s):P.set(d,!0)}m(l,x,p,d,s,h,i,C,u)}}return y(l,o),y(l,b),l}function y(c,n){n&&c.push(function(u){for(var l=0;l<n.length;l++)n[l].call(u);return u})}function T(c,n,u){if(n.length>0){for(var l=[],o=c,b=c.name,v=n.length-1;v>=0;v--){var D={v:!1};try{var w=n[v](o,{kind:"class",name:b,addInitializer:f(l,D),metadata:u})}finally{D.v=!0}w!==void 0&&(a(10,w),o=w)}return[S(o,u),function(){for(var p=0;p<l.length;p++)l[p].call(o)}]}}function S(c,n){return Object.defineProperty(c,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,l,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),D=g(n,u,v);return l.length||S(n,v),{e:D,get c(){return T(n,l,v)}}}}function Fn(f,t,e,r){return(Fn=ms())(f,t,e,r)}var _n,Sn,jn,Vn,zn,$n,Gn,Bn,Cn,Pn,Mn,Nn,An,Ln,Rn,fs;_n=J({selector:"potatno-node-graph",template:In,style:En,components:[ur,dr,hr]}),jn=W.state({complexValue:!0}),Vn=W.state(),zn=W.state(),$n=W.state({complexValue:!0}),Gn=W.state({complexValue:!0}),Bn=at("canvasWrapper");var On=class{static{({e:[Cn,Pn,Mn,Nn,An,Ln,Rn],c:[fs,Sn]}=Fn(this,[[jn,1,"mCachedGraphData"],[Vn,1,"mTransformVersion"],[zn,1,"mShowSelectionBox"],[$n,1,"mSelectionBoxScreen"],[Gn,1,"mAddNodePopup"],[Bn,1,"canvasWrapper"]],[_n]))}constructor(t=O.use($),e=O.use(K)){this.mCachedGraphData={visibleNodes:[]},this.mComponent=t,this.mDocumentPointerMoveHandler=null,this.mDocumentPointerUpHandler=null,this.mInteractionState={mode:"idle"},this.mKeyboardHandler=null,this.mManager=e,this.mSelectedNodes=new Set,this.mUnsubscribe=null}mComponent;mManager;mSelectedNodes;mDocumentPointerMoveHandler;mDocumentPointerUpHandler;mInteractionState;mKeyboardHandler;mUnsubscribe;#t=(Rn(this),Cn(this));get mCachedGraphData(){return this.#t}set mCachedGraphData(t){this.#t=t}#e=Pn(this,0);get mTransformVersion(){return this.#e}set mTransformVersion(t){this.#e=t}#r=Mn(this,!1);get mShowSelectionBox(){return this.#r}set mShowSelectionBox(t){this.#r=t}#o=Nn(this,{x1:0,x2:0,y1:0,y2:0});get mSelectionBoxScreen(){return this.#o}set mSelectionBoxScreen(t){this.#o=t}#n=An(this,null);get mAddNodePopup(){return this.#n}set mAddNodePopup(t){this.#n=t}#i=Ln(this);get canvasWrapper(){return this.#i}set canvasWrapper(t){this.#i=t}get gridBackgroundStyle(){return this.mTransformVersion,this.mManager.grid.getGridBackgroundCss()}get gridTransformStyle(){return this.mTransformVersion,"transform: "+this.mManager.grid.getTransformCss()}get gridSize(){return this.mManager.grid.gridSize}get showSelectionBox(){return this.mShowSelectionBox}get selectionBoxStyle(){let t=Math.min(this.mSelectionBoxScreen.x1,this.mSelectionBoxScreen.x2),e=Math.min(this.mSelectionBoxScreen.y1,this.mSelectionBoxScreen.y2),r=Math.abs(this.mSelectionBoxScreen.x2-this.mSelectionBoxScreen.x1),a=Math.abs(this.mSelectionBoxScreen.y2-this.mSelectionBoxScreen.y1);return`left: ${t}px; top: ${e}px; width: ${r}px; height: ${a}px`}get visibleNodes(){return this.mCachedGraphData.visibleNodes}get showAddNodePopup(){return this.mAddNodePopup!==null}get addNodePopupStyle(){let t=this.mAddNodePopup;return t?`left: ${t.screenX}px; top: ${t.screenY}px`:""}onConnect(){this.mManager.connections.gridElement=this.mComponent.element,this.mKeyboardHandler=t=>this.onKeyDown(t),document.addEventListener("keydown",this.mKeyboardHandler),this.mUnsubscribe=this.mManager.subscribe(F.Document|F.Function|F.SpecialActiveFunction|F.Node|F.Connection,null,t=>{((t.changeType&F.Document)>0||(t.changeType&F.Function)>0||(t.changeType&F.SpecialActiveFunction)>0)&&this.resetForActiveFunction(),this.invalidateGraphContent(),this.mComponent.updater.updateAsync()}),this.invalidateGraphContent()}onDeconstruct(){this.stopDocumentPointerTracking(),this.mUnsubscribe?.(),this.mUnsubscribe=null,this.mKeyboardHandler&&(document.removeEventListener("keydown",this.mKeyboardHandler),this.mKeyboardHandler=null)}onCanvasPointerDown(t){if(this.closeAddNodePopup(),t.button===1){t.preventDefault(),this.mInteractionState={mode:"panning",startX:t.clientX,startY:t.clientY},this.startDocumentPointerTracking();return}if(t.button!==0)return;t.ctrlKey||(this.mSelectedNodes.clear(),this.invalidateNodeVisuals());let e=this.getLocalPointerPosition(t.clientX,t.clientY);this.mInteractionState={mode:"selecting"},this.mSelectionBoxScreen={x1:e.x,x2:e.x,y1:e.y,y2:e.y},this.mShowSelectionBox=!1,this.startDocumentPointerTracking()}onCanvasWheel(t){t.preventDefault();let e=this.getLocalPointerPosition(t.clientX,t.clientY);this.mManager.grid.zoomAt(e.x,e.y,t.deltaY>0?-.1:.1),this.mTransformVersion++}onContextMenu(t){t.preventDefault(),!this.eventPathContainsGraphNode(t)&&this.openAddNodePopupAtPointer(t.clientX,t.clientY)}onNodePointerDown(t,e){for(let m of t.composedPath())if(m instanceof HTMLElement&&m.tagName.toLowerCase()==="potatno-port")return;if(t.stopPropagation(),this.closeAddNodePopup(),t.button!==0)return;t.ctrlKey?this.mSelectedNodes.has(e)?this.mSelectedNodes.delete(e):this.mSelectedNodes.add(e):this.mSelectedNodes.has(e)||(this.mSelectedNodes.clear(),this.mSelectedNodes.add(e)),this.invalidateNodeVisuals();let r=this.mManager.grid.gridSize,a=new Map;for(let m of this.mSelectedNodes)a.set(m,{originX:m.transformation.x*r,originY:m.transformation.y*r});this.mInteractionState={mode:"dragging-node",origins:a,startX:t.clientX,startY:t.clientY},this.startDocumentPointerTracking()}onNodeResizeStart(t){this.closeAddNodePopup(),this.mInteractionState={mode:"resizing-comment",node:t.value.node,originalH:t.value.node.transformation.height,originalW:t.value.node.transformation.width,startX:t.value.startX,startY:t.value.startY},this.startDocumentPointerTracking()}onAddNodePopupNodeSelect(t){this.insertNodeFromAddPopup(t.value)}onAddNodePopupClose(){this.closeAddNodePopup()}onDocumentPointerMove(t){let e=this.mInteractionState;if(e.mode==="panning"){this.mManager.grid.pan(t.clientX-e.startX,t.clientY-e.startY),e.startX=t.clientX,e.startY=t.clientY,this.mTransformVersion++;return}if(e.mode==="dragging-node"){this.dragSelectedNodes(t,e);return}if(e.mode==="selecting"){let r=this.getLocalPointerPosition(t.clientX,t.clientY);this.mSelectionBoxScreen={x1:this.mSelectionBoxScreen.x1,x2:r.x,y1:this.mSelectionBoxScreen.y1,y2:r.y},this.mShowSelectionBox=Math.abs(this.mSelectionBoxScreen.x2-this.mSelectionBoxScreen.x1)>5||Math.abs(this.mSelectionBoxScreen.y2-this.mSelectionBoxScreen.y1)>5;return}if(e.mode==="resizing-comment"){let r=this.mManager.grid.gridSize,a=(t.clientX-e.startX)/this.mManager.grid.zoom,m=(t.clientY-e.startY)/this.mManager.grid.zoom;this.mManager.graph.transformNode(e.node,{width:e.originalW+Math.round(a/r),height:e.originalH+Math.round(m/r)}),this.rebuildVisibleNodePositions();return}}onDocumentPointerUp(){this.mInteractionState.mode==="selecting"&&(this.mShowSelectionBox=!1,this.selectNodesInBox()),this.mInteractionState={mode:"idle"},this.stopDocumentPointerTracking()}onKeyDown(t){if(!this.isTextEditingActive()){if(t.key==="Escape"&&this.mAddNodePopup&&this.closeAddNodePopup(),t.key==="Delete"){this.deleteSelectedNodes();return}if(t.ctrlKey&&t.key==="z"){t.preventDefault(),t.shiftKey?this.mManager.history.redo():this.mManager.history.undo();return}if(t.ctrlKey&&t.key==="y"){t.preventDefault(),this.mManager.history.redo();return}if(t.ctrlKey&&t.key==="c"){this.mManager.clipboard.copy(this.mSelectedNodes);return}t.ctrlKey&&t.key==="v"&&(t.preventDefault(),this.pasteFromClipboard())}}addCommentContainedNodeOrigins(t,e){let r=this.mManager.activeFunction;if(!r)return;let a=this.mManager.grid.gridSize,m=t.transformation.x*a,g=t.transformation.y*a,y=m+t.transformation.width*a,T=g+t.transformation.height*a;for(let S of r.nodes){if(S===t||this.mSelectedNodes.has(S))continue;let c=S.transformation.x*a,n=S.transformation.y*a;c>=m&&c<=y&&n>=g&&n<=T&&e.set(S,{originX:c,originY:n})}}closeAddNodePopup(){this.mAddNodePopup=null}calculateNodeGridHeight(t){return 1+Math.max(t.inputs.list.length,t.outputs.list.length,1)}deleteSelectedNodes(){for(let t of this.mSelectedNodes)this.mManager.graph.removeNode(t);this.mSelectedNodes.clear()}dragSelectedNodes(t,e){let r=this.mManager.grid.zoom,a=this.mManager.grid.gridSize,m=(t.clientX-e.startX)/r,g=(t.clientY-e.startY)/r;for(let[y,T]of e.origins){let S=this.mManager.grid.snapToGrid(T.originX+m,T.originY+g);this.mManager.graph.transformNode(y,{x:Math.round(S.x/a),y:Math.round(S.y/a)})}this.rebuildVisibleNodePositions()}eventPathContainsGraphNode(t){for(let e of t.composedPath())if(e instanceof HTMLElement&&e.tagName.toLowerCase()==="potatno-node")return!0;return!1}getCanvasWrapperOrNull(){try{return this.canvasWrapper}catch{return null}}getLocalPointerPosition(t,e){let r=this.getCanvasWrapperOrNull();if(!r)return{x:0,y:0};let a=r.getBoundingClientRect();return{x:t-a.left,y:e-a.top}}invalidateGraphContent(){this.rebuildGraphData()}invalidateNodeVisuals(){this.rebuildGraphData()}insertNodeAt(t,e){if(!this.mManager.activeFunction)return;let r=this.mManager.grid.gridSize,a=this.mManager.grid.snapToGrid(e.x,e.y),m=this.mManager.graph.addNode(this.mManager.activeFunction,t,{x:Math.round(a.x/r),y:Math.round(a.y/r),height:0,width:0});this.mSelectedNodes.clear(),this.mSelectedNodes.add(m),this.closeAddNodePopup()}insertNodeFromAddPopup(t){let e=this.mAddNodePopup;e&&this.insertNodeAt(t,{x:e.worldX,y:e.worldY})}isTextEditingActive(){let t=document.activeElement;return t instanceof HTMLInputElement||t instanceof HTMLTextAreaElement||t instanceof HTMLSelectElement}openAddNodePopupAtPointer(t,e){let r=this.getCanvasWrapperOrNull(),a=this.getLocalPointerPosition(t,e),m=this.mManager.grid.screenToWorld(a.x,a.y),g=280,y=320,T=Math.max(0,(r?.clientWidth??g)-g-8),S=Math.max(0,(r?.clientHeight??y)-y-8);this.mAddNodePopup={screenX:Math.max(8,Math.min(a.x,T)),screenY:Math.max(8,Math.min(a.y,S)),worldX:m.x,worldY:m.y}}pasteFromClipboard(){if(!this.mManager.activeFunction)return;let e=this.mManager.clipboard.paste();if(e.length!==0){this.mSelectedNodes.clear();for(let r of e)this.mSelectedNodes.add(r)}}rebuildGraphData(){let t=[],e=this.mManager.activeFunction;if(e){let r=this.mManager.grid.gridSize;for(let a of e.nodes){let m=Math.max(a.transformation.height,this.calculateNodeGridHeight(a));t.push({node:a,pixelH:m*r,pixelW:a.transformation.width*r,pixelX:a.transformation.x*r,pixelY:a.transformation.y*r,selected:this.mSelectedNodes.has(a)})}}this.mCachedGraphData={visibleNodes:t}}rebuildVisibleNodePositions(){let t=this.mManager.grid.gridSize;this.mCachedGraphData={visibleNodes:this.mCachedGraphData.visibleNodes.map(e=>({node:e.node,pixelH:Math.max(e.node.transformation.height,this.calculateNodeGridHeight(e.node))*t,pixelW:e.node.transformation.width*t,pixelX:e.node.transformation.x*t,pixelY:e.node.transformation.y*t,selected:e.selected}))}}resetForActiveFunction(){this.mInteractionState={mode:"idle"},this.mSelectedNodes.clear(),this.stopDocumentPointerTracking(),this.closeAddNodePopup()}selectNodesInBox(){let t=this.mManager.activeFunction;if(!t)return;let e=this.mManager.grid.screenToWorld(Math.min(this.mSelectionBoxScreen.x1,this.mSelectionBoxScreen.x2),Math.min(this.mSelectionBoxScreen.y1,this.mSelectionBoxScreen.y2)),r=this.mManager.grid.screenToWorld(Math.max(this.mSelectionBoxScreen.x1,this.mSelectionBoxScreen.x2),Math.max(this.mSelectionBoxScreen.y1,this.mSelectionBoxScreen.y2)),a=this.mManager.grid.gridSize;for(let m of t.nodes){let g=m.transformation.x*a,y=m.transformation.y*a,T=g+m.transformation.width*a,S=y+m.transformation.height*a;g<r.x&&T>e.x&&y<r.y&&S>e.y&&this.mSelectedNodes.add(m)}this.invalidateNodeVisuals()}startDocumentPointerTracking(){this.stopDocumentPointerTracking(),this.mDocumentPointerMoveHandler=t=>this.onDocumentPointerMove(t),this.mDocumentPointerUpHandler=()=>this.onDocumentPointerUp(),document.addEventListener("pointermove",this.mDocumentPointerMoveHandler),document.addEventListener("pointerup",this.mDocumentPointerUpHandler)}stopDocumentPointerTracking(){this.mDocumentPointerMoveHandler&&(document.removeEventListener("pointermove",this.mDocumentPointerMoveHandler),this.mDocumentPointerMoveHandler=null),this.mDocumentPointerUpHandler&&(document.removeEventListener("pointerup",this.mDocumentPointerUpHandler),this.mDocumentPointerUpHandler=null)}static{Sn()}};var Un=`:host {\r
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
    color: var(--potatno-color-accent);\r
    font-family: var(--pn-font-family);\r
    font-size: var(--pn-font-size);\r
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
    border-color: var(--potatno-color-accent);\r
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
    background: var(--potatno-color-error);\r
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
    border-color: var(--potatno-color-accent);\r
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
`;function vs(){function f(c,n){return function(l){e(n,"addInitializer"),r(l,"An initializer"),c.push(l)}}function t(c,n,u,l,o,b,v,D,w){var p;switch(o){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+n:n,static:b,private:v,metadata:D},d={v:!1};s.addInitializer=f(l,d);var i,h;o===0?v?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):o===2?i=function(){return u.value}:((o===1||o===3)&&(i=function(){return u.get.call(this)}),(o===1||o===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return c(w,s)}finally{d.v=!0}}function e(c,n){if(c.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(c,n){if(typeof c!="function")throw new TypeError(n+" must be a function")}function a(c,n){var u=typeof n;if(c===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(u!=="function"){var l;throw c===0?l="field":c===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function m(c,n,u,l,o,b,v,D,w){var p=u[0],s,d,i;v?o===0||o===1?s={get:u[3],set:u[4]}:o===3?s={get:u[3]}:o===4?s={set:u[3]}:s={value:u[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var h,x,C;if(typeof p=="function")h=t(p,l,s,D,o,b,v,w,i),h!==void 0&&(a(o,h),o===0?d=h:o===1?(d=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h);else for(var P=p.length-1;P>=0;P--){var M=p[P];if(h=t(M,l,s,D,o,b,v,w,i),h!==void 0){a(o,h);var N;o===0?N=h:o===1?(N=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(o===0||o===1){if(d===void 0)d=function(I,E){return E};else if(typeof d!="function"){var _=d;d=function(I,E){for(var L=E,R=0;R<_.length;R++)L=_[R].call(I,L);return L}}else{var V=d;d=function(I,E){return V.call(I,E)}}c.push(d)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),v?o===1?(c.push(function(I,E){return i.get.call(I,E)}),c.push(function(I,E){return i.set.call(I,E)})):o===2?c.push(i):c.push(function(I,E){return i.call(I,E)}):Object.defineProperty(n,l,s))}function g(c,n,u){for(var l=[],o,b,v=new Map,D=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,C;if(h?(x=c,s=s-5,b=b||[],C=b):(x=c.prototype,o=o||[],C=o),s!==0&&!i){var P=h?D:v,M=P.get(d)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!M&&s>2?P.set(d,s):P.set(d,!0)}m(l,x,p,d,s,h,i,C,u)}}return y(l,o),y(l,b),l}function y(c,n){n&&c.push(function(u){for(var l=0;l<n.length;l++)n[l].call(u);return u})}function T(c,n,u){if(n.length>0){for(var l=[],o=c,b=c.name,v=n.length-1;v>=0;v--){var D={v:!1};try{var w=n[v](o,{kind:"class",name:b,addInitializer:f(l,D),metadata:u})}finally{D.v=!0}w!==void 0&&(a(10,w),o=w)}return[S(o,u),function(){for(var p=0;p<l.length;p++)l[p].call(o)}]}}function S(c,n){return Object.defineProperty(c,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,l,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),D=g(n,u,v);return l.length||S(n,v),{e:D,get c(){return T(n,l,v)}}}}function Wn(f,t,e,r){return(Wn=vs())(f,t,e,r)}var Zn,Xn,ys;Zn=J({selector:"potatno-panel-properties",template:Hn,style:Un});var Yn=class{static{({c:[ys,Xn]}=Wn(this,[],[Zn]))}constructor(t=O.use($),e=O.use(K)){this.mComponent=t,this.mManager=e,this.mSelectedImportId="",this.mUnsubscribe=null}mComponent;mManager;mSelectedImportId;mUnsubscribe;get availableImports(){return this.mManager.project?.imports.map(t=>({id:t.id,label:t.label}))??[]}get availableTypes(){let t=this.mManager.project;if(!t)return[];let e=new Set;for(let[r]of t.types.types)e.add(r);return[...e].sort()}get functionImportIds(){return[...this.mManager.activeFunction?.imports??[]]}get functionImports(){let t=new Map(this.availableImports.map(e=>[e.id,e]));return this.functionImportIds.map(e=>t.get(e)??{id:e,label:e})}get functionInputs(){return(this.mManager.activeFunction?.inputs??[]).map(t=>({name:t.label,type:t.dataType}))}get functionName(){return this.mManager.activeFunction?.label??""}get functionOutputs(){return(this.mManager.activeFunction?.outputs??[]).map(t=>({name:t.label,type:t.dataType}))}get isSystem(){return this.mManager.activeFunction?.isSystem??!1}get nameDisabled(){return this.isSystem}get importsDisabled(){return this.hasStaticFlag(ot.imports)}get inputsDisabled(){return this.hasStaticFlag(ot.inputs)}get outputsDisabled(){return this.hasStaticFlag(ot.outputs)}get unusedImports(){let t=new Set(this.functionImportIds);return this.availableImports.filter(e=>!t.has(e.id))}onConnect(){this.mUnsubscribe=this.mManager.subscribe(F.Document|F.Function|F.SpecialActiveFunction,null,()=>{this.mComponent.updater.updateAsync()})}onDeconstruct(){this.mUnsubscribe?.(),this.mUnsubscribe=null}onAddSelectedImport(){let t=this.unusedImports,e=this.mSelectedImportId||(t.length>0?t[0].id:"");e&&(this.mManager.updateFunctionProperties({imports:[...this.functionImportIds,e]}),this.mSelectedImportId="")}onAddInput(){let t=this.availableTypes.length>0?this.availableTypes[0]:"number";this.mManager.updateFunctionProperties({inputs:[...this.functionInputs,{name:this.uniquePortName("new_input"),type:t}]})}onAddOutput(){let t=this.availableTypes.length>0?this.availableTypes[0]:"number";this.mManager.updateFunctionProperties({outputs:[...this.functionOutputs,{name:this.uniquePortName("new_output"),type:t}]})}onDeleteImport(t){let e=[...this.functionImportIds];e.splice(t,1),this.mManager.updateFunctionProperties({imports:e})}onDeleteInput(t){let e=[...this.functionInputs];e.splice(t,1),this.mManager.updateFunctionProperties({inputs:e})}onDeleteOutput(t){let e=[...this.functionOutputs];e.splice(t,1),this.mManager.updateFunctionProperties({outputs:e})}onImportSelectChange(t){this.mSelectedImportId=t.target.value}onInputNameChange(t,e){let r=e.target,a=r.value,m=!this.validateName(a)||this.isNameDuplicate(a,"input",t);r.style.borderColor=m?"var(--potatno-color-error)":"";let g=[...this.functionInputs];g[t]={...g[t],name:a},this.mManager.updateFunctionProperties({inputs:g})}onInputTypeChange(t,e){let r=e.target.value,a=[...this.functionInputs];a[t]={...a[t],type:r},this.mManager.updateFunctionProperties({inputs:a})}onNameChange(t){let e=t.target,r=e.value,a=!this.validateName(r)||this.isNameDuplicate(r,"function");e.style.borderColor=a?"var(--potatno-color-error)":"",this.mManager.updateFunctionProperties({name:r})}onOutputNameChange(t,e){let r=e.target,a=r.value,m=!this.validateName(a)||this.isNameDuplicate(a,"output",t);r.style.borderColor=m?"var(--potatno-color-error)":"";let g=[...this.functionOutputs];g[t]={...g[t],name:a},this.mManager.updateFunctionProperties({outputs:g})}onOutputTypeChange(t,e){let r=e.target.value,a=[...this.functionOutputs];a[t]={...a[t],type:r},this.mManager.updateFunctionProperties({outputs:a})}isNameDuplicate(t,e,r){if(e!=="function"&&t===this.functionName)return!0;let a=this.functionInputs;for(let g=0;g<a.length;g++)if(!(e==="input"&&g===r)&&a[g].name===t)return!0;let m=this.functionOutputs;for(let g=0;g<m.length;g++)if(!(e==="output"&&g===r)&&m[g].name===t)return!0;return!1}hasStaticFlag(t){let e=this.mManager.activeFunction;if(!e)return!0;let r=e.project.getFunction(e.definitionId);return r?(r.statics&t)!==0:!0}uniquePortName(t){if(!this.isNameDuplicate(t,"function"))return t;let e=2;for(;this.isNameDuplicate(`${t}_${e}`,"function");)e++;return`${t}_${e}`}validateName(t){return/^[a-zA-Z][a-zA-Z0-9_]*$/.test(t)}static{Xn()}};var et=class{static MAIN="MAIN";mBuild;mDefaultParameters;mFunction;mTypes;get defaultParameters(){return this.mDefaultParameters}get function(){return this.mFunction}get types(){return this.mTypes}constructor(t,e){this.mFunction=t,this.mDefaultParameters=e.defaultParameters,this.mTypes=new Set(e.types),this.mBuild=e.build}compile(t,e){return this.mBuild({defaultParameters:this.mDefaultParameters,function:this.mFunction,projectTypes:t.entryPoint.function.project.types},t,e)}};var qn=`:host {\r
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
    cursor: pointer;\r
    white-space: nowrap;\r
}\r
\r
.preview-tab:hover {\r
    color: var(--pn-text-primary);\r
    border-color: var(--potatno-color-accent);\r
}\r
\r
.preview-tab.selected {\r
    color: var(--pn-text-primary);\r
    background: var(--potatno-color-accent);\r
    border-color: var(--potatno-color-accent);\r
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
    border-color: var(--potatno-color-accent);\r
}\r
\r
.error-title {\r
    color: var(--potatno-color-error) !important;\r
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
    background: var(--potatno-color-error);\r
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
`;var Jn=`<div class="resize-handle" (pointerdown)="this.onResizePointerDown($event)"></div>
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
`;function xs(){function f(c,n){return function(l){e(n,"addInitializer"),r(l,"An initializer"),c.push(l)}}function t(c,n,u,l,o,b,v,D,w){var p;switch(o){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+n:n,static:b,private:v,metadata:D},d={v:!1};s.addInitializer=f(l,d);var i,h;o===0?v?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):o===2?i=function(){return u.value}:((o===1||o===3)&&(i=function(){return u.get.call(this)}),(o===1||o===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return c(w,s)}finally{d.v=!0}}function e(c,n){if(c.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(c,n){if(typeof c!="function")throw new TypeError(n+" must be a function")}function a(c,n){var u=typeof n;if(c===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(u!=="function"){var l;throw c===0?l="field":c===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function m(c,n,u,l,o,b,v,D,w){var p=u[0],s,d,i;v?o===0||o===1?s={get:u[3],set:u[4]}:o===3?s={get:u[3]}:o===4?s={set:u[3]}:s={value:u[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var h,x,C;if(typeof p=="function")h=t(p,l,s,D,o,b,v,w,i),h!==void 0&&(a(o,h),o===0?d=h:o===1?(d=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h);else for(var P=p.length-1;P>=0;P--){var M=p[P];if(h=t(M,l,s,D,o,b,v,w,i),h!==void 0){a(o,h);var N;o===0?N=h:o===1?(N=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(o===0||o===1){if(d===void 0)d=function(I,E){return E};else if(typeof d!="function"){var _=d;d=function(I,E){for(var L=E,R=0;R<_.length;R++)L=_[R].call(I,L);return L}}else{var V=d;d=function(I,E){return V.call(I,E)}}c.push(d)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),v?o===1?(c.push(function(I,E){return i.get.call(I,E)}),c.push(function(I,E){return i.set.call(I,E)})):o===2?c.push(i):c.push(function(I,E){return i.call(I,E)}):Object.defineProperty(n,l,s))}function g(c,n,u){for(var l=[],o,b,v=new Map,D=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,C;if(h?(x=c,s=s-5,b=b||[],C=b):(x=c.prototype,o=o||[],C=o),s!==0&&!i){var P=h?D:v,M=P.get(d)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!M&&s>2?P.set(d,s):P.set(d,!0)}m(l,x,p,d,s,h,i,C,u)}}return y(l,o),y(l,b),l}function y(c,n){n&&c.push(function(u){for(var l=0;l<n.length;l++)n[l].call(u);return u})}function T(c,n,u){if(n.length>0){for(var l=[],o=c,b=c.name,v=n.length-1;v>=0;v--){var D={v:!1};try{var w=n[v](o,{kind:"class",name:b,addInitializer:f(l,D),metadata:u})}finally{D.v=!0}w!==void 0&&(a(10,w),o=w)}return[S(o,u),function(){for(var p=0;p<l.length;p++)l[p].call(o)}]}}function S(c,n){return Object.defineProperty(c,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,l,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),D=g(n,u,v);return l.length||S(n,v),{e:D,get c(){return T(n,l,v)}}}}function ei(f,t,e,r){return(ei=xs())(f,t,e,r)}var ri,Kn,oi,Qn,kn,Ts;ri=J({selector:"potatno-preview",template:Jn,style:qn,modules:[xe]}),oi=at("PreviewContainer");var ti=class{static{({e:[Qn,kn],c:[Ts,Kn]}=ei(this,[[oi,1,"containerElement"]],[ri]))}constructor(t=O.use($),e=O.use(K)){this.mComponent=t,this.mDragging=!1,this.mManager=e,this.mSelectedDisplayId="",this.mSelectedOutputId="",this.mStartHeight=0,this.mStartWidth=0,this.mStartX=0,this.mStartY=0,this.mTrackedFunction=null,this.mUnsubscribe=null}mComponent;mDragging;mManager;mStartHeight;mStartWidth;mStartX;mStartY;mTrackedFunction;mUnsubscribe;mSelectedDisplayId;mSelectedOutputId;#t=(kn(this),Qn(this));get containerElement(){return this.#t}set containerElement(t){this.#t=t}get displayOptions(){let t=this.mManager.activeFunction,e=this.mManager.project,r=t&&e?e.getFunction(t.definitionId):void 0;return!t||!e||!r?new Array:this.createDisplayOptions(e,this.availableDisplayIds(e,r,t,this.selectedOutputId))}get errors(){return this.mManager.integrity.errors}get hasErrors(){return!this.mManager.integrity.isValid}get outputOptions(){let t=this.mManager.activeFunction,e=this.mManager.project,r=t&&e?e.getFunction(t.definitionId):void 0;if(!t||!e||!r)return[];let a=new Array;e.preview.availableDisplays(r,et.MAIN).length>0&&a.push({id:et.MAIN,label:"Main"});let m=new Set;for(let g of t.getExitNodes())for(let y of g.inputs.value)m.has(y.definitionId)||e.preview.availableDisplays(r,y.resolvedDataType).length!==0&&(m.add(y.definitionId),a.push({id:y.definitionId,label:y.label}));return a}get previewDriver(){let t=this.mManager.activeFunction;if(!t)return null;if(this.selectedOutputId===et.MAIN)return this.mManager.preview.requestDriver(t,this.selectedDisplayId);let e=this.findFunctionOutputPort(t,this.selectedOutputId);return e?this.mManager.preview.requestDriver(e,this.selectedDisplayId):null}get selectedDisplayId(){let t=this.displayOptions;return this.mSelectedDisplayId!==""&&t.some(e=>e.id===this.mSelectedDisplayId)?this.mSelectedDisplayId:t.at(0)?.id??""}get selectedOutputId(){let t=this.outputOptions;return this.mSelectedOutputId!==""&&t.some(e=>e.id===this.mSelectedOutputId)?this.mSelectedOutputId:t[0]?.id??""}get showOutputSelector(){let t=this.mManager.activeFunction,e=this.mManager.project;return!t||!e?!1:this.outputOptions.length>0}onConnect(){this.mUnsubscribe=this.mManager.subscribe(F.Document|F.Function|F.SpecialActiveFunction|F.Node|F.Connection,null,()=>{this.mComponent.updater.updateAsync()})}onDeconstruct(){this.mUnsubscribe?.(),this.mUnsubscribe=null}onDisplaySelect(t){this.mSelectedDisplayId=t.target.value,this.mComponent.updater.updateAsync()}onOutputSelect(t){this.mSelectedOutputId=t.target.value,this.mComponent.updater.updateAsync()}onResizePointerDown(t){t.preventDefault(),t.stopPropagation(),this.mDragging=!0,this.mStartX=t.clientX,this.mStartY=t.clientY;let e=this.containerElement;if(!e)return;this.mStartWidth=e.offsetWidth,this.mStartHeight=e.offsetHeight,t.target.setPointerCapture(t.pointerId);let r=m=>{if(!this.mDragging)return;let g=this.mStartX-m.clientX,y=this.mStartY-m.clientY;e.style.width=Math.max(200,this.mStartWidth+g)+"px",e.style.height=Math.max(150,this.mStartHeight+y)+"px"},a=m=>{this.mDragging=!1,m.target.releasePointerCapture(m.pointerId),document.removeEventListener("pointermove",r),document.removeEventListener("pointerup",a)};document.addEventListener("pointermove",r),document.addEventListener("pointerup",a)}availableDisplayIds(t,e,r,a){if(a===et.MAIN)return t.preview.availableDisplays(e,et.MAIN);let m=this.findFunctionOutputPort(r,a);return m?t.preview.availableDisplays(e,m.resolvedDataType):t.preview.availableDisplays(e)}createDisplayOptions(t,e){return e.map(r=>({id:r,label:t.preview.getDisplay(r)?.name??r}))}findFunctionOutputPort(t,e){for(let r of t.getExitNodes()){let a=r.inputs.map.get(e);if(a&&a.portType==="value")return a}return null}static{Kn()}};function Ds(){function f(c,n){return function(l){e(n,"addInitializer"),r(l,"An initializer"),c.push(l)}}function t(c,n,u,l,o,b,v,D,w){var p;switch(o){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+n:n,static:b,private:v,metadata:D},d={v:!1};s.addInitializer=f(l,d);var i,h;o===0?v?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):o===2?i=function(){return u.value}:((o===1||o===3)&&(i=function(){return u.get.call(this)}),(o===1||o===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return c(w,s)}finally{d.v=!0}}function e(c,n){if(c.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(c,n){if(typeof c!="function")throw new TypeError(n+" must be a function")}function a(c,n){var u=typeof n;if(c===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(u!=="function"){var l;throw c===0?l="field":c===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function m(c,n,u,l,o,b,v,D,w){var p=u[0],s,d,i;v?o===0||o===1?s={get:u[3],set:u[4]}:o===3?s={get:u[3]}:o===4?s={set:u[3]}:s={value:u[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var h,x,C;if(typeof p=="function")h=t(p,l,s,D,o,b,v,w,i),h!==void 0&&(a(o,h),o===0?d=h:o===1?(d=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h);else for(var P=p.length-1;P>=0;P--){var M=p[P];if(h=t(M,l,s,D,o,b,v,w,i),h!==void 0){a(o,h);var N;o===0?N=h:o===1?(N=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(o===0||o===1){if(d===void 0)d=function(I,E){return E};else if(typeof d!="function"){var _=d;d=function(I,E){for(var L=E,R=0;R<_.length;R++)L=_[R].call(I,L);return L}}else{var V=d;d=function(I,E){return V.call(I,E)}}c.push(d)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),v?o===1?(c.push(function(I,E){return i.get.call(I,E)}),c.push(function(I,E){return i.set.call(I,E)})):o===2?c.push(i):c.push(function(I,E){return i.call(I,E)}):Object.defineProperty(n,l,s))}function g(c,n,u){for(var l=[],o,b,v=new Map,D=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,C;if(h?(x=c,s=s-5,b=b||[],C=b):(x=c.prototype,o=o||[],C=o),s!==0&&!i){var P=h?D:v,M=P.get(d)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!M&&s>2?P.set(d,s):P.set(d,!0)}m(l,x,p,d,s,h,i,C,u)}}return y(l,o),y(l,b),l}function y(c,n){n&&c.push(function(u){for(var l=0;l<n.length;l++)n[l].call(u);return u})}function T(c,n,u){if(n.length>0){for(var l=[],o=c,b=c.name,v=n.length-1;v>=0;v--){var D={v:!1};try{var w=n[v](o,{kind:"class",name:b,addInitializer:f(l,D),metadata:u})}finally{D.v=!0}w!==void 0&&(a(10,w),o=w)}return[S(o,u),function(){for(var p=0;p<l.length;p++)l[p].call(o)}]}}function S(c,n){return Object.defineProperty(c,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,l,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),D=g(n,u,v);return l.length||S(n,v),{e:D,get c(){return T(n,l,v)}}}}function ci(f,t,e,r){return(ci=Ds())(f,t,e,r)}var ui,ni,hi,di,ii,si,ai,mr;ui=J({selector:"potatno-code-editor",template:go,style:po}),hi=at("panelLeft"),di=at("panelRight");var li=class{static{({e:[ii,si,ai],c:[mr,ni]}=ci(this,[[hi,1,"panelLeft"],[di,1,"panelRight"],[wt,4,"project"],[wt,4,"document"],[wt,2,"triggerPreviewUpdate"]],[ui]))}constructor(t=O.use($),e=O.use(K)){this.mComponent=t,this.mManager=e,this.mProject=null,this.mResizeMoveHandler=null,this.mResizeState=null,this.mResizeUpHandler=null,this.mUnsubscribe=null}mComponent;mManager;mProject;mResizeMoveHandler;mResizeState;mResizeUpHandler;mUnsubscribe;#t=(ai(this),ii(this));get panelLeft(){return this.#t}set panelLeft(t){this.#t=t}#e=si(this);get panelRight(){return this.#e}set panelRight(t){this.#e=t}get hasPreview(){let t=this.mManager.project,e=this.mManager.activeFunction;if(!t||!e)return!1;let r=t.getFunction(e.definitionId);return r?t.preview.availableDisplays(r).length>0:!1}get document(){return this.mManager.graph.document}set project(t){this.mProject=t}set document(t){this.mProject&&this.mManager.initialize(this.mProject,t)}async triggerPreviewUpdate(){return this.mManager.preview.execute()}onConnect(){this.mUnsubscribe=this.mManager.subscribe(F.Document|F.Function|F.SpecialActiveFunction,null,()=>{this.mComponent.updater.updateAsync()})}onDeconstruct(){this.mUnsubscribe?.(),this.mUnsubscribe=null,this.stopPanelResize()}onResizeLeftStart(t){t.preventDefault(),this.startPanelResize("left",t)}onResizeRightStart(t){t.preventDefault(),this.startPanelResize("right",t)}startPanelResize(t,e){this.stopPanelResize();let r=t==="left"?this.panelLeft:this.panelRight;this.mResizeState={panel:t,startWidth:r.offsetWidth,startX:e.clientX};let a=g=>{if(!this.mResizeState)return;let y=t==="left"?g.clientX-this.mResizeState.startX:this.mResizeState.startX-g.clientX;r.style.width=`${Math.max(200,Math.min(500,this.mResizeState.startWidth+y))}px`},m=()=>{document.removeEventListener("pointermove",a),document.removeEventListener("pointerup",m),this.mResizeMoveHandler=null,this.mResizeState=null,this.mResizeUpHandler=null};this.mResizeMoveHandler=a,this.mResizeUpHandler=m,document.addEventListener("pointermove",a),document.addEventListener("pointerup",m)}stopPanelResize(){this.mResizeMoveHandler&&(document.removeEventListener("pointermove",this.mResizeMoveHandler),this.mResizeMoveHandler=null),this.mResizeUpHandler&&(document.removeEventListener("pointerup",this.mResizeUpHandler),this.mResizeUpHandler=null),this.mResizeState=null}static{ni()}};var Xe=class extends ae{mCodeEditor;mProject;get document(){return this.mCodeEditor.document}set document(t){this.mCodeEditor.document=t}get project(){return this.mProject}constructor(t){super(),this.mProject=t,this.addStyle(lo),this.addStyle(ao),this.mCodeEditor=this.addContent(mr),this.mCodeEditor.project=t,this.mCodeEditor.document=new Mt(t)}load(t){let e=JSON.parse(t);if(!Array.isArray(e.functions))throw new A("Could not load document. Document has a wrong format.",this);let r=new Jt(this.mProject).deserialize(e);this.document=r}save(){let t=new Kt().serialize(this.document);return JSON.stringify(t)}async update(){return this.mCodeEditor.triggerPreviewUpdate()}};var z=class extends ht{constructor(t){super({id:t.id,label:t.label,category:t.category,regions:t.regions??null,generators:{ports:{inputs:e=>{for(let r of t.ports.inputs)e(r)},outputs:e=>{for(let r of t.ports.outputs)e(r)}},code:t.generators.code}})}};var Ye=class{mDisplays;get displayIds(){return[...this.mDisplays.keys()]}constructor(){this.mDisplays=new Map}addDisplay(t){this.mDisplays.set(t.id,t)}availableDisplays(t,e=null){let r=new Array;for(let[a,m]of this.mDisplays)m.executor.function.id===t.id&&(e===null||m.allowsType(e))&&r.push(a);return r}getDisplay(t){return this.mDisplays.get(t)??null}};var te=class f extends ht{static DEFINITION_ID="23e9319b-3b62-4dd8-858a-17d97ddee94e";constructor(){super({id:f.DEFINITION_ID,label:"Flow Conjunction",category:{name:"Conjunction",icon:"\u25C7"},generators:{ports:{inputs:t=>{t({label:"in",id:"in",portType:"flow"})},outputs:t=>{t({label:"out",id:"out",portType:"flow"})}},code:()=>{throw new A("Conjunction node code generators should never be called.",f)}}})}};var ee=class f extends ht{static DEFINITION_ID="a579584d-5d35-42b5-b2ba-3daddee488e0";constructor(){super({id:f.DEFINITION_ID,label:"Value Conjunction",category:{name:"Conjunction",icon:"\u25C7"},generators:{ports:{inputs:t=>{t({label:"in",id:"in",portType:"value",dataType:"<T>"})},outputs:t=>{t({label:"out",id:"out",portType:"value",dataType:"<T>"})}},code:()=>{throw new A("Conjunction node code generators should never be called.",f)}}})}};var We=class{mCodeGenerator;mEntryPoint;mImports;mNodeDefinitions;mPreview;mTypes;mUserFunctions;get entryPoint(){return this.mEntryPoint}get generator(){return this.mCodeGenerator}get imports(){return this.mImports}get nodeDefinitions(){return Array.from(this.mNodeDefinitions.values())}get preview(){return this.mPreview}get types(){return this.mTypes}get userFunctions(){return this.mUserFunctions}constructor(t,e,r){this.mTypes=t,this.mCodeGenerator=r.generator,this.mPreview=new Ye,this.mNodeDefinitions=new Map,this.mImports=new Array,this.mUserFunctions=new Map,this.mEntryPoint=e,this.addNodeDefinition(new te),this.addNodeDefinition(new ee)}addImport(t){this.mImports.push(t)}addNodeDefinition(t){this.mNodeDefinitions.set(t.id,t)}getFunction(t){return this.mEntryPoint.id===t?this.mEntryPoint:this.mUserFunctions.get(t)}setDynamicFunction(t){this.mUserFunctions.set(t.id,t)}};var Ze=class{mTypes;get typeNames(){return Array.from(this.mTypes.keys())}get types(){return this.mTypes}constructor(t){this.mTypes=new Map;for(let[e,r]of Object.entries(t))this.mTypes.set(e,{name:e,...r})}getDefaultValue(t){return this.getType(t).default.value}getType(t){if(!this.mTypes.has(t))throw new Error(`Type "${t}" is not defined in the project types definition.`);return this.mTypes.get(t)}isGenericType(t){return typeof t!="string"?!1:/^<[^>]+>$/.test(t)}};var qe=class extends Ze{constructor(){super({number:{default:{string:["0"],value:0},convert:t=>{let e=t[0],r=parseFloat(e);if(isNaN(r))throw new Error(`Invalid number: "${e}"`);return r.toString()},inputs:[{name:"value",type:"number"}]},string:{default:{string:[""],value:""},convert:t=>t[0],inputs:[{name:"value",type:"string"}]},boolean:{default:{string:["false"],value:!1},convert:t=>{let e=t[0].toLowerCase();if(e==="true")return"true";if(e==="false")return"false";throw new Error(`Invalid boolean: "${t[0]}"`)},inputs:[{name:"value",type:"boolean"}]}})}};var Je=class extends Qt{constructor(){super({id:"pixelShader",label:"Pixel Shader",statics:ot.inputs|ot.outputs,nodes:{entry:t=>{t(new z({id:"OnPixel",label:"OnPixel",category:{name:"event"},ports:{inputs:[],outputs:[{label:"exec",id:"exec",portType:"flow"},{label:"x",id:"x",portType:"value",dataType:"number"},{label:"y",id:"y",portType:"value",dataType:"number"}]},generators:{code:e=>{let r=e.outputs.x.value,a=e.outputs.y.value;return`(${r}, ${a}) => { ${e.outputs.exec.code.inner} }`}}}))},exit:t=>{t(new z({id:"PixelResult",label:"PixelResult",category:{name:"Output"},ports:{inputs:[{label:"exec",id:"exec",portType:"flow"},{label:"red",id:"red",portType:"value",dataType:"number"},{label:"green",id:"green",portType:"value",dataType:"number"},{label:"blue",id:"blue",portType:"value",dataType:"number"}],outputs:[]},generators:{code:e=>`return [${e.inputs.red.value}, ${e.inputs.green.value}, ${e.inputs.blue.value}];`}}))}},generator:{code:{body:t=>{let e=t.graphResultOf("OnPixel");return`const ${t.function.definitionId} = ${e?.code??"() => [0, 0, 0]"};`},value:t=>`${t.function.definitionId}()`}}})}};var Ke=class extends Qt{constructor(){super({id:"Helper Function",label:"Helper Function",statics:ot.none,nodes:{entry:(t,e)=>{t(new ht({id:"HelperFunctionEntry",label:"Entry",category:{name:"event"},generators:{ports:{outputs:r=>{r({label:"exec",id:"exec",portType:"flow"});for(let a of e.inputs)r({label:a.label,id:a.label,portType:"value",dataType:a.dataType})},inputs:()=>{}},code:r=>`(${Object.entries(r.outputs).filter(([m])=>m!=="exec").map(([,m])=>m.value).join(", ")}) => { ${r.outputs.exec.code.inner} }`}}))},exit:(t,e)=>{t(new ht({id:"HelperFunctionReturn",label:"Return",category:{name:"event"},generators:{ports:{outputs:()=>{},inputs:r=>{r({label:"exec",id:"exec",portType:"flow"});for(let a of e.outputs)r({label:a.label,id:a.label,portType:"value",dataType:a.dataType})}},code:r=>`return { ${Object.entries(r.inputs).map(([m,g])=>`${m}: (${g.value})`).join(", ")} };`}}))}},generator:{code:{body:t=>{let e=`__fn_${t.function.id.replaceAll("-","_")}`,r=t.graphResultOf("HelperFunctionEntry");return`const ${e} = ${r?.code??"() => ({})"};`},value:t=>{let e=`__fn_${t.function.id.replaceAll("-","_")}`,r=Object.entries(t.inputs).map(([,g])=>g.value).join(", "),a=Object.entries(t.outputs).filter(([g])=>g!=="Output").map(([g,y])=>`${g}: ${y.value}`).join(", "),m=t.outputs.Output?.code.inner??"";return a===""?`${e}(${r}); ${m}`:`const { ${a} } = ${e}(${r}); ${m}`}}}})}};var Qe=class extends We{mUserFunction;get userFunction(){return this.mUserFunction}constructor(){let t=new qe,e=new Je,r=new Ke;super(t,e,{generator:{code:a=>{let m="";for(let g of a.dependencies)m+=`${g.code}
`;return m+=a.entryPoint.code,m},values:{valueId:a=>`v_${a}`,hook:a=>`/*[${a}]*/`}}}),this.mUserFunction=r,this.setDynamicFunction(r),this.addBaseNodeDefinitions()}addBaseNodeDefinitions(){this.addNodeDefinition(new z({id:"Add",label:"Add",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} + ${t.inputs.b.value};`}})),this.addNodeDefinition(new z({id:"Subtract",label:"Subtract",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} - ${t.inputs.b.value};`}})),this.addNodeDefinition(new z({id:"Multiply",label:"Multiply",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} * ${t.inputs.b.value};/*MULTIPLYHOOK_${t.outputs.result.value}*/`}})),this.addNodeDefinition(new z({id:"Divide",label:"Divide",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} / ${t.inputs.b.value};`}})),this.addNodeDefinition(new z({id:"Modulo",label:"Modulo",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} % ${t.inputs.b.value};`}})),this.addNodeDefinition(new z({id:"Equal",label:"Equal",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"boolean"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} === ${t.inputs.b.value};`}})),this.addNodeDefinition(new z({id:"Not Equal",label:"Not Equal",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"boolean"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} !== ${t.inputs.b.value};`}})),this.addNodeDefinition(new z({id:"Less Than",label:"Less Than",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"boolean"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} < ${t.inputs.b.value};`}})),this.addNodeDefinition(new z({id:"Greater Than",label:"Greater Than",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"boolean"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} > ${t.inputs.b.value};`}})),this.addNodeDefinition(new z({id:"And",label:"And",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"boolean"},{label:"b",id:"b",portType:"value",dataType:"boolean"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"boolean"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} && ${t.inputs.b.value};`}})),this.addNodeDefinition(new z({id:"Or",label:"Or",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"boolean"},{label:"b",id:"b",portType:"value",dataType:"boolean"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"boolean"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} || ${t.inputs.b.value};`}})),this.addNodeDefinition(new z({id:"Not",label:"Not",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"boolean"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"boolean"}]},generators:{code:t=>`const ${t.outputs.result.value} = !${t.inputs.a.value};`}})),this.addNodeDefinition(new z({id:"Number to String",label:"Number to String",category:{name:"type-conversion"},ports:{inputs:[{label:"input",id:"input",portType:"value",dataType:"number"}],outputs:[{label:"output",id:"output",portType:"value",dataType:"string"}]},generators:{code:t=>`const ${t.outputs.output.value} = String(${t.inputs.input.value});`}})),this.addNodeDefinition(new z({id:"String to Number",label:"String to Number",category:{name:"type-conversion"},ports:{inputs:[{label:"input",id:"input",portType:"value",dataType:"string"}],outputs:[{label:"output",id:"output",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.output.value} = Number(${t.inputs.input.value});`}})),this.addNodeDefinition(new z({id:"Boolean to String",label:"Boolean to String",category:{name:"type-conversion"},ports:{inputs:[{label:"input",id:"input",portType:"value",dataType:"boolean"}],outputs:[{label:"output",id:"output",portType:"value",dataType:"string"}]},generators:{code:t=>`const ${t.outputs.output.value} = String(${t.inputs.input.value});`}})),this.addNodeDefinition(new z({id:"If",label:"If",category:{name:"flow"},ports:{inputs:[{label:"exec",id:"exec",portType:"flow"},{label:"condition",id:"condition",portType:"value",dataType:"boolean"}],outputs:[{label:"then",id:"then",portType:"flow"},{label:"else",id:"else",portType:"flow"}]},generators:{code:t=>`if (${t.inputs.condition.value}) {
${t.outputs.then.code.inner}
} else {
${t.outputs.else.code.inner}
}`}})),this.addNodeDefinition(new z({id:"While",label:"While",category:{name:"flow"},ports:{inputs:[{label:"exec",id:"exec",portType:"flow"},{label:"condition",id:"condition",portType:"value",dataType:"boolean"}],outputs:[{label:"body",id:"body",portType:"flow"}]},generators:{code:t=>`while (${t.inputs.condition.value}) {
${t.outputs.body.code.inner}
}`}})),this.addNodeDefinition(new z({id:"For Loop",label:"For Loop",category:{name:"flow"},ports:{inputs:[{label:"exec",id:"exec",portType:"flow"},{label:"count",id:"count",portType:"value",dataType:"number"}],outputs:[{label:"exec",id:"exec",portType:"flow"},{label:"index",id:"index",portType:"value",dataType:"number"}]},generators:{code:t=>`for (let ${t.outputs.index.value} = 0; ${t.outputs.index.value} < ${t.inputs.count.value}; ${t.outputs.index.value}++) {
${t.outputs.exec.code.inner}
}`}})),this.addNodeDefinition(new z({id:"Console Log",label:"Console Log",category:{name:"Function"},ports:{inputs:[{label:"message",id:"message",portType:"value",dataType:"string"}],outputs:[]},generators:{code:t=>`console.log(${t.inputs.message.value});`}})),this.addNodeDefinition(new z({id:"String Concat",label:"String Concat",category:{name:"Function"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"string"},{label:"b",id:"b",portType:"value",dataType:"string"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"string"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} + ${t.inputs.b.value};`}}))}};var re=class{mId;mLabel;mNodes;get id(){return this.mId}get label(){return this.mLabel}get nodes(){return this.mNodes}constructor(t,e){this.mId=t,this.mLabel=e,this.mNodes=new Array}addNode(t){this.mNodes.push(t)}};var ke=class extends re{constructor(){super("Math","Math"),this.addNode(new z({id:"Math.PI",label:"Math.PI",category:{name:"value"},ports:{inputs:[],outputs:[{label:"value",id:"value",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.value.value} = Math.PI;`}})),this.addNode(new z({id:"Math.E",label:"Math.E",category:{name:"value"},ports:{inputs:[],outputs:[{label:"value",id:"value",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.value.value} = Math.E;`}})),this.addNode(new z({id:"Math.abs",label:"Math.abs",category:{name:"Function"},ports:{inputs:[{label:"value",id:"value",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = Math.abs(${t.inputs.value.value});`}})),this.addNode(new z({id:"Math.floor",label:"Math.floor",category:{name:"Function"},ports:{inputs:[{label:"value",id:"value",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = Math.floor(${t.inputs.value.value});`}})),this.addNode(new z({id:"Math.random",label:"Math.random",category:{name:"Function"},ports:{inputs:[],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = Math.random();`}})),this.addNode(new z({id:"Math.sin",label:"Math.sin",category:{name:"Function"},ports:{inputs:[{label:"value",id:"value",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = Math.sin(${t.inputs.value.value});`}})),this.addNode(new z({id:"Math.cos",label:"Math.cos",category:{name:"Function"},ports:{inputs:[{label:"value",id:"value",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = Math.cos(${t.inputs.value.value});`}}))}};var tr=class extends re{constructor(){super("Time","Time"),this.addNode(new z({id:"CurrentTime",label:"CurrentTime",category:{name:"value"},ports:{inputs:[],outputs:[{label:"seconds",id:"seconds",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.seconds.value} = (performance.now() / 1000);`}}))}};var er=class{mDependencies;mDocument;mEntryPoint;get code(){return this.mDocument.project.generator.code(this)}get dependencies(){return this.mDependencies}get entryPoint(){return this.mEntryPoint}constructor(t,e,r){this.mDocument=t,this.mEntryPoint=e,this.mDependencies=r}};var rr=class{mFunction;mGraphs;get code(){let t=this.mFunction.project.getFunction(this.mFunction.definitionId);if(!t)throw new A("Function result has an invalid function definition id.",this);return t.codeGenerator.body(this)}get function(){return this.mFunction}get graphs(){return Array.from(this.mGraphs.values())}constructor(t){this.mFunction=t,this.mGraphs=new Map}addGraph(t){this.mGraphs.set(t.entryNode.definitionId,t)}graphResultOf(t){return this.mGraphs.get(t)}};var or=class{mBodyCode;mDependencies;mEntryNode;mExitNode;mNodeIds;mPorts;get code(){return this.mBodyCode}get dependencies(){return this.mDependencies}get entryNode(){return this.mEntryNode}get exitNode(){return this.mExitNode}get nodes(){return this.mNodeIds}get ports(){return this.mPorts}constructor(t){this.mBodyCode=t.bodyCode,this.mDependencies=[...t.dependencies],this.mEntryNode=t.entryNode,this.mExitNode=t.exitNode,this.mNodeIds=t.nodeIds,this.mPorts=t.portValues}};var nr=class{mProject;constructor(t){this.mProject=t}generateDocument(t,e=!1){let r=[...t.functions].find(a=>a.isSystem);if(!r)throw new A("No entry point function found for code generation.",this);return this.generateFunction(r,e)}generateFunction(t,e=!1){return this.buildDocumentResult(t.document,t.getExitNodes(),e)}generateNode(t,e=!1){return this.buildDocumentResult(t.document,[t],e)}buildDocumentResult(t,e,r){if(t.validate().errors.length>0)throw new A("Code generation exited. Code graph validation failed.",this);let m={counter:{nodeIndex:0,portIndex:0},debug:r,nodeDefinitions:new Map},g=this.generateFunctionWithDependencies(m,e,new Set),y=g.shift();return new er(t,y,g)}countNodeEncounter(t,e){let r=new Map,a=new Set,m=new Array(t);for(;m.length>0;){let g=m.pop();if(r.set(g,(r.get(g)??0)+1),!(g===e||a.has(g))){a.add(g);for(let y of g.inputs.flow)for(let T of this.resolveFlowConjunctions(y))m.push(T.node);for(let y of g.inputs.value){let T=this.resolveValueConjunctions(y);T&&m.push(T.node)}}}return r}createScope(t,e){return{emittedNodes:new Set,remaining:this.countNodeEncounter(t,e)}}emitNode(t,e,r,a,m){if(!t.nodeDefinitions.get(r.function)){let l=new Map;for(let o of r.function.nodeDefinitions)l.set(o.id,o);t.nodeDefinitions.set(r.function,l)}let g=t.nodeDefinitions.get(r.function).get(r.definitionId);if(!g)throw new A(`Node definition "${r.definitionId}" not found for node "${r.label}".`,this);g instanceof Vt&&e.dependencies.push(g.function);let y={},T=new Array;for(let l of r.inputs.value){let o=this.resolveInputValue(t,e,l);y[l.definitionId]=o.inputPort,e.ports.set(l,o.inputPort.value),o.emitResult&&T.push(o.emitResult)}let S={};for(let l of r.outputs.list)S[l.definitionId]={value:this.generatePortValue(t,e,l),code:{inner:a[l.definitionId]??""}};let c=g.codeGenerator({inputs:y,outputs:S,code:{next:m??""}}),n=this.getGeneratedNodeId(t,e,r);t.debug&&(c=this.mProject.generator.values.hook(`start-${n}`)+c+this.mProject.generator.values.hook(`end-${n}`));let u=new Array;for(let l of T)u.push(...l.codeOutput);return u.push(c),{codeOutput:u,lastGeneratedNode:r,endFlowPort:null}}findBranchStartPoint(t){let e=this.getNodesInputFlowPorts(t),r=e.length,a=new Map,m=new Array,g=(y,T)=>{let S=(a.has(y)||a.set(y,new Set),a.get(y)),c=S.size;for(let n of T)S.add(n);return S.size>c&&m.push(y),S};for(let[y,T]of e.entries())g(T.node,[y]);for(;m.length>0;){let y=m.shift(),T=a.get(y);for(let S of this.getNodesInputFlowPorts(y))if(g(S.node,T).size===r)return S.node}throw new A("No common branch point found for merge node.",this)}generateFunctionWithDependencies(t,e,r){let a=new Array;if(e.length===0)return a;let m=e.at(0).function;r.add(m);let g=new rr(m);a.push(g);for(let y of e){let T=this.generateNodeCode(t,y);g.addGraph(T);for(let S of T.dependencies)r.has(S)||a.push(...this.generateFunctionWithDependencies(t,S.getExitNodes(),r))}return a.reverse()}generateNodeCode(t,e){let r={dependencies:new Array,nodes:new Map,ports:new Map,scope:this.createScope(e,null)},a=this.walkBackward(t,r,e,null),m=a.codeOutput.join(" ");return new or({bodyCode:m,dependencies:r.dependencies,entryNode:a.lastGeneratedNode,exitNode:e,nodeIds:new Map(r.nodes),portValues:new Map(r.ports)})}generatePortValue(t,e,r){return e.ports.has(r)||e.ports.set(r,this.mProject.generator.values.valueId(t.counter.portIndex++)),e.ports.get(r)}getGeneratedNodeId(t,e,r){if(!e.nodes.has(r)){let m=(++t.counter.nodeIndex).toString(16).toUpperCase().padStart(8,"0");e.nodes.set(r,m)}return e.nodes.get(r)}getNodesInputFlowPorts(t){let e=new Array;for(let r of t.inputs.flow)e.push(...this.resolveFlowConjunctions(r));return[...new Set(e)]}handleFlowMerge(t,e,r,a,m){let g=m.join(" "),y=this.findBranchStartPoint(r),T={},S=e.scope;try{for(let c of a){e.scope=this.createScope(c.node,y);let n=this.walkBackward(t,e,c.node,y);T[n.endFlowPort.definitionId]=n.codeOutput.join(" ")}}finally{e.scope=S}return this.emitNode(t,e,y,T,g)}resolveFlowConjunctions(t){let e=new Array;for(let r of t.connectedPorts){if(r.node.definitionId!==te.DEFINITION_ID){e.push(r);continue}let a=r.node.inputs.flow[0];!a||a.connectedPorts.size===0||e.push(...this.resolveFlowConjunctions(a))}return e}resolveInputValue(t,e,r){let a=this.resolveValueConjunctions(r);if(!a){if(this.mProject.types.isGenericType(r.dataType))throw new A("Generic value inputs must be allways connected",this);return{inputPort:{value:this.mProject.types.getType(r.dataType).convert([...r.directValue]),isDirectValue:!0},emitResult:null}}let m=a.node,g=!m.hasFlowPorts,y=(()=>{if(!m.hasFlowPorts){if(e.scope.emittedNodes.has(m))return null;let T=e.scope.remaining.get(m);if(g&&(T=0),e.scope.remaining.set(m,T),T<=0)return e.scope.emittedNodes.add(m),this.emitNode(t,e,m,{})}return null})();return{inputPort:{value:this.generatePortValue(t,e,a),isDirectValue:!1},emitResult:y}}resolveValueConjunctions(t){if(t.connectedPorts.size===0)return null;let e=t.connectedPorts.values().next().value;if(e.node.definitionId!==ee.DEFINITION_ID)return e;let r=e.node.inputs.value[0];return!r||r.connectedPorts.size===0?null:this.resolveValueConjunctions(r)}walkBackward(t,e,r,a){let m={codeOutput:new Array,lastGeneratedNode:null,endFlowPort:null},g=null,y=r;for(;y!==null&&y!==a;){let T={};g!==null&&(T[g.definitionId]=m.codeOutput.join(" "),m.codeOutput=new Array);let S=m.codeOutput;m=this.emitNode(t,e,y,T),m.codeOutput=[...m.codeOutput,...S];let c=this.getNodesInputFlowPorts(y);if(c.length===0)break;c.length>1&&(m=this.handleFlowMerge(t,e,y,c,m.codeOutput),c=this.getNodesInputFlowPorts(m.lastGeneratedNode)),g=c[0]??null,y=g?.node??null}if(!m.lastGeneratedNode)throw new A(`Walk did not reach an entry node from exit "${r.label}".`,this);if(a&&y!==a)throw new A("Malformed graph. End node not reached",this);return m.endFlowPort=g,m}};var ir=class{mCachedCallable;mDisplay;mElement;mSpecifiedParameters;mTarget;get display(){return this.mDisplay}get element(){return this.mElement||(this.mElement=this.mDisplay.generate()),this.mElement}constructor(t,e){this.mDisplay=t,this.mTarget=e,this.mCachedCallable=null,this.mElement=null,this.mSpecifiedParameters={...this.mDisplay.executor.defaultParameters}}async execute(){this.mCachedCallable&&await this.mDisplay.update(this.element,this.mCachedCallable)}refresh(){let t=this.mTarget instanceof nt?this.mTarget.node.function:this.mTarget,e=(()=>{try{return new nr(t.project).generateFunction(t,!0)}catch{return null}})();if(!e){this.mCachedCallable=null;return}let r=null;if(this.mTarget instanceof nt&&(r=this.resolvePortTarget(e,this.mTarget),!r)){this.mCachedCallable=null;return}let a=this.mDisplay.executor.compile(e,r);if(!this.mDisplay.allowsType(a.type)){this.mCachedCallable=null;return}let m=this.mDisplay.adapterFor(a.type);this.mCachedCallable=async g=>m(await a.execute({...this.mDisplay.executor.defaultParameters,...this.mSpecifiedParameters,...g}))}specifyParameters(t){this.mSpecifiedParameters={...this.mSpecifiedParameters,...t}}resolvePortTarget(t,e){let[r,a]=(()=>{for(let g of t.entryPoint.graphs)if(g.ports.has(e)&&g.nodes.has(e.node))return[g.ports.get(e),g.nodes.get(e.node)];return[null,null]})();if(!r||!a)return null;let m=e.direction==="input"?"start":"end";return{documentPort:e,nodeHook:e.project.generator.values.hook(`${m}-${a}`),value:r}}};var oe=class{mExecutor;mGenerate;mId;mName;mTypeAdapters;mUpdate;get executor(){return this.mExecutor}get id(){return`${this.mId}-${this.mExecutor.function.id}`}get name(){return this.mName}constructor(t,e){this.mId=e.id,this.mName=e.name,this.mExecutor=t,this.mGenerate=e.generate,this.mUpdate=e.update,this.mTypeAdapters=new Map;for(let[r,a]of Object.entries(e.typeAdapter))this.mExecutor.types.has(r)&&this.mTypeAdapters.set(r,a)}adapterFor(t){let e=t;if(!this.mTypeAdapters.has(e))throw new A(`Display "${this.mId}" has no type adapter for type "${t}".`,this);return this.mTypeAdapters.get(e)}allowsType(t){return this.mTypeAdapters.has(t)}createDriver(t){return new ir(this,t)}generate(){return this.mGenerate()}update(t,e){return this.mUpdate(t,e)}};var Te=class f extends oe{static MATRIX_SIZE=3;static VALUE_LENGTH=5;constructor(t){super(t,{id:"matrix",name:"Matrix 3x3",generate:()=>{let e=document.createElement("div");return e.style.boxSizing="border-box",e.style.display="grid",e.style.gap="2px",e.style.gridTemplateColumns=`repeat(${f.MATRIX_SIZE}, minmax(0, 1fr))`,e.style.height="100%",e.style.width="100%",e.style.fontFamily="var(--pn-font-mono)",e.style.fontSize="var(--pn-font-size-sm)",e},typeAdapter:{[et.MAIN]:e=>e.map(r=>this.formatPreviewValue(r)),number:e=>[this.formatPreviewValue(e)],string:e=>[this.formatPreviewValue(e)],boolean:e=>[this.formatPreviewValue(e)]},update:async(e,r)=>{await this.updateMatrixPreview(e,r)}})}formatPreviewValue(t){if(typeof t=="number"){if(!Number.isFinite(t))return t.toString().slice(0,f.VALUE_LENGTH);let e=Math.trunc(Math.abs(t)).toString().length,r=Math.max(0,f.VALUE_LENGTH-e-(t<0?1:0)-1);return t.toFixed(r).slice(0,f.VALUE_LENGTH)}return String(t).slice(0,f.VALUE_LENGTH)}async updateMatrixPreview(t,e){for(;t.children.length<f.MATRIX_SIZE*f.MATRIX_SIZE;){let r=document.createElement("div");r.style.alignItems="center",r.style.background="var(--pn-bg-secondary)",r.style.border="1px solid var(--pn-border-default)",r.style.boxSizing="border-box",r.style.color="var(--pn-text-primary)",r.style.display="flex",r.style.justifyContent="center",r.style.minWidth="0",r.style.overflow="hidden",r.style.padding="2px",r.style.textOverflow="clip",r.style.whiteSpace="pre-line",t.append(r)}for(let r=0;r<f.MATRIX_SIZE;r++)for(let a=0;a<f.MATRIX_SIZE;a++){let m=r*f.MATRIX_SIZE+a,g=f.MATRIX_SIZE===1?0:a/(f.MATRIX_SIZE-1),y=f.MATRIX_SIZE===1?0:r/(f.MATRIX_SIZE-1),T=await Promise.resolve(e({x:g,y}));t.children[m].textContent=T.join(`
`)}}};var De=class f extends oe{static PREVIEW_HEIGHT=48;static PREVIEW_WIDTH=48;constructor(t){super(t,{id:"2dCanvas",name:"Canvas 2D",generate:()=>{let e=document.createElement("canvas");return e.width=f.PREVIEW_WIDTH,e.height=f.PREVIEW_HEIGHT,e.style.width="100%",e.style.height="100%",e.style.imageRendering="pixelated",e},typeAdapter:{[et.MAIN]:e=>e,number:e=>[e,e,e],boolean:e=>{let r=e?1:0;return[r,r,r]}},update:async(e,r)=>{await this.updateCanvasPreview(e,r)}})}async updateCanvasPreview(t,e){let r=t.getContext("2d");if(!r)return;let a=t.width,m=t.height,g=r.createImageData(a,m),y=g.data;for(let T=0;T<m;T++)for(let S=0;S<a;S++){let c=S/a,n=T/m,u=await Promise.resolve(e({x:c,y:n})),l=(T*a+S)*4;y[l]=Math.floor(Math.max(0,Math.min(1,u[0]||0))*255),y[l+1]=Math.floor(Math.max(0,Math.min(1,u[1]||0))*255),y[l+2]=Math.floor(Math.max(0,Math.min(1,u[2]||0))*255),y[l+3]=255}r.putImageData(g,0,0)}};(()=>{let f=new WebSocket("ws://127.0.0.1:8088");f.addEventListener("open",()=>{console.log("Refresh connection established")}),f.addEventListener("message",t=>{console.log("Bundle finished. Start refresh"),t.data==="REFRESH"&&window.location.reload()})})();var Tt=new Qe;Tt.addImport(new ke);Tt.addImport(new tr);var mi=new et(Tt.entryPoint,{defaultParameters:{x:0,y:0},types:[et.MAIN,"number","string","boolean"],build:(f,t,e)=>{let r=t.code,a=f.function.id;if(!e){let y=new Function(`${r}
return ${a};`)();return{type:et.MAIN,execute:T=>y(T.x,T.y)}}let m=r.replace(e.nodeHook,`; return ${e.value};`),g=new Function(`${m}
return ${a};`)();return{type:e.documentPort.resolvedDataType,execute:y=>g(y.x,y.y)}}}),fi=new et(Tt.userFunction,{defaultParameters:{x:0,y:0},types:["number","string","boolean"],build:(f,t,e)=>{if(!e)return{type:"number",execute:()=>0};let r=t.entryPoint.function,a=`__fn_${r.id.replaceAll("-","_")}`,m=r.inputs.map(T=>f.projectTypes.getDefaultValue(T.dataType)),g=t.code.replace(e.nodeHook,`return ${e.value};`),y=new Function(`${g}
return ${a};`)();return{type:e.documentPort.resolvedDataType,execute:()=>y(...m)}}});Tt.preview.addDisplay(new De(mi));Tt.preview.addDisplay(new De(fi));Tt.preview.addDisplay(new Te(mi));Tt.preview.addDisplay(new Te(fi));var Es=document.getElementById("application-root"),Ee=new Xe(Tt);Ee.appendTo(Es);Ee.document=new Mt(Tt);pi();async function pi(){try{await Ee.update()}catch(f){}requestAnimationFrame(pi)}document.getElementById("load-button").addEventListener("click",Is);document.getElementById("save-button").addEventListener("click",Ss);var gi="potatno-code-document.json";async function Is(){if(window.confirm("Load saved document?"))try{let r=await(await(await navigator.storage.getDirectory()).getFileHandle(gi)).getFile();Ee.load(await r.text())}catch{window.alert("Could not load document.")}}async function Ss(){if(window.confirm("Override saved document?"))try{let r=await(await(await navigator.storage.getDirectory()).getFileHandle(gi,{create:!0})).createWritable();await r.write(Ee.save()),await r.close()}catch{window.alert("Could not save document.")}}})();
//# sourceMappingURL=page.js.map
