(()=>{var Ht=class v extends Array{static newListWith(...t){let e=new v;return e.push(...t),e}clear(){this.splice(0,this.length)}clone(){return v.newListWith(...this)}distinct(){return v.newListWith(...new Set(this))}equals(t){if(this===t)return!0;if(!t||this.length!==t.length)return!1;for(let e=0;e<this.length;++e)if(this[e]!==t[e])return!1;return!0}remove(t){let e=this.indexOf(t);if(e!==-1)return this.splice(e,1)[0]}replace(t,e){let r=this.indexOf(t);if(r!==-1){let c=this[r];return this[r]=e,c}}toString(){return`[${super.join(", ")}]`}};var _=class extends Error{mTarget;get target(){return this.mTarget}constructor(t,e,r){super(t,r),this.mTarget=e}};var rt=class v extends Map{add(t,e){if(!this.has(t))this.set(t,e);else throw new _("Can't add duplicate key to dictionary.",this)}clone(){return new v(this)}getAllKeysOfValue(t){return[...this.entries()].filter(c=>c[1]===t).map(c=>c[0])}getOrDefault(t,e){let r=this.get(t);return typeof r<"u"?r:e}map(t){let e=new Ht;for(let r of this){let c=t(r[0],r[1]);e.push(c)}return e}};var zt=class v{mSize;mTopItem;get size(){return this.mSize}get top(){if(this.mTopItem)return this.mTopItem.value}constructor(){this.mTopItem=null,this.mSize=0}clone(){let t=new v;return t.mTopItem=this.mTopItem,t.mSize=this.mSize,t}*entries(){let t=this.mTopItem;for(;t!==null;)yield t.value,t=t.previous}flush(){let t=new Array;for(;this.mTopItem;)t.push(this.pop());return t}pop(){if(!this.mTopItem)return;let t=this.mTopItem.value;return this.mTopItem=this.mTopItem.previous,this.mSize--,t}push(t){let e={previous:this.mTopItem,value:t};this.mTopItem=e,this.mSize++}toArray(){return[...this.entries()]}};var he=class{mCompareFunction;constructor(t){this.mCompareFunction=t}differencesOf(t,e){let r;if(t.length===0||e.length===0){if(r=new Array,t.length===0)for(let C=0;C<e.length;C++)r.push({changeState:St.Insert,item:e[C]});else for(let C=0;C<t.length;C++)r.push({changeState:St.Remove,item:t[C]});return r}let c={1:{x:0,history:[]}},m=C=>C-1,f=t.length,y=e.length,x;for(let C=0;C<f+y+1;C++)for(let a=-C;a<C+1;a+=2){let n=a===-C||a!==C&&c[a-1].x<c[a+1].x;if(n){let l=c[a+1];x=l.x,r=l.history}else{let l=c[a-1];x=l.x+1,r=l.history}r=r.slice();let u=x-a;for(1<=u&&u<=y&&n?r.push({changeState:St.Insert,item:e[m(u)]}):1<=x&&x<=f&&r.push({changeState:St.Remove,item:t[m(x)]});x<f&&u<y&&this.mCompareFunction(t[m(x+1)],e[m(u+1)]);)x+=1,u+=1,r.push({changeState:St.Keep,item:t[m(x)]});if(x>=f&&u>=y)return r;c[a]={x,history:r}}return new Array}},St=function(v){return v[v.Remove=1]="Remove",v[v.Insert=2]="Insert",v[v.Keep=3]="Keep",v}({});var de=class{mNodeCache;constructor(){this.mNodeCache=new Map}start(t,e){let r=this.readFromCache(t),c=this.readFromCache(e),m=new go;m.set(r,0);let f=new Map;f.set(r,0);let y=new Map,x=new Array;for(;m.length!==0;){let C=m.popLowest();if(x.push(C),C===c)return{path:[...this.pathTracer(C,y)].reverse(),processedNodes:x};for(let a of this.getNeighborNodes(C)){let n=(f.get(C)??Number.POSITIVE_INFINITY)+this.costOfTraversal(a,{startNode:r,endNode:c,path:this.pathTracer(C,y)}),u=f.get(a)??Number.POSITIVE_INFINITY;if(n>=u)continue;y.set(a,C),f.set(a,n);let l=n+this.heuristic(a,{startNode:r,endNode:c,path:this.pathTracer(C,y)});m.set(a,l)}}return{path:new Array,processedNodes:x}}getNeighborNodes(t){return this.neighborNodes(t).map(e=>this.readFromCache(e))}*pathTracer(t,e){let r=t;for(;yield r,!!e.has(r);)r=e.get(r)}readFromCache(t){let e=this.nodeId(t);return this.mNodeCache.has(e)?this.mNodeCache.get(e):(this.mNodeCache.set(e,t),t)}},go=class{mExistingNodes;mList;mLowestCost;mLowestCostCounter;get length(){return this.mList.length}constructor(){this.mList=new Array,this.mExistingNodes=new Map,this.mLowestCost=Number.POSITIVE_INFINITY,this.mLowestCostCounter=0}popLowest(){if(this.mList.length===0)throw new _("Can not read next node from an empty priority list.",this);let[t,e]=(()=>{let f=null,y=0;for(let x=this.mList.length-1;x>-1;x--){let C=this.mList[x];if(C.cost===this.mLowestCost)return[C,0];(f===null||C.cost<f.cost)&&(f=C,y=0),C.cost===f.cost&&y++}if(f===null)throw new _("Lowest could not be found. Data is corrupted.",this);return[f,y]})();t.cost<this.mLowestCost&&(this.mLowestCost=t.cost,this.mLowestCostCounter=e),t.cost===this.mLowestCost&&this.mLowestCostCounter--,this.mLowestCostCounter<1&&(this.mLowestCost=Number.POSITIVE_INFINITY,this.mLowestCostCounter=0);let r=this.mExistingNodes.get(t.node),c=this.mList.length-1,m=this.mList[c];return this.mList[c]=t,this.mList[r]=m,this.mExistingNodes.set(m.node,r),this.mExistingNodes.delete(t.node),this.mList.pop().node}set(t,e){if(this.mLowestCostCounter>0&&e<this.mLowestCost&&(this.mLowestCost=e,this.mLowestCostCounter=0),e===this.mLowestCost&&this.mLowestCostCounter++,this.mExistingNodes.has(t)){let r=this.mExistingNodes.get(t),c=this.mList[r];if(c.cost===e){e===this.mLowestCost&&this.mLowestCostCounter--;return}c.cost=e;return}this.mList.push({cost:e,node:t}),this.mExistingNodes.set(t,this.mList.length-1)}};var me=class{mDataType;mId;mLabel;mPortType;mRegions;get dataType(){return this.mDataType}get id(){return this.mId}get label(){return this.mLabel}get portType(){return this.mPortType}get regions(){return this.mRegions}constructor(t){this.mLabel=t.label,this.mId=t.id,this.mPortType=t.portType,t.portType==="value"?this.mDataType=t.dataType:this.mDataType=null,this.mRegions={add:t.regions?.add??new Array}}};var it=class{mCategory;mCodeGenerator;mId;mLabel;mPortProvider;mRegions;get category(){return this.mCategory}get codeGenerator(){return this.mCodeGenerator}get id(){return this.mId}get inputs(){let t=!1,e=[];return this.mPortProvider.inputs(r=>{if(e.push(new me(r)),r.portType==="flow"){if(t)throw new _(`Node definition ${this.id} has multiple input flow ports, which is not allowed.`,this);t=!0}}),e}get label(){return this.mLabel}get outputs(){let t=[];return this.mPortProvider.outputs(e=>{t.push(new me(e))}),t}get regions(){return this.mRegions}constructor(t){this.mId=t.id,this.mLabel=t.label,this.mCategory={name:t.category.name,icon:t.category.icon??"\u25C6"},this.mCodeGenerator=t.generators.code,this.mPortProvider=t.generators.ports,this.mRegions={add:t.regions?.add??new Array,allows:t.regions?.allows??new Array,requires:t.regions?.requires??new Array}}getPort(t){return[...this.inputs,...this.outputs].find(e=>e.id===t)}};var yt=class extends it{mFunction;get function(){return this.mFunction}get label(){return this.mFunction.label}constructor(t){let e=(c,m,f)=>y=>{f.length===0&&y({label:c,id:c,portType:"flow"});for(let x of m)y({label:x.label,id:x.label,portType:"value",dataType:x.dataType})},r=t.project.getFunction(t.definitionId);super({id:`USERFUNCTION_${t.id}`,label:t.label,category:{name:"user function",icon:"\u0192"},generators:{ports:{inputs:e("Input",t.inputs,t.outputs),outputs:e("Output",t.outputs,t.outputs)},code:c=>r?r.codeGenerator.value({function:t,inputs:c.inputs,outputs:c.outputs,code:c.code}):""}}),this.mFunction=t}};var bt=class v extends it{static DEFINITION_ID="8124c652-3a8e-4333-b405-f905522a4610";constructor(){super({id:v.DEFINITION_ID,label:"Comment",category:{name:"Comment",icon:"\u270E"},generators:{ports:{inputs:()=>{},outputs:()=>{}},code:()=>{throw new _("Comment node code generators should never be called.",v)}}})}};var Z=class v extends it{static DEFINITION_ID="23e9319b-3b62-4dd8-858a-17d97ddee94e";constructor(){super({id:v.DEFINITION_ID,label:"Flow Conjunction",category:{name:"Conjunction",icon:"\u25C7"},generators:{ports:{inputs:t=>{t({label:"in",id:"in",portType:"flow"})},outputs:t=>{t({label:"out",id:"out",portType:"flow"})}},code:()=>{throw new _("Conjunction node code generators should never be called.",v)}}})}};var k=class v extends it{static DEFINITION_ID="a579584d-5d35-42b5-b2ba-3daddee488e0";constructor(){super({id:v.DEFINITION_ID,label:"Value Conjunction",category:{name:"Conjunction",icon:"\u25C7"},generators:{ports:{inputs:t=>{t({label:"in",id:"in",portType:"value",dataType:"<T>"})},outputs:t=>{t({label:"out",id:"out",portType:"value",dataType:"<T>"})}},code:()=>{throw new _("Conjunction node code generators should never be called.",v)}}})}};var wt=class{mAffectedItems;mErrors;get affectedItems(){return this.mAffectedItems}get errors(){return this.mErrors}constructor(){this.mErrors=new Array,this.mAffectedItems=new Set}addAffectedItem(t){this.mAffectedItems.add(t)}merge(t){this.mErrors.push(...t.mErrors);for(let e of t.mAffectedItems)this.mAffectedItems.add(e);return this}pushError(...t){this.mErrors.push(...t)}},K=class{mItem;mMessage;get item(){return this.mItem}get message(){return this.mMessage}constructor(t,e){this.mMessage=t,this.mItem=e}};var dt=class{mConnectedPorts;mDataType;mDefinitionId;mDirectValue;mDirection;mDocument;mLabel;mNode;mPortType;mProject;get connectedPorts(){return this.mConnectedPorts}get dataType(){return this.mDataType}get definitionId(){return this.mDefinitionId}get directValue(){return this.mDirectValue}get direction(){return this.mDirection}get document(){return this.mDocument}get label(){return this.mLabel}set label(t){this.mLabel=t}get node(){return this.mNode}get portType(){return this.mPortType}get project(){return this.mProject}get resolvedDataType(){return this.resolveDataType(new Set)}constructor(t,e,r){if(r.portType==="flow"&&r.dataType!==null)throw new _("Flow ports cannot have a value type.",this);if(r.portType==="value"&&r.dataType===null)throw new _("Value ports must have a value type.",this);this.mProject=t,this.mDocument=e,this.mNode=r.node,this.mDefinitionId=r.definitionId,this.mLabel=r.label,this.mDataType=r.dataType,this.mDirection=r.direction,this.mPortType=r.portType,this.mConnectedPorts=new Set,this.mDirectValue=new Array,r.dataType&&!this.mProject.types.isGenericType(r.dataType)&&this.mDirectValue.push(...t.types.getType(r.dataType).default.string)}connect(t){if(this.mConnectedPorts.has(t))return;if(this.mPortType!==t.portType)throw new _(`Cannot connect port ${this.mDefinitionId} of node ${this.mNode.label} to port ${t.mDefinitionId} of node ${t.node.label} due to incompatible port types.`,this);if(this.mDirection===t.direction)throw new _(`Cannot connect port ${this.mDefinitionId} of node ${this.mNode.label} to port ${t.mDefinitionId} of node ${t.node.label} due to incompatible directions.`,this);if(this.node===t.node)throw new _(`Cannot connect port ${this.mDefinitionId} of node ${this.mNode.label} to another port of the same node.`,this);if(!(this.mPortType==="flow"&&this.mDirection==="input"||this.mPortType==="value"&&this.mDirection==="output"))for(let r of Array.from(this.mConnectedPorts))this.disconnect(r);this.mConnectedPorts.add(t),t.connect(this)}disconnect(t){this.mConnectedPorts.has(t)&&(this.mConnectedPorts.delete(t),t.disconnect(this))}setDirectValue(t){if(this.mPortType!=="value")throw new _("Only value ports can have a direct value.",this);if(this.mProject.types.isGenericType(this.mDataType))throw new _("Generic value ports cannot have a direct value.",this);if(t.length!==this.mProject.types.getType(this.mDataType).default.string.length)throw new _("The provided value does not match the expected length of the default value for this port's type.",this);this.mDirectValue.splice(0,this.mDirectValue.length),this.mDirectValue.push(...t)}validate(){let t=new wt;if(this.mDirection==="output"){if(this.mPortType==="flow"&&this.mConnectedPorts.size>1&&t.pushError(new K(`Flow output port "${this.mDefinitionId}" on node "${this.mNode.label}" can only have one connection.`,this)),this.mPortType==="value"&&this.mProject.types.isGenericType(this.mDataType??"")){let e=this.mNode.inputs.value.filter(r=>r.dataType===this.mDataType);for(let r of e)r.connectedPorts.size===0&&t.pushError(new K(`Generic output port "${this.mDefinitionId}" on node "${this.mNode.label}" cannot resolve generic type "${this.mDataType}" because its input port "${r.definitionId}" is not connected.`,this))}return t}if(this.mDirection==="input"){if(this.mPortType==="flow")return this.mConnectedPorts.size===0&&t.pushError(new K(`Flow input port "${this.mDefinitionId}" on node "${this.mNode.label}" must have at least one connection.`,this)),t;if(this.mPortType==="value"){this.mConnectedPorts.size>1&&t.pushError(new K(`Value input port "${this.mDefinitionId}" on node "${this.mNode.label}" can only have one connection.`,this));for(let e of this.mConnectedPorts)e.resolvedDataType!==this.resolvedDataType&&t.pushError(new K(`Value input port "${this.mDefinitionId}" on node "${this.mNode.label}" expects type "${this.resolvedDataType}" but is connected to type "${e.resolvedDataType}".`,this));return t}}return t}resolveDataType(t){if(t.has(this.node))return this.mDataType;if(this.mDirection==="input"&&t.add(this.node),this.mPortType!=="value")throw new _("Port data type couldn't be resolved as it is no value port.",this);if(!this.mProject.types.isGenericType(this.mDataType??""))return this.mDataType;if(this.mDirection==="output"){let r=this.mNode.inputs.value.find(c=>c.dataType===this.mDataType);if(!r)throw new _("Port type couldn't be resolved as it has no resolving sibling port",this);return r.resolveDataType(t)}return this.mConnectedPorts.size===0?this.mDataType:this.mConnectedPorts.values().next().value.resolveDataType(t)}};var Nt=class{mDefinitionId;mDocument;mFunction;mInputs;mLabel;mOutputs;mPreview;mProject;mTransformation;get definitionId(){return this.mDefinitionId}get document(){return this.mDocument}get function(){return this.mFunction}get hasFlowPorts(){return this.mOutputs.flow.length>0||this.mInputs.flow.length>0}get hasValuePorts(){return this.mOutputs.value.length>0||this.mInputs.value.length>0}get inputs(){return this.mInputs}get label(){return this.mLabel}set label(t){this.mLabel=t}get outputs(){return this.mOutputs}get preview(){return this.mPreview}set preview(t){this.mPreview=t}get project(){return this.mProject}get transformation(){return this.mTransformation}constructor(t,e,r,c){this.mDocument=e,this.mDefinitionId=c.definitionId,this.mFunction=r,this.mLabel=c.label,this.mPreview=c.preview??null,this.mProject=t,this.mTransformation={x:0,y:0,width:0,height:0};let m=(f,y)=>{let x={direction:y,list:new Array,map:new Map,flow:new Array,value:new Array};for(let C of f){let a=new dt(this.mProject,this.mDocument,{definitionId:C.definitionId,direction:y,label:C.label,node:this,portType:C.portType,dataType:C.dataType});x.list.push(a),x.map.set(a.definitionId,a),(a.portType==="flow"?x.flow:x.value).push(a)}return x};this.mInputs=m(c.ports.input,"input"),this.mOutputs=m(c.ports.output,"output"),this.resizeTo(c.transformation.width,c.transformation.height),this.moveTo(c.transformation.x,c.transformation.y)}moveTo(t,e){this.mTransformation.x=Math.round(t),this.mTransformation.y=Math.round(e)}resizeTo(t,e){let r=this.mFunction.nodeDefinitions.find(f=>f.id===this.mDefinitionId),[c,m]=(()=>{switch(r?.id){case bt.DEFINITION_ID:return[Math.max(6,t),Math.max(6,e)];case k.DEFINITION_ID:case Z.DEFINITION_ID:return[1,1];default:return[6,Math.max(this.mInputs.list.length,this.mOutputs.list.length)+1]}})();this.mTransformation.width=c,this.mTransformation.height=m}validate(t){let e=new wt,r=t??new Set,c=this.mFunction.nodeDefinitions.find(m=>m.id===this.mDefinitionId);if(!c)e.pushError(new K(`Node "${this.mLabel}" definition "${this.mDefinitionId}" could not be found.`,this));else{e.merge(this.resyncPorts(this.mInputs,c.inputs)),e.merge(this.resyncPorts(this.mOutputs,c.outputs));let m=new Set([...c.regions.requires,...c.regions.allows]);if(m.size>0)for(let f of r)m.has(f)||e.pushError(new K(`Node "${this.mLabel}" does not allow region "${f}".`,this));if(c.regions.requires.length>0)for(let f of c.regions.requires)r.has(f)||e.pushError(new K(`Node "${this.mLabel}" requires region "${f}" but it is not active.`,this))}for(let m of[...this.mInputs.list,...this.mOutputs.list])e.merge(m.validate());return this.resizeTo(this.transformation.width,this.transformation.height),e}addPort(t,e,r){let c=new dt(this.mProject,this.mDocument,{definitionId:e.id,direction:t.direction,label:e.label,node:this,portType:e.portType,dataType:e.dataType});return t.list.splice(r,0,c),t.map.set(c.definitionId,c),(c.portType==="flow"?t.flow:t.value).push(c),c}removePort(t,e){let r=t.list.indexOf(e);if(r===-1)throw new _(`Port "${e.label}" was not found and can not be removed.`,this);t.list.splice(r,1),t.map.delete(e.definitionId);let c=e.portType==="flow"?t.flow:t.value,m=c.indexOf(e);if(r===-1)throw new _(`Port "${e.label}" was not found in typed list and can not be removed.`,this);return c.splice(m,1),r}replacePort(t,e,r){let c=Array.from(e.connectedPorts);for(let y of Array.from(e.connectedPorts))e.disconnect(y);let m=this.removePort(t,e),f=this.addPort(t,r,m);for(let y of c)f.connect(y);return f}resyncPorts(t,e){let r=new wt,c=new Set(e.map(m=>m.id));for(let m=0;m<e.length;m++){let f=e[m];if(!t.map.has(f.id)){let n=this.addPort(t,f,m);r.addAffectedItem(n);continue}let y=t.map.get(f.id),x=y.portType!==f.portType,C=y.dataType!==f.dataType;if(!x&&!C)continue;if(y.connectedPorts.size>0&&x){r.pushError(new K(`Port "${y.label}" on node "${this.mLabel}" has a changed type.`,y));continue}let a=this.replacePort(t,y,f);r.addAffectedItem(y),r.addAffectedItem(a)}for(let m of t.list)if(!c.has(m.definitionId)){if(m.connectedPorts.size===0){r.addAffectedItem(m),this.removePort(t,m);continue}r.pushError(new K(`Port "${m.label}" on node "${this.mLabel}" no longer exists in its definition.`,m))}return r}};var Et=class{mDefinitionId;mDocument;mId;mImportIds;mInputs;mIsSystem;mLabel;mNodes;mOutputs;mProject;get definitionId(){return this.mDefinitionId}get document(){return this.mDocument}get dynamicNodeDefinitions(){let t=this.mDocument.nodeDefinitions.filter(m=>!(m instanceof yt&&m.function===this)),e=this.mProject.getFunction(this.definitionId);if(!e)return t;let r=e.getNodeDefinitions(this),c=this.mProject.imports.filter(m=>this.mImportIds.has(m.id)).flatMap(m=>m.nodes);return[...t,...c,...r.dynamic]}get id(){return this.mId}get imports(){return this.mImportIds}get inputs(){return this.mInputs}get isSystem(){return this.mIsSystem}get label(){return this.mLabel}set label(t){this.mLabel=t}get nodeDefinitions(){let t=this.mProject.getFunction(this.definitionId);if(!t)return this.dynamicNodeDefinitions;let e=t.getNodeDefinitions(this);return[...this.dynamicNodeDefinitions,...e.entry,...e.exit]}get nodes(){return this.mNodes}get outputs(){return this.mOutputs}get project(){return this.mProject}constructor(t,e,r){this.mProject=t,this.mDocument=e,this.mLabel=r.label,this.mIsSystem=r.isSystem,this.mDefinitionId=r.definitionId,this.mId=r.id,this.mNodes=new Set,this.mInputs=new Array,this.mOutputs=new Array,this.mImportIds=new Set}addImport(t){if(!this.project.imports.some(r=>r.id===t))throw new _(`Project does not contain import ${t}`,this);this.mImportIds.add(t)}addInput(t){this.mInputs.some(e=>e.label===t.label)||this.mInputs.push(t)}addNode(t){this.mNodes.add(t)}addNodeByDefinition(t,e){let r=m=>({definitionId:m.id,label:m.label,portType:m.portType,dataType:m.dataType}),c=new Nt(this.mProject,this.mDocument,this,{definitionId:t.id,ports:{input:t.inputs.map(r),output:t.outputs.map(r)},label:t.label,transformation:e});return this.mNodes.add(c),c}addOutput(t){this.mOutputs.some(e=>e.label===t.label)||this.mOutputs.push(t)}getExitNodes(){let t=this.mProject.getFunction(this.mDefinitionId);if(!t)throw new _(`Function definition not found for function "${this.mLabel}".`,this);let e=new Set(t.getNodeDefinitions(this).exit.map(r=>r.id));return[...this.mNodes].filter(r=>e.has(r.definitionId))}removeImport(t){this.mImportIds.delete(t)}removeInput(t){let e=this.mInputs.findIndex(r=>r.label===t.label);e!==-1&&this.mInputs.splice(e,1)}removeNode(t){for(let e of[...t.inputs.list,...t.outputs.list])for(let r of Array.from(e.connectedPorts))e.disconnect(r);this.mNodes.delete(t)}removeOutput(t){let e=this.mOutputs.findIndex(r=>r.label===t.label);e!==-1&&this.mOutputs.splice(e,1)}validate(){let t=new wt,e=this.mProject.getFunction(this.mDefinitionId);e||t.pushError(new K(`Function "${this.mLabel}" definition "${this.mDefinitionId}" could not be found.`,this));let r=e?.getNodeDefinitions(this);r&&this.resyncFunction(r,t);let c=this.collectRegions(this.mNodes,t),m=new Set(r?.entry.map(y=>y.id)??new Array),f=new Map;for(let y of this.mNodes)t.merge(y.validate(c.get(y))),this.collectEntryDomains(y,m,f).size>1&&t.pushError(new K(`Node "${y.label}" is reachable from multiple entry nodes.`,y));return t}collectEntryDomains(t,e,r){if(r.has(t))return r.get(t);let c=new Set;r.set(t,c);for(let m of t.inputs.list)for(let f of m.connectedPorts){let y=f.node;e.has(y.definitionId)&&c.add(y);for(let x of this.collectEntryDomains(y,e,r))c.add(x)}return c}collectRegions(t,e){let r=new Map;for(let y of this.nodeDefinitions)r.set(y.id,y);let c=(()=>{let y=new Map;return(x,C)=>{if(!y.has(x.id)){let a=new Map;for(let n of x.outputs)a.set(n.id,n.regions.add);y.set(x.id,a)}return[...y.get(x.id).get(C)??new Array,...x.regions.add]}})(),m=(()=>{let y=new Map;return(x,C)=>{if(y.has(x))return y.get(x);if(C.has(x))return e.pushError(new K(`Node "${x.label}" is part of a connection cycle.`,x)),new Set;C.add(x);let a=new Set;for(let n of x.inputs.list)for(let u of n.connectedPorts){let l=u.node;for(let o of m(l,C))a.add(o);if(r.has(l.definitionId))for(let o of c(r.get(l.definitionId),u.definitionId))a.add(o)}return y.set(x,a),a}})(),f=new Map;for(let y of t)f.set(y,m(y,new Set));return f}resyncFunction(t,e){let r=[...t.entry,...t.exit],c=new Set(this.mNodes.values().map(y=>y.definitionId)),m=0,f=20;for(let y of r){if(c.has(y.id))continue;let x=this.addNodeByDefinition(y,{x:Math.floor(m/(r.length/2))*f+2,y:m*f+2-Math.floor(m/(r.length/2))*(r.length/2*f),width:0,height:0});e.addAffectedItem(x),m++}}};var jt=class{mFunctionNodeDefinitions;mFunctions;mProject;get functions(){return this.mFunctions}get nodeDefinitions(){return[...this.mFunctionNodeDefinitions.values(),...this.mProject.nodeDefinitions.values()]}get project(){return this.mProject}constructor(t){this.mProject=t,this.mFunctions=new Array,this.mFunctionNodeDefinitions=new Map}addFunction(t){let e=this.mFunctions.indexOf(t);e!==-1&&this.mFunctions.splice(e,1),this.mFunctions.push(t);let r=new yt(t);return this.mFunctionNodeDefinitions.set(r.id,r),t}newFunction(t){return this.addFunction(new Et(this.mProject,this,t))}removeFunction(t){if(t.isSystem)throw new _("Cannot remove a system function.",this);let e=this.mFunctions.indexOf(t);if(e===-1)return!1;this.mFunctions.splice(e,1);for(let r of this.mFunctionNodeDefinitions.values())r.function===t&&this.mFunctionNodeDefinitions.delete(r.id);return!0}validate(){let t=new wt,e=this.mProject.entryPoint.id;if(!this.mFunctions.values().some(r=>r.definitionId===e)){let r=this.newFunction({definitionId:e,id:crypto.randomUUID(),isSystem:!0,label:this.mProject.entryPoint.label});t.addAffectedItem(r)}for(let r of this.mFunctions)t.merge(r.validate());return t.pushError(...this.detectCrossFunctionRecursion()),t}detectCrossFunctionRecursion(){let t=[],e=new Map,r=y=>{if(!e.has(y)){let x=new Set;for(let C of y.nodes)this.mFunctionNodeDefinitions.has(C.definitionId)&&x.add(this.mFunctionNodeDefinitions.get(C.definitionId).function);e.set(y,x)}return e.get(y)},c=new Set,m=new Set,f=y=>{if(!c.has(y)){if(m.has(y)){t.push(new K(`Function "${y.label}" participates in a cross-function recursion cycle.`,y));return}m.add(y);for(let x of r(y))f(x);m.delete(y),c.add(y)}};for(let y of this.mFunctions)f(y);return t}};var Vt=class{mData;mInteractionType;mOrigin;get data(){return this.mData}get origin(){return this.mOrigin}get triggerType(){return this.mInteractionType}constructor(t,e,r){this.mInteractionType=t,this.mData=r,this.mOrigin=e}};var xt=class v{static mCurrentZone=new v("Default");static get current(){return v.mCurrentZone}static create(t){return new v(t,v.current)}mAttachments;mInteractionListener;mName;mParent;mTriggerFilterBitmap;get name(){return this.mName}get parent(){return this.mParent}constructor(t,e=null){this.mName=t,this.mParent=e,this.mTriggerFilterBitmap=-1,this.mInteractionListener=new Map,this.mAttachments=new WeakMap}addInteractionListener(t){return this.mInteractionListener.set(t,v.current),this}execute(t,...e){let r=v.mCurrentZone;v.mCurrentZone=this;try{return t(...e)}finally{v.mCurrentZone=r}}getAttachment(t){return this.mAttachments.has(t)?this.mAttachments.get(t):this.mParent!==null?this.mParent.getAttachment(t):null}pushInteraction(t,e){if((this.mTriggerFilterBitmap&t)===0)return!1;if(this.mInteractionListener.size===0)return!0;let r=new Vt(t,this,e);for(let[c,m]of this.mInteractionListener.entries())m.execute(()=>{c.call(this,r)});return!0}removeInteractionListener(t){return t?(this.mInteractionListener.delete(t),this):(this.mInteractionListener.clear(),this)}setAttachment(t,e){this.mAttachments.set(t,e)}setTriggerRestriction(t){return this.mTriggerFilterBitmap=t,this}};var Q=class v{static mComponents=new WeakMap;static mConstructorSelector=new WeakMap;static mElements=new WeakMap;static elementIsComponent(t){return v.mComponents.has(t)}static ofComponent(t){let e=t.processorConstructor,r=v.mConstructorSelector.get(e);if(!r)throw new _(`Constructor "${e.name}" is not a registered custom element`,e);let c=v.mElements.get(t);if(!c)throw new _(`Component "${t}" is not a registered component`,t);return{selector:r,constructor:e,element:c,component:t,processor:t.processor}}static ofConstructor(t){let e=v.mConstructorSelector.get(t);if(!e)throw new _(`Constructor "${t.name}" is not a registered custom element`,t);let r=globalThis.customElements.get(e);if(!r)throw new _(`Constructor "${t.name}" is not a registered custom element`,t);return{selector:e,constructor:t,elementConstructor:r}}static ofElement(t){let e=v.mComponents.get(t);if(!e)throw new _(`Element "${t}" is not a PwbComponent.`,t);return v.ofComponent(e)}static ofProcessor(t){let e=v.mComponents.get(t);if(!e)throw new _("Processor is not a PwbComponent.",t);return v.ofComponent(e)}static registerComponent(t,e,r){v.mComponents.has(e)||v.mComponents.set(e,t),r&&!v.mComponents.has(r)&&v.mComponents.set(r,t),v.mElements.has(t)||v.mElements.set(t,e)}static registerConstructor(t,e){t&&!v.mConstructorSelector.has(t)&&v.mConstructorSelector.set(t,e)}};var It=class{static ATTACHMENT_KEY=Symbol("ComponentZoneConfiguration");mFrameTime;mInjection;get guaranteedFrameTime(){return this.mFrameTime}set guaranteedFrameTime(t){this.mFrameTime=t}get injections(){return this.mInjection}constructor(){this.mInjection=new Map,this.mFrameTime=Number.MAX_SAFE_INTEGER}setInjection(t,e){this.mInjection.set(t,e)}};var Jt=class extends Error{mZone;get zone(){return this.mZone}constructor(t,e){let r=t instanceof Error?t.message:"Non-error value thrown";super(`Update error in zone "${e.name}": ${r}`,{cause:t}),this.mZone=e}};var pe=class v{static new(t,e){let r=new v;t(r),e&&r.appendTo(e)}mComponentZoneConfiguration;mContent;mCurrentTarget;mErrorListener;mFragment;mInteractionZone;constructor(){this.mContent=new Array,this.mFragment=document.createDocumentFragment(),this.mCurrentTarget=null,this.mErrorListener=new Array,this.mInteractionZone=xt.create("PwbApplication"),this.mComponentZoneConfiguration=new It,this.mInteractionZone.setAttachment(It.ATTACHMENT_KEY,this.mComponentZoneConfiguration),globalThis.addEventListener("error",t=>{this.handleZoneError(t,t.error)}),globalThis.addEventListener("unhandledrejection",t=>{this.handleZoneError(t,t.reason)})}addContent(t){let e=Q.ofConstructor(t).elementConstructor,r=this.mInteractionZone.execute(()=>Q.ofElement(new e));return this.mContent.push(r.component),this.mFragment.appendChild(r.element),this.updateTarget(),r.processor}addErrorListener(t){this.mErrorListener.includes(t)&&this.removeErrorListener(t),this.mErrorListener.push(t)}addStyle(t){let e=document.createElement("style");e.textContent=t,this.mFragment.prepend(e)}appendTo(t){this.mCurrentTarget=t,this.updateTarget()}removeErrorListener(t){let e=this.mErrorListener.indexOf(t);e!==-1&&this.mErrorListener.splice(e,1)}setInjection(t,e){this.mComponentZoneConfiguration.setInjection(t,e)}handleZoneError(t,e){if(!(e instanceof Jt)||!this.zoneBelongsToApplication(e.zone))return;t.preventDefault();let r=!1;for(let c of this.mErrorListener)c(e.cause)===!0&&(r=!0);r||console.error(e.cause)}updateTarget(){this.mCurrentTarget&&(this.mCurrentTarget.shadowRoot||this.mCurrentTarget.attachShadow({mode:"open"}),this.mCurrentTarget.shadowRoot.appendChild(this.mFragment))}zoneBelongsToApplication(t){let e=t;for(;e!==null;){if(e===this.mInteractionZone)return!0;e=e.parent}return!1}};var Kt=class{mCustomMetadata;constructor(){this.mCustomMetadata=new Map}getMetadata(t){return this.mCustomMetadata.get(t)??null}setMetadata(t,e){this.mCustomMetadata.set(t,e)}};var fe=class extends Kt{};var ge=class v extends Kt{static mPrivateMetadataKey=Symbol("Metadata");mDecoratorMetadataObject;mPropertyMetadata;constructor(t){super(),this.mDecoratorMetadataObject=t,this.mPropertyMetadata=new Map,t[v.mPrivateMetadataKey]=this}getInheritedMetadata(t){let e=new Array,r=this.mDecoratorMetadataObject;do{if(Object.hasOwn(r,v.mPrivateMetadataKey)){let m=r[v.mPrivateMetadataKey].getMetadata(t);m!==null&&e.push(m)}r=Object.getPrototypeOf(r)}while(r!==null);return e.reverse()}getProperty(t){return this.mPropertyMetadata.has(t)||this.mPropertyMetadata.set(t,new fe),this.mPropertyMetadata.get(t)}};Symbol.metadata??=Symbol("Symbol.metadata");var st=class v{static mMetadataMapping=new Map;static add(t,e){return(r,c)=>{let m=v.forInternalDecorator(c.metadata);switch(c.kind){case"class":m.setMetadata(t,e);return;case"method":case"field":case"getter":case"setter":case"accessor":if(c.static)throw new Error("@Metadata.add not supported for statics.");m.getProperty(c.name).setMetadata(t,e);return}}}static forInternalDecorator(t){return v.mapMetadata(t)}static get(t){Object.hasOwn(t,Symbol.metadata)||v.polyfillMissingMetadata(t);let e=t[Symbol.metadata];return v.mapMetadata(e)}static init(){return(t,e)=>{v.forInternalDecorator(e.metadata)}}static mapMetadata(t){if(v.mMetadataMapping.has(t))return v.mMetadataMapping.get(t);let e=new ge(t);return v.mMetadataMapping.set(t,e),e}static polyfillMissingMetadata(t){let e=new Array,r=t;do e.push(r),r=Object.getPrototypeOf(r);while(r!==null);for(let c=e.length-1;c>=0;c--){let m=e[c];if(!Object.hasOwn(m,Symbol.metadata)){let f=null;c<e.length-2&&(f=e[c+1][Symbol.metadata]),m[Symbol.metadata]=Object.create(f,{})}}}};var O=class v{static mCurrentInjectionContext=null;static mInjectMode=new Map;static mInjectableConstructor=new Map;static mInjectableReplacement=new Map;static mInjectionConstructorIdentificationMetadataKey=Symbol("InjectionConstructorIdentification");static mSingletonMapping=new Map;static createObject(t,e,r){let[c,m]=typeof e=="object"&&e!==null?[!1,e]:[!!e,r??new Map],f=v.getInjectionIdentification(t);if(!v.mInjectableConstructor.has(f))throw new _(`Constructor "${t.name}" is not registered for injection and can not be built`,v);let y=c?"instanced":v.mInjectMode.get(f),x=new Map(m.entries().map(([n,u])=>[v.getInjectionIdentification(n),u])),C=v.mCurrentInjectionContext,a=new Map([...C?.localInjections.entries()??[],...x.entries()]);v.mCurrentInjectionContext={injectionMode:y,localInjections:a};try{if(!c&&y==="singleton"&&v.mSingletonMapping.has(f))return v.mSingletonMapping.get(f);let n=new t;return y==="singleton"&&!v.mSingletonMapping.has(f)&&v.mSingletonMapping.set(f,n),n}finally{v.mCurrentInjectionContext=C}}static injectable(t="instanced"){return(e,r)=>{v.registerInjectable(e,r.metadata,t)}}static registerInjectable(t,e,r){let c=v.getInjectionIdentification(t,e);v.mInjectableConstructor.set(c,t),v.mInjectMode.set(c,r)}static replaceInjectable(t,e){let r=v.getInjectionIdentification(t);if(!v.mInjectableConstructor.has(r))throw new _("Original constructor is not registered.",v);let c=v.getInjectionIdentification(e);if(!v.mInjectableConstructor.has(c))throw new _("Replacement constructor is not registered.",v);v.mInjectableReplacement.set(r,e)}static use(t){if(v.mCurrentInjectionContext===null)throw new _("Can't create object outside of an injection context.",v);let e=v.getInjectionIdentification(t);if(v.mCurrentInjectionContext.injectionMode!=="singleton"&&v.mCurrentInjectionContext.localInjections.has(e))return v.mCurrentInjectionContext.localInjections.get(e);let r=v.mInjectableReplacement.get(e);if(r||(r=v.mInjectableConstructor.get(e)),!r)throw new _(`Constructor "${t.name}" is not registered for injection and can not be built`,v);return v.createObject(r)}static getInjectionIdentification(t,e){let r=e?st.forInternalDecorator(e):st.get(t),c=r.getMetadata(v.mInjectionConstructorIdentificationMetadataKey);return c||(c=Symbol(t.name),r.setMetadata(v.mInjectionConstructorIdentificationMetadataKey,c)),c}};var q=function(v){return v[v.Read=1]="Read",v[v.ReadWrite=2]="ReadWrite",v[v.Write=3]="Write",v}({});var _t=class{mHooks;mInjections;mProcessor;mProcessorConstructor;get processor(){if(!this.mProcessor)throw new _("Processor is not created yet. Call setup to create processor.",this);return this.mProcessor}get processorConstructor(){return this.mProcessorConstructor}constructor(t){if(this.mProcessorConstructor=t.constructor,this.mProcessor=null,this.mInjections=new Map,this.mHooks={create:new Array},t.parent)for(let[e,r]of t.parent.mInjections.entries())this.setProcessorInjection(e,r)}deconstruct(){}getProcessorInjection(t){return this.mInjections.get(t)}setProcessorInjection(t,e){if(this.mProcessor)throw new _("Cant add injections to after construction.",this);this.mInjections.set(t,e)}setup(){return this.mProcessor=this.createProcessor(),this}addConstructionHook(t){return this.mHooks.create.push(t),this}call(t,...e){let r=Reflect.get(this.processor,t);return typeof r!="function"?null:r.apply(this.processor,e)}createProcessor(){let t=O.createObject(this.mProcessorConstructor,this.mInjections),e;for(;e=this.mHooks.create.pop();){let r=e.call(this,t);r&&(t=r)}return t}};var $t=class v extends _t{constructor(t,e){super({constructor:t,parent:e}),this.setProcessorInjection(v,this)}deconstruct(){this.call("onDeconstruct"),super.deconstruct()}setup(){return super.setup(),this.call("onExecute"),this}onUpdate(){return!1}};var vo=class v{static mInstance;mCoreEntityConstructor;mProcessorConstructorConfiguration;constructor(){if(v.mInstance)return v.mInstance;v.mInstance=this,this.mCoreEntityConstructor=new Map,this.mProcessorConstructorConfiguration=new Map}get(t){let e=this.mCoreEntityConstructor.get(t);if(!e)return new Array;let r=new Array;for(let c of e)r.push({processorConstructor:c,processorConfiguration:this.mProcessorConstructorConfiguration.get(c)});return r}register(t,e,r){this.mProcessorConstructorConfiguration.set(e,r);let c=t;do{if(!(c.prototype instanceof _t)&&c!==_t)break;this.mCoreEntityConstructor.has(c)||this.mCoreEntityConstructor.set(c,new Set),this.mCoreEntityConstructor.get(c).add(e)}while(c=Object.getPrototypeOf(c))}},ct=new vo;var Qt=class v extends _t{static mExtensionCache=new WeakMap;mExtensionList;constructor(t){super(t),this.mExtensionList=new Array}deconstruct(){for(let t of this.mExtensionList)t.deconstruct();super.deconstruct()}setup(){return super.setup(),this.executeExtensions(),this}executeExtensions(){let t=(()=>{if(!v.mExtensionCache.has(this.processorConstructor)){let c=ct.get($t).filter(f=>{for(let y of f.processorConfiguration.targetRestrictions)if(this instanceof y||this.processorConstructor.prototype instanceof y||this.processorConstructor===y)return!0;return!1}),m={read:c.filter(f=>f.processorConfiguration.access===q.Read),write:c.filter(f=>f.processorConfiguration.access===q.Write),readWrite:c.filter(f=>f.processorConfiguration.access===q.ReadWrite)};v.mExtensionCache.set(this.processorConstructor,m)}return v.mExtensionCache.get(this.processorConstructor)})(),e=[...t.write,...t.readWrite,...t.read];for(let r of e)this.mExtensionList.push(new $t(r.processorConstructor,this).setup())}};var B={get:1,set:2,manual:4};var Le=class v{static ORIGINAL_TO_INTERACTION_MAPPING=new WeakMap;static PROXY_TO_ORIGINAL_MAPPING=new WeakMap;static UNTRACEABLE_FUNCTION_UPDATE_TRIGGER=(()=>{let t=new WeakMap;return t.set(Array.prototype.fill,B.set),t.set(Array.prototype.pop,B.get),t.set(Array.prototype.push,B.set),t.set(Array.prototype.shift,B.get),t.set(Array.prototype.unshift,B.set),t.set(Array.prototype.splice,B.set),t.set(Array.prototype.reverse,B.set),t.set(Array.prototype.sort,B.set),t.set(Array.prototype.concat,B.set),t.set(Map.prototype.clear,B.set),t.set(Map.prototype.delete,B.set),t.set(Map.prototype.set,B.set),t.set(Set.prototype.clear,B.set),t.set(Set.prototype.delete,B.set),t.set(Set.prototype.add,B.set),t})();static getOriginal(t){return v.PROXY_TO_ORIGINAL_MAPPING.get(t)??t}static getWrapper(t){let e=v.getOriginal(t);return v.ORIGINAL_TO_INTERACTION_MAPPING.get(e)}mProxyObject;mStateChangeCallback;get proxy(){return this.mProxyObject}constructor(t,e){let r=v.getWrapper(t);if(r)return r;this.mProxyObject=this.createProxyObject(t),this.mStateChangeCallback=e,v.PROXY_TO_ORIGINAL_MAPPING.set(this.mProxyObject,t),v.ORIGINAL_TO_INTERACTION_MAPPING.set(t,this)}convertToProxy(t){return t===null||typeof t!="object"&&typeof t!="function"?t:new v(t,this.mStateChangeCallback).proxy}createProxyObject(t){let e=(c,m,f)=>{let y=v.getOriginal(m);try{let x=c.call(y,...f);return this.convertToProxy(x)}finally{if(v.UNTRACEABLE_FUNCTION_UPDATE_TRIGGER.has(c)){let x=v.getWrapper(m);x&&x.dispatch(v.UNTRACEABLE_FUNCTION_UPDATE_TRIGGER.get(c))}}};return new Proxy(t,{apply:(c,m,f)=>{let y=c;try{let x=y.call(m,...f);return this.convertToProxy(x)}catch(x){if(!(x instanceof TypeError))throw x;return e(y,m,f)}},set:(c,m,f)=>{try{let y=f;return(y!==null&&typeof y=="object"||typeof y=="function")&&(y=v.getOriginal(y)),Reflect.set(c,m,y)}finally{this.dispatch(B.set)}},get:(c,m,f)=>{try{return this.convertToProxy(Reflect.get(c,m))}finally{this.dispatch(B.get)}},deleteProperty:(c,m)=>{try{return delete c[m]}finally{this.dispatch(B.set)}}})}dispatch(t){this.mStateChangeCallback(t)}};var $=class v{static reaction(t){let e=xt.create("ComponentState reaction");e.addInteractionListener(r=>{(r.triggerType&B.set)!==0&&t()}),e.execute(()=>{t()})}static state(t){return(e,r)=>{if(r.static)throw new _("Event target is not for a static property.",v);let c=new WeakMap,m=(f,y)=>{c.set(f,new v(y,t))};return{init(f){return typeof f>"u"||m(this,f),f},set(f){c.has(this)?c.get(this).set(f):m(this,f)},get(){return c.has(this)||m(this,void 0),c.get(this).get()}}}}mConfiguration;mLinkedZones;mLinkedZonesArray;mValue;constructor(t,e){if(this.mLinkedZones=new Set,this.mLinkedZonesArray=new Array,this.mConfiguration={complexValue:e?.complexValue??!1,proxy:e?.proxy??!1},this.mConfiguration.proxy){if(typeof t!="object"||t===null)throw new _("Proxied component state value must be an object.",this);this.mValue=new Le(t,r=>{switch(r){case B.set:return this.dispatchChange();case B.get:return this.linkCurrentZone()}}).proxy}else this.mValue=t}get(){return this.linkCurrentZone(),this.mValue}set(t){if(this.mConfiguration.proxy)throw new _("Proxy is not implemented yet.",this);!this.mConfiguration.complexValue&&this.mValue===t||(this.mValue=t,this.dispatchChange())}dispatchChange(){for(let t of this.mLinkedZonesArray)t.pushInteraction(B.set,this)}linkCurrentZone(){let t=xt.current;this.mLinkedZones.has(t)||(this.mLinkedZones.add(t),this.mLinkedZonesArray.push(t))}};var Gt=class v{static mCurrentUpdateCycle=null;static openResheduledCycle(t,e){let r=!1;if(!v.mCurrentUpdateCycle){let c=performance.now();v.mCurrentUpdateCycle={initiator:t.initiator,startTime:c,forcedSync:t.forcedSync,runner:t.runner},r=!0}try{return e(v.mCurrentUpdateCycle)}finally{r&&(v.mCurrentUpdateCycle=null)}}static openUpdateCycle(t,e){let r=!1;if(!v.mCurrentUpdateCycle){let c=performance.now();v.mCurrentUpdateCycle={initiator:t.updater,startTime:c,forcedSync:t.runSync,runner:Symbol("Runner "+c)},r=!0}try{return e(v.mCurrentUpdateCycle)}finally{r&&(v.mCurrentUpdateCycle=null)}}static updateCycleRunId(t,e){if(t.initiator===e){let r=performance.now(),c=t;c.runner=Symbol("Runner "+r)}}static updateCyleStartTime(t){let e=performance.now(),r=t;r.startTime=e}};var Re=class extends Error{mChain;get chain(){return this.mChain}constructor(t,e){let r=e.slice(-20).map(c=>c.toString()).join(`
`);super(`${t}: 
${r}`),this.mChain=[...e]}};var Oe=class v{static DEFAULT_FRAME_TIME=Number.MAX_SAFE_INTEGER;static STACK_CAP=100;mFrameTime;mInteractionZone;mManualComponentState;mUpdateFunction;mUpdateRunCache;mUpdateStates;get zone(){return this.mInteractionZone}constructor(t){this.mUpdateRunCache=new WeakMap,this.mUpdateFunction=t.onUpdate,this.mFrameTime=v.DEFAULT_FRAME_TIME;let e=xt.current.getAttachment(It.ATTACHMENT_KEY);e&&(this.mFrameTime=e.guaranteedFrameTime),this.mManualComponentState=new $(Symbol("Manual Update")),this.mUpdateStates={chainCompleteHooks:new zt,async:{hasSheduledTask:!1,hasRunningTask:!1,sheduledTaskIsResheduled:!1},sync:{running:!1},cycle:{chainedTask:null}},this.mInteractionZone=xt.create("Update-Zone"),this.mInteractionZone.addInteractionListener(r=>{(r.triggerType&B.set)!==0&&this.runUpdateAsynchron(r,null)})}deconstruct(){this.mInteractionZone.removeInteractionListener()}executeInZone(t){return this.mInteractionZone.execute(t)}update(){let t=new Vt(B.manual,this.mInteractionZone,this.mManualComponentState);return this.runUpdateSynchron(t)}updateAsync(){let t=new Vt(B.manual,this.mInteractionZone,this.mManualComponentState);this.runUpdateAsynchron(t,null)}async waitForUpdate(){return this.mUpdateStates.async.hasSheduledTask?new Promise((t,e)=>{this.mUpdateStates.chainCompleteHooks.push((r,c)=>{c?e(c):t(r)})}):!1}executeTaskChain(t,e,r,c){if(c.length>v.STACK_CAP)throw new Re("Call loop detected",c);let m=performance.now();if(!e.forcedSync&&m-e.startTime>this.mFrameTime)throw new ve;c.push(t);let f=this.mInteractionZone.execute(()=>this.mUpdateFunction.call(this))||r;if(Gt.updateCycleRunId(e,this),!this.mUpdateStates.cycle.chainedTask)return f;let y=this.mUpdateStates.cycle.chainedTask;return this.mUpdateStates.cycle.chainedTask=null,this.executeTaskChain(y,e,f,c)}releaseUpdateChainCompleteHooks(t,e){if(!this.mUpdateStates.chainCompleteHooks.top)return;let r;for(;r=this.mUpdateStates.chainCompleteHooks.pop();)r(t,e)}runUpdateAsynchron(t,e){if(this.mUpdateStates.async.hasRunningTask||this.mUpdateStates.async.sheduledTaskIsResheduled){this.mUpdateStates.cycle.chainedTask=t;return}if(this.mUpdateStates.async.hasSheduledTask)return;let r=c=>{this.mUpdateStates.async.hasRunningTask=!0,this.mUpdateStates.async.hasSheduledTask=!1,this.mUpdateStates.async.sheduledTaskIsResheduled=!1;let m=!1;try{this.runUpdateSynchron(t)}catch(f){if(f instanceof ve&&c.initiator===this)m=!0;else throw new Jt(f,this.zone)}finally{this.mUpdateStates.async.hasRunningTask=!1}m&&this.runUpdateAsynchron(t,c)};this.mUpdateStates.async.hasSheduledTask=!0,e&&(this.mUpdateStates.async.sheduledTaskIsResheduled=!0),globalThis.requestAnimationFrame(()=>{e?Gt.openResheduledCycle(e,r):Gt.openUpdateCycle({updater:this,runSync:!1},r)})}runUpdateSynchron(t){if(this.mUpdateStates.sync.running)return this.mUpdateStates.cycle.chainedTask=t,!1;this.mUpdateStates.sync.running=!0;try{let e=Gt.openUpdateCycle({updater:this,runSync:!0},r=>{if(this.mUpdateRunCache.has(r.runner))return Gt.updateCyleStartTime(r),this.mUpdateRunCache.get(r.runner);let c=this.executeTaskChain(t,r,!1,new Array);return this.mUpdateRunCache.set(r.runner,c),c});return this.releaseUpdateChainCompleteHooks(e),e}catch(e){throw e instanceof ve||this.releaseUpdateChainCompleteHooks(!1,e),e}finally{this.mUpdateStates.sync.running=!1}}},ve=class extends Error{constructor(){super("Update resheduled")}};var Fe=class extends Qt{mUpdater;get updater(){return this.mUpdater}constructor(t){super(t),this.mUpdater=new Oe({label:t.constructor.name,onUpdate:()=>this.onUpdate()})}call(t,...e){return this.mUpdater.executeInZone(()=>super.call(t,...e))}deconstruct(){this.mUpdater.deconstruct(),super.deconstruct()}createProcessor(){return this.mUpdater.executeInZone(()=>super.createProcessor())}};var Yt=class{mExpression;mTemporaryValues;constructor(t,e,r){if(this.mTemporaryValues=new rt,r.length>0)for(let c of r)this.mTemporaryValues.set(c,void 0);this.mExpression=this.createEvaluationFunction(t,this.mTemporaryValues).bind(e.store)}execute(){return this.mExpression()}setTemporaryValue(t,e){if(!this.mTemporaryValues.has(t))throw new _(`Temporary value "${t}" does not exist for this procedure.`,this);this.mTemporaryValues.set(t,e)}createEvaluationFunction(t,e){let r,c=`__${Math.random().toString(36).substring(2)}`;if(r="return function () {",e.size>0)for(let m of e.keys())r+=`const ${m} = ${c}.get('${m}');`;return r+=`return ${t};`,r+="};",new Function(c,r)(e)}};var Ct=class{mDataLevel;get data(){return this.mDataLevel}constructor(t){this.mDataLevel=t}createExpressionProcedure(t,e){return new Yt(t,this.data,e??[])}setTemporaryValue(t,e){this.data.setTemporaryValue(t,e)}};var mt=class{mComponent;mDataProxy;mParentLevel;mTemporaryValues;get store(){return this.mDataProxy}constructor(t){this.mTemporaryValues=new rt,t instanceof G?(this.mParentLevel=null,this.mComponent=t):(this.mParentLevel=t,this.mComponent=t.mComponent),this.mDataProxy=this.createAccessProxy()}deleteTemporaryValue(t){this.mTemporaryValues.delete(t)}setTemporaryValue(t,e){this.mTemporaryValues.set(t,e)}updateLevelData(t){if(t.mParentLevel!==this.mParentLevel)throw new _("Can't update InstructionLevelData for a deeper level than it target data.",this);this.mTemporaryValues=t.mTemporaryValues}createAccessProxy(){return new Proxy(new Object,{get:(t,e)=>this.getValue(e),set:(t,e,r)=>(this.hasTemporaryValue(e)&&this.setTemporaryValue(e,r),e in this.mComponent.processor?(this.mComponent.processor[e]=r,!0):(this.setTemporaryValue(e,r),!0)),deleteProperty:()=>{throw new _("Deleting properties is not allowed",this)},ownKeys:()=>[...new Set([...Object.keys(this.mComponent.processor),...this.getTemporaryValuesList()])]})}getTemporaryValuesList(){let t=this.mTemporaryValues.map(e=>e);return this.mParentLevel&&t.push(...this.mParentLevel.getTemporaryValuesList()),t}getValue(t){if(this.mTemporaryValues.has(t))return this.mTemporaryValues.get(t);if(this.mParentLevel)return this.mParentLevel.getValue(t);if(t in this.mComponent.processor)return this.mComponent.processor[t]}hasTemporaryValue(t){return this.mTemporaryValues.has(t)?!0:this.mParentLevel?this.mParentLevel.hasTemporaryValue(t):!1}};var Wt=class v{mChildList;mInstruction;mInstructionType;get childList(){return this.mChildList}get instruction(){return this.mInstruction}get instructionType(){return this.mInstructionType}constructor(t,e){this.mChildList=Array(),this.mInstruction=e,this.mInstructionType=t}appendChild(...t){this.mChildList.push(...t)}clone(){let t=new v(this.instructionType,this.instruction);for(let e of this.mChildList)t.appendChild(e.clone());return t}equals(t){if(!(t instanceof v)||t.instruction!==this.instruction||t.instructionType!==this.instructionType||t.childList.length!==this.childList.length)return!1;for(let e=0;e<t.childList.length;e++)if(!t.childList[e].equals(this.childList[e]))return!1;return!0}removeChild(t){let e=this.mChildList.indexOf(t);if(e!==-1)return this.mChildList.splice(e,1)[0]}};var At=class v{mExpression;get value(){return this.mExpression}constructor(t){this.mExpression=t}clone(){return new v(this.mExpression)}equals(t){return t instanceof v&&t.value===this.value}toString(){return`{{ ${this.mExpression} }}`}};var Lt=class v{mContainsExpression;mTextValue;mValues;get containsExpression(){return this.mContainsExpression}get values(){return this.mValues}constructor(){this.mTextValue="",this.mContainsExpression=!1,this.mValues=[]}addValue(...t){for(let e of t)(this.mContainsExpression===!0||e instanceof At)&&(this.mContainsExpression=!0),this.mValues.push(e),this.mTextValue+=e.toString()}clone(){let t=new v;for(let e of this.values)typeof e=="string"?t.addValue(e):t.addValue(e.clone());return t}equals(t){if(!(t instanceof v)||t.values.length!==this.values.length)return!1;for(let e=0;e<this.values.length;e++){let r=this.values[e],c=t.values[e];if(r!==c&&(typeof r!=typeof c||typeof r=="string"&&r!==c||!c.equals(r)))return!1}return!0}toString(){return this.mTextValue}};var ye=class v{mName;mValue;get name(){return this.mName}get values(){return this.mValue}constructor(t){this.mName=t,this.mValue=new Lt}clone(){let t=new v(this.name);for(let e of this.values.values)typeof e=="string"?t.values.addValue(e):t.values.addValue(e.clone());return t}equals(t){return!(!(t instanceof v)||t.name!==this.name||!t.values.equals(this.values))}};var Rt=class v{mAttributeDictionary;mChildList;mTagName;get attributes(){return[...this.mAttributeDictionary.values()]}get childList(){return this.mChildList}get tagName(){return this.mTagName}constructor(t){this.mAttributeDictionary=new Map,this.mChildList=Array(),this.mTagName=t}appendChild(...t){this.mChildList.push(...t)}clone(){let t=new v(this.tagName);for(let e of this.mAttributeDictionary.values()){let r=t.setAttribute(e.name);for(let c of e.values.values)typeof c=="string"?r.addValue(c):r.addValue(c.clone())}for(let e of this.mChildList)t.appendChild(e.clone());return t}equals(t){if(!(t instanceof v)||t.tagName!==this.tagName||t.attributes.length!==this.mAttributeDictionary.size||t.childList.length!==this.mChildList.length)return!1;for(let e of t.mAttributeDictionary.values()){let r=this.mAttributeDictionary.get(e.name);if(!r||!r.equals(e))return!1}for(let e=0;e<t.childList.length;e++)if(!t.childList[e].equals(this.mChildList[e]))return!1;return!0}getAttribute(t){return this.mAttributeDictionary.get(t)?.values??null}removeAttribute(t){return this.mAttributeDictionary.delete(t)}removeChild(t){let e=this.mChildList.indexOf(t);if(e!==-1)return this.mChildList.splice(e,1)[0]}setAttribute(t){if(this.mAttributeDictionary.has(t))return this.mAttributeDictionary.get(t).values;let e=new ye(t);return this.mAttributeDictionary.set(t,e),e.values}};var ut=class v{mBodyElementList;get body(){return this.mBodyElementList}constructor(){this.mBodyElementList=new Array}appendChild(...t){this.mBodyElementList.push(...t)}clone(){let t=new v;for(let e of this.mBodyElementList)t.appendChild(e.clone());return t}equals(t){if(!(t instanceof v)||t.body.length!==this.mBodyElementList.length)return!1;for(let e=0;e<this.mBodyElementList.length;e++)if(!this.mBodyElementList[e].equals(t.body[e]))return!1;return!0}removeChild(t){let e=this.mBodyElementList.indexOf(t);if(e!==-1)return this.mBodyElementList.splice(e,1)[0]}};var at=class{mComponentValues;mContent;mModules;mTemplate;get anchor(){return this.mContent.contentAnchor}get content(){return this.mContent}get modules(){return this.mModules}get template(){return this.mTemplate}get values(){return this.mComponentValues}constructor(t,e,r,c){this.mTemplate=t,this.mComponentValues=r,this.mContent=c,this.mModules=e,c.setCoreBuilder(this)}deconstruct(){this.content.deconstruct()}update(){let t=this.onUpdate(),e=!1,r=this.content.builders;if(r.length>0)for(let c=0;c<r.length;c++)e=r[c].update()||e;return t||e}createTextNode(t){return document.createTextNode(t)}};var kt=class{mChildBuilderList;mChildComponents;mContentAnchor;mContentBoundary;mLinkedContent;mRootChildList;get body(){return this.mRootChildList}get builders(){return this.mChildBuilderList}get contentAnchor(){return this.mContentAnchor}constructor(t){this.mChildBuilderList=new Array,this.mRootChildList=new Array,this.mChildComponents=new Map,this.mLinkedContent=new WeakSet,this.mContentAnchor=document.createComment(t),this.mContentBoundary={start:this.mContentAnchor,end:this.mContentAnchor}}deconstruct(){this.onDeconstruct();let t;for(;t=this.mChildBuilderList.pop();)t.deconstruct();for(let r of this.mChildComponents.values())r.deconstruct();this.mChildComponents.clear();let e;for(;e=this.mRootChildList.pop();)e instanceof at||e.remove();this.contentAnchor.remove()}getBoundary(){let t=this.mContentBoundary.end instanceof at?this.mContentBoundary.end.content.getBoundary().end:this.mContentBoundary.end;return{start:this.mContentBoundary.start,end:t}}insert(t,e,r){if(!this.mLinkedContent.has(r))throw new _("Can't add content to builder. Target is not part of builder.",this);let c=t instanceof at?t.anchor:t;switch(e){case"After":{this.insertAfter(c,r);break}case"TopOf":{this.insertTop(c,r);break}case"BottomOf":{this.insertBottom(c,r);break}}this.mLinkedContent.add(t),t instanceof at?this.mChildBuilderList.push(t):this.addChildComponent(t);let m=c.parentElement??c.getRootNode(),f=this.mContentAnchor.parentElement??this.mContentAnchor.getRootNode();if(m===f){let y=(()=>{switch(e){case"After":return this.mRootChildList.indexOf(r)+1;case"TopOf":return 0;case"BottomOf":return this.mRootChildList.length}})();y===this.mRootChildList.length&&(this.mContentBoundary.end=t),this.mRootChildList.splice(y+1,0,t)}}remove(t){if(!this.mLinkedContent.has(t))throw new _("Child node cant be deleted from builder when it not a child of them",this);if(this.mLinkedContent.delete(t),t instanceof at){let r=this.mChildBuilderList.indexOf(t);r!==-1&&this.mChildBuilderList.splice(r,1),t.deconstruct()}else{let r=this.mChildComponents.get(t);r&&(r.deconstruct(),this.mChildComponents.delete(t)),t.remove()}let e=this.mRootChildList.indexOf(t);e!==-1&&(this.mRootChildList.splice(e,1),this.mContentBoundary.end=this.mRootChildList.at(-1)??this.mContentAnchor)}setCoreBuilder(t){this.mLinkedContent.add(t)}addChildComponent(t){Q.elementIsComponent(t)&&this.mChildComponents.set(t,Q.ofElement(t).component)}insertAfter(t,e){let r=e instanceof at?e.content.getBoundary().end:e;(r.parentElement??r.getRootNode()).insertBefore(t,r.nextSibling)}insertBottom(t,e){if(e instanceof at){this.insertAfter(t,e);return}if(e instanceof Element){e.appendChild(t);return}throw new _("Source node does not support child nodes.",this)}insertTop(t,e){if(e instanceof at){this.insertAfter(t,e.anchor);return}if(e instanceof Element){e.prepend(t);return}throw new _("Source node does not support child nodes.",this)}};var ze=class extends kt{mAttributeModulesChangedOrder;mLinkedAttributeData;mLinkedAttributeExpressionModules;mLinkedAttributeModuleList;mLinkedExpressionModuleList;get linkedAttributeModules(){return this.mAttributeModulesChangedOrder&&(this.mAttributeModulesChangedOrder=!1,this.mLinkedAttributeModuleList.sort((t,e)=>t.accessMode-e.accessMode)),this.mLinkedAttributeModuleList}get linkedExpressionModules(){return this.mLinkedExpressionModuleList}constructor(t){super(t),this.mLinkedExpressionModuleList=new Array,this.mLinkedAttributeModuleList=new Array,this.mLinkedAttributeExpressionModules=new WeakMap,this.mLinkedAttributeData=new WeakMap,this.mAttributeModulesChangedOrder=!1}attributeOfLinkedExpressionModule(t){return this.mLinkedAttributeExpressionModules.get(t)}getLinkedAttributeData(t){if(!this.mLinkedAttributeData.has(t))throw new _("Attribute has no linked data.",this);return this.mLinkedAttributeData.get(t)}linkAttributeExpression(t,e){this.mLinkedAttributeExpressionModules.set(t,e)}linkAttributeModule(t){this.mLinkedAttributeModuleList.push(t),this.mAttributeModulesChangedOrder=!0}linkAttributeNodes(t,e,r){this.mLinkedAttributeData.set(t,{values:r,node:e})}linkExpressionModule(t){this.mLinkedExpressionModuleList.push(t)}onDeconstruct(){for(let t of this.mLinkedAttributeModuleList)t.deconstruct();for(let t of this.mLinkedExpressionModuleList)t.deconstruct()}};var je=class extends kt{mInstructionModule;get instructionModule(){return this.mInstructionModule}constructor(t,e){super(e),this.mInstructionModule=t}onDeconstruct(){this.mInstructionModule.deconstruct()}};var Ve=class extends at{constructor(t,e,r){let c=e.createInstructionModule(t,r);super(t,e,r,new je(c,`Instruction - {$${t.instructionType}}`))}onUpdate(){if(this.content.instructionModule.update()){let t=this.content.body;this.updateStaticBuilder(t,this.content.instructionModule.instructionResult.elementList)}return!1}insertNewContent(t,e){let r=new te(t.template,this.modules,t.dataLevel,`Child - {$${this.template.instructionType}}`,t.key);return e===null?this.content.insert(r,"TopOf",this):this.content.insert(r,"After",e),r}updateStaticBuilder(t,e){let c=new he((y,x)=>x.template.equals(y.template)&&x.key===y.key).differencesOf(t,e),m=0,f=null;for(let y=0;y<c.length;y++){let x=c[y];if(x.changeState===St.Remove)this.content.remove(x.item);else if(x.changeState===St.Insert)f=this.insertNewContent(x.item,f),m++;else{let C=e[m].dataLevel;x.item.values.updateLevelData(C),f=x.item,m++}}}};var te=class extends at{mInitialized;mKey;get key(){return this.mKey}constructor(t,e,r,c,m){super(t,e,r,new ze(`Static - {${c}}`)),this.mKey=m,this.mInitialized=!1}onUpdate(){this.mInitialized||(this.mInitialized=!0,this.buildTemplate([this.template],this));let t=!1,e=this.content.linkedAttributeModules;for(let m=0;m<e.length;m++)t=e[m].update()||t;let r=!1,c=this.content.linkedExpressionModules;for(let m=0;m<c.length;m++){let f=c[m];if(f.update()){r=!0;let y=this.content.attributeOfLinkedExpressionModule(f);if(!y)continue;let x=this.content.getLinkedAttributeData(y),C=x.values.reduce((a,n)=>a+n.data,"");x.node.setAttribute(y.name,C)}}return t||r}buildInstructionTemplate(t,e){this.content.insert(new Ve(t,this.modules,new mt(this.values)),"BottomOf",e)}buildStaticTemplate(t,e){let{element:r,isComponent:c}=this.createHtmlElement(t),m=null;c&&(m=new Array);for(let f of t.attributes){let y=this.modules.createAttributeModule(f,r,this.values);if(y){this.content.linkAttributeModule(y),c&&m.push(y);continue}if(f.values.containsExpression){let x=new Array;for(let C of f.values.values){let a=this.createTextNode("");if(x.push(a),!(C instanceof At)){a.data=C;continue}let n=this.modules.createExpressionModule(C,a,this.values);this.content.linkExpressionModule(n),this.content.linkAttributeExpression(n,f)}this.content.linkAttributeNodes(f,r,x);continue}r.setAttribute(f.name,f.values.toString())}if(c){for(let f of m)f.update();Q.ofElement(r).component.updater.update()}this.content.insert(r,"BottomOf",e),this.buildTemplate(t.childList,r)}buildTemplate(t,e){for(let r of t)r instanceof ut?this.buildTemplate(r.body,e):r instanceof Lt?this.buildTextTemplate(r,e):r instanceof Wt?this.buildInstructionTemplate(r,e):r instanceof Rt&&this.buildStaticTemplate(r,e)}buildTextTemplate(t,e){for(let r of t.values){if(typeof r=="string"){this.content.insert(this.createTextNode(r),"BottomOf",e);continue}let c=this.createTextNode("");this.content.insert(c,"BottomOf",e);let m=this.modules.createExpressionModule(r,c,this.values);this.content.linkExpressionModule(m)}}createHtmlElement(t){let e=t.tagName;if(e.includes("-")){let c=globalThis.customElements.get(e);if(typeof c<"u"){let m=new c;return{element:m,isComponent:Q.elementIsComponent(m)}}}let r=t.getAttribute("xmlns");return r&&!r.containsExpression?{element:document.createElementNS(r.values[0],e),isComponent:!1}:{element:document.createElement(e),isComponent:!1}}};var be=class{mHtmlElement;mShadowRoot;get htmlElement(){return this.mHtmlElement}get shadowRoot(){return this.mShadowRoot}constructor(t){this.mHtmlElement=t,this.mShadowRoot=this.mHtmlElement.attachShadow({mode:"open"})}};var Y=class{mDataLevel;get data(){return this.mDataLevel}constructor(t){this.mDataLevel=t}createExpressionProcedure(t,e){return new Yt(t,this.data,e??[])}};var Bt=class extends Qt{constructor(t){super({constructor:t.constructor,parent:t.parent}),this.setProcessorInjection(Y,new Y(t.values))}deconstruct(){super.deconstruct(),this.call("onDeconstruct")}update(){return this.onUpdate()}};var ot=class{mValue;get value(){return this.mValue}constructor(t){this.mValue=t}};var tt=class{constructor(){throw new _("Reference should not be instanced.",this)}};var pt=class{constructor(){throw new _("Reference should not be instanced.",this)}};var Ut=class v extends Bt{mLastResult;mTargetTextNode;constructor(t){super({constructor:t.constructor,parent:t.parent,values:t.values}),this.mTargetTextNode=t.targetNode,this.mLastResult=null,this.setProcessorInjection(v,this),this.setProcessorInjection(pt,t.targetTemplate.clone()),this.setProcessorInjection(tt,t.targetNode),this.setProcessorInjection(ot,new ot(t.targetTemplate.value))}onUpdate(){let t=this.call("onUpdate");t===null&&(t="");let e=this.mLastResult===null||this.mLastResult!==t;if(e){let r=this.mTargetTextNode;r.data=t,this.mLastResult=t}return e}};function yo(){return(v,t)=>{O.registerInjectable(v,t.metadata,"instanced"),ct.register(Ut,v,{})}}function Ls(){function v(a,n){return function(l){e(n,"addInitializer"),r(l,"An initializer"),a.push(l)}}function t(a,n,u,l,o,b,g,D,w){var p;switch(o){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:g?"#"+n:n,static:b,private:g,metadata:D},d={v:!1};s.addInitializer=v(l,d);var i,h;o===0?g?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(T){this[n]=T}):o===2?i=function(){return u.value}:((o===1||o===3)&&(i=function(){return u.get.call(this)}),(o===1||o===4)&&(h=function(T){u.set.call(this,T)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return a(w,s)}finally{d.v=!0}}function e(a,n){if(a.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(a,n){if(typeof a!="function")throw new TypeError(n+" must be a function")}function c(a,n){var u=typeof n;if(a===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(u!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function m(a,n,u,l,o,b,g,D,w){var p=u[0],s,d,i;g?o===0||o===1?s={get:u[3],set:u[4]}:o===3?s={get:u[3]}:o===4?s={set:u[3]}:s={value:u[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var h,T,P;if(typeof p=="function")h=t(p,l,s,D,o,b,g,w,i),h!==void 0&&(c(o,h),o===0?d=h:o===1?(d=h.init,T=h.get||i.get,P=h.set||i.set,i={get:T,set:P}):i=h);else for(var M=p.length-1;M>=0;M--){var S=p[M];if(h=t(S,l,s,D,o,b,g,w,i),h!==void 0){c(o,h);var N;o===0?N=h:o===1?(N=h.init,T=h.get||i.get,P=h.set||i.set,i={get:T,set:P}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(o===0||o===1){if(d===void 0)d=function(I,E){return E};else if(typeof d!="function"){var F=d;d=function(I,E){for(var A=E,L=0;L<F.length;L++)A=F[L].call(I,A);return A}}else{var j=d;d=function(I,E){return j.call(I,E)}}a.push(d)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),g?o===1?(a.push(function(I,E){return i.get.call(I,E)}),a.push(function(I,E){return i.set.call(I,E)})):o===2?a.push(i):a.push(function(I,E){return i.call(I,E)}):Object.defineProperty(n,l,s))}function f(a,n,u){for(var l=[],o,b,g=new Map,D=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,T,P;if(h?(T=a,s=s-5,b=b||[],P=b):(T=a.prototype,o=o||[],P=o),s!==0&&!i){var M=h?D:g,S=M.get(d)||0;if(S===!0||S===3&&s!==4||S===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!S&&s>2?M.set(d,s):M.set(d,!0)}m(l,T,p,d,s,h,i,P,u)}}return y(l,o),y(l,b),l}function y(a,n){n&&a.push(function(u){for(var l=0;l<n.length;l++)n[l].call(u);return u})}function x(a,n,u){if(n.length>0){for(var l=[],o=a,b=a.name,g=n.length-1;g>=0;g--){var D={v:!1};try{var w=n[g](o,{kind:"class",name:b,addInitializer:v(l,D),metadata:u})}finally{D.v=!0}w!==void 0&&(c(10,w),o=w)}return[C(o,u),function(){for(var p=0;p<l.length;p++)l[p].call(o)}]}}function C(a,n){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,l,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(b===void 0?null:b),D=f(n,u,g);return l.length||C(n,g),{e:D,get c(){return x(n,l,g)}}}}function Ro(v,t,e,r){return(Ro=Ls())(v,t,e,r)}var Oo,Ao,bo;Oo=yo();var Lo=class{static{({c:[bo,Ao]}=Ro(this,[],[Oo]))}constructor(t=O.use(Y),e=O.use(ot)){this.mProcedure=t.createExpressionProcedure(e.value)}mProcedure;onUpdate(){let t=this.mProcedure.execute();return typeof t>"u"?null:t?.toString()}static{Ao()}};var nt=class{mName;mValue;get name(){return this.mName}get value(){return this.mValue}constructor(t,e){this.mName=t,this.mValue=e}};var Tt=class v extends Bt{mAccessMode;get accessMode(){return this.mAccessMode}constructor(t){super({constructor:t.constructor,parent:t.parent,values:t.values}),this.mAccessMode=t.accessMode,this.setProcessorInjection(v,this),this.setProcessorInjection(pt,t.targetTemplate.clone()),this.setProcessorInjection(tt,t.targetNode),this.setProcessorInjection(nt,new nt(t.targetTemplate.name,t.targetTemplate.values.toString()))}onUpdate(){return this.call("onUpdate")??!1}};var ht=class{mDataLevels;mElementList;mTemplates;get elementList(){return this.mElementList}constructor(){this.mElementList=new Array,this.mTemplates=new Set,this.mDataLevels=new Set}addElement(t,e,r){if(this.mTemplates.has(t)||this.mDataLevels.has(e))throw new _("Can't add same template or values for multiple Elements.",this);this.mTemplates.add(t),this.mDataLevels.add(e),this.mElementList.push({template:t,dataLevel:e,key:r})}};var Xt=class v extends Bt{mLastResult;get instructionResult(){return this.mLastResult}constructor(t){super({constructor:t.constructor,parent:t.parent,values:t.values}),this.setProcessorInjection(v,this),this.setProcessorInjection(pt,t.targetTemplate.clone()),this.setProcessorInjection(ot,new ot(t.targetTemplate.instruction)),this.mLastResult=new ht}onUpdate(){let t=this.call("onUpdate");return t instanceof ht?(this.mLastResult=t,!0):!1}};var $e=class v{static mAttributeModuleCache=new rt;static mExpressionModuleCache=new WeakMap;static mInstructionModuleCache=new rt;mComponent;mExpressionModule;constructor(t,e){this.mExpressionModule=e??bo,this.mComponent=t}createAttributeModule(t,e,r){let c=(()=>{let m=v.mAttributeModuleCache.get(t.name);if(m||m===null)return m;for(let f of ct.get(Tt))if(f.processorConfiguration.selector.test(t.name))return v.mAttributeModuleCache.set(t.name,f),f;return v.mAttributeModuleCache.set(t.name,null),null})();return c===null?null:new Tt({accessMode:c.processorConfiguration.access,constructor:c.processorConstructor,parent:this.mComponent,targetNode:e,targetTemplate:t,values:r}).setup()}createExpressionModule(t,e,r){let c=(()=>{let m=v.mExpressionModuleCache.get(this.mExpressionModule);if(m)return m;let f=ct.get(Ut).find(y=>y.processorConstructor===this.mExpressionModule);if(!f)throw new _("An expression module could not be found.",this);return v.mExpressionModuleCache.set(this.mExpressionModule,f),f})();return new Ut({constructor:c.processorConstructor,parent:this.mComponent,targetNode:e,targetTemplate:t,values:r}).setup()}createInstructionModule(t,e){let r=(()=>{let c=v.mInstructionModuleCache.get(t.instructionType);if(c)return c;for(let m of ct.get(Xt))if(m.processorConfiguration.instructionType===t.instructionType)return v.mInstructionModuleCache.set(t.instructionType,m),m;throw new _(`Instruction module type "${t.instructionType}" not found.`,this)})();return new Xt({constructor:r.processorConstructor,parent:this.mComponent,targetTemplate:t,values:e}).setup()}};var Zt=class extends _{mColumnEnd;mColumnStart;mLineEnd;mLineStart;get columnEnd(){return this.mColumnEnd}get columnStart(){return this.mColumnStart}get lineEnd(){return this.mLineEnd}get lineStart(){return this.mLineStart}constructor(t,e,r,c,m,f,y){super(t,e,y),this.mColumnStart=r,this.mLineStart=c,this.mColumnEnd=m,this.mLineEnd=f}};var ee=class{mDependencyFetch;mDependencyFetchResolved;mLexer;mMeta;mPattern;mPatternDependencies;mType;get dependencies(){return this.mPatternDependencies}get dependenciesResolved(){return this.mDependencyFetchResolved}get lexer(){return this.mLexer}get meta(){return this.mMeta}get pattern(){return this.mPattern}constructor(t,e){if(this.mLexer=t,this.mType=e.type,this.mMeta=e.metadata,this.mPatternDependencies=new Array,this.mDependencyFetch=e.dependencyFetch??null,this.mDependencyFetchResolved=!e.dependencyFetch,this.mType==="split"&&!this.mDependencyFetch)throw new _("Split token with a start and end token, need inner token definitions.",this);if(this.mType==="single"&&this.mDependencyFetch)throw new _("Pattern does not allow inner token pattern.",this);this.mPattern=this.convertTokenPattern(this.mType,e.pattern)}isSplit(){return this.mType==="split"}resolveDependencies(){this.mDependencyFetchResolved||(this.mDependencyFetch(this),this.mDependencyFetchResolved=!0)}useChildPattern(t){if(this.mLexer!==t.lexer)throw new _("Can only add dependencies of the same lexer.",this);this.mPatternDependencies.push(t)}convertTokenPattern(t,e){if("single"in e){if(t==="split")throw new _("Can't use split pattern type with single pattern definition.",this);return{start:{regex:e.single.regex,types:e.single.types,validator:e.single.validator??null}}}else{if(t==="single")throw new _("Can't use single pattern type with split pattern definition.",this);return{start:{regex:e.start.regex,types:e.start.types,validator:e.start.validator??null},end:{regex:e.end.regex,types:e.end.types,validator:e.end.validator??null},innerType:e.innerType??null}}}};var oe=class{mColumnNumber;mLineNumber;mMetas;mType;mValue;get columnNumber(){return this.mColumnNumber}get lineNumber(){return this.mLineNumber}get metas(){return[...this.mMetas]}get type(){return this.mType}get value(){return this.mValue}constructor(t,e,r,c){this.mValue=e,this.mColumnNumber=r,this.mLineNumber=c,this.mType=t,this.mMetas=new Set}addMeta(...t){for(let e of t)this.mMetas.add(e)}hasMeta(t){return this.mMetas.has(t)}};var we=class{mRootPattern;mSettings;get errorType(){return this.mSettings.errorType}set errorType(t){this.mSettings.errorType=t}get trimWhitespace(){return this.mSettings.trimSpaces}set trimWhitespace(t){this.mSettings.trimSpaces=t}get validWhitespaces(){return[...this.mSettings.whiteSpaces].join("")}set validWhitespaces(t){this.mSettings.whiteSpaces=new Set(t.split(""))}constructor(){this.mSettings={errorType:null,trimSpaces:!0,whiteSpaces:new Set},this.mRootPattern=new ee(this,{type:"single",pattern:{single:{regex:/^/,types:{},validator:null}},metadata:[],dependencyFetch:null})}createTokenPattern(t,e){let r=y=>typeof y=="string"?{token:y}:y,c=y=>{let x=new Set(y.flags.split(""));return new RegExp(`^(?<token>${y.source})`,[...x].join(""))},m=new Array;t.meta&&(typeof t.meta=="string"?m.push(t.meta):m.push(...t.meta));let f;return"regex"in t.pattern?f={single:{regex:c(t.pattern.regex),types:r(t.pattern.type),validator:t.pattern.validator??null}}:f={start:{regex:c(t.pattern.start.regex),types:r(t.pattern.start.type),validator:t.pattern.start.validator??null},end:{regex:c(t.pattern.end.regex),types:r(t.pattern.end.type),validator:t.pattern.end.validator??null},innerType:t.pattern.innerType??null},new ee(this,{type:"regex"in t.pattern?"single":"split",pattern:f,metadata:m,dependencyFetch:e??null})}*tokenize(t,e){let r={data:t,cursor:{position:0,column:1,line:1},error:null,progressTracker:e??null};yield*this.tokenizeRecursionLayer(r,this.mRootPattern,new Array,null)}useRootTokenPattern(t){if(t.lexer!==this)throw new _("Token pattern must be created by this lexer.",this);this.mRootPattern.useChildPattern(t)}findNextStartToken(t,e,r,c){for(let m of e){let f=m.pattern.start,y=this.matchToken(m,f,t,r,c);if(y!==null)return{pattern:m,token:y}}return null}findTokenTypeOfMatch(t,e,r){for(let f in t.groups){let y=t.groups[f],x=e[f];if(!(!y||!x)){if(y.length!==t[0].length)throw new _("A group of a token pattern must match the whole token.",this);return x}}let c=new Array;for(let f in t.groups)t.groups[f]&&c.push(f);let m=new Array;for(let f in e)m.push(f);throw new _(`No token type found for any defined pattern regex group. Full: "${t[0]}", Matches: "${c.join(", ")}", Available: "${m.join(", ")}", Regex: "${r.source}"`,this)}*generateErrorToken(t,e){if(!t.error||!this.mSettings.errorType)return;let r=new oe(this.mSettings.errorType,t.error.data,t.error.startColumn,t.error.startLine);r.addMeta(...e),t.error=null,yield r}generateToken(t,e,r,c,m,f){let y=r[0],x=this.findTokenTypeOfMatch(r,c,f),C=new oe(m??x,y,t.cursor.column,t.cursor.line);return C.addMeta(...e),C}matchToken(t,e,r,c,m){let f=e.regex;f.lastIndex=0;let y=f.exec(r.data);if(!y||y.index!==0)return null;let x=this.generateToken(r,[...c,...t.meta],y,e.types,m,f);if(e.validator){let C=r.data.substring(x.value.length);if(!e.validator(x,C,r.cursor.position))return null}return this.moveCursor(r,x.value),x}moveCursor(t,e){let r=e.split(`
`);r.length>1&&(t.cursor.column=1),t.cursor.line+=r.length-1,t.cursor.column+=r.at(-1).length,t.cursor.position+=e.length,t.data=t.data.substring(e.length),this.trackProgress(t)}pushNextCharToErrorState(t){if(!this.mSettings.errorType)throw new Zt(`Unable to parse next token. No valid pattern found for "${t.data.substring(0,20)}".`,this,t.cursor.column,t.cursor.line,t.cursor.column,t.cursor.line);t.error||(t.error={data:"",startColumn:t.cursor.column,startLine:t.cursor.line});let e=t.data.charAt(0);t.error.data+=e,this.moveCursor(t,e)}skipNextWhitespace(t){let e=t.data.charAt(0);return!this.mSettings.trimSpaces||!this.mSettings.whiteSpaces.has(e)?!1:(this.moveCursor(t,e),!0)}*tokenizeRecursionLayer(t,e,r,c){let m=e.dependencies;for(;t.data.length>0;){if(!t.error&&this.skipNextWhitespace(t))continue;if(e.isSplit()){let x=this.matchToken(e,e.pattern.end,t,r,c);if(x!==null){yield*this.generateErrorToken(t,r),yield x;return}}let f=this.findNextStartToken(t,m,r,c);if(!f){this.pushNextCharToErrorState(t);continue}yield*this.generateErrorToken(t,r),yield f.token;let y=f.pattern;y.isSplit()&&(y.resolveDependencies(),yield*this.tokenizeRecursionLayer(t,y,[...r,...y.meta],c??y.pattern.innerType))}yield*this.generateErrorToken(t,r)}trackProgress(t){t.progressTracker!==null&&t.progressTracker(t.cursor.position,t.cursor.line,t.cursor.column)}};var J=class extends Error{static PARSER_ERROR=Symbol("PARSER_ERROR");mTrace;get columnEnd(){return this.mTrace.top.range.columnEnd}get columnStart(){return this.mTrace.top.range.columnStart}get graph(){return this.mTrace.top.graph}get incidents(){return this.mTrace.incidents}get lineEnd(){return this.mTrace.top.range.lineEnd}get lineStart(){return this.mTrace.top.range.lineStart}constructor(t){super(t.top.message,{cause:t.top.cause}),this.mTrace=t}};var Ge=class{mIncidents;mTop;get incidents(){if(this.mIncidents===null)throw new _("A complete incident list is only available on debug mode.",this);return this.mIncidents}get top(){return this.mTop}constructor(t){this.mTop={message:"Unknown parser error",priority:0,graph:null,range:{lineStart:1,columnStart:1,lineEnd:1,columnEnd:1},cause:null},t?this.mIncidents=new Array:this.mIncidents=null}push(t,e,r,c,m,f,y=!1,x=null){let C;if(y?C=this.mTop.priority+1:C=m*1e4+f,this.mIncidents!==null){let a={message:t,priority:C,graph:e,range:{lineStart:r,columnStart:c,lineEnd:m,columnEnd:f},cause:x};this.mIncidents.push(a)}this.mTop&&C<this.mTop.priority||this.setTop({message:t,priority:C,graph:e,range:{lineStart:r,columnStart:c,lineEnd:m,columnEnd:f},cause:x})}setTop(t){this.mTop=t}};var Be=class v{static MAX_JUNCTION_CIRCULAR_REFERENCES=1e3;mGraphStack;mIncidentTrace;mLastTokenPosition;mProcessStack;mTokenCache;mTokenGenerator;mTrimTokenCache;get currentGraph(){return this.mGraphStack.top.graph}get currentToken(){let t=this.mGraphStack.top;return this.mTokenCache[t.token.cursor]}get incidentTrace(){return this.mIncidentTrace}get processStack(){return this.mProcessStack}constructor(t,e,r){this.mTokenGenerator=t,this.mGraphStack=new zt,this.mLastTokenPosition={column:1,line:1},this.mTokenCache=new Array,this.mProcessStack=new zt,this.mTrimTokenCache=r,this.mIncidentTrace=new Ge(e),this.mGraphStack.push({graph:null,linear:!0,circularGraphs:new rt,token:{start:0,cursor:-1}})}collapse(){let t=this.mGraphStack.top,e=this.mTokenCache.slice(t.token.cursor);e.length!==0&&e.at(-1)===null&&e.pop();for(let r of this.mTokenGenerator)e.push(r);return e}getGraphBoundingToken(){let t=this.mGraphStack.top,e=this.mTokenCache[t.token.start],r=this.mTokenCache[t.token.cursor-1];return e??=r,r??=e,[e??null,r??null]}getGraphPosition(){let t=this.mGraphStack.top,e,r;if(e=this.mTokenCache[t.token.start],r=this.mTokenCache[t.token.cursor-1],e??=r,r??=e,!e||!r)return{graph:t.graph,columnEnd:this.mLastTokenPosition.column,columnStart:this.mLastTokenPosition.column,lineEnd:this.mLastTokenPosition.line,lineStart:this.mLastTokenPosition.line};let c,m;if(r.value.includes(`
`)){let f=r.value.split(`
`);m=r.lineNumber+f.length-1,c=1+f[f.length-1].length}else c=r.columnNumber+r.value.length,m=r.lineNumber;return{graph:t.graph,lineStart:e.lineNumber,columnStart:e.columnNumber,lineEnd:m,columnEnd:c}}getTokenPosition(){let t=this.mGraphStack.top,e=this.currentToken;if(!e)return{graph:t.graph,columnEnd:this.mLastTokenPosition.column,columnStart:this.mLastTokenPosition.column,lineEnd:this.mLastTokenPosition.line,lineStart:this.mLastTokenPosition.line};let r,c;if(e.value.includes(`
`)){let m=e.value.split(`
`);c=e.lineNumber+m.length-1,r=1+m[m.length-1].length}else r=e.columnNumber+e.value.length,c=e.lineNumber;return{graph:t.graph,lineStart:e.lineNumber,columnStart:e.columnNumber,lineEnd:c,columnEnd:r}}graphIsCircular(t){let e=this.mGraphStack.top;if(!e.circularGraphs.has(t))return!1;if(t.isJunction){if(e.circularGraphs.get(t)>v.MAX_JUNCTION_CIRCULAR_REFERENCES)throw new _("Junction graph called circular too often.",this);return!1}return!0}moveNextToken(){let t=this.mGraphStack.top;if(t.circularGraphs.size>0&&(t.circularGraphs=new rt),t.graph&&t.graph.isJunction)throw new _("Junction graph must not have own nodes.",this);if(t.token.cursor++,t.token.cursor<this.mTokenCache.length)return;let e=this.mTokenGenerator.next();if(e.done){this.mTokenCache.push(null);return}this.mLastTokenPosition.column=e.value.columnNumber,this.mLastTokenPosition.line=e.value.lineNumber,this.mTokenCache.push(e.value)}popGraphStack(t){let e=this.mGraphStack.pop(),r=this.mGraphStack.top;if(t&&(e.token.cursor=e.token.start),e.token.cursor!==e.token.start&&r.circularGraphs.size>0&&(r.circularGraphs=new rt),!this.mTrimTokenCache){r.token.cursor=e.token.cursor;return}e.linear?(this.mTokenCache.splice(0,e.token.cursor),r.token.start=0,r.token.cursor=0):r.token.cursor=e.token.cursor}pushGraphStack(t,e){let r=this.mGraphStack.top,c={graph:t,linear:e&&r.linear,circularGraphs:new rt(r.circularGraphs),token:{start:r.token.cursor,cursor:r.token.cursor}},m=c.circularGraphs.get(t)??0;c.circularGraphs.set(t,m+1),this.mGraphStack.push(c)}};var xe=class v{static NODE_NULL_RESULT=Symbol("FAILED_NODE_VALUE_PARSE");static NODE_VALUE_LIST_END_MEET=Symbol("FAILED_NODE_VALUE_PARSE");mConfiguration;mLexer;mRootPart;get lexer(){return this.mLexer}constructor(t,e){this.mLexer=t,this.mRootPart=null,this.mConfiguration={keepTraceIncidents:!1,trimTokenCache:!1,...e}}parse(t,e){if(this.mRootPart===null)throw new _("Parser has not root part set.",this);let r=new Be(this.mLexer.tokenize(t,e),this.mConfiguration.keepTraceIncidents,this.mConfiguration.trimTokenCache),c=(()=>{try{return this.beginParseProcess(r,this.mRootPart)}catch(f){if(f instanceof Zt)return r.incidentTrace.push(f.message,r.currentGraph,f.lineStart,f.columnStart,f.lineEnd,f.columnEnd,!0,f),J.PARSER_ERROR;let y=f instanceof Error?f.message:f.toString(),x=r.getGraphPosition();return r.incidentTrace.push(y,r.currentGraph,x.lineStart,x.columnStart,x.lineEnd,x.columnEnd,!0,f),J.PARSER_ERROR}})();if(c===J.PARSER_ERROR)throw new J(r.incidentTrace);let m=r.collapse();if(m.length!==0){let f=m[0];if(r.incidentTrace.top.range.lineEnd===1&&r.incidentTrace.top.range.columnEnd===1){let y=`Tokens could not be parsed. Graph end meet without reaching last token. Current: "${f.value}" (${f.type})`;r.incidentTrace.push(y,this.mRootPart,f.lineNumber,f.columnNumber,f.lineNumber,f.columnNumber)}throw new J(r.incidentTrace)}return c}setRootGraph(t){this.mRootPart=t}beginParseProcess(t,e){t.moveNextToken(),t.processStack.push({type:"graph-parse",parameter:{graph:e,linear:!0},state:0});let r=v.NODE_NULL_RESULT;for(;t.processStack.top;)r=this.processStack(t,t.processStack.top,r);return r}processChainedNodeParseProcess(t,e,r){switch(e.state){case 0:{let f=e.parameter.node.connections.next;return f===null?(t.processStack.pop(),{}):(e.state++,t.processStack.push({type:"node-parse",parameter:{node:f},state:0,values:{}}),v.NODE_NULL_RESULT)}case 1:{let c=r;return c===J.PARSER_ERROR?(t.processStack.pop(),J.PARSER_ERROR):(t.processStack.pop(),c)}}throw new _(`Invalid node next parse state "${e.state}".`,this)}processGraphParseProcess(t,e,r){let c=e.parameter.graph;switch(e.state){case 0:{if(t.graphIsCircular(c)){let f=t.getGraphPosition();return t.incidentTrace.push("Circular graph detected.",c,f.lineStart,f.columnStart,f.lineEnd,f.columnEnd),t.processStack.pop(),J.PARSER_ERROR}let m=e.parameter.linear;return t.pushGraphStack(c,m),e.state++,t.processStack.push({type:"node-parse",parameter:{node:c.node},state:0,values:{}}),v.NODE_NULL_RESULT}case 1:{let m=r;if(m===J.PARSER_ERROR)return t.popGraphStack(!0),t.processStack.pop(),J.PARSER_ERROR;let f=c.convert(m,t);if(typeof f=="symbol"){let y=t.getGraphPosition();return t.incidentTrace.push(f.description??"Unknown data convert error",y.graph,y.lineStart,y.columnStart,y.lineEnd,y.columnEnd),t.popGraphStack(!0),t.processStack.pop(),J.PARSER_ERROR}return t.popGraphStack(!1),t.processStack.pop(),f}}throw new _(`Invalid graph parse state "${e.state}".`,this)}processNodeParseProcess(t,e,r){let c=e.parameter.node;switch(e.state){case 0:return t.processStack.push({type:"node-value-parse",parameter:{node:c,valueIndex:0},state:0,values:{}}),e.state++,v.NODE_NULL_RESULT;case 1:{let m=r;return m===J.PARSER_ERROR?(t.processStack.pop(),J.PARSER_ERROR):(e.values.nodeValueResult=m,t.processStack.push({type:"node-next-parse",parameter:{node:c},state:0}),e.state++,v.NODE_NULL_RESULT)}case 2:{let m=r;if(m===J.PARSER_ERROR)return t.processStack.pop(),J.PARSER_ERROR;let f=c.mergeData(e.values.nodeValueResult,m);return t.processStack.pop(),f}}throw new _(`Invalid node parse state "${e.state}".`,this)}processNodeValueParseProcess(t,e,r){let c=e.parameter.node;switch(e.state){case 0:{if(r!==v.NODE_NULL_RESULT&&r!==J.PARSER_ERROR)return e.values.parseResult=r,e.state++,v.NODE_NULL_RESULT;let m=e.parameter.valueIndex,f=c.connections;if(m>=f.values.length)return e.values.parseResult=v.NODE_VALUE_LIST_END_MEET,e.state++,v.NODE_NULL_RESULT;e.parameter.valueIndex++;let y=t.currentToken,x=f.values[m];if(typeof x=="string"){if(!y){if(f.required){let C=t.getTokenPosition();t.incidentTrace.push(`Unexpected end of statement. Token "${x}" expected.`,t.currentGraph,C.lineStart,C.columnStart,C.lineEnd,C.columnEnd)}return v.NODE_NULL_RESULT}if(x!==y.type){if(f.required){let C=t.getTokenPosition();t.incidentTrace.push(`Unexpected token "${y.value}". "${x}" expected`,t.currentGraph,C.lineStart,C.columnStart,C.lineEnd,C.columnEnd)}return v.NODE_NULL_RESULT}return t.moveNextToken(),y.value}else{let C=f.values.length===1||f.values.length===m+1;return t.processStack.push({type:"graph-parse",parameter:{graph:x,linear:C},state:0}),v.NODE_NULL_RESULT}}case 1:{let m=e.values.parseResult,f=c.connections;if(m===v.NODE_VALUE_LIST_END_MEET&&!f.required){t.processStack.pop();return}return m===v.NODE_VALUE_LIST_END_MEET?(t.processStack.pop(),J.PARSER_ERROR):(t.processStack.pop(),m)}}throw new _(`Invalid node value parse state "${e.state}".`,this)}processStack(t,e,r){switch(e.type){case"graph-parse":return this.processGraphParseProcess(t,e,r);case"node-parse":return this.processNodeParseProcess(t,e,r);case"node-value-parse":return this.processNodeValueParseProcess(t,e,r);case"node-next-parse":return this.processChainedNodeParseProcess(t,e,r)}}};var et=class v{static define(t,e=!1){return new v(t,e)}mDataConverterList;mGraphCollector;mIsJunction;mResolvedGraphNode;get isJunction(){return this.mIsJunction}get node(){return this.mResolvedGraphNode||(this.mResolvedGraphNode=this.mGraphCollector().root),this.mResolvedGraphNode}constructor(t,e){this.mGraphCollector=t,this.mDataConverterList=new Array,this.mResolvedGraphNode=null,this.mIsJunction=e}convert(t,e){if(this.mDataConverterList.length===0)return t;let r=e.getGraphBoundingToken(),c=r[0]??void 0,m=r[1]??void 0;if(this.mDataConverterList.length===1)return this.mDataConverterList[0](t,c,m);let f=t;for(let y of this.mDataConverterList)if(f=y(f,c,m),typeof f=="symbol")return f;return f}converter(t){let e=new v(this.mGraphCollector,this.isJunction);return e.mDataConverterList.push(...this.mDataConverterList,t),e}};var U=class v{static new(){let t=new v("",!1,[]);return t.mRootNode=null,t}mConnections;mIdentifier;mRootNode;get configuration(){return{dataKey:this.mIdentifier.dataKey,isList:this.mIdentifier.type==="list",isRequired:this.mConnections.required,isBranch:this.mConnections.values.length>1}}get connections(){return this.mConnections}get root(){if(!this.mRootNode)throw new _("Staring nodes must be chained with another node to be used.",this);return this.mRootNode}constructor(t,e,r,c){if(t==="")this.mIdentifier={type:"empty",dataKey:"",mergeKey:""};else if(t.endsWith("[]"))this.mIdentifier={type:"list",mergeKey:"",dataKey:t.substring(0,t.length-2)};else if(t.includes("<-")){let f=t.split("<-");this.mIdentifier={type:"merge",dataKey:f[0],mergeKey:f[1]}}else this.mIdentifier={type:"single",mergeKey:"",dataKey:t};let m=r.map(f=>f instanceof v?et.define(()=>f):f);this.mConnections={required:e,values:m,next:null},c?this.mRootNode=c:this.mRootNode=this}mergeData(t,e){if(this.mIdentifier.type==="empty")return e;let r=e,c=typeof t>"u";if(this.mIdentifier.type==="single"){if(this.mIdentifier.dataKey in e)throw new _(`Graph path has a duplicate value identifier "${this.mIdentifier.dataKey}"`,this);return c||(r[this.mIdentifier.dataKey]=t),e}if(this.mIdentifier.type==="list"){let y;c?y=new Array:Array.isArray(t)?y=t:y=[t];let x=(()=>{if(this.mIdentifier.dataKey in e){let C=r[this.mIdentifier.dataKey];return Array.isArray(C)?(C.unshift(...y),C):(y.push(C),y)}return y})();return r[this.mIdentifier.dataKey]=x,e}if(c)return e;let m=(()=>{if(!this.mIdentifier.mergeKey)throw new _("Cant merge data without a merge key.",this);if(typeof t!="object"||t===null)throw new _("Node data must be an object when merge key is set.",this);if(!(this.mIdentifier.mergeKey in t))throw new _(`Node data does not contain merge key "${this.mIdentifier.mergeKey}"`,this);return t[this.mIdentifier.mergeKey]})();if(typeof m>"u")return e;let f=r[this.mIdentifier.dataKey];if(typeof f>"u")return r[this.mIdentifier.dataKey]=m,r;if(!Array.isArray(f))throw new _("Chain data merge value is not an array but should be.",this);return Array.isArray(m)?f.unshift(...m):f.unshift(m),e}optional(t,e){let r=typeof e>"u"?"":t,c=typeof e>"u"?t:e,m=new Array;Array.isArray(c)?m.push(...c):m.push(c);let f=new v(r,!1,m,this.mRootNode);return this.setChainedNode(f),f}required(t,e){let r=typeof e>"u"?"":t,c=typeof e>"u"?t:e,m=new Array;Array.isArray(c)?m.push(...c):m.push(c);let f=new v(r,!0,m,this.mRootNode);return this.setChainedNode(f),f}setChainedNode(t){if(this.mConnections.next!==null)throw new _("Node can only be chained to a single node.",this);this.mConnections.next=t}};var z={XmlIdentifier:"Identifier",XmlAssignment:"XmlAssignment",XmlValue:"XmlValue",XmlComment:"XmlComment",XmlOpenClosingBracket:"XmlOpenClosingBracket",XmlCloseBracket:"XmlCloseBracket",XmlOpenBracket:"XmlOpenBracket",XmlCloseClosingBracket:"XmlCloseClosingBracket",XmlExplicitValueIdentifier:"XmlExplicitValueIdentifier",ExpressionStart:"ExpressionStart",ExpressionEnd:"ExpressionEnd",ExpressionValue:"ExpressionValue",InstructionStart:"InstructionStart",InstructionInstructionValue:"InstructionInstructionValue",InstructionBodyStartBraket:"InstructionBodyStartBraket",InstructionBodyCloseBraket:"InstructionBodyCloseBraket",InstructionInstructionClosingBracket:"InstructionInstructionClosingBracket",InstructionInstructionOpeningBracket:"InstructionInstructionOpeningBracket"};var Ue=class extends we{constructor(){super(),this.validWhitespaces=` 
\r`,this.trimWhitespace=!0;let t=this.createTokenPattern({pattern:{regex:/(?:(?!}}).)*/,type:z.ExpressionValue}}),e=this.createTokenPattern({pattern:{start:{regex:/{{/,type:z.ExpressionStart},end:{regex:/}}[ \n\r]?/,type:z.ExpressionEnd}}},s=>{s.useChildPattern(t)}),r=this.createTokenPattern({pattern:{regex:/[^>\s\n="/]+/,type:z.XmlIdentifier}}),c=this.createTokenPattern({pattern:{regex:/(?:(?!{{|"|<).)+/,type:z.XmlValue}}),m=this.createTokenPattern({pattern:{regex:/<!--.*?-->/,type:z.XmlComment}}),f=this.createTokenPattern({pattern:{regex:/=/,type:z.XmlAssignment}}),y=this.createTokenPattern({pattern:{start:{regex:/"/,type:z.XmlExplicitValueIdentifier},end:{regex:/"/,type:z.XmlExplicitValueIdentifier}}},s=>{s.useChildPattern(e),s.useChildPattern(c)}),x=this.createTokenPattern({pattern:{start:{regex:/<\//,type:z.XmlOpenClosingBracket},end:{regex:/>/,type:z.XmlCloseBracket}}},s=>{s.useChildPattern(r)}),C=this.createTokenPattern({pattern:{start:{regex:/</,type:z.XmlOpenBracket},end:{regex:/(?<closeClosingBracket>\/>)|(?<closeBracket>>)/,type:{closeClosingBracket:z.XmlCloseClosingBracket,closeBracket:z.XmlCloseBracket}}}},s=>{s.useChildPattern(f),s.useChildPattern(r),s.useChildPattern(y)}),a=this.createTokenPattern({pattern:{regex:/[^()"'`/)]+/,type:z.InstructionInstructionValue}}),n=this.createTokenPattern({pattern:{innerType:z.InstructionInstructionValue,start:{regex:/\//,type:z.InstructionInstructionValue},end:{regex:/\//,type:z.InstructionInstructionValue}}},s=>{s.useChildPattern(l),s.useChildPattern(o),s.useChildPattern(b),s.useChildPattern(u),s.useChildPattern(a)}),u=this.createTokenPattern({pattern:{innerType:z.InstructionInstructionValue,start:{regex:/\(/,type:z.InstructionInstructionValue},end:{regex:/\)/,type:z.InstructionInstructionValue}}},s=>{s.useChildPattern(n),s.useChildPattern(l),s.useChildPattern(o),s.useChildPattern(b),s.useChildPattern(a)}),l=this.createTokenPattern({pattern:{innerType:z.InstructionInstructionValue,start:{regex:/"/,type:z.InstructionInstructionValue},end:{regex:/"/,type:z.InstructionInstructionValue}}},s=>{s.useChildPattern(n),s.useChildPattern(o),s.useChildPattern(b),s.useChildPattern(u),s.useChildPattern(a)}),o=this.createTokenPattern({pattern:{innerType:z.InstructionInstructionValue,start:{regex:/'/,type:z.InstructionInstructionValue},end:{regex:/'/,type:z.InstructionInstructionValue}}},s=>{s.useChildPattern(n),s.useChildPattern(l),s.useChildPattern(b),s.useChildPattern(u),s.useChildPattern(a)}),b=this.createTokenPattern({pattern:{innerType:z.InstructionInstructionValue,start:{regex:/`/,type:z.InstructionInstructionValue},end:{regex:/`/,type:z.InstructionInstructionValue}}},s=>{s.useChildPattern(n),s.useChildPattern(l),s.useChildPattern(o),s.useChildPattern(u),s.useChildPattern(a)}),g=this.createTokenPattern({pattern:{regex:/\$[^(\s\n/{]+/,type:z.InstructionStart}}),D=this.createTokenPattern({pattern:{start:{regex:/\(/,type:z.InstructionInstructionOpeningBracket},end:{regex:/\)/,type:z.InstructionInstructionClosingBracket}}},s=>{s.useChildPattern(n),s.useChildPattern(l),s.useChildPattern(o),s.useChildPattern(b),s.useChildPattern(u),s.useChildPattern(a)}),w=this.createTokenPattern({pattern:{start:{regex:/{/,type:z.InstructionBodyStartBraket},end:{regex:/}/,type:z.InstructionBodyCloseBraket}}},s=>{for(let d of p)s.useChildPattern(d)}),p=[m,x,C,y,e,g,D,w,c];for(let s of p)this.useRootTokenPattern(s)}};var Te=class extends xe{constructor(){super(new Ue),this.initGraph()}initGraph(){let t=et.define(()=>U.new().required(z.ExpressionStart).optional("value",z.ExpressionValue).required("end",z.ExpressionEnd)).converter(o=>({expression:new At(o.value??""),hasTrailingWhitespace:o.end.length>2})),e=et.define(()=>{let o=e;return U.new().required("data[]",U.new().required("value",[t,U.new().required("text",z.XmlValue)])).optional("data<-data",o)}),r=et.define(()=>U.new().required("name",z.XmlIdentifier).optional("attributeValue",U.new().required(z.XmlAssignment).required(z.XmlExplicitValueIdentifier).optional("list<-data",e).required(z.XmlExplicitValueIdentifier))).converter(o=>{let b=new Array;if(o.attributeValue?.list)for(let g of o.attributeValue.list)"expression"in g.value?(b.push(g.value.expression),g.value.hasTrailingWhitespace&&b.push(" ")):b.push(g.value.text);return{name:o.name,values:b}}),c=et.define(()=>{let o=c;return U.new().required("data[]",r).optional("data<-data",o)}),m=et.define(()=>{let o=m;return U.new().required("data[]",U.new().required("value",[t,U.new().required("text",z.XmlValue),U.new().required(z.XmlExplicitValueIdentifier).required("text",z.XmlValue).required(z.XmlExplicitValueIdentifier)])).optional("data<-data",o)}),f=et.define(()=>U.new().required("list<-data",m)).converter(o=>{let b=new Lt;for(let g of o.list)"expression"in g.value?(b.addValue(g.value.expression),g.value.hasTrailingWhitespace&&b.addValue(" ")):b.addValue(g.value.text);return b}),y=et.define(()=>U.new().required(z.XmlComment)).converter(()=>null),x=et.define(()=>U.new().required(z.XmlOpenBracket).required("openingTagName",z.XmlIdentifier).optional("attributes<-data",c).required("closing",[U.new().required(z.XmlCloseClosingBracket),U.new().required(z.XmlCloseBracket).required("values",u).required(z.XmlOpenClosingBracket).required("closingTageName",z.XmlIdentifier).required(z.XmlCloseBracket)])).converter(o=>{if("closingTageName"in o.closing&&o.openingTagName!==o.closing.closingTageName)throw new _(`Opening (${o.openingTagName}) and closing tagname (${o.closing.closingTageName}) does not match`,this);let b=new Rt(o.openingTagName);if(o.attributes)for(let g of o.attributes)b.setAttribute(g.name).addValue(...g.values);return"values"in o.closing&&b.appendChild(...o.closing.values),b}),C=et.define(()=>{let o=C;return U.new().required("list[]",z.InstructionInstructionValue).optional("list<-list",o)}),a=et.define(()=>U.new().required("instructionName",z.InstructionStart).optional("instruction",U.new().required(z.InstructionInstructionOpeningBracket).required("value<-list",C).required(z.InstructionInstructionClosingBracket)).optional("body",U.new().required(z.InstructionBodyStartBraket).required("value",u).required(z.InstructionBodyCloseBraket))).converter(o=>{let b=o.instructionName.substring(1),g=o.instruction?.value.join("")??"",D=new Wt(b,g);return o.body&&D.appendChild(...o.body.value),D}),n=et.define(()=>{let o=n;return U.new().required("list[]",[y,x,a,f]).optional("list<-list",o)}),u=et.define(()=>{let o=n;return U.new().optional("list<-list",o)}).converter(o=>{let b=new Array;if(o.list)for(let g of o.list)g!==null&&b.push(g);return b}),l=et.define(()=>U.new().required("content",u)).converter(o=>{let b=new ut;return b.appendChild(...o.content),b});this.setRootGraph(l)}};var G=class v extends Fe{static mTemplateCache=new rt;static mXmlParser=new Te;mComponentElement;mIsUpdated;mRootBuilder;get element(){return this.mComponentElement.htmlElement}constructor(t){super({constructor:t.processorConstructor,parent:null}),Q.registerComponent(this,t.htmlElement),this.setProcessorInjection(v,this),this.addConstructionHook(c=>{Q.registerComponent(this,this.mComponentElement.htmlElement,c)}),v.mTemplateCache.has(t.processorConstructor)||v.mTemplateCache.set(t.processorConstructor,v.mXmlParser.parse(t.templateString??""));let e=v.mTemplateCache.get(t.processorConstructor).clone();this.mIsUpdated=!1,this.mComponentElement=new be(t.htmlElement),this.mRootBuilder=new te(e,new $e(this,t.expressionModule),new mt(this),"ROOT",null),this.mComponentElement.shadowRoot.appendChild(this.mRootBuilder.anchor),this.setProcessorInjection(Ct,new Ct(this.mRootBuilder.values));let r=this.updater.zone.getAttachment(It.ATTACHMENT_KEY);if(r)for(let[c,m]of r.injections)this.setProcessorInjection(c,m)}addStyle(t){let e=document.createElement("style");e.innerHTML=t,this.mComponentElement.shadowRoot.prepend(e)}attributeChanged(t,e,r){this.call("onAttributeChange",t,e,r)}connected(){this.mIsUpdated||this.updater.update(),this.call("onConnect")}deconstruct(){this.call("onDeconstruct"),this.mRootBuilder.deconstruct(),super.deconstruct()}disconnected(){this.call("onDisconnect")}onUpdate(){return this.mIsUpdated||(this.mIsUpdated=!0),this.mRootBuilder.update()?(this.call("onUpdate"),!0):!1}};function X(v){return(t,e)=>{O.registerInjectable(t,e.metadata,"instanced"),Q.registerConstructor(t,v.selector);let r=class extends HTMLElement{mComponent;constructor(){super(),this.mComponent=new G({processorConstructor:t,templateString:v.template??null,expressionModule:v.expressionmodule,htmlElement:this}).setup(),v.style&&this.mComponent.addStyle(v.style)}connectedCallback(){this.mComponent.connected()}disconnectedCallback(){this.mComponent.disconnected()}};globalThis.customElements.define(v.selector,r)}}function qt(v){return(t,e)=>{O.registerInjectable(t,e.metadata,"instanced"),ct.register($t,t,{access:v.access,targetRestrictions:v.targetRestrictions})}}function Dt(v){return(t,e)=>{O.registerInjectable(t,e.metadata,"instanced"),ct.register(Tt,t,{access:v.access,selector:v.selector})}}function Ot(v){return(t,e)=>{O.registerInjectable(t,e.metadata,"instanced"),ct.register(Xt,t,{instructionType:v.instructionType})}}function Rs(){function v(a,n){return function(l){e(n,"addInitializer"),r(l,"An initializer"),a.push(l)}}function t(a,n,u,l,o,b,g,D,w){var p;switch(o){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:g?"#"+n:n,static:b,private:g,metadata:D},d={v:!1};s.addInitializer=v(l,d);var i,h;o===0?g?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(T){this[n]=T}):o===2?i=function(){return u.value}:((o===1||o===3)&&(i=function(){return u.get.call(this)}),(o===1||o===4)&&(h=function(T){u.set.call(this,T)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return a(w,s)}finally{d.v=!0}}function e(a,n){if(a.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(a,n){if(typeof a!="function")throw new TypeError(n+" must be a function")}function c(a,n){var u=typeof n;if(a===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(u!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function m(a,n,u,l,o,b,g,D,w){var p=u[0],s,d,i;g?o===0||o===1?s={get:u[3],set:u[4]}:o===3?s={get:u[3]}:o===4?s={set:u[3]}:s={value:u[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var h,T,P;if(typeof p=="function")h=t(p,l,s,D,o,b,g,w,i),h!==void 0&&(c(o,h),o===0?d=h:o===1?(d=h.init,T=h.get||i.get,P=h.set||i.set,i={get:T,set:P}):i=h);else for(var M=p.length-1;M>=0;M--){var S=p[M];if(h=t(S,l,s,D,o,b,g,w,i),h!==void 0){c(o,h);var N;o===0?N=h:o===1?(N=h.init,T=h.get||i.get,P=h.set||i.set,i={get:T,set:P}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(o===0||o===1){if(d===void 0)d=function(I,E){return E};else if(typeof d!="function"){var F=d;d=function(I,E){for(var A=E,L=0;L<F.length;L++)A=F[L].call(I,A);return A}}else{var j=d;d=function(I,E){return j.call(I,E)}}a.push(d)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),g?o===1?(a.push(function(I,E){return i.get.call(I,E)}),a.push(function(I,E){return i.set.call(I,E)})):o===2?a.push(i):a.push(function(I,E){return i.call(I,E)}):Object.defineProperty(n,l,s))}function f(a,n,u){for(var l=[],o,b,g=new Map,D=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,T,P;if(h?(T=a,s=s-5,b=b||[],P=b):(T=a.prototype,o=o||[],P=o),s!==0&&!i){var M=h?D:g,S=M.get(d)||0;if(S===!0||S===3&&s!==4||S===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!S&&s>2?M.set(d,s):M.set(d,!0)}m(l,T,p,d,s,h,i,P,u)}}return y(l,o),y(l,b),l}function y(a,n){n&&a.push(function(u){for(var l=0;l<n.length;l++)n[l].call(u);return u})}function x(a,n,u){if(n.length>0){for(var l=[],o=a,b=a.name,g=n.length-1;g>=0;g--){var D={v:!1};try{var w=n[g](o,{kind:"class",name:b,addInitializer:v(l,D),metadata:u})}finally{D.v=!0}w!==void 0&&(c(10,w),o=w)}return[C(o,u),function(){for(var p=0;p<l.length;p++)l[p].call(o)}]}}function C(a,n){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,l,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(b===void 0?null:b),D=f(n,u,g);return l.length||C(n,g),{e:D,get c(){return x(n,l,g)}}}}function zo(v,t,e,r){return(zo=Rs())(v,t,e,r)}function Os(v){return v}var jo,Fo,De;jo=qt({access:q.Read,targetRestrictions:[G]});new class extends Os{constructor(){super(De),Fo()}static{class v{static{({c:[De,Fo]}=zo(this,[],[jo]))}static METADATA_USER_EVENT_LISTENER_PROPERIES="pwb:user_event_listener_properties";mEventListenerList;mTargetElement;constructor(e=O.use(G)){let r=new Array,c=e.processorConstructor;do{let m=st.get(c).getMetadata(v.METADATA_USER_EVENT_LISTENER_PROPERIES);if(m)for(let f of m)r.push(f)}while(c=Object.getPrototypeOf(c));this.mEventListenerList=new Array,this.mTargetElement=e.element;for(let m of r){let[f,y]=m,x=Reflect.get(e.processor,f);x=x.bind(e.processor),this.mEventListenerList.push([y,x]),this.mTargetElement.addEventListener(y,x)}}onDeconstruct(){for(let e of this.mEventListenerList){let[r,c]=e;this.mTargetElement.removeEventListener(r,c)}}}}};var Ee=class extends window.Event{mValue;get value(){return this.mValue}constructor(t,e){super(t),this.mValue=e}};var Ie=class{mElement;mEventName;constructor(t,e){this.mEventName=t,this.mElement=e}dispatchEvent(t){let e=new Ee(this.mEventName,t);this.mElement.dispatchEvent(e)}};function ft(v){return(t,e)=>{if(e.static)throw new _("Event target is not for a static property.",ft);let r=new WeakMap;return{get(){if(!r.has(this)){let c=(()=>{try{return Q.ofProcessor(this).component}catch{throw new _("PwbComponentEvent target class is not a component.",this)}})();r.set(this,new Ie(v,c.element))}return r.get(this)}}}}function Fs(){function v(a,n){return function(l){e(n,"addInitializer"),r(l,"An initializer"),a.push(l)}}function t(a,n,u,l,o,b,g,D,w){var p;switch(o){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:g?"#"+n:n,static:b,private:g,metadata:D},d={v:!1};s.addInitializer=v(l,d);var i,h;o===0?g?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(T){this[n]=T}):o===2?i=function(){return u.value}:((o===1||o===3)&&(i=function(){return u.get.call(this)}),(o===1||o===4)&&(h=function(T){u.set.call(this,T)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return a(w,s)}finally{d.v=!0}}function e(a,n){if(a.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(a,n){if(typeof a!="function")throw new TypeError(n+" must be a function")}function c(a,n){var u=typeof n;if(a===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(u!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function m(a,n,u,l,o,b,g,D,w){var p=u[0],s,d,i;g?o===0||o===1?s={get:u[3],set:u[4]}:o===3?s={get:u[3]}:o===4?s={set:u[3]}:s={value:u[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var h,T,P;if(typeof p=="function")h=t(p,l,s,D,o,b,g,w,i),h!==void 0&&(c(o,h),o===0?d=h:o===1?(d=h.init,T=h.get||i.get,P=h.set||i.set,i={get:T,set:P}):i=h);else for(var M=p.length-1;M>=0;M--){var S=p[M];if(h=t(S,l,s,D,o,b,g,w,i),h!==void 0){c(o,h);var N;o===0?N=h:o===1?(N=h.init,T=h.get||i.get,P=h.set||i.set,i={get:T,set:P}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(o===0||o===1){if(d===void 0)d=function(I,E){return E};else if(typeof d!="function"){var F=d;d=function(I,E){for(var A=E,L=0;L<F.length;L++)A=F[L].call(I,A);return A}}else{var j=d;d=function(I,E){return j.call(I,E)}}a.push(d)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),g?o===1?(a.push(function(I,E){return i.get.call(I,E)}),a.push(function(I,E){return i.set.call(I,E)})):o===2?a.push(i):a.push(function(I,E){return i.call(I,E)}):Object.defineProperty(n,l,s))}function f(a,n,u){for(var l=[],o,b,g=new Map,D=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,T,P;if(h?(T=a,s=s-5,b=b||[],P=b):(T=a.prototype,o=o||[],P=o),s!==0&&!i){var M=h?D:g,S=M.get(d)||0;if(S===!0||S===3&&s!==4||S===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!S&&s>2?M.set(d,s):M.set(d,!0)}m(l,T,p,d,s,h,i,P,u)}}return y(l,o),y(l,b),l}function y(a,n){n&&a.push(function(u){for(var l=0;l<n.length;l++)n[l].call(u);return u})}function x(a,n,u){if(n.length>0){for(var l=[],o=a,b=a.name,g=n.length-1;g>=0;g--){var D={v:!1};try{var w=n[g](o,{kind:"class",name:b,addInitializer:v(l,D),metadata:u})}finally{D.v=!0}w!==void 0&&(c(10,w),o=w)}return[C(o,u),function(){for(var p=0;p<l.length;p++)l[p].call(o)}]}}function C(a,n){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,l,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(b===void 0?null:b),D=f(n,u,g);return l.length||C(n,g),{e:D,get c(){return x(n,l,g)}}}}function $o(v,t,e,r){return($o=Fs())(v,t,e,r)}function zs(v){return v}var Go,Vo,Ce;Go=qt({access:q.ReadWrite,targetRestrictions:[G]});new class extends zs{constructor(){super(Ce),Vo()}static{class v{static{({c:[Ce,Vo]}=$o(this,[],[Go]))}static METADATA_EXPORTED_PROPERTIES="pwb:exported_properties";mComponent;constructor(e=O.use(G)){this.mComponent=e;let r=new Ht,c=e.processorConstructor;do{let f=st.get(c).getMetadata(v.METADATA_EXPORTED_PROPERTIES);f&&r.push(...f)}while(c=Object.getPrototypeOf(c));let m=new Set(r);m.size>0&&this.connectExportedProperties(m)}connectExportedProperties(e){this.exportPropertyAsAttribute(e),this.patchHtmlAttributes(e)}exportPropertyAsAttribute(e){for(let r of e){let c={};c.enumerable=!0,c.configurable=!0,delete c.value,delete c.writable,c.set=m=>{Reflect.set(this.mComponent.processor,r,m)},c.get=()=>{let m=Reflect.get(this.mComponent.processor,r);return typeof m=="function"&&(m=m.bind(this.mComponent.processor)),m},Object.defineProperty(this.mComponent.element,r,c)}}patchHtmlAttributes(e){let r=this.mComponent.element.getAttribute;new MutationObserver(m=>{for(let f of m){let y=f.attributeName,x=r.call(this.mComponent.element,y);Reflect.set(this.mComponent.element,y,x),this.mComponent.attributeChanged(y,f.oldValue,x)}}).observe(this.mComponent.element,{attributeFilter:[...e],attributeOldValue:!0});for(let m of e)if(this.mComponent.element.hasAttribute(m)){let f=r.call(this.mComponent.element,m);this.mComponent.element.setAttribute(m,f)}this.mComponent.element.getAttribute=m=>e.has(m)?Reflect.get(this.mComponent.element,m):r.call(this.mComponent.element,m)}}}};function W(v,t){if(t.static)throw new _("Event target is not for a static property.",W);let e=st.forInternalDecorator(t.metadata),r=e.getMetadata(Ce.METADATA_EXPORTED_PROPERTIES)??new Array;r.push(t.name),e.setMetadata(Ce.METADATA_EXPORTED_PROPERTIES,r)}function gt(v){return(t,e)=>{if(e.static)throw new _("Child decorator is not for a static property.",gt);return{get(){let m=(()=>{try{return Q.ofProcessor(this).component}catch{throw new _("PwbChild target class is not a component.",this)}})().getProcessorInjection(Ct).data.store[v];return m instanceof Element?m:null}}}}function js(){function v(a,n){return function(l){e(n,"addInitializer"),r(l,"An initializer"),a.push(l)}}function t(a,n,u,l,o,b,g,D,w){var p;switch(o){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:g?"#"+n:n,static:b,private:g,metadata:D},d={v:!1};s.addInitializer=v(l,d);var i,h;o===0?g?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(T){this[n]=T}):o===2?i=function(){return u.value}:((o===1||o===3)&&(i=function(){return u.get.call(this)}),(o===1||o===4)&&(h=function(T){u.set.call(this,T)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return a(w,s)}finally{d.v=!0}}function e(a,n){if(a.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(a,n){if(typeof a!="function")throw new TypeError(n+" must be a function")}function c(a,n){var u=typeof n;if(a===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(u!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function m(a,n,u,l,o,b,g,D,w){var p=u[0],s,d,i;g?o===0||o===1?s={get:u[3],set:u[4]}:o===3?s={get:u[3]}:o===4?s={set:u[3]}:s={value:u[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var h,T,P;if(typeof p=="function")h=t(p,l,s,D,o,b,g,w,i),h!==void 0&&(c(o,h),o===0?d=h:o===1?(d=h.init,T=h.get||i.get,P=h.set||i.set,i={get:T,set:P}):i=h);else for(var M=p.length-1;M>=0;M--){var S=p[M];if(h=t(S,l,s,D,o,b,g,w,i),h!==void 0){c(o,h);var N;o===0?N=h:o===1?(N=h.init,T=h.get||i.get,P=h.set||i.set,i={get:T,set:P}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(o===0||o===1){if(d===void 0)d=function(I,E){return E};else if(typeof d!="function"){var F=d;d=function(I,E){for(var A=E,L=0;L<F.length;L++)A=F[L].call(I,A);return A}}else{var j=d;d=function(I,E){return j.call(I,E)}}a.push(d)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),g?o===1?(a.push(function(I,E){return i.get.call(I,E)}),a.push(function(I,E){return i.set.call(I,E)})):o===2?a.push(i):a.push(function(I,E){return i.call(I,E)}):Object.defineProperty(n,l,s))}function f(a,n,u){for(var l=[],o,b,g=new Map,D=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,T,P;if(h?(T=a,s=s-5,b=b||[],P=b):(T=a.prototype,o=o||[],P=o),s!==0&&!i){var M=h?D:g,S=M.get(d)||0;if(S===!0||S===3&&s!==4||S===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!S&&s>2?M.set(d,s):M.set(d,!0)}m(l,T,p,d,s,h,i,P,u)}}return y(l,o),y(l,b),l}function y(a,n){n&&a.push(function(u){for(var l=0;l<n.length;l++)n[l].call(u);return u})}function x(a,n,u){if(n.length>0){for(var l=[],o=a,b=a.name,g=n.length-1;g>=0;g--){var D={v:!1};try{var w=n[g](o,{kind:"class",name:b,addInitializer:v(l,D),metadata:u})}finally{D.v=!0}w!==void 0&&(c(10,w),o=w)}return[C(o,u),function(){for(var p=0;p<l.length;p++)l[p].call(o)}]}}function C(a,n){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,l,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(b===void 0?null:b),D=f(n,u,g);return l.length||C(n,g),{e:D,get c(){return x(n,l,g)}}}}function Xo(v,t,e,r){return(Xo=js())(v,t,e,r)}var Ho,Bo,Vs;Ho=Ot({instructionType:"dynamic-content"});var Uo=class{static{({c:[Vs,Bo]}=Xo(this,[],[Ho]))}constructor(t=O.use(ot),e=O.use(Y)){this.mModuleValues=e,this.mLastTemplate=null,this.mProcedure=this.mModuleValues.createExpressionProcedure(t.value)}mLastTemplate;mModuleValues;mProcedure;onUpdate(){let t=this.mProcedure.execute();if(!t||!(t instanceof ut))throw new _("Dynamic content method has a wrong result type.",this);if(this.mLastTemplate!==null&&this.mLastTemplate.equals(t))return null;let e=t.clone();this.mLastTemplate=e;let r=new ht;return r.addElement(e,new mt(this.mModuleValues.data),null),r}static{Bo()}};function $s(){function v(a,n){return function(l){e(n,"addInitializer"),r(l,"An initializer"),a.push(l)}}function t(a,n,u,l,o,b,g,D,w){var p;switch(o){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:g?"#"+n:n,static:b,private:g,metadata:D},d={v:!1};s.addInitializer=v(l,d);var i,h;o===0?g?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(T){this[n]=T}):o===2?i=function(){return u.value}:((o===1||o===3)&&(i=function(){return u.get.call(this)}),(o===1||o===4)&&(h=function(T){u.set.call(this,T)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return a(w,s)}finally{d.v=!0}}function e(a,n){if(a.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(a,n){if(typeof a!="function")throw new TypeError(n+" must be a function")}function c(a,n){var u=typeof n;if(a===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(u!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function m(a,n,u,l,o,b,g,D,w){var p=u[0],s,d,i;g?o===0||o===1?s={get:u[3],set:u[4]}:o===3?s={get:u[3]}:o===4?s={set:u[3]}:s={value:u[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var h,T,P;if(typeof p=="function")h=t(p,l,s,D,o,b,g,w,i),h!==void 0&&(c(o,h),o===0?d=h:o===1?(d=h.init,T=h.get||i.get,P=h.set||i.set,i={get:T,set:P}):i=h);else for(var M=p.length-1;M>=0;M--){var S=p[M];if(h=t(S,l,s,D,o,b,g,w,i),h!==void 0){c(o,h);var N;o===0?N=h:o===1?(N=h.init,T=h.get||i.get,P=h.set||i.set,i={get:T,set:P}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(o===0||o===1){if(d===void 0)d=function(I,E){return E};else if(typeof d!="function"){var F=d;d=function(I,E){for(var A=E,L=0;L<F.length;L++)A=F[L].call(I,A);return A}}else{var j=d;d=function(I,E){return j.call(I,E)}}a.push(d)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),g?o===1?(a.push(function(I,E){return i.get.call(I,E)}),a.push(function(I,E){return i.set.call(I,E)})):o===2?a.push(i):a.push(function(I,E){return i.call(I,E)}):Object.defineProperty(n,l,s))}function f(a,n,u){for(var l=[],o,b,g=new Map,D=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,T,P;if(h?(T=a,s=s-5,b=b||[],P=b):(T=a.prototype,o=o||[],P=o),s!==0&&!i){var M=h?D:g,S=M.get(d)||0;if(S===!0||S===3&&s!==4||S===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!S&&s>2?M.set(d,s):M.set(d,!0)}m(l,T,p,d,s,h,i,P,u)}}return y(l,o),y(l,b),l}function y(a,n){n&&a.push(function(u){for(var l=0;l<n.length;l++)n[l].call(u);return u})}function x(a,n,u){if(n.length>0){for(var l=[],o=a,b=a.name,g=n.length-1;g>=0;g--){var D={v:!1};try{var w=n[g](o,{kind:"class",name:b,addInitializer:v(l,D),metadata:u})}finally{D.v=!0}w!==void 0&&(c(10,w),o=w)}return[C(o,u),function(){for(var p=0;p<l.length;p++)l[p].call(o)}]}}function C(a,n){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,l,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(b===void 0?null:b),D=f(n,u,g);return l.length||C(n,g),{e:D,get c(){return x(n,l,g)}}}}function Zo(v,t,e,r){return(Zo=$s())(v,t,e,r)}var qo,Yo,Gs;qo=Dt({access:q.Write,selector:/^\([[\w\-$]+\)$/});var Wo=class{static{({c:[Gs,Yo]}=Zo(this,[],[qo]))}constructor(t=O.use(tt),e=O.use(Y),r=O.use(nt)){this.mTarget=t,this.mEventName=r.name.substring(1,r.name.length-1);let c=e.createExpressionProcedure(r.value,["$event"]);this.mListener=m=>{c.setTemporaryValue("$event",m),c.execute()},this.mTarget.addEventListener(this.mEventName,this.mListener)}mEventName;mListener;mTarget;onDeconstruct(){this.mTarget.removeEventListener(this.mEventName,this.mListener)}static{Yo()}};function Bs(){function v(a,n){return function(l){e(n,"addInitializer"),r(l,"An initializer"),a.push(l)}}function t(a,n,u,l,o,b,g,D,w){var p;switch(o){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:g?"#"+n:n,static:b,private:g,metadata:D},d={v:!1};s.addInitializer=v(l,d);var i,h;o===0?g?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(T){this[n]=T}):o===2?i=function(){return u.value}:((o===1||o===3)&&(i=function(){return u.get.call(this)}),(o===1||o===4)&&(h=function(T){u.set.call(this,T)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return a(w,s)}finally{d.v=!0}}function e(a,n){if(a.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(a,n){if(typeof a!="function")throw new TypeError(n+" must be a function")}function c(a,n){var u=typeof n;if(a===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(u!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function m(a,n,u,l,o,b,g,D,w){var p=u[0],s,d,i;g?o===0||o===1?s={get:u[3],set:u[4]}:o===3?s={get:u[3]}:o===4?s={set:u[3]}:s={value:u[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var h,T,P;if(typeof p=="function")h=t(p,l,s,D,o,b,g,w,i),h!==void 0&&(c(o,h),o===0?d=h:o===1?(d=h.init,T=h.get||i.get,P=h.set||i.set,i={get:T,set:P}):i=h);else for(var M=p.length-1;M>=0;M--){var S=p[M];if(h=t(S,l,s,D,o,b,g,w,i),h!==void 0){c(o,h);var N;o===0?N=h:o===1?(N=h.init,T=h.get||i.get,P=h.set||i.set,i={get:T,set:P}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(o===0||o===1){if(d===void 0)d=function(I,E){return E};else if(typeof d!="function"){var F=d;d=function(I,E){for(var A=E,L=0;L<F.length;L++)A=F[L].call(I,A);return A}}else{var j=d;d=function(I,E){return j.call(I,E)}}a.push(d)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),g?o===1?(a.push(function(I,E){return i.get.call(I,E)}),a.push(function(I,E){return i.set.call(I,E)})):o===2?a.push(i):a.push(function(I,E){return i.call(I,E)}):Object.defineProperty(n,l,s))}function f(a,n,u){for(var l=[],o,b,g=new Map,D=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,T,P;if(h?(T=a,s=s-5,b=b||[],P=b):(T=a.prototype,o=o||[],P=o),s!==0&&!i){var M=h?D:g,S=M.get(d)||0;if(S===!0||S===3&&s!==4||S===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!S&&s>2?M.set(d,s):M.set(d,!0)}m(l,T,p,d,s,h,i,P,u)}}return y(l,o),y(l,b),l}function y(a,n){n&&a.push(function(u){for(var l=0;l<n.length;l++)n[l].call(u);return u})}function x(a,n,u){if(n.length>0){for(var l=[],o=a,b=a.name,g=n.length-1;g>=0;g--){var D={v:!1};try{var w=n[g](o,{kind:"class",name:b,addInitializer:v(l,D),metadata:u})}finally{D.v=!0}w!==void 0&&(c(10,w),o=w)}return[C(o,u),function(){for(var p=0;p<l.length;p++)l[p].call(o)}]}}function C(a,n){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,l,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(b===void 0?null:b),D=f(n,u,g);return l.length||C(n,g),{e:D,get c(){return x(n,l,g)}}}}function Qo(v,t,e,r){return(Qo=Bs())(v,t,e,r)}function Us(v){return v}var ko,Jo,Ko;ko=Ot({instructionType:"for"});new class extends Us{constructor(){super(Ko),Jo()}static{class v{static{({c:[Ko,Jo]}=Qo(this,[],[ko]))}static REGEX_HEAD=new RegExp(/^\s*([a-zA-Z]+[a-zA-Z0-9]*)\s*of\s+([^;]+)\s*(?:;(.*))?$/);static REGEX_MODIFIER_INSTRUCTION=new RegExp(/^\s*(\$?[a-zA-Z]+[a-zA-Z0-9]*)\s*=\s*(.+?)\s*$/);mExpression;mLastEntries;mModuleValues;mTemplate;constructor(e=O.use(pt),r=O.use(Y),c=O.use(ot)){this.mTemplate=e,this.mModuleValues=r,this.mLastEntries=new Array;let m=c.value,f=v.REGEX_HEAD.exec(m);if(!f)throw new _(`For-Parameter value has wrong format: ${m}`,this);let y=f[1],x=f[2],C=f[3]?f[3].split(";"):new Array,a=new Array;for(let n of C){let u=v.REGEX_MODIFIER_INSTRUCTION.exec(n);if(!u)throw new _(`For-Parameter optional instruction has wrong format: ${n}`,this);a.push({variableName:u[1],procedure:this.mModuleValues.createExpressionProcedure(u[2],["$index",y])})}this.mExpression={iterateVariableName:y,iterateValueProcedure:this.mModuleValues.createExpressionProcedure(x),modifier:a}}onUpdate(){let e=new ht,r=this.mExpression.iterateValueProcedure.execute();if(typeof r=="object"&&r!==null||Array.isArray(r)){let c=Symbol.iterator in r?Object.entries([...r]):Object.entries(r);if(this.compareEntries(c,this.mLastEntries))return null;this.mLastEntries=c;for(let[m,f]of c)this.addTemplateForElement(e,this.mExpression,f,m);return e}else return null}addTemplateForElement=(e,r,c,m)=>{let f=new mt(this.mModuleValues.data);f.setTemporaryValue(r.iterateVariableName,c);let y=c;for(let C of r.modifier){C.procedure.setTemporaryValue("$index",m),C.procedure.setTemporaryValue(r.iterateVariableName,c);let a=C.procedure.execute();if(C.variableName==="$key"){y=a;continue}f.setTemporaryValue(C.variableName,a)}let x=new ut;x.appendChild(...this.mTemplate.childList),e.addElement(x,f,y)};compareEntries(e,r){if(e.length!==r.length)return!1;for(let c=0;c<e.length;c++){let[m,f]=e[c],[y,x]=r[c];if(m!==y||f!==x)return!1}return!0}}}};function Xs(){function v(a,n){return function(l){e(n,"addInitializer"),r(l,"An initializer"),a.push(l)}}function t(a,n,u,l,o,b,g,D,w){var p;switch(o){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:g?"#"+n:n,static:b,private:g,metadata:D},d={v:!1};s.addInitializer=v(l,d);var i,h;o===0?g?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(T){this[n]=T}):o===2?i=function(){return u.value}:((o===1||o===3)&&(i=function(){return u.get.call(this)}),(o===1||o===4)&&(h=function(T){u.set.call(this,T)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return a(w,s)}finally{d.v=!0}}function e(a,n){if(a.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(a,n){if(typeof a!="function")throw new TypeError(n+" must be a function")}function c(a,n){var u=typeof n;if(a===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(u!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function m(a,n,u,l,o,b,g,D,w){var p=u[0],s,d,i;g?o===0||o===1?s={get:u[3],set:u[4]}:o===3?s={get:u[3]}:o===4?s={set:u[3]}:s={value:u[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var h,T,P;if(typeof p=="function")h=t(p,l,s,D,o,b,g,w,i),h!==void 0&&(c(o,h),o===0?d=h:o===1?(d=h.init,T=h.get||i.get,P=h.set||i.set,i={get:T,set:P}):i=h);else for(var M=p.length-1;M>=0;M--){var S=p[M];if(h=t(S,l,s,D,o,b,g,w,i),h!==void 0){c(o,h);var N;o===0?N=h:o===1?(N=h.init,T=h.get||i.get,P=h.set||i.set,i={get:T,set:P}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(o===0||o===1){if(d===void 0)d=function(I,E){return E};else if(typeof d!="function"){var F=d;d=function(I,E){for(var A=E,L=0;L<F.length;L++)A=F[L].call(I,A);return A}}else{var j=d;d=function(I,E){return j.call(I,E)}}a.push(d)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),g?o===1?(a.push(function(I,E){return i.get.call(I,E)}),a.push(function(I,E){return i.set.call(I,E)})):o===2?a.push(i):a.push(function(I,E){return i.call(I,E)}):Object.defineProperty(n,l,s))}function f(a,n,u){for(var l=[],o,b,g=new Map,D=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,T,P;if(h?(T=a,s=s-5,b=b||[],P=b):(T=a.prototype,o=o||[],P=o),s!==0&&!i){var M=h?D:g,S=M.get(d)||0;if(S===!0||S===3&&s!==4||S===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!S&&s>2?M.set(d,s):M.set(d,!0)}m(l,T,p,d,s,h,i,P,u)}}return y(l,o),y(l,b),l}function y(a,n){n&&a.push(function(u){for(var l=0;l<n.length;l++)n[l].call(u);return u})}function x(a,n,u){if(n.length>0){for(var l=[],o=a,b=a.name,g=n.length-1;g>=0;g--){var D={v:!1};try{var w=n[g](o,{kind:"class",name:b,addInitializer:v(l,D),metadata:u})}finally{D.v=!0}w!==void 0&&(c(10,w),o=w)}return[C(o,u),function(){for(var p=0;p<l.length;p++)l[p].call(o)}]}}function C(a,n){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,l,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(b===void 0?null:b),D=f(n,u,g);return l.length||C(n,g),{e:D,get c(){return x(n,l,g)}}}}function or(v,t,e,r){return(or=Xs())(v,t,e,r)}var rr,tr,Hs;rr=Ot({instructionType:"if"});var er=class{static{({c:[Hs,tr]}=or(this,[],[rr]))}constructor(t=O.use(pt),e=O.use(Y),r=O.use(ot)){this.mTemplateReference=t,this.mModuleValues=e,this.mProcedure=this.mModuleValues.createExpressionProcedure(r.value),this.mLastBoolean=!1}mLastBoolean;mModuleValues;mProcedure;mTemplateReference;onUpdate(){let t=this.mProcedure.execute();if(!!t!==this.mLastBoolean){this.mLastBoolean=!!t;let e=new ht;if(t){let r=new ut;r.appendChild(...this.mTemplateReference.childList),e.addElement(r,new mt(this.mModuleValues.data),null)}return e}else return null}static{tr()}};function Ys(){function v(a,n){return function(l){e(n,"addInitializer"),r(l,"An initializer"),a.push(l)}}function t(a,n,u,l,o,b,g,D,w){var p;switch(o){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:g?"#"+n:n,static:b,private:g,metadata:D},d={v:!1};s.addInitializer=v(l,d);var i,h;o===0?g?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(T){this[n]=T}):o===2?i=function(){return u.value}:((o===1||o===3)&&(i=function(){return u.get.call(this)}),(o===1||o===4)&&(h=function(T){u.set.call(this,T)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return a(w,s)}finally{d.v=!0}}function e(a,n){if(a.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(a,n){if(typeof a!="function")throw new TypeError(n+" must be a function")}function c(a,n){var u=typeof n;if(a===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(u!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function m(a,n,u,l,o,b,g,D,w){var p=u[0],s,d,i;g?o===0||o===1?s={get:u[3],set:u[4]}:o===3?s={get:u[3]}:o===4?s={set:u[3]}:s={value:u[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var h,T,P;if(typeof p=="function")h=t(p,l,s,D,o,b,g,w,i),h!==void 0&&(c(o,h),o===0?d=h:o===1?(d=h.init,T=h.get||i.get,P=h.set||i.set,i={get:T,set:P}):i=h);else for(var M=p.length-1;M>=0;M--){var S=p[M];if(h=t(S,l,s,D,o,b,g,w,i),h!==void 0){c(o,h);var N;o===0?N=h:o===1?(N=h.init,T=h.get||i.get,P=h.set||i.set,i={get:T,set:P}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(o===0||o===1){if(d===void 0)d=function(I,E){return E};else if(typeof d!="function"){var F=d;d=function(I,E){for(var A=E,L=0;L<F.length;L++)A=F[L].call(I,A);return A}}else{var j=d;d=function(I,E){return j.call(I,E)}}a.push(d)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),g?o===1?(a.push(function(I,E){return i.get.call(I,E)}),a.push(function(I,E){return i.set.call(I,E)})):o===2?a.push(i):a.push(function(I,E){return i.call(I,E)}):Object.defineProperty(n,l,s))}function f(a,n,u){for(var l=[],o,b,g=new Map,D=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,T,P;if(h?(T=a,s=s-5,b=b||[],P=b):(T=a.prototype,o=o||[],P=o),s!==0&&!i){var M=h?D:g,S=M.get(d)||0;if(S===!0||S===3&&s!==4||S===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!S&&s>2?M.set(d,s):M.set(d,!0)}m(l,T,p,d,s,h,i,P,u)}}return y(l,o),y(l,b),l}function y(a,n){n&&a.push(function(u){for(var l=0;l<n.length;l++)n[l].call(u);return u})}function x(a,n,u){if(n.length>0){for(var l=[],o=a,b=a.name,g=n.length-1;g>=0;g--){var D={v:!1};try{var w=n[g](o,{kind:"class",name:b,addInitializer:v(l,D),metadata:u})}finally{D.v=!0}w!==void 0&&(c(10,w),o=w)}return[C(o,u),function(){for(var p=0;p<l.length;p++)l[p].call(o)}]}}function C(a,n){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,l,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(b===void 0?null:b),D=f(n,u,g);return l.length||C(n,g),{e:D,get c(){return x(n,l,g)}}}}function sr(v,t,e,r){return(sr=Ys())(v,t,e,r)}var ar,nr,Ws;ar=Dt({access:q.Read,selector:/^\[[\w$]+\]$/});var ir=class{static{({c:[Ws,nr]}=sr(this,[],[ar]))}constructor(t=O.use(tt),e=O.use(Y),r=O.use(nt)){this.mTarget=t,this.mProcedure=e.createExpressionProcedure(r.value),this.mTargetProperty=r.name.substring(1,r.name.length-1),this.mLastValue=Symbol("Uncomparable")}mLastValue;mProcedure;mTarget;mTargetProperty;onUpdate(){let t=this.mProcedure.execute();return t===this.mLastValue?!1:(this.mLastValue=t,Reflect.set(this.mTarget,this.mTargetProperty,t),!0)}static{nr()}};function Zs(){function v(a,n){return function(l){e(n,"addInitializer"),r(l,"An initializer"),a.push(l)}}function t(a,n,u,l,o,b,g,D,w){var p;switch(o){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:g?"#"+n:n,static:b,private:g,metadata:D},d={v:!1};s.addInitializer=v(l,d);var i,h;o===0?g?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(T){this[n]=T}):o===2?i=function(){return u.value}:((o===1||o===3)&&(i=function(){return u.get.call(this)}),(o===1||o===4)&&(h=function(T){u.set.call(this,T)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return a(w,s)}finally{d.v=!0}}function e(a,n){if(a.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(a,n){if(typeof a!="function")throw new TypeError(n+" must be a function")}function c(a,n){var u=typeof n;if(a===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(u!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function m(a,n,u,l,o,b,g,D,w){var p=u[0],s,d,i;g?o===0||o===1?s={get:u[3],set:u[4]}:o===3?s={get:u[3]}:o===4?s={set:u[3]}:s={value:u[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var h,T,P;if(typeof p=="function")h=t(p,l,s,D,o,b,g,w,i),h!==void 0&&(c(o,h),o===0?d=h:o===1?(d=h.init,T=h.get||i.get,P=h.set||i.set,i={get:T,set:P}):i=h);else for(var M=p.length-1;M>=0;M--){var S=p[M];if(h=t(S,l,s,D,o,b,g,w,i),h!==void 0){c(o,h);var N;o===0?N=h:o===1?(N=h.init,T=h.get||i.get,P=h.set||i.set,i={get:T,set:P}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(o===0||o===1){if(d===void 0)d=function(I,E){return E};else if(typeof d!="function"){var F=d;d=function(I,E){for(var A=E,L=0;L<F.length;L++)A=F[L].call(I,A);return A}}else{var j=d;d=function(I,E){return j.call(I,E)}}a.push(d)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),g?o===1?(a.push(function(I,E){return i.get.call(I,E)}),a.push(function(I,E){return i.set.call(I,E)})):o===2?a.push(i):a.push(function(I,E){return i.call(I,E)}):Object.defineProperty(n,l,s))}function f(a,n,u){for(var l=[],o,b,g=new Map,D=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,T,P;if(h?(T=a,s=s-5,b=b||[],P=b):(T=a.prototype,o=o||[],P=o),s!==0&&!i){var M=h?D:g,S=M.get(d)||0;if(S===!0||S===3&&s!==4||S===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!S&&s>2?M.set(d,s):M.set(d,!0)}m(l,T,p,d,s,h,i,P,u)}}return y(l,o),y(l,b),l}function y(a,n){n&&a.push(function(u){for(var l=0;l<n.length;l++)n[l].call(u);return u})}function x(a,n,u){if(n.length>0){for(var l=[],o=a,b=a.name,g=n.length-1;g>=0;g--){var D={v:!1};try{var w=n[g](o,{kind:"class",name:b,addInitializer:v(l,D),metadata:u})}finally{D.v=!0}w!==void 0&&(c(10,w),o=w)}return[C(o,u),function(){for(var p=0;p<l.length;p++)l[p].call(o)}]}}function C(a,n){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,l,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(b===void 0?null:b),D=f(n,u,g);return l.length||C(n,g),{e:D,get c(){return x(n,l,g)}}}}function ur(v,t,e,r){return(ur=Zs())(v,t,e,r)}var hr,lr,qs;hr=Dt({access:q.Write,selector:/^#[[\w$]+$/});var cr=class{static{({c:[qs,lr]}=ur(this,[],[hr]))}constructor(t=O.use(tt),e=O.use(nt),r=O.use(Ct)){this.mChildName=e.name.substring(1),this.mComponentScopeValue=r,this.mTargetNode=t,this.mComponentScopeValue.setTemporaryValue(this.mChildName,this.mTargetNode)}mChildName;mComponentScopeValue;mTargetNode;onDeconstruct(){this.mComponentScopeValue.data.store[this.mChildName]===this.mTargetNode&&this.mComponentScopeValue.data.deleteTemporaryValue(this.mChildName)}static{lr()}};function Js(){function v(a,n){return function(l){e(n,"addInitializer"),r(l,"An initializer"),a.push(l)}}function t(a,n,u,l,o,b,g,D,w){var p;switch(o){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:g?"#"+n:n,static:b,private:g,metadata:D},d={v:!1};s.addInitializer=v(l,d);var i,h;o===0?g?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(T){this[n]=T}):o===2?i=function(){return u.value}:((o===1||o===3)&&(i=function(){return u.get.call(this)}),(o===1||o===4)&&(h=function(T){u.set.call(this,T)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return a(w,s)}finally{d.v=!0}}function e(a,n){if(a.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(a,n){if(typeof a!="function")throw new TypeError(n+" must be a function")}function c(a,n){var u=typeof n;if(a===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(u!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function m(a,n,u,l,o,b,g,D,w){var p=u[0],s,d,i;g?o===0||o===1?s={get:u[3],set:u[4]}:o===3?s={get:u[3]}:o===4?s={set:u[3]}:s={value:u[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var h,T,P;if(typeof p=="function")h=t(p,l,s,D,o,b,g,w,i),h!==void 0&&(c(o,h),o===0?d=h:o===1?(d=h.init,T=h.get||i.get,P=h.set||i.set,i={get:T,set:P}):i=h);else for(var M=p.length-1;M>=0;M--){var S=p[M];if(h=t(S,l,s,D,o,b,g,w,i),h!==void 0){c(o,h);var N;o===0?N=h:o===1?(N=h.init,T=h.get||i.get,P=h.set||i.set,i={get:T,set:P}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(o===0||o===1){if(d===void 0)d=function(I,E){return E};else if(typeof d!="function"){var F=d;d=function(I,E){for(var A=E,L=0;L<F.length;L++)A=F[L].call(I,A);return A}}else{var j=d;d=function(I,E){return j.call(I,E)}}a.push(d)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),g?o===1?(a.push(function(I,E){return i.get.call(I,E)}),a.push(function(I,E){return i.set.call(I,E)})):o===2?a.push(i):a.push(function(I,E){return i.call(I,E)}):Object.defineProperty(n,l,s))}function f(a,n,u){for(var l=[],o,b,g=new Map,D=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,T,P;if(h?(T=a,s=s-5,b=b||[],P=b):(T=a.prototype,o=o||[],P=o),s!==0&&!i){var M=h?D:g,S=M.get(d)||0;if(S===!0||S===3&&s!==4||S===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!S&&s>2?M.set(d,s):M.set(d,!0)}m(l,T,p,d,s,h,i,P,u)}}return y(l,o),y(l,b),l}function y(a,n){n&&a.push(function(u){for(var l=0;l<n.length;l++)n[l].call(u);return u})}function x(a,n,u){if(n.length>0){for(var l=[],o=a,b=a.name,g=n.length-1;g>=0;g--){var D={v:!1};try{var w=n[g](o,{kind:"class",name:b,addInitializer:v(l,D),metadata:u})}finally{D.v=!0}w!==void 0&&(c(10,w),o=w)}return[C(o,u),function(){for(var p=0;p<l.length;p++)l[p].call(o)}]}}function C(a,n){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,l,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(b===void 0?null:b),D=f(n,u,g);return l.length||C(n,g),{e:D,get c(){return x(n,l,g)}}}}function pr(v,t,e,r){return(pr=Js())(v,t,e,r)}var fr,dr,Ks;fr=Ot({instructionType:"slot"});var mr=class{static{({c:[Ks,dr]}=pr(this,[],[fr]))}constructor(t=O.use(Y),e=O.use(ot)){this.mModuleValues=t,this.mSlotName=e.value,this.mIsSetup=!1}mIsSetup;mModuleValues;mSlotName;onUpdate(){if(this.mIsSetup)return null;this.mIsSetup=!0;let t=new Rt("slot");this.mSlotName!==""&&t.setAttribute("name").addValue(this.mSlotName);let e=new ut;e.appendChild(t);let r=new ht;return r.addElement(e,this.mModuleValues.data,null),r}static{dr()}};function Qs(){function v(a,n){return function(l){e(n,"addInitializer"),r(l,"An initializer"),a.push(l)}}function t(a,n,u,l,o,b,g,D,w){var p;switch(o){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:g?"#"+n:n,static:b,private:g,metadata:D},d={v:!1};s.addInitializer=v(l,d);var i,h;o===0?g?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(T){this[n]=T}):o===2?i=function(){return u.value}:((o===1||o===3)&&(i=function(){return u.get.call(this)}),(o===1||o===4)&&(h=function(T){u.set.call(this,T)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return a(w,s)}finally{d.v=!0}}function e(a,n){if(a.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(a,n){if(typeof a!="function")throw new TypeError(n+" must be a function")}function c(a,n){var u=typeof n;if(a===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(u!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function m(a,n,u,l,o,b,g,D,w){var p=u[0],s,d,i;g?o===0||o===1?s={get:u[3],set:u[4]}:o===3?s={get:u[3]}:o===4?s={set:u[3]}:s={value:u[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var h,T,P;if(typeof p=="function")h=t(p,l,s,D,o,b,g,w,i),h!==void 0&&(c(o,h),o===0?d=h:o===1?(d=h.init,T=h.get||i.get,P=h.set||i.set,i={get:T,set:P}):i=h);else for(var M=p.length-1;M>=0;M--){var S=p[M];if(h=t(S,l,s,D,o,b,g,w,i),h!==void 0){c(o,h);var N;o===0?N=h:o===1?(N=h.init,T=h.get||i.get,P=h.set||i.set,i={get:T,set:P}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(o===0||o===1){if(d===void 0)d=function(I,E){return E};else if(typeof d!="function"){var F=d;d=function(I,E){for(var A=E,L=0;L<F.length;L++)A=F[L].call(I,A);return A}}else{var j=d;d=function(I,E){return j.call(I,E)}}a.push(d)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),g?o===1?(a.push(function(I,E){return i.get.call(I,E)}),a.push(function(I,E){return i.set.call(I,E)})):o===2?a.push(i):a.push(function(I,E){return i.call(I,E)}):Object.defineProperty(n,l,s))}function f(a,n,u){for(var l=[],o,b,g=new Map,D=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,T,P;if(h?(T=a,s=s-5,b=b||[],P=b):(T=a.prototype,o=o||[],P=o),s!==0&&!i){var M=h?D:g,S=M.get(d)||0;if(S===!0||S===3&&s!==4||S===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!S&&s>2?M.set(d,s):M.set(d,!0)}m(l,T,p,d,s,h,i,P,u)}}return y(l,o),y(l,b),l}function y(a,n){n&&a.push(function(u){for(var l=0;l<n.length;l++)n[l].call(u);return u})}function x(a,n,u){if(n.length>0){for(var l=[],o=a,b=a.name,g=n.length-1;g>=0;g--){var D={v:!1};try{var w=n[g](o,{kind:"class",name:b,addInitializer:v(l,D),metadata:u})}finally{D.v=!0}w!==void 0&&(c(10,w),o=w)}return[C(o,u),function(){for(var p=0;p<l.length;p++)l[p].call(o)}]}}function C(a,n){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,l,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(b===void 0?null:b),D=f(n,u,g);return l.length||C(n,g),{e:D,get c(){return x(n,l,g)}}}}function yr(v,t,e,r){return(yr=Qs())(v,t,e,r)}var br,gr,ks;br=Dt({access:q.ReadWrite,selector:/^\[\([[\w$]+\)\]$/});var vr=class{static{({c:[ks,gr]}=yr(this,[],[br]))}constructor(t=O.use(G),e=O.use(tt),r=O.use(Y),c=O.use(nt)){this.mTargetNode=e,this.mAttributeKey=c.name.substring(2,c.name.length-2),this.mReadProcedure=r.createExpressionProcedure(c.value),this.mWriteProcedure=r.createExpressionProcedure(`${c.value} = $DATA;`,["$DATA"]),this.mLastDataValue=Symbol("Uncomparable");let m=f=>{this.mLastDataValue!==f&&t.updater.updateAsync()};this.mTargetNode.addEventListener("input",f=>{m(Reflect.get(this.mTargetNode,this.mAttributeKey))}),this.mTargetNode.addEventListener("change",f=>{m(Reflect.get(this.mTargetNode,this.mAttributeKey))})}mAttributeKey;mLastDataValue;mReadProcedure;mTargetNode;mWriteProcedure;onUpdate(){let t=this.mReadProcedure.execute();if(t!==this.mLastDataValue)return Reflect.set(this.mTargetNode,this.mAttributeKey,t),this.mLastDataValue=t,!0;let e=Reflect.get(this.mTargetNode,this.mAttributeKey);return e!==t?(this.mWriteProcedure.setTemporaryValue("$DATA",e),this.mWriteProcedure.execute(),this.mLastDataValue=e,!0):!1}static{gr()}};function ta(){function v(a,n){return function(l){e(n,"addInitializer"),r(l,"An initializer"),a.push(l)}}function t(a,n,u,l,o,b,g,D,w){var p;switch(o){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:g?"#"+n:n,static:b,private:g,metadata:D},d={v:!1};s.addInitializer=v(l,d);var i,h;o===0?g?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(T){this[n]=T}):o===2?i=function(){return u.value}:((o===1||o===3)&&(i=function(){return u.get.call(this)}),(o===1||o===4)&&(h=function(T){u.set.call(this,T)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return a(w,s)}finally{d.v=!0}}function e(a,n){if(a.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(a,n){if(typeof a!="function")throw new TypeError(n+" must be a function")}function c(a,n){var u=typeof n;if(a===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(u!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function m(a,n,u,l,o,b,g,D,w){var p=u[0],s,d,i;g?o===0||o===1?s={get:u[3],set:u[4]}:o===3?s={get:u[3]}:o===4?s={set:u[3]}:s={value:u[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var h,T,P;if(typeof p=="function")h=t(p,l,s,D,o,b,g,w,i),h!==void 0&&(c(o,h),o===0?d=h:o===1?(d=h.init,T=h.get||i.get,P=h.set||i.set,i={get:T,set:P}):i=h);else for(var M=p.length-1;M>=0;M--){var S=p[M];if(h=t(S,l,s,D,o,b,g,w,i),h!==void 0){c(o,h);var N;o===0?N=h:o===1?(N=h.init,T=h.get||i.get,P=h.set||i.set,i={get:T,set:P}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(o===0||o===1){if(d===void 0)d=function(I,E){return E};else if(typeof d!="function"){var F=d;d=function(I,E){for(var A=E,L=0;L<F.length;L++)A=F[L].call(I,A);return A}}else{var j=d;d=function(I,E){return j.call(I,E)}}a.push(d)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),g?o===1?(a.push(function(I,E){return i.get.call(I,E)}),a.push(function(I,E){return i.set.call(I,E)})):o===2?a.push(i):a.push(function(I,E){return i.call(I,E)}):Object.defineProperty(n,l,s))}function f(a,n,u){for(var l=[],o,b,g=new Map,D=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,T,P;if(h?(T=a,s=s-5,b=b||[],P=b):(T=a.prototype,o=o||[],P=o),s!==0&&!i){var M=h?D:g,S=M.get(d)||0;if(S===!0||S===3&&s!==4||S===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!S&&s>2?M.set(d,s):M.set(d,!0)}m(l,T,p,d,s,h,i,P,u)}}return y(l,o),y(l,b),l}function y(a,n){n&&a.push(function(u){for(var l=0;l<n.length;l++)n[l].call(u);return u})}function x(a,n,u){if(n.length>0){for(var l=[],o=a,b=a.name,g=n.length-1;g>=0;g--){var D={v:!1};try{var w=n[g](o,{kind:"class",name:b,addInitializer:v(l,D),metadata:u})}finally{D.v=!0}w!==void 0&&(c(10,w),o=w)}return[C(o,u),function(){for(var p=0;p<l.length;p++)l[p].call(o)}]}}function C(a,n){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,l,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(b===void 0?null:b),D=f(n,u,g);return l.length||C(n,g),{e:D,get c(){return x(n,l,g)}}}}function Tr(v,t,e,r){return(Tr=ta())(v,t,e,r)}var Dr,wr,ea;Dr=qt({access:q.Read,targetRestrictions:[Tt]});var xr=class{static{({c:[ea,wr]}=Tr(this,[],[Dr]))}constructor(t=O.use(Tt),e=O.use(tt)){let r=new Array,c=t.processorConstructor;do{let m=st.get(c).getMetadata(De.METADATA_USER_EVENT_LISTENER_PROPERIES);if(m)for(let f of m)r.push(f)}while(c=Object.getPrototypeOf(c));this.mEventListenerList=new Array,this.mTargetElement=e;for(let m of r){let[f,y]=m,x=Reflect.get(t.processor,f);x=x.bind(t.processor),this.mEventListenerList.push([y,x]),this.mTargetElement.addEventListener(y,x)}}mEventListenerList;mTargetElement;onDeconstruct(){for(let t of this.mEventListenerList){let[e,r]=t;this.mTargetElement.removeEventListener(e,r)}}static{wr()}};var Er=`:host {\r
    display: block;\r
    width: 100%;\r
    height: 100%;\r
}\r
\r
potatno-code-editor {\r
    display: block;\r
    width: 100%;\r
    height: 100%;\r
}`;var re=class{mProject;constructor(t){this.mProject=t}deserialize(t){let e=new jt(this.mProject),r=[];for(let c of t.functions){let m=this.deserializeFunctionHead(c,e);r.push([m,c]),e.addFunction(m)}for(let[c,m]of r)this.deserializeFunctionBody(c,m,e);return e}deserializeFunctionBody(t,e,r){let c=new Map;for(let m of e.nodes)c.set(m.id,this.deserializeNode(m,t,r));for(let m of e.connections){if(!c.has(m.sourceNodeId)||!c.has(m.targetNodeId))continue;let f=c.get(m.sourceNodeId),y=c.get(m.targetNodeId),x=f.outputs.map.get(m.sourcePortId),C=y.inputs.map.get(m.targetPortId);!x||!C||x.connect(C)}}deserializeFunctionHead(t,e){let r=new Et(this.mProject,e,{definitionId:t.definitionId,id:t.id,label:t.label,isSystem:t.isSystem});for(let c of t.imports)r.addImport(c);for(let c of t.inputs)r.addInput({label:c.label,dataType:c.dataType});for(let c of t.outputs)r.addOutput({label:c.label,dataType:c.dataType});return r}deserializeNode(t,e,r){let c=r.nodeDefinitions.find(f=>f.id===t.definitionId),m=(()=>{if(c)return e.addNodeByDefinition(c,t.transformation);let f=t.ports.filter(x=>x.direction==="input").map(x=>({dataType:x.dataType,definitionId:x.definitionId,label:x.label,portType:x.portType})),y=t.ports.filter(x=>x.direction==="output").map(x=>({dataType:x.dataType,definitionId:x.definitionId,label:x.label,portType:x.portType}));return new Nt(this.mProject,r,e,{definitionId:t.definitionId,ports:{input:f,output:y},label:t.label,transformation:{...t.transformation}})})();m.label=t.label,e.addNode(m);for(let f of t.ports)if(f.portType==="value"&&f.directValue.length>0){let y=m.inputs.map.get(f.definitionId);y&&y.setDirectValue(f.directValue)}return m.preview=t.preview??null,m}};var ne=class{constructor(){}serialize(t){return{functions:[...t.functions].map(e=>this.serializeFunction(e))}}serializeFunction(t){let e=new Map;[...t.nodes].forEach((y,x)=>{e.set(y,`n${x}`)});let r=[...t.nodes].map(y=>this.serializeNode(y,e.get(y))),c=[];for(let y of t.nodes){let x=e.get(y);for(let C of y.outputs.list)for(let a of C.connectedPorts){let n=e.get(a.node);c.push({sourceNodeId:x,sourcePortId:C.definitionId,targetNodeId:n,targetPortId:a.definitionId})}}let m=t.inputs.map(y=>({label:y.label,dataType:y.dataType})),f=t.outputs.map(y=>({label:y.label,dataType:y.dataType}));return{id:t.id,label:t.label,isSystem:t.isSystem,definitionId:t.definitionId,inputs:m,outputs:f,imports:[...t.imports],nodes:r,connections:c}}serializeNode(t,e){let r=[...t.inputs.list,...t.outputs.list].map(m=>({definitionId:m.definitionId,label:m.label,direction:m.direction,portType:m.portType,dataType:m.portType==="value"?m.dataType:null,directValue:[...m.directValue]})),c=t.preview?{portDefinitionId:t.preview.portDefinitionId,displayId:t.preview.displayId}:null;return{id:e,definitionId:t.definitionId,label:t.label,transformation:{...t.transformation},ports:r,preview:c}}};var Ir=`:host {\r
    /* Globals */\r
    --potatno-grid-size: 24px;\r
    \r
    /* Font */\r
    --potatno-font-size: 0.75rem;\r
    --potatno-font-size-big: 0.8rem;\r
    --potatno-font-size-small: 0.7rem;\r
    --potatno-font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;\r
\r
    /* Main colors */\r
    --potatno-color-background: #232323;\r
    --potatno-color-background-dark: #1c1c1c;\r
    --potatno-color-background-light: #313131;\r
    --potatno-color-text: #c8c8c8;\r
    --potatno-color-text-contrast: #ffffff;\r
    --potatno-color-accent: #20be20;\r
    --potatno-color-border: #4c4c4c;\r
\r
    /* Supporting colors */\r
    --potatno-color-error: #ff5555;\r
    --potatno-color-shadow: rgba(0, 0, 0, 0.69);\r
\r
    /* Scrollbar */\r
    --potatno-color-scrollbar-thumb: #5e5e5e;\r
    --potatno-color-scrollbar-track: transparent;\r
\r
    /* Shared animations */\r
    --potatno-connection-animation: 1.3s;\r
    --potatno-position-snap-animation: top 0.1s cubic-bezier(0, 1.5, 1, 1), left 0.1s cubic-bezier(0, 1.5, 1, 1);\r
}`;var Xe=class v{static PASTE_OFFSET=2;mClipboardNodes;mManager;constructor(t){this.mManager=t,this.mClipboardNodes=new Array}copy(t){if(t.size===0)return;let e=[...t],r=new Map;for(let c=0;c<e.length;c++){let m=e[c],f=m.inputs.value.map(x=>({definitionId:x.definitionId,values:[...x.directValue]})),y={...m.transformation};y.x+=v.PASTE_OFFSET,y.y+=v.PASTE_OFFSET,r.set(m,{connections:new Array,definitionId:m.definitionId,id:c,portDirectValues:f,label:m.label,transformation:y})}for(let[c,m]of r)for(let f of c.outputs.list)for(let y of f.connectedPorts){let x=r.get(y.node);x&&m.connections.push({sourcePortName:f.definitionId,targetNodeId:x.id,targetPortName:y.definitionId})}this.mClipboardNodes=[...r.values()]}paste(){if(this.mClipboardNodes.length===0)return new Array;let t=this.mManager.activeFunction,e=new Map;for(let r of this.mClipboardNodes){let c=t.dynamicNodeDefinitions.find(f=>f.id===r.definitionId);if(!c)continue;let m=this.mManager.graph.addNode(t,c,r.transformation);this.mManager.graph.updateNode(m,f=>{f.label=r.label;for(let y of r.portDirectValues)f.inputs.map.has(y.definitionId)&&f.inputs.map.get(y.definitionId).setDirectValue(y.values)}),e.set(r.id,m)}for(let r of this.mClipboardNodes){let c=e.get(r.id);if(c)for(let m of r.connections){let f=e.get(m.targetNodeId);if(!f)continue;let y=c.outputs.map.get(m.sourcePortName),x=f.inputs.map.get(m.targetPortName);!y||!x||this.mManager.graph.connectPorts(y,x)}}return[...e.values()]}};var He=class extends de{mGridNodeArea;mGridPaths;mNodeArea;mPathArea;constructor(){super(),this.mGridNodeArea=new WeakMap,this.mNodeArea=new Map,this.mGridPaths=new WeakMap,this.mPathArea=new Map}clear(t){t==="all"&&this.mNodeArea.clear(),this.mPathArea.clear()}getPath(t,e){let r=t.direction==="input"&&t.portType==="value"||t.direction==="output"&&t.portType==="flow"?t:e;return this.mGridPaths.get(r)??new Array}removeNodeArea(t){if(!this.mGridNodeArea.has(t))return;let e=this.mGridNodeArea.get(t);for(let r of e){let c=(this.mNodeArea.get(r)??0)-1;c<1?this.mNodeArea.delete(r):this.mNodeArea.set(r,c)}this.mGridNodeArea.delete(t)}updateNodeArea(t){this.removeNodeArea(t);let e=t.transformation.x,r=t.transformation.y,c=t.transformation.width,m=t.transformation.height,f=t.function.nodeDefinitions.find(x=>x.id===t.definitionId);if(f)switch(f.id){case bt.DEFINITION_ID:return;case k.DEFINITION_ID:case Z.DEFINITION_ID:break;default:m+=1,m+=t.preview!==null?7:1}let y=new Array;for(let x=0;x<c;x++)for(let C=0;C<m;C++){let a=`${x+e}|${C+r}`,n=(this.mNodeArea.get(a)??0)+1;this.mNodeArea.set(a,n),y.push(a)}this.mGridNodeArea.set(t,y)}updatePath(t,e,r){if(t.direction==="input"&&t.portType!=="value"||t.direction==="output"&&t.portType!=="flow")throw new _("Start port must be an input-value or an output-flow node.",this);this.removePathArea(t);let c=this.start(e,r);this.mGridPaths.set(t,c.path);let m=this.nodeId(e),f=this.nodeId(r);for(let y of c.path){let x=this.nodeId(y),C=this.mPathArea.has(x)?this.mPathArea.get(x):{ports:new Map,entryPoints:new Set};C.ports.set(t,[m,f]),C.entryPoints.add(m),C.entryPoints.add(f),this.mPathArea.set(x,C)}}costOfTraversal(t,e){let r=this.nodeId(t),c=1;this.mNodeArea.has(r)&&t!==e.endNode&&(c*=20);let m=e.path.next().value;if(this.mPathArea.has(r)){let a=this.mPathArea.get(r),n=this.nodeId(e.startNode),u=this.nodeId(e.endNode);if(a.entryPoints.has(n)||a.entryPoints.has(u))c*=.2;else if(c*=5,m){let l=this.nodeId(m);this.mPathArea.has(l)&&(c*=20)}}if(m){let a=t.y===m.y;(t===e.endNode||m===e.startNode)&&!a&&(c*=100);let n=e.path.next().value;n&&(t.x===n.x||t.y===n.y)&&(c*=.7)}let f=Math.abs(t.x-e.startNode.x),y=Math.abs(t.x-e.endNode.x),x=f<=y;(x&&t.y===e.startNode.y||!x&&t.y===e.endNode.y)&&(c*=.5);let C=e.endNode.x+e.startNode.x>>1;return t.x===C&&(c*=.5),c}heuristic(t,e){return(Math.abs(t.x-e.endNode.x)+Math.abs(t.y-e.endNode.y))*.5}neighborNodes(t){return[{x:t.x,y:t.y-1},{x:t.x-1,y:t.y},{x:t.x+1,y:t.y},{x:t.x,y:t.y+1}]}nodeId(t){return`${t.x}|${t.y}`}removePathArea(t){if(!this.mGridPaths.has(t))return;let e=this.mGridPaths.get(t);for(let r of e){let c=this.nodeId(r),m=this.mPathArea.get(c);if(!m)continue;let f=m.ports.get(t);f&&(m.ports.delete(t),m.entryPoints.delete(f[0]),m.entryPoints.delete(f[1]),m.ports.size===0?this.mPathArea.delete(c):this.mPathArea.set(c,m))}this.mGridPaths.delete(t)}};var Ye=class{mManager;mPathFinder;constructor(t){this.mManager=t,this.mPathFinder=new He;let e=0,r=()=>{e>0&&globalThis.cancelAnimationFrame(e),globalThis.requestAnimationFrame(()=>{this.updatePaths()})};this.mManager.subscribe(R.Node|R.SpecialActiveFunction,c=>{if((c.changeType&R.SpecialActiveFunction)>0){this.mPathFinder.clear("all");for(let m of this.mManager.activeFunction.nodes)this.mPathFinder.updateNodeArea(m);r();return}(c.changeType&R.Node)>0&&((c.changeType&R.NodeDelete)>0?this.mPathFinder.removeNodeArea(c.item):this.mPathFinder.updateNodeArea(c.item)),r()}),this.mManager.subscribe(R.Connection,()=>{r()})}createTemporaryPath(t,e){let r=y=>y instanceof dt?this.getPortGridPoint(y):y,c=r(t),m=r(e),f=this.mPathFinder.start(c,m).path;return{attributeValue:this.createSvgPath(f),length:f.length}}getConnectionPath(t,e){let r=this.mPathFinder.getPath(t,e);return{attributeValue:this.createSvgPath(r),length:r.length-2}}getPortGridPoint(t){let e=t.node,r=t.direction==="input"?e.inputs.list:e.outputs.list,c=(()=>{for(let y=0;y<r.length;y++)if(r[y]===t)return y;return 0})(),m=t.direction==="input"?e.transformation.x:e.transformation.x+e.transformation.width-1,f=1;return(e.definitionId===Z.DEFINITION_ID||e.definitionId===k.DEFINITION_ID)&&(f=0),{y:e.transformation.y+f+c,x:m}}createGridCellPath(t,e,r){let c=this.getGridPosition(t,e),m=this.getGridPosition(t,r),f={x:e==="bottom"||e==="top"?c.x:m.x,y:e==="left"||e==="right"?c.y:m.y};return`Q ${f.x},${f.y} ${m.x},${m.y}`}createPath(t,e){let r=t.direction==="input"&&t.portType==="value"||t.direction==="output"&&t.portType==="flow"?t:e,c=t,m=e;c.direction!=="output"&&([m,c]=[c,m]);let f=this.getPortGridPoint(c),y=this.getPortGridPoint(m);this.mPathFinder.updatePath(r,f,y)}createSvgPath(t){if(t.length<2)return"";let e=(m,f)=>{let y=f.x-m.x,x=f.y-m.y;switch(!0){case(y===0&&x===1):return"bottom";case(y===0&&x===-1):return"top";case(y===-1&&x===0):return"left";case(y===1&&x===0):return"right";default:throw new _("Missformed path. Path points are not directly next to each other.",this)}},r=this.getGridPosition(t[0],e(t[0],t[1])),c=`M ${r.x},${r.y}`;for(let m=1;m<t.length-1;m++){let f=t[m],y=t[m-1],x=t[m+1],C=e(f,y),a=e(f,x);c+=this.createGridCellPath(f,C,a)}return c}getGridPosition(t,e){let r={x:t.x*this.mManager.grid.gridSize+this.mManager.grid.gridSize/2,y:t.y*this.mManager.grid.gridSize+this.mManager.grid.gridSize/2},c=this.mManager.grid.gridSize/2;switch(e){case"top":r.y-=c;break;case"right":r.x+=c;break;case"bottom":r.y+=c;break;case"left":r.x-=c;break}return r}updatePaths(){this.mPathFinder.clear("path");for(let t of this.mManager.activeFunction.nodes){for(let e of t.outputs.flow){let r=e.connectedPorts.values().next().value;r&&this.createPath(e,r)}for(let e of t.inputs.value){let r=e.connectedPorts.values().next().value;r&&this.createPath(e,r)}}}};var We=class{mDocument;mManager;get document(){return this.mDocument}constructor(t){this.mManager=t,this.mDocument=new jt(t.project),this.mDocument.validate()}addFunction(t){let e=this.mDocument;if(!e||!e.project.userFunctions.has(t))return;let r=new Et(e.project,e,{definitionId:t,id:crypto.randomUUID(),isSystem:!1,label:`Function_${e.functions.length}`});e.addFunction(r),e.validate(),this.mManager.dispatch(R.FunctionAdd,r),this.mManager.setActiveFunction(r)}addNode(t,e,r){let c=t.addNodeByDefinition(e,r);return this.mManager.dispatch(R.NodeAdd,c),c}connectConjunction(t,e){let r=t.transformation,c=this.mManager.grid.draggedPort.portPositions.get(this.mManager.grid.draggedPort.ports[0]),m=e.sort((x,C)=>{let a=x.connectedPorts.size===0,n=C.connectedPorts.size===0;if(a!==n)return a?-1:1;let u=c.x>r.x?"input":"output",l=x.direction===u,o=C.direction===u;return l!==o?l?-1:1:0});if(t.inputs.list.length===0||t.outputs.list.length===0)throw new _("Malformed conjunction node",this);let f=t.inputs.list[0],y=t.outputs.list[0];for(let x of m)if(this.connectPorts(x,f)||this.connectPorts(x,y))return}connectPorts(t,e){try{t.connect(e)}catch{return!1}return this.mManager.dispatch(R.ConnectionAdd,t),this.mManager.dispatch(R.ConnectionAdd,e),!0}disconnectPorts(t,e){t.disconnect(e),this.mManager.dispatch(R.ConnectionDelete,t),this.mManager.dispatch(R.ConnectionDelete,e)}removeFunction(t){let e=this.mDocument;if(!e)return;let r=null;for(let c of e.functions)if(c.id===t){r=c,e.removeFunction(c);break}r&&(this.mManager.dispatch(R.FunctionDelete,r),this.setDefaultActiveFunction())}removeNode(t){if(t.definitionId===Z.DEFINITION_ID||t.definitionId===k.DEFINITION_ID){let e=t.inputs.list[0],r=t.outputs.list[0];for(let c of e.connectedPorts)for(let m of r.connectedPorts)this.mManager.graph.connectPorts(c,m)}t.function.removeNode(t),this.mManager.dispatch(R.NodeDelete,t)}setDocument(t){this.mDocument=t,this.mDocument.validate(),this.mManager.dispatch(R.Document,this.mDocument),this.setDefaultActiveFunction()}setPortDirectValue(t,e){t.setDirectValue(e),this.mManager.dispatch(R.NodeUpdate,t.node)}transformNode(t,e){if(!t)return;let r=structuredClone(t.transformation);e(t),!(r.width===t.transformation.width&&r.height===t.transformation.height&&r.x===t.transformation.x&&r.y===t.transformation.y)&&this.mManager.dispatch(R.NodeTransform,t)}updateFunction(t,e){t&&(e(t),this.mManager.dispatch(R.FunctionUpdate,t))}updateNode(t,e){t&&(e(t),this.mManager.dispatch(R.NodeUpdate,t))}setDefaultActiveFunction(){if(!this.mDocument||this.mDocument.functions.length===0)return;let t=(()=>{let e=[...this.mDocument.functions],r=e.find(c=>c.id===this.mManager.activeFunction.id);return r||e[0]})();this.mManager.activeFunction!==t&&this.mManager.setActiveFunction(t)}};var Ze=class v{static GRID_SIZE=24;static MAX_ZOOM=5;static MIN_ZOOM=.1;mDraggedPortInformation;mGridElement;mGridPositions;mManager;mSelectedNodes;mTransformation;get draggedPort(){return this.mDraggedPortInformation}set gridElement(t){this.mGridElement=t}get gridSize(){return v.GRID_SIZE}get panX(){return this.mTransformation.panX}get panY(){return this.mTransformation.panY}get selectedNodes(){return this.mSelectedNodes}get zoom(){return this.mTransformation.zoom}constructor(t){this.mManager=t,this.mGridElement=null,this.mDraggedPortInformation=new qe(this.mManager,[]),this.mGridPositions=new WeakMap,this.mSelectedNodes=new Set,this.mTransformation={panX:0,panY:0,zoom:1},this.mManager.subscribe(R.SpecialActiveFunction,()=>{this.mGridPositions.has(this.mManager.activeFunction)||this.mGridPositions.set(this.mManager.activeFunction,{panX:0,panY:0,zoom:1}),this.mTransformation=this.mGridPositions.get(this.mManager.activeFunction);let e=Array.from(this.mSelectedNodes).filter(r=>r.function!==this.mManager.activeFunction);for(let r of e)this.mSelectedNodes.delete(r)})}gridPixelSpaceToGridSpace(t,e){let r=t.x/this.gridSize,c=t.y/this.gridSize;return e&&(r=Math.floor(r),c=Math.floor(c)),{x:r,y:c}}pan(t,e){this.mTransformation.panX+=t,this.mTransformation.panY+=e,this.mManager.dispatch(R.SpecialGrid,null)}pixelToGridPixelSpace(t,e){let r=t,c=e;if(this.mGridElement){let m=this.mGridElement.getBoundingClientRect();r-=m.left,c-=m.top}return{x:(r-this.mTransformation.panX)/this.mTransformation.zoom,y:(c-this.mTransformation.panY)/this.mTransformation.zoom}}pixelToGridSpace(t,e){return this.gridPixelSpaceToGridSpace(this.pixelToGridPixelSpace(t,e),!0)}selectNodes(t,e=!1){if(this.mSelectedNodes.clear(),t.length===0){this.mManager.dispatch(R.SpecialSelectNode,null);return}let r=null;for(let c of t){if(r===null&&(r=c.function),r!==c.function)throw new _("Selected nodes must be of the same function",this);this.mSelectedNodes.add(c)}if(this.mManager.activeFunction!==r&&this.mManager.setActiveFunction(r),e){let c={top:1/0,right:-1/0,bottom:-1/0,left:1/0};for(let y of t){let x=y.transformation.y;x<c.top&&(c.top=x);let C=y.transformation.x+y.transformation.width;C>c.right&&(c.right=C);let a=y.transformation.y+y.transformation.height;a>c.bottom&&(c.bottom=a);let n=y.transformation.x;n<c.left&&(c.left=n)}this.mGridPositions.has(r)||this.mGridPositions.set(r,{panX:0,panY:0,zoom:1});let m=this.mGridPositions.get(r),f=this.mGridElement?.getBoundingClientRect();if(!f)return;m.panX=f.width/2,m.panX-=(c.left+(c.right-c.left)/2)*this.gridSize*m.zoom,m.panY=f.height/2,m.panY-=(c.top+(c.bottom-c.top)/2)*this.gridSize*m.zoom}this.mManager.dispatch(R.SpecialSelectNode,null)}setDraggingPort(t){this.mDraggedPortInformation=new qe(this.mManager,t)}zoomAt(t,e,r){let c=this.mTransformation.zoom,m=1+r,f=this.mTransformation.zoom*m;f=Math.max(v.MIN_ZOOM,Math.min(v.MAX_ZOOM,f));let y=(t-this.mTransformation.panX)/c,x=(e-this.mTransformation.panY)/c;this.mTransformation.zoom=f,this.mTransformation.panX=t-y*this.mTransformation.zoom,this.mTransformation.panY=e-x*this.mTransformation.zoom,this.mManager.dispatch(R.SpecialGrid,null)}},qe=class{mManager;mPointerGridPosition;mPortPositions;mPorts;get isDragging(){return this.mPorts.size>0}get portPositions(){return this.mPortPositions}get ports(){return[...this.mPorts]}constructor(t,e){this.mManager=t,this.mPorts=new Set(e),this.mPointerGridPosition={x:1/0,y:1/0},this.mPortPositions=new Map;for(let r of e){let c=this.mManager.connections.getPortGridPoint(r);r.direction==="output"&&(c.x+=1),this.mPortPositions.set(r,{x:c.x,y:c.y})}}hasPort(t){return t?this.mPorts.has(t):!1}updatePointer(t,e){let r=this.mManager.grid.pixelToGridSpace(t,e);return r.x===this.mPointerGridPosition.x&&r.y===this.mPointerGridPosition.y?!1:(this.mPointerGridPosition.x=r.x,this.mPointerGridPosition.y=r.y,!0)}};var Je=class v{static MAX_HISTORY_ITEMS=100;mManager;mSnapshotIndex;mSnapshots;get canRedo(){return this.mSnapshotIndex<this.mSnapshots.length-1}get canUndo(){return this.mSnapshotIndex>0}constructor(t){this.mManager=t,this.mSnapshotIndex=-1,this.mSnapshots=new Array;let e=0;this.mManager.subscribe(R.Any,()=>{globalThis.clearTimeout(e),e=globalThis.setTimeout(()=>{this.pushHistory()},300)})}clear(){this.mSnapshots.length=0,this.mSnapshotIndex=-1}redo(){if(!this.canRedo)return;let t=this.mSnapshots[++this.mSnapshotIndex],e=JSON.parse(t);this.restoreHistory(e)}undo(){if(!this.canUndo)return;let t=this.mSnapshots[--this.mSnapshotIndex],e=JSON.parse(t);this.restoreHistory(e)}pushHistory(){let t=new ne().serialize(this.mManager.graph.document),e=JSON.stringify(t);this.mSnapshotIndex>=0&&this.mSnapshots[this.mSnapshotIndex]===e||(this.mSnapshots.splice(this.mSnapshotIndex+1),this.mSnapshotIndex=this.mSnapshots.push(e)-1,this.mSnapshots.length>v.MAX_HISTORY_ITEMS&&(this.mSnapshots.shift(),this.mSnapshotIndex--))}restoreHistory(t){this.mManager.graph.setDocument(new re(this.mManager.project).deserialize(t))}};var Ke=class{mErrorItems;mErrorList;mIsDirty;mManager;get errorItems(){return this.mIsDirty&&this.revalidate(),this.mErrorItems}get errors(){return this.mIsDirty&&this.revalidate(),this.mErrorList}get isValid(){return this.mIsDirty&&this.revalidate(),this.mErrorItems.size===0}constructor(t){this.mManager=t,this.mErrorList=new Array,this.mErrorItems=new Set,this.mIsDirty=!0;let e=0,r=R.Connection|R.Document|R.Function|R.NodeAdd|R.NodeUpdate|R.NodeDelete|R.Port;this.mManager.subscribe(r,()=>{this.mIsDirty=!0,globalThis.clearTimeout(e),e=globalThis.setTimeout(()=>{this.mIsDirty&&(this.revalidate(),this.mIsDirty=!1)},1e3)})}revalidate(){this.mIsDirty=!1,this.mErrorList.splice(0,this.mErrorList.length),this.mErrorItems.clear();let t=this.mManager.graph.document.validate();for(let e of t.errors)switch(this.mErrorItems.add(e.item),!0){case e.item instanceof dt:{this.mErrorList.push({location:e.item.node,message:e.message});break}case e.item instanceof Nt:{this.mErrorList.push({location:e.item,message:e.message});break}}for(let e of t.affectedItems)switch(!0){case e instanceof dt:{this.mManager.dispatch(R.PortAdd|R.PortUpdate,e),this.mManager.dispatch(R.NodeUpdate,e.node);break}case e instanceof Nt:{this.mManager.dispatch(R.NodeAdd|R.NodeUpdate|R.NodeTransform,e);break}case e instanceof Et:{this.mManager.dispatch(R.FunctionAdd|R.FunctionUpdate,e);break}}this.mManager.dispatch(R.SpecialValidation,null)}};var Qe=class{mDriverElementBigEnough;mDriverElementVisible;mDriverElements;mDriverList;mDrivers;mElementDriver;mManager;mPreviewIntersection;constructor(t){this.mManager=t,this.mDriverList=new Array,this.mDrivers=new WeakMap,this.mDriverElementVisible=new WeakMap,this.mDriverElementBigEnough=new WeakMap,this.mDriverElements=new WeakMap,this.mElementDriver=new WeakMap,this.mManager.subscribe(R.Document,()=>{this.mDriverList.splice(0,this.mDriverList.length)});let e=0,r=R.Connection|R.Function|R.NodeAdd|R.NodeDelete|R.NodeUpdate;this.mManager.subscribe(r,()=>{globalThis.clearTimeout(e),e=globalThis.setTimeout(()=>this.refresh(),1e3)});let c=0;this.mManager.subscribe(R.SpecialGrid,()=>{globalThis.clearTimeout(c),c=globalThis.setTimeout(()=>{for(let m of this.mDriverList){let f=m.deref();if(!f)continue;let y=f.element.getBoundingClientRect();this.mDriverElementBigEnough.set(f,!(y.width<30||y.height<30))}},300)}),this.mPreviewIntersection=new IntersectionObserver(m=>{for(let f of m){let y=this.mElementDriver.get(f.target);if(!y)continue;let x=y.deref();x&&this.mDriverElementVisible.set(x,f.isIntersecting)}})}execute(){for(let t of this.mDriverList){let e=t.deref();if(e&&this.mDriverElementVisible.get(e)!==!1&&this.mDriverElementBigEnough.get(e)!==!1)try{e.execute()}catch(r){console.error("[PotatnoUiManagerPreview] Driver render failed:",r)}}}refresh(){if(this.mManager.integrity.isValid)for(let t=this.mDriverList.length-1;t>=0;t--){let e=this.mDriverList[t].deref();if(!e){this.unregister(this.mDriverList[t]);continue}e.refresh()}}requestDriver(t,e){let r=this.mDrivers.get(t);if(r&&r.display.id===e)return r;r&&this.unregister(this.mElementDriver.get(r.element));let c=t.project.preview.getDisplay(e);if(!c)throw new _(`Preview has no display for "${e}".`,this);let m=c.createDriver(t);return this.register(t,m),this.mManager.integrity.isValid&&m.refresh(),m}register(t,e){this.mDrivers.set(t,e);let r=new WeakRef(e);this.mDriverList.push(r);let c=e.element;this.mDriverElements.set(r,c),this.mElementDriver.set(c,r),this.mPreviewIntersection.observe(c)}unregister(t){let e=this.mDriverList.indexOf(t);if(e===-1)return;this.mDriverList.splice(e,1);let r=this.mDriverElements.get(t);r&&this.mPreviewIntersection.unobserve(r)}};var H=class extends EventTarget{mActiveFunction;mClipboard;mConnections;mEventBuffer;mEventBufferDispatchRequest;mGraph;mGrid;mHistory;mIntegrity;mPreview;mProject;get activeFunction(){return this.mActiveFunction}get clipboard(){return this.mClipboard}get connections(){return this.mConnections}get graph(){return this.mGraph}get grid(){return this.mGrid}get history(){return this.mHistory}get integrity(){return this.mIntegrity}get preview(){return this.mPreview}get project(){return this.mProject}constructor(t){super(),this.mProject=t,this.mEventBuffer=new Map,this.mEventBufferDispatchRequest=-1,this.mIntegrity=new Ke(this),this.mConnections=new Ye(this),this.mHistory=new Je(this),this.mPreview=new Qe(this),this.mGrid=new Ze(this),this.mClipboard=new Xe(this),this.mGraph=new We(this),this.mActiveFunction=this.mGraph.document.functions.at(0)}dispatch(t,e){let r=this.mEventBuffer.get(e)??0;this.mEventBuffer.set(e,r|t),this.mEventBufferDispatchRequest!==-1&&globalThis.cancelAnimationFrame(this.mEventBufferDispatchRequest),this.mEventBufferDispatchRequest=requestAnimationFrame(()=>{this.mEventBufferDispatchRequest=-1;for(let[c,m]of this.mEventBuffer)this.dispatchEvent(new Pe(m,c));this.mEventBuffer.clear()})}generateStringColor(t){let e=(()=>{let c=0;for(let m=0;m<t.length;m++)c=t.charCodeAt(m)+((c<<5)-c);return c})();return`hsl(${Math.abs(e)*137.508%360}, 70%, 60%)`}setActiveFunction(t){this.mGraph.document.functions.find(r=>r===t)&&(this.mActiveFunction=t,this.dispatch(R.SpecialActiveFunction,t))}subscribe(t,e){let r=c=>{t!==R.Any&&(c.changeType&t)===0||e(c)};return this.addEventListener(Pe.EVENT_TYPE,r),()=>{this.removeEventListener(Pe.EVENT_TYPE,r)}}},R={Any:16777215,Connection:15,ConnectionAdd:1,ConnectionUpdate:2,ConnectionDelete:4,Document:240,Function:3840,FunctionAdd:256,FunctionUpdate:512,FunctionDelete:1024,Node:61440,NodeAdd:4096,NodeUpdate:8192,NodeDelete:16384,NodeTransform:32768,Port:983040,PortAdd:65536,PortUpdate:131072,PortDelete:262144,Special:15728640,SpecialActiveFunction:1048576,SpecialGrid:2097152,SpecialValidation:4194304,SpecialSelectNode:8388608},Pe=class v extends Event{static EVENT_TYPE="PotatnoUiManagerChangeEvent";mChangeType;mEventItem;get changeType(){return this.mChangeType}get item(){return this.mEventItem}constructor(t,e){super(v.EVENT_TYPE),this.mChangeType=t,this.mEventItem=e}};var Cr=`:host {\r
    display: block;\r
    transition: left 0.05s ease-in-out, top 0.05s ease-in-out;\r
\r
    --popup-border-color: red;\r
    --popup-shadow-color: red;\r
    --popup-background-color: red;\r
}\r
\r
.popup {\r
    display: flex;\r
    flex-direction: column;\r
\r
    border: 1px solid var(--popup-border-color);\r
    border-radius: 2px;\r
\r
    box-shadow: 0 10px 30px var(--popup-shadow-color);\r
    background-color: var(--potatno-color-background);\r
    overflow: hidden;\r
\r
    /* Animation properties */\r
    transition: opacity 0.15s ease-in-out, translate 0.15s ease-in-out;\r
    opacity: 1;\r
    translate: 0px 0px;\r
\r
    /* Animate from hidden and slightly above */\r
    @starting-style {\r
        opacity: 0;\r
    }\r
\r
\r
}\r
\r
:host([animate=top]) {\r
    .popup {\r
        @starting-style {\r
            translate: 0px -20px;\r
        }\r
    }\r
}\r
\r
:host([animate=right]) {\r
    .popup {\r
        @starting-style {\r
            translate: -20px 0px;\r
        }\r
    }\r
}\r
\r
:host([animate=bottom]) {\r
    .popup {\r
        @starting-style {\r
            translate: 0px 20px;\r
        }\r
    }\r
}\r
\r
:host([animate=right]) {\r
    .popup {\r
        @starting-style {\r
            translate: 20px 0px;\r
        }\r
    }\r
}`;var Pr=`<div class="popup">\r
    $slot\r
</div>\r
`;function sa(){function v(a,n){return function(l){e(n,"addInitializer"),r(l,"An initializer"),a.push(l)}}function t(a,n,u,l,o,b,g,D,w){var p;switch(o){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:g?"#"+n:n,static:b,private:g,metadata:D},d={v:!1};s.addInitializer=v(l,d);var i,h;o===0?g?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(T){this[n]=T}):o===2?i=function(){return u.value}:((o===1||o===3)&&(i=function(){return u.get.call(this)}),(o===1||o===4)&&(h=function(T){u.set.call(this,T)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return a(w,s)}finally{d.v=!0}}function e(a,n){if(a.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(a,n){if(typeof a!="function")throw new TypeError(n+" must be a function")}function c(a,n){var u=typeof n;if(a===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(u!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function m(a,n,u,l,o,b,g,D,w){var p=u[0],s,d,i;g?o===0||o===1?s={get:u[3],set:u[4]}:o===3?s={get:u[3]}:o===4?s={set:u[3]}:s={value:u[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var h,T,P;if(typeof p=="function")h=t(p,l,s,D,o,b,g,w,i),h!==void 0&&(c(o,h),o===0?d=h:o===1?(d=h.init,T=h.get||i.get,P=h.set||i.set,i={get:T,set:P}):i=h);else for(var M=p.length-1;M>=0;M--){var S=p[M];if(h=t(S,l,s,D,o,b,g,w,i),h!==void 0){c(o,h);var N;o===0?N=h:o===1?(N=h.init,T=h.get||i.get,P=h.set||i.set,i={get:T,set:P}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(o===0||o===1){if(d===void 0)d=function(I,E){return E};else if(typeof d!="function"){var F=d;d=function(I,E){for(var A=E,L=0;L<F.length;L++)A=F[L].call(I,A);return A}}else{var j=d;d=function(I,E){return j.call(I,E)}}a.push(d)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),g?o===1?(a.push(function(I,E){return i.get.call(I,E)}),a.push(function(I,E){return i.set.call(I,E)})):o===2?a.push(i):a.push(function(I,E){return i.call(I,E)}):Object.defineProperty(n,l,s))}function f(a,n,u){for(var l=[],o,b,g=new Map,D=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,T,P;if(h?(T=a,s=s-5,b=b||[],P=b):(T=a.prototype,o=o||[],P=o),s!==0&&!i){var M=h?D:g,S=M.get(d)||0;if(S===!0||S===3&&s!==4||S===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!S&&s>2?M.set(d,s):M.set(d,!0)}m(l,T,p,d,s,h,i,P,u)}}return y(l,o),y(l,b),l}function y(a,n){n&&a.push(function(u){for(var l=0;l<n.length;l++)n[l].call(u);return u})}function x(a,n,u){if(n.length>0){for(var l=[],o=a,b=a.name,g=n.length-1;g>=0;g--){var D={v:!1};try{var w=n[g](o,{kind:"class",name:b,addInitializer:v(l,D),metadata:u})}finally{D.v=!0}w!==void 0&&(c(10,w),o=w)}return[C(o,u),function(){for(var p=0;p<l.length;p++)l[p].call(o)}]}}function C(a,n){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,l,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(b===void 0?null:b),D=f(n,u,g);return l.length||C(n,g),{e:D,get c(){return x(n,l,g)}}}}function Nr(v,t,e,r){return(Nr=sa())(v,t,e,r)}var _r,Mr,ie;_r=X({selector:"kg-popup",template:Pr,style:Cr});var Sr=class{static{({c:[ie,Mr]}=Nr(this,[],[_r]))}static{Mr()}};var Ar=`:host {\r
    display: flex;\r
    flex-direction: column;\r
\r
    --resize-box-handle-color: red;\r
    --resize-box-handle-size: 5px;\r
}\r
\r
.resize-layer {\r
    position: relative;\r
    display: flex;\r
    flex-direction: column;\r
\r
    /* Set restrictions to never exeeds blounding restrictions set on the parent component. */\r
    min-height: 100%;\r
    min-width: 100%;\r
    max-height: 100%;\r
    max-width: 100%;\r
\r
    &.snap {\r
        /* Snappy animation on movement. */\r
        transition: width 0.1s cubic-bezier(0, 1.5, 1, 1), height 0.1s cubic-bezier(0, 1.5, 1, 1);\r
    }\r
}\r
\r
.content-container {\r
    flex: 1;\r
    display: flex;\r
    flex-direction: column;\r
    box-sizing: border-box;\r
\r
    /* Somehow this fixes overflow. Maybe min is set lower than current content size it is? */\r
    min-height: 0;\r
    min-width: 0;\r
\r
    width: 100%;\r
    height: 100%;\r
}\r
\r
.resize-handle {\r
    position: absolute;\r
    transition: border-color 0.15s;\r
    z-index: 1;\r
\r
    /* Whatever the parent does. Allways allow pointer events for handles. */\r
    pointer-events: all;\r
\r
    /*\r
     * General handle size and cursor for any direction.\r
     */\r
\r
    &.corner {\r
        /* Handle size */\r
        width: var(--resize-box-handle-size);\r
        height: var(--resize-box-handle-size);\r
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
        width: var(--resize-box-handle-size);\r
\r
        cursor: ew-resize;\r
\r
        &.hasPrevious {\r
            top: calc(5px + var(--resize-box-handle-size));\r
        }\r
\r
        &.hasNext {\r
            bottom: calc(5px + var(--resize-box-handle-size));\r
        }\r
    }\r
\r
    &.horizontal {\r
        /* Size by spanning left and right instead of height */\r
        left: 0px;\r
        right: 0px;\r
\r
        /* Handle size */\r
        height: var(--resize-box-handle-size);\r
\r
        cursor: ns-resize;\r
\r
        &.hasPrevious {\r
            left: calc(5px + var(--resize-box-handle-size));\r
        }\r
\r
        &.hasNext {\r
            right: calc(5px + var(--resize-box-handle-size));\r
        }\r
    }\r
\r
    /*\r
     * Move border into direction.\r
     */\r
\r
    &.top {\r
        top: 0px;\r
        border-top: 2px solid var(--resize-box-handle-color);\r
    }\r
\r
    &.right {\r
        right: 0px;\r
        border-right: 2px solid var(--resize-box-handle-color);\r
    }\r
\r
    &.bottom {\r
        bottom: 0px;\r
        border-bottom: 2px solid var(--resize-box-handle-color);\r
    }\r
\r
    &.left {\r
        left: 0px;\r
        border-left: 2px solid var(--resize-box-handle-color);\r
    }\r
\r
    /*\r
     * Just animations.\r
     */\r
\r
    &:hover {\r
        border-color: var(--potatno-color-accent);\r
    }\r
}`;var Lr=`<div class="resize-layer {{this.snap > 1 ? 'snap' : ''}}" style="width: {{this.transformation.width}}px; height: {{this.transformation.height}}px;">\r
    \r
    <!-- In order of top-left clockwise. Needed for styling -->\r
    $if(this.top && this.left) {\r
        <div class="resize-handle corner top left" (pointerdown)="this.resizeCorner($event)"></div>\r
    }\r
    $if(this.top) {\r
        <div class="resize-handle horizontal top {{this.left ? 'hasPrevious' : ''}} {{this.right ? 'hasNext' : ''}}" (pointerdown)="this.resizeHorizontal($event)"></div>\r
    }\r
    $if(this.top && this.right) {\r
        <div class="resize-handle corner top right" (pointerdown)="this.resizeCorner($event)"></div>\r
    }\r
    $if(this.right) {\r
        <div class="resize-handle vertical right {{this.top ? 'hasPrevious' : ''}} {{this.bottom ? 'hasNext' : ''}}" (pointerdown)="this.resizeVertical($event)"></div>\r
    }\r
    $if(this.bottom && this.right) {\r
        <div class="resize-handle corner bottom right" (pointerdown)="this.resizeCorner($event)"></div>\r
    }\r
    $if(this.bottom) {\r
        <div class="resize-handle horizontal bottom {{this.left ? 'hasPrevious' : ''}} {{this.right ? 'hasNext' : ''}}" (pointerdown)="this.resizeHorizontal($event)"></div>\r
    }\r
    $if(this.bottom && this.left) {\r
        <div class="resize-handle corner bottom left" (pointerdown)="this.resizeCorner($event)"></div>\r
    }\r
    $if(this.left) {\r
        <div class="resize-handle vertical left {{this.top ? 'hasPrevious' : ''}} {{this.bottom ? 'hasNext' : ''}}" (pointerdown)="this.resizeVertical($event)"></div>\r
    }\r
\r
    <div class="content-container {{this.top ? 'top' : ''}} {{this.bottom ? 'bottom' : ''}} {{this.left ? 'left' : ''}} {{this.right ? 'right' : ''}}">\r
        $slot\r
    </div>\r
\r
</div>\r
`;function ca(){function v(a,n){return function(l){e(n,"addInitializer"),r(l,"An initializer"),a.push(l)}}function t(a,n,u,l,o,b,g,D,w){var p;switch(o){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:g?"#"+n:n,static:b,private:g,metadata:D},d={v:!1};s.addInitializer=v(l,d);var i,h;o===0?g?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(T){this[n]=T}):o===2?i=function(){return u.value}:((o===1||o===3)&&(i=function(){return u.get.call(this)}),(o===1||o===4)&&(h=function(T){u.set.call(this,T)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return a(w,s)}finally{d.v=!0}}function e(a,n){if(a.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(a,n){if(typeof a!="function")throw new TypeError(n+" must be a function")}function c(a,n){var u=typeof n;if(a===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(u!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function m(a,n,u,l,o,b,g,D,w){var p=u[0],s,d,i;g?o===0||o===1?s={get:u[3],set:u[4]}:o===3?s={get:u[3]}:o===4?s={set:u[3]}:s={value:u[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var h,T,P;if(typeof p=="function")h=t(p,l,s,D,o,b,g,w,i),h!==void 0&&(c(o,h),o===0?d=h:o===1?(d=h.init,T=h.get||i.get,P=h.set||i.set,i={get:T,set:P}):i=h);else for(var M=p.length-1;M>=0;M--){var S=p[M];if(h=t(S,l,s,D,o,b,g,w,i),h!==void 0){c(o,h);var N;o===0?N=h:o===1?(N=h.init,T=h.get||i.get,P=h.set||i.set,i={get:T,set:P}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(o===0||o===1){if(d===void 0)d=function(I,E){return E};else if(typeof d!="function"){var F=d;d=function(I,E){for(var A=E,L=0;L<F.length;L++)A=F[L].call(I,A);return A}}else{var j=d;d=function(I,E){return j.call(I,E)}}a.push(d)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),g?o===1?(a.push(function(I,E){return i.get.call(I,E)}),a.push(function(I,E){return i.set.call(I,E)})):o===2?a.push(i):a.push(function(I,E){return i.call(I,E)}):Object.defineProperty(n,l,s))}function f(a,n,u){for(var l=[],o,b,g=new Map,D=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,T,P;if(h?(T=a,s=s-5,b=b||[],P=b):(T=a.prototype,o=o||[],P=o),s!==0&&!i){var M=h?D:g,S=M.get(d)||0;if(S===!0||S===3&&s!==4||S===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!S&&s>2?M.set(d,s):M.set(d,!0)}m(l,T,p,d,s,h,i,P,u)}}return y(l,o),y(l,b),l}function y(a,n){n&&a.push(function(u){for(var l=0;l<n.length;l++)n[l].call(u);return u})}function x(a,n,u){if(n.length>0){for(var l=[],o=a,b=a.name,g=n.length-1;g>=0;g--){var D={v:!1};try{var w=n[g](o,{kind:"class",name:b,addInitializer:v(l,D),metadata:u})}finally{D.v=!0}w!==void 0&&(c(10,w),o=w)}return[C(o,u),function(){for(var p=0;p<l.length;p++)l[p].call(o)}]}}function C(a,n){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,l,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(b===void 0?null:b),D=f(n,u,g);return l.length||C(n,g),{e:D,get c(){return x(n,l,g)}}}}function Gr(v,t,e,r){return(Gr=ca())(v,t,e,r)}var Br,Rr,Ur,Xr,Hr,Yr,Or,Fr,zr,jr,Vr,Pt;Br=X({selector:"kg-resize-box",template:Lr,style:Ar}),Ur=$.state({proxy:!0}),Xr=ft("resize"),Hr=ft("resize-end"),Yr=$.state({proxy:!0});var $r=class{static{({e:[Or,Fr,zr,jr,Vr],c:[Pt,Rr]}=Gr(this,[[Ur,1,"mConfiguration"],[Xr,1,"mResize"],[Hr,1,"mResizeEnd"],[Yr,1,"transformation"],[W,3,"bottom"],[W,3,"height"],[W,3,"left"],[W,3,"right"],[W,3,"snap"],[W,3,"top"],[W,3,"virtual"],[W,3,"width"]],[Br]))}constructor(t=O.use(G)){this.mComponentElement=t.element,this.transformation={width:NaN,height:NaN},this.mConfiguration={snap:1,isVirtual:!1,enabledDirections:{top:!1,right:!1,bottom:!1,left:!1}}}mComponentElement;#t=(Vr(this),Or(this));get mConfiguration(){return this.#t}set mConfiguration(t){this.#t=t}#e=Fr(this);get mResize(){return this.#e}set mResize(t){this.#e=t}#o=zr(this);get mResizeEnd(){return this.#o}set mResizeEnd(t){this.#o=t}#r=jr(this);get transformation(){return this.#r}set transformation(t){this.#r=t}get bottom(){return this.mConfiguration.enabledDirections.bottom}set bottom(t){this.mConfiguration.enabledDirections.bottom=this.parseBoolean(t)}get height(){return this.transformation.height}set height(t){this.updateComponentHeight(t,!0)}get left(){return this.mConfiguration.enabledDirections.left}set left(t){this.mConfiguration.enabledDirections.left=this.parseBoolean(t)}get right(){return this.mConfiguration.enabledDirections.right}set right(t){this.mConfiguration.enabledDirections.right=this.parseBoolean(t)}get snap(){return this.mConfiguration.snap}set snap(t){this.mConfiguration.snap=parseInt(t.toString())}get top(){return this.mConfiguration.enabledDirections.top}set top(t){this.mConfiguration.enabledDirections.top=this.parseBoolean(t)}get virtual(){return this.mConfiguration.isVirtual}set virtual(t){this.mConfiguration.isVirtual=this.parseBoolean(t)}get width(){return this.transformation.width}set width(t){this.updateComponentWidth(t,!0)}resizeCorner(t){this.handleResize(t,"both")}resizeHorizontal(t){this.handleResize(t,"horizontal")}resizeVertical(t){this.handleResize(t,"vertical")}applyComponentSize(t,e,r){let c=this.updateComponentWidth(e,!1),m=this.updateComponentHeight(r,!1);return(c!==this.transformation.width||m!==this.transformation.height)&&this.mResize.dispatchEvent(this.createResizeEvent(t,c,m,this.transformation.width,this.transformation.height)),[c,m]}createResizeEvent(t,e,r,c,m){let f=t;return e===c&&(f&=~(vt.right|vt.left)),r===m&&(f&=~(vt.top|vt.bottom)),new ke(e,r,f)}handleResize(t,e){t.preventDefault(),t.stopPropagation();let r=this.mComponentElement.getBoundingClientRect(),c=this.mComponentElement.offsetWidth?r.width/this.mComponentElement.offsetWidth:1,m=this.mComponentElement.offsetHeight?r.height/this.mComponentElement.offsetHeight:1,f=r.width/c,y=r.height/m,x=t.clientX,C=t.clientY,a=1;Math.abs(x-r.left)<Math.abs(x-r.right)&&(a=-1);let n=1;Math.abs(C-r.top)<Math.abs(C-r.bottom)&&(n=-1);let u=0;u+=a===1?vt.right:vt.left,u+=n===1?vt.bottom:vt.top;let l=f,o=y,b=D=>{let w=(D.clientX-x)/c*a,p=(D.clientY-C)/m*n,s=f+w,d=y+p;e==="horizontal"&&(s=f),e==="vertical"&&(d=y),[l,o]=this.applyComponentSize(u,s,d)},g=()=>{document.removeEventListener("pointermove",b),document.removeEventListener("pointerup",g),(l!==f||o!==y)&&this.mResizeEnd.dispatchEvent(this.createResizeEvent(u,l,o,f,y))};document.addEventListener("pointermove",b),document.addEventListener("pointerup",g)}parseBoolean(t){return!!(()=>{if(typeof t=="string"){let r=t.toLowerCase();if(["true","false"].includes(r))return r==="true"}return t})()}updateComponentHeight(t,e){if(!this.mConfiguration.enabledDirections.top&&!this.mConfiguration.enabledDirections.bottom)return this.transformation.height;t=Math.max(1,t);let r=Math.ceil(Math.abs(t)/this.mConfiguration.snap)*this.mConfiguration.snap*(t/Math.abs(t));return r=Math.max(0,r),(!this.mConfiguration.isVirtual||e)&&(this.transformation.height=r),r}updateComponentWidth(t,e){if(!this.mConfiguration.enabledDirections.left&&!this.mConfiguration.enabledDirections.right)return this.transformation.height;t=Math.max(1,t);let r=Math.ceil(Math.abs(t)/this.mConfiguration.snap)*this.mConfiguration.snap*(t/Math.abs(t));return r=Math.max(0,r),(!this.mConfiguration.isVirtual||e)&&(this.transformation.width=r),r}static{Rr()}},ke=class{mHeight;mResizeHandle;mWidth;get height(){return this.mHeight}get resizeHandle(){return this.mResizeHandle}get width(){return this.mWidth}constructor(t,e,r){this.mHeight=e,this.mResizeHandle=r,this.mWidth=t}},vt={top:1,right:2,bottom:4,left:8};var Wr=`:host {\r
    display: flex;\r
    flex-direction: column;\r
    height: 100%;\r
    overflow: hidden;\r
}\r
\r
.resize-box {\r
    --resize-box-handle-color: var(--potatno-color-border);\r
\r
    height: 100%;\r
    background-color: var(--potatno-color-background-dark);\r
\r
    /* Set min, max and default width */\r
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
    transition: background-color 0.15s, scale 0.15s;\r
\r
    &.active,\r
    &:active {\r
        background-color: var(--potatno-color-background-light);\r
    }\r
\r
    &:active {\r
        scale: 0.98;\r
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
        transition: border-color 0.15s;\r
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
        color: var(--potatno-color-text);\r
\r
        /* Cool hover transitions... It literally sucks. */\r
        transition: background-color 0.15s;\r
\r
        &:hover {\r
            background-color: color-mix(in srgb, var(--potatno-color-error) 75%, var(--potatno-color-background));\r
        }\r
\r
        &:active {\r
            background-color: color-mix(in srgb, var(--potatno-color-error) 50%, var(--potatno-color-background));\r
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
    cursor: pointer;\r
\r
    /* Transition items. */\r
    border: 1px dashed var(--potatno-color-border);\r
    border-radius: 2px;\r
    color: var(--potatno-color-text);\r
    background-color: var(--potatno-color-background-light);\r
\r
    transition: border-color 0.15s, color 0.15s, background-color 0.15s, scale 0.15s;\r
\r
    &:hover {\r
        border-color: var(--potatno-color-accent);\r
        color: var(--potatno-color-accent);\r
    }\r
\r
    &:active {\r
        background-color: var(--potatno-color-background);\r
        scale: 0.98;\r
    }\r
}\r
\r
.popup {\r
    --popup-border-color: var(--potatno-color-border);\r
    --popup-shadow-color: var(--potatno-color-shadow);\r
    --popup-background-color: var(--potatno-color-background-light);\r
\r
    position: absolute;\r
    bottom: calc(100% + 8px);\r
    left: 8px;\r
    right: 8px;\r
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
        transition: color 0.15s, background-color 0.15s, scale 0.15s;\r
\r
        &:hover {\r
            color: var(--potatno-color-accent);\r
        }\r
\r
        &:active {\r
            background-color: var(--potatno-color-background);\r
            scale: 0.98;\r
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
            transition: border-color 0.15s;\r
\r
            .popup__item:hover & {\r
                border-color: var(--potatno-color-accent);\r
            }\r
        }\r
    }\r
}`;var Zr=`<kg-resize-box class="resize-box" right="true" width="250">\r
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
        <div class="list-actions" tabindex="-1" (focusout)="this.showPopup = false">\r
\r
            $if(this.showPopup) {\r
                <kg-popup class="popup" animate="bottom">\r
                    <div class="popup__header">Select Function Type</div>\r
                    $for(functionDefinition of this.userFunctionDefinitions) {\r
                        <div class="popup__item" (click)="this.createFunction(this.functionDefinition)">\r
                            <div class="icon">\u0192</div>\r
                            <div>{{this.functionDefinition.label}}</div>\r
                        </div>\r
                    }\r
                </kg-popup>\r
            }\r
\r
            <div class="add-action" (click)="this.showPopup = !this.showPopup">\r
                <div>+</div>\r
                <div>Add Function</div>\r
            </div>\r
        </div>\r
    }\r
</kg-resize-box>\r
`;function da(){function v(a,n){return function(l){e(n,"addInitializer"),r(l,"An initializer"),a.push(l)}}function t(a,n,u,l,o,b,g,D,w){var p;switch(o){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:g?"#"+n:n,static:b,private:g,metadata:D},d={v:!1};s.addInitializer=v(l,d);var i,h;o===0?g?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(T){this[n]=T}):o===2?i=function(){return u.value}:((o===1||o===3)&&(i=function(){return u.get.call(this)}),(o===1||o===4)&&(h=function(T){u.set.call(this,T)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return a(w,s)}finally{d.v=!0}}function e(a,n){if(a.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(a,n){if(typeof a!="function")throw new TypeError(n+" must be a function")}function c(a,n){var u=typeof n;if(a===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(u!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function m(a,n,u,l,o,b,g,D,w){var p=u[0],s,d,i;g?o===0||o===1?s={get:u[3],set:u[4]}:o===3?s={get:u[3]}:o===4?s={set:u[3]}:s={value:u[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var h,T,P;if(typeof p=="function")h=t(p,l,s,D,o,b,g,w,i),h!==void 0&&(c(o,h),o===0?d=h:o===1?(d=h.init,T=h.get||i.get,P=h.set||i.set,i={get:T,set:P}):i=h);else for(var M=p.length-1;M>=0;M--){var S=p[M];if(h=t(S,l,s,D,o,b,g,w,i),h!==void 0){c(o,h);var N;o===0?N=h:o===1?(N=h.init,T=h.get||i.get,P=h.set||i.set,i={get:T,set:P}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(o===0||o===1){if(d===void 0)d=function(I,E){return E};else if(typeof d!="function"){var F=d;d=function(I,E){for(var A=E,L=0;L<F.length;L++)A=F[L].call(I,A);return A}}else{var j=d;d=function(I,E){return j.call(I,E)}}a.push(d)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),g?o===1?(a.push(function(I,E){return i.get.call(I,E)}),a.push(function(I,E){return i.set.call(I,E)})):o===2?a.push(i):a.push(function(I,E){return i.call(I,E)}):Object.defineProperty(n,l,s))}function f(a,n,u){for(var l=[],o,b,g=new Map,D=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,T,P;if(h?(T=a,s=s-5,b=b||[],P=b):(T=a.prototype,o=o||[],P=o),s!==0&&!i){var M=h?D:g,S=M.get(d)||0;if(S===!0||S===3&&s!==4||S===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!S&&s>2?M.set(d,s):M.set(d,!0)}m(l,T,p,d,s,h,i,P,u)}}return y(l,o),y(l,b),l}function y(a,n){n&&a.push(function(u){for(var l=0;l<n.length;l++)n[l].call(u);return u})}function x(a,n,u){if(n.length>0){for(var l=[],o=a,b=a.name,g=n.length-1;g>=0;g--){var D={v:!1};try{var w=n[g](o,{kind:"class",name:b,addInitializer:v(l,D),metadata:u})}finally{D.v=!0}w!==void 0&&(c(10,w),o=w)}return[C(o,u),function(){for(var p=0;p<l.length;p++)l[p].call(o)}]}}function C(a,n){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,l,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(b===void 0?null:b),D=f(n,u,g);return l.length||C(n,g),{e:D,get c(){return x(n,l,g)}}}}function tn(v,t,e,r){return(tn=da())(v,t,e,r)}var en,qr,on,rn,Jr,Kr,Qr,wo;en=X({selector:"potatno-function-list",template:Zr,style:Wr,components:[Pt,ie]}),on=$.state({complexValue:!0}),rn=$.state();var kr=class{static{({e:[Jr,Kr,Qr],c:[wo,qr]}=tn(this,[[on,1,"documentFunctions"],[rn,1,"showPopup"]],[en]))}constructor(t=O.use(H)){this.mManager=t,this.documentFunctions=new Array,this.showPopup=!1,this.mUnsubscribe=this.mManager.subscribe(R.Document|R.Function|R.SpecialActiveFunction,()=>{this.documentFunctions=this.mManager.graph.document.functions.map(e=>({id:e.id,label:e.label,isSystem:e.isSystem,function:e}))})}mManager;mUnsubscribe;#t=(Qr(this),Jr(this));get documentFunctions(){return this.#t}set documentFunctions(t){this.#t=t}#e=Kr(this);get showPopup(){return this.#e}set showPopup(t){this.#e=t}get activeFunctionId(){return this.mManager.activeFunction.id}get userFunctionDefinitions(){return[...this.mManager.project.userFunctions.values()]}createFunction(t){this.showPopup=!1,this.mManager.graph.addFunction(t.id)}deleteFunction(t){this.mManager.graph.removeFunction(t.id)}onDeconstruct(){this.mUnsubscribe()}selectFunction(t){this.mManager.setActiveFunction(t.function)}static{qr()}};var nn=`:host {\r
    position: absolute;\r
    z-index: 200;\r
\r
    transition: left 0.05s ease-in-out, top 0.05s ease-in-out;\r
}\r
\r
.selection-popup {\r
    --popup-border-color: var(--potatno-color-border);\r
    --popup-shadow-color: var(--potatno-color-shadow);\r
    --popup-background-color: var(--potatno-color-background);\r
\r
    /* Fixed values also defined as constants in the component itself!!! */\r
    max-height: 320px;\r
    width: 280px;\r
\r
    /* Font should cascade into child ... except inputs :( */\r
    font-family: var(--potatno-font-family);\r
    font-size: var(--potatno-font-size);\r
\r
    .selection-popup__search {\r
        width: 100%;\r
        box-sizing: border-box;\r
        padding: 8px 10px;\r
        outline: none;\r
\r
        /* Mistreat border as fake background. */\r
        border: 5px solid var(--potatno-color-background-light);\r
\r
        color: var(--potatno-color-text);\r
        background-color: var(--potatno-color-background);\r
\r
        font-family: var(--potatno-font-family);\r
        font-size: var(--potatno-font-size);\r
    }\r
\r
    .selection-popup__results {\r
        max-height: 280px;\r
        overflow-x: hidden;\r
        overflow-y: auto;\r
        padding: 4px 0;\r
        border-top: 2px solid var(--potatno-color-accent);\r
\r
        scrollbar-color: var(--potatno-color-scrollbar-thumb) var(--potatno-color-scrollbar-track);\r
        scrollbar-width: thin;\r
    }\r
\r
    .selection-popup__result {\r
        --item-color: var(--potatno-color-text);\r
\r
        display: flex;\r
        box-sizing: border-box;\r
        width: 100%;\r
        padding: 5px 9px;\r
        align-items: center;\r
        color: var(--potatno-color-text);\r
        text-align: left;\r
        cursor: pointer;\r
\r
        transition: scale 0.15s;\r
\r
        &:hover,\r
        &.selected {\r
            background-color: var(--potatno-color-background-light);\r
        }\r
\r
        &:active {\r
            scale: 0.98;\r
        }\r
\r
        .selection-popup__result-icon {\r
            display: flex;\r
            align-items: center;\r
            padding: 0 10px;\r
            width: 1ch;\r
            height: 25px;\r
\r
            color: var(--potatno-color-accent);\r
            border-left: 3px solid var(--item-color);\r
        }\r
\r
        .selection-popup__result-label {\r
            flex: 1;\r
            padding: 0 8px 0 0;\r
            overflow: hidden;\r
            text-overflow: ellipsis;\r
            white-space: nowrap;\r
        }\r
\r
        .selection-popup__result-category {\r
            flex-shrink: 0;\r
            font-size: var(--potatno-font-size-small);\r
            text-transform: capitalize;\r
\r
            /* Darken text color by mixing in the background colorl */\r
            color: color-mix(in srgb, var(--potatno-color-text) 50%, var(--potatno-color-background-dark));\r
        }\r
    }\r
\r
    .selection-popup__empty {\r
        padding: 14px 10px;\r
        text-align: center;\r
        font-size: var(--potatno-font-size-small);\r
\r
        /* Darken text color by mixing in the background colorl */\r
        color: color-mix(in srgb, var(--potatno-color-text) 50%, var(--potatno-color-background-dark));\r
    }\r
}`;var sn=`<kg-popup class="selection-popup" animate="top" (pointerdown)="this.stopPropagation($event, false)" (wheel)="this.stopPropagation($event, false)" (contextmenu)="this.stopPropagation($event, true);">\r
\r
    <input #searchInput type="text" placeholder="Search nodes..." class="selection-popup__search" [(value)]="this.searchValue" (keydown)="this.onKeyDown($event)" />\r
    <div class="selection-popup__results">\r
        $for(entry of this.results) {\r
            <div class="selection-popup__result {{this.entry.definition.id === this.selectedDefinitionId ? 'selected' : ''}}" (click)="this.sendSelectedEntry(this.entry.definition.id)" style="--item-color: {{this.entry.color}}" tabindex="-1">\r
                <span class="selection-popup__result-icon">{{this.entry.icon}}</span>\r
                <span class="selection-popup__result-label">{{this.entry.label}}</span>\r
                <span class="selection-popup__result-category">{{this.entry.category}}</span>\r
            </div>\r
        }\r
        $if(this.results.length === 0) {\r
            <div class="selection-popup__empty">No matching nodes found.</div>\r
        }\r
    </div>\r
\r
</kg-popup>\r
`;function fa(){function v(a,n){return function(l){e(n,"addInitializer"),r(l,"An initializer"),a.push(l)}}function t(a,n,u,l,o,b,g,D,w){var p;switch(o){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:g?"#"+n:n,static:b,private:g,metadata:D},d={v:!1};s.addInitializer=v(l,d);var i,h;o===0?g?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(T){this[n]=T}):o===2?i=function(){return u.value}:((o===1||o===3)&&(i=function(){return u.get.call(this)}),(o===1||o===4)&&(h=function(T){u.set.call(this,T)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return a(w,s)}finally{d.v=!0}}function e(a,n){if(a.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(a,n){if(typeof a!="function")throw new TypeError(n+" must be a function")}function c(a,n){var u=typeof n;if(a===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(u!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function m(a,n,u,l,o,b,g,D,w){var p=u[0],s,d,i;g?o===0||o===1?s={get:u[3],set:u[4]}:o===3?s={get:u[3]}:o===4?s={set:u[3]}:s={value:u[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var h,T,P;if(typeof p=="function")h=t(p,l,s,D,o,b,g,w,i),h!==void 0&&(c(o,h),o===0?d=h:o===1?(d=h.init,T=h.get||i.get,P=h.set||i.set,i={get:T,set:P}):i=h);else for(var M=p.length-1;M>=0;M--){var S=p[M];if(h=t(S,l,s,D,o,b,g,w,i),h!==void 0){c(o,h);var N;o===0?N=h:o===1?(N=h.init,T=h.get||i.get,P=h.set||i.set,i={get:T,set:P}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(o===0||o===1){if(d===void 0)d=function(I,E){return E};else if(typeof d!="function"){var F=d;d=function(I,E){for(var A=E,L=0;L<F.length;L++)A=F[L].call(I,A);return A}}else{var j=d;d=function(I,E){return j.call(I,E)}}a.push(d)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),g?o===1?(a.push(function(I,E){return i.get.call(I,E)}),a.push(function(I,E){return i.set.call(I,E)})):o===2?a.push(i):a.push(function(I,E){return i.call(I,E)}):Object.defineProperty(n,l,s))}function f(a,n,u){for(var l=[],o,b,g=new Map,D=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,T,P;if(h?(T=a,s=s-5,b=b||[],P=b):(T=a.prototype,o=o||[],P=o),s!==0&&!i){var M=h?D:g,S=M.get(d)||0;if(S===!0||S===3&&s!==4||S===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!S&&s>2?M.set(d,s):M.set(d,!0)}m(l,T,p,d,s,h,i,P,u)}}return y(l,o),y(l,b),l}function y(a,n){n&&a.push(function(u){for(var l=0;l<n.length;l++)n[l].call(u);return u})}function x(a,n,u){if(n.length>0){for(var l=[],o=a,b=a.name,g=n.length-1;g>=0;g--){var D={v:!1};try{var w=n[g](o,{kind:"class",name:b,addInitializer:v(l,D),metadata:u})}finally{D.v=!0}w!==void 0&&(c(10,w),o=w)}return[C(o,u),function(){for(var p=0;p<l.length;p++)l[p].call(o)}]}}function C(a,n){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,l,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(b===void 0?null:b),D=f(n,u,g);return l.length||C(n,g),{e:D,get c(){return x(n,l,g)}}}}function pn(v,t,e,r){return(pn=fa())(v,t,e,r)}function ga(v){return v}var fn,an,gn,vn,yn,bn,wn,ln,cn,un,hn,dn,mn,se;fn=X({selector:"potatno-node-selection-popup",template:sn,style:nn,components:[ie]}),gn=$.state({complexValue:!0}),vn=gt("searchInput"),yn=ft("node-select"),bn=$.state(),wn=$.state();new class extends ga{constructor(){super(se),an()}static{class v{static{({e:[ln,cn,un,hn,dn,mn],c:[se,an]}=pn(this,[[gn,1,"results"],[vn,1,"searchInput"],[yn,1,"mNodeSelect"],[bn,1,"searchValue"],[wn,1,"selectedDefinitionId"]],[fn]))}static POPUP_HEIGHT=320;static POPUP_WIDTH=280;mAvailableEntries;mComponent;mManager;#t=(mn(this),ln(this));get results(){return this.#t}set results(e){this.#t=e}#e=cn(this);get searchInput(){return this.#e}set searchInput(e){this.#e=e}#o=un(this);get mNodeSelect(){return this.#o}set mNodeSelect(e){this.#o=e}#r=hn(this);get searchValue(){return this.#r}set searchValue(e){this.#r=e}#n=dn(this);get selectedDefinitionId(){return this.#n}set selectedDefinitionId(e){this.#n=e}constructor(e=O.use(G),r=O.use(H)){this.mManager=r,this.mComponent=e,this.mAvailableEntries=this.fetchNodeEntries(),this.selectedDefinitionId=null,this.results=new Array,this.searchValue=""}onConnect(){this.searchInput?.focus()}onKeyDown(e){if(this.results.length!==0){if(e.key==="ArrowDown"||e.key==="ArrowUp"){e.preventDefault();let r=this.results.findIndex(f=>f.definition.id===this.selectedDefinitionId);r=Math.max(0,r);let c=e.key==="ArrowDown"?1:-1,m=(r+c+this.results.length)%this.results.length;this.selectedDefinitionId=this.results[m].definition.id;return}e.key==="Enter"&&this.sendSelectedEntry(this.selectedDefinitionId)}}onUpdate(){this.results=this.filterResults(),this.results.some(r=>r.definition.id===this.selectedDefinitionId)||(this.selectedDefinitionId=this.results[0]?.definition.id??null);let e=this.mComponent.element.shadowRoot.querySelector(".selection-popup__result.selected");e&&e.scrollIntoView()}stopPropagation(e,r){e.stopPropagation(),r&&e.preventDefault()}fetchNodeEntries(){return this.mManager.activeFunction.dynamicNodeDefinitions.map(e=>({category:e.category.name,definition:e,label:e.label.toLowerCase(),color:this.mManager.generateStringColor(e.category.name),icon:e.category.icon}))}filterResults(){let e=this.searchValue.trim().toLowerCase();return this.mAvailableEntries.filter(r=>r.label.includes(e))}sendSelectedEntry(e){if(e===null)return;let r=this.results.find(c=>c.definition.id===e);r&&this.mNodeSelect.dispatchEvent(r.definition)}}}};var xn=`:host {\r
    display: block;\r
    font-family: var(--potatno-font-family);\r
    font-size: var(--potatno-font-size);\r
\r
    /* Snappy animation on movement. */\r
    transition: var(--potatno-position-snap-animation);\r
\r
    /* Default z-index. Gets overridden on zoom out.*/\r
    z-index: -1;\r
\r
    --node-border-radius: 2px;\r
    --node-border-color: color-mix(in srgb, var(--potatno-color-text) 30%, var(--potatno-color-background));\r
    --node-comment-color: var(--potatno-color-accent);\r
\r
    /* Hear me out. */\r
    /* By restricting the height to a single row, the overlapping content does not register or block pointer actions. */\r
    height: var(--potatno-grid-size);\r
}\r
\r
.node {\r
    --resize-box-handle-color: var(--potatno-color-border);\r
\r
    box-sizing: border-box;\r
    display: flex;\r
    flex-direction: column;\r
    min-height: 100%;\r
\r
    overflow: visible;\r
    user-select: none;\r
\r
    /* Disable pointer events. Enabled in header and resize handles again. */\r
    pointer-events: none;\r
\r
    /* Number is not actually the percentage, more of a state */\r
    --background-100-color: var(--node-comment-color);\r
    --background-50-color: color-mix(in srgb, var(--background-100-color) 25%, transparent);\r
    --background-10-color: color-mix(in srgb, var(--background-100-color) 5%, transparent);\r
\r
    background-color: var(--background-10-color);\r
    background-image: linear-gradient(180deg, var(--background-100-color) 0px, var(--background-50-color) calc(var(--potatno-grid-size) * 2), transparent 100%);\r
\r
    &.edit {\r
        --node-comment-color: var(--potatno-color-background);\r
        background-color: var(--potatno-color-background);\r
    }\r
}\r
\r
.node-header {\r
    display: flex;\r
    align-items: center;\r
    color: var(--potatno-color-text-contrast);\r
    font-weight: bold;\r
    font-size: var(--potatno-font-size-small);\r
    cursor: grab;\r
\r
    /* Disabled in node. Enabled again. */\r
    pointer-events: all;\r
\r
    /* Move only the header out of the resize handle visible range. +2 for the exit border so it doesnt shift on edit mode. */\r
    margin: 3px 3px 0 3px;\r
    height: calc(var(--potatno-grid-size) - 2px);\r
\r
    &:active {\r
        cursor: grabbing;\r
    }\r
\r
    .edit & {\r
        background-color: var(--potatno-color-background-light);\r
        border: 1px solid var(--potatno-color-accent);\r
        border-radius: 2px;\r
        margin: 2px 2px 0 2px;\r
    }\r
\r
    .node-header__icon {\r
        flex-shrink: 0;\r
        display: flex;\r
        align-items: center;\r
        justify-content: center;\r
        width: calc(var(--potatno-grid-size) - 2px);\r
    }\r
\r
    .node-header__comment {\r
        flex: 1;\r
        white-space: nowrap;\r
        overflow: hidden;\r
        text-overflow: ellipsis;\r
    }\r
\r
    .node-header__comment-edit {\r
        flex: 1;\r
\r
        /* Completly reset anything. */\r
        height: 100%;\r
        min-width: 0;\r
        padding: 0;\r
        margin: 0;\r
        border: none;\r
        outline: 1px transparent;\r
        background-color: transparent;\r
\r
        /* Input boxes override anything :( */\r
        color: var(--potatno-color-text-contrast);\r
        font-weight: bold;\r
        font-size: var(--potatno-font-size-small);\r
    }\r
}\r
\r
.node-body {\r
    flex: 1;\r
}\r
\r
.satellite-view {\r
    --zoom-factor: 1;\r
    --comment-node-height: 6;\r
    --comment-node-width: 6;\r
\r
    /* Let the text overflow */\r
    display: none;\r
    align-items: center;\r
    justify-content: center;\r
\r
    color: white;\r
    position: absolute;\r
    top: 0;\r
    left: 0;\r
    width: calc(var(--potatno-grid-size) * var(--comment-node-width));\r
    height: calc(var(--potatno-grid-size) * var(--comment-node-height));\r
\r
    /* Disable all interaction. */\r
    user-select: none;\r
    pointer-events: none;\r
\r
    /* Let the text overflow */\r
    &.enabled {\r
        display: flex;\r
    }\r
\r
    .satellite-view__text {\r
        /* Ellipsis after 2 lines */\r
        display: -webkit-box;\r
        line-clamp: 2;\r
        -webkit-line-clamp: 2;\r
        -webkit-box-orient: vertical;\r
        overflow: hidden;\r
\r
        /* Automatic sizing text based on zoomlevel. */\r
        line-height: calc(40px / var(--zoom-factor));\r
        font-size: calc(40px / var(--zoom-factor));\r
        font-weight: bold;\r
        text-align: center;\r
        text-shadow: 0.05em 0.05em 0.2em #000000;\r
    }\r
}`;var Tn=`<!-- Resizeable part of node -->\r
<kg-resize-box #ResizeBox class="node {{this.editMode ? 'edit' : ''}}" [top]="true" [right]="true" [bottom]="true" [left]="true" [snap]="this.gridSize" [virtual]="true" (resize)="this.transformNodeData($event.value)">\r
    <div class="node-header" (pointerdown)="this.dragNodeOrEnableEdit($event)" (dblclick)="this.editMode = true;">\r
        <span class="node-header__icon">\u270E</span>\r
\r
        $if(this.editMode) {\r
            <input #CommentInput class="node-header__comment-edit" [(value)]="this.comment" (blur)="this.editMode = false;" (keydown)="this.escapeEditMode($event)"/>\r
        }\r
        $if(!this.editMode) {\r
            <span class="node-header__comment">{{this.comment}}</span>\r
        }\r
        \r
    </div>\r
\r
    <div class="node-body"/>\r
</kg-resize-box>\r
\r
<div style="--zoom-factor: {{this.gridZoom}}; --comment-node-height: {{this.nodeData?.transformation.height}}; --comment-node-width: {{this.nodeData?.transformation.width}};" class="satellite-view {{this.enableBigview ? 'enabled' : ''}}">\r
    <!-- Div needed to decouple inner text from size restriction of satellite-view flex -->\r
    <div>\r
        <div class="satellite-view__text">{{this.comment}}</div>\r
    </div>\r
</div>\r
`;function ba(){function v(a,n){return function(l){e(n,"addInitializer"),r(l,"An initializer"),a.push(l)}}function t(a,n,u,l,o,b,g,D,w){var p;switch(o){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:g?"#"+n:n,static:b,private:g,metadata:D},d={v:!1};s.addInitializer=v(l,d);var i,h;o===0?g?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(T){this[n]=T}):o===2?i=function(){return u.value}:((o===1||o===3)&&(i=function(){return u.get.call(this)}),(o===1||o===4)&&(h=function(T){u.set.call(this,T)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return a(w,s)}finally{d.v=!0}}function e(a,n){if(a.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(a,n){if(typeof a!="function")throw new TypeError(n+" must be a function")}function c(a,n){var u=typeof n;if(a===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(u!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function m(a,n,u,l,o,b,g,D,w){var p=u[0],s,d,i;g?o===0||o===1?s={get:u[3],set:u[4]}:o===3?s={get:u[3]}:o===4?s={set:u[3]}:s={value:u[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var h,T,P;if(typeof p=="function")h=t(p,l,s,D,o,b,g,w,i),h!==void 0&&(c(o,h),o===0?d=h:o===1?(d=h.init,T=h.get||i.get,P=h.set||i.set,i={get:T,set:P}):i=h);else for(var M=p.length-1;M>=0;M--){var S=p[M];if(h=t(S,l,s,D,o,b,g,w,i),h!==void 0){c(o,h);var N;o===0?N=h:o===1?(N=h.init,T=h.get||i.get,P=h.set||i.set,i={get:T,set:P}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(o===0||o===1){if(d===void 0)d=function(I,E){return E};else if(typeof d!="function"){var F=d;d=function(I,E){for(var A=E,L=0;L<F.length;L++)A=F[L].call(I,A);return A}}else{var j=d;d=function(I,E){return j.call(I,E)}}a.push(d)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),g?o===1?(a.push(function(I,E){return i.get.call(I,E)}),a.push(function(I,E){return i.set.call(I,E)})):o===2?a.push(i):a.push(function(I,E){return i.call(I,E)}):Object.defineProperty(n,l,s))}function f(a,n,u){for(var l=[],o,b,g=new Map,D=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,T,P;if(h?(T=a,s=s-5,b=b||[],P=b):(T=a.prototype,o=o||[],P=o),s!==0&&!i){var M=h?D:g,S=M.get(d)||0;if(S===!0||S===3&&s!==4||S===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!S&&s>2?M.set(d,s):M.set(d,!0)}m(l,T,p,d,s,h,i,P,u)}}return y(l,o),y(l,b),l}function y(a,n){n&&a.push(function(u){for(var l=0;l<n.length;l++)n[l].call(u);return u})}function x(a,n,u){if(n.length>0){for(var l=[],o=a,b=a.name,g=n.length-1;g>=0;g--){var D={v:!1};try{var w=n[g](o,{kind:"class",name:b,addInitializer:v(l,D),metadata:u})}finally{D.v=!0}w!==void 0&&(c(10,w),o=w)}return[C(o,u),function(){for(var p=0;p<l.length;p++)l[p].call(o)}]}}function C(a,n){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,l,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(b===void 0?null:b),D=f(n,u,g);return l.length||C(n,g),{e:D,get c(){return x(n,l,g)}}}}function An(v,t,e,r){return(An=ba())(v,t,e,r)}var Ln,Dn,Rn,On,Fn,zn,jn,Vn,En,In,Cn,Pn,Mn,Sn,Nn,To;Ln=X({selector:"potatno-comment-node",template:Tn,style:xn,components:[Pt]}),Rn=$.state(),On=$.state(),Fn=$.state(),zn=gt("CommentInput"),jn=ft("node-drag"),Vn=gt("ResizeBox");var _n=class{static{({e:[En,In,Cn,Pn,Mn,Sn,Nn],c:[To,Dn]}=An(this,[[Rn,1,"editMode"],[On,1,"enableBigview"],[Fn,1,"gridZoom"],[W,3,"nodeData"],[zn,1,"mCommentInput"],[jn,1,"mDrag"],[Vn,1,"mResizeBox"]],[Ln]))}constructor(t=O.use(G),e=O.use(H)){this.mComponent=t,this.mManager=e,this.mNodeData=null,this.editMode=!1,this.enableBigview=!1,this.gridZoom=0,this.updateForZoomLevel(),this.mUnsubscribeGrid=this.mManager.subscribe(R.SpecialGrid,()=>{this.updateForZoomLevel()}),this.mUnsubscribe=this.mManager.subscribe(R.Node,r=>{r.item===this.mNodeData&&this.resyncComponent(this.nodeData)})}mComponent;mManager;mNodeData;mUnsubscribe;mUnsubscribeGrid;get comment(){return this.nodeData.label??""}set comment(t){this.nodeData.label=t}#t=(Nn(this),En(this));get editMode(){return this.#t}set editMode(t){this.#t=t}#e=In(this);get enableBigview(){return this.#e}set enableBigview(t){this.#e=t}#o=Cn(this);get gridZoom(){return this.#o}set gridZoom(t){this.#o=t}get gridSize(){return this.mManager.grid.gridSize}get nodeData(){if(!this.mNodeData)throw new _("Node data not set.",this);return this.mNodeData}set nodeData(t){this.mNodeData=t,t&&(this.resyncComponent(t),this.mComponent.updater.update())}#r=Pn(this);get mCommentInput(){return this.#r}set mCommentInput(t){this.#r=t}#n=Mn(this);get mDrag(){return this.#n}set mDrag(t){this.#n=t}#i=Sn(this);get mResizeBox(){return this.#i}set mResizeBox(t){this.#i=t}dragNodeOrEnableEdit(t){if(t.preventDefault(),this.editMode||(t.button===2&&this.mManager.graph.removeNode(this.nodeData),t.button!==0))return;let e=this.nodeData.transformation.x*this.mManager.grid.gridSize,r=this.nodeData.transformation.y*this.mManager.grid.gridSize,c=this.nodeData.transformation.x,m=this.nodeData.transformation.y,f=this.mComponent.element.getBoundingClientRect(),y=this.mComponent.element.offsetWidth?f.width/this.mComponent.element.offsetWidth:1,x=this.mComponent.element.offsetHeight?f.height/this.mComponent.element.offsetHeight:1,C=t.clientX,a=t.clientY,n=l=>{l.stopPropagation();let o=(l.clientX-C)/y,b=(l.clientY-a)/x,g=Math.round((e+o)/this.mManager.grid.gridSize),D=Math.round((r+b)/this.mManager.grid.gridSize);c===g&&m===D||(this.mManager.graph.transformNode(this.nodeData,w=>{w.moveTo(g,D)}),this.mDrag.dispatchEvent(new xo(g-c,D-m)),c=g,m=D)},u=()=>{document.removeEventListener("pointermove",n),document.removeEventListener("pointerup",u)};document.addEventListener("pointermove",n),document.addEventListener("pointerup",u)}escapeEditMode(t){(t.key==="Escape"||t.key==="Enter")&&(t.preventDefault(),this.editMode=!1)}onConnect(){this.resyncComponent(this.nodeData)}onDeconstruct(){this.mUnsubscribe(),this.mUnsubscribeGrid()}onUpdate(){this.mCommentInput&&this.getFocusedElement(document)!==this.mCommentInput&&this.mCommentInput.select()}transformNodeData(t){this.mManager.graph.transformNode(this.nodeData,e=>{let r=e.transformation.width,c=e.transformation.height;e.resizeTo(t.width/this.mManager.grid.gridSize,t.height/this.mManager.grid.gridSize);let m=e.transformation.width-r,f=e.transformation.height-c;f!==0&&(t.resizeHandle&vt.top)>0&&e.moveTo(e.transformation.x,e.transformation.y-f),m!==0&&(t.resizeHandle&vt.left)>0&&e.moveTo(e.transformation.x-m,e.transformation.y)})}getFocusedElement(t){let e=t.activeElement;return e?e.shadowRoot?this.getFocusedElement(e.shadowRoot):e:null}resyncComponent(t){let e=t.transformation.x*this.mManager.grid.gridSize,r=t.transformation.y*this.mManager.grid.gridSize;if(this.mComponent.element.style.setProperty("left",`${e}px`),this.mComponent.element.style.setProperty("top",`${r}px`),this.mResizeBox){let c=t.transformation.width*this.mManager.grid.gridSize,m=t.transformation.height*this.mManager.grid.gridSize;this.mResizeBox.width=c,this.mResizeBox.height=m}this.mComponent.updater.updateAsync()}updateForZoomLevel(){this.enableBigview=this.mManager.grid.zoom<.25,this.enableBigview&&(this.gridZoom=this.mManager.grid.zoom),this.mComponent.element.style.setProperty("z-index",(this.enableBigview?9999:-1).toString())}static{Dn()}},xo=class{mX;mY;get x(){return this.mX}get y(){return this.mY}constructor(t,e){this.mX=t,this.mY=e}};var $n=`:host {\r
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
    \r
    height: var(--potatno-grid-size);\r
    position: relative;\r
}\r
\r
.port-drag-connection {\r
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
    --potatno-port-values-line-length: 8px;\r
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
\r
    &::after {\r
        content: '';\r
        position: absolute;\r
        right: 2px;\r
        height: 2px;\r
        width: calc(var(--potatno-port-values-line-length) - 2px);\r
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
        background-color: color-mix(in srgb, var(--potatno-port-color) 12%, var(--potatno-color-background));\r
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
        background-color: color-mix(in srgb, var(--potatno-port-color) 8%, var(--potatno-color-background));\r
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
    /* Save port internal color */\r
    --potatno-port-handle-color: var(--type-color);\r
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
        align-items: center;\r
        justify-content: center;\r
\r
        /* Glow animations for new connections */\r
        .connected {\r
            .output & {\r
                animation: animateOutputConnect var(--potatno-connection-animation) ease-in-out forwards;\r
            }\r
\r
            .input & {\r
                animation: animateInputConnect calc(var(--potatno-connection-animation) * 0.5) ease-out forwards;\r
                animation-delay: calc(var(--potatno-connection-animation) * 0.7);\r
            }\r
        }\r
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
            transition: transform 0.15s ease-in-out;\r
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
                    background-color: color-mix(in srgb, var(--potatno-port-handle-color) 30%, var(--potatno-color-background));\r
                    border-radius: 2px;\r
                }\r
\r
                &.connected::before {\r
                    background-color: var(--potatno-port-handle-color);\r
                }\r
\r
                &.error::before {\r
                    background-color: var(--potatno-color-error);\r
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
                .output & {\r
                    &::after {\r
                        right: 1px;\r
                        border-left: calc(var(--potatno-port-flow-size) / 3) solid color-mix(in srgb, var(--potatno-port-handle-color) 30%, var(--potatno-color-background));\r
                    }\r
\r
                    &.connected::after {\r
                        border-left-color: var(--potatno-port-handle-color);\r
                    }\r
\r
                    &.error::after {\r
                        border-left-color: var(--potatno-color-error);\r
                    }\r
                }\r
\r
                .input & {\r
                    /* Bibedi bubedi arrow is not on the leftebi */\r
                    flex-direction: row-reverse;\r
\r
                    &::after {\r
                        left: 1px;\r
                        border-right: calc(var(--potatno-port-flow-size) / 3) solid color-mix(in srgb, var(--potatno-port-handle-color) 30%, var(--potatno-color-background));\r
                    }\r
\r
                    &.connected::after {\r
                        border-right-color: var(--potatno-port-handle-color);\r
                    }\r
\r
                    &.error::after {\r
                        border-right-color: var(--potatno-color-error);\r
                    }\r
                }\r
            }\r
\r
            &.value {\r
                background-color: var(--potatno-port-handle-color);\r
                border: 1px solid var(--potatno-port-handle-color);\r
                border-radius: 50%;\r
                height: calc(var(--potatno-port-value-size) - 1px);\r
                width: calc(var(--potatno-port-value-size) - 1px);\r
                background-color: color-mix(in srgb, var(--potatno-port-handle-color) 30%, var(--potatno-color-background));\r
\r
                &.connected {\r
                    background-color: var(--potatno-port-handle-color);\r
                }\r
\r
                &.error {\r
                    background-color: var(--potatno-color-error);\r
                    border-color: var(--potatno-color-error);\r
                }\r
            }\r
        }\r
    }\r
}\r
\r
@keyframes animateOutputConnect {\r
    0% {\r
        filter: drop-shadow(0px 0px 0px var(--potatno-port-handle-color));\r
        --potatno-port-handle-color: var(--type-color);\r
    }\r
\r
    23% {\r
        filter: drop-shadow(0px 0px 5px var(--potatno-port-handle-color));\r
        --potatno-port-handle-color: color-mix(in srgb, var(--type-color) 50%, #fff);\r
    }\r
\r
    50% {\r
        filter: drop-shadow(0px 0px 5px var(--potatno-port-handle-color));\r
        --potatno-port-handle-color: color-mix(in srgb, var(--type-color) 50%, #fff);\r
    }\r
\r
    100% {\r
        filter: drop-shadow(0px 0px 0px var(--potatno-port-handle-color));\r
        --potatno-port-handle-color: var(--type-color);\r
    }\r
}\r
\r
@keyframes animateInputConnect {\r
    0% {\r
        filter: drop-shadow(0px 0px 5px var(--potatno-port-handle-color));\r
        --potatno-port-handle-color: color-mix(in srgb, var(--type-color) 50%, #fff);\r
    }\r
\r
    100% {\r
        filter: drop-shadow(0px 0px 0px var(--potatno-port-handle-color));\r
        --potatno-port-handle-color: var(--type-color);\r
    }\r
}\r
`;var Gn=`<div class="port-wrapper {{this.portDirection}}" style="--type-color: {{this.portColor}}" (dragover)="this.onDragOver($event)" (drop)="this.onDrop($event)">\r
\r
    <!-- Actual port handle. -->\r
    <div class="port" draggable="true" [title]="this.portValueType" (dragstart)="this.onDragStart($event)" (dragend)="this.onDragEnd($event)">\r
        <div class="port__handle">\r
            <div class="port-handle {{this.portType}} {{this.hasError ? 'error' : ''}} {{ this.isConnected ? 'connected' : ''}}"></div>\r
        </div>\r
        <div class="port__label">{{this.portName}}</div>\r
    </div>\r
\r
    <svg #dragConnection class="port-drag-connection" xmlns="http://www.w3.org/2000/svg">\r
        <path #dragPath xmlns="http://www.w3.org/2000/svg"></path>\r
    </svg>\r
\r
    $if(this.showValueInput) {\r
        <div class="port-values">\r
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
`;function Ta(){function v(a,n){return function(l){e(n,"addInitializer"),r(l,"An initializer"),a.push(l)}}function t(a,n,u,l,o,b,g,D,w){var p;switch(o){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:g?"#"+n:n,static:b,private:g,metadata:D},d={v:!1};s.addInitializer=v(l,d);var i,h;o===0?g?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(T){this[n]=T}):o===2?i=function(){return u.value}:((o===1||o===3)&&(i=function(){return u.get.call(this)}),(o===1||o===4)&&(h=function(T){u.set.call(this,T)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return a(w,s)}finally{d.v=!0}}function e(a,n){if(a.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(a,n){if(typeof a!="function")throw new TypeError(n+" must be a function")}function c(a,n){var u=typeof n;if(a===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(u!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function m(a,n,u,l,o,b,g,D,w){var p=u[0],s,d,i;g?o===0||o===1?s={get:u[3],set:u[4]}:o===3?s={get:u[3]}:o===4?s={set:u[3]}:s={value:u[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var h,T,P;if(typeof p=="function")h=t(p,l,s,D,o,b,g,w,i),h!==void 0&&(c(o,h),o===0?d=h:o===1?(d=h.init,T=h.get||i.get,P=h.set||i.set,i={get:T,set:P}):i=h);else for(var M=p.length-1;M>=0;M--){var S=p[M];if(h=t(S,l,s,D,o,b,g,w,i),h!==void 0){c(o,h);var N;o===0?N=h:o===1?(N=h.init,T=h.get||i.get,P=h.set||i.set,i={get:T,set:P}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(o===0||o===1){if(d===void 0)d=function(I,E){return E};else if(typeof d!="function"){var F=d;d=function(I,E){for(var A=E,L=0;L<F.length;L++)A=F[L].call(I,A);return A}}else{var j=d;d=function(I,E){return j.call(I,E)}}a.push(d)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),g?o===1?(a.push(function(I,E){return i.get.call(I,E)}),a.push(function(I,E){return i.set.call(I,E)})):o===2?a.push(i):a.push(function(I,E){return i.call(I,E)}):Object.defineProperty(n,l,s))}function f(a,n,u){for(var l=[],o,b,g=new Map,D=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,T,P;if(h?(T=a,s=s-5,b=b||[],P=b):(T=a.prototype,o=o||[],P=o),s!==0&&!i){var M=h?D:g,S=M.get(d)||0;if(S===!0||S===3&&s!==4||S===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!S&&s>2?M.set(d,s):M.set(d,!0)}m(l,T,p,d,s,h,i,P,u)}}return y(l,o),y(l,b),l}function y(a,n){n&&a.push(function(u){for(var l=0;l<n.length;l++)n[l].call(u);return u})}function x(a,n,u){if(n.length>0){for(var l=[],o=a,b=a.name,g=n.length-1;g>=0;g--){var D={v:!1};try{var w=n[g](o,{kind:"class",name:b,addInitializer:v(l,D),metadata:u})}finally{D.v=!0}w!==void 0&&(c(10,w),o=w)}return[C(o,u),function(){for(var p=0;p<l.length;p++)l[p].call(o)}]}}function C(a,n){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,l,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(b===void 0?null:b),D=f(n,u,g);return l.length||C(n,g),{e:D,get c(){return x(n,l,g)}}}}function Wn(v,t,e,r){return(Wn=Ta())(v,t,e,r)}var Zn,Bn,qn,Jn,Un,Xn,Hn,Me;Zn=X({selector:"potatno-port",template:Gn,style:$n}),qn=gt("dragConnection"),Jn=gt("dragPath");var Yn=class{static{({e:[Un,Xn,Hn],c:[Me,Bn]}=Wn(this,[[qn,1,"mDragConnectionSvg"],[Jn,1,"mDragConnectionPath"],[W,3,"port"]],[Zn]))}constructor(t=O.use(G),e=O.use(H)){this.mComponent=t,this.mManager=e,this.mPort=null,this.mDragPositionEventHandler=r=>{this.mManager.grid.draggedPort.isDragging&&(performance.now()-r.timeStamp>100||this.renderDragWire(r.clientX,r.clientY))},document.addEventListener("dragover",this.mDragPositionEventHandler,{capture:!0}),this.mUnsubscribeValidation=this.mManager.subscribe(R.Connection|R.SpecialValidation,()=>{this.mComponent.updater.updateAsync()})}mComponent;mDragPositionEventHandler;mManager;mPort;mUnsubscribeValidation;#t=(Hn(this),Un(this));get mDragConnectionSvg(){return this.#t}set mDragConnectionSvg(t){this.#t=t}#e=Xn(this);get mDragConnectionPath(){return this.#e}set mDragConnectionPath(t){this.#e=t}get hasError(){return this.mManager.integrity.errorItems.has(this.port)}get inputDefinitions(){let t=this.port.project.types.getType(this.port.resolvedDataType);return t.inputs.map((e,r)=>({htmlType:(()=>{switch(e.type){case"boolean":return"checkbox";case"number":return"number";case"string":return"text"}})(),index:r,name:e.name,value:this.port.directValue[r]??"",totalCount:t.inputs.length}))}get isConnected(){return this.port.connectedPorts.size>0}get port(){if(!this.mPort)throw new _("Port is not setup",this);return this.mPort}set port(t){if(this.mPort!==t){if(t===null)throw new _("A null port cant be assigned.",this);this.mPort=t,this.mComponent.updater.update()}}get portColor(){return this.port.portType==="flow"?"var(--potatno-color-text)":this.mManager.generateStringColor(this.port.resolvedDataType)}get portDirection(){return this.port.direction??"output"}get portName(){return this.port.label??""}get portType(){return this.port.portType}get portValueType(){return this.port.portType!=="value"?"":this.port.resolvedDataType??""}get showValueInput(){return this.port.portType!=="value"||this.port.direction!=="input"||this.port.connectedPorts.size>0||this.mManager.grid.draggedPort.hasPort(this.port)?!1:!this.port.node.project.types.isGenericType(this.port.dataType??"")}onDeconstruct(){this.mUnsubscribeValidation(),document.removeEventListener("dragover",this.mDragPositionEventHandler,{capture:!0})}onDirectValueInput(t,e){let r=t.target,c=[...this.port.directValue];c[e]=r.type==="checkbox"?r.checked?"true":"false":r.value,this.mManager.graph.setPortDirectValue(this.port,c)}onDragEnd(t){t.stopPropagation(),t.preventDefault(),this.mDragConnectionPath?.removeAttribute("d"),this.mManager.grid.setDraggingPort([]),this.mComponent.updater.updateAsync()}onDragOver(t){this.draggedPortCanConnect()&&(t.preventDefault(),t.stopPropagation(),t.dataTransfer&&(t.dataTransfer.dropEffect="link"))}onDragStart(t){if(!t.dataTransfer){t.preventDefault();return}t.stopPropagation(),t.dataTransfer.effectAllowed="link",t.dataTransfer.setDragImage(document.createElement("div"),0,0),this.mManager.grid.setDraggingPort([this.port]),this.mComponent.updater.updateAsync()}onDrop(t){if(t.preventDefault(),t.stopPropagation(),!!this.draggedPortCanConnect()&&this.mManager.grid.draggedPort.isDragging)for(let e of this.mManager.grid.draggedPort.ports)this.mManager.graph.connectPorts(e,this.port)}createDragPath(t,e){let r=this.mManager.grid.pixelToGridSpace(t,e);return this.mManager.connections.createTemporaryPath(this.port,r).attributeValue}draggedPortCanConnect(){if(!this.mManager.grid.draggedPort.isDragging)return!1;for(let t of this.mManager.grid.draggedPort.ports)if(t!==this.port&&t.direction!==this.port.direction&&t.portType===this.port.portType)return!0;return!1}renderDragWire(t,e){if(!this.mManager.grid.draggedPort.hasPort(this.port)||!this.mDragConnectionSvg||!this.mManager.grid.draggedPort.updatePointer(t,e))return;let r=this.mManager.grid.draggedPort.portPositions.get(this.port);if(!r)return;let c=r.x*this.mManager.grid.gridSize,m=r.y*this.mManager.grid.gridSize;this.mDragConnectionSvg.style.setProperty("transform",`translate(${-c}px, ${-m}px)`),this.mDragConnectionPath?.setAttribute("d",this.createDragPath(t,e))}static{Bn()}};var Kn=`:host {\r
    display: block;\r
    font-family: var(--potatno-font-family);\r
    font-size: var(--potatno-font-size);\r
\r
    /* Snappy animation on movement. */\r
    transition: var(--potatno-position-snap-animation);\r
\r
    --potatno-port-value-size: 5px;\r
    --potatno-port-flow-size: 15px;\r
    --potatno-port-width: max(var(--potatno-port-value-size), var(--potatno-port-flow-size));\r
}\r
\r
.node {\r
    position: relative;\r
    overflow: visible;\r
    user-select: none;\r
\r
    --potatno-port-color: var(--type-color);\r
}\r
\r
.drag-area {\r
    display: flex;\r
    align-items: center;\r
    justify-content: center;\r
    width: var(--potatno-grid-size);\r
    height: var(--potatno-grid-size);\r
\r
    cursor: grab;\r
\r
    /* Create a fake connection line in center. */\r
    &::after {\r
        content: '';\r
        height: 2px;\r
        width: calc(100% - 2px);\r
        border-radius: 50px;\r
        background-color: var(--potatno-port-color);\r
        z-index: -10;\r
    }\r
}\r
\r
.port {\r
    position: absolute;\r
    top: 0px;\r
    display: flex;\r
    align-items: center;\r
    width: calc(var(--potatno-grid-size) - 2px);\r
    height: calc(var(--potatno-grid-size) - 2px);\r
    border: 1px dashed var(--potatno-port-color);\r
    cursor: crosshair;\r
    z-index: -1;\r
\r
    /* Save port internal color so it can be animated */\r
    --potatno-port-handle-color: var(--type-color);\r
\r
    /* Move both port areas left and right. */\r
    &.input {\r
        left: -100%;\r
    }\r
\r
    &.output {\r
        right: -100%;\r
    }\r
\r
    &:has(>.connected) {\r
        width: var(--potatno-grid-size);\r
        height: var(--potatno-grid-size);\r
        border: none;\r
    }\r
\r
    &:not(>.connected) {\r
        &.error {\r
            border: 1px dashed var(--potatno-color-error);\r
        }\r
\r
        /* Small hover animation for ports, hover values excluded */\r
        &:hover {\r
            &.output .port__handle {\r
                transform: translateX(1px);\r
            }\r
\r
            &.input .port__handle {\r
                transform: translateX(-1px);\r
            }\r
        }\r
    }\r
\r
    .port__handle {\r
        position: absolute;\r
        transition: transform 0.15s ease-in-out, translate 0.15s ease-in-out;\r
\r
        /* Instead of pushing them out reverse it and push them in. */\r
        .output & {\r
            left: 0px;\r
        }\r
\r
        .input & {\r
            right: 0px;\r
        }\r
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
                background-color: color-mix(in srgb, var(--potatno-port-handle-color) 30%, var(--potatno-color-background));\r
                border-radius: 2px;\r
            }\r
\r
            &.connected::before {\r
                background-color: var(--potatno-port-handle-color);\r
            }\r
\r
            &.error::before {\r
                background-color: var(--potatno-color-error);\r
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
            .output & {\r
                translate: calc(var(--potatno-port-width) / -2) 0px;\r
\r
                &.connected {\r
                    translate: calc(var(--potatno-port-width) / -1) 0px;\r
                    animation: animateOutputConnectGlow var(--potatno-connection-animation) ease-in-out forwards;\r
\r
                    @starting-style {\r
                        translate: calc(var(--potatno-port-width) / -2) 0px;\r
                    }\r
                }\r
\r
                /* Adjust arrow geometry and arrow color */\r
                &::after {\r
                    right: 1px;\r
                    border-left: calc(var(--potatno-port-flow-size) / 3) solid color-mix(in srgb, var(--potatno-port-handle-color) 30%, var(--potatno-color-background));\r
                }\r
\r
                &.connected::after {\r
                    border-left-color: var(--potatno-port-handle-color);\r
                }\r
\r
                &.error::after {\r
                    border-left-color: var(--potatno-color-error);\r
                }\r
            }\r
\r
            .input & {\r
                translate: calc(var(--potatno-port-width) / 2) 0px;\r
                flex-direction: row-reverse;\r
\r
                &.connected {\r
                    transition-delay: calc(var(--potatno-connection-animation) * 0.7);\r
                    translate: calc(var(--potatno-port-width) / 1) 0px;\r
                    animation: animateInputConnectGlow calc(var(--potatno-connection-animation) * 0.5) ease-out forwards;\r
                    animation-delay: calc(var(--potatno-connection-animation) * 0.7);\r
\r
                    @starting-style {\r
                        translate: calc(var(--potatno-port-width) / 2) 0px;\r
                    }\r
                }\r
\r
                /* Adjust arrow geometry and arrow color */\r
                &::after {\r
                    left: 1px;\r
                    border-right: calc(var(--potatno-port-flow-size) / 3) solid color-mix(in srgb, var(--potatno-port-handle-color) 30%, var(--potatno-color-background));\r
                }\r
\r
                &.connected::after {\r
                    border-right-color: var(--potatno-port-handle-color);\r
                }\r
\r
                &.error::after {\r
                    border-right-color: var(--potatno-color-error);\r
                }\r
            }\r
        }\r
\r
        &.value {\r
            border: 1px solid var(--potatno-port-handle-color);\r
            border-radius: 50%;\r
            height: calc(var(--potatno-port-value-size) - 1px);\r
            width: calc(var(--potatno-port-value-size) - 1px);\r
            background-color: color-mix(in srgb, var(--potatno-port-handle-color) 30%, var(--potatno-color-background));\r
\r
            &.connected {\r
                background-color: var(--potatno-port-handle-color);\r
            }\r
\r
            &.error {\r
                background-color: var(--potatno-color-error);\r
                border-color: var(--potatno-color-error);\r
            }\r
\r
            .output & {\r
                translate: -50% 0px;\r
\r
                &.connected {\r
                    translate: calc(var(--potatno-port-width) / -1.3) 0px;\r
                    animation: animateOutputConnectGlow var(--potatno-connection-animation) ease-in-out forwards;\r
\r
                    @starting-style {\r
                        translate: -50% 0px;\r
                    }\r
                }\r
            }\r
\r
            .input & {\r
                translate: 50% 0px;\r
\r
                &.connected {\r
                    transition-delay: calc(var(--potatno-connection-animation) * 0.7);\r
                    translate: calc(var(--potatno-port-width) / 1.3) 0px;\r
                    animation: animateInputConnectGlow calc(var(--potatno-connection-animation) * 0.5) ease-out forwards;\r
                    animation-delay: calc(var(--potatno-connection-animation) * 0.7);\r
\r
                    @starting-style {\r
                        translate: 50% 0px;\r
                    }\r
                }\r
            }\r
        }\r
    }\r
}\r
\r
.port-drag-connection {\r
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
@keyframes animateOutputConnectGlow {\r
    0% {\r
        filter: drop-shadow(0px 0px 0px var(--potatno-port-handle-color));\r
        --potatno-port-handle-color: var(--type-color);\r
    }\r
\r
    23% {\r
        filter: drop-shadow(0px 0px 5px var(--potatno-port-handle-color));\r
        --potatno-port-handle-color: color-mix(in srgb, var(--type-color) 50%, #fff);\r
    }\r
\r
    50% {\r
        filter: drop-shadow(0px 0px 5px var(--potatno-port-handle-color));\r
        --potatno-port-handle-color: color-mix(in srgb, var(--type-color) 50%, #fff);\r
    }\r
\r
    100% {\r
        filter: drop-shadow(0px 0px 0px var(--potatno-port-handle-color));\r
        --potatno-port-handle-color: var(--type-color);\r
    }\r
}\r
\r
@keyframes animateInputConnectGlow {\r
    0% {\r
        filter: drop-shadow(0px 0px 5px var(--potatno-port-handle-color));\r
        --potatno-port-handle-color: color-mix(in srgb, var(--type-color) 50%, #fff);\r
    }\r
\r
    100% {\r
        filter: drop-shadow(0px 0px 0px var(--potatno-port-handle-color));\r
        --potatno-port-handle-color: var(--type-color);\r
    }\r
}`;var Qn=`<div class="node" style="--type-color: {{this.portColor}}" (dragover)="this.onDragOver($event)" (drop)="this.onDrop($event)">\r
\r
    <div class="port input" draggable="true" [title]="this.portValueType" (dragstart)="this.onDragStart($event)" (dragend)="this.onDragEnd($event)">\r
        <div class="port__handle {{ this.portType }} {{this.inputHasError ? 'error' : ''}} {{ this.isInputConnected ? 'connected' : ''}}"></div>\r
    </div>\r
\r
    <div class="drag-area" (pointerdown)="this.dragNode($event)"/>\r
\r
    <div class="port output " draggable="true" [title]="this.portValueType" (dragstart)="this.onDragStart($event)" (dragend)="this.onDragEnd($event)">\r
        <div class="port__handle {{ this.portType }} {{this.outputHasError ? 'error' : ''}} {{ this.isOutputConnected ? 'connected' : ''}}"></div>\r
    </div>\r
\r
    <svg #dragConnection class="port-drag-connection" xmlns="http://www.w3.org/2000/svg">\r
        <path #dragPath xmlns="http://www.w3.org/2000/svg"></path>\r
    </svg>\r
\r
</div>\r
    `;function Ia(){function v(a,n){return function(l){e(n,"addInitializer"),r(l,"An initializer"),a.push(l)}}function t(a,n,u,l,o,b,g,D,w){var p;switch(o){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:g?"#"+n:n,static:b,private:g,metadata:D},d={v:!1};s.addInitializer=v(l,d);var i,h;o===0?g?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(T){this[n]=T}):o===2?i=function(){return u.value}:((o===1||o===3)&&(i=function(){return u.get.call(this)}),(o===1||o===4)&&(h=function(T){u.set.call(this,T)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return a(w,s)}finally{d.v=!0}}function e(a,n){if(a.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(a,n){if(typeof a!="function")throw new TypeError(n+" must be a function")}function c(a,n){var u=typeof n;if(a===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(u!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function m(a,n,u,l,o,b,g,D,w){var p=u[0],s,d,i;g?o===0||o===1?s={get:u[3],set:u[4]}:o===3?s={get:u[3]}:o===4?s={set:u[3]}:s={value:u[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var h,T,P;if(typeof p=="function")h=t(p,l,s,D,o,b,g,w,i),h!==void 0&&(c(o,h),o===0?d=h:o===1?(d=h.init,T=h.get||i.get,P=h.set||i.set,i={get:T,set:P}):i=h);else for(var M=p.length-1;M>=0;M--){var S=p[M];if(h=t(S,l,s,D,o,b,g,w,i),h!==void 0){c(o,h);var N;o===0?N=h:o===1?(N=h.init,T=h.get||i.get,P=h.set||i.set,i={get:T,set:P}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(o===0||o===1){if(d===void 0)d=function(I,E){return E};else if(typeof d!="function"){var F=d;d=function(I,E){for(var A=E,L=0;L<F.length;L++)A=F[L].call(I,A);return A}}else{var j=d;d=function(I,E){return j.call(I,E)}}a.push(d)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),g?o===1?(a.push(function(I,E){return i.get.call(I,E)}),a.push(function(I,E){return i.set.call(I,E)})):o===2?a.push(i):a.push(function(I,E){return i.call(I,E)}):Object.defineProperty(n,l,s))}function f(a,n,u){for(var l=[],o,b,g=new Map,D=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,T,P;if(h?(T=a,s=s-5,b=b||[],P=b):(T=a.prototype,o=o||[],P=o),s!==0&&!i){var M=h?D:g,S=M.get(d)||0;if(S===!0||S===3&&s!==4||S===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!S&&s>2?M.set(d,s):M.set(d,!0)}m(l,T,p,d,s,h,i,P,u)}}return y(l,o),y(l,b),l}function y(a,n){n&&a.push(function(u){for(var l=0;l<n.length;l++)n[l].call(u);return u})}function x(a,n,u){if(n.length>0){for(var l=[],o=a,b=a.name,g=n.length-1;g>=0;g--){var D={v:!1};try{var w=n[g](o,{kind:"class",name:b,addInitializer:v(l,D),metadata:u})}finally{D.v=!0}w!==void 0&&(c(10,w),o=w)}return[C(o,u),function(){for(var p=0;p<l.length;p++)l[p].call(o)}]}}function C(a,n){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,l,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(b===void 0?null:b),D=f(n,u,g);return l.length||C(n,g),{e:D,get c(){return x(n,l,g)}}}}function ii(v,t,e,r){return(ii=Ia())(v,t,e,r)}var si,kn,ai,li,ci,ti,ei,oi,ri,Eo;si=X({selector:"potatno-conjunction-node",template:Qn,style:Kn,components:[Me]}),ai=gt("dragConnection"),li=gt("dragPath"),ci=ft("node-drag");var ni=class{static{({e:[ti,ei,oi,ri],c:[Eo,kn]}=ii(this,[[ai,1,"mDragConnectionSvg"],[li,1,"mDragConnectionPath"],[ci,1,"mDrag"],[W,3,"nodeData"]],[si]))}constructor(t=O.use(G),e=O.use(H)){this.mComponent=t,this.mManager=e,this.mNodeData=null,this.mDragPositionEventHandler=r=>{this.mManager.grid.draggedPort.isDragging&&(performance.now()-r.timeStamp>100||this.renderDragWire(r.clientX,r.clientY))},document.addEventListener("dragover",this.mDragPositionEventHandler,{capture:!0}),this.mUnsubscribeNodeChange=this.mManager.subscribe(R.Node,r=>{r.item===this.mNodeData&&this.resyncComponent(this.nodeData)}),this.mUnsubscribeValidation=this.mManager.subscribe(R.Connection|R.SpecialValidation,()=>{this.mComponent.updater.updateAsync()})}mComponent;mDragPositionEventHandler;mManager;mNodeData;mUnsubscribeNodeChange;mUnsubscribeValidation;#t=(ri(this),ti(this));get mDragConnectionSvg(){return this.#t}set mDragConnectionSvg(t){this.#t=t}#e=ei(this);get mDragConnectionPath(){return this.#e}set mDragConnectionPath(t){this.#e=t}#o=oi(this);get mDrag(){return this.#o}set mDrag(t){this.#o=t}get inputHasError(){return this.mManager.integrity.errorItems.has(this.nodeData)||this.mManager.integrity.errorItems.has(this.nodePorts.input)}get isInputConnected(){return this.nodePorts.input.connectedPorts.size>0}get isOutputConnected(){return this.nodePorts.output.connectedPorts.size>0}get nodeData(){if(!this.mNodeData)throw new _("Node data not set.",this);return this.mNodeData}set nodeData(t){this.mNodeData=t,t&&this.resyncComponent(t)}get outputHasError(){return this.mManager.integrity.errorItems.has(this.nodeData)||this.mManager.integrity.errorItems.has(this.nodePorts.output)}get portColor(){return this.portType==="flow"?"var(--potatno-color-text)":this.mManager.generateStringColor(this.portValueType)}get portType(){return this.nodeData.definitionId===Z.DEFINITION_ID?"flow":"value"}get portValueType(){return this.portType!=="value"?"":this.nodePorts.input.resolvedDataType}get nodePorts(){if(this.nodeData.inputs.list.length===0||this.nodeData.outputs.list.length===0)throw new _("Malformed conjunction node",this);return{input:this.nodeData.inputs.list[0],output:this.nodeData.outputs.list[0]}}dragNode(t){if(t.preventDefault(),t.button===2&&this.mManager.graph.removeNode(this.nodeData),t.button!==0)return;let e=this.nodeData.transformation.x*this.mManager.grid.gridSize,r=this.nodeData.transformation.y*this.mManager.grid.gridSize,c=this.nodeData.transformation.x,m=this.nodeData.transformation.y,f=this.mComponent.element.getBoundingClientRect(),y=this.mComponent.element.offsetWidth?f.width/this.mComponent.element.offsetWidth:1,x=this.mComponent.element.offsetHeight?f.height/this.mComponent.element.offsetHeight:1,C=t.clientX,a=t.clientY,n=l=>{l.stopPropagation();let o=(l.clientX-C)/y,b=(l.clientY-a)/x,g=Math.round((e+o)/this.mManager.grid.gridSize),D=Math.round((r+b)/this.mManager.grid.gridSize);c===g&&m===D||(this.mManager.graph.transformNode(this.nodeData,w=>{w.moveTo(g,D)}),this.mDrag.dispatchEvent(new Do(g-c,D-m)),c=g,m=D)},u=()=>{document.removeEventListener("pointermove",n),document.removeEventListener("pointerup",u)};document.addEventListener("pointermove",n),document.addEventListener("pointerup",u)}onDeconstruct(){this.mUnsubscribeNodeChange(),this.mUnsubscribeValidation(),document.removeEventListener("dragover",this.mDragPositionEventHandler,{capture:!0})}onDragEnd(t){t.stopPropagation(),t.preventDefault(),this.mDragConnectionPath?.removeAttribute("d"),this.mManager.grid.setDraggingPort([]),this.mComponent.updater.updateAsync()}onDragOver(t){this.draggedPortCanConnect()&&(t.preventDefault(),t.stopPropagation(),t.dataTransfer&&(t.dataTransfer.dropEffect="link"))}onDragStart(t){t.stopPropagation(),t.dataTransfer.effectAllowed="link",t.dataTransfer.setDragImage(document.createElement("div"),0,0),this.mManager.grid.setDraggingPort([this.nodePorts.input,this.nodePorts.output]),this.mComponent.updater.updateAsync()}onDrop(t){this.draggedPortCanConnect()&&(t.preventDefault(),t.stopPropagation(),this.mManager.grid.draggedPort.isDragging&&this.mManager.graph.connectConjunction(this.nodeData,this.mManager.grid.draggedPort.ports))}createDragPath(t,e){let r=this.mManager.grid.pixelToGridSpace(t,e);return this.mManager.connections.createTemporaryPath(this.nodePorts.input,r).attributeValue}draggedPortCanConnect(){if(!this.mManager.grid.draggedPort.isDragging)return!1;let t=this.nodePorts,e=[t.input,t.output];for(let r of this.mManager.grid.draggedPort.ports)for(let c of e)if(r!==c&&r.direction!==c.direction&&r.portType===c.portType)return!0;return!1}renderDragWire(t,e){let r=this.nodePorts.input;if(!this.mManager.grid.draggedPort.hasPort(r)||!this.mManager.grid.draggedPort.updatePointer(t,e))return;let c=this.mManager.grid.draggedPort.portPositions.get(r);if(!c)return;let m=c.x*this.mManager.grid.gridSize,f=c.y*this.mManager.grid.gridSize;this.mDragConnectionSvg?.style.setProperty("transform",`translate(${-m}px, ${-f}px)`),this.mDragConnectionPath?.setAttribute("d",this.createDragPath(t,e))}resyncComponent(t){let e=t.transformation.x*this.mManager.grid.gridSize,r=t.transformation.y*this.mManager.grid.gridSize;this.mComponent.element.style.setProperty("left",`${e}px`),this.mComponent.element.style.setProperty("top",`${r}px`),this.mComponent.updater.update()}static{kn()}},Do=class{mX;mY;get x(){return this.mX}get y(){return this.mY}constructor(t,e){this.mX=t,this.mY=e}};var ui=`:host {\r
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
        --potatno-path-color: var(--path-color, var(--potatno-color-text));\r
\r
        stroke: var(--potatno-path-color);\r
        fill: none;\r
        stroke-linecap: round;\r
        stroke-linejoin: round;\r
        stroke-width: 2px;\r
        pointer-events: none;\r
\r
        .new & {\r
            /* Animated svg buildup. Calculate "exact" length for a working ease and delay it to match the node port animation. */\r
            stroke-dasharray: calc(var(--potatno-grid-size) * var(--path-length));\r
            stroke-dashoffset: calc(var(--potatno-grid-size) * var(--path-length));\r
            animation: animateDash calc(var(--potatno-connection-animation) * 0.5) cubic-bezier(0, 0.8, 1, 0.2) forwards, animateGlow calc(var(--potatno-connection-animation) * 0.75) ease-out forwards;\r
            animation-delay: calc(var(--potatno-connection-animation) * 0.125);\r
        }\r
\r
        .error & {\r
            --potatno-path-color: var(--potatno-color-error);\r
            filter: drop-shadow(0px 0px 2px var(--potatno-path-color));\r
        }\r
\r
        &.path--mouse-target {\r
            stroke: transparent !important;\r
            stroke-width: 12px;\r
            pointer-events: stroke;\r
            cursor: pointer;\r
        }\r
    }\r
}\r
\r
@keyframes animateDash {\r
    to {\r
        stroke-dashoffset: 0;\r
    }\r
}\r
\r
@keyframes animateGlow {\r
    0% {\r
        filter: drop-shadow(0px 0px 0px var(--potatno-path-color));\r
        stroke: var(--potatno-path-color);\r
    }\r
\r
    5% {\r
        filter: drop-shadow(0px 0px 5px var(--potatno-path-color));\r
        stroke: color-mix(in srgb, var(--potatno-path-color) 50%, #fff);\r
    }\r
\r
    70% {\r
        filter: drop-shadow(0px 0px 5px var(--potatno-path-color));\r
        stroke: color-mix(in srgb, var(--potatno-path-color) 50%, #fff);\r
    }\r
\r
    100% {\r
        filter: drop-shadow(0px 0px 0px var(--potatno-path-color));\r
        stroke: var(--potatno-path-color);\r
    }\r
}`;var hi=`<svg class="svg-layer" xmlns="http://www.w3.org/2000/svg" >\r
    $for(connection of this.connections.values()){\r
        <g class="{{this.connection.state.hasError ? 'error' : ''}} {{this.connection.state.isNew ? 'new' : ''}}" style="--path-length: {{ this.connection.path.length }}; {{ this.connection.color ? \`--path-color: \${this.connection.color};\` : '' }}" xmlns="http://www.w3.org/2000/svg">\r
            <path class="path" d="{{this.connection.path.attributeValue}}" xmlns="http://www.w3.org/2000/svg"/>\r
            <path class="path path--mouse-target" d="{{this.connection.path.attributeValue}}" (pointerdown)="this.deleteConnection($event, this.connection)" (dblclick)="this.createConjunction($event, this.connection)" xmlns="http://www.w3.org/2000/svg"/>\r
        </g>\r
    }\r
</svg>\r
`;function Ma(){function v(a,n){return function(l){e(n,"addInitializer"),r(l,"An initializer"),a.push(l)}}function t(a,n,u,l,o,b,g,D,w){var p;switch(o){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:g?"#"+n:n,static:b,private:g,metadata:D},d={v:!1};s.addInitializer=v(l,d);var i,h;o===0?g?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(T){this[n]=T}):o===2?i=function(){return u.value}:((o===1||o===3)&&(i=function(){return u.get.call(this)}),(o===1||o===4)&&(h=function(T){u.set.call(this,T)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return a(w,s)}finally{d.v=!0}}function e(a,n){if(a.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(a,n){if(typeof a!="function")throw new TypeError(n+" must be a function")}function c(a,n){var u=typeof n;if(a===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(u!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function m(a,n,u,l,o,b,g,D,w){var p=u[0],s,d,i;g?o===0||o===1?s={get:u[3],set:u[4]}:o===3?s={get:u[3]}:o===4?s={set:u[3]}:s={value:u[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var h,T,P;if(typeof p=="function")h=t(p,l,s,D,o,b,g,w,i),h!==void 0&&(c(o,h),o===0?d=h:o===1?(d=h.init,T=h.get||i.get,P=h.set||i.set,i={get:T,set:P}):i=h);else for(var M=p.length-1;M>=0;M--){var S=p[M];if(h=t(S,l,s,D,o,b,g,w,i),h!==void 0){c(o,h);var N;o===0?N=h:o===1?(N=h.init,T=h.get||i.get,P=h.set||i.set,i={get:T,set:P}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(o===0||o===1){if(d===void 0)d=function(I,E){return E};else if(typeof d!="function"){var F=d;d=function(I,E){for(var A=E,L=0;L<F.length;L++)A=F[L].call(I,A);return A}}else{var j=d;d=function(I,E){return j.call(I,E)}}a.push(d)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),g?o===1?(a.push(function(I,E){return i.get.call(I,E)}),a.push(function(I,E){return i.set.call(I,E)})):o===2?a.push(i):a.push(function(I,E){return i.call(I,E)}):Object.defineProperty(n,l,s))}function f(a,n,u){for(var l=[],o,b,g=new Map,D=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,T,P;if(h?(T=a,s=s-5,b=b||[],P=b):(T=a.prototype,o=o||[],P=o),s!==0&&!i){var M=h?D:g,S=M.get(d)||0;if(S===!0||S===3&&s!==4||S===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!S&&s>2?M.set(d,s):M.set(d,!0)}m(l,T,p,d,s,h,i,P,u)}}return y(l,o),y(l,b),l}function y(a,n){n&&a.push(function(u){for(var l=0;l<n.length;l++)n[l].call(u);return u})}function x(a,n,u){if(n.length>0){for(var l=[],o=a,b=a.name,g=n.length-1;g>=0;g--){var D={v:!1};try{var w=n[g](o,{kind:"class",name:b,addInitializer:v(l,D),metadata:u})}finally{D.v=!0}w!==void 0&&(c(10,w),o=w)}return[C(o,u),function(){for(var p=0;p<l.length;p++)l[p].call(o)}]}}function C(a,n){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,l,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(b===void 0?null:b),D=f(n,u,g);return l.length||C(n,g),{e:D,get c(){return x(n,l,g)}}}}function gi(v,t,e,r){return(gi=Ma())(v,t,e,r)}var vi,di,yi,mi,pi,Io;vi=X({selector:"potatno-connection-layer",template:hi,style:ui}),yi=$.state({complexValue:!0});var fi=class{static{({e:[mi,pi],c:[Io,di]}=gi(this,[[yi,1,"connections"]],[vi]))}constructor(t=O.use(H)){this.mManager=t,this.connections=new Map;let e=0;this.mUnsubscribe=this.mManager.subscribe(R.SpecialActiveFunction|R.Node|R.Connection,()=>{e===0&&(e=requestAnimationFrame(()=>{e=0,this.updateConnections()}))})}mManager;mUnsubscribe;#t=(pi(this),mi(this));get connections(){return this.#t}set connections(t){this.#t=t}createConjunction(t,e){t.preventDefault(),t.stopPropagation();let r=e.port.output.portType==="flow"?this.mManager.project.nodeDefinitions.get(Z.DEFINITION_ID):this.mManager.project.nodeDefinitions.get(k.DEFINITION_ID),c=this.mManager.grid.pixelToGridSpace(t.clientX,t.clientY),m=this.mManager.graph.addNode(this.mManager.activeFunction,r,{x:c.x,y:c.y,height:0,width:0});this.mManager.graph.disconnectPorts(e.port.output,e.port.input);let f=m.inputs.list[0],y=m.outputs.list[0];this.mManager.graph.connectPorts(f,e.port.output),this.mManager.graph.connectPorts(f,e.port.input),this.mManager.graph.connectPorts(y,e.port.output),this.mManager.graph.connectPorts(y,e.port.input)}deleteConnection(t,e){t.button===2&&(t.preventDefault(),t.stopPropagation(),this.mManager.graph.disconnectPorts(e.port.output,e.port.input))}onDeconstruct(){this.mUnsubscribe()}createConnection(t,e,r){let c=this.mManager.integrity.errorItems,m=c.has(e)||c.has(r),f=(()=>{switch(r.portType){case"value":return r;case"flow":return e}})(),y=e.portType==="flow"?"":this.mManager.generateStringColor(e.resolvedDataType),x=this.mManager.connections.getConnectionPath(e,r);return{color:y,path:{attributeValue:x.attributeValue,length:x.length},state:{isNew:!t.has(f),hasError:m},port:{primary:f,output:e,input:r}}}updateConnections(){let t=this.connections;this.connections=new Map;for(let e of this.mManager.activeFunction.nodes)for(let r of e.outputs.list)for(let c of r.connectedPorts){let m=this.createConnection(t,r,c);this.connections.set(m.port.primary,m)}}static{di()}};function Sa(){function v(a,n){return function(l){e(n,"addInitializer"),r(l,"An initializer"),a.push(l)}}function t(a,n,u,l,o,b,g,D,w){var p;switch(o){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:g?"#"+n:n,static:b,private:g,metadata:D},d={v:!1};s.addInitializer=v(l,d);var i,h;o===0?g?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(T){this[n]=T}):o===2?i=function(){return u.value}:((o===1||o===3)&&(i=function(){return u.get.call(this)}),(o===1||o===4)&&(h=function(T){u.set.call(this,T)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return a(w,s)}finally{d.v=!0}}function e(a,n){if(a.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(a,n){if(typeof a!="function")throw new TypeError(n+" must be a function")}function c(a,n){var u=typeof n;if(a===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(u!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function m(a,n,u,l,o,b,g,D,w){var p=u[0],s,d,i;g?o===0||o===1?s={get:u[3],set:u[4]}:o===3?s={get:u[3]}:o===4?s={set:u[3]}:s={value:u[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var h,T,P;if(typeof p=="function")h=t(p,l,s,D,o,b,g,w,i),h!==void 0&&(c(o,h),o===0?d=h:o===1?(d=h.init,T=h.get||i.get,P=h.set||i.set,i={get:T,set:P}):i=h);else for(var M=p.length-1;M>=0;M--){var S=p[M];if(h=t(S,l,s,D,o,b,g,w,i),h!==void 0){c(o,h);var N;o===0?N=h:o===1?(N=h.init,T=h.get||i.get,P=h.set||i.set,i={get:T,set:P}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(o===0||o===1){if(d===void 0)d=function(I,E){return E};else if(typeof d!="function"){var F=d;d=function(I,E){for(var A=E,L=0;L<F.length;L++)A=F[L].call(I,A);return A}}else{var j=d;d=function(I,E){return j.call(I,E)}}a.push(d)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),g?o===1?(a.push(function(I,E){return i.get.call(I,E)}),a.push(function(I,E){return i.set.call(I,E)})):o===2?a.push(i):a.push(function(I,E){return i.call(I,E)}):Object.defineProperty(n,l,s))}function f(a,n,u){for(var l=[],o,b,g=new Map,D=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,T,P;if(h?(T=a,s=s-5,b=b||[],P=b):(T=a.prototype,o=o||[],P=o),s!==0&&!i){var M=h?D:g,S=M.get(d)||0;if(S===!0||S===3&&s!==4||S===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!S&&s>2?M.set(d,s):M.set(d,!0)}m(l,T,p,d,s,h,i,P,u)}}return y(l,o),y(l,b),l}function y(a,n){n&&a.push(function(u){for(var l=0;l<n.length;l++)n[l].call(u);return u})}function x(a,n,u){if(n.length>0){for(var l=[],o=a,b=a.name,g=n.length-1;g>=0;g--){var D={v:!1};try{var w=n[g](o,{kind:"class",name:b,addInitializer:v(l,D),metadata:u})}finally{D.v=!0}w!==void 0&&(c(10,w),o=w)}return[C(o,u),function(){for(var p=0;p<l.length;p++)l[p].call(o)}]}}function C(a,n){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,l,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(b===void 0?null:b),D=f(n,u,g);return l.length||C(n,g),{e:D,get c(){return x(n,l,g)}}}}function xi(v,t,e,r){return(xi=Sa())(v,t,e,r)}var Ti,bi,Se;Ti=Dt({access:q.Read,selector:/^potatno-preview$/});var wi=class{static{({c:[Se,bi]}=xi(this,[],[Ti]))}constructor(t=O.use(tt),e=O.use(Y),r=O.use(nt)){this.mTarget=t,this.mProcedure=e.createExpressionProcedure(r.value)}mProcedure;mTarget;onUpdate(){let t=this.mProcedure.execute();if(!t){let r=this.mTarget.childNodes.length>0;return r&&(this.mTarget.innerHTML=""),r}let e=t.element;return this.mTarget.contains(e)?!1:(this.mTarget.innerHTML="",this.mTarget.appendChild(e),!0)}static{bi()}};var Di=`:host {\r
    display: block;\r
    font-family: var(--potatno-font-family);\r
    font-size: var(--potatno-font-size);\r
\r
    /* Snappy animation on movement. */\r
    transition: var(--potatno-position-snap-animation);\r
\r
    --node-border-radius: 2px;\r
    --node-border-color: color-mix(in srgb, var(--potatno-color-text) 30%, var(--potatno-color-background));\r
    --node-preview-select-height: 24px;\r
}\r
\r
.node {\r
    box-sizing: border-box;\r
    display: flex;\r
    flex-direction: column;\r
    min-height: 100%;\r
    background-color: var(--potatno-color-background);\r
    border: 1px solid var(--node-border-color);\r
    border-radius: var(--node-border-radius);\r
\r
    overflow: visible;\r
    user-select: none;\r
\r
    /* Default size */\r
    --node-width: 6;\r
    --node-height: 6;\r
\r
    /* Resize */\r
    width: calc(var(--potatno-grid-size) * var(--node-width));\r
    /*height: calc(var(--potatno-grid-size) * var(--node-height));*/\r
\r
    &.error {\r
        box-shadow: 0 0 0px 2px var(--potatno-color-error);\r
    }\r
}\r
\r
.node-header {\r
    display: flex;\r
    align-items: center;\r
    color: var(--potatno-color-text-contrast);\r
    font-weight: bold;\r
    font-size: var(--potatno-font-size-small);\r
    border-bottom: 1px solid var(--potatno-color-border);\r
    cursor: grab;\r
\r
    /* Adjust -2px because node itself has a top border of 1px and the header a border on bottom. */\r
    height: calc(var(--potatno-grid-size) - 2px);\r
\r
    /* Animated background of header */\r
    transition: background-size 0.15s ease-in-out;\r
    background-image: radial-gradient(ellipse at top left, var(--node-category-color) 0%, transparent 90%);\r
    background-color: var(--potatno-color-background-dark);\r
    background-size: 100% 100%;\r
\r
    &:hover {\r
        background-size: 140% 100%;\r
    }\r
\r
    &:active {\r
        background-size: 200% 100%;\r
        cursor: grabbing;\r
    }\r
\r
    .node-header__icon {\r
        flex-shrink: 0;\r
        display: flex;\r
        align-items: center;\r
        justify-content: center;\r
        width: calc(var(--potatno-grid-size) - 2px);\r
    }\r
\r
    .node-header__label {\r
        flex: 1;\r
        white-space: nowrap;\r
        overflow: hidden;\r
        text-overflow: ellipsis;\r
    }\r
\r
    .node-header__open-function {\r
        flex-shrink: 0;\r
        display: flex;\r
        justify-content: center;\r
        width: calc(var(--potatno-grid-size) - 2px);\r
        font-size: var(--potatno-font-size-small);\r
        cursor: pointer;\r
\r
        /* Small cool seperator */\r
        border: 0px solid var(--node-border-color);\r
        border-width: 0 0 0 2px;\r
\r
        /* Click and hover animation */\r
        transition: opacity 0.15s, scale 0.15s;\r
\r
        &:hover {\r
            opacity: 0.75;\r
        }\r
\r
        &:active {\r
            opacity: 0.5;\r
            scale: 0.98;\r
        }\r
    }\r
}\r
\r
.node-body {\r
    flex: 1;\r
    display: flex;\r
    gap: 0 20px;\r
\r
    .node-body__ports {\r
        flex: 1;\r
        display: flex;\r
        flex-direction: column;\r
        min-width: 0;\r
    }\r
}\r
\r
.node-preview-toggle {\r
    position: relative;\r
    display: block;\r
    height: calc(var(--potatno-grid-size) / 2);\r
    background-color: var(--potatno-color-background);\r
    cursor: pointer;\r
\r
    --preview-toggle-icon-color: var(--node-border-color);\r
\r
    /* Click animation. */\r
    transition: background-color 0.15s, translate 0.15s;\r
\r
    &.active {\r
        --preview-toggle-icon-color: var(--potatno-color-accent);\r
    }\r
\r
    &:hover {\r
        background-color: var(--potatno-color-background-light);\r
    }\r
\r
    &:active {\r
        background-color: var(--potatno-color-background-dark);\r
        translate: 0 1px;\r
    }\r
\r
    .icon {\r
        position: absolute;\r
        box-sizing: border-box;\r
        left: 50%;\r
        border: 0px solid var(--preview-toggle-icon-color);\r
        border-width: 0px 1px 1px 0;\r
        height: 10px;\r
        width: 10px;\r
        transform: translate(calc(-50% - -1px), -3px) rotate(45deg);\r
        transition: border-color 0.15s, transform 0.15s;\r
\r
        /* Passive size set for the inner arrow. */\r
        padding: 2px;\r
\r
        /* Inner arrow */\r
        &::before {\r
            content: '';\r
            display: block;\r
            border: 0px solid var(--preview-toggle-icon-color);\r
            border-width: 0px 1px 1px 0;\r
            height: 100%;\r
            width: 100%;\r
            transition: border-color 0.15s;\r
        }\r
\r
        .node-preview-toggle.active & {\r
            transform: translate(calc(-50% - -1px), 3px) rotate(-135deg)\r
        }\r
    }\r
}\r
\r
.node-preview {\r
    /* Detached node preview */\r
    position: relative;\r
    top: calc(var(--potatno-grid-size) / 2);\r
\r
    display: flex;\r
    flex-direction: column;\r
    background-color: var(--potatno-color-background-dark);\r
    border: 1px solid var(--node-border-color);\r
    border-radius: var(--node-border-radius);\r
    user-select: none;\r
\r
    /* Previews can size bigger than the node itself and expanding. Limit the width here. */\r
    width: calc(var(--potatno-grid-size) * var(--node-width) - 2px);\r
\r
    /* Small attached line */\r
    &::before {\r
        content: '';\r
        position: absolute;\r
        top: calc(var(--potatno-grid-size) / -2 - 1px);\r
        left: 50%;\r
\r
        display: block;\r
        height: calc(var(--potatno-grid-size) / 2 - 2px);\r
        border: 1px solid var(--node-border-color);\r
    }\r
\r
    .node-preview__window {\r
        display: flex;\r
        padding: 5px;\r
        background: var(--potatno-color-background);\r
        overflow: hidden;\r
\r
        /* The whole preview area has a grid height of 6. [6 - toggle-height - select-height] */\r
        height: calc((var(--potatno-grid-size) * 5.5) - var(--node-preview-select-height));\r
    }\r
\r
    .node-preview__selections {\r
        box-sizing: border-box;\r
        display: flex;\r
        justify-content: space-between;\r
\r
        /* Height minus border */\r
        flex-shrink: 0;\r
        height: calc(var(--node-preview-select-height) - 1px);\r
\r
        .select {\r
            flex: 1;\r
            box-sizing: border-box;\r
            height: 100%;\r
            min-width: 0;\r
            padding: 0px 10px;\r
            background: var(--potatno-color-background-dark);\r
            font-size: var(--potatno-font-size-small);\r
            color: var(--potatno-color-text);\r
\r
            /* Custom borders for animations*/\r
            outline: none;\r
            border: none;\r
            border-bottom: 1px solid var(--potatno-color-border);\r
            transition: border-color 0.15s;\r
\r
            &:focus {\r
                border-color: var(--potatno-color-accent);\r
            }\r
        }\r
\r
        .select-button {\r
            position: relative;\r
            flex: 0;\r
            height: 100%;\r
            border-right: 2px solid var(--potatno-color-background);\r
\r
            .select-button__button {\r
                display: flex;\r
                align-items: center;\r
                justify-content: center;\r
                box-sizing: border-box;\r
                height: 100%;\r
                aspect-ratio: 1 / 1;\r
                color: var(--potatno-color-text);\r
                font-size: var(--potatno-font-size-small);\r
                cursor: pointer;\r
\r
                /* Transition items. */\r
                border: none;\r
                border-bottom: 1px solid var(--potatno-color-border);\r
                background-color: var(--potatno-color-background-dark);\r
\r
                &:hover {\r
                    border-color: var(--potatno-color-accent);\r
                    color: var(--potatno-color-accent);\r
                }\r
\r
                &:active {\r
                    background-color: var(--potatno-color-background);\r
                    scale: 0.98;\r
                }\r
            }\r
\r
            .select-button__options {\r
                /* Defined as hover window of parent. */\r
                position: absolute;\r
                top: calc(100% + 5px);\r
                left: 0px;\r
                display: none;\r
\r
                flex-direction: column;\r
                background-color: var(--potatno-color-background);\r
                overflow: hidden auto;\r
                border: 1px solid var(--potatno-color-border);\r
\r
                scrollbar-color: var(--potatno-color-scrollbar-thumb) var(--potatno-color-scrollbar-track);\r
                scrollbar-width: thin;\r
\r
                .select-button.active & {\r
                    display: flex;\r
                }\r
\r
                .option {\r
                    display: flex;\r
                    box-sizing: border-box;\r
                    width: 100%;\r
                    padding: 5px 12px 5px 9px;\r
                    align-items: center;\r
                    text-align: left;\r
                    color: var(--potatno-color-text);\r
                    cursor: pointer;\r
                    transition: background-color 0.15s, scale 0.15s;\r
\r
                    &.active,\r
                    &:active {\r
                        background-color: var(--potatno-color-background-light);\r
                    }\r
\r
                    &:active {\r
                        scale: 0.98;\r
                    }\r
\r
                    .option__icon {\r
                        display: flex;\r
                        align-items: center;\r
                        width: 2ch;\r
                        height: 15px;\r
                        padding: 0 10px;\r
\r
                        text-align: center;\r
\r
                        /* Border defined to mark selected. */\r
                        border-left: 3px solid var(--potatno-color-text);\r
                        border-color: color-mix(in srgb, var(--potatno-color-text) 25%, var(--potatno-color-background));\r
                        transition: border-color 0.15s;\r
\r
                        .option:hover & {\r
                            border-color: var(--potatno-color-text);\r
                        }\r
\r
                        .option.selected & {\r
                            border-color: var(--potatno-color-accent);\r
                        }\r
                    }\r
\r
                    .option__name {\r
                        flex: 1;\r
                        overflow: hidden;\r
                        text-overflow: ellipsis;\r
                        white-space: nowrap;\r
                    }\r
                }\r
            }\r
        }\r
    }\r
\r
}`;var Ei=`<!-- Resizeable part of node -->\r
<div class="node {{this.hasError ? 'error' : ''}}" style="--node-width: {{ this.nodeTransformation.width }}; --node-height: {{ this.nodeTransformation.height }};">\r
    <div class="node-header" style="--node-category-color: {{this.nodeColor}}" (pointerdown)="this.dragNode($event)">\r
        <span class="node-header__icon">{{this.nodeIcon}}</span>\r
        <span class="node-header__label">{{this.nodeLabel}}</span>\r
\r
        $if(this.isFunction) {\r
            <div class="node-header__open-function" (click)="this.openFunction()">\u21AA</div>\r
        }\r
    </div>\r
\r
    <div class="node-body">\r
        $if(this.inputPorts.length > 0) {\r
            <div class="node-body__ports">    \r
                $for(port of this.inputPorts) {\r
                    <potatno-port [port]="this.port"/>\r
                }   \r
            </div>\r
        }\r
\r
        $if(this.outputPorts.length > 0) {\r
            <div class="node-body__ports">\r
                $for(port of this.outputPorts) {\r
                    <potatno-port [port]="this.port"/>\r
                }\r
            </div>\r
        }\r
    </div>\r
\r
    $if(this.canPreview) {\r
        <div class="node-preview-toggle {{ this.isPreviewActive ? 'active' : '' }}" (click)="this.selectPreviewPort()">\r
            <div class="icon"/>\r
        </div>\r
    }\r
</div>\r
\r
$if(this.isPreviewActive) {\r
    <div class="node-preview" style="--node-width: {{ this.nodeTransformation.width }};">\r
        <div class="node-preview__selections">\r
            <div class="select-button {{ this.isPreviewDisplaySelectionOpen ? 'active' : '' }}" tabindex="-1" (focusout)="this.isPreviewDisplaySelectionOpen = false">\r
                <div class="select-button__button" (click)="this.isPreviewDisplaySelectionOpen = !this.isPreviewDisplaySelectionOpen">\u{1F441}</div>\r
                <div class="select-button__options">\r
                    $for(display of this.previewDisplays) {\r
                        <div class="option {{ this.display.id === this.previewDisplayId ? 'selected' : '' }}" (click)="this.selectPreviewDisplay(this.display.id)">\r
                            <div class="option__icon">\u{1F441}</div>\r
                            <div class="option__name">{{this.display.label}}</div>\r
                        </div>\r
                    }\r
                </div>\r
            </div>\r
\r
            <select class="select" (change)="this.selectPreviewPort($event.target.value)">\r
                $for(port of this.previewPorts) {\r
                    <option [value]="this.port.definitionId" [selected]="this.port.definitionId === this.previewPortDefinitionId">{{this.port.label}}</option>\r
                }\r
            </select>\r
        </div>\r
\r
        <div class="node-preview__window" potatno-preview="this.previewDriver"></div>\r
    </div>\r
}\r
        `;function Aa(){function v(a,n){return function(l){e(n,"addInitializer"),r(l,"An initializer"),a.push(l)}}function t(a,n,u,l,o,b,g,D,w){var p;switch(o){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:g?"#"+n:n,static:b,private:g,metadata:D},d={v:!1};s.addInitializer=v(l,d);var i,h;o===0?g?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(T){this[n]=T}):o===2?i=function(){return u.value}:((o===1||o===3)&&(i=function(){return u.get.call(this)}),(o===1||o===4)&&(h=function(T){u.set.call(this,T)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return a(w,s)}finally{d.v=!0}}function e(a,n){if(a.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(a,n){if(typeof a!="function")throw new TypeError(n+" must be a function")}function c(a,n){var u=typeof n;if(a===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(u!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function m(a,n,u,l,o,b,g,D,w){var p=u[0],s,d,i;g?o===0||o===1?s={get:u[3],set:u[4]}:o===3?s={get:u[3]}:o===4?s={set:u[3]}:s={value:u[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var h,T,P;if(typeof p=="function")h=t(p,l,s,D,o,b,g,w,i),h!==void 0&&(c(o,h),o===0?d=h:o===1?(d=h.init,T=h.get||i.get,P=h.set||i.set,i={get:T,set:P}):i=h);else for(var M=p.length-1;M>=0;M--){var S=p[M];if(h=t(S,l,s,D,o,b,g,w,i),h!==void 0){c(o,h);var N;o===0?N=h:o===1?(N=h.init,T=h.get||i.get,P=h.set||i.set,i={get:T,set:P}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(o===0||o===1){if(d===void 0)d=function(I,E){return E};else if(typeof d!="function"){var F=d;d=function(I,E){for(var A=E,L=0;L<F.length;L++)A=F[L].call(I,A);return A}}else{var j=d;d=function(I,E){return j.call(I,E)}}a.push(d)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),g?o===1?(a.push(function(I,E){return i.get.call(I,E)}),a.push(function(I,E){return i.set.call(I,E)})):o===2?a.push(i):a.push(function(I,E){return i.call(I,E)}):Object.defineProperty(n,l,s))}function f(a,n,u){for(var l=[],o,b,g=new Map,D=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,T,P;if(h?(T=a,s=s-5,b=b||[],P=b):(T=a.prototype,o=o||[],P=o),s!==0&&!i){var M=h?D:g,S=M.get(d)||0;if(S===!0||S===3&&s!==4||S===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!S&&s>2?M.set(d,s):M.set(d,!0)}m(l,T,p,d,s,h,i,P,u)}}return y(l,o),y(l,b),l}function y(a,n){n&&a.push(function(u){for(var l=0;l<n.length;l++)n[l].call(u);return u})}function x(a,n,u){if(n.length>0){for(var l=[],o=a,b=a.name,g=n.length-1;g>=0;g--){var D={v:!1};try{var w=n[g](o,{kind:"class",name:b,addInitializer:v(l,D),metadata:u})}finally{D.v=!0}w!==void 0&&(c(10,w),o=w)}return[C(o,u),function(){for(var p=0;p<l.length;p++)l[p].call(o)}]}}function C(a,n){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,l,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(b===void 0?null:b),D=f(n,u,g);return l.length||C(n,g),{e:D,get c(){return x(n,l,g)}}}}function Li(v,t,e,r){return(Li=Aa())(v,t,e,r)}var Ri,Ii,Oi,Fi,zi,ji,Vi,Ci,Pi,Mi,Si,Ni,_i,Po;Ri=X({selector:"potatno-node",template:Ei,style:Di,modules:[Se],components:[Me]}),Oi=ft("node-drag"),Fi=$.state(),zi=$.state({proxy:!0}),ji=$.state({complexValue:!0}),Vi=$.state({complexValue:!0});var Ai=class{static{({e:[Ci,Pi,Mi,Si,Ni,_i],c:[Po,Ii]}=Li(this,[[Oi,1,"mDrag"],[Fi,1,"isPreviewDisplaySelectionOpen"],[W,3,"nodeData"],[zi,1,"nodeTransformation"],[ji,1,"previewPorts"],[Vi,1,"previewDisplays"]],[Ri]))}constructor(t=O.use(G),e=O.use(H)){this.mComponent=t,this.mManager=e,this.mNodeDefinition=null,this.mNodeData=null,this.isPreviewDisplaySelectionOpen=!1,this.nodeTransformation={height:0,width:0},this.previewPorts=new Array,this.previewDisplays=new Array,this.mUnsubscribeNodeChange=this.mManager.subscribe(R.Node,r=>{r.item===this.mNodeData&&this.resyncComponent(this.nodeData)}),this.mUnsubscribeValidation=this.mManager.subscribe(R.SpecialValidation,()=>{this.mComponent.updater.updateAsync()})}mComponent;mManager;mNodeData;mNodeDefinition;mUnsubscribeNodeChange;mUnsubscribeValidation;get canPreview(){return this.previewPorts.length>0}#t=(_i(this),Ci(this));get mDrag(){return this.#t}set mDrag(t){this.#t=t}get hasError(){if(this.mManager.integrity.errorItems.has(this.nodeData))return!0;for(let t of this.nodeData.inputs.list)if(this.mManager.integrity.errorItems.has(t))return!0;for(let t of this.nodeData.outputs.list)if(this.mManager.integrity.errorItems.has(t))return!0;return!1}get inputPorts(){return this.nodeData.inputs.list}get isFunction(){return this.mNodeDefinition instanceof yt}get isPreviewActive(){return!!this.nodeData.preview}#e=Pi(this);get isPreviewDisplaySelectionOpen(){return this.#e}set isPreviewDisplaySelectionOpen(t){this.#e=t}get nodeColor(){return this.mManager.generateStringColor(this.mNodeDefinition?.category.name??"")}get nodeData(){if(!this.mNodeData)throw new _("Node data not set.",this);return this.mNodeData}set nodeData(t){this.mNodeData=t,this.mNodeDefinition=null,this.mNodeData&&(this.mNodeDefinition=this.mManager.activeFunction.nodeDefinitions.find(e=>e.id===this.mNodeData.definitionId)??null,this.resyncComponent(t),this.mComponent.updater.update())}get nodeIcon(){return this.mNodeDefinition?.category.icon??""}get nodeLabel(){return this.nodeData.label??""}#o=Mi(this);get nodeTransformation(){return this.#o}set nodeTransformation(t){this.#o=t}get outputPorts(){return this.nodeData.outputs.list}#r=Si(this);get previewPorts(){return this.#r}set previewPorts(t){this.#r=t}#n=Ni(this);get previewDisplays(){return this.#n}set previewDisplays(t){this.#n=t}get previewDisplayId(){return this.nodeData.preview?.displayId??""}get previewDriver(){if(!this.nodeData.preview)return null;let t=this.nodeData.outputs.map.get(this.nodeData.preview.portDefinitionId);return t?this.mManager.preview.requestDriver(t,this.nodeData.preview.displayId):null}get previewPortDefinitionId(){return this.nodeData.preview?.portDefinitionId??""}dragNode(t){if(t.button===2&&this.mManager.graph.removeNode(this.nodeData),t.button!==0)return;let e=this.nodeData.transformation.x*this.mManager.grid.gridSize,r=this.nodeData.transformation.y*this.mManager.grid.gridSize,c=this.nodeData.transformation.x,m=this.nodeData.transformation.y,f=this.mComponent.element.getBoundingClientRect(),y=this.mComponent.element.offsetWidth?f.width/this.mComponent.element.offsetWidth:1,x=this.mComponent.element.offsetHeight?f.height/this.mComponent.element.offsetHeight:1,C=t.clientX,a=t.clientY,n=l=>{l.stopPropagation();let o=(l.clientX-C)/y,b=(l.clientY-a)/x,g=Math.round((e+o)/this.mManager.grid.gridSize),D=Math.round((r+b)/this.mManager.grid.gridSize);c===g&&m===D||(this.mManager.graph.transformNode(this.nodeData,w=>{w.moveTo(g,D)}),this.mDrag.dispatchEvent(new Co(g-c,D-m)),c=g,m=D)},u=()=>{document.removeEventListener("pointermove",n),document.removeEventListener("pointerup",u)};document.addEventListener("pointermove",n),document.addEventListener("pointerup",u)}onDeconstruct(){this.mUnsubscribeNodeChange(),this.mUnsubscribeValidation()}openFunction(){this.mNodeDefinition instanceof yt&&this.mManager.setActiveFunction(this.mNodeDefinition.function)}selectPreviewDisplay(t){this.mManager.graph.updateNode(this.nodeData,e=>{e.preview={portDefinitionId:e.preview.portDefinitionId,displayId:t}}),document.activeElement instanceof HTMLElement&&document.activeElement.blur()}selectPreviewPort(t){let e=(()=>{let r=this.previewPorts;return r.length===0?null:typeof t<"u"?r.find(c=>c.definitionId===t)??null:this.nodeData.preview?null:r[0]})();if(!e)return this.mManager.graph.updateNode(this.nodeData,r=>{r.preview=null});this.mManager.graph.updateNode(this.nodeData,r=>{let c=r.project.getFunction(r.function.definitionId),m=r.project.preview.availableDisplays(c,e.resolvedDataType);m.length===0&&(r.preview=null);let f=r.preview&&m.includes(r.preview.displayId)?r.preview.displayId:m[0];r.preview={portDefinitionId:e.definitionId,displayId:f}}),this.resyncComponent(this.nodeData)}getPreviewDisplays(t){if(!t)return new Array;let e=this.nodeData.outputs.map.get(t);if(!e)return new Array;let r=e.project.getFunction(e.node.function.definitionId);return r?e.project.preview.availableDisplays(r,e.resolvedDataType).map(m=>({id:m,label:e.project.preview.getDisplay(m)?.name??m})):new Array}getPreviewablePorts(t){let e=t.project.getFunction(t.function.definitionId);if(!this.mManager.activeFunction.dynamicNodeDefinitions.find(m=>m.id===t.definitionId))return new Array;let c=new Map;return t.outputs.value.filter(m=>{let f=m.resolvedDataType;if(c.has(f))return c.get(f);let y=t.project.preview.availableDisplays(e,m.resolvedDataType);return c.set(f,y.length>0),c.get(f)})}resyncComponent(t){let e=t.transformation.x*this.mManager.grid.gridSize,r=t.transformation.y*this.mManager.grid.gridSize;this.mComponent.element.style.setProperty("left",`${e}px`),this.mComponent.element.style.setProperty("top",`${r}px`),this.nodeTransformation.width=t.transformation.width,this.nodeTransformation.height=t.transformation.height,this.previewPorts=this.getPreviewablePorts(this.nodeData),this.previewDisplays=this.getPreviewDisplays(t.preview?.portDefinitionId??null)}static{Ii()}},Co=class{mX;mY;get x(){return this.mX}get y(){return this.mY}constructor(t,e){this.mX=t,this.mY=e}};var $i=`:host {\r
    position: relative;\r
    flex: 1;\r
    display: flex;\r
    min-height: 0;\r
    min-width: 0;\r
    overflow: hidden;\r
\r
    /* Background color on component, as the position and scale does not affect this layer. */\r
    background-color: var(--potatno-color-background);\r
}\r
\r
.grid-background {\r
    flex: 1;\r
\r
    /* Default mask and postions. */\r
    --mask-image: url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20100%20100%22%3E%3Cpath%20d%3D%22M0%200h18M0%200v18M100%200H82M100%200v18M0%20100h18M0%20100V82M100%20100H82M100%20100V82%22%20stroke%3D%22%23ffffff%22%20stroke-width%3D%225%22%20stroke-linecap%3D%22round%22%2F%3E%3C%2Fsvg%3E");\r
    --grid-position-x: 0px;\r
    --grid-position-y: 0px;\r
    --grid-size: 0px;\r
\r
    /* Background color only used in mask spaces */\r
    background-color: color-mix(in srgb, var(--potatno-color-text) 15%, transparent);\r
\r
    /* Mask pattern that scales and positions with grid (size/position set dynamically). */\r
    mask-size: var(--grid-size) var(--grid-size);\r
    mask-position: var(--grid-position-x) var(--grid-position-y);\r
    mask-repeat: repeat;\r
    mask-image: var(--mask-image);\r
\r
    -webkit-mask-size: var(--grid-size) var(--grid-size);\r
    -webkit-mask-position: var(--grid-position-x) var(--grid-position-y);\r
    -webkit-mask-repeat: repeat;\r
    -webkit-mask-image: var(--mask-image);\r
}\r
\r
.grid-content {\r
    position: absolute;\r
    top: 0;\r
    left: 0;\r
\r
    .grid-content__node {\r
        position: absolute;\r
        filter: drop-shadow(0 2px 8px var(--potatno-color-shadow));\r
\r
        &.selected {\r
            filter: drop-shadow(-1px -1px 0px var(--potatno-color-accent)) drop-shadow(1px 1px 0px var(--potatno-color-accent)) drop-shadow(1px -1px 0px var(--potatno-color-accent)) drop-shadow(-1px 1px 0px var(--potatno-color-accent)) drop-shadow(0 2px 8px var(--potatno-color-shadow));\r
        }\r
    }\r
}\r
\r
.selection-box {\r
    position: absolute;\r
    background-color: color-mix(in srgb, var(--potatno-color-accent) 20%, transparent);\r
    border: 1px solid var(--potatno-color-accent);\r
    pointer-events: none;\r
    z-index: 1000;\r
}`;var Gi=`<!-- Serves only as a background. -->\r
<div class="grid-background" [style]="this.gridBackgroundStyle"></div>\r
\r
<div class="grid-content" [style]="this.gridTransformStyle">\r
    <potatno-connection-layer/>\r
\r
    $for(node of this.nodes) {\r
        $if(this.typeOfNode(this.node) === 'node') {\r
            <potatno-node class="grid-content__node {{this.selectedNodes.has(this.node) ? 'selected' : ''}}" [nodeData]="this.node" (node-drag)="this.moveAllSelected(this.node, $event.value)" (pointerdown)="this.selectNodes([this.node], $event);"/>\r
        }\r
\r
        $if(this.typeOfNode(this.node) === 'conjunction') {\r
            <potatno-conjunction-node class="grid-content__node {{this.selectedNodes.has(this.node) ? 'selected' : ''}}" [nodeData]="this.node" (node-drag)="this.moveAllSelected(this.node, $event.value)" (pointerdown)="this.selectNodes([this.node], $event);"/>\r
        }\r
\r
        $if(this.typeOfNode(this.node) === 'comment') {\r
            <potatno-comment-node class="grid-content__node {{this.selectedNodes.has(this.node) ? 'selected' : ''}}" [nodeData]="this.node" (node-drag)="this.moveAllSelected(this.node, $event.value)" (pointerdown)="this.selectNodes([this.node], $event);"/>\r
        }\r
    }\r
\r
    $if(this.selectBox !== null) {\r
        <div class="selection-box" style="left: {{this.selectBox.x}}px; top: {{this.selectBox.y}}px; width: {{this.selectBox.width}}px; height: {{this.selectBox.height}}px;"></div>\r
    }\r
</div>\r
\r
$if(this.popupPosition !== null) {\r
    <potatno-node-selection-popup (focusout)="this.popupPosition = null" style="left: {{this.popupPosition.local.x}}px; top: {{this.popupPosition.local.y}}px;" (node-select)="this.createNodeOnPopupPosition($event.value)"/>\r
}\r
`;function Oa(){function v(a,n){return function(l){e(n,"addInitializer"),r(l,"An initializer"),a.push(l)}}function t(a,n,u,l,o,b,g,D,w){var p;switch(o){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:g?"#"+n:n,static:b,private:g,metadata:D},d={v:!1};s.addInitializer=v(l,d);var i,h;o===0?g?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(T){this[n]=T}):o===2?i=function(){return u.value}:((o===1||o===3)&&(i=function(){return u.get.call(this)}),(o===1||o===4)&&(h=function(T){u.set.call(this,T)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return a(w,s)}finally{d.v=!0}}function e(a,n){if(a.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(a,n){if(typeof a!="function")throw new TypeError(n+" must be a function")}function c(a,n){var u=typeof n;if(a===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(u!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function m(a,n,u,l,o,b,g,D,w){var p=u[0],s,d,i;g?o===0||o===1?s={get:u[3],set:u[4]}:o===3?s={get:u[3]}:o===4?s={set:u[3]}:s={value:u[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var h,T,P;if(typeof p=="function")h=t(p,l,s,D,o,b,g,w,i),h!==void 0&&(c(o,h),o===0?d=h:o===1?(d=h.init,T=h.get||i.get,P=h.set||i.set,i={get:T,set:P}):i=h);else for(var M=p.length-1;M>=0;M--){var S=p[M];if(h=t(S,l,s,D,o,b,g,w,i),h!==void 0){c(o,h);var N;o===0?N=h:o===1?(N=h.init,T=h.get||i.get,P=h.set||i.set,i={get:T,set:P}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(o===0||o===1){if(d===void 0)d=function(I,E){return E};else if(typeof d!="function"){var F=d;d=function(I,E){for(var A=E,L=0;L<F.length;L++)A=F[L].call(I,A);return A}}else{var j=d;d=function(I,E){return j.call(I,E)}}a.push(d)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),g?o===1?(a.push(function(I,E){return i.get.call(I,E)}),a.push(function(I,E){return i.set.call(I,E)})):o===2?a.push(i):a.push(function(I,E){return i.call(I,E)}):Object.defineProperty(n,l,s))}function f(a,n,u){for(var l=[],o,b,g=new Map,D=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,T,P;if(h?(T=a,s=s-5,b=b||[],P=b):(T=a.prototype,o=o||[],P=o),s!==0&&!i){var M=h?D:g,S=M.get(d)||0;if(S===!0||S===3&&s!==4||S===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!S&&s>2?M.set(d,s):M.set(d,!0)}m(l,T,p,d,s,h,i,P,u)}}return y(l,o),y(l,b),l}function y(a,n){n&&a.push(function(u){for(var l=0;l<n.length;l++)n[l].call(u);return u})}function x(a,n,u){if(n.length>0){for(var l=[],o=a,b=a.name,g=n.length-1;g>=0;g--){var D={v:!1};try{var w=n[g](o,{kind:"class",name:b,addInitializer:v(l,D),metadata:u})}finally{D.v=!0}w!==void 0&&(c(10,w),o=w)}return[C(o,u),function(){for(var p=0;p<l.length;p++)l[p].call(o)}]}}function C(a,n){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,l,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(b===void 0?null:b),D=f(n,u,g);return l.length||C(n,g),{e:D,get c(){return x(n,l,g)}}}}function Yi(v,t,e,r){return(Yi=Oa())(v,t,e,r)}function Fa(v){return v}var Wi,Bi,Zi,qi,Ui,Xi,Hi,to;Wi=X({selector:"potatno-node-graph",template:Gi,style:$i,components:[se,Po,To,Eo,Io]}),Zi=$.state(),qi=$.state({complexValue:!0});new class extends Fa{constructor(){super(to),Bi()}static{class v{static{({e:[Ui,Xi,Hi],c:[to,Bi]}=Yi(this,[[Zi,1,"popupPosition"],[qi,1,"selectBox"]],[Wi]))}static ZOOM_STRENGTH=.1;mComponent;mIsMouseInsideGrid;mKeyboardHandler;mManager;mUnsubscribeFunctionChange;mUnsubscribeGraphChange;#t=(Hi(this),Ui(this));get popupPosition(){return this.#t}set popupPosition(e){this.#t=e}#e=Xi(this);get selectBox(){return this.#e}set selectBox(e){this.#e=e}get gridBackgroundStyle(){let e=this.mManager.grid.gridSize*this.mManager.grid.zoom,r=this.mManager.grid.panX%e,c=this.mManager.grid.panY%e;return`--grid-size: ${e}px; --grid-position-x: ${r}px; --grid-position-y: ${c}px;`}get gridTransformStyle(){return`transform: translate(${this.mManager.grid.panX}px, ${this.mManager.grid.panY}px) scale(${this.mManager.grid.zoom})`}get nodes(){return this.mManager.activeFunction.nodes}get selectedNodes(){return this.mManager.grid.selectedNodes}constructor(e=O.use(G),r=O.use(H)){this.mComponent=e,this.mManager=r,this.mIsMouseInsideGrid=!1,this.popupPosition=null,this.selectBox=null,this.mManager.grid.gridElement=this.mComponent.element,e.element.addEventListener("pointerdown",c=>{this.onPointerDown(c)}),e.element.addEventListener("wheel",c=>{this.onScroll(c)}),e.element.addEventListener("contextmenu",c=>{c.preventDefault()}),e.element.addEventListener("pointerenter",()=>{this.mIsMouseInsideGrid=!0}),e.element.addEventListener("pointerleave",()=>{this.mIsMouseInsideGrid=!1}),e.element.addEventListener("dragover",c=>{this.mManager.grid.draggedPort.isDragging&&(c.preventDefault(),c.stopPropagation(),c.dataTransfer&&(c.dataTransfer.dropEffect="link"))}),e.element.addEventListener("drop",c=>{this.createDroppedConjunction(c)}),this.mKeyboardHandler=c=>{this.onKeyDown(c)},document.addEventListener("keydown",this.mKeyboardHandler),this.mUnsubscribeFunctionChange=this.mManager.subscribe(R.Document|R.Function|R.SpecialActiveFunction,()=>{this.popupPosition=null,this.selectBox=null}),this.mUnsubscribeGraphChange=this.mManager.subscribe(R.NodeAdd|R.NodeDelete|R.SpecialGrid|R.SpecialSelectNode,()=>{this.mComponent.updater.updateAsync()})}createNodeOnPopupPosition(e){let r=this.mManager.graph.addNode(this.mManager.activeFunction,e,{x:this.popupPosition?.grid.x??0,y:this.popupPosition?.grid.y??0,height:0,width:0});this.popupPosition=null,this.selectNodes([r],!1)}moveAllSelected(e,r){for(let c of this.mManager.grid.selectedNodes)c!==e&&this.mManager.graph.transformNode(c,m=>{m.moveTo(m.transformation.x+r.x,m.transformation.y+r.y)})}onDeconstruct(){this.mUnsubscribeFunctionChange(),this.mUnsubscribeGraphChange(),document.removeEventListener("keydown",this.mKeyboardHandler)}selectNodes(e,r){let c=!!r;r instanceof PointerEvent&&(r.stopPropagation(),c=r.ctrlKey);let m=new Set,f=new Set(this.mManager.grid.selectedNodes);if(!c)if(e.length===1&&f.has(e.at(0)))for(let x of f)m.add(x);else f.clear();let y=[...e];for(let x of y)m.has(x)||(m.add(x),x.definitionId===bt.DEFINITION_ID&&y.push(...this.getNodesInRectangle({top:x.transformation.y,right:x.transformation.x+x.transformation.width,bottom:x.transformation.y+x.transformation.height,left:x.transformation.x})),f.has(x)?f.delete(x):f.add(x));this.mManager.grid.selectNodes([...f])}typeOfNode(e){switch(e.definitionId){case bt.DEFINITION_ID:return"comment";case k.DEFINITION_ID:case Z.DEFINITION_ID:return"conjunction";default:return"node"}}convertGlobalToGridLocalPosition(e,r){let c=this.mComponent.element.getBoundingClientRect();return{x:e-c.left,y:r-c.top}}createDroppedConjunction(e){if(!this.mManager.grid.draggedPort.isDragging)return;e.preventDefault(),e.stopPropagation();let r=this.mManager.grid.draggedPort.ports.filter(y=>!(y.direction==="output"&&y.portType==="flow"&&y.connectedPorts.size>0||y.direction==="input"&&y.portType==="value"&&y.connectedPorts.size>0));if(r.length===0)return;let c=this.mManager.grid.draggedPort.ports[0].portType==="flow"?this.mManager.project.nodeDefinitions.get(Z.DEFINITION_ID):this.mManager.project.nodeDefinitions.get(k.DEFINITION_ID),m=this.mManager.grid.pixelToGridSpace(e.clientX,e.clientY),f=this.mManager.graph.addNode(this.mManager.activeFunction,c,{x:m.x,y:m.y,height:0,width:0});this.mManager.graph.connectConjunction(f,r)}getNodesInRectangle(e){let r=new Array;for(let c of this.mManager.activeFunction.nodes){let m=c.transformation.y,f=c.transformation.x,y=f+c.transformation.width,x=m+c.transformation.height;if(f<e.right&&y>e.left&&m<e.bottom&&x>e.top){if(e.top>m&&e.right<y&&e.bottom<x&&e.left>f)continue;r.push(c)}}return r}onKeyDown(e){if(!this.mIsMouseInsideGrid)return;let r=document.activeElement;if(!(r instanceof HTMLInputElement||r instanceof HTMLTextAreaElement||r instanceof HTMLSelectElement)){switch(e.key){case"Escape":{this.popupPosition=null;return}case"Delete":{for(let c of this.mManager.grid.selectedNodes)this.mManager.graph.removeNode(c);this.selectNodes([],!1);return}}if(e.ctrlKey)switch(e.key){case"z":{e.preventDefault(),this.mManager.history.undo();return}case"y":{e.preventDefault(),this.mManager.history.redo();return}case"c":{this.mManager.clipboard.copy(this.mManager.grid.selectedNodes);return}case"v":e.preventDefault(),this.pasteFromClipboard()}}}onPointerDown(e){switch(e.button){case 0:{e.ctrlKey||this.selectNodes([],!1),this.pointerDrag(e,"selecting");return}case 1:{e.preventDefault(),this.pointerDrag(e,"panning");return}case 2:{this.openNodeSelectionPopupAtPointer(e.clientX,e.clientY);return}}}onScroll(e){e.preventDefault();let r=e.deltaY>0?-1:1,c=this.convertGlobalToGridLocalPosition(e.clientX,e.clientY);this.mManager.grid.zoomAt(c.x,c.y,r*v.ZOOM_STRENGTH)}openNodeSelectionPopupAtPointer(e,r){let c=this.mComponent.element,m=this.convertGlobalToGridLocalPosition(e,r),f=this.mManager.grid.pixelToGridSpace(e,r),y=8,x=Math.max(0,c.clientWidth-se.POPUP_WIDTH-y),C=Math.max(0,c.clientHeight-se.POPUP_HEIGHT-y);this.popupPosition={local:{x:Math.max(y,Math.min(m.x,x)),y:Math.max(y,Math.min(m.y,C))},grid:f}}pasteFromClipboard(){let e=this.mManager.clipboard.paste();e.length!==0&&this.selectNodes(e,!1)}pointerDrag(e,r){let c=this.mManager.grid.pixelToGridPixelSpace(e.clientX,e.clientY),m={x:e.clientX,y:e.clientY},f=x=>{switch(r){case"panning":{this.mManager.grid.pan(x.clientX-m.x,x.clientY-m.y),m.x=x.clientX,m.y=x.clientY;break}case"selecting":{let C=this.mManager.grid.pixelToGridPixelSpace(x.clientX,x.clientY);this.selectBox={x:Math.min(c.x,C.x),y:Math.min(c.y,C.y),width:Math.abs(C.x-c.x),height:Math.abs(C.y-c.y)};break}}},y=x=>{if(document.removeEventListener("pointermove",f),document.removeEventListener("pointerup",y),r==="selecting"&&this.selectBox){let C=this.mManager.grid.gridPixelSpaceToGridSpace({x:this.selectBox.x,y:this.selectBox.y},!1),a=this.mManager.grid.gridPixelSpaceToGridSpace({x:this.selectBox.x+this.selectBox.width,y:this.selectBox.y+this.selectBox.height},!1),n=this.getNodesInRectangle({top:C.y,right:a.x,bottom:a.y,left:C.x});this.selectNodes(n,x.ctrlKey),this.selectBox=null}};document.addEventListener("pointermove",f),document.addEventListener("pointerup",y)}}}};var ae=class{mCodeGenerator;mId;mLabel;mNodesProvider;mStatics;get codeGenerator(){return this.mCodeGenerator}get id(){return this.mId}get label(){return this.mLabel}get statics(){return this.mStatics}constructor(t){this.mId=t.id,this.mLabel=t.label,this.mNodesProvider=t.nodes,this.mStatics=t.statics,this.mCodeGenerator=t.generator.code}getNodeDefinitions(t){let e=c=>{if(!c)return new Array;let m=new Array;return c(f=>{m.push(f)},t),m},r={};return Object.defineProperty(r,"entry",{get:()=>e(this.mNodesProvider.entry)}),Object.defineProperty(r,"exit",{get:()=>e(this.mNodesProvider.exit)}),Object.defineProperty(r,"dynamic",{get:()=>e(this.mNodesProvider.dynamic)}),r}},Ft={none:0,imports:1,inputs:2,outputs:4};var Ji=`:host {\r
    display: flex;\r
    flex-direction: column;\r
    height: 100%;\r
    overflow: hidden;\r
}\r
\r
.resize-box {\r
    --resize-box-handle-color: var(--potatno-color-border);\r
\r
    height: 100%;\r
    background-color: var(--potatno-color-background-dark);\r
\r
    /* Set min, max and default width */\r
    max-width: 500px;\r
    min-width: 200px;\r
\r
    /* Hopefully that cascade into all childs. */\r
    font-family: var(--potatno-font-family);\r
    font-size: var(--potatno-font-size);\r
    color: var(--potatno-color-text);\r
\r
    /* Enable content scroll */\r
    overflow-y: auto;\r
    overflow-x: hidden;\r
    scrollbar-color: var(--potatno-color-scrollbar-thumb) var(--potatno-color-scrollbar-track);\r
    scrollbar-width: thin;\r
}\r
\r
.section {\r
    padding: 8px 12px;\r
    border-bottom: 1px solid var(--potatno-color-border);\r
\r
    &:last-child {\r
        border-bottom: none;\r
    }\r
\r
    .section__label {\r
        font-size: var(--potatno-font-size-small);\r
        color: var(--potatno-color-accent);\r
        text-transform: uppercase;\r
        margin-bottom: 6px;\r
    }\r
\r
    .section__empty {\r
        padding: 4px 0;\r
        opacity: 0.5;\r
\r
        font-size: var(--potatno-font-size-small);\r
        font-style: italic;\r
    }\r
\r
    .section__list {\r
        display: flex;\r
        flex-direction: column;\r
        gap: 4px;\r
    }\r
\r
    .section__button {\r
        display: flex;\r
        align-items: center;\r
        justify-content: center;\r
        box-sizing: border-box;\r
        width: 100%;\r
\r
        gap: 6px;\r
        padding: 4px 8px;\r
        margin: 4px 0 0 0;\r
\r
        font-size: var(--potatno-font-size-small);\r
        cursor: pointer;\r
\r
        /* Transition items. */\r
        border: 1px dashed var(--potatno-color-border);\r
        border-radius: 2px;\r
        background-color: var(--potatno-color-background-light);\r
\r
        transition: border-color 0.15s, color 0.15s, background-color 0.15s, scale 0.15s;\r
\r
        &:hover {\r
            border-color: var(--potatno-color-accent);\r
            color: var(--potatno-color-accent);\r
        }\r
\r
        &:active {\r
            background-color: var(--potatno-color-background);\r
            scale: 0.98;\r
        }\r
    }\r
}\r
\r
.list-item {\r
    display: flex;\r
    align-items: center;\r
    gap: 4px;\r
\r
    .list-item__delete {\r
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
        transition: background-color 0.15s, opacity 0.15s;\r
\r
        &:hover {\r
            background-color: var(--potatno-color-error);\r
            opacity: 0.75;\r
        }\r
\r
        &:active {\r
            background-color: var(--potatno-color-error);\r
            opacity: 0.5;\r
        }\r
    }\r
\r
    .list-item__button {\r
        flex: 0;\r
        display: flex;\r
        align-items: center;\r
        justify-content: center;\r
        box-sizing: border-box;\r
\r
        gap: 6px;\r
        padding: 4px 12px;\r
\r
        font-size: var(--potatno-font-size-small);\r
        cursor: pointer;\r
\r
        /* Transition items. */\r
        border: 1px dashed var(--potatno-color-border);\r
        border-radius: 2px;\r
        background-color: var(--potatno-color-background-light);\r
\r
        transition: border-color 0.15s, color 0.15s, background-color 0.15s, scale 0.15s;\r
\r
        &:hover {\r
            border-color: var(--potatno-color-accent);\r
            color: var(--potatno-color-accent);\r
        }\r
\r
        &:active {\r
            background-color: var(--potatno-color-background);\r
            scale: 0.98;\r
        }\r
    }\r
\r
    .list-item__text-input {\r
        /* Hear me out... this max the text input but also allows the select to also grow when no text input is present */\r
        flex: 999;\r
        min-width: 0;\r
\r
        padding: 5px 6px;\r
        background: var(--potatno-color-background-light);\r
        font-size: var(--potatno-font-size-small);\r
        color: var(--potatno-color-text);\r
\r
        /* Custom borders for animations*/\r
        border: 1px solid var(--potatno-color-border);\r
        border-radius: 2px;\r
        outline: none;\r
        transition: border-color 0.15s;\r
\r
        &:focus {\r
            border-color: var(--potatno-color-accent);\r
        }\r
\r
        &:disabled {\r
            opacity: 0.5;\r
            cursor: not-allowed;\r
        }\r
\r
        &.error {\r
            border-color: var(--potatno-color-error);\r
        }\r
    }\r
\r
    .list-item__select-input {\r
        flex: 1;\r
        padding: 5px 6px;\r
        background: var(--potatno-color-background-light);\r
        font-size: var(--potatno-font-size-small);\r
        color: var(--potatno-color-text);\r
\r
        /* Custom borders for animations*/\r
        border: 1px solid var(--potatno-color-border);\r
        border-radius: 2px;\r
        outline: none;\r
        transition: border-color 0.15s;\r
\r
        &:focus {\r
            border-color: var(--potatno-color-accent);\r
        }\r
\r
        &:disabled {\r
            opacity: 0.5;\r
            cursor: not-allowed;\r
        }\r
    }\r
\r
    .list-item__text {\r
        flex: 1;\r
        padding: 4px 6px;\r
        font-size: var(--potatno-font-size-small);\r
\r
        /* Ellipsis stuff */\r
        overflow: hidden;\r
        text-overflow: ellipsis;\r
        white-space: nowrap;\r
    }\r
}`;var Ki=`<kg-resize-box class="resize-box" left="true" width="250">\r
\r
    <!-- Function name -->\r
    <div class="section">\r
        <div class="section__label">Function Name</div>\r
        <div class="section__list">\r
            <div class="list-item">\r
                <input class="list-item__text-input" type="text" [(value)]="this.functionProperties.label" [disabled]="this.functionProperties.statics.label" (change)="this.submitChange()"/>\r
            </div>\r
        </div>\r
    </div>\r
\r
    <!-- Inputs -->\r
    <div class="section">\r
        <div class="section__label">Inputs</div>\r
        <div class="section__list">\r
            $for(functionPort of this.functionProperties.inputs) {\r
                <div class="list-item">\r
                    <!-- Label/Name -->\r
                    <input class="list-item__text-input {{ this.functionPort.hasError ? 'error' : '' }}" type="text" [(value)]="this.functionPort.label" [disabled]="this.functionProperties.statics.inputs" (change)="this.submitChange()"/>\r
\r
                    <!-- Type Selection -->\r
                    <select class="list-item__select-input" [(value)]="this.functionPort.dataType" [disabled]="this.functionProperties.statics.inputs" (change)="this.submitChange()">\r
                        $for(portType of this.projectTypes) {\r
                            <option [value]="this.portType">{{this.portType}}</option>\r
                        }\r
                    </select>\r
\r
                    <!-- Delete button if not static -->\r
                    $if(!this.functionProperties.statics.inputs) {\r
                        <div class="list-item__delete" (click)="this.deletePort(this.functionPort, this.functionProperties.inputs)">\u2715</div>\r
                    }\r
                </div>\r
            }\r
\r
            $if(this.functionProperties.inputs.length === 0) {\r
                <div class="section__empty">No inputs defined.</div>\r
            }\r
\r
            $if(!this.functionProperties.statics.inputs) {\r
                <div class="section__button" (click)="this.addPort(this.functionProperties.inputs)">\r
                    <div>+</div>\r
                    <div>Add Input</div>\r
                </div>\r
            }\r
        </div>\r
    </div>\r
\r
    <!-- Outputs -->\r
    <div class="section">\r
        <div class="section__label">Outputs</div>\r
        <div class="section__list">\r
            $for(functionPort of this.functionProperties.outputs) {\r
                <div class="list-item">\r
                    <!-- Label/Name -->\r
                    <input class="list-item__text-input {{ this.functionPort.hasError ? 'error' : '' }}" type="text" [(value)]="this.functionPort.label" [disabled]="this.functionProperties.statics.outputs" (change)="this.submitChange()"/>\r
\r
                    <!-- Type Selection -->\r
                    <select class="list-item__select-input" [(value)]="this.functionPort.dataType" [disabled]="this.functionProperties.statics.outputs" (change)="this.submitChange()">\r
                        $for(portType of this.projectTypes) {\r
                            <option [value]="this.portType">{{this.portType}}</option>\r
                        }\r
                    </select>\r
\r
                    <!-- Delete button if not static -->\r
                    $if(!this.functionProperties.statics.outputs) {\r
                        <div class="list-item__delete" (click)="this.deletePort(this.functionPort, this.functionProperties.outputs)">\u2715</div>\r
                    }\r
                </div>\r
            }\r
\r
            $if(this.functionProperties.outputs.length === 0) {\r
                <div class="section__empty">No outputs defined.</div>\r
            }\r
\r
            $if(!this.functionProperties.statics.outputs) {\r
                <div class="section__button" (click)="this.addPort(this.functionProperties.outputs)">\r
                    <div>+</div>\r
                    <div>Add Input</div>\r
                </div>\r
            }\r
        </div>\r
    </div>\r
\r
    <div class="section">\r
        <div class="section__label">Imports</div>\r
        <div class="section__list">\r
            $for(import of this.functionProperties.imports) {\r
                <div class="list-item">\r
                    <span class="list-item__text">{{this.import.label}}</span>\r
\r
                    $if(!this.functionProperties.statics.imports) {\r
                        <div class="list-item__delete" (click)="this.deleteImport(this.import)">\u2715</div>\r
                    }\r
                </div>\r
            }\r
\r
            $if(this.functionProperties.imports.length === 0) {\r
                <div class="section__empty">No imports added.</div>\r
            }\r
\r
            $if(!this.functionProperties.statics.imports && this.unusedImports.length > 0) {\r
                <div class="list-item">\r
                    <select class="list-item__select-input" [(value)]="this.selectedImportId">\r
                        $for(import of this.unusedImports) {\r
                            <option [value]="this.import.id">{{this.import.label}}</option>\r
                        }\r
                    </select>\r
                    <div class="list-item__button" (click)="this.addSelectedImport()">\r
                        <div>+</div>\r
                        <div>Add</div>\r
                    </div>\r
                </div>\r
            }\r
        </div>\r
        \r
    </div>\r
</kg-resize-box>\r
`;function Va(){function v(a,n){return function(l){e(n,"addInitializer"),r(l,"An initializer"),a.push(l)}}function t(a,n,u,l,o,b,g,D,w){var p;switch(o){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:g?"#"+n:n,static:b,private:g,metadata:D},d={v:!1};s.addInitializer=v(l,d);var i,h;o===0?g?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(T){this[n]=T}):o===2?i=function(){return u.value}:((o===1||o===3)&&(i=function(){return u.get.call(this)}),(o===1||o===4)&&(h=function(T){u.set.call(this,T)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return a(w,s)}finally{d.v=!0}}function e(a,n){if(a.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(a,n){if(typeof a!="function")throw new TypeError(n+" must be a function")}function c(a,n){var u=typeof n;if(a===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(u!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function m(a,n,u,l,o,b,g,D,w){var p=u[0],s,d,i;g?o===0||o===1?s={get:u[3],set:u[4]}:o===3?s={get:u[3]}:o===4?s={set:u[3]}:s={value:u[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var h,T,P;if(typeof p=="function")h=t(p,l,s,D,o,b,g,w,i),h!==void 0&&(c(o,h),o===0?d=h:o===1?(d=h.init,T=h.get||i.get,P=h.set||i.set,i={get:T,set:P}):i=h);else for(var M=p.length-1;M>=0;M--){var S=p[M];if(h=t(S,l,s,D,o,b,g,w,i),h!==void 0){c(o,h);var N;o===0?N=h:o===1?(N=h.init,T=h.get||i.get,P=h.set||i.set,i={get:T,set:P}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(o===0||o===1){if(d===void 0)d=function(I,E){return E};else if(typeof d!="function"){var F=d;d=function(I,E){for(var A=E,L=0;L<F.length;L++)A=F[L].call(I,A);return A}}else{var j=d;d=function(I,E){return j.call(I,E)}}a.push(d)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),g?o===1?(a.push(function(I,E){return i.get.call(I,E)}),a.push(function(I,E){return i.set.call(I,E)})):o===2?a.push(i):a.push(function(I,E){return i.call(I,E)}):Object.defineProperty(n,l,s))}function f(a,n,u){for(var l=[],o,b,g=new Map,D=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,T,P;if(h?(T=a,s=s-5,b=b||[],P=b):(T=a.prototype,o=o||[],P=o),s!==0&&!i){var M=h?D:g,S=M.get(d)||0;if(S===!0||S===3&&s!==4||S===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!S&&s>2?M.set(d,s):M.set(d,!0)}m(l,T,p,d,s,h,i,P,u)}}return y(l,o),y(l,b),l}function y(a,n){n&&a.push(function(u){for(var l=0;l<n.length;l++)n[l].call(u);return u})}function x(a,n,u){if(n.length>0){for(var l=[],o=a,b=a.name,g=n.length-1;g>=0;g--){var D={v:!1};try{var w=n[g](o,{kind:"class",name:b,addInitializer:v(l,D),metadata:u})}finally{D.v=!0}w!==void 0&&(c(10,w),o=w)}return[C(o,u),function(){for(var p=0;p<l.length;p++)l[p].call(o)}]}}function C(a,n){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,l,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(b===void 0?null:b),D=f(n,u,g);return l.length||C(n,g),{e:D,get c(){return x(n,l,g)}}}}function os(v,t,e,r){return(os=Va())(v,t,e,r)}var rs,Qi,ns,ki,ts,Mo;rs=X({selector:"potatno-function-properties",template:Ki,style:Ji,components:[Pt]}),ns=$.state({complexValue:!0});var es=class{static{({e:[ki,ts],c:[Mo,Qi]}=os(this,[[ns,1,"functionProperties"]],[rs]))}constructor(t=O.use(H)){this.mManager=t,this.mSelectedImportId="",this.mProjectTypes=new Set,this.functionProperties=this.convertFunctionProperties(),this.mUnsubscribe=this.mManager.subscribe(R.Document|R.Function|R.SpecialActiveFunction,()=>{this.mProjectTypes.clear();for(let[e]of this.mManager.project.types.types)this.mProjectTypes.add(e);this.functionProperties=this.convertFunctionProperties()})}mManager;mProjectTypes;mSelectedImportId;mUnsubscribe;#t=(ts(this),ki(this));get functionProperties(){return this.#t}set functionProperties(t){this.#t=t}get projectTypes(){return this.mProjectTypes}get selectedImportId(){return this.mSelectedImportId}set selectedImportId(t){this.mSelectedImportId=t}get unusedImports(){return this.mManager.activeFunction.project.imports.filter(t=>!this.functionProperties.imports.find(e=>t.id===e.id))}addPort(t){let e=this.projectTypes.values().next().value;if(!e)return;let r=t===this.functionProperties.inputs?"Input":"Output";t.push({label:r,dataType:e,hasError:!1}),this.submitChange()}addSelectedImport(){let t=this.unusedImports;if(t.length===0)return;let e=t.find(r=>r.id===this.mSelectedImportId);e||(e=t.at(0)),this.functionProperties.imports.push(e),this.submitChange()}deleteImport(t){let e=this.functionProperties.imports.indexOf(t);e!==-1&&(this.functionProperties.imports.splice(e,1),this.submitChange())}deletePort(t,e){let r=e.indexOf(t);r!==-1&&(e.splice(r,1),this.submitChange())}onDeconstruct(){this.mUnsubscribe()}async submitChange(){let t=!1,e=new Set;for(let f of this.functionProperties.inputs)f.hasError=e.has(f.label),t||=f.hasError,e.add(f.label);let r=new Set;for(let f of this.functionProperties.outputs)f.hasError=r.has(f.label),t||=f.hasError,r.add(f.label);if(t){this.functionProperties=this.functionProperties;return}let c=this.mManager.activeFunction,m=this.functionProperties;await new Promise(f=>{globalThis.setTimeout(f,10)}),this.mManager.graph.updateFunction(c,f=>{if(f.label=m.label,!m.statics.inputs){for(;f.inputs.length>0;)f.removeInput(f.inputs.at(0));for(let y of m.inputs)f.addInput({dataType:y.dataType,label:y.label})}if(!m.statics.outputs){for(;f.outputs.length>0;)f.removeOutput(f.outputs.at(0));for(let y of m.outputs)f.addOutput({dataType:y.dataType,label:y.label})}if(!m.statics.imports){for(let y of f.imports)f.removeImport(y);for(let y of m.imports)f.addImport(y.id)}})}convertFunctionProperties(){let t={label:"",inputs:new Array,outputs:new Array,imports:new Array,statics:{label:!0,imports:!0,inputs:!0,outputs:!0}},e=this.mManager.activeFunction,r=e.project.getFunction(e.definitionId);r&&(t.statics.label=e.isSystem,t.statics.imports=(r.statics&Ft.imports)!==0,t.statics.inputs=(r.statics&Ft.inputs)!==0,t.statics.outputs=(r.statics&Ft.outputs)!==0),t.label=e.label;for(let c of e.project.imports)e.imports.has(c.id)&&t.imports.push({id:c.id,label:c.label});for(let c of e.inputs)t.inputs.push({label:c.label,dataType:c.dataType,hasError:!1});for(let c of e.outputs)t.outputs.push({label:c.label,dataType:c.dataType,hasError:!1});return t}static{Qi()}};var eo=class{mDependencies;mDocument;mEntryPoint;get code(){return this.mDocument.project.generator.code(this)}get dependencies(){return this.mDependencies}get entryPoint(){return this.mEntryPoint}constructor(t,e,r){this.mDocument=t,this.mEntryPoint=e,this.mDependencies=r}};var oo=class{mFunction;mGraphs;get code(){let t=this.mFunction.project.getFunction(this.mFunction.definitionId);if(!t)throw new _("Function result has an invalid function definition id.",this);return t.codeGenerator.body(this)}get function(){return this.mFunction}get graphs(){return Array.from(this.mGraphs.values())}constructor(t){this.mFunction=t,this.mGraphs=new Map}addGraph(t){this.mGraphs.set(t.entryNode.definitionId,t)}graphResultOf(t){return this.mGraphs.get(t)}};var ro=class{mBodyCode;mDependencies;mEntryNode;mExitNode;mNodeIds;mPorts;get code(){return this.mBodyCode}get dependencies(){return this.mDependencies}get entryNode(){return this.mEntryNode}get exitNode(){return this.mExitNode}get nodes(){return this.mNodeIds}get ports(){return this.mPorts}constructor(t){this.mBodyCode=t.bodyCode,this.mDependencies=[...t.dependencies],this.mEntryNode=t.entryNode,this.mExitNode=t.exitNode,this.mNodeIds=t.nodeIds,this.mPorts=t.portValues}};var le=class{mProject;constructor(t){this.mProject=t}generateDocument(t,e=!1){let r=[...t.functions].find(c=>c.isSystem);if(!r)throw new _("No entry point function found for code generation.",this);return this.generateFunction(r,e)}generateFunction(t,e=!1){return this.buildDocumentResult(t.document,t.getExitNodes(),e)}generateNode(t,e=!1){return this.buildDocumentResult(t.document,[t],e)}buildDocumentResult(t,e,r){if(t.validate().errors.length>0)throw new _("Code generation exited. Code graph validation failed.",this);let m={counter:{nodeIndex:0,portIndex:0},debug:r,nodeDefinitions:new Map},f=this.generateFunctionWithDependencies(m,e,new Set),y=f.pop();return new eo(t,y,f)}countNodeEncounter(t,e){let r=new Map,c=new Set,m=new Array(t);for(;m.length>0;){let f=m.pop();if(r.set(f,(r.get(f)??0)+1),!(f===e||c.has(f))){c.add(f);for(let y of f.inputs.flow)for(let x of this.resolveFlowConjunctions(y))m.push(x.node);for(let y of f.inputs.value){let x=this.resolveValueConjunctions(y);x&&m.push(x.node)}}}return r}createScope(t,e){return{emittedNodes:new Set,remaining:this.countNodeEncounter(t,e)}}emitNode(t,e,r,c,m){if(!t.nodeDefinitions.get(r.function)){let l=new Map;for(let o of r.function.nodeDefinitions)l.set(o.id,o);t.nodeDefinitions.set(r.function,l)}let f=t.nodeDefinitions.get(r.function).get(r.definitionId);if(!f)throw new _(`Node definition "${r.definitionId}" not found for node "${r.label}".`,this);f instanceof yt&&e.dependencies.push(f.function);let y={},x=new Array;for(let l of r.inputs.value){let o=this.resolveInputValue(t,e,l);y[l.definitionId]=o.inputPort,e.ports.set(l,o.inputPort.value),o.emitResult&&x.push(o.emitResult)}let C={};for(let l of r.outputs.list)C[l.definitionId]={value:this.generatePortValue(t,e,l),code:{inner:c[l.definitionId]??""}};let a=f.codeGenerator({inputs:y,outputs:C,code:{next:m??""}}),n=this.getGeneratedNodeId(t,e,r);t.debug&&(a=this.mProject.generator.value.hook(`start-${n}`)+a+this.mProject.generator.value.hook(`end-${n}`));let u=new Array;for(let l of x)u.push(...l.codeOutput);return u.push(a),{codeOutput:u,lastGeneratedNode:r,endFlowPort:null}}findBranchStartPoint(t){let e=this.getNodesInputFlowPorts(t),r=e.length,c=new Map,m=new Array,f=(y,x)=>{let C=(c.has(y)||c.set(y,new Set),c.get(y)),a=C.size;for(let n of x)C.add(n);return C.size>a&&m.push(y),C};for(let[y,x]of e.entries())f(x.node,[y]);for(;m.length>0;){let y=m.shift(),x=c.get(y);for(let C of this.getNodesInputFlowPorts(y))if(f(C.node,x).size===r)return C.node}throw new _("No common branch point found for merge node.",this)}generateFunctionWithDependencies(t,e,r){let c=new Array;if(e.length===0)return c;let m=e.at(0).function;r.add(m);let f=new oo(m);c.push(f);for(let y of e){let x=this.generateNodeCode(t,y);f.addGraph(x);for(let C of x.dependencies)r.has(C)||c.push(...this.generateFunctionWithDependencies(t,C.getExitNodes(),r))}return c.reverse()}generateNodeCode(t,e){let r={dependencies:new Array,nodes:new Map,ports:new Map,scope:this.createScope(e,null)},c=this.walkBackward(t,r,e,null),m=c.codeOutput.join(" ");return new ro({bodyCode:m,dependencies:r.dependencies,entryNode:c.lastGeneratedNode,exitNode:e,nodeIds:new Map(r.nodes),portValues:new Map(r.ports)})}generatePortValue(t,e,r){if(!e.ports.has(r)){let c=this.mProject.generator.value.name(r.label),m=this.mProject.generator.value.id(c,t.counter.portIndex++);e.ports.set(r,m)}return e.ports.get(r)}getGeneratedNodeId(t,e,r){if(!e.nodes.has(r)){let m=(++t.counter.nodeIndex).toString(16).toUpperCase().padStart(8,"0");e.nodes.set(r,m)}return e.nodes.get(r)}getNodesInputFlowPorts(t){let e=new Array;for(let r of t.inputs.flow)e.push(...this.resolveFlowConjunctions(r));return[...new Set(e)]}handleFlowMerge(t,e,r,c,m){let f=m.join(" "),y=this.findBranchStartPoint(r),x={},C=e.scope;try{for(let a of c){e.scope=this.createScope(a.node,y);let n=this.walkBackward(t,e,a.node,y);x[n.endFlowPort.definitionId]=n.codeOutput.join(" ")}}finally{e.scope=C}return this.emitNode(t,e,y,x,f)}resolveFlowConjunctions(t){let e=new Array;for(let r of t.connectedPorts){if(r.node.definitionId!==Z.DEFINITION_ID){e.push(r);continue}let c=r.node.inputs.flow[0];!c||c.connectedPorts.size===0||e.push(...this.resolveFlowConjunctions(c))}return e}resolveInputValue(t,e,r){let c=this.resolveValueConjunctions(r);if(!c){if(this.mProject.types.isGenericType(r.dataType))throw new _("Generic value inputs must be allways connected",this);return{inputPort:{value:this.mProject.types.getType(r.dataType).convert([...r.directValue]),isDirectValue:!0},emitResult:null}}let m=c.node,f=!m.hasFlowPorts,y=(()=>{if(!m.hasFlowPorts){if(e.scope.emittedNodes.has(m))return null;let x=e.scope.remaining.get(m);if(f&&(x=0),e.scope.remaining.set(m,x),x<=0)return e.scope.emittedNodes.add(m),this.emitNode(t,e,m,{})}return null})();return{inputPort:{value:this.generatePortValue(t,e,c),isDirectValue:!1},emitResult:y}}resolveValueConjunctions(t){if(t.connectedPorts.size===0)return null;let e=t.connectedPorts.values().next().value;if(e.node.definitionId!==k.DEFINITION_ID)return e;let r=e.node.inputs.value[0];return!r||r.connectedPorts.size===0?null:this.resolveValueConjunctions(r)}walkBackward(t,e,r,c){let m={codeOutput:new Array,lastGeneratedNode:null,endFlowPort:null},f=null,y=r;for(;y!==null&&y!==c;){let x={};f!==null&&(x[f.definitionId]=m.codeOutput.join(" "),m.codeOutput=new Array);let C=m.codeOutput;m=this.emitNode(t,e,y,x),m.codeOutput=[...m.codeOutput,...C];let a=this.getNodesInputFlowPorts(y);if(a.length===0)break;a.length>1&&(m=this.handleFlowMerge(t,e,y,a,m.codeOutput),a=this.getNodesInputFlowPorts(m.lastGeneratedNode)),f=a[0]??null,y=f?.node??null}if(!m.lastGeneratedNode)throw new _(`Walk did not reach an entry node from exit "${r.label}".`,this);if(c&&y!==c)throw new _("Malformed graph. End node not reached",this);return m.endFlowPort=f,m}};var lt=class{static MAIN="MAIN";mBuild;mDefaultParameters;mFunction;mTypes;get defaultParameters(){return this.mDefaultParameters}get function(){return this.mFunction}get types(){return this.mTypes}constructor(t,e){this.mFunction=t,this.mDefaultParameters=e.defaultParameters,this.mTypes=new Set(e.types),this.mBuild=e.build}compile(t,e){return this.mBuild({defaultParameters:this.mDefaultParameters,function:this.mFunction,projectTypes:t.entryPoint.function.project.types},t,e)}};var is=`:host {\r
    /* Somehow this needs to be flex or we get an nasty overflow. */\r
    display: flex;\r
    flex-direction: column;\r
}\r
\r
.resize-box {\r
    --resize-box-handle-color: var(--potatno-color-border);\r
\r
    /* Set min sizes to restrict resizing. */\r
    min-height: 150px;\r
    min-width: 200px;\r
\r
    /* Globaly restrict to max size of parent. */\r
    max-width: 100%;\r
    max-height: 100%;\r
\r
    background-color: var(--potatno-color-background);\r
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
    background-color: var(--potatno-color-background);\r
    overflow: hidden;\r
\r
    /* Make wrapped element hide, by giving it a height and vertical gap */\r
    flex-wrap: wrap;\r
    gap: 10px;\r
    max-height: 38px;\r
\r
    /* Adjust border for resize box */\r
    padding: 2px 2px 0 2px;\r
\r
    /* Should never shrink */\r
    flex-shrink: 0;\r
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
            --tab-selected-color: var(--potatno-color-accent);\r
\r
            position: relative;\r
            margin: 3px;\r
            padding: 7px 15px 7px 15px;\r
            border-radius: 2px;\r
            overflow: hidden;\r
            cursor: pointer;\r
\r
            /* Only animate background color and skip bg-image. */\r
            transition: background-color 0.15s ease-in-out;\r
            background-color: transparent;\r
\r
            /* Before used for animating background images */\r
            &::before {\r
                content: "";\r
                position: absolute;\r
                background-image: radial-gradient(ellipse at top left, var(--potatno-color-accent) 0%, transparent 100%);\r
\r
                opacity: 0;\r
                transition: opacity 0.15s ease-in-out;\r
\r
                /* Stretch pseudo element to all sides of host element */\r
                top: 0;\r
                right: 0;\r
                bottom: 0;\r
                left: 0;\r
                z-index: 1;\r
            }\r
\r
            &:hover {\r
                &::before {\r
                    opacity: 0.5;\r
                }\r
            }\r
\r
            &:active {\r
                color: var(--potatno-color-text-contrast);\r
                scale: 0.98;\r
\r
                &::before {\r
                    opacity: 0.8;\r
                }\r
            }\r
\r
            &.selected {\r
                color: var(--potatno-color-text-contrast);\r
\r
                &::before {\r
                    opacity: 1;\r
                }\r
            }\r
\r
            &.tab--error {\r
                color: var(--potatno-color-text-contrast);\r
\r
                &::before {\r
                    background-image: radial-gradient(ellipse at top left, var(--potatno-color-error) 0%, transparent 100%);\r
                    opacity: 1;\r
                }\r
            }\r
\r
            .tab__text {\r
                position: relative;\r
                z-index: 2;\r
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
            background-color: var(--potatno-color-background-light);\r
            color: var(--potatno-color-text);\r
\r
            border: 1px solid var(--potatno-color-border);\r
            border-radius: 3px;\r
\r
            &:focus {\r
                border-color: var(--potatno-color-accent);\r
            }\r
        }\r
    }\r
}\r
\r
.content {\r
    flex: 1;\r
    padding: 4px;\r
    background-color: var(--potatno-color-background);\r
    overflow: auto;\r
\r
    scrollbar-color: var(--potatno-color-scrollbar-thumb) var(--potatno-color-scrollbar-track);\r
    scrollbar-width: thin;\r
\r
    .content__preview-code {\r
        box-sizing: border-box;\r
        width: calc(100% - 20px);\r
        margin: 0 10px;\r
        padding: 10px 0;\r
        color: var(--potatno-color-text);\r
        overflow: auto;\r
\r
        /* Reset inner elements padding and margin. */\r
        pre,\r
        code {\r
            padding: 0;\r
            margin: 0;\r
        }\r
    }\r
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
        color: var(--potatno-color-text);\r
        font-size: var(--potatno-font-size-small);\r
        margin-top: 2px;\r
\r
        .label {\r
            opacity: 0.5;\r
        }\r
\r
        .link {\r
            color: var(--potatno-color-text);\r
            opacity: 0.5;\r
            transition: opacity 0.15s ease-in-out;\r
            text-decoration: underline;\r
            cursor: pointer;\r
\r
            &:hover {\r
                opacity: 0.8;\r
            }\r
\r
            &:active {\r
                opacity: 1;\r
            }\r
        }\r
    }\r
}`;var ss=`<kg-resize-box class="resize-box" left="true" top="true">\r
    <div class="header">\r
        $if(this.errors.length > 0) {\r
            <div class="header__tabs">\r
                <div class="tab tab--error selected">\r
                    <div class="tab__text">Errors ({{this.errors.length}})</div>\r
                </div>\r
            </div>\r
        }\r
\r
        $if(this.errors.length === 0) {\r
            <div class="header__tabs">\r
                <div class="tab {{ this.selectedTab === 'preview' ? 'selected' : '' }}" (click)="this.selectedTab = 'preview'">\r
                    <div class="tab__text">Preview</div>\r
                </div>\r
                <div class="tab {{ this.selectedTab === 'code' ? 'selected' : '' }}" (click)="this.selectedTab = 'code'">\r
                    <div class="tab__text">Code</div>\r
                </div>\r
            </div>\r
            <div class="header__selectors">\r
\r
                $if(this.displayOptions.size > 0) {\r
                    <select class="preview-select" (change)="this.selectedDisplayId = $event.target.value">\r
                        $for(display of this.displayOptions) {\r
                            <option [value]="this.display[0]" [selected]="this.display[0] === this.selectedDisplayId">{{this.display[1]}}</option>\r
                        }\r
                    </select>\r
                }\r
\r
                $if(this.outputOptions.size > 0) {\r
                    <select class="preview-select" (change)="this.selectedOutputId = $event.target.value">\r
                        $for(output of this.outputOptions) {\r
                            <option [value]="this.output[0]" [selected]="this.output[0] === this.selectedOutputId">{{this.output[1].label}}</option>\r
                        }\r
                    </select>\r
                }\r
\r
            </div>\r
        }\r
    </div>\r
\r
    <div class="content">\r
        $if(this.errors.length > 0) {\r
            $for(error of this.errors) {\r
                <div class="error-item">\r
                    <div class="error-item__icon">!</div>\r
                    <div class="error-item__content">\r
                        <div class="error-item__message">{{this.error.message}}</div>\r
                        <div class="error-item__location">\r
                            <span class="label">Node: </span> \r
                            <span class="link" (click)="this.openNode(this.error.location)">{{this.error.location.label}}</span>\r
                        </div>\r
                    </div>\r
                </div>\r
            }\r
        }\r
\r
        $if(this.errors.length === 0) {\r
            $if(this.selectedTab === 'preview') {\r
                <div class="content__preview-display" potatno-preview="this.previewDriver"></div>\r
            }\r
\r
            $if(this.selectedTab === 'code') {\r
                <div class="content__preview-code">\r
                    <pre><code>{{ this.previewCode }}</code></pre>\r
                </div>\r
            }\r
        }\r
    </div>\r
    \r
</kg-resize-box>\r
`;function Ba(){function v(a,n){return function(l){e(n,"addInitializer"),r(l,"An initializer"),a.push(l)}}function t(a,n,u,l,o,b,g,D,w){var p;switch(o){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:g?"#"+n:n,static:b,private:g,metadata:D},d={v:!1};s.addInitializer=v(l,d);var i,h;o===0?g?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(T){this[n]=T}):o===2?i=function(){return u.value}:((o===1||o===3)&&(i=function(){return u.get.call(this)}),(o===1||o===4)&&(h=function(T){u.set.call(this,T)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return a(w,s)}finally{d.v=!0}}function e(a,n){if(a.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(a,n){if(typeof a!="function")throw new TypeError(n+" must be a function")}function c(a,n){var u=typeof n;if(a===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(u!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function m(a,n,u,l,o,b,g,D,w){var p=u[0],s,d,i;g?o===0||o===1?s={get:u[3],set:u[4]}:o===3?s={get:u[3]}:o===4?s={set:u[3]}:s={value:u[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var h,T,P;if(typeof p=="function")h=t(p,l,s,D,o,b,g,w,i),h!==void 0&&(c(o,h),o===0?d=h:o===1?(d=h.init,T=h.get||i.get,P=h.set||i.set,i={get:T,set:P}):i=h);else for(var M=p.length-1;M>=0;M--){var S=p[M];if(h=t(S,l,s,D,o,b,g,w,i),h!==void 0){c(o,h);var N;o===0?N=h:o===1?(N=h.init,T=h.get||i.get,P=h.set||i.set,i={get:T,set:P}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(o===0||o===1){if(d===void 0)d=function(I,E){return E};else if(typeof d!="function"){var F=d;d=function(I,E){for(var A=E,L=0;L<F.length;L++)A=F[L].call(I,A);return A}}else{var j=d;d=function(I,E){return j.call(I,E)}}a.push(d)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),g?o===1?(a.push(function(I,E){return i.get.call(I,E)}),a.push(function(I,E){return i.set.call(I,E)})):o===2?a.push(i):a.push(function(I,E){return i.call(I,E)}):Object.defineProperty(n,l,s))}function f(a,n,u){for(var l=[],o,b,g=new Map,D=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,T,P;if(h?(T=a,s=s-5,b=b||[],P=b):(T=a.prototype,o=o||[],P=o),s!==0&&!i){var M=h?D:g,S=M.get(d)||0;if(S===!0||S===3&&s!==4||S===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!S&&s>2?M.set(d,s):M.set(d,!0)}m(l,T,p,d,s,h,i,P,u)}}return y(l,o),y(l,b),l}function y(a,n){n&&a.push(function(u){for(var l=0;l<n.length;l++)n[l].call(u);return u})}function x(a,n,u){if(n.length>0){for(var l=[],o=a,b=a.name,g=n.length-1;g>=0;g--){var D={v:!1};try{var w=n[g](o,{kind:"class",name:b,addInitializer:v(l,D),metadata:u})}finally{D.v=!0}w!==void 0&&(c(10,w),o=w)}return[C(o,u),function(){for(var p=0;p<l.length;p++)l[p].call(o)}]}}function C(a,n){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,l,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(b===void 0?null:b),D=f(n,u,g);return l.length||C(n,g),{e:D,get c(){return x(n,l,g)}}}}function ps(v,t,e,r){return(ps=Ba())(v,t,e,r)}var fs,as,gs,vs,ys,bs,ls,cs,us,hs,ds,So;fs=X({selector:"potatno-preview",template:ss,style:is,modules:[Se],components:[Pt]}),gs=$.state(),vs=$.state(),ys=$.state(),bs=$.state();var ms=class{static{({e:[ls,cs,us,hs,ds],c:[So,as]}=ps(this,[[gs,1,"mSelectedDisplayId"],[vs,1,"mSelectedOutputId"],[ys,1,"selectedTab"],[bs,1,"previewCode"]],[fs]))}constructor(t=O.use(G),e=O.use(H)){this.mComponent=t,this.mManager=e,this.mSelectedDisplayId="",this.mSelectedOutputId="",this.selectedTab="preview",this.previewCode="";let r=R.NodeUpdate|R.NodeAdd|R.NodeDelete;this.mPreviewTargets=this.findFunctionPreviewTargets(),this.mUnsubscribeOutputFetch=this.mManager.subscribe(R.SpecialActiveFunction|r,()=>{this.mPreviewTargets=this.findFunctionPreviewTargets()}),this.mUnsubscribeErrorResolve=this.mManager.subscribe(R.SpecialActiveFunction|r|R.Connection,()=>{this.mComponent.updater.updateAsync()});let c=0;this.mManager.subscribe(R.Any,()=>{globalThis.clearTimeout(c),c=globalThis.setTimeout(()=>{this.previewCode=this.generateFunctionCode()},1e3)})}mComponent;mManager;mPreviewTargets;mUnsubscribeErrorResolve;mUnsubscribeOutputFetch;#t=(ds(this),ls(this));get mSelectedDisplayId(){return this.#t}set mSelectedDisplayId(t){this.#t=t}#e=cs(this);get mSelectedOutputId(){return this.#e}set mSelectedOutputId(t){this.#e=t}#o=us(this);get selectedTab(){return this.#o}set selectedTab(t){this.#o=t}#r=hs(this);get previewCode(){return this.#r}set previewCode(t){this.#r=t}get displayOptions(){let t=this.mPreviewTargets.get(this.selectedOutputId);return t?t.displays:new Map}get errors(){return this.mManager.integrity.errors}get outputOptions(){return this.mPreviewTargets}get previewDriver(){let t=this.mPreviewTargets.get(this.selectedOutputId);return t?this.mManager.preview.requestDriver(t.target,this.selectedDisplayId):null}get selectedDisplayId(){let t=this.displayOptions;if(!t.has(this.mSelectedDisplayId)){let e=t.keys().next().value;typeof e<"u"&&(this.mSelectedDisplayId=e)}return this.mSelectedDisplayId}set selectedDisplayId(t){this.mSelectedDisplayId=t}get selectedOutputId(){let t=this.outputOptions;if(!t.has(this.mSelectedOutputId)){let e=t.keys().next().value;typeof e<"u"&&(this.mSelectedOutputId=e)}return this.mSelectedOutputId}set selectedOutputId(t){this.mSelectedOutputId=t}onDeconstruct(){this.mUnsubscribeErrorResolve(),this.mUnsubscribeOutputFetch()}openNode(t){this.mManager.grid.selectNodes([t],!0)}findFunctionPreviewTargets(){let t=new Map,e=this.mManager.activeFunction,r=e.project.getFunction(e.definitionId);if(!r)return t;let c=y=>{let x=new Map;for(let C of y)x.set(C,e.project.preview.getDisplay(C).name);return x},m=e.project.preview.availableDisplays(r,lt.MAIN);m.length>0&&t.set(lt.MAIN,{label:lt.MAIN,target:e,displays:c(m)});let f=new Map;for(let y of e.getExitNodes())for(let x of y.inputs.value){let C=x.resolvedDataType;f.has(C)||f.set(C,x.project.preview.availableDisplays(r,C));let a=f.get(C);a.length!==0&&t.set(x.definitionId,{label:x.label,target:x,displays:c(a)})}return t}generateFunctionCode(){if(!this.mManager.integrity.isValid)return"";let t=this.mManager.activeFunction;return new le(t.project).generateFunction(t,!1).code}static{as()}};var ws=`:host {\r
    font-family: var(--potatno-font-family);\r
    font-size: var(--potatno-font-size);\r
}\r
\r
.editor {\r
    position: relative;\r
    display: flex;\r
    width: 100%;\r
    height: 100%;\r
\r
    .editor__center {\r
        position: relative;\r
        flex: 1;\r
        display: flex;\r
        flex-direction: column;\r
    }\r
\r
    .editor__preview {\r
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
    .editor__graph {\r
        flex: 1;\r
    }\r
}`;var xs=`<div class="editor">\r
    <potatno-function-list />\r
\r
    <div class="editor__center">\r
        <potatno-node-graph class="editor__graph" />\r
\r
        $if(this.hasPreview) {\r
            <potatno-preview class="editor__preview" />\r
        }\r
    </div>\r
\r
    <potatno-function-properties />\r
</div>`;function Ha(){function v(a,n){return function(l){e(n,"addInitializer"),r(l,"An initializer"),a.push(l)}}function t(a,n,u,l,o,b,g,D,w){var p;switch(o){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:g?"#"+n:n,static:b,private:g,metadata:D},d={v:!1};s.addInitializer=v(l,d);var i,h;o===0?g?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(T){this[n]=T}):o===2?i=function(){return u.value}:((o===1||o===3)&&(i=function(){return u.get.call(this)}),(o===1||o===4)&&(h=function(T){u.set.call(this,T)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return a(w,s)}finally{d.v=!0}}function e(a,n){if(a.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(a,n){if(typeof a!="function")throw new TypeError(n+" must be a function")}function c(a,n){var u=typeof n;if(a===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(u!=="function"){var l;throw a===0?l="field":a===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function m(a,n,u,l,o,b,g,D,w){var p=u[0],s,d,i;g?o===0||o===1?s={get:u[3],set:u[4]}:o===3?s={get:u[3]}:o===4?s={set:u[3]}:s={value:u[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var h,T,P;if(typeof p=="function")h=t(p,l,s,D,o,b,g,w,i),h!==void 0&&(c(o,h),o===0?d=h:o===1?(d=h.init,T=h.get||i.get,P=h.set||i.set,i={get:T,set:P}):i=h);else for(var M=p.length-1;M>=0;M--){var S=p[M];if(h=t(S,l,s,D,o,b,g,w,i),h!==void 0){c(o,h);var N;o===0?N=h:o===1?(N=h.init,T=h.get||i.get,P=h.set||i.set,i={get:T,set:P}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(o===0||o===1){if(d===void 0)d=function(I,E){return E};else if(typeof d!="function"){var F=d;d=function(I,E){for(var A=E,L=0;L<F.length;L++)A=F[L].call(I,A);return A}}else{var j=d;d=function(I,E){return j.call(I,E)}}a.push(d)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),g?o===1?(a.push(function(I,E){return i.get.call(I,E)}),a.push(function(I,E){return i.set.call(I,E)})):o===2?a.push(i):a.push(function(I,E){return i.call(I,E)}):Object.defineProperty(n,l,s))}function f(a,n,u){for(var l=[],o,b,g=new Map,D=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,T,P;if(h?(T=a,s=s-5,b=b||[],P=b):(T=a.prototype,o=o||[],P=o),s!==0&&!i){var M=h?D:g,S=M.get(d)||0;if(S===!0||S===3&&s!==4||S===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!S&&s>2?M.set(d,s):M.set(d,!0)}m(l,T,p,d,s,h,i,P,u)}}return y(l,o),y(l,b),l}function y(a,n){n&&a.push(function(u){for(var l=0;l<n.length;l++)n[l].call(u);return u})}function x(a,n,u){if(n.length>0){for(var l=[],o=a,b=a.name,g=n.length-1;g>=0;g--){var D={v:!1};try{var w=n[g](o,{kind:"class",name:b,addInitializer:v(l,D),metadata:u})}finally{D.v=!0}w!==void 0&&(c(10,w),o=w)}return[C(o,u),function(){for(var p=0;p<l.length;p++)l[p].call(o)}]}}function C(a,n){return Object.defineProperty(a,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,l,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var g=Object.create(b===void 0?null:b),D=f(n,u,g);return l.length||C(n,g),{e:D,get c(){return x(n,l,g)}}}}function Is(v,t,e,r){return(Is=Ha())(v,t,e,r)}var Cs,Ts,Ds,No;Cs=X({selector:"potatno-code-editor",template:xs,style:ws,components:[wo,to,Mo,So]});var Es=class{static{({e:[Ds],c:[No,Ts]}=Is(this,[[W,3,"document"],[W,2,"triggerPreviewUpdate"]],[Cs]))}constructor(t=O.use(G),e=O.use(H)){Ds(this),this.mComponent=t,this.mManager=e,this.mUnsubscribe=this.mManager.subscribe(R.Document|R.SpecialActiveFunction,()=>{this.mComponent.updater.updateAsync()})}mComponent;mManager;mUnsubscribe;get document(){return this.mManager.graph.document}set document(t){this.mManager.graph.setDocument(t)}get hasPreview(){let t=this.mManager.activeFunction,e=t.project.getFunction(t.definitionId);return e?t.project.preview.availableDisplays(e).length>0:!1}triggerPreviewUpdate(){return this.mManager.preview.execute()}onDeconstruct(){this.mUnsubscribe()}static{Ts()}};var no=class extends pe{mCodeEditor;mProject;get document(){return this.mCodeEditor.document}set document(t){this.mCodeEditor.document=t}get project(){return this.mProject}constructor(t){super(),this.mProject=t,this.addStyle(Ir),this.addStyle(Er),this.setInjection(H,new H(t)),this.mCodeEditor=this.addContent(No)}load(t){let e=JSON.parse(t);if(!Array.isArray(e.functions))throw new _("Could not load document. Document has a wrong format.",this);let r=new re(this.mProject).deserialize(e);this.document=r}save(){let t=new ne().serialize(this.document);return JSON.stringify(t)}update(){this.mCodeEditor.triggerPreviewUpdate()}};var V=class extends it{constructor(t){super({id:t.id,label:t.label,category:t.category,regions:t.regions??null,generators:{ports:{inputs:e=>{for(let r of t.ports.inputs)e(r)},outputs:e=>{for(let r of t.ports.outputs)e(r)}},code:t.generators.code}})}};var io=class{mDisplays;get displayIds(){return[...this.mDisplays.keys()]}constructor(){this.mDisplays=new Map}addDisplay(t){this.mDisplays.set(t.id,t)}availableDisplays(t,e=null){let r=new Array;for(let[c,m]of this.mDisplays)m.executor.function.id===t.id&&(e===null||m.allowsType(e))&&r.push(c);return r}getDisplay(t){return this.mDisplays.get(t)??null}};var so=class{mCodeGenerator;mEntryPoint;mImports;mNodeDefinitions;mPreview;mTypes;mUserFunctions;get entryPoint(){return this.mEntryPoint}get generator(){return this.mCodeGenerator}get imports(){return this.mImports}get nodeDefinitions(){return this.mNodeDefinitions}get preview(){return this.mPreview}get types(){return this.mTypes}get userFunctions(){return this.mUserFunctions}constructor(t,e,r){this.mTypes=t,this.mCodeGenerator=r.generator,this.mPreview=new io,this.mNodeDefinitions=new Map,this.mImports=new Array,this.mUserFunctions=new Map,this.mEntryPoint=e,this.addNodeDefinition(new Z),this.addNodeDefinition(new k),this.addNodeDefinition(new bt)}addImport(t){this.mImports.push(t)}addNodeDefinition(t){this.mNodeDefinitions.set(t.id,t)}getFunction(t){return this.mEntryPoint.id===t?this.mEntryPoint:this.mUserFunctions.get(t)}setDynamicFunction(t){this.mUserFunctions.set(t.id,t)}};var ao=class{mTypes;get typeNames(){return Array.from(this.mTypes.keys())}get types(){return this.mTypes}constructor(t){this.mTypes=new Map;for(let[e,r]of Object.entries(t))this.mTypes.set(e,{name:e,...r})}getDefaultValue(t){return this.getType(t).default.value}getType(t){if(!this.mTypes.has(t))throw new Error(`Type "${t}" is not defined in the project types definition.`);return this.mTypes.get(t)}isGenericType(t){return typeof t!="string"?!1:/^<[^>]+>$/.test(t)}};var lo=class extends ao{constructor(){super({number:{default:{string:["0"],value:0},convert:t=>{let e=t[0],r=parseFloat(e);if(isNaN(r))throw new Error(`Invalid number: "${e}"`);return r.toString()},inputs:[{name:"value",type:"number"}]},string:{default:{string:[""],value:""},convert:t=>t[0],inputs:[{name:"value",type:"string"}]},boolean:{default:{string:["false"],value:!1},convert:t=>{let e=t[0].toLowerCase();if(e==="true")return"true";if(e==="false")return"false";throw new Error(`Invalid boolean: "${t[0]}"`)},inputs:[{name:"value",type:"boolean"}]}})}};var co=class extends ae{constructor(){super({id:"pixelShader",label:"Pixel Shader",statics:Ft.inputs|Ft.outputs,nodes:{entry:t=>{t(new V({id:"OnPixel",label:"OnPixel",category:{name:"event"},ports:{inputs:[],outputs:[{label:"exec",id:"exec",portType:"flow"},{label:"x",id:"x",portType:"value",dataType:"number"},{label:"y",id:"y",portType:"value",dataType:"number"}]},generators:{code:e=>{let r=e.outputs.x.value,c=e.outputs.y.value;return`(${r}, ${c}) => { ${e.outputs.exec.code.inner} }`}}}))},exit:t=>{t(new V({id:"PixelResult",label:"PixelResult",category:{name:"Output"},ports:{inputs:[{label:"exec",id:"exec",portType:"flow"},{label:"red",id:"red",portType:"value",dataType:"number"},{label:"green",id:"green",portType:"value",dataType:"number"},{label:"blue",id:"blue",portType:"value",dataType:"number"}],outputs:[]},generators:{code:e=>`return [${e.inputs.red.value}, ${e.inputs.green.value}, ${e.inputs.blue.value}];`}}))}},generator:{code:{body:t=>{let e=t.graphResultOf("OnPixel");return`const ${t.function.definitionId} = ${e?.code??"() => [0, 0, 0]"};`},value:t=>`${t.function.definitionId}()`}}})}};var uo=class extends ae{constructor(){super({id:"Helper Function",label:"Helper Function",statics:Ft.none,nodes:{entry:(t,e)=>{t(new it({id:"HelperFunctionEntry",label:"Entry",category:{name:"event"},generators:{ports:{outputs:r=>{r({label:"exec",id:"exec",portType:"flow"});for(let c of e.inputs)r({label:c.label,id:c.label,portType:"value",dataType:c.dataType})},inputs:()=>{}},code:r=>`(${Object.entries(r.outputs).filter(([m])=>m!=="exec").map(([,m])=>m.value).join(", ")}) => { ${r.outputs.exec.code.inner} }`}}))},exit:(t,e)=>{t(new it({id:"HelperFunctionReturn",label:"Return",category:{name:"event"},generators:{ports:{outputs:()=>{},inputs:r=>{r({label:"exec",id:"exec",portType:"flow"});for(let c of e.outputs)r({label:c.label,id:c.label,portType:"value",dataType:c.dataType})}},code:r=>`return { ${Object.entries(r.inputs).map(([m,f])=>`${m}: (${f.value})`).join(", ")} };`}}))}},generator:{code:{body:t=>{let e=`__fn_${t.function.id.replaceAll("-","_")}`,r=t.graphResultOf("HelperFunctionEntry");return`const ${e} = ${r?.code??"() => ({})"};`},value:t=>{let e=`__fn_${t.function.id.replaceAll("-","_")}`,r=Object.entries(t.inputs).map(([,f])=>f.value).join(", "),c=Object.entries(t.outputs).map(([f,y])=>`${f}: ${y.value}`).join(", "),m=t.outputs.Output?.code.inner??"";return c===""?`${e}(${r}); ${m}`:`const { ${c} } = ${e}(${r}); ${m}`}}}})}};var ho=class extends so{mUserFunction;get userFunction(){return this.mUserFunction}constructor(){let t=new lo,e=new co,r=new uo;super(t,e,{generator:{code:c=>{let m="";for(let f of c.dependencies)m+=`${f.code}
`;return m+=c.entryPoint.code,m},value:{id:(c,m)=>`${c}_${m}`,name:c=>c.replaceAll(/[^A-Za-z0-9_]/g,""),hook:c=>`/*[${c}]*/`}}}),this.mUserFunction=r,this.setDynamicFunction(r),this.addBaseNodeDefinitions()}addBaseNodeDefinitions(){this.addNodeDefinition(new V({id:"Add",label:"Add",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} + ${t.inputs.b.value};`}})),this.addNodeDefinition(new V({id:"Subtract",label:"Subtract",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} - ${t.inputs.b.value};`}})),this.addNodeDefinition(new V({id:"Multiply",label:"Multiply",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} * ${t.inputs.b.value};`}})),this.addNodeDefinition(new V({id:"Divide",label:"Divide",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} / ${t.inputs.b.value};`}})),this.addNodeDefinition(new V({id:"Modulo",label:"Modulo",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} % ${t.inputs.b.value};`}})),this.addNodeDefinition(new V({id:"Equal",label:"Equal",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"boolean"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} === ${t.inputs.b.value};`}})),this.addNodeDefinition(new V({id:"Not Equal",label:"Not Equal",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"boolean"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} !== ${t.inputs.b.value};`}})),this.addNodeDefinition(new V({id:"Less Than",label:"Less Than",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"boolean"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} < ${t.inputs.b.value};`}})),this.addNodeDefinition(new V({id:"Greater Than",label:"Greater Than",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"boolean"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} > ${t.inputs.b.value};`}})),this.addNodeDefinition(new V({id:"And",label:"And",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"boolean"},{label:"b",id:"b",portType:"value",dataType:"boolean"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"boolean"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} && ${t.inputs.b.value};`}})),this.addNodeDefinition(new V({id:"Or",label:"Or",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"boolean"},{label:"b",id:"b",portType:"value",dataType:"boolean"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"boolean"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} || ${t.inputs.b.value};`}})),this.addNodeDefinition(new V({id:"Not",label:"Not",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"boolean"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"boolean"}]},generators:{code:t=>`const ${t.outputs.result.value} = !${t.inputs.a.value};`}})),this.addNodeDefinition(new V({id:"Number to String",label:"Number to String",category:{name:"type-conversion"},ports:{inputs:[{label:"input",id:"input",portType:"value",dataType:"number"}],outputs:[{label:"output",id:"output",portType:"value",dataType:"string"}]},generators:{code:t=>`const ${t.outputs.output.value} = String(${t.inputs.input.value});`}})),this.addNodeDefinition(new V({id:"String to Number",label:"String to Number",category:{name:"type-conversion"},ports:{inputs:[{label:"input",id:"input",portType:"value",dataType:"string"}],outputs:[{label:"output",id:"output",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.output.value} = Number(${t.inputs.input.value});`}})),this.addNodeDefinition(new V({id:"Boolean to String",label:"Boolean to String",category:{name:"type-conversion"},ports:{inputs:[{label:"input",id:"input",portType:"value",dataType:"boolean"}],outputs:[{label:"output",id:"output",portType:"value",dataType:"string"}]},generators:{code:t=>`const ${t.outputs.output.value} = String(${t.inputs.input.value});`}})),this.addNodeDefinition(new V({id:"If",label:"If",category:{name:"flow"},ports:{inputs:[{label:"exec",id:"exec",portType:"flow"},{label:"condition",id:"condition",portType:"value",dataType:"boolean"}],outputs:[{label:"then",id:"then",portType:"flow"},{label:"else",id:"else",portType:"flow"}]},generators:{code:t=>`if (${t.inputs.condition.value}) {
${t.outputs.then.code.inner}
} else {
${t.outputs.else.code.inner}
}`}})),this.addNodeDefinition(new V({id:"While",label:"While",category:{name:"flow"},ports:{inputs:[{label:"exec",id:"exec",portType:"flow"},{label:"condition",id:"condition",portType:"value",dataType:"boolean"}],outputs:[{label:"body",id:"body",portType:"flow"}]},generators:{code:t=>`while (${t.inputs.condition.value}) {
${t.outputs.body.code.inner}
}`}})),this.addNodeDefinition(new V({id:"For Loop",label:"For Loop",category:{name:"flow"},ports:{inputs:[{label:"exec",id:"exec",portType:"flow"},{label:"count",id:"count",portType:"value",dataType:"number"}],outputs:[{label:"exec",id:"exec",portType:"flow"},{label:"index",id:"index",portType:"value",dataType:"number"}]},generators:{code:t=>`for (let ${t.outputs.index.value} = 0; ${t.outputs.index.value} < ${t.inputs.count.value}; ${t.outputs.index.value}++) {
${t.outputs.exec.code.inner}
}`}})),this.addNodeDefinition(new V({id:"Console Log",label:"Console Log",category:{name:"Function"},ports:{inputs:[{label:"message",id:"message",portType:"value",dataType:"string"}],outputs:[]},generators:{code:t=>`console.log(${t.inputs.message.value});`}})),this.addNodeDefinition(new V({id:"String Concat",label:"String Concat",category:{name:"Function"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"string"},{label:"b",id:"b",portType:"value",dataType:"string"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"string"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} + ${t.inputs.b.value};`}}))}};var ce=class{mId;mLabel;mNodes;get id(){return this.mId}get label(){return this.mLabel}get nodes(){return this.mNodes}constructor(t,e){this.mId=t,this.mLabel=e,this.mNodes=new Array}addNode(t){this.mNodes.push(t)}};var mo=class extends ce{constructor(){super("Math","Math"),this.addNode(new V({id:"Math.PI",label:"Math.PI",category:{name:"value"},ports:{inputs:[],outputs:[{label:"value",id:"value",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.value.value} = Math.PI;`}})),this.addNode(new V({id:"Math.E",label:"Math.E",category:{name:"value"},ports:{inputs:[],outputs:[{label:"value",id:"value",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.value.value} = Math.E;`}})),this.addNode(new V({id:"Math.abs",label:"Math.abs",category:{name:"Function"},ports:{inputs:[{label:"value",id:"value",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = Math.abs(${t.inputs.value.value});`}})),this.addNode(new V({id:"Math.floor",label:"Math.floor",category:{name:"Function"},ports:{inputs:[{label:"value",id:"value",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = Math.floor(${t.inputs.value.value});`}})),this.addNode(new V({id:"Math.ceil",label:"Math.ceil",category:{name:"Function"},ports:{inputs:[{label:"value",id:"value",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = Math.ceil(${t.inputs.value.value});`}})),this.addNode(new V({id:"Math.random",label:"Math.random",category:{name:"Function"},ports:{inputs:[],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = Math.random();`}})),this.addNode(new V({id:"Math.sin",label:"Math.sin",category:{name:"Function"},ports:{inputs:[{label:"value",id:"value",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = Math.sin(${t.inputs.value.value});`}})),this.addNode(new V({id:"Math.cos",label:"Math.cos",category:{name:"Function"},ports:{inputs:[{label:"value",id:"value",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = Math.cos(${t.inputs.value.value});`}})),this.addNode(new V({id:"Math.min",label:"Math.min",category:{name:"Function"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = Math.min(${t.inputs.a.value}, ${t.inputs.b.value});`}})),this.addNode(new V({id:"Math.max",label:"Math.max",category:{name:"Function"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = Math.max(${t.inputs.a.value}, ${t.inputs.b.value});`}})),this.addNode(new V({id:"Math.clamp",label:"Math.clamp",category:{name:"Function"},ports:{inputs:[{label:"value",id:"value",portType:"value",dataType:"number"},{label:"min",id:"min",portType:"value",dataType:"number"},{label:"max",id:"max",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = Math.min(Math.max(${t.inputs.value.value}, ${t.inputs.min.value}), ${t.inputs.max.value});`}}))}};var po=class extends ce{constructor(){super("Time","Time"),this.addNode(new V({id:"CurrentTime",label:"CurrentTime",category:{name:"value"},ports:{inputs:[],outputs:[{label:"seconds",id:"seconds",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.seconds.value} = (performance.now() / 1000);`}}))}};var fo=class{mCachedCallable;mDisplay;mElement;mSpecifiedParameters;mTarget;get display(){return this.mDisplay}get element(){return this.mElement||(this.mElement=this.mDisplay.generate()),this.mElement}constructor(t,e){this.mDisplay=t,this.mTarget=e,this.mCachedCallable=null,this.mElement=null,this.mSpecifiedParameters={...this.mDisplay.executor.defaultParameters}}execute(){this.mCachedCallable&&this.mDisplay.update(this.element,this.mCachedCallable)}refresh(){let t=this.mTarget instanceof dt?this.mTarget.node.function:this.mTarget,e=(()=>{try{return new le(t.project).generateFunction(t,!0)}catch{return null}})();if(!e){this.mCachedCallable=null;return}let r=null;if(this.mTarget instanceof dt&&(r=this.resolvePortTarget(e,this.mTarget),!r)){this.mCachedCallable=null;return}let c=this.mDisplay.executor.compile(e,r);if(!this.mDisplay.allowsType(c.type)){this.mCachedCallable=null;return}let m=this.mDisplay.adapterFor(c.type);this.mCachedCallable=f=>m(c.execute({...this.mDisplay.executor.defaultParameters,...this.mSpecifiedParameters,...f}))}specifyParameters(t){this.mSpecifiedParameters={...this.mSpecifiedParameters,...t}}resolvePortTarget(t,e){let[r,c]=(()=>{for(let f of t.entryPoint.graphs)if(f.ports.has(e)&&f.nodes.has(e.node))return[f.ports.get(e),f.nodes.get(e.node)];return[null,null]})();if(!r||!c)return null;let m=e.direction==="input"?"start":"end";return{documentPort:e,nodeHook:e.project.generator.value.hook(`${m}-${c}`),value:r}}};var ue=class{mExecutor;mGenerate;mId;mName;mTypeAdapters;mUpdate;get executor(){return this.mExecutor}get id(){return`${this.mId}-${this.mExecutor.function.id}`}get name(){return this.mName}constructor(t,e){this.mId=e.id,this.mName=e.name,this.mExecutor=t,this.mGenerate=e.generate,this.mUpdate=e.update,this.mTypeAdapters=new Map;for(let[r,c]of Object.entries(e.typeAdapter))this.mExecutor.types.has(r)&&this.mTypeAdapters.set(r,c)}adapterFor(t){let e=t;if(!this.mTypeAdapters.has(e))throw new _(`Display "${this.mId}" has no type adapter for type "${t}".`,this);return this.mTypeAdapters.get(e)}allowsType(t){return this.mTypeAdapters.has(t)}createDriver(t){return new fo(this,t)}generate(){return this.mGenerate()}update(t,e){return this.mUpdate(t,e)}};var Ne=class v extends ue{static MATRIX_SIZE=3;static VALUE_LENGTH=5;constructor(t){super(t,{id:"matrix",name:"Matrix 3x3",generate:()=>{let e=document.createElement("div");return e.style.boxSizing="border-box",e.style.display="grid",e.style.gap="2px",e.style.gridTemplateColumns=`repeat(${v.MATRIX_SIZE}, minmax(0, 1fr))`,e.style.height="100%",e.style.width="100%",e.style.fontFamily="var(--potatno-font-family)",e.style.fontSize="var(--potatno-font-size-small)",e.style.color="#fff",e},typeAdapter:{[lt.MAIN]:e=>e.map(r=>this.formatPreviewValue(r)),number:e=>[this.formatPreviewValue(e)],string:e=>[this.formatPreviewValue(e)],boolean:e=>[this.formatPreviewValue(e)]},update:async(e,r)=>{await this.updateMatrixPreview(e,r)}})}formatPreviewValue(t){if(typeof t=="number"){if(!Number.isFinite(t))return t.toString().slice(0,v.VALUE_LENGTH);let e=Math.trunc(Math.abs(t)).toString().length,r=Math.max(0,v.VALUE_LENGTH-e-(t<0?1:0)-1);return t.toFixed(r).slice(0,v.VALUE_LENGTH)}return String(t).slice(0,v.VALUE_LENGTH)}async updateMatrixPreview(t,e){for(;t.children.length<v.MATRIX_SIZE*v.MATRIX_SIZE;){let r=document.createElement("div");r.style.alignItems="center",r.style.background="var(--potatno-color-background-dark)",r.style.border="1px solid var(--potatno-color-border)",r.style.boxSizing="border-box",r.style.color="var(--potatno-color-text)",r.style.display="flex",r.style.justifyContent="center",r.style.minWidth="0",r.style.overflow="hidden",r.style.padding="2px",r.style.textOverflow="clip",r.style.whiteSpace="pre-line",t.append(r)}for(let r=0;r<v.MATRIX_SIZE;r++)for(let c=0;c<v.MATRIX_SIZE;c++){let m=r*v.MATRIX_SIZE+c,f=v.MATRIX_SIZE===1?0:c/(v.MATRIX_SIZE-1),y=v.MATRIX_SIZE===1?0:r/(v.MATRIX_SIZE-1),x=e({x:f,y});t.children[m].textContent=x.join(`
`)}}};var _e=class v extends ue{static PREVIEW_PIXEL_SIZE=7.5;mCanvasContext;mCanvasImageData;constructor(t){super(t,{id:"2dCanvas",name:"Canvas 2D",generate:()=>{let e=document.createElement("canvas");return e.style.width="100%",e.style.height="100%",e.style.imageRendering="pixelated",e},typeAdapter:{[lt.MAIN]:e=>e,number:e=>[e,e,e],boolean:e=>{let r=e?1:0;return[r,r,r]}},update:async(e,r)=>{await this.updateCanvasPreview(e,r)}}),this.mCanvasImageData=new WeakMap,this.mCanvasContext=new WeakMap}async updateCanvasPreview(t,e){this.mCanvasContext.has(t)||this.mCanvasContext.set(t,t.getContext("2d"));let r=this.mCanvasContext.get(t),c=Math.max(1,Math.round(t.clientWidth/v.PREVIEW_PIXEL_SIZE)),m=Math.max(1,Math.round(t.clientHeight/v.PREVIEW_PIXEL_SIZE));(t.width!==c||t.height!==m||!this.mCanvasImageData.has(t))&&(t.width=c,t.height=m,this.mCanvasImageData.set(t,r.createImageData(c,m)));let f=this.mCanvasImageData.get(t),y=f.data;for(let x=0;x<m;x++)for(let C=0;C<c;C++){let a=C/c,n=x/m,u=e({x:a,y:n}),l=(x*c+C)*4;y[l]=Math.floor(Math.max(0,Math.min(1,u[0]||0))*255),y[l+1]=Math.floor(Math.max(0,Math.min(1,u[1]||0))*255),y[l+2]=Math.floor(Math.max(0,Math.min(1,u[2]||0))*255),y[l+3]=255}r.putImageData(f,0,0)}};(()=>{let v=new WebSocket("ws://127.0.0.1:8088");v.addEventListener("open",()=>{console.log("Refresh connection established")}),v.addEventListener("message",t=>{console.log("Bundle finished. Start refresh"),t.data==="REFRESH"&&window.location.reload()})})();var Mt=new ho;Mt.addImport(new mo);Mt.addImport(new po);var Ps=new lt(Mt.entryPoint,{defaultParameters:{x:0,y:0},types:[lt.MAIN,"number","string","boolean"],build:(v,t,e)=>{let r=t.code,c=v.function.id;if(!e){let y=new Function(`${r}
return ${c};`)();return{type:lt.MAIN,execute:x=>y(x.x,x.y)}}let m=r.replace(e.nodeHook,`; return ${e.value};`),f=new Function(`${m}
return ${c};`)();return{type:e.documentPort.resolvedDataType,execute:y=>f(y.x,y.y)}}}),Ms=new lt(Mt.userFunction,{defaultParameters:{x:0,y:0},types:["number","string","boolean"],build:(v,t,e)=>{if(!e)return{type:"number",execute:()=>0};let r=t.entryPoint.function,c=`__fn_${r.id.replaceAll("-","_")}`,m=r.inputs.map(x=>v.projectTypes.getDefaultValue(x.dataType)),f=t.code.replace(e.nodeHook,`return ${e.value};`),y=new Function(`${f}
return ${c};`)();return{type:e.documentPort.resolvedDataType,execute:()=>y(...m)}}});Mt.preview.addDisplay(new _e(Ps));Mt.preview.addDisplay(new _e(Ms));Mt.preview.addDisplay(new Ne(Ps));Mt.preview.addDisplay(new Ne(Ms));var Ya=document.getElementById("application-root"),Ae=new no(Mt);Ae.appendTo(Ya);Ae.document=new jt(Mt);Ss();function Ss(){try{Ae.update()}catch(v){}requestAnimationFrame(Ss)}document.getElementById("load-button").addEventListener("click",Wa);document.getElementById("save-button").addEventListener("click",Za);var Ns="potatno-code-document.json";async function Wa(){if(window.confirm("Load saved document?"))try{let r=await(await(await navigator.storage.getDirectory()).getFileHandle(Ns)).getFile();Ae.load(await r.text())}catch{window.alert("Could not load document.")}}async function Za(){if(window.confirm("Override saved document?"))try{let r=await(await(await navigator.storage.getDirectory()).getFileHandle(Ns,{create:!0})).createWritable();await r.write(Ae.save()),await r.close()}catch{window.alert("Could not save document.")}}})();
//# sourceMappingURL=page.js.map
