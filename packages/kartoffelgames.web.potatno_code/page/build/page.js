(()=>{var zt=class f extends Array{static newListWith(...t){let e=new f;return e.push(...t),e}clear(){this.splice(0,this.length)}clone(){return f.newListWith(...this)}distinct(){return f.newListWith(...new Set(this))}equals(t){if(this===t)return!0;if(!t||this.length!==t.length)return!1;for(let e=0;e<this.length;++e)if(this[e]!==t[e])return!1;return!0}remove(t){let e=this.indexOf(t);if(e!==-1)return this.splice(e,1)[0]}replace(t,e){let o=this.indexOf(t);if(o!==-1){let l=this[o];return this[o]=e,l}}toString(){return`[${super.join(", ")}]`}};var A=class extends Error{mTarget;get target(){return this.mTarget}constructor(t,e,o){super(t,o),this.mTarget=e}};var k=class f extends Map{add(t,e){if(!this.has(t))this.set(t,e);else throw new A("Can't add duplicate key to dictionary.",this)}clone(){return new f(this)}getAllKeysOfValue(t){return[...this.entries()].filter(l=>l[1]===t).map(l=>l[0])}getOrDefault(t,e){let o=this.get(t);return typeof o<"u"?o:e}map(t){let e=new zt;for(let o of this){let l=t(o[0],o[1]);e.push(l)}return e}};var Pt=class f{mSize;mTopItem;get size(){return this.mSize}get top(){if(this.mTopItem)return this.mTopItem.value}constructor(){this.mTopItem=null,this.mSize=0}clone(){let t=new f;return t.mTopItem=this.mTopItem,t.mSize=this.mSize,t}*entries(){let t=this.mTopItem;for(;t!==null;)yield t.value,t=t.previous}flush(){let t=new Array;for(;this.mTopItem;)t.push(this.pop());return t}pop(){if(!this.mTopItem)return;let t=this.mTopItem.value;return this.mTopItem=this.mTopItem.previous,this.mSize--,t}push(t){let e={previous:this.mTopItem,value:t};this.mTopItem=e,this.mSize++}toArray(){return[...this.entries()]}};var ne=class{mCompareFunction;constructor(t){this.mCompareFunction=t}differencesOf(t,e){let o;if(t.length===0||e.length===0){if(o=new Array,t.length===0)for(let S=0;S<e.length;S++)o.push({changeState:Dt.Insert,item:e[S]});else for(let S=0;S<t.length;S++)o.push({changeState:Dt.Remove,item:t[S]});return o}let l={1:{x:0,history:[]}},m=S=>S-1,g=t.length,y=e.length,D;for(let S=0;S<g+y+1;S++)for(let c=-S;c<S+1;c+=2){let n=c===-S||c!==S&&l[c-1].x<l[c+1].x;if(n){let a=l[c+1];D=a.x,o=a.history}else{let a=l[c-1];D=a.x+1,o=a.history}o=o.slice();let u=D-c;for(1<=u&&u<=y&&n?o.push({changeState:Dt.Insert,item:e[m(u)]}):1<=D&&D<=g&&o.push({changeState:Dt.Remove,item:t[m(D)]});D<g&&u<y&&this.mCompareFunction(t[m(D+1)],e[m(u+1)]);)D+=1,u+=1,o.push({changeState:Dt.Keep,item:t[m(D)]});if(D>=g&&u>=y)return o;l[c]={x:D,history:o}}return new Array}},Dt=function(f){return f[f.Remove=1]="Remove",f[f.Insert=2]="Insert",f[f.Keep=3]="Keep",f}({});var ie=class{mNodeCache;constructor(){this.mNodeCache=new Map}start(t,e){let o=this.readFromCache(t),l=this.readFromCache(e),m=new sr;m.set(o,0);let g=new Map;g.set(o,0);let y=new Map,D=new Array;for(;m.length!==0;){let S=m.popLowest();if(D.push(S),S===l)return{path:[...this.pathTracer(S,y)].reverse(),processedNodes:D};for(let c of this.getNeighborNodes(S)){let n=(g.get(S)??Number.POSITIVE_INFINITY)+this.costOfTraversal(c,{startNode:o,endNode:l,path:this.pathTracer(S,y)}),u=g.get(c)??Number.POSITIVE_INFINITY;if(n>=u)continue;y.set(c,S),g.set(c,n);let a=n+this.heuristic(c,{startNode:o,endNode:l,path:this.pathTracer(S,y)});m.set(c,a)}}return{path:new Array,processedNodes:D}}getNeighborNodes(t){return this.neighborNodes(t).map(e=>this.readFromCache(e))}*pathTracer(t,e){let o=t;for(;yield o,!!e.has(o);)o=e.get(o)}readFromCache(t){let e=this.nodeId(t);return this.mNodeCache.has(e)?this.mNodeCache.get(e):(this.mNodeCache.set(e,t),t)}},sr=class{mExistingNodes;mList;mLowestCost;mLowestCostCounter;get length(){return this.mList.length}constructor(){this.mList=new Array,this.mExistingNodes=new Map,this.mLowestCost=Number.POSITIVE_INFINITY,this.mLowestCostCounter=0}popLowest(){if(this.mList.length===0)throw new A("Can not read next node from an empty priority list.",this);let[t,e]=(()=>{let g=null,y=0;for(let D=this.mList.length-1;D>-1;D--){let S=this.mList[D];if(S.cost===this.mLowestCost)return[S,0];(g===null||S.cost<g.cost)&&(g=S,y=0),S.cost===g.cost&&y++}if(g===null)throw new A("Lowest could not be found. Data is corrupted.",this);return[g,y]})();t.cost<this.mLowestCost&&(this.mLowestCost=t.cost,this.mLowestCostCounter=e),t.cost===this.mLowestCost&&this.mLowestCostCounter--,this.mLowestCostCounter<1&&(this.mLowestCost=Number.POSITIVE_INFINITY,this.mLowestCostCounter=0);let o=this.mExistingNodes.get(t.node),l=this.mList.length-1,m=this.mList[l];return this.mList[l]=t,this.mList[o]=m,this.mExistingNodes.set(m.node,o),this.mExistingNodes.delete(t.node),this.mList.pop().node}set(t,e){if(this.mLowestCostCounter>0&&e<this.mLowestCost&&(this.mLowestCost=e,this.mLowestCostCounter=0),e===this.mLowestCost&&this.mLowestCostCounter++,this.mExistingNodes.has(t)){let o=this.mExistingNodes.get(t),l=this.mList[o];if(l.cost===e){e===this.mLowestCost&&this.mLowestCostCounter--;return}l.cost=e;return}this.mList.push({cost:e,node:t}),this.mExistingNodes.set(t,this.mList.length-1)}};var se=class{mDataType;mId;mLabel;mPortType;mRegions;get dataType(){return this.mDataType}get id(){return this.mId}get label(){return this.mLabel}get portType(){return this.mPortType}get regions(){return this.mRegions}constructor(t){this.mLabel=t.label,this.mId=t.id,this.mPortType=t.portType,t.portType==="value"?this.mDataType=t.dataType:this.mDataType=null,this.mRegions={add:t.regions?.add??new Array}}};var ht=class{mCategory;mCodeGenerator;mId;mLabel;mPortProvider;mRegions;get category(){return this.mCategory}get codeGenerator(){return this.mCodeGenerator}get id(){return this.mId}get inputs(){let t=!1,e=[];return this.mPortProvider.inputs(o=>{if(e.push(new se(o)),o.portType==="flow"){if(t)throw new A(`Node definition ${this.id} has multiple input flow ports, which is not allowed.`,this);t=!0}}),e}get label(){return this.mLabel}get outputs(){let t=[];return this.mPortProvider.outputs(e=>{t.push(new se(e))}),t}get regions(){return this.mRegions}constructor(t){this.mId=t.id,this.mLabel=t.label,this.mCategory={name:t.category.name,icon:t.category.icon??"\u25C6"},this.mCodeGenerator=t.generators.code,this.mPortProvider=t.generators.ports,this.mRegions={add:t.regions?.add??new Array,allows:t.regions?.allows??new Array,requires:t.regions?.requires??new Array}}getPort(t){return[...this.inputs,...this.outputs].find(e=>e.id===t)}};var jt=class extends ht{mFunction;get function(){return this.mFunction}get label(){return this.mFunction.label}constructor(t){let e=(l,m,g)=>y=>{g.length===0&&y({label:l,id:l,portType:"flow"});for(let D of m)y({label:D.label,id:D.label,portType:"value",dataType:D.dataType})},o=t.project.getFunction(t.definitionId);super({id:`USERFUNCTION_${t.id}`,label:t.label,category:{name:"user function",icon:"\u0192"},generators:{ports:{inputs:e("Input",t.inputs,t.outputs),outputs:e("Output",t.outputs,t.outputs)},code:l=>o?o.codeGenerator.value({function:t,inputs:l.inputs,outputs:l.outputs,code:l.code}):""}}),this.mFunction=t}};var gt=class{mAffectedItems;mErrors;get affectedItems(){return this.mAffectedItems}get errors(){return this.mErrors}constructor(){this.mErrors=new Array,this.mAffectedItems=new Set}addAffectedItem(t){this.mAffectedItems.add(t)}merge(t){this.mErrors.push(...t.mErrors);for(let e of t.mAffectedItems)this.mAffectedItems.add(e);return this}pushError(...t){this.mErrors.push(...t)}},Z=class{mItem;mMessage;get item(){return this.mItem}get message(){return this.mMessage}constructor(t,e){this.mMessage=t,this.mItem=e}};var it=class{mConnectedPorts;mDataType;mDefinitionId;mDirectValue;mDirection;mDocument;mLabel;mNode;mPortType;mProject;get connectedPorts(){return this.mConnectedPorts}get dataType(){return this.mDataType}get definitionId(){return this.mDefinitionId}get directValue(){return this.mDirectValue}get direction(){return this.mDirection}get document(){return this.mDocument}get label(){return this.mLabel}set label(t){this.mLabel=t}get node(){return this.mNode}get portType(){return this.mPortType}get project(){return this.mProject}get resolvedDataType(){if(this.mPortType!=="value")throw new A("Port data type couldn't be resolved as it is no value port.",this);if(!this.mProject.types.isGenericType(this.mDataType??""))return this.mDataType;if(this.mDirection==="output"){let e=this.mNode.inputs.value.find(o=>o.dataType===this.mDataType);if(!e)throw new A("Port type couldn't be resolved as it has no resolving sibling port",this);return e.resolvedDataType}return this.mConnectedPorts.size===0?this.mDataType:this.mConnectedPorts.values().next().value.resolvedDataType}constructor(t,e,o){if(o.portType==="flow"&&o.dataType!==null)throw new A("Flow ports cannot have a value type.",this);if(o.portType==="value"&&o.dataType===null)throw new A("Value ports must have a value type.",this);this.mProject=t,this.mDocument=e,this.mNode=o.node,this.mDefinitionId=o.definitionId,this.mLabel=o.label,this.mDataType=o.dataType,this.mDirection=o.direction,this.mPortType=o.portType,this.mConnectedPorts=new Set,this.mDirectValue=new Array,o.dataType&&!this.mProject.types.isGenericType(o.dataType)&&this.mDirectValue.push(...t.types.getType(o.dataType).default.string)}connect(t){if(this.mConnectedPorts.has(t))return;if(this.mPortType!==t.portType)throw new A(`Cannot connect port ${this.mDefinitionId} of node ${this.mNode.label} to port ${t.mDefinitionId} of node ${t.node.label} due to incompatible port types.`,this);if(this.mDirection===t.direction)throw new A(`Cannot connect port ${this.mDefinitionId} of node ${this.mNode.label} to port ${t.mDefinitionId} of node ${t.node.label} due to incompatible directions.`,this);if(!(this.mPortType==="flow"&&this.mDirection==="input"||this.mPortType==="value"&&this.mDirection==="output"))for(let o of Array.from(this.mConnectedPorts))this.disconnect(o);this.mConnectedPorts.add(t),t.connect(this)}disconnect(t){this.mConnectedPorts.has(t)&&(this.mConnectedPorts.delete(t),t.disconnect(this))}setDirectValue(t){if(this.mPortType!=="value")throw new A("Only value ports can have a direct value.",this);if(this.mProject.types.isGenericType(this.mDataType))throw new A("Generic value ports cannot have a direct value.",this);if(t.length!==this.mProject.types.getType(this.mDataType).default.string.length)throw new A("The provided value does not match the expected length of the default value for this port's type.",this);this.mDirectValue.splice(0,this.mDirectValue.length),this.mDirectValue.push(...t)}validate(){let t=new gt;if(this.mDirection==="output"){if(this.mPortType==="flow"&&this.mConnectedPorts.size>1&&t.pushError(new Z(`Flow output port "${this.mDefinitionId}" on node "${this.mNode.label}" can only have one connection.`,this)),this.mPortType==="value"&&this.mProject.types.isGenericType(this.mDataType??"")){let e=this.mNode.inputs.value.filter(o=>o.dataType===this.mDataType);for(let o of e)o.connectedPorts.size===0&&t.pushError(new Z(`Generic output port "${this.mDefinitionId}" on node "${this.mNode.label}" cannot resolve generic type "${this.mDataType}" because its input port "${o.definitionId}" is not connected.`,this))}return t}if(this.mDirection==="input"){if(this.mPortType==="flow")return this.mConnectedPorts.size===0&&t.pushError(new Z(`Flow input port "${this.mDefinitionId}" on node "${this.mNode.label}" must have at least one connection.`,this)),t;if(this.mPortType==="value"){this.mConnectedPorts.size>1&&t.pushError(new Z(`Value input port "${this.mDefinitionId}" on node "${this.mNode.label}" can only have one connection.`,this));for(let e of this.mConnectedPorts)e.resolvedDataType!==this.resolvedDataType&&t.pushError(new Z(`Value input port "${this.mDefinitionId}" on node "${this.mNode.label}" expects type "${this.resolvedDataType}" but is connected to type "${e.resolvedDataType}".`,this));return t}}return t}};var vt=class{mDefinitionId;mDocument;mFunction;mInputs;mLabel;mOutputs;mPreview;mProject;mTransformation;get definitionId(){return this.mDefinitionId}get document(){return this.mDocument}get function(){return this.mFunction}get hasFlowPorts(){return this.mOutputs.flow.length>0||this.mInputs.flow.length>0}get hasValuePorts(){return this.mOutputs.value.length>0||this.mInputs.value.length>0}get inputs(){return this.mInputs}get label(){return this.mLabel}set label(t){this.mLabel=t}get outputs(){return this.mOutputs}get preview(){return this.mPreview}set preview(t){this.mPreview=t}get project(){return this.mProject}get transformation(){return this.mTransformation}constructor(t,e,o,l){this.mDocument=e,this.mDefinitionId=l.definitionId,this.mFunction=o,this.mLabel=l.label,this.mPreview=l.preview??null,this.mProject=t,this.mTransformation={x:0,y:0,width:0,height:0};let m=(g,y)=>{let D={direction:y,list:new Array,map:new Map,flow:new Array,value:new Array};for(let S of g){let c=new it(this.mProject,this.mDocument,{definitionId:S.definitionId,direction:y,label:S.label,node:this,portType:S.portType,dataType:S.dataType});D.list.push(c),D.map.set(c.definitionId,c),(c.portType==="flow"?D.flow:D.value).push(c)}return D};this.mInputs=m(l.ports.input,"input"),this.mOutputs=m(l.ports.output,"output"),this.resizeTo(l.transformation.width,l.transformation.height),this.moveTo(l.transformation.x,l.transformation.y)}moveTo(t,e){this.mTransformation.x=t,this.mTransformation.y=e}resizeTo(t,e){this.mTransformation.width=Math.max(6,t);let o=1+Math.max(this.mInputs.list.length,this.mOutputs.list.length);this.mTransformation.height=Math.max(o,e)}validate(t){let e=new gt,o=t??new Set,l=this.mFunction.nodeDefinitions.find(m=>m.id===this.mDefinitionId);if(!l)e.pushError(new Z(`Node "${this.mLabel}" definition "${this.mDefinitionId}" could not be found.`,this));else{e.merge(this.resyncPorts(this.mInputs,l.inputs)),e.merge(this.resyncPorts(this.mOutputs,l.outputs));let m=new Set([...l.regions.requires,...l.regions.allows]);if(m.size>0)for(let g of o)m.has(g)||e.pushError(new Z(`Node "${this.mLabel}" does not allow region "${g}".`,this));if(l.regions.requires.length>0)for(let g of l.regions.requires)o.has(g)||e.pushError(new Z(`Node "${this.mLabel}" requires region "${g}" but it is not active.`,this))}for(let m of[...this.mInputs.list,...this.mOutputs.list])e.merge(m.validate());return this.resizeTo(this.transformation.width,this.transformation.height),e}addPort(t,e,o){let l=new it(this.mProject,this.mDocument,{definitionId:e.id,direction:t.direction,label:e.label,node:this,portType:e.portType,dataType:e.dataType});return t.list.splice(o,0,l),t.map.set(l.definitionId,l),(l.portType==="flow"?t.flow:t.value).push(l),l}removePort(t,e){let o=t.list.indexOf(e);if(o===-1)throw new A(`Port "${e.label}" was not found and can not be removed.`,this);t.list.splice(o,1),t.map.delete(e.definitionId);let l=e.portType==="flow"?t.flow:t.value,m=l.indexOf(e);if(o===-1)throw new A(`Port "${e.label}" was not found in typed list and can not be removed.`,this);return l.splice(m,1),o}replacePort(t,e,o){let l=Array.from(e.connectedPorts);for(let y of Array.from(e.connectedPorts))e.disconnect(y);let m=this.removePort(t,e),g=this.addPort(t,o,m);for(let y of l)g.connect(y);return g}resyncPorts(t,e){let o=new gt,l=new Set(e.map(m=>m.id));for(let m=0;m<e.length;m++){let g=e[m];if(!t.map.has(g.id)){let n=this.addPort(t,g,m);o.addAffectedItem(n);continue}let y=t.map.get(g.id),D=y.portType!==g.portType,S=y.dataType!==g.dataType;if(!D&&!S)continue;if(y.connectedPorts.size>0&&D){o.pushError(new Z(`Port "${y.label}" on node "${this.mLabel}" has a changed type.`,y));continue}let c=this.replacePort(t,y,g);o.addAffectedItem(y),o.addAffectedItem(c)}for(let m of t.list)if(!l.has(m.definitionId)){if(m.connectedPorts.size===0){o.addAffectedItem(m),this.removePort(t,m);continue}o.pushError(new Z(`Port "${m.label}" on node "${this.mLabel}" no longer exists in its definition.`,m))}return o}};var pt=class{mDefinitionId;mDocument;mId;mImportIds;mInputs;mIsSystem;mLabel;mNodes;mOutputs;mProject;get definitionId(){return this.mDefinitionId}get document(){return this.mDocument}get dynamicNodeDefinitions(){let t=this.mProject.getFunction(this.definitionId);if(!t)return[...this.mDocument.nodeDefinitions];let e=t.getNodeDefinitions(this),o=this.mProject.imports.filter(l=>this.mImportIds.has(l.id)).flatMap(l=>l.nodes);return[...this.mDocument.nodeDefinitions,...o,...e.dynamic]}get id(){return this.mId}get imports(){return this.mImportIds}get inputs(){return this.mInputs}get isSystem(){return this.mIsSystem}get label(){return this.mLabel}set label(t){this.mLabel=t}get nodeDefinitions(){let t=this.mProject.getFunction(this.definitionId);if(!t)return this.dynamicNodeDefinitions;let e=t.getNodeDefinitions(this);return[...this.dynamicNodeDefinitions,...e.entry,...e.exit]}get nodes(){return this.mNodes}get outputs(){return this.mOutputs}get project(){return this.mProject}constructor(t,e,o){this.mProject=t,this.mDocument=e,this.mLabel=o.label,this.mIsSystem=o.isSystem,this.mDefinitionId=o.definitionId,this.mId=o.id,this.mNodes=new Set,this.mInputs=new Array,this.mOutputs=new Array,this.mImportIds=new Set}addImport(t){if(!this.project.imports.some(o=>o.id===t))throw new A(`Project does not contain import ${t}`,this);this.mImportIds.add(t)}addInput(t){this.mInputs.some(e=>e.label===t.label)||this.mInputs.push(t)}addNode(t){this.mNodes.add(t)}addNodeByDefinition(t,e){let o=m=>({definitionId:m.id,label:m.label,portType:m.portType,dataType:m.dataType}),l=new vt(this.mProject,this.mDocument,this,{definitionId:t.id,ports:{input:t.inputs.map(o),output:t.outputs.map(o)},label:t.label,transformation:e});return this.mNodes.add(l),l}addOutput(t){this.mOutputs.some(e=>e.label===t.label)||this.mOutputs.push(t)}getExitNodes(){let t=this.mProject.getFunction(this.mDefinitionId);if(!t)throw new A(`Function definition not found for function "${this.mLabel}".`,this);let e=new Set(t.getNodeDefinitions(this).exit.map(o=>o.id));return[...this.mNodes].filter(o=>e.has(o.definitionId))}removeImport(t){this.mImportIds.delete(t)}removeInput(t){let e=this.mInputs.findIndex(o=>o.label===t.label);e!==-1&&this.mInputs.splice(e,1)}removeNode(t){for(let e of[...t.inputs.list,...t.outputs.list])for(let o of Array.from(e.connectedPorts))e.disconnect(o);this.mNodes.delete(t)}removeOutput(t){let e=this.mOutputs.findIndex(o=>o.label===t.label);e!==-1&&this.mOutputs.splice(e,1)}validate(){let t=new gt,e=this.mProject.getFunction(this.mDefinitionId);e||t.pushError(new Z(`Function "${this.mLabel}" definition "${this.mDefinitionId}" could not be found.`,this));let o=e?.getNodeDefinitions(this);o&&this.resyncFunction(o,t);let l=this.collectRegions(this.mNodes,t),m=new Set(o?.entry.map(y=>y.id)??new Array),g=new Map;for(let y of this.mNodes)t.merge(y.validate(l.get(y))),this.collectEntryDomains(y,m,g).size>1&&t.pushError(new Z(`Node "${y.label}" is reachable from multiple entry nodes.`,y));return t}collectEntryDomains(t,e,o){if(o.has(t))return o.get(t);let l=new Set;o.set(t,l);for(let m of t.inputs.list)for(let g of m.connectedPorts){let y=g.node;e.has(y.definitionId)&&l.add(y);for(let D of this.collectEntryDomains(y,e,o))l.add(D)}return l}collectRegions(t,e){let o=new Map;for(let y of this.nodeDefinitions)o.set(y.id,y);let l=(()=>{let y=new Map;return(D,S)=>{if(!y.has(D.id)){let c=new Map;for(let n of D.outputs)c.set(n.id,n.regions.add);y.set(D.id,c)}return[...y.get(D.id).get(S)??new Array,...D.regions.add]}})(),m=(()=>{let y=new Map;return(D,S)=>{if(y.has(D))return y.get(D);if(S.has(D))return e.pushError(new Z(`Node "${D.label}" is part of a connection cycle.`,D)),new Set;S.add(D);let c=new Set;for(let n of D.inputs.list)for(let u of n.connectedPorts){let a=u.node;for(let r of m(a,S))c.add(r);if(o.has(a.definitionId))for(let r of l(o.get(a.definitionId),u.definitionId))c.add(r)}return y.set(D,c),c}})(),g=new Map;for(let y of t)g.set(y,m(y,new Set));return g}resyncFunction(t,e){let o=[...t.entry,...t.exit],l=new Set(this.mNodes.values().map(y=>y.definitionId)),m=0,g=20;for(let y of o){if(l.has(y.id))continue;let D=this.addNodeByDefinition(y,{x:Math.floor(m/(o.length/2))*g+2,y:m*g+2-Math.floor(m/(o.length/2))*(o.length/2*g),width:0,height:0});e.addAffectedItem(D),m++}}};var Mt=class{mFunctionNodeDefinitions;mFunctions;mProject;get functions(){return this.mFunctions}get nodeDefinitions(){return[...this.mFunctionNodeDefinitions.values(),...this.mProject.nodeDefinitions.values()]}get project(){return this.mProject}constructor(t){this.mProject=t,this.mFunctions=new Set,this.mFunctionNodeDefinitions=new Map}addFunction(t){this.mFunctions.add(t);let e=new jt(t);this.mFunctionNodeDefinitions.set(e.id,e)}newFunction(t){let e=new pt(this.mProject,this,t);this.mFunctions.add(e);let o=new jt(e);return this.mFunctionNodeDefinitions.set(o.id,o),e}removeFunction(t){if(!this.mFunctions.has(t))return!1;if(t.isSystem)throw new A("Cannot remove a system function.",this);this.mFunctions.delete(t);let e=this.mFunctionNodeDefinitions.values().find(o=>o.function===t);return e&&this.mFunctionNodeDefinitions.delete(e.id),!0}validate(){let t=new gt,e=this.mProject.entryPoint.id;if(!this.mFunctions.values().some(o=>o.definitionId===e)){let o=this.newFunction({definitionId:e,id:crypto.randomUUID(),isSystem:!0,label:this.mProject.entryPoint.label});t.addAffectedItem(o)}for(let o of this.mFunctions)t.merge(o.validate());return t.pushError(...this.detectCrossFunctionRecursion()),t}detectCrossFunctionRecursion(){let t=[],e=new Map,o=y=>{if(!e.has(y)){let D=new Set;for(let S of y.nodes)this.mFunctionNodeDefinitions.has(S.definitionId)&&D.add(this.mFunctionNodeDefinitions.get(S.definitionId).function);e.set(y,D)}return e.get(y)},l=new Set,m=new Set,g=y=>{if(!l.has(y)){if(m.has(y)){t.push(new Z(`Function "${y.label}" participates in a cross-function recursion cycle.`,y));return}m.add(y);for(let D of o(y))g(D);m.delete(y),l.add(y)}};for(let y of this.mFunctions)g(y);return t}};var tt=class f{static mComponents=new WeakMap;static mConstructorSelector=new WeakMap;static mElements=new WeakMap;static elementIsComponent(t){return f.mComponents.has(t)}static ofComponent(t){let e=t.processorConstructor,o=f.mConstructorSelector.get(e);if(!o)throw new A(`Constructor "${e.name}" is not a registered custom element`,e);let l=f.mElements.get(t);if(!l)throw new A(`Component "${t}" is not a registered component`,t);return{selector:o,constructor:e,element:l,component:t,processor:t.processor}}static ofConstructor(t){let e=f.mConstructorSelector.get(t);if(!e)throw new A(`Constructor "${t.name}" is not a registered custom element`,t);let o=globalThis.customElements.get(e);if(!o)throw new A(`Constructor "${t.name}" is not a registered custom element`,t);return{selector:e,constructor:t,elementConstructor:o}}static ofElement(t){let e=f.mComponents.get(t);if(!e)throw new A(`Element "${t}" is not a PwbComponent.`,t);return f.ofComponent(e)}static ofProcessor(t){let e=f.mComponents.get(t);if(!e)throw new A("Processor is not a PwbComponent.",t);return f.ofComponent(e)}static registerComponent(t,e,o){f.mComponents.has(e)||f.mComponents.set(e,t),o&&!f.mComponents.has(o)&&f.mComponents.set(o,t),f.mElements.has(t)||f.mElements.set(t,e)}static registerConstructor(t,e){t&&!f.mConstructorSelector.has(t)&&f.mConstructorSelector.set(t,e)}};var ae=class f{static CONFIGURATION_ATTACHMENT=Symbol("PwbApplicationConfigurationAttachment");static new(t,e){let o=new f;t(o),e&&o.appendTo(e)}mContent;mCurrentTarget;mFragment;constructor(){this.mContent=new Array,this.mFragment=document.createDocumentFragment(),this.mCurrentTarget=null}addContent(t){let e=tt.ofConstructor(t).elementConstructor,o=tt.ofElement(new e);return this.mContent.push(o.component),this.mFragment.appendChild(o.element),this.updateTarget(),o.processor}addStyle(t){let e=document.createElement("style");e.textContent=t,this.mFragment.prepend(e)}appendTo(t){this.mCurrentTarget=t,this.updateTarget()}updateTarget(){this.mCurrentTarget&&(this.mCurrentTarget.shadowRoot||this.mCurrentTarget.attachShadow({mode:"open"}),this.mCurrentTarget.shadowRoot.appendChild(this.mFragment))}};var Ut=class{mCustomMetadata;constructor(){this.mCustomMetadata=new Map}getMetadata(t){return this.mCustomMetadata.get(t)??null}setMetadata(t,e){this.mCustomMetadata.set(t,e)}};var le=class extends Ut{};var ce=class f extends Ut{static mPrivateMetadataKey=Symbol("Metadata");mDecoratorMetadataObject;mPropertyMetadata;constructor(t){super(),this.mDecoratorMetadataObject=t,this.mPropertyMetadata=new Map,t[f.mPrivateMetadataKey]=this}getInheritedMetadata(t){let e=new Array,o=this.mDecoratorMetadataObject;do{if(Object.hasOwn(o,f.mPrivateMetadataKey)){let m=o[f.mPrivateMetadataKey].getMetadata(t);m!==null&&e.push(m)}o=Object.getPrototypeOf(o)}while(o!==null);return e.reverse()}getProperty(t){return this.mPropertyMetadata.has(t)||this.mPropertyMetadata.set(t,new le),this.mPropertyMetadata.get(t)}};Symbol.metadata??=Symbol("Symbol.metadata");var st=class f{static mMetadataMapping=new Map;static add(t,e){return(o,l)=>{let m=f.forInternalDecorator(l.metadata);switch(l.kind){case"class":m.setMetadata(t,e);return;case"method":case"field":case"getter":case"setter":case"accessor":if(l.static)throw new Error("@Metadata.add not supported for statics.");m.getProperty(l.name).setMetadata(t,e);return}}}static forInternalDecorator(t){return f.mapMetadata(t)}static get(t){Object.hasOwn(t,Symbol.metadata)||f.polyfillMissingMetadata(t);let e=t[Symbol.metadata];return f.mapMetadata(e)}static init(){return(t,e)=>{f.forInternalDecorator(e.metadata)}}static mapMetadata(t){if(f.mMetadataMapping.has(t))return f.mMetadataMapping.get(t);let e=new ce(t);return f.mMetadataMapping.set(t,e),e}static polyfillMissingMetadata(t){let e=new Array,o=t;do e.push(o),o=Object.getPrototypeOf(o);while(o!==null);for(let l=e.length-1;l>=0;l--){let m=e[l];if(!Object.hasOwn(m,Symbol.metadata)){let g=null;l<e.length-2&&(g=e[l+1][Symbol.metadata]),m[Symbol.metadata]=Object.create(g,{})}}}};var O=class f{static mCurrentInjectionContext=null;static mInjectMode=new Map;static mInjectableConstructor=new Map;static mInjectableReplacement=new Map;static mInjectionConstructorIdentificationMetadataKey=Symbol("InjectionConstructorIdentification");static mSingletonMapping=new Map;static createObject(t,e,o){let[l,m]=typeof e=="object"&&e!==null?[!1,e]:[!!e,o??new Map],g=f.getInjectionIdentification(t);if(!f.mInjectableConstructor.has(g))throw new A(`Constructor "${t.name}" is not registered for injection and can not be built`,f);let y=l?"instanced":f.mInjectMode.get(g),D=new Map(m.entries().map(([n,u])=>[f.getInjectionIdentification(n),u])),S=f.mCurrentInjectionContext,c=new Map([...S?.localInjections.entries()??[],...D.entries()]);f.mCurrentInjectionContext={injectionMode:y,localInjections:c};try{if(!l&&y==="singleton"&&f.mSingletonMapping.has(g))return f.mSingletonMapping.get(g);let n=new t;return y==="singleton"&&!f.mSingletonMapping.has(g)&&f.mSingletonMapping.set(g,n),n}finally{f.mCurrentInjectionContext=S}}static injectable(t="instanced"){return(e,o)=>{f.registerInjectable(e,o.metadata,t)}}static registerInjectable(t,e,o){let l=f.getInjectionIdentification(t,e);f.mInjectableConstructor.set(l,t),f.mInjectMode.set(l,o)}static replaceInjectable(t,e){let o=f.getInjectionIdentification(t);if(!f.mInjectableConstructor.has(o))throw new A("Original constructor is not registered.",f);let l=f.getInjectionIdentification(e);if(!f.mInjectableConstructor.has(l))throw new A("Replacement constructor is not registered.",f);f.mInjectableReplacement.set(o,e)}static use(t){if(f.mCurrentInjectionContext===null)throw new A("Can't create object outside of an injection context.",f);let e=f.getInjectionIdentification(t);if(f.mCurrentInjectionContext.injectionMode!=="singleton"&&f.mCurrentInjectionContext.localInjections.has(e))return f.mCurrentInjectionContext.localInjections.get(e);let o=f.mInjectableReplacement.get(e);if(o||(o=f.mInjectableConstructor.get(e)),!o)throw new A(`Constructor "${t.name}" is not registered for injection and can not be built`,f);return f.createObject(o)}static getInjectionIdentification(t,e){let o=e?st.forInternalDecorator(e):st.get(t),l=o.getMetadata(f.mInjectionConstructorIdentificationMetadataKey);return l||(l=Symbol(t.name),o.setMetadata(f.mInjectionConstructorIdentificationMetadataKey,l)),l}};var X=function(f){return f[f.Read=1]="Read",f[f.ReadWrite=2]="ReadWrite",f[f.Write=3]="Write",f}({});var Et=class{mHooks;mInjections;mProcessor;mProcessorConstructor;get processor(){if(!this.mProcessor)throw new A("Processor is not created yet. Call setup to create processor.",this);return this.mProcessor}get processorConstructor(){return this.mProcessorConstructor}constructor(t){if(this.mProcessorConstructor=t.constructor,this.mProcessor=null,this.mInjections=new Map,this.mHooks={create:new Array},t.parent)for(let[e,o]of t.parent.mInjections.entries())this.setProcessorInjection(e,o)}deconstruct(){}getProcessorInjection(t){return this.mInjections.get(t)}setProcessorInjection(t,e){if(this.mProcessor)throw new A("Cant add injections to after construction.",this);this.mInjections.set(t,e)}setup(){return this.mProcessor=this.createProcessor(),this}addConstructionHook(t){return this.mHooks.create.push(t),this}call(t,...e){let o=Reflect.get(this.processor,t);return typeof o!="function"?null:o.apply(this.processor,e)}createProcessor(){let t=O.createObject(this.mProcessorConstructor,this.mInjections),e;for(;e=this.mHooks.create.pop();){let o=e.call(this,t);o&&(t=o)}return t}};var Nt=class f extends Et{constructor(t,e){super({constructor:t,parent:e}),this.setProcessorInjection(f,this)}deconstruct(){this.call("onDeconstruct"),super.deconstruct()}setup(){return super.setup(),this.call("onExecute"),this}onUpdate(){return!1}};var ar=class f{static mInstance;mCoreEntityConstructor;mProcessorConstructorConfiguration;constructor(){if(f.mInstance)return f.mInstance;f.mInstance=this,this.mCoreEntityConstructor=new Map,this.mProcessorConstructorConfiguration=new Map}get(t){let e=this.mCoreEntityConstructor.get(t);if(!e)return new Array;let o=new Array;for(let l of e)o.push({processorConstructor:l,processorConfiguration:this.mProcessorConstructorConfiguration.get(l)});return o}register(t,e,o){this.mProcessorConstructorConfiguration.set(e,o);let l=t;do{if(!(l.prototype instanceof Et)&&l!==Et)break;this.mCoreEntityConstructor.has(l)||this.mCoreEntityConstructor.set(l,new Set),this.mCoreEntityConstructor.get(l).add(e)}while(l=Object.getPrototypeOf(l))}},lt=new ar;var Ht=class f extends Et{static mExtensionCache=new WeakMap;mExtensionList;constructor(t){super(t),this.mExtensionList=new Array}deconstruct(){for(let t of this.mExtensionList)t.deconstruct();super.deconstruct()}setup(){return super.setup(),this.executeExtensions(),this}executeExtensions(){let t=(()=>{if(!f.mExtensionCache.has(this.processorConstructor)){let l=lt.get(Nt).filter(g=>{for(let y of g.processorConfiguration.targetRestrictions)if(this instanceof y||this.processorConstructor.prototype instanceof y||this.processorConstructor===y)return!0;return!1}),m={read:l.filter(g=>g.processorConfiguration.access===X.Read),write:l.filter(g=>g.processorConfiguration.access===X.Write),readWrite:l.filter(g=>g.processorConfiguration.access===X.ReadWrite)};f.mExtensionCache.set(this.processorConstructor,m)}return f.mExtensionCache.get(this.processorConstructor)})(),e=[...t.write,...t.readWrite,...t.read];for(let o of e)this.mExtensionList.push(new Nt(o.processorConstructor,this).setup())}};var At=class{mData;mInteractionType;mOrigin;get data(){return this.mData}get origin(){return this.mOrigin}get triggerType(){return this.mInteractionType}constructor(t,e,o){this.mInteractionType=t,this.mData=o,this.mOrigin=e}};var Lt=class f{static mCurrentZone=new f("Default");static get current(){return f.mCurrentZone}static create(t){return new f(t)}mInteractionListener;mName;mTriggerFilterBitmap;get name(){return this.mName}constructor(t){this.mName=t,this.mTriggerFilterBitmap=-1,this.mInteractionListener=new Map}addInteractionListener(t){return this.mInteractionListener.set(t,f.current),this}execute(t,...e){let o=f.mCurrentZone;f.mCurrentZone=this;try{return t(...e)}finally{f.mCurrentZone=o}}pushInteraction(t,e){if((this.mTriggerFilterBitmap&t)===0)return!1;if(this.mInteractionListener.size===0)return!0;let o=new At(t,this,e);for(let[l,m]of this.mInteractionListener.entries())m.execute(()=>{l.call(this,o)});return!0}removeInteractionListener(t){return t?(this.mInteractionListener.delete(t),this):(this.mInteractionListener.clear(),this)}setTriggerRestriction(t){return this.mTriggerFilterBitmap=t,this}};var G={get:1,set:2,manual:4};var Ie=class f{static ORIGINAL_TO_INTERACTION_MAPPING=new WeakMap;static PROXY_TO_ORIGINAL_MAPPING=new WeakMap;static UNTRACEABLE_FUNCTION_UPDATE_TRIGGER=(()=>{let t=new WeakMap;return t.set(Array.prototype.fill,G.set),t.set(Array.prototype.pop,G.get),t.set(Array.prototype.push,G.set),t.set(Array.prototype.shift,G.get),t.set(Array.prototype.unshift,G.set),t.set(Array.prototype.splice,G.set),t.set(Array.prototype.reverse,G.set),t.set(Array.prototype.sort,G.set),t.set(Array.prototype.concat,G.set),t.set(Map.prototype.clear,G.set),t.set(Map.prototype.delete,G.set),t.set(Map.prototype.set,G.set),t.set(Set.prototype.clear,G.set),t.set(Set.prototype.delete,G.set),t.set(Set.prototype.add,G.set),t})();static getOriginal(t){return f.PROXY_TO_ORIGINAL_MAPPING.get(t)??t}static getWrapper(t){let e=f.getOriginal(t);return f.ORIGINAL_TO_INTERACTION_MAPPING.get(e)}mProxyObject;mStateChangeCallback;get proxy(){return this.mProxyObject}constructor(t,e){let o=f.getWrapper(t);if(o)return o;this.mProxyObject=this.createProxyObject(t),this.mStateChangeCallback=e,f.PROXY_TO_ORIGINAL_MAPPING.set(this.mProxyObject,t),f.ORIGINAL_TO_INTERACTION_MAPPING.set(t,this)}convertToProxy(t){return t===null||typeof t!="object"&&typeof t!="function"?t:new f(t,this.mStateChangeCallback).proxy}createProxyObject(t){let e=(l,m,g)=>{let y=f.getOriginal(m);try{let D=l.call(y,...g);return this.convertToProxy(D)}finally{if(f.UNTRACEABLE_FUNCTION_UPDATE_TRIGGER.has(l)){let D=f.getWrapper(m);D&&D.dispatch(f.UNTRACEABLE_FUNCTION_UPDATE_TRIGGER.get(l))}}};return new Proxy(t,{apply:(l,m,g)=>{let y=l;try{let D=y.call(m,...g);return this.convertToProxy(D)}catch(D){if(!(D instanceof TypeError))throw D;return e(y,m,g)}},set:(l,m,g)=>{try{let y=g;return(y!==null&&typeof y=="object"||typeof y=="function")&&(y=f.getOriginal(y)),Reflect.set(l,m,y)}finally{this.dispatch(G.set)}},get:(l,m,g)=>{try{return this.convertToProxy(Reflect.get(l,m))}finally{this.dispatch(G.get)}},deleteProperty:(l,m)=>{try{return delete l[m]}finally{this.dispatch(G.set)}}})}dispatch(t){this.mStateChangeCallback(t)}};var H=class f{static reaction(t){let e=Lt.create("ComponentState reaction");e.addInteractionListener(o=>{(o.triggerType&G.set)!==0&&t()}),e.execute(()=>{t()})}static state(t){return(e,o)=>{if(o.static)throw new A("Event target is not for a static property.",f);let l=new WeakMap,m=(g,y)=>{l.set(g,new f(y,t))};return{init(g){return typeof g>"u"||m(this,g),g},set(g){l.has(this)?l.get(this).set(g):m(this,g)},get(){return l.has(this)||m(this,void 0),l.get(this).get()}}}}mConfiguration;mLinkedZones;mLinkedZonesArray;mValue;constructor(t,e){if(this.mLinkedZones=new Set,this.mLinkedZonesArray=new Array,this.mConfiguration={complexValue:e?.complexValue??!1,proxy:e?.proxy??!1},this.mConfiguration.proxy){if(typeof t!="object"||t===null)throw new A("Proxied component state value must be an object.",this);this.mValue=new Ie(t,o=>{switch(o){case G.set:return this.dispatchChange();case G.get:return this.linkCurrentZone()}}).proxy}else this.mValue=t}get(){return this.linkCurrentZone(),this.mValue}set(t){if(this.mConfiguration.proxy)throw new A("Proxy is not implemented yet.",this);!this.mConfiguration.complexValue&&this.mValue===t||(this.mValue=t,this.dispatchChange())}dispatchChange(){for(let t of this.mLinkedZonesArray)t.pushInteraction(G.set,this)}linkCurrentZone(){let t=Lt.current;this.mLinkedZones.has(t)||(this.mLinkedZones.add(t),this.mLinkedZonesArray.push(t))}};var Rt=class f{static mCurrentUpdateCycle=null;static openResheduledCycle(t,e){let o=!1;if(!f.mCurrentUpdateCycle){let l=performance.now();f.mCurrentUpdateCycle={initiator:t.initiator,startTime:l,forcedSync:t.forcedSync,runner:t.runner},o=!0}try{return e(f.mCurrentUpdateCycle)}finally{o&&(f.mCurrentUpdateCycle=null)}}static openUpdateCycle(t,e){let o=!1;if(!f.mCurrentUpdateCycle){let l=performance.now();f.mCurrentUpdateCycle={initiator:t.updater,startTime:l,forcedSync:t.runSync,runner:Symbol("Runner "+l)},o=!0}try{return e(f.mCurrentUpdateCycle)}finally{o&&(f.mCurrentUpdateCycle=null)}}static updateCycleRunId(t,e){if(t.initiator===e){let o=performance.now(),l=t;l.runner=Symbol("Runner "+o)}}static updateCyleStartTime(t){let e=performance.now(),o=t;o.startTime=e}};var Se=class extends Error{mChain;get chain(){return this.mChain}constructor(t,e){let o=e.slice(-20).map(l=>l.toString()).join(`
`);super(`${t}: 
${o}`),this.mChain=[...e]}};var Ce=class f{static mFrameTime=100;static mStackCap=100;static get frameTime(){return f.mFrameTime}static set frameTime(t){f.mFrameTime=t}static get stackCap(){return f.mStackCap}static set stackCap(t){f.mStackCap=t}mInteractionZone;mManualComponentState;mUpdateFunction;mUpdateRunCache;mUpdateStates;get zone(){return this.mInteractionZone}constructor(t){this.mUpdateRunCache=new WeakMap,this.mUpdateFunction=t.onUpdate,this.mManualComponentState=new H(Symbol("Manual Update")),this.mUpdateStates={chainCompleteHooks:new Pt,async:{hasSheduledTask:!1,hasRunningTask:!1,sheduledTaskIsResheduled:!1},sync:{running:!1},cycle:{chainedTask:null}},this.mInteractionZone=Lt.create("Update-Zone"),this.mInteractionZone.addInteractionListener(e=>{(e.triggerType&G.set)!==0&&this.runUpdateAsynchron(e,null)})}deconstruct(){this.mInteractionZone.removeInteractionListener()}executeInZone(t){return this.mInteractionZone.execute(t)}update(){let t=new At(G.manual,this.mInteractionZone,this.mManualComponentState);return this.runUpdateSynchron(t)}updateAsync(){let t=new At(G.manual,this.mInteractionZone,this.mManualComponentState);this.runUpdateAsynchron(t,null)}async waitForUpdate(){return this.mUpdateStates.async.hasSheduledTask?new Promise((t,e)=>{this.mUpdateStates.chainCompleteHooks.push((o,l)=>{l?e(l):t(o)})}):!1}executeTaskChain(t,e,o,l){if(l.length>f.stackCap)throw new Se("Call loop detected",l);let m=performance.now();if(!e.forcedSync&&m-e.startTime>f.frameTime)throw new ue;l.push(t);let g=this.mInteractionZone.execute(()=>this.mUpdateFunction.call(this))||o;if(Rt.updateCycleRunId(e,this),!this.mUpdateStates.cycle.chainedTask)return g;let y=this.mUpdateStates.cycle.chainedTask;return this.mUpdateStates.cycle.chainedTask=null,this.executeTaskChain(y,e,g,l)}releaseUpdateChainCompleteHooks(t,e){if(!this.mUpdateStates.chainCompleteHooks.top)return;let o;for(;o=this.mUpdateStates.chainCompleteHooks.pop();)o(t,e)}runUpdateAsynchron(t,e){if(this.mUpdateStates.async.hasRunningTask||this.mUpdateStates.async.sheduledTaskIsResheduled){this.mUpdateStates.cycle.chainedTask=t;return}if(this.mUpdateStates.async.hasSheduledTask)return;let o=l=>{this.mUpdateStates.async.hasRunningTask=!0,this.mUpdateStates.async.hasSheduledTask=!1,this.mUpdateStates.async.sheduledTaskIsResheduled=!1;let m=!1;try{this.runUpdateSynchron(t)}catch(g){g instanceof ue&&l.initiator===this&&(m=!0)}finally{this.mUpdateStates.async.hasRunningTask=!1}m&&this.runUpdateAsynchron(t,l)};this.mUpdateStates.async.hasSheduledTask=!0,e&&(this.mUpdateStates.async.sheduledTaskIsResheduled=!0),globalThis.requestAnimationFrame(()=>{e?Rt.openResheduledCycle(e,o):Rt.openUpdateCycle({updater:this,runSync:!1},o)})}runUpdateSynchron(t){if(this.mUpdateStates.sync.running)return this.mUpdateStates.cycle.chainedTask=t,!1;this.mUpdateStates.sync.running=!0;try{let e=Rt.openUpdateCycle({updater:this,runSync:!0},o=>{if(this.mUpdateRunCache.has(o.runner))return Rt.updateCyleStartTime(o),this.mUpdateRunCache.get(o.runner);let l=this.executeTaskChain(t,o,!1,new Array);return this.mUpdateRunCache.set(o.runner,l),l});return this.releaseUpdateChainCompleteHooks(e),e}catch(e){throw e instanceof ue||this.releaseUpdateChainCompleteHooks(!1,e),e}finally{this.mUpdateStates.sync.running=!1}}},ue=class extends Error{constructor(){super("Update resheduled")}};var Pe=class extends Ht{mUpdater;get updater(){return this.mUpdater}constructor(t){super(t),this.mUpdater=new Ce({label:t.constructor.name,onUpdate:()=>this.onUpdate()})}call(t,...e){return this.mUpdater.executeInZone(()=>super.call(t,...e))}deconstruct(){this.mUpdater.deconstruct(),super.deconstruct()}createProcessor(){return this.mUpdater.executeInZone(()=>super.createProcessor())}};var Vt=class{mExpression;mTemporaryValues;constructor(t,e,o){if(this.mTemporaryValues=new k,o.length>0)for(let l of o)this.mTemporaryValues.set(l,void 0);this.mExpression=this.createEvaluationFunction(t,this.mTemporaryValues).bind(e.store)}execute(){return this.mExpression()}setTemporaryValue(t,e){if(!this.mTemporaryValues.has(t))throw new A(`Temporary value "${t}" does not exist for this procedure.`,this);this.mTemporaryValues.set(t,e)}createEvaluationFunction(t,e){let o,l=`__${Math.random().toString(36).substring(2)}`;if(o="return function () {",e.size>0)for(let m of e.keys())o+=`const ${m} = ${l}.get('${m}');`;return o+=`return ${t};`,o+="};",new Function(l,o)(e)}};var xt=class{mDataLevel;get data(){return this.mDataLevel}constructor(t){this.mDataLevel=t}createExpressionProcedure(t,e){return new Vt(t,this.data,e??[])}setTemporaryValue(t,e){this.data.setTemporaryValue(t,e)}};var dt=class{mComponent;mDataProxy;mParentLevel;mTemporaryValues;get store(){return this.mDataProxy}constructor(t){this.mTemporaryValues=new k,t instanceof $?(this.mParentLevel=null,this.mComponent=t):(this.mParentLevel=t,this.mComponent=t.mComponent),this.mDataProxy=this.createAccessProxy()}deleteTemporaryValue(t){this.mTemporaryValues.delete(t)}setTemporaryValue(t,e){this.mTemporaryValues.set(t,e)}updateLevelData(t){if(t.mParentLevel!==this.mParentLevel)throw new A("Can't update InstructionLevelData for a deeper level than it target data.",this);this.mTemporaryValues=t.mTemporaryValues}createAccessProxy(){return new Proxy(new Object,{get:(t,e)=>this.getValue(e),set:(t,e,o)=>(this.hasTemporaryValue(e)&&this.setTemporaryValue(e,o),e in this.mComponent.processor?(this.mComponent.processor[e]=o,!0):(this.setTemporaryValue(e,o),!0)),deleteProperty:()=>{throw new A("Deleting properties is not allowed",this)},ownKeys:()=>[...new Set([...Object.keys(this.mComponent.processor),...this.getTemporaryValuesList()])]})}getTemporaryValuesList(){let t=this.mTemporaryValues.map(e=>e);return this.mParentLevel&&t.push(...this.mParentLevel.getTemporaryValuesList()),t}getValue(t){if(this.mTemporaryValues.has(t))return this.mTemporaryValues.get(t);if(this.mParentLevel)return this.mParentLevel.getValue(t);if(t in this.mComponent.processor)return this.mComponent.processor[t]}hasTemporaryValue(t){return this.mTemporaryValues.has(t)?!0:this.mParentLevel?this.mParentLevel.hasTemporaryValue(t):!1}};var $t=class f{mChildList;mInstruction;mInstructionType;get childList(){return this.mChildList}get instruction(){return this.mInstruction}get instructionType(){return this.mInstructionType}constructor(t,e){this.mChildList=Array(),this.mInstruction=e,this.mInstructionType=t}appendChild(...t){this.mChildList.push(...t)}clone(){let t=new f(this.instructionType,this.instruction);for(let e of this.mChildList)t.appendChild(e.clone());return t}equals(t){if(!(t instanceof f)||t.instruction!==this.instruction||t.instructionType!==this.instructionType||t.childList.length!==this.childList.length)return!1;for(let e=0;e<t.childList.length;e++)if(!t.childList[e].equals(this.childList[e]))return!1;return!0}removeChild(t){let e=this.mChildList.indexOf(t);if(e!==-1)return this.mChildList.splice(e,1)[0]}};var yt=class f{mExpression;get value(){return this.mExpression}constructor(t){this.mExpression=t}clone(){return new f(this.mExpression)}equals(t){return t instanceof f&&t.value===this.value}toString(){return`{{ ${this.mExpression} }}`}};var It=class f{mContainsExpression;mTextValue;mValues;get containsExpression(){return this.mContainsExpression}get values(){return this.mValues}constructor(){this.mTextValue="",this.mContainsExpression=!1,this.mValues=[]}addValue(...t){for(let e of t)(this.mContainsExpression===!0||e instanceof yt)&&(this.mContainsExpression=!0),this.mValues.push(e),this.mTextValue+=e.toString()}clone(){let t=new f;for(let e of this.values)typeof e=="string"?t.addValue(e):t.addValue(e.clone());return t}equals(t){if(!(t instanceof f)||t.values.length!==this.values.length)return!1;for(let e=0;e<this.values.length;e++){let o=this.values[e],l=t.values[e];if(o!==l&&(typeof o!=typeof l||typeof o=="string"&&o!==l||!l.equals(o)))return!1}return!0}toString(){return this.mTextValue}};var he=class f{mName;mValue;get name(){return this.mName}get values(){return this.mValue}constructor(t){this.mName=t,this.mValue=new It}clone(){let t=new f(this.name);for(let e of this.values.values)typeof e=="string"?t.values.addValue(e):t.values.addValue(e.clone());return t}equals(t){return!(!(t instanceof f)||t.name!==this.name||!t.values.equals(this.values))}};var St=class f{mAttributeDictionary;mChildList;mTagName;get attributes(){return[...this.mAttributeDictionary.values()]}get childList(){return this.mChildList}get tagName(){return this.mTagName}constructor(t){this.mAttributeDictionary=new Map,this.mChildList=Array(),this.mTagName=t}appendChild(...t){this.mChildList.push(...t)}clone(){let t=new f(this.tagName);for(let e of this.mAttributeDictionary.values()){let o=t.setAttribute(e.name);for(let l of e.values.values)typeof l=="string"?o.addValue(l):o.addValue(l.clone())}for(let e of this.mChildList)t.appendChild(e.clone());return t}equals(t){if(!(t instanceof f)||t.tagName!==this.tagName||t.attributes.length!==this.mAttributeDictionary.size||t.childList.length!==this.mChildList.length)return!1;for(let e of t.mAttributeDictionary.values()){let o=this.mAttributeDictionary.get(e.name);if(!o||!o.equals(e))return!1}for(let e=0;e<t.childList.length;e++)if(!t.childList[e].equals(this.mChildList[e]))return!1;return!0}getAttribute(t){return this.mAttributeDictionary.get(t)?.values??null}removeAttribute(t){return this.mAttributeDictionary.delete(t)}removeChild(t){let e=this.mChildList.indexOf(t);if(e!==-1)return this.mChildList.splice(e,1)[0]}setAttribute(t){if(this.mAttributeDictionary.has(t))return this.mAttributeDictionary.get(t).values;let e=new he(t);return this.mAttributeDictionary.set(t,e),e.values}};var ct=class f{mBodyElementList;get body(){return this.mBodyElementList}constructor(){this.mBodyElementList=new Array}appendChild(...t){this.mBodyElementList.push(...t)}clone(){let t=new f;for(let e of this.mBodyElementList)t.appendChild(e.clone());return t}equals(t){if(!(t instanceof f)||t.body.length!==this.mBodyElementList.length)return!1;for(let e=0;e<this.mBodyElementList.length;e++)if(!this.mBodyElementList[e].equals(t.body[e]))return!1;return!0}removeChild(t){let e=this.mBodyElementList.indexOf(t);if(e!==-1)return this.mBodyElementList.splice(e,1)[0]}};var at=class{mComponentValues;mContent;mModules;mTemplate;get anchor(){return this.mContent.contentAnchor}get content(){return this.mContent}get modules(){return this.mModules}get template(){return this.mTemplate}get values(){return this.mComponentValues}constructor(t,e,o,l){this.mTemplate=t,this.mComponentValues=o,this.mContent=l,this.mModules=e,l.setCoreBuilder(this)}deconstruct(){this.content.deconstruct()}update(){let t=this.onUpdate(),e=!1,o=this.content.builders;if(o.length>0)for(let l=0;l<o.length;l++)e=o[l].update()||e;return t||e}createHtmlElement(t){let e=t.tagName;if(typeof e!="string")throw e;if(e.includes("-")){let l=globalThis.customElements.get(e);if(typeof l<"u")return new l}let o=t.getAttribute("xmlns");return o&&!o.containsExpression?document.createElementNS(o.values[0],e):document.createElement(e)}createTextNode(t){return document.createTextNode(t)}};var Xt=class{mChildBuilderList;mChildComponents;mContentAnchor;mContentBoundary;mLinkedContent;mRootChildList;get body(){return this.mRootChildList}get builders(){return this.mChildBuilderList}get contentAnchor(){return this.mContentAnchor}constructor(t){this.mChildBuilderList=new Array,this.mRootChildList=new Array,this.mChildComponents=new Map,this.mLinkedContent=new WeakSet,this.mContentAnchor=document.createComment(t),this.mContentBoundary={start:this.mContentAnchor,end:this.mContentAnchor}}deconstruct(){this.onDeconstruct();let t;for(;t=this.mChildBuilderList.pop();)t.deconstruct();for(let o of this.mChildComponents.values())o.deconstruct();this.mChildComponents.clear();let e;for(;e=this.mRootChildList.pop();)e instanceof at||e.remove();this.contentAnchor.remove()}getBoundary(){let t=this.mContentBoundary.end instanceof at?this.mContentBoundary.end.content.getBoundary().end:this.mContentBoundary.end;return{start:this.mContentBoundary.start,end:t}}insert(t,e,o){if(!this.mLinkedContent.has(o))throw new A("Can't add content to builder. Target is not part of builder.",this);let l=t instanceof at?t.anchor:t;switch(e){case"After":{this.insertAfter(l,o);break}case"TopOf":{this.insertTop(l,o);break}case"BottomOf":{this.insertBottom(l,o);break}}this.mLinkedContent.add(t),t instanceof at?this.mChildBuilderList.push(t):this.addChildComponent(t);let m=l.parentElement??l.getRootNode(),g=this.mContentAnchor.parentElement??this.mContentAnchor.getRootNode();if(m===g){let y=(()=>{switch(e){case"After":return this.mRootChildList.indexOf(o)+1;case"TopOf":return 0;case"BottomOf":return this.mRootChildList.length}})();y===this.mRootChildList.length&&(this.mContentBoundary.end=t),this.mRootChildList.splice(y+1,0,t)}}remove(t){if(!this.mLinkedContent.has(t))throw new A("Child node cant be deleted from builder when it not a child of them",this);if(this.mLinkedContent.delete(t),t instanceof at){let o=this.mChildBuilderList.indexOf(t);o!==-1&&this.mChildBuilderList.splice(o,1),t.deconstruct()}else{let o=this.mChildComponents.get(t);o&&(o.deconstruct(),this.mChildComponents.delete(t)),t.remove()}let e=this.mRootChildList.indexOf(t);e!==-1&&(this.mRootChildList.splice(e,1),this.mContentBoundary.end=this.mRootChildList.at(-1)??this.mContentAnchor)}setCoreBuilder(t){this.mLinkedContent.add(t)}addChildComponent(t){tt.elementIsComponent(t)&&this.mChildComponents.set(t,tt.ofElement(t).component)}insertAfter(t,e){let o=e instanceof at?e.content.getBoundary().end:e;(o.parentElement??o.getRootNode()).insertBefore(t,o.nextSibling)}insertBottom(t,e){if(e instanceof at){this.insertAfter(t,e);return}if(e instanceof Element){e.appendChild(t);return}throw new A("Source node does not support child nodes.",this)}insertTop(t,e){if(e instanceof at){this.insertAfter(t,e.anchor);return}if(e instanceof Element){e.prepend(t);return}throw new A("Source node does not support child nodes.",this)}};var Me=class extends Xt{mAttributeModulesChangedOrder;mLinkedAttributeData;mLinkedAttributeExpressionModules;mLinkedAttributeModuleList;mLinkedExpressionModuleList;get linkedAttributeModules(){return this.mAttributeModulesChangedOrder&&(this.mAttributeModulesChangedOrder=!1,this.mLinkedAttributeModuleList.sort((t,e)=>t.accessMode-e.accessMode)),this.mLinkedAttributeModuleList}get linkedExpressionModules(){return this.mLinkedExpressionModuleList}constructor(t){super(t),this.mLinkedExpressionModuleList=new Array,this.mLinkedAttributeModuleList=new Array,this.mLinkedAttributeExpressionModules=new WeakMap,this.mLinkedAttributeData=new WeakMap,this.mAttributeModulesChangedOrder=!1}attributeOfLinkedExpressionModule(t){return this.mLinkedAttributeExpressionModules.get(t)}getLinkedAttributeData(t){if(!this.mLinkedAttributeData.has(t))throw new A("Attribute has no linked data.",this);return this.mLinkedAttributeData.get(t)}linkAttributeExpression(t,e){this.mLinkedAttributeExpressionModules.set(t,e)}linkAttributeModule(t){this.mLinkedAttributeModuleList.push(t),this.mAttributeModulesChangedOrder=!0}linkAttributeNodes(t,e,o){this.mLinkedAttributeData.set(t,{values:o,node:e})}linkExpressionModule(t){this.mLinkedExpressionModuleList.push(t)}onDeconstruct(){for(let t of this.mLinkedAttributeModuleList)t.deconstruct();for(let t of this.mLinkedExpressionModuleList)t.deconstruct()}};var Ne=class extends Xt{mInstructionModule;get instructionModule(){return this.mInstructionModule}constructor(t,e){super(e),this.mInstructionModule=t}onDeconstruct(){this.mInstructionModule.deconstruct()}};var Ae=class extends at{constructor(t,e,o){let l=e.createInstructionModule(t,o);super(t,e,o,new Ne(l,`Instruction - {$${t.instructionType}}`))}onUpdate(){if(this.content.instructionModule.update()){let t=this.content.body;this.updateStaticBuilder(t,this.content.instructionModule.instructionResult.elementList)}return!1}insertNewContent(t,e){let o=new Yt(t.template,this.modules,t.dataLevel,`Child - {$${this.template.instructionType}}`);return e===null?this.content.insert(o,"TopOf",this):this.content.insert(o,"After",e),o}updateStaticBuilder(t,e){let l=new ne((y,D)=>D.template.equals(y.template)).differencesOf(t,e),m=0,g=null;for(let y=0;y<l.length;y++){let D=l[y];if(D.changeState===Dt.Remove)this.content.remove(D.item);else if(D.changeState===Dt.Insert)g=this.insertNewContent(D.item,g),m++;else{let S=e[m].dataLevel;D.item.values.updateLevelData(S),g=D.item,m++}}}};var Yt=class extends at{mInitialized;constructor(t,e,o,l){super(t,e,o,new Me(`Static - {${l}}`)),this.mInitialized=!1}onUpdate(){this.mInitialized||(this.mInitialized=!0,this.buildTemplate([this.template],this));let t=!1,e=this.content.linkedAttributeModules;for(let m=0;m<e.length;m++)t=e[m].update()||t;let o=!1,l=this.content.linkedExpressionModules;for(let m=0;m<l.length;m++){let g=l[m];if(g.update()){o=!0;let y=this.content.attributeOfLinkedExpressionModule(g);if(!y)continue;let D=this.content.getLinkedAttributeData(y),S=D.values.reduce((c,n)=>c+n.data,"");D.node.setAttribute(y.name,S)}}return t||o}buildInstructionTemplate(t,e){this.content.insert(new Ae(t,this.modules,new dt(this.values)),"BottomOf",e)}buildStaticTemplate(t,e){let o=this.createHtmlElement(t);this.content.insert(o,"BottomOf",e);for(let l of t.attributes){let m=this.modules.createAttributeModule(l,o,this.values);if(m){this.content.linkAttributeModule(m);continue}if(l.values.containsExpression){let g=new Array;for(let y of l.values.values){let D=this.createTextNode("");if(g.push(D),!(y instanceof yt)){D.data=y;continue}let S=this.modules.createExpressionModule(y,D,this.values);this.content.linkExpressionModule(S),this.content.linkAttributeExpression(S,l)}this.content.linkAttributeNodes(l,o,g);continue}o.setAttribute(l.name,l.values.toString())}this.content.insert(o,"BottomOf",e),this.buildTemplate(t.childList,o)}buildTemplate(t,e){for(let o of t)o instanceof ct?this.buildTemplate(o.body,e):o instanceof It?this.buildTextTemplate(o,e):o instanceof $t?this.buildInstructionTemplate(o,e):o instanceof St&&this.buildStaticTemplate(o,e)}buildTextTemplate(t,e){for(let o of t.values){if(typeof o=="string"){this.content.insert(this.createTextNode(o),"BottomOf",e);continue}let l=this.createTextNode("");this.content.insert(l,"BottomOf",e);let m=this.modules.createExpressionModule(o,l,this.values);this.content.linkExpressionModule(m)}}};var de=class{mHtmlElement;mShadowRoot;get htmlElement(){return this.mHtmlElement}get shadowRoot(){return this.mShadowRoot}constructor(t){this.mHtmlElement=t,this.mShadowRoot=this.mHtmlElement.attachShadow({mode:"open"})}};var U=class{mDataLevel;get data(){return this.mDataLevel}constructor(t){this.mDataLevel=t}createExpressionProcedure(t,e){return new Vt(t,this.data,e??[])}};var Ot=class extends Ht{constructor(t){super({constructor:t.constructor,parent:t.parent}),this.setProcessorInjection(U,new U(t.values))}deconstruct(){super.deconstruct(),this.call("onDeconstruct")}update(){return this.onUpdate()}};var Q=class{mValue;get value(){return this.mValue}constructor(t){this.mValue=t}};var q=class{constructor(){throw new A("Reference should not be instanced.",this)}};var mt=class{constructor(){throw new A("Reference should not be instanced.",this)}};var Ft=class f extends Ot{mLastResult;mTargetTextNode;constructor(t){super({constructor:t.constructor,parent:t.parent,values:t.values}),this.mTargetTextNode=t.targetNode,this.mLastResult=null,this.setProcessorInjection(f,this),this.setProcessorInjection(mt,t.targetTemplate.clone()),this.setProcessorInjection(q,t.targetNode),this.setProcessorInjection(Q,new Q(t.targetTemplate.value))}onUpdate(){let t=this.call("onUpdate");t===null&&(t="");let e=this.mLastResult===null||this.mLastResult!==t;if(e){let o=this.mTargetTextNode;o.data=t,this.mLastResult=t}return e}};function lr(){return(f,t)=>{O.registerInjectable(f,t.metadata,"instanced"),lt.register(Ft,f,{})}}function Si(){function f(c,n){return function(a){e(n,"addInitializer"),o(a,"An initializer"),c.push(a)}}function t(c,n,u,a,r,b,v,T,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+n:n,static:b,private:v,metadata:T},d={v:!1};s.addInitializer=f(a,d);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return c(w,s)}finally{d.v=!0}}function e(c,n){if(c.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(c,n){if(typeof c!="function")throw new TypeError(n+" must be a function")}function l(c,n){var u=typeof n;if(c===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var a;throw c===0?a="field":c===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function m(c,n,u,a,r,b,v,T,w){var p=u[0],s,d,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,C;if(typeof p=="function")h=t(p,a,s,T,r,b,v,w,i),h!==void 0&&(l(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h);else for(var P=p.length-1;P>=0;P--){var M=p[P];if(h=t(M,a,s,T,r,b,v,w,i),h!==void 0){l(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(I,E){return E};else if(typeof d!="function"){var _=d;d=function(I,E){for(var L=E,R=0;R<_.length;R++)L=_[R].call(I,L);return L}}else{var j=d;d=function(I,E){return j.call(I,E)}}c.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(c.push(function(I,E){return i.get.call(I,E)}),c.push(function(I,E){return i.set.call(I,E)})):r===2?c.push(i):c.push(function(I,E){return i.call(I,E)}):Object.defineProperty(n,a,s))}function g(c,n,u){for(var a=[],r,b,v=new Map,T=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,C;if(h?(x=c,s=s-5,b=b||[],C=b):(x=c.prototype,r=r||[],C=r),s!==0&&!i){var P=h?T:v,M=P.get(d)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!M&&s>2?P.set(d,s):P.set(d,!0)}m(a,x,p,d,s,h,i,C,u)}}return y(a,r),y(a,b),a}function y(c,n){n&&c.push(function(u){for(var a=0;a<n.length;a++)n[a].call(u);return u})}function D(c,n,u){if(n.length>0){for(var a=[],r=c,b=c.name,v=n.length-1;v>=0;v--){var T={v:!1};try{var w=n[v](r,{kind:"class",name:b,addInitializer:f(a,T),metadata:u})}finally{T.v=!0}w!==void 0&&(l(10,w),r=w)}return[S(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function S(c,n){return Object.defineProperty(c,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,a,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),T=g(n,u,v);return a.length||S(n,v),{e:T,get c(){return D(n,a,v)}}}}function yr(f,t,e,o){return(yr=Si())(f,t,e,o)}var br,gr,cr;br=lr();var vr=class{static{({c:[cr,gr]}=yr(this,[],[br]))}constructor(t=O.use(U),e=O.use(Q)){this.mProcedure=t.createExpressionProcedure(e.value)}mProcedure;onUpdate(){let t=this.mProcedure.execute();return typeof t>"u"?null:t?.toString()}static{gr()}};var rt=class{mName;mValue;get name(){return this.mName}get value(){return this.mValue}constructor(t,e){this.mName=t,this.mValue=e}};var bt=class f extends Ot{mAccessMode;get accessMode(){return this.mAccessMode}constructor(t){super({constructor:t.constructor,parent:t.parent,values:t.values}),this.mAccessMode=t.accessMode,this.setProcessorInjection(f,this),this.setProcessorInjection(mt,t.targetTemplate.clone()),this.setProcessorInjection(q,t.targetNode),this.setProcessorInjection(rt,new rt(t.targetTemplate.name,t.targetTemplate.values.toString()))}onUpdate(){return this.call("onUpdate")??!1}};var ut=class{mDataLevels;mElementList;mTemplates;get elementList(){return this.mElementList}constructor(){this.mElementList=new Array,this.mTemplates=new Set,this.mDataLevels=new Set}addElement(t,e){if(this.mTemplates.has(t)||this.mDataLevels.has(e))throw new A("Can't add same template or values for multiple Elements.",this);this.mTemplates.add(t),this.mDataLevels.add(e),this.mElementList.push({template:t,dataLevel:e})}};var _t=class f extends Ot{mLastResult;get instructionResult(){return this.mLastResult}constructor(t){super({constructor:t.constructor,parent:t.parent,values:t.values}),this.setProcessorInjection(f,this),this.setProcessorInjection(mt,t.targetTemplate.clone()),this.setProcessorInjection(Q,new Q(t.targetTemplate.instruction)),this.mLastResult=new ut}onUpdate(){let t=this.call("onUpdate");return t instanceof ut?(this.mLastResult=t,!0):!1}};var Le=class f{static mAttributeModuleCache=new k;static mExpressionModuleCache=new WeakMap;static mInstructionModuleCache=new k;mComponent;mExpressionModule;constructor(t,e){this.mExpressionModule=e??cr,this.mComponent=t}createAttributeModule(t,e,o){let l=(()=>{let m=f.mAttributeModuleCache.get(t.name);if(m||m===null)return m;for(let g of lt.get(bt))if(g.processorConfiguration.selector.test(t.name))return f.mAttributeModuleCache.set(t.name,g),g;return f.mAttributeModuleCache.set(t.name,null),null})();return l===null?null:new bt({accessMode:l.processorConfiguration.access,constructor:l.processorConstructor,parent:this.mComponent,targetNode:e,targetTemplate:t,values:o}).setup()}createExpressionModule(t,e,o){let l=(()=>{let m=f.mExpressionModuleCache.get(this.mExpressionModule);if(m)return m;let g=lt.get(Ft).find(y=>y.processorConstructor===this.mExpressionModule);if(!g)throw new A("An expression module could not be found.",this);return f.mExpressionModuleCache.set(this.mExpressionModule,g),g})();return new Ft({constructor:l.processorConstructor,parent:this.mComponent,targetNode:e,targetTemplate:t,values:o}).setup()}createInstructionModule(t,e){let o=(()=>{let l=f.mInstructionModuleCache.get(t.instructionType);if(l)return l;for(let m of lt.get(_t))if(m.processorConfiguration.instructionType===t.instructionType)return f.mInstructionModuleCache.set(t.instructionType,m),m;throw new A(`Instruction module type "${t.instructionType}" not found.`,this)})();return new _t({constructor:o.processorConstructor,parent:this.mComponent,targetTemplate:t,values:e}).setup()}};var Gt=class extends A{mColumnEnd;mColumnStart;mLineEnd;mLineStart;get columnEnd(){return this.mColumnEnd}get columnStart(){return this.mColumnStart}get lineEnd(){return this.mLineEnd}get lineStart(){return this.mLineStart}constructor(t,e,o,l,m,g,y){super(t,e,y),this.mColumnStart=o,this.mLineStart=l,this.mColumnEnd=m,this.mLineEnd=g}};var Wt=class{mDependencyFetch;mDependencyFetchResolved;mLexer;mMeta;mPattern;mPatternDependencies;mType;get dependencies(){return this.mPatternDependencies}get dependenciesResolved(){return this.mDependencyFetchResolved}get lexer(){return this.mLexer}get meta(){return this.mMeta}get pattern(){return this.mPattern}constructor(t,e){if(this.mLexer=t,this.mType=e.type,this.mMeta=e.metadata,this.mPatternDependencies=new Array,this.mDependencyFetch=e.dependencyFetch??null,this.mDependencyFetchResolved=!e.dependencyFetch,this.mType==="split"&&!this.mDependencyFetch)throw new A("Split token with a start and end token, need inner token definitions.",this);if(this.mType==="single"&&this.mDependencyFetch)throw new A("Pattern does not allow inner token pattern.",this);this.mPattern=this.convertTokenPattern(this.mType,e.pattern)}isSplit(){return this.mType==="split"}resolveDependencies(){this.mDependencyFetchResolved||(this.mDependencyFetch(this),this.mDependencyFetchResolved=!0)}useChildPattern(t){if(this.mLexer!==t.lexer)throw new A("Can only add dependencies of the same lexer.",this);this.mPatternDependencies.push(t)}convertTokenPattern(t,e){if("single"in e){if(t==="split")throw new A("Can't use split pattern type with single pattern definition.",this);return{start:{regex:e.single.regex,types:e.single.types,validator:e.single.validator??null}}}else{if(t==="single")throw new A("Can't use single pattern type with split pattern definition.",this);return{start:{regex:e.start.regex,types:e.start.types,validator:e.start.validator??null},end:{regex:e.end.regex,types:e.end.types,validator:e.end.validator??null},innerType:e.innerType??null}}}};var Zt=class{mColumnNumber;mLineNumber;mMetas;mType;mValue;get columnNumber(){return this.mColumnNumber}get lineNumber(){return this.mLineNumber}get metas(){return[...this.mMetas]}get type(){return this.mType}get value(){return this.mValue}constructor(t,e,o,l){this.mValue=e,this.mColumnNumber=o,this.mLineNumber=l,this.mType=t,this.mMetas=new Set}addMeta(...t){for(let e of t)this.mMetas.add(e)}hasMeta(t){return this.mMetas.has(t)}};var me=class{mRootPattern;mSettings;get errorType(){return this.mSettings.errorType}set errorType(t){this.mSettings.errorType=t}get trimWhitespace(){return this.mSettings.trimSpaces}set trimWhitespace(t){this.mSettings.trimSpaces=t}get validWhitespaces(){return[...this.mSettings.whiteSpaces].join("")}set validWhitespaces(t){this.mSettings.whiteSpaces=new Set(t.split(""))}constructor(){this.mSettings={errorType:null,trimSpaces:!0,whiteSpaces:new Set},this.mRootPattern=new Wt(this,{type:"single",pattern:{single:{regex:/^/,types:{},validator:null}},metadata:[],dependencyFetch:null})}createTokenPattern(t,e){let o=y=>typeof y=="string"?{token:y}:y,l=y=>{let D=new Set(y.flags.split(""));return new RegExp(`^(?<token>${y.source})`,[...D].join(""))},m=new Array;t.meta&&(typeof t.meta=="string"?m.push(t.meta):m.push(...t.meta));let g;return"regex"in t.pattern?g={single:{regex:l(t.pattern.regex),types:o(t.pattern.type),validator:t.pattern.validator??null}}:g={start:{regex:l(t.pattern.start.regex),types:o(t.pattern.start.type),validator:t.pattern.start.validator??null},end:{regex:l(t.pattern.end.regex),types:o(t.pattern.end.type),validator:t.pattern.end.validator??null},innerType:t.pattern.innerType??null},new Wt(this,{type:"regex"in t.pattern?"single":"split",pattern:g,metadata:m,dependencyFetch:e??null})}*tokenize(t,e){let o={data:t,cursor:{position:0,column:1,line:1},error:null,progressTracker:e??null};yield*this.tokenizeRecursionLayer(o,this.mRootPattern,new Array,null)}useRootTokenPattern(t){if(t.lexer!==this)throw new A("Token pattern must be created by this lexer.",this);this.mRootPattern.useChildPattern(t)}findNextStartToken(t,e,o,l){for(let m of e){let g=m.pattern.start,y=this.matchToken(m,g,t,o,l);if(y!==null)return{pattern:m,token:y}}return null}findTokenTypeOfMatch(t,e,o){for(let g in t.groups){let y=t.groups[g],D=e[g];if(!(!y||!D)){if(y.length!==t[0].length)throw new A("A group of a token pattern must match the whole token.",this);return D}}let l=new Array;for(let g in t.groups)t.groups[g]&&l.push(g);let m=new Array;for(let g in e)m.push(g);throw new A(`No token type found for any defined pattern regex group. Full: "${t[0]}", Matches: "${l.join(", ")}", Available: "${m.join(", ")}", Regex: "${o.source}"`,this)}*generateErrorToken(t,e){if(!t.error||!this.mSettings.errorType)return;let o=new Zt(this.mSettings.errorType,t.error.data,t.error.startColumn,t.error.startLine);o.addMeta(...e),t.error=null,yield o}generateToken(t,e,o,l,m,g){let y=o[0],D=this.findTokenTypeOfMatch(o,l,g),S=new Zt(m??D,y,t.cursor.column,t.cursor.line);return S.addMeta(...e),S}matchToken(t,e,o,l,m){let g=e.regex;g.lastIndex=0;let y=g.exec(o.data);if(!y||y.index!==0)return null;let D=this.generateToken(o,[...l,...t.meta],y,e.types,m,g);if(e.validator){let S=o.data.substring(D.value.length);if(!e.validator(D,S,o.cursor.position))return null}return this.moveCursor(o,D.value),D}moveCursor(t,e){let o=e.split(`
`);o.length>1&&(t.cursor.column=1),t.cursor.line+=o.length-1,t.cursor.column+=o.at(-1).length,t.cursor.position+=e.length,t.data=t.data.substring(e.length),this.trackProgress(t)}pushNextCharToErrorState(t){if(!this.mSettings.errorType)throw new Gt(`Unable to parse next token. No valid pattern found for "${t.data.substring(0,20)}".`,this,t.cursor.column,t.cursor.line,t.cursor.column,t.cursor.line);t.error||(t.error={data:"",startColumn:t.cursor.column,startLine:t.cursor.line});let e=t.data.charAt(0);t.error.data+=e,this.moveCursor(t,e)}skipNextWhitespace(t){let e=t.data.charAt(0);return!this.mSettings.trimSpaces||!this.mSettings.whiteSpaces.has(e)?!1:(this.moveCursor(t,e),!0)}*tokenizeRecursionLayer(t,e,o,l){let m=e.dependencies;for(;t.data.length>0;){if(!t.error&&this.skipNextWhitespace(t))continue;if(e.isSplit()){let D=this.matchToken(e,e.pattern.end,t,o,l);if(D!==null){yield*this.generateErrorToken(t,o),yield D;return}}let g=this.findNextStartToken(t,m,o,l);if(!g){this.pushNextCharToErrorState(t);continue}yield*this.generateErrorToken(t,o),yield g.token;let y=g.pattern;y.isSplit()&&(y.resolveDependencies(),yield*this.tokenizeRecursionLayer(t,y,[...o,...y.meta],l??y.pattern.innerType))}yield*this.generateErrorToken(t,o)}trackProgress(t){t.progressTracker!==null&&t.progressTracker(t.cursor.position,t.cursor.line,t.cursor.column)}};var Y=class extends Error{static PARSER_ERROR=Symbol("PARSER_ERROR");mTrace;get columnEnd(){return this.mTrace.top.range.columnEnd}get columnStart(){return this.mTrace.top.range.columnStart}get graph(){return this.mTrace.top.graph}get incidents(){return this.mTrace.incidents}get lineEnd(){return this.mTrace.top.range.lineEnd}get lineStart(){return this.mTrace.top.range.lineStart}constructor(t){super(t.top.message,{cause:t.top.cause}),this.mTrace=t}};var Re=class{mIncidents;mTop;get incidents(){if(this.mIncidents===null)throw new A("A complete incident list is only available on debug mode.",this);return this.mIncidents}get top(){return this.mTop}constructor(t){this.mTop={message:"Unknown parser error",priority:0,graph:null,range:{lineStart:1,columnStart:1,lineEnd:1,columnEnd:1},cause:null},t?this.mIncidents=new Array:this.mIncidents=null}push(t,e,o,l,m,g,y=!1,D=null){let S;if(y?S=this.mTop.priority+1:S=m*1e4+g,this.mIncidents!==null){let c={message:t,priority:S,graph:e,range:{lineStart:o,columnStart:l,lineEnd:m,columnEnd:g},cause:D};this.mIncidents.push(c)}this.mTop&&S<this.mTop.priority||this.setTop({message:t,priority:S,graph:e,range:{lineStart:o,columnStart:l,lineEnd:m,columnEnd:g},cause:D})}setTop(t){this.mTop=t}};var Oe=class f{static MAX_JUNCTION_CIRCULAR_REFERENCES=1e3;mGraphStack;mIncidentTrace;mLastTokenPosition;mProcessStack;mTokenCache;mTokenGenerator;mTrimTokenCache;get currentGraph(){return this.mGraphStack.top.graph}get currentToken(){let t=this.mGraphStack.top;return this.mTokenCache[t.token.cursor]}get incidentTrace(){return this.mIncidentTrace}get processStack(){return this.mProcessStack}constructor(t,e,o){this.mTokenGenerator=t,this.mGraphStack=new Pt,this.mLastTokenPosition={column:1,line:1},this.mTokenCache=new Array,this.mProcessStack=new Pt,this.mTrimTokenCache=o,this.mIncidentTrace=new Re(e),this.mGraphStack.push({graph:null,linear:!0,circularGraphs:new k,token:{start:0,cursor:-1}})}collapse(){let t=this.mGraphStack.top,e=this.mTokenCache.slice(t.token.cursor);e.length!==0&&e.at(-1)===null&&e.pop();for(let o of this.mTokenGenerator)e.push(o);return e}getGraphBoundingToken(){let t=this.mGraphStack.top,e=this.mTokenCache[t.token.start],o=this.mTokenCache[t.token.cursor-1];return e??=o,o??=e,[e??null,o??null]}getGraphPosition(){let t=this.mGraphStack.top,e,o;if(e=this.mTokenCache[t.token.start],o=this.mTokenCache[t.token.cursor-1],e??=o,o??=e,!e||!o)return{graph:t.graph,columnEnd:this.mLastTokenPosition.column,columnStart:this.mLastTokenPosition.column,lineEnd:this.mLastTokenPosition.line,lineStart:this.mLastTokenPosition.line};let l,m;if(o.value.includes(`
`)){let g=o.value.split(`
`);m=o.lineNumber+g.length-1,l=1+g[g.length-1].length}else l=o.columnNumber+o.value.length,m=o.lineNumber;return{graph:t.graph,lineStart:e.lineNumber,columnStart:e.columnNumber,lineEnd:m,columnEnd:l}}getTokenPosition(){let t=this.mGraphStack.top,e=this.currentToken;if(!e)return{graph:t.graph,columnEnd:this.mLastTokenPosition.column,columnStart:this.mLastTokenPosition.column,lineEnd:this.mLastTokenPosition.line,lineStart:this.mLastTokenPosition.line};let o,l;if(e.value.includes(`
`)){let m=e.value.split(`
`);l=e.lineNumber+m.length-1,o=1+m[m.length-1].length}else o=e.columnNumber+e.value.length,l=e.lineNumber;return{graph:t.graph,lineStart:e.lineNumber,columnStart:e.columnNumber,lineEnd:l,columnEnd:o}}graphIsCircular(t){let e=this.mGraphStack.top;if(!e.circularGraphs.has(t))return!1;if(t.isJunction){if(e.circularGraphs.get(t)>f.MAX_JUNCTION_CIRCULAR_REFERENCES)throw new A("Junction graph called circular too often.",this);return!1}return!0}moveNextToken(){let t=this.mGraphStack.top;if(t.circularGraphs.size>0&&(t.circularGraphs=new k),t.graph&&t.graph.isJunction)throw new A("Junction graph must not have own nodes.",this);if(t.token.cursor++,t.token.cursor<this.mTokenCache.length)return;let e=this.mTokenGenerator.next();if(e.done){this.mTokenCache.push(null);return}this.mLastTokenPosition.column=e.value.columnNumber,this.mLastTokenPosition.line=e.value.lineNumber,this.mTokenCache.push(e.value)}popGraphStack(t){let e=this.mGraphStack.pop(),o=this.mGraphStack.top;if(t&&(e.token.cursor=e.token.start),e.token.cursor!==e.token.start&&o.circularGraphs.size>0&&(o.circularGraphs=new k),!this.mTrimTokenCache){o.token.cursor=e.token.cursor;return}e.linear?(this.mTokenCache.splice(0,e.token.cursor),o.token.start=0,o.token.cursor=0):o.token.cursor=e.token.cursor}pushGraphStack(t,e){let o=this.mGraphStack.top,l={graph:t,linear:e&&o.linear,circularGraphs:new k(o.circularGraphs),token:{start:o.token.cursor,cursor:o.token.cursor}},m=l.circularGraphs.get(t)??0;l.circularGraphs.set(t,m+1),this.mGraphStack.push(l)}};var fe=class f{static NODE_NULL_RESULT=Symbol("FAILED_NODE_VALUE_PARSE");static NODE_VALUE_LIST_END_MEET=Symbol("FAILED_NODE_VALUE_PARSE");mConfiguration;mLexer;mRootPart;get lexer(){return this.mLexer}constructor(t,e){this.mLexer=t,this.mRootPart=null,this.mConfiguration={keepTraceIncidents:!1,trimTokenCache:!1,...e}}parse(t,e){if(this.mRootPart===null)throw new A("Parser has not root part set.",this);let o=new Oe(this.mLexer.tokenize(t,e),this.mConfiguration.keepTraceIncidents,this.mConfiguration.trimTokenCache),l=(()=>{try{return this.beginParseProcess(o,this.mRootPart)}catch(g){if(g instanceof Gt)return o.incidentTrace.push(g.message,o.currentGraph,g.lineStart,g.columnStart,g.lineEnd,g.columnEnd,!0,g),Y.PARSER_ERROR;let y=g instanceof Error?g.message:g.toString(),D=o.getGraphPosition();return o.incidentTrace.push(y,o.currentGraph,D.lineStart,D.columnStart,D.lineEnd,D.columnEnd,!0,g),Y.PARSER_ERROR}})();if(l===Y.PARSER_ERROR)throw new Y(o.incidentTrace);let m=o.collapse();if(m.length!==0){let g=m[0];if(o.incidentTrace.top.range.lineEnd===1&&o.incidentTrace.top.range.columnEnd===1){let y=`Tokens could not be parsed. Graph end meet without reaching last token. Current: "${g.value}" (${g.type})`;o.incidentTrace.push(y,this.mRootPart,g.lineNumber,g.columnNumber,g.lineNumber,g.columnNumber)}throw new Y(o.incidentTrace)}return l}setRootGraph(t){this.mRootPart=t}beginParseProcess(t,e){t.moveNextToken(),t.processStack.push({type:"graph-parse",parameter:{graph:e,linear:!0},state:0});let o=f.NODE_NULL_RESULT;for(;t.processStack.top;)o=this.processStack(t,t.processStack.top,o);return o}processChainedNodeParseProcess(t,e,o){switch(e.state){case 0:{let g=e.parameter.node.connections.next;return g===null?(t.processStack.pop(),{}):(e.state++,t.processStack.push({type:"node-parse",parameter:{node:g},state:0,values:{}}),f.NODE_NULL_RESULT)}case 1:{let l=o;return l===Y.PARSER_ERROR?(t.processStack.pop(),Y.PARSER_ERROR):(t.processStack.pop(),l)}}throw new A(`Invalid node next parse state "${e.state}".`,this)}processGraphParseProcess(t,e,o){let l=e.parameter.graph;switch(e.state){case 0:{if(t.graphIsCircular(l)){let g=t.getGraphPosition();return t.incidentTrace.push("Circular graph detected.",l,g.lineStart,g.columnStart,g.lineEnd,g.columnEnd),t.processStack.pop(),Y.PARSER_ERROR}let m=e.parameter.linear;return t.pushGraphStack(l,m),e.state++,t.processStack.push({type:"node-parse",parameter:{node:l.node},state:0,values:{}}),f.NODE_NULL_RESULT}case 1:{let m=o;if(m===Y.PARSER_ERROR)return t.popGraphStack(!0),t.processStack.pop(),Y.PARSER_ERROR;let g=l.convert(m,t);if(typeof g=="symbol"){let y=t.getGraphPosition();return t.incidentTrace.push(g.description??"Unknown data convert error",y.graph,y.lineStart,y.columnStart,y.lineEnd,y.columnEnd),t.popGraphStack(!0),t.processStack.pop(),Y.PARSER_ERROR}return t.popGraphStack(!1),t.processStack.pop(),g}}throw new A(`Invalid graph parse state "${e.state}".`,this)}processNodeParseProcess(t,e,o){let l=e.parameter.node;switch(e.state){case 0:return t.processStack.push({type:"node-value-parse",parameter:{node:l,valueIndex:0},state:0,values:{}}),e.state++,f.NODE_NULL_RESULT;case 1:{let m=o;return m===Y.PARSER_ERROR?(t.processStack.pop(),Y.PARSER_ERROR):(e.values.nodeValueResult=m,t.processStack.push({type:"node-next-parse",parameter:{node:l},state:0}),e.state++,f.NODE_NULL_RESULT)}case 2:{let m=o;if(m===Y.PARSER_ERROR)return t.processStack.pop(),Y.PARSER_ERROR;let g=l.mergeData(e.values.nodeValueResult,m);return t.processStack.pop(),g}}throw new A(`Invalid node parse state "${e.state}".`,this)}processNodeValueParseProcess(t,e,o){let l=e.parameter.node;switch(e.state){case 0:{if(o!==f.NODE_NULL_RESULT&&o!==Y.PARSER_ERROR)return e.values.parseResult=o,e.state++,f.NODE_NULL_RESULT;let m=e.parameter.valueIndex,g=l.connections;if(m>=g.values.length)return e.values.parseResult=f.NODE_VALUE_LIST_END_MEET,e.state++,f.NODE_NULL_RESULT;e.parameter.valueIndex++;let y=t.currentToken,D=g.values[m];if(typeof D=="string"){if(!y){if(g.required){let S=t.getTokenPosition();t.incidentTrace.push(`Unexpected end of statement. Token "${D}" expected.`,t.currentGraph,S.lineStart,S.columnStart,S.lineEnd,S.columnEnd)}return f.NODE_NULL_RESULT}if(D!==y.type){if(g.required){let S=t.getTokenPosition();t.incidentTrace.push(`Unexpected token "${y.value}". "${D}" expected`,t.currentGraph,S.lineStart,S.columnStart,S.lineEnd,S.columnEnd)}return f.NODE_NULL_RESULT}return t.moveNextToken(),y.value}else{let S=g.values.length===1||g.values.length===m+1;return t.processStack.push({type:"graph-parse",parameter:{graph:D,linear:S},state:0}),f.NODE_NULL_RESULT}}case 1:{let m=e.values.parseResult,g=l.connections;if(m===f.NODE_VALUE_LIST_END_MEET&&!g.required){t.processStack.pop();return}return m===f.NODE_VALUE_LIST_END_MEET?(t.processStack.pop(),Y.PARSER_ERROR):(t.processStack.pop(),m)}}throw new A(`Invalid node value parse state "${e.state}".`,this)}processStack(t,e,o){switch(e.type){case"graph-parse":return this.processGraphParseProcess(t,e,o);case"node-parse":return this.processNodeParseProcess(t,e,o);case"node-value-parse":return this.processNodeValueParseProcess(t,e,o);case"node-next-parse":return this.processChainedNodeParseProcess(t,e,o)}}};var J=class f{static define(t,e=!1){return new f(t,e)}mDataConverterList;mGraphCollector;mIsJunction;mResolvedGraphNode;get isJunction(){return this.mIsJunction}get node(){return this.mResolvedGraphNode||(this.mResolvedGraphNode=this.mGraphCollector().root),this.mResolvedGraphNode}constructor(t,e){this.mGraphCollector=t,this.mDataConverterList=new Array,this.mResolvedGraphNode=null,this.mIsJunction=e}convert(t,e){if(this.mDataConverterList.length===0)return t;let o=e.getGraphBoundingToken(),l=o[0]??void 0,m=o[1]??void 0;if(this.mDataConverterList.length===1)return this.mDataConverterList[0](t,l,m);let g=t;for(let y of this.mDataConverterList)if(g=y(g,l,m),typeof g=="symbol")return g;return g}converter(t){let e=new f(this.mGraphCollector,this.isJunction);return e.mDataConverterList.push(...this.mDataConverterList,t),e}};var B=class f{static new(){let t=new f("",!1,[]);return t.mRootNode=null,t}mConnections;mIdentifier;mRootNode;get configuration(){return{dataKey:this.mIdentifier.dataKey,isList:this.mIdentifier.type==="list",isRequired:this.mConnections.required,isBranch:this.mConnections.values.length>1}}get connections(){return this.mConnections}get root(){if(!this.mRootNode)throw new A("Staring nodes must be chained with another node to be used.",this);return this.mRootNode}constructor(t,e,o,l){if(t==="")this.mIdentifier={type:"empty",dataKey:"",mergeKey:""};else if(t.endsWith("[]"))this.mIdentifier={type:"list",mergeKey:"",dataKey:t.substring(0,t.length-2)};else if(t.includes("<-")){let g=t.split("<-");this.mIdentifier={type:"merge",dataKey:g[0],mergeKey:g[1]}}else this.mIdentifier={type:"single",mergeKey:"",dataKey:t};let m=o.map(g=>g instanceof f?J.define(()=>g):g);this.mConnections={required:e,values:m,next:null},l?this.mRootNode=l:this.mRootNode=this}mergeData(t,e){if(this.mIdentifier.type==="empty")return e;let o=e,l=typeof t>"u";if(this.mIdentifier.type==="single"){if(this.mIdentifier.dataKey in e)throw new A(`Graph path has a duplicate value identifier "${this.mIdentifier.dataKey}"`,this);return l||(o[this.mIdentifier.dataKey]=t),e}if(this.mIdentifier.type==="list"){let y;l?y=new Array:Array.isArray(t)?y=t:y=[t];let D=(()=>{if(this.mIdentifier.dataKey in e){let S=o[this.mIdentifier.dataKey];return Array.isArray(S)?(S.unshift(...y),S):(y.push(S),y)}return y})();return o[this.mIdentifier.dataKey]=D,e}if(l)return e;let m=(()=>{if(!this.mIdentifier.mergeKey)throw new A("Cant merge data without a merge key.",this);if(typeof t!="object"||t===null)throw new A("Node data must be an object when merge key is set.",this);if(!(this.mIdentifier.mergeKey in t))throw new A(`Node data does not contain merge key "${this.mIdentifier.mergeKey}"`,this);return t[this.mIdentifier.mergeKey]})();if(typeof m>"u")return e;let g=o[this.mIdentifier.dataKey];if(typeof g>"u")return o[this.mIdentifier.dataKey]=m,o;if(!Array.isArray(g))throw new A("Chain data merge value is not an array but should be.",this);return Array.isArray(m)?g.unshift(...m):g.unshift(m),e}optional(t,e){let o=typeof e>"u"?"":t,l=typeof e>"u"?t:e,m=new Array;Array.isArray(l)?m.push(...l):m.push(l);let g=new f(o,!1,m,this.mRootNode);return this.setChainedNode(g),g}required(t,e){let o=typeof e>"u"?"":t,l=typeof e>"u"?t:e,m=new Array;Array.isArray(l)?m.push(...l):m.push(l);let g=new f(o,!0,m,this.mRootNode);return this.setChainedNode(g),g}setChainedNode(t){if(this.mConnections.next!==null)throw new A("Node can only be chained to a single node.",this);this.mConnections.next=t}};var z={XmlIdentifier:"Identifier",XmlAssignment:"XmlAssignment",XmlValue:"XmlValue",XmlComment:"XmlComment",XmlOpenClosingBracket:"XmlOpenClosingBracket",XmlCloseBracket:"XmlCloseBracket",XmlOpenBracket:"XmlOpenBracket",XmlCloseClosingBracket:"XmlCloseClosingBracket",XmlExplicitValueIdentifier:"XmlExplicitValueIdentifier",ExpressionStart:"ExpressionStart",ExpressionEnd:"ExpressionEnd",ExpressionValue:"ExpressionValue",InstructionStart:"InstructionStart",InstructionInstructionValue:"InstructionInstructionValue",InstructionBodyStartBraket:"InstructionBodyStartBraket",InstructionBodyCloseBraket:"InstructionBodyCloseBraket",InstructionInstructionClosingBracket:"InstructionInstructionClosingBracket",InstructionInstructionOpeningBracket:"InstructionInstructionOpeningBracket"};var Fe=class extends me{constructor(){super(),this.validWhitespaces=` 
\r`,this.trimWhitespace=!0;let t=this.createTokenPattern({pattern:{regex:/(?:(?!}}).)*/,type:z.ExpressionValue}}),e=this.createTokenPattern({pattern:{start:{regex:/{{/,type:z.ExpressionStart},end:{regex:/}}/,type:z.ExpressionEnd}}},s=>{s.useChildPattern(t)}),o=this.createTokenPattern({pattern:{regex:/[^>\s\n="/]+/,type:z.XmlIdentifier}}),l=this.createTokenPattern({pattern:{regex:/(?:(?!{{|"|<).)+/,type:z.XmlValue}}),m=this.createTokenPattern({pattern:{regex:/<!--.*?-->/,type:z.XmlComment}}),g=this.createTokenPattern({pattern:{regex:/=/,type:z.XmlAssignment}}),y=this.createTokenPattern({pattern:{start:{regex:/"/,type:z.XmlExplicitValueIdentifier},end:{regex:/"/,type:z.XmlExplicitValueIdentifier}}},s=>{s.useChildPattern(e),s.useChildPattern(l)}),D=this.createTokenPattern({pattern:{start:{regex:/<\//,type:z.XmlOpenClosingBracket},end:{regex:/>/,type:z.XmlCloseBracket}}},s=>{s.useChildPattern(o)}),S=this.createTokenPattern({pattern:{start:{regex:/</,type:z.XmlOpenBracket},end:{regex:/(?<closeClosingBracket>\/>)|(?<closeBracket>>)/,type:{closeClosingBracket:z.XmlCloseClosingBracket,closeBracket:z.XmlCloseBracket}}}},s=>{s.useChildPattern(g),s.useChildPattern(o),s.useChildPattern(y)}),c=this.createTokenPattern({pattern:{regex:/[^()"'`/)]+/,type:z.InstructionInstructionValue}}),n=this.createTokenPattern({pattern:{innerType:z.InstructionInstructionValue,start:{regex:/\//,type:z.InstructionInstructionValue},end:{regex:/\//,type:z.InstructionInstructionValue}}},s=>{s.useChildPattern(a),s.useChildPattern(r),s.useChildPattern(b),s.useChildPattern(u),s.useChildPattern(c)}),u=this.createTokenPattern({pattern:{innerType:z.InstructionInstructionValue,start:{regex:/\(/,type:z.InstructionInstructionValue},end:{regex:/\)/,type:z.InstructionInstructionValue}}},s=>{s.useChildPattern(n),s.useChildPattern(a),s.useChildPattern(r),s.useChildPattern(b),s.useChildPattern(c)}),a=this.createTokenPattern({pattern:{innerType:z.InstructionInstructionValue,start:{regex:/"/,type:z.InstructionInstructionValue},end:{regex:/"/,type:z.InstructionInstructionValue}}},s=>{s.useChildPattern(n),s.useChildPattern(r),s.useChildPattern(b),s.useChildPattern(u),s.useChildPattern(c)}),r=this.createTokenPattern({pattern:{innerType:z.InstructionInstructionValue,start:{regex:/'/,type:z.InstructionInstructionValue},end:{regex:/'/,type:z.InstructionInstructionValue}}},s=>{s.useChildPattern(n),s.useChildPattern(a),s.useChildPattern(b),s.useChildPattern(u),s.useChildPattern(c)}),b=this.createTokenPattern({pattern:{innerType:z.InstructionInstructionValue,start:{regex:/`/,type:z.InstructionInstructionValue},end:{regex:/`/,type:z.InstructionInstructionValue}}},s=>{s.useChildPattern(n),s.useChildPattern(a),s.useChildPattern(r),s.useChildPattern(u),s.useChildPattern(c)}),v=this.createTokenPattern({pattern:{regex:/\$[^(\s\n/{]+/,type:z.InstructionStart}}),T=this.createTokenPattern({pattern:{start:{regex:/\(/,type:z.InstructionInstructionOpeningBracket},end:{regex:/\)/,type:z.InstructionInstructionClosingBracket}}},s=>{s.useChildPattern(n),s.useChildPattern(a),s.useChildPattern(r),s.useChildPattern(b),s.useChildPattern(u),s.useChildPattern(c)}),w=this.createTokenPattern({pattern:{start:{regex:/{/,type:z.InstructionBodyStartBraket},end:{regex:/}/,type:z.InstructionBodyCloseBraket}}},s=>{for(let d of p)s.useChildPattern(d)}),p=[m,D,S,y,e,v,T,w,l];for(let s of p)this.useRootTokenPattern(s)}};var pe=class extends fe{constructor(){super(new Fe),this.initGraph()}initGraph(){let t=J.define(()=>B.new().required(z.ExpressionStart).optional("value",z.ExpressionValue).required(z.ExpressionEnd)).converter(r=>new yt(r.value??"")),e=J.define(()=>{let r=e;return B.new().required("data[]",B.new().required("value",[t,B.new().required("text",z.XmlValue)])).optional("data<-data",r)}),o=J.define(()=>B.new().required("name",z.XmlIdentifier).optional("attributeValue",B.new().required(z.XmlAssignment).required(z.XmlExplicitValueIdentifier).optional("list<-data",e).required(z.XmlExplicitValueIdentifier))).converter(r=>{let b=new Array;if(r.attributeValue?.list)for(let v of r.attributeValue.list)v.value instanceof yt?b.push(v.value):b.push(v.value.text);return{name:r.name,values:b}}),l=J.define(()=>{let r=l;return B.new().required("data[]",o).optional("data<-data",r)}),m=J.define(()=>{let r=m;return B.new().required("data[]",B.new().required("value",[t,B.new().required("text",z.XmlValue),B.new().required(z.XmlExplicitValueIdentifier).required("text",z.XmlValue).required(z.XmlExplicitValueIdentifier)])).optional("data<-data",r)}),g=J.define(()=>B.new().required("list<-data",m)).converter(r=>{let b=new It;for(let v of r.list)v.value instanceof yt?b.addValue(v.value):b.addValue(v.value.text);return b}),y=J.define(()=>B.new().required(z.XmlComment)).converter(()=>null),D=J.define(()=>B.new().required(z.XmlOpenBracket).required("openingTagName",z.XmlIdentifier).optional("attributes<-data",l).required("closing",[B.new().required(z.XmlCloseClosingBracket),B.new().required(z.XmlCloseBracket).required("values",u).required(z.XmlOpenClosingBracket).required("closingTageName",z.XmlIdentifier).required(z.XmlCloseBracket)])).converter(r=>{if("closingTageName"in r.closing&&r.openingTagName!==r.closing.closingTageName)throw new A(`Opening (${r.openingTagName}) and closing tagname (${r.closing.closingTageName}) does not match`,this);let b=new St(r.openingTagName);if(r.attributes)for(let v of r.attributes)b.setAttribute(v.name).addValue(...v.values);return"values"in r.closing&&b.appendChild(...r.closing.values),b}),S=J.define(()=>{let r=S;return B.new().required("list[]",z.InstructionInstructionValue).optional("list<-list",r)}),c=J.define(()=>B.new().required("instructionName",z.InstructionStart).optional("instruction",B.new().required(z.InstructionInstructionOpeningBracket).required("value<-list",S).required(z.InstructionInstructionClosingBracket)).optional("body",B.new().required(z.InstructionBodyStartBraket).required("value",u).required(z.InstructionBodyCloseBraket))).converter(r=>{let b=r.instructionName.substring(1),v=r.instruction?.value.join("")??"",T=new $t(b,v);return r.body&&T.appendChild(...r.body.value),T}),n=J.define(()=>{let r=n;return B.new().required("list[]",[y,D,c,g]).optional("list<-list",r)}),u=J.define(()=>{let r=n;return B.new().optional("list<-list",r)}).converter(r=>{let b=new Array;if(r.list)for(let v of r.list)v!==null&&b.push(v);return b}),a=J.define(()=>B.new().required("content",u)).converter(r=>{let b=new ct;return b.appendChild(...r.content),b});this.setRootGraph(a)}};var $=class f extends Pe{static mTemplateCache=new k;static mXmlParser=new pe;mComponentElement;mRootBuilder;get element(){return this.mComponentElement.htmlElement}constructor(t){super({constructor:t.processorConstructor,parent:null}),tt.registerComponent(this,t.htmlElement),this.setProcessorInjection(f,this),this.addConstructionHook(o=>{tt.registerComponent(this,this.mComponentElement.htmlElement,o)}),f.mTemplateCache.has(t.processorConstructor)||f.mTemplateCache.set(t.processorConstructor,f.mXmlParser.parse(t.templateString??""));let e=f.mTemplateCache.get(t.processorConstructor).clone();this.mComponentElement=new de(t.htmlElement),this.mRootBuilder=new Yt(e,new Le(this,t.expressionModule),new dt(this),"ROOT"),this.mComponentElement.shadowRoot.appendChild(this.mRootBuilder.anchor),this.setProcessorInjection(xt,new xt(this.mRootBuilder.values))}addStyle(t){let e=document.createElement("style");e.innerHTML=t,this.mComponentElement.shadowRoot.prepend(e)}attributeChanged(t,e,o){this.call("onAttributeChange",t,e,o)}connected(){this.call("onConnect")}deconstruct(){this.call("onDeconstruct"),this.mRootBuilder.deconstruct(),super.deconstruct()}disconnected(){this.call("onDisconnect")}onUpdate(){return this.mRootBuilder.update()?(this.call("onUpdate"),!0):!1}};function W(f){return(t,e)=>{O.registerInjectable(t,e.metadata,"instanced"),tt.registerConstructor(t,f.selector);let o=class extends HTMLElement{mComponent;constructor(){super(),this.mComponent=new $({processorConstructor:t,templateString:f.template??null,expressionModule:f.expressionmodule,htmlElement:this}).setup(),f.style&&this.mComponent.addStyle(f.style),this.mComponent.updater.update()}connectedCallback(){this.mComponent.connected()}disconnectedCallback(){this.mComponent.disconnected()}};globalThis.customElements.define(f.selector,o)}}function Bt(f){return(t,e)=>{O.registerInjectable(t,e.metadata,"instanced"),lt.register(Nt,t,{access:f.access,targetRestrictions:f.targetRestrictions})}}function wt(f){return(t,e)=>{O.registerInjectable(t,e.metadata,"instanced"),lt.register(bt,t,{access:f.access,selector:f.selector})}}function Ct(f){return(t,e)=>{O.registerInjectable(t,e.metadata,"instanced"),lt.register(_t,t,{instructionType:f.instructionType})}}function Ci(){function f(c,n){return function(a){e(n,"addInitializer"),o(a,"An initializer"),c.push(a)}}function t(c,n,u,a,r,b,v,T,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+n:n,static:b,private:v,metadata:T},d={v:!1};s.addInitializer=f(a,d);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return c(w,s)}finally{d.v=!0}}function e(c,n){if(c.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(c,n){if(typeof c!="function")throw new TypeError(n+" must be a function")}function l(c,n){var u=typeof n;if(c===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var a;throw c===0?a="field":c===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function m(c,n,u,a,r,b,v,T,w){var p=u[0],s,d,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,C;if(typeof p=="function")h=t(p,a,s,T,r,b,v,w,i),h!==void 0&&(l(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h);else for(var P=p.length-1;P>=0;P--){var M=p[P];if(h=t(M,a,s,T,r,b,v,w,i),h!==void 0){l(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(I,E){return E};else if(typeof d!="function"){var _=d;d=function(I,E){for(var L=E,R=0;R<_.length;R++)L=_[R].call(I,L);return L}}else{var j=d;d=function(I,E){return j.call(I,E)}}c.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(c.push(function(I,E){return i.get.call(I,E)}),c.push(function(I,E){return i.set.call(I,E)})):r===2?c.push(i):c.push(function(I,E){return i.call(I,E)}):Object.defineProperty(n,a,s))}function g(c,n,u){for(var a=[],r,b,v=new Map,T=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,C;if(h?(x=c,s=s-5,b=b||[],C=b):(x=c.prototype,r=r||[],C=r),s!==0&&!i){var P=h?T:v,M=P.get(d)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!M&&s>2?P.set(d,s):P.set(d,!0)}m(a,x,p,d,s,h,i,C,u)}}return y(a,r),y(a,b),a}function y(c,n){n&&c.push(function(u){for(var a=0;a<n.length;a++)n[a].call(u);return u})}function D(c,n,u){if(n.length>0){for(var a=[],r=c,b=c.name,v=n.length-1;v>=0;v--){var T={v:!1};try{var w=n[v](r,{kind:"class",name:b,addInitializer:f(a,T),metadata:u})}finally{T.v=!0}w!==void 0&&(l(10,w),r=w)}return[S(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function S(c,n){return Object.defineProperty(c,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,a,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),T=g(n,u,v);return a.length||S(n,v),{e:T,get c(){return D(n,a,v)}}}}function xr(f,t,e,o){return(xr=Ci())(f,t,e,o)}function Pi(f){return f}var Tr,wr,ge;Tr=Bt({access:X.Read,targetRestrictions:[$]});new class extends Pi{constructor(){super(ge),wr()}static{class f{static{({c:[ge,wr]}=xr(this,[],[Tr]))}static METADATA_USER_EVENT_LISTENER_PROPERIES="pwb:user_event_listener_properties";mEventListenerList;mTargetElement;constructor(e=O.use($)){let o=new Array,l=e.processorConstructor;do{let m=st.get(l).getMetadata(f.METADATA_USER_EVENT_LISTENER_PROPERIES);if(m)for(let g of m)o.push(g)}while(l=Object.getPrototypeOf(l));this.mEventListenerList=new Array,this.mTargetElement=e.element;for(let m of o){let[g,y]=m,D=Reflect.get(e.processor,g);D=D.bind(e.processor),this.mEventListenerList.push([y,D]),this.mTargetElement.addEventListener(y,D)}}onDeconstruct(){for(let e of this.mEventListenerList){let[o,l]=e;this.mTargetElement.removeEventListener(o,l)}}}}};var ve=class extends window.Event{mValue;get value(){return this.mValue}constructor(t,e){super(t),this.mValue=e}};var ye=class{mElement;mEventName;constructor(t,e){this.mEventName=t,this.mElement=e}dispatchEvent(t){let e=new ve(this.mEventName,t);this.mElement.dispatchEvent(e)}};function qt(f){return(t,e)=>{if(e.static)throw new A("Event target is not for a static property.",qt);let o=new WeakMap;return{get(){if(!o.has(this)){let l=(()=>{try{return tt.ofProcessor(this).component}catch{throw new A("PwbComponentEvent target class is not a component.",this)}})();o.set(this,new ye(f,l.element))}return o.get(this)}}}}function Mi(){function f(c,n){return function(a){e(n,"addInitializer"),o(a,"An initializer"),c.push(a)}}function t(c,n,u,a,r,b,v,T,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+n:n,static:b,private:v,metadata:T},d={v:!1};s.addInitializer=f(a,d);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return c(w,s)}finally{d.v=!0}}function e(c,n){if(c.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(c,n){if(typeof c!="function")throw new TypeError(n+" must be a function")}function l(c,n){var u=typeof n;if(c===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var a;throw c===0?a="field":c===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function m(c,n,u,a,r,b,v,T,w){var p=u[0],s,d,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,C;if(typeof p=="function")h=t(p,a,s,T,r,b,v,w,i),h!==void 0&&(l(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h);else for(var P=p.length-1;P>=0;P--){var M=p[P];if(h=t(M,a,s,T,r,b,v,w,i),h!==void 0){l(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(I,E){return E};else if(typeof d!="function"){var _=d;d=function(I,E){for(var L=E,R=0;R<_.length;R++)L=_[R].call(I,L);return L}}else{var j=d;d=function(I,E){return j.call(I,E)}}c.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(c.push(function(I,E){return i.get.call(I,E)}),c.push(function(I,E){return i.set.call(I,E)})):r===2?c.push(i):c.push(function(I,E){return i.call(I,E)}):Object.defineProperty(n,a,s))}function g(c,n,u){for(var a=[],r,b,v=new Map,T=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,C;if(h?(x=c,s=s-5,b=b||[],C=b):(x=c.prototype,r=r||[],C=r),s!==0&&!i){var P=h?T:v,M=P.get(d)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!M&&s>2?P.set(d,s):P.set(d,!0)}m(a,x,p,d,s,h,i,C,u)}}return y(a,r),y(a,b),a}function y(c,n){n&&c.push(function(u){for(var a=0;a<n.length;a++)n[a].call(u);return u})}function D(c,n,u){if(n.length>0){for(var a=[],r=c,b=c.name,v=n.length-1;v>=0;v--){var T={v:!1};try{var w=n[v](r,{kind:"class",name:b,addInitializer:f(a,T),metadata:u})}finally{T.v=!0}w!==void 0&&(l(10,w),r=w)}return[S(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function S(c,n){return Object.defineProperty(c,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,a,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),T=g(n,u,v);return a.length||S(n,v),{e:T,get c(){return D(n,a,v)}}}}function Er(f,t,e,o){return(Er=Mi())(f,t,e,o)}function Ni(f){return f}var Ir,Dr,be;Ir=Bt({access:X.ReadWrite,targetRestrictions:[$]});new class extends Ni{constructor(){super(be),Dr()}static{class f{static{({c:[be,Dr]}=Er(this,[],[Ir]))}static METADATA_EXPORTED_PROPERTIES="pwb:exported_properties";mComponent;constructor(e=O.use($)){this.mComponent=e;let o=new zt,l=e.processorConstructor;do{let g=st.get(l).getMetadata(f.METADATA_EXPORTED_PROPERTIES);g&&o.push(...g)}while(l=Object.getPrototypeOf(l));let m=new Set(o);m.size>0&&this.connectExportedProperties(m)}connectExportedProperties(e){this.exportPropertyAsAttribute(e),this.patchHtmlAttributes(e)}exportPropertyAsAttribute(e){for(let o of e){let l={};l.enumerable=!0,l.configurable=!0,delete l.value,delete l.writable,l.set=m=>{Reflect.set(this.mComponent.processor,o,m)},l.get=()=>{let m=Reflect.get(this.mComponent.processor,o);return typeof m=="function"&&(m=m.bind(this.mComponent.processor)),m},Object.defineProperty(this.mComponent.element,o,l)}}patchHtmlAttributes(e){let o=this.mComponent.element.getAttribute;new MutationObserver(m=>{for(let g of m){let y=g.attributeName,D=o.call(this.mComponent.element,y);Reflect.set(this.mComponent.element,y,D),this.mComponent.attributeChanged(y,g.oldValue,D)}}).observe(this.mComponent.element,{attributeFilter:[...e],attributeOldValue:!0});for(let m of e)if(this.mComponent.element.hasAttribute(m)){let g=o.call(this.mComponent.element,m);this.mComponent.element.setAttribute(m,g)}this.mComponent.element.getAttribute=m=>e.has(m)?Reflect.get(this.mComponent.element,m):o.call(this.mComponent.element,m)}}}};function ot(f,t){if(t.static)throw new A("Event target is not for a static property.",ot);let e=st.forInternalDecorator(t.metadata),o=e.getMetadata(be.METADATA_EXPORTED_PROPERTIES)??new Array;o.push(t.name),e.setMetadata(be.METADATA_EXPORTED_PROPERTIES,o)}function ft(f){return(t,e)=>{if(e.static)throw new A("Child decorator is not for a static property.",ft);return{get(){let m=(()=>{try{return tt.ofProcessor(this).component}catch{throw new A("PwbChild target class is not a component.",this)}})().getProcessorInjection(xt).data.store[f];if(m instanceof Element)return m;throw new A(`Can't find child "${f}".`,this)}}}}function Ai(){function f(c,n){return function(a){e(n,"addInitializer"),o(a,"An initializer"),c.push(a)}}function t(c,n,u,a,r,b,v,T,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+n:n,static:b,private:v,metadata:T},d={v:!1};s.addInitializer=f(a,d);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return c(w,s)}finally{d.v=!0}}function e(c,n){if(c.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(c,n){if(typeof c!="function")throw new TypeError(n+" must be a function")}function l(c,n){var u=typeof n;if(c===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var a;throw c===0?a="field":c===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function m(c,n,u,a,r,b,v,T,w){var p=u[0],s,d,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,C;if(typeof p=="function")h=t(p,a,s,T,r,b,v,w,i),h!==void 0&&(l(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h);else for(var P=p.length-1;P>=0;P--){var M=p[P];if(h=t(M,a,s,T,r,b,v,w,i),h!==void 0){l(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(I,E){return E};else if(typeof d!="function"){var _=d;d=function(I,E){for(var L=E,R=0;R<_.length;R++)L=_[R].call(I,L);return L}}else{var j=d;d=function(I,E){return j.call(I,E)}}c.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(c.push(function(I,E){return i.get.call(I,E)}),c.push(function(I,E){return i.set.call(I,E)})):r===2?c.push(i):c.push(function(I,E){return i.call(I,E)}):Object.defineProperty(n,a,s))}function g(c,n,u){for(var a=[],r,b,v=new Map,T=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,C;if(h?(x=c,s=s-5,b=b||[],C=b):(x=c.prototype,r=r||[],C=r),s!==0&&!i){var P=h?T:v,M=P.get(d)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!M&&s>2?P.set(d,s):P.set(d,!0)}m(a,x,p,d,s,h,i,C,u)}}return y(a,r),y(a,b),a}function y(c,n){n&&c.push(function(u){for(var a=0;a<n.length;a++)n[a].call(u);return u})}function D(c,n,u){if(n.length>0){for(var a=[],r=c,b=c.name,v=n.length-1;v>=0;v--){var T={v:!1};try{var w=n[v](r,{kind:"class",name:b,addInitializer:f(a,T),metadata:u})}finally{T.v=!0}w!==void 0&&(l(10,w),r=w)}return[S(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function S(c,n){return Object.defineProperty(c,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,a,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),T=g(n,u,v);return a.length||S(n,v),{e:T,get c(){return D(n,a,v)}}}}function Pr(f,t,e,o){return(Pr=Ai())(f,t,e,o)}var Mr,Sr,Li;Mr=Ct({instructionType:"dynamic-content"});var Cr=class{static{({c:[Li,Sr]}=Pr(this,[],[Mr]))}constructor(t=O.use(Q),e=O.use(U)){this.mModuleValues=e,this.mLastTemplate=null,this.mProcedure=this.mModuleValues.createExpressionProcedure(t.value)}mLastTemplate;mModuleValues;mProcedure;onUpdate(){let t=this.mProcedure.execute();if(!t||!(t instanceof ct))throw new A("Dynamic content method has a wrong result type.",this);if(this.mLastTemplate!==null&&this.mLastTemplate.equals(t))return null;let e=t.clone();this.mLastTemplate=e;let o=new ut;return o.addElement(e,new dt(this.mModuleValues.data)),o}static{Sr()}};function Ri(){function f(c,n){return function(a){e(n,"addInitializer"),o(a,"An initializer"),c.push(a)}}function t(c,n,u,a,r,b,v,T,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+n:n,static:b,private:v,metadata:T},d={v:!1};s.addInitializer=f(a,d);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return c(w,s)}finally{d.v=!0}}function e(c,n){if(c.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(c,n){if(typeof c!="function")throw new TypeError(n+" must be a function")}function l(c,n){var u=typeof n;if(c===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var a;throw c===0?a="field":c===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function m(c,n,u,a,r,b,v,T,w){var p=u[0],s,d,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,C;if(typeof p=="function")h=t(p,a,s,T,r,b,v,w,i),h!==void 0&&(l(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h);else for(var P=p.length-1;P>=0;P--){var M=p[P];if(h=t(M,a,s,T,r,b,v,w,i),h!==void 0){l(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(I,E){return E};else if(typeof d!="function"){var _=d;d=function(I,E){for(var L=E,R=0;R<_.length;R++)L=_[R].call(I,L);return L}}else{var j=d;d=function(I,E){return j.call(I,E)}}c.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(c.push(function(I,E){return i.get.call(I,E)}),c.push(function(I,E){return i.set.call(I,E)})):r===2?c.push(i):c.push(function(I,E){return i.call(I,E)}):Object.defineProperty(n,a,s))}function g(c,n,u){for(var a=[],r,b,v=new Map,T=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,C;if(h?(x=c,s=s-5,b=b||[],C=b):(x=c.prototype,r=r||[],C=r),s!==0&&!i){var P=h?T:v,M=P.get(d)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!M&&s>2?P.set(d,s):P.set(d,!0)}m(a,x,p,d,s,h,i,C,u)}}return y(a,r),y(a,b),a}function y(c,n){n&&c.push(function(u){for(var a=0;a<n.length;a++)n[a].call(u);return u})}function D(c,n,u){if(n.length>0){for(var a=[],r=c,b=c.name,v=n.length-1;v>=0;v--){var T={v:!1};try{var w=n[v](r,{kind:"class",name:b,addInitializer:f(a,T),metadata:u})}finally{T.v=!0}w!==void 0&&(l(10,w),r=w)}return[S(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function S(c,n){return Object.defineProperty(c,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,a,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),T=g(n,u,v);return a.length||S(n,v),{e:T,get c(){return D(n,a,v)}}}}function Lr(f,t,e,o){return(Lr=Ri())(f,t,e,o)}var Rr,Nr,Oi;Rr=wt({access:X.Write,selector:/^\([[\w\-$]+\)$/});var Ar=class{static{({c:[Oi,Nr]}=Lr(this,[],[Rr]))}constructor(t=O.use(q),e=O.use(U),o=O.use(rt)){this.mTarget=t,this.mEventName=o.name.substring(1,o.name.length-1);let l=e.createExpressionProcedure(o.value,["$event"]);this.mListener=m=>{l.setTemporaryValue("$event",m),l.execute()},this.mTarget.addEventListener(this.mEventName,this.mListener)}mEventName;mListener;mTarget;onDeconstruct(){this.mTarget.removeEventListener(this.mEventName,this.mListener)}static{Nr()}};function Fi(){function f(c,n){return function(a){e(n,"addInitializer"),o(a,"An initializer"),c.push(a)}}function t(c,n,u,a,r,b,v,T,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+n:n,static:b,private:v,metadata:T},d={v:!1};s.addInitializer=f(a,d);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return c(w,s)}finally{d.v=!0}}function e(c,n){if(c.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(c,n){if(typeof c!="function")throw new TypeError(n+" must be a function")}function l(c,n){var u=typeof n;if(c===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var a;throw c===0?a="field":c===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function m(c,n,u,a,r,b,v,T,w){var p=u[0],s,d,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,C;if(typeof p=="function")h=t(p,a,s,T,r,b,v,w,i),h!==void 0&&(l(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h);else for(var P=p.length-1;P>=0;P--){var M=p[P];if(h=t(M,a,s,T,r,b,v,w,i),h!==void 0){l(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(I,E){return E};else if(typeof d!="function"){var _=d;d=function(I,E){for(var L=E,R=0;R<_.length;R++)L=_[R].call(I,L);return L}}else{var j=d;d=function(I,E){return j.call(I,E)}}c.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(c.push(function(I,E){return i.get.call(I,E)}),c.push(function(I,E){return i.set.call(I,E)})):r===2?c.push(i):c.push(function(I,E){return i.call(I,E)}):Object.defineProperty(n,a,s))}function g(c,n,u){for(var a=[],r,b,v=new Map,T=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,C;if(h?(x=c,s=s-5,b=b||[],C=b):(x=c.prototype,r=r||[],C=r),s!==0&&!i){var P=h?T:v,M=P.get(d)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!M&&s>2?P.set(d,s):P.set(d,!0)}m(a,x,p,d,s,h,i,C,u)}}return y(a,r),y(a,b),a}function y(c,n){n&&c.push(function(u){for(var a=0;a<n.length;a++)n[a].call(u);return u})}function D(c,n,u){if(n.length>0){for(var a=[],r=c,b=c.name,v=n.length-1;v>=0;v--){var T={v:!1};try{var w=n[v](r,{kind:"class",name:b,addInitializer:f(a,T),metadata:u})}finally{T.v=!0}w!==void 0&&(l(10,w),r=w)}return[S(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function S(c,n){return Object.defineProperty(c,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,a,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),T=g(n,u,v);return a.length||S(n,v),{e:T,get c(){return D(n,a,v)}}}}function _r(f,t,e,o){return(_r=Fi())(f,t,e,o)}var zr,Or,_i;zr=Ct({instructionType:"for"});var Fr=class{static{({c:[_i,Or]}=_r(this,[],[zr]))}constructor(t=O.use(mt),e=O.use(U),o=O.use(Q)){this.mTemplate=t,this.mModuleValues=e,this.mLastEntries=new Array;let l=o.value,g=new RegExp(/^\s*([a-zA-Z]+[a-zA-Z0-9]*)\s*of\s+([^;]+)\s*(;\s*([a-zA-Z]+[a-zA-Z0-9]*)\s*=\s*(.*)\s*)?$/).exec(l);if(!g)throw new A(`For-Parameter value has wrong format: ${l}`,this);let y=g[1],D=g[2],S=g[4]??null,c=g[5],n=this.mModuleValues.createExpressionProcedure(D),u=S?this.mModuleValues.createExpressionProcedure(c,["$index",y]):null;this.mExpression={iterateVariableName:y,iterateValueProcedure:n,indexExportVariableName:S,indexExportProcedure:u}}mExpression;mLastEntries;mModuleValues;mTemplate;onUpdate(){let t=new ut,e=this.mExpression.iterateValueProcedure.execute();if(typeof e=="object"&&e!==null||Array.isArray(e)){let o=Symbol.iterator in e?Object.entries([...e]):Object.entries(e);if(this.compareEntries(o,this.mLastEntries))return null;this.mLastEntries=o;for(let[l,m]of o)this.addTemplateForElement(t,this.mExpression,m,l);return t}else return null}addTemplateForElement=(t,e,o,l)=>{let m=new dt(this.mModuleValues.data);if(m.setTemporaryValue(e.iterateVariableName,o),e.indexExportProcedure&&e.indexExportVariableName){e.indexExportProcedure.setTemporaryValue("$index",l),e.indexExportProcedure.setTemporaryValue(e.iterateVariableName,o);let y=e.indexExportProcedure.execute();m.setTemporaryValue(e.indexExportVariableName,y)}let g=new ct;g.appendChild(...this.mTemplate.childList),t.addElement(g,m)};compareEntries(t,e){if(t.length!==e.length)return!1;for(let o=0;o<t.length;o++){let[l,m]=t[o],[g,y]=e[o];if(l!==g||m!==y)return!1}return!0}static{Or()}};function zi(){function f(c,n){return function(a){e(n,"addInitializer"),o(a,"An initializer"),c.push(a)}}function t(c,n,u,a,r,b,v,T,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+n:n,static:b,private:v,metadata:T},d={v:!1};s.addInitializer=f(a,d);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return c(w,s)}finally{d.v=!0}}function e(c,n){if(c.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(c,n){if(typeof c!="function")throw new TypeError(n+" must be a function")}function l(c,n){var u=typeof n;if(c===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var a;throw c===0?a="field":c===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function m(c,n,u,a,r,b,v,T,w){var p=u[0],s,d,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,C;if(typeof p=="function")h=t(p,a,s,T,r,b,v,w,i),h!==void 0&&(l(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h);else for(var P=p.length-1;P>=0;P--){var M=p[P];if(h=t(M,a,s,T,r,b,v,w,i),h!==void 0){l(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(I,E){return E};else if(typeof d!="function"){var _=d;d=function(I,E){for(var L=E,R=0;R<_.length;R++)L=_[R].call(I,L);return L}}else{var j=d;d=function(I,E){return j.call(I,E)}}c.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(c.push(function(I,E){return i.get.call(I,E)}),c.push(function(I,E){return i.set.call(I,E)})):r===2?c.push(i):c.push(function(I,E){return i.call(I,E)}):Object.defineProperty(n,a,s))}function g(c,n,u){for(var a=[],r,b,v=new Map,T=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,C;if(h?(x=c,s=s-5,b=b||[],C=b):(x=c.prototype,r=r||[],C=r),s!==0&&!i){var P=h?T:v,M=P.get(d)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!M&&s>2?P.set(d,s):P.set(d,!0)}m(a,x,p,d,s,h,i,C,u)}}return y(a,r),y(a,b),a}function y(c,n){n&&c.push(function(u){for(var a=0;a<n.length;a++)n[a].call(u);return u})}function D(c,n,u){if(n.length>0){for(var a=[],r=c,b=c.name,v=n.length-1;v>=0;v--){var T={v:!1};try{var w=n[v](r,{kind:"class",name:b,addInitializer:f(a,T),metadata:u})}finally{T.v=!0}w!==void 0&&(l(10,w),r=w)}return[S(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function S(c,n){return Object.defineProperty(c,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,a,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),T=g(n,u,v);return a.length||S(n,v),{e:T,get c(){return D(n,a,v)}}}}function $r(f,t,e,o){return($r=zi())(f,t,e,o)}var Gr,jr,ji;Gr=Ct({instructionType:"if"});var Vr=class{static{({c:[ji,jr]}=$r(this,[],[Gr]))}constructor(t=O.use(mt),e=O.use(U),o=O.use(Q)){this.mTemplateReference=t,this.mModuleValues=e,this.mProcedure=this.mModuleValues.createExpressionProcedure(o.value),this.mLastBoolean=!1}mLastBoolean;mModuleValues;mProcedure;mTemplateReference;onUpdate(){let t=this.mProcedure.execute();if(!!t!==this.mLastBoolean){this.mLastBoolean=!!t;let e=new ut;if(t){let o=new ct;o.appendChild(...this.mTemplateReference.childList),e.addElement(o,new dt(this.mModuleValues.data))}return e}else return null}static{jr()}};function Vi(){function f(c,n){return function(a){e(n,"addInitializer"),o(a,"An initializer"),c.push(a)}}function t(c,n,u,a,r,b,v,T,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+n:n,static:b,private:v,metadata:T},d={v:!1};s.addInitializer=f(a,d);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return c(w,s)}finally{d.v=!0}}function e(c,n){if(c.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(c,n){if(typeof c!="function")throw new TypeError(n+" must be a function")}function l(c,n){var u=typeof n;if(c===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var a;throw c===0?a="field":c===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function m(c,n,u,a,r,b,v,T,w){var p=u[0],s,d,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,C;if(typeof p=="function")h=t(p,a,s,T,r,b,v,w,i),h!==void 0&&(l(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h);else for(var P=p.length-1;P>=0;P--){var M=p[P];if(h=t(M,a,s,T,r,b,v,w,i),h!==void 0){l(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(I,E){return E};else if(typeof d!="function"){var _=d;d=function(I,E){for(var L=E,R=0;R<_.length;R++)L=_[R].call(I,L);return L}}else{var j=d;d=function(I,E){return j.call(I,E)}}c.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(c.push(function(I,E){return i.get.call(I,E)}),c.push(function(I,E){return i.set.call(I,E)})):r===2?c.push(i):c.push(function(I,E){return i.call(I,E)}):Object.defineProperty(n,a,s))}function g(c,n,u){for(var a=[],r,b,v=new Map,T=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,C;if(h?(x=c,s=s-5,b=b||[],C=b):(x=c.prototype,r=r||[],C=r),s!==0&&!i){var P=h?T:v,M=P.get(d)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!M&&s>2?P.set(d,s):P.set(d,!0)}m(a,x,p,d,s,h,i,C,u)}}return y(a,r),y(a,b),a}function y(c,n){n&&c.push(function(u){for(var a=0;a<n.length;a++)n[a].call(u);return u})}function D(c,n,u){if(n.length>0){for(var a=[],r=c,b=c.name,v=n.length-1;v>=0;v--){var T={v:!1};try{var w=n[v](r,{kind:"class",name:b,addInitializer:f(a,T),metadata:u})}finally{T.v=!0}w!==void 0&&(l(10,w),r=w)}return[S(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function S(c,n){return Object.defineProperty(c,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,a,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),T=g(n,u,v);return a.length||S(n,v),{e:T,get c(){return D(n,a,v)}}}}function Hr(f,t,e,o){return(Hr=Vi())(f,t,e,o)}var Xr,Br,$i;Xr=wt({access:X.Read,selector:/^\[[\w$]+\]$/});var Ur=class{static{({c:[$i,Br]}=Hr(this,[],[Xr]))}constructor(t=O.use(q),e=O.use(U),o=O.use(rt)){this.mTarget=t,this.mProcedure=e.createExpressionProcedure(o.value),this.mTargetProperty=o.name.substring(1,o.name.length-1),this.mLastValue=Symbol("Uncomparable")}mLastValue;mProcedure;mTarget;mTargetProperty;onUpdate(){let t=this.mProcedure.execute();return t===this.mLastValue?!1:(this.mLastValue=t,Reflect.set(this.mTarget,this.mTargetProperty,t),!0)}static{Br()}};function Gi(){function f(c,n){return function(a){e(n,"addInitializer"),o(a,"An initializer"),c.push(a)}}function t(c,n,u,a,r,b,v,T,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+n:n,static:b,private:v,metadata:T},d={v:!1};s.addInitializer=f(a,d);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return c(w,s)}finally{d.v=!0}}function e(c,n){if(c.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(c,n){if(typeof c!="function")throw new TypeError(n+" must be a function")}function l(c,n){var u=typeof n;if(c===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var a;throw c===0?a="field":c===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function m(c,n,u,a,r,b,v,T,w){var p=u[0],s,d,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,C;if(typeof p=="function")h=t(p,a,s,T,r,b,v,w,i),h!==void 0&&(l(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h);else for(var P=p.length-1;P>=0;P--){var M=p[P];if(h=t(M,a,s,T,r,b,v,w,i),h!==void 0){l(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(I,E){return E};else if(typeof d!="function"){var _=d;d=function(I,E){for(var L=E,R=0;R<_.length;R++)L=_[R].call(I,L);return L}}else{var j=d;d=function(I,E){return j.call(I,E)}}c.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(c.push(function(I,E){return i.get.call(I,E)}),c.push(function(I,E){return i.set.call(I,E)})):r===2?c.push(i):c.push(function(I,E){return i.call(I,E)}):Object.defineProperty(n,a,s))}function g(c,n,u){for(var a=[],r,b,v=new Map,T=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,C;if(h?(x=c,s=s-5,b=b||[],C=b):(x=c.prototype,r=r||[],C=r),s!==0&&!i){var P=h?T:v,M=P.get(d)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!M&&s>2?P.set(d,s):P.set(d,!0)}m(a,x,p,d,s,h,i,C,u)}}return y(a,r),y(a,b),a}function y(c,n){n&&c.push(function(u){for(var a=0;a<n.length;a++)n[a].call(u);return u})}function D(c,n,u){if(n.length>0){for(var a=[],r=c,b=c.name,v=n.length-1;v>=0;v--){var T={v:!1};try{var w=n[v](r,{kind:"class",name:b,addInitializer:f(a,T),metadata:u})}finally{T.v=!0}w!==void 0&&(l(10,w),r=w)}return[S(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function S(c,n){return Object.defineProperty(c,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,a,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),T=g(n,u,v);return a.length||S(n,v),{e:T,get c(){return D(n,a,v)}}}}function Zr(f,t,e,o){return(Zr=Gi())(f,t,e,o)}var qr,Yr,Bi;qr=wt({access:X.Write,selector:/^#[[\w$]+$/});var Wr=class{static{({c:[Bi,Yr]}=Zr(this,[],[qr]))}constructor(t=O.use(q),e=O.use(rt),o=O.use(xt)){this.mChildName=e.name.substring(1),this.mComponentScopeValue=o,this.mTargetNode=t,this.mComponentScopeValue.setTemporaryValue(this.mChildName,this.mTargetNode)}mChildName;mComponentScopeValue;mTargetNode;onDeconstruct(){this.mComponentScopeValue.data.store[this.mChildName]===this.mTargetNode&&this.mComponentScopeValue.data.deleteTemporaryValue(this.mChildName)}static{Yr()}};function Ui(){function f(c,n){return function(a){e(n,"addInitializer"),o(a,"An initializer"),c.push(a)}}function t(c,n,u,a,r,b,v,T,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+n:n,static:b,private:v,metadata:T},d={v:!1};s.addInitializer=f(a,d);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return c(w,s)}finally{d.v=!0}}function e(c,n){if(c.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(c,n){if(typeof c!="function")throw new TypeError(n+" must be a function")}function l(c,n){var u=typeof n;if(c===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var a;throw c===0?a="field":c===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function m(c,n,u,a,r,b,v,T,w){var p=u[0],s,d,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,C;if(typeof p=="function")h=t(p,a,s,T,r,b,v,w,i),h!==void 0&&(l(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h);else for(var P=p.length-1;P>=0;P--){var M=p[P];if(h=t(M,a,s,T,r,b,v,w,i),h!==void 0){l(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(I,E){return E};else if(typeof d!="function"){var _=d;d=function(I,E){for(var L=E,R=0;R<_.length;R++)L=_[R].call(I,L);return L}}else{var j=d;d=function(I,E){return j.call(I,E)}}c.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(c.push(function(I,E){return i.get.call(I,E)}),c.push(function(I,E){return i.set.call(I,E)})):r===2?c.push(i):c.push(function(I,E){return i.call(I,E)}):Object.defineProperty(n,a,s))}function g(c,n,u){for(var a=[],r,b,v=new Map,T=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,C;if(h?(x=c,s=s-5,b=b||[],C=b):(x=c.prototype,r=r||[],C=r),s!==0&&!i){var P=h?T:v,M=P.get(d)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!M&&s>2?P.set(d,s):P.set(d,!0)}m(a,x,p,d,s,h,i,C,u)}}return y(a,r),y(a,b),a}function y(c,n){n&&c.push(function(u){for(var a=0;a<n.length;a++)n[a].call(u);return u})}function D(c,n,u){if(n.length>0){for(var a=[],r=c,b=c.name,v=n.length-1;v>=0;v--){var T={v:!1};try{var w=n[v](r,{kind:"class",name:b,addInitializer:f(a,T),metadata:u})}finally{T.v=!0}w!==void 0&&(l(10,w),r=w)}return[S(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function S(c,n){return Object.defineProperty(c,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,a,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),T=g(n,u,v);return a.length||S(n,v),{e:T,get c(){return D(n,a,v)}}}}function Qr(f,t,e,o){return(Qr=Ui())(f,t,e,o)}var kr,Jr,Hi;kr=Ct({instructionType:"slot"});var Kr=class{static{({c:[Hi,Jr]}=Qr(this,[],[kr]))}constructor(t=O.use(U),e=O.use(Q)){this.mModuleValues=t,this.mSlotName=e.value,this.mIsSetup=!1}mIsSetup;mModuleValues;mSlotName;onUpdate(){if(this.mIsSetup)return null;this.mIsSetup=!0;let t=new St("slot");this.mSlotName!==""&&t.setAttribute("name").addValue(this.mSlotName);let e=new ct;e.appendChild(t);let o=new ut;return o.addElement(e,this.mModuleValues.data),o}static{Jr()}};function Xi(){function f(c,n){return function(a){e(n,"addInitializer"),o(a,"An initializer"),c.push(a)}}function t(c,n,u,a,r,b,v,T,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+n:n,static:b,private:v,metadata:T},d={v:!1};s.addInitializer=f(a,d);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return c(w,s)}finally{d.v=!0}}function e(c,n){if(c.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(c,n){if(typeof c!="function")throw new TypeError(n+" must be a function")}function l(c,n){var u=typeof n;if(c===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var a;throw c===0?a="field":c===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function m(c,n,u,a,r,b,v,T,w){var p=u[0],s,d,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,C;if(typeof p=="function")h=t(p,a,s,T,r,b,v,w,i),h!==void 0&&(l(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h);else for(var P=p.length-1;P>=0;P--){var M=p[P];if(h=t(M,a,s,T,r,b,v,w,i),h!==void 0){l(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(I,E){return E};else if(typeof d!="function"){var _=d;d=function(I,E){for(var L=E,R=0;R<_.length;R++)L=_[R].call(I,L);return L}}else{var j=d;d=function(I,E){return j.call(I,E)}}c.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(c.push(function(I,E){return i.get.call(I,E)}),c.push(function(I,E){return i.set.call(I,E)})):r===2?c.push(i):c.push(function(I,E){return i.call(I,E)}):Object.defineProperty(n,a,s))}function g(c,n,u){for(var a=[],r,b,v=new Map,T=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,C;if(h?(x=c,s=s-5,b=b||[],C=b):(x=c.prototype,r=r||[],C=r),s!==0&&!i){var P=h?T:v,M=P.get(d)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!M&&s>2?P.set(d,s):P.set(d,!0)}m(a,x,p,d,s,h,i,C,u)}}return y(a,r),y(a,b),a}function y(c,n){n&&c.push(function(u){for(var a=0;a<n.length;a++)n[a].call(u);return u})}function D(c,n,u){if(n.length>0){for(var a=[],r=c,b=c.name,v=n.length-1;v>=0;v--){var T={v:!1};try{var w=n[v](r,{kind:"class",name:b,addInitializer:f(a,T),metadata:u})}finally{T.v=!0}w!==void 0&&(l(10,w),r=w)}return[S(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function S(c,n){return Object.defineProperty(c,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,a,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),T=g(n,u,v);return a.length||S(n,v),{e:T,get c(){return D(n,a,v)}}}}function ro(f,t,e,o){return(ro=Xi())(f,t,e,o)}var oo,to,Yi;oo=wt({access:X.ReadWrite,selector:/^\[\([[\w$]+\)\]$/});var eo=class{static{({c:[Yi,to]}=ro(this,[],[oo]))}constructor(t=O.use($),e=O.use(q),o=O.use(U),l=O.use(rt)){this.mTargetNode=e,this.mAttributeKey=l.name.substring(2,l.name.length-2),this.mReadProcedure=o.createExpressionProcedure(l.value),this.mWriteProcedure=o.createExpressionProcedure(`${l.value} = $DATA;`,["$DATA"]),this.mLastDataValue=Symbol("Uncomparable");let m=g=>{this.mLastDataValue!==g&&t.updater.updateAsync()};this.mTargetNode.addEventListener("input",g=>{m(Reflect.get(this.mTargetNode,this.mAttributeKey))}),this.mTargetNode.addEventListener("change",g=>{m(Reflect.get(this.mTargetNode,this.mAttributeKey))})}mAttributeKey;mLastDataValue;mReadProcedure;mTargetNode;mWriteProcedure;onUpdate(){let t=this.mReadProcedure.execute();if(t!==this.mLastDataValue)return Reflect.set(this.mTargetNode,this.mAttributeKey,t),this.mLastDataValue=t,!0;let e=Reflect.get(this.mTargetNode,this.mAttributeKey);return e!==t?(this.mWriteProcedure.setTemporaryValue("$DATA",e),this.mWriteProcedure.execute(),this.mLastDataValue=e,!0):!1}static{to()}};function Wi(){function f(c,n){return function(a){e(n,"addInitializer"),o(a,"An initializer"),c.push(a)}}function t(c,n,u,a,r,b,v,T,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+n:n,static:b,private:v,metadata:T},d={v:!1};s.addInitializer=f(a,d);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return c(w,s)}finally{d.v=!0}}function e(c,n){if(c.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(c,n){if(typeof c!="function")throw new TypeError(n+" must be a function")}function l(c,n){var u=typeof n;if(c===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var a;throw c===0?a="field":c===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function m(c,n,u,a,r,b,v,T,w){var p=u[0],s,d,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,C;if(typeof p=="function")h=t(p,a,s,T,r,b,v,w,i),h!==void 0&&(l(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h);else for(var P=p.length-1;P>=0;P--){var M=p[P];if(h=t(M,a,s,T,r,b,v,w,i),h!==void 0){l(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(I,E){return E};else if(typeof d!="function"){var _=d;d=function(I,E){for(var L=E,R=0;R<_.length;R++)L=_[R].call(I,L);return L}}else{var j=d;d=function(I,E){return j.call(I,E)}}c.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(c.push(function(I,E){return i.get.call(I,E)}),c.push(function(I,E){return i.set.call(I,E)})):r===2?c.push(i):c.push(function(I,E){return i.call(I,E)}):Object.defineProperty(n,a,s))}function g(c,n,u){for(var a=[],r,b,v=new Map,T=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,C;if(h?(x=c,s=s-5,b=b||[],C=b):(x=c.prototype,r=r||[],C=r),s!==0&&!i){var P=h?T:v,M=P.get(d)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!M&&s>2?P.set(d,s):P.set(d,!0)}m(a,x,p,d,s,h,i,C,u)}}return y(a,r),y(a,b),a}function y(c,n){n&&c.push(function(u){for(var a=0;a<n.length;a++)n[a].call(u);return u})}function D(c,n,u){if(n.length>0){for(var a=[],r=c,b=c.name,v=n.length-1;v>=0;v--){var T={v:!1};try{var w=n[v](r,{kind:"class",name:b,addInitializer:f(a,T),metadata:u})}finally{T.v=!0}w!==void 0&&(l(10,w),r=w)}return[S(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function S(c,n){return Object.defineProperty(c,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,a,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),T=g(n,u,v);return a.length||S(n,v),{e:T,get c(){return D(n,a,v)}}}}function so(f,t,e,o){return(so=Wi())(f,t,e,o)}var ao,no,Zi;ao=Bt({access:X.Read,targetRestrictions:[bt]});var io=class{static{({c:[Zi,no]}=so(this,[],[ao]))}constructor(t=O.use(bt),e=O.use(q)){let o=new Array,l=t.processorConstructor;do{let m=st.get(l).getMetadata(ge.METADATA_USER_EVENT_LISTENER_PROPERIES);if(m)for(let g of m)o.push(g)}while(l=Object.getPrototypeOf(l));this.mEventListenerList=new Array,this.mTargetElement=e;for(let m of o){let[g,y]=m,D=Reflect.get(t.processor,g);D=D.bind(t.processor),this.mEventListenerList.push([y,D]),this.mTargetElement.addEventListener(y,D)}}mEventListenerList;mTargetElement;onDeconstruct(){for(let t of this.mEventListenerList){let[e,o]=t;this.mTargetElement.removeEventListener(e,o)}}static{no()}};var lo=`:host {\r
    display: block;\r
    width: 100%;\r
    height: 100%;\r
}\r
\r
potatno-code-editor {\r
    display: block;\r
    width: 100%;\r
    height: 100%;\r
}`;var Jt=class{mProject;constructor(t){this.mProject=t}deserialize(t){let e=new Mt(this.mProject);for(let o of t.functions)e.addFunction(this.deserializeFunction(o,e));return e}deserializeFunction(t,e){let o=new pt(this.mProject,e,{definitionId:t.definitionId,id:t.id,label:t.label,isSystem:t.isSystem});for(let m of t.imports)o.addImport(m);for(let m of t.inputs)o.addInput({label:m.label,dataType:m.dataType});for(let m of t.outputs)o.addOutput({label:m.label,dataType:m.dataType});let l=new Map;for(let m of t.nodes)l.set(m.id,this.deserializeNode(m,o,e));for(let m of t.connections){if(!l.has(m.sourceNodeId)||!l.has(m.targetNodeId))continue;let g=l.get(m.sourceNodeId),y=l.get(m.targetNodeId),D=g.outputs.map.get(m.sourcePortId),S=y.inputs.map.get(m.targetPortId);!D||!S||D.connect(S)}return o}deserializeNode(t,e,o){let l=o.nodeDefinitions.find(g=>g.id===t.definitionId),m=(()=>{if(l)return e.addNodeByDefinition(l,t.transformation);let g=t.ports.filter(D=>D.direction==="input").map(D=>({dataType:D.dataType,definitionId:D.definitionId,label:D.label,portType:D.portType})),y=t.ports.filter(D=>D.direction==="output").map(D=>({dataType:D.dataType,definitionId:D.definitionId,label:D.label,portType:D.portType}));return new vt(this.mProject,o,e,{definitionId:t.definitionId,ports:{input:g,output:y},label:t.label,transformation:{...t.transformation}})})();m.label=t.label,e.addNode(m);for(let g of t.ports)if(g.portType==="value"&&g.directValue.length>0){let y=m.inputs.map.get(g.definitionId);y&&y.setDirectValue(g.directValue)}return m.preview=t.preview??null,m}};var Kt=class{constructor(){}serialize(t){return{functions:[...t.functions].map(e=>this.serializeFunction(e))}}serializeFunction(t){let e=new Map;[...t.nodes].forEach((y,D)=>{e.set(y,`n${D}`)});let o=[...t.nodes].map(y=>this.serializeNode(y,e.get(y))),l=[];for(let y of t.nodes){let D=e.get(y);for(let S of y.outputs.list)for(let c of S.connectedPorts){let n=e.get(c.node);l.push({sourceNodeId:D,sourcePortId:S.definitionId,targetNodeId:n,targetPortId:c.definitionId})}}let m=t.inputs.map(y=>({label:y.label,dataType:y.dataType})),g=t.outputs.map(y=>({label:y.label,dataType:y.dataType}));return{id:t.id,label:t.label,isSystem:t.isSystem,definitionId:t.definitionId,inputs:m,outputs:g,imports:[...t.imports],nodes:o,connections:l}}serializeNode(t,e){let o=[...t.inputs.list,...t.outputs.list].map(m=>({definitionId:m.definitionId,label:m.label,direction:m.direction,portType:m.portType,dataType:m.portType==="value"?m.dataType:null,directValue:[...m.directValue]})),l=t.preview?structuredClone(t.preview):null;return{id:e,definitionId:t.definitionId,label:t.label,transformation:{...t.transformation},ports:o,preview:l}}};var co=`:host {\r
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
}`;var Qt=class{mCodeGenerator;mId;mLabel;mNodesProvider;mStatics;get codeGenerator(){return this.mCodeGenerator}get id(){return this.mId}get label(){return this.mLabel}get statics(){return this.mStatics}constructor(t){this.mId=t.id,this.mLabel=t.label,this.mNodesProvider=t.nodes,this.mStatics=t.statics,this.mCodeGenerator=t.generator.code}getNodeDefinitions(t){let e=l=>{if(!l)return new Array;let m=new Array;return l(g=>{m.push(g)},t),m},o={};return Object.defineProperty(o,"entry",{get:()=>e(this.mNodesProvider.entry)}),Object.defineProperty(o,"exit",{get:()=>e(this.mNodesProvider.exit)}),Object.defineProperty(o,"dynamic",{get:()=>e(this.mNodesProvider.dynamic)}),o}},nt={none:0,imports:1,inputs:2,outputs:4};var _e=class f{static PASTE_OFFSET=2;mClipboardNodes;mManager;constructor(t){this.mManager=t,this.mClipboardNodes=new Array}copy(t){if(t.size===0)return;let e=[...t],o=new Map;for(let l=0;l<e.length;l++){let m=e[l],g=m.inputs.value.map(D=>({definitionId:D.definitionId,values:[...D.directValue]})),y={...m.transformation};y.x+=f.PASTE_OFFSET,y.y+=f.PASTE_OFFSET,o.set(m,{connections:new Array,definitionId:m.definitionId,id:l,portDirectValues:g,label:m.label,transformation:y})}for(let[l,m]of o)for(let g of l.outputs.list)for(let y of g.connectedPorts){let D=o.get(y.node);D&&m.connections.push({sourcePortName:g.definitionId,targetNodeId:D.id,targetPortName:y.definitionId})}this.mClipboardNodes=[...o.values()]}paste(){if(this.mClipboardNodes.length===0)return new Array;let t=this.mManager.activeFunction;if(!t)return[];let e=new Map;for(let o of this.mClipboardNodes){let l=t.dynamicNodeDefinitions.find(g=>g.id===o.definitionId);if(!l)continue;let m=this.mManager.graph.addNode(t,l,o.transformation);this.mManager.graph.updateNode(m,g=>{g.label=o.label;for(let y of o.portDirectValues)g.inputs.map.has(y.definitionId)&&g.inputs.map.get(y.definitionId).setDirectValue(y.values)}),e.set(o.id,m)}for(let o of this.mClipboardNodes){let l=e.get(o.id);if(l)for(let m of o.connections){let g=e.get(m.targetNodeId);if(!g)continue;let y=l.outputs.map.get(m.sourcePortName),D=g.inputs.map.get(m.targetPortName);!y||!D||this.mManager.graph.connectPorts(y,D)}}return[...e.values()]}};var ze=class extends ie{mGridNodeArea;mGridPaths;mNodeArea;mPathArea;constructor(){super(),this.mGridNodeArea=new WeakMap,this.mNodeArea=new Map,this.mGridPaths=new WeakMap,this.mPathArea=new Map}clear(t){t==="all"&&this.mNodeArea.clear(),this.mPathArea.clear()}getPath(t,e){let o=t.direction==="input"&&t.portType==="value"||t.direction==="output"&&t.portType==="flow"?t:e;return this.mGridPaths.get(o)??new Array}removeNodeArea(t){if(!this.mGridNodeArea.has(t))return;let e=this.mGridNodeArea.get(t);for(let o of e){let l=(this.mNodeArea.get(o)??0)-1;l<1?this.mNodeArea.delete(o):this.mNodeArea.set(o,l)}this.mGridNodeArea.delete(t)}updateNodeArea(t){this.removeNodeArea(t);let e=t.transformation.x,o=t.transformation.y,l=t.transformation.width,m=t.transformation.height,g=new Array;for(let y=0;y<l;y++)for(let D=0;D<m;D++){let S=`${y+e}|${D+o}`,c=(this.mNodeArea.get(S)??0)+1;this.mNodeArea.set(S,c),g.push(S)}this.mGridNodeArea.set(t,g)}updatePath(t,e,o){if(t.direction==="input"&&t.portType!=="value"||t.direction==="output"&&t.portType!=="flow")throw new A("Start port must be an input-value or an output-flow node.",this);this.removePathArea(t);let l=this.start(e,o);this.mGridPaths.set(t,l.path);let m=this.nodeId(e),g=this.nodeId(o);for(let y of l.path){let D=this.nodeId(y),S=this.mPathArea.has(D)?this.mPathArea.get(D):{ports:new Map,entryPoints:new Set};S.ports.set(t,[m,g]),S.entryPoints.add(m),S.entryPoints.add(g),this.mPathArea.set(D,S)}}costOfTraversal(t,e){let o=this.nodeId(t),l=1;this.mNodeArea.has(o)&&t!==e.endNode&&(l*=20);let m=e.path.next().value;if(this.mPathArea.has(o)){let c=this.mPathArea.get(o),n=this.nodeId(e.startNode),u=this.nodeId(e.endNode);if(c.entryPoints.has(n)||c.entryPoints.has(u))l*=.2;else if(l*=5,m){let a=this.nodeId(m);this.mPathArea.has(a)&&(l*=20)}}if(m){let c=t.y===m.y;(t===e.endNode||m===e.startNode)&&!c&&(l*=100);let n=e.path.next().value;n&&(t.x===n.x||t.y===n.y)&&(l*=.7)}let g=Math.abs(t.x-e.startNode.x),y=Math.abs(t.x-e.endNode.x),D=g<=y;(D&&t.y===e.startNode.y||!D&&t.y===e.endNode.y)&&(l*=.5);let S=e.endNode.x+e.startNode.x>>1;return t.x===S&&(l*=.5),l}heuristic(t,e){return(Math.abs(t.x-e.endNode.x)+Math.abs(t.y-e.endNode.y))*.5}neighborNodes(t){return[{x:t.x,y:t.y-1},{x:t.x-1,y:t.y},{x:t.x+1,y:t.y},{x:t.x,y:t.y+1}]}nodeId(t){return`${t.x}|${t.y}`}removePathArea(t){if(!this.mGridPaths.has(t))return;let e=this.mGridPaths.get(t);for(let o of e){let l=this.nodeId(o),m=this.mPathArea.get(l);if(!m)continue;let g=m.ports.get(t);g&&(m.ports.delete(t),m.entryPoints.delete(g[0]),m.entryPoints.delete(g[1]),m.ports.size===0?this.mPathArea.delete(l):this.mPathArea.set(l,m))}this.mGridPaths.delete(t)}};var je=class{mGridElement;mManager;mPathFinder;set gridElement(t){this.mGridElement=t}constructor(t){this.mManager=t,this.mGridElement=null,this.mPathFinder=new ze,this.mManager.subscribe(F.Node|F.SpecialActiveFunction,null,e=>{if((e.changeType&F.SpecialActiveFunction)>0){if(!this.mManager.activeFunction)return;this.mPathFinder.clear("all");for(let o of this.mManager.activeFunction.nodes)this.mPathFinder.updateNodeArea(o);this.updatePaths();return}(e.changeType&F.Node)>0&&((e.changeType&F.NodeDelete)>0?this.mPathFinder.removeNodeArea(e.item):this.mPathFinder.updateNodeArea(e.item)),this.updatePaths()}),this.mManager.subscribe(F.Connection,null,()=>{this.updatePaths()})}createTemporaryPath(t,e){let o=y=>y instanceof it?this.getPortGridPoint(y):y,l=o(t),m=o(e),g=this.mPathFinder.start(l,m).path;return this.createSvgPath(g)}getConnectionPath(t,e){let o=this.mPathFinder.getPath(t,e);return this.createSvgPath(o)}getPortGridPoint(t){let e=t.node,o=t.direction==="input"?e.inputs.list:e.outputs.list,l=(()=>{let g=0;for(;g<o.length&&o[g]!==t;g++);return g})(),m=t.direction==="input"?e.transformation.x:e.transformation.x+e.transformation.width-1;return{y:e.transformation.y+1+l,x:m}}pixelToGridSpace(t,e){let o=t,l=e;if(this.mGridElement){let m=this.mGridElement.getBoundingClientRect();o-=m.left,l-=m.top}return o-=this.mManager.grid.panX,l-=this.mManager.grid.panY,o/=this.mManager.grid.zoom,l/=this.mManager.grid.zoom,{x:Math.floor(o/this.mManager.grid.gridSize),y:Math.floor(l/this.mManager.grid.gridSize)}}createGridCellPath(t,e,o){let l=this.getGridPosition(t,e),m=this.getGridPosition(t,o),g={x:e==="bottom"||e==="top"?l.x:m.x,y:e==="left"||e==="right"?l.y:m.y};return`M ${l.x},${l.y} Q ${g.x},${g.y} ${m.x},${m.y}`}createPath(t,e){let[o,l]=t.direction==="input"&&t.portType==="value"||t.direction==="output"&&t.portType==="flow"?[t,e]:[e,t],m=this.getPortGridPoint(o),g=this.getPortGridPoint(l);this.mPathFinder.updatePath(o,m,g)}createSvgPath(t){let e=(l,m)=>{let g=m.x-l.x,y=m.y-l.y;switch(!0){case(g===0&&y===1):return"bottom";case(g===0&&y===-1):return"top";case(g===-1&&y===0):return"left";case(g===1&&y===0):return"right";default:throw new A("Missformed path. Path points are not directly next to each other.",this)}},o="";for(let l=1;l<t.length-1;l++){let m=t[l],g=t[l-1],y=t[l+1],D=e(m,g),S=e(m,y);o+=this.createGridCellPath(m,D,S)}return o}getGridPosition(t,e){let o={x:t.x*this.mManager.grid.gridSize+this.mManager.grid.gridSize/2,y:t.y*this.mManager.grid.gridSize+this.mManager.grid.gridSize/2},l=this.mManager.grid.gridSize/2;switch(e){case"top":o.y-=l;break;case"right":o.x+=l;break;case"bottom":o.y+=l;break;case"left":o.x-=l;break}return o}updatePaths(){this.mPathFinder.clear("path");let t=this.mManager.activeFunction;if(t)for(let e of t.nodes){for(let o of e.outputs.flow){let l=o.connectedPorts.values().next().value;l&&this.createPath(o,l)}for(let o of e.inputs.value){let l=o.connectedPorts.values().next().value;l&&this.createPath(o,l)}}}};var Ve=class{mDocument;mManager;get document(){return this.mDocument}constructor(t){this.mManager=t,this.mDocument=null}addFunction(t){let e=this.mDocument,o=this.mManager.project;if(!e||!o||!o.userFunctions.has(t))return;let l=new pt(o,e,{definitionId:t,id:crypto.randomUUID(),isSystem:!1,label:`Function ${e.functions.size}`});e.addFunction(l),e.validate(),this.mManager.dispatch(F.FunctionAdd,l),this.mManager.setActiveFunction(l.id)}addNode(t,e,o){let l=t.addNodeByDefinition(e,o);return this.mManager.dispatch(F.NodeAdd,l),l}connectPorts(t,e){try{t.connect(e)}catch{return!1}return this.mManager.dispatch(F.ConnectionAdd,t),this.mManager.dispatch(F.ConnectionAdd,e),!0}disconnectPorts(t,e){t.disconnect(e),this.mManager.dispatch(F.ConnectionDelete,t),this.mManager.dispatch(F.ConnectionDelete,e)}removeFunction(t){let e=this.mDocument;if(!e)return;let o=null;for(let l of e.functions)if(l.id===t){o=l,e.removeFunction(l);break}o&&(this.mManager.dispatch(F.FunctionDelete,o),this.setDefaultActiveFunction())}removeNode(t){t.function.removeNode(t),this.mManager.dispatch(F.NodeDelete,t)}setDocument(t){this.mDocument=t,this.mDocument.validate(),this.mManager.dispatch(F.Document,this.mDocument),this.setDefaultActiveFunction()}setPortDirectValue(t,e){t.setDirectValue(e),this.mManager.dispatch(F.NodeUpdate,t.node)}transformNode(t,e){let o={x:t.transformation.x,y:t.transformation.y,width:t.transformation.width,height:t.transformation.height,...e};t.moveTo(o.x,o.y),t.resizeTo(o.width,o.height),this.mManager.dispatch(F.NodeTransform,t)}updateNode(t,e){t&&(e(t),this.mManager.dispatch(F.NodeUpdate,t))}setDefaultActiveFunction(){if(!this.mDocument||this.mDocument.functions.size===0)return;let t=(()=>{let e=[...this.mDocument.functions];return e.some(l=>l.id===this.mManager.activeFunctionId)?this.mManager.activeFunctionId:e[0].id})();this.mManager.activeFunctionId!==t&&this.mManager.setActiveFunction(t)}};var $e=class f{static GRID_SIZE=25;static MAX_ZOOM=2;static MIN_ZOOM=.25;mPanX;mPanY;mZoom;get gridSize(){return f.GRID_SIZE}get panX(){return this.mPanX}get panY(){return this.mPanY}get zoom(){return this.mZoom}constructor(){this.mPanX=0,this.mPanY=0,this.mZoom=1}getGridBackgroundCss(){let t=f.GRID_SIZE*this.mZoom,e=this.mPanX%t,o=this.mPanY%t;return[`background-size: ${t}px ${t}px`,`background-position: ${e}px ${o}px`,'background-image: url("data:image/svg+xml,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 viewBox%3D%220 0 100 100%22%3E%3Cpath d%3D%22M0 0h18M0 0v18M100 0H82M100 0v18M0 100h18M0 100V82M100 100H82M100 100V82%22 stroke%3D%22%23313244%22 stroke-width%3D%225%22 stroke-linecap%3D%22round%22%2F%3E%3C%2Fsvg%3E")'].join("; ")}getTransformCss(){return`translate(${this.mPanX}px, ${this.mPanY}px) scale(${this.mZoom})`}pan(t,e){this.mPanX+=t,this.mPanY+=e}screenToWorld(t,e){return{x:(t-this.mPanX)/this.mZoom,y:(e-this.mPanY)/this.mZoom}}snapToGrid(t,e){return{x:Math.round(t/f.GRID_SIZE)*f.GRID_SIZE,y:Math.round(e/f.GRID_SIZE)*f.GRID_SIZE}}zoomAt(t,e,o){let l=this.mZoom,m=1+o,g=this.mZoom*m;g=Math.max(f.MIN_ZOOM,Math.min(f.MAX_ZOOM,g));let y=(t-this.mPanX)/l,D=(e-this.mPanY)/l;this.mZoom=g,this.mPanX=t-y*this.mZoom,this.mPanY=e-D*this.mZoom}};var Ge=class f{static MAX_HISTORY_ITEMS=100;mManager;mSnapshotIndex;mSnapshots;get canRedo(){return this.mSnapshotIndex<this.mSnapshots.length-1}get canUndo(){return this.mSnapshotIndex>0}constructor(t){this.mManager=t,this.mSnapshotIndex=-1,this.mSnapshots=new Array;let e=0;this.mManager.subscribe(F.Any,null,()=>{globalThis.clearTimeout(e),e=globalThis.setTimeout(()=>{this.pushHistory()},1e3)})}clear(){this.mSnapshots.length=0,this.mSnapshotIndex=-1}redo(){if(!this.canRedo)return;let t=this.mSnapshots[++this.mSnapshotIndex],e=JSON.parse(t);this.restoreHistory(e)}undo(){if(!this.canUndo)return;let t=this.mSnapshots[--this.mSnapshotIndex],e=JSON.parse(t);this.restoreHistory(e)}pushHistory(){let t=this.mManager.graph.document;if(!t)return;this.mSnapshots.splice(this.mSnapshotIndex+1);let e=new Kt().serialize(t),o=JSON.stringify(e);this.mSnapshots.length>0&&this.mSnapshots.at(-1)===o||(this.mSnapshotIndex=this.mSnapshots.push(o)-1,this.mSnapshots.length>f.MAX_HISTORY_ITEMS&&(this.mSnapshots.shift(),this.mSnapshotIndex--))}restoreHistory(t){let e=this.mManager.project;e&&this.mManager.graph.setDocument(new Jt(e).deserialize(t))}};var Be=class{mErrorItems;mErrorList;mIsDirty;mManager;get errorItems(){return this.mIsDirty&&this.revalidate(),this.mErrorItems}get errors(){return this.mIsDirty&&this.revalidate(),this.mErrorList}get isValid(){return this.mIsDirty&&this.revalidate(),this.mErrorItems.size===0}constructor(t){this.mManager=t,this.mErrorList=new Array,this.mErrorItems=new Set,this.mIsDirty=!0;let e=0;this.mManager.subscribe(F.Any,null,()=>{this.mIsDirty=!0,globalThis.clearTimeout(e),e=globalThis.setTimeout(()=>{this.mIsDirty&&(this.revalidate(),this.mIsDirty=!1)},1e3)})}revalidate(){if(!this.mManager.graph.document)return;this.mErrorList.splice(0,this.mErrorList.length),this.mErrorItems.clear();let t=this.mManager.graph.document.validate();for(let e of t.errors)switch(this.mErrorItems.add(e.item),!0){case e.item instanceof it:{this.mErrorList.push({location:`Node "${e.item.node.label}"`,message:e.message});break}case e.item instanceof vt:{this.mErrorList.push({location:`Node "${e.item.label}"`,message:e.message});break}}for(let e of t.affectedItems)switch(!0){case e instanceof it:{this.mManager.dispatch(F.PortAdd|F.PortUpdate,e);break}case e instanceof vt:{this.mManager.dispatch(F.NodeAdd|F.NodeUpdate|F.NodeTransform,e);break}case e instanceof pt:{this.mManager.dispatch(F.FunctionAdd|F.FunctionUpdate,e);break}}}};var Ue=class{mDriverActivity;mDriverElements;mDriverList;mDrivers;mElementDriver;mManager;mPreviewIntersection;constructor(t){this.mManager=t,this.mDriverList=new Array,this.mDrivers=new WeakMap,this.mDriverActivity=new WeakMap,this.mDriverElements=new WeakMap,this.mElementDriver=new WeakMap,this.mManager.subscribe(F.Document,null,()=>{this.mDriverList.splice(0,this.mDriverList.length)});let e=0,o=F.Connection|F.Function|F.Node;this.mManager.subscribe(o,null,()=>{globalThis.clearTimeout(e),e=globalThis.setTimeout(()=>this.refresh(),1e3)}),this.mPreviewIntersection=new IntersectionObserver(l=>{for(let m of l){let g=this.mElementDriver.get(m.target);if(!g)continue;let y=g.deref();y&&this.mDriverActivity.set(y,m.isIntersecting)}})}async execute(){let t=this.mDriverList.map(async e=>{let o=e.deref();if(o&&this.mDriverActivity.get(o))try{await o.execute()}catch(l){console.error("[PotatnoUiManagerPreview] Driver render failed:",l)}});await Promise.all(t)}refresh(){if(this.mManager.integrity.isValid)for(let t=this.mDriverList.length-1;t>=0;t--){let e=this.mDriverList[t].deref();if(!e){this.unregister(this.mDriverList[t]);continue}e.refresh()}}requestDriver(t,e){let o=this.mDrivers.get(t);if(o&&o.display.id===e)return o;if(!this.mManager.project)return null;let l=this.mManager.project.preview.getDisplay(e);if(!l)throw new A(`Preview has no display for "${e}".`,this);let m=l.createDriver(t);return this.register(t,m),this.mManager.integrity.isValid&&m.refresh(),m}register(t,e){this.mDrivers.set(t,e);let o=new WeakRef(e);this.mDriverList.push(o);let l=e.element;this.mDriverElements.set(o,l),this.mElementDriver.set(l,o),this.mPreviewIntersection.observe(l)}unregister(t){let e=this.mDriverList.indexOf(t);if(e===-1)return;this.mDriverList.splice(e,1);let o=this.mDriverElements.get(t);o&&this.mPreviewIntersection.unobserve(o)}};function Ki(){function f(c,n){return function(a){e(n,"addInitializer"),o(a,"An initializer"),c.push(a)}}function t(c,n,u,a,r,b,v,T,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+n:n,static:b,private:v,metadata:T},d={v:!1};s.addInitializer=f(a,d);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return c(w,s)}finally{d.v=!0}}function e(c,n){if(c.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(c,n){if(typeof c!="function")throw new TypeError(n+" must be a function")}function l(c,n){var u=typeof n;if(c===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var a;throw c===0?a="field":c===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function m(c,n,u,a,r,b,v,T,w){var p=u[0],s,d,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,C;if(typeof p=="function")h=t(p,a,s,T,r,b,v,w,i),h!==void 0&&(l(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h);else for(var P=p.length-1;P>=0;P--){var M=p[P];if(h=t(M,a,s,T,r,b,v,w,i),h!==void 0){l(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(I,E){return E};else if(typeof d!="function"){var _=d;d=function(I,E){for(var L=E,R=0;R<_.length;R++)L=_[R].call(I,L);return L}}else{var j=d;d=function(I,E){return j.call(I,E)}}c.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(c.push(function(I,E){return i.get.call(I,E)}),c.push(function(I,E){return i.set.call(I,E)})):r===2?c.push(i):c.push(function(I,E){return i.call(I,E)}):Object.defineProperty(n,a,s))}function g(c,n,u){for(var a=[],r,b,v=new Map,T=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,C;if(h?(x=c,s=s-5,b=b||[],C=b):(x=c.prototype,r=r||[],C=r),s!==0&&!i){var P=h?T:v,M=P.get(d)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!M&&s>2?P.set(d,s):P.set(d,!0)}m(a,x,p,d,s,h,i,C,u)}}return y(a,r),y(a,b),a}function y(c,n){n&&c.push(function(u){for(var a=0;a<n.length;a++)n[a].call(u);return u})}function D(c,n,u){if(n.length>0){for(var a=[],r=c,b=c.name,v=n.length-1;v>=0;v--){var T={v:!1};try{var w=n[v](r,{kind:"class",name:b,addInitializer:f(a,T),metadata:u})}finally{T.v=!0}w!==void 0&&(l(10,w),r=w)}return[S(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function S(c,n){return Object.defineProperty(c,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,a,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),T=g(n,u,v);return a.length||S(n,v),{e:T,get c(){return D(n,a,v)}}}}function fo(f,t,e,o){return(fo=Ki())(f,t,e,o)}var po,uo,ho,K;po=O.injectable("singleton");var mo=class extends(ho=EventTarget){static{({c:[K,uo]}=fo(this,[],[po],ho))}constructor(){super(),this.mClipboard=new _e(this),this.mIntegrity=new Be(this),this.mConnections=new je(this),this.mGraph=new Ve(this),this.mHistory=new Ge(this),this.mPreview=new Ue(this),this.mGrid=new $e,this.mActiveFunctionId="",this.mProject=null,this.mEventBuffer=new Map,this.mEventBufferDispatchRequest=-1}mActiveFunctionId;mClipboard;mConnections;mEventBuffer;mEventBufferDispatchRequest;mGraph;mGrid;mHistory;mIntegrity;mPreview;mProject;get activeFunction(){let t=this.mGraph.document;if(!t)return null;for(let e of t.functions)if(e.id===this.mActiveFunctionId)return e;return null}get activeFunctionId(){return this.mActiveFunctionId}get clipboard(){return this.mClipboard}get connections(){return this.mConnections}get graph(){return this.mGraph}get grid(){return this.mGrid}get history(){return this.mHistory}get integrity(){return this.mIntegrity}get preview(){return this.mPreview}get project(){return this.mProject}dispatch(t,e){let o=this.mEventBuffer.get(e)??0;this.mEventBuffer.set(e,o|t),this.mEventBufferDispatchRequest!==-1&&globalThis.cancelAnimationFrame(this.mEventBufferDispatchRequest),this.mEventBufferDispatchRequest=requestAnimationFrame(()=>{this.mEventBufferDispatchRequest=-1;for(let[l,m]of this.mEventBuffer)this.dispatchEvent(new we(m,l));this.mEventBuffer.clear()})}generateStringColor(t){let e=(()=>{let l=0;for(let m=0;m<t.length;m++)l=t.charCodeAt(m)+((l<<5)-l);return l})();return`hsl(${Math.abs(e)*137.508%360}, 70%, 60%)`}initialize(t,e){this.mProject=t,this.mGraph.setDocument(e)}setActiveFunction(t){let e=this.mGraph.document;if(!(!e||this.mActiveFunctionId===t)){for(let o of e.functions)if(o.id===t){this.mActiveFunctionId=t,this.dispatch(F.SpecialActiveFunction,o);return}}}subscribe(t,e,o){let l=g=>{if(!e)return!0;let y=g;for(;y!==null;){if(e.has(y))return!0;switch(!0){case y instanceof it:{y=y.node;break}case y instanceof vt:{y=y.function;break}case y instanceof pt:{y=y.document;break}default:y=null}}return!1},m=g=>{t!==F.Any&&(g.changeType&t)===0||e!==null&&!l(g.item)||o(g)};return this.addEventListener(we.EVENT_TYPE,m),()=>{this.removeEventListener(we.EVENT_TYPE,m)}}updateFunctionProperties(t){let e=this.activeFunction;if(!e)return;let l=e.project.getFunction(e.definitionId)?.statics??nt.imports|nt.inputs|nt.outputs;if(t.name!==void 0&&(e.label=t.name),t.inputs!==void 0&&(l&nt.inputs)===0){for(let m of[...e.inputs])e.removeInput(m);for(let m of t.inputs)e.addInput({dataType:m.type,label:m.name})}if(t.outputs!==void 0&&(l&nt.outputs)===0){for(let m of[...e.outputs])e.removeOutput(m);for(let m of t.outputs)e.addOutput({dataType:m.type,label:m.name})}if(t.imports!==void 0&&(l&nt.imports)===0){let m=new Set(e.imports),g=new Set(t.imports);for(let y of[...e.imports])g.has(y)||e.removeImport(y);for(let y of t.imports)m.has(y)||e.addImport(y)}this.dispatch(F.FunctionUpdate,e)}static{uo()}},F={Any:16777215,Connection:15,ConnectionAdd:1,ConnectionUpdate:2,ConnectionDelete:4,Document:240,Function:3840,FunctionAdd:256,FunctionUpdate:512,FunctionDelete:1024,Node:61440,NodeAdd:4096,NodeUpdate:8192,NodeDelete:16384,NodeTransform:32768,Port:983040,PortAdd:65536,PortUpdate:131072,PortDelete:262144,Special:15728640,SpecialActiveFunction:1048576},we=class f extends Event{static EVENT_TYPE="PotatnoUiManagerChangeEvent";mChangeType;mEventItem;get changeType(){return this.mChangeType}get item(){return this.mEventItem}constructor(t,e){super(f.EVENT_TYPE),this.mChangeType=t,this.mEventItem=e}};var go=`:host {\r
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
\r
    /* Preview should never overflow the graph window. Dont know why exactly that numbers but they are right. */\r
    max-width: 98%;\r
    max-height: 98%;\r
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
}`;var vo=`<div class="editor-layout">
    <div #panelLeft class="panel-left">
        <potatno-function-list></potatno-function-list>
    </div>
    <div #resizeLeft class="resize-handle-left"
        (pointerdown)="this.onResizeLeftStart($event)">
    </div>
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
`;var bo=`<div class="function-list-content">\r
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
`;function rs(){function f(c,n){return function(a){e(n,"addInitializer"),o(a,"An initializer"),c.push(a)}}function t(c,n,u,a,r,b,v,T,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+n:n,static:b,private:v,metadata:T},d={v:!1};s.addInitializer=f(a,d);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return c(w,s)}finally{d.v=!0}}function e(c,n){if(c.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(c,n){if(typeof c!="function")throw new TypeError(n+" must be a function")}function l(c,n){var u=typeof n;if(c===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var a;throw c===0?a="field":c===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function m(c,n,u,a,r,b,v,T,w){var p=u[0],s,d,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,C;if(typeof p=="function")h=t(p,a,s,T,r,b,v,w,i),h!==void 0&&(l(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h);else for(var P=p.length-1;P>=0;P--){var M=p[P];if(h=t(M,a,s,T,r,b,v,w,i),h!==void 0){l(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(I,E){return E};else if(typeof d!="function"){var _=d;d=function(I,E){for(var L=E,R=0;R<_.length;R++)L=_[R].call(I,L);return L}}else{var j=d;d=function(I,E){return j.call(I,E)}}c.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(c.push(function(I,E){return i.get.call(I,E)}),c.push(function(I,E){return i.set.call(I,E)})):r===2?c.push(i):c.push(function(I,E){return i.call(I,E)}):Object.defineProperty(n,a,s))}function g(c,n,u){for(var a=[],r,b,v=new Map,T=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,C;if(h?(x=c,s=s-5,b=b||[],C=b):(x=c.prototype,r=r||[],C=r),s!==0&&!i){var P=h?T:v,M=P.get(d)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!M&&s>2?P.set(d,s):P.set(d,!0)}m(a,x,p,d,s,h,i,C,u)}}return y(a,r),y(a,b),a}function y(c,n){n&&c.push(function(u){for(var a=0;a<n.length;a++)n[a].call(u);return u})}function D(c,n,u){if(n.length>0){for(var a=[],r=c,b=c.name,v=n.length-1;v>=0;v--){var T={v:!1};try{var w=n[v](r,{kind:"class",name:b,addInitializer:f(a,T),metadata:u})}finally{T.v=!0}w!==void 0&&(l(10,w),r=w)}return[S(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function S(c,n){return Object.defineProperty(c,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,a,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),T=g(n,u,v);return a.length||S(n,v),{e:T,get c(){return D(n,a,v)}}}}function Eo(f,t,e,o){return(Eo=rs())(f,t,e,o)}var Io,wo,So,xo,To,os;Io=W({selector:"potatno-function-list",template:bo,style:yo}),So=H.state();var Do=class{static{({e:[xo,To],c:[os,wo]}=Eo(this,[[So,1,"mShowPopup"]],[Io]))}constructor(t=O.use($),e=O.use(K)){this.mComponent=t,this.mManager=e,this.mUnsubscribe=null}mComponent;mManager;mUnsubscribe;#t=(To(this),xo(this,!1));get mShowPopup(){return this.#t}set mShowPopup(t){this.#t=t}get activeFunctionId(){return this.mManager.activeFunctionId}get functions(){let t=this.mManager.graph.document;if(!t)return[];let e=[];for(let o of t.functions)e.push({id:o.id,label:o.label,name:o.label,system:o.isSystem});return e}get hasUserFunctionDefinitions(){return this.userFunctionDefinitions.length>0}get showPopup(){return this.mShowPopup}get userFunctionDefinitions(){let t=this.mManager.project;return t?[...t.userFunctions.values()].map(e=>({id:e.id})):[]}closePopup(){this.mShowPopup=!1}getEntryClass(t){return t===this.activeFunctionId?"function-entry active":"function-entry"}onConnect(){this.mUnsubscribe=this.mManager.subscribe(F.Document|F.Function|F.SpecialActiveFunction,null,()=>{this.mComponent.updater.updateAsync()})}onDeconstruct(){this.mUnsubscribe?.(),this.mUnsubscribe=null}onAddButtonClick(){let t=this.userFunctionDefinitions;t.length===1?this.mManager.graph.addFunction(t[0].id):this.mShowPopup=!this.mShowPopup}onDefinitionSelect(t){this.mShowPopup=!1,this.mManager.graph.addFunction(t)}onFunctionDelete(t,e){t.stopPropagation(),this.mManager.graph.removeFunction(e)}onFunctionSelect(t){this.mManager.setActiveFunction(t)}static{wo()}};var Co=`:host {
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
`;var Po=`<div class="add-node-popup" (pointerdown)="this.stopPropagation($event)" (wheel)="this.stopPropagation($event)" (contextmenu)="this.stopPropagation($event)">
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
`;function ss(){function f(c,n){return function(a){e(n,"addInitializer"),o(a,"An initializer"),c.push(a)}}function t(c,n,u,a,r,b,v,T,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+n:n,static:b,private:v,metadata:T},d={v:!1};s.addInitializer=f(a,d);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return c(w,s)}finally{d.v=!0}}function e(c,n){if(c.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(c,n){if(typeof c!="function")throw new TypeError(n+" must be a function")}function l(c,n){var u=typeof n;if(c===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var a;throw c===0?a="field":c===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function m(c,n,u,a,r,b,v,T,w){var p=u[0],s,d,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,C;if(typeof p=="function")h=t(p,a,s,T,r,b,v,w,i),h!==void 0&&(l(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h);else for(var P=p.length-1;P>=0;P--){var M=p[P];if(h=t(M,a,s,T,r,b,v,w,i),h!==void 0){l(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(I,E){return E};else if(typeof d!="function"){var _=d;d=function(I,E){for(var L=E,R=0;R<_.length;R++)L=_[R].call(I,L);return L}}else{var j=d;d=function(I,E){return j.call(I,E)}}c.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(c.push(function(I,E){return i.get.call(I,E)}),c.push(function(I,E){return i.set.call(I,E)})):r===2?c.push(i):c.push(function(I,E){return i.call(I,E)}):Object.defineProperty(n,a,s))}function g(c,n,u){for(var a=[],r,b,v=new Map,T=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,C;if(h?(x=c,s=s-5,b=b||[],C=b):(x=c.prototype,r=r||[],C=r),s!==0&&!i){var P=h?T:v,M=P.get(d)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!M&&s>2?P.set(d,s):P.set(d,!0)}m(a,x,p,d,s,h,i,C,u)}}return y(a,r),y(a,b),a}function y(c,n){n&&c.push(function(u){for(var a=0;a<n.length;a++)n[a].call(u);return u})}function D(c,n,u){if(n.length>0){for(var a=[],r=c,b=c.name,v=n.length-1;v>=0;v--){var T={v:!1};try{var w=n[v](r,{kind:"class",name:b,addInitializer:f(a,T),metadata:u})}finally{T.v=!0}w!==void 0&&(l(10,w),r=w)}return[S(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function S(c,n){return Object.defineProperty(c,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,a,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),T=g(n,u,v);return a.length||S(n,v),{e:T,get c(){return D(n,a,v)}}}}function zo(f,t,e,o){return(zo=ss())(f,t,e,o)}var jo,Mo,Vo,$o,Go,Bo,Uo,No,Ao,Lo,Ro,Oo,Fo,ur;jo=W({selector:"potatno-node-selection-popup",template:Po,style:Co}),Vo=H.state({complexValue:!0}),$o=ft("searchInput"),Go=qt("node-select"),Bo=H.state(),Uo=H.state();var _o=class{static{({e:[No,Ao,Lo,Ro,Oo,Fo],c:[ur,Mo]}=zo(this,[[Vo,1,"results"],[$o,1,"searchInput"],[Go,1,"mNodeSelect"],[Bo,1,"searchValue"],[Uo,1,"selectedDefinitionId"]],[jo]))}constructor(t=O.use(K)){this.mManager=t,this.selectedDefinitionId=null,this.results=new Array,this.searchValue=""}mManager;#t=(Fo(this),No(this));get results(){return this.#t}set results(t){this.#t=t}#e=Ao(this);get searchInput(){return this.#e}set searchInput(t){this.#e=t}#r=Lo(this);get mNodeSelect(){return this.#r}set mNodeSelect(t){this.#r=t}#o=Ro(this);get searchValue(){return this.#o}set searchValue(t){this.#o=t}#n=Oo(this);get selectedDefinitionId(){return this.#n}set selectedDefinitionId(t){this.#n=t}onConnect(){this.searchInput.focus()}onKeyDown(t){if(this.results.length!==0){if(t.key==="ArrowDown"||t.key==="ArrowUp"){t.preventDefault();let e=this.results.findIndex(m=>m.definition.id===this.selectedDefinitionId);e=Math.max(0,e);let o=t.key==="ArrowDown"?1:-1,l=(e+o+this.results.length)%this.results.length;this.selectedDefinitionId=this.results[l].definition.id;return}t.key==="Enter"&&this.sendSelectedEntry(this.selectedDefinitionId)}}onUpdate(){this.rebuildResults()}stopPropagation(t){t.stopPropagation()}rebuildResults(){if(!this.mManager.activeFunction){this.results=new Array;return}let t=this.mManager.activeFunction.dynamicNodeDefinitions.map(o=>({category:o.category.name,definition:o,label:o.label.toLowerCase(),color:this.mManager.generateStringColor(o.category.name),icon:o.category.icon})),e=this.searchValue.trim().toLowerCase();this.results=t.filter(o=>o.label.includes(e)),this.results.some(o=>o.definition.id===this.selectedDefinitionId)||(this.selectedDefinitionId=this.results[0]?.definition.id??null)}sendSelectedEntry(t){if(t===null)return;let e=this.results.find(o=>o.definition.id===t);e&&this.mNodeSelect.dispatchEvent(e.definition)}static{Mo()}};var Ho=`:host {\r
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
`;var Xo=`<svg #svgLayer class="svg-layer" xmlns="http://www.w3.org/2000/svg" (contextmenu)="this.onConnectionDelete($event)"></svg>
`;function cs(){function f(c,n){return function(a){e(n,"addInitializer"),o(a,"An initializer"),c.push(a)}}function t(c,n,u,a,r,b,v,T,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+n:n,static:b,private:v,metadata:T},d={v:!1};s.addInitializer=f(a,d);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return c(w,s)}finally{d.v=!0}}function e(c,n){if(c.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(c,n){if(typeof c!="function")throw new TypeError(n+" must be a function")}function l(c,n){var u=typeof n;if(c===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var a;throw c===0?a="field":c===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function m(c,n,u,a,r,b,v,T,w){var p=u[0],s,d,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,C;if(typeof p=="function")h=t(p,a,s,T,r,b,v,w,i),h!==void 0&&(l(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h);else for(var P=p.length-1;P>=0;P--){var M=p[P];if(h=t(M,a,s,T,r,b,v,w,i),h!==void 0){l(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(I,E){return E};else if(typeof d!="function"){var _=d;d=function(I,E){for(var L=E,R=0;R<_.length;R++)L=_[R].call(I,L);return L}}else{var j=d;d=function(I,E){return j.call(I,E)}}c.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(c.push(function(I,E){return i.get.call(I,E)}),c.push(function(I,E){return i.set.call(I,E)})):r===2?c.push(i):c.push(function(I,E){return i.call(I,E)}):Object.defineProperty(n,a,s))}function g(c,n,u){for(var a=[],r,b,v=new Map,T=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,C;if(h?(x=c,s=s-5,b=b||[],C=b):(x=c.prototype,r=r||[],C=r),s!==0&&!i){var P=h?T:v,M=P.get(d)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!M&&s>2?P.set(d,s):P.set(d,!0)}m(a,x,p,d,s,h,i,C,u)}}return y(a,r),y(a,b),a}function y(c,n){n&&c.push(function(u){for(var a=0;a<n.length;a++)n[a].call(u);return u})}function D(c,n,u){if(n.length>0){for(var a=[],r=c,b=c.name,v=n.length-1;v>=0;v--){var T={v:!1};try{var w=n[v](r,{kind:"class",name:b,addInitializer:f(a,T),metadata:u})}finally{T.v=!0}w!==void 0&&(l(10,w),r=w)}return[S(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function S(c,n){return Object.defineProperty(c,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,a,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),T=g(n,u,v);return a.length||S(n,v),{e:T,get c(){return D(n,a,v)}}}}function Jo(f,t,e,o){return(Jo=cs())(f,t,e,o)}var Ko,Yo,Qo,Wo,Zo,hr;Ko=W({selector:"potatno-connection-layer",template:Xo,style:Ho}),Qo=ft("svgLayer");var qo=class{static{({e:[Wo,Zo],c:[hr,Yo]}=Jo(this,[[Qo,1,"svgLayer"]],[Ko]))}constructor(t=O.use(K)){this.mConnectionRegistry=new Map,this.mManager=t;let e=0;this.mUnsubscribe=this.mManager.subscribe(F.SpecialActiveFunction|F.Node|F.Connection,null,()=>{e===0&&(e=requestAnimationFrame(()=>{e=0,this.renderConnections()}))})}mConnectionRegistry;mManager;mUnsubscribe;#t=(Zo(this),Wo(this));get svgLayer(){return this.#t}set svgLayer(t){this.#t=t}onConnectionDelete(t){if(!(t.target instanceof Element))return;let e=parseInt(t.target.getAttribute("data-connection-id")??"");if(isNaN(e))return;t.preventDefault(),t.stopPropagation();let o=this.mConnectionRegistry.get(e);o&&this.mManager.graph.disconnectPorts(o.sourcePort,o.targetPort)}onDeconstruct(){this.mUnsubscribe()}renderConnectionPath(t,e,o,l,m){let g="http://www.w3.org/2000/svg",y=this.mManager.connections.getConnectionPath(o,l),D=document.createElementNS(g,"path");D.classList.add("path"),D.classList.toggle(".path--invalid",!m),D.setAttribute("d",y),o.portType==="value"&&D.style.setProperty("--path-color",this.mManager.generateStringColor(o.resolvedDataType));let S=document.createElementNS(g,"path");S.classList.add("path","path--mouse-target"),S.setAttribute("d",y),S.setAttribute("data-connection-id",e.toString()),t.appendChild(D),t.appendChild(S)}renderConnections(){this.svgLayer.innerHTML="",this.mConnectionRegistry.clear();let t=this.mManager.activeFunction;if(!t)return;let e=this.mManager.integrity.errorItems,o=0;for(let l of t.nodes)for(let m of l.outputs.list)for(let g of m.connectedPorts){let y=o++;this.mConnectionRegistry.set(y,{sourcePort:m,targetPort:g});let D=e.has(m)||e.has(g);this.renderConnectionPath(this.svgLayer,y,m,g,!D)}}static{Yo()}};function us(){function f(c,n){return function(a){e(n,"addInitializer"),o(a,"An initializer"),c.push(a)}}function t(c,n,u,a,r,b,v,T,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+n:n,static:b,private:v,metadata:T},d={v:!1};s.addInitializer=f(a,d);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return c(w,s)}finally{d.v=!0}}function e(c,n){if(c.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(c,n){if(typeof c!="function")throw new TypeError(n+" must be a function")}function l(c,n){var u=typeof n;if(c===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var a;throw c===0?a="field":c===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function m(c,n,u,a,r,b,v,T,w){var p=u[0],s,d,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,C;if(typeof p=="function")h=t(p,a,s,T,r,b,v,w,i),h!==void 0&&(l(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h);else for(var P=p.length-1;P>=0;P--){var M=p[P];if(h=t(M,a,s,T,r,b,v,w,i),h!==void 0){l(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(I,E){return E};else if(typeof d!="function"){var _=d;d=function(I,E){for(var L=E,R=0;R<_.length;R++)L=_[R].call(I,L);return L}}else{var j=d;d=function(I,E){return j.call(I,E)}}c.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(c.push(function(I,E){return i.get.call(I,E)}),c.push(function(I,E){return i.set.call(I,E)})):r===2?c.push(i):c.push(function(I,E){return i.call(I,E)}):Object.defineProperty(n,a,s))}function g(c,n,u){for(var a=[],r,b,v=new Map,T=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,C;if(h?(x=c,s=s-5,b=b||[],C=b):(x=c.prototype,r=r||[],C=r),s!==0&&!i){var P=h?T:v,M=P.get(d)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!M&&s>2?P.set(d,s):P.set(d,!0)}m(a,x,p,d,s,h,i,C,u)}}return y(a,r),y(a,b),a}function y(c,n){n&&c.push(function(u){for(var a=0;a<n.length;a++)n[a].call(u);return u})}function D(c,n,u){if(n.length>0){for(var a=[],r=c,b=c.name,v=n.length-1;v>=0;v--){var T={v:!1};try{var w=n[v](r,{kind:"class",name:b,addInitializer:f(a,T),metadata:u})}finally{T.v=!0}w!==void 0&&(l(10,w),r=w)}return[S(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function S(c,n){return Object.defineProperty(c,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,a,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),T=g(n,u,v);return a.length||S(n,v),{e:T,get c(){return D(n,a,v)}}}}function en(f,t,e,o){return(en=us())(f,t,e,o)}var rn,ko,xe;rn=wt({access:X.Read,selector:/^potatno-preview$/});var tn=class{static{({c:[xe,ko]}=en(this,[],[rn]))}constructor(t=O.use(q),e=O.use(U),o=O.use(rt)){this.mTarget=t,this.mProcedure=e.createExpressionProcedure(o.value)}mProcedure;mTarget;onUpdate(){let t=this.mProcedure.execute();if(!t){let o=this.mTarget.childNodes.length>0;return o&&(this.mTarget.innerHTML=""),o}let e=t.element;return this.mTarget.contains(e)?!1:(this.mTarget.innerHTML="",this.mTarget.appendChild(e),!0)}static{ko()}};(function(f){f.Function="function",f.Comment="comment",f.Input="input",f.Output="output",f.Reroute="reroute"})(kt||(kt={}));var kt;var on=`:host {\r
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
        color: var(--pn-text-primary);\r
        background: color-mix(in srgb, var(--potatno-port-color) 8%, var(--potatno-color-background));\r
        box-sizing: border-box;\r
        font-size: var(--pn-font-size-sm);\r
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
}`;var nn=`<div class="port-wrapper {{this.portDirection}}" style="--type-color: {{this.portColor}}" (dragover)="this.onDragOver($event)" (drop)="this.onDrop($event)">\r
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
`;function ms(){function f(c,n){return function(a){e(n,"addInitializer"),o(a,"An initializer"),c.push(a)}}function t(c,n,u,a,r,b,v,T,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+n:n,static:b,private:v,metadata:T},d={v:!1};s.addInitializer=f(a,d);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return c(w,s)}finally{d.v=!0}}function e(c,n){if(c.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(c,n){if(typeof c!="function")throw new TypeError(n+" must be a function")}function l(c,n){var u=typeof n;if(c===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var a;throw c===0?a="field":c===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function m(c,n,u,a,r,b,v,T,w){var p=u[0],s,d,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,C;if(typeof p=="function")h=t(p,a,s,T,r,b,v,w,i),h!==void 0&&(l(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h);else for(var P=p.length-1;P>=0;P--){var M=p[P];if(h=t(M,a,s,T,r,b,v,w,i),h!==void 0){l(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(I,E){return E};else if(typeof d!="function"){var _=d;d=function(I,E){for(var L=E,R=0;R<_.length;R++)L=_[R].call(I,L);return L}}else{var j=d;d=function(I,E){return j.call(I,E)}}c.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(c.push(function(I,E){return i.get.call(I,E)}),c.push(function(I,E){return i.set.call(I,E)})):r===2?c.push(i):c.push(function(I,E){return i.call(I,E)}):Object.defineProperty(n,a,s))}function g(c,n,u){for(var a=[],r,b,v=new Map,T=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,C;if(h?(x=c,s=s-5,b=b||[],C=b):(x=c.prototype,r=r||[],C=r),s!==0&&!i){var P=h?T:v,M=P.get(d)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!M&&s>2?P.set(d,s):P.set(d,!0)}m(a,x,p,d,s,h,i,C,u)}}return y(a,r),y(a,b),a}function y(c,n){n&&c.push(function(u){for(var a=0;a<n.length;a++)n[a].call(u);return u})}function D(c,n,u){if(n.length>0){for(var a=[],r=c,b=c.name,v=n.length-1;v>=0;v--){var T={v:!1};try{var w=n[v](r,{kind:"class",name:b,addInitializer:f(a,T),metadata:u})}finally{T.v=!0}w!==void 0&&(l(10,w),r=w)}return[S(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function S(c,n){return Object.defineProperty(c,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,a,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),T=g(n,u,v);return a.length||S(n,v),{e:T,get c(){return D(n,a,v)}}}}function cn(f,t,e,o){return(cn=ms())(f,t,e,o)}function fs(f){return f}var un,sn,hn,an,ln,He;un=W({selector:"potatno-port",template:nn,style:on}),hn=ft("dragConnection");new class extends fs{constructor(){super(He),sn()}static{class f{static{({e:[an,ln],c:[He,sn]}=cn(this,[[hn,1,"dragConnectionSvg"],[ot,3,"port"]],[un]))}static DRAG_MIME_TYPE="application/x-potatno-port";static mDraggedPortInformation;mComponent;mDragPositionEventHandler;mManager;mPort;mUnsubscribe;get dragPositionEventHandler(){return this.mDragPositionEventHandler}#t=(ln(this),an(this));get dragConnectionSvg(){return this.#t}set dragConnectionSvg(e){this.#t=e}get hasError(){return this.port===null?!1:this.mManager.integrity.errorItems.has(this.port)}get inputDefinitions(){if(!this.port)return new Array;let e=this.port.project.types.getType(this.port.resolvedDataType);return e.inputs.map((o,l)=>({htmlType:(()=>{switch(o.type){case"boolean":return"checkbox";case"number":return"number";case"string":return"text"}})(),index:l,name:o.name,value:this.port.directValue[l]??"",totalCount:e.inputs.length}))}get port(){return this.mPort}set port(e){if(this.mPort!==e){if(e===null)throw new A("A null port cant be assigned.",this);this.mPort=e,this.mComponent.updater.updateAsync()}}get portColor(){return!this.port||this.port.portType==="flow"?"var(--potatno-color-text)":this.mManager.generateStringColor(this.port.resolvedDataType)}get portDirection(){return this.port?.direction??"output"}get portHandleClasses(){if(!this.port)return"";let e=[this.port.portType];return this.port.connectedPorts.size>0&&e.push("connected"),this.hasError&&e.push("error"),e.join(" ")}get portName(){return this.port?.label??""}get portType(){return!this.port||this.port.portType!=="value"?"":this.port.resolvedDataType??""}get showValueInput(){return!this.port||this.port.portType!=="value"||this.port.direction!=="input"||this.port.connectedPorts.size>0||f.mDraggedPortInformation&&f.mDraggedPortInformation.port===this.port?!1:!this.port.node.project.types.isGenericType(this.port.dataType??"")}constructor(e=O.use($),o=O.use(K)){this.mComponent=e,this.mManager=o,this.mPort=null,this.mDragPositionEventHandler=l=>{f.mDraggedPortInformation&&f.mDraggedPortInformation.port===this.port&&(performance.now()-l.timeStamp>100||this.renderDragWire(l.clientX,l.clientY))},this.mUnsubscribe=this.mManager.subscribe(F.Connection,null,()=>{this.mComponent.updater.updateAsync()})}onConnect(){document.addEventListener("dragover",this.mDragPositionEventHandler,{capture:!0})}onDeconstruct(){this.mUnsubscribe(),document.removeEventListener("dragover",this.mDragPositionEventHandler,{capture:!0})}onDirectValueInput(e,o){if(!this.port)return;let l=e.target,m=[...this.port.directValue];m[o]=l.type==="checkbox"?l.checked?"true":"false":l.value,this.mManager.graph.setPortDirectValue(this.port,m)}onDragEnd(e){e.stopPropagation(),e.preventDefault(),this.dragConnectionSvg.innerHTML="",this.mComponent.updater.updateAsync()}onDragOver(e){this.draggedPortCanConnect(e.dataTransfer)&&(e.preventDefault(),e.stopPropagation(),e.dataTransfer&&(e.dataTransfer.dropEffect="link"))}onDragStart(e){if(!this.port||!e.dataTransfer){e.preventDefault();return}e.stopPropagation(),e.dataTransfer.effectAllowed="link",e.dataTransfer.setData(f.DRAG_MIME_TYPE,this.port.definitionId),e.dataTransfer.setDragImage(document.createElement("div"),0,0);let o=this.mManager.connections.getPortGridPoint(this.port);this.port.direction==="input"&&(o.x-=1),f.mDraggedPortInformation={port:this.port,portPosition:{x:o.x+1,y:o.y},lastPointerGridPosition:{x:0,y:0}},this.mComponent.updater.updateAsync()}onDrop(e){if(!this.draggedPortCanConnect(e.dataTransfer)||(e.preventDefault(),e.stopPropagation(),!f.mDraggedPortInformation)||!this.port)return;let o=f.mDraggedPortInformation.port;this.mManager.graph.connectPorts(o,this.port)}stopEventPropagation(e){e.stopPropagation()}createDragPath(e,o){if(!this.port)return"";let l=this.mManager.connections.pixelToGridSpace(e,o);return this.mManager.connections.createTemporaryPath(this.port,l)}draggedPortCanConnect(e){if(!this.port||!f.mDraggedPortInformation||!e||!e.types.includes(f.DRAG_MIME_TYPE))return!1;let o=f.mDraggedPortInformation.port;return o!==this.port&&o.direction!==this.port.direction&&o.portType===this.port.portType}renderDragWire(e,o){if(!f.mDraggedPortInformation)return;let l=this.dragConnectionSvg.firstChild;l||(l=document.createElementNS("http://www.w3.org/2000/svg","path"),this.dragConnectionSvg.appendChild(l));let m=this.mManager.connections.pixelToGridSpace(e,o);if(m.x===f.mDraggedPortInformation.lastPointerGridPosition.x&&m.y===f.mDraggedPortInformation.lastPointerGridPosition.y)return;f.mDraggedPortInformation.lastPointerGridPosition.x=m.x,f.mDraggedPortInformation.lastPointerGridPosition.y=m.y;let g=f.mDraggedPortInformation.portPosition,y=g.x*this.mManager.grid.gridSize,D=g.y*this.mManager.grid.gridSize;this.dragConnectionSvg.style.setProperty("transform",`translate(${-y}px, ${-D}px)`),l.setAttribute("d",this.createDragPath(e,o))}}}};var dn=`:host {\r
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
`;var mn=`$if(this.nodeData) {
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
`;function vs(){function f(c,n){return function(a){e(n,"addInitializer"),o(a,"An initializer"),c.push(a)}}function t(c,n,u,a,r,b,v,T,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+n:n,static:b,private:v,metadata:T},d={v:!1};s.addInitializer=f(a,d);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return c(w,s)}finally{d.v=!0}}function e(c,n){if(c.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(c,n){if(typeof c!="function")throw new TypeError(n+" must be a function")}function l(c,n){var u=typeof n;if(c===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var a;throw c===0?a="field":c===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function m(c,n,u,a,r,b,v,T,w){var p=u[0],s,d,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,C;if(typeof p=="function")h=t(p,a,s,T,r,b,v,w,i),h!==void 0&&(l(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h);else for(var P=p.length-1;P>=0;P--){var M=p[P];if(h=t(M,a,s,T,r,b,v,w,i),h!==void 0){l(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(I,E){return E};else if(typeof d!="function"){var _=d;d=function(I,E){for(var L=E,R=0;R<_.length;R++)L=_[R].call(I,L);return L}}else{var j=d;d=function(I,E){return j.call(I,E)}}c.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(c.push(function(I,E){return i.get.call(I,E)}),c.push(function(I,E){return i.set.call(I,E)})):r===2?c.push(i):c.push(function(I,E){return i.call(I,E)}):Object.defineProperty(n,a,s))}function g(c,n,u){for(var a=[],r,b,v=new Map,T=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,C;if(h?(x=c,s=s-5,b=b||[],C=b):(x=c.prototype,r=r||[],C=r),s!==0&&!i){var P=h?T:v,M=P.get(d)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!M&&s>2?P.set(d,s):P.set(d,!0)}m(a,x,p,d,s,h,i,C,u)}}return y(a,r),y(a,b),a}function y(c,n){n&&c.push(function(u){for(var a=0;a<n.length;a++)n[a].call(u);return u})}function D(c,n,u){if(n.length>0){for(var a=[],r=c,b=c.name,v=n.length-1;v>=0;v--){var T={v:!1};try{var w=n[v](r,{kind:"class",name:b,addInitializer:f(a,T),metadata:u})}finally{T.v=!0}w!==void 0&&(l(10,w),r=w)}return[S(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function S(c,n){return Object.defineProperty(c,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,a,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),T=g(n,u,v);return a.length||S(n,v),{e:T,get c(){return D(n,a,v)}}}}function wn(f,t,e,o){return(wn=vs())(f,t,e,o)}var xn,fn,Tn,Dn,En,pn,gn,vn,yn,dr;xn=W({selector:"potatno-node",template:mn,style:dn,modules:[xe],components:[He]}),Tn=H.state(),Dn=H.state(),En=qt("resize-start");var bn=class{static{({e:[pn,gn,vn,yn],c:[dr,fn]}=wn(this,[[[ot,Tn],1,"nodeData"],[[ot,Dn],1,"selected"],[En,1,"mResizeStart"]],[xn]))}constructor(t=O.use($),e=O.use(K)){this.mComponent=t,this.mManager=e,this.mUnsubscribe=null,this.mNodeDefinition=null}mComponent;mManager;mUnsubscribe;mNodeDefinition;#t=(yn(this),pn(this,null));get nodeData(){return this.#t}set nodeData(t){this.#t=t}#e=gn(this,!1);get selected(){return this.#e}set selected(t){this.#e=t}#r=vn(this);get mResizeStart(){return this.#r}set mResizeStart(t){this.#r=t}get selectedClass(){return this.selected?"selected":""}get hasErrorClass(){return this.nodeData!==null&&this.mManager.integrity.errorItems.has(this.nodeData)?"has-error":""}get isComment(){return this.nodeDefinition?.category.name===kt.Comment}get isReroute(){return this.nodeDefinition?.category.name===kt.Reroute}get isFunction(){return this.nodeDefinition?.category.name===kt.Function}get showOpenButton(){return this.isFunction}get canPreview(){return this.valueOutputPorts.length>0}get isPreviewActive(){return this.nodeData?.preview!==null}get previewEyeClass(){return this.isPreviewActive?"preview-eye-btn active":"preview-eye-btn"}get previewDisplays(){if(!this.nodeData)return[];let t=this.nodeData.project,e=t.getFunction(this.nodeData.function.definitionId);if(!e)return[];let o=this.nodeData.preview,l=o?this.nodeData.outputs.map.get(o.portId):void 0;if(l&&l.portType==="value")return this.createDisplayOptions(t,t.preview.availableDisplays(e,l.resolvedDataType));let m=new Set;for(let g of this.valueOutputPorts)for(let y of t.preview.availableDisplays(e,g.resolvedDataType))m.add(y);return this.createDisplayOptions(t,[...m])}get previewDriver(){let t=this.nodeData?.preview;if(!this.nodeData||!t)return null;let e=this.nodeData.outputs.map.get(t.portId);return e?this.mManager.preview.requestDriver(e,t.displayId):null}get valueOutputPorts(){return this.nodeData?[...this.nodeData.outputs.value]:[]}get selectedDisplayId(){return this.nodeData?.preview?.displayId??""}get previewNoneClass(){return this.isPreviewActive?"preview-port-item":"preview-port-item active"}get categoryColor(){return this.nodeData?this.mManager.generateStringColor(this.nodeDefinition?.category.name??""):""}get categoryIcon(){return this.nodeData?this.nodeDefinition?.category.icon??"":""}get nodeLabel(){return this.nodeData?.label??""}get nodeName(){if(!this.nodeData)return"";let t=this.nodeData;return t.project.nodeDefinitions.find(o=>o.id===t.definitionId)?.label??t.label}get nodeGridStyle(){let t=this.mManager.grid.gridSize;return`--pn-grid-size: ${t}px; --pn-grid-half-size: ${t/2}px; --pn-node-port-gap: ${t}px;`}get inputPorts(){return this.nodeData?this.nodeData.inputs.list:new Array}get outputPorts(){return this.nodeData?this.nodeData.outputs.list:new Array}get nodeDefinition(){if(!this.nodeData)return null;let t=this.nodeData;return(!this.mNodeDefinition||this.mNodeDefinition.id!==t.definitionId)&&(this.mNodeDefinition=t.project.nodeDefinitions.find(e=>e.id===t.definitionId)??null),this.mNodeDefinition}isPreviewedPort(t){return this.nodeData?.preview?.portId===t.definitionId}previewPortClass(t){return this.isPreviewedPort(t)?"preview-port-item active":"preview-port-item"}onConnect(){this.mUnsubscribe=this.mManager.subscribe(F.Function|F.SpecialActiveFunction|F.Node|F.Connection,null,()=>{this.mComponent.updater.updateAsync()})}onDeconstruct(){this.mUnsubscribe?.(),this.mUnsubscribe=null}onSelectPreviewPort(t,e){t.stopPropagation();let o=this.previewDisplaysForPort(e);this.mManager.graph.updateNode(this.nodeData,l=>{if(l.preview?.portId===e.definitionId){l.preview=null;return}let m=l.preview&&o.includes(l.preview.displayId)?l.preview.displayId:o[0];m&&(l.preview={portId:e.definitionId,displayId:m})})}previewDisplaysForPort(t){if(!this.nodeData)return[];let e=this.nodeData.project.getFunction(this.nodeData.function.definitionId);return e?this.nodeData.project.preview.availableDisplays(e,t.resolvedDataType):[]}onClearPreview(t){t.stopPropagation(),this.mManager.graph.updateNode(this.nodeData,e=>{e.preview=null})}onSelectPreviewStyle(t){t.stopPropagation();let e=t.target.value;this.mManager.graph.updateNode(this.nodeData,o=>{o.preview&&(o.preview={portId:o.preview.portId,displayId:e})})}createDisplayOptions(t,e){return e.map(o=>({id:o,label:t.preview.getDisplay(o)?.name??o}))}onOpenFunction(t){if(t.stopPropagation(),!this.nodeData)return;let e=this.nodeData.definitionId,o=e.startsWith("USERFUNCTION_")?e.slice(13):e;this.mManager.setActiveFunction(o)}onCommentInput(t){let e=t.target;this.mManager.graph.updateNode(this.nodeData,o=>{o.label=e.value})}onResizeStart(t){t.stopPropagation(),t.preventDefault(),this.nodeData&&this.mResizeStart.dispatchEvent({node:this.nodeData,startX:t.clientX,startY:t.clientY})}static{fn()}};var In=`:host {\r
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
`;var Sn=`<div #canvasWrapper class="canvas-wrapper" [style]="this.gridBackgroundStyle" (pointerdown)="this.onCanvasPointerDown($event)" (wheel)="this.onCanvasWheel($event)" (contextmenu)="this.onContextMenu($event)">\r
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
`;function ws(){function f(c,n){return function(a){e(n,"addInitializer"),o(a,"An initializer"),c.push(a)}}function t(c,n,u,a,r,b,v,T,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+n:n,static:b,private:v,metadata:T},d={v:!1};s.addInitializer=f(a,d);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return c(w,s)}finally{d.v=!0}}function e(c,n){if(c.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(c,n){if(typeof c!="function")throw new TypeError(n+" must be a function")}function l(c,n){var u=typeof n;if(c===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var a;throw c===0?a="field":c===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function m(c,n,u,a,r,b,v,T,w){var p=u[0],s,d,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,C;if(typeof p=="function")h=t(p,a,s,T,r,b,v,w,i),h!==void 0&&(l(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h);else for(var P=p.length-1;P>=0;P--){var M=p[P];if(h=t(M,a,s,T,r,b,v,w,i),h!==void 0){l(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(I,E){return E};else if(typeof d!="function"){var _=d;d=function(I,E){for(var L=E,R=0;R<_.length;R++)L=_[R].call(I,L);return L}}else{var j=d;d=function(I,E){return j.call(I,E)}}c.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(c.push(function(I,E){return i.get.call(I,E)}),c.push(function(I,E){return i.set.call(I,E)})):r===2?c.push(i):c.push(function(I,E){return i.call(I,E)}):Object.defineProperty(n,a,s))}function g(c,n,u){for(var a=[],r,b,v=new Map,T=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,C;if(h?(x=c,s=s-5,b=b||[],C=b):(x=c.prototype,r=r||[],C=r),s!==0&&!i){var P=h?T:v,M=P.get(d)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!M&&s>2?P.set(d,s):P.set(d,!0)}m(a,x,p,d,s,h,i,C,u)}}return y(a,r),y(a,b),a}function y(c,n){n&&c.push(function(u){for(var a=0;a<n.length;a++)n[a].call(u);return u})}function D(c,n,u){if(n.length>0){for(var a=[],r=c,b=c.name,v=n.length-1;v>=0;v--){var T={v:!1};try{var w=n[v](r,{kind:"class",name:b,addInitializer:f(a,T),metadata:u})}finally{T.v=!0}w!==void 0&&(l(10,w),r=w)}return[S(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function S(c,n){return Object.defineProperty(c,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,a,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),T=g(n,u,v);return a.length||S(n,v),{e:T,get c(){return D(n,a,v)}}}}function _n(f,t,e,o){return(_n=ws())(f,t,e,o)}var zn,Cn,jn,Vn,$n,Gn,Bn,Un,Pn,Mn,Nn,An,Ln,Rn,On,xs;zn=W({selector:"potatno-node-graph",template:Sn,style:In,components:[ur,dr,hr]}),jn=H.state({complexValue:!0}),Vn=H.state(),$n=H.state(),Gn=H.state({complexValue:!0}),Bn=H.state({complexValue:!0}),Un=ft("canvasWrapper");var Fn=class{static{({e:[Pn,Mn,Nn,An,Ln,Rn,On],c:[xs,Cn]}=_n(this,[[jn,1,"mCachedGraphData"],[Vn,1,"mTransformVersion"],[$n,1,"mShowSelectionBox"],[Gn,1,"mSelectionBoxScreen"],[Bn,1,"mAddNodePopup"],[Un,1,"canvasWrapper"]],[zn]))}constructor(t=O.use($),e=O.use(K)){this.mCachedGraphData={visibleNodes:[]},this.mComponent=t,this.mDocumentPointerMoveHandler=null,this.mDocumentPointerUpHandler=null,this.mInteractionState={mode:"idle"},this.mKeyboardHandler=null,this.mManager=e,this.mSelectedNodes=new Set,this.mUnsubscribe=null}mComponent;mManager;mSelectedNodes;mDocumentPointerMoveHandler;mDocumentPointerUpHandler;mInteractionState;mKeyboardHandler;mUnsubscribe;#t=(On(this),Pn(this));get mCachedGraphData(){return this.#t}set mCachedGraphData(t){this.#t=t}#e=Mn(this,0);get mTransformVersion(){return this.#e}set mTransformVersion(t){this.#e=t}#r=Nn(this,!1);get mShowSelectionBox(){return this.#r}set mShowSelectionBox(t){this.#r=t}#o=An(this,{x1:0,x2:0,y1:0,y2:0});get mSelectionBoxScreen(){return this.#o}set mSelectionBoxScreen(t){this.#o=t}#n=Ln(this,null);get mAddNodePopup(){return this.#n}set mAddNodePopup(t){this.#n=t}#i=Rn(this);get canvasWrapper(){return this.#i}set canvasWrapper(t){this.#i=t}get gridBackgroundStyle(){return this.mTransformVersion,this.mManager.grid.getGridBackgroundCss()}get gridTransformStyle(){return this.mTransformVersion,"transform: "+this.mManager.grid.getTransformCss()}get gridSize(){return this.mManager.grid.gridSize}get showSelectionBox(){return this.mShowSelectionBox}get selectionBoxStyle(){let t=Math.min(this.mSelectionBoxScreen.x1,this.mSelectionBoxScreen.x2),e=Math.min(this.mSelectionBoxScreen.y1,this.mSelectionBoxScreen.y2),o=Math.abs(this.mSelectionBoxScreen.x2-this.mSelectionBoxScreen.x1),l=Math.abs(this.mSelectionBoxScreen.y2-this.mSelectionBoxScreen.y1);return`left: ${t}px; top: ${e}px; width: ${o}px; height: ${l}px`}get visibleNodes(){return this.mCachedGraphData.visibleNodes}get showAddNodePopup(){return this.mAddNodePopup!==null}get addNodePopupStyle(){let t=this.mAddNodePopup;return t?`left: ${t.screenX}px; top: ${t.screenY}px`:""}onConnect(){this.mManager.connections.gridElement=this.mComponent.element,this.mKeyboardHandler=t=>this.onKeyDown(t),document.addEventListener("keydown",this.mKeyboardHandler),this.mUnsubscribe=this.mManager.subscribe(F.Document|F.Function|F.SpecialActiveFunction|F.Node|F.Connection,null,t=>{((t.changeType&F.Document)>0||(t.changeType&F.Function)>0||(t.changeType&F.SpecialActiveFunction)>0)&&this.resetForActiveFunction(),this.invalidateGraphContent(),this.mComponent.updater.updateAsync()}),this.invalidateGraphContent()}onDeconstruct(){this.stopDocumentPointerTracking(),this.mUnsubscribe?.(),this.mUnsubscribe=null,this.mKeyboardHandler&&(document.removeEventListener("keydown",this.mKeyboardHandler),this.mKeyboardHandler=null)}onCanvasPointerDown(t){if(this.closeAddNodePopup(),t.button===1){t.preventDefault(),this.mInteractionState={mode:"panning",startX:t.clientX,startY:t.clientY},this.startDocumentPointerTracking();return}if(t.button!==0)return;t.ctrlKey||(this.mSelectedNodes.clear(),this.invalidateNodeVisuals());let e=this.getLocalPointerPosition(t.clientX,t.clientY);this.mInteractionState={mode:"selecting"},this.mSelectionBoxScreen={x1:e.x,x2:e.x,y1:e.y,y2:e.y},this.mShowSelectionBox=!1,this.startDocumentPointerTracking()}onCanvasWheel(t){t.preventDefault();let e=this.getLocalPointerPosition(t.clientX,t.clientY);this.mManager.grid.zoomAt(e.x,e.y,t.deltaY>0?-.1:.1),this.mTransformVersion++}onContextMenu(t){t.preventDefault(),!this.eventPathContainsGraphNode(t)&&this.openAddNodePopupAtPointer(t.clientX,t.clientY)}onNodePointerDown(t,e){for(let m of t.composedPath())if(m instanceof HTMLElement&&m.tagName.toLowerCase()==="potatno-port")return;if(t.stopPropagation(),this.closeAddNodePopup(),t.button!==0)return;t.ctrlKey?this.mSelectedNodes.has(e)?this.mSelectedNodes.delete(e):this.mSelectedNodes.add(e):this.mSelectedNodes.has(e)||(this.mSelectedNodes.clear(),this.mSelectedNodes.add(e)),this.invalidateNodeVisuals();let o=this.mManager.grid.gridSize,l=new Map;for(let m of this.mSelectedNodes)l.set(m,{originX:m.transformation.x*o,originY:m.transformation.y*o});this.mInteractionState={mode:"dragging-node",origins:l,startX:t.clientX,startY:t.clientY},this.startDocumentPointerTracking()}onNodeResizeStart(t){this.closeAddNodePopup(),this.mInteractionState={mode:"resizing-comment",node:t.value.node,originalH:t.value.node.transformation.height,originalW:t.value.node.transformation.width,startX:t.value.startX,startY:t.value.startY},this.startDocumentPointerTracking()}onAddNodePopupNodeSelect(t){this.insertNodeFromAddPopup(t.value)}onAddNodePopupClose(){this.closeAddNodePopup()}onDocumentPointerMove(t){let e=this.mInteractionState;if(e.mode==="panning"){this.mManager.grid.pan(t.clientX-e.startX,t.clientY-e.startY),e.startX=t.clientX,e.startY=t.clientY,this.mTransformVersion++;return}if(e.mode==="dragging-node"){this.dragSelectedNodes(t,e);return}if(e.mode==="selecting"){let o=this.getLocalPointerPosition(t.clientX,t.clientY);this.mSelectionBoxScreen={x1:this.mSelectionBoxScreen.x1,x2:o.x,y1:this.mSelectionBoxScreen.y1,y2:o.y},this.mShowSelectionBox=Math.abs(this.mSelectionBoxScreen.x2-this.mSelectionBoxScreen.x1)>5||Math.abs(this.mSelectionBoxScreen.y2-this.mSelectionBoxScreen.y1)>5;return}if(e.mode==="resizing-comment"){let o=this.mManager.grid.gridSize,l=(t.clientX-e.startX)/this.mManager.grid.zoom,m=(t.clientY-e.startY)/this.mManager.grid.zoom;this.mManager.graph.transformNode(e.node,{width:e.originalW+Math.round(l/o),height:e.originalH+Math.round(m/o)}),this.rebuildVisibleNodePositions();return}}onDocumentPointerUp(){this.mInteractionState.mode==="selecting"&&(this.mShowSelectionBox=!1,this.selectNodesInBox()),this.mInteractionState={mode:"idle"},this.stopDocumentPointerTracking()}onKeyDown(t){if(!this.isTextEditingActive()){if(t.key==="Escape"&&this.mAddNodePopup&&this.closeAddNodePopup(),t.key==="Delete"){this.deleteSelectedNodes();return}if(t.ctrlKey&&t.key==="z"){t.preventDefault(),t.shiftKey?this.mManager.history.redo():this.mManager.history.undo();return}if(t.ctrlKey&&t.key==="y"){t.preventDefault(),this.mManager.history.redo();return}if(t.ctrlKey&&t.key==="c"){this.mManager.clipboard.copy(this.mSelectedNodes);return}t.ctrlKey&&t.key==="v"&&(t.preventDefault(),this.pasteFromClipboard())}}addCommentContainedNodeOrigins(t,e){let o=this.mManager.activeFunction;if(!o)return;let l=this.mManager.grid.gridSize,m=t.transformation.x*l,g=t.transformation.y*l,y=m+t.transformation.width*l,D=g+t.transformation.height*l;for(let S of o.nodes){if(S===t||this.mSelectedNodes.has(S))continue;let c=S.transformation.x*l,n=S.transformation.y*l;c>=m&&c<=y&&n>=g&&n<=D&&e.set(S,{originX:c,originY:n})}}closeAddNodePopup(){this.mAddNodePopup=null}calculateNodeGridHeight(t){return 1+Math.max(t.inputs.list.length,t.outputs.list.length,1)}deleteSelectedNodes(){for(let t of this.mSelectedNodes)this.mManager.graph.removeNode(t);this.mSelectedNodes.clear()}dragSelectedNodes(t,e){let o=this.mManager.grid.zoom,l=this.mManager.grid.gridSize,m=(t.clientX-e.startX)/o,g=(t.clientY-e.startY)/o;for(let[y,D]of e.origins){let S=this.mManager.grid.snapToGrid(D.originX+m,D.originY+g);this.mManager.graph.transformNode(y,{x:Math.round(S.x/l),y:Math.round(S.y/l)})}this.rebuildVisibleNodePositions()}eventPathContainsGraphNode(t){for(let e of t.composedPath())if(e instanceof HTMLElement&&e.tagName.toLowerCase()==="potatno-node")return!0;return!1}getCanvasWrapperOrNull(){try{return this.canvasWrapper}catch{return null}}getLocalPointerPosition(t,e){let o=this.getCanvasWrapperOrNull();if(!o)return{x:0,y:0};let l=o.getBoundingClientRect();return{x:t-l.left,y:e-l.top}}invalidateGraphContent(){this.rebuildGraphData()}invalidateNodeVisuals(){this.rebuildGraphData()}insertNodeAt(t,e){if(!this.mManager.activeFunction)return;let o=this.mManager.grid.gridSize,l=this.mManager.grid.snapToGrid(e.x,e.y),m=this.mManager.graph.addNode(this.mManager.activeFunction,t,{x:Math.round(l.x/o),y:Math.round(l.y/o),height:0,width:0});this.mSelectedNodes.clear(),this.mSelectedNodes.add(m),this.closeAddNodePopup()}insertNodeFromAddPopup(t){let e=this.mAddNodePopup;e&&this.insertNodeAt(t,{x:e.worldX,y:e.worldY})}isTextEditingActive(){let t=document.activeElement;return t instanceof HTMLInputElement||t instanceof HTMLTextAreaElement||t instanceof HTMLSelectElement}openAddNodePopupAtPointer(t,e){let o=this.getCanvasWrapperOrNull(),l=this.getLocalPointerPosition(t,e),m=this.mManager.grid.screenToWorld(l.x,l.y),g=280,y=320,D=Math.max(0,(o?.clientWidth??g)-g-8),S=Math.max(0,(o?.clientHeight??y)-y-8);this.mAddNodePopup={screenX:Math.max(8,Math.min(l.x,D)),screenY:Math.max(8,Math.min(l.y,S)),worldX:m.x,worldY:m.y}}pasteFromClipboard(){if(!this.mManager.activeFunction)return;let e=this.mManager.clipboard.paste();if(e.length!==0){this.mSelectedNodes.clear();for(let o of e)this.mSelectedNodes.add(o)}}rebuildGraphData(){let t=[],e=this.mManager.activeFunction;if(e){let o=this.mManager.grid.gridSize;for(let l of e.nodes){let m=Math.max(l.transformation.height,this.calculateNodeGridHeight(l));t.push({node:l,pixelH:m*o,pixelW:l.transformation.width*o,pixelX:l.transformation.x*o,pixelY:l.transformation.y*o,selected:this.mSelectedNodes.has(l)})}}this.mCachedGraphData={visibleNodes:t}}rebuildVisibleNodePositions(){let t=this.mManager.grid.gridSize;this.mCachedGraphData={visibleNodes:this.mCachedGraphData.visibleNodes.map(e=>({node:e.node,pixelH:Math.max(e.node.transformation.height,this.calculateNodeGridHeight(e.node))*t,pixelW:e.node.transformation.width*t,pixelX:e.node.transformation.x*t,pixelY:e.node.transformation.y*t,selected:e.selected}))}}resetForActiveFunction(){this.mInteractionState={mode:"idle"},this.mSelectedNodes.clear(),this.stopDocumentPointerTracking(),this.closeAddNodePopup()}selectNodesInBox(){let t=this.mManager.activeFunction;if(!t)return;let e=this.mManager.grid.screenToWorld(Math.min(this.mSelectionBoxScreen.x1,this.mSelectionBoxScreen.x2),Math.min(this.mSelectionBoxScreen.y1,this.mSelectionBoxScreen.y2)),o=this.mManager.grid.screenToWorld(Math.max(this.mSelectionBoxScreen.x1,this.mSelectionBoxScreen.x2),Math.max(this.mSelectionBoxScreen.y1,this.mSelectionBoxScreen.y2)),l=this.mManager.grid.gridSize;for(let m of t.nodes){let g=m.transformation.x*l,y=m.transformation.y*l,D=g+m.transformation.width*l,S=y+m.transformation.height*l;g<o.x&&D>e.x&&y<o.y&&S>e.y&&this.mSelectedNodes.add(m)}this.invalidateNodeVisuals()}startDocumentPointerTracking(){this.stopDocumentPointerTracking(),this.mDocumentPointerMoveHandler=t=>this.onDocumentPointerMove(t),this.mDocumentPointerUpHandler=()=>this.onDocumentPointerUp(),document.addEventListener("pointermove",this.mDocumentPointerMoveHandler),document.addEventListener("pointerup",this.mDocumentPointerUpHandler)}stopDocumentPointerTracking(){this.mDocumentPointerMoveHandler&&(document.removeEventListener("pointermove",this.mDocumentPointerMoveHandler),this.mDocumentPointerMoveHandler=null),this.mDocumentPointerUpHandler&&(document.removeEventListener("pointerup",this.mDocumentPointerUpHandler),this.mDocumentPointerUpHandler=null)}static{Cn()}};var Hn=`:host {\r
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
`;var Xn=`<div class="properties-header">Properties</div>\r
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
`;function Es(){function f(c,n){return function(a){e(n,"addInitializer"),o(a,"An initializer"),c.push(a)}}function t(c,n,u,a,r,b,v,T,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+n:n,static:b,private:v,metadata:T},d={v:!1};s.addInitializer=f(a,d);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return c(w,s)}finally{d.v=!0}}function e(c,n){if(c.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(c,n){if(typeof c!="function")throw new TypeError(n+" must be a function")}function l(c,n){var u=typeof n;if(c===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var a;throw c===0?a="field":c===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function m(c,n,u,a,r,b,v,T,w){var p=u[0],s,d,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,C;if(typeof p=="function")h=t(p,a,s,T,r,b,v,w,i),h!==void 0&&(l(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h);else for(var P=p.length-1;P>=0;P--){var M=p[P];if(h=t(M,a,s,T,r,b,v,w,i),h!==void 0){l(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(I,E){return E};else if(typeof d!="function"){var _=d;d=function(I,E){for(var L=E,R=0;R<_.length;R++)L=_[R].call(I,L);return L}}else{var j=d;d=function(I,E){return j.call(I,E)}}c.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(c.push(function(I,E){return i.get.call(I,E)}),c.push(function(I,E){return i.set.call(I,E)})):r===2?c.push(i):c.push(function(I,E){return i.call(I,E)}):Object.defineProperty(n,a,s))}function g(c,n,u){for(var a=[],r,b,v=new Map,T=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,C;if(h?(x=c,s=s-5,b=b||[],C=b):(x=c.prototype,r=r||[],C=r),s!==0&&!i){var P=h?T:v,M=P.get(d)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!M&&s>2?P.set(d,s):P.set(d,!0)}m(a,x,p,d,s,h,i,C,u)}}return y(a,r),y(a,b),a}function y(c,n){n&&c.push(function(u){for(var a=0;a<n.length;a++)n[a].call(u);return u})}function D(c,n,u){if(n.length>0){for(var a=[],r=c,b=c.name,v=n.length-1;v>=0;v--){var T={v:!1};try{var w=n[v](r,{kind:"class",name:b,addInitializer:f(a,T),metadata:u})}finally{T.v=!0}w!==void 0&&(l(10,w),r=w)}return[S(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function S(c,n){return Object.defineProperty(c,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,a,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),T=g(n,u,v);return a.length||S(n,v),{e:T,get c(){return D(n,a,v)}}}}function Zn(f,t,e,o){return(Zn=Es())(f,t,e,o)}var qn,Yn,Is;qn=W({selector:"potatno-panel-properties",template:Xn,style:Hn});var Wn=class{static{({c:[Is,Yn]}=Zn(this,[],[qn]))}constructor(t=O.use($),e=O.use(K)){this.mComponent=t,this.mManager=e,this.mSelectedImportId="",this.mUnsubscribe=null}mComponent;mManager;mSelectedImportId;mUnsubscribe;get availableImports(){return this.mManager.project?.imports.map(t=>({id:t.id,label:t.label}))??[]}get availableTypes(){let t=this.mManager.project;if(!t)return[];let e=new Set;for(let[o]of t.types.types)e.add(o);return[...e].sort()}get functionImportIds(){return[...this.mManager.activeFunction?.imports??[]]}get functionImports(){let t=new Map(this.availableImports.map(e=>[e.id,e]));return this.functionImportIds.map(e=>t.get(e)??{id:e,label:e})}get functionInputs(){return(this.mManager.activeFunction?.inputs??[]).map(t=>({name:t.label,type:t.dataType}))}get functionName(){return this.mManager.activeFunction?.label??""}get functionOutputs(){return(this.mManager.activeFunction?.outputs??[]).map(t=>({name:t.label,type:t.dataType}))}get isSystem(){return this.mManager.activeFunction?.isSystem??!1}get nameDisabled(){return this.isSystem}get importsDisabled(){return this.hasStaticFlag(nt.imports)}get inputsDisabled(){return this.hasStaticFlag(nt.inputs)}get outputsDisabled(){return this.hasStaticFlag(nt.outputs)}get unusedImports(){let t=new Set(this.functionImportIds);return this.availableImports.filter(e=>!t.has(e.id))}onConnect(){this.mUnsubscribe=this.mManager.subscribe(F.Document|F.Function|F.SpecialActiveFunction,null,()=>{this.mComponent.updater.updateAsync()})}onDeconstruct(){this.mUnsubscribe?.(),this.mUnsubscribe=null}onAddSelectedImport(){let t=this.unusedImports,e=this.mSelectedImportId||(t.length>0?t[0].id:"");e&&(this.mManager.updateFunctionProperties({imports:[...this.functionImportIds,e]}),this.mSelectedImportId="")}onAddInput(){let t=this.availableTypes.length>0?this.availableTypes[0]:"number";this.mManager.updateFunctionProperties({inputs:[...this.functionInputs,{name:this.uniquePortName("new_input"),type:t}]})}onAddOutput(){let t=this.availableTypes.length>0?this.availableTypes[0]:"number";this.mManager.updateFunctionProperties({outputs:[...this.functionOutputs,{name:this.uniquePortName("new_output"),type:t}]})}onDeleteImport(t){let e=[...this.functionImportIds];e.splice(t,1),this.mManager.updateFunctionProperties({imports:e})}onDeleteInput(t){let e=[...this.functionInputs];e.splice(t,1),this.mManager.updateFunctionProperties({inputs:e})}onDeleteOutput(t){let e=[...this.functionOutputs];e.splice(t,1),this.mManager.updateFunctionProperties({outputs:e})}onImportSelectChange(t){this.mSelectedImportId=t.target.value}onInputNameChange(t,e){let o=e.target,l=o.value,m=!this.validateName(l)||this.isNameDuplicate(l,"input",t);o.style.borderColor=m?"var(--potatno-color-error)":"";let g=[...this.functionInputs];g[t]={...g[t],name:l},this.mManager.updateFunctionProperties({inputs:g})}onInputTypeChange(t,e){let o=e.target.value,l=[...this.functionInputs];l[t]={...l[t],type:o},this.mManager.updateFunctionProperties({inputs:l})}onNameChange(t){let e=t.target,o=e.value,l=!this.validateName(o)||this.isNameDuplicate(o,"function");e.style.borderColor=l?"var(--potatno-color-error)":"",this.mManager.updateFunctionProperties({name:o})}onOutputNameChange(t,e){let o=e.target,l=o.value,m=!this.validateName(l)||this.isNameDuplicate(l,"output",t);o.style.borderColor=m?"var(--potatno-color-error)":"";let g=[...this.functionOutputs];g[t]={...g[t],name:l},this.mManager.updateFunctionProperties({outputs:g})}onOutputTypeChange(t,e){let o=e.target.value,l=[...this.functionOutputs];l[t]={...l[t],type:o},this.mManager.updateFunctionProperties({outputs:l})}isNameDuplicate(t,e,o){if(e!=="function"&&t===this.functionName)return!0;let l=this.functionInputs;for(let g=0;g<l.length;g++)if(!(e==="input"&&g===o)&&l[g].name===t)return!0;let m=this.functionOutputs;for(let g=0;g<m.length;g++)if(!(e==="output"&&g===o)&&m[g].name===t)return!0;return!1}hasStaticFlag(t){let e=this.mManager.activeFunction;if(!e)return!0;let o=e.project.getFunction(e.definitionId);return o?(o.statics&t)!==0:!0}uniquePortName(t){if(!this.isNameDuplicate(t,"function"))return t;let e=2;for(;this.isNameDuplicate(`${t}_${e}`,"function");)e++;return`${t}_${e}`}validateName(t){return/^[a-zA-Z][a-zA-Z0-9_]*$/.test(t)}static{Yn()}};var et=class{static MAIN="MAIN";mBuild;mDefaultParameters;mFunction;mTypes;get defaultParameters(){return this.mDefaultParameters}get function(){return this.mFunction}get types(){return this.mTypes}constructor(t,e){this.mFunction=t,this.mDefaultParameters=e.defaultParameters,this.mTypes=new Set(e.types),this.mBuild=e.build}compile(t,e){return this.mBuild({defaultParameters:this.mDefaultParameters,function:this.mFunction,projectTypes:t.entryPoint.function.project.types},t,e)}};var Jn=`:host {\r
    display: block;\r
    position: relative;\r
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
        top: -2px;\r
        border-top: 2px solid color-mix(in srgb, var(--potatno-color-text) 30%, var(--potatno-color-background));\r
    }\r
\r
    &.right {\r
        right: -2px;\r
        border-right: 2px solid color-mix(in srgb, var(--potatno-color-text) 30%, var(--potatno-color-background));\r
    }\r
\r
    &.bottom {\r
        bottom: -2px;\r
        border-bottom: 2px solid color-mix(in srgb, var(--potatno-color-text) 30%, var(--potatno-color-background));\r
    }\r
\r
    &.left {\r
        left: -2px;\r
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
}`;var Kn=`<!-- In order of top-left clockwise. Needed for styling -->
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

<div class="container">
    $slot
</div>
`;function Ps(){function f(c,n){return function(a){e(n,"addInitializer"),o(a,"An initializer"),c.push(a)}}function t(c,n,u,a,r,b,v,T,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+n:n,static:b,private:v,metadata:T},d={v:!1};s.addInitializer=f(a,d);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return c(w,s)}finally{d.v=!0}}function e(c,n){if(c.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(c,n){if(typeof c!="function")throw new TypeError(n+" must be a function")}function l(c,n){var u=typeof n;if(c===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var a;throw c===0?a="field":c===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function m(c,n,u,a,r,b,v,T,w){var p=u[0],s,d,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,C;if(typeof p=="function")h=t(p,a,s,T,r,b,v,w,i),h!==void 0&&(l(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h);else for(var P=p.length-1;P>=0;P--){var M=p[P];if(h=t(M,a,s,T,r,b,v,w,i),h!==void 0){l(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(I,E){return E};else if(typeof d!="function"){var _=d;d=function(I,E){for(var L=E,R=0;R<_.length;R++)L=_[R].call(I,L);return L}}else{var j=d;d=function(I,E){return j.call(I,E)}}c.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(c.push(function(I,E){return i.get.call(I,E)}),c.push(function(I,E){return i.set.call(I,E)})):r===2?c.push(i):c.push(function(I,E){return i.call(I,E)}):Object.defineProperty(n,a,s))}function g(c,n,u){for(var a=[],r,b,v=new Map,T=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,C;if(h?(x=c,s=s-5,b=b||[],C=b):(x=c.prototype,r=r||[],C=r),s!==0&&!i){var P=h?T:v,M=P.get(d)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!M&&s>2?P.set(d,s):P.set(d,!0)}m(a,x,p,d,s,h,i,C,u)}}return y(a,r),y(a,b),a}function y(c,n){n&&c.push(function(u){for(var a=0;a<n.length;a++)n[a].call(u);return u})}function D(c,n,u){if(n.length>0){for(var a=[],r=c,b=c.name,v=n.length-1;v>=0;v--){var T={v:!1};try{var w=n[v](r,{kind:"class",name:b,addInitializer:f(a,T),metadata:u})}finally{T.v=!0}w!==void 0&&(l(10,w),r=w)}return[S(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function S(c,n){return Object.defineProperty(c,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,a,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),T=g(n,u,v);return a.length||S(n,v),{e:T,get c(){return D(n,a,v)}}}}function ri(f,t,e,o){return(ri=Ps())(f,t,e,o)}var oi,Qn,ni,kn,ti,mr;oi=W({selector:"potatno-resize-box",template:Kn,style:Jn}),ni=H.state({proxy:!0});var ei=class{static{({e:[kn,ti],c:[mr,Qn]}=ri(this,[[ni,1,"enabledDirections"],[ot,3,"bottom"],[ot,3,"left"],[ot,3,"right"],[ot,3,"top"]],[oi]))}constructor(t=O.use($)){this.mComponentElement=t.element,this.enabledDirections={top:!1,right:!1,bottom:!1,left:!1}}mComponentElement;#t=(ti(this),kn(this));get enabledDirections(){return this.#t}set enabledDirections(t){this.#t=t}get bottom(){return this.enabledDirections.bottom}set bottom(t){this.enabledDirections.bottom=this.parseBoolean(t)}get left(){return this.enabledDirections.left}set left(t){this.enabledDirections.left=this.parseBoolean(t)}get right(){return this.enabledDirections.right}set right(t){this.enabledDirections.right=this.parseBoolean(t)}get top(){return this.enabledDirections.top}set top(t){this.enabledDirections.top=this.parseBoolean(t)}resizeCorner(t){this.handleResize(t,"both")}resizeHorizontal(t){this.handleResize(t,"horizontal")}resizeVertical(t){this.handleResize(t,"vertical")}handleResize(t,e){t.preventDefault(),t.stopPropagation();let o=this.mComponentElement.getBoundingClientRect(),l=o.width,m=o.height,g=t.clientX,y=t.clientY,D=c=>{let n=g-c.clientX,u=y-c.clientY,a=l+n,r=m+u;e==="horizontal"&&(a=l),e==="vertical"&&(r=m),this.updateComponentSize(a,r)},S=()=>{document.removeEventListener("pointermove",D),document.removeEventListener("pointerup",S)};document.addEventListener("pointermove",D),document.addEventListener("pointerup",S)}parseBoolean(t){return!!(()=>{if(typeof t=="string"){let o=t.toLowerCase();if(["true","false"].includes(o))return o==="true"}return t})()}updateComponentSize(t,e){(this.enabledDirections.left||this.enabledDirections.right)&&this.mComponentElement.style.setProperty("width",`${t}px`),(this.enabledDirections.top||this.enabledDirections.bottom)&&this.mComponentElement.style.setProperty("height",`${e}px`)}static{Qn()}};var ii=`:host {\r
    display: block;\r
    position: relative;\r
}\r
\r
.preview-container {\r
    background: var(--pn-bg-secondary);\r
    border: 1px solid var(--pn-border-default);\r
    border-width: 0 1px 1px 0;\r
    box-shadow: 0 4px 12px var(--pn-node-shadow);\r
\r
    /* Set min sizes to restrict resizing. */\r
    min-height: 150px;\r
    min-width: 200px;\r
\r
    /* Globaly restrict to max size of parent. */\r
    max-width: 100%;\r
    max-height: 100%;\r
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
    color: var(--potatno-color-text);\r
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
    color: var(--potatno-color-text);\r
    border-color: var(--potatno-color-accent);\r
}\r
\r
.preview-tab.selected {\r
    color: var(--potatno-color-text);\r
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
    color: var(--potatno-color-text);\r
    font-size: var(--pn-font-size-sm);\r
    word-break: break-word;\r
}\r
\r
.error-location {\r
    color: var(--pn-text-muted);\r
    font-size: 10px;\r
    margin-top: 2px;\r
}`;var si=`<potatno-resize-box class="preview-container" left="true" top="true">

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

</potatno-resize-box>
`;function As(){function f(c,n){return function(a){e(n,"addInitializer"),o(a,"An initializer"),c.push(a)}}function t(c,n,u,a,r,b,v,T,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+n:n,static:b,private:v,metadata:T},d={v:!1};s.addInitializer=f(a,d);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return c(w,s)}finally{d.v=!0}}function e(c,n){if(c.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(c,n){if(typeof c!="function")throw new TypeError(n+" must be a function")}function l(c,n){var u=typeof n;if(c===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var a;throw c===0?a="field":c===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function m(c,n,u,a,r,b,v,T,w){var p=u[0],s,d,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,C;if(typeof p=="function")h=t(p,a,s,T,r,b,v,w,i),h!==void 0&&(l(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h);else for(var P=p.length-1;P>=0;P--){var M=p[P];if(h=t(M,a,s,T,r,b,v,w,i),h!==void 0){l(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(I,E){return E};else if(typeof d!="function"){var _=d;d=function(I,E){for(var L=E,R=0;R<_.length;R++)L=_[R].call(I,L);return L}}else{var j=d;d=function(I,E){return j.call(I,E)}}c.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(c.push(function(I,E){return i.get.call(I,E)}),c.push(function(I,E){return i.set.call(I,E)})):r===2?c.push(i):c.push(function(I,E){return i.call(I,E)}):Object.defineProperty(n,a,s))}function g(c,n,u){for(var a=[],r,b,v=new Map,T=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,C;if(h?(x=c,s=s-5,b=b||[],C=b):(x=c.prototype,r=r||[],C=r),s!==0&&!i){var P=h?T:v,M=P.get(d)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!M&&s>2?P.set(d,s):P.set(d,!0)}m(a,x,p,d,s,h,i,C,u)}}return y(a,r),y(a,b),a}function y(c,n){n&&c.push(function(u){for(var a=0;a<n.length;a++)n[a].call(u);return u})}function D(c,n,u){if(n.length>0){for(var a=[],r=c,b=c.name,v=n.length-1;v>=0;v--){var T={v:!1};try{var w=n[v](r,{kind:"class",name:b,addInitializer:f(a,T),metadata:u})}finally{T.v=!0}w!==void 0&&(l(10,w),r=w)}return[S(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function S(c,n){return Object.defineProperty(c,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,a,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),T=g(n,u,v);return a.length||S(n,v),{e:T,get c(){return D(n,a,v)}}}}function ci(f,t,e,o){return(ci=As())(f,t,e,o)}var ui,ai,Ls;ui=W({selector:"potatno-preview",template:si,style:ii,modules:[xe,mr]});var li=class{static{({c:[Ls,ai]}=ci(this,[],[ui]))}constructor(t=O.use($),e=O.use(K)){this.mComponent=t,this.mManager=e,this.mSelectedDisplayId="",this.mSelectedOutputId="",this.mUnsubscribe=this.mManager.subscribe(F.Document|F.Function|F.SpecialActiveFunction|F.Node|F.Connection,null,()=>{this.mComponent.updater.updateAsync()})}mComponent;mManager;mUnsubscribe;mSelectedDisplayId;mSelectedOutputId;get displayOptions(){let t=this.mManager.activeFunction,e=this.mManager.project,o=t&&e?e.getFunction(t.definitionId):void 0;return!t||!e||!o?new Array:this.createDisplayOptions(e,this.availableDisplayIds(e,o,t,this.selectedOutputId))}get errors(){return this.mManager.integrity.errors}get hasErrors(){return!this.mManager.integrity.isValid}get outputOptions(){let t=this.mManager.activeFunction,e=this.mManager.project,o=t&&e?e.getFunction(t.definitionId):void 0;if(!t||!e||!o)return[];let l=new Array;e.preview.availableDisplays(o,et.MAIN).length>0&&l.push({id:et.MAIN,label:"Main"});let m=new Set;for(let g of t.getExitNodes())for(let y of g.inputs.value)m.has(y.definitionId)||e.preview.availableDisplays(o,y.resolvedDataType).length!==0&&(m.add(y.definitionId),l.push({id:y.definitionId,label:y.label}));return l}get previewDriver(){let t=this.mManager.activeFunction;if(!t)return null;if(this.selectedOutputId===et.MAIN)return this.mManager.preview.requestDriver(t,this.selectedDisplayId);let e=this.findFunctionOutputPort(t,this.selectedOutputId);return e?this.mManager.preview.requestDriver(e,this.selectedDisplayId):null}get selectedDisplayId(){let t=this.displayOptions;return this.mSelectedDisplayId!==""&&t.some(e=>e.id===this.mSelectedDisplayId)?this.mSelectedDisplayId:t.at(0)?.id??""}get selectedOutputId(){let t=this.outputOptions;return this.mSelectedOutputId!==""&&t.some(e=>e.id===this.mSelectedOutputId)?this.mSelectedOutputId:t[0]?.id??""}get showOutputSelector(){let t=this.mManager.activeFunction,e=this.mManager.project;return!t||!e?!1:this.outputOptions.length>0}onDeconstruct(){this.mUnsubscribe()}onDisplaySelect(t){this.mSelectedDisplayId=t.target.value,this.mComponent.updater.updateAsync()}onOutputSelect(t){this.mSelectedOutputId=t.target.value,this.mComponent.updater.updateAsync()}availableDisplayIds(t,e,o,l){if(l===et.MAIN)return t.preview.availableDisplays(e,et.MAIN);let m=this.findFunctionOutputPort(o,l);return m?t.preview.availableDisplays(e,m.resolvedDataType):t.preview.availableDisplays(e)}createDisplayOptions(t,e){return e.map(o=>({id:o,label:t.preview.getDisplay(o)?.name??o}))}findFunctionOutputPort(t,e){for(let o of t.getExitNodes()){let l=o.inputs.map.get(e);if(l&&l.portType==="value")return l}return null}static{ai()}};function Rs(){function f(c,n){return function(a){e(n,"addInitializer"),o(a,"An initializer"),c.push(a)}}function t(c,n,u,a,r,b,v,T,w){var p;switch(r){case 1:p="accessor";break;case 2:p="method";break;case 3:p="getter";break;case 4:p="setter";break;default:p="field"}var s={kind:p,name:v?"#"+n:n,static:b,private:v,metadata:T},d={v:!1};s.addInitializer=f(a,d);var i,h;r===0?v?(i=u.get,h=u.set):(i=function(){return this[n]},h=function(x){this[n]=x}):r===2?i=function(){return u.value}:((r===1||r===3)&&(i=function(){return u.get.call(this)}),(r===1||r===4)&&(h=function(x){u.set.call(this,x)})),s.access=i&&h?{get:i,set:h}:i?{get:i}:{set:h};try{return c(w,s)}finally{d.v=!0}}function e(c,n){if(c.v)throw new Error("attempted to call "+n+" after decoration was finished")}function o(c,n){if(typeof c!="function")throw new TypeError(n+" must be a function")}function l(c,n){var u=typeof n;if(c===1){if(u!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&o(n.get,"accessor.get"),n.set!==void 0&&o(n.set,"accessor.set"),n.init!==void 0&&o(n.init,"accessor.init")}else if(u!=="function"){var a;throw c===0?a="field":c===10?a="class":a="method",new TypeError(a+" decorators must return a function or void 0")}}function m(c,n,u,a,r,b,v,T,w){var p=u[0],s,d,i;v?r===0||r===1?s={get:u[3],set:u[4]}:r===3?s={get:u[3]}:r===4?s={set:u[3]}:s={value:u[3]}:r!==0&&(s=Object.getOwnPropertyDescriptor(n,a)),r===1?i={get:s.get,set:s.set}:r===2?i=s.value:r===3?i=s.get:r===4&&(i=s.set);var h,x,C;if(typeof p=="function")h=t(p,a,s,T,r,b,v,w,i),h!==void 0&&(l(r,h),r===0?d=h:r===1?(d=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h);else for(var P=p.length-1;P>=0;P--){var M=p[P];if(h=t(M,a,s,T,r,b,v,w,i),h!==void 0){l(r,h);var N;r===0?N=h:r===1?(N=h.init,x=h.get||i.get,C=h.set||i.set,i={get:x,set:C}):i=h,N!==void 0&&(d===void 0?d=N:typeof d=="function"?d=[d,N]:d.push(N))}}if(r===0||r===1){if(d===void 0)d=function(I,E){return E};else if(typeof d!="function"){var _=d;d=function(I,E){for(var L=E,R=0;R<_.length;R++)L=_[R].call(I,L);return L}}else{var j=d;d=function(I,E){return j.call(I,E)}}c.push(d)}r!==0&&(r===1?(s.get=i.get,s.set=i.set):r===2?s.value=i:r===3?s.get=i:r===4&&(s.set=i),v?r===1?(c.push(function(I,E){return i.get.call(I,E)}),c.push(function(I,E){return i.set.call(I,E)})):r===2?c.push(i):c.push(function(I,E){return i.call(I,E)}):Object.defineProperty(n,a,s))}function g(c,n,u){for(var a=[],r,b,v=new Map,T=new Map,w=0;w<n.length;w++){var p=n[w];if(Array.isArray(p)){var s=p[1],d=p[2],i=p.length>3,h=s>=5,x,C;if(h?(x=c,s=s-5,b=b||[],C=b):(x=c.prototype,r=r||[],C=r),s!==0&&!i){var P=h?T:v,M=P.get(d)||0;if(M===!0||M===3&&s!==4||M===4&&s!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+d);!M&&s>2?P.set(d,s):P.set(d,!0)}m(a,x,p,d,s,h,i,C,u)}}return y(a,r),y(a,b),a}function y(c,n){n&&c.push(function(u){for(var a=0;a<n.length;a++)n[a].call(u);return u})}function D(c,n,u){if(n.length>0){for(var a=[],r=c,b=c.name,v=n.length-1;v>=0;v--){var T={v:!1};try{var w=n[v](r,{kind:"class",name:b,addInitializer:f(a,T),metadata:u})}finally{T.v=!0}w!==void 0&&(l(10,w),r=w)}return[S(r,u),function(){for(var p=0;p<a.length;p++)a[p].call(r)}]}}function S(c,n){return Object.defineProperty(c,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:n})}return function(n,u,a,r){if(r!==void 0)var b=r[Symbol.metadata||Symbol.for("Symbol.metadata")];var v=Object.create(b===void 0?null:b),T=g(n,u,v);return a.length||S(n,v),{e:T,get c(){return D(n,a,v)}}}}function gi(f,t,e,o){return(gi=Rs())(f,t,e,o)}var vi,hi,yi,bi,di,mi,fi,fr;vi=W({selector:"potatno-code-editor",template:vo,style:go}),yi=ft("panelLeft"),bi=ft("panelRight");var pi=class{static{({e:[di,mi,fi],c:[fr,hi]}=gi(this,[[yi,1,"panelLeft"],[bi,1,"panelRight"],[ot,4,"project"],[ot,4,"document"],[ot,2,"triggerPreviewUpdate"]],[vi]))}constructor(t=O.use($),e=O.use(K)){this.mComponent=t,this.mManager=e,this.mProject=null,this.mResizeMoveHandler=null,this.mResizeState=null,this.mResizeUpHandler=null,this.mUnsubscribe=null}mComponent;mManager;mProject;mResizeMoveHandler;mResizeState;mResizeUpHandler;mUnsubscribe;#t=(fi(this),di(this));get panelLeft(){return this.#t}set panelLeft(t){this.#t=t}#e=mi(this);get panelRight(){return this.#e}set panelRight(t){this.#e=t}get hasPreview(){let t=this.mManager.project,e=this.mManager.activeFunction;if(!t||!e)return!1;let o=t.getFunction(e.definitionId);return o?t.preview.availableDisplays(o).length>0:!1}get document(){return this.mManager.graph.document}set project(t){this.mProject=t}set document(t){this.mProject&&this.mManager.initialize(this.mProject,t)}async triggerPreviewUpdate(){return this.mManager.preview.execute()}onConnect(){this.mUnsubscribe=this.mManager.subscribe(F.Document|F.Function|F.SpecialActiveFunction,null,()=>{this.mComponent.updater.updateAsync()})}onDeconstruct(){this.mUnsubscribe?.(),this.mUnsubscribe=null,this.stopPanelResize()}onResizeLeftStart(t){t.preventDefault(),this.startPanelResize("left",t)}onResizeRightStart(t){t.preventDefault(),this.startPanelResize("right",t)}startPanelResize(t,e){this.stopPanelResize();let o=t==="left"?this.panelLeft:this.panelRight;this.mResizeState={panel:t,startWidth:o.offsetWidth,startX:e.clientX};let l=g=>{if(!this.mResizeState)return;let y=t==="left"?g.clientX-this.mResizeState.startX:this.mResizeState.startX-g.clientX;o.style.width=`${Math.max(200,Math.min(500,this.mResizeState.startWidth+y))}px`},m=()=>{document.removeEventListener("pointermove",l),document.removeEventListener("pointerup",m),this.mResizeMoveHandler=null,this.mResizeState=null,this.mResizeUpHandler=null};this.mResizeMoveHandler=l,this.mResizeUpHandler=m,document.addEventListener("pointermove",l),document.addEventListener("pointerup",m)}stopPanelResize(){this.mResizeMoveHandler&&(document.removeEventListener("pointermove",this.mResizeMoveHandler),this.mResizeMoveHandler=null),this.mResizeUpHandler&&(document.removeEventListener("pointerup",this.mResizeUpHandler),this.mResizeUpHandler=null),this.mResizeState=null}static{hi()}};var Xe=class extends ae{mCodeEditor;mProject;get document(){return this.mCodeEditor.document}set document(t){this.mCodeEditor.document=t}get project(){return this.mProject}constructor(t){super(),this.mProject=t,this.addStyle(co),this.addStyle(lo),this.mCodeEditor=this.addContent(fr),this.mCodeEditor.project=t,this.mCodeEditor.document=new Mt(t)}load(t){let e=JSON.parse(t);if(!Array.isArray(e.functions))throw new A("Could not load document. Document has a wrong format.",this);let o=new Jt(this.mProject).deserialize(e);this.document=o}save(){let t=new Kt().serialize(this.document);return JSON.stringify(t)}async update(){return this.mCodeEditor.triggerPreviewUpdate()}};var V=class extends ht{constructor(t){super({id:t.id,label:t.label,category:t.category,regions:t.regions??null,generators:{ports:{inputs:e=>{for(let o of t.ports.inputs)e(o)},outputs:e=>{for(let o of t.ports.outputs)e(o)}},code:t.generators.code}})}};var Ye=class{mDisplays;get displayIds(){return[...this.mDisplays.keys()]}constructor(){this.mDisplays=new Map}addDisplay(t){this.mDisplays.set(t.id,t)}availableDisplays(t,e=null){let o=new Array;for(let[l,m]of this.mDisplays)m.executor.function.id===t.id&&(e===null||m.allowsType(e))&&o.push(l);return o}getDisplay(t){return this.mDisplays.get(t)??null}};var te=class f extends ht{static DEFINITION_ID="23e9319b-3b62-4dd8-858a-17d97ddee94e";constructor(){super({id:f.DEFINITION_ID,label:"Flow Conjunction",category:{name:"Conjunction",icon:"\u25C7"},generators:{ports:{inputs:t=>{t({label:"in",id:"in",portType:"flow"})},outputs:t=>{t({label:"out",id:"out",portType:"flow"})}},code:()=>{throw new A("Conjunction node code generators should never be called.",f)}}})}};var ee=class f extends ht{static DEFINITION_ID="a579584d-5d35-42b5-b2ba-3daddee488e0";constructor(){super({id:f.DEFINITION_ID,label:"Value Conjunction",category:{name:"Conjunction",icon:"\u25C7"},generators:{ports:{inputs:t=>{t({label:"in",id:"in",portType:"value",dataType:"<T>"})},outputs:t=>{t({label:"out",id:"out",portType:"value",dataType:"<T>"})}},code:()=>{throw new A("Conjunction node code generators should never be called.",f)}}})}};var We=class{mCodeGenerator;mEntryPoint;mImports;mNodeDefinitions;mPreview;mTypes;mUserFunctions;get entryPoint(){return this.mEntryPoint}get generator(){return this.mCodeGenerator}get imports(){return this.mImports}get nodeDefinitions(){return Array.from(this.mNodeDefinitions.values())}get preview(){return this.mPreview}get types(){return this.mTypes}get userFunctions(){return this.mUserFunctions}constructor(t,e,o){this.mTypes=t,this.mCodeGenerator=o.generator,this.mPreview=new Ye,this.mNodeDefinitions=new Map,this.mImports=new Array,this.mUserFunctions=new Map,this.mEntryPoint=e,this.addNodeDefinition(new te),this.addNodeDefinition(new ee)}addImport(t){this.mImports.push(t)}addNodeDefinition(t){this.mNodeDefinitions.set(t.id,t)}getFunction(t){return this.mEntryPoint.id===t?this.mEntryPoint:this.mUserFunctions.get(t)}setDynamicFunction(t){this.mUserFunctions.set(t.id,t)}};var Ze=class{mTypes;get typeNames(){return Array.from(this.mTypes.keys())}get types(){return this.mTypes}constructor(t){this.mTypes=new Map;for(let[e,o]of Object.entries(t))this.mTypes.set(e,{name:e,...o})}getDefaultValue(t){return this.getType(t).default.value}getType(t){if(!this.mTypes.has(t))throw new Error(`Type "${t}" is not defined in the project types definition.`);return this.mTypes.get(t)}isGenericType(t){return typeof t!="string"?!1:/^<[^>]+>$/.test(t)}};var qe=class extends Ze{constructor(){super({number:{default:{string:["0"],value:0},convert:t=>{let e=t[0],o=parseFloat(e);if(isNaN(o))throw new Error(`Invalid number: "${e}"`);return o.toString()},inputs:[{name:"value",type:"number"}]},string:{default:{string:[""],value:""},convert:t=>t[0],inputs:[{name:"value",type:"string"}]},boolean:{default:{string:["false"],value:!1},convert:t=>{let e=t[0].toLowerCase();if(e==="true")return"true";if(e==="false")return"false";throw new Error(`Invalid boolean: "${t[0]}"`)},inputs:[{name:"value",type:"boolean"}]}})}};var Je=class extends Qt{constructor(){super({id:"pixelShader",label:"Pixel Shader",statics:nt.inputs|nt.outputs,nodes:{entry:t=>{t(new V({id:"OnPixel",label:"OnPixel",category:{name:"event"},ports:{inputs:[],outputs:[{label:"exec",id:"exec",portType:"flow"},{label:"x",id:"x",portType:"value",dataType:"number"},{label:"y",id:"y",portType:"value",dataType:"number"}]},generators:{code:e=>{let o=e.outputs.x.value,l=e.outputs.y.value;return`(${o}, ${l}) => { ${e.outputs.exec.code.inner} }`}}}))},exit:t=>{t(new V({id:"PixelResult",label:"PixelResult",category:{name:"Output"},ports:{inputs:[{label:"exec",id:"exec",portType:"flow"},{label:"red",id:"red",portType:"value",dataType:"number"},{label:"green",id:"green",portType:"value",dataType:"number"},{label:"blue",id:"blue",portType:"value",dataType:"number"}],outputs:[]},generators:{code:e=>`return [${e.inputs.red.value}, ${e.inputs.green.value}, ${e.inputs.blue.value}];`}}))}},generator:{code:{body:t=>{let e=t.graphResultOf("OnPixel");return`const ${t.function.definitionId} = ${e?.code??"() => [0, 0, 0]"};`},value:t=>`${t.function.definitionId}()`}}})}};var Ke=class extends Qt{constructor(){super({id:"Helper Function",label:"Helper Function",statics:nt.none,nodes:{entry:(t,e)=>{t(new ht({id:"HelperFunctionEntry",label:"Entry",category:{name:"event"},generators:{ports:{outputs:o=>{o({label:"exec",id:"exec",portType:"flow"});for(let l of e.inputs)o({label:l.label,id:l.label,portType:"value",dataType:l.dataType})},inputs:()=>{}},code:o=>`(${Object.entries(o.outputs).filter(([m])=>m!=="exec").map(([,m])=>m.value).join(", ")}) => { ${o.outputs.exec.code.inner} }`}}))},exit:(t,e)=>{t(new ht({id:"HelperFunctionReturn",label:"Return",category:{name:"event"},generators:{ports:{outputs:()=>{},inputs:o=>{o({label:"exec",id:"exec",portType:"flow"});for(let l of e.outputs)o({label:l.label,id:l.label,portType:"value",dataType:l.dataType})}},code:o=>`return { ${Object.entries(o.inputs).map(([m,g])=>`${m}: (${g.value})`).join(", ")} };`}}))}},generator:{code:{body:t=>{let e=`__fn_${t.function.id.replaceAll("-","_")}`,o=t.graphResultOf("HelperFunctionEntry");return`const ${e} = ${o?.code??"() => ({})"};`},value:t=>{let e=`__fn_${t.function.id.replaceAll("-","_")}`,o=Object.entries(t.inputs).map(([,g])=>g.value).join(", "),l=Object.entries(t.outputs).filter(([g])=>g!=="Output").map(([g,y])=>`${g}: ${y.value}`).join(", "),m=t.outputs.Output?.code.inner??"";return l===""?`${e}(${o}); ${m}`:`const { ${l} } = ${e}(${o}); ${m}`}}}})}};var Qe=class extends We{mUserFunction;get userFunction(){return this.mUserFunction}constructor(){let t=new qe,e=new Je,o=new Ke;super(t,e,{generator:{code:l=>{let m="";for(let g of l.dependencies)m+=`${g.code}
`;return m+=l.entryPoint.code,m},values:{valueId:l=>`v_${l}`,hook:l=>`/*[${l}]*/`}}}),this.mUserFunction=o,this.setDynamicFunction(o),this.addBaseNodeDefinitions()}addBaseNodeDefinitions(){this.addNodeDefinition(new V({id:"Add",label:"Add",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} + ${t.inputs.b.value};`}})),this.addNodeDefinition(new V({id:"Subtract",label:"Subtract",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} - ${t.inputs.b.value};`}})),this.addNodeDefinition(new V({id:"Multiply",label:"Multiply",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} * ${t.inputs.b.value};/*MULTIPLYHOOK_${t.outputs.result.value}*/`}})),this.addNodeDefinition(new V({id:"Divide",label:"Divide",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} / ${t.inputs.b.value};`}})),this.addNodeDefinition(new V({id:"Modulo",label:"Modulo",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} % ${t.inputs.b.value};`}})),this.addNodeDefinition(new V({id:"Equal",label:"Equal",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"boolean"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} === ${t.inputs.b.value};`}})),this.addNodeDefinition(new V({id:"Not Equal",label:"Not Equal",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"boolean"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} !== ${t.inputs.b.value};`}})),this.addNodeDefinition(new V({id:"Less Than",label:"Less Than",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"boolean"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} < ${t.inputs.b.value};`}})),this.addNodeDefinition(new V({id:"Greater Than",label:"Greater Than",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"number"},{label:"b",id:"b",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"boolean"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} > ${t.inputs.b.value};`}})),this.addNodeDefinition(new V({id:"And",label:"And",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"boolean"},{label:"b",id:"b",portType:"value",dataType:"boolean"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"boolean"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} && ${t.inputs.b.value};`}})),this.addNodeDefinition(new V({id:"Or",label:"Or",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"boolean"},{label:"b",id:"b",portType:"value",dataType:"boolean"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"boolean"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} || ${t.inputs.b.value};`}})),this.addNodeDefinition(new V({id:"Not",label:"Not",category:{name:"operator"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"boolean"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"boolean"}]},generators:{code:t=>`const ${t.outputs.result.value} = !${t.inputs.a.value};`}})),this.addNodeDefinition(new V({id:"Number to String",label:"Number to String",category:{name:"type-conversion"},ports:{inputs:[{label:"input",id:"input",portType:"value",dataType:"number"}],outputs:[{label:"output",id:"output",portType:"value",dataType:"string"}]},generators:{code:t=>`const ${t.outputs.output.value} = String(${t.inputs.input.value});`}})),this.addNodeDefinition(new V({id:"String to Number",label:"String to Number",category:{name:"type-conversion"},ports:{inputs:[{label:"input",id:"input",portType:"value",dataType:"string"}],outputs:[{label:"output",id:"output",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.output.value} = Number(${t.inputs.input.value});`}})),this.addNodeDefinition(new V({id:"Boolean to String",label:"Boolean to String",category:{name:"type-conversion"},ports:{inputs:[{label:"input",id:"input",portType:"value",dataType:"boolean"}],outputs:[{label:"output",id:"output",portType:"value",dataType:"string"}]},generators:{code:t=>`const ${t.outputs.output.value} = String(${t.inputs.input.value});`}})),this.addNodeDefinition(new V({id:"If",label:"If",category:{name:"flow"},ports:{inputs:[{label:"exec",id:"exec",portType:"flow"},{label:"condition",id:"condition",portType:"value",dataType:"boolean"}],outputs:[{label:"then",id:"then",portType:"flow"},{label:"else",id:"else",portType:"flow"}]},generators:{code:t=>`if (${t.inputs.condition.value}) {
${t.outputs.then.code.inner}
} else {
${t.outputs.else.code.inner}
}`}})),this.addNodeDefinition(new V({id:"While",label:"While",category:{name:"flow"},ports:{inputs:[{label:"exec",id:"exec",portType:"flow"},{label:"condition",id:"condition",portType:"value",dataType:"boolean"}],outputs:[{label:"body",id:"body",portType:"flow"}]},generators:{code:t=>`while (${t.inputs.condition.value}) {
${t.outputs.body.code.inner}
}`}})),this.addNodeDefinition(new V({id:"For Loop",label:"For Loop",category:{name:"flow"},ports:{inputs:[{label:"exec",id:"exec",portType:"flow"},{label:"count",id:"count",portType:"value",dataType:"number"}],outputs:[{label:"exec",id:"exec",portType:"flow"},{label:"index",id:"index",portType:"value",dataType:"number"}]},generators:{code:t=>`for (let ${t.outputs.index.value} = 0; ${t.outputs.index.value} < ${t.inputs.count.value}; ${t.outputs.index.value}++) {
${t.outputs.exec.code.inner}
}`}})),this.addNodeDefinition(new V({id:"Console Log",label:"Console Log",category:{name:"Function"},ports:{inputs:[{label:"message",id:"message",portType:"value",dataType:"string"}],outputs:[]},generators:{code:t=>`console.log(${t.inputs.message.value});`}})),this.addNodeDefinition(new V({id:"String Concat",label:"String Concat",category:{name:"Function"},ports:{inputs:[{label:"a",id:"a",portType:"value",dataType:"string"},{label:"b",id:"b",portType:"value",dataType:"string"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"string"}]},generators:{code:t=>`const ${t.outputs.result.value} = ${t.inputs.a.value} + ${t.inputs.b.value};`}}))}};var re=class{mId;mLabel;mNodes;get id(){return this.mId}get label(){return this.mLabel}get nodes(){return this.mNodes}constructor(t,e){this.mId=t,this.mLabel=e,this.mNodes=new Array}addNode(t){this.mNodes.push(t)}};var ke=class extends re{constructor(){super("Math","Math"),this.addNode(new V({id:"Math.PI",label:"Math.PI",category:{name:"value"},ports:{inputs:[],outputs:[{label:"value",id:"value",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.value.value} = Math.PI;`}})),this.addNode(new V({id:"Math.E",label:"Math.E",category:{name:"value"},ports:{inputs:[],outputs:[{label:"value",id:"value",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.value.value} = Math.E;`}})),this.addNode(new V({id:"Math.abs",label:"Math.abs",category:{name:"Function"},ports:{inputs:[{label:"value",id:"value",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = Math.abs(${t.inputs.value.value});`}})),this.addNode(new V({id:"Math.floor",label:"Math.floor",category:{name:"Function"},ports:{inputs:[{label:"value",id:"value",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = Math.floor(${t.inputs.value.value});`}})),this.addNode(new V({id:"Math.random",label:"Math.random",category:{name:"Function"},ports:{inputs:[],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = Math.random();`}})),this.addNode(new V({id:"Math.sin",label:"Math.sin",category:{name:"Function"},ports:{inputs:[{label:"value",id:"value",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = Math.sin(${t.inputs.value.value});`}})),this.addNode(new V({id:"Math.cos",label:"Math.cos",category:{name:"Function"},ports:{inputs:[{label:"value",id:"value",portType:"value",dataType:"number"}],outputs:[{label:"result",id:"result",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.result.value} = Math.cos(${t.inputs.value.value});`}}))}};var tr=class extends re{constructor(){super("Time","Time"),this.addNode(new V({id:"CurrentTime",label:"CurrentTime",category:{name:"value"},ports:{inputs:[],outputs:[{label:"seconds",id:"seconds",portType:"value",dataType:"number"}]},generators:{code:t=>`const ${t.outputs.seconds.value} = (performance.now() / 1000);`}}))}};var er=class{mDependencies;mDocument;mEntryPoint;get code(){return this.mDocument.project.generator.code(this)}get dependencies(){return this.mDependencies}get entryPoint(){return this.mEntryPoint}constructor(t,e,o){this.mDocument=t,this.mEntryPoint=e,this.mDependencies=o}};var rr=class{mFunction;mGraphs;get code(){let t=this.mFunction.project.getFunction(this.mFunction.definitionId);if(!t)throw new A("Function result has an invalid function definition id.",this);return t.codeGenerator.body(this)}get function(){return this.mFunction}get graphs(){return Array.from(this.mGraphs.values())}constructor(t){this.mFunction=t,this.mGraphs=new Map}addGraph(t){this.mGraphs.set(t.entryNode.definitionId,t)}graphResultOf(t){return this.mGraphs.get(t)}};var or=class{mBodyCode;mDependencies;mEntryNode;mExitNode;mNodeIds;mPorts;get code(){return this.mBodyCode}get dependencies(){return this.mDependencies}get entryNode(){return this.mEntryNode}get exitNode(){return this.mExitNode}get nodes(){return this.mNodeIds}get ports(){return this.mPorts}constructor(t){this.mBodyCode=t.bodyCode,this.mDependencies=[...t.dependencies],this.mEntryNode=t.entryNode,this.mExitNode=t.exitNode,this.mNodeIds=t.nodeIds,this.mPorts=t.portValues}};var nr=class{mProject;constructor(t){this.mProject=t}generateDocument(t,e=!1){let o=[...t.functions].find(l=>l.isSystem);if(!o)throw new A("No entry point function found for code generation.",this);return this.generateFunction(o,e)}generateFunction(t,e=!1){return this.buildDocumentResult(t.document,t.getExitNodes(),e)}generateNode(t,e=!1){return this.buildDocumentResult(t.document,[t],e)}buildDocumentResult(t,e,o){if(t.validate().errors.length>0)throw new A("Code generation exited. Code graph validation failed.",this);let m={counter:{nodeIndex:0,portIndex:0},debug:o,nodeDefinitions:new Map},g=this.generateFunctionWithDependencies(m,e,new Set),y=g.shift();return new er(t,y,g)}countNodeEncounter(t,e){let o=new Map,l=new Set,m=new Array(t);for(;m.length>0;){let g=m.pop();if(o.set(g,(o.get(g)??0)+1),!(g===e||l.has(g))){l.add(g);for(let y of g.inputs.flow)for(let D of this.resolveFlowConjunctions(y))m.push(D.node);for(let y of g.inputs.value){let D=this.resolveValueConjunctions(y);D&&m.push(D.node)}}}return o}createScope(t,e){return{emittedNodes:new Set,remaining:this.countNodeEncounter(t,e)}}emitNode(t,e,o,l,m){if(!t.nodeDefinitions.get(o.function)){let a=new Map;for(let r of o.function.nodeDefinitions)a.set(r.id,r);t.nodeDefinitions.set(o.function,a)}let g=t.nodeDefinitions.get(o.function).get(o.definitionId);if(!g)throw new A(`Node definition "${o.definitionId}" not found for node "${o.label}".`,this);g instanceof jt&&e.dependencies.push(g.function);let y={},D=new Array;for(let a of o.inputs.value){let r=this.resolveInputValue(t,e,a);y[a.definitionId]=r.inputPort,e.ports.set(a,r.inputPort.value),r.emitResult&&D.push(r.emitResult)}let S={};for(let a of o.outputs.list)S[a.definitionId]={value:this.generatePortValue(t,e,a),code:{inner:l[a.definitionId]??""}};let c=g.codeGenerator({inputs:y,outputs:S,code:{next:m??""}}),n=this.getGeneratedNodeId(t,e,o);t.debug&&(c=this.mProject.generator.values.hook(`start-${n}`)+c+this.mProject.generator.values.hook(`end-${n}`));let u=new Array;for(let a of D)u.push(...a.codeOutput);return u.push(c),{codeOutput:u,lastGeneratedNode:o,endFlowPort:null}}findBranchStartPoint(t){let e=this.getNodesInputFlowPorts(t),o=e.length,l=new Map,m=new Array,g=(y,D)=>{let S=(l.has(y)||l.set(y,new Set),l.get(y)),c=S.size;for(let n of D)S.add(n);return S.size>c&&m.push(y),S};for(let[y,D]of e.entries())g(D.node,[y]);for(;m.length>0;){let y=m.shift(),D=l.get(y);for(let S of this.getNodesInputFlowPorts(y))if(g(S.node,D).size===o)return S.node}throw new A("No common branch point found for merge node.",this)}generateFunctionWithDependencies(t,e,o){let l=new Array;if(e.length===0)return l;let m=e.at(0).function;o.add(m);let g=new rr(m);l.push(g);for(let y of e){let D=this.generateNodeCode(t,y);g.addGraph(D);for(let S of D.dependencies)o.has(S)||l.push(...this.generateFunctionWithDependencies(t,S.getExitNodes(),o))}return l.reverse()}generateNodeCode(t,e){let o={dependencies:new Array,nodes:new Map,ports:new Map,scope:this.createScope(e,null)},l=this.walkBackward(t,o,e,null),m=l.codeOutput.join(" ");return new or({bodyCode:m,dependencies:o.dependencies,entryNode:l.lastGeneratedNode,exitNode:e,nodeIds:new Map(o.nodes),portValues:new Map(o.ports)})}generatePortValue(t,e,o){return e.ports.has(o)||e.ports.set(o,this.mProject.generator.values.valueId(t.counter.portIndex++)),e.ports.get(o)}getGeneratedNodeId(t,e,o){if(!e.nodes.has(o)){let m=(++t.counter.nodeIndex).toString(16).toUpperCase().padStart(8,"0");e.nodes.set(o,m)}return e.nodes.get(o)}getNodesInputFlowPorts(t){let e=new Array;for(let o of t.inputs.flow)e.push(...this.resolveFlowConjunctions(o));return[...new Set(e)]}handleFlowMerge(t,e,o,l,m){let g=m.join(" "),y=this.findBranchStartPoint(o),D={},S=e.scope;try{for(let c of l){e.scope=this.createScope(c.node,y);let n=this.walkBackward(t,e,c.node,y);D[n.endFlowPort.definitionId]=n.codeOutput.join(" ")}}finally{e.scope=S}return this.emitNode(t,e,y,D,g)}resolveFlowConjunctions(t){let e=new Array;for(let o of t.connectedPorts){if(o.node.definitionId!==te.DEFINITION_ID){e.push(o);continue}let l=o.node.inputs.flow[0];!l||l.connectedPorts.size===0||e.push(...this.resolveFlowConjunctions(l))}return e}resolveInputValue(t,e,o){let l=this.resolveValueConjunctions(o);if(!l){if(this.mProject.types.isGenericType(o.dataType))throw new A("Generic value inputs must be allways connected",this);return{inputPort:{value:this.mProject.types.getType(o.dataType).convert([...o.directValue]),isDirectValue:!0},emitResult:null}}let m=l.node,g=!m.hasFlowPorts,y=(()=>{if(!m.hasFlowPorts){if(e.scope.emittedNodes.has(m))return null;let D=e.scope.remaining.get(m);if(g&&(D=0),e.scope.remaining.set(m,D),D<=0)return e.scope.emittedNodes.add(m),this.emitNode(t,e,m,{})}return null})();return{inputPort:{value:this.generatePortValue(t,e,l),isDirectValue:!1},emitResult:y}}resolveValueConjunctions(t){if(t.connectedPorts.size===0)return null;let e=t.connectedPorts.values().next().value;if(e.node.definitionId!==ee.DEFINITION_ID)return e;let o=e.node.inputs.value[0];return!o||o.connectedPorts.size===0?null:this.resolveValueConjunctions(o)}walkBackward(t,e,o,l){let m={codeOutput:new Array,lastGeneratedNode:null,endFlowPort:null},g=null,y=o;for(;y!==null&&y!==l;){let D={};g!==null&&(D[g.definitionId]=m.codeOutput.join(" "),m.codeOutput=new Array);let S=m.codeOutput;m=this.emitNode(t,e,y,D),m.codeOutput=[...m.codeOutput,...S];let c=this.getNodesInputFlowPorts(y);if(c.length===0)break;c.length>1&&(m=this.handleFlowMerge(t,e,y,c,m.codeOutput),c=this.getNodesInputFlowPorts(m.lastGeneratedNode)),g=c[0]??null,y=g?.node??null}if(!m.lastGeneratedNode)throw new A(`Walk did not reach an entry node from exit "${o.label}".`,this);if(l&&y!==l)throw new A("Malformed graph. End node not reached",this);return m.endFlowPort=g,m}};var ir=class{mCachedCallable;mDisplay;mElement;mSpecifiedParameters;mTarget;get display(){return this.mDisplay}get element(){return this.mElement||(this.mElement=this.mDisplay.generate()),this.mElement}constructor(t,e){this.mDisplay=t,this.mTarget=e,this.mCachedCallable=null,this.mElement=null,this.mSpecifiedParameters={...this.mDisplay.executor.defaultParameters}}async execute(){this.mCachedCallable&&await this.mDisplay.update(this.element,this.mCachedCallable)}refresh(){let t=this.mTarget instanceof it?this.mTarget.node.function:this.mTarget,e=(()=>{try{return new nr(t.project).generateFunction(t,!0)}catch{return null}})();if(!e){this.mCachedCallable=null;return}let o=null;if(this.mTarget instanceof it&&(o=this.resolvePortTarget(e,this.mTarget),!o)){this.mCachedCallable=null;return}let l=this.mDisplay.executor.compile(e,o);if(!this.mDisplay.allowsType(l.type)){this.mCachedCallable=null;return}let m=this.mDisplay.adapterFor(l.type);this.mCachedCallable=async g=>m(await l.execute({...this.mDisplay.executor.defaultParameters,...this.mSpecifiedParameters,...g}))}specifyParameters(t){this.mSpecifiedParameters={...this.mSpecifiedParameters,...t}}resolvePortTarget(t,e){let[o,l]=(()=>{for(let g of t.entryPoint.graphs)if(g.ports.has(e)&&g.nodes.has(e.node))return[g.ports.get(e),g.nodes.get(e.node)];return[null,null]})();if(!o||!l)return null;let m=e.direction==="input"?"start":"end";return{documentPort:e,nodeHook:e.project.generator.values.hook(`${m}-${l}`),value:o}}};var oe=class{mExecutor;mGenerate;mId;mName;mTypeAdapters;mUpdate;get executor(){return this.mExecutor}get id(){return`${this.mId}-${this.mExecutor.function.id}`}get name(){return this.mName}constructor(t,e){this.mId=e.id,this.mName=e.name,this.mExecutor=t,this.mGenerate=e.generate,this.mUpdate=e.update,this.mTypeAdapters=new Map;for(let[o,l]of Object.entries(e.typeAdapter))this.mExecutor.types.has(o)&&this.mTypeAdapters.set(o,l)}adapterFor(t){let e=t;if(!this.mTypeAdapters.has(e))throw new A(`Display "${this.mId}" has no type adapter for type "${t}".`,this);return this.mTypeAdapters.get(e)}allowsType(t){return this.mTypeAdapters.has(t)}createDriver(t){return new ir(this,t)}generate(){return this.mGenerate()}update(t,e){return this.mUpdate(t,e)}};var Te=class f extends oe{static MATRIX_SIZE=3;static VALUE_LENGTH=5;constructor(t){super(t,{id:"matrix",name:"Matrix 3x3",generate:()=>{let e=document.createElement("div");return e.style.boxSizing="border-box",e.style.display="grid",e.style.gap="2px",e.style.gridTemplateColumns=`repeat(${f.MATRIX_SIZE}, minmax(0, 1fr))`,e.style.height="100%",e.style.width="100%",e.style.fontFamily="var(--pn-font-mono)",e.style.fontSize="var(--pn-font-size-sm)",e},typeAdapter:{[et.MAIN]:e=>e.map(o=>this.formatPreviewValue(o)),number:e=>[this.formatPreviewValue(e)],string:e=>[this.formatPreviewValue(e)],boolean:e=>[this.formatPreviewValue(e)]},update:async(e,o)=>{await this.updateMatrixPreview(e,o)}})}formatPreviewValue(t){if(typeof t=="number"){if(!Number.isFinite(t))return t.toString().slice(0,f.VALUE_LENGTH);let e=Math.trunc(Math.abs(t)).toString().length,o=Math.max(0,f.VALUE_LENGTH-e-(t<0?1:0)-1);return t.toFixed(o).slice(0,f.VALUE_LENGTH)}return String(t).slice(0,f.VALUE_LENGTH)}async updateMatrixPreview(t,e){for(;t.children.length<f.MATRIX_SIZE*f.MATRIX_SIZE;){let o=document.createElement("div");o.style.alignItems="center",o.style.background="var(--pn-bg-secondary)",o.style.border="1px solid var(--pn-border-default)",o.style.boxSizing="border-box",o.style.color="var(--pn-text-primary)",o.style.display="flex",o.style.justifyContent="center",o.style.minWidth="0",o.style.overflow="hidden",o.style.padding="2px",o.style.textOverflow="clip",o.style.whiteSpace="pre-line",t.append(o)}for(let o=0;o<f.MATRIX_SIZE;o++)for(let l=0;l<f.MATRIX_SIZE;l++){let m=o*f.MATRIX_SIZE+l,g=f.MATRIX_SIZE===1?0:l/(f.MATRIX_SIZE-1),y=f.MATRIX_SIZE===1?0:o/(f.MATRIX_SIZE-1),D=await Promise.resolve(e({x:g,y}));t.children[m].textContent=D.join(`
`)}}};var De=class f extends oe{static PREVIEW_HEIGHT=48;static PREVIEW_WIDTH=48;constructor(t){super(t,{id:"2dCanvas",name:"Canvas 2D",generate:()=>{let e=document.createElement("canvas");return e.width=f.PREVIEW_WIDTH,e.height=f.PREVIEW_HEIGHT,e.style.width="100%",e.style.height="100%",e.style.imageRendering="pixelated",e},typeAdapter:{[et.MAIN]:e=>e,number:e=>[e,e,e],boolean:e=>{let o=e?1:0;return[o,o,o]}},update:async(e,o)=>{await this.updateCanvasPreview(e,o)}})}async updateCanvasPreview(t,e){let o=t.getContext("2d");if(!o)return;let l=t.width,m=t.height,g=o.createImageData(l,m),y=g.data;for(let D=0;D<m;D++)for(let S=0;S<l;S++){let c=S/l,n=D/m,u=await Promise.resolve(e({x:c,y:n})),a=(D*l+S)*4;y[a]=Math.floor(Math.max(0,Math.min(1,u[0]||0))*255),y[a+1]=Math.floor(Math.max(0,Math.min(1,u[1]||0))*255),y[a+2]=Math.floor(Math.max(0,Math.min(1,u[2]||0))*255),y[a+3]=255}o.putImageData(g,0,0)}};(()=>{let f=new WebSocket("ws://127.0.0.1:8088");f.addEventListener("open",()=>{console.log("Refresh connection established")}),f.addEventListener("message",t=>{console.log("Bundle finished. Start refresh"),t.data==="REFRESH"&&window.location.reload()})})();var Tt=new Qe;Tt.addImport(new ke);Tt.addImport(new tr);var wi=new et(Tt.entryPoint,{defaultParameters:{x:0,y:0},types:[et.MAIN,"number","string","boolean"],build:(f,t,e)=>{let o=t.code,l=f.function.id;if(!e){let y=new Function(`${o}
return ${l};`)();return{type:et.MAIN,execute:D=>y(D.x,D.y)}}let m=o.replace(e.nodeHook,`; return ${e.value};`),g=new Function(`${m}
return ${l};`)();return{type:e.documentPort.resolvedDataType,execute:y=>g(y.x,y.y)}}}),xi=new et(Tt.userFunction,{defaultParameters:{x:0,y:0},types:["number","string","boolean"],build:(f,t,e)=>{if(!e)return{type:"number",execute:()=>0};let o=t.entryPoint.function,l=`__fn_${o.id.replaceAll("-","_")}`,m=o.inputs.map(D=>f.projectTypes.getDefaultValue(D.dataType)),g=t.code.replace(e.nodeHook,`return ${e.value};`),y=new Function(`${g}
return ${l};`)();return{type:e.documentPort.resolvedDataType,execute:()=>y(...m)}}});Tt.preview.addDisplay(new De(wi));Tt.preview.addDisplay(new De(xi));Tt.preview.addDisplay(new Te(wi));Tt.preview.addDisplay(new Te(xi));var Os=document.getElementById("application-root"),Ee=new Xe(Tt);Ee.appendTo(Os);Ee.document=new Mt(Tt);Ti();async function Ti(){try{await Ee.update()}catch(f){}requestAnimationFrame(Ti)}document.getElementById("load-button").addEventListener("click",Fs);document.getElementById("save-button").addEventListener("click",_s);var Di="potatno-code-document.json";async function Fs(){if(window.confirm("Load saved document?"))try{let o=await(await(await navigator.storage.getDirectory()).getFileHandle(Di)).getFile();Ee.load(await o.text())}catch{window.alert("Could not load document.")}}async function _s(){if(window.confirm("Override saved document?"))try{let o=await(await(await navigator.storage.getDirectory()).getFileHandle(Di,{create:!0})).createWritable();await o.write(Ee.save()),await o.close()}catch{window.alert("Could not save document.")}}})();
//# sourceMappingURL=page.js.map
