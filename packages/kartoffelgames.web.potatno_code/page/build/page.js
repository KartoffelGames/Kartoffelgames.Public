(()=>{var Ht=class p extends Array{static newListWith(...t){let e=new p;return e.push(...t),e}clear(){this.splice(0,this.length)}clone(){return p.newListWith(...this)}distinct(){return p.newListWith(...new Set(this))}equals(t){if(this===t)return!0;if(!t||this.length!==t.length)return!1;for(let e=0;e<this.length;++e)if(this[e]!==t[e])return!1;return!0}remove(t){let e=this.indexOf(t);if(e!==-1)return this.splice(e,1)[0]}replace(t,e){let o=this.indexOf(t);if(o!==-1){let a=this[o];return this[o]=e,a}}toString(){return`[${super.join(", ")}]`}};var N=class extends Error{mTarget;get target(){return this.mTarget}constructor(t,e,o){super(t,o),this.mTarget=e}};var rt=class p extends Map{add(t,e){if(!this.has(t))this.set(t,e);else throw new N("Can't add duplicate key to dictionary.",this)}clone(){return new p(this)}getAllKeysOfValue(t){return[...this.entries()].filter(a=>a[1]===t).map(a=>a[0])}getOrDefault(t,e){let o=this.get(t);return typeof o<"u"?o:e}map(t){let e=new Ht;for(let o of this){let a=t(o[0],o[1]);e.push(a)}return e}};var Ft=class p{mSize;mTopItem;get size(){return this.mSize}get top(){if(this.mTopItem)return this.mTopItem.value}constructor(){this.mTopItem=null,this.mSize=0}clone(){let t=new p;return t.mTopItem=this.mTopItem,t.mSize=this.mSize,t}*entries(){let t=this.mTopItem;for(;t!==null;)yield t.value,t=t.previous}flush(){let t=new Array;for(;this.mTopItem;)t.push(this.pop());return t}pop(){if(!this.mTopItem)return;let t=this.mTopItem.value;return this.mTopItem=this.mTopItem.previous,this.mSize--,t}push(t){let e={previous:this.mTopItem,value:t};this.mTopItem=e,this.mSize++}toArray(){return[...this.entries()]}};var ue=class{mCompareFunction;constructor(t){this.mCompareFunction=t}differencesOf(t,e){let o;if(t.length===0||e.length===0){if(o=new Array,t.length===0)for(let C=0;C<e.length;C++)o.push({changeState:Pt.Insert,item:e[C]});else for(let C=0;C<t.length;C++)o.push({changeState:Pt.Remove,item:t[C]});return o}let a={1:{x:0,history:[]}},d=C=>C-1,g=t.length,y=e.length,T;for(let C=0;C<g+y+1;C++)for(let c=-C;c<C+1;c+=2){let n=c===-C||c!==C&&a[c-1].x<a[c+1].x;if(n){let l=a[c+1];T=l.x,o=l.history}else{let l=a[c-1];T=l.x+1,o=l.history}o=o.slice();let u=T-c;for(1<=u&&u<=y&&n?o.push({changeState:Pt.Insert,item:e[d(u)]}):1<=T&&T<=g&&o.push({changeState:Pt.Remove,item:t[d(T)]});T<g&&u<y&&this.mCompareFunction(t[d(T+1)],e[d(u+1)]);)T+=1,u+=1,o.push({changeState:Pt.Keep,item:t[d(T)]});if(T>=g&&u>=y)return o;a[c]={x:T,history:o}}return new Array}},Pt=function(p){return p[p.Remove=1]="Remove",p[p.Insert=2]="Insert",p[p.Keep=3]="Keep",p}({});var he=class{mNodeCache;constructor(){this.mNodeCache=new Map}start(t,e){let o=this.readFromCache(t),a=this.readFromCache(e),d=new mr;d.set(o,0);let g=new Map;g.set(o,0);let y=new Map,T=new Array;for(;d.length!==0;){let C=d.popLowest();if(T.push(C),C===a)return{path:[...this.pathTracer(C,y)].reverse(),processedNodes:T};for(let c of this.getNeighborNodes(C)){let n=(g.get(C)??Number.POSITIVE_INFINITY)+this.costOfTraversal(c,{startNode:o,endNode:a,path:this.pathTracer(C,y)}),u=g.get(c)??Number.POSITIVE_INFINITY;if(n>=u)continue;y.set(c,C),g.set(c,n);let l=n+this.heuristic(c,{startNode:o,endNode:a,path:this.pathTracer(C,y)});d.set(c,l)}}return{path:new Array,processedNodes:T}}getNeighborNodes(t){return this.neighborNodes(t).map(e=>this.readFromCache(e))}*pathTracer(t,e){let o=t;for(;yield o,!!e.has(o);)o=e.get(o)}readFromCache(t){let e=this.nodeId(t);return this.mNodeCache.has(e)?this.mNodeCache.get(e):(this.mNodeCache.set(e,t),t)}},mr=class{mExistingNodes;mList;mLowestCost;mLowestCostCounter;get length(){return this.mList.length}constructor(){this.mList=new Array,this.mExistingNodes=new Map,this.mLowestCost=Number.POSITIVE_INFINITY,this.mLowestCostCounter=0}popLowest(){if(this.mList.length===0)throw new N("Can not read next node from an empty priority list.",this);let[t,e]=(()=>{let g=null,y=0;for(let T=this.mList.length-1;T>-1;T--){let C=this.mList[T];if(C.cost===this.mLowestCost)return[C,0];(g===null||C.cost<g.cost)&&(g=C,y=0),C.cost===g.cost&&y++}if(g===null)throw new N("Lowest could not be found. Data is corrupted.",this);return[g,y]})();t.cost<this.mLowestCost&&(this.mLowestCost=t.cost,this.mLowestCostCounter=e),t.cost===this.mLowestCost&&this.mLowestCostCounter--,this.mLowestCostCounter<1&&(this.mLowestCost=Number.POSITIVE_INFINITY,this.mLowestCostCounter=0);let o=this.mExistingNodes.get(t.node),a=this.mList.length-1,d=this.mList[a];return this.mList[a]=t,this.mList[o]=d,this.mExistingNodes.set(d.node,o),this.mExistingNodes.delete(t.node),this.mList.pop().node}set(t,e){if(this.mLowestCostCounter>0&&e<this.mLowestCost&&(this.mLowestCost=e,this.mLowestCostCounter=0),e===this.mLowestCost&&this.mLowestCostCounter++,this.mExistingNodes.has(t)){let o=this.mExistingNodes.get(t),a=this.mList[o];if(a.cost===e){e===this.mLowestCost&&this.mLowestCostCounter--;return}a.cost=e;return}this.mList.push({cost:e,node:t}),this.mExistingNodes.set(t,this.mList.length-1)}};var me=class{mDataType;mId;mLabel;mPortType;mRegions;get dataType(){return this.mDataType}get id(){return this.mId}get label(){return this.mLabel}get portType(){return this.mPortType}get regions(){return this.mRegions}constructor(t){this.mLabel=t.label,this.mId=t.id,this.mPortType=t.portType,t.portType==="value"?this.mDataType=t.dataType:this.mDataType=null,this.mRegions={add:t.regions?.add??new Array}}};var K=class{mCategory;mCodeGenerator;mId;mLabel;mPortProvider;mRegions;get category(){return this.mCategory}get codeGenerator(){return this.mCodeGenerator}get id(){return this.mId}get inputs(){let t=!1,e=[];return this.mPortProvider.inputs(o=>{if(e.push(new me(o)),o.portType==="flow"){if(t)throw new N(`Node definition ${this.id} has multiple input flow ports, which is not allowed.`,this);t=!0}}),e}get label(){return this.mLabel}get outputs(){let t=[];return this.mPortProvider.outputs(e=>{t.push(new me(e))}),t}get regions(){return this.mRegions}constructor(t){this.mId=t.id,this.mLabel=t.label,this.mCategory={name:t.category.name,icon:t.category.icon??"\u25C6"},this.mCodeGenerator=t.generators.code,this.mPortProvider=t.generators.ports,this.mRegions={add:t.regions?.add??new Array,allows:t.regions?.allows??new Array,requires:t.regions?.requires??new Array}}getPort(t){return[...this.inputs,...this.outputs].find(e=>e.id===t)}};var Mt=class extends K{mFunction;get function(){return this.mFunction}get label(){return this.mFunction.label}constructor(t){let e=(a,d,g)=>y=>{g.length===0&&y({label:a,id:a,portType:"flow"});for(let T of d)y({label:T.label,id:T.label,portType:"value",dataType:T.dataType})},o=t.project.getFunction(t.definitionId);super({id:`USERFUNCTION_${t.id}`,label:t.label,category:{name:"user function",icon:"\u0192"},generators:{ports:{inputs:e("Input",t.inputs,t.outputs),outputs:e("Output",t.outputs,t.outputs)},code:a=>o?o.codeGenerator.value({function:t,inputs:a.inputs,outputs:a.outputs,code:a.code}):""}}),this.mFunction=t}};var dt=class p extends K{static DEFINITION_ID="8124c652-3a8e-4333-b405-f905522a4610";constructor(){super({id:p.DEFINITION_ID,label:"Comment",category:{name:"Comment",icon:"\u270E"},generators:{ports:{inputs:()=>{},outputs:()=>{}},code:()=>{throw new N("Comment node code generators should never be called.",p)}}})}};var xt=class p extends K{static DEFINITION_ID="23e9319b-3b62-4dd8-858a-17d97ddee94e";constructor(){super({id:p.DEFINITION_ID,label:"Flow Conjunction",category:{name:"Conjunction",icon:"\u25C7"},generators:{ports:{inputs:t=>{t({label:"in",id:"in",portType:"flow"})},outputs:t=>{t({label:"out",id:"out",portType:"flow"})}},code:()=>{throw new N("Conjunction node code generators should never be called.",p)}}})}};var Tt=class p extends K{static DEFINITION_ID="a579584d-5d35-42b5-b2ba-3daddee488e0";constructor(){super({id:p.DEFINITION_ID,label:"Value Conjunction",category:{name:"Conjunction",icon:"\u25C7"},generators:{ports:{inputs:t=>{t({label:"in",id:"in",portType:"value",dataType:"<T>"})},outputs:t=>{t({label:"out",id:"out",portType:"value",dataType:"<T>"})}},code:()=>{throw new N("Conjunction node code generators should never be called.",p)}}})}};var ft=class{mAffectedItems;mErrors;get affectedItems(){return this.mAffectedItems}get errors(){return this.mErrors}constructor(){this.mErrors=new Array,this.mAffectedItems=new Set}addAffectedItem(t){this.mAffectedItems.add(t)}merge(t){this.mErrors.push(...t.mErrors);for(let e of t.mAffectedItems)this.mAffectedItems.add(e);return this}pushError(...t){this.mErrors.push(...t)}},q=class{mItem;mMessage;get item(){return this.mItem}get message(){return this.mMessage}constructor(t,e){this.mMessage=t,this.mItem=e}};var ut=class{mConnectedPorts;mDataType;mDefinitionId;mDirectValue;mDirection;mDocument;mLabel;mNode;mPortType;mProject;get connectedPorts(){return this.mConnectedPorts}get dataType(){return this.mDataType}get definitionId(){return this.mDefinitionId}get directValue(){return this.mDirectValue}get direction(){return this.mDirection}get document(){return this.mDocument}get label(){return this.mLabel}set label(t){this.mLabel=t}get node(){return this.mNode}get portType(){return this.mPortType}get project(){return this.mProject}get resolvedDataType(){if(this.mPortType!=="value")throw new N("Port data type couldn't be resolved as it is no value port.",this);if(!this.mProject.types.isGenericType(this.mDataType??""))return this.mDataType;if(this.mDirection==="output"){let e=this.mNode.inputs.value.find(o=>o.dataType===this.mDataType);if(!e)throw new N("Port type couldn't be resolved as it has no resolving sibling port",this);return e.resolvedDataType}return this.mConnectedPorts.size===0?this.mDataType:this.mConnectedPorts.values().next().value.resolvedDataType}constructor(t,e,o){if(o.portType==="flow"&&o.dataType!==null)throw new N("Flow ports cannot have a value type.",this);if(o.portType==="value"&&o.dataType===null)throw new N("Value ports must have a value type.",this);this.mProject=t,this.mDocument=e,this.mNode=o.node,this.mDefinitionId=o.definitionId,this.mLabel=o.label,this.mDataType=o.dataType,this.mDirection=o.direction,this.mPortType=o.portType,this.mConnectedPorts=new Set,this.mDirectValue=new Array,o.dataType&&!this.mProject.types.isGenericType(o.dataType)&&this.mDirectValue.push(...t.types.getType(o.dataType).default.string)}connect(t){if(this.mConnectedPorts.has(t))return;if(this.mPortType!==t.portType)throw new N(`Cannot connect port ${this.mDefinitionId} of node ${this.mNode.label} to port ${t.mDefinitionId} of node ${t.node.label} due to incompatible port types.`,this);if(this.mDirection===t.direction)throw new N(`Cannot connect port ${this.mDefinitionId} of node ${this.mNode.label} to port ${t.mDefinitionId} of node ${t.node.label} due to incompatible directions.`,this);if(!(this.mPortType==="flow"&&this.mDirection==="input"||this.mPortType==="value"&&this.mDirection==="output"))for(let o of Array.from(this.mConnectedPorts))this.disconnect(o);this.mConnectedPorts.add(t),t.connect(this)}disconnect(t){this.mConnectedPorts.has(t)&&(this.mConnectedPorts.delete(t),t.disconnect(this))}setDirectValue(t){if(this.mPortType!=="value")throw new N("Only value ports can have a direct value.",this);if(this.mProject.types.isGenericType(this.mDataType))throw new N("Generic value ports cannot have a direct value.",this);if(t.length!==this.mProject.types.getType(this.mDataType).default.string.length)throw new N("The provided value does not match the expected length of the default value for this port's type.",this);this.mDirectValue.splice(0,this.mDirectValue.length),this.mDirectValue.push(...t)}validate(){let t=new ft;if(this.mDirection==="output"){if(this.mPortType==="flow"&&this.mConnectedPorts.size>1&&t.pushError(new q(`Flow output port "${this.mDefinitionId}" on node "${this.mNode.label}" can only have one connection.`,this)),this.mPortType==="value"&&this.mProject.types.isGenericType(this.mDataType??"")){let e=this.mNode.inputs.value.filter(o=>o.dataType===this.mDataType);for(let o of e)o.connectedPorts.size===0&&t.pushError(new q(`Generic output port "${this.mDefinitionId}" on node "${this.mNode.label}" cannot resolve generic type "${this.mDataType}" because its input port "${o.definitionId}" is not connected.`,this))}return t}if(this.mDirection==="input"){if(this.mPortType==="flow")return this.mConnectedPorts.size===0&&t.pushError(new q(`Flow input port "${this.mDefinitionId}" on node "${this.mNode.label}" must have at least one connection.`,this)),t;if(this.mPortType==="value"){this.mConnectedPorts.size>1&&t.pushError(new q(`Value input port "${this.mDefinitionId}" on node "${this.mNode.label}" can only have one connection.`,this));for(let e of this.mConnectedPorts)e.resolvedDataType!==this.resolvedDataType&&t.pushError(new q(`Value input port "${this.mDefinitionId}" on node "${this.mNode.label}" expects type "${this.resolvedDataType}" but is connected to type "${e.resolvedDataType}".`,this));return t}}return t}};var St=class{mDefinitionId;mDocument;mFunction;mInputs;mLabel;mOutputs;mPreview;mProject;mTransformation;get definitionId(){return this.mDefinitionId}get document(){return this.mDocument}get function(){return this.mFunction}get hasFlowPorts(){return this.mOutputs.flow.length>0||this.mInputs.flow.length>0}get hasValuePorts(){return this.mOutputs.value.length>0||this.mInputs.value.length>0}get inputs(){return this.mInputs}get label(){return this.mLabel}set label(t){this.mLabel=t}get outputs(){return this.mOutputs}get preview(){return this.mPreview}set preview(t){this.mPreview=t}get project(){return this.mProject}get transformation(){return this.mTransformation}constructor(t,e,o,a){this.mDocument=e,this.mDefinitionId=a.definitionId,this.mFunction=o,this.mLabel=a.label,this.mPreview=a.preview??null,this.mProject=t,this.mTransformation={x:0,y:0,width:0,height:0};let d=(g,y)=>{let T={direction:y,list:new Array,map:new Map,flow:new Array,value:new Array};for(let C of g){let c=new ut(this.mProject,this.mDocument,{definitionId:C.definitionId,direction:y,label:C.label,node:this,portType:C.portType,dataType:C.dataType});T.list.push(c),T.map.set(c.definitionId,c),(c.portType==="flow"?T.flow:T.value).push(c)}return T};this.mInputs=d(a.ports.input,"input"),this.mOutputs=d(a.ports.output,"output"),this.resizeTo(a.transformation.width,a.transformation.height),this.moveTo(a.transformation.x,a.transformation.y)}moveTo(t,e){this.mTransformation.x=Math.round(t),this.mTransformation.y=Math.round(e)}resizeTo(t,e){let o=this.mFunction.nodeDefinitions.find(g=>g.id===this.mDefinitionId),[a,d]=(()=>{switch(!0){case o instanceof dt:return[Math.max(6,t),Math.max(6,e)];case o instanceof Tt:case o instanceof xt:return[1,1];case o instanceof K:return[6,Math.max(this.mInputs.list.length,this.mOutputs.list.length)]}return[0,0]})();this.mTransformation.width=a,this.mTransformation.height=d}validate(t){let e=new ft,o=t??new Set,a=this.mFunction.nodeDefinitions.find(d=>d.id===this.mDefinitionId);if(!a)e.pushError(new q(`Node "${this.mLabel}" definition "${this.mDefinitionId}" could not be found.`,this));else{e.merge(this.resyncPorts(this.mInputs,a.inputs)),e.merge(this.resyncPorts(this.mOutputs,a.outputs));let d=new Set([...a.regions.requires,...a.regions.allows]);if(d.size>0)for(let g of o)d.has(g)||e.pushError(new q(`Node "${this.mLabel}" does not allow region "${g}".`,this));if(a.regions.requires.length>0)for(let g of a.regions.requires)o.has(g)||e.pushError(new q(`Node "${this.mLabel}" requires region "${g}" but it is not active.`,this))}for(let d of[...this.mInputs.list,...this.mOutputs.list])e.merge(d.validate());return this.resizeTo(this.transformation.width,this.transformation.height),e}addPort(t,e,o){let a=new ut(this.mProject,this.mDocument,{definitionId:e.id,direction:t.direction,label:e.label,node:this,portType:e.portType,dataType:e.dataType});return t.list.splice(o,0,a),t.map.set(a.definitionId,a),(a.portType==="flow"?t.flow:t.value).push(a),a}removePort(t,e){let o=t.list.indexOf(e);if(o===-1)throw new N(`Port "${e.label}" was not found and can not be removed.`,this);t.list.splice(o,1),t.map.delete(e.definitionId);let a=e.portType==="flow"?t.flow:t.value,d=a.indexOf(e);if(o===-1)throw new N(`Port "${e.label}" was not found in typed list and can not be removed.`,this);return a.splice(d,1),o}replacePort(t,e,o){let a=Array.from(e.connectedPorts);for(let y of Array.from(e.connectedPorts))e.disconnect(y);let d=this.removePort(t,e),g=this.addPort(t,o,d);for(let y of a)g.connect(y);return g}resyncPorts(t,e){let o=new ft,a=new Set(e.map(d=>d.id));for(let d=0;d<e.length;d++){let g=e[d];if(!t.map.has(g.id)){let n=this.addPort(t,g,d);o.addAffectedItem(n);continue}let y=t.map.get(g.id),T=y.portType!==g.portType,C=y.dataType!==g.dataType;if(!T&&!C)continue;if(y.connectedPorts.size>0&&T){o.pushError(new q(`Port "${y.label}" on node "${this.mLabel}" has a changed type.`,y));continue}let c=this.replacePort(t,y,g);o.addAffectedItem(y),o.addAffectedItem(c)}for(let d of t.list)if(!a.has(d.definitionId)){if(d.connectedPorts.size===0){o.addAffectedItem(d),this.removePort(t,d);continue}o.pushError(new q(`Port "${d.label}" on node "${this.mLabel}" no longer exists in its definition.`,d))}return o}};var Et=class{mDefinitionId;mDocument;mId;mImportIds;mInputs;mIsSystem;mLabel;mNodes;mOutputs;mProject;get definitionId(){return this.mDefinitionId}get document(){return this.mDocument}get dynamicNodeDefinitions(){let t=this.mProject.getFunction(this.definitionId);if(!t)return[...this.mDocument.nodeDefinitions];let e=t.getNodeDefinitions(this),o=this.mProject.imports.filter(a=>this.mImportIds.has(a.id)).flatMap(a=>a.nodes);return[...this.mDocument.nodeDefinitions,...o,...e.dynamic]}get id(){return this.mId}get imports(){return this.mImportIds}get inputs(){return this.mInputs}get isSystem(){return this.mIsSystem}get label(){return this.mLabel}set label(t){this.mLabel=t}get nodeDefinitions(){let t=this.mProject.getFunction(this.definitionId);if(!t)return this.dynamicNodeDefinitions;let e=t.getNodeDefinitions(this);return[...this.dynamicNodeDefinitions,...e.entry,...e.exit]}get nodes(){return this.mNodes}get outputs(){return this.mOutputs}get project(){return this.mProject}constructor(t,e,o){this.mProject=t,this.mDocument=e,this.mLabel=o.label,this.mIsSystem=o.isSystem,this.mDefinitionId=o.definitionId,this.mId=o.id,this.mNodes=new Set,this.mInputs=new Array,this.mOutputs=new Array,this.mImportIds=new Set}addImport(t){if(!this.project.imports.some(o=>o.id===t))throw new N(`Project does not contain import ${t}`,this);this.mImportIds.add(t)}addInput(t){this.mInputs.some(e=>e.label===t.label)||this.mInputs.push(t)}addNode(t){this.mNodes.add(t)}addNodeByDefinition(t,e){let o=d=>({definitionId:d.id,label:d.label,portType:d.portType,dataType:d.dataType}),a=new St(this.mProject,this.mDocument,this,{definitionId:t.id,ports:{input:t.inputs.map(o),output:t.outputs.map(o)},label:t.label,transformation:e});return this.mNodes.add(a),a}addOutput(t){this.mOutputs.some(e=>e.label===t.label)||this.mOutputs.push(t)}getExitNodes(){let t=this.mProject.getFunction(this.mDefinitionId);if(!t)throw new N(`Function definition not found for function "${this.mLabel}".`,this);let e=new Set(t.getNodeDefinitions(this).exit.map(o=>o.id));return[...this.mNodes].filter(o=>e.has(o.definitionId))}removeImport(t){this.mImportIds.delete(t)}removeInput(t){let e=this.mInputs.findIndex(o=>o.label===t.label);e!==-1&&this.mInputs.splice(e,1)}removeNode(t){for(let e of[...t.inputs.list,...t.outputs.list])for(let o of Array.from(e.connectedPorts))e.disconnect(o);this.mNodes.delete(t)}removeOutput(t){let e=this.mOutputs.findIndex(o=>o.label===t.label);e!==-1&&this.mOutputs.splice(e,1)}validate(){let t=new ft,e=this.mProject.getFunction(this.mDefinitionId);e||t.pushError(new q(`Function "${this.mLabel}" definition "${this.mDefinitionId}" could not be found.`,this));let o=e?.getNodeDefinitions(this);o&&this.resyncFunction(o,t);let a=this.collectRegions(this.mNodes,t),d=new Set(o?.entry.map(y=>y.id)??new Array),g=new Map;for(let y of this.mNodes)t.merge(y.validate(a.get(y))),this.collectEntryDomains(y,d,g).size>1&&t.pushError(new q(`Node "${y.label}" is reachable from multiple entry nodes.`,y));return t}collectEntryDomains(t,e,o){if(o.has(t))return o.get(t);let a=new Set;o.set(t,a);for(let d of t.inputs.list)for(let g of d.connectedPorts){let y=g.node;e.has(y.definitionId)&&a.add(y);for(let T of this.collectEntryDomains(y,e,o))a.add(T)}return a}collectRegions(t,e){let o=new Map;for(let y of this.nodeDefinitions)o.set(y.id,y);let a=(()=>{let y=new Map;return(T,C)=>{if(!y.has(T.id)){let c=new Map;for(let n of T.outputs)c.set(n.id,n.regions.add);y.set(T.id,c)}return[...y.get(T.id).get(C)??new Array,...T.regions.add]}})(),d=(()=>{let y=new Map;return(T,C)=>{if(y.has(T))return y.get(T);if(C.has(T))return e.pushError(new q(`Node "${T.label}" is part of a connection cycle.`,T)),new Set;C.add(T);let c=new Set;for(let n of T.inputs.list)for(let u of n.connectedPorts){let l=u.node;for(let r of d(l,C))c.add(r);if(o.has(l.definitionId))for(let r of a(o.get(l.definitionId),u.definitionId))c.add(r)}return y.set(T,c),c}})(),g=new Map;for(let y of t)g.set(y,d(y,new Set));return g}resyncFunction(t,e){let o=[...t.entry,...t.exit],a=new Set(this.mNodes.values().map(y=>y.definitionId)),d=0,g=20;for(let y of o){if(a.has(y.id))continue;let T=this.addNodeByDefinition(y,{x:Math.floor(d/(o.length/2))*g+2,y:d*g+2-Math.floor(d/(o.length/2))*(o.length/2*g),width:0,height:0});e.addAffectedItem(T),d++}}};var jt=class{mFunctionNodeDefinitions;mFunctions;mProject;get functions(){return this.mFunctions}get nodeDefinitions(){return[...this.mFunctionNodeDefinitions.values(),...this.mProject.nodeDefinitions.values()]}get project(){return this.mProject}constructor(t){this.mProject=t,this.mFunctions=new Array,this.mFunctionNodeDefinitions=new Map}addFunction(t){let e=this.mFunctions.indexOf(t);e!==-1&&this.mFunctions.splice(e,1),this.mFunctions.push(t);let o=new Mt(t);return this.mFunctionNodeDefinitions.set(o.id,o),t}newFunction(t){return this.addFunction(new Et(this.mProject,this,t))}removeFunction(t){if(t.isSystem)throw new N("Cannot remove a system function.",this);let e=this.mFunctions.indexOf(t);if(e===-1)return!1;this.mFunctions.splice(e,1);for(let o of this.mFunctionNodeDefinitions.values())o.function===t&&this.mFunctionNodeDefinitions.delete(o.id);return!0}validate(){let t=new ft,e=this.mProject.entryPoint.id;if(!this.mFunctions.values().some(o=>o.definitionId===e)){let o=this.newFunction({definitionId:e,id:crypto.randomUUID(),isSystem:!0,label:this.mProject.entryPoint.label});t.addAffectedItem(o)}for(let o of this.mFunctions)t.merge(o.validate());return t.pushError(...this.detectCrossFunctionRecursion()),t}detectCrossFunctionRecursion(){let t=[],e=new Map,o=y=>{if(!e.has(y)){let T=new Set;for(let C of y.nodes)this.mFunctionNodeDefinitions.has(C.definitionId)&&T.add(this.mFunctionNodeDefinitions.get(C.definitionId).function);e.set(y,T)}return e.get(y)},a=new Set,d=new Set,g=y=>{if(!a.has(y)){if(d.has(y)){t.push(new q(`Function "${y.label}" participates in a cross-function recursion cycle.`,y));return}d.add(y);for(let T of o(y))g(T);d.delete(y),a.add(y)}};for(let y of this.mFunctions)g(y);return t}};var zt=class{mData;mInteractionType;mOrigin;get data(){return this.mData}get origin(){return this.mOrigin}get triggerType(){return this.mInteractionType}constructor(t,e,o){this.mInteractionType=t,this.mData=o,this.mOrigin=e}};var pt=class p{static mCurrentZone=new p("Default");static get current(){return p.mCurrentZone}static create(t){return new p(t,p.current)}mAttachments;mInteractionListener;mName;mParent;mTriggerFilterBitmap;get name(){return this.mName}get parent(){return this.mParent}constructor(t,e=null){this.mName=t,this.mParent=e,this.mTriggerFilterBitmap=-1,this.mInteractionListener=new Map,this.mAttachments=new WeakMap}addInteractionListener(t){return this.mInteractionListener.set(t,p.current),this}execute(t,...e){let o=p.mCurrentZone;p.mCurrentZone=this;try{return t(...e)}finally{p.mCurrentZone=o}}getAttachment(t){return this.mAttachments.has(t)?this.mAttachments.get(t):this.mParent!==null?this.mParent.getAttachment(t):null}pushInteraction(t,e){if((this.mTriggerFilterBitmap&t)===0)return!1;if(this.mInteractionListener.size===0)return!0;let o=new zt(t,this,e);for(let[a,d]of this.mInteractionListener.entries())d.execute(()=>{a.call(this,o)});return!0}removeInteractionListener(t){return t?(this.mInteractionListener.delete(t),this):(this.mInteractionListener.clear(),this)}setAttachment(t,e){this.mAttachments.set(t,e)}setTriggerRestriction(t){return this.mTriggerFilterBitmap=t,this}};var J=class p{static mComponents=new WeakMap;static mConstructorSelector=new WeakMap;static mElements=new WeakMap;static elementIsComponent(t){return p.mComponents.has(t)}static ofComponent(t){let e=t.processorConstructor,o=p.mConstructorSelector.get(e);if(!o)throw new N(`Constructor "${e.name}" is not a registered custom element`,e);let a=p.mElements.get(t);if(!a)throw new N(`Component "${t}" is not a registered component`,t);return{selector:o,constructor:e,element:a,component:t,processor:t.processor}}static ofConstructor(t){let e=p.mConstructorSelector.get(t);if(!e)throw new N(`Constructor "${t.name}" is not a registered custom element`,t);let o=globalThis.customElements.get(e);if(!o)throw new N(`Constructor "${t.name}" is not a registered custom element`,t);return{selector:e,constructor:t,elementConstructor:o}}static ofElement(t){let e=p.mComponents.get(t);if(!e)throw new N(`Element "${t}" is not a PwbComponent.`,t);return p.ofComponent(e)}static ofProcessor(t){let e=p.mComponents.get(t);if(!e)throw new N("Processor is not a PwbComponent.",t);return p.ofComponent(e)}static registerComponent(t,e,o){p.mComponents.has(e)||p.mComponents.set(e,t),o&&!p.mComponents.has(o)&&p.mComponents.set(o,t),p.mElements.has(t)||p.mElements.set(t,e)}static registerConstructor(t,e){t&&!p.mConstructorSelector.has(t)&&p.mConstructorSelector.set(t,e)}};var Dt=class{static ATTACHMENT_KEY=Symbol("ComponentZoneConfiguration");mFrameTime;mInjection;get guaranteedFrameTime(){return this.mFrameTime}set guaranteedFrameTime(t){this.mFrameTime=t}get injections(){return this.mInjection}constructor(){this.mInjection=new Map,this.mFrameTime=Number.MAX_SAFE_INTEGER}setInjection(t,e){this.mInjection.set(t,e)}};var Jt=class extends Error{mZone;get zone(){return this.mZone}constructor(t,e){let o=t instanceof Error?t.message:"Non-error value thrown";super(`Update error in zone "${e.name}": ${o}`,{cause:t}),this.mZone=e}};var de=class p{static new(t,e){let o=new p;t(o),e&&o.appendTo(e)}mComponentZoneConfiguration;mContent;mCurrentTarget;mErrorListener;mFragment;mInteractionZone;constructor(){this.mContent=new Array,this.mFragment=document.createDocumentFragment(),this.mCurrentTarget=null,this.mErrorListener=new Array,this.mInteractionZone=pt.create("PwbApplication"),this.mComponentZoneConfiguration=new Dt,this.mInteractionZone.setAttachment(Dt.ATTACHMENT_KEY,this.mComponentZoneConfiguration),globalThis.addEventListener("error",t=>{this.handleZoneError(t,t.error)}),globalThis.addEventListener("unhandledrejection",t=>{this.handleZoneError(t,t.reason)})}addContent(t){let e=J.ofConstructor(t).elementConstructor,o=this.mInteractionZone.execute(()=>J.ofElement(new e));return this.mContent.push(o.component),this.mFragment.appendChild(o.element),this.updateTarget(),o.processor}addErrorListener(t){this.mErrorListener.includes(t)&&this.removeErrorListener(t),this.mErrorListener.push(t)}addStyle(t){let e=document.createElement("style");e.textContent=t,this.mFragment.prepend(e)}appendTo(t){this.mCurrentTarget=t,this.updateTarget()}removeErrorListener(t){let e=this.mErrorListener.indexOf(t);e!==-1&&this.mErrorListener.splice(e,1)}setInjection(t,e){this.mComponentZoneConfiguration.setInjection(t,e)}handleZoneError(t,e){if(!(e instanceof Jt)||!this.zoneBelongsToApplication(e.zone))return;t.preventDefault();let o=!1;for(let a of this.mErrorListener)a(e.cause)===!0&&(o=!0);o||console.error(e.cause)}updateTarget(){this.mCurrentTarget&&(this.mCurrentTarget.shadowRoot||this.mCurrentTarget.attachShadow({mode:"open"}),this.mCurrentTarget.shadowRoot.appendChild(this.mFragment))}zoneBelongsToApplication(t){let e=t;for(;e!==null;){if(e===this.mInteractionZone)return!0;e=e.parent}return!1}};var Kt=class{mCustomMetadata;constructor(){this.mCustomMetadata=new Map}getMetadata(t){return this.mCustomMetadata.get(t)??null}setMetadata(t,e){this.mCustomMetadata.set(t,e)}};var fe=class extends Kt{};var pe=class p extends Kt{static mPrivateMetadataKey=Symbol("Metadata");mDecoratorMetadataObject;mPropertyMetadata;constructor(t){super(),this.mDecoratorMetadataObject=t,this.mPropertyMetadata=new Map,t[p.mPrivateMetadataKey]=this}getInheritedMetadata(t){let e=new Array,o=this.mDecoratorMetadataObject;do{if(Object.hasOwn(o,p.mPrivateMetadataKey)){let d=o[p.mPrivateMetadataKey].getMetadata(t);d!==null&&e.push(d)}o=Object.getPrototypeOf(o)}while(o!==null);return e.reverse()}getProperty(t){return this.mPropertyMetadata.has(t)||this.mPropertyMetadata.set(t,new fe),this.mPropertyMetadata.get(t)}};Symbol.metadata??=Symbol("Symbol.metadata");var nt=class p{static mMetadataMapping=new Map;static add(t,e){return(o,a)=>{let d=p.forInternalDecorator(a.metadata);switch(a.kind){case"class":d.setMetadata(t,e);return;case"method":case"field":case"getter":case"setter":case"accessor":if(a.static)throw new Error("@Metadata.add not supported for statics.");d.getProperty(a.name).setMetadata(t,e);return}}}static forInternalDecorator(t){return p.mapMetadata(t)}static get(t){Object.hasOwn(t,Symbol.metadata)||p.polyfillMissingMetadata(t);let e=t[Symbol.metadata];return p.mapMetadata(e)}static init(){return(t,e)=>{p.forInternalDecorator(e.metadata)}}static mapMetadata(t){if(p.mMetadataMapping.has(t))return p.mMetadataMapping.get(t);let e=new pe(t);return p.mMetadataMapping.set(t,e),e}static polyfillMissingMetadata(t){let e=new Array,o=t;do e.push(o),o=Object.getPrototypeOf(o);while(o!==null);for(let a=e.length-1;a>=0;a--){let d=e[a];if(!Object.hasOwn(d,Symbol.metadata)){let g=null;a<e.length-2&&(g=e[a+1][Symbol.metadata]),d[Symbol.metadata]=Object.create(g,{})}}}};var R=class p{static mCurrentInjectionContext=null;static mInjectMode=new Map;static mInjectableConstructor=new Map;static mInjectableReplacement=new Map;static mInjectionConstructorIdentificationMetadataKey=Symbol("InjectionConstructorIdentification");static mSingletonMapping=new Map;static createObject(t,e,o){let[a,d]=typeof e=="object"&&e!==null?[!1,e]:[!!e,o??new Map],g=p.getInjectionIdentification(t);if(!p.mInjectableConstructor.has(g))throw new N(`Constructor "${t.name}" is not registered for injection and can not be built`,p);let y=a?"instanced":p.mInjectMode.get(g),T=new Map(d.entries().map(([n,u])=>[p.getInjectionIdentification(n),u])),C=p.mCurrentInjectionContext,c=new Map([...C?.localInjections.entries()??[],...T.entries()]);p.mCurrentInjectionContext={injectionMode:y,localInjections:c};try{if(!a&&y==="singleton"&&p.mSingletonMapping.has(g))return p.mSingletonMapping.get(g);let n=new t;return y==="singleton"&&!p.mSingletonMapping.has(g)&&p.mSingletonMapping.set(g,n),n}finally{p.mCurrentInjectionContext=C}}static injectable(t="instanced"){return(e,o)=>{p.registerInjectable(e,o.metadata,t)}}static registerInjectable(t,e,o){let a=p.getInjectionIdentification(t,e);p.mInjectableConstructor.set(a,t),p.mInjectMode.set(a,o)}static replaceInjectable(t,e){let o=p.getInjectionIdentification(t);if(!p.mInjectableConstructor.has(o))throw new N("Original constructor is not registered.",p);let a=p.getInjectionIdentification(e);if(!p.mInjectableConstructor.has(a))throw new N("Replacement constructor is not registered.",p);p.mInjectableReplacement.set(o,e)}static use(t){if(p.mCurrentInjectionContext===null)throw new N("Can't create object outside of an injection context.",p);let e=p.getInjectionIdentification(t);if(p.mCurrentInjectionContext.injectionMode!=="singleton"&&p.mCurrentInjectionContext.localInjections.has(e))return p.mCurrentInjectionContext.localInjections.get(e);let o=p.mInjectableReplacement.get(e);if(o||(o=p.mInjectableConstructor.get(e)),!o)throw new N(`Constructor "${t.name}" is not registered for injection and can not be built`,p);return p.createObject(o)}static getInjectionIdentification(t,e){let o=e?nt.forInternalDecorator(e):nt.get(t),a=o.getMetadata(p.mInjectionConstructorIdentificationMetadataKey);return a||(a=Symbol(t.name),o.setMetadata(p.mInjectionConstructorIdentificationMetadataKey,a)),a}};var W=function(p){return p[p.Read=1]="Read",p[p.ReadWrite=2]="ReadWrite",p[p.Write=3]="Write",p}({});var At=class{mHooks;mInjections;mProcessor;mProcessorConstructor;get processor(){if(!this.mProcessor)throw new N("Processor is not created yet. Call setup to create processor.",this);return this.mProcessor}get processorConstructor(){return this.mProcessorConstructor}constructor(t){if(this.mProcessorConstructor=t.constructor,this.mProcessor=null,this.mInjections=new Map,this.mHooks={create:new Array},t.parent)for(let[e,o]of t.parent.mInjections.entries())this.setProcessorInjection(e,o)}deconstruct(){}getProcessorInjection(t){return this.mInjections.get(t)}setProcessorInjection(t,e){if(this.mProcessor)throw new N("Cant add injections to after construction.",this);this.mInjections.set(t,e)}setup(){return this.mProcessor=this.createProcessor(),this}addConstructionHook(t){return this.mHooks.create.push(t),this}call(t,...e){let o=Reflect.get(this.processor,t);return typeof o!="function"?null:o.apply(this.processor,e)}createProcessor(){let t=R.createObject(this.mProcessorConstructor,this.mInjections),e;for(;e=this.mHooks.create.pop();){let o=e.call(this,t);o&&(t=o)}return t}};var Vt=class p extends At{constructor(t,e){super({constructor:t,parent:e}),this.setProcessorInjection(p,this)}deconstruct(){this.call("onDeconstruct"),super.deconstruct()}setup(){return super.setup(),this.call("onExecute"),this}onUpdate(){return!1}};var dr=class p{static mInstance;mCoreEntityConstructor;mProcessorConstructorConfiguration;constructor(){if(p.mInstance)return p.mInstance;p.mInstance=this,this.mCoreEntityConstructor=new Map,this.mProcessorConstructorConfiguration=new Map}get(t){let e=this.mCoreEntityConstructor.get(t);if(!e)return new Array;let o=new Array;for(let a of e)o.push({processorConstructor:a,processorConfiguration:this.mProcessorConstructorConfiguration.get(a)});return o}register(t,e,o){this.mProcessorConstructorConfiguration.set(e,o);let a=t;do{if(!(a.prototype instanceof At)&&a!==At)break;this.mCoreEntityConstructor.has(a)||this.mCoreEntityConstructor.set(a,new Set),this.mCoreEntityConstructor.get(a).add(e)}while(a=Object.getPrototypeOf(a))}},at=new dr;var Qt=class p extends At{static mExtensionCache=new WeakMap;mExtensionList;constructor(t){super(t),this.mExtensionList=new Array}deconstruct(){for(let t of this.mExtensionList)t.deconstruct();super.deconstruct()}setup(){return super.setup(),this.executeExtensions(),this}executeExtensions(){let t=(()=>{if(!p.mExtensionCache.has(this.processorConstructor)){let a=at.get(Vt).filter(g=>{for(let y of g.processorConfiguration.targetRestrictions)if(this instanceof y||this.processorConstructor.prototype instanceof y||this.processorConstructor===y)return!0;return!1}),d={read:a.filter(g=>g.processorConfiguration.access===W.Read),write:a.filter(g=>g.processorConfiguration.access===W.Write),readWrite:a.filter(g=>g.processorConfiguration.access===W.ReadWrite)};p.mExtensionCache.set(this.processorConstructor,d)}return p.mExtensionCache.get(this.processorConstructor)})(),e=[...t.write,...t.readWrite,...t.read];for(let o of e)this.mExtensionList.push(new Vt(o.processorConstructor,this).setup())}};var B={get:1,set:2,manual:4};var Ne=class p{static ORIGINAL_TO_INTERACTION_MAPPING=new WeakMap;static PROXY_TO_ORIGINAL_MAPPING=new WeakMap;static UNTRACEABLE_FUNCTION_UPDATE_TRIGGER=(()=>{let t=new WeakMap;return t.set(Array.prototype.fill,B.set),t.set(Array.prototype.pop,B.get),t.set(Array.prototype.push,B.set),t.set(Array.prototype.shift,B.get),t.set(Array.prototype.unshift,B.set),t.set(Array.prototype.splice,B.set),t.set(Array.prototype.reverse,B.set),t.set(Array.prototype.sort,B.set),t.set(Array.prototype.concat,B.set),t.set(Map.prototype.clear,B.set),t.set(Map.prototype.delete,B.set),t.set(Map.prototype.set,B.set),t.set(Set.prototype.clear,B.set),t.set(Set.prototype.delete,B.set),t.set(Set.prototype.add,B.set),t})();static getOriginal(t){return p.PROXY_TO_ORIGINAL_MAPPING.get(t)??t}static getWrapper(t){let e=p.getOriginal(t);return p.ORIGINAL_TO_INTERACTION_MAPPING.get(e)}mProxyObject;mStateChangeCallback;get proxy(){return this.mProxyObject}constructor(t,e){let o=p.getWrapper(t);if(o)return o;this.mProxyObject=this.createProxyObject(t),this.mStateChangeCallback=e,p.PROXY_TO_ORIGINAL_MAPPING.set(this.mProxyObject,t),p.ORIGINAL_TO_INTERACTION_MAPPING.set(t,this)}convertToProxy(t){return t===null||typeof t!="object"&&typeof t!="function"?t:new p(t,this.mStateChangeCallback).proxy}createProxyObject(t){let e=(a,d,g)=>{let y=p.getOriginal(d);try{let T=a.call(y,...g);return this.convertToProxy(T)}finally{if(p.UNTRACEABLE_FUNCTION_UPDATE_TRIGGER.has(a)){let T=p.getWrapper(d);T&&T.dispatch(p.UNTRACEABLE_FUNCTION_UPDATE_TRIGGER.get(a))}}};return new Proxy(t,{apply:(a,d,g)=>{let y=a;try{let T=y.call(d,...g);return this.convertToProxy(T)}catch(T){if(!(T instanceof TypeError))throw T;return e(y,d,g)}},set:(a,d,g)=>{try{let y=g;return(y!==null&&typeof y=="object"||typeof y=="function")&&(y=p.getOriginal(y)),Reflect.set(a,d,y)}finally{this.dispatch(B.set)}},get:(a,d,g)=>{try{return this.convertToProxy(Reflect.get(a,d))}finally{this.dispatch(B.get)}},deleteProperty:(a,d)=>{try{return delete a[d]}finally{this.dispatch(B.set)}}})}dispatch(t){this.mStateChangeCallback(t)}};var $=class p{static reaction(t){let e=pt.create("ComponentState reaction");e.addInteractionListener(o=>{(o.triggerType&B.set)!==0&&t()}),e.execute(()=>{t()})}static state(t){return(e,o)=>{if(o.static)throw new N("Event target is not for a static property.",p);let a=new WeakMap,d=(g,y)=>{a.set(g,new p(y,t))};return{init(g){return typeof g>"u"||d(this,g),g},set(g){a.has(this)?a.get(this).set(g):d(this,g)},get(){return a.has(this)||d(this,void 0),a.get(this).get()}}}}mConfiguration;mLinkedZones;mLinkedZonesArray;mValue;constructor(t,e){if(this.mLinkedZones=new Set,this.mLinkedZonesArray=new Array,this.mConfiguration={complexValue:e?.complexValue??!1,proxy:e?.proxy??!1},this.mConfiguration.proxy){if(typeof t!="object"||t===null)throw new N("Proxied component state value must be an object.",this);this.mValue=new Ne(t,o=>{switch(o){case B.set:return this.dispatchChange();case B.get:return this.linkCurrentZone()}}).proxy}else this.mValue=t}get(){return this.linkCurrentZone(),this.mValue}set(t){if(this.mConfiguration.proxy)throw new N("Proxy is not implemented yet.",this);!this.mConfiguration.complexValue&&this.mValue===t||(this.mValue=t,this.dispatchChange())}dispatchChange(){for(let t of this.mLinkedZonesArray)t.pushInteraction(B.set,this)}linkCurrentZone(){let t=pt.current;this.mLinkedZones.has(t)||(this.mLinkedZones.add(t),this.mLinkedZonesArray.push(t))}};var $t=class p{static mCurrentUpdateCycle=null;static openResheduledCycle(t,e){let o=!1;if(!p.mCurrentUpdateCycle){let a=performance.now();p.mCurrentUpdateCycle={initiator:t.initiator,startTime:a,forcedSync:t.forcedSync,runner:t.runner},o=!0}try{return e(p.mCurrentUpdateCycle)}finally{o&&(p.mCurrentUpdateCycle=null)}}static openUpdateCycle(t,e){let o=!1;if(!p.mCurrentUpdateCycle){let a=performance.now();p.mCurrentUpdateCycle={initiator:t.updater,startTime:a,forcedSync:t.runSync,runner:Symbol("Runner "+a)},o=!0}try{return e(p.mCurrentUpdateCycle)}finally{o&&(p.mCurrentUpdateCycle=null)}}static updateCycleRunId(t,e){if(t.initiator===e){let o=performance.now(),a=t;a.runner=Symbol("Runner "+o)}}static updateCyleStartTime(t){let e=performance.now(),o=t;o.startTime=e}};var Le=class extends Error{mChain;get chain(){return this.mChain}constructor(t,e){let o=e.slice(-20).map(a=>a.toString()).join(`
`);super(`${t}: 
${o}`),this.mChain=[...e]}};var _e=class p{static DEFAULT_FRAME_TIME=Number.MAX_SAFE_INTEGER;static STACK_CAP=100;mFrameTime;mInteractionZone;mManualComponentState;mUpdateFunction;mUpdateRunCache;mUpdateStates;get zone(){return this.mInteractionZone}constructor(t){this.mUpdateRunCache=new WeakMap,this.mUpdateFunction=t.onUpdate,this.mFrameTime=p.DEFAULT_FRAME_TIME;let e=pt.current.getAttachment(Dt.ATTACHMENT_KEY);e&&(this.mFrameTime=e.guaranteedFrameTime),this.mManualComponentState=new $(Symbol("Manual Update")),this.mUpdateStates={chainCompleteHooks:new Ft,async:{hasSheduledTask:!1,hasRunningTask:!1,sheduledTaskIsResheduled:!1},sync:{running:!1},cycle:{chainedTask:null}},this.mInteractionZone=pt.create("Update-Zone"),this.mInteractionZone.addInteractionListener(o=>{(o.triggerType&B.set)!==0&&this.runUpdateAsynchron(o,null)})}deconstruct(){this.mInteractionZone.removeInteractionListener()}executeInZone(t){return this.mInteractionZone.execute(t)}update(){let t=new zt(B.manual,this.mInteractionZone,this.mManualComponentState);return this.runUpdateSynchron(t)}updateAsync(){let t=new zt(B.manual,this.mInteractionZone,this.mManualComponentState);this.runUpdateAsynchron(t,null)}async waitForUpdate(){return this.mUpdateStates.async.hasSheduledTask?new Promise((t,e)=>{this.mUpdateStates.chainCompleteHooks.push((o,a)=>{a?e(a):t(o)})}):!1}executeTaskChain(t,e,o,a){if(a.length>p.STACK_CAP)throw new Le("Call loop detected",a);let d=performance.now();if(!e.forcedSync&&d-e.startTime>this.mFrameTime)throw new ge;a.push(t);let g=this.mInteractionZone.execute(()=>this.mUpdateFunction.call(this))||o;if($t.updateCycleRunId(e,this),!this.mUpdateStates.cycle.chainedTask)return g;let y=this.mUpdateStates.cycle.chainedTask;return this.mUpdateStates.cycle.chainedTask=null,this.executeTaskChain(y,e,g,a)}releaseUpdateChainCompleteHooks(t,e){if(!this.mUpdateStates.chainCompleteHooks.top)return;let o;for(;o=this.mUpdateStates.chainCompleteHooks.pop();)o(t,e)}runUpdateAsynchron(t,e){if(this.mUpdateStates.async.hasRunningTask||this.mUpdateStates.async.sheduledTaskIsResheduled){this.mUpdateStates.cycle.chainedTask=t;return}if(this.mUpdateStates.async.hasSheduledTask)return;let o=a=>{this.mUpdateStates.async.hasRunningTask=!0,this.mUpdateStates.async.hasSheduledTask=!1,this.mUpdateStates.async.sheduledTaskIsResheduled=!1;let d=!1;try{this.runUpdateSynchron(t)}catch(g){if(g instanceof ge&&a.initiator===this)d=!0;else throw new Jt(g,this.zone)}finally{this.mUpdateStates.async.hasRunningTask=!1}d&&this.runUpdateAsynchron(t,a)};this.mUpdateStates.async.hasSheduledTask=!0,e&&(this.mUpdateStates.async.sheduledTaskIsResheduled=!0),globalThis.requestAnimationFrame(()=>{e?$t.openResheduledCycle(e,o):$t.openUpdateCycle({updater:this,runSync:!1},o)})}runUpdateSynchron(t){if(this.mUpdateStates.sync.running)return this.mUpdateStates.cycle.chainedTask=t,!1;this.mUpdateStates.sync.running=!0;try{let e=$t.openUpdateCycle({updater:this,runSync:!0},o=>{if(this.mUpdateRunCache.has(o.runner))return $t.updateCyleStartTime(o),this.mUpdateRunCache.get(o.runner);let a=this.executeTaskChain(t,o,!1,new Array);return this.mUpdateRunCache.set(o.runner,a),a});return this.releaseUpdateChainCompleteHooks(e),e}catch(e){throw e instanceof ge||this.releaseUpdateChainCompleteHooks(!1,e),e}finally{this.mUpdateStates.sync.running=!1}}},ge=class extends Error{constructor(){super("Update resheduled")}};var Re=class extends Qt{mUpdater;get updater(){return this.mUpdater}constructor(t){super(t),this.mUpdater=new _e({label:t.constructor.name,onUpdate:()=>this.onUpdate()})}call(t,...e){return this.mUpdater.executeInZone(()=>super.call(t,...e))}deconstruct(){this.mUpdater.deconstruct(),super.deconstruct()}createProcessor(){return this.mUpdater.executeInZone(()=>super.createProcessor())}};var Xt=class{mExpression;mTemporaryValues;constructor(t,e,o){if(this.mTemporaryValues=new rt,o.length>0)for(let a of o)this.mTemporaryValues.set(a,void 0);this.mExpression=this.createEvaluationFunction(t,this.mTemporaryValues).bind(e.store)}execute(){return this.mExpression()}setTemporaryValue(t,e){if(!this.mTemporaryValues.has(t))throw new N(`Temporary value "${t}" does not exist for this procedure.`,this);this.mTemporaryValues.set(t,e)}createEvaluationFunction(t,e){let o,a=`__${Math.random().toString(36).substring(2)}`;if(o="return function () {",e.size>0)for(let d of e.keys())o+=`const ${d} = ${a}.get('${d}');`;return o+=`return ${t};`,o+="};",new Function(a,o)(e)}};var It=class{mDataLevel;get data(){return this.mDataLevel}constructor(t){this.mDataLevel=t}createExpressionProcedure(t,e){return new Xt(t,this.data,e??[])}setTemporaryValue(t,e){this.data.setTemporaryValue(t,e)}};var ht=class{mComponent;mDataProxy;mParentLevel;mTemporaryValues;get store(){return this.mDataProxy}constructor(t){this.mTemporaryValues=new rt,t instanceof G?(this.mParentLevel=null,this.mComponent=t):(this.mParentLevel=t,this.mComponent=t.mComponent),this.mDataProxy=this.createAccessProxy()}deleteTemporaryValue(t){this.mTemporaryValues.delete(t)}setTemporaryValue(t,e){this.mTemporaryValues.set(t,e)}updateLevelData(t){if(t.mParentLevel!==this.mParentLevel)throw new N("Can't update InstructionLevelData for a deeper level than it target data.",this);this.mTemporaryValues=t.mTemporaryValues}createAccessProxy(){return new Proxy(new Object,{get:(t,e)=>this.getValue(e),set:(t,e,o)=>(this.hasTemporaryValue(e)&&this.setTemporaryValue(e,o),e in this.mComponent.processor?(this.mComponent.processor[e]=o,!0):(this.setTemporaryValue(e,o),!0)),deleteProperty:()=>{throw new N("Deleting properties is not allowed",this)},ownKeys:()=>[...new Set([...Object.keys(this.mComponent.processor),...this.getTemporaryValuesList()])]})}getTemporaryValuesList(){let t=this.mTemporaryValues.map(e=>e);return this.mParentLevel&&t.push(...this.mParentLevel.getTemporaryValuesList()),t}getValue(t){if(this.mTemporaryValues.has(t))return this.mTemporaryValues.get(t);if(this.mParentLevel)return this.mParentLevel.getValue(t);if(t in this.mComponent.processor)return this.mComponent.processor[t]}hasTemporaryValue(t){return this.mTemporaryValues.has(t)?!0:this.mParentLevel?this.mParentLevel.hasTemporaryValue(t):!1}};var Yt=class p{mChildList;mInstruction;mInstructionType;get childList(){return this.mChildList}get instruction(){return this.mInstruction}get instructionType(){return this.mInstructionType}constructor(t,e){this.mChildList=Array(),this.mInstruction=e,this.mInstructionType=t}appendChild(...t){this.mChildList.push(...t)}clone(){let t=new p(this.instructionType,this.instruction);for(let e of this.mChildList)t.appendChild(e.clone());return t}equals(t){if(!(t instanceof p)||t.instruction!==this.instruction||t.instructionType!==this.instructionType||t.childList.length!==this.childList.length)return!1;for(let e=0;e<t.childList.length;e++)if(!t.childList[e].equals(this.childList[e]))return!1;return!0}removeChild(t){let e=this.mChildList.indexOf(t);if(e!==-1)return this.mChildList.splice(e,1)[0]}};var Nt=class p{mExpression;get value(){return this.mExpression}constructor(t){this.mExpression=t}clone(){return new p(this.mExpression)}equals(t){return t instanceof p&&t.value===this.value}toString(){return`{{ ${this.mExpression} }}`}};var Lt=class p{mContainsExpression;mTextValue;mValues;get containsExpression(){return this.mContainsExpression}get values(){return this.mValues}constructor(){this.mTextValue="",this.mContainsExpression=!1,this.mValues=[]}addValue(...t){for(let e of t)(this.mContainsExpression===!0||e instanceof Nt)&&(this.mContainsExpression=!0),this.mValues.push(e),this.mTextValue+=e.toString()}clone(){let t=new p;for(let e of this.values)typeof e=="string"?t.addValue(e):t.addValue(e.clone());return t}equals(t){if(!(t instanceof p)||t.values.length!==this.values.length)return!1;for(let e=0;e<this.values.length;e++){let o=this.values[e],a=t.values[e];if(o!==a&&(typeof o!=typeof a||typeof o=="string"&&o!==a||!a.equals(o)))return!1}return!0}toString(){return this.mTextValue}};var ve=class p{mName;mValue;get name(){return this.mName}get values(){return this.mValue}constructor(t){this.mName=t,this.mValue=new Lt}clone(){let t=new p(this.name);for(let e of this.values.values)typeof e=="string"?t.values.addValue(e):t.values.addValue(e.clone());return t}equals(t){return!(!(t instanceof p)||t.name!==this.name||!t.values.equals(this.values))}};var _t=class p{mAttributeDictionary;mChildList;mTagName;get attributes(){return[...this.mAttributeDictionary.values()]}get childList(){return this.mChildList}get tagName(){return this.mTagName}constructor(t){this.mAttributeDictionary=new Map,this.mChildList=Array(),this.mTagName=t}appendChild(...t){this.mChildList.push(...t)}clone(){let t=new p(this.tagName);for(let e of this.mAttributeDictionary.values()){let o=t.setAttribute(e.name);for(let a of e.values.values)typeof a=="string"?o.addValue(a):o.addValue(a.clone())}for(let e of this.mChildList)t.appendChild(e.clone());return t}equals(t){if(!(t instanceof p)||t.tagName!==this.tagName||t.attributes.length!==this.mAttributeDictionary.size||t.childList.length!==this.mChildList.length)return!1;for(let e of t.mAttributeDictionary.values()){let o=this.mAttributeDictionary.get(e.name);if(!o||!o.equals(e))return!1}for(let e=0;e<t.childList.length;e++)if(!t.childList[e].equals(this.mChildList[e]))return!1;return!0}getAttribute(t){return this.mAttributeDictionary.get(t)?.values??null}removeAttribute(t){return this.mAttributeDictionary.delete(t)}removeChild(t){let e=this.mChildList.indexOf(t);if(e!==-1)return this.mChildList.splice(e,1)[0]}setAttribute(t){if(this.mAttributeDictionary.has(t))return this.mAttributeDictionary.get(t).values;let e=new ve(t);return this.mAttributeDictionary.set(t,e),e.values}};var lt=class p{mBodyElementList;get body(){return this.mBodyElementList}constructor(){this.mBodyElementList=new Array}appendChild(...t){this.mBodyElementList.push(...t)}clone(){let t=new p;for(let e of this.mBodyElementList)t.appendChild(e.clone());return t}equals(t){if(!(t instanceof p)||t.body.length!==this.mBodyElementList.length)return!1;for(let e=0;e<this.mBodyElementList.length;e++)if(!this.mBodyElementList[e].equals(t.body[e]))return!1;return!0}removeChild(t){let e=this.mBodyElementList.indexOf(t);if(e!==-1)return this.mBodyElementList.splice(e,1)[0]}};var it=class{mComponentValues;mContent;mModules;mTemplate;get anchor(){return this.mContent.contentAnchor}get content(){return this.mContent}get modules(){return this.mModules}get template(){return this.mTemplate}get values(){return this.mComponentValues}constructor(t,e,o,a){this.mTemplate=t,this.mComponentValues=o,this.mContent=a,this.mModules=e,a.setCoreBuilder(this)}deconstruct(){this.content.deconstruct()}update(){let t=this.onUpdate(),e=!1,o=this.content.builders;if(o.length>0)for(let a=0;a<o.length;a++)e=o[a].update()||e;return t||e}createTextNode(t){return document.createTextNode(t)}};var kt=class{mChildBuilderList;mChildComponents;mContentAnchor;mContentBoundary;mLinkedContent;mRootChildList;get body(){return this.mRootChildList}get builders(){return this.mChildBuilderList}get contentAnchor(){return this.mContentAnchor}constructor(t){this.mChildBuilderList=new Array,this.mRootChildList=new Array,this.mChildComponents=new Map,this.mLinkedContent=new WeakSet,this.mContentAnchor=document.createComment(t),this.mContentBoundary={start:this.mContentAnchor,end:this.mContentAnchor}}deconstruct(){this.onDeconstruct();let t;for(;t=this.mChildBuilderList.pop();)t.deconstruct();for(let o of this.mChildComponents.values())o.deconstruct();this.mChildComponents.clear();let e;for(;e=this.mRootChildList.pop();)e instanceof it||e.remove();this.contentAnchor.remove()}getBoundary(){let t=this.mContentBoundary.end instanceof it?this.mContentBoundary.end.content.getBoundary().end:this.mContentBoundary.end;return{start:this.mContentBoundary.start,end:t}}insert(t,e,o){if(!this.mLinkedContent.has(o))throw new N("Can't add content to builder. Target is not part of builder.",this);let a=t instanceof it?t.anchor:t;switch(e){case"After":{this.insertAfter(a,o);break}case"TopOf":{this.insertTop(a,o);break}case"BottomOf":{this.insertBottom(a,o);break}}this.mLinkedContent.add(t),t instanceof it?this.mChildBuilderList.push(t):this.addChildComponent(t);let d=a.parentElement??a.getRootNode(),g=this.mContentAnchor.parentElement??this.mContentAnchor.getRootNode();if(d===g){let y=(()=>{switch(e){case"After":return this.mRootChildList.indexOf(o)+1;case"TopOf":return 0;case"BottomOf":return this.mRootChildList.length}})();y===this.mRootChildList.length&&(this.mContentBoundary.end=t),this.mRootChildList.splice(y+1,0,t)}}remove(t){if(!this.mLinkedContent.has(t))throw new N("Child node cant be deleted from builder when it not a child of them",this);if(this.mLinkedContent.delete(t),t instanceof it){let o=this.mChildBuilderList.indexOf(t);o!==-1&&this.mChildBuilderList.splice(o,1),t.deconstruct()}else{let o=this.mChildComponents.get(t);o&&(o.deconstruct(),this.mChildComponents.delete(t)),t.remove()}let e=this.mRootChildList.indexOf(t);e!==-1&&(this.mRootChildList.splice(e,1),this.mContentBoundary.end=this.mRootChildList.at(-1)??this.mContentAnchor)}setCoreBuilder(t){this.mLinkedContent.add(t)}addChildComponent(t){J.elementIsComponent(t)&&this.mChildComponents.set(t,J.ofElement(t).component)}insertAfter(t,e){let o=e instanceof it?e.content.getBoundary().end:e;(o.parentElement??o.getRootNode()).insertBefore(t,o.nextSibling)}insertBottom(t,e){if(e instanceof it){this.insertAfter(t,e);return}if(e instanceof Element){e.appendChild(t);return}throw new N("Source node does not support child nodes.",this)}insertTop(t,e){if(e instanceof it){this.insertAfter(t,e.anchor);return}if(e instanceof Element){e.prepend(t);return}throw new N("Source node does not support child nodes.",this)}};var Oe=class extends kt{mAttributeModulesChangedOrder;mLinkedAttributeData;mLinkedAttributeExpressionModules;mLinkedAttributeModuleList;mLinkedExpressionModuleList;get linkedAttributeModules(){return this.mAttributeModulesChangedOrder&&(this.mAttributeModulesChangedOrder=!1,this.mLinkedAttributeModuleList.sort((t,e)=>t.accessMode-e.accessMode)),this.mLinkedAttributeModuleList}get linkedExpressionModules(){return this.mLinkedExpressionModuleList}constructor(t){super(t),this.mLinkedExpressionModuleList=new Array,this.mLinkedAttributeModuleList=new Array,this.mLinkedAttributeExpressionModules=new WeakMap,this.mLinkedAttributeData=new WeakMap,this.mAttributeModulesChangedOrder=!1}attributeOfLinkedExpressionModule(t){return this.mLinkedAttributeExpressionModules.get(t)}getLinkedAttributeData(t){if(!this.mLinkedAttributeData.has(t))throw new N("Attribute has no linked data.",this);return this.mLinkedAttributeData.get(t)}linkAttributeExpression(t,e){this.mLinkedAttributeExpressionModules.set(t,e)}linkAttributeModule(t){this.mLinkedAttributeModuleList.push(t),this.mAttributeModulesChangedOrder=!0}linkAttributeNodes(t,e,o){this.mLinkedAttributeData.set(t,{values:o,node:e})}linkExpressionModule(t){this.mLinkedExpressionModuleList.push(t)}onDeconstruct(){for(let t of this.mLinkedAttributeModuleList)t.deconstruct();for(let t of this.mLinkedExpressionModuleList)t.deconstruct()}};var Fe=class extends kt{mInstructionModule;get instructionModule(){return this.mInstructionModule}constructor(t,e){super(e),this.mInstructionModule=t}onDeconstruct(){this.mInstructionModule.deconstruct()}};var je=class extends it{constructor(t,e,o){let a=e.createInstructionModule(t,o);super(t,e,o,new Fe(a,`Instruction - {$${t.instructionType}}`))}onUpdate(){if(this.content.instructionModule.update()){let t=this.content.body;this.updateStaticBuilder(t,this.content.instructionModule.instructionResult.elementList)}return!1}insertNewContent(t,e){let o=new te(t.template,this.modules,t.dataLevel,`Child - {$${this.template.instructionType}}`);return e===null?this.content.insert(o,"TopOf",this):this.content.insert(o,"After",e),o}updateStaticBuilder(t,e){let a=new ue((y,T)=>T.template.equals(y.template)).differencesOf(t,e),d=0,g=null;for(let y=0;y<a.length;y++){let T=a[y];if(T.changeState===Pt.Remove)this.content.remove(T.item);else if(T.changeState===Pt.Insert)g=this.insertNewContent(T.item,g),d++;else{let C=e[d].dataLevel;T.item.values.updateLevelData(C),g=T.item,d++}}}};var te=class extends it{mInitialized;constructor(t,e,o,a){super(t,e,o,new Oe(`Static - {${a}}`)),this.mInitialized=!1}onUpdate(){this.mInitialized||(this.mInitialized=!0,this.buildTemplate([this.template],this));let t=!1,e=this.content.linkedAttributeModules;for(let d=0;d<e.length;d++)t=e[d].update()||t;let o=!1,a=this.content.linkedExpressionModules;for(let d=0;d<a.length;d++){let g=a[d];if(g.update()){o=!0;let y=this.content.attributeOfLinkedExpressionModule(g);if(!y)continue;let T=this.content.getLinkedAttributeData(y),C=T.values.reduce((c,n)=>c+n.data,"");T.node.setAttribute(y.name,C)}}return t||o}buildInstructionTemplate(t,e){this.content.insert(new je(t,this.modules,new ht(this.values)),"BottomOf",e)}buildStaticTemplate(t,e){let{element:o,isComponent:a}=this.createHtmlElement(t),d=null;a&&(d=new Array);for(let g of t.attributes){let y=this.modules.createAttributeModule(g,o,this.values);if(y){this.content.linkAttributeModule(y),a&&d.push(y);continue}if(g.values.containsExpression){let T=new Array;for(let C of g.values.values){let c=this.createTextNode("");if(T.push(c),!(C instanceof Nt)){c.data=C;continue}let n=this.modules.createExpressionModule(C,c,this.values);this.content.linkExpressionModule(n),this.content.linkAttributeExpression(n,g)}this.content.linkAttributeNodes(g,o,T);continue}o.setAttribute(g.name,g.values.toString())}if(a){for(let g of d)g.update();J.ofElement(o).component.updater.update()}this.content.insert(o,"BottomOf",e),this.buildTemplate(t.childList,o)}buildTemplate(t,e){for(let o of t)o instanceof lt?this.buildTemplate(o.body,e):o instanceof Lt?this.buildTextTemplate(o,e):o instanceof Yt?this.buildInstructionTemplate(o,e):o instanceof _t&&this.buildStaticTemplate(o,e)}buildTextTemplate(t,e){for(let o of t.values){if(typeof o=="string"){this.content.insert(this.createTextNode(o),"BottomOf",e);continue}let a=this.createTextNode("");this.content.insert(a,"BottomOf",e);let d=this.modules.createExpressionModule(o,a,this.values);this.content.linkExpressionModule(d)}}createHtmlElement(t){let e=t.tagName;if(e.includes("-")){let a=globalThis.customElements.get(e);if(typeof a<"u"){let d=new a;return{element:d,isComponent:J.elementIsComponent(d)}}}let o=t.getAttribute("xmlns");return o&&!o.containsExpression?{element:document.createElementNS(o.values[0],e),isComponent:!1}:{element:document.createElement(e),isComponent:!1}}};var ye=class{mHtmlElement;mShadowRoot;get htmlElement(){return this.mHtmlElement}get shadowRoot(){return this.mShadowRoot}constructor(t){this.mHtmlElement=t,this.mShadowRoot=this.mHtmlElement.attachShadow({mode:"open"})}};var H=class{mDataLevel;get data(){return this.mDataLevel}constructor(t){this.mDataLevel=t}createExpressionProcedure(t,e){return new Xt(t,this.data,e??[])}};var Gt=class extends Qt{constructor(t){super({constructor:t.constructor,parent:t.parent}),this.setProcessorInjection(H,new H(t.values))}deconstruct(){super.deconstruct(),this.call("onDeconstruct")}update(){return this.onUpdate()}};var et=class{mValue;get value(){return this.mValue}constructor(t){this.mValue=t}};var Q=class{constructor(){throw new N("Reference should not be instanced.",this)}};var mt=class{constructor(){throw new N("Reference should not be instanced.",this)}};var Bt=class p extends Gt{mLastResult;mTargetTextNode;constructor(t){super({constructor:t.constructor,parent:t.parent,values:t.values}),this.mTargetTextNode=t.targetNode,this.mLastResult=null,this.setProcessorInjection(p,this),this.setProcessorInjection(mt,t.targetTemplate.clone()),this.setProcessorInjection(Q,t.targetNode),this.setProcessorInjection(et,new et(t.targetTemplate.value))}onUpdate(){let t=this.call("onUpdate");t===null&&(t="");let e=this.mLastResult===null||this.mLastResult!==t;if(e){let o=this.mTargetTextNode;o.data=t,this.mLastResult=t}return e}};function fr(){return(p,t)=>{R.registerInjectable(p,t.metadata,"instanced"),at.register(Bt,p,{})}}function es(){function p(c,n){return function(l){e(n,"addInitializer"),o(l,"An initializer"),c.push(l)}}function t(c,n,u,l,r,b,v,E,w){var f;switch(r){case 1:f="accessor";break;case 2:f="method";break;case 3:f="getter";break;case 4:f="setter";break;default:f="field"}var s={kind:f,name:v?"#"+n:n,static:b,private:v,metadata:E},m={v:!1};s.addInitializer=p(l,m);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return c(w,s)}finally{m.v=!0}}function e(c,n){if(c.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(c,n){if(typeof c!="function")throw new TypeError(n+" must be a function")}function a(c,n){var u=typeof n;if(c===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var l;throw c===0?l="field":c===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function d(c,n,u,l,r,b,v,E,w){var f=u[0],s,m,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,P;if(typeof f=="function")h=t(f,l,s,E,r,b,v,w,i),h!==void 0&&(a(r,h),r===0?m=h:r===1?(m=h.init,x=h.get||i.get,P=h.set||i.set,i={get:x,set:P}):i=h);else for(var M=f.length-1;M>=0;M--){var S=f[M];if(h=t(S,l,s,E,r,b,v,w,i),h!==void 0){a(r,h);var A;r===0?A=h:r===1?(A=h.init,x=h.get||i.get,P=h.set||i.set,i={get:x,set:P}):i=h,A!==void 0&&(m===void 0?m=A:typeof m=="function"?m=[m,A]:m.push(A))}}if(r===0||r===1){if(m===void 0)m=function(I,D){return D};else if(typeof m!="function"){var F=m;m=function(I,D){for(var L=D,_=0;_<F.length;_++)L=F[_].call(I,L);return L}}else{var z=m;m=function(I,D){return z.call(I,D)}}c.push(m)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(c.push(function(I,D){return i.get.call(I,D)}),c.push(function(I,D){return i.set.call(I,D)})):r===2?c.push(i):c.push(function(I,D){return i.call(I,D)}):Object.defineProperty(n,l,s))}function g(c,n,u){for(var l=[],r,b,v=new Map,E=new Map,w=0;w<n.length;w++){var f=n[w];if(Array.isArray(f)){var s=f[1],m=f[2],i=f.length>3,h=s>=5,x,P;if(h?(x=c,s=s-5,b=b||[],P=b):(x=c.prototype,r=r||[],P=r),s!==0&&!i){var M=h?E:v,S=M.get(m)||0;if(S===!0||S===3&&s!==4||S===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+m);!S&&s>2?M.set(m,s):M.set(m,!0)}d(l,x,f,m,s,h,i,P,u)}}return y(l,r),y(l,b),l}function y(c,n){n&&c.push(function(u){for(var l=0;l<n.length;l++)n[l].call(u);return u})}function T(c,n,u){if(n.length>0){for(var l=[],r=c,b=c.name,v=n.length-1;v>=0;v--){var E={v:!1};try{var w=n[v](r,{kind:"class",name:b,addInitializer:p(l,E),metadata:u})}finally{E.v=!0}w!==void 0&&(a(10,w),r=w)}return[C(r,u),function(){for(var f=0;f<l.length;f++)l[f].call(r)}]}}function C(c,n){return Object.defineProperty(c,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,l,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),E=g(n,u,v);return l.length||C(n,v),{e:E,get c(){return T(n,l,v)}}}}function Sr(p,t,e,o){return(Sr=es())(p,t,e,o)}var Ar,Pr,pr;Ar=fr();var Mr=class{static{({c:[pr,Pr]}=Sr(this,[],[Ar]))}constructor(t=R.use(H),e=R.use(et)){this.mProcedure=t.createExpressionProcedure(e.value)}mProcedure;onUpdate(){let t=this.mProcedure.execute();return typeof t>"u"?null:t?.toString()}static{Pr()}};var ot=class{mName;mValue;get name(){return this.mName}get value(){return this.mValue}constructor(t,e){this.mName=t,this.mValue=e}};var gt=class p extends Gt{mAccessMode;get accessMode(){return this.mAccessMode}constructor(t){super({constructor:t.constructor,parent:t.parent,values:t.values}),this.mAccessMode=t.accessMode,this.setProcessorInjection(p,this),this.setProcessorInjection(mt,t.targetTemplate.clone()),this.setProcessorInjection(Q,t.targetNode),this.setProcessorInjection(ot,new ot(t.targetTemplate.name,t.targetTemplate.values.toString()))}onUpdate(){return this.call("onUpdate")??!1}};var ct=class{mDataLevels;mElementList;mTemplates;get elementList(){return this.mElementList}constructor(){this.mElementList=new Array,this.mTemplates=new Set,this.mDataLevels=new Set}addElement(t,e){if(this.mTemplates.has(t)||this.mDataLevels.has(e))throw new N("Can't add same template or values for multiple Elements.",this);this.mTemplates.add(t),this.mDataLevels.add(e),this.mElementList.push({template:t,dataLevel:e})}};var Ut=class p extends Gt{mLastResult;get instructionResult(){return this.mLastResult}constructor(t){super({constructor:t.constructor,parent:t.parent,values:t.values}),this.setProcessorInjection(p,this),this.setProcessorInjection(mt,t.targetTemplate.clone()),this.setProcessorInjection(et,new et(t.targetTemplate.instruction)),this.mLastResult=new ct}onUpdate(){let t=this.call("onUpdate");return t instanceof ct?(this.mLastResult=t,!0):!1}};var ze=class p{static mAttributeModuleCache=new rt;static mExpressionModuleCache=new WeakMap;static mInstructionModuleCache=new rt;mComponent;mExpressionModule;constructor(t,e){this.mExpressionModule=e??pr,this.mComponent=t}createAttributeModule(t,e,o){let a=(()=>{let d=p.mAttributeModuleCache.get(t.name);if(d||d===null)return d;for(let g of at.get(gt))if(g.processorConfiguration.selector.test(t.name))return p.mAttributeModuleCache.set(t.name,g),g;return p.mAttributeModuleCache.set(t.name,null),null})();return a===null?null:new gt({accessMode:a.processorConfiguration.access,constructor:a.processorConstructor,parent:this.mComponent,targetNode:e,targetTemplate:t,values:o}).setup()}createExpressionModule(t,e,o){let a=(()=>{let d=p.mExpressionModuleCache.get(this.mExpressionModule);if(d)return d;let g=at.get(Bt).find(y=>y.processorConstructor===this.mExpressionModule);if(!g)throw new N("An expression module could not be found.",this);return p.mExpressionModuleCache.set(this.mExpressionModule,g),g})();return new Bt({constructor:a.processorConstructor,parent:this.mComponent,targetNode:e,targetTemplate:t,values:o}).setup()}createInstructionModule(t,e){let o=(()=>{let a=p.mInstructionModuleCache.get(t.instructionType);if(a)return a;for(let d of at.get(Ut))if(d.processorConfiguration.instructionType===t.instructionType)return p.mInstructionModuleCache.set(t.instructionType,d),d;throw new N(`Instruction module type "${t.instructionType}" not found.`,this)})();return new Ut({constructor:o.processorConstructor,parent:this.mComponent,targetTemplate:t,values:e}).setup()}};var Wt=class extends N{mColumnEnd;mColumnStart;mLineEnd;mLineStart;get columnEnd(){return this.mColumnEnd}get columnStart(){return this.mColumnStart}get lineEnd(){return this.mLineEnd}get lineStart(){return this.mLineStart}constructor(t,e,o,a,d,g,y){super(t,e,y),this.mColumnStart=o,this.mLineStart=a,this.mColumnEnd=d,this.mLineEnd=g}};var ee=class{mDependencyFetch;mDependencyFetchResolved;mLexer;mMeta;mPattern;mPatternDependencies;mType;get dependencies(){return this.mPatternDependencies}get dependenciesResolved(){return this.mDependencyFetchResolved}get lexer(){return this.mLexer}get meta(){return this.mMeta}get pattern(){return this.mPattern}constructor(t,e){if(this.mLexer=t,this.mType=e.type,this.mMeta=e.metadata,this.mPatternDependencies=new Array,this.mDependencyFetch=e.dependencyFetch??null,this.mDependencyFetchResolved=!e.dependencyFetch,this.mType==="split"&&!this.mDependencyFetch)throw new N("Split token with a start and end token, need inner token definitions.",this);if(this.mType==="single"&&this.mDependencyFetch)throw new N("Pattern does not allow inner token pattern.",this);this.mPattern=this.convertTokenPattern(this.mType,e.pattern)}isSplit(){return this.mType==="split"}resolveDependencies(){this.mDependencyFetchResolved||(this.mDependencyFetch(this),this.mDependencyFetchResolved=!0)}useChildPattern(t){if(this.mLexer!==t.lexer)throw new N("Can only add dependencies of the same lexer.",this);this.mPatternDependencies.push(t)}convertTokenPattern(t,e){if("single"in e){if(t==="split")throw new N("Can't use split pattern type with single pattern definition.",this);return{start:{regex:e.single.regex,types:e.single.types,validator:e.single.validator??null}}}else{if(t==="single")throw new N("Can't use single pattern type with split pattern definition.",this);return{start:{regex:e.start.regex,types:e.start.types,validator:e.start.validator??null},end:{regex:e.end.regex,types:e.end.types,validator:e.end.validator??null},innerType:e.innerType??null}}}};var re=class{mColumnNumber;mLineNumber;mMetas;mType;mValue;get columnNumber(){return this.mColumnNumber}get lineNumber(){return this.mLineNumber}get metas(){return[...this.mMetas]}get type(){return this.mType}get value(){return this.mValue}constructor(t,e,o,a){this.mValue=e,this.mColumnNumber=o,this.mLineNumber=a,this.mType=t,this.mMetas=new Set}addMeta(...t){for(let e of t)this.mMetas.add(e)}hasMeta(t){return this.mMetas.has(t)}};var be=class{mRootPattern;mSettings;get errorType(){return this.mSettings.errorType}set errorType(t){this.mSettings.errorType=t}get trimWhitespace(){return this.mSettings.trimSpaces}set trimWhitespace(t){this.mSettings.trimSpaces=t}get validWhitespaces(){return[...this.mSettings.whiteSpaces].join("")}set validWhitespaces(t){this.mSettings.whiteSpaces=new Set(t.split(""))}constructor(){this.mSettings={errorType:null,trimSpaces:!0,whiteSpaces:new Set},this.mRootPattern=new ee(this,{type:"single",pattern:{single:{regex:/^/,types:{},validator:null}},metadata:[],dependencyFetch:null})}createTokenPattern(t,e){let o=y=>typeof y=="string"?{token:y}:y,a=y=>{let T=new Set(y.flags.split(""));return new RegExp(`^(?<token>${y.source})`,[...T].join(""))},d=new Array;t.meta&&(typeof t.meta=="string"?d.push(t.meta):d.push(...t.meta));let g;return"regex"in t.pattern?g={single:{regex:a(t.pattern.regex),types:o(t.pattern.type),validator:t.pattern.validator??null}}:g={start:{regex:a(t.pattern.start.regex),types:o(t.pattern.start.type),validator:t.pattern.start.validator??null},end:{regex:a(t.pattern.end.regex),types:o(t.pattern.end.type),validator:t.pattern.end.validator??null},innerType:t.pattern.innerType??null},new ee(this,{type:"regex"in t.pattern?"single":"split",pattern:g,metadata:d,dependencyFetch:e??null})}*tokenize(t,e){let o={data:t,cursor:{position:0,column:1,line:1},error:null,progressTracker:e??null};yield*this.tokenizeRecursionLayer(o,this.mRootPattern,new Array,null)}useRootTokenPattern(t){if(t.lexer!==this)throw new N("Token pattern must be created by this lexer.",this);this.mRootPattern.useChildPattern(t)}findNextStartToken(t,e,o,a){for(let d of e){let g=d.pattern.start,y=this.matchToken(d,g,t,o,a);if(y!==null)return{pattern:d,token:y}}return null}findTokenTypeOfMatch(t,e,o){for(let g in t.groups){let y=t.groups[g],T=e[g];if(!(!y||!T)){if(y.length!==t[0].length)throw new N("A group of a token pattern must match the whole token.",this);return T}}let a=new Array;for(let g in t.groups)t.groups[g]&&a.push(g);let d=new Array;for(let g in e)d.push(g);throw new N(`No token type found for any defined pattern regex group. Full: "${t[0]}", Matches: "${a.join(", ")}", Available: "${d.join(", ")}", Regex: "${o.source}"`,this)}*generateErrorToken(t,e){if(!t.error||!this.mSettings.errorType)return;let o=new re(this.mSettings.errorType,t.error.data,t.error.startColumn,t.error.startLine);o.addMeta(...e),t.error=null,yield o}generateToken(t,e,o,a,d,g){let y=o[0],T=this.findTokenTypeOfMatch(o,a,g),C=new re(d??T,y,t.cursor.column,t.cursor.line);return C.addMeta(...e),C}matchToken(t,e,o,a,d){let g=e.regex;g.lastIndex=0;let y=g.exec(o.data);if(!y||y.index!==0)return null;let T=this.generateToken(o,[...a,...t.meta],y,e.types,d,g);if(e.validator){let C=o.data.substring(T.value.length);if(!e.validator(T,C,o.cursor.position))return null}return this.moveCursor(o,T.value),T}moveCursor(t,e){let o=e.split(`
`);o.length>1&&(t.cursor.column=1),t.cursor.line+=o.length-1,t.cursor.column+=o.at(-1).length,t.cursor.position+=e.length,t.data=t.data.substring(e.length),this.trackProgress(t)}pushNextCharToErrorState(t){if(!this.mSettings.errorType)throw new Wt(`Unable to parse next token. No valid pattern found for "${t.data.substring(0,20)}".`,this,t.cursor.column,t.cursor.line,t.cursor.column,t.cursor.line);t.error||(t.error={data:"",startColumn:t.cursor.column,startLine:t.cursor.line});let e=t.data.charAt(0);t.error.data+=e,this.moveCursor(t,e)}skipNextWhitespace(t){let e=t.data.charAt(0);return!this.mSettings.trimSpaces||!this.mSettings.whiteSpaces.has(e)?!1:(this.moveCursor(t,e),!0)}*tokenizeRecursionLayer(t,e,o,a){let d=e.dependencies;for(;t.data.length>0;){if(!t.error&&this.skipNextWhitespace(t))continue;if(e.isSplit()){let T=this.matchToken(e,e.pattern.end,t,o,a);if(T!==null){yield*this.generateErrorToken(t,o),yield T;return}}let g=this.findNextStartToken(t,d,o,a);if(!g){this.pushNextCharToErrorState(t);continue}yield*this.generateErrorToken(t,o),yield g.token;let y=g.pattern;y.isSplit()&&(y.resolveDependencies(),yield*this.tokenizeRecursionLayer(t,y,[...o,...y.meta],a??y.pattern.innerType))}yield*this.generateErrorToken(t,o)}trackProgress(t){t.progressTracker!==null&&t.progressTracker(t.cursor.position,t.cursor.line,t.cursor.column)}};var Z=class extends Error{static PARSER_ERROR=Symbol("PARSER_ERROR");mTrace;get columnEnd(){return this.mTrace.top.range.columnEnd}get columnStart(){return this.mTrace.top.range.columnStart}get graph(){return this.mTrace.top.graph}get incidents(){return this.mTrace.incidents}get lineEnd(){return this.mTrace.top.range.lineEnd}get lineStart(){return this.mTrace.top.range.lineStart}constructor(t){super(t.top.message,{cause:t.top.cause}),this.mTrace=t}};var Ve=class{mIncidents;mTop;get incidents(){if(this.mIncidents===null)throw new N("A complete incident list is only available on debug mode.",this);return this.mIncidents}get top(){return this.mTop}constructor(t){this.mTop={message:"Unknown parser error",priority:0,graph:null,range:{lineStart:1,columnStart:1,lineEnd:1,columnEnd:1},cause:null},t?this.mIncidents=new Array:this.mIncidents=null}push(t,e,o,a,d,g,y=!1,T=null){let C;if(y?C=this.mTop.priority+1:C=d*1e4+g,this.mIncidents!==null){let c={message:t,priority:C,graph:e,range:{lineStart:o,columnStart:a,lineEnd:d,columnEnd:g},cause:T};this.mIncidents.push(c)}this.mTop&&C<this.mTop.priority||this.setTop({message:t,priority:C,graph:e,range:{lineStart:o,columnStart:a,lineEnd:d,columnEnd:g},cause:T})}setTop(t){this.mTop=t}};var $e=class p{static MAX_JUNCTION_CIRCULAR_REFERENCES=1e3;mGraphStack;mIncidentTrace;mLastTokenPosition;mProcessStack;mTokenCache;mTokenGenerator;mTrimTokenCache;get currentGraph(){return this.mGraphStack.top.graph}get currentToken(){let t=this.mGraphStack.top;return this.mTokenCache[t.token.cursor]}get incidentTrace(){return this.mIncidentTrace}get processStack(){return this.mProcessStack}constructor(t,e,o){this.mTokenGenerator=t,this.mGraphStack=new Ft,this.mLastTokenPosition={column:1,line:1},this.mTokenCache=new Array,this.mProcessStack=new Ft,this.mTrimTokenCache=o,this.mIncidentTrace=new Ve(e),this.mGraphStack.push({graph:null,linear:!0,circularGraphs:new rt,token:{start:0,cursor:-1}})}collapse(){let t=this.mGraphStack.top,e=this.mTokenCache.slice(t.token.cursor);e.length!==0&&e.at(-1)===null&&e.pop();for(let o of this.mTokenGenerator)e.push(o);return e}getGraphBoundingToken(){let t=this.mGraphStack.top,e=this.mTokenCache[t.token.start],o=this.mTokenCache[t.token.cursor-1];return e??=o,o??=e,[e??null,o??null]}getGraphPosition(){let t=this.mGraphStack.top,e,o;if(e=this.mTokenCache[t.token.start],o=this.mTokenCache[t.token.cursor-1],e??=o,o??=e,!e||!o)return{graph:t.graph,columnEnd:this.mLastTokenPosition.column,columnStart:this.mLastTokenPosition.column,lineEnd:this.mLastTokenPosition.line,lineStart:this.mLastTokenPosition.line};let a,d;if(o.value.includes(`
`)){let g=o.value.split(`
`);d=o.lineNumber+g.length-1,a=1+g[g.length-1].length}else a=o.columnNumber+o.value.length,d=o.lineNumber;return{graph:t.graph,lineStart:e.lineNumber,columnStart:e.columnNumber,lineEnd:d,columnEnd:a}}getTokenPosition(){let t=this.mGraphStack.top,e=this.currentToken;if(!e)return{graph:t.graph,columnEnd:this.mLastTokenPosition.column,columnStart:this.mLastTokenPosition.column,lineEnd:this.mLastTokenPosition.line,lineStart:this.mLastTokenPosition.line};let o,a;if(e.value.includes(`
`)){let d=e.value.split(`
`);a=e.lineNumber+d.length-1,o=1+d[d.length-1].length}else o=e.columnNumber+e.value.length,a=e.lineNumber;return{graph:t.graph,lineStart:e.lineNumber,columnStart:e.columnNumber,lineEnd:a,columnEnd:o}}graphIsCircular(t){let e=this.mGraphStack.top;if(!e.circularGraphs.has(t))return!1;if(t.isJunction){if(e.circularGraphs.get(t)>p.MAX_JUNCTION_CIRCULAR_REFERENCES)throw new N("Junction graph called circular too often.",this);return!1}return!0}moveNextToken(){let t=this.mGraphStack.top;if(t.circularGraphs.size>0&&(t.circularGraphs=new rt),t.graph&&t.graph.isJunction)throw new N("Junction graph must not have own nodes.",this);if(t.token.cursor++,t.token.cursor<this.mTokenCache.length)return;let e=this.mTokenGenerator.next();if(e.done){this.mTokenCache.push(null);return}this.mLastTokenPosition.column=e.value.columnNumber,this.mLastTokenPosition.line=e.value.lineNumber,this.mTokenCache.push(e.value)}popGraphStack(t){let e=this.mGraphStack.pop(),o=this.mGraphStack.top;if(t&&(e.token.cursor=e.token.start),e.token.cursor!==e.token.start&&o.circularGraphs.size>0&&(o.circularGraphs=new rt),!this.mTrimTokenCache){o.token.cursor=e.token.cursor;return}e.linear?(this.mTokenCache.splice(0,e.token.cursor),o.token.start=0,o.token.cursor=0):o.token.cursor=e.token.cursor}pushGraphStack(t,e){let o=this.mGraphStack.top,a={graph:t,linear:e&&o.linear,circularGraphs:new rt(o.circularGraphs),token:{start:o.token.cursor,cursor:o.token.cursor}},d=a.circularGraphs.get(t)??0;a.circularGraphs.set(t,d+1),this.mGraphStack.push(a)}};var we=class p{static NODE_NULL_RESULT=Symbol("FAILED_NODE_VALUE_PARSE");static NODE_VALUE_LIST_END_MEET=Symbol("FAILED_NODE_VALUE_PARSE");mConfiguration;mLexer;mRootPart;get lexer(){return this.mLexer}constructor(t,e){this.mLexer=t,this.mRootPart=null,this.mConfiguration={keepTraceIncidents:!1,trimTokenCache:!1,...e}}parse(t,e){if(this.mRootPart===null)throw new N("Parser has not root part set.",this);let o=new $e(this.mLexer.tokenize(t,e),this.mConfiguration.keepTraceIncidents,this.mConfiguration.trimTokenCache),a=(()=>{try{return this.beginParseProcess(o,this.mRootPart)}catch(g){if(g instanceof Wt)return o.incidentTrace.push(g.message,o.currentGraph,g.lineStart,g.columnStart,g.lineEnd,g.columnEnd,!0,g),Z.PARSER_ERROR;let y=g instanceof Error?g.message:g.toString(),T=o.getGraphPosition();return o.incidentTrace.push(y,o.currentGraph,T.lineStart,T.columnStart,T.lineEnd,T.columnEnd,!0,g),Z.PARSER_ERROR}})();if(a===Z.PARSER_ERROR)throw new Z(o.incidentTrace);let d=o.collapse();if(d.length!==0){let g=d[0];if(o.incidentTrace.top.range.lineEnd===1&&o.incidentTrace.top.range.columnEnd===1){let y=`Tokens could not be parsed. Graph end meet without reaching last token. Current: "${g.value}" (${g.type})`;o.incidentTrace.push(y,this.mRootPart,g.lineNumber,g.columnNumber,g.lineNumber,g.columnNumber)}throw new Z(o.incidentTrace)}return a}setRootGraph(t){this.mRootPart=t}beginParseProcess(t,e){t.moveNextToken(),t.processStack.push({type:"graph-parse",parameter:{graph:e,linear:!0},state:0});let o=p.NODE_NULL_RESULT;for(;t.processStack.top;)o=this.processStack(t,t.processStack.top,o);return o}processChainedNodeParseProcess(t,e,o){switch(e.state){case 0:{let g=e.parameter.node.connections.next;return g===null?(t.processStack.pop(),{}):(e.state++,t.processStack.push({type:"node-parse",parameter:{node:g},state:0,values:{}}),p.NODE_NULL_RESULT)}case 1:{let a=o;return a===Z.PARSER_ERROR?(t.processStack.pop(),Z.PARSER_ERROR):(t.processStack.pop(),a)}}throw new N(`Invalid node next parse state "${e.state}".`,this)}processGraphParseProcess(t,e,o){let a=e.parameter.graph;switch(e.state){case 0:{if(t.graphIsCircular(a)){let g=t.getGraphPosition();return t.incidentTrace.push("Circular graph detected.",a,g.lineStart,g.columnStart,g.lineEnd,g.columnEnd),t.processStack.pop(),Z.PARSER_ERROR}let d=e.parameter.linear;return t.pushGraphStack(a,d),e.state++,t.processStack.push({type:"node-parse",parameter:{node:a.node},state:0,values:{}}),p.NODE_NULL_RESULT}case 1:{let d=o;if(d===Z.PARSER_ERROR)return t.popGraphStack(!0),t.processStack.pop(),Z.PARSER_ERROR;let g=a.convert(d,t);if(typeof g=="symbol"){let y=t.getGraphPosition();return t.incidentTrace.push(g.description??"Unknown data convert error",y.graph,y.lineStart,y.columnStart,y.lineEnd,y.columnEnd),t.popGraphStack(!0),t.processStack.pop(),Z.PARSER_ERROR}return t.popGraphStack(!1),t.processStack.pop(),g}}throw new N(`Invalid graph parse state "${e.state}".`,this)}processNodeParseProcess(t,e,o){let a=e.parameter.node;switch(e.state){case 0:return t.processStack.push({type:"node-value-parse",parameter:{node:a,valueIndex:0},state:0,values:{}}),e.state++,p.NODE_NULL_RESULT;case 1:{let d=o;return d===Z.PARSER_ERROR?(t.processStack.pop(),Z.PARSER_ERROR):(e.values.nodeValueResult=d,t.processStack.push({type:"node-next-parse",parameter:{node:a},state:0}),e.state++,p.NODE_NULL_RESULT)}case 2:{let d=o;if(d===Z.PARSER_ERROR)return t.processStack.pop(),Z.PARSER_ERROR;let g=a.mergeData(e.values.nodeValueResult,d);return t.processStack.pop(),g}}throw new N(`Invalid node parse state "${e.state}".`,this)}processNodeValueParseProcess(t,e,o){let a=e.parameter.node;switch(e.state){case 0:{if(o!==p.NODE_NULL_RESULT&&o!==Z.PARSER_ERROR)return e.values.parseResult=o,e.state++,p.NODE_NULL_RESULT;let d=e.parameter.valueIndex,g=a.connections;if(d>=g.values.length)return e.values.parseResult=p.NODE_VALUE_LIST_END_MEET,e.state++,p.NODE_NULL_RESULT;e.parameter.valueIndex++;let y=t.currentToken,T=g.values[d];if(typeof T=="string"){if(!y){if(g.required){let C=t.getTokenPosition();t.incidentTrace.push(`Unexpected end of statement. Token "${T}" expected.`,t.currentGraph,C.lineStart,C.columnStart,C.lineEnd,C.columnEnd)}return p.NODE_NULL_RESULT}if(T!==y.type){if(g.required){let C=t.getTokenPosition();t.incidentTrace.push(`Unexpected token "${y.value}". "${T}" expected`,t.currentGraph,C.lineStart,C.columnStart,C.lineEnd,C.columnEnd)}return p.NODE_NULL_RESULT}return t.moveNextToken(),y.value}else{let C=g.values.length===1||g.values.length===d+1;return t.processStack.push({type:"graph-parse",parameter:{graph:T,linear:C},state:0}),p.NODE_NULL_RESULT}}case 1:{let d=e.values.parseResult,g=a.connections;if(d===p.NODE_VALUE_LIST_END_MEET&&!g.required){t.processStack.pop();return}return d===p.NODE_VALUE_LIST_END_MEET?(t.processStack.pop(),Z.PARSER_ERROR):(t.processStack.pop(),d)}}throw new N(`Invalid node value parse state "${e.state}".`,this)}processStack(t,e,o){switch(e.type){case"graph-parse":return this.processGraphParseProcess(t,e,o);case"node-parse":return this.processNodeParseProcess(t,e,o);case"node-value-parse":return this.processNodeValueParseProcess(t,e,o);case"node-next-parse":return this.processChainedNodeParseProcess(t,e,o)}}};var k=class p{static define(t,e=!1){return new p(t,e)}mDataConverterList;mGraphCollector;mIsJunction;mResolvedGraphNode;get isJunction(){return this.mIsJunction}get node(){return this.mResolvedGraphNode||(this.mResolvedGraphNode=this.mGraphCollector().root),this.mResolvedGraphNode}constructor(t,e){this.mGraphCollector=t,this.mDataConverterList=new Array,this.mResolvedGraphNode=null,this.mIsJunction=e}convert(t,e){if(this.mDataConverterList.length===0)return t;let o=e.getGraphBoundingToken(),a=o[0]??void 0,d=o[1]??void 0;if(this.mDataConverterList.length===1)return this.mDataConverterList[0](t,a,d);let g=t;for(let y of this.mDataConverterList)if(g=y(g,a,d),typeof g=="symbol")return g;return g}converter(t){let e=new p(this.mGraphCollector,this.isJunction);return e.mDataConverterList.push(...this.mDataConverterList,t),e}};var U=class p{static new(){let t=new p("",!1,[]);return t.mRootNode=null,t}mConnections;mIdentifier;mRootNode;get configuration(){return{dataKey:this.mIdentifier.dataKey,isList:this.mIdentifier.type==="list",isRequired:this.mConnections.required,isBranch:this.mConnections.values.length>1}}get connections(){return this.mConnections}get root(){if(!this.mRootNode)throw new N("Staring nodes must be chained with another node to be used.",this);return this.mRootNode}constructor(t,e,o,a){if(t==="")this.mIdentifier={type:"empty",dataKey:"",mergeKey:""};else if(t.endsWith("[]"))this.mIdentifier={type:"list",mergeKey:"",dataKey:t.substring(0,t.length-2)};else if(t.includes("<-")){let g=t.split("<-");this.mIdentifier={type:"merge",dataKey:g[0],mergeKey:g[1]}}else this.mIdentifier={type:"single",mergeKey:"",dataKey:t};let d=o.map(g=>g instanceof p?k.define(()=>g):g);this.mConnections={required:e,values:d,next:null},a?this.mRootNode=a:this.mRootNode=this}mergeData(t,e){if(this.mIdentifier.type==="empty")return e;let o=e,a=typeof t>"u";if(this.mIdentifier.type==="single"){if(this.mIdentifier.dataKey in e)throw new N(`Graph path has a duplicate value identifier "${this.mIdentifier.dataKey}"`,this);return a||(o[this.mIdentifier.dataKey]=t),e}if(this.mIdentifier.type==="list"){let y;a?y=new Array:Array.isArray(t)?y=t:y=[t];let T=(()=>{if(this.mIdentifier.dataKey in e){let C=o[this.mIdentifier.dataKey];return Array.isArray(C)?(C.unshift(...y),C):(y.push(C),y)}return y})();return o[this.mIdentifier.dataKey]=T,e}if(a)return e;let d=(()=>{if(!this.mIdentifier.mergeKey)throw new N("Cant merge data without a merge key.",this);if(typeof t!="object"||t===null)throw new N("Node data must be an object when merge key is set.",this);if(!(this.mIdentifier.mergeKey in t))throw new N(`Node data does not contain merge key "${this.mIdentifier.mergeKey}"`,this);return t[this.mIdentifier.mergeKey]})();if(typeof d>"u")return e;let g=o[this.mIdentifier.dataKey];if(typeof g>"u")return o[this.mIdentifier.dataKey]=d,o;if(!Array.isArray(g))throw new N("Chain data merge value is not an array but should be.",this);return Array.isArray(d)?g.unshift(...d):g.unshift(d),e}optional(t,e){let o=typeof e>"u"?"":t,a=typeof e>"u"?t:e,d=new Array;Array.isArray(a)?d.push(...a):d.push(a);let g=new p(o,!1,d,this.mRootNode);return this.setChainedNode(g),g}required(t,e){let o=typeof e>"u"?"":t,a=typeof e>"u"?t:e,d=new Array;Array.isArray(a)?d.push(...a):d.push(a);let g=new p(o,!0,d,this.mRootNode);return this.setChainedNode(g),g}setChainedNode(t){if(this.mConnections.next!==null)throw new N("Node can only be chained to a single node.",this);this.mConnections.next=t}};var j={XmlIdentifier:"Identifier",XmlAssignment:"XmlAssignment",XmlValue:"XmlValue",XmlComment:"XmlComment",XmlOpenClosingBracket:"XmlOpenClosingBracket",XmlCloseBracket:"XmlCloseBracket",XmlOpenBracket:"XmlOpenBracket",XmlCloseClosingBracket:"XmlCloseClosingBracket",XmlExplicitValueIdentifier:"XmlExplicitValueIdentifier",ExpressionStart:"ExpressionStart",ExpressionEnd:"ExpressionEnd",ExpressionValue:"ExpressionValue",InstructionStart:"InstructionStart",InstructionInstructionValue:"InstructionInstructionValue",InstructionBodyStartBraket:"InstructionBodyStartBraket",InstructionBodyCloseBraket:"InstructionBodyCloseBraket",InstructionInstructionClosingBracket:"InstructionInstructionClosingBracket",InstructionInstructionOpeningBracket:"InstructionInstructionOpeningBracket"};var Ge=class extends be{constructor(){super(),this.validWhitespaces=` 
\r`,this.trimWhitespace=!0;let t=this.createTokenPattern({pattern:{regex:/(?:(?!}}).)*/,type:j.ExpressionValue}}),e=this.createTokenPattern({pattern:{start:{regex:/{{/,type:j.ExpressionStart},end:{regex:/}}[ \n\r]?/,type:j.ExpressionEnd}}},s=>{s.useChildPattern(t)}),o=this.createTokenPattern({pattern:{regex:/[^>\s\n="/]+/,type:j.XmlIdentifier}}),a=this.createTokenPattern({pattern:{regex:/(?:(?!{{|"|<).)+/,type:j.XmlValue}}),d=this.createTokenPattern({pattern:{regex:/<!--.*?-->/,type:j.XmlComment}}),g=this.createTokenPattern({pattern:{regex:/=/,type:j.XmlAssignment}}),y=this.createTokenPattern({pattern:{start:{regex:/"/,type:j.XmlExplicitValueIdentifier},end:{regex:/"/,type:j.XmlExplicitValueIdentifier}}},s=>{s.useChildPattern(e),s.useChildPattern(a)}),T=this.createTokenPattern({pattern:{start:{regex:/<\//,type:j.XmlOpenClosingBracket},end:{regex:/>/,type:j.XmlCloseBracket}}},s=>{s.useChildPattern(o)}),C=this.createTokenPattern({pattern:{start:{regex:/</,type:j.XmlOpenBracket},end:{regex:/(?<closeClosingBracket>\/>)|(?<closeBracket>>)/,type:{closeClosingBracket:j.XmlCloseClosingBracket,closeBracket:j.XmlCloseBracket}}}},s=>{s.useChildPattern(g),s.useChildPattern(o),s.useChildPattern(y)}),c=this.createTokenPattern({pattern:{regex:/[^()"'`/)]+/,type:j.InstructionInstructionValue}}),n=this.createTokenPattern({pattern:{innerType:j.InstructionInstructionValue,start:{regex:/\//,type:j.InstructionInstructionValue},end:{regex:/\//,type:j.InstructionInstructionValue}}},s=>{s.useChildPattern(l),s.useChildPattern(r),s.useChildPattern(b),s.useChildPattern(u),s.useChildPattern(c)}),u=this.createTokenPattern({pattern:{innerType:j.InstructionInstructionValue,start:{regex:/\(/,type:j.InstructionInstructionValue},end:{regex:/\)/,type:j.InstructionInstructionValue}}},s=>{s.useChildPattern(n),s.useChildPattern(l),s.useChildPattern(r),s.useChildPattern(b),s.useChildPattern(c)}),l=this.createTokenPattern({pattern:{innerType:j.InstructionInstructionValue,start:{regex:/"/,type:j.InstructionInstructionValue},end:{regex:/"/,type:j.InstructionInstructionValue}}},s=>{s.useChildPattern(n),s.useChildPattern(r),s.useChildPattern(b),s.useChildPattern(u),s.useChildPattern(c)}),r=this.createTokenPattern({pattern:{innerType:j.InstructionInstructionValue,start:{regex:/'/,type:j.InstructionInstructionValue},end:{regex:/'/,type:j.InstructionInstructionValue}}},s=>{s.useChildPattern(n),s.useChildPattern(l),s.useChildPattern(b),s.useChildPattern(u),s.useChildPattern(c)}),b=this.createTokenPattern({pattern:{innerType:j.InstructionInstructionValue,start:{regex:/`/,type:j.InstructionInstructionValue},end:{regex:/`/,type:j.InstructionInstructionValue}}},s=>{s.useChildPattern(n),s.useChildPattern(l),s.useChildPattern(r),s.useChildPattern(u),s.useChildPattern(c)}),v=this.createTokenPattern({pattern:{regex:/\$[^(\s\n/{]+/,type:j.InstructionStart}}),E=this.createTokenPattern({pattern:{start:{regex:/\(/,type:j.InstructionInstructionOpeningBracket},end:{regex:/\)/,type:j.InstructionInstructionClosingBracket}}},s=>{s.useChildPattern(n),s.useChildPattern(l),s.useChildPattern(r),s.useChildPattern(b),s.useChildPattern(u),s.useChildPattern(c)}),w=this.createTokenPattern({pattern:{start:{regex:/{/,type:j.InstructionBodyStartBraket},end:{regex:/}/,type:j.InstructionBodyCloseBraket}}},s=>{for(let m of f)s.useChildPattern(m)}),f=[d,T,C,y,e,v,E,w,a];for(let s of f)this.useRootTokenPattern(s)}};var xe=class extends we{constructor(){super(new Ge),this.initGraph()}initGraph(){let t=k.define(()=>U.new().required(j.ExpressionStart).optional("value",j.ExpressionValue).required("end",j.ExpressionEnd)).converter(r=>({expression:new Nt(r.value??""),hasTrailingWhitespace:r.end.length>2})),e=k.define(()=>{let r=e;return U.new().required("data[]",U.new().required("value",[t,U.new().required("text",j.XmlValue)])).optional("data<-data",r)}),o=k.define(()=>U.new().required("name",j.XmlIdentifier).optional("attributeValue",U.new().required(j.XmlAssignment).required(j.XmlExplicitValueIdentifier).optional("list<-data",e).required(j.XmlExplicitValueIdentifier))).converter(r=>{let b=new Array;if(r.attributeValue?.list)for(let v of r.attributeValue.list)"expression"in v.value?(b.push(v.value.expression),v.value.hasTrailingWhitespace&&b.push(" ")):b.push(v.value.text);return{name:r.name,values:b}}),a=k.define(()=>{let r=a;return U.new().required("data[]",o).optional("data<-data",r)}),d=k.define(()=>{let r=d;return U.new().required("data[]",U.new().required("value",[t,U.new().required("text",j.XmlValue),U.new().required(j.XmlExplicitValueIdentifier).required("text",j.XmlValue).required(j.XmlExplicitValueIdentifier)])).optional("data<-data",r)}),g=k.define(()=>U.new().required("list<-data",d)).converter(r=>{let b=new Lt;for(let v of r.list)"expression"in v.value?(b.addValue(v.value.expression),v.value.hasTrailingWhitespace&&b.addValue(" ")):b.addValue(v.value.text);return b}),y=k.define(()=>U.new().required(j.XmlComment)).converter(()=>null),T=k.define(()=>U.new().required(j.XmlOpenBracket).required("openingTagName",j.XmlIdentifier).optional("attributes<-data",a).required("closing",[U.new().required(j.XmlCloseClosingBracket),U.new().required(j.XmlCloseBracket).required("values",u).required(j.XmlOpenClosingBracket).required("closingTageName",j.XmlIdentifier).required(j.XmlCloseBracket)])).converter(r=>{if("closingTageName"in r.closing&&r.openingTagName!==r.closing.closingTageName)throw new N(`Opening (${r.openingTagName}) and closing tagname (${r.closing.closingTageName}) does not match`,this);let b=new _t(r.openingTagName);if(r.attributes)for(let v of r.attributes)b.setAttribute(v.name).addValue(...v.values);return"values"in r.closing&&b.appendChild(...r.closing.values),b}),C=k.define(()=>{let r=C;return U.new().required("list[]",j.InstructionInstructionValue).optional("list<-list",r)}),c=k.define(()=>U.new().required("instructionName",j.InstructionStart).optional("instruction",U.new().required(j.InstructionInstructionOpeningBracket).required("value<-list",C).required(j.InstructionInstructionClosingBracket)).optional("body",U.new().required(j.InstructionBodyStartBraket).required("value",u).required(j.InstructionBodyCloseBraket))).converter(r=>{let b=r.instructionName.substring(1),v=r.instruction?.value.join("")??"",E=new Yt(b,v);return r.body&&E.appendChild(...r.body.value),E}),n=k.define(()=>{let r=n;return U.new().required("list[]",[y,T,c,g]).optional("list<-list",r)}),u=k.define(()=>{let r=n;return U.new().optional("list<-list",r)}).converter(r=>{let b=new Array;if(r.list)for(let v of r.list)v!==null&&b.push(v);return b}),l=k.define(()=>U.new().required("content",u)).converter(r=>{let b=new lt;return b.appendChild(...r.content),b});this.setRootGraph(l)}};var G=class p extends Re{static mTemplateCache=new rt;static mXmlParser=new xe;mComponentElement;mIsUpdated;mRootBuilder;get element(){return this.mComponentElement.htmlElement}constructor(t){super({constructor:t.processorConstructor,parent:null}),J.registerComponent(this,t.htmlElement),this.setProcessorInjection(p,this),this.addConstructionHook(a=>{J.registerComponent(this,this.mComponentElement.htmlElement,a)}),p.mTemplateCache.has(t.processorConstructor)||p.mTemplateCache.set(t.processorConstructor,p.mXmlParser.parse(t.templateString??""));let e=p.mTemplateCache.get(t.processorConstructor).clone();this.mIsUpdated=!1,this.mComponentElement=new ye(t.htmlElement),this.mRootBuilder=new te(e,new ze(this,t.expressionModule),new ht(this),"ROOT"),this.mComponentElement.shadowRoot.appendChild(this.mRootBuilder.anchor),this.setProcessorInjection(It,new It(this.mRootBuilder.values));let o=this.updater.zone.getAttachment(Dt.ATTACHMENT_KEY);if(o)for(let[a,d]of o.injections)this.setProcessorInjection(a,d)}addStyle(t){let e=document.createElement("style");e.innerHTML=t,this.mComponentElement.shadowRoot.prepend(e)}attributeChanged(t,e,o){this.call("onAttributeChange",t,e,o)}connected(){this.mIsUpdated||this.updater.update(),this.call("onConnect")}deconstruct(){this.call("onDeconstruct"),this.mRootBuilder.deconstruct(),super.deconstruct()}disconnected(){this.call("onDisconnect")}onUpdate(){return this.mIsUpdated||(this.mIsUpdated=!0),this.mRootBuilder.update()?(this.call("onUpdate"),!0):!1}};function Y(p){return(t,e)=>{R.registerInjectable(t,e.metadata,"instanced"),J.registerConstructor(t,p.selector);let o=class extends HTMLElement{mComponent;constructor(){super(),this.mComponent=new G({processorConstructor:t,templateString:p.template??null,expressionModule:p.expressionmodule,htmlElement:this}).setup(),p.style&&this.mComponent.addStyle(p.style)}connectedCallback(){this.mComponent.connected()}disconnectedCallback(){this.mComponent.disconnected()}};globalThis.customElements.define(p.selector,o)}}function Zt(p){return(t,e)=>{R.registerInjectable(t,e.metadata,"instanced"),at.register(Vt,t,{access:p.access,targetRestrictions:p.targetRestrictions})}}function vt(p){return(t,e)=>{R.registerInjectable(t,e.metadata,"instanced"),at.register(gt,t,{access:p.access,selector:p.selector})}}function Rt(p){return(t,e)=>{R.registerInjectable(t,e.metadata,"instanced"),at.register(Ut,t,{instructionType:p.instructionType})}}function rs(){function p(c,n){return function(l){e(n,"addInitializer"),o(l,"An initializer"),c.push(l)}}function t(c,n,u,l,r,b,v,E,w){var f;switch(r){case 1:f="accessor";break;case 2:f="method";break;case 3:f="getter";break;case 4:f="setter";break;default:f="field"}var s={kind:f,name:v?"#"+n:n,static:b,private:v,metadata:E},m={v:!1};s.addInitializer=p(l,m);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return c(w,s)}finally{m.v=!0}}function e(c,n){if(c.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(c,n){if(typeof c!="function")throw new TypeError(n+" must be a function")}function a(c,n){var u=typeof n;if(c===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var l;throw c===0?l="field":c===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function d(c,n,u,l,r,b,v,E,w){var f=u[0],s,m,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,P;if(typeof f=="function")h=t(f,l,s,E,r,b,v,w,i),h!==void 0&&(a(r,h),r===0?m=h:r===1?(m=h.init,x=h.get||i.get,P=h.set||i.set,i={get:x,set:P}):i=h);else for(var M=f.length-1;M>=0;M--){var S=f[M];if(h=t(S,l,s,E,r,b,v,w,i),h!==void 0){a(r,h);var A;r===0?A=h:r===1?(A=h.init,x=h.get||i.get,P=h.set||i.set,i={get:x,set:P}):i=h,A!==void 0&&(m===void 0?m=A:typeof m=="function"?m=[m,A]:m.push(A))}}if(r===0||r===1){if(m===void 0)m=function(I,D){return D};else if(typeof m!="function"){var F=m;m=function(I,D){for(var L=D,_=0;_<F.length;_++)L=F[_].call(I,L);return L}}else{var z=m;m=function(I,D){return z.call(I,D)}}c.push(m)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(c.push(function(I,D){return i.get.call(I,D)}),c.push(function(I,D){return i.set.call(I,D)})):r===2?c.push(i):c.push(function(I,D){return i.call(I,D)}):Object.defineProperty(n,l,s))}function g(c,n,u){for(var l=[],r,b,v=new Map,E=new Map,w=0;w<n.length;w++){var f=n[w];if(Array.isArray(f)){var s=f[1],m=f[2],i=f.length>3,h=s>=5,x,P;if(h?(x=c,s=s-5,b=b||[],P=b):(x=c.prototype,r=r||[],P=r),s!==0&&!i){var M=h?E:v,S=M.get(m)||0;if(S===!0||S===3&&s!==4||S===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+m);!S&&s>2?M.set(m,s):M.set(m,!0)}d(l,x,f,m,s,h,i,P,u)}}return y(l,r),y(l,b),l}function y(c,n){n&&c.push(function(u){for(var l=0;l<n.length;l++)n[l].call(u);return u})}function T(c,n,u){if(n.length>0){for(var l=[],r=c,b=c.name,v=n.length-1;v>=0;v--){var E={v:!1};try{var w=n[v](r,{kind:"class",name:b,addInitializer:p(l,E),metadata:u})}finally{E.v=!0}w!==void 0&&(a(10,w),r=w)}return[C(r,u),function(){for(var f=0;f<l.length;f++)l[f].call(r)}]}}function C(c,n){return Object.defineProperty(c,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,l,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),E=g(n,u,v);return l.length||C(n,v),{e:E,get c(){return T(n,l,v)}}}}function Lr(p,t,e,o){return(Lr=rs())(p,t,e,o)}function os(p){return p}var _r,Nr,Te;_r=Zt({access:W.Read,targetRestrictions:[G]});new class extends os{constructor(){super(Te),Nr()}static{class p{static{({c:[Te,Nr]}=Lr(this,[],[_r]))}static METADATA_USER_EVENT_LISTENER_PROPERIES="pwb:user_event_listener_properties";mEventListenerList;mTargetElement;constructor(e=R.use(G)){let o=new Array,a=e.processorConstructor;do{let d=nt.get(a).getMetadata(p.METADATA_USER_EVENT_LISTENER_PROPERIES);if(d)for(let g of d)o.push(g)}while(a=Object.getPrototypeOf(a));this.mEventListenerList=new Array,this.mTargetElement=e.element;for(let d of o){let[g,y]=d,T=Reflect.get(e.processor,g);T=T.bind(e.processor),this.mEventListenerList.push([y,T]),this.mTargetElement.addEventListener(y,T)}}onDeconstruct(){for(let e of this.mEventListenerList){let[o,a]=e;this.mTargetElement.removeEventListener(o,a)}}}}};var Ee=class extends window.Event{mValue;get value(){return this.mValue}constructor(t,e){super(t),this.mValue=e}};var De=class{mElement;mEventName;constructor(t,e){this.mEventName=t,this.mElement=e}dispatchEvent(t){let e=new Ee(this.mEventName,t);this.mElement.dispatchEvent(e)}};function yt(p){return(t,e)=>{if(e.static)throw new N("Event target is not for a static property.",yt);let o=new WeakMap;return{get(){if(!o.has(this)){let a=(()=>{try{return J.ofProcessor(this).component}catch{throw new N("PwbComponentEvent target class is not a component.",this)}})();o.set(this,new De(p,a.element))}return o.get(this)}}}}function ns(){function p(c,n){return function(l){e(n,"addInitializer"),o(l,"An initializer"),c.push(l)}}function t(c,n,u,l,r,b,v,E,w){var f;switch(r){case 1:f="accessor";break;case 2:f="method";break;case 3:f="getter";break;case 4:f="setter";break;default:f="field"}var s={kind:f,name:v?"#"+n:n,static:b,private:v,metadata:E},m={v:!1};s.addInitializer=p(l,m);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return c(w,s)}finally{m.v=!0}}function e(c,n){if(c.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(c,n){if(typeof c!="function")throw new TypeError(n+" must be a function")}function a(c,n){var u=typeof n;if(c===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var l;throw c===0?l="field":c===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function d(c,n,u,l,r,b,v,E,w){var f=u[0],s,m,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,P;if(typeof f=="function")h=t(f,l,s,E,r,b,v,w,i),h!==void 0&&(a(r,h),r===0?m=h:r===1?(m=h.init,x=h.get||i.get,P=h.set||i.set,i={get:x,set:P}):i=h);else for(var M=f.length-1;M>=0;M--){var S=f[M];if(h=t(S,l,s,E,r,b,v,w,i),h!==void 0){a(r,h);var A;r===0?A=h:r===1?(A=h.init,x=h.get||i.get,P=h.set||i.set,i={get:x,set:P}):i=h,A!==void 0&&(m===void 0?m=A:typeof m=="function"?m=[m,A]:m.push(A))}}if(r===0||r===1){if(m===void 0)m=function(I,D){return D};else if(typeof m!="function"){var F=m;m=function(I,D){for(var L=D,_=0;_<F.length;_++)L=F[_].call(I,L);return L}}else{var z=m;m=function(I,D){return z.call(I,D)}}c.push(m)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(c.push(function(I,D){return i.get.call(I,D)}),c.push(function(I,D){return i.set.call(I,D)})):r===2?c.push(i):c.push(function(I,D){return i.call(I,D)}):Object.defineProperty(n,l,s))}function g(c,n,u){for(var l=[],r,b,v=new Map,E=new Map,w=0;w<n.length;w++){var f=n[w];if(Array.isArray(f)){var s=f[1],m=f[2],i=f.length>3,h=s>=5,x,P;if(h?(x=c,s=s-5,b=b||[],P=b):(x=c.prototype,r=r||[],P=r),s!==0&&!i){var M=h?E:v,S=M.get(m)||0;if(S===!0||S===3&&s!==4||S===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+m);!S&&s>2?M.set(m,s):M.set(m,!0)}d(l,x,f,m,s,h,i,P,u)}}return y(l,r),y(l,b),l}function y(c,n){n&&c.push(function(u){for(var l=0;l<n.length;l++)n[l].call(u);return u})}function T(c,n,u){if(n.length>0){for(var l=[],r=c,b=c.name,v=n.length-1;v>=0;v--){var E={v:!1};try{var w=n[v](r,{kind:"class",name:b,addInitializer:p(l,E),metadata:u})}finally{E.v=!0}w!==void 0&&(a(10,w),r=w)}return[C(r,u),function(){for(var f=0;f<l.length;f++)l[f].call(r)}]}}function C(c,n){return Object.defineProperty(c,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,l,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),E=g(n,u,v);return l.length||C(n,v),{e:E,get c(){return T(n,l,v)}}}}function Or(p,t,e,o){return(Or=ns())(p,t,e,o)}function is(p){return p}var Fr,Rr,Ie;Fr=Zt({access:W.ReadWrite,targetRestrictions:[G]});new class extends is{constructor(){super(Ie),Rr()}static{class p{static{({c:[Ie,Rr]}=Or(this,[],[Fr]))}static METADATA_EXPORTED_PROPERTIES="pwb:exported_properties";mComponent;constructor(e=R.use(G)){this.mComponent=e;let o=new Ht,a=e.processorConstructor;do{let g=nt.get(a).getMetadata(p.METADATA_EXPORTED_PROPERTIES);g&&o.push(...g)}while(a=Object.getPrototypeOf(a));let d=new Set(o);d.size>0&&this.connectExportedProperties(d)}connectExportedProperties(e){this.exportPropertyAsAttribute(e),this.patchHtmlAttributes(e)}exportPropertyAsAttribute(e){for(let o of e){let a={};a.enumerable=!0,a.configurable=!0,delete a.value,delete a.writable,a.set=d=>{Reflect.set(this.mComponent.processor,o,d)},a.get=()=>{let d=Reflect.get(this.mComponent.processor,o);return typeof d=="function"&&(d=d.bind(this.mComponent.processor)),d},Object.defineProperty(this.mComponent.element,o,a)}}patchHtmlAttributes(e){let o=this.mComponent.element.getAttribute;new MutationObserver(d=>{for(let g of d){let y=g.attributeName,T=o.call(this.mComponent.element,y);Reflect.set(this.mComponent.element,y,T),this.mComponent.attributeChanged(y,g.oldValue,T)}}).observe(this.mComponent.element,{attributeFilter:[...e],attributeOldValue:!0});for(let d of e)if(this.mComponent.element.hasAttribute(d)){let g=o.call(this.mComponent.element,d);this.mComponent.element.setAttribute(d,g)}this.mComponent.element.getAttribute=d=>e.has(d)?Reflect.get(this.mComponent.element,d):o.call(this.mComponent.element,d)}}}};function tt(p,t){if(t.static)throw new N("Event target is not for a static property.",tt);let e=nt.forInternalDecorator(t.metadata),o=e.getMetadata(Ie.METADATA_EXPORTED_PROPERTIES)??new Array;o.push(t.name),e.setMetadata(Ie.METADATA_EXPORTED_PROPERTIES,o)}function bt(p){return(t,e)=>{if(e.static)throw new N("Child decorator is not for a static property.",bt);return{get(){let d=(()=>{try{return J.ofProcessor(this).component}catch{throw new N("PwbChild target class is not a component.",this)}})().getProcessorInjection(It).data.store[p];return d instanceof Element?d:null}}}}function ss(){function p(c,n){return function(l){e(n,"addInitializer"),o(l,"An initializer"),c.push(l)}}function t(c,n,u,l,r,b,v,E,w){var f;switch(r){case 1:f="accessor";break;case 2:f="method";break;case 3:f="getter";break;case 4:f="setter";break;default:f="field"}var s={kind:f,name:v?"#"+n:n,static:b,private:v,metadata:E},m={v:!1};s.addInitializer=p(l,m);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return c(w,s)}finally{m.v=!0}}function e(c,n){if(c.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(c,n){if(typeof c!="function")throw new TypeError(n+" must be a function")}function a(c,n){var u=typeof n;if(c===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var l;throw c===0?l="field":c===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function d(c,n,u,l,r,b,v,E,w){var f=u[0],s,m,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,P;if(typeof f=="function")h=t(f,l,s,E,r,b,v,w,i),h!==void 0&&(a(r,h),r===0?m=h:r===1?(m=h.init,x=h.get||i.get,P=h.set||i.set,i={get:x,set:P}):i=h);else for(var M=f.length-1;M>=0;M--){var S=f[M];if(h=t(S,l,s,E,r,b,v,w,i),h!==void 0){a(r,h);var A;r===0?A=h:r===1?(A=h.init,x=h.get||i.get,P=h.set||i.set,i={get:x,set:P}):i=h,A!==void 0&&(m===void 0?m=A:typeof m=="function"?m=[m,A]:m.push(A))}}if(r===0||r===1){if(m===void 0)m=function(I,D){return D};else if(typeof m!="function"){var F=m;m=function(I,D){for(var L=D,_=0;_<F.length;_++)L=F[_].call(I,L);return L}}else{var z=m;m=function(I,D){return z.call(I,D)}}c.push(m)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(c.push(function(I,D){return i.get.call(I,D)}),c.push(function(I,D){return i.set.call(I,D)})):r===2?c.push(i):c.push(function(I,D){return i.call(I,D)}):Object.defineProperty(n,l,s))}function g(c,n,u){for(var l=[],r,b,v=new Map,E=new Map,w=0;w<n.length;w++){var f=n[w];if(Array.isArray(f)){var s=f[1],m=f[2],i=f.length>3,h=s>=5,x,P;if(h?(x=c,s=s-5,b=b||[],P=b):(x=c.prototype,r=r||[],P=r),s!==0&&!i){var M=h?E:v,S=M.get(m)||0;if(S===!0||S===3&&s!==4||S===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+m);!S&&s>2?M.set(m,s):M.set(m,!0)}d(l,x,f,m,s,h,i,P,u)}}return y(l,r),y(l,b),l}function y(c,n){n&&c.push(function(u){for(var l=0;l<n.length;l++)n[l].call(u);return u})}function T(c,n,u){if(n.length>0){for(var l=[],r=c,b=c.name,v=n.length-1;v>=0;v--){var E={v:!1};try{var w=n[v](r,{kind:"class",name:b,addInitializer:p(l,E),metadata:u})}finally{E.v=!0}w!==void 0&&(a(10,w),r=w)}return[C(r,u),function(){for(var f=0;f<l.length;f++)l[f].call(r)}]}}function C(c,n){return Object.defineProperty(c,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,l,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),E=g(n,u,v);return l.length||C(n,v),{e:E,get c(){return T(n,l,v)}}}}function Vr(p,t,e,o){return(Vr=ss())(p,t,e,o)}var $r,jr,as;$r=Rt({instructionType:"dynamic-content"});var zr=class{static{({c:[as,jr]}=Vr(this,[],[$r]))}constructor(t=R.use(et),e=R.use(H)){this.mModuleValues=e,this.mLastTemplate=null,this.mProcedure=this.mModuleValues.createExpressionProcedure(t.value)}mLastTemplate;mModuleValues;mProcedure;onUpdate(){let t=this.mProcedure.execute();if(!t||!(t instanceof lt))throw new N("Dynamic content method has a wrong result type.",this);if(this.mLastTemplate!==null&&this.mLastTemplate.equals(t))return null;let e=t.clone();this.mLastTemplate=e;let o=new ct;return o.addElement(e,new ht(this.mModuleValues.data)),o}static{jr()}};function ls(){function p(c,n){return function(l){e(n,"addInitializer"),o(l,"An initializer"),c.push(l)}}function t(c,n,u,l,r,b,v,E,w){var f;switch(r){case 1:f="accessor";break;case 2:f="method";break;case 3:f="getter";break;case 4:f="setter";break;default:f="field"}var s={kind:f,name:v?"#"+n:n,static:b,private:v,metadata:E},m={v:!1};s.addInitializer=p(l,m);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return c(w,s)}finally{m.v=!0}}function e(c,n){if(c.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(c,n){if(typeof c!="function")throw new TypeError(n+" must be a function")}function a(c,n){var u=typeof n;if(c===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var l;throw c===0?l="field":c===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function d(c,n,u,l,r,b,v,E,w){var f=u[0],s,m,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,P;if(typeof f=="function")h=t(f,l,s,E,r,b,v,w,i),h!==void 0&&(a(r,h),r===0?m=h:r===1?(m=h.init,x=h.get||i.get,P=h.set||i.set,i={get:x,set:P}):i=h);else for(var M=f.length-1;M>=0;M--){var S=f[M];if(h=t(S,l,s,E,r,b,v,w,i),h!==void 0){a(r,h);var A;r===0?A=h:r===1?(A=h.init,x=h.get||i.get,P=h.set||i.set,i={get:x,set:P}):i=h,A!==void 0&&(m===void 0?m=A:typeof m=="function"?m=[m,A]:m.push(A))}}if(r===0||r===1){if(m===void 0)m=function(I,D){return D};else if(typeof m!="function"){var F=m;m=function(I,D){for(var L=D,_=0;_<F.length;_++)L=F[_].call(I,L);return L}}else{var z=m;m=function(I,D){return z.call(I,D)}}c.push(m)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(c.push(function(I,D){return i.get.call(I,D)}),c.push(function(I,D){return i.set.call(I,D)})):r===2?c.push(i):c.push(function(I,D){return i.call(I,D)}):Object.defineProperty(n,l,s))}function g(c,n,u){for(var l=[],r,b,v=new Map,E=new Map,w=0;w<n.length;w++){var f=n[w];if(Array.isArray(f)){var s=f[1],m=f[2],i=f.length>3,h=s>=5,x,P;if(h?(x=c,s=s-5,b=b||[],P=b):(x=c.prototype,r=r||[],P=r),s!==0&&!i){var M=h?E:v,S=M.get(m)||0;if(S===!0||S===3&&s!==4||S===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+m);!S&&s>2?M.set(m,s):M.set(m,!0)}d(l,x,f,m,s,h,i,P,u)}}return y(l,r),y(l,b),l}function y(c,n){n&&c.push(function(u){for(var l=0;l<n.length;l++)n[l].call(u);return u})}function T(c,n,u){if(n.length>0){for(var l=[],r=c,b=c.name,v=n.length-1;v>=0;v--){var E={v:!1};try{var w=n[v](r,{kind:"class",name:b,addInitializer:p(l,E),metadata:u})}finally{E.v=!0}w!==void 0&&(a(10,w),r=w)}return[C(r,u),function(){for(var f=0;f<l.length;f++)l[f].call(r)}]}}function C(c,n){return Object.defineProperty(c,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,l,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),E=g(n,u,v);return l.length||C(n,v),{e:E,get c(){return T(n,l,v)}}}}function Ur(p,t,e,o){return(Ur=ls())(p,t,e,o)}var Hr,Gr,cs;Hr=vt({access:W.Write,selector:/^\([[\w\-$]+\)$/});var Br=class{static{({c:[cs,Gr]}=Ur(this,[],[Hr]))}constructor(t=R.use(Q),e=R.use(H),o=R.use(ot)){this.mTarget=t,this.mEventName=o.name.substring(1,o.name.length-1);let a=e.createExpressionProcedure(o.value,["$event"]);this.mListener=d=>{a.setTemporaryValue("$event",d),a.execute()},this.mTarget.addEventListener(this.mEventName,this.mListener)}mEventName;mListener;mTarget;onDeconstruct(){this.mTarget.removeEventListener(this.mEventName,this.mListener)}static{Gr()}};function us(){function p(c,n){return function(l){e(n,"addInitializer"),o(l,"An initializer"),c.push(l)}}function t(c,n,u,l,r,b,v,E,w){var f;switch(r){case 1:f="accessor";break;case 2:f="method";break;case 3:f="getter";break;case 4:f="setter";break;default:f="field"}var s={kind:f,name:v?"#"+n:n,static:b,private:v,metadata:E},m={v:!1};s.addInitializer=p(l,m);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return c(w,s)}finally{m.v=!0}}function e(c,n){if(c.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(c,n){if(typeof c!="function")throw new TypeError(n+" must be a function")}function a(c,n){var u=typeof n;if(c===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var l;throw c===0?l="field":c===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function d(c,n,u,l,r,b,v,E,w){var f=u[0],s,m,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,P;if(typeof f=="function")h=t(f,l,s,E,r,b,v,w,i),h!==void 0&&(a(r,h),r===0?m=h:r===1?(m=h.init,x=h.get||i.get,P=h.set||i.set,i={get:x,set:P}):i=h);else for(var M=f.length-1;M>=0;M--){var S=f[M];if(h=t(S,l,s,E,r,b,v,w,i),h!==void 0){a(r,h);var A;r===0?A=h:r===1?(A=h.init,x=h.get||i.get,P=h.set||i.set,i={get:x,set:P}):i=h,A!==void 0&&(m===void 0?m=A:typeof m=="function"?m=[m,A]:m.push(A))}}if(r===0||r===1){if(m===void 0)m=function(I,D){return D};else if(typeof m!="function"){var F=m;m=function(I,D){for(var L=D,_=0;_<F.length;_++)L=F[_].call(I,L);return L}}else{var z=m;m=function(I,D){return z.call(I,D)}}c.push(m)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(c.push(function(I,D){return i.get.call(I,D)}),c.push(function(I,D){return i.set.call(I,D)})):r===2?c.push(i):c.push(function(I,D){return i.call(I,D)}):Object.defineProperty(n,l,s))}function g(c,n,u){for(var l=[],r,b,v=new Map,E=new Map,w=0;w<n.length;w++){var f=n[w];if(Array.isArray(f)){var s=f[1],m=f[2],i=f.length>3,h=s>=5,x,P;if(h?(x=c,s=s-5,b=b||[],P=b):(x=c.prototype,r=r||[],P=r),s!==0&&!i){var M=h?E:v,S=M.get(m)||0;if(S===!0||S===3&&s!==4||S===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+m);!S&&s>2?M.set(m,s):M.set(m,!0)}d(l,x,f,m,s,h,i,P,u)}}return y(l,r),y(l,b),l}function y(c,n){n&&c.push(function(u){for(var l=0;l<n.length;l++)n[l].call(u);return u})}function T(c,n,u){if(n.length>0){for(var l=[],r=c,b=c.name,v=n.length-1;v>=0;v--){var E={v:!1};try{var w=n[v](r,{kind:"class",name:b,addInitializer:p(l,E),metadata:u})}finally{E.v=!0}w!==void 0&&(a(10,w),r=w)}return[C(r,u),function(){for(var f=0;f<l.length;f++)l[f].call(r)}]}}function C(c,n){return Object.defineProperty(c,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,l,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),E=g(n,u,v);return l.length||C(n,v),{e:E,get c(){return T(n,l,v)}}}}function Wr(p,t,e,o){return(Wr=us())(p,t,e,o)}var Zr,Xr,hs;Zr=Rt({instructionType:"for"});var Yr=class{static{({c:[hs,Xr]}=Wr(this,[],[Zr]))}constructor(t=R.use(mt),e=R.use(H),o=R.use(et)){this.mTemplate=t,this.mModuleValues=e,this.mLastEntries=new Array;let a=o.value,g=new RegExp(/^\s*([a-zA-Z]+[a-zA-Z0-9]*)\s*of\s+([^;]+)\s*(;\s*([a-zA-Z]+[a-zA-Z0-9]*)\s*=\s*(.*)\s*)?$/).exec(a);if(!g)throw new N(`For-Parameter value has wrong format: ${a}`,this);let y=g[1],T=g[2],C=g[4]??null,c=g[5],n=this.mModuleValues.createExpressionProcedure(T),u=C?this.mModuleValues.createExpressionProcedure(c,["$index",y]):null;this.mExpression={iterateVariableName:y,iterateValueProcedure:n,indexExportVariableName:C,indexExportProcedure:u}}mExpression;mLastEntries;mModuleValues;mTemplate;onUpdate(){let t=new ct,e=this.mExpression.iterateValueProcedure.execute();if(typeof e=="object"&&e!==null||Array.isArray(e)){let o=Symbol.iterator in e?Object.entries([...e]):Object.entries(e);if(this.compareEntries(o,this.mLastEntries))return null;this.mLastEntries=o;for(let[a,d]of o)this.addTemplateForElement(t,this.mExpression,d,a);return t}else return null}addTemplateForElement=(t,e,o,a)=>{let d=new ht(this.mModuleValues.data);if(d.setTemporaryValue(e.iterateVariableName,o),e.indexExportProcedure&&e.indexExportVariableName){e.indexExportProcedure.setTemporaryValue("$index",a),e.indexExportProcedure.setTemporaryValue(e.iterateVariableName,o);let y=e.indexExportProcedure.execute();d.setTemporaryValue(e.indexExportVariableName,y)}let g=new lt;g.appendChild(...this.mTemplate.childList),t.addElement(g,d)};compareEntries(t,e){if(t.length!==e.length)return!1;for(let o=0;o<t.length;o++){let[a,d]=t[o],[g,y]=e[o];if(a!==g||d!==y)return!1}return!0}static{Xr()}};function ms(){function p(c,n){return function(l){e(n,"addInitializer"),o(l,"An initializer"),c.push(l)}}function t(c,n,u,l,r,b,v,E,w){var f;switch(r){case 1:f="accessor";break;case 2:f="method";break;case 3:f="getter";break;case 4:f="setter";break;default:f="field"}var s={kind:f,name:v?"#"+n:n,static:b,private:v,metadata:E},m={v:!1};s.addInitializer=p(l,m);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return c(w,s)}finally{m.v=!0}}function e(c,n){if(c.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(c,n){if(typeof c!="function")throw new TypeError(n+" must be a function")}function a(c,n){var u=typeof n;if(c===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var l;throw c===0?l="field":c===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function d(c,n,u,l,r,b,v,E,w){var f=u[0],s,m,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,P;if(typeof f=="function")h=t(f,l,s,E,r,b,v,w,i),h!==void 0&&(a(r,h),r===0?m=h:r===1?(m=h.init,x=h.get||i.get,P=h.set||i.set,i={get:x,set:P}):i=h);else for(var M=f.length-1;M>=0;M--){var S=f[M];if(h=t(S,l,s,E,r,b,v,w,i),h!==void 0){a(r,h);var A;r===0?A=h:r===1?(A=h.init,x=h.get||i.get,P=h.set||i.set,i={get:x,set:P}):i=h,A!==void 0&&(m===void 0?m=A:typeof m=="function"?m=[m,A]:m.push(A))}}if(r===0||r===1){if(m===void 0)m=function(I,D){return D};else if(typeof m!="function"){var F=m;m=function(I,D){for(var L=D,_=0;_<F.length;_++)L=F[_].call(I,L);return L}}else{var z=m;m=function(I,D){return z.call(I,D)}}c.push(m)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(c.push(function(I,D){return i.get.call(I,D)}),c.push(function(I,D){return i.set.call(I,D)})):r===2?c.push(i):c.push(function(I,D){return i.call(I,D)}):Object.defineProperty(n,l,s))}function g(c,n,u){for(var l=[],r,b,v=new Map,E=new Map,w=0;w<n.length;w++){var f=n[w];if(Array.isArray(f)){var s=f[1],m=f[2],i=f.length>3,h=s>=5,x,P;if(h?(x=c,s=s-5,b=b||[],P=b):(x=c.prototype,r=r||[],P=r),s!==0&&!i){var M=h?E:v,S=M.get(m)||0;if(S===!0||S===3&&s!==4||S===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+m);!S&&s>2?M.set(m,s):M.set(m,!0)}d(l,x,f,m,s,h,i,P,u)}}return y(l,r),y(l,b),l}function y(c,n){n&&c.push(function(u){for(var l=0;l<n.length;l++)n[l].call(u);return u})}function T(c,n,u){if(n.length>0){for(var l=[],r=c,b=c.name,v=n.length-1;v>=0;v--){var E={v:!1};try{var w=n[v](r,{kind:"class",name:b,addInitializer:p(l,E),metadata:u})}finally{E.v=!0}w!==void 0&&(a(10,w),r=w)}return[C(r,u),function(){for(var f=0;f<l.length;f++)l[f].call(r)}]}}function C(c,n){return Object.defineProperty(c,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,l,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),E=g(n,u,v);return l.length||C(n,v),{e:E,get c(){return T(n,l,v)}}}}function Kr(p,t,e,o){return(Kr=ms())(p,t,e,o)}var Qr,qr,ds;Qr=Rt({instructionType:"if"});var Jr=class{static{({c:[ds,qr]}=Kr(this,[],[Qr]))}constructor(t=R.use(mt),e=R.use(H),o=R.use(et)){this.mTemplateReference=t,this.mModuleValues=e,this.mProcedure=this.mModuleValues.createExpressionProcedure(o.value),this.mLastBoolean=!1}mLastBoolean;mModuleValues;mProcedure;mTemplateReference;onUpdate(){let t=this.mProcedure.execute();if(!!t!==this.mLastBoolean){this.mLastBoolean=!!t;let e=new ct;if(t){let o=new lt;o.appendChild(...this.mTemplateReference.childList),e.addElement(o,new ht(this.mModuleValues.data))}return e}else return null}static{qr()}};function fs(){function p(c,n){return function(l){e(n,"addInitializer"),o(l,"An initializer"),c.push(l)}}function t(c,n,u,l,r,b,v,E,w){var f;switch(r){case 1:f="accessor";break;case 2:f="method";break;case 3:f="getter";break;case 4:f="setter";break;default:f="field"}var s={kind:f,name:v?"#"+n:n,static:b,private:v,metadata:E},m={v:!1};s.addInitializer=p(l,m);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return c(w,s)}finally{m.v=!0}}function e(c,n){if(c.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(c,n){if(typeof c!="function")throw new TypeError(n+" must be a function")}function a(c,n){var u=typeof n;if(c===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var l;throw c===0?l="field":c===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function d(c,n,u,l,r,b,v,E,w){var f=u[0],s,m,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,P;if(typeof f=="function")h=t(f,l,s,E,r,b,v,w,i),h!==void 0&&(a(r,h),r===0?m=h:r===1?(m=h.init,x=h.get||i.get,P=h.set||i.set,i={get:x,set:P}):i=h);else for(var M=f.length-1;M>=0;M--){var S=f[M];if(h=t(S,l,s,E,r,b,v,w,i),h!==void 0){a(r,h);var A;r===0?A=h:r===1?(A=h.init,x=h.get||i.get,P=h.set||i.set,i={get:x,set:P}):i=h,A!==void 0&&(m===void 0?m=A:typeof m=="function"?m=[m,A]:m.push(A))}}if(r===0||r===1){if(m===void 0)m=function(I,D){return D};else if(typeof m!="function"){var F=m;m=function(I,D){for(var L=D,_=0;_<F.length;_++)L=F[_].call(I,L);return L}}else{var z=m;m=function(I,D){return z.call(I,D)}}c.push(m)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(c.push(function(I,D){return i.get.call(I,D)}),c.push(function(I,D){return i.set.call(I,D)})):r===2?c.push(i):c.push(function(I,D){return i.call(I,D)}):Object.defineProperty(n,l,s))}function g(c,n,u){for(var l=[],r,b,v=new Map,E=new Map,w=0;w<n.length;w++){var f=n[w];if(Array.isArray(f)){var s=f[1],m=f[2],i=f.length>3,h=s>=5,x,P;if(h?(x=c,s=s-5,b=b||[],P=b):(x=c.prototype,r=r||[],P=r),s!==0&&!i){var M=h?E:v,S=M.get(m)||0;if(S===!0||S===3&&s!==4||S===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+m);!S&&s>2?M.set(m,s):M.set(m,!0)}d(l,x,f,m,s,h,i,P,u)}}return y(l,r),y(l,b),l}function y(c,n){n&&c.push(function(u){for(var l=0;l<n.length;l++)n[l].call(u);return u})}function T(c,n,u){if(n.length>0){for(var l=[],r=c,b=c.name,v=n.length-1;v>=0;v--){var E={v:!1};try{var w=n[v](r,{kind:"class",name:b,addInitializer:p(l,E),metadata:u})}finally{E.v=!0}w!==void 0&&(a(10,w),r=w)}return[C(r,u),function(){for(var f=0;f<l.length;f++)l[f].call(r)}]}}function C(c,n){return Object.defineProperty(c,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,l,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),E=g(n,u,v);return l.length||C(n,v),{e:E,get c(){return T(n,l,v)}}}}function eo(p,t,e,o){return(eo=fs())(p,t,e,o)}var ro,kr,ps;ro=vt({access:W.Read,selector:/^\[[\w$]+\]$/});var to=class{static{({c:[ps,kr]}=eo(this,[],[ro]))}constructor(t=R.use(Q),e=R.use(H),o=R.use(ot)){this.mTarget=t,this.mProcedure=e.createExpressionProcedure(o.value),this.mTargetProperty=o.name.substring(1,o.name.length-1),this.mLastValue=Symbol("Uncomparable")}mLastValue;mProcedure;mTarget;mTargetProperty;onUpdate(){let t=this.mProcedure.execute();return t===this.mLastValue?!1:(this.mLastValue=t,Reflect.set(this.mTarget,this.mTargetProperty,t),!0)}static{kr()}};function gs(){function p(c,n){return function(l){e(n,"addInitializer"),o(l,"An initializer"),c.push(l)}}function t(c,n,u,l,r,b,v,E,w){var f;switch(r){case 1:f="accessor";break;case 2:f="method";break;case 3:f="getter";break;case 4:f="setter";break;default:f="field"}var s={kind:f,name:v?"#"+n:n,static:b,private:v,metadata:E},m={v:!1};s.addInitializer=p(l,m);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return c(w,s)}finally{m.v=!0}}function e(c,n){if(c.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(c,n){if(typeof c!="function")throw new TypeError(n+" must be a function")}function a(c,n){var u=typeof n;if(c===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var l;throw c===0?l="field":c===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function d(c,n,u,l,r,b,v,E,w){var f=u[0],s,m,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,P;if(typeof f=="function")h=t(f,l,s,E,r,b,v,w,i),h!==void 0&&(a(r,h),r===0?m=h:r===1?(m=h.init,x=h.get||i.get,P=h.set||i.set,i={get:x,set:P}):i=h);else for(var M=f.length-1;M>=0;M--){var S=f[M];if(h=t(S,l,s,E,r,b,v,w,i),h!==void 0){a(r,h);var A;r===0?A=h:r===1?(A=h.init,x=h.get||i.get,P=h.set||i.set,i={get:x,set:P}):i=h,A!==void 0&&(m===void 0?m=A:typeof m=="function"?m=[m,A]:m.push(A))}}if(r===0||r===1){if(m===void 0)m=function(I,D){return D};else if(typeof m!="function"){var F=m;m=function(I,D){for(var L=D,_=0;_<F.length;_++)L=F[_].call(I,L);return L}}else{var z=m;m=function(I,D){return z.call(I,D)}}c.push(m)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(c.push(function(I,D){return i.get.call(I,D)}),c.push(function(I,D){return i.set.call(I,D)})):r===2?c.push(i):c.push(function(I,D){return i.call(I,D)}):Object.defineProperty(n,l,s))}function g(c,n,u){for(var l=[],r,b,v=new Map,E=new Map,w=0;w<n.length;w++){var f=n[w];if(Array.isArray(f)){var s=f[1],m=f[2],i=f.length>3,h=s>=5,x,P;if(h?(x=c,s=s-5,b=b||[],P=b):(x=c.prototype,r=r||[],P=r),s!==0&&!i){var M=h?E:v,S=M.get(m)||0;if(S===!0||S===3&&s!==4||S===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+m);!S&&s>2?M.set(m,s):M.set(m,!0)}d(l,x,f,m,s,h,i,P,u)}}return y(l,r),y(l,b),l}function y(c,n){n&&c.push(function(u){for(var l=0;l<n.length;l++)n[l].call(u);return u})}function T(c,n,u){if(n.length>0){for(var l=[],r=c,b=c.name,v=n.length-1;v>=0;v--){var E={v:!1};try{var w=n[v](r,{kind:"class",name:b,addInitializer:p(l,E),metadata:u})}finally{E.v=!0}w!==void 0&&(a(10,w),r=w)}return[C(r,u),function(){for(var f=0;f<l.length;f++)l[f].call(r)}]}}function C(c,n){return Object.defineProperty(c,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,l,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),E=g(n,u,v);return l.length||C(n,v),{e:E,get c(){return T(n,l,v)}}}}function io(p,t,e,o){return(io=gs())(p,t,e,o)}var so,oo,vs;so=vt({access:W.Write,selector:/^#[[\w$]+$/});var no=class{static{({c:[vs,oo]}=io(this,[],[so]))}constructor(t=R.use(Q),e=R.use(ot),o=R.use(It)){this.mChildName=e.name.substring(1),this.mComponentScopeValue=o,this.mTargetNode=t,this.mComponentScopeValue.setTemporaryValue(this.mChildName,this.mTargetNode)}mChildName;mComponentScopeValue;mTargetNode;onDeconstruct(){this.mComponentScopeValue.data.store[this.mChildName]===this.mTargetNode&&this.mComponentScopeValue.data.deleteTemporaryValue(this.mChildName)}static{oo()}};function ys(){function p(c,n){return function(l){e(n,"addInitializer"),o(l,"An initializer"),c.push(l)}}function t(c,n,u,l,r,b,v,E,w){var f;switch(r){case 1:f="accessor";break;case 2:f="method";break;case 3:f="getter";break;case 4:f="setter";break;default:f="field"}var s={kind:f,name:v?"#"+n:n,static:b,private:v,metadata:E},m={v:!1};s.addInitializer=p(l,m);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return c(w,s)}finally{m.v=!0}}function e(c,n){if(c.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(c,n){if(typeof c!="function")throw new TypeError(n+" must be a function")}function a(c,n){var u=typeof n;if(c===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var l;throw c===0?l="field":c===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function d(c,n,u,l,r,b,v,E,w){var f=u[0],s,m,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,P;if(typeof f=="function")h=t(f,l,s,E,r,b,v,w,i),h!==void 0&&(a(r,h),r===0?m=h:r===1?(m=h.init,x=h.get||i.get,P=h.set||i.set,i={get:x,set:P}):i=h);else for(var M=f.length-1;M>=0;M--){var S=f[M];if(h=t(S,l,s,E,r,b,v,w,i),h!==void 0){a(r,h);var A;r===0?A=h:r===1?(A=h.init,x=h.get||i.get,P=h.set||i.set,i={get:x,set:P}):i=h,A!==void 0&&(m===void 0?m=A:typeof m=="function"?m=[m,A]:m.push(A))}}if(r===0||r===1){if(m===void 0)m=function(I,D){return D};else if(typeof m!="function"){var F=m;m=function(I,D){for(var L=D,_=0;_<F.length;_++)L=F[_].call(I,L);return L}}else{var z=m;m=function(I,D){return z.call(I,D)}}c.push(m)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(c.push(function(I,D){return i.get.call(I,D)}),c.push(function(I,D){return i.set.call(I,D)})):r===2?c.push(i):c.push(function(I,D){return i.call(I,D)}):Object.defineProperty(n,l,s))}function g(c,n,u){for(var l=[],r,b,v=new Map,E=new Map,w=0;w<n.length;w++){var f=n[w];if(Array.isArray(f)){var s=f[1],m=f[2],i=f.length>3,h=s>=5,x,P;if(h?(x=c,s=s-5,b=b||[],P=b):(x=c.prototype,r=r||[],P=r),s!==0&&!i){var M=h?E:v,S=M.get(m)||0;if(S===!0||S===3&&s!==4||S===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+m);!S&&s>2?M.set(m,s):M.set(m,!0)}d(l,x,f,m,s,h,i,P,u)}}return y(l,r),y(l,b),l}function y(c,n){n&&c.push(function(u){for(var l=0;l<n.length;l++)n[l].call(u);return u})}function T(c,n,u){if(n.length>0){for(var l=[],r=c,b=c.name,v=n.length-1;v>=0;v--){var E={v:!1};try{var w=n[v](r,{kind:"class",name:b,addInitializer:p(l,E),metadata:u})}finally{E.v=!0}w!==void 0&&(a(10,w),r=w)}return[C(r,u),function(){for(var f=0;f<l.length;f++)l[f].call(r)}]}}function C(c,n){return Object.defineProperty(c,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,l,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),E=g(n,u,v);return l.length||C(n,v),{e:E,get c(){return T(n,l,v)}}}}function co(p,t,e,o){return(co=ys())(p,t,e,o)}var uo,ao,bs;uo=Rt({instructionType:"slot"});var lo=class{static{({c:[bs,ao]}=co(this,[],[uo]))}constructor(t=R.use(H),e=R.use(et)){this.mModuleValues=t,this.mSlotName=e.value,this.mIsSetup=!1}mIsSetup;mModuleValues;mSlotName;onUpdate(){if(this.mIsSetup)return null;this.mIsSetup=!0;let t=new _t("slot");this.mSlotName!==""&&t.setAttribute("name").addValue(this.mSlotName);let e=new lt;e.appendChild(t);let o=new ct;return o.addElement(e,this.mModuleValues.data),o}static{ao()}};function ws(){function p(c,n){return function(l){e(n,"addInitializer"),o(l,"An initializer"),c.push(l)}}function t(c,n,u,l,r,b,v,E,w){var f;switch(r){case 1:f="accessor";break;case 2:f="method";break;case 3:f="getter";break;case 4:f="setter";break;default:f="field"}var s={kind:f,name:v?"#"+n:n,static:b,private:v,metadata:E},m={v:!1};s.addInitializer=p(l,m);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return c(w,s)}finally{m.v=!0}}function e(c,n){if(c.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(c,n){if(typeof c!="function")throw new TypeError(n+" must be a function")}function a(c,n){var u=typeof n;if(c===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var l;throw c===0?l="field":c===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function d(c,n,u,l,r,b,v,E,w){var f=u[0],s,m,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,P;if(typeof f=="function")h=t(f,l,s,E,r,b,v,w,i),h!==void 0&&(a(r,h),r===0?m=h:r===1?(m=h.init,x=h.get||i.get,P=h.set||i.set,i={get:x,set:P}):i=h);else for(var M=f.length-1;M>=0;M--){var S=f[M];if(h=t(S,l,s,E,r,b,v,w,i),h!==void 0){a(r,h);var A;r===0?A=h:r===1?(A=h.init,x=h.get||i.get,P=h.set||i.set,i={get:x,set:P}):i=h,A!==void 0&&(m===void 0?m=A:typeof m=="function"?m=[m,A]:m.push(A))}}if(r===0||r===1){if(m===void 0)m=function(I,D){return D};else if(typeof m!="function"){var F=m;m=function(I,D){for(var L=D,_=0;_<F.length;_++)L=F[_].call(I,L);return L}}else{var z=m;m=function(I,D){return z.call(I,D)}}c.push(m)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(c.push(function(I,D){return i.get.call(I,D)}),c.push(function(I,D){return i.set.call(I,D)})):r===2?c.push(i):c.push(function(I,D){return i.call(I,D)}):Object.defineProperty(n,l,s))}function g(c,n,u){for(var l=[],r,b,v=new Map,E=new Map,w=0;w<n.length;w++){var f=n[w];if(Array.isArray(f)){var s=f[1],m=f[2],i=f.length>3,h=s>=5,x,P;if(h?(x=c,s=s-5,b=b||[],P=b):(x=c.prototype,r=r||[],P=r),s!==0&&!i){var M=h?E:v,S=M.get(m)||0;if(S===!0||S===3&&s!==4||S===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+m);!S&&s>2?M.set(m,s):M.set(m,!0)}d(l,x,f,m,s,h,i,P,u)}}return y(l,r),y(l,b),l}function y(c,n){n&&c.push(function(u){for(var l=0;l<n.length;l++)n[l].call(u);return u})}function T(c,n,u){if(n.length>0){for(var l=[],r=c,b=c.name,v=n.length-1;v>=0;v--){var E={v:!1};try{var w=n[v](r,{kind:"class",name:b,addInitializer:p(l,E),metadata:u})}finally{E.v=!0}w!==void 0&&(a(10,w),r=w)}return[C(r,u),function(){for(var f=0;f<l.length;f++)l[f].call(r)}]}}function C(c,n){return Object.defineProperty(c,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,l,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),E=g(n,u,v);return l.length||C(n,v),{e:E,get c(){return T(n,l,v)}}}}function fo(p,t,e,o){return(fo=ws())(p,t,e,o)}var po,ho,xs;po=vt({access:W.ReadWrite,selector:/^\[\([[\w$]+\)\]$/});var mo=class{static{({c:[xs,ho]}=fo(this,[],[po]))}constructor(t=R.use(G),e=R.use(Q),o=R.use(H),a=R.use(ot)){this.mTargetNode=e,this.mAttributeKey=a.name.substring(2,a.name.length-2),this.mReadProcedure=o.createExpressionProcedure(a.value),this.mWriteProcedure=o.createExpressionProcedure(`${a.value} = $DATA;`,["$DATA"]),this.mLastDataValue=Symbol("Uncomparable");let d=g=>{this.mLastDataValue!==g&&t.updater.updateAsync()};this.mTargetNode.addEventListener("input",g=>{d(Reflect.get(this.mTargetNode,this.mAttributeKey))}),this.mTargetNode.addEventListener("change",g=>{d(Reflect.get(this.mTargetNode,this.mAttributeKey))})}mAttributeKey;mLastDataValue;mReadProcedure;mTargetNode;mWriteProcedure;onUpdate(){let t=this.mReadProcedure.execute();if(t!==this.mLastDataValue)return Reflect.set(this.mTargetNode,this.mAttributeKey,t),this.mLastDataValue=t,!0;let e=Reflect.get(this.mTargetNode,this.mAttributeKey);return e!==t?(this.mWriteProcedure.setTemporaryValue("$DATA",e),this.mWriteProcedure.execute(),this.mLastDataValue=e,!0):!1}static{ho()}};function Ts(){function p(c,n){return function(l){e(n,"addInitializer"),o(l,"An initializer"),c.push(l)}}function t(c,n,u,l,r,b,v,E,w){var f;switch(r){case 1:f="accessor";break;case 2:f="method";break;case 3:f="getter";break;case 4:f="setter";break;default:f="field"}var s={kind:f,name:v?"#"+n:n,static:b,private:v,metadata:E},m={v:!1};s.addInitializer=p(l,m);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return c(w,s)}finally{m.v=!0}}function e(c,n){if(c.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(c,n){if(typeof c!="function")throw new TypeError(n+" must be a function")}function a(c,n){var u=typeof n;if(c===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var l;throw c===0?l="field":c===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function d(c,n,u,l,r,b,v,E,w){var f=u[0],s,m,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,P;if(typeof f=="function")h=t(f,l,s,E,r,b,v,w,i),h!==void 0&&(a(r,h),r===0?m=h:r===1?(m=h.init,x=h.get||i.get,P=h.set||i.set,i={get:x,set:P}):i=h);else for(var M=f.length-1;M>=0;M--){var S=f[M];if(h=t(S,l,s,E,r,b,v,w,i),h!==void 0){a(r,h);var A;r===0?A=h:r===1?(A=h.init,x=h.get||i.get,P=h.set||i.set,i={get:x,set:P}):i=h,A!==void 0&&(m===void 0?m=A:typeof m=="function"?m=[m,A]:m.push(A))}}if(r===0||r===1){if(m===void 0)m=function(I,D){return D};else if(typeof m!="function"){var F=m;m=function(I,D){for(var L=D,_=0;_<F.length;_++)L=F[_].call(I,L);return L}}else{var z=m;m=function(I,D){return z.call(I,D)}}c.push(m)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(c.push(function(I,D){return i.get.call(I,D)}),c.push(function(I,D){return i.set.call(I,D)})):r===2?c.push(i):c.push(function(I,D){return i.call(I,D)}):Object.defineProperty(n,l,s))}function g(c,n,u){for(var l=[],r,b,v=new Map,E=new Map,w=0;w<n.length;w++){var f=n[w];if(Array.isArray(f)){var s=f[1],m=f[2],i=f.length>3,h=s>=5,x,P;if(h?(x=c,s=s-5,b=b||[],P=b):(x=c.prototype,r=r||[],P=r),s!==0&&!i){var M=h?E:v,S=M.get(m)||0;if(S===!0||S===3&&s!==4||S===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+m);!S&&s>2?M.set(m,s):M.set(m,!0)}d(l,x,f,m,s,h,i,P,u)}}return y(l,r),y(l,b),l}function y(c,n){n&&c.push(function(u){for(var l=0;l<n.length;l++)n[l].call(u);return u})}function T(c,n,u){if(n.length>0){for(var l=[],r=c,b=c.name,v=n.length-1;v>=0;v--){var E={v:!1};try{var w=n[v](r,{kind:"class",name:b,addInitializer:p(l,E),metadata:u})}finally{E.v=!0}w!==void 0&&(a(10,w),r=w)}return[C(r,u),function(){for(var f=0;f<l.length;f++)l[f].call(r)}]}}function C(c,n){return Object.defineProperty(c,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,l,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),E=g(n,u,v);return l.length||C(n,v),{e:E,get c(){return T(n,l,v)}}}}function yo(p,t,e,o){return(yo=Ts())(p,t,e,o)}var bo,go,Es;bo=Zt({access:W.Read,targetRestrictions:[gt]});var vo=class{static{({c:[Es,go]}=yo(this,[],[bo]))}constructor(t=R.use(gt),e=R.use(Q)){let o=new Array,a=t.processorConstructor;do{let d=nt.get(a).getMetadata(Te.METADATA_USER_EVENT_LISTENER_PROPERIES);if(d)for(let g of d)o.push(g)}while(a=Object.getPrototypeOf(a));this.mEventListenerList=new Array,this.mTargetElement=e;for(let d of o){let[g,y]=d,T=Reflect.get(t.processor,g);T=T.bind(t.processor),this.mEventListenerList.push([y,T]),this.mTargetElement.addEventListener(y,T)}}mEventListenerList;mTargetElement;onDeconstruct(){for(let t of this.mEventListenerList){let[e,o]=t;this.mTargetElement.removeEventListener(e,o)}}static{go()}};var wo=`:host {\r
    display: block;\r
    width: 100%;\r
    height: 100%;\r
}\r
\r
potatno-code-editor {\r
    display: block;\r
    width: 100%;\r
    height: 100%;\r
}`;var oe=class{mProject;constructor(t){this.mProject=t}deserialize(t){let e=new jt(this.mProject);for(let o of t.functions)e.addFunction(this.deserializeFunction(o,e));return e}deserializeFunction(t,e){let o=new Et(this.mProject,e,{definitionId:t.definitionId,id:t.id,label:t.label,isSystem:t.isSystem});for(let d of t.imports)o.addImport(d);for(let d of t.inputs)o.addInput({label:d.label,dataType:d.dataType});for(let d of t.outputs)o.addOutput({label:d.label,dataType:d.dataType});let a=new Map;for(let d of t.nodes)a.set(d.id,this.deserializeNode(d,o,e));for(let d of t.connections){if(!a.has(d.sourceNodeId)||!a.has(d.targetNodeId))continue;let g=a.get(d.sourceNodeId),y=a.get(d.targetNodeId),T=g.outputs.map.get(d.sourcePortId),C=y.inputs.map.get(d.targetPortId);!T||!C||T.connect(C)}return o}deserializeNode(t,e,o){let a=o.nodeDefinitions.find(g=>g.id===t.definitionId),d=(()=>{if(a)return e.addNodeByDefinition(a,t.transformation);let g=t.ports.filter(T=>T.direction==="input").map(T=>({dataType:T.dataType,definitionId:T.definitionId,label:T.label,portType:T.portType})),y=t.ports.filter(T=>T.direction==="output").map(T=>({dataType:T.dataType,definitionId:T.definitionId,label:T.label,portType:T.portType}));return new St(this.mProject,o,e,{definitionId:t.definitionId,ports:{input:g,output:y},label:t.label,transformation:{...t.transformation}})})();d.label=t.label,e.addNode(d);for(let g of t.ports)if(g.portType==="value"&&g.directValue.length>0){let y=d.inputs.map.get(g.definitionId);y&&y.setDirectValue(g.directValue)}return d.preview=t.preview??null,d}};var ne=class{constructor(){}serialize(t){return{functions:[...t.functions].map(e=>this.serializeFunction(e))}}serializeFunction(t){let e=new Map;[...t.nodes].forEach((y,T)=>{e.set(y,`n${T}`)});let o=[...t.nodes].map(y=>this.serializeNode(y,e.get(y))),a=[];for(let y of t.nodes){let T=e.get(y);for(let C of y.outputs.list)for(let c of C.connectedPorts){let n=e.get(c.node);a.push({sourceNodeId:T,sourcePortId:C.definitionId,targetNodeId:n,targetPortId:c.definitionId})}}let d=t.inputs.map(y=>({label:y.label,dataType:y.dataType})),g=t.outputs.map(y=>({label:y.label,dataType:y.dataType}));return{id:t.id,label:t.label,isSystem:t.isSystem,definitionId:t.definitionId,inputs:d,outputs:g,imports:[...t.imports],nodes:o,connections:a}}serializeNode(t,e){let o=[...t.inputs.list,...t.outputs.list].map(d=>({definitionId:d.definitionId,label:d.label,direction:d.direction,portType:d.portType,dataType:d.portType==="value"?d.dataType:null,directValue:[...d.directValue]})),a=t.preview?{portDefinitionId:t.preview.portDefinitionId,displayId:t.preview.displayId}:null;return{id:e,definitionId:t.definitionId,label:t.label,transformation:{...t.transformation},ports:o,preview:a}}};var xo=`:host {\r
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
    --potatno-color-text-contrast: #ffffff;\r
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
}`;var Be=class p{static PASTE_OFFSET=2;mClipboardNodes;mManager;constructor(t){this.mManager=t,this.mClipboardNodes=new Array}copy(t){if(t.size===0)return;let e=[...t],o=new Map;for(let a=0;a<e.length;a++){let d=e[a],g=d.inputs.value.map(T=>({definitionId:T.definitionId,values:[...T.directValue]})),y={...d.transformation};y.x+=p.PASTE_OFFSET,y.y+=p.PASTE_OFFSET,o.set(d,{connections:new Array,definitionId:d.definitionId,id:a,portDirectValues:g,label:d.label,transformation:y})}for(let[a,d]of o)for(let g of a.outputs.list)for(let y of g.connectedPorts){let T=o.get(y.node);T&&d.connections.push({sourcePortName:g.definitionId,targetNodeId:T.id,targetPortName:y.definitionId})}this.mClipboardNodes=[...o.values()]}paste(){if(this.mClipboardNodes.length===0)return new Array;let t=this.mManager.activeFunction;if(!t)return[];let e=new Map;for(let o of this.mClipboardNodes){let a=t.dynamicNodeDefinitions.find(g=>g.id===o.definitionId);if(!a)continue;let d=this.mManager.graph.addNode(t,a,o.transformation);this.mManager.graph.updateNode(d,g=>{g.label=o.label;for(let y of o.portDirectValues)g.inputs.map.has(y.definitionId)&&g.inputs.map.get(y.definitionId).setDirectValue(y.values)}),e.set(o.id,d)}for(let o of this.mClipboardNodes){let a=e.get(o.id);if(a)for(let d of o.connections){let g=e.get(d.targetNodeId);if(!g)continue;let y=a.outputs.map.get(d.sourcePortName),T=g.inputs.map.get(d.targetPortName);!y||!T||this.mManager.graph.connectPorts(y,T)}}return[...e.values()]}};var Ue=class extends he{mGridNodeArea;mGridPaths;mNodeArea;mPathArea;constructor(){super(),this.mGridNodeArea=new WeakMap,this.mNodeArea=new Map,this.mGridPaths=new WeakMap,this.mPathArea=new Map}clear(t){t==="all"&&this.mNodeArea.clear(),this.mPathArea.clear()}getPath(t,e){let o=t.direction==="input"&&t.portType==="value"||t.direction==="output"&&t.portType==="flow"?t:e;return this.mGridPaths.get(o)??new Array}removeNodeArea(t){if(!this.mGridNodeArea.has(t))return;let e=this.mGridNodeArea.get(t);for(let o of e){let a=(this.mNodeArea.get(o)??0)-1;a<1?this.mNodeArea.delete(o):this.mNodeArea.set(o,a)}this.mGridNodeArea.delete(t)}updateNodeArea(t){this.removeNodeArea(t);let e=t.transformation.x,o=t.transformation.y,a=t.transformation.width,d=t.transformation.height,g=t.function.nodeDefinitions.find(T=>T.id===t.definitionId);if(g)switch(!0){case g instanceof dt:return;case g instanceof K:d+=1,d+=t.preview!==null?7:1}let y=new Array;for(let T=0;T<a;T++)for(let C=0;C<d;C++){let c=`${T+e}|${C+o}`,n=(this.mNodeArea.get(c)??0)+1;this.mNodeArea.set(c,n),y.push(c)}this.mGridNodeArea.set(t,y)}updatePath(t,e,o){if(t.direction==="input"&&t.portType!=="value"||t.direction==="output"&&t.portType!=="flow")throw new N("Start port must be an input-value or an output-flow node.",this);this.removePathArea(t);let a=this.start(e,o);this.mGridPaths.set(t,a.path);let d=this.nodeId(e),g=this.nodeId(o);for(let y of a.path){let T=this.nodeId(y),C=this.mPathArea.has(T)?this.mPathArea.get(T):{ports:new Map,entryPoints:new Set};C.ports.set(t,[d,g]),C.entryPoints.add(d),C.entryPoints.add(g),this.mPathArea.set(T,C)}}costOfTraversal(t,e){let o=this.nodeId(t),a=1;this.mNodeArea.has(o)&&t!==e.endNode&&(a*=20);let d=e.path.next().value;if(this.mPathArea.has(o)){let c=this.mPathArea.get(o),n=this.nodeId(e.startNode),u=this.nodeId(e.endNode);if(c.entryPoints.has(n)||c.entryPoints.has(u))a*=.2;else if(a*=5,d){let l=this.nodeId(d);this.mPathArea.has(l)&&(a*=20)}}if(d){let c=t.y===d.y;(t===e.endNode||d===e.startNode)&&!c&&(a*=100);let n=e.path.next().value;n&&(t.x===n.x||t.y===n.y)&&(a*=.7)}let g=Math.abs(t.x-e.startNode.x),y=Math.abs(t.x-e.endNode.x),T=g<=y;(T&&t.y===e.startNode.y||!T&&t.y===e.endNode.y)&&(a*=.5);let C=e.endNode.x+e.startNode.x>>1;return t.x===C&&(a*=.5),a}heuristic(t,e){return(Math.abs(t.x-e.endNode.x)+Math.abs(t.y-e.endNode.y))*.5}neighborNodes(t){return[{x:t.x,y:t.y-1},{x:t.x-1,y:t.y},{x:t.x+1,y:t.y},{x:t.x,y:t.y+1}]}nodeId(t){return`${t.x}|${t.y}`}removePathArea(t){if(!this.mGridPaths.has(t))return;let e=this.mGridPaths.get(t);for(let o of e){let a=this.nodeId(o),d=this.mPathArea.get(a);if(!d)continue;let g=d.ports.get(t);g&&(d.ports.delete(t),d.entryPoints.delete(g[0]),d.entryPoints.delete(g[1]),d.ports.size===0?this.mPathArea.delete(a):this.mPathArea.set(a,d))}this.mGridPaths.delete(t)}};var He=class{mGridElement;mManager;mPathFinder;set gridElement(t){this.mGridElement=t}constructor(t){this.mManager=t,this.mGridElement=null,this.mPathFinder=new Ue;let e=0,o=()=>{e>0&&globalThis.cancelAnimationFrame(e),globalThis.requestAnimationFrame(()=>{this.updatePaths()})};this.mManager.subscribe(O.Node|O.SpecialActiveFunction,a=>{if((a.changeType&O.SpecialActiveFunction)>0){if(!this.mManager.activeFunction)return;this.mPathFinder.clear("all");for(let d of this.mManager.activeFunction.nodes)this.mPathFinder.updateNodeArea(d);o();return}(a.changeType&O.Node)>0&&((a.changeType&O.NodeDelete)>0?this.mPathFinder.removeNodeArea(a.item):this.mPathFinder.updateNodeArea(a.item)),o()}),this.mManager.subscribe(O.Connection,()=>{o()})}createTemporaryPath(t,e){let o=y=>y instanceof ut?this.getPortGridPoint(y):y,a=o(t),d=o(e),g=this.mPathFinder.start(a,d).path;return this.createSvgPath(g)}getConnectionPath(t,e){let o=this.mPathFinder.getPath(t,e);return this.createSvgPath(o)}getPortGridPoint(t){let e=t.node,o=t.direction==="input"?e.inputs.list:e.outputs.list,a=(()=>{let g=0;for(;g<o.length&&o[g]!==t;g++);return g})(),d=t.direction==="input"?e.transformation.x:e.transformation.x+e.transformation.width-1;return{y:e.transformation.y+1+a,x:d}}pixelToGridSpace(t,e){let o=t,a=e;if(this.mGridElement){let d=this.mGridElement.getBoundingClientRect();o-=d.left,a-=d.top}return o-=this.mManager.grid.panX,a-=this.mManager.grid.panY,o/=this.mManager.grid.zoom,a/=this.mManager.grid.zoom,{x:Math.floor(o/this.mManager.grid.gridSize),y:Math.floor(a/this.mManager.grid.gridSize)}}createGridCellPath(t,e,o){let a=this.getGridPosition(t,e),d=this.getGridPosition(t,o),g={x:e==="bottom"||e==="top"?a.x:d.x,y:e==="left"||e==="right"?a.y:d.y};return`M ${a.x},${a.y} Q ${g.x},${g.y} ${d.x},${d.y}`}createPath(t,e){let[o,a]=t.direction==="input"&&t.portType==="value"||t.direction==="output"&&t.portType==="flow"?[t,e]:[e,t],d=this.getPortGridPoint(o),g=this.getPortGridPoint(a);this.mPathFinder.updatePath(o,d,g)}createSvgPath(t){let e=(a,d)=>{let g=d.x-a.x,y=d.y-a.y;switch(!0){case(g===0&&y===1):return"bottom";case(g===0&&y===-1):return"top";case(g===-1&&y===0):return"left";case(g===1&&y===0):return"right";default:throw new N("Missformed path. Path points are not directly next to each other.",this)}},o="";for(let a=1;a<t.length-1;a++){let d=t[a],g=t[a-1],y=t[a+1],T=e(d,g),C=e(d,y);o+=this.createGridCellPath(d,T,C)}return o}getGridPosition(t,e){let o={x:t.x*this.mManager.grid.gridSize+this.mManager.grid.gridSize/2,y:t.y*this.mManager.grid.gridSize+this.mManager.grid.gridSize/2},a=this.mManager.grid.gridSize/2;switch(e){case"top":o.y-=a;break;case"right":o.x+=a;break;case"bottom":o.y+=a;break;case"left":o.x-=a;break}return o}updatePaths(){this.mPathFinder.clear("path");let t=this.mManager.activeFunction;if(t)for(let e of t.nodes){for(let o of e.outputs.flow){let a=o.connectedPorts.values().next().value;a&&this.createPath(o,a)}for(let o of e.inputs.value){let a=o.connectedPorts.values().next().value;a&&this.createPath(o,a)}}}};var Xe=class{mDocument;mManager;get document(){return this.mDocument}constructor(t){this.mManager=t,this.mDocument=new jt(t.project)}addFunction(t){let e=this.mDocument;if(!e||!e.project.userFunctions.has(t))return;let o=new Et(e.project,e,{definitionId:t,id:crypto.randomUUID(),isSystem:!1,label:`Function_${e.functions.length}`});e.addFunction(o),e.validate(),this.mManager.dispatch(O.FunctionAdd,o),this.mManager.setActiveFunction(o)}addNode(t,e,o){let a=t.addNodeByDefinition(e,o);return this.mManager.dispatch(O.NodeAdd,a),a}connectPorts(t,e){try{t.connect(e)}catch{return!1}return this.mManager.dispatch(O.ConnectionAdd,t),this.mManager.dispatch(O.ConnectionAdd,e),!0}disconnectPorts(t,e){t.disconnect(e),this.mManager.dispatch(O.ConnectionDelete,t),this.mManager.dispatch(O.ConnectionDelete,e)}removeFunction(t){let e=this.mDocument;if(!e)return;let o=null;for(let a of e.functions)if(a.id===t){o=a,e.removeFunction(a);break}o&&(this.mManager.dispatch(O.FunctionDelete,o),this.setDefaultActiveFunction())}removeNode(t){t.function.removeNode(t),this.mManager.dispatch(O.NodeDelete,t)}setDocument(t){this.mDocument=t,this.mDocument.validate(),this.mManager.dispatch(O.Document,this.mDocument),this.setDefaultActiveFunction()}setPortDirectValue(t,e){t.setDirectValue(e),this.mManager.dispatch(O.NodeUpdate,t.node)}transformNode(t,e){if(!t)return;let o=structuredClone(t.transformation);e(t),!(o.width===t.transformation.width&&o.height===t.transformation.height&&o.x===t.transformation.x&&o.y===t.transformation.y)&&this.mManager.dispatch(O.NodeTransform,t)}updateFunction(t,e){t&&(e(t),this.mManager.dispatch(O.FunctionUpdate,t))}updateNode(t,e){t&&(e(t),this.mManager.dispatch(O.NodeUpdate,t))}setDefaultActiveFunction(){if(!this.mDocument||this.mDocument.functions.length===0)return;let t=(()=>{let e=[...this.mDocument.functions];if(!this.mManager.activeFunction)return e[0];let o=e.find(a=>a.id===this.mManager.activeFunction.id);return o||e[0]})();this.mManager.activeFunction!==t&&this.mManager.setActiveFunction(t)}};var Ye=class p{static GRID_SIZE=25;static MAX_ZOOM=2;static MIN_ZOOM=.25;mManager;mPanX;mPanY;mZoom;get gridSize(){return p.GRID_SIZE}get panX(){return this.mPanX}get panY(){return this.mPanY}get zoom(){return this.mZoom}constructor(t){this.mManager=t,this.mPanX=0,this.mPanY=0,this.mZoom=1}pan(t,e){this.mPanX+=t,this.mPanY+=e,this.mManager.dispatch(O.SpecialGrid,null)}zoomAt(t,e,o){let a=this.mZoom,d=1+o,g=this.mZoom*d;g=Math.max(p.MIN_ZOOM,Math.min(p.MAX_ZOOM,g));let y=(t-this.mPanX)/a,T=(e-this.mPanY)/a;this.mZoom=g,this.mPanX=t-y*this.mZoom,this.mPanY=e-T*this.mZoom,this.mManager.dispatch(O.SpecialGrid,null)}};var We=class p{static MAX_HISTORY_ITEMS=100;mManager;mSnapshotIndex;mSnapshots;get canRedo(){return this.mSnapshotIndex<this.mSnapshots.length-1}get canUndo(){return this.mSnapshotIndex>0}constructor(t){this.mManager=t,this.mSnapshotIndex=-1,this.mSnapshots=new Array;let e=0;this.mManager.subscribe(O.Any,()=>{globalThis.clearTimeout(e),e=globalThis.setTimeout(()=>{this.pushHistory()},1e3)})}clear(){this.mSnapshots.length=0,this.mSnapshotIndex=-1}redo(){if(!this.canRedo)return;let t=this.mSnapshots[++this.mSnapshotIndex],e=JSON.parse(t);this.restoreHistory(e)}undo(){if(!this.canUndo)return;let t=this.mSnapshots[--this.mSnapshotIndex],e=JSON.parse(t);this.restoreHistory(e)}pushHistory(){this.mSnapshots.splice(this.mSnapshotIndex+1);let t=new ne().serialize(this.mManager.graph.document),e=JSON.stringify(t);this.mSnapshots.length>0&&this.mSnapshots.at(-1)===e||(this.mSnapshotIndex=this.mSnapshots.push(e)-1,this.mSnapshots.length>p.MAX_HISTORY_ITEMS&&(this.mSnapshots.shift(),this.mSnapshotIndex--))}restoreHistory(t){this.mManager.graph.setDocument(new oe(this.mManager.project).deserialize(t))}};var Ze=class{mErrorItems;mErrorList;mIsDirty;mManager;get errorItems(){return this.mIsDirty&&this.revalidate(),this.mErrorItems}get errors(){return this.mIsDirty&&this.revalidate(),this.mErrorList}get isValid(){return this.mIsDirty&&this.revalidate(),this.mErrorItems.size===0}constructor(t){this.mManager=t,this.mErrorList=new Array,this.mErrorItems=new Set,this.mIsDirty=!0;let e=0;this.mManager.subscribe(O.Any,()=>{this.mIsDirty=!0,globalThis.clearTimeout(e),e=globalThis.setTimeout(()=>{this.mIsDirty&&(this.revalidate(),this.mIsDirty=!1)},1e3)})}revalidate(){this.mIsDirty=!1,this.mErrorList.splice(0,this.mErrorList.length),this.mErrorItems.clear();let t=this.mManager.graph.document.validate();for(let e of t.errors)switch(this.mErrorItems.add(e.item),!0){case e.item instanceof ut:{this.mErrorList.push({location:`Node "${e.item.node.label}"`,message:e.message});break}case e.item instanceof St:{this.mErrorList.push({location:`Node "${e.item.label}"`,message:e.message});break}}for(let e of t.affectedItems)switch(!0){case e instanceof ut:{this.mManager.dispatch(O.PortAdd|O.PortUpdate,e),this.mManager.dispatch(O.NodeUpdate,e.node);break}case e instanceof St:{this.mManager.dispatch(O.NodeAdd|O.NodeUpdate|O.NodeTransform,e);break}case e instanceof Et:{this.mManager.dispatch(O.FunctionAdd|O.FunctionUpdate,e);break}}}};var qe=class{mDriverActivity;mDriverElements;mDriverList;mDrivers;mElementDriver;mManager;mPreviewIntersection;constructor(t){this.mManager=t,this.mDriverList=new Array,this.mDrivers=new WeakMap,this.mDriverActivity=new WeakMap,this.mDriverElements=new WeakMap,this.mElementDriver=new WeakMap,this.mManager.subscribe(O.Document,()=>{this.mDriverList.splice(0,this.mDriverList.length)});let e=0,o=O.Connection|O.Function|O.NodeAdd|O.NodeDelete|O.NodeUpdate;this.mManager.subscribe(o,()=>{globalThis.clearTimeout(e),e=globalThis.setTimeout(()=>this.refresh(),1e3)}),this.mPreviewIntersection=new IntersectionObserver(a=>{for(let d of a){let g=this.mElementDriver.get(d.target);if(!g)continue;let y=g.deref();y&&this.mDriverActivity.set(y,d.isIntersecting)}})}async execute(){let t=this.mDriverList.map(async e=>{let o=e.deref();if(o&&this.mDriverActivity.get(o))try{await o.execute()}catch(a){console.error("[PotatnoUiManagerPreview] Driver render failed:",a)}});await Promise.all(t)}refresh(){if(this.mManager.integrity.isValid)for(let t=this.mDriverList.length-1;t>=0;t--){let e=this.mDriverList[t].deref();if(!e){this.unregister(this.mDriverList[t]);continue}e.refresh()}}requestDriver(t,e){let o=this.mDrivers.get(t);if(o&&o.display.id===e)return o;let a=t.project.preview.getDisplay(e);if(!a)throw new N(`Preview has no display for "${e}".`,this);let d=a.createDriver(t);return this.register(t,d),this.mManager.integrity.isValid&&d.refresh(),d}register(t,e){this.mDrivers.set(t,e);let o=new WeakRef(e);this.mDriverList.push(o);let a=e.element;this.mDriverElements.set(o,a),this.mElementDriver.set(a,o),this.mPreviewIntersection.observe(a)}unregister(t){let e=this.mDriverList.indexOf(t);if(e===-1)return;this.mDriverList.splice(e,1);let o=this.mDriverElements.get(t);o&&this.mPreviewIntersection.unobserve(o)}};var X=class extends EventTarget{mActiveFunction;mClipboard;mConnections;mEventBuffer;mEventBufferDispatchRequest;mGraph;mGrid;mHistory;mIntegrity;mPreview;mProject;get activeFunction(){return this.mActiveFunction}get clipboard(){return this.mClipboard}get connections(){return this.mConnections}get graph(){return this.mGraph}get grid(){return this.mGrid}get history(){return this.mHistory}get integrity(){return this.mIntegrity}get preview(){return this.mPreview}get project(){return this.mProject}constructor(t){super(),this.mProject=t,this.mActiveFunction=null,this.mEventBuffer=new Map,this.mEventBufferDispatchRequest=-1,this.mIntegrity=new Ze(this),this.mConnections=new He(this),this.mHistory=new We(this),this.mPreview=new qe(this),this.mGrid=new Ye(this),this.mClipboard=new Be(this),this.mGraph=new Xe(this)}dispatch(t,e){let o=this.mEventBuffer.get(e)??0;this.mEventBuffer.set(e,o|t),this.mEventBufferDispatchRequest!==-1&&globalThis.cancelAnimationFrame(this.mEventBufferDispatchRequest),this.mEventBufferDispatchRequest=requestAnimationFrame(()=>{this.mEventBufferDispatchRequest=-1;for(let[a,d]of this.mEventBuffer)this.dispatchEvent(new Ce(d,a));this.mEventBuffer.clear()})}generateStringColor(t){let e=(()=>{let a=0;for(let d=0;d<t.length;d++)a=t.charCodeAt(d)+((a<<5)-a);return a})();return`hsl(${Math.abs(e)*137.508%360}, 70%, 60%)`}setActiveFunction(t){this.mGraph.document.functions.find(o=>o===t)&&(this.mActiveFunction=t,this.dispatch(O.SpecialActiveFunction,t))}subscribe(t,e){let o=a=>{t!==O.Any&&(a.changeType&t)===0||e(a)};return this.addEventListener(Ce.EVENT_TYPE,o),()=>{this.removeEventListener(Ce.EVENT_TYPE,o)}}},O={Any:16777215,Connection:15,ConnectionAdd:1,ConnectionUpdate:2,ConnectionDelete:4,Document:240,Function:3840,FunctionAdd:256,FunctionUpdate:512,FunctionDelete:1024,Node:61440,NodeAdd:4096,NodeUpdate:8192,NodeDelete:16384,NodeTransform:32768,Port:983040,PortAdd:65536,PortUpdate:131072,PortDelete:262144,Special:15728640,SpecialActiveFunction:1048576,SpecialGrid:2097152},Ce=class p extends Event{static EVENT_TYPE="PotatnoUiManagerChangeEvent";mChangeType;mEventItem;get changeType(){return this.mChangeType}get item(){return this.mEventItem}constructor(t,e){super(p.EVENT_TYPE),this.mChangeType=t,this.mEventItem=e}};var To=`:host {\r
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
    /* Set min, max and default width */\r
    max-width: 500px;\r
    width: 250px;\r
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
    /* Hide and show mechanic */\r
    display: none;\r
\r
    &.active {\r
        display: block;\r
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
}`;var Eo=`<potatno-resize-box class="resize-box" right="true">\r
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
            <div class="popup {{ this.showPopup ? 'active' : ''}}">\r
                <div class="popup__header">Select Function Type</div>\r
                $for(functionDefinition of this.userFunctionDefinitions) {\r
                    <div class="popup__item" (click)="this.createFunction(this.functionDefinition)">\r
                        <div class="icon">\u0192</div>\r
                        <div>{{this.functionDefinition.label}}</div>\r
                    </div>\r
                }\r
            </div>\r
\r
            <div class="add-action" (click)="this.showPopup = !this.showPopup">\r
                <div>+</div>\r
                <div>Add Function</div>\r
            </div>\r
        </div>\r
    }\r
</potatno-resize-box>\r
`;function Ms(){function p(c,n){return function(l){e(n,"addInitializer"),o(l,"An initializer"),c.push(l)}}function t(c,n,u,l,r,b,v,E,w){var f;switch(r){case 1:f="accessor";break;case 2:f="method";break;case 3:f="getter";break;case 4:f="setter";break;default:f="field"}var s={kind:f,name:v?"#"+n:n,static:b,private:v,metadata:E},m={v:!1};s.addInitializer=p(l,m);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return c(w,s)}finally{m.v=!0}}function e(c,n){if(c.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(c,n){if(typeof c!="function")throw new TypeError(n+" must be a function")}function a(c,n){var u=typeof n;if(c===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var l;throw c===0?l="field":c===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function d(c,n,u,l,r,b,v,E,w){var f=u[0],s,m,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,P;if(typeof f=="function")h=t(f,l,s,E,r,b,v,w,i),h!==void 0&&(a(r,h),r===0?m=h:r===1?(m=h.init,x=h.get||i.get,P=h.set||i.set,i={get:x,set:P}):i=h);else for(var M=f.length-1;M>=0;M--){var S=f[M];if(h=t(S,l,s,E,r,b,v,w,i),h!==void 0){a(r,h);var A;r===0?A=h:r===1?(A=h.init,x=h.get||i.get,P=h.set||i.set,i={get:x,set:P}):i=h,A!==void 0&&(m===void 0?m=A:typeof m=="function"?m=[m,A]:m.push(A))}}if(r===0||r===1){if(m===void 0)m=function(I,D){return D};else if(typeof m!="function"){var F=m;m=function(I,D){for(var L=D,_=0;_<F.length;_++)L=F[_].call(I,L);return L}}else{var z=m;m=function(I,D){return z.call(I,D)}}c.push(m)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(c.push(function(I,D){return i.get.call(I,D)}),c.push(function(I,D){return i.set.call(I,D)})):r===2?c.push(i):c.push(function(I,D){return i.call(I,D)}):Object.defineProperty(n,l,s))}function g(c,n,u){for(var l=[],r,b,v=new Map,E=new Map,w=0;w<n.length;w++){var f=n[w];if(Array.isArray(f)){var s=f[1],m=f[2],i=f.length>3,h=s>=5,x,P;if(h?(x=c,s=s-5,b=b||[],P=b):(x=c.prototype,r=r||[],P=r),s!==0&&!i){var M=h?E:v,S=M.get(m)||0;if(S===!0||S===3&&s!==4||S===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+m);!S&&s>2?M.set(m,s):M.set(m,!0)}d(l,x,f,m,s,h,i,P,u)}}return y(l,r),y(l,b),l}function y(c,n){n&&c.push(function(u){for(var l=0;l<n.length;l++)n[l].call(u);return u})}function T(c,n,u){if(n.length>0){for(var l=[],r=c,b=c.name,v=n.length-1;v>=0;v--){var E={v:!1};try{var w=n[v](r,{kind:"class",name:b,addInitializer:p(l,E),metadata:u})}finally{E.v=!0}w!==void 0&&(a(10,w),r=w)}return[C(r,u),function(){for(var f=0;f<l.length;f++)l[f].call(r)}]}}function C(c,n){return Object.defineProperty(c,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,l,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),E=g(n,u,v);return l.length||C(n,v),{e:E,get c(){return T(n,l,v)}}}}function So(p,t,e,o){return(So=Ms())(p,t,e,o)}var Ao,Do,No,Lo,Io,Co,Po,gr;Ao=Y({selector:"potatno-function-list",template:Eo,style:To}),No=$.state({complexValue:!0}),Lo=$.state();var Mo=class{static{({e:[Io,Co,Po],c:[gr,Do]}=So(this,[[No,1,"documentFunctions"],[Lo,1,"showPopup"]],[Ao]))}constructor(t=R.use(X)){this.mManager=t,this.documentFunctions=new Array,this.showPopup=!1,this.mUnsubscribe=this.mManager.subscribe(O.Document|O.Function|O.SpecialActiveFunction,()=>{this.documentFunctions=this.mManager.graph.document.functions.map(e=>({id:e.id,label:e.label,isSystem:e.isSystem,function:e}))})}mManager;mUnsubscribe;#t=(Po(this),Io(this));get documentFunctions(){return this.#t}set documentFunctions(t){this.#t=t}#e=Co(this);get showPopup(){return this.#e}set showPopup(t){this.#e=t}get activeFunctionId(){return this.mManager.activeFunction?.id??""}get userFunctionDefinitions(){return[...this.mManager.project.userFunctions.values()]}createFunction(t){this.showPopup=!1,this.mManager.graph.addFunction(t.id)}deleteFunction(t){this.mManager.graph.removeFunction(t.id)}onDeconstruct(){this.mUnsubscribe()}selectFunction(t){this.mManager.setActiveFunction(t.function)}static{Do()}};var _o=`:host {\r
    display: flex;\r
    flex-direction: column;\r
    position: relative;\r
\r
    --resize-box-handle-color: color-mix(in srgb, var(--potatno-color-text) 30%, var(--potatno-color-background));\r
    --resize-box-handle-size: 5px;\r
}\r
\r
.container {\r
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
}`;var Ro=`<!-- In order of top-left clockwise. Needed for styling -->\r
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
<div class="container {{this.top ? 'top' : ''}} {{this.bottom ? 'bottom' : ''}} {{this.left ? 'left' : ''}} {{this.right ? 'right' : ''}}">\r
    $slot\r
</div>\r
`;function Ns(){function p(c,n){return function(l){e(n,"addInitializer"),o(l,"An initializer"),c.push(l)}}function t(c,n,u,l,r,b,v,E,w){var f;switch(r){case 1:f="accessor";break;case 2:f="method";break;case 3:f="getter";break;case 4:f="setter";break;default:f="field"}var s={kind:f,name:v?"#"+n:n,static:b,private:v,metadata:E},m={v:!1};s.addInitializer=p(l,m);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return c(w,s)}finally{m.v=!0}}function e(c,n){if(c.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(c,n){if(typeof c!="function")throw new TypeError(n+" must be a function")}function a(c,n){var u=typeof n;if(c===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var l;throw c===0?l="field":c===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function d(c,n,u,l,r,b,v,E,w){var f=u[0],s,m,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,P;if(typeof f=="function")h=t(f,l,s,E,r,b,v,w,i),h!==void 0&&(a(r,h),r===0?m=h:r===1?(m=h.init,x=h.get||i.get,P=h.set||i.set,i={get:x,set:P}):i=h);else for(var M=f.length-1;M>=0;M--){var S=f[M];if(h=t(S,l,s,E,r,b,v,w,i),h!==void 0){a(r,h);var A;r===0?A=h:r===1?(A=h.init,x=h.get||i.get,P=h.set||i.set,i={get:x,set:P}):i=h,A!==void 0&&(m===void 0?m=A:typeof m=="function"?m=[m,A]:m.push(A))}}if(r===0||r===1){if(m===void 0)m=function(I,D){return D};else if(typeof m!="function"){var F=m;m=function(I,D){for(var L=D,_=0;_<F.length;_++)L=F[_].call(I,L);return L}}else{var z=m;m=function(I,D){return z.call(I,D)}}c.push(m)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(c.push(function(I,D){return i.get.call(I,D)}),c.push(function(I,D){return i.set.call(I,D)})):r===2?c.push(i):c.push(function(I,D){return i.call(I,D)}):Object.defineProperty(n,l,s))}function g(c,n,u){for(var l=[],r,b,v=new Map,E=new Map,w=0;w<n.length;w++){var f=n[w];if(Array.isArray(f)){var s=f[1],m=f[2],i=f.length>3,h=s>=5,x,P;if(h?(x=c,s=s-5,b=b||[],P=b):(x=c.prototype,r=r||[],P=r),s!==0&&!i){var M=h?E:v,S=M.get(m)||0;if(S===!0||S===3&&s!==4||S===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+m);!S&&s>2?M.set(m,s):M.set(m,!0)}d(l,x,f,m,s,h,i,P,u)}}return y(l,r),y(l,b),l}function y(c,n){n&&c.push(function(u){for(var l=0;l<n.length;l++)n[l].call(u);return u})}function T(c,n,u){if(n.length>0){for(var l=[],r=c,b=c.name,v=n.length-1;v>=0;v--){var E={v:!1};try{var w=n[v](r,{kind:"class",name:b,addInitializer:p(l,E),metadata:u})}finally{E.v=!0}w!==void 0&&(a(10,w),r=w)}return[C(r,u),function(){for(var f=0;f<l.length;f++)l[f].call(r)}]}}function C(c,n){return Object.defineProperty(c,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,l,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),E=g(n,u,v);return l.length||C(n,v),{e:E,get c(){return T(n,l,v)}}}}function Go(p,t,e,o){return(Go=Ns())(p,t,e,o)}var Bo,Oo,Uo,Ho,Xo,Fo,jo,zo,Vo,qt;Bo=Y({selector:"potatno-resize-box",template:Ro,style:_o}),Uo=$.state({proxy:!0}),Ho=yt("resize"),Xo=yt("resize-end");var $o=class{static{({e:[Fo,jo,zo,Vo],c:[qt,Oo]}=Go(this,[[Uo,1,"mConfiguration"],[Ho,1,"mResize"],[Xo,1,"mResizeEnd"],[tt,3,"bottom"],[tt,3,"left"],[tt,3,"right"],[tt,3,"snap"],[tt,3,"top"],[tt,3,"virtual"],[tt,2,"resize"]],[Bo]))}constructor(t=R.use(G)){this.mComponentElement=t.element,this.mConfiguration={snap:1,isVirtual:!1,enabledDirections:{top:!1,right:!1,bottom:!1,left:!1}}}mComponentElement;#t=(Vo(this),Fo(this));get mConfiguration(){return this.#t}set mConfiguration(t){this.#t=t}#e=jo(this);get mResize(){return this.#e}set mResize(t){this.#e=t}#r=zo(this);get mResizeEnd(){return this.#r}set mResizeEnd(t){this.#r=t}get bottom(){return this.mConfiguration.enabledDirections.bottom}set bottom(t){this.mConfiguration.enabledDirections.bottom=this.parseBoolean(t)}get left(){return this.mConfiguration.enabledDirections.left}set left(t){this.mConfiguration.enabledDirections.left=this.parseBoolean(t)}get right(){return this.mConfiguration.enabledDirections.right}set right(t){this.mConfiguration.enabledDirections.right=this.parseBoolean(t)}get snap(){return this.mConfiguration.snap}set snap(t){this.mConfiguration.snap=parseInt(t.toString())}get top(){return this.mConfiguration.enabledDirections.top}set top(t){this.mConfiguration.enabledDirections.top=this.parseBoolean(t)}get virtual(){return this.mConfiguration.isVirtual}set virtual(t){this.mConfiguration.isVirtual=this.parseBoolean(t)}resize(t,e){let o=this.mComponentElement.getBoundingClientRect(),a=o.width,d=o.height;return this.mComponentElement.style.setProperty("width",`${t}px`),this.mComponentElement.style.setProperty("height",`${e}px`),t!==a||e!==d}resizeCorner(t){this.handleResize(t,"both")}resizeHorizontal(t){this.handleResize(t,"horizontal")}resizeVertical(t){this.handleResize(t,"vertical")}createResizeEvent(t,e,o,a,d){let g=t;return e===a&&(g&=~(wt.right|wt.left)),o===d&&(g&=~(wt.top|wt.bottom)),new vr(e,o,g)}handleResize(t,e){t.preventDefault(),t.stopPropagation();let o=this.mComponentElement.getBoundingClientRect(),a=this.mComponentElement.offsetWidth?o.width/this.mComponentElement.offsetWidth:1,d=this.mComponentElement.offsetHeight?o.height/this.mComponentElement.offsetHeight:1,g=o.width/a,y=o.height/d,T=t.clientX,C=t.clientY,c=1;Math.abs(T-o.left)<Math.abs(T-o.right)&&(c=-1);let n=1;Math.abs(C-o.top)<Math.abs(C-o.bottom)&&(n=-1);let u=0;u+=c===1?wt.right:wt.left,u+=n===1?wt.bottom:wt.top;let l=g,r=y,b=E=>{let w=(E.clientX-T)/a*c,f=(E.clientY-C)/d*n,s=g+w,m=y+f;e==="horizontal"&&(s=g),e==="vertical"&&(m=y),[l,r]=this.updateComponentSize(u,s,m,l,r)},v=()=>{document.removeEventListener("pointermove",b),document.removeEventListener("pointerup",v),(l!==g||r!==y)&&this.mResizeEnd.dispatchEvent(this.createResizeEvent(u,l,r,g,y))};document.addEventListener("pointermove",b),document.addEventListener("pointerup",v)}parseBoolean(t){return!!(()=>{if(typeof t=="string"){let o=t.toLowerCase();if(["true","false"].includes(o))return o==="true"}return t})()}updateComponentSize(t,e,o,a,d){let g=a;(this.mConfiguration.enabledDirections.left||this.mConfiguration.enabledDirections.right)&&(g=Math.floor(Math.abs(e)/this.mConfiguration.snap)*this.mConfiguration.snap*(e/Math.abs(e)),this.mConfiguration.isVirtual||this.mComponentElement.style.setProperty("width",`${g}px`));let y=d;return(this.mConfiguration.enabledDirections.top||this.mConfiguration.enabledDirections.bottom)&&(y=Math.floor(Math.abs(o)/this.mConfiguration.snap)*this.mConfiguration.snap*(o/Math.abs(o)),this.mConfiguration.isVirtual||this.mComponentElement.style.setProperty("height",`${y}px`)),(g!==a||y!==d)&&this.mResize.dispatchEvent(this.createResizeEvent(t,g,y,a,d)),[g,y]}static{Oo()}},vr=class{mHeight;mResizeHandle;mWidth;get height(){return this.mHeight}get resizeHandle(){return this.mResizeHandle}get width(){return this.mWidth}constructor(t,e,o){this.mHeight=e,this.mResizeHandle=o,this.mWidth=t}},wt={top:1,right:2,bottom:4,left:8};var Yo=`:host {\r
    position: absolute;\r
    z-index: 200;\r
}\r
\r
.selection-popup {\r
    display: flex;\r
    flex-direction: column;\r
\r
    /* Fixed values also defined as constants in the component itself!!! */\r
    max-height: 320px;\r
    width: 280px;\r
\r
    border: 1px solid var(--potatno-color-border);\r
    border-radius: 2px;\r
\r
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.28);\r
    background-color: var(--potatno-color-background);\r
    overflow: hidden;\r
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
}`;var Wo=`<div class="selection-popup" (pointerdown)="this.stopPropagation($event, false)" (wheel)="this.stopPropagation($event, false)" (contextmenu)="this.stopPropagation($event, true);">\r
    <input #searchInput type="text" placeholder="Search nodes..." class="selection-popup__search" [(value)]="this.searchValue" (keydown)="this.onKeyDown($event)" />\r
    <div class="selection-popup__results">\r
        $for(entry of this.results) {\r
            <div class="selection-popup__result {{this.entry.definition.id === this.selectedDefinitionId ? 'selected' : ''}}" (click)="this.sendSelectedEntry(this.entry.definition.id)" style="--item-color: {{this.entry.color}}">\r
                <span class="selection-popup__result-icon">{{this.entry.icon}}</span>\r
                <span class="selection-popup__result-label">{{this.entry.label}}</span>\r
                <span class="selection-popup__result-category">{{this.entry.category}}</span>\r
            </div>\r
        }\r
        $if(this.results.length === 0) {\r
            <div class="selection-popup__empty">No matching nodes found.</div>\r
        }\r
    </div>\r
</div>\r
`;function Rs(){function p(c,n){return function(l){e(n,"addInitializer"),o(l,"An initializer"),c.push(l)}}function t(c,n,u,l,r,b,v,E,w){var f;switch(r){case 1:f="accessor";break;case 2:f="method";break;case 3:f="getter";break;case 4:f="setter";break;default:f="field"}var s={kind:f,name:v?"#"+n:n,static:b,private:v,metadata:E},m={v:!1};s.addInitializer=p(l,m);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return c(w,s)}finally{m.v=!0}}function e(c,n){if(c.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(c,n){if(typeof c!="function")throw new TypeError(n+" must be a function")}function a(c,n){var u=typeof n;if(c===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var l;throw c===0?l="field":c===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function d(c,n,u,l,r,b,v,E,w){var f=u[0],s,m,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,P;if(typeof f=="function")h=t(f,l,s,E,r,b,v,w,i),h!==void 0&&(a(r,h),r===0?m=h:r===1?(m=h.init,x=h.get||i.get,P=h.set||i.set,i={get:x,set:P}):i=h);else for(var M=f.length-1;M>=0;M--){var S=f[M];if(h=t(S,l,s,E,r,b,v,w,i),h!==void 0){a(r,h);var A;r===0?A=h:r===1?(A=h.init,x=h.get||i.get,P=h.set||i.set,i={get:x,set:P}):i=h,A!==void 0&&(m===void 0?m=A:typeof m=="function"?m=[m,A]:m.push(A))}}if(r===0||r===1){if(m===void 0)m=function(I,D){return D};else if(typeof m!="function"){var F=m;m=function(I,D){for(var L=D,_=0;_<F.length;_++)L=F[_].call(I,L);return L}}else{var z=m;m=function(I,D){return z.call(I,D)}}c.push(m)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(c.push(function(I,D){return i.get.call(I,D)}),c.push(function(I,D){return i.set.call(I,D)})):r===2?c.push(i):c.push(function(I,D){return i.call(I,D)}):Object.defineProperty(n,l,s))}function g(c,n,u){for(var l=[],r,b,v=new Map,E=new Map,w=0;w<n.length;w++){var f=n[w];if(Array.isArray(f)){var s=f[1],m=f[2],i=f.length>3,h=s>=5,x,P;if(h?(x=c,s=s-5,b=b||[],P=b):(x=c.prototype,r=r||[],P=r),s!==0&&!i){var M=h?E:v,S=M.get(m)||0;if(S===!0||S===3&&s!==4||S===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+m);!S&&s>2?M.set(m,s):M.set(m,!0)}d(l,x,f,m,s,h,i,P,u)}}return y(l,r),y(l,b),l}function y(c,n){n&&c.push(function(u){for(var l=0;l<n.length;l++)n[l].call(u);return u})}function T(c,n,u){if(n.length>0){for(var l=[],r=c,b=c.name,v=n.length-1;v>=0;v--){var E={v:!1};try{var w=n[v](r,{kind:"class",name:b,addInitializer:p(l,E),metadata:u})}finally{E.v=!0}w!==void 0&&(a(10,w),r=w)}return[C(r,u),function(){for(var f=0;f<l.length;f++)l[f].call(r)}]}}function C(c,n){return Object.defineProperty(c,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,l,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),E=g(n,u,v);return l.length||C(n,v),{e:E,get c(){return T(n,l,v)}}}}function en(p,t,e,o){return(en=Rs())(p,t,e,o)}function Os(p){return p}var rn,Zo,on,nn,sn,an,ln,qo,Jo,Ko,Qo,ko,tn,ie;rn=Y({selector:"potatno-node-selection-popup",template:Wo,style:Yo,components:[qt]}),on=$.state({complexValue:!0}),nn=bt("searchInput"),sn=yt("node-select"),an=$.state(),ln=$.state();new class extends Os{constructor(){super(ie),Zo()}static{class p{static{({e:[qo,Jo,Ko,Qo,ko,tn],c:[ie,Zo]}=en(this,[[on,1,"results"],[nn,1,"searchInput"],[sn,1,"mNodeSelect"],[an,1,"searchValue"],[ln,1,"selectedDefinitionId"]],[rn]))}static POPUP_WIDTH=280;static POPUP_HEIGHT=320;mComponent;mManager;#t=(tn(this),qo(this));get results(){return this.#t}set results(e){this.#t=e}#e=Jo(this);get searchInput(){return this.#e}set searchInput(e){this.#e=e}#r=Ko(this);get mNodeSelect(){return this.#r}set mNodeSelect(e){this.#r=e}#o=Qo(this);get searchValue(){return this.#o}set searchValue(e){this.#o=e}#n=ko(this);get selectedDefinitionId(){return this.#n}set selectedDefinitionId(e){this.#n=e}constructor(e=R.use(G),o=R.use(X)){this.mManager=o,this.mComponent=e,this.selectedDefinitionId=null,this.results=new Array,this.searchValue=""}onConnect(){this.searchInput?.focus()}onKeyDown(e){if(this.results.length!==0){if(e.key==="ArrowDown"||e.key==="ArrowUp"){e.preventDefault();let o=this.results.findIndex(g=>g.definition.id===this.selectedDefinitionId);o=Math.max(0,o);let a=e.key==="ArrowDown"?1:-1,d=(o+a+this.results.length)%this.results.length;this.selectedDefinitionId=this.results[d].definition.id;return}e.key==="Enter"&&this.sendSelectedEntry(this.selectedDefinitionId)}}onUpdate(){this.rebuildResults();let e=this.mComponent.element.shadowRoot.querySelector(".selection-popup__result.selected");e&&e.scrollIntoView()}stopPropagation(e,o){e.stopPropagation(),o&&e.preventDefault()}rebuildResults(){if(!this.mManager.activeFunction){this.results=new Array;return}let e=this.mManager.activeFunction.dynamicNodeDefinitions.map(a=>({category:a.category.name,definition:a,label:a.label.toLowerCase(),color:this.mManager.generateStringColor(a.category.name),icon:a.category.icon})),o=this.searchValue.trim().toLowerCase();this.results=e.filter(a=>a.label.includes(o)),this.results.some(a=>a.definition.id===this.selectedDefinitionId)||(this.selectedDefinitionId=this.results[0]?.definition.id??null)}sendSelectedEntry(e){if(e===null)return;let o=this.results.find(a=>a.definition.id===e);o&&this.mNodeSelect.dispatchEvent(o.definition)}}}};var cn=`:host {\r
    display: block;\r
    font-family: var(--potatno-font-family);\r
    font-size: var(--potatno-font-size);\r
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
    box-sizing: border-box;\r
    display: flex;\r
    flex-direction: column;\r
    min-height: 100%;\r
\r
    box-shadow: 0 2px 8px var(--potatno-color-shadow);\r
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
        outline: 1px transparent;        \r
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
}`;var un=`<!-- Resizeable part of node -->\r
<potatno-resize-box #ResizeBox class="node {{this.editMode ? 'edit' : ''}}" top="true" right="true" bottom="true" left="true" [snap]="25" [virtual]="true" (resize)="this.transformNodeData($event.value)">\r
    <div class="node-header" (pointerdown)="this.dragNodeOrEnableEdit($event)">\r
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
</potatno-resize-box>\r
`;function zs(){function p(c,n){return function(l){e(n,"addInitializer"),o(l,"An initializer"),c.push(l)}}function t(c,n,u,l,r,b,v,E,w){var f;switch(r){case 1:f="accessor";break;case 2:f="method";break;case 3:f="getter";break;case 4:f="setter";break;default:f="field"}var s={kind:f,name:v?"#"+n:n,static:b,private:v,metadata:E},m={v:!1};s.addInitializer=p(l,m);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return c(w,s)}finally{m.v=!0}}function e(c,n){if(c.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(c,n){if(typeof c!="function")throw new TypeError(n+" must be a function")}function a(c,n){var u=typeof n;if(c===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var l;throw c===0?l="field":c===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function d(c,n,u,l,r,b,v,E,w){var f=u[0],s,m,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,P;if(typeof f=="function")h=t(f,l,s,E,r,b,v,w,i),h!==void 0&&(a(r,h),r===0?m=h:r===1?(m=h.init,x=h.get||i.get,P=h.set||i.set,i={get:x,set:P}):i=h);else for(var M=f.length-1;M>=0;M--){var S=f[M];if(h=t(S,l,s,E,r,b,v,w,i),h!==void 0){a(r,h);var A;r===0?A=h:r===1?(A=h.init,x=h.get||i.get,P=h.set||i.set,i={get:x,set:P}):i=h,A!==void 0&&(m===void 0?m=A:typeof m=="function"?m=[m,A]:m.push(A))}}if(r===0||r===1){if(m===void 0)m=function(I,D){return D};else if(typeof m!="function"){var F=m;m=function(I,D){for(var L=D,_=0;_<F.length;_++)L=F[_].call(I,L);return L}}else{var z=m;m=function(I,D){return z.call(I,D)}}c.push(m)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(c.push(function(I,D){return i.get.call(I,D)}),c.push(function(I,D){return i.set.call(I,D)})):r===2?c.push(i):c.push(function(I,D){return i.call(I,D)}):Object.defineProperty(n,l,s))}function g(c,n,u){for(var l=[],r,b,v=new Map,E=new Map,w=0;w<n.length;w++){var f=n[w];if(Array.isArray(f)){var s=f[1],m=f[2],i=f.length>3,h=s>=5,x,P;if(h?(x=c,s=s-5,b=b||[],P=b):(x=c.prototype,r=r||[],P=r),s!==0&&!i){var M=h?E:v,S=M.get(m)||0;if(S===!0||S===3&&s!==4||S===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+m);!S&&s>2?M.set(m,s):M.set(m,!0)}d(l,x,f,m,s,h,i,P,u)}}return y(l,r),y(l,b),l}function y(c,n){n&&c.push(function(u){for(var l=0;l<n.length;l++)n[l].call(u);return u})}function T(c,n,u){if(n.length>0){for(var l=[],r=c,b=c.name,v=n.length-1;v>=0;v--){var E={v:!1};try{var w=n[v](r,{kind:"class",name:b,addInitializer:p(l,E),metadata:u})}finally{E.v=!0}w!==void 0&&(a(10,w),r=w)}return[C(r,u),function(){for(var f=0;f<l.length;f++)l[f].call(r)}]}}function C(c,n){return Object.defineProperty(c,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,l,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),E=g(n,u,v);return l.length||C(n,v),{e:E,get c(){return T(n,l,v)}}}}function yn(p,t,e,o){return(yn=zs())(p,t,e,o)}var bn,hn,wn,xn,Tn,En,mn,dn,fn,pn,gn,br;bn=Y({selector:"potatno-comment-node",template:un,style:cn,components:[qt]}),wn=$.state(),xn=yt("node-drag"),Tn=bt("ResizeBox"),En=bt("CommentInput");var vn=class{static{({e:[mn,dn,fn,pn,gn],c:[br,hn]}=yn(this,[[wn,1,"editMode"],[tt,3,"nodeData"],[xn,1,"mDrag"],[Tn,1,"resizeBox"],[En,1,"commentInput"]],[bn]))}constructor(t=R.use(G),e=R.use(X)){this.mComponent=t,this.mManager=e,this.mNodeData=null,this.mDoubleClickState=null,this.editMode=!1,this.mUnsubscribe=this.mManager.subscribe(O.Node,o=>{o.item===this.nodeData&&this.resyncComponent(this.nodeData)})}mComponent;mManager;mUnsubscribe;mNodeData;mDoubleClickState;#t=(gn(this),mn(this));get editMode(){return this.#t}set editMode(t){this.#t=t}get nodeData(){return this.mNodeData}set nodeData(t){this.mNodeData=t,t&&(this.resyncComponent(t),this.mComponent.updater.update())}#e=dn(this);get mDrag(){return this.#e}set mDrag(t){this.#e=t}#r=fn(this);get resizeBox(){return this.#r}set resizeBox(t){this.#r=t}get comment(){return this.nodeData?.label??""}set comment(t){this.nodeData&&(this.nodeData.label=t)}#o=pn(this);get commentInput(){return this.#o}set commentInput(t){this.#o=t}onConnect(){this.nodeData&&this.resyncComponent(this.nodeData)}onDeconstruct(){this.mUnsubscribe()}onUpdate(){this.commentInput&&this.getFocusedElement(document)!==this.commentInput&&this.commentInput.select()}getFocusedElement(t){let e=t.activeElement;return e?e.shadowRoot?this.getFocusedElement(e.shadowRoot):e:null}dragNodeOrEnableEdit(t){if(!this.nodeData||(this.mDoubleClickState?this.editMode=!0:this.mDoubleClickState={timer:globalThis.setTimeout(()=>{this.mDoubleClickState=null},300)},this.editMode))return;t.preventDefault();let e=this.nodeData.transformation.x*this.mManager.grid.gridSize,o=this.nodeData.transformation.y*this.mManager.grid.gridSize,a=this.nodeData.transformation.x,d=this.nodeData.transformation.y,g=this.mComponent.element.getBoundingClientRect(),y=this.mComponent.element.offsetWidth?g.width/this.mComponent.element.offsetWidth:1,T=this.mComponent.element.offsetHeight?g.height/this.mComponent.element.offsetHeight:1,C=t.clientX,c=t.clientY,n=l=>{l.stopPropagation();let r=(l.clientX-C)/y,b=(l.clientY-c)/T,v=Math.round((e+r)/this.mManager.grid.gridSize),E=Math.round((o+b)/this.mManager.grid.gridSize);a===v&&d===E||(this.mManager.graph.transformNode(this.nodeData,w=>{w.moveTo(v,E)}),this.mDrag.dispatchEvent(new yr(v-a,E-d)),a=v,d=E)},u=()=>{document.removeEventListener("pointermove",n),document.removeEventListener("pointerup",u)};document.addEventListener("pointermove",n),document.addEventListener("pointerup",u)}escapeEditMode(t){(t.key==="Escape"||t.key==="Enter")&&(t.preventDefault(),this.editMode=!1)}transformNodeData(t){this.mManager.graph.transformNode(this.nodeData,e=>{let o=e.transformation.width,a=e.transformation.height;e.resizeTo(t.width/this.mManager.grid.gridSize,t.height/this.mManager.grid.gridSize);let d=e.transformation.width-o,g=e.transformation.height-a;g!==0&&(t.resizeHandle&wt.top)>0&&e.moveTo(e.transformation.x,e.transformation.y-g),d!==0&&(t.resizeHandle&wt.left)>0&&e.moveTo(e.transformation.x-d,e.transformation.y)})}resyncComponent(t){let e=t.transformation.x*this.mManager.grid.gridSize,o=t.transformation.y*this.mManager.grid.gridSize;if(this.mComponent.element.style.setProperty("left",`${e}px`),this.mComponent.element.style.setProperty("top",`${o}px`),this.resizeBox){let a=t.transformation.width*this.mManager.grid.gridSize,d=t.transformation.height*this.mManager.grid.gridSize;this.resizeBox.resize(a,d)}}static{hn()}},yr=class{mX;mY;get x(){return this.mX}get y(){return this.mY}constructor(t,e){this.mX=t,this.mY=e}};var Dn=`:host {\r
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
`;var In=`<svg #svgLayer class="svg-layer" xmlns="http://www.w3.org/2000/svg" (pointerdown)="this.onConnectionDelete($event)"></svg>\r
`;function Gs(){function p(c,n){return function(l){e(n,"addInitializer"),o(l,"An initializer"),c.push(l)}}function t(c,n,u,l,r,b,v,E,w){var f;switch(r){case 1:f="accessor";break;case 2:f="method";break;case 3:f="getter";break;case 4:f="setter";break;default:f="field"}var s={kind:f,name:v?"#"+n:n,static:b,private:v,metadata:E},m={v:!1};s.addInitializer=p(l,m);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return c(w,s)}finally{m.v=!0}}function e(c,n){if(c.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(c,n){if(typeof c!="function")throw new TypeError(n+" must be a function")}function a(c,n){var u=typeof n;if(c===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var l;throw c===0?l="field":c===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function d(c,n,u,l,r,b,v,E,w){var f=u[0],s,m,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,P;if(typeof f=="function")h=t(f,l,s,E,r,b,v,w,i),h!==void 0&&(a(r,h),r===0?m=h:r===1?(m=h.init,x=h.get||i.get,P=h.set||i.set,i={get:x,set:P}):i=h);else for(var M=f.length-1;M>=0;M--){var S=f[M];if(h=t(S,l,s,E,r,b,v,w,i),h!==void 0){a(r,h);var A;r===0?A=h:r===1?(A=h.init,x=h.get||i.get,P=h.set||i.set,i={get:x,set:P}):i=h,A!==void 0&&(m===void 0?m=A:typeof m=="function"?m=[m,A]:m.push(A))}}if(r===0||r===1){if(m===void 0)m=function(I,D){return D};else if(typeof m!="function"){var F=m;m=function(I,D){for(var L=D,_=0;_<F.length;_++)L=F[_].call(I,L);return L}}else{var z=m;m=function(I,D){return z.call(I,D)}}c.push(m)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(c.push(function(I,D){return i.get.call(I,D)}),c.push(function(I,D){return i.set.call(I,D)})):r===2?c.push(i):c.push(function(I,D){return i.call(I,D)}):Object.defineProperty(n,l,s))}function g(c,n,u){for(var l=[],r,b,v=new Map,E=new Map,w=0;w<n.length;w++){var f=n[w];if(Array.isArray(f)){var s=f[1],m=f[2],i=f.length>3,h=s>=5,x,P;if(h?(x=c,s=s-5,b=b||[],P=b):(x=c.prototype,r=r||[],P=r),s!==0&&!i){var M=h?E:v,S=M.get(m)||0;if(S===!0||S===3&&s!==4||S===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+m);!S&&s>2?M.set(m,s):M.set(m,!0)}d(l,x,f,m,s,h,i,P,u)}}return y(l,r),y(l,b),l}function y(c,n){n&&c.push(function(u){for(var l=0;l<n.length;l++)n[l].call(u);return u})}function T(c,n,u){if(n.length>0){for(var l=[],r=c,b=c.name,v=n.length-1;v>=0;v--){var E={v:!1};try{var w=n[v](r,{kind:"class",name:b,addInitializer:p(l,E),metadata:u})}finally{E.v=!0}w!==void 0&&(a(10,w),r=w)}return[C(r,u),function(){for(var f=0;f<l.length;f++)l[f].call(r)}]}}function C(c,n){return Object.defineProperty(c,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,l,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),E=g(n,u,v);return l.length||C(n,v),{e:E,get c(){return T(n,l,v)}}}}function An(p,t,e,o){return(An=Gs())(p,t,e,o)}var Nn,Cn,Ln,Pn,Mn,wr;Nn=Y({selector:"potatno-connection-layer",template:In,style:Dn}),Ln=bt("svgLayer");var Sn=class{static{({e:[Pn,Mn],c:[wr,Cn]}=An(this,[[Ln,1,"svgLayer"]],[Nn]))}constructor(t=R.use(X)){this.mConnectionRegistry=new Map,this.mManager=t;let e=0;this.mUnsubscribe=this.mManager.subscribe(O.SpecialActiveFunction|O.Node|O.Connection,()=>{e===0&&(e=requestAnimationFrame(()=>{e=0,this.renderConnections()}))})}mConnectionRegistry;mManager;mUnsubscribe;#t=(Mn(this),Pn(this));get svgLayer(){return this.#t}set svgLayer(t){this.#t=t}onConnectionDelete(t){if(t.button!==2||!(t.target instanceof Element))return;let e=parseInt(t.target.getAttribute("data-connection-id")??"");if(isNaN(e))return;t.preventDefault(),t.stopPropagation();let o=this.mConnectionRegistry.get(e);o&&this.mManager.graph.disconnectPorts(o.sourcePort,o.targetPort)}onDeconstruct(){this.mUnsubscribe()}renderConnectionPath(t,e,o,a,d){let g="http://www.w3.org/2000/svg",y=this.mManager.connections.getConnectionPath(o,a),T=document.createElementNS(g,"path");T.classList.add("path"),T.classList.toggle(".path--invalid",!d),T.setAttribute("d",y),o.portType==="value"&&T.style.setProperty("--path-color",this.mManager.generateStringColor(o.resolvedDataType));let C=document.createElementNS(g,"path");C.classList.add("path","path--mouse-target"),C.setAttribute("d",y),C.setAttribute("data-connection-id",e.toString()),t.appendChild(T),t.appendChild(C)}renderConnections(){if(!this.svgLayer)return;this.svgLayer.innerHTML="",this.mConnectionRegistry.clear();let t=this.mManager.activeFunction;if(!t)return;let e=this.mManager.integrity.errorItems,o=0;for(let a of t.nodes)for(let d of a.outputs.list)for(let g of d.connectedPorts){let y=o++;this.mConnectionRegistry.set(y,{sourcePort:d,targetPort:g});let T=e.has(d)||e.has(g);this.renderConnectionPath(this.svgLayer,y,d,g,!T)}}static{Cn()}};function Bs(){function p(c,n){return function(l){e(n,"addInitializer"),o(l,"An initializer"),c.push(l)}}function t(c,n,u,l,r,b,v,E,w){var f;switch(r){case 1:f="accessor";break;case 2:f="method";break;case 3:f="getter";break;case 4:f="setter";break;default:f="field"}var s={kind:f,name:v?"#"+n:n,static:b,private:v,metadata:E},m={v:!1};s.addInitializer=p(l,m);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return c(w,s)}finally{m.v=!0}}function e(c,n){if(c.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(c,n){if(typeof c!="function")throw new TypeError(n+" must be a function")}function a(c,n){var u=typeof n;if(c===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var l;throw c===0?l="field":c===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function d(c,n,u,l,r,b,v,E,w){var f=u[0],s,m,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,P;if(typeof f=="function")h=t(f,l,s,E,r,b,v,w,i),h!==void 0&&(a(r,h),r===0?m=h:r===1?(m=h.init,x=h.get||i.get,P=h.set||i.set,i={get:x,set:P}):i=h);else for(var M=f.length-1;M>=0;M--){var S=f[M];if(h=t(S,l,s,E,r,b,v,w,i),h!==void 0){a(r,h);var A;r===0?A=h:r===1?(A=h.init,x=h.get||i.get,P=h.set||i.set,i={get:x,set:P}):i=h,A!==void 0&&(m===void 0?m=A:typeof m=="function"?m=[m,A]:m.push(A))}}if(r===0||r===1){if(m===void 0)m=function(I,D){return D};else if(typeof m!="function"){var F=m;m=function(I,D){for(var L=D,_=0;_<F.length;_++)L=F[_].call(I,L);return L}}else{var z=m;m=function(I,D){return z.call(I,D)}}c.push(m)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(c.push(function(I,D){return i.get.call(I,D)}),c.push(function(I,D){return i.set.call(I,D)})):r===2?c.push(i):c.push(function(I,D){return i.call(I,D)}):Object.defineProperty(n,l,s))}function g(c,n,u){for(var l=[],r,b,v=new Map,E=new Map,w=0;w<n.length;w++){var f=n[w];if(Array.isArray(f)){var s=f[1],m=f[2],i=f.length>3,h=s>=5,x,P;if(h?(x=c,s=s-5,b=b||[],P=b):(x=c.prototype,r=r||[],P=r),s!==0&&!i){var M=h?E:v,S=M.get(m)||0;if(S===!0||S===3&&s!==4||S===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+m);!S&&s>2?M.set(m,s):M.set(m,!0)}d(l,x,f,m,s,h,i,P,u)}}return y(l,r),y(l,b),l}function y(c,n){n&&c.push(function(u){for(var l=0;l<n.length;l++)n[l].call(u);return u})}function T(c,n,u){if(n.length>0){for(var l=[],r=c,b=c.name,v=n.length-1;v>=0;v--){var E={v:!1};try{var w=n[v](r,{kind:"class",name:b,addInitializer:p(l,E),metadata:u})}finally{E.v=!0}w!==void 0&&(a(10,w),r=w)}return[C(r,u),function(){for(var f=0;f<l.length;f++)l[f].call(r)}]}}function C(c,n){return Object.defineProperty(c,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,l,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),E=g(n,u,v);return l.length||C(n,v),{e:E,get c(){return T(n,l,v)}}}}function On(p,t,e,o){return(On=Bs())(p,t,e,o)}var Fn,_n,Pe;Fn=vt({access:W.Read,selector:/^potatno-preview$/});var Rn=class{static{({c:[Pe,_n]}=On(this,[],[Fn]))}constructor(t=R.use(Q),e=R.use(H),o=R.use(ot)){this.mTarget=t,this.mProcedure=e.createExpressionProcedure(o.value)}mProcedure;mTarget;onUpdate(){let t=this.mProcedure.execute();if(!t){let o=this.mTarget.childNodes.length>0;return o&&(this.mTarget.innerHTML=""),o}let e=t.element;return this.mTarget.contains(e)?!1:(this.mTarget.innerHTML="",this.mTarget.appendChild(e),!0)}static{_n()}};var jn=`:host {\r
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
    /* Make it slightly passthrough so drawn lines can be seen */\r
    opacity: 0.75;\r
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
                    background-color: var(--potatno-port-color);\r
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
                    background-color: var(--potatno-port-color);\r
                }\r
\r
                &:not(.connected)::before {\r
                    background-color: color-mix(in srgb, var(--potatno-port-color) 30%, var(--potatno-color-background));\r
                }\r
\r
                &.error::before {\r
                    background-color: var(--potatno-color-error);\r
                }\r
\r
                .output & {\r
                    &::after {\r
                        right: 1px;\r
                        border-left: calc(var(--potatno-port-flow-size) / 3) solid var(--potatno-port-color);\r
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
                        border-right: calc(var(--potatno-port-flow-size) / 3) solid var(--potatno-port-color);\r
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
                background-color: var(--potatno-port-color);\r
                border: 1px solid var(--potatno-port-color);\r
                border-radius: 50%;\r
                height: calc(var(--potatno-port-value-size) - 1px);\r
                width: calc(var(--potatno-port-value-size) - 1px);\r
\r
                &.connected {\r
                    background-color: var(--potatno-port-color);\r
                }\r
\r
                &:not(.connected) {\r
                    background-color: color-mix(in srgb, var(--potatno-port-color) 30%, var(--potatno-color-background));\r
                }\r
\r
                &.error {\r
                    background-color: var(--potatno-color-error);\r
                }\r
            }\r
\r
            &.error {\r
                filter: drop-shadow(0 0 4px var(--potatno-color-error));\r
            }\r
        }\r
    }\r
}`;var zn=`<div class="port-wrapper {{this.portDirection}}" style="--type-color: {{this.portColor}}" (dragover)="this.onDragOver($event)" (drop)="this.onDrop($event)">\r
\r
    <!-- Actual port handle. -->\r
    <div class="port" draggable="true" [title]="this.portType" (dragstart)="this.onDragStart($event)" (dragend)="this.onDragEnd($event)">\r
        <div class="port__handle">\r
            <div class="port-handle {{this.portHandleClasses}}"></div>\r
        </div>\r
        <div class="port__label">{{this.portName}}</div>\r
    </div>\r
\r
    <svg #dragConnection class="port-drag-connetion" xmlns="http://www.w3.org/2000/svg"></svg>\r
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
`;function Xs(){function p(c,n){return function(l){e(n,"addInitializer"),o(l,"An initializer"),c.push(l)}}function t(c,n,u,l,r,b,v,E,w){var f;switch(r){case 1:f="accessor";break;case 2:f="method";break;case 3:f="getter";break;case 4:f="setter";break;default:f="field"}var s={kind:f,name:v?"#"+n:n,static:b,private:v,metadata:E},m={v:!1};s.addInitializer=p(l,m);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return c(w,s)}finally{m.v=!0}}function e(c,n){if(c.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(c,n){if(typeof c!="function")throw new TypeError(n+" must be a function")}function a(c,n){var u=typeof n;if(c===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var l;throw c===0?l="field":c===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function d(c,n,u,l,r,b,v,E,w){var f=u[0],s,m,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,P;if(typeof f=="function")h=t(f,l,s,E,r,b,v,w,i),h!==void 0&&(a(r,h),r===0?m=h:r===1?(m=h.init,x=h.get||i.get,P=h.set||i.set,i={get:x,set:P}):i=h);else for(var M=f.length-1;M>=0;M--){var S=f[M];if(h=t(S,l,s,E,r,b,v,w,i),h!==void 0){a(r,h);var A;r===0?A=h:r===1?(A=h.init,x=h.get||i.get,P=h.set||i.set,i={get:x,set:P}):i=h,A!==void 0&&(m===void 0?m=A:typeof m=="function"?m=[m,A]:m.push(A))}}if(r===0||r===1){if(m===void 0)m=function(I,D){return D};else if(typeof m!="function"){var F=m;m=function(I,D){for(var L=D,_=0;_<F.length;_++)L=F[_].call(I,L);return L}}else{var z=m;m=function(I,D){return z.call(I,D)}}c.push(m)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(c.push(function(I,D){return i.get.call(I,D)}),c.push(function(I,D){return i.set.call(I,D)})):r===2?c.push(i):c.push(function(I,D){return i.call(I,D)}):Object.defineProperty(n,l,s))}function g(c,n,u){for(var l=[],r,b,v=new Map,E=new Map,w=0;w<n.length;w++){var f=n[w];if(Array.isArray(f)){var s=f[1],m=f[2],i=f.length>3,h=s>=5,x,P;if(h?(x=c,s=s-5,b=b||[],P=b):(x=c.prototype,r=r||[],P=r),s!==0&&!i){var M=h?E:v,S=M.get(m)||0;if(S===!0||S===3&&s!==4||S===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+m);!S&&s>2?M.set(m,s):M.set(m,!0)}d(l,x,f,m,s,h,i,P,u)}}return y(l,r),y(l,b),l}function y(c,n){n&&c.push(function(u){for(var l=0;l<n.length;l++)n[l].call(u);return u})}function T(c,n,u){if(n.length>0){for(var l=[],r=c,b=c.name,v=n.length-1;v>=0;v--){var E={v:!1};try{var w=n[v](r,{kind:"class",name:b,addInitializer:p(l,E),metadata:u})}finally{E.v=!0}w!==void 0&&(a(10,w),r=w)}return[C(r,u),function(){for(var f=0;f<l.length;f++)l[f].call(r)}]}}function C(c,n){return Object.defineProperty(c,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,l,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),E=g(n,u,v);return l.length||C(n,v),{e:E,get c(){return T(n,l,v)}}}}function Bn(p,t,e,o){return(Bn=Xs())(p,t,e,o)}function Ys(p){return p}var Un,Vn,Hn,$n,Gn,Je;Un=Y({selector:"potatno-port",template:zn,style:jn}),Hn=bt("dragConnection");new class extends Ys{constructor(){super(Je),Vn()}static{class p{static{({e:[$n,Gn],c:[Je,Vn]}=Bn(this,[[Hn,1,"dragConnectionSvg"],[tt,3,"port"]],[Un]))}static DRAG_MIME_TYPE="application/x-potatno-port";static mDraggedPortInformation;mComponent;mDragPositionEventHandler;mManager;mPort;mUnsubscribe;get dragPositionEventHandler(){return this.mDragPositionEventHandler}#t=(Gn(this),$n(this));get dragConnectionSvg(){return this.#t}set dragConnectionSvg(e){this.#t=e}get hasError(){return this.port===null?!1:this.mManager.integrity.errorItems.has(this.port)}get inputDefinitions(){if(!this.port)return new Array;let e=this.port.project.types.getType(this.port.resolvedDataType);return e.inputs.map((o,a)=>({htmlType:(()=>{switch(o.type){case"boolean":return"checkbox";case"number":return"number";case"string":return"text"}})(),index:a,name:o.name,value:this.port.directValue[a]??"",totalCount:e.inputs.length}))}get port(){return this.mPort}set port(e){if(this.mPort!==e){if(e===null)throw new N("A null port cant be assigned.",this);this.mPort=e,this.mComponent.updater.update()}}get portColor(){return!this.port||this.port.portType==="flow"?"var(--potatno-color-text)":this.mManager.generateStringColor(this.port.resolvedDataType)}get portDirection(){return this.port?.direction??"output"}get portHandleClasses(){if(!this.port)return"";let e=[this.port.portType];return this.port.connectedPorts.size>0&&e.push("connected"),this.hasError&&e.push("error"),e.join(" ")}get portName(){return this.port?.label??""}get portType(){return!this.port||this.port.portType!=="value"?"":this.port.resolvedDataType??""}get showValueInput(){return!this.port||this.port.portType!=="value"||this.port.direction!=="input"||this.port.connectedPorts.size>0||p.mDraggedPortInformation&&p.mDraggedPortInformation.port===this.port?!1:!this.port.node.project.types.isGenericType(this.port.dataType??"")}constructor(e=R.use(G),o=R.use(X)){this.mComponent=e,this.mManager=o,this.mPort=null,this.mDragPositionEventHandler=a=>{p.mDraggedPortInformation&&p.mDraggedPortInformation.port===this.port&&(performance.now()-a.timeStamp>100||this.renderDragWire(a.clientX,a.clientY))},this.mUnsubscribe=this.mManager.subscribe(O.Connection,()=>{this.mComponent.updater.updateAsync()})}onConnect(){document.addEventListener("dragover",this.mDragPositionEventHandler,{capture:!0})}onDeconstruct(){this.mUnsubscribe(),document.removeEventListener("dragover",this.mDragPositionEventHandler,{capture:!0})}onDirectValueInput(e,o){if(!this.port)return;let a=e.target,d=[...this.port.directValue];d[o]=a.type==="checkbox"?a.checked?"true":"false":a.value,this.mManager.graph.setPortDirectValue(this.port,d)}onDragEnd(e){e.stopPropagation(),e.preventDefault(),this.dragConnectionSvg&&(this.dragConnectionSvg.innerHTML=""),this.mComponent.updater.updateAsync()}onDragOver(e){this.draggedPortCanConnect(e.dataTransfer)&&(e.preventDefault(),e.stopPropagation(),e.dataTransfer&&(e.dataTransfer.dropEffect="link"))}onDragStart(e){if(!this.port||!e.dataTransfer){e.preventDefault();return}e.stopPropagation(),e.dataTransfer.effectAllowed="link",e.dataTransfer.setData(p.DRAG_MIME_TYPE,this.port.definitionId),e.dataTransfer.setDragImage(document.createElement("div"),0,0);let o=this.mManager.connections.getPortGridPoint(this.port);this.port.direction==="input"&&(o.x-=1),p.mDraggedPortInformation={port:this.port,portPosition:{x:o.x+1,y:o.y},lastPointerGridPosition:{x:0,y:0}},this.mComponent.updater.updateAsync()}onDrop(e){if(!this.draggedPortCanConnect(e.dataTransfer)||(e.preventDefault(),e.stopPropagation(),!p.mDraggedPortInformation)||!this.port)return;let o=p.mDraggedPortInformation.port;this.mManager.graph.connectPorts(o,this.port)}createDragPath(e,o){if(!this.port)return"";let a=this.mManager.connections.pixelToGridSpace(e,o);return this.mManager.connections.createTemporaryPath(this.port,a)}draggedPortCanConnect(e){if(!this.port||!p.mDraggedPortInformation||!e||!e.types.includes(p.DRAG_MIME_TYPE))return!1;let o=p.mDraggedPortInformation.port;return o!==this.port&&o.direction!==this.port.direction&&o.portType===this.port.portType}renderDragWire(e,o){if(!p.mDraggedPortInformation||!this.dragConnectionSvg)return;let a=this.dragConnectionSvg.firstChild;a||(a=document.createElementNS("http://www.w3.org/2000/svg","path"),this.dragConnectionSvg.appendChild(a));let d=this.mManager.connections.pixelToGridSpace(e,o);if(d.x===p.mDraggedPortInformation.lastPointerGridPosition.x&&d.y===p.mDraggedPortInformation.lastPointerGridPosition.y)return;p.mDraggedPortInformation.lastPointerGridPosition.x=d.x,p.mDraggedPortInformation.lastPointerGridPosition.y=d.y;let g=p.mDraggedPortInformation.portPosition,y=g.x*this.mManager.grid.gridSize,T=g.y*this.mManager.grid.gridSize;this.dragConnectionSvg.style.setProperty("transform",`translate(${-y}px, ${-T}px)`),a.setAttribute("d",this.createDragPath(e,o))}}}};var Xn=`:host {\r
    display: block;\r
    font-family: var(--potatno-font-family);\r
    font-size: var(--potatno-font-size);\r
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
\r
    box-shadow: 0 2px 8px var(--potatno-color-shadow);\r
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
        --resize-box-handle-color: var(--potatno-color-error);\r
        box-shadow: 0 0 5px 0px var(--potatno-color-error), 0 2px 8px var(--potatno-color-shadow);\r
    }\r
}\r
\r
.node-header {\r
    display: flex;\r
    align-items: center;\r
    height: var(--potatno-grid-size);\r
    color: var(--potatno-color-text-contrast);\r
    background-color: var(--node-category-color);\r
    font-weight: bold;\r
    font-size: var(--potatno-font-size-small);\r
    cursor: grab;\r
\r
    &:active {\r
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
    /* Click animation. */\r
    transition: background-color 0.15s, translate 0.15s;\r
\r
    &:active {\r
        background-color: var(--potatno-color-background-light);\r
        translate: 0 1px;\r
    }\r
\r
    .icon {\r
        position: absolute;\r
        box-sizing: border-box;\r
        left: 50%;\r
        border: 0px solid var(--node-border-color);\r
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
            border: 0px solid var(--node-border-color);\r
            border-width: 0px 1px 1px 0;\r
            height: 100%;\r
            width: 100%;\r
            transition: border-color 0.15s;\r
        }\r
\r
        /* Hover animation scoped to parent */\r
        .node-preview-toggle:hover & {\r
            border-color: var(--potatno-color-accent);\r
\r
            &::before {\r
                border-color: var(--potatno-color-accent);\r
            }\r
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
    background-color: var(--potatno-color-background);\r
    box-shadow: 0 2px 8px var(--potatno-color-shadow);\r
    border: 1px solid var(--node-border-color);\r
\r
    /* Previews can size bigger than the node itself and expanding. Limit the width here. */\r
    width: calc(var(--potatno-grid-size) * var(--node-width) - 2px);\r
\r
    /* Small attached line */\r
    &::before {\r
        content: '';\r
        position: absolute;\r
        top: calc(var(--potatno-grid-size) / -2);\r
        left: 50%;\r
\r
        display: block;\r
        height: calc(var(--potatno-grid-size) / 2);\r
        border: 1px solid var(--node-border-color);\r
    }\r
\r
    .node-preview__window {\r
        display: flex;\r
        padding: 5px;\r
        background: var(--potatno-color-background-dark);\r
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
        gap: 2px;\r
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
            background: var(--potatno-color-background-light);\r
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
                background-color: var(--potatno-color-background-light);\r
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
                box-shadow: 0 2px 8px var(--potatno-color-shadow);\r
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
}`;var Yn=`<!-- Resizeable part of node -->\r
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
        `;function qs(){function p(c,n){return function(l){e(n,"addInitializer"),o(l,"An initializer"),c.push(l)}}function t(c,n,u,l,r,b,v,E,w){var f;switch(r){case 1:f="accessor";break;case 2:f="method";break;case 3:f="getter";break;case 4:f="setter";break;default:f="field"}var s={kind:f,name:v?"#"+n:n,static:b,private:v,metadata:E},m={v:!1};s.addInitializer=p(l,m);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return c(w,s)}finally{m.v=!0}}function e(c,n){if(c.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(c,n){if(typeof c!="function")throw new TypeError(n+" must be a function")}function a(c,n){var u=typeof n;if(c===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var l;throw c===0?l="field":c===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function d(c,n,u,l,r,b,v,E,w){var f=u[0],s,m,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,P;if(typeof f=="function")h=t(f,l,s,E,r,b,v,w,i),h!==void 0&&(a(r,h),r===0?m=h:r===1?(m=h.init,x=h.get||i.get,P=h.set||i.set,i={get:x,set:P}):i=h);else for(var M=f.length-1;M>=0;M--){var S=f[M];if(h=t(S,l,s,E,r,b,v,w,i),h!==void 0){a(r,h);var A;r===0?A=h:r===1?(A=h.init,x=h.get||i.get,P=h.set||i.set,i={get:x,set:P}):i=h,A!==void 0&&(m===void 0?m=A:typeof m=="function"?m=[m,A]:m.push(A))}}if(r===0||r===1){if(m===void 0)m=function(I,D){return D};else if(typeof m!="function"){var F=m;m=function(I,D){for(var L=D,_=0;_<F.length;_++)L=F[_].call(I,L);return L}}else{var z=m;m=function(I,D){return z.call(I,D)}}c.push(m)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(c.push(function(I,D){return i.get.call(I,D)}),c.push(function(I,D){return i.set.call(I,D)})):r===2?c.push(i):c.push(function(I,D){return i.call(I,D)}):Object.defineProperty(n,l,s))}function g(c,n,u){for(var l=[],r,b,v=new Map,E=new Map,w=0;w<n.length;w++){var f=n[w];if(Array.isArray(f)){var s=f[1],m=f[2],i=f.length>3,h=s>=5,x,P;if(h?(x=c,s=s-5,b=b||[],P=b):(x=c.prototype,r=r||[],P=r),s!==0&&!i){var M=h?E:v,S=M.get(m)||0;if(S===!0||S===3&&s!==4||S===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+m);!S&&s>2?M.set(m,s):M.set(m,!0)}d(l,x,f,m,s,h,i,P,u)}}return y(l,r),y(l,b),l}function y(c,n){n&&c.push(function(u){for(var l=0;l<n.length;l++)n[l].call(u);return u})}function T(c,n,u){if(n.length>0){for(var l=[],r=c,b=c.name,v=n.length-1;v>=0;v--){var E={v:!1};try{var w=n[v](r,{kind:"class",name:b,addInitializer:p(l,E),metadata:u})}finally{E.v=!0}w!==void 0&&(a(10,w),r=w)}return[C(r,u),function(){for(var f=0;f<l.length;f++)l[f].call(r)}]}}function C(c,n){return Object.defineProperty(c,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,l,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),E=g(n,u,v);return l.length||C(n,v),{e:E,get c(){return T(n,l,v)}}}}function ei(p,t,e,o){return(ei=qs())(p,t,e,o)}var ri,Wn,oi,ni,ii,si,ai,Zn,qn,Jn,Kn,Qn,kn,Tr;ri=Y({selector:"potatno-node",template:Yn,style:Xn,modules:[Pe],components:[Je]}),oi=yt("node-drag"),ni=$.state(),ii=$.state({proxy:!0}),si=$.state({complexValue:!0}),ai=$.state({complexValue:!0});var ti=class{static{({e:[Zn,qn,Jn,Kn,Qn,kn],c:[Tr,Wn]}=ei(this,[[oi,1,"mDrag"],[ni,1,"isPreviewDisplaySelectionOpen"],[tt,3,"nodeData"],[ii,1,"nodeTransformation"],[si,1,"previewPorts"],[ai,1,"previewDisplays"]],[ri]))}constructor(t=R.use(G),e=R.use(X)){this.mComponent=t,this.mManager=e,this.mNodeDefinition=null,this.mNodeData=null,this.isPreviewDisplaySelectionOpen=!1,this.nodeTransformation={height:0,width:0},this.previewPorts=new Array,this.previewDisplays=new Array,this.mUnsubscribe=this.mManager.subscribe(O.Node,o=>{o.item===this.nodeData&&this.resyncComponent(this.nodeData)})}mComponent;mManager;mNodeData;mNodeDefinition;mUnsubscribe;get canPreview(){return this.previewPorts.length>0}#t=(kn(this),Zn(this));get mDrag(){return this.#t}set mDrag(t){this.#t=t}get hasError(){if(!this.nodeData)return!1;if(this.mManager.integrity.errorItems.has(this.nodeData))return!0;for(let t of this.nodeData.inputs.list)if(this.mManager.integrity.errorItems.has(t))return!0;for(let t of this.nodeData.outputs.list)if(this.mManager.integrity.errorItems.has(t))return!0;return!1}get inputPorts(){return this.nodeData?this.nodeData.inputs.list:new Array}get isFunction(){return this.mNodeDefinition instanceof Mt}get isPreviewActive(){return!!this.nodeData?.preview}#e=qn(this);get isPreviewDisplaySelectionOpen(){return this.#e}set isPreviewDisplaySelectionOpen(t){this.#e=t}get nodeColor(){return this.mManager.generateStringColor(this.mNodeDefinition?.category.name??"")}get nodeData(){return this.mNodeData}set nodeData(t){this.mNodeData=t,this.mNodeDefinition=null,t&&(this.mNodeDefinition=this.mManager.activeFunction?this.mManager.activeFunction.nodeDefinitions.find(e=>e.id===this.nodeData.definitionId)??null:null,this.resyncComponent(t),this.mComponent.updater.update())}get nodeIcon(){return this.mNodeDefinition?.category.icon??""}get nodeLabel(){return this.nodeData?.label??""}#r=Jn(this);get nodeTransformation(){return this.#r}set nodeTransformation(t){this.#r=t}get outputPorts(){return this.nodeData?this.nodeData.outputs.list:new Array}#o=Kn(this);get previewPorts(){return this.#o}set previewPorts(t){this.#o=t}#n=Qn(this);get previewDisplays(){return this.#n}set previewDisplays(t){this.#n=t}get previewDisplayId(){return this.nodeData?.preview?.displayId??""}get previewDriver(){if(!this.nodeData?.preview)return null;let t=this.nodeData.outputs.map.get(this.nodeData.preview.portDefinitionId);return t?this.mManager.preview.requestDriver(t,this.nodeData.preview.displayId):null}get previewPortDefinitionId(){return this.nodeData?.preview?.portDefinitionId??""}dragNode(t){if(!this.nodeData)return;t.preventDefault();let e=this.nodeData.transformation.x*this.mManager.grid.gridSize,o=this.nodeData.transformation.y*this.mManager.grid.gridSize,a=this.nodeData.transformation.x,d=this.nodeData.transformation.y,g=this.mComponent.element.getBoundingClientRect(),y=this.mComponent.element.offsetWidth?g.width/this.mComponent.element.offsetWidth:1,T=this.mComponent.element.offsetHeight?g.height/this.mComponent.element.offsetHeight:1,C=t.clientX,c=t.clientY,n=l=>{l.stopPropagation();let r=(l.clientX-C)/y,b=(l.clientY-c)/T,v=Math.round((e+r)/this.mManager.grid.gridSize),E=Math.round((o+b)/this.mManager.grid.gridSize);a===v&&d===E||(this.mManager.graph.transformNode(this.nodeData,w=>{w.moveTo(v,E)}),this.mDrag.dispatchEvent(new xr(v-a,E-d)),a=v,d=E)},u=()=>{document.removeEventListener("pointermove",n),document.removeEventListener("pointerup",u)};document.addEventListener("pointermove",n),document.addEventListener("pointerup",u)}onDeconstruct(){this.mUnsubscribe()}openFunction(){this.mNodeDefinition instanceof Mt&&this.mManager.setActiveFunction(this.mNodeDefinition.function)}selectPreviewDisplay(t){this.mManager.graph.updateNode(this.nodeData,e=>{e.preview={portDefinitionId:e.preview.portDefinitionId,displayId:t}}),document.activeElement instanceof HTMLElement&&document.activeElement.blur()}selectPreviewPort(t){if(!this.nodeData)return;let e=(()=>{let o=this.previewPorts;return o.length===0?null:typeof t<"u"?o.find(a=>a.definitionId===t)??null:this.nodeData.preview?null:o[0]})();if(!e)return this.mManager.graph.updateNode(this.nodeData,o=>{o.preview=null});this.mManager.graph.updateNode(this.nodeData,o=>{let a=o.project.getFunction(o.function.definitionId),d=o.project.preview.availableDisplays(a,e.resolvedDataType);d.length===0&&(o.preview=null);let g=o.preview&&d.includes(o.preview.displayId)?o.preview.displayId:d[0];o.preview={portDefinitionId:e.definitionId,displayId:g}}),this.resyncComponent(this.nodeData)}getPreviewDisplays(t){if(!this.nodeData||!t)return new Array;let e=this.nodeData.outputs.map.get(t);if(!e)return new Array;let o=e.project.getFunction(e.node.function.definitionId);return o?e.project.preview.availableDisplays(o,e.resolvedDataType).map(d=>({id:d,label:e.project.preview.getDisplay(d)?.name??d})):new Array}getPreviewablePorts(t){if(!this.mManager.activeFunction)return new Array;let e=t.project.getFunction(t.function.definitionId);if(!this.mManager.activeFunction.dynamicNodeDefinitions.find(d=>d.id===t.definitionId))return new Array;let a=new Map;return t.outputs.value.filter(d=>{let g=d.resolvedDataType;if(a.has(g))return a.get(g);let y=t.project.preview.availableDisplays(e,d.resolvedDataType);return a.set(g,y.length>0),a.get(g)})}resyncComponent(t){let e=t.transformation.x*this.mManager.grid.gridSize,o=t.transformation.y*this.mManager.grid.gridSize;this.mComponent.element.style.setProperty("left",`${e}px`),this.mComponent.element.style.setProperty("top",`${o}px`),this.nodeTransformation.width=t.transformation.width,this.nodeTransformation.height=t.transformation.height,this.previewPorts=this.getPreviewablePorts(this.nodeData),this.previewDisplays=this.getPreviewDisplays(t.preview?.portDefinitionId??null)}static{Wn()}},xr=class{mX;mY;get x(){return this.mX}get y(){return this.mY}constructor(t,e){this.mX=t,this.mY=e}};var li=`:host {\r
    position: relative;\r
    flex: 1;\r
    display: flex;\r
    min-height: 0;\r
    min-width: 0;\r
    overflow: hidden;\r
}\r
\r
.grid-background {\r
    flex: 1;\r
\r
    background-size: 0px 0px;\r
    background-position: 0px 0px;\r
    background-color: var(--potatno-color-background);\r
    background-image: url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20100%20100%22%3E%3Cpath%20d%3D%22M0%200h18M0%200v18M100%200H82M100%200v18M0%20100h18M0%20100V82M100%20100H82M100%20100V82%22%20stroke%3D%22%23313244%22%20stroke-width%3D%225%22%20stroke-linecap%3D%22round%22%2F%3E%3C%2Fsvg%3E");\r
}\r
\r
.grid-content {\r
    position: absolute;\r
    top: 0;\r
    left: 0;\r
\r
    .grid-content__node {\r
        position: absolute;\r
        border-radius: 2px;\r
\r
        &.selected {\r
            filter: drop-shadow(0px 0px 3px var(--potatno-color-accent));\r
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
}`;var ci=`<!-- Serves only as a background. -->\r
<div class="grid-background" [style]="this.gridBackgroundStyle"></div>\r
\r
<div class="grid-content" [style]="this.gridTransformStyle">\r
    <potatno-connection-layer/>\r
\r
    $for(node of this.nodes) {\r
        $if(this.typeOfNode(this.node) === 'node') {\r
            <potatno-node class="grid-content__node {{this.selectedNode.has(this.node) ? 'selected' : ''}}" [nodeData]="this.node" (node-drag)="this.moveAllSelected(this.node, $event.value)" (pointerdown)="this.selectNode(this.node, $event)"/>\r
        }\r
\r
        $if(this.typeOfNode(this.node) === 'conjunction') {\r
            <potatno-node class="grid-content__node {{this.selectedNode.has(this.node) ? 'selected' : ''}}" [nodeData]="this.node" (node-drag)="this.moveAllSelected(this.node, $event.value)" (pointerdown)="this.selectNode(this.node, $event)"/>\r
        }\r
\r
        $if(this.typeOfNode(this.node) === 'comment') {\r
            <potatno-comment-node class="grid-content__node {{this.selectedNode.has(this.node) ? 'selected' : ''}}" [nodeData]="this.node" (node-drag)="this.moveAllSelected(this.node, $event.value)" (pointerdown)="this.selectNode(this.node, $event)"/>\r
        }\r
    }\r
</div>\r
\r
$if(this.selectBox !== null) {\r
    <div class="selection-box" style="left: {{this.selectBox.x}}px; top: {{this.selectBox.y}}px; width: {{this.selectBox.width}}px; height: {{this.selectBox.height}}px;"></div>\r
}\r
\r
$if(this.popupPosition !== null) {\r
    <potatno-node-selection-popup style="left: {{this.popupPosition.local.x}}px; top: {{this.popupPosition.local.y}}px;" (node-select)="this.createNodeOnPopupPosition($event.value)"/>\r
}\r
`;function Qs(){function p(c,n){return function(l){e(n,"addInitializer"),o(l,"An initializer"),c.push(l)}}function t(c,n,u,l,r,b,v,E,w){var f;switch(r){case 1:f="accessor";break;case 2:f="method";break;case 3:f="getter";break;case 4:f="setter";break;default:f="field"}var s={kind:f,name:v?"#"+n:n,static:b,private:v,metadata:E},m={v:!1};s.addInitializer=p(l,m);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return c(w,s)}finally{m.v=!0}}function e(c,n){if(c.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(c,n){if(typeof c!="function")throw new TypeError(n+" must be a function")}function a(c,n){var u=typeof n;if(c===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var l;throw c===0?l="field":c===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function d(c,n,u,l,r,b,v,E,w){var f=u[0],s,m,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,P;if(typeof f=="function")h=t(f,l,s,E,r,b,v,w,i),h!==void 0&&(a(r,h),r===0?m=h:r===1?(m=h.init,x=h.get||i.get,P=h.set||i.set,i={get:x,set:P}):i=h);else for(var M=f.length-1;M>=0;M--){var S=f[M];if(h=t(S,l,s,E,r,b,v,w,i),h!==void 0){a(r,h);var A;r===0?A=h:r===1?(A=h.init,x=h.get||i.get,P=h.set||i.set,i={get:x,set:P}):i=h,A!==void 0&&(m===void 0?m=A:typeof m=="function"?m=[m,A]:m.push(A))}}if(r===0||r===1){if(m===void 0)m=function(I,D){return D};else if(typeof m!="function"){var F=m;m=function(I,D){for(var L=D,_=0;_<F.length;_++)L=F[_].call(I,L);return L}}else{var z=m;m=function(I,D){return z.call(I,D)}}c.push(m)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(c.push(function(I,D){return i.get.call(I,D)}),c.push(function(I,D){return i.set.call(I,D)})):r===2?c.push(i):c.push(function(I,D){return i.call(I,D)}):Object.defineProperty(n,l,s))}function g(c,n,u){for(var l=[],r,b,v=new Map,E=new Map,w=0;w<n.length;w++){var f=n[w];if(Array.isArray(f)){var s=f[1],m=f[2],i=f.length>3,h=s>=5,x,P;if(h?(x=c,s=s-5,b=b||[],P=b):(x=c.prototype,r=r||[],P=r),s!==0&&!i){var M=h?E:v,S=M.get(m)||0;if(S===!0||S===3&&s!==4||S===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+m);!S&&s>2?M.set(m,s):M.set(m,!0)}d(l,x,f,m,s,h,i,P,u)}}return y(l,r),y(l,b),l}function y(c,n){n&&c.push(function(u){for(var l=0;l<n.length;l++)n[l].call(u);return u})}function T(c,n,u){if(n.length>0){for(var l=[],r=c,b=c.name,v=n.length-1;v>=0;v--){var E={v:!1};try{var w=n[v](r,{kind:"class",name:b,addInitializer:p(l,E),metadata:u})}finally{E.v=!0}w!==void 0&&(a(10,w),r=w)}return[C(r,u),function(){for(var f=0;f<l.length;f++)l[f].call(r)}]}}function C(c,n){return Object.defineProperty(c,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,l,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),E=g(n,u,v);return l.length||C(n,v),{e:E,get c(){return T(n,l,v)}}}}function fi(p,t,e,o){return(fi=Qs())(p,t,e,o)}function ks(p){return p}var pi,ui,gi,vi,hi,mi,di,Ke;pi=Y({selector:"potatno-node-graph",template:ci,style:li,components:[ie,Tr,br,wr]}),gi=$.state({complexValue:!0}),vi=$.state();new class extends ks{constructor(){super(Ke),ui()}static{class p{static{({e:[hi,mi,di],c:[Ke,ui]}=fi(this,[[gi,1,"selectBox"],[vi,1,"popupPosition"]],[pi]))}static ZOOM_STRENGTH=.1;mComponent;mManager;mSelectedNodes;mKeyboardHandler;mIsMouseInsideGrid;mUnsubscribeFunctionChange;mUnsubscribeGraphChange;#t=(di(this),hi(this));get selectBox(){return this.#t}set selectBox(e){this.#t=e}#e=mi(this);get popupPosition(){return this.#e}set popupPosition(e){this.#e=e}get gridBackgroundStyle(){let e=this.mManager.grid.gridSize*this.mManager.grid.zoom,o=this.mManager.grid.panX%e,a=this.mManager.grid.panY%e;return`background-size: ${e}px ${e}px; background-position: ${o}px ${a}px;`}get gridTransformStyle(){return`transform: translate(${this.mManager.grid.panX}px, ${this.mManager.grid.panY}px) scale(${this.mManager.grid.zoom})`}get nodes(){return this.mManager.activeFunction?this.mManager.activeFunction.nodes:new Set}get selectedNode(){return this.mSelectedNodes}constructor(e=R.use(G),o=R.use(X)){this.mComponent=e,this.mManager=o,this.mSelectedNodes=new Set,this.mIsMouseInsideGrid=!1,this.popupPosition=null,this.selectBox=null,e.element.addEventListener("pointerdown",a=>{this.onPointerDown(a)}),e.element.addEventListener("wheel",a=>{this.onScroll(a)}),e.element.addEventListener("contextmenu",a=>{a.preventDefault()}),e.element.addEventListener("pointerenter",()=>{this.mIsMouseInsideGrid=!0}),e.element.addEventListener("pointerleave",()=>{this.mIsMouseInsideGrid=!1}),this.mKeyboardHandler=a=>{this.onKeyDown(a)},document.addEventListener("keydown",this.mKeyboardHandler),this.mUnsubscribeFunctionChange=this.mManager.subscribe(O.Document|O.Function|O.SpecialActiveFunction,()=>{this.popupPosition=null,this.selectBox=null,this.clearSelection()}),this.mUnsubscribeGraphChange=this.mManager.subscribe(O.NodeAdd|O.NodeDelete|O.SpecialGrid,()=>{this.mComponent.updater.updateAsync()})}onConnect(){this.mManager.connections.gridElement=this.mComponent.element}onDeconstruct(){this.mUnsubscribeFunctionChange(),this.mUnsubscribeGraphChange(),document.removeEventListener("keydown",this.mKeyboardHandler)}onPointerDown(e){switch(this.popupPosition=null,e.button){case 0:{e.ctrlKey||this.clearSelection(),this.pointerDrag(e,"selecting");return}case 1:{e.preventDefault(),this.pointerDrag(e,"panning");return}case 2:{this.openAddNodePopupAtPointer(e.clientX,e.clientY);return}}}onScroll(e){e.preventDefault();let o=e.deltaY>0?-1:1,a=this.convertGlobalToGridPosition(e.clientX,e.clientY);this.mManager.grid.zoomAt(a.x,a.y,o*p.ZOOM_STRENGTH)}createNodeOnPopupPosition(e){if(!this.mManager.activeFunction)return;let o=this.mManager.graph.addNode(this.mManager.activeFunction,e,{x:this.popupPosition?.grid.x??0,y:this.popupPosition?.grid.y??0,height:0,width:0});this.popupPosition=null,this.clearSelection(),this.mSelectedNodes.add(o)}typeOfNode(e){switch(e.definitionId){case dt.DEFINITION_ID:return"comment";case Tt.DEFINITION_ID:case xt.DEFINITION_ID:return"conjunction";default:return"node"}}pointerDrag(e,o){let a=this.convertGlobalToGridPosition(e.clientX,e.clientY),d=a,g=T=>{let C=this.convertGlobalToGridPosition(T.clientX,T.clientY);switch(o){case"panning":{this.mManager.grid.pan(C.x-d.x,C.y-d.y);break}case"selecting":{this.selectBox={x:Math.min(a.x,C.x),y:Math.min(a.y,C.y),width:Math.abs(C.x-a.x),height:Math.abs(C.y-a.y)};break}}d=C},y=()=>{if(document.removeEventListener("pointermove",g),document.removeEventListener("pointerup",y),o==="selecting"&&this.selectBox){let T=this.convertLocalToGridCoordinate(this.selectBox.x,this.selectBox.y),C=this.convertLocalToGridCoordinate(this.selectBox.x+this.selectBox.width,this.selectBox.y+this.selectBox.height),c=this.mManager.grid.gridSize;this.selectNodesInRectangle({top:T.y/c,right:C.x/c,bottom:C.y/c,left:T.x/c}),this.selectBox=null}};document.addEventListener("pointermove",g),document.addEventListener("pointerup",y)}onKeyDown(e){if(!this.mIsMouseInsideGrid)return;let o=document.activeElement;if(!(o instanceof HTMLInputElement||o instanceof HTMLTextAreaElement||o instanceof HTMLSelectElement)){switch(e.key){case"Escape":{this.popupPosition=null;return}case"Delete":{for(let a of this.mSelectedNodes)this.mManager.graph.removeNode(a);this.clearSelection();return}}if(e.ctrlKey)switch(e.key){case"z":{e.preventDefault(),this.mManager.history.undo();return}case"y":{e.preventDefault(),this.mManager.history.redo();return}case"c":{this.mManager.clipboard.copy(this.mSelectedNodes);return}case"v":e.preventDefault(),this.pasteFromClipboard()}}}convertGlobalToGridPosition(e,o){let a=this.mComponent.element.getBoundingClientRect();return{x:e-a.left,y:o-a.top}}moveAllSelected(e,o){for(let a of this.mSelectedNodes)a!==e&&this.mManager.graph.transformNode(a,d=>{d.moveTo(d.transformation.x+o.x,d.transformation.y+o.y)})}selectNode(e,o){this.popupPosition=null,o.stopPropagation(),e.definitionId===dt.DEFINITION_ID&&this.selectNodesInRectangle({top:e.transformation.y,right:e.transformation.x+e.transformation.width,bottom:e.transformation.y+e.transformation.height,left:e.transformation.x}),o.ctrlKey?this.mSelectedNodes.has(e)?this.mSelectedNodes.delete(e):this.mSelectedNodes.add(e):this.mSelectedNodes.has(e)||(this.clearSelection(),this.mSelectedNodes.add(e)),this.mComponent.updater.updateAsync()}openAddNodePopupAtPointer(e,o){let a=this.mComponent.element,d=this.convertGlobalToGridPosition(e,o),g=this.convertLocalToGridCoordinate(d.x,d.y),y=8,T=Math.max(0,a.clientWidth-ie.POPUP_WIDTH-y),C=Math.max(0,a.clientHeight-ie.POPUP_HEIGHT-y);this.popupPosition={local:{x:Math.max(y,Math.min(d.x,T)),y:Math.max(y,Math.min(d.y,C))},grid:{x:Math.round(g.x/this.mManager.grid.gridSize),y:Math.round(g.y/this.mManager.grid.gridSize)}}}convertLocalToGridCoordinate(e,o){return{x:(e-this.mManager.grid.panX)/this.mManager.grid.zoom,y:(o-this.mManager.grid.panY)/this.mManager.grid.zoom}}clearSelection(){this.mSelectedNodes.clear(),this.mComponent.updater.updateAsync()}pasteFromClipboard(){if(!this.mManager.activeFunction)return;let o=this.mManager.clipboard.paste();if(o.length!==0){this.clearSelection();for(let a of o)this.mSelectedNodes.add(a)}}selectNodesInRectangle(e){let o=this.mManager.activeFunction;if(o)for(let a of o.nodes){let d=a.transformation.y,g=a.transformation.x,y=g+a.transformation.width,T=d+a.transformation.height;if(g<e.right&&y>e.left&&d<e.bottom&&T>e.top){if(e.top>d&&e.right<y&&e.bottom<T&&e.left>g)return;this.mSelectedNodes.add(a)}}}}}};var se=class{mCodeGenerator;mId;mLabel;mNodesProvider;mStatics;get codeGenerator(){return this.mCodeGenerator}get id(){return this.mId}get label(){return this.mLabel}get statics(){return this.mStatics}constructor(t){this.mId=t.id,this.mLabel=t.label,this.mNodesProvider=t.nodes,this.mStatics=t.statics,this.mCodeGenerator=t.generator.code}getNodeDefinitions(t){let e=a=>{if(!a)return new Array;let d=new Array;return a(g=>{d.push(g)},t),d},o={};return Object.defineProperty(o,"entry",{get:()=>e(this.mNodesProvider.entry)}),Object.defineProperty(o,"exit",{get:()=>e(this.mNodesProvider.exit)}),Object.defineProperty(o,"dynamic",{get:()=>e(this.mNodesProvider.dynamic)}),o}},Ot={none:0,imports:1,inputs:2,outputs:4};var yi=`:host {\r
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
    /* Set min, max and default width */\r
    max-width: 500px;\r
    width: 250px;\r
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
}`;var bi=`<potatno-resize-box class="resize-box" left="true">\r
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
</potatno-resize-box>\r
`;function ra(){function p(c,n){return function(l){e(n,"addInitializer"),o(l,"An initializer"),c.push(l)}}function t(c,n,u,l,r,b,v,E,w){var f;switch(r){case 1:f="accessor";break;case 2:f="method";break;case 3:f="getter";break;case 4:f="setter";break;default:f="field"}var s={kind:f,name:v?"#"+n:n,static:b,private:v,metadata:E},m={v:!1};s.addInitializer=p(l,m);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return c(w,s)}finally{m.v=!0}}function e(c,n){if(c.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(c,n){if(typeof c!="function")throw new TypeError(n+" must be a function")}function a(c,n){var u=typeof n;if(c===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var l;throw c===0?l="field":c===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function d(c,n,u,l,r,b,v,E,w){var f=u[0],s,m,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,P;if(typeof f=="function")h=t(f,l,s,E,r,b,v,w,i),h!==void 0&&(a(r,h),r===0?m=h:r===1?(m=h.init,x=h.get||i.get,P=h.set||i.set,i={get:x,set:P}):i=h);else for(var M=f.length-1;M>=0;M--){var S=f[M];if(h=t(S,l,s,E,r,b,v,w,i),h!==void 0){a(r,h);var A;r===0?A=h:r===1?(A=h.init,x=h.get||i.get,P=h.set||i.set,i={get:x,set:P}):i=h,A!==void 0&&(m===void 0?m=A:typeof m=="function"?m=[m,A]:m.push(A))}}if(r===0||r===1){if(m===void 0)m=function(I,D){return D};else if(typeof m!="function"){var F=m;m=function(I,D){for(var L=D,_=0;_<F.length;_++)L=F[_].call(I,L);return L}}else{var z=m;m=function(I,D){return z.call(I,D)}}c.push(m)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(c.push(function(I,D){return i.get.call(I,D)}),c.push(function(I,D){return i.set.call(I,D)})):r===2?c.push(i):c.push(function(I,D){return i.call(I,D)}):Object.defineProperty(n,l,s))}function g(c,n,u){for(var l=[],r,b,v=new Map,E=new Map,w=0;w<n.length;w++){var f=n[w];if(Array.isArray(f)){var s=f[1],m=f[2],i=f.length>3,h=s>=5,x,P;if(h?(x=c,s=s-5,b=b||[],P=b):(x=c.prototype,r=r||[],P=r),s!==0&&!i){var M=h?E:v,S=M.get(m)||0;if(S===!0||S===3&&s!==4||S===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+m);!S&&s>2?M.set(m,s):M.set(m,!0)}d(l,x,f,m,s,h,i,P,u)}}return y(l,r),y(l,b),l}function y(c,n){n&&c.push(function(u){for(var l=0;l<n.length;l++)n[l].call(u);return u})}function T(c,n,u){if(n.length>0){for(var l=[],r=c,b=c.name,v=n.length-1;v>=0;v--){var E={v:!1};try{var w=n[v](r,{kind:"class",name:b,addInitializer:p(l,E),metadata:u})}finally{E.v=!0}w!==void 0&&(a(10,w),r=w)}return[C(r,u),function(){for(var f=0;f<l.length;f++)l[f].call(r)}]}}function C(c,n){return Object.defineProperty(c,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,l,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),E=g(n,u,v);return l.length||C(n,v),{e:E,get c(){return T(n,l,v)}}}}function Di(p,t,e,o){return(Di=ra())(p,t,e,o)}var Ii,wi,Ci,xi,Ti,Er;Ii=Y({selector:"potatno-function-properties",template:bi,style:yi}),Ci=$.state({complexValue:!0});var Ei=class{static{({e:[xi,Ti],c:[Er,wi]}=Di(this,[[Ci,1,"functionProperties"]],[Ii]))}constructor(t=R.use(X)){this.mManager=t,this.mSelectedImportId="",this.mProjectTypes=new Set,this.functionProperties=this.convertFunctionProperties(),this.mUnsubscribe=this.mManager.subscribe(O.Document|O.Function|O.SpecialActiveFunction,()=>{this.mProjectTypes.clear();for(let[e]of this.mManager.project.types.types)this.mProjectTypes.add(e);this.functionProperties=this.convertFunctionProperties()})}mManager;mProjectTypes;mSelectedImportId;mUnsubscribe;#t=(Ti(this),xi(this));get functionProperties(){return this.#t}set functionProperties(t){this.#t=t}get projectTypes(){return this.mProjectTypes}get selectedImportId(){return this.mSelectedImportId}set selectedImportId(t){this.mSelectedImportId=t}get unusedImports(){return this.mManager.activeFunction?this.mManager.activeFunction.project.imports.filter(t=>!this.functionProperties.imports.find(e=>t.id===e.id)):new Array}addPort(t){let e=this.projectTypes.values().next().value;if(!e)return;let o=t===this.functionProperties.inputs?"Input":"Output";t.push({label:o,dataType:e,hasError:!1}),this.submitChange()}addSelectedImport(){let t=this.unusedImports;if(t.length===0)return;let e=t.find(o=>o.id===this.mSelectedImportId);e||(e=t.at(0)),this.functionProperties.imports.push(e),this.submitChange()}deleteImport(t){let e=this.functionProperties.imports.indexOf(t);e!==-1&&(this.functionProperties.imports.splice(e,1),this.submitChange())}deletePort(t,e){let o=e.indexOf(t);o!==-1&&(e.splice(o,1),this.submitChange())}onDeconstruct(){this.mUnsubscribe()}async submitChange(){let t=!1,e=new Set;for(let g of this.functionProperties.inputs)g.hasError=e.has(g.label),t||=g.hasError,e.add(g.label);let o=new Set;for(let g of this.functionProperties.outputs)g.hasError=o.has(g.label),t||=g.hasError,o.add(g.label);if(t){this.functionProperties=this.functionProperties;return}let a=this.mManager.activeFunction,d=this.functionProperties;await new Promise(g=>{globalThis.setTimeout(g,10)}),this.mManager.graph.updateFunction(a,g=>{if(g.label=d.label,!d.statics.inputs){for(;g.inputs.length>0;)g.removeInput(g.inputs.at(0));for(let y of d.inputs)g.addInput({dataType:y.dataType,label:y.label})}if(!d.statics.outputs){for(;g.outputs.length>0;)g.removeOutput(g.outputs.at(0));for(let y of d.outputs)g.addOutput({dataType:y.dataType,label:y.label})}if(!d.statics.imports){for(let y of g.imports)g.removeImport(y);for(let y of d.imports)g.addImport(y.id)}})}convertFunctionProperties(){let t={label:"",inputs:new Array,outputs:new Array,imports:new Array,statics:{label:!0,imports:!0,inputs:!0,outputs:!0}},e=this.mManager.activeFunction;if(!e)return t;let o=e.project.getFunction(e.definitionId);o&&(t.statics.label=e.isSystem,t.statics.imports=(o.statics&Ot.imports)!==0,t.statics.inputs=(o.statics&Ot.inputs)!==0,t.statics.outputs=(o.statics&Ot.outputs)!==0),t.label=e.label;for(let a of e.project.imports)e.imports.has(a.id)&&t.imports.push({id:a.id,label:a.label});for(let a of e.inputs)t.inputs.push({label:a.label,dataType:a.dataType,hasError:!1});for(let a of e.outputs)t.outputs.push({label:a.label,dataType:a.dataType,hasError:!1});return t}static{wi()}};var Qe=class{mDependencies;mDocument;mEntryPoint;get code(){return this.mDocument.project.generator.code(this)}get dependencies(){return this.mDependencies}get entryPoint(){return this.mEntryPoint}constructor(t,e,o){this.mDocument=t,this.mEntryPoint=e,this.mDependencies=o}};var ke=class{mFunction;mGraphs;get code(){let t=this.mFunction.project.getFunction(this.mFunction.definitionId);if(!t)throw new N("Function result has an invalid function definition id.",this);return t.codeGenerator.body(this)}get function(){return this.mFunction}get graphs(){return Array.from(this.mGraphs.values())}constructor(t){this.mFunction=t,this.mGraphs=new Map}addGraph(t){this.mGraphs.set(t.entryNode.definitionId,t)}graphResultOf(t){return this.mGraphs.get(t)}};var tr=class{mBodyCode;mDependencies;mEntryNode;mExitNode;mNodeIds;mPorts;get code(){return this.mBodyCode}get dependencies(){return this.mDependencies}get entryNode(){return this.mEntryNode}get exitNode(){return this.mExitNode}get nodes(){return this.mNodeIds}get ports(){return this.mPorts}constructor(t){this.mBodyCode=t.bodyCode,this.mDependencies=[...t.dependencies],this.mEntryNode=t.entryNode,this.mExitNode=t.exitNode,this.mNodeIds=t.nodeIds,this.mPorts=t.portValues}};var ae=class{mProject;constructor(t){this.mProject=t}generateDocument(t,e=!1){let o=[...t.functions].find(a=>a.isSystem);if(!o)throw new N("No entry point function found for code generation.",this);return this.generateFunction(o,e)}generateFunction(t,e=!1){return this.buildDocumentResult(t.document,t.getExitNodes(),e)}generateNode(t,e=!1){return this.buildDocumentResult(t.document,[t],e)}buildDocumentResult(t,e,o){if(t.validate().errors.length>0)throw new N("Code generation exited. Code graph validation failed.",this);let d={counter:{nodeIndex:0,portIndex:0},debug:o,nodeDefinitions:new Map},g=this.generateFunctionWithDependencies(d,e,new Set),y=g.pop();return new Qe(t,y,g)}countNodeEncounter(t,e){let o=new Map,a=new Set,d=new Array(t);for(;d.length>0;){let g=d.pop();if(o.set(g,(o.get(g)??0)+1),!(g===e||a.has(g))){a.add(g);for(let y of g.inputs.flow)for(let T of this.resolveFlowConjunctions(y))d.push(T.node);for(let y of g.inputs.value){let T=this.resolveValueConjunctions(y);T&&d.push(T.node)}}}return o}createScope(t,e){return{emittedNodes:new Set,remaining:this.countNodeEncounter(t,e)}}emitNode(t,e,o,a,d){if(!t.nodeDefinitions.get(o.function)){let l=new Map;for(let r of o.function.nodeDefinitions)l.set(r.id,r);t.nodeDefinitions.set(o.function,l)}let g=t.nodeDefinitions.get(o.function).get(o.definitionId);if(!g)throw new N(`Node definition "${o.definitionId}" not found for node "${o.label}".`,this);g instanceof Mt&&e.dependencies.push(g.function);let y={},T=new Array;for(let l of o.inputs.value){let r=this.resolveInputValue(t,e,l);y[l.definitionId]=r.inputPort,e.ports.set(l,r.inputPort.value),r.emitResult&&T.push(r.emitResult)}let C={};for(let l of o.outputs.list)C[l.definitionId]={value:this.generatePortValue(t,e,l),code:{inner:a[l.definitionId]??""}};let c=g.codeGenerator({inputs:y,outputs:C,code:{next:d??""}}),n=this.getGeneratedNodeId(t,e,o);t.debug&&(c=this.mProject.generator.value.hook(`start-${n}`)+c+this.mProject.generator.value.hook(`end-${n}`));let u=new Array;for(let l of T)u.push(...l.codeOutput);return u.push(c),{codeOutput:u,lastGeneratedNode:o,endFlowPort:null}}findBranchStartPoint(t){let e=this.getNodesInputFlowPorts(t),o=e.length,a=new Map,d=new Array,g=(y,T)=>{let C=(a.has(y)||a.set(y,new Set),a.get(y)),c=C.size;for(let n of T)C.add(n);return C.size>c&&d.push(y),C};for(let[y,T]of e.entries())g(T.node,[y]);for(;d.length>0;){let y=d.shift(),T=a.get(y);for(let C of this.getNodesInputFlowPorts(y))if(g(C.node,T).size===o)return C.node}throw new N("No common branch point found for merge node.",this)}generateFunctionWithDependencies(t,e,o){let a=new Array;if(e.length===0)return a;let d=e.at(0).function;o.add(d);let g=new ke(d);a.push(g);for(let y of e){let T=this.generateNodeCode(t,y);g.addGraph(T);for(let C of T.dependencies)o.has(C)||a.push(...this.generateFunctionWithDependencies(t,C.getExitNodes(),o))}return a.reverse()}generateNodeCode(t,e){let o={dependencies:new Array,nodes:new Map,ports:new Map,scope:this.createScope(e,null)},a=this.walkBackward(t,o,e,null),d=a.codeOutput.join(" ");return new tr({bodyCode:d,dependencies:o.dependencies,entryNode:a.lastGeneratedNode,exitNode:e,nodeIds:new Map(o.nodes),portValues:new Map(o.ports)})}generatePortValue(t,e,o){if(!e.ports.has(o)){let a=this.mProject.generator.value.name(o.label),d=this.mProject.generator.value.id(a,t.counter.portIndex++);e.ports.set(o,d)}return e.ports.get(o)}getGeneratedNodeId(t,e,o){if(!e.nodes.has(o)){let d=(++t.counter.nodeIndex).toString(16).toUpperCase().padStart(8,"0");e.nodes.set(o,d)}return e.nodes.get(o)}getNodesInputFlowPorts(t){let e=new Array;for(let o of t.inputs.flow)e.push(...this.resolveFlowConjunctions(o));return[...new Set(e)]}handleFlowMerge(t,e,o,a,d){let g=d.join(" "),y=this.findBranchStartPoint(o),T={},C=e.scope;try{for(let c of a){e.scope=this.createScope(c.node,y);let n=this.walkBackward(t,e,c.node,y);T[n.endFlowPort.definitionId]=n.codeOutput.join(" ")}}finally{e.scope=C}return this.emitNode(t,e,y,T,g)}resolveFlowConjunctions(t){let e=new Array;for(let o of t.connectedPorts){if(o.node.definitionId!==xt.DEFINITION_ID){e.push(o);continue}let a=o.node.inputs.flow[0];!a||a.connectedPorts.size===0||e.push(...this.resolveFlowConjunctions(a))}return e}resolveInputValue(t,e,o){let a=this.resolveValueConjunctions(o);if(!a){if(this.mProject.types.isGenericType(o.dataType))throw new N("Generic value inputs must be allways connected",this);return{inputPort:{value:this.mProject.types.getType(o.dataType).convert([...o.directValue]),isDirectValue:!0},emitResult:null}}let d=a.node,g=!d.hasFlowPorts,y=(()=>{if(!d.hasFlowPorts){if(e.scope.emittedNodes.has(d))return null;let T=e.scope.remaining.get(d);if(g&&(T=0),e.scope.remaining.set(d,T),T<=0)return e.scope.emittedNodes.add(d),this.emitNode(t,e,d,{})}return null})();return{inputPort:{value:this.generatePortValue(t,e,a),isDirectValue:!1},emitResult:y}}resolveValueConjunctions(t){if(t.connectedPorts.size===0)return null;let e=t.connectedPorts.values().next().value;if(e.node.definitionId!==Tt.DEFINITION_ID)return e;let o=e.node.inputs.value[0];return!o||o.connectedPorts.size===0?null:this.resolveValueConjunctions(o)}walkBackward(t,e,o,a){let d={codeOutput:new Array,lastGeneratedNode:null,endFlowPort:null},g=null,y=o;for(;y!==null&&y!==a;){let T={};g!==null&&(T[g.definitionId]=d.codeOutput.join(" "),d.codeOutput=new Array);let C=d.codeOutput;d=this.emitNode(t,e,y,T),d.codeOutput=[...d.codeOutput,...C];let c=this.getNodesInputFlowPorts(y);if(c.length===0)break;c.length>1&&(d=this.handleFlowMerge(t,e,y,c,d.codeOutput),c=this.getNodesInputFlowPorts(d.lastGeneratedNode)),g=c[0]??null,y=g?.node??null}if(!d.lastGeneratedNode)throw new N(`Walk did not reach an entry node from exit "${o.label}".`,this);if(a&&y!==a)throw new N("Malformed graph. End node not reached",this);return d.endFlowPort=g,d}};var st=class{static MAIN="MAIN";mBuild;mDefaultParameters;mFunction;mTypes;get defaultParameters(){return this.mDefaultParameters}get function(){return this.mFunction}get types(){return this.mTypes}constructor(t,e){this.mFunction=t,this.mDefaultParameters=e.defaultParameters,this.mTypes=new Set(e.types),this.mBuild=e.build}compile(t,e){return this.mBuild({defaultParameters:this.mDefaultParameters,function:this.mFunction,projectTypes:t.entryPoint.function.project.types},t,e)}};var Pi=`:host {\r
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
    background-color: var(--potatno-color-background-light);\r
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
    flex-shrink: 0; \r
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
                scale: 0.98;\r
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
            background-color: var(--potatno-color-background-light);\r
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
        pre, code {\r
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
        font-size: var(--potatno-font-size-small);\r
        margin-top: 2px;\r
\r
        /* Darken text color by mixing in the background color */\r
        color: color-mix(in srgb, var(--potatno-color-text) 50%, var(--potatno-color-background));\r
    }\r
}`;var Mi=`<potatno-resize-box class="resize-box" left="true" top="true">\r
    <div class="header">\r
        $if(this.errors.length > 0) {\r
            <div class="header__tabs">\r
                <div class="tab tab--error selected">Errors ({{this.errors.length}})</div>\r
            </div>\r
        }\r
\r
        $if(this.errors.length === 0) {\r
            <div class="header__tabs">\r
                <div class="tab {{ this.selectedTab === 'preview' ? 'selected' : '' }}" (click)="this.selectedTab = 'preview'">Preview</div>\r
                <div class="tab {{ this.selectedTab === 'code' ? 'selected' : '' }}" (click)="this.selectedTab = 'code'">Code</div>\r
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
                        <div class="error-item__location">{{this.error.location}}</div>\r
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
</potatno-resize-box>\r
`;function ia(){function p(c,n){return function(l){e(n,"addInitializer"),o(l,"An initializer"),c.push(l)}}function t(c,n,u,l,r,b,v,E,w){var f;switch(r){case 1:f="accessor";break;case 2:f="method";break;case 3:f="getter";break;case 4:f="setter";break;default:f="field"}var s={kind:f,name:v?"#"+n:n,static:b,private:v,metadata:E},m={v:!1};s.addInitializer=p(l,m);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return c(w,s)}finally{m.v=!0}}function e(c,n){if(c.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(c,n){if(typeof c!="function")throw new TypeError(n+" must be a function")}function a(c,n){var u=typeof n;if(c===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var l;throw c===0?l="field":c===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function d(c,n,u,l,r,b,v,E,w){var f=u[0],s,m,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,P;if(typeof f=="function")h=t(f,l,s,E,r,b,v,w,i),h!==void 0&&(a(r,h),r===0?m=h:r===1?(m=h.init,x=h.get||i.get,P=h.set||i.set,i={get:x,set:P}):i=h);else for(var M=f.length-1;M>=0;M--){var S=f[M];if(h=t(S,l,s,E,r,b,v,w,i),h!==void 0){a(r,h);var A;r===0?A=h:r===1?(A=h.init,x=h.get||i.get,P=h.set||i.set,i={get:x,set:P}):i=h,A!==void 0&&(m===void 0?m=A:typeof m=="function"?m=[m,A]:m.push(A))}}if(r===0||r===1){if(m===void 0)m=function(I,D){return D};else if(typeof m!="function"){var F=m;m=function(I,D){for(var L=D,_=0;_<F.length;_++)L=F[_].call(I,L);return L}}else{var z=m;m=function(I,D){return z.call(I,D)}}c.push(m)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(c.push(function(I,D){return i.get.call(I,D)}),c.push(function(I,D){return i.set.call(I,D)})):r===2?c.push(i):c.push(function(I,D){return i.call(I,D)}):Object.defineProperty(n,l,s))}function g(c,n,u){for(var l=[],r,b,v=new Map,E=new Map,w=0;w<n.length;w++){var f=n[w];if(Array.isArray(f)){var s=f[1],m=f[2],i=f.length>3,h=s>=5,x,P;if(h?(x=c,s=s-5,b=b||[],P=b):(x=c.prototype,r=r||[],P=r),s!==0&&!i){var M=h?E:v,S=M.get(m)||0;if(S===!0||S===3&&s!==4||S===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+m);!S&&s>2?M.set(m,s):M.set(m,!0)}d(l,x,f,m,s,h,i,P,u)}}return y(l,r),y(l,b),l}function y(c,n){n&&c.push(function(u){for(var l=0;l<n.length;l++)n[l].call(u);return u})}function T(c,n,u){if(n.length>0){for(var l=[],r=c,b=c.name,v=n.length-1;v>=0;v--){var E={v:!1};try{var w=n[v](r,{kind:"class",name:b,addInitializer:p(l,E),metadata:u})}finally{E.v=!0}w!==void 0&&(a(10,w),r=w)}return[C(r,u),function(){for(var f=0;f<l.length;f++)l[f].call(r)}]}}function C(c,n){return Object.defineProperty(c,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,l,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),E=g(n,u,v);return l.length||C(n,v),{e:E,get c(){return T(n,l,v)}}}}function Fi(p,t,e,o){return(Fi=ia())(p,t,e,o)}var ji,Si,zi,Vi,$i,Gi,Ai,Ni,Li,_i,Ri,Dr;ji=Y({selector:"potatno-preview",template:Mi,style:Pi,modules:[Pe],components:[qt]}),zi=$.state(),Vi=$.state(),$i=$.state(),Gi=$.state();var Oi=class{static{({e:[Ai,Ni,Li,_i,Ri],c:[Dr,Si]}=Fi(this,[[zi,1,"mSelectedDisplayId"],[Vi,1,"mSelectedOutputId"],[$i,1,"selectedTab"],[Gi,1,"previewCode"]],[ji]))}constructor(t=R.use(G),e=R.use(X)){this.mComponent=t,this.mManager=e,this.mSelectedDisplayId="",this.mSelectedOutputId="",this.selectedTab="preview",this.previewCode="";let o=O.NodeUpdate|O.NodeAdd|O.NodeDelete;this.mPreviewTargets=this.findFunctionPreviewTargets(),this.mUnsubscribeOutputFetch=this.mManager.subscribe(O.SpecialActiveFunction|o,()=>{this.mPreviewTargets=this.findFunctionPreviewTargets()}),this.mUnsubscribeErrorResolve=this.mManager.subscribe(O.SpecialActiveFunction|o|O.Connection,()=>{this.mComponent.updater.updateAsync()});let a=0;this.mManager.subscribe(O.Any,()=>{globalThis.clearTimeout(a),a=globalThis.setTimeout(()=>{this.previewCode=this.generateFunctionCode()},1e3)})}mComponent;mManager;mPreviewTargets;mUnsubscribeErrorResolve;mUnsubscribeOutputFetch;#t=(Ri(this),Ai(this));get mSelectedDisplayId(){return this.#t}set mSelectedDisplayId(t){this.#t=t}#e=Ni(this);get mSelectedOutputId(){return this.#e}set mSelectedOutputId(t){this.#e=t}#r=Li(this);get selectedTab(){return this.#r}set selectedTab(t){this.#r=t}#o=_i(this);get previewCode(){return this.#o}set previewCode(t){this.#o=t}get displayOptions(){let t=this.mPreviewTargets.get(this.selectedOutputId);return t?t.displays:new Map}get errors(){return this.mManager.integrity.errors}get outputOptions(){return this.mPreviewTargets}get previewDriver(){let t=this.mPreviewTargets.get(this.selectedOutputId);return t?this.mManager.preview.requestDriver(t.target,this.selectedDisplayId):null}get selectedDisplayId(){let t=this.displayOptions;if(!t.has(this.mSelectedDisplayId)){let e=t.keys().next().value;typeof e<"u"&&(this.mSelectedDisplayId=e)}return this.mSelectedDisplayId}set selectedDisplayId(t){this.mSelectedDisplayId=t}get selectedOutputId(){let t=this.outputOptions;if(!t.has(this.mSelectedOutputId)){let e=t.keys().next().value;typeof e<"u"&&(this.mSelectedOutputId=e)}return this.mSelectedOutputId}set selectedOutputId(t){this.mSelectedOutputId=t}onDeconstruct(){this.mUnsubscribeErrorResolve(),this.mUnsubscribeOutputFetch()}findFunctionPreviewTargets(){let t=new Map;if(!this.mManager.activeFunction)return t;let e=this.mManager.activeFunction,o=e.project.getFunction(e.definitionId);if(!o)return t;let a=y=>{let T=new Map;for(let C of y)T.set(C,e.project.preview.getDisplay(C).name);return T},d=e.project.preview.availableDisplays(o,st.MAIN);d.length>0&&t.set(st.MAIN,{label:st.MAIN,target:e,displays:a(d)});let g=new Map;for(let y of e.getExitNodes())for(let T of y.inputs.value){let C=T.resolvedDataType;g.has(C)||g.set(C,T.project.preview.availableDisplays(o,C));let c=g.get(C);c.length!==0&&t.set(T.definitionId,{label:T.label,target:T,displays:a(c)})}return t}generateFunctionCode(){if(!this.mManager.integrity.isValid||!this.mManager.activeFunction)return"";let t=this.mManager.activeFunction;return new ae(t.project).generateFunction(t,!1).code}static{Si()}};var Bi=`:host {\r
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
}`;var Ui=`<div class="editor">\r
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
</div>`;function la(){function p(c,n){return function(l){e(n,"addInitializer"),o(l,"An initializer"),c.push(l)}}function t(c,n,u,l,r,b,v,E,w){var f;switch(r){case 1:f="accessor";break;case 2:f="method";break;case 3:f="getter";break;case 4:f="setter";break;default:f="field"}var s={kind:f,name:v?"#"+n:n,static:b,private:v,metadata:E},m={v:!1};s.addInitializer=p(l,m);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return c(w,s)}finally{m.v=!0}}function e(c,n){if(c.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(c,n){if(typeof c!="function")throw new TypeError(n+" must be a function")}function a(c,n){var u=typeof n;if(c===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var l;throw c===0?l="field":c===10?l="class":l="method",new TypeError(l+" decorators must return a function or void 0")}}function d(c,n,u,l,r,b,v,E,w){var f=u[0],s,m,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,l)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,P;if(typeof f=="function")h=t(f,l,s,E,r,b,v,w,i),h!==void 0&&(a(r,h),r===0?m=h:r===1?(m=h.init,x=h.get||i.get,P=h.set||i.set,i={get:x,set:P}):i=h);else for(var M=f.length-1;M>=0;M--){var S=f[M];if(h=t(S,l,s,E,r,b,v,w,i),h!==void 0){a(r,h);var A;r===0?A=h:r===1?(A=h.init,x=h.get||i.get,P=h.set||i.set,i={get:x,set:P}):i=h,A!==void 0&&(m===void 0?m=A:typeof m=="function"?m=[m,A]:m.push(A))}}if(r===0||r===1){if(m===void 0)m=function(I,D){return D};else if(typeof m!="function"){var F=m;m=function(I,D){for(var L=D,_=0;_<F.length;_++)L=F[_].call(I,L);return L}}else{var z=m;m=function(I,D){return z.call(I,D)}}c.push(m)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(c.push(function(I,D){return i.get.call(I,D)}),c.push(function(I,D){return i.set.call(I,D)})):r===2?c.push(i):c.push(function(I,D){return i.call(I,D)}):Object.defineProperty(n,l,s))}function g(c,n,u){for(var l=[],r,b,v=new Map,E=new Map,w=0;w<n.length;w++){var f=n[w];if(Array.isArray(f)){var s=f[1],m=f[2],i=f.length>3,h=s>=5,x,P;if(h?(x=c,s=s-5,b=b||[],P=b):(x=c.prototype,r=r||[],P=r),s!==0&&!i){var M=h?E:v,S=M.get(m)||0;if(S===!0||S===3&&s!==4||S===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+m);!S&&s>2?M.set(m,s):M.set(m,!0)}d(l,x,f,m,s,h,i,P,u)}}return y(l,r),y(l,b),l}function y(c,n){n&&c.push(function(u){for(var l=0;l<n.length;l++)n[l].call(u);return u})}function T(c,n,u){if(n.length>0){for(var l=[],r=c,b=c.name,v=n.length-1;v>=0;v--){var E={v:!1};try{var w=n[v](r,{kind:"class",name:b,addInitializer:p(l,E),metadata:u})}finally{E.v=!0}w!==void 0&&(a(10,w),r=w)}return[C(r,u),function(){for(var f=0;f<l.length;f++)l[f].call(r)}]}}function C(c,n){return Object.defineProperty(c,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,l,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),E=g(n,u,v);return l.length||C(n,v),{e:E,get c(){return T(n,l,v)}}}}function Wi(p,t,e,o){return(Wi=la())(p,t,e,o)}var Zi,Hi,Xi,Ir;Zi=Y({selector:"potatno-code-editor",template:Ui,style:Bi,components:[gr,Ke,Er,Dr]});var Yi=class{static{({e:[Xi],c:[Ir,Hi]}=Wi(this,[[tt,3,"document"],[tt,2,"triggerPreviewUpdate"]],[Zi]))}constructor(t=R.use(G),e=R.use(X)){Xi(this),this.mComponent=t,this.mManager=e,this.mUnsubscribe=this.mManager.subscribe(O.Document|O.SpecialActiveFunction,()=>{this.mComponent.updater.updateAsync()})}mComponent;mManager;mUnsubscribe;get document(){return this.mManager.graph.document}set document(t){this.mManager.graph.setDocument(t)}get hasPreview(){let t=this.mManager.activeFunction;if(!t)return!1;let e=t.project.getFunction(t.definitionId);return e?t.project.preview.availableDisplays(e).length>0:!1}async triggerPreviewUpdate(){return this.mManager.preview.execute()}onDeconstruct(){this.mUnsubscribe()}static{Hi()}};var er=class extends de{mCodeEditor;mProject;get document(){return this.mCodeEditor.document}set document(t){this.mCodeEditor.document=t}get project(){return this.mProject}constructor(t){super(),this.mProject=t,this.addStyle(xo),this.addStyle(wo),this.setInjection(X,new X(t)),this.mCodeEditor=this.addContent(Ir)}load(t){let e=JSON.parse(t);if(!Array.isArray(e.functions))throw new N("Could not load document. Document has a wrong format.",this);let o=new oe(this.mProject).deserialize(e);this.document=o}save(){let t=new ne().serialize(this.document);return JSON.stringify(t)}async update(){return this.mCodeEditor.triggerPreviewUpdate()}};var V=class extends K{constructor(t){super({id:t.id,label:t.label,category:t.category,regions:t.regions??null,generators:{ports:{inputs:e=>{for(let o of t.ports.inputs)e(o)},outputs:e=>{for(let o of t.ports.outputs)e(o)}},code:t.generators.code}})}};var rr=class{mDisplays;get displayIds(){return[...this.mDisplays.keys()]}constructor(){this.mDisplays=new Map}addDisplay(t){this.mDisplays.set(t.id,t)}availableDisplays(t,e=null){let o=new Array;for(let[a,d]of this.mDisplays)d.executor.function.id===t.id&&(e===null||d.allowsType(e))&&o.push(a);return o}getDisplay(t){return this.mDisplays.get(t)??null}};var or=class{mCodeGenerator;mEntryPoint;mImports;mNodeDefinitions;mPreview;mTypes;mUserFunctions;get entryPoint(){return this.mEntryPoint}get generator(){return this.mCodeGenerator}get imports(){return this.mImports}get nodeDefinitions(){return Array.from(this.mNodeDefinitions.values())}get preview(){return this.mPreview}get types(){return this.mTypes}get userFunctions(){return this.mUserFunctions}constructor(t,e,o){this.mTypes=t,this.mCodeGenerator=o.generator,this.mPreview=new rr,this.mNodeDefinitions=new Map,this.mImports=new Array,this.mUserFunctions=new Map,this.mEntryPoint=e,this.addNodeDefinition(new xt),this.addNodeDefinition(new Tt),this.addNodeDefinition(new dt)}addImport(t){this.mImports.push(t)}addNodeDefinition(t){this.mNodeDefinitions.set(t.id,t)}getFunction(t){return this.mEntryPoint.id===t?this.mEntryPoint:this.mUserFunctions.get(t)}setDynamicFunction(t){this.mUserFunctions.set(t.id,t)}};var nr=class{mTypes;get typeNames(){return Array.from(this.mTypes.keys())}get types(){return this.mTypes}constructor(t){this.mTypes=new Map;for(let[e,o]of Object.entries(t))this.mTypes.set(e,{name:e,...o})}getDefaultValue(t){return this.getType(t).default.value}getType(t){if(!this.mTypes.has(t))throw new Error(`Type "${t}" is not defined in the project types definition.`);return this.mTypes.get(t)}isGenericType(t){return typeof t!="string"?!1:/^<[^>]+>$/.test(t)}};var ir=class extends nr{constructor(){super({number:{default:{string:["0"],value:0},convert:t=>{let e=t[0],o=parseFloat(e);if(isNaN(o))throw new Error(`Invalid number: "${e}"`);return o.toString()},inputs:[{name:"value",type:"number"}]},string:{default:{string:[""],value:""},convert:t=>t[0],inputs:[{name:"value",type:"string"}]},boolean:{default:{string:["false"],value:!1},convert:t=>{let e=t[0].toLowerCase();if(e==="true")return"true";if(e==="false")return"false";throw new Error(`Invalid boolean: "${t[0]}"`)},inputs:[{name:"value",type:"boolean"}]}})}};var sr=class extends se{constructor(){super({id:"pixelShader",label:"Pixel Shader",statics:Ot.inputs|Ot.outputs,nodes:{entry:t=>{t(new V({id:"OnPixel",label:"OnPixel",category:{name:"event"},ports:{inputs:[],outputs:[{label:"exec",id:"exec",portType:"flow"},{label:"x",id:"x",portType:"value",dataType:"number"},{label:"y",id:"y",portType:"value",dataType:"number"}]},generators:{code:e=>{let o=e.outputs.x.value,a=e.outputs.y.value;return`(${o}, ${a}) => { ${e.outputs.exec.code.inner} }`}}}))},exit:t=>{t(new V({id:"PixelResult",label:"PixelResult",category:{name:"Output"},ports:{inputs:[{label:"exec",id:"exec",portType:"flow"},{label:"red",id:"red",portType:"value",dataType:"number"},{label:"green",id:"green",portType:"value",dataType:"number"},{label:"blue",id:"blue",portType:"value",dataType:"number"}],outputs:[]},generators:{code:e=>`return [${e.inputs.red.value}, ${e.inputs.green.value}, ${e.inputs.blue.value}];`}}))}},generator:{code:{body:t=>{let e=t.graphResultOf("OnPixel");return`const ${t.function.definitionId} = ${e?.code??"() => [0, 0, 0]"};`},value:t=>`${t.function.definitionId}()`}}})}};var ar=class extends se{constructor(){super({id:"Helper Function",label:"Helper Function",statics:Ot.none,nodes:{entry:(t,e)=>{t(new K({id:"HelperFunctionEntry",label:"Entry",category:{name:"event"},generators:{ports:{outputs:o=>{o({label:"exec",id:"exec",portType:"flow"});for(let a of e.inputs)o({label:a.label,id:a.label,portType:"value",dataType:a.dataType})},inputs:()=>{}},code:o=>`(${Object.entries(o.outputs).filter(([d])=>d!=="exec").map(([,d])=>d.value).join(", ")}) => { ${o.outputs.exec.code.inner} }`}}))},exit:(t,e)=>{t(new K({id:"HelperFunctionReturn",label:"Return",category:{name:"event"},generators:{ports:{outputs:()=>{},inputs:o=>{o({label:"exec",id:"exec",portType:"flow"});for(let a of e.outputs)o({label:a.label,id:a.label,portType:"value",dataType:a.dataType})}},code:o=>`return { ${Object.entries(o.inputs).map(([d,g])=>`${d}: (${g.value})`).join(", ")} };`}}))}},generator:{code:{body:t=>{let e=`__fn_${t.function.id.replaceAll("-","_")}`,o=t.graphResultOf("HelperFunctionEntry");return`const ${e} = ${o?.code??"() => ({})"};`},value:t=>{let e=`__fn_${t.function.id.replaceAll("-","_")}`,o=Object.entries(t.inputs).map(([,g])=>g.value).join(", "),a=Object.entries(t.outputs).map(([g,y])=>`${g}: ${y.value}`).join(", "),d=t.outputs.Output?.code.inner??"";return a===""?`${e}(${o}); ${d}`:`const { ${a} } = ${e}(${o}); ${d}`}}}})}};var lr=class extends or{mUserFunction;get userFunction(){return this.mUserFunction}constructor(){let t=new ir,e=new sr,o=new ar;super(t,e,{generator:{code:a=>{let d="";for(let g of a.dependencies)d+=`${g.code}
`;return d+=a.entryPoint.code,d},value:{id:(a,d)=>`${a}_${d}`,name:a=>a.replaceAll(/[^A-Za-z0-9_]/g,""),hook:a=>`/*[${a}]*/`}}}),this.mUserFunction=o,this.setDynamicFunction(o),this.addBaseNodeDefinitions()}addBaseNodeDefinitions(){this.addNodeDefinition(new V({id:"Add",label:"Add",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} + ${t.inputs.b.value};`}})),this.addNodeDefinition(new V({id:"Subtract",label:"Subtract",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} - ${t.inputs.b.value};`}})),this.addNodeDefinition(new V({id:"Multiply",label:"Multiply",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} * ${t.inputs.b.value};`}})),this.addNodeDefinition(new V({id:"Divide",label:"Divide",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} / ${t.inputs.b.value};`}})),this.addNodeDefinition(new V({id:"Modulo",label:"Modulo",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} % ${t.inputs.b.value};`}})),this.addNodeDefinition(new V({id:"Equal",label:"Equal",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"boolean"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} === ${t.inputs.b.value};`}})),this.addNodeDefinition(new V({id:"Not Equal",label:"Not Equal",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"boolean"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} !== ${t.inputs.b.value};`}})),this.addNodeDefinition(new V({id:"Less Than",label:"Less Than",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"boolean"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} < ${t.inputs.b.value};`}})),this.addNodeDefinition(new V({id:"Greater Than",label:"Greater Than",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"boolean"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} > ${t.inputs.b.value};`}})),this.addNodeDefinition(new V({id:"And",label:"And",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"boolean"},{label:"b",id:"b",portType:"value",dataType:"boolean"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"boolean"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} && ${t.inputs.b.value};`}})),this.addNodeDefinition(new V({id:"Or",label:"Or",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"boolean"},{label:"b",id:"b",portType:"value",dataType:"boolean"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"boolean"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} || ${t.inputs.b.value};`}})),this.addNodeDefinition(new V({id:"Not",label:"Not",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"boolean"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"boolean"}]},generators:{code:t=>`const ${t.outputs.result.value} = !${t.inputs.a.value};`}})),this.addNodeDefinition(new V({id:"Number to String",label:"Number to String",category:{name:"type-conversion"},ports:{inputs:[{label:"input",id:"input",portType:"value",dataType:"number"}],outputs:[{label:"output",id:"output",portType:"value",dataType:"string"}]},generators:{code:t=>`const ${t.outputs.output.value} = String(${t.inputs.input.value});`}})),this.addNodeDefinition(new V({id:"String to Number",label:"String to Number",category:{name:"type-conversion"},ports:{inputs:[{label:"input",id:"input",portType:"value",dataType:"string"}],outputs:[{label:"output",id:"output",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.output.value} = Number(${t.inputs.input.value});`}})),this.addNodeDefinition(new V({id:"Boolean to String",label:"Boolean to String",category:{name:"type-conversion"},ports:{inputs:[{label:"input",id:"input",portType:"value",dataType:"boolean"}],outputs:[{label:"output",id:"output",portType:"value",dataType:"string"}]},generators:{code:t=>`const ${t.outputs.output.value} = String(${t.inputs.input.value});`}})),this.addNodeDefinition(new V({id:"If",label:"If",category:{name:"flow"},ports:{inputs:[{label:"exec",id:"exec",portType:"flow"},{label:"condition",id:"condition",portType:"value",dataType:"boolean"}],outputs:[{label:"then",id:"then",portType:"flow"},{label:"else",id:"else",portType:"flow"}]},generators:{code:t=>`if (${t.inputs.condition.value}) {
${t.outputs.then.code.inner}
} else {
${t.outputs.else.code.inner}
}`}})),this.addNodeDefinition(new V({id:"While",label:"While",category:{name:"flow"},ports:{inputs:[{label:"exec",id:"exec",portType:"flow"},{label:"condition",id:"condition",portType:"value",dataType:"boolean"}],outputs:[{label:"body",id:"body",portType:"flow"}]},generators:{code:t=>`while (${t.inputs.condition.value}) {
${t.outputs.body.code.inner}
}`}})),this.addNodeDefinition(new V({id:"For Loop",label:"For Loop",category:{name:"flow"},ports:{inputs:[{label:"exec",id:"exec",portType:"flow"},{label:"count",id:"count",portType:"value",dataType:"number"}],outputs:[{label:"exec",id:"exec",portType:"flow"},{label:"index",id:"index",portType:"value",dataType:"number"}]},generators:{code:t=>`for (let ${t.outputs.index.value} = 0; ${t.outputs.index.value} < ${t.inputs.count.value}; ${t.outputs.index.value}++) {
${t.outputs.exec.code.inner}
}`}})),this.addNodeDefinition(new V({id:"Console Log",label:"Console Log",category:{name:"Function"},ports:{inputs:[{label:"message",id:"message",portType:"value",dataType:"string"}],outputs:[]},generators:{code:t=>`console.log(${t.inputs.message.value});`}})),this.addNodeDefinition(new V({id:"String Concat",label:"String Concat",category:{name:"Function"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"string"},{label:"b",id:"b",portType:"value",dataType:"string"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"string"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} + ${t.inputs.b.value};`}}))}};var le=class{mId;mLabel;mNodes;get id(){return this.mId}get label(){return this.mLabel}get nodes(){return this.mNodes}constructor(t,e){this.mId=t,this.mLabel=e,this.mNodes=new Array}addNode(t){this.mNodes.push(t)}};var cr=class extends le{constructor(){super("Math","Math"),this.addNode(new V({id:"Math.PI",label:"Math.PI",category:{name:"value"},ports:{inputs:[],outputs:[{label:"value",id:"value",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.value.value} = Math.PI;`}})),this.addNode(new V({id:"Math.E",label:"Math.E",category:{name:"value"},ports:{inputs:[],outputs:[{label:"value",id:"value",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.value.value} = Math.E;`}})),this.addNode(new V({id:"Math.abs",label:"Math.abs",category:{name:"Function"},ports:{inputs:[{label:"value",id:"value",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = Math.abs(${t.inputs.value.value});`}})),this.addNode(new V({id:"Math.floor",label:"Math.floor",category:{name:"Function"},ports:{inputs:[{label:"value",id:"value",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = Math.floor(${t.inputs.value.value});`}})),this.addNode(new V({id:"Math.ceil",label:"Math.ceil",category:{name:"Function"},ports:{inputs:[{label:"value",id:"value",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = Math.ceil(${t.inputs.value.value});`}})),this.addNode(new V({id:"Math.random",label:"Math.random",category:{name:"Function"},ports:{inputs:[],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = Math.random();`}})),this.addNode(new V({id:"Math.sin",label:"Math.sin",category:{name:"Function"},ports:{inputs:[{label:"value",id:"value",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = Math.sin(${t.inputs.value.value});`}})),this.addNode(new V({id:"Math.cos",label:"Math.cos",category:{name:"Function"},ports:{inputs:[{label:"value",id:"value",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = Math.cos(${t.inputs.value.value});`}})),this.addNode(new V({id:"Math.min",label:"Math.min",category:{name:"Function"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = Math.min(${t.inputs.a.value}, ${t.inputs.b.value});`}})),this.addNode(new V({id:"Math.max",label:"Math.max",category:{name:"Function"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = Math.max(${t.inputs.a.value}, ${t.inputs.b.value});`}})),this.addNode(new V({id:"Math.clamp",label:"Math.clamp",category:{name:"Function"},ports:{inputs:[{label:"value",id:"value",portType:"value",dataType:"number"},{label:"min",id:"min",portType:"value",dataType:"number"},{label:"max",id:"max",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = Math.min(Math.max(${t.inputs.value.value}, ${t.inputs.min.value}), ${t.inputs.max.value});`}}))}};var ur=class extends le{constructor(){super("Time","Time"),this.addNode(new V({id:"CurrentTime",label:"CurrentTime",category:{name:"value"},ports:{inputs:[],outputs:[{label:"seconds",id:"seconds",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.seconds.value} = (performance.now() / 1000);`}}))}};var hr=class{mCachedCallable;mDisplay;mElement;mSpecifiedParameters;mTarget;get display(){return this.mDisplay}get element(){return this.mElement||(this.mElement=this.mDisplay.generate()),this.mElement}constructor(t,e){this.mDisplay=t,this.mTarget=e,this.mCachedCallable=null,this.mElement=null,this.mSpecifiedParameters={...this.mDisplay.executor.defaultParameters}}execute(){this.mCachedCallable&&this.mDisplay.update(this.element,this.mCachedCallable)}refresh(){let t=this.mTarget instanceof ut?this.mTarget.node.function:this.mTarget,e=(()=>{try{return new ae(t.project).generateFunction(t,!0)}catch{return null}})();if(!e){this.mCachedCallable=null;return}let o=null;if(this.mTarget instanceof ut&&(o=this.resolvePortTarget(e,this.mTarget),!o)){this.mCachedCallable=null;return}let a=this.mDisplay.executor.compile(e,o);if(!this.mDisplay.allowsType(a.type)){this.mCachedCallable=null;return}let d=this.mDisplay.adapterFor(a.type);this.mCachedCallable=g=>d(a.execute({...this.mDisplay.executor.defaultParameters,...this.mSpecifiedParameters,...g}))}specifyParameters(t){this.mSpecifiedParameters={...this.mSpecifiedParameters,...t}}resolvePortTarget(t,e){let[o,a]=(()=>{for(let g of t.entryPoint.graphs)if(g.ports.has(e)&&g.nodes.has(e.node))return[g.ports.get(e),g.nodes.get(e.node)];return[null,null]})();if(!o||!a)return null;let d=e.direction==="input"?"start":"end";return{documentPort:e,nodeHook:e.project.generator.value.hook(`${d}-${a}`),value:o}}};var ce=class{mExecutor;mGenerate;mId;mName;mTypeAdapters;mUpdate;get executor(){return this.mExecutor}get id(){return`${this.mId}-${this.mExecutor.function.id}`}get name(){return this.mName}constructor(t,e){this.mId=e.id,this.mName=e.name,this.mExecutor=t,this.mGenerate=e.generate,this.mUpdate=e.update,this.mTypeAdapters=new Map;for(let[o,a]of Object.entries(e.typeAdapter))this.mExecutor.types.has(o)&&this.mTypeAdapters.set(o,a)}adapterFor(t){let e=t;if(!this.mTypeAdapters.has(e))throw new N(`Display "${this.mId}" has no type adapter for type "${t}".`,this);return this.mTypeAdapters.get(e)}allowsType(t){return this.mTypeAdapters.has(t)}createDriver(t){return new hr(this,t)}generate(){return this.mGenerate()}update(t,e){return this.mUpdate(t,e)}};var Me=class p extends ce{static MATRIX_SIZE=3;static VALUE_LENGTH=5;constructor(t){super(t,{id:"matrix",name:"Matrix 3x3",generate:()=>{let e=document.createElement("div");return e.style.boxSizing="border-box",e.style.display="grid",e.style.gap="2px",e.style.gridTemplateColumns=`repeat(${p.MATRIX_SIZE}, minmax(0, 1fr))`,e.style.height="100%",e.style.width="100%",e.style.fontFamily="var(--potatno-font-family)",e.style.fontSize="var(--potatno-font-size-small)",e.style.color="#fff",e},typeAdapter:{[st.MAIN]:e=>e.map(o=>this.formatPreviewValue(o)),number:e=>[this.formatPreviewValue(e)],string:e=>[this.formatPreviewValue(e)],boolean:e=>[this.formatPreviewValue(e)]},update:async(e,o)=>{await this.updateMatrixPreview(e,o)}})}formatPreviewValue(t){if(typeof t=="number"){if(!Number.isFinite(t))return t.toString().slice(0,p.VALUE_LENGTH);let e=Math.trunc(Math.abs(t)).toString().length,o=Math.max(0,p.VALUE_LENGTH-e-(t<0?1:0)-1);return t.toFixed(o).slice(0,p.VALUE_LENGTH)}return String(t).slice(0,p.VALUE_LENGTH)}async updateMatrixPreview(t,e){for(;t.children.length<p.MATRIX_SIZE*p.MATRIX_SIZE;){let o=document.createElement("div");o.style.alignItems="center",o.style.background="var(--potatno-color-background-dark)",o.style.border="1px solid var(--potatno-color-border)",o.style.boxSizing="border-box",o.style.color="var(--potatno-color-text)",o.style.display="flex",o.style.justifyContent="center",o.style.minWidth="0",o.style.overflow="hidden",o.style.padding="2px",o.style.textOverflow="clip",o.style.whiteSpace="pre-line",t.append(o)}for(let o=0;o<p.MATRIX_SIZE;o++)for(let a=0;a<p.MATRIX_SIZE;a++){let d=o*p.MATRIX_SIZE+a,g=p.MATRIX_SIZE===1?0:a/(p.MATRIX_SIZE-1),y=p.MATRIX_SIZE===1?0:o/(p.MATRIX_SIZE-1),T=e({x:g,y});t.children[d].textContent=T.join(`
`)}}};var Se=class p extends ce{static PREVIEW_PIXEL_SIZE=7.5;mCanvasImageData;mCanvasContext;constructor(t){super(t,{id:"2dCanvas",name:"Canvas 2D",generate:()=>{let e=document.createElement("canvas");return e.style.width="100%",e.style.height="100%",e.style.imageRendering="pixelated",e},typeAdapter:{[st.MAIN]:e=>e,number:e=>[e,e,e],boolean:e=>{let o=e?1:0;return[o,o,o]}},update:async(e,o)=>{await this.updateCanvasPreview(e,o)}}),this.mCanvasImageData=new WeakMap,this.mCanvasContext=new WeakMap}async updateCanvasPreview(t,e){this.mCanvasContext.has(t)||this.mCanvasContext.set(t,t.getContext("2d"));let o=this.mCanvasContext.get(t),a=Math.max(1,Math.round(t.clientWidth/p.PREVIEW_PIXEL_SIZE)),d=Math.max(1,Math.round(t.clientHeight/p.PREVIEW_PIXEL_SIZE));(t.width!==a||t.height!==d||!this.mCanvasImageData.has(t))&&(t.width=a,t.height=d,this.mCanvasImageData.set(t,o.createImageData(a,d)));let g=this.mCanvasImageData.get(t),y=g.data;for(let T=0;T<d;T++)for(let C=0;C<a;C++){let c=C/a,n=T/d,u=e({x:c,y:n}),l=(T*a+C)*4;y[l]=Math.floor(Math.max(0,Math.min(1,u[0]||0))*255),y[l+1]=Math.floor(Math.max(0,Math.min(1,u[1]||0))*255),y[l+2]=Math.floor(Math.max(0,Math.min(1,u[2]||0))*255),y[l+3]=255}o.putImageData(g,0,0)}};(()=>{let p=new WebSocket("ws://127.0.0.1:8088");p.addEventListener("open",()=>{console.log("Refresh connection established")}),p.addEventListener("message",t=>{console.log("Bundle finished. Start refresh"),t.data==="REFRESH"&&window.location.reload()})})();var Ct=new lr;Ct.addImport(new cr);Ct.addImport(new ur);var qi=new st(Ct.entryPoint,{defaultParameters:{x:0,y:0},types:[st.MAIN,"number","string","boolean"],build:(p,t,e)=>{let o=t.code,a=p.function.id;if(!e){let y=new Function(`${o}
return ${a};`)();return{type:st.MAIN,execute:T=>y(T.x,T.y)}}let d=o.replace(e.nodeHook,`; return ${e.value};`),g=new Function(`${d}
return ${a};`)();return{type:e.documentPort.resolvedDataType,execute:y=>g(y.x,y.y)}}}),Ji=new st(Ct.userFunction,{defaultParameters:{x:0,y:0},types:["number","string","boolean"],build:(p,t,e)=>{if(!e)return{type:"number",execute:()=>0};let o=t.entryPoint.function,a=`__fn_${o.id.replaceAll("-","_")}`,d=o.inputs.map(T=>p.projectTypes.getDefaultValue(T.dataType)),g=t.code.replace(e.nodeHook,`return ${e.value};`),y=new Function(`${g}
return ${a};`)();return{type:e.documentPort.resolvedDataType,execute:()=>y(...d)}}});Ct.preview.addDisplay(new Se(qi));Ct.preview.addDisplay(new Se(Ji));Ct.preview.addDisplay(new Me(qi));Ct.preview.addDisplay(new Me(Ji));var ca=document.getElementById("application-root"),Ae=new er(Ct);Ae.appendTo(ca);Ae.document=new jt(Ct);Ki();async function Ki(){try{await Ae.update()}catch(p){}requestAnimationFrame(Ki)}document.getElementById("load-button").addEventListener("click",ua);document.getElementById("save-button").addEventListener("click",ha);var Qi="potatno-code-document.json";async function ua(){if(window.confirm("Load saved document?"))try{let o=await(await(await navigator.storage.getDirectory()).getFileHandle(Qi)).getFile();Ae.load(await o.text())}catch{window.alert("Could not load document.")}}async function ha(){if(window.confirm("Override saved document?"))try{let o=await(await(await navigator.storage.getDirectory()).getFileHandle(Qi,{create:!0})).createWritable();await o.write(Ae.save()),await o.close()}catch{window.alert("Could not save document.")}}})();
//# sourceMappingURL=page.js.map
