(()=>{var Yt=class v extends Array{static newListWith(...t){let e=new v;return e.push(...t),e}clear(){this.splice(0,this.length)}clone(){return v.newListWith(...this)}distinct(){return v.newListWith(...new Set(this))}equals(t){if(this===t)return!0;if(!t||this.length!==t.length)return!1;for(let e=0;e<this.length;++e)if(this[e]!==t[e])return!1;return!0}remove(t){let e=this.indexOf(t);if(e!==-1)return this.splice(e,1)[0]}replace(t,e){let r=this.indexOf(t);if(r!==-1){let u=this[r];return this[r]=e,u}}toString(){return`[${super.join(", ")}]`}};var N=class extends Error{mTarget;get target(){return this.mTarget}constructor(t,e,r){super(t,r),this.mTarget=e}};var rt=class v extends Map{add(t,e){if(!this.has(t))this.set(t,e);else throw new N("Can't add duplicate key to dictionary.",this)}clone(){return new v(this)}getAllKeysOfValue(t){return[...this.entries()].filter(u=>u[1]===t).map(u=>u[0])}getOrDefault(t,e){let r=this.get(t);return typeof r<"u"?r:e}map(t){let e=new Yt;for(let r of this){let u=t(r[0],r[1]);e.push(u)}return e}};var zt=class v{mSize;mTopItem;get size(){return this.mSize}get top(){if(this.mTopItem)return this.mTopItem.value}constructor(){this.mTopItem=null,this.mSize=0}clone(){let t=new v;return t.mTopItem=this.mTopItem,t.mSize=this.mSize,t}*entries(){let t=this.mTopItem;for(;t!==null;)yield t.value,t=t.previous}flush(){let t=new Array;for(;this.mTopItem;)t.push(this.pop());return t}pop(){if(!this.mTopItem)return;let t=this.mTopItem.value;return this.mTopItem=this.mTopItem.previous,this.mSize--,t}push(t){let e={previous:this.mTopItem,value:t};this.mTopItem=e,this.mSize++}toArray(){return[...this.entries()]}};var fe=class{mCompareFunction;constructor(t){this.mCompareFunction=t}differencesOf(t,e){let r;if(t.length===0||e.length===0){if(r=new Array,t.length===0)for(let S=0;S<e.length;S++)r.push({changeState:_t.Insert,item:e[S]});else for(let S=0;S<t.length;S++)r.push({changeState:_t.Remove,item:t[S]});return r}let u={1:{x:0,history:[]}},d=S=>S-1,y=t.length,w=e.length,D;for(let S=0;S<y+w+1;S++)for(let l=-S;l<S+1;l+=2){let n=l===-S||l!==S&&u[l-1].x<u[l+1].x;if(n){let c=u[l+1];D=c.x,r=c.history}else{let c=u[l-1];D=c.x+1,r=c.history}r=r.slice();let h=D-l;for(1<=h&&h<=w&&n?r.push({changeState:_t.Insert,item:e[d(h)]}):1<=D&&D<=y&&r.push({changeState:_t.Remove,item:t[d(D)]});D<y&&h<w&&this.mCompareFunction(t[d(D+1)],e[d(h+1)]);)D+=1,h+=1,r.push({changeState:_t.Keep,item:t[d(D)]});if(D>=y&&h>=w)return r;u[l]={x:D,history:r}}return new Array}},_t=function(v){return v[v.Remove=1]="Remove",v[v.Insert=2]="Insert",v[v.Keep=3]="Keep",v}({});var de=class{mNodeCache;constructor(){this.mNodeCache=new Map}start(t,e){let r=this.readFromCache(t),u=this.readFromCache(e),d=new vo;d.set(r,0);let y=new Map;y.set(r,0);let w=new Map,D=new Array;for(;d.length!==0;){let S=d.popLowest();if(D.push(S),S===u)return{path:[...this.pathTracer(S,w)].reverse(),processedNodes:D};for(let l of this.getNeighborNodes(S)){let n=(y.get(S)??Number.POSITIVE_INFINITY)+this.costOfTraversal(l,{startNode:r,endNode:u,path:this.pathTracer(S,w)}),h=y.get(l)??Number.POSITIVE_INFINITY;if(n>=h)continue;w.set(l,S),y.set(l,n);let c=n+this.heuristic(l,{startNode:r,endNode:u,path:this.pathTracer(S,w)});d.set(l,c)}}return{path:new Array,processedNodes:D}}getNeighborNodes(t){return this.neighborNodes(t).map(e=>this.readFromCache(e))}*pathTracer(t,e){let r=t;for(;yield r,!!e.has(r);)r=e.get(r)}readFromCache(t){let e=this.nodeId(t);return this.mNodeCache.has(e)?this.mNodeCache.get(e):(this.mNodeCache.set(e,t),t)}},vo=class{mExistingNodes;mList;mLowestCost;mLowestCostCounter;get length(){return this.mList.length}constructor(){this.mList=new Array,this.mExistingNodes=new Map,this.mLowestCost=Number.POSITIVE_INFINITY,this.mLowestCostCounter=0}popLowest(){if(this.mList.length===0)throw new N("Can not read next node from an empty priority list.",this);let[t,e]=(()=>{let y=null,w=0;for(let D=this.mList.length-1;D>-1;D--){let S=this.mList[D];if(S.cost===this.mLowestCost)return[S,0];(y===null||S.cost<y.cost)&&(y=S,w=0),S.cost===y.cost&&w++}if(y===null)throw new N("Lowest could not be found. Data is corrupted.",this);return[y,w]})();t.cost<this.mLowestCost&&(this.mLowestCost=t.cost,this.mLowestCostCounter=e),t.cost===this.mLowestCost&&this.mLowestCostCounter--,this.mLowestCostCounter<1&&(this.mLowestCost=Number.POSITIVE_INFINITY,this.mLowestCostCounter=0);let r=this.mExistingNodes.get(t.node),u=this.mList.length-1,d=this.mList[u];return this.mList[u]=t,this.mList[r]=d,this.mExistingNodes.set(d.node,r),this.mExistingNodes.delete(t.node),this.mList.pop().node}set(t,e){if(this.mLowestCostCounter>0&&e<this.mLowestCost&&(this.mLowestCost=e,this.mLowestCostCounter=0),e===this.mLowestCost&&this.mLowestCostCounter++,this.mExistingNodes.has(t)){let r=this.mExistingNodes.get(t),u=this.mList[r];if(u.cost===e){e===this.mLowestCost&&this.mLowestCostCounter--;return}u.cost=e;return}this.mList.push({cost:e,node:t}),this.mExistingNodes.set(t,this.mList.length-1)}};var me=class{mDataType;mId;mLabel;mPortType;mRegions;get dataType(){return this.mDataType}get id(){return this.mId}get label(){return this.mLabel}get portType(){return this.mPortType}get regions(){return this.mRegions}constructor(t){this.mLabel=t.label,this.mId=t.id,this.mPortType=t.portType,t.portType==="value"?this.mDataType=t.dataType:this.mDataType=null,this.mRegions={add:t.regions?.add??new Array}}};var st=class{mCategory;mCodeGenerator;mId;mLabel;mPortProvider;mRegions;get category(){return this.mCategory}get codeGenerator(){return this.mCodeGenerator}get id(){return this.mId}get inputs(){let t=!1,e=[];return this.mPortProvider.inputs(r=>{if(e.push(new me(r)),r.portType==="flow"){if(t)throw new N(`Node definition ${this.id} has multiple input flow ports, which is not allowed.`,this);t=!0}}),e}get label(){return this.mLabel}get outputs(){let t=[];return this.mPortProvider.outputs(e=>{t.push(new me(e))}),t}get regions(){return this.mRegions}constructor(t){this.mId=t.id,this.mLabel=t.label,this.mCategory={name:t.category.name,icon:t.category.icon??"\u25C6"},this.mCodeGenerator=t.generators.code,this.mPortProvider=t.generators.ports,this.mRegions={add:t.regions?.add??new Array,allows:t.regions?.allows??new Array,requires:t.regions?.requires??new Array}}getPort(t){return[...this.inputs,...this.outputs].find(e=>e.id===t)}};var wt=class extends st{mFunction;get function(){return this.mFunction}get label(){return this.mFunction.label}constructor(t){let e=(u,d,y)=>w=>{y.length===0&&w({label:u,id:u,portType:"flow"});for(let D of d)w({label:D.label,id:D.label,portType:"value",dataType:D.dataType})},r=t.project.getFunction(t.definitionId);super({id:`USERFUNCTION_${t.id}`,label:t.label,category:{name:"user function",icon:"\u0192"},generators:{ports:{inputs:e("Input",t.inputs,t.outputs),outputs:e("Output",t.outputs,t.outputs)},code:u=>r?r.codeGenerator.value({function:t,inputs:u.inputs,outputs:u.outputs,code:u.code}):""}}),this.mFunction=t}};var xt=class v extends st{static DEFINITION_ID="8124c652-3a8e-4333-b405-f905522a4610";constructor(){super({id:v.DEFINITION_ID,label:"Comment",category:{name:"Comment",icon:"\u270E"},generators:{ports:{inputs:()=>{},outputs:()=>{}},code:()=>{throw new N("Comment node code generators should never be called.",v)}}})}};var K=class v extends st{static DEFINITION_ID="23e9319b-3b62-4dd8-858a-17d97ddee94e";constructor(){super({id:v.DEFINITION_ID,label:"Flow Conjunction",category:{name:"Conjunction",icon:"\u25C7"},generators:{ports:{inputs:t=>{t({label:"in",id:"in",portType:"flow"})},outputs:t=>{t({label:"out",id:"out",portType:"flow"})}},code:()=>{throw new N("Conjunction node code generators should never be called.",v)}}})}};var et=class v extends st{static DEFINITION_ID="a579584d-5d35-42b5-b2ba-3daddee488e0";constructor(){super({id:v.DEFINITION_ID,label:"Value Conjunction",category:{name:"Conjunction",icon:"\u25C7"},generators:{ports:{inputs:t=>{t({label:"in",id:"in",portType:"value",dataType:"<T>"})},outputs:t=>{t({label:"out",id:"out",portType:"value",dataType:"<T>"})}},code:()=>{throw new N("Conjunction node code generators should never be called.",v)}}})}};var Tt=class{mAffectedItems;mErrors;get affectedItems(){return this.mAffectedItems}get errors(){return this.mErrors}constructor(){this.mErrors=new Array,this.mAffectedItems=new Set}addAffectedItem(t){this.mAffectedItems.add(t)}merge(t){this.mErrors.push(...t.mErrors);for(let e of t.mAffectedItems)this.mAffectedItems.add(e);return this}pushError(...t){this.mErrors.push(...t)}},Z=class{mItem;mMessage;get item(){return this.mItem}get message(){return this.mMessage}constructor(t,e){this.mMessage=t,this.mItem=e}};var nt=class{mConnectedPorts;mDataType;mDefinitionId;mDirectValue;mDirection;mDocument;mLabel;mNode;mPortType;mProject;get connectedPorts(){return this.mConnectedPorts}get dataType(){return this.mDataType}get definitionId(){return this.mDefinitionId}get directValue(){return this.mDirectValue}get direction(){return this.mDirection}get document(){return this.mDocument}get label(){return this.mLabel}set label(t){this.mLabel=t}get node(){return this.mNode}get portType(){return this.mPortType}get project(){return this.mProject}get resolvedDataType(){return this.resolveDataType(new Set)}constructor(t,e,r){if(r.portType==="flow"&&r.dataType!==null)throw new N("Flow ports cannot have a value type.",this);if(r.portType==="value"&&r.dataType===null)throw new N("Value ports must have a value type.",this);this.mProject=t,this.mDocument=e,this.mNode=r.node,this.mDefinitionId=r.definitionId,this.mLabel=r.label,this.mDataType=r.dataType,this.mDirection=r.direction,this.mPortType=r.portType,this.mConnectedPorts=new Set,this.mDirectValue=new Array,r.dataType&&!this.mProject.types.isGenericType(r.dataType)&&this.mDirectValue.push(...t.types.getType(r.dataType).default.string)}connect(t){if(this.mConnectedPorts.has(t))return;if(this.mPortType!==t.portType)throw new N(`Cannot connect port ${this.mDefinitionId} of node ${this.mNode.label} to port ${t.mDefinitionId} of node ${t.node.label} due to incompatible port types.`,this);if(this.mDirection===t.direction)throw new N(`Cannot connect port ${this.mDefinitionId} of node ${this.mNode.label} to port ${t.mDefinitionId} of node ${t.node.label} due to incompatible directions.`,this);if(this.node===t.node)throw new N(`Cannot connect port ${this.mDefinitionId} of node ${this.mNode.label} to another port of the same node.`,this);if(!(this.mPortType==="flow"&&this.mDirection==="input"||this.mPortType==="value"&&this.mDirection==="output"))for(let r of Array.from(this.mConnectedPorts))this.disconnect(r);this.mConnectedPorts.add(t),t.connect(this)}disconnect(t){this.mConnectedPorts.has(t)&&(this.mConnectedPorts.delete(t),t.disconnect(this))}setDirectValue(t){if(this.mPortType!=="value")throw new N("Only value ports can have a direct value.",this);if(this.mProject.types.isGenericType(this.mDataType))throw new N("Generic value ports cannot have a direct value.",this);if(t.length!==this.mProject.types.getType(this.mDataType).default.string.length)throw new N("The provided value does not match the expected length of the default value for this port's type.",this);this.mDirectValue.splice(0,this.mDirectValue.length),this.mDirectValue.push(...t)}validate(){let t=new Tt;if(this.mDirection==="output"){if(this.mPortType==="flow"&&this.mConnectedPorts.size>1&&t.pushError(new Z(`Flow output port "${this.mDefinitionId}" on node "${this.mNode.label}" can only have one connection.`,this)),this.mPortType==="value"&&this.mProject.types.isGenericType(this.mDataType??"")){let e=this.mNode.inputs.value.filter(r=>r.dataType===this.mDataType);for(let r of e)r.connectedPorts.size===0&&t.pushError(new Z(`Generic output port "${this.mDefinitionId}" on node "${this.mNode.label}" cannot resolve generic type "${this.mDataType}" because its input port "${r.definitionId}" is not connected.`,this))}return t}if(this.mDirection==="input"){if(this.mPortType==="flow")return this.mConnectedPorts.size===0&&t.pushError(new Z(`Flow input port "${this.mDefinitionId}" on node "${this.mNode.label}" must have at least one connection.`,this)),t;if(this.mPortType==="value"){this.mConnectedPorts.size>1&&t.pushError(new Z(`Value input port "${this.mDefinitionId}" on node "${this.mNode.label}" can only have one connection.`,this));for(let e of this.mConnectedPorts)e.resolvedDataType!==this.resolvedDataType&&t.pushError(new Z(`Value input port "${this.mDefinitionId}" on node "${this.mNode.label}" expects type "${this.resolvedDataType}" but is connected to type "${e.resolvedDataType}".`,this));return t}}return t}resolveDataType(t){if(t.has(this.node))return this.mDataType;if(this.mDirection==="input"&&t.add(this.node),this.mPortType!=="value")throw new N("Port data type couldn't be resolved as it is no value port.",this);if(!this.mProject.types.isGenericType(this.mDataType??""))return this.mDataType;if(this.mDirection==="output"){let r=this.mNode.inputs.value.find(u=>u.dataType===this.mDataType);if(!r)throw new N("Port type couldn't be resolved as it has no resolving sibling port",this);return r.resolveDataType(t)}return this.mConnectedPorts.size===0?this.mDataType:this.mConnectedPorts.values().next().value.resolveDataType(t)}};var mt=class{mDefinitionId;mDocument;mFunction;mInputs;mLabel;mOutputs;mPreview;mProject;mTransformation;get definitionId(){return this.mDefinitionId}get document(){return this.mDocument}get function(){return this.mFunction}get hasFlowPorts(){return this.mOutputs.flow.length>0||this.mInputs.flow.length>0}get hasValuePorts(){return this.mOutputs.value.length>0||this.mInputs.value.length>0}get inputs(){return this.mInputs}get label(){return this.mLabel}set label(t){this.mLabel=t}get outputs(){return this.mOutputs}get preview(){return this.mPreview}set preview(t){this.mPreview=t}get project(){return this.mProject}get transformation(){return this.mTransformation}constructor(t,e,r,u){this.mDocument=e,this.mDefinitionId=u.definitionId,this.mFunction=r,this.mLabel=u.label,this.mPreview=u.preview??null,this.mProject=t,this.mTransformation={x:0,y:0,width:0,height:0};let d=(y,w)=>{let D={direction:w,list:new Array,map:new Map,flow:new Array,value:new Array};for(let S of y){let l=new nt(this.mProject,this.mDocument,{definitionId:S.definitionId,direction:w,label:S.label,node:this,portType:S.portType,dataType:S.dataType});D.list.push(l),D.map.set(l.definitionId,l),(l.portType==="flow"?D.flow:D.value).push(l)}return D};this.mInputs=d(u.ports.input,"input"),this.mOutputs=d(u.ports.output,"output"),this.resizeTo(u.transformation.width,u.transformation.height),this.moveTo(u.transformation.x,u.transformation.y)}moveTo(t,e){this.mTransformation.x=Math.round(t),this.mTransformation.y=Math.round(e)}resizeTo(t,e){let r=this.mFunction.nodeDefinitions.find(y=>y.id===this.mDefinitionId),[u,d]=(()=>{switch(r?.id){case xt.DEFINITION_ID:return[Math.max(6,t),Math.max(6,e)];case et.DEFINITION_ID:case K.DEFINITION_ID:return[1,1];default:return[6,Math.max(this.mInputs.list.length,this.mOutputs.list.length)+1]}})();this.mTransformation.width=u,this.mTransformation.height=d}validate(t){let e=new Tt,r=t??new Set,u=this.mFunction.nodeDefinitions.find(d=>d.id===this.mDefinitionId);if(!u)e.pushError(new Z(`Node "${this.mLabel}" definition "${this.mDefinitionId}" could not be found.`,this));else{e.merge(this.resyncPorts(this.mInputs,u.inputs)),e.merge(this.resyncPorts(this.mOutputs,u.outputs));let d=new Set([...u.regions.requires,...u.regions.allows]);if(d.size>0)for(let y of r)d.has(y)||e.pushError(new Z(`Node "${this.mLabel}" does not allow region "${y}".`,this));if(u.regions.requires.length>0)for(let y of u.regions.requires)r.has(y)||e.pushError(new Z(`Node "${this.mLabel}" requires region "${y}" but it is not active.`,this))}for(let d of[...this.mInputs.list,...this.mOutputs.list])e.merge(d.validate());return this.resizeTo(this.transformation.width,this.transformation.height),e}addPort(t,e,r){let u=new nt(this.mProject,this.mDocument,{definitionId:e.id,direction:t.direction,label:e.label,node:this,portType:e.portType,dataType:e.dataType});return t.list.splice(r,0,u),t.map.set(u.definitionId,u),(u.portType==="flow"?t.flow:t.value).push(u),u}removePort(t,e){let r=t.list.indexOf(e);if(r===-1)throw new N(`Port "${e.label}" was not found and can not be removed.`,this);t.list.splice(r,1),t.map.delete(e.definitionId);let u=e.portType==="flow"?t.flow:t.value,d=u.indexOf(e);if(r===-1)throw new N(`Port "${e.label}" was not found in typed list and can not be removed.`,this);return u.splice(d,1),r}replacePort(t,e,r){let u=Array.from(e.connectedPorts);for(let w of Array.from(e.connectedPorts))e.disconnect(w);let d=this.removePort(t,e),y=this.addPort(t,r,d);for(let w of u)y.connect(w);return y}resyncPorts(t,e){let r=new Tt,u=new Set(e.map(d=>d.id));for(let d=0;d<e.length;d++){let y=e[d];if(!t.map.has(y.id)){let n=this.addPort(t,y,d);r.addAffectedItem(n);continue}let w=t.map.get(y.id),D=w.portType!==y.portType,S=w.dataType!==y.dataType;if(!D&&!S)continue;if(w.connectedPorts.size>0&&D){r.pushError(new Z(`Port "${w.label}" on node "${this.mLabel}" has a changed type.`,w));continue}let l=this.replacePort(t,w,y);r.addAffectedItem(w),r.addAffectedItem(l)}for(let d of t.list)if(!u.has(d.definitionId)){if(d.connectedPorts.size===0){r.addAffectedItem(d),this.removePort(t,d);continue}r.pushError(new Z(`Port "${d.label}" on node "${this.mLabel}" no longer exists in its definition.`,d))}return r}};var at=class{mDefinitionId;mDocument;mId;mImportIds;mInputs;mIsSystem;mLabel;mNodes;mOutputs;mProject;get definitionId(){return this.mDefinitionId}get document(){return this.mDocument}get dynamicNodeDefinitions(){let t=this.mDocument.nodeDefinitions.filter(d=>!(d instanceof wt&&d.function===this)),e=this.mProject.getFunction(this.definitionId);if(!e)return t;let r=e.getNodeDefinitions(this),u=this.mProject.imports.filter(d=>this.mImportIds.has(d.id)).flatMap(d=>d.nodes);return[...t,...u,...r.dynamic]}get id(){return this.mId}get imports(){return this.mImportIds}get inputs(){return this.mInputs}get isSystem(){return this.mIsSystem}get label(){return this.mLabel}set label(t){this.mLabel=t}get nodeDefinitions(){let t=this.mProject.getFunction(this.definitionId);if(!t)return this.dynamicNodeDefinitions;let e=t.getNodeDefinitions(this);return[...this.dynamicNodeDefinitions,...e.entry,...e.exit]}get nodes(){return this.mNodes}get outputs(){return this.mOutputs}get project(){return this.mProject}constructor(t,e,r){this.mProject=t,this.mDocument=e,this.mLabel=r.label,this.mIsSystem=r.isSystem,this.mDefinitionId=r.definitionId,this.mId=r.id,this.mNodes=new Set,this.mInputs=new Array,this.mOutputs=new Array,this.mImportIds=new Set}addImport(t){if(!this.project.imports.some(r=>r.id===t))throw new N(`Project does not contain import ${t}`,this);this.mImportIds.add(t)}addInput(t){this.mInputs.some(e=>e.label===t.label)||this.mInputs.push(t)}addNode(t){this.mNodes.add(t)}addNodeByDefinition(t,e){let r=d=>({definitionId:d.id,label:d.label,portType:d.portType,dataType:d.dataType}),u=new mt(this.mProject,this.mDocument,this,{definitionId:t.id,ports:{input:t.inputs.map(r),output:t.outputs.map(r)},label:t.label,transformation:e});return this.mNodes.add(u),u}addOutput(t){this.mOutputs.some(e=>e.label===t.label)||this.mOutputs.push(t)}getExitNodes(){let t=this.mProject.getFunction(this.mDefinitionId);if(!t)throw new N(`Function definition not found for function "${this.mLabel}".`,this);let e=new Set(t.getNodeDefinitions(this).exit.map(r=>r.id));return[...this.mNodes].filter(r=>e.has(r.definitionId))}removeImport(t){this.mImportIds.delete(t)}removeInput(t){let e=this.mInputs.findIndex(r=>r.label===t.label);e!==-1&&this.mInputs.splice(e,1)}removeNode(t){for(let e of[...t.inputs.list,...t.outputs.list])for(let r of Array.from(e.connectedPorts))e.disconnect(r);this.mNodes.delete(t)}removeOutput(t){let e=this.mOutputs.findIndex(r=>r.label===t.label);e!==-1&&this.mOutputs.splice(e,1)}validate(){let t=new Tt,e=this.mProject.getFunction(this.mDefinitionId);e||t.pushError(new Z(`Function "${this.mLabel}" definition "${this.mDefinitionId}" could not be found.`,this));let r=e?.getNodeDefinitions(this);r&&this.resyncFunction(r,t);let u=this.collectRegions(this.mNodes,t),d=new Set(r?.entry.map(w=>w.id)??new Array),y=new Map;for(let w of this.mNodes)t.merge(w.validate(u.get(w))),this.collectEntryDomains(w,d,y).size>1&&t.pushError(new Z(`Node "${w.label}" is reachable from multiple entry nodes.`,w));return t}collectEntryDomains(t,e,r){if(r.has(t))return r.get(t);let u=new Set;r.set(t,u);for(let d of t.inputs.list)for(let y of d.connectedPorts){let w=y.node;e.has(w.definitionId)&&u.add(w);for(let D of this.collectEntryDomains(w,e,r))u.add(D)}return u}collectRegions(t,e){let r=new Map;for(let w of this.nodeDefinitions)r.set(w.id,w);let u=(()=>{let w=new Map;return(D,S)=>{if(!w.has(D.id)){let l=new Map;for(let n of D.outputs)l.set(n.id,n.regions.add);w.set(D.id,l)}return[...w.get(D.id).get(S)??new Array,...D.regions.add]}})(),d=(()=>{let w=new Map;return(D,S)=>{if(w.has(D))return w.get(D);if(S.has(D))return e.pushError(new Z(`Node "${D.label}" is part of a connection cycle.`,D)),new Set;S.add(D);let l=new Set;for(let n of D.inputs.list)for(let h of n.connectedPorts){let c=h.node;for(let o of d(c,S))l.add(o);if(r.has(c.definitionId))for(let o of u(r.get(c.definitionId),h.definitionId))l.add(o)}return w.set(D,l),l}})(),y=new Map;for(let w of t)y.set(w,d(w,new Set));return y}resyncFunction(t,e){let r=[...t.entry,...t.exit],u=new Set(this.mNodes.values().map(w=>w.definitionId)),d=0,y=20;for(let w of r){if(u.has(w.id))continue;let D=this.addNodeByDefinition(w,{x:Math.floor(d/(r.length/2))*y+2,y:d*y+2-Math.floor(d/(r.length/2))*(r.length/2*y),width:0,height:0});e.addAffectedItem(D),d++}}};var jt=class{mFunctionNodeDefinitions;mFunctions;mProject;get functions(){return this.mFunctions}get nodeDefinitions(){return[...this.mFunctionNodeDefinitions.values(),...this.mProject.nodeDefinitions.values()]}get project(){return this.mProject}constructor(t){this.mProject=t,this.mFunctions=new Array,this.mFunctionNodeDefinitions=new Map}addFunction(t){let e=this.mFunctions.indexOf(t);e!==-1&&this.mFunctions.splice(e,1),this.mFunctions.push(t);let r=new wt(t);return this.mFunctionNodeDefinitions.set(r.id,r),t}newFunction(t){return this.addFunction(new at(this.mProject,this,t))}removeFunction(t){if(t.isSystem)throw new N("Cannot remove a system function.",this);let e=this.mFunctions.indexOf(t);if(e===-1)return!1;this.mFunctions.splice(e,1);for(let r of this.mFunctionNodeDefinitions.values())r.function===t&&this.mFunctionNodeDefinitions.delete(r.id);return!0}validate(){let t=new Tt,e=this.mProject.entryPoint.id;if(!this.mFunctions.values().some(u=>u.definitionId===e)){let u=this.newFunction({definitionId:e,id:crypto.randomUUID(),isSystem:!0,label:this.mProject.entryPoint.label});t.addAffectedItem(u)}for(let u of this.mFunctions)t.merge(u.validate());t.pushError(...this.detectCrossFunctionRecursion());let r=new Set;for(let u of this.mFunctions){let d=this.mProject.generator.value.name(u.label);r.has(d)&&t.pushError(new Z(`Function name "${d}" is used by multiple functions. Function names must be unique.`,u)),r.add(d)}return t}detectCrossFunctionRecursion(){let t=[],e=new Map,r=w=>{if(!e.has(w)){let D=new Set;for(let S of w.nodes)this.mFunctionNodeDefinitions.has(S.definitionId)&&D.add(this.mFunctionNodeDefinitions.get(S.definitionId).function);e.set(w,D)}return e.get(w)},u=new Set,d=new Set,y=w=>{if(!u.has(w)){if(d.has(w)){t.push(new Z(`Function "${w.label}" participates in a cross-function recursion cycle.`,w));return}d.add(w);for(let D of r(w))y(D);d.delete(w),u.add(w)}};for(let w of this.mFunctions)y(w);return t}};var Vt=class{mData;mInteractionType;mOrigin;get data(){return this.mData}get origin(){return this.mOrigin}get triggerType(){return this.mInteractionType}constructor(t,e,r){this.mInteractionType=t,this.mData=r,this.mOrigin=e}};var Dt=class v{static mCurrentZone=new v("Default");static get current(){return v.mCurrentZone}static create(t){return new v(t,v.current)}mAttachments;mInteractionListener;mName;mParent;mTriggerFilterBitmap;get name(){return this.mName}get parent(){return this.mParent}constructor(t,e=null){this.mName=t,this.mParent=e,this.mTriggerFilterBitmap=-1,this.mInteractionListener=new Map,this.mAttachments=new WeakMap}addInteractionListener(t){return this.mInteractionListener.set(t,v.current),this}execute(t,...e){let r=v.mCurrentZone;v.mCurrentZone=this;try{return t(...e)}finally{v.mCurrentZone=r}}getAttachment(t){return this.mAttachments.has(t)?this.mAttachments.get(t):this.mParent!==null?this.mParent.getAttachment(t):null}pushInteraction(t,e){if((this.mTriggerFilterBitmap&t)===0)return!1;if(this.mInteractionListener.size===0)return!0;let r=new Vt(t,this,e);for(let[u,d]of this.mInteractionListener.entries())d.execute(()=>{u.call(this,r)});return!0}removeInteractionListener(t){return t?(this.mInteractionListener.delete(t),this):(this.mInteractionListener.clear(),this)}setAttachment(t,e){this.mAttachments.set(t,e)}setTriggerRestriction(t){return this.mTriggerFilterBitmap=t,this}};var Q=class v{static mComponents=new WeakMap;static mConstructorSelector=new WeakMap;static mElements=new WeakMap;static elementIsComponent(t){return v.mComponents.has(t)}static ofComponent(t){let e=t.processorConstructor,r=v.mConstructorSelector.get(e);if(!r)throw new N(`Constructor "${e.name}" is not a registered custom element`,e);let u=v.mElements.get(t);if(!u)throw new N(`Component "${t}" is not a registered component`,t);return{selector:r,constructor:e,element:u,component:t,processor:t.processor}}static ofConstructor(t){let e=v.mConstructorSelector.get(t);if(!e)throw new N(`Constructor "${t.name}" is not a registered custom element`,t);let r=globalThis.customElements.get(e);if(!r)throw new N(`Constructor "${t.name}" is not a registered custom element`,t);return{selector:e,constructor:t,elementConstructor:r}}static ofElement(t){let e=v.mComponents.get(t);if(!e)throw new N(`Element "${t}" is not a PwbComponent.`,t);return v.ofComponent(e)}static ofProcessor(t){let e=v.mComponents.get(t);if(!e)throw new N("Processor is not a PwbComponent.",t);return v.ofComponent(e)}static registerComponent(t,e,r){v.mComponents.has(e)||v.mComponents.set(e,t),r&&!v.mComponents.has(r)&&v.mComponents.set(r,t),v.mElements.has(t)||v.mElements.set(t,e)}static registerConstructor(t,e){t&&!v.mConstructorSelector.has(t)&&v.mConstructorSelector.set(t,e)}};var Ct=class{static ATTACHMENT_KEY=Symbol("ComponentZoneConfiguration");mFrameTime;mInjection;get guaranteedFrameTime(){return this.mFrameTime}set guaranteedFrameTime(t){this.mFrameTime=t}get injections(){return this.mInjection}constructor(){this.mInjection=new Map,this.mFrameTime=Number.MAX_SAFE_INTEGER}setInjection(t,e){this.mInjection.set(t,e)}};var Kt=class extends Error{mZone;get zone(){return this.mZone}constructor(t,e){let r=t instanceof Error?t.message:"Non-error value thrown";super(`Update error in zone "${e.name}": ${r}`,{cause:t}),this.mZone=e}};var pe=class v{static new(t,e){let r=new v;t(r),e&&r.appendTo(e)}mComponentZoneConfiguration;mContent;mCurrentTarget;mErrorListener;mFragment;mInteractionZone;constructor(){this.mContent=new Array,this.mFragment=document.createDocumentFragment(),this.mCurrentTarget=null,this.mErrorListener=new Array,this.mInteractionZone=Dt.create("PwbApplication"),this.mComponentZoneConfiguration=new Ct,this.mInteractionZone.setAttachment(Ct.ATTACHMENT_KEY,this.mComponentZoneConfiguration),globalThis.addEventListener("error",t=>{this.handleZoneError(t,t.error)}),globalThis.addEventListener("unhandledrejection",t=>{this.handleZoneError(t,t.reason)})}addContent(t){let e=Q.ofConstructor(t).elementConstructor,r=this.mInteractionZone.execute(()=>Q.ofElement(new e));return this.mContent.push(r.component),this.mFragment.appendChild(r.element),this.updateTarget(),r.processor}addErrorListener(t){this.mErrorListener.includes(t)&&this.removeErrorListener(t),this.mErrorListener.push(t)}addStyle(t){let e=document.createElement("style");e.textContent=t,this.mFragment.prepend(e)}appendTo(t){this.mCurrentTarget=t,this.updateTarget()}removeErrorListener(t){let e=this.mErrorListener.indexOf(t);e!==-1&&this.mErrorListener.splice(e,1)}setInjection(t,e){this.mComponentZoneConfiguration.setInjection(t,e)}handleZoneError(t,e){if(!(e instanceof Kt)||!this.zoneBelongsToApplication(e.zone))return;t.preventDefault();let r=!1;for(let u of this.mErrorListener)u(e.cause)===!0&&(r=!0);r||console.error(e.cause)}updateTarget(){this.mCurrentTarget&&(this.mCurrentTarget.shadowRoot||this.mCurrentTarget.attachShadow({mode:"open"}),this.mCurrentTarget.shadowRoot.appendChild(this.mFragment))}zoneBelongsToApplication(t){let e=t;for(;e!==null;){if(e===this.mInteractionZone)return!0;e=e.parent}return!1}};var Qt=class{mCustomMetadata;constructor(){this.mCustomMetadata=new Map}getMetadata(t){return this.mCustomMetadata.get(t)??null}setMetadata(t,e){this.mCustomMetadata.set(t,e)}};var ge=class extends Qt{};var ve=class v extends Qt{static mPrivateMetadataKey=Symbol("Metadata");mDecoratorMetadataObject;mPropertyMetadata;constructor(t){super(),this.mDecoratorMetadataObject=t,this.mPropertyMetadata=new Map,t[v.mPrivateMetadataKey]=this}getInheritedMetadata(t){let e=new Array,r=this.mDecoratorMetadataObject;do{if(Object.hasOwn(r,v.mPrivateMetadataKey)){let d=r[v.mPrivateMetadataKey].getMetadata(t);d!==null&&e.push(d)}r=Object.getPrototypeOf(r)}while(r!==null);return e.reverse()}getProperty(t){return this.mPropertyMetadata.has(t)||this.mPropertyMetadata.set(t,new ge),this.mPropertyMetadata.get(t)}};Symbol.metadata??=Symbol("Symbol.metadata");var lt=class v{static mMetadataMapping=new Map;static add(t,e){return(r,u)=>{let d=v.forInternalDecorator(u.metadata);switch(u.kind){case"class":d.setMetadata(t,e);return;case"method":case"field":case"getter":case"setter":case"accessor":if(u.static)throw new Error("@Metadata.add not supported for statics.");d.getProperty(u.name).setMetadata(t,e);return}}}static forInternalDecorator(t){return v.mapMetadata(t)}static get(t){Object.hasOwn(t,Symbol.metadata)||v.polyfillMissingMetadata(t);let e=t[Symbol.metadata];return v.mapMetadata(e)}static init(){return(t,e)=>{v.forInternalDecorator(e.metadata)}}static mapMetadata(t){if(v.mMetadataMapping.has(t))return v.mMetadataMapping.get(t);let e=new ve(t);return v.mMetadataMapping.set(t,e),e}static polyfillMissingMetadata(t){let e=new Array,r=t;do e.push(r),r=Object.getPrototypeOf(r);while(r!==null);for(let u=e.length-1;u>=0;u--){let d=e[u];if(!Object.hasOwn(d,Symbol.metadata)){let y=null;u<e.length-2&&(y=e[u+1][Symbol.metadata]),d[Symbol.metadata]=Object.create(y,{})}}}};var O=class v{static mCurrentInjectionContext=null;static mInjectMode=new Map;static mInjectableConstructor=new Map;static mInjectableReplacement=new Map;static mInjectionConstructorIdentificationMetadataKey=Symbol("InjectionConstructorIdentification");static mSingletonMapping=new Map;static createObject(t,e,r){let[u,d]=typeof e=="object"&&e!==null?[!1,e]:[!!e,r??new Map],y=v.getInjectionIdentification(t);if(!v.mInjectableConstructor.has(y))throw new N(`Constructor "${t.name}" is not registered for injection and can not be built`,v);let w=u?"instanced":v.mInjectMode.get(y),D=new Map(d.entries().map(([n,h])=>[v.getInjectionIdentification(n),h])),S=v.mCurrentInjectionContext,l=new Map([...S?.localInjections.entries()??[],...D.entries()]);v.mCurrentInjectionContext={injectionMode:w,localInjections:l};try{if(!u&&w==="singleton"&&v.mSingletonMapping.has(y))return v.mSingletonMapping.get(y);let n=new t;return w==="singleton"&&!v.mSingletonMapping.has(y)&&v.mSingletonMapping.set(y,n),n}finally{v.mCurrentInjectionContext=S}}static injectable(t="instanced"){return(e,r)=>{v.registerInjectable(e,r.metadata,t)}}static registerInjectable(t,e,r){let u=v.getInjectionIdentification(t,e);v.mInjectableConstructor.set(u,t),v.mInjectMode.set(u,r)}static replaceInjectable(t,e){let r=v.getInjectionIdentification(t);if(!v.mInjectableConstructor.has(r))throw new N("Original constructor is not registered.",v);let u=v.getInjectionIdentification(e);if(!v.mInjectableConstructor.has(u))throw new N("Replacement constructor is not registered.",v);v.mInjectableReplacement.set(r,e)}static use(t){if(v.mCurrentInjectionContext===null)throw new N("Can't create object outside of an injection context.",v);let e=v.getInjectionIdentification(t);if(v.mCurrentInjectionContext.injectionMode!=="singleton"&&v.mCurrentInjectionContext.localInjections.has(e))return v.mCurrentInjectionContext.localInjections.get(e);let r=v.mInjectableReplacement.get(e);if(r||(r=v.mInjectableConstructor.get(e)),!r)throw new N(`Constructor "${t.name}" is not registered for injection and can not be built`,v);return v.createObject(r)}static getInjectionIdentification(t,e){let r=e?lt.forInternalDecorator(e):lt.get(t),u=r.getMetadata(v.mInjectionConstructorIdentificationMetadataKey);return u||(u=Symbol(t.name),r.setMetadata(v.mInjectionConstructorIdentificationMetadataKey,u)),u}};var q=function(v){return v[v.Read=1]="Read",v[v.ReadWrite=2]="ReadWrite",v[v.Write=3]="Write",v}({});var Nt=class{mHooks;mInjections;mProcessor;mProcessorConstructor;get processor(){if(!this.mProcessor)throw new N("Processor is not created yet. Call setup to create processor.",this);return this.mProcessor}get processorConstructor(){return this.mProcessorConstructor}constructor(t){if(this.mProcessorConstructor=t.constructor,this.mProcessor=null,this.mInjections=new Map,this.mHooks={create:new Array},t.parent)for(let[e,r]of t.parent.mInjections.entries())this.setProcessorInjection(e,r)}deconstruct(){}getProcessorInjection(t){return this.mInjections.get(t)}setProcessorInjection(t,e){if(this.mProcessor)throw new N("Cant add injections to after construction.",this);this.mInjections.set(t,e)}setup(){return this.mProcessor=this.createProcessor(),this}addConstructionHook(t){return this.mHooks.create.push(t),this}call(t,...e){let r=Reflect.get(this.processor,t);return typeof r!="function"?null:r.apply(this.processor,e)}createProcessor(){let t=O.createObject(this.mProcessorConstructor,this.mInjections),e;for(;e=this.mHooks.create.pop();){let r=e.call(this,t);r&&(t=r)}return t}};var $t=class v extends Nt{constructor(t,e){super({constructor:t,parent:e}),this.setProcessorInjection(v,this)}deconstruct(){this.call("onDeconstruct"),super.deconstruct()}setup(){return super.setup(),this.call("onExecute"),this}onUpdate(){return!1}};var yo=class v{static mInstance;mCoreEntityConstructor;mProcessorConstructorConfiguration;constructor(){if(v.mInstance)return v.mInstance;v.mInstance=this,this.mCoreEntityConstructor=new Map,this.mProcessorConstructorConfiguration=new Map}get(t){let e=this.mCoreEntityConstructor.get(t);if(!e)return new Array;let r=new Array;for(let u of e)r.push({processorConstructor:u,processorConfiguration:this.mProcessorConstructorConfiguration.get(u)});return r}register(t,e,r){this.mProcessorConstructorConfiguration.set(e,r);let u=t;do{if(!(u.prototype instanceof Nt)&&u!==Nt)break;this.mCoreEntityConstructor.has(u)||this.mCoreEntityConstructor.set(u,new Set),this.mCoreEntityConstructor.get(u).add(e)}while(u=Object.getPrototypeOf(u))}},ht=new yo;var kt=class v extends Nt{static mExtensionCache=new WeakMap;mExtensionList;constructor(t){super(t),this.mExtensionList=new Array}deconstruct(){for(let t of this.mExtensionList)t.deconstruct();super.deconstruct()}setup(){return super.setup(),this.executeExtensions(),this}executeExtensions(){let t=(()=>{if(!v.mExtensionCache.has(this.processorConstructor)){let u=ht.get($t).filter(y=>{for(let w of y.processorConfiguration.targetRestrictions)if(this instanceof w||this.processorConstructor.prototype instanceof w||this.processorConstructor===w)return!0;return!1}),d={read:u.filter(y=>y.processorConfiguration.access===q.Read),write:u.filter(y=>y.processorConfiguration.access===q.Write),readWrite:u.filter(y=>y.processorConfiguration.access===q.ReadWrite)};v.mExtensionCache.set(this.processorConstructor,d)}return v.mExtensionCache.get(this.processorConstructor)})(),e=[...t.write,...t.readWrite,...t.read];for(let r of e)this.mExtensionList.push(new $t(r.processorConstructor,this).setup())}};var U={get:1,set:2,manual:4};var Re=class v{static ORIGINAL_TO_INTERACTION_MAPPING=new WeakMap;static PROXY_TO_ORIGINAL_MAPPING=new WeakMap;static UNTRACEABLE_FUNCTION_UPDATE_TRIGGER=(()=>{let t=new WeakMap;return t.set(Array.prototype.fill,U.set),t.set(Array.prototype.pop,U.get),t.set(Array.prototype.push,U.set),t.set(Array.prototype.shift,U.get),t.set(Array.prototype.unshift,U.set),t.set(Array.prototype.splice,U.set),t.set(Array.prototype.reverse,U.set),t.set(Array.prototype.sort,U.set),t.set(Array.prototype.concat,U.set),t.set(Map.prototype.clear,U.set),t.set(Map.prototype.delete,U.set),t.set(Map.prototype.set,U.set),t.set(Set.prototype.clear,U.set),t.set(Set.prototype.delete,U.set),t.set(Set.prototype.add,U.set),t})();static getOriginal(t){return v.PROXY_TO_ORIGINAL_MAPPING.get(t)??t}static getWrapper(t){let e=v.getOriginal(t);return v.ORIGINAL_TO_INTERACTION_MAPPING.get(e)}mProxyObject;mStateChangeCallback;get proxy(){return this.mProxyObject}constructor(t,e){let r=v.getWrapper(t);if(r)return r;this.mProxyObject=this.createProxyObject(t),this.mStateChangeCallback=e,v.PROXY_TO_ORIGINAL_MAPPING.set(this.mProxyObject,t),v.ORIGINAL_TO_INTERACTION_MAPPING.set(t,this)}convertToProxy(t){return t===null||typeof t!="object"&&typeof t!="function"?t:new v(t,this.mStateChangeCallback).proxy}createProxyObject(t){let e=(u,d,y)=>{let w=v.getOriginal(d);try{let D=u.call(w,...y);return this.convertToProxy(D)}finally{if(v.UNTRACEABLE_FUNCTION_UPDATE_TRIGGER.has(u)){let D=v.getWrapper(d);D&&D.dispatch(v.UNTRACEABLE_FUNCTION_UPDATE_TRIGGER.get(u))}}};return new Proxy(t,{apply:(u,d,y)=>{let w=u;try{let D=w.call(d,...y);return this.convertToProxy(D)}catch(D){if(!(D instanceof TypeError))throw D;return e(w,d,y)}},set:(u,d,y)=>{try{let w=y;return(w!==null&&typeof w=="object"||typeof w=="function")&&(w=v.getOriginal(w)),Reflect.set(u,d,w)}finally{this.dispatch(U.set)}},get:(u,d,y)=>{try{return this.convertToProxy(Reflect.get(u,d))}finally{this.dispatch(U.get)}},deleteProperty:(u,d)=>{try{return delete u[d]}finally{this.dispatch(U.set)}}})}dispatch(t){this.mStateChangeCallback(t)}};var $=class v{static reaction(t){let e=Dt.create("ComponentState reaction");e.addInteractionListener(r=>{(r.triggerType&U.set)!==0&&t()}),e.execute(()=>{t()})}static state(t){return(e,r)=>{if(r.static)throw new N("Event target is not for a static property.",v);let u=new WeakMap,d=(y,w)=>{u.set(y,new v(w,t))};return{init(y){return typeof y>"u"||d(this,y),y},set(y){u.has(this)?u.get(this).set(y):d(this,y)},get(){return u.has(this)||d(this,void 0),u.get(this).get()}}}}mConfiguration;mLinkedZones;mLinkedZonesArray;mValue;constructor(t,e){if(this.mLinkedZones=new Set,this.mLinkedZonesArray=new Array,this.mConfiguration={complexValue:e?.complexValue??!1,proxy:e?.proxy??!1},this.mConfiguration.proxy){if(typeof t!="object"||t===null)throw new N("Proxied component state value must be an object.",this);this.mValue=new Re(t,r=>{switch(r){case U.set:return this.dispatchChange();case U.get:return this.linkCurrentZone()}}).proxy}else this.mValue=t}get(){return this.linkCurrentZone(),this.mValue}set(t){if(this.mConfiguration.proxy)throw new N("Proxy is not implemented yet.",this);!this.mConfiguration.complexValue&&this.mValue===t||(this.mValue=t,this.dispatchChange())}dispatchChange(){for(let t of this.mLinkedZonesArray)t.pushInteraction(U.set,this)}linkCurrentZone(){let t=Dt.current;this.mLinkedZones.has(t)||(this.mLinkedZones.add(t),this.mLinkedZonesArray.push(t))}};var Gt=class v{static mCurrentUpdateCycle=null;static openResheduledCycle(t,e){let r=!1;if(!v.mCurrentUpdateCycle){let u=performance.now();v.mCurrentUpdateCycle={initiator:t.initiator,startTime:u,forcedSync:t.forcedSync,runner:t.runner},r=!0}try{return e(v.mCurrentUpdateCycle)}finally{r&&(v.mCurrentUpdateCycle=null)}}static openUpdateCycle(t,e){let r=!1;if(!v.mCurrentUpdateCycle){let u=performance.now();v.mCurrentUpdateCycle={initiator:t.updater,startTime:u,forcedSync:t.runSync,runner:Symbol("Runner "+u)},r=!0}try{return e(v.mCurrentUpdateCycle)}finally{r&&(v.mCurrentUpdateCycle=null)}}static updateCycleRunId(t,e){if(t.initiator===e){let r=performance.now(),u=t;u.runner=Symbol("Runner "+r)}}static updateCyleStartTime(t){let e=performance.now(),r=t;r.startTime=e}};var Oe=class extends Error{mChain;get chain(){return this.mChain}constructor(t,e){let r=e.slice(-20).map(u=>u.toString()).join(`
`);super(`${t}: 
${r}`),this.mChain=[...e]}};var Fe=class v{static DEFAULT_FRAME_TIME=Number.MAX_SAFE_INTEGER;static STACK_CAP=100;mFrameTime;mInteractionZone;mManualComponentState;mUpdateFunction;mUpdateRunCache;mUpdateStates;get zone(){return this.mInteractionZone}constructor(t){this.mUpdateRunCache=new WeakMap,this.mUpdateFunction=t.onUpdate,this.mFrameTime=v.DEFAULT_FRAME_TIME;let e=Dt.current.getAttachment(Ct.ATTACHMENT_KEY);e&&(this.mFrameTime=e.guaranteedFrameTime),this.mManualComponentState=new $(Symbol("Manual Update")),this.mUpdateStates={chainCompleteHooks:new zt,async:{hasSheduledTask:!1,hasRunningTask:!1,sheduledTaskIsResheduled:!1},sync:{running:!1},cycle:{chainedTask:null}},this.mInteractionZone=Dt.create("Update-Zone"),this.mInteractionZone.addInteractionListener(r=>{(r.triggerType&U.set)!==0&&this.runUpdateAsynchron(r,null)})}deconstruct(){this.mInteractionZone.removeInteractionListener()}executeInZone(t){return this.mInteractionZone.execute(t)}update(){let t=new Vt(U.manual,this.mInteractionZone,this.mManualComponentState);return this.runUpdateSynchron(t)}updateAsync(){let t=new Vt(U.manual,this.mInteractionZone,this.mManualComponentState);this.runUpdateAsynchron(t,null)}async waitForUpdate(){return this.mUpdateStates.async.hasSheduledTask?new Promise((t,e)=>{this.mUpdateStates.chainCompleteHooks.push((r,u)=>{u?e(u):t(r)})}):!1}executeTaskChain(t,e,r,u){if(u.length>v.STACK_CAP)throw new Oe("Call loop detected",u);let d=performance.now();if(!e.forcedSync&&d-e.startTime>this.mFrameTime)throw new ye;u.push(t);let y=this.mInteractionZone.execute(()=>this.mUpdateFunction.call(this))||r;if(Gt.updateCycleRunId(e,this),!this.mUpdateStates.cycle.chainedTask)return y;let w=this.mUpdateStates.cycle.chainedTask;return this.mUpdateStates.cycle.chainedTask=null,this.executeTaskChain(w,e,y,u)}releaseUpdateChainCompleteHooks(t,e){if(!this.mUpdateStates.chainCompleteHooks.top)return;let r;for(;r=this.mUpdateStates.chainCompleteHooks.pop();)r(t,e)}runUpdateAsynchron(t,e){if(this.mUpdateStates.async.hasRunningTask||this.mUpdateStates.async.sheduledTaskIsResheduled){this.mUpdateStates.cycle.chainedTask=t;return}if(this.mUpdateStates.async.hasSheduledTask)return;let r=u=>{this.mUpdateStates.async.hasRunningTask=!0,this.mUpdateStates.async.hasSheduledTask=!1,this.mUpdateStates.async.sheduledTaskIsResheduled=!1;let d=!1;try{this.runUpdateSynchron(t)}catch(y){if(y instanceof ye&&u.initiator===this)d=!0;else throw new Kt(y,this.zone)}finally{this.mUpdateStates.async.hasRunningTask=!1}d&&this.runUpdateAsynchron(t,u)};this.mUpdateStates.async.hasSheduledTask=!0,e&&(this.mUpdateStates.async.sheduledTaskIsResheduled=!0),globalThis.requestAnimationFrame(()=>{e?Gt.openResheduledCycle(e,r):Gt.openUpdateCycle({updater:this,runSync:!1},r)})}runUpdateSynchron(t){if(this.mUpdateStates.sync.running)return this.mUpdateStates.cycle.chainedTask=t,!1;this.mUpdateStates.sync.running=!0;try{let e=Gt.openUpdateCycle({updater:this,runSync:!0},r=>{if(this.mUpdateRunCache.has(r.runner))return Gt.updateCyleStartTime(r),this.mUpdateRunCache.get(r.runner);let u=this.executeTaskChain(t,r,!1,new Array);return this.mUpdateRunCache.set(r.runner,u),u});return this.releaseUpdateChainCompleteHooks(e),e}catch(e){throw e instanceof ye||this.releaseUpdateChainCompleteHooks(!1,e),e}finally{this.mUpdateStates.sync.running=!1}}},ye=class extends Error{constructor(){super("Update resheduled")}};var ze=class extends kt{mUpdater;get updater(){return this.mUpdater}constructor(t){super(t),this.mUpdater=new Fe({label:t.constructor.name,onUpdate:()=>this.onUpdate()})}call(t,...e){return this.mUpdater.executeInZone(()=>super.call(t,...e))}deconstruct(){this.mUpdater.deconstruct(),super.deconstruct()}createProcessor(){return this.mUpdater.executeInZone(()=>super.createProcessor())}};var Wt=class{mExpression;mTemporaryValues;constructor(t,e,r){if(this.mTemporaryValues=new rt,r.length>0)for(let u of r)this.mTemporaryValues.set(u,void 0);this.mExpression=this.createEvaluationFunction(t,this.mTemporaryValues).bind(e.store)}execute(){return this.mExpression()}setTemporaryValue(t,e){if(!this.mTemporaryValues.has(t))throw new N(`Temporary value "${t}" does not exist for this procedure.`,this);this.mTemporaryValues.set(t,e)}createEvaluationFunction(t,e){let r,u=`__${Math.random().toString(36).substring(2)}`;if(r="return function () {",e.size>0)for(let d of e.keys())r+=`const ${d} = ${u}.get('${d}');`;return r+=`return ${t};`,r+="};",new Function(u,r)(e)}};var Pt=class{mDataLevel;get data(){return this.mDataLevel}constructor(t){this.mDataLevel=t}createExpressionProcedure(t,e){return new Wt(t,this.data,e??[])}setTemporaryValue(t,e){this.data.setTemporaryValue(t,e)}};var pt=class{mComponent;mDataProxy;mParentLevel;mTemporaryValues;get store(){return this.mDataProxy}constructor(t){this.mTemporaryValues=new rt,t instanceof G?(this.mParentLevel=null,this.mComponent=t):(this.mParentLevel=t,this.mComponent=t.mComponent),this.mDataProxy=this.createAccessProxy()}deleteTemporaryValue(t){this.mTemporaryValues.delete(t)}setTemporaryValue(t,e){this.mTemporaryValues.set(t,e)}updateLevelData(t){if(t.mParentLevel!==this.mParentLevel)throw new N("Can't update InstructionLevelData for a deeper level than it target data.",this);this.mTemporaryValues=t.mTemporaryValues}createAccessProxy(){return new Proxy(new Object,{get:(t,e)=>this.getValue(e),set:(t,e,r)=>(this.hasTemporaryValue(e)&&this.setTemporaryValue(e,r),e in this.mComponent.processor?(this.mComponent.processor[e]=r,!0):(this.setTemporaryValue(e,r),!0)),deleteProperty:()=>{throw new N("Deleting properties is not allowed",this)},ownKeys:()=>[...new Set([...Object.keys(this.mComponent.processor),...this.getTemporaryValuesList()])]})}getTemporaryValuesList(){let t=this.mTemporaryValues.map(e=>e);return this.mParentLevel&&t.push(...this.mParentLevel.getTemporaryValuesList()),t}getValue(t){if(this.mTemporaryValues.has(t))return this.mTemporaryValues.get(t);if(this.mParentLevel)return this.mParentLevel.getValue(t);if(t in this.mComponent.processor)return this.mComponent.processor[t]}hasTemporaryValue(t){return this.mTemporaryValues.has(t)?!0:this.mParentLevel?this.mParentLevel.hasTemporaryValue(t):!1}};var Zt=class v{mChildList;mInstruction;mInstructionType;get childList(){return this.mChildList}get instruction(){return this.mInstruction}get instructionType(){return this.mInstructionType}constructor(t,e){this.mChildList=Array(),this.mInstruction=e,this.mInstructionType=t}appendChild(...t){this.mChildList.push(...t)}clone(){let t=new v(this.instructionType,this.instruction);for(let e of this.mChildList)t.appendChild(e.clone());return t}equals(t){if(!(t instanceof v)||t.instruction!==this.instruction||t.instructionType!==this.instructionType||t.childList.length!==this.childList.length)return!1;for(let e=0;e<t.childList.length;e++)if(!t.childList[e].equals(this.childList[e]))return!1;return!0}removeChild(t){let e=this.mChildList.indexOf(t);if(e!==-1)return this.mChildList.splice(e,1)[0]}};var At=class v{mExpression;get value(){return this.mExpression}constructor(t){this.mExpression=t}clone(){return new v(this.mExpression)}equals(t){return t instanceof v&&t.value===this.value}toString(){return`{{ ${this.mExpression} }}`}};var Lt=class v{mContainsExpression;mTextValue;mValues;get containsExpression(){return this.mContainsExpression}get values(){return this.mValues}constructor(){this.mTextValue="",this.mContainsExpression=!1,this.mValues=[]}addValue(...t){for(let e of t)(this.mContainsExpression===!0||e instanceof At)&&(this.mContainsExpression=!0),this.mValues.push(e),this.mTextValue+=e.toString()}clone(){let t=new v;for(let e of this.values)typeof e=="string"?t.addValue(e):t.addValue(e.clone());return t}equals(t){if(!(t instanceof v)||t.values.length!==this.values.length)return!1;for(let e=0;e<this.values.length;e++){let r=this.values[e],u=t.values[e];if(r!==u&&(typeof r!=typeof u||typeof r=="string"&&r!==u||!u.equals(r)))return!1}return!0}toString(){return this.mTextValue}};var be=class v{mName;mValue;get name(){return this.mName}get values(){return this.mValue}constructor(t){this.mName=t,this.mValue=new Lt}clone(){let t=new v(this.name);for(let e of this.values.values)typeof e=="string"?t.values.addValue(e):t.values.addValue(e.clone());return t}equals(t){return!(!(t instanceof v)||t.name!==this.name||!t.values.equals(this.values))}};var Rt=class v{mAttributeDictionary;mChildList;mTagName;get attributes(){return[...this.mAttributeDictionary.values()]}get childList(){return this.mChildList}get tagName(){return this.mTagName}constructor(t){this.mAttributeDictionary=new Map,this.mChildList=Array(),this.mTagName=t}appendChild(...t){this.mChildList.push(...t)}clone(){let t=new v(this.tagName);for(let e of this.mAttributeDictionary.values()){let r=t.setAttribute(e.name);for(let u of e.values.values)typeof u=="string"?r.addValue(u):r.addValue(u.clone())}for(let e of this.mChildList)t.appendChild(e.clone());return t}equals(t){if(!(t instanceof v)||t.tagName!==this.tagName||t.attributes.length!==this.mAttributeDictionary.size||t.childList.length!==this.mChildList.length)return!1;for(let e of t.mAttributeDictionary.values()){let r=this.mAttributeDictionary.get(e.name);if(!r||!r.equals(e))return!1}for(let e=0;e<t.childList.length;e++)if(!t.childList[e].equals(this.mChildList[e]))return!1;return!0}getAttribute(t){return this.mAttributeDictionary.get(t)?.values??null}removeAttribute(t){return this.mAttributeDictionary.delete(t)}removeChild(t){let e=this.mChildList.indexOf(t);if(e!==-1)return this.mChildList.splice(e,1)[0]}setAttribute(t){if(this.mAttributeDictionary.has(t))return this.mAttributeDictionary.get(t).values;let e=new be(t);return this.mAttributeDictionary.set(t,e),e.values}};var ft=class v{mBodyElementList;get body(){return this.mBodyElementList}constructor(){this.mBodyElementList=new Array}appendChild(...t){this.mBodyElementList.push(...t)}clone(){let t=new v;for(let e of this.mBodyElementList)t.appendChild(e.clone());return t}equals(t){if(!(t instanceof v)||t.body.length!==this.mBodyElementList.length)return!1;for(let e=0;e<this.mBodyElementList.length;e++)if(!this.mBodyElementList[e].equals(t.body[e]))return!1;return!0}removeChild(t){let e=this.mBodyElementList.indexOf(t);if(e!==-1)return this.mBodyElementList.splice(e,1)[0]}};var ct=class{mComponentValues;mContent;mModules;mTemplate;get anchor(){return this.mContent.contentAnchor}get content(){return this.mContent}get modules(){return this.mModules}get template(){return this.mTemplate}get values(){return this.mComponentValues}constructor(t,e,r,u){this.mTemplate=t,this.mComponentValues=r,this.mContent=u,this.mModules=e,u.setCoreBuilder(this)}deconstruct(){this.content.deconstruct()}update(){let t=this.onUpdate(),e=!1,r=this.content.builders;if(r.length>0)for(let u=0;u<r.length;u++)e=r[u].update()||e;return t||e}createTextNode(t){return document.createTextNode(t)}};var te=class{mChildBuilderList;mChildComponents;mContentAnchor;mContentBoundary;mLinkedContent;mRootChildList;get body(){return this.mRootChildList}get builders(){return this.mChildBuilderList}get contentAnchor(){return this.mContentAnchor}constructor(t){this.mChildBuilderList=new Array,this.mRootChildList=new Array,this.mChildComponents=new Map,this.mLinkedContent=new WeakSet,this.mContentAnchor=document.createComment(t),this.mContentBoundary={start:this.mContentAnchor,end:this.mContentAnchor}}deconstruct(){this.onDeconstruct();let t;for(;t=this.mChildBuilderList.pop();)t.deconstruct();for(let r of this.mChildComponents.values())r.deconstruct();this.mChildComponents.clear();let e;for(;e=this.mRootChildList.pop();)e instanceof ct||e.remove();this.contentAnchor.remove()}getBoundary(){let t=this.mContentBoundary.end instanceof ct?this.mContentBoundary.end.content.getBoundary().end:this.mContentBoundary.end;return{start:this.mContentBoundary.start,end:t}}insert(t,e,r){if(!this.mLinkedContent.has(r))throw new N("Can't add content to builder. Target is not part of builder.",this);let u=t instanceof ct?t.anchor:t;switch(e){case"After":{this.insertAfter(u,r);break}case"TopOf":{this.insertTop(u,r);break}case"BottomOf":{this.insertBottom(u,r);break}}this.mLinkedContent.add(t),t instanceof ct?this.mChildBuilderList.push(t):this.addChildComponent(t);let d=u.parentElement??u.getRootNode(),y=this.mContentAnchor.parentElement??this.mContentAnchor.getRootNode();if(d===y){let w=(()=>{switch(e){case"After":return this.mRootChildList.indexOf(r)+1;case"TopOf":return 0;case"BottomOf":return this.mRootChildList.length}})();w===this.mRootChildList.length&&(this.mContentBoundary.end=t),this.mRootChildList.splice(w+1,0,t)}}remove(t){if(!this.mLinkedContent.has(t))throw new N("Child node cant be deleted from builder when it not a child of them",this);if(this.mLinkedContent.delete(t),t instanceof ct){let r=this.mChildBuilderList.indexOf(t);r!==-1&&this.mChildBuilderList.splice(r,1),t.deconstruct()}else{let r=this.mChildComponents.get(t);r&&(r.deconstruct(),this.mChildComponents.delete(t)),t.remove()}let e=this.mRootChildList.indexOf(t);e!==-1&&(this.mRootChildList.splice(e,1),this.mContentBoundary.end=this.mRootChildList.at(-1)??this.mContentAnchor)}setCoreBuilder(t){this.mLinkedContent.add(t)}addChildComponent(t){Q.elementIsComponent(t)&&this.mChildComponents.set(t,Q.ofElement(t).component)}insertAfter(t,e){let r=e instanceof ct?e.content.getBoundary().end:e;(r.parentElement??r.getRootNode()).insertBefore(t,r.nextSibling)}insertBottom(t,e){if(e instanceof ct){this.insertAfter(t,e);return}if(e instanceof Element){e.appendChild(t);return}throw new N("Source node does not support child nodes.",this)}insertTop(t,e){if(e instanceof ct){this.insertAfter(t,e.anchor);return}if(e instanceof Element){e.prepend(t);return}throw new N("Source node does not support child nodes.",this)}};var je=class extends te{mAttributeModulesChangedOrder;mLinkedAttributeData;mLinkedAttributeExpressionModules;mLinkedAttributeModuleList;mLinkedExpressionModuleList;get linkedAttributeModules(){return this.mAttributeModulesChangedOrder&&(this.mAttributeModulesChangedOrder=!1,this.mLinkedAttributeModuleList.sort((t,e)=>t.accessMode-e.accessMode)),this.mLinkedAttributeModuleList}get linkedExpressionModules(){return this.mLinkedExpressionModuleList}constructor(t){super(t),this.mLinkedExpressionModuleList=new Array,this.mLinkedAttributeModuleList=new Array,this.mLinkedAttributeExpressionModules=new WeakMap,this.mLinkedAttributeData=new WeakMap,this.mAttributeModulesChangedOrder=!1}attributeOfLinkedExpressionModule(t){return this.mLinkedAttributeExpressionModules.get(t)}getLinkedAttributeData(t){if(!this.mLinkedAttributeData.has(t))throw new N("Attribute has no linked data.",this);return this.mLinkedAttributeData.get(t)}linkAttributeExpression(t,e){this.mLinkedAttributeExpressionModules.set(t,e)}linkAttributeModule(t){this.mLinkedAttributeModuleList.push(t),this.mAttributeModulesChangedOrder=!0}linkAttributeNodes(t,e,r){this.mLinkedAttributeData.set(t,{values:r,node:e})}linkExpressionModule(t){this.mLinkedExpressionModuleList.push(t)}onDeconstruct(){for(let t of this.mLinkedAttributeModuleList)t.deconstruct();for(let t of this.mLinkedExpressionModuleList)t.deconstruct()}};var Ve=class extends te{mInstructionModule;get instructionModule(){return this.mInstructionModule}constructor(t,e){super(e),this.mInstructionModule=t}onDeconstruct(){this.mInstructionModule.deconstruct()}};var $e=class extends ct{constructor(t,e,r){let u=e.createInstructionModule(t,r);super(t,e,r,new Ve(u,`Instruction - {$${t.instructionType}}`))}onUpdate(){if(this.content.instructionModule.update()){let t=this.content.body;this.updateStaticBuilder(t,this.content.instructionModule.instructionResult.elementList)}return!1}insertNewContent(t,e){let r=new ee(t.template,this.modules,t.dataLevel,`Child - {$${this.template.instructionType}}`,t.key);return e===null?this.content.insert(r,"TopOf",this):this.content.insert(r,"After",e),r}updateStaticBuilder(t,e){let u=new fe((w,D)=>D.template.equals(w.template)&&D.key===w.key).differencesOf(t,e),d=0,y=null;for(let w=0;w<u.length;w++){let D=u[w];if(D.changeState===_t.Remove)this.content.remove(D.item);else if(D.changeState===_t.Insert)y=this.insertNewContent(D.item,y),d++;else{let S=e[d].dataLevel;D.item.values.updateLevelData(S),y=D.item,d++}}}};var ee=class extends ct{mInitialized;mKey;get key(){return this.mKey}constructor(t,e,r,u,d){super(t,e,r,new je(`Static - {${u}}`)),this.mKey=d,this.mInitialized=!1}onUpdate(){this.mInitialized||(this.mInitialized=!0,this.buildTemplate([this.template],this));let t=!1,e=this.content.linkedAttributeModules;for(let d=0;d<e.length;d++)t=e[d].update()||t;let r=!1,u=this.content.linkedExpressionModules;for(let d=0;d<u.length;d++){let y=u[d];if(y.update()){r=!0;let w=this.content.attributeOfLinkedExpressionModule(y);if(!w)continue;let D=this.content.getLinkedAttributeData(w),S=D.values.reduce((l,n)=>l+n.data,"");D.node.setAttribute(w.name,S)}}return t||r}buildInstructionTemplate(t,e){this.content.insert(new $e(t,this.modules,new pt(this.values)),"BottomOf",e)}buildStaticTemplate(t,e){let{element:r,isComponent:u}=this.createHtmlElement(t),d=null;u&&(d=new Array);for(let y of t.attributes){let w=this.modules.createAttributeModule(y,r,this.values);if(w){this.content.linkAttributeModule(w),u&&d.push(w);continue}if(y.values.containsExpression){let D=new Array;for(let S of y.values.values){let l=this.createTextNode("");if(D.push(l),!(S instanceof At)){l.data=S;continue}let n=this.modules.createExpressionModule(S,l,this.values);this.content.linkExpressionModule(n),this.content.linkAttributeExpression(n,y)}this.content.linkAttributeNodes(y,r,D);continue}r.setAttribute(y.name,y.values.toString())}if(u){for(let y of d)y.update();Q.ofElement(r).component.updater.update()}this.content.insert(r,"BottomOf",e),this.buildTemplate(t.childList,r)}buildTemplate(t,e){for(let r of t)r instanceof ft?this.buildTemplate(r.body,e):r instanceof Lt?this.buildTextTemplate(r,e):r instanceof Zt?this.buildInstructionTemplate(r,e):r instanceof Rt&&this.buildStaticTemplate(r,e)}buildTextTemplate(t,e){for(let r of t.values){if(typeof r=="string"){this.content.insert(this.createTextNode(r),"BottomOf",e);continue}let u=this.createTextNode("");this.content.insert(u,"BottomOf",e);let d=this.modules.createExpressionModule(r,u,this.values);this.content.linkExpressionModule(d)}}createHtmlElement(t){let e=t.tagName;if(e.includes("-")){let u=globalThis.customElements.get(e);if(typeof u<"u"){let d=new u;return{element:d,isComponent:Q.elementIsComponent(d)}}}let r=t.getAttribute("xmlns");return r&&!r.containsExpression?{element:document.createElementNS(r.values[0],e),isComponent:!1}:{element:document.createElement(e),isComponent:!1}}};var we=class{mHtmlElement;mShadowRoot;get htmlElement(){return this.mHtmlElement}get shadowRoot(){return this.mShadowRoot}constructor(t){this.mHtmlElement=t,this.mShadowRoot=this.mHtmlElement.attachShadow({mode:"open"})}};var W=class{mDataLevel;get data(){return this.mDataLevel}constructor(t){this.mDataLevel=t}createExpressionProcedure(t,e){return new Wt(t,this.data,e??[])}};var Bt=class extends kt{constructor(t){super({constructor:t.constructor,parent:t.parent}),this.setProcessorInjection(W,new W(t.values))}deconstruct(){super.deconstruct(),this.call("onDeconstruct")}update(){return this.onUpdate()}};var ot=class{mValue;get value(){return this.mValue}constructor(t){this.mValue=t}};var k=class{constructor(){throw new N("Reference should not be instanced.",this)}};var gt=class{constructor(){throw new N("Reference should not be instanced.",this)}};var Ut=class v extends Bt{mLastResult;mTargetTextNode;constructor(t){super({constructor:t.constructor,parent:t.parent,values:t.values}),this.mTargetTextNode=t.targetNode,this.mLastResult=null,this.setProcessorInjection(v,this),this.setProcessorInjection(gt,t.targetTemplate.clone()),this.setProcessorInjection(k,t.targetNode),this.setProcessorInjection(ot,new ot(t.targetTemplate.value))}onUpdate(){let t=this.call("onUpdate");t===null&&(t="");let e=this.mLastResult===null||this.mLastResult!==t;if(e){let r=this.mTargetTextNode;r.data=t,this.mLastResult=t}return e}};function bo(){return(v,t)=>{O.registerInjectable(v,t.metadata,"instanced"),ht.register(Ut,v,{})}}function Js(){function v(l,n){return function(c){e(n,"addInitializer"),r(c,"An initializer"),l.push(c)}}function t(l,n,h,c,o,b,p,T,x){var m;switch(o){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var s={kind:m,name:p?"#"+n:n,static:b,private:p,metadata:T},f={v:!1};s.addInitializer=v(c,f);var i,a;if(o===0?p?(i=h.get,a=h.set):(i=function(){return this[n]},a=function(g){this[n]=g}):o===2?i=function(){return h.value}:((o===1||o===3)&&(i=function(){return h.get.call(this)}),(o===1||o===4)&&(a=function(g){h.set.call(this,g)})),p)s.access=i&&a?{get:i,set:a}:i?{get:i}:{set:a};else{if(i){var C=i;i=function(g){return arguments.length===0&&(g=this),C.call(g)}}if(a){var P=a;a=function(g,_){return arguments.length===1&&(_=g,g=this),P.call(g,_)}}var E=function(g){return n in g};s.access=i&&a?{has:E,get:i,set:a}:i?{has:E,get:i}:{has:E,set:a}}try{return l(x,s)}finally{f.v=!0}}function e(l,n){if(l.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(l,n){if(typeof l!="function")throw new TypeError(n+" must be a function")}function u(l,n){var h=typeof n;if(l===1){if(h!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(h!=="function"){var c;throw l===0?c="field":l===10?c="class":c="method",new TypeError(c+" decorators must return a function or void 0")}}function d(l,n,h,c,o,b,p,T,x){var m=h[0],s,f,i;p?o===0||o===1?s={get:h[3],set:h[4]}:o===3?s={get:h[3]}:o===4?s={set:h[3]}:s={value:h[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,c)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var a,C,P;if(typeof m=="function")a=t(m,c,s,T,o,b,p,x,i),a!==void 0&&(u(o,a),o===0?f=a:o===1?(f=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a);else for(var E=m.length-1;E>=0;E--){var g=m[E];if(a=t(g,c,s,T,o,b,p,x,i),a!==void 0){u(o,a);var _;o===0?_=a:o===1?(_=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a,_!==void 0&&(f===void 0?f=_:typeof f=="function"?f=[f,_]:f.push(_))}}if(o===0||o===1){if(f===void 0)f=function(M,I){return I};else if(typeof f!="function"){var F=f;f=function(M,I){for(var A=I,L=0;L<F.length;L++)A=F[L].call(M,A);return A}}else{var j=f;f=function(M,I){return j.call(M,I)}}l.push(f)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),p?o===1?(l.push(function(M,I){return i.get.call(M,I)}),l.push(function(M,I){return i.set.call(M,I)})):o===2?l.push(i):l.push(function(M,I){return i.call(M,I)}):Object.defineProperty(n,c,s))}function y(l,n,h){for(var c=[],o,b,p=new Map,T=new Map,x=0;x<n.length;x++){var m=n[x];if(Array.isArray(m)){var s=m[1],f=m[2],i=m.length>3,a=s>=5,C,P;if(a?(C=l,s=s-5,b=b||[],P=b):(C=l.prototype,o=o||[],P=o),s!==0&&!i){var E=a?T:p,g=E.get(f)||0;if(g===!0||g===3&&s!==4||g===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!g&&s>2?E.set(f,s):E.set(f,!0)}d(c,C,m,f,s,a,i,P,h)}}return w(c,o),w(c,b),c}function w(l,n){n&&l.push(function(h){for(var c=0;c<n.length;c++)n[c].call(h);return h})}function D(l,n,h){if(n.length>0){for(var c=[],o=l,b=l.name,p=n.length-1;p>=0;p--){var T={v:!1};try{var x=n[p](o,{kind:"class",name:b,addInitializer:v(c,T),metadata:h})}finally{T.v=!0}x!==void 0&&(u(10,x),o=x)}return[S(o,h),function(){for(var m=0;m<c.length;m++)c[m].call(o)}]}}function S(l,n){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,h,c,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var p=Object.create(b===void 0?null:b),T=y(n,h,p);return c.length||S(n,p),{e:T,get c(){return D(n,c,p)}}}}function Oo(v,t,e,r){return(Oo=Js())(v,t,e,r)}var Fo,Lo,wo;Fo=bo();var Ro=class{static{({c:[wo,Lo]}=Oo(this,[],[Fo]))}constructor(t=O.use(W),e=O.use(ot)){this.mProcedure=t.createExpressionProcedure(e.value)}mProcedure;onUpdate(){let t=this.mProcedure.execute();return typeof t>"u"?null:t?.toString()}static{Lo()}};var it=class{mName;mValue;get name(){return this.mName}get value(){return this.mValue}constructor(t,e){this.mName=t,this.mValue=e}};var Et=class v extends Bt{mAccessMode;get accessMode(){return this.mAccessMode}constructor(t){super({constructor:t.constructor,parent:t.parent,values:t.values}),this.mAccessMode=t.accessMode,this.setProcessorInjection(v,this),this.setProcessorInjection(gt,t.targetTemplate.clone()),this.setProcessorInjection(k,t.targetNode),this.setProcessorInjection(it,new it(t.targetTemplate.name,t.targetTemplate.values.toString()))}onUpdate(){return this.call("onUpdate")??!1}};var dt=class{mDataLevels;mElementList;mTemplates;get elementList(){return this.mElementList}constructor(){this.mElementList=new Array,this.mTemplates=new Set,this.mDataLevels=new Set}addElement(t,e,r){if(this.mTemplates.has(t)||this.mDataLevels.has(e))throw new N("Can't add same template or values for multiple Elements.",this);this.mTemplates.add(t),this.mDataLevels.add(e),this.mElementList.push({template:t,dataLevel:e,key:r})}};var Xt=class v extends Bt{mLastResult;get instructionResult(){return this.mLastResult}constructor(t){super({constructor:t.constructor,parent:t.parent,values:t.values}),this.setProcessorInjection(v,this),this.setProcessorInjection(gt,t.targetTemplate.clone()),this.setProcessorInjection(ot,new ot(t.targetTemplate.instruction)),this.mLastResult=new dt}onUpdate(){let t=this.call("onUpdate");return t instanceof dt?(this.mLastResult=t,!0):!1}};var Ge=class v{static mAttributeModuleCache=new rt;static mExpressionModuleCache=new WeakMap;static mInstructionModuleCache=new rt;mComponent;mExpressionModule;constructor(t,e){this.mExpressionModule=e??wo,this.mComponent=t}createAttributeModule(t,e,r){let u=(()=>{let d=v.mAttributeModuleCache.get(t.name);if(d||d===null)return d;for(let y of ht.get(Et))if(y.processorConfiguration.selector.test(t.name))return v.mAttributeModuleCache.set(t.name,y),y;return v.mAttributeModuleCache.set(t.name,null),null})();return u===null?null:new Et({accessMode:u.processorConfiguration.access,constructor:u.processorConstructor,parent:this.mComponent,targetNode:e,targetTemplate:t,values:r}).setup()}createExpressionModule(t,e,r){let u=(()=>{let d=v.mExpressionModuleCache.get(this.mExpressionModule);if(d)return d;let y=ht.get(Ut).find(w=>w.processorConstructor===this.mExpressionModule);if(!y)throw new N("An expression module could not be found.",this);return v.mExpressionModuleCache.set(this.mExpressionModule,y),y})();return new Ut({constructor:u.processorConstructor,parent:this.mComponent,targetNode:e,targetTemplate:t,values:r}).setup()}createInstructionModule(t,e){let r=(()=>{let u=v.mInstructionModuleCache.get(t.instructionType);if(u)return u;for(let d of ht.get(Xt))if(d.processorConfiguration.instructionType===t.instructionType)return v.mInstructionModuleCache.set(t.instructionType,d),d;throw new N(`Instruction module type "${t.instructionType}" not found.`,this)})();return new Xt({constructor:r.processorConstructor,parent:this.mComponent,targetTemplate:t,values:e}).setup()}};var qt=class extends N{mColumnEnd;mColumnStart;mLineEnd;mLineStart;get columnEnd(){return this.mColumnEnd}get columnStart(){return this.mColumnStart}get lineEnd(){return this.mLineEnd}get lineStart(){return this.mLineStart}constructor(t,e,r,u,d,y,w){super(t,e,w),this.mColumnStart=r,this.mLineStart=u,this.mColumnEnd=d,this.mLineEnd=y}};var oe=class{mDependencyFetch;mDependencyFetchResolved;mLexer;mMeta;mPattern;mPatternDependencies;mType;get dependencies(){return this.mPatternDependencies}get dependenciesResolved(){return this.mDependencyFetchResolved}get lexer(){return this.mLexer}get meta(){return this.mMeta}get pattern(){return this.mPattern}constructor(t,e){if(this.mLexer=t,this.mType=e.type,this.mMeta=e.metadata,this.mPatternDependencies=new Array,this.mDependencyFetch=e.dependencyFetch??null,this.mDependencyFetchResolved=!e.dependencyFetch,this.mType==="split"&&!this.mDependencyFetch)throw new N("Split token with a start and end token, need inner token definitions.",this);if(this.mType==="single"&&this.mDependencyFetch)throw new N("Pattern does not allow inner token pattern.",this);this.mPattern=this.convertTokenPattern(this.mType,e.pattern)}isSplit(){return this.mType==="split"}resolveDependencies(){this.mDependencyFetchResolved||(this.mDependencyFetch(this),this.mDependencyFetchResolved=!0)}useChildPattern(t){if(this.mLexer!==t.lexer)throw new N("Can only add dependencies of the same lexer.",this);this.mPatternDependencies.push(t)}convertTokenPattern(t,e){if("single"in e){if(t==="split")throw new N("Can't use split pattern type with single pattern definition.",this);return{start:{regex:e.single.regex,types:e.single.types,validator:e.single.validator??null}}}else{if(t==="single")throw new N("Can't use single pattern type with split pattern definition.",this);return{start:{regex:e.start.regex,types:e.start.types,validator:e.start.validator??null},end:{regex:e.end.regex,types:e.end.types,validator:e.end.validator??null},innerType:e.innerType??null}}}};var re=class{mColumnNumber;mLineNumber;mMetas;mType;mValue;get columnNumber(){return this.mColumnNumber}get lineNumber(){return this.mLineNumber}get metas(){return[...this.mMetas]}get type(){return this.mType}get value(){return this.mValue}constructor(t,e,r,u){this.mValue=e,this.mColumnNumber=r,this.mLineNumber=u,this.mType=t,this.mMetas=new Set}addMeta(...t){for(let e of t)this.mMetas.add(e)}hasMeta(t){return this.mMetas.has(t)}};var xe=class{mRootPattern;mSettings;get errorType(){return this.mSettings.errorType}set errorType(t){this.mSettings.errorType=t}get trimWhitespace(){return this.mSettings.trimSpaces}set trimWhitespace(t){this.mSettings.trimSpaces=t}get validWhitespaces(){return[...this.mSettings.whiteSpaces].join("")}set validWhitespaces(t){this.mSettings.whiteSpaces=new Set(t.split(""))}constructor(){this.mSettings={errorType:null,trimSpaces:!0,whiteSpaces:new Set},this.mRootPattern=new oe(this,{type:"single",pattern:{single:{regex:/^/,types:{},validator:null}},metadata:[],dependencyFetch:null})}createTokenPattern(t,e){let r=w=>typeof w=="string"?{token:w}:w,u=w=>{let D=new Set(w.flags.split(""));return new RegExp(`^(?<token>${w.source})`,[...D].join(""))},d=new Array;t.meta&&(typeof t.meta=="string"?d.push(t.meta):d.push(...t.meta));let y;return"regex"in t.pattern?y={single:{regex:u(t.pattern.regex),types:r(t.pattern.type),validator:t.pattern.validator??null}}:y={start:{regex:u(t.pattern.start.regex),types:r(t.pattern.start.type),validator:t.pattern.start.validator??null},end:{regex:u(t.pattern.end.regex),types:r(t.pattern.end.type),validator:t.pattern.end.validator??null},innerType:t.pattern.innerType??null},new oe(this,{type:"regex"in t.pattern?"single":"split",pattern:y,metadata:d,dependencyFetch:e??null})}*tokenize(t,e){let r={data:t,cursor:{position:0,column:1,line:1},error:null,progressTracker:e??null};yield*this.tokenizeRecursionLayer(r,this.mRootPattern,new Array,null)}useRootTokenPattern(t){if(t.lexer!==this)throw new N("Token pattern must be created by this lexer.",this);this.mRootPattern.useChildPattern(t)}findNextStartToken(t,e,r,u){for(let d of e){let y=d.pattern.start,w=this.matchToken(d,y,t,r,u);if(w!==null)return{pattern:d,token:w}}return null}findTokenTypeOfMatch(t,e,r){for(let y in t.groups){let w=t.groups[y],D=e[y];if(!(!w||!D)){if(w.length!==t[0].length)throw new N("A group of a token pattern must match the whole token.",this);return D}}let u=new Array;for(let y in t.groups)t.groups[y]&&u.push(y);let d=new Array;for(let y in e)d.push(y);throw new N(`No token type found for any defined pattern regex group. Full: "${t[0]}", Matches: "${u.join(", ")}", Available: "${d.join(", ")}", Regex: "${r.source}"`,this)}*generateErrorToken(t,e){if(!t.error||!this.mSettings.errorType)return;let r=new re(this.mSettings.errorType,t.error.data,t.error.startColumn,t.error.startLine);r.addMeta(...e),t.error=null,yield r}generateToken(t,e,r,u,d,y){let w=r[0],D=this.findTokenTypeOfMatch(r,u,y),S=new re(d??D,w,t.cursor.column,t.cursor.line);return S.addMeta(...e),S}matchToken(t,e,r,u,d){let y=e.regex;y.lastIndex=0;let w=y.exec(r.data);if(!w||w.index!==0)return null;let D=this.generateToken(r,[...u,...t.meta],w,e.types,d,y);if(e.validator){let S=r.data.substring(D.value.length);if(!e.validator(D,S,r.cursor.position))return null}return this.moveCursor(r,D.value),D}moveCursor(t,e){let r=e.split(`
`);r.length>1&&(t.cursor.column=1),t.cursor.line+=r.length-1,t.cursor.column+=r.at(-1).length,t.cursor.position+=e.length,t.data=t.data.substring(e.length),this.trackProgress(t)}pushNextCharToErrorState(t){if(!this.mSettings.errorType)throw new qt(`Unable to parse next token. No valid pattern found for "${t.data.substring(0,20)}".`,this,t.cursor.column,t.cursor.line,t.cursor.column,t.cursor.line);t.error||(t.error={data:"",startColumn:t.cursor.column,startLine:t.cursor.line});let e=t.data.charAt(0);t.error.data+=e,this.moveCursor(t,e)}skipNextWhitespace(t){let e=t.data.charAt(0);return!this.mSettings.trimSpaces||!this.mSettings.whiteSpaces.has(e)?!1:(this.moveCursor(t,e),!0)}*tokenizeRecursionLayer(t,e,r,u){let d=e.dependencies;for(;t.data.length>0;){if(!t.error&&this.skipNextWhitespace(t))continue;if(e.isSplit()){let D=this.matchToken(e,e.pattern.end,t,r,u);if(D!==null){yield*this.generateErrorToken(t,r),yield D;return}}let y=this.findNextStartToken(t,d,r,u);if(!y){this.pushNextCharToErrorState(t);continue}yield*this.generateErrorToken(t,r),yield y.token;let w=y.pattern;w.isSplit()&&(w.resolveDependencies(),yield*this.tokenizeRecursionLayer(t,w,[...r,...w.meta],u??w.pattern.innerType))}yield*this.generateErrorToken(t,r)}trackProgress(t){t.progressTracker!==null&&t.progressTracker(t.cursor.position,t.cursor.line,t.cursor.column)}};var J=class extends Error{static PARSER_ERROR=Symbol("PARSER_ERROR");mTrace;get columnEnd(){return this.mTrace.top.range.columnEnd}get columnStart(){return this.mTrace.top.range.columnStart}get graph(){return this.mTrace.top.graph}get incidents(){return this.mTrace.incidents}get lineEnd(){return this.mTrace.top.range.lineEnd}get lineStart(){return this.mTrace.top.range.lineStart}constructor(t){super(t.top.message,{cause:t.top.cause}),this.mTrace=t}};var Be=class{mIncidents;mTop;get incidents(){if(this.mIncidents===null)throw new N("A complete incident list is only available on debug mode.",this);return this.mIncidents}get top(){return this.mTop}constructor(t){this.mTop={message:"Unknown parser error",priority:0,graph:null,range:{lineStart:1,columnStart:1,lineEnd:1,columnEnd:1},cause:null},t?this.mIncidents=new Array:this.mIncidents=null}push(t,e,r,u,d,y,w=!1,D=null){let S;if(w?S=this.mTop.priority+1:S=d*1e4+y,this.mIncidents!==null){let l={message:t,priority:S,graph:e,range:{lineStart:r,columnStart:u,lineEnd:d,columnEnd:y},cause:D};this.mIncidents.push(l)}this.mTop&&S<this.mTop.priority||this.setTop({message:t,priority:S,graph:e,range:{lineStart:r,columnStart:u,lineEnd:d,columnEnd:y},cause:D})}setTop(t){this.mTop=t}};var Ue=class v{static MAX_JUNCTION_CIRCULAR_REFERENCES=1e3;mGraphStack;mIncidentTrace;mLastTokenPosition;mProcessStack;mTokenCache;mTokenGenerator;mTrimTokenCache;get currentGraph(){return this.mGraphStack.top.graph}get currentToken(){let t=this.mGraphStack.top;return this.mTokenCache[t.token.cursor]}get incidentTrace(){return this.mIncidentTrace}get processStack(){return this.mProcessStack}constructor(t,e,r){this.mTokenGenerator=t,this.mGraphStack=new zt,this.mLastTokenPosition={column:1,line:1},this.mTokenCache=new Array,this.mProcessStack=new zt,this.mTrimTokenCache=r,this.mIncidentTrace=new Be(e),this.mGraphStack.push({graph:null,linear:!0,circularGraphs:new rt,token:{start:0,cursor:-1}})}collapse(){let t=this.mGraphStack.top,e=this.mTokenCache.slice(t.token.cursor);e.length!==0&&e.at(-1)===null&&e.pop();for(let r of this.mTokenGenerator)e.push(r);return e}getGraphBoundingToken(){let t=this.mGraphStack.top,e=this.mTokenCache[t.token.start],r=this.mTokenCache[t.token.cursor-1];return e??=r,r??=e,[e??null,r??null]}getGraphPosition(){let t=this.mGraphStack.top,e,r;if(e=this.mTokenCache[t.token.start],r=this.mTokenCache[t.token.cursor-1],e??=r,r??=e,!e||!r)return{graph:t.graph,columnEnd:this.mLastTokenPosition.column,columnStart:this.mLastTokenPosition.column,lineEnd:this.mLastTokenPosition.line,lineStart:this.mLastTokenPosition.line};let u,d;if(r.value.includes(`
`)){let y=r.value.split(`
`);d=r.lineNumber+y.length-1,u=1+y[y.length-1].length}else u=r.columnNumber+r.value.length,d=r.lineNumber;return{graph:t.graph,lineStart:e.lineNumber,columnStart:e.columnNumber,lineEnd:d,columnEnd:u}}getTokenPosition(){let t=this.mGraphStack.top,e=this.currentToken;if(!e)return{graph:t.graph,columnEnd:this.mLastTokenPosition.column,columnStart:this.mLastTokenPosition.column,lineEnd:this.mLastTokenPosition.line,lineStart:this.mLastTokenPosition.line};let r,u;if(e.value.includes(`
`)){let d=e.value.split(`
`);u=e.lineNumber+d.length-1,r=1+d[d.length-1].length}else r=e.columnNumber+e.value.length,u=e.lineNumber;return{graph:t.graph,lineStart:e.lineNumber,columnStart:e.columnNumber,lineEnd:u,columnEnd:r}}graphIsCircular(t){let e=this.mGraphStack.top;if(!e.circularGraphs.has(t))return!1;if(t.isJunction){if(e.circularGraphs.get(t)>v.MAX_JUNCTION_CIRCULAR_REFERENCES)throw new N("Junction graph called circular too often.",this);return!1}return!0}moveNextToken(){let t=this.mGraphStack.top;if(t.circularGraphs.size>0&&(t.circularGraphs=new rt),t.graph&&t.graph.isJunction)throw new N("Junction graph must not have own nodes.",this);if(t.token.cursor++,t.token.cursor<this.mTokenCache.length)return;let e=this.mTokenGenerator.next();if(e.done){this.mTokenCache.push(null);return}this.mLastTokenPosition.column=e.value.columnNumber,this.mLastTokenPosition.line=e.value.lineNumber,this.mTokenCache.push(e.value)}popGraphStack(t){let e=this.mGraphStack.pop(),r=this.mGraphStack.top;if(t&&(e.token.cursor=e.token.start),e.token.cursor!==e.token.start&&r.circularGraphs.size>0&&(r.circularGraphs=new rt),!this.mTrimTokenCache){r.token.cursor=e.token.cursor;return}e.linear?(this.mTokenCache.splice(0,e.token.cursor),r.token.start=0,r.token.cursor=0):r.token.cursor=e.token.cursor}pushGraphStack(t,e){let r=this.mGraphStack.top,u={graph:t,linear:e&&r.linear,circularGraphs:new rt(r.circularGraphs),token:{start:r.token.cursor,cursor:r.token.cursor}},d=u.circularGraphs.get(t)??0;u.circularGraphs.set(t,d+1),this.mGraphStack.push(u)}};var Te=class v{static NODE_NULL_RESULT=Symbol("FAILED_NODE_VALUE_PARSE");static NODE_VALUE_LIST_END_MEET=Symbol("FAILED_NODE_VALUE_PARSE");mConfiguration;mLexer;mRootPart;get lexer(){return this.mLexer}constructor(t,e){this.mLexer=t,this.mRootPart=null,this.mConfiguration={keepTraceIncidents:!1,trimTokenCache:!1,...e}}parse(t,e){if(this.mRootPart===null)throw new N("Parser has not root part set.",this);let r=new Ue(this.mLexer.tokenize(t,e),this.mConfiguration.keepTraceIncidents,this.mConfiguration.trimTokenCache),u=(()=>{try{return this.beginParseProcess(r,this.mRootPart)}catch(y){if(y instanceof qt)return r.incidentTrace.push(y.message,r.currentGraph,y.lineStart,y.columnStart,y.lineEnd,y.columnEnd,!0,y),J.PARSER_ERROR;let w=y instanceof Error?y.message:y.toString(),D=r.getGraphPosition();return r.incidentTrace.push(w,r.currentGraph,D.lineStart,D.columnStart,D.lineEnd,D.columnEnd,!0,y),J.PARSER_ERROR}})();if(u===J.PARSER_ERROR)throw new J(r.incidentTrace);let d=r.collapse();if(d.length!==0){let y=d[0];if(r.incidentTrace.top.range.lineEnd===1&&r.incidentTrace.top.range.columnEnd===1){let w=`Tokens could not be parsed. Graph end meet without reaching last token. Current: "${y.value}" (${y.type})`;r.incidentTrace.push(w,this.mRootPart,y.lineNumber,y.columnNumber,y.lineNumber,y.columnNumber)}throw new J(r.incidentTrace)}return u}setRootGraph(t){this.mRootPart=t}beginParseProcess(t,e){t.moveNextToken(),t.processStack.push({type:"graph-parse",parameter:{graph:e,linear:!0},state:0});let r=v.NODE_NULL_RESULT;for(;t.processStack.top;)r=this.processStack(t,t.processStack.top,r);return r}processChainedNodeParseProcess(t,e,r){switch(e.state){case 0:{let y=e.parameter.node.connections.next;return y===null?(t.processStack.pop(),{}):(e.state++,t.processStack.push({type:"node-parse",parameter:{node:y},state:0,values:{}}),v.NODE_NULL_RESULT)}case 1:{let u=r;return u===J.PARSER_ERROR?(t.processStack.pop(),J.PARSER_ERROR):(t.processStack.pop(),u)}}throw new N(`Invalid node next parse state "${e.state}".`,this)}processGraphParseProcess(t,e,r){let u=e.parameter.graph;switch(e.state){case 0:{if(t.graphIsCircular(u)){let y=t.getGraphPosition();return t.incidentTrace.push("Circular graph detected.",u,y.lineStart,y.columnStart,y.lineEnd,y.columnEnd),t.processStack.pop(),J.PARSER_ERROR}let d=e.parameter.linear;return t.pushGraphStack(u,d),e.state++,t.processStack.push({type:"node-parse",parameter:{node:u.node},state:0,values:{}}),v.NODE_NULL_RESULT}case 1:{let d=r;if(d===J.PARSER_ERROR)return t.popGraphStack(!0),t.processStack.pop(),J.PARSER_ERROR;let y=u.convert(d,t);if(typeof y=="symbol"){let w=t.getGraphPosition();return t.incidentTrace.push(y.description??"Unknown data convert error",w.graph,w.lineStart,w.columnStart,w.lineEnd,w.columnEnd),t.popGraphStack(!0),t.processStack.pop(),J.PARSER_ERROR}return t.popGraphStack(!1),t.processStack.pop(),y}}throw new N(`Invalid graph parse state "${e.state}".`,this)}processNodeParseProcess(t,e,r){let u=e.parameter.node;switch(e.state){case 0:return t.processStack.push({type:"node-value-parse",parameter:{node:u,valueIndex:0},state:0,values:{}}),e.state++,v.NODE_NULL_RESULT;case 1:{let d=r;return d===J.PARSER_ERROR?(t.processStack.pop(),J.PARSER_ERROR):(e.values.nodeValueResult=d,t.processStack.push({type:"node-next-parse",parameter:{node:u},state:0}),e.state++,v.NODE_NULL_RESULT)}case 2:{let d=r;if(d===J.PARSER_ERROR)return t.processStack.pop(),J.PARSER_ERROR;let y=u.mergeData(e.values.nodeValueResult,d);return t.processStack.pop(),y}}throw new N(`Invalid node parse state "${e.state}".`,this)}processNodeValueParseProcess(t,e,r){let u=e.parameter.node;switch(e.state){case 0:{if(r!==v.NODE_NULL_RESULT&&r!==J.PARSER_ERROR)return e.values.parseResult=r,e.state++,v.NODE_NULL_RESULT;let d=e.parameter.valueIndex,y=u.connections;if(d>=y.values.length)return e.values.parseResult=v.NODE_VALUE_LIST_END_MEET,e.state++,v.NODE_NULL_RESULT;e.parameter.valueIndex++;let w=t.currentToken,D=y.values[d];if(typeof D=="string"){if(!w){if(y.required){let S=t.getTokenPosition();t.incidentTrace.push(`Unexpected end of statement. Token "${D}" expected.`,t.currentGraph,S.lineStart,S.columnStart,S.lineEnd,S.columnEnd)}return v.NODE_NULL_RESULT}if(D!==w.type){if(y.required){let S=t.getTokenPosition();t.incidentTrace.push(`Unexpected token "${w.value}". "${D}" expected`,t.currentGraph,S.lineStart,S.columnStart,S.lineEnd,S.columnEnd)}return v.NODE_NULL_RESULT}return t.moveNextToken(),w.value}else{let S=y.values.length===1||y.values.length===d+1;return t.processStack.push({type:"graph-parse",parameter:{graph:D,linear:S},state:0}),v.NODE_NULL_RESULT}}case 1:{let d=e.values.parseResult,y=u.connections;if(d===v.NODE_VALUE_LIST_END_MEET&&!y.required){t.processStack.pop();return}return d===v.NODE_VALUE_LIST_END_MEET?(t.processStack.pop(),J.PARSER_ERROR):(t.processStack.pop(),d)}}throw new N(`Invalid node value parse state "${e.state}".`,this)}processStack(t,e,r){switch(e.type){case"graph-parse":return this.processGraphParseProcess(t,e,r);case"node-parse":return this.processNodeParseProcess(t,e,r);case"node-value-parse":return this.processNodeValueParseProcess(t,e,r);case"node-next-parse":return this.processChainedNodeParseProcess(t,e,r)}}};var tt=class v{static define(t,e=!1){return new v(t,e)}mDataConverterList;mGraphCollector;mIsJunction;mResolvedGraphNode;get isJunction(){return this.mIsJunction}get node(){return this.mResolvedGraphNode||(this.mResolvedGraphNode=this.mGraphCollector().root),this.mResolvedGraphNode}constructor(t,e){this.mGraphCollector=t,this.mDataConverterList=new Array,this.mResolvedGraphNode=null,this.mIsJunction=e}convert(t,e){if(this.mDataConverterList.length===0)return t;let r=e.getGraphBoundingToken(),u=r[0]??void 0,d=r[1]??void 0;if(this.mDataConverterList.length===1)return this.mDataConverterList[0](t,u,d);let y=t;for(let w of this.mDataConverterList)if(y=w(y,u,d),typeof y=="symbol")return y;return y}converter(t){let e=new v(this.mGraphCollector,this.isJunction);return e.mDataConverterList.push(...this.mDataConverterList,t),e}};var X=class v{static new(){let t=new v("",!1,[]);return t.mRootNode=null,t}mConnections;mIdentifier;mRootNode;get configuration(){return{dataKey:this.mIdentifier.dataKey,isList:this.mIdentifier.type==="list",isRequired:this.mConnections.required,isBranch:this.mConnections.values.length>1}}get connections(){return this.mConnections}get root(){if(!this.mRootNode)throw new N("Staring nodes must be chained with another node to be used.",this);return this.mRootNode}constructor(t,e,r,u){if(t==="")this.mIdentifier={type:"empty",dataKey:"",mergeKey:""};else if(t.endsWith("[]"))this.mIdentifier={type:"list",mergeKey:"",dataKey:t.substring(0,t.length-2)};else if(t.includes("<-")){let y=t.split("<-");this.mIdentifier={type:"merge",dataKey:y[0],mergeKey:y[1]}}else this.mIdentifier={type:"single",mergeKey:"",dataKey:t};let d=r.map(y=>y instanceof v?tt.define(()=>y):y);this.mConnections={required:e,values:d,next:null},u?this.mRootNode=u:this.mRootNode=this}mergeData(t,e){if(this.mIdentifier.type==="empty")return e;let r=e,u=typeof t>"u";if(this.mIdentifier.type==="single"){if(this.mIdentifier.dataKey in e)throw new N(`Graph path has a duplicate value identifier "${this.mIdentifier.dataKey}"`,this);return u||(r[this.mIdentifier.dataKey]=t),e}if(this.mIdentifier.type==="list"){let w;u?w=new Array:Array.isArray(t)?w=t:w=[t];let D=(()=>{if(this.mIdentifier.dataKey in e){let S=r[this.mIdentifier.dataKey];return Array.isArray(S)?(S.unshift(...w),S):(w.push(S),w)}return w})();return r[this.mIdentifier.dataKey]=D,e}if(u)return e;let d=(()=>{if(!this.mIdentifier.mergeKey)throw new N("Cant merge data without a merge key.",this);if(typeof t!="object"||t===null)throw new N("Node data must be an object when merge key is set.",this);if(!(this.mIdentifier.mergeKey in t))throw new N(`Node data does not contain merge key "${this.mIdentifier.mergeKey}"`,this);return t[this.mIdentifier.mergeKey]})();if(typeof d>"u")return e;let y=r[this.mIdentifier.dataKey];if(typeof y>"u")return r[this.mIdentifier.dataKey]=d,r;if(!Array.isArray(y))throw new N("Chain data merge value is not an array but should be.",this);return Array.isArray(d)?y.unshift(...d):y.unshift(d),e}optional(t,e){let r=typeof e>"u"?"":t,u=typeof e>"u"?t:e,d=new Array;Array.isArray(u)?d.push(...u):d.push(u);let y=new v(r,!1,d,this.mRootNode);return this.setChainedNode(y),y}required(t,e){let r=typeof e>"u"?"":t,u=typeof e>"u"?t:e,d=new Array;Array.isArray(u)?d.push(...u):d.push(u);let y=new v(r,!0,d,this.mRootNode);return this.setChainedNode(y),y}setChainedNode(t){if(this.mConnections.next!==null)throw new N("Node can only be chained to a single node.",this);this.mConnections.next=t}};var z={XmlIdentifier:"Identifier",XmlAssignment:"XmlAssignment",XmlValue:"XmlValue",XmlComment:"XmlComment",XmlOpenClosingBracket:"XmlOpenClosingBracket",XmlCloseBracket:"XmlCloseBracket",XmlOpenBracket:"XmlOpenBracket",XmlCloseClosingBracket:"XmlCloseClosingBracket",XmlExplicitValueIdentifier:"XmlExplicitValueIdentifier",ExpressionStart:"ExpressionStart",ExpressionEnd:"ExpressionEnd",ExpressionValue:"ExpressionValue",InstructionStart:"InstructionStart",InstructionInstructionValue:"InstructionInstructionValue",InstructionBodyStartBraket:"InstructionBodyStartBraket",InstructionBodyCloseBraket:"InstructionBodyCloseBraket",InstructionInstructionClosingBracket:"InstructionInstructionClosingBracket",InstructionInstructionOpeningBracket:"InstructionInstructionOpeningBracket"};var Xe=class extends xe{constructor(){super(),this.validWhitespaces=` 
\r`,this.trimWhitespace=!0;let t=this.createTokenPattern({pattern:{regex:/(?:(?!}}).)*/,type:z.ExpressionValue}}),e=this.createTokenPattern({pattern:{start:{regex:/{{/,type:z.ExpressionStart},end:{regex:/}}[ \n\r]?/,type:z.ExpressionEnd}}},s=>{s.useChildPattern(t)}),r=this.createTokenPattern({pattern:{regex:/[^>\s\n="/]+/,type:z.XmlIdentifier}}),u=this.createTokenPattern({pattern:{regex:/(?:(?!{{|"|<).)+/,type:z.XmlValue}}),d=this.createTokenPattern({pattern:{regex:/<!--.*?-->/,type:z.XmlComment}}),y=this.createTokenPattern({pattern:{regex:/=/,type:z.XmlAssignment}}),w=this.createTokenPattern({pattern:{start:{regex:/"/,type:z.XmlExplicitValueIdentifier},end:{regex:/"/,type:z.XmlExplicitValueIdentifier}}},s=>{s.useChildPattern(e),s.useChildPattern(u)}),D=this.createTokenPattern({pattern:{start:{regex:/<\//,type:z.XmlOpenClosingBracket},end:{regex:/>/,type:z.XmlCloseBracket}}},s=>{s.useChildPattern(r)}),S=this.createTokenPattern({pattern:{start:{regex:/</,type:z.XmlOpenBracket},end:{regex:/(?<closeClosingBracket>\/>)|(?<closeBracket>>)/,type:{closeClosingBracket:z.XmlCloseClosingBracket,closeBracket:z.XmlCloseBracket}}}},s=>{s.useChildPattern(y),s.useChildPattern(r),s.useChildPattern(w)}),l=this.createTokenPattern({pattern:{regex:/[^()"'`/)]+/,type:z.InstructionInstructionValue}}),n=this.createTokenPattern({pattern:{innerType:z.InstructionInstructionValue,start:{regex:/\//,type:z.InstructionInstructionValue},end:{regex:/\//,type:z.InstructionInstructionValue}}},s=>{s.useChildPattern(c),s.useChildPattern(o),s.useChildPattern(b),s.useChildPattern(h),s.useChildPattern(l)}),h=this.createTokenPattern({pattern:{innerType:z.InstructionInstructionValue,start:{regex:/\(/,type:z.InstructionInstructionValue},end:{regex:/\)/,type:z.InstructionInstructionValue}}},s=>{s.useChildPattern(n),s.useChildPattern(c),s.useChildPattern(o),s.useChildPattern(b),s.useChildPattern(l)}),c=this.createTokenPattern({pattern:{innerType:z.InstructionInstructionValue,start:{regex:/"/,type:z.InstructionInstructionValue},end:{regex:/"/,type:z.InstructionInstructionValue}}},s=>{s.useChildPattern(n),s.useChildPattern(o),s.useChildPattern(b),s.useChildPattern(h),s.useChildPattern(l)}),o=this.createTokenPattern({pattern:{innerType:z.InstructionInstructionValue,start:{regex:/'/,type:z.InstructionInstructionValue},end:{regex:/'/,type:z.InstructionInstructionValue}}},s=>{s.useChildPattern(n),s.useChildPattern(c),s.useChildPattern(b),s.useChildPattern(h),s.useChildPattern(l)}),b=this.createTokenPattern({pattern:{innerType:z.InstructionInstructionValue,start:{regex:/`/,type:z.InstructionInstructionValue},end:{regex:/`/,type:z.InstructionInstructionValue}}},s=>{s.useChildPattern(n),s.useChildPattern(c),s.useChildPattern(o),s.useChildPattern(h),s.useChildPattern(l)}),p=this.createTokenPattern({pattern:{regex:/\$[^(\s\n/{]+/,type:z.InstructionStart}}),T=this.createTokenPattern({pattern:{start:{regex:/\(/,type:z.InstructionInstructionOpeningBracket},end:{regex:/\)/,type:z.InstructionInstructionClosingBracket}}},s=>{s.useChildPattern(n),s.useChildPattern(c),s.useChildPattern(o),s.useChildPattern(b),s.useChildPattern(h),s.useChildPattern(l)}),x=this.createTokenPattern({pattern:{start:{regex:/{/,type:z.InstructionBodyStartBraket},end:{regex:/}/,type:z.InstructionBodyCloseBraket}}},s=>{for(let f of m)s.useChildPattern(f)}),m=[d,D,S,w,e,p,T,x,u];for(let s of m)this.useRootTokenPattern(s)}};var De=class extends Te{constructor(){super(new Xe),this.initGraph()}initGraph(){let t=tt.define(()=>X.new().required(z.ExpressionStart).optional("value",z.ExpressionValue).required("end",z.ExpressionEnd)).converter(o=>({expression:new At(o.value??""),hasTrailingWhitespace:o.end.length>2})),e=tt.define(()=>{let o=e;return X.new().required("data[]",X.new().required("value",[t,X.new().required("text",z.XmlValue)])).optional("data<-data",o)}),r=tt.define(()=>X.new().required("name",z.XmlIdentifier).optional("attributeValue",X.new().required(z.XmlAssignment).required(z.XmlExplicitValueIdentifier).optional("list<-data",e).required(z.XmlExplicitValueIdentifier))).converter(o=>{let b=new Array;if(o.attributeValue?.list)for(let p of o.attributeValue.list)"expression"in p.value?(b.push(p.value.expression),p.value.hasTrailingWhitespace&&b.push(" ")):b.push(p.value.text);return{name:o.name,values:b}}),u=tt.define(()=>{let o=u;return X.new().required("data[]",r).optional("data<-data",o)}),d=tt.define(()=>{let o=d;return X.new().required("data[]",X.new().required("value",[t,X.new().required("text",z.XmlValue),X.new().required(z.XmlExplicitValueIdentifier).required("text",z.XmlValue).required(z.XmlExplicitValueIdentifier)])).optional("data<-data",o)}),y=tt.define(()=>X.new().required("list<-data",d)).converter(o=>{let b=new Lt;for(let p of o.list)"expression"in p.value?(b.addValue(p.value.expression),p.value.hasTrailingWhitespace&&b.addValue(" ")):b.addValue(p.value.text);return b}),w=tt.define(()=>X.new().required(z.XmlComment)).converter(()=>null),D=tt.define(()=>X.new().required(z.XmlOpenBracket).required("openingTagName",z.XmlIdentifier).optional("attributes<-data",u).required("closing",[X.new().required(z.XmlCloseClosingBracket),X.new().required(z.XmlCloseBracket).required("values",h).required(z.XmlOpenClosingBracket).required("closingTageName",z.XmlIdentifier).required(z.XmlCloseBracket)])).converter(o=>{if("closingTageName"in o.closing&&o.openingTagName!==o.closing.closingTageName)throw new N(`Opening (${o.openingTagName}) and closing tagname (${o.closing.closingTageName}) does not match`,this);let b=new Rt(o.openingTagName);if(o.attributes)for(let p of o.attributes)b.setAttribute(p.name).addValue(...p.values);return"values"in o.closing&&b.appendChild(...o.closing.values),b}),S=tt.define(()=>{let o=S;return X.new().required("list[]",z.InstructionInstructionValue).optional("list<-list",o)}),l=tt.define(()=>X.new().required("instructionName",z.InstructionStart).optional("instruction",X.new().required(z.InstructionInstructionOpeningBracket).required("value<-list",S).required(z.InstructionInstructionClosingBracket)).optional("body",X.new().required(z.InstructionBodyStartBraket).required("value",h).required(z.InstructionBodyCloseBraket))).converter(o=>{let b=o.instructionName.substring(1),p=o.instruction?.value.join("")??"",T=new Zt(b,p);return o.body&&T.appendChild(...o.body.value),T}),n=tt.define(()=>{let o=n;return X.new().required("list[]",[w,D,l,y]).optional("list<-list",o)}),h=tt.define(()=>{let o=n;return X.new().optional("list<-list",o)}).converter(o=>{let b=new Array;if(o.list)for(let p of o.list)p!==null&&b.push(p);return b}),c=tt.define(()=>X.new().required("content",h)).converter(o=>{let b=new ft;return b.appendChild(...o.content),b});this.setRootGraph(c)}};var G=class v extends ze{static mTemplateCache=new rt;static mXmlParser=new De;mComponentElement;mIsUpdated;mRootBuilder;get element(){return this.mComponentElement.htmlElement}constructor(t){super({constructor:t.processorConstructor,parent:null}),Q.registerComponent(this,t.htmlElement),this.setProcessorInjection(v,this),this.addConstructionHook(u=>{Q.registerComponent(this,this.mComponentElement.htmlElement,u)}),v.mTemplateCache.has(t.processorConstructor)||v.mTemplateCache.set(t.processorConstructor,v.mXmlParser.parse(t.templateString??""));let e=v.mTemplateCache.get(t.processorConstructor).clone();this.mIsUpdated=!1,this.mComponentElement=new we(t.htmlElement),this.mRootBuilder=new ee(e,new Ge(this,t.expressionModule),new pt(this),"ROOT",null),this.mComponentElement.shadowRoot.appendChild(this.mRootBuilder.anchor),this.setProcessorInjection(Pt,new Pt(this.mRootBuilder.values));let r=this.updater.zone.getAttachment(Ct.ATTACHMENT_KEY);if(r)for(let[u,d]of r.injections)this.setProcessorInjection(u,d)}addStyle(t){let e=document.createElement("style");e.innerHTML=t,this.mComponentElement.shadowRoot.prepend(e)}attributeChanged(t,e,r){this.call("onAttributeChange",t,e,r)}connected(){this.mIsUpdated||this.updater.update(),this.call("onConnect")}deconstruct(){this.call("onDeconstruct"),this.mRootBuilder.deconstruct(),super.deconstruct()}disconnected(){this.call("onDisconnect")}onUpdate(){return this.mIsUpdated||(this.mIsUpdated=!0),this.mRootBuilder.update()?(this.call("onUpdate"),!0):!1}};function B(v){return(t,e)=>{O.registerInjectable(t,e.metadata,"instanced"),Q.registerConstructor(t,v.selector);let r=class extends HTMLElement{mComponent;constructor(){super(),this.mComponent=new G({processorConstructor:t,templateString:v.template??null,expressionModule:v.expressionmodule,htmlElement:this}).setup(),v.style&&this.mComponent.addStyle(v.style)}connectedCallback(){this.mComponent.connected()}disconnectedCallback(){this.mComponent.disconnected()}};globalThis.customElements.define(v.selector,r)}}function Jt(v){return(t,e)=>{O.registerInjectable(t,e.metadata,"instanced"),ht.register($t,t,{access:v.access,targetRestrictions:v.targetRestrictions})}}function It(v){return(t,e)=>{O.registerInjectable(t,e.metadata,"instanced"),ht.register(Et,t,{access:v.access,selector:v.selector})}}function Ot(v){return(t,e)=>{O.registerInjectable(t,e.metadata,"instanced"),ht.register(Xt,t,{instructionType:v.instructionType})}}function Ks(){function v(l,n){return function(c){e(n,"addInitializer"),r(c,"An initializer"),l.push(c)}}function t(l,n,h,c,o,b,p,T,x){var m;switch(o){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var s={kind:m,name:p?"#"+n:n,static:b,private:p,metadata:T},f={v:!1};s.addInitializer=v(c,f);var i,a;if(o===0?p?(i=h.get,a=h.set):(i=function(){return this[n]},a=function(g){this[n]=g}):o===2?i=function(){return h.value}:((o===1||o===3)&&(i=function(){return h.get.call(this)}),(o===1||o===4)&&(a=function(g){h.set.call(this,g)})),p)s.access=i&&a?{get:i,set:a}:i?{get:i}:{set:a};else{if(i){var C=i;i=function(g){return arguments.length===0&&(g=this),C.call(g)}}if(a){var P=a;a=function(g,_){return arguments.length===1&&(_=g,g=this),P.call(g,_)}}var E=function(g){return n in g};s.access=i&&a?{has:E,get:i,set:a}:i?{has:E,get:i}:{has:E,set:a}}try{return l(x,s)}finally{f.v=!0}}function e(l,n){if(l.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(l,n){if(typeof l!="function")throw new TypeError(n+" must be a function")}function u(l,n){var h=typeof n;if(l===1){if(h!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(h!=="function"){var c;throw l===0?c="field":l===10?c="class":c="method",new TypeError(c+" decorators must return a function or void 0")}}function d(l,n,h,c,o,b,p,T,x){var m=h[0],s,f,i;p?o===0||o===1?s={get:h[3],set:h[4]}:o===3?s={get:h[3]}:o===4?s={set:h[3]}:s={value:h[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,c)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var a,C,P;if(typeof m=="function")a=t(m,c,s,T,o,b,p,x,i),a!==void 0&&(u(o,a),o===0?f=a:o===1?(f=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a);else for(var E=m.length-1;E>=0;E--){var g=m[E];if(a=t(g,c,s,T,o,b,p,x,i),a!==void 0){u(o,a);var _;o===0?_=a:o===1?(_=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a,_!==void 0&&(f===void 0?f=_:typeof f=="function"?f=[f,_]:f.push(_))}}if(o===0||o===1){if(f===void 0)f=function(M,I){return I};else if(typeof f!="function"){var F=f;f=function(M,I){for(var A=I,L=0;L<F.length;L++)A=F[L].call(M,A);return A}}else{var j=f;f=function(M,I){return j.call(M,I)}}l.push(f)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),p?o===1?(l.push(function(M,I){return i.get.call(M,I)}),l.push(function(M,I){return i.set.call(M,I)})):o===2?l.push(i):l.push(function(M,I){return i.call(M,I)}):Object.defineProperty(n,c,s))}function y(l,n,h){for(var c=[],o,b,p=new Map,T=new Map,x=0;x<n.length;x++){var m=n[x];if(Array.isArray(m)){var s=m[1],f=m[2],i=m.length>3,a=s>=5,C,P;if(a?(C=l,s=s-5,b=b||[],P=b):(C=l.prototype,o=o||[],P=o),s!==0&&!i){var E=a?T:p,g=E.get(f)||0;if(g===!0||g===3&&s!==4||g===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!g&&s>2?E.set(f,s):E.set(f,!0)}d(c,C,m,f,s,a,i,P,h)}}return w(c,o),w(c,b),c}function w(l,n){n&&l.push(function(h){for(var c=0;c<n.length;c++)n[c].call(h);return h})}function D(l,n,h){if(n.length>0){for(var c=[],o=l,b=l.name,p=n.length-1;p>=0;p--){var T={v:!1};try{var x=n[p](o,{kind:"class",name:b,addInitializer:v(c,T),metadata:h})}finally{T.v=!0}x!==void 0&&(u(10,x),o=x)}return[S(o,h),function(){for(var m=0;m<c.length;m++)c[m].call(o)}]}}function S(l,n){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,h,c,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var p=Object.create(b===void 0?null:b),T=y(n,h,p);return c.length||S(n,p),{e:T,get c(){return D(n,c,p)}}}}function jo(v,t,e,r){return(jo=Ks())(v,t,e,r)}function Qs(v){return v}var Vo,zo,Ee;Vo=Jt({access:q.Read,targetRestrictions:[G]});new class extends Qs{constructor(){super(Ee),zo()}static{class v{static{({c:[Ee,zo]}=jo(this,[],[Vo]))}static METADATA_USER_EVENT_LISTENER_PROPERIES="pwb:user_event_listener_properties";mEventListenerList;mTargetElement;constructor(e=O.use(G)){let r=new Array,u=e.processorConstructor;do{let d=lt.get(u).getMetadata(v.METADATA_USER_EVENT_LISTENER_PROPERIES);if(d)for(let y of d)r.push(y)}while(u=Object.getPrototypeOf(u));this.mEventListenerList=new Array,this.mTargetElement=e.element;for(let d of r){let[y,w]=d,D=Reflect.get(e.processor,y);D=D.bind(e.processor),this.mEventListenerList.push([w,D]),this.mTargetElement.addEventListener(w,D)}}onDeconstruct(){for(let e of this.mEventListenerList){let[r,u]=e;this.mTargetElement.removeEventListener(r,u)}}}}};var Ie=class extends window.Event{mValue;get value(){return this.mValue}constructor(t,e){super(t),this.mValue=e}};var Ce=class{mElement;mEventName;constructor(t,e){this.mEventName=t,this.mElement=e}dispatchEvent(t){let e=new Ie(this.mEventName,t);this.mElement.dispatchEvent(e)}};function vt(v){return(t,e)=>{if(e.static)throw new N("Event target is not for a static property.",vt);let r=new WeakMap;return{get(){if(!r.has(this)){let u=(()=>{try{return Q.ofProcessor(this).component}catch{throw new N("PwbComponentEvent target class is not a component.",this)}})();r.set(this,new Ce(v,u.element))}return r.get(this)}}}}function ks(){function v(l,n){return function(c){e(n,"addInitializer"),r(c,"An initializer"),l.push(c)}}function t(l,n,h,c,o,b,p,T,x){var m;switch(o){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var s={kind:m,name:p?"#"+n:n,static:b,private:p,metadata:T},f={v:!1};s.addInitializer=v(c,f);var i,a;if(o===0?p?(i=h.get,a=h.set):(i=function(){return this[n]},a=function(g){this[n]=g}):o===2?i=function(){return h.value}:((o===1||o===3)&&(i=function(){return h.get.call(this)}),(o===1||o===4)&&(a=function(g){h.set.call(this,g)})),p)s.access=i&&a?{get:i,set:a}:i?{get:i}:{set:a};else{if(i){var C=i;i=function(g){return arguments.length===0&&(g=this),C.call(g)}}if(a){var P=a;a=function(g,_){return arguments.length===1&&(_=g,g=this),P.call(g,_)}}var E=function(g){return n in g};s.access=i&&a?{has:E,get:i,set:a}:i?{has:E,get:i}:{has:E,set:a}}try{return l(x,s)}finally{f.v=!0}}function e(l,n){if(l.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(l,n){if(typeof l!="function")throw new TypeError(n+" must be a function")}function u(l,n){var h=typeof n;if(l===1){if(h!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(h!=="function"){var c;throw l===0?c="field":l===10?c="class":c="method",new TypeError(c+" decorators must return a function or void 0")}}function d(l,n,h,c,o,b,p,T,x){var m=h[0],s,f,i;p?o===0||o===1?s={get:h[3],set:h[4]}:o===3?s={get:h[3]}:o===4?s={set:h[3]}:s={value:h[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,c)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var a,C,P;if(typeof m=="function")a=t(m,c,s,T,o,b,p,x,i),a!==void 0&&(u(o,a),o===0?f=a:o===1?(f=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a);else for(var E=m.length-1;E>=0;E--){var g=m[E];if(a=t(g,c,s,T,o,b,p,x,i),a!==void 0){u(o,a);var _;o===0?_=a:o===1?(_=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a,_!==void 0&&(f===void 0?f=_:typeof f=="function"?f=[f,_]:f.push(_))}}if(o===0||o===1){if(f===void 0)f=function(M,I){return I};else if(typeof f!="function"){var F=f;f=function(M,I){for(var A=I,L=0;L<F.length;L++)A=F[L].call(M,A);return A}}else{var j=f;f=function(M,I){return j.call(M,I)}}l.push(f)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),p?o===1?(l.push(function(M,I){return i.get.call(M,I)}),l.push(function(M,I){return i.set.call(M,I)})):o===2?l.push(i):l.push(function(M,I){return i.call(M,I)}):Object.defineProperty(n,c,s))}function y(l,n,h){for(var c=[],o,b,p=new Map,T=new Map,x=0;x<n.length;x++){var m=n[x];if(Array.isArray(m)){var s=m[1],f=m[2],i=m.length>3,a=s>=5,C,P;if(a?(C=l,s=s-5,b=b||[],P=b):(C=l.prototype,o=o||[],P=o),s!==0&&!i){var E=a?T:p,g=E.get(f)||0;if(g===!0||g===3&&s!==4||g===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!g&&s>2?E.set(f,s):E.set(f,!0)}d(c,C,m,f,s,a,i,P,h)}}return w(c,o),w(c,b),c}function w(l,n){n&&l.push(function(h){for(var c=0;c<n.length;c++)n[c].call(h);return h})}function D(l,n,h){if(n.length>0){for(var c=[],o=l,b=l.name,p=n.length-1;p>=0;p--){var T={v:!1};try{var x=n[p](o,{kind:"class",name:b,addInitializer:v(c,T),metadata:h})}finally{T.v=!0}x!==void 0&&(u(10,x),o=x)}return[S(o,h),function(){for(var m=0;m<c.length;m++)c[m].call(o)}]}}function S(l,n){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,h,c,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var p=Object.create(b===void 0?null:b),T=y(n,h,p);return c.length||S(n,p),{e:T,get c(){return D(n,c,p)}}}}function Go(v,t,e,r){return(Go=ks())(v,t,e,r)}function ta(v){return v}var Bo,$o,Pe;Bo=Jt({access:q.ReadWrite,targetRestrictions:[G]});new class extends ta{constructor(){super(Pe),$o()}static{class v{static{({c:[Pe,$o]}=Go(this,[],[Bo]))}static METADATA_EXPORTED_PROPERTIES="pwb:exported_properties";mComponent;constructor(e=O.use(G)){this.mComponent=e;let r=new Yt,u=e.processorConstructor;do{let y=lt.get(u).getMetadata(v.METADATA_EXPORTED_PROPERTIES);y&&r.push(...y)}while(u=Object.getPrototypeOf(u));let d=new Set(r);d.size>0&&this.connectExportedProperties(d)}connectExportedProperties(e){this.exportPropertyAsAttribute(e),this.patchHtmlAttributes(e)}exportPropertyAsAttribute(e){for(let r of e){let u={};u.enumerable=!0,u.configurable=!0,delete u.value,delete u.writable,u.set=d=>{Reflect.set(this.mComponent.processor,r,d)},u.get=()=>{let d=Reflect.get(this.mComponent.processor,r);return typeof d=="function"&&(d=d.bind(this.mComponent.processor)),d},Object.defineProperty(this.mComponent.element,r,u)}}patchHtmlAttributes(e){let r=this.mComponent.element,u=r.getAttribute,d=r.setAttribute,y=(S,l,n)=>(Reflect.set(r,S,n),this.mComponent.attributeChanged(S,l,n),!0),w=new Map;new MutationObserver(S=>{for(let l of S){let n=l.attributeName,h=u.call(r,n);w.get(n)!==h&&y(n,l.oldValue,h)}}).observe(r,{attributeFilter:[...e],attributeOldValue:!0});for(let S of e)if(r.hasAttribute(S)){let l=u.call(r,S);y(S,l,l)}r.setAttribute=(S,l)=>{let n=u.call(r,S);d.call(r,S,l),e.has(S)&&(w.set(S,l.toString()),d.call(r,S,l),y(S,n,l))},r.getAttribute=S=>e.has(S)?Reflect.get(r,S):u.call(r,S)}}}};function H(v,t){if(t.static)throw new N("Event target is not for a static property.",H);let e=lt.forInternalDecorator(t.metadata),r=e.getMetadata(Pe.METADATA_EXPORTED_PROPERTIES)??new Array;r.push(t.name),e.setMetadata(Pe.METADATA_EXPORTED_PROPERTIES,r)}function yt(v){return(t,e)=>{if(e.static)throw new N("Child decorator is not for a static property.",yt);return{get(){let d=(()=>{try{return Q.ofProcessor(this).component}catch{throw new N("PwbChild target class is not a component.",this)}})().getProcessorInjection(Pt).data.store[v];return d instanceof Element?d:null}}}}function ea(){function v(l,n){return function(c){e(n,"addInitializer"),r(c,"An initializer"),l.push(c)}}function t(l,n,h,c,o,b,p,T,x){var m;switch(o){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var s={kind:m,name:p?"#"+n:n,static:b,private:p,metadata:T},f={v:!1};s.addInitializer=v(c,f);var i,a;if(o===0?p?(i=h.get,a=h.set):(i=function(){return this[n]},a=function(g){this[n]=g}):o===2?i=function(){return h.value}:((o===1||o===3)&&(i=function(){return h.get.call(this)}),(o===1||o===4)&&(a=function(g){h.set.call(this,g)})),p)s.access=i&&a?{get:i,set:a}:i?{get:i}:{set:a};else{if(i){var C=i;i=function(g){return arguments.length===0&&(g=this),C.call(g)}}if(a){var P=a;a=function(g,_){return arguments.length===1&&(_=g,g=this),P.call(g,_)}}var E=function(g){return n in g};s.access=i&&a?{has:E,get:i,set:a}:i?{has:E,get:i}:{has:E,set:a}}try{return l(x,s)}finally{f.v=!0}}function e(l,n){if(l.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(l,n){if(typeof l!="function")throw new TypeError(n+" must be a function")}function u(l,n){var h=typeof n;if(l===1){if(h!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(h!=="function"){var c;throw l===0?c="field":l===10?c="class":c="method",new TypeError(c+" decorators must return a function or void 0")}}function d(l,n,h,c,o,b,p,T,x){var m=h[0],s,f,i;p?o===0||o===1?s={get:h[3],set:h[4]}:o===3?s={get:h[3]}:o===4?s={set:h[3]}:s={value:h[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,c)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var a,C,P;if(typeof m=="function")a=t(m,c,s,T,o,b,p,x,i),a!==void 0&&(u(o,a),o===0?f=a:o===1?(f=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a);else for(var E=m.length-1;E>=0;E--){var g=m[E];if(a=t(g,c,s,T,o,b,p,x,i),a!==void 0){u(o,a);var _;o===0?_=a:o===1?(_=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a,_!==void 0&&(f===void 0?f=_:typeof f=="function"?f=[f,_]:f.push(_))}}if(o===0||o===1){if(f===void 0)f=function(M,I){return I};else if(typeof f!="function"){var F=f;f=function(M,I){for(var A=I,L=0;L<F.length;L++)A=F[L].call(M,A);return A}}else{var j=f;f=function(M,I){return j.call(M,I)}}l.push(f)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),p?o===1?(l.push(function(M,I){return i.get.call(M,I)}),l.push(function(M,I){return i.set.call(M,I)})):o===2?l.push(i):l.push(function(M,I){return i.call(M,I)}):Object.defineProperty(n,c,s))}function y(l,n,h){for(var c=[],o,b,p=new Map,T=new Map,x=0;x<n.length;x++){var m=n[x];if(Array.isArray(m)){var s=m[1],f=m[2],i=m.length>3,a=s>=5,C,P;if(a?(C=l,s=s-5,b=b||[],P=b):(C=l.prototype,o=o||[],P=o),s!==0&&!i){var E=a?T:p,g=E.get(f)||0;if(g===!0||g===3&&s!==4||g===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!g&&s>2?E.set(f,s):E.set(f,!0)}d(c,C,m,f,s,a,i,P,h)}}return w(c,o),w(c,b),c}function w(l,n){n&&l.push(function(h){for(var c=0;c<n.length;c++)n[c].call(h);return h})}function D(l,n,h){if(n.length>0){for(var c=[],o=l,b=l.name,p=n.length-1;p>=0;p--){var T={v:!1};try{var x=n[p](o,{kind:"class",name:b,addInitializer:v(c,T),metadata:h})}finally{T.v=!0}x!==void 0&&(u(10,x),o=x)}return[S(o,h),function(){for(var m=0;m<c.length;m++)c[m].call(o)}]}}function S(l,n){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,h,c,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var p=Object.create(b===void 0?null:b),T=y(n,h,p);return c.length||S(n,p),{e:T,get c(){return D(n,c,p)}}}}function Ho(v,t,e,r){return(Ho=ea())(v,t,e,r)}var Yo,Uo,oa;Yo=Ot({instructionType:"dynamic-content"});var Xo=class{static{({c:[oa,Uo]}=Ho(this,[],[Yo]))}constructor(t=O.use(ot),e=O.use(W)){this.mModuleValues=e,this.mLastTemplate=null,this.mProcedure=this.mModuleValues.createExpressionProcedure(t.value)}mLastTemplate;mModuleValues;mProcedure;onUpdate(){let t=this.mProcedure.execute();if(!t||!(t instanceof ft))throw new N("Dynamic content method has a wrong result type.",this);if(this.mLastTemplate!==null&&this.mLastTemplate.equals(t))return null;let e=t.clone();this.mLastTemplate=e;let r=new dt;return r.addElement(e,new pt(this.mModuleValues.data),null),r}static{Uo()}};function ra(){function v(l,n){return function(c){e(n,"addInitializer"),r(c,"An initializer"),l.push(c)}}function t(l,n,h,c,o,b,p,T,x){var m;switch(o){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var s={kind:m,name:p?"#"+n:n,static:b,private:p,metadata:T},f={v:!1};s.addInitializer=v(c,f);var i,a;if(o===0?p?(i=h.get,a=h.set):(i=function(){return this[n]},a=function(g){this[n]=g}):o===2?i=function(){return h.value}:((o===1||o===3)&&(i=function(){return h.get.call(this)}),(o===1||o===4)&&(a=function(g){h.set.call(this,g)})),p)s.access=i&&a?{get:i,set:a}:i?{get:i}:{set:a};else{if(i){var C=i;i=function(g){return arguments.length===0&&(g=this),C.call(g)}}if(a){var P=a;a=function(g,_){return arguments.length===1&&(_=g,g=this),P.call(g,_)}}var E=function(g){return n in g};s.access=i&&a?{has:E,get:i,set:a}:i?{has:E,get:i}:{has:E,set:a}}try{return l(x,s)}finally{f.v=!0}}function e(l,n){if(l.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(l,n){if(typeof l!="function")throw new TypeError(n+" must be a function")}function u(l,n){var h=typeof n;if(l===1){if(h!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(h!=="function"){var c;throw l===0?c="field":l===10?c="class":c="method",new TypeError(c+" decorators must return a function or void 0")}}function d(l,n,h,c,o,b,p,T,x){var m=h[0],s,f,i;p?o===0||o===1?s={get:h[3],set:h[4]}:o===3?s={get:h[3]}:o===4?s={set:h[3]}:s={value:h[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,c)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var a,C,P;if(typeof m=="function")a=t(m,c,s,T,o,b,p,x,i),a!==void 0&&(u(o,a),o===0?f=a:o===1?(f=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a);else for(var E=m.length-1;E>=0;E--){var g=m[E];if(a=t(g,c,s,T,o,b,p,x,i),a!==void 0){u(o,a);var _;o===0?_=a:o===1?(_=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a,_!==void 0&&(f===void 0?f=_:typeof f=="function"?f=[f,_]:f.push(_))}}if(o===0||o===1){if(f===void 0)f=function(M,I){return I};else if(typeof f!="function"){var F=f;f=function(M,I){for(var A=I,L=0;L<F.length;L++)A=F[L].call(M,A);return A}}else{var j=f;f=function(M,I){return j.call(M,I)}}l.push(f)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),p?o===1?(l.push(function(M,I){return i.get.call(M,I)}),l.push(function(M,I){return i.set.call(M,I)})):o===2?l.push(i):l.push(function(M,I){return i.call(M,I)}):Object.defineProperty(n,c,s))}function y(l,n,h){for(var c=[],o,b,p=new Map,T=new Map,x=0;x<n.length;x++){var m=n[x];if(Array.isArray(m)){var s=m[1],f=m[2],i=m.length>3,a=s>=5,C,P;if(a?(C=l,s=s-5,b=b||[],P=b):(C=l.prototype,o=o||[],P=o),s!==0&&!i){var E=a?T:p,g=E.get(f)||0;if(g===!0||g===3&&s!==4||g===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!g&&s>2?E.set(f,s):E.set(f,!0)}d(c,C,m,f,s,a,i,P,h)}}return w(c,o),w(c,b),c}function w(l,n){n&&l.push(function(h){for(var c=0;c<n.length;c++)n[c].call(h);return h})}function D(l,n,h){if(n.length>0){for(var c=[],o=l,b=l.name,p=n.length-1;p>=0;p--){var T={v:!1};try{var x=n[p](o,{kind:"class",name:b,addInitializer:v(c,T),metadata:h})}finally{T.v=!0}x!==void 0&&(u(10,x),o=x)}return[S(o,h),function(){for(var m=0;m<c.length;m++)c[m].call(o)}]}}function S(l,n){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,h,c,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var p=Object.create(b===void 0?null:b),T=y(n,h,p);return c.length||S(n,p),{e:T,get c(){return D(n,c,p)}}}}function qo(v,t,e,r){return(qo=ra())(v,t,e,r)}var Jo,Wo,na;Jo=It({access:q.Write,selector:/^\([[\w\-$]+\)$/});var Zo=class{static{({c:[na,Wo]}=qo(this,[],[Jo]))}constructor(t=O.use(k),e=O.use(W),r=O.use(it)){this.mTarget=t,this.mEventName=r.name.substring(1,r.name.length-1);let u=e.createExpressionProcedure(r.value,["$event"]);this.mListener=d=>{u.setTemporaryValue("$event",d),u.execute()},this.mTarget.addEventListener(this.mEventName,this.mListener)}mEventName;mListener;mTarget;onDeconstruct(){this.mTarget.removeEventListener(this.mEventName,this.mListener)}static{Wo()}};function ia(){function v(l,n){return function(c){e(n,"addInitializer"),r(c,"An initializer"),l.push(c)}}function t(l,n,h,c,o,b,p,T,x){var m;switch(o){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var s={kind:m,name:p?"#"+n:n,static:b,private:p,metadata:T},f={v:!1};s.addInitializer=v(c,f);var i,a;if(o===0?p?(i=h.get,a=h.set):(i=function(){return this[n]},a=function(g){this[n]=g}):o===2?i=function(){return h.value}:((o===1||o===3)&&(i=function(){return h.get.call(this)}),(o===1||o===4)&&(a=function(g){h.set.call(this,g)})),p)s.access=i&&a?{get:i,set:a}:i?{get:i}:{set:a};else{if(i){var C=i;i=function(g){return arguments.length===0&&(g=this),C.call(g)}}if(a){var P=a;a=function(g,_){return arguments.length===1&&(_=g,g=this),P.call(g,_)}}var E=function(g){return n in g};s.access=i&&a?{has:E,get:i,set:a}:i?{has:E,get:i}:{has:E,set:a}}try{return l(x,s)}finally{f.v=!0}}function e(l,n){if(l.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(l,n){if(typeof l!="function")throw new TypeError(n+" must be a function")}function u(l,n){var h=typeof n;if(l===1){if(h!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(h!=="function"){var c;throw l===0?c="field":l===10?c="class":c="method",new TypeError(c+" decorators must return a function or void 0")}}function d(l,n,h,c,o,b,p,T,x){var m=h[0],s,f,i;p?o===0||o===1?s={get:h[3],set:h[4]}:o===3?s={get:h[3]}:o===4?s={set:h[3]}:s={value:h[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,c)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var a,C,P;if(typeof m=="function")a=t(m,c,s,T,o,b,p,x,i),a!==void 0&&(u(o,a),o===0?f=a:o===1?(f=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a);else for(var E=m.length-1;E>=0;E--){var g=m[E];if(a=t(g,c,s,T,o,b,p,x,i),a!==void 0){u(o,a);var _;o===0?_=a:o===1?(_=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a,_!==void 0&&(f===void 0?f=_:typeof f=="function"?f=[f,_]:f.push(_))}}if(o===0||o===1){if(f===void 0)f=function(M,I){return I};else if(typeof f!="function"){var F=f;f=function(M,I){for(var A=I,L=0;L<F.length;L++)A=F[L].call(M,A);return A}}else{var j=f;f=function(M,I){return j.call(M,I)}}l.push(f)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),p?o===1?(l.push(function(M,I){return i.get.call(M,I)}),l.push(function(M,I){return i.set.call(M,I)})):o===2?l.push(i):l.push(function(M,I){return i.call(M,I)}):Object.defineProperty(n,c,s))}function y(l,n,h){for(var c=[],o,b,p=new Map,T=new Map,x=0;x<n.length;x++){var m=n[x];if(Array.isArray(m)){var s=m[1],f=m[2],i=m.length>3,a=s>=5,C,P;if(a?(C=l,s=s-5,b=b||[],P=b):(C=l.prototype,o=o||[],P=o),s!==0&&!i){var E=a?T:p,g=E.get(f)||0;if(g===!0||g===3&&s!==4||g===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!g&&s>2?E.set(f,s):E.set(f,!0)}d(c,C,m,f,s,a,i,P,h)}}return w(c,o),w(c,b),c}function w(l,n){n&&l.push(function(h){for(var c=0;c<n.length;c++)n[c].call(h);return h})}function D(l,n,h){if(n.length>0){for(var c=[],o=l,b=l.name,p=n.length-1;p>=0;p--){var T={v:!1};try{var x=n[p](o,{kind:"class",name:b,addInitializer:v(c,T),metadata:h})}finally{T.v=!0}x!==void 0&&(u(10,x),o=x)}return[S(o,h),function(){for(var m=0;m<c.length;m++)c[m].call(o)}]}}function S(l,n){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,h,c,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var p=Object.create(b===void 0?null:b),T=y(n,h,p);return c.length||S(n,p),{e:T,get c(){return D(n,c,p)}}}}function ko(v,t,e,r){return(ko=ia())(v,t,e,r)}function sa(v){return v}var tr,Ko,Qo;tr=Ot({instructionType:"for"});new class extends sa{constructor(){super(Qo),Ko()}static{class v{static{({c:[Qo,Ko]}=ko(this,[],[tr]))}static REGEX_HEAD=new RegExp(/^\s*([a-zA-Z]+[a-zA-Z0-9]*)\s*of\s+([^;]+)\s*(?:;(.*))?$/);static REGEX_MODIFIER_INSTRUCTION=new RegExp(/^\s*(\$?[a-zA-Z]+[a-zA-Z0-9]*)\s*=\s*(.+?)\s*$/);mExpression;mLastEntries;mModuleValues;mTemplate;constructor(e=O.use(gt),r=O.use(W),u=O.use(ot)){this.mTemplate=e,this.mModuleValues=r,this.mLastEntries=new Array;let d=u.value,y=v.REGEX_HEAD.exec(d);if(!y)throw new N(`For-Parameter value has wrong format: ${d}`,this);let w=y[1],D=y[2],S=y[3]?y[3].split(";"):new Array,l=new Array;for(let n of S){let h=v.REGEX_MODIFIER_INSTRUCTION.exec(n);if(!h)throw new N(`For-Parameter optional instruction has wrong format: ${n}`,this);l.push({variableName:h[1],procedure:this.mModuleValues.createExpressionProcedure(h[2],["$index",w])})}this.mExpression={iterateVariableName:w,iterateValueProcedure:this.mModuleValues.createExpressionProcedure(D),modifier:l}}onUpdate(){let e=new dt,r=this.mExpression.iterateValueProcedure.execute();if(typeof r=="object"&&r!==null||Array.isArray(r)){let u=Symbol.iterator in r?Object.entries([...r]):Object.entries(r);if(this.compareEntries(u,this.mLastEntries))return null;this.mLastEntries=u;for(let[d,y]of u)this.addTemplateForElement(e,this.mExpression,y,d);return e}else return null}addTemplateForElement=(e,r,u,d)=>{let y=new pt(this.mModuleValues.data);y.setTemporaryValue(r.iterateVariableName,u);let w=u;for(let S of r.modifier){S.procedure.setTemporaryValue("$index",d),S.procedure.setTemporaryValue(r.iterateVariableName,u);let l=S.procedure.execute();if(S.variableName==="$key"){w=l;continue}y.setTemporaryValue(S.variableName,l)}let D=new ft;D.appendChild(...this.mTemplate.childList),e.addElement(D,y,w)};compareEntries(e,r){if(e.length!==r.length)return!1;for(let u=0;u<e.length;u++){let[d,y]=e[u],[w,D]=r[u];if(d!==w||y!==D)return!1}return!0}}}};function aa(){function v(l,n){return function(c){e(n,"addInitializer"),r(c,"An initializer"),l.push(c)}}function t(l,n,h,c,o,b,p,T,x){var m;switch(o){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var s={kind:m,name:p?"#"+n:n,static:b,private:p,metadata:T},f={v:!1};s.addInitializer=v(c,f);var i,a;if(o===0?p?(i=h.get,a=h.set):(i=function(){return this[n]},a=function(g){this[n]=g}):o===2?i=function(){return h.value}:((o===1||o===3)&&(i=function(){return h.get.call(this)}),(o===1||o===4)&&(a=function(g){h.set.call(this,g)})),p)s.access=i&&a?{get:i,set:a}:i?{get:i}:{set:a};else{if(i){var C=i;i=function(g){return arguments.length===0&&(g=this),C.call(g)}}if(a){var P=a;a=function(g,_){return arguments.length===1&&(_=g,g=this),P.call(g,_)}}var E=function(g){return n in g};s.access=i&&a?{has:E,get:i,set:a}:i?{has:E,get:i}:{has:E,set:a}}try{return l(x,s)}finally{f.v=!0}}function e(l,n){if(l.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(l,n){if(typeof l!="function")throw new TypeError(n+" must be a function")}function u(l,n){var h=typeof n;if(l===1){if(h!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(h!=="function"){var c;throw l===0?c="field":l===10?c="class":c="method",new TypeError(c+" decorators must return a function or void 0")}}function d(l,n,h,c,o,b,p,T,x){var m=h[0],s,f,i;p?o===0||o===1?s={get:h[3],set:h[4]}:o===3?s={get:h[3]}:o===4?s={set:h[3]}:s={value:h[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,c)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var a,C,P;if(typeof m=="function")a=t(m,c,s,T,o,b,p,x,i),a!==void 0&&(u(o,a),o===0?f=a:o===1?(f=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a);else for(var E=m.length-1;E>=0;E--){var g=m[E];if(a=t(g,c,s,T,o,b,p,x,i),a!==void 0){u(o,a);var _;o===0?_=a:o===1?(_=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a,_!==void 0&&(f===void 0?f=_:typeof f=="function"?f=[f,_]:f.push(_))}}if(o===0||o===1){if(f===void 0)f=function(M,I){return I};else if(typeof f!="function"){var F=f;f=function(M,I){for(var A=I,L=0;L<F.length;L++)A=F[L].call(M,A);return A}}else{var j=f;f=function(M,I){return j.call(M,I)}}l.push(f)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),p?o===1?(l.push(function(M,I){return i.get.call(M,I)}),l.push(function(M,I){return i.set.call(M,I)})):o===2?l.push(i):l.push(function(M,I){return i.call(M,I)}):Object.defineProperty(n,c,s))}function y(l,n,h){for(var c=[],o,b,p=new Map,T=new Map,x=0;x<n.length;x++){var m=n[x];if(Array.isArray(m)){var s=m[1],f=m[2],i=m.length>3,a=s>=5,C,P;if(a?(C=l,s=s-5,b=b||[],P=b):(C=l.prototype,o=o||[],P=o),s!==0&&!i){var E=a?T:p,g=E.get(f)||0;if(g===!0||g===3&&s!==4||g===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!g&&s>2?E.set(f,s):E.set(f,!0)}d(c,C,m,f,s,a,i,P,h)}}return w(c,o),w(c,b),c}function w(l,n){n&&l.push(function(h){for(var c=0;c<n.length;c++)n[c].call(h);return h})}function D(l,n,h){if(n.length>0){for(var c=[],o=l,b=l.name,p=n.length-1;p>=0;p--){var T={v:!1};try{var x=n[p](o,{kind:"class",name:b,addInitializer:v(c,T),metadata:h})}finally{T.v=!0}x!==void 0&&(u(10,x),o=x)}return[S(o,h),function(){for(var m=0;m<c.length;m++)c[m].call(o)}]}}function S(l,n){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,h,c,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var p=Object.create(b===void 0?null:b),T=y(n,h,p);return c.length||S(n,p),{e:T,get c(){return D(n,c,p)}}}}function rr(v,t,e,r){return(rr=aa())(v,t,e,r)}var nr,er,la;nr=Ot({instructionType:"if"});var or=class{static{({c:[la,er]}=rr(this,[],[nr]))}constructor(t=O.use(gt),e=O.use(W),r=O.use(ot)){this.mTemplateReference=t,this.mModuleValues=e,this.mProcedure=this.mModuleValues.createExpressionProcedure(r.value),this.mLastBoolean=!1}mLastBoolean;mModuleValues;mProcedure;mTemplateReference;onUpdate(){let t=this.mProcedure.execute();if(!!t!==this.mLastBoolean){this.mLastBoolean=!!t;let e=new dt;if(t){let r=new ft;r.appendChild(...this.mTemplateReference.childList),e.addElement(r,new pt(this.mModuleValues.data),null)}return e}else return null}static{er()}};function ca(){function v(l,n){return function(c){e(n,"addInitializer"),r(c,"An initializer"),l.push(c)}}function t(l,n,h,c,o,b,p,T,x){var m;switch(o){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var s={kind:m,name:p?"#"+n:n,static:b,private:p,metadata:T},f={v:!1};s.addInitializer=v(c,f);var i,a;if(o===0?p?(i=h.get,a=h.set):(i=function(){return this[n]},a=function(g){this[n]=g}):o===2?i=function(){return h.value}:((o===1||o===3)&&(i=function(){return h.get.call(this)}),(o===1||o===4)&&(a=function(g){h.set.call(this,g)})),p)s.access=i&&a?{get:i,set:a}:i?{get:i}:{set:a};else{if(i){var C=i;i=function(g){return arguments.length===0&&(g=this),C.call(g)}}if(a){var P=a;a=function(g,_){return arguments.length===1&&(_=g,g=this),P.call(g,_)}}var E=function(g){return n in g};s.access=i&&a?{has:E,get:i,set:a}:i?{has:E,get:i}:{has:E,set:a}}try{return l(x,s)}finally{f.v=!0}}function e(l,n){if(l.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(l,n){if(typeof l!="function")throw new TypeError(n+" must be a function")}function u(l,n){var h=typeof n;if(l===1){if(h!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(h!=="function"){var c;throw l===0?c="field":l===10?c="class":c="method",new TypeError(c+" decorators must return a function or void 0")}}function d(l,n,h,c,o,b,p,T,x){var m=h[0],s,f,i;p?o===0||o===1?s={get:h[3],set:h[4]}:o===3?s={get:h[3]}:o===4?s={set:h[3]}:s={value:h[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,c)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var a,C,P;if(typeof m=="function")a=t(m,c,s,T,o,b,p,x,i),a!==void 0&&(u(o,a),o===0?f=a:o===1?(f=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a);else for(var E=m.length-1;E>=0;E--){var g=m[E];if(a=t(g,c,s,T,o,b,p,x,i),a!==void 0){u(o,a);var _;o===0?_=a:o===1?(_=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a,_!==void 0&&(f===void 0?f=_:typeof f=="function"?f=[f,_]:f.push(_))}}if(o===0||o===1){if(f===void 0)f=function(M,I){return I};else if(typeof f!="function"){var F=f;f=function(M,I){for(var A=I,L=0;L<F.length;L++)A=F[L].call(M,A);return A}}else{var j=f;f=function(M,I){return j.call(M,I)}}l.push(f)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),p?o===1?(l.push(function(M,I){return i.get.call(M,I)}),l.push(function(M,I){return i.set.call(M,I)})):o===2?l.push(i):l.push(function(M,I){return i.call(M,I)}):Object.defineProperty(n,c,s))}function y(l,n,h){for(var c=[],o,b,p=new Map,T=new Map,x=0;x<n.length;x++){var m=n[x];if(Array.isArray(m)){var s=m[1],f=m[2],i=m.length>3,a=s>=5,C,P;if(a?(C=l,s=s-5,b=b||[],P=b):(C=l.prototype,o=o||[],P=o),s!==0&&!i){var E=a?T:p,g=E.get(f)||0;if(g===!0||g===3&&s!==4||g===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!g&&s>2?E.set(f,s):E.set(f,!0)}d(c,C,m,f,s,a,i,P,h)}}return w(c,o),w(c,b),c}function w(l,n){n&&l.push(function(h){for(var c=0;c<n.length;c++)n[c].call(h);return h})}function D(l,n,h){if(n.length>0){for(var c=[],o=l,b=l.name,p=n.length-1;p>=0;p--){var T={v:!1};try{var x=n[p](o,{kind:"class",name:b,addInitializer:v(c,T),metadata:h})}finally{T.v=!0}x!==void 0&&(u(10,x),o=x)}return[S(o,h),function(){for(var m=0;m<c.length;m++)c[m].call(o)}]}}function S(l,n){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,h,c,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var p=Object.create(b===void 0?null:b),T=y(n,h,p);return c.length||S(n,p),{e:T,get c(){return D(n,c,p)}}}}function ar(v,t,e,r){return(ar=ca())(v,t,e,r)}var lr,ir,ua;lr=It({access:q.Read,selector:/^\[[\w$]+\]$/});var sr=class{static{({c:[ua,ir]}=ar(this,[],[lr]))}constructor(t=O.use(k),e=O.use(W),r=O.use(it)){this.mTarget=t,this.mProcedure=e.createExpressionProcedure(r.value),this.mTargetProperty=r.name.substring(1,r.name.length-1),this.mLastValue=Symbol("Uncomparable")}mLastValue;mProcedure;mTarget;mTargetProperty;onUpdate(){let t=this.mProcedure.execute();return t===this.mLastValue?!1:(this.mLastValue=t,Reflect.set(this.mTarget,this.mTargetProperty,t),!0)}static{ir()}};function ha(){function v(l,n){return function(c){e(n,"addInitializer"),r(c,"An initializer"),l.push(c)}}function t(l,n,h,c,o,b,p,T,x){var m;switch(o){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var s={kind:m,name:p?"#"+n:n,static:b,private:p,metadata:T},f={v:!1};s.addInitializer=v(c,f);var i,a;if(o===0?p?(i=h.get,a=h.set):(i=function(){return this[n]},a=function(g){this[n]=g}):o===2?i=function(){return h.value}:((o===1||o===3)&&(i=function(){return h.get.call(this)}),(o===1||o===4)&&(a=function(g){h.set.call(this,g)})),p)s.access=i&&a?{get:i,set:a}:i?{get:i}:{set:a};else{if(i){var C=i;i=function(g){return arguments.length===0&&(g=this),C.call(g)}}if(a){var P=a;a=function(g,_){return arguments.length===1&&(_=g,g=this),P.call(g,_)}}var E=function(g){return n in g};s.access=i&&a?{has:E,get:i,set:a}:i?{has:E,get:i}:{has:E,set:a}}try{return l(x,s)}finally{f.v=!0}}function e(l,n){if(l.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(l,n){if(typeof l!="function")throw new TypeError(n+" must be a function")}function u(l,n){var h=typeof n;if(l===1){if(h!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(h!=="function"){var c;throw l===0?c="field":l===10?c="class":c="method",new TypeError(c+" decorators must return a function or void 0")}}function d(l,n,h,c,o,b,p,T,x){var m=h[0],s,f,i;p?o===0||o===1?s={get:h[3],set:h[4]}:o===3?s={get:h[3]}:o===4?s={set:h[3]}:s={value:h[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,c)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var a,C,P;if(typeof m=="function")a=t(m,c,s,T,o,b,p,x,i),a!==void 0&&(u(o,a),o===0?f=a:o===1?(f=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a);else for(var E=m.length-1;E>=0;E--){var g=m[E];if(a=t(g,c,s,T,o,b,p,x,i),a!==void 0){u(o,a);var _;o===0?_=a:o===1?(_=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a,_!==void 0&&(f===void 0?f=_:typeof f=="function"?f=[f,_]:f.push(_))}}if(o===0||o===1){if(f===void 0)f=function(M,I){return I};else if(typeof f!="function"){var F=f;f=function(M,I){for(var A=I,L=0;L<F.length;L++)A=F[L].call(M,A);return A}}else{var j=f;f=function(M,I){return j.call(M,I)}}l.push(f)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),p?o===1?(l.push(function(M,I){return i.get.call(M,I)}),l.push(function(M,I){return i.set.call(M,I)})):o===2?l.push(i):l.push(function(M,I){return i.call(M,I)}):Object.defineProperty(n,c,s))}function y(l,n,h){for(var c=[],o,b,p=new Map,T=new Map,x=0;x<n.length;x++){var m=n[x];if(Array.isArray(m)){var s=m[1],f=m[2],i=m.length>3,a=s>=5,C,P;if(a?(C=l,s=s-5,b=b||[],P=b):(C=l.prototype,o=o||[],P=o),s!==0&&!i){var E=a?T:p,g=E.get(f)||0;if(g===!0||g===3&&s!==4||g===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!g&&s>2?E.set(f,s):E.set(f,!0)}d(c,C,m,f,s,a,i,P,h)}}return w(c,o),w(c,b),c}function w(l,n){n&&l.push(function(h){for(var c=0;c<n.length;c++)n[c].call(h);return h})}function D(l,n,h){if(n.length>0){for(var c=[],o=l,b=l.name,p=n.length-1;p>=0;p--){var T={v:!1};try{var x=n[p](o,{kind:"class",name:b,addInitializer:v(c,T),metadata:h})}finally{T.v=!0}x!==void 0&&(u(10,x),o=x)}return[S(o,h),function(){for(var m=0;m<c.length;m++)c[m].call(o)}]}}function S(l,n){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,h,c,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var p=Object.create(b===void 0?null:b),T=y(n,h,p);return c.length||S(n,p),{e:T,get c(){return D(n,c,p)}}}}function hr(v,t,e,r){return(hr=ha())(v,t,e,r)}var fr,cr,fa;fr=It({access:q.Write,selector:/^#[[\w$]+$/});var ur=class{static{({c:[fa,cr]}=hr(this,[],[fr]))}constructor(t=O.use(k),e=O.use(it),r=O.use(Pt)){this.mChildName=e.name.substring(1),this.mComponentScopeValue=r,this.mTargetNode=t,this.mComponentScopeValue.setTemporaryValue(this.mChildName,this.mTargetNode)}mChildName;mComponentScopeValue;mTargetNode;onDeconstruct(){this.mComponentScopeValue.data.store[this.mChildName]===this.mTargetNode&&this.mComponentScopeValue.data.deleteTemporaryValue(this.mChildName)}static{cr()}};function da(){function v(l,n){return function(c){e(n,"addInitializer"),r(c,"An initializer"),l.push(c)}}function t(l,n,h,c,o,b,p,T,x){var m;switch(o){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var s={kind:m,name:p?"#"+n:n,static:b,private:p,metadata:T},f={v:!1};s.addInitializer=v(c,f);var i,a;if(o===0?p?(i=h.get,a=h.set):(i=function(){return this[n]},a=function(g){this[n]=g}):o===2?i=function(){return h.value}:((o===1||o===3)&&(i=function(){return h.get.call(this)}),(o===1||o===4)&&(a=function(g){h.set.call(this,g)})),p)s.access=i&&a?{get:i,set:a}:i?{get:i}:{set:a};else{if(i){var C=i;i=function(g){return arguments.length===0&&(g=this),C.call(g)}}if(a){var P=a;a=function(g,_){return arguments.length===1&&(_=g,g=this),P.call(g,_)}}var E=function(g){return n in g};s.access=i&&a?{has:E,get:i,set:a}:i?{has:E,get:i}:{has:E,set:a}}try{return l(x,s)}finally{f.v=!0}}function e(l,n){if(l.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(l,n){if(typeof l!="function")throw new TypeError(n+" must be a function")}function u(l,n){var h=typeof n;if(l===1){if(h!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(h!=="function"){var c;throw l===0?c="field":l===10?c="class":c="method",new TypeError(c+" decorators must return a function or void 0")}}function d(l,n,h,c,o,b,p,T,x){var m=h[0],s,f,i;p?o===0||o===1?s={get:h[3],set:h[4]}:o===3?s={get:h[3]}:o===4?s={set:h[3]}:s={value:h[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,c)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var a,C,P;if(typeof m=="function")a=t(m,c,s,T,o,b,p,x,i),a!==void 0&&(u(o,a),o===0?f=a:o===1?(f=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a);else for(var E=m.length-1;E>=0;E--){var g=m[E];if(a=t(g,c,s,T,o,b,p,x,i),a!==void 0){u(o,a);var _;o===0?_=a:o===1?(_=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a,_!==void 0&&(f===void 0?f=_:typeof f=="function"?f=[f,_]:f.push(_))}}if(o===0||o===1){if(f===void 0)f=function(M,I){return I};else if(typeof f!="function"){var F=f;f=function(M,I){for(var A=I,L=0;L<F.length;L++)A=F[L].call(M,A);return A}}else{var j=f;f=function(M,I){return j.call(M,I)}}l.push(f)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),p?o===1?(l.push(function(M,I){return i.get.call(M,I)}),l.push(function(M,I){return i.set.call(M,I)})):o===2?l.push(i):l.push(function(M,I){return i.call(M,I)}):Object.defineProperty(n,c,s))}function y(l,n,h){for(var c=[],o,b,p=new Map,T=new Map,x=0;x<n.length;x++){var m=n[x];if(Array.isArray(m)){var s=m[1],f=m[2],i=m.length>3,a=s>=5,C,P;if(a?(C=l,s=s-5,b=b||[],P=b):(C=l.prototype,o=o||[],P=o),s!==0&&!i){var E=a?T:p,g=E.get(f)||0;if(g===!0||g===3&&s!==4||g===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!g&&s>2?E.set(f,s):E.set(f,!0)}d(c,C,m,f,s,a,i,P,h)}}return w(c,o),w(c,b),c}function w(l,n){n&&l.push(function(h){for(var c=0;c<n.length;c++)n[c].call(h);return h})}function D(l,n,h){if(n.length>0){for(var c=[],o=l,b=l.name,p=n.length-1;p>=0;p--){var T={v:!1};try{var x=n[p](o,{kind:"class",name:b,addInitializer:v(c,T),metadata:h})}finally{T.v=!0}x!==void 0&&(u(10,x),o=x)}return[S(o,h),function(){for(var m=0;m<c.length;m++)c[m].call(o)}]}}function S(l,n){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,h,c,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var p=Object.create(b===void 0?null:b),T=y(n,h,p);return c.length||S(n,p),{e:T,get c(){return D(n,c,p)}}}}function pr(v,t,e,r){return(pr=da())(v,t,e,r)}var gr,dr,ma;gr=Ot({instructionType:"slot"});var mr=class{static{({c:[ma,dr]}=pr(this,[],[gr]))}constructor(t=O.use(W),e=O.use(ot)){this.mModuleValues=t,this.mSlotName=e.value,this.mIsSetup=!1}mIsSetup;mModuleValues;mSlotName;onUpdate(){if(this.mIsSetup)return null;this.mIsSetup=!0;let t=new Rt("slot");this.mSlotName!==""&&t.setAttribute("name").addValue(this.mSlotName);let e=new ft;e.appendChild(t);let r=new dt;return r.addElement(e,this.mModuleValues.data,null),r}static{dr()}};function pa(){function v(l,n){return function(c){e(n,"addInitializer"),r(c,"An initializer"),l.push(c)}}function t(l,n,h,c,o,b,p,T,x){var m;switch(o){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var s={kind:m,name:p?"#"+n:n,static:b,private:p,metadata:T},f={v:!1};s.addInitializer=v(c,f);var i,a;if(o===0?p?(i=h.get,a=h.set):(i=function(){return this[n]},a=function(g){this[n]=g}):o===2?i=function(){return h.value}:((o===1||o===3)&&(i=function(){return h.get.call(this)}),(o===1||o===4)&&(a=function(g){h.set.call(this,g)})),p)s.access=i&&a?{get:i,set:a}:i?{get:i}:{set:a};else{if(i){var C=i;i=function(g){return arguments.length===0&&(g=this),C.call(g)}}if(a){var P=a;a=function(g,_){return arguments.length===1&&(_=g,g=this),P.call(g,_)}}var E=function(g){return n in g};s.access=i&&a?{has:E,get:i,set:a}:i?{has:E,get:i}:{has:E,set:a}}try{return l(x,s)}finally{f.v=!0}}function e(l,n){if(l.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(l,n){if(typeof l!="function")throw new TypeError(n+" must be a function")}function u(l,n){var h=typeof n;if(l===1){if(h!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(h!=="function"){var c;throw l===0?c="field":l===10?c="class":c="method",new TypeError(c+" decorators must return a function or void 0")}}function d(l,n,h,c,o,b,p,T,x){var m=h[0],s,f,i;p?o===0||o===1?s={get:h[3],set:h[4]}:o===3?s={get:h[3]}:o===4?s={set:h[3]}:s={value:h[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,c)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var a,C,P;if(typeof m=="function")a=t(m,c,s,T,o,b,p,x,i),a!==void 0&&(u(o,a),o===0?f=a:o===1?(f=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a);else for(var E=m.length-1;E>=0;E--){var g=m[E];if(a=t(g,c,s,T,o,b,p,x,i),a!==void 0){u(o,a);var _;o===0?_=a:o===1?(_=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a,_!==void 0&&(f===void 0?f=_:typeof f=="function"?f=[f,_]:f.push(_))}}if(o===0||o===1){if(f===void 0)f=function(M,I){return I};else if(typeof f!="function"){var F=f;f=function(M,I){for(var A=I,L=0;L<F.length;L++)A=F[L].call(M,A);return A}}else{var j=f;f=function(M,I){return j.call(M,I)}}l.push(f)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),p?o===1?(l.push(function(M,I){return i.get.call(M,I)}),l.push(function(M,I){return i.set.call(M,I)})):o===2?l.push(i):l.push(function(M,I){return i.call(M,I)}):Object.defineProperty(n,c,s))}function y(l,n,h){for(var c=[],o,b,p=new Map,T=new Map,x=0;x<n.length;x++){var m=n[x];if(Array.isArray(m)){var s=m[1],f=m[2],i=m.length>3,a=s>=5,C,P;if(a?(C=l,s=s-5,b=b||[],P=b):(C=l.prototype,o=o||[],P=o),s!==0&&!i){var E=a?T:p,g=E.get(f)||0;if(g===!0||g===3&&s!==4||g===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!g&&s>2?E.set(f,s):E.set(f,!0)}d(c,C,m,f,s,a,i,P,h)}}return w(c,o),w(c,b),c}function w(l,n){n&&l.push(function(h){for(var c=0;c<n.length;c++)n[c].call(h);return h})}function D(l,n,h){if(n.length>0){for(var c=[],o=l,b=l.name,p=n.length-1;p>=0;p--){var T={v:!1};try{var x=n[p](o,{kind:"class",name:b,addInitializer:v(c,T),metadata:h})}finally{T.v=!0}x!==void 0&&(u(10,x),o=x)}return[S(o,h),function(){for(var m=0;m<c.length;m++)c[m].call(o)}]}}function S(l,n){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,h,c,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var p=Object.create(b===void 0?null:b),T=y(n,h,p);return c.length||S(n,p),{e:T,get c(){return D(n,c,p)}}}}function br(v,t,e,r){return(br=pa())(v,t,e,r)}var wr,vr,ga;wr=It({access:q.ReadWrite,selector:/^\[\([[\w$]+\)\]$/});var yr=class{static{({c:[ga,vr]}=br(this,[],[wr]))}constructor(t=O.use(G),e=O.use(k),r=O.use(W),u=O.use(it)){this.mTargetNode=e,this.mAttributeKey=u.name.substring(2,u.name.length-2),this.mReadProcedure=r.createExpressionProcedure(u.value),this.mWriteProcedure=r.createExpressionProcedure(`${u.value} = $DATA;`,["$DATA"]),this.mLastDataValue=Symbol("Uncomparable");let d=y=>{this.mLastDataValue!==y&&t.updater.updateAsync()};this.mTargetNode.addEventListener("input",y=>{d(Reflect.get(this.mTargetNode,this.mAttributeKey))}),this.mTargetNode.addEventListener("change",y=>{d(Reflect.get(this.mTargetNode,this.mAttributeKey))})}mAttributeKey;mLastDataValue;mReadProcedure;mTargetNode;mWriteProcedure;onUpdate(){let t=this.mReadProcedure.execute();if(t!==this.mLastDataValue)return Reflect.set(this.mTargetNode,this.mAttributeKey,t),this.mLastDataValue=t,!0;let e=Reflect.get(this.mTargetNode,this.mAttributeKey);return e!==t?(this.mWriteProcedure.setTemporaryValue("$DATA",e),this.mWriteProcedure.execute(),this.mLastDataValue=e,!0):!1}static{vr()}};function va(){function v(l,n){return function(c){e(n,"addInitializer"),r(c,"An initializer"),l.push(c)}}function t(l,n,h,c,o,b,p,T,x){var m;switch(o){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var s={kind:m,name:p?"#"+n:n,static:b,private:p,metadata:T},f={v:!1};s.addInitializer=v(c,f);var i,a;if(o===0?p?(i=h.get,a=h.set):(i=function(){return this[n]},a=function(g){this[n]=g}):o===2?i=function(){return h.value}:((o===1||o===3)&&(i=function(){return h.get.call(this)}),(o===1||o===4)&&(a=function(g){h.set.call(this,g)})),p)s.access=i&&a?{get:i,set:a}:i?{get:i}:{set:a};else{if(i){var C=i;i=function(g){return arguments.length===0&&(g=this),C.call(g)}}if(a){var P=a;a=function(g,_){return arguments.length===1&&(_=g,g=this),P.call(g,_)}}var E=function(g){return n in g};s.access=i&&a?{has:E,get:i,set:a}:i?{has:E,get:i}:{has:E,set:a}}try{return l(x,s)}finally{f.v=!0}}function e(l,n){if(l.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(l,n){if(typeof l!="function")throw new TypeError(n+" must be a function")}function u(l,n){var h=typeof n;if(l===1){if(h!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(h!=="function"){var c;throw l===0?c="field":l===10?c="class":c="method",new TypeError(c+" decorators must return a function or void 0")}}function d(l,n,h,c,o,b,p,T,x){var m=h[0],s,f,i;p?o===0||o===1?s={get:h[3],set:h[4]}:o===3?s={get:h[3]}:o===4?s={set:h[3]}:s={value:h[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,c)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var a,C,P;if(typeof m=="function")a=t(m,c,s,T,o,b,p,x,i),a!==void 0&&(u(o,a),o===0?f=a:o===1?(f=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a);else for(var E=m.length-1;E>=0;E--){var g=m[E];if(a=t(g,c,s,T,o,b,p,x,i),a!==void 0){u(o,a);var _;o===0?_=a:o===1?(_=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a,_!==void 0&&(f===void 0?f=_:typeof f=="function"?f=[f,_]:f.push(_))}}if(o===0||o===1){if(f===void 0)f=function(M,I){return I};else if(typeof f!="function"){var F=f;f=function(M,I){for(var A=I,L=0;L<F.length;L++)A=F[L].call(M,A);return A}}else{var j=f;f=function(M,I){return j.call(M,I)}}l.push(f)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),p?o===1?(l.push(function(M,I){return i.get.call(M,I)}),l.push(function(M,I){return i.set.call(M,I)})):o===2?l.push(i):l.push(function(M,I){return i.call(M,I)}):Object.defineProperty(n,c,s))}function y(l,n,h){for(var c=[],o,b,p=new Map,T=new Map,x=0;x<n.length;x++){var m=n[x];if(Array.isArray(m)){var s=m[1],f=m[2],i=m.length>3,a=s>=5,C,P;if(a?(C=l,s=s-5,b=b||[],P=b):(C=l.prototype,o=o||[],P=o),s!==0&&!i){var E=a?T:p,g=E.get(f)||0;if(g===!0||g===3&&s!==4||g===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!g&&s>2?E.set(f,s):E.set(f,!0)}d(c,C,m,f,s,a,i,P,h)}}return w(c,o),w(c,b),c}function w(l,n){n&&l.push(function(h){for(var c=0;c<n.length;c++)n[c].call(h);return h})}function D(l,n,h){if(n.length>0){for(var c=[],o=l,b=l.name,p=n.length-1;p>=0;p--){var T={v:!1};try{var x=n[p](o,{kind:"class",name:b,addInitializer:v(c,T),metadata:h})}finally{T.v=!0}x!==void 0&&(u(10,x),o=x)}return[S(o,h),function(){for(var m=0;m<c.length;m++)c[m].call(o)}]}}function S(l,n){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,h,c,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var p=Object.create(b===void 0?null:b),T=y(n,h,p);return c.length||S(n,p),{e:T,get c(){return D(n,c,p)}}}}function Dr(v,t,e,r){return(Dr=va())(v,t,e,r)}var Er,xr,ya;Er=Jt({access:q.Read,targetRestrictions:[Et]});var Tr=class{static{({c:[ya,xr]}=Dr(this,[],[Er]))}constructor(t=O.use(Et),e=O.use(k)){let r=new Array,u=t.processorConstructor;do{let d=lt.get(u).getMetadata(Ee.METADATA_USER_EVENT_LISTENER_PROPERIES);if(d)for(let y of d)r.push(y)}while(u=Object.getPrototypeOf(u));this.mEventListenerList=new Array,this.mTargetElement=e;for(let d of r){let[y,w]=d,D=Reflect.get(t.processor,y);D=D.bind(t.processor),this.mEventListenerList.push([w,D]),this.mTargetElement.addEventListener(w,D)}}mEventListenerList;mTargetElement;onDeconstruct(){for(let t of this.mEventListenerList){let[e,r]=t;this.mTargetElement.removeEventListener(e,r)}}static{xr()}};var Ir=`:host {\r
    display: block;\r
    width: 100%;\r
    height: 100%;\r
}\r
\r
potatno-code-editor {\r
    display: block;\r
    width: 100%;\r
    height: 100%;\r
}`;var ne=class{mProject;constructor(t){this.mProject=t}deserialize(t){let e=new jt(this.mProject),r=[];for(let u of t.functions){let d=this.deserializeFunctionHead(u,e);r.push([d,u]),e.addFunction(d)}for(let[u,d]of r)this.deserializeFunctionBody(u,d,e);return e}deserializeFunctionBody(t,e,r){let u=new Map;for(let d of e.nodes)u.set(d.id,this.deserializeNode(d,t,r));for(let d of e.connections){if(!u.has(d.sourceNodeId)||!u.has(d.targetNodeId))continue;let y=u.get(d.sourceNodeId),w=u.get(d.targetNodeId),D=y.outputs.map.get(d.sourcePortId),S=w.inputs.map.get(d.targetPortId);!D||!S||D.connect(S)}}deserializeFunctionHead(t,e){let r=new at(this.mProject,e,{definitionId:t.definitionId,id:t.id,label:t.label,isSystem:t.isSystem});for(let u of t.imports)r.addImport(u);for(let u of t.inputs)r.addInput({label:u.label,dataType:u.dataType});for(let u of t.outputs)r.addOutput({label:u.label,dataType:u.dataType});return r}deserializeNode(t,e,r){let u=r.nodeDefinitions.find(y=>y.id===t.definitionId),d=(()=>{if(u)return e.addNodeByDefinition(u,t.transformation);let y=t.ports.filter(D=>D.direction==="input").map(D=>({dataType:D.dataType,definitionId:D.definitionId,label:D.label,portType:D.portType})),w=t.ports.filter(D=>D.direction==="output").map(D=>({dataType:D.dataType,definitionId:D.definitionId,label:D.label,portType:D.portType}));return new mt(this.mProject,r,e,{definitionId:t.definitionId,ports:{input:y,output:w},label:t.label,transformation:{...t.transformation}})})();d.label=t.label,e.addNode(d);for(let y of t.ports)if(y.portType==="value"&&y.directValue.length>0){let w=d.inputs.map.get(y.definitionId);w&&w.setDirectValue(y.directValue)}return d.preview=t.preview??null,d}};var ie=class{constructor(){}serialize(t){return{functions:[...t.functions].map(e=>this.serializeFunction(e))}}serializeFunction(t){let e=new Map;[...t.nodes].forEach((w,D)=>{e.set(w,`n${D}`)});let r=[...t.nodes].map(w=>this.serializeNode(w,e.get(w))),u=[];for(let w of t.nodes){let D=e.get(w);for(let S of w.outputs.list)for(let l of S.connectedPorts){let n=e.get(l.node);u.push({sourceNodeId:D,sourcePortId:S.definitionId,targetNodeId:n,targetPortId:l.definitionId})}}let d=t.inputs.map(w=>({label:w.label,dataType:w.dataType})),y=t.outputs.map(w=>({label:w.label,dataType:w.dataType}));return{id:t.id,label:t.label,isSystem:t.isSystem,definitionId:t.definitionId,inputs:d,outputs:y,imports:[...t.imports],nodes:r,connections:u}}serializeNode(t,e){let r=[...t.inputs.list,...t.outputs.list].map(d=>({definitionId:d.definitionId,label:d.label,direction:d.direction,portType:d.portType,dataType:d.portType==="value"?d.dataType:null,directValue:[...d.directValue]})),u=t.preview?{portDefinitionId:t.preview.portDefinitionId,displayId:t.preview.displayId}:null;return{id:e,definitionId:t.definitionId,label:t.label,transformation:{...t.transformation},ports:r,preview:u}}};var Cr=`:host {\r
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
}`;var He=class v{static PASTE_OFFSET=2;mClipboardNodes;mManager;constructor(t){this.mManager=t,this.mClipboardNodes=new Array}copy(t){if(t.size===0)return;let e=[...t],r=new Map;for(let u=0;u<e.length;u++){let d=e[u],y=d.inputs.value.map(D=>({definitionId:D.definitionId,values:[...D.directValue]})),w={...d.transformation};w.x+=v.PASTE_OFFSET,w.y+=v.PASTE_OFFSET,r.set(d,{connections:new Array,definitionId:d.definitionId,id:u,portDirectValues:y,label:d.label,transformation:w})}for(let[u,d]of r)for(let y of u.outputs.list)for(let w of y.connectedPorts){let D=r.get(w.node);D&&d.connections.push({sourcePortName:y.definitionId,targetNodeId:D.id,targetPortName:w.definitionId})}this.mClipboardNodes=[...r.values()]}paste(){if(this.mClipboardNodes.length===0)return new Array;let t=this.mManager.activeFunction,e=new Map;for(let r of this.mClipboardNodes){let u=t.dynamicNodeDefinitions.find(y=>y.id===r.definitionId);if(!u)continue;let d=this.mManager.graph.addNode(t,u,r.transformation);this.mManager.graph.updateNode(d,y=>{y.label=r.label;for(let w of r.portDirectValues)y.inputs.map.has(w.definitionId)&&y.inputs.map.get(w.definitionId).setDirectValue(w.values)}),e.set(r.id,d)}for(let r of this.mClipboardNodes){let u=e.get(r.id);if(u)for(let d of r.connections){let y=e.get(d.targetNodeId);if(!y)continue;let w=u.outputs.map.get(d.sourcePortName),D=y.inputs.map.get(d.targetPortName);!w||!D||this.mManager.graph.connectPorts(w,D)}}return[...e.values()]}};var Ye=class extends de{mGridNodeArea;mGridPaths;mNodeArea;mPathArea;constructor(){super(),this.mGridNodeArea=new WeakMap,this.mNodeArea=new Map,this.mGridPaths=new WeakMap,this.mPathArea=new Map}clear(t){t==="all"&&this.mNodeArea.clear(),this.mPathArea.clear()}getPath(t,e){let r=t.direction==="input"&&t.portType==="value"||t.direction==="output"&&t.portType==="flow"?t:e;return this.mGridPaths.get(r)??new Array}removeNodeArea(t){if(!this.mGridNodeArea.has(t))return;let e=this.mGridNodeArea.get(t);for(let r of e){let u=(this.mNodeArea.get(r)??0)-1;u<1?this.mNodeArea.delete(r):this.mNodeArea.set(r,u)}this.mGridNodeArea.delete(t)}updateNodeArea(t){this.removeNodeArea(t);let e=t.transformation.x,r=t.transformation.y,u=t.transformation.width,d=t.transformation.height,y=t.function.nodeDefinitions.find(D=>D.id===t.definitionId);if(y)switch(y.id){case xt.DEFINITION_ID:return;case et.DEFINITION_ID:case K.DEFINITION_ID:break;default:d+=1,d+=t.preview!==null?7:1}let w=new Array;for(let D=0;D<u;D++)for(let S=0;S<d;S++){let l=`${D+e}|${S+r}`,n=(this.mNodeArea.get(l)??0)+1;this.mNodeArea.set(l,n),w.push(l)}this.mGridNodeArea.set(t,w)}updatePath(t,e,r){if(t.direction==="input"&&t.portType!=="value"||t.direction==="output"&&t.portType!=="flow")throw new N("Start port must be an input-value or an output-flow node.",this);this.removePathArea(t);let u=this.start(e,r);this.mGridPaths.set(t,u.path);let d=this.nodeId(e),y=this.nodeId(r);for(let w of u.path){let D=this.nodeId(w),S=this.mPathArea.has(D)?this.mPathArea.get(D):{ports:new Map,entryPoints:new Set};S.ports.set(t,[d,y]),S.entryPoints.add(d),S.entryPoints.add(y),this.mPathArea.set(D,S)}}costOfTraversal(t,e){let r=this.nodeId(t),u=1;this.mNodeArea.has(r)&&t!==e.endNode&&(u*=20);let d=e.path.next().value;if(this.mPathArea.has(r)){let l=this.mPathArea.get(r),n=this.nodeId(e.startNode),h=this.nodeId(e.endNode);if(l.entryPoints.has(n)||l.entryPoints.has(h))u*=.2;else if(u*=5,d){let c=this.nodeId(d);this.mPathArea.has(c)&&(u*=20)}}if(d){let l=t.y===d.y;(t===e.endNode||d===e.startNode)&&!l&&(u*=100);let n=e.path.next().value;n&&(t.x===n.x||t.y===n.y)&&(u*=.7)}let y=Math.abs(t.x-e.startNode.x),w=Math.abs(t.x-e.endNode.x),D=y<=w;(D&&t.y===e.startNode.y||!D&&t.y===e.endNode.y)&&(u*=.5);let S=e.endNode.x+e.startNode.x>>1;return t.x===S&&(u*=.5),u}heuristic(t,e){return(Math.abs(t.x-e.endNode.x)+Math.abs(t.y-e.endNode.y))*.5}neighborNodes(t){return[{x:t.x,y:t.y-1},{x:t.x-1,y:t.y},{x:t.x+1,y:t.y},{x:t.x,y:t.y+1}]}nodeId(t){return`${t.x}|${t.y}`}removePathArea(t){if(!this.mGridPaths.has(t))return;let e=this.mGridPaths.get(t);for(let r of e){let u=this.nodeId(r),d=this.mPathArea.get(u);if(!d)continue;let y=d.ports.get(t);y&&(d.ports.delete(t),d.entryPoints.delete(y[0]),d.entryPoints.delete(y[1]),d.ports.size===0?this.mPathArea.delete(u):this.mPathArea.set(u,d))}this.mGridPaths.delete(t)}};var We=class{mManager;mPathFinder;constructor(t){this.mManager=t,this.mPathFinder=new Ye;let e=0,r=()=>{e>0&&globalThis.cancelAnimationFrame(e),globalThis.requestAnimationFrame(()=>{this.updatePaths()})};this.mManager.subscribe(R.Node|R.SpecialActiveFunction,u=>{if((u.changeType&R.SpecialActiveFunction)>0){this.mPathFinder.clear("all");for(let d of this.mManager.activeFunction.nodes)this.mPathFinder.updateNodeArea(d);r();return}(u.changeType&R.Node)>0&&((u.changeType&R.NodeDelete)>0?this.mPathFinder.removeNodeArea(u.item):this.mPathFinder.updateNodeArea(u.item)),r()}),this.mManager.subscribe(R.Connection,()=>{r()})}createTemporaryPath(t,e){let r=w=>w instanceof nt?this.getPortGridPoint(w):w,u=r(t),d=r(e),y=this.mPathFinder.start(u,d).path;return{attributeValue:this.createSvgPath(y),length:y.length}}getConnectionPath(t,e){let r=this.mPathFinder.getPath(t,e);return{attributeValue:this.createSvgPath(r),length:r.length-2}}getPortGridPoint(t){let e=t.node,r=t.direction==="input"?e.inputs.list:e.outputs.list,u=(()=>{for(let w=0;w<r.length;w++)if(r[w]===t)return w;return 0})(),d=t.direction==="input"?e.transformation.x:e.transformation.x+e.transformation.width-1,y=1;return(e.definitionId===K.DEFINITION_ID||e.definitionId===et.DEFINITION_ID)&&(y=0),{y:e.transformation.y+y+u,x:d}}createGridCellPath(t,e,r){let u=this.getGridPosition(t,e),d=this.getGridPosition(t,r),y={x:e==="bottom"||e==="top"?u.x:d.x,y:e==="left"||e==="right"?u.y:d.y};return`Q ${y.x},${y.y} ${d.x},${d.y}`}createPath(t,e){let r=t.direction==="input"&&t.portType==="value"||t.direction==="output"&&t.portType==="flow"?t:e,u=t,d=e;u.direction!=="output"&&([d,u]=[u,d]);let y=this.getPortGridPoint(u),w=this.getPortGridPoint(d);this.mPathFinder.updatePath(r,y,w)}createSvgPath(t){if(t.length<2)return"";let e=(d,y)=>{let w=y.x-d.x,D=y.y-d.y;switch(!0){case(w===0&&D===1):return"bottom";case(w===0&&D===-1):return"top";case(w===-1&&D===0):return"left";case(w===1&&D===0):return"right";default:throw new N("Missformed path. Path points are not directly next to each other.",this)}},r=this.getGridPosition(t[0],e(t[0],t[1])),u=`M ${r.x},${r.y}`;for(let d=1;d<t.length-1;d++){let y=t[d],w=t[d-1],D=t[d+1],S=e(y,w),l=e(y,D);u+=this.createGridCellPath(y,S,l)}return u}getGridPosition(t,e){let r={x:t.x*this.mManager.grid.gridSize+this.mManager.grid.gridSize/2,y:t.y*this.mManager.grid.gridSize+this.mManager.grid.gridSize/2},u=this.mManager.grid.gridSize/2;switch(e){case"top":r.y-=u;break;case"right":r.x+=u;break;case"bottom":r.y+=u;break;case"left":r.x-=u;break}return r}updatePaths(){this.mPathFinder.clear("path");for(let t of this.mManager.activeFunction.nodes){for(let e of t.outputs.flow){let r=e.connectedPorts.values().next().value;r&&this.createPath(e,r)}for(let e of t.inputs.value){let r=e.connectedPorts.values().next().value;r&&this.createPath(e,r)}}}};var Ze=class{mDocument;mManager;get document(){return this.mDocument}constructor(t){this.mManager=t,this.mDocument=new jt(t.project),this.mDocument.validate()}addFunction(t){let e=this.mDocument;if(!e||!e.project.userFunctions.has(t))return;let r=new at(e.project,e,{definitionId:t,id:crypto.randomUUID(),isSystem:!1,label:`Function_${e.functions.length}`});e.addFunction(r),e.validate(),this.mManager.dispatch(R.FunctionAdd,r),this.mManager.setActiveFunction(r)}addNode(t,e,r){let u=t.addNodeByDefinition(e,r);return this.mManager.dispatch(R.NodeAdd,u),u}connectPorts(t,e){try{t.connect(e)}catch{return!1}return this.mManager.dispatch(R.ConnectionAdd,t),this.mManager.dispatch(R.ConnectionAdd,e),!0}disconnectPorts(t,e){t.disconnect(e),this.mManager.dispatch(R.ConnectionDelete,t),this.mManager.dispatch(R.ConnectionDelete,e)}mergeConnectPorts(t,e){if(t.length===0||e.length===0)return;let r=this.mManager.connections.getPortGridPoint(t[0]),u=this.priorizePorts(r,e);for(let d of u)for(let y of t)if(this.connectPorts(d,y))return}priorizePorts(t,e){if(e.length===0)return new Array;let r=this.mManager.connections.getPortGridPoint(e[0]);return e.toSorted((u,d)=>{let y=u.connectedPorts.size===0,w=d.connectedPorts.size===0;if(y!==w)return y?-1:1;let D=r.x>t.x?"input":"output",S=u.direction===D,l=d.direction===D;return S!==l?S?-1:1:0})}removeFunction(t){let e=this.mDocument;if(!e)return;let r=null;for(let u of e.functions)if(u.id===t){r=u,e.removeFunction(u);break}r&&(this.mManager.dispatch(R.FunctionDelete,r),this.setDefaultActiveFunction())}removeNode(t){if(t.definitionId===K.DEFINITION_ID||t.definitionId===et.DEFINITION_ID){let e=t.inputs.list[0],r=t.outputs.list[0];for(let u of e.connectedPorts)for(let d of r.connectedPorts)this.mManager.graph.connectPorts(u,d)}t.function.removeNode(t),this.mManager.dispatch(R.NodeDelete,t)}setDocument(t){this.mDocument=t,this.mDocument.validate(),this.mManager.dispatch(R.Document,this.mDocument),this.setDefaultActiveFunction()}setPortDirectValue(t,e){t.setDirectValue(e),this.mManager.dispatch(R.NodeUpdate,t.node)}transformNode(t,e){if(!t)return;let r=structuredClone(t.transformation);e(t),!(r.width===t.transformation.width&&r.height===t.transformation.height&&r.x===t.transformation.x&&r.y===t.transformation.y)&&this.mManager.dispatch(R.NodeTransform,t)}updateFunction(t,e){t&&(e(t),this.mManager.dispatch(R.FunctionUpdate,t))}updateNode(t,e){t&&(e(t),this.mManager.dispatch(R.NodeUpdate,t))}setDefaultActiveFunction(){if(!this.mDocument||this.mDocument.functions.length===0)return;let t=(()=>{let e=[...this.mDocument.functions],r=e.find(u=>u.id===this.mManager.activeFunction.id);return r||e[0]})();this.mManager.activeFunction!==t&&this.mManager.setActiveFunction(t)}};var qe=class v{static GRID_SIZE=24;static MAX_ZOOM=5;static MIN_ZOOM=.1;mDraggedPortInformation;mGridElement;mGridPositions;mManager;mSelectedNodes;mTransformation;get draggedPort(){return this.mDraggedPortInformation}set gridElement(t){this.mGridElement=t}get gridSize(){return v.GRID_SIZE}get panX(){return this.mTransformation.panX}get panY(){return this.mTransformation.panY}get selectedNodes(){return this.mSelectedNodes}get zoom(){return this.mTransformation.zoom}constructor(t){this.mManager=t,this.mGridElement=null,this.mDraggedPortInformation=new Je(this.mManager,[]),this.mGridPositions=new WeakMap,this.mSelectedNodes=new Set,this.mTransformation={panX:0,panY:0,zoom:1},this.mManager.subscribe(R.SpecialActiveFunction,()=>{this.mGridPositions.has(this.mManager.activeFunction)||this.mGridPositions.set(this.mManager.activeFunction,{panX:0,panY:0,zoom:1}),this.mTransformation=this.mGridPositions.get(this.mManager.activeFunction);let e=Array.from(this.mSelectedNodes).filter(r=>r.function!==this.mManager.activeFunction);for(let r of e)this.mSelectedNodes.delete(r)})}gridPixelSpaceToGridSpace(t,e){let r=t.x/this.gridSize,u=t.y/this.gridSize;return e&&(r=Math.floor(r),u=Math.floor(u)),{x:r,y:u}}pan(t,e){this.mTransformation.panX+=t,this.mTransformation.panY+=e,this.mManager.dispatch(R.SpecialGrid,null)}pixelToGridPixelSpace(t,e){let r=t,u=e;if(this.mGridElement){let d=this.mGridElement.getBoundingClientRect();r-=d.left,u-=d.top}return{x:(r-this.mTransformation.panX)/this.mTransformation.zoom,y:(u-this.mTransformation.panY)/this.mTransformation.zoom}}pixelToGridSpace(t,e){return this.gridPixelSpaceToGridSpace(this.pixelToGridPixelSpace(t,e),!0)}selectNodes(t,e=!1){if(this.mSelectedNodes.clear(),t.length===0){this.mManager.dispatch(R.SpecialSelectNode,null);return}let r=null;for(let u of t){if(r===null&&(r=u.function),r!==u.function)throw new N("Selected nodes must be of the same function",this);this.mSelectedNodes.add(u)}if(this.mManager.activeFunction!==r&&this.mManager.setActiveFunction(r),e){let u={top:1/0,right:-1/0,bottom:-1/0,left:1/0};for(let w of t){let D=w.transformation.y;D<u.top&&(u.top=D);let S=w.transformation.x+w.transformation.width;S>u.right&&(u.right=S);let l=w.transformation.y+w.transformation.height;l>u.bottom&&(u.bottom=l);let n=w.transformation.x;n<u.left&&(u.left=n)}this.mGridPositions.has(r)||this.mGridPositions.set(r,{panX:0,panY:0,zoom:1});let d=this.mGridPositions.get(r),y=this.mGridElement?.getBoundingClientRect();if(!y)return;d.panX=y.width/2,d.panX-=(u.left+(u.right-u.left)/2)*this.gridSize*d.zoom,d.panY=y.height/2,d.panY-=(u.top+(u.bottom-u.top)/2)*this.gridSize*d.zoom}this.mManager.dispatch(R.SpecialSelectNode,null)}setDraggingPort(t){this.mDraggedPortInformation=new Je(this.mManager,t)}zoomAt(t,e,r){let u=this.mTransformation.zoom,d=1+r,y=this.mTransformation.zoom*d;y=Math.max(v.MIN_ZOOM,Math.min(v.MAX_ZOOM,y));let w=(t-this.mTransformation.panX)/u,D=(e-this.mTransformation.panY)/u;this.mTransformation.zoom=y,this.mTransformation.panX=t-w*this.mTransformation.zoom,this.mTransformation.panY=e-D*this.mTransformation.zoom,this.mManager.dispatch(R.SpecialGrid,null)}},Je=class{mManager;mPointerGridPosition;mPortPositions;mPorts;get isDragging(){return this.mPorts.size>0}get portPositions(){return this.mPortPositions}get ports(){return[...this.mPorts]}constructor(t,e){this.mManager=t,this.mPorts=new Set(e),this.mPointerGridPosition={x:1/0,y:1/0},this.mPortPositions=new Map;for(let r of e){let u=this.mManager.connections.getPortGridPoint(r);r.direction==="output"&&(u.x+=1),this.mPortPositions.set(r,{x:u.x,y:u.y})}}hasPort(t){return t?this.mPorts.has(t):!1}updatePointer(t,e){let r=this.mManager.grid.pixelToGridSpace(t,e);return r.x===this.mPointerGridPosition.x&&r.y===this.mPointerGridPosition.y?!1:(this.mPointerGridPosition.x=r.x,this.mPointerGridPosition.y=r.y,!0)}};var Ke=class v{static MAX_HISTORY_ITEMS=100;mManager;mSnapshotIndex;mSnapshots;get canRedo(){return this.mSnapshotIndex<this.mSnapshots.length-1}get canUndo(){return this.mSnapshotIndex>0}constructor(t){this.mManager=t,this.mSnapshotIndex=-1,this.mSnapshots=new Array;let e=0;this.mManager.subscribe(R.Any,()=>{globalThis.clearTimeout(e),e=globalThis.setTimeout(()=>{this.pushHistory()},300)})}clear(){this.mSnapshots.length=0,this.mSnapshotIndex=-1}redo(){if(!this.canRedo)return;let t=this.mSnapshots[++this.mSnapshotIndex],e=JSON.parse(t);this.restoreHistory(e)}undo(){if(!this.canUndo)return;let t=this.mSnapshots[--this.mSnapshotIndex],e=JSON.parse(t);this.restoreHistory(e)}pushHistory(){let t=new ie().serialize(this.mManager.graph.document),e=JSON.stringify(t);this.mSnapshotIndex>=0&&this.mSnapshots[this.mSnapshotIndex]===e||(this.mSnapshots.splice(this.mSnapshotIndex+1),this.mSnapshotIndex=this.mSnapshots.push(e)-1,this.mSnapshots.length>v.MAX_HISTORY_ITEMS&&(this.mSnapshots.shift(),this.mSnapshotIndex--))}restoreHistory(t){this.mManager.graph.setDocument(new ne(this.mManager.project).deserialize(t))}};var Qe=class{mErrorItems;mErrorList;mIsDirty;mManager;get errorItems(){return this.mIsDirty&&this.revalidate(),this.mErrorItems}get errors(){return this.mIsDirty&&this.revalidate(),this.mErrorList}get isValid(){return this.mIsDirty&&this.revalidate(),this.mErrorItems.size===0}constructor(t){this.mManager=t,this.mErrorList=new Array,this.mErrorItems=new Set,this.mIsDirty=!0;let e=0,r=R.Connection|R.Document|R.Function|R.NodeAdd|R.NodeUpdate|R.NodeDelete|R.Port;this.mManager.subscribe(r,()=>{this.mIsDirty=!0,globalThis.clearTimeout(e),e=globalThis.setTimeout(()=>{this.mIsDirty&&(this.revalidate(),this.mIsDirty=!1)},1e3)})}revalidate(){this.mIsDirty=!1,this.mErrorList.splice(0,this.mErrorList.length),this.mErrorItems.clear();let t=this.mManager.graph.document.validate();for(let e of t.errors)switch(this.mErrorItems.add(e.item),!0){case e.item instanceof nt:{this.mErrorList.push({location:e.item.node,message:e.message});break}case e.item instanceof mt:{this.mErrorList.push({location:e.item,message:e.message});break}case e.item instanceof at:{this.mErrorList.push({location:e.item,message:e.message});break}}for(let e of t.affectedItems)switch(!0){case e instanceof nt:{this.mManager.dispatch(R.PortAdd|R.PortUpdate,e),this.mManager.dispatch(R.NodeUpdate,e.node);break}case e instanceof mt:{this.mManager.dispatch(R.NodeAdd|R.NodeUpdate|R.NodeTransform,e);break}case e instanceof at:{this.mManager.dispatch(R.FunctionAdd|R.FunctionUpdate,e);break}}this.mManager.dispatch(R.SpecialValidation,null)}};var ke=class{mDriverElementBigEnough;mDriverElementVisible;mDriverElements;mDriverList;mDrivers;mElementDriver;mManager;mPreviewIntersection;constructor(t){this.mManager=t,this.mDriverList=new Array,this.mDrivers=new WeakMap,this.mDriverElementVisible=new WeakMap,this.mDriverElementBigEnough=new WeakMap,this.mDriverElements=new WeakMap,this.mElementDriver=new WeakMap,this.mManager.subscribe(R.Document,()=>{this.mDriverList.splice(0,this.mDriverList.length)});let e=0,r=R.Connection|R.Function|R.NodeAdd|R.NodeDelete|R.NodeUpdate;this.mManager.subscribe(r,()=>{globalThis.clearTimeout(e),e=globalThis.setTimeout(()=>this.refresh(),1e3)});let u=0;this.mManager.subscribe(R.SpecialGrid,()=>{globalThis.clearTimeout(u),u=globalThis.setTimeout(()=>{for(let d of this.mDriverList){let y=d.deref();if(!y)continue;let w=y.element.getBoundingClientRect();this.mDriverElementBigEnough.set(y,!(w.width<30||w.height<30))}},300)}),this.mPreviewIntersection=new IntersectionObserver(d=>{for(let y of d){let w=this.mElementDriver.get(y.target);if(!w)continue;let D=w.deref();D&&this.mDriverElementVisible.set(D,y.isIntersecting)}})}execute(){for(let t of this.mDriverList){let e=t.deref();if(e&&this.mDriverElementVisible.get(e)!==!1&&this.mDriverElementBigEnough.get(e)!==!1)try{e.execute()}catch(r){console.error("[PotatnoUiManagerPreview] Driver render failed:",r)}}}refresh(){if(this.mManager.integrity.isValid)for(let t=this.mDriverList.length-1;t>=0;t--){let e=this.mDriverList[t].deref();if(!e){this.unregister(this.mDriverList[t]);continue}e.refresh()}}requestDriver(t,e){let r=this.mDrivers.get(t);if(r&&r.display.id===e)return r;r&&this.unregister(this.mElementDriver.get(r.element));let u=t.project.preview.getDisplay(e);if(!u)throw new N(`Preview has no display for "${e}".`,this);let d=u.createDriver(t);return this.register(t,d),this.mManager.integrity.isValid&&d.refresh(),d}register(t,e){this.mDrivers.set(t,e);let r=new WeakRef(e);this.mDriverList.push(r);let u=e.element;this.mDriverElements.set(r,u),this.mElementDriver.set(u,r),this.mPreviewIntersection.observe(u)}unregister(t){let e=this.mDriverList.indexOf(t);if(e===-1)return;this.mDriverList.splice(e,1);let r=this.mDriverElements.get(t);r&&this.mPreviewIntersection.unobserve(r)}};var Y=class extends EventTarget{mActiveFunction;mClipboard;mConnections;mEventBuffer;mEventBufferDispatchRequest;mGraph;mGrid;mHistory;mIntegrity;mPreview;mProject;get activeFunction(){return this.mActiveFunction}get clipboard(){return this.mClipboard}get connections(){return this.mConnections}get graph(){return this.mGraph}get grid(){return this.mGrid}get history(){return this.mHistory}get integrity(){return this.mIntegrity}get preview(){return this.mPreview}get project(){return this.mProject}constructor(t){super(),this.mProject=t,this.mEventBuffer=new Map,this.mEventBufferDispatchRequest=-1,this.mIntegrity=new Qe(this),this.mConnections=new We(this),this.mHistory=new Ke(this),this.mPreview=new ke(this),this.mGrid=new qe(this),this.mClipboard=new He(this),this.mGraph=new Ze(this),this.mActiveFunction=this.mGraph.document.functions.at(0)}dispatch(t,e){let r=this.mEventBuffer.get(e)??0;this.mEventBuffer.set(e,r|t),this.mEventBufferDispatchRequest!==-1&&globalThis.cancelAnimationFrame(this.mEventBufferDispatchRequest),this.mEventBufferDispatchRequest=requestAnimationFrame(()=>{this.mEventBufferDispatchRequest=-1;for(let[u,d]of this.mEventBuffer)this.dispatchEvent(new Me(d,u));this.mEventBuffer.clear()})}generateStringColor(t){let e=(()=>{let u=0;for(let d=0;d<t.length;d++)u=t.charCodeAt(d)+((u<<5)-u);return u})();return`hsl(${Math.abs(e)*137.508%360}, 70%, 60%)`}setActiveFunction(t){this.mGraph.document.functions.find(r=>r===t)&&(this.mActiveFunction=t,this.dispatch(R.SpecialActiveFunction,t))}subscribe(t,e){let r=u=>{t!==R.Any&&(u.changeType&t)===0||e(u)};return this.addEventListener(Me.EVENT_TYPE,r),()=>{this.removeEventListener(Me.EVENT_TYPE,r)}}},R={Any:16777215,Connection:15,ConnectionAdd:1,ConnectionUpdate:2,ConnectionDelete:4,Document:240,Function:3840,FunctionAdd:256,FunctionUpdate:512,FunctionDelete:1024,Node:61440,NodeAdd:4096,NodeUpdate:8192,NodeDelete:16384,NodeTransform:32768,Port:983040,PortAdd:65536,PortUpdate:131072,PortDelete:262144,Special:15728640,SpecialActiveFunction:1048576,SpecialGrid:2097152,SpecialValidation:4194304,SpecialSelectNode:8388608},Me=class v extends Event{static EVENT_TYPE="PotatnoUiManagerChangeEvent";mChangeType;mEventItem;get changeType(){return this.mChangeType}get item(){return this.mEventItem}constructor(t,e){super(v.EVENT_TYPE),this.mChangeType=t,this.mEventItem=e}};var Pr=`:host {\r
    --button-accent-color: red;\r
    --button-accent-text-color: red;\r
    --button-text-color: red;\r
    --button-border-color: red;\r
    --button-background-color: red;\r
\r
    box-sizing: border-box;\r
    display: flex;\r
    align-items: center;\r
    justify-content: center;\r
    cursor: pointer;\r
    user-select: none;\r
\r
    /* Shared box. Transparent border keeps every type the same size. */\r
    border: 1px solid transparent;\r
    border-radius: 2px;\r
    color: var(--button-text-color);\r
    background-color: transparent;\r
\r
    /* Smooth transition for all */\r
    transition: border-color 0.15s, color 0.15s, background-color 0.15s, scale 0.15s;\r
}\r
\r
.button {\r
    box-sizing: border-box;\r
    display: flex;\r
    align-items: center;\r
    justify-content: center;\r
    gap: 6px;\r
}\r
\r
/*\r
 * Ugly as fuck but there is no other way to write it. Cant nest shit.\r
 */\r
\r
/*\r
 * Primary\r
 */\r
:host:has(.primary) {\r
    padding: 8px 12px;\r
    border-style: dashed;\r
    border-color: var(--button-border-color);\r
    background-color: var(--button-background-color);\r
}\r
\r
:host(:hover):has(.primary) {\r
    border-color: var(--button-accent-color);\r
    color: var(--button-accent-color);\r
}\r
\r
:host(:active):has(.primary) {\r
    scale: 0.98;\r
}\r
\r
:host:has(.primary.selected) {\r
    border-color: var(--button-accent-color);\r
    color: var(--button-accent-color);\r
}\r
\r
/*\r
 * Secondary\r
 */\r
:host:has(.secondary) {\r
    position: relative;\r
    overflow: hidden;\r
\r
    /* Own stacking context so the accent layer stays behind the slotted content. */\r
    z-index: 0;\r
}\r
\r
:host:has(.secondary)::before {\r
    content: "";\r
    position: absolute;\r
    inset: 0;\r
    z-index: -1;\r
\r
    background-image: radial-gradient(ellipse at top left, var(--button-accent-color) 0%, transparent 100%);\r
\r
    opacity: 0;\r
    transition: opacity 0.15s ease-in-out;\r
}\r
\r
:host(:hover):has(.secondary)::before {\r
    opacity: 0.5;\r
}\r
\r
:host(:active):has(.secondary) {\r
    color: var(--button-accent-text-color);\r
    scale: 0.98;\r
}\r
\r
:host(:active):has(.secondary)::before {\r
    opacity: 0.8;\r
}\r
\r
:host:has(.secondary.selected) {\r
    color: var(--button-accent-text-color);\r
}\r
\r
:host:has(.secondary.selected)::before {\r
    opacity: 1;\r
}`;var Mr=`<div class="button {{this.type}} {{this.selected ? 'selected' : ''}}">\r
    $slot\r
</div>\r
`;function Da(){function v(l,n){return function(c){e(n,"addInitializer"),r(c,"An initializer"),l.push(c)}}function t(l,n,h,c,o,b,p,T,x){var m;switch(o){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var s={kind:m,name:p?"#"+n:n,static:b,private:p,metadata:T},f={v:!1};s.addInitializer=v(c,f);var i,a;if(o===0?p?(i=h.get,a=h.set):(i=function(){return this[n]},a=function(g){this[n]=g}):o===2?i=function(){return h.value}:((o===1||o===3)&&(i=function(){return h.get.call(this)}),(o===1||o===4)&&(a=function(g){h.set.call(this,g)})),p)s.access=i&&a?{get:i,set:a}:i?{get:i}:{set:a};else{if(i){var C=i;i=function(g){return arguments.length===0&&(g=this),C.call(g)}}if(a){var P=a;a=function(g,_){return arguments.length===1&&(_=g,g=this),P.call(g,_)}}var E=function(g){return n in g};s.access=i&&a?{has:E,get:i,set:a}:i?{has:E,get:i}:{has:E,set:a}}try{return l(x,s)}finally{f.v=!0}}function e(l,n){if(l.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(l,n){if(typeof l!="function")throw new TypeError(n+" must be a function")}function u(l,n){var h=typeof n;if(l===1){if(h!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(h!=="function"){var c;throw l===0?c="field":l===10?c="class":c="method",new TypeError(c+" decorators must return a function or void 0")}}function d(l,n,h,c,o,b,p,T,x){var m=h[0],s,f,i;p?o===0||o===1?s={get:h[3],set:h[4]}:o===3?s={get:h[3]}:o===4?s={set:h[3]}:s={value:h[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,c)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var a,C,P;if(typeof m=="function")a=t(m,c,s,T,o,b,p,x,i),a!==void 0&&(u(o,a),o===0?f=a:o===1?(f=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a);else for(var E=m.length-1;E>=0;E--){var g=m[E];if(a=t(g,c,s,T,o,b,p,x,i),a!==void 0){u(o,a);var _;o===0?_=a:o===1?(_=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a,_!==void 0&&(f===void 0?f=_:typeof f=="function"?f=[f,_]:f.push(_))}}if(o===0||o===1){if(f===void 0)f=function(M,I){return I};else if(typeof f!="function"){var F=f;f=function(M,I){for(var A=I,L=0;L<F.length;L++)A=F[L].call(M,A);return A}}else{var j=f;f=function(M,I){return j.call(M,I)}}l.push(f)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),p?o===1?(l.push(function(M,I){return i.get.call(M,I)}),l.push(function(M,I){return i.set.call(M,I)})):o===2?l.push(i):l.push(function(M,I){return i.call(M,I)}):Object.defineProperty(n,c,s))}function y(l,n,h){for(var c=[],o,b,p=new Map,T=new Map,x=0;x<n.length;x++){var m=n[x];if(Array.isArray(m)){var s=m[1],f=m[2],i=m.length>3,a=s>=5,C,P;if(a?(C=l,s=s-5,b=b||[],P=b):(C=l.prototype,o=o||[],P=o),s!==0&&!i){var E=a?T:p,g=E.get(f)||0;if(g===!0||g===3&&s!==4||g===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!g&&s>2?E.set(f,s):E.set(f,!0)}d(c,C,m,f,s,a,i,P,h)}}return w(c,o),w(c,b),c}function w(l,n){n&&l.push(function(h){for(var c=0;c<n.length;c++)n[c].call(h);return h})}function D(l,n,h){if(n.length>0){for(var c=[],o=l,b=l.name,p=n.length-1;p>=0;p--){var T={v:!1};try{var x=n[p](o,{kind:"class",name:b,addInitializer:v(c,T),metadata:h})}finally{T.v=!0}x!==void 0&&(u(10,x),o=x)}return[S(o,h),function(){for(var m=0;m<c.length;m++)c[m].call(o)}]}}function S(l,n){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,h,c,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var p=Object.create(b===void 0?null:b),T=y(n,h,p);return c.length||S(n,p),{e:T,get c(){return D(n,c,p)}}}}function Rr(v,t,e,r){return(Rr=Da())(v,t,e,r)}var Or,Sr,Fr,zr,_r,Nr,Ar,Ht;Or=B({selector:"kg-button",template:Mr,style:Pr}),Fr=$.state(),zr=$.state();var Lr=class{static{({e:[_r,Nr,Ar],c:[Ht,Sr]}=Rr(this,[[Fr,1,"mSelected"],[zr,1,"mType"],[H,3,"selected"],[H,3,"type"]],[Or]))}constructor(){this.mType="primary",this.mSelected=!1}#t=(Ar(this),_r(this));get mSelected(){return this.#t}set mSelected(t){this.#t=t}#e=Nr(this);get mType(){return this.#e}set mType(t){this.#e=t}get selected(){return this.mSelected}set selected(t){this.mSelected=this.parseBoolean(t)}get type(){return this.mType}set type(t){if(t!=="primary"&&t!=="secondary"){this.mType="secondary";return}this.mType=t}parseBoolean(t){if(typeof t=="string"){let e=t.toLowerCase();if(e==="true"||e==="false")return e==="true"}return!!t}static{Sr()}};var jr=`:host {\r
    --information-icon-color: red;\r
    --information-icon-background-color: red;\r
    --information-background-color: red;\r
    --information-border-color: red;\r
    --information-shadow-color: red;\r
\r
    display: inline-block;\r
}\r
\r
.icon {\r
    /* Anchor for the information panel positioning. */\r
    anchor-name: --kg-information-anchor;\r
\r
    box-sizing: border-box;\r
    display: flex;\r
    align-items: center;\r
    justify-content: center;\r
\r
    /* Round "i" badge. */\r
    width: 16px;\r
    height: 16px;\r
    background-color: var(--information-icon-background-color);\r
    border: 1px solid var(--information-icon-color);\r
    border-radius: 50%;\r
\r
    color: var(--information-icon-color);\r
    \r
    /* Shitty "i" as icon. Needs a fixed font family. */\r
    font-family: Georgia, 'Times New Roman', serif;\r
    font-style: italic;\r
    font-weight: bold;\r
    font-size: 11px;\r
    line-height: 1;\r
\r
    user-select: none;\r
    cursor: help;\r
\r
    /* Half visible until hovered. */\r
    opacity: 0.5;\r
    transition: opacity 0.15s ease-in-out;\r
}\r
\r
:host(:hover) .icon {\r
    opacity: 1;\r
}\r
\r
.information {\r
    /* Anchored to the icon. */\r
    position: absolute;\r
    position-anchor: --kg-information-anchor;\r
\r
    /* Default placement: bottom right of the icon. */\r
    top: calc(anchor(bottom) + 10px);\r
    left: calc(anchor(left) + 10px);\r
\r
    /* Reposition into whichever space is available. */\r
    position-try-fallbacks: --kg-information-bottom-left, --kg-information-top-right, --kg-information-top-left;\r
\r
    z-index: 1;\r
\r
    flex-direction: column;\r
    box-sizing: border-box;\r
    width: max-content;\r
    max-width: 320px;\r
    padding: 8px;\r
\r
    border: 1px solid var(--potatno-color-border);\r
    border-radius: 2px;\r
\r
    box-shadow: 0 10px 30px var(--potatno-color-shadow);\r
    background-color: var(--information-background-color);\r
    color: var(--potatno-color-text);\r
    overflow: hidden;\r
\r
    /* Hidden until the component is hovered. */\r
    display: none;\r
\r
    /* Animation properties (same as kg-popup). */\r
    transition: opacity 0.15s ease-in-out, translate 0.15s ease-in-out, display 0.15s allow-discrete;\r
    opacity: 0;\r
    translate: 0px -10px;\r
}\r
\r
:host(:hover) .information {\r
    display: flex;\r
    opacity: 1;\r
    translate: 0px 0px;\r
\r
    /* Animate from hidden and slightly above. */\r
    @starting-style {\r
        opacity: 0;\r
        translate: 0px -10px;\r
    }\r
}\r
\r
/* Bottom left: below the icon, extending to the left. */\r
@position-try --kg-information-bottom-left {\r
    top: calc(anchor(bottom) + 10px);\r
    right: anchor(right);\r
    bottom: auto;\r
    left: auto;\r
}\r
\r
/* Top right: above the icon, extending to the right. */\r
@position-try --kg-information-top-right {\r
    top: auto;\r
    right: auto;\r
    bottom: calc(anchor(top) + 10px);\r
    left: anchor(left);\r
}\r
\r
/* Top left: above the icon, extending to the left. */\r
@position-try --kg-information-top-left {\r
    top: auto;\r
    right: anchor(right);\r
    bottom: calc(anchor(top) + 10px);\r
    left: auto;\r
}`;var Vr=`<div class="icon">i</div>\r
<div class="information">\r
    $slot\r
</div>\r
`;function Ca(){function v(l,n){return function(c){e(n,"addInitializer"),r(c,"An initializer"),l.push(c)}}function t(l,n,h,c,o,b,p,T,x){var m;switch(o){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var s={kind:m,name:p?"#"+n:n,static:b,private:p,metadata:T},f={v:!1};s.addInitializer=v(c,f);var i,a;if(o===0?p?(i=h.get,a=h.set):(i=function(){return this[n]},a=function(g){this[n]=g}):o===2?i=function(){return h.value}:((o===1||o===3)&&(i=function(){return h.get.call(this)}),(o===1||o===4)&&(a=function(g){h.set.call(this,g)})),p)s.access=i&&a?{get:i,set:a}:i?{get:i}:{set:a};else{if(i){var C=i;i=function(g){return arguments.length===0&&(g=this),C.call(g)}}if(a){var P=a;a=function(g,_){return arguments.length===1&&(_=g,g=this),P.call(g,_)}}var E=function(g){return n in g};s.access=i&&a?{has:E,get:i,set:a}:i?{has:E,get:i}:{has:E,set:a}}try{return l(x,s)}finally{f.v=!0}}function e(l,n){if(l.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(l,n){if(typeof l!="function")throw new TypeError(n+" must be a function")}function u(l,n){var h=typeof n;if(l===1){if(h!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(h!=="function"){var c;throw l===0?c="field":l===10?c="class":c="method",new TypeError(c+" decorators must return a function or void 0")}}function d(l,n,h,c,o,b,p,T,x){var m=h[0],s,f,i;p?o===0||o===1?s={get:h[3],set:h[4]}:o===3?s={get:h[3]}:o===4?s={set:h[3]}:s={value:h[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,c)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var a,C,P;if(typeof m=="function")a=t(m,c,s,T,o,b,p,x,i),a!==void 0&&(u(o,a),o===0?f=a:o===1?(f=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a);else for(var E=m.length-1;E>=0;E--){var g=m[E];if(a=t(g,c,s,T,o,b,p,x,i),a!==void 0){u(o,a);var _;o===0?_=a:o===1?(_=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a,_!==void 0&&(f===void 0?f=_:typeof f=="function"?f=[f,_]:f.push(_))}}if(o===0||o===1){if(f===void 0)f=function(M,I){return I};else if(typeof f!="function"){var F=f;f=function(M,I){for(var A=I,L=0;L<F.length;L++)A=F[L].call(M,A);return A}}else{var j=f;f=function(M,I){return j.call(M,I)}}l.push(f)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),p?o===1?(l.push(function(M,I){return i.get.call(M,I)}),l.push(function(M,I){return i.set.call(M,I)})):o===2?l.push(i):l.push(function(M,I){return i.call(M,I)}):Object.defineProperty(n,c,s))}function y(l,n,h){for(var c=[],o,b,p=new Map,T=new Map,x=0;x<n.length;x++){var m=n[x];if(Array.isArray(m)){var s=m[1],f=m[2],i=m.length>3,a=s>=5,C,P;if(a?(C=l,s=s-5,b=b||[],P=b):(C=l.prototype,o=o||[],P=o),s!==0&&!i){var E=a?T:p,g=E.get(f)||0;if(g===!0||g===3&&s!==4||g===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!g&&s>2?E.set(f,s):E.set(f,!0)}d(c,C,m,f,s,a,i,P,h)}}return w(c,o),w(c,b),c}function w(l,n){n&&l.push(function(h){for(var c=0;c<n.length;c++)n[c].call(h);return h})}function D(l,n,h){if(n.length>0){for(var c=[],o=l,b=l.name,p=n.length-1;p>=0;p--){var T={v:!1};try{var x=n[p](o,{kind:"class",name:b,addInitializer:v(c,T),metadata:h})}finally{T.v=!0}x!==void 0&&(u(10,x),o=x)}return[S(o,h),function(){for(var m=0;m<c.length;m++)c[m].call(o)}]}}function S(l,n){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,h,c,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var p=Object.create(b===void 0?null:b),T=y(n,h,p);return c.length||S(n,p),{e:T,get c(){return D(n,c,p)}}}}function Br(v,t,e,r){return(Br=Ca())(v,t,e,r)}var Ur,$r,Xr;Ur=B({selector:"kg-information",template:Vr,style:jr});var Gr=class{static{({c:[Xr,$r]}=Br(this,[],[Ur]))}static{$r()}};var Hr=`:host {\r
    --popup-border-color: red;\r
    --popup-shadow-color: red;\r
    --popup-background-color: red;\r
\r
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
    transition: opacity 0.15s ease-in-out, translate 0.15s ease-in-out, left 0.05s ease-in-out, top 0.05s ease-in-out;\r
    opacity: 1;\r
    translate: 0px 0px;\r
\r
    /* Animate from hidden and slightly above */\r
    @starting-style {\r
        opacity: 0;\r
    }\r
}\r
\r
:host([animate=top]) {\r
    @starting-style {\r
        translate: 0px -20px;\r
    }\r
}\r
\r
:host([animate=right]) {\r
    @starting-style {\r
        translate: -20px 0px;\r
    }\r
}\r
\r
:host([animate=bottom]) {\r
    @starting-style {\r
        translate: 0px 20px;\r
    }\r
}\r
\r
:host([animate=right]) {\r
    @starting-style {\r
        translate: 20px 0px;\r
    }\r
}`;var Yr="$slot";function Sa(){function v(l,n){return function(c){e(n,"addInitializer"),r(c,"An initializer"),l.push(c)}}function t(l,n,h,c,o,b,p,T,x){var m;switch(o){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var s={kind:m,name:p?"#"+n:n,static:b,private:p,metadata:T},f={v:!1};s.addInitializer=v(c,f);var i,a;if(o===0?p?(i=h.get,a=h.set):(i=function(){return this[n]},a=function(g){this[n]=g}):o===2?i=function(){return h.value}:((o===1||o===3)&&(i=function(){return h.get.call(this)}),(o===1||o===4)&&(a=function(g){h.set.call(this,g)})),p)s.access=i&&a?{get:i,set:a}:i?{get:i}:{set:a};else{if(i){var C=i;i=function(g){return arguments.length===0&&(g=this),C.call(g)}}if(a){var P=a;a=function(g,_){return arguments.length===1&&(_=g,g=this),P.call(g,_)}}var E=function(g){return n in g};s.access=i&&a?{has:E,get:i,set:a}:i?{has:E,get:i}:{has:E,set:a}}try{return l(x,s)}finally{f.v=!0}}function e(l,n){if(l.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(l,n){if(typeof l!="function")throw new TypeError(n+" must be a function")}function u(l,n){var h=typeof n;if(l===1){if(h!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(h!=="function"){var c;throw l===0?c="field":l===10?c="class":c="method",new TypeError(c+" decorators must return a function or void 0")}}function d(l,n,h,c,o,b,p,T,x){var m=h[0],s,f,i;p?o===0||o===1?s={get:h[3],set:h[4]}:o===3?s={get:h[3]}:o===4?s={set:h[3]}:s={value:h[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,c)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var a,C,P;if(typeof m=="function")a=t(m,c,s,T,o,b,p,x,i),a!==void 0&&(u(o,a),o===0?f=a:o===1?(f=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a);else for(var E=m.length-1;E>=0;E--){var g=m[E];if(a=t(g,c,s,T,o,b,p,x,i),a!==void 0){u(o,a);var _;o===0?_=a:o===1?(_=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a,_!==void 0&&(f===void 0?f=_:typeof f=="function"?f=[f,_]:f.push(_))}}if(o===0||o===1){if(f===void 0)f=function(M,I){return I};else if(typeof f!="function"){var F=f;f=function(M,I){for(var A=I,L=0;L<F.length;L++)A=F[L].call(M,A);return A}}else{var j=f;f=function(M,I){return j.call(M,I)}}l.push(f)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),p?o===1?(l.push(function(M,I){return i.get.call(M,I)}),l.push(function(M,I){return i.set.call(M,I)})):o===2?l.push(i):l.push(function(M,I){return i.call(M,I)}):Object.defineProperty(n,c,s))}function y(l,n,h){for(var c=[],o,b,p=new Map,T=new Map,x=0;x<n.length;x++){var m=n[x];if(Array.isArray(m)){var s=m[1],f=m[2],i=m.length>3,a=s>=5,C,P;if(a?(C=l,s=s-5,b=b||[],P=b):(C=l.prototype,o=o||[],P=o),s!==0&&!i){var E=a?T:p,g=E.get(f)||0;if(g===!0||g===3&&s!==4||g===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!g&&s>2?E.set(f,s):E.set(f,!0)}d(c,C,m,f,s,a,i,P,h)}}return w(c,o),w(c,b),c}function w(l,n){n&&l.push(function(h){for(var c=0;c<n.length;c++)n[c].call(h);return h})}function D(l,n,h){if(n.length>0){for(var c=[],o=l,b=l.name,p=n.length-1;p>=0;p--){var T={v:!1};try{var x=n[p](o,{kind:"class",name:b,addInitializer:v(c,T),metadata:h})}finally{T.v=!0}x!==void 0&&(u(10,x),o=x)}return[S(o,h),function(){for(var m=0;m<c.length;m++)c[m].call(o)}]}}function S(l,n){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,h,c,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var p=Object.create(b===void 0?null:b),T=y(n,h,p);return c.length||S(n,p),{e:T,get c(){return D(n,c,p)}}}}function qr(v,t,e,r){return(qr=Sa())(v,t,e,r)}var Jr,Wr,se;Jr=B({selector:"kg-popup",template:Yr,style:Hr});var Zr=class{static{({c:[se,Wr]}=qr(this,[],[Jr]))}static{Wr()}};var Kr=`:host {\r
    --resize-box-handle-color: red;\r
    --resize-box-handle-size: 5px;\r
\r
    position: relative;\r
    display: flex;\r
    flex-direction: column;\r
\r
    /* Set restrictions to never exeeds blounding restrictions set on the parent component. */\r
    min-height: 100%;\r
    min-width: 100%;\r
}\r
\r
:host:has(.snap) {\r
    /* Snappy animation on movement. */\r
    transition: width 0.1s cubic-bezier(0, 1.5, 1, 1), height 0.1s cubic-bezier(0, 1.5, 1, 1);\r
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
}`;var Qr=`<!-- In order of top-left clockwise. Needed for styling -->\r
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
<div class="content-container {{this.snap > 1 ? 'snap' : ''}}">\r
    $slot\r
</div>`;function Aa(){function v(l,n){return function(c){e(n,"addInitializer"),r(c,"An initializer"),l.push(c)}}function t(l,n,h,c,o,b,p,T,x){var m;switch(o){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var s={kind:m,name:p?"#"+n:n,static:b,private:p,metadata:T},f={v:!1};s.addInitializer=v(c,f);var i,a;if(o===0?p?(i=h.get,a=h.set):(i=function(){return this[n]},a=function(g){this[n]=g}):o===2?i=function(){return h.value}:((o===1||o===3)&&(i=function(){return h.get.call(this)}),(o===1||o===4)&&(a=function(g){h.set.call(this,g)})),p)s.access=i&&a?{get:i,set:a}:i?{get:i}:{set:a};else{if(i){var C=i;i=function(g){return arguments.length===0&&(g=this),C.call(g)}}if(a){var P=a;a=function(g,_){return arguments.length===1&&(_=g,g=this),P.call(g,_)}}var E=function(g){return n in g};s.access=i&&a?{has:E,get:i,set:a}:i?{has:E,get:i}:{has:E,set:a}}try{return l(x,s)}finally{f.v=!0}}function e(l,n){if(l.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(l,n){if(typeof l!="function")throw new TypeError(n+" must be a function")}function u(l,n){var h=typeof n;if(l===1){if(h!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(h!=="function"){var c;throw l===0?c="field":l===10?c="class":c="method",new TypeError(c+" decorators must return a function or void 0")}}function d(l,n,h,c,o,b,p,T,x){var m=h[0],s,f,i;p?o===0||o===1?s={get:h[3],set:h[4]}:o===3?s={get:h[3]}:o===4?s={set:h[3]}:s={value:h[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,c)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var a,C,P;if(typeof m=="function")a=t(m,c,s,T,o,b,p,x,i),a!==void 0&&(u(o,a),o===0?f=a:o===1?(f=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a);else for(var E=m.length-1;E>=0;E--){var g=m[E];if(a=t(g,c,s,T,o,b,p,x,i),a!==void 0){u(o,a);var _;o===0?_=a:o===1?(_=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a,_!==void 0&&(f===void 0?f=_:typeof f=="function"?f=[f,_]:f.push(_))}}if(o===0||o===1){if(f===void 0)f=function(M,I){return I};else if(typeof f!="function"){var F=f;f=function(M,I){for(var A=I,L=0;L<F.length;L++)A=F[L].call(M,A);return A}}else{var j=f;f=function(M,I){return j.call(M,I)}}l.push(f)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),p?o===1?(l.push(function(M,I){return i.get.call(M,I)}),l.push(function(M,I){return i.set.call(M,I)})):o===2?l.push(i):l.push(function(M,I){return i.call(M,I)}):Object.defineProperty(n,c,s))}function y(l,n,h){for(var c=[],o,b,p=new Map,T=new Map,x=0;x<n.length;x++){var m=n[x];if(Array.isArray(m)){var s=m[1],f=m[2],i=m.length>3,a=s>=5,C,P;if(a?(C=l,s=s-5,b=b||[],P=b):(C=l.prototype,o=o||[],P=o),s!==0&&!i){var E=a?T:p,g=E.get(f)||0;if(g===!0||g===3&&s!==4||g===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!g&&s>2?E.set(f,s):E.set(f,!0)}d(c,C,m,f,s,a,i,P,h)}}return w(c,o),w(c,b),c}function w(l,n){n&&l.push(function(h){for(var c=0;c<n.length;c++)n[c].call(h);return h})}function D(l,n,h){if(n.length>0){for(var c=[],o=l,b=l.name,p=n.length-1;p>=0;p--){var T={v:!1};try{var x=n[p](o,{kind:"class",name:b,addInitializer:v(c,T),metadata:h})}finally{T.v=!0}x!==void 0&&(u(10,x),o=x)}return[S(o,h),function(){for(var m=0;m<c.length;m++)c[m].call(o)}]}}function S(l,n){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,h,c,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var p=Object.create(b===void 0?null:b),T=y(n,h,p);return c.length||S(n,p),{e:T,get c(){return D(n,c,p)}}}}function sn(v,t,e,r){return(sn=Aa())(v,t,e,r)}var an,kr,ln,cn,un,tn,en,on,rn,Mt;an=B({selector:"kg-resize-box",template:Qr,style:Kr}),ln=$.state({proxy:!0}),cn=vt("resize"),un=vt("resize-end");var nn=class{static{({e:[tn,en,on,rn],c:[Mt,kr]}=sn(this,[[ln,1,"mConfiguration"],[cn,1,"mResize"],[un,1,"mResizeEnd"],[H,3,"bottom"],[H,3,"height"],[H,3,"left"],[H,3,"right"],[H,3,"snap"],[H,3,"top"],[H,3,"virtual"],[H,3,"width"]],[an]))}constructor(t=O.use(G)){this.mComponentElement=t.element,this.mConfiguration={snap:1,isVirtual:!1,enabledDirections:{top:!1,right:!1,bottom:!1,left:!1}}}mComponentElement;#t=(rn(this),tn(this));get mConfiguration(){return this.#t}set mConfiguration(t){this.#t=t}#e=en(this);get mResize(){return this.#e}set mResize(t){this.#e=t}#o=on(this);get mResizeEnd(){return this.#o}set mResizeEnd(t){this.#o=t}get bottom(){return this.mConfiguration.enabledDirections.bottom}set bottom(t){this.mConfiguration.enabledDirections.bottom=this.parseBoolean(t)}get height(){return this.mComponentElement.clientHeight}set height(t){this.updateComponentHeight(t,!0)}get left(){return this.mConfiguration.enabledDirections.left}set left(t){this.mConfiguration.enabledDirections.left=this.parseBoolean(t)}get right(){return this.mConfiguration.enabledDirections.right}set right(t){this.mConfiguration.enabledDirections.right=this.parseBoolean(t)}get snap(){return this.mConfiguration.snap}set snap(t){this.mConfiguration.snap=parseInt(t.toString())}get top(){return this.mConfiguration.enabledDirections.top}set top(t){this.mConfiguration.enabledDirections.top=this.parseBoolean(t)}get virtual(){return this.mConfiguration.isVirtual}set virtual(t){this.mConfiguration.isVirtual=this.parseBoolean(t)}get width(){return this.mComponentElement.clientWidth}set width(t){this.updateComponentWidth(t,!0)}resizeCorner(t){this.handleResize(t,"both")}resizeHorizontal(t){this.handleResize(t,"horizontal")}resizeVertical(t){this.handleResize(t,"vertical")}applyComponentSize(t,e,r){let u=this.updateComponentWidth(e,!1),d=this.updateComponentHeight(r,!1);return(u!==this.width||d!==this.height)&&this.mResize.dispatchEvent(this.createResizeEvent(t,u,d,this.width,this.height)),[u,d]}createResizeEvent(t,e,r,u,d){let y=t;return e===u&&(y&=~(bt.right|bt.left)),r===d&&(y&=~(bt.top|bt.bottom)),new to(e,r,y)}handleResize(t,e){t.preventDefault(),t.stopPropagation();let r=this.mComponentElement.getBoundingClientRect(),u=this.mComponentElement.offsetWidth?r.width/this.mComponentElement.offsetWidth:1,d=this.mComponentElement.offsetHeight?r.height/this.mComponentElement.offsetHeight:1,y=r.width/u,w=r.height/d,D=t.clientX,S=t.clientY,l=1;Math.abs(D-r.left)<Math.abs(D-r.right)&&(l=-1);let n=1;Math.abs(S-r.top)<Math.abs(S-r.bottom)&&(n=-1);let h=0;h+=l===1?bt.right:bt.left,h+=n===1?bt.bottom:bt.top;let c=y,o=w,b=T=>{let x=(T.clientX-D)/u*l,m=(T.clientY-S)/d*n,s=y+x,f=w+m;e==="horizontal"&&(s=y),e==="vertical"&&(f=w),[c,o]=this.applyComponentSize(h,s,f)},p=()=>{document.removeEventListener("pointermove",b),document.removeEventListener("pointerup",p),(c!==y||o!==w)&&this.mResizeEnd.dispatchEvent(this.createResizeEvent(h,c,o,y,w))};document.addEventListener("pointermove",b),document.addEventListener("pointerup",p)}parseBoolean(t){return!!(()=>{if(typeof t=="string"){let r=t.toLowerCase();if(["true","false"].includes(r))return r==="true"}return t})()}updateComponentHeight(t,e){if(!this.mConfiguration.enabledDirections.top&&!this.mConfiguration.enabledDirections.bottom)return this.height;t=Math.max(1,t);let r=Math.ceil(Math.abs(t)/this.mConfiguration.snap)*this.mConfiguration.snap*(t/Math.abs(t));return r=Math.max(0,r),(!this.mConfiguration.isVirtual||e)&&this.mComponentElement.style.setProperty("height",`${r}px`),r}updateComponentWidth(t,e){if(!this.mConfiguration.enabledDirections.left&&!this.mConfiguration.enabledDirections.right)return this.height;t=Math.max(1,t);let r=Math.ceil(Math.abs(t)/this.mConfiguration.snap)*this.mConfiguration.snap*(t/Math.abs(t));return r=Math.max(0,r),(!this.mConfiguration.isVirtual||e)&&this.mComponentElement.style.setProperty("width",`${r}px`),r}static{kr()}},to=class{mHeight;mResizeHandle;mWidth;get height(){return this.mHeight}get resizeHandle(){return this.mResizeHandle}get width(){return this.mWidth}constructor(t,e,r){this.mHeight=e,this.mResizeHandle=r,this.mWidth=t}},bt={top:1,right:2,bottom:4,left:8};var hn=`:host {\r
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
    width: 250px;\r
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
        --button-text-color: var(--potatno-color-text);\r
        --button-accent-color: var(--potatno-color-error);\r
        --button-accent-text-color: var(--potatno-color-text-contrast);\r
\r
        width: 18px;\r
        height: 18px;\r
        padding: 0px;\r
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
    --button-accent-color: var(--potatno-color-accent);\r
    --button-text-color: var(--potatno-color-text);\r
    --button-border-color: var(--potatno-color-border);\r
    --button-background-color: var(--potatno-color-background-light);\r
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
}`;var fn=`<kg-resize-box class="resize-box" right="true">\r
    <div class="function-list">\r
        $for(functionItem of this.documentFunctions) {\r
            <div class="function-item {{ this.functionItem.id === this.activeFunctionId ? 'active' : '' }}" (click)="this.selectFunction(this.functionItem)">\r
                <div class="function-item__icon" data-type="{{ this.functionItem.isSystem ? 's' : 'u' }}" title="{{ this.functionItem.isSystem ? 'System' : 'User' }}"/>\r
                <div class="function-item__name">{{this.functionItem.label}}</div>\r
\r
                $if(!this.functionItem.isSystem) {\r
                    <kg-button class="function-item__delete" type="secondary" (click)="this.deleteFunction(this.functionItem)">\u2715</kg-button>\r
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
            <kg-button class="add-action" type="primary" (click)="this.showPopup = !this.showPopup">\r
                <div>+</div>\r
                <div>Add Function</div>\r
            </kg-button>\r
        </div>\r
    }\r
</kg-resize-box>\r
`;function Oa(){function v(l,n){return function(c){e(n,"addInitializer"),r(c,"An initializer"),l.push(c)}}function t(l,n,h,c,o,b,p,T,x){var m;switch(o){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var s={kind:m,name:p?"#"+n:n,static:b,private:p,metadata:T},f={v:!1};s.addInitializer=v(c,f);var i,a;if(o===0?p?(i=h.get,a=h.set):(i=function(){return this[n]},a=function(g){this[n]=g}):o===2?i=function(){return h.value}:((o===1||o===3)&&(i=function(){return h.get.call(this)}),(o===1||o===4)&&(a=function(g){h.set.call(this,g)})),p)s.access=i&&a?{get:i,set:a}:i?{get:i}:{set:a};else{if(i){var C=i;i=function(g){return arguments.length===0&&(g=this),C.call(g)}}if(a){var P=a;a=function(g,_){return arguments.length===1&&(_=g,g=this),P.call(g,_)}}var E=function(g){return n in g};s.access=i&&a?{has:E,get:i,set:a}:i?{has:E,get:i}:{has:E,set:a}}try{return l(x,s)}finally{f.v=!0}}function e(l,n){if(l.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(l,n){if(typeof l!="function")throw new TypeError(n+" must be a function")}function u(l,n){var h=typeof n;if(l===1){if(h!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(h!=="function"){var c;throw l===0?c="field":l===10?c="class":c="method",new TypeError(c+" decorators must return a function or void 0")}}function d(l,n,h,c,o,b,p,T,x){var m=h[0],s,f,i;p?o===0||o===1?s={get:h[3],set:h[4]}:o===3?s={get:h[3]}:o===4?s={set:h[3]}:s={value:h[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,c)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var a,C,P;if(typeof m=="function")a=t(m,c,s,T,o,b,p,x,i),a!==void 0&&(u(o,a),o===0?f=a:o===1?(f=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a);else for(var E=m.length-1;E>=0;E--){var g=m[E];if(a=t(g,c,s,T,o,b,p,x,i),a!==void 0){u(o,a);var _;o===0?_=a:o===1?(_=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a,_!==void 0&&(f===void 0?f=_:typeof f=="function"?f=[f,_]:f.push(_))}}if(o===0||o===1){if(f===void 0)f=function(M,I){return I};else if(typeof f!="function"){var F=f;f=function(M,I){for(var A=I,L=0;L<F.length;L++)A=F[L].call(M,A);return A}}else{var j=f;f=function(M,I){return j.call(M,I)}}l.push(f)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),p?o===1?(l.push(function(M,I){return i.get.call(M,I)}),l.push(function(M,I){return i.set.call(M,I)})):o===2?l.push(i):l.push(function(M,I){return i.call(M,I)}):Object.defineProperty(n,c,s))}function y(l,n,h){for(var c=[],o,b,p=new Map,T=new Map,x=0;x<n.length;x++){var m=n[x];if(Array.isArray(m)){var s=m[1],f=m[2],i=m.length>3,a=s>=5,C,P;if(a?(C=l,s=s-5,b=b||[],P=b):(C=l.prototype,o=o||[],P=o),s!==0&&!i){var E=a?T:p,g=E.get(f)||0;if(g===!0||g===3&&s!==4||g===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!g&&s>2?E.set(f,s):E.set(f,!0)}d(c,C,m,f,s,a,i,P,h)}}return w(c,o),w(c,b),c}function w(l,n){n&&l.push(function(h){for(var c=0;c<n.length;c++)n[c].call(h);return h})}function D(l,n,h){if(n.length>0){for(var c=[],o=l,b=l.name,p=n.length-1;p>=0;p--){var T={v:!1};try{var x=n[p](o,{kind:"class",name:b,addInitializer:v(c,T),metadata:h})}finally{T.v=!0}x!==void 0&&(u(10,x),o=x)}return[S(o,h),function(){for(var m=0;m<c.length;m++)c[m].call(o)}]}}function S(l,n){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,h,c,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var p=Object.create(b===void 0?null:b),T=y(n,h,p);return c.length||S(n,p),{e:T,get c(){return D(n,c,p)}}}}function yn(v,t,e,r){return(yn=Oa())(v,t,e,r)}var bn,dn,wn,xn,mn,pn,gn,xo;bn=B({selector:"potatno-function-list",template:fn,style:hn,components:[Mt,se,Ht]}),wn=$.state({complexValue:!0}),xn=$.state();var vn=class{static{({e:[mn,pn,gn],c:[xo,dn]}=yn(this,[[wn,1,"documentFunctions"],[xn,1,"showPopup"]],[bn]))}constructor(t=O.use(Y)){this.mManager=t,this.documentFunctions=new Array,this.showPopup=!1,this.mUnsubscribe=this.mManager.subscribe(R.Document|R.Function|R.SpecialActiveFunction,()=>{this.documentFunctions=this.mManager.graph.document.functions.map(e=>({id:e.id,label:e.label,isSystem:e.isSystem,function:e}))})}mManager;mUnsubscribe;#t=(gn(this),mn(this));get documentFunctions(){return this.#t}set documentFunctions(t){this.#t=t}#e=pn(this);get showPopup(){return this.#e}set showPopup(t){this.#e=t}get activeFunctionId(){return this.mManager.activeFunction.id}get userFunctionDefinitions(){return[...this.mManager.project.userFunctions.values()]}createFunction(t){this.showPopup=!1,this.mManager.graph.addFunction(t.id)}deleteFunction(t){this.mManager.graph.removeFunction(t.id)}onDeconstruct(){this.mUnsubscribe()}selectFunction(t){this.mManager.setActiveFunction(t.function)}static{dn()}};var Tn=`:host {\r
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
}`;var Dn=`<kg-popup class="selection-popup" animate="top" (pointerdown)="this.stopPropagation($event, false)" (wheel)="this.stopPropagation($event, false)" (contextmenu)="this.stopPropagation($event, true);">\r
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
`;function ja(){function v(l,n){return function(c){e(n,"addInitializer"),r(c,"An initializer"),l.push(c)}}function t(l,n,h,c,o,b,p,T,x){var m;switch(o){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var s={kind:m,name:p?"#"+n:n,static:b,private:p,metadata:T},f={v:!1};s.addInitializer=v(c,f);var i,a;if(o===0?p?(i=h.get,a=h.set):(i=function(){return this[n]},a=function(g){this[n]=g}):o===2?i=function(){return h.value}:((o===1||o===3)&&(i=function(){return h.get.call(this)}),(o===1||o===4)&&(a=function(g){h.set.call(this,g)})),p)s.access=i&&a?{get:i,set:a}:i?{get:i}:{set:a};else{if(i){var C=i;i=function(g){return arguments.length===0&&(g=this),C.call(g)}}if(a){var P=a;a=function(g,_){return arguments.length===1&&(_=g,g=this),P.call(g,_)}}var E=function(g){return n in g};s.access=i&&a?{has:E,get:i,set:a}:i?{has:E,get:i}:{has:E,set:a}}try{return l(x,s)}finally{f.v=!0}}function e(l,n){if(l.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(l,n){if(typeof l!="function")throw new TypeError(n+" must be a function")}function u(l,n){var h=typeof n;if(l===1){if(h!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(h!=="function"){var c;throw l===0?c="field":l===10?c="class":c="method",new TypeError(c+" decorators must return a function or void 0")}}function d(l,n,h,c,o,b,p,T,x){var m=h[0],s,f,i;p?o===0||o===1?s={get:h[3],set:h[4]}:o===3?s={get:h[3]}:o===4?s={set:h[3]}:s={value:h[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,c)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var a,C,P;if(typeof m=="function")a=t(m,c,s,T,o,b,p,x,i),a!==void 0&&(u(o,a),o===0?f=a:o===1?(f=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a);else for(var E=m.length-1;E>=0;E--){var g=m[E];if(a=t(g,c,s,T,o,b,p,x,i),a!==void 0){u(o,a);var _;o===0?_=a:o===1?(_=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a,_!==void 0&&(f===void 0?f=_:typeof f=="function"?f=[f,_]:f.push(_))}}if(o===0||o===1){if(f===void 0)f=function(M,I){return I};else if(typeof f!="function"){var F=f;f=function(M,I){for(var A=I,L=0;L<F.length;L++)A=F[L].call(M,A);return A}}else{var j=f;f=function(M,I){return j.call(M,I)}}l.push(f)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),p?o===1?(l.push(function(M,I){return i.get.call(M,I)}),l.push(function(M,I){return i.set.call(M,I)})):o===2?l.push(i):l.push(function(M,I){return i.call(M,I)}):Object.defineProperty(n,c,s))}function y(l,n,h){for(var c=[],o,b,p=new Map,T=new Map,x=0;x<n.length;x++){var m=n[x];if(Array.isArray(m)){var s=m[1],f=m[2],i=m.length>3,a=s>=5,C,P;if(a?(C=l,s=s-5,b=b||[],P=b):(C=l.prototype,o=o||[],P=o),s!==0&&!i){var E=a?T:p,g=E.get(f)||0;if(g===!0||g===3&&s!==4||g===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!g&&s>2?E.set(f,s):E.set(f,!0)}d(c,C,m,f,s,a,i,P,h)}}return w(c,o),w(c,b),c}function w(l,n){n&&l.push(function(h){for(var c=0;c<n.length;c++)n[c].call(h);return h})}function D(l,n,h){if(n.length>0){for(var c=[],o=l,b=l.name,p=n.length-1;p>=0;p--){var T={v:!1};try{var x=n[p](o,{kind:"class",name:b,addInitializer:v(c,T),metadata:h})}finally{T.v=!0}x!==void 0&&(u(10,x),o=x)}return[S(o,h),function(){for(var m=0;m<c.length;m++)c[m].call(o)}]}}function S(l,n){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,h,c,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var p=Object.create(b===void 0?null:b),T=y(n,h,p);return c.length||S(n,p),{e:T,get c(){return D(n,c,p)}}}}function Nn(v,t,e,r){return(Nn=ja())(v,t,e,r)}function Va(v){return v}var An,En,Ln,Rn,On,Fn,zn,In,Cn,Pn,Mn,Sn,_n,ae;An=B({selector:"potatno-node-selection-popup",template:Dn,style:Tn,components:[se]}),Ln=$.state({complexValue:!0}),Rn=yt("searchInput"),On=vt("node-select"),Fn=$.state(),zn=$.state();new class extends Va{constructor(){super(ae),En()}static{class v{static{({e:[In,Cn,Pn,Mn,Sn,_n],c:[ae,En]}=Nn(this,[[H,3,"contextport"],[Ln,1,"results"],[Rn,1,"searchInput"],[On,1,"mNodeSelect"],[Fn,1,"searchValue"],[zn,1,"selectedDefinitionId"]],[An]))}static POPUP_HEIGHT=320;static POPUP_WIDTH=280;mNodes;mComponent;mManager;get contextport(){return this.mNodes.context}set contextport(e){this.mNodes.context=e,this.mNodes.list.filtered=this.contexturizeNodeList(this.mNodes.context)}#t=(_n(this),In(this));get results(){return this.#t}set results(e){this.#t=e}#e=Cn(this);get searchInput(){return this.#e}set searchInput(e){this.#e=e}#o=Pn(this);get mNodeSelect(){return this.#o}set mNodeSelect(e){this.#o=e}#r=Mn(this);get searchValue(){return this.#r}set searchValue(e){this.#r=e}#n=Sn(this);get selectedDefinitionId(){return this.#n}set selectedDefinitionId(e){this.#n=e}constructor(e=O.use(G),r=O.use(Y)){this.mManager=r,this.mComponent=e,this.selectedDefinitionId=null,this.results=new Array,this.searchValue="";let u=this.fetchNodeEntries();this.mNodes={context:null,list:{full:u,filtered:u}}}onConnect(){this.searchInput?.focus()}onKeyDown(e){if(this.results.length!==0){if(e.key==="ArrowDown"||e.key==="ArrowUp"){e.preventDefault();let r=this.results.findIndex(y=>y.definition.id===this.selectedDefinitionId);r=Math.max(0,r);let u=e.key==="ArrowDown"?1:-1,d=(r+u+this.results.length)%this.results.length;this.selectedDefinitionId=this.results[d].definition.id;return}e.key==="Enter"&&this.sendSelectedEntry(this.selectedDefinitionId)}}onUpdate(){this.results=this.filterResults(),this.results.some(r=>r.definition.id===this.selectedDefinitionId)||(this.selectedDefinitionId=this.results[0]?.definition.id??null);let e=this.mComponent.element.shadowRoot.querySelector(".selection-popup__result.selected");e&&e.scrollIntoView()}stopPropagation(e,r){e.stopPropagation(),r&&e.preventDefault()}contexturizeNodeList(e){return e?this.mNodes.list.full.filter(r=>!!this.findMatchingPortDefinition(e,r.definition)):this.mNodes.list.full}fetchNodeEntries(){return this.mManager.activeFunction.dynamicNodeDefinitions.map(e=>({category:e.category.name,definition:e,label:e.label.toLowerCase(),color:this.mManager.generateStringColor(e.category.name),icon:e.category.icon}))}filterResults(){let e=this.searchValue.trim().toLowerCase();return this.mNodes.list.filtered.filter(r=>r.label.includes(e))}findMatchingPortDefinition(e,r){let u=e.direction==="input"?r.outputs:r.inputs;for(let d of u)if(d.portType===e.portType&&d.dataType===e.dataType)return d;return null}sendSelectedEntry(e){if(e===null)return;let r=this.results.find(u=>u.definition.id===e);r&&this.mNodeSelect.dispatchEvent({definition:r.definition,port:this.mNodes.context?{source:this.mNodes.context,target:this.findMatchingPortDefinition(this.mNodes.context,r.definition)}:null})}}}};var jn=`:host {\r
    --node-border-radius: 2px;\r
    --node-border-color: color-mix(in srgb, var(--potatno-color-text) 30%, var(--potatno-color-background));\r
    --node-comment-color: var(--potatno-color-accent);\r
\r
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
}`;var Vn=`<!-- Resizeable part of node -->\r
<kg-resize-box #ResizeBox class="node {{this.editMode ? 'edit' : ''}}" top="true" right="true" bottom="true" left="true" [snap]="this.gridSize" virtual="true" (resize)="this.transformNodeData($event.value)">\r
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
`;function Ba(){function v(l,n){return function(c){e(n,"addInitializer"),r(c,"An initializer"),l.push(c)}}function t(l,n,h,c,o,b,p,T,x){var m;switch(o){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var s={kind:m,name:p?"#"+n:n,static:b,private:p,metadata:T},f={v:!1};s.addInitializer=v(c,f);var i,a;if(o===0?p?(i=h.get,a=h.set):(i=function(){return this[n]},a=function(g){this[n]=g}):o===2?i=function(){return h.value}:((o===1||o===3)&&(i=function(){return h.get.call(this)}),(o===1||o===4)&&(a=function(g){h.set.call(this,g)})),p)s.access=i&&a?{get:i,set:a}:i?{get:i}:{set:a};else{if(i){var C=i;i=function(g){return arguments.length===0&&(g=this),C.call(g)}}if(a){var P=a;a=function(g,_){return arguments.length===1&&(_=g,g=this),P.call(g,_)}}var E=function(g){return n in g};s.access=i&&a?{has:E,get:i,set:a}:i?{has:E,get:i}:{has:E,set:a}}try{return l(x,s)}finally{f.v=!0}}function e(l,n){if(l.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(l,n){if(typeof l!="function")throw new TypeError(n+" must be a function")}function u(l,n){var h=typeof n;if(l===1){if(h!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(h!=="function"){var c;throw l===0?c="field":l===10?c="class":c="method",new TypeError(c+" decorators must return a function or void 0")}}function d(l,n,h,c,o,b,p,T,x){var m=h[0],s,f,i;p?o===0||o===1?s={get:h[3],set:h[4]}:o===3?s={get:h[3]}:o===4?s={set:h[3]}:s={value:h[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,c)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var a,C,P;if(typeof m=="function")a=t(m,c,s,T,o,b,p,x,i),a!==void 0&&(u(o,a),o===0?f=a:o===1?(f=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a);else for(var E=m.length-1;E>=0;E--){var g=m[E];if(a=t(g,c,s,T,o,b,p,x,i),a!==void 0){u(o,a);var _;o===0?_=a:o===1?(_=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a,_!==void 0&&(f===void 0?f=_:typeof f=="function"?f=[f,_]:f.push(_))}}if(o===0||o===1){if(f===void 0)f=function(M,I){return I};else if(typeof f!="function"){var F=f;f=function(M,I){for(var A=I,L=0;L<F.length;L++)A=F[L].call(M,A);return A}}else{var j=f;f=function(M,I){return j.call(M,I)}}l.push(f)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),p?o===1?(l.push(function(M,I){return i.get.call(M,I)}),l.push(function(M,I){return i.set.call(M,I)})):o===2?l.push(i):l.push(function(M,I){return i.call(M,I)}):Object.defineProperty(n,c,s))}function y(l,n,h){for(var c=[],o,b,p=new Map,T=new Map,x=0;x<n.length;x++){var m=n[x];if(Array.isArray(m)){var s=m[1],f=m[2],i=m.length>3,a=s>=5,C,P;if(a?(C=l,s=s-5,b=b||[],P=b):(C=l.prototype,o=o||[],P=o),s!==0&&!i){var E=a?T:p,g=E.get(f)||0;if(g===!0||g===3&&s!==4||g===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!g&&s>2?E.set(f,s):E.set(f,!0)}d(c,C,m,f,s,a,i,P,h)}}return w(c,o),w(c,b),c}function w(l,n){n&&l.push(function(h){for(var c=0;c<n.length;c++)n[c].call(h);return h})}function D(l,n,h){if(n.length>0){for(var c=[],o=l,b=l.name,p=n.length-1;p>=0;p--){var T={v:!1};try{var x=n[p](o,{kind:"class",name:b,addInitializer:v(c,T),metadata:h})}finally{T.v=!0}x!==void 0&&(u(10,x),o=x)}return[S(o,h),function(){for(var m=0;m<c.length;m++)c[m].call(o)}]}}function S(l,n){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,h,c,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var p=Object.create(b===void 0?null:b),T=y(n,h,p);return c.length||S(n,p),{e:T,get c(){return D(n,c,p)}}}}function qn(v,t,e,r){return(qn=Ba())(v,t,e,r)}var Jn,$n,Kn,Qn,kn,ti,ei,oi,Gn,Bn,Un,Xn,Hn,Yn,Wn,Do;Jn=B({selector:"potatno-comment-node",template:Vn,style:jn,components:[Mt]}),Kn=$.state(),Qn=$.state(),kn=$.state(),ti=yt("CommentInput"),ei=vt("node-drag"),oi=yt("ResizeBox");var Zn=class{static{({e:[Gn,Bn,Un,Xn,Hn,Yn,Wn],c:[Do,$n]}=qn(this,[[Kn,1,"editMode"],[Qn,1,"enableBigview"],[kn,1,"gridZoom"],[H,3,"nodeData"],[ti,1,"mCommentInput"],[ei,1,"mDrag"],[oi,1,"mResizeBox"]],[Jn]))}constructor(t=O.use(G),e=O.use(Y)){this.mComponent=t,this.mManager=e,this.mNodeData=null,this.editMode=!1,this.enableBigview=!1,this.gridZoom=0,this.updateForZoomLevel(),this.mUnsubscribeGrid=this.mManager.subscribe(R.SpecialGrid,()=>{this.updateForZoomLevel()}),this.mUnsubscribe=this.mManager.subscribe(R.Node,r=>{r.item===this.mNodeData&&this.resyncComponent(this.nodeData)})}mComponent;mManager;mNodeData;mUnsubscribe;mUnsubscribeGrid;get comment(){return this.nodeData.label??""}set comment(t){this.nodeData.label=t}#t=(Wn(this),Gn(this));get editMode(){return this.#t}set editMode(t){this.#t=t}#e=Bn(this);get enableBigview(){return this.#e}set enableBigview(t){this.#e=t}#o=Un(this);get gridZoom(){return this.#o}set gridZoom(t){this.#o=t}get gridSize(){return this.mManager.grid.gridSize}get nodeData(){if(!this.mNodeData)throw new N("Node data not set.",this);return this.mNodeData}set nodeData(t){this.mNodeData=t,t&&(this.resyncComponent(t),this.mComponent.updater.update())}#r=Xn(this);get mCommentInput(){return this.#r}set mCommentInput(t){this.#r=t}#n=Hn(this);get mDrag(){return this.#n}set mDrag(t){this.#n=t}#i=Yn(this);get mResizeBox(){return this.#i}set mResizeBox(t){this.#i=t}dragNodeOrEnableEdit(t){if(t.preventDefault(),this.editMode||(t.button===2&&this.mManager.graph.removeNode(this.nodeData),t.button!==0))return;let e=this.nodeData.transformation.x*this.mManager.grid.gridSize,r=this.nodeData.transformation.y*this.mManager.grid.gridSize,u=this.nodeData.transformation.x,d=this.nodeData.transformation.y,y=this.mComponent.element.getBoundingClientRect(),w=this.mComponent.element.offsetWidth?y.width/this.mComponent.element.offsetWidth:1,D=this.mComponent.element.offsetHeight?y.height/this.mComponent.element.offsetHeight:1,S=t.clientX,l=t.clientY,n=c=>{c.stopPropagation();let o=(c.clientX-S)/w,b=(c.clientY-l)/D,p=Math.round((e+o)/this.mManager.grid.gridSize),T=Math.round((r+b)/this.mManager.grid.gridSize);u===p&&d===T||(this.mManager.graph.transformNode(this.nodeData,x=>{x.moveTo(p,T)}),this.mDrag.dispatchEvent(new To(p-u,T-d)),u=p,d=T)},h=()=>{document.removeEventListener("pointermove",n),document.removeEventListener("pointerup",h)};document.addEventListener("pointermove",n),document.addEventListener("pointerup",h)}escapeEditMode(t){(t.key==="Escape"||t.key==="Enter")&&(t.preventDefault(),this.editMode=!1)}onConnect(){this.resyncComponent(this.nodeData)}onDeconstruct(){this.mUnsubscribe(),this.mUnsubscribeGrid()}onUpdate(){this.mCommentInput&&this.getFocusedElement(document)!==this.mCommentInput&&this.mCommentInput.select()}transformNodeData(t){this.mManager.graph.transformNode(this.nodeData,e=>{let r=e.transformation.width,u=e.transformation.height;e.resizeTo(t.width/this.mManager.grid.gridSize,t.height/this.mManager.grid.gridSize);let d=e.transformation.width-r,y=e.transformation.height-u;y!==0&&(t.resizeHandle&bt.top)>0&&e.moveTo(e.transformation.x,e.transformation.y-y),d!==0&&(t.resizeHandle&bt.left)>0&&e.moveTo(e.transformation.x-d,e.transformation.y)})}getFocusedElement(t){let e=t.activeElement;return e?e.shadowRoot?this.getFocusedElement(e.shadowRoot):e:null}resyncComponent(t){let e=t.transformation.x*this.mManager.grid.gridSize,r=t.transformation.y*this.mManager.grid.gridSize;if(this.mComponent.element.style.setProperty("left",`${e}px`),this.mComponent.element.style.setProperty("top",`${r}px`),this.mResizeBox){let u=t.transformation.width*this.mManager.grid.gridSize,d=t.transformation.height*this.mManager.grid.gridSize;this.mResizeBox.width=u,this.mResizeBox.height=d}this.mComponent.updater.updateAsync()}updateForZoomLevel(){this.enableBigview=this.mManager.grid.zoom<.25,this.enableBigview&&(this.gridZoom=this.mManager.grid.zoom),this.mComponent.element.style.setProperty("z-index",(this.enableBigview?9999:-1).toString())}static{$n()}},To=class{mX;mY;get x(){return this.mX}get y(){return this.mY}constructor(t,e){this.mX=t,this.mY=e}};var ri=`:host {\r
    --potatno-port-value-size: 5px;\r
    --potatno-port-flow-size: 15px;\r
    --potatno-port-handle-width: max(var(--potatno-port-value-size), var(--potatno-port-flow-size));\r
\r
    display: block;\r
    position: relative;\r
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
}`;var ni=`<div class="port-wrapper {{this.portDirection}}" style="--type-color: {{this.portColor}}" (dragover)="this.onDragOver($event)" (drop)="this.onDrop($event)">\r
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
`;function Ha(){function v(l,n){return function(c){e(n,"addInitializer"),r(c,"An initializer"),l.push(c)}}function t(l,n,h,c,o,b,p,T,x){var m;switch(o){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var s={kind:m,name:p?"#"+n:n,static:b,private:p,metadata:T},f={v:!1};s.addInitializer=v(c,f);var i,a;if(o===0?p?(i=h.get,a=h.set):(i=function(){return this[n]},a=function(g){this[n]=g}):o===2?i=function(){return h.value}:((o===1||o===3)&&(i=function(){return h.get.call(this)}),(o===1||o===4)&&(a=function(g){h.set.call(this,g)})),p)s.access=i&&a?{get:i,set:a}:i?{get:i}:{set:a};else{if(i){var C=i;i=function(g){return arguments.length===0&&(g=this),C.call(g)}}if(a){var P=a;a=function(g,_){return arguments.length===1&&(_=g,g=this),P.call(g,_)}}var E=function(g){return n in g};s.access=i&&a?{has:E,get:i,set:a}:i?{has:E,get:i}:{has:E,set:a}}try{return l(x,s)}finally{f.v=!0}}function e(l,n){if(l.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(l,n){if(typeof l!="function")throw new TypeError(n+" must be a function")}function u(l,n){var h=typeof n;if(l===1){if(h!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(h!=="function"){var c;throw l===0?c="field":l===10?c="class":c="method",new TypeError(c+" decorators must return a function or void 0")}}function d(l,n,h,c,o,b,p,T,x){var m=h[0],s,f,i;p?o===0||o===1?s={get:h[3],set:h[4]}:o===3?s={get:h[3]}:o===4?s={set:h[3]}:s={value:h[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,c)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var a,C,P;if(typeof m=="function")a=t(m,c,s,T,o,b,p,x,i),a!==void 0&&(u(o,a),o===0?f=a:o===1?(f=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a);else for(var E=m.length-1;E>=0;E--){var g=m[E];if(a=t(g,c,s,T,o,b,p,x,i),a!==void 0){u(o,a);var _;o===0?_=a:o===1?(_=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a,_!==void 0&&(f===void 0?f=_:typeof f=="function"?f=[f,_]:f.push(_))}}if(o===0||o===1){if(f===void 0)f=function(M,I){return I};else if(typeof f!="function"){var F=f;f=function(M,I){for(var A=I,L=0;L<F.length;L++)A=F[L].call(M,A);return A}}else{var j=f;f=function(M,I){return j.call(M,I)}}l.push(f)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),p?o===1?(l.push(function(M,I){return i.get.call(M,I)}),l.push(function(M,I){return i.set.call(M,I)})):o===2?l.push(i):l.push(function(M,I){return i.call(M,I)}):Object.defineProperty(n,c,s))}function y(l,n,h){for(var c=[],o,b,p=new Map,T=new Map,x=0;x<n.length;x++){var m=n[x];if(Array.isArray(m)){var s=m[1],f=m[2],i=m.length>3,a=s>=5,C,P;if(a?(C=l,s=s-5,b=b||[],P=b):(C=l.prototype,o=o||[],P=o),s!==0&&!i){var E=a?T:p,g=E.get(f)||0;if(g===!0||g===3&&s!==4||g===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!g&&s>2?E.set(f,s):E.set(f,!0)}d(c,C,m,f,s,a,i,P,h)}}return w(c,o),w(c,b),c}function w(l,n){n&&l.push(function(h){for(var c=0;c<n.length;c++)n[c].call(h);return h})}function D(l,n,h){if(n.length>0){for(var c=[],o=l,b=l.name,p=n.length-1;p>=0;p--){var T={v:!1};try{var x=n[p](o,{kind:"class",name:b,addInitializer:v(c,T),metadata:h})}finally{T.v=!0}x!==void 0&&(u(10,x),o=x)}return[S(o,h),function(){for(var m=0;m<c.length;m++)c[m].call(o)}]}}function S(l,n){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,h,c,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var p=Object.create(b===void 0?null:b),T=y(n,h,p);return c.length||S(n,p),{e:T,get c(){return D(n,c,p)}}}}function ui(v,t,e,r){return(ui=Ha())(v,t,e,r)}var hi,ii,fi,di,si,ai,li,Se;hi=B({selector:"potatno-port",template:ni,style:ri}),fi=yt("dragConnection"),di=yt("dragPath");var ci=class{static{({e:[si,ai,li],c:[Se,ii]}=ui(this,[[fi,1,"mDragConnectionSvg"],[di,1,"mDragConnectionPath"],[H,3,"port"]],[hi]))}constructor(t=O.use(G),e=O.use(Y)){this.mComponent=t,this.mManager=e,this.mPort=null,this.mDragPositionEventHandler=r=>{this.mManager.grid.draggedPort.isDragging&&(performance.now()-r.timeStamp>100||this.renderDragWire(r.clientX,r.clientY))},document.addEventListener("dragover",this.mDragPositionEventHandler,{capture:!0}),this.mUnsubscribeValidation=this.mManager.subscribe(R.Connection|R.SpecialValidation,()=>{this.mComponent.updater.updateAsync()})}mComponent;mDragPositionEventHandler;mManager;mPort;mUnsubscribeValidation;#t=(li(this),si(this));get mDragConnectionSvg(){return this.#t}set mDragConnectionSvg(t){this.#t=t}#e=ai(this);get mDragConnectionPath(){return this.#e}set mDragConnectionPath(t){this.#e=t}get hasError(){return this.mManager.integrity.errorItems.has(this.port)}get inputDefinitions(){let t=this.port.project.types.getType(this.port.resolvedDataType);return t.inputs.map((e,r)=>({htmlType:(()=>{switch(e.type){case"boolean":return"checkbox";case"number":return"number";case"string":return"text"}})(),index:r,name:e.name,value:this.port.directValue[r]??"",totalCount:t.inputs.length}))}get isConnected(){return this.port.connectedPorts.size>0}get port(){if(!this.mPort)throw new N("Port is not setup",this);return this.mPort}set port(t){if(this.mPort!==t){if(t===null)throw new N("A null port cant be assigned.",this);this.mPort=t,this.mComponent.updater.update()}}get portColor(){return this.port.portType==="flow"?"var(--potatno-color-text)":this.mManager.generateStringColor(this.port.resolvedDataType)}get portDirection(){return this.port.direction??"output"}get portName(){return this.port.label??""}get portType(){return this.port.portType}get portValueType(){return this.port.portType!=="value"?"":this.port.resolvedDataType??""}get showValueInput(){return this.port.portType!=="value"||this.port.direction!=="input"||this.port.connectedPorts.size>0||this.mManager.grid.draggedPort.hasPort(this.port)?!1:!this.port.node.project.types.isGenericType(this.port.dataType??"")}onDeconstruct(){this.mUnsubscribeValidation(),document.removeEventListener("dragover",this.mDragPositionEventHandler,{capture:!0})}onDirectValueInput(t,e){let r=t.target,u=[...this.port.directValue];u[e]=r.type==="checkbox"?r.checked?"true":"false":r.value,this.mManager.graph.setPortDirectValue(this.port,u)}onDragEnd(t){t.stopPropagation(),t.preventDefault(),this.mDragConnectionPath?.removeAttribute("d"),this.mManager.grid.setDraggingPort([]),this.mComponent.updater.updateAsync()}onDragOver(t){this.draggedPortCanConnect()&&(t.preventDefault(),t.stopPropagation(),t.dataTransfer&&(t.dataTransfer.dropEffect="link"))}onDragStart(t){if(!t.dataTransfer){t.preventDefault();return}t.stopPropagation(),t.dataTransfer.effectAllowed="link",t.dataTransfer.setDragImage(document.createElement("div"),0,0),this.mManager.grid.setDraggingPort([this.port]),this.mComponent.updater.updateAsync()}onDrop(t){if(t.preventDefault(),t.stopPropagation(),!!this.draggedPortCanConnect()&&this.mManager.grid.draggedPort.isDragging)for(let e of this.mManager.grid.draggedPort.ports)this.mManager.graph.connectPorts(e,this.port)}createDragPath(t,e){let r=this.mManager.grid.pixelToGridSpace(t,e);return this.mManager.connections.createTemporaryPath(this.port,r).attributeValue}draggedPortCanConnect(){if(!this.mManager.grid.draggedPort.isDragging)return!1;for(let t of this.mManager.grid.draggedPort.ports)if(t!==this.port&&t.direction!==this.port.direction&&t.portType===this.port.portType)return!0;return!1}renderDragWire(t,e){if(!this.mManager.grid.draggedPort.hasPort(this.port)||!this.mDragConnectionSvg||!this.mManager.grid.draggedPort.updatePointer(t,e))return;let r=this.mManager.grid.draggedPort.portPositions.get(this.port);if(!r)return;let u=r.x*this.mManager.grid.gridSize,d=r.y*this.mManager.grid.gridSize;this.mDragConnectionSvg.style.setProperty("transform",`translate(${-u}px, ${-d}px)`),this.mDragConnectionPath?.setAttribute("d",this.createDragPath(t,e))}static{ii()}};var mi=`:host {\r
    --potatno-port-value-size: 5px;\r
    --potatno-port-flow-size: 15px;\r
    --potatno-port-width: max(var(--potatno-port-value-size), var(--potatno-port-flow-size));\r
\r
    display: block;\r
    font-family: var(--potatno-font-family);\r
    font-size: var(--potatno-font-size);\r
\r
    /* Snappy animation on movement. */\r
    transition: var(--potatno-position-snap-animation);\r
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
}`;var pi=`<div class="node" style="--type-color: {{this.portColor}}" (dragover)="this.onDragOver($event)" (drop)="this.onDrop($event)">\r
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
    `;function Za(){function v(l,n){return function(c){e(n,"addInitializer"),r(c,"An initializer"),l.push(c)}}function t(l,n,h,c,o,b,p,T,x){var m;switch(o){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var s={kind:m,name:p?"#"+n:n,static:b,private:p,metadata:T},f={v:!1};s.addInitializer=v(c,f);var i,a;if(o===0?p?(i=h.get,a=h.set):(i=function(){return this[n]},a=function(g){this[n]=g}):o===2?i=function(){return h.value}:((o===1||o===3)&&(i=function(){return h.get.call(this)}),(o===1||o===4)&&(a=function(g){h.set.call(this,g)})),p)s.access=i&&a?{get:i,set:a}:i?{get:i}:{set:a};else{if(i){var C=i;i=function(g){return arguments.length===0&&(g=this),C.call(g)}}if(a){var P=a;a=function(g,_){return arguments.length===1&&(_=g,g=this),P.call(g,_)}}var E=function(g){return n in g};s.access=i&&a?{has:E,get:i,set:a}:i?{has:E,get:i}:{has:E,set:a}}try{return l(x,s)}finally{f.v=!0}}function e(l,n){if(l.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(l,n){if(typeof l!="function")throw new TypeError(n+" must be a function")}function u(l,n){var h=typeof n;if(l===1){if(h!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(h!=="function"){var c;throw l===0?c="field":l===10?c="class":c="method",new TypeError(c+" decorators must return a function or void 0")}}function d(l,n,h,c,o,b,p,T,x){var m=h[0],s,f,i;p?o===0||o===1?s={get:h[3],set:h[4]}:o===3?s={get:h[3]}:o===4?s={set:h[3]}:s={value:h[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,c)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var a,C,P;if(typeof m=="function")a=t(m,c,s,T,o,b,p,x,i),a!==void 0&&(u(o,a),o===0?f=a:o===1?(f=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a);else for(var E=m.length-1;E>=0;E--){var g=m[E];if(a=t(g,c,s,T,o,b,p,x,i),a!==void 0){u(o,a);var _;o===0?_=a:o===1?(_=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a,_!==void 0&&(f===void 0?f=_:typeof f=="function"?f=[f,_]:f.push(_))}}if(o===0||o===1){if(f===void 0)f=function(M,I){return I};else if(typeof f!="function"){var F=f;f=function(M,I){for(var A=I,L=0;L<F.length;L++)A=F[L].call(M,A);return A}}else{var j=f;f=function(M,I){return j.call(M,I)}}l.push(f)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),p?o===1?(l.push(function(M,I){return i.get.call(M,I)}),l.push(function(M,I){return i.set.call(M,I)})):o===2?l.push(i):l.push(function(M,I){return i.call(M,I)}):Object.defineProperty(n,c,s))}function y(l,n,h){for(var c=[],o,b,p=new Map,T=new Map,x=0;x<n.length;x++){var m=n[x];if(Array.isArray(m)){var s=m[1],f=m[2],i=m.length>3,a=s>=5,C,P;if(a?(C=l,s=s-5,b=b||[],P=b):(C=l.prototype,o=o||[],P=o),s!==0&&!i){var E=a?T:p,g=E.get(f)||0;if(g===!0||g===3&&s!==4||g===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!g&&s>2?E.set(f,s):E.set(f,!0)}d(c,C,m,f,s,a,i,P,h)}}return w(c,o),w(c,b),c}function w(l,n){n&&l.push(function(h){for(var c=0;c<n.length;c++)n[c].call(h);return h})}function D(l,n,h){if(n.length>0){for(var c=[],o=l,b=l.name,p=n.length-1;p>=0;p--){var T={v:!1};try{var x=n[p](o,{kind:"class",name:b,addInitializer:v(c,T),metadata:h})}finally{T.v=!0}x!==void 0&&(u(10,x),o=x)}return[S(o,h),function(){for(var m=0;m<c.length;m++)c[m].call(o)}]}}function S(l,n){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,h,c,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var p=Object.create(b===void 0?null:b),T=y(n,h,p);return c.length||S(n,p),{e:T,get c(){return D(n,c,p)}}}}function Ti(v,t,e,r){return(Ti=Za())(v,t,e,r)}var Di,gi,Ei,Ii,Ci,vi,yi,bi,wi,Io;Di=B({selector:"potatno-conjunction-node",template:pi,style:mi,components:[Se]}),Ei=yt("dragConnection"),Ii=yt("dragPath"),Ci=vt("node-drag");var xi=class{static{({e:[vi,yi,bi,wi],c:[Io,gi]}=Ti(this,[[Ei,1,"mDragConnectionSvg"],[Ii,1,"mDragConnectionPath"],[Ci,1,"mDrag"],[H,3,"nodeData"]],[Di]))}constructor(t=O.use(G),e=O.use(Y)){this.mComponent=t,this.mManager=e,this.mNodeData=null,this.mDragPositionEventHandler=r=>{this.mManager.grid.draggedPort.isDragging&&(performance.now()-r.timeStamp>100||this.renderDragWire(r.clientX,r.clientY))},document.addEventListener("dragover",this.mDragPositionEventHandler,{capture:!0}),this.mUnsubscribeNodeChange=this.mManager.subscribe(R.Node,r=>{r.item===this.mNodeData&&this.resyncComponent(this.nodeData)}),this.mUnsubscribeValidation=this.mManager.subscribe(R.Connection|R.SpecialValidation,()=>{this.mComponent.updater.updateAsync()})}mComponent;mDragPositionEventHandler;mManager;mNodeData;mUnsubscribeNodeChange;mUnsubscribeValidation;#t=(wi(this),vi(this));get mDragConnectionSvg(){return this.#t}set mDragConnectionSvg(t){this.#t=t}#e=yi(this);get mDragConnectionPath(){return this.#e}set mDragConnectionPath(t){this.#e=t}#o=bi(this);get mDrag(){return this.#o}set mDrag(t){this.#o=t}get inputHasError(){return this.mManager.integrity.errorItems.has(this.nodeData)||this.mManager.integrity.errorItems.has(this.nodePorts.input)}get isInputConnected(){return this.nodePorts.input.connectedPorts.size>0}get isOutputConnected(){return this.nodePorts.output.connectedPorts.size>0}get nodeData(){if(!this.mNodeData)throw new N("Node data not set.",this);return this.mNodeData}set nodeData(t){this.mNodeData=t,t&&this.resyncComponent(t)}get outputHasError(){return this.mManager.integrity.errorItems.has(this.nodeData)||this.mManager.integrity.errorItems.has(this.nodePorts.output)}get portColor(){return this.portType==="flow"?"var(--potatno-color-text)":this.mManager.generateStringColor(this.portValueType)}get portType(){return this.nodeData.definitionId===K.DEFINITION_ID?"flow":"value"}get portValueType(){return this.portType!=="value"?"":this.nodePorts.input.resolvedDataType}get nodePorts(){if(this.nodeData.inputs.list.length===0||this.nodeData.outputs.list.length===0)throw new N("Malformed conjunction node",this);return{input:this.nodeData.inputs.list[0],output:this.nodeData.outputs.list[0]}}dragNode(t){if(t.preventDefault(),t.button===2&&this.mManager.graph.removeNode(this.nodeData),t.button!==0)return;let e=this.nodeData.transformation.x*this.mManager.grid.gridSize,r=this.nodeData.transformation.y*this.mManager.grid.gridSize,u=this.nodeData.transformation.x,d=this.nodeData.transformation.y,y=this.mComponent.element.getBoundingClientRect(),w=this.mComponent.element.offsetWidth?y.width/this.mComponent.element.offsetWidth:1,D=this.mComponent.element.offsetHeight?y.height/this.mComponent.element.offsetHeight:1,S=t.clientX,l=t.clientY,n=c=>{c.stopPropagation();let o=(c.clientX-S)/w,b=(c.clientY-l)/D,p=Math.round((e+o)/this.mManager.grid.gridSize),T=Math.round((r+b)/this.mManager.grid.gridSize);u===p&&d===T||(this.mManager.graph.transformNode(this.nodeData,x=>{x.moveTo(p,T)}),this.mDrag.dispatchEvent(new Eo(p-u,T-d)),u=p,d=T)},h=()=>{document.removeEventListener("pointermove",n),document.removeEventListener("pointerup",h)};document.addEventListener("pointermove",n),document.addEventListener("pointerup",h)}onDeconstruct(){this.mUnsubscribeNodeChange(),this.mUnsubscribeValidation(),document.removeEventListener("dragover",this.mDragPositionEventHandler,{capture:!0})}onDragEnd(t){t.stopPropagation(),t.preventDefault(),this.mDragConnectionPath?.removeAttribute("d"),this.mManager.grid.setDraggingPort([]),this.mComponent.updater.updateAsync()}onDragOver(t){this.draggedPortCanConnect()&&(t.preventDefault(),t.stopPropagation(),t.dataTransfer&&(t.dataTransfer.dropEffect="link"))}onDragStart(t){t.stopPropagation(),t.dataTransfer.effectAllowed="link",t.dataTransfer.setDragImage(document.createElement("div"),0,0),this.mManager.grid.setDraggingPort([this.nodePorts.input,this.nodePorts.output]),this.mComponent.updater.updateAsync()}onDrop(t){this.draggedPortCanConnect()&&(t.preventDefault(),t.stopPropagation(),this.mManager.grid.draggedPort.isDragging&&this.mManager.graph.mergeConnectPorts([...this.nodeData.inputs.list,...this.nodeData.outputs.list],this.mManager.grid.draggedPort.ports))}createDragPath(t,e){let r=this.mManager.grid.pixelToGridSpace(t,e);return this.mManager.connections.createTemporaryPath(this.nodePorts.input,r).attributeValue}draggedPortCanConnect(){if(!this.mManager.grid.draggedPort.isDragging)return!1;let t=this.nodePorts,e=[t.input,t.output];for(let r of this.mManager.grid.draggedPort.ports)for(let u of e)if(r!==u&&r.direction!==u.direction&&r.portType===u.portType)return!0;return!1}renderDragWire(t,e){let r=this.nodePorts.input;if(!this.mManager.grid.draggedPort.hasPort(r)||!this.mManager.grid.draggedPort.updatePointer(t,e))return;let u=this.mManager.grid.draggedPort.portPositions.get(r);if(!u)return;let d=u.x*this.mManager.grid.gridSize,y=u.y*this.mManager.grid.gridSize;this.mDragConnectionSvg?.style.setProperty("transform",`translate(${-d}px, ${-y}px)`),this.mDragConnectionPath?.setAttribute("d",this.createDragPath(t,e))}resyncComponent(t){let e=t.transformation.x*this.mManager.grid.gridSize,r=t.transformation.y*this.mManager.grid.gridSize;this.mComponent.element.style.setProperty("left",`${e}px`),this.mComponent.element.style.setProperty("top",`${r}px`),this.mComponent.updater.update()}static{gi()}},Eo=class{mX;mY;get x(){return this.mX}get y(){return this.mY}constructor(t,e){this.mX=t,this.mY=e}};var Pi=`:host {\r
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
}`;var Mi=`<svg class="svg-layer" xmlns="http://www.w3.org/2000/svg" >\r
    $for(connection of this.connections.values()){\r
        <g class="{{this.connection.state.hasError ? 'error' : ''}} {{this.connection.state.isNew ? 'new' : ''}}" style="--path-length: {{ this.connection.path.length }}; {{ this.connection.color ? \`--path-color: \${this.connection.color};\` : '' }}" xmlns="http://www.w3.org/2000/svg">\r
            <path class="path" d="{{this.connection.path.attributeValue}}" xmlns="http://www.w3.org/2000/svg"/>\r
            <path class="path path--mouse-target" d="{{this.connection.path.attributeValue}}" (pointerdown)="this.deleteConnection($event, this.connection)" (dblclick)="this.createConjunction($event, this.connection)" xmlns="http://www.w3.org/2000/svg"/>\r
        </g>\r
    }\r
</svg>\r
`;function Ka(){function v(l,n){return function(c){e(n,"addInitializer"),r(c,"An initializer"),l.push(c)}}function t(l,n,h,c,o,b,p,T,x){var m;switch(o){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var s={kind:m,name:p?"#"+n:n,static:b,private:p,metadata:T},f={v:!1};s.addInitializer=v(c,f);var i,a;if(o===0?p?(i=h.get,a=h.set):(i=function(){return this[n]},a=function(g){this[n]=g}):o===2?i=function(){return h.value}:((o===1||o===3)&&(i=function(){return h.get.call(this)}),(o===1||o===4)&&(a=function(g){h.set.call(this,g)})),p)s.access=i&&a?{get:i,set:a}:i?{get:i}:{set:a};else{if(i){var C=i;i=function(g){return arguments.length===0&&(g=this),C.call(g)}}if(a){var P=a;a=function(g,_){return arguments.length===1&&(_=g,g=this),P.call(g,_)}}var E=function(g){return n in g};s.access=i&&a?{has:E,get:i,set:a}:i?{has:E,get:i}:{has:E,set:a}}try{return l(x,s)}finally{f.v=!0}}function e(l,n){if(l.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(l,n){if(typeof l!="function")throw new TypeError(n+" must be a function")}function u(l,n){var h=typeof n;if(l===1){if(h!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(h!=="function"){var c;throw l===0?c="field":l===10?c="class":c="method",new TypeError(c+" decorators must return a function or void 0")}}function d(l,n,h,c,o,b,p,T,x){var m=h[0],s,f,i;p?o===0||o===1?s={get:h[3],set:h[4]}:o===3?s={get:h[3]}:o===4?s={set:h[3]}:s={value:h[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,c)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var a,C,P;if(typeof m=="function")a=t(m,c,s,T,o,b,p,x,i),a!==void 0&&(u(o,a),o===0?f=a:o===1?(f=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a);else for(var E=m.length-1;E>=0;E--){var g=m[E];if(a=t(g,c,s,T,o,b,p,x,i),a!==void 0){u(o,a);var _;o===0?_=a:o===1?(_=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a,_!==void 0&&(f===void 0?f=_:typeof f=="function"?f=[f,_]:f.push(_))}}if(o===0||o===1){if(f===void 0)f=function(M,I){return I};else if(typeof f!="function"){var F=f;f=function(M,I){for(var A=I,L=0;L<F.length;L++)A=F[L].call(M,A);return A}}else{var j=f;f=function(M,I){return j.call(M,I)}}l.push(f)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),p?o===1?(l.push(function(M,I){return i.get.call(M,I)}),l.push(function(M,I){return i.set.call(M,I)})):o===2?l.push(i):l.push(function(M,I){return i.call(M,I)}):Object.defineProperty(n,c,s))}function y(l,n,h){for(var c=[],o,b,p=new Map,T=new Map,x=0;x<n.length;x++){var m=n[x];if(Array.isArray(m)){var s=m[1],f=m[2],i=m.length>3,a=s>=5,C,P;if(a?(C=l,s=s-5,b=b||[],P=b):(C=l.prototype,o=o||[],P=o),s!==0&&!i){var E=a?T:p,g=E.get(f)||0;if(g===!0||g===3&&s!==4||g===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!g&&s>2?E.set(f,s):E.set(f,!0)}d(c,C,m,f,s,a,i,P,h)}}return w(c,o),w(c,b),c}function w(l,n){n&&l.push(function(h){for(var c=0;c<n.length;c++)n[c].call(h);return h})}function D(l,n,h){if(n.length>0){for(var c=[],o=l,b=l.name,p=n.length-1;p>=0;p--){var T={v:!1};try{var x=n[p](o,{kind:"class",name:b,addInitializer:v(c,T),metadata:h})}finally{T.v=!0}x!==void 0&&(u(10,x),o=x)}return[S(o,h),function(){for(var m=0;m<c.length;m++)c[m].call(o)}]}}function S(l,n){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,h,c,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var p=Object.create(b===void 0?null:b),T=y(n,h,p);return c.length||S(n,p),{e:T,get c(){return D(n,c,p)}}}}function Li(v,t,e,r){return(Li=Ka())(v,t,e,r)}var Ri,Si,Oi,_i,Ni,Co;Ri=B({selector:"potatno-connection-layer",template:Mi,style:Pi}),Oi=$.state({complexValue:!0});var Ai=class{static{({e:[_i,Ni],c:[Co,Si]}=Li(this,[[Oi,1,"connections"]],[Ri]))}constructor(t=O.use(Y)){this.mManager=t,this.connections=new Map;let e=0;this.mUnsubscribe=this.mManager.subscribe(R.SpecialActiveFunction|R.Node|R.Connection,()=>{e===0&&(e=requestAnimationFrame(()=>{e=0,this.updateConnections()}))})}mManager;mUnsubscribe;#t=(Ni(this),_i(this));get connections(){return this.#t}set connections(t){this.#t=t}createConjunction(t,e){t.preventDefault(),t.stopPropagation();let r=e.port.output.portType==="flow"?this.mManager.project.nodeDefinitions.get(K.DEFINITION_ID):this.mManager.project.nodeDefinitions.get(et.DEFINITION_ID),u=this.mManager.grid.pixelToGridSpace(t.clientX,t.clientY),d=this.mManager.graph.addNode(this.mManager.activeFunction,r,{x:u.x,y:u.y,height:0,width:0});this.mManager.graph.disconnectPorts(e.port.output,e.port.input);let y=d.inputs.list[0],w=d.outputs.list[0];this.mManager.graph.connectPorts(y,e.port.output),this.mManager.graph.connectPorts(y,e.port.input),this.mManager.graph.connectPorts(w,e.port.output),this.mManager.graph.connectPorts(w,e.port.input)}deleteConnection(t,e){t.button===2&&(t.preventDefault(),t.stopPropagation(),this.mManager.graph.disconnectPorts(e.port.output,e.port.input))}onDeconstruct(){this.mUnsubscribe()}createConnection(t,e,r){let u=this.mManager.integrity.errorItems,d=u.has(e)||u.has(r),y=(()=>{switch(r.portType){case"value":return r;case"flow":return e}})(),w=e.portType==="flow"?"":this.mManager.generateStringColor(e.resolvedDataType),D=this.mManager.connections.getConnectionPath(e,r);return{color:w,path:{attributeValue:D.attributeValue,length:D.length},state:{isNew:!t.has(y),hasError:d},port:{primary:y,output:e,input:r}}}updateConnections(){let t=this.connections;this.connections=new Map;for(let e of this.mManager.activeFunction.nodes)for(let r of e.outputs.list)for(let u of r.connectedPorts){let d=this.createConnection(t,r,u);this.connections.set(d.port.primary,d)}}static{Si()}};function Qa(){function v(l,n){return function(c){e(n,"addInitializer"),r(c,"An initializer"),l.push(c)}}function t(l,n,h,c,o,b,p,T,x){var m;switch(o){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var s={kind:m,name:p?"#"+n:n,static:b,private:p,metadata:T},f={v:!1};s.addInitializer=v(c,f);var i,a;if(o===0?p?(i=h.get,a=h.set):(i=function(){return this[n]},a=function(g){this[n]=g}):o===2?i=function(){return h.value}:((o===1||o===3)&&(i=function(){return h.get.call(this)}),(o===1||o===4)&&(a=function(g){h.set.call(this,g)})),p)s.access=i&&a?{get:i,set:a}:i?{get:i}:{set:a};else{if(i){var C=i;i=function(g){return arguments.length===0&&(g=this),C.call(g)}}if(a){var P=a;a=function(g,_){return arguments.length===1&&(_=g,g=this),P.call(g,_)}}var E=function(g){return n in g};s.access=i&&a?{has:E,get:i,set:a}:i?{has:E,get:i}:{has:E,set:a}}try{return l(x,s)}finally{f.v=!0}}function e(l,n){if(l.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(l,n){if(typeof l!="function")throw new TypeError(n+" must be a function")}function u(l,n){var h=typeof n;if(l===1){if(h!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(h!=="function"){var c;throw l===0?c="field":l===10?c="class":c="method",new TypeError(c+" decorators must return a function or void 0")}}function d(l,n,h,c,o,b,p,T,x){var m=h[0],s,f,i;p?o===0||o===1?s={get:h[3],set:h[4]}:o===3?s={get:h[3]}:o===4?s={set:h[3]}:s={value:h[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,c)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var a,C,P;if(typeof m=="function")a=t(m,c,s,T,o,b,p,x,i),a!==void 0&&(u(o,a),o===0?f=a:o===1?(f=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a);else for(var E=m.length-1;E>=0;E--){var g=m[E];if(a=t(g,c,s,T,o,b,p,x,i),a!==void 0){u(o,a);var _;o===0?_=a:o===1?(_=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a,_!==void 0&&(f===void 0?f=_:typeof f=="function"?f=[f,_]:f.push(_))}}if(o===0||o===1){if(f===void 0)f=function(M,I){return I};else if(typeof f!="function"){var F=f;f=function(M,I){for(var A=I,L=0;L<F.length;L++)A=F[L].call(M,A);return A}}else{var j=f;f=function(M,I){return j.call(M,I)}}l.push(f)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),p?o===1?(l.push(function(M,I){return i.get.call(M,I)}),l.push(function(M,I){return i.set.call(M,I)})):o===2?l.push(i):l.push(function(M,I){return i.call(M,I)}):Object.defineProperty(n,c,s))}function y(l,n,h){for(var c=[],o,b,p=new Map,T=new Map,x=0;x<n.length;x++){var m=n[x];if(Array.isArray(m)){var s=m[1],f=m[2],i=m.length>3,a=s>=5,C,P;if(a?(C=l,s=s-5,b=b||[],P=b):(C=l.prototype,o=o||[],P=o),s!==0&&!i){var E=a?T:p,g=E.get(f)||0;if(g===!0||g===3&&s!==4||g===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!g&&s>2?E.set(f,s):E.set(f,!0)}d(c,C,m,f,s,a,i,P,h)}}return w(c,o),w(c,b),c}function w(l,n){n&&l.push(function(h){for(var c=0;c<n.length;c++)n[c].call(h);return h})}function D(l,n,h){if(n.length>0){for(var c=[],o=l,b=l.name,p=n.length-1;p>=0;p--){var T={v:!1};try{var x=n[p](o,{kind:"class",name:b,addInitializer:v(c,T),metadata:h})}finally{T.v=!0}x!==void 0&&(u(10,x),o=x)}return[S(o,h),function(){for(var m=0;m<c.length;m++)c[m].call(o)}]}}function S(l,n){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,h,c,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var p=Object.create(b===void 0?null:b),T=y(n,h,p);return c.length||S(n,p),{e:T,get c(){return D(n,c,p)}}}}function ji(v,t,e,r){return(ji=Qa())(v,t,e,r)}var Vi,Fi,_e;Vi=It({access:q.Read,selector:/^potatno-preview$/});var zi=class{static{({c:[_e,Fi]}=ji(this,[],[Vi]))}constructor(t=O.use(k),e=O.use(W),r=O.use(it)){this.mTarget=t,this.mProcedure=e.createExpressionProcedure(r.value)}mProcedure;mTarget;onUpdate(){let t=this.mProcedure.execute();if(!t){let r=this.mTarget.childNodes.length>0;return r&&(this.mTarget.innerHTML=""),r}let e=t.element;return this.mTarget.contains(e)?!1:(this.mTarget.innerHTML="",this.mTarget.appendChild(e),!0)}static{Fi()}};var $i=`:host {\r
    --node-border-radius: 2px;\r
    --node-border-color: color-mix(in srgb, var(--potatno-color-text) 30%, var(--potatno-color-background));\r
    --node-preview-select-height: 24px;\r
\r
    display: block;\r
    font-family: var(--potatno-font-family);\r
    font-size: var(--potatno-font-size);\r
\r
    /* Snappy animation on movement. */\r
    transition: var(--potatno-position-snap-animation);\r
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
}`;var Gi=`<!-- Resizeable part of node -->\r
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
        `;function el(){function v(l,n){return function(c){e(n,"addInitializer"),r(c,"An initializer"),l.push(c)}}function t(l,n,h,c,o,b,p,T,x){var m;switch(o){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var s={kind:m,name:p?"#"+n:n,static:b,private:p,metadata:T},f={v:!1};s.addInitializer=v(c,f);var i,a;if(o===0?p?(i=h.get,a=h.set):(i=function(){return this[n]},a=function(g){this[n]=g}):o===2?i=function(){return h.value}:((o===1||o===3)&&(i=function(){return h.get.call(this)}),(o===1||o===4)&&(a=function(g){h.set.call(this,g)})),p)s.access=i&&a?{get:i,set:a}:i?{get:i}:{set:a};else{if(i){var C=i;i=function(g){return arguments.length===0&&(g=this),C.call(g)}}if(a){var P=a;a=function(g,_){return arguments.length===1&&(_=g,g=this),P.call(g,_)}}var E=function(g){return n in g};s.access=i&&a?{has:E,get:i,set:a}:i?{has:E,get:i}:{has:E,set:a}}try{return l(x,s)}finally{f.v=!0}}function e(l,n){if(l.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(l,n){if(typeof l!="function")throw new TypeError(n+" must be a function")}function u(l,n){var h=typeof n;if(l===1){if(h!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(h!=="function"){var c;throw l===0?c="field":l===10?c="class":c="method",new TypeError(c+" decorators must return a function or void 0")}}function d(l,n,h,c,o,b,p,T,x){var m=h[0],s,f,i;p?o===0||o===1?s={get:h[3],set:h[4]}:o===3?s={get:h[3]}:o===4?s={set:h[3]}:s={value:h[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,c)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var a,C,P;if(typeof m=="function")a=t(m,c,s,T,o,b,p,x,i),a!==void 0&&(u(o,a),o===0?f=a:o===1?(f=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a);else for(var E=m.length-1;E>=0;E--){var g=m[E];if(a=t(g,c,s,T,o,b,p,x,i),a!==void 0){u(o,a);var _;o===0?_=a:o===1?(_=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a,_!==void 0&&(f===void 0?f=_:typeof f=="function"?f=[f,_]:f.push(_))}}if(o===0||o===1){if(f===void 0)f=function(M,I){return I};else if(typeof f!="function"){var F=f;f=function(M,I){for(var A=I,L=0;L<F.length;L++)A=F[L].call(M,A);return A}}else{var j=f;f=function(M,I){return j.call(M,I)}}l.push(f)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),p?o===1?(l.push(function(M,I){return i.get.call(M,I)}),l.push(function(M,I){return i.set.call(M,I)})):o===2?l.push(i):l.push(function(M,I){return i.call(M,I)}):Object.defineProperty(n,c,s))}function y(l,n,h){for(var c=[],o,b,p=new Map,T=new Map,x=0;x<n.length;x++){var m=n[x];if(Array.isArray(m)){var s=m[1],f=m[2],i=m.length>3,a=s>=5,C,P;if(a?(C=l,s=s-5,b=b||[],P=b):(C=l.prototype,o=o||[],P=o),s!==0&&!i){var E=a?T:p,g=E.get(f)||0;if(g===!0||g===3&&s!==4||g===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!g&&s>2?E.set(f,s):E.set(f,!0)}d(c,C,m,f,s,a,i,P,h)}}return w(c,o),w(c,b),c}function w(l,n){n&&l.push(function(h){for(var c=0;c<n.length;c++)n[c].call(h);return h})}function D(l,n,h){if(n.length>0){for(var c=[],o=l,b=l.name,p=n.length-1;p>=0;p--){var T={v:!1};try{var x=n[p](o,{kind:"class",name:b,addInitializer:v(c,T),metadata:h})}finally{T.v=!0}x!==void 0&&(u(10,x),o=x)}return[S(o,h),function(){for(var m=0;m<c.length;m++)c[m].call(o)}]}}function S(l,n){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,h,c,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var p=Object.create(b===void 0?null:b),T=y(n,h,p);return c.length||S(n,p),{e:T,get c(){return D(n,c,p)}}}}function Ji(v,t,e,r){return(Ji=el())(v,t,e,r)}var Ki,Bi,Qi,ki,ts,es,os,Ui,Xi,Hi,Yi,Wi,Zi,Mo;Ki=B({selector:"potatno-node",template:Gi,style:$i,modules:[_e],components:[Se]}),Qi=vt("node-drag"),ki=$.state(),ts=$.state({proxy:!0}),es=$.state({complexValue:!0}),os=$.state({complexValue:!0});var qi=class{static{({e:[Ui,Xi,Hi,Yi,Wi,Zi],c:[Mo,Bi]}=Ji(this,[[Qi,1,"mDrag"],[ki,1,"isPreviewDisplaySelectionOpen"],[H,3,"nodeData"],[ts,1,"nodeTransformation"],[es,1,"previewPorts"],[os,1,"previewDisplays"]],[Ki]))}constructor(t=O.use(G),e=O.use(Y)){this.mComponent=t,this.mManager=e,this.mNodeDefinition=null,this.mNodeData=null,this.isPreviewDisplaySelectionOpen=!1,this.nodeTransformation={height:0,width:0},this.previewPorts=new Array,this.previewDisplays=new Array,this.mUnsubscribeNodeChange=this.mManager.subscribe(R.Node,r=>{r.item===this.mNodeData&&this.resyncComponent(this.nodeData)}),this.mUnsubscribeValidation=this.mManager.subscribe(R.SpecialValidation,()=>{this.mComponent.updater.updateAsync()})}mComponent;mManager;mNodeData;mNodeDefinition;mUnsubscribeNodeChange;mUnsubscribeValidation;get canPreview(){return this.previewPorts.length>0}#t=(Zi(this),Ui(this));get mDrag(){return this.#t}set mDrag(t){this.#t=t}get hasError(){if(this.mManager.integrity.errorItems.has(this.nodeData))return!0;for(let t of this.nodeData.inputs.list)if(this.mManager.integrity.errorItems.has(t))return!0;for(let t of this.nodeData.outputs.list)if(this.mManager.integrity.errorItems.has(t))return!0;return!1}get inputPorts(){return this.nodeData.inputs.list}get isFunction(){return this.mNodeDefinition instanceof wt}get isPreviewActive(){return!!this.nodeData.preview}#e=Xi(this);get isPreviewDisplaySelectionOpen(){return this.#e}set isPreviewDisplaySelectionOpen(t){this.#e=t}get nodeColor(){return this.mManager.generateStringColor(this.mNodeDefinition?.category.name??"")}get nodeData(){if(!this.mNodeData)throw new N("Node data not set.",this);return this.mNodeData}set nodeData(t){this.mNodeData=t,this.mNodeDefinition=null,this.mNodeData&&(this.mNodeDefinition=this.mManager.activeFunction.nodeDefinitions.find(e=>e.id===this.mNodeData.definitionId)??null,this.resyncComponent(t),this.mComponent.updater.update())}get nodeIcon(){return this.mNodeDefinition?.category.icon??""}get nodeLabel(){return this.nodeData.label??""}#o=Hi(this);get nodeTransformation(){return this.#o}set nodeTransformation(t){this.#o=t}get outputPorts(){return this.nodeData.outputs.list}#r=Yi(this);get previewPorts(){return this.#r}set previewPorts(t){this.#r=t}#n=Wi(this);get previewDisplays(){return this.#n}set previewDisplays(t){this.#n=t}get previewDisplayId(){return this.nodeData.preview?.displayId??""}get previewDriver(){if(!this.nodeData.preview)return null;let t=this.nodeData.outputs.map.get(this.nodeData.preview.portDefinitionId);return t?this.mManager.preview.requestDriver(t,this.nodeData.preview.displayId):null}get previewPortDefinitionId(){return this.nodeData.preview?.portDefinitionId??""}dragNode(t){if(t.button===2&&this.mManager.graph.removeNode(this.nodeData),t.button!==0)return;let e=this.nodeData.transformation.x*this.mManager.grid.gridSize,r=this.nodeData.transformation.y*this.mManager.grid.gridSize,u=this.nodeData.transformation.x,d=this.nodeData.transformation.y,y=this.mComponent.element.getBoundingClientRect(),w=this.mComponent.element.offsetWidth?y.width/this.mComponent.element.offsetWidth:1,D=this.mComponent.element.offsetHeight?y.height/this.mComponent.element.offsetHeight:1,S=t.clientX,l=t.clientY,n=c=>{c.stopPropagation();let o=(c.clientX-S)/w,b=(c.clientY-l)/D,p=Math.round((e+o)/this.mManager.grid.gridSize),T=Math.round((r+b)/this.mManager.grid.gridSize);u===p&&d===T||(this.mManager.graph.transformNode(this.nodeData,x=>{x.moveTo(p,T)}),this.mDrag.dispatchEvent(new Po(p-u,T-d)),u=p,d=T)},h=()=>{document.removeEventListener("pointermove",n),document.removeEventListener("pointerup",h)};document.addEventListener("pointermove",n),document.addEventListener("pointerup",h)}onDeconstruct(){this.mUnsubscribeNodeChange(),this.mUnsubscribeValidation()}openFunction(){this.mNodeDefinition instanceof wt&&this.mManager.setActiveFunction(this.mNodeDefinition.function)}selectPreviewDisplay(t){this.mManager.graph.updateNode(this.nodeData,e=>{e.preview={portDefinitionId:e.preview.portDefinitionId,displayId:t}}),document.activeElement instanceof HTMLElement&&document.activeElement.blur()}selectPreviewPort(t){let e=(()=>{let r=this.previewPorts;return r.length===0?null:typeof t<"u"?r.find(u=>u.definitionId===t)??null:this.nodeData.preview?null:r[0]})();if(!e)return this.mManager.graph.updateNode(this.nodeData,r=>{r.preview=null});this.mManager.graph.updateNode(this.nodeData,r=>{let u=r.project.getFunction(r.function.definitionId),d=r.project.preview.availableDisplays(u,e.resolvedDataType);d.length===0&&(r.preview=null);let y=r.preview&&d.includes(r.preview.displayId)?r.preview.displayId:d[0];r.preview={portDefinitionId:e.definitionId,displayId:y}}),this.resyncComponent(this.nodeData)}getPreviewDisplays(t){if(!t)return new Array;let e=this.nodeData.outputs.map.get(t);if(!e)return new Array;let r=e.project.getFunction(e.node.function.definitionId);return r?e.project.preview.availableDisplays(r,e.resolvedDataType).map(d=>({id:d,label:e.project.preview.getDisplay(d)?.name??d})):new Array}getPreviewablePorts(t){let e=t.project.getFunction(t.function.definitionId);if(!this.mManager.activeFunction.dynamicNodeDefinitions.find(d=>d.id===t.definitionId))return new Array;let u=new Map;return t.outputs.value.filter(d=>{let y=d.resolvedDataType;if(u.has(y))return u.get(y);let w=t.project.preview.availableDisplays(e,d.resolvedDataType);return u.set(y,w.length>0),u.get(y)})}resyncComponent(t){let e=t.transformation.x*this.mManager.grid.gridSize,r=t.transformation.y*this.mManager.grid.gridSize;this.mComponent.element.style.setProperty("left",`${e}px`),this.mComponent.element.style.setProperty("top",`${r}px`),this.nodeTransformation.width=t.transformation.width,this.nodeTransformation.height=t.transformation.height,this.previewPorts=this.getPreviewablePorts(this.nodeData),this.previewDisplays=this.getPreviewDisplays(t.preview?.portDefinitionId??null)}static{Bi()}},Po=class{mX;mY;get x(){return this.mX}get y(){return this.mY}constructor(t,e){this.mX=t,this.mY=e}};var rs=`:host {\r
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
}\r
\r
.information {\r
    /* Full size overlay without user interaction to contain the control icon */\r
    position: absolute;\r
    inset: 0;\r
    display: flex;\r
    align-items: flex-start;\r
    justify-content: flex-end;\r
    padding: 20px;\r
    pointer-events: none;\r
\r
    .information__icon {\r
        /* Reset pointer events none of parent. */\r
        pointer-events: auto;\r
\r
        --information-icon-background-color: var(--potatno-color-background-light);\r
        --information-background-color: var(--potatno-color-background);\r
        --information-icon-color: var(--potatno-color-accent);\r
        --information-border-color: var(--potatno-color-border);\r
        --information-shadow-color: var(--potatno-color-shadow);\r
    }\r
}\r
\r
.controls-information {\r
    display: grid;\r
    grid-template-columns: 1.1em max-content max-content;\r
    align-items: center;\r
    column-gap: 10px;\r
    row-gap: 5px;\r
\r
    font-size: 12px;\r
    line-height: 1.2;\r
    white-space: nowrap;\r
    color: var(--potatno-color-text);\r
\r
    .controls-information__title {\r
        grid-column: 1 / -1;\r
        margin-bottom: 3px;\r
        padding-bottom: 8px;\r
        border-bottom: 1px solid var(--potatno-color-border);\r
\r
        font-weight: bold;\r
        letter-spacing: 0.04em;\r
        text-transform: uppercase;\r
        font-size: 11px;\r
        color: var(--potatno-color-text);\r
    }\r
\r
    .controls-information__icon {\r
        justify-self: center;\r
        font-size: 13px;\r
        color: var(--potatno-color-accent);\r
    }\r
\r
    .controls-information__action {\r
        font-weight: bold;\r
    }\r
\r
    .controls-information__gesture {\r
        justify-self: end;\r
        padding: 1px 6px;\r
        border: 1px solid var(--potatno-color-border);\r
        border-radius: 3px;\r
        background-color: var(--potatno-color-background-light);\r
        font-size: 11px;\r
        color: var(--potatno-color-text);\r
        opacity: 0.65;\r
    }\r
}`;var ns=`<!-- Serves only as a background. -->\r
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
<div class="information">\r
    <kg-information class="information__icon">\r
        <div class="controls-information">\r
            <span class="controls-information__title">Controls</span>\r
\r
            <span class="controls-information__icon">\u2725</span>\r
            <span class="controls-information__action">Pan</span>\r
            <span class="controls-information__gesture">Middle-drag</span>\r
\r
            <span class="controls-information__icon">\u2315</span>\r
            <span class="controls-information__action">Zoom</span>\r
            <span class="controls-information__gesture">Middle-scroll</span>\r
\r
            <span class="controls-information__icon">\u271A</span>\r
            <span class="controls-information__action">Add node</span>\r
            <span class="controls-information__gesture">Right - Grid</span>\r
\r
            <span class="controls-information__icon">\u2715</span>\r
            <span class="controls-information__action">Delete</span>\r
            <span class="controls-information__gesture">Right - Element</span>\r
\r
            <span class="controls-information__icon">\u2725</span>\r
            <span class="controls-information__action">Move</span>\r
            <span class="controls-information__gesture">Drag node</span>\r
\r
            <span class="controls-information__icon">\u219D</span>\r
            <span class="controls-information__action">Connect</span>\r
            <span class="controls-information__gesture">Drag port</span>\r
        </div>\r
    </kg-information>\r
</div>\r
\r
$if(this.popup !== null) {\r
    <potatno-node-selection-popup (focusout)="this.popup = null" style="left: {{this.popup.position.local.x}}px; top: {{this.popup.position.local.y}}px;" [contextport]="this.popup.context.port" (node-select)="this.createNode($event.value)"/>\r
}\r
`;function nl(){function v(l,n){return function(c){e(n,"addInitializer"),r(c,"An initializer"),l.push(c)}}function t(l,n,h,c,o,b,p,T,x){var m;switch(o){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var s={kind:m,name:p?"#"+n:n,static:b,private:p,metadata:T},f={v:!1};s.addInitializer=v(c,f);var i,a;if(o===0?p?(i=h.get,a=h.set):(i=function(){return this[n]},a=function(g){this[n]=g}):o===2?i=function(){return h.value}:((o===1||o===3)&&(i=function(){return h.get.call(this)}),(o===1||o===4)&&(a=function(g){h.set.call(this,g)})),p)s.access=i&&a?{get:i,set:a}:i?{get:i}:{set:a};else{if(i){var C=i;i=function(g){return arguments.length===0&&(g=this),C.call(g)}}if(a){var P=a;a=function(g,_){return arguments.length===1&&(_=g,g=this),P.call(g,_)}}var E=function(g){return n in g};s.access=i&&a?{has:E,get:i,set:a}:i?{has:E,get:i}:{has:E,set:a}}try{return l(x,s)}finally{f.v=!0}}function e(l,n){if(l.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(l,n){if(typeof l!="function")throw new TypeError(n+" must be a function")}function u(l,n){var h=typeof n;if(l===1){if(h!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(h!=="function"){var c;throw l===0?c="field":l===10?c="class":c="method",new TypeError(c+" decorators must return a function or void 0")}}function d(l,n,h,c,o,b,p,T,x){var m=h[0],s,f,i;p?o===0||o===1?s={get:h[3],set:h[4]}:o===3?s={get:h[3]}:o===4?s={set:h[3]}:s={value:h[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,c)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var a,C,P;if(typeof m=="function")a=t(m,c,s,T,o,b,p,x,i),a!==void 0&&(u(o,a),o===0?f=a:o===1?(f=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a);else for(var E=m.length-1;E>=0;E--){var g=m[E];if(a=t(g,c,s,T,o,b,p,x,i),a!==void 0){u(o,a);var _;o===0?_=a:o===1?(_=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a,_!==void 0&&(f===void 0?f=_:typeof f=="function"?f=[f,_]:f.push(_))}}if(o===0||o===1){if(f===void 0)f=function(M,I){return I};else if(typeof f!="function"){var F=f;f=function(M,I){for(var A=I,L=0;L<F.length;L++)A=F[L].call(M,A);return A}}else{var j=f;f=function(M,I){return j.call(M,I)}}l.push(f)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),p?o===1?(l.push(function(M,I){return i.get.call(M,I)}),l.push(function(M,I){return i.set.call(M,I)})):o===2?l.push(i):l.push(function(M,I){return i.call(M,I)}):Object.defineProperty(n,c,s))}function y(l,n,h){for(var c=[],o,b,p=new Map,T=new Map,x=0;x<n.length;x++){var m=n[x];if(Array.isArray(m)){var s=m[1],f=m[2],i=m.length>3,a=s>=5,C,P;if(a?(C=l,s=s-5,b=b||[],P=b):(C=l.prototype,o=o||[],P=o),s!==0&&!i){var E=a?T:p,g=E.get(f)||0;if(g===!0||g===3&&s!==4||g===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!g&&s>2?E.set(f,s):E.set(f,!0)}d(c,C,m,f,s,a,i,P,h)}}return w(c,o),w(c,b),c}function w(l,n){n&&l.push(function(h){for(var c=0;c<n.length;c++)n[c].call(h);return h})}function D(l,n,h){if(n.length>0){for(var c=[],o=l,b=l.name,p=n.length-1;p>=0;p--){var T={v:!1};try{var x=n[p](o,{kind:"class",name:b,addInitializer:v(c,T),metadata:h})}finally{T.v=!0}x!==void 0&&(u(10,x),o=x)}return[S(o,h),function(){for(var m=0;m<c.length;m++)c[m].call(o)}]}}function S(l,n){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,h,c,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var p=Object.create(b===void 0?null:b),T=y(n,h,p);return c.length||S(n,p),{e:T,get c(){return D(n,c,p)}}}}function cs(v,t,e,r){return(cs=nl())(v,t,e,r)}function il(v){return v}var us,is,hs,fs,ss,as,ls,eo;us=B({selector:"potatno-node-graph",template:ns,style:rs,components:[ae,Mo,Do,Io,Co]}),hs=$.state(),fs=$.state({complexValue:!0});new class extends il{constructor(){super(eo),is()}static{class v{static{({e:[ss,as,ls],c:[eo,is]}=cs(this,[[hs,1,"popup"],[fs,1,"selectBox"]],[us]))}static ZOOM_STRENGTH=.1;mComponent;mIsMouseInsideGrid;mKeyboardHandler;mManager;mUnsubscribeFunctionChange;mUnsubscribeGraphChange;#t=(ls(this),ss(this));get popup(){return this.#t}set popup(e){this.#t=e}#e=as(this);get selectBox(){return this.#e}set selectBox(e){this.#e=e}get gridBackgroundStyle(){let e=this.mManager.grid.gridSize*this.mManager.grid.zoom,r=this.mManager.grid.panX%e,u=this.mManager.grid.panY%e;return`--grid-size: ${e}px; --grid-position-x: ${r}px; --grid-position-y: ${u}px;`}get gridTransformStyle(){return`transform: translate(${this.mManager.grid.panX}px, ${this.mManager.grid.panY}px) scale(${this.mManager.grid.zoom})`}get nodes(){return this.mManager.activeFunction.nodes}get selectedNodes(){return this.mManager.grid.selectedNodes}constructor(e=O.use(G),r=O.use(Y)){this.mComponent=e,this.mManager=r,this.mIsMouseInsideGrid=!1,this.popup=null,this.selectBox=null,this.mManager.grid.gridElement=this.mComponent.element,e.element.addEventListener("pointerdown",u=>{this.onPointerDown(u)}),e.element.addEventListener("wheel",u=>{this.onScroll(u)}),e.element.addEventListener("contextmenu",u=>{u.preventDefault()}),e.element.addEventListener("pointerenter",()=>{this.mIsMouseInsideGrid=!0}),e.element.addEventListener("pointerleave",()=>{this.mIsMouseInsideGrid=!1}),e.element.addEventListener("dragover",u=>{this.mManager.grid.draggedPort.isDragging&&(u.preventDefault(),u.stopPropagation(),u.dataTransfer&&(u.dataTransfer.dropEffect="link"))}),e.element.addEventListener("drop",u=>{this.createDroppedConjunction(u)}),this.mKeyboardHandler=u=>{this.onKeyDown(u)},document.addEventListener("keydown",this.mKeyboardHandler),this.mUnsubscribeFunctionChange=this.mManager.subscribe(R.Document|R.Function|R.SpecialActiveFunction,()=>{this.popup=null,this.selectBox=null}),this.mUnsubscribeGraphChange=this.mManager.subscribe(R.NodeAdd|R.NodeDelete|R.SpecialGrid|R.SpecialSelectNode,()=>{this.mComponent.updater.updateAsync()})}createNode(e){let r=this.mManager.graph.addNode(this.mManager.activeFunction,e.definition,{x:this.popup?.position.grid.x??0,y:this.popup?.position.grid.y??0,height:0,width:0});if(e.port){let u=r.inputs.map.get(e.port.target.id)??r.outputs.map.get(e.port.target.id);u&&this.mManager.graph.connectPorts(u,e.port.source)}this.popup=null,this.selectNodes([r],!1)}moveAllSelected(e,r){for(let u of this.mManager.grid.selectedNodes)u!==e&&this.mManager.graph.transformNode(u,d=>{d.moveTo(d.transformation.x+r.x,d.transformation.y+r.y)})}onDeconstruct(){this.mUnsubscribeFunctionChange(),this.mUnsubscribeGraphChange(),document.removeEventListener("keydown",this.mKeyboardHandler)}selectNodes(e,r){let u=!!r;r instanceof PointerEvent&&(r.stopPropagation(),u=r.ctrlKey);let d=new Set,y=new Set(this.mManager.grid.selectedNodes);if(!u)if(e.length===1&&y.has(e.at(0)))for(let D of y)d.add(D);else y.clear();let w=[...e];for(let D of w)d.has(D)||(d.add(D),D.definitionId===xt.DEFINITION_ID&&w.push(...this.getNodesInRectangle({top:D.transformation.y,right:D.transformation.x+D.transformation.width,bottom:D.transformation.y+D.transformation.height,left:D.transformation.x})),y.has(D)?y.delete(D):y.add(D));this.mManager.grid.selectNodes([...y])}typeOfNode(e){switch(e.definitionId){case xt.DEFINITION_ID:return"comment";case et.DEFINITION_ID:case K.DEFINITION_ID:return"conjunction";default:return"node"}}convertGlobalToGridLocalPosition(e,r){let u=this.mComponent.element.getBoundingClientRect();return{x:e-u.left,y:r-u.top}}createDroppedConjunction(e){if(!this.mManager.grid.draggedPort.isDragging)return;e.preventDefault(),e.stopPropagation();let r=this.mManager.grid.pixelToGridSpace(e.clientX,e.clientY),u=this.mManager.graph.priorizePorts(r,this.mManager.grid.draggedPort.ports);this.openPopupAtPosition(e.clientX,e.clientY,u[0])}getNodesInRectangle(e){let r=new Array;for(let u of this.mManager.activeFunction.nodes){let d=u.transformation.y,y=u.transformation.x,w=y+u.transformation.width,D=d+u.transformation.height;if(y<e.right&&w>e.left&&d<e.bottom&&D>e.top){if(e.top>d&&e.right<w&&e.bottom<D&&e.left>y)continue;r.push(u)}}return r}onKeyDown(e){if(!this.mIsMouseInsideGrid)return;let r=document.activeElement;if(!(r instanceof HTMLInputElement||r instanceof HTMLTextAreaElement||r instanceof HTMLSelectElement)){switch(e.key){case"Escape":{this.popup=null;return}case"Delete":{for(let u of this.mManager.grid.selectedNodes)this.mManager.graph.removeNode(u);this.selectNodes([],!1);return}}if(e.ctrlKey)switch(e.key){case"z":{e.preventDefault(),this.mManager.history.undo();return}case"y":{e.preventDefault(),this.mManager.history.redo();return}case"c":{this.mManager.clipboard.copy(this.mManager.grid.selectedNodes);return}case"v":e.preventDefault(),this.pasteFromClipboard()}}}onPointerDown(e){switch(e.button){case 0:{e.ctrlKey||this.selectNodes([],!1),this.pointerDrag(e,"selecting");return}case 1:{e.preventDefault(),this.pointerDrag(e,"panning");return}case 2:{this.openPopupAtPosition(e.clientX,e.clientY,null);return}}}onScroll(e){e.preventDefault();let r=e.deltaY>0?-1:1,u=this.convertGlobalToGridLocalPosition(e.clientX,e.clientY);this.mManager.grid.zoomAt(u.x,u.y,r*v.ZOOM_STRENGTH)}openPopupAtPosition(e,r,u){let d=this.mComponent.element,y=this.convertGlobalToGridLocalPosition(e,r),w=this.mManager.grid.pixelToGridSpace(e,r),D=8,S=Math.max(0,d.clientWidth-ae.POPUP_WIDTH-D),l=Math.max(0,d.clientHeight-ae.POPUP_HEIGHT-D);this.popup={position:{local:{x:Math.max(D,Math.min(y.x,S)),y:Math.max(D,Math.min(y.y,l))},grid:w},context:{port:u}}}pasteFromClipboard(){let e=this.mManager.clipboard.paste();e.length!==0&&this.selectNodes(e,!1)}pointerDrag(e,r){let u=this.mManager.grid.pixelToGridPixelSpace(e.clientX,e.clientY),d={x:e.clientX,y:e.clientY},y=D=>{switch(r){case"panning":{this.mManager.grid.pan(D.clientX-d.x,D.clientY-d.y),d.x=D.clientX,d.y=D.clientY;break}case"selecting":{let S=this.mManager.grid.pixelToGridPixelSpace(D.clientX,D.clientY);this.selectBox={x:Math.min(u.x,S.x),y:Math.min(u.y,S.y),width:Math.abs(S.x-u.x),height:Math.abs(S.y-u.y)};break}}},w=D=>{if(document.removeEventListener("pointermove",y),document.removeEventListener("pointerup",w),r==="selecting"&&this.selectBox){let S=this.mManager.grid.gridPixelSpaceToGridSpace({x:this.selectBox.x,y:this.selectBox.y},!1),l=this.mManager.grid.gridPixelSpaceToGridSpace({x:this.selectBox.x+this.selectBox.width,y:this.selectBox.y+this.selectBox.height},!1),n=this.getNodesInRectangle({top:S.y,right:l.x,bottom:l.y,left:S.x});this.selectNodes(n,D.ctrlKey),this.selectBox=null}};document.addEventListener("pointermove",y),document.addEventListener("pointerup",w)}}}};var le=class{mCodeGenerator;mId;mLabel;mNodesProvider;mStatics;get codeGenerator(){return this.mCodeGenerator}get id(){return this.mId}get label(){return this.mLabel}get statics(){return this.mStatics}constructor(t){this.mId=t.id,this.mLabel=t.label,this.mNodesProvider=t.nodes,this.mStatics=t.statics,this.mCodeGenerator=t.generator.code}getNodeDefinitions(t){let e=u=>{if(!u)return new Array;let d=new Array;return u(y=>{d.push(y)},t),d},r={};return Object.defineProperty(r,"entry",{get:()=>e(this.mNodesProvider.entry)}),Object.defineProperty(r,"exit",{get:()=>e(this.mNodesProvider.exit)}),Object.defineProperty(r,"dynamic",{get:()=>e(this.mNodesProvider.dynamic)}),r}},Ft={none:0,imports:1,inputs:2,outputs:4};var ds=`:host {\r
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
    width: 250px;\r
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
        /* Primary button drives border, background, hover and active states. */\r
        --button-accent-color: var(--potatno-color-accent);\r
        --button-text-color: var(--potatno-color-text);\r
        --button-border-color: var(--potatno-color-border);\r
        --button-background-color: var(--potatno-color-background-light);\r
\r
        width: 100%;\r
        padding: 4px 8px;\r
\r
        font-size: var(--potatno-font-size-small);\r
    }\r
}\r
\r
.list-item {\r
    display: flex;\r
    align-items: center;\r
    gap: 4px;\r
\r
    .list-item__delete {\r
        /* Secondary button with the error accent for the gradient hover/active states. */\r
        --button-text-color: var(--potatno-color-text);\r
        --button-accent-color: var(--potatno-color-error);\r
        --button-accent-text-color: var(--potatno-color-text-contrast);\r
\r
        width: 18px;\r
        height: 18px;\r
        padding: 0;\r
        font-size: 11px;\r
    }\r
\r
    .list-item__button {\r
        /* Primary button drives border, background, hover and active states. */\r
        --button-accent-color: var(--potatno-color-accent);\r
        --button-text-color: var(--potatno-color-text);\r
        --button-border-color: var(--potatno-color-border);\r
        --button-background-color: var(--potatno-color-background-light);\r
\r
        flex: 0;\r
        padding: 4px 12px;\r
\r
        font-size: var(--potatno-font-size-small);\r
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
}`;var ms=`<kg-resize-box class="resize-box" left="true">\r
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
                        <kg-button class="list-item__delete" type="secondary" (click)="this.deletePort(this.functionPort, this.functionProperties.inputs)">\u2715</kg-button>\r
                    }\r
                </div>\r
            }\r
\r
            $if(this.functionProperties.inputs.length === 0) {\r
                <div class="section__empty">No inputs defined.</div>\r
            }\r
\r
            $if(!this.functionProperties.statics.inputs) {\r
                <kg-button class="section__button" type="primary" (click)="this.addPort(this.functionProperties.inputs)">\r
                    <div>+</div>\r
                    <div>Add Input</div>\r
                </kg-button>\r
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
                        <kg-button class="list-item__delete" type="secondary" (click)="this.deletePort(this.functionPort, this.functionProperties.outputs)">\u2715</kg-button>\r
                    }\r
                </div>\r
            }\r
\r
            $if(this.functionProperties.outputs.length === 0) {\r
                <div class="section__empty">No outputs defined.</div>\r
            }\r
\r
            $if(!this.functionProperties.statics.outputs) {\r
                <kg-button class="section__button" type="primary" (click)="this.addPort(this.functionProperties.outputs)">\r
                    <div>+</div>\r
                    <div>Add Output</div>\r
                </kg-button>\r
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
                        <kg-button class="list-item__delete" type="secondary" (click)="this.deleteImport(this.import)">\u2715</kg-button>\r
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
                    <kg-button class="list-item__button" type="primary" (click)="this.addSelectedImport()">\r
                        <div>+</div>\r
                        <div>Add</div>\r
                    </kg-button>\r
                </div>\r
            }\r
        </div>\r
        \r
    </div>\r
</kg-resize-box>\r
`;function ll(){function v(l,n){return function(c){e(n,"addInitializer"),r(c,"An initializer"),l.push(c)}}function t(l,n,h,c,o,b,p,T,x){var m;switch(o){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var s={kind:m,name:p?"#"+n:n,static:b,private:p,metadata:T},f={v:!1};s.addInitializer=v(c,f);var i,a;if(o===0?p?(i=h.get,a=h.set):(i=function(){return this[n]},a=function(g){this[n]=g}):o===2?i=function(){return h.value}:((o===1||o===3)&&(i=function(){return h.get.call(this)}),(o===1||o===4)&&(a=function(g){h.set.call(this,g)})),p)s.access=i&&a?{get:i,set:a}:i?{get:i}:{set:a};else{if(i){var C=i;i=function(g){return arguments.length===0&&(g=this),C.call(g)}}if(a){var P=a;a=function(g,_){return arguments.length===1&&(_=g,g=this),P.call(g,_)}}var E=function(g){return n in g};s.access=i&&a?{has:E,get:i,set:a}:i?{has:E,get:i}:{has:E,set:a}}try{return l(x,s)}finally{f.v=!0}}function e(l,n){if(l.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(l,n){if(typeof l!="function")throw new TypeError(n+" must be a function")}function u(l,n){var h=typeof n;if(l===1){if(h!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(h!=="function"){var c;throw l===0?c="field":l===10?c="class":c="method",new TypeError(c+" decorators must return a function or void 0")}}function d(l,n,h,c,o,b,p,T,x){var m=h[0],s,f,i;p?o===0||o===1?s={get:h[3],set:h[4]}:o===3?s={get:h[3]}:o===4?s={set:h[3]}:s={value:h[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,c)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var a,C,P;if(typeof m=="function")a=t(m,c,s,T,o,b,p,x,i),a!==void 0&&(u(o,a),o===0?f=a:o===1?(f=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a);else for(var E=m.length-1;E>=0;E--){var g=m[E];if(a=t(g,c,s,T,o,b,p,x,i),a!==void 0){u(o,a);var _;o===0?_=a:o===1?(_=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a,_!==void 0&&(f===void 0?f=_:typeof f=="function"?f=[f,_]:f.push(_))}}if(o===0||o===1){if(f===void 0)f=function(M,I){return I};else if(typeof f!="function"){var F=f;f=function(M,I){for(var A=I,L=0;L<F.length;L++)A=F[L].call(M,A);return A}}else{var j=f;f=function(M,I){return j.call(M,I)}}l.push(f)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),p?o===1?(l.push(function(M,I){return i.get.call(M,I)}),l.push(function(M,I){return i.set.call(M,I)})):o===2?l.push(i):l.push(function(M,I){return i.call(M,I)}):Object.defineProperty(n,c,s))}function y(l,n,h){for(var c=[],o,b,p=new Map,T=new Map,x=0;x<n.length;x++){var m=n[x];if(Array.isArray(m)){var s=m[1],f=m[2],i=m.length>3,a=s>=5,C,P;if(a?(C=l,s=s-5,b=b||[],P=b):(C=l.prototype,o=o||[],P=o),s!==0&&!i){var E=a?T:p,g=E.get(f)||0;if(g===!0||g===3&&s!==4||g===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!g&&s>2?E.set(f,s):E.set(f,!0)}d(c,C,m,f,s,a,i,P,h)}}return w(c,o),w(c,b),c}function w(l,n){n&&l.push(function(h){for(var c=0;c<n.length;c++)n[c].call(h);return h})}function D(l,n,h){if(n.length>0){for(var c=[],o=l,b=l.name,p=n.length-1;p>=0;p--){var T={v:!1};try{var x=n[p](o,{kind:"class",name:b,addInitializer:v(c,T),metadata:h})}finally{T.v=!0}x!==void 0&&(u(10,x),o=x)}return[S(o,h),function(){for(var m=0;m<c.length;m++)c[m].call(o)}]}}function S(l,n){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,h,c,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var p=Object.create(b===void 0?null:b),T=y(n,h,p);return c.length||S(n,p),{e:T,get c(){return D(n,c,p)}}}}function bs(v,t,e,r){return(bs=ll())(v,t,e,r)}var ws,ps,xs,gs,vs,So;ws=B({selector:"potatno-function-properties",template:ms,style:ds,components:[Mt,Ht]}),xs=$.state({complexValue:!0});var ys=class{static{({e:[gs,vs],c:[So,ps]}=bs(this,[[xs,1,"functionProperties"]],[ws]))}constructor(t=O.use(Y)){this.mManager=t,this.mSelectedImportId="",this.mProjectTypes=new Set,this.functionProperties=this.convertFunctionProperties(),this.mUnsubscribe=this.mManager.subscribe(R.Document|R.Function|R.SpecialActiveFunction,()=>{this.mProjectTypes.clear();for(let[e]of this.mManager.project.types.types)this.mProjectTypes.add(e);this.functionProperties=this.convertFunctionProperties()})}mManager;mProjectTypes;mSelectedImportId;mUnsubscribe;#t=(vs(this),gs(this));get functionProperties(){return this.#t}set functionProperties(t){this.#t=t}get projectTypes(){return this.mProjectTypes}get selectedImportId(){return this.mSelectedImportId}set selectedImportId(t){this.mSelectedImportId=t}get unusedImports(){return this.mManager.activeFunction.project.imports.filter(t=>!this.functionProperties.imports.find(e=>t.id===e.id))}addPort(t){let e=this.projectTypes.values().next().value;if(!e)return;let r=t===this.functionProperties.inputs?"Input":"Output";t.push({label:r,dataType:e,hasError:!1}),this.submitChange()}addSelectedImport(){let t=this.unusedImports;if(t.length===0)return;let e=t.find(r=>r.id===this.mSelectedImportId);e||(e=t.at(0)),this.functionProperties.imports.push(e),this.submitChange()}deleteImport(t){let e=this.functionProperties.imports.indexOf(t);e!==-1&&(this.functionProperties.imports.splice(e,1),this.submitChange())}deletePort(t,e){let r=e.indexOf(t);r!==-1&&(e.splice(r,1),this.submitChange())}onDeconstruct(){this.mUnsubscribe()}async submitChange(){let t=!1,e=new Set;for(let y of this.functionProperties.inputs)y.hasError=e.has(y.label),t||=y.hasError,e.add(y.label);let r=new Set;for(let y of this.functionProperties.outputs)y.hasError=r.has(y.label),t||=y.hasError,r.add(y.label);if(t){this.functionProperties=this.functionProperties;return}let u=this.mManager.activeFunction,d=this.functionProperties;await new Promise(y=>{globalThis.setTimeout(y,10)}),this.mManager.graph.updateFunction(u,y=>{if(y.label=d.label,!d.statics.inputs){for(;y.inputs.length>0;)y.removeInput(y.inputs.at(0));for(let w of d.inputs)y.addInput({dataType:w.dataType,label:w.label})}if(!d.statics.outputs){for(;y.outputs.length>0;)y.removeOutput(y.outputs.at(0));for(let w of d.outputs)y.addOutput({dataType:w.dataType,label:w.label})}if(!d.statics.imports){for(let w of y.imports)y.removeImport(w);for(let w of d.imports)y.addImport(w.id)}})}convertFunctionProperties(){let t={label:"",inputs:new Array,outputs:new Array,imports:new Array,statics:{label:!0,imports:!0,inputs:!0,outputs:!0}},e=this.mManager.activeFunction,r=e.project.getFunction(e.definitionId);r&&(t.statics.label=e.isSystem,t.statics.imports=(r.statics&Ft.imports)!==0,t.statics.inputs=(r.statics&Ft.inputs)!==0,t.statics.outputs=(r.statics&Ft.outputs)!==0),t.label=e.label;for(let u of e.project.imports)e.imports.has(u.id)&&t.imports.push({id:u.id,label:u.label});for(let u of e.inputs)t.inputs.push({label:u.label,dataType:u.dataType,hasError:!1});for(let u of e.outputs)t.outputs.push({label:u.label,dataType:u.dataType,hasError:!1});return t}static{ps()}};var oo=class{mDependencies;mDocument;mEntryPoint;get code(){return this.mDocument.project.generator.code(this)}get dependencies(){return this.mDependencies}get entryPoint(){return this.mEntryPoint}constructor(t,e,r){this.mDocument=t,this.mEntryPoint=e,this.mDependencies=r}};var ro=class{mFunction;mGraphs;get code(){let t=this.mFunction.project.getFunction(this.mFunction.definitionId);if(!t)throw new N("Function result has an invalid function definition id.",this);return t.codeGenerator.body(this)}get function(){return this.mFunction}get graphs(){return Array.from(this.mGraphs.values())}constructor(t){this.mFunction=t,this.mGraphs=new Map}addGraph(t){this.mGraphs.set(t.entryNode.definitionId,t)}graphResultOf(t){return this.mGraphs.get(t)}};var no=class{mBodyCode;mDependencies;mEntryNode;mExitNode;mNodeIds;mPorts;get code(){return this.mBodyCode}get dependencies(){return this.mDependencies}get entryNode(){return this.mEntryNode}get exitNode(){return this.mExitNode}get nodes(){return this.mNodeIds}get ports(){return this.mPorts}constructor(t){this.mBodyCode=t.bodyCode,this.mDependencies=[...t.dependencies],this.mEntryNode=t.entryNode,this.mExitNode=t.exitNode,this.mNodeIds=t.nodeIds,this.mPorts=t.portValues}};var ce=class{mProject;constructor(t){this.mProject=t}generateDocument(t,e=!1){let r=[...t.functions].find(u=>u.isSystem);if(!r)throw new N("No entry point function found for code generation.",this);return this.generateFunction(r,e)}generateFunction(t,e=!1){return this.buildDocumentResult(t.document,t.getExitNodes(),e)}generateNode(t,e=!1){return this.buildDocumentResult(t.document,[t],e)}buildDocumentResult(t,e,r){if(t.validate().errors.length>0)throw new N("Code generation exited. Code graph validation failed.",this);let d={counter:{nodeIndex:0,portIndex:0},debug:r,nodeDefinitions:new Map},y=this.generateFunctionWithDependencies(d,e,new Set),w=y.pop();return new oo(t,w,y)}countNodeEncounter(t,e){let r=new Map,u=new Set,d=new Array(t);for(;d.length>0;){let y=d.pop();if(r.set(y,(r.get(y)??0)+1),!(y===e||u.has(y))){u.add(y);for(let w of y.inputs.flow)for(let D of this.resolveFlowConjunctions(w))d.push(D.node);for(let w of y.inputs.value){let D=this.resolveValueConjunctions(w);D&&d.push(D.node)}}}return r}createScope(t,e){return{emittedNodes:new Set,remaining:this.countNodeEncounter(t,e)}}emitNode(t,e,r,u,d){if(!t.nodeDefinitions.get(r.function)){let c=new Map;for(let o of r.function.nodeDefinitions)c.set(o.id,o);t.nodeDefinitions.set(r.function,c)}let y=t.nodeDefinitions.get(r.function).get(r.definitionId);if(!y)throw new N(`Node definition "${r.definitionId}" not found for node "${r.label}".`,this);y instanceof wt&&e.dependencies.push(y.function);let w={},D=new Array;for(let c of r.inputs.value){let o=this.resolveInputValue(t,e,c);w[c.definitionId]=o.inputPort,e.ports.set(c,o.inputPort.value),o.emitResult&&D.push(o.emitResult)}let S={};for(let c of r.outputs.list)S[c.definitionId]={value:this.generatePortValue(t,e,c),code:{inner:u[c.definitionId]??""}};let l=y.codeGenerator({inputs:w,outputs:S,code:{next:d??""}}),n=this.getGeneratedNodeId(t,e,r);t.debug&&(l=this.mProject.generator.value.hook(`start-${n}`)+l+this.mProject.generator.value.hook(`end-${n}`));let h=new Array;for(let c of D)h.push(...c.codeOutput);return h.push(l),{codeOutput:h,lastGeneratedNode:r,endFlowPort:null}}findBranchStartPoint(t){let e=this.getNodesInputFlowPorts(t),r=e.length,u=new Map,d=new Array,y=(w,D)=>{let S=(u.has(w)||u.set(w,new Set),u.get(w)),l=S.size;for(let n of D)S.add(n);return S.size>l&&d.push(w),S};for(let[w,D]of e.entries())y(D.node,[w]);for(;d.length>0;){let w=d.shift(),D=u.get(w);for(let S of this.getNodesInputFlowPorts(w))if(y(S.node,D).size===r)return S.node}throw new N("No common branch point found for merge node.",this)}generateFunctionWithDependencies(t,e,r){let u=new Array;if(e.length===0)return u;let d=e.at(0).function;r.add(d);let y=new ro(d);u.push(y);for(let w of e){let D=this.generateNodeCode(t,w);y.addGraph(D);for(let S of D.dependencies)r.has(S)||u.push(...this.generateFunctionWithDependencies(t,S.getExitNodes(),r))}return u.reverse()}generateNodeCode(t,e){let r={dependencies:new Array,nodes:new Map,ports:new Map,scope:this.createScope(e,null)},u=this.walkBackward(t,r,e,null),d=u.codeOutput.join(" ");return new no({bodyCode:d,dependencies:r.dependencies,entryNode:u.lastGeneratedNode,exitNode:e,nodeIds:new Map(r.nodes),portValues:new Map(r.ports)})}generatePortValue(t,e,r){if(!e.ports.has(r)){let u=this.mProject.generator.value.name(r.label),d=this.mProject.generator.value.id(u,t.counter.portIndex++);e.ports.set(r,d)}return e.ports.get(r)}getGeneratedNodeId(t,e,r){if(!e.nodes.has(r)){let d=(++t.counter.nodeIndex).toString(16).toUpperCase().padStart(8,"0");e.nodes.set(r,d)}return e.nodes.get(r)}getNodesInputFlowPorts(t){let e=new Array;for(let r of t.inputs.flow)e.push(...this.resolveFlowConjunctions(r));return[...new Set(e)]}handleFlowMerge(t,e,r,u,d){let y=d.join(" "),w=this.findBranchStartPoint(r),D={},S=e.scope;try{for(let l of u){e.scope=this.createScope(l.node,w);let n=this.walkBackward(t,e,l.node,w);D[n.endFlowPort.definitionId]=n.codeOutput.join(" ")}}finally{e.scope=S}return this.emitNode(t,e,w,D,y)}resolveFlowConjunctions(t){let e=new Array;for(let r of t.connectedPorts){if(r.node.definitionId!==K.DEFINITION_ID){e.push(r);continue}let u=r.node.inputs.flow[0];!u||u.connectedPorts.size===0||e.push(...this.resolveFlowConjunctions(u))}return e}resolveInputValue(t,e,r){let u=this.resolveValueConjunctions(r);if(!u){if(this.mProject.types.isGenericType(r.dataType))throw new N("Generic value inputs must be allways connected",this);return{inputPort:{value:this.mProject.types.getType(r.dataType).convert([...r.directValue]),isDirectValue:!0},emitResult:null}}let d=u.node,y=!d.hasFlowPorts,w=(()=>{if(!d.hasFlowPorts){if(e.scope.emittedNodes.has(d))return null;let D=e.scope.remaining.get(d);if(y&&(D=0),e.scope.remaining.set(d,D),D<=0)return e.scope.emittedNodes.add(d),this.emitNode(t,e,d,{})}return null})();return{inputPort:{value:this.generatePortValue(t,e,u),isDirectValue:!1},emitResult:w}}resolveValueConjunctions(t){if(t.connectedPorts.size===0)return null;let e=t.connectedPorts.values().next().value;if(e.node.definitionId!==et.DEFINITION_ID)return e;let r=e.node.inputs.value[0];return!r||r.connectedPorts.size===0?null:this.resolveValueConjunctions(r)}walkBackward(t,e,r,u){let d={codeOutput:new Array,lastGeneratedNode:null,endFlowPort:null},y=null,w=r;for(;w!==null&&w!==u;){let D={};y!==null&&(D[y.definitionId]=d.codeOutput.join(" "),d.codeOutput=new Array);let S=d.codeOutput;d=this.emitNode(t,e,w,D),d.codeOutput=[...d.codeOutput,...S];let l=this.getNodesInputFlowPorts(w);if(l.length===0)break;l.length>1&&(d=this.handleFlowMerge(t,e,w,l,d.codeOutput),l=this.getNodesInputFlowPorts(d.lastGeneratedNode)),y=l[0]??null,w=y?.node??null}if(!d.lastGeneratedNode)throw new N(`Walk did not reach an entry node from exit "${r.label}".`,this);if(u&&w!==u)throw new N("Malformed graph. End node not reached",this);return d.endFlowPort=y,d}};var ut=class{static MAIN="MAIN";mBuild;mDefaultParameters;mFunction;mTypes;get defaultParameters(){return this.mDefaultParameters}get function(){return this.mFunction}get types(){return this.mTypes}constructor(t,e){this.mFunction=t,this.mDefaultParameters=e.defaultParameters,this.mTypes=new Set(e.types),this.mBuild=e.build}compile(t,e){return this.mBuild({defaultParameters:this.mDefaultParameters,function:this.mFunction,projectTypes:t.entryPoint.function.project.types},t,e)}};var Ts=`:host {\r
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
            /* Selectable secondary button drives the gradient, hover, active and selected states. */\r
            --button-accent-color: var(--potatno-color-accent);\r
            --button-accent-text-color: var(--potatno-color-text-contrast);\r
            --button-text-color: var(--potatno-color-text);\r
\r
            margin: 3px;\r
            padding: 7px 15px 7px 15px;\r
\r
            /* Error tab reuses the same button but with the error accent. */\r
            &.tab--error {\r
                --button-accent-color: var(--potatno-color-error);\r
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
}`;var Ds=`<kg-resize-box class="resize-box" left="true" top="true">\r
    <div class="header">\r
        $if(this.errors.length > 0) {\r
            <div class="header__tabs">\r
                <kg-button class="tab tab--error" type="secondary" selected="true">Errors ({{this.errors.length}})</kg-button>\r
            </div>\r
        }\r
\r
        $if(this.errors.length === 0) {\r
            <div class="header__tabs">\r
                <kg-button class="tab" type="secondary" [selected]="this.selectedTab === 'preview'" (click)="this.selectedTab = 'preview'">Preview</kg-button>\r
                <kg-button class="tab" type="secondary" [selected]="this.selectedTab === 'code'" (click)="this.selectedTab = 'code'">Code</kg-button>\r
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
                            <span class="label">{{this.getDocumentItemTypeName(this.error.location)}}: </span> \r
                            <span class="link" (click)="this.openDocumentItem(this.error.location)">{{this.getDocumentItemLabel(this.error.location)}}</span>\r
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
`;function hl(){function v(l,n){return function(c){e(n,"addInitializer"),r(c,"An initializer"),l.push(c)}}function t(l,n,h,c,o,b,p,T,x){var m;switch(o){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var s={kind:m,name:p?"#"+n:n,static:b,private:p,metadata:T},f={v:!1};s.addInitializer=v(c,f);var i,a;if(o===0?p?(i=h.get,a=h.set):(i=function(){return this[n]},a=function(g){this[n]=g}):o===2?i=function(){return h.value}:((o===1||o===3)&&(i=function(){return h.get.call(this)}),(o===1||o===4)&&(a=function(g){h.set.call(this,g)})),p)s.access=i&&a?{get:i,set:a}:i?{get:i}:{set:a};else{if(i){var C=i;i=function(g){return arguments.length===0&&(g=this),C.call(g)}}if(a){var P=a;a=function(g,_){return arguments.length===1&&(_=g,g=this),P.call(g,_)}}var E=function(g){return n in g};s.access=i&&a?{has:E,get:i,set:a}:i?{has:E,get:i}:{has:E,set:a}}try{return l(x,s)}finally{f.v=!0}}function e(l,n){if(l.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(l,n){if(typeof l!="function")throw new TypeError(n+" must be a function")}function u(l,n){var h=typeof n;if(l===1){if(h!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(h!=="function"){var c;throw l===0?c="field":l===10?c="class":c="method",new TypeError(c+" decorators must return a function or void 0")}}function d(l,n,h,c,o,b,p,T,x){var m=h[0],s,f,i;p?o===0||o===1?s={get:h[3],set:h[4]}:o===3?s={get:h[3]}:o===4?s={set:h[3]}:s={value:h[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,c)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var a,C,P;if(typeof m=="function")a=t(m,c,s,T,o,b,p,x,i),a!==void 0&&(u(o,a),o===0?f=a:o===1?(f=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a);else for(var E=m.length-1;E>=0;E--){var g=m[E];if(a=t(g,c,s,T,o,b,p,x,i),a!==void 0){u(o,a);var _;o===0?_=a:o===1?(_=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a,_!==void 0&&(f===void 0?f=_:typeof f=="function"?f=[f,_]:f.push(_))}}if(o===0||o===1){if(f===void 0)f=function(M,I){return I};else if(typeof f!="function"){var F=f;f=function(M,I){for(var A=I,L=0;L<F.length;L++)A=F[L].call(M,A);return A}}else{var j=f;f=function(M,I){return j.call(M,I)}}l.push(f)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),p?o===1?(l.push(function(M,I){return i.get.call(M,I)}),l.push(function(M,I){return i.set.call(M,I)})):o===2?l.push(i):l.push(function(M,I){return i.call(M,I)}):Object.defineProperty(n,c,s))}function y(l,n,h){for(var c=[],o,b,p=new Map,T=new Map,x=0;x<n.length;x++){var m=n[x];if(Array.isArray(m)){var s=m[1],f=m[2],i=m.length>3,a=s>=5,C,P;if(a?(C=l,s=s-5,b=b||[],P=b):(C=l.prototype,o=o||[],P=o),s!==0&&!i){var E=a?T:p,g=E.get(f)||0;if(g===!0||g===3&&s!==4||g===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!g&&s>2?E.set(f,s):E.set(f,!0)}d(c,C,m,f,s,a,i,P,h)}}return w(c,o),w(c,b),c}function w(l,n){n&&l.push(function(h){for(var c=0;c<n.length;c++)n[c].call(h);return h})}function D(l,n,h){if(n.length>0){for(var c=[],o=l,b=l.name,p=n.length-1;p>=0;p--){var T={v:!1};try{var x=n[p](o,{kind:"class",name:b,addInitializer:v(c,T),metadata:h})}finally{T.v=!0}x!==void 0&&(u(10,x),o=x)}return[S(o,h),function(){for(var m=0;m<c.length;m++)c[m].call(o)}]}}function S(l,n){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,h,c,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var p=Object.create(b===void 0?null:b),T=y(n,h,p);return c.length||S(n,p),{e:T,get c(){return D(n,c,p)}}}}function Ns(v,t,e,r){return(Ns=hl())(v,t,e,r)}var As,Es,Ls,Rs,Os,Fs,Is,Cs,Ps,Ms,Ss,_o;As=B({selector:"potatno-preview",template:Ds,style:Ts,modules:[_e],components:[Mt,Ht]}),Ls=$.state(),Rs=$.state(),Os=$.state(),Fs=$.state();var _s=class{static{({e:[Is,Cs,Ps,Ms,Ss],c:[_o,Es]}=Ns(this,[[Ls,1,"mSelectedDisplayId"],[Rs,1,"mSelectedOutputId"],[Os,1,"selectedTab"],[Fs,1,"previewCode"]],[As]))}constructor(t=O.use(G),e=O.use(Y)){this.mComponent=t,this.mManager=e,this.mSelectedDisplayId="",this.mSelectedOutputId="",this.selectedTab="preview",this.previewCode="";let r=R.NodeUpdate|R.NodeAdd|R.NodeDelete;this.mPreviewTargets=this.findFunctionPreviewTargets(),this.mUnsubscribeOutputFetch=this.mManager.subscribe(R.SpecialActiveFunction|r,()=>{this.mPreviewTargets=this.findFunctionPreviewTargets()}),this.mUnsubscribeErrorResolve=this.mManager.subscribe(R.SpecialActiveFunction|r|R.Connection,()=>{this.mComponent.updater.updateAsync()});let u=0;this.mManager.subscribe(R.Any,()=>{globalThis.clearTimeout(u),u=globalThis.setTimeout(()=>{this.previewCode=this.generateFunctionCode()},1e3)})}mComponent;mManager;mPreviewTargets;mUnsubscribeErrorResolve;mUnsubscribeOutputFetch;#t=(Ss(this),Is(this));get mSelectedDisplayId(){return this.#t}set mSelectedDisplayId(t){this.#t=t}#e=Cs(this);get mSelectedOutputId(){return this.#e}set mSelectedOutputId(t){this.#e=t}#o=Ps(this);get selectedTab(){return this.#o}set selectedTab(t){this.#o=t}#r=Ms(this);get previewCode(){return this.#r}set previewCode(t){this.#r=t}get displayOptions(){let t=this.mPreviewTargets.get(this.selectedOutputId);return t?t.displays:new Map}get errors(){return this.mManager.integrity.errors}get outputOptions(){return this.mPreviewTargets}get previewDriver(){let t=this.mPreviewTargets.get(this.selectedOutputId);return t?this.mManager.preview.requestDriver(t.target,this.selectedDisplayId):null}get selectedDisplayId(){let t=this.displayOptions;if(!t.has(this.mSelectedDisplayId)){let e=t.keys().next().value;typeof e<"u"&&(this.mSelectedDisplayId=e)}return this.mSelectedDisplayId}set selectedDisplayId(t){this.mSelectedDisplayId=t}get selectedOutputId(){let t=this.outputOptions;if(!t.has(this.mSelectedOutputId)){let e=t.keys().next().value;typeof e<"u"&&(this.mSelectedOutputId=e)}return this.mSelectedOutputId}set selectedOutputId(t){this.mSelectedOutputId=t}getDocumentItemLabel(t){switch(!0){case t instanceof mt:return t.label;case t instanceof nt:return t.label;case t instanceof at:return t.label}return"Item"}getDocumentItemTypeName(t){switch(!0){case t instanceof mt:return"Node";case t instanceof nt:return"Port";case t instanceof at:return"Function"}return"Item"}onDeconstruct(){this.mUnsubscribeErrorResolve(),this.mUnsubscribeOutputFetch()}openDocumentItem(t){switch(!0){case t instanceof mt:{this.mManager.grid.selectNodes([t],!0);break}case t instanceof nt:{this.mManager.grid.selectNodes([t.node],!0);break}case t instanceof at:{this.mManager.setActiveFunction(t);break}}}findFunctionPreviewTargets(){let t=new Map,e=this.mManager.activeFunction,r=e.project.getFunction(e.definitionId);if(!r)return t;let u=w=>{let D=new Map;for(let S of w)D.set(S,e.project.preview.getDisplay(S).name);return D},d=e.project.preview.availableDisplays(r,ut.MAIN);d.length>0&&t.set(ut.MAIN,{label:ut.MAIN,target:e,displays:u(d)});let y=new Map;for(let w of e.getExitNodes())for(let D of w.inputs.value){let S=D.resolvedDataType;y.has(S)||y.set(S,D.project.preview.availableDisplays(r,S));let l=y.get(S);l.length!==0&&t.set(D.definitionId,{label:D.label,target:D,displays:u(l)})}return t}generateFunctionCode(){if(!this.mManager.integrity.isValid)return"";let t=this.mManager.activeFunction;return new ce(t.project).generateFunction(t,!1).code}static{Es()}};var zs=`:host {\r
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
}`;var js=`<div class="editor">\r
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
</div>`;function ml(){function v(l,n){return function(c){e(n,"addInitializer"),r(c,"An initializer"),l.push(c)}}function t(l,n,h,c,o,b,p,T,x){var m;switch(o){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var s={kind:m,name:p?"#"+n:n,static:b,private:p,metadata:T},f={v:!1};s.addInitializer=v(c,f);var i,a;if(o===0?p?(i=h.get,a=h.set):(i=function(){return this[n]},a=function(g){this[n]=g}):o===2?i=function(){return h.value}:((o===1||o===3)&&(i=function(){return h.get.call(this)}),(o===1||o===4)&&(a=function(g){h.set.call(this,g)})),p)s.access=i&&a?{get:i,set:a}:i?{get:i}:{set:a};else{if(i){var C=i;i=function(g){return arguments.length===0&&(g=this),C.call(g)}}if(a){var P=a;a=function(g,_){return arguments.length===1&&(_=g,g=this),P.call(g,_)}}var E=function(g){return n in g};s.access=i&&a?{has:E,get:i,set:a}:i?{has:E,get:i}:{has:E,set:a}}try{return l(x,s)}finally{f.v=!0}}function e(l,n){if(l.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(l,n){if(typeof l!="function")throw new TypeError(n+" must be a function")}function u(l,n){var h=typeof n;if(l===1){if(h!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(h!=="function"){var c;throw l===0?c="field":l===10?c="class":c="method",new TypeError(c+" decorators must return a function or void 0")}}function d(l,n,h,c,o,b,p,T,x){var m=h[0],s,f,i;p?o===0||o===1?s={get:h[3],set:h[4]}:o===3?s={get:h[3]}:o===4?s={set:h[3]}:s={value:h[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,c)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var a,C,P;if(typeof m=="function")a=t(m,c,s,T,o,b,p,x,i),a!==void 0&&(u(o,a),o===0?f=a:o===1?(f=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a);else for(var E=m.length-1;E>=0;E--){var g=m[E];if(a=t(g,c,s,T,o,b,p,x,i),a!==void 0){u(o,a);var _;o===0?_=a:o===1?(_=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a,_!==void 0&&(f===void 0?f=_:typeof f=="function"?f=[f,_]:f.push(_))}}if(o===0||o===1){if(f===void 0)f=function(M,I){return I};else if(typeof f!="function"){var F=f;f=function(M,I){for(var A=I,L=0;L<F.length;L++)A=F[L].call(M,A);return A}}else{var j=f;f=function(M,I){return j.call(M,I)}}l.push(f)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),p?o===1?(l.push(function(M,I){return i.get.call(M,I)}),l.push(function(M,I){return i.set.call(M,I)})):o===2?l.push(i):l.push(function(M,I){return i.call(M,I)}):Object.defineProperty(n,c,s))}function y(l,n,h){for(var c=[],o,b,p=new Map,T=new Map,x=0;x<n.length;x++){var m=n[x];if(Array.isArray(m)){var s=m[1],f=m[2],i=m.length>3,a=s>=5,C,P;if(a?(C=l,s=s-5,b=b||[],P=b):(C=l.prototype,o=o||[],P=o),s!==0&&!i){var E=a?T:p,g=E.get(f)||0;if(g===!0||g===3&&s!==4||g===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!g&&s>2?E.set(f,s):E.set(f,!0)}d(c,C,m,f,s,a,i,P,h)}}return w(c,o),w(c,b),c}function w(l,n){n&&l.push(function(h){for(var c=0;c<n.length;c++)n[c].call(h);return h})}function D(l,n,h){if(n.length>0){for(var c=[],o=l,b=l.name,p=n.length-1;p>=0;p--){var T={v:!1};try{var x=n[p](o,{kind:"class",name:b,addInitializer:v(c,T),metadata:h})}finally{T.v=!0}x!==void 0&&(u(10,x),o=x)}return[S(o,h),function(){for(var m=0;m<c.length;m++)c[m].call(o)}]}}function S(l,n){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,h,c,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var p=Object.create(b===void 0?null:b),T=y(n,h,p);return c.length||S(n,p),{e:T,get c(){return D(n,c,p)}}}}function Bs(v,t,e,r){return(Bs=ml())(v,t,e,r)}var Us,Vs,$s,No;Us=B({selector:"potatno-code-editor",template:js,style:zs,components:[xo,eo,So,_o]});var Gs=class{static{({e:[$s],c:[No,Vs]}=Bs(this,[[H,3,"document"],[H,2,"triggerPreviewUpdate"]],[Us]))}constructor(t=O.use(G),e=O.use(Y)){$s(this),this.mComponent=t,this.mManager=e,this.mUnsubscribe=this.mManager.subscribe(R.Document|R.SpecialActiveFunction,()=>{this.mComponent.updater.updateAsync()})}mComponent;mManager;mUnsubscribe;get document(){return this.mManager.graph.document}set document(t){this.mManager.graph.setDocument(t)}get hasPreview(){let t=this.mManager.activeFunction,e=t.project.getFunction(t.definitionId);return e?t.project.preview.availableDisplays(e).length>0:!1}triggerPreviewUpdate(){return this.mManager.preview.execute()}onDeconstruct(){this.mUnsubscribe()}static{Vs()}};var io=class extends pe{mCodeEditor;mProject;get document(){return this.mCodeEditor.document}set document(t){this.mCodeEditor.document=t}get project(){return this.mProject}constructor(t){super(),this.mProject=t,this.addStyle(Cr),this.addStyle(Ir),this.setInjection(Y,new Y(t)),this.mCodeEditor=this.addContent(No)}load(t){let e=JSON.parse(t);if(!Array.isArray(e.functions))throw new N("Could not load document. Document has a wrong format.",this);let r=new ne(this.mProject).deserialize(e);this.document=r}save(){let t=new ie().serialize(this.document);return JSON.stringify(t)}update(){this.mCodeEditor.triggerPreviewUpdate()}};var V=class extends st{constructor(t){super({id:t.id,label:t.label,category:t.category,regions:t.regions??null,generators:{ports:{inputs:e=>{for(let r of t.ports.inputs)e(r)},outputs:e=>{for(let r of t.ports.outputs)e(r)}},code:t.generators.code}})}};var so=class{mDisplays;get displayIds(){return[...this.mDisplays.keys()]}constructor(){this.mDisplays=new Map}addDisplay(t){this.mDisplays.set(t.id,t)}availableDisplays(t,e=null){let r=new Array;for(let[u,d]of this.mDisplays)d.executor.function.id===t.id&&(e===null||d.allowsType(e))&&r.push(u);return r}getDisplay(t){return this.mDisplays.get(t)??null}};var ao=class{mCodeGenerator;mEntryPoint;mImports;mNodeDefinitions;mPreview;mTypes;mUserFunctions;get entryPoint(){return this.mEntryPoint}get generator(){return this.mCodeGenerator}get imports(){return this.mImports}get nodeDefinitions(){return this.mNodeDefinitions}get preview(){return this.mPreview}get types(){return this.mTypes}get userFunctions(){return this.mUserFunctions}constructor(t,e,r){this.mTypes=t,this.mCodeGenerator=r.generator,this.mPreview=new so,this.mNodeDefinitions=new Map,this.mImports=new Array,this.mUserFunctions=new Map,this.mEntryPoint=e,this.addNodeDefinition(new K),this.addNodeDefinition(new et),this.addNodeDefinition(new xt)}addImport(t){this.mImports.push(t)}addNodeDefinition(t){this.mNodeDefinitions.set(t.id,t)}getFunction(t){return this.mEntryPoint.id===t?this.mEntryPoint:this.mUserFunctions.get(t)}setDynamicFunction(t){this.mUserFunctions.set(t.id,t)}};var lo=class{mTypes;get typeNames(){return Array.from(this.mTypes.keys())}get types(){return this.mTypes}constructor(t){this.mTypes=new Map;for(let[e,r]of Object.entries(t))this.mTypes.set(e,{name:e,...r})}getDefaultValue(t){return this.getType(t).default.value}getType(t){if(!this.mTypes.has(t))throw new Error(`Type "${t}" is not defined in the project types definition.`);return this.mTypes.get(t)}isGenericType(t){return typeof t!="string"?!1:/^<[^>]+>$/.test(t)}};var co=class extends lo{constructor(){super({number:{default:{string:["0"],value:0},convert:t=>{let e=t[0],r=parseFloat(e);if(isNaN(r))throw new Error(`Invalid number: "${e}"`);return r.toString()},inputs:[{name:"value",type:"number"}]},string:{default:{string:[""],value:""},convert:t=>t[0],inputs:[{name:"value",type:"string"}]},boolean:{default:{string:["false"],value:!1},convert:t=>{let e=t[0].toLowerCase();if(e==="true")return"true";if(e==="false")return"false";throw new Error(`Invalid boolean: "${t[0]}"`)},inputs:[{name:"value",type:"boolean"}]}})}};var uo=class extends le{constructor(){super({id:"pixelShader",label:"Pixel Shader",statics:Ft.inputs|Ft.outputs,nodes:{entry:t=>{t(new V({id:"OnPixel",label:"OnPixel",category:{name:"event"},ports:{inputs:[],outputs:[{label:"exec",id:"exec",portType:"flow"},{label:"x",id:"x",portType:"value",dataType:"number"},{label:"y",id:"y",portType:"value",dataType:"number"}]},generators:{code:e=>{let r=e.outputs.x.value,u=e.outputs.y.value;return`(${r}, ${u}) => { ${e.outputs.exec.code.inner} }`}}}))},exit:t=>{t(new V({id:"PixelResult",label:"PixelResult",category:{name:"Output"},ports:{inputs:[{label:"exec",id:"exec",portType:"flow"},{label:"red",id:"red",portType:"value",dataType:"number"},{label:"green",id:"green",portType:"value",dataType:"number"},{label:"blue",id:"blue",portType:"value",dataType:"number"}],outputs:[]},generators:{code:e=>`return [${e.inputs.red.value}, ${e.inputs.green.value}, ${e.inputs.blue.value}];`}}))}},generator:{code:{body:t=>{let e=t.graphResultOf("OnPixel");return`const ${t.function.definitionId} = ${e?.code??"() => [0, 0, 0]"};`},value:t=>`${t.function.definitionId}()`}}})}};var ho=class extends le{constructor(){super({id:"Helper Function",label:"Helper Function",statics:Ft.none,nodes:{entry:(t,e)=>{t(new st({id:"HelperFunctionEntry",label:"Entry",category:{name:"event"},generators:{ports:{outputs:r=>{r({label:"exec",id:"exec",portType:"flow"});for(let u of e.inputs)r({label:u.label,id:u.label,portType:"value",dataType:u.dataType})},inputs:()=>{}},code:r=>`(${Object.entries(r.outputs).filter(([d])=>d!=="exec").map(([,d])=>d.value).join(", ")}) => { ${r.outputs.exec.code.inner} }`}}))},exit:(t,e)=>{t(new st({id:"HelperFunctionReturn",label:"Return",category:{name:"event"},generators:{ports:{outputs:()=>{},inputs:r=>{r({label:"exec",id:"exec",portType:"flow"});for(let u of e.outputs)r({label:u.label,id:u.label,portType:"value",dataType:u.dataType})}},code:r=>`return { ${Object.entries(r.inputs).map(([d,y])=>`${d}: (${y.value})`).join(", ")} };`}}))}},generator:{code:{body:t=>{let e=t.function.project.generator.value.name(t.function.label),r=t.graphResultOf("HelperFunctionEntry");return`const ${e} = ${r?.code??"() => ({})"};`},value:t=>{let e=t.function.project.generator.value.name(t.function.label),r=Object.entries(t.inputs).map(([,y])=>y.value).join(", "),u=Object.entries(t.outputs).map(([y,w])=>`${y}: ${w.value}`).join(", "),d=t.outputs.Output?.code.inner??"";return u===""?`${e}(${r}); ${d}`:`const { ${u} } = ${e}(${r}); ${d}`}}}})}};var fo=class extends ao{mUserFunction;get userFunction(){return this.mUserFunction}constructor(){let t=new co,e=new uo,r=new ho;super(t,e,{generator:{code:u=>{let d="";for(let y of u.dependencies)d+=`${y.code}
`;return d+=u.entryPoint.code,d},value:{id:(u,d)=>`${u}_${d}`,name:u=>{let d=u.replaceAll(/[^A-Za-z0-9_]/g,"");return/^[0-9]/.test(d)?`_${d}`:d},hook:u=>`/*[${u}]*/`}}}),this.mUserFunction=r,this.setDynamicFunction(r),this.addBaseNodeDefinitions()}addBaseNodeDefinitions(){this.addNodeDefinition(new V({id:"Add",label:"Add",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} + ${t.inputs.b.value};`}})),this.addNodeDefinition(new V({id:"Subtract",label:"Subtract",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} - ${t.inputs.b.value};`}})),this.addNodeDefinition(new V({id:"Multiply",label:"Multiply",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} * ${t.inputs.b.value};`}})),this.addNodeDefinition(new V({id:"Divide",label:"Divide",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} / ${t.inputs.b.value};`}})),this.addNodeDefinition(new V({id:"Modulo",label:"Modulo",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} % ${t.inputs.b.value};`}})),this.addNodeDefinition(new V({id:"Equal",label:"Equal",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"boolean"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} === ${t.inputs.b.value};`}})),this.addNodeDefinition(new V({id:"Not Equal",label:"Not Equal",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"boolean"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} !== ${t.inputs.b.value};`}})),this.addNodeDefinition(new V({id:"Less Than",label:"Less Than",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"boolean"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} < ${t.inputs.b.value};`}})),this.addNodeDefinition(new V({id:"Greater Than",label:"Greater Than",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"boolean"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} > ${t.inputs.b.value};`}})),this.addNodeDefinition(new V({id:"And",label:"And",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"boolean"},{label:"b",id:"b",portType:"value",dataType:"boolean"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"boolean"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} && ${t.inputs.b.value};`}})),this.addNodeDefinition(new V({id:"Or",label:"Or",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"boolean"},{label:"b",id:"b",portType:"value",dataType:"boolean"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"boolean"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} || ${t.inputs.b.value};`}})),this.addNodeDefinition(new V({id:"Not",label:"Not",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"boolean"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"boolean"}]},generators:{code:t=>`const ${t.outputs.result.value} = !${t.inputs.a.value};`}})),this.addNodeDefinition(new V({id:"Number to String",label:"Number to String",category:{name:"type-conversion"},ports:{inputs:[{label:"input",id:"input",portType:"value",dataType:"number"}],outputs:[{label:"output",id:"output",portType:"value",dataType:"string"}]},generators:{code:t=>`const ${t.outputs.output.value} = String(${t.inputs.input.value});`}})),this.addNodeDefinition(new V({id:"String to Number",label:"String to Number",category:{name:"type-conversion"},ports:{inputs:[{label:"input",id:"input",portType:"value",dataType:"string"}],outputs:[{label:"output",id:"output",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.output.value} = Number(${t.inputs.input.value});`}})),this.addNodeDefinition(new V({id:"Boolean to String",label:"Boolean to String",category:{name:"type-conversion"},ports:{inputs:[{label:"input",id:"input",portType:"value",dataType:"boolean"}],outputs:[{label:"output",id:"output",portType:"value",dataType:"string"}]},generators:{code:t=>`const ${t.outputs.output.value} = String(${t.inputs.input.value});`}})),this.addNodeDefinition(new V({id:"If",label:"If",category:{name:"flow"},ports:{inputs:[{label:"exec",id:"exec",portType:"flow"},{label:"condition",id:"condition",portType:"value",dataType:"boolean"}],outputs:[{label:"then",id:"then",portType:"flow"},{label:"else",id:"else",portType:"flow"}]},generators:{code:t=>`if (${t.inputs.condition.value}) {
${t.outputs.then.code.inner}
} else {
${t.outputs.else.code.inner}
}`}})),this.addNodeDefinition(new V({id:"While",label:"While",category:{name:"flow"},ports:{inputs:[{label:"exec",id:"exec",portType:"flow"},{label:"condition",id:"condition",portType:"value",dataType:"boolean"}],outputs:[{label:"body",id:"body",portType:"flow"}]},generators:{code:t=>`while (${t.inputs.condition.value}) {
${t.outputs.body.code.inner}
}`}})),this.addNodeDefinition(new V({id:"For Loop",label:"For Loop",category:{name:"flow"},ports:{inputs:[{label:"exec",id:"exec",portType:"flow"},{label:"count",id:"count",portType:"value",dataType:"number"}],outputs:[{label:"exec",id:"exec",portType:"flow"},{label:"index",id:"index",portType:"value",dataType:"number"}]},generators:{code:t=>`for (let ${t.outputs.index.value} = 0; ${t.outputs.index.value} < ${t.inputs.count.value}; ${t.outputs.index.value}++) {
${t.outputs.exec.code.inner}
}`}})),this.addNodeDefinition(new V({id:"Console Log",label:"Console Log",category:{name:"Function"},ports:{inputs:[{label:"message",id:"message",portType:"value",dataType:"string"}],outputs:[]},generators:{code:t=>`console.log(${t.inputs.message.value});`}})),this.addNodeDefinition(new V({id:"String Concat",label:"String Concat",category:{name:"Function"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"string"},{label:"b",id:"b",portType:"value",dataType:"string"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"string"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} + ${t.inputs.b.value};`}}))}};var ue=class{mId;mLabel;mNodes;get id(){return this.mId}get label(){return this.mLabel}get nodes(){return this.mNodes}constructor(t,e){this.mId=t,this.mLabel=e,this.mNodes=new Array}addNode(t){this.mNodes.push(t)}};var mo=class extends ue{constructor(){super("Math","Math"),this.addNode(new V({id:"Math.PI",label:"Math.PI",category:{name:"value"},ports:{inputs:[],outputs:[{label:"value",id:"value",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.value.value} = Math.PI;`}})),this.addNode(new V({id:"Math.E",label:"Math.E",category:{name:"value"},ports:{inputs:[],outputs:[{label:"value",id:"value",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.value.value} = Math.E;`}})),this.addNode(new V({id:"Math.abs",label:"Math.abs",category:{name:"Function"},ports:{inputs:[{label:"value",id:"value",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = Math.abs(${t.inputs.value.value});`}})),this.addNode(new V({id:"Math.floor",label:"Math.floor",category:{name:"Function"},ports:{inputs:[{label:"value",id:"value",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = Math.floor(${t.inputs.value.value});`}})),this.addNode(new V({id:"Math.ceil",label:"Math.ceil",category:{name:"Function"},ports:{inputs:[{label:"value",id:"value",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = Math.ceil(${t.inputs.value.value});`}})),this.addNode(new V({id:"Math.random",label:"Math.random",category:{name:"Function"},ports:{inputs:[],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = Math.random();`}})),this.addNode(new V({id:"Math.sin",label:"Math.sin",category:{name:"Function"},ports:{inputs:[{label:"value",id:"value",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = Math.sin(${t.inputs.value.value});`}})),this.addNode(new V({id:"Math.cos",label:"Math.cos",category:{name:"Function"},ports:{inputs:[{label:"value",id:"value",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = Math.cos(${t.inputs.value.value});`}})),this.addNode(new V({id:"Math.min",label:"Math.min",category:{name:"Function"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = Math.min(${t.inputs.a.value}, ${t.inputs.b.value});`}})),this.addNode(new V({id:"Math.max",label:"Math.max",category:{name:"Function"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = Math.max(${t.inputs.a.value}, ${t.inputs.b.value});`}})),this.addNode(new V({id:"Math.clamp",label:"Math.clamp",category:{name:"Function"},ports:{inputs:[{label:"value",id:"value",portType:"value",dataType:"number"},{label:"min",id:"min",portType:"value",dataType:"number"},{label:"max",id:"max",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = Math.min(Math.max(${t.inputs.value.value}, ${t.inputs.min.value}), ${t.inputs.max.value});`}}))}};var po=class extends ue{constructor(){super("Time","Time"),this.addNode(new V({id:"CurrentTime",label:"CurrentTime",category:{name:"value"},ports:{inputs:[],outputs:[{label:"seconds",id:"seconds",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.seconds.value} = (performance.now() / 1000);`}}))}};var go=class{mCachedCallable;mDisplay;mElement;mSpecifiedParameters;mTarget;get display(){return this.mDisplay}get element(){return this.mElement||(this.mElement=this.mDisplay.generate()),this.mElement}constructor(t,e){this.mDisplay=t,this.mTarget=e,this.mCachedCallable=null,this.mElement=null,this.mSpecifiedParameters={...this.mDisplay.executor.defaultParameters}}execute(){this.mCachedCallable&&this.mDisplay.update(this.element,this.mCachedCallable)}refresh(){let t=this.mTarget instanceof nt?this.mTarget.node.function:this.mTarget,e=(()=>{try{return new ce(t.project).generateFunction(t,!0)}catch{return null}})();if(!e){this.mCachedCallable=null;return}let r=null;if(this.mTarget instanceof nt&&(r=this.resolvePortTarget(e,this.mTarget),!r)){this.mCachedCallable=null;return}let u=this.mDisplay.executor.compile(e,r);if(!this.mDisplay.allowsType(u.type)){this.mCachedCallable=null;return}let d=this.mDisplay.adapterFor(u.type);this.mCachedCallable=y=>d(u.execute({...this.mDisplay.executor.defaultParameters,...this.mSpecifiedParameters,...y}))}specifyParameters(t){this.mSpecifiedParameters={...this.mSpecifiedParameters,...t}}resolvePortTarget(t,e){let[r,u]=(()=>{for(let y of t.entryPoint.graphs)if(y.ports.has(e)&&y.nodes.has(e.node))return[y.ports.get(e),y.nodes.get(e.node)];return[null,null]})();if(!r||!u)return null;let d=e.direction==="input"?"start":"end";return{documentPort:e,nodeHook:e.project.generator.value.hook(`${d}-${u}`),value:r}}};var he=class{mExecutor;mGenerate;mId;mName;mTypeAdapters;mUpdate;get executor(){return this.mExecutor}get id(){return`${this.mId}-${this.mExecutor.function.id}`}get name(){return this.mName}constructor(t,e){this.mId=e.id,this.mName=e.name,this.mExecutor=t,this.mGenerate=e.generate,this.mUpdate=e.update,this.mTypeAdapters=new Map;for(let[r,u]of Object.entries(e.typeAdapter))this.mExecutor.types.has(r)&&this.mTypeAdapters.set(r,u)}adapterFor(t){let e=t;if(!this.mTypeAdapters.has(e))throw new N(`Display "${this.mId}" has no type adapter for type "${t}".`,this);return this.mTypeAdapters.get(e)}allowsType(t){return this.mTypeAdapters.has(t)}createDriver(t){return new go(this,t)}generate(){return this.mGenerate()}update(t,e){return this.mUpdate(t,e)}};var Ne=class v extends he{static MATRIX_SIZE=3;static VALUE_LENGTH=5;constructor(t){super(t,{id:"matrix",name:"Matrix 3x3",generate:()=>{let e=document.createElement("div");return e.style.boxSizing="border-box",e.style.display="grid",e.style.gap="2px",e.style.gridTemplateColumns=`repeat(${v.MATRIX_SIZE}, minmax(0, 1fr))`,e.style.height="100%",e.style.width="100%",e.style.fontFamily="var(--potatno-font-family)",e.style.fontSize="var(--potatno-font-size-small)",e.style.color="#fff",e},typeAdapter:{[ut.MAIN]:e=>e.map(r=>this.formatPreviewValue(r)),number:e=>[this.formatPreviewValue(e)],string:e=>[this.formatPreviewValue(e)],boolean:e=>[this.formatPreviewValue(e)]},update:async(e,r)=>{await this.updateMatrixPreview(e,r)}})}formatPreviewValue(t){if(typeof t=="number"){if(!Number.isFinite(t))return t.toString().slice(0,v.VALUE_LENGTH);let e=Math.trunc(Math.abs(t)).toString().length,r=Math.max(0,v.VALUE_LENGTH-e-(t<0?1:0)-1);return t.toFixed(r).slice(0,v.VALUE_LENGTH)}return String(t).slice(0,v.VALUE_LENGTH)}async updateMatrixPreview(t,e){for(;t.children.length<v.MATRIX_SIZE*v.MATRIX_SIZE;){let r=document.createElement("div");r.style.alignItems="center",r.style.background="var(--potatno-color-background-dark)",r.style.border="1px solid var(--potatno-color-border)",r.style.boxSizing="border-box",r.style.color="var(--potatno-color-text)",r.style.display="flex",r.style.justifyContent="center",r.style.minWidth="0",r.style.overflow="hidden",r.style.padding="2px",r.style.textOverflow="clip",r.style.whiteSpace="pre-line",t.append(r)}for(let r=0;r<v.MATRIX_SIZE;r++)for(let u=0;u<v.MATRIX_SIZE;u++){let d=r*v.MATRIX_SIZE+u,y=v.MATRIX_SIZE===1?0:u/(v.MATRIX_SIZE-1),w=v.MATRIX_SIZE===1?0:r/(v.MATRIX_SIZE-1),D=e({x:y,y:w});t.children[d].textContent=D.join(`
`)}}};var Ae=class v extends he{static PREVIEW_PIXEL_SIZE=7.5;mCanvasContext;mCanvasImageData;constructor(t){super(t,{id:"2dCanvas",name:"Canvas 2D",generate:()=>{let e=document.createElement("canvas");return e.style.width="100%",e.style.height="100%",e.style.imageRendering="pixelated",e},typeAdapter:{[ut.MAIN]:e=>e,number:e=>[e,e,e],boolean:e=>{let r=e?1:0;return[r,r,r]}},update:async(e,r)=>{await this.updateCanvasPreview(e,r)}}),this.mCanvasImageData=new WeakMap,this.mCanvasContext=new WeakMap}async updateCanvasPreview(t,e){this.mCanvasContext.has(t)||this.mCanvasContext.set(t,t.getContext("2d"));let r=this.mCanvasContext.get(t),u=Math.max(1,Math.round(t.clientWidth/v.PREVIEW_PIXEL_SIZE)),d=Math.max(1,Math.round(t.clientHeight/v.PREVIEW_PIXEL_SIZE));(t.width!==u||t.height!==d||!this.mCanvasImageData.has(t))&&(t.width=u,t.height=d,this.mCanvasImageData.set(t,r.createImageData(u,d)));let y=this.mCanvasImageData.get(t),w=y.data;for(let D=0;D<d;D++)for(let S=0;S<u;S++){let l=S/u,n=D/d,h=e({x:l,y:n}),c=(D*u+S)*4;w[c]=Math.floor(Math.max(0,Math.min(1,h[0]||0))*255),w[c+1]=Math.floor(Math.max(0,Math.min(1,h[1]||0))*255),w[c+2]=Math.floor(Math.max(0,Math.min(1,h[2]||0))*255),w[c+3]=255}r.putImageData(y,0,0)}};var St=new fo;St.addImport(new mo);St.addImport(new po);var Xs=new ut(St.entryPoint,{defaultParameters:{x:0,y:0},types:[ut.MAIN,"number","string","boolean"],build:(v,t,e)=>{let r=t.code,u=v.function.id;if(!e){let w=new Function(`${r}
return ${u};`)();return{type:ut.MAIN,execute:D=>w(D.x,D.y)}}let d=r.replace(e.nodeHook,`; return ${e.value};`),y=new Function(`${d}
return ${u};`)();return{type:e.documentPort.resolvedDataType,execute:w=>y(w.x,w.y)}}}),Hs=new ut(St.userFunction,{defaultParameters:{x:0,y:0},types:["number","string","boolean"],build:(v,t,e)=>{if(!e)return{type:"number",execute:()=>0};let r=t.entryPoint.function,u=r.project.generator.value.name(r.label),d=r.inputs.map(D=>v.projectTypes.getDefaultValue(D.dataType)),y=t.code.replace(e.nodeHook,`return ${e.value};`),w=new Function(`${y}
return ${u};`)();return{type:e.documentPort.resolvedDataType,execute:()=>w(...d)}}});St.preview.addDisplay(new Ae(Xs));St.preview.addDisplay(new Ae(Hs));St.preview.addDisplay(new Ne(Xs));St.preview.addDisplay(new Ne(Hs));var pl=document.getElementById("application-root"),Le=new io(St);Le.appendTo(pl);Le.document=new jt(St);Ys();function Ys(){try{Le.update()}catch(v){}requestAnimationFrame(Ys)}document.getElementById("load-button").addEventListener("click",gl);document.getElementById("save-button").addEventListener("click",vl);var Ws="potatno-code-document.json";async function gl(){if(window.confirm("Load saved document?"))try{let r=await(await(await navigator.storage.getDirectory()).getFileHandle(Ws)).getFile();Le.load(await r.text())}catch{window.alert("Could not load document.")}}async function vl(){if(window.confirm("Override saved document?"))try{let r=await(await(await navigator.storage.getDirectory()).getFileHandle(Ws,{create:!0})).createWritable();await r.write(Le.save()),await r.close()}catch{window.alert("Could not save document.")}}(()=>{let v=window.location.protocol==="https:"?"wss":"ws",t=new WebSocket(`${v}://${window.location.host}`);t.addEventListener("open",()=>{console.log("Refresh connection established")}),t.addEventListener("message",e=>{e.data==="REFRESH"&&(console.log("Bundle finished. Start refresh"),window.location.reload())})})();})();
//# sourceMappingURL=page.js.map
