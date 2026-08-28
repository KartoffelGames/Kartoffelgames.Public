(()=>{var fe=class y extends Array{static newListWith(...t){let e=new y;return e.push(...t),e}clear(){this.splice(0,this.length)}clone(){return y.newListWith(...this)}distinct(){return y.newListWith(...new Set(this))}equals(t){if(this===t)return!0;if(!t||this.length!==t.length)return!1;for(let e=0;e<this.length;++e)if(this[e]!==t[e])return!1;return!0}remove(t){let e=this.indexOf(t);if(e!==-1)return this.splice(e,1)[0]}replace(t,e){let i=this.indexOf(t);if(i!==-1){let u=this[i];return this[i]=e,u}}toString(){return`[${super.join(", ")}]`}};var A=class extends Error{mTarget;get target(){return this.mTarget}constructor(t,e,i){super(t,i),this.mTarget=e}};var nt=class y extends Map{add(t,e){if(!this.has(t))this.set(t,e);else throw new A("Can't add duplicate key to dictionary.",this)}clone(){return new y(this)}getAllKeysOfValue(t){return[...this.entries()].filter(u=>u[1]===t).map(u=>u[0])}getOrDefault(t,e){let i=this.get(t);return typeof i<"u"?i:e}map(t){let e=new fe;for(let i of this){let u=t(i[0],i[1]);e.push(u)}return e}};var jt=class y{mSize;mTopItem;get size(){return this.mSize}get top(){if(this.mTopItem)return this.mTopItem.value}constructor(){this.mTopItem=null,this.mSize=0}clone(){let t=new y;return t.mTopItem=this.mTopItem,t.mSize=this.mSize,t}*entries(){let t=this.mTopItem;for(;t!==null;)yield t.value,t=t.previous}flush(){let t=new Array;for(;this.mTopItem;)t.push(this.pop());return t}pop(){if(!this.mTopItem)return;let t=this.mTopItem.value;return this.mTopItem=this.mTopItem.previous,this.mSize--,t}push(t){let e={previous:this.mTopItem,value:t};this.mTopItem=e,this.mSize++}toArray(){return[...this.entries()]}};var de=class{mCompareFunction;constructor(t){this.mCompareFunction=t}differencesOf(t,e){let i;if(t.length===0||e.length===0){if(i=new Array,t.length===0)for(let S=0;S<e.length;S++)i.push({changeState:St.Insert,item:e[S]});else for(let S=0;S<t.length;S++)i.push({changeState:St.Remove,item:t[S]});return i}let u={1:{x:0,history:[]}},m=S=>S-1,v=t.length,w=e.length,D;for(let S=0;S<v+w+1;S++)for(let l=-S;l<S+1;l+=2){let r=l===-S||l!==S&&u[l-1].x<u[l+1].x;if(r){let c=u[l+1];D=c.x,i=c.history}else{let c=u[l-1];D=c.x+1,i=c.history}i=i.slice();let h=D-l;for(1<=h&&h<=w&&r?i.push({changeState:St.Insert,item:e[m(h)]}):1<=D&&D<=v&&i.push({changeState:St.Remove,item:t[m(D)]});D<v&&h<w&&this.mCompareFunction(t[m(D+1)],e[m(h+1)]);)D+=1,h+=1,i.push({changeState:St.Keep,item:t[m(D)]});if(D>=v&&h>=w)return i;u[l]={x:D,history:i}}return new Array}},St=function(y){return y[y.Remove=1]="Remove",y[y.Insert=2]="Insert",y[y.Keep=3]="Keep",y}({});var me=class{mNodeCache;constructor(){this.mNodeCache=new Map}start(t,e){let i=this.readFromCache(t),u=this.readFromCache(e),m=new To;m.set(i,0);let v=new Map;v.set(i,0);let w=new Map,D=new Array;for(;m.length!==0;){let S=m.popLowest();if(D.push(S),S===u)return{path:[...this.pathTracer(S,w)].reverse(),processedNodes:D};for(let l of this.getNeighborNodes(S)){let r=(v.get(S)??Number.POSITIVE_INFINITY)+this.costOfTraversal(l,{startNode:i,endNode:u,path:this.pathTracer(S,w)}),h=v.get(l)??Number.POSITIVE_INFINITY;if(r>=h)continue;w.set(l,S),v.set(l,r);let c=r+this.heuristic(l,{startNode:i,endNode:u,path:this.pathTracer(S,w)});m.set(l,c)}}return{path:new Array,processedNodes:D}}getNeighborNodes(t){return this.neighborNodes(t).map(e=>this.readFromCache(e))}*pathTracer(t,e){let i=t;for(;yield i,!!e.has(i);)i=e.get(i)}readFromCache(t){let e=this.nodeId(t);return this.mNodeCache.has(e)?this.mNodeCache.get(e):(this.mNodeCache.set(e,t),t)}},To=class{mExistingNodes;mList;mLowestCost;mLowestCostCounter;get length(){return this.mList.length}constructor(){this.mList=new Array,this.mExistingNodes=new Map,this.mLowestCost=Number.POSITIVE_INFINITY,this.mLowestCostCounter=0}popLowest(){if(this.mList.length===0)throw new A("Can not read next node from an empty priority list.",this);let[t,e]=(()=>{let v=null,w=0;for(let D=this.mList.length-1;D>-1;D--){let S=this.mList[D];if(S.cost===this.mLowestCost)return[S,0];(v===null||S.cost<v.cost)&&(v=S,w=0),S.cost===v.cost&&w++}if(v===null)throw new A("Lowest could not be found. Data is corrupted.",this);return[v,w]})();t.cost<this.mLowestCost&&(this.mLowestCost=t.cost,this.mLowestCostCounter=e),t.cost===this.mLowestCost&&this.mLowestCostCounter--,this.mLowestCostCounter<1&&(this.mLowestCost=Number.POSITIVE_INFINITY,this.mLowestCostCounter=0);let i=this.mExistingNodes.get(t.node),u=this.mList.length-1,m=this.mList[u];return this.mList[u]=t,this.mList[i]=m,this.mExistingNodes.set(m.node,i),this.mExistingNodes.delete(t.node),this.mList.pop().node}set(t,e){if(this.mLowestCostCounter>0&&e<this.mLowestCost&&(this.mLowestCost=e,this.mLowestCostCounter=0),e===this.mLowestCost&&this.mLowestCostCounter++,this.mExistingNodes.has(t)){let i=this.mExistingNodes.get(t),u=this.mList[i];if(u.cost===e){e===this.mLowestCost&&this.mLowestCostCounter--;return}u.cost=e;return}this.mList.push({cost:e,node:t}),this.mExistingNodes.set(t,this.mList.length-1)}};var pe=class{mDataType;mId;mLabel;mPortType;mRegions;get dataType(){return this.mDataType}get id(){return this.mId}get label(){return this.mLabel}get portType(){return this.mPortType}get regions(){return this.mRegions}constructor(t){this.mLabel=t.label,this.mId=t.id,this.mPortType=t.portType,t.portType==="value"?this.mDataType=t.dataType:this.mDataType=null,this.mRegions={add:t.regions?.add??new Array}}};var at=class{mCategory;mCodeGenerator;mId;mLabel;mPortProvider;mRegions;get category(){return this.mCategory}get codeGenerator(){return this.mCodeGenerator}get id(){return this.mId}get inputs(){let t=!1,e=[];return this.mPortProvider.inputs(i=>{if(e.push(new pe(i)),i.portType==="flow"){if(t)throw new A(`Node definition ${this.id} has multiple input flow ports, which is not allowed.`,this);t=!0}}),e}get label(){return this.mLabel}get outputs(){let t=[];return this.mPortProvider.outputs(e=>{t.push(new pe(e))}),t}get regions(){return this.mRegions}constructor(t){this.mId=t.id,this.mLabel=t.label,this.mCategory={name:t.category.name,icon:t.category.icon??"\u25C6"},this.mCodeGenerator=t.generators.code,this.mPortProvider=t.generators.ports,this.mRegions={add:t.regions?.add??new Array,allows:t.regions?.allows??new Array,requires:t.regions?.requires??new Array}}getPort(t){return[...this.inputs,...this.outputs].find(e=>e.id===t)}};var wt=class extends at{mFunction;get function(){return this.mFunction}get label(){return this.mFunction.label}constructor(t){let e=(u,m,v)=>w=>{v.length===0&&w({label:u,id:u,portType:"flow"});for(let D of m)w({label:D.label,id:D.label,portType:"value",dataType:D.dataType})},i=t.project.getFunction(t.definitionId);super({id:`USERFUNCTION_${t.id}`,label:t.label,category:{name:"user function",icon:"\u0192"},generators:{ports:{inputs:e("Input",t.inputs,t.outputs),outputs:e("Output",t.outputs,t.outputs)},code:u=>i?i.codeGenerator.value({function:t,inputs:u.inputs,outputs:u.outputs,code:u.code}):""}}),this.mFunction=t}};var xt=class y extends at{static DEFINITION_ID="8124c652-3a8e-4333-b405-f905522a4610";constructor(){super({id:y.DEFINITION_ID,label:"Comment",category:{name:"Comment",icon:"\u270E"},generators:{ports:{inputs:()=>{},outputs:()=>{}},code:()=>{throw new A("Comment node code generators should never be called.",y)}}})}};var K=class y extends at{static DEFINITION_ID="23e9319b-3b62-4dd8-858a-17d97ddee94e";constructor(){super({id:y.DEFINITION_ID,label:"Flow Conjunction",category:{name:"Conjunction",icon:"\u25C7"},generators:{ports:{inputs:t=>{t({label:"in",id:"in",portType:"flow"})},outputs:t=>{t({label:"out",id:"out",portType:"flow"})}},code:()=>{throw new A("Conjunction node code generators should never be called.",y)}}})}};var et=class y extends at{static DEFINITION_ID="a579584d-5d35-42b5-b2ba-3daddee488e0";constructor(){super({id:y.DEFINITION_ID,label:"Value Conjunction",category:{name:"Conjunction",icon:"\u25C7"},generators:{ports:{inputs:t=>{t({label:"in",id:"in",portType:"value",dataType:"<T>"})},outputs:t=>{t({label:"out",id:"out",portType:"value",dataType:"<T>"})}},code:()=>{throw new A("Conjunction node code generators should never be called.",y)}}})}};var Tt=class{mAffectedItems;mErrors;get affectedItems(){return this.mAffectedItems}get errors(){return this.mErrors}constructor(){this.mErrors=new Array,this.mAffectedItems=new Set}addAffectedItem(t){this.mAffectedItems.add(t)}merge(t){this.mErrors.push(...t.mErrors);for(let e of t.mAffectedItems)this.mAffectedItems.add(e);return this}pushError(...t){this.mErrors.push(...t)}},Z=class{mItem;mMessage;get item(){return this.mItem}get message(){return this.mMessage}constructor(t,e){this.mMessage=t,this.mItem=e}};var it=class{mConnectedPorts;mDataType;mDefinitionId;mDirectValue;mDirection;mDocument;mLabel;mNode;mPortType;mProject;get connectedPorts(){return this.mConnectedPorts}get dataType(){return this.mDataType}get definitionId(){return this.mDefinitionId}get directValue(){return this.mDirectValue}get direction(){return this.mDirection}get document(){return this.mDocument}get label(){return this.mLabel}set label(t){this.mLabel=t}get node(){return this.mNode}get portType(){return this.mPortType}get project(){return this.mProject}get resolvedDataType(){return this.resolveDataType(new Set)}constructor(t,e,i){if(i.portType==="flow"&&i.dataType!==null)throw new A("Flow ports cannot have a value type.",this);if(i.portType==="value"&&i.dataType===null)throw new A("Value ports must have a value type.",this);this.mProject=t,this.mDocument=e,this.mNode=i.node,this.mDefinitionId=i.definitionId,this.mLabel=i.label,this.mDataType=i.dataType,this.mDirection=i.direction,this.mPortType=i.portType,this.mConnectedPorts=new Set,this.mDirectValue=new Array,i.dataType&&!this.mProject.types.isGenericType(i.dataType)&&this.mDirectValue.push(...t.types.getType(i.dataType).default.string)}connect(t){if(this.mConnectedPorts.has(t))return;if(this.mPortType!==t.portType)throw new A(`Cannot connect port ${this.mDefinitionId} of node ${this.mNode.label} to port ${t.mDefinitionId} of node ${t.node.label} due to incompatible port types.`,this);if(this.mDirection===t.direction)throw new A(`Cannot connect port ${this.mDefinitionId} of node ${this.mNode.label} to port ${t.mDefinitionId} of node ${t.node.label} due to incompatible directions.`,this);if(this.node===t.node)throw new A(`Cannot connect port ${this.mDefinitionId} of node ${this.mNode.label} to another port of the same node.`,this);if(!(this.mPortType==="flow"&&this.mDirection==="input"||this.mPortType==="value"&&this.mDirection==="output"))for(let i of Array.from(this.mConnectedPorts))this.disconnect(i);this.mConnectedPorts.add(t),t.connect(this)}disconnect(t){this.mConnectedPorts.has(t)&&(this.mConnectedPorts.delete(t),t.disconnect(this))}setDirectValue(t){if(this.mPortType!=="value")throw new A("Only value ports can have a direct value.",this);if(this.mProject.types.isGenericType(this.mDataType))throw new A("Generic value ports cannot have a direct value.",this);if(t.length!==this.mProject.types.getType(this.mDataType).default.string.length)throw new A("The provided value does not match the expected length of the default value for this port's type.",this);this.mDirectValue.splice(0,this.mDirectValue.length),this.mDirectValue.push(...t)}validate(){let t=new Tt;if(this.mDirection==="output"){if(this.mPortType==="flow"&&this.mConnectedPorts.size>1&&t.pushError(new Z(`Flow output port "${this.mDefinitionId}" on node "${this.mNode.label}" can only have one connection.`,this)),this.mPortType==="value"&&this.mProject.types.isGenericType(this.mDataType??"")){let e=this.mNode.inputs.value.filter(i=>i.dataType===this.mDataType);for(let i of e)i.connectedPorts.size===0&&t.pushError(new Z(`Generic output port "${this.mDefinitionId}" on node "${this.mNode.label}" cannot resolve generic type "${this.mDataType}" because its input port "${i.definitionId}" is not connected.`,this))}return t}if(this.mDirection==="input"){if(this.mPortType==="flow")return this.mConnectedPorts.size===0&&t.pushError(new Z(`Flow input port "${this.mDefinitionId}" on node "${this.mNode.label}" must have at least one connection.`,this)),t;if(this.mPortType==="value"){this.mConnectedPorts.size>1&&t.pushError(new Z(`Value input port "${this.mDefinitionId}" on node "${this.mNode.label}" can only have one connection.`,this));for(let e of this.mConnectedPorts)e.resolvedDataType!==this.resolvedDataType&&t.pushError(new Z(`Value input port "${this.mDefinitionId}" on node "${this.mNode.label}" expects type "${this.resolvedDataType}" but is connected to type "${e.resolvedDataType}".`,this));return t}}return t}resolveDataType(t){if(t.has(this.node))return this.mDataType;if(this.mDirection==="input"&&t.add(this.node),this.mPortType!=="value")throw new A("Port data type couldn't be resolved as it is no value port.",this);if(!this.mProject.types.isGenericType(this.mDataType??""))return this.mDataType;if(this.mDirection==="output"){let i=this.mNode.inputs.value.find(u=>u.dataType===this.mDataType);if(!i)throw new A("Port type couldn't be resolved as it has no resolving sibling port",this);return i.resolveDataType(t)}return this.mConnectedPorts.size===0?this.mDataType:this.mConnectedPorts.values().next().value.resolveDataType(t)}};var pt=class{mDefinitionId;mDocument;mFunction;mInputs;mLabel;mOutputs;mPreview;mProject;mTransformation;get definitionId(){return this.mDefinitionId}get document(){return this.mDocument}get function(){return this.mFunction}get hasFlowPorts(){return this.mOutputs.flow.length>0||this.mInputs.flow.length>0}get hasValuePorts(){return this.mOutputs.value.length>0||this.mInputs.value.length>0}get inputs(){return this.mInputs}get label(){return this.mLabel}set label(t){this.mLabel=t}get outputs(){return this.mOutputs}get preview(){return this.mPreview}set preview(t){this.mPreview=t}get project(){return this.mProject}get transformation(){return this.mTransformation}constructor(t,e,i,u){this.mDocument=e,this.mDefinitionId=u.definitionId,this.mFunction=i,this.mLabel=u.label,this.mPreview=u.preview??null,this.mProject=t,this.mTransformation={x:0,y:0,width:0,height:0};let m=(v,w)=>{let D={direction:w,list:new Array,map:new Map,flow:new Array,value:new Array};for(let S of v){let l=new it(this.mProject,this.mDocument,{definitionId:S.definitionId,direction:w,label:S.label,node:this,portType:S.portType,dataType:S.dataType});D.list.push(l),D.map.set(l.definitionId,l),(l.portType==="flow"?D.flow:D.value).push(l)}return D};this.mInputs=m(u.ports.input,"input"),this.mOutputs=m(u.ports.output,"output"),this.resizeTo(u.transformation.width,u.transformation.height),this.moveTo(u.transformation.x,u.transformation.y)}moveTo(t,e){this.mTransformation.x=Math.round(t),this.mTransformation.y=Math.round(e)}resizeTo(t,e){let i=this.mFunction.nodeDefinitions.find(v=>v.id===this.mDefinitionId),[u,m]=(()=>{switch(i?.id){case xt.DEFINITION_ID:return[Math.max(6,t),Math.max(6,e)];case et.DEFINITION_ID:case K.DEFINITION_ID:return[1,1];default:return[6,Math.max(this.mInputs.list.length,this.mOutputs.list.length)+1]}})();this.mTransformation.width=u,this.mTransformation.height=m}validate(t){let e=new Tt,i=t??new Set,u=this.mFunction.nodeDefinitions.find(m=>m.id===this.mDefinitionId);if(!u)e.pushError(new Z(`Node "${this.mLabel}" definition "${this.mDefinitionId}" could not be found.`,this));else{e.merge(this.resyncPorts(this.mInputs,u.inputs)),e.merge(this.resyncPorts(this.mOutputs,u.outputs));let m=new Set([...u.regions.requires,...u.regions.allows]);if(m.size>0)for(let v of i)m.has(v)||e.pushError(new Z(`Node "${this.mLabel}" does not allow region "${v}".`,this));if(u.regions.requires.length>0)for(let v of u.regions.requires)i.has(v)||e.pushError(new Z(`Node "${this.mLabel}" requires region "${v}" but it is not active.`,this))}for(let m of[...this.mInputs.list,...this.mOutputs.list])e.merge(m.validate());return this.resizeTo(this.transformation.width,this.transformation.height),e}addPort(t,e,i){let u=new it(this.mProject,this.mDocument,{definitionId:e.id,direction:t.direction,label:e.label,node:this,portType:e.portType,dataType:e.dataType});return t.list.splice(i,0,u),t.map.set(u.definitionId,u),(u.portType==="flow"?t.flow:t.value).push(u),u}removePort(t,e){let i=t.list.indexOf(e);if(i===-1)throw new A(`Port "${e.label}" was not found and can not be removed.`,this);t.list.splice(i,1),t.map.delete(e.definitionId);let u=e.portType==="flow"?t.flow:t.value,m=u.indexOf(e);if(i===-1)throw new A(`Port "${e.label}" was not found in typed list and can not be removed.`,this);return u.splice(m,1),i}replacePort(t,e,i){let u=Array.from(e.connectedPorts);for(let w of Array.from(e.connectedPorts))e.disconnect(w);let m=this.removePort(t,e),v=this.addPort(t,i,m);for(let w of u)v.connect(w);return v}resyncPorts(t,e){let i=new Tt,u=new Set(e.map(m=>m.id));for(let m=0;m<e.length;m++){let v=e[m];if(!t.map.has(v.id)){let r=this.addPort(t,v,m);i.addAffectedItem(r);continue}let w=t.map.get(v.id),D=w.portType!==v.portType,S=w.dataType!==v.dataType;if(!D&&!S)continue;if(w.connectedPorts.size>0&&D){i.pushError(new Z(`Port "${w.label}" on node "${this.mLabel}" has a changed type.`,w));continue}let l=this.replacePort(t,w,v);i.addAffectedItem(w),i.addAffectedItem(l)}for(let m of t.list)if(!u.has(m.definitionId)){if(m.connectedPorts.size===0){i.addAffectedItem(m),this.removePort(t,m);continue}i.pushError(new Z(`Port "${m.label}" on node "${this.mLabel}" no longer exists in its definition.`,m))}return i}};var lt=class{mDefinitionId;mDocument;mId;mImportIds;mInputs;mIsSystem;mLabel;mNodes;mOutputs;mProject;get definitionId(){return this.mDefinitionId}get document(){return this.mDocument}get dynamicNodeDefinitions(){let t=this.mDocument.nodeDefinitions.filter(m=>!(m instanceof wt&&m.function===this)),e=this.mProject.getFunction(this.definitionId);if(!e)return t;let i=e.getNodeDefinitions(this),u=this.mProject.imports.filter(m=>this.mImportIds.has(m.id)).flatMap(m=>m.nodes);return[...t,...u,...i.dynamic]}get id(){return this.mId}get imports(){return this.mImportIds}get inputs(){return this.mInputs}get isSystem(){return this.mIsSystem}get label(){return this.mLabel}set label(t){this.mLabel=t}get nodeDefinitions(){let t=this.mProject.getFunction(this.definitionId);if(!t)return this.dynamicNodeDefinitions;let e=t.getNodeDefinitions(this);return[...this.dynamicNodeDefinitions,...e.entry,...e.exit]}get nodes(){return this.mNodes}get outputs(){return this.mOutputs}get project(){return this.mProject}constructor(t,e,i){this.mProject=t,this.mDocument=e,this.mLabel=i.label,this.mIsSystem=i.isSystem,this.mDefinitionId=i.definitionId,this.mId=i.id,this.mNodes=new Set,this.mInputs=new Array,this.mOutputs=new Array,this.mImportIds=new Set}addImport(t){if(!this.project.imports.some(i=>i.id===t))throw new A(`Project does not contain import ${t}`,this);this.mImportIds.add(t)}addInput(t){this.mInputs.some(e=>e.label===t.label)||this.mInputs.push(t)}addNode(t){this.mNodes.add(t)}addNodeByDefinition(t,e){let i=m=>({definitionId:m.id,label:m.label,portType:m.portType,dataType:m.dataType}),u=new pt(this.mProject,this.mDocument,this,{definitionId:t.id,ports:{input:t.inputs.map(i),output:t.outputs.map(i)},label:t.label,transformation:e});return this.mNodes.add(u),u}addOutput(t){this.mOutputs.some(e=>e.label===t.label)||this.mOutputs.push(t)}getExitNodes(){let t=this.mProject.getFunction(this.mDefinitionId);if(!t)throw new A(`Function definition not found for function "${this.mLabel}".`,this);let e=new Set(t.getNodeDefinitions(this).exit.map(i=>i.id));return[...this.mNodes].filter(i=>e.has(i.definitionId))}removeImport(t){this.mImportIds.delete(t)}removeInput(t){let e=this.mInputs.findIndex(i=>i.label===t.label);e!==-1&&this.mInputs.splice(e,1)}removeNode(t){for(let e of[...t.inputs.list,...t.outputs.list])for(let i of Array.from(e.connectedPorts))e.disconnect(i);this.mNodes.delete(t)}removeOutput(t){let e=this.mOutputs.findIndex(i=>i.label===t.label);e!==-1&&this.mOutputs.splice(e,1)}validate(){let t=new Tt,e=this.mProject.getFunction(this.mDefinitionId);e||t.pushError(new Z(`Function "${this.mLabel}" definition "${this.mDefinitionId}" could not be found.`,this));let i=e?.getNodeDefinitions(this);i&&this.resyncFunction(i,t);let u=this.collectRegions(this.mNodes,t),m=new Set(i?.entry.map(w=>w.id)??new Array),v=new Map;for(let w of this.mNodes)t.merge(w.validate(u.get(w))),this.collectEntryDomains(w,m,v).size>1&&t.pushError(new Z(`Node "${w.label}" is reachable from multiple entry nodes.`,w));return t}collectEntryDomains(t,e,i){if(i.has(t))return i.get(t);let u=new Set;i.set(t,u);for(let m of t.inputs.list)for(let v of m.connectedPorts){let w=v.node;e.has(w.definitionId)&&u.add(w);for(let D of this.collectEntryDomains(w,e,i))u.add(D)}return u}collectRegions(t,e){let i=new Map;for(let w of this.nodeDefinitions)i.set(w.id,w);let u=(()=>{let w=new Map;return(D,S)=>{if(!w.has(D.id)){let l=new Map;for(let r of D.outputs)l.set(r.id,r.regions.add);w.set(D.id,l)}return[...w.get(D.id).get(S)??new Array,...D.regions.add]}})(),m=(()=>{let w=new Map;return(D,S)=>{if(w.has(D))return w.get(D);if(S.has(D))return e.pushError(new Z(`Node "${D.label}" is part of a connection cycle.`,D)),new Set;S.add(D);let l=new Set;for(let r of D.inputs.list)for(let h of r.connectedPorts){let c=h.node;for(let o of m(c,S))l.add(o);if(i.has(c.definitionId))for(let o of u(i.get(c.definitionId),h.definitionId))l.add(o)}return w.set(D,l),l}})(),v=new Map;for(let w of t)v.set(w,m(w,new Set));return v}resyncFunction(t,e){let i=[...t.entry,...t.exit],u=new Set(this.mNodes.values().map(w=>w.definitionId)),m=0,v=20;for(let w of i){if(u.has(w.id))continue;let D=this.addNodeByDefinition(w,{x:Math.floor(m/(i.length/2))*v+2,y:m*v+2-Math.floor(m/(i.length/2))*(i.length/2*v),width:0,height:0});e.addAffectedItem(D),m++}}};var Vt=class{mFunctionNodeDefinitions;mFunctions;mProject;get functions(){return this.mFunctions}get nodeDefinitions(){return[...this.mFunctionNodeDefinitions.values(),...this.mProject.nodeDefinitions.values()]}get project(){return this.mProject}constructor(t){this.mProject=t,this.mFunctions=new Array,this.mFunctionNodeDefinitions=new Map}addFunction(t){let e=this.mFunctions.indexOf(t);e!==-1&&this.mFunctions.splice(e,1),this.mFunctions.push(t);let i=new wt(t);return this.mFunctionNodeDefinitions.set(i.id,i),t}newFunction(t){return this.addFunction(new lt(this.mProject,this,t))}removeFunction(t){if(t.isSystem)throw new A("Cannot remove a system function.",this);let e=this.mFunctions.indexOf(t);if(e===-1)return!1;this.mFunctions.splice(e,1);for(let i of this.mFunctionNodeDefinitions.values())i.function===t&&this.mFunctionNodeDefinitions.delete(i.id);return!0}validate(){let t=new Tt,e=this.mProject.entryPoint.id;if(!this.mFunctions.values().some(u=>u.definitionId===e)){let u=this.newFunction({definitionId:e,id:crypto.randomUUID(),isSystem:!0,label:this.mProject.entryPoint.label});t.addAffectedItem(u)}for(let u of this.mFunctions)t.merge(u.validate());t.pushError(...this.detectCrossFunctionRecursion());let i=new Set;for(let u of this.mFunctions){let m=this.mProject.generator.value.name(u.label);i.has(m)&&t.pushError(new Z(`Function name "${m}" is used by multiple functions. Function names must be unique.`,u)),i.add(m)}return t}detectCrossFunctionRecursion(){let t=[],e=new Map,i=w=>{if(!e.has(w)){let D=new Set;for(let S of w.nodes)this.mFunctionNodeDefinitions.has(S.definitionId)&&D.add(this.mFunctionNodeDefinitions.get(S.definitionId).function);e.set(w,D)}return e.get(w)},u=new Set,m=new Set,v=w=>{if(!u.has(w)){if(m.has(w)){t.push(new Z(`Function "${w.label}" participates in a cross-function recursion cycle.`,w));return}m.add(w);for(let D of i(w))v(D);m.delete(w),u.add(w)}};for(let w of this.mFunctions)v(w);return t}};var Bt=class{mData;mInteractionType;mOrigin;get data(){return this.mData}get origin(){return this.mOrigin}get triggerType(){return this.mInteractionType}constructor(t,e,i){this.mInteractionType=t,this.mData=i,this.mOrigin=e}};var Dt=class y{static mCurrentZone=new y("Default");static get current(){return y.mCurrentZone}static create(t){return new y(t,y.current)}mAttachments;mInteractionListener;mName;mParent;mTriggerFilterBitmap;get name(){return this.mName}get parent(){return this.mParent}constructor(t,e=null){this.mName=t,this.mParent=e,this.mTriggerFilterBitmap=-1,this.mInteractionListener=new Map,this.mAttachments=new WeakMap}addInteractionListener(t){return this.mInteractionListener.set(t,y.current),this}execute(t,...e){let i=y.mCurrentZone;y.mCurrentZone=this;try{return t(...e)}finally{y.mCurrentZone=i}}getAttachment(t){return this.mAttachments.has(t)?this.mAttachments.get(t):this.mParent!==null?this.mParent.getAttachment(t):null}pushInteraction(t,e){if((this.mTriggerFilterBitmap&t)===0)return!1;if(this.mInteractionListener.size===0)return!0;let i=new Bt(t,this,e);for(let[u,m]of this.mInteractionListener.entries())m.execute(()=>{u.call(this,i)});return!0}removeInteractionListener(t){return t?(this.mInteractionListener.delete(t),this):(this.mInteractionListener.clear(),this)}setAttachment(t,e){this.mAttachments.set(t,e)}setTriggerRestriction(t){return this.mTriggerFilterBitmap=t,this}};var Q=class y{static mComponents=new WeakMap;static mConstructorSelector=new WeakMap;static mElements=new WeakMap;static elementIsComponent(t){return y.mComponents.has(t)}static ofComponent(t){let e=t.processorConstructor,i=y.mConstructorSelector.get(e);if(!i)throw new A(`Constructor "${e.name}" is not a registered custom element`,e);let u=y.mElements.get(t);if(!u)throw new A(`Component "${t}" is not a registered component`,t);return{selector:i,constructor:e,element:u,component:t,processor:t.processor}}static ofConstructor(t){let e=y.mConstructorSelector.get(t);if(!e)throw new A(`Constructor "${t.name}" is not a registered custom element`,t);let i=globalThis.customElements.get(e);if(!i)throw new A(`Constructor "${t.name}" is not a registered custom element`,t);return{selector:e,constructor:t,elementConstructor:i}}static ofElement(t){let e=y.mComponents.get(t);if(!e)throw new A(`Element "${t}" is not a PwbComponent.`,t);return y.ofComponent(e)}static ofProcessor(t){let e=y.mComponents.get(t);if(!e)throw new A("Processor is not a PwbComponent.",t);return y.ofComponent(e)}static registerComponent(t,e,i){y.mComponents.has(e)||y.mComponents.set(e,t),i&&!y.mComponents.has(i)&&y.mComponents.set(i,t),y.mElements.has(t)||y.mElements.set(t,e)}static registerConstructor(t,e){t&&!y.mConstructorSelector.has(t)&&y.mConstructorSelector.set(t,e)}};var It=class{static ATTACHMENT_KEY=Symbol("ComponentZoneConfiguration");mFrameTime;mInjection;get guaranteedFrameTime(){return this.mFrameTime}set guaranteedFrameTime(t){this.mFrameTime=t}get injections(){return this.mInjection}constructor(){this.mInjection=new Map,this.mFrameTime=Number.MAX_SAFE_INTEGER}setInjection(t,e){this.mInjection.set(t,e)}};var Kt=class extends Error{mZone;get zone(){return this.mZone}constructor(t,e){let i=t instanceof Error?t.message:"Non-error value thrown";super(`Update error in zone "${e.name}": ${i}`,{cause:t}),this.mZone=e}};var ge=class y{static new(t,e){let i=new y;t(i),e&&i.appendTo(e)}mComponentZoneConfiguration;mContent;mCurrentTarget;mErrorListener;mFragment;mInteractionZone;constructor(){this.mContent=new Array,this.mFragment=document.createDocumentFragment(),this.mCurrentTarget=null,this.mErrorListener=new Array,this.mInteractionZone=Dt.create("PwbApplication"),this.mComponentZoneConfiguration=new It,this.mInteractionZone.setAttachment(It.ATTACHMENT_KEY,this.mComponentZoneConfiguration),globalThis.addEventListener("error",t=>{this.handleZoneError(t,t.error)}),globalThis.addEventListener("unhandledrejection",t=>{this.handleZoneError(t,t.reason)})}addContent(t){let e=Q.ofConstructor(t).elementConstructor,i=this.mInteractionZone.execute(()=>Q.ofElement(new e));return this.mContent.push(i.component),this.mFragment.appendChild(i.element),this.updateTarget(),i.processor}addErrorListener(t){this.mErrorListener.includes(t)&&this.removeErrorListener(t),this.mErrorListener.push(t)}addStyle(t){let e=document.createElement("style");e.textContent=t,this.mFragment.prepend(e)}appendTo(t){this.mCurrentTarget=t,this.updateTarget()}removeErrorListener(t){let e=this.mErrorListener.indexOf(t);e!==-1&&this.mErrorListener.splice(e,1)}setInjection(t,e){this.mComponentZoneConfiguration.setInjection(t,e)}handleZoneError(t,e){if(!(e instanceof Kt)||!this.zoneBelongsToApplication(e.zone))return;t.preventDefault();let i=!1;for(let u of this.mErrorListener)u(e.cause)===!0&&(i=!0);i||console.error(e.cause)}updateTarget(){this.mCurrentTarget&&(this.mCurrentTarget.shadowRoot||this.mCurrentTarget.attachShadow({mode:"open"}),this.mCurrentTarget.shadowRoot.appendChild(this.mFragment))}zoneBelongsToApplication(t){let e=t;for(;e!==null;){if(e===this.mInteractionZone)return!0;e=e.parent}return!1}};var Qt=class{mCustomMetadata;constructor(){this.mCustomMetadata=new Map}getMetadata(t){return this.mCustomMetadata.get(t)??null}setMetadata(t,e){this.mCustomMetadata.set(t,e)}};var ve=class extends Qt{};var ye=class y extends Qt{static mPrivateMetadataKey=Symbol("Metadata");mDecoratorMetadataObject;mPropertyMetadata;constructor(t){super(),this.mDecoratorMetadataObject=t,this.mPropertyMetadata=new Map,t[y.mPrivateMetadataKey]=this}getInheritedMetadata(t){let e=new Array,i=this.mDecoratorMetadataObject;do{if(Object.hasOwn(i,y.mPrivateMetadataKey)){let m=i[y.mPrivateMetadataKey].getMetadata(t);m!==null&&e.push(m)}i=Object.getPrototypeOf(i)}while(i!==null);return e.reverse()}getProperty(t){return this.mPropertyMetadata.has(t)||this.mPropertyMetadata.set(t,new ve),this.mPropertyMetadata.get(t)}};Symbol.metadata??=Symbol("Symbol.metadata");var ct=class y{static mMetadataMapping=new Map;static add(t,e){return(i,u)=>{let m=y.forInternalDecorator(u.metadata);switch(u.kind){case"class":m.setMetadata(t,e);return;case"method":case"field":case"getter":case"setter":case"accessor":if(u.static)throw new Error("@Metadata.add not supported for statics.");m.getProperty(u.name).setMetadata(t,e);return}}}static forInternalDecorator(t){return y.mapMetadata(t)}static get(t){Object.hasOwn(t,Symbol.metadata)||y.polyfillMissingMetadata(t);let e=t[Symbol.metadata];return y.mapMetadata(e)}static init(){return(t,e)=>{y.forInternalDecorator(e.metadata)}}static mapMetadata(t){if(y.mMetadataMapping.has(t))return y.mMetadataMapping.get(t);let e=new ye(t);return y.mMetadataMapping.set(t,e),e}static polyfillMissingMetadata(t){let e=new Array,i=t;do e.push(i),i=Object.getPrototypeOf(i);while(i!==null);for(let u=e.length-1;u>=0;u--){let m=e[u];if(!Object.hasOwn(m,Symbol.metadata)){let v=null;u<e.length-2&&(v=e[u+1][Symbol.metadata]),m[Symbol.metadata]=Object.create(v,{})}}}};var O=class y{static mCurrentInjectionContext=null;static mInjectMode=new Map;static mInjectableConstructor=new Map;static mInjectableReplacement=new Map;static mInjectionConstructorIdentificationMetadataKey=Symbol("InjectionConstructorIdentification");static mSingletonMapping=new Map;static createObject(t,e,i){let[u,m]=typeof e=="object"&&e!==null?[!1,e]:[!!e,i??new Map],v=y.getInjectionIdentification(t);if(!y.mInjectableConstructor.has(v))throw new A(`Constructor "${t.name}" is not registered for injection and can not be built`,y);let w=u?"instanced":y.mInjectMode.get(v),D=new Map(m.entries().map(([r,h])=>[y.getInjectionIdentification(r),h])),S=y.mCurrentInjectionContext,l=new Map([...S?.localInjections.entries()??[],...D.entries()]);y.mCurrentInjectionContext={injectionMode:w,localInjections:l};try{if(!u&&w==="singleton"&&y.mSingletonMapping.has(v))return y.mSingletonMapping.get(v);let r=new t;return w==="singleton"&&!y.mSingletonMapping.has(v)&&y.mSingletonMapping.set(v,r),r}finally{y.mCurrentInjectionContext=S}}static injectable(t="instanced"){return(e,i)=>{y.registerInjectable(e,i.metadata,t)}}static registerInjectable(t,e,i){let u=y.getInjectionIdentification(t,e);y.mInjectableConstructor.set(u,t),y.mInjectMode.set(u,i)}static replaceInjectable(t,e){let i=y.getInjectionIdentification(t);if(!y.mInjectableConstructor.has(i))throw new A("Original constructor is not registered.",y);let u=y.getInjectionIdentification(e);if(!y.mInjectableConstructor.has(u))throw new A("Replacement constructor is not registered.",y);y.mInjectableReplacement.set(i,e)}static use(t){if(y.mCurrentInjectionContext===null)throw new A("Can't create object outside of an injection context.",y);let e=y.getInjectionIdentification(t);if(y.mCurrentInjectionContext.injectionMode!=="singleton"&&y.mCurrentInjectionContext.localInjections.has(e))return y.mCurrentInjectionContext.localInjections.get(e);let i=y.mInjectableReplacement.get(e);if(i||(i=y.mInjectableConstructor.get(e)),!i)throw new A(`Constructor "${t.name}" is not registered for injection and can not be built`,y);return y.createObject(i)}static getInjectionIdentification(t,e){let i=e?ct.forInternalDecorator(e):ct.get(t),u=i.getMetadata(y.mInjectionConstructorIdentificationMetadataKey);return u||(u=Symbol(t.name),i.setMetadata(y.mInjectionConstructorIdentificationMetadataKey,u)),u}};var q=function(y){return y[y.Read=1]="Read",y[y.ReadWrite=2]="ReadWrite",y[y.Write=3]="Write",y}({});var At=class{mHooks;mInjections;mProcessor;mProcessorConstructor;get processor(){if(!this.mProcessor)throw new A("Processor is not created yet. Call setup to create processor.",this);return this.mProcessor}get processorConstructor(){return this.mProcessorConstructor}constructor(t){if(this.mProcessorConstructor=t.constructor,this.mProcessor=null,this.mInjections=new Map,this.mHooks={create:new Array},t.parent)for(let[e,i]of t.parent.mInjections.entries())this.setProcessorInjection(e,i)}deconstruct(){}getProcessorInjection(t){return this.mInjections.get(t)}setProcessorInjection(t,e){if(this.mProcessor)throw new A("Cant add injections to after construction.",this);this.mInjections.set(t,e)}setup(){return this.mProcessor=this.createProcessor(),this}addConstructionHook(t){return this.mHooks.create.push(t),this}call(t,...e){let i=Reflect.get(this.processor,t);return typeof i!="function"?null:i.apply(this.processor,e)}createProcessor(){let t=O.createObject(this.mProcessorConstructor,this.mInjections),e;for(;e=this.mHooks.create.pop();){let i=e.call(this,t);i&&(t=i)}return t}};var $t=class y extends At{constructor(t,e){super({constructor:t,parent:e}),this.setProcessorInjection(y,this)}deconstruct(){this.call("onDeconstruct"),super.deconstruct()}setup(){return super.setup(),this.call("onExecute"),this}onUpdate(){return!1}};var Do=class y{static mInstance;mCoreEntityConstructor;mProcessorConstructorConfiguration;constructor(){if(y.mInstance)return y.mInstance;y.mInstance=this,this.mCoreEntityConstructor=new Map,this.mProcessorConstructorConfiguration=new Map}get(t){let e=this.mCoreEntityConstructor.get(t);if(!e)return new Array;let i=new Array;for(let u of e)i.push({processorConstructor:u,processorConfiguration:this.mProcessorConstructorConfiguration.get(u)});return i}register(t,e,i){this.mProcessorConstructorConfiguration.set(e,i);let u=t;do{if(!(u.prototype instanceof At)&&u!==At)break;this.mCoreEntityConstructor.has(u)||this.mCoreEntityConstructor.set(u,new Set),this.mCoreEntityConstructor.get(u).add(e)}while(u=Object.getPrototypeOf(u))}},ft=new Do;var kt=class y extends At{static mExtensionCache=new WeakMap;mExtensionList;constructor(t){super(t),this.mExtensionList=new Array}deconstruct(){for(let t of this.mExtensionList)t.deconstruct();super.deconstruct()}setup(){return super.setup(),this.executeExtensions(),this}executeExtensions(){let t=(()=>{if(!y.mExtensionCache.has(this.processorConstructor)){let u=ft.get($t).filter(v=>{for(let w of v.processorConfiguration.targetRestrictions)if(this instanceof w||this.processorConstructor.prototype instanceof w||this.processorConstructor===w)return!0;return!1}),m={read:u.filter(v=>v.processorConfiguration.access===q.Read),write:u.filter(v=>v.processorConfiguration.access===q.Write),readWrite:u.filter(v=>v.processorConfiguration.access===q.ReadWrite)};y.mExtensionCache.set(this.processorConstructor,m)}return y.mExtensionCache.get(this.processorConstructor)})(),e=[...t.write,...t.readWrite,...t.read];for(let i of e)this.mExtensionList.push(new $t(i.processorConstructor,this).setup())}};var X={get:1,set:2,manual:4};var Oe=class y{static ORIGINAL_TO_INTERACTION_MAPPING=new WeakMap;static PROXY_TO_ORIGINAL_MAPPING=new WeakMap;static UNTRACEABLE_FUNCTION_UPDATE_TRIGGER=(()=>{let t=new WeakMap;return t.set(Array.prototype.fill,X.set),t.set(Array.prototype.pop,X.get),t.set(Array.prototype.push,X.set),t.set(Array.prototype.shift,X.get),t.set(Array.prototype.unshift,X.set),t.set(Array.prototype.splice,X.set),t.set(Array.prototype.reverse,X.set),t.set(Array.prototype.sort,X.set),t.set(Array.prototype.concat,X.set),t.set(Map.prototype.clear,X.set),t.set(Map.prototype.delete,X.set),t.set(Map.prototype.set,X.set),t.set(Set.prototype.clear,X.set),t.set(Set.prototype.delete,X.set),t.set(Set.prototype.add,X.set),t})();static getOriginal(t){return y.PROXY_TO_ORIGINAL_MAPPING.get(t)??t}static getWrapper(t){let e=y.getOriginal(t);return y.ORIGINAL_TO_INTERACTION_MAPPING.get(e)}mProxyObject;mStateChangeCallback;get proxy(){return this.mProxyObject}constructor(t,e){let i=y.getWrapper(t);if(i)return i;this.mProxyObject=this.createProxyObject(t),this.mStateChangeCallback=e,y.PROXY_TO_ORIGINAL_MAPPING.set(this.mProxyObject,t),y.ORIGINAL_TO_INTERACTION_MAPPING.set(t,this)}convertToProxy(t){return t===null||typeof t!="object"&&typeof t!="function"?t:new y(t,this.mStateChangeCallback).proxy}createProxyObject(t){let e=(u,m,v)=>{let w=y.getOriginal(m);try{let D=u.call(w,...v);return this.convertToProxy(D)}finally{if(y.UNTRACEABLE_FUNCTION_UPDATE_TRIGGER.has(u)){let D=y.getWrapper(m);D&&D.dispatch(y.UNTRACEABLE_FUNCTION_UPDATE_TRIGGER.get(u))}}};return new Proxy(t,{apply:(u,m,v)=>{let w=u;try{let D=w.call(m,...v);return this.convertToProxy(D)}catch(D){if(!(D instanceof TypeError))throw D;return e(w,m,v)}},set:(u,m,v)=>{try{let w=v;return(w!==null&&typeof w=="object"||typeof w=="function")&&(w=y.getOriginal(w)),Reflect.set(u,m,w)}finally{this.dispatch(X.set)}},get:(u,m,v)=>{try{return this.convertToProxy(Reflect.get(u,m))}finally{this.dispatch(X.get)}},deleteProperty:(u,m)=>{try{return delete u[m]}finally{this.dispatch(X.set)}}})}dispatch(t){this.mStateChangeCallback(t)}};var V=class y{static reaction(t){let e=Dt.create("ComponentState reaction");e.addInteractionListener(i=>{(i.triggerType&X.set)!==0&&t()}),e.execute(()=>{t()})}static state(t){return(e,i)=>{if(i.static)throw new A("Event target is not for a static property.",y);let u=new WeakMap,m=(v,w)=>{u.set(v,new y(w,t))};return{init(v){return typeof v>"u"||m(this,v),v},set(v){u.has(this)?u.get(this).set(v):m(this,v)},get(){return u.has(this)||m(this,void 0),u.get(this).get()}}}}mConfiguration;mLinkedZones;mLinkedZonesArray;mValue;constructor(t,e){if(this.mLinkedZones=new Set,this.mLinkedZonesArray=new Array,this.mConfiguration={complexValue:e?.complexValue??!1,proxy:e?.proxy??!1},this.mConfiguration.proxy){if(typeof t!="object"||t===null)throw new A("Proxied component state value must be an object.",this);this.mValue=new Oe(t,i=>{switch(i){case X.set:return this.dispatchChange();case X.get:return this.linkCurrentZone()}}).proxy}else this.mValue=t}get(){return this.linkCurrentZone(),this.mValue}set(t){if(this.mConfiguration.proxy)throw new A("Proxy is not implemented yet.",this);!this.mConfiguration.complexValue&&this.mValue===t||(this.mValue=t,this.dispatchChange())}dispatchChange(){for(let t of this.mLinkedZonesArray)t.pushInteraction(X.set,this)}linkCurrentZone(){let t=Dt.current;this.mLinkedZones.has(t)||(this.mLinkedZones.add(t),this.mLinkedZonesArray.push(t))}};var Gt=class y{static mCurrentUpdateCycle=null;static openResheduledCycle(t,e){let i=!1;if(!y.mCurrentUpdateCycle){let u=performance.now();y.mCurrentUpdateCycle={initiator:t.initiator,startTime:u,forcedSync:t.forcedSync,runner:t.runner},i=!0}try{return e(y.mCurrentUpdateCycle)}finally{i&&(y.mCurrentUpdateCycle=null)}}static openUpdateCycle(t,e){let i=!1;if(!y.mCurrentUpdateCycle){let u=performance.now();y.mCurrentUpdateCycle={initiator:t.updater,startTime:u,forcedSync:t.runSync,runner:Symbol("Runner "+u)},i=!0}try{return e(y.mCurrentUpdateCycle)}finally{i&&(y.mCurrentUpdateCycle=null)}}static updateCycleRunId(t,e){if(t.initiator===e){let i=performance.now(),u=t;u.runner=Symbol("Runner "+i)}}static updateCyleStartTime(t){let e=performance.now(),i=t;i.startTime=e}};var Fe=class extends Error{mChain;get chain(){return this.mChain}constructor(t,e){let i=e.slice(-20).map(u=>u.toString()).join(`
`);super(`${t}: 
${i}`),this.mChain=[...e]}};var ze=class y{static DEFAULT_FRAME_TIME=Number.MAX_SAFE_INTEGER;static STACK_CAP=100;mFrameTime;mInteractionZone;mManualComponentState;mUpdateFunction;mUpdateRunCache;mUpdateStates;get zone(){return this.mInteractionZone}constructor(t){this.mUpdateRunCache=new WeakMap,this.mUpdateFunction=t.onUpdate,this.mFrameTime=y.DEFAULT_FRAME_TIME;let e=Dt.current.getAttachment(It.ATTACHMENT_KEY);e&&(this.mFrameTime=e.guaranteedFrameTime),this.mManualComponentState=new V(Symbol("Manual Update")),this.mUpdateStates={chainCompleteHooks:new jt,async:{hasSheduledTask:!1,hasRunningTask:!1,sheduledTaskIsResheduled:!1},sync:{running:!1},cycle:{chainedTask:null}},this.mInteractionZone=Dt.create("Update-Zone"),this.mInteractionZone.addInteractionListener(i=>{(i.triggerType&X.set)!==0&&this.runUpdateAsynchron(i,null)})}deconstruct(){this.mInteractionZone.removeInteractionListener()}executeInZone(t){return this.mInteractionZone.execute(t)}update(){let t=new Bt(X.manual,this.mInteractionZone,this.mManualComponentState);return this.runUpdateSynchron(t)}updateAsync(){let t=new Bt(X.manual,this.mInteractionZone,this.mManualComponentState);this.runUpdateAsynchron(t,null)}async waitForUpdate(){return this.mUpdateStates.async.hasSheduledTask?new Promise((t,e)=>{this.mUpdateStates.chainCompleteHooks.push((i,u)=>{u?e(u):t(i)})}):!1}executeTaskChain(t,e,i,u){if(u.length>y.STACK_CAP)throw new Fe("Call loop detected",u);let m=performance.now();if(!e.forcedSync&&m-e.startTime>this.mFrameTime)throw new be;u.push(t);let v=this.mInteractionZone.execute(()=>this.mUpdateFunction.call(this))||i;if(Gt.updateCycleRunId(e,this),!this.mUpdateStates.cycle.chainedTask)return v;let w=this.mUpdateStates.cycle.chainedTask;return this.mUpdateStates.cycle.chainedTask=null,this.executeTaskChain(w,e,v,u)}releaseUpdateChainCompleteHooks(t,e){if(!this.mUpdateStates.chainCompleteHooks.top)return;let i;for(;i=this.mUpdateStates.chainCompleteHooks.pop();)i(t,e)}runUpdateAsynchron(t,e){if(this.mUpdateStates.async.hasRunningTask||this.mUpdateStates.async.sheduledTaskIsResheduled){this.mUpdateStates.cycle.chainedTask=t;return}if(this.mUpdateStates.async.hasSheduledTask)return;let i=u=>{this.mUpdateStates.async.hasRunningTask=!0,this.mUpdateStates.async.hasSheduledTask=!1,this.mUpdateStates.async.sheduledTaskIsResheduled=!1;let m=!1;try{this.runUpdateSynchron(t)}catch(v){if(v instanceof be&&u.initiator===this)m=!0;else throw new Kt(v,this.zone)}finally{this.mUpdateStates.async.hasRunningTask=!1}m&&this.runUpdateAsynchron(t,u)};this.mUpdateStates.async.hasSheduledTask=!0,e&&(this.mUpdateStates.async.sheduledTaskIsResheduled=!0),globalThis.requestAnimationFrame(()=>{e?Gt.openResheduledCycle(e,i):Gt.openUpdateCycle({updater:this,runSync:!1},i)})}runUpdateSynchron(t){if(this.mUpdateStates.sync.running)return this.mUpdateStates.cycle.chainedTask=t,!1;this.mUpdateStates.sync.running=!0;try{let e=Gt.openUpdateCycle({updater:this,runSync:!0},i=>{if(this.mUpdateRunCache.has(i.runner))return Gt.updateCyleStartTime(i),this.mUpdateRunCache.get(i.runner);let u=this.executeTaskChain(t,i,!1,new Array);return this.mUpdateRunCache.set(i.runner,u),u});return this.releaseUpdateChainCompleteHooks(e),e}catch(e){throw e instanceof be||this.releaseUpdateChainCompleteHooks(!1,e),e}finally{this.mUpdateStates.sync.running=!1}}},be=class extends Error{constructor(){super("Update resheduled")}};var je=class extends kt{mUpdater;get updater(){return this.mUpdater}constructor(t){super(t),this.mUpdater=new ze({label:t.constructor.name,onUpdate:()=>this.onUpdate()})}call(t,...e){return this.mUpdater.executeInZone(()=>super.call(t,...e))}deconstruct(){this.mUpdater.deconstruct(),super.deconstruct()}createProcessor(){return this.mUpdater.executeInZone(()=>super.createProcessor())}};var Wt=class{mExpression;mTemporaryValues;constructor(t,e,i){if(this.mTemporaryValues=new nt,i.length>0)for(let u of i)this.mTemporaryValues.set(u,void 0);this.mExpression=this.createEvaluationFunction(t,this.mTemporaryValues).bind(e.store)}execute(){return this.mExpression()}setTemporaryValue(t,e){if(!this.mTemporaryValues.has(t))throw new A(`Temporary value "${t}" does not exist for this procedure.`,this);this.mTemporaryValues.set(t,e)}createEvaluationFunction(t,e){let i,u=`__${Math.random().toString(36).substring(2)}`;if(i="return function () {",e.size>0)for(let m of e.keys())i+=`const ${m} = ${u}.get('${m}');`;return i+=`return ${t};`,i+="};",new Function(u,i)(e)}};var Pt=class{mDataLevel;get data(){return this.mDataLevel}constructor(t){this.mDataLevel=t}createExpressionProcedure(t,e){return new Wt(t,this.data,e??[])}setTemporaryValue(t,e){this.data.setTemporaryValue(t,e)}};var gt=class{mComponent;mDataProxy;mParentLevel;mTemporaryValues;get store(){return this.mDataProxy}constructor(t){this.mTemporaryValues=new nt,t instanceof G?(this.mParentLevel=null,this.mComponent=t):(this.mParentLevel=t,this.mComponent=t.mComponent),this.mDataProxy=this.createAccessProxy()}deleteTemporaryValue(t){this.mTemporaryValues.delete(t)}setTemporaryValue(t,e){this.mTemporaryValues.set(t,e)}updateLevelData(t){if(t.mParentLevel!==this.mParentLevel)throw new A("Can't update InstructionLevelData for a deeper level than it target data.",this);this.mTemporaryValues=t.mTemporaryValues}createAccessProxy(){return new Proxy(new Object,{get:(t,e)=>this.getValue(e),set:(t,e,i)=>(this.hasTemporaryValue(e)&&this.setTemporaryValue(e,i),e in this.mComponent.processor?(this.mComponent.processor[e]=i,!0):(this.setTemporaryValue(e,i),!0)),deleteProperty:()=>{throw new A("Deleting properties is not allowed",this)},ownKeys:()=>[...new Set([...Object.keys(this.mComponent.processor),...this.getTemporaryValuesList()])]})}getTemporaryValuesList(){let t=this.mTemporaryValues.map(e=>e);return this.mParentLevel&&t.push(...this.mParentLevel.getTemporaryValuesList()),t}getValue(t){if(this.mTemporaryValues.has(t))return this.mTemporaryValues.get(t);if(this.mParentLevel)return this.mParentLevel.getValue(t);if(t in this.mComponent.processor)return this.mComponent.processor[t]}hasTemporaryValue(t){return this.mTemporaryValues.has(t)?!0:this.mParentLevel?this.mParentLevel.hasTemporaryValue(t):!1}};var Zt=class y{mChildList;mInstruction;mInstructionType;get childList(){return this.mChildList}get instruction(){return this.mInstruction}get instructionType(){return this.mInstructionType}constructor(t,e){this.mChildList=Array(),this.mInstruction=e,this.mInstructionType=t}appendChild(...t){this.mChildList.push(...t)}clone(){let t=new y(this.instructionType,this.instruction);for(let e of this.mChildList)t.appendChild(e.clone());return t}equals(t){if(!(t instanceof y)||t.instruction!==this.instruction||t.instructionType!==this.instructionType||t.childList.length!==this.childList.length)return!1;for(let e=0;e<t.childList.length;e++)if(!t.childList[e].equals(this.childList[e]))return!1;return!0}removeChild(t){let e=this.mChildList.indexOf(t);if(e!==-1)return this.mChildList.splice(e,1)[0]}};var Nt=class y{mExpression;get value(){return this.mExpression}constructor(t){this.mExpression=t}clone(){return new y(this.mExpression)}equals(t){return t instanceof y&&t.value===this.value}toString(){return`{{ ${this.mExpression} }}`}};var Lt=class y{mContainsExpression;mTextValue;mValues;get containsExpression(){return this.mContainsExpression}get values(){return this.mValues}constructor(){this.mTextValue="",this.mContainsExpression=!1,this.mValues=[]}addValue(...t){for(let e of t)(this.mContainsExpression===!0||e instanceof Nt)&&(this.mContainsExpression=!0),this.mValues.push(e),this.mTextValue+=e.toString()}clone(){let t=new y;for(let e of this.values)typeof e=="string"?t.addValue(e):t.addValue(e.clone());return t}equals(t){if(!(t instanceof y)||t.values.length!==this.values.length)return!1;for(let e=0;e<this.values.length;e++){let i=this.values[e],u=t.values[e];if(i!==u&&(typeof i!=typeof u||typeof i=="string"&&i!==u||!u.equals(i)))return!1}return!0}toString(){return this.mTextValue}};var we=class y{mName;mValue;get name(){return this.mName}get values(){return this.mValue}constructor(t){this.mName=t,this.mValue=new Lt}clone(){let t=new y(this.name);for(let e of this.values.values)typeof e=="string"?t.values.addValue(e):t.values.addValue(e.clone());return t}equals(t){return!(!(t instanceof y)||t.name!==this.name||!t.values.equals(this.values))}};var Rt=class y{mAttributeDictionary;mChildList;mTagName;get attributes(){return[...this.mAttributeDictionary.values()]}get childList(){return this.mChildList}get tagName(){return this.mTagName}constructor(t){this.mAttributeDictionary=new Map,this.mChildList=Array(),this.mTagName=t}appendChild(...t){this.mChildList.push(...t)}clone(){let t=new y(this.tagName);for(let e of this.mAttributeDictionary.values()){let i=t.setAttribute(e.name);for(let u of e.values.values)typeof u=="string"?i.addValue(u):i.addValue(u.clone())}for(let e of this.mChildList)t.appendChild(e.clone());return t}equals(t){if(!(t instanceof y)||t.tagName!==this.tagName||t.attributes.length!==this.mAttributeDictionary.size||t.childList.length!==this.mChildList.length)return!1;for(let e of t.mAttributeDictionary.values()){let i=this.mAttributeDictionary.get(e.name);if(!i||!i.equals(e))return!1}for(let e=0;e<t.childList.length;e++)if(!t.childList[e].equals(this.mChildList[e]))return!1;return!0}getAttribute(t){return this.mAttributeDictionary.get(t)?.values??null}removeAttribute(t){return this.mAttributeDictionary.delete(t)}removeChild(t){let e=this.mChildList.indexOf(t);if(e!==-1)return this.mChildList.splice(e,1)[0]}setAttribute(t){if(this.mAttributeDictionary.has(t))return this.mAttributeDictionary.get(t).values;let e=new we(t);return this.mAttributeDictionary.set(t,e),e.values}};var dt=class y{mBodyElementList;get body(){return this.mBodyElementList}constructor(){this.mBodyElementList=new Array}appendChild(...t){this.mBodyElementList.push(...t)}clone(){let t=new y;for(let e of this.mBodyElementList)t.appendChild(e.clone());return t}equals(t){if(!(t instanceof y)||t.body.length!==this.mBodyElementList.length)return!1;for(let e=0;e<this.mBodyElementList.length;e++)if(!this.mBodyElementList[e].equals(t.body[e]))return!1;return!0}removeChild(t){let e=this.mBodyElementList.indexOf(t);if(e!==-1)return this.mBodyElementList.splice(e,1)[0]}};var ut=class{mComponentValues;mContent;mModules;mTemplate;get anchor(){return this.mContent.contentAnchor}get content(){return this.mContent}get modules(){return this.mModules}get template(){return this.mTemplate}get values(){return this.mComponentValues}constructor(t,e,i,u){this.mTemplate=t,this.mComponentValues=i,this.mContent=u,this.mModules=e,u.setCoreBuilder(this)}deconstruct(){this.content.deconstruct()}update(){let t=this.onUpdate(),e=!1,i=this.content.builders;if(i.length>0)for(let u=0;u<i.length;u++)e=i[u].update()||e;return t||e}createTextNode(t){return document.createTextNode(t)}};var te=class{mChildBuilderList;mChildComponents;mContentAnchor;mContentBoundary;mLinkedContent;mRootChildList;get body(){return this.mRootChildList}get builders(){return this.mChildBuilderList}get contentAnchor(){return this.mContentAnchor}constructor(t){this.mChildBuilderList=new Array,this.mRootChildList=new Array,this.mChildComponents=new Map,this.mLinkedContent=new WeakSet,this.mContentAnchor=document.createComment(t),this.mContentBoundary={start:this.mContentAnchor,end:this.mContentAnchor}}deconstruct(){this.onDeconstruct();let t;for(;t=this.mChildBuilderList.pop();)t.deconstruct();for(let i of this.mChildComponents.values())i.deconstruct();this.mChildComponents.clear();let e;for(;e=this.mRootChildList.pop();)e instanceof ut||e.remove();this.contentAnchor.remove()}getBoundary(){let t=this.mContentBoundary.end instanceof ut?this.mContentBoundary.end.content.getBoundary().end:this.mContentBoundary.end;return{start:this.mContentBoundary.start,end:t}}insert(t,e,i){if(!this.mLinkedContent.has(i))throw new A("Can't add content to builder. Target is not part of builder.",this);let u=t instanceof ut?t.anchor:t;switch(e){case"After":{this.insertAfter(u,i);break}case"TopOf":{this.insertTop(u,i);break}case"BottomOf":{this.insertBottom(u,i);break}}this.mLinkedContent.add(t),t instanceof ut?this.mChildBuilderList.push(t):this.addChildComponent(t);let m=u.parentElement??u.getRootNode(),v=this.mContentAnchor.parentElement??this.mContentAnchor.getRootNode();if(m===v){let w=(()=>{switch(e){case"After":return this.mRootChildList.indexOf(i)+1;case"TopOf":return 0;case"BottomOf":return this.mRootChildList.length}})();w===this.mRootChildList.length&&(this.mContentBoundary.end=t),this.mRootChildList.splice(w+1,0,t)}}remove(t){if(!this.mLinkedContent.has(t))throw new A("Child node cant be deleted from builder when it not a child of them",this);if(this.mLinkedContent.delete(t),t instanceof ut){let i=this.mChildBuilderList.indexOf(t);i!==-1&&this.mChildBuilderList.splice(i,1),t.deconstruct()}else{let i=this.mChildComponents.get(t);i&&(i.deconstruct(),this.mChildComponents.delete(t)),t.remove()}let e=this.mRootChildList.indexOf(t);e!==-1&&(this.mRootChildList.splice(e,1),this.mContentBoundary.end=this.mRootChildList.at(-1)??this.mContentAnchor)}setCoreBuilder(t){this.mLinkedContent.add(t)}addChildComponent(t){Q.elementIsComponent(t)&&this.mChildComponents.set(t,Q.ofElement(t).component)}insertAfter(t,e){let i=e instanceof ut?e.content.getBoundary().end:e;(i.parentElement??i.getRootNode()).insertBefore(t,i.nextSibling)}insertBottom(t,e){if(e instanceof ut){this.insertAfter(t,e);return}if(e instanceof Element){e.appendChild(t);return}throw new A("Source node does not support child nodes.",this)}insertTop(t,e){if(e instanceof ut){this.insertAfter(t,e.anchor);return}if(e instanceof Element){e.prepend(t);return}throw new A("Source node does not support child nodes.",this)}};var Ve=class extends te{mAttributeModulesChangedOrder;mLinkedAttributeData;mLinkedAttributeExpressionModules;mLinkedAttributeModuleList;mLinkedExpressionModuleList;get linkedAttributeModules(){return this.mAttributeModulesChangedOrder&&(this.mAttributeModulesChangedOrder=!1,this.mLinkedAttributeModuleList.sort((t,e)=>t.accessMode-e.accessMode)),this.mLinkedAttributeModuleList}get linkedExpressionModules(){return this.mLinkedExpressionModuleList}constructor(t){super(t),this.mLinkedExpressionModuleList=new Array,this.mLinkedAttributeModuleList=new Array,this.mLinkedAttributeExpressionModules=new WeakMap,this.mLinkedAttributeData=new WeakMap,this.mAttributeModulesChangedOrder=!1}attributeOfLinkedExpressionModule(t){return this.mLinkedAttributeExpressionModules.get(t)}getLinkedAttributeData(t){if(!this.mLinkedAttributeData.has(t))throw new A("Attribute has no linked data.",this);return this.mLinkedAttributeData.get(t)}linkAttributeExpression(t,e){this.mLinkedAttributeExpressionModules.set(t,e)}linkAttributeModule(t){this.mLinkedAttributeModuleList.push(t),this.mAttributeModulesChangedOrder=!0}linkAttributeNodes(t,e,i){this.mLinkedAttributeData.set(t,{values:i,node:e})}linkExpressionModule(t){this.mLinkedExpressionModuleList.push(t)}onDeconstruct(){for(let t of this.mLinkedAttributeModuleList)t.deconstruct();for(let t of this.mLinkedExpressionModuleList)t.deconstruct()}};var Be=class extends te{mInstructionModule;get instructionModule(){return this.mInstructionModule}constructor(t,e){super(e),this.mInstructionModule=t}onDeconstruct(){this.mInstructionModule.deconstruct()}};var $e=class extends ut{constructor(t,e,i){let u=e.createInstructionModule(t,i);super(t,e,i,new Be(u,`Instruction - {$${t.instructionType}}`))}onUpdate(){if(this.content.instructionModule.update()){let t=this.content.body;this.updateStaticBuilder(t,this.content.instructionModule.instructionResult.elementList)}return!1}insertNewContent(t,e){let i=new ee(t.template,this.modules,t.dataLevel,`Child - {$${this.template.instructionType}}`,t.key);return e===null?this.content.insert(i,"TopOf",this):this.content.insert(i,"After",e),i}updateStaticBuilder(t,e){let u=new de((w,D)=>D.template.equals(w.template)&&D.key===w.key).differencesOf(t,e),m=0,v=null;for(let w=0;w<u.length;w++){let D=u[w];if(D.changeState===St.Remove)this.content.remove(D.item);else if(D.changeState===St.Insert)v=this.insertNewContent(D.item,v),m++;else{let S=e[m].dataLevel;D.item.values.updateLevelData(S),v=D.item,m++}}}};var ee=class extends ut{mInitialized;mKey;get key(){return this.mKey}constructor(t,e,i,u,m){super(t,e,i,new Ve(`Static - {${u}}`)),this.mKey=m,this.mInitialized=!1}onUpdate(){this.mInitialized||(this.mInitialized=!0,this.buildTemplate([this.template],this));let t=!1,e=this.content.linkedAttributeModules;for(let m=0;m<e.length;m++)t=e[m].update()||t;let i=!1,u=this.content.linkedExpressionModules;for(let m=0;m<u.length;m++){let v=u[m];if(v.update()){i=!0;let w=this.content.attributeOfLinkedExpressionModule(v);if(!w)continue;let D=this.content.getLinkedAttributeData(w),S=D.values.reduce((l,r)=>l+r.data,"");D.node.setAttribute(w.name,S)}}return t||i}buildInstructionTemplate(t,e){this.content.insert(new $e(t,this.modules,new gt(this.values)),"BottomOf",e)}buildStaticTemplate(t,e){let{element:i,isComponent:u}=this.createHtmlElement(t),m=null;u&&(m=new Array);for(let v of t.attributes){let w=this.modules.createAttributeModule(v,i,this.values);if(w){this.content.linkAttributeModule(w),u&&m.push(w);continue}if(v.values.containsExpression){let D=new Array;for(let S of v.values.values){let l=this.createTextNode("");if(D.push(l),!(S instanceof Nt)){l.data=S;continue}let r=this.modules.createExpressionModule(S,l,this.values);this.content.linkExpressionModule(r),this.content.linkAttributeExpression(r,v)}this.content.linkAttributeNodes(v,i,D);continue}i.setAttribute(v.name,v.values.toString())}if(u){for(let v of m)v.update();Q.ofElement(i).component.updater.update()}this.content.insert(i,"BottomOf",e),this.buildTemplate(t.childList,i)}buildTemplate(t,e){for(let i of t)i instanceof dt?this.buildTemplate(i.body,e):i instanceof Lt?this.buildTextTemplate(i,e):i instanceof Zt?this.buildInstructionTemplate(i,e):i instanceof Rt&&this.buildStaticTemplate(i,e)}buildTextTemplate(t,e){for(let i of t.values){if(typeof i=="string"){this.content.insert(this.createTextNode(i),"BottomOf",e);continue}let u=this.createTextNode("");this.content.insert(u,"BottomOf",e);let m=this.modules.createExpressionModule(i,u,this.values);this.content.linkExpressionModule(m)}}createHtmlElement(t){let e=t.tagName;if(e.includes("-")){let u=globalThis.customElements.get(e);if(typeof u<"u"){let m=new u;return{element:m,isComponent:Q.elementIsComponent(m)}}}let i=t.getAttribute("xmlns");return i&&!i.containsExpression?{element:document.createElementNS(i.values[0],e),isComponent:!1}:{element:document.createElement(e),isComponent:!1}}};var xe=class{mHtmlElement;mShadowRoot;get htmlElement(){return this.mHtmlElement}get shadowRoot(){return this.mShadowRoot}constructor(t){this.mHtmlElement=t,this.mShadowRoot=this.mHtmlElement.attachShadow({mode:"open"})}};var W=class{mDataLevel;get data(){return this.mDataLevel}constructor(t){this.mDataLevel=t}createExpressionProcedure(t,e){return new Wt(t,this.data,e??[])}};var Ut=class extends kt{constructor(t){super({constructor:t.constructor,parent:t.parent}),this.setProcessorInjection(W,new W(t.values))}deconstruct(){super.deconstruct(),this.call("onDeconstruct")}update(){return this.onUpdate()}};var ot=class{mValue;get value(){return this.mValue}constructor(t){this.mValue=t}};var k=class{constructor(){throw new A("Reference should not be instanced.",this)}};var vt=class{constructor(){throw new A("Reference should not be instanced.",this)}};var Ht=class y extends Ut{mLastResult;mTargetTextNode;constructor(t){super({constructor:t.constructor,parent:t.parent,values:t.values}),this.mTargetTextNode=t.targetNode,this.mLastResult=null,this.setProcessorInjection(y,this),this.setProcessorInjection(vt,t.targetTemplate.clone()),this.setProcessorInjection(k,t.targetNode),this.setProcessorInjection(ot,new ot(t.targetTemplate.value))}onUpdate(){let t=this.call("onUpdate");t===null&&(t="");let e=this.mLastResult===null||this.mLastResult!==t;if(e){let i=this.mTargetTextNode;i.data=t,this.mLastResult=t}return e}};function Eo(){return(y,t)=>{O.registerInjectable(y,t.metadata,"instanced"),ft.register(Ht,y,{})}}function Il(){function y(l,r){return function(c){e(r,"addInitializer"),i(c,"An initializer"),l.push(c)}}function t(l,r,h,c,o,b,p,T,x){var d;switch(o){case 1:d="accessor";break;case 2:d="method";break;case 3:d="getter";break;case 4:d="setter";break;default:d="field"}var s={kind:d,name:p?"#"+r:r,static:b,private:p,metadata:T},f={v:!1};s.addInitializer=y(c,f);var n,a;if(o===0?p?(n=h.get,a=h.set):(n=function(){return this[r]},a=function(g){this[r]=g}):o===2?n=function(){return h.value}:((o===1||o===3)&&(n=function(){return h.get.call(this)}),(o===1||o===4)&&(a=function(g){h.set.call(this,g)})),p)s.access=n&&a?{get:n,set:a}:n?{get:n}:{set:a};else{if(n){var I=n;n=function(g){return arguments.length===0&&(g=this),I.call(g)}}if(a){var P=a;a=function(g,_){return arguments.length===1&&(_=g,g=this),P.call(g,_)}}var E=function(g){return r in g};s.access=n&&a?{has:E,get:n,set:a}:n?{has:E,get:n}:{has:E,set:a}}try{return l(x,s)}finally{f.v=!0}}function e(l,r){if(l.v)throw new Error("attempted to call "+r+" after decoration was finished")}function i(l,r){if(typeof l!="function")throw new TypeError(r+" must be a function")}function u(l,r){var h=typeof r;if(l===1){if(h!=="object"||r===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");r.get!==void 0&&i(r.get,"accessor.get"),r.set!==void 0&&i(r.set,"accessor.set"),r.init!==void 0&&i(r.init,"accessor.init")}else if(h!=="function"){var c;throw l===0?c="field":l===10?c="class":c="method",new TypeError(c+" decorators must return a function or void 0")}}function m(l,r,h,c,o,b,p,T,x){var d=h[0],s,f,n;p?o===0||o===1?s={get:h[3],set:h[4]}:o===3?s={get:h[3]}:o===4?s={set:h[3]}:s={value:h[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(r,c)),o===1?n={get:s.get,set:s.set}:o===2?n=s.value:o===3?n=s.get:o===4&&(n=s.set);var a,I,P;if(typeof d=="function")a=t(d,c,s,T,o,b,p,x,n),a!==void 0&&(u(o,a),o===0?f=a:o===1?(f=a.init,I=a.get||n.get,P=a.set||n.set,n={get:I,set:P}):n=a);else for(var E=d.length-1;E>=0;E--){var g=d[E];if(a=t(g,c,s,T,o,b,p,x,n),a!==void 0){u(o,a);var _;o===0?_=a:o===1?(_=a.init,I=a.get||n.get,P=a.set||n.set,n={get:I,set:P}):n=a,_!==void 0&&(f===void 0?f=_:typeof f=="function"?f=[f,_]:f.push(_))}}if(o===0||o===1){if(f===void 0)f=function(M,C){return C};else if(typeof f!="function"){var F=f;f=function(M,C){for(var N=C,L=0;L<F.length;L++)N=F[L].call(M,N);return N}}else{var j=f;f=function(M,C){return j.call(M,C)}}l.push(f)}o!==0&&(o===1?(s.get=n.get,s.set=n.set):o===2?s.value=n:o===3?s.get=n:o===4&&(s.set=n),p?o===1?(l.push(function(M,C){return n.get.call(M,C)}),l.push(function(M,C){return n.set.call(M,C)})):o===2?l.push(n):l.push(function(M,C){return n.call(M,C)}):Object.defineProperty(r,c,s))}function v(l,r,h){for(var c=[],o,b,p=new Map,T=new Map,x=0;x<r.length;x++){var d=r[x];if(Array.isArray(d)){var s=d[1],f=d[2],n=d.length>3,a=s>=5,I,P;if(a?(I=l,s=s-5,b=b||[],P=b):(I=l.prototype,o=o||[],P=o),s!==0&&!n){var E=a?T:p,g=E.get(f)||0;if(g===!0||g===3&&s!==4||g===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!g&&s>2?E.set(f,s):E.set(f,!0)}m(c,I,d,f,s,a,n,P,h)}}return w(c,o),w(c,b),c}function w(l,r){r&&l.push(function(h){for(var c=0;c<r.length;c++)r[c].call(h);return h})}function D(l,r,h){if(r.length>0){for(var c=[],o=l,b=l.name,p=r.length-1;p>=0;p--){var T={v:!1};try{var x=r[p](o,{kind:"class",name:b,addInitializer:y(c,T),metadata:h})}finally{T.v=!0}x!==void 0&&(u(10,x),o=x)}return[S(o,h),function(){for(var d=0;d<c.length;d++)c[d].call(o)}]}}function S(l,r){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:r})}return function(r,h,c,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var p=Object.create(b===void 0?null:b),T=v(r,h,p);return c.length||S(r,p),{e:T,get c(){return D(r,c,p)}}}}function $o(y,t,e,i){return($o=Il())(y,t,e,i)}var Go,Vo,Co;Go=Eo();var Bo=class{static{({c:[Co,Vo]}=$o(this,[],[Go]))}constructor(t=O.use(W),e=O.use(ot)){this.mProcedure=t.createExpressionProcedure(e.value)}mProcedure;onUpdate(){let t=this.mProcedure.execute();return typeof t>"u"?null:t?.toString()}static{Vo()}};var st=class{mName;mValue;get name(){return this.mName}get value(){return this.mValue}constructor(t,e){this.mName=t,this.mValue=e}};var Et=class y extends Ut{mAccessMode;get accessMode(){return this.mAccessMode}constructor(t){super({constructor:t.constructor,parent:t.parent,values:t.values}),this.mAccessMode=t.accessMode,this.setProcessorInjection(y,this),this.setProcessorInjection(vt,t.targetTemplate.clone()),this.setProcessorInjection(k,t.targetNode),this.setProcessorInjection(st,new st(t.targetTemplate.name,t.targetTemplate.values.toString()))}onUpdate(){return this.call("onUpdate")??!1}};var mt=class{mDataLevels;mElementList;mTemplates;get elementList(){return this.mElementList}constructor(){this.mElementList=new Array,this.mTemplates=new Set,this.mDataLevels=new Set}addElement(t,e,i){if(this.mTemplates.has(t)||this.mDataLevels.has(e))throw new A("Can't add same template or values for multiple Elements.",this);this.mTemplates.add(t),this.mDataLevels.add(e),this.mElementList.push({template:t,dataLevel:e,key:i})}};var Xt=class y extends Ut{mLastResult;get instructionResult(){return this.mLastResult}constructor(t){super({constructor:t.constructor,parent:t.parent,values:t.values}),this.setProcessorInjection(y,this),this.setProcessorInjection(vt,t.targetTemplate.clone()),this.setProcessorInjection(ot,new ot(t.targetTemplate.instruction)),this.mLastResult=new mt}onUpdate(){let t=this.call("onUpdate");return t instanceof mt?(this.mLastResult=t,!0):!1}};var Ge=class y{static mAttributeModuleCache=new nt;static mExpressionModuleCache=new WeakMap;static mInstructionModuleCache=new nt;mComponent;mExpressionModule;constructor(t,e){this.mExpressionModule=e??Co,this.mComponent=t}createAttributeModule(t,e,i){let u=(()=>{let m=y.mAttributeModuleCache.get(t.name);if(m||m===null)return m;for(let v of ft.get(Et))if(v.processorConfiguration.selector.test(t.name))return y.mAttributeModuleCache.set(t.name,v),v;return y.mAttributeModuleCache.set(t.name,null),null})();return u===null?null:new Et({accessMode:u.processorConfiguration.access,constructor:u.processorConstructor,parent:this.mComponent,targetNode:e,targetTemplate:t,values:i}).setup()}createExpressionModule(t,e,i){let u=(()=>{let m=y.mExpressionModuleCache.get(this.mExpressionModule);if(m)return m;let v=ft.get(Ht).find(w=>w.processorConstructor===this.mExpressionModule);if(!v)throw new A("An expression module could not be found.",this);return y.mExpressionModuleCache.set(this.mExpressionModule,v),v})();return new Ht({constructor:u.processorConstructor,parent:this.mComponent,targetNode:e,targetTemplate:t,values:i}).setup()}createInstructionModule(t,e){let i=(()=>{let u=y.mInstructionModuleCache.get(t.instructionType);if(u)return u;for(let m of ft.get(Xt))if(m.processorConfiguration.instructionType===t.instructionType)return y.mInstructionModuleCache.set(t.instructionType,m),m;throw new A(`Instruction module type "${t.instructionType}" not found.`,this)})();return new Xt({constructor:i.processorConstructor,parent:this.mComponent,targetTemplate:t,values:e}).setup()}};var qt=class extends A{mColumnEnd;mColumnStart;mLineEnd;mLineStart;get columnEnd(){return this.mColumnEnd}get columnStart(){return this.mColumnStart}get lineEnd(){return this.mLineEnd}get lineStart(){return this.mLineStart}constructor(t,e,i,u,m,v,w){super(t,e,w),this.mColumnStart=i,this.mLineStart=u,this.mColumnEnd=m,this.mLineEnd=v}};var oe=class{mDependencyFetch;mDependencyFetchResolved;mLexer;mMeta;mPattern;mPatternDependencies;mType;get dependencies(){return this.mPatternDependencies}get dependenciesResolved(){return this.mDependencyFetchResolved}get lexer(){return this.mLexer}get meta(){return this.mMeta}get pattern(){return this.mPattern}constructor(t,e){if(this.mLexer=t,this.mType=e.type,this.mMeta=e.metadata,this.mPatternDependencies=new Array,this.mDependencyFetch=e.dependencyFetch??null,this.mDependencyFetchResolved=!e.dependencyFetch,this.mType==="split"&&!this.mDependencyFetch)throw new A("Split token with a start and end token, need inner token definitions.",this);if(this.mType==="single"&&this.mDependencyFetch)throw new A("Pattern does not allow inner token pattern.",this);this.mPattern=this.convertTokenPattern(this.mType,e.pattern)}isSplit(){return this.mType==="split"}resolveDependencies(){this.mDependencyFetchResolved||(this.mDependencyFetch(this),this.mDependencyFetchResolved=!0)}useChildPattern(t){if(this.mLexer!==t.lexer)throw new A("Can only add dependencies of the same lexer.",this);this.mPatternDependencies.push(t)}convertTokenPattern(t,e){if("single"in e){if(t==="split")throw new A("Can't use split pattern type with single pattern definition.",this);return{start:{regex:e.single.regex,types:e.single.types,validator:e.single.validator??null}}}else{if(t==="single")throw new A("Can't use single pattern type with split pattern definition.",this);return{start:{regex:e.start.regex,types:e.start.types,validator:e.start.validator??null},end:{regex:e.end.regex,types:e.end.types,validator:e.end.validator??null},innerType:e.innerType??null}}}};var re=class{mColumnNumber;mLineNumber;mMetas;mType;mValue;get columnNumber(){return this.mColumnNumber}get lineNumber(){return this.mLineNumber}get metas(){return[...this.mMetas]}get type(){return this.mType}get value(){return this.mValue}constructor(t,e,i,u){this.mValue=e,this.mColumnNumber=i,this.mLineNumber=u,this.mType=t,this.mMetas=new Set}addMeta(...t){for(let e of t)this.mMetas.add(e)}hasMeta(t){return this.mMetas.has(t)}};var Te=class{mRootPattern;mSettings;get errorType(){return this.mSettings.errorType}set errorType(t){this.mSettings.errorType=t}get trimWhitespace(){return this.mSettings.trimSpaces}set trimWhitespace(t){this.mSettings.trimSpaces=t}get validWhitespaces(){return[...this.mSettings.whiteSpaces].join("")}set validWhitespaces(t){this.mSettings.whiteSpaces=new Set(t.split(""))}constructor(){this.mSettings={errorType:null,trimSpaces:!0,whiteSpaces:new Set},this.mRootPattern=new oe(this,{type:"single",pattern:{single:{regex:/^/,types:{},validator:null}},metadata:[],dependencyFetch:null})}createTokenPattern(t,e){let i=w=>typeof w=="string"?{token:w}:w,u=w=>{let D=new Set(w.flags.split(""));return new RegExp(`^(?<token>${w.source})`,[...D].join(""))},m=new Array;t.meta&&(typeof t.meta=="string"?m.push(t.meta):m.push(...t.meta));let v;return"regex"in t.pattern?v={single:{regex:u(t.pattern.regex),types:i(t.pattern.type),validator:t.pattern.validator??null}}:v={start:{regex:u(t.pattern.start.regex),types:i(t.pattern.start.type),validator:t.pattern.start.validator??null},end:{regex:u(t.pattern.end.regex),types:i(t.pattern.end.type),validator:t.pattern.end.validator??null},innerType:t.pattern.innerType??null},new oe(this,{type:"regex"in t.pattern?"single":"split",pattern:v,metadata:m,dependencyFetch:e??null})}*tokenize(t,e){let i={data:t,cursor:{position:0,column:1,line:1},error:null,progressTracker:e??null};yield*this.tokenizeRecursionLayer(i,this.mRootPattern,new Array,null)}useRootTokenPattern(t){if(t.lexer!==this)throw new A("Token pattern must be created by this lexer.",this);this.mRootPattern.useChildPattern(t)}findNextStartToken(t,e,i,u){for(let m of e){let v=m.pattern.start,w=this.matchToken(m,v,t,i,u);if(w!==null)return{pattern:m,token:w}}return null}findTokenTypeOfMatch(t,e,i){for(let v in t.groups){let w=t.groups[v],D=e[v];if(!(!w||!D)){if(w.length!==t[0].length)throw new A("A group of a token pattern must match the whole token.",this);return D}}let u=new Array;for(let v in t.groups)t.groups[v]&&u.push(v);let m=new Array;for(let v in e)m.push(v);throw new A(`No token type found for any defined pattern regex group. Full: "${t[0]}", Matches: "${u.join(", ")}", Available: "${m.join(", ")}", Regex: "${i.source}"`,this)}*generateErrorToken(t,e){if(!t.error||!this.mSettings.errorType)return;let i=new re(this.mSettings.errorType,t.error.data,t.error.startColumn,t.error.startLine);i.addMeta(...e),t.error=null,yield i}generateToken(t,e,i,u,m,v){let w=i[0],D=this.findTokenTypeOfMatch(i,u,v),S=new re(m??D,w,t.cursor.column,t.cursor.line);return S.addMeta(...e),S}matchToken(t,e,i,u,m){let v=e.regex;v.lastIndex=0;let w=v.exec(i.data);if(!w||w.index!==0)return null;let D=this.generateToken(i,[...u,...t.meta],w,e.types,m,v);if(e.validator){let S=i.data.substring(D.value.length);if(!e.validator(D,S,i.cursor.position))return null}return this.moveCursor(i,D.value),D}moveCursor(t,e){let i=e.split(`
`);i.length>1&&(t.cursor.column=1),t.cursor.line+=i.length-1,t.cursor.column+=i.at(-1).length,t.cursor.position+=e.length,t.data=t.data.substring(e.length),this.trackProgress(t)}pushNextCharToErrorState(t){if(!this.mSettings.errorType)throw new qt(`Unable to parse next token. No valid pattern found for "${t.data.substring(0,20)}".`,this,t.cursor.column,t.cursor.line,t.cursor.column,t.cursor.line);t.error||(t.error={data:"",startColumn:t.cursor.column,startLine:t.cursor.line});let e=t.data.charAt(0);t.error.data+=e,this.moveCursor(t,e)}skipNextWhitespace(t){let e=t.data.charAt(0);return!this.mSettings.trimSpaces||!this.mSettings.whiteSpaces.has(e)?!1:(this.moveCursor(t,e),!0)}*tokenizeRecursionLayer(t,e,i,u){let m=e.dependencies;for(;t.data.length>0;){if(!t.error&&this.skipNextWhitespace(t))continue;if(e.isSplit()){let D=this.matchToken(e,e.pattern.end,t,i,u);if(D!==null){yield*this.generateErrorToken(t,i),yield D;return}}let v=this.findNextStartToken(t,m,i,u);if(!v){this.pushNextCharToErrorState(t);continue}yield*this.generateErrorToken(t,i),yield v.token;let w=v.pattern;w.isSplit()&&(w.resolveDependencies(),yield*this.tokenizeRecursionLayer(t,w,[...i,...w.meta],u??w.pattern.innerType))}yield*this.generateErrorToken(t,i)}trackProgress(t){t.progressTracker!==null&&t.progressTracker(t.cursor.position,t.cursor.line,t.cursor.column)}};var J=class extends Error{static PARSER_ERROR=Symbol("PARSER_ERROR");mTrace;get columnEnd(){return this.mTrace.top.range.columnEnd}get columnStart(){return this.mTrace.top.range.columnStart}get graph(){return this.mTrace.top.graph}get incidents(){return this.mTrace.incidents}get lineEnd(){return this.mTrace.top.range.lineEnd}get lineStart(){return this.mTrace.top.range.lineStart}constructor(t){super(t.top.message,{cause:t.top.cause}),this.mTrace=t}};var Ue=class{mIncidents;mTop;get incidents(){if(this.mIncidents===null)throw new A("A complete incident list is only available on debug mode.",this);return this.mIncidents}get top(){return this.mTop}constructor(t){this.mTop={message:"Unknown parser error",priority:0,graph:null,range:{lineStart:1,columnStart:1,lineEnd:1,columnEnd:1},cause:null},t?this.mIncidents=new Array:this.mIncidents=null}push(t,e,i,u,m,v,w=!1,D=null){let S;if(w?S=this.mTop.priority+1:S=m*1e4+v,this.mIncidents!==null){let l={message:t,priority:S,graph:e,range:{lineStart:i,columnStart:u,lineEnd:m,columnEnd:v},cause:D};this.mIncidents.push(l)}this.mTop&&S<this.mTop.priority||this.setTop({message:t,priority:S,graph:e,range:{lineStart:i,columnStart:u,lineEnd:m,columnEnd:v},cause:D})}setTop(t){this.mTop=t}};var He=class y{static MAX_JUNCTION_CIRCULAR_REFERENCES=1e3;mGraphStack;mIncidentTrace;mLastTokenPosition;mProcessStack;mTokenCache;mTokenGenerator;mTrimTokenCache;get currentGraph(){return this.mGraphStack.top.graph}get currentToken(){let t=this.mGraphStack.top;return this.mTokenCache[t.token.cursor]}get incidentTrace(){return this.mIncidentTrace}get processStack(){return this.mProcessStack}constructor(t,e,i){this.mTokenGenerator=t,this.mGraphStack=new jt,this.mLastTokenPosition={column:1,line:1},this.mTokenCache=new Array,this.mProcessStack=new jt,this.mTrimTokenCache=i,this.mIncidentTrace=new Ue(e),this.mGraphStack.push({graph:null,linear:!0,circularGraphs:new nt,token:{start:0,cursor:-1}})}collapse(){let t=this.mGraphStack.top,e=this.mTokenCache.slice(t.token.cursor);e.length!==0&&e.at(-1)===null&&e.pop();for(let i of this.mTokenGenerator)e.push(i);return e}getGraphBoundingToken(){let t=this.mGraphStack.top,e=this.mTokenCache[t.token.start],i=this.mTokenCache[t.token.cursor-1];return e??=i,i??=e,[e??null,i??null]}getGraphPosition(){let t=this.mGraphStack.top,e,i;if(e=this.mTokenCache[t.token.start],i=this.mTokenCache[t.token.cursor-1],e??=i,i??=e,!e||!i)return{graph:t.graph,columnEnd:this.mLastTokenPosition.column,columnStart:this.mLastTokenPosition.column,lineEnd:this.mLastTokenPosition.line,lineStart:this.mLastTokenPosition.line};let u,m;if(i.value.includes(`
`)){let v=i.value.split(`
`);m=i.lineNumber+v.length-1,u=1+v[v.length-1].length}else u=i.columnNumber+i.value.length,m=i.lineNumber;return{graph:t.graph,lineStart:e.lineNumber,columnStart:e.columnNumber,lineEnd:m,columnEnd:u}}getTokenPosition(){let t=this.mGraphStack.top,e=this.currentToken;if(!e)return{graph:t.graph,columnEnd:this.mLastTokenPosition.column,columnStart:this.mLastTokenPosition.column,lineEnd:this.mLastTokenPosition.line,lineStart:this.mLastTokenPosition.line};let i,u;if(e.value.includes(`
`)){let m=e.value.split(`
`);u=e.lineNumber+m.length-1,i=1+m[m.length-1].length}else i=e.columnNumber+e.value.length,u=e.lineNumber;return{graph:t.graph,lineStart:e.lineNumber,columnStart:e.columnNumber,lineEnd:u,columnEnd:i}}graphIsCircular(t){let e=this.mGraphStack.top;if(!e.circularGraphs.has(t))return!1;if(t.isJunction){if(e.circularGraphs.get(t)>y.MAX_JUNCTION_CIRCULAR_REFERENCES)throw new A("Junction graph called circular too often.",this);return!1}return!0}moveNextToken(){let t=this.mGraphStack.top;if(t.circularGraphs.size>0&&(t.circularGraphs=new nt),t.graph&&t.graph.isJunction)throw new A("Junction graph must not have own nodes.",this);if(t.token.cursor++,t.token.cursor<this.mTokenCache.length)return;let e=this.mTokenGenerator.next();if(e.done){this.mTokenCache.push(null);return}this.mLastTokenPosition.column=e.value.columnNumber,this.mLastTokenPosition.line=e.value.lineNumber,this.mTokenCache.push(e.value)}popGraphStack(t){let e=this.mGraphStack.pop(),i=this.mGraphStack.top;if(t&&(e.token.cursor=e.token.start),e.token.cursor!==e.token.start&&i.circularGraphs.size>0&&(i.circularGraphs=new nt),!this.mTrimTokenCache){i.token.cursor=e.token.cursor;return}e.linear?(this.mTokenCache.splice(0,e.token.cursor),i.token.start=0,i.token.cursor=0):i.token.cursor=e.token.cursor}pushGraphStack(t,e){let i=this.mGraphStack.top,u={graph:t,linear:e&&i.linear,circularGraphs:new nt(i.circularGraphs),token:{start:i.token.cursor,cursor:i.token.cursor}},m=u.circularGraphs.get(t)??0;u.circularGraphs.set(t,m+1),this.mGraphStack.push(u)}};var De=class y{static NODE_NULL_RESULT=Symbol("FAILED_NODE_VALUE_PARSE");static NODE_VALUE_LIST_END_MEET=Symbol("FAILED_NODE_VALUE_PARSE");mConfiguration;mLexer;mRootPart;get lexer(){return this.mLexer}constructor(t,e){this.mLexer=t,this.mRootPart=null,this.mConfiguration={keepTraceIncidents:!1,trimTokenCache:!1,...e}}parse(t,e){if(this.mRootPart===null)throw new A("Parser has not root part set.",this);let i=new He(this.mLexer.tokenize(t,e),this.mConfiguration.keepTraceIncidents,this.mConfiguration.trimTokenCache),u=(()=>{try{return this.beginParseProcess(i,this.mRootPart)}catch(v){if(v instanceof qt)return i.incidentTrace.push(v.message,i.currentGraph,v.lineStart,v.columnStart,v.lineEnd,v.columnEnd,!0,v),J.PARSER_ERROR;let w=v instanceof Error?v.message:v.toString(),D=i.getGraphPosition();return i.incidentTrace.push(w,i.currentGraph,D.lineStart,D.columnStart,D.lineEnd,D.columnEnd,!0,v),J.PARSER_ERROR}})();if(u===J.PARSER_ERROR)throw new J(i.incidentTrace);let m=i.collapse();if(m.length!==0){let v=m[0];if(i.incidentTrace.top.range.lineEnd===1&&i.incidentTrace.top.range.columnEnd===1){let w=`Tokens could not be parsed. Graph end meet without reaching last token. Current: "${v.value}" (${v.type})`;i.incidentTrace.push(w,this.mRootPart,v.lineNumber,v.columnNumber,v.lineNumber,v.columnNumber)}throw new J(i.incidentTrace)}return u}setRootGraph(t){this.mRootPart=t}beginParseProcess(t,e){t.moveNextToken(),t.processStack.push({type:"graph-parse",parameter:{graph:e,linear:!0},state:0});let i=y.NODE_NULL_RESULT;for(;t.processStack.top;)i=this.processStack(t,t.processStack.top,i);return i}processChainedNodeParseProcess(t,e,i){switch(e.state){case 0:{let v=e.parameter.node.connections.next;return v===null?(t.processStack.pop(),{}):(e.state++,t.processStack.push({type:"node-parse",parameter:{node:v},state:0,values:{}}),y.NODE_NULL_RESULT)}case 1:{let u=i;return u===J.PARSER_ERROR?(t.processStack.pop(),J.PARSER_ERROR):(t.processStack.pop(),u)}}throw new A(`Invalid node next parse state "${e.state}".`,this)}processGraphParseProcess(t,e,i){let u=e.parameter.graph;switch(e.state){case 0:{if(t.graphIsCircular(u)){let v=t.getGraphPosition();return t.incidentTrace.push("Circular graph detected.",u,v.lineStart,v.columnStart,v.lineEnd,v.columnEnd),t.processStack.pop(),J.PARSER_ERROR}let m=e.parameter.linear;return t.pushGraphStack(u,m),e.state++,t.processStack.push({type:"node-parse",parameter:{node:u.node},state:0,values:{}}),y.NODE_NULL_RESULT}case 1:{let m=i;if(m===J.PARSER_ERROR)return t.popGraphStack(!0),t.processStack.pop(),J.PARSER_ERROR;let v=u.convert(m,t);if(typeof v=="symbol"){let w=t.getGraphPosition();return t.incidentTrace.push(v.description??"Unknown data convert error",w.graph,w.lineStart,w.columnStart,w.lineEnd,w.columnEnd),t.popGraphStack(!0),t.processStack.pop(),J.PARSER_ERROR}return t.popGraphStack(!1),t.processStack.pop(),v}}throw new A(`Invalid graph parse state "${e.state}".`,this)}processNodeParseProcess(t,e,i){let u=e.parameter.node;switch(e.state){case 0:return t.processStack.push({type:"node-value-parse",parameter:{node:u,valueIndex:0},state:0,values:{}}),e.state++,y.NODE_NULL_RESULT;case 1:{let m=i;return m===J.PARSER_ERROR?(t.processStack.pop(),J.PARSER_ERROR):(e.values.nodeValueResult=m,t.processStack.push({type:"node-next-parse",parameter:{node:u},state:0}),e.state++,y.NODE_NULL_RESULT)}case 2:{let m=i;if(m===J.PARSER_ERROR)return t.processStack.pop(),J.PARSER_ERROR;let v=u.mergeData(e.values.nodeValueResult,m);return t.processStack.pop(),v}}throw new A(`Invalid node parse state "${e.state}".`,this)}processNodeValueParseProcess(t,e,i){let u=e.parameter.node;switch(e.state){case 0:{if(i!==y.NODE_NULL_RESULT&&i!==J.PARSER_ERROR)return e.values.parseResult=i,e.state++,y.NODE_NULL_RESULT;let m=e.parameter.valueIndex,v=u.connections;if(m>=v.values.length)return e.values.parseResult=y.NODE_VALUE_LIST_END_MEET,e.state++,y.NODE_NULL_RESULT;e.parameter.valueIndex++;let w=t.currentToken,D=v.values[m];if(typeof D=="string"){if(!w){if(v.required){let S=t.getTokenPosition();t.incidentTrace.push(`Unexpected end of statement. Token "${D}" expected.`,t.currentGraph,S.lineStart,S.columnStart,S.lineEnd,S.columnEnd)}return y.NODE_NULL_RESULT}if(D!==w.type){if(v.required){let S=t.getTokenPosition();t.incidentTrace.push(`Unexpected token "${w.value}". "${D}" expected`,t.currentGraph,S.lineStart,S.columnStart,S.lineEnd,S.columnEnd)}return y.NODE_NULL_RESULT}return t.moveNextToken(),w.value}else{let S=v.values.length===1||v.values.length===m+1;return t.processStack.push({type:"graph-parse",parameter:{graph:D,linear:S},state:0}),y.NODE_NULL_RESULT}}case 1:{let m=e.values.parseResult,v=u.connections;if(m===y.NODE_VALUE_LIST_END_MEET&&!v.required){t.processStack.pop();return}return m===y.NODE_VALUE_LIST_END_MEET?(t.processStack.pop(),J.PARSER_ERROR):(t.processStack.pop(),m)}}throw new A(`Invalid node value parse state "${e.state}".`,this)}processStack(t,e,i){switch(e.type){case"graph-parse":return this.processGraphParseProcess(t,e,i);case"node-parse":return this.processNodeParseProcess(t,e,i);case"node-value-parse":return this.processNodeValueParseProcess(t,e,i);case"node-next-parse":return this.processChainedNodeParseProcess(t,e,i)}}};var tt=class y{static define(t,e=!1){return new y(t,e)}mDataConverterList;mGraphCollector;mIsJunction;mResolvedGraphNode;get isJunction(){return this.mIsJunction}get node(){return this.mResolvedGraphNode||(this.mResolvedGraphNode=this.mGraphCollector().root),this.mResolvedGraphNode}constructor(t,e){this.mGraphCollector=t,this.mDataConverterList=new Array,this.mResolvedGraphNode=null,this.mIsJunction=e}convert(t,e){if(this.mDataConverterList.length===0)return t;let i=e.getGraphBoundingToken(),u=i[0]??void 0,m=i[1]??void 0;if(this.mDataConverterList.length===1)return this.mDataConverterList[0](t,u,m);let v=t;for(let w of this.mDataConverterList)if(v=w(v,u,m),typeof v=="symbol")return v;return v}converter(t){let e=new y(this.mGraphCollector,this.isJunction);return e.mDataConverterList.push(...this.mDataConverterList,t),e}};var Y=class y{static new(){let t=new y("",!1,[]);return t.mRootNode=null,t}mConnections;mIdentifier;mRootNode;get configuration(){return{dataKey:this.mIdentifier.dataKey,isList:this.mIdentifier.type==="list",isRequired:this.mConnections.required,isBranch:this.mConnections.values.length>1}}get connections(){return this.mConnections}get root(){if(!this.mRootNode)throw new A("Staring nodes must be chained with another node to be used.",this);return this.mRootNode}constructor(t,e,i,u){if(t==="")this.mIdentifier={type:"empty",dataKey:"",mergeKey:""};else if(t.endsWith("[]"))this.mIdentifier={type:"list",mergeKey:"",dataKey:t.substring(0,t.length-2)};else if(t.includes("<-")){let v=t.split("<-");this.mIdentifier={type:"merge",dataKey:v[0],mergeKey:v[1]}}else this.mIdentifier={type:"single",mergeKey:"",dataKey:t};let m=i.map(v=>v instanceof y?tt.define(()=>v):v);this.mConnections={required:e,values:m,next:null},u?this.mRootNode=u:this.mRootNode=this}mergeData(t,e){if(this.mIdentifier.type==="empty")return e;let i=e,u=typeof t>"u";if(this.mIdentifier.type==="single"){if(this.mIdentifier.dataKey in e)throw new A(`Graph path has a duplicate value identifier "${this.mIdentifier.dataKey}"`,this);return u||(i[this.mIdentifier.dataKey]=t),e}if(this.mIdentifier.type==="list"){let w;u?w=new Array:Array.isArray(t)?w=t:w=[t];let D=(()=>{if(this.mIdentifier.dataKey in e){let S=i[this.mIdentifier.dataKey];return Array.isArray(S)?(S.unshift(...w),S):(w.push(S),w)}return w})();return i[this.mIdentifier.dataKey]=D,e}if(u)return e;let m=(()=>{if(!this.mIdentifier.mergeKey)throw new A("Cant merge data without a merge key.",this);if(typeof t!="object"||t===null)throw new A("Node data must be an object when merge key is set.",this);if(!(this.mIdentifier.mergeKey in t))throw new A(`Node data does not contain merge key "${this.mIdentifier.mergeKey}"`,this);return t[this.mIdentifier.mergeKey]})();if(typeof m>"u")return e;let v=i[this.mIdentifier.dataKey];if(typeof v>"u")return i[this.mIdentifier.dataKey]=m,i;if(!Array.isArray(v))throw new A("Chain data merge value is not an array but should be.",this);return Array.isArray(m)?v.unshift(...m):v.unshift(m),e}optional(t,e){let i=typeof e>"u"?"":t,u=typeof e>"u"?t:e,m=new Array;Array.isArray(u)?m.push(...u):m.push(u);let v=new y(i,!1,m,this.mRootNode);return this.setChainedNode(v),v}required(t,e){let i=typeof e>"u"?"":t,u=typeof e>"u"?t:e,m=new Array;Array.isArray(u)?m.push(...u):m.push(u);let v=new y(i,!0,m,this.mRootNode);return this.setChainedNode(v),v}setChainedNode(t){if(this.mConnections.next!==null)throw new A("Node can only be chained to a single node.",this);this.mConnections.next=t}};var z={XmlIdentifier:"Identifier",XmlAssignment:"XmlAssignment",XmlValue:"XmlValue",XmlComment:"XmlComment",XmlOpenClosingBracket:"XmlOpenClosingBracket",XmlCloseBracket:"XmlCloseBracket",XmlOpenBracket:"XmlOpenBracket",XmlCloseClosingBracket:"XmlCloseClosingBracket",XmlExplicitValueIdentifier:"XmlExplicitValueIdentifier",ExpressionStart:"ExpressionStart",ExpressionEnd:"ExpressionEnd",ExpressionValue:"ExpressionValue",InstructionStart:"InstructionStart",InstructionInstructionValue:"InstructionInstructionValue",InstructionBodyStartBraket:"InstructionBodyStartBraket",InstructionBodyCloseBraket:"InstructionBodyCloseBraket",InstructionInstructionClosingBracket:"InstructionInstructionClosingBracket",InstructionInstructionOpeningBracket:"InstructionInstructionOpeningBracket"};var Xe=class extends Te{constructor(){super(),this.validWhitespaces=` 
\r`,this.trimWhitespace=!0;let t=this.createTokenPattern({pattern:{regex:/(?:(?!}}).)*/,type:z.ExpressionValue}}),e=this.createTokenPattern({pattern:{start:{regex:/{{/,type:z.ExpressionStart},end:{regex:/}}[ \n\r]?/,type:z.ExpressionEnd}}},s=>{s.useChildPattern(t)}),i=this.createTokenPattern({pattern:{regex:/[^>\s\n="/]+/,type:z.XmlIdentifier}}),u=this.createTokenPattern({pattern:{regex:/(?:(?!{{|"|<).)+/,type:z.XmlValue}}),m=this.createTokenPattern({pattern:{regex:/<!--.*?-->/,type:z.XmlComment}}),v=this.createTokenPattern({pattern:{regex:/=/,type:z.XmlAssignment}}),w=this.createTokenPattern({pattern:{start:{regex:/"/,type:z.XmlExplicitValueIdentifier},end:{regex:/"/,type:z.XmlExplicitValueIdentifier}}},s=>{s.useChildPattern(e),s.useChildPattern(u)}),D=this.createTokenPattern({pattern:{start:{regex:/<\//,type:z.XmlOpenClosingBracket},end:{regex:/>/,type:z.XmlCloseBracket}}},s=>{s.useChildPattern(i)}),S=this.createTokenPattern({pattern:{start:{regex:/</,type:z.XmlOpenBracket},end:{regex:/(?<closeClosingBracket>\/>)|(?<closeBracket>>)/,type:{closeClosingBracket:z.XmlCloseClosingBracket,closeBracket:z.XmlCloseBracket}}}},s=>{s.useChildPattern(v),s.useChildPattern(i),s.useChildPattern(w)}),l=this.createTokenPattern({pattern:{regex:/[^()"'`/)]+/,type:z.InstructionInstructionValue}}),r=this.createTokenPattern({pattern:{innerType:z.InstructionInstructionValue,start:{regex:/\//,type:z.InstructionInstructionValue},end:{regex:/\//,type:z.InstructionInstructionValue}}},s=>{s.useChildPattern(c),s.useChildPattern(o),s.useChildPattern(b),s.useChildPattern(h),s.useChildPattern(l)}),h=this.createTokenPattern({pattern:{innerType:z.InstructionInstructionValue,start:{regex:/\(/,type:z.InstructionInstructionValue},end:{regex:/\)/,type:z.InstructionInstructionValue}}},s=>{s.useChildPattern(r),s.useChildPattern(c),s.useChildPattern(o),s.useChildPattern(b),s.useChildPattern(l)}),c=this.createTokenPattern({pattern:{innerType:z.InstructionInstructionValue,start:{regex:/"/,type:z.InstructionInstructionValue},end:{regex:/"/,type:z.InstructionInstructionValue}}},s=>{s.useChildPattern(r),s.useChildPattern(o),s.useChildPattern(b),s.useChildPattern(h),s.useChildPattern(l)}),o=this.createTokenPattern({pattern:{innerType:z.InstructionInstructionValue,start:{regex:/'/,type:z.InstructionInstructionValue},end:{regex:/'/,type:z.InstructionInstructionValue}}},s=>{s.useChildPattern(r),s.useChildPattern(c),s.useChildPattern(b),s.useChildPattern(h),s.useChildPattern(l)}),b=this.createTokenPattern({pattern:{innerType:z.InstructionInstructionValue,start:{regex:/`/,type:z.InstructionInstructionValue},end:{regex:/`/,type:z.InstructionInstructionValue}}},s=>{s.useChildPattern(r),s.useChildPattern(c),s.useChildPattern(o),s.useChildPattern(h),s.useChildPattern(l)}),p=this.createTokenPattern({pattern:{regex:/\$[^(\s\n/{]+/,type:z.InstructionStart}}),T=this.createTokenPattern({pattern:{start:{regex:/\(/,type:z.InstructionInstructionOpeningBracket},end:{regex:/\)/,type:z.InstructionInstructionClosingBracket}}},s=>{s.useChildPattern(r),s.useChildPattern(c),s.useChildPattern(o),s.useChildPattern(b),s.useChildPattern(h),s.useChildPattern(l)}),x=this.createTokenPattern({pattern:{start:{regex:/{/,type:z.InstructionBodyStartBraket},end:{regex:/}/,type:z.InstructionBodyCloseBraket}}},s=>{for(let f of d)s.useChildPattern(f)}),d=[m,D,S,w,e,p,T,x,u];for(let s of d)this.useRootTokenPattern(s)}};var Ee=class extends De{constructor(){super(new Xe),this.initGraph()}initGraph(){let t=tt.define(()=>Y.new().required(z.ExpressionStart).optional("value",z.ExpressionValue).required("end",z.ExpressionEnd)).converter(o=>({expression:new Nt(o.value??""),hasTrailingWhitespace:o.end.length>2})),e=tt.define(()=>{let o=e;return Y.new().required("data[]",Y.new().required("value",[t,Y.new().required("text",z.XmlValue)])).optional("data<-data",o)}),i=tt.define(()=>Y.new().required("name",z.XmlIdentifier).optional("attributeValue",Y.new().required(z.XmlAssignment).required(z.XmlExplicitValueIdentifier).optional("list<-data",e).required(z.XmlExplicitValueIdentifier))).converter(o=>{let b=new Array;if(o.attributeValue?.list)for(let p of o.attributeValue.list)"expression"in p.value?(b.push(p.value.expression),p.value.hasTrailingWhitespace&&b.push(" ")):b.push(p.value.text);return{name:o.name,values:b}}),u=tt.define(()=>{let o=u;return Y.new().required("data[]",i).optional("data<-data",o)}),m=tt.define(()=>{let o=m;return Y.new().required("data[]",Y.new().required("value",[t,Y.new().required("text",z.XmlValue),Y.new().required(z.XmlExplicitValueIdentifier).required("text",z.XmlValue).required(z.XmlExplicitValueIdentifier)])).optional("data<-data",o)}),v=tt.define(()=>Y.new().required("list<-data",m)).converter(o=>{let b=new Lt;for(let p of o.list)"expression"in p.value?(b.addValue(p.value.expression),p.value.hasTrailingWhitespace&&b.addValue(" ")):b.addValue(p.value.text);return b}),w=tt.define(()=>Y.new().required(z.XmlComment)).converter(()=>null),D=tt.define(()=>Y.new().required(z.XmlOpenBracket).required("openingTagName",z.XmlIdentifier).optional("attributes<-data",u).required("closing",[Y.new().required(z.XmlCloseClosingBracket),Y.new().required(z.XmlCloseBracket).required("values",h).required(z.XmlOpenClosingBracket).required("closingTageName",z.XmlIdentifier).required(z.XmlCloseBracket)])).converter(o=>{if("closingTageName"in o.closing&&o.openingTagName!==o.closing.closingTageName)throw new A(`Opening (${o.openingTagName}) and closing tagname (${o.closing.closingTageName}) does not match`,this);let b=new Rt(o.openingTagName);if(o.attributes)for(let p of o.attributes)b.setAttribute(p.name).addValue(...p.values);return"values"in o.closing&&b.appendChild(...o.closing.values),b}),S=tt.define(()=>{let o=S;return Y.new().required("list[]",z.InstructionInstructionValue).optional("list<-list",o)}),l=tt.define(()=>Y.new().required("instructionName",z.InstructionStart).optional("instruction",Y.new().required(z.InstructionInstructionOpeningBracket).required("value<-list",S).required(z.InstructionInstructionClosingBracket)).optional("body",Y.new().required(z.InstructionBodyStartBraket).required("value",h).required(z.InstructionBodyCloseBraket))).converter(o=>{let b=o.instructionName.substring(1),p=o.instruction?.value.join("")??"",T=new Zt(b,p);return o.body&&T.appendChild(...o.body.value),T}),r=tt.define(()=>{let o=r;return Y.new().required("list[]",[w,D,l,v]).optional("list<-list",o)}),h=tt.define(()=>{let o=r;return Y.new().optional("list<-list",o)}).converter(o=>{let b=new Array;if(o.list)for(let p of o.list)p!==null&&b.push(p);return b}),c=tt.define(()=>Y.new().required("content",h)).converter(o=>{let b=new dt;return b.appendChild(...o.content),b});this.setRootGraph(c)}};var G=class y extends je{static mTemplateCache=new nt;static mXmlParser=new Ee;mComponentElement;mIsUpdated;mRootBuilder;get element(){return this.mComponentElement.htmlElement}constructor(t){super({constructor:t.processorConstructor,parent:null}),Q.registerComponent(this,t.htmlElement),this.setProcessorInjection(y,this),this.addConstructionHook(u=>{Q.registerComponent(this,this.mComponentElement.htmlElement,u)}),y.mTemplateCache.has(t.processorConstructor)||y.mTemplateCache.set(t.processorConstructor,y.mXmlParser.parse(t.templateString??""));let e=y.mTemplateCache.get(t.processorConstructor).clone();this.mIsUpdated=!1,this.mComponentElement=new xe(t.htmlElement),this.mRootBuilder=new ee(e,new Ge(this,t.expressionModule),new gt(this),"ROOT",null),this.mComponentElement.shadowRoot.appendChild(this.mRootBuilder.anchor),this.setProcessorInjection(Pt,new Pt(this.mRootBuilder.values));let i=this.updater.zone.getAttachment(It.ATTACHMENT_KEY);if(i)for(let[u,m]of i.injections)this.setProcessorInjection(u,m)}addStyle(t){let e=document.createElement("style");e.innerHTML=t,this.mComponentElement.shadowRoot.prepend(e)}attributeChanged(t,e,i){this.call("onAttributeChange",t,e,i)}connected(){this.mIsUpdated||this.updater.update(),this.call("onConnect")}deconstruct(){this.call("onDeconstruct"),this.mRootBuilder.deconstruct(),super.deconstruct()}disconnected(){this.call("onDisconnect")}onUpdate(){return this.mIsUpdated||(this.mIsUpdated=!0),this.mRootBuilder.update()?(this.call("onUpdate"),!0):!1}};function U(y){return(t,e)=>{O.registerInjectable(t,e.metadata,"instanced"),Q.registerConstructor(t,y.selector);let i=class extends HTMLElement{static formAssociated=!0;mComponent;constructor(){super(),this.mComponent=new G({processorConstructor:t,templateString:y.template??null,expressionModule:y.expressionmodule,htmlElement:this}).setup(),y.style&&this.mComponent.addStyle(y.style)}connectedCallback(){this.mComponent.connected()}disconnectedCallback(){this.mComponent.disconnected()}};globalThis.customElements.define(y.selector,i)}}function Jt(y){return(t,e)=>{O.registerInjectable(t,e.metadata,"instanced"),ft.register($t,t,{access:y.access,targetRestrictions:y.targetRestrictions})}}function Ct(y){return(t,e)=>{O.registerInjectable(t,e.metadata,"instanced"),ft.register(Et,t,{access:y.access,selector:y.selector})}}function Ot(y){return(t,e)=>{O.registerInjectable(t,e.metadata,"instanced"),ft.register(Xt,t,{instructionType:y.instructionType})}}function Pl(){function y(l,r){return function(c){e(r,"addInitializer"),i(c,"An initializer"),l.push(c)}}function t(l,r,h,c,o,b,p,T,x){var d;switch(o){case 1:d="accessor";break;case 2:d="method";break;case 3:d="getter";break;case 4:d="setter";break;default:d="field"}var s={kind:d,name:p?"#"+r:r,static:b,private:p,metadata:T},f={v:!1};s.addInitializer=y(c,f);var n,a;if(o===0?p?(n=h.get,a=h.set):(n=function(){return this[r]},a=function(g){this[r]=g}):o===2?n=function(){return h.value}:((o===1||o===3)&&(n=function(){return h.get.call(this)}),(o===1||o===4)&&(a=function(g){h.set.call(this,g)})),p)s.access=n&&a?{get:n,set:a}:n?{get:n}:{set:a};else{if(n){var I=n;n=function(g){return arguments.length===0&&(g=this),I.call(g)}}if(a){var P=a;a=function(g,_){return arguments.length===1&&(_=g,g=this),P.call(g,_)}}var E=function(g){return r in g};s.access=n&&a?{has:E,get:n,set:a}:n?{has:E,get:n}:{has:E,set:a}}try{return l(x,s)}finally{f.v=!0}}function e(l,r){if(l.v)throw new Error("attempted to call "+r+" after decoration was finished")}function i(l,r){if(typeof l!="function")throw new TypeError(r+" must be a function")}function u(l,r){var h=typeof r;if(l===1){if(h!=="object"||r===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");r.get!==void 0&&i(r.get,"accessor.get"),r.set!==void 0&&i(r.set,"accessor.set"),r.init!==void 0&&i(r.init,"accessor.init")}else if(h!=="function"){var c;throw l===0?c="field":l===10?c="class":c="method",new TypeError(c+" decorators must return a function or void 0")}}function m(l,r,h,c,o,b,p,T,x){var d=h[0],s,f,n;p?o===0||o===1?s={get:h[3],set:h[4]}:o===3?s={get:h[3]}:o===4?s={set:h[3]}:s={value:h[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(r,c)),o===1?n={get:s.get,set:s.set}:o===2?n=s.value:o===3?n=s.get:o===4&&(n=s.set);var a,I,P;if(typeof d=="function")a=t(d,c,s,T,o,b,p,x,n),a!==void 0&&(u(o,a),o===0?f=a:o===1?(f=a.init,I=a.get||n.get,P=a.set||n.set,n={get:I,set:P}):n=a);else for(var E=d.length-1;E>=0;E--){var g=d[E];if(a=t(g,c,s,T,o,b,p,x,n),a!==void 0){u(o,a);var _;o===0?_=a:o===1?(_=a.init,I=a.get||n.get,P=a.set||n.set,n={get:I,set:P}):n=a,_!==void 0&&(f===void 0?f=_:typeof f=="function"?f=[f,_]:f.push(_))}}if(o===0||o===1){if(f===void 0)f=function(M,C){return C};else if(typeof f!="function"){var F=f;f=function(M,C){for(var N=C,L=0;L<F.length;L++)N=F[L].call(M,N);return N}}else{var j=f;f=function(M,C){return j.call(M,C)}}l.push(f)}o!==0&&(o===1?(s.get=n.get,s.set=n.set):o===2?s.value=n:o===3?s.get=n:o===4&&(s.set=n),p?o===1?(l.push(function(M,C){return n.get.call(M,C)}),l.push(function(M,C){return n.set.call(M,C)})):o===2?l.push(n):l.push(function(M,C){return n.call(M,C)}):Object.defineProperty(r,c,s))}function v(l,r,h){for(var c=[],o,b,p=new Map,T=new Map,x=0;x<r.length;x++){var d=r[x];if(Array.isArray(d)){var s=d[1],f=d[2],n=d.length>3,a=s>=5,I,P;if(a?(I=l,s=s-5,b=b||[],P=b):(I=l.prototype,o=o||[],P=o),s!==0&&!n){var E=a?T:p,g=E.get(f)||0;if(g===!0||g===3&&s!==4||g===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!g&&s>2?E.set(f,s):E.set(f,!0)}m(c,I,d,f,s,a,n,P,h)}}return w(c,o),w(c,b),c}function w(l,r){r&&l.push(function(h){for(var c=0;c<r.length;c++)r[c].call(h);return h})}function D(l,r,h){if(r.length>0){for(var c=[],o=l,b=l.name,p=r.length-1;p>=0;p--){var T={v:!1};try{var x=r[p](o,{kind:"class",name:b,addInitializer:y(c,T),metadata:h})}finally{T.v=!0}x!==void 0&&(u(10,x),o=x)}return[S(o,h),function(){for(var d=0;d<c.length;d++)c[d].call(o)}]}}function S(l,r){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:r})}return function(r,h,c,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var p=Object.create(b===void 0?null:b),T=v(r,h,p);return c.length||S(r,p),{e:T,get c(){return D(r,c,p)}}}}function Ho(y,t,e,i){return(Ho=Pl())(y,t,e,i)}function Ml(y){return y}var Xo,Uo,Ce;Xo=Jt({access:q.Read,targetRestrictions:[G]});new class extends Ml{constructor(){super(Ce),Uo()}static{class y{static{({c:[Ce,Uo]}=Ho(this,[],[Xo]))}static METADATA_USER_EVENT_LISTENER_PROPERIES="pwb:user_event_listener_properties";mEventListenerList;mTargetElement;constructor(e=O.use(G)){let i=new Array,u=e.processorConstructor;do{let m=ct.get(u).getMetadata(y.METADATA_USER_EVENT_LISTENER_PROPERIES);if(m)for(let v of m)i.push(v)}while(u=Object.getPrototypeOf(u));this.mEventListenerList=new Array,this.mTargetElement=e.element;for(let m of i){let[v,w]=m,D=Reflect.get(e.processor,v);D=D.bind(e.processor),this.mEventListenerList.push([w,D]),this.mTargetElement.addEventListener(w,D)}}onDeconstruct(){for(let e of this.mEventListenerList){let[i,u]=e;this.mTargetElement.removeEventListener(i,u)}}}}};var Ie=class extends window.Event{mValue;get value(){return this.mValue}constructor(t,e){super(t),this.mValue=e}};var Pe=class{mElement;mEventName;constructor(t,e){this.mEventName=t,this.mElement=e}dispatchEvent(t){let e=new Ie(this.mEventName,t);this.mElement.dispatchEvent(e)}};function rt(y){return(t,e)=>{if(e.static)throw new A("Event target is not for a static property.",rt);let i=new WeakMap;return{get(){if(!i.has(this)){let u=(()=>{try{return Q.ofProcessor(this).component}catch{throw new A("PwbComponentEvent target class is not a component.",this)}})();i.set(this,new Pe(y,u.element))}return i.get(this)}}}}function _l(){function y(l,r){return function(c){e(r,"addInitializer"),i(c,"An initializer"),l.push(c)}}function t(l,r,h,c,o,b,p,T,x){var d;switch(o){case 1:d="accessor";break;case 2:d="method";break;case 3:d="getter";break;case 4:d="setter";break;default:d="field"}var s={kind:d,name:p?"#"+r:r,static:b,private:p,metadata:T},f={v:!1};s.addInitializer=y(c,f);var n,a;if(o===0?p?(n=h.get,a=h.set):(n=function(){return this[r]},a=function(g){this[r]=g}):o===2?n=function(){return h.value}:((o===1||o===3)&&(n=function(){return h.get.call(this)}),(o===1||o===4)&&(a=function(g){h.set.call(this,g)})),p)s.access=n&&a?{get:n,set:a}:n?{get:n}:{set:a};else{if(n){var I=n;n=function(g){return arguments.length===0&&(g=this),I.call(g)}}if(a){var P=a;a=function(g,_){return arguments.length===1&&(_=g,g=this),P.call(g,_)}}var E=function(g){return r in g};s.access=n&&a?{has:E,get:n,set:a}:n?{has:E,get:n}:{has:E,set:a}}try{return l(x,s)}finally{f.v=!0}}function e(l,r){if(l.v)throw new Error("attempted to call "+r+" after decoration was finished")}function i(l,r){if(typeof l!="function")throw new TypeError(r+" must be a function")}function u(l,r){var h=typeof r;if(l===1){if(h!=="object"||r===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");r.get!==void 0&&i(r.get,"accessor.get"),r.set!==void 0&&i(r.set,"accessor.set"),r.init!==void 0&&i(r.init,"accessor.init")}else if(h!=="function"){var c;throw l===0?c="field":l===10?c="class":c="method",new TypeError(c+" decorators must return a function or void 0")}}function m(l,r,h,c,o,b,p,T,x){var d=h[0],s,f,n;p?o===0||o===1?s={get:h[3],set:h[4]}:o===3?s={get:h[3]}:o===4?s={set:h[3]}:s={value:h[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(r,c)),o===1?n={get:s.get,set:s.set}:o===2?n=s.value:o===3?n=s.get:o===4&&(n=s.set);var a,I,P;if(typeof d=="function")a=t(d,c,s,T,o,b,p,x,n),a!==void 0&&(u(o,a),o===0?f=a:o===1?(f=a.init,I=a.get||n.get,P=a.set||n.set,n={get:I,set:P}):n=a);else for(var E=d.length-1;E>=0;E--){var g=d[E];if(a=t(g,c,s,T,o,b,p,x,n),a!==void 0){u(o,a);var _;o===0?_=a:o===1?(_=a.init,I=a.get||n.get,P=a.set||n.set,n={get:I,set:P}):n=a,_!==void 0&&(f===void 0?f=_:typeof f=="function"?f=[f,_]:f.push(_))}}if(o===0||o===1){if(f===void 0)f=function(M,C){return C};else if(typeof f!="function"){var F=f;f=function(M,C){for(var N=C,L=0;L<F.length;L++)N=F[L].call(M,N);return N}}else{var j=f;f=function(M,C){return j.call(M,C)}}l.push(f)}o!==0&&(o===1?(s.get=n.get,s.set=n.set):o===2?s.value=n:o===3?s.get=n:o===4&&(s.set=n),p?o===1?(l.push(function(M,C){return n.get.call(M,C)}),l.push(function(M,C){return n.set.call(M,C)})):o===2?l.push(n):l.push(function(M,C){return n.call(M,C)}):Object.defineProperty(r,c,s))}function v(l,r,h){for(var c=[],o,b,p=new Map,T=new Map,x=0;x<r.length;x++){var d=r[x];if(Array.isArray(d)){var s=d[1],f=d[2],n=d.length>3,a=s>=5,I,P;if(a?(I=l,s=s-5,b=b||[],P=b):(I=l.prototype,o=o||[],P=o),s!==0&&!n){var E=a?T:p,g=E.get(f)||0;if(g===!0||g===3&&s!==4||g===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!g&&s>2?E.set(f,s):E.set(f,!0)}m(c,I,d,f,s,a,n,P,h)}}return w(c,o),w(c,b),c}function w(l,r){r&&l.push(function(h){for(var c=0;c<r.length;c++)r[c].call(h);return h})}function D(l,r,h){if(r.length>0){for(var c=[],o=l,b=l.name,p=r.length-1;p>=0;p--){var T={v:!1};try{var x=r[p](o,{kind:"class",name:b,addInitializer:y(c,T),metadata:h})}finally{T.v=!0}x!==void 0&&(u(10,x),o=x)}return[S(o,h),function(){for(var d=0;d<c.length;d++)c[d].call(o)}]}}function S(l,r){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:r})}return function(r,h,c,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var p=Object.create(b===void 0?null:b),T=v(r,h,p);return c.length||S(r,p),{e:T,get c(){return D(r,c,p)}}}}function Wo(y,t,e,i){return(Wo=_l())(y,t,e,i)}function Sl(y){return y}var Zo,Yo,Me;Zo=Jt({access:q.ReadWrite,targetRestrictions:[G]});new class extends Sl{constructor(){super(Me),Yo()}static{class y{static{({c:[Me,Yo]}=Wo(this,[],[Zo]))}static METADATA_EXPORTED_PROPERTIES="pwb:exported_properties";mComponent;constructor(e=O.use(G)){this.mComponent=e;let i=new Map,u=e.processorConstructor;do{let m=ct.get(u).getMetadata(y.METADATA_EXPORTED_PROPERTIES);if(m)for(let v of m)i.set(v.attributeName,v.propertyName)}while(u=Object.getPrototypeOf(u));i.size>0&&this.connectExportedProperties(i)}connectExportedProperties(e){let i=this.patchHtmlAttributes(e);this.exportPropertyAsAttribute(e,i)}exportPropertyAsAttribute(e,i){for(let[u,m]of e){let v={};v.enumerable=!0,v.configurable=!0,delete v.value,delete v.writable,v.set=w=>{Reflect.set(this.mComponent.processor,m,w),i.setAttribute(u,w)},v.get=()=>{let w=Reflect.get(this.mComponent.processor,m);return typeof w=="function"&&(w=w.bind(this.mComponent.processor)),w},Object.defineProperty(this.mComponent.element,m,v)}}patchHtmlAttributes(e){let i=this.mComponent.element,u=new Set,m=(()=>{let D=i.getAttribute,S=i.setAttribute;return{getAttribute:l=>D.call(i,l),setAttribute:(l,r)=>{let h=r?.toString()??"";S.call(i,l,h),e.has(l)&&u.add(l)}}})(),v=(D,S,l)=>{let r=e.get(D);return Reflect.set(this.mComponent.processor,r,l),this.mComponent.attributeChanged(D,S,l),!0};new MutationObserver(D=>{for(let S of D){let l=S.attributeName;u.has(l)||v(l,S.oldValue,m.getAttribute(l))}u.clear()}).observe(i,{attributeFilter:[...e.keys()],attributeOldValue:!0});for(let D of e.keys())if(i.hasAttribute(D)){let S=m.getAttribute(D);v(D,S,S)}return i.setAttribute=(D,S)=>{let l=m.getAttribute(D);m.setAttribute(D,S),e.has(D)&&v(D,l,S)},i.getAttribute=D=>e.has(D)?Reflect.get(i,e.get(D)):m.getAttribute(D),m}}}};function B(y){return(t,e)=>{if(e.static)throw new A("Event target is not for a static property.",B);let i=ct.forInternalDecorator(e.metadata),u=i.getMetadata(Me.METADATA_EXPORTED_PROPERTIES)??new Array;u.push({propertyName:e.name,attributeName:y??e.name}),i.setMetadata(Me.METADATA_EXPORTED_PROPERTIES,u)}}function yt(y){return(t,e)=>{if(e.static)throw new A("Child decorator is not for a static property.",yt);return{get(){let m=(()=>{try{return Q.ofProcessor(this).component}catch{throw new A("PwbChild target class is not a component.",this)}})().getProcessorInjection(Pt).data.store[y];return m instanceof Element?m:null}}}}function Al(){function y(l,r){return function(c){e(r,"addInitializer"),i(c,"An initializer"),l.push(c)}}function t(l,r,h,c,o,b,p,T,x){var d;switch(o){case 1:d="accessor";break;case 2:d="method";break;case 3:d="getter";break;case 4:d="setter";break;default:d="field"}var s={kind:d,name:p?"#"+r:r,static:b,private:p,metadata:T},f={v:!1};s.addInitializer=y(c,f);var n,a;if(o===0?p?(n=h.get,a=h.set):(n=function(){return this[r]},a=function(g){this[r]=g}):o===2?n=function(){return h.value}:((o===1||o===3)&&(n=function(){return h.get.call(this)}),(o===1||o===4)&&(a=function(g){h.set.call(this,g)})),p)s.access=n&&a?{get:n,set:a}:n?{get:n}:{set:a};else{if(n){var I=n;n=function(g){return arguments.length===0&&(g=this),I.call(g)}}if(a){var P=a;a=function(g,_){return arguments.length===1&&(_=g,g=this),P.call(g,_)}}var E=function(g){return r in g};s.access=n&&a?{has:E,get:n,set:a}:n?{has:E,get:n}:{has:E,set:a}}try{return l(x,s)}finally{f.v=!0}}function e(l,r){if(l.v)throw new Error("attempted to call "+r+" after decoration was finished")}function i(l,r){if(typeof l!="function")throw new TypeError(r+" must be a function")}function u(l,r){var h=typeof r;if(l===1){if(h!=="object"||r===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");r.get!==void 0&&i(r.get,"accessor.get"),r.set!==void 0&&i(r.set,"accessor.set"),r.init!==void 0&&i(r.init,"accessor.init")}else if(h!=="function"){var c;throw l===0?c="field":l===10?c="class":c="method",new TypeError(c+" decorators must return a function or void 0")}}function m(l,r,h,c,o,b,p,T,x){var d=h[0],s,f,n;p?o===0||o===1?s={get:h[3],set:h[4]}:o===3?s={get:h[3]}:o===4?s={set:h[3]}:s={value:h[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(r,c)),o===1?n={get:s.get,set:s.set}:o===2?n=s.value:o===3?n=s.get:o===4&&(n=s.set);var a,I,P;if(typeof d=="function")a=t(d,c,s,T,o,b,p,x,n),a!==void 0&&(u(o,a),o===0?f=a:o===1?(f=a.init,I=a.get||n.get,P=a.set||n.set,n={get:I,set:P}):n=a);else for(var E=d.length-1;E>=0;E--){var g=d[E];if(a=t(g,c,s,T,o,b,p,x,n),a!==void 0){u(o,a);var _;o===0?_=a:o===1?(_=a.init,I=a.get||n.get,P=a.set||n.set,n={get:I,set:P}):n=a,_!==void 0&&(f===void 0?f=_:typeof f=="function"?f=[f,_]:f.push(_))}}if(o===0||o===1){if(f===void 0)f=function(M,C){return C};else if(typeof f!="function"){var F=f;f=function(M,C){for(var N=C,L=0;L<F.length;L++)N=F[L].call(M,N);return N}}else{var j=f;f=function(M,C){return j.call(M,C)}}l.push(f)}o!==0&&(o===1?(s.get=n.get,s.set=n.set):o===2?s.value=n:o===3?s.get=n:o===4&&(s.set=n),p?o===1?(l.push(function(M,C){return n.get.call(M,C)}),l.push(function(M,C){return n.set.call(M,C)})):o===2?l.push(n):l.push(function(M,C){return n.call(M,C)}):Object.defineProperty(r,c,s))}function v(l,r,h){for(var c=[],o,b,p=new Map,T=new Map,x=0;x<r.length;x++){var d=r[x];if(Array.isArray(d)){var s=d[1],f=d[2],n=d.length>3,a=s>=5,I,P;if(a?(I=l,s=s-5,b=b||[],P=b):(I=l.prototype,o=o||[],P=o),s!==0&&!n){var E=a?T:p,g=E.get(f)||0;if(g===!0||g===3&&s!==4||g===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!g&&s>2?E.set(f,s):E.set(f,!0)}m(c,I,d,f,s,a,n,P,h)}}return w(c,o),w(c,b),c}function w(l,r){r&&l.push(function(h){for(var c=0;c<r.length;c++)r[c].call(h);return h})}function D(l,r,h){if(r.length>0){for(var c=[],o=l,b=l.name,p=r.length-1;p>=0;p--){var T={v:!1};try{var x=r[p](o,{kind:"class",name:b,addInitializer:y(c,T),metadata:h})}finally{T.v=!0}x!==void 0&&(u(10,x),o=x)}return[S(o,h),function(){for(var d=0;d<c.length;d++)c[d].call(o)}]}}function S(l,r){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:r})}return function(r,h,c,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var p=Object.create(b===void 0?null:b),T=v(r,h,p);return c.length||S(r,p),{e:T,get c(){return D(r,c,p)}}}}function Ko(y,t,e,i){return(Ko=Al())(y,t,e,i)}var Qo,qo,Nl;Qo=Ot({instructionType:"dynamic-content"});var Jo=class{static{({c:[Nl,qo]}=Ko(this,[],[Qo]))}constructor(t=O.use(ot),e=O.use(W)){this.mModuleValues=e,this.mLastTemplate=null,this.mProcedure=this.mModuleValues.createExpressionProcedure(t.value)}mLastTemplate;mModuleValues;mProcedure;onUpdate(){let t=this.mProcedure.execute();if(!t||!(t instanceof dt))throw new A("Dynamic content method has a wrong result type.",this);if(this.mLastTemplate!==null&&this.mLastTemplate.equals(t))return null;let e=t.clone();this.mLastTemplate=e;let i=new mt;return i.addElement(e,new gt(this.mModuleValues.data),null),i}static{qo()}};function Ll(){function y(l,r){return function(c){e(r,"addInitializer"),i(c,"An initializer"),l.push(c)}}function t(l,r,h,c,o,b,p,T,x){var d;switch(o){case 1:d="accessor";break;case 2:d="method";break;case 3:d="getter";break;case 4:d="setter";break;default:d="field"}var s={kind:d,name:p?"#"+r:r,static:b,private:p,metadata:T},f={v:!1};s.addInitializer=y(c,f);var n,a;if(o===0?p?(n=h.get,a=h.set):(n=function(){return this[r]},a=function(g){this[r]=g}):o===2?n=function(){return h.value}:((o===1||o===3)&&(n=function(){return h.get.call(this)}),(o===1||o===4)&&(a=function(g){h.set.call(this,g)})),p)s.access=n&&a?{get:n,set:a}:n?{get:n}:{set:a};else{if(n){var I=n;n=function(g){return arguments.length===0&&(g=this),I.call(g)}}if(a){var P=a;a=function(g,_){return arguments.length===1&&(_=g,g=this),P.call(g,_)}}var E=function(g){return r in g};s.access=n&&a?{has:E,get:n,set:a}:n?{has:E,get:n}:{has:E,set:a}}try{return l(x,s)}finally{f.v=!0}}function e(l,r){if(l.v)throw new Error("attempted to call "+r+" after decoration was finished")}function i(l,r){if(typeof l!="function")throw new TypeError(r+" must be a function")}function u(l,r){var h=typeof r;if(l===1){if(h!=="object"||r===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");r.get!==void 0&&i(r.get,"accessor.get"),r.set!==void 0&&i(r.set,"accessor.set"),r.init!==void 0&&i(r.init,"accessor.init")}else if(h!=="function"){var c;throw l===0?c="field":l===10?c="class":c="method",new TypeError(c+" decorators must return a function or void 0")}}function m(l,r,h,c,o,b,p,T,x){var d=h[0],s,f,n;p?o===0||o===1?s={get:h[3],set:h[4]}:o===3?s={get:h[3]}:o===4?s={set:h[3]}:s={value:h[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(r,c)),o===1?n={get:s.get,set:s.set}:o===2?n=s.value:o===3?n=s.get:o===4&&(n=s.set);var a,I,P;if(typeof d=="function")a=t(d,c,s,T,o,b,p,x,n),a!==void 0&&(u(o,a),o===0?f=a:o===1?(f=a.init,I=a.get||n.get,P=a.set||n.set,n={get:I,set:P}):n=a);else for(var E=d.length-1;E>=0;E--){var g=d[E];if(a=t(g,c,s,T,o,b,p,x,n),a!==void 0){u(o,a);var _;o===0?_=a:o===1?(_=a.init,I=a.get||n.get,P=a.set||n.set,n={get:I,set:P}):n=a,_!==void 0&&(f===void 0?f=_:typeof f=="function"?f=[f,_]:f.push(_))}}if(o===0||o===1){if(f===void 0)f=function(M,C){return C};else if(typeof f!="function"){var F=f;f=function(M,C){for(var N=C,L=0;L<F.length;L++)N=F[L].call(M,N);return N}}else{var j=f;f=function(M,C){return j.call(M,C)}}l.push(f)}o!==0&&(o===1?(s.get=n.get,s.set=n.set):o===2?s.value=n:o===3?s.get=n:o===4&&(s.set=n),p?o===1?(l.push(function(M,C){return n.get.call(M,C)}),l.push(function(M,C){return n.set.call(M,C)})):o===2?l.push(n):l.push(function(M,C){return n.call(M,C)}):Object.defineProperty(r,c,s))}function v(l,r,h){for(var c=[],o,b,p=new Map,T=new Map,x=0;x<r.length;x++){var d=r[x];if(Array.isArray(d)){var s=d[1],f=d[2],n=d.length>3,a=s>=5,I,P;if(a?(I=l,s=s-5,b=b||[],P=b):(I=l.prototype,o=o||[],P=o),s!==0&&!n){var E=a?T:p,g=E.get(f)||0;if(g===!0||g===3&&s!==4||g===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!g&&s>2?E.set(f,s):E.set(f,!0)}m(c,I,d,f,s,a,n,P,h)}}return w(c,o),w(c,b),c}function w(l,r){r&&l.push(function(h){for(var c=0;c<r.length;c++)r[c].call(h);return h})}function D(l,r,h){if(r.length>0){for(var c=[],o=l,b=l.name,p=r.length-1;p>=0;p--){var T={v:!1};try{var x=r[p](o,{kind:"class",name:b,addInitializer:y(c,T),metadata:h})}finally{T.v=!0}x!==void 0&&(u(10,x),o=x)}return[S(o,h),function(){for(var d=0;d<c.length;d++)c[d].call(o)}]}}function S(l,r){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:r})}return function(r,h,c,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var p=Object.create(b===void 0?null:b),T=v(r,h,p);return c.length||S(r,p),{e:T,get c(){return D(r,c,p)}}}}function er(y,t,e,i){return(er=Ll())(y,t,e,i)}var or,ko,Rl;or=Ct({access:q.Write,selector:/^\([[\w\-$]+\)$/});var tr=class{static{({c:[Rl,ko]}=er(this,[],[or]))}constructor(t=O.use(k),e=O.use(W),i=O.use(st)){this.mTarget=t,this.mEventName=i.name.substring(1,i.name.length-1);let u=e.createExpressionProcedure(i.value,["$event"]);this.mListener=m=>{u.setTemporaryValue("$event",m),u.execute()},this.mTarget.addEventListener(this.mEventName,this.mListener)}mEventName;mListener;mTarget;onDeconstruct(){this.mTarget.removeEventListener(this.mEventName,this.mListener)}static{ko()}};function Ol(){function y(l,r){return function(c){e(r,"addInitializer"),i(c,"An initializer"),l.push(c)}}function t(l,r,h,c,o,b,p,T,x){var d;switch(o){case 1:d="accessor";break;case 2:d="method";break;case 3:d="getter";break;case 4:d="setter";break;default:d="field"}var s={kind:d,name:p?"#"+r:r,static:b,private:p,metadata:T},f={v:!1};s.addInitializer=y(c,f);var n,a;if(o===0?p?(n=h.get,a=h.set):(n=function(){return this[r]},a=function(g){this[r]=g}):o===2?n=function(){return h.value}:((o===1||o===3)&&(n=function(){return h.get.call(this)}),(o===1||o===4)&&(a=function(g){h.set.call(this,g)})),p)s.access=n&&a?{get:n,set:a}:n?{get:n}:{set:a};else{if(n){var I=n;n=function(g){return arguments.length===0&&(g=this),I.call(g)}}if(a){var P=a;a=function(g,_){return arguments.length===1&&(_=g,g=this),P.call(g,_)}}var E=function(g){return r in g};s.access=n&&a?{has:E,get:n,set:a}:n?{has:E,get:n}:{has:E,set:a}}try{return l(x,s)}finally{f.v=!0}}function e(l,r){if(l.v)throw new Error("attempted to call "+r+" after decoration was finished")}function i(l,r){if(typeof l!="function")throw new TypeError(r+" must be a function")}function u(l,r){var h=typeof r;if(l===1){if(h!=="object"||r===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");r.get!==void 0&&i(r.get,"accessor.get"),r.set!==void 0&&i(r.set,"accessor.set"),r.init!==void 0&&i(r.init,"accessor.init")}else if(h!=="function"){var c;throw l===0?c="field":l===10?c="class":c="method",new TypeError(c+" decorators must return a function or void 0")}}function m(l,r,h,c,o,b,p,T,x){var d=h[0],s,f,n;p?o===0||o===1?s={get:h[3],set:h[4]}:o===3?s={get:h[3]}:o===4?s={set:h[3]}:s={value:h[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(r,c)),o===1?n={get:s.get,set:s.set}:o===2?n=s.value:o===3?n=s.get:o===4&&(n=s.set);var a,I,P;if(typeof d=="function")a=t(d,c,s,T,o,b,p,x,n),a!==void 0&&(u(o,a),o===0?f=a:o===1?(f=a.init,I=a.get||n.get,P=a.set||n.set,n={get:I,set:P}):n=a);else for(var E=d.length-1;E>=0;E--){var g=d[E];if(a=t(g,c,s,T,o,b,p,x,n),a!==void 0){u(o,a);var _;o===0?_=a:o===1?(_=a.init,I=a.get||n.get,P=a.set||n.set,n={get:I,set:P}):n=a,_!==void 0&&(f===void 0?f=_:typeof f=="function"?f=[f,_]:f.push(_))}}if(o===0||o===1){if(f===void 0)f=function(M,C){return C};else if(typeof f!="function"){var F=f;f=function(M,C){for(var N=C,L=0;L<F.length;L++)N=F[L].call(M,N);return N}}else{var j=f;f=function(M,C){return j.call(M,C)}}l.push(f)}o!==0&&(o===1?(s.get=n.get,s.set=n.set):o===2?s.value=n:o===3?s.get=n:o===4&&(s.set=n),p?o===1?(l.push(function(M,C){return n.get.call(M,C)}),l.push(function(M,C){return n.set.call(M,C)})):o===2?l.push(n):l.push(function(M,C){return n.call(M,C)}):Object.defineProperty(r,c,s))}function v(l,r,h){for(var c=[],o,b,p=new Map,T=new Map,x=0;x<r.length;x++){var d=r[x];if(Array.isArray(d)){var s=d[1],f=d[2],n=d.length>3,a=s>=5,I,P;if(a?(I=l,s=s-5,b=b||[],P=b):(I=l.prototype,o=o||[],P=o),s!==0&&!n){var E=a?T:p,g=E.get(f)||0;if(g===!0||g===3&&s!==4||g===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!g&&s>2?E.set(f,s):E.set(f,!0)}m(c,I,d,f,s,a,n,P,h)}}return w(c,o),w(c,b),c}function w(l,r){r&&l.push(function(h){for(var c=0;c<r.length;c++)r[c].call(h);return h})}function D(l,r,h){if(r.length>0){for(var c=[],o=l,b=l.name,p=r.length-1;p>=0;p--){var T={v:!1};try{var x=r[p](o,{kind:"class",name:b,addInitializer:y(c,T),metadata:h})}finally{T.v=!0}x!==void 0&&(u(10,x),o=x)}return[S(o,h),function(){for(var d=0;d<c.length;d++)c[d].call(o)}]}}function S(l,r){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:r})}return function(r,h,c,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var p=Object.create(b===void 0?null:b),T=v(r,h,p);return c.length||S(r,p),{e:T,get c(){return D(r,c,p)}}}}function ir(y,t,e,i){return(ir=Ol())(y,t,e,i)}function Fl(y){return y}var sr,rr,nr;sr=Ot({instructionType:"for"});new class extends Fl{constructor(){super(nr),rr()}static{class y{static{({c:[nr,rr]}=ir(this,[],[sr]))}static REGEX_HEAD=new RegExp(/^\s*([a-zA-Z]+[a-zA-Z0-9]*)\s*of\s+([^;]+)\s*(?:;(.*))?$/);static REGEX_MODIFIER_INSTRUCTION=new RegExp(/^\s*(\$?[a-zA-Z]+[a-zA-Z0-9]*)\s*=\s*(.+?)\s*$/);mExpression;mLastEntries;mModuleValues;mTemplate;constructor(e=O.use(vt),i=O.use(W),u=O.use(ot)){this.mTemplate=e,this.mModuleValues=i,this.mLastEntries=new Array;let m=u.value,v=y.REGEX_HEAD.exec(m);if(!v)throw new A(`For-Parameter value has wrong format: ${m}`,this);let w=v[1],D=v[2],S=v[3]?v[3].split(";"):new Array,l=new Array;for(let r of S){let h=y.REGEX_MODIFIER_INSTRUCTION.exec(r);if(!h)throw new A(`For-Parameter optional instruction has wrong format: ${r}`,this);l.push({variableName:h[1],procedure:this.mModuleValues.createExpressionProcedure(h[2],["$index",w])})}this.mExpression={iterateVariableName:w,iterateValueProcedure:this.mModuleValues.createExpressionProcedure(D),modifier:l}}onUpdate(){let e=new mt,i=this.mExpression.iterateValueProcedure.execute();if(typeof i=="object"&&i!==null||Array.isArray(i)){let u=Symbol.iterator in i?Object.entries([...i]):Object.entries(i);if(this.compareEntries(u,this.mLastEntries))return null;this.mLastEntries=u;for(let[m,v]of u)this.addTemplateForElement(e,this.mExpression,v,m);return e}else return null}addTemplateForElement=(e,i,u,m)=>{let v=new gt(this.mModuleValues.data);v.setTemporaryValue(i.iterateVariableName,u);let w=u;for(let S of i.modifier){S.procedure.setTemporaryValue("$index",m),S.procedure.setTemporaryValue(i.iterateVariableName,u);let l=S.procedure.execute();if(S.variableName==="$key"){w=l;continue}v.setTemporaryValue(S.variableName,l)}let D=new dt;D.appendChild(...this.mTemplate.childList),e.addElement(D,v,w)};compareEntries(e,i){if(e.length!==i.length)return!1;for(let u=0;u<e.length;u++){let[m,v]=e[u],[w,D]=i[u];if(m!==w||v!==D)return!1}return!0}}}};function zl(){function y(l,r){return function(c){e(r,"addInitializer"),i(c,"An initializer"),l.push(c)}}function t(l,r,h,c,o,b,p,T,x){var d;switch(o){case 1:d="accessor";break;case 2:d="method";break;case 3:d="getter";break;case 4:d="setter";break;default:d="field"}var s={kind:d,name:p?"#"+r:r,static:b,private:p,metadata:T},f={v:!1};s.addInitializer=y(c,f);var n,a;if(o===0?p?(n=h.get,a=h.set):(n=function(){return this[r]},a=function(g){this[r]=g}):o===2?n=function(){return h.value}:((o===1||o===3)&&(n=function(){return h.get.call(this)}),(o===1||o===4)&&(a=function(g){h.set.call(this,g)})),p)s.access=n&&a?{get:n,set:a}:n?{get:n}:{set:a};else{if(n){var I=n;n=function(g){return arguments.length===0&&(g=this),I.call(g)}}if(a){var P=a;a=function(g,_){return arguments.length===1&&(_=g,g=this),P.call(g,_)}}var E=function(g){return r in g};s.access=n&&a?{has:E,get:n,set:a}:n?{has:E,get:n}:{has:E,set:a}}try{return l(x,s)}finally{f.v=!0}}function e(l,r){if(l.v)throw new Error("attempted to call "+r+" after decoration was finished")}function i(l,r){if(typeof l!="function")throw new TypeError(r+" must be a function")}function u(l,r){var h=typeof r;if(l===1){if(h!=="object"||r===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");r.get!==void 0&&i(r.get,"accessor.get"),r.set!==void 0&&i(r.set,"accessor.set"),r.init!==void 0&&i(r.init,"accessor.init")}else if(h!=="function"){var c;throw l===0?c="field":l===10?c="class":c="method",new TypeError(c+" decorators must return a function or void 0")}}function m(l,r,h,c,o,b,p,T,x){var d=h[0],s,f,n;p?o===0||o===1?s={get:h[3],set:h[4]}:o===3?s={get:h[3]}:o===4?s={set:h[3]}:s={value:h[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(r,c)),o===1?n={get:s.get,set:s.set}:o===2?n=s.value:o===3?n=s.get:o===4&&(n=s.set);var a,I,P;if(typeof d=="function")a=t(d,c,s,T,o,b,p,x,n),a!==void 0&&(u(o,a),o===0?f=a:o===1?(f=a.init,I=a.get||n.get,P=a.set||n.set,n={get:I,set:P}):n=a);else for(var E=d.length-1;E>=0;E--){var g=d[E];if(a=t(g,c,s,T,o,b,p,x,n),a!==void 0){u(o,a);var _;o===0?_=a:o===1?(_=a.init,I=a.get||n.get,P=a.set||n.set,n={get:I,set:P}):n=a,_!==void 0&&(f===void 0?f=_:typeof f=="function"?f=[f,_]:f.push(_))}}if(o===0||o===1){if(f===void 0)f=function(M,C){return C};else if(typeof f!="function"){var F=f;f=function(M,C){for(var N=C,L=0;L<F.length;L++)N=F[L].call(M,N);return N}}else{var j=f;f=function(M,C){return j.call(M,C)}}l.push(f)}o!==0&&(o===1?(s.get=n.get,s.set=n.set):o===2?s.value=n:o===3?s.get=n:o===4&&(s.set=n),p?o===1?(l.push(function(M,C){return n.get.call(M,C)}),l.push(function(M,C){return n.set.call(M,C)})):o===2?l.push(n):l.push(function(M,C){return n.call(M,C)}):Object.defineProperty(r,c,s))}function v(l,r,h){for(var c=[],o,b,p=new Map,T=new Map,x=0;x<r.length;x++){var d=r[x];if(Array.isArray(d)){var s=d[1],f=d[2],n=d.length>3,a=s>=5,I,P;if(a?(I=l,s=s-5,b=b||[],P=b):(I=l.prototype,o=o||[],P=o),s!==0&&!n){var E=a?T:p,g=E.get(f)||0;if(g===!0||g===3&&s!==4||g===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!g&&s>2?E.set(f,s):E.set(f,!0)}m(c,I,d,f,s,a,n,P,h)}}return w(c,o),w(c,b),c}function w(l,r){r&&l.push(function(h){for(var c=0;c<r.length;c++)r[c].call(h);return h})}function D(l,r,h){if(r.length>0){for(var c=[],o=l,b=l.name,p=r.length-1;p>=0;p--){var T={v:!1};try{var x=r[p](o,{kind:"class",name:b,addInitializer:y(c,T),metadata:h})}finally{T.v=!0}x!==void 0&&(u(10,x),o=x)}return[S(o,h),function(){for(var d=0;d<c.length;d++)c[d].call(o)}]}}function S(l,r){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:r})}return function(r,h,c,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var p=Object.create(b===void 0?null:b),T=v(r,h,p);return c.length||S(r,p),{e:T,get c(){return D(r,c,p)}}}}function cr(y,t,e,i){return(cr=zl())(y,t,e,i)}var ur,ar,jl;ur=Ot({instructionType:"if"});var lr=class{static{({c:[jl,ar]}=cr(this,[],[ur]))}constructor(t=O.use(vt),e=O.use(W),i=O.use(ot)){this.mTemplateReference=t,this.mModuleValues=e,this.mProcedure=this.mModuleValues.createExpressionProcedure(i.value),this.mLastBoolean=!1}mLastBoolean;mModuleValues;mProcedure;mTemplateReference;onUpdate(){let t=this.mProcedure.execute();if(!!t!==this.mLastBoolean){this.mLastBoolean=!!t;let e=new mt;if(t){let i=new dt;i.appendChild(...this.mTemplateReference.childList),e.addElement(i,new gt(this.mModuleValues.data),null)}return e}else return null}static{ar()}};function Vl(){function y(l,r){return function(c){e(r,"addInitializer"),i(c,"An initializer"),l.push(c)}}function t(l,r,h,c,o,b,p,T,x){var d;switch(o){case 1:d="accessor";break;case 2:d="method";break;case 3:d="getter";break;case 4:d="setter";break;default:d="field"}var s={kind:d,name:p?"#"+r:r,static:b,private:p,metadata:T},f={v:!1};s.addInitializer=y(c,f);var n,a;if(o===0?p?(n=h.get,a=h.set):(n=function(){return this[r]},a=function(g){this[r]=g}):o===2?n=function(){return h.value}:((o===1||o===3)&&(n=function(){return h.get.call(this)}),(o===1||o===4)&&(a=function(g){h.set.call(this,g)})),p)s.access=n&&a?{get:n,set:a}:n?{get:n}:{set:a};else{if(n){var I=n;n=function(g){return arguments.length===0&&(g=this),I.call(g)}}if(a){var P=a;a=function(g,_){return arguments.length===1&&(_=g,g=this),P.call(g,_)}}var E=function(g){return r in g};s.access=n&&a?{has:E,get:n,set:a}:n?{has:E,get:n}:{has:E,set:a}}try{return l(x,s)}finally{f.v=!0}}function e(l,r){if(l.v)throw new Error("attempted to call "+r+" after decoration was finished")}function i(l,r){if(typeof l!="function")throw new TypeError(r+" must be a function")}function u(l,r){var h=typeof r;if(l===1){if(h!=="object"||r===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");r.get!==void 0&&i(r.get,"accessor.get"),r.set!==void 0&&i(r.set,"accessor.set"),r.init!==void 0&&i(r.init,"accessor.init")}else if(h!=="function"){var c;throw l===0?c="field":l===10?c="class":c="method",new TypeError(c+" decorators must return a function or void 0")}}function m(l,r,h,c,o,b,p,T,x){var d=h[0],s,f,n;p?o===0||o===1?s={get:h[3],set:h[4]}:o===3?s={get:h[3]}:o===4?s={set:h[3]}:s={value:h[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(r,c)),o===1?n={get:s.get,set:s.set}:o===2?n=s.value:o===3?n=s.get:o===4&&(n=s.set);var a,I,P;if(typeof d=="function")a=t(d,c,s,T,o,b,p,x,n),a!==void 0&&(u(o,a),o===0?f=a:o===1?(f=a.init,I=a.get||n.get,P=a.set||n.set,n={get:I,set:P}):n=a);else for(var E=d.length-1;E>=0;E--){var g=d[E];if(a=t(g,c,s,T,o,b,p,x,n),a!==void 0){u(o,a);var _;o===0?_=a:o===1?(_=a.init,I=a.get||n.get,P=a.set||n.set,n={get:I,set:P}):n=a,_!==void 0&&(f===void 0?f=_:typeof f=="function"?f=[f,_]:f.push(_))}}if(o===0||o===1){if(f===void 0)f=function(M,C){return C};else if(typeof f!="function"){var F=f;f=function(M,C){for(var N=C,L=0;L<F.length;L++)N=F[L].call(M,N);return N}}else{var j=f;f=function(M,C){return j.call(M,C)}}l.push(f)}o!==0&&(o===1?(s.get=n.get,s.set=n.set):o===2?s.value=n:o===3?s.get=n:o===4&&(s.set=n),p?o===1?(l.push(function(M,C){return n.get.call(M,C)}),l.push(function(M,C){return n.set.call(M,C)})):o===2?l.push(n):l.push(function(M,C){return n.call(M,C)}):Object.defineProperty(r,c,s))}function v(l,r,h){for(var c=[],o,b,p=new Map,T=new Map,x=0;x<r.length;x++){var d=r[x];if(Array.isArray(d)){var s=d[1],f=d[2],n=d.length>3,a=s>=5,I,P;if(a?(I=l,s=s-5,b=b||[],P=b):(I=l.prototype,o=o||[],P=o),s!==0&&!n){var E=a?T:p,g=E.get(f)||0;if(g===!0||g===3&&s!==4||g===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!g&&s>2?E.set(f,s):E.set(f,!0)}m(c,I,d,f,s,a,n,P,h)}}return w(c,o),w(c,b),c}function w(l,r){r&&l.push(function(h){for(var c=0;c<r.length;c++)r[c].call(h);return h})}function D(l,r,h){if(r.length>0){for(var c=[],o=l,b=l.name,p=r.length-1;p>=0;p--){var T={v:!1};try{var x=r[p](o,{kind:"class",name:b,addInitializer:y(c,T),metadata:h})}finally{T.v=!0}x!==void 0&&(u(10,x),o=x)}return[S(o,h),function(){for(var d=0;d<c.length;d++)c[d].call(o)}]}}function S(l,r){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:r})}return function(r,h,c,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var p=Object.create(b===void 0?null:b),T=v(r,h,p);return c.length||S(r,p),{e:T,get c(){return D(r,c,p)}}}}function dr(y,t,e,i){return(dr=Vl())(y,t,e,i)}var mr,hr,Bl;mr=Ct({access:q.Read,selector:/^\[[\w$]+\]$/});var fr=class{static{({c:[Bl,hr]}=dr(this,[],[mr]))}constructor(t=O.use(k),e=O.use(W),i=O.use(st)){this.mTarget=t,this.mProcedure=e.createExpressionProcedure(i.value),this.mTargetProperty=i.name.substring(1,i.name.length-1),this.mLastValue=Symbol("Uncomparable")}mLastValue;mProcedure;mTarget;mTargetProperty;onUpdate(){let t=this.mProcedure.execute();return t===this.mLastValue?!1:(this.mLastValue=t,Reflect.set(this.mTarget,this.mTargetProperty,t),!0)}static{hr()}};function $l(){function y(l,r){return function(c){e(r,"addInitializer"),i(c,"An initializer"),l.push(c)}}function t(l,r,h,c,o,b,p,T,x){var d;switch(o){case 1:d="accessor";break;case 2:d="method";break;case 3:d="getter";break;case 4:d="setter";break;default:d="field"}var s={kind:d,name:p?"#"+r:r,static:b,private:p,metadata:T},f={v:!1};s.addInitializer=y(c,f);var n,a;if(o===0?p?(n=h.get,a=h.set):(n=function(){return this[r]},a=function(g){this[r]=g}):o===2?n=function(){return h.value}:((o===1||o===3)&&(n=function(){return h.get.call(this)}),(o===1||o===4)&&(a=function(g){h.set.call(this,g)})),p)s.access=n&&a?{get:n,set:a}:n?{get:n}:{set:a};else{if(n){var I=n;n=function(g){return arguments.length===0&&(g=this),I.call(g)}}if(a){var P=a;a=function(g,_){return arguments.length===1&&(_=g,g=this),P.call(g,_)}}var E=function(g){return r in g};s.access=n&&a?{has:E,get:n,set:a}:n?{has:E,get:n}:{has:E,set:a}}try{return l(x,s)}finally{f.v=!0}}function e(l,r){if(l.v)throw new Error("attempted to call "+r+" after decoration was finished")}function i(l,r){if(typeof l!="function")throw new TypeError(r+" must be a function")}function u(l,r){var h=typeof r;if(l===1){if(h!=="object"||r===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");r.get!==void 0&&i(r.get,"accessor.get"),r.set!==void 0&&i(r.set,"accessor.set"),r.init!==void 0&&i(r.init,"accessor.init")}else if(h!=="function"){var c;throw l===0?c="field":l===10?c="class":c="method",new TypeError(c+" decorators must return a function or void 0")}}function m(l,r,h,c,o,b,p,T,x){var d=h[0],s,f,n;p?o===0||o===1?s={get:h[3],set:h[4]}:o===3?s={get:h[3]}:o===4?s={set:h[3]}:s={value:h[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(r,c)),o===1?n={get:s.get,set:s.set}:o===2?n=s.value:o===3?n=s.get:o===4&&(n=s.set);var a,I,P;if(typeof d=="function")a=t(d,c,s,T,o,b,p,x,n),a!==void 0&&(u(o,a),o===0?f=a:o===1?(f=a.init,I=a.get||n.get,P=a.set||n.set,n={get:I,set:P}):n=a);else for(var E=d.length-1;E>=0;E--){var g=d[E];if(a=t(g,c,s,T,o,b,p,x,n),a!==void 0){u(o,a);var _;o===0?_=a:o===1?(_=a.init,I=a.get||n.get,P=a.set||n.set,n={get:I,set:P}):n=a,_!==void 0&&(f===void 0?f=_:typeof f=="function"?f=[f,_]:f.push(_))}}if(o===0||o===1){if(f===void 0)f=function(M,C){return C};else if(typeof f!="function"){var F=f;f=function(M,C){for(var N=C,L=0;L<F.length;L++)N=F[L].call(M,N);return N}}else{var j=f;f=function(M,C){return j.call(M,C)}}l.push(f)}o!==0&&(o===1?(s.get=n.get,s.set=n.set):o===2?s.value=n:o===3?s.get=n:o===4&&(s.set=n),p?o===1?(l.push(function(M,C){return n.get.call(M,C)}),l.push(function(M,C){return n.set.call(M,C)})):o===2?l.push(n):l.push(function(M,C){return n.call(M,C)}):Object.defineProperty(r,c,s))}function v(l,r,h){for(var c=[],o,b,p=new Map,T=new Map,x=0;x<r.length;x++){var d=r[x];if(Array.isArray(d)){var s=d[1],f=d[2],n=d.length>3,a=s>=5,I,P;if(a?(I=l,s=s-5,b=b||[],P=b):(I=l.prototype,o=o||[],P=o),s!==0&&!n){var E=a?T:p,g=E.get(f)||0;if(g===!0||g===3&&s!==4||g===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!g&&s>2?E.set(f,s):E.set(f,!0)}m(c,I,d,f,s,a,n,P,h)}}return w(c,o),w(c,b),c}function w(l,r){r&&l.push(function(h){for(var c=0;c<r.length;c++)r[c].call(h);return h})}function D(l,r,h){if(r.length>0){for(var c=[],o=l,b=l.name,p=r.length-1;p>=0;p--){var T={v:!1};try{var x=r[p](o,{kind:"class",name:b,addInitializer:y(c,T),metadata:h})}finally{T.v=!0}x!==void 0&&(u(10,x),o=x)}return[S(o,h),function(){for(var d=0;d<c.length;d++)c[d].call(o)}]}}function S(l,r){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:r})}return function(r,h,c,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var p=Object.create(b===void 0?null:b),T=v(r,h,p);return c.length||S(r,p),{e:T,get c(){return D(r,c,p)}}}}function vr(y,t,e,i){return(vr=$l())(y,t,e,i)}var yr,pr,Gl;yr=Ct({access:q.Write,selector:/^#[[\w$]+$/});var gr=class{static{({c:[Gl,pr]}=vr(this,[],[yr]))}constructor(t=O.use(k),e=O.use(st),i=O.use(Pt)){this.mChildName=e.name.substring(1),this.mComponentScopeValue=i,this.mTargetNode=t,this.mComponentScopeValue.setTemporaryValue(this.mChildName,this.mTargetNode)}mChildName;mComponentScopeValue;mTargetNode;onDeconstruct(){this.mComponentScopeValue.data.store[this.mChildName]===this.mTargetNode&&this.mComponentScopeValue.data.deleteTemporaryValue(this.mChildName)}static{pr()}};function Ul(){function y(l,r){return function(c){e(r,"addInitializer"),i(c,"An initializer"),l.push(c)}}function t(l,r,h,c,o,b,p,T,x){var d;switch(o){case 1:d="accessor";break;case 2:d="method";break;case 3:d="getter";break;case 4:d="setter";break;default:d="field"}var s={kind:d,name:p?"#"+r:r,static:b,private:p,metadata:T},f={v:!1};s.addInitializer=y(c,f);var n,a;if(o===0?p?(n=h.get,a=h.set):(n=function(){return this[r]},a=function(g){this[r]=g}):o===2?n=function(){return h.value}:((o===1||o===3)&&(n=function(){return h.get.call(this)}),(o===1||o===4)&&(a=function(g){h.set.call(this,g)})),p)s.access=n&&a?{get:n,set:a}:n?{get:n}:{set:a};else{if(n){var I=n;n=function(g){return arguments.length===0&&(g=this),I.call(g)}}if(a){var P=a;a=function(g,_){return arguments.length===1&&(_=g,g=this),P.call(g,_)}}var E=function(g){return r in g};s.access=n&&a?{has:E,get:n,set:a}:n?{has:E,get:n}:{has:E,set:a}}try{return l(x,s)}finally{f.v=!0}}function e(l,r){if(l.v)throw new Error("attempted to call "+r+" after decoration was finished")}function i(l,r){if(typeof l!="function")throw new TypeError(r+" must be a function")}function u(l,r){var h=typeof r;if(l===1){if(h!=="object"||r===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");r.get!==void 0&&i(r.get,"accessor.get"),r.set!==void 0&&i(r.set,"accessor.set"),r.init!==void 0&&i(r.init,"accessor.init")}else if(h!=="function"){var c;throw l===0?c="field":l===10?c="class":c="method",new TypeError(c+" decorators must return a function or void 0")}}function m(l,r,h,c,o,b,p,T,x){var d=h[0],s,f,n;p?o===0||o===1?s={get:h[3],set:h[4]}:o===3?s={get:h[3]}:o===4?s={set:h[3]}:s={value:h[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(r,c)),o===1?n={get:s.get,set:s.set}:o===2?n=s.value:o===3?n=s.get:o===4&&(n=s.set);var a,I,P;if(typeof d=="function")a=t(d,c,s,T,o,b,p,x,n),a!==void 0&&(u(o,a),o===0?f=a:o===1?(f=a.init,I=a.get||n.get,P=a.set||n.set,n={get:I,set:P}):n=a);else for(var E=d.length-1;E>=0;E--){var g=d[E];if(a=t(g,c,s,T,o,b,p,x,n),a!==void 0){u(o,a);var _;o===0?_=a:o===1?(_=a.init,I=a.get||n.get,P=a.set||n.set,n={get:I,set:P}):n=a,_!==void 0&&(f===void 0?f=_:typeof f=="function"?f=[f,_]:f.push(_))}}if(o===0||o===1){if(f===void 0)f=function(M,C){return C};else if(typeof f!="function"){var F=f;f=function(M,C){for(var N=C,L=0;L<F.length;L++)N=F[L].call(M,N);return N}}else{var j=f;f=function(M,C){return j.call(M,C)}}l.push(f)}o!==0&&(o===1?(s.get=n.get,s.set=n.set):o===2?s.value=n:o===3?s.get=n:o===4&&(s.set=n),p?o===1?(l.push(function(M,C){return n.get.call(M,C)}),l.push(function(M,C){return n.set.call(M,C)})):o===2?l.push(n):l.push(function(M,C){return n.call(M,C)}):Object.defineProperty(r,c,s))}function v(l,r,h){for(var c=[],o,b,p=new Map,T=new Map,x=0;x<r.length;x++){var d=r[x];if(Array.isArray(d)){var s=d[1],f=d[2],n=d.length>3,a=s>=5,I,P;if(a?(I=l,s=s-5,b=b||[],P=b):(I=l.prototype,o=o||[],P=o),s!==0&&!n){var E=a?T:p,g=E.get(f)||0;if(g===!0||g===3&&s!==4||g===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!g&&s>2?E.set(f,s):E.set(f,!0)}m(c,I,d,f,s,a,n,P,h)}}return w(c,o),w(c,b),c}function w(l,r){r&&l.push(function(h){for(var c=0;c<r.length;c++)r[c].call(h);return h})}function D(l,r,h){if(r.length>0){for(var c=[],o=l,b=l.name,p=r.length-1;p>=0;p--){var T={v:!1};try{var x=r[p](o,{kind:"class",name:b,addInitializer:y(c,T),metadata:h})}finally{T.v=!0}x!==void 0&&(u(10,x),o=x)}return[S(o,h),function(){for(var d=0;d<c.length;d++)c[d].call(o)}]}}function S(l,r){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:r})}return function(r,h,c,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var p=Object.create(b===void 0?null:b),T=v(r,h,p);return c.length||S(r,p),{e:T,get c(){return D(r,c,p)}}}}function xr(y,t,e,i){return(xr=Ul())(y,t,e,i)}var Tr,br,Hl;Tr=Ot({instructionType:"slot"});var wr=class{static{({c:[Hl,br]}=xr(this,[],[Tr]))}constructor(t=O.use(W),e=O.use(ot)){this.mModuleValues=t,this.mSlotName=e.value,this.mIsSetup=!1}mIsSetup;mModuleValues;mSlotName;onUpdate(){if(this.mIsSetup)return null;this.mIsSetup=!0;let t=new Rt("slot");this.mSlotName!==""&&t.setAttribute("name").addValue(this.mSlotName);let e=new dt;e.appendChild(t);let i=new mt;return i.addElement(e,this.mModuleValues.data,null),i}static{br()}};function Xl(){function y(l,r){return function(c){e(r,"addInitializer"),i(c,"An initializer"),l.push(c)}}function t(l,r,h,c,o,b,p,T,x){var d;switch(o){case 1:d="accessor";break;case 2:d="method";break;case 3:d="getter";break;case 4:d="setter";break;default:d="field"}var s={kind:d,name:p?"#"+r:r,static:b,private:p,metadata:T},f={v:!1};s.addInitializer=y(c,f);var n,a;if(o===0?p?(n=h.get,a=h.set):(n=function(){return this[r]},a=function(g){this[r]=g}):o===2?n=function(){return h.value}:((o===1||o===3)&&(n=function(){return h.get.call(this)}),(o===1||o===4)&&(a=function(g){h.set.call(this,g)})),p)s.access=n&&a?{get:n,set:a}:n?{get:n}:{set:a};else{if(n){var I=n;n=function(g){return arguments.length===0&&(g=this),I.call(g)}}if(a){var P=a;a=function(g,_){return arguments.length===1&&(_=g,g=this),P.call(g,_)}}var E=function(g){return r in g};s.access=n&&a?{has:E,get:n,set:a}:n?{has:E,get:n}:{has:E,set:a}}try{return l(x,s)}finally{f.v=!0}}function e(l,r){if(l.v)throw new Error("attempted to call "+r+" after decoration was finished")}function i(l,r){if(typeof l!="function")throw new TypeError(r+" must be a function")}function u(l,r){var h=typeof r;if(l===1){if(h!=="object"||r===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");r.get!==void 0&&i(r.get,"accessor.get"),r.set!==void 0&&i(r.set,"accessor.set"),r.init!==void 0&&i(r.init,"accessor.init")}else if(h!=="function"){var c;throw l===0?c="field":l===10?c="class":c="method",new TypeError(c+" decorators must return a function or void 0")}}function m(l,r,h,c,o,b,p,T,x){var d=h[0],s,f,n;p?o===0||o===1?s={get:h[3],set:h[4]}:o===3?s={get:h[3]}:o===4?s={set:h[3]}:s={value:h[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(r,c)),o===1?n={get:s.get,set:s.set}:o===2?n=s.value:o===3?n=s.get:o===4&&(n=s.set);var a,I,P;if(typeof d=="function")a=t(d,c,s,T,o,b,p,x,n),a!==void 0&&(u(o,a),o===0?f=a:o===1?(f=a.init,I=a.get||n.get,P=a.set||n.set,n={get:I,set:P}):n=a);else for(var E=d.length-1;E>=0;E--){var g=d[E];if(a=t(g,c,s,T,o,b,p,x,n),a!==void 0){u(o,a);var _;o===0?_=a:o===1?(_=a.init,I=a.get||n.get,P=a.set||n.set,n={get:I,set:P}):n=a,_!==void 0&&(f===void 0?f=_:typeof f=="function"?f=[f,_]:f.push(_))}}if(o===0||o===1){if(f===void 0)f=function(M,C){return C};else if(typeof f!="function"){var F=f;f=function(M,C){for(var N=C,L=0;L<F.length;L++)N=F[L].call(M,N);return N}}else{var j=f;f=function(M,C){return j.call(M,C)}}l.push(f)}o!==0&&(o===1?(s.get=n.get,s.set=n.set):o===2?s.value=n:o===3?s.get=n:o===4&&(s.set=n),p?o===1?(l.push(function(M,C){return n.get.call(M,C)}),l.push(function(M,C){return n.set.call(M,C)})):o===2?l.push(n):l.push(function(M,C){return n.call(M,C)}):Object.defineProperty(r,c,s))}function v(l,r,h){for(var c=[],o,b,p=new Map,T=new Map,x=0;x<r.length;x++){var d=r[x];if(Array.isArray(d)){var s=d[1],f=d[2],n=d.length>3,a=s>=5,I,P;if(a?(I=l,s=s-5,b=b||[],P=b):(I=l.prototype,o=o||[],P=o),s!==0&&!n){var E=a?T:p,g=E.get(f)||0;if(g===!0||g===3&&s!==4||g===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!g&&s>2?E.set(f,s):E.set(f,!0)}m(c,I,d,f,s,a,n,P,h)}}return w(c,o),w(c,b),c}function w(l,r){r&&l.push(function(h){for(var c=0;c<r.length;c++)r[c].call(h);return h})}function D(l,r,h){if(r.length>0){for(var c=[],o=l,b=l.name,p=r.length-1;p>=0;p--){var T={v:!1};try{var x=r[p](o,{kind:"class",name:b,addInitializer:y(c,T),metadata:h})}finally{T.v=!0}x!==void 0&&(u(10,x),o=x)}return[S(o,h),function(){for(var d=0;d<c.length;d++)c[d].call(o)}]}}function S(l,r){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:r})}return function(r,h,c,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var p=Object.create(b===void 0?null:b),T=v(r,h,p);return c.length||S(r,p),{e:T,get c(){return D(r,c,p)}}}}function Cr(y,t,e,i){return(Cr=Xl())(y,t,e,i)}var Ir,Dr,Yl;Ir=Ct({access:q.ReadWrite,selector:/^\[\([[\w$]+\)\]$/});var Er=class{static{({c:[Yl,Dr]}=Cr(this,[],[Ir]))}constructor(t=O.use(G),e=O.use(k),i=O.use(W),u=O.use(st)){this.mTargetNode=e,this.mAttributeKey=u.name.substring(2,u.name.length-2),this.mReadProcedure=i.createExpressionProcedure(u.value),this.mWriteProcedure=i.createExpressionProcedure(`${u.value} = $DATA;`,["$DATA"]),this.mLastDataValue=Symbol("Uncomparable");let m=v=>{this.mLastDataValue!==v&&t.updater.updateAsync()};this.mTargetNode.addEventListener("input",v=>{m(Reflect.get(this.mTargetNode,this.mAttributeKey))}),this.mTargetNode.addEventListener("change",v=>{m(Reflect.get(this.mTargetNode,this.mAttributeKey))})}mAttributeKey;mLastDataValue;mReadProcedure;mTargetNode;mWriteProcedure;onUpdate(){let t=this.mReadProcedure.execute();if(t!==this.mLastDataValue)return Reflect.set(this.mTargetNode,this.mAttributeKey,t),this.mLastDataValue=t,!0;let e=Reflect.get(this.mTargetNode,this.mAttributeKey);return e!==t?(this.mWriteProcedure.setTemporaryValue("$DATA",e),this.mWriteProcedure.execute(),this.mLastDataValue=e,!0):!1}static{Dr()}};function Wl(){function y(l,r){return function(c){e(r,"addInitializer"),i(c,"An initializer"),l.push(c)}}function t(l,r,h,c,o,b,p,T,x){var d;switch(o){case 1:d="accessor";break;case 2:d="method";break;case 3:d="getter";break;case 4:d="setter";break;default:d="field"}var s={kind:d,name:p?"#"+r:r,static:b,private:p,metadata:T},f={v:!1};s.addInitializer=y(c,f);var n,a;if(o===0?p?(n=h.get,a=h.set):(n=function(){return this[r]},a=function(g){this[r]=g}):o===2?n=function(){return h.value}:((o===1||o===3)&&(n=function(){return h.get.call(this)}),(o===1||o===4)&&(a=function(g){h.set.call(this,g)})),p)s.access=n&&a?{get:n,set:a}:n?{get:n}:{set:a};else{if(n){var I=n;n=function(g){return arguments.length===0&&(g=this),I.call(g)}}if(a){var P=a;a=function(g,_){return arguments.length===1&&(_=g,g=this),P.call(g,_)}}var E=function(g){return r in g};s.access=n&&a?{has:E,get:n,set:a}:n?{has:E,get:n}:{has:E,set:a}}try{return l(x,s)}finally{f.v=!0}}function e(l,r){if(l.v)throw new Error("attempted to call "+r+" after decoration was finished")}function i(l,r){if(typeof l!="function")throw new TypeError(r+" must be a function")}function u(l,r){var h=typeof r;if(l===1){if(h!=="object"||r===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");r.get!==void 0&&i(r.get,"accessor.get"),r.set!==void 0&&i(r.set,"accessor.set"),r.init!==void 0&&i(r.init,"accessor.init")}else if(h!=="function"){var c;throw l===0?c="field":l===10?c="class":c="method",new TypeError(c+" decorators must return a function or void 0")}}function m(l,r,h,c,o,b,p,T,x){var d=h[0],s,f,n;p?o===0||o===1?s={get:h[3],set:h[4]}:o===3?s={get:h[3]}:o===4?s={set:h[3]}:s={value:h[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(r,c)),o===1?n={get:s.get,set:s.set}:o===2?n=s.value:o===3?n=s.get:o===4&&(n=s.set);var a,I,P;if(typeof d=="function")a=t(d,c,s,T,o,b,p,x,n),a!==void 0&&(u(o,a),o===0?f=a:o===1?(f=a.init,I=a.get||n.get,P=a.set||n.set,n={get:I,set:P}):n=a);else for(var E=d.length-1;E>=0;E--){var g=d[E];if(a=t(g,c,s,T,o,b,p,x,n),a!==void 0){u(o,a);var _;o===0?_=a:o===1?(_=a.init,I=a.get||n.get,P=a.set||n.set,n={get:I,set:P}):n=a,_!==void 0&&(f===void 0?f=_:typeof f=="function"?f=[f,_]:f.push(_))}}if(o===0||o===1){if(f===void 0)f=function(M,C){return C};else if(typeof f!="function"){var F=f;f=function(M,C){for(var N=C,L=0;L<F.length;L++)N=F[L].call(M,N);return N}}else{var j=f;f=function(M,C){return j.call(M,C)}}l.push(f)}o!==0&&(o===1?(s.get=n.get,s.set=n.set):o===2?s.value=n:o===3?s.get=n:o===4&&(s.set=n),p?o===1?(l.push(function(M,C){return n.get.call(M,C)}),l.push(function(M,C){return n.set.call(M,C)})):o===2?l.push(n):l.push(function(M,C){return n.call(M,C)}):Object.defineProperty(r,c,s))}function v(l,r,h){for(var c=[],o,b,p=new Map,T=new Map,x=0;x<r.length;x++){var d=r[x];if(Array.isArray(d)){var s=d[1],f=d[2],n=d.length>3,a=s>=5,I,P;if(a?(I=l,s=s-5,b=b||[],P=b):(I=l.prototype,o=o||[],P=o),s!==0&&!n){var E=a?T:p,g=E.get(f)||0;if(g===!0||g===3&&s!==4||g===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!g&&s>2?E.set(f,s):E.set(f,!0)}m(c,I,d,f,s,a,n,P,h)}}return w(c,o),w(c,b),c}function w(l,r){r&&l.push(function(h){for(var c=0;c<r.length;c++)r[c].call(h);return h})}function D(l,r,h){if(r.length>0){for(var c=[],o=l,b=l.name,p=r.length-1;p>=0;p--){var T={v:!1};try{var x=r[p](o,{kind:"class",name:b,addInitializer:y(c,T),metadata:h})}finally{T.v=!0}x!==void 0&&(u(10,x),o=x)}return[S(o,h),function(){for(var d=0;d<c.length;d++)c[d].call(o)}]}}function S(l,r){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:r})}return function(r,h,c,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var p=Object.create(b===void 0?null:b),T=v(r,h,p);return c.length||S(r,p),{e:T,get c(){return D(r,c,p)}}}}function _r(y,t,e,i){return(_r=Wl())(y,t,e,i)}var Sr,Pr,Zl;Sr=Jt({access:q.Read,targetRestrictions:[Et]});var Mr=class{static{({c:[Zl,Pr]}=_r(this,[],[Sr]))}constructor(t=O.use(Et),e=O.use(k)){let i=new Array,u=t.processorConstructor;do{let m=ct.get(u).getMetadata(Ce.METADATA_USER_EVENT_LISTENER_PROPERIES);if(m)for(let v of m)i.push(v)}while(u=Object.getPrototypeOf(u));this.mEventListenerList=new Array,this.mTargetElement=e;for(let m of i){let[v,w]=m,D=Reflect.get(t.processor,v);D=D.bind(t.processor),this.mEventListenerList.push([w,D]),this.mTargetElement.addEventListener(w,D)}}mEventListenerList;mTargetElement;onDeconstruct(){for(let t of this.mEventListenerList){let[e,i]=t;this.mTargetElement.removeEventListener(e,i)}}static{Pr()}};var Ar=`:host {\r
    display: block;\r
    width: 100%;\r
    height: 100%;\r
}\r
\r
potatno-code-editor {\r
    display: block;\r
    width: 100%;\r
    height: 100%;\r
}`;var ne=class{mProject;constructor(t){this.mProject=t}deserialize(t){let e=new Vt(this.mProject),i=[];for(let u of t.functions){let m=this.deserializeFunctionHead(u,e);i.push([m,u]),e.addFunction(m)}for(let[u,m]of i)this.deserializeFunctionBody(u,m,e);return e}deserializeFunctionBody(t,e,i){let u=new Map;for(let m of e.nodes)u.set(m.id,this.deserializeNode(m,t,i));for(let m of e.connections){if(!u.has(m.sourceNodeId)||!u.has(m.targetNodeId))continue;let v=u.get(m.sourceNodeId),w=u.get(m.targetNodeId),D=v.outputs.map.get(m.sourcePortId),S=w.inputs.map.get(m.targetPortId);!D||!S||D.connect(S)}}deserializeFunctionHead(t,e){let i=new lt(this.mProject,e,{definitionId:t.definitionId,id:t.id,label:t.label,isSystem:t.isSystem});for(let u of t.imports)i.addImport(u);for(let u of t.inputs)i.addInput({label:u.label,dataType:u.dataType});for(let u of t.outputs)i.addOutput({label:u.label,dataType:u.dataType});return i}deserializeNode(t,e,i){let u=i.nodeDefinitions.find(v=>v.id===t.definitionId),m=(()=>{if(u)return e.addNodeByDefinition(u,t.transformation);let v=t.ports.filter(D=>D.direction==="input").map(D=>({dataType:D.dataType,definitionId:D.definitionId,label:D.label,portType:D.portType})),w=t.ports.filter(D=>D.direction==="output").map(D=>({dataType:D.dataType,definitionId:D.definitionId,label:D.label,portType:D.portType}));return new pt(this.mProject,i,e,{definitionId:t.definitionId,ports:{input:v,output:w},label:t.label,transformation:{...t.transformation}})})();m.label=t.label,e.addNode(m);for(let v of t.ports)if(v.portType==="value"&&v.directValue.length>0){let w=m.inputs.map.get(v.definitionId);w&&w.setDirectValue(v.directValue)}return m.preview=t.preview??null,m}};var ie=class{constructor(){}serialize(t){return{functions:[...t.functions].map(e=>this.serializeFunction(e))}}serializeFunction(t){let e=new Map;[...t.nodes].forEach((w,D)=>{e.set(w,`n${D}`)});let i=[...t.nodes].map(w=>this.serializeNode(w,e.get(w))),u=[];for(let w of t.nodes){let D=e.get(w);for(let S of w.outputs.list)for(let l of S.connectedPorts){let r=e.get(l.node);u.push({sourceNodeId:D,sourcePortId:S.definitionId,targetNodeId:r,targetPortId:l.definitionId})}}let m=t.inputs.map(w=>({label:w.label,dataType:w.dataType})),v=t.outputs.map(w=>({label:w.label,dataType:w.dataType}));return{id:t.id,label:t.label,isSystem:t.isSystem,definitionId:t.definitionId,inputs:m,outputs:v,imports:[...t.imports],nodes:i,connections:u}}serializeNode(t,e){let i=[...t.inputs.list,...t.outputs.list].map(m=>({definitionId:m.definitionId,label:m.label,direction:m.direction,portType:m.portType,dataType:m.portType==="value"?m.dataType:null,directValue:[...m.directValue]})),u=t.preview?{portDefinitionId:t.preview.portDefinitionId,displayId:t.preview.displayId}:null;return{id:e,definitionId:t.definitionId,label:t.label,transformation:{...t.transformation},ports:i,preview:u}}};var Nr=`:host {   \r
    /* Font */\r
    --potatno-font-size: 1rem;\r
    --potatno-font-size-big: 1.12rem;\r
    --potatno-font-size-small: 0.9rem;\r
    --potatno-font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;\r
\r
    /* Main colors */\r
    --potatno-color-background: #232323;\r
    --potatno-color-background-dark: #1c1c1c;\r
    --potatno-color-background-light: #313131;\r
    --potatno-color-text: #c8c8c8;\r
    --potatno-color-text-contrast: #ffffff;\r
    --potatno-color-accent: #20be20;\r
\r
    /* Border settings. */\r
    --potatno-border-radius: 4px;\r
    --potatno-color-border: #353535;\r
\r
    /* Supporting colors */\r
    --potatno-color-error: #ff5555;\r
    --potatno-color-shadow: rgba(16, 16, 16, 0.80);\r
\r
    /* Scrollbar */\r
    --potatno-color-scrollbar-thumb: #5e5e5e;\r
    --potatno-color-scrollbar-track: transparent;\r
\r
    /* Shared animations */\r
    --potatno-connection-animation: 1.3s;\r
    --potatno-position-snap-animation: top 0.1s cubic-bezier(0, 1.5, 1, 1), left 0.1s cubic-bezier(0, 1.5, 1, 1);\r
}`;var Ye=class y{static PASTE_OFFSET=2;mClipboardNodes;mManager;constructor(t){this.mManager=t,this.mClipboardNodes=new Array}copy(t){if(t.size===0)return;let e=[...t],i=new Map;for(let u=0;u<e.length;u++){let m=e[u],v=m.inputs.value.map(D=>({definitionId:D.definitionId,values:[...D.directValue]})),w={...m.transformation};w.x+=y.PASTE_OFFSET,w.y+=y.PASTE_OFFSET,i.set(m,{connections:new Array,definitionId:m.definitionId,id:u,portDirectValues:v,label:m.label,transformation:w})}for(let[u,m]of i)for(let v of u.outputs.list)for(let w of v.connectedPorts){let D=i.get(w.node);D&&m.connections.push({sourcePortName:v.definitionId,targetNodeId:D.id,targetPortName:w.definitionId})}this.mClipboardNodes=[...i.values()]}deconstruct(){}paste(){if(this.mClipboardNodes.length===0)return new Array;let t=this.mManager.activeFunction,e=new Map;for(let i of this.mClipboardNodes){let u=t.dynamicNodeDefinitions.find(v=>v.id===i.definitionId);if(!u)continue;let m=this.mManager.graph.addNode(t,u,i.transformation);this.mManager.graph.updateNode(m,v=>{v.label=i.label;for(let w of i.portDirectValues)v.inputs.map.has(w.definitionId)&&v.inputs.map.get(w.definitionId).setDirectValue(w.values)}),e.set(i.id,m)}for(let i of this.mClipboardNodes){let u=e.get(i.id);if(u)for(let m of i.connections){let v=e.get(m.targetNodeId);if(!v)continue;let w=u.outputs.map.get(m.sourcePortName),D=v.inputs.map.get(m.targetPortName);!w||!D||this.mManager.graph.connectPorts(w,D)}}return[...e.values()]}};var We=class extends me{mGridNodeArea;mGridPaths;mNodeArea;mPathArea;constructor(){super(),this.mGridNodeArea=new WeakMap,this.mNodeArea=new Map,this.mGridPaths=new WeakMap,this.mPathArea=new Map}clear(t){t==="all"&&this.mNodeArea.clear(),this.mPathArea.clear()}getPath(t,e){let i=t.direction==="input"&&t.portType==="value"||t.direction==="output"&&t.portType==="flow"?t:e;return this.mGridPaths.get(i)??new Array}removeNodeArea(t){if(!this.mGridNodeArea.has(t))return;let e=this.mGridNodeArea.get(t);for(let i of e){let u=(this.mNodeArea.get(i)??0)-1;u<1?this.mNodeArea.delete(i):this.mNodeArea.set(i,u)}this.mGridNodeArea.delete(t)}updateNodeArea(t){this.removeNodeArea(t);let e=t.transformation.x,i=t.transformation.y,u=t.transformation.width,m=t.transformation.height,v=t.function.nodeDefinitions.find(D=>D.id===t.definitionId);if(v)switch(v.id){case xt.DEFINITION_ID:return;case et.DEFINITION_ID:case K.DEFINITION_ID:break;default:m+=1,m+=t.preview!==null?7:0}let w=new Array;for(let D=0;D<u;D++)for(let S=0;S<m;S++){let l=`${D+e}|${S+i}`,r=(this.mNodeArea.get(l)??0)+1;this.mNodeArea.set(l,r),w.push(l)}this.mGridNodeArea.set(t,w)}updatePath(t,e,i){if(t.direction==="input"&&t.portType!=="value"||t.direction==="output"&&t.portType!=="flow")throw new A("Start port must be an input-value or an output-flow node.",this);this.removePathArea(t);let u=this.start(e,i);this.mGridPaths.set(t,u.path);let m=this.nodeId(e),v=this.nodeId(i);for(let w of u.path){let D=this.nodeId(w),S=this.mPathArea.has(D)?this.mPathArea.get(D):{ports:new Map,entryPoints:new Set};S.ports.set(t,[m,v]),S.entryPoints.add(m),S.entryPoints.add(v),this.mPathArea.set(D,S)}}costOfTraversal(t,e){let i=this.nodeId(t),u=1;this.mNodeArea.has(i)&&t!==e.endNode&&(u*=20);let m=e.path.next().value;if(this.mPathArea.has(i)){let l=this.mPathArea.get(i),r=this.nodeId(e.startNode),h=this.nodeId(e.endNode);if(l.entryPoints.has(r)||l.entryPoints.has(h))u*=.2;else if(u*=5,m){let c=this.nodeId(m);this.mPathArea.has(c)&&(u*=20)}}if(m){let l=t.y===m.y;(t===e.endNode||m===e.startNode)&&!l&&(u*=100);let r=e.path.next().value;r&&(t.x===r.x||t.y===r.y)&&(u*=.7)}let v=Math.abs(t.x-e.startNode.x),w=Math.abs(t.x-e.endNode.x),D=v<=w;(D&&t.y===e.startNode.y||!D&&t.y===e.endNode.y)&&(u*=.5);let S=e.endNode.x+e.startNode.x>>1;return t.x===S&&(u*=.5),u}heuristic(t,e){return(Math.abs(t.x-e.endNode.x)+Math.abs(t.y-e.endNode.y))*.5}neighborNodes(t){return[{x:t.x,y:t.y-1},{x:t.x-1,y:t.y},{x:t.x+1,y:t.y},{x:t.x,y:t.y+1}]}nodeId(t){return`${t.x}|${t.y}`}removePathArea(t){if(!this.mGridPaths.has(t))return;let e=this.mGridPaths.get(t);for(let i of e){let u=this.nodeId(i),m=this.mPathArea.get(u);if(!m)continue;let v=m.ports.get(t);v&&(m.ports.delete(t),m.entryPoints.delete(v[0]),m.entryPoints.delete(v[1]),m.ports.size===0?this.mPathArea.delete(u):this.mPathArea.set(u,m))}this.mGridPaths.delete(t)}};var Ze=class{mManager;mPathFinder;constructor(t){this.mManager=t,this.mPathFinder=new We;let e=0,i=()=>{e>0&&globalThis.cancelAnimationFrame(e),globalThis.requestAnimationFrame(()=>{this.updatePaths()})};this.mManager.subscribe(R.Node|R.SpecialActiveFunction,u=>{if((u.changeType&R.SpecialActiveFunction)>0){this.mPathFinder.clear("all");for(let m of this.mManager.activeFunction.nodes)this.mPathFinder.updateNodeArea(m);i();return}(u.changeType&R.Node)>0&&((u.changeType&R.NodeDelete)>0?this.mPathFinder.removeNodeArea(u.item):this.mPathFinder.updateNodeArea(u.item)),i()}),this.mManager.subscribe(R.Connection,()=>{i()})}createTemporaryPath(t,e){let i=w=>w instanceof it?this.getPortGridPoint(w):w,u=i(t),m=i(e),v=this.mPathFinder.start(u,m).path;return{attributeValue:this.createSvgPath(v),length:v.length}}deconstruct(){}getConnectionPath(t,e){let i=this.mPathFinder.getPath(t,e);return{attributeValue:this.createSvgPath(i),length:i.length-2}}getPortGridPoint(t){let e=t.node,i=t.direction==="input"?e.inputs.list:e.outputs.list,u=(()=>{for(let w=0;w<i.length;w++)if(i[w]===t)return w;return 0})(),m=t.direction==="input"?e.transformation.x:e.transformation.x+e.transformation.width-1,v=1;return(e.definitionId===K.DEFINITION_ID||e.definitionId===et.DEFINITION_ID)&&(v=0),{y:e.transformation.y+v+u,x:m}}createGridCellPath(t,e,i){let u=this.getGridPosition(t,e),m=this.getGridPosition(t,i),v={x:e==="bottom"||e==="top"?u.x:m.x,y:e==="left"||e==="right"?u.y:m.y};return`Q ${v.x},${v.y} ${m.x},${m.y}`}createPath(t,e){let i=t.direction==="input"&&t.portType==="value"||t.direction==="output"&&t.portType==="flow"?t:e,u=t,m=e;u.direction!=="output"&&([m,u]=[u,m]);let v=this.getPortGridPoint(u),w=this.getPortGridPoint(m);this.mPathFinder.updatePath(i,v,w)}createSvgPath(t){if(t.length<2)return"";let e=(m,v)=>{let w=v.x-m.x,D=v.y-m.y;switch(!0){case(w===0&&D===1):return"bottom";case(w===0&&D===-1):return"top";case(w===-1&&D===0):return"left";case(w===1&&D===0):return"right";default:throw new A("Missformed path. Path points are not directly next to each other.",this)}},i=this.getGridPosition(t[0],e(t[0],t[1])),u=`M ${i.x},${i.y}`;for(let m=1;m<t.length-1;m++){let v=t[m],w=t[m-1],D=t[m+1],S=e(v,w),l=e(v,D);u+=this.createGridCellPath(v,S,l)}return u}getGridPosition(t,e){let i={x:t.x*this.mManager.grid.gridSize+this.mManager.grid.gridSize/2,y:t.y*this.mManager.grid.gridSize+this.mManager.grid.gridSize/2},u=this.mManager.grid.gridSize/2;switch(e){case"top":i.y-=u;break;case"right":i.x+=u;break;case"bottom":i.y+=u;break;case"left":i.x-=u;break}return i}updatePaths(){this.mPathFinder.clear("path");for(let t of this.mManager.activeFunction.nodes){for(let e of t.outputs.flow){let i=e.connectedPorts.values().next().value;i&&this.createPath(e,i)}for(let e of t.inputs.value){let i=e.connectedPorts.values().next().value;i&&this.createPath(e,i)}}}};var qe=class{mDocument;mManager;get document(){return this.mDocument}constructor(t){this.mManager=t,this.mDocument=new Vt(t.project),this.mDocument.validate()}addFunction(t){let e=this.mDocument;if(!e||!e.project.userFunctions.has(t))return;let i=new lt(e.project,e,{definitionId:t,id:crypto.randomUUID(),isSystem:!1,label:`Function_${e.functions.length}`});e.addFunction(i),e.validate(),this.mManager.dispatch(R.FunctionAdd,i),this.mManager.setActiveFunction(i)}addNode(t,e,i){let u=t.addNodeByDefinition(e,i);return this.mManager.dispatch(R.NodeAdd,u),u}connectPorts(t,e){try{t.connect(e)}catch{return!1}return this.mManager.dispatch(R.ConnectionAdd,t),this.mManager.dispatch(R.ConnectionAdd,e),!0}deconstruct(){}disconnectPorts(t,e){t.disconnect(e),this.mManager.dispatch(R.ConnectionDelete,t),this.mManager.dispatch(R.ConnectionDelete,e)}mergeConnectPorts(t,e){if(t.length===0||e.length===0)return;let i=this.mManager.connections.getPortGridPoint(t[0]),u=this.priorizePorts(i,e);for(let m of u)for(let v of t)if(this.connectPorts(m,v))return}priorizePorts(t,e){if(e.length===0)return new Array;let i=this.mManager.connections.getPortGridPoint(e[0]);return e.toSorted((u,m)=>{let v=u.connectedPorts.size===0,w=m.connectedPorts.size===0;if(v!==w)return v?-1:1;let D=i.x>t.x?"input":"output",S=u.direction===D,l=m.direction===D;return S!==l?S?-1:1:0})}removeFunction(t){let e=this.mDocument;if(!e)return;let i=null;for(let u of e.functions)if(u.id===t){i=u,e.removeFunction(u);break}i&&(this.mManager.dispatch(R.FunctionDelete,i),this.setDefaultActiveFunction())}removeNode(t){if(t.definitionId===K.DEFINITION_ID||t.definitionId===et.DEFINITION_ID){let e=t.inputs.list[0],i=t.outputs.list[0];for(let u of e.connectedPorts)for(let m of i.connectedPorts)this.mManager.graph.connectPorts(u,m)}t.function.removeNode(t),this.mManager.dispatch(R.NodeDelete,t)}setDocument(t){this.mDocument=t,this.mDocument.validate(),this.mManager.dispatch(R.Document,this.mDocument),this.setDefaultActiveFunction()}setPortDirectValue(t,e){t.setDirectValue(e),this.mManager.dispatch(R.NodeUpdate,t.node)}transformNode(t,e){if(!t)return;let i=structuredClone(t.transformation);e(t),!(i.width===t.transformation.width&&i.height===t.transformation.height&&i.x===t.transformation.x&&i.y===t.transformation.y)&&this.mManager.dispatch(R.NodeTransform,t)}updateFunction(t,e){t&&(e(t),this.mManager.dispatch(R.FunctionUpdate,t))}updateNode(t,e){t&&(e(t),this.mManager.dispatch(R.NodeUpdate,t))}setDefaultActiveFunction(){if(!this.mDocument||this.mDocument.functions.length===0)return;let t=(()=>{let e=[...this.mDocument.functions],i=e.find(u=>u.id===this.mManager.activeFunction.id);return i||e[0]})();this.mManager.activeFunction!==t&&this.mManager.setActiveFunction(t)}};var Je=class y{static GRID_SIZE_PX=32;static MAX_ZOOM=5;static MIN_ZOOM=.1;mDraggedPortInformation;mGridElement;mGridPositions;mManager;mSelectedNodes;mTransformation;get draggedPort(){return this.mDraggedPortInformation}set gridElement(t){this.mGridElement=t}get gridSize(){return y.GRID_SIZE_PX}get panX(){return this.mTransformation.panX}get panY(){return this.mTransformation.panY}get selectedNodes(){return this.mSelectedNodes}get zoom(){return this.mTransformation.zoom}constructor(t){this.mManager=t,this.mGridElement=null,this.mDraggedPortInformation=new Ke(this.mManager,[]),this.mGridPositions=new WeakMap,this.mSelectedNodes=new Set,this.mTransformation={panX:0,panY:0,zoom:1};let e=document.createElement("span");e.textContent="M",e.style.display="inline-block",e.style.position="fixed",e.style.top="0",e.style.left="0",e.style.visibility="hidden",e.style.pointerEvents="none",document.documentElement.appendChild(e),this.mManager.subscribe(R.SpecialActiveFunction,()=>{this.mGridPositions.has(this.mManager.activeFunction)||this.mGridPositions.set(this.mManager.activeFunction,{panX:0,panY:0,zoom:1}),this.mTransformation=this.mGridPositions.get(this.mManager.activeFunction);let i=Array.from(this.mSelectedNodes).filter(u=>u.function!==this.mManager.activeFunction);for(let u of i)this.mSelectedNodes.delete(u)})}deconstruct(){}gridPixelSpaceToGridSpace(t,e){let i=t.x/this.gridSize,u=t.y/this.gridSize;return e&&(i=Math.floor(i),u=Math.floor(u)),{x:i,y:u}}pan(t,e){this.mTransformation.panX+=t,this.mTransformation.panY+=e,this.mManager.dispatch(R.SpecialGrid,null)}pixelToGridPixelSpace(t,e){let i=t,u=e;if(this.mGridElement){let m=this.mGridElement.getBoundingClientRect();i-=m.left,u-=m.top}return{x:(i-this.mTransformation.panX)/this.mTransformation.zoom,y:(u-this.mTransformation.panY)/this.mTransformation.zoom}}pixelToGridSpace(t,e){return this.gridPixelSpaceToGridSpace(this.pixelToGridPixelSpace(t,e),!0)}selectNodes(t,e=!1){if(this.mSelectedNodes.clear(),t.length===0){this.mManager.dispatch(R.SpecialSelectNode,null);return}let i=null;for(let u of t){if(i===null&&(i=u.function),i!==u.function)throw new A("Selected nodes must be of the same function",this);this.mSelectedNodes.add(u)}if(this.mManager.activeFunction!==i&&this.mManager.setActiveFunction(i),e){let u={top:1/0,right:-1/0,bottom:-1/0,left:1/0};for(let w of t){let D=w.transformation.y;D<u.top&&(u.top=D);let S=w.transformation.x+w.transformation.width;S>u.right&&(u.right=S);let l=w.transformation.y+w.transformation.height;l>u.bottom&&(u.bottom=l);let r=w.transformation.x;r<u.left&&(u.left=r)}this.mGridPositions.has(i)||this.mGridPositions.set(i,{panX:0,panY:0,zoom:1});let m=this.mGridPositions.get(i),v=this.mGridElement?.getBoundingClientRect();if(!v)return;m.panX=v.width/2,m.panX-=(u.left+(u.right-u.left)/2)*this.gridSize*m.zoom,m.panY=v.height/2,m.panY-=(u.top+(u.bottom-u.top)/2)*this.gridSize*m.zoom}this.mManager.dispatch(R.SpecialSelectNode,null)}setDraggingPort(t){this.mDraggedPortInformation=new Ke(this.mManager,t)}zoomAt(t,e,i){let u=this.mTransformation.zoom,m=1+i,v=this.mTransformation.zoom*m;v=Math.max(y.MIN_ZOOM,Math.min(y.MAX_ZOOM,v));let w=(t-this.mTransformation.panX)/u,D=(e-this.mTransformation.panY)/u;this.mTransformation.zoom=v,this.mTransformation.panX=t-w*this.mTransformation.zoom,this.mTransformation.panY=e-D*this.mTransformation.zoom,this.mManager.dispatch(R.SpecialGrid,null)}},Ke=class{mManager;mPointerGridPosition;mPortPositions;mPorts;get isDragging(){return this.mPorts.size>0}get portPositions(){return this.mPortPositions}get ports(){return[...this.mPorts]}constructor(t,e){this.mManager=t,this.mPorts=new Set(e),this.mPointerGridPosition={x:1/0,y:1/0},this.mPortPositions=new Map;for(let i of e){let u=this.mManager.connections.getPortGridPoint(i);i.direction==="output"&&(u.x+=1),this.mPortPositions.set(i,{x:u.x,y:u.y})}}hasPort(t){return t?this.mPorts.has(t):!1}updatePointer(t,e){let i=this.mManager.grid.pixelToGridSpace(t,e);return i.x===this.mPointerGridPosition.x&&i.y===this.mPointerGridPosition.y?!1:(this.mPointerGridPosition.x=i.x,this.mPointerGridPosition.y=i.y,!0)}};var Qe=class y{static MAX_HISTORY_ITEMS=100;mManager;mSnapshotIndex;mSnapshots;get canRedo(){return this.mSnapshotIndex<this.mSnapshots.length-1}get canUndo(){return this.mSnapshotIndex>0}constructor(t){this.mManager=t,this.mSnapshotIndex=-1,this.mSnapshots=new Array;let e=0;this.mManager.subscribe(R.Any,()=>{globalThis.clearTimeout(e),e=globalThis.setTimeout(()=>{this.pushHistory()},300)})}clear(){this.mSnapshots.length=0,this.mSnapshotIndex=-1}deconstruct(){}redo(){if(!this.canRedo)return;let t=this.mSnapshots[++this.mSnapshotIndex],e=JSON.parse(t);this.restoreHistory(e)}undo(){if(!this.canUndo)return;let t=this.mSnapshots[--this.mSnapshotIndex],e=JSON.parse(t);this.restoreHistory(e)}pushHistory(){let t=new ie().serialize(this.mManager.graph.document),e=JSON.stringify(t);this.mSnapshotIndex>=0&&this.mSnapshots[this.mSnapshotIndex]===e||(this.mSnapshots.splice(this.mSnapshotIndex+1),this.mSnapshotIndex=this.mSnapshots.push(e)-1,this.mSnapshots.length>y.MAX_HISTORY_ITEMS&&(this.mSnapshots.shift(),this.mSnapshotIndex--))}restoreHistory(t){this.mManager.graph.setDocument(new ne(this.mManager.project).deserialize(t))}};var ke=class{mErrorItems;mErrorList;mIsDirty;mManager;get errorItems(){return this.mIsDirty&&this.revalidate(),this.mErrorItems}get errors(){return this.mIsDirty&&this.revalidate(),this.mErrorList}get isValid(){return this.mIsDirty&&this.revalidate(),this.mErrorItems.size===0}constructor(t){this.mManager=t,this.mErrorList=new Array,this.mErrorItems=new Set,this.mIsDirty=!0;let e=0,i=R.Connection|R.Document|R.Function|R.NodeAdd|R.NodeUpdate|R.NodeDelete|R.Port;this.mManager.subscribe(i,()=>{this.mIsDirty=!0,globalThis.clearTimeout(e),e=globalThis.setTimeout(()=>{this.mIsDirty&&(this.revalidate(),this.mIsDirty=!1)},1e3)})}deconstruct(){}revalidate(){this.mIsDirty=!1,this.mErrorList.splice(0,this.mErrorList.length),this.mErrorItems.clear();let t=this.mManager.graph.document.validate();for(let e of t.errors)switch(this.mErrorItems.add(e.item),!0){case e.item instanceof it:{this.mErrorList.push({location:e.item.node,message:e.message});break}case e.item instanceof pt:{this.mErrorList.push({location:e.item,message:e.message});break}case e.item instanceof lt:{this.mErrorList.push({location:e.item,message:e.message});break}}for(let e of t.affectedItems)switch(!0){case e instanceof it:{this.mManager.dispatch(R.PortAdd|R.PortUpdate,e),this.mManager.dispatch(R.NodeUpdate,e.node);break}case e instanceof pt:{this.mManager.dispatch(R.NodeAdd|R.NodeUpdate|R.NodeTransform,e);break}case e instanceof lt:{this.mManager.dispatch(R.FunctionAdd|R.FunctionUpdate,e);break}}this.mManager.dispatch(R.SpecialValidation,null)}};var to=class{mDriverElementBigEnough;mDriverElementVisible;mDriverElements;mDriverList;mDrivers;mElementDriver;mManager;mPreviewIntersection;constructor(t){this.mManager=t,this.mDriverList=new Array,this.mDrivers=new WeakMap,this.mDriverElementVisible=new WeakMap,this.mDriverElementBigEnough=new WeakMap,this.mDriverElements=new WeakMap,this.mElementDriver=new WeakMap,this.mManager.subscribe(R.Document,()=>{this.mDriverList.splice(0,this.mDriverList.length)});let e=0,i=R.Connection|R.Function|R.NodeAdd|R.NodeDelete|R.NodeUpdate;this.mManager.subscribe(i,()=>{globalThis.clearTimeout(e),e=globalThis.setTimeout(()=>this.refresh(),1e3)});let u=0;this.mManager.subscribe(R.SpecialGrid|R.ProgrammResize,()=>{globalThis.clearTimeout(u),u=globalThis.setTimeout(()=>{for(let m of this.mDriverList){let v=m.deref();if(!v)continue;let w=v.element.getBoundingClientRect();this.mDriverElementBigEnough.set(v,!(w.width<30||w.height<30))}},300)}),this.mPreviewIntersection=new IntersectionObserver(m=>{for(let v of m){let w=this.mElementDriver.get(v.target);if(!w)continue;let D=w.deref();D&&this.mDriverElementVisible.set(D,v.isIntersecting)}})}deconstruct(){}execute(){for(let t of this.mDriverList){let e=t.deref();if(e&&this.mDriverElementVisible.get(e)!==!1&&this.mDriverElementBigEnough.get(e)!==!1)try{e.execute()}catch(i){console.error("[PotatnoUiManagerPreview] Driver render failed:",i)}}}refresh(){if(this.mManager.integrity.isValid)for(let t=this.mDriverList.length-1;t>=0;t--){let e=this.mDriverList[t].deref();if(!e){this.unregister(this.mDriverList[t]);continue}e.refresh()}}requestDriver(t,e){let i=this.mDrivers.get(t);if(i&&i.display.id===e)return i;i&&this.unregister(this.mElementDriver.get(i.element));let u=t.project.preview.getDisplay(e);if(!u)throw new A(`Preview has no display for "${e}".`,this);let m=u.createDriver(t);return this.register(t,m),this.mManager.integrity.isValid&&m.refresh(),m}register(t,e){this.mDrivers.set(t,e);let i=new WeakRef(e);this.mDriverList.push(i);let u=e.element;this.mDriverElements.set(i,u),this.mElementDriver.set(u,i),this.mPreviewIntersection.observe(u)}unregister(t){let e=this.mDriverList.indexOf(t);if(e===-1)return;this.mDriverList.splice(e,1);let i=this.mDriverElements.get(t);i&&this.mPreviewIntersection.unobserve(i)}};var H=class extends EventTarget{mActiveFunction;mClipboard;mConnections;mEventBuffer;mEventBufferDispatchRequest;mGraph;mGrid;mHistory;mIntegrity;mPreview;mProject;get activeFunction(){return this.mActiveFunction}get clipboard(){return this.mClipboard}get connections(){return this.mConnections}get graph(){return this.mGraph}get grid(){return this.mGrid}get history(){return this.mHistory}get integrity(){return this.mIntegrity}get preview(){return this.mPreview}get project(){return this.mProject}constructor(t){super(),this.mProject=t,this.mEventBuffer=new Map,this.mEventBufferDispatchRequest=-1,this.mIntegrity=new ke(this),this.mConnections=new Ze(this),this.mHistory=new Qe(this),this.mPreview=new to(this),this.mGrid=new Je(this),this.mClipboard=new Ye(this),this.mGraph=new qe(this),this.mActiveFunction=this.mGraph.document.functions.at(0)}deconstruct(){this.mIntegrity.deconstruct(),this.mConnections.deconstruct(),this.mHistory.deconstruct(),this.mPreview.deconstruct(),this.mGrid.deconstruct(),this.mClipboard.deconstruct(),this.mGraph.deconstruct()}dispatch(t,e){let i=this.mEventBuffer.get(e)??0;this.mEventBuffer.set(e,i|t),this.mEventBufferDispatchRequest!==-1&&globalThis.cancelAnimationFrame(this.mEventBufferDispatchRequest),this.mEventBufferDispatchRequest=requestAnimationFrame(()=>{this.mEventBufferDispatchRequest=-1;for(let[u,m]of this.mEventBuffer)this.dispatchEvent(new _e(m,u));this.mEventBuffer.clear()})}generateStringColor(t){let e=(()=>{let u=0;for(let m=0;m<t.length;m++)u=t.charCodeAt(m)+((u<<5)-u);return u})();return`hsl(${Math.abs(e)*137.508%360}, 70%, 60%)`}setActiveFunction(t){this.mGraph.document.functions.find(i=>i===t)&&(this.mActiveFunction=t,this.dispatch(R.SpecialActiveFunction,t))}subscribe(t,e){let i=u=>{t!==R.Any&&(u.changeType&t)===0||e(u)};return this.addEventListener(_e.EVENT_TYPE,i),()=>{this.removeEventListener(_e.EVENT_TYPE,i)}}},R={Any:268435455,Connection:15,ConnectionAdd:1,ConnectionUpdate:2,ConnectionDelete:4,Document:240,Function:3840,FunctionAdd:256,FunctionUpdate:512,FunctionDelete:1024,Node:61440,NodeAdd:4096,NodeUpdate:8192,NodeDelete:16384,NodeTransform:32768,Port:983040,PortAdd:65536,PortUpdate:131072,PortDelete:262144,Special:15728640,SpecialActiveFunction:1048576,SpecialGrid:2097152,SpecialValidation:4194304,SpecialSelectNode:8388608},_e=class y extends Event{static EVENT_TYPE="PotatnoUiManagerChangeEvent";mChangeType;mEventItem;get changeType(){return this.mChangeType}get item(){return this.mEventItem}constructor(t,e){super(y.EVENT_TYPE),this.mChangeType=t,this.mEventItem=e}};var Lr=`:host {\r
    --button-accent-color: red;\r
    --button-text-color: red;\r
    --button-border-color: red;\r
    --button-border-radius: 4px;\r
    --button-background-color: red;\r
\r
    position: relative;\r
    box-sizing: border-box;\r
    display: flex;\r
    align-items: center;\r
    justify-content: center;\r
    cursor: pointer;\r
    user-select: none;\r
\r
    /* Set a default font size the component use for scaling its em values */\r
    font-size: 1rem;\r
\r
    /* Shared box. Transparent border keeps every type the same size. */\r
    padding: 0.4em 0.75em;\r
    border: 1px solid transparent;\r
    border-radius: var(--button-border-radius);\r
    color: var(--button-text-color);\r
    background-color: transparent;\r
\r
    /* Smooth transition for all */\r
    transition: border-color 0.15s, color 0.15s, background-color 0.15s, scale 0.15s;\r
}\r
\r
/*\r
 * Primary & Secondary starting differences.\r
 */\r
:host([type=primary]) {\r
    border-color: var(--button-border-color);\r
    background-color: var(--button-background-color);\r
}\r
\r
:host([type=secondary]) {\r
    /* Background animation */\r
    background-color: transparent;\r
    border-color: transparent;\r
}\r
\r
.button {\r
    box-sizing: border-box;\r
    display: flex;\r
    align-items: center;\r
    justify-content: center;\r
    width: 100%;\r
    height: 100%;\r
    gap: 0.375em;\r
\r
    &::after {\r
        position: absolute;\r
        content: '';\r
        border-radius: var(--button-border-radius);\r
        border: 1px solid var(--button-accent-color);\r
        pointer-events: none;\r
\r
        transition: top 0.15s, right 0.15s, bottom 0.15s, left 0.15s, opacity 0.15s;\r
\r
        /* Animation properties */\r
        opacity: 0;\r
        top: -0.5em;\r
        right: -0.5em;\r
        bottom: -0.5em;\r
        left: -0.5em;\r
    }\r
}\r
\r
/*\r
 * Shared user interactions.\r
 */\r
\r
:host(:hover),\r
:host(:active),\r
:host([selected]:not([selected=false])) {\r
    color: var(--button-accent-color);\r
\r
    .button::after {\r
        opacity: 1;\r
\r
        /* Actual border. */\r
        top: -1px;\r
        right: -1px;\r
        bottom: -1px;\r
        left: -1px;\r
    }\r
}\r
\r
:host(:active) {\r
    scale: 0.98;\r
}\r
\r
:host([selected]:not([selected=false])) {\r
    color: var(--button-text-color);\r
    background-color: color-mix(in srgb, var(--button-accent-color) 30%, transparent);\r
}\r
\r
@keyframes background-animate {\r
    from {\r
        background-position: 0% 0;\r
    }\r
\r
    to {\r
        background-position: 400% 0;\r
    }\r
}`;var Rr=`<div class="button">\r
    $slot\r
</div>\r
`;function kl(){function y(l,r){return function(c){e(r,"addInitializer"),i(c,"An initializer"),l.push(c)}}function t(l,r,h,c,o,b,p,T,x){var d;switch(o){case 1:d="accessor";break;case 2:d="method";break;case 3:d="getter";break;case 4:d="setter";break;default:d="field"}var s={kind:d,name:p?"#"+r:r,static:b,private:p,metadata:T},f={v:!1};s.addInitializer=y(c,f);var n,a;if(o===0?p?(n=h.get,a=h.set):(n=function(){return this[r]},a=function(g){this[r]=g}):o===2?n=function(){return h.value}:((o===1||o===3)&&(n=function(){return h.get.call(this)}),(o===1||o===4)&&(a=function(g){h.set.call(this,g)})),p)s.access=n&&a?{get:n,set:a}:n?{get:n}:{set:a};else{if(n){var I=n;n=function(g){return arguments.length===0&&(g=this),I.call(g)}}if(a){var P=a;a=function(g,_){return arguments.length===1&&(_=g,g=this),P.call(g,_)}}var E=function(g){return r in g};s.access=n&&a?{has:E,get:n,set:a}:n?{has:E,get:n}:{has:E,set:a}}try{return l(x,s)}finally{f.v=!0}}function e(l,r){if(l.v)throw new Error("attempted to call "+r+" after decoration was finished")}function i(l,r){if(typeof l!="function")throw new TypeError(r+" must be a function")}function u(l,r){var h=typeof r;if(l===1){if(h!=="object"||r===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");r.get!==void 0&&i(r.get,"accessor.get"),r.set!==void 0&&i(r.set,"accessor.set"),r.init!==void 0&&i(r.init,"accessor.init")}else if(h!=="function"){var c;throw l===0?c="field":l===10?c="class":c="method",new TypeError(c+" decorators must return a function or void 0")}}function m(l,r,h,c,o,b,p,T,x){var d=h[0],s,f,n;p?o===0||o===1?s={get:h[3],set:h[4]}:o===3?s={get:h[3]}:o===4?s={set:h[3]}:s={value:h[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(r,c)),o===1?n={get:s.get,set:s.set}:o===2?n=s.value:o===3?n=s.get:o===4&&(n=s.set);var a,I,P;if(typeof d=="function")a=t(d,c,s,T,o,b,p,x,n),a!==void 0&&(u(o,a),o===0?f=a:o===1?(f=a.init,I=a.get||n.get,P=a.set||n.set,n={get:I,set:P}):n=a);else for(var E=d.length-1;E>=0;E--){var g=d[E];if(a=t(g,c,s,T,o,b,p,x,n),a!==void 0){u(o,a);var _;o===0?_=a:o===1?(_=a.init,I=a.get||n.get,P=a.set||n.set,n={get:I,set:P}):n=a,_!==void 0&&(f===void 0?f=_:typeof f=="function"?f=[f,_]:f.push(_))}}if(o===0||o===1){if(f===void 0)f=function(M,C){return C};else if(typeof f!="function"){var F=f;f=function(M,C){for(var N=C,L=0;L<F.length;L++)N=F[L].call(M,N);return N}}else{var j=f;f=function(M,C){return j.call(M,C)}}l.push(f)}o!==0&&(o===1?(s.get=n.get,s.set=n.set):o===2?s.value=n:o===3?s.get=n:o===4&&(s.set=n),p?o===1?(l.push(function(M,C){return n.get.call(M,C)}),l.push(function(M,C){return n.set.call(M,C)})):o===2?l.push(n):l.push(function(M,C){return n.call(M,C)}):Object.defineProperty(r,c,s))}function v(l,r,h){for(var c=[],o,b,p=new Map,T=new Map,x=0;x<r.length;x++){var d=r[x];if(Array.isArray(d)){var s=d[1],f=d[2],n=d.length>3,a=s>=5,I,P;if(a?(I=l,s=s-5,b=b||[],P=b):(I=l.prototype,o=o||[],P=o),s!==0&&!n){var E=a?T:p,g=E.get(f)||0;if(g===!0||g===3&&s!==4||g===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!g&&s>2?E.set(f,s):E.set(f,!0)}m(c,I,d,f,s,a,n,P,h)}}return w(c,o),w(c,b),c}function w(l,r){r&&l.push(function(h){for(var c=0;c<r.length;c++)r[c].call(h);return h})}function D(l,r,h){if(r.length>0){for(var c=[],o=l,b=l.name,p=r.length-1;p>=0;p--){var T={v:!1};try{var x=r[p](o,{kind:"class",name:b,addInitializer:y(c,T),metadata:h})}finally{T.v=!0}x!==void 0&&(u(10,x),o=x)}return[S(o,h),function(){for(var d=0;d<c.length;d++)c[d].call(o)}]}}function S(l,r){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:r})}return function(r,h,c,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var p=Object.create(b===void 0?null:b),T=v(r,h,p);return c.length||S(r,p),{e:T,get c(){return D(r,c,p)}}}}function Br(y,t,e,i){return(Br=kl())(y,t,e,i)}var $r,Or,Gr,Ur,Hr,Xr,Fr,zr,jr,Mt;$r=U({selector:"kg-button",template:Rr,style:Lr}),Gr=V.state(),Ur=V.state(),Hr=B(),Xr=B();var Vr=class{static{({e:[Fr,zr,jr],c:[Mt,Or]}=Br(this,[[Gr,1,"mSelected"],[Ur,1,"mType"],[Hr,3,"selected"],[Xr,3,"type"]],[$r]))}constructor(){this.mType="primary",this.mSelected=!1}#t=(jr(this),Fr(this));get mSelected(){return this.#t}set mSelected(t){this.#t=t}#e=zr(this);get mType(){return this.#e}set mType(t){this.#e=t}get selected(){return this.mSelected}set selected(t){this.mSelected=this.parseBoolean(t)}get type(){return this.mType}set type(t){if(t!=="primary"&&t!=="secondary"){this.mType="secondary";return}this.mType=t}parseBoolean(t){if(typeof t=="string"){if(t==="")return!0;let e=t.toLowerCase();if(e==="true"||e==="false")return e==="true"}return!!t}static{Or()}};var Yr=`:host {\r
    --information-icon-color: red;\r
    --information-icon-background-color: red;\r
    --information-background-color: red;\r
    --information-border-color: red;\r
    --information-border-radius: 4px;\r
    --information-shadow-color: red;\r
\r
    display: inline-block;\r
\r
    /* Set a default font size the component use for scaling its em values */\r
    font-size: 1rem;\r
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
    width: 1.2em;\r
    height: 1.2em;\r
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
    font-size: 1em;\r
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
    top: calc(anchor(bottom) + 0.625em);\r
    left: calc(anchor(left) + 0.625em);\r
\r
    /* Reposition into whichever space is available. */\r
    position-try-fallbacks: --kg-information-bottom-left, --kg-information-top-right, --kg-information-top-left;\r
\r
    z-index: 1;\r
\r
    flex-direction: column;\r
    box-sizing: border-box;\r
    width: max-content;\r
    max-width: 25em;\r
    padding: 1em;\r
\r
    border: 1px solid var(--potatno-color-border);\r
    border-radius: var(--information-border-radius);\r
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
    translate: 0px -0.625em;\r
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
        translate: 0px -1.25em;\r
    }\r
}\r
\r
/* Bottom left: below the icon, extending to the left. */\r
@position-try --kg-information-bottom-left {\r
    top: calc(anchor(bottom) + 0.625em);\r
    right: anchor(right);\r
    bottom: auto;\r
    left: auto;\r
}\r
\r
/* Top right: above the icon, extending to the right. */\r
@position-try --kg-information-top-right {\r
    top: auto;\r
    right: auto;\r
    bottom: calc(anchor(top) + 0.625em);\r
    left: anchor(left);\r
}\r
\r
/* Top left: above the icon, extending to the left. */\r
@position-try --kg-information-top-left {\r
    top: auto;\r
    right: anchor(right);\r
    bottom: calc(anchor(top) + 0.625em);\r
    left: auto;\r
}`;var Wr=`<div class="icon">i</div>\r
<div class="information">\r
    $slot\r
</div>\r
`;function oc(){function y(l,r){return function(c){e(r,"addInitializer"),i(c,"An initializer"),l.push(c)}}function t(l,r,h,c,o,b,p,T,x){var d;switch(o){case 1:d="accessor";break;case 2:d="method";break;case 3:d="getter";break;case 4:d="setter";break;default:d="field"}var s={kind:d,name:p?"#"+r:r,static:b,private:p,metadata:T},f={v:!1};s.addInitializer=y(c,f);var n,a;if(o===0?p?(n=h.get,a=h.set):(n=function(){return this[r]},a=function(g){this[r]=g}):o===2?n=function(){return h.value}:((o===1||o===3)&&(n=function(){return h.get.call(this)}),(o===1||o===4)&&(a=function(g){h.set.call(this,g)})),p)s.access=n&&a?{get:n,set:a}:n?{get:n}:{set:a};else{if(n){var I=n;n=function(g){return arguments.length===0&&(g=this),I.call(g)}}if(a){var P=a;a=function(g,_){return arguments.length===1&&(_=g,g=this),P.call(g,_)}}var E=function(g){return r in g};s.access=n&&a?{has:E,get:n,set:a}:n?{has:E,get:n}:{has:E,set:a}}try{return l(x,s)}finally{f.v=!0}}function e(l,r){if(l.v)throw new Error("attempted to call "+r+" after decoration was finished")}function i(l,r){if(typeof l!="function")throw new TypeError(r+" must be a function")}function u(l,r){var h=typeof r;if(l===1){if(h!=="object"||r===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");r.get!==void 0&&i(r.get,"accessor.get"),r.set!==void 0&&i(r.set,"accessor.set"),r.init!==void 0&&i(r.init,"accessor.init")}else if(h!=="function"){var c;throw l===0?c="field":l===10?c="class":c="method",new TypeError(c+" decorators must return a function or void 0")}}function m(l,r,h,c,o,b,p,T,x){var d=h[0],s,f,n;p?o===0||o===1?s={get:h[3],set:h[4]}:o===3?s={get:h[3]}:o===4?s={set:h[3]}:s={value:h[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(r,c)),o===1?n={get:s.get,set:s.set}:o===2?n=s.value:o===3?n=s.get:o===4&&(n=s.set);var a,I,P;if(typeof d=="function")a=t(d,c,s,T,o,b,p,x,n),a!==void 0&&(u(o,a),o===0?f=a:o===1?(f=a.init,I=a.get||n.get,P=a.set||n.set,n={get:I,set:P}):n=a);else for(var E=d.length-1;E>=0;E--){var g=d[E];if(a=t(g,c,s,T,o,b,p,x,n),a!==void 0){u(o,a);var _;o===0?_=a:o===1?(_=a.init,I=a.get||n.get,P=a.set||n.set,n={get:I,set:P}):n=a,_!==void 0&&(f===void 0?f=_:typeof f=="function"?f=[f,_]:f.push(_))}}if(o===0||o===1){if(f===void 0)f=function(M,C){return C};else if(typeof f!="function"){var F=f;f=function(M,C){for(var N=C,L=0;L<F.length;L++)N=F[L].call(M,N);return N}}else{var j=f;f=function(M,C){return j.call(M,C)}}l.push(f)}o!==0&&(o===1?(s.get=n.get,s.set=n.set):o===2?s.value=n:o===3?s.get=n:o===4&&(s.set=n),p?o===1?(l.push(function(M,C){return n.get.call(M,C)}),l.push(function(M,C){return n.set.call(M,C)})):o===2?l.push(n):l.push(function(M,C){return n.call(M,C)}):Object.defineProperty(r,c,s))}function v(l,r,h){for(var c=[],o,b,p=new Map,T=new Map,x=0;x<r.length;x++){var d=r[x];if(Array.isArray(d)){var s=d[1],f=d[2],n=d.length>3,a=s>=5,I,P;if(a?(I=l,s=s-5,b=b||[],P=b):(I=l.prototype,o=o||[],P=o),s!==0&&!n){var E=a?T:p,g=E.get(f)||0;if(g===!0||g===3&&s!==4||g===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!g&&s>2?E.set(f,s):E.set(f,!0)}m(c,I,d,f,s,a,n,P,h)}}return w(c,o),w(c,b),c}function w(l,r){r&&l.push(function(h){for(var c=0;c<r.length;c++)r[c].call(h);return h})}function D(l,r,h){if(r.length>0){for(var c=[],o=l,b=l.name,p=r.length-1;p>=0;p--){var T={v:!1};try{var x=r[p](o,{kind:"class",name:b,addInitializer:y(c,T),metadata:h})}finally{T.v=!0}x!==void 0&&(u(10,x),o=x)}return[S(o,h),function(){for(var d=0;d<c.length;d++)c[d].call(o)}]}}function S(l,r){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:r})}return function(r,h,c,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var p=Object.create(b===void 0?null:b),T=v(r,h,p);return c.length||S(r,p),{e:T,get c(){return D(r,c,p)}}}}function Jr(y,t,e,i){return(Jr=oc())(y,t,e,i)}var Kr,Zr,Qr;Kr=U({selector:"kg-information",template:Wr,style:Yr});var qr=class{static{({c:[Qr,Zr]}=Jr(this,[],[Kr]))}static{Zr()}};var kr=`:host {\r
    --popup-border-color: red;\r
    --popup-shadow-color: red;\r
    --popup-background-color: red;\r
    --popup-border-radius: 4px;\r
\r
    display: flex;\r
    flex-direction: column;\r
\r
    border: 1px solid var(--popup-border-color);\r
    border-radius: var(--popup-border-radius);\r
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
    /* Set a default font size the component use for scaling its em values */\r
    font-size: 1rem;\r
\r
    /* Animate from hidden and slightly above */\r
    @starting-style {\r
        opacity: 0;\r
        translate: 0px -1.25em;\r
    }\r
}\r
\r
:host([animate=top]) {\r
    @starting-style {\r
        translate: 0px -1.25em;\r
    }\r
}\r
\r
:host([animate=right]) {\r
    @starting-style {\r
        translate: -1.25em 0px;\r
    }\r
}\r
\r
:host([animate=bottom]) {\r
    @starting-style {\r
        translate: 0px 1.25em;\r
    }\r
}\r
\r
:host([animate=right]) {\r
    @starting-style {\r
        translate: 1.25em 0px;\r
    }\r
}`;var tn="$slot";function ic(){function y(l,r){return function(c){e(r,"addInitializer"),i(c,"An initializer"),l.push(c)}}function t(l,r,h,c,o,b,p,T,x){var d;switch(o){case 1:d="accessor";break;case 2:d="method";break;case 3:d="getter";break;case 4:d="setter";break;default:d="field"}var s={kind:d,name:p?"#"+r:r,static:b,private:p,metadata:T},f={v:!1};s.addInitializer=y(c,f);var n,a;if(o===0?p?(n=h.get,a=h.set):(n=function(){return this[r]},a=function(g){this[r]=g}):o===2?n=function(){return h.value}:((o===1||o===3)&&(n=function(){return h.get.call(this)}),(o===1||o===4)&&(a=function(g){h.set.call(this,g)})),p)s.access=n&&a?{get:n,set:a}:n?{get:n}:{set:a};else{if(n){var I=n;n=function(g){return arguments.length===0&&(g=this),I.call(g)}}if(a){var P=a;a=function(g,_){return arguments.length===1&&(_=g,g=this),P.call(g,_)}}var E=function(g){return r in g};s.access=n&&a?{has:E,get:n,set:a}:n?{has:E,get:n}:{has:E,set:a}}try{return l(x,s)}finally{f.v=!0}}function e(l,r){if(l.v)throw new Error("attempted to call "+r+" after decoration was finished")}function i(l,r){if(typeof l!="function")throw new TypeError(r+" must be a function")}function u(l,r){var h=typeof r;if(l===1){if(h!=="object"||r===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");r.get!==void 0&&i(r.get,"accessor.get"),r.set!==void 0&&i(r.set,"accessor.set"),r.init!==void 0&&i(r.init,"accessor.init")}else if(h!=="function"){var c;throw l===0?c="field":l===10?c="class":c="method",new TypeError(c+" decorators must return a function or void 0")}}function m(l,r,h,c,o,b,p,T,x){var d=h[0],s,f,n;p?o===0||o===1?s={get:h[3],set:h[4]}:o===3?s={get:h[3]}:o===4?s={set:h[3]}:s={value:h[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(r,c)),o===1?n={get:s.get,set:s.set}:o===2?n=s.value:o===3?n=s.get:o===4&&(n=s.set);var a,I,P;if(typeof d=="function")a=t(d,c,s,T,o,b,p,x,n),a!==void 0&&(u(o,a),o===0?f=a:o===1?(f=a.init,I=a.get||n.get,P=a.set||n.set,n={get:I,set:P}):n=a);else for(var E=d.length-1;E>=0;E--){var g=d[E];if(a=t(g,c,s,T,o,b,p,x,n),a!==void 0){u(o,a);var _;o===0?_=a:o===1?(_=a.init,I=a.get||n.get,P=a.set||n.set,n={get:I,set:P}):n=a,_!==void 0&&(f===void 0?f=_:typeof f=="function"?f=[f,_]:f.push(_))}}if(o===0||o===1){if(f===void 0)f=function(M,C){return C};else if(typeof f!="function"){var F=f;f=function(M,C){for(var N=C,L=0;L<F.length;L++)N=F[L].call(M,N);return N}}else{var j=f;f=function(M,C){return j.call(M,C)}}l.push(f)}o!==0&&(o===1?(s.get=n.get,s.set=n.set):o===2?s.value=n:o===3?s.get=n:o===4&&(s.set=n),p?o===1?(l.push(function(M,C){return n.get.call(M,C)}),l.push(function(M,C){return n.set.call(M,C)})):o===2?l.push(n):l.push(function(M,C){return n.call(M,C)}):Object.defineProperty(r,c,s))}function v(l,r,h){for(var c=[],o,b,p=new Map,T=new Map,x=0;x<r.length;x++){var d=r[x];if(Array.isArray(d)){var s=d[1],f=d[2],n=d.length>3,a=s>=5,I,P;if(a?(I=l,s=s-5,b=b||[],P=b):(I=l.prototype,o=o||[],P=o),s!==0&&!n){var E=a?T:p,g=E.get(f)||0;if(g===!0||g===3&&s!==4||g===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!g&&s>2?E.set(f,s):E.set(f,!0)}m(c,I,d,f,s,a,n,P,h)}}return w(c,o),w(c,b),c}function w(l,r){r&&l.push(function(h){for(var c=0;c<r.length;c++)r[c].call(h);return h})}function D(l,r,h){if(r.length>0){for(var c=[],o=l,b=l.name,p=r.length-1;p>=0;p--){var T={v:!1};try{var x=r[p](o,{kind:"class",name:b,addInitializer:y(c,T),metadata:h})}finally{T.v=!0}x!==void 0&&(u(10,x),o=x)}return[S(o,h),function(){for(var d=0;d<c.length;d++)c[d].call(o)}]}}function S(l,r){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:r})}return function(r,h,c,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var p=Object.create(b===void 0?null:b),T=v(r,h,p);return c.length||S(r,p),{e:T,get c(){return D(r,c,p)}}}}function rn(y,t,e,i){return(rn=ic())(y,t,e,i)}var nn,en,se;nn=U({selector:"kg-popup",template:tn,style:kr});var on=class{static{({c:[se,en]}=rn(this,[],[nn]))}static{en()}};var sn=`:host {\r
    --resize-box-handle-color: red;\r
    --resize-box-handle-hover-color: red;\r
    --resize-box-handle-size: 5px;\r
\r
    position: relative;\r
    display: flex;\r
    flex-direction: column;\r
\r
    /* Set restrictions to never exeeds bounding restrictions set on the parent component. */\r
    min-height: 100%;\r
    min-width: 100%;\r
}\r
\r
:host([snap]) {\r
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
        border-color: var(--resize-box-handle-hover-color);\r
    }\r
}`;var an=`<!-- In order of top-left clockwise. Needed for styling -->\r
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
<div class="content-container">\r
    $slot\r
</div>`;function lc(){function y(l,r){return function(c){e(r,"addInitializer"),i(c,"An initializer"),l.push(c)}}function t(l,r,h,c,o,b,p,T,x){var d;switch(o){case 1:d="accessor";break;case 2:d="method";break;case 3:d="getter";break;case 4:d="setter";break;default:d="field"}var s={kind:d,name:p?"#"+r:r,static:b,private:p,metadata:T},f={v:!1};s.addInitializer=y(c,f);var n,a;if(o===0?p?(n=h.get,a=h.set):(n=function(){return this[r]},a=function(g){this[r]=g}):o===2?n=function(){return h.value}:((o===1||o===3)&&(n=function(){return h.get.call(this)}),(o===1||o===4)&&(a=function(g){h.set.call(this,g)})),p)s.access=n&&a?{get:n,set:a}:n?{get:n}:{set:a};else{if(n){var I=n;n=function(g){return arguments.length===0&&(g=this),I.call(g)}}if(a){var P=a;a=function(g,_){return arguments.length===1&&(_=g,g=this),P.call(g,_)}}var E=function(g){return r in g};s.access=n&&a?{has:E,get:n,set:a}:n?{has:E,get:n}:{has:E,set:a}}try{return l(x,s)}finally{f.v=!0}}function e(l,r){if(l.v)throw new Error("attempted to call "+r+" after decoration was finished")}function i(l,r){if(typeof l!="function")throw new TypeError(r+" must be a function")}function u(l,r){var h=typeof r;if(l===1){if(h!=="object"||r===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");r.get!==void 0&&i(r.get,"accessor.get"),r.set!==void 0&&i(r.set,"accessor.set"),r.init!==void 0&&i(r.init,"accessor.init")}else if(h!=="function"){var c;throw l===0?c="field":l===10?c="class":c="method",new TypeError(c+" decorators must return a function or void 0")}}function m(l,r,h,c,o,b,p,T,x){var d=h[0],s,f,n;p?o===0||o===1?s={get:h[3],set:h[4]}:o===3?s={get:h[3]}:o===4?s={set:h[3]}:s={value:h[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(r,c)),o===1?n={get:s.get,set:s.set}:o===2?n=s.value:o===3?n=s.get:o===4&&(n=s.set);var a,I,P;if(typeof d=="function")a=t(d,c,s,T,o,b,p,x,n),a!==void 0&&(u(o,a),o===0?f=a:o===1?(f=a.init,I=a.get||n.get,P=a.set||n.set,n={get:I,set:P}):n=a);else for(var E=d.length-1;E>=0;E--){var g=d[E];if(a=t(g,c,s,T,o,b,p,x,n),a!==void 0){u(o,a);var _;o===0?_=a:o===1?(_=a.init,I=a.get||n.get,P=a.set||n.set,n={get:I,set:P}):n=a,_!==void 0&&(f===void 0?f=_:typeof f=="function"?f=[f,_]:f.push(_))}}if(o===0||o===1){if(f===void 0)f=function(M,C){return C};else if(typeof f!="function"){var F=f;f=function(M,C){for(var N=C,L=0;L<F.length;L++)N=F[L].call(M,N);return N}}else{var j=f;f=function(M,C){return j.call(M,C)}}l.push(f)}o!==0&&(o===1?(s.get=n.get,s.set=n.set):o===2?s.value=n:o===3?s.get=n:o===4&&(s.set=n),p?o===1?(l.push(function(M,C){return n.get.call(M,C)}),l.push(function(M,C){return n.set.call(M,C)})):o===2?l.push(n):l.push(function(M,C){return n.call(M,C)}):Object.defineProperty(r,c,s))}function v(l,r,h){for(var c=[],o,b,p=new Map,T=new Map,x=0;x<r.length;x++){var d=r[x];if(Array.isArray(d)){var s=d[1],f=d[2],n=d.length>3,a=s>=5,I,P;if(a?(I=l,s=s-5,b=b||[],P=b):(I=l.prototype,o=o||[],P=o),s!==0&&!n){var E=a?T:p,g=E.get(f)||0;if(g===!0||g===3&&s!==4||g===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!g&&s>2?E.set(f,s):E.set(f,!0)}m(c,I,d,f,s,a,n,P,h)}}return w(c,o),w(c,b),c}function w(l,r){r&&l.push(function(h){for(var c=0;c<r.length;c++)r[c].call(h);return h})}function D(l,r,h){if(r.length>0){for(var c=[],o=l,b=l.name,p=r.length-1;p>=0;p--){var T={v:!1};try{var x=r[p](o,{kind:"class",name:b,addInitializer:y(c,T),metadata:h})}finally{T.v=!0}x!==void 0&&(u(10,x),o=x)}return[S(o,h),function(){for(var d=0;d<c.length;d++)c[d].call(o)}]}}function S(l,r){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:r})}return function(r,h,c,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var p=Object.create(b===void 0?null:b),T=v(r,h,p);return c.length||S(r,p),{e:T,get c(){return D(r,c,p)}}}}function mn(y,t,e,i){return(mn=lc())(y,t,e,i)}var pn,ln,gn,vn,yn,bn,wn,xn,Tn,Dn,En,Cn,In,cn,un,hn,fn,Yt;pn=U({selector:"kg-resize-box",template:an,style:sn}),gn=V.state({proxy:!0}),vn=rt("resize"),yn=rt("resize-end"),bn=B(),wn=B(),xn=B(),Tn=B(),Dn=B(),En=B(),Cn=B(),In=B();var dn=class{static{({e:[cn,un,hn,fn],c:[Yt,ln]}=mn(this,[[gn,1,"mConfiguration"],[vn,1,"mResize"],[yn,1,"mResizeEnd"],[bn,3,"bottom"],[wn,3,"height"],[xn,3,"left"],[Tn,3,"right"],[Dn,3,"snap"],[En,3,"top"],[Cn,3,"virtual"],[In,3,"width"]],[pn]))}constructor(t=O.use(G)){this.mComponentElement=t.element,this.mConfiguration={snap:1,isVirtual:!1,enabledDirections:{top:!1,right:!1,bottom:!1,left:!1}}}mComponentElement;#t=(fn(this),cn(this));get mConfiguration(){return this.#t}set mConfiguration(t){this.#t=t}#e=un(this);get mResize(){return this.#e}set mResize(t){this.#e=t}#o=hn(this);get mResizeEnd(){return this.#o}set mResizeEnd(t){this.#o=t}get bottom(){return this.mConfiguration.enabledDirections.bottom}set bottom(t){this.mConfiguration.enabledDirections.bottom=this.parseBoolean(t)}get height(){return this.mComponentElement.clientHeight}set height(t){this.updateComponentHeight(t,!0)}get left(){return this.mConfiguration.enabledDirections.left}set left(t){this.mConfiguration.enabledDirections.left=this.parseBoolean(t)}get right(){return this.mConfiguration.enabledDirections.right}set right(t){this.mConfiguration.enabledDirections.right=this.parseBoolean(t)}get snap(){return this.mConfiguration.snap}set snap(t){this.mConfiguration.snap=parseInt(t.toString())}get top(){return this.mConfiguration.enabledDirections.top}set top(t){this.mConfiguration.enabledDirections.top=this.parseBoolean(t)}get virtual(){return this.mConfiguration.isVirtual}set virtual(t){this.mConfiguration.isVirtual=this.parseBoolean(t)}get width(){return this.mComponentElement.clientWidth}set width(t){this.updateComponentWidth(t,!0)}resizeCorner(t){this.handleResize(t,"both")}resizeHorizontal(t){this.handleResize(t,"horizontal")}resizeVertical(t){this.handleResize(t,"vertical")}applyComponentSize(t,e,i){let u=this.updateComponentWidth(e,!1),m=this.updateComponentHeight(i,!1);return(u!==this.width||m!==this.height)&&this.mResize.dispatchEvent(this.createResizeEvent(t,u,m,this.width,this.height)),[u,m]}createResizeEvent(t,e,i,u,m){let v=t;return e===u&&(v&=~(bt.right|bt.left)),i===m&&(v&=~(bt.top|bt.bottom)),new eo(e,i,v)}handleResize(t,e){t.preventDefault(),t.stopPropagation();let i=this.mComponentElement.getBoundingClientRect(),u=this.mComponentElement.offsetWidth?i.width/this.mComponentElement.offsetWidth:1,m=this.mComponentElement.offsetHeight?i.height/this.mComponentElement.offsetHeight:1,v=i.width/u,w=i.height/m,D=t.clientX,S=t.clientY,l=1;Math.abs(D-i.left)<Math.abs(D-i.right)&&(l=-1);let r=1;Math.abs(S-i.top)<Math.abs(S-i.bottom)&&(r=-1);let h=0;h+=l===1?bt.right:bt.left,h+=r===1?bt.bottom:bt.top;let c=v,o=w,b=T=>{let x=(T.clientX-D)/u*l,d=(T.clientY-S)/m*r,s=v+x,f=w+d;e==="horizontal"&&(s=v),e==="vertical"&&(f=w),[c,o]=this.applyComponentSize(h,s,f)},p=()=>{document.removeEventListener("pointermove",b),document.removeEventListener("pointerup",p),(c!==v||o!==w)&&this.mResizeEnd.dispatchEvent(this.createResizeEvent(h,c,o,v,w))};document.addEventListener("pointermove",b),document.addEventListener("pointerup",p)}parseBoolean(t){return!!(()=>{if(typeof t=="string"){if(t==="")return!0;let i=t.toLowerCase();if(["true","false"].includes(i))return i==="true"}return t})()}updateComponentHeight(t,e){if(!this.mConfiguration.enabledDirections.top&&!this.mConfiguration.enabledDirections.bottom)return this.height;t=Math.max(1,t);let i=parseFloat((Math.abs(t)/this.mConfiguration.snap).toFixed(5)),u=Math.ceil(i)*this.mConfiguration.snap*(t/Math.abs(t));return u=Math.max(0,u),(!this.mConfiguration.isVirtual||e)&&this.mComponentElement.style.setProperty("height",`${u}px`),u}updateComponentWidth(t,e){if(!this.mConfiguration.enabledDirections.left&&!this.mConfiguration.enabledDirections.right)return this.height;t=Math.max(1,t);let i=parseFloat((Math.abs(t)/this.mConfiguration.snap).toFixed(5)),u=Math.ceil(i)*this.mConfiguration.snap*(t/Math.abs(t));return u=Math.max(0,u),(!this.mConfiguration.isVirtual||e)&&this.mComponentElement.style.setProperty("width",`${u}px`),u}static{ln()}},eo=class{mHeight;mResizeHandle;mWidth;get height(){return this.mHeight}get resizeHandle(){return this.mResizeHandle}get width(){return this.mWidth}constructor(t,e,i){this.mHeight=e,this.mResizeHandle=i,this.mWidth=t}},bt={top:1,right:2,bottom:4,left:8};var Pn=`:host {\r
    --resize-panel-handle-size: 6px;\r
    --resize-panel-handle-color: red;\r
    --resize-panel-handle-hover-color: red;\r
\r
    position: relative;\r
    display: flex;\r
    flex-direction: column;\r
\r
    /* Set restrictions to never exeeds bounding restrictions set on the parent component. */\r
    min-height: 100%;\r
    min-width: 100%;\r
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
    display: flex;\r
    align-items: center;\r
    justify-content: center;\r
\r
    /* "Soft" handle transparent until hovered. */\r
    background-color: transparent;\r
    transition: background-color 0.15s;\r
\r
    /* Whatever the parent does. Allways allow pointer events for handles. */\r
    pointer-events: all;\r
\r
    &::before {\r
        content: '';\r
        position: absolute;\r
\r
        /* Grip dot. Single dot that is repeated in every direction. */\r
        background-image: radial-gradient(circle, var(--resize-panel-handle-color) 1px, transparent 1.6px);\r
    }\r
\r
    &.vertical {\r
        top: 0px;\r
        bottom: 0px;\r
        width: var(--resize-panel-handle-size);\r
\r
        cursor: ew-resize;\r
\r
        /* Three dots stacked vertically. */\r
        &::before {\r
            width: 3px;\r
            height: 15px;\r
            background-size: 3px 5px;\r
        }\r
    }\r
\r
    &.left {\r
        /* Place directly left of the panel, outside its box. */\r
        left: calc(-1 * var(--resize-panel-handle-size));\r
    }\r
\r
    &.right {\r
        /* Place directly right of the panel, outside its box. */\r
        right: calc(-1 * var(--resize-panel-handle-size));\r
    }\r
\r
    &.horizontal {\r
        left: 0px;\r
        right: 0px;\r
        height: var(--resize-panel-handle-size);\r
\r
        cursor: ns-resize;\r
\r
        /* Three dots in a row. */\r
        &::before {\r
            width: 15px;\r
            height: 3px;\r
            background-size: 5px 3px;\r
        }\r
    }\r
\r
    &.top {\r
        /* Place directly above the panel, outside its box. */\r
        top: calc(-1 * var(--resize-panel-handle-size));\r
    }\r
\r
    &.bottom {\r
        /* Place directly below the panel, outside its box. */\r
        bottom: calc(-1 * var(--resize-panel-handle-size));\r
    }\r
\r
    &:hover {\r
        background-color: var(--resize-panel-handle-hover-color);\r
\r
        &::before {\r
            --resize-panel-handle-color: rgba(255, 255, 255, 0.85);\r
        }\r
    }\r
}\r
`;var Mn=`<!-- Four soft edge handles placed next to the panel. Top/bottom resize height, left/right resize width. -->
$if(this.top) {
    <div class="resize-handle horizontal top" (pointerdown)="this.resizeHorizontal($event)"></div>
}
$if(this.right) {
    <div class="resize-handle vertical right" (pointerdown)="this.resizeVertical($event)"></div>
}
$if(this.bottom) {
    <div class="resize-handle horizontal bottom" (pointerdown)="this.resizeHorizontal($event)"></div>
}
$if(this.left) {
    <div class="resize-handle vertical left" (pointerdown)="this.resizeVertical($event)"></div>
}

<div class="content-container">
    $slot
</div>
`;function hc(){function y(l,r){return function(c){e(r,"addInitializer"),i(c,"An initializer"),l.push(c)}}function t(l,r,h,c,o,b,p,T,x){var d;switch(o){case 1:d="accessor";break;case 2:d="method";break;case 3:d="getter";break;case 4:d="setter";break;default:d="field"}var s={kind:d,name:p?"#"+r:r,static:b,private:p,metadata:T},f={v:!1};s.addInitializer=y(c,f);var n,a;if(o===0?p?(n=h.get,a=h.set):(n=function(){return this[r]},a=function(g){this[r]=g}):o===2?n=function(){return h.value}:((o===1||o===3)&&(n=function(){return h.get.call(this)}),(o===1||o===4)&&(a=function(g){h.set.call(this,g)})),p)s.access=n&&a?{get:n,set:a}:n?{get:n}:{set:a};else{if(n){var I=n;n=function(g){return arguments.length===0&&(g=this),I.call(g)}}if(a){var P=a;a=function(g,_){return arguments.length===1&&(_=g,g=this),P.call(g,_)}}var E=function(g){return r in g};s.access=n&&a?{has:E,get:n,set:a}:n?{has:E,get:n}:{has:E,set:a}}try{return l(x,s)}finally{f.v=!0}}function e(l,r){if(l.v)throw new Error("attempted to call "+r+" after decoration was finished")}function i(l,r){if(typeof l!="function")throw new TypeError(r+" must be a function")}function u(l,r){var h=typeof r;if(l===1){if(h!=="object"||r===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");r.get!==void 0&&i(r.get,"accessor.get"),r.set!==void 0&&i(r.set,"accessor.set"),r.init!==void 0&&i(r.init,"accessor.init")}else if(h!=="function"){var c;throw l===0?c="field":l===10?c="class":c="method",new TypeError(c+" decorators must return a function or void 0")}}function m(l,r,h,c,o,b,p,T,x){var d=h[0],s,f,n;p?o===0||o===1?s={get:h[3],set:h[4]}:o===3?s={get:h[3]}:o===4?s={set:h[3]}:s={value:h[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(r,c)),o===1?n={get:s.get,set:s.set}:o===2?n=s.value:o===3?n=s.get:o===4&&(n=s.set);var a,I,P;if(typeof d=="function")a=t(d,c,s,T,o,b,p,x,n),a!==void 0&&(u(o,a),o===0?f=a:o===1?(f=a.init,I=a.get||n.get,P=a.set||n.set,n={get:I,set:P}):n=a);else for(var E=d.length-1;E>=0;E--){var g=d[E];if(a=t(g,c,s,T,o,b,p,x,n),a!==void 0){u(o,a);var _;o===0?_=a:o===1?(_=a.init,I=a.get||n.get,P=a.set||n.set,n={get:I,set:P}):n=a,_!==void 0&&(f===void 0?f=_:typeof f=="function"?f=[f,_]:f.push(_))}}if(o===0||o===1){if(f===void 0)f=function(M,C){return C};else if(typeof f!="function"){var F=f;f=function(M,C){for(var N=C,L=0;L<F.length;L++)N=F[L].call(M,N);return N}}else{var j=f;f=function(M,C){return j.call(M,C)}}l.push(f)}o!==0&&(o===1?(s.get=n.get,s.set=n.set):o===2?s.value=n:o===3?s.get=n:o===4&&(s.set=n),p?o===1?(l.push(function(M,C){return n.get.call(M,C)}),l.push(function(M,C){return n.set.call(M,C)})):o===2?l.push(n):l.push(function(M,C){return n.call(M,C)}):Object.defineProperty(r,c,s))}function v(l,r,h){for(var c=[],o,b,p=new Map,T=new Map,x=0;x<r.length;x++){var d=r[x];if(Array.isArray(d)){var s=d[1],f=d[2],n=d.length>3,a=s>=5,I,P;if(a?(I=l,s=s-5,b=b||[],P=b):(I=l.prototype,o=o||[],P=o),s!==0&&!n){var E=a?T:p,g=E.get(f)||0;if(g===!0||g===3&&s!==4||g===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!g&&s>2?E.set(f,s):E.set(f,!0)}m(c,I,d,f,s,a,n,P,h)}}return w(c,o),w(c,b),c}function w(l,r){r&&l.push(function(h){for(var c=0;c<r.length;c++)r[c].call(h);return h})}function D(l,r,h){if(r.length>0){for(var c=[],o=l,b=l.name,p=r.length-1;p>=0;p--){var T={v:!1};try{var x=r[p](o,{kind:"class",name:b,addInitializer:y(c,T),metadata:h})}finally{T.v=!0}x!==void 0&&(u(10,x),o=x)}return[S(o,h),function(){for(var d=0;d<c.length;d++)c[d].call(o)}]}}function S(l,r){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:r})}return function(r,h,c,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var p=Object.create(b===void 0?null:b),T=v(r,h,p);return c.length||S(r,p),{e:T,get c(){return D(r,c,p)}}}}function On(y,t,e,i){return(On=hc())(y,t,e,i)}var Fn,_n,zn,jn,Vn,Bn,$n,Gn,Un,Hn,Xn,Sn,An,Nn,Ln,ro;Fn=U({selector:"kg-resize-panel",template:Mn,style:Pn}),zn=V.state({proxy:!0}),jn=rt("resize"),Vn=rt("resize-end"),Bn=B(),$n=B(),Gn=B(),Un=B(),Hn=B(),Xn=B();var Rn=class{static{({e:[Sn,An,Nn,Ln],c:[ro,_n]}=On(this,[[zn,1,"mConfiguration"],[jn,1,"mResize"],[Vn,1,"mResizeEnd"],[Bn,3,"bottom"],[$n,3,"height"],[Gn,3,"left"],[Un,3,"right"],[Hn,3,"top"],[Xn,3,"width"]],[Fn]))}constructor(t=O.use(G)){this.mComponentElement=t.element,this.mConfiguration={enabledDirections:{top:!1,right:!1,bottom:!1,left:!1}}}mComponentElement;#t=(Ln(this),Sn(this));get mConfiguration(){return this.#t}set mConfiguration(t){this.#t=t}#e=An(this);get mResize(){return this.#e}set mResize(t){this.#e=t}#o=Nn(this);get mResizeEnd(){return this.#o}set mResizeEnd(t){this.#o=t}get bottom(){return this.mConfiguration.enabledDirections.bottom}set bottom(t){this.mConfiguration.enabledDirections.bottom=this.parseBoolean(t)}get height(){return this.mComponentElement.clientHeight}set height(t){this.updateComponentHeight(t)}get left(){return this.mConfiguration.enabledDirections.left}set left(t){this.mConfiguration.enabledDirections.left=this.parseBoolean(t)}get right(){return this.mConfiguration.enabledDirections.right}set right(t){this.mConfiguration.enabledDirections.right=this.parseBoolean(t)}get top(){return this.mConfiguration.enabledDirections.top}set top(t){this.mConfiguration.enabledDirections.top=this.parseBoolean(t)}get width(){return this.mComponentElement.clientWidth}set width(t){this.updateComponentWidth(t)}resizeHorizontal(t){this.handleResize(t,"horizontal")}resizeVertical(t){this.handleResize(t,"vertical")}applyComponentSize(t,e,i){let u=this.updateComponentWidth(e),m=this.updateComponentHeight(i);return(u!==this.width||m!==this.height)&&this.mResize.dispatchEvent(this.createResizeEvent(t,u,m,this.width,this.height)),[u,m]}createResizeEvent(t,e,i,u,m){let v=t;return e===u&&(v&=~(Ft.right|Ft.left)),i===m&&(v&=~(Ft.top|Ft.bottom)),new oo(e,i,v)}handleResize(t,e){t.preventDefault(),t.stopPropagation();let i=this.mComponentElement.getBoundingClientRect(),u=this.mComponentElement.offsetWidth?i.width/this.mComponentElement.offsetWidth:1,m=this.mComponentElement.offsetHeight?i.height/this.mComponentElement.offsetHeight:1,v=i.width/u,w=i.height/m,D=t.clientX,S=t.clientY,l=1;Math.abs(D-i.left)<Math.abs(D-i.right)&&(l=-1);let r=1;Math.abs(S-i.top)<Math.abs(S-i.bottom)&&(r=-1);let h=0;h+=l===1?Ft.right:Ft.left,h+=r===1?Ft.bottom:Ft.top;let c=v,o=w,b=T=>{let x=(T.clientX-D)/u*l,d=(T.clientY-S)/m*r,s=v+x,f=w+d;e==="horizontal"&&(s=v),e==="vertical"&&(f=w),[c,o]=this.applyComponentSize(h,s,f)},p=()=>{document.removeEventListener("pointermove",b),document.removeEventListener("pointerup",p),(c!==v||o!==w)&&this.mResizeEnd.dispatchEvent(this.createResizeEvent(h,c,o,v,w))};document.addEventListener("pointermove",b),document.addEventListener("pointerup",p)}parseBoolean(t){return!!(()=>{if(typeof t=="string"){if(t==="")return!0;let i=t.toLowerCase();if(["true","false"].includes(i))return i==="true"}return t})()}updateComponentHeight(t){if(!this.mConfiguration.enabledDirections.top&&!this.mConfiguration.enabledDirections.bottom)return this.height;let e=Math.max(1,t);return this.mComponentElement.style.setProperty("height",`${e}px`),e}updateComponentWidth(t){if(!this.mConfiguration.enabledDirections.left&&!this.mConfiguration.enabledDirections.right)return this.width;let e=Math.max(1,t);return this.mComponentElement.style.setProperty("width",`${e}px`),e}static{_n()}},oo=class{mHeight;mResizeHandle;mWidth;get height(){return this.mHeight}get resizeHandle(){return this.mResizeHandle}get width(){return this.mWidth}constructor(t,e,i){this.mHeight=e,this.mResizeHandle=i,this.mWidth=t}},Ft={top:1,right:2,bottom:4,left:8};var Yn=`:host {
    --select-accent-color: red;
    --select-text-color: red;
    --select-border-color: red;
    --select-border-radius: 4px;
    --select-background-color: red;

    position: relative;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    user-select: none;

    /* Set a default font size the component use for scaling its em values */
    font-size: 1rem;

    /* Shared box. Transparent border keeps every type the same size. */
    padding: 0.4rem 0.75rem;
    border: 1px solid transparent;
    border-radius: var(--select-border-radius);
    color: var(--select-text-color);
    background-color: transparent;

    /* Smooth transition for all */
    transition: border-color 0.15s, color 0.15s, background-color 0.15s;
}

/*
 * Primary & Secondary starting differences.
 */
:host([type=primary]) {
    border-color: var(--select-border-color);
    background-color: var(--select-background-color);
}

:host([type=secondary]) {
    /* Background animation */
    background-color: transparent;
    border-color: transparent;
}

.select {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;

    &::after {
        position: absolute;
        content: '';
        border-radius: var(--select-border-radius);
        border: 1px solid var(--select-accent-color);
        pointer-events: none;

        transition: top 0.15s, right 0.15s, bottom 0.15s, left 0.15s, opacity 0.15s;

        /* Animation properties */
        opacity: 0;
        top: -0.5em;
        right: -0.5em;
        bottom: -0.5em;
        left: -0.5em;
    }
}

/*
 * Native select reset. Blends the control into the shared box while keeping the native arrow.
 */
.select-input {
    box-sizing: border-box;
    width: 100%;
    margin: 0;

    /* Default right padding so the native dropdown arrow has enough space. */
    padding: 0 1em 0 0;

    border: none;
    outline: none;
    color: inherit;
    font: inherit;
    cursor: inherit;

    /* Must be set all the time to style <options> */
    background-color: var(--select-background-color);
    color: var(--select-text-color);
}

/*
 * Shared user interactions.
 */

:host(:hover),
:host(:active),
:host(:focus-within) {
    color: var(--select-accent-color);

    .select::after {
        opacity: 1;

        /* Actual border. */
        top: -1px;
        right: -1px;
        bottom: -1px;
        left: -1px;
    }
}`;var Wn=`<div class="select">
    <select class="select-input" (change)="this.onChange($event)">
        $if(this.placeholder !== '') {
            <option class="placeholder" value="" disabled="disabled" hidden="hidden" [selected]="this.value === ''">{{this.placeholder}}</option>
        }
        $for(option of this.options) {
            <option [value]="this.itemValue(this.option)" [selected]="this.itemValue(this.option) === this.value">{{this.itemLabel(this.option)}}</option>
        }
    </select>
</div>
`;function mc(){function y(l,r){return function(c){e(r,"addInitializer"),i(c,"An initializer"),l.push(c)}}function t(l,r,h,c,o,b,p,T,x){var d;switch(o){case 1:d="accessor";break;case 2:d="method";break;case 3:d="getter";break;case 4:d="setter";break;default:d="field"}var s={kind:d,name:p?"#"+r:r,static:b,private:p,metadata:T},f={v:!1};s.addInitializer=y(c,f);var n,a;if(o===0?p?(n=h.get,a=h.set):(n=function(){return this[r]},a=function(g){this[r]=g}):o===2?n=function(){return h.value}:((o===1||o===3)&&(n=function(){return h.get.call(this)}),(o===1||o===4)&&(a=function(g){h.set.call(this,g)})),p)s.access=n&&a?{get:n,set:a}:n?{get:n}:{set:a};else{if(n){var I=n;n=function(g){return arguments.length===0&&(g=this),I.call(g)}}if(a){var P=a;a=function(g,_){return arguments.length===1&&(_=g,g=this),P.call(g,_)}}var E=function(g){return r in g};s.access=n&&a?{has:E,get:n,set:a}:n?{has:E,get:n}:{has:E,set:a}}try{return l(x,s)}finally{f.v=!0}}function e(l,r){if(l.v)throw new Error("attempted to call "+r+" after decoration was finished")}function i(l,r){if(typeof l!="function")throw new TypeError(r+" must be a function")}function u(l,r){var h=typeof r;if(l===1){if(h!=="object"||r===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");r.get!==void 0&&i(r.get,"accessor.get"),r.set!==void 0&&i(r.set,"accessor.set"),r.init!==void 0&&i(r.init,"accessor.init")}else if(h!=="function"){var c;throw l===0?c="field":l===10?c="class":c="method",new TypeError(c+" decorators must return a function or void 0")}}function m(l,r,h,c,o,b,p,T,x){var d=h[0],s,f,n;p?o===0||o===1?s={get:h[3],set:h[4]}:o===3?s={get:h[3]}:o===4?s={set:h[3]}:s={value:h[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(r,c)),o===1?n={get:s.get,set:s.set}:o===2?n=s.value:o===3?n=s.get:o===4&&(n=s.set);var a,I,P;if(typeof d=="function")a=t(d,c,s,T,o,b,p,x,n),a!==void 0&&(u(o,a),o===0?f=a:o===1?(f=a.init,I=a.get||n.get,P=a.set||n.set,n={get:I,set:P}):n=a);else for(var E=d.length-1;E>=0;E--){var g=d[E];if(a=t(g,c,s,T,o,b,p,x,n),a!==void 0){u(o,a);var _;o===0?_=a:o===1?(_=a.init,I=a.get||n.get,P=a.set||n.set,n={get:I,set:P}):n=a,_!==void 0&&(f===void 0?f=_:typeof f=="function"?f=[f,_]:f.push(_))}}if(o===0||o===1){if(f===void 0)f=function(M,C){return C};else if(typeof f!="function"){var F=f;f=function(M,C){for(var N=C,L=0;L<F.length;L++)N=F[L].call(M,N);return N}}else{var j=f;f=function(M,C){return j.call(M,C)}}l.push(f)}o!==0&&(o===1?(s.get=n.get,s.set=n.set):o===2?s.value=n:o===3?s.get=n:o===4&&(s.set=n),p?o===1?(l.push(function(M,C){return n.get.call(M,C)}),l.push(function(M,C){return n.set.call(M,C)})):o===2?l.push(n):l.push(function(M,C){return n.call(M,C)}):Object.defineProperty(r,c,s))}function v(l,r,h){for(var c=[],o,b,p=new Map,T=new Map,x=0;x<r.length;x++){var d=r[x];if(Array.isArray(d)){var s=d[1],f=d[2],n=d.length>3,a=s>=5,I,P;if(a?(I=l,s=s-5,b=b||[],P=b):(I=l.prototype,o=o||[],P=o),s!==0&&!n){var E=a?T:p,g=E.get(f)||0;if(g===!0||g===3&&s!==4||g===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!g&&s>2?E.set(f,s):E.set(f,!0)}m(c,I,d,f,s,a,n,P,h)}}return w(c,o),w(c,b),c}function w(l,r){r&&l.push(function(h){for(var c=0;c<r.length;c++)r[c].call(h);return h})}function D(l,r,h){if(r.length>0){for(var c=[],o=l,b=l.name,p=r.length-1;p>=0;p--){var T={v:!1};try{var x=r[p](o,{kind:"class",name:b,addInitializer:y(c,T),metadata:h})}finally{T.v=!0}x!==void 0&&(u(10,x),o=x)}return[S(o,h),function(){for(var d=0;d<c.length;d++)c[d].call(o)}]}}function S(l,r){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:r})}return function(r,h,c,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var p=Object.create(b===void 0?null:b),T=v(r,h,p);return c.length||S(r,p),{e:T,get c(){return D(r,c,p)}}}}function oi(y,t,e,i){return(oi=mc())(y,t,e,i)}var ri,Zn,ni,ii,si,ai,li,ci,ui,hi,fi,di,mi,qn,Jn,Kn,Qn,kn,ti,no;ri=U({selector:"kg-select",template:Wn,style:Yn}),ni=V.state({complexValue:!0}),ii=V.state(),si=V.state(),ai=V.state(),li=rt("change"),ci=B(),ui=B(),hi=B(),fi=B(),di=B(),mi=B();var ei=class{static{({e:[qn,Jn,Kn,Qn,kn,ti],c:[no,Zn]}=oi(this,[[ni,1,"mOptions"],[ii,1,"mPlaceholder"],[si,1,"mType"],[ai,1,"mValue"],[li,1,"mChange"],[ci,3,"labelKey"],[ui,3,"options"],[hi,3,"placeholder"],[fi,3,"type"],[di,3,"value"],[mi,3,"valueKey"]],[ri]))}constructor(){this.mType="primary",this.mValue="",this.mOptions=new Array,this.mPlaceholder="",this.mValueMapping={valueKey:"value",labelKey:"label"}}mValueMapping;#t=(ti(this),qn(this));get mOptions(){return this.#t}set mOptions(t){this.#t=t}#e=Jn(this);get mPlaceholder(){return this.#e}set mPlaceholder(t){this.#e=t}#o=Kn(this);get mType(){return this.#o}set mType(t){this.#o=t}#r=Qn(this);get mValue(){return this.#r}set mValue(t){this.#r=t}#n=kn(this);get mChange(){return this.#n}set mChange(t){this.#n=t}get labelKey(){return this.mValueMapping.labelKey}set labelKey(t){this.mValueMapping.labelKey=(t??"").toString()}get options(){return this.mOptions}set options(t){this.mOptions=Array.isArray(t)?t:new Array}get placeholder(){return this.mPlaceholder}set placeholder(t){this.mPlaceholder=(t??"").toString()}get type(){return this.mType}set type(t){if(t!=="primary"&&t!=="secondary"){this.mType="secondary";return}this.mType=t}get value(){return this.mValue}set value(t){this.mValue=(t??"").toString()}get valueKey(){return this.mValueMapping.valueKey}set valueKey(t){this.mValueMapping.valueKey=(t??"").toString()}onChange(t){let e=t.target;this.mValue=e.value,this.mChange.dispatchEvent(this.mValue)}itemLabel(t){return t[this.mValueMapping.labelKey]}itemValue(t){return t[this.mValueMapping.valueKey]}static{Zn()}};var pi=`:host {\r
    display: flex;\r
    flex-direction: column;\r
}\r
\r
.resize-panel {\r
    --resize-panel-handle-color: var(--potatno-color-border);\r
    --resize-panel-handle-hover-color: var(--potatno-color-accent);\r
\r
    height: 100%;\r
\r
    /* Set min, max and default width */\r
    width: 16rem;\r
    max-width: 32rem;\r
    min-width: 12rem;\r
\r
    /* Hopefully that cascade into all childs. */\r
    font-family: var(--potatno-font-family);\r
    font-size: var(--potatno-font-size);\r
}\r
\r
.panel-content {\r
    flex: 1;\r
    display: flex;\r
    flex-direction: column;\r
    height: 100%;\r
    border-radius: var(--potatno-border-radius);\r
    background-color: var(--potatno-color-background-dark);\r
    overflow: hidden;\r
}\r
\r
.function-list {\r
    flex: 1;\r
    padding: 0.3rem;\r
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
    padding: 0.3rem 0.5rem;\r
    margin: 0 0 0.3rem 0;\r
    border-radius: var(--potatno-border-radius);\r
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
        height: 1.5rem;\r
        padding: 0 0.8rem 0 0.8rem;\r
\r
        text-align: center;\r
        font-weight: bold;\r
\r
        /* Border defined to mark selected. */\r
        border-left: 0.25rem solid var(--potatno-color-accent);\r
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
        .function-item:hover &,\r
        .function-item:active & {\r
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
\r
        width: 1.5rem;\r
        height: 1.5rem;\r
    }\r
}\r
\r
.list-actions {\r
    position: relative;\r
    margin: 0 0.8rem;\r
    padding: 0.8rem 0;\r
    border-top: 2px solid var(--potatno-color-border);\r
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
    --popup-border-radius: var(--potatno-border-radius);\r
    --popup-shadow-color: var(--potatno-color-shadow);\r
    --popup-background-color: var(--potatno-color-background-light);\r
\r
    position: absolute;\r
    bottom: calc(100% + 1rem);\r
    left: 0;\r
    right: 0;\r
\r
    .popup__header {\r
        padding: 0.4rem 0rem;\r
        margin: 0 1rem;\r
        color: var(--potatno-color-accent);\r
        border-bottom: 2px solid var(--potatno-color-border);\r
        text-align: center;\r
        font-weight: bold;\r
        user-select: none;\r
    }\r
\r
    .popup__list {\r
        padding: 0.3rem;\r
    }\r
\r
    .popup__item {\r
        display: flex;\r
        box-sizing: border-box;\r
        width: 100%;\r
        padding: 0.3rem 0.6rem 0.3rem 0.5rem;\r
        margin: 0 0 0.3rem 0;\r
        border-radius: 4px;\r
        align-items: center;\r
        text-align: left;\r
        color: var(--potatno-color-text);\r
        cursor: pointer;\r
        transition: background-color 0.15s, scale 0.15s;\r
\r
        &:hover,\r
        &:active {\r
            background-color: var(--potatno-color-background-light);\r
        }\r
\r
        &:active {\r
            scale: 0.98;\r
        }\r
\r
        .icon {\r
            box-sizing: border-box;\r
            height: 1.5rem;\r
            line-height: 1.5rem;\r
\r
\r
            /* Manually centering shitty function "icon" by offsetting 2px */\r
            padding: 0 0.8rem 0 0.8rem;\r
\r
            /* Border defined to mark selected. */\r
            border-left: 0.25rem solid color-mix(in srgb, var(--potatno-color-text) 25%, var(--potatno-color-background));\r
            transition: border-color 0.15s;\r
\r
            .popup__item:active & {\r
                border-color: var(--potatno-color-accent);\r
            }\r
        }\r
    }\r
}`;var gi=`<kg-resize-panel class="resize-panel" right>\r
    <div class="panel-content">\r
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
                            <div class="popup__list">\r
                                <div class="popup__item" (click)="this.createFunction(this.functionDefinition)">\r
                                    <div class="icon">\u0192</div>\r
                                    <div>{{this.functionDefinition.label}}</div>\r
                                </div>\r
                            </div>\r
                            \r
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
    </div>\r
</kg-resize-panel>\r
`;function vc(){function y(l,r){return function(c){e(r,"addInitializer"),i(c,"An initializer"),l.push(c)}}function t(l,r,h,c,o,b,p,T,x){var d;switch(o){case 1:d="accessor";break;case 2:d="method";break;case 3:d="getter";break;case 4:d="setter";break;default:d="field"}var s={kind:d,name:p?"#"+r:r,static:b,private:p,metadata:T},f={v:!1};s.addInitializer=y(c,f);var n,a;if(o===0?p?(n=h.get,a=h.set):(n=function(){return this[r]},a=function(g){this[r]=g}):o===2?n=function(){return h.value}:((o===1||o===3)&&(n=function(){return h.get.call(this)}),(o===1||o===4)&&(a=function(g){h.set.call(this,g)})),p)s.access=n&&a?{get:n,set:a}:n?{get:n}:{set:a};else{if(n){var I=n;n=function(g){return arguments.length===0&&(g=this),I.call(g)}}if(a){var P=a;a=function(g,_){return arguments.length===1&&(_=g,g=this),P.call(g,_)}}var E=function(g){return r in g};s.access=n&&a?{has:E,get:n,set:a}:n?{has:E,get:n}:{has:E,set:a}}try{return l(x,s)}finally{f.v=!0}}function e(l,r){if(l.v)throw new Error("attempted to call "+r+" after decoration was finished")}function i(l,r){if(typeof l!="function")throw new TypeError(r+" must be a function")}function u(l,r){var h=typeof r;if(l===1){if(h!=="object"||r===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");r.get!==void 0&&i(r.get,"accessor.get"),r.set!==void 0&&i(r.set,"accessor.set"),r.init!==void 0&&i(r.init,"accessor.init")}else if(h!=="function"){var c;throw l===0?c="field":l===10?c="class":c="method",new TypeError(c+" decorators must return a function or void 0")}}function m(l,r,h,c,o,b,p,T,x){var d=h[0],s,f,n;p?o===0||o===1?s={get:h[3],set:h[4]}:o===3?s={get:h[3]}:o===4?s={set:h[3]}:s={value:h[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(r,c)),o===1?n={get:s.get,set:s.set}:o===2?n=s.value:o===3?n=s.get:o===4&&(n=s.set);var a,I,P;if(typeof d=="function")a=t(d,c,s,T,o,b,p,x,n),a!==void 0&&(u(o,a),o===0?f=a:o===1?(f=a.init,I=a.get||n.get,P=a.set||n.set,n={get:I,set:P}):n=a);else for(var E=d.length-1;E>=0;E--){var g=d[E];if(a=t(g,c,s,T,o,b,p,x,n),a!==void 0){u(o,a);var _;o===0?_=a:o===1?(_=a.init,I=a.get||n.get,P=a.set||n.set,n={get:I,set:P}):n=a,_!==void 0&&(f===void 0?f=_:typeof f=="function"?f=[f,_]:f.push(_))}}if(o===0||o===1){if(f===void 0)f=function(M,C){return C};else if(typeof f!="function"){var F=f;f=function(M,C){for(var N=C,L=0;L<F.length;L++)N=F[L].call(M,N);return N}}else{var j=f;f=function(M,C){return j.call(M,C)}}l.push(f)}o!==0&&(o===1?(s.get=n.get,s.set=n.set):o===2?s.value=n:o===3?s.get=n:o===4&&(s.set=n),p?o===1?(l.push(function(M,C){return n.get.call(M,C)}),l.push(function(M,C){return n.set.call(M,C)})):o===2?l.push(n):l.push(function(M,C){return n.call(M,C)}):Object.defineProperty(r,c,s))}function v(l,r,h){for(var c=[],o,b,p=new Map,T=new Map,x=0;x<r.length;x++){var d=r[x];if(Array.isArray(d)){var s=d[1],f=d[2],n=d.length>3,a=s>=5,I,P;if(a?(I=l,s=s-5,b=b||[],P=b):(I=l.prototype,o=o||[],P=o),s!==0&&!n){var E=a?T:p,g=E.get(f)||0;if(g===!0||g===3&&s!==4||g===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!g&&s>2?E.set(f,s):E.set(f,!0)}m(c,I,d,f,s,a,n,P,h)}}return w(c,o),w(c,b),c}function w(l,r){r&&l.push(function(h){for(var c=0;c<r.length;c++)r[c].call(h);return h})}function D(l,r,h){if(r.length>0){for(var c=[],o=l,b=l.name,p=r.length-1;p>=0;p--){var T={v:!1};try{var x=r[p](o,{kind:"class",name:b,addInitializer:y(c,T),metadata:h})}finally{T.v=!0}x!==void 0&&(u(10,x),o=x)}return[S(o,h),function(){for(var d=0;d<c.length;d++)c[d].call(o)}]}}function S(l,r){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:r})}return function(r,h,c,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var p=Object.create(b===void 0?null:b),T=v(r,h,p);return c.length||S(r,p),{e:T,get c(){return D(r,c,p)}}}}function Ti(y,t,e,i){return(Ti=vc())(y,t,e,i)}var Di,vi,Ei,Ci,yi,bi,wi,Io;Di=U({selector:"potatno-function-list",template:gi,style:pi,components:[ro,se,Mt]}),Ei=V.state({complexValue:!0}),Ci=V.state();var xi=class{static{({e:[yi,bi,wi],c:[Io,vi]}=Ti(this,[[Ei,1,"documentFunctions"],[Ci,1,"showPopup"]],[Di]))}constructor(t=O.use(H)){this.mManager=t,this.documentFunctions=new Array,this.showPopup=!1,this.mUnsubscribe=this.mManager.subscribe(R.Document|R.Function|R.SpecialActiveFunction,()=>{this.documentFunctions=this.mManager.graph.document.functions.map(e=>({id:e.id,label:e.label,isSystem:e.isSystem,function:e}))})}mManager;mUnsubscribe;#t=(wi(this),yi(this));get documentFunctions(){return this.#t}set documentFunctions(t){this.#t=t}#e=bi(this);get showPopup(){return this.#e}set showPopup(t){this.#e=t}get activeFunctionId(){return this.mManager.activeFunction.id}get userFunctionDefinitions(){return[...this.mManager.project.userFunctions.values()]}createFunction(t){this.showPopup=!1,this.mManager.graph.addFunction(t.id)}deleteFunction(t){this.mManager.graph.removeFunction(t.id)}onDeconstruct(){this.mUnsubscribe()}selectFunction(t){this.mManager.setActiveFunction(t.function)}static{vi()}};var ae=class{mCodeGenerator;mId;mLabel;mNodesProvider;mStatics;get codeGenerator(){return this.mCodeGenerator}get id(){return this.mId}get label(){return this.mLabel}get statics(){return this.mStatics}constructor(t){this.mId=t.id,this.mLabel=t.label,this.mNodesProvider=t.nodes,this.mStatics=t.statics,this.mCodeGenerator=t.generator.code}getNodeDefinitions(t){let e=u=>{if(!u)return new Array;let m=new Array;return u(v=>{m.push(v)},t),m},i={};return Object.defineProperty(i,"entry",{get:()=>e(this.mNodesProvider.entry)}),Object.defineProperty(i,"exit",{get:()=>e(this.mNodesProvider.exit)}),Object.defineProperty(i,"dynamic",{get:()=>e(this.mNodesProvider.dynamic)}),i}},zt={none:0,imports:1,inputs:2,outputs:4};var Ii=`:host {\r
    display: flex;\r
    flex-direction: column;\r
}\r
\r
.resize-panel {\r
    --resize-panel-handle-color: var(--potatno-color-border);\r
    --resize-panel-handle-hover-color: var(--potatno-color-accent);\r
\r
    height: 100%;\r
\r
    /* Set min, max and default width */\r
    width: 16rem;\r
    max-width: 32rem;\r
    min-width: 12rem;\r
\r
    /* Hopefully that cascade into all childs. */\r
    font-family: var(--potatno-font-family);\r
    font-size: var(--potatno-font-size);\r
    color: var(--potatno-color-text);\r
}\r
\r
.panel-content {\r
    display: flex;\r
    flex-direction: column;\r
    height: 100%;\r
    padding: 0.8rem;\r
    border-radius: var(--potatno-border-radius);\r
    background-color: var(--potatno-color-background-dark);\r
    overflow: hidden;\r
\r
    /* Enable content scroll */\r
    overflow-y: auto;\r
    overflow-x: visible;\r
    scrollbar-color: var(--potatno-color-scrollbar-thumb) var(--potatno-color-scrollbar-track);\r
    scrollbar-width: thin;\r
}\r
\r
.section {\r
    padding: 0.8rem 0;\r
    border-bottom: 2px solid var(--potatno-color-border);\r
\r
    &:first-child {\r
        padding: 0 0 0.8rem 0;\r
    }\r
\r
    &:last-child {\r
        border-bottom: none;\r
    }\r
\r
    .section__label {\r
        margin-bottom: 0.375rem;\r
    }\r
\r
    .section__empty {\r
        opacity: 0.5;\r
\r
        font-size: var(--potatno-font-size-small);\r
        font-style: italic;\r
    }\r
\r
    .section__list {\r
        display: flex;\r
        flex-direction: column;\r
        gap: 0.5rem;\r
    }\r
}\r
\r
.section-label {\r
    display: flex;\r
    align-items: center;\r
    height: 1.5rem;\r
\r
    span {\r
        flex: 1;\r
        font-size: var(--potatno-font-size);\r
        color: var(--potatno-color-accent);\r
        text-transform: uppercase;\r
    }\r
\r
    .section-label__button {\r
        --button-accent-color: var(--potatno-color-accent);\r
        --button-text-color: var(--potatno-color-text);\r
        --button-border-color: var(--potatno-color-border);\r
        --button-background-color: var(--potatno-color-background-light);\r
\r
        width: 1.5rem;\r
        height: 1.5rem;\r
        padding: 0;\r
        font-size: 1.5rem;\r
\r
        /* Hacky shit because unicode icons are ... shit. But im gonna use them anyway.*/\r
        >div {\r
            position: relative;\r
            line-height: 0;\r
            top: -0.2rem;\r
        }\r
    }\r
}\r
\r
.list-item {\r
    display: flex;\r
    align-items: center;\r
    padding: 0.3rem;\r
    background-color: var(--potatno-color-background);\r
    border-radius: var(--potatno-border-radius);\r
    gap: 0.4rem;\r
\r
    transition: left 0.15s ease-in-out, opacity 0.15s ease-in-out;\r
    position: relative;\r
    left: 0rem;\r
    opacity: 1;\r
\r
    &.new {\r
        @starting-style {\r
            left: -1rem;\r
            opacity: 0;\r
        }\r
    }\r
\r
    .list-item__delete {\r
        --button-text-color: var(--potatno-color-text);\r
        --button-accent-color: var(--potatno-color-error);\r
        width: 1.5rem;\r
        height: 1.5rem;\r
        font-size: 0.75rem;\r
    }\r
\r
    .list-item__text-input {\r
        /* Hear me out... this max the text input but also allows the select to also grow when no text input is present */\r
        flex: 1 99999 100%;\r
        min-width: 2.75rem;\r
\r
        padding: 0.3rem 0.3rem;\r
        background-color: var(--potatno-color-background-light);\r
        font-size: var(--potatno-font-size);\r
        color: var(--potatno-color-text);\r
        font: inherit;\r
\r
        /* Custom borders for animations*/\r
        border: 1px solid var(--potatno-color-border);\r
        border-radius: var(--potatno-border-radius);\r
        outline: none;\r
        transition: border-color 0.15s;\r
\r
        &:focus {\r
            border-color: var(--potatno-color-accent);\r
        }\r
\r
        &:disabled {\r
            border: 1px solid transparent;\r
            background-color: transparent;\r
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
        flex: 1 1 max-content;\r
        min-width: 2.75rem;\r
        padding: 0 1rem 0 0;\r
        background-color: var(--potatno-color-background);\r
        color: var(--potatno-color-text);\r
\r
        font: inherit;\r
        font-size: var(--potatno-font-size);\r
\r
        /* Custom borders for animations*/\r
        border: 1px solid transparent;\r
        border-radius: 0;\r
        outline: none;\r
        transition: border-color 0.15s;\r
\r
        &:focus {\r
            border-color: var(--potatno-color-accent);\r
            border-width: 1px;\r
            border-radius: var(--potatno-border-radius);\r
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
        padding: 0.3rem 0.3rem;\r
        font-size: var(--potatno-font-size);\r
\r
        /* Ellipsis stuff */\r
        overflow: hidden;\r
        text-overflow: ellipsis;\r
        white-space: nowrap;\r
    }\r
\r
    .list-item__seperator {\r
        flex-shrink: 0;\r
        height: 1.5rem;\r
        width: 2px;\r
        background-color: var(--potatno-color-border);\r
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
        padding: 0.23rem 0.75rem;\r
\r
        font-size: var(--potatno-font-size);\r
    }\r
}`;var Pi=`<kg-resize-panel class="resize-panel" left>\r
    <div class="panel-content">\r
        <!-- Function name -->\r
        <div class="section">\r
            <div class="section__label section-label">\r
                <span>Function Name</span>\r
            </div>\r
            <div class="section__list">\r
                <div class="list-item">\r
                    <input class="list-item__text-input" type="text" [(value)]="this.functionProperties.label" [disabled]="this.functionProperties.statics.label" (change)="this.submitChange()"/>\r
                </div>\r
            </div>\r
        </div>\r
\r
        <!-- Inputs -->\r
        <div class="section">\r
            <div class="section__label section-label">\r
                <span>Inputs</span>\r
\r
                $if(!this.functionProperties.statics.inputs) {\r
                    <kg-button class="section-label__button" type="secondary" (click)="this.addPort(this.functionProperties.inputs)">\r
                        <div>+</div>\r
                    </kg-button>\r
                }\r
            </div>\r
            <div class="section__list">\r
                $for(functionPort of this.functionProperties.inputs) {\r
                    <div class="list-item {{ this.functionPort.new ? 'new' : '' }}">\r
                        <!-- Label/Name -->\r
                        <input class="list-item__text-input {{ this.functionPort.hasError ? 'error' : '' }}" type="text" [(value)]="this.functionPort.label" [disabled]="this.functionProperties.statics.inputs" (change)="this.submitChange()"/>\r
\r
                        <div class="list-item__seperator" />\r
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
                            <div class="list-item__seperator" />\r
                            <kg-button class="list-item__delete" type="secondary" (click)="this.deletePort(this.functionPort, this.functionProperties.inputs)">\u2715</kg-button>\r
                        }\r
                    </div>\r
                }\r
\r
                $if(this.functionProperties.inputs.length === 0) {\r
                    <div class="section__empty">No inputs defined.</div>\r
                }\r
            </div>\r
        </div>\r
\r
        <!-- Outputs -->\r
        <div class="section">\r
            <div class="section__label section-label">\r
                <span>Outputs</span>\r
            \r
                $if(!this.functionProperties.statics.outputs) {\r
                    <kg-button class="section-label__button" type="secondary" (click)="this.addPort(this.functionProperties.outputs)">\r
                        <div>+</div>\r
                    </kg-button>\r
                }\r
            </div>\r
            <div class="section__list">\r
                $for(functionPort of this.functionProperties.outputs) {\r
                    <div class="list-item  {{ this.functionPort.new ? 'new' : '' }}">\r
                        <!-- Label/Name -->\r
                        <input class="list-item__text-input {{ this.functionPort.hasError ? 'error' : '' }}" type="text" [(value)]="this.functionPort.label" [disabled]="this.functionProperties.statics.outputs" (change)="this.submitChange()"/>\r
\r
                        <div class="list-item__seperator" />\r
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
                            <div class="list-item__seperator" />\r
                            <kg-button class="list-item__delete" type="secondary" (click)="this.deletePort(this.functionPort, this.functionProperties.outputs)">\u2715</kg-button>\r
                        }\r
                    </div>\r
                }\r
\r
                $if(this.functionProperties.outputs.length === 0) {\r
                    <div class="section__empty">No outputs defined.</div>\r
                }\r
            </div>\r
        </div>\r
\r
        <div class="section">\r
            <div class="section__label section-label">\r
                <span>Imports</span>\r
            </div>\r
\r
            <div class="section__list">\r
                $for(import of this.functionProperties.imports) {\r
                    <div class="list-item {{ this.import.new ? 'new' : '' }}">\r
                        <span class="list-item__text">{{this.import.label}}</span>\r
\r
                        $if(!this.functionProperties.statics.imports) {\r
                            <div class="list-item__seperator" />\r
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
\r
                        <div class="list-item__seperator" />\r
\r
                        <kg-button class="list-item__button" type="secondary" (click)="this.addSelectedImport()">\r
                            <div>Add</div>\r
                        </kg-button>\r
                    </div>\r
                }\r
            </div>\r
        </div>\r
    </div>\r
</kg-resize-panel>\r
`;function wc(){function y(l,r){return function(c){e(r,"addInitializer"),i(c,"An initializer"),l.push(c)}}function t(l,r,h,c,o,b,p,T,x){var d;switch(o){case 1:d="accessor";break;case 2:d="method";break;case 3:d="getter";break;case 4:d="setter";break;default:d="field"}var s={kind:d,name:p?"#"+r:r,static:b,private:p,metadata:T},f={v:!1};s.addInitializer=y(c,f);var n,a;if(o===0?p?(n=h.get,a=h.set):(n=function(){return this[r]},a=function(g){this[r]=g}):o===2?n=function(){return h.value}:((o===1||o===3)&&(n=function(){return h.get.call(this)}),(o===1||o===4)&&(a=function(g){h.set.call(this,g)})),p)s.access=n&&a?{get:n,set:a}:n?{get:n}:{set:a};else{if(n){var I=n;n=function(g){return arguments.length===0&&(g=this),I.call(g)}}if(a){var P=a;a=function(g,_){return arguments.length===1&&(_=g,g=this),P.call(g,_)}}var E=function(g){return r in g};s.access=n&&a?{has:E,get:n,set:a}:n?{has:E,get:n}:{has:E,set:a}}try{return l(x,s)}finally{f.v=!0}}function e(l,r){if(l.v)throw new Error("attempted to call "+r+" after decoration was finished")}function i(l,r){if(typeof l!="function")throw new TypeError(r+" must be a function")}function u(l,r){var h=typeof r;if(l===1){if(h!=="object"||r===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");r.get!==void 0&&i(r.get,"accessor.get"),r.set!==void 0&&i(r.set,"accessor.set"),r.init!==void 0&&i(r.init,"accessor.init")}else if(h!=="function"){var c;throw l===0?c="field":l===10?c="class":c="method",new TypeError(c+" decorators must return a function or void 0")}}function m(l,r,h,c,o,b,p,T,x){var d=h[0],s,f,n;p?o===0||o===1?s={get:h[3],set:h[4]}:o===3?s={get:h[3]}:o===4?s={set:h[3]}:s={value:h[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(r,c)),o===1?n={get:s.get,set:s.set}:o===2?n=s.value:o===3?n=s.get:o===4&&(n=s.set);var a,I,P;if(typeof d=="function")a=t(d,c,s,T,o,b,p,x,n),a!==void 0&&(u(o,a),o===0?f=a:o===1?(f=a.init,I=a.get||n.get,P=a.set||n.set,n={get:I,set:P}):n=a);else for(var E=d.length-1;E>=0;E--){var g=d[E];if(a=t(g,c,s,T,o,b,p,x,n),a!==void 0){u(o,a);var _;o===0?_=a:o===1?(_=a.init,I=a.get||n.get,P=a.set||n.set,n={get:I,set:P}):n=a,_!==void 0&&(f===void 0?f=_:typeof f=="function"?f=[f,_]:f.push(_))}}if(o===0||o===1){if(f===void 0)f=function(M,C){return C};else if(typeof f!="function"){var F=f;f=function(M,C){for(var N=C,L=0;L<F.length;L++)N=F[L].call(M,N);return N}}else{var j=f;f=function(M,C){return j.call(M,C)}}l.push(f)}o!==0&&(o===1?(s.get=n.get,s.set=n.set):o===2?s.value=n:o===3?s.get=n:o===4&&(s.set=n),p?o===1?(l.push(function(M,C){return n.get.call(M,C)}),l.push(function(M,C){return n.set.call(M,C)})):o===2?l.push(n):l.push(function(M,C){return n.call(M,C)}):Object.defineProperty(r,c,s))}function v(l,r,h){for(var c=[],o,b,p=new Map,T=new Map,x=0;x<r.length;x++){var d=r[x];if(Array.isArray(d)){var s=d[1],f=d[2],n=d.length>3,a=s>=5,I,P;if(a?(I=l,s=s-5,b=b||[],P=b):(I=l.prototype,o=o||[],P=o),s!==0&&!n){var E=a?T:p,g=E.get(f)||0;if(g===!0||g===3&&s!==4||g===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!g&&s>2?E.set(f,s):E.set(f,!0)}m(c,I,d,f,s,a,n,P,h)}}return w(c,o),w(c,b),c}function w(l,r){r&&l.push(function(h){for(var c=0;c<r.length;c++)r[c].call(h);return h})}function D(l,r,h){if(r.length>0){for(var c=[],o=l,b=l.name,p=r.length-1;p>=0;p--){var T={v:!1};try{var x=r[p](o,{kind:"class",name:b,addInitializer:y(c,T),metadata:h})}finally{T.v=!0}x!==void 0&&(u(10,x),o=x)}return[S(o,h),function(){for(var d=0;d<c.length;d++)c[d].call(o)}]}}function S(l,r){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:r})}return function(r,h,c,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var p=Object.create(b===void 0?null:b),T=v(r,h,p);return c.length||S(r,p),{e:T,get c(){return D(r,c,p)}}}}function Ni(y,t,e,i){return(Ni=wc())(y,t,e,i)}var Li,Mi,Ri,_i,Si,Po;Li=U({selector:"potatno-function-properties",template:Pi,style:Ii,components:[Yt,Mt]}),Ri=V.state({complexValue:!0});var Ai=class{static{({e:[_i,Si],c:[Po,Mi]}=Ni(this,[[Ri,1,"functionProperties"]],[Li]))}constructor(t=O.use(H)){this.mManager=t,this.mSelectedImportId="",this.mProjectTypes=new Set,this.functionProperties=this.convertFunctionProperties(null),this.mUnsubscribeFunctionUpdate=this.mManager.subscribe(R.Function,()=>{this.functionProperties=this.convertFunctionProperties(this.functionProperties)}),this.mUnsubscribeFunctionSwitch=this.mManager.subscribe(R.Document|R.SpecialActiveFunction,()=>{this.mProjectTypes.clear();for(let[e]of this.mManager.project.types.types)this.mProjectTypes.add(e);this.functionProperties=this.convertFunctionProperties(null)})}mManager;mProjectTypes;mSelectedImportId;mUnsubscribeFunctionUpdate;mUnsubscribeFunctionSwitch;#t=(Si(this),_i(this));get functionProperties(){return this.#t}set functionProperties(t){this.#t=t}get projectTypes(){return this.mProjectTypes}get selectedImportId(){return this.mSelectedImportId}set selectedImportId(t){this.mSelectedImportId=t}get unusedImports(){return this.mManager.activeFunction.project.imports.filter(t=>!this.functionProperties.imports.find(e=>t.id===e.id))}addPort(t){let e=this.projectTypes.values().next().value;if(!e)return;let i=t===this.functionProperties.inputs?"Input":"Output";this.resetNewState(),t.push({new:!0,label:i,dataType:e,hasError:!1}),this.submitChange()}addSelectedImport(){let t=this.unusedImports;if(t.length===0)return;let e=t.find(i=>i.id===this.mSelectedImportId);e||(e=t.at(0)),this.resetNewState(),this.functionProperties.imports.push({new:!0,id:e.id,label:e.label}),this.submitChange()}deleteImport(t){let e=this.functionProperties.imports.indexOf(t);e!==-1&&(this.functionProperties.imports.splice(e,1),this.resetNewState(),this.submitChange())}deletePort(t,e){let i=e.indexOf(t);i!==-1&&(e.splice(i,1),this.resetNewState(),this.submitChange())}onDeconstruct(){this.mUnsubscribeFunctionUpdate(),this.mUnsubscribeFunctionSwitch()}async submitChange(){let t=!1,e=new Set;for(let v of this.functionProperties.inputs)v.hasError=e.has(v.label),t||=v.hasError,e.add(v.label);let i=new Set;for(let v of this.functionProperties.outputs)v.hasError=i.has(v.label),t||=v.hasError,i.add(v.label);if(t){this.functionProperties=this.functionProperties;return}let u=this.mManager.activeFunction,m=this.functionProperties;await new Promise(v=>{globalThis.setTimeout(v,10)}),this.mManager.graph.updateFunction(u,v=>{if(v.label=m.label,!m.statics.inputs){for(;v.inputs.length>0;)v.removeInput(v.inputs.at(0));for(let w of m.inputs)v.addInput({dataType:w.dataType,label:w.label})}if(!m.statics.outputs){for(;v.outputs.length>0;)v.removeOutput(v.outputs.at(0));for(let w of m.outputs)v.addOutput({dataType:w.dataType,label:w.label})}if(!m.statics.imports){for(let w of v.imports)v.removeImport(w);for(let w of m.imports)v.addImport(w.id)}})}convertFunctionProperties(t){let e={label:"",inputs:new Array,outputs:new Array,imports:new Array,statics:{label:!0,imports:!0,inputs:!0,outputs:!0}},i=this.mManager.activeFunction,u=i.project.getFunction(i.definitionId);u&&(e.statics.label=i.isSystem,e.statics.imports=(u.statics&zt.imports)!==0,e.statics.inputs=(u.statics&zt.inputs)!==0,e.statics.outputs=(u.statics&zt.outputs)!==0),e.label=i.label;for(let m of i.project.imports){if(!i.imports.has(m.id))continue;let v=t?t.imports.find(D=>D.id===m.id)?.new??!1:!1;e.imports.push({new:v,id:m.id,label:m.label})}for(let m of i.inputs){let v=t?t.inputs.find(D=>D.label===m.label)?.new??!1:!1;e.inputs.push({new:v,label:m.label,dataType:m.dataType,hasError:!1})}for(let m of i.outputs){let v=t?t.outputs.find(D=>D.label===m.label)?.new??!1:!1;e.outputs.push({new:v,label:m.label,dataType:m.dataType,hasError:!1})}return e}resetNewState(){for(let t of this.functionProperties.inputs)t.new=!1;for(let t of this.functionProperties.outputs)t.new=!1;for(let t of this.functionProperties.imports)t.new=!1}static{Mi()}};var Oi=`:host {\r
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
    --popup-border-radius: var(--potatno-border-radius);\r
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
        padding: 0.3rem 0.5rem;\r
        outline: none;\r
\r
        /* Mistreat border as fake background. Add 1px for a transparent border replacement */\r
        border: calc(0.3rem + 1px) solid var(--potatno-color-background-light);\r
\r
        color: var(--potatno-color-text);\r
        background-color: var(--potatno-color-background);\r
\r
        font-family: var(--potatno-font-family);\r
        font-size: var(--potatno-font-size);\r
    }\r
\r
    .selection-popup__results {\r
        overflow-x: hidden;\r
        overflow-y: auto;\r
        padding: 0.3rem;\r
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
        padding: 0.3rem 0.5rem;\r
        margin: 0 0 0.3rem 0;\r
        border-radius: 4px;\r
        align-items: center;\r
        text-align: left;\r
        color: var(--potatno-color-text);\r
        cursor: pointer;\r
        transition: background-color 0.15s, scale 0.15s;\r
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
            padding: 0 0.8rem;\r
            width: 1.5ch;\r
            height: 1.5rem;\r
\r
            color: var(--potatno-color-accent);\r
            border-left: 0.25rem solid var(--item-color);\r
\r
            /* That centers a single character at its center line. */\r
            line-height: 0;\r
        }\r
\r
        .selection-popup__result-label {\r
            flex: 1;\r
            padding: 0 0.5rem 0 0;\r
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
        padding: 16rem 0.625rem;\r
        text-align: center;\r
        font-size: var(--potatno-font-size-small);\r
\r
        /* Darken text color by mixing in the background colorl */\r
        color: color-mix(in srgb, var(--potatno-color-text) 50%, var(--potatno-color-background-dark));\r
    }\r
}`;var Fi=`<kg-popup class="selection-popup" animate="top" (pointerdown)="this.stopPropagation($event, false)" (wheel)="this.stopPropagation($event, false)" (contextmenu)="this.stopPropagation($event, true);">\r
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
`;function Dc(){function y(l,r){return function(c){e(r,"addInitializer"),i(c,"An initializer"),l.push(c)}}function t(l,r,h,c,o,b,p,T,x){var d;switch(o){case 1:d="accessor";break;case 2:d="method";break;case 3:d="getter";break;case 4:d="setter";break;default:d="field"}var s={kind:d,name:p?"#"+r:r,static:b,private:p,metadata:T},f={v:!1};s.addInitializer=y(c,f);var n,a;if(o===0?p?(n=h.get,a=h.set):(n=function(){return this[r]},a=function(g){this[r]=g}):o===2?n=function(){return h.value}:((o===1||o===3)&&(n=function(){return h.get.call(this)}),(o===1||o===4)&&(a=function(g){h.set.call(this,g)})),p)s.access=n&&a?{get:n,set:a}:n?{get:n}:{set:a};else{if(n){var I=n;n=function(g){return arguments.length===0&&(g=this),I.call(g)}}if(a){var P=a;a=function(g,_){return arguments.length===1&&(_=g,g=this),P.call(g,_)}}var E=function(g){return r in g};s.access=n&&a?{has:E,get:n,set:a}:n?{has:E,get:n}:{has:E,set:a}}try{return l(x,s)}finally{f.v=!0}}function e(l,r){if(l.v)throw new Error("attempted to call "+r+" after decoration was finished")}function i(l,r){if(typeof l!="function")throw new TypeError(r+" must be a function")}function u(l,r){var h=typeof r;if(l===1){if(h!=="object"||r===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");r.get!==void 0&&i(r.get,"accessor.get"),r.set!==void 0&&i(r.set,"accessor.set"),r.init!==void 0&&i(r.init,"accessor.init")}else if(h!=="function"){var c;throw l===0?c="field":l===10?c="class":c="method",new TypeError(c+" decorators must return a function or void 0")}}function m(l,r,h,c,o,b,p,T,x){var d=h[0],s,f,n;p?o===0||o===1?s={get:h[3],set:h[4]}:o===3?s={get:h[3]}:o===4?s={set:h[3]}:s={value:h[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(r,c)),o===1?n={get:s.get,set:s.set}:o===2?n=s.value:o===3?n=s.get:o===4&&(n=s.set);var a,I,P;if(typeof d=="function")a=t(d,c,s,T,o,b,p,x,n),a!==void 0&&(u(o,a),o===0?f=a:o===1?(f=a.init,I=a.get||n.get,P=a.set||n.set,n={get:I,set:P}):n=a);else for(var E=d.length-1;E>=0;E--){var g=d[E];if(a=t(g,c,s,T,o,b,p,x,n),a!==void 0){u(o,a);var _;o===0?_=a:o===1?(_=a.init,I=a.get||n.get,P=a.set||n.set,n={get:I,set:P}):n=a,_!==void 0&&(f===void 0?f=_:typeof f=="function"?f=[f,_]:f.push(_))}}if(o===0||o===1){if(f===void 0)f=function(M,C){return C};else if(typeof f!="function"){var F=f;f=function(M,C){for(var N=C,L=0;L<F.length;L++)N=F[L].call(M,N);return N}}else{var j=f;f=function(M,C){return j.call(M,C)}}l.push(f)}o!==0&&(o===1?(s.get=n.get,s.set=n.set):o===2?s.value=n:o===3?s.get=n:o===4&&(s.set=n),p?o===1?(l.push(function(M,C){return n.get.call(M,C)}),l.push(function(M,C){return n.set.call(M,C)})):o===2?l.push(n):l.push(function(M,C){return n.call(M,C)}):Object.defineProperty(r,c,s))}function v(l,r,h){for(var c=[],o,b,p=new Map,T=new Map,x=0;x<r.length;x++){var d=r[x];if(Array.isArray(d)){var s=d[1],f=d[2],n=d.length>3,a=s>=5,I,P;if(a?(I=l,s=s-5,b=b||[],P=b):(I=l.prototype,o=o||[],P=o),s!==0&&!n){var E=a?T:p,g=E.get(f)||0;if(g===!0||g===3&&s!==4||g===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!g&&s>2?E.set(f,s):E.set(f,!0)}m(c,I,d,f,s,a,n,P,h)}}return w(c,o),w(c,b),c}function w(l,r){r&&l.push(function(h){for(var c=0;c<r.length;c++)r[c].call(h);return h})}function D(l,r,h){if(r.length>0){for(var c=[],o=l,b=l.name,p=r.length-1;p>=0;p--){var T={v:!1};try{var x=r[p](o,{kind:"class",name:b,addInitializer:y(c,T),metadata:h})}finally{T.v=!0}x!==void 0&&(u(10,x),o=x)}return[S(o,h),function(){for(var d=0;d<c.length;d++)c[d].call(o)}]}}function S(l,r){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:r})}return function(r,h,c,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var p=Object.create(b===void 0?null:b),T=v(r,h,p);return c.length||S(r,p),{e:T,get c(){return D(r,c,p)}}}}function Hi(y,t,e,i){return(Hi=Dc())(y,t,e,i)}function Ec(y){return y}var Xi,zi,Yi,Wi,Zi,qi,Ji,Ki,ji,Vi,Bi,$i,Gi,Ui,le;Xi=U({selector:"potatno-node-selection-popup",template:Fi,style:Oi,components:[se]}),Yi=B(),Wi=V.state({complexValue:!0}),Zi=yt("searchInput"),qi=rt("node-select"),Ji=V.state(),Ki=V.state();new class extends Ec{constructor(){super(le),zi()}static{class y{static{({e:[ji,Vi,Bi,$i,Gi,Ui],c:[le,zi]}=Hi(this,[[Yi,3,"contextport"],[Wi,1,"results"],[Zi,1,"searchInput"],[qi,1,"mNodeSelect"],[Ji,1,"searchValue"],[Ki,1,"selectedDefinitionId"]],[Xi]))}static POPUP_HEIGHT=320;static POPUP_WIDTH=280;mComponent;mManager;mNodes;get contextport(){return this.mNodes.context}set contextport(e){this.mNodes.context=e,this.mNodes.list.filtered=this.contexturizeNodeList(this.mNodes.context)}#t=(Ui(this),ji(this));get results(){return this.#t}set results(e){this.#t=e}#e=Vi(this);get searchInput(){return this.#e}set searchInput(e){this.#e=e}#o=Bi(this);get mNodeSelect(){return this.#o}set mNodeSelect(e){this.#o=e}#r=$i(this);get searchValue(){return this.#r}set searchValue(e){this.#r=e}#n=Gi(this);get selectedDefinitionId(){return this.#n}set selectedDefinitionId(e){this.#n=e}constructor(e=O.use(G),i=O.use(H)){this.mManager=i,this.mComponent=e,this.selectedDefinitionId=null,this.results=new Array,this.searchValue="";let u=this.fetchNodeEntries();this.mNodes={context:null,list:{full:u,filtered:u}}}onConnect(){this.searchInput?.focus()}onKeyDown(e){if(this.results.length!==0){if(e.key==="ArrowDown"||e.key==="ArrowUp"){e.preventDefault();let i=this.results.findIndex(v=>v.definition.id===this.selectedDefinitionId);i=Math.max(0,i);let u=e.key==="ArrowDown"?1:-1,m=(i+u+this.results.length)%this.results.length;this.selectedDefinitionId=this.results[m].definition.id;return}e.key==="Enter"&&this.sendSelectedEntry(this.selectedDefinitionId)}}onUpdate(){this.results=this.filterResults(),this.results.some(i=>i.definition.id===this.selectedDefinitionId)||(this.selectedDefinitionId=this.results[0]?.definition.id??null);let e=this.mComponent.element.shadowRoot.querySelector(".selection-popup__result.selected");e&&e.scrollIntoView({block:"center"})}stopPropagation(e,i){e.stopPropagation(),i&&e.preventDefault()}contexturizeNodeList(e){return e?this.mNodes.list.full.filter(i=>!!this.findMatchingPortDefinition(e,i.definition)):this.mNodes.list.full}fetchNodeEntries(){return this.mManager.activeFunction.dynamicNodeDefinitions.map(e=>({category:e.category.name,definition:e,label:e.label.toLowerCase(),color:this.mManager.generateStringColor(e.category.name),icon:e.category.icon}))}filterResults(){let e=this.searchValue.trim().toLowerCase();return this.mNodes.list.filtered.filter(i=>i.label.includes(e))}findMatchingPortDefinition(e,i){let u=e.direction==="input"?i.outputs:i.inputs;for(let m of u)if(m.portType===e.portType&&m.dataType===e.dataType)return m;return null}sendSelectedEntry(e){if(e===null)return;let i=this.results.find(u=>u.definition.id===e);i&&this.mNodeSelect.dispatchEvent({definition:i.definition,port:this.mNodes.context?{source:this.mNodes.context,target:this.findMatchingPortDefinition(this.mNodes.context,i.definition)}:null})}}}};var Qi=`:host {\r
    --node-border-color: color-mix(in srgb, var(--potatno-color-text) 30%, var(--potatno-color-background));\r
    --node-comment-color: var(--potatno-color-accent);\r
\r
    display: block;\r
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
    --resize-box-handle-hover-color: var(--potatno-color-accent);\r
\r
    box-sizing: border-box;\r
    display: flex;\r
    flex-direction: column;\r
    min-height: 100%;\r
    padding: 4px;\r
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
    background-image: linear-gradient(180deg,  var(--background-50-color) 0px, transparent 100%);\r
\r
    &.edit {\r
        --node-comment-color: var(--potatno-color-background);\r
        background-color: var(--potatno-color-background-dark);\r
    }\r
\r
    .node__glow {\r
        position: absolute;\r
        display: flex;\r
        flex-direction: column;\r
        align-items: center;\r
        inset: 0px;\r
\r
        /* Allways on back */\r
        z-index: -1;\r
\r
        .glow-select {\r
            flex-shrink: 0;\r
            height: 0px;\r
            margin: 19px 0;\r
\r
            width: 0px;\r
            box-shadow: 0 0 20px 12px transparent;\r
            transition: width 0.15s, box-shadow 0.15s;\r
\r
            .selected & {\r
                width: 100%;\r
                box-shadow: 0 0 20px 12px var(--node-comment-color);;\r
            }\r
        }\r
    }\r
}\r
\r
.node-header {\r
    display: flex;\r
    align-items: center;\r
    color: var(--potatno-color-text);\r
    font-weight: bold;\r
    font-size: 16px;\r
    overflow: hidden;\r
    cursor: grab;\r
\r
    /* Same border radius as node, because we cant set overflow hidden on parent. */\r
    border: 1px solid var(--potatno-color-border);\r
    border-radius: var(--potatno-border-radius);\r
\r
    /* Move only the header out of the resize handle visible range. +2 for the exit border so it doesnt shift on edit mode. */\r
    height: calc(var(--potatno-grid-size) - 2px);\r
\r
    /* Animated background of header */\r
    background-image: linear-gradient(90deg, var(--potatno-color-background-dark) 0%, var(--potatno-color-background) 100%);\r
\r
    /* Disabled in node. Enabled again. */\r
    pointer-events: all;\r
\r
    &:active {\r
        cursor: grabbing;\r
    }\r
\r
    .node-header__bar {\r
        width: 4px;\r
        height: calc(100% - 10px);\r
        margin: 0 0 0 8px;\r
        background-color: var(--potatno-color-accent);\r
\r
        transition: box-shadow 0.15s ease-in, background-color 0.15s ease-in;\r
\r
        .selected & {\r
            background-color: color-mix(in srgb, var(--potatno-color-accent) 90%, #fff);\r
            box-shadow: 7px 0px 40px 15px var(--potatno-color-accent);\r
        }\r
\r
        .node-header:hover & {\r
            background-color: color-mix(in srgb, var(--potatno-color-accent) 70%, #fff);\r
            box-shadow: 15px 0px 45px 20px var(--potatno-color-accent);\r
        }\r
\r
        .node-header:active & {\r
            background-color: color-mix(in srgb, var(--potatno-color-accent) 50%, #fff);\r
            box-shadow: 20px 0px 55px 28px var(--potatno-color-accent);\r
        }\r
\r
        .edit .node-header & {\r
            background-color: var(--potatno-color-accent);\r
            box-shadow: none;\r
        }\r
    }\r
\r
    .node-header__icon {\r
        flex-shrink: 0;\r
        display: flex;\r
        align-items: center;\r
        justify-content: center;\r
        width: calc(var(--potatno-grid-size) - 2px);\r
\r
        /* That centers a single character at its center line. */\r
        line-height: 0;\r
    }\r
\r
    .edit & {\r
        background-color: var(--potatno-color-background-light);\r
        border: 1px solid var(--potatno-color-accent);\r
        border-radius: var(--potatno-border-radius);\r
\r
        /* Reset grab cursor */\r
        cursor: default;\r
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
        color: var(--potatno-color-text);\r
        font-family: var(--potatno-font-family);\r
        font-weight: bold;\r
        font-size: 16px;\r
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
        text-shadow: 0.05rem 0.05rem 0.2rem #000000;\r
    }\r
}`;var ki=`<!-- Resizeable part of node -->\r
<kg-resize-box #ResizeBox class="node {{this.editMode ? 'edit' : ''}} {{this.selected ? 'selected' : ''}}" top right bottom left virtual [snap]="this.gridSize" (resize)="this.transformNodeData($event.value)">\r
    <div class="node-header" (pointerdown)="this.dragNodeOrEnableEdit($event)" (dblclick)="this.editMode = true;">\r
        <span class="node-header__bar"></span>\r
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
\r
    <!-- Selection and error indication -->\r
    <div class="node__glow">\r
        <div class="glow-select"></div>\r
        <div class="glow-error"></div>\r
    </div>\r
</kg-resize-box>\r
\r
<div style="--zoom-factor: {{this.gridZoom}}; --comment-node-height: {{this.nodeData?.transformation.height}}; --comment-node-width: {{this.nodeData?.transformation.width}};" class="satellite-view {{this.enableBigview ? 'enabled' : ''}}">\r
    <!-- Div needed to decouple inner text from size restriction of satellite-view flex -->\r
    <div>\r
        <div class="satellite-view__text">{{this.comment}}</div>\r
    </div>\r
</div>\r
`;function Pc(){function y(l,r){return function(c){e(r,"addInitializer"),i(c,"An initializer"),l.push(c)}}function t(l,r,h,c,o,b,p,T,x){var d;switch(o){case 1:d="accessor";break;case 2:d="method";break;case 3:d="getter";break;case 4:d="setter";break;default:d="field"}var s={kind:d,name:p?"#"+r:r,static:b,private:p,metadata:T},f={v:!1};s.addInitializer=y(c,f);var n,a;if(o===0?p?(n=h.get,a=h.set):(n=function(){return this[r]},a=function(g){this[r]=g}):o===2?n=function(){return h.value}:((o===1||o===3)&&(n=function(){return h.get.call(this)}),(o===1||o===4)&&(a=function(g){h.set.call(this,g)})),p)s.access=n&&a?{get:n,set:a}:n?{get:n}:{set:a};else{if(n){var I=n;n=function(g){return arguments.length===0&&(g=this),I.call(g)}}if(a){var P=a;a=function(g,_){return arguments.length===1&&(_=g,g=this),P.call(g,_)}}var E=function(g){return r in g};s.access=n&&a?{has:E,get:n,set:a}:n?{has:E,get:n}:{has:E,set:a}}try{return l(x,s)}finally{f.v=!0}}function e(l,r){if(l.v)throw new Error("attempted to call "+r+" after decoration was finished")}function i(l,r){if(typeof l!="function")throw new TypeError(r+" must be a function")}function u(l,r){var h=typeof r;if(l===1){if(h!=="object"||r===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");r.get!==void 0&&i(r.get,"accessor.get"),r.set!==void 0&&i(r.set,"accessor.set"),r.init!==void 0&&i(r.init,"accessor.init")}else if(h!=="function"){var c;throw l===0?c="field":l===10?c="class":c="method",new TypeError(c+" decorators must return a function or void 0")}}function m(l,r,h,c,o,b,p,T,x){var d=h[0],s,f,n;p?o===0||o===1?s={get:h[3],set:h[4]}:o===3?s={get:h[3]}:o===4?s={set:h[3]}:s={value:h[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(r,c)),o===1?n={get:s.get,set:s.set}:o===2?n=s.value:o===3?n=s.get:o===4&&(n=s.set);var a,I,P;if(typeof d=="function")a=t(d,c,s,T,o,b,p,x,n),a!==void 0&&(u(o,a),o===0?f=a:o===1?(f=a.init,I=a.get||n.get,P=a.set||n.set,n={get:I,set:P}):n=a);else for(var E=d.length-1;E>=0;E--){var g=d[E];if(a=t(g,c,s,T,o,b,p,x,n),a!==void 0){u(o,a);var _;o===0?_=a:o===1?(_=a.init,I=a.get||n.get,P=a.set||n.set,n={get:I,set:P}):n=a,_!==void 0&&(f===void 0?f=_:typeof f=="function"?f=[f,_]:f.push(_))}}if(o===0||o===1){if(f===void 0)f=function(M,C){return C};else if(typeof f!="function"){var F=f;f=function(M,C){for(var N=C,L=0;L<F.length;L++)N=F[L].call(M,N);return N}}else{var j=f;f=function(M,C){return j.call(M,C)}}l.push(f)}o!==0&&(o===1?(s.get=n.get,s.set=n.set):o===2?s.value=n:o===3?s.get=n:o===4&&(s.set=n),p?o===1?(l.push(function(M,C){return n.get.call(M,C)}),l.push(function(M,C){return n.set.call(M,C)})):o===2?l.push(n):l.push(function(M,C){return n.call(M,C)}):Object.defineProperty(r,c,s))}function v(l,r,h){for(var c=[],o,b,p=new Map,T=new Map,x=0;x<r.length;x++){var d=r[x];if(Array.isArray(d)){var s=d[1],f=d[2],n=d.length>3,a=s>=5,I,P;if(a?(I=l,s=s-5,b=b||[],P=b):(I=l.prototype,o=o||[],P=o),s!==0&&!n){var E=a?T:p,g=E.get(f)||0;if(g===!0||g===3&&s!==4||g===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!g&&s>2?E.set(f,s):E.set(f,!0)}m(c,I,d,f,s,a,n,P,h)}}return w(c,o),w(c,b),c}function w(l,r){r&&l.push(function(h){for(var c=0;c<r.length;c++)r[c].call(h);return h})}function D(l,r,h){if(r.length>0){for(var c=[],o=l,b=l.name,p=r.length-1;p>=0;p--){var T={v:!1};try{var x=r[p](o,{kind:"class",name:b,addInitializer:y(c,T),metadata:h})}finally{T.v=!0}x!==void 0&&(u(10,x),o=x)}return[S(o,h),function(){for(var d=0;d<c.length;d++)c[d].call(o)}]}}function S(l,r){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:r})}return function(r,h,c,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var p=Object.create(b===void 0?null:b),T=v(r,h,p);return c.length||S(r,p),{e:T,get c(){return D(r,c,p)}}}}function us(y,t,e,i){return(us=Pc())(y,t,e,i)}var hs,ts,fs,ds,ms,ps,gs,vs,ys,bs,ws,es,os,rs,ns,is,ss,as,ls,_o;hs=U({selector:"potatno-comment-node",template:ki,style:Qi,components:[Yt]}),fs=V.state(),ds=V.state(),ms=V.state(),ps=B(),gs=B(),vs=yt("CommentInput"),ys=rt("node-drag"),bs=yt("ResizeBox"),ws=V.state();var cs=class{static{({e:[es,os,rs,ns,is,ss,as,ls],c:[_o,ts]}=us(this,[[fs,1,"editMode"],[ds,1,"enableBigview"],[ms,1,"gridZoom"],[ps,3,"nodeData"],[gs,3,"selected"],[vs,1,"mCommentInput"],[ys,1,"mDrag"],[bs,1,"mResizeBox"],[ws,1,"mSelected"]],[hs]))}constructor(t=O.use(G),e=O.use(H)){this.mComponent=t,this.mManager=e,this.mNodeData=null,this.mSelected=!1,this.editMode=!1,this.enableBigview=!1,this.gridZoom=0,this.updateForZoomLevel(),this.mUnsubscribeGrid=this.mManager.subscribe(R.SpecialGrid,()=>{this.updateForZoomLevel()}),this.mUnsubscribe=this.mManager.subscribe(R.Node,i=>{i.item===this.mNodeData&&this.resyncComponent(this.nodeData)})}mComponent;mManager;mNodeData;mUnsubscribe;mUnsubscribeGrid;get comment(){return this.nodeData.label??""}set comment(t){this.nodeData.label=t}#t=(ls(this),es(this));get editMode(){return this.#t}set editMode(t){this.#t=t}#e=os(this);get enableBigview(){return this.#e}set enableBigview(t){this.#e=t}#o=rs(this);get gridZoom(){return this.#o}set gridZoom(t){this.#o=t}get gridSize(){return this.mManager.grid.gridSize}get nodeData(){if(!this.mNodeData)throw new A("Node data not set.",this);return this.mNodeData}set nodeData(t){this.mNodeData=t,t&&(this.resyncComponent(t),this.mComponent.updater.update())}get selected(){return this.mSelected}set selected(t){this.mSelected=this.parseBoolean(t)}#r=ns(this);get mCommentInput(){return this.#r}set mCommentInput(t){this.#r=t}#n=is(this);get mDrag(){return this.#n}set mDrag(t){this.#n=t}#i=ss(this);get mResizeBox(){return this.#i}set mResizeBox(t){this.#i=t}#s=as(this);get mSelected(){return this.#s}set mSelected(t){this.#s=t}dragNodeOrEnableEdit(t){if(this.editMode||(t.preventDefault(),t.button===2&&this.mManager.graph.removeNode(this.nodeData),t.button!==0))return;let e=this.nodeData.transformation.x*this.mManager.grid.gridSize,i=this.nodeData.transformation.y*this.mManager.grid.gridSize,u=this.nodeData.transformation.x,m=this.nodeData.transformation.y,v=this.mComponent.element.getBoundingClientRect(),w=this.mComponent.element.offsetWidth?v.width/this.mComponent.element.offsetWidth:1,D=this.mComponent.element.offsetHeight?v.height/this.mComponent.element.offsetHeight:1,S=t.clientX,l=t.clientY,r=c=>{c.stopPropagation();let o=(c.clientX-S)/w,b=(c.clientY-l)/D,p=Math.round((e+o)/this.mManager.grid.gridSize),T=Math.round((i+b)/this.mManager.grid.gridSize);u===p&&m===T||(this.mManager.graph.transformNode(this.nodeData,x=>{x.moveTo(p,T)}),this.mDrag.dispatchEvent(new Mo(p-u,T-m)),u=p,m=T)},h=()=>{document.removeEventListener("pointermove",r),document.removeEventListener("pointerup",h)};document.addEventListener("pointermove",r),document.addEventListener("pointerup",h)}escapeEditMode(t){(t.key==="Escape"||t.key==="Enter")&&(t.preventDefault(),this.editMode=!1)}onConnect(){this.resyncComponent(this.nodeData)}onDeconstruct(){this.mUnsubscribe(),this.mUnsubscribeGrid()}onUpdate(){this.mCommentInput&&this.getFocusedElement(document)!==this.mCommentInput&&this.mCommentInput.select()}transformNodeData(t){this.mManager.graph.transformNode(this.nodeData,e=>{let i=e.transformation.width,u=e.transformation.height;console.log(t.width/this.mManager.grid.gridSize,t.height/this.mManager.grid.gridSize),e.resizeTo(t.width/this.mManager.grid.gridSize,t.height/this.mManager.grid.gridSize);let m=e.transformation.width-i,v=e.transformation.height-u;v!==0&&(t.resizeHandle&bt.top)>0&&e.moveTo(e.transformation.x,e.transformation.y-v),m!==0&&(t.resizeHandle&bt.left)>0&&e.moveTo(e.transformation.x-m,e.transformation.y)})}getFocusedElement(t){let e=t.activeElement;return e?e.shadowRoot?this.getFocusedElement(e.shadowRoot):e:null}parseBoolean(t){if(typeof t=="string"){if(t==="")return!0;let e=t.toLowerCase();if(e==="true"||e==="false")return e==="true"}return!!t}resyncComponent(t){let e=t.transformation.x,i=t.transformation.y;if(this.mComponent.element.style.setProperty("left",`calc(var(--potatno-grid-size) * ${e})`),this.mComponent.element.style.setProperty("top",`calc(var(--potatno-grid-size) * ${i} - 8px)`),this.mResizeBox){let u=t.transformation.width*this.mManager.grid.gridSize,m=t.transformation.height*this.mManager.grid.gridSize;this.mResizeBox.width=u,this.mResizeBox.height=m}this.mComponent.updater.updateAsync()}updateForZoomLevel(){this.enableBigview=this.mManager.grid.zoom<.25,this.enableBigview&&(this.gridZoom=this.mManager.grid.zoom),this.mComponent.element.style.setProperty("z-index",(this.enableBigview?9999:-1).toString())}static{ts()}},Mo=class{mX;mY;get x(){return this.mX}get y(){return this.mY}constructor(t,e){this.mX=t,this.mY=e}};var xs=`:host {
    --potatno-port-value-size: 6px;
    --potatno-port-flow-size: 16px;
    --potatno-port-width: max(var(--potatno-port-value-size), var(--potatno-port-flow-size));

    /* Give the handle a fixed width and center the content. Child are overflowing but the parent can position based on the absolute center */
    display: flex;
    justify-content: center;
    width: 10px;

    /* The connect slide-out and glow shadow must not be clipped. */
    overflow: visible;

    /* Purely visual. Drag and hover are handled by the parent. */
    pointer-events: none;
}

.handle {
    /* Base color, provided per instance. The connect animation drives --potatno-port-handle-color from it. */
    --type-color: var(--potatno-color-text);
    --potatno-port-handle-color: var(--type-color);

    position: relative;

    /* Animate the connect slide-out. */
    transition: translate 0.1s ease-out;

    /* Flow port: bar with an arrow tip. */
    &.flow {
        display: flex;

        &::before {
            content: '';

            height: calc((var(--potatno-port-flow-size) / 3) * 2);
            width: calc((var(--potatno-port-flow-size) / 3) * 2);

            background-color: color-mix(in srgb, var(--potatno-port-handle-color) 30%, var(--potatno-color-background));
        }

        &.connected::before {
            background-color: var(--potatno-port-handle-color);
        }

        &.error::before {
            background-color: var(--potatno-color-error);
        }

        &::after {
            content: '';
            position: relative;
            height: 0;
            width: 0;

            border-bottom: calc(var(--potatno-port-flow-size) / 3) solid transparent;
            border-top: calc(var(--potatno-port-flow-size) / 3) solid transparent;
        }

        &.output {
            &::after {
                right: 0px;
                border-left: calc(var(--potatno-port-flow-size) / 3) solid color-mix(in srgb, var(--potatno-port-handle-color) 30%, var(--potatno-color-background));
            }

            &::before {
                border-radius: 2px 0 0 2px;
            }

            &.connected::after {
                border-left-color: var(--potatno-port-handle-color);
            }

            &.error::after {
                border-left-color: var(--potatno-color-error);
            }

            /* Slide out towards the connection wire on connect. */
            &.connected {
                translate: 5px 0;
                animation: animateOutputConnect var(--potatno-connection-animation) ease-in-out 0s forwards;
            }
        }

        &.input {
            /* Arrow tip on the left. */
            flex-direction: row-reverse;

            &::after {
                left: 0px;
                border-right: calc(var(--potatno-port-flow-size) / 3) solid color-mix(in srgb, var(--potatno-port-handle-color) 30%, var(--potatno-color-background));
            }

            &::before {
                border-radius: 0 2px 2px 0;
            }

            &.connected::after {
                border-right-color: var(--potatno-port-handle-color);
            }

            &.error::after {
                border-right-color: var(--potatno-color-error);
            }

            /* Slide out towards the connection wire on connect. Delayed to stay in sync with the delayed glow. */
            &.connected {
                translate: -5px 0;
                transition-delay: calc(var(--potatno-connection-animation) * 0.7);
                animation: animateInputConnect calc(var(--potatno-connection-animation) * 0.5) ease-out calc(var(--potatno-connection-animation) * 0.7) forwards;
            }
        }
    }

    /* Value port: round dot. */
    &.value {
        border: 1px solid var(--potatno-port-handle-color);
        border-radius: 50%;
        height: calc(var(--potatno-port-value-size) - 1px);
        width: calc(var(--potatno-port-value-size) - 1px);
        background-color: color-mix(in srgb, var(--potatno-port-handle-color) 30%, var(--potatno-color-background));

        /* This tr\xEDes to fix a very small offset, that comes from somewhere???  */
        transform: translateY(-0.2px);

        &.connected {
            background-color: var(--potatno-port-handle-color);
        }

        &.error {
            background-color: var(--potatno-color-error);
            border-color: var(--potatno-color-error);
        }

        &.output.connected {
            translate: 5px 0;
            animation: animateOutputConnect var(--potatno-connection-animation) ease-in-out forwards;
        }

        &.input.connected {
            translate: -5px 0;
            transition-delay: calc(var(--potatno-connection-animation) * 0.7);
            animation: animateInputConnect calc(var(--potatno-connection-animation) * 0.5) ease-out forwards;
            animation-delay: calc(var(--potatno-connection-animation) * 0.7);
        }
    }
}

@keyframes animateOutputConnect {
    0% {
        filter: drop-shadow(0px 0px 0px var(--potatno-port-handle-color));
        --potatno-port-handle-color: var(--type-color);
    }

    23% {
        filter: drop-shadow(0px 0px 5px var(--potatno-port-handle-color));
        --potatno-port-handle-color: color-mix(in srgb, var(--type-color) 50%, #fff);
    }

    50% {
        filter: drop-shadow(0px 0px 5px var(--potatno-port-handle-color));
        --potatno-port-handle-color: color-mix(in srgb, var(--type-color) 50%, #fff);
    }

    100% {
        filter: drop-shadow(0px 0px 0px var(--potatno-port-handle-color));
        --potatno-port-handle-color: var(--type-color);
    }
}

@keyframes animateInputConnect {
    0% {
        filter: drop-shadow(0px 0px 5px var(--potatno-port-handle-color));
        --potatno-port-handle-color: color-mix(in srgb, var(--type-color) 50%, #fff);
    }

    100% {
        filter: drop-shadow(0px 0px 0px var(--potatno-port-handle-color));
        --potatno-port-handle-color: var(--type-color);
    }
}
`;var Ts=`$if(this.hasPort) {
    <div class="handle {{this.portType}} {{this.portDirection}} {{this.connected ? 'connected' : ''}} {{this.hasError ? 'error' : ''}}" style="--type-color: {{this.portColor}}"></div>
}
`;function Sc(){function y(l,r){return function(c){e(r,"addInitializer"),i(c,"An initializer"),l.push(c)}}function t(l,r,h,c,o,b,p,T,x){var d;switch(o){case 1:d="accessor";break;case 2:d="method";break;case 3:d="getter";break;case 4:d="setter";break;default:d="field"}var s={kind:d,name:p?"#"+r:r,static:b,private:p,metadata:T},f={v:!1};s.addInitializer=y(c,f);var n,a;if(o===0?p?(n=h.get,a=h.set):(n=function(){return this[r]},a=function(g){this[r]=g}):o===2?n=function(){return h.value}:((o===1||o===3)&&(n=function(){return h.get.call(this)}),(o===1||o===4)&&(a=function(g){h.set.call(this,g)})),p)s.access=n&&a?{get:n,set:a}:n?{get:n}:{set:a};else{if(n){var I=n;n=function(g){return arguments.length===0&&(g=this),I.call(g)}}if(a){var P=a;a=function(g,_){return arguments.length===1&&(_=g,g=this),P.call(g,_)}}var E=function(g){return r in g};s.access=n&&a?{has:E,get:n,set:a}:n?{has:E,get:n}:{has:E,set:a}}try{return l(x,s)}finally{f.v=!0}}function e(l,r){if(l.v)throw new Error("attempted to call "+r+" after decoration was finished")}function i(l,r){if(typeof l!="function")throw new TypeError(r+" must be a function")}function u(l,r){var h=typeof r;if(l===1){if(h!=="object"||r===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");r.get!==void 0&&i(r.get,"accessor.get"),r.set!==void 0&&i(r.set,"accessor.set"),r.init!==void 0&&i(r.init,"accessor.init")}else if(h!=="function"){var c;throw l===0?c="field":l===10?c="class":c="method",new TypeError(c+" decorators must return a function or void 0")}}function m(l,r,h,c,o,b,p,T,x){var d=h[0],s,f,n;p?o===0||o===1?s={get:h[3],set:h[4]}:o===3?s={get:h[3]}:o===4?s={set:h[3]}:s={value:h[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(r,c)),o===1?n={get:s.get,set:s.set}:o===2?n=s.value:o===3?n=s.get:o===4&&(n=s.set);var a,I,P;if(typeof d=="function")a=t(d,c,s,T,o,b,p,x,n),a!==void 0&&(u(o,a),o===0?f=a:o===1?(f=a.init,I=a.get||n.get,P=a.set||n.set,n={get:I,set:P}):n=a);else for(var E=d.length-1;E>=0;E--){var g=d[E];if(a=t(g,c,s,T,o,b,p,x,n),a!==void 0){u(o,a);var _;o===0?_=a:o===1?(_=a.init,I=a.get||n.get,P=a.set||n.set,n={get:I,set:P}):n=a,_!==void 0&&(f===void 0?f=_:typeof f=="function"?f=[f,_]:f.push(_))}}if(o===0||o===1){if(f===void 0)f=function(M,C){return C};else if(typeof f!="function"){var F=f;f=function(M,C){for(var N=C,L=0;L<F.length;L++)N=F[L].call(M,N);return N}}else{var j=f;f=function(M,C){return j.call(M,C)}}l.push(f)}o!==0&&(o===1?(s.get=n.get,s.set=n.set):o===2?s.value=n:o===3?s.get=n:o===4&&(s.set=n),p?o===1?(l.push(function(M,C){return n.get.call(M,C)}),l.push(function(M,C){return n.set.call(M,C)})):o===2?l.push(n):l.push(function(M,C){return n.call(M,C)}):Object.defineProperty(r,c,s))}function v(l,r,h){for(var c=[],o,b,p=new Map,T=new Map,x=0;x<r.length;x++){var d=r[x];if(Array.isArray(d)){var s=d[1],f=d[2],n=d.length>3,a=s>=5,I,P;if(a?(I=l,s=s-5,b=b||[],P=b):(I=l.prototype,o=o||[],P=o),s!==0&&!n){var E=a?T:p,g=E.get(f)||0;if(g===!0||g===3&&s!==4||g===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!g&&s>2?E.set(f,s):E.set(f,!0)}m(c,I,d,f,s,a,n,P,h)}}return w(c,o),w(c,b),c}function w(l,r){r&&l.push(function(h){for(var c=0;c<r.length;c++)r[c].call(h);return h})}function D(l,r,h){if(r.length>0){for(var c=[],o=l,b=l.name,p=r.length-1;p>=0;p--){var T={v:!1};try{var x=r[p](o,{kind:"class",name:b,addInitializer:y(c,T),metadata:h})}finally{T.v=!0}x!==void 0&&(u(10,x),o=x)}return[S(o,h),function(){for(var d=0;d<c.length;d++)c[d].call(o)}]}}function S(l,r){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:r})}return function(r,h,c,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var p=Object.create(b===void 0?null:b),T=v(r,h,p);return c.length||S(r,p),{e:T,get c(){return D(r,c,p)}}}}function Is(y,t,e,i){return(Is=Sc())(y,t,e,i)}var Ps,Ds,Ms,_s,Es,Se;Ps=U({selector:"potatno-port-handle",template:Ts,style:xs}),Ms=B(),_s=B();var Cs=class{static{({e:[Es],c:[Se,Ds]}=Is(this,[[Ms,3,"connected"],[_s,3,"port"]],[Ps]))}constructor(t=O.use(G),e=O.use(H)){Es(this),this.mComponent=t,this.mManager=e,this.mPort=null,this.mConnected=!1,this.mUnsubscribe=this.mManager.subscribe(R.Connection|R.SpecialValidation,()=>{this.mComponent.updater.updateAsync()})}mComponent;mManager;mConnected;mPort;mUnsubscribe;get connected(){return this.mConnected}set connected(t){this.mConnected=this.parseBoolean(t),this.mPort&&this.mComponent.updater.updateAsync()}get hasError(){return this.mManager.integrity.errorItems.has(this.port)}get hasPort(){return this.mPort!==null}get port(){if(!this.mPort)throw new A("Port is not setup",this);return this.mPort}set port(t){this.mPort!==t&&(this.mPort=t,this.mComponent.updater.update())}get portColor(){return this.port.portType==="flow"?"var(--potatno-color-text)":this.mManager.generateStringColor(this.port.resolvedDataType)}get portDirection(){return this.port.direction??"output"}get portType(){return this.port.portType}onDeconstruct(){this.mUnsubscribe()}parseBoolean(t){if(typeof t=="string"){if(t==="")return!0;let e=t.toLowerCase();if(e==="true"||e==="false")return e==="true"}return!!t}static{Ds()}};var Ss=`:host {
    --potatno-port-value-size: 6px;
    --potatno-port-flow-size: 16px;
    --potatno-port-width: max(var(--potatno-port-value-size), var(--potatno-port-flow-size));

    display: block;

    /* Snappy animation on movement. */
    transition: var(--potatno-position-snap-animation);
}

.node {
    position: relative;
    overflow: visible;
    user-select: none;

    --potatno-port-color: var(--type-color);
}

.drag-area {
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--potatno-grid-size);
    height: var(--potatno-grid-size);

    cursor: grab;

    /* Create a fake connection line in center. */
    &::after {
        content: '';
        position: absolute;
        height: 2px;
        width: calc(100% - 4px);
        background-color: var(--potatno-port-color);
        border-radius: 1px;
        z-index: -10;

        /* Transition between glow effect */
        transition: background-color 0.15s, box-shadow 0.15s;
    }

    .selected &::after {
        background-color: color-mix(in srgb, var(--potatno-port-color) 50%, #fff);
        box-shadow: 0 0 10px 5px var(--potatno-port-color);
    }
}

.port {
    position: absolute;
    top: 0px;
    display: flex;
    align-items: center;
    width: calc(var(--potatno-grid-size) - 2px);
    height: calc(var(--potatno-grid-size) - 2px);
    border: 1px dashed var(--potatno-port-color);
    cursor: crosshair;
    z-index: -1;

    /* Move both port areas left and right. */
    &.input {
        left: -100%;
    }

    &.output {
        right: -100%;
    }

    /* Full box without border once the handle reports a connection. */
    &:has(> .port__handle[connected]:not([connected='false'])) {
        width: var(--potatno-grid-size);
        height: var(--potatno-grid-size);
        border: none;

        /* Disable area on connected state */
        pointer-events: none;
    }

    /* Small hover animation for ports. */
    &:hover.output .port__handle {
        transform: translateX(-1px);
    }

    &:hover.input .port__handle {
        transform: translateX(1px);
    }

    /* Positioning wrapper. The handle visual and connect animation live in potatno-port-handle. */
    .port__handle {
        position: absolute;
        transition: transform 0.15s ease-in-out;
    }

    &.output .port__handle {
        left: 0px;
        translate: -100% 0;
    }

    &.input .port__handle {
        right: 1px;
        translate: 100% 0;
    }
}

.port-drag-connection {
    position: absolute;
    top: 0;
    height: 1px;
    width: 1px;
    overflow: visible;
    pointer-events: none;

    /* While dragging should stay above all nodes. */
    z-index: 200;

    path {
        fill: none;
        opacity: 0.6;
        pointer-events: none;
        stroke: var(--potatno-port-color);
        stroke-dasharray: 8 4;
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke-width: 2;
    }
}`;var As=`<div class="node {{this.selected ? 'selected' : ''}}" style="--type-color: {{this.portColor}}" (dragover)="this.onDragOver($event)" (drop)="this.onDrop($event)">\r
\r
    <div class="port input" draggable="true" [title]="this.portValueType" (dragstart)="this.onDragStart($event)" (dragend)="this.onDragEnd($event)">\r
        <potatno-port-handle class="port__handle" [port]="this.inputPort" [connected]="this.isInputConnected" />\r
    </div>\r
\r
    <div class="drag-area" (pointerdown)="this.dragNode($event)"/>\r
\r
    <div class="port output" draggable="true" [title]="this.portValueType" (dragstart)="this.onDragStart($event)" (dragend)="this.onDragEnd($event)">\r
        <potatno-port-handle class="port__handle" [port]="this.outputPort" [connected]="this.isOutputConnected" />\r
    </div>\r
\r
    <svg #dragConnection class="port-drag-connection" xmlns="http://www.w3.org/2000/svg">\r
        <path #dragPath xmlns="http://www.w3.org/2000/svg"></path>\r
    </svg>\r
\r
</div>\r
    `;function Lc(){function y(l,r){return function(c){e(r,"addInitializer"),i(c,"An initializer"),l.push(c)}}function t(l,r,h,c,o,b,p,T,x){var d;switch(o){case 1:d="accessor";break;case 2:d="method";break;case 3:d="getter";break;case 4:d="setter";break;default:d="field"}var s={kind:d,name:p?"#"+r:r,static:b,private:p,metadata:T},f={v:!1};s.addInitializer=y(c,f);var n,a;if(o===0?p?(n=h.get,a=h.set):(n=function(){return this[r]},a=function(g){this[r]=g}):o===2?n=function(){return h.value}:((o===1||o===3)&&(n=function(){return h.get.call(this)}),(o===1||o===4)&&(a=function(g){h.set.call(this,g)})),p)s.access=n&&a?{get:n,set:a}:n?{get:n}:{set:a};else{if(n){var I=n;n=function(g){return arguments.length===0&&(g=this),I.call(g)}}if(a){var P=a;a=function(g,_){return arguments.length===1&&(_=g,g=this),P.call(g,_)}}var E=function(g){return r in g};s.access=n&&a?{has:E,get:n,set:a}:n?{has:E,get:n}:{has:E,set:a}}try{return l(x,s)}finally{f.v=!0}}function e(l,r){if(l.v)throw new Error("attempted to call "+r+" after decoration was finished")}function i(l,r){if(typeof l!="function")throw new TypeError(r+" must be a function")}function u(l,r){var h=typeof r;if(l===1){if(h!=="object"||r===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");r.get!==void 0&&i(r.get,"accessor.get"),r.set!==void 0&&i(r.set,"accessor.set"),r.init!==void 0&&i(r.init,"accessor.init")}else if(h!=="function"){var c;throw l===0?c="field":l===10?c="class":c="method",new TypeError(c+" decorators must return a function or void 0")}}function m(l,r,h,c,o,b,p,T,x){var d=h[0],s,f,n;p?o===0||o===1?s={get:h[3],set:h[4]}:o===3?s={get:h[3]}:o===4?s={set:h[3]}:s={value:h[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(r,c)),o===1?n={get:s.get,set:s.set}:o===2?n=s.value:o===3?n=s.get:o===4&&(n=s.set);var a,I,P;if(typeof d=="function")a=t(d,c,s,T,o,b,p,x,n),a!==void 0&&(u(o,a),o===0?f=a:o===1?(f=a.init,I=a.get||n.get,P=a.set||n.set,n={get:I,set:P}):n=a);else for(var E=d.length-1;E>=0;E--){var g=d[E];if(a=t(g,c,s,T,o,b,p,x,n),a!==void 0){u(o,a);var _;o===0?_=a:o===1?(_=a.init,I=a.get||n.get,P=a.set||n.set,n={get:I,set:P}):n=a,_!==void 0&&(f===void 0?f=_:typeof f=="function"?f=[f,_]:f.push(_))}}if(o===0||o===1){if(f===void 0)f=function(M,C){return C};else if(typeof f!="function"){var F=f;f=function(M,C){for(var N=C,L=0;L<F.length;L++)N=F[L].call(M,N);return N}}else{var j=f;f=function(M,C){return j.call(M,C)}}l.push(f)}o!==0&&(o===1?(s.get=n.get,s.set=n.set):o===2?s.value=n:o===3?s.get=n:o===4&&(s.set=n),p?o===1?(l.push(function(M,C){return n.get.call(M,C)}),l.push(function(M,C){return n.set.call(M,C)})):o===2?l.push(n):l.push(function(M,C){return n.call(M,C)}):Object.defineProperty(r,c,s))}function v(l,r,h){for(var c=[],o,b,p=new Map,T=new Map,x=0;x<r.length;x++){var d=r[x];if(Array.isArray(d)){var s=d[1],f=d[2],n=d.length>3,a=s>=5,I,P;if(a?(I=l,s=s-5,b=b||[],P=b):(I=l.prototype,o=o||[],P=o),s!==0&&!n){var E=a?T:p,g=E.get(f)||0;if(g===!0||g===3&&s!==4||g===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!g&&s>2?E.set(f,s):E.set(f,!0)}m(c,I,d,f,s,a,n,P,h)}}return w(c,o),w(c,b),c}function w(l,r){r&&l.push(function(h){for(var c=0;c<r.length;c++)r[c].call(h);return h})}function D(l,r,h){if(r.length>0){for(var c=[],o=l,b=l.name,p=r.length-1;p>=0;p--){var T={v:!1};try{var x=r[p](o,{kind:"class",name:b,addInitializer:y(c,T),metadata:h})}finally{T.v=!0}x!==void 0&&(u(10,x),o=x)}return[S(o,h),function(){for(var d=0;d<c.length;d++)c[d].call(o)}]}}function S(l,r){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:r})}return function(r,h,c,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var p=Object.create(b===void 0?null:b),T=v(r,h,p);return c.length||S(r,p),{e:T,get c(){return D(r,c,p)}}}}function Vs(y,t,e,i){return(Vs=Lc())(y,t,e,i)}var Bs,Ns,$s,Gs,Us,Hs,Xs,Ys,Ls,Rs,Os,Fs,zs,Ao;Bs=U({selector:"potatno-conjunction-node",template:As,style:Ss,components:[Se]}),$s=yt("dragConnection"),Gs=yt("dragPath"),Us=rt("node-drag"),Hs=B(),Xs=B(),Ys=V.state();var js=class{static{({e:[Ls,Rs,Os,Fs,zs],c:[Ao,Ns]}=Vs(this,[[$s,1,"mDragConnectionSvg"],[Gs,1,"mDragConnectionPath"],[Us,1,"mDrag"],[Hs,3,"nodeData"],[Xs,3,"selected"],[Ys,1,"mSelected"]],[Bs]))}constructor(t=O.use(G),e=O.use(H)){this.mComponent=t,this.mManager=e,this.mNodeData=null,this.mSelected=!1,this.mDragPositionEventHandler=i=>{this.mManager.grid.draggedPort.isDragging&&(performance.now()-i.timeStamp>100||this.renderDragWire(i.clientX,i.clientY))},document.addEventListener("dragover",this.mDragPositionEventHandler,{capture:!0}),this.mUnsubscribeNodeChange=this.mManager.subscribe(R.Node,i=>{i.item===this.mNodeData&&this.resyncComponent(this.nodeData)}),this.mUnsubscribeValidation=this.mManager.subscribe(R.Connection|R.SpecialValidation,()=>{this.mComponent.updater.updateAsync()})}mComponent;mDragPositionEventHandler;mManager;mNodeData;mUnsubscribeNodeChange;mUnsubscribeValidation;#t=(zs(this),Ls(this));get mDragConnectionSvg(){return this.#t}set mDragConnectionSvg(t){this.#t=t}#e=Rs(this);get mDragConnectionPath(){return this.#e}set mDragConnectionPath(t){this.#e=t}#o=Os(this);get mDrag(){return this.#o}set mDrag(t){this.#o=t}get inputHasError(){return this.mManager.integrity.errorItems.has(this.nodeData)||this.mManager.integrity.errorItems.has(this.nodePorts.input)}get isInputConnected(){return this.nodePorts.input.connectedPorts.size>0}get isOutputConnected(){return this.nodePorts.output.connectedPorts.size>0}get inputPort(){return this.nodePorts.input}get outputPort(){return this.nodePorts.output}get nodeData(){if(!this.mNodeData)throw new A("Node data not set.",this);return this.mNodeData}set nodeData(t){this.mNodeData=t,t&&this.resyncComponent(t)}get outputHasError(){return this.mManager.integrity.errorItems.has(this.nodeData)||this.mManager.integrity.errorItems.has(this.nodePorts.output)}get portColor(){return this.portType==="flow"?"var(--potatno-color-text)":this.mManager.generateStringColor(this.portValueType)}get portType(){return this.nodeData.definitionId===K.DEFINITION_ID?"flow":"value"}get portValueType(){return this.portType!=="value"?"":this.nodePorts.input.resolvedDataType}get nodePorts(){if(this.nodeData.inputs.list.length===0||this.nodeData.outputs.list.length===0)throw new A("Malformed conjunction node",this);return{input:this.nodeData.inputs.list[0],output:this.nodeData.outputs.list[0]}}get selected(){return this.mSelected}set selected(t){this.mSelected=this.parseBoolean(t)}#r=Fs(this);get mSelected(){return this.#r}set mSelected(t){this.#r=t}dragNode(t){if(t.preventDefault(),t.button===2&&this.mManager.graph.removeNode(this.nodeData),t.button!==0)return;let e=this.nodeData.transformation.x*this.mManager.grid.gridSize,i=this.nodeData.transformation.y*this.mManager.grid.gridSize,u=this.nodeData.transformation.x,m=this.nodeData.transformation.y,v=this.mComponent.element.getBoundingClientRect(),w=this.mComponent.element.offsetWidth?v.width/this.mComponent.element.offsetWidth:1,D=this.mComponent.element.offsetHeight?v.height/this.mComponent.element.offsetHeight:1,S=t.clientX,l=t.clientY,r=c=>{c.stopPropagation();let o=(c.clientX-S)/w,b=(c.clientY-l)/D,p=Math.round((e+o)/this.mManager.grid.gridSize),T=Math.round((i+b)/this.mManager.grid.gridSize);u===p&&m===T||(this.mManager.graph.transformNode(this.nodeData,x=>{x.moveTo(p,T)}),this.mDrag.dispatchEvent(new So(p-u,T-m)),u=p,m=T)},h=()=>{document.removeEventListener("pointermove",r),document.removeEventListener("pointerup",h)};document.addEventListener("pointermove",r),document.addEventListener("pointerup",h)}onDeconstruct(){this.mUnsubscribeNodeChange(),this.mUnsubscribeValidation(),document.removeEventListener("dragover",this.mDragPositionEventHandler,{capture:!0})}onDragEnd(t){t.stopPropagation(),t.preventDefault(),this.mDragConnectionPath?.removeAttribute("d"),this.mManager.grid.setDraggingPort([]),this.mComponent.updater.updateAsync()}onDragOver(t){this.draggedPortCanConnect()&&(t.preventDefault(),t.stopPropagation(),t.dataTransfer&&(t.dataTransfer.dropEffect="link"))}onDragStart(t){t.stopPropagation(),t.dataTransfer.effectAllowed="link",t.dataTransfer.setDragImage(document.createElement("div"),0,0),this.mManager.grid.setDraggingPort([this.nodePorts.input,this.nodePorts.output]),this.mComponent.updater.updateAsync()}onDrop(t){this.draggedPortCanConnect()&&(t.preventDefault(),t.stopPropagation(),this.mManager.grid.draggedPort.isDragging&&this.mManager.graph.mergeConnectPorts([...this.nodeData.inputs.list,...this.nodeData.outputs.list],this.mManager.grid.draggedPort.ports))}createDragPath(t,e){let i=this.mManager.grid.pixelToGridSpace(t,e);return this.mManager.connections.createTemporaryPath(this.nodePorts.input,i).attributeValue}draggedPortCanConnect(){if(!this.mManager.grid.draggedPort.isDragging)return!1;let t=this.nodePorts,e=[t.input,t.output];for(let i of this.mManager.grid.draggedPort.ports)for(let u of e)if(i!==u&&i.direction!==u.direction&&i.portType===u.portType)return!0;return!1}parseBoolean(t){if(typeof t=="string"){if(t==="")return!0;let e=t.toLowerCase();if(e==="true"||e==="false")return e==="true"}return!!t}renderDragWire(t,e){let i=this.nodePorts.input;if(!this.mManager.grid.draggedPort.hasPort(i)||!this.mManager.grid.draggedPort.updatePointer(t,e))return;let u=this.mManager.grid.draggedPort.portPositions.get(i);if(!u)return;let m=u.x*this.mManager.grid.gridSize,v=u.y*this.mManager.grid.gridSize;this.mDragConnectionSvg?.style.setProperty("transform",`translate(${-m}px, ${-v}px)`),this.mDragConnectionPath?.setAttribute("d",this.createDragPath(t,e))}resyncComponent(t){let e=t.transformation.x*this.mManager.grid.gridSize,i=t.transformation.y*this.mManager.grid.gridSize;this.mComponent.element.style.setProperty("left",`${e}px`),this.mComponent.element.style.setProperty("top",`${i}px`),this.mComponent.updater.update()}static{Ns()}},So=class{mX;mY;get x(){return this.mX}get y(){return this.mY}constructor(t,e){this.mX=t,this.mY=e}};var Ws=`:host {\r
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
}`;var Zs=`<svg class="svg-layer" xmlns="http://www.w3.org/2000/svg" >\r
    $for(connection of this.connections.values()){\r
        <g class="{{this.connection.state.hasError ? 'error' : ''}} {{this.connection.state.isNew ? 'new' : ''}}" style="--path-length: {{ this.connection.path.length }}; {{ this.connection.color ? \`--path-color: \${this.connection.color};\` : '' }}" xmlns="http://www.w3.org/2000/svg">\r
            <path class="path" d="{{this.connection.path.attributeValue}}" xmlns="http://www.w3.org/2000/svg"/>\r
            <path class="path path--mouse-target" d="{{this.connection.path.attributeValue}}" (pointerdown)="this.deleteConnection($event, this.connection)" (dblclick)="this.createConjunction($event, this.connection)" xmlns="http://www.w3.org/2000/svg"/>\r
        </g>\r
    }\r
</svg>\r
`;function Fc(){function y(l,r){return function(c){e(r,"addInitializer"),i(c,"An initializer"),l.push(c)}}function t(l,r,h,c,o,b,p,T,x){var d;switch(o){case 1:d="accessor";break;case 2:d="method";break;case 3:d="getter";break;case 4:d="setter";break;default:d="field"}var s={kind:d,name:p?"#"+r:r,static:b,private:p,metadata:T},f={v:!1};s.addInitializer=y(c,f);var n,a;if(o===0?p?(n=h.get,a=h.set):(n=function(){return this[r]},a=function(g){this[r]=g}):o===2?n=function(){return h.value}:((o===1||o===3)&&(n=function(){return h.get.call(this)}),(o===1||o===4)&&(a=function(g){h.set.call(this,g)})),p)s.access=n&&a?{get:n,set:a}:n?{get:n}:{set:a};else{if(n){var I=n;n=function(g){return arguments.length===0&&(g=this),I.call(g)}}if(a){var P=a;a=function(g,_){return arguments.length===1&&(_=g,g=this),P.call(g,_)}}var E=function(g){return r in g};s.access=n&&a?{has:E,get:n,set:a}:n?{has:E,get:n}:{has:E,set:a}}try{return l(x,s)}finally{f.v=!0}}function e(l,r){if(l.v)throw new Error("attempted to call "+r+" after decoration was finished")}function i(l,r){if(typeof l!="function")throw new TypeError(r+" must be a function")}function u(l,r){var h=typeof r;if(l===1){if(h!=="object"||r===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");r.get!==void 0&&i(r.get,"accessor.get"),r.set!==void 0&&i(r.set,"accessor.set"),r.init!==void 0&&i(r.init,"accessor.init")}else if(h!=="function"){var c;throw l===0?c="field":l===10?c="class":c="method",new TypeError(c+" decorators must return a function or void 0")}}function m(l,r,h,c,o,b,p,T,x){var d=h[0],s,f,n;p?o===0||o===1?s={get:h[3],set:h[4]}:o===3?s={get:h[3]}:o===4?s={set:h[3]}:s={value:h[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(r,c)),o===1?n={get:s.get,set:s.set}:o===2?n=s.value:o===3?n=s.get:o===4&&(n=s.set);var a,I,P;if(typeof d=="function")a=t(d,c,s,T,o,b,p,x,n),a!==void 0&&(u(o,a),o===0?f=a:o===1?(f=a.init,I=a.get||n.get,P=a.set||n.set,n={get:I,set:P}):n=a);else for(var E=d.length-1;E>=0;E--){var g=d[E];if(a=t(g,c,s,T,o,b,p,x,n),a!==void 0){u(o,a);var _;o===0?_=a:o===1?(_=a.init,I=a.get||n.get,P=a.set||n.set,n={get:I,set:P}):n=a,_!==void 0&&(f===void 0?f=_:typeof f=="function"?f=[f,_]:f.push(_))}}if(o===0||o===1){if(f===void 0)f=function(M,C){return C};else if(typeof f!="function"){var F=f;f=function(M,C){for(var N=C,L=0;L<F.length;L++)N=F[L].call(M,N);return N}}else{var j=f;f=function(M,C){return j.call(M,C)}}l.push(f)}o!==0&&(o===1?(s.get=n.get,s.set=n.set):o===2?s.value=n:o===3?s.get=n:o===4&&(s.set=n),p?o===1?(l.push(function(M,C){return n.get.call(M,C)}),l.push(function(M,C){return n.set.call(M,C)})):o===2?l.push(n):l.push(function(M,C){return n.call(M,C)}):Object.defineProperty(r,c,s))}function v(l,r,h){for(var c=[],o,b,p=new Map,T=new Map,x=0;x<r.length;x++){var d=r[x];if(Array.isArray(d)){var s=d[1],f=d[2],n=d.length>3,a=s>=5,I,P;if(a?(I=l,s=s-5,b=b||[],P=b):(I=l.prototype,o=o||[],P=o),s!==0&&!n){var E=a?T:p,g=E.get(f)||0;if(g===!0||g===3&&s!==4||g===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!g&&s>2?E.set(f,s):E.set(f,!0)}m(c,I,d,f,s,a,n,P,h)}}return w(c,o),w(c,b),c}function w(l,r){r&&l.push(function(h){for(var c=0;c<r.length;c++)r[c].call(h);return h})}function D(l,r,h){if(r.length>0){for(var c=[],o=l,b=l.name,p=r.length-1;p>=0;p--){var T={v:!1};try{var x=r[p](o,{kind:"class",name:b,addInitializer:y(c,T),metadata:h})}finally{T.v=!0}x!==void 0&&(u(10,x),o=x)}return[S(o,h),function(){for(var d=0;d<c.length;d++)c[d].call(o)}]}}function S(l,r){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:r})}return function(r,h,c,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var p=Object.create(b===void 0?null:b),T=v(r,h,p);return c.length||S(r,p),{e:T,get c(){return D(r,c,p)}}}}function ks(y,t,e,i){return(ks=Fc())(y,t,e,i)}var ta,qs,ea,Js,Ks,No;ta=U({selector:"potatno-connection-layer",template:Zs,style:Ws}),ea=V.state({complexValue:!0});var Qs=class{static{({e:[Js,Ks],c:[No,qs]}=ks(this,[[ea,1,"connections"]],[ta]))}constructor(t=O.use(H)){this.mManager=t,this.connections=new Map;let e=0;this.mUnsubscribe=this.mManager.subscribe(R.SpecialActiveFunction|R.Node|R.Connection|R.ProgrammResize,()=>{e===0&&(e=requestAnimationFrame(()=>{e=0,this.updateConnections()}))})}mManager;mUnsubscribe;#t=(Ks(this),Js(this));get connections(){return this.#t}set connections(t){this.#t=t}createConjunction(t,e){t.preventDefault(),t.stopPropagation();let i=e.port.output.portType==="flow"?this.mManager.project.nodeDefinitions.get(K.DEFINITION_ID):this.mManager.project.nodeDefinitions.get(et.DEFINITION_ID),u=this.mManager.grid.pixelToGridSpace(t.clientX,t.clientY),m=this.mManager.graph.addNode(this.mManager.activeFunction,i,{x:u.x,y:u.y,height:0,width:0});this.mManager.graph.disconnectPorts(e.port.output,e.port.input);let v=m.inputs.list[0],w=m.outputs.list[0];this.mManager.graph.connectPorts(v,e.port.output),this.mManager.graph.connectPorts(v,e.port.input),this.mManager.graph.connectPorts(w,e.port.output),this.mManager.graph.connectPorts(w,e.port.input)}deleteConnection(t,e){t.button===2&&(t.preventDefault(),t.stopPropagation(),this.mManager.graph.disconnectPorts(e.port.output,e.port.input))}onDeconstruct(){this.mUnsubscribe()}createConnection(t,e,i){let u=this.mManager.integrity.errorItems,m=u.has(e)||u.has(i),v=(()=>{switch(i.portType){case"value":return i;case"flow":return e}})(),w=e.portType==="flow"?"":this.mManager.generateStringColor(e.resolvedDataType),D=this.mManager.connections.getConnectionPath(e,i);return{color:w,path:{attributeValue:D.attributeValue,length:D.length},state:{isNew:!t.has(v),hasError:m},port:{primary:v,output:e,input:i}}}updateConnections(){let t=this.connections;this.connections=new Map;for(let e of this.mManager.activeFunction.nodes)for(let i of e.outputs.list)for(let u of i.connectedPorts){let m=this.createConnection(t,i,u);this.connections.set(m.port.primary,m)}}static{qs()}};function zc(){function y(l,r){return function(c){e(r,"addInitializer"),i(c,"An initializer"),l.push(c)}}function t(l,r,h,c,o,b,p,T,x){var d;switch(o){case 1:d="accessor";break;case 2:d="method";break;case 3:d="getter";break;case 4:d="setter";break;default:d="field"}var s={kind:d,name:p?"#"+r:r,static:b,private:p,metadata:T},f={v:!1};s.addInitializer=y(c,f);var n,a;if(o===0?p?(n=h.get,a=h.set):(n=function(){return this[r]},a=function(g){this[r]=g}):o===2?n=function(){return h.value}:((o===1||o===3)&&(n=function(){return h.get.call(this)}),(o===1||o===4)&&(a=function(g){h.set.call(this,g)})),p)s.access=n&&a?{get:n,set:a}:n?{get:n}:{set:a};else{if(n){var I=n;n=function(g){return arguments.length===0&&(g=this),I.call(g)}}if(a){var P=a;a=function(g,_){return arguments.length===1&&(_=g,g=this),P.call(g,_)}}var E=function(g){return r in g};s.access=n&&a?{has:E,get:n,set:a}:n?{has:E,get:n}:{has:E,set:a}}try{return l(x,s)}finally{f.v=!0}}function e(l,r){if(l.v)throw new Error("attempted to call "+r+" after decoration was finished")}function i(l,r){if(typeof l!="function")throw new TypeError(r+" must be a function")}function u(l,r){var h=typeof r;if(l===1){if(h!=="object"||r===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");r.get!==void 0&&i(r.get,"accessor.get"),r.set!==void 0&&i(r.set,"accessor.set"),r.init!==void 0&&i(r.init,"accessor.init")}else if(h!=="function"){var c;throw l===0?c="field":l===10?c="class":c="method",new TypeError(c+" decorators must return a function or void 0")}}function m(l,r,h,c,o,b,p,T,x){var d=h[0],s,f,n;p?o===0||o===1?s={get:h[3],set:h[4]}:o===3?s={get:h[3]}:o===4?s={set:h[3]}:s={value:h[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(r,c)),o===1?n={get:s.get,set:s.set}:o===2?n=s.value:o===3?n=s.get:o===4&&(n=s.set);var a,I,P;if(typeof d=="function")a=t(d,c,s,T,o,b,p,x,n),a!==void 0&&(u(o,a),o===0?f=a:o===1?(f=a.init,I=a.get||n.get,P=a.set||n.set,n={get:I,set:P}):n=a);else for(var E=d.length-1;E>=0;E--){var g=d[E];if(a=t(g,c,s,T,o,b,p,x,n),a!==void 0){u(o,a);var _;o===0?_=a:o===1?(_=a.init,I=a.get||n.get,P=a.set||n.set,n={get:I,set:P}):n=a,_!==void 0&&(f===void 0?f=_:typeof f=="function"?f=[f,_]:f.push(_))}}if(o===0||o===1){if(f===void 0)f=function(M,C){return C};else if(typeof f!="function"){var F=f;f=function(M,C){for(var N=C,L=0;L<F.length;L++)N=F[L].call(M,N);return N}}else{var j=f;f=function(M,C){return j.call(M,C)}}l.push(f)}o!==0&&(o===1?(s.get=n.get,s.set=n.set):o===2?s.value=n:o===3?s.get=n:o===4&&(s.set=n),p?o===1?(l.push(function(M,C){return n.get.call(M,C)}),l.push(function(M,C){return n.set.call(M,C)})):o===2?l.push(n):l.push(function(M,C){return n.call(M,C)}):Object.defineProperty(r,c,s))}function v(l,r,h){for(var c=[],o,b,p=new Map,T=new Map,x=0;x<r.length;x++){var d=r[x];if(Array.isArray(d)){var s=d[1],f=d[2],n=d.length>3,a=s>=5,I,P;if(a?(I=l,s=s-5,b=b||[],P=b):(I=l.prototype,o=o||[],P=o),s!==0&&!n){var E=a?T:p,g=E.get(f)||0;if(g===!0||g===3&&s!==4||g===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!g&&s>2?E.set(f,s):E.set(f,!0)}m(c,I,d,f,s,a,n,P,h)}}return w(c,o),w(c,b),c}function w(l,r){r&&l.push(function(h){for(var c=0;c<r.length;c++)r[c].call(h);return h})}function D(l,r,h){if(r.length>0){for(var c=[],o=l,b=l.name,p=r.length-1;p>=0;p--){var T={v:!1};try{var x=r[p](o,{kind:"class",name:b,addInitializer:y(c,T),metadata:h})}finally{T.v=!0}x!==void 0&&(u(10,x),o=x)}return[S(o,h),function(){for(var d=0;d<c.length;d++)c[d].call(o)}]}}function S(l,r){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:r})}return function(r,h,c,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var p=Object.create(b===void 0?null:b),T=v(r,h,p);return c.length||S(r,p),{e:T,get c(){return D(r,c,p)}}}}function na(y,t,e,i){return(na=zc())(y,t,e,i)}var ia,oa,Ae;ia=Ct({access:q.Read,selector:/^potatno-preview$/});var ra=class{static{({c:[Ae,oa]}=na(this,[],[ia]))}constructor(t=O.use(k),e=O.use(W),i=O.use(st)){this.mTarget=t,this.mProcedure=e.createExpressionProcedure(i.value)}mProcedure;mTarget;onUpdate(){let t=this.mProcedure.execute();if(!t){let i=this.mTarget.childNodes.length>0;return i&&(this.mTarget.innerHTML=""),i}let e=t.element;return this.mTarget.contains(e)?!1:(this.mTarget.innerHTML="",this.mTarget.appendChild(e),!0)}static{oa()}};var sa=`:host {
    display: block;
    position: relative;
}

.port-wrapper {
    --potatno-port-color: var(--type-color);

    height: var(--potatno-grid-size);
    position: relative;
}

.port-drag-connection {
    position: absolute;
    top: 0;
    height: 1px;
    width: 1px;
    overflow: visible;
    pointer-events: none;

    /* While dragging should stay above all nodes. */
    z-index: 200;

    .output & {
        right: 0;
    }

    .input & {
        left: 0;
    }

    path {
        fill: none;
        opacity: 0.6;
        pointer-events: none;
        stroke: var(--potatno-port-color);
        stroke-dasharray: 8 4;
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke-width: 2;
    }
}

.port-values {
    --potatno-port-values-line-length: 8px;

    position: absolute;
    top: 50%;
    right: 100%;
    transform: translateY(-50%);

    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
    gap: 2px;

    height: 100%;
    padding-right: var(--potatno-port-values-line-length);
    pointer-events: all;

    &::after {
        content: '';
        position: absolute;
        right: 3px;
        height: 2px;
        width: calc(var(--potatno-port-values-line-length) - 3px);
        pointer-events: none;
        background-color: var(--potatno-port-color);
    }

    .port-values__field {
        position: relative;
        display: flex;
        min-width: 40px;
        padding: 2px 4px;
        margin: 2px 0;
        justify-content: center;
        gap: 4px;

        border: 1px solid var(--potatno-port-color);
        border-radius: var(--potatno-border-radius);

        background-color: color-mix(in srgb, var(--potatno-port-color) 12%, var(--potatno-color-background));
        white-space: nowrap;
    }

    .port-values__label {
        color: var(--potatno-port-color);
        font-size: 14px;
        user-select: none;
        white-space: nowrap;
    }

    .port-values__input {
        padding: 2px 4px;
        width: 40px;
        border: 1px solid color-mix(in srgb, var(--potatno-port-color) 35%, transparent);
        border-radius: var(--potatno-border-radius);
        color: var(--potatno-color-text);
        background-color: color-mix(in srgb, var(--potatno-port-color) 8%, var(--potatno-color-background));
        box-sizing: border-box;
        font-size: 12px;
        appearance: textfield;

        &:focus {
            border-color: var(--potatno-port-color);
            box-shadow: 0 0 0 1px color-mix(in srgb, var(--potatno-port-color) 30%, transparent);
            outline: none;
        }

        &[type='checkbox'] {
            margin: 0;
            accent-color: var(--potatno-port-color);
            cursor: pointer;
        }
    }
}

.port {
    align-items: center;
    cursor: crosshair;
    display: flex;
    height: 100%;
    position: relative;

    /* Reverse port handle and label position on output ports */
    .output & {
        flex-direction: row-reverse;
    }

    .port__label {
        flex: 1;
        color: var(--potatno-color-text);
        font-size: 16px;
        user-select: none;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

        /* Manually center text */
        padding: 0 0 5px 0;

        .output & {
            text-align: end;
        }

        .input & {
            text-align: start;
        }
    }

    /* Small hover animation for ports, hover values excluded */
    .output &:hover potatno-port-handle {
        transform: translateX(-1px);
    }

    .input &:hover potatno-port-handle {
        transform: translateX(1px);
    }

    /* Positioning wrapper. The handle visual and connect animation live in potatno-port-handle. */
    .port__handle {
        position: relative;
        display: flex;
        width: 15px;
        align-items: center;
        justify-content: center;

        .output & {
            transform: translateX(8px);
        }

        .input & {
            transform: translateX(-8px);
        }
    }
}
`;var aa=`<div class="port-wrapper {{this.portDirection}}" style="--type-color: {{this.portColor}}" (dragover)="this.onDragOver($event)" (drop)="this.onDrop($event)">\r
\r
    <!-- Actual port handle. -->\r
    <div class="port" draggable="true" [title]="this.portValueType" (dragstart)="this.onDragStart($event)" (dragend)="this.onDragEnd($event)">\r
        <div class="port__handle">\r
            <potatno-port-handle [port]="this.port" [connected]="this.isConnected" />\r
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
`;function Bc(){function y(l,r){return function(c){e(r,"addInitializer"),i(c,"An initializer"),l.push(c)}}function t(l,r,h,c,o,b,p,T,x){var d;switch(o){case 1:d="accessor";break;case 2:d="method";break;case 3:d="getter";break;case 4:d="setter";break;default:d="field"}var s={kind:d,name:p?"#"+r:r,static:b,private:p,metadata:T},f={v:!1};s.addInitializer=y(c,f);var n,a;if(o===0?p?(n=h.get,a=h.set):(n=function(){return this[r]},a=function(g){this[r]=g}):o===2?n=function(){return h.value}:((o===1||o===3)&&(n=function(){return h.get.call(this)}),(o===1||o===4)&&(a=function(g){h.set.call(this,g)})),p)s.access=n&&a?{get:n,set:a}:n?{get:n}:{set:a};else{if(n){var I=n;n=function(g){return arguments.length===0&&(g=this),I.call(g)}}if(a){var P=a;a=function(g,_){return arguments.length===1&&(_=g,g=this),P.call(g,_)}}var E=function(g){return r in g};s.access=n&&a?{has:E,get:n,set:a}:n?{has:E,get:n}:{has:E,set:a}}try{return l(x,s)}finally{f.v=!0}}function e(l,r){if(l.v)throw new Error("attempted to call "+r+" after decoration was finished")}function i(l,r){if(typeof l!="function")throw new TypeError(r+" must be a function")}function u(l,r){var h=typeof r;if(l===1){if(h!=="object"||r===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");r.get!==void 0&&i(r.get,"accessor.get"),r.set!==void 0&&i(r.set,"accessor.set"),r.init!==void 0&&i(r.init,"accessor.init")}else if(h!=="function"){var c;throw l===0?c="field":l===10?c="class":c="method",new TypeError(c+" decorators must return a function or void 0")}}function m(l,r,h,c,o,b,p,T,x){var d=h[0],s,f,n;p?o===0||o===1?s={get:h[3],set:h[4]}:o===3?s={get:h[3]}:o===4?s={set:h[3]}:s={value:h[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(r,c)),o===1?n={get:s.get,set:s.set}:o===2?n=s.value:o===3?n=s.get:o===4&&(n=s.set);var a,I,P;if(typeof d=="function")a=t(d,c,s,T,o,b,p,x,n),a!==void 0&&(u(o,a),o===0?f=a:o===1?(f=a.init,I=a.get||n.get,P=a.set||n.set,n={get:I,set:P}):n=a);else for(var E=d.length-1;E>=0;E--){var g=d[E];if(a=t(g,c,s,T,o,b,p,x,n),a!==void 0){u(o,a);var _;o===0?_=a:o===1?(_=a.init,I=a.get||n.get,P=a.set||n.set,n={get:I,set:P}):n=a,_!==void 0&&(f===void 0?f=_:typeof f=="function"?f=[f,_]:f.push(_))}}if(o===0||o===1){if(f===void 0)f=function(M,C){return C};else if(typeof f!="function"){var F=f;f=function(M,C){for(var N=C,L=0;L<F.length;L++)N=F[L].call(M,N);return N}}else{var j=f;f=function(M,C){return j.call(M,C)}}l.push(f)}o!==0&&(o===1?(s.get=n.get,s.set=n.set):o===2?s.value=n:o===3?s.get=n:o===4&&(s.set=n),p?o===1?(l.push(function(M,C){return n.get.call(M,C)}),l.push(function(M,C){return n.set.call(M,C)})):o===2?l.push(n):l.push(function(M,C){return n.call(M,C)}):Object.defineProperty(r,c,s))}function v(l,r,h){for(var c=[],o,b,p=new Map,T=new Map,x=0;x<r.length;x++){var d=r[x];if(Array.isArray(d)){var s=d[1],f=d[2],n=d.length>3,a=s>=5,I,P;if(a?(I=l,s=s-5,b=b||[],P=b):(I=l.prototype,o=o||[],P=o),s!==0&&!n){var E=a?T:p,g=E.get(f)||0;if(g===!0||g===3&&s!==4||g===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!g&&s>2?E.set(f,s):E.set(f,!0)}m(c,I,d,f,s,a,n,P,h)}}return w(c,o),w(c,b),c}function w(l,r){r&&l.push(function(h){for(var c=0;c<r.length;c++)r[c].call(h);return h})}function D(l,r,h){if(r.length>0){for(var c=[],o=l,b=l.name,p=r.length-1;p>=0;p--){var T={v:!1};try{var x=r[p](o,{kind:"class",name:b,addInitializer:y(c,T),metadata:h})}finally{T.v=!0}x!==void 0&&(u(10,x),o=x)}return[S(o,h),function(){for(var d=0;d<c.length;d++)c[d].call(o)}]}}function S(l,r){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:r})}return function(r,h,c,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var p=Object.create(b===void 0?null:b),T=v(r,h,p);return c.length||S(r,p),{e:T,get c(){return D(r,c,p)}}}}function da(y,t,e,i){return(da=Bc())(y,t,e,i)}var ma,la,pa,ga,va,ca,ua,ha,Lo;ma=U({selector:"potatno-port",template:aa,style:sa,components:[Se]}),pa=yt("dragConnection"),ga=yt("dragPath"),va=B();var fa=class{static{({e:[ca,ua,ha],c:[Lo,la]}=da(this,[[pa,1,"mDragConnectionSvg"],[ga,1,"mDragConnectionPath"],[va,3,"port"]],[ma]))}constructor(t=O.use(G),e=O.use(H)){this.mComponent=t,this.mManager=e,this.mPort=null,this.mDragPositionEventHandler=i=>{this.mManager.grid.draggedPort.isDragging&&(performance.now()-i.timeStamp>100||this.renderDragWire(i.clientX,i.clientY))},document.addEventListener("dragover",this.mDragPositionEventHandler,{capture:!0}),this.mUnsubscribeValidation=this.mManager.subscribe(R.Connection|R.SpecialValidation,()=>{this.mComponent.updater.updateAsync()})}mComponent;mDragPositionEventHandler;mManager;mPort;mUnsubscribeValidation;#t=(ha(this),ca(this));get mDragConnectionSvg(){return this.#t}set mDragConnectionSvg(t){this.#t=t}#e=ua(this);get mDragConnectionPath(){return this.#e}set mDragConnectionPath(t){this.#e=t}get hasError(){return this.mManager.integrity.errorItems.has(this.port)}get inputDefinitions(){let t=this.port.project.types.getType(this.port.resolvedDataType);return t.inputs.map((e,i)=>({htmlType:(()=>{switch(e.type){case"boolean":return"checkbox";case"number":return"number";case"string":return"text"}})(),index:i,name:e.name,value:this.port.directValue[i]??"",totalCount:t.inputs.length}))}get isConnected(){return this.port.connectedPorts.size>0}get port(){if(!this.mPort)throw new A("Port is not setup",this);return this.mPort}set port(t){if(this.mPort!==t){if(t===null)throw new A("A null port cant be assigned.",this);this.mPort=t,this.mComponent.updater.update()}}get portColor(){return this.port.portType==="flow"?"var(--potatno-color-text)":this.mManager.generateStringColor(this.port.resolvedDataType)}get portDirection(){return this.port.direction??"output"}get portName(){return this.port.label??""}get portType(){return this.port.portType}get portValueType(){return this.port.portType!=="value"?"":this.port.resolvedDataType??""}get showValueInput(){return this.port.portType!=="value"||this.port.direction!=="input"||this.port.connectedPorts.size>0||this.mManager.grid.draggedPort.hasPort(this.port)?!1:!this.port.node.project.types.isGenericType(this.port.dataType??"")}onDeconstruct(){this.mUnsubscribeValidation(),document.removeEventListener("dragover",this.mDragPositionEventHandler,{capture:!0})}onDirectValueInput(t,e){let i=t.target,u=[...this.port.directValue];u[e]=i.type==="checkbox"?i.checked?"true":"false":i.value,this.mManager.graph.setPortDirectValue(this.port,u)}onDragEnd(t){t.stopPropagation(),t.preventDefault(),this.mDragConnectionPath?.removeAttribute("d"),this.mManager.grid.setDraggingPort([]),this.mComponent.updater.updateAsync()}onDragOver(t){this.draggedPortCanConnect()&&(t.preventDefault(),t.stopPropagation(),t.dataTransfer&&(t.dataTransfer.dropEffect="link"))}onDragStart(t){if(!t.dataTransfer){t.preventDefault();return}t.stopPropagation(),t.dataTransfer.effectAllowed="link",t.dataTransfer.setDragImage(document.createElement("div"),0,0),this.mManager.grid.setDraggingPort([this.port]),this.mComponent.updater.updateAsync()}onDrop(t){if(t.preventDefault(),t.stopPropagation(),!!this.draggedPortCanConnect()&&this.mManager.grid.draggedPort.isDragging)for(let e of this.mManager.grid.draggedPort.ports)this.mManager.graph.connectPorts(e,this.port)}createDragPath(t,e){let i=this.mManager.grid.pixelToGridSpace(t,e);return this.mManager.connections.createTemporaryPath(this.port,i).attributeValue}draggedPortCanConnect(){if(!this.mManager.grid.draggedPort.isDragging)return!1;for(let t of this.mManager.grid.draggedPort.ports)if(t!==this.port&&t.direction!==this.port.direction&&t.portType===this.port.portType)return!0;return!1}renderDragWire(t,e){if(!this.mManager.grid.draggedPort.hasPort(this.port)||!this.mDragConnectionSvg||!this.mManager.grid.draggedPort.updatePointer(t,e))return;let i=this.mManager.grid.draggedPort.portPositions.get(this.port);if(!i)return;let u=i.x*this.mManager.grid.gridSize,m=i.y*this.mManager.grid.gridSize;this.mDragConnectionSvg.style.setProperty("transform",`translate(${-u}px, ${-m}px)`),this.mDragConnectionPath?.setAttribute("d",this.createDragPath(t,e))}static{la()}};var ya=`:host {\r
    --potatno-node-preview-gap: 10px;\r
\r
    display: block;\r
    font-family: var(--potatno-font-family);\r
\r
    /* Snappy animation on movement. */\r
    transition: var(--potatno-position-snap-animation);\r
}\r
\r
.node {\r
    position: relative;\r
    box-sizing: border-box;\r
    display: flex;\r
    flex-direction: column;\r
    min-height: 100%;\r
    background-color: var(--potatno-color-background-dark);\r
    border: 1px solid var(--potatno-color-border);\r
    border-radius: var(--potatno-border-radius);\r
    padding: 4px;\r
\r
    /* Fixed node width */\r
    width: calc(var(--potatno-grid-size) * 6);\r
\r
    overflow: visible;\r
    user-select: none;\r
\r
    .node__glow {\r
        position: absolute;\r
        display: flex;\r
        flex-direction: column;\r
        align-items: center;\r
        inset: 0px;\r
\r
        /* Allways on back */\r
        z-index: -1;\r
\r
        .glow-select {\r
            flex-shrink: 0;\r
            height: 0px;\r
            margin: 19px 0;\r
\r
            width: 0px;\r
            box-shadow: 0 0 20px 12px transparent;\r
            transition: width 0.15s, box-shadow 0.15s;\r
\r
            .selected & {\r
                width: 100%;\r
                box-shadow: 0 0 20px 12px var(--node-category-color);\r
            }\r
        }\r
\r
        .glow-error {\r
            flex: 1;\r
            margin: 0 0 0 0;\r
            border-radius: 4px;\r
\r
            width: 0px;\r
            box-shadow: 0 0 20px 0px transparent;\r
            transition: width 0.15s, box-shadow 0.15s;\r
\r
            .error & {\r
                width: 100%;\r
                box-shadow: 0 0 20px 0px var(--potatno-color-error);\r
            }\r
        }\r
    }\r
}\r
\r
.node-header {\r
    display: flex;\r
    align-items: center;\r
    color: var(--potatno-color-text);\r
    font-weight: bold;\r
    font-size: 16px;\r
    overflow: hidden;\r
    cursor: grab;\r
\r
    /* Same border radius as node, because we cant set overflow hidden on parent. */\r
    border: 1px solid var(--node-category-color);\r
    border-radius: var(--potatno-border-radius);\r
\r
    /* Adjust -2px because node itself has a top border of 1px and the header a border on bottom. */\r
    margin: 0 0 4px 0;\r
    height: calc(var(--potatno-grid-size) - 4px);\r
\r
    /* Animated background of header */\r
    background-image: linear-gradient(90deg, var(--potatno-color-background-dark) 0%, var(--potatno-color-background) 100%);\r
\r
    &:active {\r
        cursor: grabbing;\r
    }\r
\r
    .node-header__bar {\r
        width: 4px;\r
        height: calc(100% - 10px);\r
        margin: 0 0 0 8px;\r
        background-color: var(--node-category-color);\r
\r
        transition: box-shadow 0.15s ease-in, background-color 0.15s ease-in;\r
\r
        .selected & {\r
            background-color: color-mix(in srgb, var(--node-category-color) 90%, #fff);\r
            box-shadow: 7px 0px 40px 15px var(--node-category-color);\r
        }\r
\r
        .node-header:hover & {\r
            background-color: color-mix(in srgb, var(--node-category-color) 70%, #fff);\r
            box-shadow: 15px 0px 45px 20px var(--node-category-color);\r
        }\r
\r
        .node-header:active & {\r
            background-color: color-mix(in srgb, var(--node-category-color) 50%, #fff);\r
            box-shadow: 20px 0px 55px 28px var(--node-category-color);\r
        }\r
    }\r
\r
    .node-header__icon {\r
        flex-shrink: 0;\r
        display: flex;\r
        align-items: center;\r
        justify-content: center;\r
        width: calc(var(--potatno-grid-size) - 2px);\r
\r
        /* That centers a single character at its center line. */\r
        line-height: 0;\r
    }\r
\r
    .node-header__label {\r
        flex: 1;\r
        white-space: nowrap;\r
        overflow: hidden;\r
        text-overflow: ellipsis;\r
        line-height: calc(var(--potatno-grid-size) - 2px);\r
    }\r
\r
    .node-header__open-function {\r
        flex-shrink: 0;\r
        display: flex;\r
        justify-content: center;\r
        width: calc(var(--potatno-grid-size) - 2px);\r
        font-size: 14px;\r
        cursor: pointer;\r
\r
        /* Small cool seperator */\r
        border: 0px solid var(--potatno-color-border);\r
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
    position: relative;\r
    box-sizing: border-box;\r
    display: flex;\r
    flex-direction: column;\r
    min-height: 100%;\r
    background-color: var(--potatno-color-background);\r
    border: 1px solid var(--potatno-color-border);\r
    border-radius: var(--potatno-border-radius);\r
\r
    overflow: visible;\r
    user-select: none;\r
\r
    transition: border-color 0.15s;\r
\r
    .error & {\r
        border-color: var(--potatno-color-error);\r
    }\r
}\r
\r
.node-ports {\r
    flex: 1;\r
    display: flex;\r
    gap: 0 20px;\r
\r
    .node-ports__list {\r
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
    /* Copy parent border radius on bottom */\r
    border-radius: 0 0 4px 4px;\r
    overflow: hidden;\r
\r
    --preview-toggle-icon-color: var(--potatno-color-border);\r
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
        transform: translate(calc(-50% - -1px), 1px) rotate(45deg);\r
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
            transform: translate(calc(-50% - -1px), 7px) rotate(-135deg)\r
        }\r
    }\r
}\r
\r
.node-preview {\r
    /* Detached node preview */\r
    position: relative;\r
    top: var(--potatno-node-preview-gap);\r
\r
    box-sizing: border-box;\r
    display: flex;\r
    flex-direction: column;\r
    padding: 4px;\r
    border: 1px solid var(--potatno-color-border);\r
    border-radius: var(--potatno-border-radius);\r
    row-gap: 3px;\r
    background-color: var(--potatno-color-background-dark);\r
    user-select: none;\r
\r
    /* Previews can size bigger than the node itself and expanding. Limit the width here. */\r
    width: calc(var(--potatno-grid-size) * var(--node-width));\r
\r
    /* Small attached line */\r
    &::before {\r
        content: '';\r
        position: absolute;\r
        top: calc(var(--potatno-node-preview-gap) * -1 - 1px);\r
        left: 50%;\r
\r
        display: block;\r
        height: calc(var(--potatno-node-preview-gap) - 1px);\r
        border: 1px solid var(--potatno-color-border);\r
    }\r
\r
    .node-preview__window {\r
        display: flex;\r
        padding: 6px;\r
        background: var(--potatno-color-background);\r
        overflow: hidden;\r
\r
        border: 1px solid var(--potatno-color-border);\r
        border-radius: 4px;\r
\r
        /* The whole preview area has a grid height of 6. [6 - toggle-height - select-height] */\r
        height: calc(var(--potatno-grid-size) * 5);\r
    }\r
\r
    .node-preview__selections {\r
        box-sizing: border-box;\r
        display: flex;\r
        justify-content: space-between;\r
        align-items: center;\r
\r
        border: 1px solid var(--potatno-color-border);\r
        border-radius: var(--potatno-border-radius);\r
        background-color: var(--potatno-color-background-dark);\r
\r
        /* Height minus border */\r
        flex-shrink: 0;\r
        height: 30px;\r
\r
        .select {\r
            /* Theme the shared kg-select for the preview bar. */\r
            --select-accent-color: var(--potatno-color-accent);\r
            --select-text-color: var(--potatno-color-text);\r
            --select-border-color: var(--potatno-color-border);\r
            --select-background-color: var(--potatno-color-background-dark);\r
\r
            flex: 1;\r
            min-width: 0;\r
            height: 100%;\r
\r
            /* Compact sizing for the 30px preview bar. Overrides the components :host defaults. */\r
            font-size: 14px;\r
            padding: 0 6px;\r
        }\r
\r
        .select-button {\r
            --button-accent-color: var(--potatno-color-accent);\r
            --button-text-color: var(--potatno-color-text);\r
            --button-border-color: var(--potatno-color-border);\r
            --button-background-color: var(--potatno-color-background-light);\r
\r
            position: relative;\r
            display: flex;\r
            flex-shrink: 0;\r
            height: 100%;\r
            width: 30px;\r
            padding: 0;\r
            font-size: 16px;\r
\r
            .select-button__button {\r
                display: flex;\r
                color: var(--potatno-color-text);\r
                width: 100%;\r
                height: 100%;\r
                text-align: center;\r
                line-height: 30px;\r
                align-items: center;\r
                justify-content: center;\r
            }\r
\r
            .select-button__options {\r
                /* Defined as hover window of parent. */\r
                display: none;\r
                position: absolute;\r
                top: calc(100% + 6px);\r
                left: 0px;\r
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
                    padding: 6px 12px 6px 10px;\r
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
                        height: 16px;\r
                        padding: 0 10px;\r
\r
                        text-align: center;\r
\r
                        /* Border defined to mark selected. */\r
                        border-left: 4px solid var(--potatno-color-text);\r
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
\r
        .select__seperator {\r
            flex-shrink: 0;\r
            height: 20px;\r
            width: 2px;\r
            background-color: var(--potatno-color-border);\r
        }\r
    }\r
}`;var ba=`<div class="node {{this.hasError ? 'error' : ''}} {{this.selected ? 'selected' : ''}}" style="--node-category-color: {{this.nodeColor}}">\r
    <!-- Header -->\r
    <div class="node-header" (pointerdown)="this.dragNode($event)">\r
        <span class="node-header__bar"></span>\r
        <span class="node-header__icon">{{this.nodeIcon}}</span>\r
        <span class="node-header__label">{{this.nodeLabel}}</span>\r
\r
        $if(this.isFunction) {\r
            <div class="node-header__open-function" (click)="this.openFunction()">\u21AA</div>\r
        }\r
    </div>\r
\r
    <!-- Ports -->\r
    <div class="node-body" style="--node-width: {{ this.nodeTransformation.width }};">\r
\r
        <div class="node-ports">\r
            $if(this.inputPorts.length > 0) {\r
                <div class="node-ports__list">\r
                    $for(port of this.inputPorts) {\r
                    <potatno-port [port]="this.port" />\r
                    }\r
                </div>\r
            }\r
\r
            $if(this.outputPorts.length > 0) {\r
                <div class="node-ports__list">\r
                    $for(port of this.outputPorts) {\r
                    <potatno-port [port]="this.port" />\r
                    }\r
                </div>\r
            }\r
        </div>\r
\r
        $if(this.canPreview) {\r
            <div class="node-preview-toggle {{ this.isPreviewActive ? 'active' : '' }}" (click)="this.selectPreviewPort()">\r
                <div class="icon" />\r
            </div>\r
        }\r
    </div>\r
\r
    <!-- Selection and error indication -->\r
    <div class="node__glow">\r
        <div class="glow-select"></div>\r
        <div class="glow-error"></div>\r
    </div>\r
</div>\r
\r
\r
\r
$if(this.isPreviewActive) {\r
    <div class="node-preview" style="--node-width: {{ this.nodeTransformation.width }};">\r
        <div class="node-preview__selections">\r
            <kg-button type="secondary" class="select-button {{ this.isPreviewDisplaySelectionOpen ? 'active' : '' }}" tabindex="-1" (focusout)="this.isPreviewDisplaySelectionOpen = false">\r
                <div class="select-button__button" (click)="this.isPreviewDisplaySelectionOpen = !this.isPreviewDisplaySelectionOpen">\u{1F441}</div>\r
                <div class="select-button__options">\r
                    $for(display of this.previewDisplays) {\r
                        <div class="option {{ this.display.id === this.previewDisplayId ? 'selected' : '' }}" (click)="this.selectPreviewDisplay(this.display.id)">\r
                            <div class="option__icon">\u{1F441}</div>\r
                            <div class="option__name">{{this.display.label}}</div>\r
                        </div>\r
                    }\r
                </div>\r
            </kg-button>\r
\r
            <div class="select__seperator" />\r
\r
            <kg-select class="select" type="secondary" valueKey="definitionId" labelKey="label" [options]="this.previewPorts" [value]="this.previewPortDefinitionId" (change)="this.selectPreviewPort($event.value)" />\r
        </div>\r
\r
        <div class="node-preview__window" potatno-preview="this.previewDriver"></div>\r
    </div>\r
}`;function Uc(){function y(l,r){return function(c){e(r,"addInitializer"),i(c,"An initializer"),l.push(c)}}function t(l,r,h,c,o,b,p,T,x){var d;switch(o){case 1:d="accessor";break;case 2:d="method";break;case 3:d="getter";break;case 4:d="setter";break;default:d="field"}var s={kind:d,name:p?"#"+r:r,static:b,private:p,metadata:T},f={v:!1};s.addInitializer=y(c,f);var n,a;if(o===0?p?(n=h.get,a=h.set):(n=function(){return this[r]},a=function(g){this[r]=g}):o===2?n=function(){return h.value}:((o===1||o===3)&&(n=function(){return h.get.call(this)}),(o===1||o===4)&&(a=function(g){h.set.call(this,g)})),p)s.access=n&&a?{get:n,set:a}:n?{get:n}:{set:a};else{if(n){var I=n;n=function(g){return arguments.length===0&&(g=this),I.call(g)}}if(a){var P=a;a=function(g,_){return arguments.length===1&&(_=g,g=this),P.call(g,_)}}var E=function(g){return r in g};s.access=n&&a?{has:E,get:n,set:a}:n?{has:E,get:n}:{has:E,set:a}}try{return l(x,s)}finally{f.v=!0}}function e(l,r){if(l.v)throw new Error("attempted to call "+r+" after decoration was finished")}function i(l,r){if(typeof l!="function")throw new TypeError(r+" must be a function")}function u(l,r){var h=typeof r;if(l===1){if(h!=="object"||r===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");r.get!==void 0&&i(r.get,"accessor.get"),r.set!==void 0&&i(r.set,"accessor.set"),r.init!==void 0&&i(r.init,"accessor.init")}else if(h!=="function"){var c;throw l===0?c="field":l===10?c="class":c="method",new TypeError(c+" decorators must return a function or void 0")}}function m(l,r,h,c,o,b,p,T,x){var d=h[0],s,f,n;p?o===0||o===1?s={get:h[3],set:h[4]}:o===3?s={get:h[3]}:o===4?s={set:h[3]}:s={value:h[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(r,c)),o===1?n={get:s.get,set:s.set}:o===2?n=s.value:o===3?n=s.get:o===4&&(n=s.set);var a,I,P;if(typeof d=="function")a=t(d,c,s,T,o,b,p,x,n),a!==void 0&&(u(o,a),o===0?f=a:o===1?(f=a.init,I=a.get||n.get,P=a.set||n.set,n={get:I,set:P}):n=a);else for(var E=d.length-1;E>=0;E--){var g=d[E];if(a=t(g,c,s,T,o,b,p,x,n),a!==void 0){u(o,a);var _;o===0?_=a:o===1?(_=a.init,I=a.get||n.get,P=a.set||n.set,n={get:I,set:P}):n=a,_!==void 0&&(f===void 0?f=_:typeof f=="function"?f=[f,_]:f.push(_))}}if(o===0||o===1){if(f===void 0)f=function(M,C){return C};else if(typeof f!="function"){var F=f;f=function(M,C){for(var N=C,L=0;L<F.length;L++)N=F[L].call(M,N);return N}}else{var j=f;f=function(M,C){return j.call(M,C)}}l.push(f)}o!==0&&(o===1?(s.get=n.get,s.set=n.set):o===2?s.value=n:o===3?s.get=n:o===4&&(s.set=n),p?o===1?(l.push(function(M,C){return n.get.call(M,C)}),l.push(function(M,C){return n.set.call(M,C)})):o===2?l.push(n):l.push(function(M,C){return n.call(M,C)}):Object.defineProperty(r,c,s))}function v(l,r,h){for(var c=[],o,b,p=new Map,T=new Map,x=0;x<r.length;x++){var d=r[x];if(Array.isArray(d)){var s=d[1],f=d[2],n=d.length>3,a=s>=5,I,P;if(a?(I=l,s=s-5,b=b||[],P=b):(I=l.prototype,o=o||[],P=o),s!==0&&!n){var E=a?T:p,g=E.get(f)||0;if(g===!0||g===3&&s!==4||g===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!g&&s>2?E.set(f,s):E.set(f,!0)}m(c,I,d,f,s,a,n,P,h)}}return w(c,o),w(c,b),c}function w(l,r){r&&l.push(function(h){for(var c=0;c<r.length;c++)r[c].call(h);return h})}function D(l,r,h){if(r.length>0){for(var c=[],o=l,b=l.name,p=r.length-1;p>=0;p--){var T={v:!1};try{var x=r[p](o,{kind:"class",name:b,addInitializer:y(c,T),metadata:h})}finally{T.v=!0}x!==void 0&&(u(10,x),o=x)}return[S(o,h),function(){for(var d=0;d<c.length;d++)c[d].call(o)}]}}function S(l,r){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:r})}return function(r,h,c,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var p=Object.create(b===void 0?null:b),T=v(r,h,p);return c.length||S(r,p),{e:T,get c(){return D(r,c,p)}}}}function _a(y,t,e,i){return(_a=Uc())(y,t,e,i)}var Sa,wa,Aa,Na,La,Ra,Oa,Fa,za,ja,xa,Ta,Da,Ea,Ca,Ia,Pa,Oo;Sa=U({selector:"potatno-node",template:ba,style:ya,modules:[Ae],components:[Lo,Mt,no]}),Aa=rt("node-drag"),Na=V.state(),La=V.state(),Ra=B(),Oa=V.state({proxy:!0}),Fa=V.state({complexValue:!0}),za=V.state({complexValue:!0}),ja=B();var Ma=class{static{({e:[xa,Ta,Da,Ea,Ca,Ia,Pa],c:[Oo,wa]}=_a(this,[[Aa,1,"mDrag"],[Na,1,"mSelected"],[La,1,"isPreviewDisplaySelectionOpen"],[Ra,3,"nodeData"],[Oa,1,"nodeTransformation"],[Fa,1,"previewPorts"],[za,1,"previewDisplays"],[ja,3,"selected"]],[Sa]))}constructor(t=O.use(G),e=O.use(H)){this.mComponent=t,this.mManager=e,this.mNodeDefinition=null,this.mNodeData=null,this.mSelected=!1,this.isPreviewDisplaySelectionOpen=!1,this.nodeTransformation={height:0,width:0},this.previewPorts=new Array,this.previewDisplays=new Array,this.mUnsubscribeNodeChange=this.mManager.subscribe(R.Node,i=>{i.item===this.mNodeData&&this.resyncComponent(this.nodeData)}),this.mUnsubscribeValidation=this.mManager.subscribe(R.SpecialValidation,()=>{this.mComponent.updater.updateAsync()})}mComponent;mManager;mNodeData;mNodeDefinition;mUnsubscribeNodeChange;mUnsubscribeValidation;get canPreview(){return this.previewPorts.length>0}#t=(Pa(this),xa(this));get mDrag(){return this.#t}set mDrag(t){this.#t=t}#e=Ta(this);get mSelected(){return this.#e}set mSelected(t){this.#e=t}get hasError(){if(this.mManager.integrity.errorItems.has(this.nodeData))return!0;for(let t of this.nodeData.inputs.list)if(this.mManager.integrity.errorItems.has(t))return!0;for(let t of this.nodeData.outputs.list)if(this.mManager.integrity.errorItems.has(t))return!0;return!1}get inputPorts(){return this.nodeData.inputs.list}get isFunction(){return this.mNodeDefinition instanceof wt}get isPreviewActive(){return!!this.nodeData.preview}#o=Da(this);get isPreviewDisplaySelectionOpen(){return this.#o}set isPreviewDisplaySelectionOpen(t){this.#o=t}get nodeColor(){return this.mManager.generateStringColor(this.mNodeDefinition?.category.name??"")}get nodeData(){if(!this.mNodeData)throw new A("Node data not set.",this);return this.mNodeData}set nodeData(t){this.mNodeData=t,this.mNodeDefinition=null,this.mNodeData&&(this.mNodeDefinition=this.mManager.activeFunction.nodeDefinitions.find(e=>e.id===this.mNodeData.definitionId)??null,this.resyncComponent(t),this.mComponent.updater.update())}get nodeIcon(){return this.mNodeDefinition?.category.icon??""}get nodeLabel(){return this.nodeData.label??""}#r=Ea(this);get nodeTransformation(){return this.#r}set nodeTransformation(t){this.#r=t}get outputPorts(){return this.nodeData.outputs.list}#n=Ca(this);get previewPorts(){return this.#n}set previewPorts(t){this.#n=t}#i=Ia(this);get previewDisplays(){return this.#i}set previewDisplays(t){this.#i=t}get previewDisplayId(){return this.nodeData.preview?.displayId??""}get previewDriver(){if(!this.nodeData.preview)return null;let t=this.nodeData.outputs.map.get(this.nodeData.preview.portDefinitionId);return t?this.mManager.preview.requestDriver(t,this.nodeData.preview.displayId):null}get previewPortDefinitionId(){return this.nodeData.preview?.portDefinitionId??""}get selected(){return this.mSelected}set selected(t){this.mSelected=this.parseBoolean(t)}dragNode(t){if(t.button===2&&this.mManager.graph.removeNode(this.nodeData),t.button!==0)return;let e=this.nodeData.transformation.x*this.mManager.grid.gridSize,i=this.nodeData.transformation.y*this.mManager.grid.gridSize,u=this.nodeData.transformation.x,m=this.nodeData.transformation.y,v=this.mComponent.element.getBoundingClientRect(),w=this.mComponent.element.offsetWidth?v.width/this.mComponent.element.offsetWidth:1,D=this.mComponent.element.offsetHeight?v.height/this.mComponent.element.offsetHeight:1,S=t.clientX,l=t.clientY,r=c=>{c.stopPropagation();let o=(c.clientX-S)/w,b=(c.clientY-l)/D,p=Math.round((e+o)/this.mManager.grid.gridSize),T=Math.round((i+b)/this.mManager.grid.gridSize);u===p&&m===T||(this.mManager.graph.transformNode(this.nodeData,x=>{x.moveTo(p,T)}),this.mDrag.dispatchEvent(new Ro(p-u,T-m)),u=p,m=T)},h=()=>{document.removeEventListener("pointermove",r),document.removeEventListener("pointerup",h)};document.addEventListener("pointermove",r),document.addEventListener("pointerup",h)}onDeconstruct(){this.mUnsubscribeNodeChange(),this.mUnsubscribeValidation()}openFunction(){this.mNodeDefinition instanceof wt&&this.mManager.setActiveFunction(this.mNodeDefinition.function)}selectPreviewDisplay(t){this.mManager.graph.updateNode(this.nodeData,e=>{e.preview={portDefinitionId:e.preview.portDefinitionId,displayId:t}}),document.activeElement instanceof HTMLElement&&document.activeElement.blur()}selectPreviewPort(t){let e=(()=>{let i=this.previewPorts;return i.length===0?null:typeof t<"u"?i.find(u=>u.definitionId===t)??null:this.nodeData.preview?null:i[0]})();if(!e)return this.mManager.graph.updateNode(this.nodeData,i=>{i.preview=null});this.mManager.graph.updateNode(this.nodeData,i=>{let u=i.project.getFunction(i.function.definitionId),m=i.project.preview.availableDisplays(u,e.resolvedDataType);m.length===0&&(i.preview=null);let v=i.preview&&m.includes(i.preview.displayId)?i.preview.displayId:m[0];i.preview={portDefinitionId:e.definitionId,displayId:v}}),this.resyncComponent(this.nodeData)}getPreviewDisplays(t){if(!t)return new Array;let e=this.nodeData.outputs.map.get(t);if(!e)return new Array;let i=e.project.getFunction(e.node.function.definitionId);return i?e.project.preview.availableDisplays(i,e.resolvedDataType).map(m=>({id:m,label:e.project.preview.getDisplay(m)?.name??m})):new Array}getPreviewablePorts(t){let e=t.project.getFunction(t.function.definitionId);if(!this.mManager.activeFunction.dynamicNodeDefinitions.find(m=>m.id===t.definitionId))return new Array;let u=new Map;return t.outputs.value.filter(m=>{let v=m.resolvedDataType;if(u.has(v))return u.get(v);let w=t.project.preview.availableDisplays(e,m.resolvedDataType);return u.set(v,w.length>0),u.get(v)})}parseBoolean(t){if(typeof t=="string"){if(t==="")return!0;let e=t.toLowerCase();if(e==="true"||e==="false")return e==="true"}return!!t}resyncComponent(t){let e=t.transformation.x,i=t.transformation.y;this.mComponent.element.style.setProperty("left",`calc(var(--potatno-grid-size) * ${e})`),this.mComponent.element.style.setProperty("top",`calc(var(--potatno-grid-size) * ${i} - 8px)`),this.nodeTransformation.width=t.transformation.width,this.nodeTransformation.height=t.transformation.height,this.previewPorts=this.getPreviewablePorts(this.nodeData),this.previewDisplays=this.getPreviewDisplays(t.preview?.portDefinitionId??null)}static{wa()}},Ro=class{mX;mY;get x(){return this.mX}get y(){return this.mY}constructor(t,e){this.mX=t,this.mY=e}};var Va=`:host {\r
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
    --mask-image-default:url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj4NCiAgICA8cGF0aCBkPSJNMCAwIGgxMyBNMCAwIHYxMyBNMTAwIDAgaC0xMyBNMTAwIDAgdjEzIE0wIDEwMCBoMTMgTTAgMTAwIHYtMTMgTTEwMCAxMDAgaC0xMyBNMTAwIDEwMCB2LTEzIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS1vcGFjaXR5PSIwLjgiIHN0cm9rZS13aWR0aD0iNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+DQo8L3N2Zz4=");\r
    --mask-image-bigger:url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj4NCiAgICA8cGF0aCBkPSJNMCAwIGg0IE0wIDAgdjQgTTEwMCAwIGgtNCBNMTAwIDAgdjQgTTAgMTAwIGg0IE0wIDEwMCB2LTQgTTEwMCAxMDAgaC00IE0xMDAgMTAwIHYtNCIgc3Ryb2tlPSIjZmZmZmZmZmYiIHN0cm9rZS1vcGFjaXR5PSIxIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPg0KPC9zdmc+");\r
    --grid-position-x: 0px;\r
    --grid-position-y: 0px;\r
    --grid-size: 0px;\r
\r
    --background-color-default: color-mix(in srgb, var(--potatno-color-text) 15%, transparent);\r
    --background-color-accent: color-mix(in srgb, var(--potatno-color-accent) 22%, transparent);\r
\r
    /* Background color only used in mask spaces */\r
    background-image: linear-gradient(135deg, var(--background-color-accent) 10%, var(--background-color-default) 45%);\r
\r
    /* Mask pattern that scales and positions with grid (size/position set dynamically). */\r
    mask-size:\r
        var(--grid-size) var(--grid-size),\r
        calc(var(--grid-size) * 6) calc(var(--grid-size) * 6);\r
    mask-position:\r
        var(--grid-position-x) var(--grid-position-y),\r
        var(--grid-position-x) var(--grid-position-y);\r
    mask-repeat: repeat, repeat;\r
    mask-image: var(--mask-image-default), var(--mask-image-bigger);\r
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
    padding: 1rem;\r
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
        --information-border-radius: var(--potatno-border-radius);\r
    }\r
}\r
\r
.controls-information {\r
    display: grid;\r
    grid-template-columns: 1.1rem 1fr max-content;\r
    align-items: center;\r
    column-gap: 0.8rem;\r
    row-gap: 0.5rem;\r
\r
    font-size: var(--potatno-font-size);\r
    line-height: 1.3rem;\r
    white-space: nowrap;\r
    color: var(--potatno-color-text);\r
\r
    .controls-information__title {\r
        grid-column: 1 / -1;\r
        margin-bottom: 0.25rem;\r
        padding-bottom: 0.5rem;\r
        border-bottom: 1px solid var(--potatno-color-border);\r
\r
        font-weight: bold;\r
        letter-spacing: 0.04rem;\r
        text-transform: uppercase;\r
        font-size: var(--potatno-font-size--small);\r
        color: var(--potatno-color-text);\r
    }\r
\r
    .controls-information__icon {\r
        justify-self: center;\r
        font-size: 1rem;\r
        color: var(--potatno-color-accent);\r
    }\r
\r
    .controls-information__action {\r
        font-weight: bold;\r
    }\r
\r
    .controls-information__gesture {\r
        padding: 0.1rem 0.375rem;\r
        border: 1px solid var(--potatno-color-border);\r
        border-radius: var(--potatno-border-radius);\r
        background-color: var(--potatno-color-background-light);\r
        font-size: 0.75rem;\r
        text-align: center;\r
        color: var(--potatno-color-text);\r
        opacity: 0.65;\r
    }\r
}`;var Ba=`<!-- Serves only as a background. -->\r
<div class="grid-background" [style]="this.gridBackgroundStyle"></div>\r
\r
<div class="grid-content" [style]="this.gridTransformStyle">\r
    <potatno-connection-layer/>\r
\r
    $for(node of this.nodes) {\r
        $if(this.typeOfNode(this.node) === 'node') {\r
            <potatno-node class="grid-content__node" [selected]="this.selectedNodes.has(this.node)" [nodeData]="this.node" (node-drag)="this.moveAllSelected(this.node, $event.value)" (pointerdown)="this.selectNodes([this.node], $event);"/>\r
        }\r
\r
        $if(this.typeOfNode(this.node) === 'conjunction') {\r
            <potatno-conjunction-node class="grid-content__node" [selected]="this.selectedNodes.has(this.node)" [nodeData]="this.node" (node-drag)="this.moveAllSelected(this.node, $event.value)" (pointerdown)="this.selectNodes([this.node], $event);"/>\r
        }\r
\r
        $if(this.typeOfNode(this.node) === 'comment') {\r
            <potatno-comment-node class="grid-content__node" [selected]="this.selectedNodes.has(this.node)" [nodeData]="this.node" (node-drag)="this.moveAllSelected(this.node, $event.value)" (pointerdown)="this.selectNodes([this.node], $event);"/>\r
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
`;function Yc(){function y(l,r){return function(c){e(r,"addInitializer"),i(c,"An initializer"),l.push(c)}}function t(l,r,h,c,o,b,p,T,x){var d;switch(o){case 1:d="accessor";break;case 2:d="method";break;case 3:d="getter";break;case 4:d="setter";break;default:d="field"}var s={kind:d,name:p?"#"+r:r,static:b,private:p,metadata:T},f={v:!1};s.addInitializer=y(c,f);var n,a;if(o===0?p?(n=h.get,a=h.set):(n=function(){return this[r]},a=function(g){this[r]=g}):o===2?n=function(){return h.value}:((o===1||o===3)&&(n=function(){return h.get.call(this)}),(o===1||o===4)&&(a=function(g){h.set.call(this,g)})),p)s.access=n&&a?{get:n,set:a}:n?{get:n}:{set:a};else{if(n){var I=n;n=function(g){return arguments.length===0&&(g=this),I.call(g)}}if(a){var P=a;a=function(g,_){return arguments.length===1&&(_=g,g=this),P.call(g,_)}}var E=function(g){return r in g};s.access=n&&a?{has:E,get:n,set:a}:n?{has:E,get:n}:{has:E,set:a}}try{return l(x,s)}finally{f.v=!0}}function e(l,r){if(l.v)throw new Error("attempted to call "+r+" after decoration was finished")}function i(l,r){if(typeof l!="function")throw new TypeError(r+" must be a function")}function u(l,r){var h=typeof r;if(l===1){if(h!=="object"||r===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");r.get!==void 0&&i(r.get,"accessor.get"),r.set!==void 0&&i(r.set,"accessor.set"),r.init!==void 0&&i(r.init,"accessor.init")}else if(h!=="function"){var c;throw l===0?c="field":l===10?c="class":c="method",new TypeError(c+" decorators must return a function or void 0")}}function m(l,r,h,c,o,b,p,T,x){var d=h[0],s,f,n;p?o===0||o===1?s={get:h[3],set:h[4]}:o===3?s={get:h[3]}:o===4?s={set:h[3]}:s={value:h[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(r,c)),o===1?n={get:s.get,set:s.set}:o===2?n=s.value:o===3?n=s.get:o===4&&(n=s.set);var a,I,P;if(typeof d=="function")a=t(d,c,s,T,o,b,p,x,n),a!==void 0&&(u(o,a),o===0?f=a:o===1?(f=a.init,I=a.get||n.get,P=a.set||n.set,n={get:I,set:P}):n=a);else for(var E=d.length-1;E>=0;E--){var g=d[E];if(a=t(g,c,s,T,o,b,p,x,n),a!==void 0){u(o,a);var _;o===0?_=a:o===1?(_=a.init,I=a.get||n.get,P=a.set||n.set,n={get:I,set:P}):n=a,_!==void 0&&(f===void 0?f=_:typeof f=="function"?f=[f,_]:f.push(_))}}if(o===0||o===1){if(f===void 0)f=function(M,C){return C};else if(typeof f!="function"){var F=f;f=function(M,C){for(var N=C,L=0;L<F.length;L++)N=F[L].call(M,N);return N}}else{var j=f;f=function(M,C){return j.call(M,C)}}l.push(f)}o!==0&&(o===1?(s.get=n.get,s.set=n.set):o===2?s.value=n:o===3?s.get=n:o===4&&(s.set=n),p?o===1?(l.push(function(M,C){return n.get.call(M,C)}),l.push(function(M,C){return n.set.call(M,C)})):o===2?l.push(n):l.push(function(M,C){return n.call(M,C)}):Object.defineProperty(r,c,s))}function v(l,r,h){for(var c=[],o,b,p=new Map,T=new Map,x=0;x<r.length;x++){var d=r[x];if(Array.isArray(d)){var s=d[1],f=d[2],n=d.length>3,a=s>=5,I,P;if(a?(I=l,s=s-5,b=b||[],P=b):(I=l.prototype,o=o||[],P=o),s!==0&&!n){var E=a?T:p,g=E.get(f)||0;if(g===!0||g===3&&s!==4||g===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!g&&s>2?E.set(f,s):E.set(f,!0)}m(c,I,d,f,s,a,n,P,h)}}return w(c,o),w(c,b),c}function w(l,r){r&&l.push(function(h){for(var c=0;c<r.length;c++)r[c].call(h);return h})}function D(l,r,h){if(r.length>0){for(var c=[],o=l,b=l.name,p=r.length-1;p>=0;p--){var T={v:!1};try{var x=r[p](o,{kind:"class",name:b,addInitializer:y(c,T),metadata:h})}finally{T.v=!0}x!==void 0&&(u(10,x),o=x)}return[S(o,h),function(){for(var d=0;d<c.length;d++)c[d].call(o)}]}}function S(l,r){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:r})}return function(r,h,c,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var p=Object.create(b===void 0?null:b),T=v(r,h,p);return c.length||S(r,p),{e:T,get c(){return D(r,c,p)}}}}function Xa(y,t,e,i){return(Xa=Yc())(y,t,e,i)}function Wc(y){return y}var Ya,$a,Wa,Za,Ga,Ua,Ha,io;Ya=U({selector:"potatno-node-graph",template:Ba,style:Va,components:[le,Oo,_o,Ao,No]}),Wa=V.state(),Za=V.state({complexValue:!0});new class extends Wc{constructor(){super(io),$a()}static{class y{static{({e:[Ga,Ua,Ha],c:[io,$a]}=Xa(this,[[Wa,1,"popup"],[Za,1,"selectBox"]],[Ya]))}static ZOOM_STRENGTH=.1;mComponent;mIsMouseInsideGrid;mKeyboardHandler;mManager;mUnsubscribeFunctionChange;mUnsubscribeGraphChange;#t=(Ha(this),Ga(this));get popup(){return this.#t}set popup(e){this.#t=e}#e=Ua(this);get selectBox(){return this.#e}set selectBox(e){this.#e=e}get gridBackgroundStyle(){let e=this.mManager.grid.gridSize*this.mManager.grid.zoom,i=this.mManager.grid.panX,u=this.mManager.grid.panY;return`--grid-size: ${e}px; --grid-position-x: ${i}px; --grid-position-y: ${u}px;`}get gridTransformStyle(){return`transform: translate(${this.mManager.grid.panX}px, ${this.mManager.grid.panY}px) scale(${this.mManager.grid.zoom})`}get nodes(){return this.mManager.activeFunction.nodes}get selectedNodes(){return this.mManager.grid.selectedNodes}constructor(e=O.use(G),i=O.use(H)){this.mComponent=e,this.mManager=i,this.mIsMouseInsideGrid=!1,this.popup=null,this.selectBox=null,this.mManager.grid.gridElement=this.mComponent.element,e.element.addEventListener("pointerdown",u=>{this.onPointerDown(u)}),e.element.addEventListener("wheel",u=>{this.onScroll(u)}),e.element.addEventListener("contextmenu",u=>{u.preventDefault()}),e.element.addEventListener("pointerenter",()=>{this.mIsMouseInsideGrid=!0}),e.element.addEventListener("pointerleave",()=>{this.mIsMouseInsideGrid=!1}),e.element.addEventListener("dragover",u=>{this.mManager.grid.draggedPort.isDragging&&(u.preventDefault(),u.stopPropagation(),u.dataTransfer&&(u.dataTransfer.dropEffect="link"))}),e.element.addEventListener("drop",u=>{this.createDroppedConjunction(u)}),this.mKeyboardHandler=u=>{this.onKeyDown(u)},document.addEventListener("keydown",this.mKeyboardHandler),this.mComponent.element.style.setProperty("--potatno-grid-size",`${this.mManager.grid.gridSize}px`),this.mUnsubscribeFunctionChange=this.mManager.subscribe(R.Document|R.Function|R.SpecialActiveFunction,()=>{this.popup=null,this.selectBox=null}),this.mUnsubscribeGraphChange=this.mManager.subscribe(R.NodeAdd|R.NodeDelete|R.SpecialGrid|R.SpecialSelectNode,()=>{this.mComponent.updater.updateAsync()})}createNode(e){let i=this.mManager.graph.addNode(this.mManager.activeFunction,e.definition,{x:this.popup?.position.grid.x??0,y:this.popup?.position.grid.y??0,height:0,width:0});if(e.port){let u=i.inputs.map.get(e.port.target.id)??i.outputs.map.get(e.port.target.id);u&&this.mManager.graph.connectPorts(u,e.port.source)}this.popup=null,this.selectNodes([i],!1)}moveAllSelected(e,i){for(let u of this.mManager.grid.selectedNodes)u!==e&&this.mManager.graph.transformNode(u,m=>{m.moveTo(m.transformation.x+i.x,m.transformation.y+i.y)})}onDeconstruct(){this.mUnsubscribeFunctionChange(),this.mUnsubscribeGraphChange(),document.removeEventListener("keydown",this.mKeyboardHandler)}selectNodes(e,i){let u=!!i;i instanceof PointerEvent&&(i.stopPropagation(),u=i.ctrlKey);let m=new Set,v=new Set(this.mManager.grid.selectedNodes);if(!u)if(e.length===1&&v.has(e.at(0)))for(let D of v)m.add(D);else v.clear();let w=[...e];for(let D of w)m.has(D)||(m.add(D),D.definitionId===xt.DEFINITION_ID&&w.push(...this.getNodesInRectangle({top:D.transformation.y,right:D.transformation.x+D.transformation.width,bottom:D.transformation.y+D.transformation.height,left:D.transformation.x})),v.has(D)?v.delete(D):v.add(D));this.mManager.grid.selectNodes([...v])}typeOfNode(e){switch(e.definitionId){case xt.DEFINITION_ID:return"comment";case et.DEFINITION_ID:case K.DEFINITION_ID:return"conjunction";default:return"node"}}convertGlobalToGridLocalPosition(e,i){let u=this.mComponent.element.getBoundingClientRect();return{x:e-u.left,y:i-u.top}}createDroppedConjunction(e){if(!this.mManager.grid.draggedPort.isDragging)return;e.preventDefault(),e.stopPropagation();let i=this.mManager.grid.pixelToGridSpace(e.clientX,e.clientY),u=this.mManager.graph.priorizePorts(i,this.mManager.grid.draggedPort.ports);this.openPopupAtPosition(e.clientX,e.clientY,u[0])}getNodesInRectangle(e){let i=new Array;for(let u of this.mManager.activeFunction.nodes){let m=u.transformation.y,v=u.transformation.x,w=v+u.transformation.width,D=m+u.transformation.height;if(v<e.right&&w>e.left&&m<e.bottom&&D>e.top){if(e.top>m&&e.right<w&&e.bottom<D&&e.left>v)continue;i.push(u)}}return i}onKeyDown(e){if(!this.mIsMouseInsideGrid)return;let i=document.activeElement;if(!(i instanceof HTMLInputElement||i instanceof HTMLTextAreaElement||i instanceof HTMLSelectElement)){switch(e.key){case"Escape":{this.popup=null;return}case"Delete":{for(let u of this.mManager.grid.selectedNodes)this.mManager.graph.removeNode(u);this.selectNodes([],!1);return}}if(e.ctrlKey)switch(e.key){case"z":{e.preventDefault(),this.mManager.history.undo();return}case"y":{e.preventDefault(),this.mManager.history.redo();return}case"c":{this.mManager.clipboard.copy(this.mManager.grid.selectedNodes);return}case"v":e.preventDefault(),this.pasteFromClipboard()}}}onPointerDown(e){switch(e.button){case 0:{e.ctrlKey||this.selectNodes([],!1),this.pointerDrag(e,"selecting");return}case 1:{e.preventDefault(),this.pointerDrag(e,"panning");return}case 2:{this.openPopupAtPosition(e.clientX,e.clientY,null);return}}}onScroll(e){e.preventDefault();let i=e.deltaY>0?-1:1,u=this.convertGlobalToGridLocalPosition(e.clientX,e.clientY);this.mManager.grid.zoomAt(u.x,u.y,i*y.ZOOM_STRENGTH)}openPopupAtPosition(e,i,u){let m=this.mComponent.element,v=this.convertGlobalToGridLocalPosition(e,i),w=this.mManager.grid.pixelToGridSpace(e,i),D=8,S=Math.max(0,m.clientWidth-le.POPUP_WIDTH-D),l=Math.max(0,m.clientHeight-le.POPUP_HEIGHT-D);this.popup={position:{local:{x:Math.max(D,Math.min(v.x,S)),y:Math.max(D,Math.min(v.y,l))},grid:w},context:{port:u}}}pasteFromClipboard(){let e=this.mManager.clipboard.paste();e.length!==0&&this.selectNodes(e,!1)}pointerDrag(e,i){let u=this.mManager.grid.pixelToGridPixelSpace(e.clientX,e.clientY),m={x:e.clientX,y:e.clientY},v=D=>{switch(i){case"panning":{this.mManager.grid.pan(D.clientX-m.x,D.clientY-m.y),m.x=D.clientX,m.y=D.clientY;break}case"selecting":{let S=this.mManager.grid.pixelToGridPixelSpace(D.clientX,D.clientY);this.selectBox={x:Math.min(u.x,S.x),y:Math.min(u.y,S.y),width:Math.abs(S.x-u.x),height:Math.abs(S.y-u.y)};break}}},w=D=>{if(document.removeEventListener("pointermove",v),document.removeEventListener("pointerup",w),i==="selecting"&&this.selectBox){let S=this.mManager.grid.gridPixelSpaceToGridSpace({x:this.selectBox.x,y:this.selectBox.y},!1),l=this.mManager.grid.gridPixelSpaceToGridSpace({x:this.selectBox.x+this.selectBox.width,y:this.selectBox.y+this.selectBox.height},!1),r=this.getNodesInRectangle({top:S.y,right:l.x,bottom:l.y,left:S.x});this.selectNodes(r,D.ctrlKey),this.selectBox=null}};document.addEventListener("pointermove",v),document.addEventListener("pointerup",w)}}}};var so=class{mDependencies;mDocument;mEntryPoint;get code(){return this.mDocument.project.generator.code(this)}get dependencies(){return this.mDependencies}get entryPoint(){return this.mEntryPoint}constructor(t,e,i){this.mDocument=t,this.mEntryPoint=e,this.mDependencies=i}};var ao=class{mFunction;mGraphs;get code(){let t=this.mFunction.project.getFunction(this.mFunction.definitionId);if(!t)throw new A("Function result has an invalid function definition id.",this);return t.codeGenerator.body(this)}get function(){return this.mFunction}get graphs(){return Array.from(this.mGraphs.values())}constructor(t){this.mFunction=t,this.mGraphs=new Map}addGraph(t){this.mGraphs.set(t.entryNode.definitionId,t)}graphResultOf(t){return this.mGraphs.get(t)}};var lo=class{mBodyCode;mDependencies;mEntryNode;mExitNode;mNodeIds;mPorts;get code(){return this.mBodyCode}get dependencies(){return this.mDependencies}get entryNode(){return this.mEntryNode}get exitNode(){return this.mExitNode}get nodes(){return this.mNodeIds}get ports(){return this.mPorts}constructor(t){this.mBodyCode=t.bodyCode,this.mDependencies=[...t.dependencies],this.mEntryNode=t.entryNode,this.mExitNode=t.exitNode,this.mNodeIds=t.nodeIds,this.mPorts=t.portValues}};var ce=class{mProject;constructor(t){this.mProject=t}generateDocument(t,e=!1){let i=[...t.functions].find(u=>u.isSystem);if(!i)throw new A("No entry point function found for code generation.",this);return this.generateFunction(i,e)}generateFunction(t,e=!1){return this.buildDocumentResult(t.document,t.getExitNodes(),e)}generateNode(t,e=!1){return this.buildDocumentResult(t.document,[t],e)}buildDocumentResult(t,e,i){if(t.validate().errors.length>0)throw new A("Code generation exited. Code graph validation failed.",this);let m={counter:{nodeIndex:0,portIndex:0},debug:i,nodeDefinitions:new Map},v=this.generateFunctionWithDependencies(m,e,new Set),w=v.pop();return new so(t,w,v)}countNodeEncounter(t,e){let i=new Map,u=new Set,m=new Array(t);for(;m.length>0;){let v=m.pop();if(i.set(v,(i.get(v)??0)+1),!(v===e||u.has(v))){u.add(v);for(let w of v.inputs.flow)for(let D of this.resolveFlowConjunctions(w))m.push(D.node);for(let w of v.inputs.value){let D=this.resolveValueConjunctions(w);D&&m.push(D.node)}}}return i}createScope(t,e){return{emittedNodes:new Set,remaining:this.countNodeEncounter(t,e)}}emitNode(t,e,i,u,m){if(!t.nodeDefinitions.get(i.function)){let c=new Map;for(let o of i.function.nodeDefinitions)c.set(o.id,o);t.nodeDefinitions.set(i.function,c)}let v=t.nodeDefinitions.get(i.function).get(i.definitionId);if(!v)throw new A(`Node definition "${i.definitionId}" not found for node "${i.label}".`,this);v instanceof wt&&e.dependencies.push(v.function);let w={},D=new Array;for(let c of i.inputs.value){let o=this.resolveInputValue(t,e,c);w[c.definitionId]=o.inputPort,e.ports.set(c,o.inputPort.value),o.emitResult&&D.push(o.emitResult)}let S={};for(let c of i.outputs.list)S[c.definitionId]={value:this.generatePortValue(t,e,c),code:{inner:u[c.definitionId]??""}};let l=v.codeGenerator({inputs:w,outputs:S,code:{next:m??""}}),r=this.getGeneratedNodeId(t,e,i);t.debug&&(l=this.mProject.generator.value.hook(`start-${r}`)+l+this.mProject.generator.value.hook(`end-${r}`));let h=new Array;for(let c of D)h.push(...c.codeOutput);return h.push(l),{codeOutput:h,lastGeneratedNode:i,endFlowPort:null}}findBranchStartPoint(t){let e=this.getNodesInputFlowPorts(t),i=e.length,u=new Map,m=new Array,v=(w,D)=>{let S=(u.has(w)||u.set(w,new Set),u.get(w)),l=S.size;for(let r of D)S.add(r);return S.size>l&&m.push(w),S};for(let[w,D]of e.entries())v(D.node,[w]);for(;m.length>0;){let w=m.shift(),D=u.get(w);for(let S of this.getNodesInputFlowPorts(w))if(v(S.node,D).size===i)return S.node}throw new A("No common branch point found for merge node.",this)}generateFunctionWithDependencies(t,e,i){let u=new Array;if(e.length===0)return u;let m=e.at(0).function;i.add(m);let v=new ao(m);u.push(v);for(let w of e){let D=this.generateNodeCode(t,w);v.addGraph(D);for(let S of D.dependencies)i.has(S)||u.push(...this.generateFunctionWithDependencies(t,S.getExitNodes(),i))}return u.reverse()}generateNodeCode(t,e){let i={dependencies:new Array,nodes:new Map,ports:new Map,scope:this.createScope(e,null)},u=this.walkBackward(t,i,e,null),m=u.codeOutput.join(" ");return new lo({bodyCode:m,dependencies:i.dependencies,entryNode:u.lastGeneratedNode,exitNode:e,nodeIds:new Map(i.nodes),portValues:new Map(i.ports)})}generatePortValue(t,e,i){if(!e.ports.has(i)){let u=this.mProject.generator.value.name(i.label),m=this.mProject.generator.value.id(u,t.counter.portIndex++);e.ports.set(i,m)}return e.ports.get(i)}getGeneratedNodeId(t,e,i){if(!e.nodes.has(i)){let m=(++t.counter.nodeIndex).toString(16).toUpperCase().padStart(8,"0");e.nodes.set(i,m)}return e.nodes.get(i)}getNodesInputFlowPorts(t){let e=new Array;for(let i of t.inputs.flow)e.push(...this.resolveFlowConjunctions(i));return[...new Set(e)]}handleFlowMerge(t,e,i,u,m){let v=m.join(" "),w=this.findBranchStartPoint(i),D={},S=e.scope;try{for(let l of u){e.scope=this.createScope(l.node,w);let r=this.walkBackward(t,e,l.node,w);D[r.endFlowPort.definitionId]=r.codeOutput.join(" ")}}finally{e.scope=S}return this.emitNode(t,e,w,D,v)}resolveFlowConjunctions(t){let e=new Array;for(let i of t.connectedPorts){if(i.node.definitionId!==K.DEFINITION_ID){e.push(i);continue}let u=i.node.inputs.flow[0];!u||u.connectedPorts.size===0||e.push(...this.resolveFlowConjunctions(u))}return e}resolveInputValue(t,e,i){let u=this.resolveValueConjunctions(i);if(!u){if(this.mProject.types.isGenericType(i.dataType))throw new A("Generic value inputs must be allways connected",this);return{inputPort:{value:this.mProject.types.getType(i.dataType).convert([...i.directValue]),isDirectValue:!0},emitResult:null}}let m=u.node,v=!m.hasFlowPorts,w=(()=>{if(!m.hasFlowPorts){if(e.scope.emittedNodes.has(m))return null;let D=e.scope.remaining.get(m);if(v&&(D=0),e.scope.remaining.set(m,D),D<=0)return e.scope.emittedNodes.add(m),this.emitNode(t,e,m,{})}return null})();return{inputPort:{value:this.generatePortValue(t,e,u),isDirectValue:!1},emitResult:w}}resolveValueConjunctions(t){if(t.connectedPorts.size===0)return null;let e=t.connectedPorts.values().next().value;if(e.node.definitionId!==et.DEFINITION_ID)return e;let i=e.node.inputs.value[0];return!i||i.connectedPorts.size===0?null:this.resolveValueConjunctions(i)}walkBackward(t,e,i,u){let m={codeOutput:new Array,lastGeneratedNode:null,endFlowPort:null},v=null,w=i;for(;w!==null&&w!==u;){let D={};v!==null&&(D[v.definitionId]=m.codeOutput.join(" "),m.codeOutput=new Array);let S=m.codeOutput;m=this.emitNode(t,e,w,D),m.codeOutput=[...m.codeOutput,...S];let l=this.getNodesInputFlowPorts(w);if(l.length===0)break;l.length>1&&(m=this.handleFlowMerge(t,e,w,l,m.codeOutput),l=this.getNodesInputFlowPorts(m.lastGeneratedNode)),v=l[0]??null,w=v?.node??null}if(!m.lastGeneratedNode)throw new A(`Walk did not reach an entry node from exit "${i.label}".`,this);if(u&&w!==u)throw new A("Malformed graph. End node not reached",this);return m.endFlowPort=v,m}};var ht=class{static MAIN="MAIN";mBuild;mDefaultParameters;mFunction;mTypes;get defaultParameters(){return this.mDefaultParameters}get function(){return this.mFunction}get types(){return this.mTypes}constructor(t,e){this.mFunction=t,this.mDefaultParameters=e.defaultParameters,this.mTypes=new Set(e.types),this.mBuild=e.build}compile(t,e){return this.mBuild({defaultParameters:this.mDefaultParameters,function:this.mFunction,projectTypes:t.entryPoint.function.project.types},t,e)}};var qa=`:host {\r
    /* Somehow this needs to be flex or we get an nasty overflow. */\r
    display: flex;\r
    flex-direction: column;\r
}\r
\r
.resize-box {\r
    --resize-box-handle-color: var(--potatno-color-border);\r
    --resize-box-handle-hover-color: var(--potatno-color-accent);\r
\r
    /* Set min sizes to restrict resizing. */\r
    min-height: 10rem;\r
    min-width: 12.5rem;\r
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
    align-items: flex-start;\r
    justify-content: space-between;\r
    border-bottom: 1px solid var(--potatno-color-border);\r
    background-color: var(--potatno-color-background-dark);\r
    overflow: hidden;\r
\r
    /* Make wrapped element hide, by giving it a height and vertical gap */\r
    flex-wrap: wrap;\r
    gap: 0.5rem;\r
    height: 2.3rem;\r
\r
    /* Adjust border for resize box */\r
    padding: calc(0.3rem + 2px) calc(0.3rem + 2px) 0 calc(0.3rem + 2px);\r
\r
    /* Should never shrink */\r
    flex-shrink: 0;\r
\r
    .header__tabs {\r
        display: flex;\r
        column-gap: 0.3rem;\r
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
            --button-text-color: var(--potatno-color-text);\r
\r
            padding: 0.3rem 1rem;\r
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
        gap: 0.4rem;\r
        padding: 0.25rem 0.45rem;\r
        align-items: center;\r
\r
        background-color: var(--potatno-color-background);\r
        border: 1px solid var(--potatno-color-border);\r
        border-radius: var(--potatno-border-radius);\r
\r
        &:focus-within {\r
            border-color: var(--potatno-color-accent);\r
        }\r
\r
        >select {\r
            padding: 0 1rem 0 0;\r
            border: none;\r
            outline: 1px solid transparent;\r
            background-color: var(--potatno-color-background);\r
\r
            font-family: inherit;\r
            font-size: var(--potatno-font-size-small);\r
\r
            color: var(--potatno-color-text);\r
        }\r
\r
        .seperator {\r
            flex-shrink: 0;\r
            height: 1.2rem;\r
            width: 2px;\r
            background-color: var(--potatno-color-border);\r
        }\r
    }\r
}\r
\r
.content {\r
    flex: 1;\r
    padding: 0.25rem;\r
    background-color: var(--potatno-color-background);\r
    overflow: auto;\r
\r
    scrollbar-color: var(--potatno-color-scrollbar-thumb) var(--potatno-color-scrollbar-track);\r
    scrollbar-width: thin;\r
\r
    .content__preview-code {\r
        box-sizing: border-box;\r
        width: calc(100% - 20px);\r
        margin: 0 0.625rem;\r
        padding: 0.625rem 0;\r
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
    padding: 0.4rem 0.6rem 0.4rem 0.8rem;\r
\r
    .error-item__icon {\r
        display: flex;\r
        align-items: center;\r
\r
        color: var(--potatno-color-error);\r
        font-size: 1.5rem;\r
        font-weight: bold;\r
        padding: 0 0.8rem;\r
\r
        border-left: 0.25rem solid var(--potatno-color-error);\r
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
        margin-top: 0.125rem;\r
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
}`;var Ja=`<kg-resize-box class="resize-box" left top bottom="false">\r
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
            $if(this.displayOptions.size > 0) {\r
                <div class="header__selectors">\r
                    <select class="preview-select" (change)="this.selectedDisplayId = $event.target.value">\r
                        $for(display of this.displayOptions) {\r
                            <option [value]="this.display[0]" [selected]="this.display[0] === this.selectedDisplayId">{{this.display[1]}}</option>\r
                        }\r
                    </select>\r
\r
                    $if(this.outputOptions.size > 0) {\r
                        <div class="seperator"/>\r
\r
                        <select class="preview-select" (change)="this.selectedOutputId = $event.target.value">\r
                            $for(output of this.outputOptions) {\r
                                <option [value]="this.output[0]" [selected]="this.output[0] === this.selectedOutputId">{{this.output[1].label}}</option>\r
                            }\r
                        </select>\r
                    }\r
                </div>\r
            }\r
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
`;function Jc(){function y(l,r){return function(c){e(r,"addInitializer"),i(c,"An initializer"),l.push(c)}}function t(l,r,h,c,o,b,p,T,x){var d;switch(o){case 1:d="accessor";break;case 2:d="method";break;case 3:d="getter";break;case 4:d="setter";break;default:d="field"}var s={kind:d,name:p?"#"+r:r,static:b,private:p,metadata:T},f={v:!1};s.addInitializer=y(c,f);var n,a;if(o===0?p?(n=h.get,a=h.set):(n=function(){return this[r]},a=function(g){this[r]=g}):o===2?n=function(){return h.value}:((o===1||o===3)&&(n=function(){return h.get.call(this)}),(o===1||o===4)&&(a=function(g){h.set.call(this,g)})),p)s.access=n&&a?{get:n,set:a}:n?{get:n}:{set:a};else{if(n){var I=n;n=function(g){return arguments.length===0&&(g=this),I.call(g)}}if(a){var P=a;a=function(g,_){return arguments.length===1&&(_=g,g=this),P.call(g,_)}}var E=function(g){return r in g};s.access=n&&a?{has:E,get:n,set:a}:n?{has:E,get:n}:{has:E,set:a}}try{return l(x,s)}finally{f.v=!0}}function e(l,r){if(l.v)throw new Error("attempted to call "+r+" after decoration was finished")}function i(l,r){if(typeof l!="function")throw new TypeError(r+" must be a function")}function u(l,r){var h=typeof r;if(l===1){if(h!=="object"||r===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");r.get!==void 0&&i(r.get,"accessor.get"),r.set!==void 0&&i(r.set,"accessor.set"),r.init!==void 0&&i(r.init,"accessor.init")}else if(h!=="function"){var c;throw l===0?c="field":l===10?c="class":c="method",new TypeError(c+" decorators must return a function or void 0")}}function m(l,r,h,c,o,b,p,T,x){var d=h[0],s,f,n;p?o===0||o===1?s={get:h[3],set:h[4]}:o===3?s={get:h[3]}:o===4?s={set:h[3]}:s={value:h[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(r,c)),o===1?n={get:s.get,set:s.set}:o===2?n=s.value:o===3?n=s.get:o===4&&(n=s.set);var a,I,P;if(typeof d=="function")a=t(d,c,s,T,o,b,p,x,n),a!==void 0&&(u(o,a),o===0?f=a:o===1?(f=a.init,I=a.get||n.get,P=a.set||n.set,n={get:I,set:P}):n=a);else for(var E=d.length-1;E>=0;E--){var g=d[E];if(a=t(g,c,s,T,o,b,p,x,n),a!==void 0){u(o,a);var _;o===0?_=a:o===1?(_=a.init,I=a.get||n.get,P=a.set||n.set,n={get:I,set:P}):n=a,_!==void 0&&(f===void 0?f=_:typeof f=="function"?f=[f,_]:f.push(_))}}if(o===0||o===1){if(f===void 0)f=function(M,C){return C};else if(typeof f!="function"){var F=f;f=function(M,C){for(var N=C,L=0;L<F.length;L++)N=F[L].call(M,N);return N}}else{var j=f;f=function(M,C){return j.call(M,C)}}l.push(f)}o!==0&&(o===1?(s.get=n.get,s.set=n.set):o===2?s.value=n:o===3?s.get=n:o===4&&(s.set=n),p?o===1?(l.push(function(M,C){return n.get.call(M,C)}),l.push(function(M,C){return n.set.call(M,C)})):o===2?l.push(n):l.push(function(M,C){return n.call(M,C)}):Object.defineProperty(r,c,s))}function v(l,r,h){for(var c=[],o,b,p=new Map,T=new Map,x=0;x<r.length;x++){var d=r[x];if(Array.isArray(d)){var s=d[1],f=d[2],n=d.length>3,a=s>=5,I,P;if(a?(I=l,s=s-5,b=b||[],P=b):(I=l.prototype,o=o||[],P=o),s!==0&&!n){var E=a?T:p,g=E.get(f)||0;if(g===!0||g===3&&s!==4||g===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!g&&s>2?E.set(f,s):E.set(f,!0)}m(c,I,d,f,s,a,n,P,h)}}return w(c,o),w(c,b),c}function w(l,r){r&&l.push(function(h){for(var c=0;c<r.length;c++)r[c].call(h);return h})}function D(l,r,h){if(r.length>0){for(var c=[],o=l,b=l.name,p=r.length-1;p>=0;p--){var T={v:!1};try{var x=r[p](o,{kind:"class",name:b,addInitializer:y(c,T),metadata:h})}finally{T.v=!0}x!==void 0&&(u(10,x),o=x)}return[S(o,h),function(){for(var d=0;d<c.length;d++)c[d].call(o)}]}}function S(l,r){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:r})}return function(r,h,c,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var p=Object.create(b===void 0?null:b),T=v(r,h,p);return c.length||S(r,p),{e:T,get c(){return D(r,c,p)}}}}function nl(y,t,e,i){return(nl=Jc())(y,t,e,i)}var il,Ka,sl,al,ll,cl,Qa,ka,tl,el,ol,Fo;il=U({selector:"potatno-preview",template:Ja,style:qa,modules:[Ae],components:[Yt,Mt]}),sl=V.state(),al=V.state(),ll=V.state(),cl=V.state();var rl=class{static{({e:[Qa,ka,tl,el,ol],c:[Fo,Ka]}=nl(this,[[sl,1,"mSelectedDisplayId"],[al,1,"mSelectedOutputId"],[ll,1,"selectedTab"],[cl,1,"previewCode"]],[il]))}constructor(t=O.use(G),e=O.use(H)){this.mComponent=t,this.mManager=e,this.mSelectedDisplayId="",this.mSelectedOutputId="",this.selectedTab="preview",this.previewCode="";let i=R.NodeUpdate|R.NodeAdd|R.NodeDelete;this.mPreviewTargets=this.findFunctionPreviewTargets(),this.mUnsubscribeOutputFetch=this.mManager.subscribe(R.SpecialActiveFunction|i,()=>{this.mPreviewTargets=this.findFunctionPreviewTargets()}),this.mUnsubscribeErrorResolve=this.mManager.subscribe(R.SpecialActiveFunction|i|R.Connection,()=>{this.mComponent.updater.updateAsync()});let u=0;this.mManager.subscribe(R.Any,()=>{globalThis.clearTimeout(u),u=globalThis.setTimeout(()=>{this.previewCode=this.generateFunctionCode()},1e3)})}mComponent;mManager;mPreviewTargets;mUnsubscribeErrorResolve;mUnsubscribeOutputFetch;#t=(ol(this),Qa(this));get mSelectedDisplayId(){return this.#t}set mSelectedDisplayId(t){this.#t=t}#e=ka(this);get mSelectedOutputId(){return this.#e}set mSelectedOutputId(t){this.#e=t}#o=tl(this);get selectedTab(){return this.#o}set selectedTab(t){this.#o=t}#r=el(this);get previewCode(){return this.#r}set previewCode(t){this.#r=t}get displayOptions(){let t=this.mPreviewTargets.get(this.selectedOutputId);return t?t.displays:new Map}get errors(){return this.mManager.integrity.errors}get outputOptions(){return this.mPreviewTargets}get previewDriver(){let t=this.mPreviewTargets.get(this.selectedOutputId);return t?this.mManager.preview.requestDriver(t.target,this.selectedDisplayId):null}get selectedDisplayId(){let t=this.displayOptions;if(!t.has(this.mSelectedDisplayId)){let e=t.keys().next().value;typeof e<"u"&&(this.mSelectedDisplayId=e)}return this.mSelectedDisplayId}set selectedDisplayId(t){this.mSelectedDisplayId=t}get selectedOutputId(){let t=this.outputOptions;if(!t.has(this.mSelectedOutputId)){let e=t.keys().next().value;typeof e<"u"&&(this.mSelectedOutputId=e)}return this.mSelectedOutputId}set selectedOutputId(t){this.mSelectedOutputId=t}getDocumentItemLabel(t){switch(!0){case t instanceof pt:return t.label;case t instanceof it:return t.label;case t instanceof lt:return t.label}return"Item"}getDocumentItemTypeName(t){switch(!0){case t instanceof pt:return"Node";case t instanceof it:return"Port";case t instanceof lt:return"Function"}return"Item"}onDeconstruct(){this.mUnsubscribeErrorResolve(),this.mUnsubscribeOutputFetch()}openDocumentItem(t){switch(!0){case t instanceof pt:{this.mManager.grid.selectNodes([t],!0);break}case t instanceof it:{this.mManager.grid.selectNodes([t.node],!0);break}case t instanceof lt:{this.mManager.setActiveFunction(t);break}}}findFunctionPreviewTargets(){let t=new Map,e=this.mManager.activeFunction,i=e.project.getFunction(e.definitionId);if(!i)return t;let u=w=>{let D=new Map;for(let S of w)D.set(S,e.project.preview.getDisplay(S).name);return D},m=e.project.preview.availableDisplays(i,ht.MAIN);m.length>0&&t.set(ht.MAIN,{label:ht.MAIN,target:e,displays:u(m)});let v=new Map;for(let w of e.getExitNodes())for(let D of w.inputs.value){let S=D.resolvedDataType;v.has(S)||v.set(S,D.project.preview.availableDisplays(i,S));let l=v.get(S);l.length!==0&&t.set(D.definitionId,{label:D.label,target:D,displays:u(l)})}return t}generateFunctionCode(){if(!this.mManager.integrity.isValid)return"";let t=this.mManager.activeFunction;return new ce(t.project).generateFunction(t,!1).code}static{Ka()}};var ul=`:host {\r
    font-family: var(--potatno-font-family);\r
    font-size: var(--potatno-font-size);\r
}\r
\r
.editor {\r
    --window-padding: 0.375rem;\r
\r
    position: relative;\r
    display: flex;\r
    width: calc(100% - (var(--window-padding) * 2));\r
    height: calc(100% - (var(--window-padding) * 2));\r
    padding: var(--window-padding);\r
\r
    /* Global background color */\r
    background-color: var(--potatno-color-background);\r
\r
    .editor__center {\r
        position: relative;\r
        flex: 1;\r
        display: flex;\r
        flex-direction: column;\r
\r
        /* "Window" design */\r
        margin: 0 calc(var(--window-padding) / 2) 0 calc(var(--window-padding) / 2);\r
        border: 1px solid var(--potatno-color-border);\r
        border-radius: var(--potatno-border-radius);\r
        overflow: hidden;\r
    }\r
\r
    potatno-function-list {\r
        /* "Window" design */\r
        margin: 0 calc(var(--window-padding) / 2) 0 0;\r
        border: 1px solid var(--potatno-color-border);\r
        border-radius: var(--potatno-border-radius);\r
    }\r
\r
    potatno-function-properties {\r
        /* "Window" design */\r
        margin: 0 0 0 calc(var(--window-padding) / 2);\r
        border: 1px solid var(--potatno-color-border);\r
        border-radius: var(--potatno-border-radius);\r
    }\r
\r
    .editor__preview {\r
        position: absolute;\r
        bottom: 0.75rem;\r
        right: 0.75rem;\r
        z-index: 100;\r
\r
        /* Preview should never overflow the graph window. Set gap to 12px on all sides. */\r
        max-width: calc(100% - 1.5rem);\r
        max-height: calc(100% - 1.5rem);\r
    }\r
\r
    .editor__graph {\r
        flex: 1;\r
    }\r
}`;var hl=`<div class="editor">\r
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
</div>`;function kc(){function y(l,r){return function(c){e(r,"addInitializer"),i(c,"An initializer"),l.push(c)}}function t(l,r,h,c,o,b,p,T,x){var d;switch(o){case 1:d="accessor";break;case 2:d="method";break;case 3:d="getter";break;case 4:d="setter";break;default:d="field"}var s={kind:d,name:p?"#"+r:r,static:b,private:p,metadata:T},f={v:!1};s.addInitializer=y(c,f);var n,a;if(o===0?p?(n=h.get,a=h.set):(n=function(){return this[r]},a=function(g){this[r]=g}):o===2?n=function(){return h.value}:((o===1||o===3)&&(n=function(){return h.get.call(this)}),(o===1||o===4)&&(a=function(g){h.set.call(this,g)})),p)s.access=n&&a?{get:n,set:a}:n?{get:n}:{set:a};else{if(n){var I=n;n=function(g){return arguments.length===0&&(g=this),I.call(g)}}if(a){var P=a;a=function(g,_){return arguments.length===1&&(_=g,g=this),P.call(g,_)}}var E=function(g){return r in g};s.access=n&&a?{has:E,get:n,set:a}:n?{has:E,get:n}:{has:E,set:a}}try{return l(x,s)}finally{f.v=!0}}function e(l,r){if(l.v)throw new Error("attempted to call "+r+" after decoration was finished")}function i(l,r){if(typeof l!="function")throw new TypeError(r+" must be a function")}function u(l,r){var h=typeof r;if(l===1){if(h!=="object"||r===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");r.get!==void 0&&i(r.get,"accessor.get"),r.set!==void 0&&i(r.set,"accessor.set"),r.init!==void 0&&i(r.init,"accessor.init")}else if(h!=="function"){var c;throw l===0?c="field":l===10?c="class":c="method",new TypeError(c+" decorators must return a function or void 0")}}function m(l,r,h,c,o,b,p,T,x){var d=h[0],s,f,n;p?o===0||o===1?s={get:h[3],set:h[4]}:o===3?s={get:h[3]}:o===4?s={set:h[3]}:s={value:h[3]}:o!==0&&(s=Object.getOwnPropertyDescriptor(r,c)),o===1?n={get:s.get,set:s.set}:o===2?n=s.value:o===3?n=s.get:o===4&&(n=s.set);var a,I,P;if(typeof d=="function")a=t(d,c,s,T,o,b,p,x,n),a!==void 0&&(u(o,a),o===0?f=a:o===1?(f=a.init,I=a.get||n.get,P=a.set||n.set,n={get:I,set:P}):n=a);else for(var E=d.length-1;E>=0;E--){var g=d[E];if(a=t(g,c,s,T,o,b,p,x,n),a!==void 0){u(o,a);var _;o===0?_=a:o===1?(_=a.init,I=a.get||n.get,P=a.set||n.set,n={get:I,set:P}):n=a,_!==void 0&&(f===void 0?f=_:typeof f=="function"?f=[f,_]:f.push(_))}}if(o===0||o===1){if(f===void 0)f=function(M,C){return C};else if(typeof f!="function"){var F=f;f=function(M,C){for(var N=C,L=0;L<F.length;L++)N=F[L].call(M,N);return N}}else{var j=f;f=function(M,C){return j.call(M,C)}}l.push(f)}o!==0&&(o===1?(s.get=n.get,s.set=n.set):o===2?s.value=n:o===3?s.get=n:o===4&&(s.set=n),p?o===1?(l.push(function(M,C){return n.get.call(M,C)}),l.push(function(M,C){return n.set.call(M,C)})):o===2?l.push(n):l.push(function(M,C){return n.call(M,C)}):Object.defineProperty(r,c,s))}function v(l,r,h){for(var c=[],o,b,p=new Map,T=new Map,x=0;x<r.length;x++){var d=r[x];if(Array.isArray(d)){var s=d[1],f=d[2],n=d.length>3,a=s>=5,I,P;if(a?(I=l,s=s-5,b=b||[],P=b):(I=l.prototype,o=o||[],P=o),s!==0&&!n){var E=a?T:p,g=E.get(f)||0;if(g===!0||g===3&&s!==4||g===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!g&&s>2?E.set(f,s):E.set(f,!0)}m(c,I,d,f,s,a,n,P,h)}}return w(c,o),w(c,b),c}function w(l,r){r&&l.push(function(h){for(var c=0;c<r.length;c++)r[c].call(h);return h})}function D(l,r,h){if(r.length>0){for(var c=[],o=l,b=l.name,p=r.length-1;p>=0;p--){var T={v:!1};try{var x=r[p](o,{kind:"class",name:b,addInitializer:y(c,T),metadata:h})}finally{T.v=!0}x!==void 0&&(u(10,x),o=x)}return[S(o,h),function(){for(var d=0;d<c.length;d++)c[d].call(o)}]}}function S(l,r){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:r})}return function(r,h,c,o){if(o!==void 0)var b=o[Symbol.metadata||Symbol.for("Symbol.metadata")];var p=Object.create(b===void 0?null:b),T=v(r,h,p);return c.length||S(r,p),{e:T,get c(){return D(r,c,p)}}}}function pl(y,t,e,i){return(pl=kc())(y,t,e,i)}var gl,fl,vl,yl,dl,zo;gl=U({selector:"potatno-code-editor",template:hl,style:ul,components:[Io,io,Po,Fo]}),vl=B(),yl=B();var ml=class{static{({e:[dl],c:[zo,fl]}=pl(this,[[vl,3,"document"],[yl,2,"triggerPreviewUpdate"]],[gl]))}constructor(t=O.use(G),e=O.use(H)){dl(this),this.mComponent=t,this.mManager=e,this.mUnsubscribe=this.mManager.subscribe(R.Document|R.SpecialActiveFunction,()=>{this.mComponent.updater.updateAsync()})}mComponent;mManager;mUnsubscribe;get document(){return this.mManager.graph.document}set document(t){this.mManager.graph.setDocument(t)}get hasPreview(){let t=this.mManager.activeFunction,e=t.project.getFunction(t.definitionId);return e?t.project.preview.availableDisplays(e).length>0:!1}triggerPreviewUpdate(){return this.mManager.preview.execute()}onDeconstruct(){this.mUnsubscribe()}static{fl()}};var co=class extends ge{mCodeEditor;mProject;mUiManager;get document(){return this.mCodeEditor.document}set document(t){this.mCodeEditor.document=t}get project(){return this.mProject}constructor(t){super(),this.mProject=t,this.addStyle(Nr),this.addStyle(Ar),this.mUiManager=new H(t),this.setInjection(H,this.mUiManager),this.mCodeEditor=this.addContent(zo)}deconstruct(){this.mUiManager.deconstruct()}load(t){let e=JSON.parse(t);if(!Array.isArray(e.functions))throw new A("Could not load document. Document has a wrong format.",this);let i=new ne(this.mProject).deserialize(e);this.document=i}save(){let t=new ie().serialize(this.document);return JSON.stringify(t)}update(){this.mCodeEditor.triggerPreviewUpdate()}};var $=class extends at{constructor(t){super({id:t.id,label:t.label,category:t.category,regions:t.regions??null,generators:{ports:{inputs:e=>{for(let i of t.ports.inputs)e(i)},outputs:e=>{for(let i of t.ports.outputs)e(i)}},code:t.generators.code}})}};var uo=class{mDisplays;get displayIds(){return[...this.mDisplays.keys()]}constructor(){this.mDisplays=new Map}addDisplay(t){this.mDisplays.set(t.id,t)}availableDisplays(t,e=null){let i=new Array;for(let[u,m]of this.mDisplays)m.executor.function.id===t.id&&(e===null||m.allowsType(e))&&i.push(u);return i}getDisplay(t){return this.mDisplays.get(t)??null}};var ho=class{mCodeGenerator;mEntryPoint;mImports;mNodeDefinitions;mPreview;mTypes;mUserFunctions;get entryPoint(){return this.mEntryPoint}get generator(){return this.mCodeGenerator}get imports(){return this.mImports}get nodeDefinitions(){return this.mNodeDefinitions}get preview(){return this.mPreview}get types(){return this.mTypes}get userFunctions(){return this.mUserFunctions}constructor(t,e,i){this.mTypes=t,this.mCodeGenerator=i.generator,this.mPreview=new uo,this.mNodeDefinitions=new Map,this.mImports=new Array,this.mUserFunctions=new Map,this.mEntryPoint=e,this.addNodeDefinition(new K),this.addNodeDefinition(new et),this.addNodeDefinition(new xt)}addImport(t){this.mImports.push(t)}addNodeDefinition(t){this.mNodeDefinitions.set(t.id,t)}getFunction(t){return this.mEntryPoint.id===t?this.mEntryPoint:this.mUserFunctions.get(t)}setDynamicFunction(t){this.mUserFunctions.set(t.id,t)}};var fo=class{mTypes;get typeNames(){return Array.from(this.mTypes.keys())}get types(){return this.mTypes}constructor(t){this.mTypes=new Map;for(let[e,i]of Object.entries(t))this.mTypes.set(e,{name:e,...i})}getDefaultValue(t){return this.getType(t).default.value}getType(t){if(!this.mTypes.has(t))throw new Error(`Type "${t}" is not defined in the project types definition.`);return this.mTypes.get(t)}isGenericType(t){return typeof t!="string"?!1:/^<[^>]+>$/.test(t)}};var mo=class extends fo{constructor(){super({number:{default:{string:["0"],value:0},convert:t=>{let e=t[0],i=parseFloat(e);if(isNaN(i))throw new Error(`Invalid number: "${e}"`);return i.toString()},inputs:[{name:"value",type:"number"}]},string:{default:{string:[""],value:""},convert:t=>t[0],inputs:[{name:"value",type:"string"}]},boolean:{default:{string:["false"],value:!1},convert:t=>{let e=t[0].toLowerCase();if(e==="true")return"true";if(e==="false")return"false";throw new Error(`Invalid boolean: "${t[0]}"`)},inputs:[{name:"value",type:"boolean"}]}})}};var po=class extends ae{constructor(){super({id:"pixelShader",label:"Pixel Shader",statics:zt.inputs|zt.outputs,nodes:{entry:t=>{t(new $({id:"OnPixel",label:"OnPixel",category:{name:"event"},ports:{inputs:[],outputs:[{label:"exec",id:"exec",portType:"flow"},{label:"x",id:"x",portType:"value",dataType:"number"},{label:"y",id:"y",portType:"value",dataType:"number"}]},generators:{code:e=>{let i=e.outputs.x.value,u=e.outputs.y.value;return`(${i}, ${u}) => { ${e.outputs.exec.code.inner} }`}}}))},exit:t=>{t(new $({id:"PixelResult",label:"PixelResult",category:{name:"Output"},ports:{inputs:[{label:"exec",id:"exec",portType:"flow"},{label:"red",id:"red",portType:"value",dataType:"number"},{label:"green",id:"green",portType:"value",dataType:"number"},{label:"blue",id:"blue",portType:"value",dataType:"number"}],outputs:[]},generators:{code:e=>`return [${e.inputs.red.value}, ${e.inputs.green.value}, ${e.inputs.blue.value}];`}}))}},generator:{code:{body:t=>{let e=t.graphResultOf("OnPixel");return`const ${t.function.definitionId} = ${e?.code??"() => [0, 0, 0]"};`},value:t=>`${t.function.definitionId}()`}}})}};var go=class extends ae{constructor(){super({id:"Helper Function",label:"Helper Function",statics:zt.none,nodes:{entry:(t,e)=>{t(new at({id:"HelperFunctionEntry",label:"Entry",category:{name:"event"},generators:{ports:{outputs:i=>{i({label:"exec",id:"exec",portType:"flow"});for(let u of e.inputs)i({label:u.label,id:u.label,portType:"value",dataType:u.dataType})},inputs:()=>{}},code:i=>`(${Object.entries(i.outputs).filter(([m])=>m!=="exec").map(([,m])=>m.value).join(", ")}) => { ${i.outputs.exec.code.inner} }`}}))},exit:(t,e)=>{t(new at({id:"HelperFunctionReturn",label:"Return",category:{name:"event"},generators:{ports:{outputs:()=>{},inputs:i=>{i({label:"exec",id:"exec",portType:"flow"});for(let u of e.outputs)i({label:u.label,id:u.label,portType:"value",dataType:u.dataType})}},code:i=>`return { ${Object.entries(i.inputs).map(([m,v])=>`${m}: (${v.value})`).join(", ")} };`}}))}},generator:{code:{body:t=>{let e=t.function.project.generator.value.name(t.function.label),i=t.graphResultOf("HelperFunctionEntry");return`const ${e} = ${i?.code??"() => ({})"};`},value:t=>{let e=t.function.project.generator.value.name(t.function.label),i=Object.entries(t.inputs).map(([,v])=>v.value).join(", "),u=Object.entries(t.outputs).map(([v,w])=>`${v}: ${w.value}`).join(", "),m=t.outputs.Output?.code.inner??"";return u===""?`${e}(${i}); ${m}`:`const { ${u} } = ${e}(${i}); ${m}`}}}})}};var vo=class extends ho{mUserFunction;get userFunction(){return this.mUserFunction}constructor(){let t=new mo,e=new po,i=new go;super(t,e,{generator:{code:u=>{let m="";for(let v of u.dependencies)m+=`${v.code}
`;return m+=u.entryPoint.code,m},value:{id:(u,m)=>`${u}_${m}`,name:u=>{let m=u.replaceAll(/[^A-Za-z0-9_]/g,"");return/^[0-9]/.test(m)?`_${m}`:m},hook:u=>`/*[${u}]*/`}}}),this.mUserFunction=i,this.setDynamicFunction(i),this.addBaseNodeDefinitions()}addBaseNodeDefinitions(){this.addNodeDefinition(new $({id:"Add",label:"Add",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} + ${t.inputs.b.value};`}})),this.addNodeDefinition(new $({id:"Subtract",label:"Subtract",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} - ${t.inputs.b.value};`}})),this.addNodeDefinition(new $({id:"Multiply",label:"Multiply",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} * ${t.inputs.b.value};`}})),this.addNodeDefinition(new $({id:"Divide",label:"Divide",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} / ${t.inputs.b.value};`}})),this.addNodeDefinition(new $({id:"Modulo",label:"Modulo",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} % ${t.inputs.b.value};`}})),this.addNodeDefinition(new $({id:"Equal",label:"Equal",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"boolean"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} === ${t.inputs.b.value};`}})),this.addNodeDefinition(new $({id:"Not Equal",label:"Not Equal",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"boolean"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} !== ${t.inputs.b.value};`}})),this.addNodeDefinition(new $({id:"Less Than",label:"Less Than",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"boolean"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} < ${t.inputs.b.value};`}})),this.addNodeDefinition(new $({id:"Greater Than",label:"Greater Than",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"boolean"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} > ${t.inputs.b.value};`}})),this.addNodeDefinition(new $({id:"And",label:"And",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"boolean"},{label:"b",id:"b",portType:"value",dataType:"boolean"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"boolean"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} && ${t.inputs.b.value};`}})),this.addNodeDefinition(new $({id:"Or",label:"Or",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"boolean"},{label:"b",id:"b",portType:"value",dataType:"boolean"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"boolean"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} || ${t.inputs.b.value};`}})),this.addNodeDefinition(new $({id:"Not",label:"Not",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"boolean"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"boolean"}]},generators:{code:t=>`const ${t.outputs.result.value} = !${t.inputs.a.value};`}})),this.addNodeDefinition(new $({id:"Number to String",label:"Number to String",category:{name:"type-conversion"},ports:{inputs:[{label:"input",id:"input",portType:"value",dataType:"number"}],outputs:[{label:"output",id:"output",portType:"value",dataType:"string"}]},generators:{code:t=>`const ${t.outputs.output.value} = String(${t.inputs.input.value});`}})),this.addNodeDefinition(new $({id:"String to Number",label:"String to Number",category:{name:"type-conversion"},ports:{inputs:[{label:"input",id:"input",portType:"value",dataType:"string"}],outputs:[{label:"output",id:"output",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.output.value} = Number(${t.inputs.input.value});`}})),this.addNodeDefinition(new $({id:"Boolean to String",label:"Boolean to String",category:{name:"type-conversion"},ports:{inputs:[{label:"input",id:"input",portType:"value",dataType:"boolean"}],outputs:[{label:"output",id:"output",portType:"value",dataType:"string"}]},generators:{code:t=>`const ${t.outputs.output.value} = String(${t.inputs.input.value});`}})),this.addNodeDefinition(new $({id:"If",label:"If",category:{name:"flow"},ports:{inputs:[{label:"exec",id:"exec",portType:"flow"},{label:"condition",id:"condition",portType:"value",dataType:"boolean"}],outputs:[{label:"then",id:"then",portType:"flow"},{label:"else",id:"else",portType:"flow"}]},generators:{code:t=>`if (${t.inputs.condition.value}) {
${t.outputs.then.code.inner}
} else {
${t.outputs.else.code.inner}
}`}})),this.addNodeDefinition(new $({id:"While",label:"While",category:{name:"flow"},ports:{inputs:[{label:"exec",id:"exec",portType:"flow"},{label:"condition",id:"condition",portType:"value",dataType:"boolean"}],outputs:[{label:"body",id:"body",portType:"flow"}]},generators:{code:t=>`while (${t.inputs.condition.value}) {
${t.outputs.body.code.inner}
}`}})),this.addNodeDefinition(new $({id:"For Loop",label:"For Loop",category:{name:"flow"},ports:{inputs:[{label:"exec",id:"exec",portType:"flow"},{label:"count",id:"count",portType:"value",dataType:"number"}],outputs:[{label:"exec",id:"exec",portType:"flow"},{label:"index",id:"index",portType:"value",dataType:"number"}]},generators:{code:t=>`for (let ${t.outputs.index.value} = 0; ${t.outputs.index.value} < ${t.inputs.count.value}; ${t.outputs.index.value}++) {
${t.outputs.exec.code.inner}
}`}})),this.addNodeDefinition(new $({id:"Console Log",label:"Console Log",category:{name:"Function"},ports:{inputs:[{label:"message",id:"message",portType:"value",dataType:"string"}],outputs:[]},generators:{code:t=>`console.log(${t.inputs.message.value});`}})),this.addNodeDefinition(new $({id:"String Concat",label:"String Concat",category:{name:"Function"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"string"},{label:"b",id:"b",portType:"value",dataType:"string"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"string"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} + ${t.inputs.b.value};`}}))}};var ue=class{mId;mLabel;mNodes;get id(){return this.mId}get label(){return this.mLabel}get nodes(){return this.mNodes}constructor(t,e){this.mId=t,this.mLabel=e,this.mNodes=new Array}addNode(t){this.mNodes.push(t)}};var yo=class extends ue{constructor(){super("Math","Math"),this.addNode(new $({id:"Math.PI",label:"Math.PI",category:{name:"value"},ports:{inputs:[],outputs:[{label:"value",id:"value",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.value.value} = Math.PI;`}})),this.addNode(new $({id:"Math.E",label:"Math.E",category:{name:"value"},ports:{inputs:[],outputs:[{label:"value",id:"value",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.value.value} = Math.E;`}})),this.addNode(new $({id:"Math.abs",label:"Math.abs",category:{name:"Function"},ports:{inputs:[{label:"value",id:"value",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = Math.abs(${t.inputs.value.value});`}})),this.addNode(new $({id:"Math.floor",label:"Math.floor",category:{name:"Function"},ports:{inputs:[{label:"value",id:"value",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = Math.floor(${t.inputs.value.value});`}})),this.addNode(new $({id:"Math.ceil",label:"Math.ceil",category:{name:"Function"},ports:{inputs:[{label:"value",id:"value",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = Math.ceil(${t.inputs.value.value});`}})),this.addNode(new $({id:"Math.random",label:"Math.random",category:{name:"Function"},ports:{inputs:[],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = Math.random();`}})),this.addNode(new $({id:"Math.sin",label:"Math.sin",category:{name:"Function"},ports:{inputs:[{label:"value",id:"value",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = Math.sin(${t.inputs.value.value});`}})),this.addNode(new $({id:"Math.cos",label:"Math.cos",category:{name:"Function"},ports:{inputs:[{label:"value",id:"value",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = Math.cos(${t.inputs.value.value});`}})),this.addNode(new $({id:"Math.min",label:"Math.min",category:{name:"Function"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = Math.min(${t.inputs.a.value}, ${t.inputs.b.value});`}})),this.addNode(new $({id:"Math.max",label:"Math.max",category:{name:"Function"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = Math.max(${t.inputs.a.value}, ${t.inputs.b.value});`}})),this.addNode(new $({id:"Math.clamp",label:"Math.clamp",category:{name:"Function"},ports:{inputs:[{label:"value",id:"value",portType:"value",dataType:"number"},{label:"min",id:"min",portType:"value",dataType:"number"},{label:"max",id:"max",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = Math.min(Math.max(${t.inputs.value.value}, ${t.inputs.min.value}), ${t.inputs.max.value});`}}))}};var bo=class extends ue{constructor(){super("Time","Time"),this.addNode(new $({id:"CurrentTime",label:"CurrentTime",category:{name:"value"},ports:{inputs:[],outputs:[{label:"seconds",id:"seconds",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.seconds.value} = (performance.now() / 1000);`}}))}};var wo=class{mCachedCallable;mDisplay;mElement;mSpecifiedParameters;mTarget;get display(){return this.mDisplay}get element(){return this.mElement||(this.mElement=this.mDisplay.generate()),this.mElement}constructor(t,e){this.mDisplay=t,this.mTarget=e,this.mCachedCallable=null,this.mElement=null,this.mSpecifiedParameters={...this.mDisplay.executor.defaultParameters}}execute(){this.mCachedCallable&&this.mDisplay.update(this.element,this.mCachedCallable)}refresh(){let t=this.mTarget instanceof it?this.mTarget.node.function:this.mTarget,e=(()=>{try{return new ce(t.project).generateFunction(t,!0)}catch{return null}})();if(!e){this.mCachedCallable=null;return}let i=null;if(this.mTarget instanceof it&&(i=this.resolvePortTarget(e,this.mTarget),!i)){this.mCachedCallable=null;return}let u=this.mDisplay.executor.compile(e,i);if(!this.mDisplay.allowsType(u.type)){this.mCachedCallable=null;return}let m=this.mDisplay.adapterFor(u.type);this.mCachedCallable=v=>m(u.execute({...this.mDisplay.executor.defaultParameters,...this.mSpecifiedParameters,...v}))}specifyParameters(t){this.mSpecifiedParameters={...this.mSpecifiedParameters,...t}}resolvePortTarget(t,e){let[i,u]=(()=>{for(let v of t.entryPoint.graphs)if(v.ports.has(e)&&v.nodes.has(e.node))return[v.ports.get(e),v.nodes.get(e.node)];return[null,null]})();if(!i||!u)return null;let m=e.direction==="input"?"start":"end";return{documentPort:e,nodeHook:e.project.generator.value.hook(`${m}-${u}`),value:i}}};var he=class{mExecutor;mGenerate;mId;mName;mTypeAdapters;mUpdate;get executor(){return this.mExecutor}get id(){return`${this.mId}-${this.mExecutor.function.id}`}get name(){return this.mName}constructor(t,e){this.mId=e.id,this.mName=e.name,this.mExecutor=t,this.mGenerate=e.generate,this.mUpdate=e.update,this.mTypeAdapters=new Map;for(let[i,u]of Object.entries(e.typeAdapter))this.mExecutor.types.has(i)&&this.mTypeAdapters.set(i,u)}adapterFor(t){let e=t;if(!this.mTypeAdapters.has(e))throw new A(`Display "${this.mId}" has no type adapter for type "${t}".`,this);return this.mTypeAdapters.get(e)}allowsType(t){return this.mTypeAdapters.has(t)}createDriver(t){return new wo(this,t)}generate(){return this.mGenerate()}update(t,e){return this.mUpdate(t,e)}};var Ne=class y extends he{static MATRIX_SIZE=3;static VALUE_LENGTH=5;constructor(t){super(t,{id:"matrix",name:"Matrix 3x3",generate:()=>{let e=document.createElement("div");return e.style.boxSizing="border-box",e.style.display="grid",e.style.gap="2px",e.style.gridTemplateColumns=`repeat(${y.MATRIX_SIZE}, minmax(0, 1fr))`,e.style.height="100%",e.style.width="100%",e.style.fontFamily="var(--potatno-font-family)",e.style.fontSize="var(--potatno-font-size-small)",e.style.color="#fff",e},typeAdapter:{[ht.MAIN]:e=>e.map(i=>this.formatPreviewValue(i)),number:e=>[this.formatPreviewValue(e)],string:e=>[this.formatPreviewValue(e)],boolean:e=>[this.formatPreviewValue(e)]},update:async(e,i)=>{await this.updateMatrixPreview(e,i)}})}formatPreviewValue(t){if(typeof t=="number"){if(!Number.isFinite(t))return t.toString().slice(0,y.VALUE_LENGTH);let e=Math.trunc(Math.abs(t)).toString().length,i=Math.max(0,y.VALUE_LENGTH-e-(t<0?1:0)-1);return t.toFixed(i).slice(0,y.VALUE_LENGTH)}return String(t).slice(0,y.VALUE_LENGTH)}async updateMatrixPreview(t,e){for(;t.children.length<y.MATRIX_SIZE*y.MATRIX_SIZE;){let i=document.createElement("div");i.style.alignItems="center",i.style.background="var(--potatno-color-background-dark)",i.style.border="1px solid var(--potatno-color-border)",i.style.boxSizing="border-box",i.style.color="var(--potatno-color-text)",i.style.display="flex",i.style.justifyContent="center",i.style.minWidth="0",i.style.overflow="hidden",i.style.padding="2px",i.style.textOverflow="clip",i.style.whiteSpace="pre-line",t.append(i)}for(let i=0;i<y.MATRIX_SIZE;i++)for(let u=0;u<y.MATRIX_SIZE;u++){let m=i*y.MATRIX_SIZE+u,v=y.MATRIX_SIZE===1?0:u/(y.MATRIX_SIZE-1),w=y.MATRIX_SIZE===1?0:i/(y.MATRIX_SIZE-1),D=e({x:v,y:w});t.children[m].textContent=D.join(`
`)}}};var Le=class y extends he{static PREVIEW_PIXEL_SIZE=7.5;mCanvasContext;mCanvasImageData;constructor(t){super(t,{id:"2dCanvas",name:"Canvas 2D",generate:()=>{let e=document.createElement("canvas");return e.style.width="100%",e.style.height="100%",e.style.imageRendering="pixelated",e},typeAdapter:{[ht.MAIN]:e=>e,number:e=>[e,e,e],boolean:e=>{let i=e?1:0;return[i,i,i]}},update:async(e,i)=>{await this.updateCanvasPreview(e,i)}}),this.mCanvasImageData=new WeakMap,this.mCanvasContext=new WeakMap}async updateCanvasPreview(t,e){this.mCanvasContext.has(t)||this.mCanvasContext.set(t,t.getContext("2d"));let i=this.mCanvasContext.get(t),u=Math.max(1,Math.round(t.clientWidth/y.PREVIEW_PIXEL_SIZE)),m=Math.max(1,Math.round(t.clientHeight/y.PREVIEW_PIXEL_SIZE));(t.width!==u||t.height!==m||!this.mCanvasImageData.has(t))&&(t.width=u,t.height=m,this.mCanvasImageData.set(t,i.createImageData(u,m)));let v=this.mCanvasImageData.get(t),w=v.data;for(let D=0;D<m;D++)for(let S=0;S<u;S++){let l=S/u,r=D/m,h=e({x:l,y:r}),c=(D*u+S)*4;w[c]=Math.floor(Math.max(0,Math.min(1,h[0]||0))*255),w[c+1]=Math.floor(Math.max(0,Math.min(1,h[1]||0))*255),w[c+2]=Math.floor(Math.max(0,Math.min(1,h[2]||0))*255),w[c+3]=255}i.putImageData(v,0,0)}};var _t=new vo;_t.addImport(new yo);_t.addImport(new bo);var bl=new ht(_t.entryPoint,{defaultParameters:{x:0,y:0},types:[ht.MAIN,"number","string","boolean"],build:(y,t,e)=>{let i=t.code,u=y.function.id;if(!e){let w=new Function(`${i}
return ${u};`)();return{type:ht.MAIN,execute:D=>w(D.x,D.y)}}let m=i.replace(e.nodeHook,`; return ${e.value};`),v=new Function(`${m}
return ${u};`)();return{type:e.documentPort.resolvedDataType,execute:w=>v(w.x,w.y)}}}),wl=new ht(_t.userFunction,{defaultParameters:{x:0,y:0},types:["number","string","boolean"],build:(y,t,e)=>{if(!e)return{type:"number",execute:()=>0};let i=t.entryPoint.function,u=i.project.generator.value.name(i.label),m=i.inputs.map(D=>y.projectTypes.getDefaultValue(D.dataType)),v=t.code.replace(e.nodeHook,`return ${e.value};`),w=new Function(`${v}
return ${u};`)();return{type:e.documentPort.resolvedDataType,execute:()=>w(...m)}}});_t.preview.addDisplay(new Le(bl));_t.preview.addDisplay(new Le(wl));_t.preview.addDisplay(new Ne(bl));_t.preview.addDisplay(new Ne(wl));var tu=document.getElementById("application-root"),Re=new co(_t);Re.appendTo(tu);Re.document=new Vt(_t);xl();function xl(){try{Re.update()}catch(y){}requestAnimationFrame(xl)}document.getElementById("load-button").addEventListener("click",ru);document.getElementById("save-button").addEventListener("click",nu);var xo=document.getElementById("font-size-slider"),eu=document.getElementById("font-size-value"),ou=16,Tl=()=>{let y=Math.round(parseFloat(xo.value)/ou*100);eu.textContent=`${y}%`};xo.value=parseFloat(getComputedStyle(document.documentElement).fontSize).toString();Tl();xo.addEventListener("input",()=>{document.documentElement.style.fontSize=`${xo.value}px`,Tl()});var Dl="potatno-code-document.json";async function ru(){if(window.confirm("Load saved document?"))try{let i=await(await(await navigator.storage.getDirectory()).getFileHandle(Dl)).getFile();Re.load(await i.text())}catch{window.alert("Could not load document.")}}async function nu(){if(window.confirm("Override saved document?"))try{let i=await(await(await navigator.storage.getDirectory()).getFileHandle(Dl,{create:!0})).createWritable();await i.write(Re.save()),await i.close()}catch{window.alert("Could not save document.")}}(()=>{let y=window.location.protocol==="https:"?"wss":"ws",t=new WebSocket(`${y}://${window.location.host}`);t.addEventListener("open",()=>{console.log("Refresh connection established")}),t.addEventListener("message",e=>{e.data==="REFRESH"&&(console.log("Bundle finished. Start refresh"),window.location.reload())})})();})();
//# sourceMappingURL=page.js.map
