var p=(o,e)=>()=>(o&&(e=o(o=0)),e);var N,dt=p(()=>{N=class o extends Array{static newListWith(...e){let t=new o;return t.push(...e),t}clear(){this.splice(0,this.length)}clone(){return o.newListWith(...this)}distinct(){return o.newListWith(...new Set(this))}equals(e){if(this===e)return!0;if(!e||this.length!==e.length)return!1;for(let t=0;t<this.length;++t)if(this[t]!==e[t])return!1;return!0}remove(e){let t=this.indexOf(e);if(t!==-1)return this.splice(t,1)[0]}replace(e,t){let r=this.indexOf(e);if(r!==-1){let i=this[r];return this[r]=t,i}}toString(){return`[${super.join(", ")}]`}}});var u,de=p(()=>{u=class extends Error{mTarget;get target(){return this.mTarget}constructor(e,t,r){super(e,r),this.mTarget=t}}});var b,Ft=p(()=>{dt();de();b=class o extends Map{add(e,t){if(!this.has(e))this.set(e,t);else throw new u("Can't add duplicate key to dictionary.",this)}clone(){return new o(this)}getAllKeysOfValue(e){return[...this.entries()].filter(i=>i[1]===e).map(i=>i[0])}getOrDefault(e,t){let r=this.get(e);return typeof r<"u"?r:t}map(e){let t=new N;for(let r of this){let i=e(r[0],r[1]);t.push(i)}return t}}});var Ot=p(()=>{});var Ut=p(()=>{});var $,Vt=p(()=>{$=class o{static cast(e,t){if(o.exists(e,t))return t}static exists(e,t){return o.valuesOf(e).includes(t)}static namesOf(e){return Object.keys(e).filter(t=>isNaN(Number(t)))}static valuesOf(e){let t=new Array;for(let r of o.namesOf(e))t.push(e[r]);return t}}});var Et=p(()=>{});var jt=p(()=>{});var ht=p(()=>{});var kt=p(()=>{});var Se=p(()=>{de()});var ft=p(()=>{de();Se()});var zt=p(()=>{ht();ft();Se()});var w=p(()=>{Ft();dt();Ot();de();Ut();Vt();Et();jt();ht();kt();ft();zt();Se()});var P,X=p(()=>{P=(m=>(m[m.None=0]="None",m[m.Index=GPUBufferUsage.INDEX]="Index",m[m.Vertex=GPUBufferUsage.VERTEX]="Vertex",m[m.Uniform=GPUBufferUsage.UNIFORM]="Uniform",m[m.Storage=GPUBufferUsage.STORAGE]="Storage",m[m.Indirect=GPUBufferUsage.INDIRECT]="Indirect",m[m.CopySource=GPUBufferUsage.COPY_SRC]="CopySource",m[m.CopyDestination=GPUBufferUsage.COPY_DST]="CopyDestination",m))(P||{})});var we,Nt=p(()=>{w();we=class{mDeconstruct;mReasons;get deconstruct(){return this.mDeconstruct}set deconstruct(e){if(!e)throw new u("Deconstruct reason can not be reverted. Sadly.",this);this.mDeconstruct=e}constructor(){this.mReasons=new Set,this.mDeconstruct=!1}add(e){this.mReasons.add(e)}any(){return this.mReasons.size>0||this.mDeconstruct}clear(){this.mReasons.clear()}has(e){return this.mReasons.has(e)}}});var v,G=p(()=>{w();Nt();v=class{mDeconstructed;mDevice;mInvalidationReasons;mIsSetup;mNativeObject;mUpdateListener;mUpdateListenerAffectedTyped;mFreeableResources;get device(){return this.mDevice}get isSetup(){return this.mIsSetup}get native(){return this.readNative()}constructor(e){this.mDevice=e,this.mIsSetup=!1,this.mDeconstructed=!1,this.mNativeObject=null,this.mUpdateListener=new b,this.mUpdateListenerAffectedTyped=new WeakMap,this.mInvalidationReasons=new we,this.mFreeableResources=new Set,this.mDevice.registerFreeableResource(this,this.mFreeableResources)}addInvalidationListener(e,t,...r){if(this.mUpdateListenerAffectedTyped.has(e))throw new u("Invalidation listener can't be applied twice.",this);let i=[t,...r];for(let a of i)this.mUpdateListener.has(a)||this.mUpdateListener.set(a,new N),this.mUpdateListener.get(a).push(e);return this.mUpdateListenerAffectedTyped.set(e,i),this}deconstruct(){this.mInvalidationReasons.deconstruct=!0,this.mNativeObject!==null&&(this.destroyNative(this.mNativeObject,this.mInvalidationReasons),this.mNativeObject=null),this.mDeconstructed=!0}invalidate(...e){let t=r=>{if(this.mNativeObject!==null&&this.mInvalidationReasons.has(r))return;this.mInvalidationReasons.add(r);let i=this.mUpdateListener.get(r);if(!(!i||i.length===0))if(i.length===1)i[0](r);else for(let a of i)a(r)};if(e.length===1)t(e[0]);else for(let r of e)t(r)}removeInvalidationListener(e){let t=this.mUpdateListenerAffectedTyped.get(e);if(t){for(let r of t)this.mUpdateListener.get(r).remove(e);this.mUpdateListenerAffectedTyped.delete(e)}}setup(e){if(this.mIsSetup)throw new u("Render targets setup can't be called twice.",this);let t={inSetup:!0,device:this.mDevice,data:{}},r=this.onSetupObjectCreate(t);return r!==null&&(e&&e(r),this.onSetup(t.data)),t.inSetup=!1,this.mIsSetup=!0,this}destroyNative(e,t){}ensureSetup(){if(!this.mIsSetup)throw new u("Gpu object must be setup to access properties.",this)}generateNative(e,t){return null}onSetup(e){}onSetupObjectCreate(e){return null}registerFreeableResource(e){this.mFreeableResources.add(e)}unregisterFreeableResource(e){this.mFreeableResources.delete(e)}updateNative(e,t){return!1}readNative(){if(this.mDeconstructed)throw new u("Native GPU object was deconstructed and can't be used again.",this);if(this.isSetup||this.setup(),this.mNativeObject!==null&&this.mInvalidationReasons.any()&&this.updateNative(this.mNativeObject,this.mInvalidationReasons)&&this.mInvalidationReasons.clear(),this.mNativeObject===null||this.mInvalidationReasons.any()){let e=this.mNativeObject;this.mNativeObject=this.generateNative(e,this.mInvalidationReasons),e!==null&&this.destroyNative(e,this.mInvalidationReasons),this.mInvalidationReasons.clear()}return this.mNativeObject}}});var j,q=p(()=>{G();j=class extends v{mResourceUsage;get usage(){return this.mResourceUsage}constructor(e){super(e),this.mResourceUsage=0}extendUsage(e){return(this.mResourceUsage&e)===0&&(this.mResourceUsage=this.mResourceUsage|e,this.invalidate("ResourceRebuild")),this}}});var L,Z=p(()=>{w();X();q();L=class extends j{mByteSize;mInitialData;mReadBuffer;mWriteBuffer;get native(){return super.native}get size(){return this.mByteSize}set size(e){this.mByteSize=e+3&-4,this.invalidate("ResourceRebuild")}get writeBufferLimitation(){return this.mWriteBuffer.limitation}set writeBufferLimitation(e){this.mWriteBuffer.limitation=e}constructor(e,t){super(e),this.mByteSize=t+3&-4,this.extendUsage(P.CopyDestination),this.extendUsage(P.CopySource),this.mWriteBuffer={limitation:Number.MAX_SAFE_INTEGER,ready:new Array,buffer:new Set},this.mReadBuffer=null,this.mInitialData=null}initialData(e){if(this.mInitialData!==null)throw new u("Initial callback can only be set once.",this);return this.mInitialData=e,this}async read(e,t){this.extendUsage(P.CopySource);let r=e??0,i=t??this.size-r;this.mReadBuffer===null&&(this.mReadBuffer=this.device.gpu.createBuffer({label:"ReadWaveBuffer",size:this.size,usage:GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST,mappedAtCreation:!1}),this.registerFreeableResource(this.mReadBuffer));let a=this.device.gpu.createCommandEncoder();a.copyBufferToBuffer(this.native,r,this.mReadBuffer,r,i),this.device.gpu.queue.submit([a.finish()]),await this.mReadBuffer.mapAsync(GPUMapMode.READ,r,i);let n=this.mReadBuffer.getMappedRange(r,i).slice(0);return this.mReadBuffer.unmap(),n}async write(e,t,r,i){this.extendUsage(P.CopyDestination);let a=this.native,n=null;this.mWriteBuffer.ready.length===0?this.mWriteBuffer.buffer.size<this.mWriteBuffer.limitation&&(n=this.device.gpu.createBuffer({label:`RingBuffer-WriteWaveBuffer-${this.mWriteBuffer.buffer.size}`,size:this.size,usage:GPUBufferUsage.MAP_WRITE|GPUBufferUsage.COPY_SRC,mappedAtCreation:!0}),this.registerFreeableResource(n),this.mWriteBuffer.buffer.add(n)):n=this.mWriteBuffer.ready.pop();let s=e;ArrayBuffer.isView(s)&&(s=s.buffer);let m=t??0,l=r??0,c=i??s.byteLength;if(l%8!==0)throw new u(`Data byte offset (${l}) must be a multiple of 8.`,this);if(c%4!==0)throw new u(`Data byte length (${c}) must be a multiple of 4.`,this);if(!n){this.device.gpu.queue.writeBuffer(a,m,s,l,c);return}let d=n.getMappedRange(m,c);new Int8Array(d).set(new Int8Array(s,l,c)),n.unmap();let g=this.device.gpu.createCommandEncoder();g.copyBufferToBuffer(n,m,a,m,c),this.device.gpu.queue.submit([g.finish()]),n.mapAsync(GPUMapMode.WRITE).then(()=>{this.mWriteBuffer.buffer.has(n)&&this.mWriteBuffer.ready.push(n)}).catch(()=>{this.mWriteBuffer.buffer.delete(n),n.destroy(),this.unregisterFreeableResource(n)})}destroyNative(e){e.destroy(),this.unregisterFreeableResource(e);for(let t of this.mWriteBuffer.buffer)t.destroy(),this.unregisterFreeableResource(t);for(this.mWriteBuffer.buffer.clear();this.mWriteBuffer.ready.length>0;)this.mWriteBuffer.ready.pop()}generateNative(e){let t=this.device.gpu.createBuffer({label:"Ring-Buffer-Static-Buffer",size:this.size,usage:this.usage,mappedAtCreation:!!this.mInitialData});if(this.registerFreeableResource(t),this.mInitialData){let r=this.mInitialData;ArrayBuffer.isView(r)&&(r=r.buffer);let i=t.getMappedRange();if(i.byteLength!==r.byteLength)throw new u(`Initial buffer data (byte-length: ${r.byteLength}) does not fit into buffer (length: ${i.byteLength}). `,this);new Int8Array(i).set(new Int8Array(r)),t.unmap(),this.mInitialData=void 0}if(e){let r=this.device.gpu.createCommandEncoder();r.copyBufferToBuffer(e,0,t,0,Math.min(e.size,t.size)),this.device.gpu.queue.submit([r.finish()])}return t}}});var Te=p(()=>{});var gt=p(()=>{});var bt=p(()=>{});var D,Re=p(()=>{D=(i=>(i[i.None=0]="None",i[i.Fragment=GPUShaderStage.FRAGMENT]="Fragment",i[i.Vertex=GPUShaderStage.VERTEX]="Vertex",i[i.Compute=GPUShaderStage.COMPUTE]="Compute",i))(D||{})});var K,ne=p(()=>{K=(h=>(h.DepthClipControl="depth-clip-control",h.Depth32floatStencil8="depth32float-stencil8",h.TextureCompressionBc="texture-compression-bc",h.TextureCompressionBcSliced3d="texture-compression-bc-sliced-3d",h.TextureCompressionEtc2="texture-compression-etc2",h.TextureCompressionAstc="texture-compression-astc",h.TimestampQuery="timestamp-query",h.IndirectFirstInstance="indirect-first-instance",h.ShaderF16="shader-f16",h.Rg11b10ufloatRenderable="rg11b10ufloat-renderable",h.Bgra8unormStorage="bgra8unorm-storage",h.Float32Filterable="float32-filterable",h.ClipDistances="clip-distances",h.DualSourceBlendin="dual-source-blending",h))(K||{})});var yt=p(()=>{});var xt=p(()=>{});var Q=p(()=>{});var vt=p(()=>{});var Dt=p(()=>{});var St=p(()=>{});var oe=p(()=>{});var Ce=p(()=>{});var E,Y=p(()=>{E=(S=>(S.MaxTextureDimension1D="maxTextureDimension1D",S.MaxTextureDimension2D="maxTextureDimension2D",S.MaxTextureDimension3D="maxTextureDimension3D",S.MaxTextureArrayLayers="maxTextureArrayLayers",S.MaxBindGroups="maxBindGroups",S.MaxBindGroupsPlusVertexBuffers="maxBindGroupsPlusVertexBuffers",S.MaxBindingsPerBindGroup="maxBindingsPerBindGroup",S.MaxDynamicUniformBuffersPerPipelineLayout="maxDynamicUniformBuffersPerPipelineLayout",S.MaxDynamicStorageBuffersPerPipelineLayout="maxDynamicStorageBuffersPerPipelineLayout",S.MaxSampledTexturesPerShaderStage="maxSampledTexturesPerShaderStage",S.MaxSamplersPerShaderStage="maxSamplersPerShaderStage",S.MaxStorageBuffersPerShaderStage="maxStorageBuffersPerShaderStage",S.MaxStorageTexturesPerShaderStage="maxStorageTexturesPerShaderStage",S.MaxUniformBuffersPerShaderStage="maxUniformBuffersPerShaderStage",S.MaxUniformBufferBindingSize="maxUniformBufferBindingSize",S.MaxStorageBufferBindingSize="maxStorageBufferBindingSize",S.MinUniformBufferOffsetAlignment="minUniformBufferOffsetAlignment",S.MinStorageBufferOffsetAlignment="minStorageBufferOffsetAlignment",S.MaxVertexBuffers="maxVertexBuffers",S.MaxBufferSize="maxBufferSize",S.MaxVertexAttributes="maxVertexAttributes",S.MaxVertexBufferArrayStride="maxVertexBufferArrayStride",S.MaxInterStageShaderVariables="maxInterStageShaderVariables",S.MaxColorAttachments="maxColorAttachments",S.MaxColorAttachmentBytesPerSample="maxColorAttachmentBytesPerSample",S.MaxComputeWorkgroupStorageSize="maxComputeWorkgroupStorageSize",S.MaxComputeInvocationsPerWorkgroup="maxComputeInvocationsPerWorkgroup",S.MaxComputeWorkgroupSizeX="maxComputeWorkgroupSizeX",S.MaxComputeWorkgroupSizeY="maxComputeWorkgroupSizeY",S.MaxComputeWorkgroupSizeZ="maxComputeWorkgroupSizeZ",S.MaxComputeWorkgroupsPerDimension="maxComputeWorkgroupsPerDimension",S))(E||{})});var Pe,Yt=p(()=>{w();X();Pe=class{mComputeResourceBuffer;mEncoder;constructor(e){this.mEncoder=e,this.mComputeResourceBuffer={pipeline:null,pipelineDataGroupList:new Array,highestBindGroupListIndex:-1}}computeDirect(e,t,r=1,i=1,a=1){if(e.layout!==t.layout)throw new u("Pipline data not valid for set pipeline.",this);this.setupEncoderData(e,t)&&this.mEncoder.dispatchWorkgroups(r,i,a)}computeIndirect(e,t,r){if(e.layout!==t.layout)throw new u("Pipline data not valid for set pipeline.",this);if(r.extendUsage(P.Indirect),this.setupEncoderData(e,t))if(r.size===20)this.mEncoder.dispatchWorkgroupsIndirect(r.native,0);else throw new u("Indirect compute calls can only be done with 20 or 16 byte long buffers",this)}setupEncoderData(e,t){let r=e.native;if(r===null)return!1;let i=-1,a=t.data;for(let n=0;n<a.length;n++){let s=a[n],m=this.mComputeResourceBuffer.pipelineDataGroupList[n];n>i&&(i=n),(!m||s.bindGroup!==m.bindGroup||s.offsetId!==m.offsetId)&&(this.mComputeResourceBuffer.pipelineDataGroupList[n]=s,s.bindGroup.layout.hasDynamicOffset?this.mEncoder.setBindGroup(n,s.bindGroup.native,s.offsets):this.mEncoder.setBindGroup(n,s.bindGroup.native))}if(e!==this.mComputeResourceBuffer.pipeline){if(this.mComputeResourceBuffer.pipeline=e,this.mEncoder.setPipeline(r),this.mComputeResourceBuffer.highestBindGroupListIndex>i)for(let n=i+1;n<this.mComputeResourceBuffer.highestBindGroupListIndex+1;n++)this.mEncoder.setBindGroup(n,null);this.mComputeResourceBuffer.highestBindGroupListIndex=i}return!0}}});var Be,Ht=p(()=>{Z();X();ne();G();Yt();Be=class extends v{mExecutionContext;mQueries;constructor(e,t){super(e),this.mQueries={},this.mExecutionContext=t}execute(e){let t={};this.mQueries.timestamp&&(t.timestampWrites=this.mQueries.timestamp.query);let r=this.mExecutionContext.commandEncoder.beginComputePass(t);e(new Pe(r)),r.end(),this.mQueries.timestamp&&this.mExecutionContext.commandEncoder.resolveQuerySet(this.mQueries.timestamp.query.querySet,0,2,this.mQueries.timestamp.buffer.native,0)}async probeTimestamp(){if(!this.device.capabilities.hasFeature("timestamp-query"))return[0n,0n];if(!this.mQueries.timestamp){let e=this.device.gpu.createQuerySet({type:"timestamp",count:2}),t=new L(this.device,16);t.extendUsage(GPUBufferUsage.QUERY_RESOLVE),t.extendUsage(P.CopySource),this.mQueries.timestamp={query:{querySet:e,beginningOfPassWriteIndex:0,endOfPassWriteIndex:1},buffer:t,resolver:null}}return this.mQueries.timestamp.resolver?this.mQueries.timestamp.resolver:(this.mQueries.timestamp.resolver=this.mQueries.timestamp.buffer.read(0,16).then(e=>{this.mQueries.timestamp.resolver=null;let t=new BigUint64Array(e);return[t[0],t[1]]}),this.mQueries.timestamp.resolver)}}});var Ge,_t=p(()=>{w();X();Ge=class{mEncoder;mRecordResources;mRenderResourceBuffer;mRenderTargets;mUsedResources;get usedResources(){return this.mUsedResources}constructor(e,t,r){this.mEncoder=e,this.mRenderTargets=t,this.mRecordResources=r,this.mUsedResources={parameter:new Set,indirectBuffer:new Set,pipelines:new Set,pipelineData:new Set},this.mRenderResourceBuffer={pipeline:null,vertexBuffer:new b,highestVertexParameterIndex:-1,pipelineDataGroupList:new Array,highestBindGroupListIndex:-1}}drawDirect(e,t,r,i=1,a=0){if(this.mRenderTargets.layout!==e.renderTargets)throw new u("Pipelines render targets not valid for this render pass.",this);if(t.layout!==e.module.vertexParameter)throw new u("Vertex parameter not valid for set pipeline.",this);if(e.layout!==r.layout)throw new u("Pipline data not valid for set pipeline.",this);this.mRecordResources&&(this.mUsedResources.pipelines.has(e)||this.mUsedResources.pipelines.add(e),this.mUsedResources.parameter.has(t)||this.mUsedResources.parameter.add(t),this.mUsedResources.pipelineData.has(r)||this.mUsedResources.pipelineData.add(r)),this.setupEncoderData(e,t,r)&&this.executeDirectDraw(t,i,a)}drawIndirect(e,t,r,i){if(i.extendUsage(P.Indirect),this.mRenderTargets.layout!==e.renderTargets)throw new u("Pipelines render targets not valid for this render pass.",this);if(t.layout!==e.module.vertexParameter)throw new u("Vertex parameter not valid for set pipeline.",this);if(e.layout!==r.layout)throw new u("Pipline data not valid for set pipeline.",this);this.mRecordResources&&(this.mUsedResources.pipelines.has(e)||this.mUsedResources.pipelines.add(e),this.mUsedResources.parameter.has(t)||this.mUsedResources.parameter.add(t),this.mUsedResources.pipelineData.has(r)||this.mUsedResources.pipelineData.add(r)),this.setupEncoderData(e,t,r)&&this.executeIndirectDraw(t,i)}setupEncoderData(e,t,r){let i=e.native;if(i===null)return!1;let a=-1,n=r.data;for(let l=0;l<n.length;l++){let c=n[l],d=this.mRenderResourceBuffer.pipelineDataGroupList[l];l>a&&(a=l),(!d||c.bindGroup!==d.bindGroup||c.offsetId!==d.offsetId)&&(this.mRenderResourceBuffer.pipelineDataGroupList[l]=c,c.bindGroup.layout.hasDynamicOffset?this.mEncoder.setBindGroup(l,c.bindGroup.native,c.offsets):this.mEncoder.setBindGroup(l,c.bindGroup.native))}let s=-1,m=e.module.vertexParameter.bufferNames;for(let l=0;l<m.length;l++){let c=m[l],d=t.get(c);l>s&&(s=l),d!==this.mRenderResourceBuffer.vertexBuffer.get(l)&&(this.mRenderResourceBuffer.vertexBuffer.set(l,d),this.mEncoder.setVertexBuffer(l,d.native))}if(e!==this.mRenderResourceBuffer.pipeline){if(this.mRenderResourceBuffer.pipeline=e,this.mEncoder.setPipeline(i),this.mRenderResourceBuffer.highestBindGroupListIndex>a)for(let l=a+1;l<this.mRenderResourceBuffer.highestBindGroupListIndex+1;l++);if(this.mRenderResourceBuffer.highestBindGroupListIndex=a,this.mRenderResourceBuffer.highestVertexParameterIndex>s)for(let l=s+1;l<this.mRenderResourceBuffer.highestVertexParameterIndex+1;l++);this.mRenderResourceBuffer.highestVertexParameterIndex=s}return!0}executeDirectDraw(e,t,r){e.layout.indexable?(e.indexBufferFormat===Uint16Array?this.mEncoder.setIndexBuffer(e.indexBuffer.native,"uint16"):this.mEncoder.setIndexBuffer(e.indexBuffer.native,"uint32"),this.mEncoder.drawIndexed(e.vertexCount,t,0,0,r)):this.mEncoder.draw(e.vertexCount,t,0,r)}executeIndirectDraw(e,t){if(t.size===20){if(!e.layout.indexable)throw new u("Indirect indexed draw call failed, because parameter are not indexable",this);e.indexBufferFormat===Uint16Array?this.mEncoder.setIndexBuffer(e.indexBuffer.native,"uint16"):this.mEncoder.setIndexBuffer(e.indexBuffer.native,"uint32"),this.mEncoder.drawIndexedIndirect(t.native,0)}else if(t.size===16)this.mEncoder.drawIndirect(t.native,0);else throw new u("Indirect draw calls can only be done with 20 or 16 byte long buffers",this)}}});var Le,$t=p(()=>{Z();X();ne();G();_t();Le=class extends v{mExecutionContext;mQueries;mRenderTargets;constructor(e,t,r){super(e),this.mQueries={},this.mRenderTargets=t,this.mExecutionContext=r}execute(e){let t=this.mRenderTargets.native;this.mQueries.timestamp&&(t.timestampWrites=this.mQueries.timestamp.query);let r=this.mExecutionContext.commandEncoder.beginRenderPass(t);e(new Ge(r,this.mRenderTargets,!1)),r.end(),this.mQueries.timestamp&&this.mExecutionContext.commandEncoder.resolveQuerySet(this.mQueries.timestamp.query.querySet,0,2,this.mQueries.timestamp.buffer.native,0),this.resolveCanvasTargets(this.mExecutionContext)}async probeTimestamp(){if(!this.device.capabilities.hasFeature("timestamp-query"))return[0n,0n];if(!this.mQueries.timestamp){let e=this.device.gpu.createQuerySet({type:"timestamp",count:2}),t=new L(this.device,16);t.extendUsage(GPUBufferUsage.QUERY_RESOLVE),t.extendUsage(P.CopySource),this.mQueries.timestamp={query:{querySet:e,beginningOfPassWriteIndex:0,endOfPassWriteIndex:1},buffer:t,resolver:null}}return this.mQueries.timestamp.resolver?this.mQueries.timestamp.resolver:(this.mQueries.timestamp.resolver=this.mQueries.timestamp.buffer.read(0,16).then(e=>{this.mQueries.timestamp.resolver=null;let t=new BigUint64Array(e);return[t[0],t[1]]}),this.mQueries.timestamp.resolver)}resolveCanvasTargets(e){if(this.mRenderTargets.resolveCanvasList.length!==0)if(this.mRenderTargets.layout.multisampled){let t=this.mRenderTargets.resolveCanvasList.map(r=>({view:r.source.native,resolveTarget:r.canvas.native.createView(),loadOp:"load",storeOp:"store"}));e.commandEncoder.beginRenderPass({colorAttachments:t}).end()}else for(let t of this.mRenderTargets.resolveCanvasList){let r={texture:t.source.texture.native,aspect:"all",mipLevel:t.source.mipLevelStart},i={texture:t.canvas.native,aspect:"all",mipLevel:0},a={width:this.mRenderTargets.width,height:this.mRenderTargets.height,depthOrArrayLayers:t.source.arrayLayerStart+1};e.commandEncoder.copyTextureToTexture(r,i,a)}}}});var Ae,Xt=p(()=>{G();Ht();$t();Ae=class extends v{mCommandEncoder;get commandEncoder(){return this.mCommandEncoder}constructor(e,t){super(e),this.mCommandEncoder=t}computePass(e){new Be(this.device,this).execute(e)}renderPass(e,t){new Le(this.device,e,this).execute(t)}}});var Me,qt=p(()=>{G();Xt();Me=class extends v{constructor(e){super(e)}execute(e){let t=this.device.gpu.createCommandEncoder({label:"Execution"});e(new Ae(this.device,t)),this.device.gpu.queue.submit([t.finish()])}}});var Ie,Zt=p(()=>{w();ne();Y();Ie=class{mFeatures;mLimits;constructor(e){this.mFeatures=new Set;for(let t of e.features){let r=$.cast(K,t);r&&this.mFeatures.add(r)}this.mLimits=new b;for(let t of $.valuesOf(E))this.mLimits.set(t,e.limits[t]??null)}getLimit(e){return this.mLimits.get(e)}hasFeature(e){return this.mFeatures.has(e)}}});var wt=p(()=>{});var se=p(()=>{});var Kt=p(()=>{});var B,ue=p(()=>{B=(n=>(n[n.None=0]="None",n[n.CopySource=GPUTextureUsage.COPY_SRC]="CopySource",n[n.CopyDestination=GPUTextureUsage.COPY_DST]="CopyDestination",n[n.TextureBinding=GPUTextureUsage.TEXTURE_BINDING]="TextureBinding",n[n.Storage=GPUTextureUsage.STORAGE_BINDING]="Storage",n[n.RenderAttachment=GPUTextureUsage.RENDER_ATTACHMENT]="RenderAttachment",n))(B||{})});var Fe,Qt=p(()=>{w();ne();wt();se();St();Kt();ue();Fe=class{mDevice;mFormatCapabilitys;get preferredCanvasFormat(){return globalThis.navigator.gpu.getPreferredCanvasFormat()}constructor(e){this.mDevice=e;let t=["unfilterable-float"];if(this.mDevice.capabilities.hasFeature("float32-filterable")&&t.push("float"),this.mFormatCapabilitys=new b,this.mFormatCapabilitys.set("r8unorm",{format:"r8unorm",aspect:{types:["red"],byteCost:1},dimensions:["1d","2d","3d"],type:["float","unfilterable-float"],compressionBlock:{width:1,height:1},usage:{textureBinding:!0,renderAttachment:{resolveTarget:!0,blendable:!0,multisample:!0},copy:{compatible:["r8unorm"],textureSource:!0,textureDestination:!0,imageSource:!0,imageDestination:!0},storage:!1}}),this.mFormatCapabilitys.set("r8snorm",{format:"r8snorm",aspect:{types:["red"],byteCost:1},dimensions:["1d","2d","3d"],type:["float","unfilterable-float"],compressionBlock:{width:1,height:1},usage:{textureBinding:!0,renderAttachment:!1,copy:{compatible:["r8snorm"],textureSource:!0,textureDestination:!0,imageSource:!0,imageDestination:!0},storage:!1}}),this.mFormatCapabilitys.set("r8uint",{format:"r8uint",aspect:{types:["red"],byteCost:1},dimensions:["1d","2d","3d"],type:["uint"],compressionBlock:{width:1,height:1},usage:{textureBinding:!0,renderAttachment:{resolveTarget:!1,blendable:!1,multisample:!0},copy:{compatible:["r8uint"],textureSource:!0,textureDestination:!0,imageSource:!0,imageDestination:!0},storage:!1}}),this.mFormatCapabilitys.set("r8sint",{format:"r8sint",aspect:{types:["red"],byteCost:1},dimensions:["1d","2d","3d"],type:["sint"],compressionBlock:{width:1,height:1},usage:{textureBinding:!0,renderAttachment:{resolveTarget:!1,blendable:!1,multisample:!0},copy:{compatible:["r8sint"],textureSource:!0,textureDestination:!0,imageSource:!0,imageDestination:!0},storage:!1}}),this.mFormatCapabilitys.set("r16uint",{format:"r16uint",aspect:{types:["red"],byteCost:2},dimensions:["1d","2d","3d"],type:["uint"],compressionBlock:{width:1,height:1},usage:{textureBinding:!0,renderAttachment:{resolveTarget:!1,blendable:!1,multisample:!0},copy:{compatible:["r16uint"],textureSource:!0,textureDestination:!0,imageSource:!0,imageDestination:!0},storage:!1}}),this.mFormatCapabilitys.set("r16sint",{format:"r16sint",aspect:{types:["red"],byteCost:2},dimensions:["1d","2d","3d"],type:["sint"],compressionBlock:{width:1,height:1},usage:{textureBinding:!0,renderAttachment:{resolveTarget:!1,blendable:!1,multisample:!0},copy:{compatible:["r16sint"],textureSource:!0,textureDestination:!0,imageSource:!0,imageDestination:!0},storage:!1}}),this.mFormatCapabilitys.set("r16float",{format:"r16float",aspect:{types:["red"],byteCost:2},dimensions:["1d","2d","3d"],type:["float","unfilterable-float"],compressionBlock:{width:1,height:1},usage:{textureBinding:!0,renderAttachment:{resolveTarget:!0,blendable:!0,multisample:!0},copy:{compatible:["r16float"],textureSource:!0,textureDestination:!0,imageSource:!0,imageDestination:!0},storage:!1}}),this.mFormatCapabilitys.set("rg8unorm",{format:"rg8unorm",aspect:{types:["red","green"],byteCost:1},dimensions:["1d","2d","3d"],type:["float","unfilterable-float"],compressionBlock:{width:1,height:1},usage:{textureBinding:!0,renderAttachment:{resolveTarget:!0,blendable:!0,multisample:!0},copy:{compatible:["rg8unorm"],textureSource:!0,textureDestination:!0,imageSource:!0,imageDestination:!0},storage:!1}}),this.mFormatCapabilitys.set("rg8snorm",{format:"rg8snorm",aspect:{types:["red","green"],byteCost:1},dimensions:["1d","2d","3d"],type:["float","unfilterable-float"],compressionBlock:{width:1,height:1},usage:{textureBinding:!0,renderAttachment:!1,copy:{compatible:["rg8snorm"],textureSource:!0,textureDestination:!0,imageSource:!0,imageDestination:!0},storage:!1}}),this.mFormatCapabilitys.set("rg8uint",{format:"rg8uint",aspect:{types:["red","green"],byteCost:1},dimensions:["1d","2d","3d"],type:["uint"],compressionBlock:{width:1,height:1},usage:{textureBinding:!0,renderAttachment:{resolveTarget:!1,blendable:!1,multisample:!0},copy:{compatible:["rg8uint"],textureSource:!0,textureDestination:!0,imageSource:!0,imageDestination:!0},storage:!1}}),this.mFormatCapabilitys.set("rg8sint",{format:"rg8sint",aspect:{types:["red","green"],byteCost:1},dimensions:["1d","2d","3d"],type:["sint"],compressionBlock:{width:1,height:1},usage:{textureBinding:!0,renderAttachment:{resolveTarget:!1,blendable:!1,multisample:!0},copy:{compatible:["rg8sint"],textureSource:!0,textureDestination:!0,imageSource:!0,imageDestination:!0},storage:!1}}),this.mFormatCapabilitys.set("r32uint",{format:"r32uint",aspect:{types:["red"],byteCost:4},dimensions:["1d","2d","3d"],type:["uint"],compressionBlock:{width:1,height:1},usage:{textureBinding:!0,renderAttachment:{resolveTarget:!1,blendable:!1,multisample:!1},copy:{compatible:["r32uint"],textureSource:!0,textureDestination:!0,imageSource:!0,imageDestination:!0},storage:{readonly:!0,writeonly:!0,readwrite:!0}}}),this.mFormatCapabilitys.set("r32sint",{format:"r32sint",aspect:{types:["red"],byteCost:4},dimensions:["1d","2d","3d"],type:["sint"],compressionBlock:{width:1,height:1},usage:{textureBinding:!0,renderAttachment:{resolveTarget:!1,blendable:!1,multisample:!1},copy:{compatible:["r32sint"],textureSource:!0,textureDestination:!0,imageSource:!0,imageDestination:!0},storage:{readonly:!0,writeonly:!0,readwrite:!0}}}),this.mFormatCapabilitys.set("r32float",{format:"r32float",aspect:{types:["red"],byteCost:4},dimensions:["1d","2d","3d"],type:t,compressionBlock:{width:1,height:1},usage:{textureBinding:!0,renderAttachment:{resolveTarget:!1,blendable:!1,multisample:!0},copy:{compatible:["r32float"],textureSource:!0,textureDestination:!0,imageSource:!0,imageDestination:!0},storage:{readonly:!0,writeonly:!0,readwrite:!0}}}),this.mFormatCapabilitys.set("rg16uint",{format:"rg16uint",aspect:{types:["red","green"],byteCost:2},dimensions:["1d","2d","3d"],type:["uint"],compressionBlock:{width:1,height:1},usage:{textureBinding:!0,renderAttachment:{resolveTarget:!1,blendable:!1,multisample:!0},copy:{compatible:["rg16uint"],textureSource:!0,textureDestination:!0,imageSource:!0,imageDestination:!0},storage:!1}}),this.mFormatCapabilitys.set("rg16sint",{format:"rg16sint",aspect:{types:["red","green"],byteCost:2},dimensions:["1d","2d","3d"],type:["sint"],compressionBlock:{width:1,height:1},usage:{textureBinding:!0,renderAttachment:{resolveTarget:!1,blendable:!1,multisample:!0},copy:{compatible:["rg16sint"],textureSource:!0,textureDestination:!0,imageSource:!0,imageDestination:!0},storage:!1}}),this.mFormatCapabilitys.set("rg16float",{format:"rg16float",aspect:{types:["red","green"],byteCost:2},dimensions:["1d","2d","3d"],type:["float","unfilterable-float"],compressionBlock:{width:1,height:1},usage:{textureBinding:!0,renderAttachment:{resolveTarget:!0,blendable:!0,multisample:!0},copy:{compatible:["rg16float"],textureSource:!0,textureDestination:!0,imageSource:!0,imageDestination:!0},storage:!1}}),this.mFormatCapabilitys.set("rgba8unorm",{format:"rgba8unorm",aspect:{types:["red","green","blue","alpha"],byteCost:1},dimensions:["1d","2d","3d"],type:["float","unfilterable-float"],compressionBlock:{width:1,height:1},usage:{textureBinding:!0,renderAttachment:{resolveTarget:!0,blendable:!0,multisample:!0},copy:{compatible:["rgba8unorm","rgba8unorm-srgb"],textureSource:!0,textureDestination:!0,imageSource:!0,imageDestination:!0},storage:{readonly:!0,writeonly:!0,readwrite:!1}}}),this.mFormatCapabilitys.set("rgba8unorm-srgb",{format:"rgba8unorm-srgb",aspect:{types:["red","green","blue","alpha"],byteCost:1},dimensions:["1d","2d","3d"],type:["float","unfilterable-float"],compressionBlock:{width:1,height:1},usage:{textureBinding:!0,renderAttachment:{resolveTarget:!0,blendable:!0,multisample:!0},copy:{compatible:["rgba8unorm-srgb","rgba8unorm"],textureSource:!0,textureDestination:!0,imageSource:!0,imageDestination:!0},storage:!1}}),this.mFormatCapabilitys.set("rgba8snorm",{format:"rgba8snorm",aspect:{types:["red","green","blue","alpha"],byteCost:1},dimensions:["1d","2d","3d"],type:["float","unfilterable-float"],compressionBlock:{width:1,height:1},usage:{textureBinding:!0,renderAttachment:!1,copy:{compatible:["rgba8snorm"],textureSource:!0,textureDestination:!0,imageSource:!0,imageDestination:!0},storage:{readonly:!0,writeonly:!0,readwrite:!1}}}),this.mFormatCapabilitys.set("rgba8uint",{format:"rgba8uint",aspect:{types:["red","green","blue","alpha"],byteCost:1},dimensions:["1d","2d","3d"],type:["uint"],compressionBlock:{width:1,height:1},usage:{textureBinding:!0,renderAttachment:{resolveTarget:!1,blendable:!1,multisample:!0},copy:{compatible:["rgba8uint"],textureSource:!0,textureDestination:!0,imageSource:!0,imageDestination:!0},storage:{readonly:!0,writeonly:!0,readwrite:!1}}}),this.mFormatCapabilitys.set("rgba8sint",{format:"rgba8sint",aspect:{types:["red","green","blue","alpha"],byteCost:1},dimensions:["1d","2d","3d"],type:["sint"],compressionBlock:{width:1,height:1},usage:{textureBinding:!0,renderAttachment:{resolveTarget:!1,blendable:!1,multisample:!0},copy:{compatible:["rgba8sint"],textureSource:!0,textureDestination:!0,imageSource:!0,imageDestination:!0},storage:{readonly:!0,writeonly:!0,readwrite:!1}}}),this.mFormatCapabilitys.set("bgra8unorm",{format:"bgra8unorm",aspect:{types:["red","green","blue","alpha"],byteCost:1},dimensions:["1d","2d","3d"],type:["float","unfilterable-float"],compressionBlock:{width:1,height:1},usage:{textureBinding:!0,renderAttachment:{resolveTarget:!0,blendable:!0,multisample:!0},copy:{compatible:["bgra8unorm","bgra8unorm-srgb"],textureSource:!0,textureDestination:!0,imageSource:!0,imageDestination:!0},storage:{readonly:e.capabilities.hasFeature("bgra8unorm-storage"),writeonly:!1,readwrite:!1}}}),this.mFormatCapabilitys.set("bgra8unorm-srgb",{format:"bgra8unorm-srgb",aspect:{types:["red","green","blue","alpha"],byteCost:1},dimensions:["1d","2d","3d"],type:["float","unfilterable-float"],compressionBlock:{width:1,height:1},usage:{textureBinding:!0,renderAttachment:{resolveTarget:!0,blendable:!0,multisample:!0},copy:{compatible:["bgra8unorm-srgb","bgra8unorm"],textureSource:!0,textureDestination:!0,imageSource:!0,imageDestination:!0},storage:!1}}),this.mFormatCapabilitys.set("rgb9e5ufloat",{format:"rgb9e5ufloat",aspect:{types:["red","green","blue","alpha"],byteCost:1},dimensions:["1d","2d","3d"],type:["float","unfilterable-float"],compressionBlock:{width:1,height:1},usage:{textureBinding:!0,renderAttachment:!1,copy:{compatible:["rgb9e5ufloat"],textureSource:!0,textureDestination:!0,imageSource:!0,imageDestination:!0},storage:!1}}),this.mFormatCapabilitys.set("rgb10a2uint",{format:"rgb10a2uint",aspect:{types:["red","green","blue","alpha"],byteCost:2},dimensions:["1d","2d","3d"],type:["uint"],compressionBlock:{width:1,height:1},usage:{textureBinding:!0,renderAttachment:{resolveTarget:!1,blendable:!1,multisample:!0},copy:{compatible:["rgb10a2uint"],textureSource:!0,textureDestination:!0,imageSource:!0,imageDestination:!0},storage:!1}}),this.mFormatCapabilitys.set("rgb10a2unorm",{format:"rgb10a2unorm",aspect:{types:["red","green","blue","alpha"],byteCost:2},dimensions:["1d","2d","3d"],type:["float","unfilterable-float"],compressionBlock:{width:1,height:1},usage:{textureBinding:!0,renderAttachment:{resolveTarget:!0,blendable:!0,multisample:!0},copy:{compatible:["rgb10a2unorm"],textureSource:!0,textureDestination:!0,imageSource:!0,imageDestination:!0},storage:!1}}),this.mFormatCapabilitys.set("rg11b10ufloat",{format:"rg11b10ufloat",aspect:{types:["red","green","blue","alpha"],byteCost:2},dimensions:["1d","2d","3d"],type:["float","unfilterable-float"],compressionBlock:{width:1,height:1},usage:{textureBinding:!0,renderAttachment:e.capabilities.hasFeature("rg11b10ufloat-renderable")?{resolveTarget:!0,blendable:!0,multisample:!0}:!1,copy:{compatible:["rg11b10ufloat"],textureSource:!0,textureDestination:!0,imageSource:!0,imageDestination:!0},storage:!1}}),this.mFormatCapabilitys.set("rg32uint",{format:"rg32uint",aspect:{types:["red","green"],byteCost:4},dimensions:["1d","2d","3d"],type:["uint"],compressionBlock:{width:1,height:1},usage:{textureBinding:!0,renderAttachment:{resolveTarget:!1,blendable:!1,multisample:!1},copy:{compatible:["rg32uint"],textureSource:!0,textureDestination:!0,imageSource:!0,imageDestination:!0},storage:{readonly:!0,writeonly:!0,readwrite:!1}}}),this.mFormatCapabilitys.set("rg32sint",{format:"rg32sint",aspect:{types:["red","green"],byteCost:4},dimensions:["1d","2d","3d"],type:["sint"],compressionBlock:{width:1,height:1},usage:{textureBinding:!0,renderAttachment:{resolveTarget:!1,blendable:!1,multisample:!1},copy:{compatible:["rg32sint"],textureSource:!0,textureDestination:!0,imageSource:!0,imageDestination:!0},storage:{readonly:!0,writeonly:!0,readwrite:!1}}}),this.mFormatCapabilitys.set("rg32float",{format:"rg32float",aspect:{types:["red","green"],byteCost:4},dimensions:["1d","2d","3d"],type:t,compressionBlock:{width:1,height:1},usage:{textureBinding:!0,renderAttachment:{resolveTarget:!1,blendable:!1,multisample:!1},copy:{compatible:["rg32float"],textureSource:!0,textureDestination:!0,imageSource:!0,imageDestination:!0},storage:{readonly:!0,writeonly:!0,readwrite:!1}}}),this.mFormatCapabilitys.set("rgba16uint",{format:"rgba16uint",aspect:{types:["red","green","blue","alpha"],byteCost:2},dimensions:["1d","2d","3d"],type:["uint"],compressionBlock:{width:1,height:1},usage:{textureBinding:!0,renderAttachment:{resolveTarget:!1,blendable:!1,multisample:!0},copy:{compatible:["rgba16uint"],textureSource:!0,textureDestination:!0,imageSource:!0,imageDestination:!0},storage:{readonly:!0,writeonly:!0,readwrite:!1}}}),this.mFormatCapabilitys.set("rgba16sint",{format:"rgba16sint",aspect:{types:["red","green","blue","alpha"],byteCost:2},dimensions:["1d","2d","3d"],type:["sint"],compressionBlock:{width:1,height:1},usage:{textureBinding:!0,renderAttachment:{resolveTarget:!1,blendable:!1,multisample:!0},copy:{compatible:["rgba16sint"],textureSource:!0,textureDestination:!0,imageSource:!0,imageDestination:!0},storage:{readonly:!0,writeonly:!0,readwrite:!1}}}),this.mFormatCapabilitys.set("rgba16float",{format:"rgba16float",aspect:{types:["red","green","blue","alpha"],byteCost:2},dimensions:["1d","2d","3d"],type:["float","unfilterable-float"],compressionBlock:{width:1,height:1},usage:{textureBinding:!0,renderAttachment:{resolveTarget:!0,blendable:!0,multisample:!0},copy:{compatible:["rgba16float"],textureSource:!0,textureDestination:!0,imageSource:!0,imageDestination:!0},storage:{readonly:!0,writeonly:!0,readwrite:!1}}}),this.mFormatCapabilitys.set("rgba32uint",{format:"rgba32uint",aspect:{types:["red","green","blue","alpha"],byteCost:4},dimensions:["1d","2d","3d"],type:["uint"],compressionBlock:{width:1,height:1},usage:{textureBinding:!0,renderAttachment:{resolveTarget:!1,blendable:!1,multisample:!1},copy:{compatible:["rgba32uint"],textureSource:!0,textureDestination:!0,imageSource:!0,imageDestination:!0},storage:{readonly:!0,writeonly:!0,readwrite:!1}}}),this.mFormatCapabilitys.set("rgba32sint",{format:"rgba32sint",aspect:{types:["red","green","blue","alpha"],byteCost:4},dimensions:["1d","2d","3d"],type:["sint"],compressionBlock:{width:1,height:1},usage:{textureBinding:!0,renderAttachment:{resolveTarget:!1,blendable:!1,multisample:!1},copy:{compatible:["rgba32sint"],textureSource:!0,textureDestination:!0,imageSource:!0,imageDestination:!0},storage:{readonly:!0,writeonly:!0,readwrite:!1}}}),this.mFormatCapabilitys.set("rgba32float",{format:"rgba32float",aspect:{types:["red","green","blue","alpha"],byteCost:4},dimensions:["1d","2d","3d"],type:t,compressionBlock:{width:1,height:1},usage:{textureBinding:!0,renderAttachment:{resolveTarget:!1,blendable:!1,multisample:!1},copy:{compatible:["rgba32float"],textureSource:!0,textureDestination:!0,imageSource:!0,imageDestination:!0},storage:{readonly:!0,writeonly:!0,readwrite:!1}}}),this.mFormatCapabilitys.set("stencil8",{format:"stencil8",aspect:{types:["stencil"],byteCost:1},dimensions:["1d","2d"],type:["uint"],compressionBlock:{width:1,height:1},usage:{textureBinding:!0,renderAttachment:{resolveTarget:!1,blendable:!1,multisample:!0},copy:{compatible:["stencil8"],textureSource:!0,textureDestination:!0,imageSource:!0,imageDestination:!0},storage:!1}}),this.mFormatCapabilitys.set("depth16unorm",{format:"depth16unorm",aspect:{types:["depth"],byteCost:2},dimensions:["1d","2d"],type:["depth","unfilterable-float"],compressionBlock:{width:1,height:1},usage:{textureBinding:!0,renderAttachment:{resolveTarget:!1,blendable:!1,multisample:!0},copy:{compatible:["depth16unorm"],textureSource:!0,textureDestination:!0,imageSource:!0,imageDestination:!0},storage:!1}}),this.mFormatCapabilitys.set("depth24plus",{format:"depth24plus",aspect:{types:["depth"],byteCost:4},dimensions:["1d","2d"],type:["depth","unfilterable-float"],compressionBlock:{width:1,height:1},usage:{textureBinding:!0,renderAttachment:{resolveTarget:!1,blendable:!1,multisample:!0},copy:{compatible:["depth24plus"],textureSource:!0,textureDestination:!0,imageSource:!1,imageDestination:!1},storage:!1}}),this.mFormatCapabilitys.set("depth24plusStencil8",{format:"depth24plusStencil8",aspect:{types:["depth","stencil"],byteCost:2},dimensions:["1d","2d"],type:["depth","unfilterable-float","uint"],compressionBlock:{width:1,height:1},usage:{textureBinding:!0,renderAttachment:{resolveTarget:!1,blendable:!1,multisample:!0},copy:{compatible:["depth24plusStencil8"],textureSource:!0,textureDestination:!0,imageSource:!1,imageDestination:!1},storage:!1}}),this.mFormatCapabilitys.set("depth32float",{format:"depth32float",aspect:{types:["depth"],byteCost:4},dimensions:["1d","2d"],type:["depth","unfilterable-float"],compressionBlock:{width:1,height:1},usage:{textureBinding:!0,renderAttachment:{resolveTarget:!1,blendable:!1,multisample:!0},copy:{compatible:["depth32float"],textureSource:!0,textureDestination:!0,imageSource:!0,imageDestination:!1},storage:!1}}),e.capabilities.hasFeature("depth32float-stencil8")&&this.mFormatCapabilitys.set("depth32floatStencil8",{format:"depth32floatStencil8",aspect:{types:["depth","stencil"],byteCost:4},dimensions:["1d","2d"],type:["depth","unfilterable-float","uint"],compressionBlock:{width:1,height:1},usage:{textureBinding:!0,renderAttachment:{resolveTarget:!1,blendable:!1,multisample:!0},copy:{compatible:["depth32floatStencil8"],textureSource:!0,textureDestination:!0,imageSource:!0,imageDestination:!1},storage:!1}}),e.capabilities.hasFeature("texture-compression-bc")){let r=(i,a,n,s)=>{let m={format:i,aspect:{types:a,byteCost:n},dimensions:["1d","2d"],type:["unfilterable-float","float"],compressionBlock:{width:4,height:4},usage:{textureBinding:!0,renderAttachment:!1,copy:{compatible:[i,...s],textureSource:!0,textureDestination:!0,imageSource:!0,imageDestination:!0},storage:!1}};return e.capabilities.hasFeature("texture-compression-bc-sliced-3d")&&m.dimensions.push("3d"),m};this.mFormatCapabilitys.set("bc1-rgba-unorm",r("bc1-rgba-unorm",["red","green","blue","alpha"],2,["bc1-rgba-unorm-srgb"])),this.mFormatCapabilitys.set("bc1-rgba-unorm-srgb",r("bc1-rgba-unorm-srgb",["red","green","blue","alpha"],2,["bc1-rgba-unorm"])),this.mFormatCapabilitys.set("bc2-rgba-unorm",r("bc2-rgba-unorm",["red","green","blue","alpha"],4,["bc2-rgba-unorm-srgb"])),this.mFormatCapabilitys.set("bc2-rgba-unorm-srgb",r("bc2-rgba-unorm-srgb",["red","green","blue","alpha"],4,["bc2-rgba-unorm"])),this.mFormatCapabilitys.set("bc3-rgba-unorm",r("bc3-rgba-unorm",["red","green","blue","alpha"],4,["bc3-rgba-unorm-srgb"])),this.mFormatCapabilitys.set("bc3-rgba-unorm-srgb",r("bc3-rgba-unorm-srgb",["red","green","blue","alpha"],4,["bc3-rgba-unorm"])),this.mFormatCapabilitys.set("bc4-r-unorm",r("bc4-r-unorm",["red"],8,[])),this.mFormatCapabilitys.set("bc4-r-snorm",r("bc4-r-snorm",["red"],8,[])),this.mFormatCapabilitys.set("bc5-rg-unorm",r("bc5-rg-unorm",["red","green"],8,[])),this.mFormatCapabilitys.set("bc5-rg-snorm",r("bc5-rg-snorm",["red","green"],8,[])),this.mFormatCapabilitys.set("bc6h-rgb-ufloat",r("bc6h-rgb-ufloat",["red","green","blue"],4,[])),this.mFormatCapabilitys.set("bc6h-rgb-float",r("bc6h-rgb-float",["red","green","blue"],4,[])),this.mFormatCapabilitys.set("bc7-rgba-unorm",r("bc7-rgba-unorm",["red","green","blue","alpha"],4,["bc7-rgba-unorm-srgb"])),this.mFormatCapabilitys.set("bc7-rgba-unorm-srgb",r("bc7-rgba-unorm-srgb",["red","green","blue","alpha"],4,["bc7-rgba-unorm"]))}if(e.capabilities.hasFeature("texture-compression-etc2")){let r=(i,a,n,s)=>({format:i,aspect:{types:a,byteCost:n},dimensions:["1d","2d"],type:["unfilterable-float","float"],compressionBlock:{width:4,height:4},usage:{textureBinding:!0,renderAttachment:!1,copy:{compatible:[i,...s],textureSource:!0,textureDestination:!0,imageSource:!0,imageDestination:!0},storage:!1}});this.mFormatCapabilitys.set("etc2-rgb8unorm",r("etc2-rgb8unorm",["red","green","blue"],2,["etc2-rgb8unorm-srgb"])),this.mFormatCapabilitys.set("etc2-rgb8unorm-srgb",r("etc2-rgb8unorm-srgb",["red","green","blue"],2,["etc2-rgb8unorm"])),this.mFormatCapabilitys.set("etc2-rgb8a1unorm",r("etc2-rgb8a1unorm",["red","green","blue","alpha"],2,["etc2-rgb8a1unorm-srgb"])),this.mFormatCapabilitys.set("etc2-rgb8a1unorm-srgb",r("etc2-rgb8a1unorm-srgb",["red","green","blue","alpha"],2,["etc2-rgb8a1unorm"])),this.mFormatCapabilitys.set("etc2-rgba8unorm",r("etc2-rgba8unorm",["red","green","blue","alpha"],4,["etc2-rgba8unorm-srgb"])),this.mFormatCapabilitys.set("etc2-rgba8unorm-srgb",r("etc2-rgba8unorm-srgb",["red","green","blue","alpha"],4,["etc2-rgba8unorm"])),this.mFormatCapabilitys.set("eac-r11unorm",r("eac-r11unorm",["red"],8,[])),this.mFormatCapabilitys.set("eac-r11snorm",r("eac-r11snorm",["red"],8,[])),this.mFormatCapabilitys.set("eac-rg11unorm",r("eac-rg11unorm",["red","green"],8,[])),this.mFormatCapabilitys.set("eac-rg11snorm",r("eac-rg11snorm",["red","green"],8,[]))}if(e.capabilities.hasFeature("texture-compression-astc")){let r=(i,a,n)=>({format:i,aspect:{types:["red","green","blue","alpha"],byteCost:4},dimensions:["1d","2d"],type:["unfilterable-float","float"],compressionBlock:{width:a[0],height:a[1]},usage:{textureBinding:!0,renderAttachment:!1,copy:{compatible:[i,...n],textureSource:!0,textureDestination:!0,imageSource:!0,imageDestination:!0},storage:!1}});this.mFormatCapabilitys.set("astc-4x4-unorm",r("astc-4x4-unorm",[4,4],["astc-4x4-unorm-srgb"])),this.mFormatCapabilitys.set("astc-4x4-unorm-srgb",r("astc-4x4-unorm-srgb",[4,4],["astc-4x4-unorm"])),this.mFormatCapabilitys.set("astc-5x4-unorm",r("astc-5x4-unorm",[5,4],["astc-5x4-unorm-srgb"])),this.mFormatCapabilitys.set("astc-5x4-unorm-srgb",r("astc-5x4-unorm-srgb",[5,4],["astc-5x4-unorm"])),this.mFormatCapabilitys.set("astc-5x5-unorm",r("astc-5x5-unorm",[5,5],["astc-5x5-unorm-srgb"])),this.mFormatCapabilitys.set("astc-5x5-unorm-srgb",r("astc-5x5-unorm-srgb",[5,5],["astc-5x5-unorm"])),this.mFormatCapabilitys.set("astc-6x5-unorm",r("astc-6x5-unorm",[6,5],["astc-6x5-unorm-srgb"])),this.mFormatCapabilitys.set("astc-6x5-unorm-srgb",r("astc-6x5-unorm-srgb",[6,5],["astc-6x5-unorm"])),this.mFormatCapabilitys.set("astc-6x6-unorm",r("astc-6x6-unorm",[6,6],["astc-6x6-unorm-srgb"])),this.mFormatCapabilitys.set("astc-6x6-unorm-srgb",r("astc-6x6-unorm-srgb",[6,6],["astc-6x6-unorm"])),this.mFormatCapabilitys.set("astc-8x5-unorm",r("astc-8x5-unorm",[8,5],["astc-8x5-unorm-srgb"])),this.mFormatCapabilitys.set("astc-8x5-unorm-srgb",r("astc-8x5-unorm-srgb",[8,5],["astc-8x5-unorm"])),this.mFormatCapabilitys.set("astc-8x6-unorm",r("astc-8x6-unorm",[8,6],["astc-8x6-unorm-srgb"])),this.mFormatCapabilitys.set("astc-8x6-unorm-srgb",r("astc-8x6-unorm-srgb",[8,6],["astc-8x6-unorm"])),this.mFormatCapabilitys.set("astc-8x8-unorm",r("astc-8x8-unorm",[8,8],["astc-8x8-unorm-srgb"])),this.mFormatCapabilitys.set("astc-8x8-unorm-srgb",r("astc-8x8-unorm-srgb",[8,8],["astc-8x8-unorm"])),this.mFormatCapabilitys.set("astc-10x5-unorm",r("astc-10x5-unorm",[10,5],["astc-10x5-unorm-srgb"])),this.mFormatCapabilitys.set("astc-10x5-unorm-srgb",r("astc-10x5-unorm-srgb",[10,5],["astc-10x5-unorm"])),this.mFormatCapabilitys.set("astc-10x6-unorm",r("astc-10x6-unorm",[10,6],["astc-10x6-unorm-srgb"])),this.mFormatCapabilitys.set("astc-10x6-unorm-srgb",r("astc-10x6-unorm-srgb",[10,6],["astc-10x6-unorm"])),this.mFormatCapabilitys.set("astc-10x8-unorm",r("astc-10x8-unorm",[10,8],["astc-10x8-unorm-srgb"])),this.mFormatCapabilitys.set("astc-10x8-unorm-srgb",r("astc-10x8-unorm-srgb",[10,8],["astc-10x8-unorm"])),this.mFormatCapabilitys.set("astc-10x10-unorm",r("astc-10x10-unorm",[10,10],["astc-10x10-unorm-srgb"])),this.mFormatCapabilitys.set("astc-10x10-unorm-srgb",r("astc-10x10-unorm-srgb",[10,10],["astc-10x10-unorm"])),this.mFormatCapabilitys.set("astc-12x10-unorm",r("astc-12x10-unorm",[12,10],["astc-12x10-unorm-srgb"])),this.mFormatCapabilitys.set("astc-12x10-unorm-srgb",r("astc-12x10-unorm-srgb",[12,10],["astc-12x10-unorm"])),this.mFormatCapabilitys.set("astc-12x12-unorm",r("astc-12x12-unorm",[12,12],["astc-12x12-unorm-srgb"])),this.mFormatCapabilitys.set("astc-12x12-unorm-srgb",r("astc-12x12-unorm-srgb",[12,12],["astc-12x12-unorm"]))}}capabilityOf(e){let t=this.mFormatCapabilitys.get(e);if(!t)throw new u(`Format "${e}" has no capabilities.`,this);let r=new Set;t.usage.copy&&((t.usage.copy.imageSource||t.usage.copy.textureSource)&&r.add(B.CopySource),(t.usage.copy.imageDestination||t.usage.copy.textureDestination)&&r.add(B.CopyDestination)),t.usage.textureBinding&&r.add(B.TextureBinding),t.usage.storage&&r.add(B.Storage),t.usage.renderAttachment&&r.add(B.RenderAttachment);let i=(()=>{let a=new Set(t.type);return a.has("float")?[a,"float"]:a.has("uint")?[a,"uint"]:a.has("sint")?[a,"sint"]:a.has("sint")?[a,"sint"]:a.has("depth")?[a,"depth"]:[a,"unfilterable-float"]})();return{format:t.format,copyCompatible:new Set(t.usage.copy?t.usage.copy.compatible:[]),textureUsages:r,dimensions:new Set(t.dimensions),aspects:new Set(t.aspect.types),sampleTypes:{primary:i[1],all:i[0]},renderAttachment:{resolveTarget:t.usage.renderAttachment?t.usage.renderAttachment.resolveTarget:!1,multisample:t.usage.renderAttachment?t.usage.renderAttachment.multisample:!1,blendable:t.usage.renderAttachment?t.usage.renderAttachment.blendable:!1},storage:{readonly:t.usage.storage?t.usage.storage.readonly:!1,writeonly:t.usage.storage?t.usage.storage.writeonly:!1,readwrite:t.usage.storage?t.usage.storage.readwrite:!1},copy:{textureSource:t.usage.copy?t.usage.copy.textureSource:!1,textureTarget:t.usage.copy?t.usage.copy.textureDestination:!1,imageSource:t.usage.copy?t.usage.copy.imageSource:!1,imageTarget:t.usage.copy?t.usage.copy.imageDestination:!1}}}}});var Ue,Jt=p(()=>{w();Y();qt();Zt();Qt();Ue=class o{static async readDeviceLimits(e){let t=await globalThis.navigator.gpu.requestAdapter({powerPreference:e});if(!t)throw new u("Error requesting GPU adapter",o);let r={};for(let i of $.valuesOf(E))r[i]=t.limits[i]??null;return r}static async request(e,t){let r=await globalThis.navigator.gpu.requestAdapter({powerPreference:e});if(!r)throw new u("Error requesting GPU adapter",o);let i=new Array,a={};if(t){if(t.features)for(let s of t.features){if(!r.features.has(s.name)){if(s.required)throw new u(`No Gpu found with the required feature "${s.name}"`,this);continue}i.push(s.name)}if(t.limits)for(let s of t.limits){let m=r.limits[s.name];if(typeof m>"u")throw new u(`Gpu does not support any "${s.name}" limit.`,this);let l=s.value;if(m<s.value){if(s.required)throw new u(`No Gpu found with the required limit "${s.name}" (has: ${m}, required: ${s.value})`,this);l=m}a[s.name]=l}}let n=await r.requestDevice({requiredFeatures:i,requiredLimits:a});if(!n)throw new u("Error requesting GPU device",o);return new o(n)}mCapabilities;mFormatValidator;mFrameChangeListener;mGpuDevice;mFreeableGpuObjects;mFreeableGpuObjectIndex;mFreeableGpuObjectResources;get capabilities(){return this.mCapabilities}get formatValidator(){return this.mFormatValidator}get gpu(){return this.mGpuDevice}constructor(e){this.mGpuDevice=e,this.mCapabilities=new Ie(e),this.mFormatValidator=new Fe(this),this.mFrameChangeListener=new N,this.mFreeableGpuObjects=new Array,this.mFreeableGpuObjectIndex=0,this.mFreeableGpuObjectResources=new Map}addTickListener(e){this.mFrameChangeListener.push(e)}deconstruct(){for(let e of this.mFreeableGpuObjects)if(this.mFreeableGpuObjectResources.has(e)){for(let t of this.mFreeableGpuObjectResources.get(e))t.destroy();this.mFreeableGpuObjectResources.delete(e)}this.mFreeableGpuObjects.splice(0,this.mFreeableGpuObjects.length),this.mGpuDevice.destroy()}execute(e){new Me(this).execute(e)}removeTickListener(e){this.mFrameChangeListener.remove(e)}registerFreeableResource(e,t){let r=new WeakRef(e);this.mFreeableGpuObjects.push(r),this.mFreeableGpuObjectResources.set(r,t)}processTick(){for(let t of this.mFrameChangeListener)t();let e=Math.min(10,this.mFreeableGpuObjects.length);for(let t=0;t<e;t++){let r=this.mFreeableGpuObjects[this.mFreeableGpuObjectIndex];if(!r.deref()){if(this.mFreeableGpuObjectResources.has(r)){for(let a of this.mFreeableGpuObjectResources.get(r))a.destroy();this.mFreeableGpuObjectResources.delete(r)}this.mFreeableGpuObjects.splice(this.mFreeableGpuObjectIndex,1)}++this.mFreeableGpuObjectIndex>=this.mFreeableGpuObjects.length&&(this.mFreeableGpuObjectIndex=0)}}}});var J,Tt=p(()=>{oe();q();J=class extends j{mArrayLayerEnd;mArrayLayerStart;mDimension;mFormat;mMipLevelEnd;mMipLevelStart;mMultisampled;mTexture;get arrayLayerEnd(){return this.mArrayLayerEnd}set arrayLayerEnd(e){this.mArrayLayerEnd=e,this.invalidate("ResourceRebuild")}get arrayLayerStart(){return this.mArrayLayerStart}set arrayLayerStart(e){this.mArrayLayerStart=e,this.invalidate("ResourceRebuild")}get dimension(){return this.mDimension}get format(){return this.mFormat}get mipLevelEnd(){return this.mMipLevelEnd}set mipLevelEnd(e){this.mMipLevelEnd=e,this.invalidate("ResourceRebuild")}get mipLevelStart(){return this.mMipLevelStart}set mipLevelStart(e){this.mMipLevelStart=e,this.invalidate("ResourceRebuild")}get multisampled(){return this.mMultisampled}get native(){return super.native}get texture(){return this.mTexture}constructor(e,t,r,i,a){super(e),this.mTexture=t,this.mDimension=r,this.mFormat=i,this.mMultisampled=a,this.mMipLevelStart=0,this.mMipLevelEnd=-1,this.mArrayLayerStart=0,this.mArrayLayerEnd=-1,t.addInvalidationListener(()=>{this.invalidate("ResourceRebuild")},"ResourceRebuild")}generateNative(){let e=this.mTexture.native,t=this.mMipLevelEnd<0?e.mipLevelCount-1:this.mMipLevelEnd,r=this.mArrayLayerEnd<0?e.depthOrArrayLayers-1:this.mArrayLayerEnd,i=(()=>{switch(this.mDimension){case"1d":case"2d":return 1;case"cube":return 6;case"cube-array":return Math.floor((r-this.mArrayLayerStart+1)/6)*6;case"2d-array":case"3d":return r-this.mArrayLayerStart+1;default:return 1}})();return e.createView({aspect:"all",format:this.mFormat,dimension:this.mDimension,baseMipLevel:this.mMipLevelStart,mipLevelCount:t-this.mMipLevelStart+1,baseArrayLayer:this.mArrayLayerStart,arrayLayerCount:i})}}});var er=p(()=>{});var tr=p(()=>{});var ee,Rt=p(()=>{w();er();xt();tr();q();ee=class extends j{mCompare;mLodMaxClamp;mLodMinClamp;mMagFilter;mMaxAnisotropy;mMinFilter;mMipmapFilter;mSamplerType;mWrapMode;get compare(){return this.mCompare}set compare(e){this.mCompare=e,this.invalidate("ResourceRebuild")}get lodMaxClamp(){return this.mLodMaxClamp}set lodMaxClamp(e){this.mLodMaxClamp=e,this.invalidate("ResourceRebuild")}get lodMinClamp(){return this.mLodMinClamp}set lodMinClamp(e){this.mLodMinClamp=e,this.invalidate("ResourceRebuild")}get magFilter(){return this.mMagFilter}set magFilter(e){this.mMagFilter=e,this.invalidate("ResourceRebuild")}get maxAnisotropy(){return this.mMaxAnisotropy}set maxAnisotropy(e){this.mMaxAnisotropy=e,this.invalidate("ResourceRebuild")}get minFilter(){return this.mMinFilter}set minFilter(e){this.mMinFilter=e,this.invalidate("ResourceRebuild")}get mipmapFilter(){return this.mMipmapFilter}set mipmapFilter(e){this.mMipmapFilter=e,this.invalidate("ResourceRebuild")}get native(){return super.native}get samplerType(){return this.mSamplerType}get wrapMode(){return this.mWrapMode}set wrapMode(e){this.mWrapMode=e,this.invalidate("ResourceRebuild")}constructor(e,t){super(e),this.mSamplerType=t,this.mCompare=null,this.mWrapMode="clamp-to-edge",this.mMagFilter="linear",this.mMinFilter="linear",this.mMipmapFilter="linear",this.mLodMinClamp=0,this.mLodMaxClamp=32,this.mMaxAnisotropy=16}generateNative(){let e={label:"Texture-Sampler",addressModeU:this.wrapMode,addressModeV:this.wrapMode,addressModeW:this.wrapMode,magFilter:this.magFilter,minFilter:this.minFilter,mipmapFilter:this.mipmapFilter,lodMaxClamp:this.lodMaxClamp,lodMinClamp:this.lodMinClamp,maxAnisotropy:this.maxAnisotropy};if(this.mSamplerType==="comparison"){if(!this.compare)throw new u("No compare function is set for a comparison sampler.",this);e.compare=this.compare}return this.device.gpu.createSampler(e)}}});var A,te=p(()=>{w();A=class{mSetupCallback;mSetupReference;get device(){return this.mSetupReference.device}get setupData(){return this.mSetupReference.data}get setupReferences(){return this.mSetupReference}constructor(e,t){this.mSetupReference=e,this.mSetupCallback=t}ensureThatInSetup(){if(!this.mSetupReference.inSetup)throw new u("Can only setup in a setup call.",this)}sendData(...e){this.mSetupCallback(...e)}}});var re,Ct=p(()=>{w();Y();se();ue();oe();q();Tt();re=class o extends j{mDepth;mDimension;mFormat;mHeight;mMipLevelCount;mMultisampled;mWidth;get depth(){return this.mDepth}set depth(e){this.mDepth=e,this.invalidate("ResourceRebuild")}get dimension(){return this.mDimension}get format(){return this.mFormat}get height(){return this.mHeight}set height(e){this.mHeight=e,this.invalidate("ResourceRebuild")}get mipCount(){return this.mMipLevelCount}set mipCount(e){this.mMipLevelCount=e,this.invalidate("ResourceRebuild")}get multiSampled(){return this.mMultisampled}get native(){return super.native}get width(){return this.mWidth}set width(e){this.mWidth=e,this.invalidate("ResourceRebuild")}constructor(e,t){super(e),this.extendUsage(B.CopyDestination),this.extendUsage(B.CopySource),this.mDimension=t.dimension,this.mFormat=t.format,this.mMultisampled=t.multisampled,this.mMipLevelCount=1,this.mDepth=1,this.mHeight=1,this.mWidth=1}copyFrom(...e){let t=new Array;for(let a=0;a<e.length;a++){let n=e[a];if(!("data"in n)){switch(!0){case n instanceof o:{t.push({data:n,mipLevel:0,external:!1,dimension:{width:n.width,height:n.height,depthOrArrayLayers:n.depth},sourceOrigin:{x:0,y:0,z:0},targetOrigin:{x:0,y:0,z:a}});continue}case n instanceof ImageBitmap:{t.push({data:n,mipLevel:0,external:!0,dimension:{width:n.width,height:n.height,depthOrArrayLayers:1},sourceOrigin:{x:0,y:0,z:0},targetOrigin:{x:0,y:0,z:a}});continue}}continue}let s=!(n instanceof o);t.push({data:n.data,external:s,mipLevel:n.mipLevel??0,dimension:{width:n.dimension?.width??n.data.width,height:n.dimension?.height??n.data.height,depthOrArrayLayers:n.dimension?.depth??("depth"in n.data?n.data.depth:1)},sourceOrigin:n.sourceOrigin??{x:0,y:0,z:0},targetOrigin:n.targetOrigin??{x:0,y:0,z:0}})}this.extendUsage(B.CopyDestination),this.extendUsage(B.RenderAttachment);let r={texture:this.native,aspect:"all"},i=this.device.gpu.createCommandEncoder();for(let a of t){if(r.texture.mipLevelCount<a.mipLevel)continue;r.origin=a.targetOrigin,r.mipLevel=a.mipLevel;let n={width:Math.floor(r.texture.width/Math.pow(2,r.mipLevel)),height:Math.floor(r.texture.height/Math.pow(2,r.mipLevel)),depthOrArrayLayers:r.texture.dimension==="3d"?Math.floor(r.texture.depthOrArrayLayers/Math.pow(2,r.mipLevel)):r.texture.depthOrArrayLayers},s={width:Math.min(n.width-a.targetOrigin.x,a.dimension.width-a.sourceOrigin.x),height:Math.min(n.height-a.targetOrigin.y,a.dimension.height-a.sourceOrigin.y),depthOrArrayLayers:Math.min(n.depthOrArrayLayers-a.targetOrigin.z,a.dimension.depthOrArrayLayers-a.sourceOrigin.z)};if(s.width<1||s.height<1||s.depthOrArrayLayers<1)continue;if(a.external){let l={source:a.data,origin:[a.sourceOrigin.x,a.sourceOrigin.y]};this.device.gpu.queue.copyExternalImageToTexture(l,r,s);continue}let m={texture:a.data.native,aspect:"all",origin:a.targetOrigin,mipLevel:0};i.copyTextureToTexture(m,r,s)}this.device.gpu.queue.submit([i.finish()])}useAs(e){let t=e??(()=>{switch(this.mDimension){case"1d":return"1d";case"2d":return"2d";case"3d":return"3d"}})();return new J(this.device,this,t,this.mFormat,this.mMultisampled)}destroyNative(e){this.unregisterFreeableResource(e),e.destroy()}generateNative(e){let t=(()=>{switch(this.mDimension){case"1d":{let a=this.device.capabilities.getLimit("maxTextureDimension1D");if(this.mWidth>a)throw new u(`Texture dimension exeeced for 1D Texture(${this.mWidth}).`,this);return{textureDimension:"1d",clampedDimensions:[this.mWidth,1,1]}}case"2d":{let a=this.device.capabilities.getLimit("maxTextureDimension1D");if(this.mWidth>a||this.mHeight>a)throw new u(`Texture dimension exeeced for 2D Texture(${this.mWidth}, ${this.mHeight}).`,this);let n=this.device.capabilities.getLimit("maxTextureArrayLayers");if(this.mDepth>n)throw new u(`Texture array layer exeeced for 2D Texture(${this.mDepth}).`,this);return{textureDimension:"2d",clampedDimensions:[this.mWidth,this.mHeight,this.mDepth]}}case"3d":{let a=this.device.capabilities.getLimit("maxTextureDimension3D");if(this.mWidth>a||this.mHeight>a||this.mDepth>a)throw new u(`Texture dimension exeeced for 3D Texture(${this.mWidth}, ${this.mHeight}, ${this.mDepth}).`,this);return{textureDimension:"3d",clampedDimensions:[this.mWidth,this.mHeight,this.mDepth]}}}})(),r;t.textureDimension==="3d"?r=1+Math.floor(Math.log2(Math.max(this.mWidth,this.mHeight,this.mDepth))):r=1+Math.floor(Math.log2(Math.max(this.mWidth,this.mHeight)));let i=this.device.gpu.createTexture({label:"GPU-Texture",size:t.clampedDimensions,format:this.mFormat,usage:this.usage,dimension:t.textureDimension,sampleCount:this.mMultisampled?4:1,mipLevelCount:Math.min(this.mMipLevelCount,r)});if(this.registerFreeableResource(i),e!==null&&i.sampleCount===1){let a=this.device.gpu.createCommandEncoder(),n=Math.min(i.mipLevelCount,e.mipLevelCount);for(let s=0;s<n;s++){let m={texture:e,aspect:"all",origin:[0,0,0],mipLevel:s},l={texture:i,aspect:"all",origin:[0,0,0],mipLevel:s},c={width:Math.floor(i.width/Math.pow(2,s)),height:Math.floor(i.height/Math.pow(2,s)),depthOrArrayLayers:i.dimension==="3d"?Math.floor(i.depthOrArrayLayers/Math.pow(2,s)):i.depthOrArrayLayers},d={width:Math.floor(e.width/Math.pow(2,s)),height:Math.floor(e.height/Math.pow(2,s)),depthOrArrayLayers:e.dimension==="3d"?Math.floor(e.depthOrArrayLayers/Math.pow(2,s)):e.depthOrArrayLayers},g={width:Math.min(d.width,c.width),height:Math.min(d.height,c.height),depthOrArrayLayers:Math.min(d.depthOrArrayLayers,c.depthOrArrayLayers)};a.copyTextureToTexture(m,l,g)}this.device.gpu.queue.submit([a.finish()])}return i}}});var Ee,rr=p(()=>{w();Z();Y();Q();se();oe();te();Ct();Rt();Ee=class extends A{mBindLayout;mCurrentData;constructor(e,t,r,i){super(r,i),this.mCurrentData=t,this.mBindLayout=e}createBuffer(e){let t=this.createEmptyBuffer(e??null);return this.sendData(t),t}createBufferWithRawData(e){if(this.mBindLayout.resource.type!=="buffer")throw new u("Bind data layout is not suitable for buffers.",this);let t=this.mBindLayout.resource,i=((()=>{if(t.variableSize===0)return 0;let s=(e.byteLength-t.fixedSize)/t.variableSize;if(s%1>0)throw new u(`Raw bind group data buffer data "${this.mBindLayout.name}" does not meet alignment.`,this);return s})()??0)*t.variableSize+t.fixedSize;if(this.mBindLayout.hasDynamicOffset){let n=this.mBindLayout.storageType===0?this.device.capabilities.getLimit("minUniformBufferOffsetAlignment"):this.device.capabilities.getLimit("minStorageBufferOffsetAlignment");i=Math.ceil(i/n)*n,i*=Math.floor(e.byteLength/i)}if(e.byteLength!==i)throw new u(`Raw bind group data buffer data "${this.mBindLayout.name}" does not meet data size (Should:${i} => Has:${e.byteLength}) requirements.`,this);let a=new L(this.device,i).initialData(e);return this.sendData(a),a}createSampler(){if(this.mBindLayout.resource.type!=="sampler")throw new u("Bind data layout is not setup for samplers.",this);let e=new ee(this.device,this.mBindLayout.resource.samplerType);return this.sendData(e),e}createTexture(){if(this.mBindLayout.resource.type!=="texture")throw new u("Bind data layout is not setup for textures.",this);let e=this.mBindLayout.resource,t=(()=>{switch(e.dimension){case"1d":return"1d";case"2d-array":case"cube":case"cube-array":case"2d":return"2d";case"3d":return"3d"}})(),i=new re(this.device,{dimension:t,format:e.format,multisampled:e.multisampled}).useAs(e.dimension);return this.sendData(i),i}getRaw(){if(!this.mCurrentData)throw new u("No binding data was set.",this);return this.mCurrentData}set(e){return this.sendData(e),e}createEmptyBuffer(e=null){if(this.mBindLayout.resource.type!=="buffer")throw new u("Bind data layout is not setup for buffers.",this);let t=this.mBindLayout.resource,i=((()=>{if(t.variableSize>0&&e===null)throw new u(`For bind group data buffer "${this.mBindLayout.name}" a variable item count must be set.`,this);return e??0})()??0)*t.variableSize+t.fixedSize;if(this.mBindLayout.hasDynamicOffset){let n=this.mBindLayout.storageType===0?this.device.capabilities.getLimit("minUniformBufferOffsetAlignment"):this.device.capabilities.getLimit("minStorageBufferOffsetAlignment");i=Math.ceil(i/n)*n,i*=e??1}return new L(this.device,i)}}});var je,Pt=p(()=>{w();Z();X();Q();ue();G();q();Tt();Rt();rr();je=class extends v{mBindData;mDataInvalidationListener;mLayout;get layout(){return this.mLayout}get native(){return super.native}constructor(e,t){super(e),this.mLayout=t,this.mBindData=new b,this.mDataInvalidationListener=new WeakMap}data(e){let t=this.mLayout.getBind(e),r=this.mBindData.get(e)??null,i={device:this.device,inSetup:!0,data:null};return new Ee(t,r,i,a=>{switch(!0){case a instanceof L:{if(t.resource.type!=="buffer")throw new u(`Buffer added to bind data "${e}" but binding does not expect a buffer.`,this);t.storageType!==0?a.extendUsage(P.Storage):a.extendUsage(P.Uniform);break}case a instanceof ee:{if(t.resource.type!=="sampler")throw new u(`Texture sampler added to bind data "${e}" but binding does not expect a texture sampler.`,this);break}case a instanceof J:{if(t.resource.type!=="texture")throw new u(`Texture added to bind data "${e}" but binding does not expect a texture.`,this);t.storageType!==0?a.texture.extendUsage(B.Storage):a.texture.extendUsage(B.TextureBinding);break}default:throw new u(`Unsupported resource added to bind data "${e}".`,this)}let n=this.mBindData.get(e);if(n){let s=this.mDataInvalidationListener.get(n);s&&n.removeInvalidationListener(s)}this.mBindData.set(e,a),a.addInvalidationListener(()=>{this.invalidate("NativeRebuild")},"ResourceRebuild"),this.invalidate("NativeRebuild")})}generateNative(){this.invalidate("NativeRebuild");let e=new Array;for(let t of this.layout.orderedBindingNames){let r=this.mBindData.get(t);if(!r)throw new u(`Data for binding "${t}" is not set.`,this);let i=this.layout.getBind(t),a={binding:i.index,resource:null};if(r instanceof L){a.resource={buffer:r.native},i.hasDynamicOffset&&(a.resource.size=i.resource.fixedSize),e.push(a);continue}if(r instanceof ee){a.resource=r.native,e.push(a);continue}if(r instanceof J){a.resource=r.native,e.push(a);continue}throw new u(`Bind type for "${r}" not supported`,this)}return this.device.gpu.createBindGroup({label:"Bind-Group",layout:this.layout.native,entries:e})}}});var O,me=p(()=>{w();O=class{mSetupReference;get device(){return this.mSetupReference.device}get setupData(){return this.mSetupReference.data}get setupReferences(){return this.mSetupReference}constructor(e){this.mSetupReference=e,this.fillDefaultData(e.data)}ensureThatInSetup(){if(!this.mSetupReference.inSetup)throw new u("Can only setup in a setup call.",this)}}});var ke,ir=p(()=>{te();ke=class extends A{constructor(e,t){super(e,t)}asBuffer(e,t=0,r=!1){this.sendData({resource:{type:"buffer",fixedSize:e,variableSize:t},hasDynamicOffset:r})}asSampler(e){this.sendData({resource:{type:"sampler",samplerType:e},hasDynamicOffset:!1})}asTexture(e,t){this.sendData({resource:{type:"texture",dimension:e,format:t,multisampled:!1},hasDynamicOffset:!1})}}});var We,ar=p(()=>{Q();me();ir();We=class extends O{binding(e,t,r,i){this.ensureThatInSetup();let a={name:t,index:e,visibility:r,resource:null,storageType:i??0,hasDynamicOffset:!1};return this.setupData.bindings.push(a),new ke(this.setupReferences,n=>{a.resource=n.resource,a.hasDynamicOffset=n.hasDynamicOffset})}fillDefaultData(e){e.bindings=new Array}}});var M,nr=p(()=>{w();Y();Q();G();Pt();ar();M=class extends v{mBindings;mHasDynamicOffset;mName;mOrderedBindingNames;mResourceCounter;get hasDynamicOffset(){return this.mHasDynamicOffset}get name(){return this.mName}get native(){return super.native}get orderedBindingNames(){return this.ensureSetup(),this.mOrderedBindingNames}get resourceCounter(){return this.mResourceCounter}constructor(e,t){super(e),this.mName=t,this.mHasDynamicOffset=!1,this.mResourceCounter={storageDynamicOffset:0,uniformDynamicOffset:0,sampler:0,sampledTextures:0,storageTextures:0,storageBuffers:0,uniformBuffers:0},this.mBindings=new b,this.mOrderedBindingNames=new Array}create(){return this.ensureSetup(),new je(this.device,this)}getBind(e){if(this.ensureSetup(),!this.mBindings.has(e))throw new u(`Bind ${e} does not exist.`,this);return this.mBindings.get(e)}setup(e){return super.setup(e)}generateNative(){let e=new Array;for(let t of this.mBindings.values()){let r={visibility:t.visibility,binding:t.index};switch(t.resource.type){case"buffer":{let i=(()=>{switch(t.storageType){case 0:return"uniform";case 1:return"read-only-storage";default:return"storage"}})();r.buffer={type:i,minBindingSize:0,hasDynamicOffset:t.hasDynamicOffset};break}case"sampler":{r.sampler={type:t.resource.samplerType};break}case"texture":{if(t.storageType===0){let a=this.device.formatValidator.capabilityOf(t.resource.format);r.texture={sampleType:a.sampleTypes.primary,multisampled:t.resource.multisampled,viewDimension:t.resource.dimension};break}let i;switch(t.storageType){case 4:{i="read-write";break}case 2:{i="write-only";break}case 1:{i="read-only";break}}r.storageTexture={access:i,format:t.resource.format,viewDimension:t.resource.dimension}}}e.push(r)}return this.device.gpu.createBindGroupLayout({label:`BindGroupLayout-${this.mName}`,entries:e})}onSetup(e){let t=this.device.capabilities.getLimit("maxBindingsPerBindGroup");if(e.bindings.length>t-1)throw new u(`Bind group "${this.mName}" exceeds max binding count.`,this);let r=new Set,i=new Set;for(let a of e.bindings){if(!a.resource)throw new u(`Bind group binding "${a.name}" has no setup layout.`,this);if(a.hasDynamicOffset&&a.resource.type!=="buffer")throw new u(`Bind group binding "${a.name}" must be a buffer binding to have dynamic offsets.`,this);if(a.hasDynamicOffset&&a.resource.type==="buffer"&&a.resource.variableSize>0)throw new u(`Bind group binding "${a.name}" must have a fixed buffer layout to have dynamic offsets.`,this);if(this.mBindings.set(a.name,{name:a.name,index:a.index,resource:a.resource,visibility:a.visibility,storageType:a.storageType,hasDynamicOffset:a.hasDynamicOffset}),a.hasDynamicOffset&&(this.mHasDynamicOffset=!0,a.storageType===0?this.mResourceCounter.uniformDynamicOffset++:this.mResourceCounter.storageDynamicOffset++),r.has(a.index)||i.has(a.name))throw new u(`Binding "${a.name}" with index "${a.index}" added twice.`,this);switch(r.add(a.index),i.add(a.name),this.mOrderedBindingNames[a.index]=a.name,a.resource.type){case"sampler":{this.mResourceCounter.sampler++;break}case"texture":{a.storageType===0?this.mResourceCounter.sampledTextures++:this.mResourceCounter.storageTextures++;break}case"buffer":{a.storageType===0?this.mResourceCounter.uniformBuffers++:this.mResourceCounter.storageBuffers++;break}}}}onSetupObjectCreate(e){return new We(e)}}});var le,Bt=p(()=>{w();Re();G();le=class extends v{mLoadedPipeline;mParameter;mShaderModule;get layout(){return this.mShaderModule.shader.layout}get module(){return this.mShaderModule}get native(){return super.native}constructor(e,t){super(e),this.mShaderModule=t,this.mLoadedPipeline=null,this.mParameter=new b}setParameter(e,t){let r=this.mShaderModule.shader.parameter(e);for(let i of r)this.mParameter.has(i)||this.mParameter.set(i,{}),this.mParameter.get(i)[e]=t;return this.invalidate("NativeRebuild"),this}generateNative(e,t){if(this.mLoadedPipeline!==null&&!t.has("NativeRebuild")){let i=this.mLoadedPipeline;return this.mLoadedPipeline=null,i}let r={layout:this.mShaderModule.shader.layout.native,compute:{module:this.mShaderModule.shader.native,entryPoint:this.mShaderModule.entryPoint,constants:this.mParameter.get(D.Compute)??{}}};return this.device.gpu.createComputePipelineAsync(r).then(i=>{this.mLoadedPipeline=i,this.invalidate("NativeLoaded")}),null}}});var ze,or=p(()=>{me();ze=class extends O{constructor(e){super(e)}addColor(e,t,r,i=!0,a){this.ensureThatInSetup(),this.setupData.colorTargets.push({name:e,index:t,format:r,keepOnEnd:i,clearValue:a??{r:0,g:0,b:0,a:0}})}addDepthStencil(e,t=null,r=null,i=null,a=null){this.ensureThatInSetup(),this.setupData.depthStencil={format:e},(t!==null||r!==null)&&(this.setupData.depthStencil.depth={keepOnEnd:t??!1,clearValue:r??0}),(i!==null||a!==null)&&(this.setupData.depthStencil.stencil={keepOnEnd:i??!1,clearValue:a??0})}fillDefaultData(e){e.colorTargets=new Array,e.depthStencil=null}}});var Ne,Gt=p(()=>{w();se();ue();oe();G();q();Ct();Ne=class extends v{mLayout;mResolveCanvasList;mSize;mTargetViewUpdateQueue;mTargets;get height(){return this.mSize.height}get layout(){return this.mLayout}get native(){return super.native}get resolveCanvasList(){return this.mResolveCanvasList}get width(){return this.mSize.width}constructor(e,t){super(e),this.mLayout=t,this.mSize={width:1,height:1},this.mTargetViewUpdateQueue=new Set,this.mResolveCanvasList=new Array,this.mTargets=this.setupTextures()}colorTarget(e){if(!this.mLayout.hasColorTarget(e))throw new u(`Color target "${e}" does not exists.`,this);let t=this.mLayout.colorTarget(e).index;return this.mTargets.color[t].texture.target}depthStencilTarget(){if(!this.mTargets.depthStencil)throw new u("Depth or stencil target does not exists.",this);return this.mTargets.depthStencil.target}resize(e,t){return this.mSize.width=t,this.mSize.height=e,this.applyResize(),this.invalidate("Resize"),this}setResolveCanvas(e,t){if(!this.mLayout.hasColorTarget(e))throw new u(`Color target "${e}" does not exist.`,this);let r=this.mLayout.colorTarget(e).index,i=this.mTargets.color[r];return i.texture.target.texture.extendUsage(B.CopySource),i.texture.resolveCanvas=t,this.mResolveCanvasList.push({source:i.texture.target,canvas:t}),this}generateNative(){let e=new Array;for(let r of this.mLayout.colorTargetNames){let i=this.mLayout.colorTarget(r),a=this.mTargets.color[i.index],n=i.keepOnEnd?"store":"discard",s={view:a.texture.target.native,storeOp:n,loadOp:"clear",clearValue:i.clearValue};i.clearValue!==null?s.loadOp="clear":s.loadOp="load",e.push(s)}let t={colorAttachments:e};if(this.mTargets.depthStencil){let r=this.mTargets.depthStencil.target,i=this.mLayout.depthStencilTarget();t.depthStencilAttachment={view:r.native},this.mLayout.hasDepth&&(t.depthStencilAttachment.depthClearValue=i.depth.clearValue,t.depthStencilAttachment.depthLoadOp="clear",t.depthStencilAttachment.depthStoreOp=i.depth.keepOnEnd?"store":"discard"),this.mLayout.hasStencil&&(t.depthStencilAttachment.stencilClearValue=i.stencil.clearValue,t.depthStencilAttachment.stencilLoadOp="clear",t.depthStencilAttachment.stencilStoreOp=i.stencil.keepOnEnd?"store":"discard")}return t}updateNative(e){this.mTargetViewUpdateQueue.has(-1)&&e.depthStencilAttachment&&(e.depthStencilAttachment.view=this.mTargets.depthStencil.target.native,this.mTargetViewUpdateQueue.delete(-1));for(let t of this.mTargetViewUpdateQueue){let r=e.colorAttachments[t],i=this.mTargets.color[t];r.view=i.texture.target.native}return this.mTargetViewUpdateQueue.clear(),!0}applyResize(){for(let e of this.mTargets.color)e.texture.target.texture.height=this.mSize.height,e.texture.target.texture.width=this.mSize.width,e.texture.resolveCanvas&&(e.texture.resolveCanvas.height=this.mSize.height,e.texture.resolveCanvas.width=this.mSize.width);this.mTargets.depthStencil&&(this.mTargets.depthStencil.target.texture.height=this.mSize.height,this.mTargets.depthStencil.target.texture.width=this.mSize.width)}setTextureInvalidationListener(e,t){e.addInvalidationListener(()=>{this.invalidate("NativeUpdate"),this.mTargetViewUpdateQueue.add(t)},"ResourceRebuild")}setupTextures(){let e={color:new Array,depthStencil:null};for(let t of this.mLayout.colorTargetNames){let r=this.mLayout.colorTarget(t),a=new re(this.device,{format:r.format,dimension:"2d",multisampled:this.mLayout.multisampled}).useAs("2d");a.texture.extendUsage(B.RenderAttachment),this.setTextureInvalidationListener(a,r.index),e.color[r.index]={name:t,index:r.index,texture:{target:a,resolveCanvas:null}}}if(this.mLayout.hasDepth||this.mLayout.hasStencil){let t=this.mLayout.depthStencilTarget(),i=new re(this.device,{format:t.format,dimension:"2d",multisampled:this.mLayout.multisampled}).useAs("2d");i.texture.extendUsage(B.RenderAttachment),this.setTextureInvalidationListener(i,-1),e.depthStencil={target:i}}return e}}});var Ye,sr=p(()=>{w();Y();G();or();Gt();Ye=class extends v{mColorTargetFormats;mColorTargetOrder;mDepthStencilConfig;mMultisampled;get colorTargetNames(){return this.ensureSetup(),[...this.mColorTargetOrder]}get depthStencilFormat(){return this.ensureSetup(),this.mDepthStencilConfig?.format??null}get hasDepth(){return this.ensureSetup(),!!this.mDepthStencilConfig?.depth}get hasStencil(){return this.ensureSetup(),!!this.mDepthStencilConfig?.stencil}get multisampled(){return this.mMultisampled}constructor(e,t){super(e),this.mMultisampled=t,this.mColorTargetFormats=new b,this.mColorTargetOrder=new Array,this.mDepthStencilConfig=null}colorTarget(e){this.ensureSetup();let t=this.mColorTargetFormats.get(e);if(!t)throw new u(`Color target "${e}" does not exists.`,this);return t}create(){return this.ensureSetup(),new Ne(this.device,this)}depthStencilTarget(){if(this.ensureSetup(),!this.mDepthStencilConfig)throw new u("Depth or stencil target does not exists.",this);return this.mDepthStencilConfig}hasColorTarget(e){return this.mColorTargetFormats.has(e)}setup(e){return super.setup(e)}generateNative(){return null}onSetup(e){let t=this.device.capabilities.getLimit("maxColorAttachments");if(e.colorTargets.length>t-1)throw new u("Max color targets count exeeced.",this);for(let r of e.colorTargets){if(this.mColorTargetFormats.has(r.name))throw new u(`Color attachment name "${r.name}" can only be defined once.`,this);if(this.mColorTargetOrder[r.index]!==void 0)throw new u(`Color attachment location index "${r.index}" can only be defined once.`,this);let i={index:r.index,format:r.format,keepOnEnd:r.keepOnEnd,clearValue:r.clearValue};this.mColorTargetFormats.set(r.name,i),this.mColorTargetOrder[r.index]=r.name}if(this.mColorTargetFormats.size!==this.mColorTargetOrder.length)throw new u("Color attachment locations must be in order.",this);e.depthStencil&&(this.mDepthStencilConfig={format:e.depthStencil.format},e.depthStencil.depth&&(this.mDepthStencilConfig.depth={keepOnEnd:e.depthStencil.depth.keepOnEnd,clearValue:e.depthStencil.depth.clearValue}),e.depthStencil.stencil&&(this.mDepthStencilConfig.stencil={keepOnEnd:e.depthStencil.stencil.keepOnEnd,clearValue:e.depthStencil.stencil.clearValue}))}onSetupObjectCreate(e){return new ze(e)}}});var He,ur=p(()=>{te();He=class extends A{withParameter(e,t,r,i,a=null){return this.sendData({name:e,location:t,format:r,multiplier:i,alignment:a}),this}}});var _e,mr=p(()=>{me();ur();_e=class extends O{buffer(e,t){let r={name:e,stepMode:t,parameter:new Array};return this.setupData.buffer.push(r),new He(this.setupReferences,i=>{r.parameter.push(i)})}fillDefaultData(e){e.buffer=new Array}}});var $e,cr=p(()=>{w();Z();Te();X();Ce();G();$e=class extends v{mBuffer;mIndexBuffer;mIndexBufferFormat;mIndices;mLayout;get indexBuffer(){return this.mIndexBuffer}get indexBufferFormat(){return this.mIndexBufferFormat}get layout(){return this.mLayout}get vertexCount(){return this.mIndices.length}constructor(e,t,r){super(e),this.mLayout=t,this.mBuffer=new b,this.mIndices=r,this.mIndexBuffer=null,this.mIndexBufferFormat=Uint32Array,this.mLayout.indexable&&(r.length<Math.pow(2,16)?(this.mIndexBuffer=new L(e,r.length*2),this.mIndexBuffer.extendUsage(P.Index),this.mIndexBuffer.initialData(new Uint16Array(r).buffer),this.mIndexBufferFormat=Uint16Array):(this.mIndexBuffer=new L(e,r.length*4),this.mIndexBuffer.extendUsage(P.Index),this.mIndexBuffer.initialData(new Uint32Array(r).buffer),this.mIndexBufferFormat=Uint32Array))}create(e,t){let r=this.mLayout.parameterBuffer(e),i=new Array,a=0;for(let h of r.layout.properties)a+=h.item.count,i.push({count:h.item.count,format:h.item.format,itemByteCount:h.item.byteCount});if(t.length%a!==0)throw new u("Vertex parameter buffer data does not align with layout.",this);let n=t;if(!this.mLayout.indexable&&r.stepMode==="index-step"){n=new Array;for(let h of this.mIndices){let f=h*a,x=f+a;n.push(...t.slice(f,x))}}let s=n.length/a;!this.mLayout.indexable&&r.stepMode==="index-step"&&(s=this.mIndices.length);let m=new ArrayBuffer(r.layout.fixedSize*s),l=new DataView(m),c=(h,f,x)=>{switch(f){case"float32":{l.setFloat32(h,x,!0);break}case"uint32":{l.setUint32(h,x,!0);break}case"sint32":{l.setInt32(h,x,!0);break}case"uint8":{l.setUint8(h,x);break}case"sint8":{l.setInt8(h,x);break}case"uint16":{l.setUint16(h,x,!0);break}case"sint16":{l.setInt16(h,x,!0);break}case"float16":case"unorm16":case"snorm16":case"unorm8":case"snorm8":default:throw new u(`Currently "${f}" is not supported for vertex parameter.`,this)}},d=0,g=0;for(let h=0;h<s;h++)for(let f of i)for(let x=0;x<f.count;x++)c(g,f.format,n[d]),d++,g+=f.itemByteCount;let y=new L(this.device,m.byteLength).initialData(m);return y.extendUsage(P.Vertex),this.mBuffer.set(e,y),this.invalidate("DataChange"),y}get(e){if(!this.mBuffer.has(e))throw new u(`Vertex parameter buffer for "${e}" not set.`,this);return this.mBuffer.get(e)}set(e,t){let r=this.mLayout.parameterBuffer(e);if(t.size%r.layout.fixedSize!==0)throw new u("Set vertex parameter buffer does not align with layout.",this);let i=t.size/r.layout.fixedSize;if(!this.mLayout.indexable&&r.stepMode==="index-step"&&(i=this.mIndices.length),t.size!==r.layout.fixedSize*i)throw new u(`Set vertex parameter buffer does not fit needed buffer size (Has:${t.size} => Should:${r.layout.fixedSize*i}).`,this);return t.extendUsage(P.Vertex),this.mBuffer.set(e,t),this.invalidate("DataChange"),t}}});var H,dr=p(()=>{w();Te();gt();Ce();G();mr();cr();H=class extends v{mBuffer;mIndexable;mParameter;get bufferNames(){return this.ensureSetup(),[...this.mBuffer.keys()]}get indexable(){return this.ensureSetup(),this.mIndexable}get native(){return super.native}get parameterNames(){return this.ensureSetup(),[...this.mParameter.keys()]}constructor(e){super(e),this.mIndexable=!1,this.mBuffer=new b,this.mParameter=new b}create(e){return new $e(this.device,this,e)}parameter(e){let t=this.mParameter.get(e);if(!t)throw new u(`Vertex parameter "${e}" is not defined.`,this);return t}parameterBuffer(e){let t=this.mBuffer.get(e);if(!t)throw new u(`Vertex parameter buffer "${e}" is not defined.`,this);return t}setup(e){return super.setup(e)}generateNative(){let e=new Array;for(let t of this.mBuffer.values()){let r=new Array;for(let a of t.layout.properties){let n=`${a.item.format}x${a.item.count}`;a.item.count===1&&(n=a.item.format);let s=this.mParameter.get(a.name).location;r.push({format:n,offset:a.byteOffset,shaderLocation:s})}let i="vertex";t.stepMode==="instance-step"&&(i="instance"),e.push({stepMode:i,arrayStride:t.layout.fixedSize,attributes:r})}return e}onSetup(e){let t=!0,r=new Set(["x1","v2","v3","v4"]),i=new Array;for(let a of e.buffer){let n=[],s=0;for(let m of a.parameter){if(i[m.location])throw new u(`Vertex parameter location "${m.location}" can't be defined twice.`,this);if(!r.has(m.multiplier))throw new u(`Vertex parameter item multiplier "${m.multiplier}" not supported.`,this);let l=this.computePrimitiveSize(m.format,m.multiplier);n.push({name:m.name,item:{format:m.format,count:this.itemCountOfMultiplier(m.multiplier),byteCount:this.itemFormatByteCount(m.format)},byteOffset:s,byteSize:l}),s+=l,this.mParameter.set(m.name,{name:m.name,location:m.location}),i[m.location]=!0}this.mBuffer.set(a.name,{name:a.name,stepMode:a.stepMode,layout:{fixedSize:s,properties:n}}),a.stepMode==="vertex-step"&&(t=!1)}if(i.length!==this.mParameter.size)throw new u("Vertex parameter locations need to be in continious order.",this);this.mIndexable=t}onSetupObjectCreate(e){return new _e(e)}computePrimitiveSize(e,t){return this.itemFormatByteCount(e)*this.itemCountOfMultiplier(t)}itemCountOfMultiplier(e){switch(e){case"x1":return 1;case"v2":return 2;case"v3":return 3;case"v4":return 4;case"m22":return 4;case"m23":return 6;case"m24":return 8;case"m32":return 6;case"m33":return 9;case"m34":return 12;case"m42":return 8;case"m43":return 0;case"m44":return 16}}itemFormatByteCount(e){switch(e){case"float16":return 2;case"float32":return 4;case"uint32":return 4;case"sint32":return 4;case"uint8":return 1;case"sint8":return 1;case"uint16":return 2;case"sint16":return 2;case"unorm16":return 2;case"snorm16":return 2;case"unorm8":return 1;case"snorm8":return 1}}}});var Xe,hr=p(()=>{te();Xe=class extends A{withOffset(e,t){return this.sendData({bindingName:e,offsetIndex:t}),this}}});var qe,fr=p(()=>{w();hr();me();qe=class extends O{addGroup(e){let t={bindGroup:e,offsets:new b};return this.setupData.groups.push(t),new Xe(this.setupReferences,r=>{t.offsets.set(r.bindingName,r.offsetIndex)})}fillDefaultData(e){e.groups=new Array}}});var Ze,gr=p(()=>{w();Y();Q();G();Pt();fr();Ze=class extends v{mBindData;mInvalidationListener;mLayout;mOrderedBindData;get data(){return this.ensureSetup(),this.mOrderedBindData}get layout(){return this.mLayout}constructor(e,t){super(e),this.mLayout=t,this.mBindData=new b,this.mInvalidationListener=()=>{this.invalidate("DataChange")},this.mOrderedBindData=new Array}deconstruct(){super.deconstruct();for(let e of this.mOrderedBindData)e.bindGroup.removeInvalidationListener(this.mInvalidationListener)}group(e){if(!this.mBindData.has(e))throw new u(`Bind group "${e}" does not exists in pipeline data.`,this);return this.mBindData.get(e)}setup(e){return super.setup(e)}onSetup(e){if(this.mLayout.groups.length!==e.groups.length){for(let t of this.mLayout.groups)if(!e.groups.find(i=>i.bindGroup.layout.name===t))throw new u(`Required bind group "${t}" not set.`,this)}for(let t of e.groups){let r=t.bindGroup.layout.name,i=this.mLayout.groupIndex(r),a=t.bindGroup;if(this.mOrderedBindData[i])throw new u(`Bind group "${r}" was added multiple times to render pass step.`,this);let n=this.mLayout.getGroupLayout(r);if(a.layout!==n)throw new u(`Source bind group layout for "${r}" does not match target layout.`,this);if(this.mBindData.has(r))throw new u(`Bind group "${r}" name already exists in pipeline data.`,this);let s={offsetId:"",bindGroup:a,offsets:new Array};if(n.hasDynamicOffset){for(let m of n.orderedBindingNames){let l=n.getBind(m);if(!l.hasDynamicOffset)continue;if(!t.offsets.has(m))throw new u(`Binding "${m}" of group "${r} requires a offset."`,this);let c=l.storageType===0?this.device.capabilities.getLimit("minUniformBufferOffsetAlignment"):this.device.capabilities.getLimit("minStorageBufferOffsetAlignment"),d=t.offsets.get(m),g=l.resource,y=Math.ceil(g.fixedSize/c)*c,h=a.data(m).getRaw().size;if(Math.floor(h/y)<=d)throw new u(`Binding "${m}" of group "${r} exceedes dynamic offset limits."`,this);s.offsets.push(y*d)}s.offsetId=s.offsets.join("-")}this.mBindData.set(r,s),this.mOrderedBindData[i]=s,a.addInvalidationListener(this.mInvalidationListener,"NativeRebuild")}}onSetupObjectCreate(e){return new qe(e)}}});var Ke,br=p(()=>{w();Y();G();gr();Ke=class extends v{mBindGroupNames;mBindGroups;get groups(){return[...this.mBindGroupNames.keys()]}get native(){return super.native}constructor(e,t){super(e),this.mBindGroupNames=new b,this.mBindGroups=new b;let r={dynamicStorageBuffers:0,dynamicUniformBuffers:0,sampler:0,sampledTextures:0,storageTextures:0,uniformBuffers:0,storageBuffers:0},i=this.device.capabilities.getLimit("maxBindGroups");for(let[a,n]of t){if(a>i-1)throw new u(`Bind group limit exceeded with index: ${a} and group "${n.name}"`,this);if(this.mBindGroupNames.has(n.name))throw new u(`Can add group name "${n.name}" only once.`,this);if(this.mBindGroups.has(a))throw new u(`Can add group location index "${a}" only once.`,this);this.mBindGroupNames.set(n.name,a),this.mBindGroups.set(a,n),r.dynamicStorageBuffers+=n.resourceCounter.storageDynamicOffset,r.dynamicUniformBuffers+=n.resourceCounter.uniformDynamicOffset,r.sampler+=n.resourceCounter.sampler,r.sampledTextures+=n.resourceCounter.sampledTextures,r.storageTextures+=n.resourceCounter.storageTextures,r.uniformBuffers+=n.resourceCounter.uniformBuffers,r.storageBuffers+=n.resourceCounter.storageBuffers}if(r.dynamicStorageBuffers>this.device.capabilities.getLimit("maxDynamicStorageBuffersPerPipelineLayout"))throw new u(`Max dynamic storage buffer reached pipeline. Max allowed "${this.device.capabilities.getLimit("maxDynamicStorageBuffersPerPipelineLayout")}" has "${r.dynamicStorageBuffers}"`,this);if(r.dynamicUniformBuffers>this.device.capabilities.getLimit("maxDynamicUniformBuffersPerPipelineLayout"))throw new u(`Max dynamic uniform buffer reached pipeline. Max allowed "${this.device.capabilities.getLimit("maxDynamicUniformBuffersPerPipelineLayout")}" has "${r.dynamicUniformBuffers}"`,this);if(r.sampler>this.device.capabilities.getLimit("maxSamplersPerShaderStage"))throw new u(`Max sampler reached pipeline. Max allowed "${this.device.capabilities.getLimit("maxSamplersPerShaderStage")}" has "${r.sampler}"`,this);if(r.sampledTextures>this.device.capabilities.getLimit("maxSampledTexturesPerShaderStage"))throw new u(`Max sampled textures reached pipeline. Max allowed "${this.device.capabilities.getLimit("maxSampledTexturesPerShaderStage")}" has "${r.sampledTextures}"`,this);if(r.storageTextures>this.device.capabilities.getLimit("maxStorageTexturesPerShaderStage"))throw new u(`Max storage textures reached pipeline. Max allowed "${this.device.capabilities.getLimit("maxStorageTexturesPerShaderStage")}" has "${r.storageTextures}"`,this);if(r.storageBuffers>this.device.capabilities.getLimit("maxStorageBuffersPerShaderStage"))throw new u(`Max storage buffers reached pipeline. Max allowed "${this.device.capabilities.getLimit("maxStorageBuffersPerShaderStage")}" has "${r.storageBuffers}"`,this);if(r.uniformBuffers>this.device.capabilities.getLimit("maxUniformBuffersPerShaderStage"))throw new u(`Max uniform buffers reached pipeline. Max allowed "${this.device.capabilities.getLimit("maxUniformBuffersPerShaderStage")}" has "${r.uniformBuffers}"`,this)}getGroupLayout(e){let t=this.mBindGroupNames.get(e);if(typeof t>"u")throw new u(`Bind group layout (${e}) does not exists.`,this);return this.mBindGroups.get(t)}groupIndex(e){let t=this.mBindGroupNames.get(e);if(typeof t>"u")throw new u(`Pipeline does not contain a group with name "${e}".`,this);return t}withData(e){return new Ze(this.device,this).setup(e)}generateNative(){let e={bindGroupLayouts:new Array};for(let[t,r]of this.mBindGroups)e.bindGroupLayouts[t]=r.native;if(this.mBindGroups.size!==e.bindGroupLayouts.length)throw new u("Bind group gap detected. Group not set.",this);return this.device.gpu.createPipelineLayout(e)}}});var Qe,yr=p(()=>{te();Qe=class extends A{size(e,t=1,r=1){this.ensureThatInSetup(),this.sendData(e,t,r)}}});var Je,xr=p(()=>{te();Je=class extends A{addRenderTarget(e,t,r,i){this.ensureThatInSetup();let a={name:e,location:t,format:r,multiplier:i};return this.sendData(a),this}}});var et,vr=p(()=>{me();yr();xr();et=class extends O{computeEntryPoint(e){this.ensureThatInSetup();let t={name:e,workgroupDimension:null};return this.setupData.computeEntrypoints.push(t),new Qe(this.setupReferences,(i,a,n)=>{t.workgroupDimension={x:i,y:a,z:n}})}fragmentEntryPoint(e,t){this.ensureThatInSetup();let r={name:e,renderTargets:new Array};this.setupData.fragmentEntrypoints.push(r);let i=new Je(this.setupReferences,a=>{r.renderTargets.push(a)});t(i)}group(e,t){return this.setupData.bindingGroups.push({index:e,group:t}),t}parameter(e,...t){return this.ensureThatInSetup(),this.setupData.parameter.push({name:e,usage:t}),this}vertexEntryPoint(e,t){this.ensureThatInSetup();let r={name:e,parameter:t};return this.setupData.vertexEntrypoints.push(r),t}fillDefaultData(e){e.computeEntrypoints=new Array,e.fragmentEntrypoints=new Array,e.vertexEntrypoints=new Array,e.parameter=new Array,e.bindingGroups=new Array}}});var ge,Dr=p(()=>{G();Bt();ge=class extends v{mEntryPoint;mShader;mSize;get entryPoint(){return this.mEntryPoint}get layout(){return this.mShader.layout}get shader(){return this.mShader}get workGroupSizeX(){return this.mSize[0]}get workGroupSizeY(){return this.mSize[1]}get workGroupSizeZ(){return this.mSize[2]}constructor(e,t,r,i){super(e),this.mEntryPoint=r,this.mShader=t,this.mSize=i??[-1,-1,-1]}create(){return new le(this.device,this)}}});var Sr=p(()=>{});var wr=p(()=>{});var Tr=p(()=>{});var tt,Rr=p(()=>{tt=class{mCallback;mDataReference;constructor(e,t){this.mCallback=t,this.mDataReference=e}bias(e){return this.mDataReference.depthBias=e,this.mCallback(),this}biasClamp(e){return this.mDataReference.depthBiasClamp=e,this.mCallback(),this}biasSlopeScale(e){return this.mDataReference.depthBiasSlopeScale=e,this.mCallback(),this}compareWith(e){return this.mDataReference.depthCompare=e,this.mCallback(),this}enableWrite(e){return this.mDataReference.depthWriteEnabled=e,this.mCallback(),this}}});var rt,Cr=p(()=>{rt=class{mCallback;mDataReference;constructor(e,t){this.mCallback=t,this.mDataReference=e}back(e,t,r,i){return this.mDataReference.stencilBack.compare=e,t&&(this.mDataReference.stencilBack.failOperation=t),r&&(this.mDataReference.stencilBack.passOperation=r),i&&(this.mDataReference.stencilBack.depthFailOperation=i),this.mCallback(),this}front(e,t,r,i){return this.mDataReference.stencilFront.compare=e,t&&(this.mDataReference.stencilFront.failOperation=t),r&&(this.mDataReference.stencilFront.passOperation=r),i&&(this.mDataReference.stencilFront.depthFailOperation=i),this.mCallback(),this}readMask(e){return this.mDataReference.stencilReadMask=e,this.mCallback(),this}writeMask(e){return this.mDataReference.stencilWriteMask=e,this.mCallback(),this}}});var it,Pr=p(()=>{it=class{mCallback;mDataReference;constructor(e,t){this.mCallback=t,this.mDataReference=e}alphaBlend(e,t,r){return this.mDataReference.alphaBlend={operation:e,sourceFactor:t,destinationFactor:r},this.mCallback(),this}colorBlend(e,t,r){return this.mDataReference.colorBlend={operation:e,sourceFactor:t,destinationFactor:r},this.mCallback(),this}writeMask(...e){return this.mDataReference.aspectWriteMask=new Set(e),this.mCallback(),this}}});var at,Br=p(()=>{w();bt();Re();yt();Sr();wr();Tr();wt();vt();Dt();G();Rr();Cr();Pr();at=class extends v{mDepthConfiguration;mLoadedPipeline;mParameter;mPrimitiveCullMode;mPrimitiveFrontFace;mPrimitiveTopology;mRenderTargetConfig;mRenderTargetsLayout;mShaderModule;mStencilConfiguration;get layout(){return this.mShaderModule.shader.layout}get module(){return this.mShaderModule}get native(){return super.native}get primitiveCullMode(){return this.mPrimitiveCullMode}set primitiveCullMode(e){this.mPrimitiveCullMode=e,this.invalidate("NativeRebuild")}get primitiveFrontFace(){return this.mPrimitiveFrontFace}set primitiveFrontFace(e){this.mPrimitiveFrontFace=e,this.invalidate("NativeRebuild")}get primitiveTopology(){return this.mPrimitiveTopology}set primitiveTopology(e){this.mPrimitiveTopology=e,this.invalidate("NativeRebuild")}get renderTargets(){return this.mRenderTargetsLayout}constructor(e,t,r){super(e),this.mLoadedPipeline=null,this.mShaderModule=t,this.mRenderTargetsLayout=r,this.mRenderTargetConfig=new b,this.mParameter=new b,this.mDepthConfiguration={depthWriteEnabled:this.mRenderTargetsLayout.hasDepth,depthCompare:"less",depthBias:0,depthBiasSlopeScale:0,depthBiasClamp:0},this.mStencilConfiguration={stencilReadMask:0,stencilWriteMask:0,stencilBack:{compare:"always",failOperation:"keep",depthFailOperation:"keep",passOperation:"keep"},stencilFront:{compare:"always",failOperation:"keep",depthFailOperation:"keep",passOperation:"keep"}},this.mPrimitiveTopology="triangle-list",this.mPrimitiveCullMode="back",this.mPrimitiveFrontFace="ccw"}depthConfig(){return new tt(this.mDepthConfiguration,()=>{this.invalidate("NativeRebuild")})}setParameter(e,t){let r=this.mShaderModule.shader.parameter(e);for(let i of r)this.mParameter.has(i)||this.mParameter.set(i,{}),this.mParameter.get(i)[e]=t;return this.invalidate("NativeRebuild"),this}stencilConfig(){return new rt(this.mStencilConfiguration,()=>{this.invalidate("NativeRebuild")})}targetConfig(e){if(!this.mRenderTargetsLayout.hasColorTarget(e))throw new u(`Color target "${e}" does not exists.`,this);return this.mRenderTargetConfig.has(e)||this.mRenderTargetConfig.set(e,{colorBlend:{operation:"add",sourceFactor:"one",destinationFactor:"zero"},alphaBlend:{operation:"add",sourceFactor:"one",destinationFactor:"zero"},aspectWriteMask:new Set(["red","green","blue","alpha"])}),new it(this.mRenderTargetConfig.get(e),()=>{this.invalidate("NativeRebuild")})}generateNative(e,t){if(this.mLoadedPipeline!==null&&!t.has("NativeRebuild")){let a=this.mLoadedPipeline;return this.mLoadedPipeline=null,a}let i={layout:this.mShaderModule.shader.layout.native,vertex:{module:this.mShaderModule.shader.native,entryPoint:this.mShaderModule.vertexEntryPoint,buffers:this.mShaderModule.vertexParameter.native,constants:this.mParameter.get(D.Vertex)??{}},primitive:this.generatePrimitive()};if(this.module.fragmentEntryPoint){let a=new Array;for(let n of this.mRenderTargetsLayout.colorTargetNames){let s=this.mRenderTargetsLayout.colorTarget(n);a.push({format:s.format,blend:this.generateRenderTargetBlendState(n),writeMask:this.generateRenderTargetWriteMask(n)})}i.fragment={module:this.mShaderModule.shader.native,entryPoint:this.module.fragmentEntryPoint,targets:a,constants:this.mParameter.get(D.Fragment)??{}}}if(this.mRenderTargetsLayout.hasDepth||this.mRenderTargetsLayout.hasStencil){if(i.depthStencil={format:this.mRenderTargetsLayout.depthStencilFormat},this.mRenderTargetsLayout.hasDepth&&(i.depthStencil.depthWriteEnabled=this.mDepthConfiguration.depthWriteEnabled,i.depthStencil.depthCompare=this.mDepthConfiguration.depthCompare,i.depthStencil.depthBias=this.mDepthConfiguration.depthBias,i.depthStencil.depthBiasSlopeScale=this.mDepthConfiguration.depthBiasSlopeScale,i.depthStencil.depthBiasClamp=this.mDepthConfiguration.depthBiasClamp,(this.mPrimitiveTopology==="line-list"||this.mPrimitiveTopology==="line-strip"||this.mPrimitiveTopology==="point-list")&&(i.depthStencil.depthBias!==0||i.depthStencil.depthBiasSlopeScale!==0||i.depthStencil.depthBiasClamp!==0)))throw new u(`Pipelines depth bias settings must be zero for "${this.mPrimitiveTopology}"-Topology`,this);this.mRenderTargetsLayout.hasStencil&&(i.depthStencil.stencilReadMask=this.mStencilConfiguration.stencilReadMask,i.depthStencil.stencilWriteMask=this.mStencilConfiguration.stencilWriteMask,i.depthStencil.stencilBack={compare:this.mStencilConfiguration.stencilBack.compare,failOp:this.mStencilConfiguration.stencilBack.failOperation,depthFailOp:this.mStencilConfiguration.stencilBack.depthFailOperation,passOp:this.mStencilConfiguration.stencilBack.passOperation},i.depthStencil.stencilFront={compare:this.mStencilConfiguration.stencilFront.compare,failOp:this.mStencilConfiguration.stencilFront.failOperation,depthFailOp:this.mStencilConfiguration.stencilFront.depthFailOperation,passOp:this.mStencilConfiguration.stencilFront.passOperation})}return this.mRenderTargetsLayout.multisampled&&(i.multisample={count:4}),this.device.gpu.createRenderPipelineAsync(i).then(a=>{this.mLoadedPipeline=a,this.invalidate("NativeLoaded")}),null}generatePrimitive(){let e;switch(this.primitiveTopology){case"line-strip":case"triangle-strip":{e="uint32";break}}let t={topology:this.primitiveTopology,frontFace:this.primitiveFrontFace,cullMode:this.primitiveCullMode,unclippedDepth:!1};return e&&(t.stripIndexFormat=e),t}generateRenderTargetBlendState(e){let t=this.mRenderTargetConfig.get(e),r={color:{operation:"add",srcFactor:"one",dstFactor:"zero"},alpha:{operation:"add",srcFactor:"one",dstFactor:"zero"}};return t&&(r.alpha={operation:t.alphaBlend.operation,srcFactor:t.alphaBlend.sourceFactor,dstFactor:t.alphaBlend.destinationFactor},r.color={operation:t.colorBlend.operation,srcFactor:t.colorBlend.sourceFactor,dstFactor:t.colorBlend.destinationFactor}),r}generateRenderTargetWriteMask(e){let t=this.mRenderTargetConfig.get(e),r=15;return t&&(r=0,t.aspectWriteMask.has("red")&&(r+=1),t.aspectWriteMask.has("green")&&(r+=2),t.aspectWriteMask.has("red")&&(r+=4),t.aspectWriteMask.has("alpha")&&(r+=8)),r}}});var be,Gr=p(()=>{G();Br();be=class extends v{mFragmentEntryPoint;mShader;mVertexEntryPoint;mVertexParameter;get fragmentEntryPoint(){return this.mFragmentEntryPoint}get layout(){return this.mShader.layout}get shader(){return this.mShader}get vertexEntryPoint(){return this.mVertexEntryPoint}get vertexParameter(){return this.mVertexParameter}constructor(e,t,r,i,a){super(e),this.mVertexEntryPoint=r,this.mVertexParameter=i,this.mFragmentEntryPoint=a??null,this.mShader=t}create(e){return new at(this.device,this,e)}}});var k,Lr=p(()=>{w();G();br();vr();Dr();Gr();k=class extends v{mEntryPoints;mParameter;mPipelineLayout;mSource;mSourceMap;get computeEntryPoints(){return this.ensureSetup(),[...this.mEntryPoints.compute.keys()]}get fragmentEntryPoints(){return this.ensureSetup(),[...this.mEntryPoints.fragment.keys()]}get layout(){return this.ensureSetup(),this.mPipelineLayout}get native(){return super.native}get vertexEntryPoints(){return this.ensureSetup(),[...this.mEntryPoints.vertex.keys()]}constructor(e,t,r=null){super(e),this.mSource=t,this.mSourceMap=r,this.mParameter=new b,this.mPipelineLayout=null,this.mEntryPoints={compute:new b,vertex:new b,fragment:new b}}createComputeModule(e){this.ensureSetup();let t=this.mEntryPoints.compute.get(e);if(!t)throw new u(`Compute entry point "${e}" does not exists.`,this);return t.static?new ge(this.device,this,e,[t.workgroupDimension.x??1,t.workgroupDimension.y??1,t.workgroupDimension.z??1]):new ge(this.device,this,e)}createRenderModule(e,t){this.ensureSetup();let r=this.mEntryPoints.vertex.get(e);if(!r)throw new u(`Vertex entry point "${e}" does not exists.`,this);if(!t)return new be(this.device,this,e,r.parameter);if(!this.mEntryPoints.fragment.get(t))throw new u(`Fragment entry point "${t}" does not exists.`,this);return new be(this.device,this,e,r.parameter,t)}parameter(e){this.ensureSetup();let t=this.mParameter.get(e);if(!t)throw new u(`Shader has parameter "${e}" not defined.`,this);return new Set(t)}setup(e){return super.setup(e)}generateNative(){let e=this.mPipelineLayout.native,t=new Array;for(let r of[...this.mEntryPoints.vertex.keys(),...this.mEntryPoints.fragment.keys(),...this.mEntryPoints.compute.keys()])t.push({entryPoint:r,layout:e});return this.device.gpu.createShaderModule({code:this.mSource,compilationHints:t})}onSetup(e){for(let r of e.parameter){if(this.mParameter.has(r.name))throw new u(`Can't add parameter "${r.name}" more than once.`,this);this.mParameter.set(r.name,new Set(r.usage))}for(let r of e.fragmentEntrypoints){if(this.mEntryPoints.fragment.has(r.name))throw new u(`Fragment entry "${r.name}" was setup more than once.`,this);let i=new Set,a=new b;for(let n of r.renderTargets){if(a.has(n.name))throw new u(`Fragment entry "${r.name}" was has doublicate render attachment name "${n.name}".`,this);if(i.has(n.location))throw new u(`Fragment entry "${r.name}" was has doublicate render attachment location index "${n.location}".`,this);i.add(n.location),a.set(n.name,{name:n.name,location:n.location,format:n.format,multiplier:n.multiplier})}this.mEntryPoints.fragment.set(r.name,{renderTargets:a})}for(let r of e.vertexEntrypoints){if(this.mEntryPoints.vertex.has(r.name))throw new u(`Vertex entry "${r.name}" was setup more than once.`,this);this.mEntryPoints.vertex.set(r.name,{parameter:r.parameter})}for(let r of e.computeEntrypoints){if(this.mEntryPoints.compute.has(r.name))throw new u(`Vertex entry "${r.name}" was setup more than once.`,this);this.mEntryPoints.compute.set(r.name,{static:r.workgroupDimension!==null,workgroupDimension:{x:r.workgroupDimension?.x??null,y:r.workgroupDimension?.y??null,z:r.workgroupDimension?.z??null}})}let t=new b;for(let r of e.bindingGroups)t.set(r.index,r.group);this.mPipelineLayout=new Ke(this.device,t)}onSetupObjectCreate(e){return new et(e)}}});var nt,Ar=p(()=>{se();ue();G();nt=class extends v{mCanvas;mContext;mFrameListener;get canvas(){return this.mCanvas}get depth(){return 1}get dimension(){return"2d"}get format(){return this.device.formatValidator.preferredCanvasFormat}get height(){return this.mCanvas.height}set height(e){this.mCanvas.height=e}get mipCount(){return 1}get native(){return super.native}get width(){return this.mCanvas.width}set width(e){this.mCanvas.width=e}constructor(e,t){super(e),this.mCanvas=t,this.mContext=null,this.height=Math.max(t.height,1),this.width=Math.max(t.width,1),this.mFrameListener=()=>{this.invalidate("NativeRebuild")},this.device.addTickListener(this.mFrameListener)}destroyNative(e,t){e.destroy(),this.unregisterFreeableResource(e),t.deconstruct&&(this.device.removeTickListener(this.mFrameListener),this.mContext.unconfigure(),this.mContext=null)}generateNative(){this.mContext||(this.mContext=this.canvas.getContext("webgpu"),this.mContext.configure({device:this.device.gpu,format:this.device.formatValidator.preferredCanvasFormat,usage:B.CopyDestination|B.RenderAttachment,alphaMode:"opaque"}));let e=this.mContext.getCurrentTexture();return e.label="Canvas-Texture",this.registerFreeableResource(e),e}}});var U,ye=p(()=>{w();U=class o{mData;get data(){return this.mData}get w(){return this.mData[3]}get x(){return this.mData[0]}get y(){return this.mData[1]}get z(){return this.mData[2]}constructor(e){this.mData=[...e]}add(e){let t=new Array;if(e instanceof o){if(this.mData.length!==e.data.length)throw new u("Vectors need to be the same length for calculation.",this);for(let r=0;r<this.mData.length;r++)t.push(this.mData[r]+e.data[r])}else for(let r of this.mData)t.push(r+e);return new o(t)}length(){return Math.hypot(...this.mData)}multCross(e){if(this.mData.length!==e.data.length&&this.mData.length!==3)throw new u("Vectors need to be the length of 3 for corss product calculation.",this);return new o([this.mData[1]*e.data[2]-this.mData[2]*e.data[1],this.mData[2]*e.data[0]-this.mData[0]*e.data[2],this.mData[0]*e.data[1]-this.mData[1]*e.data[0]])}multDot(e){if(this.mData.length!==e.data.length)throw new u("Vectors need to be the same length for calculation.",this);let t=0;for(let r=0;r<this.mData.length;r++)t+=this.mData[r]*e.data[r];return t}normalize(){let e=this.length(),t=new Array;for(let r of this.mData)t.push(r/e);return new o(t)}sub(e){let t=new Array;if(e instanceof o){if(this.mData.length!==e.data.length)throw new u("Vectors need to be the same length for calculation.",this);for(let r=0;r<this.mData.length;r++)t.push(this.mData[r]-e.data[r])}else for(let r of this.mData)t.push(r-e);return new o(t)}}});var ot,Mr=p(()=>{w();ye();ot=class{mColor;get data(){return this.mColor.data}constructor(){this.mColor=new U([1,1,1,1])}setColor(e,t,r){if(e>1||e<0||t>1||t<0||r>1||r<0)throw new u(`Color values need to be in 0 to 1 range. (R:${e}, G:${t}, B:${r})`,this);this.mColor.data[0]=e,this.mColor.data[1]=t,this.mColor.data[2]=r}}});var W,st=p(()=>{w();ye();W=class o{static fromArray(e,t,r){let i=new Array;for(let a=0;a<t;a++){let n=new Array(r);for(let s=0;s<r;s++)n[s]=e[s*t+a];i.push(n)}return new o(i)}static identity(e){let t=new Array;for(let r=0;r<e;r++){let i=new Array(e).fill(0);i[r]=1,t.push(i)}return new o(t)}mData;get data(){return this.mData}get dataArray(){let e=new Array;for(let t=0;t<this.width;t++)for(let r=0;r<this.height;r++)e.push(this.mData[r][t]);return e}get height(){return this.mData.length}get width(){return this.mData[0]?.length??0}constructor(e){this.mData=e}add(e){let t=new Array;if(e instanceof o){if(this.height!==e.height&&this.width!==e.width)throw new u("Matrices need to be the same size for calculation.",this);for(let r=0;r<this.height;r++){let i=new Array(this.width);for(let a=0;a<i.length;a++)i[a]=this.mData[r][a]+e.data[r][a];t.push(i)}}else for(let r=0;r<this.height;r++){let i=new Array(this.width);for(let a=0;a<i.length;a++)i[a]=this.mData[r][a]+e;t.push(i)}return new o(t)}adjoint(){let e=new Array;for(let r=0;r<this.height;r++){let i=new Array;for(let a=0;a<this.width;a++){let n=this.omit(r,a).determinant();n*=Math.pow(-1,r+1+(a+1)),i.push(n)}e.push(i)}return new o(e).transpose()}determinant(){if(this.height===1&&this.width===1)return this.data[0][0];let e=0;for(let t=0;t<this.width;t++){let r=this.data[0][t];if(r*=t%2?-1:1,r!==0){let i=this.omit(0,t);e+=r*i.determinant()}}return e}inverse(){let e=this.adjoint(),t=this.determinant();for(let r=0;r<this.width;r++)for(let i=0;i<this.height;i++)e.data[i][r]/=t;return e}mult(e){let t=new Array;if(e instanceof o){if(this.width!==e.height)throw new u("Matrices A width and B height must match for multiplication.",this);for(let r=0;r<this.height;r++){let i=new Array(e.width);for(let a=0;a<i.length;a++){let n=0;for(let s=0;s<this.height;s++)n+=this.mData[r][s]*e.data[s][a];i[a]=n}t.push(i)}}else for(let r=0;r<this.height;r++){let i=new Array(this.width);for(let a=0;a<this.width;a++)i[a]=this.mData[r][a]*e;t.push(i)}return new o(t)}omit(e,t){let r=new Array;for(let i=0;i<this.height;i++)if(i!==e){let a=new Array;for(let n=0;n<this.width;n++)n!==t&&a.push(this.data[i][n]);r.push(a)}return new o(r)}sub(e){let t=new Array;if(e instanceof o){if(this.height!==e.height&&this.width!==e.width)throw new u("Matrices need to be the same size for calculation.",this);for(let r=0;r<this.height;r++){let i=new Array(this.width);for(let a=0;a<i.length;a++)i[a]=this.mData[r][a]-e.data[r][a];t.push(i)}}else for(let r=0;r<this.height;r++){let i=new Array(this.width);for(let a=0;a<i.length;a++)i[a]=this.mData[r][a]-e;t.push(i)}return new o(t)}transpose(){let e=new Array;for(let t=0;t<this.width;t++){let r=new Array;for(let i=0;i<this.height;i++)r.push(this.data[i][t]);e.push(r)}return new o(e)}vectorMult(e){if(this.width!==e.data.length)throw new u("Matrices A width and B height must match for multiplication.",this);let t=new Array;for(let a of e.data)t.push([a]);let r=this.mult(new o(t)),i=new Array;for(let a=0;a<r.height;a++)i.push(r.data[a][0]);return new U(i)}}});var ut,Ir=p(()=>{ut=class{mX;mY;mZ;get x(){return this.mX}set x(e){this.mX=e}get y(){return this.mY}set y(e){this.mY=e}get z(){return this.mZ}set z(e){this.mZ=e}constructor(){this.mX=0,this.mY=0,this.mZ=0}}});var pe,Fr=p(()=>{Ir();st();ye();pe=class o{static fromRotation(e,t,r){let i=e%360*Math.PI/180,a=t%360*Math.PI/180,n=r%360*Math.PI/180,s=Math.cos(i*.5),m=Math.sin(i*.5),l=Math.cos(a*.5),c=Math.sin(a*.5),d=Math.cos(n*.5),g=Math.sin(n*.5),y=o.identity();return y.w=s*l*d+m*c*g,y.x=m*l*d-s*c*g,y.y=s*c*d+m*l*g,y.z=s*l*g-m*c*d,y}static identity(){return new o(1,0,0,0)}mW;mX;mY;mZ;get vectorForward(){let e=2*Math.pow(this.mX,2),t=2*Math.pow(this.mY,2),r=2*this.mX*this.mZ,i=2*this.mY*this.mW,a=2*this.mY*this.mZ,n=2*this.mX*this.mW,s=r+i,m=a-n,l=1-e-t;return new U([s,m,l])}get vectorRight(){let e=2*Math.pow(this.mY,2),t=2*Math.pow(this.mZ,2),r=2*this.mX*this.mY,i=2*this.mZ*this.mW,a=2*this.mY*this.mZ,n=2*this.mX*this.mW,s=1-e-t,m=r+i,l=a+n;return new U([s,m,l])}get vectorUp(){let e=2*Math.pow(this.mX,2),t=2*Math.pow(this.mZ,2),r=2*this.mX*this.mY,i=2*this.mZ*this.mW,a=2*this.mY*this.mZ,n=2*this.mX*this.mW,s=r-i,m=1-e-t,l=a+n;return new U([s,m,l])}get w(){return this.mW}set w(e){this.mW=e}get x(){return this.mX}set x(e){this.mX=e}get y(){return this.mY}set y(e){this.mY=e}get z(){return this.mZ}set z(e){this.mZ=e}constructor(e,t,r,i){this.mX=t,this.mY=r,this.mZ=i,this.mW=e}addEulerRotation(e,t,r){return this.mult(o.fromRotation(e,t,r))}asEuler(){let e=new ut,t=2*(this.mW*this.mX+this.mY*this.mZ),r=1-2*(this.mX*this.mX+this.mY*this.mY),a=Math.atan2(t,r)*180/Math.PI%360;e.x=a<0?a+360:a;let n=Math.sqrt(1+2*(this.mW*this.mY-this.mX*this.mZ)),s=Math.sqrt(1-2*(this.mW*this.mY-this.mX*this.mZ)),l=(2*Math.atan2(n,s)-Math.PI/2)*180/Math.PI%360;e.y=l<0?l+360:l;let c=2*(this.mW*this.mZ+this.mX*this.mY),d=1-2*(this.mY*this.mY+this.mZ*this.mZ),y=Math.atan2(c,d)*180/Math.PI%360;return e.z=y<0?y+360:y,e}asMatrix(){let e=2*Math.pow(this.mX,2),t=2*Math.pow(this.mY,2),r=2*Math.pow(this.mZ,2),i=2*this.mX*this.mY,a=2*this.mZ*this.mW,n=2*this.mX*this.mZ,s=2*this.mY*this.mW,m=2*this.mY*this.mZ,l=2*this.mX*this.mW,c=W.identity(4);return c.data[0][0]=1-t-r,c.data[0][1]=i-a,c.data[0][2]=n+s,c.data[1][0]=i+a,c.data[1][1]=1-e-r,c.data[1][2]=m-l,c.data[2][0]=n-s,c.data[2][1]=m+l,c.data[2][2]=1-e-t,c}mult(e){let t=this.mW*e.w-this.mX*e.x-this.mY*e.y-this.mZ*e.z,r=this.mW*e.x+this.mX*e.w+this.mY*e.z-this.mZ*e.y,i=this.mW*e.y-this.mX*e.z+this.mY*e.w+this.mZ*e.x,a=this.mW*e.z+this.mX*e.y-this.mY*e.x+this.mZ*e.w;return new o(t,r,i,a)}normalize(){let e=Math.hypot(Math.pow(this.mW,2),Math.pow(this.mX,2),Math.pow(this.mY,2),Math.pow(this.mZ,2));return new o(this.mW/e,this.mX/e,this.mY/e,this.mZ/e)}}});var V,Lt=p(()=>{st();Fr();ye();V=class{mPivot;mRotation;mScale;mTranslation;get pivotX(){return this.mPivot.data[0][3]}set pivotX(e){this.mPivot.data[0][3]=e}get pivotY(){return this.mPivot.data[1][3]}set pivotY(e){this.mPivot.data[1][3]=e}get pivotZ(){return this.mPivot.data[2][3]}set pivotZ(e){this.mPivot.data[2][3]=e}get rotationPitch(){return this.mRotation.asEuler().x}get rotationRoll(){return this.mRotation.asEuler().z}get rotationYaw(){return this.mRotation.asEuler().y}get scaleDepth(){return this.mScale.data[2][2]}get scaleHeight(){return this.mScale.data[1][1]}get scaleWidth(){return this.mScale.data[0][0]}get translationX(){return this.mTranslation.data[0][3]}get translationY(){return this.mTranslation.data[1][3]}get translationZ(){return this.mTranslation.data[2][3]}constructor(){this.mScale=W.identity(4),this.mTranslation=W.identity(4),this.mRotation=new pe(1,0,0,0),this.mPivot=W.identity(4)}addEulerRotation(e,t,r){this.mRotation=this.mRotation.addEulerRotation(e,t,r)}addRotation(e,t,r){this.mRotation=pe.fromRotation(e,t,r).mult(this.mRotation)}addScale(e,t,r){this.mScale.data[0][0]+=e,this.mScale.data[1][1]+=t,this.mScale.data[2][2]+=r}addTranslation(e,t,r){return this.mTranslation.data[0][3]+=e,this.mTranslation.data[1][3]+=t,this.mTranslation.data[2][3]+=r,this}getMatrix(e){switch(e){case 4:return this.mScale;case 3:return this.mTranslation;case 1:return this.mRotation.asMatrix();case 2:{let t=this.getMatrix(1),r;return this.pivotX!==0||this.pivotY!==0||this.pivotZ!==0?r=this.mPivot.inverse().mult(t).mult(this.mPivot):r=t,r}case 5:{let t=this.getMatrix(4),r=this.getMatrix(3),i=this.getMatrix(2);return r.mult(i).mult(t)}}}setRotation(e,t,r){let i=e??this.rotationPitch,a=t??this.rotationYaw,n=r??this.rotationRoll;this.mRotation=pe.fromRotation(i,a,n)}setScale(e,t,r){return this.mScale.data[0][0]=e??this.scaleWidth,this.mScale.data[1][1]=t??this.scaleHeight,this.mScale.data[2][2]=r??this.scaleDepth,this}setTranslation(e,t,r){return this.mTranslation.data[0][3]=e??this.translationX,this.mTranslation.data[1][3]=t??this.translationY,this.mTranslation.data[2][3]=r??this.translationZ,this}translateInDirection(e,t,r){let i=new U([t,r,e,1]),a=this.getMatrix(1).vectorMult(i);this.addTranslation(a.x,a.y,a.z)}}});var mt,Or=p(()=>{st();mt=class{mAngleOfView;mAspectRatio;mCacheProjectionMatrix;mFar;mNear;get angleOfView(){return this.mAngleOfView}set angleOfView(e){this.mAngleOfView=e,this.mCacheProjectionMatrix=null}get aspectRatio(){return this.mAspectRatio}set aspectRatio(e){this.mAspectRatio=e,this.mCacheProjectionMatrix=null}get far(){return this.mFar}set far(e){this.mFar=e,this.mCacheProjectionMatrix=null}get near(){return this.mNear}set near(e){this.mNear=e,this.mCacheProjectionMatrix=null}get projectionMatrix(){return this.mCacheProjectionMatrix===null&&(this.mCacheProjectionMatrix=this.createMatrix()),this.mCacheProjectionMatrix}constructor(){this.mAngleOfView=0,this.mNear=0,this.mFar=0,this.mAspectRatio=0,this.mCacheProjectionMatrix=null}createMatrix(){let e=W.identity(4);e.data[0][0]=0,e.data[1][1]=0,e.data[2][2]=0,e.data[3][3]=0;let t=this.mFar,r=this.mNear,i=this.mNear*Math.tan(this.angleOfView*Math.PI/180/2),a=-i,n=i*this.aspectRatio,s=-n;return e.data[0][0]=2*r/(n-s),e.data[0][2]=-(n+s)/(n-s),e.data[1][1]=2*r/(i-a),e.data[1][2]=-(i+a)/(i-a),e.data[2][2]=t/(t-r),e.data[2][3]=-(t*r)/(t-r),e.data[3][2]=1,e}}});var lt,At=p(()=>{Lt();lt=class{mProjection;mTransformation;get projection(){return this.mProjection}get transformation(){return this.mTransformation}constructor(e){this.mProjection=e,this.mTransformation=new V}getMatrix(e){switch(e){case 1:return this.mTransformation.getMatrix(3);case 2:return this.mTransformation.getMatrix(1);case 3:return this.mTransformation.getMatrix(2);case 4:return this.mProjection.projectionMatrix;case 5:{let t=this.getMatrix(1),r=this.getMatrix(2);return t.mult(r).inverse()}case 6:{let t=this.getMatrix(5);return this.getMatrix(4).mult(t)}}}}});var Vr,Ur=p(()=>{Vr=`// ------------------------- Object Values ---------------------- //\r
@group(0) @binding(0) var<uniform> transformationMatrix: mat4x4<f32>;\r
@group(0) @binding(1) var<uniform> color: vec4<f32>;\r
// -------------------------------------------------------------- //\r
\r
\r
// ------------------------- World Values ---------------------- //\r
struct Camera {\r
    viewProjection: mat4x4<f32>,\r
    view: mat4x4<f32>,\r
    projection: mat4x4<f32>,\r
    rotation: mat4x4<f32>,\r
    translation: mat4x4<f32>,\r
    position: vec3<f32>\r
}\r
@group(1) @binding(0) var<uniform> camera: Camera;\r
\r
struct TimeData {\r
    timestamp: f32,\r
    delta: f32\r
}\r
@group(1) @binding(1) var<uniform> time: TimeData;\r
\r
struct AmbientLight {\r
    color: vec4<f32>\r
}\r
@group(1) @binding(2) var<uniform> ambientLight: AmbientLight;\r
\r
struct PointLight {\r
    position: vec4<f32>,\r
    color: vec4<f32>,\r
    range: f32\r
}\r
@group(1) @binding(3) var<storage, read> pointLights: array<PointLight>;\r
\r
@group(1) @binding(4) var<storage, read_write> debugValue: f32;\r
// -------------------------------------------------------------- //\r
\r
\r
// --------------------- Light calculations --------------------- //\r
\r
/**\r
 * Calculate point light output.\r
 */\r
fn calculatePointLights(fragmentPosition: vec4<f32>, normal: vec4<f32>) -> vec4<f32> {\r
    // Count of point lights.\r
    let pointLightCount: u32 = arrayLength(&pointLights);\r
\r
    var lightResult: vec4<f32> = vec4<f32>(0, 0, 0, 1);\r
\r
    for (var index: u32 = 0; index < pointLightCount; index++) {\r
        var pointLight: PointLight = pointLights[index];\r
\r
        // Calculate light strength based on angle of incidence.\r
        let lightDirection: vec4<f32> = normalize(pointLight.position - fragmentPosition);\r
        let diffuse: f32 = max(dot(normal, lightDirection), 0.0);\r
\r
        lightResult += pointLight.color * diffuse;\r
    }\r
\r
    return lightResult;\r
}\r
\r
/**\r
 * Apply lights to fragment color.\r
 */\r
fn applyLight(colorIn: vec4<f32>, fragmentPosition: vec4<f32>, normal: vec4<f32>) -> vec4<f32> {\r
    var lightColor: vec4<f32> = vec4<f32>(0, 0, 0, 1);\r
\r
    lightColor += ambientLight.color;\r
    lightColor += calculatePointLights(fragmentPosition, normal);\r
\r
    return lightColor * colorIn;\r
}\r
// -------------------------------------------------------------- //\r
\r
struct VertexOut {\r
    @builtin(position) position: vec4<f32>,\r
    @location(0) color: vec4<f32>,\r
    @location(1) normal: vec4<f32>,\r
    @location(2) fragmentPosition: vec4<f32>,\r
}\r
\r
struct VertexIn {\r
    @builtin(instance_index) instanceId : u32,\r
    @location(0) position: vec4<f32>,\r
    @location(1) normal: vec4<f32>\r
}\r
\r
@vertex\r
fn vertex_main(vertex: VertexIn) -> VertexOut {\r
    var worldposition: vec4<f32> = transformationMatrix * vertex.position;\r
\r
    var out: VertexOut;\r
    out.position = camera.viewProjection * worldposition;\r
    out.normal = vertex.normal;\r
    out.fragmentPosition = worldposition;\r
    out.color = color;\r
\r
    return out;\r
}\r
\r
struct FragmentIn {\r
    @location(0) color: vec4<f32>,\r
    @location(1) normal: vec4<f32>,\r
    @location(2) fragmentPosition: vec4<f32>,\r
}\r
\r
@fragment\r
fn fragment_main(fragment: FragmentIn) -> @location(0) vec4<f32> {\r
    return applyLight(fragment.color, fragment.fragmentPosition, fragment.normal);\r
}`});var jr,Er=p(()=>{jr=`// ------------------------- Object Values ---------------------- //\r
@group(0) @binding(0) var<uniform> transformationMatrix: mat4x4<f32>;\r
@group(0) @binding(1) var<storage, read> instancePositions: array<vec4<f32>>;\r
// -------------------------------------------------------------- //\r
\r
\r
// ------------------------- World Values ---------------------- //\r
struct Camera {\r
    viewProjection: mat4x4<f32>,\r
    view: mat4x4<f32>,\r
    projection: mat4x4<f32>,\r
    rotation: mat4x4<f32>,\r
    translation: mat4x4<f32>,\r
    position: vec3<f32>\r
}\r
@group(1) @binding(0) var<uniform> camera: Camera;\r
\r
struct TimeData {\r
    timestamp: f32,\r
    delta: f32\r
}\r
@group(1) @binding(1) var<uniform> time: TimeData;\r
\r
struct AmbientLight {\r
    color: vec4<f32>\r
}\r
@group(1) @binding(2) var<uniform> ambientLight: AmbientLight;\r
\r
struct PointLight {\r
    position: vec4<f32>,\r
    color: vec4<f32>,\r
    range: f32\r
}\r
@group(1) @binding(3) var<storage, read> pointLights: array<PointLight>;\r
\r
@group(1) @binding(4) var<storage, read_write> debugValue: f32;\r
// -------------------------------------------------------------- //\r
\r
\r
// ------------------------- User Inputs ------------------------ //\r
@group(2) @binding(0) var cubeTextureSampler: sampler;\r
@group(2) @binding(1) var cubeTexture: texture_2d_array<f32>;\r
// -------------------------------------------------------------- //\r
\r
\r
// --------------------- Light calculations --------------------- //\r
\r
/**\r
 * Calculate point light output.\r
 */\r
fn calculatePointLights(fragmentPosition: vec4<f32>, normal: vec4<f32>) -> vec4<f32> {\r
    // Count of point lights.\r
    let pointLightCount: u32 = arrayLength(&pointLights);\r
\r
    var lightResult: vec4<f32> = vec4<f32>(0, 0, 0, 1);\r
\r
    for (var index: u32 = 0; index < pointLightCount; index++) {\r
        var pointLight: PointLight = pointLights[index];\r
\r
        // Calculate light strength based on angle of incidence.\r
        let lightDirection: vec4<f32> = normalize(pointLight.position - fragmentPosition);\r
        let diffuse: f32 = max(dot(normal, lightDirection), 0.0);\r
\r
        lightResult += pointLight.color * diffuse;\r
    }\r
\r
    return lightResult;\r
}\r
\r
/**\r
 * Apply lights to fragment color.\r
 */\r
fn applyLight(colorIn: vec4<f32>, fragmentPosition: vec4<f32>, normal: vec4<f32>) -> vec4<f32> {\r
    var lightColor: vec4<f32> = vec4<f32>(0, 0, 0, 1);\r
\r
    lightColor += ambientLight.color;\r
    lightColor += calculatePointLights(fragmentPosition, normal);\r
\r
    return lightColor * colorIn;\r
}\r
// -------------------------------------------------------------- //\r
\r
fn hash(x: u32) -> u32\r
{\r
    var result: u32 = x;\r
    result ^= result >> 16;\r
    result *= 0x7feb352du;\r
    result ^= result >> 15;\r
    result *= 0x846ca68bu;\r
    result ^= result >> 16;\r
    return result;\r
}\r
\r
struct VertexOut {\r
    @builtin(position) position: vec4<f32>,\r
    @location(0) uv: vec2<f32>,\r
    @location(1) normal: vec4<f32>,\r
    @location(2) fragmentPosition: vec4<f32>,\r
    @interpolate(flat) @location(3) textureLayer: u32\r
}\r
\r
struct VertexIn {\r
    @builtin(instance_index) instanceId : u32,\r
    @location(0) position: vec4<f32>,\r
    @location(1) uv: vec2<f32>,\r
    @location(2) normal: vec4<f32>\r
}\r
\r
override animationSeconds: f32 = 3; \r
\r
@vertex\r
fn vertex_main(vertex: VertexIn) -> VertexOut {\r
    let textureLayers: f32 = f32(textureNumLayers(cubeTexture));\r
\r
    var instancePosition: vec4<f32> = instancePositions[vertex.instanceId];\r
\r
    // Generate 4 random numbers.\r
    var hash1: u32 = hash(vertex.instanceId + 1);\r
    var hash2: u32 = hash(hash1);\r
    var hash3: u32 = hash(hash2);\r
    var hash4: u32 = hash(hash3);\r
\r
    // Convert into normals.\r
    var hashStartDisplacement: f32 = (f32(hash1) - pow(2, 31)) * 2 / pow(2, 32);\r
    var randomNormalPosition: vec4<f32> = vec4<f32>(\r
        (f32(hash2) - pow(2, 31)) * 2 / pow(2, 32),\r
        (f32(hash3) - pow(2, 31)) * 2 / pow(2, 32),\r
        (f32(hash4) - pow(2, 31)) * 2 / pow(2, 32),\r
        1\r
    );\r
\r
    // Calculate random position and animate a 100m spread. \r
    var randPosition: vec4<f32> = randomNormalPosition * 1000; // Randomise start spreading 1000m in all directsions.\r
    randPosition += randomNormalPosition * sin((time.timestamp / animationSeconds) + (hashStartDisplacement * 100)) * 100;\r
    randPosition.w = 1; // Reset w coord.\r
\r
    let randomPositionMatrix: mat4x4<f32> = mat4x4<f32>(\r
        1, 0, 0, 0,\r
        0, 1, 0, 0,\r
        0, 0, 1, 0,\r
        randPosition.x, randPosition.y, randPosition.z, 1\r
    );\r
\r
    let instancePositionMatrix: mat4x4<f32> = mat4x4<f32>(\r
        1, 0, 0, 0,\r
        0, 1, 0, 0,\r
        0, 0, 1, 0,\r
        instancePosition.x, instancePosition.y, instancePosition.z, 1\r
    );\r
\r
    var textureLayer: u32 = u32(floor(f32(vertex.instanceId) % textureLayers));\r
\r
    var worldposition: vec4<f32> = randomPositionMatrix * instancePositionMatrix * transformationMatrix * vertex.position;\r
\r
    var out: VertexOut;\r
    out.position = camera.viewProjection * worldposition;\r
    out.uv = vertex.uv;\r
    out.normal = vertex.normal;\r
    out.fragmentPosition = worldposition;\r
    out.textureLayer = textureLayer;\r
\r
    return out;\r
}\r
\r
struct FragmentIn {\r
    @location(0) uv: vec2<f32>,\r
    @location(1) normal: vec4<f32>,\r
    @location(2) fragmentPosition: vec4<f32>,\r
    @interpolate(flat) @location(3) textureLayer: u32\r
}\r
\r
@fragment\r
fn fragment_main(fragment: FragmentIn) -> @location(0) vec4<f32> {\r
    return applyLight(textureSample(cubeTexture, cubeTextureSampler, fragment.uv, fragment.textureLayer), fragment.fragmentPosition, fragment.normal);\r
}`});var Wr,kr=p(()=>{Wr=`// ------------------------- Object Values ---------------------- //\r
struct Particle {\r
    position: vec3<f32>,\r
    rotation: vec3<f32>,\r
    velocity: vec3<f32>,\r
    lifetime: f32\r
}\r
@group(0) @binding(0) var<storage, read_write> particles: array<Particle>;\r
@group(0) @binding(1) var<storage, read_write> indirect: array<atomic<u32>, 4>;\r
// -------------------------------------------------------------- //\r
\r
\r
// ------------------------- World Values ---------------------- //\r
struct CameraTransformation {\r
    rotation: mat4x4<f32>,\r
    translation: mat4x4<f32>\r
}\r
struct Camera {\r
    viewProjection: mat4x4<f32>,\r
    view: mat4x4<f32>,\r
    projection: mat4x4<f32>,\r
    translation: CameraTransformation,\r
    invertedTranslation: CameraTransformation,\r
    position: vec3<f32>\r
}\r
@group(1) @binding(0) var<uniform> camera: Camera;\r
\r
struct TimeData {\r
    timestamp: f32,\r
    delta: f32\r
}\r
@group(1) @binding(1) var<uniform> time: TimeData;\r
\r
struct AmbientLight {\r
    color: vec4<f32>\r
}\r
@group(1) @binding(2) var<uniform> ambientLight: AmbientLight;\r
\r
struct PointLight {\r
    position: vec4<f32>,\r
    color: vec4<f32>,\r
    range: f32\r
}\r
@group(1) @binding(3) var<storage, read> pointLights: array<PointLight>;\r
\r
@group(1) @binding(4) var<storage, read_write> debugValue: f32;\r
// -------------------------------------------------------------- //\r
\r
/**\r
 * PCG-Hash\r
 */\r
fn hash(input: u32) -> u32\r
{\r
    let state: u32 = input * 747796405u + 2891336453u;\r
    let word: u32 = ((state >> ((state >> 28u) + 4u)) ^ state) * 277803737u;\r
    return (word >> 22u) ^ word;\r
}\r
\r
override animationSeconds: f32 = 3; \r
\r
struct ComputeParams {\r
    @builtin(global_invocation_id) globalInvocationId : vec3u\r
}\r
@compute @workgroup_size(64)\r
fn compute_main(params: ComputeParams) {\r
    const MAX_DISTANCE: f32 = 3;\r
    const MAX_LIFETIME: f32 = 9999;\r
\r
    let id = params.globalInvocationId.x;\r
    if(id >= arrayLength(&particles)) {\r
        return;\r
    }\r
\r
    var particle: Particle = particles[id];\r
\r
    // Atomic just in case\r
    atomicStore(&indirect[1], 600);\r
\r
    // Update time\r
    particle.lifetime -= time.delta;\r
\r
    // Mark particle to kill.\r
    let cameraDistance: f32 = distance(particle.position, camera.position);\r
    if(cameraDistance > MAX_DISTANCE && particle.lifetime > 1) {\r
        particle.lifetime = 0;\r
    }\r
\r
    // Recreate particle.\r
    if(particle.lifetime <= 0) {\r
        var hash1: u32 = hash(id * 10000  + u32(time.timestamp * 1000));\r
        var hash2: u32 = hash(hash1);\r
        var hash3: u32 = hash(hash2);\r
        var hash4: u32 = hash(hash3);\r
\r
        let radi: f32 = (f32(hash1) - pow(2, 31)) * 2 / pow(2, 32);\r
        let posX: f32 = (f32(hash2) - pow(2, 31)) * 2 / pow(2, 32);\r
        let posY: f32 = (f32(hash3) - pow(2, 31)) * 2 / pow(2, 32);\r
        let posZ: f32 = (f32(hash4) - pow(2, 31)) * 2 / pow(2, 32);\r
\r
        // Random normalized vector.\r
        var randomPosition: vec3<f32> =vec3<f32>(posX, posY, posZ);\r
        randomPosition = normalize(randomPosition);\r
\r
        // Flip Y when it is negative.\r
        randomPosition.y = abs(randomPosition.y);\r
\r
        // Scale ball by 10m\r
        randomPosition *= MAX_DISTANCE * 0.75;\r
\r
        particle.position = randomPosition + camera.position;\r
        particle.rotation = randomPosition;\r
        particle.lifetime = MAX_LIFETIME;\r
        particle.velocity = vec3<f32>(0.1, -0.2, 0);\r
    }\r
\r
    // Move by velocity.\r
    particle.position += particle.velocity * time.delta;\r
    particle.rotation += particle.velocity * time.delta * 8;\r
\r
    _ = animationSeconds;\r
\r
    particles[id] = particle;\r
}`});var Nr,zr=p(()=>{Nr=`// ------------------------- Object Values ---------------------- //\r
@group(0) @binding(0) var<uniform> transformationMatrix: mat4x4<f32>;\r
struct Particle {\r
    position: vec3<f32>,\r
    rotation: vec3<f32>,\r
    velocity: vec3<f32>,\r
    lifetime: f32\r
}\r
@group(0) @binding(1) var<storage, read> particles: array<Particle>;\r
// -------------------------------------------------------------- //\r
\r
\r
// ------------------------- World Values ---------------------- //\r
struct CameraTransformation {\r
    rotation: mat4x4<f32>,\r
    translation: mat4x4<f32>\r
}\r
struct Camera {\r
    viewProjection: mat4x4<f32>,\r
    view: mat4x4<f32>,\r
    projection: mat4x4<f32>,\r
    translation: CameraTransformation,\r
    invertedTranslation: CameraTransformation,\r
    position: vec3<f32>\r
}\r
@group(1) @binding(0) var<uniform> camera: Camera;\r
\r
struct TimeData {\r
    timestamp: f32,\r
    delta: f32\r
}\r
@group(1) @binding(1) var<uniform> time: TimeData;\r
\r
struct AmbientLight {\r
    color: vec4<f32>\r
}\r
@group(1) @binding(2) var<uniform> ambientLight: AmbientLight;\r
\r
struct PointLight {\r
    position: vec4<f32>,\r
    color: vec4<f32>,\r
    range: f32\r
}\r
@group(1) @binding(3) var<storage, read> pointLights: array<PointLight>;\r
\r
@group(1) @binding(4) var<storage, read_write> debugValue: f32;\r
// -------------------------------------------------------------- //\r
\r
\r
// ------------------------- User Inputs ------------------------ //\r
@group(2) @binding(0) var textureSampler: sampler;\r
@group(2) @binding(1) var texture: texture_2d<f32>;\r
// -------------------------------------------------------------- //\r
\r
struct VertexOut {\r
    @builtin(position) position: vec4<f32>,\r
    @location(0) uv: vec2<f32>,\r
    @location(1) fragmentPosition: vec4<f32>,\r
    @location(2) alpha: f32\r
}\r
\r
struct VertexIn {\r
    @builtin(instance_index) instanceId : u32,\r
    @location(0) position: vec4<f32>,\r
    @location(1) uv: vec2<f32>\r
}\r
\r
@vertex\r
fn vertex_main(vertex: VertexIn) -> VertexOut {\r
    const MAX_DISTANCE: f32 = 3;\r
    const MAX_LIFETIME: f32 = 9999;\r
\r
    var particle: Particle = particles[vertex.instanceId];\r
\r
    let positionMatrix: mat4x4<f32> = mat4x4<f32>(\r
        1, 0, 0, 0,\r
        0, 1, 0, 0,\r
        0, 0, 1, 0,\r
        particle.position.x, particle.position.y, particle.position.z, 1,\r
    );\r
\r
    let rotationMatrixX: mat4x4<f32> = mat4x4<f32>(\r
        1, 0, 0, 0,\r
        0, cos(particle.rotation.x), -sin(particle.rotation.x), 0,\r
        0, sin(particle.rotation.x), cos(particle.rotation.x), 0,\r
        0, 0, 0, 1\r
    );\r
\r
    let rotationMatrixY: mat4x4<f32> = mat4x4<f32>(\r
        cos(particle.rotation.y), 0, sin(particle.rotation.y), 0,\r
        0, 1, 0, 0,\r
        -sin(particle.rotation.y), 0, cos(particle.rotation.y), 0,\r
        0, 0, 0, 1\r
    );\r
\r
    let rotationMatrixZ: mat4x4<f32> = mat4x4<f32>(\r
        cos(particle.rotation.z), -sin(particle.rotation.z), 0, 0,\r
        sin(particle.rotation.z), cos(particle.rotation.z), 0, 0,\r
        0, 0, 1, 0,\r
        0, 0, 0, 1\r
    );\r
\r
    let rotationMatrix: mat4x4<f32> = rotationMatrixX * rotationMatrixY * rotationMatrixZ;\r
\r
    let distanceScale: f32 = (MAX_DISTANCE - distance(particle.position, camera.position)) / MAX_DISTANCE;\r
    let scalingMatrix: mat4x4<f32> = mat4x4<f32>(\r
        distanceScale, 0, 0, 0,\r
        0, distanceScale, 0, 0,\r
        0, 0, distanceScale, 0,\r
        0, 0, 0, 1,\r
    );\r
\r
    let worldPosition: vec4<f32> = positionMatrix * scalingMatrix * transformationMatrix * rotationMatrix * vertex.position;\r
\r
    var out: VertexOut;\r
    out.position = camera.viewProjection * worldPosition;\r
    out.uv = vertex.uv;\r
    out.fragmentPosition = worldPosition;\r
    out.alpha = clamp(particle.lifetime, 0, 1);\r
\r
    return out;\r
}\r
\r
struct FragmentIn {\r
    @location(0) uv: vec2<f32>,\r
    @location(1) fragmentPosition: vec4<f32>,\r
    @location(2) alpha: f32\r
}\r
\r
@fragment\r
fn fragment_main(fragment: FragmentIn) -> @location(0) vec4<f32> {\r
    var color = textureSample(texture, textureSampler, fragment.uv);\r
    color.a *= fragment.alpha;\r
\r
    if(color.a == 0) {\r
        discard;\r
    }\r
\r
    return color;\r
}`});var Hr,Yr=p(()=>{Hr=`// ------------------------- Object Values ---------------------- //\r
@group(0) @binding(0) var<uniform> transformationMatrix: mat4x4<f32>;\r
// -------------------------------------------------------------- //\r
\r
\r
// ------------------------- World Values ---------------------- //\r
struct CameraTransformation {\r
    rotation: mat4x4<f32>,\r
    translation: mat4x4<f32>\r
}\r
struct Camera {\r
    viewProjection: mat4x4<f32>,\r
    view: mat4x4<f32>,\r
    projection: mat4x4<f32>,\r
    translation: CameraTransformation,\r
    invertedTranslation: CameraTransformation,\r
    position: vec3<f32>\r
}\r
@group(1) @binding(0) var<uniform> camera: Camera;\r
\r
struct TimeData {\r
    timestamp: f32,\r
    delta: f32\r
}\r
@group(1) @binding(1) var<uniform> time: TimeData;\r
\r
struct AmbientLight {\r
    color: vec4<f32>\r
}\r
@group(1) @binding(2) var<uniform> ambientLight: AmbientLight;\r
\r
struct PointLight {\r
    position: vec4<f32>,\r
    color: vec4<f32>,\r
    range: f32\r
}\r
@group(1) @binding(3) var<storage, read> pointLights: array<PointLight>;\r
\r
@group(1) @binding(4) var<storage, read_write> debugValue: f32;\r
// -------------------------------------------------------------- //\r
\r
struct VertexOut {\r
    @builtin(position) position: vec4<f32>,\r
    @location(0) color: vec4<f32>,\r
}\r
\r
struct VertexIn {\r
    @builtin(instance_index) instanceId : u32,\r
    @location(0) position: vec4<f32>,\r
    @location(1) uv: vec2<f32>,\r
    @location(2) normal: vec4<f32>\r
}\r
\r
@vertex\r
fn vertex_main(vertex: VertexIn) -> VertexOut {\r
    var instanceLight: PointLight = pointLights[vertex.instanceId];\r
\r
    var out: VertexOut;\r
    out.position = camera.viewProjection * (instanceLight.position + vertex.position) * transformationMatrix;\r
    out.color = instanceLight.color;\r
\r
    return out;\r
}\r
\r
struct FragmentIn {\r
    @location(0) color: vec4<f32>,\r
}\r
\r
@fragment\r
fn fragment_main(fragment: FragmentIn) -> @location(0) vec4<f32> {\r
    return fragment.color;\r
}`});var $r,_r=p(()=>{$r=`// ------------------------- Object Values ---------------------- //\r
@group(0) @binding(0) var cubeTextureSampler: sampler;\r
@group(0) @binding(1) var cubeMap: texture_cube<f32>;\r
// -------------------------------------------------------------- //\r
\r
\r
// ------------------------- World Values ---------------------- //\r
struct CameraTransformation {\r
    rotation: mat4x4<f32>,\r
    translation: mat4x4<f32>\r
}\r
struct Camera {\r
    viewProjection: mat4x4<f32>,\r
    view: mat4x4<f32>,\r
    projection: mat4x4<f32>,\r
    translation: CameraTransformation,\r
    invertedTranslation: CameraTransformation,\r
    position: vec3<f32>\r
}\r
@group(1) @binding(0) var<uniform> camera: Camera;\r
\r
struct TimeData {\r
    timestamp: f32,\r
    delta: f32\r
}\r
@group(1) @binding(1) var<uniform> time: TimeData;\r
\r
struct AmbientLight {\r
    color: vec4<f32>\r
}\r
@group(1) @binding(2) var<uniform> ambientLight: AmbientLight;\r
\r
struct PointLight {\r
    position: vec4<f32>,\r
    color: vec4<f32>,\r
    range: f32\r
}\r
@group(1) @binding(3) var<storage, read> pointLights: array<PointLight>;\r
\r
@group(1) @binding(4) var<storage, read_write> debugValue: f32;\r
// -------------------------------------------------------------- //\r
\r
struct VertexOut {\r
    @builtin(position) position: vec4<f32>,\r
    @location(1) fragmentPosition: vec4<f32>,\r
}\r
\r
struct VertexIn {\r
    @location(0) position: vec4<f32>,\r
}\r
\r
@vertex\r
fn vertex_main(vertex: VertexIn) -> VertexOut {\r
    var out: VertexOut;\r
    out.position = camera.projection * camera.invertedTranslation.rotation  * vertex.position;\r
    out.fragmentPosition = vertex.position;\r
\r
    return out;\r
}\r
\r
struct FragmentIn {\r
    @location(1) fragmentPosition: vec4<f32>,\r
}\r
\r
@fragment\r
fn fragment_main(fragment: FragmentIn) -> @location(0) vec4<f32> {\r
  return textureSample(cubeMap, cubeTextureSampler, fragment.fragmentPosition.xyz);\r
}`});var qr,Xr=p(()=>{qr=`// ------------------------- Object Values ---------------------- //\r
@group(0) @binding(0) var<uniform> transformationMatrix: mat4x4<f32>;\r
// -------------------------------------------------------------- //\r
\r
\r
// ------------------------- World Values ---------------------- //\r
struct CameraTransformation {\r
    rotation: mat4x4<f32>,\r
    translation: mat4x4<f32>\r
}\r
struct Camera {\r
    viewProjection: mat4x4<f32>,\r
    view: mat4x4<f32>,\r
    projection: mat4x4<f32>,\r
    translation: CameraTransformation,\r
    invertedTranslation: CameraTransformation,\r
    position: vec3<f32>\r
}\r
@group(1) @binding(0) var<uniform> camera: Camera;\r
\r
struct TimeData {\r
    timestamp: f32,\r
    delta: f32\r
}\r
@group(1) @binding(1) var<uniform> time: TimeData;\r
\r
struct AmbientLight {\r
    color: vec4<f32>\r
}\r
@group(1) @binding(2) var<uniform> ambientLight: AmbientLight;\r
\r
struct PointLight {\r
    position: vec4<f32>,\r
    color: vec4<f32>,\r
    range: f32\r
}\r
@group(1) @binding(3) var<storage, read> pointLights: array<PointLight>;\r
\r
@group(1) @binding(4) var<storage, read_write> debugValue: f32;\r
// -------------------------------------------------------------- //\r
\r
\r
// ------------------------- User Inputs ------------------------ //\r
@group(2) @binding(0) var videoTextureSampler: sampler;\r
@group(2) @binding(1) var videoTexture: texture_2d<f32>;\r
// -------------------------------------------------------------- //\r
\r
\r
// --------------------- Light calculations --------------------- //\r
\r
/**\r
 * Calculate point light output.\r
 */\r
fn calculatePointLights(fragmentPosition: vec4<f32>, normal: vec4<f32>) -> vec4<f32> {\r
    // Count of point lights.\r
    let pointLightCount: u32 = arrayLength(&pointLights);\r
\r
    var lightResult: vec4<f32> = vec4<f32>(0, 0, 0, 1);\r
\r
    for (var index: u32 = 0; index < pointLightCount; index++) {\r
        var pointLight: PointLight = pointLights[index];\r
\r
        // Calculate light strength based on angle of incidence.\r
        let lightDirection: vec4<f32> = normalize(pointLight.position - fragmentPosition);\r
        let diffuse: f32 = max(dot(normal, lightDirection), 0.0);\r
\r
        lightResult += pointLight.color * diffuse;\r
    }\r
\r
    return lightResult;\r
}\r
\r
/**\r
 * Apply lights to fragment color.\r
 */\r
fn applyLight(colorIn: vec4<f32>, fragmentPosition: vec4<f32>, normal: vec4<f32>) -> vec4<f32> {\r
    var lightColor: vec4<f32> = vec4<f32>(0, 0, 0, 1);\r
\r
    lightColor += ambientLight.color;\r
    lightColor += calculatePointLights(fragmentPosition, normal);\r
\r
    return lightColor * colorIn;\r
}\r
// -------------------------------------------------------------- //\r
struct VertexOut {\r
    @builtin(position) position: vec4<f32>,\r
    @location(0) uv: vec2<f32>,\r
    @location(1) normal: vec4<f32>,\r
    @location(2) fragmentPosition: vec4<f32>,\r
}\r
\r
struct VertexIn {\r
    @builtin(instance_index) instanceId : u32,\r
    @location(0) position: vec4<f32>,\r
    @location(1) uv: vec2<f32>,\r
    @location(2) normal: vec4<f32>\r
}\r
\r
@vertex\r
fn vertex_main(vertex: VertexIn) -> VertexOut {\r
    let translation: mat4x4<f32> = mat4x4(\r
        vec4<f32>(1, 0, 0, 0),\r
        vec4<f32>(0, 1, 0, 0),\r
        vec4<f32>(0, 0, 1, 0),\r
        transformationMatrix[3]\r
    );\r
\r
    let scaling: mat4x4<f32> = mat4x4(\r
        vec4<f32>(length(transformationMatrix[0].xyz), 0, 0, 0),\r
        vec4<f32>(0, length(transformationMatrix[1].xyz), 0, 0),\r
        vec4<f32>(0, 0, length(transformationMatrix[2].xyz), 0),\r
        vec4<f32>(0, 0, 0, 1),\r
    );\r
\r
    var transformedPosition: vec4<f32> = translation * camera.translation.rotation * scaling  * vertex.position;\r
\r
    var out: VertexOut;\r
    out.position = camera.viewProjection * transformedPosition;\r
    out.uv = vertex.uv;\r
    out.normal = camera.translation.rotation * vertex.normal;\r
    out.fragmentPosition = transformedPosition;\r
\r
    return out;\r
}\r
\r
struct FragmentIn {\r
    @location(0) uv: vec2<f32>,\r
    @location(1) normal: vec4<f32>,\r
    @location(2) fragmentPosition: vec4<f32>,\r
}\r
\r
@fragment\r
fn fragment_main(fragment: FragmentIn) -> @location(0) vec4<f32> {\r
    let videoColor: vec4<f32> = textureSample(videoTexture, videoTextureSampler, fragment.uv);\r
\r
    const red: f32 = 53;\r
    const green: f32 = 214;\r
    const blue: f32 = 19;\r
\r
    const redGreenRatio: f32 = red / green;\r
    const blueGreenRatio: f32 = blue / green;\r
\r
    const ratioTolerance: f32 = 0.5;\r
\r
    let curredRedGreenRatio: f32 = videoColor.r / videoColor.g;\r
    let curredBlueGreenRatio: f32 = videoColor.b / videoColor.g;\r
\r
    let compareRed: f32 = abs(curredRedGreenRatio - redGreenRatio);\r
    let compareBlue: f32 = abs(curredBlueGreenRatio - blueGreenRatio);\r
    \r
\r
    if(compareRed < ratioTolerance && compareBlue < ratioTolerance) {\r
        return vec4<f32>(videoColor.rgb, 0.0);\r
    }\r
\r
    return vec4<f32>(applyLight(videoColor, fragment.fragmentPosition, fragment.normal).rgb, (sin(fragment.uv.y * 750 + time.timestamp * 20) * 0.5 + 1) * 0.7);\r
}`});var Zr,Kr,Qr,Jr,ei=p(()=>{Zr=[-1,1,0,1,1,1,0,1,1,-1,0,1,-1,-1,0,1],Kr=[0,0,1,0,0,1,1,0,1,1,0,1],Qr=[0,0,-1,0,0,0,-1,0,0,0,-1,0,0,0,-1,0,0,0,-1,0,0,0,-1,0],Jr=[0,1,3,1,2,3]});var xe,Mt,pt,ve,ti=p(()=>{xe=[-1,1,1,1,1,1,1,1,1,-1,1,1,-1,-1,1,1,-1,1,-1,1,1,1,-1,1,1,-1,-1,1,-1,-1,-1,1],Mt=[.33333,.25,.66666,.25,.66666,.5,.33333,.25,.66666,.5,.33333,.5,.66666,1,.33333,1,.33333,.75,.66666,1,.33333,.75,.66666,.75,0,.25,.33333,.25,.33333,.5,0,.25,.33333,.5,0,.5,.66666,.25,1,.25,1,.5,.66666,.25,1,.5,.66666,.5,.33333,0,.66666,0,.66666,.25,.33333,0,.66666,.25,.33333,.25,.33333,.5,.66666,.5,.66666,.75,.33333,.5,.66666,.75,.33333,.75],pt=[0,0,-1,0,0,0,-1,0,0,0,-1,0,0,0,-1,0,0,0,-1,0,0,0,-1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,-1,0,0,0,-1,0,0,0,-1,0,0,0,-1,0,0,0,-1,0,0,0,-1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,-1,0,0,0,-1,0,0,0,-1,0,0,0,-1,0,0,0,-1,0,0,0,-1,0,0],ve=[4,5,6,4,6,7,1,0,3,1,3,2,0,4,7,0,7,3,5,1,2,5,2,6,0,1,5,0,5,4,7,6,2,7,2,3]});var ri,It,ii=p(()=>{ri=[-1,.5,0,1,0,0,0,-.5,0,1,.5,1,-1,-.5,-.6,1,0,1,-1,.5,0,1,0,0,0,.5,0,1,.5,0,0,-.5,0,1,.5,1,0,.5,0,1,.5,0,1,-.5,-.6,1,1,1,0,-.5,0,1,.5,1,0,.5,0,1,.5,0,1,.5,-1.2,1,1,0,1,-.5,-.6,1,1,1],It=[0,1,2,3,4,5,6,7,8,9,10,11]});var ai,ni,oi=p(()=>{w();At();ai=(o,e,t)=>{let r=new b;r.set("Forward",0),r.set("Back",0),r.set("Left",0),r.set("Right",0),r.set("Up",0),r.set("Down",0),r.set("RotateLeft",0),r.set("RotateRight",0),r.set("Yaw",0),r.set("Pitch",0),window.addEventListener("keydown",a=>{switch(a.code){case"KeyW":r.set("Forward",1);break;case"KeyS":r.set("Back",1);break;case"KeyA":r.set("Left",1);break;case"KeyD":r.set("Right",1);break;case"ShiftLeft":r.set("Up",1);break;case"ControlLeft":r.set("Down",1);break;case"KeyQ":r.set("RotateLeft",1);break;case"KeyE":r.set("RotateRight",1);break}}),window.addEventListener("keyup",a=>{switch(a.code){case"KeyW":r.set("Forward",0);break;case"KeyS":r.set("Back",0);break;case"KeyA":r.set("Left",0);break;case"KeyD":r.set("Right",0);break;case"ShiftLeft":r.set("Up",0);break;case"ControlLeft":r.set("Down",0);break;case"KeyQ":r.set("RotateLeft",0);break;case"KeyE":r.set("RotateRight",0);break}});let i=null;window.addEventListener("mousemove",a=>{let n=a.movementX,s=a.movementY,m=.5,l=Math.max(-1,Math.min(1,n*m)),c=Math.max(-1,Math.min(1,s*m));r.set("Yaw",l),r.set("Pitch",c),i!==null&&clearTimeout(i),i=setTimeout(()=>{r.set("Yaw",0),r.set("Pitch",0)},16)}),o.addEventListener("click",()=>{o.requestPointerLock()}),window.setInterval(()=>{r.get("Forward")>0&&e.transformation.translateInDirection(r.get("Forward")/50*10,0,0),r.get("Back")>0&&e.transformation.translateInDirection(-(r.get("Back")/50)*10,0,0),r.get("Right")>0&&e.transformation.translateInDirection(0,r.get("Right")/50*10,0),r.get("Left")>0&&e.transformation.translateInDirection(0,-(r.get("Left")/50)*10,0),r.get("Up")>0&&e.transformation.translateInDirection(0,0,r.get("Up")/50*10),r.get("Down")>0&&e.transformation.translateInDirection(0,0,-(r.get("Down")/50)*10),(r.get("Yaw")>0||r.get("Yaw")<0)&&e.transformation.addEulerRotation(0,r.get("Yaw"),0),(r.get("Pitch")>0||r.get("Pitch")<0)&&e.transformation.addEulerRotation(r.get("Pitch"),0,0),r.get("RotateLeft")>0&&e.transformation.addEulerRotation(0,0,r.get("RotateLeft")),r.get("RotateRight")>0&&e.transformation.addEulerRotation(0,0,-r.get("RotateRight")),t.write(new Float32Array(e.getMatrix(6).dataArray).buffer,0),t.write(new Float32Array(e.getMatrix(5).dataArray).buffer,64),t.write(new Float32Array(e.getMatrix(4).dataArray).buffer,128),t.write(new Float32Array([e.transformation.translationX,e.transformation.translationY,e.transformation.translationZ]).buffer,448),t.write(new Float32Array(e.getMatrix(2).dataArray).buffer,192),t.write(new Float32Array(e.getMatrix(1).dataArray).buffer,256),t.write(new Float32Array(e.getMatrix(2).inverse().dataArray).buffer,320),t.write(new Float32Array(e.getMatrix(1).inverse().dataArray).buffer,384)},8)},ni=(()=>{let o=0;return(e,t)=>{let r=document.getElementById("fps-display"),i=r.getContext("2d",{willReadFrequently:!0});if(t!==r.width&&(r.width=t,r.height=30),r.width<2)return;let a=i.getImageData(1,0,r.width-1,r.height),n=1;o<e&&(n=o/e,o=e),n===1?i.clearRect(r.width-1,0,1,r.height):i.clearRect(0,0,r.width,r.height);let s=Math.floor(r.height*n);i.putImageData(a,0,r.height-s,0,0,r.width-1,s);let m=e/o*r.height;i.fillStyle="#87beee",i.fillRect(r.width-1,r.height-m,1,m)}})()});var Oi={};var Bi,Gi,Li,Ai,Mi,Ii,Fi,si=p(()=>{Z();Te();gt();bt();Re();ne();yt();xt();Q();vt();Dt();St();oe();Ce();Jt();nr();Bt();sr();Gt();dr();Lr();Ar();Mr();Lt();Or();At();Ur();Er();kr();zr();Yr();_r();Xr();ei();ti();ii();oi();Bi=(o,e,t)=>{let s=new k(o,jr).setup(h=>{h.parameter("animationSeconds",D.Vertex),h.vertexEntryPoint("vertex_main",new H(o).setup(f=>{f.buffer("position","index-step").withParameter("position",0,"float32","v4"),f.buffer("uv","vertex-step").withParameter("uv",1,"float32","v2"),f.buffer("normal","vertex-step").withParameter("normal",2,"float32","v4")})),h.fragmentEntryPoint("fragment_main",f=>{f.addRenderTarget("main",0,"float32","v4")}),h.group(0,new M(o,"object").setup(f=>{f.binding(0,"transformationMatrix",D.Vertex).asBuffer(64),f.binding(1,"instancePositions",D.Vertex,1).asBuffer(0,16)})),h.group(1,t.layout),h.group(2,new M(o,"user").setup(f=>{f.binding(0,"cubeTextureSampler",D.Fragment).asSampler("filtering"),f.binding(1,"cubeTexture",D.Fragment|D.Vertex).asTexture("2d-array","rgba8unorm")}))}).createRenderModule("vertex_main","fragment_main"),m=s.layout.getGroupLayout("object").create();m.data("transformationMatrix").createBufferWithRawData(new Float32Array(new V().setScale(1,1,1).getMatrix(5).dataArray).buffer);let l=new Array;for(let h=0;h<50;h++)for(let f=0;f<50;f++)for(let x=0;x<50;x++)l.push(h*3,f*3,x*3,1);m.data("instancePositions").createBufferWithRawData(new Float32Array(l).buffer);let c=s.layout.getGroupLayout("user").create(),d=c.data("cubeTexture").createTexture().texture;d.depth=3,d.mipCount=20,(async()=>{let h=["/source/game_objects/cube/texture_one/cube-texture.png","/source/game_objects/cube/texture_two/cube-texture.png","/source/game_objects/cube/texture_three/cube-texture.png"],f=0,x=0,z=new Array;for(let ie=0;ie<20;ie++)z.push("#"+Math.floor(Math.random()*16777215).toString(16));let T=h.map(async(ie,De)=>{let F=new Image;if(F.src=ie,await F.decode(),(f===0||x===0)&&(x=F.naturalWidth,f=F.naturalHeight),f!==F.naturalHeight||x!==F.naturalWidth)throw new Error(`Texture image layers are not the same size. (${F.naturalWidth}, ${F.naturalHeight}) needs (${x}, ${f}).`);let I=new Array,ct=new Array;I.push(createImageBitmap(F).then(_=>{ct.push({data:_,mipLevel:0,targetOrigin:{x:0,y:0,z:De}})}));let ui=1+Math.floor(Math.log2(Math.max(x,f)));for(let _=1;_<ui;_++){let ae=new OffscreenCanvas(Math.max(1,Math.floor(x/Math.pow(2,_))),Math.max(1,Math.floor(f/Math.pow(2,_)))),ce=ae.getContext("2d");ce.globalAlpha=1,ce.drawImage(F,0,0,x,f,0,0,ae.width,ae.height),ce.globalAlpha=.5,ce.fillStyle=z[_],ce.fillRect(0,0,ae.width,ae.height),I.push(createImageBitmap(ae).then(mi=>{ct.push({data:mi,mipLevel:_,targetOrigin:{x:0,y:0,z:De}})}))}return await Promise.all(I),ct}).flat(),R=(await Promise.all(T)).flat();d.width=x,d.height=f,d.depth=h.length,d.copyFrom(...R),d.width=d.width*2;let C=d.native;d.width=d.width/2})(),c.data("cubeTextureSampler").createSampler();let g=s.vertexParameter.create(ve);g.create("position",xe),g.create("uv",Mt),g.create("normal",pt);let y=s.create(e);return y.primitiveCullMode="front",y.setParameter("animationSeconds",3),window.animationSpeed=h=>{y.setParameter("animationSeconds",h)},{pipeline:y,parameter:g,instanceCount:50*50*50,data:y.layout.withData(h=>{h.addGroup(m),h.addGroup(t),h.addGroup(c)})}},Gi=(o,e,t)=>{let i=new k(o,Vr).setup(d=>{d.vertexEntryPoint("vertex_main",new H(o).setup(g=>{g.buffer("position","index-step").withParameter("position",0,"float32","v4"),g.buffer("normal","vertex-step").withParameter("normal",1,"float32","v4")})),d.fragmentEntryPoint("fragment_main",g=>{g.addRenderTarget("main",0,"float32","v4")}),d.group(0,new M(o,"object").setup(g=>{g.binding(0,"transformationMatrix",D.Vertex).asBuffer(64,0,!0),g.binding(1,"color",D.Vertex).asBuffer(16,0,!0)})),d.group(1,t.layout)}).createRenderModule("vertex_main","fragment_main"),a=i.layout.getGroupLayout("object").create();a.data("transformationMatrix").createBuffer(3);let n=a.data("transformationMatrix").getRaw();n.write(new Float32Array(new V().setScale(1,1,1).setTranslation(2,-30,5).getMatrix(5).dataArray).buffer,0),n.write(new Float32Array(new V().setScale(1,1,1).setTranslation(0,-30,5).getMatrix(5).dataArray).buffer,64),n.write(new Float32Array(new V().setScale(1,1,1).setTranslation(-2,-30,5).getMatrix(5).dataArray).buffer,128),a.data("color").createBuffer(2);let s=a.data("color").getRaw(),m=s.size/2;s.write(new Float32Array([.89,.74,0,1]).buffer,0),s.write(new Float32Array([.92,.48,.14,1]).buffer,m);let l=i.vertexParameter.create(ve);l.create("position",xe),l.create("normal",pt);let c=i.create(e);return c.primitiveCullMode="front",[{pipeline:c,parameter:l,instanceCount:1,data:c.layout.withData(d=>{d.addGroup(a).withOffset("color",0).withOffset("transformationMatrix",0),d.addGroup(t)})},{pipeline:c,parameter:l,instanceCount:1,data:c.layout.withData(d=>{d.addGroup(a).withOffset("color",1).withOffset("transformationMatrix",1),d.addGroup(t)})},{pipeline:c,parameter:l,instanceCount:1,data:c.layout.withData(d=>{d.addGroup(a).withOffset("color",0).withOffset("transformationMatrix",2),d.addGroup(t)})}]},Li=(o,e,t)=>{let r=new k(o,Hr).setup(l=>{l.vertexEntryPoint("vertex_main",new H(o).setup(c=>{c.buffer("position","index-step").withParameter("position",0,"float32","v4"),c.buffer("uv","vertex-step").withParameter("uv",1,"float32","v2"),c.buffer("normal","vertex-step").withParameter("normal",2,"float32","v4")})),l.fragmentEntryPoint("fragment_main",c=>{c.addRenderTarget("main",0,"float32","v4")}),l.group(0,new M(o,"object").setup(c=>{c.binding(0,"transformationMatrix",D.Vertex).asBuffer(64)})),l.group(1,t.layout)}),i=r.createRenderModule("vertex_main","fragment_main"),a=r.layout.getGroupLayout("object").create();a.data("transformationMatrix").createBufferWithRawData(new Float32Array(new V().setScale(1,1,1).getMatrix(5).dataArray).buffer);let n=i.create(e);n.primitiveCullMode="front";let s=i.vertexParameter.create(ve);return s.create("position",xe),s.create("uv",Mt),s.create("normal",pt),{pipeline:n,parameter:s,instanceCount:3,data:n.layout.withData(l=>{l.addGroup(a),l.addGroup(t)})}},Ai=(o,e,t)=>{let r=new k(o,$r).setup(l=>{l.vertexEntryPoint("vertex_main",new H(o).setup(c=>{c.buffer("position","index-step").withParameter("position",0,"float32","v4")})),l.fragmentEntryPoint("fragment_main",c=>{c.addRenderTarget("main",0,"float32","v4")}),l.group(0,new M(o,"object").setup(c=>{c.binding(0,"cubeTextureSampler",D.Fragment).asSampler("filtering"),c.binding(1,"cubeMap",D.Fragment).asTexture("cube","rgba8unorm")})),l.group(1,t.layout)}),i=r.createRenderModule("vertex_main","fragment_main"),a=r.layout.getGroupLayout("object").create(),n=a.data("cubeMap").createTexture().texture;n.depth=6,(async()=>{let l=["/source/game_objects/skybox/right.jpg","/source/game_objects/skybox/left.jpg","/source/game_objects/skybox/top.jpg","/source/game_objects/skybox/bottom.jpg","/source/game_objects/skybox/front.jpg","/source/game_objects/skybox/back.jpg"],c=0,d=0,g=l.map(async h=>{let f=new Image;if(f.src=h,await f.decode(),(c===0||d===0)&&(d=f.naturalWidth,c=f.naturalHeight),c!==f.naturalHeight||d!==f.naturalWidth)throw new Error(`Texture image layers are not the same size. (${f.naturalWidth}, ${f.naturalHeight}) needs (${d}, ${c}).`);return createImageBitmap(f)}),y=await Promise.all(g);n.width=d,n.height=c,n.depth=l.length,n.copyFrom(...y)})(),a.data("cubeTextureSampler").createSampler();let s=i.vertexParameter.create(ve);s.create("position",xe);let m=i.create(e);return m.primitiveCullMode="back",m.depthConfig().enableWrite(!1).compareWith("always"),{pipeline:m,parameter:s,instanceCount:1,data:m.layout.withData(l=>{l.addGroup(a),l.addGroup(t)})}},Mi=(o,e,t)=>{let i=new k(o,qr).setup(g=>{g.vertexEntryPoint("vertex_main",new H(o).setup(y=>{y.buffer("position","index-step").withParameter("position",0,"float32","v4"),y.buffer("uv","vertex-step").withParameter("uv",1,"float32","v2"),y.buffer("normal","vertex-step").withParameter("normal",2,"float32","v4")})),g.fragmentEntryPoint("fragment_main",y=>{y.addRenderTarget("main",0,"float32","v4")}),g.group(0,new M(o,"object").setup(y=>{y.binding(0,"transformationMatrix",D.Vertex).asBuffer(64)})),g.group(1,t.layout),g.group(2,new M(o,"user").setup(y=>{y.binding(0,"videoTextureSampler",D.Fragment).asSampler("filtering"),y.binding(1,"videoTexture",D.Fragment).asTexture("2d","rgba8unorm")}))}).createRenderModule("vertex_main","fragment_main"),a=i.layout.getGroupLayout("object").create();a.data("transformationMatrix").createBufferWithRawData(new Float32Array(new V().addTranslation(-.5,-.5,100).setScale(15,8.4,0).getMatrix(5).dataArray).buffer);let n=i.layout.getGroupLayout("user").create(),s=n.data("videoTexture").createTexture().texture,m=document.createElement("video");m.preload="auto",m.loop=!0,m.muted=!0,m.src="/source/game_objects/video_canvas/earth.mp4",m.addEventListener("resize",()=>{s.height=Math.max(m.videoHeight,1),s.width=Math.max(m.videoWidth,1)}),m.play();let l=performance.now();o.addTickListener(()=>{if(m.readyState>1){let g=performance.now();createImageBitmap(m).then(y=>{g<l||(l=g,s.copyFrom(y))})}}),n.data("videoTextureSampler").createSampler();let c=i.vertexParameter.create(Jr);c.create("position",Zr),c.create("uv",Kr),c.create("normal",Qr);let d=i.create(e);return d.primitiveCullMode="none",d.depthConfig().enableWrite(!1),d.targetConfig("color").alphaBlend("add","one","one-minus-src-alpha").colorBlend("add","src-alpha","one-minus-src-alpha"),{pipeline:d,parameter:c,instanceCount:1,data:d.layout.withData(g=>{g.addGroup(a),g.addGroup(t),g.addGroup(n)})}},Ii=(o,e,t)=>{let i=new k(o,Nr).setup(T=>{T.parameter("animationSeconds",D.Vertex),T.vertexEntryPoint("vertex_main",new H(o).setup(R=>{R.buffer("position-uv","index-step").withParameter("position",0,"float32","v4").withParameter("uv",1,"float32","v2")})),T.fragmentEntryPoint("fragment_main",R=>{R.addRenderTarget("main",0,"float32","v4")}),T.computeEntryPoint("compute_main").size(64),T.group(0,new M(o,"object").setup(R=>{R.binding(0,"transformationMatrix",D.Vertex).asBuffer(64),R.binding(1,"particles",D.Vertex,1).asBuffer(0,48)})),T.group(1,t.layout),T.group(2,new M(o,"user").setup(R=>{R.binding(0,"textureSampler",D.Fragment).asSampler("filtering"),R.binding(1,"texture",D.Fragment).asTexture("2d","rgba8unorm")}))}),a=i.createRenderModule("vertex_main","fragment_main"),n=a.layout.getGroupLayout("object").create();n.data("particles").createBuffer(18e3),n.data("transformationMatrix").createBufferWithRawData(new Float32Array(new V().setScale(.02,.02,.02).getMatrix(5).dataArray).buffer);let s=i.layout.getGroupLayout("user").create(),m=s.data("texture").createTexture().texture;m.depth=6,(async()=>{let T=["/source/game_objects/leaf_particle/leaf.png"],R=0,C=0,ie=T.map(async F=>{let I=new Image;if(I.src=F,await I.decode(),(R===0||C===0)&&(C=I.naturalWidth,R=I.naturalHeight),R!==I.naturalHeight||C!==I.naturalWidth)throw new Error(`Texture image layers are not the same size. (${I.naturalWidth}, ${I.naturalHeight}) needs (${C}, ${R}).`);return createImageBitmap(I)}),De=await Promise.all(ie);m.width=C,m.height=R,m.depth=T.length,m.copyFrom(...De)})(),s.data("textureSampler").createSampler();let l=a.vertexParameter.create(It);l.create("position-uv",ri);let c=a.create(e);c.primitiveCullMode="none",c.depthConfig().enableWrite(!0).compareWith("less"),c.targetConfig("color").alphaBlend("add","one","one-minus-src-alpha").colorBlend("add","src-alpha","one-minus-src-alpha");let d=new L(o,4*4).initialData(new Uint32Array([It.length,0,0,0]).buffer),g={pipeline:c,parameter:l,instanceCount:0,data:c.layout.withData(T=>{T.addGroup(s),T.addGroup(t),T.addGroup(n)}),indirectBuffer:d},h=new k(o,Wr).setup(T=>{T.parameter("animationSeconds",D.Vertex),T.computeEntryPoint("compute_main").size(64),T.group(0,new M(o,"object").setup(R=>{R.binding(0,"particles",D.Compute,4).asBuffer(0,48),R.binding(1,"indirect",D.Compute,4).asBuffer(16)})),T.group(1,t.layout)}).createComputeModule("compute_main"),f=new le(o,h);f.setParameter("animationSeconds",30);let x=h.layout.getGroupLayout("object").create();x.data("particles").set(n.data("particles").getRaw()),x.data("indirect").set(d);let z={pipeline:f,data:f.layout.withData(T=>{T.addGroup(x),T.addGroup(t)}),dimensions:{x:Math.ceil(18e3/(h.workGroupSizeX*h.workGroupSizeY*h.workGroupSizeZ)),y:1,z:1}};return[g,z]},Fi=o=>{let t=new M(o,"world").setup(a=>{a.binding(0,"camera",D.Vertex|D.Compute).asBuffer(464),a.binding(1,"timestamp",D.Vertex|D.Fragment|D.Compute).asBuffer(8),a.binding(2,"ambientLight",D.Fragment).asBuffer(16),a.binding(3,"pointLights",D.Fragment|D.Vertex,1).asBuffer(0,48),a.binding(4,"debugValue",D.Fragment|D.Compute,4).asBuffer(4)}).create();t.data("camera").createBuffer();let r=new ot;r.setColor(.3,.3,.3),t.data("ambientLight").createBufferWithRawData(new Float32Array(r.data).buffer),t.data("pointLights").createBufferWithRawData(new Float32Array([1,1,1,1,1,0,0,1,200,0,0,0,10,10,10,1,0,0,1,1,200,0,0,0,-10,10,10,1,0,1,0,1,200,0,0,0]).buffer),t.data("timestamp").createBuffer(),t.data("debugValue").createBuffer();let i=t.data("debugValue").getRaw();return window.debugBuffer=()=>{i.read(0,4).then(a=>{console.log(new Float32Array(a))})},t};(async()=>{let o=await Ue.request("high-performance",{features:[{name:"timestamp-query",required:!0}]}),e=new nt(o,document.getElementById("canvas")),t=new Ye(o,!0).setup(x=>{x.addColor("color",0,"bgra8unorm",!0,{r:0,g:1,b:0,a:0}),x.addDepthStencil("depth24plus",!0,1)}),r=t.create();r.setResolveCanvas("color",e),(()=>{let x=document.querySelector(".canvas-wrapper");new ResizeObserver(()=>{let z=Math.max(0,x.clientHeight-20),T=Math.max(x.clientWidth-20,0);r.resize(z,T)}).observe(x)})();let i=new mt;i.aspectRatio=r.width/r.height,i.angleOfView=72,i.near=.1,i.far=Number.MAX_SAFE_INTEGER,r.addInvalidationListener(()=>{i.aspectRatio=r.width/r.height},"Resize");let a=new lt(i);a.transformation.setTranslation(0,0,-4);let n=Fi(o),s=n.data("timestamp").getRaw(),[m,l]=Ii(o,t,n),c=[Ai(o,t,n),Bi(o,t,n),Li(o,t,n),Mi(o,t,n),...Gi(o,t,n),m],d=[l];ai(e.canvas,a,n.data("camera").getRaw());let g=document.getElementById("fpsCounter"),y=0,h=0,f=x=>{o.processTick();let z=1e3/(x-y);h=(1-.05)*h+.05*z,s.write(new Float32Array([x/1e3,(x-y)/1e3]).buffer,0),y=x,o.execute(T=>{T.computePass(R=>{for(let C of d)R.computeDirect(C.pipeline,C.data,C.dimensions.x,C.dimensions.y,C.dimensions.z)}),T.renderPass(r,R=>{for(let C of c)C.indirectBuffer?R.drawIndirect(C.pipeline,C.parameter,C.data,C.indirectBuffer):R.drawDirect(C.pipeline,C.parameter,C.data,C.instanceCount)})}),ni(z,r.width),g.textContent=h.toFixed(0),requestAnimationFrame(f)};requestAnimationFrame(f)})()});(()=>{let o=new WebSocket("ws://127.0.0.1:8088");o.addEventListener("open",()=>{console.log("Refresh connection established")}),o.addEventListener("message",e=>{console.log("Bundle finished. Start refresh"),e.data==="REFRESH"&&window.location.reload()})})();Promise.resolve().then(()=>si());
//# sourceMappingURL=page.js.map
