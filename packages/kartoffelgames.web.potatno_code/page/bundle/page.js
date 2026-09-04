(()=>{var de=class v extends Array{static newListWith(...t){let e=new v;return e.push(...t),e}clear(){this.splice(0,this.length)}clone(){return v.newListWith(...this)}distinct(){return v.newListWith(...new Set(this))}equals(t){if(this===t)return!0;if(!t||this.length!==t.length)return!1;for(let e=0;e<this.length;++e)if(this[e]!==t[e])return!1;return!0}remove(t){let e=this.indexOf(t);if(e!==-1)return this.splice(e,1)[0]}replace(t,e){let i=this.indexOf(t);if(i!==-1){let h=this[i];return this[i]=e,h}}toString(){return`[${super.join(", ")}]`}};var A=class extends Error{mTarget;get target(){return this.mTarget}constructor(t,e,i){super(t,i),this.mTarget=e}};var nt=class v extends Map{add(t,e){if(!this.has(t))this.set(t,e);else throw new A("Can't add duplicate key to dictionary.",this)}clone(){return new v(this)}getAllKeysOfValue(t){return[...this.entries()].filter(h=>h[1]===t).map(h=>h[0])}getOrDefault(t,e){let i=this.get(t);return typeof i<"u"?i:e}map(t){let e=new de;for(let i of this){let h=t(i[0],i[1]);e.push(h)}return e}};var jt=class v{mSize;mTopItem;get size(){return this.mSize}get top(){if(this.mTopItem)return this.mTopItem.value}constructor(){this.mTopItem=null,this.mSize=0}clone(){let t=new v;return t.mTopItem=this.mTopItem,t.mSize=this.mSize,t}*entries(){let t=this.mTopItem;for(;t!==null;)yield t.value,t=t.previous}flush(){let t=new Array;for(;this.mTopItem;)t.push(this.pop());return t}pop(){if(!this.mTopItem)return;let t=this.mTopItem.value;return this.mTopItem=this.mTopItem.previous,this.mSize--,t}push(t){let e={previous:this.mTopItem,value:t};this.mTopItem=e,this.mSize++}toArray(){return[...this.entries()]}};var pe=class{mCompareFunction;constructor(t){this.mCompareFunction=t}differencesOf(t,e){let i;if(t.length===0||e.length===0){if(i=new Array,t.length===0)for(let S=0;S<e.length;S++)i.push({changeState:St.Insert,item:e[S]});else for(let S=0;S<t.length;S++)i.push({changeState:St.Remove,item:t[S]});return i}let h={1:{x:0,history:[]}},g=S=>S-1,y=t.length,w=e.length,C;for(let S=0;S<y+w+1;S++)for(let l=-S;l<S+1;l+=2){let o=l===-S||l!==S&&h[l-1].x<h[l+1].x;if(o){let c=h[l+1];C=c.x,i=c.history}else{let c=h[l-1];C=c.x+1,i=c.history}i=i.slice();let u=C-l;for(1<=u&&u<=w&&o?i.push({changeState:St.Insert,item:e[g(u)]}):1<=C&&C<=y&&i.push({changeState:St.Remove,item:t[g(C)]});C<y&&u<w&&this.mCompareFunction(t[g(C+1)],e[g(u+1)]);)C+=1,u+=1,i.push({changeState:St.Keep,item:t[g(C)]});if(C>=y&&u>=w)return i;h[l]={x:C,history:i}}return new Array}},St=function(v){return v[v.Remove=1]="Remove",v[v.Insert=2]="Insert",v[v.Keep=3]="Keep",v}({});var ge=class{mNodeCache;constructor(){this.mNodeCache=new Map}start(t,e){let i=this.readFromCache(t),h=this.readFromCache(e),g=new Cr;g.set(i,0);let y=new Map;y.set(i,0);let w=new Map,C=new Array;for(;g.length!==0;){let S=g.popLowest();if(C.push(S),S===h)return{path:[...this.pathTracer(S,w)].reverse(),processedNodes:C};for(let l of this.getNeighborNodes(S)){let o=(y.get(S)??Number.POSITIVE_INFINITY)+this.costOfTraversal(l,{startNode:i,endNode:h,path:this.pathTracer(S,w)}),u=y.get(l)??Number.POSITIVE_INFINITY;if(o>=u)continue;w.set(l,S),y.set(l,o);let c=o+this.heuristic(l,{startNode:i,endNode:h,path:this.pathTracer(S,w)});g.set(l,c)}}return{path:new Array,processedNodes:C}}getNeighborNodes(t){return this.neighborNodes(t).map(e=>this.readFromCache(e))}*pathTracer(t,e){let i=t;for(;yield i,!!e.has(i);)i=e.get(i)}readFromCache(t){let e=this.nodeId(t);return this.mNodeCache.has(e)?this.mNodeCache.get(e):(this.mNodeCache.set(e,t),t)}},Cr=class{mExistingNodes;mList;mLowestCost;mLowestCostCounter;get length(){return this.mList.length}constructor(){this.mList=new Array,this.mExistingNodes=new Map,this.mLowestCost=Number.POSITIVE_INFINITY,this.mLowestCostCounter=0}popLowest(){if(this.mList.length===0)throw new A("Can not read next node from an empty priority list.",this);let[t,e]=(()=>{let y=null,w=0;for(let C=this.mList.length-1;C>-1;C--){let S=this.mList[C];if(S.cost===this.mLowestCost)return[S,0];(y===null||S.cost<y.cost)&&(y=S,w=0),S.cost===y.cost&&w++}if(y===null)throw new A("Lowest could not be found. Data is corrupted.",this);return[y,w]})();t.cost<this.mLowestCost&&(this.mLowestCost=t.cost,this.mLowestCostCounter=e),t.cost===this.mLowestCost&&this.mLowestCostCounter--,this.mLowestCostCounter<1&&(this.mLowestCost=Number.POSITIVE_INFINITY,this.mLowestCostCounter=0);let i=this.mExistingNodes.get(t.node),h=this.mList.length-1,g=this.mList[h];return this.mList[h]=t,this.mList[i]=g,this.mExistingNodes.set(g.node,i),this.mExistingNodes.delete(t.node),this.mList.pop().node}set(t,e){if(this.mLowestCostCounter>0&&e<this.mLowestCost&&(this.mLowestCost=e,this.mLowestCostCounter=0),e===this.mLowestCost&&this.mLowestCostCounter++,this.mExistingNodes.has(t)){let i=this.mExistingNodes.get(t),h=this.mList[i];if(h.cost===e){e===this.mLowestCost&&this.mLowestCostCounter--;return}h.cost=e;return}this.mList.push({cost:e,node:t}),this.mExistingNodes.set(t,this.mList.length-1)}};var ve=class{mDataType;mId;mLabel;mPortType;mRegions;get dataType(){return this.mDataType}get id(){return this.mId}get label(){return this.mLabel}get portType(){return this.mPortType}get regions(){return this.mRegions}constructor(t){this.mLabel=t.label,this.mId=t.id,this.mPortType=t.portType,t.portType==="value"?this.mDataType=t.dataType:this.mDataType=null,this.mRegions={add:t.regions?.add??new Array}}};var at=class{mCategory;mCodeGenerator;mId;mLabel;mPortProvider;mRegions;get category(){return this.mCategory}get codeGenerator(){return this.mCodeGenerator}get id(){return this.mId}get inputs(){let t=!1,e=[];return this.mPortProvider.inputs(i=>{if(e.push(new ve(i)),i.portType==="flow"){if(t)throw new A(`Node definition ${this.id} has multiple input flow ports, which is not allowed.`,this);t=!0}}),e}get label(){return this.mLabel}get outputs(){let t=[];return this.mPortProvider.outputs(e=>{t.push(new ve(e))}),t}get regions(){return this.mRegions}constructor(t){this.mId=t.id,this.mLabel=t.label,this.mCategory={name:t.category.name,icon:t.category.icon??"\u25C6"},this.mCodeGenerator=t.generators.code,this.mPortProvider=t.generators.ports,this.mRegions={add:t.regions?.add??new Array,allows:t.regions?.allows??new Array,requires:t.regions?.requires??new Array}}getPort(t){return[...this.inputs,...this.outputs].find(e=>e.id===t)}};var xt=class extends at{mFunction;get function(){return this.mFunction}get label(){return this.mFunction.label}constructor(t){let e=(h,g,y)=>w=>{y.length===0&&w({label:h,id:h,portType:"flow"});for(let C of g)w({label:C.label,id:C.label,portType:"value",dataType:C.dataType})},i=t.project.getFunction(t.definitionId);super({id:`USERFUNCTION_${t.id}`,label:t.label,category:{name:"user function",icon:"\u0192"},generators:{ports:{inputs:e("Input",t.inputs,t.outputs),outputs:e("Output",t.outputs,t.outputs)},code:h=>i?i.codeGenerator.value({function:t,inputs:h.inputs,outputs:h.outputs,code:h.code}):""}}),this.mFunction=t}};var Tt=class v extends at{static DEFINITION_ID="8124c652-3a8e-4333-b405-f905522a4610";constructor(){super({id:v.DEFINITION_ID,label:"Comment",category:{name:"Comment",icon:"\u270E"},generators:{ports:{inputs:()=>{},outputs:()=>{}},code:()=>{throw new A("Comment node code generators should never be called.",v)}}})}};var Q=class v extends at{static DEFINITION_ID="23e9319b-3b62-4dd8-858a-17d97ddee94e";constructor(){super({id:v.DEFINITION_ID,label:"Flow Conjunction",category:{name:"Conjunction",icon:"\u25C7"},generators:{ports:{inputs:t=>{t({label:"in",id:"in",portType:"flow"})},outputs:t=>{t({label:"out",id:"out",portType:"flow"})}},code:()=>{throw new A("Conjunction node code generators should never be called.",v)}}})}};var rt=class v extends at{static DEFINITION_ID="a579584d-5d35-42b5-b2ba-3daddee488e0";constructor(){super({id:v.DEFINITION_ID,label:"Value Conjunction",category:{name:"Conjunction",icon:"\u25C7"},generators:{ports:{inputs:t=>{t({label:"in",id:"in",portType:"value",dataType:"<T>"})},outputs:t=>{t({label:"out",id:"out",portType:"value",dataType:"<T>"})}},code:()=>{throw new A("Conjunction node code generators should never be called.",v)}}})}};var Dt=class{mAffectedItems;mErrors;get affectedItems(){return this.mAffectedItems}get errors(){return this.mErrors}constructor(){this.mErrors=new Array,this.mAffectedItems=new Set}addAffectedItem(t){this.mAffectedItems.add(t)}merge(t){this.mErrors.push(...t.mErrors);for(let e of t.mAffectedItems)this.mAffectedItems.add(e);return this}pushError(...t){this.mErrors.push(...t)}},q=class{mItem;mMessage;get item(){return this.mItem}get message(){return this.mMessage}constructor(t,e){this.mMessage=t,this.mItem=e}};var it=class{mConnectedPorts;mDataType;mDefinitionId;mDirectValue;mDirection;mDocument;mLabel;mNode;mPortType;mProject;get connectedPorts(){return this.mConnectedPorts}get dataType(){return this.mDataType}get definitionId(){return this.mDefinitionId}get directValue(){return this.mDirectValue}get direction(){return this.mDirection}get document(){return this.mDocument}get label(){return this.mLabel}set label(t){this.mLabel=t}get node(){return this.mNode}get portType(){return this.mPortType}get project(){return this.mProject}get resolvedDataType(){return this.resolveDataType(new Set)}constructor(t,e,i){if(i.portType==="flow"&&i.dataType!==null)throw new A("Flow ports cannot have a value type.",this);if(i.portType==="value"&&i.dataType===null)throw new A("Value ports must have a value type.",this);this.mProject=t,this.mDocument=e,this.mNode=i.node,this.mDefinitionId=i.definitionId,this.mLabel=i.label,this.mDataType=i.dataType,this.mDirection=i.direction,this.mPortType=i.portType,this.mConnectedPorts=new Set,this.mDirectValue=new Array,i.dataType&&!this.mProject.types.isGenericType(i.dataType)&&this.mDirectValue.push(...t.types.getType(i.dataType).default.string)}connect(t){if(this.mConnectedPorts.has(t))return;if(this.mPortType!==t.portType)throw new A(`Cannot connect port ${this.mDefinitionId} of node ${this.mNode.label} to port ${t.mDefinitionId} of node ${t.node.label} due to incompatible port types.`,this);if(this.mDirection===t.direction)throw new A(`Cannot connect port ${this.mDefinitionId} of node ${this.mNode.label} to port ${t.mDefinitionId} of node ${t.node.label} due to incompatible directions.`,this);if(this.node===t.node)throw new A(`Cannot connect port ${this.mDefinitionId} of node ${this.mNode.label} to another port of the same node.`,this);if(!(this.mPortType==="flow"&&this.mDirection==="input"||this.mPortType==="value"&&this.mDirection==="output"))for(let i of Array.from(this.mConnectedPorts))this.disconnect(i);this.mConnectedPorts.add(t),t.connect(this)}disconnect(t){this.mConnectedPorts.has(t)&&(this.mConnectedPorts.delete(t),t.disconnect(this))}setDirectValue(t){if(this.mPortType!=="value")throw new A("Only value ports can have a direct value.",this);if(this.mProject.types.isGenericType(this.mDataType))throw new A("Generic value ports cannot have a direct value.",this);if(t.length!==this.mProject.types.getType(this.mDataType).default.string.length)throw new A("The provided value does not match the expected length of the default value for this port's type.",this);this.mDirectValue.splice(0,this.mDirectValue.length),this.mDirectValue.push(...t)}validate(){let t=new Dt;if(this.mDirection==="output"){if(this.mPortType==="flow"&&this.mConnectedPorts.size>1&&t.pushError(new q(`Flow output port "${this.mDefinitionId}" on node "${this.mNode.label}" can only have one connection.`,this)),this.mPortType==="value"&&this.mProject.types.isGenericType(this.mDataType??"")){let e=this.mNode.inputs.value.filter(i=>i.dataType===this.mDataType);for(let i of e)i.connectedPorts.size===0&&t.pushError(new q(`Generic output port "${this.mDefinitionId}" on node "${this.mNode.label}" cannot resolve generic type "${this.mDataType}" because its input port "${i.definitionId}" is not connected.`,this))}return t}if(this.mDirection==="input"){if(this.mPortType==="flow")return this.mConnectedPorts.size===0&&t.pushError(new q(`Flow input port "${this.mDefinitionId}" on node "${this.mNode.label}" must have at least one connection.`,this)),t;if(this.mPortType==="value"){this.mConnectedPorts.size>1&&t.pushError(new q(`Value input port "${this.mDefinitionId}" on node "${this.mNode.label}" can only have one connection.`,this));for(let e of this.mConnectedPorts)e.resolvedDataType!==this.resolvedDataType&&t.pushError(new q(`Value input port "${this.mDefinitionId}" on node "${this.mNode.label}" expects type "${this.resolvedDataType}" but is connected to type "${e.resolvedDataType}".`,this));return t}}return t}resolveDataType(t){if(t.has(this.node))return this.mDataType;if(this.mDirection==="input"&&t.add(this.node),this.mPortType!=="value")throw new A("Port data type couldn't be resolved as it is no value port.",this);if(!this.mProject.types.isGenericType(this.mDataType??""))return this.mDataType;if(this.mDirection==="output"){let i=this.mNode.inputs.value.find(h=>h.dataType===this.mDataType);if(!i)throw new A("Port type couldn't be resolved as it has no resolving sibling port",this);return i.resolveDataType(t)}return this.mConnectedPorts.size===0?this.mDataType:this.mConnectedPorts.values().next().value.resolveDataType(t)}};var pt=class{mDefinitionId;mDocument;mFunction;mInputs;mLabel;mOutputs;mPreview;mProject;mTransformation;get definitionId(){return this.mDefinitionId}get document(){return this.mDocument}get function(){return this.mFunction}get hasFlowPorts(){return this.mOutputs.flow.length>0||this.mInputs.flow.length>0}get hasValuePorts(){return this.mOutputs.value.length>0||this.mInputs.value.length>0}get inputs(){return this.mInputs}get label(){return this.mLabel}set label(t){this.mLabel=t}get outputs(){return this.mOutputs}get preview(){return this.mPreview}set preview(t){this.mPreview=t}get project(){return this.mProject}get transformation(){return this.mTransformation}constructor(t,e,i,h){this.mDocument=e,this.mDefinitionId=h.definitionId,this.mFunction=i,this.mLabel=h.label,this.mPreview=h.preview??null,this.mProject=t,this.mTransformation={x:0,y:0,width:0,height:0};let g=(y,w)=>{let C={direction:w,list:new Array,map:new Map,flow:new Array,value:new Array};for(let S of y){let l=new it(this.mProject,this.mDocument,{definitionId:S.definitionId,direction:w,label:S.label,node:this,portType:S.portType,dataType:S.dataType});C.list.push(l),C.map.set(l.definitionId,l),(l.portType==="flow"?C.flow:C.value).push(l)}return C};this.mInputs=g(h.ports.input,"input"),this.mOutputs=g(h.ports.output,"output"),this.resizeTo(h.transformation.width,h.transformation.height),this.moveTo(h.transformation.x,h.transformation.y)}moveTo(t,e){this.mTransformation.x=Math.round(t),this.mTransformation.y=Math.round(e)}resizeTo(t,e){let i=this.mFunction.nodeDefinitions.find(y=>y.id===this.mDefinitionId),[h,g]=(()=>{switch(i?.id){case Tt.DEFINITION_ID:return[Math.max(6,t),Math.max(6,e)];case rt.DEFINITION_ID:case Q.DEFINITION_ID:return[1,1];default:return[6,Math.max(this.mInputs.list.length,this.mOutputs.list.length)+1]}})();this.mTransformation.width=h,this.mTransformation.height=g}validate(t){let e=new Dt,i=t??new Set,h=this.mFunction.nodeDefinitions.find(g=>g.id===this.mDefinitionId);if(!h)e.pushError(new q(`Node "${this.mLabel}" definition "${this.mDefinitionId}" could not be found.`,this));else{e.merge(this.resyncPorts(this.mInputs,h.inputs)),e.merge(this.resyncPorts(this.mOutputs,h.outputs));let g=new Set([...h.regions.requires,...h.regions.allows]);if(g.size>0)for(let y of i)g.has(y)||e.pushError(new q(`Node "${this.mLabel}" does not allow region "${y}".`,this));if(h.regions.requires.length>0)for(let y of h.regions.requires)i.has(y)||e.pushError(new q(`Node "${this.mLabel}" requires region "${y}" but it is not active.`,this))}for(let g of[...this.mInputs.list,...this.mOutputs.list])e.merge(g.validate());return this.resizeTo(this.transformation.width,this.transformation.height),e}addPort(t,e,i){let h=new it(this.mProject,this.mDocument,{definitionId:e.id,direction:t.direction,label:e.label,node:this,portType:e.portType,dataType:e.dataType});return t.list.splice(i,0,h),t.map.set(h.definitionId,h),(h.portType==="flow"?t.flow:t.value).push(h),h}removePort(t,e){let i=t.list.indexOf(e);if(i===-1)throw new A(`Port "${e.label}" was not found and can not be removed.`,this);t.list.splice(i,1),t.map.delete(e.definitionId);let h=e.portType==="flow"?t.flow:t.value,g=h.indexOf(e);if(i===-1)throw new A(`Port "${e.label}" was not found in typed list and can not be removed.`,this);return h.splice(g,1),i}replacePort(t,e,i){let h=Array.from(e.connectedPorts);for(let w of Array.from(e.connectedPorts))e.disconnect(w);let g=this.removePort(t,e),y=this.addPort(t,i,g);for(let w of h)y.connect(w);return y}resyncPorts(t,e){let i=new Dt,h=new Set(e.map(g=>g.id));for(let g=0;g<e.length;g++){let y=e[g];if(!t.map.has(y.id)){let o=this.addPort(t,y,g);i.addAffectedItem(o);continue}let w=t.map.get(y.id),C=w.portType!==y.portType,S=w.dataType!==y.dataType;if(!C&&!S)continue;if(w.connectedPorts.size>0&&C){i.pushError(new q(`Port "${w.label}" on node "${this.mLabel}" has a changed type.`,w));continue}let l=this.replacePort(t,w,y);i.addAffectedItem(w),i.addAffectedItem(l)}for(let g of t.list)if(!h.has(g.definitionId)){if(g.connectedPorts.size===0){i.addAffectedItem(g),this.removePort(t,g);continue}i.pushError(new q(`Port "${g.label}" on node "${this.mLabel}" no longer exists in its definition.`,g))}return i}};var lt=class{mDefinitionId;mDocument;mId;mImportIds;mInputs;mIsSystem;mLabel;mNodes;mOutputs;mProject;get definitionId(){return this.mDefinitionId}get document(){return this.mDocument}get dynamicNodeDefinitions(){let t=this.mDocument.nodeDefinitions.filter(g=>!(g instanceof xt&&g.function===this)),e=this.mProject.getFunction(this.definitionId);if(!e)return t;let i=e.getNodeDefinitions(this),h=this.mProject.imports.filter(g=>this.mImportIds.has(g.id)).flatMap(g=>g.nodes);return[...t,...h,...i.dynamic]}get id(){return this.mId}get imports(){return this.mImportIds}get inputs(){return this.mInputs}get isSystem(){return this.mIsSystem}get label(){return this.mLabel}set label(t){this.mLabel=t}get nodeDefinitions(){let t=this.mProject.getFunction(this.definitionId);if(!t)return this.dynamicNodeDefinitions;let e=t.getNodeDefinitions(this);return[...this.dynamicNodeDefinitions,...e.entry,...e.exit]}get nodes(){return this.mNodes}get outputs(){return this.mOutputs}get project(){return this.mProject}constructor(t,e,i){this.mProject=t,this.mDocument=e,this.mLabel=i.label,this.mIsSystem=i.isSystem,this.mDefinitionId=i.definitionId,this.mId=i.id,this.mNodes=new Set,this.mInputs=new Array,this.mOutputs=new Array,this.mImportIds=new Set}addImport(t){if(!this.project.imports.some(i=>i.id===t))throw new A(`Project does not contain import ${t}`,this);this.mImportIds.add(t)}addInput(t){this.mInputs.some(e=>e.label===t.label)||this.mInputs.push(t)}addNode(t){this.mNodes.add(t)}addNodeByDefinition(t,e){let i=g=>({definitionId:g.id,label:g.label,portType:g.portType,dataType:g.dataType}),h=new pt(this.mProject,this.mDocument,this,{definitionId:t.id,ports:{input:t.inputs.map(i),output:t.outputs.map(i)},label:t.label,transformation:e});return this.mNodes.add(h),h}addOutput(t){this.mOutputs.some(e=>e.label===t.label)||this.mOutputs.push(t)}getExitNodes(){let t=this.mProject.getFunction(this.mDefinitionId);if(!t)throw new A(`Function definition not found for function "${this.mLabel}".`,this);let e=new Set(t.getNodeDefinitions(this).exit.map(i=>i.id));return[...this.mNodes].filter(i=>e.has(i.definitionId))}removeImport(t){this.mImportIds.delete(t)}removeInput(t){let e=this.mInputs.findIndex(i=>i.label===t.label);e!==-1&&this.mInputs.splice(e,1)}removeNode(t){for(let e of[...t.inputs.list,...t.outputs.list])for(let i of Array.from(e.connectedPorts))e.disconnect(i);this.mNodes.delete(t)}removeOutput(t){let e=this.mOutputs.findIndex(i=>i.label===t.label);e!==-1&&this.mOutputs.splice(e,1)}validate(){let t=new Dt,e=this.mProject.getFunction(this.mDefinitionId);e||t.pushError(new q(`Function "${this.mLabel}" definition "${this.mDefinitionId}" could not be found.`,this));let i=e?.getNodeDefinitions(this);i&&this.resyncFunction(i,t);let h=this.collectRegions(this.mNodes,t),g=new Set(i?.entry.map(w=>w.id)??new Array),y=new Map;for(let w of this.mNodes)t.merge(w.validate(h.get(w))),this.collectEntryDomains(w,g,y).size>1&&t.pushError(new q(`Node "${w.label}" is reachable from multiple entry nodes.`,w));return t}collectEntryDomains(t,e,i){if(i.has(t))return i.get(t);let h=new Set;i.set(t,h);for(let g of t.inputs.list)for(let y of g.connectedPorts){let w=y.node;e.has(w.definitionId)&&h.add(w);for(let C of this.collectEntryDomains(w,e,i))h.add(C)}return h}collectRegions(t,e){let i=new Map;for(let w of this.nodeDefinitions)i.set(w.id,w);let h=(()=>{let w=new Map;return(C,S)=>{if(!w.has(C.id)){let l=new Map;for(let o of C.outputs)l.set(o.id,o.regions.add);w.set(C.id,l)}return[...w.get(C.id).get(S)??new Array,...C.regions.add]}})(),g=(()=>{let w=new Map;return(C,S)=>{if(w.has(C))return w.get(C);if(S.has(C))return e.pushError(new q(`Node "${C.label}" is part of a connection cycle.`,C)),new Set;S.add(C);let l=new Set;for(let o of C.inputs.list)for(let u of o.connectedPorts){let c=u.node;for(let r of g(c,S))l.add(r);if(i.has(c.definitionId))for(let r of h(i.get(c.definitionId),u.definitionId))l.add(r)}return w.set(C,l),l}})(),y=new Map;for(let w of t)y.set(w,g(w,new Set));return y}resyncFunction(t,e){let i=[...t.entry,...t.exit],h=new Set(this.mNodes.values().map(w=>w.definitionId)),g=0,y=20;for(let w of i){if(h.has(w.id))continue;let C=this.addNodeByDefinition(w,{x:Math.floor(g/(i.length/2))*y+2,y:g*y+2-Math.floor(g/(i.length/2))*(i.length/2*y),width:0,height:0});e.addAffectedItem(C),g++}}};var Vt=class{mFunctionNodeDefinitions;mFunctions;mProject;get functions(){return this.mFunctions}get nodeDefinitions(){return[...this.mFunctionNodeDefinitions.values(),...this.mProject.nodeDefinitions.values()]}get project(){return this.mProject}constructor(t){this.mProject=t,this.mFunctions=new Array,this.mFunctionNodeDefinitions=new Map}addFunction(t){let e=this.mFunctions.indexOf(t);e!==-1&&this.mFunctions.splice(e,1),this.mFunctions.push(t);let i=new xt(t);return this.mFunctionNodeDefinitions.set(i.id,i),t}newFunction(t){return this.addFunction(new lt(this.mProject,this,t))}removeFunction(t){if(t.isSystem)throw new A("Cannot remove a system function.",this);let e=this.mFunctions.indexOf(t);if(e===-1)return!1;this.mFunctions.splice(e,1);for(let i of this.mFunctionNodeDefinitions.values())i.function===t&&this.mFunctionNodeDefinitions.delete(i.id);return!0}validate(){let t=new Dt,e=this.mProject.entryPoint.id;if(!this.mFunctions.values().some(h=>h.definitionId===e)){let h=this.newFunction({definitionId:e,id:crypto.randomUUID(),isSystem:!0,label:this.mProject.entryPoint.label});t.addAffectedItem(h)}for(let h of this.mFunctions)t.merge(h.validate());t.pushError(...this.detectCrossFunctionRecursion());let i=new Set;for(let h of this.mFunctions){let g=this.mProject.generator.value.name(h.label);i.has(g)&&t.pushError(new q(`Function name "${g}" is used by multiple functions. Function names must be unique.`,h)),i.add(g)}return t}detectCrossFunctionRecursion(){let t=[],e=new Map,i=w=>{if(!e.has(w)){let C=new Set;for(let S of w.nodes)this.mFunctionNodeDefinitions.has(S.definitionId)&&C.add(this.mFunctionNodeDefinitions.get(S.definitionId).function);e.set(w,C)}return e.get(w)},h=new Set,g=new Set,y=w=>{if(!h.has(w)){if(g.has(w)){t.push(new q(`Function "${w.label}" participates in a cross-function recursion cycle.`,w));return}g.add(w);for(let C of i(w))y(C);g.delete(w),h.add(w)}};for(let w of this.mFunctions)y(w);return t}};var Bt=class{mData;mInteractionType;mOrigin;get data(){return this.mData}get origin(){return this.mOrigin}get triggerType(){return this.mInteractionType}constructor(t,e,i){this.mInteractionType=t,this.mData=i,this.mOrigin=e}};var Et=class v{static mCurrentZone=new v("Default");static get current(){return v.mCurrentZone}static create(t){return new v(t,v.current)}mAttachments;mInteractionListener;mName;mParent;mTriggerFilterBitmap;get name(){return this.mName}get parent(){return this.mParent}constructor(t,e=null){this.mName=t,this.mParent=e,this.mTriggerFilterBitmap=-1,this.mInteractionListener=new Map,this.mAttachments=new WeakMap}addInteractionListener(t){return this.mInteractionListener.set(t,v.current),this}execute(t,...e){let i=v.mCurrentZone;v.mCurrentZone=this;try{return t(...e)}finally{v.mCurrentZone=i}}getAttachment(t){return this.mAttachments.has(t)?this.mAttachments.get(t):this.mParent!==null?this.mParent.getAttachment(t):null}pushInteraction(t,e){if((this.mTriggerFilterBitmap&t)===0)return!1;if(this.mInteractionListener.size===0)return!0;let i=new Bt(t,this,e);for(let[h,g]of this.mInteractionListener.entries())g.execute(()=>{h.call(this,i)});return!0}removeInteractionListener(t){return t?(this.mInteractionListener.delete(t),this):(this.mInteractionListener.clear(),this)}setAttachment(t,e){this.mAttachments.set(t,e)}setTriggerRestriction(t){return this.mTriggerFilterBitmap=t,this}};var k=class v{static mComponents=new WeakMap;static mConstructorSelector=new WeakMap;static mElements=new WeakMap;static elementIsComponent(t){return v.mComponents.has(t)}static ofComponent(t){let e=t.processorConstructor,i=v.mConstructorSelector.get(e);if(!i)throw new A(`Constructor "${e.name}" is not a registered custom element`,e);let h=v.mElements.get(t);if(!h)throw new A(`Component "${t}" is not a registered component`,t);return{selector:i,constructor:e,element:h,component:t,processor:t.processor}}static ofConstructor(t){let e=v.mConstructorSelector.get(t);if(!e)throw new A(`Constructor "${t.name}" is not a registered custom element`,t);let i=globalThis.customElements.get(e);if(!i)throw new A(`Constructor "${t.name}" is not a registered custom element`,t);return{selector:e,constructor:t,elementConstructor:i}}static ofElement(t){let e=v.mComponents.get(t);if(!e)throw new A(`Element "${t}" is not a PwbComponent.`,t);return v.ofComponent(e)}static ofProcessor(t){let e=v.mComponents.get(t);if(!e)throw new A("Processor is not a PwbComponent.",t);return v.ofComponent(e)}static registerComponent(t,e,i){v.mComponents.has(e)||v.mComponents.set(e,t),i&&!v.mComponents.has(i)&&v.mComponents.set(i,t),v.mElements.has(t)||v.mElements.set(t,e)}static registerConstructor(t,e){t&&!v.mConstructorSelector.has(t)&&v.mConstructorSelector.set(t,e)}};var Pt=class{static ATTACHMENT_KEY=Symbol("ComponentZoneConfiguration");mFrameTime;mInjection;get guaranteedFrameTime(){return this.mFrameTime}set guaranteedFrameTime(t){this.mFrameTime=t}get injections(){return this.mInjection}constructor(){this.mInjection=new Map,this.mFrameTime=Number.MAX_SAFE_INTEGER}setInjection(t,e){this.mInjection.set(t,e)}};var Qt=class extends Error{mZone;get zone(){return this.mZone}constructor(t,e){let i=t instanceof Error?t.message:"Non-error value thrown";super(`Update error in zone "${e.name}": ${i}`,{cause:t}),this.mZone=e}};var ye=class v{static new(t,e){let i=new v;t(i),e&&i.appendTo(e)}mComponentZoneConfiguration;mContent;mCurrentTarget;mErrorListener;mFragment;mInteractionZone;constructor(){this.mContent=new Array,this.mFragment=document.createDocumentFragment(),this.mCurrentTarget=null,this.mErrorListener=new Array,this.mInteractionZone=Et.create("PwbApplication"),this.mComponentZoneConfiguration=new Pt,this.mInteractionZone.setAttachment(Pt.ATTACHMENT_KEY,this.mComponentZoneConfiguration),globalThis.addEventListener("error",t=>{this.handleZoneError(t,t.error)}),globalThis.addEventListener("unhandledrejection",t=>{this.handleZoneError(t,t.reason)})}addContent(t){let e=k.ofConstructor(t).elementConstructor,i=this.mInteractionZone.execute(()=>k.ofElement(new e));return this.mContent.push(i.component),this.mFragment.appendChild(i.element),this.updateTarget(),i.processor}addErrorListener(t){this.mErrorListener.includes(t)&&this.removeErrorListener(t),this.mErrorListener.push(t)}addStyle(t){let e=document.createElement("style");e.textContent=t,this.mFragment.prepend(e)}appendTo(t){this.mCurrentTarget=t,this.updateTarget()}removeErrorListener(t){let e=this.mErrorListener.indexOf(t);e!==-1&&this.mErrorListener.splice(e,1)}setInjection(t,e){this.mComponentZoneConfiguration.setInjection(t,e)}handleZoneError(t,e){if(!(e instanceof Qt)||!this.zoneBelongsToApplication(e.zone))return;t.preventDefault();let i=!1;for(let h of this.mErrorListener)h(e.cause)===!0&&(i=!0);i||console.error(e.cause)}updateTarget(){this.mCurrentTarget&&(this.mCurrentTarget.shadowRoot||this.mCurrentTarget.attachShadow({mode:"open"}),this.mCurrentTarget.shadowRoot.appendChild(this.mFragment))}zoneBelongsToApplication(t){let e=t;for(;e!==null;){if(e===this.mInteractionZone)return!0;e=e.parent}return!1}};var kt=class{mCustomMetadata;constructor(){this.mCustomMetadata=new Map}getMetadata(t){return this.mCustomMetadata.get(t)??null}setMetadata(t,e){this.mCustomMetadata.set(t,e)}};var be=class extends kt{};var we=class v extends kt{static mPrivateMetadataKey=Symbol("Metadata");mDecoratorMetadataObject;mPropertyMetadata;constructor(t){super(),this.mDecoratorMetadataObject=t,this.mPropertyMetadata=new Map,t[v.mPrivateMetadataKey]=this}getInheritedMetadata(t){let e=new Array,i=this.mDecoratorMetadataObject;do{if(Object.hasOwn(i,v.mPrivateMetadataKey)){let g=i[v.mPrivateMetadataKey].getMetadata(t);g!==null&&e.push(g)}i=Object.getPrototypeOf(i)}while(i!==null);return e.reverse()}getProperty(t){return this.mPropertyMetadata.has(t)||this.mPropertyMetadata.set(t,new be),this.mPropertyMetadata.get(t)}};Symbol.metadata??=Symbol("Symbol.metadata");var ct=class v{static mMetadataMapping=new Map;static add(t,e){return(i,h)=>{let g=v.forInternalDecorator(h.metadata);switch(h.kind){case"class":g.setMetadata(t,e);return;case"method":case"field":case"getter":case"setter":case"accessor":if(h.static)throw new Error("@Metadata.add not supported for statics.");g.getProperty(h.name).setMetadata(t,e);return}}}static forInternalDecorator(t){return v.mapMetadata(t)}static get(t){Object.hasOwn(t,Symbol.metadata)||v.polyfillMissingMetadata(t);let e=t[Symbol.metadata];return v.mapMetadata(e)}static init(){return(t,e)=>{v.forInternalDecorator(e.metadata)}}static mapMetadata(t){if(v.mMetadataMapping.has(t))return v.mMetadataMapping.get(t);let e=new we(t);return v.mMetadataMapping.set(t,e),e}static polyfillMissingMetadata(t){let e=new Array,i=t;do e.push(i),i=Object.getPrototypeOf(i);while(i!==null);for(let h=e.length-1;h>=0;h--){let g=e[h];if(!Object.hasOwn(g,Symbol.metadata)){let y=null;h<e.length-2&&(y=e[h+1][Symbol.metadata]),g[Symbol.metadata]=Object.create(y,{})}}}};var F=class v{static mCurrentInjectionContext=null;static mInjectMode=new Map;static mInjectableConstructor=new Map;static mInjectableReplacement=new Map;static mInjectionConstructorIdentificationMetadataKey=Symbol("InjectionConstructorIdentification");static mSingletonMapping=new Map;static createObject(t,e,i){let[h,g]=typeof e=="object"&&e!==null?[!1,e]:[!!e,i??new Map],y=v.getInjectionIdentification(t);if(!v.mInjectableConstructor.has(y))throw new A(`Constructor "${t.name}" is not registered for injection and can not be built`,v);let w=h?"instanced":v.mInjectMode.get(y),C=new Map(g.entries().map(([o,u])=>[v.getInjectionIdentification(o),u])),S=v.mCurrentInjectionContext,l=new Map([...S?.localInjections.entries()??[],...C.entries()]);v.mCurrentInjectionContext={injectionMode:w,localInjections:l};try{if(!h&&w==="singleton"&&v.mSingletonMapping.has(y))return v.mSingletonMapping.get(y);let o=new t;return w==="singleton"&&!v.mSingletonMapping.has(y)&&v.mSingletonMapping.set(y,o),o}finally{v.mCurrentInjectionContext=S}}static injectable(t="instanced"){return(e,i)=>{v.registerInjectable(e,i.metadata,t)}}static registerInjectable(t,e,i){let h=v.getInjectionIdentification(t,e);v.mInjectableConstructor.set(h,t),v.mInjectMode.set(h,i)}static replaceInjectable(t,e){let i=v.getInjectionIdentification(t);if(!v.mInjectableConstructor.has(i))throw new A("Original constructor is not registered.",v);let h=v.getInjectionIdentification(e);if(!v.mInjectableConstructor.has(h))throw new A("Replacement constructor is not registered.",v);v.mInjectableReplacement.set(i,e)}static use(t){if(v.mCurrentInjectionContext===null)throw new A("Can't create object outside of an injection context.",v);let e=v.getInjectionIdentification(t);if(v.mCurrentInjectionContext.injectionMode!=="singleton"&&v.mCurrentInjectionContext.localInjections.has(e))return v.mCurrentInjectionContext.localInjections.get(e);let i=v.mInjectableReplacement.get(e);if(i||(i=v.mInjectableConstructor.get(e)),!i)throw new A(`Constructor "${t.name}" is not registered for injection and can not be built`,v);return v.createObject(i)}static getInjectionIdentification(t,e){let i=e?ct.forInternalDecorator(e):ct.get(t),h=i.getMetadata(v.mInjectionConstructorIdentificationMetadataKey);return h||(h=Symbol(t.name),i.setMetadata(v.mInjectionConstructorIdentificationMetadataKey,h)),h}};var Z=function(v){return v[v.Read=1]="Read",v[v.ReadWrite=2]="ReadWrite",v[v.Write=3]="Write",v}({});var At=class{mHooks;mInjections;mProcessor;mProcessorConstructor;get processor(){if(!this.mProcessor)throw new A("Processor is not created yet. Call setup to create processor.",this);return this.mProcessor}get processorConstructor(){return this.mProcessorConstructor}constructor(t){if(this.mProcessorConstructor=t.constructor,this.mProcessor=null,this.mInjections=new Map,this.mHooks={create:new Array},t.parent)for(let[e,i]of t.parent.mInjections.entries())this.setProcessorInjection(e,i)}deconstruct(){}getProcessorInjection(t){return this.mInjections.get(t)}setProcessorInjection(t,e){if(this.mProcessor)throw new A("Cant add injections to after construction.",this);this.mInjections.set(t,e)}setup(){return this.mProcessor=this.createProcessor(),this}addConstructionHook(t){return this.mHooks.create.push(t),this}call(t,...e){let i=Reflect.get(this.processor,t);return typeof i!="function"?null:i.apply(this.processor,e)}createProcessor(){let t=F.createObject(this.mProcessorConstructor,this.mInjections),e;for(;e=this.mHooks.create.pop();){let i=e.call(this,t);i&&(t=i)}return t}};var $t=class v extends At{constructor(t,e){super({constructor:t,parent:e}),this.setProcessorInjection(v,this)}deconstruct(){this.call("onDeconstruct"),super.deconstruct()}setup(){return super.setup(),this.call("onExecute"),this}onUpdate(){return!1}};var Pr=class v{static mInstance;mCoreEntityConstructor;mProcessorConstructorConfiguration;constructor(){if(v.mInstance)return v.mInstance;v.mInstance=this,this.mCoreEntityConstructor=new Map,this.mProcessorConstructorConfiguration=new Map}get(t){let e=this.mCoreEntityConstructor.get(t);if(!e)return new Array;let i=new Array;for(let h of e)i.push({processorConstructor:h,processorConfiguration:this.mProcessorConstructorConfiguration.get(h)});return i}register(t,e,i){this.mProcessorConstructorConfiguration.set(e,i);let h=t;do{if(!(h.prototype instanceof At)&&h!==At)break;this.mCoreEntityConstructor.has(h)||this.mCoreEntityConstructor.set(h,new Set),this.mCoreEntityConstructor.get(h).add(e)}while(h=Object.getPrototypeOf(h))}},ft=new Pr;var te=class v extends At{static mExtensionCache=new WeakMap;mExtensionList;constructor(t){super(t),this.mExtensionList=new Array}deconstruct(){for(let t of this.mExtensionList)t.deconstruct();super.deconstruct()}setup(){return super.setup(),this.executeExtensions(),this}executeExtensions(){let t=(()=>{if(!v.mExtensionCache.has(this.processorConstructor)){let h=ft.get($t).filter(y=>{for(let w of y.processorConfiguration.targetRestrictions)if(this instanceof w||this.processorConstructor.prototype instanceof w||this.processorConstructor===w)return!0;return!1}),g={read:h.filter(y=>y.processorConfiguration.access===Z.Read),write:h.filter(y=>y.processorConfiguration.access===Z.Write),readWrite:h.filter(y=>y.processorConfiguration.access===Z.ReadWrite)};v.mExtensionCache.set(this.processorConstructor,g)}return v.mExtensionCache.get(this.processorConstructor)})(),e=[...t.write,...t.readWrite,...t.read];for(let i of e)this.mExtensionList.push(new $t(i.processorConstructor,this).setup())}};var X={get:1,set:2,manual:4};var je=class v{static ORIGINAL_TO_INTERACTION_MAPPING=new WeakMap;static PROXY_TO_ORIGINAL_MAPPING=new WeakMap;static UNTRACEABLE_FUNCTION_UPDATE_TRIGGER=(()=>{let t=new WeakMap;return t.set(Array.prototype.fill,X.set),t.set(Array.prototype.pop,X.get),t.set(Array.prototype.push,X.set),t.set(Array.prototype.shift,X.get),t.set(Array.prototype.unshift,X.set),t.set(Array.prototype.splice,X.set),t.set(Array.prototype.reverse,X.set),t.set(Array.prototype.sort,X.set),t.set(Array.prototype.concat,X.set),t.set(Map.prototype.clear,X.set),t.set(Map.prototype.delete,X.set),t.set(Map.prototype.set,X.set),t.set(Set.prototype.clear,X.set),t.set(Set.prototype.delete,X.set),t.set(Set.prototype.add,X.set),t})();static getOriginal(t){return v.PROXY_TO_ORIGINAL_MAPPING.get(t)??t}static getWrapper(t){let e=v.getOriginal(t);return v.ORIGINAL_TO_INTERACTION_MAPPING.get(e)}mProxyObject;mStateChangeCallback;get proxy(){return this.mProxyObject}constructor(t,e){let i=v.getWrapper(t);if(i)return i;this.mProxyObject=this.createProxyObject(t),this.mStateChangeCallback=e,v.PROXY_TO_ORIGINAL_MAPPING.set(this.mProxyObject,t),v.ORIGINAL_TO_INTERACTION_MAPPING.set(t,this)}convertToProxy(t){return t===null||typeof t!="object"&&typeof t!="function"?t:new v(t,this.mStateChangeCallback).proxy}createProxyObject(t){let e=(h,g,y)=>{let w=v.getOriginal(g);try{let C=h.call(w,...y);return this.convertToProxy(C)}finally{if(v.UNTRACEABLE_FUNCTION_UPDATE_TRIGGER.has(h)){let C=v.getWrapper(g);C&&C.dispatch(v.UNTRACEABLE_FUNCTION_UPDATE_TRIGGER.get(h))}}};return new Proxy(t,{apply:(h,g,y)=>{let w=h;try{let C=w.call(g,...y);return this.convertToProxy(C)}catch(C){if(!(C instanceof TypeError))throw C;return e(w,g,y)}},set:(h,g,y)=>{try{let w=y;return(w!==null&&typeof w=="object"||typeof w=="function")&&(w=v.getOriginal(w)),Reflect.set(h,g,w)}finally{this.dispatch(X.set)}},get:(h,g,y)=>{try{return this.convertToProxy(Reflect.get(h,g))}finally{this.dispatch(X.get)}},deleteProperty:(h,g)=>{try{return delete h[g]}finally{this.dispatch(X.set)}}})}dispatch(t){this.mStateChangeCallback(t)}};var V=class v{static reaction(t){let e=Et.create("ComponentState reaction");e.addInteractionListener(i=>{(i.triggerType&X.set)!==0&&t()}),e.execute(()=>{t()})}static state(t){return(e,i)=>{if(i.static)throw new A("Event target is not for a static property.",v);let h=new WeakMap,g=(y,w)=>{h.set(y,new v(w,t))};return{init(y){return typeof y>"u"||g(this,y),y},set(y){h.has(this)?h.get(this).set(y):g(this,y)},get(){return h.has(this)||g(this,void 0),h.get(this).get()}}}}mConfiguration;mLinkedZones;mLinkedZonesArray;mValue;constructor(t,e){if(this.mLinkedZones=new Set,this.mLinkedZonesArray=new Array,this.mConfiguration={complexValue:e?.complexValue??!1,proxy:e?.proxy??!1},this.mConfiguration.proxy){if(typeof t!="object"||t===null)throw new A("Proxied component state value must be an object.",this);this.mValue=new je(t,i=>{switch(i){case X.set:return this.dispatchChange();case X.get:return this.linkCurrentZone()}}).proxy}else this.mValue=t}get(){return this.linkCurrentZone(),this.mValue}set(t){if(this.mConfiguration.proxy)throw new A("Proxy is not implemented yet.",this);!this.mConfiguration.complexValue&&this.mValue===t||(this.mValue=t,this.dispatchChange())}dispatchChange(){for(let t of this.mLinkedZonesArray)t.pushInteraction(X.set,this)}linkCurrentZone(){let t=Et.current;this.mLinkedZones.has(t)||(this.mLinkedZones.add(t),this.mLinkedZonesArray.push(t))}};var Gt=class v{static mCurrentUpdateCycle=null;static openResheduledCycle(t,e){let i=!1;if(!v.mCurrentUpdateCycle){let h=performance.now();v.mCurrentUpdateCycle={initiator:t.initiator,startTime:h,forcedSync:t.forcedSync,runner:t.runner},i=!0}try{return e(v.mCurrentUpdateCycle)}finally{i&&(v.mCurrentUpdateCycle=null)}}static openUpdateCycle(t,e){let i=!1;if(!v.mCurrentUpdateCycle){let h=performance.now();v.mCurrentUpdateCycle={initiator:t.updater,startTime:h,forcedSync:t.runSync,runner:Symbol("Runner "+h)},i=!0}try{return e(v.mCurrentUpdateCycle)}finally{i&&(v.mCurrentUpdateCycle=null)}}static updateCycleRunId(t,e){if(t.initiator===e){let i=performance.now(),h=t;h.runner=Symbol("Runner "+i)}}static updateCyleStartTime(t){let e=performance.now(),i=t;i.startTime=e}};var Ve=class extends Error{mChain;get chain(){return this.mChain}constructor(t,e){let i=e.slice(-20).map(h=>h.toString()).join(`
`);super(`${t}: 
${i}`),this.mChain=[...e]}};var Be=class v{static DEFAULT_FRAME_TIME=Number.MAX_SAFE_INTEGER;static STACK_CAP=100;mFrameTime;mInteractionZone;mManualComponentState;mUpdateFunction;mUpdateRunCache;mUpdateStates;get zone(){return this.mInteractionZone}constructor(t){this.mUpdateRunCache=new WeakMap,this.mUpdateFunction=t.onUpdate,this.mFrameTime=v.DEFAULT_FRAME_TIME;let e=Et.current.getAttachment(Pt.ATTACHMENT_KEY);e&&(this.mFrameTime=e.guaranteedFrameTime),this.mManualComponentState=new V(Symbol("Manual Update")),this.mUpdateStates={chainCompleteHooks:new jt,async:{hasSheduledTask:!1,hasRunningTask:!1,sheduledTaskIsResheduled:!1},sync:{running:!1},cycle:{chainedTask:null}},this.mInteractionZone=Et.create("Update-Zone"),this.mInteractionZone.addInteractionListener(i=>{(i.triggerType&X.set)!==0&&this.runUpdateAsynchron(i,null)})}deconstruct(){this.mInteractionZone.removeInteractionListener()}executeInZone(t){return this.mInteractionZone.execute(t)}update(){let t=new Bt(X.manual,this.mInteractionZone,this.mManualComponentState);return this.runUpdateSynchron(t)}updateAsync(){let t=new Bt(X.manual,this.mInteractionZone,this.mManualComponentState);this.runUpdateAsynchron(t,null)}async waitForUpdate(){return this.mUpdateStates.async.hasSheduledTask?new Promise((t,e)=>{this.mUpdateStates.chainCompleteHooks.push((i,h)=>{h?e(h):t(i)})}):!1}executeTaskChain(t,e,i,h){if(h.length>v.STACK_CAP)throw new Ve("Call loop detected",h);let g=performance.now();if(!e.forcedSync&&g-e.startTime>this.mFrameTime)throw new xe;h.push(t);let y=this.mInteractionZone.execute(()=>this.mUpdateFunction.call(this))||i;if(Gt.updateCycleRunId(e,this),!this.mUpdateStates.cycle.chainedTask)return y;let w=this.mUpdateStates.cycle.chainedTask;return this.mUpdateStates.cycle.chainedTask=null,this.executeTaskChain(w,e,y,h)}releaseUpdateChainCompleteHooks(t,e){if(!this.mUpdateStates.chainCompleteHooks.top)return;let i;for(;i=this.mUpdateStates.chainCompleteHooks.pop();)i(t,e)}runUpdateAsynchron(t,e){if(this.mUpdateStates.async.hasRunningTask||this.mUpdateStates.async.sheduledTaskIsResheduled){this.mUpdateStates.cycle.chainedTask=t;return}if(this.mUpdateStates.async.hasSheduledTask)return;let i=h=>{this.mUpdateStates.async.hasRunningTask=!0,this.mUpdateStates.async.hasSheduledTask=!1,this.mUpdateStates.async.sheduledTaskIsResheduled=!1;let g=!1;try{this.runUpdateSynchron(t)}catch(y){if(y instanceof xe&&h.initiator===this)g=!0;else throw new Qt(y,this.zone)}finally{this.mUpdateStates.async.hasRunningTask=!1}g&&this.runUpdateAsynchron(t,h)};this.mUpdateStates.async.hasSheduledTask=!0,e&&(this.mUpdateStates.async.sheduledTaskIsResheduled=!0),globalThis.requestAnimationFrame(()=>{e?Gt.openResheduledCycle(e,i):Gt.openUpdateCycle({updater:this,runSync:!1},i)})}runUpdateSynchron(t){if(this.mUpdateStates.sync.running)return this.mUpdateStates.cycle.chainedTask=t,!1;this.mUpdateStates.sync.running=!0;try{let e=Gt.openUpdateCycle({updater:this,runSync:!0},i=>{if(this.mUpdateRunCache.has(i.runner))return Gt.updateCyleStartTime(i),this.mUpdateRunCache.get(i.runner);let h=this.executeTaskChain(t,i,!1,new Array);return this.mUpdateRunCache.set(i.runner,h),h});return this.releaseUpdateChainCompleteHooks(e),e}catch(e){throw e instanceof xe||this.releaseUpdateChainCompleteHooks(!1,e),e}finally{this.mUpdateStates.sync.running=!1}}},xe=class extends Error{constructor(){super("Update resheduled")}};var $e=class extends te{mUpdater;get updater(){return this.mUpdater}constructor(t){super(t),this.mUpdater=new Be({label:t.constructor.name,onUpdate:()=>this.onUpdate()})}call(t,...e){return this.mUpdater.executeInZone(()=>super.call(t,...e))}deconstruct(){this.mUpdater.deconstruct(),super.deconstruct()}createProcessor(){return this.mUpdater.executeInZone(()=>super.createProcessor())}};var Zt=class{mExpression;mTemporaryValues;constructor(t,e,i){if(this.mTemporaryValues=new nt,i.length>0)for(let h of i)this.mTemporaryValues.set(h,void 0);this.mExpression=this.createEvaluationFunction(t,this.mTemporaryValues).bind(e.store)}execute(){return this.mExpression()}setTemporaryValue(t,e){if(!this.mTemporaryValues.has(t))throw new A(`Temporary value "${t}" does not exist for this procedure.`,this);this.mTemporaryValues.set(t,e)}createEvaluationFunction(t,e){let i,h=`__${Math.random().toString(36).substring(2)}`;if(i="return function () {",e.size>0)for(let g of e.keys())i+=`const ${g} = ${h}.get('${g}');`;return i+=`return ${t};`,i+="};",new Function(h,i)(e)}};var _t=class{mDataLevel;get data(){return this.mDataLevel}constructor(t){this.mDataLevel=t}createExpressionProcedure(t,e){return new Zt(t,this.data,e??[])}setTemporaryValue(t,e){this.data.setTemporaryValue(t,e)}};var gt=class{mComponent;mDataProxy;mParentLevel;mTemporaryValues;get store(){return this.mDataProxy}constructor(t){this.mTemporaryValues=new nt,t instanceof U?(this.mParentLevel=null,this.mComponent=t):(this.mParentLevel=t,this.mComponent=t.mComponent),this.mDataProxy=this.createAccessProxy()}deleteTemporaryValue(t){this.mTemporaryValues.delete(t)}setTemporaryValue(t,e){this.mTemporaryValues.set(t,e)}updateLevelData(t){if(t.mParentLevel!==this.mParentLevel)throw new A("Can't update InstructionLevelData for a deeper level than it target data.",this);this.mTemporaryValues=t.mTemporaryValues}createAccessProxy(){return new Proxy(new Object,{get:(t,e)=>this.getValue(e),set:(t,e,i)=>(this.hasTemporaryValue(e)&&this.setTemporaryValue(e,i),e in this.mComponent.processor?(this.mComponent.processor[e]=i,!0):(this.setTemporaryValue(e,i),!0)),deleteProperty:()=>{throw new A("Deleting properties is not allowed",this)},ownKeys:()=>[...new Set([...Object.keys(this.mComponent.processor),...this.getTemporaryValuesList()])]})}getTemporaryValuesList(){let t=this.mTemporaryValues.map(e=>e);return this.mParentLevel&&t.push(...this.mParentLevel.getTemporaryValuesList()),t}getValue(t){if(this.mTemporaryValues.has(t))return this.mTemporaryValues.get(t);if(this.mParentLevel)return this.mParentLevel.getValue(t);if(t in this.mComponent.processor)return this.mComponent.processor[t]}hasTemporaryValue(t){return this.mTemporaryValues.has(t)?!0:this.mParentLevel?this.mParentLevel.hasTemporaryValue(t):!1}};var qt=class v{mChildList;mInstruction;mInstructionType;get childList(){return this.mChildList}get instruction(){return this.mInstruction}get instructionType(){return this.mInstructionType}constructor(t,e){this.mChildList=Array(),this.mInstruction=e,this.mInstructionType=t}appendChild(...t){this.mChildList.push(...t)}clone(){let t=new v(this.instructionType,this.instruction);for(let e of this.mChildList)t.appendChild(e.clone());return t}equals(t){if(!(t instanceof v)||t.instruction!==this.instruction||t.instructionType!==this.instructionType||t.childList.length!==this.childList.length)return!1;for(let e=0;e<t.childList.length;e++)if(!t.childList[e].equals(this.childList[e]))return!1;return!0}removeChild(t){let e=this.mChildList.indexOf(t);if(e!==-1)return this.mChildList.splice(e,1)[0]}};var Nt=class v{mExpression;get value(){return this.mExpression}constructor(t){this.mExpression=t}clone(){return new v(this.mExpression)}equals(t){return t instanceof v&&t.value===this.value}toString(){return`{{ ${this.mExpression} }}`}};var Lt=class v{mContainsExpression;mTextValue;mValues;get containsExpression(){return this.mContainsExpression}get values(){return this.mValues}constructor(){this.mTextValue="",this.mContainsExpression=!1,this.mValues=[]}addValue(...t){for(let e of t)(this.mContainsExpression===!0||e instanceof Nt)&&(this.mContainsExpression=!0),this.mValues.push(e),this.mTextValue+=e.toString()}clone(){let t=new v;for(let e of this.values)typeof e=="string"?t.addValue(e):t.addValue(e.clone());return t}equals(t){if(!(t instanceof v)||t.values.length!==this.values.length)return!1;for(let e=0;e<this.values.length;e++){let i=this.values[e],h=t.values[e];if(i!==h&&(typeof i!=typeof h||typeof i=="string"&&i!==h||!h.equals(i)))return!1}return!0}toString(){return this.mTextValue}};var Te=class v{mName;mValue;get name(){return this.mName}get values(){return this.mValue}constructor(t){this.mName=t,this.mValue=new Lt}clone(){let t=new v(this.name);for(let e of this.values.values)typeof e=="string"?t.values.addValue(e):t.values.addValue(e.clone());return t}equals(t){return!(!(t instanceof v)||t.name!==this.name||!t.values.equals(this.values))}};var Rt=class v{mAttributeDictionary;mChildList;mTagName;get attributes(){return[...this.mAttributeDictionary.values()]}get childList(){return this.mChildList}get tagName(){return this.mTagName}constructor(t){this.mAttributeDictionary=new Map,this.mChildList=Array(),this.mTagName=t}appendChild(...t){this.mChildList.push(...t)}clone(){let t=new v(this.tagName);for(let e of this.mAttributeDictionary.values()){let i=t.setAttribute(e.name);for(let h of e.values.values)typeof h=="string"?i.addValue(h):i.addValue(h.clone())}for(let e of this.mChildList)t.appendChild(e.clone());return t}equals(t){if(!(t instanceof v)||t.tagName!==this.tagName||t.attributes.length!==this.mAttributeDictionary.size||t.childList.length!==this.mChildList.length)return!1;for(let e of t.mAttributeDictionary.values()){let i=this.mAttributeDictionary.get(e.name);if(!i||!i.equals(e))return!1}for(let e=0;e<t.childList.length;e++)if(!t.childList[e].equals(this.mChildList[e]))return!1;return!0}getAttribute(t){return this.mAttributeDictionary.get(t)?.values??null}removeAttribute(t){return this.mAttributeDictionary.delete(t)}removeChild(t){let e=this.mChildList.indexOf(t);if(e!==-1)return this.mChildList.splice(e,1)[0]}setAttribute(t){if(this.mAttributeDictionary.has(t))return this.mAttributeDictionary.get(t).values;let e=new Te(t);return this.mAttributeDictionary.set(t,e),e.values}};var mt=class v{mBodyElementList;get body(){return this.mBodyElementList}constructor(){this.mBodyElementList=new Array}appendChild(...t){this.mBodyElementList.push(...t)}clone(){let t=new v;for(let e of this.mBodyElementList)t.appendChild(e.clone());return t}equals(t){if(!(t instanceof v)||t.body.length!==this.mBodyElementList.length)return!1;for(let e=0;e<this.mBodyElementList.length;e++)if(!this.mBodyElementList[e].equals(t.body[e]))return!1;return!0}removeChild(t){let e=this.mBodyElementList.indexOf(t);if(e!==-1)return this.mBodyElementList.splice(e,1)[0]}};var ut=class{mComponentValues;mContent;mModules;mTemplate;get anchor(){return this.mContent.contentAnchor}get content(){return this.mContent}get modules(){return this.mModules}get template(){return this.mTemplate}get values(){return this.mComponentValues}constructor(t,e,i,h){this.mTemplate=t,this.mComponentValues=i,this.mContent=h,this.mModules=e,h.setCoreBuilder(this)}deconstruct(){this.content.deconstruct()}update(){let t=this.onUpdate(),e=!1,i=this.content.builders;if(i.length>0)for(let h=0;h<i.length;h++)e=i[h].update()||e;return t||e}createTextNode(t){return document.createTextNode(t)}};var ee=class{mChildBuilderList;mChildComponents;mContentAnchor;mContentBoundary;mLinkedContent;mRootChildList;get body(){return this.mRootChildList}get builders(){return this.mChildBuilderList}get contentAnchor(){return this.mContentAnchor}constructor(t){this.mChildBuilderList=new Array,this.mRootChildList=new Array,this.mChildComponents=new Map,this.mLinkedContent=new WeakSet,this.mContentAnchor=document.createComment(t),this.mContentBoundary={start:this.mContentAnchor,end:this.mContentAnchor}}deconstruct(){this.onDeconstruct();let t;for(;t=this.mChildBuilderList.pop();)t.deconstruct();for(let i of this.mChildComponents.values())i.deconstruct();this.mChildComponents.clear();let e;for(;e=this.mRootChildList.pop();)e instanceof ut||e.remove();this.contentAnchor.remove()}getBoundary(){let t=this.mContentBoundary.end instanceof ut?this.mContentBoundary.end.content.getBoundary().end:this.mContentBoundary.end;return{start:this.mContentBoundary.start,end:t}}insert(t,e,i){if(!this.mLinkedContent.has(i))throw new A("Can't add content to builder. Target is not part of builder.",this);let h=t instanceof ut?t.anchor:t;switch(e){case"After":{this.insertAfter(h,i);break}case"TopOf":{this.insertTop(h,i);break}case"BottomOf":{this.insertBottom(h,i);break}}this.mLinkedContent.add(t),t instanceof ut?this.mChildBuilderList.push(t):this.addChildComponent(t);let g=h.parentElement??h.getRootNode(),y=this.mContentAnchor.parentElement??this.mContentAnchor.getRootNode();if(g===y){let w=(()=>{switch(e){case"After":return this.mRootChildList.indexOf(i)+1;case"TopOf":return 0;case"BottomOf":return this.mRootChildList.length}})();w===this.mRootChildList.length&&(this.mContentBoundary.end=t),this.mRootChildList.splice(w+1,0,t)}}remove(t){if(!this.mLinkedContent.has(t))throw new A("Child node cant be deleted from builder when it not a child of them",this);if(this.mLinkedContent.delete(t),t instanceof ut){let i=this.mChildBuilderList.indexOf(t);i!==-1&&this.mChildBuilderList.splice(i,1),t.deconstruct()}else{let i=this.mChildComponents.get(t);i&&(i.deconstruct(),this.mChildComponents.delete(t)),t.remove()}let e=this.mRootChildList.indexOf(t);e!==-1&&(this.mRootChildList.splice(e,1),this.mContentBoundary.end=this.mRootChildList.at(-1)??this.mContentAnchor)}setCoreBuilder(t){this.mLinkedContent.add(t)}addChildComponent(t){k.elementIsComponent(t)&&this.mChildComponents.set(t,k.ofElement(t).component)}insertAfter(t,e){let i=e instanceof ut?e.content.getBoundary().end:e;(i.parentElement??i.getRootNode()).insertBefore(t,i.nextSibling)}insertBottom(t,e){if(e instanceof ut){this.insertAfter(t,e);return}if(e instanceof Element){e.appendChild(t);return}throw new A("Source node does not support child nodes.",this)}insertTop(t,e){if(e instanceof ut){this.insertAfter(t,e.anchor);return}if(e instanceof Element){e.prepend(t);return}throw new A("Source node does not support child nodes.",this)}};var Ge=class extends ee{mAttributeModulesChangedOrder;mLinkedAttributeData;mLinkedAttributeExpressionModules;mLinkedAttributeModuleList;mLinkedExpressionModuleList;get linkedAttributeModules(){return this.mAttributeModulesChangedOrder&&(this.mAttributeModulesChangedOrder=!1,this.mLinkedAttributeModuleList.sort((t,e)=>t.accessMode-e.accessMode)),this.mLinkedAttributeModuleList}get linkedExpressionModules(){return this.mLinkedExpressionModuleList}constructor(t){super(t),this.mLinkedExpressionModuleList=new Array,this.mLinkedAttributeModuleList=new Array,this.mLinkedAttributeExpressionModules=new WeakMap,this.mLinkedAttributeData=new WeakMap,this.mAttributeModulesChangedOrder=!1}attributeOfLinkedExpressionModule(t){return this.mLinkedAttributeExpressionModules.get(t)}getLinkedAttributeData(t){if(!this.mLinkedAttributeData.has(t))throw new A("Attribute has no linked data.",this);return this.mLinkedAttributeData.get(t)}linkAttributeExpression(t,e){this.mLinkedAttributeExpressionModules.set(t,e)}linkAttributeModule(t){this.mLinkedAttributeModuleList.push(t),this.mAttributeModulesChangedOrder=!0}linkAttributeNodes(t,e,i){this.mLinkedAttributeData.set(t,{values:i,node:e})}linkExpressionModule(t){this.mLinkedExpressionModuleList.push(t)}onDeconstruct(){for(let t of this.mLinkedAttributeModuleList)t.deconstruct();for(let t of this.mLinkedExpressionModuleList)t.deconstruct()}};var Ue=class extends ee{mInstructionModule;get instructionModule(){return this.mInstructionModule}constructor(t,e){super(e),this.mInstructionModule=t}onDeconstruct(){this.mInstructionModule.deconstruct()}};var He=class extends ut{constructor(t,e,i){let h=e.createInstructionModule(t,i);super(t,e,i,new Ue(h,`Instruction - {$${t.instructionType}}`))}onUpdate(){if(this.content.instructionModule.update()){let t=this.content.body;this.updateStaticBuilder(t,this.content.instructionModule.instructionResult.elementList)}return!1}insertNewContent(t,e){let i=new re(t.template,this.modules,t.dataLevel,`Child - {$${this.template.instructionType}}`,t.key);return e===null?this.content.insert(i,"TopOf",this):this.content.insert(i,"After",e),i}updateStaticBuilder(t,e){let h=new pe((w,C)=>C.template.equals(w.template)&&C.key===w.key).differencesOf(t,e),g=0,y=null;for(let w=0;w<h.length;w++){let C=h[w];if(C.changeState===St.Remove)this.content.remove(C.item);else if(C.changeState===St.Insert)y=this.insertNewContent(C.item,y),g++;else{let S=e[g].dataLevel;C.item.values.updateLevelData(S),y=C.item,g++}}}};var re=class extends ut{mInitialized;mKey;get key(){return this.mKey}constructor(t,e,i,h,g){super(t,e,i,new Ge(`Static - {${h}}`)),this.mKey=g,this.mInitialized=!1}onUpdate(){this.mInitialized||(this.mInitialized=!0,this.buildTemplate([this.template],this));let t=!1,e=this.content.linkedAttributeModules;for(let g=0;g<e.length;g++)t=e[g].update()||t;let i=!1,h=this.content.linkedExpressionModules;for(let g=0;g<h.length;g++){let y=h[g];if(y.update()){i=!0;let w=this.content.attributeOfLinkedExpressionModule(y);if(!w)continue;let C=this.content.getLinkedAttributeData(w),S=C.values.reduce((l,o)=>l+o.data,"");C.node.setAttribute(w.name,S)}}return t||i}buildInstructionTemplate(t,e){this.content.insert(new He(t,this.modules,new gt(this.values)),"BottomOf",e)}buildStaticTemplate(t,e){let{element:i,isComponent:h}=this.createHtmlElement(t),g=null;h&&(g=new Array);for(let y of t.attributes){let w=this.modules.createAttributeModule(y,i,this.values);if(w){this.content.linkAttributeModule(w),h&&g.push(w);continue}if(y.values.containsExpression){let C=new Array;for(let S of y.values.values){let l=this.createTextNode("");if(C.push(l),!(S instanceof Nt)){l.data=S;continue}let o=this.modules.createExpressionModule(S,l,this.values);this.content.linkExpressionModule(o),this.content.linkAttributeExpression(o,y)}this.content.linkAttributeNodes(y,i,C);continue}i.setAttribute(y.name,y.values.toString())}if(h){for(let y of g)y.update();k.ofElement(i).component.updater.update()}this.content.insert(i,"BottomOf",e),this.buildTemplate(t.childList,i)}buildTemplate(t,e){for(let i of t)i instanceof mt?this.buildTemplate(i.body,e):i instanceof Lt?this.buildTextTemplate(i,e):i instanceof qt?this.buildInstructionTemplate(i,e):i instanceof Rt&&this.buildStaticTemplate(i,e)}buildTextTemplate(t,e){for(let i of t.values){if(typeof i=="string"){this.content.insert(this.createTextNode(i),"BottomOf",e);continue}let h=this.createTextNode("");this.content.insert(h,"BottomOf",e);let g=this.modules.createExpressionModule(i,h,this.values);this.content.linkExpressionModule(g)}}createHtmlElement(t){let e=t.tagName;if(e.includes("-")){let h=globalThis.customElements.get(e);if(typeof h<"u"){let g=new h;return{element:g,isComponent:k.elementIsComponent(g)}}}let i=t.getAttribute("xmlns");return i&&!i.containsExpression?{element:document.createElementNS(i.values[0],e),isComponent:!1}:{element:document.createElement(e),isComponent:!1}}};var De=class{mHtmlElement;mShadowRoot;get htmlElement(){return this.mHtmlElement}get shadowRoot(){return this.mShadowRoot}constructor(t){this.mHtmlElement=t,this.mShadowRoot=this.mHtmlElement.attachShadow({mode:"open"})}};var W=class{mDataLevel;get data(){return this.mDataLevel}constructor(t){this.mDataLevel=t}createExpressionProcedure(t,e){return new Zt(t,this.data,e??[])}};var Ut=class extends te{constructor(t){super({constructor:t.constructor,parent:t.parent}),this.setProcessorInjection(W,new W(t.values))}deconstruct(){super.deconstruct(),this.call("onDeconstruct")}update(){return this.onUpdate()}};var ot=class{mValue;get value(){return this.mValue}constructor(t){this.mValue=t}};var J=class{constructor(){throw new A("Reference should not be instanced.",this)}};var vt=class{constructor(){throw new A("Reference should not be instanced.",this)}};var Ht=class v extends Ut{mLastResult;mTargetTextNode;constructor(t){super({constructor:t.constructor,parent:t.parent,values:t.values}),this.mTargetTextNode=t.targetNode,this.mLastResult=null,this.setProcessorInjection(v,this),this.setProcessorInjection(vt,t.targetTemplate.clone()),this.setProcessorInjection(J,t.targetNode),this.setProcessorInjection(ot,new ot(t.targetTemplate.value))}onUpdate(){let t=this.call("onUpdate");t===null&&(t="");let e=this.mLastResult===null||this.mLastResult!==t;if(e){let i=this.mTargetTextNode;i.data=t,this.mLastResult=t}return e}};function _r(){return(v,t)=>{F.registerInjectable(v,t.metadata,"instanced"),ft.register(Ht,v,{})}}function vc(){function v(l,o){return function(c){e(o,"addInitializer"),i(c,"An initializer"),l.push(c)}}function t(l,o,u,c,r,b,d,T,x){var m;switch(r){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var s={kind:m,name:d?"#"+o:o,static:b,private:d,metadata:T},f={v:!1};s.addInitializer=v(c,f);var n,a;if(r===0?d?(n=u.get,a=u.set):(n=function(){return this[o]},a=function(p){this[o]=p}):r===2?n=function(){return u.value}:((r===1||r===3)&&(n=function(){return u.get.call(this)}),(r===1||r===4)&&(a=function(p){u.set.call(this,p)})),d)s.access=n&&a?{get:n,set:a}:n?{get:n}:{set:a};else{if(n){var P=n;n=function(p){return arguments.length===0&&(p=this),P.call(p)}}if(a){var _=a;a=function(p,M){return arguments.length===1&&(M=p,p=this),_.call(p,M)}}var D=function(p){return o in p};s.access=n&&a?{has:D,get:n,set:a}:n?{has:D,get:n}:{has:D,set:a}}try{return l(x,s)}finally{f.v=!0}}function e(l,o){if(l.v)throw new Error("attempted to call "+o+" after decoration was finished")}function i(l,o){if(typeof l!="function")throw new TypeError(o+" must be a function")}function h(l,o){var u=typeof o;if(l===1){if(u!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&i(o.get,"accessor.get"),o.set!==void 0&&i(o.set,"accessor.set"),o.init!==void 0&&i(o.init,"accessor.init")}else if(u!=="function"){var c;throw l===0?c="field":l===10?c="class":c="method",new TypeError(c+" decorators must return a function or void 0")}}function g(l,o,u,c,r,b,d,T,x){var m=u[0],s,f,n;d?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,c)),r===1?n={get:s.get,set:s.set}:r===2?n=s.value:r===3?n=s.get:r===4&&(n=s.set);var a,P,_;if(typeof m=="function")a=t(m,c,s,T,r,b,d,x,n),a!==void 0&&(h(r,a),r===0?f=a:r===1?(f=a.init,P=a.get||n.get,_=a.set||n.set,n={get:P,set:_}):n=a);else for(var D=m.length-1;D>=0;D--){var p=m[D];if(a=t(p,c,s,T,r,b,d,x,n),a!==void 0){h(r,a);var M;r===0?M=a:r===1?(M=a.init,P=a.get||n.get,_=a.set||n.set,n={get:P,set:_}):n=a,M!==void 0&&(f===void 0?f=M:typeof f=="function"?f=[f,M]:f.push(M))}}if(r===0||r===1){if(f===void 0)f=function(I,E){return E};else if(typeof f!="function"){var O=f;f=function(I,E){for(var N=E,L=0;L<O.length;L++)N=O[L].call(I,N);return N}}else{var z=f;f=function(I,E){return z.call(I,E)}}l.push(f)}r!==0&&(r===1?(s.get=n.get,s.set=n.set):r===2?s.value=n:r===3?s.get=n:r===4&&(s.set=n),d?r===1?(l.push(function(I,E){return n.get.call(I,E)}),l.push(function(I,E){return n.set.call(I,E)})):r===2?l.push(n):l.push(function(I,E){return n.call(I,E)}):Object.defineProperty(o,c,s))}function y(l,o,u){for(var c=[],r,b,d=new Map,T=new Map,x=0;x<o.length;x++){var m=o[x];if(Array.isArray(m)){var s=m[1],f=m[2],n=m.length>3,a=s>=5,P,_;if(a?(P=l,s=s-5,b=b||[],_=b):(P=l.prototype,r=r||[],_=r),s!==0&&!n){var D=a?T:d,p=D.get(f)||0;if(p===!0||p===3&&s!==4||p===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!p&&s>2?D.set(f,s):D.set(f,!0)}g(c,P,m,f,s,a,n,_,u)}}return w(c,r),w(c,b),c}function w(l,o){o&&l.push(function(u){for(var c=0;c<o.length;c++)o[c].call(u);return u})}function C(l,o,u){if(o.length>0){for(var c=[],r=l,b=l.name,d=o.length-1;d>=0;d--){var T={v:!1};try{var x=o[d](r,{kind:"class",name:b,addInitializer:v(c,T),metadata:u})}finally{T.v=!0}x!==void 0&&(h(10,x),r=x)}return[S(r,u),function(){for(var m=0;m<c.length;m++)c[m].call(r)}]}}function S(l,o){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,u,c,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var d=Object.create(b===void 0?null:b),T=y(o,u,d);return c.length||S(o,d),{e:T,get c(){return C(o,c,d)}}}}function Xr(v,t,e,i){return(Xr=vc())(v,t,e,i)}var Yr,Ur,Ir;Yr=_r();var Hr=class{static{({c:[Ir,Ur]}=Xr(this,[],[Yr]))}constructor(t=F.use(W),e=F.use(ot)){this.mProcedure=t.createExpressionProcedure(e.value)}mProcedure;onUpdate(){let t=this.mProcedure.execute();return typeof t>"u"?null:t?.toString()}static{Ur()}};var st=class{mName;mValue;get name(){return this.mName}get value(){return this.mValue}constructor(t,e){this.mName=t,this.mValue=e}};var Ct=class v extends Ut{mAccessMode;get accessMode(){return this.mAccessMode}constructor(t){super({constructor:t.constructor,parent:t.parent,values:t.values}),this.mAccessMode=t.accessMode,this.setProcessorInjection(v,this),this.setProcessorInjection(vt,t.targetTemplate.clone()),this.setProcessorInjection(J,t.targetNode),this.setProcessorInjection(st,new st(t.targetTemplate.name,t.targetTemplate.values.toString()))}onUpdate(){return this.call("onUpdate")??!1}};var dt=class{mDataLevels;mElementList;mTemplates;get elementList(){return this.mElementList}constructor(){this.mElementList=new Array,this.mTemplates=new Set,this.mDataLevels=new Set}addElement(t,e,i){if(this.mTemplates.has(t)||this.mDataLevels.has(e))throw new A("Can't add same template or values for multiple Elements.",this);this.mTemplates.add(t),this.mDataLevels.add(e),this.mElementList.push({template:t,dataLevel:e,key:i})}};var Xt=class v extends Ut{mLastResult;get instructionResult(){return this.mLastResult}constructor(t){super({constructor:t.constructor,parent:t.parent,values:t.values}),this.setProcessorInjection(v,this),this.setProcessorInjection(vt,t.targetTemplate.clone()),this.setProcessorInjection(ot,new ot(t.targetTemplate.instruction)),this.mLastResult=new dt}onUpdate(){let t=this.call("onUpdate");return t instanceof dt?(this.mLastResult=t,!0):!1}};var Xe=class v{static mAttributeModuleCache=new nt;static mExpressionModuleCache=new WeakMap;static mInstructionModuleCache=new nt;mComponent;mExpressionModule;constructor(t,e){this.mExpressionModule=e??Ir,this.mComponent=t}createAttributeModule(t,e,i){let h=(()=>{let g=v.mAttributeModuleCache.get(t.name);if(g||g===null)return g;for(let y of ft.get(Ct))if(y.processorConfiguration.selector.test(t.name))return v.mAttributeModuleCache.set(t.name,y),y;return v.mAttributeModuleCache.set(t.name,null),null})();return h===null?null:new Ct({accessMode:h.processorConfiguration.access,constructor:h.processorConstructor,parent:this.mComponent,targetNode:e,targetTemplate:t,values:i}).setup()}createExpressionModule(t,e,i){let h=(()=>{let g=v.mExpressionModuleCache.get(this.mExpressionModule);if(g)return g;let y=ft.get(Ht).find(w=>w.processorConstructor===this.mExpressionModule);if(!y)throw new A("An expression module could not be found.",this);return v.mExpressionModuleCache.set(this.mExpressionModule,y),y})();return new Ht({constructor:h.processorConstructor,parent:this.mComponent,targetNode:e,targetTemplate:t,values:i}).setup()}createInstructionModule(t,e){let i=(()=>{let h=v.mInstructionModuleCache.get(t.instructionType);if(h)return h;for(let g of ft.get(Xt))if(g.processorConfiguration.instructionType===t.instructionType)return v.mInstructionModuleCache.set(t.instructionType,g),g;throw new A(`Instruction module type "${t.instructionType}" not found.`,this)})();return new Xt({constructor:i.processorConstructor,parent:this.mComponent,targetTemplate:t,values:e}).setup()}};var Jt=class extends A{mColumnEnd;mColumnStart;mLineEnd;mLineStart;get columnEnd(){return this.mColumnEnd}get columnStart(){return this.mColumnStart}get lineEnd(){return this.mLineEnd}get lineStart(){return this.mLineStart}constructor(t,e,i,h,g,y,w){super(t,e,w),this.mColumnStart=i,this.mLineStart=h,this.mColumnEnd=g,this.mLineEnd=y}};var oe=class{mDependencyFetch;mDependencyFetchResolved;mLexer;mMeta;mPattern;mPatternDependencies;mType;get dependencies(){return this.mPatternDependencies}get dependenciesResolved(){return this.mDependencyFetchResolved}get lexer(){return this.mLexer}get meta(){return this.mMeta}get pattern(){return this.mPattern}constructor(t,e){if(this.mLexer=t,this.mType=e.type,this.mMeta=e.metadata,this.mPatternDependencies=new Array,this.mDependencyFetch=e.dependencyFetch??null,this.mDependencyFetchResolved=!e.dependencyFetch,this.mType==="split"&&!this.mDependencyFetch)throw new A("Split token with a start and end token, need inner token definitions.",this);if(this.mType==="single"&&this.mDependencyFetch)throw new A("Pattern does not allow inner token pattern.",this);this.mPattern=this.convertTokenPattern(this.mType,e.pattern)}isSplit(){return this.mType==="split"}resolveDependencies(){this.mDependencyFetchResolved||(this.mDependencyFetch(this),this.mDependencyFetchResolved=!0)}useChildPattern(t){if(this.mLexer!==t.lexer)throw new A("Can only add dependencies of the same lexer.",this);this.mPatternDependencies.push(t)}convertTokenPattern(t,e){if("single"in e){if(t==="split")throw new A("Can't use split pattern type with single pattern definition.",this);return{start:{regex:e.single.regex,types:e.single.types,validator:e.single.validator??null}}}else{if(t==="single")throw new A("Can't use single pattern type with split pattern definition.",this);return{start:{regex:e.start.regex,types:e.start.types,validator:e.start.validator??null},end:{regex:e.end.regex,types:e.end.types,validator:e.end.validator??null},innerType:e.innerType??null}}}};var ne=class{mColumnNumber;mLineNumber;mMetas;mType;mValue;get columnNumber(){return this.mColumnNumber}get lineNumber(){return this.mLineNumber}get metas(){return[...this.mMetas]}get type(){return this.mType}get value(){return this.mValue}constructor(t,e,i,h){this.mValue=e,this.mColumnNumber=i,this.mLineNumber=h,this.mType=t,this.mMetas=new Set}addMeta(...t){for(let e of t)this.mMetas.add(e)}hasMeta(t){return this.mMetas.has(t)}};var Ee=class{mRootPattern;mSettings;get errorType(){return this.mSettings.errorType}set errorType(t){this.mSettings.errorType=t}get trimWhitespace(){return this.mSettings.trimSpaces}set trimWhitespace(t){this.mSettings.trimSpaces=t}get validWhitespaces(){return[...this.mSettings.whiteSpaces].join("")}set validWhitespaces(t){this.mSettings.whiteSpaces=new Set(t.split(""))}constructor(){this.mSettings={errorType:null,trimSpaces:!0,whiteSpaces:new Set},this.mRootPattern=new oe(this,{type:"single",pattern:{single:{regex:/^/,types:{},validator:null}},metadata:[],dependencyFetch:null})}createTokenPattern(t,e){let i=w=>typeof w=="string"?{token:w}:w,h=w=>{let C=new Set(w.flags.split(""));return new RegExp(`^(?<token>${w.source})`,[...C].join(""))},g=new Array;t.meta&&(typeof t.meta=="string"?g.push(t.meta):g.push(...t.meta));let y;return"regex"in t.pattern?y={single:{regex:h(t.pattern.regex),types:i(t.pattern.type),validator:t.pattern.validator??null}}:y={start:{regex:h(t.pattern.start.regex),types:i(t.pattern.start.type),validator:t.pattern.start.validator??null},end:{regex:h(t.pattern.end.regex),types:i(t.pattern.end.type),validator:t.pattern.end.validator??null},innerType:t.pattern.innerType??null},new oe(this,{type:"regex"in t.pattern?"single":"split",pattern:y,metadata:g,dependencyFetch:e??null})}*tokenize(t,e){let i={data:t,cursor:{position:0,column:1,line:1},error:null,progressTracker:e??null};yield*this.tokenizeRecursionLayer(i,this.mRootPattern,new Array,null)}useRootTokenPattern(t){if(t.lexer!==this)throw new A("Token pattern must be created by this lexer.",this);this.mRootPattern.useChildPattern(t)}findNextStartToken(t,e,i,h){for(let g of e){let y=g.pattern.start,w=this.matchToken(g,y,t,i,h);if(w!==null)return{pattern:g,token:w}}return null}findTokenTypeOfMatch(t,e,i){for(let y in t.groups){let w=t.groups[y],C=e[y];if(!(!w||!C)){if(w.length!==t[0].length)throw new A("A group of a token pattern must match the whole token.",this);return C}}let h=new Array;for(let y in t.groups)t.groups[y]&&h.push(y);let g=new Array;for(let y in e)g.push(y);throw new A(`No token type found for any defined pattern regex group. Full: "${t[0]}", Matches: "${h.join(", ")}", Available: "${g.join(", ")}", Regex: "${i.source}"`,this)}*generateErrorToken(t,e){if(!t.error||!this.mSettings.errorType)return;let i=new ne(this.mSettings.errorType,t.error.data,t.error.startColumn,t.error.startLine);i.addMeta(...e),t.error=null,yield i}generateToken(t,e,i,h,g,y){let w=i[0],C=this.findTokenTypeOfMatch(i,h,y),S=new ne(g??C,w,t.cursor.column,t.cursor.line);return S.addMeta(...e),S}matchToken(t,e,i,h,g){let y=e.regex;y.lastIndex=0;let w=y.exec(i.data);if(!w||w.index!==0)return null;let C=this.generateToken(i,[...h,...t.meta],w,e.types,g,y);if(e.validator){let S=i.data.substring(C.value.length);if(!e.validator(C,S,i.cursor.position))return null}return this.moveCursor(i,C.value),C}moveCursor(t,e){let i=e.split(`
`);i.length>1&&(t.cursor.column=1),t.cursor.line+=i.length-1,t.cursor.column+=i.at(-1).length,t.cursor.position+=e.length,t.data=t.data.substring(e.length),this.trackProgress(t)}pushNextCharToErrorState(t){if(!this.mSettings.errorType)throw new Jt(`Unable to parse next token. No valid pattern found for "${t.data.substring(0,20)}".`,this,t.cursor.column,t.cursor.line,t.cursor.column,t.cursor.line);t.error||(t.error={data:"",startColumn:t.cursor.column,startLine:t.cursor.line});let e=t.data.charAt(0);t.error.data+=e,this.moveCursor(t,e)}skipNextWhitespace(t){let e=t.data.charAt(0);return!this.mSettings.trimSpaces||!this.mSettings.whiteSpaces.has(e)?!1:(this.moveCursor(t,e),!0)}*tokenizeRecursionLayer(t,e,i,h){let g=e.dependencies;for(;t.data.length>0;){if(!t.error&&this.skipNextWhitespace(t))continue;if(e.isSplit()){let C=this.matchToken(e,e.pattern.end,t,i,h);if(C!==null){yield*this.generateErrorToken(t,i),yield C;return}}let y=this.findNextStartToken(t,g,i,h);if(!y){this.pushNextCharToErrorState(t);continue}yield*this.generateErrorToken(t,i),yield y.token;let w=y.pattern;w.isSplit()&&(w.resolveDependencies(),yield*this.tokenizeRecursionLayer(t,w,[...i,...w.meta],h??w.pattern.innerType))}yield*this.generateErrorToken(t,i)}trackProgress(t){t.progressTracker!==null&&t.progressTracker(t.cursor.position,t.cursor.line,t.cursor.column)}};var K=class extends Error{static PARSER_ERROR=Symbol("PARSER_ERROR");mTrace;get columnEnd(){return this.mTrace.top.range.columnEnd}get columnStart(){return this.mTrace.top.range.columnStart}get graph(){return this.mTrace.top.graph}get incidents(){return this.mTrace.incidents}get lineEnd(){return this.mTrace.top.range.lineEnd}get lineStart(){return this.mTrace.top.range.lineStart}constructor(t){super(t.top.message,{cause:t.top.cause}),this.mTrace=t}};var Ye=class{mIncidents;mTop;get incidents(){if(this.mIncidents===null)throw new A("A complete incident list is only available on debug mode.",this);return this.mIncidents}get top(){return this.mTop}constructor(t){this.mTop={message:"Unknown parser error",priority:0,graph:null,range:{lineStart:1,columnStart:1,lineEnd:1,columnEnd:1},cause:null},t?this.mIncidents=new Array:this.mIncidents=null}push(t,e,i,h,g,y,w=!1,C=null){let S;if(w?S=this.mTop.priority+1:S=g*1e4+y,this.mIncidents!==null){let l={message:t,priority:S,graph:e,range:{lineStart:i,columnStart:h,lineEnd:g,columnEnd:y},cause:C};this.mIncidents.push(l)}this.mTop&&S<this.mTop.priority||this.setTop({message:t,priority:S,graph:e,range:{lineStart:i,columnStart:h,lineEnd:g,columnEnd:y},cause:C})}setTop(t){this.mTop=t}};var We=class v{static MAX_JUNCTION_CIRCULAR_REFERENCES=1e3;mGraphStack;mIncidentTrace;mLastTokenPosition;mProcessStack;mTokenCache;mTokenGenerator;mTrimTokenCache;get currentGraph(){return this.mGraphStack.top.graph}get currentToken(){let t=this.mGraphStack.top;return this.mTokenCache[t.token.cursor]}get incidentTrace(){return this.mIncidentTrace}get processStack(){return this.mProcessStack}constructor(t,e,i){this.mTokenGenerator=t,this.mGraphStack=new jt,this.mLastTokenPosition={column:1,line:1},this.mTokenCache=new Array,this.mProcessStack=new jt,this.mTrimTokenCache=i,this.mIncidentTrace=new Ye(e),this.mGraphStack.push({graph:null,linear:!0,circularGraphs:new nt,token:{start:0,cursor:-1}})}collapse(){let t=this.mGraphStack.top,e=this.mTokenCache.slice(t.token.cursor);e.length!==0&&e.at(-1)===null&&e.pop();for(let i of this.mTokenGenerator)e.push(i);return e}getGraphBoundingToken(){let t=this.mGraphStack.top,e=this.mTokenCache[t.token.start],i=this.mTokenCache[t.token.cursor-1];return e??=i,i??=e,[e??null,i??null]}getGraphPosition(){let t=this.mGraphStack.top,e,i;if(e=this.mTokenCache[t.token.start],i=this.mTokenCache[t.token.cursor-1],e??=i,i??=e,!e||!i)return{graph:t.graph,columnEnd:this.mLastTokenPosition.column,columnStart:this.mLastTokenPosition.column,lineEnd:this.mLastTokenPosition.line,lineStart:this.mLastTokenPosition.line};let h,g;if(i.value.includes(`
`)){let y=i.value.split(`
`);g=i.lineNumber+y.length-1,h=1+y[y.length-1].length}else h=i.columnNumber+i.value.length,g=i.lineNumber;return{graph:t.graph,lineStart:e.lineNumber,columnStart:e.columnNumber,lineEnd:g,columnEnd:h}}getTokenPosition(){let t=this.mGraphStack.top,e=this.currentToken;if(!e)return{graph:t.graph,columnEnd:this.mLastTokenPosition.column,columnStart:this.mLastTokenPosition.column,lineEnd:this.mLastTokenPosition.line,lineStart:this.mLastTokenPosition.line};let i,h;if(e.value.includes(`
`)){let g=e.value.split(`
`);h=e.lineNumber+g.length-1,i=1+g[g.length-1].length}else i=e.columnNumber+e.value.length,h=e.lineNumber;return{graph:t.graph,lineStart:e.lineNumber,columnStart:e.columnNumber,lineEnd:h,columnEnd:i}}graphIsCircular(t){let e=this.mGraphStack.top;if(!e.circularGraphs.has(t))return!1;if(t.isJunction){if(e.circularGraphs.get(t)>v.MAX_JUNCTION_CIRCULAR_REFERENCES)throw new A("Junction graph called circular too often.",this);return!1}return!0}moveNextToken(){let t=this.mGraphStack.top;if(t.circularGraphs.size>0&&(t.circularGraphs=new nt),t.graph&&t.graph.isJunction)throw new A("Junction graph must not have own nodes.",this);if(t.token.cursor++,t.token.cursor<this.mTokenCache.length)return;let e=this.mTokenGenerator.next();if(e.done){this.mTokenCache.push(null);return}this.mLastTokenPosition.column=e.value.columnNumber,this.mLastTokenPosition.line=e.value.lineNumber,this.mTokenCache.push(e.value)}popGraphStack(t){let e=this.mGraphStack.pop(),i=this.mGraphStack.top;if(t&&(e.token.cursor=e.token.start),e.token.cursor!==e.token.start&&i.circularGraphs.size>0&&(i.circularGraphs=new nt),!this.mTrimTokenCache){i.token.cursor=e.token.cursor;return}e.linear?(this.mTokenCache.splice(0,e.token.cursor),i.token.start=0,i.token.cursor=0):i.token.cursor=e.token.cursor}pushGraphStack(t,e){let i=this.mGraphStack.top,h={graph:t,linear:e&&i.linear,circularGraphs:new nt(i.circularGraphs),token:{start:i.token.cursor,cursor:i.token.cursor}},g=h.circularGraphs.get(t)??0;h.circularGraphs.set(t,g+1),this.mGraphStack.push(h)}};var Ce=class v{static NODE_NULL_RESULT=Symbol("FAILED_NODE_VALUE_PARSE");static NODE_VALUE_LIST_END_MEET=Symbol("FAILED_NODE_VALUE_PARSE");mConfiguration;mLexer;mRootPart;get lexer(){return this.mLexer}constructor(t,e){this.mLexer=t,this.mRootPart=null,this.mConfiguration={keepTraceIncidents:!1,trimTokenCache:!1,...e}}parse(t,e){if(this.mRootPart===null)throw new A("Parser has not root part set.",this);let i=new We(this.mLexer.tokenize(t,e),this.mConfiguration.keepTraceIncidents,this.mConfiguration.trimTokenCache),h=(()=>{try{return this.beginParseProcess(i,this.mRootPart)}catch(y){if(y instanceof Jt)return i.incidentTrace.push(y.message,i.currentGraph,y.lineStart,y.columnStart,y.lineEnd,y.columnEnd,!0,y),K.PARSER_ERROR;let w=y instanceof Error?y.message:y.toString(),C=i.getGraphPosition();return i.incidentTrace.push(w,i.currentGraph,C.lineStart,C.columnStart,C.lineEnd,C.columnEnd,!0,y),K.PARSER_ERROR}})();if(h===K.PARSER_ERROR)throw new K(i.incidentTrace);let g=i.collapse();if(g.length!==0){let y=g[0];if(i.incidentTrace.top.range.lineEnd===1&&i.incidentTrace.top.range.columnEnd===1){let w=`Tokens could not be parsed. Graph end meet without reaching last token. Current: "${y.value}" (${y.type})`;i.incidentTrace.push(w,this.mRootPart,y.lineNumber,y.columnNumber,y.lineNumber,y.columnNumber)}throw new K(i.incidentTrace)}return h}setRootGraph(t){this.mRootPart=t}beginParseProcess(t,e){t.moveNextToken(),t.processStack.push({type:"graph-parse",parameter:{graph:e,linear:!0},state:0});let i=v.NODE_NULL_RESULT;for(;t.processStack.top;)i=this.processStack(t,t.processStack.top,i);return i}processChainedNodeParseProcess(t,e,i){switch(e.state){case 0:{let y=e.parameter.node.connections.next;return y===null?(t.processStack.pop(),{}):(e.state++,t.processStack.push({type:"node-parse",parameter:{node:y},state:0,values:{}}),v.NODE_NULL_RESULT)}case 1:{let h=i;return h===K.PARSER_ERROR?(t.processStack.pop(),K.PARSER_ERROR):(t.processStack.pop(),h)}}throw new A(`Invalid node next parse state "${e.state}".`,this)}processGraphParseProcess(t,e,i){let h=e.parameter.graph;switch(e.state){case 0:{if(t.graphIsCircular(h)){let y=t.getGraphPosition();return t.incidentTrace.push("Circular graph detected.",h,y.lineStart,y.columnStart,y.lineEnd,y.columnEnd),t.processStack.pop(),K.PARSER_ERROR}let g=e.parameter.linear;return t.pushGraphStack(h,g),e.state++,t.processStack.push({type:"node-parse",parameter:{node:h.node},state:0,values:{}}),v.NODE_NULL_RESULT}case 1:{let g=i;if(g===K.PARSER_ERROR)return t.popGraphStack(!0),t.processStack.pop(),K.PARSER_ERROR;let y=h.convert(g,t);if(typeof y=="symbol"){let w=t.getGraphPosition();return t.incidentTrace.push(y.description??"Unknown data convert error",w.graph,w.lineStart,w.columnStart,w.lineEnd,w.columnEnd),t.popGraphStack(!0),t.processStack.pop(),K.PARSER_ERROR}return t.popGraphStack(!1),t.processStack.pop(),y}}throw new A(`Invalid graph parse state "${e.state}".`,this)}processNodeParseProcess(t,e,i){let h=e.parameter.node;switch(e.state){case 0:return t.processStack.push({type:"node-value-parse",parameter:{node:h,valueIndex:0},state:0,values:{}}),e.state++,v.NODE_NULL_RESULT;case 1:{let g=i;return g===K.PARSER_ERROR?(t.processStack.pop(),K.PARSER_ERROR):(e.values.nodeValueResult=g,t.processStack.push({type:"node-next-parse",parameter:{node:h},state:0}),e.state++,v.NODE_NULL_RESULT)}case 2:{let g=i;if(g===K.PARSER_ERROR)return t.processStack.pop(),K.PARSER_ERROR;let y=h.mergeData(e.values.nodeValueResult,g);return t.processStack.pop(),y}}throw new A(`Invalid node parse state "${e.state}".`,this)}processNodeValueParseProcess(t,e,i){let h=e.parameter.node;switch(e.state){case 0:{if(i!==v.NODE_NULL_RESULT&&i!==K.PARSER_ERROR)return e.values.parseResult=i,e.state++,v.NODE_NULL_RESULT;let g=e.parameter.valueIndex,y=h.connections;if(g>=y.values.length)return e.values.parseResult=v.NODE_VALUE_LIST_END_MEET,e.state++,v.NODE_NULL_RESULT;e.parameter.valueIndex++;let w=t.currentToken,C=y.values[g];if(typeof C=="string"){if(!w){if(y.required){let S=t.getTokenPosition();t.incidentTrace.push(`Unexpected end of statement. Token "${C}" expected.`,t.currentGraph,S.lineStart,S.columnStart,S.lineEnd,S.columnEnd)}return v.NODE_NULL_RESULT}if(C!==w.type){if(y.required){let S=t.getTokenPosition();t.incidentTrace.push(`Unexpected token "${w.value}". "${C}" expected`,t.currentGraph,S.lineStart,S.columnStart,S.lineEnd,S.columnEnd)}return v.NODE_NULL_RESULT}return t.moveNextToken(),w.value}else{let S=y.values.length===1||y.values.length===g+1;return t.processStack.push({type:"graph-parse",parameter:{graph:C,linear:S},state:0}),v.NODE_NULL_RESULT}}case 1:{let g=e.values.parseResult,y=h.connections;if(g===v.NODE_VALUE_LIST_END_MEET&&!y.required){t.processStack.pop();return}return g===v.NODE_VALUE_LIST_END_MEET?(t.processStack.pop(),K.PARSER_ERROR):(t.processStack.pop(),g)}}throw new A(`Invalid node value parse state "${e.state}".`,this)}processStack(t,e,i){switch(e.type){case"graph-parse":return this.processGraphParseProcess(t,e,i);case"node-parse":return this.processNodeParseProcess(t,e,i);case"node-value-parse":return this.processNodeValueParseProcess(t,e,i);case"node-next-parse":return this.processChainedNodeParseProcess(t,e,i)}}};var et=class v{static define(t,e=!1){return new v(t,e)}mDataConverterList;mGraphCollector;mIsJunction;mResolvedGraphNode;get isJunction(){return this.mIsJunction}get node(){return this.mResolvedGraphNode||(this.mResolvedGraphNode=this.mGraphCollector().root),this.mResolvedGraphNode}constructor(t,e){this.mGraphCollector=t,this.mDataConverterList=new Array,this.mResolvedGraphNode=null,this.mIsJunction=e}convert(t,e){if(this.mDataConverterList.length===0)return t;let i=e.getGraphBoundingToken(),h=i[0]??void 0,g=i[1]??void 0;if(this.mDataConverterList.length===1)return this.mDataConverterList[0](t,h,g);let y=t;for(let w of this.mDataConverterList)if(y=w(y,h,g),typeof y=="symbol")return y;return y}converter(t){let e=new v(this.mGraphCollector,this.isJunction);return e.mDataConverterList.push(...this.mDataConverterList,t),e}};var Y=class v{static new(){let t=new v("",!1,[]);return t.mRootNode=null,t}mConnections;mIdentifier;mRootNode;get configuration(){return{dataKey:this.mIdentifier.dataKey,isList:this.mIdentifier.type==="list",isRequired:this.mConnections.required,isBranch:this.mConnections.values.length>1}}get connections(){return this.mConnections}get root(){if(!this.mRootNode)throw new A("Staring nodes must be chained with another node to be used.",this);return this.mRootNode}constructor(t,e,i,h){if(t==="")this.mIdentifier={type:"empty",dataKey:"",mergeKey:""};else if(t.endsWith("[]"))this.mIdentifier={type:"list",mergeKey:"",dataKey:t.substring(0,t.length-2)};else if(t.includes("<-")){let y=t.split("<-");this.mIdentifier={type:"merge",dataKey:y[0],mergeKey:y[1]}}else this.mIdentifier={type:"single",mergeKey:"",dataKey:t};let g=i.map(y=>y instanceof v?et.define(()=>y):y);this.mConnections={required:e,values:g,next:null},h?this.mRootNode=h:this.mRootNode=this}mergeData(t,e){if(this.mIdentifier.type==="empty")return e;let i=e,h=typeof t>"u";if(this.mIdentifier.type==="single"){if(this.mIdentifier.dataKey in e)throw new A(`Graph path has a duplicate value identifier "${this.mIdentifier.dataKey}"`,this);return h||(i[this.mIdentifier.dataKey]=t),e}if(this.mIdentifier.type==="list"){let w;h?w=new Array:Array.isArray(t)?w=t:w=[t];let C=(()=>{if(this.mIdentifier.dataKey in e){let S=i[this.mIdentifier.dataKey];return Array.isArray(S)?(S.unshift(...w),S):(w.push(S),w)}return w})();return i[this.mIdentifier.dataKey]=C,e}if(h)return e;let g=(()=>{if(!this.mIdentifier.mergeKey)throw new A("Cant merge data without a merge key.",this);if(typeof t!="object"||t===null)throw new A("Node data must be an object when merge key is set.",this);if(!(this.mIdentifier.mergeKey in t))throw new A(`Node data does not contain merge key "${this.mIdentifier.mergeKey}"`,this);return t[this.mIdentifier.mergeKey]})();if(typeof g>"u")return e;let y=i[this.mIdentifier.dataKey];if(typeof y>"u")return i[this.mIdentifier.dataKey]=g,i;if(!Array.isArray(y))throw new A("Chain data merge value is not an array but should be.",this);return Array.isArray(g)?y.unshift(...g):y.unshift(g),e}optional(t,e){let i=typeof e>"u"?"":t,h=typeof e>"u"?t:e,g=new Array;Array.isArray(h)?g.push(...h):g.push(h);let y=new v(i,!1,g,this.mRootNode);return this.setChainedNode(y),y}required(t,e){let i=typeof e>"u"?"":t,h=typeof e>"u"?t:e,g=new Array;Array.isArray(h)?g.push(...h):g.push(h);let y=new v(i,!0,g,this.mRootNode);return this.setChainedNode(y),y}setChainedNode(t){if(this.mConnections.next!==null)throw new A("Node can only be chained to a single node.",this);this.mConnections.next=t}};var j={XmlIdentifier:"Identifier",XmlAssignment:"XmlAssignment",XmlValue:"XmlValue",XmlComment:"XmlComment",XmlOpenClosingBracket:"XmlOpenClosingBracket",XmlCloseBracket:"XmlCloseBracket",XmlOpenBracket:"XmlOpenBracket",XmlCloseClosingBracket:"XmlCloseClosingBracket",XmlExplicitValueIdentifier:"XmlExplicitValueIdentifier",ExpressionStart:"ExpressionStart",ExpressionEnd:"ExpressionEnd",ExpressionValue:"ExpressionValue",InstructionStart:"InstructionStart",InstructionInstructionValue:"InstructionInstructionValue",InstructionBodyStartBraket:"InstructionBodyStartBraket",InstructionBodyCloseBraket:"InstructionBodyCloseBraket",InstructionInstructionClosingBracket:"InstructionInstructionClosingBracket",InstructionInstructionOpeningBracket:"InstructionInstructionOpeningBracket"};var Ze=class extends Ee{constructor(){super(),this.validWhitespaces=` 
\r`,this.trimWhitespace=!0;let t=this.createTokenPattern({pattern:{regex:/(?:(?!}}).)*/,type:j.ExpressionValue}}),e=this.createTokenPattern({pattern:{start:{regex:/{{/,type:j.ExpressionStart},end:{regex:/}}[ \n\r]?/,type:j.ExpressionEnd}}},s=>{s.useChildPattern(t)}),i=this.createTokenPattern({pattern:{regex:/[^>\s\n="/]+/,type:j.XmlIdentifier}}),h=this.createTokenPattern({pattern:{regex:/(?:(?!{{|"|<).)+/,type:j.XmlValue}}),g=this.createTokenPattern({pattern:{regex:/<!--.*?-->/,type:j.XmlComment}}),y=this.createTokenPattern({pattern:{regex:/=/,type:j.XmlAssignment}}),w=this.createTokenPattern({pattern:{start:{regex:/"/,type:j.XmlExplicitValueIdentifier},end:{regex:/"/,type:j.XmlExplicitValueIdentifier}}},s=>{s.useChildPattern(e),s.useChildPattern(h)}),C=this.createTokenPattern({pattern:{start:{regex:/<\//,type:j.XmlOpenClosingBracket},end:{regex:/>/,type:j.XmlCloseBracket}}},s=>{s.useChildPattern(i)}),S=this.createTokenPattern({pattern:{start:{regex:/</,type:j.XmlOpenBracket},end:{regex:/(?<closeClosingBracket>\/>)|(?<closeBracket>>)/,type:{closeClosingBracket:j.XmlCloseClosingBracket,closeBracket:j.XmlCloseBracket}}}},s=>{s.useChildPattern(y),s.useChildPattern(i),s.useChildPattern(w)}),l=this.createTokenPattern({pattern:{regex:/[^()"'`/)]+/,type:j.InstructionInstructionValue}}),o=this.createTokenPattern({pattern:{innerType:j.InstructionInstructionValue,start:{regex:/\//,type:j.InstructionInstructionValue},end:{regex:/\//,type:j.InstructionInstructionValue}}},s=>{s.useChildPattern(c),s.useChildPattern(r),s.useChildPattern(b),s.useChildPattern(u),s.useChildPattern(l)}),u=this.createTokenPattern({pattern:{innerType:j.InstructionInstructionValue,start:{regex:/\(/,type:j.InstructionInstructionValue},end:{regex:/\)/,type:j.InstructionInstructionValue}}},s=>{s.useChildPattern(o),s.useChildPattern(c),s.useChildPattern(r),s.useChildPattern(b),s.useChildPattern(l)}),c=this.createTokenPattern({pattern:{innerType:j.InstructionInstructionValue,start:{regex:/"/,type:j.InstructionInstructionValue},end:{regex:/"/,type:j.InstructionInstructionValue}}},s=>{s.useChildPattern(o),s.useChildPattern(r),s.useChildPattern(b),s.useChildPattern(u),s.useChildPattern(l)}),r=this.createTokenPattern({pattern:{innerType:j.InstructionInstructionValue,start:{regex:/'/,type:j.InstructionInstructionValue},end:{regex:/'/,type:j.InstructionInstructionValue}}},s=>{s.useChildPattern(o),s.useChildPattern(c),s.useChildPattern(b),s.useChildPattern(u),s.useChildPattern(l)}),b=this.createTokenPattern({pattern:{innerType:j.InstructionInstructionValue,start:{regex:/`/,type:j.InstructionInstructionValue},end:{regex:/`/,type:j.InstructionInstructionValue}}},s=>{s.useChildPattern(o),s.useChildPattern(c),s.useChildPattern(r),s.useChildPattern(u),s.useChildPattern(l)}),d=this.createTokenPattern({pattern:{regex:/\$[^(\s\n/{]+/,type:j.InstructionStart}}),T=this.createTokenPattern({pattern:{start:{regex:/\(/,type:j.InstructionInstructionOpeningBracket},end:{regex:/\)/,type:j.InstructionInstructionClosingBracket}}},s=>{s.useChildPattern(o),s.useChildPattern(c),s.useChildPattern(r),s.useChildPattern(b),s.useChildPattern(u),s.useChildPattern(l)}),x=this.createTokenPattern({pattern:{start:{regex:/{/,type:j.InstructionBodyStartBraket},end:{regex:/}/,type:j.InstructionBodyCloseBraket}}},s=>{for(let f of m)s.useChildPattern(f)}),m=[g,C,S,w,e,d,T,x,h];for(let s of m)this.useRootTokenPattern(s)}};var Pe=class extends Ce{constructor(){super(new Ze),this.initGraph()}initGraph(){let t=et.define(()=>Y.new().required(j.ExpressionStart).optional("value",j.ExpressionValue).required("end",j.ExpressionEnd)).converter(r=>({expression:new Nt(r.value??""),hasTrailingWhitespace:r.end.length>2})),e=et.define(()=>{let r=e;return Y.new().required("data[]",Y.new().required("value",[t,Y.new().required("text",j.XmlValue)])).optional("data<-data",r)}),i=et.define(()=>Y.new().required("name",j.XmlIdentifier).optional("attributeValue",Y.new().required(j.XmlAssignment).required(j.XmlExplicitValueIdentifier).optional("list<-data",e).required(j.XmlExplicitValueIdentifier))).converter(r=>{let b=new Array;if(r.attributeValue?.list)for(let d of r.attributeValue.list)"expression"in d.value?(b.push(d.value.expression),d.value.hasTrailingWhitespace&&b.push(" ")):b.push(d.value.text);return{name:r.name,values:b}}),h=et.define(()=>{let r=h;return Y.new().required("data[]",i).optional("data<-data",r)}),g=et.define(()=>{let r=g;return Y.new().required("data[]",Y.new().required("value",[t,Y.new().required("text",j.XmlValue),Y.new().required(j.XmlExplicitValueIdentifier).required("text",j.XmlValue).required(j.XmlExplicitValueIdentifier)])).optional("data<-data",r)}),y=et.define(()=>Y.new().required("list<-data",g)).converter(r=>{let b=new Lt;for(let d of r.list)"expression"in d.value?(b.addValue(d.value.expression),d.value.hasTrailingWhitespace&&b.addValue(" ")):b.addValue(d.value.text);return b}),w=et.define(()=>Y.new().required(j.XmlComment)).converter(()=>null),C=et.define(()=>Y.new().required(j.XmlOpenBracket).required("openingTagName",j.XmlIdentifier).optional("attributes<-data",h).required("closing",[Y.new().required(j.XmlCloseClosingBracket),Y.new().required(j.XmlCloseBracket).required("values",u).required(j.XmlOpenClosingBracket).required("closingTageName",j.XmlIdentifier).required(j.XmlCloseBracket)])).converter(r=>{if("closingTageName"in r.closing&&r.openingTagName!==r.closing.closingTageName)throw new A(`Opening (${r.openingTagName}) and closing tagname (${r.closing.closingTageName}) does not match`,this);let b=new Rt(r.openingTagName);if(r.attributes)for(let d of r.attributes)b.setAttribute(d.name).addValue(...d.values);return"values"in r.closing&&b.appendChild(...r.closing.values),b}),S=et.define(()=>{let r=S;return Y.new().required("list[]",j.InstructionInstructionValue).optional("list<-list",r)}),l=et.define(()=>Y.new().required("instructionName",j.InstructionStart).optional("instruction",Y.new().required(j.InstructionInstructionOpeningBracket).required("value<-list",S).required(j.InstructionInstructionClosingBracket)).optional("body",Y.new().required(j.InstructionBodyStartBraket).required("value",u).required(j.InstructionBodyCloseBraket))).converter(r=>{let b=r.instructionName.substring(1),d=r.instruction?.value.join("")??"",T=new qt(b,d);return r.body&&T.appendChild(...r.body.value),T}),o=et.define(()=>{let r=o;return Y.new().required("list[]",[w,C,l,y]).optional("list<-list",r)}),u=et.define(()=>{let r=o;return Y.new().optional("list<-list",r)}).converter(r=>{let b=new Array;if(r.list)for(let d of r.list)d!==null&&b.push(d);return b}),c=et.define(()=>Y.new().required("content",u)).converter(r=>{let b=new mt;return b.appendChild(...r.content),b});this.setRootGraph(c)}};var U=class v extends $e{static mTemplateCache=new nt;static mXmlParser=new Pe;mComponentElement;mIsUpdated;mRootBuilder;get element(){return this.mComponentElement.htmlElement}constructor(t){super({constructor:t.processorConstructor,parent:null}),k.registerComponent(this,t.htmlElement),this.setProcessorInjection(v,this),this.addConstructionHook(h=>{k.registerComponent(this,this.mComponentElement.htmlElement,h)}),v.mTemplateCache.has(t.processorConstructor)||v.mTemplateCache.set(t.processorConstructor,v.mXmlParser.parse(t.templateString??""));let e=v.mTemplateCache.get(t.processorConstructor).clone();this.mIsUpdated=!1,this.mComponentElement=new De(t.htmlElement),this.mRootBuilder=new re(e,new Xe(this,t.expressionModule),new gt(this),"ROOT",null),this.mComponentElement.shadowRoot.appendChild(this.mRootBuilder.anchor),this.setProcessorInjection(_t,new _t(this.mRootBuilder.values));let i=this.updater.zone.getAttachment(Pt.ATTACHMENT_KEY);if(i)for(let[h,g]of i.injections)this.setProcessorInjection(h,g)}addStyle(t){let e=document.createElement("style");e.innerHTML=t,this.mComponentElement.shadowRoot.prepend(e)}attributeChanged(t,e,i){this.call("onAttributeChange",t,e,i)}connected(){this.mIsUpdated||this.updater.update(),this.call("onConnect")}deconstruct(){this.call("onDeconstruct"),this.mRootBuilder.deconstruct(),super.deconstruct()}disconnected(){this.call("onDisconnect")}onUpdate(){return this.mIsUpdated||(this.mIsUpdated=!0),this.mRootBuilder.update()?(this.call("onUpdate"),!0):!1}};function $(v){return(t,e)=>{F.registerInjectable(t,e.metadata,"instanced"),k.registerConstructor(t,v.selector);let i=class extends HTMLElement{static formAssociated=!0;mComponent;constructor(){super(),this.mComponent=new U({processorConstructor:t,templateString:v.template??null,expressionModule:v.expressionmodule,htmlElement:this}).setup(),v.style&&this.mComponent.addStyle(v.style)}connectedCallback(){this.mComponent.connected()}disconnectedCallback(){this.mComponent.disconnected()}};globalThis.customElements.define(v.selector,i)}}function Kt(v){return(t,e)=>{F.registerInjectable(t,e.metadata,"instanced"),ft.register($t,t,{access:v.access,targetRestrictions:v.targetRestrictions})}}function yt(v){return(t,e)=>{F.registerInjectable(t,e.metadata,"instanced"),ft.register(Ct,t,{access:v.access,selector:v.selector})}}function Ot(v){return(t,e)=>{F.registerInjectable(t,e.metadata,"instanced"),ft.register(Xt,t,{instructionType:v.instructionType})}}function yc(){function v(l,o){return function(c){e(o,"addInitializer"),i(c,"An initializer"),l.push(c)}}function t(l,o,u,c,r,b,d,T,x){var m;switch(r){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var s={kind:m,name:d?"#"+o:o,static:b,private:d,metadata:T},f={v:!1};s.addInitializer=v(c,f);var n,a;if(r===0?d?(n=u.get,a=u.set):(n=function(){return this[o]},a=function(p){this[o]=p}):r===2?n=function(){return u.value}:((r===1||r===3)&&(n=function(){return u.get.call(this)}),(r===1||r===4)&&(a=function(p){u.set.call(this,p)})),d)s.access=n&&a?{get:n,set:a}:n?{get:n}:{set:a};else{if(n){var P=n;n=function(p){return arguments.length===0&&(p=this),P.call(p)}}if(a){var _=a;a=function(p,M){return arguments.length===1&&(M=p,p=this),_.call(p,M)}}var D=function(p){return o in p};s.access=n&&a?{has:D,get:n,set:a}:n?{has:D,get:n}:{has:D,set:a}}try{return l(x,s)}finally{f.v=!0}}function e(l,o){if(l.v)throw new Error("attempted to call "+o+" after decoration was finished")}function i(l,o){if(typeof l!="function")throw new TypeError(o+" must be a function")}function h(l,o){var u=typeof o;if(l===1){if(u!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&i(o.get,"accessor.get"),o.set!==void 0&&i(o.set,"accessor.set"),o.init!==void 0&&i(o.init,"accessor.init")}else if(u!=="function"){var c;throw l===0?c="field":l===10?c="class":c="method",new TypeError(c+" decorators must return a function or void 0")}}function g(l,o,u,c,r,b,d,T,x){var m=u[0],s,f,n;d?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,c)),r===1?n={get:s.get,set:s.set}:r===2?n=s.value:r===3?n=s.get:r===4&&(n=s.set);var a,P,_;if(typeof m=="function")a=t(m,c,s,T,r,b,d,x,n),a!==void 0&&(h(r,a),r===0?f=a:r===1?(f=a.init,P=a.get||n.get,_=a.set||n.set,n={get:P,set:_}):n=a);else for(var D=m.length-1;D>=0;D--){var p=m[D];if(a=t(p,c,s,T,r,b,d,x,n),a!==void 0){h(r,a);var M;r===0?M=a:r===1?(M=a.init,P=a.get||n.get,_=a.set||n.set,n={get:P,set:_}):n=a,M!==void 0&&(f===void 0?f=M:typeof f=="function"?f=[f,M]:f.push(M))}}if(r===0||r===1){if(f===void 0)f=function(I,E){return E};else if(typeof f!="function"){var O=f;f=function(I,E){for(var N=E,L=0;L<O.length;L++)N=O[L].call(I,N);return N}}else{var z=f;f=function(I,E){return z.call(I,E)}}l.push(f)}r!==0&&(r===1?(s.get=n.get,s.set=n.set):r===2?s.value=n:r===3?s.get=n:r===4&&(s.set=n),d?r===1?(l.push(function(I,E){return n.get.call(I,E)}),l.push(function(I,E){return n.set.call(I,E)})):r===2?l.push(n):l.push(function(I,E){return n.call(I,E)}):Object.defineProperty(o,c,s))}function y(l,o,u){for(var c=[],r,b,d=new Map,T=new Map,x=0;x<o.length;x++){var m=o[x];if(Array.isArray(m)){var s=m[1],f=m[2],n=m.length>3,a=s>=5,P,_;if(a?(P=l,s=s-5,b=b||[],_=b):(P=l.prototype,r=r||[],_=r),s!==0&&!n){var D=a?T:d,p=D.get(f)||0;if(p===!0||p===3&&s!==4||p===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!p&&s>2?D.set(f,s):D.set(f,!0)}g(c,P,m,f,s,a,n,_,u)}}return w(c,r),w(c,b),c}function w(l,o){o&&l.push(function(u){for(var c=0;c<o.length;c++)o[c].call(u);return u})}function C(l,o,u){if(o.length>0){for(var c=[],r=l,b=l.name,d=o.length-1;d>=0;d--){var T={v:!1};try{var x=o[d](r,{kind:"class",name:b,addInitializer:v(c,T),metadata:u})}finally{T.v=!0}x!==void 0&&(h(10,x),r=x)}return[S(r,u),function(){for(var m=0;m<c.length;m++)c[m].call(r)}]}}function S(l,o){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,u,c,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var d=Object.create(b===void 0?null:b),T=y(o,u,d);return c.length||S(o,d),{e:T,get c(){return C(o,c,d)}}}}function Zr(v,t,e,i){return(Zr=yc())(v,t,e,i)}function bc(v){return v}var qr,Wr,_e;qr=Kt({access:Z.Read,targetRestrictions:[U]});new class extends bc{constructor(){super(_e),Wr()}static{class v{static{({c:[_e,Wr]}=Zr(this,[],[qr]))}static METADATA_USER_EVENT_LISTENER_PROPERIES="pwb:user_event_listener_properties";mEventListenerList;mTargetElement;constructor(e=F.use(U)){let i=new Array,h=e.processorConstructor;do{let g=ct.get(h).getMetadata(v.METADATA_USER_EVENT_LISTENER_PROPERIES);if(g)for(let y of g)i.push(y)}while(h=Object.getPrototypeOf(h));this.mEventListenerList=new Array,this.mTargetElement=e.element;for(let g of i){let[y,w]=g,C=Reflect.get(e.processor,y);C=C.bind(e.processor),this.mEventListenerList.push([w,C]),this.mTargetElement.addEventListener(w,C)}}onDeconstruct(){for(let e of this.mEventListenerList){let[i,h]=e;this.mTargetElement.removeEventListener(i,h)}}}}};var Ie=class extends window.Event{mValue;get value(){return this.mValue}constructor(t,e){super(t),this.mValue=e}};var Me=class{mElement;mEventName;constructor(t,e){this.mEventName=t,this.mElement=e}dispatchEvent(t){let e=new Ie(this.mEventName,t);this.mElement.dispatchEvent(e)}};function tt(v){return(t,e)=>{if(e.static)throw new A("Event target is not for a static property.",tt);let i=new WeakMap;return{get(){if(!i.has(this)){let h=(()=>{try{return k.ofProcessor(this).component}catch{throw new A("PwbComponentEvent target class is not a component.",this)}})();i.set(this,new Me(v,h.element))}return i.get(this)}}}}function wc(){function v(l,o){return function(c){e(o,"addInitializer"),i(c,"An initializer"),l.push(c)}}function t(l,o,u,c,r,b,d,T,x){var m;switch(r){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var s={kind:m,name:d?"#"+o:o,static:b,private:d,metadata:T},f={v:!1};s.addInitializer=v(c,f);var n,a;if(r===0?d?(n=u.get,a=u.set):(n=function(){return this[o]},a=function(p){this[o]=p}):r===2?n=function(){return u.value}:((r===1||r===3)&&(n=function(){return u.get.call(this)}),(r===1||r===4)&&(a=function(p){u.set.call(this,p)})),d)s.access=n&&a?{get:n,set:a}:n?{get:n}:{set:a};else{if(n){var P=n;n=function(p){return arguments.length===0&&(p=this),P.call(p)}}if(a){var _=a;a=function(p,M){return arguments.length===1&&(M=p,p=this),_.call(p,M)}}var D=function(p){return o in p};s.access=n&&a?{has:D,get:n,set:a}:n?{has:D,get:n}:{has:D,set:a}}try{return l(x,s)}finally{f.v=!0}}function e(l,o){if(l.v)throw new Error("attempted to call "+o+" after decoration was finished")}function i(l,o){if(typeof l!="function")throw new TypeError(o+" must be a function")}function h(l,o){var u=typeof o;if(l===1){if(u!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&i(o.get,"accessor.get"),o.set!==void 0&&i(o.set,"accessor.set"),o.init!==void 0&&i(o.init,"accessor.init")}else if(u!=="function"){var c;throw l===0?c="field":l===10?c="class":c="method",new TypeError(c+" decorators must return a function or void 0")}}function g(l,o,u,c,r,b,d,T,x){var m=u[0],s,f,n;d?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,c)),r===1?n={get:s.get,set:s.set}:r===2?n=s.value:r===3?n=s.get:r===4&&(n=s.set);var a,P,_;if(typeof m=="function")a=t(m,c,s,T,r,b,d,x,n),a!==void 0&&(h(r,a),r===0?f=a:r===1?(f=a.init,P=a.get||n.get,_=a.set||n.set,n={get:P,set:_}):n=a);else for(var D=m.length-1;D>=0;D--){var p=m[D];if(a=t(p,c,s,T,r,b,d,x,n),a!==void 0){h(r,a);var M;r===0?M=a:r===1?(M=a.init,P=a.get||n.get,_=a.set||n.set,n={get:P,set:_}):n=a,M!==void 0&&(f===void 0?f=M:typeof f=="function"?f=[f,M]:f.push(M))}}if(r===0||r===1){if(f===void 0)f=function(I,E){return E};else if(typeof f!="function"){var O=f;f=function(I,E){for(var N=E,L=0;L<O.length;L++)N=O[L].call(I,N);return N}}else{var z=f;f=function(I,E){return z.call(I,E)}}l.push(f)}r!==0&&(r===1?(s.get=n.get,s.set=n.set):r===2?s.value=n:r===3?s.get=n:r===4&&(s.set=n),d?r===1?(l.push(function(I,E){return n.get.call(I,E)}),l.push(function(I,E){return n.set.call(I,E)})):r===2?l.push(n):l.push(function(I,E){return n.call(I,E)}):Object.defineProperty(o,c,s))}function y(l,o,u){for(var c=[],r,b,d=new Map,T=new Map,x=0;x<o.length;x++){var m=o[x];if(Array.isArray(m)){var s=m[1],f=m[2],n=m.length>3,a=s>=5,P,_;if(a?(P=l,s=s-5,b=b||[],_=b):(P=l.prototype,r=r||[],_=r),s!==0&&!n){var D=a?T:d,p=D.get(f)||0;if(p===!0||p===3&&s!==4||p===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!p&&s>2?D.set(f,s):D.set(f,!0)}g(c,P,m,f,s,a,n,_,u)}}return w(c,r),w(c,b),c}function w(l,o){o&&l.push(function(u){for(var c=0;c<o.length;c++)o[c].call(u);return u})}function C(l,o,u){if(o.length>0){for(var c=[],r=l,b=l.name,d=o.length-1;d>=0;d--){var T={v:!1};try{var x=o[d](r,{kind:"class",name:b,addInitializer:v(c,T),metadata:u})}finally{T.v=!0}x!==void 0&&(h(10,x),r=x)}return[S(r,u),function(){for(var m=0;m<c.length;m++)c[m].call(r)}]}}function S(l,o){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,u,c,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var d=Object.create(b===void 0?null:b),T=y(o,u,d);return c.length||S(o,d),{e:T,get c(){return C(o,c,d)}}}}function Kr(v,t,e,i){return(Kr=wc())(v,t,e,i)}function xc(v){return v}var Qr,Jr,Se;Qr=Kt({access:Z.ReadWrite,targetRestrictions:[U]});new class extends xc{constructor(){super(Se),Jr()}static{class v{static{({c:[Se,Jr]}=Kr(this,[],[Qr]))}static METADATA_EXPORTED_PROPERTIES="pwb:exported_properties";mComponent;constructor(e=F.use(U)){this.mComponent=e;let i=new Map,h=e.processorConstructor;do{let g=ct.get(h).getMetadata(v.METADATA_EXPORTED_PROPERTIES);if(g)for(let y of g)i.set(y.attributeName,y.propertyName)}while(h=Object.getPrototypeOf(h));i.size>0&&this.connectExportedProperties(i)}connectExportedProperties(e){let i=this.patchHtmlAttributes(e);this.exportPropertyAsAttribute(e,i)}exportPropertyAsAttribute(e,i){for(let[h,g]of e){let y={};y.enumerable=!0,y.configurable=!0,delete y.value,delete y.writable,y.set=w=>{Reflect.set(this.mComponent.processor,g,w),i.setAttribute(h,w)},y.get=()=>{let w=Reflect.get(this.mComponent.processor,g);return typeof w=="function"&&(w=w.bind(this.mComponent.processor)),w},Object.defineProperty(this.mComponent.element,g,y)}}patchHtmlAttributes(e){let i=this.mComponent.element,h=new Set,g=(()=>{let C=i.getAttribute,S=i.setAttribute;return{getAttribute:l=>C.call(i,l),setAttribute:(l,o)=>{let u=o?.toString()??"";S.call(i,l,u),e.has(l)&&h.add(l)}}})(),y=(C,S,l)=>{let o=e.get(C);return Reflect.set(this.mComponent.processor,o,l),this.mComponent.attributeChanged(C,S,l),!0};new MutationObserver(C=>{for(let S of C){let l=S.attributeName;h.has(l)||y(l,S.oldValue,g.getAttribute(l))}h.clear()}).observe(i,{attributeFilter:[...e.keys()],attributeOldValue:!0});for(let C of e.keys())if(i.hasAttribute(C)){let S=g.getAttribute(C);y(C,S,S)}return i.setAttribute=(C,S)=>{let l=g.getAttribute(C);g.setAttribute(C,S),e.has(C)&&y(C,l,S)},i.getAttribute=C=>e.has(C)?Reflect.get(i,e.get(C)):g.getAttribute(C),g}}}};function B(v){return(t,e)=>{if(e.static)throw new A("Event target is not for a static property.",B);let i=ct.forInternalDecorator(e.metadata),h=i.getMetadata(Se.METADATA_EXPORTED_PROPERTIES)??new Array;h.push({propertyName:e.name,attributeName:v??e.name}),i.setMetadata(Se.METADATA_EXPORTED_PROPERTIES,h)}}function bt(v){return(t,e)=>{if(e.static)throw new A("Child decorator is not for a static property.",bt);return{get(){let g=(()=>{try{return k.ofProcessor(this).component}catch{throw new A("PwbChild target class is not a component.",this)}})().getProcessorInjection(_t).data.store[v];return g instanceof Element?g:null}}}}function Tc(){function v(l,o){return function(c){e(o,"addInitializer"),i(c,"An initializer"),l.push(c)}}function t(l,o,u,c,r,b,d,T,x){var m;switch(r){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var s={kind:m,name:d?"#"+o:o,static:b,private:d,metadata:T},f={v:!1};s.addInitializer=v(c,f);var n,a;if(r===0?d?(n=u.get,a=u.set):(n=function(){return this[o]},a=function(p){this[o]=p}):r===2?n=function(){return u.value}:((r===1||r===3)&&(n=function(){return u.get.call(this)}),(r===1||r===4)&&(a=function(p){u.set.call(this,p)})),d)s.access=n&&a?{get:n,set:a}:n?{get:n}:{set:a};else{if(n){var P=n;n=function(p){return arguments.length===0&&(p=this),P.call(p)}}if(a){var _=a;a=function(p,M){return arguments.length===1&&(M=p,p=this),_.call(p,M)}}var D=function(p){return o in p};s.access=n&&a?{has:D,get:n,set:a}:n?{has:D,get:n}:{has:D,set:a}}try{return l(x,s)}finally{f.v=!0}}function e(l,o){if(l.v)throw new Error("attempted to call "+o+" after decoration was finished")}function i(l,o){if(typeof l!="function")throw new TypeError(o+" must be a function")}function h(l,o){var u=typeof o;if(l===1){if(u!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&i(o.get,"accessor.get"),o.set!==void 0&&i(o.set,"accessor.set"),o.init!==void 0&&i(o.init,"accessor.init")}else if(u!=="function"){var c;throw l===0?c="field":l===10?c="class":c="method",new TypeError(c+" decorators must return a function or void 0")}}function g(l,o,u,c,r,b,d,T,x){var m=u[0],s,f,n;d?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,c)),r===1?n={get:s.get,set:s.set}:r===2?n=s.value:r===3?n=s.get:r===4&&(n=s.set);var a,P,_;if(typeof m=="function")a=t(m,c,s,T,r,b,d,x,n),a!==void 0&&(h(r,a),r===0?f=a:r===1?(f=a.init,P=a.get||n.get,_=a.set||n.set,n={get:P,set:_}):n=a);else for(var D=m.length-1;D>=0;D--){var p=m[D];if(a=t(p,c,s,T,r,b,d,x,n),a!==void 0){h(r,a);var M;r===0?M=a:r===1?(M=a.init,P=a.get||n.get,_=a.set||n.set,n={get:P,set:_}):n=a,M!==void 0&&(f===void 0?f=M:typeof f=="function"?f=[f,M]:f.push(M))}}if(r===0||r===1){if(f===void 0)f=function(I,E){return E};else if(typeof f!="function"){var O=f;f=function(I,E){for(var N=E,L=0;L<O.length;L++)N=O[L].call(I,N);return N}}else{var z=f;f=function(I,E){return z.call(I,E)}}l.push(f)}r!==0&&(r===1?(s.get=n.get,s.set=n.set):r===2?s.value=n:r===3?s.get=n:r===4&&(s.set=n),d?r===1?(l.push(function(I,E){return n.get.call(I,E)}),l.push(function(I,E){return n.set.call(I,E)})):r===2?l.push(n):l.push(function(I,E){return n.call(I,E)}):Object.defineProperty(o,c,s))}function y(l,o,u){for(var c=[],r,b,d=new Map,T=new Map,x=0;x<o.length;x++){var m=o[x];if(Array.isArray(m)){var s=m[1],f=m[2],n=m.length>3,a=s>=5,P,_;if(a?(P=l,s=s-5,b=b||[],_=b):(P=l.prototype,r=r||[],_=r),s!==0&&!n){var D=a?T:d,p=D.get(f)||0;if(p===!0||p===3&&s!==4||p===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!p&&s>2?D.set(f,s):D.set(f,!0)}g(c,P,m,f,s,a,n,_,u)}}return w(c,r),w(c,b),c}function w(l,o){o&&l.push(function(u){for(var c=0;c<o.length;c++)o[c].call(u);return u})}function C(l,o,u){if(o.length>0){for(var c=[],r=l,b=l.name,d=o.length-1;d>=0;d--){var T={v:!1};try{var x=o[d](r,{kind:"class",name:b,addInitializer:v(c,T),metadata:u})}finally{T.v=!0}x!==void 0&&(h(10,x),r=x)}return[S(r,u),function(){for(var m=0;m<c.length;m++)c[m].call(r)}]}}function S(l,o){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,u,c,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var d=Object.create(b===void 0?null:b),T=y(o,u,d);return c.length||S(o,d),{e:T,get c(){return C(o,c,d)}}}}function eo(v,t,e,i){return(eo=Tc())(v,t,e,i)}var ro,kr,Dc;ro=Ot({instructionType:"dynamic-content"});var to=class{static{({c:[Dc,kr]}=eo(this,[],[ro]))}constructor(t=F.use(ot),e=F.use(W)){this.mModuleValues=e,this.mLastTemplate=null,this.mProcedure=this.mModuleValues.createExpressionProcedure(t.value)}mLastTemplate;mModuleValues;mProcedure;onUpdate(){let t=this.mProcedure.execute();if(!t||!(t instanceof mt))throw new A("Dynamic content method has a wrong result type.",this);if(this.mLastTemplate!==null&&this.mLastTemplate.equals(t))return null;let e=t.clone();this.mLastTemplate=e;let i=new dt;return i.addElement(e,new gt(this.mModuleValues.data),null),i}static{kr()}};function Ec(){function v(l,o){return function(c){e(o,"addInitializer"),i(c,"An initializer"),l.push(c)}}function t(l,o,u,c,r,b,d,T,x){var m;switch(r){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var s={kind:m,name:d?"#"+o:o,static:b,private:d,metadata:T},f={v:!1};s.addInitializer=v(c,f);var n,a;if(r===0?d?(n=u.get,a=u.set):(n=function(){return this[o]},a=function(p){this[o]=p}):r===2?n=function(){return u.value}:((r===1||r===3)&&(n=function(){return u.get.call(this)}),(r===1||r===4)&&(a=function(p){u.set.call(this,p)})),d)s.access=n&&a?{get:n,set:a}:n?{get:n}:{set:a};else{if(n){var P=n;n=function(p){return arguments.length===0&&(p=this),P.call(p)}}if(a){var _=a;a=function(p,M){return arguments.length===1&&(M=p,p=this),_.call(p,M)}}var D=function(p){return o in p};s.access=n&&a?{has:D,get:n,set:a}:n?{has:D,get:n}:{has:D,set:a}}try{return l(x,s)}finally{f.v=!0}}function e(l,o){if(l.v)throw new Error("attempted to call "+o+" after decoration was finished")}function i(l,o){if(typeof l!="function")throw new TypeError(o+" must be a function")}function h(l,o){var u=typeof o;if(l===1){if(u!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&i(o.get,"accessor.get"),o.set!==void 0&&i(o.set,"accessor.set"),o.init!==void 0&&i(o.init,"accessor.init")}else if(u!=="function"){var c;throw l===0?c="field":l===10?c="class":c="method",new TypeError(c+" decorators must return a function or void 0")}}function g(l,o,u,c,r,b,d,T,x){var m=u[0],s,f,n;d?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,c)),r===1?n={get:s.get,set:s.set}:r===2?n=s.value:r===3?n=s.get:r===4&&(n=s.set);var a,P,_;if(typeof m=="function")a=t(m,c,s,T,r,b,d,x,n),a!==void 0&&(h(r,a),r===0?f=a:r===1?(f=a.init,P=a.get||n.get,_=a.set||n.set,n={get:P,set:_}):n=a);else for(var D=m.length-1;D>=0;D--){var p=m[D];if(a=t(p,c,s,T,r,b,d,x,n),a!==void 0){h(r,a);var M;r===0?M=a:r===1?(M=a.init,P=a.get||n.get,_=a.set||n.set,n={get:P,set:_}):n=a,M!==void 0&&(f===void 0?f=M:typeof f=="function"?f=[f,M]:f.push(M))}}if(r===0||r===1){if(f===void 0)f=function(I,E){return E};else if(typeof f!="function"){var O=f;f=function(I,E){for(var N=E,L=0;L<O.length;L++)N=O[L].call(I,N);return N}}else{var z=f;f=function(I,E){return z.call(I,E)}}l.push(f)}r!==0&&(r===1?(s.get=n.get,s.set=n.set):r===2?s.value=n:r===3?s.get=n:r===4&&(s.set=n),d?r===1?(l.push(function(I,E){return n.get.call(I,E)}),l.push(function(I,E){return n.set.call(I,E)})):r===2?l.push(n):l.push(function(I,E){return n.call(I,E)}):Object.defineProperty(o,c,s))}function y(l,o,u){for(var c=[],r,b,d=new Map,T=new Map,x=0;x<o.length;x++){var m=o[x];if(Array.isArray(m)){var s=m[1],f=m[2],n=m.length>3,a=s>=5,P,_;if(a?(P=l,s=s-5,b=b||[],_=b):(P=l.prototype,r=r||[],_=r),s!==0&&!n){var D=a?T:d,p=D.get(f)||0;if(p===!0||p===3&&s!==4||p===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!p&&s>2?D.set(f,s):D.set(f,!0)}g(c,P,m,f,s,a,n,_,u)}}return w(c,r),w(c,b),c}function w(l,o){o&&l.push(function(u){for(var c=0;c<o.length;c++)o[c].call(u);return u})}function C(l,o,u){if(o.length>0){for(var c=[],r=l,b=l.name,d=o.length-1;d>=0;d--){var T={v:!1};try{var x=o[d](r,{kind:"class",name:b,addInitializer:v(c,T),metadata:u})}finally{T.v=!0}x!==void 0&&(h(10,x),r=x)}return[S(r,u),function(){for(var m=0;m<c.length;m++)c[m].call(r)}]}}function S(l,o){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,u,c,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var d=Object.create(b===void 0?null:b),T=y(o,u,d);return c.length||S(o,d),{e:T,get c(){return C(o,c,d)}}}}function io(v,t,e,i){return(io=Ec())(v,t,e,i)}var so,oo,Cc;so=yt({access:Z.Write,selector:/^\([[\w\-$]+\)$/});var no=class{static{({c:[Cc,oo]}=io(this,[],[so]))}constructor(t=F.use(J),e=F.use(W),i=F.use(st)){this.mTarget=t,this.mEventName=i.name.substring(1,i.name.length-1);let h=e.createExpressionProcedure(i.value,["$event"]);this.mListener=g=>{h.setTemporaryValue("$event",g),h.execute()},this.mTarget.addEventListener(this.mEventName,this.mListener)}mEventName;mListener;mTarget;onDeconstruct(){this.mTarget.removeEventListener(this.mEventName,this.mListener)}static{oo()}};function Pc(){function v(l,o){return function(c){e(o,"addInitializer"),i(c,"An initializer"),l.push(c)}}function t(l,o,u,c,r,b,d,T,x){var m;switch(r){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var s={kind:m,name:d?"#"+o:o,static:b,private:d,metadata:T},f={v:!1};s.addInitializer=v(c,f);var n,a;if(r===0?d?(n=u.get,a=u.set):(n=function(){return this[o]},a=function(p){this[o]=p}):r===2?n=function(){return u.value}:((r===1||r===3)&&(n=function(){return u.get.call(this)}),(r===1||r===4)&&(a=function(p){u.set.call(this,p)})),d)s.access=n&&a?{get:n,set:a}:n?{get:n}:{set:a};else{if(n){var P=n;n=function(p){return arguments.length===0&&(p=this),P.call(p)}}if(a){var _=a;a=function(p,M){return arguments.length===1&&(M=p,p=this),_.call(p,M)}}var D=function(p){return o in p};s.access=n&&a?{has:D,get:n,set:a}:n?{has:D,get:n}:{has:D,set:a}}try{return l(x,s)}finally{f.v=!0}}function e(l,o){if(l.v)throw new Error("attempted to call "+o+" after decoration was finished")}function i(l,o){if(typeof l!="function")throw new TypeError(o+" must be a function")}function h(l,o){var u=typeof o;if(l===1){if(u!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&i(o.get,"accessor.get"),o.set!==void 0&&i(o.set,"accessor.set"),o.init!==void 0&&i(o.init,"accessor.init")}else if(u!=="function"){var c;throw l===0?c="field":l===10?c="class":c="method",new TypeError(c+" decorators must return a function or void 0")}}function g(l,o,u,c,r,b,d,T,x){var m=u[0],s,f,n;d?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,c)),r===1?n={get:s.get,set:s.set}:r===2?n=s.value:r===3?n=s.get:r===4&&(n=s.set);var a,P,_;if(typeof m=="function")a=t(m,c,s,T,r,b,d,x,n),a!==void 0&&(h(r,a),r===0?f=a:r===1?(f=a.init,P=a.get||n.get,_=a.set||n.set,n={get:P,set:_}):n=a);else for(var D=m.length-1;D>=0;D--){var p=m[D];if(a=t(p,c,s,T,r,b,d,x,n),a!==void 0){h(r,a);var M;r===0?M=a:r===1?(M=a.init,P=a.get||n.get,_=a.set||n.set,n={get:P,set:_}):n=a,M!==void 0&&(f===void 0?f=M:typeof f=="function"?f=[f,M]:f.push(M))}}if(r===0||r===1){if(f===void 0)f=function(I,E){return E};else if(typeof f!="function"){var O=f;f=function(I,E){for(var N=E,L=0;L<O.length;L++)N=O[L].call(I,N);return N}}else{var z=f;f=function(I,E){return z.call(I,E)}}l.push(f)}r!==0&&(r===1?(s.get=n.get,s.set=n.set):r===2?s.value=n:r===3?s.get=n:r===4&&(s.set=n),d?r===1?(l.push(function(I,E){return n.get.call(I,E)}),l.push(function(I,E){return n.set.call(I,E)})):r===2?l.push(n):l.push(function(I,E){return n.call(I,E)}):Object.defineProperty(o,c,s))}function y(l,o,u){for(var c=[],r,b,d=new Map,T=new Map,x=0;x<o.length;x++){var m=o[x];if(Array.isArray(m)){var s=m[1],f=m[2],n=m.length>3,a=s>=5,P,_;if(a?(P=l,s=s-5,b=b||[],_=b):(P=l.prototype,r=r||[],_=r),s!==0&&!n){var D=a?T:d,p=D.get(f)||0;if(p===!0||p===3&&s!==4||p===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!p&&s>2?D.set(f,s):D.set(f,!0)}g(c,P,m,f,s,a,n,_,u)}}return w(c,r),w(c,b),c}function w(l,o){o&&l.push(function(u){for(var c=0;c<o.length;c++)o[c].call(u);return u})}function C(l,o,u){if(o.length>0){for(var c=[],r=l,b=l.name,d=o.length-1;d>=0;d--){var T={v:!1};try{var x=o[d](r,{kind:"class",name:b,addInitializer:v(c,T),metadata:u})}finally{T.v=!0}x!==void 0&&(h(10,x),r=x)}return[S(r,u),function(){for(var m=0;m<c.length;m++)c[m].call(r)}]}}function S(l,o){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,u,c,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var d=Object.create(b===void 0?null:b),T=y(o,u,d);return c.length||S(o,d),{e:T,get c(){return C(o,c,d)}}}}function co(v,t,e,i){return(co=Pc())(v,t,e,i)}function _c(v){return v}var uo,ao,lo;uo=Ot({instructionType:"for"});new class extends _c{constructor(){super(lo),ao()}static{class v{static{({c:[lo,ao]}=co(this,[],[uo]))}static REGEX_HEAD=new RegExp(/^\s*([a-zA-Z]+[a-zA-Z0-9]*)\s*of\s+([^;]+)\s*(?:;(.*))?$/);static REGEX_MODIFIER_INSTRUCTION=new RegExp(/^\s*(\$?[a-zA-Z]+[a-zA-Z0-9]*)\s*=\s*(.+?)\s*$/);mExpression;mLastEntries;mModuleValues;mTemplate;constructor(e=F.use(vt),i=F.use(W),h=F.use(ot)){this.mTemplate=e,this.mModuleValues=i,this.mLastEntries=new Array;let g=h.value,y=v.REGEX_HEAD.exec(g);if(!y)throw new A(`For-Parameter value has wrong format: ${g}`,this);let w=y[1],C=y[2],S=y[3]?y[3].split(";"):new Array,l=new Array;for(let o of S){let u=v.REGEX_MODIFIER_INSTRUCTION.exec(o);if(!u)throw new A(`For-Parameter optional instruction has wrong format: ${o}`,this);l.push({variableName:u[1],procedure:this.mModuleValues.createExpressionProcedure(u[2],["$index",w])})}this.mExpression={iterateVariableName:w,iterateValueProcedure:this.mModuleValues.createExpressionProcedure(C),modifier:l}}onUpdate(){let e=new dt,i=this.mExpression.iterateValueProcedure.execute();if(typeof i=="object"&&i!==null||Array.isArray(i)){let h=Symbol.iterator in i?Object.entries([...i]):Object.entries(i);if(this.compareEntries(h,this.mLastEntries))return null;this.mLastEntries=h;for(let[g,y]of h)this.addTemplateForElement(e,this.mExpression,y,g);return e}else return null}addTemplateForElement=(e,i,h,g)=>{let y=new gt(this.mModuleValues.data);y.setTemporaryValue(i.iterateVariableName,h);let w=h;for(let S of i.modifier){S.procedure.setTemporaryValue("$index",g),S.procedure.setTemporaryValue(i.iterateVariableName,h);let l=S.procedure.execute();if(S.variableName==="$key"){w=l;continue}y.setTemporaryValue(S.variableName,l)}let C=new mt;C.appendChild(...this.mTemplate.childList),e.addElement(C,y,w)};compareEntries(e,i){if(e.length!==i.length)return!1;for(let h=0;h<e.length;h++){let[g,y]=e[h],[w,C]=i[h];if(g!==w||y!==C)return!1}return!0}}}};function Ic(){function v(l,o){return function(c){e(o,"addInitializer"),i(c,"An initializer"),l.push(c)}}function t(l,o,u,c,r,b,d,T,x){var m;switch(r){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var s={kind:m,name:d?"#"+o:o,static:b,private:d,metadata:T},f={v:!1};s.addInitializer=v(c,f);var n,a;if(r===0?d?(n=u.get,a=u.set):(n=function(){return this[o]},a=function(p){this[o]=p}):r===2?n=function(){return u.value}:((r===1||r===3)&&(n=function(){return u.get.call(this)}),(r===1||r===4)&&(a=function(p){u.set.call(this,p)})),d)s.access=n&&a?{get:n,set:a}:n?{get:n}:{set:a};else{if(n){var P=n;n=function(p){return arguments.length===0&&(p=this),P.call(p)}}if(a){var _=a;a=function(p,M){return arguments.length===1&&(M=p,p=this),_.call(p,M)}}var D=function(p){return o in p};s.access=n&&a?{has:D,get:n,set:a}:n?{has:D,get:n}:{has:D,set:a}}try{return l(x,s)}finally{f.v=!0}}function e(l,o){if(l.v)throw new Error("attempted to call "+o+" after decoration was finished")}function i(l,o){if(typeof l!="function")throw new TypeError(o+" must be a function")}function h(l,o){var u=typeof o;if(l===1){if(u!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&i(o.get,"accessor.get"),o.set!==void 0&&i(o.set,"accessor.set"),o.init!==void 0&&i(o.init,"accessor.init")}else if(u!=="function"){var c;throw l===0?c="field":l===10?c="class":c="method",new TypeError(c+" decorators must return a function or void 0")}}function g(l,o,u,c,r,b,d,T,x){var m=u[0],s,f,n;d?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,c)),r===1?n={get:s.get,set:s.set}:r===2?n=s.value:r===3?n=s.get:r===4&&(n=s.set);var a,P,_;if(typeof m=="function")a=t(m,c,s,T,r,b,d,x,n),a!==void 0&&(h(r,a),r===0?f=a:r===1?(f=a.init,P=a.get||n.get,_=a.set||n.set,n={get:P,set:_}):n=a);else for(var D=m.length-1;D>=0;D--){var p=m[D];if(a=t(p,c,s,T,r,b,d,x,n),a!==void 0){h(r,a);var M;r===0?M=a:r===1?(M=a.init,P=a.get||n.get,_=a.set||n.set,n={get:P,set:_}):n=a,M!==void 0&&(f===void 0?f=M:typeof f=="function"?f=[f,M]:f.push(M))}}if(r===0||r===1){if(f===void 0)f=function(I,E){return E};else if(typeof f!="function"){var O=f;f=function(I,E){for(var N=E,L=0;L<O.length;L++)N=O[L].call(I,N);return N}}else{var z=f;f=function(I,E){return z.call(I,E)}}l.push(f)}r!==0&&(r===1?(s.get=n.get,s.set=n.set):r===2?s.value=n:r===3?s.get=n:r===4&&(s.set=n),d?r===1?(l.push(function(I,E){return n.get.call(I,E)}),l.push(function(I,E){return n.set.call(I,E)})):r===2?l.push(n):l.push(function(I,E){return n.call(I,E)}):Object.defineProperty(o,c,s))}function y(l,o,u){for(var c=[],r,b,d=new Map,T=new Map,x=0;x<o.length;x++){var m=o[x];if(Array.isArray(m)){var s=m[1],f=m[2],n=m.length>3,a=s>=5,P,_;if(a?(P=l,s=s-5,b=b||[],_=b):(P=l.prototype,r=r||[],_=r),s!==0&&!n){var D=a?T:d,p=D.get(f)||0;if(p===!0||p===3&&s!==4||p===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!p&&s>2?D.set(f,s):D.set(f,!0)}g(c,P,m,f,s,a,n,_,u)}}return w(c,r),w(c,b),c}function w(l,o){o&&l.push(function(u){for(var c=0;c<o.length;c++)o[c].call(u);return u})}function C(l,o,u){if(o.length>0){for(var c=[],r=l,b=l.name,d=o.length-1;d>=0;d--){var T={v:!1};try{var x=o[d](r,{kind:"class",name:b,addInitializer:v(c,T),metadata:u})}finally{T.v=!0}x!==void 0&&(h(10,x),r=x)}return[S(r,u),function(){for(var m=0;m<c.length;m++)c[m].call(r)}]}}function S(l,o){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,u,c,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var d=Object.create(b===void 0?null:b),T=y(o,u,d);return c.length||S(o,d),{e:T,get c(){return C(o,c,d)}}}}function mo(v,t,e,i){return(mo=Ic())(v,t,e,i)}var po,ho,Mc;po=Ot({instructionType:"if"});var fo=class{static{({c:[Mc,ho]}=mo(this,[],[po]))}constructor(t=F.use(vt),e=F.use(W),i=F.use(ot)){this.mTemplateReference=t,this.mModuleValues=e,this.mProcedure=this.mModuleValues.createExpressionProcedure(i.value),this.mLastBoolean=!1}mLastBoolean;mModuleValues;mProcedure;mTemplateReference;onUpdate(){let t=this.mProcedure.execute();if(!!t!==this.mLastBoolean){this.mLastBoolean=!!t;let e=new dt;if(t){let i=new mt;i.appendChild(...this.mTemplateReference.childList),e.addElement(i,new gt(this.mModuleValues.data),null)}return e}else return null}static{ho()}};function Sc(){function v(l,o){return function(c){e(o,"addInitializer"),i(c,"An initializer"),l.push(c)}}function t(l,o,u,c,r,b,d,T,x){var m;switch(r){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var s={kind:m,name:d?"#"+o:o,static:b,private:d,metadata:T},f={v:!1};s.addInitializer=v(c,f);var n,a;if(r===0?d?(n=u.get,a=u.set):(n=function(){return this[o]},a=function(p){this[o]=p}):r===2?n=function(){return u.value}:((r===1||r===3)&&(n=function(){return u.get.call(this)}),(r===1||r===4)&&(a=function(p){u.set.call(this,p)})),d)s.access=n&&a?{get:n,set:a}:n?{get:n}:{set:a};else{if(n){var P=n;n=function(p){return arguments.length===0&&(p=this),P.call(p)}}if(a){var _=a;a=function(p,M){return arguments.length===1&&(M=p,p=this),_.call(p,M)}}var D=function(p){return o in p};s.access=n&&a?{has:D,get:n,set:a}:n?{has:D,get:n}:{has:D,set:a}}try{return l(x,s)}finally{f.v=!0}}function e(l,o){if(l.v)throw new Error("attempted to call "+o+" after decoration was finished")}function i(l,o){if(typeof l!="function")throw new TypeError(o+" must be a function")}function h(l,o){var u=typeof o;if(l===1){if(u!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&i(o.get,"accessor.get"),o.set!==void 0&&i(o.set,"accessor.set"),o.init!==void 0&&i(o.init,"accessor.init")}else if(u!=="function"){var c;throw l===0?c="field":l===10?c="class":c="method",new TypeError(c+" decorators must return a function or void 0")}}function g(l,o,u,c,r,b,d,T,x){var m=u[0],s,f,n;d?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,c)),r===1?n={get:s.get,set:s.set}:r===2?n=s.value:r===3?n=s.get:r===4&&(n=s.set);var a,P,_;if(typeof m=="function")a=t(m,c,s,T,r,b,d,x,n),a!==void 0&&(h(r,a),r===0?f=a:r===1?(f=a.init,P=a.get||n.get,_=a.set||n.set,n={get:P,set:_}):n=a);else for(var D=m.length-1;D>=0;D--){var p=m[D];if(a=t(p,c,s,T,r,b,d,x,n),a!==void 0){h(r,a);var M;r===0?M=a:r===1?(M=a.init,P=a.get||n.get,_=a.set||n.set,n={get:P,set:_}):n=a,M!==void 0&&(f===void 0?f=M:typeof f=="function"?f=[f,M]:f.push(M))}}if(r===0||r===1){if(f===void 0)f=function(I,E){return E};else if(typeof f!="function"){var O=f;f=function(I,E){for(var N=E,L=0;L<O.length;L++)N=O[L].call(I,N);return N}}else{var z=f;f=function(I,E){return z.call(I,E)}}l.push(f)}r!==0&&(r===1?(s.get=n.get,s.set=n.set):r===2?s.value=n:r===3?s.get=n:r===4&&(s.set=n),d?r===1?(l.push(function(I,E){return n.get.call(I,E)}),l.push(function(I,E){return n.set.call(I,E)})):r===2?l.push(n):l.push(function(I,E){return n.call(I,E)}):Object.defineProperty(o,c,s))}function y(l,o,u){for(var c=[],r,b,d=new Map,T=new Map,x=0;x<o.length;x++){var m=o[x];if(Array.isArray(m)){var s=m[1],f=m[2],n=m.length>3,a=s>=5,P,_;if(a?(P=l,s=s-5,b=b||[],_=b):(P=l.prototype,r=r||[],_=r),s!==0&&!n){var D=a?T:d,p=D.get(f)||0;if(p===!0||p===3&&s!==4||p===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!p&&s>2?D.set(f,s):D.set(f,!0)}g(c,P,m,f,s,a,n,_,u)}}return w(c,r),w(c,b),c}function w(l,o){o&&l.push(function(u){for(var c=0;c<o.length;c++)o[c].call(u);return u})}function C(l,o,u){if(o.length>0){for(var c=[],r=l,b=l.name,d=o.length-1;d>=0;d--){var T={v:!1};try{var x=o[d](r,{kind:"class",name:b,addInitializer:v(c,T),metadata:u})}finally{T.v=!0}x!==void 0&&(h(10,x),r=x)}return[S(r,u),function(){for(var m=0;m<c.length;m++)c[m].call(r)}]}}function S(l,o){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,u,c,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var d=Object.create(b===void 0?null:b),T=y(o,u,d);return c.length||S(o,d),{e:T,get c(){return C(o,c,d)}}}}function yo(v,t,e,i){return(yo=Sc())(v,t,e,i)}var bo,go,Ac;bo=yt({access:Z.Read,selector:/^\[[\w$]+\]$/});var vo=class{static{({c:[Ac,go]}=yo(this,[],[bo]))}constructor(t=F.use(J),e=F.use(W),i=F.use(st)){this.mTarget=t,this.mProcedure=e.createExpressionProcedure(i.value),this.mTargetProperty=i.name.substring(1,i.name.length-1),this.mLastValue=Symbol("Uncomparable")}mLastValue;mProcedure;mTarget;mTargetProperty;onUpdate(){let t=this.mProcedure.execute();return t===this.mLastValue?!1:(this.mLastValue=t,Reflect.set(this.mTarget,this.mTargetProperty,t),!0)}static{go()}};function Nc(){function v(l,o){return function(c){e(o,"addInitializer"),i(c,"An initializer"),l.push(c)}}function t(l,o,u,c,r,b,d,T,x){var m;switch(r){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var s={kind:m,name:d?"#"+o:o,static:b,private:d,metadata:T},f={v:!1};s.addInitializer=v(c,f);var n,a;if(r===0?d?(n=u.get,a=u.set):(n=function(){return this[o]},a=function(p){this[o]=p}):r===2?n=function(){return u.value}:((r===1||r===3)&&(n=function(){return u.get.call(this)}),(r===1||r===4)&&(a=function(p){u.set.call(this,p)})),d)s.access=n&&a?{get:n,set:a}:n?{get:n}:{set:a};else{if(n){var P=n;n=function(p){return arguments.length===0&&(p=this),P.call(p)}}if(a){var _=a;a=function(p,M){return arguments.length===1&&(M=p,p=this),_.call(p,M)}}var D=function(p){return o in p};s.access=n&&a?{has:D,get:n,set:a}:n?{has:D,get:n}:{has:D,set:a}}try{return l(x,s)}finally{f.v=!0}}function e(l,o){if(l.v)throw new Error("attempted to call "+o+" after decoration was finished")}function i(l,o){if(typeof l!="function")throw new TypeError(o+" must be a function")}function h(l,o){var u=typeof o;if(l===1){if(u!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&i(o.get,"accessor.get"),o.set!==void 0&&i(o.set,"accessor.set"),o.init!==void 0&&i(o.init,"accessor.init")}else if(u!=="function"){var c;throw l===0?c="field":l===10?c="class":c="method",new TypeError(c+" decorators must return a function or void 0")}}function g(l,o,u,c,r,b,d,T,x){var m=u[0],s,f,n;d?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,c)),r===1?n={get:s.get,set:s.set}:r===2?n=s.value:r===3?n=s.get:r===4&&(n=s.set);var a,P,_;if(typeof m=="function")a=t(m,c,s,T,r,b,d,x,n),a!==void 0&&(h(r,a),r===0?f=a:r===1?(f=a.init,P=a.get||n.get,_=a.set||n.set,n={get:P,set:_}):n=a);else for(var D=m.length-1;D>=0;D--){var p=m[D];if(a=t(p,c,s,T,r,b,d,x,n),a!==void 0){h(r,a);var M;r===0?M=a:r===1?(M=a.init,P=a.get||n.get,_=a.set||n.set,n={get:P,set:_}):n=a,M!==void 0&&(f===void 0?f=M:typeof f=="function"?f=[f,M]:f.push(M))}}if(r===0||r===1){if(f===void 0)f=function(I,E){return E};else if(typeof f!="function"){var O=f;f=function(I,E){for(var N=E,L=0;L<O.length;L++)N=O[L].call(I,N);return N}}else{var z=f;f=function(I,E){return z.call(I,E)}}l.push(f)}r!==0&&(r===1?(s.get=n.get,s.set=n.set):r===2?s.value=n:r===3?s.get=n:r===4&&(s.set=n),d?r===1?(l.push(function(I,E){return n.get.call(I,E)}),l.push(function(I,E){return n.set.call(I,E)})):r===2?l.push(n):l.push(function(I,E){return n.call(I,E)}):Object.defineProperty(o,c,s))}function y(l,o,u){for(var c=[],r,b,d=new Map,T=new Map,x=0;x<o.length;x++){var m=o[x];if(Array.isArray(m)){var s=m[1],f=m[2],n=m.length>3,a=s>=5,P,_;if(a?(P=l,s=s-5,b=b||[],_=b):(P=l.prototype,r=r||[],_=r),s!==0&&!n){var D=a?T:d,p=D.get(f)||0;if(p===!0||p===3&&s!==4||p===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!p&&s>2?D.set(f,s):D.set(f,!0)}g(c,P,m,f,s,a,n,_,u)}}return w(c,r),w(c,b),c}function w(l,o){o&&l.push(function(u){for(var c=0;c<o.length;c++)o[c].call(u);return u})}function C(l,o,u){if(o.length>0){for(var c=[],r=l,b=l.name,d=o.length-1;d>=0;d--){var T={v:!1};try{var x=o[d](r,{kind:"class",name:b,addInitializer:v(c,T),metadata:u})}finally{T.v=!0}x!==void 0&&(h(10,x),r=x)}return[S(r,u),function(){for(var m=0;m<c.length;m++)c[m].call(r)}]}}function S(l,o){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,u,c,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var d=Object.create(b===void 0?null:b),T=y(o,u,d);return c.length||S(o,d),{e:T,get c(){return C(o,c,d)}}}}function To(v,t,e,i){return(To=Nc())(v,t,e,i)}var Do,wo,Lc;Do=yt({access:Z.Write,selector:/^#[[\w$]+$/});var xo=class{static{({c:[Lc,wo]}=To(this,[],[Do]))}constructor(t=F.use(J),e=F.use(st),i=F.use(_t)){this.mChildName=e.name.substring(1),this.mComponentScopeValue=i,this.mTargetNode=t,this.mComponentScopeValue.setTemporaryValue(this.mChildName,this.mTargetNode)}mChildName;mComponentScopeValue;mTargetNode;onDeconstruct(){this.mComponentScopeValue.data.store[this.mChildName]===this.mTargetNode&&this.mComponentScopeValue.data.deleteTemporaryValue(this.mChildName)}static{wo()}};function Rc(){function v(l,o){return function(c){e(o,"addInitializer"),i(c,"An initializer"),l.push(c)}}function t(l,o,u,c,r,b,d,T,x){var m;switch(r){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var s={kind:m,name:d?"#"+o:o,static:b,private:d,metadata:T},f={v:!1};s.addInitializer=v(c,f);var n,a;if(r===0?d?(n=u.get,a=u.set):(n=function(){return this[o]},a=function(p){this[o]=p}):r===2?n=function(){return u.value}:((r===1||r===3)&&(n=function(){return u.get.call(this)}),(r===1||r===4)&&(a=function(p){u.set.call(this,p)})),d)s.access=n&&a?{get:n,set:a}:n?{get:n}:{set:a};else{if(n){var P=n;n=function(p){return arguments.length===0&&(p=this),P.call(p)}}if(a){var _=a;a=function(p,M){return arguments.length===1&&(M=p,p=this),_.call(p,M)}}var D=function(p){return o in p};s.access=n&&a?{has:D,get:n,set:a}:n?{has:D,get:n}:{has:D,set:a}}try{return l(x,s)}finally{f.v=!0}}function e(l,o){if(l.v)throw new Error("attempted to call "+o+" after decoration was finished")}function i(l,o){if(typeof l!="function")throw new TypeError(o+" must be a function")}function h(l,o){var u=typeof o;if(l===1){if(u!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&i(o.get,"accessor.get"),o.set!==void 0&&i(o.set,"accessor.set"),o.init!==void 0&&i(o.init,"accessor.init")}else if(u!=="function"){var c;throw l===0?c="field":l===10?c="class":c="method",new TypeError(c+" decorators must return a function or void 0")}}function g(l,o,u,c,r,b,d,T,x){var m=u[0],s,f,n;d?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,c)),r===1?n={get:s.get,set:s.set}:r===2?n=s.value:r===3?n=s.get:r===4&&(n=s.set);var a,P,_;if(typeof m=="function")a=t(m,c,s,T,r,b,d,x,n),a!==void 0&&(h(r,a),r===0?f=a:r===1?(f=a.init,P=a.get||n.get,_=a.set||n.set,n={get:P,set:_}):n=a);else for(var D=m.length-1;D>=0;D--){var p=m[D];if(a=t(p,c,s,T,r,b,d,x,n),a!==void 0){h(r,a);var M;r===0?M=a:r===1?(M=a.init,P=a.get||n.get,_=a.set||n.set,n={get:P,set:_}):n=a,M!==void 0&&(f===void 0?f=M:typeof f=="function"?f=[f,M]:f.push(M))}}if(r===0||r===1){if(f===void 0)f=function(I,E){return E};else if(typeof f!="function"){var O=f;f=function(I,E){for(var N=E,L=0;L<O.length;L++)N=O[L].call(I,N);return N}}else{var z=f;f=function(I,E){return z.call(I,E)}}l.push(f)}r!==0&&(r===1?(s.get=n.get,s.set=n.set):r===2?s.value=n:r===3?s.get=n:r===4&&(s.set=n),d?r===1?(l.push(function(I,E){return n.get.call(I,E)}),l.push(function(I,E){return n.set.call(I,E)})):r===2?l.push(n):l.push(function(I,E){return n.call(I,E)}):Object.defineProperty(o,c,s))}function y(l,o,u){for(var c=[],r,b,d=new Map,T=new Map,x=0;x<o.length;x++){var m=o[x];if(Array.isArray(m)){var s=m[1],f=m[2],n=m.length>3,a=s>=5,P,_;if(a?(P=l,s=s-5,b=b||[],_=b):(P=l.prototype,r=r||[],_=r),s!==0&&!n){var D=a?T:d,p=D.get(f)||0;if(p===!0||p===3&&s!==4||p===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!p&&s>2?D.set(f,s):D.set(f,!0)}g(c,P,m,f,s,a,n,_,u)}}return w(c,r),w(c,b),c}function w(l,o){o&&l.push(function(u){for(var c=0;c<o.length;c++)o[c].call(u);return u})}function C(l,o,u){if(o.length>0){for(var c=[],r=l,b=l.name,d=o.length-1;d>=0;d--){var T={v:!1};try{var x=o[d](r,{kind:"class",name:b,addInitializer:v(c,T),metadata:u})}finally{T.v=!0}x!==void 0&&(h(10,x),r=x)}return[S(r,u),function(){for(var m=0;m<c.length;m++)c[m].call(r)}]}}function S(l,o){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,u,c,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var d=Object.create(b===void 0?null:b),T=y(o,u,d);return c.length||S(o,d),{e:T,get c(){return C(o,c,d)}}}}function Po(v,t,e,i){return(Po=Rc())(v,t,e,i)}var _o,Eo,Oc;_o=Ot({instructionType:"slot"});var Co=class{static{({c:[Oc,Eo]}=Po(this,[],[_o]))}constructor(t=F.use(W),e=F.use(ot)){this.mModuleValues=t,this.mSlotName=e.value,this.mIsSetup=!1}mIsSetup;mModuleValues;mSlotName;onUpdate(){if(this.mIsSetup)return null;this.mIsSetup=!0;let t=new Rt("slot");this.mSlotName!==""&&t.setAttribute("name").addValue(this.mSlotName);let e=new mt;e.appendChild(t);let i=new dt;return i.addElement(e,this.mModuleValues.data,null),i}static{Eo()}};function Fc(){function v(l,o){return function(c){e(o,"addInitializer"),i(c,"An initializer"),l.push(c)}}function t(l,o,u,c,r,b,d,T,x){var m;switch(r){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var s={kind:m,name:d?"#"+o:o,static:b,private:d,metadata:T},f={v:!1};s.addInitializer=v(c,f);var n,a;if(r===0?d?(n=u.get,a=u.set):(n=function(){return this[o]},a=function(p){this[o]=p}):r===2?n=function(){return u.value}:((r===1||r===3)&&(n=function(){return u.get.call(this)}),(r===1||r===4)&&(a=function(p){u.set.call(this,p)})),d)s.access=n&&a?{get:n,set:a}:n?{get:n}:{set:a};else{if(n){var P=n;n=function(p){return arguments.length===0&&(p=this),P.call(p)}}if(a){var _=a;a=function(p,M){return arguments.length===1&&(M=p,p=this),_.call(p,M)}}var D=function(p){return o in p};s.access=n&&a?{has:D,get:n,set:a}:n?{has:D,get:n}:{has:D,set:a}}try{return l(x,s)}finally{f.v=!0}}function e(l,o){if(l.v)throw new Error("attempted to call "+o+" after decoration was finished")}function i(l,o){if(typeof l!="function")throw new TypeError(o+" must be a function")}function h(l,o){var u=typeof o;if(l===1){if(u!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&i(o.get,"accessor.get"),o.set!==void 0&&i(o.set,"accessor.set"),o.init!==void 0&&i(o.init,"accessor.init")}else if(u!=="function"){var c;throw l===0?c="field":l===10?c="class":c="method",new TypeError(c+" decorators must return a function or void 0")}}function g(l,o,u,c,r,b,d,T,x){var m=u[0],s,f,n;d?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,c)),r===1?n={get:s.get,set:s.set}:r===2?n=s.value:r===3?n=s.get:r===4&&(n=s.set);var a,P,_;if(typeof m=="function")a=t(m,c,s,T,r,b,d,x,n),a!==void 0&&(h(r,a),r===0?f=a:r===1?(f=a.init,P=a.get||n.get,_=a.set||n.set,n={get:P,set:_}):n=a);else for(var D=m.length-1;D>=0;D--){var p=m[D];if(a=t(p,c,s,T,r,b,d,x,n),a!==void 0){h(r,a);var M;r===0?M=a:r===1?(M=a.init,P=a.get||n.get,_=a.set||n.set,n={get:P,set:_}):n=a,M!==void 0&&(f===void 0?f=M:typeof f=="function"?f=[f,M]:f.push(M))}}if(r===0||r===1){if(f===void 0)f=function(I,E){return E};else if(typeof f!="function"){var O=f;f=function(I,E){for(var N=E,L=0;L<O.length;L++)N=O[L].call(I,N);return N}}else{var z=f;f=function(I,E){return z.call(I,E)}}l.push(f)}r!==0&&(r===1?(s.get=n.get,s.set=n.set):r===2?s.value=n:r===3?s.get=n:r===4&&(s.set=n),d?r===1?(l.push(function(I,E){return n.get.call(I,E)}),l.push(function(I,E){return n.set.call(I,E)})):r===2?l.push(n):l.push(function(I,E){return n.call(I,E)}):Object.defineProperty(o,c,s))}function y(l,o,u){for(var c=[],r,b,d=new Map,T=new Map,x=0;x<o.length;x++){var m=o[x];if(Array.isArray(m)){var s=m[1],f=m[2],n=m.length>3,a=s>=5,P,_;if(a?(P=l,s=s-5,b=b||[],_=b):(P=l.prototype,r=r||[],_=r),s!==0&&!n){var D=a?T:d,p=D.get(f)||0;if(p===!0||p===3&&s!==4||p===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!p&&s>2?D.set(f,s):D.set(f,!0)}g(c,P,m,f,s,a,n,_,u)}}return w(c,r),w(c,b),c}function w(l,o){o&&l.push(function(u){for(var c=0;c<o.length;c++)o[c].call(u);return u})}function C(l,o,u){if(o.length>0){for(var c=[],r=l,b=l.name,d=o.length-1;d>=0;d--){var T={v:!1};try{var x=o[d](r,{kind:"class",name:b,addInitializer:v(c,T),metadata:u})}finally{T.v=!0}x!==void 0&&(h(10,x),r=x)}return[S(r,u),function(){for(var m=0;m<c.length;m++)c[m].call(r)}]}}function S(l,o){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,u,c,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var d=Object.create(b===void 0?null:b),T=y(o,u,d);return c.length||S(o,d),{e:T,get c(){return C(o,c,d)}}}}function So(v,t,e,i){return(So=Fc())(v,t,e,i)}var Ao,Io,zc;Ao=yt({access:Z.ReadWrite,selector:/^\[\([[\w$]+\)\]$/});var Mo=class{static{({c:[zc,Io]}=So(this,[],[Ao]))}constructor(t=F.use(U),e=F.use(J),i=F.use(W),h=F.use(st)){this.mTargetNode=e,this.mAttributeKey=h.name.substring(2,h.name.length-2),this.mReadProcedure=i.createExpressionProcedure(h.value),this.mWriteProcedure=i.createExpressionProcedure(`${h.value} = $DATA;`,["$DATA"]),this.mLastDataValue=Symbol("Uncomparable");let g=y=>{this.mLastDataValue!==y&&t.updater.updateAsync()};this.mTargetNode.addEventListener("input",y=>{g(Reflect.get(this.mTargetNode,this.mAttributeKey))}),this.mTargetNode.addEventListener("change",y=>{g(Reflect.get(this.mTargetNode,this.mAttributeKey))})}mAttributeKey;mLastDataValue;mReadProcedure;mTargetNode;mWriteProcedure;onUpdate(){let t=this.mReadProcedure.execute();if(t!==this.mLastDataValue)return Reflect.set(this.mTargetNode,this.mAttributeKey,t),this.mLastDataValue=t,!0;let e=Reflect.get(this.mTargetNode,this.mAttributeKey);return e!==t?(this.mWriteProcedure.setTemporaryValue("$DATA",e),this.mWriteProcedure.execute(),this.mLastDataValue=e,!0):!1}static{Io()}};function jc(){function v(l,o){return function(c){e(o,"addInitializer"),i(c,"An initializer"),l.push(c)}}function t(l,o,u,c,r,b,d,T,x){var m;switch(r){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var s={kind:m,name:d?"#"+o:o,static:b,private:d,metadata:T},f={v:!1};s.addInitializer=v(c,f);var n,a;if(r===0?d?(n=u.get,a=u.set):(n=function(){return this[o]},a=function(p){this[o]=p}):r===2?n=function(){return u.value}:((r===1||r===3)&&(n=function(){return u.get.call(this)}),(r===1||r===4)&&(a=function(p){u.set.call(this,p)})),d)s.access=n&&a?{get:n,set:a}:n?{get:n}:{set:a};else{if(n){var P=n;n=function(p){return arguments.length===0&&(p=this),P.call(p)}}if(a){var _=a;a=function(p,M){return arguments.length===1&&(M=p,p=this),_.call(p,M)}}var D=function(p){return o in p};s.access=n&&a?{has:D,get:n,set:a}:n?{has:D,get:n}:{has:D,set:a}}try{return l(x,s)}finally{f.v=!0}}function e(l,o){if(l.v)throw new Error("attempted to call "+o+" after decoration was finished")}function i(l,o){if(typeof l!="function")throw new TypeError(o+" must be a function")}function h(l,o){var u=typeof o;if(l===1){if(u!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&i(o.get,"accessor.get"),o.set!==void 0&&i(o.set,"accessor.set"),o.init!==void 0&&i(o.init,"accessor.init")}else if(u!=="function"){var c;throw l===0?c="field":l===10?c="class":c="method",new TypeError(c+" decorators must return a function or void 0")}}function g(l,o,u,c,r,b,d,T,x){var m=u[0],s,f,n;d?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,c)),r===1?n={get:s.get,set:s.set}:r===2?n=s.value:r===3?n=s.get:r===4&&(n=s.set);var a,P,_;if(typeof m=="function")a=t(m,c,s,T,r,b,d,x,n),a!==void 0&&(h(r,a),r===0?f=a:r===1?(f=a.init,P=a.get||n.get,_=a.set||n.set,n={get:P,set:_}):n=a);else for(var D=m.length-1;D>=0;D--){var p=m[D];if(a=t(p,c,s,T,r,b,d,x,n),a!==void 0){h(r,a);var M;r===0?M=a:r===1?(M=a.init,P=a.get||n.get,_=a.set||n.set,n={get:P,set:_}):n=a,M!==void 0&&(f===void 0?f=M:typeof f=="function"?f=[f,M]:f.push(M))}}if(r===0||r===1){if(f===void 0)f=function(I,E){return E};else if(typeof f!="function"){var O=f;f=function(I,E){for(var N=E,L=0;L<O.length;L++)N=O[L].call(I,N);return N}}else{var z=f;f=function(I,E){return z.call(I,E)}}l.push(f)}r!==0&&(r===1?(s.get=n.get,s.set=n.set):r===2?s.value=n:r===3?s.get=n:r===4&&(s.set=n),d?r===1?(l.push(function(I,E){return n.get.call(I,E)}),l.push(function(I,E){return n.set.call(I,E)})):r===2?l.push(n):l.push(function(I,E){return n.call(I,E)}):Object.defineProperty(o,c,s))}function y(l,o,u){for(var c=[],r,b,d=new Map,T=new Map,x=0;x<o.length;x++){var m=o[x];if(Array.isArray(m)){var s=m[1],f=m[2],n=m.length>3,a=s>=5,P,_;if(a?(P=l,s=s-5,b=b||[],_=b):(P=l.prototype,r=r||[],_=r),s!==0&&!n){var D=a?T:d,p=D.get(f)||0;if(p===!0||p===3&&s!==4||p===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!p&&s>2?D.set(f,s):D.set(f,!0)}g(c,P,m,f,s,a,n,_,u)}}return w(c,r),w(c,b),c}function w(l,o){o&&l.push(function(u){for(var c=0;c<o.length;c++)o[c].call(u);return u})}function C(l,o,u){if(o.length>0){for(var c=[],r=l,b=l.name,d=o.length-1;d>=0;d--){var T={v:!1};try{var x=o[d](r,{kind:"class",name:b,addInitializer:v(c,T),metadata:u})}finally{T.v=!0}x!==void 0&&(h(10,x),r=x)}return[S(r,u),function(){for(var m=0;m<c.length;m++)c[m].call(r)}]}}function S(l,o){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,u,c,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var d=Object.create(b===void 0?null:b),T=y(o,u,d);return c.length||S(o,d),{e:T,get c(){return C(o,c,d)}}}}function Ro(v,t,e,i){return(Ro=jc())(v,t,e,i)}var Oo,No,Vc;Oo=Kt({access:Z.Read,targetRestrictions:[Ct]});var Lo=class{static{({c:[Vc,No]}=Ro(this,[],[Oo]))}constructor(t=F.use(Ct),e=F.use(J)){let i=new Array,h=t.processorConstructor;do{let g=ct.get(h).getMetadata(_e.METADATA_USER_EVENT_LISTENER_PROPERIES);if(g)for(let y of g)i.push(y)}while(h=Object.getPrototypeOf(h));this.mEventListenerList=new Array,this.mTargetElement=e;for(let g of i){let[y,w]=g,C=Reflect.get(t.processor,y);C=C.bind(t.processor),this.mEventListenerList.push([w,C]),this.mTargetElement.addEventListener(w,C)}}mEventListenerList;mTargetElement;onDeconstruct(){for(let t of this.mEventListenerList){let[e,i]=t;this.mTargetElement.removeEventListener(e,i)}}static{No()}};var Fo=`:host {\r
    display: block;\r
    width: 100%;\r
    height: 100%;\r
}\r
\r
potatno-code-editor {\r
    display: block;\r
    width: 100%;\r
    height: 100%;\r
}`;var ie=class{mProject;constructor(t){this.mProject=t}deserialize(t){let e=new Vt(this.mProject),i=[];for(let h of t.functions){let g=this.deserializeFunctionHead(h,e);i.push([g,h]),e.addFunction(g)}for(let[h,g]of i)this.deserializeFunctionBody(h,g,e);return e}deserializeFunctionBody(t,e,i){let h=new Map;for(let g of e.nodes)h.set(g.id,this.deserializeNode(g,t,i));for(let g of e.connections){if(!h.has(g.sourceNodeId)||!h.has(g.targetNodeId))continue;let y=h.get(g.sourceNodeId),w=h.get(g.targetNodeId),C=y.outputs.map.get(g.sourcePortId),S=w.inputs.map.get(g.targetPortId);!C||!S||C.connect(S)}}deserializeFunctionHead(t,e){let i=new lt(this.mProject,e,{definitionId:t.definitionId,id:t.id,label:t.label,isSystem:t.isSystem});for(let h of t.imports)i.addImport(h);for(let h of t.inputs)i.addInput({label:h.label,dataType:h.dataType});for(let h of t.outputs)i.addOutput({label:h.label,dataType:h.dataType});return i}deserializeNode(t,e,i){let h=i.nodeDefinitions.find(y=>y.id===t.definitionId),g=(()=>{if(h)return e.addNodeByDefinition(h,t.transformation);let y=t.ports.filter(C=>C.direction==="input").map(C=>({dataType:C.dataType,definitionId:C.definitionId,label:C.label,portType:C.portType})),w=t.ports.filter(C=>C.direction==="output").map(C=>({dataType:C.dataType,definitionId:C.definitionId,label:C.label,portType:C.portType}));return new pt(this.mProject,i,e,{definitionId:t.definitionId,ports:{input:y,output:w},label:t.label,transformation:{...t.transformation}})})();g.label=t.label,e.addNode(g);for(let y of t.ports)if(y.portType==="value"&&y.directValue.length>0){let w=g.inputs.map.get(y.definitionId);w&&w.setDirectValue(y.directValue)}return g.preview=t.preview??null,g}};var se=class{constructor(){}serialize(t){return{functions:[...t.functions].map(e=>this.serializeFunction(e))}}serializeFunction(t){let e=new Map;[...t.nodes].forEach((w,C)=>{e.set(w,`n${C}`)});let i=[...t.nodes].map(w=>this.serializeNode(w,e.get(w))),h=[];for(let w of t.nodes){let C=e.get(w);for(let S of w.outputs.list)for(let l of S.connectedPorts){let o=e.get(l.node);h.push({sourceNodeId:C,sourcePortId:S.definitionId,targetNodeId:o,targetPortId:l.definitionId})}}let g=t.inputs.map(w=>({label:w.label,dataType:w.dataType})),y=t.outputs.map(w=>({label:w.label,dataType:w.dataType}));return{id:t.id,label:t.label,isSystem:t.isSystem,definitionId:t.definitionId,inputs:g,outputs:y,imports:[...t.imports],nodes:i,connections:h}}serializeNode(t,e){let i=[...t.inputs.list,...t.outputs.list].map(g=>({definitionId:g.definitionId,label:g.label,direction:g.direction,portType:g.portType,dataType:g.portType==="value"?g.dataType:null,directValue:[...g.directValue]})),h=t.preview?{portDefinitionId:t.preview.portDefinitionId,displayId:t.preview.displayId}:null;return{id:e,definitionId:t.definitionId,label:t.label,transformation:{...t.transformation},ports:i,preview:h}}};var zo=`:host {   \r
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
}`;var qe=class v{static PASTE_OFFSET=2;mClipboardNodes;mManager;constructor(t){this.mManager=t,this.mClipboardNodes=new Array}copy(t){if(t.size===0)return;let e=[...t],i=new Map;for(let h=0;h<e.length;h++){let g=e[h],y=g.inputs.value.map(C=>({definitionId:C.definitionId,values:[...C.directValue]})),w={...g.transformation};w.x+=v.PASTE_OFFSET,w.y+=v.PASTE_OFFSET,i.set(g,{connections:new Array,definitionId:g.definitionId,id:h,portDirectValues:y,label:g.label,transformation:w})}for(let[h,g]of i)for(let y of h.outputs.list)for(let w of y.connectedPorts){let C=i.get(w.node);C&&g.connections.push({sourcePortName:y.definitionId,targetNodeId:C.id,targetPortName:w.definitionId})}this.mClipboardNodes=[...i.values()]}deconstruct(){}paste(){if(this.mClipboardNodes.length===0)return new Array;let t=this.mManager.activeFunction,e=new Map;for(let i of this.mClipboardNodes){let h=t.dynamicNodeDefinitions.find(y=>y.id===i.definitionId);if(!h)continue;let g=this.mManager.graph.addNode(t,h,i.transformation);this.mManager.graph.updateNode(g,y=>{y.label=i.label;for(let w of i.portDirectValues)y.inputs.map.has(w.definitionId)&&y.inputs.map.get(w.definitionId).setDirectValue(w.values)}),e.set(i.id,g)}for(let i of this.mClipboardNodes){let h=e.get(i.id);if(h)for(let g of i.connections){let y=e.get(g.targetNodeId);if(!y)continue;let w=h.outputs.map.get(g.sourcePortName),C=y.inputs.map.get(g.targetPortName);!w||!C||this.mManager.graph.connectPorts(w,C)}}return[...e.values()]}};var Je=class extends ge{mGridNodeArea;mGridPaths;mNodeArea;mPathArea;constructor(){super(),this.mGridNodeArea=new WeakMap,this.mNodeArea=new Map,this.mGridPaths=new WeakMap,this.mPathArea=new Map}clear(t){t==="all"&&this.mNodeArea.clear(),this.mPathArea.clear()}getPath(t,e){let i=t.direction==="input"&&t.portType==="value"||t.direction==="output"&&t.portType==="flow"?t:e;return this.mGridPaths.get(i)??new Array}removeNodeArea(t){if(!this.mGridNodeArea.has(t))return;let e=this.mGridNodeArea.get(t);for(let i of e){let h=(this.mNodeArea.get(i)??0)-1;h<1?this.mNodeArea.delete(i):this.mNodeArea.set(i,h)}this.mGridNodeArea.delete(t)}updateNodeArea(t){this.removeNodeArea(t);let e=t.transformation.x,i=t.transformation.y,h=t.transformation.width,g=t.transformation.height,y=t.function.nodeDefinitions.find(C=>C.id===t.definitionId);if(y)switch(y.id){case Tt.DEFINITION_ID:return;case rt.DEFINITION_ID:case Q.DEFINITION_ID:break;default:g+=1,g+=t.preview!==null?7:0}let w=new Array;for(let C=0;C<h;C++)for(let S=0;S<g;S++){let l=`${C+e}|${S+i}`,o=(this.mNodeArea.get(l)??0)+1;this.mNodeArea.set(l,o),w.push(l)}this.mGridNodeArea.set(t,w)}updatePath(t,e,i){if(t.direction==="input"&&t.portType!=="value"||t.direction==="output"&&t.portType!=="flow")throw new A("Start port must be an input-value or an output-flow node.",this);this.removePathArea(t);let h=this.start(e,i);this.mGridPaths.set(t,h.path);let g=this.nodeId(e),y=this.nodeId(i);for(let w of h.path){let C=this.nodeId(w),S=this.mPathArea.has(C)?this.mPathArea.get(C):{ports:new Map,entryPoints:new Set};S.ports.set(t,[g,y]),S.entryPoints.add(g),S.entryPoints.add(y),this.mPathArea.set(C,S)}}costOfTraversal(t,e){let i=this.nodeId(t),h=1;this.mNodeArea.has(i)&&t!==e.endNode&&(h*=20);let g=e.path.next().value;if(this.mPathArea.has(i)){let l=this.mPathArea.get(i),o=this.nodeId(e.startNode),u=this.nodeId(e.endNode);if(l.entryPoints.has(o)||l.entryPoints.has(u))h*=.2;else if(h*=5,g){let c=this.nodeId(g);this.mPathArea.has(c)&&(h*=20)}}if(g){let l=t.y===g.y;(t===e.endNode||g===e.startNode)&&!l&&(h*=100);let o=e.path.next().value;o&&(t.x===o.x||t.y===o.y)&&(h*=.7)}let y=Math.abs(t.x-e.startNode.x),w=Math.abs(t.x-e.endNode.x),C=y<=w;(C&&t.y===e.startNode.y||!C&&t.y===e.endNode.y)&&(h*=.5);let S=e.endNode.x+e.startNode.x>>1;return t.x===S&&(h*=.5),h}heuristic(t,e){return(Math.abs(t.x-e.endNode.x)+Math.abs(t.y-e.endNode.y))*.5}neighborNodes(t){return[{x:t.x,y:t.y-1},{x:t.x-1,y:t.y},{x:t.x+1,y:t.y},{x:t.x,y:t.y+1}]}nodeId(t){return`${t.x}|${t.y}`}removePathArea(t){if(!this.mGridPaths.has(t))return;let e=this.mGridPaths.get(t);for(let i of e){let h=this.nodeId(i),g=this.mPathArea.get(h);if(!g)continue;let y=g.ports.get(t);y&&(g.ports.delete(t),g.entryPoints.delete(y[0]),g.entryPoints.delete(y[1]),g.ports.size===0?this.mPathArea.delete(h):this.mPathArea.set(h,g))}this.mGridPaths.delete(t)}};var Ke=class{mManager;mPathFinder;constructor(t){this.mManager=t,this.mPathFinder=new Je;let e=0,i=()=>{e>0&&globalThis.cancelAnimationFrame(e),globalThis.requestAnimationFrame(()=>{this.updatePaths()})};this.mManager.subscribe(R.Node|R.SpecialActiveFunction,h=>{if((h.changeType&R.SpecialActiveFunction)>0){this.mPathFinder.clear("all");for(let g of this.mManager.activeFunction.nodes)this.mPathFinder.updateNodeArea(g);i();return}(h.changeType&R.Node)>0&&((h.changeType&R.NodeDelete)>0?this.mPathFinder.removeNodeArea(h.item):this.mPathFinder.updateNodeArea(h.item)),i()}),this.mManager.subscribe(R.Connection,()=>{i()})}createTemporaryPath(t,e){let i=w=>w instanceof it?this.getPortGridPoint(w):w,h=i(t),g=i(e),y=this.mPathFinder.start(h,g).path;return{attributeValue:this.createSvgPath(y),length:y.length}}deconstruct(){}getConnectionPath(t,e){let i=this.mPathFinder.getPath(t,e);return{attributeValue:this.createSvgPath(i),length:i.length-2}}getPortGridPoint(t){let e=t.node,i=t.direction==="input"?e.inputs.list:e.outputs.list,h=(()=>{for(let w=0;w<i.length;w++)if(i[w]===t)return w;return 0})(),g=t.direction==="input"?e.transformation.x:e.transformation.x+e.transformation.width-1,y=1;return(e.definitionId===Q.DEFINITION_ID||e.definitionId===rt.DEFINITION_ID)&&(y=0),{y:e.transformation.y+y+h,x:g}}createGridCellPath(t,e,i){let h=this.getGridPosition(t,e),g=this.getGridPosition(t,i),y={x:e==="bottom"||e==="top"?h.x:g.x,y:e==="left"||e==="right"?h.y:g.y};return`Q ${y.x},${y.y} ${g.x},${g.y}`}createPath(t,e){let i=t.direction==="input"&&t.portType==="value"||t.direction==="output"&&t.portType==="flow"?t:e,h=t,g=e;h.direction!=="output"&&([g,h]=[h,g]);let y=this.getPortGridPoint(h),w=this.getPortGridPoint(g);this.mPathFinder.updatePath(i,y,w)}createSvgPath(t){if(t.length<2)return"";let e=(g,y)=>{let w=y.x-g.x,C=y.y-g.y;switch(!0){case(w===0&&C===1):return"bottom";case(w===0&&C===-1):return"top";case(w===-1&&C===0):return"left";case(w===1&&C===0):return"right";default:throw new A("Missformed path. Path points are not directly next to each other.",this)}},i=this.getGridPosition(t[0],e(t[0],t[1])),h=`M ${i.x},${i.y}`;for(let g=1;g<t.length-1;g++){let y=t[g],w=t[g-1],C=t[g+1],S=e(y,w),l=e(y,C);h+=this.createGridCellPath(y,S,l)}return h}getGridPosition(t,e){let i={x:t.x*this.mManager.grid.gridSize+this.mManager.grid.gridSize/2,y:t.y*this.mManager.grid.gridSize+this.mManager.grid.gridSize/2},h=this.mManager.grid.gridSize/2;switch(e){case"top":i.y-=h;break;case"right":i.x+=h;break;case"bottom":i.y+=h;break;case"left":i.x-=h;break}return i}updatePaths(){this.mPathFinder.clear("path");for(let t of this.mManager.activeFunction.nodes){for(let e of t.outputs.flow){let i=e.connectedPorts.values().next().value;i&&this.createPath(e,i)}for(let e of t.inputs.value){let i=e.connectedPorts.values().next().value;i&&this.createPath(e,i)}}}};var Qe=class{mDocument;mManager;get document(){return this.mDocument}constructor(t){this.mManager=t,this.mDocument=new Vt(t.project),this.mDocument.validate()}addFunction(t){let e=this.mDocument;if(!e||!e.project.userFunctions.has(t))return;let i=new lt(e.project,e,{definitionId:t,id:crypto.randomUUID(),isSystem:!1,label:`Function_${e.functions.length}`});e.addFunction(i),e.validate(),this.mManager.dispatch(R.FunctionAdd,i),this.mManager.setActiveFunction(i)}addNode(t,e,i){let h=t.addNodeByDefinition(e,i);return this.mManager.dispatch(R.NodeAdd,h),h}connectPorts(t,e){try{t.connect(e)}catch{return!1}return this.mManager.dispatch(R.ConnectionAdd,t),this.mManager.dispatch(R.ConnectionAdd,e),!0}deconstruct(){}disconnectPorts(t,e){t.disconnect(e),this.mManager.dispatch(R.ConnectionDelete,t),this.mManager.dispatch(R.ConnectionDelete,e)}mergeConnectPorts(t,e){if(t.length===0||e.length===0)return;let i=this.mManager.connections.getPortGridPoint(t[0]),h=this.priorizePorts(i,e);for(let g of h)for(let y of t)if(this.connectPorts(g,y))return}priorizePorts(t,e){if(e.length===0)return new Array;let i=this.mManager.connections.getPortGridPoint(e[0]);return e.toSorted((h,g)=>{let y=h.connectedPorts.size===0,w=g.connectedPorts.size===0;if(y!==w)return y?-1:1;let C=i.x>t.x?"input":"output",S=h.direction===C,l=g.direction===C;return S!==l?S?-1:1:0})}removeFunction(t){let e=this.mDocument;if(!e)return;let i=null;for(let h of e.functions)if(h.id===t){i=h,e.removeFunction(h);break}i&&(this.mManager.dispatch(R.FunctionDelete,i),this.setDefaultActiveFunction())}removeNode(t){if(t.definitionId===Q.DEFINITION_ID||t.definitionId===rt.DEFINITION_ID){let e=t.inputs.list[0],i=t.outputs.list[0];for(let h of e.connectedPorts)for(let g of i.connectedPorts)this.mManager.graph.connectPorts(h,g)}t.function.removeNode(t),this.mManager.dispatch(R.NodeDelete,t)}setDocument(t){this.mDocument=t,this.mDocument.validate(),this.mManager.dispatch(R.Document,this.mDocument),this.setDefaultActiveFunction()}setPortDirectValue(t,e){t.setDirectValue(e),this.mManager.dispatch(R.NodeUpdate,t.node)}transformNode(t,e){if(!t)return;let i=structuredClone(t.transformation);e(t),!(i.width===t.transformation.width&&i.height===t.transformation.height&&i.x===t.transformation.x&&i.y===t.transformation.y)&&this.mManager.dispatch(R.NodeTransform,t)}updateFunction(t,e){t&&(e(t),this.mManager.dispatch(R.FunctionUpdate,t))}updateNode(t,e){t&&(e(t),this.mManager.dispatch(R.NodeUpdate,t))}setDefaultActiveFunction(){if(!this.mDocument||this.mDocument.functions.length===0)return;let t=(()=>{let e=[...this.mDocument.functions],i=e.find(h=>h.id===this.mManager.activeFunction.id);return i||e[0]})();this.mManager.activeFunction!==t&&this.mManager.setActiveFunction(t)}};var ke=class v{static GRID_SIZE_PX=32;static MAX_ZOOM=5;static MIN_ZOOM=.1;mDraggedPortInformation;mGridElement;mGridPositions;mManager;mSelectedNodes;mTransformation;get draggedPort(){return this.mDraggedPortInformation}set gridElement(t){this.mGridElement=t}get gridSize(){return v.GRID_SIZE_PX}get panX(){return this.mTransformation.panX}get panY(){return this.mTransformation.panY}get selectedNodes(){return this.mSelectedNodes}get zoom(){return this.mTransformation.zoom}constructor(t){this.mManager=t,this.mGridElement=null,this.mDraggedPortInformation=new tr(this.mManager,[]),this.mGridPositions=new WeakMap,this.mSelectedNodes=new Set,this.mTransformation={panX:0,panY:0,zoom:1},this.mManager.subscribe(R.SpecialActiveFunction,()=>{this.mGridPositions.has(this.mManager.activeFunction)||this.mGridPositions.set(this.mManager.activeFunction,{panX:0,panY:0,zoom:1}),this.mTransformation=this.mGridPositions.get(this.mManager.activeFunction);let e=Array.from(this.mSelectedNodes).filter(i=>i.function!==this.mManager.activeFunction);for(let i of e)this.mSelectedNodes.delete(i)})}deconstruct(){}gridPixelSpaceToGridSpace(t,e){let i=t.x/this.gridSize,h=t.y/this.gridSize;return e&&(i=Math.floor(i),h=Math.floor(h)),{x:i,y:h}}pan(t,e){this.mTransformation.panX+=t,this.mTransformation.panY+=e,this.mManager.dispatch(R.SpecialGrid,null)}pixelToGridPixelSpace(t,e){let i=t,h=e;if(this.mGridElement){let g=this.mGridElement.getBoundingClientRect();i-=g.left,h-=g.top}return{x:(i-this.mTransformation.panX)/this.mTransformation.zoom,y:(h-this.mTransformation.panY)/this.mTransformation.zoom}}pixelToGridSpace(t,e){return this.gridPixelSpaceToGridSpace(this.pixelToGridPixelSpace(t,e),!0)}selectNodes(t,e=!1){if(this.mSelectedNodes.clear(),t.length===0){this.mManager.dispatch(R.SpecialSelectNode,null);return}let i=null;for(let h of t){if(i===null&&(i=h.function),i!==h.function)throw new A("Selected nodes must be of the same function",this);this.mSelectedNodes.add(h)}if(this.mManager.activeFunction!==i&&this.mManager.setActiveFunction(i),e){let h={top:1/0,right:-1/0,bottom:-1/0,left:1/0};for(let w of t){let C=w.transformation.y;C<h.top&&(h.top=C);let S=w.transformation.x+w.transformation.width;S>h.right&&(h.right=S);let l=w.transformation.y+w.transformation.height;l>h.bottom&&(h.bottom=l);let o=w.transformation.x;o<h.left&&(h.left=o)}this.mGridPositions.has(i)||this.mGridPositions.set(i,{panX:0,panY:0,zoom:1});let g=this.mGridPositions.get(i),y=this.mGridElement?.getBoundingClientRect();if(!y)return;g.panX=y.width/2,g.panX-=(h.left+(h.right-h.left)/2)*this.gridSize*g.zoom,g.panY=y.height/2,g.panY-=(h.top+(h.bottom-h.top)/2)*this.gridSize*g.zoom}this.mManager.dispatch(R.SpecialSelectNode,null)}setDraggingPort(t){this.mDraggedPortInformation=new tr(this.mManager,t)}zoomAt(t,e,i){let h=this.mTransformation.zoom,g=1+i,y=this.mTransformation.zoom*g;y=Math.max(v.MIN_ZOOM,Math.min(v.MAX_ZOOM,y));let w=(t-this.mTransformation.panX)/h,C=(e-this.mTransformation.panY)/h;this.mTransformation.zoom=y,this.mTransformation.panX=t-w*this.mTransformation.zoom,this.mTransformation.panY=e-C*this.mTransformation.zoom,this.mManager.dispatch(R.SpecialGrid,null)}},tr=class{mManager;mPointerGridPosition;mPortPositions;mPorts;get isDragging(){return this.mPorts.size>0}get portPositions(){return this.mPortPositions}get ports(){return[...this.mPorts]}constructor(t,e){this.mManager=t,this.mPorts=new Set(e),this.mPointerGridPosition={x:1/0,y:1/0},this.mPortPositions=new Map;for(let i of e){let h=this.mManager.connections.getPortGridPoint(i);i.direction==="output"&&(h.x+=1),this.mPortPositions.set(i,{x:h.x,y:h.y})}}hasPort(t){return t?this.mPorts.has(t):!1}updatePointer(t,e){let i=this.mManager.grid.pixelToGridSpace(t,e);return i.x===this.mPointerGridPosition.x&&i.y===this.mPointerGridPosition.y?!1:(this.mPointerGridPosition.x=i.x,this.mPointerGridPosition.y=i.y,!0)}};var er=class v{static MAX_HISTORY_ITEMS=100;mManager;mSnapshotIndex;mSnapshots;get canRedo(){return this.mSnapshotIndex<this.mSnapshots.length-1}get canUndo(){return this.mSnapshotIndex>0}constructor(t){this.mManager=t,this.mSnapshotIndex=-1,this.mSnapshots=new Array;let e=0;this.mManager.subscribe(R.Any,()=>{globalThis.clearTimeout(e),e=globalThis.setTimeout(()=>{this.pushHistory()},300)})}clear(){this.mSnapshots.length=0,this.mSnapshotIndex=-1}deconstruct(){}redo(){if(!this.canRedo)return;let t=this.mSnapshots[++this.mSnapshotIndex],e=JSON.parse(t);this.restoreHistory(e)}undo(){if(!this.canUndo)return;let t=this.mSnapshots[--this.mSnapshotIndex],e=JSON.parse(t);this.restoreHistory(e)}pushHistory(){let t=new se().serialize(this.mManager.graph.document),e=JSON.stringify(t);this.mSnapshotIndex>=0&&this.mSnapshots[this.mSnapshotIndex]===e||(this.mSnapshots.splice(this.mSnapshotIndex+1),this.mSnapshotIndex=this.mSnapshots.push(e)-1,this.mSnapshots.length>v.MAX_HISTORY_ITEMS&&(this.mSnapshots.shift(),this.mSnapshotIndex--))}restoreHistory(t){this.mManager.graph.setDocument(new ie(this.mManager.project).deserialize(t))}};var rr=class{mErrorItems;mErrorList;mIsDirty;mManager;get errorItems(){return this.mIsDirty&&this.revalidate(),this.mErrorItems}get errors(){return this.mIsDirty&&this.revalidate(),this.mErrorList}get isValid(){return this.mIsDirty&&this.revalidate(),this.mErrorItems.size===0}constructor(t){this.mManager=t,this.mErrorList=new Array,this.mErrorItems=new Set,this.mIsDirty=!0;let e=0,i=R.Connection|R.Document|R.Function|R.NodeAdd|R.NodeUpdate|R.NodeDelete|R.Port;this.mManager.subscribe(i,()=>{this.mIsDirty=!0,globalThis.clearTimeout(e),e=globalThis.setTimeout(()=>{this.mIsDirty&&(this.revalidate(),this.mIsDirty=!1)},1e3)})}deconstruct(){}revalidate(){this.mIsDirty=!1,this.mErrorList.splice(0,this.mErrorList.length),this.mErrorItems.clear();let t=this.mManager.graph.document.validate();for(let e of t.errors)switch(this.mErrorItems.add(e.item),!0){case e.item instanceof it:{this.mErrorList.push({location:e.item.node,message:e.message});break}case e.item instanceof pt:{this.mErrorList.push({location:e.item,message:e.message});break}case e.item instanceof lt:{this.mErrorList.push({location:e.item,message:e.message});break}}for(let e of t.affectedItems)switch(!0){case e instanceof it:{this.mManager.dispatch(R.PortAdd|R.PortUpdate,e),this.mManager.dispatch(R.NodeUpdate,e.node);break}case e instanceof pt:{this.mManager.dispatch(R.NodeAdd|R.NodeUpdate|R.NodeTransform,e);break}case e instanceof lt:{this.mManager.dispatch(R.FunctionAdd|R.FunctionUpdate,e);break}}this.mManager.dispatch(R.SpecialValidation,null)}};var or=class{mDriverElementBigEnough;mDriverElementVisible;mDriverElements;mDriverList;mDrivers;mElementDriver;mManager;mPreviewIntersection;constructor(t){this.mManager=t,this.mDriverList=new Array,this.mDrivers=new WeakMap,this.mDriverElementVisible=new WeakMap,this.mDriverElementBigEnough=new WeakMap,this.mDriverElements=new WeakMap,this.mElementDriver=new WeakMap,this.mManager.subscribe(R.Document,()=>{this.mDriverList.splice(0,this.mDriverList.length)});let e=0,i=R.Connection|R.Function|R.NodeAdd|R.NodeDelete|R.NodeUpdate;this.mManager.subscribe(i,()=>{globalThis.clearTimeout(e),e=globalThis.setTimeout(()=>this.refresh(),1e3)});let h=0;this.mManager.subscribe(R.SpecialGrid,()=>{globalThis.clearTimeout(h),h=globalThis.setTimeout(()=>{for(let g of this.mDriverList){let y=g.deref();if(!y)continue;let w=y.element.getBoundingClientRect();this.mDriverElementBigEnough.set(y,!(w.width<30||w.height<30))}},300)}),this.mPreviewIntersection=new IntersectionObserver(g=>{for(let y of g){let w=this.mElementDriver.get(y.target);if(!w)continue;let C=w.deref();C&&this.mDriverElementVisible.set(C,y.isIntersecting)}})}deconstruct(){}execute(){for(let t of this.mDriverList){let e=t.deref();if(e&&this.mDriverElementVisible.get(e)!==!1&&this.mDriverElementBigEnough.get(e)!==!1)try{e.execute()}catch(i){console.error("[PotatnoUiManagerPreview] Driver render failed:",i)}}}refresh(){if(this.mManager.integrity.isValid)for(let t=this.mDriverList.length-1;t>=0;t--){let e=this.mDriverList[t].deref();if(!e){this.unregister(this.mDriverList[t]);continue}e.refresh()}}requestDriver(t,e){let i=this.mDrivers.get(t);if(i&&i.display.id===e)return i;i&&this.unregister(this.mElementDriver.get(i.element));let h=t.project.preview.getDisplay(e);if(!h)throw new A(`Preview has no display for "${e}".`,this);let g=h.createDriver(t);return this.register(t,g),this.mManager.integrity.isValid&&g.refresh(),g}register(t,e){this.mDrivers.set(t,e);let i=new WeakRef(e);this.mDriverList.push(i);let h=e.element;this.mDriverElements.set(i,h),this.mElementDriver.set(h,i),this.mPreviewIntersection.observe(h)}unregister(t){let e=this.mDriverList.indexOf(t);if(e===-1)return;this.mDriverList.splice(e,1);let i=this.mDriverElements.get(t);i&&this.mPreviewIntersection.unobserve(i)}};var H=class extends EventTarget{mActiveFunction;mClipboard;mConnections;mEventBuffer;mEventBufferDispatchRequest;mGraph;mGrid;mHistory;mIntegrity;mPreview;mProject;get activeFunction(){return this.mActiveFunction}get clipboard(){return this.mClipboard}get connections(){return this.mConnections}get graph(){return this.mGraph}get grid(){return this.mGrid}get history(){return this.mHistory}get integrity(){return this.mIntegrity}get preview(){return this.mPreview}get project(){return this.mProject}constructor(t){super(),this.mProject=t,this.mEventBuffer=new Map,this.mEventBufferDispatchRequest=-1,this.mIntegrity=new rr(this),this.mConnections=new Ke(this),this.mHistory=new er(this),this.mPreview=new or(this),this.mGrid=new ke(this),this.mClipboard=new qe(this),this.mGraph=new Qe(this),this.mActiveFunction=this.mGraph.document.functions.at(0)}deconstruct(){this.mIntegrity.deconstruct(),this.mConnections.deconstruct(),this.mHistory.deconstruct(),this.mPreview.deconstruct(),this.mGrid.deconstruct(),this.mClipboard.deconstruct(),this.mGraph.deconstruct()}dispatch(t,e){let i=this.mEventBuffer.get(e)??0;this.mEventBuffer.set(e,i|t),this.mEventBufferDispatchRequest!==-1&&globalThis.cancelAnimationFrame(this.mEventBufferDispatchRequest),this.mEventBufferDispatchRequest=requestAnimationFrame(()=>{this.mEventBufferDispatchRequest=-1;for(let[h,g]of this.mEventBuffer)this.dispatchEvent(new Ae(g,h));this.mEventBuffer.clear()})}generateStringColor(t){let e=(()=>{let h=0;for(let g=0;g<t.length;g++)h=t.charCodeAt(g)+((h<<5)-h);return h})();return`hsl(${Math.abs(e)*137.508%360}, 70%, 60%)`}setActiveFunction(t){this.mGraph.document.functions.find(i=>i===t)&&(this.mActiveFunction=t,this.dispatch(R.SpecialActiveFunction,t))}subscribe(t,e){let i=h=>{t!==R.Any&&(h.changeType&t)===0||e(h)};return this.addEventListener(Ae.EVENT_TYPE,i),()=>{this.removeEventListener(Ae.EVENT_TYPE,i)}}},R={Any:268435455,Connection:15,ConnectionAdd:1,ConnectionUpdate:2,ConnectionDelete:4,Document:240,Function:3840,FunctionAdd:256,FunctionUpdate:512,FunctionDelete:1024,Node:61440,NodeAdd:4096,NodeUpdate:8192,NodeDelete:16384,NodeTransform:32768,Port:983040,PortAdd:65536,PortUpdate:131072,PortDelete:262144,Special:15728640,SpecialActiveFunction:1048576,SpecialGrid:2097152,SpecialValidation:4194304,SpecialSelectNode:8388608},Ae=class v extends Event{static EVENT_TYPE="PotatnoUiManagerChangeEvent";mChangeType;mEventItem;get changeType(){return this.mChangeType}get item(){return this.mEventItem}constructor(t,e){super(v.EVENT_TYPE),this.mChangeType=t,this.mEventItem=e}};var jo=`:host {\r
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
}`;var Vo=`<div class="button">\r
    $slot\r
</div>\r
`;function Hc(){function v(l,o){return function(c){e(o,"addInitializer"),i(c,"An initializer"),l.push(c)}}function t(l,o,u,c,r,b,d,T,x){var m;switch(r){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var s={kind:m,name:d?"#"+o:o,static:b,private:d,metadata:T},f={v:!1};s.addInitializer=v(c,f);var n,a;if(r===0?d?(n=u.get,a=u.set):(n=function(){return this[o]},a=function(p){this[o]=p}):r===2?n=function(){return u.value}:((r===1||r===3)&&(n=function(){return u.get.call(this)}),(r===1||r===4)&&(a=function(p){u.set.call(this,p)})),d)s.access=n&&a?{get:n,set:a}:n?{get:n}:{set:a};else{if(n){var P=n;n=function(p){return arguments.length===0&&(p=this),P.call(p)}}if(a){var _=a;a=function(p,M){return arguments.length===1&&(M=p,p=this),_.call(p,M)}}var D=function(p){return o in p};s.access=n&&a?{has:D,get:n,set:a}:n?{has:D,get:n}:{has:D,set:a}}try{return l(x,s)}finally{f.v=!0}}function e(l,o){if(l.v)throw new Error("attempted to call "+o+" after decoration was finished")}function i(l,o){if(typeof l!="function")throw new TypeError(o+" must be a function")}function h(l,o){var u=typeof o;if(l===1){if(u!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&i(o.get,"accessor.get"),o.set!==void 0&&i(o.set,"accessor.set"),o.init!==void 0&&i(o.init,"accessor.init")}else if(u!=="function"){var c;throw l===0?c="field":l===10?c="class":c="method",new TypeError(c+" decorators must return a function or void 0")}}function g(l,o,u,c,r,b,d,T,x){var m=u[0],s,f,n;d?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,c)),r===1?n={get:s.get,set:s.set}:r===2?n=s.value:r===3?n=s.get:r===4&&(n=s.set);var a,P,_;if(typeof m=="function")a=t(m,c,s,T,r,b,d,x,n),a!==void 0&&(h(r,a),r===0?f=a:r===1?(f=a.init,P=a.get||n.get,_=a.set||n.set,n={get:P,set:_}):n=a);else for(var D=m.length-1;D>=0;D--){var p=m[D];if(a=t(p,c,s,T,r,b,d,x,n),a!==void 0){h(r,a);var M;r===0?M=a:r===1?(M=a.init,P=a.get||n.get,_=a.set||n.set,n={get:P,set:_}):n=a,M!==void 0&&(f===void 0?f=M:typeof f=="function"?f=[f,M]:f.push(M))}}if(r===0||r===1){if(f===void 0)f=function(I,E){return E};else if(typeof f!="function"){var O=f;f=function(I,E){for(var N=E,L=0;L<O.length;L++)N=O[L].call(I,N);return N}}else{var z=f;f=function(I,E){return z.call(I,E)}}l.push(f)}r!==0&&(r===1?(s.get=n.get,s.set=n.set):r===2?s.value=n:r===3?s.get=n:r===4&&(s.set=n),d?r===1?(l.push(function(I,E){return n.get.call(I,E)}),l.push(function(I,E){return n.set.call(I,E)})):r===2?l.push(n):l.push(function(I,E){return n.call(I,E)}):Object.defineProperty(o,c,s))}function y(l,o,u){for(var c=[],r,b,d=new Map,T=new Map,x=0;x<o.length;x++){var m=o[x];if(Array.isArray(m)){var s=m[1],f=m[2],n=m.length>3,a=s>=5,P,_;if(a?(P=l,s=s-5,b=b||[],_=b):(P=l.prototype,r=r||[],_=r),s!==0&&!n){var D=a?T:d,p=D.get(f)||0;if(p===!0||p===3&&s!==4||p===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!p&&s>2?D.set(f,s):D.set(f,!0)}g(c,P,m,f,s,a,n,_,u)}}return w(c,r),w(c,b),c}function w(l,o){o&&l.push(function(u){for(var c=0;c<o.length;c++)o[c].call(u);return u})}function C(l,o,u){if(o.length>0){for(var c=[],r=l,b=l.name,d=o.length-1;d>=0;d--){var T={v:!1};try{var x=o[d](r,{kind:"class",name:b,addInitializer:v(c,T),metadata:u})}finally{T.v=!0}x!==void 0&&(h(10,x),r=x)}return[S(r,u),function(){for(var m=0;m<c.length;m++)c[m].call(r)}]}}function S(l,o){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,u,c,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var d=Object.create(b===void 0?null:b),T=y(o,u,d);return c.length||S(o,d),{e:T,get c(){return C(o,c,d)}}}}function Xo(v,t,e,i){return(Xo=Hc())(v,t,e,i)}var Yo,Bo,Wo,Zo,qo,Jo,$o,Go,Uo,It;Yo=$({selector:"kg-button",template:Vo,style:jo}),Wo=V.state(),Zo=V.state(),qo=B(),Jo=B();var Ho=class{static{({e:[$o,Go,Uo],c:[It,Bo]}=Xo(this,[[Wo,1,"mSelected"],[Zo,1,"mType"],[qo,3,"selected"],[Jo,3,"type"]],[Yo]))}constructor(){this.mType="primary",this.mSelected=!1}#t=(Uo(this),$o(this));get mSelected(){return this.#t}set mSelected(t){this.#t=t}#e=Go(this);get mType(){return this.#e}set mType(t){this.#e=t}get selected(){return this.mSelected}set selected(t){this.mSelected=this.parseBoolean(t)}get type(){return this.mType}set type(t){if(t!=="primary"&&t!=="secondary"){this.mType="secondary";return}this.mType=t}parseBoolean(t){if(typeof t=="string"){if(t==="")return!0;let e=t.toLowerCase();if(e==="true"||e==="false")return e==="true"}return!!t}static{Bo()}};var Ko=`:host {\r
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
}`;var Qo=`<div class="icon">i</div>\r
<div class="information">\r
    $slot\r
</div>\r
`;function Wc(){function v(l,o){return function(c){e(o,"addInitializer"),i(c,"An initializer"),l.push(c)}}function t(l,o,u,c,r,b,d,T,x){var m;switch(r){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var s={kind:m,name:d?"#"+o:o,static:b,private:d,metadata:T},f={v:!1};s.addInitializer=v(c,f);var n,a;if(r===0?d?(n=u.get,a=u.set):(n=function(){return this[o]},a=function(p){this[o]=p}):r===2?n=function(){return u.value}:((r===1||r===3)&&(n=function(){return u.get.call(this)}),(r===1||r===4)&&(a=function(p){u.set.call(this,p)})),d)s.access=n&&a?{get:n,set:a}:n?{get:n}:{set:a};else{if(n){var P=n;n=function(p){return arguments.length===0&&(p=this),P.call(p)}}if(a){var _=a;a=function(p,M){return arguments.length===1&&(M=p,p=this),_.call(p,M)}}var D=function(p){return o in p};s.access=n&&a?{has:D,get:n,set:a}:n?{has:D,get:n}:{has:D,set:a}}try{return l(x,s)}finally{f.v=!0}}function e(l,o){if(l.v)throw new Error("attempted to call "+o+" after decoration was finished")}function i(l,o){if(typeof l!="function")throw new TypeError(o+" must be a function")}function h(l,o){var u=typeof o;if(l===1){if(u!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&i(o.get,"accessor.get"),o.set!==void 0&&i(o.set,"accessor.set"),o.init!==void 0&&i(o.init,"accessor.init")}else if(u!=="function"){var c;throw l===0?c="field":l===10?c="class":c="method",new TypeError(c+" decorators must return a function or void 0")}}function g(l,o,u,c,r,b,d,T,x){var m=u[0],s,f,n;d?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,c)),r===1?n={get:s.get,set:s.set}:r===2?n=s.value:r===3?n=s.get:r===4&&(n=s.set);var a,P,_;if(typeof m=="function")a=t(m,c,s,T,r,b,d,x,n),a!==void 0&&(h(r,a),r===0?f=a:r===1?(f=a.init,P=a.get||n.get,_=a.set||n.set,n={get:P,set:_}):n=a);else for(var D=m.length-1;D>=0;D--){var p=m[D];if(a=t(p,c,s,T,r,b,d,x,n),a!==void 0){h(r,a);var M;r===0?M=a:r===1?(M=a.init,P=a.get||n.get,_=a.set||n.set,n={get:P,set:_}):n=a,M!==void 0&&(f===void 0?f=M:typeof f=="function"?f=[f,M]:f.push(M))}}if(r===0||r===1){if(f===void 0)f=function(I,E){return E};else if(typeof f!="function"){var O=f;f=function(I,E){for(var N=E,L=0;L<O.length;L++)N=O[L].call(I,N);return N}}else{var z=f;f=function(I,E){return z.call(I,E)}}l.push(f)}r!==0&&(r===1?(s.get=n.get,s.set=n.set):r===2?s.value=n:r===3?s.get=n:r===4&&(s.set=n),d?r===1?(l.push(function(I,E){return n.get.call(I,E)}),l.push(function(I,E){return n.set.call(I,E)})):r===2?l.push(n):l.push(function(I,E){return n.call(I,E)}):Object.defineProperty(o,c,s))}function y(l,o,u){for(var c=[],r,b,d=new Map,T=new Map,x=0;x<o.length;x++){var m=o[x];if(Array.isArray(m)){var s=m[1],f=m[2],n=m.length>3,a=s>=5,P,_;if(a?(P=l,s=s-5,b=b||[],_=b):(P=l.prototype,r=r||[],_=r),s!==0&&!n){var D=a?T:d,p=D.get(f)||0;if(p===!0||p===3&&s!==4||p===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!p&&s>2?D.set(f,s):D.set(f,!0)}g(c,P,m,f,s,a,n,_,u)}}return w(c,r),w(c,b),c}function w(l,o){o&&l.push(function(u){for(var c=0;c<o.length;c++)o[c].call(u);return u})}function C(l,o,u){if(o.length>0){for(var c=[],r=l,b=l.name,d=o.length-1;d>=0;d--){var T={v:!1};try{var x=o[d](r,{kind:"class",name:b,addInitializer:v(c,T),metadata:u})}finally{T.v=!0}x!==void 0&&(h(10,x),r=x)}return[S(r,u),function(){for(var m=0;m<c.length;m++)c[m].call(r)}]}}function S(l,o){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,u,c,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var d=Object.create(b===void 0?null:b),T=y(o,u,d);return c.length||S(o,d),{e:T,get c(){return C(o,c,d)}}}}function en(v,t,e,i){return(en=Wc())(v,t,e,i)}var rn,ko,on;rn=$({selector:"kg-information",template:Qo,style:Ko});var tn=class{static{({c:[on,ko]}=en(this,[],[rn]))}static{ko()}};var nn=`:host {\r
    --input-accent-color: red;\r
    --input-text-color: red;\r
    --input-border-radius: 4px;\r
    --input-background-color: transparent;\r
\r
    position: relative;\r
    box-sizing: border-box;\r
    display: flex;\r
    align-items: center;\r
    justify-content: center;\r
    cursor: text;\r
\r
    /* Set a default font size the component use for scaling its em values */\r
    font-size: 1rem;\r
\r
    /* Shared box. Transparent border keeps the size stable while the accent border animates. */\r
    padding: 0.4rem 0.75rem;\r
    border: 1px solid transparent;\r
    border-radius: var(--input-border-radius);\r
    color: var(--input-text-color);\r
    background-color: transparent;\r
\r
    /* Smooth transition for all */\r
    transition: border-color 0.15s, color 0.15s, background-color 0.15s;\r
}\r
\r
.input {\r
    box-sizing: border-box;\r
    display: flex;\r
    align-items: center;\r
    justify-content: center;\r
    width: 100%;\r
\r
    &::after {\r
        position: absolute;\r
        content: '';\r
        border-radius: var(--input-border-radius);\r
        border: 1px solid var(--input-accent-color);\r
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
 * Native input reset. Blends the control into the shared box.\r
 */\r
.input-field {\r
    box-sizing: border-box;\r
    width: 100%;\r
    margin: 0;\r
    padding: 0;\r
\r
    border: none;\r
    outline: none;\r
    color: inherit;\r
    font: inherit;\r
    cursor: inherit;\r
    background-color: var(--input-background-color);\r
\r
    /* Text inside the field stays selectable. */\r
    user-select: text;\r
\r
    &::placeholder {\r
        color: currentColor;\r
        opacity: 0.5;\r
    }\r
}\r
\r
/*\r
 * Shared user interactions.\r
 */\r
\r
:host(:hover),\r
:host(:active),\r
:host(:focus-within) {\r
    .input::after {\r
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
/*\r
 * Disabled state. Dims the field and suppresses the border animation.\r
 */\r
:host([disabled]:not([disabled='false'])) {\r
    cursor: not-allowed;\r
    opacity: 0.5;\r
\r
    .input::after {\r
        opacity: 0;\r
    }\r
}\r
`;var sn=`<div class="input">\r
    <input class="input-field" [type]="this.type" [(value)]="this.value" [disabled]="this.disabled" placeholder="{{this.placeholder}}" (change)="this.onChange($event)" />\r
</div>\r
`;function Jc(){function v(l,o){return function(c){e(o,"addInitializer"),i(c,"An initializer"),l.push(c)}}function t(l,o,u,c,r,b,d,T,x){var m;switch(r){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var s={kind:m,name:d?"#"+o:o,static:b,private:d,metadata:T},f={v:!1};s.addInitializer=v(c,f);var n,a;if(r===0?d?(n=u.get,a=u.set):(n=function(){return this[o]},a=function(p){this[o]=p}):r===2?n=function(){return u.value}:((r===1||r===3)&&(n=function(){return u.get.call(this)}),(r===1||r===4)&&(a=function(p){u.set.call(this,p)})),d)s.access=n&&a?{get:n,set:a}:n?{get:n}:{set:a};else{if(n){var P=n;n=function(p){return arguments.length===0&&(p=this),P.call(p)}}if(a){var _=a;a=function(p,M){return arguments.length===1&&(M=p,p=this),_.call(p,M)}}var D=function(p){return o in p};s.access=n&&a?{has:D,get:n,set:a}:n?{has:D,get:n}:{has:D,set:a}}try{return l(x,s)}finally{f.v=!0}}function e(l,o){if(l.v)throw new Error("attempted to call "+o+" after decoration was finished")}function i(l,o){if(typeof l!="function")throw new TypeError(o+" must be a function")}function h(l,o){var u=typeof o;if(l===1){if(u!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&i(o.get,"accessor.get"),o.set!==void 0&&i(o.set,"accessor.set"),o.init!==void 0&&i(o.init,"accessor.init")}else if(u!=="function"){var c;throw l===0?c="field":l===10?c="class":c="method",new TypeError(c+" decorators must return a function or void 0")}}function g(l,o,u,c,r,b,d,T,x){var m=u[0],s,f,n;d?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,c)),r===1?n={get:s.get,set:s.set}:r===2?n=s.value:r===3?n=s.get:r===4&&(n=s.set);var a,P,_;if(typeof m=="function")a=t(m,c,s,T,r,b,d,x,n),a!==void 0&&(h(r,a),r===0?f=a:r===1?(f=a.init,P=a.get||n.get,_=a.set||n.set,n={get:P,set:_}):n=a);else for(var D=m.length-1;D>=0;D--){var p=m[D];if(a=t(p,c,s,T,r,b,d,x,n),a!==void 0){h(r,a);var M;r===0?M=a:r===1?(M=a.init,P=a.get||n.get,_=a.set||n.set,n={get:P,set:_}):n=a,M!==void 0&&(f===void 0?f=M:typeof f=="function"?f=[f,M]:f.push(M))}}if(r===0||r===1){if(f===void 0)f=function(I,E){return E};else if(typeof f!="function"){var O=f;f=function(I,E){for(var N=E,L=0;L<O.length;L++)N=O[L].call(I,N);return N}}else{var z=f;f=function(I,E){return z.call(I,E)}}l.push(f)}r!==0&&(r===1?(s.get=n.get,s.set=n.set):r===2?s.value=n:r===3?s.get=n:r===4&&(s.set=n),d?r===1?(l.push(function(I,E){return n.get.call(I,E)}),l.push(function(I,E){return n.set.call(I,E)})):r===2?l.push(n):l.push(function(I,E){return n.call(I,E)}):Object.defineProperty(o,c,s))}function y(l,o,u){for(var c=[],r,b,d=new Map,T=new Map,x=0;x<o.length;x++){var m=o[x];if(Array.isArray(m)){var s=m[1],f=m[2],n=m.length>3,a=s>=5,P,_;if(a?(P=l,s=s-5,b=b||[],_=b):(P=l.prototype,r=r||[],_=r),s!==0&&!n){var D=a?T:d,p=D.get(f)||0;if(p===!0||p===3&&s!==4||p===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!p&&s>2?D.set(f,s):D.set(f,!0)}g(c,P,m,f,s,a,n,_,u)}}return w(c,r),w(c,b),c}function w(l,o){o&&l.push(function(u){for(var c=0;c<o.length;c++)o[c].call(u);return u})}function C(l,o,u){if(o.length>0){for(var c=[],r=l,b=l.name,d=o.length-1;d>=0;d--){var T={v:!1};try{var x=o[d](r,{kind:"class",name:b,addInitializer:v(c,T),metadata:u})}finally{T.v=!0}x!==void 0&&(h(10,x),r=x)}return[S(r,u),function(){for(var m=0;m<c.length;m++)c[m].call(r)}]}}function S(l,o){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,u,c,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var d=Object.create(b===void 0?null:b),T=y(o,u,d);return c.length||S(o,d),{e:T,get c(){return C(o,c,d)}}}}function pn(v,t,e,i){return(pn=Jc())(v,t,e,i)}var gn,an,vn,yn,bn,wn,xn,Tn,Dn,En,Cn,ln,cn,un,hn,fn,mn,nr;gn=$({selector:"kg-input",template:sn,style:nn}),vn=B(),yn=V.state(),bn=B(),wn=V.state(),xn=B(),Tn=V.state(),Dn=V.state(),En=B(),Cn=tt("change");var dn=class{static{({e:[ln,cn,un,hn,fn,mn],c:[nr,an]}=pn(this,[[[vn,yn],1,"placeholder"],[[bn,wn],1,"type"],[[xn,Tn],1,"value"],[Dn,1,"mDisabled"],[En,3,"disabled"],[Cn,1,"mChange"]],[gn]))}constructor(){this.value="",this.placeholder="",this.type="text",this.mDisabled=!1}#t=(mn(this),ln(this));get placeholder(){return this.#t}set placeholder(t){this.#t=t}#e=cn(this);get type(){return this.#e}set type(t){this.#e=t}#r=un(this);get value(){return this.#r}set value(t){this.#r=t}#o=hn(this);get mDisabled(){return this.#o}set mDisabled(t){this.#o=t}get disabled(){return this.mDisabled}set disabled(t){this.mDisabled=this.parseBoolean(t)}#n=fn(this);get mChange(){return this.#n}set mChange(t){this.#n=t}onChange(t){let e=t.target;this.value=e.value,this.mChange.dispatchEvent(this.value)}parseBoolean(t){if(typeof t=="string"){if(t==="")return!0;let e=t.toLowerCase();if(e==="true"||e==="false")return e==="true"}return!!t}static{an()}};var Pn=`:host {\r
    --list-item-bar-default-color: red;\r
    --list-item-icon-color: red;\r
    --list-item-background-color: red;\r
    --list-item-border-radius: 4px;\r
\r
    display: flex;\r
    box-sizing: border-box;\r
    align-items: stretch;\r
\r
    padding: 0.4em 0.6em 0.4em 0.8em;\r
}\r
\r
.icon {\r
    display: flex;\r
    flex-shrink: 0;\r
    align-items: center;\r
    justify-content: center;\r
    padding: 0 0.8em;\r
    color: var(--list-item-icon-color);\r
    font-weight: bold;\r
\r
    /* Use icons left border as a destinct colored "bar" */\r
    border-left: 0.25em solid var(--list-item-bar-color, var(--list-item-bar-default-color));\r
}\r
\r
.content {\r
    flex: 1;\r
    display: flex;\r
    align-items: center;\r
    min-width: 0;\r
}\r
\r
/*\r
 * Shit again. Use hosts attribute as styling.\r
 */\r
:host([selectable]:not([selectable='false'])) {\r
    cursor: pointer;\r
    padding: 0.3em 0.6em 0.3em 0.5em;\r
    border-radius: var(--list-item-border-radius);\r
    transition: background-color 0.15s, scale 0.15s;\r
}\r
\r
:host([selectable]:not([selectable='false']):hover),\r
:host([selectable]:not([selectable='false']):active),\r
:host([selectable]:not([selectable='false'])[selected]:not([selected='false'])) {\r
    background-color: var(--list-item-background-color);\r
}\r
\r
:host([selectable]:not([selectable='false']):active) {\r
    scale: 0.98;\r
}\r
`;var _n=`<div class="icon" style="{{ this.barcolor !== '' ? '--list-item-bar-color: ' + this.barcolor : '' }}">{{this.icon}}</div>\r
<div class="content">\r
    $slot\r
</div>\r
`;function kc(){function v(l,o){return function(c){e(o,"addInitializer"),i(c,"An initializer"),l.push(c)}}function t(l,o,u,c,r,b,d,T,x){var m;switch(r){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var s={kind:m,name:d?"#"+o:o,static:b,private:d,metadata:T},f={v:!1};s.addInitializer=v(c,f);var n,a;if(r===0?d?(n=u.get,a=u.set):(n=function(){return this[o]},a=function(p){this[o]=p}):r===2?n=function(){return u.value}:((r===1||r===3)&&(n=function(){return u.get.call(this)}),(r===1||r===4)&&(a=function(p){u.set.call(this,p)})),d)s.access=n&&a?{get:n,set:a}:n?{get:n}:{set:a};else{if(n){var P=n;n=function(p){return arguments.length===0&&(p=this),P.call(p)}}if(a){var _=a;a=function(p,M){return arguments.length===1&&(M=p,p=this),_.call(p,M)}}var D=function(p){return o in p};s.access=n&&a?{has:D,get:n,set:a}:n?{has:D,get:n}:{has:D,set:a}}try{return l(x,s)}finally{f.v=!0}}function e(l,o){if(l.v)throw new Error("attempted to call "+o+" after decoration was finished")}function i(l,o){if(typeof l!="function")throw new TypeError(o+" must be a function")}function h(l,o){var u=typeof o;if(l===1){if(u!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&i(o.get,"accessor.get"),o.set!==void 0&&i(o.set,"accessor.set"),o.init!==void 0&&i(o.init,"accessor.init")}else if(u!=="function"){var c;throw l===0?c="field":l===10?c="class":c="method",new TypeError(c+" decorators must return a function or void 0")}}function g(l,o,u,c,r,b,d,T,x){var m=u[0],s,f,n;d?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,c)),r===1?n={get:s.get,set:s.set}:r===2?n=s.value:r===3?n=s.get:r===4&&(n=s.set);var a,P,_;if(typeof m=="function")a=t(m,c,s,T,r,b,d,x,n),a!==void 0&&(h(r,a),r===0?f=a:r===1?(f=a.init,P=a.get||n.get,_=a.set||n.set,n={get:P,set:_}):n=a);else for(var D=m.length-1;D>=0;D--){var p=m[D];if(a=t(p,c,s,T,r,b,d,x,n),a!==void 0){h(r,a);var M;r===0?M=a:r===1?(M=a.init,P=a.get||n.get,_=a.set||n.set,n={get:P,set:_}):n=a,M!==void 0&&(f===void 0?f=M:typeof f=="function"?f=[f,M]:f.push(M))}}if(r===0||r===1){if(f===void 0)f=function(I,E){return E};else if(typeof f!="function"){var O=f;f=function(I,E){for(var N=E,L=0;L<O.length;L++)N=O[L].call(I,N);return N}}else{var z=f;f=function(I,E){return z.call(I,E)}}l.push(f)}r!==0&&(r===1?(s.get=n.get,s.set=n.set):r===2?s.value=n:r===3?s.get=n:r===4&&(s.set=n),d?r===1?(l.push(function(I,E){return n.get.call(I,E)}),l.push(function(I,E){return n.set.call(I,E)})):r===2?l.push(n):l.push(function(I,E){return n.call(I,E)}):Object.defineProperty(o,c,s))}function y(l,o,u){for(var c=[],r,b,d=new Map,T=new Map,x=0;x<o.length;x++){var m=o[x];if(Array.isArray(m)){var s=m[1],f=m[2],n=m.length>3,a=s>=5,P,_;if(a?(P=l,s=s-5,b=b||[],_=b):(P=l.prototype,r=r||[],_=r),s!==0&&!n){var D=a?T:d,p=D.get(f)||0;if(p===!0||p===3&&s!==4||p===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!p&&s>2?D.set(f,s):D.set(f,!0)}g(c,P,m,f,s,a,n,_,u)}}return w(c,r),w(c,b),c}function w(l,o){o&&l.push(function(u){for(var c=0;c<o.length;c++)o[c].call(u);return u})}function C(l,o,u){if(o.length>0){for(var c=[],r=l,b=l.name,d=o.length-1;d>=0;d--){var T={v:!1};try{var x=o[d](r,{kind:"class",name:b,addInitializer:v(c,T),metadata:u})}finally{T.v=!0}x!==void 0&&(h(10,x),r=x)}return[S(r,u),function(){for(var m=0;m<c.length;m++)c[m].call(r)}]}}function S(l,o){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,u,c,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var d=Object.create(b===void 0?null:b),T=y(o,u,d);return c.length||S(o,d),{e:T,get c(){return C(o,c,d)}}}}function On(v,t,e,i){return(On=kc())(v,t,e,i)}var Fn,In,zn,jn,Vn,Bn,$n,Gn,Un,Hn,Mn,Sn,An,Nn,Ln,Yt;Fn=$({selector:"kg-list-item",template:_n,style:Pn}),zn=B(),jn=V.state(),Vn=B(),Bn=V.state(),$n=V.state(),Gn=B(),Un=V.state(),Hn=B();var Rn=class{static{({e:[Mn,Sn,An,Nn,Ln],c:[Yt,In]}=On(this,[[[zn,jn],1,"icon"],[[Vn,Bn],1,"barcolor"],[$n,1,"mSelectable"],[Gn,3,"selectable"],[Un,1,"mSelected"],[Hn,3,"selected"]],[Fn]))}constructor(){this.icon="",this.barcolor="",this.mSelectable=!1,this.mSelected=!1}#t=(Ln(this),Mn(this));get icon(){return this.#t}set icon(t){this.#t=t}#e=Sn(this);get barcolor(){return this.#e}set barcolor(t){this.#e=t}#r=An(this);get mSelectable(){return this.#r}set mSelectable(t){this.#r=t}get selectable(){return this.mSelectable}set selectable(t){this.mSelectable=this.parseBoolean(t)}#o=Nn(this);get mSelected(){return this.#o}set mSelected(t){this.#o=t}get selected(){return this.mSelected}set selected(t){this.mSelected=this.parseBoolean(t)}parseBoolean(t){if(typeof t=="string"){if(t==="")return!0;let e=t.toLowerCase();if(e==="true"||e==="false")return e==="true"}return!!t}static{In()}};var Xn=`:host {\r
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
}`;var Yn="$slot";function ru(){function v(l,o){return function(c){e(o,"addInitializer"),i(c,"An initializer"),l.push(c)}}function t(l,o,u,c,r,b,d,T,x){var m;switch(r){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var s={kind:m,name:d?"#"+o:o,static:b,private:d,metadata:T},f={v:!1};s.addInitializer=v(c,f);var n,a;if(r===0?d?(n=u.get,a=u.set):(n=function(){return this[o]},a=function(p){this[o]=p}):r===2?n=function(){return u.value}:((r===1||r===3)&&(n=function(){return u.get.call(this)}),(r===1||r===4)&&(a=function(p){u.set.call(this,p)})),d)s.access=n&&a?{get:n,set:a}:n?{get:n}:{set:a};else{if(n){var P=n;n=function(p){return arguments.length===0&&(p=this),P.call(p)}}if(a){var _=a;a=function(p,M){return arguments.length===1&&(M=p,p=this),_.call(p,M)}}var D=function(p){return o in p};s.access=n&&a?{has:D,get:n,set:a}:n?{has:D,get:n}:{has:D,set:a}}try{return l(x,s)}finally{f.v=!0}}function e(l,o){if(l.v)throw new Error("attempted to call "+o+" after decoration was finished")}function i(l,o){if(typeof l!="function")throw new TypeError(o+" must be a function")}function h(l,o){var u=typeof o;if(l===1){if(u!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&i(o.get,"accessor.get"),o.set!==void 0&&i(o.set,"accessor.set"),o.init!==void 0&&i(o.init,"accessor.init")}else if(u!=="function"){var c;throw l===0?c="field":l===10?c="class":c="method",new TypeError(c+" decorators must return a function or void 0")}}function g(l,o,u,c,r,b,d,T,x){var m=u[0],s,f,n;d?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,c)),r===1?n={get:s.get,set:s.set}:r===2?n=s.value:r===3?n=s.get:r===4&&(n=s.set);var a,P,_;if(typeof m=="function")a=t(m,c,s,T,r,b,d,x,n),a!==void 0&&(h(r,a),r===0?f=a:r===1?(f=a.init,P=a.get||n.get,_=a.set||n.set,n={get:P,set:_}):n=a);else for(var D=m.length-1;D>=0;D--){var p=m[D];if(a=t(p,c,s,T,r,b,d,x,n),a!==void 0){h(r,a);var M;r===0?M=a:r===1?(M=a.init,P=a.get||n.get,_=a.set||n.set,n={get:P,set:_}):n=a,M!==void 0&&(f===void 0?f=M:typeof f=="function"?f=[f,M]:f.push(M))}}if(r===0||r===1){if(f===void 0)f=function(I,E){return E};else if(typeof f!="function"){var O=f;f=function(I,E){for(var N=E,L=0;L<O.length;L++)N=O[L].call(I,N);return N}}else{var z=f;f=function(I,E){return z.call(I,E)}}l.push(f)}r!==0&&(r===1?(s.get=n.get,s.set=n.set):r===2?s.value=n:r===3?s.get=n:r===4&&(s.set=n),d?r===1?(l.push(function(I,E){return n.get.call(I,E)}),l.push(function(I,E){return n.set.call(I,E)})):r===2?l.push(n):l.push(function(I,E){return n.call(I,E)}):Object.defineProperty(o,c,s))}function y(l,o,u){for(var c=[],r,b,d=new Map,T=new Map,x=0;x<o.length;x++){var m=o[x];if(Array.isArray(m)){var s=m[1],f=m[2],n=m.length>3,a=s>=5,P,_;if(a?(P=l,s=s-5,b=b||[],_=b):(P=l.prototype,r=r||[],_=r),s!==0&&!n){var D=a?T:d,p=D.get(f)||0;if(p===!0||p===3&&s!==4||p===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!p&&s>2?D.set(f,s):D.set(f,!0)}g(c,P,m,f,s,a,n,_,u)}}return w(c,r),w(c,b),c}function w(l,o){o&&l.push(function(u){for(var c=0;c<o.length;c++)o[c].call(u);return u})}function C(l,o,u){if(o.length>0){for(var c=[],r=l,b=l.name,d=o.length-1;d>=0;d--){var T={v:!1};try{var x=o[d](r,{kind:"class",name:b,addInitializer:v(c,T),metadata:u})}finally{T.v=!0}x!==void 0&&(h(10,x),r=x)}return[S(r,u),function(){for(var m=0;m<c.length;m++)c[m].call(r)}]}}function S(l,o){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,u,c,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var d=Object.create(b===void 0?null:b),T=y(o,u,d);return c.length||S(o,d),{e:T,get c(){return C(o,c,d)}}}}function qn(v,t,e,i){return(qn=ru())(v,t,e,i)}var Jn,Wn,ae;Jn=$({selector:"kg-popup",template:Yn,style:Xn});var Zn=class{static{({c:[ae,Wn]}=qn(this,[],[Jn]))}static{Wn()}};var Kn=`:host {\r
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
}`;var Qn=`<!-- In order of top-left clockwise. Needed for styling -->\r
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
</div>`;function iu(){function v(l,o){return function(c){e(o,"addInitializer"),i(c,"An initializer"),l.push(c)}}function t(l,o,u,c,r,b,d,T,x){var m;switch(r){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var s={kind:m,name:d?"#"+o:o,static:b,private:d,metadata:T},f={v:!1};s.addInitializer=v(c,f);var n,a;if(r===0?d?(n=u.get,a=u.set):(n=function(){return this[o]},a=function(p){this[o]=p}):r===2?n=function(){return u.value}:((r===1||r===3)&&(n=function(){return u.get.call(this)}),(r===1||r===4)&&(a=function(p){u.set.call(this,p)})),d)s.access=n&&a?{get:n,set:a}:n?{get:n}:{set:a};else{if(n){var P=n;n=function(p){return arguments.length===0&&(p=this),P.call(p)}}if(a){var _=a;a=function(p,M){return arguments.length===1&&(M=p,p=this),_.call(p,M)}}var D=function(p){return o in p};s.access=n&&a?{has:D,get:n,set:a}:n?{has:D,get:n}:{has:D,set:a}}try{return l(x,s)}finally{f.v=!0}}function e(l,o){if(l.v)throw new Error("attempted to call "+o+" after decoration was finished")}function i(l,o){if(typeof l!="function")throw new TypeError(o+" must be a function")}function h(l,o){var u=typeof o;if(l===1){if(u!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&i(o.get,"accessor.get"),o.set!==void 0&&i(o.set,"accessor.set"),o.init!==void 0&&i(o.init,"accessor.init")}else if(u!=="function"){var c;throw l===0?c="field":l===10?c="class":c="method",new TypeError(c+" decorators must return a function or void 0")}}function g(l,o,u,c,r,b,d,T,x){var m=u[0],s,f,n;d?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,c)),r===1?n={get:s.get,set:s.set}:r===2?n=s.value:r===3?n=s.get:r===4&&(n=s.set);var a,P,_;if(typeof m=="function")a=t(m,c,s,T,r,b,d,x,n),a!==void 0&&(h(r,a),r===0?f=a:r===1?(f=a.init,P=a.get||n.get,_=a.set||n.set,n={get:P,set:_}):n=a);else for(var D=m.length-1;D>=0;D--){var p=m[D];if(a=t(p,c,s,T,r,b,d,x,n),a!==void 0){h(r,a);var M;r===0?M=a:r===1?(M=a.init,P=a.get||n.get,_=a.set||n.set,n={get:P,set:_}):n=a,M!==void 0&&(f===void 0?f=M:typeof f=="function"?f=[f,M]:f.push(M))}}if(r===0||r===1){if(f===void 0)f=function(I,E){return E};else if(typeof f!="function"){var O=f;f=function(I,E){for(var N=E,L=0;L<O.length;L++)N=O[L].call(I,N);return N}}else{var z=f;f=function(I,E){return z.call(I,E)}}l.push(f)}r!==0&&(r===1?(s.get=n.get,s.set=n.set):r===2?s.value=n:r===3?s.get=n:r===4&&(s.set=n),d?r===1?(l.push(function(I,E){return n.get.call(I,E)}),l.push(function(I,E){return n.set.call(I,E)})):r===2?l.push(n):l.push(function(I,E){return n.call(I,E)}):Object.defineProperty(o,c,s))}function y(l,o,u){for(var c=[],r,b,d=new Map,T=new Map,x=0;x<o.length;x++){var m=o[x];if(Array.isArray(m)){var s=m[1],f=m[2],n=m.length>3,a=s>=5,P,_;if(a?(P=l,s=s-5,b=b||[],_=b):(P=l.prototype,r=r||[],_=r),s!==0&&!n){var D=a?T:d,p=D.get(f)||0;if(p===!0||p===3&&s!==4||p===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!p&&s>2?D.set(f,s):D.set(f,!0)}g(c,P,m,f,s,a,n,_,u)}}return w(c,r),w(c,b),c}function w(l,o){o&&l.push(function(u){for(var c=0;c<o.length;c++)o[c].call(u);return u})}function C(l,o,u){if(o.length>0){for(var c=[],r=l,b=l.name,d=o.length-1;d>=0;d--){var T={v:!1};try{var x=o[d](r,{kind:"class",name:b,addInitializer:v(c,T),metadata:u})}finally{T.v=!0}x!==void 0&&(h(10,x),r=x)}return[S(r,u),function(){for(var m=0;m<c.length;m++)c[m].call(r)}]}}function S(l,o){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,u,c,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var d=Object.create(b===void 0?null:b),T=y(o,u,d);return c.length||S(o,d),{e:T,get c(){return C(o,c,d)}}}}function ii(v,t,e,i){return(ii=iu())(v,t,e,i)}var si,kn,ai,li,ci,ui,hi,fi,mi,di,pi,gi,vi,ti,ei,ri,oi,Wt;si=$({selector:"kg-resize-box",template:Qn,style:Kn}),ai=V.state({proxy:!0}),li=tt("resize"),ci=tt("resize-end"),ui=B(),hi=B(),fi=B(),mi=B(),di=B(),pi=B(),gi=B(),vi=B();var ni=class{static{({e:[ti,ei,ri,oi],c:[Wt,kn]}=ii(this,[[ai,1,"mConfiguration"],[li,1,"mResize"],[ci,1,"mResizeEnd"],[ui,3,"bottom"],[hi,3,"height"],[fi,3,"left"],[mi,3,"right"],[di,3,"snap"],[pi,3,"top"],[gi,3,"virtual"],[vi,3,"width"]],[si]))}constructor(t=F.use(U)){this.mComponentElement=t.element,this.mConfiguration={snap:1,isVirtual:!1,enabledDirections:{top:!1,right:!1,bottom:!1,left:!1}}}mComponentElement;#t=(oi(this),ti(this));get mConfiguration(){return this.#t}set mConfiguration(t){this.#t=t}#e=ei(this);get mResize(){return this.#e}set mResize(t){this.#e=t}#r=ri(this);get mResizeEnd(){return this.#r}set mResizeEnd(t){this.#r=t}get bottom(){return this.mConfiguration.enabledDirections.bottom}set bottom(t){this.mConfiguration.enabledDirections.bottom=this.parseBoolean(t)}get height(){return this.mComponentElement.clientHeight}set height(t){this.updateComponentHeight(t,!0)}get left(){return this.mConfiguration.enabledDirections.left}set left(t){this.mConfiguration.enabledDirections.left=this.parseBoolean(t)}get right(){return this.mConfiguration.enabledDirections.right}set right(t){this.mConfiguration.enabledDirections.right=this.parseBoolean(t)}get snap(){return this.mConfiguration.snap}set snap(t){this.mConfiguration.snap=parseInt(t.toString())}get top(){return this.mConfiguration.enabledDirections.top}set top(t){this.mConfiguration.enabledDirections.top=this.parseBoolean(t)}get virtual(){return this.mConfiguration.isVirtual}set virtual(t){this.mConfiguration.isVirtual=this.parseBoolean(t)}get width(){return this.mComponentElement.clientWidth}set width(t){this.updateComponentWidth(t,!0)}resizeCorner(t){this.handleResize(t,"both")}resizeHorizontal(t){this.handleResize(t,"horizontal")}resizeVertical(t){this.handleResize(t,"vertical")}applyComponentSize(t,e,i){let h=this.updateComponentWidth(e,!1),g=this.updateComponentHeight(i,!1);return(h!==this.width||g!==this.height)&&this.mResize.dispatchEvent(this.createResizeEvent(t,h,g,this.width,this.height)),[h,g]}createResizeEvent(t,e,i,h,g){let y=t;return e===h&&(y&=~(wt.right|wt.left)),i===g&&(y&=~(wt.top|wt.bottom)),new ir(e,i,y)}handleResize(t,e){t.preventDefault(),t.stopPropagation();let i=this.mComponentElement.getBoundingClientRect(),h=this.mComponentElement.offsetWidth?i.width/this.mComponentElement.offsetWidth:1,g=this.mComponentElement.offsetHeight?i.height/this.mComponentElement.offsetHeight:1,y=i.width/h,w=i.height/g,C=t.clientX,S=t.clientY,l=1;Math.abs(C-i.left)<Math.abs(C-i.right)&&(l=-1);let o=1;Math.abs(S-i.top)<Math.abs(S-i.bottom)&&(o=-1);let u=0;u+=l===1?wt.right:wt.left,u+=o===1?wt.bottom:wt.top;let c=y,r=w,b=T=>{let x=(T.clientX-C)/h*l,m=(T.clientY-S)/g*o,s=y+x,f=w+m;e==="horizontal"&&(s=y),e==="vertical"&&(f=w),[c,r]=this.applyComponentSize(u,s,f)},d=()=>{document.removeEventListener("pointermove",b),document.removeEventListener("pointerup",d),(c!==y||r!==w)&&this.mResizeEnd.dispatchEvent(this.createResizeEvent(u,c,r,y,w))};document.addEventListener("pointermove",b),document.addEventListener("pointerup",d)}parseBoolean(t){return!!(()=>{if(typeof t=="string"){if(t==="")return!0;let i=t.toLowerCase();if(["true","false"].includes(i))return i==="true"}return t})()}updateComponentHeight(t,e){if(!this.mConfiguration.enabledDirections.top&&!this.mConfiguration.enabledDirections.bottom)return this.height;t=Math.max(1,t);let i=parseFloat((Math.abs(t)/this.mConfiguration.snap).toFixed(5)),h=Math.ceil(i)*this.mConfiguration.snap*(t/Math.abs(t));return h=Math.max(0,h),(!this.mConfiguration.isVirtual||e)&&this.mComponentElement.style.setProperty("height",`${h}px`),h}updateComponentWidth(t,e){if(!this.mConfiguration.enabledDirections.left&&!this.mConfiguration.enabledDirections.right)return this.height;t=Math.max(1,t);let i=parseFloat((Math.abs(t)/this.mConfiguration.snap).toFixed(5)),h=Math.ceil(i)*this.mConfiguration.snap*(t/Math.abs(t));return h=Math.max(0,h),(!this.mConfiguration.isVirtual||e)&&this.mComponentElement.style.setProperty("width",`${h}px`),h}static{kn()}},ir=class{mHeight;mResizeHandle;mWidth;get height(){return this.mHeight}get resizeHandle(){return this.mResizeHandle}get width(){return this.mWidth}constructor(t,e,i){this.mHeight=e,this.mResizeHandle=i,this.mWidth=t}},wt={top:1,right:2,bottom:4,left:8};var yi=`:host {\r
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
`;var bi=`<!-- Four soft edge handles placed next to the panel. Top/bottom resize height, left/right resize width. -->\r
$if(this.top) {\r
    <div class="resize-handle horizontal top" (pointerdown)="this.resizeHorizontal($event)"></div>\r
}\r
$if(this.right) {\r
    <div class="resize-handle vertical right" (pointerdown)="this.resizeVertical($event)"></div>\r
}\r
$if(this.bottom) {\r
    <div class="resize-handle horizontal bottom" (pointerdown)="this.resizeHorizontal($event)"></div>\r
}\r
$if(this.left) {\r
    <div class="resize-handle vertical left" (pointerdown)="this.resizeVertical($event)"></div>\r
}\r
\r
<div class="content-container">\r
    $slot\r
</div>\r
`;function lu(){function v(l,o){return function(c){e(o,"addInitializer"),i(c,"An initializer"),l.push(c)}}function t(l,o,u,c,r,b,d,T,x){var m;switch(r){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var s={kind:m,name:d?"#"+o:o,static:b,private:d,metadata:T},f={v:!1};s.addInitializer=v(c,f);var n,a;if(r===0?d?(n=u.get,a=u.set):(n=function(){return this[o]},a=function(p){this[o]=p}):r===2?n=function(){return u.value}:((r===1||r===3)&&(n=function(){return u.get.call(this)}),(r===1||r===4)&&(a=function(p){u.set.call(this,p)})),d)s.access=n&&a?{get:n,set:a}:n?{get:n}:{set:a};else{if(n){var P=n;n=function(p){return arguments.length===0&&(p=this),P.call(p)}}if(a){var _=a;a=function(p,M){return arguments.length===1&&(M=p,p=this),_.call(p,M)}}var D=function(p){return o in p};s.access=n&&a?{has:D,get:n,set:a}:n?{has:D,get:n}:{has:D,set:a}}try{return l(x,s)}finally{f.v=!0}}function e(l,o){if(l.v)throw new Error("attempted to call "+o+" after decoration was finished")}function i(l,o){if(typeof l!="function")throw new TypeError(o+" must be a function")}function h(l,o){var u=typeof o;if(l===1){if(u!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&i(o.get,"accessor.get"),o.set!==void 0&&i(o.set,"accessor.set"),o.init!==void 0&&i(o.init,"accessor.init")}else if(u!=="function"){var c;throw l===0?c="field":l===10?c="class":c="method",new TypeError(c+" decorators must return a function or void 0")}}function g(l,o,u,c,r,b,d,T,x){var m=u[0],s,f,n;d?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,c)),r===1?n={get:s.get,set:s.set}:r===2?n=s.value:r===3?n=s.get:r===4&&(n=s.set);var a,P,_;if(typeof m=="function")a=t(m,c,s,T,r,b,d,x,n),a!==void 0&&(h(r,a),r===0?f=a:r===1?(f=a.init,P=a.get||n.get,_=a.set||n.set,n={get:P,set:_}):n=a);else for(var D=m.length-1;D>=0;D--){var p=m[D];if(a=t(p,c,s,T,r,b,d,x,n),a!==void 0){h(r,a);var M;r===0?M=a:r===1?(M=a.init,P=a.get||n.get,_=a.set||n.set,n={get:P,set:_}):n=a,M!==void 0&&(f===void 0?f=M:typeof f=="function"?f=[f,M]:f.push(M))}}if(r===0||r===1){if(f===void 0)f=function(I,E){return E};else if(typeof f!="function"){var O=f;f=function(I,E){for(var N=E,L=0;L<O.length;L++)N=O[L].call(I,N);return N}}else{var z=f;f=function(I,E){return z.call(I,E)}}l.push(f)}r!==0&&(r===1?(s.get=n.get,s.set=n.set):r===2?s.value=n:r===3?s.get=n:r===4&&(s.set=n),d?r===1?(l.push(function(I,E){return n.get.call(I,E)}),l.push(function(I,E){return n.set.call(I,E)})):r===2?l.push(n):l.push(function(I,E){return n.call(I,E)}):Object.defineProperty(o,c,s))}function y(l,o,u){for(var c=[],r,b,d=new Map,T=new Map,x=0;x<o.length;x++){var m=o[x];if(Array.isArray(m)){var s=m[1],f=m[2],n=m.length>3,a=s>=5,P,_;if(a?(P=l,s=s-5,b=b||[],_=b):(P=l.prototype,r=r||[],_=r),s!==0&&!n){var D=a?T:d,p=D.get(f)||0;if(p===!0||p===3&&s!==4||p===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!p&&s>2?D.set(f,s):D.set(f,!0)}g(c,P,m,f,s,a,n,_,u)}}return w(c,r),w(c,b),c}function w(l,o){o&&l.push(function(u){for(var c=0;c<o.length;c++)o[c].call(u);return u})}function C(l,o,u){if(o.length>0){for(var c=[],r=l,b=l.name,d=o.length-1;d>=0;d--){var T={v:!1};try{var x=o[d](r,{kind:"class",name:b,addInitializer:v(c,T),metadata:u})}finally{T.v=!0}x!==void 0&&(h(10,x),r=x)}return[S(r,u),function(){for(var m=0;m<c.length;m++)c[m].call(r)}]}}function S(l,o){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,u,c,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var d=Object.create(b===void 0?null:b),T=y(o,u,d);return c.length||S(o,d),{e:T,get c(){return C(o,c,d)}}}}function Pi(v,t,e,i){return(Pi=lu())(v,t,e,i)}var _i,wi,Ii,Mi,Si,Ai,Ni,Li,Ri,Oi,Fi,xi,Ti,Di,Ei,ar;_i=$({selector:"kg-resize-panel",template:bi,style:yi}),Ii=V.state({proxy:!0}),Mi=tt("resize"),Si=tt("resize-end"),Ai=B(),Ni=B(),Li=B(),Ri=B(),Oi=B(),Fi=B();var Ci=class{static{({e:[xi,Ti,Di,Ei],c:[ar,wi]}=Pi(this,[[Ii,1,"mConfiguration"],[Mi,1,"mResize"],[Si,1,"mResizeEnd"],[Ai,3,"bottom"],[Ni,3,"height"],[Li,3,"left"],[Ri,3,"right"],[Oi,3,"top"],[Fi,3,"width"]],[_i]))}constructor(t=F.use(U)){this.mComponentElement=t.element,this.mConfiguration={enabledDirections:{top:!1,right:!1,bottom:!1,left:!1}}}mComponentElement;#t=(Ei(this),xi(this));get mConfiguration(){return this.#t}set mConfiguration(t){this.#t=t}#e=Ti(this);get mResize(){return this.#e}set mResize(t){this.#e=t}#r=Di(this);get mResizeEnd(){return this.#r}set mResizeEnd(t){this.#r=t}get bottom(){return this.mConfiguration.enabledDirections.bottom}set bottom(t){this.mConfiguration.enabledDirections.bottom=this.parseBoolean(t)}get height(){return this.mComponentElement.clientHeight}set height(t){this.updateComponentHeight(t)}get left(){return this.mConfiguration.enabledDirections.left}set left(t){this.mConfiguration.enabledDirections.left=this.parseBoolean(t)}get right(){return this.mConfiguration.enabledDirections.right}set right(t){this.mConfiguration.enabledDirections.right=this.parseBoolean(t)}get top(){return this.mConfiguration.enabledDirections.top}set top(t){this.mConfiguration.enabledDirections.top=this.parseBoolean(t)}get width(){return this.mComponentElement.clientWidth}set width(t){this.updateComponentWidth(t)}resizeHorizontal(t){this.handleResize(t,"horizontal")}resizeVertical(t){this.handleResize(t,"vertical")}applyComponentSize(t,e,i){let h=this.updateComponentWidth(e),g=this.updateComponentHeight(i);return(h!==this.width||g!==this.height)&&this.mResize.dispatchEvent(this.createResizeEvent(t,h,g,this.width,this.height)),[h,g]}createResizeEvent(t,e,i,h,g){let y=t;return e===h&&(y&=~(Ft.right|Ft.left)),i===g&&(y&=~(Ft.top|Ft.bottom)),new sr(e,i,y)}handleResize(t,e){t.preventDefault(),t.stopPropagation();let i=this.mComponentElement.getBoundingClientRect(),h=this.mComponentElement.offsetWidth?i.width/this.mComponentElement.offsetWidth:1,g=this.mComponentElement.offsetHeight?i.height/this.mComponentElement.offsetHeight:1,y=i.width/h,w=i.height/g,C=t.clientX,S=t.clientY,l=1;Math.abs(C-i.left)<Math.abs(C-i.right)&&(l=-1);let o=1;Math.abs(S-i.top)<Math.abs(S-i.bottom)&&(o=-1);let u=0;u+=l===1?Ft.right:Ft.left,u+=o===1?Ft.bottom:Ft.top;let c=y,r=w,b=T=>{let x=(T.clientX-C)/h*l,m=(T.clientY-S)/g*o,s=y+x,f=w+m;e==="horizontal"&&(s=y),e==="vertical"&&(f=w),[c,r]=this.applyComponentSize(u,s,f)},d=()=>{document.removeEventListener("pointermove",b),document.removeEventListener("pointerup",d),(c!==y||r!==w)&&this.mResizeEnd.dispatchEvent(this.createResizeEvent(u,c,r,y,w))};document.addEventListener("pointermove",b),document.addEventListener("pointerup",d)}parseBoolean(t){return!!(()=>{if(typeof t=="string"){if(t==="")return!0;let i=t.toLowerCase();if(["true","false"].includes(i))return i==="true"}return t})()}updateComponentHeight(t){if(!this.mConfiguration.enabledDirections.top&&!this.mConfiguration.enabledDirections.bottom)return this.height;let e=Math.max(1,t);return this.mComponentElement.style.setProperty("height",`${e}px`),e}updateComponentWidth(t){if(!this.mConfiguration.enabledDirections.left&&!this.mConfiguration.enabledDirections.right)return this.width;let e=Math.max(1,t);return this.mComponentElement.style.setProperty("width",`${e}px`),e}static{wi()}},sr=class{mHeight;mResizeHandle;mWidth;get height(){return this.mHeight}get resizeHandle(){return this.mResizeHandle}get width(){return this.mWidth}constructor(t,e,i){this.mHeight=e,this.mResizeHandle=i,this.mWidth=t}},Ft={top:1,right:2,bottom:4,left:8};var zi=`:host {\r
    --select-accent-color: red;\r
    --select-text-color: red;\r
    --select-border-radius: 4px;\r
    --select-background-color: red;\r
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
    padding: 0.4rem 0.75rem;\r
    border: 1px solid transparent;\r
    border-radius: var(--select-border-radius);\r
    color: var(--select-text-color);\r
    background-color: transparent;\r
\r
    /* Smooth transition for all */\r
    transition: border-color 0.15s, color 0.15s, background-color 0.15s;\r
}\r
\r
.select {\r
    box-sizing: border-box;\r
    display: flex;\r
    align-items: center;\r
    justify-content: center;\r
    width: 100%;\r
    height: 100%;\r
\r
    &::after {\r
        position: absolute;\r
        content: '';\r
        border-radius: var(--select-border-radius);\r
        border: 1px solid var(--select-accent-color);\r
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
 * Native select reset. Blends the control into the shared box while keeping the native arrow.\r
 */\r
.select-input {\r
    box-sizing: border-box;\r
    width: 100%;\r
    height: 100%;\r
    margin: 0;\r
\r
    /* Default right padding so the native dropdown arrow has enough space. */\r
    padding: 0 1em 0 0;\r
\r
    border: none;\r
    outline: none;\r
    color: inherit;\r
    font: inherit;\r
    cursor: inherit;\r
\r
    /* Must be set all the time to style <options> */\r
    background-color: var(--select-background-color);\r
    color: var(--select-text-color);\r
}\r
\r
/*\r
 * Shared user interactions.\r
 */\r
\r
:host(:hover),\r
:host(:active),\r
:host(:focus-within) {\r
    color: var(--select-accent-color);\r
\r
    .select::after {\r
        opacity: 1;\r
\r
        /* Actual border. */\r
        top: -1px;\r
        right: -1px;\r
        bottom: -1px;\r
        left: -1px;\r
    }\r
}`;var ji=`<div class="select">\r
    <select class="select-input" (change)="this.onChange($event)">\r
        $if(this.placeholder !== '') {\r
            <option class="placeholder" value="" disabled="disabled" hidden="hidden" [selected]="this.value === ''">{{this.placeholder}}</option>\r
        }\r
        $for(option of this.options) {\r
            <option [value]="this.itemValue(this.option)" [selected]="this.itemValue(this.option) === this.value">{{this.itemLabel(this.option)}}</option>\r
        }\r
    </select>\r
</div>\r
`;function hu(){function v(l,o){return function(c){e(o,"addInitializer"),i(c,"An initializer"),l.push(c)}}function t(l,o,u,c,r,b,d,T,x){var m;switch(r){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var s={kind:m,name:d?"#"+o:o,static:b,private:d,metadata:T},f={v:!1};s.addInitializer=v(c,f);var n,a;if(r===0?d?(n=u.get,a=u.set):(n=function(){return this[o]},a=function(p){this[o]=p}):r===2?n=function(){return u.value}:((r===1||r===3)&&(n=function(){return u.get.call(this)}),(r===1||r===4)&&(a=function(p){u.set.call(this,p)})),d)s.access=n&&a?{get:n,set:a}:n?{get:n}:{set:a};else{if(n){var P=n;n=function(p){return arguments.length===0&&(p=this),P.call(p)}}if(a){var _=a;a=function(p,M){return arguments.length===1&&(M=p,p=this),_.call(p,M)}}var D=function(p){return o in p};s.access=n&&a?{has:D,get:n,set:a}:n?{has:D,get:n}:{has:D,set:a}}try{return l(x,s)}finally{f.v=!0}}function e(l,o){if(l.v)throw new Error("attempted to call "+o+" after decoration was finished")}function i(l,o){if(typeof l!="function")throw new TypeError(o+" must be a function")}function h(l,o){var u=typeof o;if(l===1){if(u!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&i(o.get,"accessor.get"),o.set!==void 0&&i(o.set,"accessor.set"),o.init!==void 0&&i(o.init,"accessor.init")}else if(u!=="function"){var c;throw l===0?c="field":l===10?c="class":c="method",new TypeError(c+" decorators must return a function or void 0")}}function g(l,o,u,c,r,b,d,T,x){var m=u[0],s,f,n;d?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,c)),r===1?n={get:s.get,set:s.set}:r===2?n=s.value:r===3?n=s.get:r===4&&(n=s.set);var a,P,_;if(typeof m=="function")a=t(m,c,s,T,r,b,d,x,n),a!==void 0&&(h(r,a),r===0?f=a:r===1?(f=a.init,P=a.get||n.get,_=a.set||n.set,n={get:P,set:_}):n=a);else for(var D=m.length-1;D>=0;D--){var p=m[D];if(a=t(p,c,s,T,r,b,d,x,n),a!==void 0){h(r,a);var M;r===0?M=a:r===1?(M=a.init,P=a.get||n.get,_=a.set||n.set,n={get:P,set:_}):n=a,M!==void 0&&(f===void 0?f=M:typeof f=="function"?f=[f,M]:f.push(M))}}if(r===0||r===1){if(f===void 0)f=function(I,E){return E};else if(typeof f!="function"){var O=f;f=function(I,E){for(var N=E,L=0;L<O.length;L++)N=O[L].call(I,N);return N}}else{var z=f;f=function(I,E){return z.call(I,E)}}l.push(f)}r!==0&&(r===1?(s.get=n.get,s.set=n.set):r===2?s.value=n:r===3?s.get=n:r===4&&(s.set=n),d?r===1?(l.push(function(I,E){return n.get.call(I,E)}),l.push(function(I,E){return n.set.call(I,E)})):r===2?l.push(n):l.push(function(I,E){return n.call(I,E)}):Object.defineProperty(o,c,s))}function y(l,o,u){for(var c=[],r,b,d=new Map,T=new Map,x=0;x<o.length;x++){var m=o[x];if(Array.isArray(m)){var s=m[1],f=m[2],n=m.length>3,a=s>=5,P,_;if(a?(P=l,s=s-5,b=b||[],_=b):(P=l.prototype,r=r||[],_=r),s!==0&&!n){var D=a?T:d,p=D.get(f)||0;if(p===!0||p===3&&s!==4||p===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!p&&s>2?D.set(f,s):D.set(f,!0)}g(c,P,m,f,s,a,n,_,u)}}return w(c,r),w(c,b),c}function w(l,o){o&&l.push(function(u){for(var c=0;c<o.length;c++)o[c].call(u);return u})}function C(l,o,u){if(o.length>0){for(var c=[],r=l,b=l.name,d=o.length-1;d>=0;d--){var T={v:!1};try{var x=o[d](r,{kind:"class",name:b,addInitializer:v(c,T),metadata:u})}finally{T.v=!0}x!==void 0&&(h(10,x),r=x)}return[S(r,u),function(){for(var m=0;m<c.length;m++)c[m].call(r)}]}}function S(l,o){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,u,c,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var d=Object.create(b===void 0?null:b),T=y(o,u,d);return c.length||S(o,d),{e:T,get c(){return C(o,c,d)}}}}function Yi(v,t,e,i){return(Yi=hu())(v,t,e,i)}var Wi,Vi,Zi,qi,Ji,Ki,Qi,ki,ts,es,rs,Bi,$i,Gi,Ui,Hi,lr;Wi=$({selector:"kg-select",template:ji,style:zi}),Zi=V.state({complexValue:!0}),qi=V.state(),Ji=V.state(),Ki=tt("change"),Qi=B(),ki=B(),ts=B(),es=B(),rs=B();var Xi=class{static{({e:[Bi,$i,Gi,Ui,Hi],c:[lr,Vi]}=Yi(this,[[Zi,1,"mOptions"],[qi,1,"mPlaceholder"],[Ji,1,"mValue"],[Ki,1,"mChange"],[Qi,3,"labelKey"],[ki,3,"options"],[ts,3,"placeholder"],[es,3,"value"],[rs,3,"valueKey"]],[Wi]))}constructor(){this.mValue="",this.mOptions=new Array,this.mPlaceholder="",this.mValueMapping={valueKey:"value",labelKey:"label"}}mValueMapping;#t=(Hi(this),Bi(this));get mOptions(){return this.#t}set mOptions(t){this.#t=t}#e=$i(this);get mPlaceholder(){return this.#e}set mPlaceholder(t){this.#e=t}#r=Gi(this);get mValue(){return this.#r}set mValue(t){this.#r=t}#o=Ui(this);get mChange(){return this.#o}set mChange(t){this.#o=t}get labelKey(){return this.mValueMapping.labelKey}set labelKey(t){this.mValueMapping.labelKey=(t??"").toString()}get options(){return this.mOptions}set options(t){this.mOptions=Array.isArray(t)?t:new Array}get placeholder(){return this.mPlaceholder}set placeholder(t){this.mPlaceholder=(t??"").toString()}get value(){return this.mValue}set value(t){this.mValue=(t??"").toString()}get valueKey(){return this.mValueMapping.valueKey}set valueKey(t){this.mValueMapping.valueKey=(t??"").toString()}onChange(t){let e=t.target;this.mValue=e.value,this.mChange.dispatchEvent(this.mValue)}itemLabel(t){return t[this.mValueMapping.labelKey]}itemValue(t){return t[this.mValueMapping.valueKey]}static{Vi()}};function fu(){function v(l,o){return function(c){e(o,"addInitializer"),i(c,"An initializer"),l.push(c)}}function t(l,o,u,c,r,b,d,T,x){var m;switch(r){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var s={kind:m,name:d?"#"+o:o,static:b,private:d,metadata:T},f={v:!1};s.addInitializer=v(c,f);var n,a;if(r===0?d?(n=u.get,a=u.set):(n=function(){return this[o]},a=function(p){this[o]=p}):r===2?n=function(){return u.value}:((r===1||r===3)&&(n=function(){return u.get.call(this)}),(r===1||r===4)&&(a=function(p){u.set.call(this,p)})),d)s.access=n&&a?{get:n,set:a}:n?{get:n}:{set:a};else{if(n){var P=n;n=function(p){return arguments.length===0&&(p=this),P.call(p)}}if(a){var _=a;a=function(p,M){return arguments.length===1&&(M=p,p=this),_.call(p,M)}}var D=function(p){return o in p};s.access=n&&a?{has:D,get:n,set:a}:n?{has:D,get:n}:{has:D,set:a}}try{return l(x,s)}finally{f.v=!0}}function e(l,o){if(l.v)throw new Error("attempted to call "+o+" after decoration was finished")}function i(l,o){if(typeof l!="function")throw new TypeError(o+" must be a function")}function h(l,o){var u=typeof o;if(l===1){if(u!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&i(o.get,"accessor.get"),o.set!==void 0&&i(o.set,"accessor.set"),o.init!==void 0&&i(o.init,"accessor.init")}else if(u!=="function"){var c;throw l===0?c="field":l===10?c="class":c="method",new TypeError(c+" decorators must return a function or void 0")}}function g(l,o,u,c,r,b,d,T,x){var m=u[0],s,f,n;d?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,c)),r===1?n={get:s.get,set:s.set}:r===2?n=s.value:r===3?n=s.get:r===4&&(n=s.set);var a,P,_;if(typeof m=="function")a=t(m,c,s,T,r,b,d,x,n),a!==void 0&&(h(r,a),r===0?f=a:r===1?(f=a.init,P=a.get||n.get,_=a.set||n.set,n={get:P,set:_}):n=a);else for(var D=m.length-1;D>=0;D--){var p=m[D];if(a=t(p,c,s,T,r,b,d,x,n),a!==void 0){h(r,a);var M;r===0?M=a:r===1?(M=a.init,P=a.get||n.get,_=a.set||n.set,n={get:P,set:_}):n=a,M!==void 0&&(f===void 0?f=M:typeof f=="function"?f=[f,M]:f.push(M))}}if(r===0||r===1){if(f===void 0)f=function(I,E){return E};else if(typeof f!="function"){var O=f;f=function(I,E){for(var N=E,L=0;L<O.length;L++)N=O[L].call(I,N);return N}}else{var z=f;f=function(I,E){return z.call(I,E)}}l.push(f)}r!==0&&(r===1?(s.get=n.get,s.set=n.set):r===2?s.value=n:r===3?s.get=n:r===4&&(s.set=n),d?r===1?(l.push(function(I,E){return n.get.call(I,E)}),l.push(function(I,E){return n.set.call(I,E)})):r===2?l.push(n):l.push(function(I,E){return n.call(I,E)}):Object.defineProperty(o,c,s))}function y(l,o,u){for(var c=[],r,b,d=new Map,T=new Map,x=0;x<o.length;x++){var m=o[x];if(Array.isArray(m)){var s=m[1],f=m[2],n=m.length>3,a=s>=5,P,_;if(a?(P=l,s=s-5,b=b||[],_=b):(P=l.prototype,r=r||[],_=r),s!==0&&!n){var D=a?T:d,p=D.get(f)||0;if(p===!0||p===3&&s!==4||p===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!p&&s>2?D.set(f,s):D.set(f,!0)}g(c,P,m,f,s,a,n,_,u)}}return w(c,r),w(c,b),c}function w(l,o){o&&l.push(function(u){for(var c=0;c<o.length;c++)o[c].call(u);return u})}function C(l,o,u){if(o.length>0){for(var c=[],r=l,b=l.name,d=o.length-1;d>=0;d--){var T={v:!1};try{var x=o[d](r,{kind:"class",name:b,addInitializer:v(c,T),metadata:u})}finally{T.v=!0}x!==void 0&&(h(10,x),r=x)}return[S(r,u),function(){for(var m=0;m<c.length;m++)c[m].call(r)}]}}function S(l,o){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,u,c,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var d=Object.create(b===void 0?null:b),T=y(o,u,d);return c.length||S(o,d),{e:T,get c(){return C(o,c,d)}}}}function ns(v,t,e,i){return(ns=fu())(v,t,e,i)}function mu(v){return v}var is,os,Ne;is=yt({access:Z.Write,selector:/^drop-handler$/});new class extends mu{constructor(){super(Ne),os()}static{class v{static{({c:[Ne,os]}=ns(this,[],[is]))}static ACTIVATION_DISTANCE_TRESHOLD=5;mActiveDrag;mPointerDownListener;mTarget;constructor(e=F.use(J)){this.mTarget=e,this.mActiveDrag=null,this.mPointerDownListener=i=>{this.startDrag(i)},this.mTarget.addEventListener("pointerdown",this.mPointerDownListener)}onDeconstruct(){this.mTarget.removeEventListener("pointerdown",this.mPointerDownListener),this.stopDrag()}onDragEnd(e){if(!this.mActiveDrag)return;let i=this.mActiveDrag;if(this.stopDrag(),!i.active)return;let h=i.position.start,g={x:e.clientX,y:e.clientY};this.mTarget.dispatchEvent(new le(Mr.DragEnd,h,g,{x:0,y:0}))}onDragMove(e){if(!this.mActiveDrag)return;let i={x:e.clientX,y:e.clientY};if(!this.mActiveDrag.active){let g=Math.abs(this.mActiveDrag.position.start.x-i.x),y=Math.abs(this.mActiveDrag.position.start.y-i.y);if(Math.sqrt(Math.pow(g,2)+Math.pow(y,2))>v.ACTIVATION_DISTANCE_TRESHOLD){if(!this.mTarget.dispatchEvent(new le(Mr.DragStart,this.mActiveDrag.position.start,this.mActiveDrag.position.start,{x:0,y:0}))){this.stopDrag();return}this.mActiveDrag.active=!0}}let h={x:i.x-this.mActiveDrag.position.last.x,y:i.y-this.mActiveDrag.position.last.y};if(!this.mTarget.dispatchEvent(new le(Mr.DragMove,this.mActiveDrag.position.start,i,h))){this.stopDrag();return}this.mActiveDrag.position.last=i}startDrag(e){if(e.button!==0||this.mActiveDrag)return;let i=y=>{this.onDragMove(y)},h=y=>{this.onDragEnd(y)},g={x:e.clientX,y:e.clientY};this.mActiveDrag={active:!1,position:{start:g,last:g},listener:{move:i,end:h}},document.addEventListener("pointermove",i),document.addEventListener("pointerup",h),document.addEventListener("pointercancel",h)}stopDrag(){this.mActiveDrag&&(document.removeEventListener("pointermove",this.mActiveDrag.listener.move),document.removeEventListener("pointerup",this.mActiveDrag.listener.end),document.removeEventListener("pointercancel",this.mActiveDrag.listener.end),this.mActiveDrag=null)}}}};var le=class extends Event{mPointerPosition;mStartPosition;mMovedDistance;get pointerPosition(){return this.mPointerPosition}get startPosition(){return this.mStartPosition}get moveDistance(){return this.mMovedDistance}constructor(t,e,i,h){super(t,{bubbles:!0,cancelable:!0}),this.mStartPosition=e,this.mPointerPosition=i,this.mMovedDistance=h}},Mr={DragStart:"drag-start",DragMove:"drag-move",DragEnd:"drag-end"};var ss=`:host {\r
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
    display: flex;\r
    flex-direction: column;\r
    gap: 0.3rem;\r
    padding: 0.3rem;\r
    overflow: hidden auto;\r
\r
    scrollbar-color: var(--potatno-color-scrollbar-thumb) var(--potatno-color-scrollbar-track);\r
    scrollbar-width: thin;\r
}\r
\r
.function-item {\r
    --list-item-icon-color: #008000;\r
    --list-item-bar-default-color: color-mix(in srgb, var(--potatno-color-text) 25%, var(--potatno-color-background));\r
    --list-item-background-color: var(--potatno-color-background-light);\r
\r
    color: var(--potatno-color-text);\r
\r
    &.system {\r
        --list-item-icon-color: #ffd700;\r
    }\r
\r
    /* Bar turns accent on interaction and while the function is active. */\r
    &:hover,\r
    &[selected]:not([selected='false']) {\r
        --list-item-bar-default-color: var(--potatno-color-accent);\r
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
        /* Theme the shared list item. */\r
        color: var(--potatno-color-text);\r
        --list-item-icon-color: var(--potatno-color-text);\r
        --list-item-bar-default-color: color-mix(in srgb, var(--potatno-color-text) 25%, var(--potatno-color-background));\r
        --list-item-background-color: var(--potatno-color-background-light);\r
\r
        &:active {\r
            --list-item-bar-default-color: var(--potatno-color-accent);\r
        }\r
    }\r
}`;var as=`<kg-resize-panel class="resize-panel" right>\r
    <div class="panel-content">\r
        <div class="function-list">\r
            $for(functionItem of this.documentFunctions) {\r
                <kg-list-item class="function-item {{ this.functionItem.isSystem ? 'system' : '' }}" selectable [selected]="this.functionItem.id === this.activeFunctionId" icon="{{ this.functionItem.isSystem ? 'S' : 'U' }}" (click)="this.selectFunction(this.functionItem)">\r
                    <div class="function-item__name">{{this.functionItem.label}}</div>\r
\r
                    $if(!this.functionItem.isSystem) {\r
                        <kg-button class="function-item__delete" type="secondary" (click)="this.deleteFunction(this.functionItem)">\u2715</kg-button>\r
                    }\r
                </kg-list-item>\r
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
                                <kg-list-item class="popup__item" selectable icon="\u0192" (click)="this.createFunction(this.functionDefinition)">\r
                                    <div>{{this.functionDefinition.label}}</div>\r
                                </kg-list-item>\r
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
`;function gu(){function v(l,o){return function(c){e(o,"addInitializer"),i(c,"An initializer"),l.push(c)}}function t(l,o,u,c,r,b,d,T,x){var m;switch(r){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var s={kind:m,name:d?"#"+o:o,static:b,private:d,metadata:T},f={v:!1};s.addInitializer=v(c,f);var n,a;if(r===0?d?(n=u.get,a=u.set):(n=function(){return this[o]},a=function(p){this[o]=p}):r===2?n=function(){return u.value}:((r===1||r===3)&&(n=function(){return u.get.call(this)}),(r===1||r===4)&&(a=function(p){u.set.call(this,p)})),d)s.access=n&&a?{get:n,set:a}:n?{get:n}:{set:a};else{if(n){var P=n;n=function(p){return arguments.length===0&&(p=this),P.call(p)}}if(a){var _=a;a=function(p,M){return arguments.length===1&&(M=p,p=this),_.call(p,M)}}var D=function(p){return o in p};s.access=n&&a?{has:D,get:n,set:a}:n?{has:D,get:n}:{has:D,set:a}}try{return l(x,s)}finally{f.v=!0}}function e(l,o){if(l.v)throw new Error("attempted to call "+o+" after decoration was finished")}function i(l,o){if(typeof l!="function")throw new TypeError(o+" must be a function")}function h(l,o){var u=typeof o;if(l===1){if(u!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&i(o.get,"accessor.get"),o.set!==void 0&&i(o.set,"accessor.set"),o.init!==void 0&&i(o.init,"accessor.init")}else if(u!=="function"){var c;throw l===0?c="field":l===10?c="class":c="method",new TypeError(c+" decorators must return a function or void 0")}}function g(l,o,u,c,r,b,d,T,x){var m=u[0],s,f,n;d?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,c)),r===1?n={get:s.get,set:s.set}:r===2?n=s.value:r===3?n=s.get:r===4&&(n=s.set);var a,P,_;if(typeof m=="function")a=t(m,c,s,T,r,b,d,x,n),a!==void 0&&(h(r,a),r===0?f=a:r===1?(f=a.init,P=a.get||n.get,_=a.set||n.set,n={get:P,set:_}):n=a);else for(var D=m.length-1;D>=0;D--){var p=m[D];if(a=t(p,c,s,T,r,b,d,x,n),a!==void 0){h(r,a);var M;r===0?M=a:r===1?(M=a.init,P=a.get||n.get,_=a.set||n.set,n={get:P,set:_}):n=a,M!==void 0&&(f===void 0?f=M:typeof f=="function"?f=[f,M]:f.push(M))}}if(r===0||r===1){if(f===void 0)f=function(I,E){return E};else if(typeof f!="function"){var O=f;f=function(I,E){for(var N=E,L=0;L<O.length;L++)N=O[L].call(I,N);return N}}else{var z=f;f=function(I,E){return z.call(I,E)}}l.push(f)}r!==0&&(r===1?(s.get=n.get,s.set=n.set):r===2?s.value=n:r===3?s.get=n:r===4&&(s.set=n),d?r===1?(l.push(function(I,E){return n.get.call(I,E)}),l.push(function(I,E){return n.set.call(I,E)})):r===2?l.push(n):l.push(function(I,E){return n.call(I,E)}):Object.defineProperty(o,c,s))}function y(l,o,u){for(var c=[],r,b,d=new Map,T=new Map,x=0;x<o.length;x++){var m=o[x];if(Array.isArray(m)){var s=m[1],f=m[2],n=m.length>3,a=s>=5,P,_;if(a?(P=l,s=s-5,b=b||[],_=b):(P=l.prototype,r=r||[],_=r),s!==0&&!n){var D=a?T:d,p=D.get(f)||0;if(p===!0||p===3&&s!==4||p===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!p&&s>2?D.set(f,s):D.set(f,!0)}g(c,P,m,f,s,a,n,_,u)}}return w(c,r),w(c,b),c}function w(l,o){o&&l.push(function(u){for(var c=0;c<o.length;c++)o[c].call(u);return u})}function C(l,o,u){if(o.length>0){for(var c=[],r=l,b=l.name,d=o.length-1;d>=0;d--){var T={v:!1};try{var x=o[d](r,{kind:"class",name:b,addInitializer:v(c,T),metadata:u})}finally{T.v=!0}x!==void 0&&(h(10,x),r=x)}return[S(r,u),function(){for(var m=0;m<c.length;m++)c[m].call(r)}]}}function S(l,o){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,u,c,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var d=Object.create(b===void 0?null:b),T=y(o,u,d);return c.length||S(o,d),{e:T,get c(){return C(o,c,d)}}}}function ms(v,t,e,i){return(ms=gu())(v,t,e,i)}var ds,ls,ps,gs,cs,us,hs,Sr;ds=$({selector:"potatno-function-list",template:as,style:ss,components:[ar,ae,It,Yt]}),ps=V.state({complexValue:!0}),gs=V.state();var fs=class{static{({e:[cs,us,hs],c:[Sr,ls]}=ms(this,[[ps,1,"documentFunctions"],[gs,1,"showPopup"]],[ds]))}constructor(t=F.use(H)){this.mManager=t,this.documentFunctions=new Array,this.showPopup=!1,this.mUnsubscribe=this.mManager.subscribe(R.Document|R.Function|R.SpecialActiveFunction,()=>{this.documentFunctions=this.mManager.graph.document.functions.map(e=>({id:e.id,label:e.label,isSystem:e.isSystem,function:e}))})}mManager;mUnsubscribe;#t=(hs(this),cs(this));get documentFunctions(){return this.#t}set documentFunctions(t){this.#t=t}#e=us(this);get showPopup(){return this.#e}set showPopup(t){this.#e=t}get activeFunctionId(){return this.mManager.activeFunction.id}get userFunctionDefinitions(){return[...this.mManager.project.userFunctions.values()]}createFunction(t){this.showPopup=!1,this.mManager.graph.addFunction(t.id)}deleteFunction(t){this.mManager.graph.removeFunction(t.id)}onDeconstruct(){this.mUnsubscribe()}selectFunction(t){this.mManager.setActiveFunction(t.function)}static{ls()}};var ce=class{mCodeGenerator;mId;mLabel;mNodesProvider;mStatics;get codeGenerator(){return this.mCodeGenerator}get id(){return this.mId}get label(){return this.mLabel}get statics(){return this.mStatics}constructor(t){this.mId=t.id,this.mLabel=t.label,this.mNodesProvider=t.nodes,this.mStatics=t.statics,this.mCodeGenerator=t.generator.code}getNodeDefinitions(t){let e=h=>{if(!h)return new Array;let g=new Array;return h(y=>{g.push(y)},t),g},i={};return Object.defineProperty(i,"entry",{get:()=>e(this.mNodesProvider.entry)}),Object.defineProperty(i,"exit",{get:()=>e(this.mNodesProvider.exit)}),Object.defineProperty(i,"dynamic",{get:()=>e(this.mNodesProvider.dynamic)}),i}},zt={none:0,imports:1,inputs:2,outputs:4};var vs=`:host {\r
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
    background-color: var(--potatno-color-background);\r
    \r
    border: 1px solid var(--potatno-color-border);\r
    border-radius: var(--potatno-border-radius);\r
\r
    height: 2rem;\r
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
\r
        width: 2rem;\r
        height: 100%;\r
        font-size: 0.75rem;\r
    }\r
\r
    .list-item__text-input {\r
        /* Theme the shared kg-input. */\r
        --input-accent-color: var(--potatno-color-accent);\r
        --input-text-color: var(--potatno-color-text);\r
        --input-background-color: transparent;\r
        --input-border-radius: var(--potatno-border-radius);\r
\r
        /* Hear me out... this max the text input but also allows the select to also grow when no text input is present */\r
        flex: 1 99999 100%;\r
        min-width: 2.75rem;\r
\r
        height: 100%;\r
        padding: 0 0.8rem;\r
        font-size: var(--potatno-font-size);\r
\r
        &.error {\r
            --input-accent-color: var(--potatno-color-error);\r
            border-color: var(--potatno-color-error);\r
        }\r
    }\r
\r
    .list-item__select-input {\r
        /* Theme the shared kg-select for the preview bar. */\r
        --select-accent-color: var(--potatno-color-accent);\r
        --select-text-color: var(--potatno-color-text);\r
        --select-border-color: var(--potatno-color-border);\r
        --select-background-color: var(--potatno-color-background);\r
\r
        flex: 1 1 max-content;\r
        min-width: 2.75rem;\r
        height: 100%;\r
        padding: 0 0.3rem  0 0.5rem;\r
        font-size: var(--potatno-font-size);\r
    }\r
\r
    .list-item__text {\r
        flex: 1;\r
        padding: 0 0.8rem;\r
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
        height: 1.4rem;\r
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
        height: 100%;\r
        padding: 0 0.8rem;\r
\r
        font-size: var(--potatno-font-size);\r
    }\r
}`;var ys=`<kg-resize-panel class="resize-panel" left>\r
    <div class="panel-content">\r
        <!-- Function name -->\r
        <div class="section">\r
            <div class="section__label section-label">\r
                <span>Function Name</span>\r
            </div>\r
            <div class="section__list">\r
                <div class="list-item">\r
                    <kg-input class="list-item__text-input" type="text" [(value)]="this.functionProperties.label" [disabled]="this.functionProperties.statics.label" (change)="this.submitChange()" />\r
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
                        <kg-input class="list-item__text-input {{ this.functionPort.hasError ? 'error' : '' }}" type="text" [(value)]="this.functionPort.label" [disabled]="this.functionProperties.statics.inputs" (change)="this.submitChange()" />\r
\r
                        <div class="list-item__seperator" />\r
\r
                        <!-- Type Selection -->\r
                        <kg-select class="list-item__select-input" valueKey="name" labelKey="name" [options]="this.projectTypes" [(value)]="this.functionPort.dataType" (change)="this.submitChange()" />\r
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
                        <kg-input class="list-item__text-input {{ this.functionPort.hasError ? 'error' : '' }}" type="text" [(value)]="this.functionPort.label" [disabled]="this.functionProperties.statics.outputs" (change)="this.submitChange()" />\r
\r
                        <div class="list-item__seperator" />\r
\r
                        <!-- Type Selection -->\r
                        <kg-select class="list-item__select-input" valueKey="name" labelKey="name" [options]="this.projectTypes" [(value)]="this.functionPort.dataType" (change)="this.submitChange()" />\r
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
                        <kg-select class="list-item__select-input" valueKey="id" labelKey="label" [options]="this.unusedImports" [(value)]="this.selectedImportId" />\r
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
`;function bu(){function v(l,o){return function(c){e(o,"addInitializer"),i(c,"An initializer"),l.push(c)}}function t(l,o,u,c,r,b,d,T,x){var m;switch(r){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var s={kind:m,name:d?"#"+o:o,static:b,private:d,metadata:T},f={v:!1};s.addInitializer=v(c,f);var n,a;if(r===0?d?(n=u.get,a=u.set):(n=function(){return this[o]},a=function(p){this[o]=p}):r===2?n=function(){return u.value}:((r===1||r===3)&&(n=function(){return u.get.call(this)}),(r===1||r===4)&&(a=function(p){u.set.call(this,p)})),d)s.access=n&&a?{get:n,set:a}:n?{get:n}:{set:a};else{if(n){var P=n;n=function(p){return arguments.length===0&&(p=this),P.call(p)}}if(a){var _=a;a=function(p,M){return arguments.length===1&&(M=p,p=this),_.call(p,M)}}var D=function(p){return o in p};s.access=n&&a?{has:D,get:n,set:a}:n?{has:D,get:n}:{has:D,set:a}}try{return l(x,s)}finally{f.v=!0}}function e(l,o){if(l.v)throw new Error("attempted to call "+o+" after decoration was finished")}function i(l,o){if(typeof l!="function")throw new TypeError(o+" must be a function")}function h(l,o){var u=typeof o;if(l===1){if(u!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&i(o.get,"accessor.get"),o.set!==void 0&&i(o.set,"accessor.set"),o.init!==void 0&&i(o.init,"accessor.init")}else if(u!=="function"){var c;throw l===0?c="field":l===10?c="class":c="method",new TypeError(c+" decorators must return a function or void 0")}}function g(l,o,u,c,r,b,d,T,x){var m=u[0],s,f,n;d?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,c)),r===1?n={get:s.get,set:s.set}:r===2?n=s.value:r===3?n=s.get:r===4&&(n=s.set);var a,P,_;if(typeof m=="function")a=t(m,c,s,T,r,b,d,x,n),a!==void 0&&(h(r,a),r===0?f=a:r===1?(f=a.init,P=a.get||n.get,_=a.set||n.set,n={get:P,set:_}):n=a);else for(var D=m.length-1;D>=0;D--){var p=m[D];if(a=t(p,c,s,T,r,b,d,x,n),a!==void 0){h(r,a);var M;r===0?M=a:r===1?(M=a.init,P=a.get||n.get,_=a.set||n.set,n={get:P,set:_}):n=a,M!==void 0&&(f===void 0?f=M:typeof f=="function"?f=[f,M]:f.push(M))}}if(r===0||r===1){if(f===void 0)f=function(I,E){return E};else if(typeof f!="function"){var O=f;f=function(I,E){for(var N=E,L=0;L<O.length;L++)N=O[L].call(I,N);return N}}else{var z=f;f=function(I,E){return z.call(I,E)}}l.push(f)}r!==0&&(r===1?(s.get=n.get,s.set=n.set):r===2?s.value=n:r===3?s.get=n:r===4&&(s.set=n),d?r===1?(l.push(function(I,E){return n.get.call(I,E)}),l.push(function(I,E){return n.set.call(I,E)})):r===2?l.push(n):l.push(function(I,E){return n.call(I,E)}):Object.defineProperty(o,c,s))}function y(l,o,u){for(var c=[],r,b,d=new Map,T=new Map,x=0;x<o.length;x++){var m=o[x];if(Array.isArray(m)){var s=m[1],f=m[2],n=m.length>3,a=s>=5,P,_;if(a?(P=l,s=s-5,b=b||[],_=b):(P=l.prototype,r=r||[],_=r),s!==0&&!n){var D=a?T:d,p=D.get(f)||0;if(p===!0||p===3&&s!==4||p===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!p&&s>2?D.set(f,s):D.set(f,!0)}g(c,P,m,f,s,a,n,_,u)}}return w(c,r),w(c,b),c}function w(l,o){o&&l.push(function(u){for(var c=0;c<o.length;c++)o[c].call(u);return u})}function C(l,o,u){if(o.length>0){for(var c=[],r=l,b=l.name,d=o.length-1;d>=0;d--){var T={v:!1};try{var x=o[d](r,{kind:"class",name:b,addInitializer:v(c,T),metadata:u})}finally{T.v=!0}x!==void 0&&(h(10,x),r=x)}return[S(r,u),function(){for(var m=0;m<c.length;m++)c[m].call(r)}]}}function S(l,o){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,u,c,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var d=Object.create(b===void 0?null:b),T=y(o,u,d);return c.length||S(o,d),{e:T,get c(){return C(o,c,d)}}}}function Ds(v,t,e,i){return(Ds=bu())(v,t,e,i)}var Es,bs,Cs,ws,xs,Ar;Es=$({selector:"potatno-function-properties",template:ys,style:vs,components:[Wt,It,nr]}),Cs=V.state({complexValue:!0});var Ts=class{static{({e:[ws,xs],c:[Ar,bs]}=Ds(this,[[Cs,1,"functionProperties"]],[Es]))}constructor(t=F.use(H)){this.mManager=t,this.mSelectedImportId="",this.mProjectTypes=new Array,this.functionProperties=this.convertFunctionProperties(null),this.mUnsubscribeFunctionUpdate=this.mManager.subscribe(R.Function,()=>{this.functionProperties=this.convertFunctionProperties(this.functionProperties)}),this.mUnsubscribeFunctionSwitch=this.mManager.subscribe(R.Document|R.SpecialActiveFunction,()=>{this.mProjectTypes.splice(0,this.mProjectTypes.length);for(let[e,i]of this.mManager.project.types.types)this.mProjectTypes.push({name:e,definition:i});this.functionProperties=this.convertFunctionProperties(null)})}mManager;mProjectTypes;mSelectedImportId;mUnsubscribeFunctionUpdate;mUnsubscribeFunctionSwitch;#t=(xs(this),ws(this));get functionProperties(){return this.#t}set functionProperties(t){this.#t=t}get projectTypes(){return this.mProjectTypes}get selectedImportId(){return this.mSelectedImportId}set selectedImportId(t){this.mSelectedImportId=t}get unusedImports(){return this.mManager.activeFunction.project.imports.filter(t=>!this.functionProperties.imports.find(e=>t.id===e.id))}addPort(t){let e=this.projectTypes[0]?.name;if(!e)return;let i=t===this.functionProperties.inputs?"Input":"Output";this.resetNewState(),t.push({new:!0,label:i,dataType:e,hasError:!1}),this.submitChange()}addSelectedImport(){let t=this.unusedImports;if(t.length===0)return;let e=t.find(i=>i.id===this.mSelectedImportId);e||(e=t.at(0)),this.resetNewState(),this.functionProperties.imports.push({new:!0,id:e.id,label:e.label}),this.submitChange()}deleteImport(t){let e=this.functionProperties.imports.indexOf(t);e!==-1&&(this.functionProperties.imports.splice(e,1),this.resetNewState(),this.submitChange())}deletePort(t,e){let i=e.indexOf(t);i!==-1&&(e.splice(i,1),this.resetNewState(),this.submitChange())}onDeconstruct(){this.mUnsubscribeFunctionUpdate(),this.mUnsubscribeFunctionSwitch()}async submitChange(){let t=!1,e=new Set;for(let y of this.functionProperties.inputs)y.hasError=e.has(y.label),t||=y.hasError,e.add(y.label);let i=new Set;for(let y of this.functionProperties.outputs)y.hasError=i.has(y.label),t||=y.hasError,i.add(y.label);if(t){this.functionProperties=this.functionProperties;return}let h=this.mManager.activeFunction,g=this.functionProperties;await new Promise(y=>{globalThis.setTimeout(y,10)}),this.mManager.graph.updateFunction(h,y=>{if(y.label=g.label,!g.statics.inputs){for(;y.inputs.length>0;)y.removeInput(y.inputs.at(0));for(let w of g.inputs)y.addInput({dataType:w.dataType,label:w.label})}if(!g.statics.outputs){for(;y.outputs.length>0;)y.removeOutput(y.outputs.at(0));for(let w of g.outputs)y.addOutput({dataType:w.dataType,label:w.label})}if(!g.statics.imports){for(let w of y.imports)y.removeImport(w);for(let w of g.imports)y.addImport(w.id)}})}convertFunctionProperties(t){let e={label:"",inputs:new Array,outputs:new Array,imports:new Array,statics:{label:!0,imports:!0,inputs:!0,outputs:!0}},i=this.mManager.activeFunction,h=i.project.getFunction(i.definitionId);h&&(e.statics.label=i.isSystem,e.statics.imports=(h.statics&zt.imports)!==0,e.statics.inputs=(h.statics&zt.inputs)!==0,e.statics.outputs=(h.statics&zt.outputs)!==0),e.label=i.label;for(let g of i.project.imports){if(!i.imports.has(g.id))continue;let y=t?t.imports.find(C=>C.id===g.id)?.new??!1:!1;e.imports.push({new:y,id:g.id,label:g.label})}for(let g of i.inputs){let y=t?t.inputs.find(C=>C.label===g.label)?.new??!1:!1;e.inputs.push({new:y,label:g.label,dataType:g.dataType,hasError:!1})}for(let g of i.outputs){let y=t?t.outputs.find(C=>C.label===g.label)?.new??!1:!1;e.outputs.push({new:y,label:g.label,dataType:g.dataType,hasError:!1})}return e}resetNewState(){for(let t of this.functionProperties.inputs)t.new=!1;for(let t of this.functionProperties.outputs)t.new=!1;for(let t of this.functionProperties.imports)t.new=!1}static{bs()}};var Ps=`:host {\r
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
        display: flex;\r
        flex-direction: column;\r
        gap: 0.3rem;\r
\r
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
        /* Theme the shared list item. Bar color comes from the entry via the "barcolor" attribute. */\r
        color: var(--potatno-color-text);\r
        --list-item-icon-color: var(--potatno-color-accent);\r
        --list-item-background-color: var(--potatno-color-background-light);\r
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
}`;var _s=`<kg-popup class="selection-popup" animate="top" (pointerdown)="this.stopPropagation($event, false)" (wheel)="this.stopPropagation($event, false)" (contextmenu)="this.stopPropagation($event, true);">\r
\r
    <input #searchInput type="text" placeholder="Search nodes..." class="selection-popup__search" [(value)]="this.searchValue" (keydown)="this.onKeyDown($event)" />\r
    <div class="selection-popup__results">\r
        $for(entry of this.results) {\r
            <kg-list-item class="selection-popup__result" selectable [selected]="this.entry.definition.id === this.selectedDefinitionId" [icon]="this.entry.icon" [barcolor]="this.entry.color" (click)="this.sendSelectedEntry(this.entry.definition.id)" tabindex="-1">\r
                <span class="selection-popup__result-label">{{this.entry.label}}</span>\r
                <span class="selection-popup__result-category">{{this.entry.category}}</span>\r
            </kg-list-item>\r
        }\r
        $if(this.results.length === 0) {\r
            <div class="selection-popup__empty">No matching nodes found.</div>\r
        }\r
    </div>\r
\r
</kg-popup>\r
`;function Tu(){function v(l,o){return function(c){e(o,"addInitializer"),i(c,"An initializer"),l.push(c)}}function t(l,o,u,c,r,b,d,T,x){var m;switch(r){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var s={kind:m,name:d?"#"+o:o,static:b,private:d,metadata:T},f={v:!1};s.addInitializer=v(c,f);var n,a;if(r===0?d?(n=u.get,a=u.set):(n=function(){return this[o]},a=function(p){this[o]=p}):r===2?n=function(){return u.value}:((r===1||r===3)&&(n=function(){return u.get.call(this)}),(r===1||r===4)&&(a=function(p){u.set.call(this,p)})),d)s.access=n&&a?{get:n,set:a}:n?{get:n}:{set:a};else{if(n){var P=n;n=function(p){return arguments.length===0&&(p=this),P.call(p)}}if(a){var _=a;a=function(p,M){return arguments.length===1&&(M=p,p=this),_.call(p,M)}}var D=function(p){return o in p};s.access=n&&a?{has:D,get:n,set:a}:n?{has:D,get:n}:{has:D,set:a}}try{return l(x,s)}finally{f.v=!0}}function e(l,o){if(l.v)throw new Error("attempted to call "+o+" after decoration was finished")}function i(l,o){if(typeof l!="function")throw new TypeError(o+" must be a function")}function h(l,o){var u=typeof o;if(l===1){if(u!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&i(o.get,"accessor.get"),o.set!==void 0&&i(o.set,"accessor.set"),o.init!==void 0&&i(o.init,"accessor.init")}else if(u!=="function"){var c;throw l===0?c="field":l===10?c="class":c="method",new TypeError(c+" decorators must return a function or void 0")}}function g(l,o,u,c,r,b,d,T,x){var m=u[0],s,f,n;d?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,c)),r===1?n={get:s.get,set:s.set}:r===2?n=s.value:r===3?n=s.get:r===4&&(n=s.set);var a,P,_;if(typeof m=="function")a=t(m,c,s,T,r,b,d,x,n),a!==void 0&&(h(r,a),r===0?f=a:r===1?(f=a.init,P=a.get||n.get,_=a.set||n.set,n={get:P,set:_}):n=a);else for(var D=m.length-1;D>=0;D--){var p=m[D];if(a=t(p,c,s,T,r,b,d,x,n),a!==void 0){h(r,a);var M;r===0?M=a:r===1?(M=a.init,P=a.get||n.get,_=a.set||n.set,n={get:P,set:_}):n=a,M!==void 0&&(f===void 0?f=M:typeof f=="function"?f=[f,M]:f.push(M))}}if(r===0||r===1){if(f===void 0)f=function(I,E){return E};else if(typeof f!="function"){var O=f;f=function(I,E){for(var N=E,L=0;L<O.length;L++)N=O[L].call(I,N);return N}}else{var z=f;f=function(I,E){return z.call(I,E)}}l.push(f)}r!==0&&(r===1?(s.get=n.get,s.set=n.set):r===2?s.value=n:r===3?s.get=n:r===4&&(s.set=n),d?r===1?(l.push(function(I,E){return n.get.call(I,E)}),l.push(function(I,E){return n.set.call(I,E)})):r===2?l.push(n):l.push(function(I,E){return n.call(I,E)}):Object.defineProperty(o,c,s))}function y(l,o,u){for(var c=[],r,b,d=new Map,T=new Map,x=0;x<o.length;x++){var m=o[x];if(Array.isArray(m)){var s=m[1],f=m[2],n=m.length>3,a=s>=5,P,_;if(a?(P=l,s=s-5,b=b||[],_=b):(P=l.prototype,r=r||[],_=r),s!==0&&!n){var D=a?T:d,p=D.get(f)||0;if(p===!0||p===3&&s!==4||p===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!p&&s>2?D.set(f,s):D.set(f,!0)}g(c,P,m,f,s,a,n,_,u)}}return w(c,r),w(c,b),c}function w(l,o){o&&l.push(function(u){for(var c=0;c<o.length;c++)o[c].call(u);return u})}function C(l,o,u){if(o.length>0){for(var c=[],r=l,b=l.name,d=o.length-1;d>=0;d--){var T={v:!1};try{var x=o[d](r,{kind:"class",name:b,addInitializer:v(c,T),metadata:u})}finally{T.v=!0}x!==void 0&&(h(10,x),r=x)}return[S(r,u),function(){for(var m=0;m<c.length;m++)c[m].call(r)}]}}function S(l,o){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,u,c,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var d=Object.create(b===void 0?null:b),T=y(o,u,d);return c.length||S(o,d),{e:T,get c(){return C(o,c,d)}}}}function Os(v,t,e,i){return(Os=Tu())(v,t,e,i)}function Du(v){return v}var Fs,Is,zs,js,Vs,Bs,$s,Gs,Ms,Ss,As,Ns,Ls,Rs,ue;Fs=$({selector:"potatno-node-selection-popup",template:_s,style:Ps,components:[ae,Yt]}),zs=B(),js=V.state({complexValue:!0}),Vs=bt("searchInput"),Bs=tt("node-select"),$s=V.state(),Gs=V.state();new class extends Du{constructor(){super(ue),Is()}static{class v{static{({e:[Ms,Ss,As,Ns,Ls,Rs],c:[ue,Is]}=Os(this,[[zs,3,"contextport"],[js,1,"results"],[Vs,1,"searchInput"],[Bs,1,"mNodeSelect"],[$s,1,"searchValue"],[Gs,1,"selectedDefinitionId"]],[Fs]))}static POPUP_HEIGHT=320;static POPUP_WIDTH=280;mComponent;mManager;mNodes;get contextport(){return this.mNodes.context}set contextport(e){this.mNodes.context=e,this.mNodes.list.filtered=this.contexturizeNodeList(this.mNodes.context)}#t=(Rs(this),Ms(this));get results(){return this.#t}set results(e){this.#t=e}#e=Ss(this);get searchInput(){return this.#e}set searchInput(e){this.#e=e}#r=As(this);get mNodeSelect(){return this.#r}set mNodeSelect(e){this.#r=e}#o=Ns(this);get searchValue(){return this.#o}set searchValue(e){this.#o=e}#n=Ls(this);get selectedDefinitionId(){return this.#n}set selectedDefinitionId(e){this.#n=e}constructor(e=F.use(U),i=F.use(H)){this.mManager=i,this.mComponent=e,this.selectedDefinitionId=null,this.results=new Array,this.searchValue="";let h=this.fetchNodeEntries();this.mNodes={context:null,list:{full:h,filtered:h}}}onConnect(){this.searchInput?.focus()}onKeyDown(e){if(this.results.length!==0){if(e.key==="ArrowDown"||e.key==="ArrowUp"){e.preventDefault();let i=this.results.findIndex(y=>y.definition.id===this.selectedDefinitionId);i=Math.max(0,i);let h=e.key==="ArrowDown"?1:-1,g=(i+h+this.results.length)%this.results.length;this.selectedDefinitionId=this.results[g].definition.id;return}e.key==="Enter"&&this.sendSelectedEntry(this.selectedDefinitionId)}}onUpdate(){this.results=this.filterResults(),this.results.some(i=>i.definition.id===this.selectedDefinitionId)||(this.selectedDefinitionId=this.results[0]?.definition.id??null);let e=this.mComponent.element.shadowRoot.querySelector('.selection-popup__result[selected="true"]');e&&e.scrollIntoView({block:"center"})}stopPropagation(e,i){e.stopPropagation(),i&&e.preventDefault()}contexturizeNodeList(e){return e?this.mNodes.list.full.filter(i=>!!this.findMatchingPortDefinition(e,i.definition)):this.mNodes.list.full}fetchNodeEntries(){return this.mManager.activeFunction.dynamicNodeDefinitions.map(e=>({category:e.category.name,definition:e,label:e.label.toLowerCase(),color:this.mManager.generateStringColor(e.category.name),icon:e.category.icon}))}filterResults(){let e=this.searchValue.trim().toLowerCase();return this.mNodes.list.filtered.filter(i=>i.label.includes(e))}findMatchingPortDefinition(e,i){let h=e.direction==="input"?i.outputs:i.inputs;for(let g of h)if(g.portType===e.portType&&g.dataType===e.dataType)return g;return null}sendSelectedEntry(e){if(e===null)return;let i=this.results.find(h=>h.definition.id===e);i&&this.mNodeSelect.dispatchEvent({definition:i.definition,port:this.mNodes.context?{source:this.mNodes.context,target:this.findMatchingPortDefinition(this.mNodes.context,i.definition)}:null})}}}};var Us=`:host {\r
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
}`;var Hs=`<!-- Resizeable part of node -->\r
<kg-resize-box #ResizeBox class="node {{this.editMode ? 'edit' : ''}} {{this.selected ? 'selected' : ''}}" top right bottom left virtual [snap]="this.gridSize" (resize)="this.transformNodeData($event.value)">\r
    <div class="node-header" drop-handler (drag-move)="this.dragNode($event)" (pointerdown)="this.nodeDelete($event)" (dblclick)="this.editMode = true;">\r
        <span class="node-header__bar"></span>\r
        <span class="node-header__icon">\u270E</span>\r
\r
        $if(this.editMode) {\r
            <input #CommentInput class="node-header__comment-edit" [(value)]="this.comment" (blur)="this.editMode = false;" (keydown)="this.escapeEditMode($event)"/>\r
        }\r
        $if(!this.editMode) {\r
            <span class="node-header__comment">{{this.comment}}</span>\r
        }\r
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
`;function Pu(){function v(l,o){return function(c){e(o,"addInitializer"),i(c,"An initializer"),l.push(c)}}function t(l,o,u,c,r,b,d,T,x){var m;switch(r){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var s={kind:m,name:d?"#"+o:o,static:b,private:d,metadata:T},f={v:!1};s.addInitializer=v(c,f);var n,a;if(r===0?d?(n=u.get,a=u.set):(n=function(){return this[o]},a=function(p){this[o]=p}):r===2?n=function(){return u.value}:((r===1||r===3)&&(n=function(){return u.get.call(this)}),(r===1||r===4)&&(a=function(p){u.set.call(this,p)})),d)s.access=n&&a?{get:n,set:a}:n?{get:n}:{set:a};else{if(n){var P=n;n=function(p){return arguments.length===0&&(p=this),P.call(p)}}if(a){var _=a;a=function(p,M){return arguments.length===1&&(M=p,p=this),_.call(p,M)}}var D=function(p){return o in p};s.access=n&&a?{has:D,get:n,set:a}:n?{has:D,get:n}:{has:D,set:a}}try{return l(x,s)}finally{f.v=!0}}function e(l,o){if(l.v)throw new Error("attempted to call "+o+" after decoration was finished")}function i(l,o){if(typeof l!="function")throw new TypeError(o+" must be a function")}function h(l,o){var u=typeof o;if(l===1){if(u!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&i(o.get,"accessor.get"),o.set!==void 0&&i(o.set,"accessor.set"),o.init!==void 0&&i(o.init,"accessor.init")}else if(u!=="function"){var c;throw l===0?c="field":l===10?c="class":c="method",new TypeError(c+" decorators must return a function or void 0")}}function g(l,o,u,c,r,b,d,T,x){var m=u[0],s,f,n;d?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,c)),r===1?n={get:s.get,set:s.set}:r===2?n=s.value:r===3?n=s.get:r===4&&(n=s.set);var a,P,_;if(typeof m=="function")a=t(m,c,s,T,r,b,d,x,n),a!==void 0&&(h(r,a),r===0?f=a:r===1?(f=a.init,P=a.get||n.get,_=a.set||n.set,n={get:P,set:_}):n=a);else for(var D=m.length-1;D>=0;D--){var p=m[D];if(a=t(p,c,s,T,r,b,d,x,n),a!==void 0){h(r,a);var M;r===0?M=a:r===1?(M=a.init,P=a.get||n.get,_=a.set||n.set,n={get:P,set:_}):n=a,M!==void 0&&(f===void 0?f=M:typeof f=="function"?f=[f,M]:f.push(M))}}if(r===0||r===1){if(f===void 0)f=function(I,E){return E};else if(typeof f!="function"){var O=f;f=function(I,E){for(var N=E,L=0;L<O.length;L++)N=O[L].call(I,N);return N}}else{var z=f;f=function(I,E){return z.call(I,E)}}l.push(f)}r!==0&&(r===1?(s.get=n.get,s.set=n.set):r===2?s.value=n:r===3?s.get=n:r===4&&(s.set=n),d?r===1?(l.push(function(I,E){return n.get.call(I,E)}),l.push(function(I,E){return n.set.call(I,E)})):r===2?l.push(n):l.push(function(I,E){return n.call(I,E)}):Object.defineProperty(o,c,s))}function y(l,o,u){for(var c=[],r,b,d=new Map,T=new Map,x=0;x<o.length;x++){var m=o[x];if(Array.isArray(m)){var s=m[1],f=m[2],n=m.length>3,a=s>=5,P,_;if(a?(P=l,s=s-5,b=b||[],_=b):(P=l.prototype,r=r||[],_=r),s!==0&&!n){var D=a?T:d,p=D.get(f)||0;if(p===!0||p===3&&s!==4||p===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!p&&s>2?D.set(f,s):D.set(f,!0)}g(c,P,m,f,s,a,n,_,u)}}return w(c,r),w(c,b),c}function w(l,o){o&&l.push(function(u){for(var c=0;c<o.length;c++)o[c].call(u);return u})}function C(l,o,u){if(o.length>0){for(var c=[],r=l,b=l.name,d=o.length-1;d>=0;d--){var T={v:!1};try{var x=o[d](r,{kind:"class",name:b,addInitializer:v(c,T),metadata:u})}finally{T.v=!0}x!==void 0&&(h(10,x),r=x)}return[S(r,u),function(){for(var m=0;m<c.length;m++)c[m].call(r)}]}}function S(l,o){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,u,c,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var d=Object.create(b===void 0?null:b),T=y(o,u,d);return c.length||S(o,d),{e:T,get c(){return C(o,c,d)}}}}function ea(v,t,e,i){return(ea=Pu())(v,t,e,i)}var ra,Xs,oa,na,ia,sa,aa,la,ca,ua,ha,Ys,Ws,Zs,qs,Js,Ks,Qs,ks,Lr;ra=$({selector:"potatno-comment-node",template:Hs,style:Us,components:[Wt],modules:[Ne]}),oa=V.state(),na=V.state(),ia=V.state(),sa=B(),aa=B(),la=bt("CommentInput"),ca=tt("node-drag"),ua=bt("ResizeBox"),ha=V.state();var ta=class{static{({e:[Ys,Ws,Zs,qs,Js,Ks,Qs,ks],c:[Lr,Xs]}=ea(this,[[oa,1,"editMode"],[na,1,"enableBigview"],[ia,1,"gridZoom"],[sa,3,"nodeData"],[aa,3,"selected"],[la,1,"mCommentInput"],[ca,1,"mDrag"],[ua,1,"mResizeBox"],[ha,1,"mSelected"]],[ra]))}constructor(t=F.use(U),e=F.use(H)){this.mComponent=t,this.mManager=e,this.mNodeData=null,this.mSelected=!1,this.editMode=!1,this.enableBigview=!1,this.gridZoom=0,this.updateForZoomLevel(),this.mUnsubscribeGrid=this.mManager.subscribe(R.SpecialGrid,()=>{this.updateForZoomLevel()}),this.mUnsubscribe=this.mManager.subscribe(R.Node,i=>{i.item===this.mNodeData&&this.resyncComponent(this.nodeData)})}mComponent;mManager;mNodeData;mUnsubscribe;mUnsubscribeGrid;get comment(){return this.nodeData.label??""}set comment(t){this.nodeData.label=t}#t=(ks(this),Ys(this));get editMode(){return this.#t}set editMode(t){this.#t=t}#e=Ws(this);get enableBigview(){return this.#e}set enableBigview(t){this.#e=t}#r=Zs(this);get gridZoom(){return this.#r}set gridZoom(t){this.#r=t}get gridSize(){return this.mManager.grid.gridSize}get nodeData(){if(!this.mNodeData)throw new A("Node data not set.",this);return this.mNodeData}set nodeData(t){this.mNodeData=t,t&&(this.resyncComponent(t),this.mComponent.updater.update())}get selected(){return this.mSelected}set selected(t){this.mSelected=this.parseBoolean(t)}#o=qs(this);get mCommentInput(){return this.#o}set mCommentInput(t){this.#o=t}#n=Js(this);get mDrag(){return this.#n}set mDrag(t){this.#n=t}#i=Ks(this);get mResizeBox(){return this.#i}set mResizeBox(t){this.#i=t}#s=Qs(this);get mSelected(){return this.#s}set mSelected(t){this.#s=t}nodeDelete(t){this.editMode||t.button===2&&(t.preventDefault(),this.mManager.graph.removeNode(this.nodeData))}dragNode(t){if(this.editMode){t.preventDefault();return}let e=this.mComponent.element.getBoundingClientRect(),i=this.mComponent.element.offsetWidth?e.width/this.mComponent.element.offsetWidth:1,h=this.mComponent.element.offsetHeight?e.height/this.mComponent.element.offsetHeight:1,g=Math.round(t.pointerPosition.x/i/this.mManager.grid.gridSize),y=Math.round(t.pointerPosition.y/h/this.mManager.grid.gridSize),w=Math.round((t.pointerPosition.x-t.moveDistance.x)/i/this.mManager.grid.gridSize),C=Math.round((t.pointerPosition.y-t.moveDistance.y)/h/this.mManager.grid.gridSize),S=g-w,l=y-C;S===0&&l===0||(this.mDrag.dispatchEvent(new Nr(S,l)),this.mManager.graph.transformNode(this.nodeData,o=>{o.moveTo(this.nodeData.transformation.x+S,this.nodeData.transformation.y+l)}))}escapeEditMode(t){(t.key==="Escape"||t.key==="Enter")&&(t.preventDefault(),this.editMode=!1)}onConnect(){this.resyncComponent(this.nodeData)}onDeconstruct(){this.mUnsubscribe(),this.mUnsubscribeGrid()}onUpdate(){this.mCommentInput&&this.getFocusedElement(document)!==this.mCommentInput&&this.mCommentInput.select()}transformNodeData(t){this.mManager.graph.transformNode(this.nodeData,e=>{let i=e.transformation.width,h=e.transformation.height;e.resizeTo(t.width/this.mManager.grid.gridSize,t.height/this.mManager.grid.gridSize);let g=e.transformation.width-i,y=e.transformation.height-h;y!==0&&(t.resizeHandle&wt.top)>0&&e.moveTo(e.transformation.x,e.transformation.y-y),g!==0&&(t.resizeHandle&wt.left)>0&&e.moveTo(e.transformation.x-g,e.transformation.y)})}getFocusedElement(t){let e=t.activeElement;return e?e.shadowRoot?this.getFocusedElement(e.shadowRoot):e:null}parseBoolean(t){if(typeof t=="string"){if(t==="")return!0;let e=t.toLowerCase();if(e==="true"||e==="false")return e==="true"}return!!t}resyncComponent(t){let e=t.transformation.x,i=t.transformation.y;if(this.mComponent.element.style.setProperty("left",`calc(var(--potatno-grid-size) * ${e})`),this.mComponent.element.style.setProperty("top",`calc(var(--potatno-grid-size) * ${i} - 8px)`),this.mResizeBox){let h=t.transformation.width*this.mManager.grid.gridSize,g=t.transformation.height*this.mManager.grid.gridSize;this.mResizeBox.width=h,this.mResizeBox.height=g}this.mComponent.updater.updateAsync()}updateForZoomLevel(){this.enableBigview=this.mManager.grid.zoom<.25,this.enableBigview&&(this.gridZoom=this.mManager.grid.zoom),this.mComponent.element.style.setProperty("z-index",(this.enableBigview?9999:-1).toString())}static{Xs()}},Nr=class{mX;mY;get x(){return this.mX}get y(){return this.mY}constructor(t,e){this.mX=t,this.mY=e}};var fa=`:host {\r
    --potatno-port-value-size: 6px;\r
    --potatno-port-flow-size: 16px;\r
    --potatno-port-width: max(var(--potatno-port-value-size), var(--potatno-port-flow-size));\r
\r
    /* Give the handle a fixed width and center the content. Child are overflowing but the parent can position based on the absolute center */\r
    display: flex;\r
    justify-content: center;\r
    width: 10px;\r
\r
    /* The connect slide-out and glow shadow must not be clipped. */\r
    overflow: visible;\r
\r
    /* Purely visual. Drag and hover are handled by the parent. */\r
    pointer-events: none;\r
}\r
\r
.handle {\r
    /* Base color, provided per instance. The connect animation drives --potatno-port-handle-color from it. */\r
    --type-color: var(--potatno-color-text);\r
    --potatno-port-handle-color: var(--type-color);\r
\r
    position: relative;\r
\r
    /* Animate the connect slide-out. */\r
    transition: translate 0.1s ease-out;\r
\r
    /* Flow port: bar with an arrow tip. */\r
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
        &.output {\r
            &::after {\r
                right: 0px;\r
                border-left: calc(var(--potatno-port-flow-size) / 3) solid color-mix(in srgb, var(--potatno-port-handle-color) 30%, var(--potatno-color-background));\r
            }\r
\r
            &::before {\r
                border-radius: 2px 0 0 2px;\r
            }\r
\r
            &.connected::after {\r
                border-left-color: var(--potatno-port-handle-color);\r
            }\r
\r
            &.error::after {\r
                border-left-color: var(--potatno-color-error);\r
            }\r
\r
            /* Slide out towards the connection wire on connect. */\r
            &.connected {\r
                translate: 5px 0;\r
                animation: animateOutputConnect var(--potatno-connection-animation) ease-in-out 0s forwards;\r
            }\r
        }\r
\r
        &.input {\r
            /* Arrow tip on the left. */\r
            flex-direction: row-reverse;\r
\r
            &::after {\r
                left: 0px;\r
                border-right: calc(var(--potatno-port-flow-size) / 3) solid color-mix(in srgb, var(--potatno-port-handle-color) 30%, var(--potatno-color-background));\r
            }\r
\r
            &::before {\r
                border-radius: 0 2px 2px 0;\r
            }\r
\r
            &.connected::after {\r
                border-right-color: var(--potatno-port-handle-color);\r
            }\r
\r
            &.error::after {\r
                border-right-color: var(--potatno-color-error);\r
            }\r
\r
            /* Slide out towards the connection wire on connect. Delayed to stay in sync with the delayed glow. */\r
            &.connected {\r
                translate: -5px 0;\r
                transition-delay: calc(var(--potatno-connection-animation) * 0.7);\r
                animation: animateInputConnect calc(var(--potatno-connection-animation) * 0.5) ease-out calc(var(--potatno-connection-animation) * 0.7) forwards;\r
            }\r
        }\r
    }\r
\r
    /* Value port: round dot. */\r
    &.value {\r
        border: 1px solid var(--potatno-port-handle-color);\r
        border-radius: 50%;\r
        height: calc(var(--potatno-port-value-size) - 1px);\r
        width: calc(var(--potatno-port-value-size) - 1px);\r
        background-color: color-mix(in srgb, var(--potatno-port-handle-color) 30%, var(--potatno-color-background));\r
\r
        /* This tr\xEDes to fix a very small offset, that comes from somewhere???  */\r
        transform: translateY(-0.2px);\r
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
        &.output.connected {\r
            translate: 5px 0;\r
            animation: animateOutputConnect var(--potatno-connection-animation) ease-in-out forwards;\r
        }\r
\r
        &.input.connected {\r
            translate: -5px 0;\r
            transition-delay: calc(var(--potatno-connection-animation) * 0.7);\r
            animation: animateInputConnect calc(var(--potatno-connection-animation) * 0.5) ease-out forwards;\r
            animation-delay: calc(var(--potatno-connection-animation) * 0.7);\r
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
`;var ma=`$if(this.hasPort) {\r
    <div class="handle {{this.portType}} {{this.portDirection}} {{this.connected ? 'connected' : ''}} {{this.hasError ? 'error' : ''}}" style="--type-color: {{this.portColor}}"></div>\r
}\r
`;function Mu(){function v(l,o){return function(c){e(o,"addInitializer"),i(c,"An initializer"),l.push(c)}}function t(l,o,u,c,r,b,d,T,x){var m;switch(r){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var s={kind:m,name:d?"#"+o:o,static:b,private:d,metadata:T},f={v:!1};s.addInitializer=v(c,f);var n,a;if(r===0?d?(n=u.get,a=u.set):(n=function(){return this[o]},a=function(p){this[o]=p}):r===2?n=function(){return u.value}:((r===1||r===3)&&(n=function(){return u.get.call(this)}),(r===1||r===4)&&(a=function(p){u.set.call(this,p)})),d)s.access=n&&a?{get:n,set:a}:n?{get:n}:{set:a};else{if(n){var P=n;n=function(p){return arguments.length===0&&(p=this),P.call(p)}}if(a){var _=a;a=function(p,M){return arguments.length===1&&(M=p,p=this),_.call(p,M)}}var D=function(p){return o in p};s.access=n&&a?{has:D,get:n,set:a}:n?{has:D,get:n}:{has:D,set:a}}try{return l(x,s)}finally{f.v=!0}}function e(l,o){if(l.v)throw new Error("attempted to call "+o+" after decoration was finished")}function i(l,o){if(typeof l!="function")throw new TypeError(o+" must be a function")}function h(l,o){var u=typeof o;if(l===1){if(u!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&i(o.get,"accessor.get"),o.set!==void 0&&i(o.set,"accessor.set"),o.init!==void 0&&i(o.init,"accessor.init")}else if(u!=="function"){var c;throw l===0?c="field":l===10?c="class":c="method",new TypeError(c+" decorators must return a function or void 0")}}function g(l,o,u,c,r,b,d,T,x){var m=u[0],s,f,n;d?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,c)),r===1?n={get:s.get,set:s.set}:r===2?n=s.value:r===3?n=s.get:r===4&&(n=s.set);var a,P,_;if(typeof m=="function")a=t(m,c,s,T,r,b,d,x,n),a!==void 0&&(h(r,a),r===0?f=a:r===1?(f=a.init,P=a.get||n.get,_=a.set||n.set,n={get:P,set:_}):n=a);else for(var D=m.length-1;D>=0;D--){var p=m[D];if(a=t(p,c,s,T,r,b,d,x,n),a!==void 0){h(r,a);var M;r===0?M=a:r===1?(M=a.init,P=a.get||n.get,_=a.set||n.set,n={get:P,set:_}):n=a,M!==void 0&&(f===void 0?f=M:typeof f=="function"?f=[f,M]:f.push(M))}}if(r===0||r===1){if(f===void 0)f=function(I,E){return E};else if(typeof f!="function"){var O=f;f=function(I,E){for(var N=E,L=0;L<O.length;L++)N=O[L].call(I,N);return N}}else{var z=f;f=function(I,E){return z.call(I,E)}}l.push(f)}r!==0&&(r===1?(s.get=n.get,s.set=n.set):r===2?s.value=n:r===3?s.get=n:r===4&&(s.set=n),d?r===1?(l.push(function(I,E){return n.get.call(I,E)}),l.push(function(I,E){return n.set.call(I,E)})):r===2?l.push(n):l.push(function(I,E){return n.call(I,E)}):Object.defineProperty(o,c,s))}function y(l,o,u){for(var c=[],r,b,d=new Map,T=new Map,x=0;x<o.length;x++){var m=o[x];if(Array.isArray(m)){var s=m[1],f=m[2],n=m.length>3,a=s>=5,P,_;if(a?(P=l,s=s-5,b=b||[],_=b):(P=l.prototype,r=r||[],_=r),s!==0&&!n){var D=a?T:d,p=D.get(f)||0;if(p===!0||p===3&&s!==4||p===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!p&&s>2?D.set(f,s):D.set(f,!0)}g(c,P,m,f,s,a,n,_,u)}}return w(c,r),w(c,b),c}function w(l,o){o&&l.push(function(u){for(var c=0;c<o.length;c++)o[c].call(u);return u})}function C(l,o,u){if(o.length>0){for(var c=[],r=l,b=l.name,d=o.length-1;d>=0;d--){var T={v:!1};try{var x=o[d](r,{kind:"class",name:b,addInitializer:v(c,T),metadata:u})}finally{T.v=!0}x!==void 0&&(h(10,x),r=x)}return[S(r,u),function(){for(var m=0;m<c.length;m++)c[m].call(r)}]}}function S(l,o){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,u,c,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var d=Object.create(b===void 0?null:b),T=y(o,u,d);return c.length||S(o,d),{e:T,get c(){return C(o,c,d)}}}}function va(v,t,e,i){return(va=Mu())(v,t,e,i)}var ya,da,ba,wa,pa,Le;ya=$({selector:"potatno-port-handle",template:ma,style:fa}),ba=B(),wa=B();var ga=class{static{({e:[pa],c:[Le,da]}=va(this,[[ba,3,"connected"],[wa,3,"port"]],[ya]))}constructor(t=F.use(U),e=F.use(H)){pa(this),this.mComponent=t,this.mManager=e,this.mPort=null,this.mConnected=!1,this.mUnsubscribe=this.mManager.subscribe(R.Connection|R.SpecialValidation,()=>{this.mComponent.updater.updateAsync()})}mComponent;mManager;mConnected;mPort;mUnsubscribe;get connected(){return this.mConnected}set connected(t){this.mConnected=this.parseBoolean(t),this.mPort&&this.mComponent.updater.updateAsync()}get hasError(){return this.mManager.integrity.errorItems.has(this.port)}get hasPort(){return this.mPort!==null}get port(){if(!this.mPort)throw new A("Port is not setup",this);return this.mPort}set port(t){this.mPort!==t&&(this.mPort=t,this.mComponent.updater.update())}get portColor(){return this.port.portType==="flow"?"var(--potatno-color-text)":this.mManager.generateStringColor(this.port.resolvedDataType)}get portDirection(){return this.port.direction??"output"}get portType(){return this.port.portType}onDeconstruct(){this.mUnsubscribe()}parseBoolean(t){if(typeof t=="string"){if(t==="")return!0;let e=t.toLowerCase();if(e==="true"||e==="false")return e==="true"}return!!t}static{da()}};var xa=`:host {\r
    --potatno-port-value-size: 6px;\r
    --potatno-port-flow-size: 16px;\r
    --potatno-port-width: max(var(--potatno-port-value-size), var(--potatno-port-flow-size));\r
\r
    display: block;\r
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
        position: absolute;\r
        height: 2px;\r
        width: calc(100% - 4px);\r
        background-color: var(--potatno-port-color);\r
        border-radius: 1px;\r
        z-index: -10;\r
\r
        /* Transition between glow effect */\r
        transition: background-color 0.15s, box-shadow 0.15s;\r
    }\r
\r
    .selected &::after {\r
        background-color: color-mix(in srgb, var(--potatno-port-color) 50%, #fff);\r
        box-shadow: 0 0 10px 5px var(--potatno-port-color);\r
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
    /* Move both port areas left and right. */\r
    &.input {\r
        left: -100%;\r
    }\r
\r
    &.output {\r
        right: -100%;\r
    }\r
\r
    /* Full box without border once the handle reports a connection. */\r
    &:has(> .port__handle[connected]:not([connected='false'])) {\r
        width: var(--potatno-grid-size);\r
        height: var(--potatno-grid-size);\r
        border: none;\r
\r
        /* Disable area on connected state */\r
        pointer-events: none;\r
    }\r
\r
    /* Small hover animation for ports. */\r
    &:hover.output .port__handle {\r
        transform: translateX(-1px);\r
    }\r
\r
    &:hover.input .port__handle {\r
        transform: translateX(1px);\r
    }\r
\r
    /* Positioning wrapper. The handle visual and connect animation live in potatno-port-handle. */\r
    .port__handle {\r
        position: absolute;\r
        transition: transform 0.15s ease-in-out;\r
    }\r
\r
    &.output .port__handle {\r
        left: 0px;\r
        translate: -100% 0;\r
    }\r
\r
    &.input .port__handle {\r
        right: 1px;\r
        translate: 100% 0;\r
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
}`;var Ta=`<div class="node {{this.selected ? 'selected' : ''}}" style="--type-color: {{this.portColor}}" (dragover)="this.onDragOver($event)" (drop)="this.onDrop($event)">\r
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
    `;function Nu(){function v(l,o){return function(c){e(o,"addInitializer"),i(c,"An initializer"),l.push(c)}}function t(l,o,u,c,r,b,d,T,x){var m;switch(r){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var s={kind:m,name:d?"#"+o:o,static:b,private:d,metadata:T},f={v:!1};s.addInitializer=v(c,f);var n,a;if(r===0?d?(n=u.get,a=u.set):(n=function(){return this[o]},a=function(p){this[o]=p}):r===2?n=function(){return u.value}:((r===1||r===3)&&(n=function(){return u.get.call(this)}),(r===1||r===4)&&(a=function(p){u.set.call(this,p)})),d)s.access=n&&a?{get:n,set:a}:n?{get:n}:{set:a};else{if(n){var P=n;n=function(p){return arguments.length===0&&(p=this),P.call(p)}}if(a){var _=a;a=function(p,M){return arguments.length===1&&(M=p,p=this),_.call(p,M)}}var D=function(p){return o in p};s.access=n&&a?{has:D,get:n,set:a}:n?{has:D,get:n}:{has:D,set:a}}try{return l(x,s)}finally{f.v=!0}}function e(l,o){if(l.v)throw new Error("attempted to call "+o+" after decoration was finished")}function i(l,o){if(typeof l!="function")throw new TypeError(o+" must be a function")}function h(l,o){var u=typeof o;if(l===1){if(u!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&i(o.get,"accessor.get"),o.set!==void 0&&i(o.set,"accessor.set"),o.init!==void 0&&i(o.init,"accessor.init")}else if(u!=="function"){var c;throw l===0?c="field":l===10?c="class":c="method",new TypeError(c+" decorators must return a function or void 0")}}function g(l,o,u,c,r,b,d,T,x){var m=u[0],s,f,n;d?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,c)),r===1?n={get:s.get,set:s.set}:r===2?n=s.value:r===3?n=s.get:r===4&&(n=s.set);var a,P,_;if(typeof m=="function")a=t(m,c,s,T,r,b,d,x,n),a!==void 0&&(h(r,a),r===0?f=a:r===1?(f=a.init,P=a.get||n.get,_=a.set||n.set,n={get:P,set:_}):n=a);else for(var D=m.length-1;D>=0;D--){var p=m[D];if(a=t(p,c,s,T,r,b,d,x,n),a!==void 0){h(r,a);var M;r===0?M=a:r===1?(M=a.init,P=a.get||n.get,_=a.set||n.set,n={get:P,set:_}):n=a,M!==void 0&&(f===void 0?f=M:typeof f=="function"?f=[f,M]:f.push(M))}}if(r===0||r===1){if(f===void 0)f=function(I,E){return E};else if(typeof f!="function"){var O=f;f=function(I,E){for(var N=E,L=0;L<O.length;L++)N=O[L].call(I,N);return N}}else{var z=f;f=function(I,E){return z.call(I,E)}}l.push(f)}r!==0&&(r===1?(s.get=n.get,s.set=n.set):r===2?s.value=n:r===3?s.get=n:r===4&&(s.set=n),d?r===1?(l.push(function(I,E){return n.get.call(I,E)}),l.push(function(I,E){return n.set.call(I,E)})):r===2?l.push(n):l.push(function(I,E){return n.call(I,E)}):Object.defineProperty(o,c,s))}function y(l,o,u){for(var c=[],r,b,d=new Map,T=new Map,x=0;x<o.length;x++){var m=o[x];if(Array.isArray(m)){var s=m[1],f=m[2],n=m.length>3,a=s>=5,P,_;if(a?(P=l,s=s-5,b=b||[],_=b):(P=l.prototype,r=r||[],_=r),s!==0&&!n){var D=a?T:d,p=D.get(f)||0;if(p===!0||p===3&&s!==4||p===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!p&&s>2?D.set(f,s):D.set(f,!0)}g(c,P,m,f,s,a,n,_,u)}}return w(c,r),w(c,b),c}function w(l,o){o&&l.push(function(u){for(var c=0;c<o.length;c++)o[c].call(u);return u})}function C(l,o,u){if(o.length>0){for(var c=[],r=l,b=l.name,d=o.length-1;d>=0;d--){var T={v:!1};try{var x=o[d](r,{kind:"class",name:b,addInitializer:v(c,T),metadata:u})}finally{T.v=!0}x!==void 0&&(h(10,x),r=x)}return[S(r,u),function(){for(var m=0;m<c.length;m++)c[m].call(r)}]}}function S(l,o){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,u,c,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var d=Object.create(b===void 0?null:b),T=y(o,u,d);return c.length||S(o,d),{e:T,get c(){return C(o,c,d)}}}}function Sa(v,t,e,i){return(Sa=Nu())(v,t,e,i)}var Aa,Da,Na,La,Ra,Oa,Fa,za,Ea,Ca,Pa,_a,Ia,Or;Aa=$({selector:"potatno-conjunction-node",template:Ta,style:xa,components:[Le]}),Na=bt("dragConnection"),La=bt("dragPath"),Ra=tt("node-drag"),Oa=B(),Fa=B(),za=V.state();var Ma=class{static{({e:[Ea,Ca,Pa,_a,Ia],c:[Or,Da]}=Sa(this,[[Na,1,"mDragConnectionSvg"],[La,1,"mDragConnectionPath"],[Ra,1,"mDrag"],[Oa,3,"nodeData"],[Fa,3,"selected"],[za,1,"mSelected"]],[Aa]))}constructor(t=F.use(U),e=F.use(H)){this.mComponent=t,this.mManager=e,this.mNodeData=null,this.mSelected=!1,this.mDragPositionEventHandler=i=>{this.mManager.grid.draggedPort.isDragging&&(performance.now()-i.timeStamp>100||this.renderDragWire(i.clientX,i.clientY))},document.addEventListener("dragover",this.mDragPositionEventHandler,{capture:!0}),this.mUnsubscribeNodeChange=this.mManager.subscribe(R.Node,i=>{i.item===this.mNodeData&&this.resyncComponent(this.nodeData)}),this.mUnsubscribeValidation=this.mManager.subscribe(R.Connection|R.SpecialValidation,()=>{this.mComponent.updater.updateAsync()})}mComponent;mDragPositionEventHandler;mManager;mNodeData;mUnsubscribeNodeChange;mUnsubscribeValidation;#t=(Ia(this),Ea(this));get mDragConnectionSvg(){return this.#t}set mDragConnectionSvg(t){this.#t=t}#e=Ca(this);get mDragConnectionPath(){return this.#e}set mDragConnectionPath(t){this.#e=t}#r=Pa(this);get mDrag(){return this.#r}set mDrag(t){this.#r=t}get inputHasError(){return this.mManager.integrity.errorItems.has(this.nodeData)||this.mManager.integrity.errorItems.has(this.nodePorts.input)}get isInputConnected(){return this.nodePorts.input.connectedPorts.size>0}get isOutputConnected(){return this.nodePorts.output.connectedPorts.size>0}get inputPort(){return this.nodePorts.input}get outputPort(){return this.nodePorts.output}get nodeData(){if(!this.mNodeData)throw new A("Node data not set.",this);return this.mNodeData}set nodeData(t){this.mNodeData=t,t&&this.resyncComponent(t)}get outputHasError(){return this.mManager.integrity.errorItems.has(this.nodeData)||this.mManager.integrity.errorItems.has(this.nodePorts.output)}get portColor(){return this.portType==="flow"?"var(--potatno-color-text)":this.mManager.generateStringColor(this.portValueType)}get portType(){return this.nodeData.definitionId===Q.DEFINITION_ID?"flow":"value"}get portValueType(){return this.portType!=="value"?"":this.nodePorts.input.resolvedDataType}get nodePorts(){if(this.nodeData.inputs.list.length===0||this.nodeData.outputs.list.length===0)throw new A("Malformed conjunction node",this);return{input:this.nodeData.inputs.list[0],output:this.nodeData.outputs.list[0]}}get selected(){return this.mSelected}set selected(t){this.mSelected=this.parseBoolean(t)}#o=_a(this);get mSelected(){return this.#o}set mSelected(t){this.#o=t}dragNode(t){if(t.preventDefault(),t.button===2&&this.mManager.graph.removeNode(this.nodeData),t.button!==0)return;let e=this.nodeData.transformation.x*this.mManager.grid.gridSize,i=this.nodeData.transformation.y*this.mManager.grid.gridSize,h=this.nodeData.transformation.x,g=this.nodeData.transformation.y,y=this.mComponent.element.getBoundingClientRect(),w=this.mComponent.element.offsetWidth?y.width/this.mComponent.element.offsetWidth:1,C=this.mComponent.element.offsetHeight?y.height/this.mComponent.element.offsetHeight:1,S=t.clientX,l=t.clientY,o=c=>{c.stopPropagation();let r=(c.clientX-S)/w,b=(c.clientY-l)/C,d=Math.round((e+r)/this.mManager.grid.gridSize),T=Math.round((i+b)/this.mManager.grid.gridSize);h===d&&g===T||(this.mManager.graph.transformNode(this.nodeData,x=>{x.moveTo(d,T)}),this.mDrag.dispatchEvent(new Rr(d-h,T-g)),h=d,g=T)},u=()=>{document.removeEventListener("pointermove",o),document.removeEventListener("pointerup",u)};document.addEventListener("pointermove",o),document.addEventListener("pointerup",u)}onDeconstruct(){this.mUnsubscribeNodeChange(),this.mUnsubscribeValidation(),document.removeEventListener("dragover",this.mDragPositionEventHandler,{capture:!0})}onDragEnd(t){t.stopPropagation(),t.preventDefault(),this.mDragConnectionPath?.removeAttribute("d"),this.mManager.grid.setDraggingPort([]),this.mComponent.updater.updateAsync()}onDragOver(t){this.draggedPortCanConnect()&&(t.preventDefault(),t.stopPropagation(),t.dataTransfer&&(t.dataTransfer.dropEffect="link"))}onDragStart(t){t.stopPropagation(),t.dataTransfer.effectAllowed="link",t.dataTransfer.setDragImage(document.createElement("div"),0,0),this.mManager.grid.setDraggingPort([this.nodePorts.input,this.nodePorts.output]),this.mComponent.updater.updateAsync()}onDrop(t){this.draggedPortCanConnect()&&(t.preventDefault(),t.stopPropagation(),this.mManager.grid.draggedPort.isDragging&&this.mManager.graph.mergeConnectPorts([...this.nodeData.inputs.list,...this.nodeData.outputs.list],this.mManager.grid.draggedPort.ports))}createDragPath(t,e){let i=this.mManager.grid.pixelToGridSpace(t,e);return this.mManager.connections.createTemporaryPath(this.nodePorts.input,i).attributeValue}draggedPortCanConnect(){if(!this.mManager.grid.draggedPort.isDragging)return!1;let t=this.nodePorts,e=[t.input,t.output];for(let i of this.mManager.grid.draggedPort.ports)for(let h of e)if(i!==h&&i.direction!==h.direction&&i.portType===h.portType)return!0;return!1}parseBoolean(t){if(typeof t=="string"){if(t==="")return!0;let e=t.toLowerCase();if(e==="true"||e==="false")return e==="true"}return!!t}renderDragWire(t,e){let i=this.nodePorts.input;if(!this.mManager.grid.draggedPort.hasPort(i)||!this.mManager.grid.draggedPort.updatePointer(t,e))return;let h=this.mManager.grid.draggedPort.portPositions.get(i);if(!h)return;let g=h.x*this.mManager.grid.gridSize,y=h.y*this.mManager.grid.gridSize;this.mDragConnectionSvg?.style.setProperty("transform",`translate(${-g}px, ${-y}px)`),this.mDragConnectionPath?.setAttribute("d",this.createDragPath(t,e))}resyncComponent(t){let e=t.transformation.x*this.mManager.grid.gridSize,i=t.transformation.y*this.mManager.grid.gridSize;this.mComponent.element.style.setProperty("left",`${e}px`),this.mComponent.element.style.setProperty("top",`${i}px`),this.mComponent.updater.update()}static{Da()}},Rr=class{mX;mY;get x(){return this.mX}get y(){return this.mY}constructor(t,e){this.mX=t,this.mY=e}};var ja=`:host {\r
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
}`;var Va=`<svg class="svg-layer" xmlns="http://www.w3.org/2000/svg" >\r
    $for(connection of this.connections.values()){\r
        <g class="{{this.connection.state.hasError ? 'error' : ''}} {{this.connection.state.isNew ? 'new' : ''}}" style="--path-length: {{ this.connection.path.length }}; {{ this.connection.color ? \`--path-color: \${this.connection.color};\` : '' }}" xmlns="http://www.w3.org/2000/svg">\r
            <path class="path" d="{{this.connection.path.attributeValue}}" xmlns="http://www.w3.org/2000/svg"/>\r
            <path class="path path--mouse-target" d="{{this.connection.path.attributeValue}}" (pointerdown)="this.deleteConnection($event, this.connection)" (dblclick)="this.createConjunction($event, this.connection)" xmlns="http://www.w3.org/2000/svg"/>\r
        </g>\r
    }\r
</svg>\r
`;function Ou(){function v(l,o){return function(c){e(o,"addInitializer"),i(c,"An initializer"),l.push(c)}}function t(l,o,u,c,r,b,d,T,x){var m;switch(r){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var s={kind:m,name:d?"#"+o:o,static:b,private:d,metadata:T},f={v:!1};s.addInitializer=v(c,f);var n,a;if(r===0?d?(n=u.get,a=u.set):(n=function(){return this[o]},a=function(p){this[o]=p}):r===2?n=function(){return u.value}:((r===1||r===3)&&(n=function(){return u.get.call(this)}),(r===1||r===4)&&(a=function(p){u.set.call(this,p)})),d)s.access=n&&a?{get:n,set:a}:n?{get:n}:{set:a};else{if(n){var P=n;n=function(p){return arguments.length===0&&(p=this),P.call(p)}}if(a){var _=a;a=function(p,M){return arguments.length===1&&(M=p,p=this),_.call(p,M)}}var D=function(p){return o in p};s.access=n&&a?{has:D,get:n,set:a}:n?{has:D,get:n}:{has:D,set:a}}try{return l(x,s)}finally{f.v=!0}}function e(l,o){if(l.v)throw new Error("attempted to call "+o+" after decoration was finished")}function i(l,o){if(typeof l!="function")throw new TypeError(o+" must be a function")}function h(l,o){var u=typeof o;if(l===1){if(u!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&i(o.get,"accessor.get"),o.set!==void 0&&i(o.set,"accessor.set"),o.init!==void 0&&i(o.init,"accessor.init")}else if(u!=="function"){var c;throw l===0?c="field":l===10?c="class":c="method",new TypeError(c+" decorators must return a function or void 0")}}function g(l,o,u,c,r,b,d,T,x){var m=u[0],s,f,n;d?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,c)),r===1?n={get:s.get,set:s.set}:r===2?n=s.value:r===3?n=s.get:r===4&&(n=s.set);var a,P,_;if(typeof m=="function")a=t(m,c,s,T,r,b,d,x,n),a!==void 0&&(h(r,a),r===0?f=a:r===1?(f=a.init,P=a.get||n.get,_=a.set||n.set,n={get:P,set:_}):n=a);else for(var D=m.length-1;D>=0;D--){var p=m[D];if(a=t(p,c,s,T,r,b,d,x,n),a!==void 0){h(r,a);var M;r===0?M=a:r===1?(M=a.init,P=a.get||n.get,_=a.set||n.set,n={get:P,set:_}):n=a,M!==void 0&&(f===void 0?f=M:typeof f=="function"?f=[f,M]:f.push(M))}}if(r===0||r===1){if(f===void 0)f=function(I,E){return E};else if(typeof f!="function"){var O=f;f=function(I,E){for(var N=E,L=0;L<O.length;L++)N=O[L].call(I,N);return N}}else{var z=f;f=function(I,E){return z.call(I,E)}}l.push(f)}r!==0&&(r===1?(s.get=n.get,s.set=n.set):r===2?s.value=n:r===3?s.get=n:r===4&&(s.set=n),d?r===1?(l.push(function(I,E){return n.get.call(I,E)}),l.push(function(I,E){return n.set.call(I,E)})):r===2?l.push(n):l.push(function(I,E){return n.call(I,E)}):Object.defineProperty(o,c,s))}function y(l,o,u){for(var c=[],r,b,d=new Map,T=new Map,x=0;x<o.length;x++){var m=o[x];if(Array.isArray(m)){var s=m[1],f=m[2],n=m.length>3,a=s>=5,P,_;if(a?(P=l,s=s-5,b=b||[],_=b):(P=l.prototype,r=r||[],_=r),s!==0&&!n){var D=a?T:d,p=D.get(f)||0;if(p===!0||p===3&&s!==4||p===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!p&&s>2?D.set(f,s):D.set(f,!0)}g(c,P,m,f,s,a,n,_,u)}}return w(c,r),w(c,b),c}function w(l,o){o&&l.push(function(u){for(var c=0;c<o.length;c++)o[c].call(u);return u})}function C(l,o,u){if(o.length>0){for(var c=[],r=l,b=l.name,d=o.length-1;d>=0;d--){var T={v:!1};try{var x=o[d](r,{kind:"class",name:b,addInitializer:v(c,T),metadata:u})}finally{T.v=!0}x!==void 0&&(h(10,x),r=x)}return[S(r,u),function(){for(var m=0;m<c.length;m++)c[m].call(r)}]}}function S(l,o){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,u,c,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var d=Object.create(b===void 0?null:b),T=y(o,u,d);return c.length||S(o,d),{e:T,get c(){return C(o,c,d)}}}}function Ha(v,t,e,i){return(Ha=Ou())(v,t,e,i)}var Xa,Ba,Ya,$a,Ga,Fr;Xa=$({selector:"potatno-connection-layer",template:Va,style:ja}),Ya=V.state({complexValue:!0});var Ua=class{static{({e:[$a,Ga],c:[Fr,Ba]}=Ha(this,[[Ya,1,"connections"]],[Xa]))}constructor(t=F.use(H)){this.mManager=t,this.connections=new Map;let e=0;this.mUnsubscribe=this.mManager.subscribe(R.SpecialActiveFunction|R.Node|R.Connection,()=>{e===0&&(e=requestAnimationFrame(()=>{e=0,this.updateConnections()}))})}mManager;mUnsubscribe;#t=(Ga(this),$a(this));get connections(){return this.#t}set connections(t){this.#t=t}createConjunction(t,e){t.preventDefault(),t.stopPropagation();let i=e.port.output.portType==="flow"?this.mManager.project.nodeDefinitions.get(Q.DEFINITION_ID):this.mManager.project.nodeDefinitions.get(rt.DEFINITION_ID),h=this.mManager.grid.pixelToGridSpace(t.clientX,t.clientY),g=this.mManager.graph.addNode(this.mManager.activeFunction,i,{x:h.x,y:h.y,height:0,width:0});this.mManager.graph.disconnectPorts(e.port.output,e.port.input);let y=g.inputs.list[0],w=g.outputs.list[0];this.mManager.graph.connectPorts(y,e.port.output),this.mManager.graph.connectPorts(y,e.port.input),this.mManager.graph.connectPorts(w,e.port.output),this.mManager.graph.connectPorts(w,e.port.input)}deleteConnection(t,e){t.button===2&&(t.preventDefault(),t.stopPropagation(),this.mManager.graph.disconnectPorts(e.port.output,e.port.input))}onDeconstruct(){this.mUnsubscribe()}createConnection(t,e,i){let h=this.mManager.integrity.errorItems,g=h.has(e)||h.has(i),y=(()=>{switch(i.portType){case"value":return i;case"flow":return e}})(),w=e.portType==="flow"?"":this.mManager.generateStringColor(e.resolvedDataType),C=this.mManager.connections.getConnectionPath(e,i);return{color:w,path:{attributeValue:C.attributeValue,length:C.length},state:{isNew:!t.has(y),hasError:g},port:{primary:y,output:e,input:i}}}updateConnections(){let t=this.connections;this.connections=new Map;for(let e of this.mManager.activeFunction.nodes)for(let i of e.outputs.list)for(let h of i.connectedPorts){let g=this.createConnection(t,i,h);this.connections.set(g.port.primary,g)}}static{Ba()}};function Fu(){function v(l,o){return function(c){e(o,"addInitializer"),i(c,"An initializer"),l.push(c)}}function t(l,o,u,c,r,b,d,T,x){var m;switch(r){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var s={kind:m,name:d?"#"+o:o,static:b,private:d,metadata:T},f={v:!1};s.addInitializer=v(c,f);var n,a;if(r===0?d?(n=u.get,a=u.set):(n=function(){return this[o]},a=function(p){this[o]=p}):r===2?n=function(){return u.value}:((r===1||r===3)&&(n=function(){return u.get.call(this)}),(r===1||r===4)&&(a=function(p){u.set.call(this,p)})),d)s.access=n&&a?{get:n,set:a}:n?{get:n}:{set:a};else{if(n){var P=n;n=function(p){return arguments.length===0&&(p=this),P.call(p)}}if(a){var _=a;a=function(p,M){return arguments.length===1&&(M=p,p=this),_.call(p,M)}}var D=function(p){return o in p};s.access=n&&a?{has:D,get:n,set:a}:n?{has:D,get:n}:{has:D,set:a}}try{return l(x,s)}finally{f.v=!0}}function e(l,o){if(l.v)throw new Error("attempted to call "+o+" after decoration was finished")}function i(l,o){if(typeof l!="function")throw new TypeError(o+" must be a function")}function h(l,o){var u=typeof o;if(l===1){if(u!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&i(o.get,"accessor.get"),o.set!==void 0&&i(o.set,"accessor.set"),o.init!==void 0&&i(o.init,"accessor.init")}else if(u!=="function"){var c;throw l===0?c="field":l===10?c="class":c="method",new TypeError(c+" decorators must return a function or void 0")}}function g(l,o,u,c,r,b,d,T,x){var m=u[0],s,f,n;d?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,c)),r===1?n={get:s.get,set:s.set}:r===2?n=s.value:r===3?n=s.get:r===4&&(n=s.set);var a,P,_;if(typeof m=="function")a=t(m,c,s,T,r,b,d,x,n),a!==void 0&&(h(r,a),r===0?f=a:r===1?(f=a.init,P=a.get||n.get,_=a.set||n.set,n={get:P,set:_}):n=a);else for(var D=m.length-1;D>=0;D--){var p=m[D];if(a=t(p,c,s,T,r,b,d,x,n),a!==void 0){h(r,a);var M;r===0?M=a:r===1?(M=a.init,P=a.get||n.get,_=a.set||n.set,n={get:P,set:_}):n=a,M!==void 0&&(f===void 0?f=M:typeof f=="function"?f=[f,M]:f.push(M))}}if(r===0||r===1){if(f===void 0)f=function(I,E){return E};else if(typeof f!="function"){var O=f;f=function(I,E){for(var N=E,L=0;L<O.length;L++)N=O[L].call(I,N);return N}}else{var z=f;f=function(I,E){return z.call(I,E)}}l.push(f)}r!==0&&(r===1?(s.get=n.get,s.set=n.set):r===2?s.value=n:r===3?s.get=n:r===4&&(s.set=n),d?r===1?(l.push(function(I,E){return n.get.call(I,E)}),l.push(function(I,E){return n.set.call(I,E)})):r===2?l.push(n):l.push(function(I,E){return n.call(I,E)}):Object.defineProperty(o,c,s))}function y(l,o,u){for(var c=[],r,b,d=new Map,T=new Map,x=0;x<o.length;x++){var m=o[x];if(Array.isArray(m)){var s=m[1],f=m[2],n=m.length>3,a=s>=5,P,_;if(a?(P=l,s=s-5,b=b||[],_=b):(P=l.prototype,r=r||[],_=r),s!==0&&!n){var D=a?T:d,p=D.get(f)||0;if(p===!0||p===3&&s!==4||p===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!p&&s>2?D.set(f,s):D.set(f,!0)}g(c,P,m,f,s,a,n,_,u)}}return w(c,r),w(c,b),c}function w(l,o){o&&l.push(function(u){for(var c=0;c<o.length;c++)o[c].call(u);return u})}function C(l,o,u){if(o.length>0){for(var c=[],r=l,b=l.name,d=o.length-1;d>=0;d--){var T={v:!1};try{var x=o[d](r,{kind:"class",name:b,addInitializer:v(c,T),metadata:u})}finally{T.v=!0}x!==void 0&&(h(10,x),r=x)}return[S(r,u),function(){for(var m=0;m<c.length;m++)c[m].call(r)}]}}function S(l,o){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,u,c,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var d=Object.create(b===void 0?null:b),T=y(o,u,d);return c.length||S(o,d),{e:T,get c(){return C(o,c,d)}}}}function qa(v,t,e,i){return(qa=Fu())(v,t,e,i)}var Ja,Wa,Re;Ja=yt({access:Z.Read,selector:/^potatno-preview$/});var Za=class{static{({c:[Re,Wa]}=qa(this,[],[Ja]))}constructor(t=F.use(J),e=F.use(W),i=F.use(st)){this.mTarget=t,this.mProcedure=e.createExpressionProcedure(i.value)}mProcedure;mTarget;onUpdate(){let t=this.mProcedure.execute();if(!t){let i=this.mTarget.childNodes.length>0;return i&&(this.mTarget.innerHTML=""),i}let e=t.element;return this.mTarget.contains(e)?!1:(this.mTarget.innerHTML="",this.mTarget.appendChild(e),!0)}static{Wa()}};var Ka=`:host {\r
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
        right: 3px;\r
        height: 2px;\r
        width: calc(var(--potatno-port-values-line-length) - 3px);\r
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
        gap: 4px;\r
\r
        border: 1px solid var(--potatno-port-color);\r
        border-radius: var(--potatno-border-radius);\r
\r
        background-color: color-mix(in srgb, var(--potatno-port-color) 12%, var(--potatno-color-background));\r
        white-space: nowrap;\r
    }\r
\r
    .port-values__label {\r
        color: var(--potatno-port-color);\r
        font-size: 14px;\r
        user-select: none;\r
        white-space: nowrap;\r
    }\r
\r
    .port-values__input {\r
        padding: 2px 4px;\r
        width: 40px;\r
        border: 1px solid color-mix(in srgb, var(--potatno-port-color) 35%, transparent);\r
        border-radius: var(--potatno-border-radius);\r
        color: var(--potatno-color-text);\r
        background-color: color-mix(in srgb, var(--potatno-port-color) 8%, var(--potatno-color-background));\r
        box-sizing: border-box;\r
        font-size: 12px;\r
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
        font-size: 16px;\r
        user-select: none;\r
        white-space: nowrap;\r
        overflow: hidden;\r
        text-overflow: ellipsis;\r
\r
        /* Manually center text */\r
        padding: 0 0 5px 0;\r
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
    .output &:hover potatno-port-handle {\r
        transform: translateX(-1px);\r
    }\r
\r
    .input &:hover potatno-port-handle {\r
        transform: translateX(1px);\r
    }\r
\r
    /* Positioning wrapper. The handle visual and connect animation live in potatno-port-handle. */\r
    .port__handle {\r
        position: relative;\r
        display: flex;\r
        width: 15px;\r
        align-items: center;\r
        justify-content: center;\r
\r
        .output & {\r
            transform: translateX(8px);\r
        }\r
\r
        .input & {\r
            transform: translateX(-8px);\r
        }\r
    }\r
}\r
`;var Qa=`<div class="port-wrapper {{this.portDirection}}" style="--type-color: {{this.portColor}}" (dragover)="this.onDragOver($event)" (drop)="this.onDrop($event)">\r
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
`;function Vu(){function v(l,o){return function(c){e(o,"addInitializer"),i(c,"An initializer"),l.push(c)}}function t(l,o,u,c,r,b,d,T,x){var m;switch(r){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var s={kind:m,name:d?"#"+o:o,static:b,private:d,metadata:T},f={v:!1};s.addInitializer=v(c,f);var n,a;if(r===0?d?(n=u.get,a=u.set):(n=function(){return this[o]},a=function(p){this[o]=p}):r===2?n=function(){return u.value}:((r===1||r===3)&&(n=function(){return u.get.call(this)}),(r===1||r===4)&&(a=function(p){u.set.call(this,p)})),d)s.access=n&&a?{get:n,set:a}:n?{get:n}:{set:a};else{if(n){var P=n;n=function(p){return arguments.length===0&&(p=this),P.call(p)}}if(a){var _=a;a=function(p,M){return arguments.length===1&&(M=p,p=this),_.call(p,M)}}var D=function(p){return o in p};s.access=n&&a?{has:D,get:n,set:a}:n?{has:D,get:n}:{has:D,set:a}}try{return l(x,s)}finally{f.v=!0}}function e(l,o){if(l.v)throw new Error("attempted to call "+o+" after decoration was finished")}function i(l,o){if(typeof l!="function")throw new TypeError(o+" must be a function")}function h(l,o){var u=typeof o;if(l===1){if(u!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&i(o.get,"accessor.get"),o.set!==void 0&&i(o.set,"accessor.set"),o.init!==void 0&&i(o.init,"accessor.init")}else if(u!=="function"){var c;throw l===0?c="field":l===10?c="class":c="method",new TypeError(c+" decorators must return a function or void 0")}}function g(l,o,u,c,r,b,d,T,x){var m=u[0],s,f,n;d?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,c)),r===1?n={get:s.get,set:s.set}:r===2?n=s.value:r===3?n=s.get:r===4&&(n=s.set);var a,P,_;if(typeof m=="function")a=t(m,c,s,T,r,b,d,x,n),a!==void 0&&(h(r,a),r===0?f=a:r===1?(f=a.init,P=a.get||n.get,_=a.set||n.set,n={get:P,set:_}):n=a);else for(var D=m.length-1;D>=0;D--){var p=m[D];if(a=t(p,c,s,T,r,b,d,x,n),a!==void 0){h(r,a);var M;r===0?M=a:r===1?(M=a.init,P=a.get||n.get,_=a.set||n.set,n={get:P,set:_}):n=a,M!==void 0&&(f===void 0?f=M:typeof f=="function"?f=[f,M]:f.push(M))}}if(r===0||r===1){if(f===void 0)f=function(I,E){return E};else if(typeof f!="function"){var O=f;f=function(I,E){for(var N=E,L=0;L<O.length;L++)N=O[L].call(I,N);return N}}else{var z=f;f=function(I,E){return z.call(I,E)}}l.push(f)}r!==0&&(r===1?(s.get=n.get,s.set=n.set):r===2?s.value=n:r===3?s.get=n:r===4&&(s.set=n),d?r===1?(l.push(function(I,E){return n.get.call(I,E)}),l.push(function(I,E){return n.set.call(I,E)})):r===2?l.push(n):l.push(function(I,E){return n.call(I,E)}):Object.defineProperty(o,c,s))}function y(l,o,u){for(var c=[],r,b,d=new Map,T=new Map,x=0;x<o.length;x++){var m=o[x];if(Array.isArray(m)){var s=m[1],f=m[2],n=m.length>3,a=s>=5,P,_;if(a?(P=l,s=s-5,b=b||[],_=b):(P=l.prototype,r=r||[],_=r),s!==0&&!n){var D=a?T:d,p=D.get(f)||0;if(p===!0||p===3&&s!==4||p===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!p&&s>2?D.set(f,s):D.set(f,!0)}g(c,P,m,f,s,a,n,_,u)}}return w(c,r),w(c,b),c}function w(l,o){o&&l.push(function(u){for(var c=0;c<o.length;c++)o[c].call(u);return u})}function C(l,o,u){if(o.length>0){for(var c=[],r=l,b=l.name,d=o.length-1;d>=0;d--){var T={v:!1};try{var x=o[d](r,{kind:"class",name:b,addInitializer:v(c,T),metadata:u})}finally{T.v=!0}x!==void 0&&(h(10,x),r=x)}return[S(r,u),function(){for(var m=0;m<c.length;m++)c[m].call(r)}]}}function S(l,o){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,u,c,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var d=Object.create(b===void 0?null:b),T=y(o,u,d);return c.length||S(o,d),{e:T,get c(){return C(o,c,d)}}}}function nl(v,t,e,i){return(nl=Vu())(v,t,e,i)}var il,ka,sl,al,ll,tl,el,rl,zr;il=$({selector:"potatno-port",template:Qa,style:Ka,components:[Le]}),sl=bt("dragConnection"),al=bt("dragPath"),ll=B();var ol=class{static{({e:[tl,el,rl],c:[zr,ka]}=nl(this,[[sl,1,"mDragConnectionSvg"],[al,1,"mDragConnectionPath"],[ll,3,"port"]],[il]))}constructor(t=F.use(U),e=F.use(H)){this.mComponent=t,this.mManager=e,this.mPort=null,this.mDragPositionEventHandler=i=>{this.mManager.grid.draggedPort.isDragging&&(performance.now()-i.timeStamp>100||this.renderDragWire(i.clientX,i.clientY))},document.addEventListener("dragover",this.mDragPositionEventHandler,{capture:!0}),this.mUnsubscribeValidation=this.mManager.subscribe(R.Connection|R.SpecialValidation,()=>{this.mComponent.updater.updateAsync()})}mComponent;mDragPositionEventHandler;mManager;mPort;mUnsubscribeValidation;#t=(rl(this),tl(this));get mDragConnectionSvg(){return this.#t}set mDragConnectionSvg(t){this.#t=t}#e=el(this);get mDragConnectionPath(){return this.#e}set mDragConnectionPath(t){this.#e=t}get hasError(){return this.mManager.integrity.errorItems.has(this.port)}get inputDefinitions(){let t=this.port.project.types.getType(this.port.resolvedDataType);return t.inputs.map((e,i)=>({htmlType:(()=>{switch(e.type){case"boolean":return"checkbox";case"number":return"number";case"string":return"text"}})(),index:i,name:e.name,value:this.port.directValue[i]??"",totalCount:t.inputs.length}))}get isConnected(){return this.port.connectedPorts.size>0}get port(){if(!this.mPort)throw new A("Port is not setup",this);return this.mPort}set port(t){if(this.mPort!==t){if(t===null)throw new A("A null port cant be assigned.",this);this.mPort=t,this.mComponent.updater.update()}}get portColor(){return this.port.portType==="flow"?"var(--potatno-color-text)":this.mManager.generateStringColor(this.port.resolvedDataType)}get portDirection(){return this.port.direction??"output"}get portName(){return this.port.label??""}get portType(){return this.port.portType}get portValueType(){return this.port.portType!=="value"?"":this.port.resolvedDataType??""}get showValueInput(){return this.port.portType!=="value"||this.port.direction!=="input"||this.port.connectedPorts.size>0||this.mManager.grid.draggedPort.hasPort(this.port)?!1:!this.port.node.project.types.isGenericType(this.port.dataType??"")}onDeconstruct(){this.mUnsubscribeValidation(),document.removeEventListener("dragover",this.mDragPositionEventHandler,{capture:!0})}onDirectValueInput(t,e){let i=t.target,h=[...this.port.directValue];h[e]=i.type==="checkbox"?i.checked?"true":"false":i.value,this.mManager.graph.setPortDirectValue(this.port,h)}onDragEnd(t){t.stopPropagation(),t.preventDefault(),this.mDragConnectionPath?.removeAttribute("d"),this.mManager.grid.setDraggingPort([]),this.mComponent.updater.updateAsync()}onDragOver(t){this.draggedPortCanConnect()&&(t.preventDefault(),t.stopPropagation(),t.dataTransfer&&(t.dataTransfer.dropEffect="link"))}onDragStart(t){if(!t.dataTransfer){t.preventDefault();return}t.stopPropagation(),t.dataTransfer.effectAllowed="link",t.dataTransfer.setDragImage(document.createElement("div"),0,0),this.mManager.grid.setDraggingPort([this.port]),this.mComponent.updater.updateAsync()}onDrop(t){if(t.preventDefault(),t.stopPropagation(),!!this.draggedPortCanConnect()&&this.mManager.grid.draggedPort.isDragging)for(let e of this.mManager.grid.draggedPort.ports)this.mManager.graph.connectPorts(e,this.port)}createDragPath(t,e){let i=this.mManager.grid.pixelToGridSpace(t,e);return this.mManager.connections.createTemporaryPath(this.port,i).attributeValue}draggedPortCanConnect(){if(!this.mManager.grid.draggedPort.isDragging)return!1;for(let t of this.mManager.grid.draggedPort.ports)if(t!==this.port&&t.direction!==this.port.direction&&t.portType===this.port.portType)return!0;return!1}renderDragWire(t,e){if(!this.mManager.grid.draggedPort.hasPort(this.port)||!this.mDragConnectionSvg||!this.mManager.grid.draggedPort.updatePointer(t,e))return;let i=this.mManager.grid.draggedPort.portPositions.get(this.port);if(!i)return;let h=i.x*this.mManager.grid.gridSize,g=i.y*this.mManager.grid.gridSize;this.mDragConnectionSvg.style.setProperty("transform",`translate(${-h}px, ${-g}px)`),this.mDragConnectionPath?.setAttribute("d",this.createDragPath(t,e))}static{ka()}};var cl=`:host {\r
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
}`;var ul=`<div class="node {{this.hasError ? 'error' : ''}} {{this.selected ? 'selected' : ''}}" style="--node-category-color: {{this.nodeColor}}">\r
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
            <kg-select class="select" valueKey="definitionId" labelKey="label" [options]="this.previewPorts" [value]="this.previewPortDefinitionId" (change)="this.selectPreviewPort($event.value)" />\r
        </div>\r
\r
        <div class="node-preview__window" potatno-preview="this.previewDriver"></div>\r
    </div>\r
}`;function Gu(){function v(l,o){return function(c){e(o,"addInitializer"),i(c,"An initializer"),l.push(c)}}function t(l,o,u,c,r,b,d,T,x){var m;switch(r){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var s={kind:m,name:d?"#"+o:o,static:b,private:d,metadata:T},f={v:!1};s.addInitializer=v(c,f);var n,a;if(r===0?d?(n=u.get,a=u.set):(n=function(){return this[o]},a=function(p){this[o]=p}):r===2?n=function(){return u.value}:((r===1||r===3)&&(n=function(){return u.get.call(this)}),(r===1||r===4)&&(a=function(p){u.set.call(this,p)})),d)s.access=n&&a?{get:n,set:a}:n?{get:n}:{set:a};else{if(n){var P=n;n=function(p){return arguments.length===0&&(p=this),P.call(p)}}if(a){var _=a;a=function(p,M){return arguments.length===1&&(M=p,p=this),_.call(p,M)}}var D=function(p){return o in p};s.access=n&&a?{has:D,get:n,set:a}:n?{has:D,get:n}:{has:D,set:a}}try{return l(x,s)}finally{f.v=!0}}function e(l,o){if(l.v)throw new Error("attempted to call "+o+" after decoration was finished")}function i(l,o){if(typeof l!="function")throw new TypeError(o+" must be a function")}function h(l,o){var u=typeof o;if(l===1){if(u!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&i(o.get,"accessor.get"),o.set!==void 0&&i(o.set,"accessor.set"),o.init!==void 0&&i(o.init,"accessor.init")}else if(u!=="function"){var c;throw l===0?c="field":l===10?c="class":c="method",new TypeError(c+" decorators must return a function or void 0")}}function g(l,o,u,c,r,b,d,T,x){var m=u[0],s,f,n;d?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,c)),r===1?n={get:s.get,set:s.set}:r===2?n=s.value:r===3?n=s.get:r===4&&(n=s.set);var a,P,_;if(typeof m=="function")a=t(m,c,s,T,r,b,d,x,n),a!==void 0&&(h(r,a),r===0?f=a:r===1?(f=a.init,P=a.get||n.get,_=a.set||n.set,n={get:P,set:_}):n=a);else for(var D=m.length-1;D>=0;D--){var p=m[D];if(a=t(p,c,s,T,r,b,d,x,n),a!==void 0){h(r,a);var M;r===0?M=a:r===1?(M=a.init,P=a.get||n.get,_=a.set||n.set,n={get:P,set:_}):n=a,M!==void 0&&(f===void 0?f=M:typeof f=="function"?f=[f,M]:f.push(M))}}if(r===0||r===1){if(f===void 0)f=function(I,E){return E};else if(typeof f!="function"){var O=f;f=function(I,E){for(var N=E,L=0;L<O.length;L++)N=O[L].call(I,N);return N}}else{var z=f;f=function(I,E){return z.call(I,E)}}l.push(f)}r!==0&&(r===1?(s.get=n.get,s.set=n.set):r===2?s.value=n:r===3?s.get=n:r===4&&(s.set=n),d?r===1?(l.push(function(I,E){return n.get.call(I,E)}),l.push(function(I,E){return n.set.call(I,E)})):r===2?l.push(n):l.push(function(I,E){return n.call(I,E)}):Object.defineProperty(o,c,s))}function y(l,o,u){for(var c=[],r,b,d=new Map,T=new Map,x=0;x<o.length;x++){var m=o[x];if(Array.isArray(m)){var s=m[1],f=m[2],n=m.length>3,a=s>=5,P,_;if(a?(P=l,s=s-5,b=b||[],_=b):(P=l.prototype,r=r||[],_=r),s!==0&&!n){var D=a?T:d,p=D.get(f)||0;if(p===!0||p===3&&s!==4||p===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!p&&s>2?D.set(f,s):D.set(f,!0)}g(c,P,m,f,s,a,n,_,u)}}return w(c,r),w(c,b),c}function w(l,o){o&&l.push(function(u){for(var c=0;c<o.length;c++)o[c].call(u);return u})}function C(l,o,u){if(o.length>0){for(var c=[],r=l,b=l.name,d=o.length-1;d>=0;d--){var T={v:!1};try{var x=o[d](r,{kind:"class",name:b,addInitializer:v(c,T),metadata:u})}finally{T.v=!0}x!==void 0&&(h(10,x),r=x)}return[S(r,u),function(){for(var m=0;m<c.length;m++)c[m].call(r)}]}}function S(l,o){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,u,c,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var d=Object.create(b===void 0?null:b),T=y(o,u,d);return c.length||S(o,d),{e:T,get c(){return C(o,c,d)}}}}function wl(v,t,e,i){return(wl=Gu())(v,t,e,i)}var xl,hl,Tl,Dl,El,Cl,Pl,_l,Il,Ml,fl,ml,dl,pl,gl,vl,yl,Vr;xl=$({selector:"potatno-node",template:ul,style:cl,modules:[Re],components:[zr,It,lr]}),Tl=tt("node-drag"),Dl=V.state(),El=V.state(),Cl=B(),Pl=V.state({proxy:!0}),_l=V.state({complexValue:!0}),Il=V.state({complexValue:!0}),Ml=B();var bl=class{static{({e:[fl,ml,dl,pl,gl,vl,yl],c:[Vr,hl]}=wl(this,[[Tl,1,"mDrag"],[Dl,1,"mSelected"],[El,1,"isPreviewDisplaySelectionOpen"],[Cl,3,"nodeData"],[Pl,1,"nodeTransformation"],[_l,1,"previewPorts"],[Il,1,"previewDisplays"],[Ml,3,"selected"]],[xl]))}constructor(t=F.use(U),e=F.use(H)){this.mComponent=t,this.mManager=e,this.mNodeDefinition=null,this.mNodeData=null,this.mSelected=!1,this.isPreviewDisplaySelectionOpen=!1,this.nodeTransformation={height:0,width:0},this.previewPorts=new Array,this.previewDisplays=new Array,this.mUnsubscribeNodeChange=this.mManager.subscribe(R.Node,i=>{i.item===this.mNodeData&&this.resyncComponent(this.nodeData)}),this.mUnsubscribeValidation=this.mManager.subscribe(R.SpecialValidation,()=>{this.mComponent.updater.updateAsync()})}mComponent;mManager;mNodeData;mNodeDefinition;mUnsubscribeNodeChange;mUnsubscribeValidation;get canPreview(){return this.previewPorts.length>0}#t=(yl(this),fl(this));get mDrag(){return this.#t}set mDrag(t){this.#t=t}#e=ml(this);get mSelected(){return this.#e}set mSelected(t){this.#e=t}get hasError(){if(this.mManager.integrity.errorItems.has(this.nodeData))return!0;for(let t of this.nodeData.inputs.list)if(this.mManager.integrity.errorItems.has(t))return!0;for(let t of this.nodeData.outputs.list)if(this.mManager.integrity.errorItems.has(t))return!0;return!1}get inputPorts(){return this.nodeData.inputs.list}get isFunction(){return this.mNodeDefinition instanceof xt}get isPreviewActive(){return!!this.nodeData.preview}#r=dl(this);get isPreviewDisplaySelectionOpen(){return this.#r}set isPreviewDisplaySelectionOpen(t){this.#r=t}get nodeColor(){return this.mManager.generateStringColor(this.mNodeDefinition?.category.name??"")}get nodeData(){if(!this.mNodeData)throw new A("Node data not set.",this);return this.mNodeData}set nodeData(t){this.mNodeData=t,this.mNodeDefinition=null,this.mNodeData&&(this.mNodeDefinition=this.mManager.activeFunction.nodeDefinitions.find(e=>e.id===this.mNodeData.definitionId)??null,this.resyncComponent(t),this.mComponent.updater.update())}get nodeIcon(){return this.mNodeDefinition?.category.icon??""}get nodeLabel(){return this.nodeData.label??""}#o=pl(this);get nodeTransformation(){return this.#o}set nodeTransformation(t){this.#o=t}get outputPorts(){return this.nodeData.outputs.list}#n=gl(this);get previewPorts(){return this.#n}set previewPorts(t){this.#n=t}#i=vl(this);get previewDisplays(){return this.#i}set previewDisplays(t){this.#i=t}get previewDisplayId(){return this.nodeData.preview?.displayId??""}get previewDriver(){if(!this.nodeData.preview)return null;let t=this.nodeData.outputs.map.get(this.nodeData.preview.portDefinitionId);return t?this.mManager.preview.requestDriver(t,this.nodeData.preview.displayId):null}get previewPortDefinitionId(){return this.nodeData.preview?.portDefinitionId??""}get selected(){return this.mSelected}set selected(t){this.mSelected=this.parseBoolean(t)}dragNode(t){if(t.button===2&&this.mManager.graph.removeNode(this.nodeData),t.button!==0)return;let e=this.nodeData.transformation.x*this.mManager.grid.gridSize,i=this.nodeData.transformation.y*this.mManager.grid.gridSize,h=this.nodeData.transformation.x,g=this.nodeData.transformation.y,y=this.mComponent.element.getBoundingClientRect(),w=this.mComponent.element.offsetWidth?y.width/this.mComponent.element.offsetWidth:1,C=this.mComponent.element.offsetHeight?y.height/this.mComponent.element.offsetHeight:1,S=t.clientX,l=t.clientY,o=c=>{c.stopPropagation();let r=(c.clientX-S)/w,b=(c.clientY-l)/C,d=Math.round((e+r)/this.mManager.grid.gridSize),T=Math.round((i+b)/this.mManager.grid.gridSize);h===d&&g===T||(this.mManager.graph.transformNode(this.nodeData,x=>{x.moveTo(d,T)}),this.mDrag.dispatchEvent(new jr(d-h,T-g)),h=d,g=T)},u=()=>{document.removeEventListener("pointermove",o),document.removeEventListener("pointerup",u)};document.addEventListener("pointermove",o),document.addEventListener("pointerup",u)}onDeconstruct(){this.mUnsubscribeNodeChange(),this.mUnsubscribeValidation()}openFunction(){this.mNodeDefinition instanceof xt&&this.mManager.setActiveFunction(this.mNodeDefinition.function)}selectPreviewDisplay(t){this.mManager.graph.updateNode(this.nodeData,e=>{e.preview={portDefinitionId:e.preview.portDefinitionId,displayId:t}}),document.activeElement instanceof HTMLElement&&document.activeElement.blur()}selectPreviewPort(t){let e=(()=>{let i=this.previewPorts;return i.length===0?null:typeof t<"u"?i.find(h=>h.definitionId===t)??null:this.nodeData.preview?null:i[0]})();if(!e)return this.mManager.graph.updateNode(this.nodeData,i=>{i.preview=null});this.mManager.graph.updateNode(this.nodeData,i=>{let h=i.project.getFunction(i.function.definitionId),g=i.project.preview.availableDisplays(h,e.resolvedDataType);g.length===0&&(i.preview=null);let y=i.preview&&g.includes(i.preview.displayId)?i.preview.displayId:g[0];i.preview={portDefinitionId:e.definitionId,displayId:y}}),this.resyncComponent(this.nodeData)}getPreviewDisplays(t){if(!t)return new Array;let e=this.nodeData.outputs.map.get(t);if(!e)return new Array;let i=e.project.getFunction(e.node.function.definitionId);return i?e.project.preview.availableDisplays(i,e.resolvedDataType).map(g=>({id:g,label:e.project.preview.getDisplay(g)?.name??g})):new Array}getPreviewablePorts(t){let e=t.project.getFunction(t.function.definitionId);if(!this.mManager.activeFunction.dynamicNodeDefinitions.find(g=>g.id===t.definitionId))return new Array;let h=new Map;return t.outputs.value.filter(g=>{let y=g.resolvedDataType;if(h.has(y))return h.get(y);let w=t.project.preview.availableDisplays(e,g.resolvedDataType);return h.set(y,w.length>0),h.get(y)})}parseBoolean(t){if(typeof t=="string"){if(t==="")return!0;let e=t.toLowerCase();if(e==="true"||e==="false")return e==="true"}return!!t}resyncComponent(t){let e=t.transformation.x,i=t.transformation.y;this.mComponent.element.style.setProperty("left",`calc(var(--potatno-grid-size) * ${e})`),this.mComponent.element.style.setProperty("top",`calc(var(--potatno-grid-size) * ${i} - 8px)`),this.nodeTransformation.width=t.transformation.width,this.nodeTransformation.height=t.transformation.height,this.previewPorts=this.getPreviewablePorts(this.nodeData),this.previewDisplays=this.getPreviewDisplays(t.preview?.portDefinitionId??null)}static{hl()}},jr=class{mX;mY;get x(){return this.mX}get y(){return this.mY}constructor(t,e){this.mX=t,this.mY=e}};var Sl=`:host {\r
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
}`;var Al=`<!-- Serves only as a background. -->\r
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
`;function Xu(){function v(l,o){return function(c){e(o,"addInitializer"),i(c,"An initializer"),l.push(c)}}function t(l,o,u,c,r,b,d,T,x){var m;switch(r){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var s={kind:m,name:d?"#"+o:o,static:b,private:d,metadata:T},f={v:!1};s.addInitializer=v(c,f);var n,a;if(r===0?d?(n=u.get,a=u.set):(n=function(){return this[o]},a=function(p){this[o]=p}):r===2?n=function(){return u.value}:((r===1||r===3)&&(n=function(){return u.get.call(this)}),(r===1||r===4)&&(a=function(p){u.set.call(this,p)})),d)s.access=n&&a?{get:n,set:a}:n?{get:n}:{set:a};else{if(n){var P=n;n=function(p){return arguments.length===0&&(p=this),P.call(p)}}if(a){var _=a;a=function(p,M){return arguments.length===1&&(M=p,p=this),_.call(p,M)}}var D=function(p){return o in p};s.access=n&&a?{has:D,get:n,set:a}:n?{has:D,get:n}:{has:D,set:a}}try{return l(x,s)}finally{f.v=!0}}function e(l,o){if(l.v)throw new Error("attempted to call "+o+" after decoration was finished")}function i(l,o){if(typeof l!="function")throw new TypeError(o+" must be a function")}function h(l,o){var u=typeof o;if(l===1){if(u!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&i(o.get,"accessor.get"),o.set!==void 0&&i(o.set,"accessor.set"),o.init!==void 0&&i(o.init,"accessor.init")}else if(u!=="function"){var c;throw l===0?c="field":l===10?c="class":c="method",new TypeError(c+" decorators must return a function or void 0")}}function g(l,o,u,c,r,b,d,T,x){var m=u[0],s,f,n;d?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,c)),r===1?n={get:s.get,set:s.set}:r===2?n=s.value:r===3?n=s.get:r===4&&(n=s.set);var a,P,_;if(typeof m=="function")a=t(m,c,s,T,r,b,d,x,n),a!==void 0&&(h(r,a),r===0?f=a:r===1?(f=a.init,P=a.get||n.get,_=a.set||n.set,n={get:P,set:_}):n=a);else for(var D=m.length-1;D>=0;D--){var p=m[D];if(a=t(p,c,s,T,r,b,d,x,n),a!==void 0){h(r,a);var M;r===0?M=a:r===1?(M=a.init,P=a.get||n.get,_=a.set||n.set,n={get:P,set:_}):n=a,M!==void 0&&(f===void 0?f=M:typeof f=="function"?f=[f,M]:f.push(M))}}if(r===0||r===1){if(f===void 0)f=function(I,E){return E};else if(typeof f!="function"){var O=f;f=function(I,E){for(var N=E,L=0;L<O.length;L++)N=O[L].call(I,N);return N}}else{var z=f;f=function(I,E){return z.call(I,E)}}l.push(f)}r!==0&&(r===1?(s.get=n.get,s.set=n.set):r===2?s.value=n:r===3?s.get=n:r===4&&(s.set=n),d?r===1?(l.push(function(I,E){return n.get.call(I,E)}),l.push(function(I,E){return n.set.call(I,E)})):r===2?l.push(n):l.push(function(I,E){return n.call(I,E)}):Object.defineProperty(o,c,s))}function y(l,o,u){for(var c=[],r,b,d=new Map,T=new Map,x=0;x<o.length;x++){var m=o[x];if(Array.isArray(m)){var s=m[1],f=m[2],n=m.length>3,a=s>=5,P,_;if(a?(P=l,s=s-5,b=b||[],_=b):(P=l.prototype,r=r||[],_=r),s!==0&&!n){var D=a?T:d,p=D.get(f)||0;if(p===!0||p===3&&s!==4||p===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!p&&s>2?D.set(f,s):D.set(f,!0)}g(c,P,m,f,s,a,n,_,u)}}return w(c,r),w(c,b),c}function w(l,o){o&&l.push(function(u){for(var c=0;c<o.length;c++)o[c].call(u);return u})}function C(l,o,u){if(o.length>0){for(var c=[],r=l,b=l.name,d=o.length-1;d>=0;d--){var T={v:!1};try{var x=o[d](r,{kind:"class",name:b,addInitializer:v(c,T),metadata:u})}finally{T.v=!0}x!==void 0&&(h(10,x),r=x)}return[S(r,u),function(){for(var m=0;m<c.length;m++)c[m].call(r)}]}}function S(l,o){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,u,c,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var d=Object.create(b===void 0?null:b),T=y(o,u,d);return c.length||S(o,d),{e:T,get c(){return C(o,c,d)}}}}function Fl(v,t,e,i){return(Fl=Xu())(v,t,e,i)}function Yu(v){return v}var zl,Nl,jl,Vl,Ll,Rl,Ol,cr;zl=$({selector:"potatno-node-graph",template:Al,style:Sl,components:[ue,Vr,Lr,Or,Fr]}),jl=V.state(),Vl=V.state({complexValue:!0});new class extends Yu{constructor(){super(cr),Nl()}static{class v{static{({e:[Ll,Rl,Ol],c:[cr,Nl]}=Fl(this,[[jl,1,"popup"],[Vl,1,"selectBox"]],[zl]))}static ZOOM_STRENGTH=.1;mComponent;mIsMouseInsideGrid;mKeyboardHandler;mManager;mUnsubscribeFunctionChange;mUnsubscribeGraphChange;#t=(Ol(this),Ll(this));get popup(){return this.#t}set popup(e){this.#t=e}#e=Rl(this);get selectBox(){return this.#e}set selectBox(e){this.#e=e}get gridBackgroundStyle(){let e=this.mManager.grid.gridSize*this.mManager.grid.zoom,i=this.mManager.grid.panX,h=this.mManager.grid.panY;return`--grid-size: ${e}px; --grid-position-x: ${i}px; --grid-position-y: ${h}px;`}get gridTransformStyle(){return`transform: translate(${this.mManager.grid.panX}px, ${this.mManager.grid.panY}px) scale(${this.mManager.grid.zoom})`}get nodes(){return this.mManager.activeFunction.nodes}get selectedNodes(){return this.mManager.grid.selectedNodes}constructor(e=F.use(U),i=F.use(H)){this.mComponent=e,this.mManager=i,this.mIsMouseInsideGrid=!1,this.popup=null,this.selectBox=null,this.mManager.grid.gridElement=this.mComponent.element,e.element.addEventListener("pointerdown",h=>{this.onPointerDown(h)}),e.element.addEventListener("wheel",h=>{this.onScroll(h)}),e.element.addEventListener("contextmenu",h=>{h.preventDefault()}),e.element.addEventListener("pointerenter",()=>{this.mIsMouseInsideGrid=!0}),e.element.addEventListener("pointerleave",()=>{this.mIsMouseInsideGrid=!1}),e.element.addEventListener("dragover",h=>{this.mManager.grid.draggedPort.isDragging&&(h.preventDefault(),h.stopPropagation(),h.dataTransfer&&(h.dataTransfer.dropEffect="link"))}),e.element.addEventListener("drop",h=>{this.createDroppedConjunction(h)}),this.mKeyboardHandler=h=>{this.onKeyDown(h)},document.addEventListener("keydown",this.mKeyboardHandler),this.mComponent.element.style.setProperty("--potatno-grid-size",`${this.mManager.grid.gridSize}px`),this.mUnsubscribeFunctionChange=this.mManager.subscribe(R.Document|R.Function|R.SpecialActiveFunction,()=>{this.popup=null,this.selectBox=null}),this.mUnsubscribeGraphChange=this.mManager.subscribe(R.NodeAdd|R.NodeDelete|R.SpecialGrid|R.SpecialSelectNode,()=>{this.mComponent.updater.updateAsync()})}createNode(e){let i=this.mManager.graph.addNode(this.mManager.activeFunction,e.definition,{x:this.popup?.position.grid.x??0,y:this.popup?.position.grid.y??0,height:0,width:0});if(e.port){let h=i.inputs.map.get(e.port.target.id)??i.outputs.map.get(e.port.target.id);h&&this.mManager.graph.connectPorts(h,e.port.source)}this.popup=null,this.selectNodes([i],!1)}moveAllSelected(e,i){for(let h of this.mManager.grid.selectedNodes)h!==e&&this.mManager.graph.transformNode(h,g=>{g.moveTo(g.transformation.x+i.x,g.transformation.y+i.y)})}onDeconstruct(){this.mUnsubscribeFunctionChange(),this.mUnsubscribeGraphChange(),document.removeEventListener("keydown",this.mKeyboardHandler)}selectNodes(e,i){let h=!!i;i instanceof PointerEvent&&(i.stopPropagation(),h=i.ctrlKey);let g=new Set,y=new Set(this.mManager.grid.selectedNodes);if(!h)if(e.length===1&&y.has(e.at(0)))for(let C of y)g.add(C);else y.clear();let w=[...e];for(let C of w)g.has(C)||(g.add(C),C.definitionId===Tt.DEFINITION_ID&&w.push(...this.getNodesInRectangle({top:C.transformation.y,right:C.transformation.x+C.transformation.width,bottom:C.transformation.y+C.transformation.height,left:C.transformation.x})),y.has(C)?y.delete(C):y.add(C));this.mManager.grid.selectNodes([...y])}typeOfNode(e){switch(e.definitionId){case Tt.DEFINITION_ID:return"comment";case rt.DEFINITION_ID:case Q.DEFINITION_ID:return"conjunction";default:return"node"}}convertGlobalToGridLocalPosition(e,i){let h=this.mComponent.element.getBoundingClientRect();return{x:e-h.left,y:i-h.top}}createDroppedConjunction(e){if(!this.mManager.grid.draggedPort.isDragging)return;e.preventDefault(),e.stopPropagation();let i=this.mManager.grid.pixelToGridSpace(e.clientX,e.clientY),h=this.mManager.graph.priorizePorts(i,this.mManager.grid.draggedPort.ports);this.openPopupAtPosition(e.clientX,e.clientY,h[0])}getNodesInRectangle(e){let i=new Array;for(let h of this.mManager.activeFunction.nodes){let g=h.transformation.y,y=h.transformation.x,w=y+h.transformation.width,C=g+h.transformation.height;if(y<e.right&&w>e.left&&g<e.bottom&&C>e.top){if(e.top>g&&e.right<w&&e.bottom<C&&e.left>y)continue;i.push(h)}}return i}onKeyDown(e){if(!this.mIsMouseInsideGrid)return;let i=document.activeElement;if(!(i instanceof HTMLInputElement||i instanceof HTMLTextAreaElement||i instanceof HTMLSelectElement)){switch(e.key){case"Escape":{this.popup=null;return}case"Delete":{for(let h of this.mManager.grid.selectedNodes)this.mManager.graph.removeNode(h);this.selectNodes([],!1);return}}if(e.ctrlKey)switch(e.key){case"z":{e.preventDefault(),this.mManager.history.undo();return}case"y":{e.preventDefault(),this.mManager.history.redo();return}case"c":{this.mManager.clipboard.copy(this.mManager.grid.selectedNodes);return}case"v":e.preventDefault(),this.pasteFromClipboard()}}}onPointerDown(e){switch(e.button){case 0:{e.ctrlKey||this.selectNodes([],!1),this.pointerDrag(e,"selecting");return}case 1:{e.preventDefault(),this.pointerDrag(e,"panning");return}case 2:{this.openPopupAtPosition(e.clientX,e.clientY,null);return}}}onScroll(e){e.preventDefault();let i=e.deltaY>0?-1:1,h=this.convertGlobalToGridLocalPosition(e.clientX,e.clientY);this.mManager.grid.zoomAt(h.x,h.y,i*v.ZOOM_STRENGTH)}openPopupAtPosition(e,i,h){let g=this.mComponent.element,y=this.convertGlobalToGridLocalPosition(e,i),w=this.mManager.grid.pixelToGridSpace(e,i),C=8,S=Math.max(0,g.clientWidth-ue.POPUP_WIDTH-C),l=Math.max(0,g.clientHeight-ue.POPUP_HEIGHT-C);this.popup={position:{local:{x:Math.max(C,Math.min(y.x,S)),y:Math.max(C,Math.min(y.y,l))},grid:w},context:{port:h}}}pasteFromClipboard(){let e=this.mManager.clipboard.paste();e.length!==0&&this.selectNodes(e,!1)}pointerDrag(e,i){let h=this.mManager.grid.pixelToGridPixelSpace(e.clientX,e.clientY),g={x:e.clientX,y:e.clientY},y=C=>{switch(i){case"panning":{this.mManager.grid.pan(C.clientX-g.x,C.clientY-g.y),g.x=C.clientX,g.y=C.clientY;break}case"selecting":{let S=this.mManager.grid.pixelToGridPixelSpace(C.clientX,C.clientY);this.selectBox={x:Math.min(h.x,S.x),y:Math.min(h.y,S.y),width:Math.abs(S.x-h.x),height:Math.abs(S.y-h.y)};break}}},w=C=>{if(document.removeEventListener("pointermove",y),document.removeEventListener("pointerup",w),i==="selecting"&&this.selectBox){let S=this.mManager.grid.gridPixelSpaceToGridSpace({x:this.selectBox.x,y:this.selectBox.y},!1),l=this.mManager.grid.gridPixelSpaceToGridSpace({x:this.selectBox.x+this.selectBox.width,y:this.selectBox.y+this.selectBox.height},!1),o=this.getNodesInRectangle({top:S.y,right:l.x,bottom:l.y,left:S.x});this.selectNodes(o,C.ctrlKey),this.selectBox=null}};document.addEventListener("pointermove",y),document.addEventListener("pointerup",w)}}}};var ur=class{mDependencies;mDocument;mEntryPoint;get code(){return this.mDocument.project.generator.code(this)}get dependencies(){return this.mDependencies}get entryPoint(){return this.mEntryPoint}constructor(t,e,i){this.mDocument=t,this.mEntryPoint=e,this.mDependencies=i}};var hr=class{mFunction;mGraphs;get code(){let t=this.mFunction.project.getFunction(this.mFunction.definitionId);if(!t)throw new A("Function result has an invalid function definition id.",this);return t.codeGenerator.body(this)}get function(){return this.mFunction}get graphs(){return Array.from(this.mGraphs.values())}constructor(t){this.mFunction=t,this.mGraphs=new Map}addGraph(t){this.mGraphs.set(t.entryNode.definitionId,t)}graphResultOf(t){return this.mGraphs.get(t)}};var fr=class{mBodyCode;mDependencies;mEntryNode;mExitNode;mNodeIds;mPorts;get code(){return this.mBodyCode}get dependencies(){return this.mDependencies}get entryNode(){return this.mEntryNode}get exitNode(){return this.mExitNode}get nodes(){return this.mNodeIds}get ports(){return this.mPorts}constructor(t){this.mBodyCode=t.bodyCode,this.mDependencies=[...t.dependencies],this.mEntryNode=t.entryNode,this.mExitNode=t.exitNode,this.mNodeIds=t.nodeIds,this.mPorts=t.portValues}};var he=class{mProject;constructor(t){this.mProject=t}generateDocument(t,e=!1){let i=[...t.functions].find(h=>h.isSystem);if(!i)throw new A("No entry point function found for code generation.",this);return this.generateFunction(i,e)}generateFunction(t,e=!1){return this.buildDocumentResult(t.document,t.getExitNodes(),e)}generateNode(t,e=!1){return this.buildDocumentResult(t.document,[t],e)}buildDocumentResult(t,e,i){if(t.validate().errors.length>0)throw new A("Code generation exited. Code graph validation failed.",this);let g={counter:{nodeIndex:0,portIndex:0},debug:i,nodeDefinitions:new Map},y=this.generateFunctionWithDependencies(g,e,new Set),w=y.pop();return new ur(t,w,y)}countNodeEncounter(t,e){let i=new Map,h=new Set,g=new Array(t);for(;g.length>0;){let y=g.pop();if(i.set(y,(i.get(y)??0)+1),!(y===e||h.has(y))){h.add(y);for(let w of y.inputs.flow)for(let C of this.resolveFlowConjunctions(w))g.push(C.node);for(let w of y.inputs.value){let C=this.resolveValueConjunctions(w);C&&g.push(C.node)}}}return i}createScope(t,e){return{emittedNodes:new Set,remaining:this.countNodeEncounter(t,e)}}emitNode(t,e,i,h,g){if(!t.nodeDefinitions.get(i.function)){let c=new Map;for(let r of i.function.nodeDefinitions)c.set(r.id,r);t.nodeDefinitions.set(i.function,c)}let y=t.nodeDefinitions.get(i.function).get(i.definitionId);if(!y)throw new A(`Node definition "${i.definitionId}" not found for node "${i.label}".`,this);y instanceof xt&&e.dependencies.push(y.function);let w={},C=new Array;for(let c of i.inputs.value){let r=this.resolveInputValue(t,e,c);w[c.definitionId]=r.inputPort,e.ports.set(c,r.inputPort.value),r.emitResult&&C.push(r.emitResult)}let S={};for(let c of i.outputs.list)S[c.definitionId]={value:this.generatePortValue(t,e,c),code:{inner:h[c.definitionId]??""}};let l=y.codeGenerator({inputs:w,outputs:S,code:{next:g??""}}),o=this.getGeneratedNodeId(t,e,i);t.debug&&(l=this.mProject.generator.value.hook(`start-${o}`)+l+this.mProject.generator.value.hook(`end-${o}`));let u=new Array;for(let c of C)u.push(...c.codeOutput);return u.push(l),{codeOutput:u,lastGeneratedNode:i,endFlowPort:null}}findBranchStartPoint(t){let e=this.getNodesInputFlowPorts(t),i=e.length,h=new Map,g=new Array,y=(w,C)=>{let S=(h.has(w)||h.set(w,new Set),h.get(w)),l=S.size;for(let o of C)S.add(o);return S.size>l&&g.push(w),S};for(let[w,C]of e.entries())y(C.node,[w]);for(;g.length>0;){let w=g.shift(),C=h.get(w);for(let S of this.getNodesInputFlowPorts(w))if(y(S.node,C).size===i)return S.node}throw new A("No common branch point found for merge node.",this)}generateFunctionWithDependencies(t,e,i){let h=new Array;if(e.length===0)return h;let g=e.at(0).function;i.add(g);let y=new hr(g);h.push(y);for(let w of e){let C=this.generateNodeCode(t,w);y.addGraph(C);for(let S of C.dependencies)i.has(S)||h.push(...this.generateFunctionWithDependencies(t,S.getExitNodes(),i))}return h.reverse()}generateNodeCode(t,e){let i={dependencies:new Array,nodes:new Map,ports:new Map,scope:this.createScope(e,null)},h=this.walkBackward(t,i,e,null),g=h.codeOutput.join(" ");return new fr({bodyCode:g,dependencies:i.dependencies,entryNode:h.lastGeneratedNode,exitNode:e,nodeIds:new Map(i.nodes),portValues:new Map(i.ports)})}generatePortValue(t,e,i){if(!e.ports.has(i)){let h=this.mProject.generator.value.name(i.label),g=this.mProject.generator.value.id(h,t.counter.portIndex++);e.ports.set(i,g)}return e.ports.get(i)}getGeneratedNodeId(t,e,i){if(!e.nodes.has(i)){let g=(++t.counter.nodeIndex).toString(16).toUpperCase().padStart(8,"0");e.nodes.set(i,g)}return e.nodes.get(i)}getNodesInputFlowPorts(t){let e=new Array;for(let i of t.inputs.flow)e.push(...this.resolveFlowConjunctions(i));return[...new Set(e)]}handleFlowMerge(t,e,i,h,g){let y=g.join(" "),w=this.findBranchStartPoint(i),C={},S=e.scope;try{for(let l of h){e.scope=this.createScope(l.node,w);let o=this.walkBackward(t,e,l.node,w);C[o.endFlowPort.definitionId]=o.codeOutput.join(" ")}}finally{e.scope=S}return this.emitNode(t,e,w,C,y)}resolveFlowConjunctions(t){let e=new Array;for(let i of t.connectedPorts){if(i.node.definitionId!==Q.DEFINITION_ID){e.push(i);continue}let h=i.node.inputs.flow[0];!h||h.connectedPorts.size===0||e.push(...this.resolveFlowConjunctions(h))}return e}resolveInputValue(t,e,i){let h=this.resolveValueConjunctions(i);if(!h){if(this.mProject.types.isGenericType(i.dataType))throw new A("Generic value inputs must be allways connected",this);return{inputPort:{value:this.mProject.types.getType(i.dataType).convert([...i.directValue]),isDirectValue:!0},emitResult:null}}let g=h.node,y=!g.hasFlowPorts,w=(()=>{if(!g.hasFlowPorts){if(e.scope.emittedNodes.has(g))return null;let C=e.scope.remaining.get(g);if(y&&(C=0),e.scope.remaining.set(g,C),C<=0)return e.scope.emittedNodes.add(g),this.emitNode(t,e,g,{})}return null})();return{inputPort:{value:this.generatePortValue(t,e,h),isDirectValue:!1},emitResult:w}}resolveValueConjunctions(t){if(t.connectedPorts.size===0)return null;let e=t.connectedPorts.values().next().value;if(e.node.definitionId!==rt.DEFINITION_ID)return e;let i=e.node.inputs.value[0];return!i||i.connectedPorts.size===0?null:this.resolveValueConjunctions(i)}walkBackward(t,e,i,h){let g={codeOutput:new Array,lastGeneratedNode:null,endFlowPort:null},y=null,w=i;for(;w!==null&&w!==h;){let C={};y!==null&&(C[y.definitionId]=g.codeOutput.join(" "),g.codeOutput=new Array);let S=g.codeOutput;g=this.emitNode(t,e,w,C),g.codeOutput=[...g.codeOutput,...S];let l=this.getNodesInputFlowPorts(w);if(l.length===0)break;l.length>1&&(g=this.handleFlowMerge(t,e,w,l,g.codeOutput),l=this.getNodesInputFlowPorts(g.lastGeneratedNode)),y=l[0]??null,w=y?.node??null}if(!g.lastGeneratedNode)throw new A(`Walk did not reach an entry node from exit "${i.label}".`,this);if(h&&w!==h)throw new A("Malformed graph. End node not reached",this);return g.endFlowPort=y,g}};var ht=class{static MAIN="MAIN";mBuild;mDefaultParameters;mFunction;mTypes;get defaultParameters(){return this.mDefaultParameters}get function(){return this.mFunction}get types(){return this.mTypes}constructor(t,e){this.mFunction=t,this.mDefaultParameters=e.defaultParameters,this.mTypes=new Set(e.types),this.mBuild=e.build}compile(t,e){return this.mBuild({defaultParameters:this.mDefaultParameters,function:this.mFunction,projectTypes:t.entryPoint.function.project.types},t,e)}};var Bl=`:host {\r
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
        color: var(--potatno-color-text);\r
\r
        .tab {\r
            /* Selectable secondary button drives the gradient, hover, active and selected states. */\r
            --button-accent-color: var(--potatno-color-accent);\r
            --button-text-color: var(--potatno-color-text);\r
\r
            /* Adjust font size a little smaller as anything is uppercase*/\r
            font-size: var(--potatno-font-size-small);\r
            text-transform: uppercase;\r
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
    /* Theme the shared list item with the error color. */\r
    color: var(--potatno-color-text);\r
    --list-item-bar-default-color: var(--potatno-color-error);\r
    --list-item-icon-color: var(--potatno-color-error);\r
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
}`;var $l=`<kg-resize-box class="resize-box" left top bottom="false">\r
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
                <kg-list-item class="error-item" icon="!">\r
                    <div class="error-item__content">\r
                        <div class="error-item__message">{{this.error.message}}</div>\r
                        <div class="error-item__location">\r
                            <span class="label">{{this.getDocumentItemTypeName(this.error.location)}}: </span>\r
                            <span class="link" (click)="this.openDocumentItem(this.error.location)">{{this.getDocumentItemLabel(this.error.location)}}</span>\r
                        </div>\r
                    </div>\r
                </kg-list-item>\r
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
`;function qu(){function v(l,o){return function(c){e(o,"addInitializer"),i(c,"An initializer"),l.push(c)}}function t(l,o,u,c,r,b,d,T,x){var m;switch(r){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var s={kind:m,name:d?"#"+o:o,static:b,private:d,metadata:T},f={v:!1};s.addInitializer=v(c,f);var n,a;if(r===0?d?(n=u.get,a=u.set):(n=function(){return this[o]},a=function(p){this[o]=p}):r===2?n=function(){return u.value}:((r===1||r===3)&&(n=function(){return u.get.call(this)}),(r===1||r===4)&&(a=function(p){u.set.call(this,p)})),d)s.access=n&&a?{get:n,set:a}:n?{get:n}:{set:a};else{if(n){var P=n;n=function(p){return arguments.length===0&&(p=this),P.call(p)}}if(a){var _=a;a=function(p,M){return arguments.length===1&&(M=p,p=this),_.call(p,M)}}var D=function(p){return o in p};s.access=n&&a?{has:D,get:n,set:a}:n?{has:D,get:n}:{has:D,set:a}}try{return l(x,s)}finally{f.v=!0}}function e(l,o){if(l.v)throw new Error("attempted to call "+o+" after decoration was finished")}function i(l,o){if(typeof l!="function")throw new TypeError(o+" must be a function")}function h(l,o){var u=typeof o;if(l===1){if(u!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&i(o.get,"accessor.get"),o.set!==void 0&&i(o.set,"accessor.set"),o.init!==void 0&&i(o.init,"accessor.init")}else if(u!=="function"){var c;throw l===0?c="field":l===10?c="class":c="method",new TypeError(c+" decorators must return a function or void 0")}}function g(l,o,u,c,r,b,d,T,x){var m=u[0],s,f,n;d?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,c)),r===1?n={get:s.get,set:s.set}:r===2?n=s.value:r===3?n=s.get:r===4&&(n=s.set);var a,P,_;if(typeof m=="function")a=t(m,c,s,T,r,b,d,x,n),a!==void 0&&(h(r,a),r===0?f=a:r===1?(f=a.init,P=a.get||n.get,_=a.set||n.set,n={get:P,set:_}):n=a);else for(var D=m.length-1;D>=0;D--){var p=m[D];if(a=t(p,c,s,T,r,b,d,x,n),a!==void 0){h(r,a);var M;r===0?M=a:r===1?(M=a.init,P=a.get||n.get,_=a.set||n.set,n={get:P,set:_}):n=a,M!==void 0&&(f===void 0?f=M:typeof f=="function"?f=[f,M]:f.push(M))}}if(r===0||r===1){if(f===void 0)f=function(I,E){return E};else if(typeof f!="function"){var O=f;f=function(I,E){for(var N=E,L=0;L<O.length;L++)N=O[L].call(I,N);return N}}else{var z=f;f=function(I,E){return z.call(I,E)}}l.push(f)}r!==0&&(r===1?(s.get=n.get,s.set=n.set):r===2?s.value=n:r===3?s.get=n:r===4&&(s.set=n),d?r===1?(l.push(function(I,E){return n.get.call(I,E)}),l.push(function(I,E){return n.set.call(I,E)})):r===2?l.push(n):l.push(function(I,E){return n.call(I,E)}):Object.defineProperty(o,c,s))}function y(l,o,u){for(var c=[],r,b,d=new Map,T=new Map,x=0;x<o.length;x++){var m=o[x];if(Array.isArray(m)){var s=m[1],f=m[2],n=m.length>3,a=s>=5,P,_;if(a?(P=l,s=s-5,b=b||[],_=b):(P=l.prototype,r=r||[],_=r),s!==0&&!n){var D=a?T:d,p=D.get(f)||0;if(p===!0||p===3&&s!==4||p===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!p&&s>2?D.set(f,s):D.set(f,!0)}g(c,P,m,f,s,a,n,_,u)}}return w(c,r),w(c,b),c}function w(l,o){o&&l.push(function(u){for(var c=0;c<o.length;c++)o[c].call(u);return u})}function C(l,o,u){if(o.length>0){for(var c=[],r=l,b=l.name,d=o.length-1;d>=0;d--){var T={v:!1};try{var x=o[d](r,{kind:"class",name:b,addInitializer:v(c,T),metadata:u})}finally{T.v=!0}x!==void 0&&(h(10,x),r=x)}return[S(r,u),function(){for(var m=0;m<c.length;m++)c[m].call(r)}]}}function S(l,o){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,u,c,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var d=Object.create(b===void 0?null:b),T=y(o,u,d);return c.length||S(o,d),{e:T,get c(){return C(o,c,d)}}}}function ql(v,t,e,i){return(ql=qu())(v,t,e,i)}var Jl,Gl,Kl,Ql,kl,tc,Ul,Hl,Xl,Yl,Wl,Br;Jl=$({selector:"potatno-preview",template:$l,style:Bl,modules:[Re],components:[Wt,It,Yt]}),Kl=V.state(),Ql=V.state(),kl=V.state(),tc=V.state();var Zl=class{static{({e:[Ul,Hl,Xl,Yl,Wl],c:[Br,Gl]}=ql(this,[[Kl,1,"mSelectedDisplayId"],[Ql,1,"mSelectedOutputId"],[kl,1,"selectedTab"],[tc,1,"previewCode"]],[Jl]))}constructor(t=F.use(U),e=F.use(H)){this.mComponent=t,this.mManager=e,this.mSelectedDisplayId="",this.mSelectedOutputId="",this.selectedTab="preview",this.previewCode="";let i=R.NodeUpdate|R.NodeAdd|R.NodeDelete;this.mPreviewTargets=this.findFunctionPreviewTargets(),this.mUnsubscribeOutputFetch=this.mManager.subscribe(R.SpecialActiveFunction|i,()=>{this.mPreviewTargets=this.findFunctionPreviewTargets()}),this.mUnsubscribeErrorResolve=this.mManager.subscribe(R.SpecialActiveFunction|i|R.Connection,()=>{this.mComponent.updater.updateAsync()});let h=0;this.mManager.subscribe(R.Any,()=>{globalThis.clearTimeout(h),h=globalThis.setTimeout(()=>{this.previewCode=this.generateFunctionCode()},1e3)})}mComponent;mManager;mPreviewTargets;mUnsubscribeErrorResolve;mUnsubscribeOutputFetch;#t=(Wl(this),Ul(this));get mSelectedDisplayId(){return this.#t}set mSelectedDisplayId(t){this.#t=t}#e=Hl(this);get mSelectedOutputId(){return this.#e}set mSelectedOutputId(t){this.#e=t}#r=Xl(this);get selectedTab(){return this.#r}set selectedTab(t){this.#r=t}#o=Yl(this);get previewCode(){return this.#o}set previewCode(t){this.#o=t}get displayOptions(){let t=this.mPreviewTargets.get(this.selectedOutputId);return t?t.displays:new Map}get errors(){return this.mManager.integrity.errors}get outputOptions(){return this.mPreviewTargets}get previewDriver(){let t=this.mPreviewTargets.get(this.selectedOutputId);return t?this.mManager.preview.requestDriver(t.target,this.selectedDisplayId):null}get selectedDisplayId(){let t=this.displayOptions;if(!t.has(this.mSelectedDisplayId)){let e=t.keys().next().value;typeof e<"u"&&(this.mSelectedDisplayId=e)}return this.mSelectedDisplayId}set selectedDisplayId(t){this.mSelectedDisplayId=t}get selectedOutputId(){let t=this.outputOptions;if(!t.has(this.mSelectedOutputId)){let e=t.keys().next().value;typeof e<"u"&&(this.mSelectedOutputId=e)}return this.mSelectedOutputId}set selectedOutputId(t){this.mSelectedOutputId=t}getDocumentItemLabel(t){switch(!0){case t instanceof pt:return t.label;case t instanceof it:return t.label;case t instanceof lt:return t.label}return"Item"}getDocumentItemTypeName(t){switch(!0){case t instanceof pt:return"Node";case t instanceof it:return"Port";case t instanceof lt:return"Function"}return"Item"}onDeconstruct(){this.mUnsubscribeErrorResolve(),this.mUnsubscribeOutputFetch()}openDocumentItem(t){switch(!0){case t instanceof pt:{this.mManager.grid.selectNodes([t],!0);break}case t instanceof it:{this.mManager.grid.selectNodes([t.node],!0);break}case t instanceof lt:{this.mManager.setActiveFunction(t);break}}}findFunctionPreviewTargets(){let t=new Map,e=this.mManager.activeFunction,i=e.project.getFunction(e.definitionId);if(!i)return t;let h=w=>{let C=new Map;for(let S of w)C.set(S,e.project.preview.getDisplay(S).name);return C},g=e.project.preview.availableDisplays(i,ht.MAIN);g.length>0&&t.set(ht.MAIN,{label:ht.MAIN,target:e,displays:h(g)});let y=new Map;for(let w of e.getExitNodes())for(let C of w.inputs.value){let S=C.resolvedDataType;y.has(S)||y.set(S,C.project.preview.availableDisplays(i,S));let l=y.get(S);l.length!==0&&t.set(C.definitionId,{label:C.label,target:C,displays:h(l)})}return t}generateFunctionCode(){if(!this.mManager.integrity.isValid)return"";let t=this.mManager.activeFunction;return new he(t.project).generateFunction(t,!1).code}static{Gl()}};var ec=`:host {\r
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
}`;var rc=`<div class="editor">\r
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
</div>`;function Qu(){function v(l,o){return function(c){e(o,"addInitializer"),i(c,"An initializer"),l.push(c)}}function t(l,o,u,c,r,b,d,T,x){var m;switch(r){case 1:m="accessor";break;case 2:m="method";break;case 3:m="getter";break;case 4:m="setter";break;default:m="field"}var s={kind:m,name:d?"#"+o:o,static:b,private:d,metadata:T},f={v:!1};s.addInitializer=v(c,f);var n,a;if(r===0?d?(n=u.get,a=u.set):(n=function(){return this[o]},a=function(p){this[o]=p}):r===2?n=function(){return u.value}:((r===1||r===3)&&(n=function(){return u.get.call(this)}),(r===1||r===4)&&(a=function(p){u.set.call(this,p)})),d)s.access=n&&a?{get:n,set:a}:n?{get:n}:{set:a};else{if(n){var P=n;n=function(p){return arguments.length===0&&(p=this),P.call(p)}}if(a){var _=a;a=function(p,M){return arguments.length===1&&(M=p,p=this),_.call(p,M)}}var D=function(p){return o in p};s.access=n&&a?{has:D,get:n,set:a}:n?{has:D,get:n}:{has:D,set:a}}try{return l(x,s)}finally{f.v=!0}}function e(l,o){if(l.v)throw new Error("attempted to call "+o+" after decoration was finished")}function i(l,o){if(typeof l!="function")throw new TypeError(o+" must be a function")}function h(l,o){var u=typeof o;if(l===1){if(u!=="object"||o===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");o.get!==void 0&&i(o.get,"accessor.get"),o.set!==void 0&&i(o.set,"accessor.set"),o.init!==void 0&&i(o.init,"accessor.init")}else if(u!=="function"){var c;throw l===0?c="field":l===10?c="class":c="method",new TypeError(c+" decorators must return a function or void 0")}}function g(l,o,u,c,r,b,d,T,x){var m=u[0],s,f,n;d?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(o,c)),r===1?n={get:s.get,set:s.set}:r===2?n=s.value:r===3?n=s.get:r===4&&(n=s.set);var a,P,_;if(typeof m=="function")a=t(m,c,s,T,r,b,d,x,n),a!==void 0&&(h(r,a),r===0?f=a:r===1?(f=a.init,P=a.get||n.get,_=a.set||n.set,n={get:P,set:_}):n=a);else for(var D=m.length-1;D>=0;D--){var p=m[D];if(a=t(p,c,s,T,r,b,d,x,n),a!==void 0){h(r,a);var M;r===0?M=a:r===1?(M=a.init,P=a.get||n.get,_=a.set||n.set,n={get:P,set:_}):n=a,M!==void 0&&(f===void 0?f=M:typeof f=="function"?f=[f,M]:f.push(M))}}if(r===0||r===1){if(f===void 0)f=function(I,E){return E};else if(typeof f!="function"){var O=f;f=function(I,E){for(var N=E,L=0;L<O.length;L++)N=O[L].call(I,N);return N}}else{var z=f;f=function(I,E){return z.call(I,E)}}l.push(f)}r!==0&&(r===1?(s.get=n.get,s.set=n.set):r===2?s.value=n:r===3?s.get=n:r===4&&(s.set=n),d?r===1?(l.push(function(I,E){return n.get.call(I,E)}),l.push(function(I,E){return n.set.call(I,E)})):r===2?l.push(n):l.push(function(I,E){return n.call(I,E)}):Object.defineProperty(o,c,s))}function y(l,o,u){for(var c=[],r,b,d=new Map,T=new Map,x=0;x<o.length;x++){var m=o[x];if(Array.isArray(m)){var s=m[1],f=m[2],n=m.length>3,a=s>=5,P,_;if(a?(P=l,s=s-5,b=b||[],_=b):(P=l.prototype,r=r||[],_=r),s!==0&&!n){var D=a?T:d,p=D.get(f)||0;if(p===!0||p===3&&s!==4||p===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+f);!p&&s>2?D.set(f,s):D.set(f,!0)}g(c,P,m,f,s,a,n,_,u)}}return w(c,r),w(c,b),c}function w(l,o){o&&l.push(function(u){for(var c=0;c<o.length;c++)o[c].call(u);return u})}function C(l,o,u){if(o.length>0){for(var c=[],r=l,b=l.name,d=o.length-1;d>=0;d--){var T={v:!1};try{var x=o[d](r,{kind:"class",name:b,addInitializer:v(c,T),metadata:u})}finally{T.v=!0}x!==void 0&&(h(10,x),r=x)}return[S(r,u),function(){for(var m=0;m<c.length;m++)c[m].call(r)}]}}function S(l,o){return Object.defineProperty(l,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:o})}return function(o,u,c,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var d=Object.create(b===void 0?null:b),T=y(o,u,d);return c.length||S(o,d),{e:T,get c(){return C(o,c,d)}}}}function sc(v,t,e,i){return(sc=Qu())(v,t,e,i)}var ac,oc,lc,cc,nc,$r;ac=$({selector:"potatno-code-editor",template:rc,style:ec,components:[Sr,cr,Ar,Br]}),lc=B(),cc=B();var ic=class{static{({e:[nc],c:[$r,oc]}=sc(this,[[lc,3,"document"],[cc,2,"triggerPreviewUpdate"]],[ac]))}constructor(t=F.use(U),e=F.use(H)){nc(this),this.mComponent=t,this.mManager=e,this.mUnsubscribe=this.mManager.subscribe(R.Document|R.SpecialActiveFunction,()=>{this.mComponent.updater.updateAsync()})}mComponent;mManager;mUnsubscribe;get document(){return this.mManager.graph.document}set document(t){this.mManager.graph.setDocument(t)}get hasPreview(){let t=this.mManager.activeFunction,e=t.project.getFunction(t.definitionId);return e?t.project.preview.availableDisplays(e).length>0:!1}triggerPreviewUpdate(){return this.mManager.preview.execute()}onDeconstruct(){this.mUnsubscribe()}static{oc()}};var mr=class extends ye{mCodeEditor;mProject;mUiManager;get document(){return this.mCodeEditor.document}set document(t){this.mCodeEditor.document=t}get project(){return this.mProject}constructor(t){super(),this.mProject=t,this.addStyle(zo),this.addStyle(Fo),this.mUiManager=new H(t),this.setInjection(H,this.mUiManager),this.mCodeEditor=this.addContent($r)}deconstruct(){this.mUiManager.deconstruct()}load(t){let e=JSON.parse(t);if(!Array.isArray(e.functions))throw new A("Could not load document. Document has a wrong format.",this);let i=new ie(this.mProject).deserialize(e);this.document=i}save(){let t=new se().serialize(this.document);return JSON.stringify(t)}update(){this.mCodeEditor.triggerPreviewUpdate()}};var G=class extends at{constructor(t){super({id:t.id,label:t.label,category:t.category,regions:t.regions??null,generators:{ports:{inputs:e=>{for(let i of t.ports.inputs)e(i)},outputs:e=>{for(let i of t.ports.outputs)e(i)}},code:t.generators.code}})}};var dr=class{mDisplays;get displayIds(){return[...this.mDisplays.keys()]}constructor(){this.mDisplays=new Map}addDisplay(t){this.mDisplays.set(t.id,t)}availableDisplays(t,e=null){let i=new Array;for(let[h,g]of this.mDisplays)g.executor.function.id===t.id&&(e===null||g.allowsType(e))&&i.push(h);return i}getDisplay(t){return this.mDisplays.get(t)??null}};var pr=class{mCodeGenerator;mEntryPoint;mImports;mNodeDefinitions;mPreview;mTypes;mUserFunctions;get entryPoint(){return this.mEntryPoint}get generator(){return this.mCodeGenerator}get imports(){return this.mImports}get nodeDefinitions(){return this.mNodeDefinitions}get preview(){return this.mPreview}get types(){return this.mTypes}get userFunctions(){return this.mUserFunctions}constructor(t,e,i){this.mTypes=t,this.mCodeGenerator=i.generator,this.mPreview=new dr,this.mNodeDefinitions=new Map,this.mImports=new Array,this.mUserFunctions=new Map,this.mEntryPoint=e,this.addNodeDefinition(new Q),this.addNodeDefinition(new rt),this.addNodeDefinition(new Tt)}addImport(t){this.mImports.push(t)}addNodeDefinition(t){this.mNodeDefinitions.set(t.id,t)}getFunction(t){return this.mEntryPoint.id===t?this.mEntryPoint:this.mUserFunctions.get(t)}setDynamicFunction(t){this.mUserFunctions.set(t.id,t)}};var gr=class{mTypes;get typeNames(){return Array.from(this.mTypes.keys())}get types(){return this.mTypes}constructor(t){this.mTypes=new Map;for(let[e,i]of Object.entries(t))this.mTypes.set(e,{name:e,...i})}getDefaultValue(t){return this.getType(t).default.value}getType(t){if(!this.mTypes.has(t))throw new Error(`Type "${t}" is not defined in the project types definition.`);return this.mTypes.get(t)}isGenericType(t){return typeof t!="string"?!1:/^<[^>]+>$/.test(t)}};var vr=class extends gr{constructor(){super({number:{default:{string:["0"],value:0},convert:t=>{let e=t[0],i=parseFloat(e);if(isNaN(i))throw new Error(`Invalid number: "${e}"`);return i.toString()},inputs:[{name:"value",type:"number"}]},string:{default:{string:[""],value:""},convert:t=>t[0],inputs:[{name:"value",type:"string"}]},boolean:{default:{string:["false"],value:!1},convert:t=>{let e=t[0].toLowerCase();if(e==="true")return"true";if(e==="false")return"false";throw new Error(`Invalid boolean: "${t[0]}"`)},inputs:[{name:"value",type:"boolean"}]}})}};var yr=class extends ce{constructor(){super({id:"pixelShader",label:"Pixel Shader",statics:zt.inputs|zt.outputs,nodes:{entry:t=>{t(new G({id:"OnPixel",label:"OnPixel",category:{name:"event"},ports:{inputs:[],outputs:[{label:"exec",id:"exec",portType:"flow"},{label:"x",id:"x",portType:"value",dataType:"number"},{label:"y",id:"y",portType:"value",dataType:"number"}]},generators:{code:e=>{let i=e.outputs.x.value,h=e.outputs.y.value;return`(${i}, ${h}) => { ${e.outputs.exec.code.inner} }`}}}))},exit:t=>{t(new G({id:"PixelResult",label:"PixelResult",category:{name:"Output"},ports:{inputs:[{label:"exec",id:"exec",portType:"flow"},{label:"red",id:"red",portType:"value",dataType:"number"},{label:"green",id:"green",portType:"value",dataType:"number"},{label:"blue",id:"blue",portType:"value",dataType:"number"}],outputs:[]},generators:{code:e=>`return [${e.inputs.red.value}, ${e.inputs.green.value}, ${e.inputs.blue.value}];`}}))}},generator:{code:{body:t=>{let e=t.graphResultOf("OnPixel");return`const ${t.function.definitionId} = ${e?.code??"() => [0, 0, 0]"};`},value:t=>`${t.function.definitionId}()`}}})}};var br=class extends ce{constructor(){super({id:"Helper Function",label:"Helper Function",statics:zt.none,nodes:{entry:(t,e)=>{t(new at({id:"HelperFunctionEntry",label:"Entry",category:{name:"event"},generators:{ports:{outputs:i=>{i({label:"exec",id:"exec",portType:"flow"});for(let h of e.inputs)i({label:h.label,id:h.label,portType:"value",dataType:h.dataType})},inputs:()=>{}},code:i=>`(${Object.entries(i.outputs).filter(([g])=>g!=="exec").map(([,g])=>g.value).join(", ")}) => { ${i.outputs.exec.code.inner} }`}}))},exit:(t,e)=>{t(new at({id:"HelperFunctionReturn",label:"Return",category:{name:"event"},generators:{ports:{outputs:()=>{},inputs:i=>{i({label:"exec",id:"exec",portType:"flow"});for(let h of e.outputs)i({label:h.label,id:h.label,portType:"value",dataType:h.dataType})}},code:i=>`return { ${Object.entries(i.inputs).map(([g,y])=>`${g}: (${y.value})`).join(", ")} };`}}))}},generator:{code:{body:t=>{let e=t.function.project.generator.value.name(t.function.label),i=t.graphResultOf("HelperFunctionEntry");return`const ${e} = ${i?.code??"() => ({})"};`},value:t=>{let e=t.function.project.generator.value.name(t.function.label),i=Object.entries(t.inputs).map(([,y])=>y.value).join(", "),h=Object.entries(t.outputs).map(([y,w])=>`${y}: ${w.value}`).join(", "),g=t.outputs.Output?.code.inner??"";return h===""?`${e}(${i}); ${g}`:`const { ${h} } = ${e}(${i}); ${g}`}}}})}};var wr=class extends pr{mUserFunction;get userFunction(){return this.mUserFunction}constructor(){let t=new vr,e=new yr,i=new br;super(t,e,{generator:{code:h=>{let g="";for(let y of h.dependencies)g+=`${y.code}
`;return g+=h.entryPoint.code,g},value:{id:(h,g)=>`${h}_${g}`,name:h=>{let g=h.replaceAll(/[^A-Za-z0-9_]/g,"");return/^[0-9]/.test(g)?`_${g}`:g},hook:h=>`/*[${h}]*/`}}}),this.mUserFunction=i,this.setDynamicFunction(i),this.addBaseNodeDefinitions()}addBaseNodeDefinitions(){this.addNodeDefinition(new G({id:"Add",label:"Add",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} + ${t.inputs.b.value};`}})),this.addNodeDefinition(new G({id:"Subtract",label:"Subtract",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} - ${t.inputs.b.value};`}})),this.addNodeDefinition(new G({id:"Multiply",label:"Multiply",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} * ${t.inputs.b.value};`}})),this.addNodeDefinition(new G({id:"Divide",label:"Divide",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} / ${t.inputs.b.value};`}})),this.addNodeDefinition(new G({id:"Modulo",label:"Modulo",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} % ${t.inputs.b.value};`}})),this.addNodeDefinition(new G({id:"Equal",label:"Equal",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"boolean"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} === ${t.inputs.b.value};`}})),this.addNodeDefinition(new G({id:"Not Equal",label:"Not Equal",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"boolean"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} !== ${t.inputs.b.value};`}})),this.addNodeDefinition(new G({id:"Less Than",label:"Less Than",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"boolean"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} < ${t.inputs.b.value};`}})),this.addNodeDefinition(new G({id:"Greater Than",label:"Greater Than",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"boolean"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} > ${t.inputs.b.value};`}})),this.addNodeDefinition(new G({id:"And",label:"And",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"boolean"},{label:"b",id:"b",portType:"value",dataType:"boolean"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"boolean"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} && ${t.inputs.b.value};`}})),this.addNodeDefinition(new G({id:"Or",label:"Or",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"boolean"},{label:"b",id:"b",portType:"value",dataType:"boolean"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"boolean"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} || ${t.inputs.b.value};`}})),this.addNodeDefinition(new G({id:"Not",label:"Not",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"boolean"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"boolean"}]},generators:{code:t=>`const ${t.outputs.result.value} = !${t.inputs.a.value};`}})),this.addNodeDefinition(new G({id:"Number to String",label:"Number to String",category:{name:"type-conversion"},ports:{inputs:[{label:"input",id:"input",portType:"value",dataType:"number"}],outputs:[{label:"output",id:"output",portType:"value",dataType:"string"}]},generators:{code:t=>`const ${t.outputs.output.value} = String(${t.inputs.input.value});`}})),this.addNodeDefinition(new G({id:"String to Number",label:"String to Number",category:{name:"type-conversion"},ports:{inputs:[{label:"input",id:"input",portType:"value",dataType:"string"}],outputs:[{label:"output",id:"output",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.output.value} = Number(${t.inputs.input.value});`}})),this.addNodeDefinition(new G({id:"Boolean to String",label:"Boolean to String",category:{name:"type-conversion"},ports:{inputs:[{label:"input",id:"input",portType:"value",dataType:"boolean"}],outputs:[{label:"output",id:"output",portType:"value",dataType:"string"}]},generators:{code:t=>`const ${t.outputs.output.value} = String(${t.inputs.input.value});`}})),this.addNodeDefinition(new G({id:"If",label:"If",category:{name:"flow"},ports:{inputs:[{label:"exec",id:"exec",portType:"flow"},{label:"condition",id:"condition",portType:"value",dataType:"boolean"}],outputs:[{label:"then",id:"then",portType:"flow"},{label:"else",id:"else",portType:"flow"}]},generators:{code:t=>`if (${t.inputs.condition.value}) {
${t.outputs.then.code.inner}
} else {
${t.outputs.else.code.inner}
}`}})),this.addNodeDefinition(new G({id:"While",label:"While",category:{name:"flow"},ports:{inputs:[{label:"exec",id:"exec",portType:"flow"},{label:"condition",id:"condition",portType:"value",dataType:"boolean"}],outputs:[{label:"body",id:"body",portType:"flow"}]},generators:{code:t=>`while (${t.inputs.condition.value}) {
${t.outputs.body.code.inner}
}`}})),this.addNodeDefinition(new G({id:"For Loop",label:"For Loop",category:{name:"flow"},ports:{inputs:[{label:"exec",id:"exec",portType:"flow"},{label:"count",id:"count",portType:"value",dataType:"number"}],outputs:[{label:"exec",id:"exec",portType:"flow"},{label:"index",id:"index",portType:"value",dataType:"number"}]},generators:{code:t=>`for (let ${t.outputs.index.value} = 0; ${t.outputs.index.value} < ${t.inputs.count.value}; ${t.outputs.index.value}++) {
${t.outputs.exec.code.inner}
}`}})),this.addNodeDefinition(new G({id:"Console Log",label:"Console Log",category:{name:"Function"},ports:{inputs:[{label:"message",id:"message",portType:"value",dataType:"string"}],outputs:[]},generators:{code:t=>`console.log(${t.inputs.message.value});`}})),this.addNodeDefinition(new G({id:"String Concat",label:"String Concat",category:{name:"Function"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"string"},{label:"b",id:"b",portType:"value",dataType:"string"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"string"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} + ${t.inputs.b.value};`}}))}};var fe=class{mId;mLabel;mNodes;get id(){return this.mId}get label(){return this.mLabel}get nodes(){return this.mNodes}constructor(t,e){this.mId=t,this.mLabel=e,this.mNodes=new Array}addNode(t){this.mNodes.push(t)}};var xr=class extends fe{constructor(){super("Math","Math"),this.addNode(new G({id:"Math.PI",label:"Math.PI",category:{name:"value"},ports:{inputs:[],outputs:[{label:"value",id:"value",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.value.value} = Math.PI;`}})),this.addNode(new G({id:"Math.E",label:"Math.E",category:{name:"value"},ports:{inputs:[],outputs:[{label:"value",id:"value",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.value.value} = Math.E;`}})),this.addNode(new G({id:"Math.abs",label:"Math.abs",category:{name:"Function"},ports:{inputs:[{label:"value",id:"value",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = Math.abs(${t.inputs.value.value});`}})),this.addNode(new G({id:"Math.floor",label:"Math.floor",category:{name:"Function"},ports:{inputs:[{label:"value",id:"value",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = Math.floor(${t.inputs.value.value});`}})),this.addNode(new G({id:"Math.ceil",label:"Math.ceil",category:{name:"Function"},ports:{inputs:[{label:"value",id:"value",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = Math.ceil(${t.inputs.value.value});`}})),this.addNode(new G({id:"Math.random",label:"Math.random",category:{name:"Function"},ports:{inputs:[],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = Math.random();`}})),this.addNode(new G({id:"Math.sin",label:"Math.sin",category:{name:"Function"},ports:{inputs:[{label:"value",id:"value",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = Math.sin(${t.inputs.value.value});`}})),this.addNode(new G({id:"Math.cos",label:"Math.cos",category:{name:"Function"},ports:{inputs:[{label:"value",id:"value",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = Math.cos(${t.inputs.value.value});`}})),this.addNode(new G({id:"Math.min",label:"Math.min",category:{name:"Function"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = Math.min(${t.inputs.a.value}, ${t.inputs.b.value});`}})),this.addNode(new G({id:"Math.max",label:"Math.max",category:{name:"Function"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = Math.max(${t.inputs.a.value}, ${t.inputs.b.value});`}})),this.addNode(new G({id:"Math.clamp",label:"Math.clamp",category:{name:"Function"},ports:{inputs:[{label:"value",id:"value",portType:"value",dataType:"number"},{label:"min",id:"min",portType:"value",dataType:"number"},{label:"max",id:"max",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = Math.min(Math.max(${t.inputs.value.value}, ${t.inputs.min.value}), ${t.inputs.max.value});`}}))}};var Tr=class extends fe{constructor(){super("Time","Time"),this.addNode(new G({id:"CurrentTime",label:"CurrentTime",category:{name:"value"},ports:{inputs:[],outputs:[{label:"seconds",id:"seconds",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.seconds.value} = (performance.now() / 1000);`}}))}};var Dr=class{mCachedCallable;mDisplay;mElement;mSpecifiedParameters;mTarget;get display(){return this.mDisplay}get element(){return this.mElement||(this.mElement=this.mDisplay.generate()),this.mElement}constructor(t,e){this.mDisplay=t,this.mTarget=e,this.mCachedCallable=null,this.mElement=null,this.mSpecifiedParameters={...this.mDisplay.executor.defaultParameters}}execute(){this.mCachedCallable&&this.mDisplay.update(this.element,this.mCachedCallable)}refresh(){let t=this.mTarget instanceof it?this.mTarget.node.function:this.mTarget,e=(()=>{try{return new he(t.project).generateFunction(t,!0)}catch{return null}})();if(!e){this.mCachedCallable=null;return}let i=null;if(this.mTarget instanceof it&&(i=this.resolvePortTarget(e,this.mTarget),!i)){this.mCachedCallable=null;return}let h=this.mDisplay.executor.compile(e,i);if(!this.mDisplay.allowsType(h.type)){this.mCachedCallable=null;return}let g=this.mDisplay.adapterFor(h.type);this.mCachedCallable=y=>g(h.execute({...this.mDisplay.executor.defaultParameters,...this.mSpecifiedParameters,...y}))}specifyParameters(t){this.mSpecifiedParameters={...this.mSpecifiedParameters,...t}}resolvePortTarget(t,e){let[i,h]=(()=>{for(let y of t.entryPoint.graphs)if(y.ports.has(e)&&y.nodes.has(e.node))return[y.ports.get(e),y.nodes.get(e.node)];return[null,null]})();if(!i||!h)return null;let g=e.direction==="input"?"start":"end";return{documentPort:e,nodeHook:e.project.generator.value.hook(`${g}-${h}`),value:i}}};var me=class{mExecutor;mGenerate;mId;mName;mTypeAdapters;mUpdate;get executor(){return this.mExecutor}get id(){return`${this.mId}-${this.mExecutor.function.id}`}get name(){return this.mName}constructor(t,e){this.mId=e.id,this.mName=e.name,this.mExecutor=t,this.mGenerate=e.generate,this.mUpdate=e.update,this.mTypeAdapters=new Map;for(let[i,h]of Object.entries(e.typeAdapter))this.mExecutor.types.has(i)&&this.mTypeAdapters.set(i,h)}adapterFor(t){let e=t;if(!this.mTypeAdapters.has(e))throw new A(`Display "${this.mId}" has no type adapter for type "${t}".`,this);return this.mTypeAdapters.get(e)}allowsType(t){return this.mTypeAdapters.has(t)}createDriver(t){return new Dr(this,t)}generate(){return this.mGenerate()}update(t,e){return this.mUpdate(t,e)}};var Oe=class v extends me{static MATRIX_SIZE=3;static VALUE_LENGTH=5;constructor(t){super(t,{id:"matrix",name:"Matrix 3x3",generate:()=>{let e=document.createElement("div");return e.style.boxSizing="border-box",e.style.display="grid",e.style.gap="2px",e.style.gridTemplateColumns=`repeat(${v.MATRIX_SIZE}, minmax(0, 1fr))`,e.style.height="100%",e.style.width="100%",e.style.fontFamily="var(--potatno-font-family)",e.style.fontSize="var(--potatno-font-size-small)",e.style.color="#fff",e},typeAdapter:{[ht.MAIN]:e=>e.map(i=>this.formatPreviewValue(i)),number:e=>[this.formatPreviewValue(e)],string:e=>[this.formatPreviewValue(e)],boolean:e=>[this.formatPreviewValue(e)]},update:async(e,i)=>{await this.updateMatrixPreview(e,i)}})}formatPreviewValue(t){if(typeof t=="number"){if(!Number.isFinite(t))return t.toString().slice(0,v.VALUE_LENGTH);let e=Math.trunc(Math.abs(t)).toString().length,i=Math.max(0,v.VALUE_LENGTH-e-(t<0?1:0)-1);return t.toFixed(i).slice(0,v.VALUE_LENGTH)}return String(t).slice(0,v.VALUE_LENGTH)}async updateMatrixPreview(t,e){for(;t.children.length<v.MATRIX_SIZE*v.MATRIX_SIZE;){let i=document.createElement("div");i.style.alignItems="center",i.style.background="var(--potatno-color-background-dark)",i.style.border="1px solid var(--potatno-color-border)",i.style.boxSizing="border-box",i.style.color="var(--potatno-color-text)",i.style.display="flex",i.style.justifyContent="center",i.style.minWidth="0",i.style.overflow="hidden",i.style.padding="2px",i.style.textOverflow="clip",i.style.whiteSpace="pre-line",t.append(i)}for(let i=0;i<v.MATRIX_SIZE;i++)for(let h=0;h<v.MATRIX_SIZE;h++){let g=i*v.MATRIX_SIZE+h,y=v.MATRIX_SIZE===1?0:h/(v.MATRIX_SIZE-1),w=v.MATRIX_SIZE===1?0:i/(v.MATRIX_SIZE-1),C=e({x:y,y:w});t.children[g].textContent=C.join(`
`)}}};var Fe=class v extends me{static PREVIEW_PIXEL_SIZE=7.5;mCanvasContext;mCanvasImageData;constructor(t){super(t,{id:"2dCanvas",name:"Canvas 2D",generate:()=>{let e=document.createElement("canvas");return e.style.width="100%",e.style.height="100%",e.style.imageRendering="pixelated",e},typeAdapter:{[ht.MAIN]:e=>e,number:e=>[e,e,e],boolean:e=>{let i=e?1:0;return[i,i,i]}},update:async(e,i)=>{await this.updateCanvasPreview(e,i)}}),this.mCanvasImageData=new WeakMap,this.mCanvasContext=new WeakMap}async updateCanvasPreview(t,e){this.mCanvasContext.has(t)||this.mCanvasContext.set(t,t.getContext("2d"));let i=this.mCanvasContext.get(t),h=Math.max(1,Math.round(t.clientWidth/v.PREVIEW_PIXEL_SIZE)),g=Math.max(1,Math.round(t.clientHeight/v.PREVIEW_PIXEL_SIZE));(t.width!==h||t.height!==g||!this.mCanvasImageData.has(t))&&(t.width=h,t.height=g,this.mCanvasImageData.set(t,i.createImageData(h,g)));let y=this.mCanvasImageData.get(t),w=y.data;for(let C=0;C<g;C++)for(let S=0;S<h;S++){let l=S/h,o=C/g,u=e({x:l,y:o}),c=(C*h+S)*4;w[c]=Math.floor(Math.max(0,Math.min(1,u[0]||0))*255),w[c+1]=Math.floor(Math.max(0,Math.min(1,u[1]||0))*255),w[c+2]=Math.floor(Math.max(0,Math.min(1,u[2]||0))*255),w[c+3]=255}i.putImageData(y,0,0)}};var Mt=new wr;Mt.addImport(new xr);Mt.addImport(new Tr);var uc=new ht(Mt.entryPoint,{defaultParameters:{x:0,y:0},types:[ht.MAIN,"number","string","boolean"],build:(v,t,e)=>{let i=t.code,h=v.function.id;if(!e){let w=new Function(`${i}
return ${h};`)();return{type:ht.MAIN,execute:C=>w(C.x,C.y)}}let g=i.replace(e.nodeHook,`; return ${e.value};`),y=new Function(`${g}
return ${h};`)();return{type:e.documentPort.resolvedDataType,execute:w=>y(w.x,w.y)}}}),hc=new ht(Mt.userFunction,{defaultParameters:{x:0,y:0},types:["number","string","boolean"],build:(v,t,e)=>{if(!e)return{type:"number",execute:()=>0};let i=t.entryPoint.function,h=i.project.generator.value.name(i.label),g=i.inputs.map(C=>v.projectTypes.getDefaultValue(C.dataType)),y=t.code.replace(e.nodeHook,`return ${e.value};`),w=new Function(`${y}
return ${h};`)();return{type:e.documentPort.resolvedDataType,execute:()=>w(...g)}}});Mt.preview.addDisplay(new Fe(uc));Mt.preview.addDisplay(new Fe(hc));Mt.preview.addDisplay(new Oe(uc));Mt.preview.addDisplay(new Oe(hc));var ku=document.getElementById("application-root"),ze=new mr(Mt);ze.appendTo(ku);ze.document=new Vt(Mt);fc();function fc(){try{ze.update()}catch(v){}requestAnimationFrame(fc)}document.getElementById("load-button").addEventListener("click",rh);document.getElementById("save-button").addEventListener("click",oh);var Er=document.getElementById("font-size-slider"),th=document.getElementById("font-size-value"),eh=16,mc=()=>{let v=Math.round(parseFloat(Er.value)/eh*100);th.textContent=`${v}%`};Er.value=parseFloat(getComputedStyle(document.documentElement).fontSize).toString();mc();Er.addEventListener("input",()=>{document.documentElement.style.fontSize=`${Er.value}px`,mc()});var dc="potatno-code-document.json";async function rh(){if(window.confirm("Load saved document?"))try{let i=await(await(await navigator.storage.getDirectory()).getFileHandle(dc)).getFile();ze.load(await i.text())}catch{window.alert("Could not load document.")}}async function oh(){if(window.confirm("Override saved document?"))try{let i=await(await(await navigator.storage.getDirectory()).getFileHandle(dc,{create:!0})).createWritable();await i.write(ze.save()),await i.close()}catch{window.alert("Could not save document.")}}(()=>{let v=window.location.protocol==="https:"?"wss":"ws",t=new WebSocket(`${v}://${window.location.host}`);t.addEventListener("open",()=>{console.log("Refresh connection established")}),t.addEventListener("message",e=>{e.data==="REFRESH"&&(console.log("Bundle finished. Start refresh"),window.location.reload())})})();})();
//# sourceMappingURL=page.js.map
