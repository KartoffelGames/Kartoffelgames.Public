(()=>{var Ht=class v extends Array{static newListWith(...t){let e=new v;return e.push(...t),e}clear(){this.splice(0,this.length)}clone(){return v.newListWith(...this)}distinct(){return v.newListWith(...new Set(this))}equals(t){if(this===t)return!0;if(!t||this.length!==t.length)return!1;for(let e=0;e<this.length;++e)if(this[e]!==t[e])return!1;return!0}remove(t){let e=this.indexOf(t);if(e!==-1)return this.splice(e,1)[0]}replace(t,e){let r=this.indexOf(t);if(r!==-1){let u=this[r];return this[r]=e,u}}toString(){return`[${super.join(", ")}]`}};var _=class extends Error{mTarget;get target(){return this.mTarget}constructor(t,e,r){super(t,r),this.mTarget=e}};var rt=class v extends Map{add(t,e){if(!this.has(t))this.set(t,e);else throw new _("Can't add duplicate key to dictionary.",this)}clone(){return new v(this)}getAllKeysOfValue(t){return[...this.entries()].filter(u=>u[1]===t).map(u=>u[0])}getOrDefault(t,e){let r=this.get(t);return typeof r<"u"?r:e}map(t){let e=new Ht;for(let r of this){let u=t(r[0],r[1]);e.push(u)}return e}};var zt=class v{mSize;mTopItem;get size(){return this.mSize}get top(){if(this.mTopItem)return this.mTopItem.value}constructor(){this.mTopItem=null,this.mSize=0}clone(){let t=new v;return t.mTopItem=this.mTopItem,t.mSize=this.mSize,t}*entries(){let t=this.mTopItem;for(;t!==null;)yield t.value,t=t.previous}flush(){let t=new Array;for(;this.mTopItem;)t.push(this.pop());return t}pop(){if(!this.mTopItem)return;let t=this.mTopItem.value;return this.mTopItem=this.mTopItem.previous,this.mSize--,t}push(t){let e={previous:this.mTopItem,value:t};this.mTopItem=e,this.mSize++}toArray(){return[...this.entries()]}};var he=class{mCompareFunction;constructor(t){this.mCompareFunction=t}differencesOf(t,e){let r;if(t.length===0||e.length===0){if(r=new Array,t.length===0)for(let N=0;N<e.length;N++)r.push({changeState:St.Insert,item:e[N]});else for(let N=0;N<t.length;N++)r.push({changeState:St.Remove,item:t[N]});return r}let u={1:{x:0,history:[]}},f=N=>N-1,y=t.length,b=e.length,T;for(let N=0;N<y+b+1;N++)for(let c=-N;c<N+1;c+=2){let n=c===-N||c!==N&&u[c-1].x<u[c+1].x;if(n){let l=u[c+1];T=l.x,r=l.history}else{let l=u[c-1];T=l.x+1,r=l.history}r=r.slice();let h=T-c;for(1<=h&&h<=b&&n?r.push({changeState:St.Insert,item:e[f(h)]}):1<=T&&T<=y&&r.push({changeState:St.Remove,item:t[f(T)]});T<y&&h<b&&this.mCompareFunction(t[f(T+1)],e[f(h+1)]);)T+=1,h+=1,r.push({changeState:St.Keep,item:t[f(T)]});if(T>=y&&h>=b)return r;u[c]={x:T,history:r}}return new Array}},St=function(v){return v[v.Remove=1]="Remove",v[v.Insert=2]="Insert",v[v.Keep=3]="Keep",v}({});var de=class{mNodeCache;constructor(){this.mNodeCache=new Map}start(t,e){let r=this.readFromCache(t),u=this.readFromCache(e),f=new go;f.set(r,0);let y=new Map;y.set(r,0);let b=new Map,T=new Array;for(;f.length!==0;){let N=f.popLowest();if(T.push(N),N===u)return{path:[...this.pathTracer(N,b)].reverse(),processedNodes:T};for(let c of this.getNeighborNodes(N)){let n=(y.get(N)??Number.POSITIVE_INFINITY)+this.costOfTraversal(c,{startNode:r,endNode:u,path:this.pathTracer(N,b)}),h=y.get(c)??Number.POSITIVE_INFINITY;if(n>=h)continue;b.set(c,N),y.set(c,n);let l=n+this.heuristic(c,{startNode:r,endNode:u,path:this.pathTracer(N,b)});f.set(c,l)}}return{path:new Array,processedNodes:T}}getNeighborNodes(t){return this.neighborNodes(t).map(e=>this.readFromCache(e))}*pathTracer(t,e){let r=t;for(;yield r,!!e.has(r);)r=e.get(r)}readFromCache(t){let e=this.nodeId(t);return this.mNodeCache.has(e)?this.mNodeCache.get(e):(this.mNodeCache.set(e,t),t)}},go=class{mExistingNodes;mList;mLowestCost;mLowestCostCounter;get length(){return this.mList.length}constructor(){this.mList=new Array,this.mExistingNodes=new Map,this.mLowestCost=Number.POSITIVE_INFINITY,this.mLowestCostCounter=0}popLowest(){if(this.mList.length===0)throw new _("Can not read next node from an empty priority list.",this);let[t,e]=(()=>{let y=null,b=0;for(let T=this.mList.length-1;T>-1;T--){let N=this.mList[T];if(N.cost===this.mLowestCost)return[N,0];(y===null||N.cost<y.cost)&&(y=N,b=0),N.cost===y.cost&&b++}if(y===null)throw new _("Lowest could not be found. Data is corrupted.",this);return[y,b]})();t.cost<this.mLowestCost&&(this.mLowestCost=t.cost,this.mLowestCostCounter=e),t.cost===this.mLowestCost&&this.mLowestCostCounter--,this.mLowestCostCounter<1&&(this.mLowestCost=Number.POSITIVE_INFINITY,this.mLowestCostCounter=0);let r=this.mExistingNodes.get(t.node),u=this.mList.length-1,f=this.mList[u];return this.mList[u]=t,this.mList[r]=f,this.mExistingNodes.set(f.node,r),this.mExistingNodes.delete(t.node),this.mList.pop().node}set(t,e){if(this.mLowestCostCounter>0&&e<this.mLowestCost&&(this.mLowestCost=e,this.mLowestCostCounter=0),e===this.mLowestCost&&this.mLowestCostCounter++,this.mExistingNodes.has(t)){let r=this.mExistingNodes.get(t),u=this.mList[r];if(u.cost===e){e===this.mLowestCost&&this.mLowestCostCounter--;return}u.cost=e;return}this.mList.push({cost:e,node:t}),this.mExistingNodes.set(t,this.mList.length-1)}};var fe=class{mDataType;mId;mLabel;mPortType;mRegions;get dataType(){return this.mDataType}get id(){return this.mId}get label(){return this.mLabel}get portType(){return this.mPortType}get regions(){return this.mRegions}constructor(t){this.mLabel=t.label,this.mId=t.id,this.mPortType=t.portType,t.portType==="value"?this.mDataType=t.dataType:this.mDataType=null,this.mRegions={add:t.regions?.add??new Array}}};var it=class{mCategory;mCodeGenerator;mId;mLabel;mPortProvider;mRegions;get category(){return this.mCategory}get codeGenerator(){return this.mCodeGenerator}get id(){return this.mId}get inputs(){let t=!1,e=[];return this.mPortProvider.inputs(r=>{if(e.push(new fe(r)),r.portType==="flow"){if(t)throw new _(`Node definition ${this.id} has multiple input flow ports, which is not allowed.`,this);t=!0}}),e}get label(){return this.mLabel}get outputs(){let t=[];return this.mPortProvider.outputs(e=>{t.push(new fe(e))}),t}get regions(){return this.mRegions}constructor(t){this.mId=t.id,this.mLabel=t.label,this.mCategory={name:t.category.name,icon:t.category.icon??"\u25C6"},this.mCodeGenerator=t.generators.code,this.mPortProvider=t.generators.ports,this.mRegions={add:t.regions?.add??new Array,allows:t.regions?.allows??new Array,requires:t.regions?.requires??new Array}}getPort(t){return[...this.inputs,...this.outputs].find(e=>e.id===t)}};var yt=class extends it{mFunction;get function(){return this.mFunction}get label(){return this.mFunction.label}constructor(t){let e=(u,f,y)=>b=>{y.length===0&&b({label:u,id:u,portType:"flow"});for(let T of f)b({label:T.label,id:T.label,portType:"value",dataType:T.dataType})},r=t.project.getFunction(t.definitionId);super({id:`USERFUNCTION_${t.id}`,label:t.label,category:{name:"user function",icon:"\u0192"},generators:{ports:{inputs:e("Input",t.inputs,t.outputs),outputs:e("Output",t.outputs,t.outputs)},code:u=>r?r.codeGenerator.value({function:t,inputs:u.inputs,outputs:u.outputs,code:u.code}):""}}),this.mFunction=t}};var bt=class v extends it{static DEFINITION_ID="8124c652-3a8e-4333-b405-f905522a4610";constructor(){super({id:v.DEFINITION_ID,label:"Comment",category:{name:"Comment",icon:"\u270E"},generators:{ports:{inputs:()=>{},outputs:()=>{}},code:()=>{throw new _("Comment node code generators should never be called.",v)}}})}};var Z=class v extends it{static DEFINITION_ID="23e9319b-3b62-4dd8-858a-17d97ddee94e";constructor(){super({id:v.DEFINITION_ID,label:"Flow Conjunction",category:{name:"Conjunction",icon:"\u25C7"},generators:{ports:{inputs:t=>{t({label:"in",id:"in",portType:"flow"})},outputs:t=>{t({label:"out",id:"out",portType:"flow"})}},code:()=>{throw new _("Conjunction node code generators should never be called.",v)}}})}};var k=class v extends it{static DEFINITION_ID="a579584d-5d35-42b5-b2ba-3daddee488e0";constructor(){super({id:v.DEFINITION_ID,label:"Value Conjunction",category:{name:"Conjunction",icon:"\u25C7"},generators:{ports:{inputs:t=>{t({label:"in",id:"in",portType:"value",dataType:"<T>"})},outputs:t=>{t({label:"out",id:"out",portType:"value",dataType:"<T>"})}},code:()=>{throw new _("Conjunction node code generators should never be called.",v)}}})}};var wt=class{mAffectedItems;mErrors;get affectedItems(){return this.mAffectedItems}get errors(){return this.mErrors}constructor(){this.mErrors=new Array,this.mAffectedItems=new Set}addAffectedItem(t){this.mAffectedItems.add(t)}merge(t){this.mErrors.push(...t.mErrors);for(let e of t.mAffectedItems)this.mAffectedItems.add(e);return this}pushError(...t){this.mErrors.push(...t)}},K=class{mItem;mMessage;get item(){return this.mItem}get message(){return this.mMessage}constructor(t,e){this.mMessage=t,this.mItem=e}};var dt=class{mConnectedPorts;mDataType;mDefinitionId;mDirectValue;mDirection;mDocument;mLabel;mNode;mPortType;mProject;get connectedPorts(){return this.mConnectedPorts}get dataType(){return this.mDataType}get definitionId(){return this.mDefinitionId}get directValue(){return this.mDirectValue}get direction(){return this.mDirection}get document(){return this.mDocument}get label(){return this.mLabel}set label(t){this.mLabel=t}get node(){return this.mNode}get portType(){return this.mPortType}get project(){return this.mProject}get resolvedDataType(){return this.resolveDataType(new Set)}constructor(t,e,r){if(r.portType==="flow"&&r.dataType!==null)throw new _("Flow ports cannot have a value type.",this);if(r.portType==="value"&&r.dataType===null)throw new _("Value ports must have a value type.",this);this.mProject=t,this.mDocument=e,this.mNode=r.node,this.mDefinitionId=r.definitionId,this.mLabel=r.label,this.mDataType=r.dataType,this.mDirection=r.direction,this.mPortType=r.portType,this.mConnectedPorts=new Set,this.mDirectValue=new Array,r.dataType&&!this.mProject.types.isGenericType(r.dataType)&&this.mDirectValue.push(...t.types.getType(r.dataType).default.string)}connect(t){if(this.mConnectedPorts.has(t))return;if(this.mPortType!==t.portType)throw new _(`Cannot connect port ${this.mDefinitionId} of node ${this.mNode.label} to port ${t.mDefinitionId} of node ${t.node.label} due to incompatible port types.`,this);if(this.mDirection===t.direction)throw new _(`Cannot connect port ${this.mDefinitionId} of node ${this.mNode.label} to port ${t.mDefinitionId} of node ${t.node.label} due to incompatible directions.`,this);if(this.node===t.node)throw new _(`Cannot connect port ${this.mDefinitionId} of node ${this.mNode.label} to another port of the same node.`,this);if(!(this.mPortType==="flow"&&this.mDirection==="input"||this.mPortType==="value"&&this.mDirection==="output"))for(let r of Array.from(this.mConnectedPorts))this.disconnect(r);this.mConnectedPorts.add(t),t.connect(this)}disconnect(t){this.mConnectedPorts.has(t)&&(this.mConnectedPorts.delete(t),t.disconnect(this))}setDirectValue(t){if(this.mPortType!=="value")throw new _("Only value ports can have a direct value.",this);if(this.mProject.types.isGenericType(this.mDataType))throw new _("Generic value ports cannot have a direct value.",this);if(t.length!==this.mProject.types.getType(this.mDataType).default.string.length)throw new _("The provided value does not match the expected length of the default value for this port's type.",this);this.mDirectValue.splice(0,this.mDirectValue.length),this.mDirectValue.push(...t)}validate(){let t=new wt;if(this.mDirection==="output"){if(this.mPortType==="flow"&&this.mConnectedPorts.size>1&&t.pushError(new K(`Flow output port "${this.mDefinitionId}" on node "${this.mNode.label}" can only have one connection.`,this)),this.mPortType==="value"&&this.mProject.types.isGenericType(this.mDataType??"")){let e=this.mNode.inputs.value.filter(r=>r.dataType===this.mDataType);for(let r of e)r.connectedPorts.size===0&&t.pushError(new K(`Generic output port "${this.mDefinitionId}" on node "${this.mNode.label}" cannot resolve generic type "${this.mDataType}" because its input port "${r.definitionId}" is not connected.`,this))}return t}if(this.mDirection==="input"){if(this.mPortType==="flow")return this.mConnectedPorts.size===0&&t.pushError(new K(`Flow input port "${this.mDefinitionId}" on node "${this.mNode.label}" must have at least one connection.`,this)),t;if(this.mPortType==="value"){this.mConnectedPorts.size>1&&t.pushError(new K(`Value input port "${this.mDefinitionId}" on node "${this.mNode.label}" can only have one connection.`,this));for(let e of this.mConnectedPorts)e.resolvedDataType!==this.resolvedDataType&&t.pushError(new K(`Value input port "${this.mDefinitionId}" on node "${this.mNode.label}" expects type "${this.resolvedDataType}" but is connected to type "${e.resolvedDataType}".`,this));return t}}return t}resolveDataType(t){if(t.has(this.node))return this.mDataType;if(this.mDirection==="input"&&t.add(this.node),this.mPortType!=="value")throw new _("Port data type couldn't be resolved as it is no value port.",this);if(!this.mProject.types.isGenericType(this.mDataType??""))return this.mDataType;if(this.mDirection==="output"){let r=this.mNode.inputs.value.find(u=>u.dataType===this.mDataType);if(!r)throw new _("Port type couldn't be resolved as it has no resolving sibling port",this);return r.resolveDataType(t)}return this.mConnectedPorts.size===0?this.mDataType:this.mConnectedPorts.values().next().value.resolveDataType(t)}};var Nt=class{mDefinitionId;mDocument;mFunction;mInputs;mLabel;mOutputs;mPreview;mProject;mTransformation;get definitionId(){return this.mDefinitionId}get document(){return this.mDocument}get function(){return this.mFunction}get hasFlowPorts(){return this.mOutputs.flow.length>0||this.mInputs.flow.length>0}get hasValuePorts(){return this.mOutputs.value.length>0||this.mInputs.value.length>0}get inputs(){return this.mInputs}get label(){return this.mLabel}set label(t){this.mLabel=t}get outputs(){return this.mOutputs}get preview(){return this.mPreview}set preview(t){this.mPreview=t}get project(){return this.mProject}get transformation(){return this.mTransformation}constructor(t,e,r,u){this.mDocument=e,this.mDefinitionId=u.definitionId,this.mFunction=r,this.mLabel=u.label,this.mPreview=u.preview??null,this.mProject=t,this.mTransformation={x:0,y:0,width:0,height:0};let f=(y,b)=>{let T={direction:b,list:new Array,map:new Map,flow:new Array,value:new Array};for(let N of y){let c=new dt(this.mProject,this.mDocument,{definitionId:N.definitionId,direction:b,label:N.label,node:this,portType:N.portType,dataType:N.dataType});T.list.push(c),T.map.set(c.definitionId,c),(c.portType==="flow"?T.flow:T.value).push(c)}return T};this.mInputs=f(u.ports.input,"input"),this.mOutputs=f(u.ports.output,"output"),this.resizeTo(u.transformation.width,u.transformation.height),this.moveTo(u.transformation.x,u.transformation.y)}moveTo(t,e){this.mTransformation.x=Math.round(t),this.mTransformation.y=Math.round(e)}resizeTo(t,e){let r=this.mFunction.nodeDefinitions.find(y=>y.id===this.mDefinitionId),[u,f]=(()=>{switch(r?.id){case bt.DEFINITION_ID:return[Math.max(6,t),Math.max(6,e)];case k.DEFINITION_ID:case Z.DEFINITION_ID:return[1,1];default:return[6,Math.max(this.mInputs.list.length,this.mOutputs.list.length)+1]}})();this.mTransformation.width=u,this.mTransformation.height=f}validate(t){let e=new wt,r=t??new Set,u=this.mFunction.nodeDefinitions.find(f=>f.id===this.mDefinitionId);if(!u)e.pushError(new K(`Node "${this.mLabel}" definition "${this.mDefinitionId}" could not be found.`,this));else{e.merge(this.resyncPorts(this.mInputs,u.inputs)),e.merge(this.resyncPorts(this.mOutputs,u.outputs));let f=new Set([...u.regions.requires,...u.regions.allows]);if(f.size>0)for(let y of r)f.has(y)||e.pushError(new K(`Node "${this.mLabel}" does not allow region "${y}".`,this));if(u.regions.requires.length>0)for(let y of u.regions.requires)r.has(y)||e.pushError(new K(`Node "${this.mLabel}" requires region "${y}" but it is not active.`,this))}for(let f of[...this.mInputs.list,...this.mOutputs.list])e.merge(f.validate());return this.resizeTo(this.transformation.width,this.transformation.height),e}addPort(t,e,r){let u=new dt(this.mProject,this.mDocument,{definitionId:e.id,direction:t.direction,label:e.label,node:this,portType:e.portType,dataType:e.dataType});return t.list.splice(r,0,u),t.map.set(u.definitionId,u),(u.portType==="flow"?t.flow:t.value).push(u),u}removePort(t,e){let r=t.list.indexOf(e);if(r===-1)throw new _(`Port "${e.label}" was not found and can not be removed.`,this);t.list.splice(r,1),t.map.delete(e.definitionId);let u=e.portType==="flow"?t.flow:t.value,f=u.indexOf(e);if(r===-1)throw new _(`Port "${e.label}" was not found in typed list and can not be removed.`,this);return u.splice(f,1),r}replacePort(t,e,r){let u=Array.from(e.connectedPorts);for(let b of Array.from(e.connectedPorts))e.disconnect(b);let f=this.removePort(t,e),y=this.addPort(t,r,f);for(let b of u)y.connect(b);return y}resyncPorts(t,e){let r=new wt,u=new Set(e.map(f=>f.id));for(let f=0;f<e.length;f++){let y=e[f];if(!t.map.has(y.id)){let n=this.addPort(t,y,f);r.addAffectedItem(n);continue}let b=t.map.get(y.id),T=b.portType!==y.portType,N=b.dataType!==y.dataType;if(!T&&!N)continue;if(b.connectedPorts.size>0&&T){r.pushError(new K(`Port "${b.label}" on node "${this.mLabel}" has a changed type.`,b));continue}let c=this.replacePort(t,b,y);r.addAffectedItem(b),r.addAffectedItem(c)}for(let f of t.list)if(!u.has(f.definitionId)){if(f.connectedPorts.size===0){r.addAffectedItem(f),this.removePort(t,f);continue}r.pushError(new K(`Port "${f.label}" on node "${this.mLabel}" no longer exists in its definition.`,f))}return r}};var Et=class{mDefinitionId;mDocument;mId;mImportIds;mInputs;mIsSystem;mLabel;mNodes;mOutputs;mProject;get definitionId(){return this.mDefinitionId}get document(){return this.mDocument}get dynamicNodeDefinitions(){let t=this.mDocument.nodeDefinitions.filter(f=>!(f instanceof yt&&f.function===this)),e=this.mProject.getFunction(this.definitionId);if(!e)return t;let r=e.getNodeDefinitions(this),u=this.mProject.imports.filter(f=>this.mImportIds.has(f.id)).flatMap(f=>f.nodes);return[...t,...u,...r.dynamic]}get id(){return this.mId}get imports(){return this.mImportIds}get inputs(){return this.mInputs}get isSystem(){return this.mIsSystem}get label(){return this.mLabel}set label(t){this.mLabel=t}get nodeDefinitions(){let t=this.mProject.getFunction(this.definitionId);if(!t)return this.dynamicNodeDefinitions;let e=t.getNodeDefinitions(this);return[...this.dynamicNodeDefinitions,...e.entry,...e.exit]}get nodes(){return this.mNodes}get outputs(){return this.mOutputs}get project(){return this.mProject}constructor(t,e,r){this.mProject=t,this.mDocument=e,this.mLabel=r.label,this.mIsSystem=r.isSystem,this.mDefinitionId=r.definitionId,this.mId=r.id,this.mNodes=new Set,this.mInputs=new Array,this.mOutputs=new Array,this.mImportIds=new Set}addImport(t){if(!this.project.imports.some(r=>r.id===t))throw new _(`Project does not contain import ${t}`,this);this.mImportIds.add(t)}addInput(t){this.mInputs.some(e=>e.label===t.label)||this.mInputs.push(t)}addNode(t){this.mNodes.add(t)}addNodeByDefinition(t,e){let r=f=>({definitionId:f.id,label:f.label,portType:f.portType,dataType:f.dataType}),u=new Nt(this.mProject,this.mDocument,this,{definitionId:t.id,ports:{input:t.inputs.map(r),output:t.outputs.map(r)},label:t.label,transformation:e});return this.mNodes.add(u),u}addOutput(t){this.mOutputs.some(e=>e.label===t.label)||this.mOutputs.push(t)}getExitNodes(){let t=this.mProject.getFunction(this.mDefinitionId);if(!t)throw new _(`Function definition not found for function "${this.mLabel}".`,this);let e=new Set(t.getNodeDefinitions(this).exit.map(r=>r.id));return[...this.mNodes].filter(r=>e.has(r.definitionId))}removeImport(t){this.mImportIds.delete(t)}removeInput(t){let e=this.mInputs.findIndex(r=>r.label===t.label);e!==-1&&this.mInputs.splice(e,1)}removeNode(t){for(let e of[...t.inputs.list,...t.outputs.list])for(let r of Array.from(e.connectedPorts))e.disconnect(r);this.mNodes.delete(t)}removeOutput(t){let e=this.mOutputs.findIndex(r=>r.label===t.label);e!==-1&&this.mOutputs.splice(e,1)}validate(){let t=new wt,e=this.mProject.getFunction(this.mDefinitionId);e||t.pushError(new K(`Function "${this.mLabel}" definition "${this.mDefinitionId}" could not be found.`,this));let r=e?.getNodeDefinitions(this);r&&this.resyncFunction(r,t);let u=this.collectRegions(this.mNodes,t),f=new Set(r?.entry.map(b=>b.id)??new Array),y=new Map;for(let b of this.mNodes)t.merge(b.validate(u.get(b))),this.collectEntryDomains(b,f,y).size>1&&t.pushError(new K(`Node "${b.label}" is reachable from multiple entry nodes.`,b));return t}collectEntryDomains(t,e,r){if(r.has(t))return r.get(t);let u=new Set;r.set(t,u);for(let f of t.inputs.list)for(let y of f.connectedPorts){let b=y.node;e.has(b.definitionId)&&u.add(b);for(let T of this.collectEntryDomains(b,e,r))u.add(T)}return u}collectRegions(t,e){let r=new Map;for(let b of this.nodeDefinitions)r.set(b.id,b);let u=(()=>{let b=new Map;return(T,N)=>{if(!b.has(T.id)){let c=new Map;for(let n of T.outputs)c.set(n.id,n.regions.add);b.set(T.id,c)}return[...b.get(T.id).get(N)??new Array,...T.regions.add]}})(),f=(()=>{let b=new Map;return(T,N)=>{if(b.has(T))return b.get(T);if(N.has(T))return e.pushError(new K(`Node "${T.label}" is part of a connection cycle.`,T)),new Set;N.add(T);let c=new Set;for(let n of T.inputs.list)for(let h of n.connectedPorts){let l=h.node;for(let o of f(l,N))c.add(o);if(r.has(l.definitionId))for(let o of u(r.get(l.definitionId),h.definitionId))c.add(o)}return b.set(T,c),c}})(),y=new Map;for(let b of t)y.set(b,f(b,new Set));return y}resyncFunction(t,e){let r=[...t.entry,...t.exit],u=new Set(this.mNodes.values().map(b=>b.definitionId)),f=0,y=20;for(let b of r){if(u.has(b.id))continue;let T=this.addNodeByDefinition(b,{x:Math.floor(f/(r.length/2))*y+2,y:f*y+2-Math.floor(f/(r.length/2))*(r.length/2*y),width:0,height:0});e.addAffectedItem(T),f++}}};var jt=class{mFunctionNodeDefinitions;mFunctions;mProject;get functions(){return this.mFunctions}get nodeDefinitions(){return[...this.mFunctionNodeDefinitions.values(),...this.mProject.nodeDefinitions.values()]}get project(){return this.mProject}constructor(t){this.mProject=t,this.mFunctions=new Array,this.mFunctionNodeDefinitions=new Map}addFunction(t){let e=this.mFunctions.indexOf(t);e!==-1&&this.mFunctions.splice(e,1),this.mFunctions.push(t);let r=new yt(t);return this.mFunctionNodeDefinitions.set(r.id,r),t}newFunction(t){return this.addFunction(new Et(this.mProject,this,t))}removeFunction(t){if(t.isSystem)throw new _("Cannot remove a system function.",this);let e=this.mFunctions.indexOf(t);if(e===-1)return!1;this.mFunctions.splice(e,1);for(let r of this.mFunctionNodeDefinitions.values())r.function===t&&this.mFunctionNodeDefinitions.delete(r.id);return!0}validate(){let t=new wt,e=this.mProject.entryPoint.id;if(!this.mFunctions.values().some(r=>r.definitionId===e)){let r=this.newFunction({definitionId:e,id:crypto.randomUUID(),isSystem:!0,label:this.mProject.entryPoint.label});t.addAffectedItem(r)}for(let r of this.mFunctions)t.merge(r.validate());return t.pushError(...this.detectCrossFunctionRecursion()),t}detectCrossFunctionRecursion(){let t=[],e=new Map,r=b=>{if(!e.has(b)){let T=new Set;for(let N of b.nodes)this.mFunctionNodeDefinitions.has(N.definitionId)&&T.add(this.mFunctionNodeDefinitions.get(N.definitionId).function);e.set(b,T)}return e.get(b)},u=new Set,f=new Set,y=b=>{if(!u.has(b)){if(f.has(b)){t.push(new K(`Function "${b.label}" participates in a cross-function recursion cycle.`,b));return}f.add(b);for(let T of r(b))y(T);f.delete(b),u.add(b)}};for(let b of this.mFunctions)y(b);return t}};var Vt=class{mData;mInteractionType;mOrigin;get data(){return this.mData}get origin(){return this.mOrigin}get triggerType(){return this.mInteractionType}constructor(t,e,r){this.mInteractionType=t,this.mData=r,this.mOrigin=e}};var xt=class v{static mCurrentZone=new v("Default");static get current(){return v.mCurrentZone}static create(t){return new v(t,v.current)}mAttachments;mInteractionListener;mName;mParent;mTriggerFilterBitmap;get name(){return this.mName}get parent(){return this.mParent}constructor(t,e=null){this.mName=t,this.mParent=e,this.mTriggerFilterBitmap=-1,this.mInteractionListener=new Map,this.mAttachments=new WeakMap}addInteractionListener(t){return this.mInteractionListener.set(t,v.current),this}execute(t,...e){let r=v.mCurrentZone;v.mCurrentZone=this;try{return t(...e)}finally{v.mCurrentZone=r}}getAttachment(t){return this.mAttachments.has(t)?this.mAttachments.get(t):this.mParent!==null?this.mParent.getAttachment(t):null}pushInteraction(t,e){if((this.mTriggerFilterBitmap&t)===0)return!1;if(this.mInteractionListener.size===0)return!0;let r=new Vt(t,this,e);for(let[u,f]of this.mInteractionListener.entries())f.execute(()=>{u.call(this,r)});return!0}removeInteractionListener(t){return t?(this.mInteractionListener.delete(t),this):(this.mInteractionListener.clear(),this)}setAttachment(t,e){this.mAttachments.set(t,e)}setTriggerRestriction(t){return this.mTriggerFilterBitmap=t,this}};var Q=class v{static mComponents=new WeakMap;static mConstructorSelector=new WeakMap;static mElements=new WeakMap;static elementIsComponent(t){return v.mComponents.has(t)}static ofComponent(t){let e=t.processorConstructor,r=v.mConstructorSelector.get(e);if(!r)throw new _(`Constructor "${e.name}" is not a registered custom element`,e);let u=v.mElements.get(t);if(!u)throw new _(`Component "${t}" is not a registered component`,t);return{selector:r,constructor:e,element:u,component:t,processor:t.processor}}static ofConstructor(t){let e=v.mConstructorSelector.get(t);if(!e)throw new _(`Constructor "${t.name}" is not a registered custom element`,t);let r=globalThis.customElements.get(e);if(!r)throw new _(`Constructor "${t.name}" is not a registered custom element`,t);return{selector:e,constructor:t,elementConstructor:r}}static ofElement(t){let e=v.mComponents.get(t);if(!e)throw new _(`Element "${t}" is not a PwbComponent.`,t);return v.ofComponent(e)}static ofProcessor(t){let e=v.mComponents.get(t);if(!e)throw new _("Processor is not a PwbComponent.",t);return v.ofComponent(e)}static registerComponent(t,e,r){v.mComponents.has(e)||v.mComponents.set(e,t),r&&!v.mComponents.has(r)&&v.mComponents.set(r,t),v.mElements.has(t)||v.mElements.set(t,e)}static registerConstructor(t,e){t&&!v.mConstructorSelector.has(t)&&v.mConstructorSelector.set(t,e)}};var It=class{static ATTACHMENT_KEY=Symbol("ComponentZoneConfiguration");mFrameTime;mInjection;get guaranteedFrameTime(){return this.mFrameTime}set guaranteedFrameTime(t){this.mFrameTime=t}get injections(){return this.mInjection}constructor(){this.mInjection=new Map,this.mFrameTime=Number.MAX_SAFE_INTEGER}setInjection(t,e){this.mInjection.set(t,e)}};var Jt=class extends Error{mZone;get zone(){return this.mZone}constructor(t,e){let r=t instanceof Error?t.message:"Non-error value thrown";super(`Update error in zone "${e.name}": ${r}`,{cause:t}),this.mZone=e}};var me=class v{static new(t,e){let r=new v;t(r),e&&r.appendTo(e)}mComponentZoneConfiguration;mContent;mCurrentTarget;mErrorListener;mFragment;mInteractionZone;constructor(){this.mContent=new Array,this.mFragment=document.createDocumentFragment(),this.mCurrentTarget=null,this.mErrorListener=new Array,this.mInteractionZone=xt.create("PwbApplication"),this.mComponentZoneConfiguration=new It,this.mInteractionZone.setAttachment(It.ATTACHMENT_KEY,this.mComponentZoneConfiguration),globalThis.addEventListener("error",t=>{this.handleZoneError(t,t.error)}),globalThis.addEventListener("unhandledrejection",t=>{this.handleZoneError(t,t.reason)})}addContent(t){let e=Q.ofConstructor(t).elementConstructor,r=this.mInteractionZone.execute(()=>Q.ofElement(new e));return this.mContent.push(r.component),this.mFragment.appendChild(r.element),this.updateTarget(),r.processor}addErrorListener(t){this.mErrorListener.includes(t)&&this.removeErrorListener(t),this.mErrorListener.push(t)}addStyle(t){let e=document.createElement("style");e.textContent=t,this.mFragment.prepend(e)}appendTo(t){this.mCurrentTarget=t,this.updateTarget()}removeErrorListener(t){let e=this.mErrorListener.indexOf(t);e!==-1&&this.mErrorListener.splice(e,1)}setInjection(t,e){this.mComponentZoneConfiguration.setInjection(t,e)}handleZoneError(t,e){if(!(e instanceof Jt)||!this.zoneBelongsToApplication(e.zone))return;t.preventDefault();let r=!1;for(let u of this.mErrorListener)u(e.cause)===!0&&(r=!0);r||console.error(e.cause)}updateTarget(){this.mCurrentTarget&&(this.mCurrentTarget.shadowRoot||this.mCurrentTarget.attachShadow({mode:"open"}),this.mCurrentTarget.shadowRoot.appendChild(this.mFragment))}zoneBelongsToApplication(t){let e=t;for(;e!==null;){if(e===this.mInteractionZone)return!0;e=e.parent}return!1}};var Kt=class{mCustomMetadata;constructor(){this.mCustomMetadata=new Map}getMetadata(t){return this.mCustomMetadata.get(t)??null}setMetadata(t,e){this.mCustomMetadata.set(t,e)}};var pe=class extends Kt{};var ge=class v extends Kt{static mPrivateMetadataKey=Symbol("Metadata");mDecoratorMetadataObject;mPropertyMetadata;constructor(t){super(),this.mDecoratorMetadataObject=t,this.mPropertyMetadata=new Map,t[v.mPrivateMetadataKey]=this}getInheritedMetadata(t){let e=new Array,r=this.mDecoratorMetadataObject;do{if(Object.hasOwn(r,v.mPrivateMetadataKey)){let f=r[v.mPrivateMetadataKey].getMetadata(t);f!==null&&e.push(f)}r=Object.getPrototypeOf(r)}while(r!==null);return e.reverse()}getProperty(t){return this.mPropertyMetadata.has(t)||this.mPropertyMetadata.set(t,new pe),this.mPropertyMetadata.get(t)}};Symbol.metadata??=Symbol("Symbol.metadata");var st=class v{static mMetadataMapping=new Map;static add(t,e){return(r,u)=>{let f=v.forInternalDecorator(u.metadata);switch(u.kind){case"class":f.setMetadata(t,e);return;case"method":case"field":case"getter":case"setter":case"accessor":if(u.static)throw new Error("@Metadata.add not supported for statics.");f.getProperty(u.name).setMetadata(t,e);return}}}static forInternalDecorator(t){return v.mapMetadata(t)}static get(t){Object.hasOwn(t,Symbol.metadata)||v.polyfillMissingMetadata(t);let e=t[Symbol.metadata];return v.mapMetadata(e)}static init(){return(t,e)=>{v.forInternalDecorator(e.metadata)}}static mapMetadata(t){if(v.mMetadataMapping.has(t))return v.mMetadataMapping.get(t);let e=new ge(t);return v.mMetadataMapping.set(t,e),e}static polyfillMissingMetadata(t){let e=new Array,r=t;do e.push(r),r=Object.getPrototypeOf(r);while(r!==null);for(let u=e.length-1;u>=0;u--){let f=e[u];if(!Object.hasOwn(f,Symbol.metadata)){let y=null;u<e.length-2&&(y=e[u+1][Symbol.metadata]),f[Symbol.metadata]=Object.create(y,{})}}}};var O=class v{static mCurrentInjectionContext=null;static mInjectMode=new Map;static mInjectableConstructor=new Map;static mInjectableReplacement=new Map;static mInjectionConstructorIdentificationMetadataKey=Symbol("InjectionConstructorIdentification");static mSingletonMapping=new Map;static createObject(t,e,r){let[u,f]=typeof e=="object"&&e!==null?[!1,e]:[!!e,r??new Map],y=v.getInjectionIdentification(t);if(!v.mInjectableConstructor.has(y))throw new _(`Constructor "${t.name}" is not registered for injection and can not be built`,v);let b=u?"instanced":v.mInjectMode.get(y),T=new Map(f.entries().map(([n,h])=>[v.getInjectionIdentification(n),h])),N=v.mCurrentInjectionContext,c=new Map([...N?.localInjections.entries()??[],...T.entries()]);v.mCurrentInjectionContext={injectionMode:b,localInjections:c};try{if(!u&&b==="singleton"&&v.mSingletonMapping.has(y))return v.mSingletonMapping.get(y);let n=new t;return b==="singleton"&&!v.mSingletonMapping.has(y)&&v.mSingletonMapping.set(y,n),n}finally{v.mCurrentInjectionContext=N}}static injectable(t="instanced"){return(e,r)=>{v.registerInjectable(e,r.metadata,t)}}static registerInjectable(t,e,r){let u=v.getInjectionIdentification(t,e);v.mInjectableConstructor.set(u,t),v.mInjectMode.set(u,r)}static replaceInjectable(t,e){let r=v.getInjectionIdentification(t);if(!v.mInjectableConstructor.has(r))throw new _("Original constructor is not registered.",v);let u=v.getInjectionIdentification(e);if(!v.mInjectableConstructor.has(u))throw new _("Replacement constructor is not registered.",v);v.mInjectableReplacement.set(r,e)}static use(t){if(v.mCurrentInjectionContext===null)throw new _("Can't create object outside of an injection context.",v);let e=v.getInjectionIdentification(t);if(v.mCurrentInjectionContext.injectionMode!=="singleton"&&v.mCurrentInjectionContext.localInjections.has(e))return v.mCurrentInjectionContext.localInjections.get(e);let r=v.mInjectableReplacement.get(e);if(r||(r=v.mInjectableConstructor.get(e)),!r)throw new _(`Constructor "${t.name}" is not registered for injection and can not be built`,v);return v.createObject(r)}static getInjectionIdentification(t,e){let r=e?st.forInternalDecorator(e):st.get(t),u=r.getMetadata(v.mInjectionConstructorIdentificationMetadataKey);return u||(u=Symbol(t.name),r.setMetadata(v.mInjectionConstructorIdentificationMetadataKey,u)),u}};var q=function(v){return v[v.Read=1]="Read",v[v.ReadWrite=2]="ReadWrite",v[v.Write=3]="Write",v}({});var _t=class{mHooks;mInjections;mProcessor;mProcessorConstructor;get processor(){if(!this.mProcessor)throw new _("Processor is not created yet. Call setup to create processor.",this);return this.mProcessor}get processorConstructor(){return this.mProcessorConstructor}constructor(t){if(this.mProcessorConstructor=t.constructor,this.mProcessor=null,this.mInjections=new Map,this.mHooks={create:new Array},t.parent)for(let[e,r]of t.parent.mInjections.entries())this.setProcessorInjection(e,r)}deconstruct(){}getProcessorInjection(t){return this.mInjections.get(t)}setProcessorInjection(t,e){if(this.mProcessor)throw new _("Cant add injections to after construction.",this);this.mInjections.set(t,e)}setup(){return this.mProcessor=this.createProcessor(),this}addConstructionHook(t){return this.mHooks.create.push(t),this}call(t,...e){let r=Reflect.get(this.processor,t);return typeof r!="function"?null:r.apply(this.processor,e)}createProcessor(){let t=O.createObject(this.mProcessorConstructor,this.mInjections),e;for(;e=this.mHooks.create.pop();){let r=e.call(this,t);r&&(t=r)}return t}};var $t=class v extends _t{constructor(t,e){super({constructor:t,parent:e}),this.setProcessorInjection(v,this)}deconstruct(){this.call("onDeconstruct"),super.deconstruct()}setup(){return super.setup(),this.call("onExecute"),this}onUpdate(){return!1}};var vo=class v{static mInstance;mCoreEntityConstructor;mProcessorConstructorConfiguration;constructor(){if(v.mInstance)return v.mInstance;v.mInstance=this,this.mCoreEntityConstructor=new Map,this.mProcessorConstructorConfiguration=new Map}get(t){let e=this.mCoreEntityConstructor.get(t);if(!e)return new Array;let r=new Array;for(let u of e)r.push({processorConstructor:u,processorConfiguration:this.mProcessorConstructorConfiguration.get(u)});return r}register(t,e,r){this.mProcessorConstructorConfiguration.set(e,r);let u=t;do{if(!(u.prototype instanceof _t)&&u!==_t)break;this.mCoreEntityConstructor.has(u)||this.mCoreEntityConstructor.set(u,new Set),this.mCoreEntityConstructor.get(u).add(e)}while(u=Object.getPrototypeOf(u))}},ct=new vo;var Qt=class v extends _t{static mExtensionCache=new WeakMap;mExtensionList;constructor(t){super(t),this.mExtensionList=new Array}deconstruct(){for(let t of this.mExtensionList)t.deconstruct();super.deconstruct()}setup(){return super.setup(),this.executeExtensions(),this}executeExtensions(){let t=(()=>{if(!v.mExtensionCache.has(this.processorConstructor)){let u=ct.get($t).filter(y=>{for(let b of y.processorConfiguration.targetRestrictions)if(this instanceof b||this.processorConstructor.prototype instanceof b||this.processorConstructor===b)return!0;return!1}),f={read:u.filter(y=>y.processorConfiguration.access===q.Read),write:u.filter(y=>y.processorConfiguration.access===q.Write),readWrite:u.filter(y=>y.processorConfiguration.access===q.ReadWrite)};v.mExtensionCache.set(this.processorConstructor,f)}return v.mExtensionCache.get(this.processorConstructor)})(),e=[...t.write,...t.readWrite,...t.read];for(let r of e)this.mExtensionList.push(new $t(r.processorConstructor,this).setup())}};var U={get:1,set:2,manual:4};var Le=class v{static ORIGINAL_TO_INTERACTION_MAPPING=new WeakMap;static PROXY_TO_ORIGINAL_MAPPING=new WeakMap;static UNTRACEABLE_FUNCTION_UPDATE_TRIGGER=(()=>{let t=new WeakMap;return t.set(Array.prototype.fill,U.set),t.set(Array.prototype.pop,U.get),t.set(Array.prototype.push,U.set),t.set(Array.prototype.shift,U.get),t.set(Array.prototype.unshift,U.set),t.set(Array.prototype.splice,U.set),t.set(Array.prototype.reverse,U.set),t.set(Array.prototype.sort,U.set),t.set(Array.prototype.concat,U.set),t.set(Map.prototype.clear,U.set),t.set(Map.prototype.delete,U.set),t.set(Map.prototype.set,U.set),t.set(Set.prototype.clear,U.set),t.set(Set.prototype.delete,U.set),t.set(Set.prototype.add,U.set),t})();static getOriginal(t){return v.PROXY_TO_ORIGINAL_MAPPING.get(t)??t}static getWrapper(t){let e=v.getOriginal(t);return v.ORIGINAL_TO_INTERACTION_MAPPING.get(e)}mProxyObject;mStateChangeCallback;get proxy(){return this.mProxyObject}constructor(t,e){let r=v.getWrapper(t);if(r)return r;this.mProxyObject=this.createProxyObject(t),this.mStateChangeCallback=e,v.PROXY_TO_ORIGINAL_MAPPING.set(this.mProxyObject,t),v.ORIGINAL_TO_INTERACTION_MAPPING.set(t,this)}convertToProxy(t){return t===null||typeof t!="object"&&typeof t!="function"?t:new v(t,this.mStateChangeCallback).proxy}createProxyObject(t){let e=(u,f,y)=>{let b=v.getOriginal(f);try{let T=u.call(b,...y);return this.convertToProxy(T)}finally{if(v.UNTRACEABLE_FUNCTION_UPDATE_TRIGGER.has(u)){let T=v.getWrapper(f);T&&T.dispatch(v.UNTRACEABLE_FUNCTION_UPDATE_TRIGGER.get(u))}}};return new Proxy(t,{apply:(u,f,y)=>{let b=u;try{let T=b.call(f,...y);return this.convertToProxy(T)}catch(T){if(!(T instanceof TypeError))throw T;return e(b,f,y)}},set:(u,f,y)=>{try{let b=y;return(b!==null&&typeof b=="object"||typeof b=="function")&&(b=v.getOriginal(b)),Reflect.set(u,f,b)}finally{this.dispatch(U.set)}},get:(u,f,y)=>{try{return this.convertToProxy(Reflect.get(u,f))}finally{this.dispatch(U.get)}},deleteProperty:(u,f)=>{try{return delete u[f]}finally{this.dispatch(U.set)}}})}dispatch(t){this.mStateChangeCallback(t)}};var $=class v{static reaction(t){let e=xt.create("ComponentState reaction");e.addInteractionListener(r=>{(r.triggerType&U.set)!==0&&t()}),e.execute(()=>{t()})}static state(t){return(e,r)=>{if(r.static)throw new _("Event target is not for a static property.",v);let u=new WeakMap,f=(y,b)=>{u.set(y,new v(b,t))};return{init(y){return typeof y>"u"||f(this,y),y},set(y){u.has(this)?u.get(this).set(y):f(this,y)},get(){return u.has(this)||f(this,void 0),u.get(this).get()}}}}mConfiguration;mLinkedZones;mLinkedZonesArray;mValue;constructor(t,e){if(this.mLinkedZones=new Set,this.mLinkedZonesArray=new Array,this.mConfiguration={complexValue:e?.complexValue??!1,proxy:e?.proxy??!1},this.mConfiguration.proxy){if(typeof t!="object"||t===null)throw new _("Proxied component state value must be an object.",this);this.mValue=new Le(t,r=>{switch(r){case U.set:return this.dispatchChange();case U.get:return this.linkCurrentZone()}}).proxy}else this.mValue=t}get(){return this.linkCurrentZone(),this.mValue}set(t){if(this.mConfiguration.proxy)throw new _("Proxy is not implemented yet.",this);!this.mConfiguration.complexValue&&this.mValue===t||(this.mValue=t,this.dispatchChange())}dispatchChange(){for(let t of this.mLinkedZonesArray)t.pushInteraction(U.set,this)}linkCurrentZone(){let t=xt.current;this.mLinkedZones.has(t)||(this.mLinkedZones.add(t),this.mLinkedZonesArray.push(t))}};var Gt=class v{static mCurrentUpdateCycle=null;static openResheduledCycle(t,e){let r=!1;if(!v.mCurrentUpdateCycle){let u=performance.now();v.mCurrentUpdateCycle={initiator:t.initiator,startTime:u,forcedSync:t.forcedSync,runner:t.runner},r=!0}try{return e(v.mCurrentUpdateCycle)}finally{r&&(v.mCurrentUpdateCycle=null)}}static openUpdateCycle(t,e){let r=!1;if(!v.mCurrentUpdateCycle){let u=performance.now();v.mCurrentUpdateCycle={initiator:t.updater,startTime:u,forcedSync:t.runSync,runner:Symbol("Runner "+u)},r=!0}try{return e(v.mCurrentUpdateCycle)}finally{r&&(v.mCurrentUpdateCycle=null)}}static updateCycleRunId(t,e){if(t.initiator===e){let r=performance.now(),u=t;u.runner=Symbol("Runner "+r)}}static updateCyleStartTime(t){let e=performance.now(),r=t;r.startTime=e}};var Re=class extends Error{mChain;get chain(){return this.mChain}constructor(t,e){let r=e.slice(-20).map(u=>u.toString()).join(`
`);super(`${t}: 
${r}`),this.mChain=[...e]}};var Oe=class v{static DEFAULT_FRAME_TIME=Number.MAX_SAFE_INTEGER;static STACK_CAP=100;mFrameTime;mInteractionZone;mManualComponentState;mUpdateFunction;mUpdateRunCache;mUpdateStates;get zone(){return this.mInteractionZone}constructor(t){this.mUpdateRunCache=new WeakMap,this.mUpdateFunction=t.onUpdate,this.mFrameTime=v.DEFAULT_FRAME_TIME;let e=xt.current.getAttachment(It.ATTACHMENT_KEY);e&&(this.mFrameTime=e.guaranteedFrameTime),this.mManualComponentState=new $(Symbol("Manual Update")),this.mUpdateStates={chainCompleteHooks:new zt,async:{hasSheduledTask:!1,hasRunningTask:!1,sheduledTaskIsResheduled:!1},sync:{running:!1},cycle:{chainedTask:null}},this.mInteractionZone=xt.create("Update-Zone"),this.mInteractionZone.addInteractionListener(r=>{(r.triggerType&U.set)!==0&&this.runUpdateAsynchron(r,null)})}deconstruct(){this.mInteractionZone.removeInteractionListener()}executeInZone(t){return this.mInteractionZone.execute(t)}update(){let t=new Vt(U.manual,this.mInteractionZone,this.mManualComponentState);return this.runUpdateSynchron(t)}updateAsync(){let t=new Vt(U.manual,this.mInteractionZone,this.mManualComponentState);this.runUpdateAsynchron(t,null)}async waitForUpdate(){return this.mUpdateStates.async.hasSheduledTask?new Promise((t,e)=>{this.mUpdateStates.chainCompleteHooks.push((r,u)=>{u?e(u):t(r)})}):!1}executeTaskChain(t,e,r,u){if(u.length>v.STACK_CAP)throw new Re("Call loop detected",u);let f=performance.now();if(!e.forcedSync&&f-e.startTime>this.mFrameTime)throw new ve;u.push(t);let y=this.mInteractionZone.execute(()=>this.mUpdateFunction.call(this))||r;if(Gt.updateCycleRunId(e,this),!this.mUpdateStates.cycle.chainedTask)return y;let b=this.mUpdateStates.cycle.chainedTask;return this.mUpdateStates.cycle.chainedTask=null,this.executeTaskChain(b,e,y,u)}releaseUpdateChainCompleteHooks(t,e){if(!this.mUpdateStates.chainCompleteHooks.top)return;let r;for(;r=this.mUpdateStates.chainCompleteHooks.pop();)r(t,e)}runUpdateAsynchron(t,e){if(this.mUpdateStates.async.hasRunningTask||this.mUpdateStates.async.sheduledTaskIsResheduled){this.mUpdateStates.cycle.chainedTask=t;return}if(this.mUpdateStates.async.hasSheduledTask)return;let r=u=>{this.mUpdateStates.async.hasRunningTask=!0,this.mUpdateStates.async.hasSheduledTask=!1,this.mUpdateStates.async.sheduledTaskIsResheduled=!1;let f=!1;try{this.runUpdateSynchron(t)}catch(y){if(y instanceof ve&&u.initiator===this)f=!0;else throw new Jt(y,this.zone)}finally{this.mUpdateStates.async.hasRunningTask=!1}f&&this.runUpdateAsynchron(t,u)};this.mUpdateStates.async.hasSheduledTask=!0,e&&(this.mUpdateStates.async.sheduledTaskIsResheduled=!0),globalThis.requestAnimationFrame(()=>{e?Gt.openResheduledCycle(e,r):Gt.openUpdateCycle({updater:this,runSync:!1},r)})}runUpdateSynchron(t){if(this.mUpdateStates.sync.running)return this.mUpdateStates.cycle.chainedTask=t,!1;this.mUpdateStates.sync.running=!0;try{let e=Gt.openUpdateCycle({updater:this,runSync:!0},r=>{if(this.mUpdateRunCache.has(r.runner))return Gt.updateCyleStartTime(r),this.mUpdateRunCache.get(r.runner);let u=this.executeTaskChain(t,r,!1,new Array);return this.mUpdateRunCache.set(r.runner,u),u});return this.releaseUpdateChainCompleteHooks(e),e}catch(e){throw e instanceof ve||this.releaseUpdateChainCompleteHooks(!1,e),e}finally{this.mUpdateStates.sync.running=!1}}},ve=class extends Error{constructor(){super("Update resheduled")}};var Fe=class extends Qt{mUpdater;get updater(){return this.mUpdater}constructor(t){super(t),this.mUpdater=new Oe({label:t.constructor.name,onUpdate:()=>this.onUpdate()})}call(t,...e){return this.mUpdater.executeInZone(()=>super.call(t,...e))}deconstruct(){this.mUpdater.deconstruct(),super.deconstruct()}createProcessor(){return this.mUpdater.executeInZone(()=>super.createProcessor())}};var Yt=class{mExpression;mTemporaryValues;constructor(t,e,r){if(this.mTemporaryValues=new rt,r.length>0)for(let u of r)this.mTemporaryValues.set(u,void 0);this.mExpression=this.createEvaluationFunction(t,this.mTemporaryValues).bind(e.store)}execute(){return this.mExpression()}setTemporaryValue(t,e){if(!this.mTemporaryValues.has(t))throw new _(`Temporary value "${t}" does not exist for this procedure.`,this);this.mTemporaryValues.set(t,e)}createEvaluationFunction(t,e){let r,u=`__${Math.random().toString(36).substring(2)}`;if(r="return function () {",e.size>0)for(let f of e.keys())r+=`const ${f} = ${u}.get('${f}');`;return r+=`return ${t};`,r+="};",new Function(u,r)(e)}};var Ct=class{mDataLevel;get data(){return this.mDataLevel}constructor(t){this.mDataLevel=t}createExpressionProcedure(t,e){return new Yt(t,this.data,e??[])}setTemporaryValue(t,e){this.data.setTemporaryValue(t,e)}};var ft=class{mComponent;mDataProxy;mParentLevel;mTemporaryValues;get store(){return this.mDataProxy}constructor(t){this.mTemporaryValues=new rt,t instanceof G?(this.mParentLevel=null,this.mComponent=t):(this.mParentLevel=t,this.mComponent=t.mComponent),this.mDataProxy=this.createAccessProxy()}deleteTemporaryValue(t){this.mTemporaryValues.delete(t)}setTemporaryValue(t,e){this.mTemporaryValues.set(t,e)}updateLevelData(t){if(t.mParentLevel!==this.mParentLevel)throw new _("Can't update InstructionLevelData for a deeper level than it target data.",this);this.mTemporaryValues=t.mTemporaryValues}createAccessProxy(){return new Proxy(new Object,{get:(t,e)=>this.getValue(e),set:(t,e,r)=>(this.hasTemporaryValue(e)&&this.setTemporaryValue(e,r),e in this.mComponent.processor?(this.mComponent.processor[e]=r,!0):(this.setTemporaryValue(e,r),!0)),deleteProperty:()=>{throw new _("Deleting properties is not allowed",this)},ownKeys:()=>[...new Set([...Object.keys(this.mComponent.processor),...this.getTemporaryValuesList()])]})}getTemporaryValuesList(){let t=this.mTemporaryValues.map(e=>e);return this.mParentLevel&&t.push(...this.mParentLevel.getTemporaryValuesList()),t}getValue(t){if(this.mTemporaryValues.has(t))return this.mTemporaryValues.get(t);if(this.mParentLevel)return this.mParentLevel.getValue(t);if(t in this.mComponent.processor)return this.mComponent.processor[t]}hasTemporaryValue(t){return this.mTemporaryValues.has(t)?!0:this.mParentLevel?this.mParentLevel.hasTemporaryValue(t):!1}};var Wt=class v{mChildList;mInstruction;mInstructionType;get childList(){return this.mChildList}get instruction(){return this.mInstruction}get instructionType(){return this.mInstructionType}constructor(t,e){this.mChildList=Array(),this.mInstruction=e,this.mInstructionType=t}appendChild(...t){this.mChildList.push(...t)}clone(){let t=new v(this.instructionType,this.instruction);for(let e of this.mChildList)t.appendChild(e.clone());return t}equals(t){if(!(t instanceof v)||t.instruction!==this.instruction||t.instructionType!==this.instructionType||t.childList.length!==this.childList.length)return!1;for(let e=0;e<t.childList.length;e++)if(!t.childList[e].equals(this.childList[e]))return!1;return!0}removeChild(t){let e=this.mChildList.indexOf(t);if(e!==-1)return this.mChildList.splice(e,1)[0]}};var At=class v{mExpression;get value(){return this.mExpression}constructor(t){this.mExpression=t}clone(){return new v(this.mExpression)}equals(t){return t instanceof v&&t.value===this.value}toString(){return`{{ ${this.mExpression} }}`}};var Lt=class v{mContainsExpression;mTextValue;mValues;get containsExpression(){return this.mContainsExpression}get values(){return this.mValues}constructor(){this.mTextValue="",this.mContainsExpression=!1,this.mValues=[]}addValue(...t){for(let e of t)(this.mContainsExpression===!0||e instanceof At)&&(this.mContainsExpression=!0),this.mValues.push(e),this.mTextValue+=e.toString()}clone(){let t=new v;for(let e of this.values)typeof e=="string"?t.addValue(e):t.addValue(e.clone());return t}equals(t){if(!(t instanceof v)||t.values.length!==this.values.length)return!1;for(let e=0;e<this.values.length;e++){let r=this.values[e],u=t.values[e];if(r!==u&&(typeof r!=typeof u||typeof r=="string"&&r!==u||!u.equals(r)))return!1}return!0}toString(){return this.mTextValue}};var ye=class v{mName;mValue;get name(){return this.mName}get values(){return this.mValue}constructor(t){this.mName=t,this.mValue=new Lt}clone(){let t=new v(this.name);for(let e of this.values.values)typeof e=="string"?t.values.addValue(e):t.values.addValue(e.clone());return t}equals(t){return!(!(t instanceof v)||t.name!==this.name||!t.values.equals(this.values))}};var Rt=class v{mAttributeDictionary;mChildList;mTagName;get attributes(){return[...this.mAttributeDictionary.values()]}get childList(){return this.mChildList}get tagName(){return this.mTagName}constructor(t){this.mAttributeDictionary=new Map,this.mChildList=Array(),this.mTagName=t}appendChild(...t){this.mChildList.push(...t)}clone(){let t=new v(this.tagName);for(let e of this.mAttributeDictionary.values()){let r=t.setAttribute(e.name);for(let u of e.values.values)typeof u=="string"?r.addValue(u):r.addValue(u.clone())}for(let e of this.mChildList)t.appendChild(e.clone());return t}equals(t){if(!(t instanceof v)||t.tagName!==this.tagName||t.attributes.length!==this.mAttributeDictionary.size||t.childList.length!==this.mChildList.length)return!1;for(let e of t.mAttributeDictionary.values()){let r=this.mAttributeDictionary.get(e.name);if(!r||!r.equals(e))return!1}for(let e=0;e<t.childList.length;e++)if(!t.childList[e].equals(this.mChildList[e]))return!1;return!0}getAttribute(t){return this.mAttributeDictionary.get(t)?.values??null}removeAttribute(t){return this.mAttributeDictionary.delete(t)}removeChild(t){let e=this.mChildList.indexOf(t);if(e!==-1)return this.mChildList.splice(e,1)[0]}setAttribute(t){if(this.mAttributeDictionary.has(t))return this.mAttributeDictionary.get(t).values;let e=new ye(t);return this.mAttributeDictionary.set(t,e),e.values}};var ut=class v{mBodyElementList;get body(){return this.mBodyElementList}constructor(){this.mBodyElementList=new Array}appendChild(...t){this.mBodyElementList.push(...t)}clone(){let t=new v;for(let e of this.mBodyElementList)t.appendChild(e.clone());return t}equals(t){if(!(t instanceof v)||t.body.length!==this.mBodyElementList.length)return!1;for(let e=0;e<this.mBodyElementList.length;e++)if(!this.mBodyElementList[e].equals(t.body[e]))return!1;return!0}removeChild(t){let e=this.mBodyElementList.indexOf(t);if(e!==-1)return this.mBodyElementList.splice(e,1)[0]}};var at=class{mComponentValues;mContent;mModules;mTemplate;get anchor(){return this.mContent.contentAnchor}get content(){return this.mContent}get modules(){return this.mModules}get template(){return this.mTemplate}get values(){return this.mComponentValues}constructor(t,e,r,u){this.mTemplate=t,this.mComponentValues=r,this.mContent=u,this.mModules=e,u.setCoreBuilder(this)}deconstruct(){this.content.deconstruct()}update(){let t=this.onUpdate(),e=!1,r=this.content.builders;if(r.length>0)for(let u=0;u<r.length;u++)e=r[u].update()||e;return t||e}createTextNode(t){return document.createTextNode(t)}};var kt=class{mChildBuilderList;mChildComponents;mContentAnchor;mContentBoundary;mLinkedContent;mRootChildList;get body(){return this.mRootChildList}get builders(){return this.mChildBuilderList}get contentAnchor(){return this.mContentAnchor}constructor(t){this.mChildBuilderList=new Array,this.mRootChildList=new Array,this.mChildComponents=new Map,this.mLinkedContent=new WeakSet,this.mContentAnchor=document.createComment(t),this.mContentBoundary={start:this.mContentAnchor,end:this.mContentAnchor}}deconstruct(){this.onDeconstruct();let t;for(;t=this.mChildBuilderList.pop();)t.deconstruct();for(let r of this.mChildComponents.values())r.deconstruct();this.mChildComponents.clear();let e;for(;e=this.mRootChildList.pop();)e instanceof at||e.remove();this.contentAnchor.remove()}getBoundary(){let t=this.mContentBoundary.end instanceof at?this.mContentBoundary.end.content.getBoundary().end:this.mContentBoundary.end;return{start:this.mContentBoundary.start,end:t}}insert(t,e,r){if(!this.mLinkedContent.has(r))throw new _("Can't add content to builder. Target is not part of builder.",this);let u=t instanceof at?t.anchor:t;switch(e){case"After":{this.insertAfter(u,r);break}case"TopOf":{this.insertTop(u,r);break}case"BottomOf":{this.insertBottom(u,r);break}}this.mLinkedContent.add(t),t instanceof at?this.mChildBuilderList.push(t):this.addChildComponent(t);let f=u.parentElement??u.getRootNode(),y=this.mContentAnchor.parentElement??this.mContentAnchor.getRootNode();if(f===y){let b=(()=>{switch(e){case"After":return this.mRootChildList.indexOf(r)+1;case"TopOf":return 0;case"BottomOf":return this.mRootChildList.length}})();b===this.mRootChildList.length&&(this.mContentBoundary.end=t),this.mRootChildList.splice(b+1,0,t)}}remove(t){if(!this.mLinkedContent.has(t))throw new _("Child node cant be deleted from builder when it not a child of them",this);if(this.mLinkedContent.delete(t),t instanceof at){let r=this.mChildBuilderList.indexOf(t);r!==-1&&this.mChildBuilderList.splice(r,1),t.deconstruct()}else{let r=this.mChildComponents.get(t);r&&(r.deconstruct(),this.mChildComponents.delete(t)),t.remove()}let e=this.mRootChildList.indexOf(t);e!==-1&&(this.mRootChildList.splice(e,1),this.mContentBoundary.end=this.mRootChildList.at(-1)??this.mContentAnchor)}setCoreBuilder(t){this.mLinkedContent.add(t)}addChildComponent(t){Q.elementIsComponent(t)&&this.mChildComponents.set(t,Q.ofElement(t).component)}insertAfter(t,e){let r=e instanceof at?e.content.getBoundary().end:e;(r.parentElement??r.getRootNode()).insertBefore(t,r.nextSibling)}insertBottom(t,e){if(e instanceof at){this.insertAfter(t,e);return}if(e instanceof Element){e.appendChild(t);return}throw new _("Source node does not support child nodes.",this)}insertTop(t,e){if(e instanceof at){this.insertAfter(t,e.anchor);return}if(e instanceof Element){e.prepend(t);return}throw new _("Source node does not support child nodes.",this)}};var ze=class extends kt{mAttributeModulesChangedOrder;mLinkedAttributeData;mLinkedAttributeExpressionModules;mLinkedAttributeModuleList;mLinkedExpressionModuleList;get linkedAttributeModules(){return this.mAttributeModulesChangedOrder&&(this.mAttributeModulesChangedOrder=!1,this.mLinkedAttributeModuleList.sort((t,e)=>t.accessMode-e.accessMode)),this.mLinkedAttributeModuleList}get linkedExpressionModules(){return this.mLinkedExpressionModuleList}constructor(t){super(t),this.mLinkedExpressionModuleList=new Array,this.mLinkedAttributeModuleList=new Array,this.mLinkedAttributeExpressionModules=new WeakMap,this.mLinkedAttributeData=new WeakMap,this.mAttributeModulesChangedOrder=!1}attributeOfLinkedExpressionModule(t){return this.mLinkedAttributeExpressionModules.get(t)}getLinkedAttributeData(t){if(!this.mLinkedAttributeData.has(t))throw new _("Attribute has no linked data.",this);return this.mLinkedAttributeData.get(t)}linkAttributeExpression(t,e){this.mLinkedAttributeExpressionModules.set(t,e)}linkAttributeModule(t){this.mLinkedAttributeModuleList.push(t),this.mAttributeModulesChangedOrder=!0}linkAttributeNodes(t,e,r){this.mLinkedAttributeData.set(t,{values:r,node:e})}linkExpressionModule(t){this.mLinkedExpressionModuleList.push(t)}onDeconstruct(){for(let t of this.mLinkedAttributeModuleList)t.deconstruct();for(let t of this.mLinkedExpressionModuleList)t.deconstruct()}};var je=class extends kt{mInstructionModule;get instructionModule(){return this.mInstructionModule}constructor(t,e){super(e),this.mInstructionModule=t}onDeconstruct(){this.mInstructionModule.deconstruct()}};var Ve=class extends at{constructor(t,e,r){let u=e.createInstructionModule(t,r);super(t,e,r,new je(u,`Instruction - {$${t.instructionType}}`))}onUpdate(){if(this.content.instructionModule.update()){let t=this.content.body;this.updateStaticBuilder(t,this.content.instructionModule.instructionResult.elementList)}return!1}insertNewContent(t,e){let r=new te(t.template,this.modules,t.dataLevel,`Child - {$${this.template.instructionType}}`,t.key);return e===null?this.content.insert(r,"TopOf",this):this.content.insert(r,"After",e),r}updateStaticBuilder(t,e){let u=new he((b,T)=>T.template.equals(b.template)&&T.key===b.key).differencesOf(t,e),f=0,y=null;for(let b=0;b<u.length;b++){let T=u[b];if(T.changeState===St.Remove)this.content.remove(T.item);else if(T.changeState===St.Insert)y=this.insertNewContent(T.item,y),f++;else{let N=e[f].dataLevel;T.item.values.updateLevelData(N),y=T.item,f++}}}};var te=class extends at{mInitialized;mKey;get key(){return this.mKey}constructor(t,e,r,u,f){super(t,e,r,new ze(`Static - {${u}}`)),this.mKey=f,this.mInitialized=!1}onUpdate(){this.mInitialized||(this.mInitialized=!0,this.buildTemplate([this.template],this));let t=!1,e=this.content.linkedAttributeModules;for(let f=0;f<e.length;f++)t=e[f].update()||t;let r=!1,u=this.content.linkedExpressionModules;for(let f=0;f<u.length;f++){let y=u[f];if(y.update()){r=!0;let b=this.content.attributeOfLinkedExpressionModule(y);if(!b)continue;let T=this.content.getLinkedAttributeData(b),N=T.values.reduce((c,n)=>c+n.data,"");T.node.setAttribute(b.name,N)}}return t||r}buildInstructionTemplate(t,e){this.content.insert(new Ve(t,this.modules,new ft(this.values)),"BottomOf",e)}buildStaticTemplate(t,e){let{element:r,isComponent:u}=this.createHtmlElement(t),f=null;u&&(f=new Array);for(let y of t.attributes){let b=this.modules.createAttributeModule(y,r,this.values);if(b){this.content.linkAttributeModule(b),u&&f.push(b);continue}if(y.values.containsExpression){let T=new Array;for(let N of y.values.values){let c=this.createTextNode("");if(T.push(c),!(N instanceof At)){c.data=N;continue}let n=this.modules.createExpressionModule(N,c,this.values);this.content.linkExpressionModule(n),this.content.linkAttributeExpression(n,y)}this.content.linkAttributeNodes(y,r,T);continue}r.setAttribute(y.name,y.values.toString())}if(u){for(let y of f)y.update();Q.ofElement(r).component.updater.update()}this.content.insert(r,"BottomOf",e),this.buildTemplate(t.childList,r)}buildTemplate(t,e){for(let r of t)r instanceof ut?this.buildTemplate(r.body,e):r instanceof Lt?this.buildTextTemplate(r,e):r instanceof Wt?this.buildInstructionTemplate(r,e):r instanceof Rt&&this.buildStaticTemplate(r,e)}buildTextTemplate(t,e){for(let r of t.values){if(typeof r=="string"){this.content.insert(this.createTextNode(r),"BottomOf",e);continue}let u=this.createTextNode("");this.content.insert(u,"BottomOf",e);let f=this.modules.createExpressionModule(r,u,this.values);this.content.linkExpressionModule(f)}}createHtmlElement(t){let e=t.tagName;if(e.includes("-")){let u=globalThis.customElements.get(e);if(typeof u<"u"){let f=new u;return{element:f,isComponent:Q.elementIsComponent(f)}}}let r=t.getAttribute("xmlns");return r&&!r.containsExpression?{element:document.createElementNS(r.values[0],e),isComponent:!1}:{element:document.createElement(e),isComponent:!1}}};var be=class{mHtmlElement;mShadowRoot;get htmlElement(){return this.mHtmlElement}get shadowRoot(){return this.mShadowRoot}constructor(t){this.mHtmlElement=t,this.mShadowRoot=this.mHtmlElement.attachShadow({mode:"open"})}};var Y=class{mDataLevel;get data(){return this.mDataLevel}constructor(t){this.mDataLevel=t}createExpressionProcedure(t,e){return new Yt(t,this.data,e??[])}};var Bt=class extends Qt{constructor(t){super({constructor:t.constructor,parent:t.parent}),this.setProcessorInjection(Y,new Y(t.values))}deconstruct(){super.deconstruct(),this.call("onDeconstruct")}update(){return this.onUpdate()}};var ot=class{mValue;get value(){return this.mValue}constructor(t){this.mValue=t}};var tt=class{constructor(){throw new _("Reference should not be instanced.",this)}};var mt=class{constructor(){throw new _("Reference should not be instanced.",this)}};var Ut=class v extends Bt{mLastResult;mTargetTextNode;constructor(t){super({constructor:t.constructor,parent:t.parent,values:t.values}),this.mTargetTextNode=t.targetNode,this.mLastResult=null,this.setProcessorInjection(v,this),this.setProcessorInjection(mt,t.targetTemplate.clone()),this.setProcessorInjection(tt,t.targetNode),this.setProcessorInjection(ot,new ot(t.targetTemplate.value))}onUpdate(){let t=this.call("onUpdate");t===null&&(t="");let e=this.mLastResult===null||this.mLastResult!==t;if(e){let r=this.mTargetTextNode;r.data=t,this.mLastResult=t}return e}};function yo(){return(v,t)=>{O.registerInjectable(v,t.metadata,"instanced"),ct.register(Ut,v,{})}}function $s(){function v(c,n){return function(l){e(n,"addInitializer"),r(l,"An initializer"),c.push(l)}}function t(c,n,h,l,o,w,p,D,x){var m;switch(o){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var s={kind:m,name:p?"#"+n:n,static:w,private:p,metadata:D},d={v:!1};s.addInitializer=v(l,d);var i,a;if(o===0?p?(i=h.get,a=h.set):(i=function(){return this[n]},a=function(g){this[n]=g}):o===2?i=function(){return h.value}:((o===1||o===3)&&(i=function(){return h.get.call(this)}),(o===1||o===4)&&(a=function(g){h.set.call(this,g)})),p)s.access=i&&a?{get:i,set:a}:i?{get:i}:{set:a};else{if(i){var C=i;i=function(g){return arguments.length===0&&(g=this),C.call(g)}}if(a){var P=a;a=function(g,S){return arguments.length===1&&(S=g,g=this),P.call(g,S)}}var E=function(g){return n in g};s.access=i&&a?{has:E,get:i,set:a}:i?{has:E,get:i}:{has:E,set:a}}try{return c(x,s)}finally{d.v=!0}}function e(c,n){if(c.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(c,n){if(typeof c!="function")throw new TypeError(n+" must be a function")}function u(c,n){var h=typeof n;if(c===1){if(h!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(h!=="function"){var l;throw c===0?l="field":c===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function f(c,n,h,l,o,w,p,D,x){var m=h[0],s,d,i;p?o===0||o===1?s={get:h[3],set:h[4]}:o===3?s={get:h[3]}:o===4?s={set:h[3]}:s={value:h[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var a,C,P;if(typeof m=="function")a=t(m,l,s,D,o,w,p,x,i),a!==void 0&&(u(o,a),o===0?d=a:o===1?(d=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a);else for(var E=m.length-1;E>=0;E--){var g=m[E];if(a=t(g,l,s,D,o,w,p,x,i),a!==void 0){u(o,a);var S;o===0?S=a:o===1?(S=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a,S!==void 0&&(d===void 0?d=S:typeof d=="function"?d=[d,S]:d.push(S))}}if(o===0||o===1){if(d===void 0)d=function(M,I){return I};else if(typeof d!="function"){var F=d;d=function(M,I){for(var A=I,L=0;L<F.length;L++)A=F[L].call(M,A);return A}}else{var j=d;d=function(M,I){return j.call(M,I)}}c.push(d)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),p?o===1?(c.push(function(M,I){return i.get.call(M,I)}),c.push(function(M,I){return i.set.call(M,I)})):o===2?c.push(i):c.push(function(M,I){return i.call(M,I)}):Object.defineProperty(n,l,s))}function y(c,n,h){for(var l=[],o,w,p=new Map,D=new Map,x=0;x<n.length;x++){var m=n[x];if(Array.isArray(m)){var s=m[1],d=m[2],i=m.length>3,a=s>=5,C,P;if(a?(C=c,s=s-5,w=w||[],P=w):(C=c.prototype,o=o||[],P=o),s!==0&&!i){var E=a?D:p,g=E.get(d)||0;if(g===!0||g===3&&s!==4||g===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!g&&s>2?E.set(d,s):E.set(d,!0)}f(l,C,m,d,s,a,i,P,h)}}return b(l,o),b(l,w),l}function b(c,n){n&&c.push(function(h){for(var l=0;l<n.length;l++)n[l].call(h);return h})}function T(c,n,h){if(n.length>0){for(var l=[],o=c,w=c.name,p=n.length-1;p>=0;p--){var D={v:!1};try{var x=n[p](o,{kind:"class",name:w,addInitializer:v(l,D),metadata:h})}finally{D.v=!0}x!==void 0&&(u(10,x),o=x)}return[N(o,h),function(){for(var m=0;m<l.length;m++)l[m].call(o)}]}}function N(c,n){return Object.defineProperty(c,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,h,l,o){if(o!==void 0)var w=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var p=Object.create(w===void 0?null:w),D=y(n,h,p);return l.length||N(n,p),{e:D,get c(){return T(n,l,p)}}}}function Ro(v,t,e,r){return(Ro=$s())(v,t,e,r)}var Oo,Ao,bo;Oo=yo();var Lo=class{static{({c:[bo,Ao]}=Ro(this,[],[Oo]))}constructor(t=O.use(Y),e=O.use(ot)){this.mProcedure=t.createExpressionProcedure(e.value)}mProcedure;onUpdate(){let t=this.mProcedure.execute();return typeof t>"u"?null:t?.toString()}static{Ao()}};var nt=class{mName;mValue;get name(){return this.mName}get value(){return this.mValue}constructor(t,e){this.mName=t,this.mValue=e}};var Tt=class v extends Bt{mAccessMode;get accessMode(){return this.mAccessMode}constructor(t){super({constructor:t.constructor,parent:t.parent,values:t.values}),this.mAccessMode=t.accessMode,this.setProcessorInjection(v,this),this.setProcessorInjection(mt,t.targetTemplate.clone()),this.setProcessorInjection(tt,t.targetNode),this.setProcessorInjection(nt,new nt(t.targetTemplate.name,t.targetTemplate.values.toString()))}onUpdate(){return this.call("onUpdate")??!1}};var ht=class{mDataLevels;mElementList;mTemplates;get elementList(){return this.mElementList}constructor(){this.mElementList=new Array,this.mTemplates=new Set,this.mDataLevels=new Set}addElement(t,e,r){if(this.mTemplates.has(t)||this.mDataLevels.has(e))throw new _("Can't add same template or values for multiple Elements.",this);this.mTemplates.add(t),this.mDataLevels.add(e),this.mElementList.push({template:t,dataLevel:e,key:r})}};var Xt=class v extends Bt{mLastResult;get instructionResult(){return this.mLastResult}constructor(t){super({constructor:t.constructor,parent:t.parent,values:t.values}),this.setProcessorInjection(v,this),this.setProcessorInjection(mt,t.targetTemplate.clone()),this.setProcessorInjection(ot,new ot(t.targetTemplate.instruction)),this.mLastResult=new ht}onUpdate(){let t=this.call("onUpdate");return t instanceof ht?(this.mLastResult=t,!0):!1}};var $e=class v{static mAttributeModuleCache=new rt;static mExpressionModuleCache=new WeakMap;static mInstructionModuleCache=new rt;mComponent;mExpressionModule;constructor(t,e){this.mExpressionModule=e??bo,this.mComponent=t}createAttributeModule(t,e,r){let u=(()=>{let f=v.mAttributeModuleCache.get(t.name);if(f||f===null)return f;for(let y of ct.get(Tt))if(y.processorConfiguration.selector.test(t.name))return v.mAttributeModuleCache.set(t.name,y),y;return v.mAttributeModuleCache.set(t.name,null),null})();return u===null?null:new Tt({accessMode:u.processorConfiguration.access,constructor:u.processorConstructor,parent:this.mComponent,targetNode:e,targetTemplate:t,values:r}).setup()}createExpressionModule(t,e,r){let u=(()=>{let f=v.mExpressionModuleCache.get(this.mExpressionModule);if(f)return f;let y=ct.get(Ut).find(b=>b.processorConstructor===this.mExpressionModule);if(!y)throw new _("An expression module could not be found.",this);return v.mExpressionModuleCache.set(this.mExpressionModule,y),y})();return new Ut({constructor:u.processorConstructor,parent:this.mComponent,targetNode:e,targetTemplate:t,values:r}).setup()}createInstructionModule(t,e){let r=(()=>{let u=v.mInstructionModuleCache.get(t.instructionType);if(u)return u;for(let f of ct.get(Xt))if(f.processorConfiguration.instructionType===t.instructionType)return v.mInstructionModuleCache.set(t.instructionType,f),f;throw new _(`Instruction module type "${t.instructionType}" not found.`,this)})();return new Xt({constructor:r.processorConstructor,parent:this.mComponent,targetTemplate:t,values:e}).setup()}};var Zt=class extends _{mColumnEnd;mColumnStart;mLineEnd;mLineStart;get columnEnd(){return this.mColumnEnd}get columnStart(){return this.mColumnStart}get lineEnd(){return this.mLineEnd}get lineStart(){return this.mLineStart}constructor(t,e,r,u,f,y,b){super(t,e,b),this.mColumnStart=r,this.mLineStart=u,this.mColumnEnd=f,this.mLineEnd=y}};var ee=class{mDependencyFetch;mDependencyFetchResolved;mLexer;mMeta;mPattern;mPatternDependencies;mType;get dependencies(){return this.mPatternDependencies}get dependenciesResolved(){return this.mDependencyFetchResolved}get lexer(){return this.mLexer}get meta(){return this.mMeta}get pattern(){return this.mPattern}constructor(t,e){if(this.mLexer=t,this.mType=e.type,this.mMeta=e.metadata,this.mPatternDependencies=new Array,this.mDependencyFetch=e.dependencyFetch??null,this.mDependencyFetchResolved=!e.dependencyFetch,this.mType==="split"&&!this.mDependencyFetch)throw new _("Split token with a start and end token, need inner token definitions.",this);if(this.mType==="single"&&this.mDependencyFetch)throw new _("Pattern does not allow inner token pattern.",this);this.mPattern=this.convertTokenPattern(this.mType,e.pattern)}isSplit(){return this.mType==="split"}resolveDependencies(){this.mDependencyFetchResolved||(this.mDependencyFetch(this),this.mDependencyFetchResolved=!0)}useChildPattern(t){if(this.mLexer!==t.lexer)throw new _("Can only add dependencies of the same lexer.",this);this.mPatternDependencies.push(t)}convertTokenPattern(t,e){if("single"in e){if(t==="split")throw new _("Can't use split pattern type with single pattern definition.",this);return{start:{regex:e.single.regex,types:e.single.types,validator:e.single.validator??null}}}else{if(t==="single")throw new _("Can't use single pattern type with split pattern definition.",this);return{start:{regex:e.start.regex,types:e.start.types,validator:e.start.validator??null},end:{regex:e.end.regex,types:e.end.types,validator:e.end.validator??null},innerType:e.innerType??null}}}};var oe=class{mColumnNumber;mLineNumber;mMetas;mType;mValue;get columnNumber(){return this.mColumnNumber}get lineNumber(){return this.mLineNumber}get metas(){return[...this.mMetas]}get type(){return this.mType}get value(){return this.mValue}constructor(t,e,r,u){this.mValue=e,this.mColumnNumber=r,this.mLineNumber=u,this.mType=t,this.mMetas=new Set}addMeta(...t){for(let e of t)this.mMetas.add(e)}hasMeta(t){return this.mMetas.has(t)}};var we=class{mRootPattern;mSettings;get errorType(){return this.mSettings.errorType}set errorType(t){this.mSettings.errorType=t}get trimWhitespace(){return this.mSettings.trimSpaces}set trimWhitespace(t){this.mSettings.trimSpaces=t}get validWhitespaces(){return[...this.mSettings.whiteSpaces].join("")}set validWhitespaces(t){this.mSettings.whiteSpaces=new Set(t.split(""))}constructor(){this.mSettings={errorType:null,trimSpaces:!0,whiteSpaces:new Set},this.mRootPattern=new ee(this,{type:"single",pattern:{single:{regex:/^/,types:{},validator:null}},metadata:[],dependencyFetch:null})}createTokenPattern(t,e){let r=b=>typeof b=="string"?{token:b}:b,u=b=>{let T=new Set(b.flags.split(""));return new RegExp(`^(?<token>${b.source})`,[...T].join(""))},f=new Array;t.meta&&(typeof t.meta=="string"?f.push(t.meta):f.push(...t.meta));let y;return"regex"in t.pattern?y={single:{regex:u(t.pattern.regex),types:r(t.pattern.type),validator:t.pattern.validator??null}}:y={start:{regex:u(t.pattern.start.regex),types:r(t.pattern.start.type),validator:t.pattern.start.validator??null},end:{regex:u(t.pattern.end.regex),types:r(t.pattern.end.type),validator:t.pattern.end.validator??null},innerType:t.pattern.innerType??null},new ee(this,{type:"regex"in t.pattern?"single":"split",pattern:y,metadata:f,dependencyFetch:e??null})}*tokenize(t,e){let r={data:t,cursor:{position:0,column:1,line:1},error:null,progressTracker:e??null};yield*this.tokenizeRecursionLayer(r,this.mRootPattern,new Array,null)}useRootTokenPattern(t){if(t.lexer!==this)throw new _("Token pattern must be created by this lexer.",this);this.mRootPattern.useChildPattern(t)}findNextStartToken(t,e,r,u){for(let f of e){let y=f.pattern.start,b=this.matchToken(f,y,t,r,u);if(b!==null)return{pattern:f,token:b}}return null}findTokenTypeOfMatch(t,e,r){for(let y in t.groups){let b=t.groups[y],T=e[y];if(!(!b||!T)){if(b.length!==t[0].length)throw new _("A group of a token pattern must match the whole token.",this);return T}}let u=new Array;for(let y in t.groups)t.groups[y]&&u.push(y);let f=new Array;for(let y in e)f.push(y);throw new _(`No token type found for any defined pattern regex group. Full: "${t[0]}", Matches: "${u.join(", ")}", Available: "${f.join(", ")}", Regex: "${r.source}"`,this)}*generateErrorToken(t,e){if(!t.error||!this.mSettings.errorType)return;let r=new oe(this.mSettings.errorType,t.error.data,t.error.startColumn,t.error.startLine);r.addMeta(...e),t.error=null,yield r}generateToken(t,e,r,u,f,y){let b=r[0],T=this.findTokenTypeOfMatch(r,u,y),N=new oe(f??T,b,t.cursor.column,t.cursor.line);return N.addMeta(...e),N}matchToken(t,e,r,u,f){let y=e.regex;y.lastIndex=0;let b=y.exec(r.data);if(!b||b.index!==0)return null;let T=this.generateToken(r,[...u,...t.meta],b,e.types,f,y);if(e.validator){let N=r.data.substring(T.value.length);if(!e.validator(T,N,r.cursor.position))return null}return this.moveCursor(r,T.value),T}moveCursor(t,e){let r=e.split(`
`);r.length>1&&(t.cursor.column=1),t.cursor.line+=r.length-1,t.cursor.column+=r.at(-1).length,t.cursor.position+=e.length,t.data=t.data.substring(e.length),this.trackProgress(t)}pushNextCharToErrorState(t){if(!this.mSettings.errorType)throw new Zt(`Unable to parse next token. No valid pattern found for "${t.data.substring(0,20)}".`,this,t.cursor.column,t.cursor.line,t.cursor.column,t.cursor.line);t.error||(t.error={data:"",startColumn:t.cursor.column,startLine:t.cursor.line});let e=t.data.charAt(0);t.error.data+=e,this.moveCursor(t,e)}skipNextWhitespace(t){let e=t.data.charAt(0);return!this.mSettings.trimSpaces||!this.mSettings.whiteSpaces.has(e)?!1:(this.moveCursor(t,e),!0)}*tokenizeRecursionLayer(t,e,r,u){let f=e.dependencies;for(;t.data.length>0;){if(!t.error&&this.skipNextWhitespace(t))continue;if(e.isSplit()){let T=this.matchToken(e,e.pattern.end,t,r,u);if(T!==null){yield*this.generateErrorToken(t,r),yield T;return}}let y=this.findNextStartToken(t,f,r,u);if(!y){this.pushNextCharToErrorState(t);continue}yield*this.generateErrorToken(t,r),yield y.token;let b=y.pattern;b.isSplit()&&(b.resolveDependencies(),yield*this.tokenizeRecursionLayer(t,b,[...r,...b.meta],u??b.pattern.innerType))}yield*this.generateErrorToken(t,r)}trackProgress(t){t.progressTracker!==null&&t.progressTracker(t.cursor.position,t.cursor.line,t.cursor.column)}};var J=class extends Error{static PARSER_ERROR=Symbol("PARSER_ERROR");mTrace;get columnEnd(){return this.mTrace.top.range.columnEnd}get columnStart(){return this.mTrace.top.range.columnStart}get graph(){return this.mTrace.top.graph}get incidents(){return this.mTrace.incidents}get lineEnd(){return this.mTrace.top.range.lineEnd}get lineStart(){return this.mTrace.top.range.lineStart}constructor(t){super(t.top.message,{cause:t.top.cause}),this.mTrace=t}};var Ge=class{mIncidents;mTop;get incidents(){if(this.mIncidents===null)throw new _("A complete incident list is only available on debug mode.",this);return this.mIncidents}get top(){return this.mTop}constructor(t){this.mTop={message:"Unknown parser error",priority:0,graph:null,range:{lineStart:1,columnStart:1,lineEnd:1,columnEnd:1},cause:null},t?this.mIncidents=new Array:this.mIncidents=null}push(t,e,r,u,f,y,b=!1,T=null){let N;if(b?N=this.mTop.priority+1:N=f*1e4+y,this.mIncidents!==null){let c={message:t,priority:N,graph:e,range:{lineStart:r,columnStart:u,lineEnd:f,columnEnd:y},cause:T};this.mIncidents.push(c)}this.mTop&&N<this.mTop.priority||this.setTop({message:t,priority:N,graph:e,range:{lineStart:r,columnStart:u,lineEnd:f,columnEnd:y},cause:T})}setTop(t){this.mTop=t}};var Be=class v{static MAX_JUNCTION_CIRCULAR_REFERENCES=1e3;mGraphStack;mIncidentTrace;mLastTokenPosition;mProcessStack;mTokenCache;mTokenGenerator;mTrimTokenCache;get currentGraph(){return this.mGraphStack.top.graph}get currentToken(){let t=this.mGraphStack.top;return this.mTokenCache[t.token.cursor]}get incidentTrace(){return this.mIncidentTrace}get processStack(){return this.mProcessStack}constructor(t,e,r){this.mTokenGenerator=t,this.mGraphStack=new zt,this.mLastTokenPosition={column:1,line:1},this.mTokenCache=new Array,this.mProcessStack=new zt,this.mTrimTokenCache=r,this.mIncidentTrace=new Ge(e),this.mGraphStack.push({graph:null,linear:!0,circularGraphs:new rt,token:{start:0,cursor:-1}})}collapse(){let t=this.mGraphStack.top,e=this.mTokenCache.slice(t.token.cursor);e.length!==0&&e.at(-1)===null&&e.pop();for(let r of this.mTokenGenerator)e.push(r);return e}getGraphBoundingToken(){let t=this.mGraphStack.top,e=this.mTokenCache[t.token.start],r=this.mTokenCache[t.token.cursor-1];return e??=r,r??=e,[e??null,r??null]}getGraphPosition(){let t=this.mGraphStack.top,e,r;if(e=this.mTokenCache[t.token.start],r=this.mTokenCache[t.token.cursor-1],e??=r,r??=e,!e||!r)return{graph:t.graph,columnEnd:this.mLastTokenPosition.column,columnStart:this.mLastTokenPosition.column,lineEnd:this.mLastTokenPosition.line,lineStart:this.mLastTokenPosition.line};let u,f;if(r.value.includes(`
`)){let y=r.value.split(`
`);f=r.lineNumber+y.length-1,u=1+y[y.length-1].length}else u=r.columnNumber+r.value.length,f=r.lineNumber;return{graph:t.graph,lineStart:e.lineNumber,columnStart:e.columnNumber,lineEnd:f,columnEnd:u}}getTokenPosition(){let t=this.mGraphStack.top,e=this.currentToken;if(!e)return{graph:t.graph,columnEnd:this.mLastTokenPosition.column,columnStart:this.mLastTokenPosition.column,lineEnd:this.mLastTokenPosition.line,lineStart:this.mLastTokenPosition.line};let r,u;if(e.value.includes(`
`)){let f=e.value.split(`
`);u=e.lineNumber+f.length-1,r=1+f[f.length-1].length}else r=e.columnNumber+e.value.length,u=e.lineNumber;return{graph:t.graph,lineStart:e.lineNumber,columnStart:e.columnNumber,lineEnd:u,columnEnd:r}}graphIsCircular(t){let e=this.mGraphStack.top;if(!e.circularGraphs.has(t))return!1;if(t.isJunction){if(e.circularGraphs.get(t)>v.MAX_JUNCTION_CIRCULAR_REFERENCES)throw new _("Junction graph called circular too often.",this);return!1}return!0}moveNextToken(){let t=this.mGraphStack.top;if(t.circularGraphs.size>0&&(t.circularGraphs=new rt),t.graph&&t.graph.isJunction)throw new _("Junction graph must not have own nodes.",this);if(t.token.cursor++,t.token.cursor<this.mTokenCache.length)return;let e=this.mTokenGenerator.next();if(e.done){this.mTokenCache.push(null);return}this.mLastTokenPosition.column=e.value.columnNumber,this.mLastTokenPosition.line=e.value.lineNumber,this.mTokenCache.push(e.value)}popGraphStack(t){let e=this.mGraphStack.pop(),r=this.mGraphStack.top;if(t&&(e.token.cursor=e.token.start),e.token.cursor!==e.token.start&&r.circularGraphs.size>0&&(r.circularGraphs=new rt),!this.mTrimTokenCache){r.token.cursor=e.token.cursor;return}e.linear?(this.mTokenCache.splice(0,e.token.cursor),r.token.start=0,r.token.cursor=0):r.token.cursor=e.token.cursor}pushGraphStack(t,e){let r=this.mGraphStack.top,u={graph:t,linear:e&&r.linear,circularGraphs:new rt(r.circularGraphs),token:{start:r.token.cursor,cursor:r.token.cursor}},f=u.circularGraphs.get(t)??0;u.circularGraphs.set(t,f+1),this.mGraphStack.push(u)}};var xe=class v{static NODE_NULL_RESULT=Symbol("FAILED_NODE_VALUE_PARSE");static NODE_VALUE_LIST_END_MEET=Symbol("FAILED_NODE_VALUE_PARSE");mConfiguration;mLexer;mRootPart;get lexer(){return this.mLexer}constructor(t,e){this.mLexer=t,this.mRootPart=null,this.mConfiguration={keepTraceIncidents:!1,trimTokenCache:!1,...e}}parse(t,e){if(this.mRootPart===null)throw new _("Parser has not root part set.",this);let r=new Be(this.mLexer.tokenize(t,e),this.mConfiguration.keepTraceIncidents,this.mConfiguration.trimTokenCache),u=(()=>{try{return this.beginParseProcess(r,this.mRootPart)}catch(y){if(y instanceof Zt)return r.incidentTrace.push(y.message,r.currentGraph,y.lineStart,y.columnStart,y.lineEnd,y.columnEnd,!0,y),J.PARSER_ERROR;let b=y instanceof Error?y.message:y.toString(),T=r.getGraphPosition();return r.incidentTrace.push(b,r.currentGraph,T.lineStart,T.columnStart,T.lineEnd,T.columnEnd,!0,y),J.PARSER_ERROR}})();if(u===J.PARSER_ERROR)throw new J(r.incidentTrace);let f=r.collapse();if(f.length!==0){let y=f[0];if(r.incidentTrace.top.range.lineEnd===1&&r.incidentTrace.top.range.columnEnd===1){let b=`Tokens could not be parsed. Graph end meet without reaching last token. Current: "${y.value}" (${y.type})`;r.incidentTrace.push(b,this.mRootPart,y.lineNumber,y.columnNumber,y.lineNumber,y.columnNumber)}throw new J(r.incidentTrace)}return u}setRootGraph(t){this.mRootPart=t}beginParseProcess(t,e){t.moveNextToken(),t.processStack.push({type:"graph-parse",parameter:{graph:e,linear:!0},state:0});let r=v.NODE_NULL_RESULT;for(;t.processStack.top;)r=this.processStack(t,t.processStack.top,r);return r}processChainedNodeParseProcess(t,e,r){switch(e.state){case 0:{let y=e.parameter.node.connections.next;return y===null?(t.processStack.pop(),{}):(e.state++,t.processStack.push({type:"node-parse",parameter:{node:y},state:0,values:{}}),v.NODE_NULL_RESULT)}case 1:{let u=r;return u===J.PARSER_ERROR?(t.processStack.pop(),J.PARSER_ERROR):(t.processStack.pop(),u)}}throw new _(`Invalid node next parse state "${e.state}".`,this)}processGraphParseProcess(t,e,r){let u=e.parameter.graph;switch(e.state){case 0:{if(t.graphIsCircular(u)){let y=t.getGraphPosition();return t.incidentTrace.push("Circular graph detected.",u,y.lineStart,y.columnStart,y.lineEnd,y.columnEnd),t.processStack.pop(),J.PARSER_ERROR}let f=e.parameter.linear;return t.pushGraphStack(u,f),e.state++,t.processStack.push({type:"node-parse",parameter:{node:u.node},state:0,values:{}}),v.NODE_NULL_RESULT}case 1:{let f=r;if(f===J.PARSER_ERROR)return t.popGraphStack(!0),t.processStack.pop(),J.PARSER_ERROR;let y=u.convert(f,t);if(typeof y=="symbol"){let b=t.getGraphPosition();return t.incidentTrace.push(y.description??"Unknown data convert error",b.graph,b.lineStart,b.columnStart,b.lineEnd,b.columnEnd),t.popGraphStack(!0),t.processStack.pop(),J.PARSER_ERROR}return t.popGraphStack(!1),t.processStack.pop(),y}}throw new _(`Invalid graph parse state "${e.state}".`,this)}processNodeParseProcess(t,e,r){let u=e.parameter.node;switch(e.state){case 0:return t.processStack.push({type:"node-value-parse",parameter:{node:u,valueIndex:0},state:0,values:{}}),e.state++,v.NODE_NULL_RESULT;case 1:{let f=r;return f===J.PARSER_ERROR?(t.processStack.pop(),J.PARSER_ERROR):(e.values.nodeValueResult=f,t.processStack.push({type:"node-next-parse",parameter:{node:u},state:0}),e.state++,v.NODE_NULL_RESULT)}case 2:{let f=r;if(f===J.PARSER_ERROR)return t.processStack.pop(),J.PARSER_ERROR;let y=u.mergeData(e.values.nodeValueResult,f);return t.processStack.pop(),y}}throw new _(`Invalid node parse state "${e.state}".`,this)}processNodeValueParseProcess(t,e,r){let u=e.parameter.node;switch(e.state){case 0:{if(r!==v.NODE_NULL_RESULT&&r!==J.PARSER_ERROR)return e.values.parseResult=r,e.state++,v.NODE_NULL_RESULT;let f=e.parameter.valueIndex,y=u.connections;if(f>=y.values.length)return e.values.parseResult=v.NODE_VALUE_LIST_END_MEET,e.state++,v.NODE_NULL_RESULT;e.parameter.valueIndex++;let b=t.currentToken,T=y.values[f];if(typeof T=="string"){if(!b){if(y.required){let N=t.getTokenPosition();t.incidentTrace.push(`Unexpected end of statement. Token "${T}" expected.`,t.currentGraph,N.lineStart,N.columnStart,N.lineEnd,N.columnEnd)}return v.NODE_NULL_RESULT}if(T!==b.type){if(y.required){let N=t.getTokenPosition();t.incidentTrace.push(`Unexpected token "${b.value}". "${T}" expected`,t.currentGraph,N.lineStart,N.columnStart,N.lineEnd,N.columnEnd)}return v.NODE_NULL_RESULT}return t.moveNextToken(),b.value}else{let N=y.values.length===1||y.values.length===f+1;return t.processStack.push({type:"graph-parse",parameter:{graph:T,linear:N},state:0}),v.NODE_NULL_RESULT}}case 1:{let f=e.values.parseResult,y=u.connections;if(f===v.NODE_VALUE_LIST_END_MEET&&!y.required){t.processStack.pop();return}return f===v.NODE_VALUE_LIST_END_MEET?(t.processStack.pop(),J.PARSER_ERROR):(t.processStack.pop(),f)}}throw new _(`Invalid node value parse state "${e.state}".`,this)}processStack(t,e,r){switch(e.type){case"graph-parse":return this.processGraphParseProcess(t,e,r);case"node-parse":return this.processNodeParseProcess(t,e,r);case"node-value-parse":return this.processNodeValueParseProcess(t,e,r);case"node-next-parse":return this.processChainedNodeParseProcess(t,e,r)}}};var et=class v{static define(t,e=!1){return new v(t,e)}mDataConverterList;mGraphCollector;mIsJunction;mResolvedGraphNode;get isJunction(){return this.mIsJunction}get node(){return this.mResolvedGraphNode||(this.mResolvedGraphNode=this.mGraphCollector().root),this.mResolvedGraphNode}constructor(t,e){this.mGraphCollector=t,this.mDataConverterList=new Array,this.mResolvedGraphNode=null,this.mIsJunction=e}convert(t,e){if(this.mDataConverterList.length===0)return t;let r=e.getGraphBoundingToken(),u=r[0]??void 0,f=r[1]??void 0;if(this.mDataConverterList.length===1)return this.mDataConverterList[0](t,u,f);let y=t;for(let b of this.mDataConverterList)if(y=b(y,u,f),typeof y=="symbol")return y;return y}converter(t){let e=new v(this.mGraphCollector,this.isJunction);return e.mDataConverterList.push(...this.mDataConverterList,t),e}};var X=class v{static new(){let t=new v("",!1,[]);return t.mRootNode=null,t}mConnections;mIdentifier;mRootNode;get configuration(){return{dataKey:this.mIdentifier.dataKey,isList:this.mIdentifier.type==="list",isRequired:this.mConnections.required,isBranch:this.mConnections.values.length>1}}get connections(){return this.mConnections}get root(){if(!this.mRootNode)throw new _("Staring nodes must be chained with another node to be used.",this);return this.mRootNode}constructor(t,e,r,u){if(t==="")this.mIdentifier={type:"empty",dataKey:"",mergeKey:""};else if(t.endsWith("[]"))this.mIdentifier={type:"list",mergeKey:"",dataKey:t.substring(0,t.length-2)};else if(t.includes("<-")){let y=t.split("<-");this.mIdentifier={type:"merge",dataKey:y[0],mergeKey:y[1]}}else this.mIdentifier={type:"single",mergeKey:"",dataKey:t};let f=r.map(y=>y instanceof v?et.define(()=>y):y);this.mConnections={required:e,values:f,next:null},u?this.mRootNode=u:this.mRootNode=this}mergeData(t,e){if(this.mIdentifier.type==="empty")return e;let r=e,u=typeof t>"u";if(this.mIdentifier.type==="single"){if(this.mIdentifier.dataKey in e)throw new _(`Graph path has a duplicate value identifier "${this.mIdentifier.dataKey}"`,this);return u||(r[this.mIdentifier.dataKey]=t),e}if(this.mIdentifier.type==="list"){let b;u?b=new Array:Array.isArray(t)?b=t:b=[t];let T=(()=>{if(this.mIdentifier.dataKey in e){let N=r[this.mIdentifier.dataKey];return Array.isArray(N)?(N.unshift(...b),N):(b.push(N),b)}return b})();return r[this.mIdentifier.dataKey]=T,e}if(u)return e;let f=(()=>{if(!this.mIdentifier.mergeKey)throw new _("Cant merge data without a merge key.",this);if(typeof t!="object"||t===null)throw new _("Node data must be an object when merge key is set.",this);if(!(this.mIdentifier.mergeKey in t))throw new _(`Node data does not contain merge key "${this.mIdentifier.mergeKey}"`,this);return t[this.mIdentifier.mergeKey]})();if(typeof f>"u")return e;let y=r[this.mIdentifier.dataKey];if(typeof y>"u")return r[this.mIdentifier.dataKey]=f,r;if(!Array.isArray(y))throw new _("Chain data merge value is not an array but should be.",this);return Array.isArray(f)?y.unshift(...f):y.unshift(f),e}optional(t,e){let r=typeof e>"u"?"":t,u=typeof e>"u"?t:e,f=new Array;Array.isArray(u)?f.push(...u):f.push(u);let y=new v(r,!1,f,this.mRootNode);return this.setChainedNode(y),y}required(t,e){let r=typeof e>"u"?"":t,u=typeof e>"u"?t:e,f=new Array;Array.isArray(u)?f.push(...u):f.push(u);let y=new v(r,!0,f,this.mRootNode);return this.setChainedNode(y),y}setChainedNode(t){if(this.mConnections.next!==null)throw new _("Node can only be chained to a single node.",this);this.mConnections.next=t}};var z={XmlIdentifier:"Identifier",XmlAssignment:"XmlAssignment",XmlValue:"XmlValue",XmlComment:"XmlComment",XmlOpenClosingBracket:"XmlOpenClosingBracket",XmlCloseBracket:"XmlCloseBracket",XmlOpenBracket:"XmlOpenBracket",XmlCloseClosingBracket:"XmlCloseClosingBracket",XmlExplicitValueIdentifier:"XmlExplicitValueIdentifier",ExpressionStart:"ExpressionStart",ExpressionEnd:"ExpressionEnd",ExpressionValue:"ExpressionValue",InstructionStart:"InstructionStart",InstructionInstructionValue:"InstructionInstructionValue",InstructionBodyStartBraket:"InstructionBodyStartBraket",InstructionBodyCloseBraket:"InstructionBodyCloseBraket",InstructionInstructionClosingBracket:"InstructionInstructionClosingBracket",InstructionInstructionOpeningBracket:"InstructionInstructionOpeningBracket"};var Ue=class extends we{constructor(){super(),this.validWhitespaces=` 
\r`,this.trimWhitespace=!0;let t=this.createTokenPattern({pattern:{regex:/(?:(?!}}).)*/,type:z.ExpressionValue}}),e=this.createTokenPattern({pattern:{start:{regex:/{{/,type:z.ExpressionStart},end:{regex:/}}[ \n\r]?/,type:z.ExpressionEnd}}},s=>{s.useChildPattern(t)}),r=this.createTokenPattern({pattern:{regex:/[^>\s\n="/]+/,type:z.XmlIdentifier}}),u=this.createTokenPattern({pattern:{regex:/(?:(?!{{|"|<).)+/,type:z.XmlValue}}),f=this.createTokenPattern({pattern:{regex:/<!--.*?-->/,type:z.XmlComment}}),y=this.createTokenPattern({pattern:{regex:/=/,type:z.XmlAssignment}}),b=this.createTokenPattern({pattern:{start:{regex:/"/,type:z.XmlExplicitValueIdentifier},end:{regex:/"/,type:z.XmlExplicitValueIdentifier}}},s=>{s.useChildPattern(e),s.useChildPattern(u)}),T=this.createTokenPattern({pattern:{start:{regex:/<\//,type:z.XmlOpenClosingBracket},end:{regex:/>/,type:z.XmlCloseBracket}}},s=>{s.useChildPattern(r)}),N=this.createTokenPattern({pattern:{start:{regex:/</,type:z.XmlOpenBracket},end:{regex:/(?<closeClosingBracket>\/>)|(?<closeBracket>>)/,type:{closeClosingBracket:z.XmlCloseClosingBracket,closeBracket:z.XmlCloseBracket}}}},s=>{s.useChildPattern(y),s.useChildPattern(r),s.useChildPattern(b)}),c=this.createTokenPattern({pattern:{regex:/[^()"'`/)]+/,type:z.InstructionInstructionValue}}),n=this.createTokenPattern({pattern:{innerType:z.InstructionInstructionValue,start:{regex:/\//,type:z.InstructionInstructionValue},end:{regex:/\//,type:z.InstructionInstructionValue}}},s=>{s.useChildPattern(l),s.useChildPattern(o),s.useChildPattern(w),s.useChildPattern(h),s.useChildPattern(c)}),h=this.createTokenPattern({pattern:{innerType:z.InstructionInstructionValue,start:{regex:/\(/,type:z.InstructionInstructionValue},end:{regex:/\)/,type:z.InstructionInstructionValue}}},s=>{s.useChildPattern(n),s.useChildPattern(l),s.useChildPattern(o),s.useChildPattern(w),s.useChildPattern(c)}),l=this.createTokenPattern({pattern:{innerType:z.InstructionInstructionValue,start:{regex:/"/,type:z.InstructionInstructionValue},end:{regex:/"/,type:z.InstructionInstructionValue}}},s=>{s.useChildPattern(n),s.useChildPattern(o),s.useChildPattern(w),s.useChildPattern(h),s.useChildPattern(c)}),o=this.createTokenPattern({pattern:{innerType:z.InstructionInstructionValue,start:{regex:/'/,type:z.InstructionInstructionValue},end:{regex:/'/,type:z.InstructionInstructionValue}}},s=>{s.useChildPattern(n),s.useChildPattern(l),s.useChildPattern(w),s.useChildPattern(h),s.useChildPattern(c)}),w=this.createTokenPattern({pattern:{innerType:z.InstructionInstructionValue,start:{regex:/`/,type:z.InstructionInstructionValue},end:{regex:/`/,type:z.InstructionInstructionValue}}},s=>{s.useChildPattern(n),s.useChildPattern(l),s.useChildPattern(o),s.useChildPattern(h),s.useChildPattern(c)}),p=this.createTokenPattern({pattern:{regex:/\$[^(\s\n/{]+/,type:z.InstructionStart}}),D=this.createTokenPattern({pattern:{start:{regex:/\(/,type:z.InstructionInstructionOpeningBracket},end:{regex:/\)/,type:z.InstructionInstructionClosingBracket}}},s=>{s.useChildPattern(n),s.useChildPattern(l),s.useChildPattern(o),s.useChildPattern(w),s.useChildPattern(h),s.useChildPattern(c)}),x=this.createTokenPattern({pattern:{start:{regex:/{/,type:z.InstructionBodyStartBraket},end:{regex:/}/,type:z.InstructionBodyCloseBraket}}},s=>{for(let d of m)s.useChildPattern(d)}),m=[f,T,N,b,e,p,D,x,u];for(let s of m)this.useRootTokenPattern(s)}};var Te=class extends xe{constructor(){super(new Ue),this.initGraph()}initGraph(){let t=et.define(()=>X.new().required(z.ExpressionStart).optional("value",z.ExpressionValue).required("end",z.ExpressionEnd)).converter(o=>({expression:new At(o.value??""),hasTrailingWhitespace:o.end.length>2})),e=et.define(()=>{let o=e;return X.new().required("data[]",X.new().required("value",[t,X.new().required("text",z.XmlValue)])).optional("data<-data",o)}),r=et.define(()=>X.new().required("name",z.XmlIdentifier).optional("attributeValue",X.new().required(z.XmlAssignment).required(z.XmlExplicitValueIdentifier).optional("list<-data",e).required(z.XmlExplicitValueIdentifier))).converter(o=>{let w=new Array;if(o.attributeValue?.list)for(let p of o.attributeValue.list)"expression"in p.value?(w.push(p.value.expression),p.value.hasTrailingWhitespace&&w.push(" ")):w.push(p.value.text);return{name:o.name,values:w}}),u=et.define(()=>{let o=u;return X.new().required("data[]",r).optional("data<-data",o)}),f=et.define(()=>{let o=f;return X.new().required("data[]",X.new().required("value",[t,X.new().required("text",z.XmlValue),X.new().required(z.XmlExplicitValueIdentifier).required("text",z.XmlValue).required(z.XmlExplicitValueIdentifier)])).optional("data<-data",o)}),y=et.define(()=>X.new().required("list<-data",f)).converter(o=>{let w=new Lt;for(let p of o.list)"expression"in p.value?(w.addValue(p.value.expression),p.value.hasTrailingWhitespace&&w.addValue(" ")):w.addValue(p.value.text);return w}),b=et.define(()=>X.new().required(z.XmlComment)).converter(()=>null),T=et.define(()=>X.new().required(z.XmlOpenBracket).required("openingTagName",z.XmlIdentifier).optional("attributes<-data",u).required("closing",[X.new().required(z.XmlCloseClosingBracket),X.new().required(z.XmlCloseBracket).required("values",h).required(z.XmlOpenClosingBracket).required("closingTageName",z.XmlIdentifier).required(z.XmlCloseBracket)])).converter(o=>{if("closingTageName"in o.closing&&o.openingTagName!==o.closing.closingTageName)throw new _(`Opening (${o.openingTagName}) and closing tagname (${o.closing.closingTageName}) does not match`,this);let w=new Rt(o.openingTagName);if(o.attributes)for(let p of o.attributes)w.setAttribute(p.name).addValue(...p.values);return"values"in o.closing&&w.appendChild(...o.closing.values),w}),N=et.define(()=>{let o=N;return X.new().required("list[]",z.InstructionInstructionValue).optional("list<-list",o)}),c=et.define(()=>X.new().required("instructionName",z.InstructionStart).optional("instruction",X.new().required(z.InstructionInstructionOpeningBracket).required("value<-list",N).required(z.InstructionInstructionClosingBracket)).optional("body",X.new().required(z.InstructionBodyStartBraket).required("value",h).required(z.InstructionBodyCloseBraket))).converter(o=>{let w=o.instructionName.substring(1),p=o.instruction?.value.join("")??"",D=new Wt(w,p);return o.body&&D.appendChild(...o.body.value),D}),n=et.define(()=>{let o=n;return X.new().required("list[]",[b,T,c,y]).optional("list<-list",o)}),h=et.define(()=>{let o=n;return X.new().optional("list<-list",o)}).converter(o=>{let w=new Array;if(o.list)for(let p of o.list)p!==null&&w.push(p);return w}),l=et.define(()=>X.new().required("content",h)).converter(o=>{let w=new ut;return w.appendChild(...o.content),w});this.setRootGraph(l)}};var G=class v extends Fe{static mTemplateCache=new rt;static mXmlParser=new Te;mComponentElement;mIsUpdated;mRootBuilder;get element(){return this.mComponentElement.htmlElement}constructor(t){super({constructor:t.processorConstructor,parent:null}),Q.registerComponent(this,t.htmlElement),this.setProcessorInjection(v,this),this.addConstructionHook(u=>{Q.registerComponent(this,this.mComponentElement.htmlElement,u)}),v.mTemplateCache.has(t.processorConstructor)||v.mTemplateCache.set(t.processorConstructor,v.mXmlParser.parse(t.templateString??""));let e=v.mTemplateCache.get(t.processorConstructor).clone();this.mIsUpdated=!1,this.mComponentElement=new be(t.htmlElement),this.mRootBuilder=new te(e,new $e(this,t.expressionModule),new ft(this),"ROOT",null),this.mComponentElement.shadowRoot.appendChild(this.mRootBuilder.anchor),this.setProcessorInjection(Ct,new Ct(this.mRootBuilder.values));let r=this.updater.zone.getAttachment(It.ATTACHMENT_KEY);if(r)for(let[u,f]of r.injections)this.setProcessorInjection(u,f)}addStyle(t){let e=document.createElement("style");e.innerHTML=t,this.mComponentElement.shadowRoot.prepend(e)}attributeChanged(t,e,r){this.call("onAttributeChange",t,e,r)}connected(){this.mIsUpdated||this.updater.update(),this.call("onConnect")}deconstruct(){this.call("onDeconstruct"),this.mRootBuilder.deconstruct(),super.deconstruct()}disconnected(){this.call("onDisconnect")}onUpdate(){return this.mIsUpdated||(this.mIsUpdated=!0),this.mRootBuilder.update()?(this.call("onUpdate"),!0):!1}};function B(v){return(t,e)=>{O.registerInjectable(t,e.metadata,"instanced"),Q.registerConstructor(t,v.selector);let r=class extends HTMLElement{mComponent;constructor(){super(),this.mComponent=new G({processorConstructor:t,templateString:v.template??null,expressionModule:v.expressionmodule,htmlElement:this}).setup(),v.style&&this.mComponent.addStyle(v.style)}connectedCallback(){this.mComponent.connected()}disconnectedCallback(){this.mComponent.disconnected()}};globalThis.customElements.define(v.selector,r)}}function qt(v){return(t,e)=>{O.registerInjectable(t,e.metadata,"instanced"),ct.register($t,t,{access:v.access,targetRestrictions:v.targetRestrictions})}}function Dt(v){return(t,e)=>{O.registerInjectable(t,e.metadata,"instanced"),ct.register(Tt,t,{access:v.access,selector:v.selector})}}function Ot(v){return(t,e)=>{O.registerInjectable(t,e.metadata,"instanced"),ct.register(Xt,t,{instructionType:v.instructionType})}}function Gs(){function v(c,n){return function(l){e(n,"addInitializer"),r(l,"An initializer"),c.push(l)}}function t(c,n,h,l,o,w,p,D,x){var m;switch(o){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var s={kind:m,name:p?"#"+n:n,static:w,private:p,metadata:D},d={v:!1};s.addInitializer=v(l,d);var i,a;if(o===0?p?(i=h.get,a=h.set):(i=function(){return this[n]},a=function(g){this[n]=g}):o===2?i=function(){return h.value}:((o===1||o===3)&&(i=function(){return h.get.call(this)}),(o===1||o===4)&&(a=function(g){h.set.call(this,g)})),p)s.access=i&&a?{get:i,set:a}:i?{get:i}:{set:a};else{if(i){var C=i;i=function(g){return arguments.length===0&&(g=this),C.call(g)}}if(a){var P=a;a=function(g,S){return arguments.length===1&&(S=g,g=this),P.call(g,S)}}var E=function(g){return n in g};s.access=i&&a?{has:E,get:i,set:a}:i?{has:E,get:i}:{has:E,set:a}}try{return c(x,s)}finally{d.v=!0}}function e(c,n){if(c.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(c,n){if(typeof c!="function")throw new TypeError(n+" must be a function")}function u(c,n){var h=typeof n;if(c===1){if(h!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(h!=="function"){var l;throw c===0?l="field":c===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function f(c,n,h,l,o,w,p,D,x){var m=h[0],s,d,i;p?o===0||o===1?s={get:h[3],set:h[4]}:o===3?s={get:h[3]}:o===4?s={set:h[3]}:s={value:h[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var a,C,P;if(typeof m=="function")a=t(m,l,s,D,o,w,p,x,i),a!==void 0&&(u(o,a),o===0?d=a:o===1?(d=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a);else for(var E=m.length-1;E>=0;E--){var g=m[E];if(a=t(g,l,s,D,o,w,p,x,i),a!==void 0){u(o,a);var S;o===0?S=a:o===1?(S=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a,S!==void 0&&(d===void 0?d=S:typeof d=="function"?d=[d,S]:d.push(S))}}if(o===0||o===1){if(d===void 0)d=function(M,I){return I};else if(typeof d!="function"){var F=d;d=function(M,I){for(var A=I,L=0;L<F.length;L++)A=F[L].call(M,A);return A}}else{var j=d;d=function(M,I){return j.call(M,I)}}c.push(d)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),p?o===1?(c.push(function(M,I){return i.get.call(M,I)}),c.push(function(M,I){return i.set.call(M,I)})):o===2?c.push(i):c.push(function(M,I){return i.call(M,I)}):Object.defineProperty(n,l,s))}function y(c,n,h){for(var l=[],o,w,p=new Map,D=new Map,x=0;x<n.length;x++){var m=n[x];if(Array.isArray(m)){var s=m[1],d=m[2],i=m.length>3,a=s>=5,C,P;if(a?(C=c,s=s-5,w=w||[],P=w):(C=c.prototype,o=o||[],P=o),s!==0&&!i){var E=a?D:p,g=E.get(d)||0;if(g===!0||g===3&&s!==4||g===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!g&&s>2?E.set(d,s):E.set(d,!0)}f(l,C,m,d,s,a,i,P,h)}}return b(l,o),b(l,w),l}function b(c,n){n&&c.push(function(h){for(var l=0;l<n.length;l++)n[l].call(h);return h})}function T(c,n,h){if(n.length>0){for(var l=[],o=c,w=c.name,p=n.length-1;p>=0;p--){var D={v:!1};try{var x=n[p](o,{kind:"class",name:w,addInitializer:v(l,D),metadata:h})}finally{D.v=!0}x!==void 0&&(u(10,x),o=x)}return[N(o,h),function(){for(var m=0;m<l.length;m++)l[m].call(o)}]}}function N(c,n){return Object.defineProperty(c,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,h,l,o){if(o!==void 0)var w=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var p=Object.create(w===void 0?null:w),D=y(n,h,p);return l.length||N(n,p),{e:D,get c(){return T(n,l,p)}}}}function zo(v,t,e,r){return(zo=Gs())(v,t,e,r)}function Bs(v){return v}var jo,Fo,De;jo=qt({access:q.Read,targetRestrictions:[G]});new class extends Bs{constructor(){super(De),Fo()}static{class v{static{({c:[De,Fo]}=zo(this,[],[jo]))}static METADATA_USER_EVENT_LISTENER_PROPERIES="pwb:user_event_listener_properties";mEventListenerList;mTargetElement;constructor(e=O.use(G)){let r=new Array,u=e.processorConstructor;do{let f=st.get(u).getMetadata(v.METADATA_USER_EVENT_LISTENER_PROPERIES);if(f)for(let y of f)r.push(y)}while(u=Object.getPrototypeOf(u));this.mEventListenerList=new Array,this.mTargetElement=e.element;for(let f of r){let[y,b]=f,T=Reflect.get(e.processor,y);T=T.bind(e.processor),this.mEventListenerList.push([b,T]),this.mTargetElement.addEventListener(b,T)}}onDeconstruct(){for(let e of this.mEventListenerList){let[r,u]=e;this.mTargetElement.removeEventListener(r,u)}}}}};var Ee=class extends window.Event{mValue;get value(){return this.mValue}constructor(t,e){super(t),this.mValue=e}};var Ie=class{mElement;mEventName;constructor(t,e){this.mEventName=t,this.mElement=e}dispatchEvent(t){let e=new Ee(this.mEventName,t);this.mElement.dispatchEvent(e)}};function pt(v){return(t,e)=>{if(e.static)throw new _("Event target is not for a static property.",pt);let r=new WeakMap;return{get(){if(!r.has(this)){let u=(()=>{try{return Q.ofProcessor(this).component}catch{throw new _("PwbComponentEvent target class is not a component.",this)}})();r.set(this,new Ie(v,u.element))}return r.get(this)}}}}function Us(){function v(c,n){return function(l){e(n,"addInitializer"),r(l,"An initializer"),c.push(l)}}function t(c,n,h,l,o,w,p,D,x){var m;switch(o){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var s={kind:m,name:p?"#"+n:n,static:w,private:p,metadata:D},d={v:!1};s.addInitializer=v(l,d);var i,a;if(o===0?p?(i=h.get,a=h.set):(i=function(){return this[n]},a=function(g){this[n]=g}):o===2?i=function(){return h.value}:((o===1||o===3)&&(i=function(){return h.get.call(this)}),(o===1||o===4)&&(a=function(g){h.set.call(this,g)})),p)s.access=i&&a?{get:i,set:a}:i?{get:i}:{set:a};else{if(i){var C=i;i=function(g){return arguments.length===0&&(g=this),C.call(g)}}if(a){var P=a;a=function(g,S){return arguments.length===1&&(S=g,g=this),P.call(g,S)}}var E=function(g){return n in g};s.access=i&&a?{has:E,get:i,set:a}:i?{has:E,get:i}:{has:E,set:a}}try{return c(x,s)}finally{d.v=!0}}function e(c,n){if(c.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(c,n){if(typeof c!="function")throw new TypeError(n+" must be a function")}function u(c,n){var h=typeof n;if(c===1){if(h!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(h!=="function"){var l;throw c===0?l="field":c===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function f(c,n,h,l,o,w,p,D,x){var m=h[0],s,d,i;p?o===0||o===1?s={get:h[3],set:h[4]}:o===3?s={get:h[3]}:o===4?s={set:h[3]}:s={value:h[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var a,C,P;if(typeof m=="function")a=t(m,l,s,D,o,w,p,x,i),a!==void 0&&(u(o,a),o===0?d=a:o===1?(d=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a);else for(var E=m.length-1;E>=0;E--){var g=m[E];if(a=t(g,l,s,D,o,w,p,x,i),a!==void 0){u(o,a);var S;o===0?S=a:o===1?(S=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a,S!==void 0&&(d===void 0?d=S:typeof d=="function"?d=[d,S]:d.push(S))}}if(o===0||o===1){if(d===void 0)d=function(M,I){return I};else if(typeof d!="function"){var F=d;d=function(M,I){for(var A=I,L=0;L<F.length;L++)A=F[L].call(M,A);return A}}else{var j=d;d=function(M,I){return j.call(M,I)}}c.push(d)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),p?o===1?(c.push(function(M,I){return i.get.call(M,I)}),c.push(function(M,I){return i.set.call(M,I)})):o===2?c.push(i):c.push(function(M,I){return i.call(M,I)}):Object.defineProperty(n,l,s))}function y(c,n,h){for(var l=[],o,w,p=new Map,D=new Map,x=0;x<n.length;x++){var m=n[x];if(Array.isArray(m)){var s=m[1],d=m[2],i=m.length>3,a=s>=5,C,P;if(a?(C=c,s=s-5,w=w||[],P=w):(C=c.prototype,o=o||[],P=o),s!==0&&!i){var E=a?D:p,g=E.get(d)||0;if(g===!0||g===3&&s!==4||g===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!g&&s>2?E.set(d,s):E.set(d,!0)}f(l,C,m,d,s,a,i,P,h)}}return b(l,o),b(l,w),l}function b(c,n){n&&c.push(function(h){for(var l=0;l<n.length;l++)n[l].call(h);return h})}function T(c,n,h){if(n.length>0){for(var l=[],o=c,w=c.name,p=n.length-1;p>=0;p--){var D={v:!1};try{var x=n[p](o,{kind:"class",name:w,addInitializer:v(l,D),metadata:h})}finally{D.v=!0}x!==void 0&&(u(10,x),o=x)}return[N(o,h),function(){for(var m=0;m<l.length;m++)l[m].call(o)}]}}function N(c,n){return Object.defineProperty(c,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,h,l,o){if(o!==void 0)var w=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var p=Object.create(w===void 0?null:w),D=y(n,h,p);return l.length||N(n,p),{e:D,get c(){return T(n,l,p)}}}}function $o(v,t,e,r){return($o=Us())(v,t,e,r)}function Xs(v){return v}var Go,Vo,Ce;Go=qt({access:q.ReadWrite,targetRestrictions:[G]});new class extends Xs{constructor(){super(Ce),Vo()}static{class v{static{({c:[Ce,Vo]}=$o(this,[],[Go]))}static METADATA_EXPORTED_PROPERTIES="pwb:exported_properties";mComponent;constructor(e=O.use(G)){this.mComponent=e;let r=new Ht,u=e.processorConstructor;do{let y=st.get(u).getMetadata(v.METADATA_EXPORTED_PROPERTIES);y&&r.push(...y)}while(u=Object.getPrototypeOf(u));let f=new Set(r);f.size>0&&this.connectExportedProperties(f)}connectExportedProperties(e){this.exportPropertyAsAttribute(e),this.patchHtmlAttributes(e)}exportPropertyAsAttribute(e){for(let r of e){let u={};u.enumerable=!0,u.configurable=!0,delete u.value,delete u.writable,u.set=f=>{Reflect.set(this.mComponent.processor,r,f)},u.get=()=>{let f=Reflect.get(this.mComponent.processor,r);return typeof f=="function"&&(f=f.bind(this.mComponent.processor)),f},Object.defineProperty(this.mComponent.element,r,u)}}patchHtmlAttributes(e){let r=this.mComponent.element.getAttribute;new MutationObserver(f=>{for(let y of f){let b=y.attributeName,T=r.call(this.mComponent.element,b);Reflect.set(this.mComponent.element,b,T),this.mComponent.attributeChanged(b,y.oldValue,T)}}).observe(this.mComponent.element,{attributeFilter:[...e],attributeOldValue:!0});for(let f of e)if(this.mComponent.element.hasAttribute(f)){let y=r.call(this.mComponent.element,f);this.mComponent.element.setAttribute(f,y)}this.mComponent.element.getAttribute=f=>e.has(f)?Reflect.get(this.mComponent.element,f):r.call(this.mComponent.element,f)}}}};function W(v,t){if(t.static)throw new _("Event target is not for a static property.",W);let e=st.forInternalDecorator(t.metadata),r=e.getMetadata(Ce.METADATA_EXPORTED_PROPERTIES)??new Array;r.push(t.name),e.setMetadata(Ce.METADATA_EXPORTED_PROPERTIES,r)}function gt(v){return(t,e)=>{if(e.static)throw new _("Child decorator is not for a static property.",gt);return{get(){let f=(()=>{try{return Q.ofProcessor(this).component}catch{throw new _("PwbChild target class is not a component.",this)}})().getProcessorInjection(Ct).data.store[v];return f instanceof Element?f:null}}}}function Hs(){function v(c,n){return function(l){e(n,"addInitializer"),r(l,"An initializer"),c.push(l)}}function t(c,n,h,l,o,w,p,D,x){var m;switch(o){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var s={kind:m,name:p?"#"+n:n,static:w,private:p,metadata:D},d={v:!1};s.addInitializer=v(l,d);var i,a;if(o===0?p?(i=h.get,a=h.set):(i=function(){return this[n]},a=function(g){this[n]=g}):o===2?i=function(){return h.value}:((o===1||o===3)&&(i=function(){return h.get.call(this)}),(o===1||o===4)&&(a=function(g){h.set.call(this,g)})),p)s.access=i&&a?{get:i,set:a}:i?{get:i}:{set:a};else{if(i){var C=i;i=function(g){return arguments.length===0&&(g=this),C.call(g)}}if(a){var P=a;a=function(g,S){return arguments.length===1&&(S=g,g=this),P.call(g,S)}}var E=function(g){return n in g};s.access=i&&a?{has:E,get:i,set:a}:i?{has:E,get:i}:{has:E,set:a}}try{return c(x,s)}finally{d.v=!0}}function e(c,n){if(c.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(c,n){if(typeof c!="function")throw new TypeError(n+" must be a function")}function u(c,n){var h=typeof n;if(c===1){if(h!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(h!=="function"){var l;throw c===0?l="field":c===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function f(c,n,h,l,o,w,p,D,x){var m=h[0],s,d,i;p?o===0||o===1?s={get:h[3],set:h[4]}:o===3?s={get:h[3]}:o===4?s={set:h[3]}:s={value:h[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var a,C,P;if(typeof m=="function")a=t(m,l,s,D,o,w,p,x,i),a!==void 0&&(u(o,a),o===0?d=a:o===1?(d=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a);else for(var E=m.length-1;E>=0;E--){var g=m[E];if(a=t(g,l,s,D,o,w,p,x,i),a!==void 0){u(o,a);var S;o===0?S=a:o===1?(S=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a,S!==void 0&&(d===void 0?d=S:typeof d=="function"?d=[d,S]:d.push(S))}}if(o===0||o===1){if(d===void 0)d=function(M,I){return I};else if(typeof d!="function"){var F=d;d=function(M,I){for(var A=I,L=0;L<F.length;L++)A=F[L].call(M,A);return A}}else{var j=d;d=function(M,I){return j.call(M,I)}}c.push(d)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),p?o===1?(c.push(function(M,I){return i.get.call(M,I)}),c.push(function(M,I){return i.set.call(M,I)})):o===2?c.push(i):c.push(function(M,I){return i.call(M,I)}):Object.defineProperty(n,l,s))}function y(c,n,h){for(var l=[],o,w,p=new Map,D=new Map,x=0;x<n.length;x++){var m=n[x];if(Array.isArray(m)){var s=m[1],d=m[2],i=m.length>3,a=s>=5,C,P;if(a?(C=c,s=s-5,w=w||[],P=w):(C=c.prototype,o=o||[],P=o),s!==0&&!i){var E=a?D:p,g=E.get(d)||0;if(g===!0||g===3&&s!==4||g===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!g&&s>2?E.set(d,s):E.set(d,!0)}f(l,C,m,d,s,a,i,P,h)}}return b(l,o),b(l,w),l}function b(c,n){n&&c.push(function(h){for(var l=0;l<n.length;l++)n[l].call(h);return h})}function T(c,n,h){if(n.length>0){for(var l=[],o=c,w=c.name,p=n.length-1;p>=0;p--){var D={v:!1};try{var x=n[p](o,{kind:"class",name:w,addInitializer:v(l,D),metadata:h})}finally{D.v=!0}x!==void 0&&(u(10,x),o=x)}return[N(o,h),function(){for(var m=0;m<l.length;m++)l[m].call(o)}]}}function N(c,n){return Object.defineProperty(c,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,h,l,o){if(o!==void 0)var w=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var p=Object.create(w===void 0?null:w),D=y(n,h,p);return l.length||N(n,p),{e:D,get c(){return T(n,l,p)}}}}function Xo(v,t,e,r){return(Xo=Hs())(v,t,e,r)}var Ho,Bo,Ys;Ho=Ot({instructionType:"dynamic-content"});var Uo=class{static{({c:[Ys,Bo]}=Xo(this,[],[Ho]))}constructor(t=O.use(ot),e=O.use(Y)){this.mModuleValues=e,this.mLastTemplate=null,this.mProcedure=this.mModuleValues.createExpressionProcedure(t.value)}mLastTemplate;mModuleValues;mProcedure;onUpdate(){let t=this.mProcedure.execute();if(!t||!(t instanceof ut))throw new _("Dynamic content method has a wrong result type.",this);if(this.mLastTemplate!==null&&this.mLastTemplate.equals(t))return null;let e=t.clone();this.mLastTemplate=e;let r=new ht;return r.addElement(e,new ft(this.mModuleValues.data),null),r}static{Bo()}};function Ws(){function v(c,n){return function(l){e(n,"addInitializer"),r(l,"An initializer"),c.push(l)}}function t(c,n,h,l,o,w,p,D,x){var m;switch(o){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var s={kind:m,name:p?"#"+n:n,static:w,private:p,metadata:D},d={v:!1};s.addInitializer=v(l,d);var i,a;if(o===0?p?(i=h.get,a=h.set):(i=function(){return this[n]},a=function(g){this[n]=g}):o===2?i=function(){return h.value}:((o===1||o===3)&&(i=function(){return h.get.call(this)}),(o===1||o===4)&&(a=function(g){h.set.call(this,g)})),p)s.access=i&&a?{get:i,set:a}:i?{get:i}:{set:a};else{if(i){var C=i;i=function(g){return arguments.length===0&&(g=this),C.call(g)}}if(a){var P=a;a=function(g,S){return arguments.length===1&&(S=g,g=this),P.call(g,S)}}var E=function(g){return n in g};s.access=i&&a?{has:E,get:i,set:a}:i?{has:E,get:i}:{has:E,set:a}}try{return c(x,s)}finally{d.v=!0}}function e(c,n){if(c.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(c,n){if(typeof c!="function")throw new TypeError(n+" must be a function")}function u(c,n){var h=typeof n;if(c===1){if(h!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(h!=="function"){var l;throw c===0?l="field":c===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function f(c,n,h,l,o,w,p,D,x){var m=h[0],s,d,i;p?o===0||o===1?s={get:h[3],set:h[4]}:o===3?s={get:h[3]}:o===4?s={set:h[3]}:s={value:h[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var a,C,P;if(typeof m=="function")a=t(m,l,s,D,o,w,p,x,i),a!==void 0&&(u(o,a),o===0?d=a:o===1?(d=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a);else for(var E=m.length-1;E>=0;E--){var g=m[E];if(a=t(g,l,s,D,o,w,p,x,i),a!==void 0){u(o,a);var S;o===0?S=a:o===1?(S=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a,S!==void 0&&(d===void 0?d=S:typeof d=="function"?d=[d,S]:d.push(S))}}if(o===0||o===1){if(d===void 0)d=function(M,I){return I};else if(typeof d!="function"){var F=d;d=function(M,I){for(var A=I,L=0;L<F.length;L++)A=F[L].call(M,A);return A}}else{var j=d;d=function(M,I){return j.call(M,I)}}c.push(d)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),p?o===1?(c.push(function(M,I){return i.get.call(M,I)}),c.push(function(M,I){return i.set.call(M,I)})):o===2?c.push(i):c.push(function(M,I){return i.call(M,I)}):Object.defineProperty(n,l,s))}function y(c,n,h){for(var l=[],o,w,p=new Map,D=new Map,x=0;x<n.length;x++){var m=n[x];if(Array.isArray(m)){var s=m[1],d=m[2],i=m.length>3,a=s>=5,C,P;if(a?(C=c,s=s-5,w=w||[],P=w):(C=c.prototype,o=o||[],P=o),s!==0&&!i){var E=a?D:p,g=E.get(d)||0;if(g===!0||g===3&&s!==4||g===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!g&&s>2?E.set(d,s):E.set(d,!0)}f(l,C,m,d,s,a,i,P,h)}}return b(l,o),b(l,w),l}function b(c,n){n&&c.push(function(h){for(var l=0;l<n.length;l++)n[l].call(h);return h})}function T(c,n,h){if(n.length>0){for(var l=[],o=c,w=c.name,p=n.length-1;p>=0;p--){var D={v:!1};try{var x=n[p](o,{kind:"class",name:w,addInitializer:v(l,D),metadata:h})}finally{D.v=!0}x!==void 0&&(u(10,x),o=x)}return[N(o,h),function(){for(var m=0;m<l.length;m++)l[m].call(o)}]}}function N(c,n){return Object.defineProperty(c,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,h,l,o){if(o!==void 0)var w=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var p=Object.create(w===void 0?null:w),D=y(n,h,p);return l.length||N(n,p),{e:D,get c(){return T(n,l,p)}}}}function Zo(v,t,e,r){return(Zo=Ws())(v,t,e,r)}var qo,Yo,Zs;qo=Dt({access:q.Write,selector:/^\([[\w\-$]+\)$/});var Wo=class{static{({c:[Zs,Yo]}=Zo(this,[],[qo]))}constructor(t=O.use(tt),e=O.use(Y),r=O.use(nt)){this.mTarget=t,this.mEventName=r.name.substring(1,r.name.length-1);let u=e.createExpressionProcedure(r.value,["$event"]);this.mListener=f=>{u.setTemporaryValue("$event",f),u.execute()},this.mTarget.addEventListener(this.mEventName,this.mListener)}mEventName;mListener;mTarget;onDeconstruct(){this.mTarget.removeEventListener(this.mEventName,this.mListener)}static{Yo()}};function qs(){function v(c,n){return function(l){e(n,"addInitializer"),r(l,"An initializer"),c.push(l)}}function t(c,n,h,l,o,w,p,D,x){var m;switch(o){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var s={kind:m,name:p?"#"+n:n,static:w,private:p,metadata:D},d={v:!1};s.addInitializer=v(l,d);var i,a;if(o===0?p?(i=h.get,a=h.set):(i=function(){return this[n]},a=function(g){this[n]=g}):o===2?i=function(){return h.value}:((o===1||o===3)&&(i=function(){return h.get.call(this)}),(o===1||o===4)&&(a=function(g){h.set.call(this,g)})),p)s.access=i&&a?{get:i,set:a}:i?{get:i}:{set:a};else{if(i){var C=i;i=function(g){return arguments.length===0&&(g=this),C.call(g)}}if(a){var P=a;a=function(g,S){return arguments.length===1&&(S=g,g=this),P.call(g,S)}}var E=function(g){return n in g};s.access=i&&a?{has:E,get:i,set:a}:i?{has:E,get:i}:{has:E,set:a}}try{return c(x,s)}finally{d.v=!0}}function e(c,n){if(c.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(c,n){if(typeof c!="function")throw new TypeError(n+" must be a function")}function u(c,n){var h=typeof n;if(c===1){if(h!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(h!=="function"){var l;throw c===0?l="field":c===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function f(c,n,h,l,o,w,p,D,x){var m=h[0],s,d,i;p?o===0||o===1?s={get:h[3],set:h[4]}:o===3?s={get:h[3]}:o===4?s={set:h[3]}:s={value:h[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var a,C,P;if(typeof m=="function")a=t(m,l,s,D,o,w,p,x,i),a!==void 0&&(u(o,a),o===0?d=a:o===1?(d=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a);else for(var E=m.length-1;E>=0;E--){var g=m[E];if(a=t(g,l,s,D,o,w,p,x,i),a!==void 0){u(o,a);var S;o===0?S=a:o===1?(S=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a,S!==void 0&&(d===void 0?d=S:typeof d=="function"?d=[d,S]:d.push(S))}}if(o===0||o===1){if(d===void 0)d=function(M,I){return I};else if(typeof d!="function"){var F=d;d=function(M,I){for(var A=I,L=0;L<F.length;L++)A=F[L].call(M,A);return A}}else{var j=d;d=function(M,I){return j.call(M,I)}}c.push(d)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),p?o===1?(c.push(function(M,I){return i.get.call(M,I)}),c.push(function(M,I){return i.set.call(M,I)})):o===2?c.push(i):c.push(function(M,I){return i.call(M,I)}):Object.defineProperty(n,l,s))}function y(c,n,h){for(var l=[],o,w,p=new Map,D=new Map,x=0;x<n.length;x++){var m=n[x];if(Array.isArray(m)){var s=m[1],d=m[2],i=m.length>3,a=s>=5,C,P;if(a?(C=c,s=s-5,w=w||[],P=w):(C=c.prototype,o=o||[],P=o),s!==0&&!i){var E=a?D:p,g=E.get(d)||0;if(g===!0||g===3&&s!==4||g===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!g&&s>2?E.set(d,s):E.set(d,!0)}f(l,C,m,d,s,a,i,P,h)}}return b(l,o),b(l,w),l}function b(c,n){n&&c.push(function(h){for(var l=0;l<n.length;l++)n[l].call(h);return h})}function T(c,n,h){if(n.length>0){for(var l=[],o=c,w=c.name,p=n.length-1;p>=0;p--){var D={v:!1};try{var x=n[p](o,{kind:"class",name:w,addInitializer:v(l,D),metadata:h})}finally{D.v=!0}x!==void 0&&(u(10,x),o=x)}return[N(o,h),function(){for(var m=0;m<l.length;m++)l[m].call(o)}]}}function N(c,n){return Object.defineProperty(c,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,h,l,o){if(o!==void 0)var w=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var p=Object.create(w===void 0?null:w),D=y(n,h,p);return l.length||N(n,p),{e:D,get c(){return T(n,l,p)}}}}function Qo(v,t,e,r){return(Qo=qs())(v,t,e,r)}function Js(v){return v}var ko,Jo,Ko;ko=Ot({instructionType:"for"});new class extends Js{constructor(){super(Ko),Jo()}static{class v{static{({c:[Ko,Jo]}=Qo(this,[],[ko]))}static REGEX_HEAD=new RegExp(/^\s*([a-zA-Z]+[a-zA-Z0-9]*)\s*of\s+([^;]+)\s*(?:;(.*))?$/);static REGEX_MODIFIER_INSTRUCTION=new RegExp(/^\s*(\$?[a-zA-Z]+[a-zA-Z0-9]*)\s*=\s*(.+?)\s*$/);mExpression;mLastEntries;mModuleValues;mTemplate;constructor(e=O.use(mt),r=O.use(Y),u=O.use(ot)){this.mTemplate=e,this.mModuleValues=r,this.mLastEntries=new Array;let f=u.value,y=v.REGEX_HEAD.exec(f);if(!y)throw new _(`For-Parameter value has wrong format: ${f}`,this);let b=y[1],T=y[2],N=y[3]?y[3].split(";"):new Array,c=new Array;for(let n of N){let h=v.REGEX_MODIFIER_INSTRUCTION.exec(n);if(!h)throw new _(`For-Parameter optional instruction has wrong format: ${n}`,this);c.push({variableName:h[1],procedure:this.mModuleValues.createExpressionProcedure(h[2],["$index",b])})}this.mExpression={iterateVariableName:b,iterateValueProcedure:this.mModuleValues.createExpressionProcedure(T),modifier:c}}onUpdate(){let e=new ht,r=this.mExpression.iterateValueProcedure.execute();if(typeof r=="object"&&r!==null||Array.isArray(r)){let u=Symbol.iterator in r?Object.entries([...r]):Object.entries(r);if(this.compareEntries(u,this.mLastEntries))return null;this.mLastEntries=u;for(let[f,y]of u)this.addTemplateForElement(e,this.mExpression,y,f);return e}else return null}addTemplateForElement=(e,r,u,f)=>{let y=new ft(this.mModuleValues.data);y.setTemporaryValue(r.iterateVariableName,u);let b=u;for(let N of r.modifier){N.procedure.setTemporaryValue("$index",f),N.procedure.setTemporaryValue(r.iterateVariableName,u);let c=N.procedure.execute();if(N.variableName==="$key"){b=c;continue}y.setTemporaryValue(N.variableName,c)}let T=new ut;T.appendChild(...this.mTemplate.childList),e.addElement(T,y,b)};compareEntries(e,r){if(e.length!==r.length)return!1;for(let u=0;u<e.length;u++){let[f,y]=e[u],[b,T]=r[u];if(f!==b||y!==T)return!1}return!0}}}};function Ks(){function v(c,n){return function(l){e(n,"addInitializer"),r(l,"An initializer"),c.push(l)}}function t(c,n,h,l,o,w,p,D,x){var m;switch(o){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var s={kind:m,name:p?"#"+n:n,static:w,private:p,metadata:D},d={v:!1};s.addInitializer=v(l,d);var i,a;if(o===0?p?(i=h.get,a=h.set):(i=function(){return this[n]},a=function(g){this[n]=g}):o===2?i=function(){return h.value}:((o===1||o===3)&&(i=function(){return h.get.call(this)}),(o===1||o===4)&&(a=function(g){h.set.call(this,g)})),p)s.access=i&&a?{get:i,set:a}:i?{get:i}:{set:a};else{if(i){var C=i;i=function(g){return arguments.length===0&&(g=this),C.call(g)}}if(a){var P=a;a=function(g,S){return arguments.length===1&&(S=g,g=this),P.call(g,S)}}var E=function(g){return n in g};s.access=i&&a?{has:E,get:i,set:a}:i?{has:E,get:i}:{has:E,set:a}}try{return c(x,s)}finally{d.v=!0}}function e(c,n){if(c.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(c,n){if(typeof c!="function")throw new TypeError(n+" must be a function")}function u(c,n){var h=typeof n;if(c===1){if(h!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(h!=="function"){var l;throw c===0?l="field":c===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function f(c,n,h,l,o,w,p,D,x){var m=h[0],s,d,i;p?o===0||o===1?s={get:h[3],set:h[4]}:o===3?s={get:h[3]}:o===4?s={set:h[3]}:s={value:h[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var a,C,P;if(typeof m=="function")a=t(m,l,s,D,o,w,p,x,i),a!==void 0&&(u(o,a),o===0?d=a:o===1?(d=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a);else for(var E=m.length-1;E>=0;E--){var g=m[E];if(a=t(g,l,s,D,o,w,p,x,i),a!==void 0){u(o,a);var S;o===0?S=a:o===1?(S=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a,S!==void 0&&(d===void 0?d=S:typeof d=="function"?d=[d,S]:d.push(S))}}if(o===0||o===1){if(d===void 0)d=function(M,I){return I};else if(typeof d!="function"){var F=d;d=function(M,I){for(var A=I,L=0;L<F.length;L++)A=F[L].call(M,A);return A}}else{var j=d;d=function(M,I){return j.call(M,I)}}c.push(d)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),p?o===1?(c.push(function(M,I){return i.get.call(M,I)}),c.push(function(M,I){return i.set.call(M,I)})):o===2?c.push(i):c.push(function(M,I){return i.call(M,I)}):Object.defineProperty(n,l,s))}function y(c,n,h){for(var l=[],o,w,p=new Map,D=new Map,x=0;x<n.length;x++){var m=n[x];if(Array.isArray(m)){var s=m[1],d=m[2],i=m.length>3,a=s>=5,C,P;if(a?(C=c,s=s-5,w=w||[],P=w):(C=c.prototype,o=o||[],P=o),s!==0&&!i){var E=a?D:p,g=E.get(d)||0;if(g===!0||g===3&&s!==4||g===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!g&&s>2?E.set(d,s):E.set(d,!0)}f(l,C,m,d,s,a,i,P,h)}}return b(l,o),b(l,w),l}function b(c,n){n&&c.push(function(h){for(var l=0;l<n.length;l++)n[l].call(h);return h})}function T(c,n,h){if(n.length>0){for(var l=[],o=c,w=c.name,p=n.length-1;p>=0;p--){var D={v:!1};try{var x=n[p](o,{kind:"class",name:w,addInitializer:v(l,D),metadata:h})}finally{D.v=!0}x!==void 0&&(u(10,x),o=x)}return[N(o,h),function(){for(var m=0;m<l.length;m++)l[m].call(o)}]}}function N(c,n){return Object.defineProperty(c,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,h,l,o){if(o!==void 0)var w=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var p=Object.create(w===void 0?null:w),D=y(n,h,p);return l.length||N(n,p),{e:D,get c(){return T(n,l,p)}}}}function or(v,t,e,r){return(or=Ks())(v,t,e,r)}var rr,tr,Qs;rr=Ot({instructionType:"if"});var er=class{static{({c:[Qs,tr]}=or(this,[],[rr]))}constructor(t=O.use(mt),e=O.use(Y),r=O.use(ot)){this.mTemplateReference=t,this.mModuleValues=e,this.mProcedure=this.mModuleValues.createExpressionProcedure(r.value),this.mLastBoolean=!1}mLastBoolean;mModuleValues;mProcedure;mTemplateReference;onUpdate(){let t=this.mProcedure.execute();if(!!t!==this.mLastBoolean){this.mLastBoolean=!!t;let e=new ht;if(t){let r=new ut;r.appendChild(...this.mTemplateReference.childList),e.addElement(r,new ft(this.mModuleValues.data),null)}return e}else return null}static{tr()}};function ks(){function v(c,n){return function(l){e(n,"addInitializer"),r(l,"An initializer"),c.push(l)}}function t(c,n,h,l,o,w,p,D,x){var m;switch(o){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var s={kind:m,name:p?"#"+n:n,static:w,private:p,metadata:D},d={v:!1};s.addInitializer=v(l,d);var i,a;if(o===0?p?(i=h.get,a=h.set):(i=function(){return this[n]},a=function(g){this[n]=g}):o===2?i=function(){return h.value}:((o===1||o===3)&&(i=function(){return h.get.call(this)}),(o===1||o===4)&&(a=function(g){h.set.call(this,g)})),p)s.access=i&&a?{get:i,set:a}:i?{get:i}:{set:a};else{if(i){var C=i;i=function(g){return arguments.length===0&&(g=this),C.call(g)}}if(a){var P=a;a=function(g,S){return arguments.length===1&&(S=g,g=this),P.call(g,S)}}var E=function(g){return n in g};s.access=i&&a?{has:E,get:i,set:a}:i?{has:E,get:i}:{has:E,set:a}}try{return c(x,s)}finally{d.v=!0}}function e(c,n){if(c.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(c,n){if(typeof c!="function")throw new TypeError(n+" must be a function")}function u(c,n){var h=typeof n;if(c===1){if(h!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(h!=="function"){var l;throw c===0?l="field":c===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function f(c,n,h,l,o,w,p,D,x){var m=h[0],s,d,i;p?o===0||o===1?s={get:h[3],set:h[4]}:o===3?s={get:h[3]}:o===4?s={set:h[3]}:s={value:h[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var a,C,P;if(typeof m=="function")a=t(m,l,s,D,o,w,p,x,i),a!==void 0&&(u(o,a),o===0?d=a:o===1?(d=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a);else for(var E=m.length-1;E>=0;E--){var g=m[E];if(a=t(g,l,s,D,o,w,p,x,i),a!==void 0){u(o,a);var S;o===0?S=a:o===1?(S=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a,S!==void 0&&(d===void 0?d=S:typeof d=="function"?d=[d,S]:d.push(S))}}if(o===0||o===1){if(d===void 0)d=function(M,I){return I};else if(typeof d!="function"){var F=d;d=function(M,I){for(var A=I,L=0;L<F.length;L++)A=F[L].call(M,A);return A}}else{var j=d;d=function(M,I){return j.call(M,I)}}c.push(d)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),p?o===1?(c.push(function(M,I){return i.get.call(M,I)}),c.push(function(M,I){return i.set.call(M,I)})):o===2?c.push(i):c.push(function(M,I){return i.call(M,I)}):Object.defineProperty(n,l,s))}function y(c,n,h){for(var l=[],o,w,p=new Map,D=new Map,x=0;x<n.length;x++){var m=n[x];if(Array.isArray(m)){var s=m[1],d=m[2],i=m.length>3,a=s>=5,C,P;if(a?(C=c,s=s-5,w=w||[],P=w):(C=c.prototype,o=o||[],P=o),s!==0&&!i){var E=a?D:p,g=E.get(d)||0;if(g===!0||g===3&&s!==4||g===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!g&&s>2?E.set(d,s):E.set(d,!0)}f(l,C,m,d,s,a,i,P,h)}}return b(l,o),b(l,w),l}function b(c,n){n&&c.push(function(h){for(var l=0;l<n.length;l++)n[l].call(h);return h})}function T(c,n,h){if(n.length>0){for(var l=[],o=c,w=c.name,p=n.length-1;p>=0;p--){var D={v:!1};try{var x=n[p](o,{kind:"class",name:w,addInitializer:v(l,D),metadata:h})}finally{D.v=!0}x!==void 0&&(u(10,x),o=x)}return[N(o,h),function(){for(var m=0;m<l.length;m++)l[m].call(o)}]}}function N(c,n){return Object.defineProperty(c,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,h,l,o){if(o!==void 0)var w=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var p=Object.create(w===void 0?null:w),D=y(n,h,p);return l.length||N(n,p),{e:D,get c(){return T(n,l,p)}}}}function sr(v,t,e,r){return(sr=ks())(v,t,e,r)}var ar,nr,ta;ar=Dt({access:q.Read,selector:/^\[[\w$]+\]$/});var ir=class{static{({c:[ta,nr]}=sr(this,[],[ar]))}constructor(t=O.use(tt),e=O.use(Y),r=O.use(nt)){this.mTarget=t,this.mProcedure=e.createExpressionProcedure(r.value),this.mTargetProperty=r.name.substring(1,r.name.length-1),this.mLastValue=Symbol("Uncomparable")}mLastValue;mProcedure;mTarget;mTargetProperty;onUpdate(){let t=this.mProcedure.execute();return t===this.mLastValue?!1:(this.mLastValue=t,Reflect.set(this.mTarget,this.mTargetProperty,t),!0)}static{nr()}};function ea(){function v(c,n){return function(l){e(n,"addInitializer"),r(l,"An initializer"),c.push(l)}}function t(c,n,h,l,o,w,p,D,x){var m;switch(o){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var s={kind:m,name:p?"#"+n:n,static:w,private:p,metadata:D},d={v:!1};s.addInitializer=v(l,d);var i,a;if(o===0?p?(i=h.get,a=h.set):(i=function(){return this[n]},a=function(g){this[n]=g}):o===2?i=function(){return h.value}:((o===1||o===3)&&(i=function(){return h.get.call(this)}),(o===1||o===4)&&(a=function(g){h.set.call(this,g)})),p)s.access=i&&a?{get:i,set:a}:i?{get:i}:{set:a};else{if(i){var C=i;i=function(g){return arguments.length===0&&(g=this),C.call(g)}}if(a){var P=a;a=function(g,S){return arguments.length===1&&(S=g,g=this),P.call(g,S)}}var E=function(g){return n in g};s.access=i&&a?{has:E,get:i,set:a}:i?{has:E,get:i}:{has:E,set:a}}try{return c(x,s)}finally{d.v=!0}}function e(c,n){if(c.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(c,n){if(typeof c!="function")throw new TypeError(n+" must be a function")}function u(c,n){var h=typeof n;if(c===1){if(h!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(h!=="function"){var l;throw c===0?l="field":c===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function f(c,n,h,l,o,w,p,D,x){var m=h[0],s,d,i;p?o===0||o===1?s={get:h[3],set:h[4]}:o===3?s={get:h[3]}:o===4?s={set:h[3]}:s={value:h[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var a,C,P;if(typeof m=="function")a=t(m,l,s,D,o,w,p,x,i),a!==void 0&&(u(o,a),o===0?d=a:o===1?(d=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a);else for(var E=m.length-1;E>=0;E--){var g=m[E];if(a=t(g,l,s,D,o,w,p,x,i),a!==void 0){u(o,a);var S;o===0?S=a:o===1?(S=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a,S!==void 0&&(d===void 0?d=S:typeof d=="function"?d=[d,S]:d.push(S))}}if(o===0||o===1){if(d===void 0)d=function(M,I){return I};else if(typeof d!="function"){var F=d;d=function(M,I){for(var A=I,L=0;L<F.length;L++)A=F[L].call(M,A);return A}}else{var j=d;d=function(M,I){return j.call(M,I)}}c.push(d)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),p?o===1?(c.push(function(M,I){return i.get.call(M,I)}),c.push(function(M,I){return i.set.call(M,I)})):o===2?c.push(i):c.push(function(M,I){return i.call(M,I)}):Object.defineProperty(n,l,s))}function y(c,n,h){for(var l=[],o,w,p=new Map,D=new Map,x=0;x<n.length;x++){var m=n[x];if(Array.isArray(m)){var s=m[1],d=m[2],i=m.length>3,a=s>=5,C,P;if(a?(C=c,s=s-5,w=w||[],P=w):(C=c.prototype,o=o||[],P=o),s!==0&&!i){var E=a?D:p,g=E.get(d)||0;if(g===!0||g===3&&s!==4||g===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!g&&s>2?E.set(d,s):E.set(d,!0)}f(l,C,m,d,s,a,i,P,h)}}return b(l,o),b(l,w),l}function b(c,n){n&&c.push(function(h){for(var l=0;l<n.length;l++)n[l].call(h);return h})}function T(c,n,h){if(n.length>0){for(var l=[],o=c,w=c.name,p=n.length-1;p>=0;p--){var D={v:!1};try{var x=n[p](o,{kind:"class",name:w,addInitializer:v(l,D),metadata:h})}finally{D.v=!0}x!==void 0&&(u(10,x),o=x)}return[N(o,h),function(){for(var m=0;m<l.length;m++)l[m].call(o)}]}}function N(c,n){return Object.defineProperty(c,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,h,l,o){if(o!==void 0)var w=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var p=Object.create(w===void 0?null:w),D=y(n,h,p);return l.length||N(n,p),{e:D,get c(){return T(n,l,p)}}}}function ur(v,t,e,r){return(ur=ea())(v,t,e,r)}var hr,lr,oa;hr=Dt({access:q.Write,selector:/^#[[\w$]+$/});var cr=class{static{({c:[oa,lr]}=ur(this,[],[hr]))}constructor(t=O.use(tt),e=O.use(nt),r=O.use(Ct)){this.mChildName=e.name.substring(1),this.mComponentScopeValue=r,this.mTargetNode=t,this.mComponentScopeValue.setTemporaryValue(this.mChildName,this.mTargetNode)}mChildName;mComponentScopeValue;mTargetNode;onDeconstruct(){this.mComponentScopeValue.data.store[this.mChildName]===this.mTargetNode&&this.mComponentScopeValue.data.deleteTemporaryValue(this.mChildName)}static{lr()}};function ra(){function v(c,n){return function(l){e(n,"addInitializer"),r(l,"An initializer"),c.push(l)}}function t(c,n,h,l,o,w,p,D,x){var m;switch(o){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var s={kind:m,name:p?"#"+n:n,static:w,private:p,metadata:D},d={v:!1};s.addInitializer=v(l,d);var i,a;if(o===0?p?(i=h.get,a=h.set):(i=function(){return this[n]},a=function(g){this[n]=g}):o===2?i=function(){return h.value}:((o===1||o===3)&&(i=function(){return h.get.call(this)}),(o===1||o===4)&&(a=function(g){h.set.call(this,g)})),p)s.access=i&&a?{get:i,set:a}:i?{get:i}:{set:a};else{if(i){var C=i;i=function(g){return arguments.length===0&&(g=this),C.call(g)}}if(a){var P=a;a=function(g,S){return arguments.length===1&&(S=g,g=this),P.call(g,S)}}var E=function(g){return n in g};s.access=i&&a?{has:E,get:i,set:a}:i?{has:E,get:i}:{has:E,set:a}}try{return c(x,s)}finally{d.v=!0}}function e(c,n){if(c.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(c,n){if(typeof c!="function")throw new TypeError(n+" must be a function")}function u(c,n){var h=typeof n;if(c===1){if(h!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(h!=="function"){var l;throw c===0?l="field":c===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function f(c,n,h,l,o,w,p,D,x){var m=h[0],s,d,i;p?o===0||o===1?s={get:h[3],set:h[4]}:o===3?s={get:h[3]}:o===4?s={set:h[3]}:s={value:h[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var a,C,P;if(typeof m=="function")a=t(m,l,s,D,o,w,p,x,i),a!==void 0&&(u(o,a),o===0?d=a:o===1?(d=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a);else for(var E=m.length-1;E>=0;E--){var g=m[E];if(a=t(g,l,s,D,o,w,p,x,i),a!==void 0){u(o,a);var S;o===0?S=a:o===1?(S=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a,S!==void 0&&(d===void 0?d=S:typeof d=="function"?d=[d,S]:d.push(S))}}if(o===0||o===1){if(d===void 0)d=function(M,I){return I};else if(typeof d!="function"){var F=d;d=function(M,I){for(var A=I,L=0;L<F.length;L++)A=F[L].call(M,A);return A}}else{var j=d;d=function(M,I){return j.call(M,I)}}c.push(d)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),p?o===1?(c.push(function(M,I){return i.get.call(M,I)}),c.push(function(M,I){return i.set.call(M,I)})):o===2?c.push(i):c.push(function(M,I){return i.call(M,I)}):Object.defineProperty(n,l,s))}function y(c,n,h){for(var l=[],o,w,p=new Map,D=new Map,x=0;x<n.length;x++){var m=n[x];if(Array.isArray(m)){var s=m[1],d=m[2],i=m.length>3,a=s>=5,C,P;if(a?(C=c,s=s-5,w=w||[],P=w):(C=c.prototype,o=o||[],P=o),s!==0&&!i){var E=a?D:p,g=E.get(d)||0;if(g===!0||g===3&&s!==4||g===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!g&&s>2?E.set(d,s):E.set(d,!0)}f(l,C,m,d,s,a,i,P,h)}}return b(l,o),b(l,w),l}function b(c,n){n&&c.push(function(h){for(var l=0;l<n.length;l++)n[l].call(h);return h})}function T(c,n,h){if(n.length>0){for(var l=[],o=c,w=c.name,p=n.length-1;p>=0;p--){var D={v:!1};try{var x=n[p](o,{kind:"class",name:w,addInitializer:v(l,D),metadata:h})}finally{D.v=!0}x!==void 0&&(u(10,x),o=x)}return[N(o,h),function(){for(var m=0;m<l.length;m++)l[m].call(o)}]}}function N(c,n){return Object.defineProperty(c,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,h,l,o){if(o!==void 0)var w=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var p=Object.create(w===void 0?null:w),D=y(n,h,p);return l.length||N(n,p),{e:D,get c(){return T(n,l,p)}}}}function mr(v,t,e,r){return(mr=ra())(v,t,e,r)}var pr,dr,na;pr=Ot({instructionType:"slot"});var fr=class{static{({c:[na,dr]}=mr(this,[],[pr]))}constructor(t=O.use(Y),e=O.use(ot)){this.mModuleValues=t,this.mSlotName=e.value,this.mIsSetup=!1}mIsSetup;mModuleValues;mSlotName;onUpdate(){if(this.mIsSetup)return null;this.mIsSetup=!0;let t=new Rt("slot");this.mSlotName!==""&&t.setAttribute("name").addValue(this.mSlotName);let e=new ut;e.appendChild(t);let r=new ht;return r.addElement(e,this.mModuleValues.data,null),r}static{dr()}};function ia(){function v(c,n){return function(l){e(n,"addInitializer"),r(l,"An initializer"),c.push(l)}}function t(c,n,h,l,o,w,p,D,x){var m;switch(o){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var s={kind:m,name:p?"#"+n:n,static:w,private:p,metadata:D},d={v:!1};s.addInitializer=v(l,d);var i,a;if(o===0?p?(i=h.get,a=h.set):(i=function(){return this[n]},a=function(g){this[n]=g}):o===2?i=function(){return h.value}:((o===1||o===3)&&(i=function(){return h.get.call(this)}),(o===1||o===4)&&(a=function(g){h.set.call(this,g)})),p)s.access=i&&a?{get:i,set:a}:i?{get:i}:{set:a};else{if(i){var C=i;i=function(g){return arguments.length===0&&(g=this),C.call(g)}}if(a){var P=a;a=function(g,S){return arguments.length===1&&(S=g,g=this),P.call(g,S)}}var E=function(g){return n in g};s.access=i&&a?{has:E,get:i,set:a}:i?{has:E,get:i}:{has:E,set:a}}try{return c(x,s)}finally{d.v=!0}}function e(c,n){if(c.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(c,n){if(typeof c!="function")throw new TypeError(n+" must be a function")}function u(c,n){var h=typeof n;if(c===1){if(h!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(h!=="function"){var l;throw c===0?l="field":c===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function f(c,n,h,l,o,w,p,D,x){var m=h[0],s,d,i;p?o===0||o===1?s={get:h[3],set:h[4]}:o===3?s={get:h[3]}:o===4?s={set:h[3]}:s={value:h[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var a,C,P;if(typeof m=="function")a=t(m,l,s,D,o,w,p,x,i),a!==void 0&&(u(o,a),o===0?d=a:o===1?(d=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a);else for(var E=m.length-1;E>=0;E--){var g=m[E];if(a=t(g,l,s,D,o,w,p,x,i),a!==void 0){u(o,a);var S;o===0?S=a:o===1?(S=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a,S!==void 0&&(d===void 0?d=S:typeof d=="function"?d=[d,S]:d.push(S))}}if(o===0||o===1){if(d===void 0)d=function(M,I){return I};else if(typeof d!="function"){var F=d;d=function(M,I){for(var A=I,L=0;L<F.length;L++)A=F[L].call(M,A);return A}}else{var j=d;d=function(M,I){return j.call(M,I)}}c.push(d)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),p?o===1?(c.push(function(M,I){return i.get.call(M,I)}),c.push(function(M,I){return i.set.call(M,I)})):o===2?c.push(i):c.push(function(M,I){return i.call(M,I)}):Object.defineProperty(n,l,s))}function y(c,n,h){for(var l=[],o,w,p=new Map,D=new Map,x=0;x<n.length;x++){var m=n[x];if(Array.isArray(m)){var s=m[1],d=m[2],i=m.length>3,a=s>=5,C,P;if(a?(C=c,s=s-5,w=w||[],P=w):(C=c.prototype,o=o||[],P=o),s!==0&&!i){var E=a?D:p,g=E.get(d)||0;if(g===!0||g===3&&s!==4||g===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!g&&s>2?E.set(d,s):E.set(d,!0)}f(l,C,m,d,s,a,i,P,h)}}return b(l,o),b(l,w),l}function b(c,n){n&&c.push(function(h){for(var l=0;l<n.length;l++)n[l].call(h);return h})}function T(c,n,h){if(n.length>0){for(var l=[],o=c,w=c.name,p=n.length-1;p>=0;p--){var D={v:!1};try{var x=n[p](o,{kind:"class",name:w,addInitializer:v(l,D),metadata:h})}finally{D.v=!0}x!==void 0&&(u(10,x),o=x)}return[N(o,h),function(){for(var m=0;m<l.length;m++)l[m].call(o)}]}}function N(c,n){return Object.defineProperty(c,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,h,l,o){if(o!==void 0)var w=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var p=Object.create(w===void 0?null:w),D=y(n,h,p);return l.length||N(n,p),{e:D,get c(){return T(n,l,p)}}}}function yr(v,t,e,r){return(yr=ia())(v,t,e,r)}var br,gr,sa;br=Dt({access:q.ReadWrite,selector:/^\[\([[\w$]+\)\]$/});var vr=class{static{({c:[sa,gr]}=yr(this,[],[br]))}constructor(t=O.use(G),e=O.use(tt),r=O.use(Y),u=O.use(nt)){this.mTargetNode=e,this.mAttributeKey=u.name.substring(2,u.name.length-2),this.mReadProcedure=r.createExpressionProcedure(u.value),this.mWriteProcedure=r.createExpressionProcedure(`${u.value} = $DATA;`,["$DATA"]),this.mLastDataValue=Symbol("Uncomparable");let f=y=>{this.mLastDataValue!==y&&t.updater.updateAsync()};this.mTargetNode.addEventListener("input",y=>{f(Reflect.get(this.mTargetNode,this.mAttributeKey))}),this.mTargetNode.addEventListener("change",y=>{f(Reflect.get(this.mTargetNode,this.mAttributeKey))})}mAttributeKey;mLastDataValue;mReadProcedure;mTargetNode;mWriteProcedure;onUpdate(){let t=this.mReadProcedure.execute();if(t!==this.mLastDataValue)return Reflect.set(this.mTargetNode,this.mAttributeKey,t),this.mLastDataValue=t,!0;let e=Reflect.get(this.mTargetNode,this.mAttributeKey);return e!==t?(this.mWriteProcedure.setTemporaryValue("$DATA",e),this.mWriteProcedure.execute(),this.mLastDataValue=e,!0):!1}static{gr()}};function aa(){function v(c,n){return function(l){e(n,"addInitializer"),r(l,"An initializer"),c.push(l)}}function t(c,n,h,l,o,w,p,D,x){var m;switch(o){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var s={kind:m,name:p?"#"+n:n,static:w,private:p,metadata:D},d={v:!1};s.addInitializer=v(l,d);var i,a;if(o===0?p?(i=h.get,a=h.set):(i=function(){return this[n]},a=function(g){this[n]=g}):o===2?i=function(){return h.value}:((o===1||o===3)&&(i=function(){return h.get.call(this)}),(o===1||o===4)&&(a=function(g){h.set.call(this,g)})),p)s.access=i&&a?{get:i,set:a}:i?{get:i}:{set:a};else{if(i){var C=i;i=function(g){return arguments.length===0&&(g=this),C.call(g)}}if(a){var P=a;a=function(g,S){return arguments.length===1&&(S=g,g=this),P.call(g,S)}}var E=function(g){return n in g};s.access=i&&a?{has:E,get:i,set:a}:i?{has:E,get:i}:{has:E,set:a}}try{return c(x,s)}finally{d.v=!0}}function e(c,n){if(c.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(c,n){if(typeof c!="function")throw new TypeError(n+" must be a function")}function u(c,n){var h=typeof n;if(c===1){if(h!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(h!=="function"){var l;throw c===0?l="field":c===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function f(c,n,h,l,o,w,p,D,x){var m=h[0],s,d,i;p?o===0||o===1?s={get:h[3],set:h[4]}:o===3?s={get:h[3]}:o===4?s={set:h[3]}:s={value:h[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var a,C,P;if(typeof m=="function")a=t(m,l,s,D,o,w,p,x,i),a!==void 0&&(u(o,a),o===0?d=a:o===1?(d=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a);else for(var E=m.length-1;E>=0;E--){var g=m[E];if(a=t(g,l,s,D,o,w,p,x,i),a!==void 0){u(o,a);var S;o===0?S=a:o===1?(S=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a,S!==void 0&&(d===void 0?d=S:typeof d=="function"?d=[d,S]:d.push(S))}}if(o===0||o===1){if(d===void 0)d=function(M,I){return I};else if(typeof d!="function"){var F=d;d=function(M,I){for(var A=I,L=0;L<F.length;L++)A=F[L].call(M,A);return A}}else{var j=d;d=function(M,I){return j.call(M,I)}}c.push(d)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),p?o===1?(c.push(function(M,I){return i.get.call(M,I)}),c.push(function(M,I){return i.set.call(M,I)})):o===2?c.push(i):c.push(function(M,I){return i.call(M,I)}):Object.defineProperty(n,l,s))}function y(c,n,h){for(var l=[],o,w,p=new Map,D=new Map,x=0;x<n.length;x++){var m=n[x];if(Array.isArray(m)){var s=m[1],d=m[2],i=m.length>3,a=s>=5,C,P;if(a?(C=c,s=s-5,w=w||[],P=w):(C=c.prototype,o=o||[],P=o),s!==0&&!i){var E=a?D:p,g=E.get(d)||0;if(g===!0||g===3&&s!==4||g===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!g&&s>2?E.set(d,s):E.set(d,!0)}f(l,C,m,d,s,a,i,P,h)}}return b(l,o),b(l,w),l}function b(c,n){n&&c.push(function(h){for(var l=0;l<n.length;l++)n[l].call(h);return h})}function T(c,n,h){if(n.length>0){for(var l=[],o=c,w=c.name,p=n.length-1;p>=0;p--){var D={v:!1};try{var x=n[p](o,{kind:"class",name:w,addInitializer:v(l,D),metadata:h})}finally{D.v=!0}x!==void 0&&(u(10,x),o=x)}return[N(o,h),function(){for(var m=0;m<l.length;m++)l[m].call(o)}]}}function N(c,n){return Object.defineProperty(c,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,h,l,o){if(o!==void 0)var w=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var p=Object.create(w===void 0?null:w),D=y(n,h,p);return l.length||N(n,p),{e:D,get c(){return T(n,l,p)}}}}function Tr(v,t,e,r){return(Tr=aa())(v,t,e,r)}var Dr,wr,la;Dr=qt({access:q.Read,targetRestrictions:[Tt]});var xr=class{static{({c:[la,wr]}=Tr(this,[],[Dr]))}constructor(t=O.use(Tt),e=O.use(tt)){let r=new Array,u=t.processorConstructor;do{let f=st.get(u).getMetadata(De.METADATA_USER_EVENT_LISTENER_PROPERIES);if(f)for(let y of f)r.push(y)}while(u=Object.getPrototypeOf(u));this.mEventListenerList=new Array,this.mTargetElement=e;for(let f of r){let[y,b]=f,T=Reflect.get(t.processor,y);T=T.bind(t.processor),this.mEventListenerList.push([b,T]),this.mTargetElement.addEventListener(b,T)}}mEventListenerList;mTargetElement;onDeconstruct(){for(let t of this.mEventListenerList){let[e,r]=t;this.mTargetElement.removeEventListener(e,r)}}static{wr()}};var Er=`:host {\r
    display: block;\r
    width: 100%;\r
    height: 100%;\r
}\r
\r
potatno-code-editor {\r
    display: block;\r
    width: 100%;\r
    height: 100%;\r
}`;var re=class{mProject;constructor(t){this.mProject=t}deserialize(t){let e=new jt(this.mProject),r=[];for(let u of t.functions){let f=this.deserializeFunctionHead(u,e);r.push([f,u]),e.addFunction(f)}for(let[u,f]of r)this.deserializeFunctionBody(u,f,e);return e}deserializeFunctionBody(t,e,r){let u=new Map;for(let f of e.nodes)u.set(f.id,this.deserializeNode(f,t,r));for(let f of e.connections){if(!u.has(f.sourceNodeId)||!u.has(f.targetNodeId))continue;let y=u.get(f.sourceNodeId),b=u.get(f.targetNodeId),T=y.outputs.map.get(f.sourcePortId),N=b.inputs.map.get(f.targetPortId);!T||!N||T.connect(N)}}deserializeFunctionHead(t,e){let r=new Et(this.mProject,e,{definitionId:t.definitionId,id:t.id,label:t.label,isSystem:t.isSystem});for(let u of t.imports)r.addImport(u);for(let u of t.inputs)r.addInput({label:u.label,dataType:u.dataType});for(let u of t.outputs)r.addOutput({label:u.label,dataType:u.dataType});return r}deserializeNode(t,e,r){let u=r.nodeDefinitions.find(y=>y.id===t.definitionId),f=(()=>{if(u)return e.addNodeByDefinition(u,t.transformation);let y=t.ports.filter(T=>T.direction==="input").map(T=>({dataType:T.dataType,definitionId:T.definitionId,label:T.label,portType:T.portType})),b=t.ports.filter(T=>T.direction==="output").map(T=>({dataType:T.dataType,definitionId:T.definitionId,label:T.label,portType:T.portType}));return new Nt(this.mProject,r,e,{definitionId:t.definitionId,ports:{input:y,output:b},label:t.label,transformation:{...t.transformation}})})();f.label=t.label,e.addNode(f);for(let y of t.ports)if(y.portType==="value"&&y.directValue.length>0){let b=f.inputs.map.get(y.definitionId);b&&b.setDirectValue(y.directValue)}return f.preview=t.preview??null,f}};var ne=class{constructor(){}serialize(t){return{functions:[...t.functions].map(e=>this.serializeFunction(e))}}serializeFunction(t){let e=new Map;[...t.nodes].forEach((b,T)=>{e.set(b,`n${T}`)});let r=[...t.nodes].map(b=>this.serializeNode(b,e.get(b))),u=[];for(let b of t.nodes){let T=e.get(b);for(let N of b.outputs.list)for(let c of N.connectedPorts){let n=e.get(c.node);u.push({sourceNodeId:T,sourcePortId:N.definitionId,targetNodeId:n,targetPortId:c.definitionId})}}let f=t.inputs.map(b=>({label:b.label,dataType:b.dataType})),y=t.outputs.map(b=>({label:b.label,dataType:b.dataType}));return{id:t.id,label:t.label,isSystem:t.isSystem,definitionId:t.definitionId,inputs:f,outputs:y,imports:[...t.imports],nodes:r,connections:u}}serializeNode(t,e){let r=[...t.inputs.list,...t.outputs.list].map(f=>({definitionId:f.definitionId,label:f.label,direction:f.direction,portType:f.portType,dataType:f.portType==="value"?f.dataType:null,directValue:[...f.directValue]})),u=t.preview?{portDefinitionId:t.preview.portDefinitionId,displayId:t.preview.displayId}:null;return{id:e,definitionId:t.definitionId,label:t.label,transformation:{...t.transformation},ports:r,preview:u}}};var Ir=`:host {\r
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
}`;var Xe=class v{static PASTE_OFFSET=2;mClipboardNodes;mManager;constructor(t){this.mManager=t,this.mClipboardNodes=new Array}copy(t){if(t.size===0)return;let e=[...t],r=new Map;for(let u=0;u<e.length;u++){let f=e[u],y=f.inputs.value.map(T=>({definitionId:T.definitionId,values:[...T.directValue]})),b={...f.transformation};b.x+=v.PASTE_OFFSET,b.y+=v.PASTE_OFFSET,r.set(f,{connections:new Array,definitionId:f.definitionId,id:u,portDirectValues:y,label:f.label,transformation:b})}for(let[u,f]of r)for(let y of u.outputs.list)for(let b of y.connectedPorts){let T=r.get(b.node);T&&f.connections.push({sourcePortName:y.definitionId,targetNodeId:T.id,targetPortName:b.definitionId})}this.mClipboardNodes=[...r.values()]}paste(){if(this.mClipboardNodes.length===0)return new Array;let t=this.mManager.activeFunction,e=new Map;for(let r of this.mClipboardNodes){let u=t.dynamicNodeDefinitions.find(y=>y.id===r.definitionId);if(!u)continue;let f=this.mManager.graph.addNode(t,u,r.transformation);this.mManager.graph.updateNode(f,y=>{y.label=r.label;for(let b of r.portDirectValues)y.inputs.map.has(b.definitionId)&&y.inputs.map.get(b.definitionId).setDirectValue(b.values)}),e.set(r.id,f)}for(let r of this.mClipboardNodes){let u=e.get(r.id);if(u)for(let f of r.connections){let y=e.get(f.targetNodeId);if(!y)continue;let b=u.outputs.map.get(f.sourcePortName),T=y.inputs.map.get(f.targetPortName);!b||!T||this.mManager.graph.connectPorts(b,T)}}return[...e.values()]}};var He=class extends de{mGridNodeArea;mGridPaths;mNodeArea;mPathArea;constructor(){super(),this.mGridNodeArea=new WeakMap,this.mNodeArea=new Map,this.mGridPaths=new WeakMap,this.mPathArea=new Map}clear(t){t==="all"&&this.mNodeArea.clear(),this.mPathArea.clear()}getPath(t,e){let r=t.direction==="input"&&t.portType==="value"||t.direction==="output"&&t.portType==="flow"?t:e;return this.mGridPaths.get(r)??new Array}removeNodeArea(t){if(!this.mGridNodeArea.has(t))return;let e=this.mGridNodeArea.get(t);for(let r of e){let u=(this.mNodeArea.get(r)??0)-1;u<1?this.mNodeArea.delete(r):this.mNodeArea.set(r,u)}this.mGridNodeArea.delete(t)}updateNodeArea(t){this.removeNodeArea(t);let e=t.transformation.x,r=t.transformation.y,u=t.transformation.width,f=t.transformation.height,y=t.function.nodeDefinitions.find(T=>T.id===t.definitionId);if(y)switch(y.id){case bt.DEFINITION_ID:return;case k.DEFINITION_ID:case Z.DEFINITION_ID:break;default:f+=1,f+=t.preview!==null?7:1}let b=new Array;for(let T=0;T<u;T++)for(let N=0;N<f;N++){let c=`${T+e}|${N+r}`,n=(this.mNodeArea.get(c)??0)+1;this.mNodeArea.set(c,n),b.push(c)}this.mGridNodeArea.set(t,b)}updatePath(t,e,r){if(t.direction==="input"&&t.portType!=="value"||t.direction==="output"&&t.portType!=="flow")throw new _("Start port must be an input-value or an output-flow node.",this);this.removePathArea(t);let u=this.start(e,r);this.mGridPaths.set(t,u.path);let f=this.nodeId(e),y=this.nodeId(r);for(let b of u.path){let T=this.nodeId(b),N=this.mPathArea.has(T)?this.mPathArea.get(T):{ports:new Map,entryPoints:new Set};N.ports.set(t,[f,y]),N.entryPoints.add(f),N.entryPoints.add(y),this.mPathArea.set(T,N)}}costOfTraversal(t,e){let r=this.nodeId(t),u=1;this.mNodeArea.has(r)&&t!==e.endNode&&(u*=20);let f=e.path.next().value;if(this.mPathArea.has(r)){let c=this.mPathArea.get(r),n=this.nodeId(e.startNode),h=this.nodeId(e.endNode);if(c.entryPoints.has(n)||c.entryPoints.has(h))u*=.2;else if(u*=5,f){let l=this.nodeId(f);this.mPathArea.has(l)&&(u*=20)}}if(f){let c=t.y===f.y;(t===e.endNode||f===e.startNode)&&!c&&(u*=100);let n=e.path.next().value;n&&(t.x===n.x||t.y===n.y)&&(u*=.7)}let y=Math.abs(t.x-e.startNode.x),b=Math.abs(t.x-e.endNode.x),T=y<=b;(T&&t.y===e.startNode.y||!T&&t.y===e.endNode.y)&&(u*=.5);let N=e.endNode.x+e.startNode.x>>1;return t.x===N&&(u*=.5),u}heuristic(t,e){return(Math.abs(t.x-e.endNode.x)+Math.abs(t.y-e.endNode.y))*.5}neighborNodes(t){return[{x:t.x,y:t.y-1},{x:t.x-1,y:t.y},{x:t.x+1,y:t.y},{x:t.x,y:t.y+1}]}nodeId(t){return`${t.x}|${t.y}`}removePathArea(t){if(!this.mGridPaths.has(t))return;let e=this.mGridPaths.get(t);for(let r of e){let u=this.nodeId(r),f=this.mPathArea.get(u);if(!f)continue;let y=f.ports.get(t);y&&(f.ports.delete(t),f.entryPoints.delete(y[0]),f.entryPoints.delete(y[1]),f.ports.size===0?this.mPathArea.delete(u):this.mPathArea.set(u,f))}this.mGridPaths.delete(t)}};var Ye=class{mManager;mPathFinder;constructor(t){this.mManager=t,this.mPathFinder=new He;let e=0,r=()=>{e>0&&globalThis.cancelAnimationFrame(e),globalThis.requestAnimationFrame(()=>{this.updatePaths()})};this.mManager.subscribe(R.Node|R.SpecialActiveFunction,u=>{if((u.changeType&R.SpecialActiveFunction)>0){this.mPathFinder.clear("all");for(let f of this.mManager.activeFunction.nodes)this.mPathFinder.updateNodeArea(f);r();return}(u.changeType&R.Node)>0&&((u.changeType&R.NodeDelete)>0?this.mPathFinder.removeNodeArea(u.item):this.mPathFinder.updateNodeArea(u.item)),r()}),this.mManager.subscribe(R.Connection,()=>{r()})}createTemporaryPath(t,e){let r=b=>b instanceof dt?this.getPortGridPoint(b):b,u=r(t),f=r(e),y=this.mPathFinder.start(u,f).path;return{attributeValue:this.createSvgPath(y),length:y.length}}getConnectionPath(t,e){let r=this.mPathFinder.getPath(t,e);return{attributeValue:this.createSvgPath(r),length:r.length-2}}getPortGridPoint(t){let e=t.node,r=t.direction==="input"?e.inputs.list:e.outputs.list,u=(()=>{for(let b=0;b<r.length;b++)if(r[b]===t)return b;return 0})(),f=t.direction==="input"?e.transformation.x:e.transformation.x+e.transformation.width-1,y=1;return(e.definitionId===Z.DEFINITION_ID||e.definitionId===k.DEFINITION_ID)&&(y=0),{y:e.transformation.y+y+u,x:f}}createGridCellPath(t,e,r){let u=this.getGridPosition(t,e),f=this.getGridPosition(t,r),y={x:e==="bottom"||e==="top"?u.x:f.x,y:e==="left"||e==="right"?u.y:f.y};return`Q ${y.x},${y.y} ${f.x},${f.y}`}createPath(t,e){let r=t.direction==="input"&&t.portType==="value"||t.direction==="output"&&t.portType==="flow"?t:e,u=t,f=e;u.direction!=="output"&&([f,u]=[u,f]);let y=this.getPortGridPoint(u),b=this.getPortGridPoint(f);this.mPathFinder.updatePath(r,y,b)}createSvgPath(t){if(t.length<2)return"";let e=(f,y)=>{let b=y.x-f.x,T=y.y-f.y;switch(!0){case(b===0&&T===1):return"bottom";case(b===0&&T===-1):return"top";case(b===-1&&T===0):return"left";case(b===1&&T===0):return"right";default:throw new _("Missformed path. Path points are not directly next to each other.",this)}},r=this.getGridPosition(t[0],e(t[0],t[1])),u=`M ${r.x},${r.y}`;for(let f=1;f<t.length-1;f++){let y=t[f],b=t[f-1],T=t[f+1],N=e(y,b),c=e(y,T);u+=this.createGridCellPath(y,N,c)}return u}getGridPosition(t,e){let r={x:t.x*this.mManager.grid.gridSize+this.mManager.grid.gridSize/2,y:t.y*this.mManager.grid.gridSize+this.mManager.grid.gridSize/2},u=this.mManager.grid.gridSize/2;switch(e){case"top":r.y-=u;break;case"right":r.x+=u;break;case"bottom":r.y+=u;break;case"left":r.x-=u;break}return r}updatePaths(){this.mPathFinder.clear("path");for(let t of this.mManager.activeFunction.nodes){for(let e of t.outputs.flow){let r=e.connectedPorts.values().next().value;r&&this.createPath(e,r)}for(let e of t.inputs.value){let r=e.connectedPorts.values().next().value;r&&this.createPath(e,r)}}}};var We=class{mDocument;mManager;get document(){return this.mDocument}constructor(t){this.mManager=t,this.mDocument=new jt(t.project),this.mDocument.validate()}addFunction(t){let e=this.mDocument;if(!e||!e.project.userFunctions.has(t))return;let r=new Et(e.project,e,{definitionId:t,id:crypto.randomUUID(),isSystem:!1,label:`Function_${e.functions.length}`});e.addFunction(r),e.validate(),this.mManager.dispatch(R.FunctionAdd,r),this.mManager.setActiveFunction(r)}addNode(t,e,r){let u=t.addNodeByDefinition(e,r);return this.mManager.dispatch(R.NodeAdd,u),u}connectConjunction(t,e){let r=t.transformation,u=this.mManager.grid.draggedPort.portPositions.get(this.mManager.grid.draggedPort.ports[0]),f=e.sort((T,N)=>{let c=T.connectedPorts.size===0,n=N.connectedPorts.size===0;if(c!==n)return c?-1:1;let h=u.x>r.x?"input":"output",l=T.direction===h,o=N.direction===h;return l!==o?l?-1:1:0});if(t.inputs.list.length===0||t.outputs.list.length===0)throw new _("Malformed conjunction node",this);let y=t.inputs.list[0],b=t.outputs.list[0];for(let T of f)if(this.connectPorts(T,y)||this.connectPorts(T,b))return}connectPorts(t,e){try{t.connect(e)}catch{return!1}return this.mManager.dispatch(R.ConnectionAdd,t),this.mManager.dispatch(R.ConnectionAdd,e),!0}disconnectPorts(t,e){t.disconnect(e),this.mManager.dispatch(R.ConnectionDelete,t),this.mManager.dispatch(R.ConnectionDelete,e)}removeFunction(t){let e=this.mDocument;if(!e)return;let r=null;for(let u of e.functions)if(u.id===t){r=u,e.removeFunction(u);break}r&&(this.mManager.dispatch(R.FunctionDelete,r),this.setDefaultActiveFunction())}removeNode(t){if(t.definitionId===Z.DEFINITION_ID||t.definitionId===k.DEFINITION_ID){let e=t.inputs.list[0],r=t.outputs.list[0];for(let u of e.connectedPorts)for(let f of r.connectedPorts)this.mManager.graph.connectPorts(u,f)}t.function.removeNode(t),this.mManager.dispatch(R.NodeDelete,t)}setDocument(t){this.mDocument=t,this.mDocument.validate(),this.mManager.dispatch(R.Document,this.mDocument),this.setDefaultActiveFunction()}setPortDirectValue(t,e){t.setDirectValue(e),this.mManager.dispatch(R.NodeUpdate,t.node)}transformNode(t,e){if(!t)return;let r=structuredClone(t.transformation);e(t),!(r.width===t.transformation.width&&r.height===t.transformation.height&&r.x===t.transformation.x&&r.y===t.transformation.y)&&this.mManager.dispatch(R.NodeTransform,t)}updateFunction(t,e){t&&(e(t),this.mManager.dispatch(R.FunctionUpdate,t))}updateNode(t,e){t&&(e(t),this.mManager.dispatch(R.NodeUpdate,t))}setDefaultActiveFunction(){if(!this.mDocument||this.mDocument.functions.length===0)return;let t=(()=>{let e=[...this.mDocument.functions],r=e.find(u=>u.id===this.mManager.activeFunction.id);return r||e[0]})();this.mManager.activeFunction!==t&&this.mManager.setActiveFunction(t)}};var Ze=class v{static GRID_SIZE=24;static MAX_ZOOM=5;static MIN_ZOOM=.1;mDraggedPortInformation;mGridElement;mGridPositions;mManager;mSelectedNodes;mTransformation;get draggedPort(){return this.mDraggedPortInformation}set gridElement(t){this.mGridElement=t}get gridSize(){return v.GRID_SIZE}get panX(){return this.mTransformation.panX}get panY(){return this.mTransformation.panY}get selectedNodes(){return this.mSelectedNodes}get zoom(){return this.mTransformation.zoom}constructor(t){this.mManager=t,this.mGridElement=null,this.mDraggedPortInformation=new qe(this.mManager,[]),this.mGridPositions=new WeakMap,this.mSelectedNodes=new Set,this.mTransformation={panX:0,panY:0,zoom:1},this.mManager.subscribe(R.SpecialActiveFunction,()=>{this.mGridPositions.has(this.mManager.activeFunction)||this.mGridPositions.set(this.mManager.activeFunction,{panX:0,panY:0,zoom:1}),this.mTransformation=this.mGridPositions.get(this.mManager.activeFunction);let e=Array.from(this.mSelectedNodes).filter(r=>r.function!==this.mManager.activeFunction);for(let r of e)this.mSelectedNodes.delete(r)})}gridPixelSpaceToGridSpace(t,e){let r=t.x/this.gridSize,u=t.y/this.gridSize;return e&&(r=Math.floor(r),u=Math.floor(u)),{x:r,y:u}}pan(t,e){this.mTransformation.panX+=t,this.mTransformation.panY+=e,this.mManager.dispatch(R.SpecialGrid,null)}pixelToGridPixelSpace(t,e){let r=t,u=e;if(this.mGridElement){let f=this.mGridElement.getBoundingClientRect();r-=f.left,u-=f.top}return{x:(r-this.mTransformation.panX)/this.mTransformation.zoom,y:(u-this.mTransformation.panY)/this.mTransformation.zoom}}pixelToGridSpace(t,e){return this.gridPixelSpaceToGridSpace(this.pixelToGridPixelSpace(t,e),!0)}selectNodes(t,e=!1){if(this.mSelectedNodes.clear(),t.length===0){this.mManager.dispatch(R.SpecialSelectNode,null);return}let r=null;for(let u of t){if(r===null&&(r=u.function),r!==u.function)throw new _("Selected nodes must be of the same function",this);this.mSelectedNodes.add(u)}if(this.mManager.activeFunction!==r&&this.mManager.setActiveFunction(r),e){let u={top:1/0,right:-1/0,bottom:-1/0,left:1/0};for(let b of t){let T=b.transformation.y;T<u.top&&(u.top=T);let N=b.transformation.x+b.transformation.width;N>u.right&&(u.right=N);let c=b.transformation.y+b.transformation.height;c>u.bottom&&(u.bottom=c);let n=b.transformation.x;n<u.left&&(u.left=n)}this.mGridPositions.has(r)||this.mGridPositions.set(r,{panX:0,panY:0,zoom:1});let f=this.mGridPositions.get(r),y=this.mGridElement?.getBoundingClientRect();if(!y)return;f.panX=y.width/2,f.panX-=(u.left+(u.right-u.left)/2)*this.gridSize*f.zoom,f.panY=y.height/2,f.panY-=(u.top+(u.bottom-u.top)/2)*this.gridSize*f.zoom}this.mManager.dispatch(R.SpecialSelectNode,null)}setDraggingPort(t){this.mDraggedPortInformation=new qe(this.mManager,t)}zoomAt(t,e,r){let u=this.mTransformation.zoom,f=1+r,y=this.mTransformation.zoom*f;y=Math.max(v.MIN_ZOOM,Math.min(v.MAX_ZOOM,y));let b=(t-this.mTransformation.panX)/u,T=(e-this.mTransformation.panY)/u;this.mTransformation.zoom=y,this.mTransformation.panX=t-b*this.mTransformation.zoom,this.mTransformation.panY=e-T*this.mTransformation.zoom,this.mManager.dispatch(R.SpecialGrid,null)}},qe=class{mManager;mPointerGridPosition;mPortPositions;mPorts;get isDragging(){return this.mPorts.size>0}get portPositions(){return this.mPortPositions}get ports(){return[...this.mPorts]}constructor(t,e){this.mManager=t,this.mPorts=new Set(e),this.mPointerGridPosition={x:1/0,y:1/0},this.mPortPositions=new Map;for(let r of e){let u=this.mManager.connections.getPortGridPoint(r);r.direction==="output"&&(u.x+=1),this.mPortPositions.set(r,{x:u.x,y:u.y})}}hasPort(t){return t?this.mPorts.has(t):!1}updatePointer(t,e){let r=this.mManager.grid.pixelToGridSpace(t,e);return r.x===this.mPointerGridPosition.x&&r.y===this.mPointerGridPosition.y?!1:(this.mPointerGridPosition.x=r.x,this.mPointerGridPosition.y=r.y,!0)}};var Je=class v{static MAX_HISTORY_ITEMS=100;mManager;mSnapshotIndex;mSnapshots;get canRedo(){return this.mSnapshotIndex<this.mSnapshots.length-1}get canUndo(){return this.mSnapshotIndex>0}constructor(t){this.mManager=t,this.mSnapshotIndex=-1,this.mSnapshots=new Array;let e=0;this.mManager.subscribe(R.Any,()=>{globalThis.clearTimeout(e),e=globalThis.setTimeout(()=>{this.pushHistory()},300)})}clear(){this.mSnapshots.length=0,this.mSnapshotIndex=-1}redo(){if(!this.canRedo)return;let t=this.mSnapshots[++this.mSnapshotIndex],e=JSON.parse(t);this.restoreHistory(e)}undo(){if(!this.canUndo)return;let t=this.mSnapshots[--this.mSnapshotIndex],e=JSON.parse(t);this.restoreHistory(e)}pushHistory(){let t=new ne().serialize(this.mManager.graph.document),e=JSON.stringify(t);this.mSnapshotIndex>=0&&this.mSnapshots[this.mSnapshotIndex]===e||(this.mSnapshots.splice(this.mSnapshotIndex+1),this.mSnapshotIndex=this.mSnapshots.push(e)-1,this.mSnapshots.length>v.MAX_HISTORY_ITEMS&&(this.mSnapshots.shift(),this.mSnapshotIndex--))}restoreHistory(t){this.mManager.graph.setDocument(new re(this.mManager.project).deserialize(t))}};var Ke=class{mErrorItems;mErrorList;mIsDirty;mManager;get errorItems(){return this.mIsDirty&&this.revalidate(),this.mErrorItems}get errors(){return this.mIsDirty&&this.revalidate(),this.mErrorList}get isValid(){return this.mIsDirty&&this.revalidate(),this.mErrorItems.size===0}constructor(t){this.mManager=t,this.mErrorList=new Array,this.mErrorItems=new Set,this.mIsDirty=!0;let e=0,r=R.Connection|R.Document|R.Function|R.NodeAdd|R.NodeUpdate|R.NodeDelete|R.Port;this.mManager.subscribe(r,()=>{this.mIsDirty=!0,globalThis.clearTimeout(e),e=globalThis.setTimeout(()=>{this.mIsDirty&&(this.revalidate(),this.mIsDirty=!1)},1e3)})}revalidate(){this.mIsDirty=!1,this.mErrorList.splice(0,this.mErrorList.length),this.mErrorItems.clear();let t=this.mManager.graph.document.validate();for(let e of t.errors)switch(this.mErrorItems.add(e.item),!0){case e.item instanceof dt:{this.mErrorList.push({location:e.item.node,message:e.message});break}case e.item instanceof Nt:{this.mErrorList.push({location:e.item,message:e.message});break}}for(let e of t.affectedItems)switch(!0){case e instanceof dt:{this.mManager.dispatch(R.PortAdd|R.PortUpdate,e),this.mManager.dispatch(R.NodeUpdate,e.node);break}case e instanceof Nt:{this.mManager.dispatch(R.NodeAdd|R.NodeUpdate|R.NodeTransform,e);break}case e instanceof Et:{this.mManager.dispatch(R.FunctionAdd|R.FunctionUpdate,e);break}}this.mManager.dispatch(R.SpecialValidation,null)}};var Qe=class{mDriverElementBigEnough;mDriverElementVisible;mDriverElements;mDriverList;mDrivers;mElementDriver;mManager;mPreviewIntersection;constructor(t){this.mManager=t,this.mDriverList=new Array,this.mDrivers=new WeakMap,this.mDriverElementVisible=new WeakMap,this.mDriverElementBigEnough=new WeakMap,this.mDriverElements=new WeakMap,this.mElementDriver=new WeakMap,this.mManager.subscribe(R.Document,()=>{this.mDriverList.splice(0,this.mDriverList.length)});let e=0,r=R.Connection|R.Function|R.NodeAdd|R.NodeDelete|R.NodeUpdate;this.mManager.subscribe(r,()=>{globalThis.clearTimeout(e),e=globalThis.setTimeout(()=>this.refresh(),1e3)});let u=0;this.mManager.subscribe(R.SpecialGrid,()=>{globalThis.clearTimeout(u),u=globalThis.setTimeout(()=>{for(let f of this.mDriverList){let y=f.deref();if(!y)continue;let b=y.element.getBoundingClientRect();this.mDriverElementBigEnough.set(y,!(b.width<30||b.height<30))}},300)}),this.mPreviewIntersection=new IntersectionObserver(f=>{for(let y of f){let b=this.mElementDriver.get(y.target);if(!b)continue;let T=b.deref();T&&this.mDriverElementVisible.set(T,y.isIntersecting)}})}execute(){for(let t of this.mDriverList){let e=t.deref();if(e&&this.mDriverElementVisible.get(e)!==!1&&this.mDriverElementBigEnough.get(e)!==!1)try{e.execute()}catch(r){console.error("[PotatnoUiManagerPreview] Driver render failed:",r)}}}refresh(){if(this.mManager.integrity.isValid)for(let t=this.mDriverList.length-1;t>=0;t--){let e=this.mDriverList[t].deref();if(!e){this.unregister(this.mDriverList[t]);continue}e.refresh()}}requestDriver(t,e){let r=this.mDrivers.get(t);if(r&&r.display.id===e)return r;r&&this.unregister(this.mElementDriver.get(r.element));let u=t.project.preview.getDisplay(e);if(!u)throw new _(`Preview has no display for "${e}".`,this);let f=u.createDriver(t);return this.register(t,f),this.mManager.integrity.isValid&&f.refresh(),f}register(t,e){this.mDrivers.set(t,e);let r=new WeakRef(e);this.mDriverList.push(r);let u=e.element;this.mDriverElements.set(r,u),this.mElementDriver.set(u,r),this.mPreviewIntersection.observe(u)}unregister(t){let e=this.mDriverList.indexOf(t);if(e===-1)return;this.mDriverList.splice(e,1);let r=this.mDriverElements.get(t);r&&this.mPreviewIntersection.unobserve(r)}};var H=class extends EventTarget{mActiveFunction;mClipboard;mConnections;mEventBuffer;mEventBufferDispatchRequest;mGraph;mGrid;mHistory;mIntegrity;mPreview;mProject;get activeFunction(){return this.mActiveFunction}get clipboard(){return this.mClipboard}get connections(){return this.mConnections}get graph(){return this.mGraph}get grid(){return this.mGrid}get history(){return this.mHistory}get integrity(){return this.mIntegrity}get preview(){return this.mPreview}get project(){return this.mProject}constructor(t){super(),this.mProject=t,this.mEventBuffer=new Map,this.mEventBufferDispatchRequest=-1,this.mIntegrity=new Ke(this),this.mConnections=new Ye(this),this.mHistory=new Je(this),this.mPreview=new Qe(this),this.mGrid=new Ze(this),this.mClipboard=new Xe(this),this.mGraph=new We(this),this.mActiveFunction=this.mGraph.document.functions.at(0)}dispatch(t,e){let r=this.mEventBuffer.get(e)??0;this.mEventBuffer.set(e,r|t),this.mEventBufferDispatchRequest!==-1&&globalThis.cancelAnimationFrame(this.mEventBufferDispatchRequest),this.mEventBufferDispatchRequest=requestAnimationFrame(()=>{this.mEventBufferDispatchRequest=-1;for(let[u,f]of this.mEventBuffer)this.dispatchEvent(new Pe(f,u));this.mEventBuffer.clear()})}generateStringColor(t){let e=(()=>{let u=0;for(let f=0;f<t.length;f++)u=t.charCodeAt(f)+((u<<5)-u);return u})();return`hsl(${Math.abs(e)*137.508%360}, 70%, 60%)`}setActiveFunction(t){this.mGraph.document.functions.find(r=>r===t)&&(this.mActiveFunction=t,this.dispatch(R.SpecialActiveFunction,t))}subscribe(t,e){let r=u=>{t!==R.Any&&(u.changeType&t)===0||e(u)};return this.addEventListener(Pe.EVENT_TYPE,r),()=>{this.removeEventListener(Pe.EVENT_TYPE,r)}}},R={Any:16777215,Connection:15,ConnectionAdd:1,ConnectionUpdate:2,ConnectionDelete:4,Document:240,Function:3840,FunctionAdd:256,FunctionUpdate:512,FunctionDelete:1024,Node:61440,NodeAdd:4096,NodeUpdate:8192,NodeDelete:16384,NodeTransform:32768,Port:983040,PortAdd:65536,PortUpdate:131072,PortDelete:262144,Special:15728640,SpecialActiveFunction:1048576,SpecialGrid:2097152,SpecialValidation:4194304,SpecialSelectNode:8388608},Pe=class v extends Event{static EVENT_TYPE="PotatnoUiManagerChangeEvent";mChangeType;mEventItem;get changeType(){return this.mChangeType}get item(){return this.mEventItem}constructor(t,e){super(v.EVENT_TYPE),this.mChangeType=t,this.mEventItem=e}};var Cr=`:host {
    /* Sized to the icon only. Left unpositioned so it can be placed freely
       (e.g. position: absolute) from the outside without being forced to. */
    display: inline-block;

    --information-icon-color: red;
    --information-icon-background-color: red;

    --information-background-color: red;
    --information-border-color: red;
    --information-shadow-color: red;
}

.icon {
    /* Anchor for the information panel positioning. */
    anchor-name: --kg-information-anchor;

    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;

    /* Round "i" badge. */
    width: 16px;
    height: 16px;
    background-color: var(--information-icon-background-color);
    border: 1px solid var(--information-icon-color);
    border-radius: 50%;

    color: var(--information-icon-color);
    
    /* Shitty "i" as icon. Needs a fixed font family. */
    font-family: Georgia, 'Times New Roman', serif;
    font-style: italic;
    font-weight: bold;
    font-size: 11px;
    line-height: 1;

    user-select: none;
    cursor: help;

    /* Half visible until hovered. */
    opacity: 0.5;
    transition: opacity 0.15s ease-in-out;
}

:host(:hover) .icon {
    opacity: 1;
}

.information {
    /* Anchored to the icon. */
    position: absolute;
    position-anchor: --kg-information-anchor;

    /* Default placement: bottom right of the icon. */
    top: calc(anchor(bottom) + 10px);
    left: calc(anchor(left) + 10px);

    /* Reposition into whichever space is available. */
    position-try-fallbacks: --kg-information-bottom-left, --kg-information-top-right, --kg-information-top-left;

    z-index: 1;

    flex-direction: column;
    box-sizing: border-box;
    width: max-content;
    max-width: 320px;
    padding: 8px;

    border: 1px solid var(--potatno-color-border);
    border-radius: 2px;

    box-shadow: 0 10px 30px var(--potatno-color-shadow);
    background-color: var(--information-background-color);
    color: var(--potatno-color-text);
    overflow: hidden;

    /* Hidden until the component is hovered. */
    display: none;

    /* Animation properties (same as kg-popup). */
    transition: opacity 0.15s ease-in-out, translate 0.15s ease-in-out, display 0.15s allow-discrete;
    opacity: 0;
    translate: 0px -10px;
}

:host(:hover) .information {
    display: flex;
    opacity: 1;
    translate: 0px 0px;

    /* Animate from hidden and slightly above. */
    @starting-style {
        opacity: 0;
        translate: 0px -10px;
    }
}

/* Bottom left: below the icon, extending to the left. */
@position-try --kg-information-bottom-left {
    top: calc(anchor(bottom) + 10px);
    right: calc(anchor(right) + 10px);
    bottom: auto;
    left: auto;
}

/* Top right: above the icon, extending to the right. */
@position-try --kg-information-top-right {
    top: auto;
    right: auto;
    bottom: calc(anchor(top) + 10px);
    left: calc(anchor(left) + 10px);
}

/* Top left: above the icon, extending to the left. */
@position-try --kg-information-top-left {
    top: auto;
    right: calc(anchor(right) + 10px);
    bottom: calc(anchor(top) + 10px);
    left: auto;
}`;var Pr=`<div class="icon">i</div>
<div class="information">
    $slot
</div>
`;function fa(){function v(c,n){return function(l){e(n,"addInitializer"),r(l,"An initializer"),c.push(l)}}function t(c,n,h,l,o,w,p,D,x){var m;switch(o){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var s={kind:m,name:p?"#"+n:n,static:w,private:p,metadata:D},d={v:!1};s.addInitializer=v(l,d);var i,a;if(o===0?p?(i=h.get,a=h.set):(i=function(){return this[n]},a=function(g){this[n]=g}):o===2?i=function(){return h.value}:((o===1||o===3)&&(i=function(){return h.get.call(this)}),(o===1||o===4)&&(a=function(g){h.set.call(this,g)})),p)s.access=i&&a?{get:i,set:a}:i?{get:i}:{set:a};else{if(i){var C=i;i=function(g){return arguments.length===0&&(g=this),C.call(g)}}if(a){var P=a;a=function(g,S){return arguments.length===1&&(S=g,g=this),P.call(g,S)}}var E=function(g){return n in g};s.access=i&&a?{has:E,get:i,set:a}:i?{has:E,get:i}:{has:E,set:a}}try{return c(x,s)}finally{d.v=!0}}function e(c,n){if(c.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(c,n){if(typeof c!="function")throw new TypeError(n+" must be a function")}function u(c,n){var h=typeof n;if(c===1){if(h!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(h!=="function"){var l;throw c===0?l="field":c===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function f(c,n,h,l,o,w,p,D,x){var m=h[0],s,d,i;p?o===0||o===1?s={get:h[3],set:h[4]}:o===3?s={get:h[3]}:o===4?s={set:h[3]}:s={value:h[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var a,C,P;if(typeof m=="function")a=t(m,l,s,D,o,w,p,x,i),a!==void 0&&(u(o,a),o===0?d=a:o===1?(d=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a);else for(var E=m.length-1;E>=0;E--){var g=m[E];if(a=t(g,l,s,D,o,w,p,x,i),a!==void 0){u(o,a);var S;o===0?S=a:o===1?(S=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a,S!==void 0&&(d===void 0?d=S:typeof d=="function"?d=[d,S]:d.push(S))}}if(o===0||o===1){if(d===void 0)d=function(M,I){return I};else if(typeof d!="function"){var F=d;d=function(M,I){for(var A=I,L=0;L<F.length;L++)A=F[L].call(M,A);return A}}else{var j=d;d=function(M,I){return j.call(M,I)}}c.push(d)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),p?o===1?(c.push(function(M,I){return i.get.call(M,I)}),c.push(function(M,I){return i.set.call(M,I)})):o===2?c.push(i):c.push(function(M,I){return i.call(M,I)}):Object.defineProperty(n,l,s))}function y(c,n,h){for(var l=[],o,w,p=new Map,D=new Map,x=0;x<n.length;x++){var m=n[x];if(Array.isArray(m)){var s=m[1],d=m[2],i=m.length>3,a=s>=5,C,P;if(a?(C=c,s=s-5,w=w||[],P=w):(C=c.prototype,o=o||[],P=o),s!==0&&!i){var E=a?D:p,g=E.get(d)||0;if(g===!0||g===3&&s!==4||g===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!g&&s>2?E.set(d,s):E.set(d,!0)}f(l,C,m,d,s,a,i,P,h)}}return b(l,o),b(l,w),l}function b(c,n){n&&c.push(function(h){for(var l=0;l<n.length;l++)n[l].call(h);return h})}function T(c,n,h){if(n.length>0){for(var l=[],o=c,w=c.name,p=n.length-1;p>=0;p--){var D={v:!1};try{var x=n[p](o,{kind:"class",name:w,addInitializer:v(l,D),metadata:h})}finally{D.v=!0}x!==void 0&&(u(10,x),o=x)}return[N(o,h),function(){for(var m=0;m<l.length;m++)l[m].call(o)}]}}function N(c,n){return Object.defineProperty(c,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,h,l,o){if(o!==void 0)var w=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var p=Object.create(w===void 0?null:w),D=y(n,h,p);return l.length||N(n,p),{e:D,get c(){return T(n,l,p)}}}}function Nr(v,t,e,r){return(Nr=fa())(v,t,e,r)}var _r,Mr,Ar;_r=B({selector:"kg-information",template:Pr,style:Cr});var Sr=class{static{({c:[Ar,Mr]}=Nr(this,[],[_r]))}static{Mr()}};var Lr=`:host {\r
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
}`;var Rr=`<div class="popup">\r
    $slot\r
</div>\r
`;function ga(){function v(c,n){return function(l){e(n,"addInitializer"),r(l,"An initializer"),c.push(l)}}function t(c,n,h,l,o,w,p,D,x){var m;switch(o){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var s={kind:m,name:p?"#"+n:n,static:w,private:p,metadata:D},d={v:!1};s.addInitializer=v(l,d);var i,a;if(o===0?p?(i=h.get,a=h.set):(i=function(){return this[n]},a=function(g){this[n]=g}):o===2?i=function(){return h.value}:((o===1||o===3)&&(i=function(){return h.get.call(this)}),(o===1||o===4)&&(a=function(g){h.set.call(this,g)})),p)s.access=i&&a?{get:i,set:a}:i?{get:i}:{set:a};else{if(i){var C=i;i=function(g){return arguments.length===0&&(g=this),C.call(g)}}if(a){var P=a;a=function(g,S){return arguments.length===1&&(S=g,g=this),P.call(g,S)}}var E=function(g){return n in g};s.access=i&&a?{has:E,get:i,set:a}:i?{has:E,get:i}:{has:E,set:a}}try{return c(x,s)}finally{d.v=!0}}function e(c,n){if(c.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(c,n){if(typeof c!="function")throw new TypeError(n+" must be a function")}function u(c,n){var h=typeof n;if(c===1){if(h!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(h!=="function"){var l;throw c===0?l="field":c===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function f(c,n,h,l,o,w,p,D,x){var m=h[0],s,d,i;p?o===0||o===1?s={get:h[3],set:h[4]}:o===3?s={get:h[3]}:o===4?s={set:h[3]}:s={value:h[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var a,C,P;if(typeof m=="function")a=t(m,l,s,D,o,w,p,x,i),a!==void 0&&(u(o,a),o===0?d=a:o===1?(d=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a);else for(var E=m.length-1;E>=0;E--){var g=m[E];if(a=t(g,l,s,D,o,w,p,x,i),a!==void 0){u(o,a);var S;o===0?S=a:o===1?(S=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a,S!==void 0&&(d===void 0?d=S:typeof d=="function"?d=[d,S]:d.push(S))}}if(o===0||o===1){if(d===void 0)d=function(M,I){return I};else if(typeof d!="function"){var F=d;d=function(M,I){for(var A=I,L=0;L<F.length;L++)A=F[L].call(M,A);return A}}else{var j=d;d=function(M,I){return j.call(M,I)}}c.push(d)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),p?o===1?(c.push(function(M,I){return i.get.call(M,I)}),c.push(function(M,I){return i.set.call(M,I)})):o===2?c.push(i):c.push(function(M,I){return i.call(M,I)}):Object.defineProperty(n,l,s))}function y(c,n,h){for(var l=[],o,w,p=new Map,D=new Map,x=0;x<n.length;x++){var m=n[x];if(Array.isArray(m)){var s=m[1],d=m[2],i=m.length>3,a=s>=5,C,P;if(a?(C=c,s=s-5,w=w||[],P=w):(C=c.prototype,o=o||[],P=o),s!==0&&!i){var E=a?D:p,g=E.get(d)||0;if(g===!0||g===3&&s!==4||g===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!g&&s>2?E.set(d,s):E.set(d,!0)}f(l,C,m,d,s,a,i,P,h)}}return b(l,o),b(l,w),l}function b(c,n){n&&c.push(function(h){for(var l=0;l<n.length;l++)n[l].call(h);return h})}function T(c,n,h){if(n.length>0){for(var l=[],o=c,w=c.name,p=n.length-1;p>=0;p--){var D={v:!1};try{var x=n[p](o,{kind:"class",name:w,addInitializer:v(l,D),metadata:h})}finally{D.v=!0}x!==void 0&&(u(10,x),o=x)}return[N(o,h),function(){for(var m=0;m<l.length;m++)l[m].call(o)}]}}function N(c,n){return Object.defineProperty(c,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,h,l,o){if(o!==void 0)var w=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var p=Object.create(w===void 0?null:w),D=y(n,h,p);return l.length||N(n,p),{e:D,get c(){return T(n,l,p)}}}}function zr(v,t,e,r){return(zr=ga())(v,t,e,r)}var jr,Or,ie;jr=B({selector:"kg-popup",template:Rr,style:Lr});var Fr=class{static{({c:[ie,Or]}=zr(this,[],[jr]))}static{Or()}};var Vr=`:host {\r
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
}`;var $r=`<div class="resize-layer {{this.snap > 1 ? 'snap' : ''}}" style="width: {{this.transformation.width}}px; height: {{this.transformation.height}}px;">\r
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
`;function ba(){function v(c,n){return function(l){e(n,"addInitializer"),r(l,"An initializer"),c.push(l)}}function t(c,n,h,l,o,w,p,D,x){var m;switch(o){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var s={kind:m,name:p?"#"+n:n,static:w,private:p,metadata:D},d={v:!1};s.addInitializer=v(l,d);var i,a;if(o===0?p?(i=h.get,a=h.set):(i=function(){return this[n]},a=function(g){this[n]=g}):o===2?i=function(){return h.value}:((o===1||o===3)&&(i=function(){return h.get.call(this)}),(o===1||o===4)&&(a=function(g){h.set.call(this,g)})),p)s.access=i&&a?{get:i,set:a}:i?{get:i}:{set:a};else{if(i){var C=i;i=function(g){return arguments.length===0&&(g=this),C.call(g)}}if(a){var P=a;a=function(g,S){return arguments.length===1&&(S=g,g=this),P.call(g,S)}}var E=function(g){return n in g};s.access=i&&a?{has:E,get:i,set:a}:i?{has:E,get:i}:{has:E,set:a}}try{return c(x,s)}finally{d.v=!0}}function e(c,n){if(c.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(c,n){if(typeof c!="function")throw new TypeError(n+" must be a function")}function u(c,n){var h=typeof n;if(c===1){if(h!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(h!=="function"){var l;throw c===0?l="field":c===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function f(c,n,h,l,o,w,p,D,x){var m=h[0],s,d,i;p?o===0||o===1?s={get:h[3],set:h[4]}:o===3?s={get:h[3]}:o===4?s={set:h[3]}:s={value:h[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var a,C,P;if(typeof m=="function")a=t(m,l,s,D,o,w,p,x,i),a!==void 0&&(u(o,a),o===0?d=a:o===1?(d=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a);else for(var E=m.length-1;E>=0;E--){var g=m[E];if(a=t(g,l,s,D,o,w,p,x,i),a!==void 0){u(o,a);var S;o===0?S=a:o===1?(S=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a,S!==void 0&&(d===void 0?d=S:typeof d=="function"?d=[d,S]:d.push(S))}}if(o===0||o===1){if(d===void 0)d=function(M,I){return I};else if(typeof d!="function"){var F=d;d=function(M,I){for(var A=I,L=0;L<F.length;L++)A=F[L].call(M,A);return A}}else{var j=d;d=function(M,I){return j.call(M,I)}}c.push(d)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),p?o===1?(c.push(function(M,I){return i.get.call(M,I)}),c.push(function(M,I){return i.set.call(M,I)})):o===2?c.push(i):c.push(function(M,I){return i.call(M,I)}):Object.defineProperty(n,l,s))}function y(c,n,h){for(var l=[],o,w,p=new Map,D=new Map,x=0;x<n.length;x++){var m=n[x];if(Array.isArray(m)){var s=m[1],d=m[2],i=m.length>3,a=s>=5,C,P;if(a?(C=c,s=s-5,w=w||[],P=w):(C=c.prototype,o=o||[],P=o),s!==0&&!i){var E=a?D:p,g=E.get(d)||0;if(g===!0||g===3&&s!==4||g===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!g&&s>2?E.set(d,s):E.set(d,!0)}f(l,C,m,d,s,a,i,P,h)}}return b(l,o),b(l,w),l}function b(c,n){n&&c.push(function(h){for(var l=0;l<n.length;l++)n[l].call(h);return h})}function T(c,n,h){if(n.length>0){for(var l=[],o=c,w=c.name,p=n.length-1;p>=0;p--){var D={v:!1};try{var x=n[p](o,{kind:"class",name:w,addInitializer:v(l,D),metadata:h})}finally{D.v=!0}x!==void 0&&(u(10,x),o=x)}return[N(o,h),function(){for(var m=0;m<l.length;m++)l[m].call(o)}]}}function N(c,n){return Object.defineProperty(c,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,h,l,o){if(o!==void 0)var w=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var p=Object.create(w===void 0?null:w),D=y(n,h,p);return l.length||N(n,p),{e:D,get c(){return T(n,l,p)}}}}function Zr(v,t,e,r){return(Zr=ba())(v,t,e,r)}var qr,Gr,Jr,Kr,Qr,kr,Br,Ur,Xr,Hr,Yr,Pt;qr=B({selector:"kg-resize-box",template:$r,style:Vr}),Jr=$.state({proxy:!0}),Kr=pt("resize"),Qr=pt("resize-end"),kr=$.state({proxy:!0});var Wr=class{static{({e:[Br,Ur,Xr,Hr,Yr],c:[Pt,Gr]}=Zr(this,[[Jr,1,"mConfiguration"],[Kr,1,"mResize"],[Qr,1,"mResizeEnd"],[kr,1,"transformation"],[W,3,"bottom"],[W,3,"height"],[W,3,"left"],[W,3,"right"],[W,3,"snap"],[W,3,"top"],[W,3,"virtual"],[W,3,"width"]],[qr]))}constructor(t=O.use(G)){this.mComponentElement=t.element,this.transformation={width:NaN,height:NaN},this.mConfiguration={snap:1,isVirtual:!1,enabledDirections:{top:!1,right:!1,bottom:!1,left:!1}}}mComponentElement;#t=(Yr(this),Br(this));get mConfiguration(){return this.#t}set mConfiguration(t){this.#t=t}#e=Ur(this);get mResize(){return this.#e}set mResize(t){this.#e=t}#o=Xr(this);get mResizeEnd(){return this.#o}set mResizeEnd(t){this.#o=t}#r=Hr(this);get transformation(){return this.#r}set transformation(t){this.#r=t}get bottom(){return this.mConfiguration.enabledDirections.bottom}set bottom(t){this.mConfiguration.enabledDirections.bottom=this.parseBoolean(t)}get height(){return this.transformation.height}set height(t){this.updateComponentHeight(t,!0)}get left(){return this.mConfiguration.enabledDirections.left}set left(t){this.mConfiguration.enabledDirections.left=this.parseBoolean(t)}get right(){return this.mConfiguration.enabledDirections.right}set right(t){this.mConfiguration.enabledDirections.right=this.parseBoolean(t)}get snap(){return this.mConfiguration.snap}set snap(t){this.mConfiguration.snap=parseInt(t.toString())}get top(){return this.mConfiguration.enabledDirections.top}set top(t){this.mConfiguration.enabledDirections.top=this.parseBoolean(t)}get virtual(){return this.mConfiguration.isVirtual}set virtual(t){this.mConfiguration.isVirtual=this.parseBoolean(t)}get width(){return this.transformation.width}set width(t){this.updateComponentWidth(t,!0)}resizeCorner(t){this.handleResize(t,"both")}resizeHorizontal(t){this.handleResize(t,"horizontal")}resizeVertical(t){this.handleResize(t,"vertical")}applyComponentSize(t,e,r){let u=this.updateComponentWidth(e,!1),f=this.updateComponentHeight(r,!1);return(u!==this.transformation.width||f!==this.transformation.height)&&this.mResize.dispatchEvent(this.createResizeEvent(t,u,f,this.transformation.width,this.transformation.height)),[u,f]}createResizeEvent(t,e,r,u,f){let y=t;return e===u&&(y&=~(vt.right|vt.left)),r===f&&(y&=~(vt.top|vt.bottom)),new ke(e,r,y)}handleResize(t,e){t.preventDefault(),t.stopPropagation();let r=this.mComponentElement.getBoundingClientRect(),u=this.mComponentElement.offsetWidth?r.width/this.mComponentElement.offsetWidth:1,f=this.mComponentElement.offsetHeight?r.height/this.mComponentElement.offsetHeight:1,y=r.width/u,b=r.height/f,T=t.clientX,N=t.clientY,c=1;Math.abs(T-r.left)<Math.abs(T-r.right)&&(c=-1);let n=1;Math.abs(N-r.top)<Math.abs(N-r.bottom)&&(n=-1);let h=0;h+=c===1?vt.right:vt.left,h+=n===1?vt.bottom:vt.top;let l=y,o=b,w=D=>{let x=(D.clientX-T)/u*c,m=(D.clientY-N)/f*n,s=y+x,d=b+m;e==="horizontal"&&(s=y),e==="vertical"&&(d=b),[l,o]=this.applyComponentSize(h,s,d)},p=()=>{document.removeEventListener("pointermove",w),document.removeEventListener("pointerup",p),(l!==y||o!==b)&&this.mResizeEnd.dispatchEvent(this.createResizeEvent(h,l,o,y,b))};document.addEventListener("pointermove",w),document.addEventListener("pointerup",p)}parseBoolean(t){return!!(()=>{if(typeof t=="string"){let r=t.toLowerCase();if(["true","false"].includes(r))return r==="true"}return t})()}updateComponentHeight(t,e){if(!this.mConfiguration.enabledDirections.top&&!this.mConfiguration.enabledDirections.bottom)return this.transformation.height;t=Math.max(1,t);let r=Math.ceil(Math.abs(t)/this.mConfiguration.snap)*this.mConfiguration.snap*(t/Math.abs(t));return r=Math.max(0,r),(!this.mConfiguration.isVirtual||e)&&(this.transformation.height=r),r}updateComponentWidth(t,e){if(!this.mConfiguration.enabledDirections.left&&!this.mConfiguration.enabledDirections.right)return this.transformation.height;t=Math.max(1,t);let r=Math.ceil(Math.abs(t)/this.mConfiguration.snap)*this.mConfiguration.snap*(t/Math.abs(t));return r=Math.max(0,r),(!this.mConfiguration.isVirtual||e)&&(this.transformation.width=r),r}static{Gr()}},ke=class{mHeight;mResizeHandle;mWidth;get height(){return this.mHeight}get resizeHandle(){return this.mResizeHandle}get width(){return this.mWidth}constructor(t,e,r){this.mHeight=e,this.mResizeHandle=r,this.mWidth=t}},vt={top:1,right:2,bottom:4,left:8};var tn=`:host {\r
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
}`;var en=`<kg-resize-box class="resize-box" right="true" width="250">\r
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
`;function Ta(){function v(c,n){return function(l){e(n,"addInitializer"),r(l,"An initializer"),c.push(l)}}function t(c,n,h,l,o,w,p,D,x){var m;switch(o){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var s={kind:m,name:p?"#"+n:n,static:w,private:p,metadata:D},d={v:!1};s.addInitializer=v(l,d);var i,a;if(o===0?p?(i=h.get,a=h.set):(i=function(){return this[n]},a=function(g){this[n]=g}):o===2?i=function(){return h.value}:((o===1||o===3)&&(i=function(){return h.get.call(this)}),(o===1||o===4)&&(a=function(g){h.set.call(this,g)})),p)s.access=i&&a?{get:i,set:a}:i?{get:i}:{set:a};else{if(i){var C=i;i=function(g){return arguments.length===0&&(g=this),C.call(g)}}if(a){var P=a;a=function(g,S){return arguments.length===1&&(S=g,g=this),P.call(g,S)}}var E=function(g){return n in g};s.access=i&&a?{has:E,get:i,set:a}:i?{has:E,get:i}:{has:E,set:a}}try{return c(x,s)}finally{d.v=!0}}function e(c,n){if(c.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(c,n){if(typeof c!="function")throw new TypeError(n+" must be a function")}function u(c,n){var h=typeof n;if(c===1){if(h!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(h!=="function"){var l;throw c===0?l="field":c===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function f(c,n,h,l,o,w,p,D,x){var m=h[0],s,d,i;p?o===0||o===1?s={get:h[3],set:h[4]}:o===3?s={get:h[3]}:o===4?s={set:h[3]}:s={value:h[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var a,C,P;if(typeof m=="function")a=t(m,l,s,D,o,w,p,x,i),a!==void 0&&(u(o,a),o===0?d=a:o===1?(d=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a);else for(var E=m.length-1;E>=0;E--){var g=m[E];if(a=t(g,l,s,D,o,w,p,x,i),a!==void 0){u(o,a);var S;o===0?S=a:o===1?(S=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a,S!==void 0&&(d===void 0?d=S:typeof d=="function"?d=[d,S]:d.push(S))}}if(o===0||o===1){if(d===void 0)d=function(M,I){return I};else if(typeof d!="function"){var F=d;d=function(M,I){for(var A=I,L=0;L<F.length;L++)A=F[L].call(M,A);return A}}else{var j=d;d=function(M,I){return j.call(M,I)}}c.push(d)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),p?o===1?(c.push(function(M,I){return i.get.call(M,I)}),c.push(function(M,I){return i.set.call(M,I)})):o===2?c.push(i):c.push(function(M,I){return i.call(M,I)}):Object.defineProperty(n,l,s))}function y(c,n,h){for(var l=[],o,w,p=new Map,D=new Map,x=0;x<n.length;x++){var m=n[x];if(Array.isArray(m)){var s=m[1],d=m[2],i=m.length>3,a=s>=5,C,P;if(a?(C=c,s=s-5,w=w||[],P=w):(C=c.prototype,o=o||[],P=o),s!==0&&!i){var E=a?D:p,g=E.get(d)||0;if(g===!0||g===3&&s!==4||g===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!g&&s>2?E.set(d,s):E.set(d,!0)}f(l,C,m,d,s,a,i,P,h)}}return b(l,o),b(l,w),l}function b(c,n){n&&c.push(function(h){for(var l=0;l<n.length;l++)n[l].call(h);return h})}function T(c,n,h){if(n.length>0){for(var l=[],o=c,w=c.name,p=n.length-1;p>=0;p--){var D={v:!1};try{var x=n[p](o,{kind:"class",name:w,addInitializer:v(l,D),metadata:h})}finally{D.v=!0}x!==void 0&&(u(10,x),o=x)}return[N(o,h),function(){for(var m=0;m<l.length;m++)l[m].call(o)}]}}function N(c,n){return Object.defineProperty(c,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,h,l,o){if(o!==void 0)var w=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var p=Object.create(w===void 0?null:w),D=y(n,h,p);return l.length||N(n,p),{e:D,get c(){return T(n,l,p)}}}}function ln(v,t,e,r){return(ln=Ta())(v,t,e,r)}var cn,on,un,hn,rn,nn,sn,wo;cn=B({selector:"potatno-function-list",template:en,style:tn,components:[Pt,ie]}),un=$.state({complexValue:!0}),hn=$.state();var an=class{static{({e:[rn,nn,sn],c:[wo,on]}=ln(this,[[un,1,"documentFunctions"],[hn,1,"showPopup"]],[cn]))}constructor(t=O.use(H)){this.mManager=t,this.documentFunctions=new Array,this.showPopup=!1,this.mUnsubscribe=this.mManager.subscribe(R.Document|R.Function|R.SpecialActiveFunction,()=>{this.documentFunctions=this.mManager.graph.document.functions.map(e=>({id:e.id,label:e.label,isSystem:e.isSystem,function:e}))})}mManager;mUnsubscribe;#t=(sn(this),rn(this));get documentFunctions(){return this.#t}set documentFunctions(t){this.#t=t}#e=nn(this);get showPopup(){return this.#e}set showPopup(t){this.#e=t}get activeFunctionId(){return this.mManager.activeFunction.id}get userFunctionDefinitions(){return[...this.mManager.project.userFunctions.values()]}createFunction(t){this.showPopup=!1,this.mManager.graph.addFunction(t.id)}deleteFunction(t){this.mManager.graph.removeFunction(t.id)}onDeconstruct(){this.mUnsubscribe()}selectFunction(t){this.mManager.setActiveFunction(t.function)}static{on()}};var dn=`:host {\r
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
}`;var fn=`<kg-popup class="selection-popup" animate="top" (pointerdown)="this.stopPropagation($event, false)" (wheel)="this.stopPropagation($event, false)" (contextmenu)="this.stopPropagation($event, true);">\r
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
`;function Ia(){function v(c,n){return function(l){e(n,"addInitializer"),r(l,"An initializer"),c.push(l)}}function t(c,n,h,l,o,w,p,D,x){var m;switch(o){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var s={kind:m,name:p?"#"+n:n,static:w,private:p,metadata:D},d={v:!1};s.addInitializer=v(l,d);var i,a;if(o===0?p?(i=h.get,a=h.set):(i=function(){return this[n]},a=function(g){this[n]=g}):o===2?i=function(){return h.value}:((o===1||o===3)&&(i=function(){return h.get.call(this)}),(o===1||o===4)&&(a=function(g){h.set.call(this,g)})),p)s.access=i&&a?{get:i,set:a}:i?{get:i}:{set:a};else{if(i){var C=i;i=function(g){return arguments.length===0&&(g=this),C.call(g)}}if(a){var P=a;a=function(g,S){return arguments.length===1&&(S=g,g=this),P.call(g,S)}}var E=function(g){return n in g};s.access=i&&a?{has:E,get:i,set:a}:i?{has:E,get:i}:{has:E,set:a}}try{return c(x,s)}finally{d.v=!0}}function e(c,n){if(c.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(c,n){if(typeof c!="function")throw new TypeError(n+" must be a function")}function u(c,n){var h=typeof n;if(c===1){if(h!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(h!=="function"){var l;throw c===0?l="field":c===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function f(c,n,h,l,o,w,p,D,x){var m=h[0],s,d,i;p?o===0||o===1?s={get:h[3],set:h[4]}:o===3?s={get:h[3]}:o===4?s={set:h[3]}:s={value:h[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var a,C,P;if(typeof m=="function")a=t(m,l,s,D,o,w,p,x,i),a!==void 0&&(u(o,a),o===0?d=a:o===1?(d=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a);else for(var E=m.length-1;E>=0;E--){var g=m[E];if(a=t(g,l,s,D,o,w,p,x,i),a!==void 0){u(o,a);var S;o===0?S=a:o===1?(S=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a,S!==void 0&&(d===void 0?d=S:typeof d=="function"?d=[d,S]:d.push(S))}}if(o===0||o===1){if(d===void 0)d=function(M,I){return I};else if(typeof d!="function"){var F=d;d=function(M,I){for(var A=I,L=0;L<F.length;L++)A=F[L].call(M,A);return A}}else{var j=d;d=function(M,I){return j.call(M,I)}}c.push(d)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),p?o===1?(c.push(function(M,I){return i.get.call(M,I)}),c.push(function(M,I){return i.set.call(M,I)})):o===2?c.push(i):c.push(function(M,I){return i.call(M,I)}):Object.defineProperty(n,l,s))}function y(c,n,h){for(var l=[],o,w,p=new Map,D=new Map,x=0;x<n.length;x++){var m=n[x];if(Array.isArray(m)){var s=m[1],d=m[2],i=m.length>3,a=s>=5,C,P;if(a?(C=c,s=s-5,w=w||[],P=w):(C=c.prototype,o=o||[],P=o),s!==0&&!i){var E=a?D:p,g=E.get(d)||0;if(g===!0||g===3&&s!==4||g===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!g&&s>2?E.set(d,s):E.set(d,!0)}f(l,C,m,d,s,a,i,P,h)}}return b(l,o),b(l,w),l}function b(c,n){n&&c.push(function(h){for(var l=0;l<n.length;l++)n[l].call(h);return h})}function T(c,n,h){if(n.length>0){for(var l=[],o=c,w=c.name,p=n.length-1;p>=0;p--){var D={v:!1};try{var x=n[p](o,{kind:"class",name:w,addInitializer:v(l,D),metadata:h})}finally{D.v=!0}x!==void 0&&(u(10,x),o=x)}return[N(o,h),function(){for(var m=0;m<l.length;m++)l[m].call(o)}]}}function N(c,n){return Object.defineProperty(c,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,h,l,o){if(o!==void 0)var w=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var p=Object.create(w===void 0?null:w),D=y(n,h,p);return l.length||N(n,p),{e:D,get c(){return T(n,l,p)}}}}function xn(v,t,e,r){return(xn=Ia())(v,t,e,r)}function Ca(v){return v}var Tn,mn,Dn,En,In,Cn,Pn,pn,gn,vn,yn,bn,wn,se;Tn=B({selector:"potatno-node-selection-popup",template:fn,style:dn,components:[ie]}),Dn=$.state({complexValue:!0}),En=gt("searchInput"),In=pt("node-select"),Cn=$.state(),Pn=$.state();new class extends Ca{constructor(){super(se),mn()}static{class v{static{({e:[pn,gn,vn,yn,bn,wn],c:[se,mn]}=xn(this,[[Dn,1,"results"],[En,1,"searchInput"],[In,1,"mNodeSelect"],[Cn,1,"searchValue"],[Pn,1,"selectedDefinitionId"]],[Tn]))}static POPUP_HEIGHT=320;static POPUP_WIDTH=280;mAvailableEntries;mComponent;mManager;#t=(wn(this),pn(this));get results(){return this.#t}set results(e){this.#t=e}#e=gn(this);get searchInput(){return this.#e}set searchInput(e){this.#e=e}#o=vn(this);get mNodeSelect(){return this.#o}set mNodeSelect(e){this.#o=e}#r=yn(this);get searchValue(){return this.#r}set searchValue(e){this.#r=e}#n=bn(this);get selectedDefinitionId(){return this.#n}set selectedDefinitionId(e){this.#n=e}constructor(e=O.use(G),r=O.use(H)){this.mManager=r,this.mComponent=e,this.mAvailableEntries=this.fetchNodeEntries(),this.selectedDefinitionId=null,this.results=new Array,this.searchValue=""}onConnect(){this.searchInput?.focus()}onKeyDown(e){if(this.results.length!==0){if(e.key==="ArrowDown"||e.key==="ArrowUp"){e.preventDefault();let r=this.results.findIndex(y=>y.definition.id===this.selectedDefinitionId);r=Math.max(0,r);let u=e.key==="ArrowDown"?1:-1,f=(r+u+this.results.length)%this.results.length;this.selectedDefinitionId=this.results[f].definition.id;return}e.key==="Enter"&&this.sendSelectedEntry(this.selectedDefinitionId)}}onUpdate(){this.results=this.filterResults(),this.results.some(r=>r.definition.id===this.selectedDefinitionId)||(this.selectedDefinitionId=this.results[0]?.definition.id??null);let e=this.mComponent.element.shadowRoot.querySelector(".selection-popup__result.selected");e&&e.scrollIntoView()}stopPropagation(e,r){e.stopPropagation(),r&&e.preventDefault()}fetchNodeEntries(){return this.mManager.activeFunction.dynamicNodeDefinitions.map(e=>({category:e.category.name,definition:e,label:e.label.toLowerCase(),color:this.mManager.generateStringColor(e.category.name),icon:e.category.icon}))}filterResults(){let e=this.searchValue.trim().toLowerCase();return this.mAvailableEntries.filter(r=>r.label.includes(e))}sendSelectedEntry(e){if(e===null)return;let r=this.results.find(u=>u.definition.id===e);r&&this.mNodeSelect.dispatchEvent(r.definition)}}}};var Mn=`:host {\r
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
}`;var Sn=`<!-- Resizeable part of node -->\r
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
`;function Sa(){function v(c,n){return function(l){e(n,"addInitializer"),r(l,"An initializer"),c.push(l)}}function t(c,n,h,l,o,w,p,D,x){var m;switch(o){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var s={kind:m,name:p?"#"+n:n,static:w,private:p,metadata:D},d={v:!1};s.addInitializer=v(l,d);var i,a;if(o===0?p?(i=h.get,a=h.set):(i=function(){return this[n]},a=function(g){this[n]=g}):o===2?i=function(){return h.value}:((o===1||o===3)&&(i=function(){return h.get.call(this)}),(o===1||o===4)&&(a=function(g){h.set.call(this,g)})),p)s.access=i&&a?{get:i,set:a}:i?{get:i}:{set:a};else{if(i){var C=i;i=function(g){return arguments.length===0&&(g=this),C.call(g)}}if(a){var P=a;a=function(g,S){return arguments.length===1&&(S=g,g=this),P.call(g,S)}}var E=function(g){return n in g};s.access=i&&a?{has:E,get:i,set:a}:i?{has:E,get:i}:{has:E,set:a}}try{return c(x,s)}finally{d.v=!0}}function e(c,n){if(c.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(c,n){if(typeof c!="function")throw new TypeError(n+" must be a function")}function u(c,n){var h=typeof n;if(c===1){if(h!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(h!=="function"){var l;throw c===0?l="field":c===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function f(c,n,h,l,o,w,p,D,x){var m=h[0],s,d,i;p?o===0||o===1?s={get:h[3],set:h[4]}:o===3?s={get:h[3]}:o===4?s={set:h[3]}:s={value:h[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var a,C,P;if(typeof m=="function")a=t(m,l,s,D,o,w,p,x,i),a!==void 0&&(u(o,a),o===0?d=a:o===1?(d=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a);else for(var E=m.length-1;E>=0;E--){var g=m[E];if(a=t(g,l,s,D,o,w,p,x,i),a!==void 0){u(o,a);var S;o===0?S=a:o===1?(S=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a,S!==void 0&&(d===void 0?d=S:typeof d=="function"?d=[d,S]:d.push(S))}}if(o===0||o===1){if(d===void 0)d=function(M,I){return I};else if(typeof d!="function"){var F=d;d=function(M,I){for(var A=I,L=0;L<F.length;L++)A=F[L].call(M,A);return A}}else{var j=d;d=function(M,I){return j.call(M,I)}}c.push(d)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),p?o===1?(c.push(function(M,I){return i.get.call(M,I)}),c.push(function(M,I){return i.set.call(M,I)})):o===2?c.push(i):c.push(function(M,I){return i.call(M,I)}):Object.defineProperty(n,l,s))}function y(c,n,h){for(var l=[],o,w,p=new Map,D=new Map,x=0;x<n.length;x++){var m=n[x];if(Array.isArray(m)){var s=m[1],d=m[2],i=m.length>3,a=s>=5,C,P;if(a?(C=c,s=s-5,w=w||[],P=w):(C=c.prototype,o=o||[],P=o),s!==0&&!i){var E=a?D:p,g=E.get(d)||0;if(g===!0||g===3&&s!==4||g===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!g&&s>2?E.set(d,s):E.set(d,!0)}f(l,C,m,d,s,a,i,P,h)}}return b(l,o),b(l,w),l}function b(c,n){n&&c.push(function(h){for(var l=0;l<n.length;l++)n[l].call(h);return h})}function T(c,n,h){if(n.length>0){for(var l=[],o=c,w=c.name,p=n.length-1;p>=0;p--){var D={v:!1};try{var x=n[p](o,{kind:"class",name:w,addInitializer:v(l,D),metadata:h})}finally{D.v=!0}x!==void 0&&(u(10,x),o=x)}return[N(o,h),function(){for(var m=0;m<l.length;m++)l[m].call(o)}]}}function N(c,n){return Object.defineProperty(c,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,h,l,o){if(o!==void 0)var w=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var p=Object.create(w===void 0?null:w),D=y(n,h,p);return l.length||N(n,p),{e:D,get c(){return T(n,l,p)}}}}function Vn(v,t,e,r){return(Vn=Sa())(v,t,e,r)}var $n,Nn,Gn,Bn,Un,Xn,Hn,Yn,_n,An,Ln,Rn,On,Fn,zn,To;$n=B({selector:"potatno-comment-node",template:Sn,style:Mn,components:[Pt]}),Gn=$.state(),Bn=$.state(),Un=$.state(),Xn=gt("CommentInput"),Hn=pt("node-drag"),Yn=gt("ResizeBox");var jn=class{static{({e:[_n,An,Ln,Rn,On,Fn,zn],c:[To,Nn]}=Vn(this,[[Gn,1,"editMode"],[Bn,1,"enableBigview"],[Un,1,"gridZoom"],[W,3,"nodeData"],[Xn,1,"mCommentInput"],[Hn,1,"mDrag"],[Yn,1,"mResizeBox"]],[$n]))}constructor(t=O.use(G),e=O.use(H)){this.mComponent=t,this.mManager=e,this.mNodeData=null,this.editMode=!1,this.enableBigview=!1,this.gridZoom=0,this.updateForZoomLevel(),this.mUnsubscribeGrid=this.mManager.subscribe(R.SpecialGrid,()=>{this.updateForZoomLevel()}),this.mUnsubscribe=this.mManager.subscribe(R.Node,r=>{r.item===this.mNodeData&&this.resyncComponent(this.nodeData)})}mComponent;mManager;mNodeData;mUnsubscribe;mUnsubscribeGrid;get comment(){return this.nodeData.label??""}set comment(t){this.nodeData.label=t}#t=(zn(this),_n(this));get editMode(){return this.#t}set editMode(t){this.#t=t}#e=An(this);get enableBigview(){return this.#e}set enableBigview(t){this.#e=t}#o=Ln(this);get gridZoom(){return this.#o}set gridZoom(t){this.#o=t}get gridSize(){return this.mManager.grid.gridSize}get nodeData(){if(!this.mNodeData)throw new _("Node data not set.",this);return this.mNodeData}set nodeData(t){this.mNodeData=t,t&&(this.resyncComponent(t),this.mComponent.updater.update())}#r=Rn(this);get mCommentInput(){return this.#r}set mCommentInput(t){this.#r=t}#n=On(this);get mDrag(){return this.#n}set mDrag(t){this.#n=t}#i=Fn(this);get mResizeBox(){return this.#i}set mResizeBox(t){this.#i=t}dragNodeOrEnableEdit(t){if(t.preventDefault(),this.editMode||(t.button===2&&this.mManager.graph.removeNode(this.nodeData),t.button!==0))return;let e=this.nodeData.transformation.x*this.mManager.grid.gridSize,r=this.nodeData.transformation.y*this.mManager.grid.gridSize,u=this.nodeData.transformation.x,f=this.nodeData.transformation.y,y=this.mComponent.element.getBoundingClientRect(),b=this.mComponent.element.offsetWidth?y.width/this.mComponent.element.offsetWidth:1,T=this.mComponent.element.offsetHeight?y.height/this.mComponent.element.offsetHeight:1,N=t.clientX,c=t.clientY,n=l=>{l.stopPropagation();let o=(l.clientX-N)/b,w=(l.clientY-c)/T,p=Math.round((e+o)/this.mManager.grid.gridSize),D=Math.round((r+w)/this.mManager.grid.gridSize);u===p&&f===D||(this.mManager.graph.transformNode(this.nodeData,x=>{x.moveTo(p,D)}),this.mDrag.dispatchEvent(new xo(p-u,D-f)),u=p,f=D)},h=()=>{document.removeEventListener("pointermove",n),document.removeEventListener("pointerup",h)};document.addEventListener("pointermove",n),document.addEventListener("pointerup",h)}escapeEditMode(t){(t.key==="Escape"||t.key==="Enter")&&(t.preventDefault(),this.editMode=!1)}onConnect(){this.resyncComponent(this.nodeData)}onDeconstruct(){this.mUnsubscribe(),this.mUnsubscribeGrid()}onUpdate(){this.mCommentInput&&this.getFocusedElement(document)!==this.mCommentInput&&this.mCommentInput.select()}transformNodeData(t){this.mManager.graph.transformNode(this.nodeData,e=>{let r=e.transformation.width,u=e.transformation.height;e.resizeTo(t.width/this.mManager.grid.gridSize,t.height/this.mManager.grid.gridSize);let f=e.transformation.width-r,y=e.transformation.height-u;y!==0&&(t.resizeHandle&vt.top)>0&&e.moveTo(e.transformation.x,e.transformation.y-y),f!==0&&(t.resizeHandle&vt.left)>0&&e.moveTo(e.transformation.x-f,e.transformation.y)})}getFocusedElement(t){let e=t.activeElement;return e?e.shadowRoot?this.getFocusedElement(e.shadowRoot):e:null}resyncComponent(t){let e=t.transformation.x*this.mManager.grid.gridSize,r=t.transformation.y*this.mManager.grid.gridSize;if(this.mComponent.element.style.setProperty("left",`${e}px`),this.mComponent.element.style.setProperty("top",`${r}px`),this.mResizeBox){let u=t.transformation.width*this.mManager.grid.gridSize,f=t.transformation.height*this.mManager.grid.gridSize;this.mResizeBox.width=u,this.mResizeBox.height=f}this.mComponent.updater.updateAsync()}updateForZoomLevel(){this.enableBigview=this.mManager.grid.zoom<.25,this.enableBigview&&(this.gridZoom=this.mManager.grid.zoom),this.mComponent.element.style.setProperty("z-index",(this.enableBigview?9999:-1).toString())}static{Nn()}},xo=class{mX;mY;get x(){return this.mX}get y(){return this.mY}constructor(t,e){this.mX=t,this.mY=e}};var Wn=`:host {\r
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
`;var Zn=`<div class="port-wrapper {{this.portDirection}}" style="--type-color: {{this.portColor}}" (dragover)="this.onDragOver($event)" (drop)="this.onDrop($event)">\r
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
`;function Aa(){function v(c,n){return function(l){e(n,"addInitializer"),r(l,"An initializer"),c.push(l)}}function t(c,n,h,l,o,w,p,D,x){var m;switch(o){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var s={kind:m,name:p?"#"+n:n,static:w,private:p,metadata:D},d={v:!1};s.addInitializer=v(l,d);var i,a;if(o===0?p?(i=h.get,a=h.set):(i=function(){return this[n]},a=function(g){this[n]=g}):o===2?i=function(){return h.value}:((o===1||o===3)&&(i=function(){return h.get.call(this)}),(o===1||o===4)&&(a=function(g){h.set.call(this,g)})),p)s.access=i&&a?{get:i,set:a}:i?{get:i}:{set:a};else{if(i){var C=i;i=function(g){return arguments.length===0&&(g=this),C.call(g)}}if(a){var P=a;a=function(g,S){return arguments.length===1&&(S=g,g=this),P.call(g,S)}}var E=function(g){return n in g};s.access=i&&a?{has:E,get:i,set:a}:i?{has:E,get:i}:{has:E,set:a}}try{return c(x,s)}finally{d.v=!0}}function e(c,n){if(c.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(c,n){if(typeof c!="function")throw new TypeError(n+" must be a function")}function u(c,n){var h=typeof n;if(c===1){if(h!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(h!=="function"){var l;throw c===0?l="field":c===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function f(c,n,h,l,o,w,p,D,x){var m=h[0],s,d,i;p?o===0||o===1?s={get:h[3],set:h[4]}:o===3?s={get:h[3]}:o===4?s={set:h[3]}:s={value:h[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var a,C,P;if(typeof m=="function")a=t(m,l,s,D,o,w,p,x,i),a!==void 0&&(u(o,a),o===0?d=a:o===1?(d=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a);else for(var E=m.length-1;E>=0;E--){var g=m[E];if(a=t(g,l,s,D,o,w,p,x,i),a!==void 0){u(o,a);var S;o===0?S=a:o===1?(S=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a,S!==void 0&&(d===void 0?d=S:typeof d=="function"?d=[d,S]:d.push(S))}}if(o===0||o===1){if(d===void 0)d=function(M,I){return I};else if(typeof d!="function"){var F=d;d=function(M,I){for(var A=I,L=0;L<F.length;L++)A=F[L].call(M,A);return A}}else{var j=d;d=function(M,I){return j.call(M,I)}}c.push(d)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),p?o===1?(c.push(function(M,I){return i.get.call(M,I)}),c.push(function(M,I){return i.set.call(M,I)})):o===2?c.push(i):c.push(function(M,I){return i.call(M,I)}):Object.defineProperty(n,l,s))}function y(c,n,h){for(var l=[],o,w,p=new Map,D=new Map,x=0;x<n.length;x++){var m=n[x];if(Array.isArray(m)){var s=m[1],d=m[2],i=m.length>3,a=s>=5,C,P;if(a?(C=c,s=s-5,w=w||[],P=w):(C=c.prototype,o=o||[],P=o),s!==0&&!i){var E=a?D:p,g=E.get(d)||0;if(g===!0||g===3&&s!==4||g===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!g&&s>2?E.set(d,s):E.set(d,!0)}f(l,C,m,d,s,a,i,P,h)}}return b(l,o),b(l,w),l}function b(c,n){n&&c.push(function(h){for(var l=0;l<n.length;l++)n[l].call(h);return h})}function T(c,n,h){if(n.length>0){for(var l=[],o=c,w=c.name,p=n.length-1;p>=0;p--){var D={v:!1};try{var x=n[p](o,{kind:"class",name:w,addInitializer:v(l,D),metadata:h})}finally{D.v=!0}x!==void 0&&(u(10,x),o=x)}return[N(o,h),function(){for(var m=0;m<l.length;m++)l[m].call(o)}]}}function N(c,n){return Object.defineProperty(c,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,h,l,o){if(o!==void 0)var w=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var p=Object.create(w===void 0?null:w),D=y(n,h,p);return l.length||N(n,p),{e:D,get c(){return T(n,l,p)}}}}function ti(v,t,e,r){return(ti=Aa())(v,t,e,r)}var ei,qn,oi,ri,Jn,Kn,Qn,Me;ei=B({selector:"potatno-port",template:Zn,style:Wn}),oi=gt("dragConnection"),ri=gt("dragPath");var kn=class{static{({e:[Jn,Kn,Qn],c:[Me,qn]}=ti(this,[[oi,1,"mDragConnectionSvg"],[ri,1,"mDragConnectionPath"],[W,3,"port"]],[ei]))}constructor(t=O.use(G),e=O.use(H)){this.mComponent=t,this.mManager=e,this.mPort=null,this.mDragPositionEventHandler=r=>{this.mManager.grid.draggedPort.isDragging&&(performance.now()-r.timeStamp>100||this.renderDragWire(r.clientX,r.clientY))},document.addEventListener("dragover",this.mDragPositionEventHandler,{capture:!0}),this.mUnsubscribeValidation=this.mManager.subscribe(R.Connection|R.SpecialValidation,()=>{this.mComponent.updater.updateAsync()})}mComponent;mDragPositionEventHandler;mManager;mPort;mUnsubscribeValidation;#t=(Qn(this),Jn(this));get mDragConnectionSvg(){return this.#t}set mDragConnectionSvg(t){this.#t=t}#e=Kn(this);get mDragConnectionPath(){return this.#e}set mDragConnectionPath(t){this.#e=t}get hasError(){return this.mManager.integrity.errorItems.has(this.port)}get inputDefinitions(){let t=this.port.project.types.getType(this.port.resolvedDataType);return t.inputs.map((e,r)=>({htmlType:(()=>{switch(e.type){case"boolean":return"checkbox";case"number":return"number";case"string":return"text"}})(),index:r,name:e.name,value:this.port.directValue[r]??"",totalCount:t.inputs.length}))}get isConnected(){return this.port.connectedPorts.size>0}get port(){if(!this.mPort)throw new _("Port is not setup",this);return this.mPort}set port(t){if(this.mPort!==t){if(t===null)throw new _("A null port cant be assigned.",this);this.mPort=t,this.mComponent.updater.update()}}get portColor(){return this.port.portType==="flow"?"var(--potatno-color-text)":this.mManager.generateStringColor(this.port.resolvedDataType)}get portDirection(){return this.port.direction??"output"}get portName(){return this.port.label??""}get portType(){return this.port.portType}get portValueType(){return this.port.portType!=="value"?"":this.port.resolvedDataType??""}get showValueInput(){return this.port.portType!=="value"||this.port.direction!=="input"||this.port.connectedPorts.size>0||this.mManager.grid.draggedPort.hasPort(this.port)?!1:!this.port.node.project.types.isGenericType(this.port.dataType??"")}onDeconstruct(){this.mUnsubscribeValidation(),document.removeEventListener("dragover",this.mDragPositionEventHandler,{capture:!0})}onDirectValueInput(t,e){let r=t.target,u=[...this.port.directValue];u[e]=r.type==="checkbox"?r.checked?"true":"false":r.value,this.mManager.graph.setPortDirectValue(this.port,u)}onDragEnd(t){t.stopPropagation(),t.preventDefault(),this.mDragConnectionPath?.removeAttribute("d"),this.mManager.grid.setDraggingPort([]),this.mComponent.updater.updateAsync()}onDragOver(t){this.draggedPortCanConnect()&&(t.preventDefault(),t.stopPropagation(),t.dataTransfer&&(t.dataTransfer.dropEffect="link"))}onDragStart(t){if(!t.dataTransfer){t.preventDefault();return}t.stopPropagation(),t.dataTransfer.effectAllowed="link",t.dataTransfer.setDragImage(document.createElement("div"),0,0),this.mManager.grid.setDraggingPort([this.port]),this.mComponent.updater.updateAsync()}onDrop(t){if(t.preventDefault(),t.stopPropagation(),!!this.draggedPortCanConnect()&&this.mManager.grid.draggedPort.isDragging)for(let e of this.mManager.grid.draggedPort.ports)this.mManager.graph.connectPorts(e,this.port)}createDragPath(t,e){let r=this.mManager.grid.pixelToGridSpace(t,e);return this.mManager.connections.createTemporaryPath(this.port,r).attributeValue}draggedPortCanConnect(){if(!this.mManager.grid.draggedPort.isDragging)return!1;for(let t of this.mManager.grid.draggedPort.ports)if(t!==this.port&&t.direction!==this.port.direction&&t.portType===this.port.portType)return!0;return!1}renderDragWire(t,e){if(!this.mManager.grid.draggedPort.hasPort(this.port)||!this.mDragConnectionSvg||!this.mManager.grid.draggedPort.updatePointer(t,e))return;let r=this.mManager.grid.draggedPort.portPositions.get(this.port);if(!r)return;let u=r.x*this.mManager.grid.gridSize,f=r.y*this.mManager.grid.gridSize;this.mDragConnectionSvg.style.setProperty("transform",`translate(${-u}px, ${-f}px)`),this.mDragConnectionPath?.setAttribute("d",this.createDragPath(t,e))}static{qn()}};var ni=`:host {\r
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
}`;var ii=`<div class="node" style="--type-color: {{this.portColor}}" (dragover)="this.onDragOver($event)" (drop)="this.onDrop($event)">\r
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
    `;function Oa(){function v(c,n){return function(l){e(n,"addInitializer"),r(l,"An initializer"),c.push(l)}}function t(c,n,h,l,o,w,p,D,x){var m;switch(o){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var s={kind:m,name:p?"#"+n:n,static:w,private:p,metadata:D},d={v:!1};s.addInitializer=v(l,d);var i,a;if(o===0?p?(i=h.get,a=h.set):(i=function(){return this[n]},a=function(g){this[n]=g}):o===2?i=function(){return h.value}:((o===1||o===3)&&(i=function(){return h.get.call(this)}),(o===1||o===4)&&(a=function(g){h.set.call(this,g)})),p)s.access=i&&a?{get:i,set:a}:i?{get:i}:{set:a};else{if(i){var C=i;i=function(g){return arguments.length===0&&(g=this),C.call(g)}}if(a){var P=a;a=function(g,S){return arguments.length===1&&(S=g,g=this),P.call(g,S)}}var E=function(g){return n in g};s.access=i&&a?{has:E,get:i,set:a}:i?{has:E,get:i}:{has:E,set:a}}try{return c(x,s)}finally{d.v=!0}}function e(c,n){if(c.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(c,n){if(typeof c!="function")throw new TypeError(n+" must be a function")}function u(c,n){var h=typeof n;if(c===1){if(h!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(h!=="function"){var l;throw c===0?l="field":c===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function f(c,n,h,l,o,w,p,D,x){var m=h[0],s,d,i;p?o===0||o===1?s={get:h[3],set:h[4]}:o===3?s={get:h[3]}:o===4?s={set:h[3]}:s={value:h[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var a,C,P;if(typeof m=="function")a=t(m,l,s,D,o,w,p,x,i),a!==void 0&&(u(o,a),o===0?d=a:o===1?(d=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a);else for(var E=m.length-1;E>=0;E--){var g=m[E];if(a=t(g,l,s,D,o,w,p,x,i),a!==void 0){u(o,a);var S;o===0?S=a:o===1?(S=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a,S!==void 0&&(d===void 0?d=S:typeof d=="function"?d=[d,S]:d.push(S))}}if(o===0||o===1){if(d===void 0)d=function(M,I){return I};else if(typeof d!="function"){var F=d;d=function(M,I){for(var A=I,L=0;L<F.length;L++)A=F[L].call(M,A);return A}}else{var j=d;d=function(M,I){return j.call(M,I)}}c.push(d)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),p?o===1?(c.push(function(M,I){return i.get.call(M,I)}),c.push(function(M,I){return i.set.call(M,I)})):o===2?c.push(i):c.push(function(M,I){return i.call(M,I)}):Object.defineProperty(n,l,s))}function y(c,n,h){for(var l=[],o,w,p=new Map,D=new Map,x=0;x<n.length;x++){var m=n[x];if(Array.isArray(m)){var s=m[1],d=m[2],i=m.length>3,a=s>=5,C,P;if(a?(C=c,s=s-5,w=w||[],P=w):(C=c.prototype,o=o||[],P=o),s!==0&&!i){var E=a?D:p,g=E.get(d)||0;if(g===!0||g===3&&s!==4||g===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!g&&s>2?E.set(d,s):E.set(d,!0)}f(l,C,m,d,s,a,i,P,h)}}return b(l,o),b(l,w),l}function b(c,n){n&&c.push(function(h){for(var l=0;l<n.length;l++)n[l].call(h);return h})}function T(c,n,h){if(n.length>0){for(var l=[],o=c,w=c.name,p=n.length-1;p>=0;p--){var D={v:!1};try{var x=n[p](o,{kind:"class",name:w,addInitializer:v(l,D),metadata:h})}finally{D.v=!0}x!==void 0&&(u(10,x),o=x)}return[N(o,h),function(){for(var m=0;m<l.length;m++)l[m].call(o)}]}}function N(c,n){return Object.defineProperty(c,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,h,l,o){if(o!==void 0)var w=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var p=Object.create(w===void 0?null:w),D=y(n,h,p);return l.length||N(n,p),{e:D,get c(){return T(n,l,p)}}}}function di(v,t,e,r){return(di=Oa())(v,t,e,r)}var fi,si,mi,pi,gi,ai,li,ci,ui,Eo;fi=B({selector:"potatno-conjunction-node",template:ii,style:ni,components:[Me]}),mi=gt("dragConnection"),pi=gt("dragPath"),gi=pt("node-drag");var hi=class{static{({e:[ai,li,ci,ui],c:[Eo,si]}=di(this,[[mi,1,"mDragConnectionSvg"],[pi,1,"mDragConnectionPath"],[gi,1,"mDrag"],[W,3,"nodeData"]],[fi]))}constructor(t=O.use(G),e=O.use(H)){this.mComponent=t,this.mManager=e,this.mNodeData=null,this.mDragPositionEventHandler=r=>{this.mManager.grid.draggedPort.isDragging&&(performance.now()-r.timeStamp>100||this.renderDragWire(r.clientX,r.clientY))},document.addEventListener("dragover",this.mDragPositionEventHandler,{capture:!0}),this.mUnsubscribeNodeChange=this.mManager.subscribe(R.Node,r=>{r.item===this.mNodeData&&this.resyncComponent(this.nodeData)}),this.mUnsubscribeValidation=this.mManager.subscribe(R.Connection|R.SpecialValidation,()=>{this.mComponent.updater.updateAsync()})}mComponent;mDragPositionEventHandler;mManager;mNodeData;mUnsubscribeNodeChange;mUnsubscribeValidation;#t=(ui(this),ai(this));get mDragConnectionSvg(){return this.#t}set mDragConnectionSvg(t){this.#t=t}#e=li(this);get mDragConnectionPath(){return this.#e}set mDragConnectionPath(t){this.#e=t}#o=ci(this);get mDrag(){return this.#o}set mDrag(t){this.#o=t}get inputHasError(){return this.mManager.integrity.errorItems.has(this.nodeData)||this.mManager.integrity.errorItems.has(this.nodePorts.input)}get isInputConnected(){return this.nodePorts.input.connectedPorts.size>0}get isOutputConnected(){return this.nodePorts.output.connectedPorts.size>0}get nodeData(){if(!this.mNodeData)throw new _("Node data not set.",this);return this.mNodeData}set nodeData(t){this.mNodeData=t,t&&this.resyncComponent(t)}get outputHasError(){return this.mManager.integrity.errorItems.has(this.nodeData)||this.mManager.integrity.errorItems.has(this.nodePorts.output)}get portColor(){return this.portType==="flow"?"var(--potatno-color-text)":this.mManager.generateStringColor(this.portValueType)}get portType(){return this.nodeData.definitionId===Z.DEFINITION_ID?"flow":"value"}get portValueType(){return this.portType!=="value"?"":this.nodePorts.input.resolvedDataType}get nodePorts(){if(this.nodeData.inputs.list.length===0||this.nodeData.outputs.list.length===0)throw new _("Malformed conjunction node",this);return{input:this.nodeData.inputs.list[0],output:this.nodeData.outputs.list[0]}}dragNode(t){if(t.preventDefault(),t.button===2&&this.mManager.graph.removeNode(this.nodeData),t.button!==0)return;let e=this.nodeData.transformation.x*this.mManager.grid.gridSize,r=this.nodeData.transformation.y*this.mManager.grid.gridSize,u=this.nodeData.transformation.x,f=this.nodeData.transformation.y,y=this.mComponent.element.getBoundingClientRect(),b=this.mComponent.element.offsetWidth?y.width/this.mComponent.element.offsetWidth:1,T=this.mComponent.element.offsetHeight?y.height/this.mComponent.element.offsetHeight:1,N=t.clientX,c=t.clientY,n=l=>{l.stopPropagation();let o=(l.clientX-N)/b,w=(l.clientY-c)/T,p=Math.round((e+o)/this.mManager.grid.gridSize),D=Math.round((r+w)/this.mManager.grid.gridSize);u===p&&f===D||(this.mManager.graph.transformNode(this.nodeData,x=>{x.moveTo(p,D)}),this.mDrag.dispatchEvent(new Do(p-u,D-f)),u=p,f=D)},h=()=>{document.removeEventListener("pointermove",n),document.removeEventListener("pointerup",h)};document.addEventListener("pointermove",n),document.addEventListener("pointerup",h)}onDeconstruct(){this.mUnsubscribeNodeChange(),this.mUnsubscribeValidation(),document.removeEventListener("dragover",this.mDragPositionEventHandler,{capture:!0})}onDragEnd(t){t.stopPropagation(),t.preventDefault(),this.mDragConnectionPath?.removeAttribute("d"),this.mManager.grid.setDraggingPort([]),this.mComponent.updater.updateAsync()}onDragOver(t){this.draggedPortCanConnect()&&(t.preventDefault(),t.stopPropagation(),t.dataTransfer&&(t.dataTransfer.dropEffect="link"))}onDragStart(t){t.stopPropagation(),t.dataTransfer.effectAllowed="link",t.dataTransfer.setDragImage(document.createElement("div"),0,0),this.mManager.grid.setDraggingPort([this.nodePorts.input,this.nodePorts.output]),this.mComponent.updater.updateAsync()}onDrop(t){this.draggedPortCanConnect()&&(t.preventDefault(),t.stopPropagation(),this.mManager.grid.draggedPort.isDragging&&this.mManager.graph.connectConjunction(this.nodeData,this.mManager.grid.draggedPort.ports))}createDragPath(t,e){let r=this.mManager.grid.pixelToGridSpace(t,e);return this.mManager.connections.createTemporaryPath(this.nodePorts.input,r).attributeValue}draggedPortCanConnect(){if(!this.mManager.grid.draggedPort.isDragging)return!1;let t=this.nodePorts,e=[t.input,t.output];for(let r of this.mManager.grid.draggedPort.ports)for(let u of e)if(r!==u&&r.direction!==u.direction&&r.portType===u.portType)return!0;return!1}renderDragWire(t,e){let r=this.nodePorts.input;if(!this.mManager.grid.draggedPort.hasPort(r)||!this.mManager.grid.draggedPort.updatePointer(t,e))return;let u=this.mManager.grid.draggedPort.portPositions.get(r);if(!u)return;let f=u.x*this.mManager.grid.gridSize,y=u.y*this.mManager.grid.gridSize;this.mDragConnectionSvg?.style.setProperty("transform",`translate(${-f}px, ${-y}px)`),this.mDragConnectionPath?.setAttribute("d",this.createDragPath(t,e))}resyncComponent(t){let e=t.transformation.x*this.mManager.grid.gridSize,r=t.transformation.y*this.mManager.grid.gridSize;this.mComponent.element.style.setProperty("left",`${e}px`),this.mComponent.element.style.setProperty("top",`${r}px`),this.mComponent.updater.update()}static{si()}},Do=class{mX;mY;get x(){return this.mX}get y(){return this.mY}constructor(t,e){this.mX=t,this.mY=e}};var vi=`:host {\r
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
}`;var yi=`<svg class="svg-layer" xmlns="http://www.w3.org/2000/svg" >\r
    $for(connection of this.connections.values()){\r
        <g class="{{this.connection.state.hasError ? 'error' : ''}} {{this.connection.state.isNew ? 'new' : ''}}" style="--path-length: {{ this.connection.path.length }}; {{ this.connection.color ? \`--path-color: \${this.connection.color};\` : '' }}" xmlns="http://www.w3.org/2000/svg">\r
            <path class="path" d="{{this.connection.path.attributeValue}}" xmlns="http://www.w3.org/2000/svg"/>\r
            <path class="path path--mouse-target" d="{{this.connection.path.attributeValue}}" (pointerdown)="this.deleteConnection($event, this.connection)" (dblclick)="this.createConjunction($event, this.connection)" xmlns="http://www.w3.org/2000/svg"/>\r
        </g>\r
    }\r
</svg>\r
`;function ja(){function v(c,n){return function(l){e(n,"addInitializer"),r(l,"An initializer"),c.push(l)}}function t(c,n,h,l,o,w,p,D,x){var m;switch(o){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var s={kind:m,name:p?"#"+n:n,static:w,private:p,metadata:D},d={v:!1};s.addInitializer=v(l,d);var i,a;if(o===0?p?(i=h.get,a=h.set):(i=function(){return this[n]},a=function(g){this[n]=g}):o===2?i=function(){return h.value}:((o===1||o===3)&&(i=function(){return h.get.call(this)}),(o===1||o===4)&&(a=function(g){h.set.call(this,g)})),p)s.access=i&&a?{get:i,set:a}:i?{get:i}:{set:a};else{if(i){var C=i;i=function(g){return arguments.length===0&&(g=this),C.call(g)}}if(a){var P=a;a=function(g,S){return arguments.length===1&&(S=g,g=this),P.call(g,S)}}var E=function(g){return n in g};s.access=i&&a?{has:E,get:i,set:a}:i?{has:E,get:i}:{has:E,set:a}}try{return c(x,s)}finally{d.v=!0}}function e(c,n){if(c.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(c,n){if(typeof c!="function")throw new TypeError(n+" must be a function")}function u(c,n){var h=typeof n;if(c===1){if(h!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(h!=="function"){var l;throw c===0?l="field":c===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function f(c,n,h,l,o,w,p,D,x){var m=h[0],s,d,i;p?o===0||o===1?s={get:h[3],set:h[4]}:o===3?s={get:h[3]}:o===4?s={set:h[3]}:s={value:h[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var a,C,P;if(typeof m=="function")a=t(m,l,s,D,o,w,p,x,i),a!==void 0&&(u(o,a),o===0?d=a:o===1?(d=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a);else for(var E=m.length-1;E>=0;E--){var g=m[E];if(a=t(g,l,s,D,o,w,p,x,i),a!==void 0){u(o,a);var S;o===0?S=a:o===1?(S=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a,S!==void 0&&(d===void 0?d=S:typeof d=="function"?d=[d,S]:d.push(S))}}if(o===0||o===1){if(d===void 0)d=function(M,I){return I};else if(typeof d!="function"){var F=d;d=function(M,I){for(var A=I,L=0;L<F.length;L++)A=F[L].call(M,A);return A}}else{var j=d;d=function(M,I){return j.call(M,I)}}c.push(d)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),p?o===1?(c.push(function(M,I){return i.get.call(M,I)}),c.push(function(M,I){return i.set.call(M,I)})):o===2?c.push(i):c.push(function(M,I){return i.call(M,I)}):Object.defineProperty(n,l,s))}function y(c,n,h){for(var l=[],o,w,p=new Map,D=new Map,x=0;x<n.length;x++){var m=n[x];if(Array.isArray(m)){var s=m[1],d=m[2],i=m.length>3,a=s>=5,C,P;if(a?(C=c,s=s-5,w=w||[],P=w):(C=c.prototype,o=o||[],P=o),s!==0&&!i){var E=a?D:p,g=E.get(d)||0;if(g===!0||g===3&&s!==4||g===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!g&&s>2?E.set(d,s):E.set(d,!0)}f(l,C,m,d,s,a,i,P,h)}}return b(l,o),b(l,w),l}function b(c,n){n&&c.push(function(h){for(var l=0;l<n.length;l++)n[l].call(h);return h})}function T(c,n,h){if(n.length>0){for(var l=[],o=c,w=c.name,p=n.length-1;p>=0;p--){var D={v:!1};try{var x=n[p](o,{kind:"class",name:w,addInitializer:v(l,D),metadata:h})}finally{D.v=!0}x!==void 0&&(u(10,x),o=x)}return[N(o,h),function(){for(var m=0;m<l.length;m++)l[m].call(o)}]}}function N(c,n){return Object.defineProperty(c,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,h,l,o){if(o!==void 0)var w=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var p=Object.create(w===void 0?null:w),D=y(n,h,p);return l.length||N(n,p),{e:D,get c(){return T(n,l,p)}}}}function Di(v,t,e,r){return(Di=ja())(v,t,e,r)}var Ei,bi,Ii,wi,xi,Io;Ei=B({selector:"potatno-connection-layer",template:yi,style:vi}),Ii=$.state({complexValue:!0});var Ti=class{static{({e:[wi,xi],c:[Io,bi]}=Di(this,[[Ii,1,"connections"]],[Ei]))}constructor(t=O.use(H)){this.mManager=t,this.connections=new Map;let e=0;this.mUnsubscribe=this.mManager.subscribe(R.SpecialActiveFunction|R.Node|R.Connection,()=>{e===0&&(e=requestAnimationFrame(()=>{e=0,this.updateConnections()}))})}mManager;mUnsubscribe;#t=(xi(this),wi(this));get connections(){return this.#t}set connections(t){this.#t=t}createConjunction(t,e){t.preventDefault(),t.stopPropagation();let r=e.port.output.portType==="flow"?this.mManager.project.nodeDefinitions.get(Z.DEFINITION_ID):this.mManager.project.nodeDefinitions.get(k.DEFINITION_ID),u=this.mManager.grid.pixelToGridSpace(t.clientX,t.clientY),f=this.mManager.graph.addNode(this.mManager.activeFunction,r,{x:u.x,y:u.y,height:0,width:0});this.mManager.graph.disconnectPorts(e.port.output,e.port.input);let y=f.inputs.list[0],b=f.outputs.list[0];this.mManager.graph.connectPorts(y,e.port.output),this.mManager.graph.connectPorts(y,e.port.input),this.mManager.graph.connectPorts(b,e.port.output),this.mManager.graph.connectPorts(b,e.port.input)}deleteConnection(t,e){t.button===2&&(t.preventDefault(),t.stopPropagation(),this.mManager.graph.disconnectPorts(e.port.output,e.port.input))}onDeconstruct(){this.mUnsubscribe()}createConnection(t,e,r){let u=this.mManager.integrity.errorItems,f=u.has(e)||u.has(r),y=(()=>{switch(r.portType){case"value":return r;case"flow":return e}})(),b=e.portType==="flow"?"":this.mManager.generateStringColor(e.resolvedDataType),T=this.mManager.connections.getConnectionPath(e,r);return{color:b,path:{attributeValue:T.attributeValue,length:T.length},state:{isNew:!t.has(y),hasError:f},port:{primary:y,output:e,input:r}}}updateConnections(){let t=this.connections;this.connections=new Map;for(let e of this.mManager.activeFunction.nodes)for(let r of e.outputs.list)for(let u of r.connectedPorts){let f=this.createConnection(t,r,u);this.connections.set(f.port.primary,f)}}static{bi()}};function Va(){function v(c,n){return function(l){e(n,"addInitializer"),r(l,"An initializer"),c.push(l)}}function t(c,n,h,l,o,w,p,D,x){var m;switch(o){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var s={kind:m,name:p?"#"+n:n,static:w,private:p,metadata:D},d={v:!1};s.addInitializer=v(l,d);var i,a;if(o===0?p?(i=h.get,a=h.set):(i=function(){return this[n]},a=function(g){this[n]=g}):o===2?i=function(){return h.value}:((o===1||o===3)&&(i=function(){return h.get.call(this)}),(o===1||o===4)&&(a=function(g){h.set.call(this,g)})),p)s.access=i&&a?{get:i,set:a}:i?{get:i}:{set:a};else{if(i){var C=i;i=function(g){return arguments.length===0&&(g=this),C.call(g)}}if(a){var P=a;a=function(g,S){return arguments.length===1&&(S=g,g=this),P.call(g,S)}}var E=function(g){return n in g};s.access=i&&a?{has:E,get:i,set:a}:i?{has:E,get:i}:{has:E,set:a}}try{return c(x,s)}finally{d.v=!0}}function e(c,n){if(c.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(c,n){if(typeof c!="function")throw new TypeError(n+" must be a function")}function u(c,n){var h=typeof n;if(c===1){if(h!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(h!=="function"){var l;throw c===0?l="field":c===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function f(c,n,h,l,o,w,p,D,x){var m=h[0],s,d,i;p?o===0||o===1?s={get:h[3],set:h[4]}:o===3?s={get:h[3]}:o===4?s={set:h[3]}:s={value:h[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var a,C,P;if(typeof m=="function")a=t(m,l,s,D,o,w,p,x,i),a!==void 0&&(u(o,a),o===0?d=a:o===1?(d=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a);else for(var E=m.length-1;E>=0;E--){var g=m[E];if(a=t(g,l,s,D,o,w,p,x,i),a!==void 0){u(o,a);var S;o===0?S=a:o===1?(S=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a,S!==void 0&&(d===void 0?d=S:typeof d=="function"?d=[d,S]:d.push(S))}}if(o===0||o===1){if(d===void 0)d=function(M,I){return I};else if(typeof d!="function"){var F=d;d=function(M,I){for(var A=I,L=0;L<F.length;L++)A=F[L].call(M,A);return A}}else{var j=d;d=function(M,I){return j.call(M,I)}}c.push(d)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),p?o===1?(c.push(function(M,I){return i.get.call(M,I)}),c.push(function(M,I){return i.set.call(M,I)})):o===2?c.push(i):c.push(function(M,I){return i.call(M,I)}):Object.defineProperty(n,l,s))}function y(c,n,h){for(var l=[],o,w,p=new Map,D=new Map,x=0;x<n.length;x++){var m=n[x];if(Array.isArray(m)){var s=m[1],d=m[2],i=m.length>3,a=s>=5,C,P;if(a?(C=c,s=s-5,w=w||[],P=w):(C=c.prototype,o=o||[],P=o),s!==0&&!i){var E=a?D:p,g=E.get(d)||0;if(g===!0||g===3&&s!==4||g===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!g&&s>2?E.set(d,s):E.set(d,!0)}f(l,C,m,d,s,a,i,P,h)}}return b(l,o),b(l,w),l}function b(c,n){n&&c.push(function(h){for(var l=0;l<n.length;l++)n[l].call(h);return h})}function T(c,n,h){if(n.length>0){for(var l=[],o=c,w=c.name,p=n.length-1;p>=0;p--){var D={v:!1};try{var x=n[p](o,{kind:"class",name:w,addInitializer:v(l,D),metadata:h})}finally{D.v=!0}x!==void 0&&(u(10,x),o=x)}return[N(o,h),function(){for(var m=0;m<l.length;m++)l[m].call(o)}]}}function N(c,n){return Object.defineProperty(c,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,h,l,o){if(o!==void 0)var w=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var p=Object.create(w===void 0?null:w),D=y(n,h,p);return l.length||N(n,p),{e:D,get c(){return T(n,l,p)}}}}function Mi(v,t,e,r){return(Mi=Va())(v,t,e,r)}var Si,Ci,Se;Si=Dt({access:q.Read,selector:/^potatno-preview$/});var Pi=class{static{({c:[Se,Ci]}=Mi(this,[],[Si]))}constructor(t=O.use(tt),e=O.use(Y),r=O.use(nt)){this.mTarget=t,this.mProcedure=e.createExpressionProcedure(r.value)}mProcedure;mTarget;onUpdate(){let t=this.mProcedure.execute();if(!t){let r=this.mTarget.childNodes.length>0;return r&&(this.mTarget.innerHTML=""),r}let e=t.element;return this.mTarget.contains(e)?!1:(this.mTarget.innerHTML="",this.mTarget.appendChild(e),!0)}static{Ci()}};var Ni=`:host {\r
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
}`;var _i=`<!-- Resizeable part of node -->\r
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
        `;function Ba(){function v(c,n){return function(l){e(n,"addInitializer"),r(l,"An initializer"),c.push(l)}}function t(c,n,h,l,o,w,p,D,x){var m;switch(o){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var s={kind:m,name:p?"#"+n:n,static:w,private:p,metadata:D},d={v:!1};s.addInitializer=v(l,d);var i,a;if(o===0?p?(i=h.get,a=h.set):(i=function(){return this[n]},a=function(g){this[n]=g}):o===2?i=function(){return h.value}:((o===1||o===3)&&(i=function(){return h.get.call(this)}),(o===1||o===4)&&(a=function(g){h.set.call(this,g)})),p)s.access=i&&a?{get:i,set:a}:i?{get:i}:{set:a};else{if(i){var C=i;i=function(g){return arguments.length===0&&(g=this),C.call(g)}}if(a){var P=a;a=function(g,S){return arguments.length===1&&(S=g,g=this),P.call(g,S)}}var E=function(g){return n in g};s.access=i&&a?{has:E,get:i,set:a}:i?{has:E,get:i}:{has:E,set:a}}try{return c(x,s)}finally{d.v=!0}}function e(c,n){if(c.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(c,n){if(typeof c!="function")throw new TypeError(n+" must be a function")}function u(c,n){var h=typeof n;if(c===1){if(h!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(h!=="function"){var l;throw c===0?l="field":c===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function f(c,n,h,l,o,w,p,D,x){var m=h[0],s,d,i;p?o===0||o===1?s={get:h[3],set:h[4]}:o===3?s={get:h[3]}:o===4?s={set:h[3]}:s={value:h[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var a,C,P;if(typeof m=="function")a=t(m,l,s,D,o,w,p,x,i),a!==void 0&&(u(o,a),o===0?d=a:o===1?(d=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a);else for(var E=m.length-1;E>=0;E--){var g=m[E];if(a=t(g,l,s,D,o,w,p,x,i),a!==void 0){u(o,a);var S;o===0?S=a:o===1?(S=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a,S!==void 0&&(d===void 0?d=S:typeof d=="function"?d=[d,S]:d.push(S))}}if(o===0||o===1){if(d===void 0)d=function(M,I){return I};else if(typeof d!="function"){var F=d;d=function(M,I){for(var A=I,L=0;L<F.length;L++)A=F[L].call(M,A);return A}}else{var j=d;d=function(M,I){return j.call(M,I)}}c.push(d)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),p?o===1?(c.push(function(M,I){return i.get.call(M,I)}),c.push(function(M,I){return i.set.call(M,I)})):o===2?c.push(i):c.push(function(M,I){return i.call(M,I)}):Object.defineProperty(n,l,s))}function y(c,n,h){for(var l=[],o,w,p=new Map,D=new Map,x=0;x<n.length;x++){var m=n[x];if(Array.isArray(m)){var s=m[1],d=m[2],i=m.length>3,a=s>=5,C,P;if(a?(C=c,s=s-5,w=w||[],P=w):(C=c.prototype,o=o||[],P=o),s!==0&&!i){var E=a?D:p,g=E.get(d)||0;if(g===!0||g===3&&s!==4||g===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!g&&s>2?E.set(d,s):E.set(d,!0)}f(l,C,m,d,s,a,i,P,h)}}return b(l,o),b(l,w),l}function b(c,n){n&&c.push(function(h){for(var l=0;l<n.length;l++)n[l].call(h);return h})}function T(c,n,h){if(n.length>0){for(var l=[],o=c,w=c.name,p=n.length-1;p>=0;p--){var D={v:!1};try{var x=n[p](o,{kind:"class",name:w,addInitializer:v(l,D),metadata:h})}finally{D.v=!0}x!==void 0&&(u(10,x),o=x)}return[N(o,h),function(){for(var m=0;m<l.length;m++)l[m].call(o)}]}}function N(c,n){return Object.defineProperty(c,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,h,l,o){if(o!==void 0)var w=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var p=Object.create(w===void 0?null:w),D=y(n,h,p);return l.length||N(n,p),{e:D,get c(){return T(n,l,p)}}}}function $i(v,t,e,r){return($i=Ba())(v,t,e,r)}var Gi,Ai,Bi,Ui,Xi,Hi,Yi,Li,Ri,Oi,Fi,zi,ji,Po;Gi=B({selector:"potatno-node",template:_i,style:Ni,modules:[Se],components:[Me]}),Bi=pt("node-drag"),Ui=$.state(),Xi=$.state({proxy:!0}),Hi=$.state({complexValue:!0}),Yi=$.state({complexValue:!0});var Vi=class{static{({e:[Li,Ri,Oi,Fi,zi,ji],c:[Po,Ai]}=$i(this,[[Bi,1,"mDrag"],[Ui,1,"isPreviewDisplaySelectionOpen"],[W,3,"nodeData"],[Xi,1,"nodeTransformation"],[Hi,1,"previewPorts"],[Yi,1,"previewDisplays"]],[Gi]))}constructor(t=O.use(G),e=O.use(H)){this.mComponent=t,this.mManager=e,this.mNodeDefinition=null,this.mNodeData=null,this.isPreviewDisplaySelectionOpen=!1,this.nodeTransformation={height:0,width:0},this.previewPorts=new Array,this.previewDisplays=new Array,this.mUnsubscribeNodeChange=this.mManager.subscribe(R.Node,r=>{r.item===this.mNodeData&&this.resyncComponent(this.nodeData)}),this.mUnsubscribeValidation=this.mManager.subscribe(R.SpecialValidation,()=>{this.mComponent.updater.updateAsync()})}mComponent;mManager;mNodeData;mNodeDefinition;mUnsubscribeNodeChange;mUnsubscribeValidation;get canPreview(){return this.previewPorts.length>0}#t=(ji(this),Li(this));get mDrag(){return this.#t}set mDrag(t){this.#t=t}get hasError(){if(this.mManager.integrity.errorItems.has(this.nodeData))return!0;for(let t of this.nodeData.inputs.list)if(this.mManager.integrity.errorItems.has(t))return!0;for(let t of this.nodeData.outputs.list)if(this.mManager.integrity.errorItems.has(t))return!0;return!1}get inputPorts(){return this.nodeData.inputs.list}get isFunction(){return this.mNodeDefinition instanceof yt}get isPreviewActive(){return!!this.nodeData.preview}#e=Ri(this);get isPreviewDisplaySelectionOpen(){return this.#e}set isPreviewDisplaySelectionOpen(t){this.#e=t}get nodeColor(){return this.mManager.generateStringColor(this.mNodeDefinition?.category.name??"")}get nodeData(){if(!this.mNodeData)throw new _("Node data not set.",this);return this.mNodeData}set nodeData(t){this.mNodeData=t,this.mNodeDefinition=null,this.mNodeData&&(this.mNodeDefinition=this.mManager.activeFunction.nodeDefinitions.find(e=>e.id===this.mNodeData.definitionId)??null,this.resyncComponent(t),this.mComponent.updater.update())}get nodeIcon(){return this.mNodeDefinition?.category.icon??""}get nodeLabel(){return this.nodeData.label??""}#o=Oi(this);get nodeTransformation(){return this.#o}set nodeTransformation(t){this.#o=t}get outputPorts(){return this.nodeData.outputs.list}#r=Fi(this);get previewPorts(){return this.#r}set previewPorts(t){this.#r=t}#n=zi(this);get previewDisplays(){return this.#n}set previewDisplays(t){this.#n=t}get previewDisplayId(){return this.nodeData.preview?.displayId??""}get previewDriver(){if(!this.nodeData.preview)return null;let t=this.nodeData.outputs.map.get(this.nodeData.preview.portDefinitionId);return t?this.mManager.preview.requestDriver(t,this.nodeData.preview.displayId):null}get previewPortDefinitionId(){return this.nodeData.preview?.portDefinitionId??""}dragNode(t){if(t.button===2&&this.mManager.graph.removeNode(this.nodeData),t.button!==0)return;let e=this.nodeData.transformation.x*this.mManager.grid.gridSize,r=this.nodeData.transformation.y*this.mManager.grid.gridSize,u=this.nodeData.transformation.x,f=this.nodeData.transformation.y,y=this.mComponent.element.getBoundingClientRect(),b=this.mComponent.element.offsetWidth?y.width/this.mComponent.element.offsetWidth:1,T=this.mComponent.element.offsetHeight?y.height/this.mComponent.element.offsetHeight:1,N=t.clientX,c=t.clientY,n=l=>{l.stopPropagation();let o=(l.clientX-N)/b,w=(l.clientY-c)/T,p=Math.round((e+o)/this.mManager.grid.gridSize),D=Math.round((r+w)/this.mManager.grid.gridSize);u===p&&f===D||(this.mManager.graph.transformNode(this.nodeData,x=>{x.moveTo(p,D)}),this.mDrag.dispatchEvent(new Co(p-u,D-f)),u=p,f=D)},h=()=>{document.removeEventListener("pointermove",n),document.removeEventListener("pointerup",h)};document.addEventListener("pointermove",n),document.addEventListener("pointerup",h)}onDeconstruct(){this.mUnsubscribeNodeChange(),this.mUnsubscribeValidation()}openFunction(){this.mNodeDefinition instanceof yt&&this.mManager.setActiveFunction(this.mNodeDefinition.function)}selectPreviewDisplay(t){this.mManager.graph.updateNode(this.nodeData,e=>{e.preview={portDefinitionId:e.preview.portDefinitionId,displayId:t}}),document.activeElement instanceof HTMLElement&&document.activeElement.blur()}selectPreviewPort(t){let e=(()=>{let r=this.previewPorts;return r.length===0?null:typeof t<"u"?r.find(u=>u.definitionId===t)??null:this.nodeData.preview?null:r[0]})();if(!e)return this.mManager.graph.updateNode(this.nodeData,r=>{r.preview=null});this.mManager.graph.updateNode(this.nodeData,r=>{let u=r.project.getFunction(r.function.definitionId),f=r.project.preview.availableDisplays(u,e.resolvedDataType);f.length===0&&(r.preview=null);let y=r.preview&&f.includes(r.preview.displayId)?r.preview.displayId:f[0];r.preview={portDefinitionId:e.definitionId,displayId:y}}),this.resyncComponent(this.nodeData)}getPreviewDisplays(t){if(!t)return new Array;let e=this.nodeData.outputs.map.get(t);if(!e)return new Array;let r=e.project.getFunction(e.node.function.definitionId);return r?e.project.preview.availableDisplays(r,e.resolvedDataType).map(f=>({id:f,label:e.project.preview.getDisplay(f)?.name??f})):new Array}getPreviewablePorts(t){let e=t.project.getFunction(t.function.definitionId);if(!this.mManager.activeFunction.dynamicNodeDefinitions.find(f=>f.id===t.definitionId))return new Array;let u=new Map;return t.outputs.value.filter(f=>{let y=f.resolvedDataType;if(u.has(y))return u.get(y);let b=t.project.preview.availableDisplays(e,f.resolvedDataType);return u.set(y,b.length>0),u.get(y)})}resyncComponent(t){let e=t.transformation.x*this.mManager.grid.gridSize,r=t.transformation.y*this.mManager.grid.gridSize;this.mComponent.element.style.setProperty("left",`${e}px`),this.mComponent.element.style.setProperty("top",`${r}px`),this.nodeTransformation.width=t.transformation.width,this.nodeTransformation.height=t.transformation.height,this.previewPorts=this.getPreviewablePorts(this.nodeData),this.previewDisplays=this.getPreviewDisplays(t.preview?.portDefinitionId??null)}static{Ai()}},Co=class{mX;mY;get x(){return this.mX}get y(){return this.mY}constructor(t,e){this.mX=t,this.mY=e}};var Wi=`:host {\r
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
.controls {\r
    /* Full size overlay without user interaction to contain the control icon */\r
    position: absolute;\r
    inset: 0;\r
    display: flex;\r
    align-items: flex-start;\r
    justify-content: flex-end;\r
    padding: 20px;\r
    pointer-events: none;\r
\r
    & .controls__icon {\r
        /* Reset pointer events none of parent. */\r
        pointer-events: auto;\r
\r
        --information-icon-background-color: var(--potatno-color-background-light);\r
        --information-background-color: var(--potatno-color-background);\r
        --information-icon-color: var(--potatno-color-accent);\r
        --information-border-color: var(--potatno-color-border);\r
        --information-shadow-color: var(--potatno-color-shadow);\r
    }\r
}`;var Zi=`<!-- Serves only as a background. -->\r
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
<div class="controls">\r
    <kg-information class="controls__icon">\r
        Controlls: Yes\r
    </kg-information>\r
</div>\r
\r
$if(this.popupPosition !== null) {\r
    <potatno-node-selection-popup (focusout)="this.popupPosition = null" style="left: {{this.popupPosition.local.x}}px; top: {{this.popupPosition.local.y}}px;" (node-select)="this.createNodeOnPopupPosition($event.value)"/>\r
}\r
`;function Ha(){function v(c,n){return function(l){e(n,"addInitializer"),r(l,"An initializer"),c.push(l)}}function t(c,n,h,l,o,w,p,D,x){var m;switch(o){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var s={kind:m,name:p?"#"+n:n,static:w,private:p,metadata:D},d={v:!1};s.addInitializer=v(l,d);var i,a;if(o===0?p?(i=h.get,a=h.set):(i=function(){return this[n]},a=function(g){this[n]=g}):o===2?i=function(){return h.value}:((o===1||o===3)&&(i=function(){return h.get.call(this)}),(o===1||o===4)&&(a=function(g){h.set.call(this,g)})),p)s.access=i&&a?{get:i,set:a}:i?{get:i}:{set:a};else{if(i){var C=i;i=function(g){return arguments.length===0&&(g=this),C.call(g)}}if(a){var P=a;a=function(g,S){return arguments.length===1&&(S=g,g=this),P.call(g,S)}}var E=function(g){return n in g};s.access=i&&a?{has:E,get:i,set:a}:i?{has:E,get:i}:{has:E,set:a}}try{return c(x,s)}finally{d.v=!0}}function e(c,n){if(c.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(c,n){if(typeof c!="function")throw new TypeError(n+" must be a function")}function u(c,n){var h=typeof n;if(c===1){if(h!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(h!=="function"){var l;throw c===0?l="field":c===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function f(c,n,h,l,o,w,p,D,x){var m=h[0],s,d,i;p?o===0||o===1?s={get:h[3],set:h[4]}:o===3?s={get:h[3]}:o===4?s={set:h[3]}:s={value:h[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var a,C,P;if(typeof m=="function")a=t(m,l,s,D,o,w,p,x,i),a!==void 0&&(u(o,a),o===0?d=a:o===1?(d=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a);else for(var E=m.length-1;E>=0;E--){var g=m[E];if(a=t(g,l,s,D,o,w,p,x,i),a!==void 0){u(o,a);var S;o===0?S=a:o===1?(S=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a,S!==void 0&&(d===void 0?d=S:typeof d=="function"?d=[d,S]:d.push(S))}}if(o===0||o===1){if(d===void 0)d=function(M,I){return I};else if(typeof d!="function"){var F=d;d=function(M,I){for(var A=I,L=0;L<F.length;L++)A=F[L].call(M,A);return A}}else{var j=d;d=function(M,I){return j.call(M,I)}}c.push(d)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),p?o===1?(c.push(function(M,I){return i.get.call(M,I)}),c.push(function(M,I){return i.set.call(M,I)})):o===2?c.push(i):c.push(function(M,I){return i.call(M,I)}):Object.defineProperty(n,l,s))}function y(c,n,h){for(var l=[],o,w,p=new Map,D=new Map,x=0;x<n.length;x++){var m=n[x];if(Array.isArray(m)){var s=m[1],d=m[2],i=m.length>3,a=s>=5,C,P;if(a?(C=c,s=s-5,w=w||[],P=w):(C=c.prototype,o=o||[],P=o),s!==0&&!i){var E=a?D:p,g=E.get(d)||0;if(g===!0||g===3&&s!==4||g===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!g&&s>2?E.set(d,s):E.set(d,!0)}f(l,C,m,d,s,a,i,P,h)}}return b(l,o),b(l,w),l}function b(c,n){n&&c.push(function(h){for(var l=0;l<n.length;l++)n[l].call(h);return h})}function T(c,n,h){if(n.length>0){for(var l=[],o=c,w=c.name,p=n.length-1;p>=0;p--){var D={v:!1};try{var x=n[p](o,{kind:"class",name:w,addInitializer:v(l,D),metadata:h})}finally{D.v=!0}x!==void 0&&(u(10,x),o=x)}return[N(o,h),function(){for(var m=0;m<l.length;m++)l[m].call(o)}]}}function N(c,n){return Object.defineProperty(c,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,h,l,o){if(o!==void 0)var w=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var p=Object.create(w===void 0?null:w),D=y(n,h,p);return l.length||N(n,p),{e:D,get c(){return T(n,l,p)}}}}function ki(v,t,e,r){return(ki=Ha())(v,t,e,r)}function Ya(v){return v}var ts,qi,es,os,Ji,Ki,Qi,to;ts=B({selector:"potatno-node-graph",template:Zi,style:Wi,components:[se,Po,To,Eo,Io]}),es=$.state(),os=$.state({complexValue:!0});new class extends Ya{constructor(){super(to),qi()}static{class v{static{({e:[Ji,Ki,Qi],c:[to,qi]}=ki(this,[[es,1,"popupPosition"],[os,1,"selectBox"]],[ts]))}static ZOOM_STRENGTH=.1;mComponent;mIsMouseInsideGrid;mKeyboardHandler;mManager;mUnsubscribeFunctionChange;mUnsubscribeGraphChange;#t=(Qi(this),Ji(this));get popupPosition(){return this.#t}set popupPosition(e){this.#t=e}#e=Ki(this);get selectBox(){return this.#e}set selectBox(e){this.#e=e}get gridBackgroundStyle(){let e=this.mManager.grid.gridSize*this.mManager.grid.zoom,r=this.mManager.grid.panX%e,u=this.mManager.grid.panY%e;return`--grid-size: ${e}px; --grid-position-x: ${r}px; --grid-position-y: ${u}px;`}get gridTransformStyle(){return`transform: translate(${this.mManager.grid.panX}px, ${this.mManager.grid.panY}px) scale(${this.mManager.grid.zoom})`}get nodes(){return this.mManager.activeFunction.nodes}get selectedNodes(){return this.mManager.grid.selectedNodes}constructor(e=O.use(G),r=O.use(H)){this.mComponent=e,this.mManager=r,this.mIsMouseInsideGrid=!1,this.popupPosition=null,this.selectBox=null,this.mManager.grid.gridElement=this.mComponent.element,e.element.addEventListener("pointerdown",u=>{this.onPointerDown(u)}),e.element.addEventListener("wheel",u=>{this.onScroll(u)}),e.element.addEventListener("contextmenu",u=>{u.preventDefault()}),e.element.addEventListener("pointerenter",()=>{this.mIsMouseInsideGrid=!0}),e.element.addEventListener("pointerleave",()=>{this.mIsMouseInsideGrid=!1}),e.element.addEventListener("dragover",u=>{this.mManager.grid.draggedPort.isDragging&&(u.preventDefault(),u.stopPropagation(),u.dataTransfer&&(u.dataTransfer.dropEffect="link"))}),e.element.addEventListener("drop",u=>{this.createDroppedConjunction(u)}),this.mKeyboardHandler=u=>{this.onKeyDown(u)},document.addEventListener("keydown",this.mKeyboardHandler),this.mUnsubscribeFunctionChange=this.mManager.subscribe(R.Document|R.Function|R.SpecialActiveFunction,()=>{this.popupPosition=null,this.selectBox=null}),this.mUnsubscribeGraphChange=this.mManager.subscribe(R.NodeAdd|R.NodeDelete|R.SpecialGrid|R.SpecialSelectNode,()=>{this.mComponent.updater.updateAsync()})}createNodeOnPopupPosition(e){let r=this.mManager.graph.addNode(this.mManager.activeFunction,e,{x:this.popupPosition?.grid.x??0,y:this.popupPosition?.grid.y??0,height:0,width:0});this.popupPosition=null,this.selectNodes([r],!1)}moveAllSelected(e,r){for(let u of this.mManager.grid.selectedNodes)u!==e&&this.mManager.graph.transformNode(u,f=>{f.moveTo(f.transformation.x+r.x,f.transformation.y+r.y)})}onDeconstruct(){this.mUnsubscribeFunctionChange(),this.mUnsubscribeGraphChange(),document.removeEventListener("keydown",this.mKeyboardHandler)}selectNodes(e,r){let u=!!r;r instanceof PointerEvent&&(r.stopPropagation(),u=r.ctrlKey);let f=new Set,y=new Set(this.mManager.grid.selectedNodes);if(!u)if(e.length===1&&y.has(e.at(0)))for(let T of y)f.add(T);else y.clear();let b=[...e];for(let T of b)f.has(T)||(f.add(T),T.definitionId===bt.DEFINITION_ID&&b.push(...this.getNodesInRectangle({top:T.transformation.y,right:T.transformation.x+T.transformation.width,bottom:T.transformation.y+T.transformation.height,left:T.transformation.x})),y.has(T)?y.delete(T):y.add(T));this.mManager.grid.selectNodes([...y])}typeOfNode(e){switch(e.definitionId){case bt.DEFINITION_ID:return"comment";case k.DEFINITION_ID:case Z.DEFINITION_ID:return"conjunction";default:return"node"}}convertGlobalToGridLocalPosition(e,r){let u=this.mComponent.element.getBoundingClientRect();return{x:e-u.left,y:r-u.top}}createDroppedConjunction(e){if(!this.mManager.grid.draggedPort.isDragging)return;e.preventDefault(),e.stopPropagation();let r=this.mManager.grid.draggedPort.ports.filter(b=>!(b.direction==="output"&&b.portType==="flow"&&b.connectedPorts.size>0||b.direction==="input"&&b.portType==="value"&&b.connectedPorts.size>0));if(r.length===0)return;let u=this.mManager.grid.draggedPort.ports[0].portType==="flow"?this.mManager.project.nodeDefinitions.get(Z.DEFINITION_ID):this.mManager.project.nodeDefinitions.get(k.DEFINITION_ID),f=this.mManager.grid.pixelToGridSpace(e.clientX,e.clientY),y=this.mManager.graph.addNode(this.mManager.activeFunction,u,{x:f.x,y:f.y,height:0,width:0});this.mManager.graph.connectConjunction(y,r)}getNodesInRectangle(e){let r=new Array;for(let u of this.mManager.activeFunction.nodes){let f=u.transformation.y,y=u.transformation.x,b=y+u.transformation.width,T=f+u.transformation.height;if(y<e.right&&b>e.left&&f<e.bottom&&T>e.top){if(e.top>f&&e.right<b&&e.bottom<T&&e.left>y)continue;r.push(u)}}return r}onKeyDown(e){if(!this.mIsMouseInsideGrid)return;let r=document.activeElement;if(!(r instanceof HTMLInputElement||r instanceof HTMLTextAreaElement||r instanceof HTMLSelectElement)){switch(e.key){case"Escape":{this.popupPosition=null;return}case"Delete":{for(let u of this.mManager.grid.selectedNodes)this.mManager.graph.removeNode(u);this.selectNodes([],!1);return}}if(e.ctrlKey)switch(e.key){case"z":{e.preventDefault(),this.mManager.history.undo();return}case"y":{e.preventDefault(),this.mManager.history.redo();return}case"c":{this.mManager.clipboard.copy(this.mManager.grid.selectedNodes);return}case"v":e.preventDefault(),this.pasteFromClipboard()}}}onPointerDown(e){switch(e.button){case 0:{e.ctrlKey||this.selectNodes([],!1),this.pointerDrag(e,"selecting");return}case 1:{e.preventDefault(),this.pointerDrag(e,"panning");return}case 2:{this.openNodeSelectionPopupAtPointer(e.clientX,e.clientY);return}}}onScroll(e){e.preventDefault();let r=e.deltaY>0?-1:1,u=this.convertGlobalToGridLocalPosition(e.clientX,e.clientY);this.mManager.grid.zoomAt(u.x,u.y,r*v.ZOOM_STRENGTH)}openNodeSelectionPopupAtPointer(e,r){let u=this.mComponent.element,f=this.convertGlobalToGridLocalPosition(e,r),y=this.mManager.grid.pixelToGridSpace(e,r),b=8,T=Math.max(0,u.clientWidth-se.POPUP_WIDTH-b),N=Math.max(0,u.clientHeight-se.POPUP_HEIGHT-b);this.popupPosition={local:{x:Math.max(b,Math.min(f.x,T)),y:Math.max(b,Math.min(f.y,N))},grid:y}}pasteFromClipboard(){let e=this.mManager.clipboard.paste();e.length!==0&&this.selectNodes(e,!1)}pointerDrag(e,r){let u=this.mManager.grid.pixelToGridPixelSpace(e.clientX,e.clientY),f={x:e.clientX,y:e.clientY},y=T=>{switch(r){case"panning":{this.mManager.grid.pan(T.clientX-f.x,T.clientY-f.y),f.x=T.clientX,f.y=T.clientY;break}case"selecting":{let N=this.mManager.grid.pixelToGridPixelSpace(T.clientX,T.clientY);this.selectBox={x:Math.min(u.x,N.x),y:Math.min(u.y,N.y),width:Math.abs(N.x-u.x),height:Math.abs(N.y-u.y)};break}}},b=T=>{if(document.removeEventListener("pointermove",y),document.removeEventListener("pointerup",b),r==="selecting"&&this.selectBox){let N=this.mManager.grid.gridPixelSpaceToGridSpace({x:this.selectBox.x,y:this.selectBox.y},!1),c=this.mManager.grid.gridPixelSpaceToGridSpace({x:this.selectBox.x+this.selectBox.width,y:this.selectBox.y+this.selectBox.height},!1),n=this.getNodesInRectangle({top:N.y,right:c.x,bottom:c.y,left:N.x});this.selectNodes(n,T.ctrlKey),this.selectBox=null}};document.addEventListener("pointermove",y),document.addEventListener("pointerup",b)}}}};var ae=class{mCodeGenerator;mId;mLabel;mNodesProvider;mStatics;get codeGenerator(){return this.mCodeGenerator}get id(){return this.mId}get label(){return this.mLabel}get statics(){return this.mStatics}constructor(t){this.mId=t.id,this.mLabel=t.label,this.mNodesProvider=t.nodes,this.mStatics=t.statics,this.mCodeGenerator=t.generator.code}getNodeDefinitions(t){let e=u=>{if(!u)return new Array;let f=new Array;return u(y=>{f.push(y)},t),f},r={};return Object.defineProperty(r,"entry",{get:()=>e(this.mNodesProvider.entry)}),Object.defineProperty(r,"exit",{get:()=>e(this.mNodesProvider.exit)}),Object.defineProperty(r,"dynamic",{get:()=>e(this.mNodesProvider.dynamic)}),r}},Ft={none:0,imports:1,inputs:2,outputs:4};var rs=`:host {\r
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
}`;var ns=`<kg-resize-box class="resize-box" left="true" width="250">\r
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
`;function qa(){function v(c,n){return function(l){e(n,"addInitializer"),r(l,"An initializer"),c.push(l)}}function t(c,n,h,l,o,w,p,D,x){var m;switch(o){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var s={kind:m,name:p?"#"+n:n,static:w,private:p,metadata:D},d={v:!1};s.addInitializer=v(l,d);var i,a;if(o===0?p?(i=h.get,a=h.set):(i=function(){return this[n]},a=function(g){this[n]=g}):o===2?i=function(){return h.value}:((o===1||o===3)&&(i=function(){return h.get.call(this)}),(o===1||o===4)&&(a=function(g){h.set.call(this,g)})),p)s.access=i&&a?{get:i,set:a}:i?{get:i}:{set:a};else{if(i){var C=i;i=function(g){return arguments.length===0&&(g=this),C.call(g)}}if(a){var P=a;a=function(g,S){return arguments.length===1&&(S=g,g=this),P.call(g,S)}}var E=function(g){return n in g};s.access=i&&a?{has:E,get:i,set:a}:i?{has:E,get:i}:{has:E,set:a}}try{return c(x,s)}finally{d.v=!0}}function e(c,n){if(c.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(c,n){if(typeof c!="function")throw new TypeError(n+" must be a function")}function u(c,n){var h=typeof n;if(c===1){if(h!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(h!=="function"){var l;throw c===0?l="field":c===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function f(c,n,h,l,o,w,p,D,x){var m=h[0],s,d,i;p?o===0||o===1?s={get:h[3],set:h[4]}:o===3?s={get:h[3]}:o===4?s={set:h[3]}:s={value:h[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var a,C,P;if(typeof m=="function")a=t(m,l,s,D,o,w,p,x,i),a!==void 0&&(u(o,a),o===0?d=a:o===1?(d=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a);else for(var E=m.length-1;E>=0;E--){var g=m[E];if(a=t(g,l,s,D,o,w,p,x,i),a!==void 0){u(o,a);var S;o===0?S=a:o===1?(S=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a,S!==void 0&&(d===void 0?d=S:typeof d=="function"?d=[d,S]:d.push(S))}}if(o===0||o===1){if(d===void 0)d=function(M,I){return I};else if(typeof d!="function"){var F=d;d=function(M,I){for(var A=I,L=0;L<F.length;L++)A=F[L].call(M,A);return A}}else{var j=d;d=function(M,I){return j.call(M,I)}}c.push(d)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),p?o===1?(c.push(function(M,I){return i.get.call(M,I)}),c.push(function(M,I){return i.set.call(M,I)})):o===2?c.push(i):c.push(function(M,I){return i.call(M,I)}):Object.defineProperty(n,l,s))}function y(c,n,h){for(var l=[],o,w,p=new Map,D=new Map,x=0;x<n.length;x++){var m=n[x];if(Array.isArray(m)){var s=m[1],d=m[2],i=m.length>3,a=s>=5,C,P;if(a?(C=c,s=s-5,w=w||[],P=w):(C=c.prototype,o=o||[],P=o),s!==0&&!i){var E=a?D:p,g=E.get(d)||0;if(g===!0||g===3&&s!==4||g===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!g&&s>2?E.set(d,s):E.set(d,!0)}f(l,C,m,d,s,a,i,P,h)}}return b(l,o),b(l,w),l}function b(c,n){n&&c.push(function(h){for(var l=0;l<n.length;l++)n[l].call(h);return h})}function T(c,n,h){if(n.length>0){for(var l=[],o=c,w=c.name,p=n.length-1;p>=0;p--){var D={v:!1};try{var x=n[p](o,{kind:"class",name:w,addInitializer:v(l,D),metadata:h})}finally{D.v=!0}x!==void 0&&(u(10,x),o=x)}return[N(o,h),function(){for(var m=0;m<l.length;m++)l[m].call(o)}]}}function N(c,n){return Object.defineProperty(c,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,h,l,o){if(o!==void 0)var w=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var p=Object.create(w===void 0?null:w),D=y(n,h,p);return l.length||N(n,p),{e:D,get c(){return T(n,l,p)}}}}function cs(v,t,e,r){return(cs=qa())(v,t,e,r)}var us,is,hs,ss,as,Mo;us=B({selector:"potatno-function-properties",template:ns,style:rs,components:[Pt]}),hs=$.state({complexValue:!0});var ls=class{static{({e:[ss,as],c:[Mo,is]}=cs(this,[[hs,1,"functionProperties"]],[us]))}constructor(t=O.use(H)){this.mManager=t,this.mSelectedImportId="",this.mProjectTypes=new Set,this.functionProperties=this.convertFunctionProperties(),this.mUnsubscribe=this.mManager.subscribe(R.Document|R.Function|R.SpecialActiveFunction,()=>{this.mProjectTypes.clear();for(let[e]of this.mManager.project.types.types)this.mProjectTypes.add(e);this.functionProperties=this.convertFunctionProperties()})}mManager;mProjectTypes;mSelectedImportId;mUnsubscribe;#t=(as(this),ss(this));get functionProperties(){return this.#t}set functionProperties(t){this.#t=t}get projectTypes(){return this.mProjectTypes}get selectedImportId(){return this.mSelectedImportId}set selectedImportId(t){this.mSelectedImportId=t}get unusedImports(){return this.mManager.activeFunction.project.imports.filter(t=>!this.functionProperties.imports.find(e=>t.id===e.id))}addPort(t){let e=this.projectTypes.values().next().value;if(!e)return;let r=t===this.functionProperties.inputs?"Input":"Output";t.push({label:r,dataType:e,hasError:!1}),this.submitChange()}addSelectedImport(){let t=this.unusedImports;if(t.length===0)return;let e=t.find(r=>r.id===this.mSelectedImportId);e||(e=t.at(0)),this.functionProperties.imports.push(e),this.submitChange()}deleteImport(t){let e=this.functionProperties.imports.indexOf(t);e!==-1&&(this.functionProperties.imports.splice(e,1),this.submitChange())}deletePort(t,e){let r=e.indexOf(t);r!==-1&&(e.splice(r,1),this.submitChange())}onDeconstruct(){this.mUnsubscribe()}async submitChange(){let t=!1,e=new Set;for(let y of this.functionProperties.inputs)y.hasError=e.has(y.label),t||=y.hasError,e.add(y.label);let r=new Set;for(let y of this.functionProperties.outputs)y.hasError=r.has(y.label),t||=y.hasError,r.add(y.label);if(t){this.functionProperties=this.functionProperties;return}let u=this.mManager.activeFunction,f=this.functionProperties;await new Promise(y=>{globalThis.setTimeout(y,10)}),this.mManager.graph.updateFunction(u,y=>{if(y.label=f.label,!f.statics.inputs){for(;y.inputs.length>0;)y.removeInput(y.inputs.at(0));for(let b of f.inputs)y.addInput({dataType:b.dataType,label:b.label})}if(!f.statics.outputs){for(;y.outputs.length>0;)y.removeOutput(y.outputs.at(0));for(let b of f.outputs)y.addOutput({dataType:b.dataType,label:b.label})}if(!f.statics.imports){for(let b of y.imports)y.removeImport(b);for(let b of f.imports)y.addImport(b.id)}})}convertFunctionProperties(){let t={label:"",inputs:new Array,outputs:new Array,imports:new Array,statics:{label:!0,imports:!0,inputs:!0,outputs:!0}},e=this.mManager.activeFunction,r=e.project.getFunction(e.definitionId);r&&(t.statics.label=e.isSystem,t.statics.imports=(r.statics&Ft.imports)!==0,t.statics.inputs=(r.statics&Ft.inputs)!==0,t.statics.outputs=(r.statics&Ft.outputs)!==0),t.label=e.label;for(let u of e.project.imports)e.imports.has(u.id)&&t.imports.push({id:u.id,label:u.label});for(let u of e.inputs)t.inputs.push({label:u.label,dataType:u.dataType,hasError:!1});for(let u of e.outputs)t.outputs.push({label:u.label,dataType:u.dataType,hasError:!1});return t}static{is()}};var eo=class{mDependencies;mDocument;mEntryPoint;get code(){return this.mDocument.project.generator.code(this)}get dependencies(){return this.mDependencies}get entryPoint(){return this.mEntryPoint}constructor(t,e,r){this.mDocument=t,this.mEntryPoint=e,this.mDependencies=r}};var oo=class{mFunction;mGraphs;get code(){let t=this.mFunction.project.getFunction(this.mFunction.definitionId);if(!t)throw new _("Function result has an invalid function definition id.",this);return t.codeGenerator.body(this)}get function(){return this.mFunction}get graphs(){return Array.from(this.mGraphs.values())}constructor(t){this.mFunction=t,this.mGraphs=new Map}addGraph(t){this.mGraphs.set(t.entryNode.definitionId,t)}graphResultOf(t){return this.mGraphs.get(t)}};var ro=class{mBodyCode;mDependencies;mEntryNode;mExitNode;mNodeIds;mPorts;get code(){return this.mBodyCode}get dependencies(){return this.mDependencies}get entryNode(){return this.mEntryNode}get exitNode(){return this.mExitNode}get nodes(){return this.mNodeIds}get ports(){return this.mPorts}constructor(t){this.mBodyCode=t.bodyCode,this.mDependencies=[...t.dependencies],this.mEntryNode=t.entryNode,this.mExitNode=t.exitNode,this.mNodeIds=t.nodeIds,this.mPorts=t.portValues}};var le=class{mProject;constructor(t){this.mProject=t}generateDocument(t,e=!1){let r=[...t.functions].find(u=>u.isSystem);if(!r)throw new _("No entry point function found for code generation.",this);return this.generateFunction(r,e)}generateFunction(t,e=!1){return this.buildDocumentResult(t.document,t.getExitNodes(),e)}generateNode(t,e=!1){return this.buildDocumentResult(t.document,[t],e)}buildDocumentResult(t,e,r){if(t.validate().errors.length>0)throw new _("Code generation exited. Code graph validation failed.",this);let f={counter:{nodeIndex:0,portIndex:0},debug:r,nodeDefinitions:new Map},y=this.generateFunctionWithDependencies(f,e,new Set),b=y.pop();return new eo(t,b,y)}countNodeEncounter(t,e){let r=new Map,u=new Set,f=new Array(t);for(;f.length>0;){let y=f.pop();if(r.set(y,(r.get(y)??0)+1),!(y===e||u.has(y))){u.add(y);for(let b of y.inputs.flow)for(let T of this.resolveFlowConjunctions(b))f.push(T.node);for(let b of y.inputs.value){let T=this.resolveValueConjunctions(b);T&&f.push(T.node)}}}return r}createScope(t,e){return{emittedNodes:new Set,remaining:this.countNodeEncounter(t,e)}}emitNode(t,e,r,u,f){if(!t.nodeDefinitions.get(r.function)){let l=new Map;for(let o of r.function.nodeDefinitions)l.set(o.id,o);t.nodeDefinitions.set(r.function,l)}let y=t.nodeDefinitions.get(r.function).get(r.definitionId);if(!y)throw new _(`Node definition "${r.definitionId}" not found for node "${r.label}".`,this);y instanceof yt&&e.dependencies.push(y.function);let b={},T=new Array;for(let l of r.inputs.value){let o=this.resolveInputValue(t,e,l);b[l.definitionId]=o.inputPort,e.ports.set(l,o.inputPort.value),o.emitResult&&T.push(o.emitResult)}let N={};for(let l of r.outputs.list)N[l.definitionId]={value:this.generatePortValue(t,e,l),code:{inner:u[l.definitionId]??""}};let c=y.codeGenerator({inputs:b,outputs:N,code:{next:f??""}}),n=this.getGeneratedNodeId(t,e,r);t.debug&&(c=this.mProject.generator.value.hook(`start-${n}`)+c+this.mProject.generator.value.hook(`end-${n}`));let h=new Array;for(let l of T)h.push(...l.codeOutput);return h.push(c),{codeOutput:h,lastGeneratedNode:r,endFlowPort:null}}findBranchStartPoint(t){let e=this.getNodesInputFlowPorts(t),r=e.length,u=new Map,f=new Array,y=(b,T)=>{let N=(u.has(b)||u.set(b,new Set),u.get(b)),c=N.size;for(let n of T)N.add(n);return N.size>c&&f.push(b),N};for(let[b,T]of e.entries())y(T.node,[b]);for(;f.length>0;){let b=f.shift(),T=u.get(b);for(let N of this.getNodesInputFlowPorts(b))if(y(N.node,T).size===r)return N.node}throw new _("No common branch point found for merge node.",this)}generateFunctionWithDependencies(t,e,r){let u=new Array;if(e.length===0)return u;let f=e.at(0).function;r.add(f);let y=new oo(f);u.push(y);for(let b of e){let T=this.generateNodeCode(t,b);y.addGraph(T);for(let N of T.dependencies)r.has(N)||u.push(...this.generateFunctionWithDependencies(t,N.getExitNodes(),r))}return u.reverse()}generateNodeCode(t,e){let r={dependencies:new Array,nodes:new Map,ports:new Map,scope:this.createScope(e,null)},u=this.walkBackward(t,r,e,null),f=u.codeOutput.join(" ");return new ro({bodyCode:f,dependencies:r.dependencies,entryNode:u.lastGeneratedNode,exitNode:e,nodeIds:new Map(r.nodes),portValues:new Map(r.ports)})}generatePortValue(t,e,r){if(!e.ports.has(r)){let u=this.mProject.generator.value.name(r.label),f=this.mProject.generator.value.id(u,t.counter.portIndex++);e.ports.set(r,f)}return e.ports.get(r)}getGeneratedNodeId(t,e,r){if(!e.nodes.has(r)){let f=(++t.counter.nodeIndex).toString(16).toUpperCase().padStart(8,"0");e.nodes.set(r,f)}return e.nodes.get(r)}getNodesInputFlowPorts(t){let e=new Array;for(let r of t.inputs.flow)e.push(...this.resolveFlowConjunctions(r));return[...new Set(e)]}handleFlowMerge(t,e,r,u,f){let y=f.join(" "),b=this.findBranchStartPoint(r),T={},N=e.scope;try{for(let c of u){e.scope=this.createScope(c.node,b);let n=this.walkBackward(t,e,c.node,b);T[n.endFlowPort.definitionId]=n.codeOutput.join(" ")}}finally{e.scope=N}return this.emitNode(t,e,b,T,y)}resolveFlowConjunctions(t){let e=new Array;for(let r of t.connectedPorts){if(r.node.definitionId!==Z.DEFINITION_ID){e.push(r);continue}let u=r.node.inputs.flow[0];!u||u.connectedPorts.size===0||e.push(...this.resolveFlowConjunctions(u))}return e}resolveInputValue(t,e,r){let u=this.resolveValueConjunctions(r);if(!u){if(this.mProject.types.isGenericType(r.dataType))throw new _("Generic value inputs must be allways connected",this);return{inputPort:{value:this.mProject.types.getType(r.dataType).convert([...r.directValue]),isDirectValue:!0},emitResult:null}}let f=u.node,y=!f.hasFlowPorts,b=(()=>{if(!f.hasFlowPorts){if(e.scope.emittedNodes.has(f))return null;let T=e.scope.remaining.get(f);if(y&&(T=0),e.scope.remaining.set(f,T),T<=0)return e.scope.emittedNodes.add(f),this.emitNode(t,e,f,{})}return null})();return{inputPort:{value:this.generatePortValue(t,e,u),isDirectValue:!1},emitResult:b}}resolveValueConjunctions(t){if(t.connectedPorts.size===0)return null;let e=t.connectedPorts.values().next().value;if(e.node.definitionId!==k.DEFINITION_ID)return e;let r=e.node.inputs.value[0];return!r||r.connectedPorts.size===0?null:this.resolveValueConjunctions(r)}walkBackward(t,e,r,u){let f={codeOutput:new Array,lastGeneratedNode:null,endFlowPort:null},y=null,b=r;for(;b!==null&&b!==u;){let T={};y!==null&&(T[y.definitionId]=f.codeOutput.join(" "),f.codeOutput=new Array);let N=f.codeOutput;f=this.emitNode(t,e,b,T),f.codeOutput=[...f.codeOutput,...N];let c=this.getNodesInputFlowPorts(b);if(c.length===0)break;c.length>1&&(f=this.handleFlowMerge(t,e,b,c,f.codeOutput),c=this.getNodesInputFlowPorts(f.lastGeneratedNode)),y=c[0]??null,b=y?.node??null}if(!f.lastGeneratedNode)throw new _(`Walk did not reach an entry node from exit "${r.label}".`,this);if(u&&b!==u)throw new _("Malformed graph. End node not reached",this);return f.endFlowPort=y,f}};var lt=class{static MAIN="MAIN";mBuild;mDefaultParameters;mFunction;mTypes;get defaultParameters(){return this.mDefaultParameters}get function(){return this.mFunction}get types(){return this.mTypes}constructor(t,e){this.mFunction=t,this.mDefaultParameters=e.defaultParameters,this.mTypes=new Set(e.types),this.mBuild=e.build}compile(t,e){return this.mBuild({defaultParameters:this.mDefaultParameters,function:this.mFunction,projectTypes:t.entryPoint.function.project.types},t,e)}};var ds=`:host {\r
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
}`;var fs=`<kg-resize-box class="resize-box" left="true" top="true">\r
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
`;function Qa(){function v(c,n){return function(l){e(n,"addInitializer"),r(l,"An initializer"),c.push(l)}}function t(c,n,h,l,o,w,p,D,x){var m;switch(o){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var s={kind:m,name:p?"#"+n:n,static:w,private:p,metadata:D},d={v:!1};s.addInitializer=v(l,d);var i,a;if(o===0?p?(i=h.get,a=h.set):(i=function(){return this[n]},a=function(g){this[n]=g}):o===2?i=function(){return h.value}:((o===1||o===3)&&(i=function(){return h.get.call(this)}),(o===1||o===4)&&(a=function(g){h.set.call(this,g)})),p)s.access=i&&a?{get:i,set:a}:i?{get:i}:{set:a};else{if(i){var C=i;i=function(g){return arguments.length===0&&(g=this),C.call(g)}}if(a){var P=a;a=function(g,S){return arguments.length===1&&(S=g,g=this),P.call(g,S)}}var E=function(g){return n in g};s.access=i&&a?{has:E,get:i,set:a}:i?{has:E,get:i}:{has:E,set:a}}try{return c(x,s)}finally{d.v=!0}}function e(c,n){if(c.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(c,n){if(typeof c!="function")throw new TypeError(n+" must be a function")}function u(c,n){var h=typeof n;if(c===1){if(h!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(h!=="function"){var l;throw c===0?l="field":c===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function f(c,n,h,l,o,w,p,D,x){var m=h[0],s,d,i;p?o===0||o===1?s={get:h[3],set:h[4]}:o===3?s={get:h[3]}:o===4?s={set:h[3]}:s={value:h[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var a,C,P;if(typeof m=="function")a=t(m,l,s,D,o,w,p,x,i),a!==void 0&&(u(o,a),o===0?d=a:o===1?(d=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a);else for(var E=m.length-1;E>=0;E--){var g=m[E];if(a=t(g,l,s,D,o,w,p,x,i),a!==void 0){u(o,a);var S;o===0?S=a:o===1?(S=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a,S!==void 0&&(d===void 0?d=S:typeof d=="function"?d=[d,S]:d.push(S))}}if(o===0||o===1){if(d===void 0)d=function(M,I){return I};else if(typeof d!="function"){var F=d;d=function(M,I){for(var A=I,L=0;L<F.length;L++)A=F[L].call(M,A);return A}}else{var j=d;d=function(M,I){return j.call(M,I)}}c.push(d)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),p?o===1?(c.push(function(M,I){return i.get.call(M,I)}),c.push(function(M,I){return i.set.call(M,I)})):o===2?c.push(i):c.push(function(M,I){return i.call(M,I)}):Object.defineProperty(n,l,s))}function y(c,n,h){for(var l=[],o,w,p=new Map,D=new Map,x=0;x<n.length;x++){var m=n[x];if(Array.isArray(m)){var s=m[1],d=m[2],i=m.length>3,a=s>=5,C,P;if(a?(C=c,s=s-5,w=w||[],P=w):(C=c.prototype,o=o||[],P=o),s!==0&&!i){var E=a?D:p,g=E.get(d)||0;if(g===!0||g===3&&s!==4||g===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!g&&s>2?E.set(d,s):E.set(d,!0)}f(l,C,m,d,s,a,i,P,h)}}return b(l,o),b(l,w),l}function b(c,n){n&&c.push(function(h){for(var l=0;l<n.length;l++)n[l].call(h);return h})}function T(c,n,h){if(n.length>0){for(var l=[],o=c,w=c.name,p=n.length-1;p>=0;p--){var D={v:!1};try{var x=n[p](o,{kind:"class",name:w,addInitializer:v(l,D),metadata:h})}finally{D.v=!0}x!==void 0&&(u(10,x),o=x)}return[N(o,h),function(){for(var m=0;m<l.length;m++)l[m].call(o)}]}}function N(c,n){return Object.defineProperty(c,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,h,l,o){if(o!==void 0)var w=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var p=Object.create(w===void 0?null:w),D=y(n,h,p);return l.length||N(n,p),{e:D,get c(){return T(n,l,p)}}}}function xs(v,t,e,r){return(xs=Qa())(v,t,e,r)}var Ts,ms,Ds,Es,Is,Cs,ps,gs,vs,ys,bs,So;Ts=B({selector:"potatno-preview",template:fs,style:ds,modules:[Se],components:[Pt]}),Ds=$.state(),Es=$.state(),Is=$.state(),Cs=$.state();var ws=class{static{({e:[ps,gs,vs,ys,bs],c:[So,ms]}=xs(this,[[Ds,1,"mSelectedDisplayId"],[Es,1,"mSelectedOutputId"],[Is,1,"selectedTab"],[Cs,1,"previewCode"]],[Ts]))}constructor(t=O.use(G),e=O.use(H)){this.mComponent=t,this.mManager=e,this.mSelectedDisplayId="",this.mSelectedOutputId="",this.selectedTab="preview",this.previewCode="";let r=R.NodeUpdate|R.NodeAdd|R.NodeDelete;this.mPreviewTargets=this.findFunctionPreviewTargets(),this.mUnsubscribeOutputFetch=this.mManager.subscribe(R.SpecialActiveFunction|r,()=>{this.mPreviewTargets=this.findFunctionPreviewTargets()}),this.mUnsubscribeErrorResolve=this.mManager.subscribe(R.SpecialActiveFunction|r|R.Connection,()=>{this.mComponent.updater.updateAsync()});let u=0;this.mManager.subscribe(R.Any,()=>{globalThis.clearTimeout(u),u=globalThis.setTimeout(()=>{this.previewCode=this.generateFunctionCode()},1e3)})}mComponent;mManager;mPreviewTargets;mUnsubscribeErrorResolve;mUnsubscribeOutputFetch;#t=(bs(this),ps(this));get mSelectedDisplayId(){return this.#t}set mSelectedDisplayId(t){this.#t=t}#e=gs(this);get mSelectedOutputId(){return this.#e}set mSelectedOutputId(t){this.#e=t}#o=vs(this);get selectedTab(){return this.#o}set selectedTab(t){this.#o=t}#r=ys(this);get previewCode(){return this.#r}set previewCode(t){this.#r=t}get displayOptions(){let t=this.mPreviewTargets.get(this.selectedOutputId);return t?t.displays:new Map}get errors(){return this.mManager.integrity.errors}get outputOptions(){return this.mPreviewTargets}get previewDriver(){let t=this.mPreviewTargets.get(this.selectedOutputId);return t?this.mManager.preview.requestDriver(t.target,this.selectedDisplayId):null}get selectedDisplayId(){let t=this.displayOptions;if(!t.has(this.mSelectedDisplayId)){let e=t.keys().next().value;typeof e<"u"&&(this.mSelectedDisplayId=e)}return this.mSelectedDisplayId}set selectedDisplayId(t){this.mSelectedDisplayId=t}get selectedOutputId(){let t=this.outputOptions;if(!t.has(this.mSelectedOutputId)){let e=t.keys().next().value;typeof e<"u"&&(this.mSelectedOutputId=e)}return this.mSelectedOutputId}set selectedOutputId(t){this.mSelectedOutputId=t}onDeconstruct(){this.mUnsubscribeErrorResolve(),this.mUnsubscribeOutputFetch()}openNode(t){this.mManager.grid.selectNodes([t],!0)}findFunctionPreviewTargets(){let t=new Map,e=this.mManager.activeFunction,r=e.project.getFunction(e.definitionId);if(!r)return t;let u=b=>{let T=new Map;for(let N of b)T.set(N,e.project.preview.getDisplay(N).name);return T},f=e.project.preview.availableDisplays(r,lt.MAIN);f.length>0&&t.set(lt.MAIN,{label:lt.MAIN,target:e,displays:u(f)});let y=new Map;for(let b of e.getExitNodes())for(let T of b.inputs.value){let N=T.resolvedDataType;y.has(N)||y.set(N,T.project.preview.availableDisplays(r,N));let c=y.get(N);c.length!==0&&t.set(T.definitionId,{label:T.label,target:T,displays:u(c)})}return t}generateFunctionCode(){if(!this.mManager.integrity.isValid)return"";let t=this.mManager.activeFunction;return new le(t.project).generateFunction(t,!1).code}static{ms()}};var Ps=`:host {\r
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
}`;var Ms=`<div class="editor">\r
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
</div>`;function el(){function v(c,n){return function(l){e(n,"addInitializer"),r(l,"An initializer"),c.push(l)}}function t(c,n,h,l,o,w,p,D,x){var m;switch(o){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var s={kind:m,name:p?"#"+n:n,static:w,private:p,metadata:D},d={v:!1};s.addInitializer=v(l,d);var i,a;if(o===0?p?(i=h.get,a=h.set):(i=function(){return this[n]},a=function(g){this[n]=g}):o===2?i=function(){return h.value}:((o===1||o===3)&&(i=function(){return h.get.call(this)}),(o===1||o===4)&&(a=function(g){h.set.call(this,g)})),p)s.access=i&&a?{get:i,set:a}:i?{get:i}:{set:a};else{if(i){var C=i;i=function(g){return arguments.length===0&&(g=this),C.call(g)}}if(a){var P=a;a=function(g,S){return arguments.length===1&&(S=g,g=this),P.call(g,S)}}var E=function(g){return n in g};s.access=i&&a?{has:E,get:i,set:a}:i?{has:E,get:i}:{has:E,set:a}}try{return c(x,s)}finally{d.v=!0}}function e(c,n){if(c.v)throw new Error("attempted to call "+n+" after decoration was finished")}function r(c,n){if(typeof c!="function")throw new TypeError(n+" must be a function")}function u(c,n){var h=typeof n;if(c===1){if(h!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&r(n.get,"accessor.get"),n.set!==void 0&&r(n.set,"accessor.set"),n.init!==void 0&&r(n.init,"accessor.init")}else if(h!=="function"){var l;throw c===0?l="field":c===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function f(c,n,h,l,o,w,p,D,x){var m=h[0],s,d,i;p?o===0||o===1?s={get:h[3],set:h[4]}:o===3?s={get:h[3]}:o===4?s={set:h[3]}:s={value:h[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),o===1?i={get:s.get,set:s.set}:o===2?i=s.value:o===3?i=s.get:o===4&&(i=s.set);var a,C,P;if(typeof m=="function")a=t(m,l,s,D,o,w,p,x,i),a!==void 0&&(u(o,a),o===0?d=a:o===1?(d=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a);else for(var E=m.length-1;E>=0;E--){var g=m[E];if(a=t(g,l,s,D,o,w,p,x,i),a!==void 0){u(o,a);var S;o===0?S=a:o===1?(S=a.init,C=a.get||i.get,P=a.set||i.set,i={get:C,set:P}):i=a,S!==void 0&&(d===void 0?d=S:typeof d=="function"?d=[d,S]:d.push(S))}}if(o===0||o===1){if(d===void 0)d=function(M,I){return I};else if(typeof d!="function"){var F=d;d=function(M,I){for(var A=I,L=0;L<F.length;L++)A=F[L].call(M,A);return A}}else{var j=d;d=function(M,I){return j.call(M,I)}}c.push(d)}o!==0&&(o===1?(s.get=i.get,s.set=i.set):o===2?s.value=i:o===3?s.get=i:o===4&&(s.set=i),p?o===1?(c.push(function(M,I){return i.get.call(M,I)}),c.push(function(M,I){return i.set.call(M,I)})):o===2?c.push(i):c.push(function(M,I){return i.call(M,I)}):Object.defineProperty(n,l,s))}function y(c,n,h){for(var l=[],o,w,p=new Map,D=new Map,x=0;x<n.length;x++){var m=n[x];if(Array.isArray(m)){var s=m[1],d=m[2],i=m.length>3,a=s>=5,C,P;if(a?(C=c,s=s-5,w=w||[],P=w):(C=c.prototype,o=o||[],P=o),s!==0&&!i){var E=a?D:p,g=E.get(d)||0;if(g===!0||g===3&&s!==4||g===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!g&&s>2?E.set(d,s):E.set(d,!0)}f(l,C,m,d,s,a,i,P,h)}}return b(l,o),b(l,w),l}function b(c,n){n&&c.push(function(h){for(var l=0;l<n.length;l++)n[l].call(h);return h})}function T(c,n,h){if(n.length>0){for(var l=[],o=c,w=c.name,p=n.length-1;p>=0;p--){var D={v:!1};try{var x=n[p](o,{kind:"class",name:w,addInitializer:v(l,D),metadata:h})}finally{D.v=!0}x!==void 0&&(u(10,x),o=x)}return[N(o,h),function(){for(var m=0;m<l.length;m++)l[m].call(o)}]}}function N(c,n){return Object.defineProperty(c,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,h,l,o){if(o!==void 0)var w=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var p=Object.create(w===void 0?null:w),D=y(n,h,p);return l.length||N(n,p),{e:D,get c(){return T(n,l,p)}}}}function As(v,t,e,r){return(As=el())(v,t,e,r)}var Ls,Ss,Ns,No;Ls=B({selector:"potatno-code-editor",template:Ms,style:Ps,components:[wo,to,Mo,So]});var _s=class{static{({e:[Ns],c:[No,Ss]}=As(this,[[W,3,"document"],[W,2,"triggerPreviewUpdate"]],[Ls]))}constructor(t=O.use(G),e=O.use(H)){Ns(this),this.mComponent=t,this.mManager=e,this.mUnsubscribe=this.mManager.subscribe(R.Document|R.SpecialActiveFunction,()=>{this.mComponent.updater.updateAsync()})}mComponent;mManager;mUnsubscribe;get document(){return this.mManager.graph.document}set document(t){this.mManager.graph.setDocument(t)}get hasPreview(){let t=this.mManager.activeFunction,e=t.project.getFunction(t.definitionId);return e?t.project.preview.availableDisplays(e).length>0:!1}triggerPreviewUpdate(){return this.mManager.preview.execute()}onDeconstruct(){this.mUnsubscribe()}static{Ss()}};var no=class extends me{mCodeEditor;mProject;get document(){return this.mCodeEditor.document}set document(t){this.mCodeEditor.document=t}get project(){return this.mProject}constructor(t){super(),this.mProject=t,this.addStyle(Ir),this.addStyle(Er),this.setInjection(H,new H(t)),this.mCodeEditor=this.addContent(No)}load(t){let e=JSON.parse(t);if(!Array.isArray(e.functions))throw new _("Could not load document. Document has a wrong format.",this);let r=new re(this.mProject).deserialize(e);this.document=r}save(){let t=new ne().serialize(this.document);return JSON.stringify(t)}update(){this.mCodeEditor.triggerPreviewUpdate()}};var V=class extends it{constructor(t){super({id:t.id,label:t.label,category:t.category,regions:t.regions??null,generators:{ports:{inputs:e=>{for(let r of t.ports.inputs)e(r)},outputs:e=>{for(let r of t.ports.outputs)e(r)}},code:t.generators.code}})}};var io=class{mDisplays;get displayIds(){return[...this.mDisplays.keys()]}constructor(){this.mDisplays=new Map}addDisplay(t){this.mDisplays.set(t.id,t)}availableDisplays(t,e=null){let r=new Array;for(let[u,f]of this.mDisplays)f.executor.function.id===t.id&&(e===null||f.allowsType(e))&&r.push(u);return r}getDisplay(t){return this.mDisplays.get(t)??null}};var so=class{mCodeGenerator;mEntryPoint;mImports;mNodeDefinitions;mPreview;mTypes;mUserFunctions;get entryPoint(){return this.mEntryPoint}get generator(){return this.mCodeGenerator}get imports(){return this.mImports}get nodeDefinitions(){return this.mNodeDefinitions}get preview(){return this.mPreview}get types(){return this.mTypes}get userFunctions(){return this.mUserFunctions}constructor(t,e,r){this.mTypes=t,this.mCodeGenerator=r.generator,this.mPreview=new io,this.mNodeDefinitions=new Map,this.mImports=new Array,this.mUserFunctions=new Map,this.mEntryPoint=e,this.addNodeDefinition(new Z),this.addNodeDefinition(new k),this.addNodeDefinition(new bt)}addImport(t){this.mImports.push(t)}addNodeDefinition(t){this.mNodeDefinitions.set(t.id,t)}getFunction(t){return this.mEntryPoint.id===t?this.mEntryPoint:this.mUserFunctions.get(t)}setDynamicFunction(t){this.mUserFunctions.set(t.id,t)}};var ao=class{mTypes;get typeNames(){return Array.from(this.mTypes.keys())}get types(){return this.mTypes}constructor(t){this.mTypes=new Map;for(let[e,r]of Object.entries(t))this.mTypes.set(e,{name:e,...r})}getDefaultValue(t){return this.getType(t).default.value}getType(t){if(!this.mTypes.has(t))throw new Error(`Type "${t}" is not defined in the project types definition.`);return this.mTypes.get(t)}isGenericType(t){return typeof t!="string"?!1:/^<[^>]+>$/.test(t)}};var lo=class extends ao{constructor(){super({number:{default:{string:["0"],value:0},convert:t=>{let e=t[0],r=parseFloat(e);if(isNaN(r))throw new Error(`Invalid number: "${e}"`);return r.toString()},inputs:[{name:"value",type:"number"}]},string:{default:{string:[""],value:""},convert:t=>t[0],inputs:[{name:"value",type:"string"}]},boolean:{default:{string:["false"],value:!1},convert:t=>{let e=t[0].toLowerCase();if(e==="true")return"true";if(e==="false")return"false";throw new Error(`Invalid boolean: "${t[0]}"`)},inputs:[{name:"value",type:"boolean"}]}})}};var co=class extends ae{constructor(){super({id:"pixelShader",label:"Pixel Shader",statics:Ft.inputs|Ft.outputs,nodes:{entry:t=>{t(new V({id:"OnPixel",label:"OnPixel",category:{name:"event"},ports:{inputs:[],outputs:[{label:"exec",id:"exec",portType:"flow"},{label:"x",id:"x",portType:"value",dataType:"number"},{label:"y",id:"y",portType:"value",dataType:"number"}]},generators:{code:e=>{let r=e.outputs.x.value,u=e.outputs.y.value;return`(${r}, ${u}) => { ${e.outputs.exec.code.inner} }`}}}))},exit:t=>{t(new V({id:"PixelResult",label:"PixelResult",category:{name:"Output"},ports:{inputs:[{label:"exec",id:"exec",portType:"flow"},{label:"red",id:"red",portType:"value",dataType:"number"},{label:"green",id:"green",portType:"value",dataType:"number"},{label:"blue",id:"blue",portType:"value",dataType:"number"}],outputs:[]},generators:{code:e=>`return [${e.inputs.red.value}, ${e.inputs.green.value}, ${e.inputs.blue.value}];`}}))}},generator:{code:{body:t=>{let e=t.graphResultOf("OnPixel");return`const ${t.function.definitionId} = ${e?.code??"() => [0, 0, 0]"};`},value:t=>`${t.function.definitionId}()`}}})}};var uo=class extends ae{constructor(){super({id:"Helper Function",label:"Helper Function",statics:Ft.none,nodes:{entry:(t,e)=>{t(new it({id:"HelperFunctionEntry",label:"Entry",category:{name:"event"},generators:{ports:{outputs:r=>{r({label:"exec",id:"exec",portType:"flow"});for(let u of e.inputs)r({label:u.label,id:u.label,portType:"value",dataType:u.dataType})},inputs:()=>{}},code:r=>`(${Object.entries(r.outputs).filter(([f])=>f!=="exec").map(([,f])=>f.value).join(", ")}) => { ${r.outputs.exec.code.inner} }`}}))},exit:(t,e)=>{t(new it({id:"HelperFunctionReturn",label:"Return",category:{name:"event"},generators:{ports:{outputs:()=>{},inputs:r=>{r({label:"exec",id:"exec",portType:"flow"});for(let u of e.outputs)r({label:u.label,id:u.label,portType:"value",dataType:u.dataType})}},code:r=>`return { ${Object.entries(r.inputs).map(([f,y])=>`${f}: (${y.value})`).join(", ")} };`}}))}},generator:{code:{body:t=>{let e=`__fn_${t.function.id.replaceAll("-","_")}`,r=t.graphResultOf("HelperFunctionEntry");return`const ${e} = ${r?.code??"() => ({})"};`},value:t=>{let e=`__fn_${t.function.id.replaceAll("-","_")}`,r=Object.entries(t.inputs).map(([,y])=>y.value).join(", "),u=Object.entries(t.outputs).map(([y,b])=>`${y}: ${b.value}`).join(", "),f=t.outputs.Output?.code.inner??"";return u===""?`${e}(${r}); ${f}`:`const { ${u} } = ${e}(${r}); ${f}`}}}})}};var ho=class extends so{mUserFunction;get userFunction(){return this.mUserFunction}constructor(){let t=new lo,e=new co,r=new uo;super(t,e,{generator:{code:u=>{let f="";for(let y of u.dependencies)f+=`${y.code}
`;return f+=u.entryPoint.code,f},value:{id:(u,f)=>`${u}_${f}`,name:u=>u.replaceAll(/[^A-Za-z0-9_]/g,""),hook:u=>`/*[${u}]*/`}}}),this.mUserFunction=r,this.setDynamicFunction(r),this.addBaseNodeDefinitions()}addBaseNodeDefinitions(){this.addNodeDefinition(new V({id:"Add",label:"Add",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} + ${t.inputs.b.value};`}})),this.addNodeDefinition(new V({id:"Subtract",label:"Subtract",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} - ${t.inputs.b.value};`}})),this.addNodeDefinition(new V({id:"Multiply",label:"Multiply",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} * ${t.inputs.b.value};`}})),this.addNodeDefinition(new V({id:"Divide",label:"Divide",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} / ${t.inputs.b.value};`}})),this.addNodeDefinition(new V({id:"Modulo",label:"Modulo",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} % ${t.inputs.b.value};`}})),this.addNodeDefinition(new V({id:"Equal",label:"Equal",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"boolean"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} === ${t.inputs.b.value};`}})),this.addNodeDefinition(new V({id:"Not Equal",label:"Not Equal",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"boolean"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} !== ${t.inputs.b.value};`}})),this.addNodeDefinition(new V({id:"Less Than",label:"Less Than",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"boolean"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} < ${t.inputs.b.value};`}})),this.addNodeDefinition(new V({id:"Greater Than",label:"Greater Than",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"boolean"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} > ${t.inputs.b.value};`}})),this.addNodeDefinition(new V({id:"And",label:"And",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"boolean"},{label:"b",id:"b",portType:"value",dataType:"boolean"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"boolean"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} && ${t.inputs.b.value};`}})),this.addNodeDefinition(new V({id:"Or",label:"Or",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"boolean"},{label:"b",id:"b",portType:"value",dataType:"boolean"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"boolean"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} || ${t.inputs.b.value};`}})),this.addNodeDefinition(new V({id:"Not",label:"Not",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"boolean"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"boolean"}]},generators:{code:t=>`const ${t.outputs.result.value} = !${t.inputs.a.value};`}})),this.addNodeDefinition(new V({id:"Number to String",label:"Number to String",category:{name:"type-conversion"},ports:{inputs:[{label:"input",id:"input",portType:"value",dataType:"number"}],outputs:[{label:"output",id:"output",portType:"value",dataType:"string"}]},generators:{code:t=>`const ${t.outputs.output.value} = String(${t.inputs.input.value});`}})),this.addNodeDefinition(new V({id:"String to Number",label:"String to Number",category:{name:"type-conversion"},ports:{inputs:[{label:"input",id:"input",portType:"value",dataType:"string"}],outputs:[{label:"output",id:"output",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.output.value} = Number(${t.inputs.input.value});`}})),this.addNodeDefinition(new V({id:"Boolean to String",label:"Boolean to String",category:{name:"type-conversion"},ports:{inputs:[{label:"input",id:"input",portType:"value",dataType:"boolean"}],outputs:[{label:"output",id:"output",portType:"value",dataType:"string"}]},generators:{code:t=>`const ${t.outputs.output.value} = String(${t.inputs.input.value});`}})),this.addNodeDefinition(new V({id:"If",label:"If",category:{name:"flow"},ports:{inputs:[{label:"exec",id:"exec",portType:"flow"},{label:"condition",id:"condition",portType:"value",dataType:"boolean"}],outputs:[{label:"then",id:"then",portType:"flow"},{label:"else",id:"else",portType:"flow"}]},generators:{code:t=>`if (${t.inputs.condition.value}) {
${t.outputs.then.code.inner}
} else {
${t.outputs.else.code.inner}
}`}})),this.addNodeDefinition(new V({id:"While",label:"While",category:{name:"flow"},ports:{inputs:[{label:"exec",id:"exec",portType:"flow"},{label:"condition",id:"condition",portType:"value",dataType:"boolean"}],outputs:[{label:"body",id:"body",portType:"flow"}]},generators:{code:t=>`while (${t.inputs.condition.value}) {
${t.outputs.body.code.inner}
}`}})),this.addNodeDefinition(new V({id:"For Loop",label:"For Loop",category:{name:"flow"},ports:{inputs:[{label:"exec",id:"exec",portType:"flow"},{label:"count",id:"count",portType:"value",dataType:"number"}],outputs:[{label:"exec",id:"exec",portType:"flow"},{label:"index",id:"index",portType:"value",dataType:"number"}]},generators:{code:t=>`for (let ${t.outputs.index.value} = 0; ${t.outputs.index.value} < ${t.inputs.count.value}; ${t.outputs.index.value}++) {
${t.outputs.exec.code.inner}
}`}})),this.addNodeDefinition(new V({id:"Console Log",label:"Console Log",category:{name:"Function"},ports:{inputs:[{label:"message",id:"message",portType:"value",dataType:"string"}],outputs:[]},generators:{code:t=>`console.log(${t.inputs.message.value});`}})),this.addNodeDefinition(new V({id:"String Concat",label:"String Concat",category:{name:"Function"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"string"},{label:"b",id:"b",portType:"value",dataType:"string"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"string"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} + ${t.inputs.b.value};`}}))}};var ce=class{mId;mLabel;mNodes;get id(){return this.mId}get label(){return this.mLabel}get nodes(){return this.mNodes}constructor(t,e){this.mId=t,this.mLabel=e,this.mNodes=new Array}addNode(t){this.mNodes.push(t)}};var fo=class extends ce{constructor(){super("Math","Math"),this.addNode(new V({id:"Math.PI",label:"Math.PI",category:{name:"value"},ports:{inputs:[],outputs:[{label:"value",id:"value",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.value.value} = Math.PI;`}})),this.addNode(new V({id:"Math.E",label:"Math.E",category:{name:"value"},ports:{inputs:[],outputs:[{label:"value",id:"value",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.value.value} = Math.E;`}})),this.addNode(new V({id:"Math.abs",label:"Math.abs",category:{name:"Function"},ports:{inputs:[{label:"value",id:"value",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = Math.abs(${t.inputs.value.value});`}})),this.addNode(new V({id:"Math.floor",label:"Math.floor",category:{name:"Function"},ports:{inputs:[{label:"value",id:"value",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = Math.floor(${t.inputs.value.value});`}})),this.addNode(new V({id:"Math.ceil",label:"Math.ceil",category:{name:"Function"},ports:{inputs:[{label:"value",id:"value",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = Math.ceil(${t.inputs.value.value});`}})),this.addNode(new V({id:"Math.random",label:"Math.random",category:{name:"Function"},ports:{inputs:[],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = Math.random();`}})),this.addNode(new V({id:"Math.sin",label:"Math.sin",category:{name:"Function"},ports:{inputs:[{label:"value",id:"value",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = Math.sin(${t.inputs.value.value});`}})),this.addNode(new V({id:"Math.cos",label:"Math.cos",category:{name:"Function"},ports:{inputs:[{label:"value",id:"value",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = Math.cos(${t.inputs.value.value});`}})),this.addNode(new V({id:"Math.min",label:"Math.min",category:{name:"Function"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = Math.min(${t.inputs.a.value}, ${t.inputs.b.value});`}})),this.addNode(new V({id:"Math.max",label:"Math.max",category:{name:"Function"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = Math.max(${t.inputs.a.value}, ${t.inputs.b.value});`}})),this.addNode(new V({id:"Math.clamp",label:"Math.clamp",category:{name:"Function"},ports:{inputs:[{label:"value",id:"value",portType:"value",dataType:"number"},{label:"min",id:"min",portType:"value",dataType:"number"},{label:"max",id:"max",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = Math.min(Math.max(${t.inputs.value.value}, ${t.inputs.min.value}), ${t.inputs.max.value});`}}))}};var mo=class extends ce{constructor(){super("Time","Time"),this.addNode(new V({id:"CurrentTime",label:"CurrentTime",category:{name:"value"},ports:{inputs:[],outputs:[{label:"seconds",id:"seconds",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.seconds.value} = (performance.now() / 1000);`}}))}};var po=class{mCachedCallable;mDisplay;mElement;mSpecifiedParameters;mTarget;get display(){return this.mDisplay}get element(){return this.mElement||(this.mElement=this.mDisplay.generate()),this.mElement}constructor(t,e){this.mDisplay=t,this.mTarget=e,this.mCachedCallable=null,this.mElement=null,this.mSpecifiedParameters={...this.mDisplay.executor.defaultParameters}}execute(){this.mCachedCallable&&this.mDisplay.update(this.element,this.mCachedCallable)}refresh(){let t=this.mTarget instanceof dt?this.mTarget.node.function:this.mTarget,e=(()=>{try{return new le(t.project).generateFunction(t,!0)}catch{return null}})();if(!e){this.mCachedCallable=null;return}let r=null;if(this.mTarget instanceof dt&&(r=this.resolvePortTarget(e,this.mTarget),!r)){this.mCachedCallable=null;return}let u=this.mDisplay.executor.compile(e,r);if(!this.mDisplay.allowsType(u.type)){this.mCachedCallable=null;return}let f=this.mDisplay.adapterFor(u.type);this.mCachedCallable=y=>f(u.execute({...this.mDisplay.executor.defaultParameters,...this.mSpecifiedParameters,...y}))}specifyParameters(t){this.mSpecifiedParameters={...this.mSpecifiedParameters,...t}}resolvePortTarget(t,e){let[r,u]=(()=>{for(let y of t.entryPoint.graphs)if(y.ports.has(e)&&y.nodes.has(e.node))return[y.ports.get(e),y.nodes.get(e.node)];return[null,null]})();if(!r||!u)return null;let f=e.direction==="input"?"start":"end";return{documentPort:e,nodeHook:e.project.generator.value.hook(`${f}-${u}`),value:r}}};var ue=class{mExecutor;mGenerate;mId;mName;mTypeAdapters;mUpdate;get executor(){return this.mExecutor}get id(){return`${this.mId}-${this.mExecutor.function.id}`}get name(){return this.mName}constructor(t,e){this.mId=e.id,this.mName=e.name,this.mExecutor=t,this.mGenerate=e.generate,this.mUpdate=e.update,this.mTypeAdapters=new Map;for(let[r,u]of Object.entries(e.typeAdapter))this.mExecutor.types.has(r)&&this.mTypeAdapters.set(r,u)}adapterFor(t){let e=t;if(!this.mTypeAdapters.has(e))throw new _(`Display "${this.mId}" has no type adapter for type "${t}".`,this);return this.mTypeAdapters.get(e)}allowsType(t){return this.mTypeAdapters.has(t)}createDriver(t){return new po(this,t)}generate(){return this.mGenerate()}update(t,e){return this.mUpdate(t,e)}};var Ne=class v extends ue{static MATRIX_SIZE=3;static VALUE_LENGTH=5;constructor(t){super(t,{id:"matrix",name:"Matrix 3x3",generate:()=>{let e=document.createElement("div");return e.style.boxSizing="border-box",e.style.display="grid",e.style.gap="2px",e.style.gridTemplateColumns=`repeat(${v.MATRIX_SIZE}, minmax(0, 1fr))`,e.style.height="100%",e.style.width="100%",e.style.fontFamily="var(--potatno-font-family)",e.style.fontSize="var(--potatno-font-size-small)",e.style.color="#fff",e},typeAdapter:{[lt.MAIN]:e=>e.map(r=>this.formatPreviewValue(r)),number:e=>[this.formatPreviewValue(e)],string:e=>[this.formatPreviewValue(e)],boolean:e=>[this.formatPreviewValue(e)]},update:async(e,r)=>{await this.updateMatrixPreview(e,r)}})}formatPreviewValue(t){if(typeof t=="number"){if(!Number.isFinite(t))return t.toString().slice(0,v.VALUE_LENGTH);let e=Math.trunc(Math.abs(t)).toString().length,r=Math.max(0,v.VALUE_LENGTH-e-(t<0?1:0)-1);return t.toFixed(r).slice(0,v.VALUE_LENGTH)}return String(t).slice(0,v.VALUE_LENGTH)}async updateMatrixPreview(t,e){for(;t.children.length<v.MATRIX_SIZE*v.MATRIX_SIZE;){let r=document.createElement("div");r.style.alignItems="center",r.style.background="var(--potatno-color-background-dark)",r.style.border="1px solid var(--potatno-color-border)",r.style.boxSizing="border-box",r.style.color="var(--potatno-color-text)",r.style.display="flex",r.style.justifyContent="center",r.style.minWidth="0",r.style.overflow="hidden",r.style.padding="2px",r.style.textOverflow="clip",r.style.whiteSpace="pre-line",t.append(r)}for(let r=0;r<v.MATRIX_SIZE;r++)for(let u=0;u<v.MATRIX_SIZE;u++){let f=r*v.MATRIX_SIZE+u,y=v.MATRIX_SIZE===1?0:u/(v.MATRIX_SIZE-1),b=v.MATRIX_SIZE===1?0:r/(v.MATRIX_SIZE-1),T=e({x:y,y:b});t.children[f].textContent=T.join(`
`)}}};var _e=class v extends ue{static PREVIEW_PIXEL_SIZE=7.5;mCanvasContext;mCanvasImageData;constructor(t){super(t,{id:"2dCanvas",name:"Canvas 2D",generate:()=>{let e=document.createElement("canvas");return e.style.width="100%",e.style.height="100%",e.style.imageRendering="pixelated",e},typeAdapter:{[lt.MAIN]:e=>e,number:e=>[e,e,e],boolean:e=>{let r=e?1:0;return[r,r,r]}},update:async(e,r)=>{await this.updateCanvasPreview(e,r)}}),this.mCanvasImageData=new WeakMap,this.mCanvasContext=new WeakMap}async updateCanvasPreview(t,e){this.mCanvasContext.has(t)||this.mCanvasContext.set(t,t.getContext("2d"));let r=this.mCanvasContext.get(t),u=Math.max(1,Math.round(t.clientWidth/v.PREVIEW_PIXEL_SIZE)),f=Math.max(1,Math.round(t.clientHeight/v.PREVIEW_PIXEL_SIZE));(t.width!==u||t.height!==f||!this.mCanvasImageData.has(t))&&(t.width=u,t.height=f,this.mCanvasImageData.set(t,r.createImageData(u,f)));let y=this.mCanvasImageData.get(t),b=y.data;for(let T=0;T<f;T++)for(let N=0;N<u;N++){let c=N/u,n=T/f,h=e({x:c,y:n}),l=(T*u+N)*4;b[l]=Math.floor(Math.max(0,Math.min(1,h[0]||0))*255),b[l+1]=Math.floor(Math.max(0,Math.min(1,h[1]||0))*255),b[l+2]=Math.floor(Math.max(0,Math.min(1,h[2]||0))*255),b[l+3]=255}r.putImageData(y,0,0)}};(()=>{let v=new WebSocket("ws://127.0.0.1:8088");v.addEventListener("open",()=>{console.log("Refresh connection established")}),v.addEventListener("message",t=>{console.log("Bundle finished. Start refresh"),t.data==="REFRESH"&&window.location.reload()})})();var Mt=new ho;Mt.addImport(new fo);Mt.addImport(new mo);var Rs=new lt(Mt.entryPoint,{defaultParameters:{x:0,y:0},types:[lt.MAIN,"number","string","boolean"],build:(v,t,e)=>{let r=t.code,u=v.function.id;if(!e){let b=new Function(`${r}
return ${u};`)();return{type:lt.MAIN,execute:T=>b(T.x,T.y)}}let f=r.replace(e.nodeHook,`; return ${e.value};`),y=new Function(`${f}
return ${u};`)();return{type:e.documentPort.resolvedDataType,execute:b=>y(b.x,b.y)}}}),Os=new lt(Mt.userFunction,{defaultParameters:{x:0,y:0},types:["number","string","boolean"],build:(v,t,e)=>{if(!e)return{type:"number",execute:()=>0};let r=t.entryPoint.function,u=`__fn_${r.id.replaceAll("-","_")}`,f=r.inputs.map(T=>v.projectTypes.getDefaultValue(T.dataType)),y=t.code.replace(e.nodeHook,`return ${e.value};`),b=new Function(`${y}
return ${u};`)();return{type:e.documentPort.resolvedDataType,execute:()=>b(...f)}}});Mt.preview.addDisplay(new _e(Rs));Mt.preview.addDisplay(new _e(Os));Mt.preview.addDisplay(new Ne(Rs));Mt.preview.addDisplay(new Ne(Os));var ol=document.getElementById("application-root"),Ae=new no(Mt);Ae.appendTo(ol);Ae.document=new jt(Mt);Fs();function Fs(){try{Ae.update()}catch(v){}requestAnimationFrame(Fs)}document.getElementById("load-button").addEventListener("click",rl);document.getElementById("save-button").addEventListener("click",nl);var zs="potatno-code-document.json";async function rl(){if(window.confirm("Load saved document?"))try{let r=await(await(await navigator.storage.getDirectory()).getFileHandle(zs)).getFile();Ae.load(await r.text())}catch{window.alert("Could not load document.")}}async function nl(){if(window.confirm("Override saved document?"))try{let r=await(await(await navigator.storage.getDirectory()).getFileHandle(zs,{create:!0})).createWritable();await r.write(Ae.save()),await r.close()}catch{window.alert("Could not save document.")}}})();
//# sourceMappingURL=page.js.map
